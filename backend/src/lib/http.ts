import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) return res.status(400).json({ error: "Datos inválidos", details: error.flatten() });
  if (error instanceof HttpError) return res.status(error.status).json({ error: error.message });
  console.error("Unhandled request error", error instanceof Error ? error.message : "unknown");
  return res.status(500).json({ error: "Error interno" });
}
