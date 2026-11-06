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
 */

import type { TriggerConfig } from "../types";

interface TaskLike {
  trigger_active?: boolean | null;
  trigger_config?: TriggerConfig | null;
}

export function completesItself(task: TaskLike | null | undefined): boolean {
  const tc = task?.trigger_config;
  if (!tc || tc.auto_complete_on_recovery !== true || task?.trigger_active !== true) return false;
  if (tc.type === "state_change") {
    // A latch (one transition, a from- or to-state) ends; a counter of changes does not.
    return (tc.trigger_target_changes ?? 1) === 1 && !!(tc.trigger_from_state || tc.trigger_to_state);
  }
  return tc.type === "threshold" || tc.type === "due_date" || tc.type === "compound";
}
