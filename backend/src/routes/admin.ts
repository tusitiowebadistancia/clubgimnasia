import crypto from "node:crypto";
import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import { HttpError } from "../lib/http.js";
import { prisma } from "../lib/prisma.js";
import { requireAdmin, requireCsrf } from "../middleware/admin.js";
import { createCsrfToken, csrfCookieOptions, createSession, revokeSession, sessionCookieOptions } from "../modules/auth/service.js";
import { synchronizeCatalog } from "../modules/sync/service.js";

export const authRouter = Router();
const credentials = z.object({ email: z.string().email().max(254), password: z.string().min(12).max(256) });
function getCsrfToken(req: Request, res: Response) {
  const csrfToken = req.cookies?.[env.CSRF_COOKIE_NAME] ?? createCsrfToken();
  res.cookie(env.CSRF_COOKIE_NAME, csrfToken, csrfCookieOptions);
  return csrfToken;
}
authRouter.post("/login", async (req, res) => {
  const data = credentials.parse(req.body);
  const { token, admin } = await createSession(data.email, data.password);
  const csrf = createCsrfToken();
  res.cookie(env.SESSION_COOKIE_NAME, token, sessionCookieOptions);
  res.cookie(env.CSRF_COOKIE_NAME, csrf, csrfCookieOptions);
  res.json({ admin: { email: admin.email }, csrfToken: csrf });
});
authRouter.post("/logout", requireAdmin, requireCsrf, async (req, res) => { await revokeSession(req.cookies[env.SESSION_COOKIE_NAME]); res.clearCookie(env.SESSION_COOKIE_NAME, sessionCookieOptions); res.clearCookie(env.CSRF_COOKIE_NAME, sessionCookieOptions); res.status(204).end(); });
authRouter.get("/session", requireAdmin, (req, res) => res.json({ admin: { email: res.locals.admin.email }, csrfToken: getCsrfToken(req, res) }));

export const adminRouter = Router();
adminRouter.use(requireAdmin);
const configSchema = z.object({ publicName: z.string().max(120).nullable().optional(), publicDescription: z.string().max(1000).nullable().optional(), logoUrl: z.string().url().nullable().optional(), contactPhone: z.string().max(40).nullable().optional(), showObservedDiscounts: z.boolean().optional(), observedDiscountMaxAgeHours: z.number().int().min(1).max(720).optional(), themeMode: z.enum(["AUTOMATIC", "DARK", "LIGHT"]).optional() });
const hoursSchema = z.array(z.object({ dayOfWeek: z.number().int().min(0).max(6), opensAt: z.string().regex(/^\d{2}:\d{2}$/).nullable(), closesAt: z.string().regex(/^\d{2}:\d{2}$/).nullable(), closed: z.boolean() }).superRefine((value, context) => { if (!value.closed && (!value.opensAt || !value.closesAt)) context.addIssue({ code: z.ZodIssueCode.custom, message: "Los días abiertos requieren ambos horarios" }); })).length(7).superRefine((values, context) => { if (new Set(values.map((value) => value.dayOfWeek)).size !== 7) context.addIssue({ code: z.ZodIssueCode.custom, message: "Debe incluirse cada día una vez" }); });
const offerSchema = z.object({ enabled: z.boolean(), maxObservationAgeHours: z.number().int().min(1).max(720) });
const venueCode = z.string().trim().toUpperCase().regex(/^[A-Z][A-Z0-9_-]{0,39}$/, "Código público inválido");
const venueLabel = z.string().trim().min(1).max(80).refine((value) => !/[<>]/.test(value), "El nombre no puede contener HTML");
const venueCreateSchema = z.object({ code: venueCode, label: venueLabel, area: z.enum(["TABLE", "BAR"]), active: z.boolean().default(true) });
const venueUpdateSchema = z.object({ label: venueLabel, area: z.enum(["TABLE", "BAR"]), active: z.boolean() });
const ruleSchema = z.object({ productExternalId: z.number().int().positive(), complementaryExternalId: z.number().int().positive(), active: z.boolean() });
const campaignSchema = z.enum(["NONE", "YEAR_ROUND", "CHRISTMAS", "NEW_YEAR", "SUMMER"]);
const placementSchema = z.enum(["HOME_AFTER_SERVICES", "HOME_AFTER_PROMOS", "BOWLING_AFTER_INCLUDES", "BOWLING_AFTER_PROMOS", "POOL_AFTER_ENVIRONMENT", "POOL_AFTER_TOURNAMENTS", "EVENTS_AFTER_INCLUDES", "EVENTS_AFTER_PLANS", "CONTACT_AFTER_INFO", "CONTACT_AFTER_HOURS", "MENU_AFTER_INTRO", "MENU_QR_AFTER_GENERATOR", "BOWLING_RULES_AFTER_INTRO"]);
const safeText = z.string().trim().min(1).max(120).refine((value) => !/[<>]/.test(value), "El nombre no puede contener HTML");
const mp4Url = z.string().url().max(2048).refine((value) => { try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && url.pathname.toLowerCase().endsWith(".mp4"); } catch { return false; } }, "La URL debe apuntar a un archivo MP4 directo");
const posterUrl = z.string().url().max(2048).refine((value) => { if (!value) return true; try { return ["https:", "http:"].includes(new URL(value).protocol); } catch { return false; } }, "La URL de portada debe ser HTTP(S)").nullable().optional();
const campaignVideoSchema = z.object({ campaign: campaignSchema.exclude(["NONE"]), name: safeText, desktopUrl: mp4Url, mobileUrl: mp4Url, posterUrl, active: z.boolean(), placements: z.array(z.object({ placement: placementSchema, active: z.boolean().default(true), sortOrder: z.number().int().min(0).max(1000) })).min(1).max(13).superRefine((placements, context) => { const unique = new Set(placements.map(({ placement }) => placement)); if (unique.size !== placements.length) context.addIssue({ code: z.ZodIssueCode.custom, message: "No se puede repetir una ubicación" }); }) });
const audit = (req: any, action: string, entity: string, entityId?: string) => prisma.adminAuditLog.create({ data: { adminId: req.res.locals.admin.id, action, entity, entityId } });

