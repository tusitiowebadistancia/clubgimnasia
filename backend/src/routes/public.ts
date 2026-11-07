import { Router } from "express";
import { z } from "zod";
import { HttpError } from "../lib/http.js";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { getEffectiveTheme, getOperationalStatus } from "../modules/hours/status.js";
import { isPromotionStillValid } from "../modules/promotions/service.js";
import { createOrder, OrderIdempotencyConflictError, OrderPriceConflictError, OrderValidationError } from "../modules/orders/service.js";

export const publicRouter = Router();
const productInclude = { category: true, optionGroups: { include: { variants: true } }, priceHistory: { orderBy: { observedAt: "desc" as const }, take: 2 } };
const orderRequest = z.object({
  idempotencyKey: z.string().uuid(),
  venue: z.object({ qr: z.string().min(20).max(128).optional(), mesa: z.string().trim().min(1).max(40).optional() }).strict().refine((value) => Boolean(value.qr || value.mesa), "Ubicación requerida"),
  items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().positive().max(100), expectedUnitPrice: z.union([z.string(), z.number()]) }).strict()).min(1).max(30),
}).strict();

function orderResponse(order: Awaited<ReturnType<typeof createOrder>>) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    currency: order.currency,
    subtotal: order.subtotal,
    total: order.total,
    items: order.items.map((item) => ({ productId: item.productId, productName: item.productName, unitPrice: item.unitPrice, quantity: item.quantity, lineTotal: item.lineTotal })),
  };
}

publicRouter.get("/categories", async (_req, res) => res.json(await prisma.category.findMany({ where: { active: true }, orderBy: { name: "asc" } })));
publicRouter.get("/products", async (_req, res) => res.json(await prisma.product.findMany({ where: { active: true }, include: productInclude, orderBy: { name: "asc" } })));
publicRouter.get("/menu", async (_req, res) => {
  const [config, categories] = await Promise.all([prisma.appConfig.findUnique({ where: { id: "default" } }), prisma.category.findMany({ where: { active: true }, include: { products: { where: { active: true }, include: productInclude, orderBy: { name: "asc" } } }, orderBy: { name: "asc" } })]);
  res.json({ categories, uncategorized: await prisma.product.findMany({ where: { active: true, categoryId: null }, include: productInclude }), showObservedDiscounts: config?.showObservedDiscounts ?? false });
});
publicRouter.post("/orders", async (req, res) => {
  const input = orderRequest.parse(req.body);
  try {
    const order = await createOrder({ ...input, branchId: env.NEGOPLUS_BRANCH_ID });
    res.status(201).json(orderResponse(order));
  } catch (error) {
    if (error instanceof OrderIdempotencyConflictError) throw new HttpError(409, error.message);
    if (error instanceof OrderPriceConflictError) throw new HttpError(409, error.message);
    if (error instanceof OrderValidationError) throw new HttpError(422, error.message);
    throw error;
  }
});
publicRouter.get("/config", async (_req, res) => res.json(await prisma.appConfig.findUnique({ where: { id: "default" } })));
publicRouter.get("/hours", async (_req, res) => res.json(await prisma.businessHours.findMany({ orderBy: { dayOfWeek: "asc" } })));
publicRouter.get("/promotions", async (req, res) => { const placement = z.enum(["HOME", "MENU"]).parse(req.query.placement); const config = await prisma.offerConfig.findUnique({ where: { id: "default" } }); if (placement === "HOME" && !config?.showHomePromotions) return res.json([]); const maxAgeHours = config?.maxObservationAgeHours ?? 72; const promotions = await prisma.promotion.findMany({ where: { status: "APPROVED", placements: { has: placement } }, include: { product: true } }); res.json(promotions.filter((promotion) => isPromotionStillValid({ active: promotion.product.active, officialPrice: promotion.product.price, approvedPrice: promotion.currentPrice, previousObservedAt: promotion.previousObservedAt, maxAgeHours, expiresAt: promotion.expiresAt })).map((promotion) => ({ promotionId: promotion.id, productId: promotion.productId, name: promotion.product.name, previousPrice: promotion.previousPrice, currentPrice: promotion.product.price, reductionPercent: promotion.previousPrice.minus(promotion.product.price).dividedBy(promotion.previousPrice).mul(100), placement, expiresAt: promotion.expiresAt }))); });
publicRouter.get("/operation", async (_req, res) => {
  const [config, hours] = await Promise.all([prisma.appConfig.findUnique({ where: { id: "default" } }), prisma.businessHours.findMany({ orderBy: { dayOfWeek: "asc" } })]);
  const status = getOperationalStatus(hours);
  const themeMode = config?.themeMode ?? "AUTOMATIC";
  res.json({ hours, ...status, themeMode, effectiveTheme: getEffectiveTheme(themeMode, status.isOpen), updatedAt: config?.updatedAt ?? null });
});
const venueResolveSchema = z.object({ qr: z.string().min(20).max(128).optional(), mesa: z.string().trim().max(40).optional() }).refine((value) => Boolean(value.qr || value.mesa), "Ubicación requerida");
publicRouter.get("/venues/resolve", async (req, res) => {
  const query = venueResolveSchema.parse(req.query);
  if (query.qr) {
    const qr = await prisma.qrIdentifier.findFirst({ where: { token: query.qr, active: true, table: { active: true } }, include: { table: { select: { code: true, label: true, area: true } } } });
    if (!qr?.table) throw new HttpError(404, "Ubicación no disponible");
    return res.json({ ...qr.table, legacy: false });
  }
  const venue = await prisma.venueTable.findFirst({ where: { code: query.mesa?.toUpperCase(), active: true, qr: { is: { active: true } } }, select: { code: true, label: true, area: true } });
  if (!venue) throw new HttpError(404, "Ubicación no disponible");
  res.json({ ...venue, legacy: /^(?:[1-9]|1\d|20)$/.test(venue.code) });
});
publicRouter.get("/advertising", async (_req, res) => {
  const config = await prisma.campaignConfig.findUnique({ where: { id: "default" } });
  if (!config || config.activeCampaign === "NONE") return res.json({ campaign: "NONE", videos: [] });
  const videos = await prisma.campaignVideo.findMany({ where: { campaign: config.activeCampaign, active: true }, select: { id: true, desktopUrl: true, mobileUrl: true, posterUrl: true, placements: { select: { placement: true, active: true, sortOrder: true } } } });
  const placements = videos.flatMap((video) => video.placements.filter(({ active }) => active).map(({ placement, sortOrder }) => ({ id: video.id, placement, sortOrder, desktopUrl: video.desktopUrl, mobileUrl: video.mobileUrl, posterUrl: video.posterUrl }))).sort((left, right) => left.placement.localeCompare(right.placement) || left.sortOrder - right.sortOrder);
  res.json({ campaign: config.activeCampaign, videos: placements });
});
