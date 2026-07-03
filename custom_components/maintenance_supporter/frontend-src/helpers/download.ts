/**
 * Download a text payload as a file — Companion-app safe.
 *
 * The naive pattern (a detached `<a download>`, `a.click()`, then an immediate
 * `URL.revokeObjectURL`) silently fails inside the Home Assistant Companion
 * app's WebView (especially iOS WKWebView): the anchor must be in the DOM,
 * carry `target="_blank"` so the app's download handler engages, and the
 * object URL must NOT be revoked before the (asynchronous) download has
 * started. This mirrors home-assistant-frontend's own `fileDownload` helper.
 */
export function downloadTextFile(
  content: string,
  filename: string,
  mime: string,
): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.dispatchEvent(new MouseEvent("click"));
  document.body.removeChild(a);
  // Revoke late: slower WebViews (the Companion app) kick off the download
  // asynchronously, and revoking the blob URL immediately cancels it.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/**
 * Download a (same-origin) URL as a file — Companion-app safe.
 *
 * For binary blobs served by our authenticated view: fetch a signed path via
 * `auth/sign_path` first, then hand the signed URL here. Same DOM-anchored,
 * `target="_blank"` trick as {@link downloadTextFile} so the Companion WebView
 * engages its download handler; no blob URL to revoke.
 */
export function downloadUrl(url: string, filename: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.dispatchEvent(new MouseEvent("click"));
  document.body.removeChild(a);
}
