import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

describe("API security boundaries", () => {
  const app = createApp();
  it("trusts only Render's single proxy hop for client rate limiting", () => {
    expect(app.get("trust proxy")).toBe(1);
  });

  it("exposes a health check without private data", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("rejects unauthenticated administrative access", async () => {
    const response = await request(app).get("/api/admin/config");
    expect(response.status).toBe(401);
  });

  it("rejects the internal catalog sync endpoint without the server token", async () => {
    const response = await request(app).post("/api/internal/sync").set("X-Forwarded-For", "198.51.100.10");
    expect(response.status).toBe(401);
  });

  it("rejects an invalid internal catalog sync token", async () => {
    const response = await request(app).post("/api/internal/sync").set("Authorization", "Bearer invalid-token");
    expect(response.status).toBe(401);
  });

  it("sets no access-control origin for untrusted origins", async () => {
    const response = await request(app).get("/health").set("Origin", "https://untrusted.example");
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("allows credentialed requests from the configured frontend subdomain", async () => {
    const response = await request(app).get("/health").set("Origin", "https://bowling.federicofigini.com");
    expect(response.headers["access-control-allow-origin"]).toBe("https://bowling.federicofigini.com");
    expect(response.headers["access-control-allow-credentials"]).toBe("true");
  });

  it("limits only credential submissions and exposes the actual retry time", async () => {
    for (let index = 0; index < 5; index += 1) await request(app).get("/api/admin/auth/session");
    const credentials = { email: "limit@example.test", password: "valid-test-password" };
    await expect(request(app).post("/api/admin/auth/login").send(credentials)).resolves.toMatchObject({ status: 401 });
    for (let index = 0; index < 4; index += 1) await request(app).post("/api/admin/auth/login").send(credentials);
    const response = await request(app).post("/api/admin/auth/login").send(credentials);
    expect(response.status).toBe(429);
    expect(Number(response.headers["retry-after"])).toBeGreaterThan(0);
    expect(response.body).toMatchObject({ retryAfterSeconds: Number(response.headers["retry-after"]) });
  });
});
