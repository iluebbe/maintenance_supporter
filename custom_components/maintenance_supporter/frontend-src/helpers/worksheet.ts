/** Task work sheet (v2.21) — a printable one-pager for a single task.
 *
 *  Everything needed to actually DO the task, on one sheet of paper: object
 *  + task details, the checklist as real tick boxes, the notes, and a QR
 *  pair (open the task / complete it) so the paper links back to the panel.
 *  When the task has a linked PDF manual with a page hint, the manual
 *  excerpt pages are rendered INLINE (downscaled, two per row) via the
 *  vendored pdf.js legacy build — the whole work sheet prints as one
 *  document. The PDF link stays as the fallback when rendering fails.
 *
 *  Mirrors helpers/report.ts: pure function building a self-contained HTML
 *  document; the panel opens it in a new tab where the user prints or saves
 *  as PDF. All user strings are escaped; labels arrive translated.
 */

import type { MaintenanceTask } from "../types";

export interface WorksheetLabels {
  title: string;          // "Work sheet"
  object: string;
  type: string;
  interval: string;
  nextDue: string;
  lastDone: string;
  priority: string;
  checklist: string;
  notes: string;
  scanView: string;       // "Scan to open the task"
  scanComplete: string;   // "Scan to complete"
  manualExcerpt: string;  // "Manual excerpt"
  pages: string;          // "pages"
  printedOn: string;      // "Printed"
  never: string;
  typeLabel: (t: string) => string;
  statusLabel: (s: string) => string;
}

export interface WorksheetExcerpt {
  title: string;
  startPage: number;
  endPage: number;
  url: string; // signed excerpt-endpoint URL (absolute)
  /** Absolute base URL of the vendored pdf.js assets; when set, the sheet
   *  renders the excerpt pages inline (downscaled 2-up) via pdf.js. */
  vendorBase?: string;
}

const esc = (v: unknown): string =>
  String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export function buildTaskWorksheetHtml(
  task: MaintenanceTask,
  objectName: string,
  L: WorksheetLabels,
  formatDate: (iso: string) => string,
  formatRecurrence: (task: MaintenanceTask) => string,
  qrViewDataUri: string | null,
  qrCompleteDataUri: string | null,
  excerpt: WorksheetExcerpt | null,
  nowIso: string,
): string {
  const meta: Array<[string, string]> = [
    [L.object, esc(objectName)],
    [L.type, esc(L.typeLabel(task.type))],
    [L.interval, esc(formatRecurrence(task))],
    [L.nextDue, task.next_due ? esc(formatDate(task.next_due)) : "—"],
    [L.lastDone, task.last_performed ? esc(formatDate(task.last_performed)) : esc(L.never)],
  ];
  if (task.priority && task.priority !== "normal") {
    meta.push([L.priority, esc(task.priority)]);
  }

  const checklist = (task.checklist || [])
    .map((item) => `<li><span class="box"></span>${esc(item)}</li>`)
    .join("");

  const qr = (uri: string | null, caption: string) =>
    uri
      ? `<figure class="qr"><img src="${uri}" alt="" /><figcaption>${esc(caption)}</figcaption></figure>`
      : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${esc(task.name)} — ${esc(L.title)}</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body { font: 13px/1.45 -apple-system, "Segoe UI", Roboto, sans-serif; color: #111; margin: 0; }
  header { display: flex; justify-content: space-between; align-items: flex-start;
           border-bottom: 3px solid #111; padding-bottom: 8px; margin-bottom: 12px; }
  h1 { font-size: 22px; margin: 0 0 2px; }
  .obj { font-size: 14px; color: #444; }
  .qr-row { display: flex; gap: 18px; }
  .qr { margin: 0; text-align: center; }
  .qr img { width: 88px; height: 88px; display: block; }
  .qr figcaption { font-size: 9px; color: #555; max-width: 96px; }
  table.meta { border-collapse: collapse; margin-bottom: 12px; }
  table.meta td { padding: 2px 14px 2px 0; vertical-align: top; }
  table.meta td:first-child { color: #555; white-space: nowrap; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em;
       border-bottom: 1px solid #bbb; padding-bottom: 2px; margin: 14px 0 6px; }
  ul.check { list-style: none; padding: 0; margin: 0; }
  ul.check li { display: flex; align-items: flex-start; gap: 8px; padding: 4px 0; font-size: 14px; }
  .box { width: 14px; height: 14px; border: 1.6px solid #111; border-radius: 2px;
         flex: 0 0 auto; margin-top: 2px; }
  .notes { white-space: pre-wrap; }
  .excerpt a { color: #0b57d0; word-break: break-all; }
  .excerpt-pages { display: flex; flex-wrap: wrap; gap: 3mm; margin-top: 4mm; }
  .excerpt-pages canvas { width: calc(50% - 2mm); height: auto;
    border: 0.4px solid #ccc; break-inside: avoid; }
  footer { position: fixed; bottom: 0; left: 0; right: 0; font-size: 9px; color: #888;
           border-top: 1px solid #ddd; padding-top: 3px; }
  @media screen { body { max-width: 800px; margin: 24px auto; padding: 0 16px; } }
</style></head>
<body>
  <header>
    <div>
      <h1>${esc(task.name)}</h1>
      <div class="obj">${esc(objectName)}</div>
    </div>
    <div class="qr-row">
      ${qr(qrViewDataUri, L.scanView)}
      ${qr(qrCompleteDataUri, L.scanComplete)}
    </div>
  </header>
  <table class="meta">
    ${meta.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${v}</td></tr>`).join("")}
  </table>
  ${checklist ? `<h2>${esc(L.checklist)}</h2><ul class="check">${checklist}</ul>` : ""}
  ${task.notes ? `<h2>${esc(L.notes)}</h2><div class="notes">${esc(task.notes)}</div>` : ""}
  ${excerpt ? `<h2>${esc(L.manualExcerpt)}</h2>
    <div class="excerpt">${esc(excerpt.title)} — ${esc(L.pages)} ${excerpt.startPage}–${excerpt.endPage}:
      <a href="${esc(excerpt.url)}" target="_blank" rel="noopener">PDF</a>
    </div>
    <div id="excerpt-pages" class="excerpt-pages"></div>
    ${excerpt.vendorBase ? `<script type="module">
      // Render the excerpt pages inline (downscaled, two per row) so the
      // whole work sheet prints as ONE document. The link above stays as
      // the fallback if pdf.js or the fetch fails.
      try {
        const pdfjs = await import(${JSON.stringify(excerpt.vendorBase + "/pdf.min.mjs")});
        pdfjs.GlobalWorkerOptions.workerSrc = ${JSON.stringify(excerpt.vendorBase + "/pdf.worker.min.mjs")};
        const doc = await pdfjs.getDocument({ url: ${JSON.stringify(excerpt.url)} }).promise;
        const host = document.getElementById("excerpt-pages");
        for (let n = 1; n <= doc.numPages; n++) {
          const page = await doc.getPage(n);
          const viewport = page.getViewport({ scale: 1.4 }); // crisp at ~50% print width
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width; canvas.height = viewport.height;
          await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
          host.appendChild(canvas);
        }
      } catch (e) { console.warn("excerpt inline render failed", e); }
    </script>` : ""}` : ""}
  <footer>${esc(objectName)} · ${esc(task.name)} · ${esc(L.printedOn)} ${esc(nowIso.slice(0, 10))}</footer>
</body></html>`;
}
