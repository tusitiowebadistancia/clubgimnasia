import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { errorHandler } from "./lib/http.js";
import { adminRouter, authRouter } from "./routes/admin.js";
import { publicRouter } from "./routes/public.js";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: (origin, callback) => callback(null, !origin || origin === env.APP_ORIGIN), methods: ["GET", "POST", "PUT"], credentials: true }));
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());
  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api/public", rateLimit({ windowMs: 60_000, limit: 120 }), publicRouter);
  app.use("/api/admin/auth", rateLimit({ windowMs: 15 * 60_000, limit: 5, standardHeaders: "draft-8", legacyHeaders: false }), authRouter);
  app.use("/api/admin", rateLimit({ windowMs: 60_000, limit: 60 }), adminRouter);
  app.use(errorHandler);
  return app;
}
