/** Full task histories for the cross-object views (#191).
 *
 * The objects list payload carries only each task's most recent history
 * window (payload diet, websocket `_HISTORY_WINDOW`); `history_count` says
 * how much the server holds. A task whose window IS its whole history needs
 * no round trip, so the loader fetches `task/history` only for the truncated
 * ones — on an area with dozens of tasks that is usually a handful of calls
 * instead of one per task — and at most FULL_HISTORY_CONCURRENCY at a time,
 * so opening a big area does not put a hundred WS calls in flight at once.
 *
 * A fetched history is cached against the task's list signature (count +
 * window, the object booklet's staleness rule): a completion, edit or
 * deletion pushed through the subscription changes it and triggers a
 * refetch; anything else is served from the cache.
 */

import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { HistoryEntry, HomeAssistant } from "../types";
import { HISTORY_RETENTION_CAP } from "./object-history";

export const FULL_HISTORY_CONCURRENCY = 6;

/** Map `fn` over `items` with at most `limit` calls in flight; results keep
 *  the input order. */
export async function mapLimit<T, R>(
  items: ReadonlyArray<T>,
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  const worker = async (): Promise<void> => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  };
  const workers = Math.min(Math.max(1, limit), items.length);
  await Promise.all(Array.from({ length: workers }, worker));
  return out;
}

export interface HistoryTaskLike {
  id: string;
  history?: HistoryEntry[] | null;
  history_count?: number | null;
}

/** The list window is not the whole history — or the payload cannot say
 *  (no count), which is treated the same: fetch rather than under-report. */
export function isHistoryTruncated(task: HistoryTaskLike): boolean {
  const shown = task.history?.length ?? 0;
  return typeof task.history_count !== "number" || task.history_count > shown;
}

function signature(task: HistoryTaskLike): string {
  return JSON.stringify([task.history_count ?? null, task.history ?? []]);
}

function cacheKey(entryId: string, taskId: string): string {
  return `${entryId}:${taskId}`;
}

export interface HistoryTaskRef {
  entryId: string;
  task: HistoryTaskLike;
}

export class FullHistoryLoader implements ReactiveController {
  private readonly _cache = new Map<string, { sig: string; entries: HistoryEntry[] }>();
  private readonly _inFlight = new Map<string, string>();
  private _running = 0;
  private _pending: Promise<void> = Promise.resolve();
  /** Bumped whenever a fetched history lands — memo key for consumers. */
  public version = 0;

  constructor(private readonly _host: ReactiveControllerHost) {
    _host.addController(this);
  }

  hostConnected(): void {
    /* nothing to set up — fetches start from sync() */
  }

  /** Fetches are running (drives the "Loading…" hint). */
  get loading(): boolean {
    return this._running > 0;
  }

  /** Some fetched history reached the backend's retention cap. */
  get capped(): boolean {
    for (const hit of this._cache.values()) if (hit.entries.length >= HISTORY_RETENTION_CAP) return true;
    return false;
  }

  /** The best history there is for a task: the fetched full one, else the
   *  list window (complete when the task is not truncated). */
  historyOf(entryId: string, task: HistoryTaskLike): HistoryEntry[] {
    return this._cache.get(cacheKey(entryId, task.id))?.entries ?? task.history ?? [];
  }

  /** Fetch every truncated task whose full history is missing or stale.
   *  A failed fetch caches the window under the same signature — degraded,
   *  never empty, and no retry loop on every re-render. */
  sync(hass: HomeAssistant | undefined, refs: ReadonlyArray<HistoryTaskRef>): Promise<void> {
    if (!hass?.connection) return this._pending;
    const todo = refs
      .filter((r) => isHistoryTruncated(r.task))
      .map((r) => ({ ...r, key: cacheKey(r.entryId, r.task.id), sig: signature(r.task) }))
      .filter((r) => this._cache.get(r.key)?.sig !== r.sig && this._inFlight.get(r.key) !== r.sig);
    if (!todo.length) return this._pending;
    for (const r of todo) this._inFlight.set(r.key, r.sig);
    this._running++;
    this._host.requestUpdate();
    const run = mapLimit(todo, FULL_HISTORY_CONCURRENCY, async (r) => {
      let entries: HistoryEntry[];
      try {
        const res = (await hass.connection.sendMessagePromise({
          type: "maintenance_supporter/task/history",
          entry_id: r.entryId,
          task_id: r.task.id,
        })) as { history?: HistoryEntry[] } | null;
        // A reply without a history list is no answer — keep the window.
        entries = Array.isArray(res?.history) ? res.history : r.task.history ?? [];
      } catch {
        entries = r.task.history ?? [];
      }
      // A newer signature started its own fetch meanwhile — that one lands.
      if (this._inFlight.get(r.key) === r.sig) {
        this._inFlight.delete(r.key);
        this._cache.set(r.key, { sig: r.sig, entries });
      }
    }).then(() => {
      this._running--;
      this.version++;
      this._host.requestUpdate();
    });
    this._pending = Promise.all([this._pending, run]).then(() => undefined);
    return this._pending;
  }

  /** Resolves once every fetch started so far has landed (the print waits
   *  for it, so a report never goes out with only the list window). */
  settled(): Promise<void> {
    return this._pending;
  }
}
