/** Signed URLs for the document API — one implementation of the
 * `auth/sign_path` dance that was hand-copied across seven call sites
 * (documents section, task documents, storage card, history photo,
 * settings archive export), with the popup/fragment handling drifting
 * between them.
 *
 * A plain <img>/<a> can't send the auth header, so every document fetch
 * mints a short-lived signed path first (Companion-WebView-safe).
 */

import type { HomeAssistant } from "../types";
import { downloadUrl } from "./download";

/** Mint a short-lived signed path for an API route. */
export async function signApiPath(hass: HomeAssistant, path: string, expires = 300): Promise<string> {
  const signed = await hass.connection.sendMessagePromise<{ path: string }>({
    type: "auth/sign_path",
    path,
    expires,
  });
  return signed.path;
}

/** Signed path for one document blob. */
export async function signDocumentPath(hass: HomeAssistant, docId: string, expires = 300): Promise<string> {
  return signApiPath(hass, `/api/maintenance_supporter/document/${docId}`, expires);
}

/** Open a signed document in a new tab.
 *
 * The blank tab opens FIRST (popup blockers only allow window.open inside the
 * click's synchronous part), then navigates once the signature arrives — as an
 * ABSOLUTE URL, because a fragment on a root-relative path won't resolve
 * against the popup's about:blank base. On failure the tab is closed and the
 * error re-thrown for the caller's error display.
 */
export async function openSignedDocument(hass: HomeAssistant, docId: string, fragment = ""): Promise<void> {
  const win = window.open("about:blank", "_blank");
  try {
    const path = await signDocumentPath(hass, docId);
    if (win) win.location.href = new URL(path + fragment, window.location.origin).href;
  } catch (e) {
    if (win) win.close();
    throw e;
  }
}

/** Download a signed document via the Companion-safe anchor helper. */
export async function downloadSignedDocument(hass: HomeAssistant, docId: string, filename: string): Promise<void> {
  downloadUrl(await signDocumentPath(hass, docId, 30), filename);
}

/** Open a generated HTML page (report / worksheet) in a new tab via a blob
 * URL. One home for the open + deferred-revoke recipe the panel carried
 * twice (drift audit 2026-08); the 60 s revoke delay gives slow tabs time
 * to load before the blob disappears. */
export function openHtmlInNewTab(html: string): void {
  const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
