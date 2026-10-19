import { env } from "../../config/env.js";
import { synchronizeCatalog } from "./service.js";

export function startCatalogScheduler() {
  const interval = env.SYNC_INTERVAL_MINUTES * 60_000;
  const run = () => synchronizeCatalog().catch((error) => console.error("Catalog sync failed", error instanceof Error ? error.message : "unknown"));
  const timer = setInterval(run, interval);
  timer.unref();
  run();
  return () => clearInterval(timer);
}
