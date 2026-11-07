import "dotenv/config";

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL ?? "postgresql://localhost:5432/bowling_club_test?schema=public";
process.env.APP_ORIGIN = "http://localhost:5173";
process.env.NEGOPLUS_BASE_URL = "https://bowlinggimnasia.negoplus.com.ar";
process.env.INTERNAL_SYNC_TOKEN = "test-internal-sync-token-that-is-at-least-32-characters";
