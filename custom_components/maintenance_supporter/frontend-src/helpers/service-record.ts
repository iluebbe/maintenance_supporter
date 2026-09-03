/** Printable object service record (#138) — the chronological "vehicle
 * service booklet": every completed maintenance across all of an object's
 * tasks, newest first, with a cost total. Opened as a Blob in a new tab; the
 * user prints or saves as PDF from there. Self-contained HTML, no PDF
 * dependency, all user content escaped.
 */

import type { MaintenanceObject } from "../types";
import type { ObjectHistoryEntry } from "./object-history";
import { objectHistoryTotals } from "./object-history";

export interface ServiceRecordLabels {
  title: string;
  generated: string;
  manufacturer: string;
  model: string;
  serial: string;
  installed: string;
  colDate: string;
  colTask: string;
  colCost: string;
  colDuration: string;
  colNotes: string;
  completedBy: string;
  totalLabel: string;
  /** "N entries" line under the heading. */
  entriesLabel: (n: number) => string;
  /** Shown when any task hit the per-task retention cap. */
  capNote: string;
  none: string;
}

function esc(v: unknown): string {
  return String(v ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string
  ));
}

export function buildServiceRecordHtml(
  obj: Pick<MaintenanceObject, "name" | "manufacturer" | "model" | "serial_number" | "installation_date">,
  entries: ReadonlyArray<ObjectHistoryEntry>,
  labels: ServiceRecordLabels,
  fmtDate: (iso: string) => string,
  fmtDuration: (minutes: number) => string,
  fmtCost: (amount: number) => string,
  generatedIso: string,
  opts: { capped?: boolean } = {},
): string {
  // A service record documents work that was DONE — completed entries only.
  const done = entries.filter((e) => e.type === "completed");
  const { totalCost } = objectHistoryTotals(done);

  const metaRows = (
    [
      [labels.manufacturer, obj.manufacturer],
      [labels.model, obj.model],
      [labels.serial, obj.serial_number],
      [labels.installed, obj.installation_date ? fmtDate(obj.installation_date) : null],
    ] as Array<[string, string | null | undefined]>
  )
    .filter(([, v]) => v)
    .map(([k, v]) => `<div class="meta-row"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`)
    .join("");

  const rows = done
    .map((e) => {
      const notes = [e.notes, e.completedBy ? `${labels.completedBy}: ${e.completedBy}` : null]
        .filter(Boolean)
        .join(" · ");
      return `<tr>
        <td class="nowrap">${esc(fmtDate(e.timestamp))}</td>
        <td>${esc(e.phaseName ? `${e.taskName} · ${e.phaseName}` : e.taskName)}</td>
        <td class="num">${e.cost != null ? esc(fmtCost(e.cost)) : esc(labels.none)}</td>
        <td class="num">${e.duration != null ? esc(fmtDuration(e.duration)) : esc(labels.none)}</td>
        <td class="notes">${esc(notes) || esc(labels.none)}</td>
      </tr>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${esc(labels.title)} — ${esc(obj.name)}</title>
<style>
  /* Printable sheet: it opens as a blob in whatever viewer the OS supplies
     (Companion = WebView, dark phones paint a dark default canvas), so the
     document states its own light scheme and paints its background. */
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { font: 13px/1.5 -apple-system, Segoe UI, Roboto, sans-serif; color: #1a1a1a; background: #fff; margin: 32px; }
  h1 { font-size: 22px; margin: 0 0 2px; }
  .sub { color: #666; margin: 0 0 16px; }
  .meta { margin: 0 0 20px; max-width: 420px; }
  .meta-row { display: flex; justify-content: space-between; gap: 16px; padding: 2px 0; border-bottom: 1px solid #eee; }
  table { border-collapse: collapse; width: 100%; }
  th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; color: #666; border-bottom: 2px solid #ccc; padding: 6px 8px; }
  td { border-bottom: 1px solid #e5e5e5; padding: 6px 8px; vertical-align: top; }
  td.num, th.num { text-align: right; white-space: nowrap; }
  td.nowrap { white-space: nowrap; }
  td.notes { color: #444; }
  tfoot td { border-bottom: none; border-top: 2px solid #ccc; font-weight: 600; }
  .cap-note { margin-top: 14px; color: #888; font-size: 11px; }
  @media print { body { margin: 12mm; } }
</style>
</head>
<body>
<h1>${esc(labels.title)} — ${esc(obj.name)}</h1>
<p class="sub">${esc(labels.generated)} ${esc(fmtDate(generatedIso))} · ${esc(labels.entriesLabel(done.length))}</p>
${metaRows ? `<div class="meta">${metaRows}</div>` : ""}
<table>
  <thead><tr>
    <th>${esc(labels.colDate)}</th>
    <th>${esc(labels.colTask)}</th>
    <th class="num">${esc(labels.colCost)}</th>
    <th class="num">${esc(labels.colDuration)}</th>
    <th>${esc(labels.colNotes)}</th>
  </tr></thead>
  <tbody>
${rows}
  </tbody>
  <tfoot><tr>
    <td colspan="2">${esc(labels.totalLabel)}</td>
    <td class="num">${esc(fmtCost(totalCost))}</td>
    <td colspan="2"></td>
  </tr></tfoot>
</table>
${opts.capped ? `<p class="cap-note">${esc(labels.capNote)}</p>` : ""}
</body>
</html>`;
}
