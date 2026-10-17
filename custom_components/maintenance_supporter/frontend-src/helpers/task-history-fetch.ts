/** THE `task/history` call: one task's full history (the list payloads carry
 *  only the most recent window). Dependency-free on purpose — the dashboard
 *  strategy bundle reaches it through the history editor's lookup.
 *
 *  Every full-history reader goes through here: the object booklet and the
 *  area views (FullHistoryLoader), the calendar card's past view, the panel's
 *  task page and the history editor's lookup. Their five hand-written copies
 *  disagreed on a reply without a history list — two of them took it for an
 *  empty history and dropped the window they had (DRY audit 2026-10-12).
 */

interface HistoryConnection {
  connection: { sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T> };
}

/** The task's entries, or null for a reply without a history list (no
 *  answer: the caller keeps its window). A refused call rejects. */
export async function fetchTaskHistory<E = Record<string, unknown>>(
  hass: HistoryConnection,
  entryId: string,
  taskId: string,
): Promise<E[] | null> {
  const res = await hass.connection.sendMessagePromise<{ history?: unknown } | null>({
    type: "maintenance_supporter/task/history",
    entry_id: entryId,
    task_id: taskId,
  });
  return Array.isArray(res?.history) ? (res.history as E[]) : null;
}
