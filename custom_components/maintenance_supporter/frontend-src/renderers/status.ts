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
}

/** Every key statusKey() can return (the CSS tripwire iterates it). */
export const STATUS_KEYS = ["ok", "due_soon", "overdue", "triggered", "paused", "archived", "done"] as const;

/** Muted blue-grey of a completed one-time task (matches `.status-badge.done`). */
export const DONE_COLOR = "var(--maint-done-color, #78909c)";

/** archived > done > the backend status. */
export function statusKey(task: StatusLike): string {
  if (task.archived) return "archived";
  if (task.is_done) return "done";
  return task.status || "ok";
}

export function statusLabel(key: string, lang: string): string {
  return t(key === "done" ? "completed" : key, lang);
}

export function statusColor(task: StatusLike): string {
  const key = statusKey(task);
  return key === "done" ? DONE_COLOR : (STATUS_COLORS[key] || "var(--disabled-color, #9e9e9e)");
}

export function statusIcon(key: string): string {
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
