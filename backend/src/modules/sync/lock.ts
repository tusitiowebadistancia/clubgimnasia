import { randomUUID } from "node:crypto";
import type { PrismaClient } from "@prisma/client";

const LOCK_ID = "catalog";
export const CATALOG_LOCK_LEASE_MS = 30 * 60_000;

type SyncLockClient = Pick<PrismaClient, "syncLock">;

export async function acquireCatalogLock(client: SyncLockClient, now = new Date()): Promise<string | null> {
  const ownerToken = randomUUID();
  await client.syncLock.upsert({
    where: { id: LOCK_ID },
    create: { id: LOCK_ID, ownerToken: null, lockedUntil: new Date(0) },
    update: {},
  });
  const claim = await client.syncLock.updateMany({
    where: { id: LOCK_ID, lockedUntil: { lte: now } },
    data: { ownerToken, lockedUntil: new Date(now.getTime() + CATALOG_LOCK_LEASE_MS) },
  });
  return claim.count === 1 ? ownerToken : null;
}

export async function renewCatalogLock(client: SyncLockClient, ownerToken: string, now = new Date()): Promise<boolean> {
  const renewal = await client.syncLock.updateMany({
    where: { id: LOCK_ID, ownerToken, lockedUntil: { gt: now } },
    data: { lockedUntil: new Date(now.getTime() + CATALOG_LOCK_LEASE_MS) },
  });
  return renewal.count === 1;
}

export async function releaseCatalogLock(client: SyncLockClient, ownerToken: string): Promise<boolean> {
  const release = await client.syncLock.updateMany({
    where: { id: LOCK_ID, ownerToken },
    data: { ownerToken: null, lockedUntil: new Date(0) },
  });
  return release.count === 1;
}
