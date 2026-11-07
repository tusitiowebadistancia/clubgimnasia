import argon2 from "argon2";
import { Prisma } from "@prisma/client";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { getAdminFromToken, createSession } from "../src/modules/auth/service.js";
import { prisma } from "../src/lib/prisma.js";
import { acquireCatalogLock, releaseCatalogLock } from "../src/modules/sync/lock.js";
import { synchronizeCatalog } from "../src/modules/sync/service.js";
import { revalidateApprovedPromotions } from "../src/modules/promotions/service.js";
import { createOrder } from "../src/modules/orders/service.js";

const integration = process.env.TEST_DATABASE_URL ? describe : describe.skip;

async function resetDatabase() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.adminSession.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.optionGroup.deleteMany();
  await prisma.preparedCart.deleteMany();
  await prisma.promotionSystemEvent.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.syncRun.deleteMany();
  await prisma.syncLock.deleteMany();
  await prisma.appConfig.deleteMany();
  await prisma.offerConfig.deleteMany();
  await prisma.businessHours.deleteMany();
  await prisma.campaignVideo.deleteMany();
  await prisma.campaignConfig.deleteMany();
  await prisma.qrIdentifier.deleteMany();
  await prisma.venueTable.deleteMany();
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

  it("persists hours and theme mode through protected configuration endpoints", async () => {
    const password = "integration-test-password";
    await prisma.admin.create({ data: { email: "admin.hours@example.test", passwordHash: await argon2.hash(password) } });
    const agent = request.agent(createApp());
    const login = await agent.post("/api/admin/auth/login").send({ email: "admin.hours@example.test", password });
    const headers = { Origin: "http://localhost:5173", "x-csrf-token": login.body.csrfToken };
    const hours = Array.from({ length: 7 }, (_, dayOfWeek) => ({ dayOfWeek, opensAt: "19:30", closesAt: "04:30", closed: dayOfWeek === 0 }));

    await agent.put("/api/admin/hours").set(headers).send(hours).expect(204);
    await agent.put("/api/admin/config").set(headers).send({ themeMode: "LIGHT" }).expect(200);
    await request(createApp()).get("/api/public/operation").expect(200).expect((response) => {
      expect(response.body.hours).toHaveLength(7);
      expect(response.body.themeMode).toBe("LIGHT");
      expect(response.body.effectiveTheme).toBe("LIGHT");
      expect(response.body.timeZone).toBe("America/Argentina/Buenos_Aires");
    });
    await agent.put("/api/admin/hours").send(hours).expect(403);
  });

  it("persists one active campaign and exposes only its enabled public videos", async () => {
    const password = "integration-test-password";
    await prisma.admin.create({ data: { email: "admin.campaign@example.test", passwordHash: await argon2.hash(password) } });
    const app = createApp();
    const agent = request.agent(app);
    const login = await agent.post("/api/admin/auth/login").send({ email: "admin.campaign@example.test", password });
    const csrfToken = login.body.csrfToken;
    const origin = "http://localhost:5173";
    const video = { campaign: "YEAR_ROUND", name: "Lanzamiento", desktopUrl: "https://media.example.test/desktop.mp4", mobileUrl: "https://media.example.test/mobile.mp4", posterUrl: "https://media.example.test/poster.webp", active: true, placements: [{ placement: "HOME_AFTER_SERVICES", sortOrder: 1 }, { placement: "BOWLING_AFTER_PROMOS", sortOrder: 2 }] };

    await expect(agent.put("/api/admin/campaigns/active").send({ activeCampaign: "YEAR_ROUND" })).resolves.toMatchObject({ status: 403 });
    await expect(agent.put("/api/admin/campaigns/active").set("Origin", origin).set("x-csrf-token", csrfToken).send({ activeCampaign: "YEAR_ROUND" })).resolves.toMatchObject({ status: 200, body: { activeCampaign: "YEAR_ROUND" } });
    const created = await agent.post("/api/admin/campaigns/videos").set("Origin", origin).set("x-csrf-token", csrfToken).send(video);
    expect(created).toMatchObject({ status: 201, body: { name: "Lanzamiento" } });
    const publicCampaign = await request(app).get("/api/public/advertising");
    expect(publicCampaign.body.campaign).toBe("YEAR_ROUND");
    expect(publicCampaign.body.videos).toEqual(expect.arrayContaining([expect.objectContaining({ placement: "HOME_AFTER_SERVICES", desktopUrl: video.desktopUrl, mobileUrl: video.mobileUrl }), expect.objectContaining({ placement: "BOWLING_AFTER_PROMOS", desktopUrl: video.desktopUrl, mobileUrl: video.mobileUrl })]));
    expect(publicCampaign.body.videos[0].name).toBeUndefined();

    const movedVideo = { ...video, placements: [{ placement: "HOME_AFTER_SERVICES", active: false, sortOrder: 1 }, { placement: "POOL_AFTER_TOURNAMENTS", active: true, sortOrder: 3 }] };
    await agent.put(`/api/admin/campaigns/videos/${created.body.id}`).set("Origin", origin).set("x-csrf-token", csrfToken).send(movedVideo).expect(200);
    const movedPublicCampaign = await request(app).get("/api/public/advertising");
    expect(movedPublicCampaign.body.videos).toHaveLength(1);
    expect(movedPublicCampaign.body.videos[0].placement).toBe("POOL_AFTER_TOURNAMENTS");

    await agent.put("/api/admin/campaigns/active").set("Origin", origin).set("x-csrf-token", csrfToken).send({ activeCampaign: "SUMMER" }).expect(200);
    await expect(request(app).get("/api/public/advertising")).resolves.toMatchObject({ status: 200, body: { campaign: "SUMMER", videos: [] } });
  });

  it("manages venues, unique codes and active QR resolution", async () => {
    const password = "integration-test-password";
    await prisma.admin.create({ data: { email: "admin.venue@example.test", passwordHash: await argon2.hash(password) } });
    const app = createApp();
    const agent = request.agent(app);
    const login = await agent.post("/api/admin/auth/login").send({ email: "admin.venue@example.test", password });
    const csrfToken = login.body.csrfToken;
    const headers = { Origin: "http://localhost:5173", "x-csrf-token": csrfToken };
    const venue = { code: "M01", label: "Mesa 01", area: "TABLE", active: true };

    const created = await agent.post("/api/admin/venues").set(headers).send(venue);
    expect(created).toMatchObject({ status: 201, body: { code: "M01", label: "Mesa 01", area: "TABLE" } });
    expect(created.body.publicUrl).toMatch(/^https:\/\/bowlingclubgimnasia\.com\/menu\?qr=/);
    await agent.post("/api/admin/venues").set(headers).send(venue).expect(409);
    await agent.post("/api/admin/venues").set(headers).send({ code: "B01", label: "Barra principal", area: "BAR", active: true }).expect(201);
    await agent.put(`/api/admin/venues/${created.body.id}`).set(headers).send({ label: "Mesa 01 actualizada", area: "TABLE", active: true }).expect(200);

    const qr = new URL(created.body.publicUrl).searchParams.get("qr");
    await expect(request(app).get(`/api/public/venues/resolve?qr=${qr}`)).resolves.toMatchObject({ status: 200, body: { code: "M01", label: "Mesa 01 actualizada", area: "TABLE", legacy: false } });
    await agent.put(`/api/admin/venues/${created.body.id}/qr`).set(headers).send({ active: false }).expect(200);
    await request(app).get(`/api/public/venues/resolve?qr=${qr}`).expect(404);
    const legacy = await prisma.venueTable.create({ data: { code: "1", label: "Mesa histórica 1", area: "TABLE", qr: { create: { token: "legacy-test-managed-table-01" } } } });
    await expect(request(app).get("/api/public/venues/resolve?mesa=1")).resolves.toMatchObject({ status: 200, body: { code: "1", label: "Mesa histórica 1", legacy: true } });
    await agent.put(`/api/admin/venues/${legacy.id}/qr`).set(headers).send({ active: false }).expect(200);
    await request(app).get("/api/public/venues/resolve?mesa=1").expect(404);
    await request(app).get("/api/public/venues/resolve?mesa=21").expect(404);
    await request(app).get("/api/admin/venues").expect(401);
  });

  it("creates orders from official prices and preserves historical snapshots", async () => {
    const venue = await prisma.venueTable.create({ data: { code: "M01", label: "Mesa 01", area: "TABLE", qr: { create: { token: "order-venue-token-0001" } } } });
    const water = await prisma.product.create({ data: { externalId: 2001, branchId: 5, name: "Agua", price: 1500 } });
    const snack = await prisma.product.create({ data: { externalId: 2002, branchId: 5, name: "Papas", price: 2300 } });

    const order = await createOrder({ idempotencyKey: "00000000-0000-4000-8000-000000000001", branchId: 5, venue: { qr: "order-venue-token-0001" }, items: [{ productId: water.id, quantity: 2 }, { productId: snack.id, quantity: 3 }] });
    expect(order).toMatchObject({ branchId: 5, venueTableId: venue.id, venueCode: "M01", venueLabel: "Mesa 01", status: "PENDING", currency: "ARS", subtotal: new Prisma.Decimal(9900), total: new Prisma.Decimal(9900) });
    expect(order.orderNumber).toMatch(/^ORD-/);
    expect(order.items).toEqual(expect.arrayContaining([expect.objectContaining({ productId: water.id, productName: "Agua", unitPrice: new Prisma.Decimal(1500), quantity: 2, lineTotal: new Prisma.Decimal(3000) }), expect.objectContaining({ productId: snack.id, productName: "Papas", unitPrice: new Prisma.Decimal(2300), quantity: 3, lineTotal: new Prisma.Decimal(6900) })]));

    await prisma.product.update({ where: { id: water.id }, data: { name: "Agua actualizada", price: 1800 } });
    expect(await prisma.orderItem.findFirstOrThrow({ where: { orderId: order.id, productId: water.id } })).toMatchObject({ productName: "Agua", unitPrice: new Prisma.Decimal(1500), lineTotal: new Prisma.Decimal(3000) });
  });

  it("rejects invalid order inputs and rolls back the full order", async () => {
    await prisma.venueTable.create({ data: { code: "M02", label: "Mesa 02", area: "TABLE", qr: { create: { token: "order-venue-token-0002" } } } });
    const valid = await prisma.product.create({ data: { externalId: 2101, branchId: 5, name: "Válido", price: 1000 } });
    const inactive = await prisma.product.create({ data: { externalId: 2102, branchId: 5, name: "Inactivo", price: 1000, active: false } });
    const otherBranch = await prisma.product.create({ data: { externalId: 2103, branchId: 6, name: "Otra sucursal", price: 1000 } });
    const zero = await prisma.product.create({ data: { externalId: 2104, branchId: 5, name: "Sin precio", price: 0 } });
    const base = { idempotencyKey: "00000000-0000-4000-8000-000000000002", branchId: 5, venue: { qr: "order-venue-token-0002" } };

    await expect(createOrder({ ...base, items: [{ productId: inactive.id, quantity: 1 }] })).rejects.toThrow("Producto inactivo");
    await expect(createOrder({ ...base, items: [{ productId: otherBranch.id, quantity: 1 }] })).rejects.toThrow("sucursal");
    await expect(createOrder({ ...base, items: [{ productId: zero.id, quantity: 1 }] })).rejects.toThrow("Precio oficial inválido");
    await expect(createOrder({ ...base, items: [{ productId: valid.id, quantity: 0 }] })).rejects.toThrow("Producto o cantidad inválidos");
    await expect(createOrder({ ...base, items: [{ productId: valid.id, quantity: -1 }] })).rejects.toThrow("Producto o cantidad inválidos");
    await expect(createOrder({ ...base, items: [{ productId: "missing-product", quantity: 1 }] })).rejects.toThrow("Producto no disponible");
    await expect(createOrder({ ...base, items: [{ productId: valid.id, quantity: 1 }, { productId: "missing-product", quantity: 1 }] })).rejects.toThrow("Producto no disponible");
    expect(await prisma.order.count()).toBe(0);
    expect(await prisma.orderItem.count()).toBe(0);
  });

  it("creates one order for repeated and concurrent idempotent requests", async () => {
    await prisma.venueTable.create({ data: { code: "M03", label: "Mesa 03", area: "TABLE", qr: { create: { token: "order-venue-token-0003" } } } });
    const water = await prisma.product.create({ data: { externalId: 2201, branchId: 5, name: "Agua", price: 1500 } });
    const snack = await prisma.product.create({ data: { externalId: 2202, branchId: 5, name: "Papas", price: 2300 } });
    const input = { idempotencyKey: "00000000-0000-4000-8000-000000000003", branchId: 5, venue: { qr: "order-venue-token-0003" }, items: [{ productId: water.id, quantity: 2 }, { productId: snack.id, quantity: 1 }] };

    const first = await createOrder(input);
    const retry = await createOrder({ ...input, items: [...input.items].reverse() });
    expect(retry.id).toBe(first.id);
    expect(await prisma.order.count()).toBe(1);

    const concurrentInput = { ...input, idempotencyKey: "00000000-0000-4000-8000-000000000004" };
    const [left, right] = await Promise.all([createOrder(concurrentInput), createOrder(concurrentInput)]);
    expect(left.id).toBe(right.id);
    expect(await prisma.order.count()).toBe(2);
  });

  it("rejects a reused idempotency key when the canonical request changes", async () => {
    await prisma.venueTable.create({ data: { code: "M04", label: "Mesa 04", area: "TABLE", qr: { create: { token: "order-venue-token-0004" } } } });
    await prisma.venueTable.create({ data: { code: "M05", label: "Mesa 05", area: "TABLE", qr: { create: { token: "order-venue-token-0005" } } } });
    const water = await prisma.product.create({ data: { externalId: 2301, branchId: 5, name: "Agua", price: 1500 } });
    const snack = await prisma.product.create({ data: { externalId: 2302, branchId: 5, name: "Papas", price: 2300 } });
    const key = "00000000-0000-4000-8000-000000000005";
    const base = { idempotencyKey: key, branchId: 5, venue: { qr: "order-venue-token-0004" }, items: [{ productId: water.id, quantity: 1 }] };

    await createOrder(base);
    await expect(createOrder({ ...base, items: [{ productId: water.id, quantity: 2 }] })).rejects.toThrow("idempotencia");
    await expect(createOrder({ ...base, items: [{ productId: snack.id, quantity: 1 }] })).rejects.toThrow("idempotencia");
    await expect(createOrder({ ...base, venue: { qr: "order-venue-token-0005" } })).rejects.toThrow("idempotencia");
    await createOrder({ ...base, idempotencyKey: "00000000-0000-4000-8000-000000000006" });
    expect(await prisma.order.count()).toBe(2);
  });

  it("creates strict public orders without exposing internal data", async () => {
    await prisma.venueTable.create({ data: { code: "M06", label: "Mesa 06", area: "TABLE", qr: { create: { token: "order-endpoint-token-0006" } } } });
    const valid = await prisma.product.create({ data: { externalId: 2401, branchId: 5, name: "Válido", price: 1200 } });
    const inactive = await prisma.product.create({ data: { externalId: 2402, branchId: 5, name: "Inactivo", price: 1200, active: false } });
    const otherBranch = await prisma.product.create({ data: { externalId: 2403, branchId: 6, name: "Otra sucursal", price: 1200 } });
    const zero = await prisma.product.create({ data: { externalId: 2404, branchId: 5, name: "Sin precio", price: 0 } });
    const app = createApp();
    const body = { idempotencyKey: "00000000-0000-4000-8000-000000000007", venue: { qr: "order-endpoint-token-0006" }, items: [{ productId: valid.id, quantity: 2, expectedUnitPrice: 1200 }] };

    const created = await request(app).post("/api/public/orders").send(body).expect(201);
    expect(created.body).toMatchObject({ status: "PENDING", currency: "ARS", items: [{ productId: valid.id, productName: "Válido", quantity: 2 }] });
    expect(Number(created.body.subtotal)).toBe(2400);
    expect(created.body).not.toHaveProperty("idempotencyKey");
    expect(created.body).not.toHaveProperty("idempotencyFingerprint");
    expect(created.body).not.toHaveProperty("venueTableId");
    await request(app).post("/api/public/orders").send(body).expect(201).expect((response) => expect(response.body.id).toBe(created.body.id));
    expect(await prisma.order.count()).toBe(1);

    await request(app).post("/api/public/orders").send({ ...body, items: [{ productId: valid.id, quantity: 3, expectedUnitPrice: 1200 }] }).expect(409);
    await request(app).post("/api/public/orders").send({ idempotencyKey: "00000000-0000-4000-8000-000000000008", items: body.items }).expect(400);
    await request(app).post("/api/public/orders").send({ ...body, idempotencyKey: "00000000-0000-4000-8000-000000000009", items: [{ productId: "00000000-0000-4000-8000-000000000010", quantity: 1, expectedUnitPrice: 1200 }] }).expect(422);
    await request(app).post("/api/public/orders").send({ ...body, idempotencyKey: "00000000-0000-4000-8000-000000000011", items: [{ productId: inactive.id, quantity: 1, expectedUnitPrice: 1200 }] }).expect(422);
    await request(app).post("/api/public/orders").send({ ...body, idempotencyKey: "00000000-0000-4000-8000-000000000012", items: [{ productId: otherBranch.id, quantity: 1, expectedUnitPrice: 1200 }] }).expect(422);
    await request(app).post("/api/public/orders").send({ ...body, idempotencyKey: "00000000-0000-4000-8000-000000000013", items: [{ productId: zero.id, quantity: 1, expectedUnitPrice: 1200 }] }).expect(422);
    await request(app).post("/api/public/orders").send({ ...body, idempotencyKey: "00000000-0000-4000-8000-000000000014", items: [{ productId: valid.id, quantity: 0, expectedUnitPrice: 1200 }] }).expect(400);
    await request(app).post("/api/public/orders").send({ ...body, idempotencyKey: "00000000-0000-4000-8000-000000000021", items: [{ productId: valid.id, quantity: 1 }] }).expect(400);
    await request(app).post("/api/public/orders").send({ ...body, idempotencyKey: "00000000-0000-4000-8000-000000000015", total: 1 }).expect(400);
    expect(await prisma.order.count()).toBe(1);
    expect(await prisma.orderItem.count()).toBe(1);
  });

  it("lists and reads orders through authenticated administrative endpoints", async () => {
    const admin = await prisma.admin.create({ data: { email: "admin.orders@example.test", passwordHash: await argon2.hash("integration-test-password") } });
    const venue = await prisma.venueTable.create({ data: { code: "M07", label: "Mesa 07", area: "TABLE", qr: { create: { token: "order-admin-token-0007" } } } });
    const product = await prisma.product.create({ data: { externalId: 2501, branchId: 5, name: "Agua", price: 1200 } });
    const base = { branchId: 5, venue: { qr: "order-admin-token-0007" }, items: [{ productId: product.id, quantity: 1 }] };
    const old = await createOrder({ ...base, idempotencyKey: "00000000-0000-4000-8000-000000000016" });
    const ready = await createOrder({ ...base, idempotencyKey: "00000000-0000-4000-8000-000000000017" });
    const recent = await createOrder({ ...base, idempotencyKey: "00000000-0000-4000-8000-000000000018" });
    await prisma.order.update({ where: { id: old.id }, data: { createdAt: new Date("2026-01-01T10:00:00Z") } });
    await prisma.order.update({ where: { id: ready.id }, data: { status: "READY" } });
    const { token } = await createSession(admin.email, "integration-test-password");
    const app = createApp(); const headers = { Cookie: `bcg_admin_session=${token}` };

    await request(app).get("/api/admin/orders").expect(401);
    await request(app).get(`/api/admin/orders/${recent.id}`).expect(401);
    const list = await request(app).get("/api/admin/orders?page=1&pageSize=2").set(headers).expect(200);
    expect(list.body).toMatchObject({ page: 1, pageSize: 2, total: 3 });
    expect(list.body.orders).toHaveLength(2);
    expect(list.body.orders[0]).not.toHaveProperty("idempotencyKey");
    const filtered = await request(app).get("/api/admin/orders?status=READY&mesa=M07").set(headers).expect(200);
    expect(filtered.body.orders.map((order: { id: string }) => order.id)).toEqual([ready.id]);
    const dated = await request(app).get("/api/admin/orders?from=2026-01-02T00:00:00.000Z").set(headers).expect(200);
    expect(dated.body.orders).toHaveLength(2);
    const detail = await request(app).get(`/api/admin/orders/${recent.id}`).set(headers).expect(200);
    expect(detail.body).toMatchObject({ id: recent.id, venueCode: venue.code, total: "1200", items: [{ productId: product.id, productName: "Agua", unitPrice: "1200", quantity: 1, lineTotal: "1200" }] });
    expect(detail.body).not.toHaveProperty("idempotencyKey");
    expect(detail.body).not.toHaveProperty("idempotencyFingerprint");
    await request(app).get("/api/admin/orders/not-a-uuid").set(headers).expect(400);
    await request(app).get("/api/admin/orders/00000000-0000-4000-8000-000000000099").set(headers).expect(404);
    expect(await prisma.order.count()).toBe(3);
  });

  it("transitions order statuses atomically with CSRF and audit protection", async () => {
    const admin = await prisma.admin.create({ data: { email: "admin.order-status@example.test", passwordHash: await argon2.hash("integration-test-password") } });
    await prisma.venueTable.create({ data: { code: "M08", label: "Mesa 08", area: "TABLE", qr: { create: { token: "order-status-token-0008" } } } });
    const product = await prisma.product.create({ data: { externalId: 2601, branchId: 5, name: "Agua", price: 1200 } });
    const create = (key: string) => createOrder({ idempotencyKey: key, branchId: 5, venue: { qr: "order-status-token-0008" }, items: [{ productId: product.id, quantity: 2 }] });
    const order = await create("00000000-0000-4000-8000-000000000019"); const concurrent = await create("00000000-0000-4000-8000-000000000020");
    const { token } = await createSession(admin.email, "integration-test-password"); const app = createApp(); const headers = { Origin: "http://localhost:5173", "x-csrf-token": "order-status-csrf", Cookie: `bcg_admin_session=${token}; bcg_csrf=order-status-csrf` };
    const path = (id: string) => `/api/admin/orders/${id}/status`;

    await request(app).patch(path(order.id)).send({ status: "CONFIRMED" }).expect(401);
    await request(app).patch(path(order.id)).set("Cookie", headers.Cookie).send({ status: "CONFIRMED" }).expect(403);
    await request(app).patch(path(order.id)).set(headers).send({ status: "INVALID" }).expect(400);
    const confirmed = await request(app).patch(path(order.id)).set(headers).send({ status: "CONFIRMED" }).expect(200);
    expect(confirmed.body).toMatchObject({ id: order.id, status: "CONFIRMED" }); expect(confirmed.body.confirmedAt).toBeTruthy(); expect(confirmed.body.total).toBeUndefined();
    await request(app).patch(path(order.id)).set(headers).send({ status: "READY" }).expect(409);
    await request(app).patch(path(order.id)).set(headers).send({ status: "PREPARING" }).expect(200);
    await request(app).patch(path(order.id)).set(headers).send({ status: "READY" }).expect(200);
    await request(app).patch(path(order.id)).set(headers).send({ status: "DELIVERED" }).expect(200);
    await request(app).patch(path(order.id)).set(headers).send({ status: "CANCELLED" }).expect(409);
    const results = await Promise.all([request(app).patch(path(concurrent.id)).set(headers).send({ status: "CANCELLED" }), request(app).patch(path(concurrent.id)).set(headers).send({ status: "CANCELLED" })]);
    expect(results.map((response) => response.status).sort()).toEqual([200, 409]);
    expect(await prisma.adminAuditLog.count({ where: { entity: "Order", entityId: order.id, action: "UPDATE_STATUS" } })).toBe(4);
    expect(await prisma.adminAuditLog.count({ where: { entity: "Order", entityId: concurrent.id, action: "UPDATE_STATUS" } })).toBe(1);
    expect(await prisma.orderItem.findFirstOrThrow({ where: { orderId: order.id } })).toMatchObject({ unitPrice: new Prisma.Decimal(1200), quantity: 2, lineTotal: new Prisma.Decimal(2400) });
  });

  it("returns only authenticated candidates backed by valid NegoPlus price history", async () => {
    const password = "integration-test-password";
    await prisma.admin.create({ data: { email: "admin.promotions@example.test", passwordHash: await argon2.hash(password) } });
    const valid = await prisma.product.create({ data: { externalId: 901, branchId: 5, name: "Reducido", price: 80 } });
    const unchanged = await prisma.product.create({ data: { externalId: 902, branchId: 5, name: "Igual", price: 100 } });
    const inactive = await prisma.product.create({ data: { externalId: 903, branchId: 5, name: "Inactivo", price: 80, active: false } });
    const zero = await prisma.product.create({ data: { externalId: 904, branchId: 5, name: "Cero", price: 0 } });
    await prisma.priceHistory.createMany({ data: [
      { productId: valid.id, price: 80, previousPrice: 100, isPriceDecrease: true, reductionPercent: 20 },
      { productId: unchanged.id, price: 100, previousPrice: 100, isPriceDecrease: false },
      { productId: inactive.id, price: 80, previousPrice: 100, isPriceDecrease: true },
      { productId: zero.id, price: 0, previousPrice: 100, isPriceDecrease: true },
    ] });
    const app = createApp(); const agent = request.agent(app);
    await request(app).get("/api/admin/promotions/candidates").expect(401);
    await agent.post("/api/admin/auth/login").send({ email: "admin.promotions@example.test", password }).expect(200);
    const response = await agent.get("/api/admin/promotions/candidates").expect(200);
    expect(response.body).toHaveLength(1); expect(response.body[0]).toMatchObject({ id: valid.id, branchId: 5 });
    expect(await prisma.product.findUnique({ where: { id: valid.id } })).toMatchObject({ price: new Prisma.Decimal(80) });
    expect(await prisma.priceHistory.count()).toBe(4);
  });

  it("serializes concurrent approvals by product and placement", async () => {
    const password = "integration-test-password";
    const admin = await prisma.admin.create({ data: { email: "admin.concurrent@example.test", passwordHash: await argon2.hash(password) } });
    const product = await prisma.product.create({ data: { externalId: 990, branchId: 5, name: "Concurrente", price: 80 } });
    await prisma.priceHistory.create({ data: { productId: product.id, price: 80, previousPrice: 100, isPriceDecrease: true, reductionPercent: 20 } });
    const app = createApp(); const { token } = await createSession(admin.email, password);
    const headers = { Origin: "http://localhost:5173", "x-csrf-token": "concurrency-csrf", Cookie: `bcg_admin_session=${token}; bcg_csrf=concurrency-csrf` };
    const approve = (placements: string[]) => request(app).post("/api/admin/promotions/approve").set(headers).send({ productId: product.id, placements });
    const same = await Promise.all([approve(["HOME"]), approve(["HOME"])]);
    expect(same.map((response) => response.status).sort()).toEqual([201, 409]);
    expect(await prisma.promotion.count({ where: { productId: product.id, status: "APPROVED" } })).toBe(1);
    expect(await prisma.adminAuditLog.count({ where: { entity: "Promotion", action: "APPROVE" } })).toBe(1);
    const other = await prisma.product.create({ data: { externalId: 991, branchId: 5, name: "Otro", price: 80 } });
    await prisma.priceHistory.create({ data: { productId: other.id, price: 80, previousPrice: 100, isPriceDecrease: true } });
    const separate = await Promise.all([approve(["MENU"]), request(app).post("/api/admin/promotions/approve").set(headers).send({ productId: other.id, placements: ["HOME"] })]);
    expect(separate.map((response) => response.status).sort()).toEqual([201, 201]);
  });

  it("suspends an approved promotion once and audits only the successful transition", async () => {
    const password = "integration-test-password";
    const admin = await prisma.admin.create({ data: { email: "admin.suspend@example.test", passwordHash: await argon2.hash(password) } });
    const product = await prisma.product.create({ data: { externalId: 999, branchId: 5, name: "Suspendible", price: 80 } });
    const promotion = await prisma.promotion.create({ data: { productId: product.id, previousPrice: 100, currentPrice: 80, previousObservedAt: new Date(), approvedAt: new Date(), approvedById: admin.id, status: "APPROVED", placements: ["HOME"] } });
    const { token } = await createSession(admin.email, password);
    const app = createApp(); const headers = { Origin: "http://localhost:5173", "x-csrf-token": "suspend-csrf", Cookie: `bcg_admin_session=${token}; bcg_csrf=suspend-csrf` };
    await request(app).post(`/api/admin/promotions/${promotion.id}/suspend`).set(headers).expect(200);
    expect(await prisma.promotion.findUnique({ where: { id: promotion.id } })).toMatchObject({ status: "SUSPENDED" });
    expect(await prisma.adminAuditLog.count({ where: { entityId: promotion.id, action: "SUSPENDED" } })).toBe(1);
    await request(app).post(`/api/admin/promotions/${promotion.id}/suspend`).set(headers).expect(409);
    expect(await prisma.adminAuditLog.count({ where: { entityId: promotion.id, action: "SUSPENDED" } })).toBe(1);
  });

  it("rejects an approved promotion once and blocks invalid follow-up transitions", async () => {
    const password = "integration-test-password";
    const admin = await prisma.admin.create({ data: { email: "admin.reject@example.test", passwordHash: await argon2.hash(password) } });
    const product = await prisma.product.create({ data: { externalId: 1000, branchId: 5, name: "Rechazable", price: 80 } });
    const promotion = await prisma.promotion.create({ data: { productId: product.id, previousPrice: 100, currentPrice: 80, previousObservedAt: new Date(), approvedAt: new Date(), approvedById: admin.id, status: "APPROVED", placements: ["HOME"] } });
    const { token } = await createSession(admin.email, password); const app = createApp(); const headers = { Origin: "http://localhost:5173", "x-csrf-token": "reject-csrf", Cookie: `bcg_admin_session=${token}; bcg_csrf=reject-csrf` };
    await request(app).post(`/api/admin/promotions/${promotion.id}/reject`).set(headers).expect(200);
    expect(await prisma.promotion.findUnique({ where: { id: promotion.id } })).toMatchObject({ status: "REJECTED" });
    expect(await prisma.adminAuditLog.count({ where: { entityId: promotion.id, action: "REJECTED" } })).toBe(1);
    await request(app).post(`/api/admin/promotions/${promotion.id}/reject`).set(headers).expect(409);
    await request(app).post(`/api/admin/promotions/${promotion.id}/suspend`).set(headers).expect(409);
    expect(await prisma.promotion.findUnique({ where: { id: promotion.id } })).toMatchObject({ status: "REJECTED" });
    expect(await prisma.adminAuditLog.count({ where: { entityId: promotion.id } })).toBe(1);
  });

  it("validates promotion expiry dates without writing invalid approvals", async () => {
    const password = "integration-test-password"; const admin = await prisma.admin.create({ data: { email: "admin.expiry@example.test", passwordHash: await argon2.hash(password) } });
    const { token } = await createSession(admin.email, password); const app = createApp(); const headers = { Origin: "http://localhost:5173", "x-csrf-token": "expiry-csrf", Cookie: `bcg_admin_session=${token}; bcg_csrf=expiry-csrf` };
    async function createCandidate(externalId: number) { const product = await prisma.product.create({ data: { externalId, branchId: 5, name: `Vence ${externalId}`, price: 80 } }); await prisma.priceHistory.create({ data: { productId: product.id, price: 80, previousPrice: 100, isPriceDecrease: true } }); return product; }
    const future = await createCandidate(1101); const futureAt = new Date(Date.now() + 86_400_000).toISOString();
    await request(app).post("/api/admin/promotions/approve").set(headers).send({ productId: future.id, placements: ["HOME"], expiresAt: futureAt }).expect(201);
    expect(await prisma.promotion.count({ where: { productId: future.id, status: "APPROVED" } })).toBe(1);
    expect(await prisma.product.findUnique({ where: { id: future.id } })).toMatchObject({ price: new Prisma.Decimal(80) });
    const withoutExpiry = await createCandidate(1102); await request(app).post("/api/admin/promotions/approve").set(headers).send({ productId: withoutExpiry.id, placements: ["HOME"] }).expect(201);
    for (const [externalId, expiresAt] of [[1103, new Date(Date.now() - 60_000).toISOString()], [1104, "not-a-date"], [1105, new Date(Date.now() - 1).toISOString()]]) { const product = await createCandidate(externalId); await request(app).post("/api/admin/promotions/approve").set(headers).send({ productId: product.id, placements: ["HOME"], expiresAt }).expect(400); expect(await prisma.promotion.count({ where: { productId: product.id } })).toBe(0); expect(await prisma.adminAuditLog.count({ where: { entity: "Promotion", action: "APPROVE" } })).toBe(2); }
  });

  it("allows exactly one concurrent terminal transition from approved", async () => {
    const password = "integration-test-password"; const admin = await prisma.admin.create({ data: { email: "admin.transition@example.test", passwordHash: await argon2.hash(password) } });
    const product = await prisma.product.create({ data: { externalId: 1200, branchId: 5, name: "Transición", price: 80 } });
    const promotion = await prisma.promotion.create({ data: { productId: product.id, previousPrice: 100, currentPrice: 80, previousObservedAt: new Date(), approvedAt: new Date(), approvedById: admin.id, status: "APPROVED", placements: ["HOME"] } });
    const { token } = await createSession(admin.email, password); const app = createApp(); const headers = { Origin: "http://localhost:5173", "x-csrf-token": "transition-csrf", Cookie: `bcg_admin_session=${token}; bcg_csrf=transition-csrf` };
    const [rejected, suspended] = await Promise.all([request(app).post(`/api/admin/promotions/${promotion.id}/reject`).set(headers), request(app).post(`/api/admin/promotions/${promotion.id}/suspend`).set(headers)]);
    expect([rejected.status, suspended.status].sort()).toEqual([200, 409]);
    const final = await prisma.promotion.findUniqueOrThrow({ where: { id: promotion.id } });
    expect(["REJECTED", "SUSPENDED"]).toContain(final.status);
    expect(await prisma.adminAuditLog.count({ where: { entityId: promotion.id, action: final.status } })).toBe(1);
    expect(await prisma.adminAuditLog.count({ where: { entityId: promotion.id } })).toBe(1);
    expect(await prisma.product.findUnique({ where: { id: product.id } })).toMatchObject({ price: new Prisma.Decimal(80) });
    expect(await prisma.priceHistory.count({ where: { productId: product.id } })).toBe(0);
  });

  it("revalidates approved promotions and is idempotent", async () => {
    const now = new Date("2026-02-01T12:00:00Z"); const admin = await prisma.admin.create({ data: { email: "admin.revalidate@example.test", passwordHash: await argon2.hash("integration-test-password") } });
    async function promotion(externalId: number, price: number, status: "APPROVED" | "REJECTED" | "SUSPENDED" = "APPROVED", overrides: Record<string, unknown> = {}) { const product = await prisma.product.create({ data: { externalId, branchId: 5, name: `Revalidar ${externalId}`, price, active: overrides.active as boolean ?? true } }); const row = await prisma.promotion.create({ data: { productId: product.id, previousPrice: 100, currentPrice: overrides.approvedPrice as number ?? 80, previousObservedAt: overrides.observedAt as Date ?? new Date(now.getTime() - 3_600_000), approvedAt: now, approvedById: admin.id, status, placements: ["HOME"], expiresAt: overrides.expiresAt as Date ?? null } }); return { product, row }; }
    const unchanged = await promotion(1301, 80); const increased = await promotion(1302, 90); const decreased = await promotion(1303, 70); const inactive = await promotion(1304, 80, "APPROVED", { active: false }); const zero = await promotion(1305, 0); const old = await promotion(1306, 80, "APPROVED", { observedAt: new Date(now.getTime() - 73 * 3_600_000) }); const expired = await promotion(1307, 80, "APPROVED", { expiresAt: now }); const rejected = await promotion(1308, 90, "REJECTED"); const suspended = await promotion(1309, 90, "SUSPENDED");
    const first = await revalidateApprovedPromotions(prisma, now); expect(first.suspended).toHaveLength(6);
    for (const row of [increased, decreased, inactive, zero, old, expired]) expect(await prisma.promotion.findUnique({ where: { id: row.row.id } })).toMatchObject({ status: "SUSPENDED" });
    expect(await prisma.promotion.findUnique({ where: { id: unchanged.row.id } })).toMatchObject({ status: "APPROVED" }); expect(await prisma.promotion.findUnique({ where: { id: rejected.row.id } })).toMatchObject({ status: "REJECTED" }); expect(await prisma.promotion.findUnique({ where: { id: suspended.row.id } })).toMatchObject({ status: "SUSPENDED" });
    expect((await revalidateApprovedPromotions(prisma, now)).suspended).toEqual([]); expect(await prisma.product.findUnique({ where: { id: unchanged.product.id } })).toMatchObject({ price: new Prisma.Decimal(80) }); expect(await prisma.priceHistory.count()).toBe(0);
  });

  it("records one technical event for each automatic suspension reason", async () => {
    const now = new Date("2026-03-01T12:00:00Z"); const admin = await prisma.admin.create({ data: { email: "admin.events@example.test", passwordHash: await argon2.hash("integration-test-password") } });
    async function row(externalId: number, price: number, overrides: Record<string, unknown> = {}) { const product = await prisma.product.create({ data: { externalId, branchId: 5, name: `Evento ${externalId}`, price, active: overrides.active as boolean ?? true } }); return prisma.promotion.create({ data: { productId: product.id, previousPrice: 100, currentPrice: overrides.approvedPrice as number ?? 80, previousObservedAt: overrides.observedAt as Date ?? new Date(now.getTime() - 3_600_000), approvedAt: now, approvedById: admin.id, status: overrides.status as "APPROVED" | "SUSPENDED" | "REJECTED" ?? "APPROVED", placements: ["HOME"], expiresAt: overrides.expiresAt as Date ?? null } }); }
    const changed = await row(1401, 90); const inactive = await row(1402, 80, { active: false }); const zero = await row(1403, 0); const old = await row(1404, 80, { observedAt: new Date(now.getTime() - 73 * 3_600_000) }); const expired = await row(1405, 80, { expiresAt: now }); const valid = await row(1406, 80); const suspended = await row(1407, 90, { status: "SUSPENDED" }); const rejected = await row(1408, 90, { status: "REJECTED" });
    const first = await revalidateApprovedPromotions(prisma, now); expect(first.suspended).toHaveLength(5);
    for (const [promotion, type] of [[changed,"PRICE_CHANGED"],[inactive,"PRODUCT_INACTIVE"],[zero,"INVALID_OFFICIAL_PRICE"],[old,"HISTORICAL_REFERENCE_EXPIRED"],[expired,"PROMOTION_EXPIRED"]] as const) { expect(await prisma.promotion.findUnique({where:{id:promotion.id}})).toMatchObject({status:"SUSPENDED"}); expect(await prisma.promotionSystemEvent.findMany({where:{promotionId:promotion.id}})).toMatchObject([{promotionId:promotion.id,eventType:type,reason:type}]); }
    expect(await prisma.promotionSystemEvent.count()).toBe(5); expect(await prisma.promotion.findUnique({where:{id:valid.id}})).toMatchObject({status:"APPROVED"}); expect(await prisma.promotionSystemEvent.count({where:{promotionId:{in:[valid.id,suspended.id,rejected.id]}}})).toBe(0);
    expect((await revalidateApprovedPromotions(prisma,now)).suspended).toEqual([]); expect(await prisma.promotionSystemEvent.count()).toBe(5); expect(await prisma.priceHistory.count()).toBe(0);
  });

  it("revalidates approved promotions after a successful NegoPlus sync", async () => {
    const product = await prisma.product.create({ data: { externalId: 100, branchId: 5, name: "Agua mineral", price: 100 } });
    const promotion = await prisma.promotion.create({ data: { productId: product.id, previousPrice: 120, currentPrice: 100, previousObservedAt: new Date(), approvedAt: new Date(), status: "APPROVED", placements: ["HOME"] } });
    const run = await synchronizeCatalog({ prisma, negoPlusClient: negoPlusResponse(120) });
    expect(run.status).toBe("SUCCESS");
    expect(await prisma.product.findUnique({ where: { id: product.id } })).toMatchObject({ price: new Prisma.Decimal(120) });
    expect(await prisma.promotion.findUnique({ where: { id: promotion.id } })).toMatchObject({ status: "SUSPENDED" });
    expect(await prisma.promotionSystemEvent.findMany({ where: { promotionId: promotion.id } })).toMatchObject([{ eventType: "PRICE_CHANGED", reason: "PRICE_CHANGED" }]);
  });

  it("manages the HOME promotions setting without affecting other offer settings", async () => {
    const password = "integration-test-password"; await prisma.admin.create({ data: { email: "admin.home-settings@example.test", passwordHash: await argon2.hash(password) } });
    const app = createApp(); const { token } = await createSession("admin.home-settings@example.test", password); const cookie = `bcg_admin_session=${token}; bcg_csrf=home-settings-csrf`;
    await request(app).get("/api/admin/promotions/settings").expect(401);
    await request(app).get("/api/admin/promotions/settings").set("Cookie", cookie).expect(200).expect({ showHomePromotions: false });
    await request(app).patch("/api/admin/promotions/settings").set("Cookie", cookie).send({ showHomePromotions: true }).expect(403);
    const headers = { Origin: "http://localhost:5173", "x-csrf-token": "home-settings-csrf", Cookie: cookie };
    await request(app).patch("/api/admin/promotions/settings").set(headers).send({ showHomePromotions: "true" }).expect(400);
    await request(app).patch("/api/admin/promotions/settings").set(headers).send({ showHomePromotions: true }).expect(200).expect({ showHomePromotions: true });
    expect(await prisma.offerConfig.findUniqueOrThrow({ where: { id: "default" } })).toMatchObject({ showHomePromotions: true, enabled: false, maxObservationAgeHours: 72 });
    await request(app).patch("/api/admin/promotions/settings").set(headers).send({ showHomePromotions: false }).expect(200).expect({ showHomePromotions: false });
  });

  it("exposes only current verified public promotions by placement", async () => {
    const now = new Date(); async function add(externalId: number, placement: string, status: "APPROVED" | "SUSPENDED" | "REJECTED" = "APPROVED", overrides: Record<string, unknown> = {}) { const product = await prisma.product.create({ data: { externalId, branchId: 5, name: `Pública ${externalId}`, price: overrides.price as number ?? 80, active: overrides.active as boolean ?? true } }); return prisma.promotion.create({ data: { productId: product.id, previousPrice: 100, currentPrice: overrides.approvedPrice as number ?? 80, previousObservedAt: overrides.observedAt as Date ?? new Date(now.getTime() - 3_600_000), status, placements: [placement], expiresAt: overrides.expiresAt as Date ?? null } }); }
    const home = await add(1501, "HOME"); const menu = await add(1502, "MENU"); await add(1503, "HOME", "SUSPENDED"); await add(1504, "HOME", "REJECTED"); await add(1505, "HOME", "APPROVED", { active: false }); await add(1506, "HOME", "APPROVED", { price: 0 }); await add(1507, "HOME", "APPROVED", { price: 90 }); await add(1508, "HOME", "APPROVED", { observedAt: new Date(now.getTime() - 73 * 3_600_000) }); await add(1509, "HOME", "APPROVED", { expiresAt: now });
    const app = createApp(); const before = await prisma.product.findMany(); const history = await prisma.priceHistory.count(); const events = await prisma.promotionSystemEvent.count();
    await prisma.offerConfig.create({ data: { id: "default", showHomePromotions: true } });
    const homeResponse = await request(app).get("/api/public/promotions?placement=HOME").expect(200); const menuResponse = await request(app).get("/api/public/promotions?placement=MENU").expect(200);
    expect(homeResponse.body).toHaveLength(1); expect(homeResponse.body[0]).toMatchObject({ promotionId: home.id, productId: home.productId, name: "Pública 1501", placement: "HOME" }); expect(menuResponse.body).toHaveLength(1); expect(menuResponse.body[0].promotionId).toBe(menu.id); expect(Number(homeResponse.body[0].reductionPercent)).toBe(20);
    await prisma.offerConfig.update({ where: { id: "default" }, data: { showHomePromotions: false } });
    await request(app).get("/api/public/promotions?placement=HOME").expect(200).expect([]);
    await request(app).get("/api/public/promotions?placement=MENU").expect(200).expect((response) => expect(response.body.map((promotion: { promotionId: string }) => promotion.promotionId)).toEqual([menu.id]));
    await request(app).get("/api/public/promotions?placement=INVALID").expect(400); await request(app).get("/api/public/promotions").expect(400);
    expect(await prisma.product.findMany()).toEqual(before); expect(await prisma.priceHistory.count()).toBe(history); expect(await prisma.promotionSystemEvent.count()).toBe(events);
  });
});
