/**
 * The first `objects` and `statistics` requests of the surfaces on a
 * dashboard, shared.
 *
 * The dashboard strategy fetched every object to build its views (593 KB on
 * one home), and then each card on the view fetched them again (perf
 * 2026-11-05); the statistics went the same way, and the card waited for its
 * own before it drew (perf 2026-11-06). A surface's FIRST load now takes an
 * answer another surface asked for within SHARE_MS on the same connection,
 * or the request still in flight; each surface subscribes right after, and
 * the subscription's snapshot brings the newest state anyway. A reload after
 * an action always asks the server.
 *
 * The shares live on `window.__msObjectsFetch` / `__msStatisticsFetch`, not
 * in module scope: the strategy, the card and the calendar card are separate
 * bundles, each with its own copy of this module (as helpers/settings-cache).
 * A failed request is not kept.
 */

import type { MaintenanceObjectResponse, StatisticsResponse } from "../types";
import { hydrateObjects } from "./hydrate-objects";

/** How long a first load may take another surface's answer. */
export const SHARE_MS = 5000;

interface SharedFetch<T> {
  at: number;
  connection: unknown;
  answer: Promise<T>;
}

type ShareKey = "__msObjectsFetch" | "__msStatisticsFetch";

/** What the fetch needs of `hass` (the strategy has no full HomeAssistant). */
interface ObjectsSource {
  connection: { sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T> };
}

/** `ask()`, or for a first load the answer another surface asked for. */
function share<T>(key: ShareKey, hass: ObjectsSource, first: boolean, ask: () => Promise<T>): Promise<T> {
  const host = window as unknown as Partial<Record<ShareKey, SharedFetch<T>>>;
  const shared = host[key];
  if (first && shared && shared.connection === hass.connection && Date.now() - shared.at < SHARE_MS) {
    return shared.answer;
  }
  const answer = ask();
  const entry: SharedFetch<T> = { at: Date.now(), connection: hass.connection, answer };
  host[key] = entry;
  answer.catch(() => {
    if (host[key] === entry) delete host[key];
  });
  return answer;
}

/** Every object (compact, hydrated). `first`: a surface's first load, which
 *  may share; anything later asks the server. The array is the caller's
 *  own; the objects in it are shared and must not be changed. */
export function fetchObjects(hass: ObjectsSource, { first = false } = {}): Promise<MaintenanceObjectResponse[]> {
  return share("__msObjectsFetch", hass, first, () =>
    hass.connection
      .sendMessagePromise<{ objects: MaintenanceObjectResponse[] }>({ type: "maintenance_supporter/objects", compact: true })
      .then((res) => hydrateObjects(res.objects || [])),
  ).then((list) => [...list]);
}

/** The household's counts, shared the same way. The answer is shared and
 *  must not be changed. */
export function fetchStatistics(hass: ObjectsSource, { first = false } = {}): Promise<StatisticsResponse> {
  return share("__msStatisticsFetch", hass, first, () =>
    hass.connection.sendMessagePromise<StatisticsResponse>({ type: "maintenance_supporter/statistics" }),
  );
}
