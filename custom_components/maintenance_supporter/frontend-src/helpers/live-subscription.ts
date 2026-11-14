/**
 * A subscription that outlasts Home Assistant restarts (#258).
 *
 * The websocket library subscribes again by itself after a reconnect, but a
 * failed attempt ends the subscription without a word: after a restart the
 * socket is up before the integration has registered its commands, the
 * attempt is answered "Unknown command", and an always-on dashboard kept the
 * list it had until someone reloaded the page. This one subscribes again
 * itself on every reconnect and tries again, a while later, until it gets
 * through. Its old unsubscribe is never called on the new socket: command ids
 * start over there, and it could end someone else's subscription.
 */

export interface ReconnectingConnection {
  subscribeMessage(
    callback: (event: unknown) => void,
    msg: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): Promise<() => void>;
  /** "ready" after a reconnect, "disconnected" when the socket closed.
   *  Optional: test stubs leave them out. */
  addEventListener?(event: "ready" | "disconnected", callback: () => void): void;
  removeEventListener?(event: "ready" | "disconnected", callback: () => void): void;
}

/** The waits before each new attempt after a failed one (the last repeats). */
export const RETRY_MS = [2000, 5000, 10000, 30000];

export interface LiveSubscription {
  /** Try now if the subscription is down (a new watcher arrived). */
  retryNow(): void;
  /** End it, and stop following the connection. */
  close(): void;
}

export function subscribeAcrossReconnects(
  connection: ReconnectingConnection,
  callback: (event: unknown) => void,
  msg: Record<string, unknown>,
  { onLost }: { onLost?: () => void } = {},
): LiveSubscription {
  let closed = false;
  // Counts the disconnects: an attempt or an unsubscribe belongs to one socket.
  let epoch = 0;
  let inflight: number | null = null;
  let unsub: (() => void) | null = null;
  let failures = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const clearTimer = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  const attempt = () => {
    if (closed || unsub || inflight === epoch) return;
    clearTimer();
    const mine = epoch;
    inflight = mine;
    connection.subscribeMessage(callback, msg, { resubscribe: false }).then(
      (end) => {
        if (inflight === mine) inflight = null;
        if (mine !== epoch) return;
        if (closed) {
          try { end(); } catch { /* the connection is gone */ }
          return;
        }
        unsub = end;
        failures = 0;
      },
      () => {
        if (inflight === mine) inflight = null;
        if (closed || mine !== epoch) return;
        failures += 1;
        timer = setTimeout(attempt, RETRY_MS[Math.min(failures, RETRY_MS.length) - 1]);
      },
    );
  };

  const onReady = () => attempt();
  const onDisconnected = () => {
    epoch += 1;
    unsub = null;
    clearTimer();
    onLost?.();
  };
  connection.addEventListener?.("ready", onReady);
  connection.addEventListener?.("disconnected", onDisconnected);
  attempt();

  return {
    retryNow: attempt,
    close() {
      if (closed) return;
      closed = true;
      clearTimer();
      connection.removeEventListener?.("ready", onReady);
      connection.removeEventListener?.("disconnected", onDisconnected);
      const end = unsub;
      unsub = null;
      try { end?.(); } catch { /* the connection is gone */ }
    },
  };
}
