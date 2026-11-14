/**
 * ONE objects subscription per connection, for the cards on a page.
 *
 * The task card and the calendar card subscribed each, and the server built
 * every object for each one's snapshot; a dashboard's view switch dropped the
 * card's subscription and the next view's card subscribed again (perf
 * 2026-11-06). The hub hands each event of its one subscription (hydrated
 * once) to the cards watching it, which merge it into their own list as they
 * did with their own subscription. It also keeps the list current from its
 * snapshot on, and a card's first load takes that list when there is one.
 * The subscription outlives the last card by LINGER_MS, so the card of the
 * next view finds it.
 *
 * The hubs live on `window.__msObjectsHubs`, not in module scope: each bundle
 * has its own copy of this module (as helpers/objects-fetch). The
 * subscription survives a restart of Home Assistant (helpers/live-subscription,
 * #258): an always-on dashboard kept the list it had when its reconnect could
 * not subscribe again. A failed attempt is tried again, at once when another
 * card arrives.
 */

import type { MaintenanceObjectResponse } from "../types";
import { hydrateObjects } from "./hydrate-objects";
import { subscribeAcrossReconnects, type LiveSubscription, type ReconnectingConnection } from "./live-subscription";
import { fetchObjects } from "./objects-fetch";
import { mergeSubscriptionEvent, type SubscriptionEvent } from "./subscription-merge";

/** How long the subscription stays after the last card left. */
export const LINGER_MS = 15000;

type Objects = MaintenanceObjectResponse[];
export type ObjectsEvent = SubscriptionEvent<MaintenanceObjectResponse>;
type Listener = (event: ObjectsEvent) => void;

interface HubConnection extends ReconnectingConnection {
  sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T>;
}

interface Hub {
  /** null until the subscription's snapshot arrived, and again from a
   *  disconnect until the next one: a card's first load fetches then. */
  objects: Objects | null;
  listeners: Set<Listener>;
  live: LiveSubscription | null;
  linger: ReturnType<typeof setTimeout> | null;
}

function hubs(): WeakMap<object, Hub> {
  const host = window as unknown as { __msObjectsHubs?: WeakMap<object, Hub> };
  return (host.__msObjectsHubs ||= new WeakMap());
}

function start(connection: HubConnection): Hub {
  const hub: Hub = { objects: null, listeners: new Set(), live: null, linger: null };
  hubs().set(connection, hub);
  hub.live = subscribeAcrossReconnects(
    connection,
    (raw) => {
      const event = raw as ObjectsEvent;
      if (event.objects) hydrateObjects(event.objects);
      if (event.delta) hydrateObjects(event.delta);
      // A change before the first snapshot is no list to hand out.
      if (event.objects || hub.objects) hub.objects = mergeSubscriptionEvent(hub.objects ?? [], event) ?? hub.objects;
      for (const listener of [...hub.listeners]) listener(event);
    },
    // Only what changed, empty keys stripped (hydrated above).
    { type: "maintenance_supporter/subscribe", deltas: true, compact: true },
    { onLost: () => { hub.objects = null; } },
  );
  return hub;
}

/** Follow the page's objects: `listener` gets each event of the one
 *  subscription, to merge with `mergeSubscriptionEvent`. Returns the
 *  release; the subscription ends LINGER_MS after the last one. */
export function watchObjects(connection: HubConnection, listener: Listener): () => void {
  const known = hubs().get(connection);
  const hub = known ?? start(connection);
  // A subscription that is down waits for its next attempt; a new card is
  // reason enough to try now.
  if (known) known.live?.retryNow();
  if (hub.linger) {
    clearTimeout(hub.linger);
    hub.linger = null;
  }
  hub.listeners.add(listener);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    hub.listeners.delete(listener);
    if (hub.listeners.size || hub.linger) return;
    hub.linger = setTimeout(() => {
      hub.linger = null;
      if (hub.listeners.size) return;
      if (hubs().get(connection) === hub) hubs().delete(connection);
      hub.live?.close();
    }, LINGER_MS);
  };
}

/** A card's watch of the page's objects (the task card and the calendar card
 *  each had a copy of this). `sync` from the card's `updated` when `hass`
 *  changed: on the first connection it loads, then watches; on a new one (a
 *  reconnect) it watches first, so nothing that changes during the reload
 *  is missed. `stop` from `disconnectedCallback`: the hub owns the
 *  subscription, so a card detached while it is still being set up leaves
 *  nothing behind (bug audit 2026-10-16, FE-7). */
export class ObjectsFollower {
  private release: (() => void) | null = null;
  private connection: HubConnection | null = null;

  constructor(
    /** Merges an event into the card's list (`mergeSubscriptionEvent`). */
    private readonly onEvent: Listener,
    /** The card's (re)load of its objects. */
    private readonly load: () => void,
  ) {}

  /** The card has loaded (or is loading) its objects. */
  get started(): boolean {
    return this.connection !== null;
  }

  sync(connection: HubConnection): void {
    if (connection === this.connection) return;
    const first = this.connection === null;
    this.connection = connection;
    if (first) this.load();
    this.release?.();
    this.release = watchObjects(connection, this.onEvent);
    if (!first) this.load();
  }

  stop(): void {
    this.release?.();
    this.release = null;
    this.connection = null;
  }
}

/** The list the connection's subscription keeps current, once its snapshot
 *  arrived (the caller's own array), else null. */
export function liveObjects(connection: object): Objects | null {
  const live = hubs().get(connection)?.objects;
  return live ? [...live] : null;
}

/** A card's first load: the hub's list when its subscription has one, else
 *  the shared first `objects` answer (helpers/objects-fetch); a snapshot
 *  that arrived while that was out is the newer list. The array is the
 *  caller's own; the objects in it are shared and must not be changed. */
export function firstObjects(hass: { connection: HubConnection }): Promise<Objects> {
  const live = liveObjects(hass.connection);
  if (live) return Promise.resolve(live);
  return fetchObjects(hass, { first: true }).then((fetched) => liveObjects(hass.connection) ?? fetched);
}
