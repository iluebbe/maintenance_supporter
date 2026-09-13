/** Printable object service record (#138, #170) — the "vehicle service
 * booklet": every completed maintenance across all of an object's tasks,
 * with a cost total. Opened as a Blob in a new tab; the user prints or saves
 * as PDF from there. Self-contained HTML, no PDF dependency, all user
 * content escaped.
 *
 * Since 2.79 (#170) the booklet is traceable: each completion can carry what
 * it recorded — readings with deltas, parts used, photos (thumbnails), the
 * checklist tally, notes, cost/duration, who did it — and its reference
 * number ("8.3-2"), and a second layout groups the record by task (task
 * header with schedule, linked documents and a QR code that opens the task,
 * then its completions indented). What lands on paper is the user's choice:
 * every block is an `include` switch.
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
  /** #170 blocks. */
  readings: string;
  parts: string;
  photos: string;
  documents: string;
  checklist: string;
  refNumber: string;
  scanHint: string;
  /** "Page {page}" for a document's page hint. */
  page: (n: number) => string;
}

export type ServiceRecordLayout = "chronological" | "by_task";

export interface ServiceRecordInclude {
  readings: boolean;
  parts: boolean;
  photos: boolean;
  documents: boolean;
  checklist: boolean;
  notes: boolean;
  costs: boolean;
  person: boolean;
  refs: boolean;
  qr: boolean;
  /** #170: completions that carry nothing but a date — off hides them. */
  bare: boolean;
  /** #164: the documents' descriptions under the task's linked documents. */
  docDescriptions: boolean;
}

export const DEFAULT_INCLUDE: ServiceRecordInclude = {
  readings: true, parts: true, photos: true, documents: true, checklist: true,
  notes: true, costs: true, person: true, refs: true, qr: false, bare: true, docDescriptions: true,
};

/** Whether a completion has anything to print beyond its date and name. */
export function hasDetails(e: ObjectHistoryEntry): boolean {
  return Boolean(
    (e.notes && e.notes.trim()) || e.cost != null || e.duration != null || e.readings.length || e.parts.length || e.photoIds.length || e.checklist,
  );
}

export interface ServiceRecordOptions {
  layout: ServiceRecordLayout;
  include: ServiceRecordInclude;
}

/** Per-task facts the by-task layout prints in the task header. */
export interface ServiceRecordTask {
  id: string;
  name: string;
  /** "8.3" when numbered. */
  ref: string | null;
  /** Human schedule label ("every 30 days", "1st Saturday"). */
  schedule: string | null;
  /** Linked documents (title + optional page hint + description, #164). */
  documents: Array<{ title: string; page: number | null; description?: string | null }>;
  /** QR code (SVG data URI) that opens the task; null when not requested. */
  qrDataUri: string | null;
}

/** A completion photo the booklet can show — url signed by the caller
 *  (short-lived; the sheet is rendered right away). */
export interface ServiceRecordPhoto {
  name: string;
  url: string | null;
}

export interface ServiceRecordData {
  /** Object reference ("8") when numbered. */
  objectRef: string | null;
  tasks: ServiceRecordTask[];
  /** Photo lookup by document id. */
  photos: Record<string, ServiceRecordPhoto>;
  /** Number formatting for readings (locale). */
  fmtNumber: (n: number) => string;
}

function esc(v: unknown): string {
  return String(v ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string
  ));
}

const MAX_PHOTOS_PER_ENTRY = 6;

