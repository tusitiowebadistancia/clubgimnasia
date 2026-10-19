import crypto from "node:crypto";
import argon2 from "argon2";
import { env } from "../../config/env.js";
import { HttpError } from "../../lib/http.js";
import { prisma } from "../../lib/prisma.js";

const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");
export const sessionCookieOptions = { httpOnly: true, secure: env.NODE_ENV === "production", sameSite: "strict" as const, path: "/", maxAge: env.SESSION_TTL_HOURS * 3600_000 };

export async function createSession(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email: email.toLowerCase() } });
  if (!admin?.active || !(await argon2.verify(admin.passwordHash, password))) throw new HttpError(401, "Credenciales inválidas");
  const token = crypto.randomBytes(32).toString("base64url");
  await prisma.adminSession.create({ data: { adminId: admin.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + sessionCookieOptions.maxAge) } });
  return { token, admin };
}

export async function getAdminFromToken(token?: string) {
  if (!token) return null;
  const session = await prisma.adminSession.findUnique({ where: { tokenHash: hashToken(token) }, include: { admin: true } });
  if (!session || session.expiresAt < new Date() || !session.admin.active) return null;
  await prisma.adminSession.update({ where: { id: session.id }, data: { lastSeenAt: new Date() } });
  return session.admin;
}

export const revokeSession = (token: string) => prisma.adminSession.deleteMany({ where: { tokenHash: hashToken(token) } });
