import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const publicRouter = Router();
const productInclude = { category: true, optionGroups: { include: { variants: true } }, priceHistory: { orderBy: { observedAt: "desc" as const }, take: 2 } };

publicRouter.get("/categories", async (_req, res) => res.json(await prisma.category.findMany({ where: { active: true }, orderBy: { name: "asc" } })));
publicRouter.get("/products", async (_req, res) => res.json(await prisma.product.findMany({ where: { active: true }, include: productInclude, orderBy: { name: "asc" } })));
publicRouter.get("/menu", async (_req, res) => {
  const [config, categories] = await Promise.all([prisma.appConfig.findUnique({ where: { id: "default" } }), prisma.category.findMany({ where: { active: true }, include: { products: { where: { active: true }, include: productInclude, orderBy: { name: "asc" } } }, orderBy: { name: "asc" } })]);
  res.json({ categories, uncategorized: await prisma.product.findMany({ where: { active: true, categoryId: null }, include: productInclude }), showObservedDiscounts: config?.showObservedDiscounts ?? false });
});
publicRouter.get("/config", async (_req, res) => res.json(await prisma.appConfig.findUnique({ where: { id: "default" } })));
publicRouter.get("/hours", async (_req, res) => res.json(await prisma.businessHours.findMany({ orderBy: { dayOfWeek: "asc" } })));
