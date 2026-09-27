/** Status colors + icons — THE single source for every renderer.
 *
 * Dependency-free on purpose: the dashboard strategy bundle must stay lean
 * (HA's strategy loader has a 5 s whenDefined timeout, and pulling styles.ts
 * would drag Lit + locale machinery in). styles.ts re-exports these for the
 * panel/card, the strategy imports them directly. A DRY audit (2026-07-10)
 * found the strategy hardcoding its own icon set — the auto-generated
 * "Overdue" view wore the panel's DUE-SOON icon. Import from here instead.
 */

export const STATUS_COLORS: Record<string, string> = {
  ok: "var(--success-color, #4caf50)",
  due_soon: "var(--warning-color, #ff9800)",
  overdue: "var(--error-color, #f44336)",
  // Theme-token first so it adapts to dark/custom themes (was a bare #ff5722).
  triggered: "var(--deep-orange-color, #ff5722)",
  // v2.10.0: archived is a neutral, greyed-out state (retired but retained).
  archived: "var(--disabled-color, #9e9e9e)",
  // v2.20 (N3): paused is frozen-but-present — info blue, clearly not urgent.
  paused: "var(--info-color, #2196f3)",
};

/** The live task statuses by urgency, most urgent first — the order every
 *  list sorts by and every status picker offers (the card editor's filter,
 *  the panel's status filter, the calendar pills). Four hand-kept copies of
 *  the rank map and the list had drifted: the panel's filter offered
 *  overdue → due soon → triggered while every sort ranked triggered above
 *  due soon (DRY audit 2026-09-26). archived / paused are deliberately not
 *  here — they are states of the object, not a place in the queue. */
export const STATUS_ORDER = ["overdue", "triggered", "due_soon", "ok"] as const;

/** The statuses that want attention — the card's default filter and the
 *  strategy's "actionable" view. Python twin: helpers/todo_mirror
 *  MIRRORED_STATUSES / intent._ACTIONABLE (tests/test_frontend_const_parity.py). */
export const ACTIONABLE_STATUSES = ["overdue", "triggered", "due_soon"] as const;

const _STATUS_RANK: Record<string, number> = Object.fromEntries(STATUS_ORDER.map((s, i) => [s, i]));

/** Sort rank of a status (lower = more urgent); anything outside
 *  STATUS_ORDER sorts after "ok". */
export function statusRank(status: string | null | undefined): number {
  return _STATUS_RANK[status ?? ""] ?? STATUS_ORDER.length;
}

export type ActionableStatus = (typeof ACTIONABLE_STATUSES)[number];

export function isActionableStatus(status: string | null | undefined): status is ActionableStatus {
  return (ACTIONABLE_STATUSES as readonly string[]).includes(status ?? "");
}

export const STATUS_ICONS: Record<string, string> = {
  ok: "mdi:check-circle",
  due_soon: "mdi:alert-circle",
  overdue: "mdi:alert-octagon",
  triggered: "mdi:bell-alert",
  archived: "mdi:archive-outline",
  paused: "mdi:pause-circle-outline",
  completed: "mdi:check-circle",
  skipped: "mdi:skip-next",
  missed: "mdi:calendar-remove",
  reset: "mdi:refresh",
};
