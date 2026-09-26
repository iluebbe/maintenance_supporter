/**
 * #189: the titles of the calendar events behind a calendar-driven task's
 * next due date — a single Waste Collection Schedule calendar names every
 * pickup after its bin, so "Put the bins out · Residual waste, Paper" tells
 * which one goes out. The backend computes them (`next_event_titles`, the
 * same text notifications and the to-do list carry); every list shows them
 * muted after the task name. The task's own name never changes.
 */

import { html, nothing } from "lit";

export function renderEventTitles(titles: readonly string[] | null | undefined) {
  const list = (titles ?? []).filter((t) => !!t);
  if (!list.length) return nothing;
  return html`<span class="event-titles"> · ${list.join(", ")}</span>`;
}
