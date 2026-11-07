import { describe, expect, it } from "vitest";
import { parseEnvironment } from "../src/config/env.js";

const requiredEnvironment = {
  DATABASE_URL: "postgresql://localhost:5432/bowling_club_test",
  APP_ORIGIN: "http://localhost:5173",
  NEGOPLUS_BASE_URL: "https://bowlinggimnasia.negoplus.com.ar",
};

describe("environment parsing", () => {
  it("enables the local scheduler for the explicit true value", () => {
    expect(parseEnvironment({ ...requiredEnvironment, SYNC_LOCAL_SCHEDULER_ENABLED: "true" }).SYNC_LOCAL_SCHEDULER_ENABLED).toBe(true);
  });

  it("disables the local scheduler for the explicit false value", () => {
    expect(parseEnvironment({ ...requiredEnvironment, SYNC_LOCAL_SCHEDULER_ENABLED: "false" }).SYNC_LOCAL_SCHEDULER_ENABLED).toBe(false);
  });

  it("enables the local scheduler by default when the variable is undefined", () => {
    expect(parseEnvironment(requiredEnvironment).SYNC_LOCAL_SCHEDULER_ENABLED).toBe(true);
  });
});
