import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

describe("API security boundaries", () => {
  const app = createApp();
  it("exposes a health check without private data", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("rejects unauthenticated administrative access", async () => {
    const response = await request(app).get("/api/admin/config");
    expect(response.status).toBe(401);
  });

  it("sets no access-control origin for untrusted origins", async () => {
    const response = await request(app).get("/health").set("Origin", "https://untrusted.example");
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
