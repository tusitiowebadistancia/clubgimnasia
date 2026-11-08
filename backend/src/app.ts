import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { errorHandler } from "./lib/http.js";
import { adminRouter, authRouter, internalRouter } from "./routes/admin.js";
import { publicRouter } from "./routes/public.js";
import { adminPromotionsRouter } from "./routes/admin-promotions.js";

function createLoginRateLimiter() {
  return rateLimit({
  windowMs: 15 * 60_000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res) => {
    const rateLimitMetadata = (req as typeof req & { rateLimit?: { resetTime?: Date } }).rateLimit;
    const resetAt = rateLimitMetadata?.resetTime?.getTime() ?? Date.now() + 15 * 60_000;
    const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
    const minutes = Math.floor(retryAfterSeconds / 60);
    const seconds = retryAfterSeconds % 60;
    const wait = minutes ? `${minutes} min${minutes === 1 ? "" : "s"}${seconds ? ` y ${seconds} s` : ""}` : `${seconds} s`;
    res.setHeader("Retry-After", retryAfterSeconds);
    res.status(429).json({ error: `Demasiados intentos. Intentá nuevamente en ${wait}.`, retryAfterSeconds });
  },
  });
}

const orderRateLimiter = rateLimit({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({ error: "Demasiados pedidos. Intentá nuevamente en un minuto." }),
});

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: (origin, callback) => callback(null, !origin || origin === env.APP_ORIGIN), methods: ["GET", "POST", "PUT", "PATCH"], credentials: true }));
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());
  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api/public/orders", orderRateLimiter);
  app.use("/api/public", rateLimit({ windowMs: 60_000, limit: 120 }), publicRouter);
  app.use("/api/admin/auth/login", createLoginRateLimiter());
  app.use("/api/admin/auth", authRouter);
  app.use("/api/internal", rateLimit({ windowMs: 60_000, limit: 8 }), internalRouter);
  app.use("/api/admin/promotions", rateLimit({ windowMs: 60_000, limit: 60 }), adminPromotionsRouter);
  app.use("/api/admin", rateLimit({ windowMs: 60_000, limit: 60 }), adminRouter);
  app.use(errorHandler);
  return app;
}
