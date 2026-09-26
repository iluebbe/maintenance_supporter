/** #161: document upload + cleanup shared by the complete dialog, the
 * history edit dialog and the documents section.
 *
 * Uploads go through the multipart REST route (a WS frame can't carry a
 * blob); the global `fetch` is used on purpose — the wtr tests stub
 * `window.fetch`. Errors carry a LOCALE KEY as their message so each
 * caller can render them in its own language.
 */

import type { HomeAssistant } from "../types";

export { MAX_COMPLETION_PHOTOS } from "./history-photos";

/** What the upload view answers with (helpers/documents.py add_file). */
export interface UploadedDocument {
  id: string;
  /** The blob already existed somewhere — stored once, listed twice. */
  deduped: boolean;
  /** Id of an identical file already on the SAME object, else null/absent. */
  duplicate_in_object?: string | null;
}

/** `fetch` to one of our HTTP views with a FRESH access token. HA renews
 *  the token only on a WebSocket reconnect or inside `hass.fetchWithAuth`;
 *  it expires after 30 minutes, so in a tab open longer every photo,
 *  document and archive upload failed with 401 until a reload (bug audit
 *  2026-09-26). The global `fetch` stays (the wtr tests stub it). */
export async function authFetch(hass: HomeAssistant, url: string, init: RequestInit): Promise<Response> {
  const auth = hass.auth;
  if (auth?.expired && auth.refreshAccessToken) {
    try {
      await auth.refreshAccessToken();
    } catch {
      // The request then answers 401 and the caller reports the failure.
    }
  }
  return fetch(url, {
    ...init,
    headers: { ...((init.headers as Record<string, string> | undefined) ?? {}), Authorization: `Bearer ${auth?.data?.access_token ?? ""}` },
  });
}

/** Upload one file as a document of `entryId`, tagged with `tags`. Throws
 *  `Error("doc_too_large")` on a 413 and `Error("doc_upload_failed")` on
 *  any other refusal (a network failure propagates as-is). */
export async function uploadDocument(
  hass: HomeAssistant,
  entryId: string,
  file: File,
  tags: string[],
): Promise<UploadedDocument> {
  const form = new FormData();
  form.append("entry_id", entryId);
  for (const tag of tags) form.append("tags", tag);
  form.append("file", file, file.name);
  const resp = await authFetch(hass, "/api/maintenance_supporter/document/upload", { method: "POST", body: form });
  if (resp.status === 413) throw new Error("doc_too_large");
  if (!resp.ok) throw new Error("doc_upload_failed");
  const doc = (await resp.json()) as Partial<UploadedDocument>;
  if (!doc.id) throw new Error("doc_upload_failed");
  return { id: doc.id, deduped: !!doc.deduped, duplicate_in_object: doc.duplicate_in_object ?? null };
}

/** Upload one image as a `photo`-tagged document; resolves to its doc id. */
export async function uploadCompletionPhoto(hass: HomeAssistant, entryId: string, file: File): Promise<string> {
  return (await uploadDocument(hass, entryId, file, ["photo"])).id;
}

/** Best-effort removal of photos uploaded in a dialog session that was
 * abandoned (✕ on a tile, Cancel) — nothing references them, so they
 * would otherwise linger as orphans in the object's documents. */
export async function discardUploadedPhotos(hass: HomeAssistant, docIds: string[]): Promise<void> {
  await Promise.all(
    docIds.map((docId) =>
      hass.connection
        .sendMessagePromise({ type: "maintenance_supporter/documents/delete", doc_id: docId })
        .catch(() => undefined),
    ),
  );
}
