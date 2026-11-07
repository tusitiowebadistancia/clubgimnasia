import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import { createApp } from "./app.js";
import { startCatalogScheduler } from "./modules/sync/scheduler.js";

const server = createApp().listen(env.PORT, () => console.info(`Backend listening on ${env.PORT}`));
const stopScheduler = env.SYNC_LOCAL_SCHEDULER_ENABLED ? startCatalogScheduler() : () => undefined;
async function shutdown() { stopScheduler(); server.close(); await prisma.$disconnect(); }
process.once("SIGINT", shutdown); process.once("SIGTERM", shutdown);
