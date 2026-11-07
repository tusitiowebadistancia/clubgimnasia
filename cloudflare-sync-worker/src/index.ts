export interface Env {
  SYNC_ENDPOINT_URL: string;
  INTERNAL_SYNC_TOKEN: string;
}

async function invokeCatalogSync(env: Env) {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    const response = await fetch(env.SYNC_ENDPOINT_URL, {
      method: "POST",
      headers: { authorization: `Bearer ${env.INTERNAL_SYNC_TOKEN}`, accept: "application/json" },
      signal: controller.signal,
    });
    const body = await response.text();
    const durationMs = Date.now() - startedAt;
    if (!response.ok) throw new Error(`Sync endpoint returned ${response.status} in ${durationMs}ms: ${body.slice(0, 500)}`);
    console.log(JSON.stringify({ event: "catalog_sync_succeeded", durationMs, response: body.slice(0, 500) }));
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    console.error(JSON.stringify({ event: "catalog_sync_failed", durationMs, error: error instanceof Error ? error.message : "unknown" }));
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export default {
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(invokeCatalogSync(env));
  },
};
