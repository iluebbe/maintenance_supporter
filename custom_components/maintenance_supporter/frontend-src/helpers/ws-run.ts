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
  /** The surface's language, when it has its own (`lang` property of a
   *  dialog) — default: the one hass reports. */
  lang?: string;
  /** Receives the localized error sentence (and the raw error, for the few
   *  callers that branch on its `code`); without it the error is only swallowed. */
  onError?: (message: string, error: unknown) => void;
  /** Awaited after the call succeeded, still inside the busy window — the
   *  panel's data reload, a card's list refresh. A reload that throws is
   *  reported through `onError` like a failed call (the hand-written blocks
   *  had it inside the same try). */
  reload?: () => unknown;
  /** Sentence handed to `onSuccess` once the call (and the reload) went through. */
  successToast?: string;
  /** Receives `successToast` — the surface's toast. */
  onSuccess?: (message: string) => void;
}

/**
 * Sends `payload`, resolves with the response or `undefined` when the
 * server rejected it (after routing the localized message to `onError`).
 * Never throws — the caller branches on `undefined` (a command that answers
 * with no payload resolves `null`, which is a success).
 *
 * THE shape of a user-triggered WS action: busy flag, the server's reason
 * on failure, optional reload + success toast. The panel's `_runAction`,
 * the settings view's `_ws` and the Lovelace surfaces bind it to their own
 * feedback channel; tests/test_dry_tripwires.py fails on a new hand-written
 * `try { sendMessagePromise } catch { describeWsError }` block.
 */
export async function runWs<T = unknown>(
  host: RunWsHost,
  /** The WS message — or a call that talks to the backend itself (the
   *  signed-document helpers sign through `auth/sign_path`). */
  payload: Record<string, unknown> | (() => Promise<T>),
  opts: RunWsOptions = {},
): Promise<T | undefined> {
  opts.busy?.(true);
  try {
    const res = typeof payload === "function"
      ? await payload()
      : await host.hass.connection.sendMessagePromise<T>(payload);
    if (opts.reload) await opts.reload();
    if (opts.successToast) opts.onSuccess?.(opts.successToast);
    // `undefined` means "failed" — a success never returns it (a payload-less
    // answer is null on the wire; stubs may resolve undefined).
    return res === undefined ? (null as T) : res;
  } catch (e) {
    const lang = opts.lang || langOf(host.hass);
    opts.onError?.(describeWsError(e, lang, opts.fallbackKey ? t(opts.fallbackKey, lang) : undefined), e);
    return undefined;
  } finally {
    opts.busy?.(false);
  }
}

/** One failed item of `runWsEach`: the item and the server's reason. */
export interface WsEachFailure<K> {
  item: K;
  message: string;
}

/**
 * One WS call per item, sequentially (the per-task / per-object endpoints;
 * config entries are removed one at a time on the backend). Never throws:
 * resolves with the items that went through and the ones that did not,
 * each with the localized reason — the panel's two bulk loops had counted
 * the successes and swallowed every reason (DRY audit 2026-09-26).
 */
export async function runWsEach<K>(
  host: RunWsHost,
  items: readonly K[],
  build: (item: K) => Record<string, unknown>,
): Promise<{ done: K[]; failed: Array<WsEachFailure<K>> }> {
  const done: K[] = [];
  const failed: Array<WsEachFailure<K>> = [];
  for (const item of items) {
    let message = "";
    const res = await runWs(host, build(item), { onError: (m) => { message = m; } });
    if (res === undefined) failed.push({ item, message });
    else done.push(item);
  }
  return { done, failed };
}

/** The one toast of a bulk run: the success sentence, plus — when items
 *  failed — how many and the first server reason ("2 tasks completed ·
 *  1 failed: Not due yet …"). */
export function bulkResultMessage(done: string, failed: ReadonlyArray<WsEachFailure<unknown>>, lang: string): string {
  if (failed.length === 0) return done;
  const note = t("bulk_failed", lang)
    .replace("{n}", String(failed.length))
    .replace("{reason}", failed[0].message);
  return `${done} · ${note}`;
}
