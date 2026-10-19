import { Prisma, SyncStatus } from "@prisma/client";
import { env } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";
import { negoPlusClient } from "./negoplus.js";

let syncing = false;

export async function synchronizeCatalog() {
  if (syncing) throw new Error("Ya hay una sincronización de catálogo en curso");
  syncing = true;
  let claimed = false;
  let runId: string | undefined;
  try {
    await prisma.syncLock.upsert({ where: { id: "catalog" }, create: { id: "catalog", lockedUntil: new Date(0) }, update: {} });
    const claim = await prisma.syncLock.updateMany({ where: { id: "catalog", lockedUntil: { lt: new Date() } }, data: { lockedUntil: new Date(Date.now() + 30 * 60_000) } });
    if (claim.count !== 1) throw new Error("Ya hay una sincronización de catálogo en otro proceso");
    claimed = true;
    const run = await prisma.syncRun.create({ data: { branchId: env.NEGOPLUS_BRANCH_ID } });
    runId = run.id;
    const [categories, products] = await Promise.all([negoPlusClient.getCategories(), negoPlusClient.getProducts()]);
    // Empty complete feeds are unsafe: preserve the last known valid catalog.
    if (!categories.length || !products.length) throw new Error("Respuesta vacía de NegoPlus; catálogo conservado");

    await prisma.$transaction(async (tx) => {
      for (const category of categories) {
        await tx.category.upsert({
          where: { externalId_branchId: { externalId: category.id, branchId: env.NEGOPLUS_BRANCH_ID } },
          create: { externalId: category.id, branchId: env.NEGOPLUS_BRANCH_ID, name: category.nombre, description: category.descripcion ?? null },
          update: { name: category.nombre, description: category.descripcion ?? null, active: true, syncedAt: new Date() },
        });
      }
      const localCategories = await tx.category.findMany({ where: { branchId: env.NEGOPLUS_BRANCH_ID }, select: { id: true, externalId: true } });
      const categoriesByExternalId = new Map(localCategories.map((category) => [category.externalId, category.id]));

      for (const item of products) {
        const price = new Prisma.Decimal(item.precio);
        const existing = await tx.product.findUnique({ where: { externalId_branchId: { externalId: item.id, branchId: env.NEGOPLUS_BRANCH_ID } } });
        const product = await tx.product.upsert({
          where: { externalId_branchId: { externalId: item.id, branchId: env.NEGOPLUS_BRANCH_ID } },
          create: { externalId: item.id, branchId: env.NEGOPLUS_BRANCH_ID, code: item.codigo ?? null, name: item.descripcion, menuDescription: item.descripcion_carta ?? null, longDescription: item.descripcion_larga ?? null, price, sourceCategoryId: item.rubro_id ?? null, categoryId: item.rubro_id ? categoriesByExternalId.get(item.rubro_id) ?? null : null },
          update: { code: item.codigo ?? null, name: item.descripcion, menuDescription: item.descripcion_carta ?? null, longDescription: item.descripcion_larga ?? null, price, sourceCategoryId: item.rubro_id ?? null, categoryId: item.rubro_id ? categoriesByExternalId.get(item.rubro_id) ?? null : null, active: true, lastValidSyncAt: new Date() },
        });
        if (!existing || !existing.price.equals(price)) {
          const isPriceDecrease = Boolean(existing && price.lessThan(existing.price));
          const reductionPercent = isPriceDecrease ? existing!.price.minus(price).dividedBy(existing!.price).mul(100) : null;
          await tx.priceHistory.create({ data: { productId: product.id, price, previousPrice: existing?.price, isPriceDecrease, reductionPercent, syncRunId: run.id } });
        }
        const groupIds: number[] = [];
        for (const group of item.grupos) {
          groupIds.push(group.id);
          const savedGroup = await tx.optionGroup.upsert({
            where: { productId_externalId: { productId: product.id, externalId: group.id } },
            create: { productId: product.id, externalId: group.id, name: group.nombre, required: group.obligatorio === 1 || group.obligatorio === true },
            update: { name: group.nombre, required: group.obligatorio === 1 || group.obligatorio === true },
          });
          const variantIds: number[] = [];
          for (const variant of group.variantes) {
            variantIds.push(variant.id);
            await tx.productVariant.upsert({
            where: { optionGroupId_externalId: { optionGroupId: savedGroup.id, externalId: variant.id } },
            create: { optionGroupId: savedGroup.id, externalId: variant.id, name: variant.nombre, priceDelta: new Prisma.Decimal(variant.precio) },
            update: { name: variant.nombre, priceDelta: new Prisma.Decimal(variant.precio) },
            });
          }
          await tx.productVariant.deleteMany({ where: { optionGroupId: savedGroup.id, externalId: { notIn: variantIds } } });
        }
        await tx.optionGroup.deleteMany({ where: { productId: product.id, externalId: { notIn: groupIds } } });
      }
    });
    return prisma.syncRun.update({ where: { id: run.id }, data: { status: SyncStatus.SUCCESS, completedAt: new Date(), categoryCount: categories.length, productCount: products.length } });
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : "Error desconocido";
    if (runId) await prisma.syncRun.update({ where: { id: runId }, data: { status: SyncStatus.FAILED, completedAt: new Date(), errorCode: "CATALOG_SYNC_FAILED", errorMessage: message } });
    throw error;
  } finally {
    syncing = false;
    if (claimed) await prisma.syncLock.update({ where: { id: "catalog" }, data: { lockedUntil: new Date(0) } }).catch(() => undefined);
  }
}
