import { describe, expect, it } from "vitest";
import { getEffectiveTheme, getOperationalStatus } from "../src/modules/hours/status.js";

const everyDay = Array.from({ length: 7 }, (_, dayOfWeek) => ({ dayOfWeek, opensAt: "19:30", closesAt: "04:30", closed: false }));
const at = (value: string) => new Date(value);

describe("business operational status in Buenos Aires", () => {
  it("opens at exactly 19:30 regardless of visitor time zone", () => expect(getOperationalStatus(everyDay, at("2026-01-06T22:30:00.000Z")).isOpen).toBe(true));
  it("is closed at exactly 04:30", () => expect(getOperationalStatus(everyDay, at("2026-01-06T07:30:00.000Z")).isOpen).toBe(false));
  it("keeps the prior day open after midnight", () => expect(getOperationalStatus([{ ...everyDay[1], dayOfWeek: 1 }, ...everyDay.filter(({ dayOfWeek }) => dayOfWeek !== 1).map((hour) => ({ ...hour, closed: true }))], at("2026-01-06T06:00:00.000Z")).isOpen).toBe(true));
  it("does not open a closed day", () => expect(getOperationalStatus(everyDay.map((hour) => hour.dayOfWeek === 2 ? { ...hour, closed: true } : hour), at("2026-01-06T23:00:00.000Z")).isOpen).toBe(false));
  it("supports same-day schedules", () => expect(getOperationalStatus(everyDay.map((hour) => hour.dayOfWeek === 2 ? { ...hour, opensAt: "10:00", closesAt: "18:00" } : { ...hour, closed: true }), at("2026-01-06T15:00:00.000Z")).isOpen).toBe(true));
  it("uses the operation state only in automatic mode", () => {
    expect(getEffectiveTheme("AUTOMATIC", true)).toBe("DARK");
    expect(getEffectiveTheme("AUTOMATIC", false)).toBe("LIGHT");
    expect(getEffectiveTheme("DARK", false)).toBe("DARK");
    expect(getEffectiveTheme("LIGHT", true)).toBe("LIGHT");
  });
});