export function buildServiceRecordHtml(
  obj: Pick<MaintenanceObject, "name" | "manufacturer" | "model" | "serial_number" | "installation_date">,
  entries: ReadonlyArray<ObjectHistoryEntry>,
  labels: ServiceRecordLabels,
  fmtDate: (iso: string) => string,
  fmtDuration: (minutes: number) => string,
  fmtCost: (amount: number) => string,
  generatedIso: string,
  opts: { capped?: boolean; options?: ServiceRecordOptions; data?: ServiceRecordData } = {},
): string {
  const options: ServiceRecordOptions = opts.options ?? { layout: "chronological", include: DEFAULT_INCLUDE };
  const inc = options.include;
  const data: ServiceRecordData = opts.data ?? { objectRef: null, tasks: [], photos: {}, fmtNumber: (n) => String(n) };
  // A service record documents work that was DONE — completed entries only.
  // A bare completion (date and name only) is a row of blanks on paper;
  // the "completions without details" switch drops them (#170).
  const done = entries.filter((e) => e.type === "completed" && (inc.bare !== false || hasDetails(e)));
  const { totalCost } = objectHistoryTotals(done);

  const entryRef = (e: ObjectHistoryEntry): string | null =>
    inc.refs && data.objectRef && e.taskRefNo != null && e.refNo != null ? `${data.objectRef}.${e.taskRefNo}-${e.refNo}` : null;
  const taskRefOf = (e: ObjectHistoryEntry): string | null =>
    inc.refs && data.objectRef && e.taskRefNo != null ? `${data.objectRef}.${e.taskRefNo}` : null;

  const metaRows = (
    [
      [labels.refNumber, inc.refs && data.objectRef ? `#${data.objectRef}` : null],
      [labels.manufacturer, obj.manufacturer],
      [labels.model, obj.model],
      [labels.serial, obj.serial_number],
      [labels.installed, obj.installation_date ? fmtDate(obj.installation_date) : null],
    ] as Array<[string, string | null | undefined]>
  )
    .filter(([, v]) => v)
    .map(([k, v]) => `<div class="meta-row"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`)
    .join("");

  /** The detail block under a completion — only the switched-on facts, only
   *  when the entry has them. Empty string when nothing applies. */
  const details = (e: ObjectHistoryEntry): string => {
    const lines: string[] = [];
    if (inc.readings && e.readings.length) {
      const items = e.readings.map((r) => {
        const value = `${data.fmtNumber(r.value)}${r.unit ? ` ${esc(r.unit)}` : ""}`;
        const delta = r.delta != null ? ` <span class="delta">(${r.delta >= 0 ? "+" : "−"}${data.fmtNumber(Math.abs(r.delta))})</span>` : "";
        return `${r.name ? `${esc(r.name)}: ` : ""}${value}${delta}`;
      });
      lines.push(`<div class="fact"><span class="k">${esc(labels.readings)}</span>${items.join(" · ")}</div>`);
    }
    if (inc.parts && e.parts.length) {
      lines.push(`<div class="fact"><span class="k">${esc(labels.parts)}</span>${e.parts.map((p) => `${esc(p.name)} × ${data.fmtNumber(p.quantity)}`).join(", ")}</div>`);
    }
    if (inc.checklist && e.checklist) {
      lines.push(`<div class="fact"><span class="k">${esc(labels.checklist)}</span>${e.checklist.done}/${e.checklist.total}</div>`);
    }
    if (inc.photos && e.photoIds.length) {
      const shown = e.photoIds.slice(0, MAX_PHOTOS_PER_ENTRY);
      const figures = shown.map((id) => {
        const p = data.photos[id];
        const name = p?.name || id.slice(0, 8);
        return p?.url
          ? `<figure class="photo"><img src="${esc(p.url)}" alt="" /><figcaption>${esc(name)}</figcaption></figure>`
          : `<figure class="photo"><figcaption>${esc(name)}</figcaption></figure>`;
      });
      const more = e.photoIds.length > shown.length ? `<span class="more">+${e.photoIds.length - shown.length}</span>` : "";
      lines.push(`<div class="fact"><span class="k">${esc(labels.photos)}</span><div class="photos">${figures.join("")}${more}</div></div>`);
    }
    return lines.length ? `<div class="details">${lines.join("")}</div>` : "";
  };

  const notesOf = (e: ObjectHistoryEntry): string =>
    [inc.notes ? e.notes : null, inc.person && e.completedBy ? `${labels.completedBy}: ${e.completedBy}` : null]
      .filter(Boolean)
      .join(" · ");

  const costCols = (e: ObjectHistoryEntry): string =>
    inc.costs
      ? `<td class="num">${e.cost != null ? esc(fmtCost(e.cost)) : esc(labels.none)}</td>
        <td class="num">${e.duration != null ? esc(fmtDuration(e.duration)) : esc(labels.none)}</td>`
      : "";

  const refCell = (ref: string | null): string => (ref ? `<span class="ref">#${esc(ref)}</span>` : "");

  const colSpan = inc.costs ? 5 : 3;

  const tableHead = (withTask: boolean) => `<thead><tr>
    <th>${esc(labels.colDate)}</th>
    ${withTask ? `<th>${esc(labels.colTask)}</th>` : `<th></th>`}
    ${inc.costs ? `<th class="num">${esc(labels.colCost)}</th><th class="num">${esc(labels.colDuration)}</th>` : ""}
    <th>${esc(labels.colNotes)}</th>
  </tr></thead>`;

  const row = (e: ObjectHistoryEntry, withTask: boolean) => {
    const notes = notesOf(e);
    const detail = details(e);
    const label = withTask ? esc(e.phaseName ? `${e.taskName} · ${e.phaseName}` : e.taskName) : esc(e.phaseName || "");
    return `<tr class="entry">
        <td class="nowrap">${esc(fmtDate(e.timestamp))}${refCell(entryRef(e))}</td>
        <td>${withTask ? `${label} ${refCell(taskRefOf(e))}` : label}</td>
        ${costCols(e)}
        <td class="notes">${esc(notes) || (detail ? "" : esc(labels.none))}</td>
      </tr>${detail ? `<tr class="entry-details"><td colspan="${colSpan}" class="details-cell">${detail}</td></tr>` : ""}`;
  };

  let body: string;
  if (options.layout === "by_task") {
    // Task order: the object's task list (numbered order when numbered), then
    // tasks that only exist in the history (deleted since) by name.
    const known = new Map(data.tasks.map((tk) => [tk.id, tk]));
    const ids: string[] = [...data.tasks.map((tk) => tk.id)];
    for (const e of done) if (!ids.includes(e.taskId)) ids.push(e.taskId);
    const sections = ids
      .map((id) => {
        const mine = done.filter((e) => e.taskId === id);
        if (!mine.length) return "";
        const tk = known.get(id);
        const name = tk?.name || mine[0].taskName;
        const ref = inc.refs ? tk?.ref ?? taskRefOf(mine[0]) : null;
        const docs = inc.documents && tk?.documents.length
          ? `<div class="fact"><span class="k">${esc(labels.documents)}</span>${tk.documents.map((d) => `${esc(d.title)}${d.page ? ` (${esc(labels.page(d.page))})` : ""}${inc.docDescriptions !== false && d.description ? ` — <span class="doc-desc">${esc(d.description)}</span>` : ""}`).join(", ")}</div>`
          : "";
        const qr = inc.qr && tk?.qrDataUri
          ? `<figure class="qr"><img src="${esc(tk.qrDataUri)}" alt="" /><figcaption>${esc(labels.scanHint)}</figcaption></figure>`
          : "";
        const subtotal = mine.reduce((n, e) => n + (e.cost ?? 0), 0);
        return `<section class="task">
  <div class="task-head">
    <div class="task-title">
      <h2>${esc(name)} ${refCell(ref)}</h2>
      ${tk?.schedule ? `<div class="schedule">${esc(tk.schedule)}</div>` : ""}
      ${docs}
      <div class="task-count">${esc(labels.entriesLabel(mine.length))}${inc.costs && subtotal > 0 ? ` · ${esc(fmtCost(subtotal))}` : ""}</div>
    </div>
    ${qr}
  </div>
  <table>
    ${tableHead(false)}
    <tbody>
${mine.map((e) => row(e, false)).join("\n")}
    </tbody>
  </table>
</section>`;
      })
      .join("\n");
    body = `${sections}
<table class="total">
  <tfoot><tr>
    <td>${esc(labels.totalLabel)}</td>
    <td class="num">${inc.costs ? esc(fmtCost(totalCost)) : ""}</td>
  </tr></tfoot>
</table>`;
  } else {
    body = `<table>
  ${tableHead(true)}
  <tbody>
${done.map((e) => row(e, true)).join("\n")}
  </tbody>
  <tfoot><tr>
    <td colspan="2">${esc(labels.totalLabel)}</td>
    ${inc.costs ? `<td class="num">${esc(fmtCost(totalCost))}</td><td colspan="2"></td>` : `<td></td>`}
  </tr></tfoot>
</table>`;
  }

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
  h2 { font-size: 15px; margin: 0; }
  .sub { color: #666; margin: 0 0 16px; }
  .meta { margin: 0 0 20px; max-width: 420px; }
  .meta-row { display: flex; justify-content: space-between; gap: 16px; padding: 2px 0; border-bottom: 1px solid #eee; }
  table { border-collapse: collapse; width: 100%; }
  th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; color: #666; border-bottom: 2px solid #ccc; padding: 6px 8px; }
  td { border-bottom: 1px solid #e5e5e5; padding: 6px 8px; vertical-align: top; }
  td.num, th.num { text-align: right; white-space: nowrap; }
  td.nowrap { white-space: nowrap; }
  td.notes { color: #444; }
  tr.entry-details td { border-bottom: 1px solid #e5e5e5; padding-top: 0; }
  td.details-cell { padding-left: 28px; }
  tr.entry:has(+ tr.entry-details) td { border-bottom: none; }
  tfoot td { border-bottom: none; border-top: 2px solid #ccc; font-weight: 600; }
  table.total { margin-top: 12px; }
  table.total td { width: 50%; }
  .ref { display: inline-block; font-size: 10.5px; color: #555; border: 1px solid #ccc; border-radius: 5px; padding: 0 5px; margin-left: 6px; font-variant-numeric: tabular-nums; vertical-align: middle; }
  h2 .ref { font-size: 11px; }
  .details { display: flex; flex-direction: column; gap: 2px; font-size: 12px; color: #333; }
  .fact .k { display: inline-block; min-width: 92px; margin-right: 10px; color: #777; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.3px; vertical-align: top; }
  .delta { color: #777; }
  .photos { display: inline-flex; flex-wrap: wrap; gap: 8px; vertical-align: top; }
  .photo { margin: 0; text-align: center; max-width: 120px; }
  .photo img { width: 120px; height: 90px; object-fit: cover; border-radius: 4px; display: block; }
  .photo figcaption { font-size: 10px; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .more { align-self: center; color: #777; font-size: 11px; }
  section.task { margin-top: 22px; break-inside: avoid-page; }
  .task-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 6px; }
  .schedule, .task-count { color: #666; font-size: 12px; }
  .task-title .fact { margin-top: 2px; font-size: 12px; }
  .qr { margin: 0; text-align: center; flex: none; }
  .qr img { width: 76px; height: 76px; display: block; }
  .qr figcaption { font-size: 10px; color: #666; }
  .cap-note { margin-top: 14px; color: #888; font-size: 11px; }
  tr.entry, tr.entry-details { break-inside: avoid; }
  @media print { body { margin: 12mm; } }
</style>
</head>
<body>
<h1>${esc(labels.title)} — ${esc(obj.name)}</h1>
<p class="sub">${esc(labels.generated)} ${esc(fmtDate(generatedIso))} · ${esc(labels.entriesLabel(done.length))}</p>
${metaRows ? `<div class="meta">${metaRows}</div>` : ""}
${body}
${opts.capped ? `<p class="cap-note">${esc(labels.capNote)}</p>` : ""}
</body>
</html>`;
}
