export const BUSINESS_TIME_ZONE = "America/Argentina/Buenos_Aires";

export type BusinessHoursInput = { dayOfWeek: number; opensAt: string | null; closesAt: string | null; closed: boolean };

const weekdays: Record<string, number> = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };

function localParts(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: BUSINESS_TIME_ZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23", weekday: "long" }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return { dayOfWeek: weekdays[get("weekday")], minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

function minutes(value: string) {
  const [hours, minute] = value.split(":").map(Number);
  return hours * 60 + minute;
}

export function getOperationalStatus(hours: BusinessHoursInput[], now = new Date()) {
  const { dayOfWeek, minutes: currentMinutes } = localParts(now);
  const byDay = new Map(hours.map((value) => [value.dayOfWeek, value]));
  const today = byDay.get(dayOfWeek);
  const previous = byDay.get((dayOfWeek + 6) % 7);
  const isOpenToday = Boolean(today && !today.closed && today.opensAt && today.closesAt && (minutes(today.closesAt) > minutes(today.opensAt) ? currentMinutes >= minutes(today.opensAt) && currentMinutes < minutes(today.closesAt) : currentMinutes >= minutes(today.opensAt)));
  const isOpenFromPreviousDay = Boolean(previous && !previous.closed && previous.opensAt && previous.closesAt && minutes(previous.closesAt) <= minutes(previous.opensAt) && currentMinutes < minutes(previous.closesAt));
  return { isOpen: isOpenToday || isOpenFromPreviousDay, timeZone: BUSINESS_TIME_ZONE };
}

export function getEffectiveTheme(themeMode: "AUTOMATIC" | "DARK" | "LIGHT", isOpen: boolean) {
  return themeMode === "AUTOMATIC" ? (isOpen ? "DARK" : "LIGHT") : themeMode;
}
