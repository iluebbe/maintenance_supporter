/** Printable area report (#191) — the annual overview of one Home Assistant
 * area: period, key figures, cost per object, cost per month (or year) and
 * every completion in the period, oldest first like a ledger. Opened as a
 * Blob in a new tab; the user prints or saves as PDF from there.
 * Self-contained HTML, no PDF dependency, all user content escaped.
 */

import type { AreaHistoryEntry, AreaTotals, CostBuckets, CostBucket, ObjectCostRow } from "./area-history";
import { escapeHtml as esc } from "./html-escape";

export interface AreaRecordLabels {
  title: string;
  generated: string;
  period: string;
  completions: string;
  totalCost: string;
  avgCost: string;
  totalTime: string;
  costPerObject: string;
  /** Heading of the time table — "Cost per month" or "Cost per year". */
  costPerBucket: string;
  share: string;
  historyHeading: string;
  colDate: string;
  colObject: string;
  colTask: string;
  colCost: string;
  colDuration: string;
  colNotes: string;
  completedBy: string;
  capNote: string;
  none: string;
}

export interface AreaRecordFormat {
  date: (iso: string) => string;
  cost: (amount: number) => string;
  duration: (minutes: number) => string;
  /** Month / year label of a bucket. */
  bucket: (b: CostBucket) => string;
  /** 0..1 → "42 %". */
  share: (fraction: number) => string;
  number: (n: number) => string;
}

export interface AreaRecordData {
  areaName: string;
  /** The period printed in the header (ISO dates or timestamps, formatted
   *  with fmt.date); null = open end, printed as "…". */
  from: string | null;
  to: string | null;
  totals: AreaTotals;
  byObject: ReadonlyArray<ObjectCostRow>;
  buckets: CostBuckets;
  /** The filtered entries — completed ones print; completedBy already
   *  resolved to a display name (or null), notes already display text. */
  entries: ReadonlyArray<AreaHistoryEntry>;
  capped: boolean;
}

