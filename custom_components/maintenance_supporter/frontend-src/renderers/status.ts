/** A task's status as the user sees it — THE derivation for every surface.
 *
 * The backend's `status` alone is not what a pill should say: an archived
 * task shows "Archived", a completed one-time task ("done", never re-arms)
 * shows "Completed" — its raw status is a green "ok". The panel rows, the
 * task-detail header chip and the two Lovelace quick-action dialogs each
 * derived this on their own; the dialogs painted a finished one-time task
 * as a green OK, and the header chip had no colour at all for triggered /
 * paused / archived (DRY audit 2026-09-26). Colours and icons stay in
 * status-constants.ts; the pill CSS (`.status-badge.<key>`) in styles.ts,
 * the header chip (`.status-chip.<key>`) in panel-styles.ts — both are
 * tripwired to cover every key `statusKey()` can return.
 */

import { html } from "lit";
import { t } from "../styles";
import { STATUS_COLORS, STATUS_ICONS } from "../status-constants";

export interface StatusLike {
  status?: string | null;
  archived?: boolean | null;
  is_done?: boolean | null;
  schedule_type?: string | null;
  days_until_due?: number | null;
}

/** Every key statusKey() can return (the CSS tripwire iterates it). */
export const STATUS_KEYS = ["ok", "due_soon", "overdue", "triggered", "paused", "archived", "done", "no_due"] as const;

/** Muted blue-grey of a completed one-time task (matches `.status-badge.done`). */
export const DONE_COLOR = "var(--maint-done-color, #78909c)";

/** The muted text colour of a task without a due date — the same grey as its
 *  "done 23 d ago" in the due column (matches `.status-badge.no_due`). */
export const NO_DUE_COLOR = "var(--secondary-text-color, #727272)";

/** archived > done > a manual task without a due date > the backend status.
 *
 *  D#203: a manual task that only records when it was last done is "ok" to
 *  the backend for good, and its green OK pill looked like every task that
 *  is on schedule. It reads "No due date" instead. Display only: the status
 *  stays "ok" for counts, filters, sensors and automations, and a task with
 *  a postponed date (days_until_due set) shows its real status. */
export function statusKey(task: StatusLike): string {
  if (task.archived) return "archived";
  if (task.is_done) return "done";
  const status = task.status || "ok";
  if (status === "ok" && task.schedule_type === "manual" && task.days_until_due == null) return "no_due";
  return status;
}

const _LABEL_KEYS: Record<string, string> = { done: "completed", no_due: "no_due_date" };

export function statusLabel(key: string, lang: string): string {
  return t(_LABEL_KEYS[key] ?? key, lang);
}

export function statusColor(task: StatusLike): string {
  const key = statusKey(task);
  if (key === "done") return DONE_COLOR;
  if (key === "no_due") return NO_DUE_COLOR;
  return STATUS_COLORS[key] || "var(--disabled-color, #9e9e9e)";
}

export function statusIcon(key: string): string {
  if (key === "no_due") return "mdi:calendar-blank-outline";
  return STATUS_ICONS[key === "done" ? "completed" : key] || "mdi:circle-medium";
}

/** The status pill: icon + label + colour, so status is never conveyed by
 *  colour alone. `chip` is the larger header variant of the task detail.
 *  The label sits in its own span so narrow rows can drop it (#150) while
 *  `title` / `aria-label` keep the text reachable. */
export function renderStatusBadge(task: StatusLike, lang: string, variant: "pill" | "chip" = "pill") {
  const key = statusKey(task);
  const label = statusLabel(key, lang);
  if (variant === "chip") {
    return html`<span class="status-chip ${key}">${label}</span>`;
  }
  return html`<span class="status-badge ${key}" role="img" title="${label}" aria-label="${label}"><ha-icon icon="${statusIcon(key)}"></ha-icon><span class="status-label">${label}</span></span>`;
}