adminRouter.get("/config", async (_req, res) => res.json(await prisma.appConfig.findUnique({ where: { id: "default" } })));
adminRouter.put("/config", requireCsrf, async (req, res) => { const value = await prisma.appConfig.upsert({ where: { id: "default" }, create: { id: "default", ...configSchema.parse(req.body) }, update: configSchema.parse(req.body) }); await audit(req, "UPDATE", "AppConfig", value.id); res.json(value); });
adminRouter.get("/hours", async (_req, res) => res.json(await prisma.businessHours.findMany({ orderBy: { dayOfWeek: "asc" } })));
adminRouter.put("/hours", requireCsrf, async (req, res) => { const values = hoursSchema.parse(req.body); await prisma.$transaction(values.map((value) => prisma.businessHours.upsert({ where: { dayOfWeek: value.dayOfWeek }, create: value, update: value }))); await audit(req, "UPDATE", "BusinessHours"); res.status(204).end(); });
adminRouter.get("/offers", async (_req, res) => res.json(await prisma.offerConfig.findUnique({ where: { id: "default" } })));
adminRouter.put("/offers", requireCsrf, async (req, res) => { const value = offerSchema.parse(req.body); const saved = await prisma.offerConfig.upsert({ where: { id: "default" }, create: { id: "default", ...value }, update: value }); await audit(req, "UPDATE", "OfferConfig"); res.json(saved); });
for (const [path, model, schema] of [["commercial-rules", "complementaryGoodRule", ruleSchema]] as const) {
  adminRouter.get(`/${path}`, async (_req, res) => res.json(await (prisma[model] as any).findMany()));
  adminRouter.post(`/${path}`, requireCsrf, async (req, res) => { const saved = await (prisma[model] as any).create({ data: schema.parse(req.body) }); await audit(req, "CREATE", model, saved.id); res.status(201).json(saved); });
}
const publicMenuUrl = (token: string) => `${env.PUBLIC_SITE_URL.replace(/\/$/, "")}/menu?qr=${encodeURIComponent(token)}`;
adminRouter.get("/venues", async (_req, res) => {
  const venues = await prisma.venueTable.findMany({ include: { qr: true }, orderBy: [{ area: "asc" }, { code: "asc" }] });
  res.json(venues.map((venue) => ({ ...venue, publicUrl: venue.qr ? publicMenuUrl(venue.qr.token) : null })));
});
adminRouter.post("/venues", requireCsrf, async (req, res) => {
  const input = venueCreateSchema.parse(req.body);
  const venue = await prisma.$transaction(async (tx) => {
    const created = await tx.venueTable.create({ data: input });
    const qr = await tx.qrIdentifier.create({ data: { tableId: created.id, token: crypto.randomBytes(24).toString("base64url") } });
    return { ...created, qr };
  });
  await audit(req, "CREATE", "VenueTable", venue.id);
  res.status(201).json({ ...venue, publicUrl: publicMenuUrl(venue.qr.token) });
});
adminRouter.put("/venues/:id", requireCsrf, async (req, res) => {
  const id = z.string().uuid().parse(req.params.id);
  const venue = await prisma.venueTable.update({ where: { id }, data: venueUpdateSchema.parse(req.body), include: { qr: true } });
  await audit(req, "UPDATE", "VenueTable", venue.id);
  res.json({ ...venue, publicUrl: venue.qr ? publicMenuUrl(venue.qr.token) : null });
});
adminRouter.put("/venues/:id/qr", requireCsrf, async (req, res) => {
  const id = z.string().uuid().parse(req.params.id);
  const active = z.boolean().parse(req.body?.active);
  await prisma.venueTable.findUniqueOrThrow({ where: { id }, select: { id: true } });
  const qr = await prisma.qrIdentifier.upsert({ where: { tableId: id }, create: { tableId: id, token: crypto.randomBytes(24).toString("base64url"), active }, update: { active } });
  await audit(req, "UPDATE", "QrIdentifier", qr.id);
  res.json({ ...qr, publicUrl: publicMenuUrl(qr.token) });
});
adminRouter.get("/campaigns", async (_req, res) => {
  const [config, videos] = await Promise.all([prisma.campaignConfig.findUnique({ where: { id: "default" } }), prisma.campaignVideo.findMany({ include: { placements: { orderBy: [{ placement: "asc" }, { sortOrder: "asc" }] } }, orderBy: { campaign: "asc" } })]);
  res.json({ activeCampaign: config?.activeCampaign ?? "NONE", videos });
});
adminRouter.put("/campaigns/active", requireCsrf, async (req, res) => {
  const activeCampaign = campaignSchema.parse(req.body?.activeCampaign);
  const config = await prisma.campaignConfig.upsert({ where: { id: "default" }, create: { id: "default", activeCampaign }, update: { activeCampaign } });
  await audit(req, "UPDATE", "CampaignConfig", config.id);
  res.json(config);
});
adminRouter.post("/campaigns/videos", requireCsrf, async (req, res) => {
  const input = campaignVideoSchema.parse(req.body);
  const video = await prisma.campaignVideo.create({ data: { campaign: input.campaign, name: input.name, desktopUrl: input.desktopUrl, mobileUrl: input.mobileUrl, posterUrl: input.posterUrl ?? null, active: input.active, placements: { create: input.placements } }, include: { placements: true } });
  await audit(req, "CREATE", "CampaignVideo", video.id);
  res.status(201).json(video);
});
adminRouter.put("/campaigns/videos/:id", requireCsrf, async (req, res) => {
  const id = z.string().uuid().parse(req.params.id);
  const input = campaignVideoSchema.parse(req.body);
  const video = await prisma.campaignVideo.update({ where: { id }, data: { campaign: input.campaign, name: input.name, desktopUrl: input.desktopUrl, mobileUrl: input.mobileUrl, posterUrl: input.posterUrl ?? null, active: input.active, placements: { deleteMany: {}, create: input.placements } }, include: { placements: true } });
  await audit(req, "UPDATE", "CampaignVideo", video.id);
  res.json(video);
});
adminRouter.delete("/campaigns/videos/:id", requireCsrf, async (req, res) => {
  const id = z.string().uuid().parse(req.params.id);
  await prisma.campaignVideo.delete({ where: { id } });
  await audit(req, "DELETE", "CampaignVideo", id);
  res.status(204).end();
});
const productQuerySchema = z.object({ query: z.string().max(120).optional(), categoryId: z.string().uuid().optional(), withoutCategory: z.enum(["true", "false"]).optional(), zeroPrice: z.enum(["true", "false"]).optional() });
const orderQuerySchema = z.object({ status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED", "CANCELLED"]).optional(), from: z.string().datetime().optional(), to: z.string().datetime().optional(), orderNumber: z.string().trim().min(1).max(80).optional(), mesa: z.string().trim().min(1).max(40).optional(), page: z.coerce.number().int().min(1).max(100_000).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20) }).strict().superRefine((value, context) => { if (value.from && value.to && new Date(value.from) > new Date(value.to)) context.addIssue({ code: z.ZodIssueCode.custom, message: "El rango de fechas es inválido", path: ["to"] }); });
const orderListSelect = { id: true, orderNumber: true, status: true, branchId: true, venueCode: true, venueLabel: true, currency: true, subtotal: true, total: true, createdAt: true, _count: { select: { items: true } } } as const;
const orderDetailSelect = { id: true, orderNumber: true, status: true, branchId: true, venueCode: true, venueLabel: true, currency: true, subtotal: true, total: true, createdAt: true, confirmedAt: true, cancelledAt: true, items: { select: { productId: true, productName: true, unitPrice: true, quantity: true, lineTotal: true }, orderBy: { id: "asc" as const } } } as const;
const orderStatusSchema = z.object({ status: z.enum(["CONFIRMED", "PREPARING", "READY", "DELIVERED", "CANCELLED"]) }).strict();
const orderStatusOrigins = { CONFIRMED: ["PENDING"], PREPARING: ["CONFIRMED"], READY: ["PREPARING"], DELIVERED: ["READY"], CANCELLED: ["PENDING", "CONFIRMED", "PREPARING", "READY"] } as const;
const orderStatusSelect = { id: true, orderNumber: true, status: true, confirmedAt: true, cancelledAt: true, updatedAt: true } as const;
adminRouter.get("/summary", async (_req, res) => {
  const [categories, products, withoutCategory, zeroPrice, optionGroups, variants, latestSync, failedSync] = await Promise.all([
    prisma.category.count({ where: { active: true, branchId: env.NEGOPLUS_BRANCH_ID } }), prisma.product.count({ where: { active: true, branchId: env.NEGOPLUS_BRANCH_ID } }), prisma.product.count({ where: { active: true, branchId: env.NEGOPLUS_BRANCH_ID, categoryId: null } }), prisma.product.count({ where: { active: true, branchId: env.NEGOPLUS_BRANCH_ID, price: 0 } }), prisma.optionGroup.count({ where: { product: { branchId: env.NEGOPLUS_BRANCH_ID } } }), prisma.productVariant.count({ where: { optionGroup: { product: { branchId: env.NEGOPLUS_BRANCH_ID } } } }), prisma.syncRun.findFirst({ where: { branchId: env.NEGOPLUS_BRANCH_ID }, orderBy: { startedAt: "desc" } }), prisma.syncRun.findFirst({ where: { branchId: env.NEGOPLUS_BRANCH_ID, status: "FAILED" }, orderBy: { startedAt: "desc" } }),
  ]);
  res.json({ categories, products, withoutCategory, zeroPrice, optionGroups, variants, latestSync, failedSync });
});
adminRouter.get("/products", async (req, res) => {
  const filters = productQuerySchema.parse(req.query);
  const where = {
    active: true, branchId: env.NEGOPLUS_BRANCH_ID,
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(filters.withoutCategory === "true" ? { categoryId: null } : {}),
    ...(filters.zeroPrice === "true" ? { price: 0 } : {}),
    ...(filters.query ? { OR: [{ name: { contains: filters.query, mode: "insensitive" as const } }, { code: { contains: filters.query, mode: "insensitive" as const } }] } : {}),
  };
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true, priceHistory: { orderBy: { observedAt: "desc" }, take: 5 } }, orderBy: { name: "asc" } }),
    prisma.category.findMany({ where: { active: true, branchId: env.NEGOPLUS_BRANCH_ID }, orderBy: { name: "asc" } }),
  ]);
  res.json({ products, categories });
});
adminRouter.get("/orders", async (req, res) => {
  const filters = orderQuerySchema.parse(req.query);
  const where = { ...(filters.status ? { status: filters.status } : {}), ...(filters.from || filters.to ? { createdAt: { ...(filters.from ? { gte: new Date(filters.from) } : {}), ...(filters.to ? { lte: new Date(filters.to) } : {}) } } : {}), ...(filters.orderNumber ? { orderNumber: { contains: filters.orderNumber, mode: "insensitive" as const } } : {}), ...(filters.mesa ? { venueCode: { contains: filters.mesa.toUpperCase(), mode: "insensitive" as const } } : {}) };
  const [orders, total] = await Promise.all([prisma.order.findMany({ where, select: orderListSelect, orderBy: { createdAt: "desc" }, skip: (filters.page - 1) * filters.pageSize, take: filters.pageSize }), prisma.order.count({ where })]);
  res.json({ orders: orders.map(({ _count, ...order }) => ({ ...order, itemCount: _count.items })), page: filters.page, pageSize: filters.pageSize, total });
});
adminRouter.get("/orders/:id", async (req, res) => {
  const id = z.string().uuid().parse(req.params.id);
  const order = await prisma.order.findUnique({ where: { id }, select: orderDetailSelect });
  if (!order) throw new HttpError(404, "Pedido no encontrado");
  res.json(order);
});
adminRouter.patch("/orders/:id/status", requireCsrf, async (req, res) => {
  const id = z.string().uuid().parse(req.params.id); const { status } = orderStatusSchema.parse(req.body);
  const saved = await prisma.$transaction(async (tx) => {
    const changed = await tx.order.updateMany({ where: { id, status: { in: [...orderStatusOrigins[status]] } }, data: { status, ...(status === "CONFIRMED" ? { confirmedAt: new Date() } : {}), ...(status === "CANCELLED" ? { cancelledAt: new Date() } : {}) } });
    if (!changed.count) return null;
    const order = await tx.order.findUniqueOrThrow({ where: { id }, select: orderStatusSelect });
    await tx.adminAuditLog.create({ data: { adminId: res.locals.admin.id, action: "UPDATE_STATUS", entity: "Order", entityId: id, metadata: { status } } });
    return order;
  });
  if (!saved) throw new HttpError(409, "Transición de pedido no permitida");
  res.json(saved);
});
adminRouter.get("/sync", async (_req, res) => res.json(await prisma.syncRun.findMany({ take: 30, orderBy: { startedAt: "desc" } })));
adminRouter.post("/sync", requireCsrf, async (req, res) => { const run = await synchronizeCatalog(); await audit(req, "SYNC", "Catalog", run.id); res.status(202).json(run); });

export const internalRouter = Router();
internalRouter.post("/sync", (req, _res, next) => {
  const token = env.INTERNAL_SYNC_TOKEN;
  const authorization = req.get("authorization");
  const expected = token ? `Bearer ${token}` : "";
  const authorized = Boolean(authorization && expected && authorization.length === expected.length && crypto.timingSafeEqual(Buffer.from(authorization), Buffer.from(expected)));
  if (!authorized) return next(new HttpError(token ? 401 : 503, token ? "No autorizado" : "Sincronización interna no configurada"));
  next();
}, async (_req, res, next) => {
  try {
    const run = await synchronizeCatalog();
    res.json({ id: run.id, status: run.status, startedAt: run.startedAt, completedAt: run.completedAt, categoryCount: run.categoryCount, productCount: run.productCount });
  } catch (error) {
    if (error instanceof Error && error.message.includes("sincronización de catálogo")) return next(new HttpError(409, "Ya hay una sincronización de catálogo en curso"));
    next(error);
  }
});
