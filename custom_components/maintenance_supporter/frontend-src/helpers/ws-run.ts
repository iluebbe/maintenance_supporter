/**
 * One WS round-trip with the error routed to the surface's own feedback
 * channel (toast / error line) — the shape task-quick-actions-dialog's
 * `_runWs` had, generalised (DRY round 2026-09).
 *
 * Before this helper every settings-view call site carried its own
 * try/catch that swallowed the server's message and showed the generic
 * "Action failed" toast — a `limit_reached` or `invalid_date` reply was
 * indistinguishable from a network drop. `describeWsError` turns the error
 * code / voluptuous text into a localized sentence; the caller only says
 * where it should go.
 *
 * Deliberately NOT for the silent best-effort loaders (option lists, the
 * cards' history fetch): those want `catch {}` and a fallback value, and
 * wrapping them here would only add a toast nobody asked for.
 */

import { describeWsError } from "../ws-errors";
import { langOf, t } from "../styles";

export interface RunWsHost {
  hass: { language?: string; connection: { sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T> } };
}

export interface RunWsOptions {
  /** Busy flag setter — called with true before the call and false after (either outcome). */
  busy?: (busy: boolean) => void;
  /** Locale key of the fallback sentence for non-WS errors (default: `action_error`). */
  fallbackKey?: string;
  /** Receives the localized error sentence; without it the error is only swallowed. */
  onError?: (message: string) => void;
}

/**
 * Sends `payload`, resolves with the response or `undefined` when the
 * server rejected it (after routing the localized message to `onError`).
 * Never throws — the caller branches on `undefined`.
 */
export async function runWs<T = unknown>(
  host: RunWsHost,
  payload: Record<string, unknown>,
  opts: RunWsOptions = {},
): Promise<T | undefined> {
  opts.busy?.(true);
  try {
    return await host.hass.connection.sendMessagePromise<T>(payload);
  } catch (e) {
    const lang = langOf(host.hass);
    opts.onError?.(describeWsError(e, lang, opts.fallbackKey ? t(opts.fallbackKey, lang) : undefined));
    return undefined;
  } finally {
    opts.busy?.(false);
  }
}
