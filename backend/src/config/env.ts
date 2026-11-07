import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().url(),
  APP_ORIGIN: z.string().url(),
  PUBLIC_SITE_URL: z.string().url().default("https://bowlingclubgimnasia.com"),
  SESSION_COOKIE_NAME: z.string().min(1).default("bcg_admin_session"),
  CSRF_COOKIE_NAME: z.string().min(1).default("bcg_csrf"),
  SESSION_TTL_HOURS: z.coerce.number().int().min(1).max(168).default(12),
  NEGOPLUS_BASE_URL: z.string().url(),
  NEGOPLUS_BRANCH_ID: z.coerce.number().int().positive().default(5),
  NEGOPLUS_HEADERS_JSON: z.string().default("{}"),
  NEGOPLUS_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(10000),
  SYNC_INTERVAL_MINUTES: z.coerce.number().int().min(5).max(1440).default(15),
  SYNC_LOCAL_SCHEDULER_ENABLED: z.enum(["true", "false"]).default("true").transform((value) => value === "true"),
  INTERNAL_SYNC_TOKEN: z.string().min(32).optional(),
}).superRefine((value, context) => {
  if (value.NODE_ENV === "production" && !value.INTERNAL_SYNC_TOKEN) context.addIssue({ code: z.ZodIssueCode.custom, path: ["INTERNAL_SYNC_TOKEN"], message: "INTERNAL_SYNC_TOKEN es obligatorio en producción" });
});

export function parseEnvironment(input: NodeJS.ProcessEnv) {
  return schema.parse(input);
}

export const env = parseEnvironment(process.env);
export const negoPlusHeaders: Record<string, string> = z.record(z.string()).parse(JSON.parse(env.NEGOPLUS_HEADERS_JSON));