export function buildAreaRecordHtml(
  data: AreaRecordData,
  labels: AreaRecordLabels,
  fmt: AreaRecordFormat,
  generatedIso: string,
): string {
  const done = data.entries.filter((e) => e.type === "completed").sort((a, b) => a.ts - b.ts);
  const period = `${data.from ? fmt.date(data.from) : "…"} – ${data.to ? fmt.date(data.to) : "…"}`;
  const t = data.totals;

  const kpis = (
    [
      [labels.completions, fmt.number(t.completions)],
      [labels.totalCost, fmt.cost(t.totalCost)],
      [labels.avgCost, t.avgCost != null ? fmt.cost(t.avgCost) : labels.none],
      [labels.totalTime, t.totalDuration ? fmt.duration(t.totalDuration) : labels.none],
    ] as Array<[string, string]>
  )
    .map(([k, v]) => `<div class="kpi"><div class="k">${esc(k)}</div><div class="v">${esc(v)}</div></div>`)
    .join("");

  const objectRows = data.byObject
    .map((r) => `<tr>
      <td>${esc(r.objectName)}</td>
      <td class="num">${esc(fmt.number(r.completions))}</td>
      <td class="num">${esc(fmt.cost(r.cost))}</td>
      <td class="num">${esc(fmt.share(r.share))}</td>
    </tr>`)
    .join("");

  const maxBucket = data.buckets.buckets.reduce((m, b) => Math.max(m, b.cost), 0);
  const bucketRows = data.buckets.buckets
    .map((b) => {
      // A proportional bar in the cost cell: the sheet reads as a chart on
      // paper too, without an image (print-color-adjust keeps the fill).
      const pct = maxBucket > 0 ? Math.round((b.cost / maxBucket) * 100) : 0;
      return `<tr>
      <td class="nowrap">${esc(fmt.bucket(b))}</td>
      <td class="num">${esc(fmt.number(b.completions))}</td>
      <td class="bar-cell">${pct > 0 ? `<span class="bar" style="width:${pct}%"></span>` : ""}</td>
      <td class="num">${esc(fmt.cost(b.cost))}</td>
    </tr>`;
    })
    .join("");

  const entryRows = done
    .map((e) => {
      const notes = [e.notes, e.completedBy ? `${labels.completedBy}: ${e.completedBy}` : null].filter(Boolean).join(" · ");
      const task = e.phaseName ? `${e.taskName} · ${e.phaseName}` : e.taskName;
      return `<tr>
      <td class="nowrap">${esc(fmt.date(e.timestamp))}</td>
      <td>${esc(e.objectName)}</td>
      <td>${esc(task)}</td>
      <td class="num">${e.cost != null ? esc(fmt.cost(e.cost)) : esc(labels.none)}</td>
      <td class="num">${e.duration != null ? esc(fmt.duration(e.duration)) : esc(labels.none)}</td>
      <td class="notes">${esc(notes) || esc(labels.none)}</td>
    </tr>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${esc(labels.title)} — ${esc(data.areaName)}</title>
<style>
  /* Printable sheet: it opens as a blob in whatever viewer the OS supplies
     (Companion = WebView, dark phones paint a dark default canvas), so the
     document states its own light scheme and paints its background. */
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { font: 13px/1.5 -apple-system, Segoe UI, Roboto, sans-serif; color: #1a1a1a; background: #fff; margin: 32px; }
  h1 { font-size: 22px; margin: 0 0 2px; }
  h2 { font-size: 15px; margin: 24px 0 8px; }
  .sub { color: #666; margin: 0 0 16px; }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 0 0 8px; }
  .kpi { border: 1px solid #ddd; border-radius: 6px; padding: 8px 10px; }
  .kpi .k { color: #777; font-size: 10.5px; text-transform: uppercase; letter-spacing: .04em; }
  .kpi .v { font-size: 16px; font-weight: 600; }
  table { border-collapse: collapse; width: 100%; }
  th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: #666; border-bottom: 2px solid #ccc; padding: 6px 8px; }
  td { border-bottom: 1px solid #e5e5e5; padding: 6px 8px; vertical-align: top; }
  td.num, th.num { text-align: right; white-space: nowrap; }
  td.nowrap { white-space: nowrap; }
  td.notes { color: #444; }
  td.bar-cell { width: 40%; vertical-align: middle; }
  .bar { display: block; height: 10px; background: #9aa7b8; border-radius: 0 3px 3px 0;
         -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  tfoot td { border-bottom: none; border-top: 2px solid #ccc; font-weight: 600; }
  tr { break-inside: avoid; }
  .cap-note { margin-top: 14px; color: #888; font-size: 11px; }
  @media print { body { margin: 12mm; } }
</style>
</head>
<body>
<h1>${esc(labels.title)} — ${esc(data.areaName)}</h1>
<p class="sub">${esc(labels.period)}: ${esc(period)} · ${esc(labels.generated)} ${esc(fmt.date(generatedIso))}</p>
<div class="kpis">${kpis}</div>

<h2>${esc(labels.costPerObject)}</h2>
<table>
  <thead><tr>
    <th>${esc(labels.colObject)}</th><th class="num">${esc(labels.completions)}</th>
    <th class="num">${esc(labels.colCost)}</th><th class="num">${esc(labels.share)}</th>
  </tr></thead>
  <tbody>${objectRows || `<tr><td colspan="4">${esc(labels.none)}</td></tr>`}</tbody>
  <tfoot><tr>
    <td>${esc(labels.totalCost)}</td><td class="num">${esc(fmt.number(t.completions))}</td>
    <td class="num">${esc(fmt.cost(t.totalCost))}</td><td></td>
  </tr></tfoot>
</table>

<h2>${esc(labels.costPerBucket)}</h2>
<table>
  <thead><tr>
    <th>${esc(labels.period)}</th><th class="num">${esc(labels.completions)}</th>
    <th></th><th class="num">${esc(labels.colCost)}</th>
  </tr></thead>
  <tbody>${bucketRows || `<tr><td colspan="4">${esc(labels.none)}</td></tr>`}</tbody>
</table>

<h2>${esc(labels.historyHeading)} (${esc(fmt.number(done.length))})</h2>
<table>
  <thead><tr>
    <th>${esc(labels.colDate)}</th><th>${esc(labels.colObject)}</th><th>${esc(labels.colTask)}</th>
    <th class="num">${esc(labels.colCost)}</th><th class="num">${esc(labels.colDuration)}</th><th>${esc(labels.colNotes)}</th>
  </tr></thead>
  <tbody>
${entryRows || `<tr><td colspan="6">${esc(labels.none)}</td></tr>`}
  </tbody>
  <tfoot><tr>
    <td colspan="3">${esc(labels.totalCost)}</td>
    <td class="num">${esc(fmt.cost(t.totalCost))}</td>
    <td class="num">${t.totalDuration ? esc(fmt.duration(t.totalDuration)) : ""}</td><td></td>
  </tr></tfoot>
</table>
${data.capped ? `<p class="cap-note">${esc(labels.capNote)}</p>` : ""}
</body>
</html>`;
}
