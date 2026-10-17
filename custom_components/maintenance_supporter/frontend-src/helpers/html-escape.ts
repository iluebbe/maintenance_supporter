/** HTML-escape a value for markup built as text — the printable sheets
 *  (object report, service record, area report #191, work sheet), the QR
 *  print page and dialog, the strategy editor. Every one of them carried
 *  its own copy, and the QR dialog's left the apostrophe out (DRY audit
 *  2026-10-12); tests/test_dry_tripwires.py keeps it the only one. */
export function escapeHtml(v: unknown): string {
  return String(v ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string
  ));
}
