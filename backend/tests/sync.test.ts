import { Prisma } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import { acquireCatalogLock, CATALOG_LOCK_LEASE_MS, releaseCatalogLock, renewCatalogLock } from "../src/modules/sync/lock.js";
import { getPriceChange, synchronizeCatalog } from "../src/modules/sync/service.js";

type LockRecord = { id: string; ownerToken: string | null; lockedUntil: Date };

function createLockStore(initial?: LockRecord) {
  let record = initial;
  const syncLock = {
    upsert: vi.fn(async ({ create }: any) => {
      record ??= { ...create };
      return record;
    }),
    updateMany: vi.fn(async ({ where, data }: any) => {
      if (!record || record.id !== where.id) return { count: 0 };
      if (where.ownerToken !== undefined && record.ownerToken !== where.ownerToken) return { count: 0 };
      if (where.lockedUntil?.lte && !(record.lockedUntil <= where.lockedUntil.lte)) return { count: 0 };
      if (where.lockedUntil?.gt && !(record.lockedUntil > where.lockedUntil.gt)) return { count: 0 };
      record = { ...record, ...data };
      return { count: 1 };
    }),
  };
  return { client: { syncLock } as any, current: () => record };
}

describe("distributed catalog lock", () => {
  it("allows only one concurrent claimant", async () => {
    const store = createLockStore();
    const now = new Date("2026-10-19T12:00:00Z");
    const [first, second] = await Promise.all([acquireCatalogLock(store.client, now), acquireCatalogLock(store.client, now)]);

    expect([first, second].filter(Boolean)).toHaveLength(1);
  });

  it("renews only the active owner's lease and recovers after expiration", async () => {
    const store = createLockStore();
    const start = new Date("2026-10-19T12:00:00Z");
    const first = await acquireCatalogLock(store.client, start);
    expect(first).toBeTruthy();
    expect(await renewCatalogLock(store.client, first!, new Date(start.getTime() + 10_000))).toBe(true);

    const afterExpiry = new Date(start.getTime() + 31 * 60_000);
    const second = await acquireCatalogLock(store.client, afterExpiry);
    expect(second).toBeTruthy();
    expect(second).not.toBe(first);
    expect(await renewCatalogLock(store.client, first!, afterExpiry)).toBe(false);
    expect(await releaseCatalogLock(store.client, first!)).toBe(false);
    expect(store.current()?.ownerToken).toBe(second);
  });

  it("releases a lock after a synchronization error without releasing another owner", async () => {
    const store = createLockStore();
    const syncRun = { create: vi.fn(async () => ({ id: "run-1" })), update: vi.fn(async () => ({})) };
    const database = { syncLock: store.client.syncLock, syncRun, $transaction: vi.fn() } as any;
    const negoPlusClient = { getCategories: vi.fn(async () => []), getProducts: vi.fn(async () => []) };

    await expect(synchronizeCatalog({ prisma: database, negoPlusClient })).rejects.toThrow("Respuesta vacía");
    expect(store.current()?.ownerToken).toBeNull();
    expect(syncRun.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: "FAILED" }) }));
  });

  it("automatically renews the lease while NegoPlus is still responding", async () => {
    vi.useFakeTimers();
    const store = createLockStore();
    const syncRun = { create: vi.fn(async () => ({ id: "run-1" })), update: vi.fn(async () => ({})) };
    const database = { syncLock: store.client.syncLock, syncRun, $transaction: vi.fn() } as any;
    let resolveCategories!: (value: []) => void;
    let resolveProducts!: (value: []) => void;
    const negoPlusClient = {
      getCategories: vi.fn(() => new Promise<[]>(resolve => { resolveCategories = resolve; })),
      getProducts: vi.fn(() => new Promise<[]>(resolve => { resolveProducts = resolve; })),
    };

    try {
      const sync = synchronizeCatalog({ prisma: database, negoPlusClient });
      await vi.advanceTimersByTimeAsync(CATALOG_LOCK_LEASE_MS / 3);
      expect(store.client.syncLock.updateMany).toHaveBeenCalledTimes(2); // claim plus renewal
      resolveCategories([]);
      resolveProducts([]);
      await expect(sync).rejects.toThrow("Respuesta vacía");
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("price change detection", () => {
  it("records decreases and ignores equal or increased prices", () => {
    const previous = new Prisma.Decimal("100");
    expect(getPriceChange(previous, new Prisma.Decimal("80"))).toMatchObject({ isPriceDecrease: true, reductionPercent: new Prisma.Decimal("20") });
    expect(getPriceChange(previous, new Prisma.Decimal("100"))).toEqual({ isPriceDecrease: false, reductionPercent: null });
    expect(getPriceChange(previous, new Prisma.Decimal("120"))).toEqual({ isPriceDecrease: false, reductionPercent: null });
  });
});
