/**
 * Where a vacation stands — one rule for the panel's settings and the
 * Lovelace vacation card. The settings said "ended" for a window that had
 * passed while the card still read "Scheduled", and the settings judged the
 * end by a UTC midnight instead of Home Assistant's day (DRY audit
 * 2026-10-12, FE5-A6).
 */

import { haToday } from "./ha-time";

export type VacationPhase = "active" | "scheduled" | "ended" | "inactive";

export interface VacationPhaseInput {
  enabled?: boolean | null;
  is_active?: boolean | null;
  /** The last day the vacation (with its buffer) covers, "YYYY-MM-DD…". */
  window_end?: string | null;
}

export function vacationPhase(s: VacationPhaseInput, today: string = haToday()): VacationPhase {
  if (s.is_active) return "active";
  if (!s.enabled) return "inactive";
  const end = s.window_end ? s.window_end.slice(0, 10) : "";
  return end && end < today ? "ended" : "scheduled";
}
