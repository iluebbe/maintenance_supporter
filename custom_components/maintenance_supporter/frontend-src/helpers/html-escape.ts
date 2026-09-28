/** HTML-escape a value for the printable sheets (object report, service
 *  record, area report #191) — every piece of user text they interpolate
 *  goes through here. The report and the service record each carried their
 *  own copy of this function; the area report would have been the third. */
export function escapeHtml(v: unknown): string {
  return String(v ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string
  ));
}
