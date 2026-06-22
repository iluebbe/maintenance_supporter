/** (#67) Warranty status computation for object asset tracking.
 *
 * Pure, side-effect-free, and `today`-injectable so it can be unit-tested
 * deterministically without faking the system clock.
 */

export type WarrantyStatusKind = "valid" | "expiring" | "expired" | "none";

export interface WarrantyStatus {
  kind: WarrantyStatusKind;
  /** Whole days until expiry (negative once expired); null when no date. */
  days: number | null;
  /** The ISO date string echoed back, or null when absent/invalid. */
  date: string | null;
}

/** Days before expiry at which the warranty is flagged as "expiring" (amber). */
export const WARRANTY_WARN_DAYS = 60;

/**
 * Classify an object's warranty expiry date relative to `today`.
 *
 * @param iso    ISO `YYYY-MM-DD` warranty expiry date (null/undefined/""/invalid → "none").
 * @param today  Reference date; defaults to now. Injectable for deterministic tests.
 */
export function warrantyStatus(
  iso: string | null | undefined,
  today: Date = new Date(),
): WarrantyStatus {
  if (!iso) return { kind: "none", days: null, date: null };
  const exp = new Date(`${iso}T00:00:00`);
  if (isNaN(exp.getTime())) return { kind: "none", days: null, date: null };
  // Normalize both ends to local midnight so the difference is whole days
  // regardless of the time-of-day component of `today`.
  const t0 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const t1 = Date.UTC(exp.getFullYear(), exp.getMonth(), exp.getDate());
  const days = Math.round((t1 - t0) / 86400000);
  if (days < 0) return { kind: "expired", days, date: iso };
  if (days <= WARRANTY_WARN_DAYS) return { kind: "expiring", days, date: iso };
  return { kind: "valid", days, date: iso };
}
