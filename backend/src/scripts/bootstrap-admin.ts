import "dotenv/config";
import argon2 from "argon2";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const input = z.object({ ADMIN_EMAIL: z.string().email(), ADMIN_PASSWORD: z.string().min(12).max(256) }).parse(process.env);
const existing = await prisma.admin.count();
if (existing > 0) throw new Error("Ya existe un administrador; el bootstrap sólo puede ejecutarse una vez.");
await prisma.admin.create({ data: { email: input.ADMIN_EMAIL.toLowerCase(), passwordHash: await argon2.hash(input.ADMIN_PASSWORD, { type: argon2.argon2id }) } });
console.info("Administrador inicial creado.");
await prisma.$disconnect();
