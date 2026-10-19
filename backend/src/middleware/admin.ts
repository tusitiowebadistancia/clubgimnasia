import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { HttpError } from "../lib/http.js";
import { getAdminFromToken } from "../modules/auth/service.js";

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const admin = await getAdminFromToken(req.cookies?.[env.SESSION_COOKIE_NAME]);
  if (!admin) return next(new HttpError(401, "Autenticación requerida"));
  res.locals.admin = admin;
  next();
}

export function requireCsrf(req: Request, _res: Response, next: NextFunction) {
  const origin = req.get("origin");
  const token = req.get("x-csrf-token");
  if (origin !== env.APP_ORIGIN || !token || token !== req.cookies?.[env.CSRF_COOKIE_NAME]) return next(new HttpError(403, "Solicitud CSRF rechazada"));
  next();
}
