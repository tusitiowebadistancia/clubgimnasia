import { Prisma, SyncStatus } from "@prisma/client";
import { env } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";
import { acquireCatalogLock, CATALOG_LOCK_LEASE_MS, releaseCatalogLock, renewCatalogLock } from "./lock.js";
import { negoPlusClient } from "./negoplus.js";
import { revalidateApprovedPromotions } from "../promotions/service.js";

let syncing = false;
const catalogTransactionOptions = { maxWait: 10_000, timeout: 15_000 };

export function getPriceChange(previousPrice: Prisma.Decimal | null, price: Prisma.Decimal) {
  const isPriceDecrease = Boolean(previousPrice && price.lessThan(previousPrice));
  return {
    isPriceDecrease,
    reductionPercent: isPriceDecrease ? previousPrice!.minus(price).dividedBy(previousPrice!).mul(100) : null,
  };
}

export async function synchronizeCatalog(dependencies?: { prisma?: typeof prisma; negoPlusClient?: typeof negoPlusClient }) {
  const database = dependencies?.prisma ?? prisma;
  const client = dependencies?.negoPlusClient ?? negoPlusClient;
  if (syncing) throw new Error("Ya hay una sincronización de catálogo en curso");
  syncing = true;
  let ownerToken: string | null = null;
  let runId: string | undefined;
  let leaseError: Error | undefined;
  let renewalTimer: NodeJS.Timeout | undefined;
  const assertLease = () => {
    if (leaseError) throw leaseError;
  };
  try {
    ownerToken = await acquireCatalogLock(database);
    if (!ownerToken) throw new Error("Ya hay una sincronización de catálogo en otro proceso");
    renewalTimer = setInterval(() => {
      renewCatalogLock(database, ownerToken!).then((renewed) => {
        if (!renewed) leaseError = new Error("Se perdió el bloqueo de sincronización de catálogo");
      }).catch(() => {
        leaseError = new Error("No se pudo renovar el bloqueo de sincronización de catálogo");
      });
    }, CATALOG_LOCK_LEASE_MS / 3);
    renewalTimer.unref();
    const run = await database.syncRun.create({ data: { branchId: env.NEGOPLUS_BRANCH_ID } });
    runId = run.id;
    const [categories, products] = await Promise.all([client.getCategories(), client.getProducts()]);
    // Empty complete feeds are unsafe: preserve the last known valid catalog.
    if (!categories.length || !products.length) throw new Error("Respuesta vacía de NegoPlus; catálogo conservado");
    assertLease();

    await database.$transaction(async (tx) => {
      for (const category of categories) {
        assertLease();
        await tx.category.upsert({
          where: { externalId_branchId: { externalId: category.id, branchId: env.NEGOPLUS_BRANCH_ID } },
          create: { externalId: category.id, branchId: env.NEGOPLUS_BRANCH_ID, name: category.nombre, description: category.descripcion ?? null },
          update: { name: category.nombre, description: category.descripcion ?? null, active: true, syncedAt: new Date() },
        });
      }
    }, catalogTransactionOptions);
    const localCategories = await database.category.findMany({ where: { branchId: env.NEGOPLUS_BRANCH_ID }, select: { id: true, externalId: true } });
    const categoriesByExternalId = new Map(localCategories.map((category) => [category.externalId, category.id]));

    for (const item of products) {
      assertLease();
      await database.$transaction(async (tx) => {
        const price = new Prisma.Decimal(item.precio);
        const existing = await tx.product.findUnique({ where: { externalId_branchId: { externalId: item.id, branchId: env.NEGOPLUS_BRANCH_ID } } });
        const product = await tx.product.upsert({
          where: { externalId_branchId: { externalId: item.id, branchId: env.NEGOPLUS_BRANCH_ID } },
          create: { externalId: item.id, branchId: env.NEGOPLUS_BRANCH_ID, code: item.codigo ?? null, name: item.descripcion, menuDescription: item.descripcion_carta ?? null, longDescription: item.descripcion_larga ?? null, price, sourceCategoryId: item.rubro_id ?? null, categoryId: item.rubro_id ? categoriesByExternalId.get(item.rubro_id) ?? null : null },
          update: { code: item.codigo ?? null, name: item.descripcion, menuDescription: item.descripcion_carta ?? null, longDescription: item.descripcion_larga ?? null, price, sourceCategoryId: item.rubro_id ?? null, categoryId: item.rubro_id ? categoriesByExternalId.get(item.rubro_id) ?? null : null, active: true, lastValidSyncAt: new Date() },
        });
        if (!existing || !existing.price.equals(price)) {
          const { isPriceDecrease, reductionPercent } = getPriceChange(existing?.price ?? null, price);
          await tx.priceHistory.create({ data: { productId: product.id, price, previousPrice: existing?.price, isPriceDecrease, reductionPercent, syncRunId: run.id } });
        }
        const groupIds: number[] = [];
        for (const group of item.grupos) {
          assertLease();
          groupIds.push(group.id);
          const savedGroup = await tx.optionGroup.upsert({
            where: { productId_externalId: { productId: product.id, externalId: group.id } },
            create: { productId: product.id, externalId: group.id, name: group.nombre, required: group.obligatorio === 1 || group.obligatorio === true },
            update: { name: group.nombre, required: group.obligatorio === 1 || group.obligatorio === true },
          });
          const variantIds: number[] = [];
          for (const variant of group.variantes) {
            assertLease();
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
      }, catalogTransactionOptions);
    }
    try {
      await revalidateApprovedPromotions(database);
      return database.syncRun.update({ where: { id: run.id }, data: { status: SyncStatus.SUCCESS, completedAt: new Date(), categoryCount: categories.length, productCount: products.length } });
    } catch (error) {
      const message = error instanceof Error ? error.message.slice(0, 500) : "Error desconocido";
      return database.syncRun.update({ where: { id: run.id }, data: { status: SyncStatus.PARTIAL, completedAt: new Date(), categoryCount: categories.length, productCount: products.length, errorCode: "PROMOTION_REVALIDATION_FAILED", errorMessage: message } });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : "Error desconocido";
    if (runId) await database.syncRun.update({ where: { id: runId }, data: { status: SyncStatus.FAILED, completedAt: new Date(), errorCode: "CATALOG_SYNC_FAILED", errorMessage: message } });
    throw error;
  } finally {
    syncing = false;
    if (renewalTimer) clearInterval(renewalTimer);
    if (ownerToken) await releaseCatalogLock(database, ownerToken).catch(() => undefined);
  }
}
