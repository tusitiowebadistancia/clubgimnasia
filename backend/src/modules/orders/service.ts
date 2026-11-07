import { createHash, randomUUID } from "node:crypto";
import { OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

export type CreateOrderInput = {
  idempotencyKey: string;
  branchId: number;
  venue: { qr?: string; mesa?: string };
  items: Array<{ productId: string; quantity: number; expectedUnitPrice?: string | number }>;
};

export class OrderValidationError extends Error {}
export class OrderIdempotencyConflictError extends Error {}
export class OrderPriceConflictError extends Error {}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function orderNumber() {
  return `ORD-${Date.now().toString(36).toUpperCase()}-${randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`;
}

function assertInput(input: CreateOrderInput) {
  if (!uuidPattern.test(input.idempotencyKey)) throw new OrderValidationError("Clave de idempotencia inválida");
  if (!Number.isInteger(input.branchId) || input.branchId <= 0) throw new OrderValidationError("Sucursal inválida");
  if (!input.venue || (!input.venue.qr && !input.venue.mesa)) throw new OrderValidationError("Ubicación requerida");
  if (!Array.isArray(input.items) || !input.items.length) throw new OrderValidationError("El pedido debe incluir productos");

  const productIds = new Set<string>();
  for (const item of input.items) {
    if (!item.productId || !Number.isInteger(item.quantity) || item.quantity <= 0 || (item.expectedUnitPrice !== undefined && (!new Prisma.Decimal(item.expectedUnitPrice).isFinite() || new Prisma.Decimal(item.expectedUnitPrice).lessThanOrEqualTo(0)))) throw new OrderValidationError("Producto o cantidad inválidos");
    if (productIds.has(item.productId)) throw new OrderValidationError("Un producto no puede repetirse en el pedido");
    productIds.add(item.productId);
  }
}

function fingerprint(branchId: number, venueTableId: string, items: CreateOrderInput["items"]) {
  const canonical = JSON.stringify({ branchId, venueTableId, items: items.map(({ productId, quantity, expectedUnitPrice }) => ({ productId, quantity, ...(expectedUnitPrice !== undefined ? { expectedUnitPrice: new Prisma.Decimal(expectedUnitPrice).toFixed(2) } : {}) })).sort((left, right) => left.productId.localeCompare(right.productId)) });
  return createHash("sha256").update(canonical).digest("hex");
}

function uniqueConstraintTargets(error: Prisma.PrismaClientKnownRequestError) {
  const target = error.meta?.target;
  return Array.isArray(target) ? target : typeof target === "string" ? [target] : [];
}

function isUniqueConstraint(error: unknown, field: string) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" && uniqueConstraintTargets(error).includes(field);
}

export async function createOrder(input: CreateOrderInput, dependencies?: { prisma?: typeof prisma }) {
  assertInput(input);
  const database = dependencies?.prisma ?? prisma;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await database.$transaction(async (tx) => {
        let table;
        if (input.venue.qr) {
          const qr = await tx.qrIdentifier.findFirst({ where: { token: input.venue.qr, active: true, table: { is: { active: true } } }, include: { table: true } });
          table = qr?.table;
        } else {
          table = await tx.venueTable.findFirst({ where: { code: input.venue.mesa?.toUpperCase(), active: true, qr: { is: { active: true } } } });
        }
        if (!table) throw new OrderValidationError("Ubicación no disponible");
        const idempotencyFingerprint = fingerprint(input.branchId, table.id, input.items);
        const existing = await tx.order.findUnique({ where: { idempotencyKey: input.idempotencyKey }, include: { items: { orderBy: { id: "asc" } } } });
        if (existing) {
          if (existing.idempotencyFingerprint !== idempotencyFingerprint) throw new OrderIdempotencyConflictError("La clave de idempotencia fue reutilizada con otro pedido");
          return existing;
        }

        const productIds = input.items.map((item) => item.productId);
        await tx.$queryRaw`SELECT "id" FROM "Product" WHERE "id" IN (${Prisma.join(productIds)}) FOR UPDATE`;
        const products = await tx.product.findMany({ where: { id: { in: productIds } } });
        const productsById = new Map(products.map((product) => [product.id, product]));
        const items = input.items.map((item) => {
          const product = productsById.get(item.productId);
          if (!product) throw new OrderValidationError("Producto no disponible");
          if (product.branchId !== input.branchId) throw new OrderValidationError("El producto no pertenece a la sucursal");
          if (!product.active) throw new OrderValidationError("Producto inactivo");
          if (!product.price.isFinite() || product.price.lessThanOrEqualTo(0)) throw new OrderValidationError("Precio oficial inválido");
          if (item.expectedUnitPrice !== undefined && !product.price.equals(new Prisma.Decimal(item.expectedUnitPrice))) throw new OrderPriceConflictError("Los precios oficiales cambiaron");
          const lineTotal = product.price.mul(item.quantity);
          return { productId: product.id, productName: product.name, unitPrice: product.price, quantity: item.quantity, lineTotal };
        });
        const subtotal = items.reduce((total, item) => total.plus(item.lineTotal), new Prisma.Decimal(0));

        return tx.order.create({
          data: {
            orderNumber: orderNumber(),
            idempotencyKey: input.idempotencyKey,
            idempotencyFingerprint,
            branchId: input.branchId,
            venueTableId: table.id,
            venueCode: table.code,
            venueLabel: table.label,
            status: OrderStatus.PENDING,
            currency: "ARS",
            subtotal,
            total: subtotal,
            items: { create: items },
          },
          include: { items: { orderBy: { id: "asc" } } },
        });
      });
    } catch (error) {
      if (isUniqueConstraint(error, "idempotencyKey")) {
        const existing = await database.order.findUnique({ where: { idempotencyKey: input.idempotencyKey }, include: { items: { orderBy: { id: "asc" } } } });
        if (!existing) continue;
        const venue = input.venue.qr
          ? await database.qrIdentifier.findFirst({ where: { token: input.venue.qr, active: true, table: { is: { active: true } } }, include: { table: true } })
          : null;
        const table = input.venue.qr ? venue?.table : await database.venueTable.findFirst({ where: { code: input.venue.mesa?.toUpperCase(), active: true, qr: { is: { active: true } } } });
        if (!table || existing.idempotencyFingerprint !== fingerprint(input.branchId, table.id, input.items)) throw new OrderIdempotencyConflictError("La clave de idempotencia fue reutilizada con otro pedido");
        return existing;
      }
      if (isUniqueConstraint(error, "orderNumber") && attempt < 2) continue;
      throw error;
    }
  }

  throw new Error("No se pudo generar un número de pedido único");
}
