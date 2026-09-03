/** Self-contained printable maintenance report for one object.
 *
 * Produces a full HTML document (inline print CSS) that the panel opens in a new
 * tab via a Blob URL — the user then prints or "Save as PDF" from the browser.
 * No PDF dependency, works offline. All user content is HTML-escaped.
 */

import type { MaintenanceObject, MaintenanceTask } from "../types";

export interface ReportLabels {
  title: string;
  generated: string;
  manufacturer: string;
  model: string;
  serial: string;
  installed: string;
  warranty: string;
  area: string;
  notes: string;
  tasksHeading: string;
  colTask: string;
  colType: string;
  colStatus: string;
  colSchedule: string;
  colLastDone: string;
  colNextDue: string;
  colCost: string;
  colTimes: string;
  totalCost: string;
  /** Human schedule label for a task — pass formatRecurrence so calendar
   *  kinds (weekdays/nth_weekday/…) render properly, not just intervals. */
  scheduleLabel: (t: MaintenanceTask) => string;
  statusLabel: (s: string) => string;
  typeLabel: (t: string) => string;
  none: string;
}

function esc(v: unknown): string {
  return String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

export function buildObjectReportHtml(
  obj: MaintenanceObject,
  tasks: MaintenanceTask[],
  labels: ReportLabels,
  fmtDate: (iso: string | null | undefined) => string,
  fmtCost: (amount: number) => string,
  nowIso: string,
): string {
  const meta = ([
    [labels.manufacturer, obj.manufacturer],
    [labels.model, obj.model],
    [labels.serial, obj.serial_number],
    [labels.installed, obj.installation_date ? fmtDate(obj.installation_date) : null],
    [labels.warranty, obj.warranty_expiry ? fmtDate(obj.warranty_expiry) : null],
  ] as Array<[string, string | null | undefined]>).filter(([, v]) => !!v);

  const rows = tasks.map((t) => {
    const schedule = labels.scheduleLabel(t);
    return `<tr>
      <td>${esc(t.name)}</td>
      <td>${esc(labels.typeLabel(t.type))}</td>
      <td>${esc(labels.statusLabel(t.status))}</td>
      <td>${esc(schedule)}</td>
      <td>${esc(t.last_performed ? fmtDate(t.last_performed) : labels.none)}</td>
      <td>${esc(t.next_due ? fmtDate(t.next_due) : labels.none)}</td>
      <td class="num">${t.times_performed ?? 0}</td>
      <td class="num">${esc(fmtCost(t.total_cost ?? 0))}</td>
    </tr>`;
  }).join("");

  const totalCost = tasks.reduce((n, t) => n + (t.total_cost ?? 0), 0);

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${esc(labels.title)} — ${esc(obj.name)}</title>
<style>
  /* This is a PRINTABLE sheet, not part of the app's theme: it opens as a
     blob in whatever viewer the OS supplies. In the Companion app that is a
     WebView, and a WebView on a dark-themed phone paints a DARK default
     canvas — against which the dark body text below disappeared completely,
     leaving only the pale row borders showing as stripes. Declaring the
     scheme AND painting the background keeps the sheet identical everywhere,
     and matches what comes out of a printer. */
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { font: 13px/1.5 -apple-system, Segoe UI, Roboto, sans-serif; color: #1a1a1a; background: #fff; margin: 32px; }
  h1 { font-size: 22px; margin: 0 0 2px; }
  .sub { color: #666; margin: 0 0 20px; }
  .meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 6px 24px; margin-bottom: 20px; }
  .meta div { border-bottom: 1px solid #eee; padding: 4px 0; }
  .meta .k { color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
  h2 { font-size: 15px; margin: 24px 0 8px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 7px 8px; border-bottom: 1px solid #eee; vertical-align: top; }
  th { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: #888; border-bottom: 2px solid #ccc; }
  td.num, th.num { text-align: right; }
  tfoot td { font-weight: 600; border-top: 2px solid #ccc; border-bottom: none; }
  .notes { margin-top: 16px; white-space: pre-wrap; color: #333; }
  @media print { body { margin: 0; } @page { margin: 16mm; } }
</style></head><body>
  <h1>${esc(obj.name)}</h1>
  <p class="sub">${esc(labels.title)} · ${esc(labels.generated)}: ${esc(fmtDate(nowIso))}</p>
  ${meta.length ? `<div class="meta">${meta.map(([k, v]) =>
    `<div><div class="k">${esc(k)}</div>${esc(v)}</div>`).join("")}</div>` : ""}
  <h2>${esc(labels.tasksHeading)} (${tasks.length})</h2>
  <table>
    <thead><tr>
      <th>${esc(labels.colTask)}</th><th>${esc(labels.colType)}</th><th>${esc(labels.colStatus)}</th>
      <th>${esc(labels.colSchedule)}</th><th>${esc(labels.colLastDone)}</th><th>${esc(labels.colNextDue)}</th>
      <th class="num">${esc(labels.colTimes)}</th><th class="num">${esc(labels.colCost)}</th>
    </tr></thead>
    <tbody>${rows || `<tr><td colspan="8">${esc(labels.none)}</td></tr>`}</tbody>
    <tfoot><tr><td colspan="7">${esc(labels.totalCost)}</td><td class="num">${esc(fmtCost(totalCost))}</td></tr></tfoot>
  </table>
  ${obj.notes ? `<div class="notes"><strong>${esc(labels.notes)}:</strong>\n${esc(obj.notes)}</div>` : ""}
</body></html>`;
}
