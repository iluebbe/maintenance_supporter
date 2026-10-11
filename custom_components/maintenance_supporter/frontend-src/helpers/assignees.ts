/** Who a task is meant for: the one rule every person filter reads.
 *
 * Mirrors `helpers/assignees.py`: a task is meant for its responsible person
 * (on a rotation, whoever's turn it is). When nobody is responsible but the
 * task is shared with people ("Shared with" without a rotation, discussion
 * #110), it is meant for each of them, so it shows up under each one's
 * filter. A task with neither matches no person filter.
 */

export interface AssignedTask {
  responsible_user_id?: string | null;
  assignee_pool?: string[] | null;
}

/** The HA user ids the task is meant for. */
export function taskUserIds(task: AssignedTask): string[] {
  if (task.responsible_user_id) return [task.responsible_user_id];
  return [...new Set((task.assignee_pool || []).filter((id) => typeof id === "string" && id))];
}

/** Is the task meant for this user — theirs, or shared with nobody on duty? */
export function taskIsFor(task: AssignedTask, userId: string | null | undefined): boolean {
  return !!userId && taskUserIds(task).includes(userId);
}
