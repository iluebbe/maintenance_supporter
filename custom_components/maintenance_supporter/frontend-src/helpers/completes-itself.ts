/**
 * D#250: a task that only its sensor completes, right now.
 *
 * Its trigger is active and records the task as done when it ends by itself
 * (*Record the task as done* / *Auto-complete when the sensor recovers*): the
 * robot vacuum's water tank is empty until someone fills it, and filling it
 * is the completion. A row's Complete and Skip are no use there, so the rows
 * of the card and the panel say so instead; the task's own page and menu
 * still complete it by hand (a broken sensor). A task due by its safety
 * interval, or not due, keeps them, and so does a counter or a runtime,
 * which never ends by itself.
 *
 * Its reminders carry no Complete and no Skip button either: the backend
 * twin is helpers/completes_itself.py, and both read the vectors in
 * __tests__/fixtures/completes-itself-vectors.json.
 */

import type { TriggerConfig } from "../types";
import { compoundLogic } from "./trigger-entities";

interface TaskLike {
  trigger_active?: boolean | null;
  trigger_config?: TriggerConfig | null;
}

/** A state rule that waits for one transition (a from- or a to-state): it
 *  ends when the entity leaves its alert state; a counter of changes does not. */
export function isStateLatch(tc: Pick<TriggerConfig, "type" | "trigger_target_changes" | "trigger_from_state" | "trigger_to_state"> | null | undefined): boolean {
  return !!tc && tc.type === "state_change" && (tc.trigger_target_changes ?? 1) === 1 && !!(tc.trigger_from_state || tc.trigger_to_state);
}

/** D#229: a rule whose verdict ends by itself can instead hold the task
 *  until it is done: a level or a state latch (helpers/completes_itself.py
 *  can_hold_until_done; the dialog kept its own list). */
export function canHoldUntilDone(tc: Pick<TriggerConfig, "type" | "trigger_target_changes" | "trigger_from_state" | "trigger_to_state"> | null | undefined): boolean {
  return !!tc && (tc.type === "threshold" || tc.type === "due_date" || isStateLatch(tc));
}

/** Whether a trigger's verdict ends without a completion: a level (a
 *  threshold, a date from a sensor), a state latch, or a compound whose
 *  conditions let it end. An AND rule ends as soon as one of its
 *  conditions does, an OR rule only once all of them can (the compound's
 *  recovery); a counter or a runtime never ends by itself. */
export function endsByItself(tc: TriggerConfig | null | undefined): boolean {
  if (!tc) return false;
  if (canHoldUntilDone(tc)) return true;
  if (tc.type === "compound") {
    const conditions = (tc.conditions ?? []).filter((c) => !!c && typeof c === "object");
    if (!conditions.length) return false;
    const ends = conditions.map((c) => endsByItself(c));
    return compoundLogic(tc) === "AND" ? ends.some(Boolean) : ends.every(Boolean);
  }
  return false;
}

export function completesItself(task: TaskLike | null | undefined): boolean {
  const tc = task?.trigger_config;
  if (!tc || tc.auto_complete_on_recovery !== true || task?.trigger_active !== true) return false;
  return endsByItself(tc);
}
