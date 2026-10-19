import { describe, expect, it, vi } from "vitest";
import { startCatalogScheduler } from "../src/modules/sync/scheduler.js";

describe("catalog scheduler", () => {
  it("runs immediately and at the configured interval", async () => {
    vi.useFakeTimers();
    const synchronize = vi.fn(async () => undefined);

    try {
      const stop = startCatalogScheduler(synchronize);
      expect(synchronize).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(15 * 60_000);
      expect(synchronize).toHaveBeenCalledTimes(2);

      stop();
      await vi.advanceTimersByTimeAsync(15 * 60_000);
      expect(synchronize).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });
});
