import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

export type PriceObservation = { price: Prisma.Decimal; observedAt: Date; branchId: number };
export type DetectableProduct = { id: string; branchId: number; active: boolean; price: Prisma.Decimal; history: PriceObservation[] };

export function detectReduction(product: DetectableProduct, maxAgeHours: number, now = new Date()) {
  if (!product.active || product.price.lessThanOrEqualTo(0)) return null;
  const cutoff = new Date(now.getTime() - maxAgeHours * 3_600_000);
  const candidates = product.history.filter((item) => item.branchId === product.branchId && item.observedAt >= cutoff && item.price.greaterThan(0) && item.price.greaterThan(product.price));
  const reference = candidates.sort((left, right) => right.observedAt.getTime() - left.observedAt.getTime())[0];
  if (!reference) return null;
  const difference = reference.price.minus(product.price);
  return { productId: product.id, previousPrice: reference.price, currentPrice: product.price, difference, reductionPercent: difference.dividedBy(reference.price).mul(100), observedAt: reference.observedAt };
}

export function isPromotionStillValid(input: { active: boolean; officialPrice: Prisma.Decimal; approvedPrice: Prisma.Decimal; previousObservedAt: Date; maxAgeHours: number; expiresAt?: Date | null }, now = new Date()) {
  return input.active && input.officialPrice.greaterThan(0) && input.officialPrice.equals(input.approvedPrice) && input.previousObservedAt >= new Date(now.getTime() - input.maxAgeHours * 3_600_000) && (!input.expiresAt || input.expiresAt > now);
}

export async function revalidateApprovedPromotions(database = prisma, now = new Date()) {
  const config = await database.offerConfig.findUnique({ where: { id: "default" } });
  const maxAgeHours = config?.maxObservationAgeHours ?? 72;
  const promotions = await database.promotion.findMany({ where: { status: "APPROVED" }, include: { product: true } });
  const suspended: string[] = [];
  for (const promotion of promotions) {
    const reason = !promotion.product.active ? "PRODUCT_INACTIVE" : promotion.product.price.lessThanOrEqualTo(0) ? "INVALID_OFFICIAL_PRICE" : !promotion.product.price.equals(promotion.currentPrice) ? "PRICE_CHANGED" : promotion.expiresAt && promotion.expiresAt <= now ? "PROMOTION_EXPIRED" : promotion.previousObservedAt < new Date(now.getTime() - maxAgeHours * 3_600_000) ? "HISTORICAL_REFERENCE_EXPIRED" : null;
    if (reason) await database.$transaction(async tx => { const changed = await tx.promotion.updateMany({ where: { id: promotion.id, status: "APPROVED" }, data: { status: "SUSPENDED" } }); if (changed.count) { await tx.promotionSystemEvent.create({ data: { promotionId: promotion.id, eventType: reason, reason } }); suspended.push(promotion.id); } });
  }
  return { suspended };
}

export async function getPromotionCandidates(database = prisma, maxAgeHours = 72) {
  const products = await database.product.findMany({ where: { active: true, price: { gt: 0 } }, include: { priceHistory: { where: { isPriceDecrease: true, previousPrice: { gt: 0 }, price: { gt: 0 } }, orderBy: { observedAt: "desc" } } } });
  return products.flatMap((product) => {
    const history = product.priceHistory.filter((item) => item.previousPrice && item.previousPrice.greaterThan(item.price)).map((item) => ({ price: item.previousPrice!, observedAt: item.observedAt, branchId: product.branchId }));
    const candidate = detectReduction({ id: product.id, branchId: product.branchId, active: product.active, price: product.price, history }, maxAgeHours);
    return candidate ? [{ id: product.id, name: product.name, branchId: product.branchId, candidate }] : [];
  });
}
