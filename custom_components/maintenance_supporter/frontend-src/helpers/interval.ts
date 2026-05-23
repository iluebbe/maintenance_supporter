/**
 * Unit-aware interval math (issue #59). Mirrors the backend
 * `helpers/dates.add_interval` day-span so the frontend's progress bars and
 * calendar projection behave correctly for weeks/months/years schedules,
 * not just days. Pure functions — no i18n, unit-tested in interval.test.ts.
 */

/** Approximate days per interval unit (mean Gregorian month / Julian year). */
export const UNIT_DAYS: Record<string, number> = {
  days: 1,
  weeks: 7,
  months: 30.4368,
  years: 365.25,
};

/** Approximate length of `intervalDays` of `unit` in days; 0 when no interval. */
export function intervalSpanDays(
  intervalDays: number | null | undefined,
  unit?: string | null,
): number {
  if (!intervalDays || intervalDays <= 0) return 0;
  return intervalDays * (UNIT_DAYS[unit || "days"] ?? 1);
}

/**
 * Progress through the current cycle, unit-aware.
 * Returns a clamped 0–100 % plus `overflow` (raw % > 100, i.e. past due).
 * Falls back to {0, false} when there is no usable interval/countdown.
 */
export function daysProgress(
  intervalDays: number | null | undefined,
  daysUntilDue: number | null | undefined,
  unit?: string | null,
): { pct: number; overflow: boolean } {
  const span = intervalSpanDays(intervalDays, unit);
  if (span <= 0 || daysUntilDue == null) return { pct: 0, overflow: false };
  const raw = ((span - daysUntilDue) / span) * 100;
  return { pct: Math.max(0, Math.min(100, raw)), overflow: raw > 100 };
}
