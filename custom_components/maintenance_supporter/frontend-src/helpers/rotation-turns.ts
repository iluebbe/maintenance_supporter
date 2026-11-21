/**
 * D#284: a rotation by weekday, and whose turn the coming dates are.
 *
 * `weekday_assignees` names a person per weekday (0 = Monday … 6 = Sunday,
 * null = anyone the task is shared with); the server derives the person on
 * duty from the due date's weekday (helpers/rotation_turns.py) and sends the
 * coming turns as `upcoming_turns`.
 */

import { html, nothing, type TemplateResult } from "lit";
import { formatDate, formatDayShort, t } from "../styles";
import { renderPersonAvatar, type PersonDisplay } from "./person";
import { weekdayShortNames } from "./weekday-chips";

export const BY_WEEKDAY = "by_weekday";
export type WeekdayAssignees = Array<string | null>;

/** Seven entries, each a person of `pool` or null. */
export function cleanWeekdays(raw: readonly unknown[] | null | undefined, pool: readonly string[]): WeekdayAssignees {
  const days = Array.from({ length: 7 }, (_, i) => {
    const v = raw?.[i];
    return typeof v === "string" && pool.includes(v) ? v : null;
  });
  return days;
}

/** A click on `day` in `userId`'s row: theirs again → nobody's; else theirs
 *  (taken from whoever had it). */
export function toggleWeekdayOwner(days: WeekdayAssignees, day: number, userId: string): WeekdayAssignees {
  return days.map((owner, i) => (i !== day ? owner : owner === userId ? null : userId));
}

/** The days nobody has, in week order. */
export function unassignedDays(days: WeekdayAssignees): number[] {
  return days.flatMap((owner, i) => (owner ? [] : [i]));
}

/** "Sat, Sun: anyone it is shared with" — the days nobody has. */
export function restLine(days: WeekdayAssignees, lang: string): string {
  const rest = unassignedDays(days);
  if (!rest.length) return "";
  const names = weekdayShortNames(lang);
  return t("rotation_weekday_rest", lang).replace("{days}", rest.map((d) => names[d]).join(", "));
}

/** How many turns the task page lists. The server sends more (as many as it
 *  takes for everybody to have five, for the calendar's *My tasks*). */
export const SHOWN_TURNS = 6;

/** The task page's "Next turns": a date and a person per coming due date. */
export function renderUpcomingTurns(
  turns: ReadonlyArray<{ date: string; user_id: string | null }> | null | undefined,
  lang: string,
  getPerson: ((userId: string) => PersonDisplay | null) | undefined,
  getUserName: (userId: string) => string | null,
): TemplateResult | typeof nothing {
  if (!turns || turns.length < 2) return nothing;
  return html`
    <div class="upcoming-turns" role="list" aria-label=${t("rotation_upcoming", lang)}>
      <span class="upcoming-turns-label">${t("rotation_upcoming", lang)}</span>
      ${turns.slice(0, SHOWN_TURNS).map((turn) => {
        const person = turn.user_id ? (getPerson?.(turn.user_id) ?? null) : null;
        const name = turn.user_id ? (person?.name ?? getUserName(turn.user_id) ?? turn.user_id) : t("rotation_turn_anyone", lang);
        return html`
          <span class="upcoming-turn ${turn.user_id ? "" : "anyone"}" role="listitem" data-date=${turn.date} title=${formatDate(turn.date, lang)}>
            <span class="upcoming-turn-date">${formatDayShort(turn.date, lang)}</span>
            ${person ? renderPersonAvatar(person) : nothing}
            <span class="upcoming-turn-name">${name}</span>
          </span>`;
      })}
    </div>`;
}
