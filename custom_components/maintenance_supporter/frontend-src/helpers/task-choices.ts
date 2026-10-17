/** The fixed choice lists of a task — one copy for every dialog, filter and
 *  editor. The task dialog, the bulk edit, the panel's priority filter and
 *  the card editor each spelled them out, and only the task dialog's copy
 *  was pinned to the backend (DRY audit 2026-10-12).
 *
 *  Twins of the Python sources, pinned by tests/test_frontend_const_parity.py:
 *  TASK_PRIORITIES = helpers/task_fields.TASK_PRIORITIES (the TaskPriority
 *  enum), ROTATION_STRATEGIES = const.ROTATION_STRATEGIES.
 */

/** Priority levels, low to high (the order the edit forms offer them). */
export const TASK_PRIORITIES = ["low", "normal", "high"] as const;

/** The same levels high to low — the order the filters list them in. */
export const TASK_PRIORITIES_HIGH_FIRST = [...TASK_PRIORITIES].reverse();

/** Rotation strategies of a shared task's household pool. */
export const ROTATION_STRATEGIES = ["round_robin", "least_completed", "random"] as const;
