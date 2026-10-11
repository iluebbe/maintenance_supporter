/** Shared URL-safety guard for rendering user-supplied links.
 *
 * A user-entered URL (object/task documentation, spare-part shopping link,
 * document weblink) must never be linkified as `javascript:`/`data:`/
 * protocol-relative, else it is a stored-XSS vector. The
 * `X && /^https?:\/\//i.test(X)` idiom was inlined at ~8 render sites; one
 * forgotten copy is a hole, so it lives here once.
 *
 * Since #207 a documentation link or a document's web link may also open an
 * app (`obsidian://`, `onenote:`, `mailto:`): every scheme passes except the
 * blocked ones, the twin of `helpers/url_safety.py` (a tripwire pins the two).
 */

/** Schemes a link may never use: they run code in the page, open the
 *  device's own files or the browser's internals, or start Windows handlers
 *  attackers have abused. */
export const BLOCKED_LINK_SCHEMES: ReadonlySet<string> = new Set([
  "about",
  "blob",
  "data",
  "file",
  "filesystem",
  "javascript",
  "livescript",
  "ms-appinstaller",
  "ms-cxh",
  "ms-cxh-full",
  "ms-msdt",
  "ms-officecmd",
  "search",
  "search-ms",
  "view-source",
  "vbscript",
]);

/** The link as a browser reads it before looking at the scheme: ASCII tabs
 *  and newlines anywhere dropped, control characters and spaces at either
 *  end trimmed ("java\tscript:" is javascript:). */
export function cleanLink(url: string): string {
  // eslint-disable-next-line no-control-regex
  return url.replace(/[\t\n\r]/g, "").replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g, "");
}

/** The lower-cased scheme of an absolute link, else null. Two characters at
 *  least: "C:\manual.pdf" is a drive path, not a link. */
export function linkScheme(url: string | null | undefined): string | null {
  const match = /^([a-z][a-z0-9+.-]+):/i.exec(cleanLink(url || ""));
  return match ? match[1].toLowerCase() : null;
}

/** An absolute link safe to open: http(s) or an app link — never one of the
 *  blocked schemes, never relative. */
export function isSafeLink(url: string | null | undefined): url is string {
  const scheme = linkScheme(url);
  return scheme !== null && !BLOCKED_LINK_SCHEMES.has(scheme);
}

/** Only an absolute http(s) URL — for links that must be web pages (a
 *  spare part's shop page). */
export function isSafeHttpUrl(url: string | null | undefined): url is string {
  return !!url && /^https?:\/\//i.test(url);
}
