import argon2 from "argon2";
import { Prisma } from "@prisma/client";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { getAdminFromToken, createSession } from "../src/modules/auth/service.js";
import { prisma } from "../src/lib/prisma.js";
import { acquireCatalogLock, releaseCatalogLock } from "../src/modules/sync/lock.js";
import { synchronizeCatalog } from "../src/modules/sync/service.js";

const integration = process.env.TEST_DATABASE_URL ? describe : describe.skip;

async function resetDatabase() {
  await prisma.adminSession.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.optionGroup.deleteMany();
  await prisma.preparedCart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.syncRun.deleteMany();
  await prisma.syncLock.deleteMany();
  await prisma.appConfig.deleteMany();
}

function negoPlusResponse(price: number) {
  return {
    getCategories: async () => [{ id: 10, nombre: "Bebidas", descripcion: "Sin alcohol" }],
    getProducts: async () => [{
      id: 100,
      codigo: "AGUA-500",
      descripcion: "Agua mineral",
      descripcion_carta: "Agua",
      descripcion_larga: "Agua mineral sin gas",
      precio: price,
      rubro_id: 10,
      grupos: [{ id: 1, nombre: "Temperatura", obligatorio: true, variantes: [{ id: 11, nombre: "Fría", precio: 0 }] }],
    }],
  };
}

integration("PostgreSQL integration", () => {
  beforeEach(resetDatabase);
  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it("synchronizes categories and products, then records a price reduction", async () => {
    await synchronizeCatalog({ prisma, negoPlusClient: negoPlusResponse(100) });
    await synchronizeCatalog({ prisma, negoPlusClient: negoPlusResponse(80) });

    const category = await prisma.category.findUniqueOrThrow({ where: { externalId_branchId: { externalId: 10, branchId: 5 } } });
    const product = await prisma.product.findUniqueOrThrow({
      where: { externalId_branchId: { externalId: 100, branchId: 5 } },
      include: { optionGroups: { include: { variants: true } }, priceHistory: { orderBy: { observedAt: "asc" } } },
    });

    expect(category.name).toBe("Bebidas");
    expect(product.price).toEqual(new Prisma.Decimal(80));
    expect(product.optionGroups[0]?.variants[0]?.name).toBe("Fría");
    expect(product.priceHistory).toHaveLength(2);
    expect(product.priceHistory[1]).toMatchObject({ previousPrice: new Prisma.Decimal(100), isPriceDecrease: true, reductionPercent: new Prisma.Decimal(20) });
  });

  it("preserves the catalog when NegoPlus returns an empty feed", async () => {
    await synchronizeCatalog({ prisma, negoPlusClient: negoPlusResponse(100) });

    await expect(synchronizeCatalog({ prisma, negoPlusClient: { getCategories: async () => [], getProducts: async () => [] } })).rejects.toThrow("Respuesta vacía");

    await expect(prisma.product.findUniqueOrThrow({ where: { externalId_branchId: { externalId: 100, branchId: 5 } } })).resolves.toMatchObject({ name: "Agua mineral" });
  });

  it("allows only the owning process to release a real database lock", async () => {
    const firstOwner = await acquireCatalogLock(prisma);
    expect(firstOwner).toBeTruthy();
    expect(await acquireCatalogLock(prisma)).toBeNull();

    await prisma.syncLock.update({ where: { id: "catalog" }, data: { lockedUntil: new Date(0) } });
    const secondOwner = await acquireCatalogLock(prisma);
    expect(secondOwner).toBeTruthy();
    expect(await releaseCatalogLock(prisma, firstOwner!)).toBe(false);
    expect(await releaseCatalogLock(prisma, secondOwner!)).toBe(true);
  });

  it("contains the expected product constraints and indexes", async () => {
    const constraints = await prisma.$queryRaw<Array<{ conname: string }>>`
      SELECT conname FROM pg_constraint WHERE conrelid = '"Product"'::regclass
    `;
    const indexes = await prisma.$queryRaw<Array<{ indexname: string }>>`
      SELECT indexname FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'Product'
    `;

    expect(constraints.map(({ conname }) => conname)).toEqual(expect.arrayContaining(["Product_pkey", "Product_categoryId_fkey"]));
    expect(indexes.map(({ indexname }) => indexname)).toEqual(expect.arrayContaining(["Product_externalId_branchId_key", "Product_categoryId_active_idx"]));
  });

  it("creates and authenticates an administrative session", async () => {
    const password = "integration-test-password";
    await prisma.admin.create({ data: { email: "admin.integration@example.test", passwordHash: await argon2.hash(password) } });

    const { token, admin } = await createSession("ADMIN.INTEGRATION@EXAMPLE.TEST", password);
    const authenticated = await getAdminFromToken(token);

    expect(authenticated).toMatchObject({ id: admin.id, email: "admin.integration@example.test" });
    expect(await prisma.adminSession.count({ where: { adminId: admin.id } })).toBe(1);
  });

  it("protects administrative reads and requires CSRF for configuration changes", async () => {
    const password = "integration-test-password";
    await prisma.admin.create({ data: { email: "admin.api@example.test", passwordHash: await argon2.hash(password) } });
    const agent = request.agent(createApp());
    const login = await agent.post("/api/admin/auth/login").send({ email: "admin.api@example.test", password });
    const csrfToken = login.body.csrfToken;

    await expect(agent.get("/api/admin/auth/session")).resolves.toMatchObject({ status: 200, body: { admin: { email: "admin.api@example.test" } } });
    await expect(agent.get("/api/admin/summary")).resolves.toMatchObject({ status: 200 });
    await expect(agent.put("/api/admin/config").send({ publicName: "Club" })).resolves.toMatchObject({ status: 403 });
    await expect(agent.put("/api/admin/config").set("Origin", "http://localhost:5173").set("x-csrf-token", csrfToken).send({ publicName: "Club" })).resolves.toMatchObject({ status: 200, body: { publicName: "Club" } });
  });
});
