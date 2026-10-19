import crypto from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import { HttpError } from "../lib/http.js";
import { prisma } from "../lib/prisma.js";
import { requireAdmin, requireCsrf } from "../middleware/admin.js";
import { createSession, revokeSession, sessionCookieOptions } from "../modules/auth/service.js";
import { synchronizeCatalog } from "../modules/sync/service.js";

export const authRouter = Router();
const credentials = z.object({ email: z.string().email().max(254), password: z.string().min(12).max(256) });
authRouter.post("/login", async (req, res) => {
  const data = credentials.parse(req.body);
  const { token, admin } = await createSession(data.email, data.password);
  const csrf = crypto.randomBytes(32).toString("base64url");
  res.cookie(env.SESSION_COOKIE_NAME, token, sessionCookieOptions);
  res.cookie(env.CSRF_COOKIE_NAME, csrf, { ...sessionCookieOptions, httpOnly: false });
  res.json({ admin: { email: admin.email }, csrfToken: csrf });
});
authRouter.post("/logout", requireAdmin, requireCsrf, async (req, res) => { await revokeSession(req.cookies[env.SESSION_COOKIE_NAME]); res.clearCookie(env.SESSION_COOKIE_NAME, sessionCookieOptions); res.clearCookie(env.CSRF_COOKIE_NAME, sessionCookieOptions); res.status(204).end(); });
authRouter.get("/session", requireAdmin, (_req, res) => res.json({ admin: { email: res.locals.admin.email } }));

export const adminRouter = Router();
adminRouter.use(requireAdmin);
const configSchema = z.object({ publicName: z.string().max(120).nullable().optional(), publicDescription: z.string().max(1000).nullable().optional(), logoUrl: z.string().url().nullable().optional(), contactPhone: z.string().max(40).nullable().optional(), showObservedDiscounts: z.boolean().optional(), observedDiscountMaxAgeHours: z.number().int().min(1).max(720).optional() });
const hoursSchema = z.array(z.object({ dayOfWeek: z.number().int().min(0).max(6), opensAt: z.string().regex(/^\d{2}:\d{2}$/).nullable(), closesAt: z.string().regex(/^\d{2}:\d{2}$/).nullable(), closed: z.boolean() }));
const offerSchema = z.object({ enabled: z.boolean(), maxObservationAgeHours: z.number().int().min(1).max(720) });
const adSchema = z.object({ title: z.string().min(1).max(160), imageUrl: z.string().url().nullable().optional(), targetUrl: z.string().url().nullable().optional(), active: z.boolean(), startsAt: z.coerce.date().nullable().optional(), endsAt: z.coerce.date().nullable().optional() });
const tableSchema = z.object({ code: z.string().min(1).max(40), label: z.string().min(1).max(80), area: z.enum(["TABLE", "BAR"]), active: z.boolean() });
const ruleSchema = z.object({ productExternalId: z.number().int().positive(), complementaryExternalId: z.number().int().positive(), active: z.boolean() });
const audit = (req: any, action: string, entity: string, entityId?: string) => prisma.adminAuditLog.create({ data: { adminId: req.res.locals.admin.id, action, entity, entityId } });

adminRouter.get("/config", async (_req, res) => res.json(await prisma.appConfig.findUnique({ where: { id: "default" } })));
adminRouter.put("/config", requireCsrf, async (req, res) => { const value = await prisma.appConfig.upsert({ where: { id: "default" }, create: { id: "default", ...configSchema.parse(req.body) }, update: configSchema.parse(req.body) }); await audit(req, "UPDATE", "AppConfig", value.id); res.json(value); });
adminRouter.get("/hours", async (_req, res) => res.json(await prisma.businessHours.findMany({ orderBy: { dayOfWeek: "asc" } })));
adminRouter.put("/hours", requireCsrf, async (req, res) => { const values = hoursSchema.parse(req.body); await prisma.$transaction(values.map((value) => prisma.businessHours.upsert({ where: { dayOfWeek: value.dayOfWeek }, create: value, update: value }))); await audit(req, "UPDATE", "BusinessHours"); res.status(204).end(); });
adminRouter.get("/offers", async (_req, res) => res.json(await prisma.offerConfig.findUnique({ where: { id: "default" } })));
adminRouter.put("/offers", requireCsrf, async (req, res) => { const value = offerSchema.parse(req.body); const saved = await prisma.offerConfig.upsert({ where: { id: "default" }, create: { id: "default", ...value }, update: value }); await audit(req, "UPDATE", "OfferConfig"); res.json(saved); });
for (const [path, model, schema] of [["advertisements", "advertisement", adSchema], ["tables", "venueTable", tableSchema], ["commercial-rules", "complementaryGoodRule", ruleSchema]] as const) {
  adminRouter.get(`/${path}`, async (_req, res) => res.json(await (prisma[model] as any).findMany()));
  adminRouter.post(`/${path}`, requireCsrf, async (req, res) => { const saved = await (prisma[model] as any).create({ data: schema.parse(req.body) }); await audit(req, "CREATE", model, saved.id); res.status(201).json(saved); });
}
const productQuerySchema = z.object({ query: z.string().max(120).optional(), categoryId: z.string().uuid().optional(), withoutCategory: z.enum(["true", "false"]).optional(), zeroPrice: z.enum(["true", "false"]).optional() });
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
adminRouter.get("/sync", async (_req, res) => res.json(await prisma.syncRun.findMany({ take: 30, orderBy: { startedAt: "desc" } })));
adminRouter.post("/sync", requireCsrf, async (req, res) => { const run = await synchronizeCatalog(); await audit(req, "SYNC", "Catalog", run.id); res.status(202).json(run); });

export const internalRouter = Router();
internalRouter.post("/sync", (_req, _res, next) => next(new HttpError(403, "Use an authenticated scheduler integration")));
