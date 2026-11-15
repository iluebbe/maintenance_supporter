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
 *
 * An attempt made while the socket is down is never answered: the library
 * registers the command, cannot send it, and with `resubscribe: false` does
 * not send it after the reconnect either. Such an attempt used to count as
 * "under way" for good, so the reconnect made no new one and the list stayed
 * dead until the next disconnect (a card mounted, or the panel opened,
 * during the outage; bug audit 2026-11-14, F9-1). No attempt is made while
 * the connection says it is down, and the reconnect makes a fresh one
 * whatever was under way.
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
  /** False while the socket is down (the library's own flag). Optional:
   *  test stubs leave it out. */
  readonly connected?: boolean;
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
  // Counts the disconnects: an unsubscribe belongs to one socket.
  let epoch = 0;
  // The attempt that counts; an older one is void (see `voidAttempt`).
  let current = 0;
  let pending = false;
  let unsub: (() => void) | null = null;
  let failures = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const clearTimer = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  /** Whatever is under way no longer counts: its socket closed, or it was
   *  made while the socket was down and will never be answered. */
  const voidAttempt = () => {
    current += 1;
    pending = false;
  };

  const attempt = () => {
    if (closed || unsub || pending) return;
    // Down: the reconnect ("ready") makes the attempt.
    if (connection.connected === false) return;
    clearTimer();
    const mine = ++current;
    const socket = epoch;
    pending = true;
    connection.subscribeMessage(callback, msg, { resubscribe: false }).then(
      (end) => {
        if (mine !== current) {
          // Void, yet it got through on the socket that is still up: a
          // second subscription next to the one that replaced it.
          if (socket === epoch) {
            try { end(); } catch { /* the connection is gone */ }
          }
          return;
        }
        pending = false;
        if (closed) {
          try { end(); } catch { /* the connection is gone */ }
          return;
        }
        unsub = end;
        failures = 0;
      },
      () => {
        if (mine !== current) return;
        pending = false;
        if (closed) return;
        failures += 1;
        timer = setTimeout(attempt, RETRY_MS[Math.min(failures, RETRY_MS.length) - 1]);
      },
    );
  };

  const onReady = () => {
    // An attempt from before the socket was up is not on it.
    if (!unsub) voidAttempt();
    attempt();
  };
  const onDisconnected = () => {
    epoch += 1;
    unsub = null;
    voidAttempt();
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
