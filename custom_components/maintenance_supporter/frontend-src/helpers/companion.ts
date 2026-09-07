/**
 * Which Home Assistant Companion app hosts the panel, when any.
 *
 * The Android app answers a `<input type="file" multiple>` pick with NOTHING
 * (#161 follow-up): its file chooser hands the result back through
 * `FileChooserParams.parseResult`, which only reads `intent.getData()` —
 * a multi-select stores its URIs in `intent.clipData`, so the WebView gets
 * `null` and `input.files` is empty. Single picks work. Until that is fixed
 * upstream, surfaces that offer multi-select fall back to one file per pick
 * on Android and say so.
 *
 * Detection: the Android app injects `window.externalApp` (its JS bridge);
 * the user agent carries `Home Assistant/<version> (Android …)` as well.
 * iOS injects `webkit.messageHandlers` and its WKWebView picker handles
 * multi-select fine.
 */

export function isAndroidCompanion(): boolean {
  const w = window as unknown as { externalApp?: unknown };
  if (w.externalApp !== undefined) return true;
  const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
  return /Home Assistant\//.test(ua) && /Android/.test(ua);
}
