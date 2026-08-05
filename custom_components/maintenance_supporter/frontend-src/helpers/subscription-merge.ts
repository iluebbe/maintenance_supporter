/** Merge logic for the 2.52 delta subscription protocol.
 *
 *  The subscription sends either the legacy full payload
 *  (`{objects: [...]}`) or — when the client subscribed with
 *  `deltas: true` — `{delta: [<object response>...], removed: [ids]}`
 *  carrying only entries whose rebuilt response actually changed.
 *  Shared by the panel and the Lovelace card so the two bundles cannot
 *  drift in how they apply an event.
 *
 *  Returns the next objects array, or null when the event changes nothing
 *  (callers skip the re-render entirely in that case).
 */

interface ObjectsLike {
  entry_id: string;
}

export interface SubscriptionEvent<T extends ObjectsLike> {
  objects?: T[];
  delta?: T[];
  removed?: string[];
}

export function mergeSubscriptionEvent<T extends ObjectsLike>(
  current: T[],
  event: SubscriptionEvent<T>,
): T[] | null {
  if (event.objects) return event.objects;
  const delta = event.delta || [];
  const removed = event.removed || [];
  if (!delta.length && !removed.length) return null;
  const byId = new Map(current.map((o) => [o.entry_id, o]));
  for (const d of delta) byId.set(d.entry_id, d);
  for (const r of removed) byId.delete(r);
  return [...byId.values()];
}
