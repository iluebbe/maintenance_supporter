/**
 * #189: the titles of the calendar events behind a calendar-driven task's
 * next due date — a single Waste Collection Schedule calendar names every
 * pickup after its bin, so "Put the bins out · Residual waste, Paper" tells
 * which one goes out. The backend computes them (`next_event_titles`, the
 * same text notifications and the to-do list carry); every list shows them
 * muted after the task name. The task's own name never changes.
 */

import { html, nothing } from "lit";
import { formatNumber } from "../styles";

export function renderEventTitles(titles: readonly string[] | null | undefined) {
  const list = (titles ?? []).filter((t) => !!t);
  if (!list.length) return nothing;
  return html`<span class="event-titles"> · ${list.join(", ")}</span>`;
}

/** #228: what an active sensor trigger is about (`trigger_detail`, the value
 *  of its *Show with the task* attribute): "Buy medicine · Trulicity: 3
 *  left". Muted after the name like the event titles; the backend sends it
 *  only while the trigger is active, and the reminder carries the same text. */
/** The trigger detail in the viewer's number format. The backend writes
 *  its decimals with a point and names them (`trigger_detail_numbers`):
 *  it does not know who is looking, and a text the watched entity wrote
 *  itself ("v1.10") is not a number to rewrite. */
export function triggerDetailText(
  task: { trigger_detail?: string | null; trigger_detail_numbers?: readonly string[] | null } | null | undefined,
  lang?: string,
): string | null {
  let text = task?.trigger_detail;
  if (!text) return null;
  for (const raw of task?.trigger_detail_numbers ?? []) {
    if (typeof raw !== "string" || !/^-?\d+\.\d+$/.test(raw)) continue;
    const shown = formatNumber(Number(raw), lang, { maximumFractionDigits: 10 });
    if (shown === raw) continue;
    // Not inside a longer number ("1.5" in "11.55"); no lookbehind, which
    // older WebViews do not parse.
    const pattern = new RegExp(`(^|[^\\d.,])${raw.replace(".", "\\.")}(?![\\d])`, "g");
    text = text.replace(pattern, (_m, before: string) => before + shown);
  }
  return text;
}

export function renderTriggerDetail(detail: string | null | undefined) {
  return detail ? html`<span class="event-titles trigger-detail"> · ${detail}</span>` : nothing;
}

/** A task's name with both, as every list and the task page show it. The
 *  quick-actions dialogs showed the bare name: the card row read "Buy
 *  medicine · Trulicity: 3 left", the dialog it opened "Buy medicine" (DRY
 *  audit 2026-10-30, FE6-A5). */
export function renderTaskTitle(name: string, titles: readonly string[] | null | undefined, detail: string | null | undefined) {
  return html`${name}${renderEventTitles(titles)}${renderTriggerDetail(detail)}`;
}

/** The same as text, for a title that takes no markup (HA's dialog header). */
export function taskTitleText(name: string, titles: readonly string[] | null | undefined, detail: string | null | undefined): string {
  const events = (titles ?? []).filter((t) => !!t).join(", ");
  return [name, events, detail ?? ""].filter((part) => !!part).join(" · ");
}
