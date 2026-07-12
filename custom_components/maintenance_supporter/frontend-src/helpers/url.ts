/** Shared URL-safety guard for rendering user-supplied links.
 *
 * A user-entered URL (object/task documentation, spare-part shopping link,
 * document weblink) must only ever be linkified when it is an absolute http(s)
 * URL — never `javascript:`/`data:`/protocol-relative — else it is a stored-XSS
 * vector. The `X && /^https?:\/\//i.test(X)` idiom was inlined at ~8 render
 * sites; one forgotten copy is a hole, so it lives here once.
 */
export function isSafeHttpUrl(url: string | null | undefined): url is string {
  return !!url && /^https?:\/\//i.test(url);
}
