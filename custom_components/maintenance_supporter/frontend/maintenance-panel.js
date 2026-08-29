/*! maintenance_supporter frontend 2.67.0 */
import{a as he,b as Ht,c as vt,d as Nt,e as Ct,f as ue,g as ge,h as me}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-OLTAFAWB.js";import{a as W,b as Bt,c as Vt,d as ve,e as be,f as Ut,g as fe,h as ye,i as $e,j as we,k as ke,l as Te,m as je,n as Se,o as Ee,p as Me,u as Ce,x as De}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-W5PHKKDQ.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-GGHF6BP7.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-WYUJHA6S.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-NJAS4GTU.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-P2KHB4EK.js";import{b as _e}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-MO66KLQB.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-VWXJ3NLE.js";import{a as Xt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-Y23XZ6RW.js";import{a as xe}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-3YRDL7JR.js";import{a as S}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ZZBLAQHX.js";import{A as Et,B as Mt,C as pe,D as Ft,a as u,b as D,c as o,d as H,f as d,h as R,i as Jt,j as le,k as ce,l as $,m,n as zt,o as It,p as Lt,q as s,r as Pt,s as P,t as de,u as Y,v as V,w as kt,x as _t}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-C7MO5BGD.js";var ii=["assignee_pool","required_completion_fields","checklist","labels","history"],si=["checklist_progress"],ai=["tasks","parts"],ri=["manual_docs","battery_fleet_excluded"];function te(r,n,t=[]){for(let e of n)r[e]===void 0&&(r[e]=[]);for(let e of t)r[e]===void 0&&(r[e]={})}function oi(r){let n=r;te(n,ai),n.object&&typeof n.object=="object"&&te(n.object,ri);for(let t of n.tasks)te(t,ii,si);return r}function Dt(r){for(let n of r)oi(n);return r}function ni(r,n){if(n.objects)return n.objects;let t=n.delta||[],e=n.removed||[];if(!t.length&&!e.length)return null;let i=new Map(r.map(a=>[a.entry_id,a]));for(let a of t)i.set(a.entry_id,a);for(let a of e)i.delete(a);return[...i.values()]}function Re(r,n){return n.objects&&Dt(n.objects),n.delta&&Dt(n.delta),ni(r,n)}var A={overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort"};function J(r){try{return localStorage.getItem(r)}catch{return null}}function q(r,n){try{localStorage.setItem(r,n)}catch{}}var li=168*3600*1e3;function Oe(){try{let r=J(A.objectsCache);if(!r)return null;let n=JSON.parse(r);return n.v!==Jt||!Number.isFinite(n.at)||Date.now()-n.at>li||!Array.isArray(n.objects)||n.objects.length===0?null:{objects:n.objects,stats:n.stats??null}}catch{return null}}function ee(r,n){if(!(!Array.isArray(r)||r.length===0))try{let t={v:Jt,at:Date.now(),objects:r,stats:n};q(A.objectsCache,JSON.stringify(t))}catch{}}function O(r){return String(r??"").replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}function Ae(r,n,t,e,i,a){let l=[[t.manufacturer,r.manufacturer],[t.model,r.model],[t.serial,r.serial_number],[t.installed,r.installation_date?e(r.installation_date):null],[t.warranty,r.warranty_expiry?e(r.warranty_expiry):null]].filter(([,h])=>!!h),p=n.map(h=>{let g=t.scheduleLabel(h);return`<tr>
      <td>${O(h.name)}</td>
      <td>${O(t.typeLabel(h.type))}</td>
      <td>${O(t.statusLabel(h.status))}</td>
      <td>${O(g)}</td>
      <td>${O(h.last_performed?e(h.last_performed):t.none)}</td>
      <td>${O(h.next_due?e(h.next_due):t.none)}</td>
      <td class="num">${h.times_performed??0}</td>
      <td class="num">${(h.total_cost??0).toFixed(2)} ${O(i)}</td>
    </tr>`}).join(""),c=n.reduce((h,g)=>h+(g.total_cost??0),0);return`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${O(t.title)} \u2014 ${O(r.name)}</title>
<style>
  /* This is a PRINTABLE sheet, not part of the app's theme: it opens as a
     blob in whatever viewer the OS supplies. In the Companion app that is a
     WebView, and a WebView on a dark-themed phone paints a DARK default
     canvas \u2014 against which the dark body text below disappeared completely,
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
  <h1>${O(r.name)}</h1>
  <p class="sub">${O(t.title)} \xB7 ${O(t.generated)}: ${O(e(a))}</p>
  ${l.length?`<div class="meta">${l.map(([h,g])=>`<div><div class="k">${O(h)}</div>${O(g)}</div>`).join("")}</div>`:""}
  <h2>${O(t.tasksHeading)} (${n.length})</h2>
  <table>
    <thead><tr>
      <th>${O(t.colTask)}</th><th>${O(t.colType)}</th><th>${O(t.colStatus)}</th>
      <th>${O(t.colSchedule)}</th><th>${O(t.colLastDone)}</th><th>${O(t.colNextDue)}</th>
      <th class="num">${O(t.colTimes)}</th><th class="num">${O(t.colCost)}</th>
    </tr></thead>
    <tbody>${p||`<tr><td colspan="8">${O(t.none)}</td></tr>`}</tbody>
    <tfoot><tr><td colspan="7">${O(t.totalCost)}</td><td class="num">${c.toFixed(2)} ${O(i)}</td></tr></tfoot>
  </table>
  ${r.notes?`<div class="notes"><strong>${O(t.notes)}:</strong>
${O(r.notes)}</div>`:""}
</body></html>`}function ie(r,n=new Date){if(!r)return{kind:"none",days:null,date:null};let t=new Date(`${r}T00:00:00`);if(isNaN(t.getTime()))return{kind:"none",days:null,date:null};let e=Date.UTC(n.getFullYear(),n.getMonth(),n.getDate()),i=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),a=Math.round((i-e)/864e5);return a<0?{kind:"expired",days:a,date:r}:a<=60?{kind:"expiring",days:a,date:r}:{kind:"valid",days:a,date:r}}var I=r=>String(r??"").replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n]);function ze(r,n,t,e,i,a,l,p,c,h=[]){let g=[[t.object,I(n)],[t.type,I(t.typeLabel(r.type))],[t.interval,I(i(r))],[t.nextDue,r.next_due?I(e(r.next_due)):"\u2014"],[t.lastDone,r.last_performed?I(e(r.last_performed)):I(t.never)]];r.priority&&r.priority!=="normal"&&g.push([t.priority,I(r.priority)]);let v=(r.checklist||[]).map(y=>`<li><span class="box"></span>${I(y)}</li>`).join(""),_=(y,k)=>y?`<figure class="qr"><img src="${y}" alt="" /><figcaption>${I(k)}</figcaption></figure>`:"";return`<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="color-scheme" content="light">
<title>${I(r.name)} \u2014 ${I(t.title)}</title>
<style>
  /* A work sheet is meant to be printed or read as a sheet, so it must not
     inherit the phone's dark theme: the Companion app opens it in a WebView
     that paints a dark canvas, and this dark text would vanish against it.
     See the same note in report.ts. */
  :root { color-scheme: light; }
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body { font: 13px/1.45 -apple-system, "Segoe UI", Roboto, sans-serif; color: #111; background: #fff; margin: 0; }
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
      <h1>${I(r.name)}</h1>
      <div class="obj">${I(n)}</div>
    </div>
    <div class="qr-row">
      ${_(a,t.scanView)}
      ${_(l,t.scanComplete)}
    </div>
  </header>
  <table class="meta">
    ${g.map(([y,k])=>`<tr><td>${I(y)}</td><td>${k}</td></tr>`).join("")}
  </table>
  ${v?`<h2>${I(t.checklist)}</h2><ul class="check">${v}</ul>`:""}
  ${h.length?`<h2>${I(t.parts)}</h2><ul class="check">${h.map(y=>`<li><span class="box"></span>${I(y)}</li>`).join("")}</ul>`:""}
  ${r.notes?`<h2>${I(t.notes)}</h2><div class="notes">${I(r.notes)}</div>`:""}
  ${p?`<h2>${I(t.manualExcerpt)}</h2>
    <div class="excerpt">${I(p.title)} \u2014 ${I(t.pages)} ${p.startPage}\u2013${p.endPage}:
      <a href="${I(p.url)}" target="_blank" rel="noopener">PDF</a>
    </div>
    <div id="excerpt-pages" class="excerpt-pages"></div>
    ${p.vendorBase?`<script type="module">
      // Render the excerpt pages inline (downscaled, two per row) so the
      // whole work sheet prints as ONE document. The link above stays as
      // the fallback if pdf.js or the fetch fails.
      try {
        const pdfjs = await import(${JSON.stringify(p.vendorBase+"/pdf.min.mjs")});
        pdfjs.GlobalWorkerOptions.workerSrc = ${JSON.stringify(p.vendorBase+"/pdf.worker.min.mjs")};
        const doc = await pdfjs.getDocument({ url: ${JSON.stringify(p.url)} }).promise;
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
    <\/script>`:""}`:""}
  <footer>${I(n)} \xB7 ${I(r.name)} \xB7 ${I(t.printedOn)} ${I(c.slice(0,10))}</footer>
</body></html>`}var Ie=D`
  :host {
    display: block;
    height: 100%;
    background: var(--primary-background-color);
  }

  .panel {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 4px;
    background: var(--app-header-background-color, var(--primary-color));
    color: var(--app-header-text-color, white);
    padding: 12px 16px;
    font-size: 16px;
  }

  .header ha-menu-button {
    margin-right: 4px;
    color: var(--app-header-text-color, white);
  }
  .header ha-icon-button {
    --mdc-icon-button-size: 36px;
    --mdc-icon-size: 20px;
    color: var(--app-header-text-color, white);
  }

  .breadcrumbs { display: flex; align-items: center; gap: 4px; }
  .breadcrumbs a { color: inherit; opacity: 0.8; cursor: pointer; text-decoration: none; }
  .breadcrumbs a:hover { opacity: 1; text-decoration: underline; }
  .breadcrumbs .sep { opacity: 0.5; margin: 0 4px; }
  .breadcrumbs .current { font-weight: 500; }

  .content { flex: 1; overflow-y: auto; padding: 0 16px 16px; }

  .filter-bar {
    display: flex;
    /* Wrap at EVERY width: with six filter dropdowns + action buttons the
       bar doesn't fit one line even on wide tablets, and unwrapped flex
       compressed the selects into unreadable stubs ("— No v", "Al"). */
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
    padding: 8px 0;
    gap: 8px;
  }

  /* Narrow-viewport disclosure (UX 2026-07): the collapsed class is only
     ever set when the host is narrow — desktop always renders inline. */
  .filter-bar.collapsed {
    display: none;
  }

  .mobile-controls {
    display: flex;
    gap: 8px;
    padding: 8px 0 0;
  }

  .mobile-controls .mobile-toggle,
  .mobile-controls .new-menu-wrapper {
    flex: 1;
  }

  .mobile-controls .new-menu-wrapper .new-menu-button {
    width: 100%;
  }

  .mobile-controls .mobile-toggle.active {
    --ha-button-background: var(--primary-color);
  }

  /* #125: the one "New" menu that replaced the six-button actions bar. */
  .new-menu-wrapper {
    position: relative;
    margin-left: auto;
  }
  .new-menu-popup {
    right: 0;
    left: auto;
    min-width: 256px;
  }
  .new-menu-popup .popup-menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .new-menu-popup .popup-menu-item ha-icon {
    --mdc-icon-size: 18px;
    color: var(--secondary-text-color);
  }
  :host([narrow]) .new-menu-popup { right: 0; left: auto; }

  /* #125: getting-started chips — visibly temporary onboarding hints. */
  .gs-chips-wrap { margin: 2px 0 12px; }
  .gs-chips-label {
    font-size: 11px;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 7px;
  }
  .gs-chips { display: flex; gap: 10px; flex-wrap: wrap; }
  .gs-chip {
    display: flex;
    align-items: center;
    gap: 9px;
    background: var(--secondary-background-color);
    border: 1px dashed var(--divider-color);
    border-radius: 16px;
    padding: 7px 8px 7px 13px;
    font-size: 12.5px;
    cursor: pointer;
  }
  .gs-chip ha-icon { --mdc-icon-size: 16px; color: var(--primary-color); }
  .gs-chip-x { display: inline-flex; padding: 0 3px; }
  .gs-chip-x ha-icon { --mdc-icon-size: 14px; color: var(--secondary-text-color); }

  .filter-field {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .filter-label {
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: var(--secondary-text-color);
    padding-left: 2px;
  }

  .filter-bar select {
    padding: 8px;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    /* Readability floor — selects wrap to the next line instead of
       shrinking their selected value into ellipsis. */
    min-width: 96px;
  }

  /* Desktop: the LIST owns the 7-column grid and every row is a subgrid
     spanning all columns. Sharing the tracks across rows is what actually
     keeps the title (and every other column) aligned regardless of which
     optional badges/chips a given row carries. A per-row grid can't: each
     row would size its auto badges column independently, so a row with an
     NFC badge pushed its title right of the others (issue #66). */
  .task-table {
    display: grid;
    grid-template-columns:
      auto                         /* badges */
      minmax(100px, 180px)         /* object-name */
      minmax(120px, 1fr)           /* task-name */
      minmax(0, 220px)             /* task-sub (chips) */
      100px                        /* type */
      150px                        /* due-cell */
      auto;                        /* row-actions */
    column-gap: 12px;
  }

  .task-row {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    align-items: center;
    column-gap: 12px;
    padding: 10px 12px;
    border-bottom: 1px solid var(--divider-color);
    cursor: pointer;
    transition: background 0.15s;
  }

  /* Virtualized task table (large installs): only the scroll window of rows
     is in the DOM. The spacers span all columns and carry the off-window
     height so the scrollbar stays honest. The sizer row is invisible and
     zero-height but its badge cell still participates in subgrid track
     sizing — pinning the content-sized badge column to the widest badge set
     across ALL rows, so columns can't jitter while scrolling. */
  .virt-spacer { grid-column: 1 / -1; }
  .task-row.virt-sizer {
    height: 0;
    min-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    border: none;
    overflow: hidden;
    visibility: hidden;
    pointer-events: none;
  }

  /* Bulk selection: a leading checkbox column while selecting. */
  .task-table.bulk { grid-template-columns: auto auto minmax(100px, 180px) minmax(120px, 1fr) minmax(0, 220px) 100px 150px auto; }

  /* Wide desktop (UX 2026-07): with a 1fr name column the slack landed
     BETWEEN the task name and its right-aligned chips — a ragged hole in
     the middle of every row. Size the name track to its content instead
     and hand the slack to the chips track, chips now left-aligned: the
     row reads as a left description cluster (badges/object/name/chips)
     and a right meta cluster (type/due/actions). */
  @media (min-width: 1200px) {
    .task-table {
      grid-template-columns:
        auto                       /* badges */
        minmax(100px, 180px)       /* object-name */
        fit-content(400px)         /* task-name — hugs the longest name */
        minmax(0, 1fr)             /* task-sub (chips) absorbs the slack */
        100px                      /* type */
        150px                      /* due-cell */
        auto;                      /* row-actions */
    }
    .task-table.bulk {
      grid-template-columns: auto auto minmax(100px, 180px) fit-content(400px) minmax(0, 1fr) 100px 150px auto;
    }
    .task-table .task-sub {
      justify-content: flex-start;
    }
  }
  .bulk-check { display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .bulk-check input, .bulk-selectall input { width: 17px; height: 17px; cursor: pointer; accent-color: var(--primary-color); }
  .task-row.bulk-selected { background: color-mix(in srgb, var(--primary-color) 12%, transparent); }
  .bulk-bar {
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
    padding: 8px 12px; margin-bottom: 8px; border-radius: 8px;
    background: var(--secondary-background-color); border: 1px solid var(--divider-color);
    position: sticky; top: 0; z-index: 5;
  }
  .bulk-selectall { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; }
  .bulk-count { color: var(--secondary-text-color); font-size: 13px; }
  .bulk-actions { margin-left: auto; display: inline-flex; gap: 8px; }
  .bulk-toggle.active { --mdc-theme-primary: var(--primary-color); }

  /* Collapsible analysis sections on the task-detail overview tab. The header
     owns the title, so the wrapped card's own title row is hidden to avoid
     showing it twice. */
  .collapsible { margin: 8px 0; border: 1px solid var(--divider-color); border-radius: 10px; overflow: hidden; }
  .collapsible-head {
    display: flex; align-items: center; gap: 8px; width: 100%;
    font: inherit; font-weight: 600; font-size: 14px; text-align: left;
    padding: 10px 12px; cursor: pointer; background: var(--secondary-background-color);
    border: none; color: var(--primary-text-color);
  }
  .collapsible-head:hover { background: var(--table-row-alternative-background-color, rgba(0,0,0,.04)); }
  .collapsible-head ha-icon { --mdc-icon-size: 20px; color: var(--secondary-text-color); }
  .collapsible-body { padding: 4px 12px 12px; }
  .collapsible-body > .weibull-section > .weibull-title,
  .collapsible-body > .seasonal-chart > .seasonal-chart-title { display: none; }

  /* "Today" focus view — mobile-first list grouped by urgency. */
  .today-view { display: flex; flex-direction: column; gap: 16px; padding: 4px 0 12px; }
  .today-section { border: 1px solid var(--divider-color); border-radius: 12px; overflow: hidden; }
  .today-section-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; font-weight: 600; font-size: 14px;
    background: var(--secondary-background-color);
    border-left: 4px solid var(--divider-color);
  }
  .today-section-header.overdue { border-left-color: var(--error-color, #f44336); }
  .today-section-header.due_soon { border-left-color: var(--warning-color, #ff9800); }
  .today-badge {
    min-width: 22px; text-align: center; padding: 1px 8px; border-radius: 11px;
    background: var(--primary-color); color: var(--text-primary-color, #fff); font-size: 12.5px;
  }
  .today-row {
    display: flex; align-items: center; gap: 12px; padding: 11px 14px;
    border-top: 1px solid var(--divider-color); cursor: pointer;
    content-visibility: auto; contain-intrinsic-size: auto 46px;
  }
  .today-row:hover { background: var(--table-row-alternative-background-color, rgba(0,0,0,.04)); }
  .today-dot { width: 10px; height: 10px; border-radius: 50%; flex: none; background: var(--success-color, #4caf50); }
  .today-dot.overdue { background: var(--error-color, #f44336); }
  .today-dot.due_soon { background: var(--warning-color, #ff9800); }
  .today-dot.triggered { background: #ff5722; }
  .today-main { flex: 1; min-width: 0; }
  .today-task { font-weight: 600; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .today-object { color: var(--secondary-text-color); font-size: 12.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .today-row .btn-complete { color: var(--success-color, #4caf50); flex: none; }
  .today-empty {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    padding: 48px 16px; color: var(--secondary-text-color); text-align: center;
  }
  .today-empty ha-icon { --mdc-icon-size: 56px; color: var(--success-color, #4caf50); }

  /* Command palette (Ctrl/Cmd+K). */
  .palette-backdrop {
    position: fixed; inset: 0; z-index: 1100; background: rgba(0,0,0,.4);
    display: flex; align-items: flex-start; justify-content: center; padding-top: 12vh;
    animation: toast-in .15s ease;
  }
  .palette {
    width: min(620px, 92vw); max-height: 66vh; display: flex; flex-direction: column;
    background: var(--card-background-color, #fff); border-radius: 12px; overflow: hidden;
    box-shadow: 0 12px 48px rgba(0,0,0,.4);
  }
  .palette-input {
    font: inherit; font-size: 16px; padding: 16px 18px; border: none; outline: none;
    background: transparent; color: var(--primary-text-color);
    border-bottom: 1px solid var(--divider-color);
  }
  .palette-results { overflow-y: auto; }
  .palette-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 16px; cursor: pointer;
  }
  .palette-item.active { background: color-mix(in srgb, var(--primary-color) 14%, transparent); }
  .palette-item ha-icon { --mdc-icon-size: 20px; color: var(--secondary-text-color); flex: none; }
  .palette-label { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .palette-sub { margin-left: auto; color: var(--secondary-text-color); font-size: 12.5px; flex: none; padding-left: 10px; }
  .palette-empty { padding: 20px 16px; color: var(--secondary-text-color); text-align: center; }
  .palette-hint { padding: 8px 16px; font-size: 12px; color: var(--secondary-text-color); border-top: 1px solid var(--divider-color); }

  /* Template gallery. */
  .template-gallery {
    width: min(720px, 94vw); max-height: 80vh; display: flex; flex-direction: column;
    background: var(--card-background-color, #fff); border-radius: 12px; overflow: hidden;
    box-shadow: 0 12px 48px rgba(0,0,0,.4);
  }
  .template-gallery-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 8px 12px 18px; font-weight: 600; font-size: 16px;
    border-bottom: 1px solid var(--divider-color);
  }
  .template-gallery-body { overflow-y: auto; padding: 8px 16px 16px; }
  .template-cat { margin-top: 12px; }
  .template-cat-head {
    display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 13px;
    color: var(--secondary-text-color); margin-bottom: 8px;
  }
  .template-cat-head ha-icon { --mdc-icon-size: 20px; }
  .template-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }
  .template-card {
    display: flex; flex-direction: column; gap: 4px; text-align: left; cursor: pointer;
    padding: 12px 14px; border: 1px solid var(--divider-color); border-radius: 10px;
    background: var(--card-background-color); font: inherit; color: var(--primary-text-color);
  }
  .template-card:hover { border-color: var(--primary-color); background: color-mix(in srgb, var(--primary-color) 6%, transparent); }
  .template-card[disabled] { opacity: .5; pointer-events: none; }
  .template-card-name { font-weight: 600; font-size: 14px; }
  .template-card-count { font-size: 12px; color: var(--secondary-text-color); }
  .empty-onboard-hint { color: var(--secondary-text-color); font-size: 13px; margin: 4px 0 12px; }
  .empty-onboard-actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }

  .task-row:hover {
    background: var(--table-row-alternative-background-color, rgba(0, 0, 0, 0.04));
  }

  /* Wrapper for status + optional disabled/NFC badges so they share one grid column */
  .cell-badges {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .cell { font-size: 14px; }
  .cell.object-name { color: var(--primary-color); cursor: pointer; }
  .cell.task-name { font-weight: 500; }
  .cell.type { color: var(--secondary-text-color); }

  /* Task subline chips (group / area / assigned user) — desktop shows inline, mobile wraps below */
  .task-sub {
    display: flex;
    gap: 6px;
    align-items: center;
    font-size: 12px;
    color: var(--secondary-text-color);
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  /* Empty subline still occupies its grid slot so neighbouring columns line up */
  .task-sub-empty { min-height: 1px; }
  .sub-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    padding: 2px 8px;
    border-radius: 10px;
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.1));
    line-height: 1.4;
  }
  .sub-chip ha-icon {
    --mdc-icon-size: 14px;
    opacity: 0.75;
  }

  /* Row action buttons (Complete / Skip): right-aligned in their column and a
     bit larger — the default mwc glyph reads small inside its padded button. */
  .row-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 2px;
  }
  .row-actions mwc-icon-button {
    --mdc-icon-button-size: 44px;
    --mdc-icon-size: 26px;
  }

  /* Custom elements default to display:inline; the task-detail component
     renders light-DOM and must behave like the block it wraps. */
  maintenance-task-detail-view { display: block; }

  .detail-section { padding: 16px 0; }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .detail-header h2 { margin: 0; font-size: 22px; }
  h3 { margin: 16px 0 8px; font-size: 16px; font-weight: 500; }
  .meta { color: var(--secondary-text-color); margin: 4px 0; }
  /* v1.4.10 (#46): per-object free-form notes block */
  .object-notes {
    margin: 12px 0 4px;
    padding: 12px 14px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    border-left: 3px solid var(--primary-color, #03a9f4);
    border-radius: 4px;
  }
  .object-notes-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.4px;
    margin-bottom: 6px;
  }
  .object-notes-body {
    color: var(--primary-text-color);
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.45;
  }
  /* Markdown notes: <ha-markdown> parses the source itself — the container's
     pre-wrap must not leak into its rendered paragraphs. */
  .object-notes-body ha-markdown,
  .task-meta-notes ha-markdown {
    white-space: normal;
  }
  .empty { color: var(--secondary-text-color); font-style: italic; }
  .analysis-empty-state { text-align: center; padding: 24px 16px; }
  .analysis-empty-state .empty { font-size: 15px; margin-bottom: 8px; }
  .analysis-empty-state .empty-icon {
    --mdc-icon-size: 48px;
    color: var(--secondary-text-color);
    opacity: 0.4;
    display: block;
    margin: 0 auto 12px;
  }
  .empty-hint { color: var(--secondary-text-color); font-size: 13px; margin: 4px 0; }
  .analysis-progress {
    width: 120px; margin: 12px auto 4px; height: 6px;
    background: var(--divider-color, #e0e0e0); border-radius: 3px; overflow: hidden;
  }
  .analysis-progress-bar {
    height: 100%; background: var(--primary-color); border-radius: 3px;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 8px;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    padding: 8px;
    background: var(--card-background-color, #fff);
    border-radius: 8px;
  }

  .info-item .label {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-bottom: 2px;
  }

  /* Dashboard redesign styles */

  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: var(--card-background-color, #fff);
    border-radius: 8px;
    margin-bottom: 16px;
    gap: 12px;
    flex-wrap: wrap;
  }

  .task-header-title {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .task-name-breadcrumb,
  .object-name-breadcrumb {
    cursor: pointer;
    color: var(--primary-text-color);
    text-decoration: none;
  }

  .task-name-breadcrumb:hover,
  .object-name-breadcrumb:hover {
    text-decoration: underline;
  }

  .breadcrumb-separator {
    color: var(--secondary-text-color);
    margin: 0 4px;
  }

  .status-chip {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
  }

  /* Same theme tokens as STATUS_COLORS / .status-badge / .cal-status (this set
     predated the token migration and kept bare hex, so it alone ignored custom/
     dark themes — the 3-palette drift the DRY audit flagged). Dark text on the
     light chips (green/orange): white is 2.2–2.8:1, below the 3:1 WCAG UI floor. */
  .status-chip.ok {
    background: var(--success-color, #4caf50);
    color: #000;
  }

  .status-chip.warning {
    background: var(--warning-color, #ff9800);
    color: #000;
  }

  .status-chip.overdue {
    background: var(--error-color, #f44336);
    color: white;
  }

  .status-chip.done {
    background: var(--maint-done-color, #78909c);
    color: white;
  }

  /* (#67) Warranty status chip — object detail meta + objects table */
  .warranty-chip {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }
  .warranty-valid {
    background: rgba(76, 175, 80, 0.15);
    color: var(--success-color, #2e7d32);
  }
  .warranty-expiring {
    background: rgba(255, 152, 0, 0.18);
    color: var(--warning-color, #e65100);
  }
  .warranty-expired {
    background: rgba(244, 67, 54, 0.16);
    color: var(--error-color, #c62828);
  }
  .warranty-none {
    color: var(--secondary-text-color);
  }

  /* (#67) All-Objects view-mode toggle (cards / table) */
  .view-toggle {
    display: inline-flex;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    overflow: hidden;
    align-self: end;
  }
  .view-toggle-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 10px;
    background: var(--card-background-color, #fff);
    color: var(--secondary-text-color);
    border: none;
    cursor: pointer;
  }
  .view-toggle-btn + .view-toggle-btn { border-left: 1px solid var(--divider-color); }
  .view-toggle-btn.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  .view-toggle-btn ha-icon { --mdc-icon-size: 18px; }

  /* (#130) All-parts view: sibling chip in the breadcrumb + table extras */
  .sibling-view-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-left: 12px;
    padding: 4px 10px;
    border: 1px solid var(--divider-color);
    border-radius: 14px;
    background: none;
    color: var(--secondary-text-color);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
  }
  .sibling-view-chip:hover {
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    color: var(--primary-text-color);
  }
  .sibling-view-chip ha-icon { --mdc-icon-size: 16px; }
  .part-low-icon {
    --mdc-icon-size: 16px;
    color: var(--warning-color, #ff9800);
    vertical-align: middle;
    margin-left: 6px;
  }
  .part-consumer-chip {
    display: inline-block;
    margin: 1px 4px 1px 0;
    padding: 1px 8px;
    border: 1px solid var(--divider-color);
    border-radius: 10px;
    font-size: 12px;
    color: var(--secondary-text-color);
  }
  .part-consumer-chip.pooled { border-style: dashed; }

  /* (#67) Objects table (desktop All-Objects view) */
  .objects-table-wrap {
    overflow-x: auto;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
  }
  .objects-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  .objects-table th,
  .objects-table td {
    text-align: left;
    padding: 8px 12px;
    border-bottom: 1px solid var(--divider-color);
    white-space: nowrap;
  }
  .objects-table thead th {
    font-weight: 600;
    color: var(--secondary-text-color);
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
    position: sticky;
    top: 0;
  }
  .objects-table tbody tr { cursor: pointer; }
  .objects-table tbody tr:hover {
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
  }
  .objects-table tbody tr:last-child td { border-bottom: none; }
  .objects-table-name { font-weight: 500; color: var(--primary-text-color); }
  .doc-badge {
    display: inline-flex; align-items: center; gap: 2px; vertical-align: middle;
    margin-left: 8px; padding: 1px 7px 1px 5px; border-radius: 10px;
    font-size: 12px; font-weight: 600;
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
    color: var(--secondary-text-color, #888);
  }
  .doc-badge ha-icon { --mdc-icon-size: 14px; }
  /* v2.20 (N3): paused marker on object cards + the detail meta line. */
  .paused-badge {
    display: inline-flex; align-items: center; vertical-align: middle;
    margin-left: 8px; color: var(--info-color, #2196f3);
  }
  .paused-badge ha-icon { --mdc-icon-size: 16px; }
  .paused-meta {
    display: flex; align-items: center; gap: 6px;
    color: var(--info-color, #2196f3); font-weight: 500;
  }
  .paused-meta ha-icon { --mdc-icon-size: 16px; }
  .objects-table .oc-notes {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .objects-table .oc-task_count,
  .objects-table .oc-actions { text-align: center; }

  .user-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 2px 8px;
    margin-left: 8px;
    background: var(--primary-color);
    color: var(--text-primary-color);
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
    line-height: 1.4;
  }

  .user-badge ha-icon {
    --mdc-icon-size: 12px;
  }

  .nfc-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 3px 8px;
    margin-left: 6px;
    background: var(--secondary-background-color, #e8e8e8);
    color: var(--primary-text-color);
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
  }
  .priority-badge {
    display: inline-flex;
    align-items: center;
    margin-left: 6px;
    border-radius: 12px;
    padding: 2px;
  }
  /* Inside .cell-badges the parent's gap does the spacing — the badges' own
     margin-left (meant for inline use, e.g. the detail header) would double
     it and push the priority chevron out of line with the other badges. */
  .cell-badges .nfc-badge,
  .cell-badges .priority-badge {
    margin-left: 0;
  }
  /* Right-anchor the auxiliary badges (disabled / NFC / priority chevron) to
     the END of the shared badges track. Status pills vary in width per
     status AND language (min-width 70px only clamps the short ones — "Due
     Soon"/"Overdue" overflow it), so left-flowing extras landed at a
     different x in every row: the low-priority chevron, which typically sits
     next to the short OK pill, fell visibly out of the column formed by the
     other rows' chevrons. Anchoring the extras group to the track edge gives
     ONE clean column in every language; the virt-sizer row keeps the track
     width stable. In the narrow per-row grids the badges area is
     content-sized (no free space), so the auto margin is inert there. */
  .cell-badges > .status-badge + * {
    margin-left: auto;
  }
  .priority-badge ha-icon {
    --mdc-icon-size: 16px;
  }
  .postponed-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 2px 8px;
    margin-left: 8px;
    background: var(--secondary-background-color, #e8e8e8);
    color: var(--secondary-text-color);
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
  }
  .postponed-badge ha-icon { --mdc-icon-size: 13px; }
  .priority-high {
    color: var(--error-color, #db4437);
  }
  .priority-low {
    color: var(--secondary-text-color, #888);
  }
  .label-chip {
    background: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #fff);
    opacity: 0.85;
  }
  .label-chip ha-icon {
    --mdc-icon-size: 13px;
  }
  .nfc-badge ha-icon {
    --mdc-icon-size: 14px;
  }
  .nfc-badge.unlinked {
    opacity: 0.4;
    cursor: pointer;
    border: 1px dashed var(--divider-color);
    background: transparent;
  }
  .nfc-badge.unlinked:hover {
    opacity: 0.7;
  }

  .task-header-actions {
    display: flex;
    gap: 8px;
  }

  .more-menu-wrapper {
    position: relative;
  }

  /* Stale-bundle handshake banner (roadmap guard 2) */
  .update-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    background: color-mix(in srgb, var(--primary-color) 14%, var(--card-background-color, #fff));
    border-bottom: 1px solid var(--divider-color);
    font-size: 14px;
  }
  .update-banner span {
    flex: 1;
  }

  .popup-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 100;
    min-width: 180px;
    overflow: hidden;
  }

  .popup-menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    cursor: pointer;
    font-size: 14px;
    color: var(--primary-text-color);
  }

  .popup-menu-item:hover {
    background: var(--table-row-alternative-background-color, rgba(0, 0, 0, 0.04));
  }

  .popup-menu-item.danger {
    color: var(--error-color, #f44336);
  }

  .popup-menu-item ha-icon {
    --mdc-icon-size: 18px;
  }

  .popup-menu-divider {
    height: 1px;
    background: var(--divider-color);
    margin: 4px 0;
  }

  .tab-bar {
    display: flex;
    gap: 4px;
    border-bottom: 2px solid var(--divider-color);
    margin-bottom: 16px;
  }

  .tab {
    padding: 12px 24px;
    cursor: pointer;
    font-weight: 500;
    color: var(--secondary-text-color);
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: all 0.2s;
  }

  .tab:hover {
    color: var(--primary-text-color);
  }

  .tab.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
  }

  .tab-content {
    padding: 16px 0;
  }

  .kpi-bar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }

  .kpi-card {
    background: var(--card-background-color, #fff);
    border-radius: 8px;
    padding: 16px 12px;
    text-align: center;
    border: 1px solid var(--divider-color);
  }

  .kpi-card.warning {
    border-color: #ff9800;
    background: rgba(255, 152, 0, 0.1);
  }

  .kpi-card.overdue {
    border-color: #f44336;
    background: rgba(244, 67, 54, 0.1);
  }

  .kpi-label {
    font-size: 11px;
    color: var(--secondary-text-color);
    margin-bottom: 6px;
    text-transform: uppercase;
    font-weight: 500;
  }

  .kpi-value {
    font-size: 16px;
    font-weight: 500;
    color: var(--primary-text-color);
  }

  .kpi-value-large {
    font-size: 22px;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .kpi-subtext {
    font-size: 10px;
    color: var(--secondary-text-color);
    margin-top: 4px;
  }

  .two-column-layout {
    display: grid;
    grid-template-columns: 40% 60%;
    gap: 16px;
    margin-bottom: 24px;
  }

  .two-column-layout.single-column {
    grid-template-columns: 1fr;
  }

  .left-column,
  .right-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .recent-activities {
    background: var(--card-background-color, #fff);
    border-radius: 8px;
    padding: 16px;
    border: 1px solid var(--divider-color);
  }

  .recent-activities h3 {
    margin: 0 0 12px 0;
  }

  .activity-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid var(--divider-color);
  }

  .activity-item:last-of-type {
    border-bottom: none;
  }

  .activity-icon {
    font-size: 18px;
    width: 24px;
    text-align: center;
  }

  .activity-date {
    font-size: 12px;
    color: var(--secondary-text-color);
    min-width: 120px;
  }

  .activity-note {
    flex: 1;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .activity-badge {
    font-size: 12px;
    padding: 2px 8px;
    background: var(--primary-color);
    color: white;
    border-radius: 12px;
  }

  .activity-show-all {
    margin-top: 12px;
    text-align: center;
  }

  .history-filters-new {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .filter-chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .filter-controls {
    display: flex;
    gap: 8px;
  }

  .search-input {
    padding: 8px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font-size: 14px;
    min-width: 200px;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  /* #142: "add a past completion" entry point in the history tab — the
     backdate field lives in the complete dialog, but people LOOK for it
     here. */
  .history-add-past {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 4px;
  }
  .history-add-past-btn ha-icon {
    --mdc-icon-size: 18px;
    margin-right: 4px;
  }

  /* #139: cycle-phase strip in the task overview */
  .phases-card {
    background: var(--card-background-color, #fff);
    border-radius: 8px;
    padding: 12px 16px;
    border: 1px solid var(--divider-color);
    margin-top: 8px;
  }
  .phases-card-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  .phases-card-header ha-icon {
    --mdc-icon-size: 18px;
    color: var(--secondary-text-color);
  }
  .phases-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .phase-step {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid var(--divider-color);
    font-size: 13px;
    cursor: pointer;
  }
  .phase-step.current {
    border-color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 12%, transparent);
    font-weight: 500;
    cursor: default;
  }
  .phase-step-last {
    font-size: 11px;
    color: var(--secondary-text-color);
    font-weight: 400;
  }

  /* Checklist preview card (read-only display in task overview) */
  .checklist-preview-card {
    background: var(--card-background-color, #fff);
    border-radius: 8px;
    padding: 12px 16px;
    border: 1px solid var(--divider-color);
    margin-top: 8px;
  }
  .checklist-preview-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--secondary-text-color);
    margin-bottom: 8px;
  }
  .checklist-preview-header ha-icon {
    --mdc-icon-size: 18px;
  }
  .checklist-preview-list {
    margin: 0;
    padding-left: 20px;
    color: var(--primary-text-color);
    font-size: 14px;
    line-height: 1.6;
  }
  .checklist-preview-list li {
    padding: 1px 0;
  }
  /* #73: interactive in-cycle ticks. */
  .checklist-preview-list label {
    display: inline-flex;
    gap: 8px;
    align-items: baseline;
    cursor: pointer;
  }
  .checklist-preview-list input[type="checkbox"] {
    accent-color: var(--primary-color);
    cursor: pointer;
  }
  .checklist-preview-list li.checked label span {
    text-decoration: line-through;
    opacity: 0.6;
  }

  /* Recommendation Card */
  .recommendation-card {
    background: var(--card-background-color, #fff);
    border-radius: 8px;
    padding: 16px;
    border: 1px solid var(--divider-color);
  }

  .recommendation-card h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
  }

  .interval-comparison {
    margin-bottom: 16px;
  }

  .interval-bar {
    margin-bottom: 12px;
  }

  .interval-label {
    font-size: 12px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .interval-visual {
    height: 24px;
    border-radius: 4px;
    transition: width 0.3s;
  }

  .interval-visual.current {
    background: var(--secondary-text-color);
    opacity: 0.5;
  }

  .interval-visual.suggested {
    background: var(--primary-color);
  }

  .confidence-badge {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 3px;
    background: var(--divider-color);
  }

  .confidence-badge.high {
    background: #4caf50;
    color: white;
  }

  .confidence-badge.medium {
    background: #ff9800;
    color: white;
  }

  .confidence-badge.low {
    background: var(--secondary-text-color);
    color: white;
  }

  .recommendation-actions {
    display: flex;
    gap: 8px;
  }

  /* Seasonal Card Compact */
  .seasonal-card-compact {
    background: var(--card-background-color, #fff);
    border-radius: 8px;
    padding: 16px;
    border: 1px solid var(--divider-color);
  }

  .seasonal-card-compact h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
  }

  .seasonal-mini-chart {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 60px;
    margin-bottom: 12px;
  }

  .seasonal-bar {
    flex: 1;
    border-radius: 2px 2px 0 0;
    transition: all 0.2s;
    cursor: pointer;
  }

  .seasonal-bar.low {
    background: #2196f3;
  }

  .seasonal-bar.normal {
    background: var(--secondary-text-color);
    opacity: 0.5;
  }

  .seasonal-bar.high {
    background: #ff9800;
  }

  .seasonal-bar.current {
    border: 2px solid var(--primary-color);
    box-sizing: border-box;
  }

  .seasonal-legend {
    display: flex;
    gap: 12px;
    font-size: 11px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .legend-item .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .legend-item .dot.low {
    background: #2196f3;
  }

  .legend-item .dot.normal {
    background: var(--secondary-text-color);
    opacity: 0.5;
  }

  .legend-item .dot.high {
    background: #ff9800;
  }

  /* Task meta card (notes + documentation URL) */
  .task-meta-card {
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color);
    border-radius: 12px;
    padding: 12px 16px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .task-meta-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 14px;
    color: var(--primary-text-color);
  }

  .task-meta-row ha-icon {
    --mdc-icon-size: 18px;
    color: var(--secondary-text-color);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .task-meta-notes {
    white-space: pre-wrap;
    word-break: break-word;
  }

  .task-meta-link a {
    color: var(--primary-color);
    text-decoration: none;
  }

  .task-meta-link a:hover {
    text-decoration: underline;
  }

  /* ── Responsive: :host([narrow]) (HA sets narrow on mobile/companion) ── */

  :host([narrow]) .content {
    padding: 0 8px 8px;
  }

  :host([narrow]) .header {
    padding: 8px 12px;
    font-size: 14px;
  }

  :host([narrow]) .kpi-bar {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }

  :host([narrow]) .kpi-card {
    padding: 12px 8px;
  }

  :host([narrow]) .kpi-label {
    font-size: 10px;
  }

  :host([narrow]) .kpi-value {
    font-size: 14px;
  }

  :host([narrow]) .kpi-value-large {
    font-size: 18px;
  }

  :host([narrow]) .two-column-layout {
    grid-template-columns: 1fr;
  }

  :host([narrow]) .tab {
    /* Tight enough that the four tabs fit 412px in the longest languages —
       Ukrainian ("Налаштування") overflowed at 12px 16px (overflow sweep). */
    padding: 12px 8px;
    font-size: 13px;
  }

  :host([narrow]) .task-header {
    flex-direction: column;
    align-items: flex-start;
  }

  :host([narrow]) .task-header-actions {
    width: 100%;
    justify-content: flex-start;
    /* Longer labels (de "Überspringen", fr "Archiver", …) overflow a phone
       viewport in a nowrap row — the ⋮ menu then needs a horizontal scroll
       to reach. Wrap instead; language-independent. */
    flex-wrap: wrap;
  }

  :host([narrow]) .filter-bar {
    flex-wrap: wrap;
  }

  :host([narrow]) .filter-field {
    flex: 1;
    min-width: 48%;
  }

  :host([narrow]) .filter-bar select {
    flex: 1;
    min-width: 0;
    width: 100%;
  }

  :host([narrow]) .task-table { display: block; }

  :host([narrow]) .task-row {
    /* Mobile: 4-column grid keeps due-cell + actions at deterministic
       X-positions across rows regardless of content (sparkline, bar, %).
       Earlier flex-wrap-based layouts let the row wrap unpredictably so
       "X days" sometimes sat near the middle, sometimes at the right edge.
       Grid template:
         [badges auto | task-name 1fr | due-cell 100px | actions auto]
       Task-name spans the full top row (own row above), chips span the
       full bottom row.  */
    display: grid;
    grid-column: auto;
    grid-template-columns: auto minmax(0, 1fr) 100px auto;
    grid-template-rows: auto auto auto;
    column-gap: 8px;
    row-gap: 4px;
    padding: 12px;
  }

  :host([narrow]) .cell.type { display: none; }
  :host([narrow]) .cell.task-name {
    grid-column: 1 / -1;
    grid-row: 1;
    min-width: 0;
  }
  :host([narrow]) .cell-badges {
    grid-column: 1;
    grid-row: 2;
  }
  :host([narrow]) .cell.object-name {
    grid-column: 2;
    grid-row: 2;
    min-width: 0;
    /* Cap long object names at 2 lines with ellipsis instead of growing
       unbounded vertically. The full name is still readable via the panel
       object-detail view (one tap on the object). */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.2;
  }
  :host([narrow]) .due-cell {
    grid-column: 3;
    grid-row: 2;
    align-items: flex-end;
    min-width: 0;
  }
  :host([narrow]) .row-actions {
    grid-column: 4;
    grid-row: 2;
  }
  :host([narrow]) .task-sub {
    grid-column: 1 / -1;
    grid-row: 3;
    font-size: 11px;
    gap: 6px;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  :host([narrow]) .task-sub-empty { display: none; }
  :host([narrow]) .mini-sparkline { width: 50px; }

  :host([narrow]) .detail-header {
    flex-direction: column;
    align-items: flex-start;
  }

  :host([narrow]) .info-grid {
    grid-template-columns: 1fr;
  }

  :host([narrow]) .history-filters-new {
    flex-direction: column;
  }

  :host([narrow]) .search-input {
    min-width: 0;
    width: 100%;
  }

  :host([narrow]) .cost-duration-card {
    padding: 12px;
  }

  :host([narrow]) .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  :host([narrow]) .toggle-buttons {
    width: 100%;
  }

  :host([narrow]) .toggle-btn {
    flex: 1;
    padding: 8px;
    font-size: 12px;
  }

  :host([narrow]) .activity-item {
    flex-wrap: wrap;
  }

  :host([narrow]) .activity-date {
    min-width: auto;
  }

  :host([narrow]) .activity-note {
    flex-basis: 100%;
    white-space: normal;
  }

  :host([narrow]) .popup-menu {
    right: auto;
    left: 0;
    min-width: 160px;
  }

  /* Cost/Duration Card with Toggle */
  .cost-duration-card {
    background: var(--card-background-color, #fff);
    border-radius: 8px;
    padding: 16px;
    border: 1px solid var(--divider-color);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .card-header h3 {
    margin: 0;
    font-size: 16px;
  }

  .toggle-buttons {
    display: flex;
    gap: 4px;
    background: var(--divider-color);
    border-radius: 4px;
    padding: 2px;
  }

  .toggle-btn {
    padding: 6px 12px;
    border: none;
    background: transparent;
    color: var(--primary-text-color);
    cursor: pointer;
    border-radius: 3px;
    font-size: 13px;
    transition: all 0.2s;
  }

  .toggle-btn:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .toggle-btn.active {
    background: var(--primary-color);
    color: white;
  }

  /* ── Responsive: @media fallback (when narrow attr not set) ── */
  @media (max-width: 768px) {
    .content { padding: 0 8px 8px; }
    .header { padding: 8px 12px; font-size: 14px; }
    .kpi-bar { grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 16px; }
    .kpi-card { padding: 12px 8px; }
    .kpi-label { font-size: 10px; }
    .kpi-value { font-size: 14px; }
    .kpi-value-large { font-size: 18px; }
    .two-column-layout { grid-template-columns: 1fr; }
    .tab { padding: 12px 8px; font-size: 13px; }
    .task-header { flex-direction: column; align-items: flex-start; }
    .task-header-actions { width: 100%; justify-content: flex-start; flex-wrap: wrap; }
    .filter-bar { flex-wrap: wrap; }
    .filter-bar select { flex: 1; min-width: 0; }
    /* Mirror the :host([narrow]) grid layout for narrow desktop windows */
    .task-row {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) 100px auto;
      grid-template-rows: auto auto auto;
      column-gap: 8px;
      row-gap: 4px;
      padding: 12px;
    }
    .cell.type { display: none; }
    .cell.task-name { grid-column: 1 / -1; grid-row: 1; min-width: 0; }
    .cell-badges { grid-column: 1; grid-row: 2; }
    .cell.object-name { grid-column: 2; grid-row: 2; min-width: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.2; }
    .due-cell { grid-column: 3; grid-row: 2; align-items: flex-end; min-width: 0; }
    .row-actions { grid-column: 4; grid-row: 2; }
    .task-sub { grid-column: 1 / -1; grid-row: 3; font-size: 11px; gap: 6px; justify-content: flex-start; flex-wrap: wrap; }
    .task-sub-empty { display: none; }
    .mini-sparkline { width: 50px; }
    .detail-header { flex-direction: column; align-items: flex-start; }
    .info-grid { grid-template-columns: 1fr; }
    .history-filters-new { flex-direction: column; }
    .search-input { min-width: 0; width: 100%; }
    .cost-duration-card { padding: 12px; }
    .card-header { flex-direction: column; align-items: flex-start; gap: 8px; }
    .toggle-buttons { width: 100%; }
    .toggle-btn { flex: 1; padding: 8px; font-size: 12px; }
    .activity-item { flex-wrap: wrap; }
    .activity-date { min-width: auto; }
    .activity-note { flex-basis: 100%; white-space: normal; }
    .popup-menu { right: auto; left: 0; min-width: 160px; }
  }

  /* ha-button handles variant="danger" natively */

  .toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--error-color, #f44336);
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0,0,0,.3);
    animation: toast-in .3s ease;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .toast-undo {
    font: inherit; font-weight: 600; color: #fff; cursor: pointer;
    background: transparent; border: 1px solid rgba(255,255,255,.6);
    border-radius: 6px; padding: 4px 12px; text-transform: uppercase; font-size: 12.5px;
  }
  .toast-undo:hover { background: rgba(255,255,255,.15); }
  @keyframes toast-in {
    from { opacity: 0; transform: translateX(-50%) translateY(16px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;var qt=class{constructor(n){this._cache=new Map;this._pending=new Map;this.historyFallbackIds=new Set;this._hass=n}updateHass(n){this._hass=n}async getDetailStats(n,t,e=30){return this._getStats(n,e<=35?"hour":"day",e,t)}async getMiniStats(n,t){return this._getStats(n,"day",14,t)}async getBatchMiniStats(n){let t=new Map,e=[];for(let c of n){let h=`${c.entityId}:day:14`,g=this._cache.get(h);g&&Date.now()-g.fetchedAt<3e5?t.set(c.entityId,g.points):e.push(c)}if(e.length===0)return t;let i=e.filter(c=>c.isCounter).map(c=>c.entityId),a=e.filter(c=>!c.isCounter).map(c=>c.entityId),l=new Date(Date.now()-336*60*60*1e3).toISOString(),p=[];return i.length>0&&p.push(this._fetchBatch(i,"day",l,["state","sum","change"],!0,t)),a.length>0&&p.push(this._fetchBatch(a,"day",l,["mean","min","max"],!1,t)),await Promise.all(p),t}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(n,t,e,i){let a=`${n}:${t}:${e}`,l=this._cache.get(a);if(l&&Date.now()-l.fetchedAt<3e5)return l.points;if(this._pending.has(a))return this._pending.get(a);let p=this._fetchAndNormalize(n,t,e,i,a);this._pending.set(a,p);try{return await p}finally{this._pending.delete(a)}}async _fetchAndNormalize(n,t,e,i,a){let l=new Date(Date.now()-e*24*60*60*1e3).toISOString(),p=i?["state","sum","change"]:["mean","min","max"];try{let h=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:l,statistic_ids:[n],period:t,types:p}))[n]||[],g=this._normalizeRows(h,i);if(g.length<2){let v=await this._fetchHistoryFallback(n,l);v.length>=2?(g=v,this.historyFallbackIds.add(n)):this.historyFallbackIds.delete(n)}else this.historyFallbackIds.delete(n);return this._cache.set(a,{entityId:n,fetchedAt:Date.now(),period:t,points:g}),g}catch(c){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${n}:`,c),[]}}async _fetchHistoryFallback(n,t){try{let i=(await this._hass.connection.sendMessagePromise({type:"history/history_during_period",start_time:t,end_time:new Date().toISOString(),entity_ids:[n],minimal_response:!0,no_attributes:!0}))?.[n]||[];if(i.length>1e3){let p=Math.ceil(i.length/500);i=i.filter((c,h)=>h%p===0||h===i.length-1)}let a=[],l=null;for(let p of i){let c=p.s??p.state;if(c==null||c==="unknown"||c==="unavailable")continue;let h;if(c==="on"||c==="open"||c==="true")h=1;else if(c==="off"||c==="closed"||c==="false")h=0;else if(h=parseFloat(c),!Number.isFinite(h))continue;let g=p.lu??p.last_updated??p.last_changed,v=typeof g=="number"?g*1e3:g!=null?Date.parse(g):NaN;Number.isFinite(v)&&(l!=null&&l!==h&&a.push({ts:v,val:l}),a.push({ts:v,val:h}),l=h)}return a.sort((p,c)=>p.ts-c.ts),a.length&&l!=null&&a.push({ts:Date.now(),val:l}),a}catch(e){return console.warn(`[maintenance-supporter] History fallback failed for ${n}:`,e),[]}}async _fetchBatch(n,t,e,i,a,l){try{let p=await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:e,statistic_ids:n,period:t,types:i});for(let c of n){let h=p[c]||[],g=this._normalizeRows(h,a);l.set(c,g),this._cache.set(`${c}:${t}:14`,{entityId:c,fetchedAt:Date.now(),period:t,points:g})}}catch(p){console.warn("[maintenance-supporter] Batch statistics fetch failed:",p)}}_normalizeRows(n,t){let e=[];for(let i of n){let a=null;if(t?a=i.state??null:a=i.mean??null,a===null)continue;let l={ts:i.start,val:a};t||(i.min!=null&&(l.min=i.min),i.max!=null&&(l.max=i.max)),e.push(l)}return e.sort((i,a)=>i.ts-a.ts),e}};function pt(r){let n=r??0;return n<1024?`${n} B`:n<1024*1024?`${(n/1024).toFixed(1)} KB`:`${(n/(1024*1024)).toFixed(1)} MB`}var $t=["manual","warranty","invoice","spare_parts","photo","other"],Wt={manual:"mdi:book-open-variant",warranty:"mdi:shield-check",invoice:"mdi:receipt-text-outline",spare_parts:"mdi:cog-outline",photo:"mdi:image-outline",other:"mdi:file-document-outline"};function bt(r){return r.title||r.filename||r.url||""}var F=class extends R{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._hint="";this._addingLink=!1;this._linkUrl="";this._linkTitle="";this._category="manual";this._thumbs={};this._lightboxUrl="";this._editingId="";this._editTitle="";this._editCategory="manual";this._dragOver=!1;this._loadedFor=null;this._localeReady=!1}_isImage(t){return t.kind==="file"&&(t.mime||"").startsWith("image/")}async _sign(t){return Ht(this.hass,t.id)}get _lang(){return P(this.hass)}updated(t){super.updated(t),this.hass&&!this._localeReady&&(this._localeReady=!0,Y(this._lang).then(()=>this.requestUpdate())),this.hass&&this.entryId&&this._loadedFor!==this.entryId&&(this._loadedFor=this.entryId,this._load())}async _load(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId});this._docs=t.documents||[],this._loaded=!0,this._error="",this._thumbs={},this._loadThumbs()}catch(t){this._error=S(t,this._lang),this._loaded=!0}}async _loadThumbs(){await Promise.all(this._docs.filter(t=>this._isImage(t)).map(async t=>{try{let e=await this._sign(t);this._thumbs={...this._thumbs,[t.id]:e}}catch{}}))}_category_of(t){return(t.tags||[]).find(i=>$t.includes(i))||"other"}_labelKeydown(t){(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),t.currentTarget.querySelector("input")?.click())}_onFileInput(t){let e=t.target,i=Array.from(e.files??[]);i.length&&this._uploadFiles(i),e.value=""}_onCameraInput(t){let e=t.target,i=Array.from(e.files??[]);i.length&&this._uploadFiles(i,"photo"),e.value=""}_onDrop(t){if(t.preventDefault(),this._dragOver=!1,!this.canWrite||this._busy)return;let e=Array.from(t.dataTransfer?.files??[]);e.length&&this._uploadFiles(e)}_onDragOver(t){this.canWrite&&(t.preventDefault(),this._dragOver=!0)}_onDragLeave(t){let e=t.relatedTarget;(!e||!t.currentTarget.contains(e))&&(this._dragOver=!1)}async _uploadFiles(t,e){let i=e??this._category;this._busy=!0,this._error="",this._hint="";let a=0,l=0;try{for(let p of t){let c=new FormData;c.append("entry_id",this.entryId),c.append("tags",i),c.append("file",p,p.name);let h=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${this.hass.auth?.data?.access_token??""}`},body:c});if(!h.ok){this._error=h.status===413?s("doc_too_large",this._lang):s("doc_upload_failed",this._lang);continue}let g=await h.json();g.duplicate_in_object?l++:g.deduped&&a++}l?this._hint=s("doc_dup_in_object",this._lang):a&&(this._hint=s("doc_deduped",this._lang)),await this._load()}catch{this._error=s("doc_upload_failed",this._lang)}finally{this._busy=!1}}async _download(t){try{await Nt(this.hass,t.id,t.filename||t.title||"document")}catch(e){this._error=S(e,this._lang)}}async _preview(t){if(this._isImage(t)){this._lightboxUrl=this._thumbs[t.id]||await this._sign(t);return}try{await vt(this.hass,t.id)}catch(e){this._error=S(e,this._lang)}}_openDoc(t){t.kind==="file"?this._preview(t):W(t.url)&&window.open(t.url,"_blank","noopener")}_startEdit(t){this._editingId=t.id,this._editTitle=t.title||"",this._editCategory=this._category_of(t),this._addingLink=!1,this._error=""}_cancelEdit(){this._editingId=""}async _saveEdit(t){let e=(t.tags||[]).filter(a=>!$t.includes(a)),i=t.kind==="file"?[this._editCategory,...e]:t.tags??[];this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:t.id,title:this._editTitle.trim()||t.filename||t.url||"",tags:i}),this._editingId="",await this._load()}catch(a){this._error=S(a,this._lang)}finally{this._busy=!1}}async _delete(t){let e=bt(t);if(window.confirm(s("doc_delete_confirm",this._lang).replace("{name}",e))){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/delete",doc_id:t.id}),await this._load()}catch(i){this._error=S(i,this._lang)}finally{this._busy=!1}}}async _addLink(){let t=this._linkUrl.trim();if(t){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/add_link",entry_id:this.entryId,url:t,title:this._linkTitle.trim()||null}),this._linkUrl="",this._linkTitle="",this._addingLink=!1,await this._load()}catch(e){this._error=S(e,this._lang,s("doc_link_invalid",this._lang))}finally{this._busy=!1}}}render(){let t=this._lang;return o`
      <div
        class="doc-zone ${this._dragOver?"drag-over":""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}
      >
        ${this._dragOver&&this.canWrite?o`<div class="drop-overlay">
              <ha-icon icon="mdi:tray-arrow-down"></ha-icon> ${s("doc_drop_hint",t)}
            </div>`:d}
      <div class="doc-header">
        <h3>${s("documents",t)} (${this._docs.length})</h3>
        ${this.canWrite?o`
              <div class="doc-actions">
                <select
                  class="cat-select"
                  .value=${this._category}
                  ?disabled=${this._busy}
                  @change=${e=>this._category=e.target.value}
                >
                  ${$t.map(e=>o`<option value=${e}>${s(`doc_cat_${e}`,t)}</option>`)}
                </select>
                <label
                  class="btn primary ${this._busy?"disabled":""}"
                  role="button"
                  tabindex="0"
                  @keydown=${this._labelKeydown}
                >
                  <ha-icon icon="mdi:upload"></ha-icon>
                  ${this._busy?s("doc_uploading",t):s("doc_upload",t)}
                  <input type="file" multiple hidden ?disabled=${this._busy} @change=${this._onFileInput} />
                </label>
                <label
                  class="btn camera-btn ${this._busy?"disabled":""}"
                  role="button"
                  tabindex="0"
                  aria-label=${s("doc_camera",t)}
                  title=${s("doc_camera",t)}
                  @keydown=${this._labelKeydown}
                >
                  <ha-icon icon="mdi:camera"></ha-icon>
                  <input type="file" accept="image/*" capture="environment" hidden ?disabled=${this._busy} @change=${this._onCameraInput} />
                </label>
                <button class="btn" ?disabled=${this._busy} @click=${()=>this._addingLink=!this._addingLink}>
                  <ha-icon icon="mdi:link-variant"></ha-icon> ${s("doc_add_link",t)}
                </button>
              </div>
            `:d}
      </div>

      ${this._error?o`<div class="doc-msg error">${this._error}</div>`:d}
      ${this._hint?o`<div class="doc-msg hint">${this._hint}</div>`:d}

      ${this._addingLink&&this.canWrite?o`
            <div class="link-form">
              <input
                type="url"
                placeholder=${s("doc_link_url",t)}
                .value=${this._linkUrl}
                ?disabled=${this._busy}
                @input=${e=>this._linkUrl=e.target.value}
              />
              <input
                type="text"
                placeholder=${s("doc_link_title",t)}
                .value=${this._linkTitle}
                ?disabled=${this._busy}
                @input=${e=>this._linkTitle=e.target.value}
              />
              <button class="btn primary" ?disabled=${this._busy||!this._linkUrl.trim()} @click=${this._addLink}>
                ${s("add",t)}
              </button>
              <button class="btn" ?disabled=${this._busy} @click=${()=>this._addingLink=!1}>
                ${s("cancel",t)}
              </button>
            </div>
          `:d}

      ${this._loaded?this._docs.length===0?o`<div class="doc-empty">${s("documents_empty",t)}</div>`:o`
              <div class="doc-list">
                ${this._docs.map(e=>this._renderDoc(e,t))}
              </div>
            `:o`<div class="doc-empty">${s("loading",t)}</div>`}

      ${this._lightboxUrl?o`<div class="lightbox" @click=${()=>this._lightboxUrl=""}>
            <img class="lightbox-img" src=${this._lightboxUrl} @click=${e=>e.stopPropagation()} />
            <button class="lightbox-close" title=${s("doc_close",t)} @click=${()=>this._lightboxUrl=""}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>`:d}
      </div>
    `}_renderDoc(t,e){if(this._editingId===t.id)return this._renderEdit(t,e);let i=t.kind==="file",a=this._category_of(t),l=i?`${s(`doc_cat_${a}`,e)} \xB7 ${pt(t.size)}`:s("doc_link_badge",e),p=this._thumbs[t.id];return o`
      <div class="doc-row">
        ${i&&p?o`<img
              class="doc-thumb"
              src=${p}
              alt=${t.title||""}
              title=${s("doc_open",e)}
              @click=${()=>this._preview(t)}
            />`:o`<ha-icon
              class="doc-icon ${i?"clickable":""}"
              icon=${i?Wt[a]:"mdi:link-variant"}
              @click=${()=>i&&this._preview(t)}
            ></ha-icon>`}
        <div
          class="doc-info"
          role="button"
          tabindex="0"
          title=${s("doc_open",e)}
          @click=${()=>this._openDoc(t)}
          @keydown=${c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),this._openDoc(t))}}
        >
          <div class="doc-title">${bt(t)}</div>
          <div class="doc-meta">${l}</div>
        </div>
        <div class="doc-row-actions">
          ${i?o`
                <button class="icon-btn" title=${s("doc_open",e)} @click=${()=>this._preview(t)}>
                  <ha-icon icon="mdi:eye-outline"></ha-icon>
                </button>
                <button class="icon-btn" title=${s("doc_download",e)} @click=${()=>this._download(t)}>
                  <ha-icon icon="mdi:download"></ha-icon>
                </button>`:o`<a
                class="icon-btn"
                href=${W(t.url)?t.url:"#"}
                target="_blank"
                rel="noopener noreferrer"
                title=${s("doc_open",e)}
              ><ha-icon icon="mdi:open-in-new"></ha-icon></a>`}
          ${this.canWrite?o`
                <button class="icon-btn" title=${s("edit",e)} ?disabled=${this._busy} @click=${()=>this._startEdit(t)}>
                  <ha-icon icon="mdi:pencil"></ha-icon>
                </button>
                <button class="icon-btn danger" title=${s("delete",e)} ?disabled=${this._busy} @click=${()=>this._delete(t)}>
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>`:d}
        </div>
      </div>
    `}_renderEdit(t,e){let i=t.kind==="file";return o`
      <div class="doc-row editing">
        <input
          class="edit-title"
          type="text"
          placeholder=${s("doc_link_title",e)}
          .value=${this._editTitle}
          ?disabled=${this._busy}
          @input=${a=>this._editTitle=a.target.value}
        />
        ${i?o`<select
              class="cat-select"
              ?disabled=${this._busy}
              @change=${a=>this._editCategory=a.target.value}
            >
              ${$t.map(a=>o`<option value=${a} ?selected=${a===this._editCategory}>${s(`doc_cat_${a}`,e)}</option>`)}
            </select>`:d}
        <button class="icon-btn" title=${s("save",e)} ?disabled=${this._busy||!this._editTitle.trim()} @click=${()=>this._saveEdit(t)}>
          <ha-icon icon="mdi:check"></ha-icon>
        </button>
        <button class="icon-btn" title=${s("cancel",e)} ?disabled=${this._busy} @click=${this._cancelEdit}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
    `}};F.styles=D`
    :host { display: block; margin: 8px 0 4px; }
    .doc-zone { position: relative; }
    .doc-zone.drag-over {
      outline: 2px dashed var(--primary-color); outline-offset: 4px; border-radius: 8px;
    }
    .drop-overlay {
      position: absolute; inset: 0; z-index: 5; pointer-events: none;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      border-radius: 8px; font-size: 15px; font-weight: 600;
      color: var(--primary-color); opacity: 0.95;
      background: var(--card-background-color, rgba(255, 255, 255, 0.85));
    }
    .drop-overlay ha-icon { --mdc-icon-size: 24px; }
    .camera-btn { padding: 6px 10px; }
    .doc-header {
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px; flex-wrap: wrap;
    }
    h3 { margin: 8px 0; font-size: 16px; }
    .doc-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .cat-select {
      padding: 6px 8px; border-radius: 6px; font: inherit;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .btn {
      display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
      padding: 6px 12px; border-radius: 6px; font: inherit; font-size: 13px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .btn.primary { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: var(--primary-color); }
    .btn:focus-visible, .icon-btn:focus-visible {
      outline: 2px solid var(--primary-color); outline-offset: 2px;
    }
    .btn.disabled, .btn[disabled] { opacity: 0.5; pointer-events: none; }
    .btn ha-icon { --mdc-icon-size: 18px; }
    .link-form { display: flex; gap: 8px; flex-wrap: wrap; margin: 8px 0; }
    .link-form input {
      flex: 1 1 180px; padding: 6px 10px; border-radius: 6px; font: inherit;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .doc-msg { font-size: 13px; margin: 6px 0; }
    .doc-msg.error { color: var(--error-color, #f44336); }
    .doc-msg.hint { color: var(--secondary-text-color, #888); }
    .doc-empty { color: var(--secondary-text-color, #888); font-size: 13px; padding: 8px 0; }
    .doc-list { display: flex; flex-direction: column; gap: 4px; }
    .doc-row {
      display: flex; align-items: center; gap: 12px; padding: 8px 10px;
      border: 1px solid var(--divider-color); border-radius: 8px;
      background: var(--card-background-color, transparent);
    }
    .doc-row.editing { gap: 8px; }
    .edit-title {
      flex: 1; min-width: 0; padding: 6px 10px; border-radius: 6px; font: inherit;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .doc-icon { color: var(--primary-color); --mdc-icon-size: 24px; flex: none; }
    .doc-icon.clickable { cursor: pointer; }
    .doc-thumb {
      width: 40px; height: 40px; object-fit: cover; border-radius: 6px; flex: none;
      cursor: pointer; border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
    }
    .lightbox {
      position: fixed; inset: 0; z-index: 9999; cursor: zoom-out;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0, 0, 0, 0.85);
    }
    .lightbox-img {
      max-width: 92vw; max-height: 92vh; object-fit: contain; cursor: default;
      border-radius: 8px; box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
    }
    .lightbox-close {
      position: fixed; top: 16px; right: 16px; cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center;
      width: 44px; height: 44px; border-radius: 50%; border: none;
      background: rgba(0, 0, 0, 0.5); color: #fff;
    }
    .lightbox-close ha-icon { --mdc-icon-size: 26px; }
    .doc-info { flex: 1; min-width: 0; cursor: pointer; border-radius: 6px; }
    .doc-info:hover .doc-title { text-decoration: underline; }
    .doc-info:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .doc-title { font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .doc-meta { font-size: 12px; color: var(--secondary-text-color, #888); }
    .doc-row-actions { display: flex; gap: 4px; flex: none; }
    .icon-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 34px; height: 34px; border-radius: 8px; cursor: pointer;
      background: transparent; border: none; color: var(--primary-text-color);
      text-decoration: none;
    }
    .icon-btn:hover { background: var(--secondary-background-color, rgba(0,0,0,0.06)); }
    .icon-btn.danger { color: var(--error-color, #f44336); }
    .icon-btn[disabled] { opacity: 0.4; pointer-events: none; }
    .icon-btn ha-icon { --mdc-icon-size: 20px; }
  `,u([$({attribute:!1})],F.prototype,"hass",2),u([$({attribute:!1})],F.prototype,"entryId",2),u([$({type:Boolean})],F.prototype,"canWrite",2),u([m()],F.prototype,"_docs",2),u([m()],F.prototype,"_loaded",2),u([m()],F.prototype,"_busy",2),u([m()],F.prototype,"_error",2),u([m()],F.prototype,"_hint",2),u([m()],F.prototype,"_addingLink",2),u([m()],F.prototype,"_linkUrl",2),u([m()],F.prototype,"_linkTitle",2),u([m()],F.prototype,"_category",2),u([m()],F.prototype,"_thumbs",2),u([m()],F.prototype,"_lightboxUrl",2),u([m()],F.prototype,"_editingId",2),u([m()],F.prototype,"_editTitle",2),u([m()],F.prototype,"_editCategory",2),u([m()],F.prototype,"_dragOver",2);customElements.get("maintenance-documents-section")||customElements.define("maintenance-documents-section",F);var X=class extends R{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._attachId="";this._loadedKey="";this._localeReady=!1}get _lang(){return P(this.hass)}get _refId(){return this.partId||this.taskId||""}get _linkField(){return this.partId?"part_ids":"task_ids"}updated(t){super.updated(t),this.hass&&!this._localeReady&&(this._localeReady=!0,Y(this._lang).then(()=>this.requestUpdate()));let e=`${this.entryId}|${this._refId}`;this.hass&&this.entryId&&this._refId&&this._loadedKey!==e&&(this._loadedKey=e,this._load())}async _load(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId});this._docs=t.documents||[],this._loaded=!0,this._error=""}catch(t){this._error=S(t,this._lang),this._loaded=!0}}_links(t){return t[this._linkField]||[]}_linked(){return this._docs.filter(t=>this._links(t).includes(this._refId))}_available(){return this._docs.filter(t=>!this._links(t).includes(this._refId))}async _setLinks(t,e){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:t.id,[this._linkField]:e}),await this._load()}catch(i){this._error=S(i,this._lang)}finally{this._busy=!1}}_link(){let t=this._docs.find(e=>e.id===this._attachId);t&&(this._attachId="",this._setLinks(t,[...this._links(t),this._refId]))}_unlink(t){this._setLinks(t,this._links(t).filter(e=>e!==this._refId))}_isPdf(t){return t.mime==="application/pdf"||(t.filename||"").toLowerCase().endsWith(".pdf")}_pageFor(t){return this._isPdf(t)&&this.taskId?t.task_pages?.[this.taskId]:void 0}async _open(t){if(t.kind==="weblink"){W(t.url)&&window.open(t.url,"_blank","noopener");return}let e=this._pageFor(t);try{await vt(this.hass,t.id,e?`#page=${e}`:"")}catch(i){this._error=S(i,this._lang)}}async _setPage(t,e){if(this.taskId){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:t.id,task_pages:{[this.taskId]:e}}),await this._load()}catch(i){this._error=S(i,this._lang)}finally{this._busy=!1}}}async _download(t){try{await Nt(this.hass,t.id,t.filename||t.title||"document")}catch(e){this._error=S(e,this._lang)}}render(){if(!this._loaded||this._docs.length===0)return d;let t=this._lang,e=this._linked(),i=this._available();return o`
      <div class="task-docs">
        <h3><ha-icon icon="mdi:paperclip"></ha-icon> ${s("documents",t)} (${e.length})</h3>
        ${this._error?o`<div class="tdoc-error">${this._error}</div>`:d}
        ${e.length===0?o`<div class="tdoc-empty">${s(this.partId?"doc_part_none":"doc_task_none",t)}</div>`:o`<div class="tdoc-list">${e.map(a=>this._renderRow(a,t))}</div>`}
        ${this.canWrite&&i.length?o`<div class="tdoc-attach">
              <select
                class="tdoc-select"
                ?disabled=${this._busy}
                @change=${a=>this._attachId=a.target.value}
              >
                <option value="" ?selected=${!this._attachId}>${s("doc_link_existing",t)}</option>
                ${i.map(a=>o`<option value=${a.id} ?selected=${a.id===this._attachId}>${bt(a)}</option>`)}
              </select>
              <button class="tdoc-btn" ?disabled=${this._busy||!this._attachId} @click=${this._link}>
                <ha-icon icon="mdi:link-variant-plus"></ha-icon> ${s("doc_attach",t)}
              </button>
            </div>`:d}
      </div>
    `}_renderRow(t,e){let i=t.kind==="file",a=this._isPdf(t),l=this._pageFor(t),p=(t.tags||[]).find(h=>$t.includes(h))||"other",c=i?pt(t.size):s("doc_link_badge",e);return o`
      <div class="tdoc-row">
        <ha-icon class="tdoc-icon" icon=${i?Wt[p]:"mdi:link-variant"}></ha-icon>
        <div
          class="tdoc-info"
          role="button"
          tabindex="0"
          title=${l?`${s("doc_open",e)} \xB7 ${s("doc_page",e)} ${l}`:s("doc_open",e)}
          @click=${()=>this._open(t)}
          @keydown=${h=>{(h.key==="Enter"||h.key===" ")&&(h.preventDefault(),this._open(t))}}
        >
          <div class="tdoc-title">${bt(t)}</div>
          <div class="tdoc-meta">
            ${c}${l?o` · <span class="tdoc-pagetag">${s("doc_page",e)} ${l}</span>`:d}
          </div>
        </div>
        ${this.canWrite&&a&&this.taskId?o`<input
              class="tdoc-page"
              type="number"
              min="1"
              inputmode="numeric"
              aria-label=${s("doc_page",e)}
              title=${s("doc_page",e)}
              placeholder=${s("doc_page",e)}
              .value=${l?String(l):""}
              ?disabled=${this._busy}
              @change=${h=>{let g=parseInt(h.target.value,10);this._setPage(t,Number.isFinite(g)&&g>=1?g:0)}}
            />`:d}
        <button class="icon-btn" title=${s("doc_open",e)} @click=${()=>this._open(t)}>
          <ha-icon icon=${i?"mdi:eye-outline":"mdi:open-in-new"}></ha-icon>
        </button>
        ${i?o`<button class="icon-btn" title=${s("doc_download",e)} @click=${()=>this._download(t)}>
              <ha-icon icon="mdi:download"></ha-icon>
            </button>`:d}
        ${this.canWrite?o`<button class="icon-btn" title=${s("doc_unlink",e)} ?disabled=${this._busy} @click=${()=>this._unlink(t)}>
              <ha-icon icon="mdi:link-variant-off"></ha-icon>
            </button>`:d}
      </div>
    `}};X.styles=D`
    :host { display: block; }
    .task-docs { margin-top: 20px; }
    h3 {
      display: flex; align-items: center; gap: 6px; margin: 0 0 8px;
      font-size: 15px; color: var(--primary-text-color);
    }
    h3 ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color, #888); }
    .tdoc-empty { color: var(--secondary-text-color, #888); font-size: 13px; padding: 2px 0 8px; }
    .tdoc-error { color: var(--error-color, #f44336); font-size: 13px; margin: 4px 0; }
    .tdoc-list { display: flex; flex-direction: column; gap: 4px; }
    .tdoc-row {
      display: flex; align-items: center; gap: 10px; padding: 6px 10px;
      border: 1px solid var(--divider-color); border-radius: 8px;
    }
    .tdoc-icon { color: var(--primary-color); --mdc-icon-size: 22px; flex: none; }
    .tdoc-info { flex: 1; min-width: 0; cursor: pointer; border-radius: 6px; }
    .tdoc-info:hover .tdoc-title { text-decoration: underline; }
    .tdoc-info:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .tdoc-title { font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tdoc-meta { font-size: 12px; color: var(--secondary-text-color, #888); }
    .tdoc-pagetag { color: var(--primary-color); font-weight: 500; }
    .tdoc-page {
      flex: none; width: 76px; padding: 5px 8px; border-radius: 6px; font: inherit; font-size: 13px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .tdoc-page:disabled { opacity: 0.5; }
    .icon-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 34px; height: 34px; border-radius: 8px; cursor: pointer;
      background: transparent; border: none; color: var(--primary-text-color);
    }
    .icon-btn:hover { background: var(--secondary-background-color, rgba(0, 0, 0, 0.06)); }
    .icon-btn[disabled] { opacity: 0.4; pointer-events: none; }
    .icon-btn ha-icon { --mdc-icon-size: 20px; }
    .tdoc-attach { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
    .tdoc-select {
      flex: 1; min-width: 160px; padding: 6px 10px; border-radius: 6px; font: inherit;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .tdoc-btn {
      display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
      padding: 6px 12px; border-radius: 6px; font: inherit; font-size: 13px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .tdoc-btn ha-icon { --mdc-icon-size: 18px; }
    .tdoc-btn[disabled] { opacity: 0.5; pointer-events: none; }
  `,u([$({attribute:!1})],X.prototype,"hass",2),u([$({attribute:!1})],X.prototype,"entryId",2),u([$({attribute:!1})],X.prototype,"taskId",2),u([$({attribute:!1})],X.prototype,"partId",2),u([$({type:Boolean})],X.prototype,"canWrite",2),u([m()],X.prototype,"_docs",2),u([m()],X.prototype,"_loaded",2),u([m()],X.prototype,"_busy",2),u([m()],X.prototype,"_error",2),u([m()],X.prototype,"_attachId",2);customElements.get("maintenance-task-documents")||customElements.define("maintenance-task-documents",X);var ci={name:"",vendor:"",mpn:"",gtin:"",storage_location:"",product_url:"",unit:"",cost:"",stock:"",reorder_threshold:"",restock_quantity:"",auto_buy_task:!0,notes:""},K=class extends R{constructor(){super(...arguments);this.parts=[];this.canWrite=!1;this.currencySymbol="\u20AC";this._editing=null;this._busy=!1;this._error="";this._restockFor=null;this._restockQty="";this._restockInvalid=!1;this._docsFor=null}get _lang(){return P(this.hass)}connectedCallback(){super.connectedCallback(),Y(this._lang).then(()=>this.requestUpdate())}_notifyChanged(){this.dispatchEvent(new CustomEvent("parts-changed",{bubbles:!0,composed:!0}))}async _send(t){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(t)}catch(e){return this._error=S(e,this._lang),null}finally{this._busy=!1}}_openAdd(){this._editing={...ci}}_openEdit(t){this._editing={id:t.id,name:t.name,vendor:t.vendor||"",mpn:t.mpn||"",gtin:t.gtin||"",storage_location:t.storage_location||"",product_url:t.product_url||"",unit:t.unit||"",cost:t.cost!=null?String(t.cost):"",stock:t.stock!=null?String(t.stock):"",reorder_threshold:t.reorder_threshold!=null?String(t.reorder_threshold):"",restock_quantity:t.restock_quantity!=null?String(t.restock_quantity):"",auto_buy_task:!!t.auto_buy_task,notes:t.notes||""}}_formValue(t){let e=i=>i.trim()===""?null:Number(i);return{entry_id:this.entryId,name:t.name.trim(),vendor:t.vendor.trim()||null,mpn:t.mpn.trim()||null,gtin:t.gtin.trim()||null,storage_location:t.storage_location.trim()||null,product_url:t.product_url.trim()||null,unit:t.unit.trim()||null,cost:e(t.cost),stock:e(t.stock),reorder_threshold:e(t.reorder_threshold),restock_quantity:e(t.restock_quantity),auto_buy_task:t.auto_buy_task,notes:t.notes.trim()||null}}async _save(){let t=this._editing;if(!t||!t.name.trim())return;let e=this._formValue(t),i=t.id?"maintenance_supporter/part/update":"maintenance_supporter/part/create";await this._send(t.id?{type:i,part_id:t.id,...e}:{type:i,...e})!==null&&(this._editing=null,this._notifyChanged())}async _delete(t){if(!window.confirm(s("part_delete_confirm",this._lang).replace("{name}",t.name)))return;await this._send({type:"maintenance_supporter/part/delete",entry_id:this.entryId,part_id:t.id})!==null&&this._notifyChanged()}async _restock(t){let e=parseFloat(this._restockQty);if(!Number.isFinite(e)||e===0){this._restockInvalid=!0;return}this._restockInvalid=!1;let i=await this._send({type:"maintenance_supporter/part/restock",entry_id:this.entryId,part_id:t.id,delta:e});this._restockFor=null,i!==null&&(t.stock=i.stock,this.requestUpdate(),this._notifyChanged())}_identLine(t){return[t.vendor,t.mpn?`MPN: ${t.mpn}`:"",t.gtin?`GTIN: ${t.gtin}`:""].filter(Boolean).join(" \xB7 ")}_renderRow(t){let e=this._lang,i=t.stock!==null&&t.stock!==void 0,a=this._identLine(t),l=this._docsFor===t.id;return o`
      <div class="part-row ${t.is_low?"low":""}">
        <ha-icon class="part-icon" icon=${t.is_low?"mdi:cart-arrow-down":"mdi:package-variant-closed"}></ha-icon>
        <div class="part-main">
          <div class="part-name">
            ${W(t.shopping_url)?o`<a href=${t.shopping_url} target="_blank" rel="noopener noreferrer">${t.name}</a>`:t.name}
            ${i?o`<span class="stock-badge ${t.is_low?"low":""}"
                  >${t.stock}${t.unit?` ${t.unit}`:""}${t.reorder_threshold!=null?o`<span class="threshold">/${t.reorder_threshold}</span>`:d}</span
                >`:d}
          </div>
          <div class="part-meta">
            ${a?o`<span>${a}</span>`:d}
            ${t.storage_location?o`<span class="loc"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${t.storage_location}</span>`:d}
          </div>
        </div>
        <ha-icon-button
          title=${s("documents",e)}
          class=${l?"docs-open":""}
          @click=${()=>this._docsFor=l?null:t.id}
          ><ha-icon icon="mdi:paperclip"></ha-icon
        ></ha-icon-button>
        ${this.canWrite?o`
              ${this._restockFor===t.id?o`
                    <input
                      class="restock-input${this._restockInvalid?" invalid":""}"
                      type="number"
                      .value=${this._restockQty}
                      placeholder="+1"
                      @input=${p=>this._restockQty=p.target.value}
                      @keydown=${p=>{p.key==="Enter"&&this._restock(t),p.key==="Escape"&&(this._restockFor=null)}}
                    />
                    <ha-icon-button title=${s("save",e)} @click=${()=>this._restock(t)}
                      ><ha-icon icon="mdi:check"></ha-icon
                    ></ha-icon-button>
                  `:o`
                    <ha-icon-button
                      title=${s("part_restock",e)}
                      .disabled=${this._busy}
                      @click=${()=>{this._restockFor=t.id,this._restockInvalid=!1,this._restockQty=String(t.restock_quantity||1)}}
                      ><ha-icon icon="mdi:plus-minus-variant"></ha-icon
                    ></ha-icon-button>
                  `}
              <ha-icon-button title=${s("edit",e)} .disabled=${this._busy} @click=${()=>this._openEdit(t)}
                ><ha-icon icon="mdi:pencil"></ha-icon
              ></ha-icon-button>
              <ha-icon-button title=${s("delete",e)} .disabled=${this._busy} @click=${()=>this._delete(t)}
                ><ha-icon icon="mdi:delete-outline"></ha-icon
              ></ha-icon-button>
            `:d}
      </div>
      ${l?o`<div class="part-docs">
            <maintenance-task-documents
              .hass=${this.hass}
              .entryId=${this.entryId}
              .partId=${t.id}
              .canWrite=${this.canWrite}
            ></maintenance-task-documents>
          </div>`:d}
    `}_field(t,e,i={}){let a=this._editing;return o`
      <label class="form-field">
        <span>${t}</span>
        <input
          type=${i.type||"text"}
          .value=${String(a[e]??"")}
          placeholder=${i.placeholder||""}
          @input=${l=>{this._editing[e]=l.target.value,this.requestUpdate()}}
        />
      </label>
    `}_renderForm(){let t=this._lang,e=this._editing;return o`
      <div class="part-form">
        <div class="form-grid">
          ${this._field(s("part_name",t),"name")}
          ${this._field(s("part_vendor",t),"vendor")}
          ${this._field("MPN","mpn")}
          ${this._field("GTIN / EAN","gtin",{placeholder:"4006381333931"})}
          ${this._field(s("part_storage_location",t),"storage_location")}
          ${this._field(s("part_product_url",t),"product_url",{placeholder:"https://\u2026"})}
          ${this._field(s("part_unit",t),"unit")}
          ${this._field(s("part_cost",t),"cost",{type:"number"})}
          ${this._field(s("part_stock",t),"stock",{type:"number"})}
          ${this._field(s("part_reorder_threshold",t),"reorder_threshold",{type:"number"})}
          ${this._field(s("part_restock_quantity",t),"restock_quantity",{type:"number"})}
          <label class="form-field checkbox">
            <input
              type="checkbox"
              .checked=${e.auto_buy_task}
              @change=${i=>{this._editing={...e,auto_buy_task:i.target.checked}}}
            />
            <span>${s("part_auto_buy",t)}</span>
          </label>
        </div>
        <div class="form-actions">
          <ha-button appearance="plain" @click=${()=>this._editing=null}>${s("cancel",t)}</ha-button>
          <ha-button .disabled=${this._busy||!e.name.trim()} @click=${()=>this._save()}
            >${s("save",t)}</ha-button
          >
        </div>
      </div>
    `}_inventoryValue(){let t=0,e=!1;for(let i of this.parts){let a=typeof i.cost=="number"?i.cost:null,l=typeof i.stock=="number"?i.stock:null;a!==null&&l!==null&&(t+=a*l,e=!0)}return e?t:null}render(){let t=this._lang;return!this.parts.length&&!this.canWrite?d:o`
      <div class="section-head">
        <h3>
          <ha-icon icon="mdi:package-variant"></ha-icon>
          ${s("parts_section",t)} (${this.parts.length})
          ${this._inventoryValue()!==null?o`<span class="inventory-value" title=${s("parts_inventory_value",t)}
                >${s("parts_inventory_value",t)}:
                ${this._inventoryValue().toFixed(2)}&nbsp;${this.currencySymbol}</span>`:d}
        </h3>
        ${this.canWrite&&!this._editing?o`<ha-button appearance="plain" @click=${()=>this._openAdd()}>
              <ha-icon icon="mdi:plus"></ha-icon> ${s("part_add",t)}
            </ha-button>`:d}
      </div>
      ${this._error?o`<div class="error">${this._error}</div>`:d}
      ${this._editing?this._renderForm():d}
      ${this.parts.map(e=>this._renderRow(e))}
    `}};K.styles=D`
    :host {
      display: block;
      margin: 12px 0;
    }
    .inventory-value {
      margin-left: 8px;
      font-size: 0.75em;
      font-weight: 400;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    h3 {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 8px 0;
    }
    .part-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 4px;
      border-bottom: 1px solid var(--divider-color);
    }
    .part-row.low .part-icon {
      color: var(--warning-color, #ff9800);
    }
    .part-main {
      flex: 1;
      min-width: 0;
    }
    .part-name {
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .part-name a {
      color: var(--primary-color);
      text-decoration: none;
    }
    .stock-badge {
      font-size: 12px;
      padding: 1px 8px;
      border-radius: 10px;
      background: var(--secondary-background-color);
    }
    .stock-badge.low {
      background: var(--warning-color, #ff9800);
      color: var(--text-primary-color, #fff);
    }
    .stock-badge .threshold {
      opacity: 0.7;
    }
    .part-meta {
      font-size: 12px;
      color: var(--secondary-text-color);
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .part-meta .loc ha-icon {
      --mdc-icon-size: 13px;
    }
    .restock-input {
      width: 64px;
      padding: 4px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .restock-input.invalid {
      border-color: var(--error-color, #f44336);
    }
    .docs-open {
      color: var(--primary-color);
    }
    .part-docs {
      padding: 0 4px 8px 34px;
      border-bottom: 1px solid var(--divider-color);
    }
    .part-form {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 8px 12px;
    }
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .form-field input[type="text"],
    .form-field input[type="number"] {
      padding: 6px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .form-field.checkbox {
      flex-direction: row;
      align-items: center;
      gap: 6px;
      align-self: end;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 10px;
    }
    .error {
      color: var(--error-color);
      font-size: 13px;
      margin: 4px 0;
    }
  `,u([$({attribute:!1})],K.prototype,"hass",2),u([$({attribute:!1})],K.prototype,"entryId",2),u([$({attribute:!1})],K.prototype,"parts",2),u([$({type:Boolean})],K.prototype,"canWrite",2),u([$({attribute:!1})],K.prototype,"currencySymbol",2),u([m()],K.prototype,"_editing",2),u([m()],K.prototype,"_busy",2),u([m()],K.prototype,"_error",2),u([m()],K.prototype,"_restockFor",2),u([m()],K.prototype,"_restockQty",2),u([m()],K.prototype,"_restockInvalid",2),u([m()],K.prototype,"_docsFor",2);customElements.define("maintenance-parts-section",K);var di=new Set(["completed","skipped","reset","missed"]);function Le(r){let n=[];for(let t of r)for(let e of t.history??[]){if(!di.has(e.type))continue;let i=new Date(e.timestamp).getTime();Number.isFinite(i)&&n.push({ts:i,timestamp:e.timestamp,taskId:t.id,taskName:t.name,type:e.type,cost:typeof e.cost=="number"?e.cost:null,duration:typeof e.duration=="number"?e.duration:null,notes:e.notes??null,completedBy:e.completed_by??null,phaseName:e.phase_id&&t.phases?.[e.phase_id]?.name||null})}return n.sort((t,e)=>e.ts-t.ts||t.taskName.localeCompare(e.taskName)),n}function Pe(r,n){let t=n.from?new Date(`${n.from}T00:00:00`).getTime():null,e=n.to?new Date(`${n.to}T00:00:00`).getTime()+864e5:null;return r.filter(i=>!(n.taskId&&i.taskId!==n.taskId||t!=null&&i.ts<t||e!=null&&i.ts>=e))}function Yt(r){let n=0,t=0;for(let e of r)e.type==="completed"&&(n++,e.cost!=null&&(t+=e.cost));return{completed:n,totalCost:t}}function L(r){return String(r??"").replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}function Fe(r,n,t,e,i,a,l,p={}){let c=n.filter(_=>_.type==="completed"),{totalCost:h}=Yt(c),g=[[t.manufacturer,r.manufacturer],[t.model,r.model],[t.serial,r.serial_number],[t.installed,r.installation_date?e(r.installation_date):null]].filter(([,_])=>_).map(([_,y])=>`<div class="meta-row"><span>${L(_)}</span><strong>${L(y)}</strong></div>`).join(""),v=c.map(_=>{let y=[_.notes,_.completedBy?`${t.completedBy}: ${_.completedBy}`:null].filter(Boolean).join(" \xB7 ");return`<tr>
        <td class="nowrap">${L(e(_.timestamp))}</td>
        <td>${L(_.phaseName?`${_.taskName} \xB7 ${_.phaseName}`:_.taskName)}</td>
        <td class="num">${_.cost!=null?`${L(_.cost.toFixed(2))} ${L(a)}`:L(t.none)}</td>
        <td class="num">${_.duration!=null?L(i(_.duration)):L(t.none)}</td>
        <td class="notes">${L(y)||L(t.none)}</td>
      </tr>`}).join(`
`);return`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${L(t.title)} \u2014 ${L(r.name)}</title>
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
<h1>${L(t.title)} \u2014 ${L(r.name)}</h1>
<p class="sub">${L(t.generated)} ${L(e(l))} \xB7 ${L(t.entriesLabel(c.length))}</p>
${g?`<div class="meta">${g}</div>`:""}
<table>
  <thead><tr>
    <th>${L(t.colDate)}</th>
    <th>${L(t.colTask)}</th>
    <th class="num">${L(t.colCost)}</th>
    <th class="num">${L(t.colDuration)}</th>
    <th>${L(t.colNotes)}</th>
  </tr></thead>
  <tbody>
${v}
  </tbody>
  <tfoot><tr>
    <td colspan="2">${L(t.totalLabel)}</td>
    <td class="num">${L(h.toFixed(2))} ${L(a)}</td>
    <td colspan="2"></td>
  </tr></tfoot>
</table>
${p.capped?`<p class="cap-note">${L(t.capNote)}</p>`:""}
</body>
</html>`}var pi=500,G=class extends R{constructor(){super(...arguments);this.entryId="";this.object=null;this.tasks=[];this.currencySymbol="\u20AC";this.userName=()=>null;this._full={};this._loading=!1;this._filterTask="";this._from="";this._to="";this._expanded=!1;this._loadedFor=null;this._localeReady=!1}get _lang(){return P(this.hass)}updated(t){super.updated(t),!this._localeReady&&this.hass&&(this._localeReady=!0,Y(this._lang).then(()=>this.requestUpdate())),this.entryId&&this._loadedFor!==this.entryId&&(this._loadedFor=this.entryId,this._full={},this._filterTask="",this._from="",this._to="",this._loadFullHistories())}async _loadFullHistories(){let t=this.entryId,e=this.tasks;if(!e.length)return;this._loading=!0;let i=await Promise.all(e.map(async a=>{try{let l=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:t,task_id:a.id});return[a.id,l.history??[]]}catch{return[a.id,a.history??[]]}}));this.entryId===t&&(this._full=Object.fromEntries(i),this._loading=!1)}get _entries(){return Le(this.tasks.map(t=>({id:t.id,name:t.name,history:this._full[t.id]??t.history??[]})))}get _capped(){return Object.values(this._full).some(t=>t.length>=pi)}_openTask(t){this.dispatchEvent(new CustomEvent("open-task",{detail:{taskId:t},bubbles:!0,composed:!0}))}_print(t){let e=this._lang,i=this.object;if(!i)return;let a={title:s("service_record_title",e),generated:s("report_generated",e),manufacturer:s("manufacturer",e),model:s("model",e),serial:s("serial_number_label",e),installed:s("installed",e),colDate:s("date",e),colTask:s("task_name",e),colCost:s("cost",e),colDuration:s("duration",e),colNotes:s("notes_label",e),completedBy:s("completed_by",e),totalLabel:s("report_total_cost",e),entriesLabel:c=>`${c} ${s("service_record_entries",e)}`,capNote:s("object_history_cap_note",e),none:"\u2014"},l=t.map(c=>({...c,completedBy:c.completedBy?this.userName(c.completedBy):null})),p=Fe(i,l,a,c=>c?V(c,e):"",c=>`${c} min`,this.currencySymbol,new Date().toISOString(),{capped:this._capped});Ct(p)}render(){let t=this._lang,e=this._entries;if(!e.length&&!this._loading)return d;let i=Pe(e,{taskId:this._filterTask||null,from:this._from||null,to:this._to||null}),{completed:a,totalCost:l}=Yt(i),p=this._expanded?i:i.slice(0,15);return o`
      <div class="section">
        <h3>
          ${s("object_history_section",t)}
          <span class="count">${i.length}</span>
          ${this._loading?o`<span class="loading-hint">${s("loading",t)}</span>`:d}
          <ha-button appearance="plain" class="print-btn" @click=${()=>this._print(i)}>
            <ha-icon icon="mdi:printer-outline"></ha-icon>
            ${s("service_record_print",t)}
          </ha-button>
        </h3>

        <div class="filters">
          <select .value=${this._filterTask} @change=${c=>{this._filterTask=c.target.value}}>
            <option value="">${s("object_history_all_tasks",t)}</option>
            ${this.tasks.map(c=>o`<option value=${c.id} ?selected=${c.id===this._filterTask}>${c.name}</option>`)}
          </select>
          <label>${s("date_from",t)}
            <input type="date" .value=${this._from} @change=${c=>{this._from=c.target.value}} />
          </label>
          <label>${s("date_to",t)}
            <input type="date" .value=${this._to} @change=${c=>{this._to=c.target.value}} />
          </label>
        </div>

        ${i.length===0?o`<p class="empty">${s("object_history_empty",t)}</p>`:o`
              <div class="rows">
                ${p.map(c=>o`
                  <div class="row">
                    <span class="date" title=${kt(c.timestamp,t)}>${V(c.timestamp,t)}</span>
                    <span class="type type-${c.type}">${s(c.type,t)}</span>
                    <button class="task-link" @click=${()=>this._openTask(c.taskId)}>${c.taskName}${c.phaseName?` \xB7 ${c.phaseName}`:""}</button>
                    <span class="facts">
                      ${c.cost!=null?o`<span>${c.cost.toFixed(2)} ${this.currencySymbol}</span>`:d}
                      ${c.duration!=null?o`<span>${c.duration} min</span>`:d}
                    </span>
                    ${c.notes?o`<span class="notes" title=${c.notes}>${c.notes}</span>`:d}
                  </div>
                `)}
              </div>
              ${i.length>p.length?o`<ha-button appearance="plain" class="more" @click=${()=>{this._expanded=!0}}>
                    ${s("show_all",t)} (${i.length})
                  </ha-button>`:d}
              <div class="totals">
                ${a} ${s("service_record_entries",t)} · ${s("report_total_cost",t)}:
                <strong>${l.toFixed(2)} ${this.currencySymbol}</strong>
              </div>
              ${this._capped?o`<p class="cap-note">${s("object_history_cap_note",t)}</p>`:d}
            `}
      </div>
    `}};G.styles=D`
    .section { margin-top: 28px; }
    h3 { display: flex; align-items: center; gap: 8px; margin: 0 0 10px; }
    .count {
      font-size: 12px; color: var(--secondary-text-color);
      background: var(--secondary-background-color); padding: 2px 8px; border-radius: 999px;
    }
    .loading-hint { font-size: 12px; color: var(--secondary-text-color); font-weight: 400; }
    .print-btn { margin-left: auto; }
    .print-btn ha-icon { --mdc-icon-size: 16px; margin-right: 4px; }
    .filters {
      display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
      margin-bottom: 10px; font-size: 13px; color: var(--secondary-text-color);
    }
    .filters select, .filters input {
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
      border-radius: 6px; padding: 5px 8px; font: inherit;
    }
    .filters label { display: inline-flex; align-items: center; gap: 6px; }
    .rows { display: flex; flex-direction: column; }
    .row {
      display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;
      padding: 6px 4px; border-bottom: 1px solid var(--divider-color);
      font-size: 13px;
    }
    .date { color: var(--secondary-text-color); min-width: 84px; white-space: nowrap; }
    .type {
      font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
      padding: 1px 6px; border-radius: 4px; white-space: nowrap;
    }
    .type-completed { background: color-mix(in srgb, var(--success-color, #43a047) 18%, transparent); color: var(--success-color, #43a047); }
    .type-skipped { background: color-mix(in srgb, var(--secondary-text-color) 15%, transparent); color: var(--secondary-text-color); }
    .type-missed { background: color-mix(in srgb, var(--error-color, #db4437) 15%, transparent); color: var(--error-color, #db4437); }
    .type-reset { background: color-mix(in srgb, var(--info-color, #039be5) 15%, transparent); color: var(--info-color, #039be5); }
    .task-link {
      background: none; border: none; padding: 0; cursor: pointer;
      color: var(--primary-text-color); font: inherit; font-weight: 500;
    }
    .task-link:hover { color: var(--primary-color); text-decoration: underline; }
    .facts { display: inline-flex; gap: 10px; color: var(--secondary-text-color); white-space: nowrap; }
    .notes {
      flex: 1 1 100%; color: var(--secondary-text-color);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      padding-left: 94px;
    }
    .more { margin-top: 6px; }
    .totals {
      margin-top: 10px; font-size: 13px; color: var(--secondary-text-color);
      display: flex; justify-content: flex-end; gap: 6px;
    }
    .totals strong { color: var(--primary-text-color); }
    .cap-note { margin: 8px 0 0; font-size: 11px; color: var(--secondary-text-color); }
    .empty { color: var(--secondary-text-color); font-style: italic; font-size: 13px; }
    @media (max-width: 640px) {
      .notes { padding-left: 0; }
    }
  `,u([$({attribute:!1})],G.prototype,"hass",2),u([$()],G.prototype,"entryId",2),u([$({attribute:!1})],G.prototype,"object",2),u([$({attribute:!1})],G.prototype,"tasks",2),u([$()],G.prototype,"currencySymbol",2),u([$({attribute:!1})],G.prototype,"userName",2),u([m()],G.prototype,"_full",2),u([m()],G.prototype,"_loading",2),u([m()],G.prototype,"_filterTask",2),u([m()],G.prototype,"_from",2),u([m()],G.prototype,"_to",2),u([m()],G.prototype,"_expanded",2);customElements.get("maintenance-object-history-section")||customElements.define("maintenance-object-history-section",G);var tt=class tt extends R{constructor(){super(...arguments);this.flat=!1;this._ov=null;this._loading=!1;this._marking=!1;this._error="";this._history=null;this._rosterSort=tt._storedSort();this._typeFilter=null;this._recorded=[];this._historyRequested=!1;this._localeReady=!1;this._markAll=async()=>{await this._mark(void 0)};this._repair=async()=>{if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/setup",language:this._lang}),await this._load()}catch(t){this._error=S(t,this._lang)}finally{this._marking=!1}}};this._loadHistory=async t=>{if(!(!t.target.open||this._historyRequested)){this._historyRequested=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview_history"});this._history=e.series}catch{this._history=null}}}}get _lang(){return P(this.hass)}connectedCallback(){super.connectedCallback(),this.hass&&this._load()}updated(t){t.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,Y(this._lang).then(()=>this.requestUpdate()),this._ov===null&&!this._loading&&this._load())}async _load(){this._loading=!0,this._error="";try{this._ov=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview"})}catch(t){this._error=S(t,this._lang)}finally{this._loading=!1}}async _mark(t){if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/mark_replaced",...t?{entity_ids:t}:{}}),await this._load()}catch(e){this._error=S(e,this._lang)}finally{this._marking=!1}}}async _setExcluded(t,e){if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/set_excluded",entity_id:t,excluded:e}),await this._load()}catch(i){this._error=S(i,this._lang)}finally{this._marking=!1}}}async _addBattery(t){let e=t.detail?.value;if(!(!e||this._marking)){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/set_included",entity_id:e,included:!0}),await this._load()}catch(i){this._error=S(i,this._lang)}finally{this._marking=!1}}}async _setTrackSelf(t){let e=t.target.checked;if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/set_track_self_charging",enabled:e}),await this._load()}catch(i){this._error=S(i,this._lang)}finally{this._marking=!1}}}_sparkline(t){let e=this._history?.[t.entity_id];if(!e||e.points.length<2)return d;let i=110,a=24,l=2,p=e.points[0][0],c=e.points[e.points.length-1][0],h=Date.now()/1e3,g=t.status!=="low"&&t.predicted_source==="trend"&&t.days_until!=null?h+t.days_until*86400:null,v=Math.max(c,g??c),_=E=>v===p?l:l+(E-p)/(v-p)*(i-2*l),y=E=>l+(1-Math.min(100,Math.max(0,E))/100)*(a-2*l),k=e.points.map(([E,w])=>`${_(E).toFixed(1)},${y(w).toFixed(1)}`).join(" "),j=e.points[e.points.length-1][1],M=y(e.threshold).toFixed(1);return o`<svg
      class="bf-spark"
      viewBox="0 0 ${i} ${a}"
      role="img"
      aria-label=${s("battery_fleet_sparkline_hint",this._lang)}
    >
      <title>${s("battery_fleet_sparkline_hint",this._lang)}</title>
      <line class="bf-spark-th" x1="0" y1=${M} x2=${i} y2=${M}></line>
      <polyline class="bf-spark-line" points=${k}></polyline>
      ${g!==null?o`<line
            class="bf-spark-proj"
            x1=${_(c).toFixed(1)}
            y1=${y(j).toFixed(1)}
            x2=${_(g).toFixed(1)}
            y2=${M}
          ></line>`:d}
    </svg>`}static _storedSort(){return J(A.batteryRosterSort)==="name"?"name":"urgency"}_setSort(t){this._rosterSort=t,q(A.batteryRosterSort,t)}_sortedRoster(t){let e=this._typeFilter===null?t:t.filter(a=>a.battery_type===this._typeFilter);if(this._rosterSort==="name")return e;let i=a=>a.status==="low"?-1e3+(a.level??101)/101:a.days_until??1/0;return[...e].sort((a,l)=>i(a)-i(l)||a.device_name.localeCompare(l.device_name))}_predictedDate(t){return this._fmtDate(Date.now()+t*864e5)}_fmtDate(t){return new Intl.DateTimeFormat(this._lang,{day:"numeric",month:"numeric",year:"numeric"}).format(new Date(t))}_shoppingLine(t){return Object.entries(t).map(([e,i])=>o`<button
        class="bf-type-chip ${this._typeFilter===e?"bf-type-chip-active":""}"
        title=${s("battery_fleet_filter_type",this._lang)}
        @click=${()=>this._toggleTypeFilter(e)}
      >
        ${i}× ${e}
      </button>`)}_toggleTypeFilter(t){if(this._typeFilter=this._typeFilter===t?null:t,this._typeFilter!==null){let e=this.shadowRoot?.querySelector("details.bf-roster");e&&!e.open&&(e.open=!0)}}async _recordJump(t,e){if(!this._marking){this._marking=!0,this._error="";try{await this.hass.callService("battery_notes","set_battery_replaced",{device_id:e.device_id,datetime_replaced:new Date(e.at*1e3).toISOString()}),this._recorded=[...this._recorded,t],await this._load()}catch(i){this._error=S(i,this._lang)}finally{this._marking=!1}}}_levelBar(t){let e=t.level;if(e==null)return d;let i=t.low_threshold??20,a=e<=i?"bad":e<=i+20?"warn":"good";return o`<span class="bf-bar" aria-hidden="true"
      ><span class="bf-bar-fill bf-bar-${a}" style="width: ${Math.min(100,Math.max(0,e))}%"></span
    ></span>`}render(){let t=this._lang;if(this._loading&&this._ov===null)return o`<div class="bf-card"><div class="bf-loading">…</div></div>`;let e=this._ov;if(!e)return this._error?o`<div class="bf-card"><div class="bf-error">${this._error}</div></div>`:d;let i=e.low.length;return o`
      <div class="bf-card">
        <div class="bf-head">
          <ha-icon icon="mdi:battery-alert"></ha-icon>
          <span class="bf-title">${s("battery_fleet_title",t)}</span>
          <span class="bf-count ${i?"bad":"ok"}">${i}</span>
        </div>
        ${this._error?o`<div class="bf-error">${this._error}</div>`:d}

        ${e.configured&&e.task_ok===!1?o`
              <div class="bf-repair">
                <span>${s("battery_fleet_trigger_lost",t)}</span>
                <ha-button .disabled=${this._marking} @click=${this._repair}>
                  ${s("battery_fleet_repair",t)}
                </ha-button>
              </div>
            `:d}

        ${i===0?o`<div class="bf-empty">${s("battery_fleet_none_low",t)}</div>`:o`
              <div class="bf-shopping">
                <span class="bf-label">${s("battery_fleet_buy_now",t)}</span>
                <span class="bf-list">${this._shoppingLine(e.needs_now)}</span>
              </div>
              <div class="bf-rows">
                ${e.low.map(a=>o`
                    <div class="bf-row">
                      <span class="bf-dev">${a.device_name}</span>
                      ${a.available===!1?o`<span class="bf-offline">${s("battery_fleet_offline",t)}</span>`:d}
                      <span class="bf-type">${a.quantity}× ${a.battery_type}</span>
                      ${a.rechargeable?o`<span class="bf-recharge" title=${s("battery_fleet_rechargeable",t)}
                            ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
                          ></span>`:d}
                      ${this._levelBar(a)}
                      ${a.level!=null?o`<span class="bf-level">${a.level}%</span>`:d}
                      <button
                        class="bf-mark"
                        title=${a.rechargeable?s("battery_fleet_mark_recharged",t):s("battery_fleet_mark_one",t)}
                        .disabled=${this._marking}
                        @click=${()=>this._mark([a.entity_id])}
                      >
                        <ha-icon icon="mdi:battery-sync"></ha-icon>
                      </button>
                      <button
                        class="bf-mark bf-exclude"
                        title=${s("battery_fleet_exclude",t)}
                        .disabled=${this._marking}
                        @click=${()=>this._setExcluded(a.entity_id,!0)}
                      >
                        <ha-icon icon="mdi:eye-off-outline"></ha-icon>
                      </button>
                    </div>
                  `)}
              </div>
              <div class="bf-actions">
                <ha-button .disabled=${this._marking} @click=${this._markAll}>
                  <ha-icon icon="mdi:battery-sync"></ha-icon> ${s("battery_fleet_mark_all",t)}
                </ha-button>
              </div>
            `}

        ${e.soon.length?o`
              <div class="bf-soon">
                <span class="bf-label">${s("battery_fleet_soon",t)}</span>
                <span class="bf-list">${this._shoppingLine(e.needs_soon)}</span>
                <div class="bf-soon-hint">${s("battery_fleet_soon_hint",t)}</div>
              </div>
            `:d}
        ${e.all?.length?o`
              <details class="bf-roster" @toggle=${this._loadHistory}>
                <summary>${s("battery_fleet_all",t)} (${e.all.length})</summary>
                <div class="bf-roster-tools">
                  <button
                    class="bf-sort ${this._rosterSort==="urgency"?"bf-sort-active":""}"
                    @click=${()=>this._setSort("urgency")}
                  >
                    ${s("battery_fleet_sort_urgency",t)}
                  </button>
                  <button
                    class="bf-sort ${this._rosterSort==="name"?"bf-sort-active":""}"
                    @click=${()=>this._setSort("name")}
                  >
                    ${s("battery_fleet_sort_name",t)}
                  </button>
                </div>
                <div class="bf-rows">
                  ${this._sortedRoster(e.all).map(a=>o`
                      <div class="bf-row">
                        <span class="bf-dev">${a.device_name}</span>
                        <span class="bf-status bf-${a.status}">${s("battery_fleet_status_"+a.status,t)}</span>
                        <span class="bf-type">${a.quantity}× ${a.battery_type}</span>
                        ${a.rechargeable?o`<span class="bf-recharge" title=${s("battery_fleet_rechargeable",t)}
                              ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
                            ></span>`:d}
                        ${this._sparkline(a)}
                        ${this._levelBar(a)}
                        ${a.level!=null?o`<span class="bf-level">${a.level}%</span>`:d}
                        ${(()=>{let l=this._history?.[a.entity_id]?.jump;return!l||this._recorded.includes(a.entity_id)?d:o`<button
                            class="bf-mark bf-jump"
                            title=${s("battery_fleet_record_replacement",t).replace("{date}",this._fmtDate(l.at*1e3))}
                            .disabled=${this._marking}
                            @click=${()=>this._recordJump(a.entity_id,l)}
                          >
                            <ha-icon icon="mdi:calendar-sync"></ha-icon>
                          </button>`})()}
                        ${a.days_until!=null?o`<span
                              class="bf-predicted ${a.predicted_source==="trend"?"bf-trend":""} ${a.forecast_overdue?"bf-overdue":""}"
                              title=${a.forecast_overdue?s("battery_fleet_forecast_overdue",t):a.predicted_source==="trend"?s("battery_fleet_predicted_trend",t).replace("{date}",this._predictedDate(a.days_until)).replace("{confidence}",s("cal_confidence_"+(a.prediction_confidence||"medium"),t)):s("battery_fleet_predicted_on",t).replace("{date}",this._predictedDate(a.days_until))}
                              >${a.forecast_overdue?o`<ha-icon icon="mdi:calendar-alert"></ha-icon>`:d}~${this._predictedDate(a.days_until)}</span
                            >`:d}
                        <button
                          class="bf-mark bf-exclude"
                          title=${s("battery_fleet_exclude",t)}
                          .disabled=${this._marking}
                          @click=${()=>this._setExcluded(a.entity_id,!0)}
                        >
                          <ha-icon icon="mdi:eye-off-outline"></ha-icon>
                        </button>
                      </div>
                    `)}
                </div>
                <div class="bf-roster-hint">${s("battery_fleet_all_hint",t)}</div>
                <div class="bf-add">
                  <span class="bf-label">${s("battery_fleet_add",t)}</span>
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{entity:{domain:["sensor","binary_sensor"]}}}
                    .value=${""}
                    @value-changed=${this._addBattery}
                  ></ha-selector>
                  <div class="bf-roster-hint">${s("battery_fleet_add_hint",t)}</div>
                </div>
                <label class="bf-track-self">
                  <input
                    type="checkbox"
                    .checked=${!!e.track_self_charging}
                    .disabled=${this._marking}
                    @change=${this._setTrackSelf}
                  />
                  ${s("battery_fleet_track_self",t)}
                </label>
                <div class="bf-roster-hint">${s("battery_fleet_track_self_hint",t)}</div>
              </details>
            `:d}
        ${e.excluded?.length?o`
              <div class="bf-excluded">
                <span class="bf-label">${s("battery_fleet_excluded",t)}</span>
                ${e.excluded.map(a=>o`
                    <span class="bf-excluded-chip">
                      ${a.device_name}
                      <button
                        class="bf-mark"
                        title=${s("battery_fleet_include",t)}
                        .disabled=${this._marking}
                        @click=${()=>this._setExcluded(a.entity_id,!1)}
                      >
                        <ha-icon icon="mdi:eye-outline"></ha-icon>
                      </button>
                    </span>
                  `)}
              </div>
            `:d}
        <div class="bf-total">${s("battery_fleet_total",t).replace("{n}",String(e.total))}</div>
      </div>
    `}};tt.styles=D`
    .bf-card {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 14px 16px;
      margin: 12px 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    :host([flat]) .bf-card {
      background: transparent;
      border: none;
      border-radius: 0;
      margin: 0;
      padding: 0;
    }
    .bf-head {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
    .bf-title {
      flex: 1;
    }
    .bf-count {
      font-size: 13px;
      padding: 1px 9px;
      border-radius: 10px;
    }
    .bf-count.bad {
      background: var(--error-color, #f44336);
      color: #fff;
    }
    .bf-count.ok {
      background: var(--success-color, #4caf50);
      color: #fff;
    }
    .bf-error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .bf-repair {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 8px 10px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--warning-color, #ff9800) 12%, transparent);
      font-size: 13px;
    }
    .bf-empty {
      color: var(--secondary-text-color);
      font-size: 14px;
    }
    .bf-shopping,
    .bf-soon {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 8px;
    }
    .bf-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--secondary-text-color);
    }
    .bf-list {
      font-weight: 500;
    }
    /* Cross-row column alignment (same subgrid pattern as the task table,
     * issue 66): the LIST owns one column template, every row spans it via
     * subgrid, and each element is PINNED to its column below - so an
     * optional element (sparkline, percentage, forecast date) leaves its
     * column empty instead of letting the rest of the row drift. max-content
     * columns collapse to 0 when a whole list never fills them (the low list
     * has no status chip, no sparkline, no date). */
    .bf-rows {
      display: grid;
      grid-template-columns: minmax(0, 1fr) repeat(9, max-content);
      column-gap: 8px;
    }
    .bf-row {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: 1 / -1;
      align-items: center;
      padding: 6px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    /* Column pinning: 1 name, 2 status/offline chip, 3 type, 4 charging
     * icon, 5 sparkline, 6 level bar, 7 percentage, 8 row action
     * (mark-one / record-swap), 9 forecast date, 10 exclude eye. */
    .bf-dev {
      grid-column: 1;
      min-width: 0;
    }
    .bf-offline,
    .bf-status {
      grid-column: 2;
      justify-self: end;
    }
    .bf-type {
      grid-column: 3;
    }
    .bf-recharge {
      grid-column: 4;
    }
    .bf-spark {
      grid-column: 5;
    }
    .bf-bar {
      grid-column: 6;
    }
    .bf-level {
      grid-column: 7;
      justify-self: end;
    }
    .bf-row .bf-mark {
      grid-column: 8;
    }
    .bf-predicted {
      grid-column: 9;
      justify-self: end;
    }
    .bf-row .bf-mark.bf-exclude {
      grid-column: 10;
    }
    .bf-offline {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-style: italic;
    }
    .bf-type {
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .bf-recharge {
      color: var(--secondary-text-color);
      display: inline-flex;
      cursor: help;
    }
    .bf-recharge ha-icon {
      --mdc-icon-size: 16px;
    }
    .bf-spark {
      width: 110px;
      height: 24px;
      flex: 0 0 auto;
      cursor: help;
    }
    /* On phones the row cannot fit name + chips + curve + bar + date in ONE
     * line: the decorations yield (the percentage still carries the number)
     * and the row wraps to two lines - the name spans the full width, the
     * status chip moves under it (left, into the name column) and the rest
     * keeps its pinned subgrid column, so type / percentage / date / eye
     * stay aligned across rows. Without this the fixed max-content columns
     * overflowed 400 px and the chips overlapped the wrapped names. */
    @media (max-width: 640px) {
      .bf-spark,
      .bf-bar {
        display: none;
      }
      .bf-row {
        row-gap: 2px;
      }
      .bf-dev {
        grid-column: 1 / 9;
        grid-row: 1;
      }
      .bf-offline,
      .bf-status {
        /* Line 1, RIGHT - over the date+eye columns, which are wide enough
         * for any chip. Pinning the chip into the 1fr rest column instead
         * overlapped the type text (the rest column shrinks below chip
         * width, and a span onto an fr track never grows fixed tracks). */
        grid-column: 9 / 11;
        grid-row: 1;
        justify-self: end;
      }
      .bf-type {
        grid-row: 2;
        max-width: 44vw;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .bf-recharge,
      .bf-level,
      .bf-predicted,
      .bf-row .bf-mark {
        grid-row: 2;
      }
    }
    .bf-spark-line {
      fill: none;
      stroke: var(--primary-color);
      stroke-width: 1.5;
      stroke-linejoin: round;
    }
    .bf-spark-proj {
      stroke: var(--primary-color);
      stroke-width: 1.2;
      stroke-dasharray: 2 3;
      opacity: 0.7;
    }
    .bf-spark-th {
      stroke: var(--error-color, #f44336);
      stroke-width: 1;
      opacity: 0.35;
    }
    .bf-type-chip {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 1px 8px;
      margin: 0 4px 2px 0;
      font-size: 13px;
      color: inherit;
      cursor: pointer;
    }
    .bf-type-chip-active {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .bf-bar {
      width: 30px;
      height: 6px;
      border-radius: 3px;
      background: var(--divider-color);
      overflow: hidden;
      flex: 0 0 auto;
    }
    .bf-bar-fill {
      display: block;
      height: 100%;
      border-radius: 3px;
    }
    .bf-bar-good {
      background: var(--success-color, #4caf50);
    }
    .bf-bar-warn {
      background: var(--warning-color, #ff9800);
    }
    .bf-bar-bad {
      background: var(--error-color, #f44336);
    }
    .bf-jump ha-icon {
      color: var(--warning-color, #ff9800);
    }
    .bf-roster-tools {
      display: flex;
      gap: 6px;
      margin: 8px 0 2px;
    }
    .bf-sort {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      padding: 2px 10px;
      font-size: 12px;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .bf-sort-active {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .bf-level {
      font-size: 12px;
      color: var(--error-color, #f44336);
    }
    .bf-mark {
      background: transparent;
      border: none;
      color: var(--primary-color);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: inline-flex;
    }
    .bf-mark:hover {
      background: var(--secondary-background-color);
    }
    .bf-actions {
      display: flex;
      justify-content: flex-end;
    }
    .bf-soon {
      border-top: 1px solid var(--divider-color);
      padding-top: 8px;
    }
    .bf-soon-hint {
      width: 100%;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    /* The roster is a lookup list, not the headline — collapsed by default so
       the section still opens on what actually needs doing. */
    .bf-roster > summary {
      cursor: pointer;
      font-size: 13px;
      color: var(--secondary-text-color);
      padding: 2px 0;
    }
    .bf-roster-hint {
      font-size: 12px;
      color: var(--secondary-text-color);
      padding-top: 6px;
    }
    .bf-status {
      font-size: 11px;
      padding: 1px 7px;
      border-radius: 9px;
      white-space: nowrap;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      color: var(--secondary-text-color);
    }
    .bf-status.bf-low {
      background: var(--error-color, #f44336);
      color: #fff;
    }
    .bf-status.bf-soon {
      background: var(--warning-color, #ff9800);
      color: #fff;
    }
    .bf-predicted {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    /* Trend-based dates (discharge regression) get a dotted underline — the
       tooltip carries source + confidence. */
    .bf-predicted.bf-trend {
      text-decoration: underline dotted;
      text-underline-offset: 2px;
    }
    /* B1: passed prediction on a still-healthy battery — warn-tinted with a
       calendar-alert icon; the tooltip explains (record the swap / forecast
       was off). Deliberately NOT red: this is a discrepancy, not an alarm. */
    .bf-predicted.bf-overdue {
      color: var(--warning-color, #ff9800);
    }
    .bf-predicted.bf-overdue ha-icon {
      --mdc-icon-size: 14px;
      margin-right: 2px;
    }
    .bf-total {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .bf-exclude {
      color: var(--secondary-text-color);
    }
    .bf-excluded {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      border-top: 1px solid var(--divider-color);
      padding-top: 8px;
    }
    .bf-excluded-chip {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 12px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 10px;
      padding: 1px 4px 1px 10px;
    }
    .bf-track-self {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      font-size: 13px;
      cursor: pointer;
    }
    .bf-track-self input {
      accent-color: var(--primary-color);
      margin: 0;
    }
  `,u([$({attribute:!1})],tt.prototype,"hass",2),u([$({type:Boolean})],tt.prototype,"flat",2),u([m()],tt.prototype,"_ov",2),u([m()],tt.prototype,"_loading",2),u([m()],tt.prototype,"_marking",2),u([m()],tt.prototype,"_error",2),u([m()],tt.prototype,"_history",2),u([m()],tt.prototype,"_rosterSort",2),u([m()],tt.prototype,"_typeFilter",2),u([m()],tt.prototype,"_recorded",2);var se=tt;customElements.get("maintenance-battery-fleet-section")||customElements.define("maintenance-battery-fleet-section",se);var He=D`
  .cal-controls {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    padding: 12px 16px;
    border-bottom: 1px solid var(--divider-color);
  }
  .cal-window-chips {
    display: flex;
    gap: 4px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    border-radius: 999px;
    padding: 3px;
  }
  .cal-window-chip {
    padding: 6px 14px;
    border: none;
    background: transparent;
    color: var(--secondary-text-color);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 999px;
    transition: background 0.12s, color 0.12s;
  }
  .cal-window-chip:hover { color: var(--primary-text-color); }
  .cal-window-chip.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  /* v2.2.0 — past-window chips: visually distinguished from forward chips
     so the user grasps the time-direction switch at a glance. Uses a
     muted secondary tone instead of the primary blue. v2.3.x: explicit
     "−N d" / "+N d" prefixes + dot separator so past vs forward groups
     read at a glance instead of being two pill rows that look identical
     except for a small arrow. (User feedback: *"das −30 und die + sind
     noch schlecht angeordnet"*.) */
  .cal-past-chips {
    /* margin-right replaced by explicit separator below */
  }
  .cal-past-chip.active {
    background: var(--secondary-text-color, #888);
  }
  .cal-chip-separator {
    color: var(--divider-color);
    font-size: 8px;
    align-self: center;
    margin: 0 2px;
    line-height: 1;
  }
  .cal-user-filter {
    margin-left: auto;
    padding: 6px 10px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
  }
  .cal-rolling { padding: 8px 16px 32px; }
  .cal-day-row {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--divider-color);
  }
  .cal-day-pill {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    border: 1px solid var(--divider-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cal-day-pill.cal-today {
    background: var(--primary-color);
    border-color: var(--primary-color);
  }
  .cal-pill-weekday {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: var(--secondary-text-color);
  }
  .cal-pill-day {
    font-size: 20px;
    font-weight: 700;
    color: var(--primary-text-color);
    line-height: 1.1;
  }
  .cal-day-pill.cal-today .cal-pill-weekday,
  .cal-day-pill.cal-today .cal-pill-day {
    color: var(--text-primary-color, #fff);
  }
  .cal-day-content { flex: 1; min-width: 0; }
  .cal-day-header {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 6px;
  }
  .cal-day-month { color: var(--secondary-text-color); font-size: 13px; }
  .cal-day-today-badge {
    color: var(--primary-color);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .cal-empty {
    color: var(--secondary-text-color);
    font-size: 13px;
    font-style: italic;
    padding: 4px 0 4px;
  }
  .cal-event {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.12s;
  }
  .cal-event:hover { background: var(--state-icon-color, rgba(255,255,255,0.04)); }
  .cal-event-projected { opacity: 0.55; }
  .cal-event-body { flex: 1; min-width: 0; }
  .cal-event-title {
    font-size: 14px;
    color: var(--primary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cal-event-recur {
    display: block;
    font-size: 11px;
    color: var(--secondary-text-color);
    margin-top: 2px;
  }
  .cal-event-icon {
    --mdc-icon-size: 18px;
    flex-shrink: 0;
  }
  .cal-source-time   { color: var(--secondary-text-color); }
  .cal-source-sensor { color: var(--primary-color); }
  .cal-event-prediction {
    display: inline-block;
    font-size: 11px;
    margin-top: 2px;
    padding: 1px 6px;
    border-radius: 999px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    border: 1px solid var(--divider-color);
  }
  .cal-conf-high   { color: var(--success-color, #4caf50); border-color: #4caf5044; }
  .cal-conf-medium { color: var(--warning-color, #f9a825); border-color: #f9a82544; }
  .cal-conf-low    { color: var(--error-color, #d32f2f); border-color: #d32f2f44; }
  .cal-event-cost {
    font-size: 12px;
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }
  .cal-status-pill {
    flex-shrink: 0;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: #fff;
  }
  /* Same tokens as .status-badge (status-constants.ts) — the calendar used
     to keep its own palette (triggered was even BLUE here) so identical
     statuses wore different colors per view, and none followed the theme. */
  .cal-status-overdue   { background: var(--error-color, #f44336); }
  .cal-status-triggered { background: var(--deep-orange-color, #ff5722); }
  .cal-status-due_soon  { background: var(--warning-color, #ff9800); color: #000; }
  /* Dark text — white on green is only 2.8:1 (below the 3:1 UI floor). */
  .cal-status-ok        { background: var(--success-color, #4caf50); color: #000; }

  @media (max-width: 600px) {
    .cal-controls { padding: 10px 12px; }
    .cal-rolling { padding: 6px 12px 24px; }
    .cal-day-pill { width: 48px; height: 48px; }
    .cal-pill-day { font-size: 17px; }
    .cal-user-filter { margin-left: 0; width: 100%; }
  }
`;function Ne(r){let n=window;n.customCards=n.customCards||[],n.customCards.some(t=>t.type===r.type)||n.customCards.push(r)}var st=class extends R{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._objectFilter="";this._configuredObjects=[];this._unsub=null;this._dataLoaded=!1;this._lastConnection=null}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(t){if(this._config={...t},t.past_days&&[30,90].includes(t.past_days)?this._pastDays=t.past_days:t.window_days&&[7,14,30,365].includes(t.window_days)&&(this._windowDays=t.window_days,this._pastDays=0),typeof t.user_filter=="string"&&(this._userFilter=t.user_filter),typeof t.object_filter=="string")this._objectFilter=t.object_filter,this._configuredObjects=[];else if(Array.isArray(t.object_filter)){let e=t.object_filter.filter(i=>typeof i=="string"&&i!=="");this._objectFilter=e.length===1?e[0]:"",this._configuredObjects=e.length>1?e:[]}}getCardSize(){return 6}get _lang(){return P(this.hass)}disconnectedCallback(){if(super.disconnectedCallback(),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._dataLoaded=!1,this._lastConnection=null}updated(t){if(super.updated(t),Pt(this,t),t.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[t,e]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=t.objects,this._stats=e}catch{}}async _subscribe(){try{let t=await this.hass.connection.subscribeMessage(e=>{let i=e;this._objects=i.objects},{type:"maintenance_supporter/subscribe"});if(!this.isConnected){t();return}this._unsub=t}catch{}}_onEventClick(t){if(t.history_timestamp){this._openHistoryEntry(t);return}De(t.entry_id,t.task_id)||this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:t.entry_id,task_id:t.task_id},bubbles:!0,composed:!0}))}async _openHistoryEntry(t){try{let i=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:t.entry_id})).tasks?.find(l=>l.id===t.task_id)?.history?.find(l=>l.timestamp===t.history_timestamp);if(!i||Ce({entry_id:t.entry_id,task_id:t.task_id,original_timestamp:t.history_timestamp,type:i.type||"completed",timestamp:i.timestamp||t.history_timestamp,notes:i.notes??null,cost:i.cost??null,duration:i.duration??null,completed_by:i.completed_by??null,used_parts:i.used_parts??null}))return}catch{}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:t.entry_id,task_id:t.task_id,original_timestamp:t.history_timestamp},bubbles:!0,composed:!0}))}render(){if(!this.hass)return d;let t=this._lang,e=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,a=this._config.title,l=null;this._userFilter&&(l=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let p=f=>{let Q=f.toLowerCase();return this._objects.find(it=>it.entry_id===f||it.object.name.toLowerCase()===Q)?.entry_id??null},c=new Set(this._configuredObjects.map(p).filter(f=>f!==null)),h=c.size?this._objects.filter(f=>c.has(f.entry_id)):this._objects,g=this._config.show_object_filter!==!1&&h.length>1,v=this._objectFilter?p(this._objectFilter):null,_=v&&h.some(f=>f.entry_id===v)?h.filter(f=>f.entry_id===v):h,y=new Date;y.setHours(0,0,0,0);let k=this._pastDays>0,j=k?ke(_,y,this._pastDays,l):we(_,y,this._windowDays,l),M=$e(y),E=this._windowDays===365||k,w=E?j.filter(f=>f.events.length>0):j,z=f=>{let Q=`cal-status-${f.status}`,et=f.projected?"cal-event-projected":"",it=f.status==="overdue"&&f.days_until_due!=null?` (${_t(f.days_until_due,t)})`:"",nt=f.projected&&f.interval_days?o`<span class="cal-event-recur">${f.interval_unit&&f.interval_unit!=="days"?`${f.interval_days} ${s("unit_"+f.interval_unit,t)}`:s("cal_every_n_days",t).replace("{n}",String(f.interval_days))}</span>`:d,U=f.schedule_type==="sensor_based",dt=U?o`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${s("cal_source_sensor",t)}" icon="mdi:trending-up"></ha-icon>`:o`<ha-icon class="cal-event-icon cal-source-time"
                title="${f.adaptive_enabled?s("cal_source_time_adaptive",t):s("cal_source_time",t)}"
                icon="${f.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,yt=U&&f.prediction_confidence&&f.status!=="triggered"&&!f.projected?o`<span class="cal-event-prediction cal-conf-${f.prediction_confidence}">
            ${s("cal_predicted",t)} · ${s(`cal_confidence_${f.prediction_confidence}`,t)}
          </span>`:d,xt=this._stats?.budget?.currency_symbol||Lt,B=f.history_type?s(f.history_type,t):s(f.status,t);return o`
        <div class="cal-event ${et}"
          @click=${()=>this._onEventClick(f)}>
          ${dt}
          <span class="cal-status-pill ${Q}">${B}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${f.object_name} · ${f.task_name}${it}</div>
            ${yt}
            ${nt}
          </div>
          ${f.avg_cost!=null&&f.avg_cost>0?o`<span class="cal-event-cost">${f.avg_cost.toFixed(0)} ${xt}</span>`:d}
        </div>
      `},T=f=>{let[Q,et,it]=f.date.split("-").map(Number),nt=new Date(Q,et-1,it),U=f.date===M,dt=nt.toLocaleDateString(t,{weekday:"short"}),yt=nt.toLocaleDateString(t,{month:"long"});return o`
        <div class="cal-day-row">
          <div class="cal-day-pill ${U?"cal-today":""}">
            <span class="cal-pill-weekday">${dt}</span>
            <span class="cal-pill-day">${nt.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${yt}</span>
              ${U?o`<span class="cal-day-today-badge">${s("today",t)}</span>`:d}
            </div>
            ${f.events.length===0?o`<div class="cal-empty">${s("cal_no_events",t)}</div>`:f.events.map(z)}
          </div>
        </div>
      `};return o`
      <ha-card .header=${a}>
        ${e||i?o`
              <div class="cal-controls">
                ${e?o`
                      <div class="cal-window-chips cal-past-chips" title="${s("cal_past_windows",t)||"Past windows"}">
                        ${[30,90].map(f=>o`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===f?"active":""}"
                            @click=${()=>{this._pastDays=f}}>
                            −${f}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${s("cal_forward_windows",t)||"Forward windows"}">
                        ${[7,14,30,365].map(f=>o`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===f?"active":""}"
                            @click=${()=>{this._windowDays=f,this._pastDays=0}}>
                            ${f===365?"+1y":`+${f}d`}
                          </button>
                        `)}
                      </div>
                    `:d}
                ${i?o`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${f=>{this._userFilter=f.target.value}}>
                        <option value="">${s("all_users",t)}</option>
                        <option value="current_user">${s("my_tasks",t)}</option>
                      </select>
                    `:d}
                ${g?o`
                      <select class="cal-user-filter"
                        .value=${v??""}
                        @change=${f=>{this._objectFilter=f.target.value}}>
                        <option value="">${s("all_objects",t)}</option>
                        ${[...h].sort((f,Q)=>f.object.name.localeCompare(Q.object.name)).map(f=>o`<option value=${f.entry_id} ?selected=${f.entry_id===v}>${f.object.name}</option>`)}
                      </select>
                    `:d}
              </div>
            `:d}
        <div class="cal-rolling">
          ${w.length===0&&E?o`<div class="cal-empty">${s("cal_no_events",t)}</div>`:w.map(T)}
        </div>
      </ha-card>
    `}};st.styles=[Ft,He,D`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],u([$({attribute:!1})],st.prototype,"hass",2),u([m()],st.prototype,"_config",2),u([m()],st.prototype,"_objects",2),u([m()],st.prototype,"_stats",2),u([m()],st.prototype,"_windowDays",2),u([m()],st.prototype,"_pastDays",2),u([m()],st.prototype,"_userFilter",2),u([m()],st.prototype,"_objectFilter",2),u([m()],st.prototype,"_unsub",2);var hi=[{value:7,key:"cal_editor_window_week"},{value:14,key:"cal_editor_window_fortnight"},{value:30,key:"cal_editor_window_month"},{value:365,key:"cal_editor_window_year"}],Tt=class extends R{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}get _lang(){return P(this.hass)}setConfig(t){this._config={...t}}updated(){let t=this._lang;t&&!de(t)&&Y(t).then(()=>this.requestUpdate())}_valueChanged(t,e){let i={...this._config,[t]:e};t==="show_window_chips"&&e===!0&&delete i.show_window_chips,t==="show_user_filter"&&e===!0&&delete i.show_user_filter,t==="show_object_filter"&&e===!0&&delete i.show_object_filter,t==="title"&&(!e||typeof e=="string"&&e.trim()==="")&&delete i.title,t==="user_filter"&&e===""&&delete i.user_filter,this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}render(){let t=this._lang,e=this._config.window_days??30,i=this._config.show_window_chips!==!1,a=this._config.show_user_filter!==!1,l=this._config.user_filter??"",p=this._config.title??"";return o`
      <div class="editor">
        <div class="row">
          <label for="title">${s("card_title",t)}</label>
          <input
            id="title"
            type="text"
            .value=${p}
            @input=${c=>this._valueChanged("title",c.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">${s("cal_editor_window",t)}</label>
          <select
            id="window"
            @change=${c=>this._valueChanged("window_days",Number(c.target.value))}
          >
            ${hi.map(c=>o`<option value="${c.value}" ?selected=${c.value===e}>${s(c.key,t)}</option>`)}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">${s("cal_editor_show_chips",t)}</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${i}
            @change=${c=>this._valueChanged("show_window_chips",c.target.checked)}
          />
        </div>
        <div class="hint">${s("cal_editor_chips_hint",t)}</div>
        <div class="row toggle">
          <label for="userf">${s("cal_editor_show_user_filter",t)}</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${a}
            @change=${c=>this._valueChanged("show_user_filter",c.target.checked)}
          />
        </div>
        <div class="row">
          <label for="userv">${s("cal_editor_default_user",t)}</label>
          <select
            id="userv"
            @change=${c=>this._valueChanged("user_filter",c.target.value)}
          >
            <option value="" ?selected=${l===""}>${s("all_users",t)}</option>
            <option value="current_user" ?selected=${l==="current_user"}>
              ${s("cal_editor_my_tasks",t)}
            </option>
          </select>
        </div>
        <div class="row toggle">
          <label for="objf">${s("cal_editor_show_object_filter",t)}</label>
          <input
            id="objf"
            type="checkbox"
            .checked=${this._config.show_object_filter!==!1}
            @change=${c=>this._valueChanged("show_object_filter",c.target.checked)}
          />
        </div>
        <div class="hint">${s("cal_editor_object_hint",t)}</div>
      </div>
    `}};Tt.styles=D`
    :host { display: block; padding: 8px 0; }
    .editor { display: flex; flex-direction: column; gap: 12px; }
    .row { display: flex; flex-direction: column; gap: 4px; }
    .row.toggle {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    label { font-weight: 500; color: var(--primary-text-color); font-size: 14px; }
    input[type="text"], select {
      padding: 8px;
      font-size: 14px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color, black);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
    }
    .hint {
      margin-top: -4px;
      font-size: 12px;
      color: var(--secondary-text-color, #666);
    }
  `,u([$({attribute:!1})],Tt.prototype,"hass",2),u([m()],Tt.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",st);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",Tt);Ne({type:"maintenance-supporter-calendar-card",name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});var at=class extends R{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel="",this._inputType="",this._inputValue="",this._open=!0,new Promise(e=>{this._resolve=e,this._promptResolve=null})}prompt(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel=t.inputLabel||"",this._inputType=t.inputType||"text",this._inputValue=t.inputValue||"",this._open=!0,new Promise(e=>{this._promptResolve=e,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return d;let t=P(this.hass);return o`
      <ha-dialog open @closed=${this._cancel}>
        <div class="dialog-title">${this._title}</div>
        <div class="content">
          ${this._message}
          ${this._inputLabel?o`
            <!-- Native <input> rather than <ha-textfield>: HA loads
                 ha-textfield lazily for its own panels, so inside this custom
                 panel it can be unregistered and render with zero height —
                 the prompt then shows no field at all (caught live testing
                 the pause/replace prompts; same fix as complete-dialog). -->
            <label class="field">
              <span class="field-label">${this._inputLabel}</span>
              <input class="field-input"
                type="${this._inputType||"text"}"
                .value=${this._inputValue}
                @input=${e=>this._inputValue=e.target.value} />
            </label>
          `:d}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._cancel}>
            ${s("cancel",t)}
          </ha-button>
          <ha-button
            class="${this._danger?"danger":""}"
            @click=${this._confirmAction}
          >
            ${this._confirmText}
          </ha-button>
        </div>
      </ha-dialog>
    `}};at.styles=[pe,D`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    /* shared native-field scaffold from nativeFieldStyles; the prompt input
       follows the message text, hence the extra top margin here */
    .field { margin-top: 12px; }
    .content {
      padding: 8px 0;
      min-width: 280px;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    ha-textfield {
      display: block;
    }
    ha-button.danger {
      --mdc-theme-primary: var(--error-color, #f44336);
    }
  `],u([$({attribute:!1})],at.prototype,"hass",2),u([m()],at.prototype,"_open",2),u([m()],at.prototype,"_title",2),u([m()],at.prototype,"_message",2),u([m()],at.prototype,"_confirmText",2),u([m()],at.prototype,"_danger",2),u([m()],at.prototype,"_inputLabel",2),u([m()],at.prototype,"_inputType",2),u([m()],at.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",at);var rt=class extends R{constructor(){super(...arguments);this.objects=[];this._summary=null;this._loaded=!1;this._busy=!1;this._error="";this._query="";this._results=[];this._expanded=!1;this._initiallyLoaded=!1;this._searchTimer=0}get _lang(){return P(this.hass)}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._initiallyLoaded&&(this._initiallyLoaded=!0,this._load(),Y(this._lang).then(()=>this.requestUpdate()))}async _load(){this._busy=!0;try{this._summary=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/storage"}),this._error=""}catch(t){this._error=S(t,this._lang)}finally{this._loaded=!0,this._busy=!1}}_nameFor(t){return this.objects.find(i=>i.object?.id===t)?.object?.name||t.slice(0,8)}_entryFor(t){return this.objects.find(e=>e.object?.id===t)?.entry_id}_toggle(){this._expanded=!this._expanded}_openObject(t){this.dispatchEvent(new CustomEvent("open-object",{detail:{entry_id:t},bubbles:!0,composed:!0}))}_onSearch(t){this._query=t.target.value,clearTimeout(this._searchTimer),this._searchTimer=window.setTimeout(()=>{this._doSearch()},250)}async _doSearch(){let t=this._query.trim();if(!t){this._results=[];return}try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/search",query:t});this._results=e.results||[]}catch(e){this._error=S(e,this._lang),this._results=[]}}async _openResult(t){if(t.kind==="weblink"){W(t.url)&&window.open(t.url,"_blank","noopener");return}try{await vt(this.hass,t.id)}catch(e){this._error=S(e,this._lang)}}_renderResult(t,e){return o`
      <div class="obj-row result-row" title=${s("doc_open",e)} @click=${()=>this._openResult(t)}>
        <ha-icon icon=${t.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"}></ha-icon>
        <div class="result-info">
          <div class="result-title">${bt(t)}</div>
          <div class="result-obj">${t.object_name}</div>
        </div>
        <ha-icon class="result-open" icon=${t.kind==="weblink"?"mdi:open-in-new":"mdi:eye-outline"}></ha-icon>
      </div>
    `}render(){if(!this._loaded||!this._summary)return d;let t=this._summary;if(t.document_count===0)return d;let e=this._lang,i=Object.entries(t.by_object).filter(([,a])=>a.files>0||a.links>0).map(([a,l])=>({id:a,name:this._nameFor(a),entry:this._entryFor(a),...l})).sort((a,l)=>l.bytes-a.bytes);return o`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <button
              class="toggle"
              @click=${this._toggle}
              aria-expanded=${this._expanded?"true":"false"}
              aria-label=${s("doc_storage_title",e)}
            >
              <ha-icon class="chevron" icon=${this._expanded?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
              <span class="emoji">🗄️</span>
              <span class="title-text">${s("doc_storage_title",e)}</span>
              <span class="header-summary">
                ${pt(t.total_bytes)}
                ${t.dedup_savings_bytes>0?o`<span class="saved">−${pt(t.dedup_savings_bytes)}</span>`:d}
              </span>
            </button>
            <button
              class="icon-btn"
              title=${s("doc_storage_refresh",e)}
              ?disabled=${this._busy}
              @click=${this._load}
            >
              <ha-icon icon="mdi:refresh"></ha-icon>
            </button>
          </div>

          ${this._expanded?o`
                <div class="body">
                  <div class="totals">
                    <div class="stat">
                      <div class="stat-value">${pt(t.total_bytes)}</div>
                      <div class="stat-label">
                        <ha-icon icon="mdi:file-document-outline"></ha-icon> ${t.file_count}
                        <ha-icon icon="mdi:link-variant"></ha-icon> ${t.link_count}
                      </div>
                    </div>
                    ${t.dedup_savings_bytes>0?o`<div class="stat">
                          <div class="stat-value saved">−${pt(t.dedup_savings_bytes)}</div>
                          <div class="stat-label">${s("doc_storage_saved",e)}</div>
                        </div>`:d}
                  </div>

                  <div class="doc-search">
                    <ha-icon icon="mdi:magnify"></ha-icon>
                    <input
                      type="search"
                      aria-label=${s("doc_search",e)}
                      placeholder=${s("doc_search",e)}
                      .value=${this._query}
                      @input=${this._onSearch}
                    />
                  </div>

                  ${this._error?o`<div class="error">${this._error}</div>`:d}

                  ${this._query.trim()?this._results.length?o`<div class="obj-list">${this._results.map(a=>this._renderResult(a,e))}</div>`:o`<div class="search-empty">${s("doc_search_none",e)}</div>`:i.length?o`<div class="obj-list">${i.map(a=>this._renderObjRow(a,e))}</div>`:d}
                </div>
              `:d}
        </div>
      </ha-card>
    `}_renderObjRow(t,e){let i=t.entry;return o`
      <div
        class="obj-row ${i?"clickable":""}"
        role=${i?"button":d}
        tabindex=${i?"0":d}
        aria-label=${i?t.name:d}
        @click=${i?()=>this._openObject(i):void 0}
        @keydown=${i?a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),this._openObject(i))}:void 0}
      >
        <span class="obj-name">${t.name}</span>
        <span class="obj-meta">
          ${t.files>0?o`<ha-icon icon="mdi:file-document-outline"></ha-icon>${t.files}`:d}
          ${t.links>0?o`<ha-icon icon="mdi:link-variant"></ha-icon>${t.links}`:d}
        </span>
        <span class="obj-size">${pt(t.bytes)}</span>
        ${i?o`<ha-icon class="obj-go" icon="mdi:chevron-right"></ha-icon>`:d}
      </div>
    `}};rt.styles=D`
    ha-card { margin-top: 16px; }
    .card-content { padding: 16px; }
    .doc-search {
      display: flex; align-items: center; gap: 6px; margin: 10px 0 4px;
      padding: 2px 10px; border-radius: 8px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      border: 1px solid var(--divider-color);
    }
    .doc-search ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color, #888); }
    .doc-search input {
      flex: 1; border: none; background: transparent; font: inherit; outline: none;
      color: var(--primary-text-color); padding: 6px 0;
    }
    .result-row { cursor: pointer; }
    .result-row > ha-icon { color: var(--primary-color); --mdc-icon-size: 20px; flex: none; }
    .result-info { flex: 1; min-width: 0; }
    .result-title { font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .result-obj { font-size: 12px; color: var(--secondary-text-color, #888); }
    .result-open { color: var(--secondary-text-color, #888); --mdc-icon-size: 18px; flex: none; }
    .search-empty { color: var(--secondary-text-color, #888); font-size: 13px; padding: 8px 2px; }
    .header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .toggle {
      display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;
      background: none; border: none; padding: 4px 0; margin: 0; cursor: pointer;
      font: inherit; color: var(--primary-text-color); text-align: left;
    }
    .toggle:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; border-radius: 6px; }
    .chevron { --mdc-icon-size: 22px; color: var(--secondary-text-color, #888); flex: none; }
    .title-text { font-size: 16px; font-weight: 500; }
    .header-summary {
      margin-left: auto; display: flex; align-items: center; gap: 8px;
      font-size: 14px; font-weight: 600; white-space: nowrap;
    }
    .header-summary .saved { color: var(--success-color, #4caf50); font-weight: 500; }
    .emoji { font-size: 18px; }
    .body { margin-top: 4px; }
    .totals { display: flex; gap: 24px; margin: 12px 0 8px; flex-wrap: wrap; }
    .stat-value { font-size: 22px; font-weight: 600; }
    .stat-value.saved { color: var(--success-color, #4caf50); }
    .stat-label {
      font-size: 12px; color: var(--secondary-text-color, #888);
      display: flex; align-items: center; gap: 4px;
    }
    .stat-label ha-icon { --mdc-icon-size: 15px; }
    .obj-list { display: flex; flex-direction: column; gap: 2px; margin-top: 8px; }
    .obj-row {
      display: flex; align-items: center; gap: 10px;
      padding: 6px 8px; border-radius: 6px;
    }
    .obj-row:nth-child(odd) { background: var(--secondary-background-color, rgba(0,0,0,0.04)); }
    .obj-row.clickable { cursor: pointer; }
    .obj-row.clickable:hover { background: var(--secondary-background-color, rgba(0,0,0,0.10)); }
    .obj-row.clickable:focus-visible { outline: 2px solid var(--primary-color); outline-offset: -2px; }
    .obj-go { --mdc-icon-size: 18px; color: var(--secondary-text-color, #888); flex: none; }
    .obj-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; }
    .obj-meta {
      display: flex; align-items: center; gap: 4px;
      color: var(--secondary-text-color, #888); font-size: 13px;
    }
    .obj-meta ha-icon { --mdc-icon-size: 15px; }
    .obj-size { font-variant-numeric: tabular-nums; font-size: 13px; min-width: 64px; text-align: right; }
    .icon-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; border-radius: 8px; cursor: pointer;
      background: transparent; border: none; color: var(--primary-text-color);
    }
    .icon-btn:hover { background: var(--secondary-background-color, rgba(0,0,0,0.06)); }
    .icon-btn[disabled] { opacity: 0.4; pointer-events: none; }
    .error { color: var(--error-color, #f44336); font-size: 13px; margin-top: 6px; }
  `,u([$({attribute:!1})],rt.prototype,"hass",2),u([$({attribute:!1})],rt.prototype,"objects",2),u([m()],rt.prototype,"_summary",2),u([m()],rt.prototype,"_loaded",2),u([m()],rt.prototype,"_busy",2),u([m()],rt.prototype,"_error",2),u([m()],rt.prototype,"_query",2),u([m()],rt.prototype,"_results",2),u([m()],rt.prototype,"_expanded",2);customElements.get("maintenance-storage-section-card")||customElements.define("maintenance-storage-section-card",rt);var ui=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"],lt=class extends R{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId="";this._values=new Array(12).fill("");this._save=async()=>{let t=this._buildOverrides();if(t!==null){this._loading=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:t}),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved"))}catch(e){this._error=S(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}};this._clearAll=async()=>{this._loading=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:{}}),this._values=new Array(12).fill(""),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved"))}catch(t){this._error=S(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}get _lang(){return P(this.hass)}open(t,e,i){if(this._entryId=t,this._taskId=e,this._values=new Array(12).fill(""),i)for(let[a,l]of Object.entries(i)){let p=parseInt(a,10);p>=1&&p<=12&&typeof l=="number"&&(this._values[p-1]=l.toString())}this._error="",this._open=!0}_close(){this._open=!1}_buildOverrides(){let t={};for(let e=0;e<12;e++){let i=this._values[e].trim();if(!i)continue;let a=parseFloat(i);if(Number.isNaN(a))return this._error=`${s("month_"+["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][e],this._lang)}: ${s("seasonal_override_invalid",this._lang)}`,null;if(a<.1||a>5)return this._error=s("seasonal_override_range",this._lang),null;t[e+1]=a}return t}render(){if(!this._open)return o``;let t=this._lang;return o`
      <ha-dialog open @closed=${this._close} heading="${s("seasonal_overrides_title",t)}">
        <div class="content">
          <p class="hint">${s("seasonal_overrides_hint",t)}</p>
          ${this._error?o`<div class="error">${this._error}</div>`:d}
          <div class="months">
            ${ui.map((e,i)=>o`
              <label class="month">
                <span class="mn">${s(e,t)}</span>
                <input type="number" step="0.1" min="0.1" max="5.0"
                  placeholder="1.0"
                  .value=${this._values[i]}
                  @input=${a=>{let l=[...this._values];l[i]=a.target.value,this._values=l}} />
              </label>
            `)}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._clearAll} .disabled=${this._loading}>
            ${s("clear_all",t)}
          </ha-button>
          <div class="spacer"></div>
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",t)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading}>
            ${this._loading?s("saving",t):s("save",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};lt.styles=D`
    .content {
      min-width: 320px;
      max-width: 480px;
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
      margin: 0 0 12px 0;
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
      margin-bottom: 8px;
    }
    .months {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .month {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .mn {
      min-width: 70px;
      font-size: 14px;
    }
    input[type="number"] {
      flex: 1;
      padding: 6px 8px;
      font-size: 14px;
      border-radius: 4px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .dialog-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 16px;
    }
    .spacer { flex: 1; }
  `,u([$({attribute:!1})],lt.prototype,"hass",2),u([m()],lt.prototype,"_open",2),u([m()],lt.prototype,"_loading",2),u([m()],lt.prototype,"_error",2),u([m()],lt.prototype,"_entryId",2),u([m()],lt.prototype,"_taskId",2),u([m()],lt.prototype,"_values",2);customElements.get("maintenance-seasonal-overrides-dialog")||customElements.define("maintenance-seasonal-overrides-dialog",lt);var ot=class extends R{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._groupId=null;this._name="";this._description="";this._selected=new Set;this._toggleTask=(t,e)=>{let i=`${t}:${e}`,a=new Set(this._selected);a.has(i)?a.delete(i):a.add(i),this._selected=a};this._save=async()=>{let t=this._name.trim();if(!t){this._error=s("group_name_required",this._lang);return}this._loading=!0,this._error="";try{let e=this._buildTaskRefs();this._groupId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/update",group_id:this._groupId,name:t,description:this._description,task_refs:e}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/create",name:t,description:this._description,task_refs:e}),this._open=!1,this.dispatchEvent(new CustomEvent("group-saved"))}catch(e){this._error=S(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}get _lang(){return P(this.hass)}openCreate(){this._reset(),this._open=!0}openEdit(t,e){this._reset(),this._groupId=t,this._name=e.name,this._description=e.description||"",this._selected=new Set(e.task_refs.map(i=>`${i.entry_id}:${i.task_id}`)),this._open=!0}_reset(){this._groupId=null,this._name="",this._description="",this._selected=new Set,this._error=""}_close(){this._open=!1}_buildTaskRefs(){return[...this._selected].map(t=>{let[e,i]=t.split(":",2);return{entry_id:e,task_id:i}})}render(){if(!this._open)return o``;let t=this._lang,e=this._groupId?s("edit_group",t):s("new_group",t);return o`
      <ha-dialog open @closed=${this._close} heading="${e}">
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:d}
          <ms-textfield
            label="${s("name",t)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("description_optional",t)}"
            .value=${this._description}
            @input=${i=>this._description=i.target.value}
          ></ms-textfield>

          <div class="section-title">${s("group_select_tasks",t)}</div>
          ${this.objects.length===0?o`<div class="hint">${s("no_objects",t)}</div>`:o`
              <div class="objects">
                ${[...this.objects].sort((i,a)=>i.object.name.localeCompare(a.object.name)).map(i=>o`
                  <div class="object-block">
                    <div class="object-name">${i.object.name}</div>
                    ${i.tasks.length===0?o`<div class="hint small">${s("no_tasks_short",t)}</div>`:[...i.tasks].sort((a,l)=>a.name.localeCompare(l.name)).map(a=>{let l=`${i.entry_id}:${a.id}`,p=this._selected.has(l);return o`
                          <label class="task-row">
                            <input type="checkbox"
                              .checked=${p}
                              @change=${()=>this._toggleTask(i.entry_id,a.id)} />
                            <span>${a.name}</span>
                          </label>
                        `})}
                  </div>
                `)}
              </div>
            `}
          <div class="selected-count">
            ${s("selected",t)}: ${this._selected.size}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",t)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading||!this._name.trim()}>
            ${this._loading?s("saving",t):s("save",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};ot.styles=D`
    .content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: min(360px, calc(100vw - 24px));
      max-width: 520px;
      max-height: 60vh;
      overflow-y: auto;
    }
    @media (max-width: 600px) {
      .content {
        min-width: 0;
        max-width: none;
        max-height: none;
      }
    }
    ha-textfield { display: block; }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 500;
      margin-top: 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--divider-color);
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .hint.small { font-size: 12px; padding-left: 12px; }
    .objects { display: flex; flex-direction: column; gap: 8px; }
    .object-block {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 8px;
    }
    .object-name {
      font-weight: 500;
      font-size: 13px;
      margin-bottom: 4px;
    }
    .task-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 3px 0;
      font-size: 13px;
      cursor: pointer;
    }
    .task-row input { cursor: pointer; }
    .selected-count {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
  `,u([$({attribute:!1})],ot.prototype,"hass",2),u([$({attribute:!1})],ot.prototype,"objects",2),u([m()],ot.prototype,"_open",2),u([m()],ot.prototype,"_loading",2),u([m()],ot.prototype,"_error",2),u([m()],ot.prototype,"_groupId",2),u([m()],ot.prototype,"_name",2),u([m()],ot.prototype,"_description",2),u([m()],ot.prototype,"_selected",2);customElements.get("maintenance-group-dialog")||customElements.define("maintenance-group-dialog",ot);var ht=class extends R{constructor(){super(...arguments);this._open=!1;this._busy=!1;this._error="";this._name="";this._views=[];this._filters=null;this._localeReady=!1;this._save=async()=>{let t=this._name.trim();if(!(!t||this._busy||!this._filters)){this._busy=!0,this._error="";try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/save",name:t,filters:this._filters});this._name="",this._emitChanged(e.views||[])}catch(e){this._error=S(e,this._lang)}finally{this._busy=!1}}};this._delete=async t=>{if(!this._busy){this._busy=!0,this._error="";try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/delete",view_id:t});this._emitChanged(e.views||[])}catch(e){this._error=S(e,this._lang)}finally{this._busy=!1}}}}get _lang(){return P(this.hass)}updated(t){t.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,Y(this._lang).then(()=>this.requestUpdate()))}async open(t,e){this._open=!0,this._error="",this._name="",this._filters=t,this._views=e}_close(){this._open=!1}_emitChanged(t){this._views=t,this.dispatchEvent(new CustomEvent("saved-views-changed",{bubbles:!0,composed:!0,detail:{views:t}}))}render(){if(!this._open)return o``;let t=this._lang;return o`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${e=>e.stopPropagation()}>
          <div class="title">${s("views_dialog_title",t)}</div>
          <div class="hint">${s("views_dialog_hint",t)}</div>
          ${this._error?o`<div class="error">${this._error}</div>`:d}

          <div class="save-row">
            <input
              class="name-input"
              type="text"
              .value=${this._name}
              placeholder=${s("views_name_placeholder",t)}
              maxlength="60"
              @input=${e=>this._name=e.target.value}
              @keydown=${e=>{e.key==="Enter"&&this._save()}}
            />
            <ha-button @click=${this._save} .disabled=${!this._name.trim()||this._busy}>
              ${s("views_save_current",t)}
            </ha-button>
          </div>

          ${this._views.length===0?o`<div class="empty">${s("views_none_yet",t)}</div>`:o`
                <div class="list">
                  ${this._views.map(e=>o`
                      <div class="row">
                        <span class="row-name">${e.name}</span>
                        <ha-icon-button
                          .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                          .label=${s("delete",t)}
                          @click=${()=>this._delete(e.id)}
                        ></ha-icon-button>
                      </div>
                    `)}
                </div>
              `}

          <div class="actions">
            <ha-button appearance="plain" @click=${this._close}>${s("close",t)}</ha-button>
          </div>
        </div>
      </div>
    `}};ht.styles=D`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .card {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: min(360px, calc(100vw - 24px));
      max-width: 480px;
      width: 90vw;
      max-height: 80vh;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
    .title {
      font-size: 18px;
      font-weight: 500;
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .save-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .name-input {
      flex: 1;
      padding: 8px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
    }
    .empty {
      color: var(--secondary-text-color);
      font-size: 14px;
      padding: 8px 0;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      overflow-y: auto;
      max-height: 50vh;
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 6px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
    }
    .row-name {
      font-size: 14px;
      font-weight: 500;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 8px;
    }
  `,u([$({attribute:!1})],ht.prototype,"hass",2),u([m()],ht.prototype,"_open",2),u([m()],ht.prototype,"_busy",2),u([m()],ht.prototype,"_error",2),u([m()],ht.prototype,"_name",2),u([m()],ht.prototype,"_views",2);customElements.get("maintenance-saved-views-dialog")||customElements.define("maintenance-saved-views-dialog",ht);var gi=60,mi=20,Be=30;function ae(r){let n=r.trigger_config??null;if(!n)return d;let t=n.type||"threshold",e=r.trigger_entity_info?.unit_of_measurement??"",i=0,a="";if(t==="threshold"){let c=r.trigger_current_value??null;if(c==null)return d;let h=n.trigger_above,g=n.trigger_below;if(h!=null){let v=g??0,_=h-v||1;i=Math.min(100,Math.max(0,(c-v)/_*100)),a=`${c.toFixed(1)} / ${h} ${e}`}else if(g!=null){let _=r.trigger_entity_info?.max??(g*2||100),y=_-g||1;i=Math.min(100,Math.max(0,(_-c)/y*100)),a=`${c.toFixed(1)} / ${g} ${e}`}else if(n.trigger_equals!=null||n.trigger_not_equals!=null){let v=n.trigger_equals!=null?`= ${n.trigger_equals}`:`\u2260 ${n.trigger_not_equals}`;a=`${c.toFixed(1)} (${v}${e?` ${e}`:""})`,i=r.trigger_active?100:0}else return d}else if(t==="counter"){let c=n.trigger_target_value||1,h;if(n.trigger_delta_mode?(h=r.trigger_current_delta??null,h==null&&r.trigger_baseline_value!=null&&r.trigger_current_value!=null&&(h=r.trigger_current_value-r.trigger_baseline_value)):h=r.trigger_current_value??null,h==null)return d;i=Math.min(100,Math.max(0,h/c*100)),a=`${h.toFixed(1)} / ${c} ${e}`}else if(t==="state_change"){let c=n.trigger_target_changes||1,h=r.trigger_current_value??null;if(h==null)return d;i=Math.min(100,Math.max(0,h/c*100)),a=`${Math.round(h)} / ${c}`}else if(t==="runtime"){let c=n.trigger_runtime_hours||100,h=r.trigger_current_value??null;if(h==null)return d;i=Math.min(100,Math.max(0,h/c*100)),a=`${h.toFixed(1)}h / ${c}h`}else if(t==="compound"){let c=n.compound_logic||n.operator||"AND",h=n.conditions?.length||0;a=`${c} (${h})`,i=r.trigger_active?100:0}else return d;let l=i>=100,p=i>90?"var(--error-color, #f44336)":i>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return o`
    <div class="trigger-progress">
      <div class="trigger-progress-bar">
        <div class="trigger-progress-fill${l?" overflow":""}" style="width:${i}%;background:${p}"></div>
      </div>
      <span class="trigger-progress-label">${a}</span>
    </div>
  `}function re(r,n,t){if(!r.trigger_config?.entity_id)return d;let e=r.trigger_config.entity_id,i=n.get(e)||[],a=[];if(i.length>=2)a=i.map(T=>({ts:T.ts,val:T.val}));else{if(!r.history)return d;for(let T of r.history)T.trigger_value!=null&&a.push({ts:new Date(T.timestamp).getTime(),val:T.trigger_value})}if(r.trigger_current_value!=null&&a.push({ts:Date.now(),val:r.trigger_current_value}),a.length<2)return d;a.sort((T,f)=>T.ts-f.ts);let l=gi,p=mi,c=a.map(T=>T.val),h=Math.min(...c),g=Math.max(...c),v=g-h||1;h-=v*.1,g+=v*.1;let _=a[0].ts,k=a[a.length-1].ts-_||1,j=T=>(T-_)/k*l,M=T=>2+(1-(T-h)/(g-h))*(p-4),E=a;if(E.length>Be){let T=Math.ceil(E.length/Be);E=E.filter((f,Q)=>Q%T===0||Q===E.length-1)}let w=E.map(T=>`${j(T.ts).toFixed(1)},${M(T.val).toFixed(1)}`).join(" "),z=r.trigger_active?"var(--error-color, #f44336)":"var(--primary-color)";return o`
    <svg class="mini-sparkline" viewBox="0 0 ${l} ${p}" preserveAspectRatio="none" role="img" aria-label="${s("chart_mini_sparkline",t)}">
      <polyline points="${w}" fill="none" stroke="${z}" stroke-width="1.5" stroke-linejoin="round" />
    </svg>
  `}function Ve(r,n){let t=n;if(r.days_until_due==null||!r.interval_days||r.interval_days<=0)return d;let{pct:e,overflow:i}=Bt(r.interval_days,r.days_until_due,r.interval_unit),a="var(--success-color, #4caf50)";return r.status==="overdue"?a="var(--error-color, #f44336)":r.status==="due_soon"&&(a="var(--warning-color, #ff9800)"),o`
    <div class="days-progress">
      <div class="days-progress-labels">
        <span>${r.last_performed?`${s("last_performed",t)}: ${V(r.last_performed,t)}`:""}</span>
        <span>${r.next_due?`${s("next_due",t)}: ${V(r.next_due,t)}`:""}</span>
      </div>
      <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(e)}" aria-valuemin="0" aria-valuemax="100" aria-label="${s("days_progress",t)}">
        <div class="days-progress-fill${i?" overflow":""}" style="width:${e}%;background:${a}"></div>
      </div>
      <div class="days-progress-text">${_t(r.days_until_due,t)}</div>
    </div>
  `}function Rt(r,n,t=4){if(!isFinite(r)||!isFinite(n))return{ticks:[],niceMin:0,niceMax:1};if(r===n){let h=Math.abs(r)*.1||1;r-=h,n+=h}let e=n-r,i=Math.pow(10,Math.floor(Math.log10(e/Math.max(1,t)))),a=i;for(let h of[1,2,5,10])if(a=i*h,e/a<=t+.5)break;let l=Math.floor(r/a)*a,p=Math.ceil(n/a)*a,c=[];for(let h=l;h<=p+a*1e-6;h+=a)c.push(Math.abs(h)<a*1e-9?0:h);return{ticks:c,niceMin:l,niceMax:p}}function ut(r){let n=Math.abs(r);return n>=1e6?jt((r/1e6).toFixed(n>=1e7?0:1))+"M":n>=1e4?jt((r/1e3).toFixed(0))+"k":n>=1e3?jt((r/1e3).toFixed(1))+"k":n>=100?r.toFixed(0):n>=10||n>=1?jt(r.toFixed(1)):n===0?"0":jt(r.toFixed(2))}function jt(r){return r.replace(/\.0+$/,"").replace(/(\.\d*[1-9])0+$/,"$1")}function wt(r,n,t){let e=r.toLocaleString(t,{maximumFractionDigits:Math.abs(r)>=100?0:1});return n?`${e} ${n}`:e}function St(r,n,t){let e=new Date(r),i=t?{month:"short",day:"numeric",year:"2-digit"}:{month:"short",day:"numeric"};return e.toLocaleDateString(n,i)}function oe(r,n){return new Date(r).toLocaleDateString(n,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function Kt(r,n){return new Date(r).getFullYear()!==new Date(n).getFullYear()}function Gt(r,n,t){if(t<2||n<=r)return[r,n];let e=[];for(let i=0;i<t;i++)e.push(r+(n-r)*i/(t-1));return e}var Qt=210,ct=46,gt=14,mt=12,Ue=14,_i=20+Ue,vi=[{days:7,key:"chart_range_7d"},{days:30,key:"chart_range_30d"},{days:90,key:"chart_range_90d"},{days:365,key:"chart_range_1y"}],N=class extends R{constructor(){super(...arguments);this.points=[];this.events=[];this.unit="";this.lang="en";this.thresholdAbove=null;this.thresholdBelow=null;this.targetValue=null;this.forceZero=!1;this.projection=null;this.rangeDays=30;this.showRange=!0;this.busy=!1;this.hideOutliers=!1;this.showOutlierToggle=!0;this._width=0;this._hover=null;this._ro=null}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(t=>{let e=Math.floor(t[0]?.contentRect?.width||0);e&&Math.abs(e-this._width)>2&&(this._width=e)}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=null}_emitRange(t){t!==this.rangeDays&&this.dispatchEvent(new CustomEvent("range-change",{detail:{days:t},bubbles:!0,composed:!0}))}_toggleOutliers(){this.dispatchEvent(new CustomEvent("outlier-toggle",{detail:{hide:!this.hideOutliers},bubbles:!0,composed:!0}))}render(){let t=this._width||320,e=[...this.points].sort((a,l)=>a.ts-l.ts),i=this.lang;return o`
      <div class="chart-wrap">
        ${this.showRange?o`<div class="range-chips" role="group">
              ${this.showOutlierToggle?o`<button
                    class="range-chip outlier-chip ${this.hideOutliers?"active":""}"
                    ?disabled=${this.busy}
                    title=${s("hide_outliers",i)}
                    @click=${()=>this._toggleOutliers()}
                  ><ha-icon icon="mdi:filter-variant"></ha-icon></button>`:d}
              ${vi.map(a=>o`<button
                  class="range-chip ${this.rangeDays===a.days?"active":""}"
                  ?disabled=${this.busy}
                  @click=${()=>this._emitRange(a.days)}
                >${s(a.key,i)}</button>`)}
            </div>`:d}
        ${e.length<2?o`<div class="chart-empty">
              <ha-icon icon="mdi:chart-line"></ha-icon> ${s("loading_chart",i)}
            </div>`:this._renderSvg(t,e)}
      </div>
    `}_renderSvg(t,e){let i=this.lang,a=t-ct-gt,l=Qt-_i,p=l-mt,c=1/0,h=-1/0;for(let b of e)c=Math.min(c,b.min??b.val),h=Math.max(h,b.max??b.val);this.thresholdAbove!=null&&(c=Math.min(c,this.thresholdAbove),h=Math.max(h,this.thresholdAbove)),this.thresholdBelow!=null&&(c=Math.min(c,this.thresholdBelow),h=Math.max(h,this.thresholdBelow)),this.targetValue!=null&&(c=Math.min(c,this.targetValue),h=Math.max(h,this.targetValue)),this.forceZero&&(c=Math.min(c,0));let g=(h-c||1)*.06,v=this.forceZero&&c>=0?0:c-g,{ticks:_,niceMin:y,niceMax:k}=Rt(v,h+g,4);this.forceZero&&c>=0&&y<0&&(y=0,_=_.filter(b=>b>=0));let j=e[0].ts,M=this.projection&&this.projection.length===2?this.projection[1].ts:null,E=M!=null?Math.max(e[e.length-1].ts,M):e[e.length-1].ts,w=E-j||1,z=Kt(j,E),T=b=>ct+(b-j)/w*a,f=b=>mt+(1-(b-y)/(k-y||1))*p,Q=e.map(b=>`${T(b.ts).toFixed(1)},${f(b.val).toFixed(1)}`).join(" "),et=`M${T(e[0].ts).toFixed(1)},${l} `+e.map(b=>`L${T(b.ts).toFixed(1)},${f(b.val).toFixed(1)}`).join(" ")+` L${T(e[e.length-1].ts).toFixed(1)},${l} Z`,it="",nt=e.filter(b=>b.min!=null&&b.max!=null);if(nt.length>=2){let b=nt.map(Z=>`${T(Z.ts).toFixed(1)},${f(Z.max).toFixed(1)}`),C=[...nt].reverse().map(Z=>`${T(Z.ts).toFixed(1)},${f(Z.min).toFixed(1)}`);it=`M${b[0]} `+b.slice(1).map(Z=>`L${Z}`).join(" ")+` L${C.join(" L")} Z`}let U=[];if(this.thresholdBelow!=null){let b=f(this.thresholdBelow);U.push({y:b,h:Math.max(0,l-b),lineY:b,label:`\u25BC ${ut(this.thresholdBelow)}`,labelY:Math.min(l-4,b+13)})}if(this.thresholdAbove!=null){let b=f(this.thresholdAbove);U.push({y:mt,h:Math.max(0,b-mt),lineY:b,label:`\u25B2 ${ut(this.thresholdAbove)}`,labelY:Math.max(mt+11,b-5)})}let dt=e[e.length-1],yt=(this.events||[]).filter(b=>b.ts>=j&&b.ts<=E),xt=Gt(j,E,Math.max(2,Math.min(5,Math.floor(a/110)+1))),B=this._hover;return o`
      <div class="svg-holder">
        <svg
          class="chart-svg"
          viewBox="0 0 ${t} ${Qt}"
          width=${t}
          height=${Qt}
          role="img"
          aria-label=${s("chart_sparkline",i)}
          @pointermove=${b=>this._onPointer(b,e,T,f,t)}
          @pointerdown=${b=>this._onPointer(b,e,T,f,t)}
          @pointerleave=${()=>this._hover=null}
        >
          <defs>
            <clipPath id="plot"><rect x="${ct}" y="${mt}" width="${a}" height="${p}" /></clipPath>
            ${U.length?H`<clipPath id="danger">${U.map(b=>H`<rect x="${ct}" y="${b.y.toFixed(1)}" width="${a}" height="${b.h.toFixed(1)}" />`)}</clipPath>`:d}
            <!-- Diagonal hatch so the danger zone reads without relying on the
                 red tint alone (dark-theme contrast + colour-blind support). -->
            <pattern id="dangerHatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
              <rect width="7" height="7" fill="var(--error-color, #f44336)" opacity="0.10" />
              <line x1="0" y1="0" x2="0" y2="7" stroke="var(--error-color, #f44336)" stroke-width="1.4" opacity="0.5" />
            </pattern>
          </defs>

          ${_.map(b=>{let C=f(b);return C<mt-1||C>l+1?d:H`
              <line x1="${ct}" y1="${C.toFixed(1)}" x2="${t-gt}" y2="${C.toFixed(1)}"
                stroke="var(--divider-color)" stroke-width="1" opacity="0.6" />
              <text x="${ct-7}" y="${(C+3.5).toFixed(1)}" text-anchor="end" class="tick-label">${ut(b)}</text>`})}

          ${U.map(b=>H`<rect x="${ct}" y="${b.y.toFixed(1)}" width="${a}" height="${b.h.toFixed(1)}"
              fill="url(#dangerHatch)" />`)}

          ${it?H`<path d="${it}" fill="var(--primary-color)" opacity="0.08" clip-path="url(#plot)" />`:d}
          <path d="${et}" fill="var(--primary-color)" opacity="0.10" clip-path="url(#plot)" />
          <polyline points="${Q}" fill="none" stroke="var(--primary-color)" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" clip-path="url(#plot)" />
          ${U.length?H`<polyline points="${Q}" fill="none" stroke="var(--error-color, #f44336)" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" clip-path="url(#danger)" />`:d}

          ${U.map(b=>H`
              <line x1="${ct}" y1="${b.lineY.toFixed(1)}" x2="${t-gt}" y2="${b.lineY.toFixed(1)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${t-gt-4}" y="${b.labelY.toFixed(1)}" text-anchor="end" class="zone-label">${b.label}</text>`)}

          ${this.targetValue!=null?H`<line x1="${ct}" y1="${f(this.targetValue).toFixed(1)}" x2="${t-gt}" y2="${f(this.targetValue).toFixed(1)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${t-gt-4}" y="${(f(this.targetValue)-5).toFixed(1)}" text-anchor="end" class="zone-label">◆ ${ut(this.targetValue)} ${this.unit}</text>`:d}

          ${this.projection&&this.projection.length===2?H`<line x1="${T(this.projection[0].ts).toFixed(1)}" y1="${f(this.projection[0].val).toFixed(1)}"
                x2="${Math.min(T(this.projection[1].ts),t-gt).toFixed(1)}" y2="${f(Math.max(y,Math.min(k,this.projection[1].val))).toFixed(1)}"
                stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.8" />`:d}

          ${xt.map((b,C)=>{let Z=T(b),ei=C===0?"start":C===xt.length-1?"end":"middle";return H`<text x="${Z.toFixed(1)}" y="${Qt-5}" text-anchor="${ei}" class="tick-label">${St(b,i,z)}</text>`})}

          <line x1="${ct}" y1="${l}" x2="${t-gt}" y2="${l}" stroke="var(--divider-color)" stroke-width="1" />

          ${yt.map(b=>{let C=T(b.ts),Z=b.type==="completed"?"var(--success-color, #4caf50)":b.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return H`
              <line x1="${C.toFixed(1)}" y1="${mt}" x2="${C.toFixed(1)}" y2="${l}" stroke="${Z}" stroke-width="1" opacity="0.14" />
              <rect x="${(C-1.5).toFixed(1)}" y="${l+3}" width="3" height="${Ue-6}" rx="1.5" fill="${Z}">
                <title>${oe(b.ts,i)}</title>
              </rect>`})}

          ${B?H`
                <line x1="${B.x.toFixed(1)}" y1="${mt}" x2="${B.x.toFixed(1)}" y2="${l}"
                  stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.7" />
                <circle cx="${B.x.toFixed(1)}" cy="${B.y.toFixed(1)}" r="4.5" fill="var(--primary-color)"
                  stroke="var(--card-background-color, #fff)" stroke-width="2" />`:H`<circle cx="${T(dt.ts).toFixed(1)}" cy="${f(dt.val).toFixed(1)}" r="4" fill="var(--primary-color)"
                stroke="var(--card-background-color, #fff)" stroke-width="1.5" />`}
        </svg>
        ${B?o`<div
              class="hover-chip"
              style="left:${Math.min(Math.max(B.x,70),t-70)}px"
            >
              <div class="hover-date">${oe(B.p.ts,i)}</div>
              <div class="hover-val">
                ${wt(B.p.val,this.unit,i)}
                ${B.p.min!=null&&B.p.max!=null?o`<span class="hover-range">(${ut(B.p.min)}–${ut(B.p.max)})</span>`:d}
              </div>
            </div>`:d}
      </div>
    `}_onPointer(t,e,i,a,l){let c=t.currentTarget.getBoundingClientRect(),h=(t.clientX-c.left)/c.width*l;if(h<ct-8||h>l-gt+8){this._hover=null;return}let g=e[0],v=1/0;for(let _ of e){let y=Math.abs(i(_.ts)-h);y<v&&(v=y,g=_)}this._hover={x:i(g.ts),y:a(g.val),p:g}}};N.styles=D`
    :host { display: block; width: 100%; }
    .chart-wrap { position: relative; }
    .range-chips { display: flex; gap: 4px; justify-content: flex-end; margin-bottom: 2px; }
    .range-chip {
      font: inherit; font-size: 11.5px; padding: 2px 9px; border-radius: 12px; cursor: pointer;
      border: 1px solid var(--divider-color); background: transparent;
      color: var(--secondary-text-color);
    }
    /* Outlier toggle sits left of the range chips as an icon button. */
    .outlier-chip { margin-right: auto; padding: 2px 7px; display: inline-flex; align-items: center; }
    .outlier-chip ha-icon { --mdc-icon-size: 15px; }
    .range-chip.active {
      background: var(--primary-color); border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .range-chip[disabled] { opacity: 0.5; pointer-events: none; }
    .svg-holder { position: relative; }
    .chart-svg { display: block; touch-action: pan-y; }
    .tick-label { fill: var(--secondary-text-color); font-size: 10.5px; }
    .zone-label { fill: var(--error-color, #f44336); font-size: 11px; font-weight: 600; }
    .chart-empty {
      display: flex; align-items: center; justify-content: center; gap: 8px; height: 120px;
      color: var(--secondary-text-color); font-size: 12.5px;
    }
    .chart-empty ha-icon { --mdc-icon-size: 17px; }
    .hover-chip {
      position: absolute; top: 0; transform: translateX(-50%);
      background: var(--card-background-color, #fff); border: 1px solid var(--divider-color);
      border-radius: 8px; padding: 4px 9px; pointer-events: none; white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); z-index: 3;
    }
    .hover-date { font-size: 10.5px; color: var(--secondary-text-color); }
    .hover-val { font-size: 12.5px; font-weight: 600; color: var(--primary-text-color); }
    .hover-range { font-weight: 400; color: var(--secondary-text-color); font-size: 11px; }
  `,u([$({attribute:!1})],N.prototype,"points",2),u([$({attribute:!1})],N.prototype,"events",2),u([$()],N.prototype,"unit",2),u([$()],N.prototype,"lang",2),u([$({attribute:!1})],N.prototype,"thresholdAbove",2),u([$({attribute:!1})],N.prototype,"thresholdBelow",2),u([$({attribute:!1})],N.prototype,"targetValue",2),u([$({type:Boolean})],N.prototype,"forceZero",2),u([$({attribute:!1})],N.prototype,"projection",2),u([$({attribute:!1})],N.prototype,"rangeDays",2),u([$({type:Boolean})],N.prototype,"showRange",2),u([$({type:Boolean})],N.prototype,"busy",2),u([$({type:Boolean})],N.prototype,"hideOutliers",2),u([$({type:Boolean})],N.prototype,"showOutlierToggle",2),u([m()],N.prototype,"_width",2),u([m()],N.prototype,"_hover",2);customElements.get("maintenance-trigger-chart")||customElements.define("maintenance-trigger-chart",N);function qe(r){let n=(r??"").trim().toLowerCase();return n==="on"||n==="open"||n==="true"?1:n==="off"||n==="closed"||n==="false"?0:null}function bi(r,n,t){if(r.length<2)return null;let e=t.now??Date.now(),i=Math.max(0,n.trigger_for_minutes??0)*6e4,a=n.trigger_from_state?qe(n.trigger_from_state):null,l=n.trigger_to_state?qe(n.trigger_to_state):null;if(n.trigger_from_state&&a===null||n.trigger_to_state&&l===null)return null;let p=[...r].sort((w,z)=>w.ts-z.ts),c=[];for(let w of p){let z=c[c.length-1];(!z||z.level!==w.val)&&c.push({start:w.ts,level:w.val})}let h=w=>(w+1<c.length?c[w+1].start:e)-c[w].start>=i,g=(w,z,T)=>{let f=w[w.length-1];f&&f.val!==T&&w.push({ts:z,val:f.val}),w.push({ts:z,val:T})};if((n.trigger_target_changes??1)===1&&l!==null){let w=[];c.forEach((T,f)=>g(w,T.start,T.level===l&&h(f)?1:0));let z=w[w.length-1]?.val??0;return w.push({ts:e,val:z}),{points:w,mode:"alarm"}}let _=t.since??c[0].start,y=0,k=[];for(let w=1;w<c.length;w++){let z=c[w-1],T=c[w];a!==null&&z.level!==a||l!==null&&T.level!==l||!h(w)||T.start<_||(y+=1,k.push(T.start))}let j=Math.max(0,(t.current??y)-y),M=[{ts:Math.max(_,c[0].start),val:j}],E=j;for(let w of k)E+=1,g(M,w,E);return M.push({ts:e,val:E}),{points:M,mode:"count"}}function fi(r){if(r.length<4)return r;let n=r.map(h=>h.val).sort((h,g)=>h-g),t=h=>{let g=(n.length-1)*h,v=Math.floor(g),_=Math.ceil(g);return n[v]+(n[_]-n[v])*(g-v)},e=t(.25),i=t(.75),a=i-e;if(a===0)return r;let l=e-1.5*a,p=i+1.5*a,c=r.filter(h=>h.val>=l&&h.val<=p);return c.length>=2?c:r}function We(r,n){let t=r.trigger_config;if(!t)return d;let e=n.lang,i=r.trigger_entity_info,a=r.trigger_entity_infos,l=i?.friendly_name||t.entity_id||"\u2014",p=t.entity_id||"",c=t.entity_ids||(p?[p]:[]),h=i?.unit_of_measurement||"",g=r.trigger_current_value,v=t.type||"threshold",_=c.length>1,y=yi(r,h,n);return o`
    <h3>${s("trigger",e)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${_?o`
            <div class="trigger-entity-name">${c.length} ${s("entities",e)} (${t.entity_logic||"any"})</div>
            <div class="trigger-entity-id">${c.map((k,j)=>o`${j>0?", ":""}<span class="entity-link" @click=${M=>Mt(M,k)}>${k}</span>`)}${t.attribute?` \u2192 ${t.attribute}`:""}</div>
          `:o`
            <div class="trigger-entity-name">${l}</div>
            <div class="trigger-entity-id">${p?o`<span class="entity-link" @click=${k=>Mt(k,p)}>${p}</span>`:""}${t.attribute?` \u2192 ${t.attribute}`:""}</div>
          `}
        </div>
        <span class="status-badge ${r.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
          ${r.trigger_active?s("triggered",e):s("ok",e)}
        </span>
      </div>

      ${y?xi(y,e):g!=null?o`
              <div class="trigger-value-row">
                <span class="trigger-current ${r.trigger_active?"active":""}">${typeof g=="number"?wt(g,"",e):g}</span>
                ${h?o`<span class="trigger-unit">${h}</span>`:d}
              </div>
            `:d}

      <div class="trigger-limits">
        ${v==="threshold"?o`
          ${t.trigger_above!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_above",e)}: ${t.trigger_above} ${h}</span>`:d}
          ${t.trigger_below!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_below",e)}: ${t.trigger_below} ${h}</span>`:d}
          ${t.trigger_equals!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> = ${t.trigger_equals} ${h}</span>`:d}
          ${t.trigger_not_equals!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ≠ ${t.trigger_not_equals} ${h}</span>`:d}
          ${t.trigger_for_minutes?o`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${s("for_minutes",e)}: ${t.trigger_for_minutes}</span>`:d}
        `:d}
        ${v==="state_change"?o`
          ${t.trigger_target_changes!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("target_changes",e)}: ${t.trigger_target_changes}</span>`:d}
        `:d}
        ${v==="runtime"?o`
          ${t.trigger_runtime_hours!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("runtime_hours",e)}: ${t.trigger_runtime_hours}h</span>`:d}
        `:d}
        ${v==="compound"?o`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("compound_logic",e)}: ${t.compound_logic||t.operator||"AND"}</span>
          ${(t.conditions||[]).map((k,j)=>o`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${j+1}. ${s(k.type||"unknown",e)}: ${k.entity_id?o`<span class="entity-link" @click=${M=>Mt(M,k.entity_id)}>${k.entity_id}</span>`:""}</span>
          `)}
        `:d}
      </div>

      ${a&&a.length>1?o`
        <div class="trigger-entity-list">
          ${a.map(k=>o`
            <span class="trigger-entity-id">${k.friendly_name} (<span class="entity-link" @click=${j=>Mt(j,k.entity_id)}>${k.entity_id}</span>)</span>
          `)}
        </div>
      `:d}

      ${$i(r,h,n)}
    </div>
  `}function yi(r,n,t){let e=r.trigger_config,i=r.trigger_current_value;if(!e||i==null)return null;switch(e.type||"threshold"){case"counter":{let a=e.trigger_target_value;if(a==null||a<=0)return null;if(!e.trigger_delta_mode)return{progress:Math.max(0,i),target:a,unit:n,meter:null};let l=Ye(r,Ke(r,t));return{progress:Math.max(0,i-(l?.value??i)),target:a,unit:n,meter:i}}case"state_change":{let a=e.trigger_target_changes;return a==null||a<=0?null:{progress:Math.max(0,i),target:a,unit:"",meter:null}}case"runtime":{let a=e.trigger_runtime_hours;return a==null||a<=0?null:{progress:Math.max(0,i),target:a,unit:"h",meter:null}}}return null}function Ye(r,n){if(r.trigger_baseline_value!=null)return{value:r.trigger_baseline_value,ts:Zt(r)};if(!n.length)return null;let t=Zt(r);if(t==null)return{value:n[0].val,ts:null};let e=n[0],i=Math.abs(n[0].ts-t);for(let a of n){let l=Math.abs(a.ts-t);l<i&&(e=a,i=l)}return{value:e.val,ts:t}}function Zt(r){let n=[...r.history].filter(t=>t.type==="completed"||t.type==="reset").sort((t,e)=>new Date(e.timestamp).getTime()-new Date(t.timestamp).getTime())[0];return n?new Date(n.timestamp).getTime():null}function xi(r,n){let t=Math.min(999,Math.round(r.progress/r.target*100)),e=t>=100?"over":t>=75?"near":"ok";return o`
    <div class="counter-progress">
      <div class="counter-progress-nums">
        <span class="counter-progress-main">${wt(r.progress,"",n)}<span class="counter-progress-target"> / ${wt(r.target,r.unit,n)}</span></span>
        <span class="counter-progress-pct ${e}">${t} %</span>
      </div>
      <div class="counter-progress-bar" role="progressbar" aria-valuenow=${t} aria-valuemin="0" aria-valuemax="100">
        <div class="counter-progress-fill ${e}" style="width:${Math.min(100,t)}%"></div>
      </div>
      <div class="counter-progress-caption">
        ${s("chart_since_service",n)}${r.meter!=null?o` · ${s("current",n)}: ${wt(r.meter,r.unit,n)}`:d}
      </div>
    </div>
  `}function Ke(r,n){let t=r.trigger_config;if(!t)return[];let e=t.type||"threshold",i=t.entity_id||"",a=e==="runtime"?[]:n.detailStatsData.get(i)||[],l=n.isCounterEntity(t),p=[];if(a.length>=2)for(let h of a){let g={ts:h.ts,val:h.val};!l&&h.min!=null&&h.max!=null&&(g.min=h.min,g.max=h.max),p.push(g)}else for(let h of r.history)h.trigger_value!=null&&p.push({ts:new Date(h.timestamp).getTime(),val:h.trigger_value});let c=!!i&&!!n.historyFallbackIds?.has(i)&&a.length>=2;return r.trigger_current_value!=null&&!c&&p.push({ts:Date.now(),val:r.trigger_current_value}),p.sort((h,g)=>h.ts-g.ts),p}function $i(r,n,t){let e=r.trigger_config;if(!e)return d;let i=e.type||"threshold",a=e.entity_id||"",l=Ke(r,t),p=null;i==="state_change"&&a&&t.historyFallbackIds?.has(a)&&(p=bi(l,e,{since:Zt(r),current:r.trigger_current_value??null}),p&&(l=p.points)),i==="runtime"&&e.trigger_runtime_hours&&r.trigger_current_value!=null&&(l=[{ts:Zt(r)??l[0]?.ts??Date.now()-864e5,val:0},{ts:Date.now(),val:Math.max(0,r.trigger_current_value)}]),t.hideOutliers&&(l=fi(l));let c=l.length<2&&!!a&&t.hasStatsService&&!t.detailStatsData.has(a);if(l.length<2&&!c)return d;let h=!!a&&t.detailStatsData.has(a)&&(t.detailStatsData.get(a)?.length??0)<2,g=Date.now()-t.rangeDays*864e5,v=l.filter(w=>w.ts>=g);v.length>=2&&(l=v);let _=null,y=!1;if(i==="counter"&&e.trigger_target_value!=null&&l.length){if(e.trigger_delta_mode){let w=Ye(r,l);if(w){if(w.ts!=null){let z=l.filter(T=>T.ts>=w.ts);z.length>=2&&(l=z)}l=l.map(z=>({...z,val:Math.max(0,z.val-w.value)}))}}_=e.trigger_target_value,y=!0}else i==="state_change"&&e.trigger_target_changes&&p?.mode!=="alarm"?(_=e.trigger_target_changes,y=!0):i==="runtime"&&e.trigger_runtime_hours&&(_=e.trigger_runtime_hours,y=!0);let k=null,j=r.degradation_rate,M=j!=null&&(e.trigger_below!=null&&e.trigger_above==null&&j>0||e.trigger_above!=null&&e.trigger_below==null&&j<0);if(_==null&&j!=null&&!M&&(r.degradation_trend!=="stable"||r.days_until_threshold!=null)&&r.degradation_trend!=="insufficient_data"&&l.length>=2){let w=l[l.length-1];k=[w,{ts:w.ts+30*864e5,val:w.val+j*30}]}let E=r.history.filter(w=>["completed","skipped","reset"].includes(w.type)).map(w=>({ts:new Date(w.timestamp).getTime(),type:w.type}));return o`
    <maintenance-trigger-chart
      .points=${c?[]:l}
      .events=${E}
      .unit=${n}
      .lang=${t.lang}
      .thresholdAbove=${i==="threshold"?e.trigger_above??null:null}
      .thresholdBelow=${i==="threshold"?e.trigger_below??null:null}
      .targetValue=${_}
      .forceZero=${y}
      .projection=${k}
      .rangeDays=${t.rangeDays}
      .hideOutliers=${t.hideOutliers}
      .busy=${c}
      @range-change=${w=>t.setRangeDays(w.detail.days)}
      @outlier-toggle=${w=>t.setHideOutliers(w.detail.hide)}
    ></maintenance-trigger-chart>
    ${c?d:a&&t.historyFallbackIds?.has(a)&&!h?o`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${s(p?.mode==="alarm"?"chart_history_alarm":p?.mode==="count"?"chart_history_count":"chart_history_fallback",t.lang)}
        </div>`:h?o`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${s("chart_no_stats",t.lang)}
        </div>`:d}
  `}var wi=200,Ot=10,ki=22;function Ge(r,n,t,e){let i=r.history.filter(p=>p.type==="completed"&&(p.cost!=null||p.duration!=null));if(i.length<2)return d;let a=i.some(p=>(p.cost??0)>0),l=i.some(p=>(p.duration??0)>0);return!a&&!l?d:o`
    <div class="cost-duration-card">
      <div class="card-header">
        <h3>${s("cost_duration_chart",n)}</h3>
        <div class="toggle-buttons">
          ${a?o`<button
            class="toggle-btn ${t==="cost"?"active":""}"
            @click=${()=>e("cost")}>
            ${s("cost",n)}
          </button>`:d}
          ${a&&l?o`<button
            class="toggle-btn ${t==="both"?"active":""}"
            @click=${()=>e("both")}>
            ${s("both",n)}
          </button>`:d}
          ${l?o`<button
            class="toggle-btn ${t==="duration"?"active":""}"
            @click=${()=>e("duration")}>
            ${s("duration",n)}
          </button>`:d}
        </div>
      </div>
      ${Ti(r,n,t)}
    </div>
  `}function Ti(r,n,t){let e=r.history.filter(b=>b.type==="completed"&&(b.cost!=null||b.duration!=null)).map(b=>({ts:new Date(b.timestamp).getTime(),cost:b.cost??0,duration:b.duration??0})).sort((b,C)=>b.ts-C.ts);if(e.length<2)return d;let i=e.some(b=>b.cost>0),a=e.some(b=>b.duration>0);if(!i&&!a)return d;let l=t!=="duration"&&i,p=t!=="cost"&&a,c=l||!p&&i,h=p||!l&&a,g=640,v=wi,_=c?44:12,y=h?44:12,k=g-_-y,j=v-ki,M=j-Ot,E=e[0].ts,w=e[e.length-1].ts,z=(w-E||864e5)*.05,T=E-z,f=w+z,Q=Kt(E,w),et=b=>_+(b-T)/(f-T)*k,it=Rt(0,Math.max(...e.map(b=>b.cost))||1,3),nt=Rt(0,Math.max(...e.map(b=>b.duration))||1,3),U=b=>Ot+(1-b/(it.niceMax||1))*M,dt=b=>Ot+(1-b/(nt.niceMax||1))*M,yt=e.length>1?Math.min(...e.slice(1).map((b,C)=>et(b.ts)-et(e[C].ts))):k,xt=Math.max(6,Math.min(22,yt*.55)),B=Gt(E,w,Math.max(2,Math.min(4,e.length)));return o`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${g} ${v}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_history",n)}">
        ${c?it.ticks.map(b=>{let C=U(b);return C<Ot-1||C>j+1?d:H`
            <line x1="${_}" y1="${C.toFixed(1)}" x2="${g-y}" y2="${C.toFixed(1)}" stroke="var(--divider-color)" stroke-width="1" opacity="0.55" />
            <text x="${_-6}" y="${(C+3.5).toFixed(1)}" text-anchor="end" fill="var(--primary-color)" font-size="10.5">${ut(b)}€</text>`}):d}
        ${h?nt.ticks.map(b=>{let C=dt(b);return C<Ot-1||C>j+1?d:H`<text x="${g-y+6}" y="${(C+3.5).toFixed(1)}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="10.5">${ut(b)}m</text>`}):d}

        ${c?e.filter(b=>b.cost>0).map(b=>H`
          <rect x="${(et(b.ts)-xt/2).toFixed(1)}" y="${U(b.cost).toFixed(1)}" width="${xt.toFixed(1)}" height="${(j-U(b.cost)).toFixed(1)}"
            fill="var(--primary-color)" opacity="0.6" rx="2">
            <title>${St(b.ts,n,!0)}: ${b.cost.toLocaleString(n)}€${b.duration?` \xB7 ${b.duration}m`:""}</title>
          </rect>
        `):d}
        ${h?H`
          <polyline points="${e.map(b=>`${et(b.ts).toFixed(1)},${dt(b.duration).toFixed(1)}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${e.map(b=>H`
            <circle cx="${et(b.ts).toFixed(1)}" cy="${dt(b.duration).toFixed(1)}" r="3.5" fill="var(--accent-color, #ff9800)">
              <title>${St(b.ts,n,!0)}: ${b.duration}m${b.cost?` \xB7 ${b.cost.toLocaleString(n)}\u20AC`:""}</title>
            </circle>
          `)}
        `:d}

        <line x1="${_}" y1="${j}" x2="${g-y}" y2="${j}" stroke="var(--divider-color)" stroke-width="1" />
        ${B.map((b,C)=>{let Z=C===0?"start":C===B.length-1?"end":"middle";return H`<text x="${et(b).toFixed(1)}" y="${v-6}" text-anchor="${Z}" fill="var(--secondary-text-color)" font-size="10">${St(b,n,Q)}</text>`})}
      </svg>
    </div>
    <div class="chart-legend">
      ${c?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${s("cost",n)}</span>`:d}
      ${h?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${s("duration",n)}</span>`:d}
    </div>
  `}var ft=class extends R{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await Ht(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?d:this._url?o`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:o`<div class="ph"></div>`}};ft.styles=D`
    .wrap { display: inline-block; margin-top: 4px; }
    img {
      max-width: 96px;
      max-height: 96px;
      border-radius: 6px;
      display: block;
      border: 1px solid var(--divider-color);
    }
    .ph {
      width: 96px;
      height: 64px;
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      margin-top: 4px;
    }
  `,u([$({attribute:!1})],ft.prototype,"hass",2),u([$()],ft.prototype,"docId",2),u([m()],ft.prototype,"_url",2),u([m()],ft.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",ft);var ji=["completed","skipped","missed","reset","triggered","trigger_replaced","trigger_removed"];function Qe(r,n){let t=n.lang;return o`
    <div class="history-filters-new">
      <div class="filter-chips">
        ${ji.map(e=>{let i=r.history.filter(a=>a.type===e).length;return i===0?d:o`
            <span class="filter-chip ${n.filter===e?"active":""}"
              @click=${()=>n.setFilter(n.filter===e?null:e)}>
              ${s(e,t)} (${i})
            </span>
          `})}
        ${n.filter?o`<span class="filter-chip clear" @click=${()=>n.setFilter(null)}>${s("show_all",t)}</span>`:d}
      </div>
      <div class="filter-controls">
        <input type="text" class="search-input" placeholder="${s("search_notes",t)}..." .value=${n.search} @input=${e=>n.setSearch(e.target.value)} />
      </div>
    </div>
  `}function Ze(r,n){let t=n.lang,e=n.filter?r.history.filter(i=>i.type===n.filter):r.history;if(n.search){let i=n.search.toLowerCase();e=e.filter(a=>a.notes?.toLowerCase().includes(i))}return e.length===0?o`<p class="empty">${s("no_history",t)}</p>`:o`
    <div class="history-timeline">
      ${[...e].reverse().map(i=>Si(i,n))}
    </div>
  `}function Si(r,n){let t=n.lang,e=["completed","reset","skipped"].includes(r.type);return o`
    <div class="history-entry">
      <div class="history-icon ${r.type}">
        <ha-icon .icon=${It[r.type]||"mdi:circle"}></ha-icon>
      </div>
      <div class="history-content">
        <div class="history-row">
          <strong>${s(r.type,t)}</strong>
          ${r.phase_id?o`<span class="history-phase-badge">${n.phaseNames?.[r.phase_id]||r.phase_id}</span>`:d}
          ${r.auto?o`<span class="history-auto-badge">${s("history_auto",t)}</span>`:d}
          ${e?o`<button class="history-edit-btn"
                     title=${s("history_edit_button",t)||"Edit entry"}
                     @click=${()=>n.openEdit(r)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:d}
        </div>
        <div class="history-date">${kt(r.timestamp,t)}</div>
        ${r.notes?o`<div>${r.notes}</div>`:d}
        ${r.photo_doc_id?o`<maintenance-history-photo .hass=${n.hass} .docId=${r.photo_doc_id}></maintenance-history-photo>`:d}
        <div class="history-details">
          ${r.cost!=null?o`<span>${s("cost",t)}: ${r.cost.toFixed(2)} ${n.currencySymbol}</span>`:d}
          ${r.duration!=null?o`<span>${s("duration",t)}: ${r.duration} min</span>`:d}
          ${r.trigger_value!=null?o`<span>${s("trigger_val",t)}: ${r.trigger_value}</span>`:d}
          ${r.reading_value!=null?o`<span>${s("reading_label",t)}: ${r.reading_value}${n.readingUnit?` ${n.readingUnit}`:""}${(()=>{let i=n.readingDelta?.(r);return i==null?"":` (${i>=0?"+":""}${Number(i.toFixed(3))})`})()}</span>`:d}
        </div>
      </div>
    </div>
  `}function ne(r,n){if(!r.responsible_user_id)return d;let t=n(r.responsible_user_id);return t?o`
    <span class="user-badge">
      <ha-icon icon="mdi:account"></ha-icon>
      ${t}
    </span>
  `:d}function Ei(r,n){let t=n.lang,e=n.isOperator,i=r.archived?"archived":r.is_done?"done":r.status==="due_soon"?"warning":r.status||"ok",a=r.archived?s("archived",t):r.is_done?s("completed",t):s(r.status||"ok",t);return o`
    <div class="task-header">
      <div class="task-header-title">
        <span class="task-name-breadcrumb" @click=${()=>n.showTaskView()}>${r.name}</span>
        <span class="breadcrumb-separator">·</span>
        <span class="object-name-breadcrumb" @click=${()=>n.showObject()}>${n.objectName}</span>
        <span class="status-chip ${i}">${a}</span>
        ${r.due_override?o`<span class="postponed-badge" title="${s("postponed_to",t)}">
          <ha-icon icon="mdi:calendar-arrow-right"></ha-icon>${V(r.due_override,t)}
        </span>`:d}
        ${ne(r,n.getUserName)}
        ${r.nfc_tag_id?o`<span class="nfc-badge" title="${s("nfc_tag_id",t)}: ${r.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>`:e?d:o`<span class="nfc-badge unlinked" title="${s("nfc_link_hint",t)}"
              @click=${()=>n.openEdit(r)}>
              <ha-icon icon="mdi:nfc-variant"></ha-icon>
            </span>`}
      </div>
      <div class="task-header-actions">
        <ha-button appearance="filled" @click=${()=>n.openComplete(r)}>${s("complete",t)}</ha-button>
        <ha-button appearance="plain" .disabled=${n.actionLoading} @click=${()=>n.promptSkip()}>${s("skip",t)}</ha-button>
        <div class="more-menu-wrapper">
          <ha-icon-button .disabled=${n.actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${()=>n.toggleMoreMenu()}></ha-icon-button>
          ${n.moreMenuOpen?o`
            <div class="popup-menu" @click=${l=>l.stopPropagation()}>
              ${e?d:o`
                <div class="popup-menu-item" @click=${()=>{n.closeMoreMenu(),n.openEdit(r)}}>${s("edit",t)}</div>
              `}
              <div class="popup-menu-item" @click=${()=>{n.closeMoreMenu(),n.openQr(r.name)}}>${s("qr_code",t)}</div>
              <div class="popup-menu-item" @click=${()=>{n.closeMoreMenu(),n.printWorksheet()}}>${s("worksheet",t)}</div>
              ${e?d:o`
                <div class="popup-menu-item" @click=${()=>n.duplicateTask()}>${s("duplicate",t)}</div>
                <div class="popup-menu-item" @click=${()=>{n.closeMoreMenu(),n.promptReset()}}>${s("reset",t)}</div>
                <div class="popup-menu-item" @click=${()=>{n.closeMoreMenu(),n.promptPostpone()}}>${s("postpone",t)}…</div>
                <div class="popup-menu-item" @click=${()=>{n.closeMoreMenu(),n.snoozeTask()}}>${s("snooze",t)}</div>
                <div class="popup-menu-item" @click=${()=>{n.closeMoreMenu(),n.toggleArchive(!!r.archived)}}>${r.archived?s("unarchive",t):s("archive",t)}</div>
                <div class="popup-menu-divider"></div>
                <div class="popup-menu-item danger" @click=${()=>{n.closeMoreMenu(),n.deleteTask()}}>${s("delete",t)}</div>
              `}
            </div>
          `:d}
        </div>
      </div>
    </div>
  `}function Mi(r){let n=r.lang;return o`
    <div class="tab-bar">
      <div class="tab ${r.activeTab==="overview"?"active":""}" @click=${()=>r.setActiveTab("overview")}>
        ${s("overview",n)}
      </div>
      <div class="tab ${r.activeTab==="history"?"active":""}" @click=${()=>r.setActiveTab("history")}>
        ${s("history",n)}
      </div>
    </div>
  `}function Je(r,n,t,e){let i=e.collapsedSections.has(r);return o`
    <div class="collapsible ${i?"collapsed":""}">
      <button class="collapsible-head" @click=${()=>e.toggleSection(r)}
        aria-expanded=${i?"false":"true"}>
        <ha-icon icon="${i?"mdi:chevron-right":"mdi:chevron-down"}"></ha-icon>
        <span>${s(n,e.lang)}</span>
      </button>
      ${i?d:o`<div class="collapsible-body">${t}</div>`}
    </div>
  `}function Ci(r,n){if(!be(r))return d;let t=n.lang,e=r.phase_sequence,i=ve(r.phase_cursor,e.length),a=new Map;for(let l=r.history.length-1;l>=0;l--){let p=r.history[l];p.phase_id&&p.type==="completed"&&!a.has(p.phase_id)&&a.set(p.phase_id,p.timestamp)}return o`
    <div class="phases-card">
      <div class="phases-card-header">
        <ha-icon icon="mdi:rotate-right"></ha-icon>
        <span>${s("phase_sequence_label",t)}</span>
      </div>
      <div class="phases-strip">
        ${e.map((l,p)=>{let c=r.phases?.[l]?.name||l,h=a.get(l);return o`
            <div class="phase-step ${p===i?"current":""}"
              title=${p===i?s("phase_current",t):s("phase_set",t)}
              @click=${()=>{p!==i&&n.setPhaseCursor(p)}}>
              <span class="phase-step-name">${p+1}. ${c}</span>
              ${h?o`<span class="phase-step-last">${V(h,t)}</span>`:d}
            </div>
          `})}
      </div>
    </div>
  `}function Di(r,n){if(!n.features.checklists)return d;let t=Ut(r)?.checklist??(r.checklist||[]);if(t.length===0)return d;let e=n.lang,i=r.checklist_progress||{},a=t.filter(l=>i[l]).length;return o`
    <div class="checklist-preview-card">
      <div class="checklist-preview-header">
        <ha-icon icon="mdi:format-list-checks"></ha-icon>
        <span>${s("checklist",e)} (${a}/${t.length})</span>
      </div>
      <ol class="checklist-preview-list">
        ${t.map(l=>o`
          <li class=${i[l]?"checked":""}>
            <label>
              <input
                type="checkbox"
                .checked=${!!i[l]}
                @change=${p=>n.setChecklistItem(l,p.target.checked)}
              />
              <span>${l}</span>
            </label>
          </li>
        `)}
      </ol>
    </div>
  `}function Ri(r,n){let t=W(r.documentation_url)?r.documentation_url:null,e=W(n.objectDocUrl)?n.objectDocUrl:null,i=e?null:(n.objectManualDocs||[])[0];if(!r.notes&&!t&&!e&&!i)return d;let a=n.lang;return o`
    <div class="task-meta-card">
      ${r.notes?o`
        <div class="task-meta-row">
          <ha-icon icon="mdi:note-text-outline"></ha-icon>
          <span class="task-meta-notes">${Vt(r.notes)}</span>
        </div>
      `:d}
      ${t?o`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:open-in-new"></ha-icon>
          <a href="${t}" target="_blank" rel="noopener noreferrer">${s("documentation_label",a)}</a>
        </div>
      `:d}
      ${e?o`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="${e}" target="_blank" rel="noopener noreferrer">${s("documentation_url_label",a)} (${n.objectName})</a>
        </div>
      `:i?o`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="#" title=${i.title}
            @click=${l=>{l.preventDefault(),n.openManualDoc(i)}}
            >${s("documentation_url_label",a)} (${n.objectName})</a>
        </div>
      `:d}
    </div>
  `}function Oi(r,n){let t=n.lang,e=r.times_performed>0?r.total_cost/r.times_performed:0,i=r.days_until_due!==null&&r.days_until_due!==void 0?r.days_until_due<0?"overdue":r.days_until_due<=r.warning_days?"warning":"":"";return o`
    <div class="kpi-bar">
      <div class="kpi-card">
        <div class="kpi-label">${s("next_due",t)}</div>
        <div class="kpi-value">${r.next_due?V(r.next_due,t):"\u2014"}</div>
        ${n.features.schedule_time&&r.schedule_time?o`<div class="kpi-subtext">${s("at_time",t)} ${r.schedule_time}</div>`:d}
      </div>
      <div class="kpi-card ${i}">
        <div class="kpi-label">${s("days_until_due",t)}</div>
        <div class="kpi-value-large">${r.days_until_due!==null&&r.days_until_due!==void 0?r.days_until_due:"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("interval",t)}</div>
        <div class="kpi-value">${Et(r,t)}</div>
        ${n.features.adaptive&&r.suggested_interval&&r.suggested_interval!==r.interval_days?o`
          <div class="kpi-subtext">${s("recommended",t)}: ${r.suggested_interval}${r.interval_analysis?.confidence_interval_low!=null?` (${r.interval_analysis.confidence_interval_low}\u2013${r.interval_analysis.confidence_interval_high})`:""}</div>
        `:d}
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("warning",t)}</div>
        <div class="kpi-value">${r.warning_days} ${s("days",t)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("last_performed",t)}</div>
        <div class="kpi-value">${r.last_performed?V(r.last_performed,t):"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("avg_cost",t)}</div>
        <div class="kpi-value">${e.toFixed(0)} ${n.currencySymbol}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("avg_duration",t)}</div>
        <div class="kpi-value">${r.average_duration?r.average_duration.toFixed(0):"\u2014"} min</div>
      </div>
    </div>
  `}function Ai(r,n){let t=n.lang;if(!n.features.adaptive||!r.suggested_interval||r.suggested_interval===r.interval_days)return d;if(n.suggestionDismissed)return d;let e=r.suggested_interval;return o`
    <div class="recommendation-card">
      <h4>${s("suggested_interval",t)}</h4>
      ${Se(r.interval_days,e,r.interval_confidence||"medium",t)}
      <div class="recommendation-actions">
        <ha-button appearance="filled"
          @click=${()=>n.applySuggestion(e)}>
          ${s("apply_suggestion",t)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${()=>n.reanalyze()}>
          ${s("reanalyze",t)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${()=>n.dismissSuggestion()}>
          ${s("dismiss_suggestion",t)}
        </ha-button>
      </div>
    </div>
  `}function zi(r,n){let t=n.lang,e=r.history.slice(-3).reverse();if(e.length===0)return d;let i=a=>{switch(a){case"completed":return"\u2713";case"triggered":return"\u2297";case"skipped":return"\u21B7";case"reset":return"\u21BA";default:return"\xB7"}};return o`
    <div class="recent-activities">
      <h3>${s("recent_activities",t)}</h3>
      ${e.map(a=>o`
        <div class="activity-item">
          <span class="activity-icon">${i(a.type)}</span>
          <span class="activity-date">${kt(a.timestamp,t)}</span>
          <span class="activity-note">${a.notes||"\u2014"}</span>
          ${a.cost?o`<span class="activity-badge">${a.cost.toFixed(0)}${n.currencySymbol}</span>`:d}
          ${a.duration?o`<span class="activity-badge">${a.duration}min</span>`:d}
        </div>
      `)}
      <div class="activity-show-all">
        <ha-button appearance="plain" @click=${()=>n.setActiveTab("history")}>${s("show_all",t)} →</ha-button>
      </div>
    </div>
  `}function Ii(r,n){let t=n.lang,e=n.features.adaptive&&r.suggested_interval&&r.suggested_interval!==r.interval_days,i=n.features.seasonal&&r.seasonal_factor&&r.seasonal_factor!==1,a=e||i,l=n.features.adaptive&&r.interval_analysis?.weibull_beta!=null&&r.interval_analysis?.weibull_eta!=null,p=n.features.seasonal&&(r.seasonal_factors?.length===12||r.interval_analysis?.seasonal_factors?.length===12);return o`
    <div class="tab-content overview-tab">
      ${r.battery_fleet_task?o`<maintenance-battery-fleet-section .hass=${n.hass}></maintenance-battery-fleet-section>`:d}
      ${Oi(r,n)}
      ${Ri(r,n)}
      ${r.battery_fleet_task?d:o`
            ${Ve(r,n.lang)}
            ${We(r,n.sparkline)}
            ${je(r,t,n.features)}
          `}
      <div class="two-column-layout ${a?"":"single-column"}">
        ${a?o`
          <div class="left-column">
            ${Ai(r,n)}
            ${Ee(r,t,n.features)}
          </div>
        `:d}
        <div class="right-column">
          ${Ge(r,t,n.costDurationToggle,c=>n.setCostDurationToggle(c))}
        </div>
      </div>
      ${l?Je("weibull","weibull_reliability_curve",Te(r,t),n):d}
      ${p?Je("seasonal","seasonal_chart_title",o`
            ${Me(r,t)}
            <div class="seasonal-actions">
              <ha-button appearance="plain" @click=${()=>n.openSeasonalOverrides(r)}>
                ${s("edit_seasonal_overrides",t)}
              </ha-button>
            </div>
          `,n):d}
      ${Ci(r,n)}
      ${Di(r,n)}
      ${zi(r,n)}
    </div>
  `}function Li(r,n){return o`
    <div class="tab-content history-tab">
      <div class="history-add-past">
        <ha-button appearance="plain" class="history-add-past-btn" @click=${()=>n.openComplete(r)}>
          <ha-icon icon="mdi:calendar-plus"></ha-icon>
          ${s("history_add_past",n.lang)}
        </ha-button>
      </div>
      ${Qe(r,n.history)}
      ${Ze(r,n.history)}
    </div>
  `}function Pi(r,n){switch(n.activeTab){case"overview":return Ii(r,n);case"history":return Li(r,n);default:return d}}function Xe(r,n){return o`
    <div class="detail-section">
      ${Ei(r,n)}
      ${Mi(n)}
      ${Pi(r,n)}
      <maintenance-task-documents
        .hass=${n.hass}
        .entryId=${n.entryId}
        .taskId=${n.taskId}
        .canWrite=${!n.isOperator}
      ></maintenance-task-documents>
    </div>
  `}var At=class extends R{createRenderRoot(){return this}render(){return!this.task||!this.ctx?d:o`${Xe(this.task,this.ctx)}`}};u([$({attribute:!1})],At.prototype,"task",2),u([$({attribute:!1})],At.prototype,"ctx",2);customElements.get("maintenance-task-detail-view")||customElements.define("maintenance-task-detail-view",At);function ti(r){if(r.total<=0)return{start:0,end:0,padTop:0,padBottom:0};let n=r.overscan??12,t=Math.max(1,r.step??6),e=Math.max(1,r.rowHeight),i=Math.floor((r.scrollTop-r.listTop)/e),a=Math.ceil(r.viewportHeight/e)+1,l=Math.max(0,i-n);l=Math.floor(l/t)*t;let p=Math.min(r.total,Math.max(i,0)+a+n);return p=Math.min(r.total,Math.ceil(p/t)*t),l>=p&&(l=Math.min(l,Math.max(0,r.total-1)),p=Math.min(r.total,l+Math.max(a,1))),{start:l,end:p,padTop:l*e,padBottom:(r.total-p)*e}}var x=class extends R{constructor(){super(...arguments);this.narrow=!1;this.panel={};this._objects=[];this._stats=null;this._view="overview";this._allParts=null;this._selectedEntryId=null;this._selectedTaskId=null;this._filterStatus="";this._filterUser=null;this._filterLabel=null;this._filterPriority="";this._savedViews=[];this._activeViewId="";this._unsub=null;this._chartRangeDays=(()=>{try{let t=parseInt(J(A.chartRange)||"",10);return[7,30,90,365].includes(t)?t:30}catch{return 30}})();this._hideOutliers=(()=>{try{return J(A.chartHideOutliers)==="1"}catch{return!1}})();this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._adminPanelUserIds=[];this._operatorWriteEnabled=!1;this._defaultWarningDays=7;this._actionLoading=!1;this._moreMenuOpen=!1;this._objMenuOpen=!1;this._toastMessage="";this._toastUndo=null;this._toastActionLabel="";this._filtersOpen=!1;this._newMenuOpen=!1;this._gsSetupsCount=0;this._gsAdoptCount=0;this._gsLoaded=!1;this._batteryFleetSetupAvailable=!1;this._staleBundle=!1;this._staleChecked=!1;this._toastTimer=null;this._dismissedSuggestions=new Set;this._overviewTab=(()=>{try{let t=J(A.overviewTab);return t==="today"||t==="calendar"?t:"dashboard"}catch{return"dashboard"}})();this._activeTab="overview";this._costDurationToggle="both";this._historySearch="";this._sortMode="due_date";this._objectSortMode="alphabetical";this._groupByMode="none";this._objectViewMode="cards";this._objectsTableColumns=ge;this._showArchived=!1;this._bulkMode=!1;this._bulkSelected=new Set;this._virtStart=0;this._virtEnd=0;this._virtRowHeight=53;this._virtTotalRows=0;this._virtScrollAttached=!1;this._virtRaf=0;this._collapsedSections=(()=>{try{return new Set(JSON.parse(J(A.collapsedSections)||"[]"))}catch{return new Set}})();this._paletteOpen=!1;this._paletteQuery="";this._paletteActive=0;this._templateGalleryOpen=!1;this._templates=[];this._templateCategories={};this._templateBusy=!1;this._statsService=null;this._userService=null;this._dataLoaded=!1;this._lastConnection=null;this._popstateHandler=t=>this._onPopState(t);this._lazyUi=null;this._onVirtualScroll=()=>{this._virtRaf||(this._virtRaf=requestAnimationFrame(()=>{this._virtRaf=0,this._updateVirtualWindow()}))};this._deepLinkHandled=!1;this._kpiRefreshInFlight=!1;this._kpiRefreshPending=!1;this._paletteKeydown=t=>{if(t.key==="/"&&!t.ctrlKey&&!t.metaKey&&!t.altKey&&!this._paletteOpen){let i=t.composedPath()[0];if(i instanceof HTMLElement&&(i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.tagName==="SELECT"||i.isContentEditable))return;t.preventDefault(),this._openPalette();return}if(!this._paletteOpen)return;let e=this._paletteResults;if(t.key==="Escape")t.preventDefault(),this._closePalette();else if(t.key==="ArrowDown")t.preventDefault(),this._paletteActive=Math.min(this._paletteActive+1,e.length-1);else if(t.key==="ArrowUp")t.preventDefault(),this._paletteActive=Math.max(this._paletteActive-1,0);else if(t.key==="Enter"){t.preventDefault();let i=e[this._paletteActive];i&&this._selectPaletteResult(i)}};this._onDialogEvent=async()=>{try{await this._loadData()}catch{}};this._onCalendarLlCustom=t=>{let e=t.detail;e?.type==="maintenance-supporter:open-task"&&e.entry_id&&e.task_id&&(t.stopPropagation(),this._showTask(e.entry_id,e.task_id))};this._fullHistory=null;this._onHistoryEntrySaved=async()=>{await this._loadData()}}get _currencySymbol(){return this._budget?.currency_symbol||Lt}get _lang(){return P(this.hass)}get _isOperator(){let t=this.hass?.user;return t?t.is_admin?!1:!(this._operatorWriteEnabled&&this._adminPanelUserIds.includes(t.id)):!0}_ensureLazyUi(){return this._lazyUi||(this._lazyUi=Promise.all([import("/maintenance_supporter_panelfiles/panel-chunks/object-dialog-ICCDWHFN.js"),import("/maintenance_supporter_panelfiles/panel-chunks/task-dialog-QWXAOKW4.js"),import("/maintenance_supporter_panelfiles/panel-chunks/complete-dialog-HYGO53LE.js"),import("/maintenance_supporter_panelfiles/panel-chunks/qr-dialog-AWCAL2QP.js"),import("/maintenance_supporter_panelfiles/panel-chunks/adopt-problem-sensors-dialog-CZK3QMFW.js"),import("/maintenance_supporter_panelfiles/panel-chunks/suggested-setups-dialog-QR2OJ2BR.js"),import("/maintenance_supporter_panelfiles/panel-chunks/settings-view-FMNQBSKB.js")]).then(()=>this.updateComplete)),this._lazyUi}async _ui(t){return await this._ensureLazyUi(),this.shadowRoot?.querySelector(t)??null}connectedCallback(){super.connectedCallback();let t=window.requestIdleCallback,e=()=>this._ensureLazyUi();t?t(e,{timeout:3e3}):window.setTimeout(e,1500),window.addEventListener("popstate",this._popstateHandler),window.addEventListener("keydown",this._paletteKeydown),window.addEventListener("resize",this._onVirtualScroll,{passive:!0});try{let i=J(A.taskSort);i&&["due_date","object","type","task_name","area","assigned_user","group"].includes(i)&&(this._sortMode=i);let a=J(A.objectSort);a&&["alphabetical","due_soonest","task_count"].includes(a)&&(this._objectSortMode=a);let l=J(A.groupBy);l&&["none","area","group","user"].includes(l)&&(this._groupByMode=l);let p=J(A.objectView);(p==="cards"||p==="table")&&(this._objectViewMode=p)}catch{}if(this._objects.length===0){let i=Oe();i&&(this._objects=i.objects,i.stats&&(this._stats=i.stats))}}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("popstate",this._popstateHandler),window.removeEventListener("keydown",this._paletteKeydown),window.removeEventListener("resize",this._onVirtualScroll),this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onVirtualScroll),this._virtScrollAttached=!1,this._virtRaf&&cancelAnimationFrame(this._virtRaf),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._lastConnection=null,this._deepLinkHandled=!1,this._statsService?.clearCache(),this._statsService=null}updated(t){if(super.updated(t),Pt(this,t),t.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},""),this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new qt(this.hass),this._fetchMiniStatsForOverview()),this._userService?this._userService.updateHass(this.hass):(this._userService=new xe(this.hass),this._userService.getUsers())}let e=this.shadowRoot?.querySelector(".content");e&&!this._virtScrollAttached&&(e.addEventListener("scroll",this._onVirtualScroll,{passive:!0}),this._virtScrollAttached=!0),this._updateVirtualWindow()}_updateVirtualWindow(){let t=this.shadowRoot?.querySelector(".content"),e=this.shadowRoot?.querySelector(".task-table.virtual");if(!t||!e)return;let i=e.querySelector(".task-row:not(.virt-sizer)");i&&i.offsetHeight>20&&(this._virtRowHeight=i.offsetHeight);let a=e.getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop,l=ti({scrollTop:t.scrollTop,viewportHeight:t.clientHeight,listTop:a,rowHeight:this._virtRowHeight,total:this._virtTotalRows});(l.start!==this._virtStart||l.end!==this._virtEnd)&&(this._virtStart=l.start,this._virtEnd=l.end)}async _loadData(){let[t,e,i,a,l,p]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"}).catch(()=>null)]);if(p&&(this._savedViews=p.views||[]),t&&(this._objects=Dt(t.objects),ee(this._objects,e??this._stats??null),this._maybeLoadGettingStarted()),this._view==="task"&&this._selectedEntryId&&this._selectedTaskId&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/status"}).then(c=>{this._batteryFleetSetupAvailable=!!c.available&&!c.configured}).catch(()=>{this._batteryFleetSetupAvailable=!1}),this._staleChecked||(this._staleChecked=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/version"}).then(c=>{this._staleBundle=le(c?.version)}).catch(()=>{})),e&&(this._stats=e),i&&(this._budget=i),a&&(this._groups=a.groups||{}),l){let c=l;this._features=c.features,this._adminPanelUserIds=c.admin_panel_user_ids||[],this._operatorWriteEnabled=c.operator_write_enabled??!1;let h=c.general?.default_warning_days;typeof h=="number"&&h>=0&&h<=365&&(this._defaultWarningDays=h),this._objectsTableColumns=me(c.objects_table_columns)}this._fetchMiniStatsForOverview(),this._handleDeepLink()}_handleDeepLink(){if(this._deepLinkHandled)return;let t=new URLSearchParams(window.location.search),e=t.get("ms_action"),i=()=>{let g=window.location.pathname+window.location.hash;history.replaceState(history.state,"",g)};if(e==="add_object"){this._deepLinkHandled=!0,i(),this._ui("maintenance-object-dialog").then(g=>g?.openCreate());return}if(e==="open_vacation"||e==="open_budget"||e==="open_groups"||e==="open_settings"){this._deepLinkHandled=!0,i(),this._overviewTab="settings",this._ensureLazyUi().then(()=>requestAnimationFrame(()=>{let g=this.shadowRoot?.querySelector("maintenance-settings-view"),v=e.replace("open_","");g?.scrollToSection?.(v)}));return}let a=t.get("entry_id");if(!a)return;this._deepLinkHandled=!0;let l=t.get("task_id"),p=t.get("action"),c=window.location.pathname+window.location.hash;history.replaceState(history.state,"",c);let h=this._getObject(a);if(!h){this._showOverview();return}if(l){let g=h.tasks.find(v=>v.id===l);if(!g){this._showObject(a);return}this._showTask(a,l),p==="complete"?requestAnimationFrame(()=>{this._openCompleteDialog(a,l,g.name,this._features.checklists?g.checklist:void 0,this._features.adaptive&&!!g.adaptive_config?.enabled)}):p==="quick_complete"&&requestAnimationFrame(()=>{this._handleQuickComplete(a,l,g)})}else this._showObject(a)}_isCounterEntity(t){if(!t)return!1;let e=t.type||"threshold";return e==="counter"||e==="state_change"}async _fetchDetailStats(t,e){if(!this._statsService)return;let i=await this._statsService.getDetailStats(t,e,this._chartRangeDays),a=new Map(this._detailStatsData);a.set(t,i),this._detailStatsData=a}_setChartRange(t){if(t===this._chartRangeDays)return;this._chartRangeDays=t;try{q(A.chartRange,String(t))}catch{}let e=this._selectedEntryId&&this._selectedTaskId?this._getTask(this._selectedEntryId,this._selectedTaskId):null,i=e?.trigger_config?.entity_id;if(i){let a=new Map(this._detailStatsData);a.delete(i),this._detailStatsData=a,this._fetchDetailStats(i,this._isCounterEntity(e.trigger_config))}}_setHideOutliers(t){if(t!==this._hideOutliers){this._hideOutliers=t;try{q(A.chartHideOutliers,t?"1":"0")}catch{}}}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let t=[];for(let i of this._objects)for(let a of i.tasks){let l=a.trigger_config?.entity_id;l&&t.push({entityId:l,isCounter:this._isCounterEntity(a.trigger_config)})}if(t.length===0)return;let e=await this._statsService.getBatchMiniStats(t);this._miniStatsData=new Map([...this._miniStatsData,...e])}async _subscribe(){try{let t=await this.hass.connection.subscribeMessage(e=>{let i=e,a=Re(this._objects,i);a!==null&&(this._objects=a,e.objects&&ee(a,this._stats??null),this._refreshKpis(),this._view==="task"&&this._selectedEntryId&&this._selectedTaskId&&(i.objects||(i.delta||[]).some(l=>l.entry_id===this._selectedEntryId))&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId))},{type:"maintenance_supporter/subscribe",deltas:!0,compact:!0});if(!this.isConnected){t();return}this._unsub=t}catch{}}async _refreshKpis(){if(this._kpiRefreshInFlight){this._kpiRefreshPending=!0;return}this._kpiRefreshInFlight=!0;try{do{this._kpiRefreshPending=!1;let[t,e]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null)]);if(!this.isConnected)return;t&&(this._stats=t),e&&(this._budget=e)}while(this._kpiRefreshPending)}finally{this._kpiRefreshInFlight=!1}}get _taskRows(){let t=[];for(let v of this._objects)for(let _ of v.tasks){if(!this._showArchived&&_.archived||this._filterStatus&&_.status!==this._filterStatus)continue;if(this._filterUser){let k=this._filterUser==="current_user"?this._userService?.getCurrentUserId():this._filterUser;if(_.responsible_user_id!==k)continue}if(this._filterLabel&&!(_.labels||[]).includes(this._filterLabel)||this._filterPriority&&(_.priority||"normal")!==this._filterPriority)continue;let y=[];for(let k of Object.values(this._groups))k.task_refs?.some(j=>j.entry_id===v.entry_id&&j.task_id===_.id)&&y.push(k.name);t.push({entry_id:v.entry_id,task_id:_.id,object_name:v.object.name,task_name:_.name,type:_.type,schedule_type:_.schedule_type,status:_.status,days_until_due:_.days_until_due??null,next_due:_.next_due??null,trigger_active:_.trigger_active,trigger_current_value:_.trigger_current_value??null,trigger_current_delta:_.trigger_current_delta??null,trigger_config:_.trigger_config??null,trigger_entity_info:_.trigger_entity_info??null,times_performed:_.times_performed,total_cost:_.total_cost,interval_days:_.interval_days??null,interval_unit:_.interval_unit??null,interval_anchor:_.interval_anchor??null,is_done:_.is_done??!1,archived:_.archived??!1,history:_.history||[],enabled:_.enabled,nfc_tag_id:_.nfc_tag_id??null,priority:_.priority??"normal",labels:_.labels??[],area_id:v.object.area_id??null,responsible_user_id:_.responsible_user_id??null,group_names:y})}let e={overdue:0,triggered:1,due_soon:2,ok:3},i=(v,_)=>(e[v.status]??9)-(e[_.status]??9),a=(v,_)=>(v.days_until_due??99999)-(_.days_until_due??99999),l=(v,_)=>i(v,_)||a(v,_),p=v=>v.area_id&&this.hass?.areas?.[v.area_id]?.name||"",c=v=>v.responsible_user_id&&this._userService?.getUserName(v.responsible_user_id)||"",h=v=>v.group_names[0]||"",g={due_date:l,object:(v,_)=>v.object_name.localeCompare(_.object_name)||l(v,_),type:(v,_)=>v.type.localeCompare(_.type)||l(v,_),task_name:(v,_)=>v.task_name.localeCompare(_.task_name),area:(v,_)=>{let y=p(v),k=p(_);return!y&&k?1:y&&!k?-1:y.localeCompare(k)||l(v,_)},assigned_user:(v,_)=>{let y=c(v),k=c(_);return!y&&k?1:y&&!k?-1:y.localeCompare(k)||l(v,_)},group:(v,_)=>{let y=h(v),k=h(_);return!y&&k?1:y&&!k?-1:y.localeCompare(k)||l(v,_)}};return t.sort(g[this._sortMode]),t}_getObject(t){return this._objects.find(e=>e.entry_id===t)}_getTask(t,e){return this._getObject(t)?.tasks.find(a=>a.id===e)}_pushPanelState(t,e,i){let a={msp_view:t,msp_entry:e||null,msp_task:i||null};history.pushState(a,"")}_onPopState(t){let e=t.state;if(e?.msp_view&&(this._view=e.msp_view,this._selectedEntryId=e.msp_entry||null,this._selectedTaskId=e.msp_task||null,this._moreMenuOpen=!1,e.msp_view==="all_parts"&&this._loadAllParts(),e.msp_view==="task"&&e.msp_entry&&e.msp_task)){this._historyFilter=null;let i=this._getTask(e.msp_entry,e.msp_task);i?.trigger_config?.entity_id&&this._fetchDetailStats(i.trigger_config.entity_id,this._isCounterEntity(i.trigger_config))}}_showOverview(){this._pushPanelState("overview"),this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()}_showAllObjects(){this._pushPanelState("all_objects"),this._view="all_objects",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_showAllParts(){this._pushPanelState("all_parts"),this._view="all_parts",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop(),this._loadAllParts()}async _loadAllParts(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});this._allParts=t.parts||[]}catch{this._allParts=[]}}_filterByStatus(t){this._filterStatus=t,this._activeViewId="",this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard"),this._scrollContentToTop()}get _allLabels(){let t=new Set;for(let e of this._objects)for(let i of e.tasks)for(let a of i.labels||[])t.add(a);return[...t].sort((e,i)=>e.localeCompare(i))}get _currentFilters(){return{status:this._filterStatus,user_id:this._filterUser,label:this._filterLabel,priority:this._filterPriority,archived:this._showArchived,sort_mode:this._sortMode,group_by:this._groupByMode}}_applyView(t){if(this._activeViewId=t,!t)return;let e=this._savedViews.find(a=>a.id===t);if(!e)return;let i=e.filters;this._filterStatus=i.status||"",this._filterUser=i.user_id||null,this._filterLabel=i.label||null,this._filterPriority=i.priority||"",this._showArchived=!!i.archived,["due_date","object","type","task_name","area","assigned_user","group"].includes(i.sort_mode)&&(this._sortMode=i.sort_mode),["none","area","group","user"].includes(i.group_by)&&(this._groupByMode=i.group_by);try{q(A.taskSort,this._sortMode),q(A.groupBy,this._groupByMode)}catch{}this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard")}_openSavedViewsDialog(){this.shadowRoot.querySelector("maintenance-saved-views-dialog")?.open(this._currentFilters,this._savedViews)}_onSavedViewsChanged(t){this._savedViews=t.detail.views||[],this._activeViewId&&!this._savedViews.some(e=>e.id===this._activeViewId)&&(this._activeViewId="")}_scrollContentToTop(){requestAnimationFrame(()=>{let t=this.shadowRoot?.querySelector(".content");t&&t.scrollTo({top:0,behavior:"smooth"})})}_showObject(t){this._pushPanelState("object",t),this._view="object",this._selectedEntryId=t,this._selectedTaskId=null,this._scrollContentToTop()}_showTask(t,e){this._pushPanelState("task",t,e),this._view="task",this._selectedEntryId=t,this._selectedTaskId=e,this._activeTab="overview",this._historyFilter=null,this._scrollContentToTop(),this._fetchFullHistory(t,e);let i=this._getTask(t,e);if(i?.trigger_config?.entity_id){let a=i.trigger_config.entity_id,l=this._isCounterEntity(i.trigger_config);this._fetchDetailStats(a,l)}}_showToast(t){this._toastTimer&&clearTimeout(this._toastTimer),this._toastUndo=null,this._toastActionLabel="",this._toastMessage=t,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastTimer=null},4e3)}_showActionToast(t,e,i){this._showUndoToast(t,i),this._toastActionLabel=e}_showUndoToast(t,e){this._toastTimer&&clearTimeout(this._toastTimer),this._toastActionLabel="",this._toastMessage=t,this._toastUndo=e,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastUndo=null,this._toastTimer=null},7e3)}_runToastUndo(){let t=this._toastUndo;this._toastTimer&&clearTimeout(this._toastTimer),this._toastMessage="",this._toastUndo=null,this._toastTimer=null,t?.()}_openPalette(){this._paletteQuery="",this._paletteActive=0,this._paletteOpen=!0,this.updateComplete.then(()=>{this.shadowRoot?.querySelector(".palette-input")?.focus()})}_closePalette(){this._paletteOpen=!1,this._paletteQuery=""}get _paletteResults(){let t=this._paletteQuery.trim().toLowerCase(),e=[];for(let i of this._objects){let a=i.object.name||"";(!t||a.toLowerCase().includes(t))&&e.push({kind:"object",entryId:i.entry_id,label:a,sub:s("object",this._lang)});for(let l of i.tasks){if(l.archived)continue;let p=l.name||"",c=(l.labels||[]).some(h=>h.toLowerCase().includes(t));if(!t||p.toLowerCase().includes(t)||a.toLowerCase().includes(t)||c){let h=(l.labels||[]).length?`  #${(l.labels||[]).join(" #")}`:"";e.push({kind:"task",entryId:i.entry_id,taskId:l.id,label:p,sub:a+h})}}if(e.length>60)break}return e.slice(0,40)}_selectPaletteResult(t){this._closePalette(),t.kind==="task"&&t.taskId?this._showTask(t.entryId,t.taskId):this._showObject(t.entryId)}_renderPalette(){if(!this._paletteOpen)return d;let t=this._lang,e=this._paletteResults;return o`
      <div class="palette-backdrop" @click=${()=>this._closePalette()}>
        <div class="palette" @click=${i=>i.stopPropagation()}>
          <input
            class="palette-input"
            type="text"
            placeholder="${s("palette_placeholder",t)}"
            .value=${this._paletteQuery}
            @input=${i=>{this._paletteQuery=i.target.value,this._paletteActive=0}}
          />
          <div class="palette-results">
            ${e.length===0?o`<div class="palette-empty">${s("palette_no_results",t)}</div>`:e.map((i,a)=>o`
                  <div class="palette-item ${a===this._paletteActive?"active":""}"
                    @mouseenter=${()=>{this._paletteActive=a}}
                    @click=${()=>this._selectPaletteResult(i)}>
                    <ha-icon icon="${i.kind==="task"?"mdi:clipboard-check-outline":"mdi:package-variant-closed"}"></ha-icon>
                    <span class="palette-label">${i.label}</span>
                    <span class="palette-sub">${i.sub}</span>
                  </div>
                `)}
          </div>
          <div class="palette-hint">${s("palette_hint",t)}</div>
        </div>
      </div>
    `}_openAdoptProblemSensors(){this._ui("maintenance-adopt-problem-sensors-dialog").then(t=>t?.open())}async _onProblemSensorsAdopted(t){let e=t.detail?.tasks_created??0,i=t.detail?.created??[];await this._loadData();let a=s("adopt_problem_done",this._lang).replace("{tasks}",String(e));i.length>0?this._showActionToast(a,s("adopt_problem_configure",this._lang),()=>{let l=i[0],p=this._objects.find(h=>h.entry_id===l.entry_id),c=p?.tasks.find(h=>h.id===l.task_id);p&&c&&this._ui("maintenance-task-dialog").then(h=>h?.openEdit(l.entry_id,c))}):this._showToast(a)}async _setupBatteryFleet(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/setup",language:this.hass.language||"en"});this._batteryFleetSetupAvailable=!1,await this._loadData();let e=this._objects.find(a=>a.entry_id===t.entry_id),i=e?.tasks.find(a=>a.id===t.task_id)||e?.tasks[0];e&&i&&this._showTask(e.entry_id,i.id),this._showToast(s("battery_fleet_setup_done",this._lang))}catch(t){this._showToast(S(t,this._lang))}}_openSuggestedSetups(){this._ui("maintenance-suggested-setups-dialog").then(t=>t?.open())}_onSetupsAdopted(t){let e=t.detail?.tasks_created??0;this._showToast(s("setups_done",this._lang).replace("{tasks}",String(e))),this._loadData()}async _openTemplateGallery(){if(this._templateGalleryOpen=!0,!(this._templates.length>0))try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/templates",language:this._lang});this._templateCategories=t.categories||{},this._templates=(t.templates||[]).filter(e=>!e.disabled)}catch{this._showToast(s("action_error",this._lang))}}async _createFromTemplate(t){this._templateBusy=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/from_template",language:this._lang,template_id:t});this._templateGalleryOpen=!1,await this._loadData(),this._showToast(s("template_created",this._lang)),e?.entry_id&&this._showObject(e.entry_id)}catch{this._showToast(s("action_error",this._lang))}finally{this._templateBusy=!1}}_categoryName(t){let e=this._templateCategories[t];return e&&(e[`name_${this._lang}`]||e.name_en)||t}_renderTemplateGallery(){if(!this._templateGalleryOpen)return d;let t=this._lang,e=new Map;for(let i of this._templates)e.has(i.category)||e.set(i.category,[]),e.get(i.category).push(i);return o`
      <div class="palette-backdrop" @click=${()=>{this._templateGalleryOpen=!1}}>
        <div class="template-gallery" @click=${i=>i.stopPropagation()}>
          <div class="template-gallery-head">
            <span>${s("templates_title",t)}</span>
            <ha-icon-button .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
              @click=${()=>{this._templateGalleryOpen=!1}}></ha-icon-button>
          </div>
          <div class="template-gallery-body">
            ${this._templates.length===0?o`<div class="palette-empty">${s("loading",t)}…</div>`:[...e.entries()].map(([i,a])=>o`
                  <div class="template-cat">
                    <div class="template-cat-head">
                      <ha-icon icon="${this._templateCategories[i]?.icon||"mdi:folder-outline"}"></ha-icon>
                      ${this._categoryName(i)}
                    </div>
                    <div class="template-grid">
                      ${a.map(l=>o`
                        <button class="template-card" .disabled=${this._templateBusy}
                          @click=${()=>this._createFromTemplate(l.id)}>
                          <span class="template-card-name">${l.name}</span>
                          <span class="template-card-count">${s("templates_task_count",t).replace("{n}",String(l.tasks.length))}</span>
                        </button>
                      `)}
                    </div>
                  </div>
                `)}
          </div>
        </div>
      </div>
    `}_bulkKey(t){return`${t.entry_id}:${t.task_id}`}_toggleBulkMode(){this._bulkMode=!this._bulkMode,this._bulkMode||(this._bulkSelected=new Set)}_toggleBulkRow(t){let e=this._bulkKey(t),i=new Set(this._bulkSelected);i.has(e)?i.delete(e):i.add(e),this._bulkSelected=i}_bulkSelectAll(t){let e=t.map(a=>this._bulkKey(a)),i=e.every(a=>this._bulkSelected.has(a));this._bulkSelected=i?new Set:new Set(e)}async _runBulk(t,e,i,a){let l=t.filter(c=>this._bulkSelected.has(this._bulkKey(c)));if(l.length===0)return;this._actionLoading=!0;let p=0;for(let c of l)try{await this.hass.connection.sendMessagePromise(e(c)),p++}catch{}this._actionLoading=!1,this._bulkSelected=new Set,this._bulkMode=!1,await this._loadData(),a&&p>0?this._showUndoToast(i(p),a):this._showToast(i(p))}_bulkComplete(t){this._runBulk(t,e=>({type:"maintenance_supporter/task/complete",entry_id:e.entry_id,task_id:e.task_id}),e=>s("bulk_completed",this._lang).replace("{n}",String(e)))}_bulkArchive(t){let e=t.filter(i=>this._bulkSelected.has(this._bulkKey(i))).map(i=>({entry_id:i.entry_id,task_id:i.task_id}));this._runBulk(t,i=>({type:"maintenance_supporter/task/archive",entry_id:i.entry_id,task_id:i.task_id}),i=>s("bulk_archived",this._lang).replace("{n}",String(i)),async()=>{for(let i of e)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/unarchive",entry_id:i.entry_id,task_id:i.task_id})}catch{}await this._loadData()})}async _runAction(t,e){this._actionLoading=!0;try{let i=await this.hass.connection.sendMessagePromise(t);return await this._loadData(),e?.successToast&&this._showToast(e.successToast),i??{}}catch(i){return this._showToast(S(i,this._lang)),null}finally{this._actionLoading=!1}}async _deleteObject(t){if(!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("confirm_delete_object",this._lang),confirmText:s("delete",this._lang),danger:!0}))return;await this._runAction({type:"maintenance_supporter/object/delete",entry_id:t})&&this._showOverview()}_printObjectReport(t){let e=this._getObject(t);if(!e)return;let i=this._lang,a={title:s("report_title",i),generated:s("report_generated",i),manufacturer:s("manufacturer",i),model:s("model",i),serial:s("serial_number_label",i),installed:s("installed",i),warranty:s("warranty",i),area:s("area",i),notes:s("report_notes",i),tasksHeading:s("tasks",i),colTask:s("task_name",i),colType:s("report_col_type",i),colStatus:s("report_col_status",i),colSchedule:s("report_col_schedule",i),colLastDone:s("last_performed",i),colNextDue:s("next_due",i),colCost:s("cost",i),colTimes:s("report_times_done",i),totalCost:s("report_total_cost",i),scheduleLabel:p=>Et(p,i),none:"\u2014",statusLabel:p=>s(p,i),typeLabel:p=>s(p,i)},l=Ae(e.object,e.tasks,a,p=>p?V(p,i):"",this._currencySymbol,new Date().toISOString());Ct(l)}async _duplicateObject(t){let e=await this._runAction({type:"maintenance_supporter/object/duplicate",entry_id:t},{successToast:s("object_duplicated",this._lang)});e?.entry_id&&this._showObject(e.entry_id)}async _deleteTask(t,e){if(!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("confirm_delete_task",this._lang),confirmText:s("delete",this._lang),danger:!0}))return;await this._runAction({type:"maintenance_supporter/task/delete",entry_id:t,task_id:e})&&this._showObject(t)}async _duplicateTask(t,e){this._moreMenuOpen=!1;let i=await this._runAction({type:"maintenance_supporter/task/duplicate",entry_id:t,task_id:e},{successToast:s("task_duplicated",this._lang)});i?.task_id&&this._showTask(t,i.task_id)}async _toggleArchiveTask(t,e,i){await this._runAction({type:i?"maintenance_supporter/task/unarchive":"maintenance_supporter/task/archive",entry_id:t,task_id:e})&&!i&&this._showUndoToast(s("task_archived",this._lang),()=>this._toggleArchiveTask(t,e,!0))}async _toggleArchiveObject(t,e){await this._runAction({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:t})&&!e&&this._showUndoToast(s("object_archived",this._lang),()=>this._toggleArchiveObject(t,!0))}async _togglePauseObject(t,e){if(!e){let a=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:s("pause_object",this._lang),message:s("pause_until_prompt",this._lang),confirmText:s("pause_object",this._lang),inputLabel:s("pause_until_label",this._lang),inputType:"date"});if(!a?.confirmed)return;let l={type:"maintenance_supporter/object/pause",entry_id:t};a.value&&(l.until=a.value),await this._runAction(l)&&this._showUndoToast(s("object_paused",this._lang),()=>this._togglePauseObject(t,!0));return}await this._runAction({type:"maintenance_supporter/object/resume",entry_id:t},{successToast:s("object_resumed",this._lang)})}async _replaceObject(t,e){let a=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:s("replace_object",this._lang),message:s("replace_object_prompt",this._lang),confirmText:s("replace_object",this._lang),inputLabel:s("replace_name_label",this._lang),inputType:"text",inputValue:e});if(!a?.confirmed)return;let l=await this._runAction({type:"maintenance_supporter/object/replace",entry_id:t,name:a.value||e},{successToast:s("object_replaced",this._lang)});l?.entry_id&&this._showObject(l.entry_id)}async _skipTask(t,e,i){let a={type:"maintenance_supporter/task/skip",entry_id:t,task_id:e};i&&(a.reason=i),await this._runAction(a)}async _resetTask(t,e,i){let a={type:"maintenance_supporter/task/reset",entry_id:t,task_id:e};i&&(a.date=i),await this._runAction(a)}async _applySuggestion(t,e,i){await this._runAction({type:"maintenance_supporter/task/apply_suggestion",entry_id:t,task_id:e,interval:i})}_openSeasonalOverrides(t){let e=this.shadowRoot.querySelector("maintenance-seasonal-overrides-dialog");if(!e||!this._selectedEntryId)return;let i=t.adaptive_config?.seasonal_overrides;e.open(this._selectedEntryId,t.id,i)}async _reanalyzeInterval(t,e){let i=await this._runAction({type:"maintenance_supporter/task/analyze_interval",entry_id:t,task_id:e});i&&(i.recommended_interval?this._showToast(`${s("reanalyze_result",this._lang)}: ${i.recommended_interval} ${s("days",this._lang)} (${s(`confidence_${i.confidence}`,this._lang)}, ${i.data_points} ${s("data_points",this._lang)})`):this._showToast(s("reanalyze_insufficient_data",this._lang)))}async _promptSkipTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("skip",this._lang),message:s("skip_reason_prompt",this._lang),confirmText:s("skip",this._lang),inputLabel:s("reason_optional",this._lang),inputType:"text"});a.confirmed&&this._skipTask(t,e,a.value||void 0)}async _promptResetTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("reset",this._lang),message:s("reset_date_prompt",this._lang),confirmText:s("reset",this._lang),inputLabel:s("reset_date_optional",this._lang),inputType:"date"});a.confirmed&&this._resetTask(t,e,a.value||void 0)}async _postponeTask(t,e,i){await this._runAction({type:"maintenance_supporter/task/postpone",entry_id:t,task_id:e,until:i},{successToast:s("postponed",this._lang)})}async _promptPostponeTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("postpone",this._lang),message:s("postpone_date_prompt",this._lang),confirmText:s("postpone",this._lang),inputLabel:s("postpone_date_label",this._lang),inputType:"date"});!a.confirmed||!a.value||this._postponeTask(t,e,a.value)}async _snoozeTask(t,e){await this._runAction({type:"maintenance_supporter/task/snooze",entry_id:t,task_id:e},{successToast:s("snoozed",this._lang)})}_dismissSuggestion(t,e){t&&e&&this._dismissedSuggestions.add(`${t}_${e}`),this.requestUpdate()}async _handleQuickComplete(t,e,i){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/quick_complete",entry_id:t,task_id:e}),this._showToast(s("quick_complete_success",this._lang))}catch(a){let l=a?.code||"";l==="no_defaults"||l==="completion_details_required"?this._openCompleteDialog(t,e,i.name,this._features.checklists?i.checklist:void 0,this._features.adaptive&&!!i.adaptive_config?.enabled,{viaTagScan:!0}):this._showToast(S(a,this._lang,s("action_error",this._lang)));return}try{await this._loadData()}catch{}}async _printTaskWorksheet(t,e){let i=this._getObject(t),a=i?.tasks.find(l=>l.id===e);if(!(!i||!a)){this._actionLoading=!0;try{let l={type:"maintenance_supporter/qr/generate",entry_id:t,task_id:e,url_mode:"server"},[p,c]=await Promise.all([this.hass.connection.sendMessagePromise({...l,action:"view"}).catch(()=>null),this.hass.connection.sendMessagePromise({...l,action:"complete"}).catch(()=>null)]),h=null;try{let j=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:t})).documents||[]).find(M=>M.kind==="file"&&M.mime==="application/pdf"&&(M.task_ids||[]).includes(e)&&M.task_pages?.[e]);if(j){let M=j.task_pages[e],E=4,w={path:await he(this.hass,`/api/maintenance_supporter/document/${j.id}/excerpt?start=${M}&count=${E}`,3600)};h={title:j.title||j.filename||"Manual",startPage:M,endPage:M+E-1,url:new URL(w.path,window.location.origin).toString(),vendorBase:new URL("/maintenance_supporter_vendor",window.location.origin).toString()}}}catch{}let g=this._lang,v={title:s("worksheet",g),object:s("object",g),type:s("maintenance_type",g),interval:s("interval",g),nextDue:s("next_due",g),lastDone:s("last_performed",g),priority:s("priority",g),checklist:s("checklist",g),notes:s("notes_label",g),scanView:s("worksheet_scan_view",g),scanComplete:s("worksheet_scan_complete",g),manualExcerpt:s("worksheet_manual_excerpt",g),pages:s("worksheet_pages",g),printedOn:s("worksheet_printed",g),never:s("worksheet_never",g),typeLabel:k=>s(k,g),statusLabel:k=>s(k,g),parts:s("consumes_parts_label",g)},_=(a.consumes_parts||[]).map(k=>_e(k,i.entry_id,this._objects,g)),y=ze(a,i.object.name,v,k=>V(k,g),k=>Et(k,g),p?.svg_data_uri||null,c?.svg_data_uri||null,h,new Date().toISOString(),_);Ct(y)}finally{this._actionLoading=!1}}}_openManualDoc(t){if(t.kind!=="file"){W(t.url)&&window.open(t.url,"_blank","noopener");return}vt(this.hass,t.id).catch(()=>{})}async _setChecklistItem(t,e,i,a){let p=this._getObject(t)?.tasks.find(g=>g.id===e);if(!p)return;let c={},h=Ut(p)?.checklist??(p.checklist||[]);for(let g of h){let v=p.checklist_progress?.[g]??!1;c[g]=g===i?a:v}await this._runAction({type:"maintenance_supporter/task/checklist_progress",entry_id:t,task_id:e,checklist_state:c})}_openCompleteDialog(t,e,i,a,l,p){this._ui("maintenance-complete-dialog").then(c=>c&&this._fillAndOpenCompleteDialog(c,t,e,i,a,l,p))}_fillAndOpenCompleteDialog(t,e,i,a,l,p,c){ye(t,fe({entryId:e,taskId:i,taskName:a,task:this._getTask(e,i),objects:this._objects,lang:this._lang,checklist:l,checklistsEnabled:this._features.checklists,adaptiveEnabled:p,currencySymbol:this._currencySymbol,viaTagScan:c?.viaTagScan}),this._lang)}_openQrForObject(t,e){this._ui("maintenance-qr-dialog").then(i=>i?.openForObject(t,e))}_openQrForTask(t,e,i,a){this._ui("maintenance-qr-dialog").then(l=>l?.openForTask(t,e,i,a))}render(){return o`
      <div class="panel">
        ${this._staleBundle?o`
              <div class="update-banner" role="status">
                <ha-icon icon="mdi:update"></ha-icon>
                <span>${s("update_banner",this._lang)}</span>
                <ha-button appearance="plain" @click=${()=>location.reload()}>
                  ${s("update_reload",this._lang)}
                </ha-button>
              </div>
            `:d}
        ${this.narrow||this._view!=="overview"?this._renderHeader():d}
        <div class="content">
          ${this._view==="overview"?this._renderOverview():this._view==="all_objects"?this._renderAllObjects():this._view==="all_parts"?this._renderAllParts():this._view==="object"?this._renderObjectDetail():this._renderTaskDetail()}
        </div>
      </div>
      <maintenance-object-dialog
        .hass=${this.hass}
        .objects=${this._objects}
        @object-saved=${this._onDialogEvent}
      ></maintenance-object-dialog>
      <maintenance-task-dialog
        .hass=${this.hass}
        .checklistsEnabled=${this._features.checklists}
        .scheduleTimeEnabled=${this._features.schedule_time}
        .completionActionsEnabled=${this._features.completion_actions}
        .defaultWarningDays=${this._defaultWarningDays}
        @task-saved=${this._onDialogEvent}
      ></maintenance-task-dialog>
      <maintenance-complete-dialog
        .hass=${this.hass}
        @task-completed=${this._onDialogEvent}
      ></maintenance-complete-dialog>
      <maintenance-history-edit-dialog
        .hass=${this.hass}
        @history-entry-saved=${this._onHistoryEntrySaved}
      ></maintenance-history-edit-dialog>
      <maintenance-qr-dialog
        .hass=${this.hass}
        .lang=${this._lang}
      ></maintenance-qr-dialog>
      <maintenance-confirm-dialog
        .hass=${this.hass}
      ></maintenance-confirm-dialog>
      <maintenance-seasonal-overrides-dialog
        .hass=${this.hass}
        @overrides-saved=${this._onDialogEvent}
      ></maintenance-seasonal-overrides-dialog>
      <maintenance-group-dialog
        .hass=${this.hass}
        .objects=${this._objects}
        @group-saved=${this._onDialogEvent}
      ></maintenance-group-dialog>
      <maintenance-adopt-problem-sensors-dialog
        .hass=${this.hass}
        @problem-sensors-adopted=${t=>this._onProblemSensorsAdopted(t)}
      ></maintenance-adopt-problem-sensors-dialog>
      <maintenance-suggested-setups-dialog
        .hass=${this.hass}
        @integration-setups-adopted=${t=>this._onSetupsAdopted(t)}
      ></maintenance-suggested-setups-dialog>
      <maintenance-saved-views-dialog
        .hass=${this.hass}
        @saved-views-changed=${t=>this._onSavedViewsChanged(t)}
      ></maintenance-saved-views-dialog>
      ${this._toastMessage?o`<div class="toast">
        <span>${this._toastMessage}</span>
        ${this._toastUndo?o`<button class="toast-undo" @click=${()=>this._runToastUndo()}>${this._toastActionLabel||s("undo",this._lang)}</button>`:d}
      </div>`:d}
      ${this._renderPalette()}
      ${this._renderTemplateGallery()}
    `}_renderHeader(){let t=[{label:s("maintenance",this._lang),action:()=>this._showOverview()}];if(this._view==="object"&&this._selectedEntryId){let e=this._getObject(this._selectedEntryId);t.push({label:e?.object.name||"Object"})}if(this._view==="task"&&this._selectedEntryId&&this._selectedTaskId){let e=this._getObject(this._selectedEntryId);t.push({label:e?.object.name||"Object",action:()=>this._showObject(this._selectedEntryId)});let i=this._getTask(this._selectedEntryId,this._selectedTaskId);t.push({label:i?.name||"Task"})}return o`
      <div class="header">
        ${this.narrow?o`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`:d}
        ${this._view!=="overview"?o`<ha-icon-button
              .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
              @click=${()=>{this._view==="task"?this._showObject(this._selectedEntryId):this._showOverview()}}
            ></ha-icon-button>`:d}
        <div class="breadcrumbs">
          ${t.map((e,i)=>o`
              ${i>0?o`<span class="sep">/</span>`:d}
              ${e.action?o`<a @click=${e.action}>${e.label}</a>`:o`<span class="current">${e.label}</span>`}
            `)}
        </div>
      </div>
    `}_renderOverview(){let t=this._lang,e=!!this.hass?.user?.is_admin,i=this._stats;return!e&&this._overviewTab==="settings"&&(this._overviewTab="dashboard"),o`
      ${i?o`
            <div class="stats-bar">
              <div class="stat-item clickable"
                   @click=${()=>this._showAllObjects()}
                   title=${s("show_all_objects",t)}>
                <span class="stat-value">${i.total_objects}</span>
                <span class="stat-label">${s("objects",t)}</span>
              </div>
              <div class="stat-item clickable"
                   @click=${()=>this._filterByStatus("")}
                   title=${s("show_all_tasks",t)}>
                <span class="stat-value">${i.total_tasks}</span>
                <span class="stat-label">${s("tasks",t)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="overdue"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("overdue")}
                   title=${s("filter_to_overdue",t)}>
                <span class="stat-value" style="color: var(--error-color)">${i.overdue}</span>
                <span class="stat-label">${s("overdue",t)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="due_soon"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("due_soon")}
                   title=${s("filter_to_due_soon",t)}>
                <span class="stat-value" style="color: var(--warning-color)">${i.due_soon}</span>
                <span class="stat-label">${s("due_soon",t)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="triggered"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("triggered")}
                   title=${s("filter_to_triggered",t)}>
                <span class="stat-value" style="color: #ff5722">${i.triggered}</span>
                <span class="stat-label">${s("triggered",t)}</span>
              </div>
              ${this._features.budget?this._renderBudgetTiles():d}
            </div>
          `:d}
      <div class="tab-bar">
        <div class="tab ${this._overviewTab==="today"?"active":""}"
          @click=${()=>this._setOverviewTab("today")}>
          ${s("tab_today",t)}
        </div>
        <div class="tab ${this._overviewTab==="dashboard"?"active":""}"
          @click=${()=>this._setOverviewTab("dashboard")}>
          ${s("dashboard",t)}
        </div>
        <div class="tab ${this._overviewTab==="calendar"?"active":""}"
          @click=${()=>this._setOverviewTab("calendar")}>
          ${s("tab_calendar",t)}
        </div>
        ${e?o`
          <div class="tab ${this._overviewTab==="settings"?"active":""}"
            @click=${()=>this._setOverviewTab("settings")}>
            ${s("settings",t)}
          </div>
        `:d}
      </div>
      ${this._overviewTab==="today"?this._renderToday():this._overviewTab==="dashboard"?this._renderDashboard():this._overviewTab==="calendar"?o`
            <div @ll-custom=${this._onCalendarLlCustom}>
              <maintenance-supporter-calendar-card
                .hass=${this.hass}
              ></maintenance-supporter-calendar-card>
            </div>
          `:o`<maintenance-settings-view
            .hass=${this.hass}
            .features=${this._features}
            .budget=${this._budget}
            @settings-changed=${this._onSettingsChanged}
          ></maintenance-settings-view>`}
    `}_statusBadge(t,e,i){let a=this._lang,l=t?"archived":e?"done":i,p=t?"archived":e?"completed":i,c=t?s("archived",a):e?s("completed",a):s(i,a);return o`<span class="status-badge ${l}"><ha-icon icon="${It[p]||"mdi:circle-medium"}"></ha-icon>${c}</span>`}_setOverviewTab(t){this._overviewTab=t;try{q(A.overviewTab,t)}catch{}this._scrollContentToTop()}_renderToday(){let t=this._lang,e=this._taskRows,i=h=>`${h.entry_id}:${h.task_id}`,a=e.filter(h=>h.status==="overdue"||h.trigger_active),l=new Set(a.map(i)),p=e.filter(h=>!l.has(i(h))&&h.days_until_due===0);p.forEach(h=>l.add(i(h)));let c=e.filter(h=>!l.has(i(h))&&h.days_until_due!=null&&h.days_until_due>0&&h.days_until_due<=7);return a.length+p.length+c.length===0?o`
        <div class="today-empty">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <p>${s("today_all_caught_up",t)}</p>
        </div>
      `:o`
      <div class="today-view">
        ${this._renderTodaySection("today_overdue",a,"overdue")}
        ${this._renderTodaySection("today_due_today",p,"due_soon")}
        ${this._renderTodaySection("today_this_week",c,"")}
      </div>
    `}_renderTodaySection(t,e,i){if(e.length===0)return d;let a=this._lang;return o`
      <div class="today-section">
        <div class="today-section-header ${i}">
          <span>${s(t,a)}</span><span class="today-badge">${e.length}</span>
        </div>
        ${e.map(l=>o`
          <div class="today-row" @click=${()=>this._showTask(l.entry_id,l.task_id)}>
            <span class="today-dot ${l.trigger_active?"triggered":l.status}"></span>
            <div class="today-main">
              <div class="today-task">${l.task_name}</div>
              <div class="today-object">${l.object_name} · ${_t(l.days_until_due,a)}</div>
            </div>
            <mwc-icon-button class="btn-complete" title="${s("complete",a)}"
              @click=${p=>{p.stopPropagation(),this._openCompleteDialogForRow(l)}}>
              <ha-icon icon="mdi:check"></ha-icon>
            </mwc-icon-button>
          </div>
        `)}
      </div>
    `}_renderDashboard(){let t=this._stats,e=this._taskRows,i=this._lang,a=this._isOperator,l=this._objects.reduce((c,h)=>c+h.tasks.filter(g=>g.archived).length,0),p=(this._filterStatus?1:0)+(this._filterUser?1:0)+(this._filterLabel?1:0)+(this._filterPriority?1:0)+(this._activeViewId?1:0);return o`

      ${this.narrow?o`
        <div class="mobile-controls">
          <ha-button
            class="mobile-toggle ${this._filtersOpen?"active":""}"
            @click=${()=>{this._filtersOpen=!this._filtersOpen}}
          >
            <ha-icon icon="mdi:filter-variant"></ha-icon>
            ${s("filter_label",i)}${p>0?` (${p})`:""}
          </ha-button>
          ${a?d:this._renderNewMenu(i)}
        </div>
      `:d}

      <div class="filter-bar ${this.narrow&&!this._filtersOpen?"collapsed":""}">
        <label class="filter-field">
          <span class="filter-label">${s("views_label",i)}</span>
          <select
            .value=${this._activeViewId}
            @change=${c=>this._applyView(c.target.value)}
          >
            <option value="">${s("views_none",i)}</option>
            ${this._savedViews.map(c=>o`<option value=${c.id} ?selected=${this._activeViewId===c.id}>${c.name}</option>`)}
          </select>
        </label>
        ${a?d:o`
          <ha-icon-button
            class="views-save-btn"
            .path=${"M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"}
            .label=${s("views_manage",i)}
            title=${s("views_manage",i)}
            @click=${()=>this._openSavedViewsDialog()}
          ></ha-icon-button>
        `}
        <label class="filter-field">
          <span class="filter-label">${s("filter_label",i)}</span>
          <select
            .value=${this._filterStatus}
            @change=${c=>{this._filterStatus=c.target.value,this._activeViewId=""}}
          >
            <option value="">${s("all",i)}</option>
            <option value="overdue">${s("overdue",i)}</option>
            <option value="due_soon">${s("due_soon",i)}</option>
            <option value="triggered">${s("triggered",i)}</option>
            <option value="ok">${s("ok",i)}</option>
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${s("user_label",i)}</span>
          <select
            .value=${this._filterUser||""}
            @change=${c=>{let h=c.target.value;this._filterUser=h||null,this._activeViewId=""}}
          >
            <option value="">${s("all_users",i)}</option>
            <option value="current_user">${s("my_tasks",i)}</option>
          </select>
        </label>
        ${this._allLabels.length>0?o`
          <label class="filter-field">
            <span class="filter-label">${s("label_filter",i)}</span>
            <select
              .value=${this._filterLabel||""}
              @change=${c=>{let h=c.target.value;this._filterLabel=h||null,this._activeViewId=""}}
            >
              <option value="">${s("all_labels",i)}</option>
              ${this._allLabels.map(c=>o`<option value=${c} ?selected=${this._filterLabel===c}>${c}</option>`)}
            </select>
          </label>
        `:d}
        <label class="filter-field">
          <span class="filter-label">${s("priority",i)}</span>
          <select
            .value=${this._filterPriority}
            @change=${c=>{this._filterPriority=c.target.value,this._activeViewId=""}}
          >
            <option value="">${s("all_priorities",i)}</option>
            ${["high","normal","low"].map(c=>o`<option value=${c} ?selected=${this._filterPriority===c}>${s(`priority_${c}`,i)}</option>`)}
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${s("sort_label",i)}</span>
          <select
            .value=${this._sortMode}
            @change=${c=>{this._sortMode=c.target.value,this._activeViewId="";try{q(A.taskSort,this._sortMode)}catch{}}}
          >
            <option value="due_date" ?selected=${this._sortMode==="due_date"}>${s("sort_due_date",i)}</option>
            <option value="object" ?selected=${this._sortMode==="object"}>${s("sort_object",i)}</option>
            <option value="type" ?selected=${this._sortMode==="type"}>${s("sort_type",i)}</option>
            <option value="task_name" ?selected=${this._sortMode==="task_name"}>${s("sort_task_name",i)}</option>
            <option value="area" ?selected=${this._sortMode==="area"}>${s("sort_area",i)}</option>
            <option value="assigned_user" ?selected=${this._sortMode==="assigned_user"}>${s("sort_assigned_user",i)}</option>
            <option value="group" ?selected=${this._sortMode==="group"}>${s("sort_group",i)}</option>
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${s("group_by_label",i)}</span>
          <select
            .value=${this._groupByMode}
            @change=${c=>{this._groupByMode=c.target.value,this._activeViewId="";try{q(A.groupBy,this._groupByMode)}catch{}}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${s("groupby_none",i)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${s("groupby_area",i)}</option>
            ${this._features.groups?o`<option value="group" ?selected=${this._groupByMode==="group"}>${s("groupby_group",i)}</option>`:d}
            <option value="user" ?selected=${this._groupByMode==="user"}>${s("groupby_user",i)}</option>
          </select>
        </label>
        ${l>0?o`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived,this._activeViewId=""}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?s("hide_archived",i):`${s("show_archived",i)} (${l})`}
          </ha-button>
        `:d}
        ${!a&&e.length>0?o`
          <ha-button
            class="bulk-toggle ${this._bulkMode?"active":""}"
            @click=${()=>this._toggleBulkMode()}
          >
            <ha-icon icon="mdi:checkbox-multiple-marked-outline"></ha-icon>
            ${this._bulkMode?s("cancel",i):s("bulk_select",i)}
          </ha-button>
        `:d}
        ${!a&&!this.narrow?this._renderNewMenu(i):d}
      </div>

      ${a?d:this._renderGettingStartedChips(i)}

      ${e.length===0?o`
            <div class="empty-state">
              <ha-svg-icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></ha-svg-icon>
              <p>${s("no_tasks",i)}</p>
              ${!a&&this._objects.length===0?o`
                <p class="empty-onboard-hint">${s("onboard_hint",i)}</p>
                <div class="empty-onboard-actions">
                  <ha-button appearance="filled" @click=${()=>this._openTemplateGallery()}>
                    <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon> ${s("templates_from",i)}
                  </ha-button>
                  <ha-button appearance="plain" @click=${()=>this._ui("maintenance-object-dialog").then(c=>c?.openCreate())}>
                    ${s("new_object",i)}
                  </ha-button>
                </div>
              `:d}
            </div>
          `:o`
            ${this._bulkMode?this._renderBulkBar(e,i):d}
            ${this._groupByMode==="none"?this._renderTaskTable(e):this._renderGroupedTasks(e,i)}
          `}

      ${this._features.groups&&!a?this._renderGroupsSection():d}
      ${a?d:o`<maintenance-storage-section-card
            .hass=${this.hass}
            .objects=${this._objects}
            @open-object=${c=>{let h=c.detail?.entry_id;h&&this._showObject(h)}}
          ></maintenance-storage-section-card>`}
    `}_renderTaskTable(t){let e=this._bulkMode?" bulk":"";if(this._virtTotalRows=t.length,this.narrow||t.length<120)return o`
        <div class="task-table${e}">
          ${t.map(g=>this._renderOverviewRow(g))}
        </div>
      `;let i=t.length,a=this._virtRowHeight,l=Math.max(0,Math.min(this._virtStart,i)),p=this._virtEnd>0?Math.min(this._virtEnd,i):Math.min(i,40);p<l&&(l=0,p=Math.min(i,40));let c=l*a,h=(i-p)*a;return o`
      <div class="task-table${e} virtual">
        ${this._renderVirtSizerRow(t)}
        ${c>0?o`<div class="virt-spacer" style="height:${c}px"></div>`:d}
        ${t.slice(l,p).map(g=>this._renderOverviewRow(g))}
        ${h>0?o`<div class="virt-spacer" style="height:${h}px"></div>`:d}
      </div>
    `}_renderVirtSizerRow(t){let e=this._lang,i="",a=!1,l=!1,p=!1;for(let c of t){let h=c.archived?s("archived",e):c.is_done?s("completed",e):s(c.status,e);h.length>i.length&&(i=h),c.enabled||(a=!0),c.nfc_tag_id&&(l=!0),(c.priority==="high"||c.priority==="low")&&(p=!0)}return o`
      <div class="task-row virt-sizer" aria-hidden="true">
        ${this._bulkMode?o`<span></span>`:d}
        <span class="cell-badges">
          <span class="status-badge"><ha-icon icon="mdi:circle-medium"></ha-icon>${i}</span>
          ${a?o`<span class="badge-disabled">${s("disabled",e)}</span>`:d}
          ${l?o`<span class="nfc-badge"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:d}
          ${p?o`<span class="priority-badge"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>`:d}
        </span>
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
    `}_renderBulkBar(t,e){let i=this._bulkSelected.size,a=t.length>0&&t.every(l=>this._bulkSelected.has(this._bulkKey(l)));return o`
      <div class="bulk-bar">
        <label class="bulk-selectall">
          <input type="checkbox" .checked=${a} @change=${()=>this._bulkSelectAll(t)} />
          ${s("bulk_select_all",e)}
        </label>
        <span class="bulk-count">${s("bulk_n_selected",e).replace("{n}",String(i))}</span>
        <span class="bulk-actions">
          <ha-button appearance="filled" .disabled=${i===0||this._actionLoading}
            @click=${()=>this._bulkComplete(t)}>
            <ha-icon icon="mdi:check"></ha-icon> ${s("complete",e)}
          </ha-button>
          <ha-button appearance="plain" .disabled=${i===0||this._actionLoading}
            @click=${()=>this._bulkArchive(t)}>
            <ha-icon icon="mdi:archive-outline"></ha-icon> ${s("archive",e)}
          </ha-button>
        </span>
      </div>
    `}_renderGroupedTasks(t,e){let i=new Map,a=s("unassigned",e);for(let c of t){let h=[];this._groupByMode==="area"?h=[(c.area_id?this.hass?.areas?.[c.area_id]?.name:null)||a]:this._groupByMode==="user"?h=[(c.responsible_user_id?this._userService?.getUserName(c.responsible_user_id):null)||a]:this._groupByMode==="group"&&(h=c.group_names.length>0?c.group_names:[a]);for(let g of h)i.has(g)||i.set(g,[]),i.get(g).push(c)}let l=[...i.entries()].sort(([c],[h])=>c===a&&h!==a?1:h===a&&c!==a?-1:c.localeCompare(h)),p=this._groupByMode==="area"?"mdi:map-marker-outline":this._groupByMode==="group"?"mdi:folder-outline":"mdi:account-outline";return o`
      ${l.map(([c,h])=>o`
        <details class="group-section" open>
          <summary class="group-section-header">
            <ha-icon icon="${p}"></ha-icon>
            <span>${c}</span>
            <span class="group-section-count">(${h.length})</span>
          </summary>
          <div class="task-table${this._bulkMode?" bulk":""}">
            ${h.map(g=>this._renderOverviewRow(g))}
          </div>
        </details>
      `)}
    `}_warrantyLabel(t,e,i){return t.kind==="expired"?s("warranty_expired",i):t.kind==="expiring"?s("warranty_expires_in",i).replace("{days}",String(t.days??0)):s("warranty_valid_until",i).replace("{date}",V(e,i))}_renderWarrantyMeta(t,e){let i=ie(t);return o`<p class="meta">${s("warranty",e)}:
      <span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,t,e)}</span></p>`}_renderAllObjects(){let t=this._lang,e=this._isOperator,i=this._objectViewMode==="table"&&!this.narrow,a=this._objects.filter(g=>g.object.archived).length,l=g=>{let v=1/0;for(let _ of g.tasks){let y=_.days_until_due;y!=null&&y<v&&(v=y)}return v},p=this._objects.filter(g=>this._showArchived||!g.object.archived);this._objectSortMode==="alphabetical"?p.sort((g,v)=>g.object.name.localeCompare(v.object.name)):this._objectSortMode==="task_count"?p.sort((g,v)=>v.tasks.length-g.tasks.length||g.object.name.localeCompare(v.object.name)):p.sort((g,v)=>l(g)-l(v)||g.object.name.localeCompare(v.object.name));let c=()=>{let g=new Map;for(let v of p){let _=v.object.area_id,y=_?this.hass?.areas?.[_]?.name||s("unassigned",t):s("no_area",t);g.has(y)||g.set(y,[]),g.get(y).push(v)}return new Map([...g.entries()].sort(([v],[_])=>v.localeCompare(_)))},h=g=>{let v=g.tasks.some(_=>_.status==="overdue"||_.status==="triggered");return o`
        <div class="object-card${v?" object-card-overdue":""}" @click=${()=>this._showObject(g.entry_id)}>
          ${v?o`<span class="overdue-dot" title="${s("has_overdue",t)}"></span>`:d}
          <div class="object-card-header">
            <span class="object-card-name">${g.object.name}</span>
            ${g.object.paused?o`<span class="paused-badge" title="${s("object_paused_badge",t)}${g.object.paused_until?` \u2014 ${g.object.paused_until}`:""}">
                  <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
                </span>`:d}
            ${g.object.document_count?o`<span class="doc-badge" title="${g.object.document_count} ${s("documents",t)}">
                  <ha-icon icon="mdi:paperclip"></ha-icon>${g.object.document_count}
                </span>`:d}
            <span class="object-card-count">${g.tasks.length} ${s("tasks_lower",t)}</span>
          </div>
          ${g.object.manufacturer||g.object.model?o`<div class="object-card-meta">${[g.object.manufacturer,g.object.model].filter(Boolean).join(" ")}</div>`:d}
          ${g.tasks.length===0?o`<div class="object-card-empty">${s("no_tasks_yet",t)}</div>`:d}
        </div>
      `};return o`
      <div class="breadcrumb">
        <ha-icon-button @click=${()=>this._showOverview()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${s("all_objects",t)}</span>
        <button class="sibling-view-chip" @click=${()=>this._showAllParts()}>
          <ha-icon icon="mdi:package-variant-closed"></ha-icon> ${s("all_parts",t)}
        </button>
      </div>
      <div class="filter-bar">
        <label class="filter-field">
          <span class="filter-label">${s("sort_label",t)}</span>
          <select
            .value=${this._objectSortMode}
            @change=${g=>{this._objectSortMode=g.target.value;try{q(A.objectSort,this._objectSortMode)}catch{}}}
          >
            <option value="alphabetical" ?selected=${this._objectSortMode==="alphabetical"}>${s("sort_alphabetical",t)}</option>
            <option value="due_soonest" ?selected=${this._objectSortMode==="due_soonest"}>${s("sort_due_soonest",t)}</option>
            <option value="task_count" ?selected=${this._objectSortMode==="task_count"}>${s("sort_task_count",t)}</option>
          </select>
        </label>
        ${this.narrow?d:o`
          <div class="view-toggle" role="group" aria-label="${s("view_mode_label",t)}">
            <button
              class="view-toggle-btn${i?"":" active"}"
              title="${s("view_cards",t)}"
              @click=${()=>this._setObjectViewMode("cards")}
            ><ha-icon icon="mdi:view-grid-outline"></ha-icon></button>
            <button
              class="view-toggle-btn${i?" active":""}"
              title="${s("view_table",t)}"
              @click=${()=>this._setObjectViewMode("table")}
            ><ha-icon icon="mdi:table"></ha-icon></button>
          </div>
        `}
        ${i?d:o`
        <label class="filter-field">
          <span class="filter-label">${s("group_by_label",t)}</span>
          <select
            .value=${this._groupByMode}
            @change=${g=>{this._groupByMode=g.target.value;try{q(A.groupBy,this._groupByMode)}catch{}}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${s("groupby_none",t)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${s("groupby_area",t)}</option>
          </select>
        </label>
        `}
        ${e?d:o`
          <ha-button
            @click=${()=>this._ui("maintenance-object-dialog").then(g=>g?.openCreate())}
          >
            ${s("new_object",t)}
          </ha-button>
        `}
        <ha-button appearance="plain" @click=${()=>this._exportObjectsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${s("settings_export_csv",t)}
        </ha-button>
        ${a>0?o`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?s("hide_archived",t):`${s("show_archived",t)} (${a})`}
          </ha-button>
        `:d}
      </div>
      ${i?this._renderObjectsTable(p):this._groupByMode==="area"?o`
          ${[...c().entries()].map(([g,v])=>o`
            <details class="group-section" open>
              <summary class="group-section-header">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <span>${g}</span>
                <span class="group-section-count">(${v.length})</span>
              </summary>
              <div class="objects-grid">${v.map(h)}</div>
            </details>
          `)}
        `:o`<div class="objects-grid">${p.map(h)}</div>`}
    `}_setObjectViewMode(t){this._objectViewMode=t;try{q(A.objectView,t)}catch{}}_renderAllParts(){let t=this._lang,e=this._allParts,i=this._currencySymbol;return o`
      <div class="breadcrumb">
        <ha-icon-button @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${s("all_parts",t)}</span>
        <button class="sibling-view-chip" @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:devices"></ha-icon> ${s("all_objects",t)}
        </button>
      </div>
      <div class="filter-bar">
        <ha-button appearance="plain" @click=${()=>this._exportPartsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${s("settings_export_csv",t)}
        </ha-button>
      </div>
      ${e===null?o`<div class="empty-state">…</div>`:e.length===0?o`<div class="empty-state">${s("parts_section",t)}: 0</div>`:o`
          <div class="objects-table-wrap">
            <table class="objects-table">
              <thead>
                <tr>
                  <th>${s("part_name",t)}</th>
                  <th>${s("object",t)}</th>
                  <th>${s("part_stock",t)}</th>
                  <th>${s("part_reorder_threshold",t)}</th>
                  <th>${s("part_cost",t)}</th>
                  <th>${s("part_storage_location",t)}</th>
                  <th>${s("parts_used_by",t)}</th>
                </tr>
              </thead>
              <tbody>
                ${e.map(a=>o`
                  <tr class="objects-table-row" @click=${()=>this._showObject(a.entry_id)}>
                    <td>
                      <span class="objects-table-name">${a.name}</span>
                      ${a.low?o`<ha-icon class="part-low-icon" icon="mdi:cart-arrow-down"
                            title="${s("part_reorder_threshold",t)}: ${a.reorder_threshold}"></ha-icon>`:d}
                    </td>
                    <td>${a.object_name||"\u2014"}</td>
                    <td>${a.stock!==null?`${a.stock}${a.unit?` ${a.unit}`:""}`:"\u2014"}</td>
                    <td>${a.reorder_threshold??"\u2014"}</td>
                    <td>${a.cost!=null?`${a.cost} ${i}`.trim():"\u2014"}</td>
                    <td>${a.storage_location||"\u2014"}</td>
                    <td>
                      ${a.consumers.length===0?"\u2014":a.consumers.map(l=>o`
                            <span
                              class="part-consumer-chip${l.pooled?" pooled":""}"
                              title=${`${l.object_name??""}: ${l.task_name??l.task_id} (\xD7${l.quantity})`}
                            >${l.pooled?`${l.object_name} \xB7 `:""}${l.task_name??l.task_id}</span>
                          `)}
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `}
    `}_exportPartsCsv(){let t=this._allParts||[],e=p=>{let c=p==null?"":String(p);return/[",\n;]/.test(c)?`"${c.replace(/"/g,'""')}"`:c},a=[["name","object","stock","unit","reorder_threshold","unit_cost","storage_location","vendor","used_by"].join(",")];for(let p of t)a.push([e(p.name),e(p.object_name),e(p.stock),e(p.unit),e(p.reorder_threshold),e(p.cost),e(p.storage_location),e(p.vendor),e(p.consumers.map(c=>`${c.object_name??""}/${c.task_name??c.task_id}\xD7${c.quantity}`).join(" | "))].join(","));let l=new Date().toISOString().slice(0,10);Xt(a.join(`
`),`maintenance_parts_${l}.csv`,"text/csv;charset=utf-8")}async _exportObjectsCsv(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects/csv"}),e=new Date().toISOString().slice(0,10);Xt(t.csv,`maintenance_objects_${e}.csv`,"text/csv;charset=utf-8")}catch{this._showToast(s("action_error",this._lang))}}_renderObjectsTable(t){let e=this._lang,i=this._objectsTableColumns;return o`
      <div class="objects-table-wrap">
        <table class="objects-table">
          <thead>
            <tr>
              ${i.map(a=>{let l=ue.find(c=>c.key===a),p=l&&l.key!=="actions"?s(l.labelKey,e):"";return o`<th class="oc-${a}">${p}</th>`})}
            </tr>
          </thead>
          <tbody>
            ${t.map(a=>o`
              <tr class="objects-table-row" @click=${()=>this._showObject(a.entry_id)}>
                ${i.map(l=>this._renderObjectCell(l,a,e))}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `}_renderObjectCell(t,e,i){let a=e.object;switch(t){case"name":return o`<td class="oc-name">
          <span class="objects-table-name">${a.name}</span>
          ${a.document_count?o`<span class="doc-badge" title="${a.document_count} ${s("documents",i)}">
                <ha-icon icon="mdi:paperclip"></ha-icon>${a.document_count}
              </span>`:d}
        </td>`;case"manufacturer":return o`<td class="oc-manufacturer">${a.manufacturer||"\u2014"}</td>`;case"model":return o`<td class="oc-model">${a.model||"\u2014"}</td>`;case"serial_number":return o`<td class="oc-serial_number">${a.serial_number||"\u2014"}</td>`;case"installation_date":return o`<td class="oc-installation_date">${a.installation_date?V(a.installation_date,i):"\u2014"}</td>`;case"warranty_expiry":return o`<td class="oc-warranty_expiry">${this._renderWarrantyCell(a.warranty_expiry,i)}</td>`;case"area_id":{let l=a.area_id?this.hass?.areas?.[a.area_id]?.name||a.area_id:"\u2014";return o`<td class="oc-area_id">${l}</td>`}case"documentation_url":{let l=(a.manual_docs||[])[0];return o`<td class="oc-documentation_url">${W(a.documentation_url)?o`<a href=${a.documentation_url} target="_blank" rel="noopener noreferrer"
                @click=${p=>p.stopPropagation()}><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:l?o`<a href="#" title=${l.title}
                  @click=${p=>{p.preventDefault(),p.stopPropagation(),this._openManualDoc(l)}}
                  ><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:"\u2014"}</td>`}case"notes":return o`<td class="oc-notes" title=${a.notes||""}>${a.notes||"\u2014"}</td>`;case"task_count":return o`<td class="oc-task_count">${e.tasks.length}</td>`;case"actions":return o`<td class="oc-actions">
          <mwc-icon-button title="${s("qr_code",i)}" @click=${l=>{l.stopPropagation(),this._openQrForObject(e.entry_id,a.name)}}>
            <ha-icon icon="mdi:qrcode"></ha-icon>
          </mwc-icon-button>
        </td>`;default:return o`<td></td>`}}_renderWarrantyCell(t,e){let i=ie(t);return i.kind==="none"?o`<span class="warranty-none">—</span>`:o`<span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,t,e)}</span>`}async _onSettingsChanged(){await this._loadData()}_renderGroupsSection(){if(!this._features.groups)return d;let t=Object.entries(this._groups),e=this._lang;return o`
      <div class="groups-section">
        <div class="groups-header">
          <h3>${s("groups",e)}</h3>
          <ha-button appearance="plain" @click=${()=>this._openGroupCreate()}>
            ${s("new_group",e)}
          </ha-button>
        </div>
        ${t.length===0?o`<div class="hint">${s("no_groups",e)}</div>`:o`
            <div class="groups-grid">
              ${t.map(([i,a])=>{let l=a.task_refs.map(p=>this._getTask(p.entry_id,p.task_id)?.name).filter(Boolean);return o`
                  <div class="group-card">
                    <div class="group-card-head">
                      <div class="group-card-name">${a.name}</div>
                      <div class="group-card-actions">
                        <mwc-icon-button title="${s("edit",e)}" @click=${()=>this._openGroupEdit(i)}>
                          <ha-svg-icon path="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"></ha-svg-icon>
                        </mwc-icon-button>
                        <mwc-icon-button title="${s("delete",e)}" @click=${()=>this._deleteGroup(i,a.name)}>
                          <ha-svg-icon path="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z"></ha-svg-icon>
                        </mwc-icon-button>
                      </div>
                    </div>
                    ${a.description?o`<div class="group-card-desc">${a.description}</div>`:d}
                    <div class="group-card-tasks">
                      ${l.length>0?l.map(p=>o`<span class="group-task-chip">${p}</span>`):o`<span style="font-size:12px;color:var(--secondary-text-color)">${s("no_tasks_short",e)}</span>`}
                    </div>
                  </div>
                `})}
            </div>
          `}
      </div>
    `}_openGroupCreate(){this.shadowRoot.querySelector("maintenance-group-dialog")?.openCreate()}_openGroupEdit(t){let e=this._groups[t];e&&this.shadowRoot.querySelector("maintenance-group-dialog")?.openEdit(t,e)}async _deleteGroup(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");(i?await i.confirm({title:s("delete_group",this._lang),message:s("delete_group_confirm",this._lang).replace("{name}",e),confirmText:s("delete",this._lang)}):confirm(`${s("delete_group_confirm",this._lang).replace("{name}",e)}`))&&await this._runAction({type:"maintenance_supporter/group/delete",group_id:t})}_renderBudgetTiles(){let t=this._budget;if(!t)return d;let e=this._lang,i=this._currencySymbol,a=(l,p,c)=>{if(c!==null){let h=Math.min(100,Math.max(0,p/c*100)),g=h>=100?"var(--error-color, #f44336)":h>=t.alert_threshold_pct?"var(--warning-color, #ff9800)":"var(--success-color, #4caf50)";return o`
          <div class="stat-item budget-tile" title="${l}: ${p.toFixed(2)} / ${c.toFixed(2)} ${i}">
            <span class="stat-value budget-tile-value">${p.toFixed(2)} ${i}</span>
            <span class="budget-tile-max">/ ${c.toFixed(0)} ${i}</span>
            <div class="budget-tile-bar"><div style="width:${h}%; background:${g}"></div></div>
            <span class="stat-label">${l}</span>
          </div>
        `}return o`
        <div class="stat-item budget-tile" title="${l}: ${p.toFixed(2)} ${i}">
          <span class="stat-value budget-tile-value">${p.toFixed(2)} ${i}</span>
          <span class="stat-label">${l}</span>
        </div>
      `};return o`
      ${a(s("budget_monthly",e),t.monthly_spent||0,t.monthly_budget>0?t.monthly_budget:null)}
      ${a(s("budget_yearly",e),t.yearly_spent||0,t.yearly_budget>0?t.yearly_budget:null)}
    `}_renderOverviewRow(t){let e=this._lang,i=t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0,a=0,l=zt.ok,p=!1;if(i&&t.days_until_due!==null){let _=Bt(t.interval_days,t.days_until_due,t.interval_unit);a=_.pct,p=_.overflow,t.status==="overdue"?l=zt.overdue:t.status==="due_soon"&&(l=zt.due_soon)}let c=t.area_id?this.hass?.areas?.[t.area_id]?.name:null,h=t.responsible_user_id?this._userService?.getUserName(t.responsible_user_id):null,g=t.group_names.length>0||c||h,v=this._bulkMode&&this._bulkSelected.has(this._bulkKey(t));return o`
      <div class="task-row${t.enabled?"":" task-disabled"}${v?" bulk-selected":""}">
        ${this._bulkMode?o`
          <label class="cell bulk-check" @click=${_=>_.stopPropagation()}>
            <input type="checkbox" .checked=${v} @change=${()=>this._toggleBulkRow(t)} />
          </label>
        `:d}
        <span class="cell-badges">
          ${this._statusBadge(!!t.archived,t.is_done,t.status)}
          ${t.enabled?d:o`<span class="badge-disabled">${s("disabled",e)}</span>`}
          ${t.nfc_tag_id?o`<span class="nfc-badge" title="${s("nfc_linked",e)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:d}
          ${t.priority==="high"?o`<span class="priority-badge priority-high" title="${s("priority_high",e)}"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>`:d}
          ${t.priority==="low"?o`<span class="priority-badge priority-low" title="${s("priority_low",e)}"><ha-icon icon="mdi:chevron-double-down"></ha-icon></span>`:d}
        </span>
        <span class="cell object-name" @click=${_=>{_.stopPropagation(),this._showObject(t.entry_id)}}>${t.object_name}</span>
        <span class="cell task-name" @click=${()=>this._showTask(t.entry_id,t.task_id)}>${t.task_name}</span>
        <span class="task-sub${g?"":" task-sub-empty"}">
          ${t.group_names.length>0?o`
            <span class="sub-chip" title="${s("groups",e)}">
              <ha-icon icon="mdi:folder-outline"></ha-icon>${t.group_names.join(", ")}
            </span>`:d}
          ${c?o`
            <span class="sub-chip">
              <ha-icon icon="mdi:map-marker-outline"></ha-icon>${c}
            </span>`:d}
          ${h?o`
            <span class="sub-chip" title="${s("responsible_user",e)}">
              <ha-icon icon="mdi:account-outline"></ha-icon>${h}
            </span>`:d}
          ${(t.labels||[]).map(_=>o`
            <span class="sub-chip label-chip" title="${s("labels",e)}">
              <ha-icon icon="mdi:tag-outline"></ha-icon>${_}
            </span>`)}
        </span>
        <span class="cell type">${s(t.type,e)}</span>
        <span class="due-cell" @click=${()=>this._showTask(t.entry_id,t.task_id)}>
          <span class="due-text">${_t(t.days_until_due,e)}</span>
          ${i?o`<div class="days-bar"><div class="days-bar-fill${p?" overflow":""}" style="width:${a}%;background:${l}"></div></div>`:d}
          ${t.trigger_config?ae(t):!i&&t.trigger_active?o`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:d}
          ${re(t,this._miniStatsData,this._lang)}
        </span>
        <span class="row-actions">
          <mwc-icon-button class="btn-complete" title="${s("complete",e)}" @click=${_=>{_.stopPropagation(),this._openCompleteDialogForRow(t)}}>
            <ha-icon icon="mdi:check"></ha-icon>
          </mwc-icon-button>
          <mwc-icon-button class="btn-skip" title="${s("skip",e)}" .disabled=${this._actionLoading} @click=${_=>{_.stopPropagation(),this._promptSkipTask(t.entry_id,t.task_id)}}>
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </mwc-icon-button>
        </span>
      </div>
    `}_openCompleteDialogForRow(t){let i=this._objects.find(a=>a.entry_id===t.entry_id)?.tasks.find(a=>a.id===t.task_id);this._openCompleteDialog(t.entry_id,t.task_id,t.task_name,this._features.checklists?i?.checklist:void 0,this._features.adaptive&&!!i?.adaptive_config?.enabled)}_renderObjectDetail(){if(!this._selectedEntryId)return d;let t=this._getObject(this._selectedEntryId);if(!t)return o`<p>Object not found.</p>`;let e=t.object,i=this._lang,a=this._isOperator,l=t.tasks.filter(c=>c.archived).length,p=t.tasks.filter(c=>this._showArchived||!c.archived);return o`
      <div class="detail-section">
        <div class="detail-header">
          <h2>${e.name}</h2>
          <div class="action-buttons">
            ${a?d:o`
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(c=>c?.openCreate(t.entry_id))}}>${s("add_task",i)}</ha-button>
              <ha-button appearance="plain" @click=${()=>{this._ui("maintenance-object-dialog").then(c=>c?.openEdit(t.entry_id,e))}}>${s("edit",i)}</ha-button>
            `}
            <div class="more-menu-wrapper">
              <ha-icon-button .disabled=${this._actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${()=>this._toggleObjMenu()}></ha-icon-button>
              ${this._objMenuOpen?o`
                <div class="popup-menu" @click=${c=>c.stopPropagation()}>
                  <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._openQrForObject(t.entry_id,e.name)}}>${s("qr_code",i)}</div>
                  <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._printObjectReport(t.entry_id)}}>${s("report_button",i)}</div>
                  ${a?d:o`
                    <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._duplicateObject(t.entry_id)}}>${s("duplicate",i)}</div>
                    ${e.archived?d:o`
                      <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._togglePauseObject(t.entry_id,!!e.paused)}}>${e.paused?s("resume_object",i):s("pause_object",i)}</div>
                      <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._replaceObject(t.entry_id,e.name)}}>${s("replace_object",i)}</div>
                    `}
                    <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._toggleArchiveObject(t.entry_id,!!e.archived)}}>${e.archived?s("unarchive_object",i):s("archive_object",i)}</div>
                    <div class="popup-menu-divider"></div>
                    <div class="popup-menu-item danger" @click=${()=>{this._closeObjMenu(),this._deleteObject(t.entry_id)}}>${s("delete",i)}</div>
                  `}
                </div>
              `:d}
            </div>
          </div>
        </div>
        ${e.paused?o`<p class="meta paused-meta">
              <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
              ${s("object_paused_badge",i)}${e.paused_until?o` — ${s("paused_until_label",i)} ${V(e.paused_until,i)}`:d}
            </p>`:d}
        ${e.manufacturer||e.model?o`<p class="meta">${[e.manufacturer,e.model].filter(Boolean).join(" ")}</p>`:d}
        ${e.serial_number?o`<p class="meta">${s("serial_number_label",i)}: ${e.serial_number}</p>`:d}
        ${W(e.documentation_url)?o`<p class="meta">${s("documentation_url_label",i)}:
              <a href=${e.documentation_url} target="_blank" rel="noopener noreferrer">${e.documentation_url}</a>
            </p>`:(e.manual_docs||[]).length?o`<p class="meta">${s("documentation_url_label",i)}:
                ${e.manual_docs.slice(0,3).map((c,h)=>o`${h>0?" \xB7 ":""}<a href="#"
                    @click=${g=>{g.preventDefault(),this._openManualDoc(c)}}>${c.title}</a>`)}${e.manual_docs.length>3?o` … +${e.manual_docs.length-3}`:d}
              </p>`:d}
        ${e.installation_date?o`<p class="meta">${s("installed",i)}: ${V(e.installation_date,i)}</p>`:d}
        ${e.warranty_expiry?this._renderWarrantyMeta(e.warranty_expiry,i):d}
        ${e.notes?o`<div class="object-notes">
              <div class="object-notes-label">${s("object_notes_label",i)}</div>
              <div class="object-notes-body">${Vt(e.notes)}</div>
            </div>`:d}

        <h3>${s("tasks",i)} (${p.length})${l>0?o`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            appearance="plain"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?s("hide_archived",i):`${s("show_archived",i)} (${l})`}
          </ha-button>`:d}</h3>
        ${t.tasks.length===0?o`<div class="empty-state-centered">
              <p class="empty">${s("no_tasks_yet",i)}</p>
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(c=>c?.openCreate(t.entry_id))}}>${s("add_first_task",i)}</ha-button>
            </div>`:o`<div class="task-table">${[...p].sort((c,h)=>{let g={overdue:0,triggered:1,due_soon:2,ok:3};return(g[c.status]??9)-(g[h.status]??9)||(c.days_until_due??99999)-(h.days_until_due??99999)}).map(c=>o`
              <div class="task-row${c.enabled?"":" task-disabled"}">
                <span class="cell-badges">
                  ${this._statusBadge(!!c.archived,!!c.is_done,c.status)}
                  ${c.enabled?d:o`<span class="badge-disabled">${s("disabled",i)}</span>`}
                  ${c.nfc_tag_id?o`<span class="nfc-badge" title="${s("nfc_linked",i)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:d}
                  ${c.document_count?o`<span class="doc-badge" title="${c.document_count} ${s("documents",i)}"><ha-icon icon="mdi:paperclip"></ha-icon>${c.document_count}</span>`:d}
                </span>
                <span class="cell task-name" @click=${()=>this._showTask(t.entry_id,c.id)}>${c.name}</span>
                <span class="task-sub${c.responsible_user_id?"":" task-sub-empty"}">${ne(c,h=>this._userService?.getUserName(h)??null)}</span>
                <span class="cell type">${s(c.type,i)}</span>
                <span class="due-cell" @click=${()=>this._showTask(t.entry_id,c.id)}>
                  <span class="due-text">${_t(c.days_until_due,i)}</span>
                  ${c.trigger_config?ae(c):d}
                  ${re(c,this._miniStatsData,this._lang)}
                </span>
                <span class="row-actions">
                  <mwc-icon-button class="btn-complete" title="${s("complete",i)}" @click=${h=>{h.stopPropagation(),this._openCompleteDialog(t.entry_id,c.id,c.name,this._features.checklists?c.checklist:void 0,this._features.adaptive&&!!c.adaptive_config?.enabled)}}>
                    <ha-icon icon="mdi:check"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button class="btn-skip" title="${s("skip",i)}" .disabled=${this._actionLoading} @click=${h=>{h.stopPropagation(),this._promptSkipTask(t.entry_id,c.id)}}>
                    <ha-icon icon="mdi:skip-next"></ha-icon>
                  </mwc-icon-button>
                </span>
              </div>
            `)}</div>`}

        <maintenance-documents-section
          .hass=${this.hass}
          .entryId=${t.entry_id}
          .canWrite=${!a}
        ></maintenance-documents-section>

        <maintenance-parts-section
          .hass=${this.hass}
          .entryId=${t.entry_id}
          .parts=${t.parts||[]}
          .canWrite=${!a}
          .currencySymbol=${this._currencySymbol}
          @parts-changed=${()=>this._loadData()}
        ></maintenance-parts-section>

        <maintenance-object-history-section
          .hass=${this.hass}
          .entryId=${t.entry_id}
          .object=${e}
          .tasks=${t.tasks}
          .currencySymbol=${this._currencySymbol}
          .userName=${c=>this._userService?.getUserName(c)??null}
          @open-task=${c=>this._showTask(t.entry_id,c.detail.taskId)}
        ></maintenance-object-history-section>
      </div>
    `}_renderNewMenu(t){return o`
      <div class="new-menu-wrapper">
        <ha-button appearance="filled" class="new-menu-button"
          @click=${e=>{e.stopPropagation(),this._toggleNewMenu()}}>
          <ha-icon icon="mdi:plus"></ha-icon> ${s("add",t)}
          <ha-icon icon="mdi:menu-down"></ha-icon>
        </ha-button>
        ${this._newMenuOpen?o`
          <div class="popup-menu new-menu-popup" @click=${e=>e.stopPropagation()}>
            <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._ui("maintenance-task-dialog").then(e=>e?.openCreate("",this._objects))}}>
              <ha-icon icon="mdi:clipboard-plus-outline"></ha-icon> ${s("new_task",t)}
            </div>
            <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._ui("maintenance-object-dialog").then(e=>e?.openCreate())}}>
              <ha-icon icon="mdi:package-variant-closed-plus"></ha-icon> ${s("new_object",t).replace(/^\+\s*/,"")}
            </div>
            <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._openTemplateGallery()}}>
              <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon> ${s("templates_from",t)}
            </div>
            <div class="popup-menu-divider"></div>
            <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._openAdoptProblemSensors()}}>
              <ha-icon icon="mdi:alert-circle-check-outline"></ha-icon> ${s("adopt_problem_button",t)}
            </div>
            <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._openSuggestedSetups()}}>
              <ha-icon icon="mdi:auto-fix"></ha-icon> ${s("setups_button",t)}
            </div>
            ${this._batteryFleetSetupAvailable?o`
              <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._setupBatteryFleet()}}>
                <ha-icon icon="mdi:battery-sync"></ha-icon> ${s("battery_fleet_setup_button",t)}
              </div>
            `:d}
          </div>
        `:d}
      </div>
    `}_togglePopup(t,e){let i=!t();e(i),i&&setTimeout(()=>{let a=()=>{e(!1),document.removeEventListener("click",a)};document.addEventListener("click",a)},0)}_toggleNewMenu(){this._togglePopup(()=>this._newMenuOpen,t=>{this._newMenuOpen=t})}_closeNewMenu(){this._newMenuOpen=!1}_isYoungInstall(){let t=this._objects.filter(i=>!i.object?.battery_fleet),e=t.reduce((i,a)=>i+a.tasks.length,0);return t.length<3&&e<8}_gsDismissed(){try{return new Set(JSON.parse(J(A.gettingStartedDismissed)||"[]"))}catch{return new Set}}_dismissGettingStarted(t){let e=this._gsDismissed();e.add(t);try{q(A.gettingStartedDismissed,JSON.stringify([...e]))}catch{}this.requestUpdate()}_maybeLoadGettingStarted(){this._gsLoaded||!this._isYoungInstall()||(this._gsLoaded=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/discover"}).then(t=>{this._gsSetupsCount=(t.setups||[]).length}).catch(()=>{this._gsSetupsCount=0}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/problem_sensors/discover"}).then(t=>{this._gsAdoptCount=(t.sensors||[]).length}).catch(()=>{this._gsAdoptCount=0}))}_renderGettingStartedChips(t){let e=this._gsDismissed(),i=this._isYoungInstall(),a=[];return i&&this._gsSetupsCount>0&&!e.has("setups")&&a.push({id:"setups",icon:"mdi:auto-fix",text:s("gs_setups_chip",t).replace("{n}",String(this._gsSetupsCount)),run:()=>this._openSuggestedSetups()}),i&&this._gsAdoptCount>0&&!e.has("adopt")&&a.push({id:"adopt",icon:"mdi:alert-circle-check-outline",text:s("gs_adopt_chip",t).replace("{n}",String(this._gsAdoptCount)),run:()=>this._openAdoptProblemSensors()}),this._batteryFleetSetupAvailable&&!e.has("fleet")&&a.push({id:"fleet",icon:"mdi:battery-sync",text:s("gs_fleet_chip",t),run:()=>this._setupBatteryFleet()}),a.length===0?d:o`
      <div class="gs-chips-wrap">
        <div class="gs-chips-label">${s("gs_label",t)}</div>
        <div class="gs-chips">
          ${a.map(l=>o`
            <div class="gs-chip" @click=${()=>l.run()}>
              <ha-icon icon="${l.icon}"></ha-icon>
              <span>${l.text}</span>
              <span class="gs-chip-x" title="${s("dismiss",t)}"
                @click=${p=>{p.stopPropagation(),this._dismissGettingStarted(l.id)}}>
                <ha-icon icon="mdi:close"></ha-icon>
              </span>
            </div>
          `)}
        </div>
      </div>
    `}_toggleObjMenu(){this._togglePopup(()=>this._objMenuOpen,t=>{this._objMenuOpen=t})}_closeObjMenu(){this._objMenuOpen=!1}_toggleMoreMenu(){this._togglePopup(()=>this._moreMenuOpen,t=>{this._moreMenuOpen=t})}_closeMoreMenu(){this._moreMenuOpen=!1}get _sparklineCtx(){return{lang:this._lang,detailStatsData:this._detailStatsData,hasStatsService:!!this._statsService,historyFallbackIds:this._statsService?.historyFallbackIds,isCounterEntity:t=>this._isCounterEntity(t),rangeDays:this._chartRangeDays,setRangeDays:t=>this._setChartRange(t),hideOutliers:this._hideOutliers,setHideOutliers:t=>this._setHideOutliers(t)}}_toggleSection(t){let e=new Set(this._collapsedSections);e.has(t)?e.delete(t):e.add(t),this._collapsedSections=e;try{q(A.collapsedSections,JSON.stringify([...e]))}catch{}}_historyCtx(){let t=this._selectedEntryId&&this._selectedTaskId?this._getObject(this._selectedEntryId)?.tasks.find(l=>l.id===this._selectedTaskId):void 0,e=this._fullHistory,a=(e&&e.entryId===this._selectedEntryId&&e.taskId===this._selectedTaskId&&e.entries.length>(t?.history||[]).length?e.entries:t?.history||[]).filter(l=>l.reading_value!=null).sort((l,p)=>l.timestamp.localeCompare(p.timestamp));return{lang:this._lang,hass:this.hass,filter:this._historyFilter,search:this._historySearch,currencySymbol:this._currencySymbol,setFilter:l=>{this._historyFilter=l},setSearch:l=>{this._historySearch=l},openEdit:l=>this._openHistoryEdit(l),readingUnit:t?.reading_unit??null,phaseNames:Object.fromEntries(Object.entries(t?.phases||{}).map(([l,p])=>[l,p.name])),readingDelta:l=>{let p=a.findIndex(c=>c.timestamp===l.timestamp);return p<=0?null:l.reading_value-a[p-1].reading_value}}}_taskDetailCtx(){let t=this._selectedEntryId,e=this._selectedTaskId,i=this._getObject(t);return{lang:this._lang,hass:this.hass,entryId:t,taskId:e,objectName:i?.object.name||"",objectDocUrl:i?.object?.documentation_url??null,objectManualDocs:i?.object?.manual_docs??[],openManualDoc:a=>this._openManualDoc(a),setChecklistItem:(a,l)=>this._setChecklistItem(t,e,a,l),setPhaseCursor:a=>{this._runAction({type:"maintenance_supporter/task/set_phase",entry_id:t,task_id:e,cursor:a})},isOperator:this._isOperator,actionLoading:this._actionLoading,moreMenuOpen:this._moreMenuOpen,activeTab:this._activeTab,features:this._features,currencySymbol:this._currencySymbol,collapsedSections:this._collapsedSections,costDurationToggle:this._costDurationToggle,suggestionDismissed:this._dismissedSuggestions.has(`${t}_${e}`),sparkline:this._sparklineCtx,history:this._historyCtx(),getUserName:a=>this._userService?.getUserName(a)??null,setActiveTab:a=>{this._activeTab=a},toggleSection:a=>this._toggleSection(a),setCostDurationToggle:a=>{this._costDurationToggle=a},showTaskView:()=>{this._view="task"},showObject:()=>this._showObject(t),toggleMoreMenu:()=>this._toggleMoreMenu(),closeMoreMenu:()=>this._closeMoreMenu(),openEdit:a=>{this._ui("maintenance-task-dialog").then(l=>l?.openEdit(t,a))},openComplete:a=>this._openCompleteDialog(t,e,a.name,this._features.checklists?a.checklist:void 0,this._features.adaptive&&!!a.adaptive_config?.enabled),promptSkip:()=>this._promptSkipTask(t,e),toggleArchive:a=>this._toggleArchiveTask(t,e,a),openQr:a=>this._openQrForTask(t,e,i?.object.name||"",a),duplicateTask:()=>this._duplicateTask(t,e),promptReset:()=>this._promptResetTask(t,e),promptPostpone:()=>this._promptPostponeTask(t,e),snoozeTask:()=>this._snoozeTask(t,e),printWorksheet:()=>this._printTaskWorksheet(t,e),deleteTask:()=>this._deleteTask(t,e),applySuggestion:a=>this._applySuggestion(t,e,a),reanalyze:()=>this._reanalyzeInterval(t,e),dismissSuggestion:()=>this._dismissSuggestion(t,e),openSeasonalOverrides:a=>this._openSeasonalOverrides(a)}}async _fetchFullHistory(t,e){try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:t,task_id:e});this._selectedEntryId===t&&this._selectedTaskId===e&&(this._fullHistory={entryId:t,taskId:e,entries:i.history||[]})}catch{this._fullHistory=null}}_renderTaskDetail(){if(!this._selectedEntryId||!this._selectedTaskId)return d;let t=this._getTask(this._selectedEntryId,this._selectedTaskId);if(!t)return o`<p>Task not found.</p>`;let e=this._fullHistory,i=e&&e.entryId===this._selectedEntryId&&e.taskId===this._selectedTaskId&&e.entries.length>(t.history||[]).length?{...t,history:e.entries}:t;return o`<maintenance-task-detail-view
      .task=${i}
      .ctx=${this._taskDetailCtx()}
    ></maintenance-task-detail-view>`}_openHistoryEdit(t){if(!this._selectedEntryId||!this._selectedTaskId)return;let e={entry_id:this._selectedEntryId,task_id:this._selectedTaskId,original_timestamp:t.timestamp,type:t.type,timestamp:t.timestamp,notes:t.notes??null,cost:t.cost??null,duration:t.duration??null,completed_by:t.completed_by??null,used_parts:t.used_parts??null};this.shadowRoot?.querySelector("maintenance-history-edit-dialog")?.openEdit(e)}};x.styles=[Ft,Ie],u([$({attribute:!1})],x.prototype,"hass",2),u([$({type:Boolean,reflect:!0})],x.prototype,"narrow",2),u([$({attribute:!1})],x.prototype,"panel",2),u([m()],x.prototype,"_objects",2),u([m()],x.prototype,"_stats",2),u([m()],x.prototype,"_view",2),u([m()],x.prototype,"_allParts",2),u([m()],x.prototype,"_selectedEntryId",2),u([m()],x.prototype,"_selectedTaskId",2),u([m()],x.prototype,"_filterStatus",2),u([m()],x.prototype,"_filterUser",2),u([m()],x.prototype,"_filterLabel",2),u([m()],x.prototype,"_filterPriority",2),u([m()],x.prototype,"_savedViews",2),u([m()],x.prototype,"_activeViewId",2),u([m()],x.prototype,"_unsub",2),u([m()],x.prototype,"_chartRangeDays",2),u([m()],x.prototype,"_hideOutliers",2),u([m()],x.prototype,"_historyFilter",2),u([m()],x.prototype,"_budget",2),u([m()],x.prototype,"_groups",2),u([m()],x.prototype,"_detailStatsData",2),u([m()],x.prototype,"_miniStatsData",2),u([m()],x.prototype,"_features",2),u([m()],x.prototype,"_adminPanelUserIds",2),u([m()],x.prototype,"_operatorWriteEnabled",2),u([m()],x.prototype,"_defaultWarningDays",2),u([m()],x.prototype,"_actionLoading",2),u([m()],x.prototype,"_moreMenuOpen",2),u([m()],x.prototype,"_objMenuOpen",2),u([m()],x.prototype,"_toastMessage",2),u([m()],x.prototype,"_toastUndo",2),u([m()],x.prototype,"_toastActionLabel",2),u([m()],x.prototype,"_filtersOpen",2),u([m()],x.prototype,"_newMenuOpen",2),u([m()],x.prototype,"_gsSetupsCount",2),u([m()],x.prototype,"_gsAdoptCount",2),u([m()],x.prototype,"_batteryFleetSetupAvailable",2),u([m()],x.prototype,"_staleBundle",2),u([m()],x.prototype,"_overviewTab",2),u([m()],x.prototype,"_activeTab",2),u([m()],x.prototype,"_costDurationToggle",2),u([m()],x.prototype,"_historySearch",2),u([m()],x.prototype,"_sortMode",2),u([m()],x.prototype,"_objectSortMode",2),u([m()],x.prototype,"_groupByMode",2),u([m()],x.prototype,"_objectViewMode",2),u([m()],x.prototype,"_objectsTableColumns",2),u([m()],x.prototype,"_showArchived",2),u([m()],x.prototype,"_bulkMode",2),u([m()],x.prototype,"_bulkSelected",2),u([m()],x.prototype,"_virtStart",2),u([m()],x.prototype,"_virtEnd",2),u([m()],x.prototype,"_collapsedSections",2),u([m()],x.prototype,"_paletteOpen",2),u([m()],x.prototype,"_paletteQuery",2),u([m()],x.prototype,"_paletteActive",2),u([m()],x.prototype,"_templateGalleryOpen",2),u([m()],x.prototype,"_templates",2),u([m()],x.prototype,"_templateCategories",2),u([m()],x.prototype,"_templateBusy",2),u([m()],x.prototype,"_fullHistory",2),x=u([ce("maintenance-supporter-panel")],x);export{x as MaintenanceSupporterPanel};
