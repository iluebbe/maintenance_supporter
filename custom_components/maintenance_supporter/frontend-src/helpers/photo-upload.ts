/** #161: completion-photo upload + cleanup shared by the complete dialog
 * and the history edit dialog.
 *
 * Uploads go through the multipart REST route (a WS frame can't carry a
 * blob); the global `fetch` is used on purpose — the wtr tests stub
 * `window.fetch`. Errors carry a LOCALE KEY as their message so each
 * dialog can render them in its own language.
 */

import type { HomeAssistant } from "../types";

export { MAX_COMPLETION_PHOTOS } from "./history-photos";

/** Upload one image as a `photo`-tagged document; resolves to its doc id. */
export async function uploadCompletionPhoto(hass: HomeAssistant, entryId: string, file: File): Promise<string> {
  const form = new FormData();
  form.append("entry_id", entryId);
  form.append("tags", "photo");
  form.append("file", file, file.name);
  const resp = await fetch("/api/maintenance_supporter/document/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${hass.auth?.data?.access_token ?? ""}` },
    body: form,
  });
  if (resp.status === 413) throw new Error("doc_too_large");
  if (!resp.ok) throw new Error("doc_upload_failed");
  const doc = (await resp.json()) as { id?: string };
  if (!doc.id) throw new Error("doc_upload_failed");
  return doc.id;
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
