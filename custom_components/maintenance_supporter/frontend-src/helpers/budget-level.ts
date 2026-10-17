/** How full a budget is and how loudly to say it — the panel's budget tiles
 *  and the dashboard's budget card. Each worked it out on its own, and the
 *  panel's copy had no default for a missing alert threshold, so it never
 *  warned (DRY audit 2026-10-12). */

/** helpers/settings_registry.py's default for budget_alert_threshold
 *  (pinned by tests/test_frontend_const_parity.py). */
export const DEFAULT_ALERT_THRESHOLD_PCT = 80;

export type BudgetLevel = "ok" | "warning" | "danger";

/** The bar's fill (0-100) and its level: danger from 100 %, warning from the
 *  configured alert threshold. `budget` must be above 0 (a budget without a
 *  maximum shows its plain spent total, no bar). */
export function budgetLevel(
  spent: number,
  budget: number,
  thresholdPct: number | null | undefined,
): { pct: number; level: BudgetLevel } {
  const pct = Math.min(100, Math.max(0, (spent / budget) * 100));
  const threshold = thresholdPct ?? DEFAULT_ALERT_THRESHOLD_PCT;
  return { pct, level: pct >= 100 ? "danger" : pct >= threshold ? "warning" : "ok" };
}
