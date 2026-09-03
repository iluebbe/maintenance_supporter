/*! maintenance_supporter frontend 2.74.0 */
import{a as ye,b as Ft,c as xt,d as Vt,e as Dt,f as xe,g as we,h as ke}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-EMQQ7OLP.js";import{E as Le,H as He,a as X,b as Ut,c as qt,d as Te,e as je,f as Wt,g as Se,h as Ee,i as j,j as At,k as ut,l as $t,m as Mt,n as ae,o as Gt,p as Yt,q as Ce,r as Re,s as Oe,t as De,u as Ae,v as ze,w as Pe,x as Ie}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-T4NXNE6P.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-MESNEW3F.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-GV4G354Y.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-OFC6OKGF.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-EUJZWPBG.js";import{b as $e}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YP2KCO26.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-VLQ4FCHW.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-UJ7FC2Z7.js";import{a as se}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-EOLJHFO4.js";import{a as Me}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-S2VAROHZ.js";import{a as C}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-NYOACMQR.js";import{A as Et,B as yt,F as ve,G as be,I as Rt,J as Ot,K as fe,L as Bt,a as u,b as O,c as r,d as V,f as d,h as D,i as ie,j as ge,k as me,l as k,m,n as Lt,o as Ht,p as Nt,q as s,r as St,s as H,t as _e,u as J,w as U,x as B,z as q}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-Y2JXJRDF.js";var ui=["assignee_pool","required_completion_fields","checklist","labels","history"],gi=["checklist_progress"],mi=["tasks","parts"],_i=["manual_docs","battery_fleet_excluded"];function re(n,c,t=[]){for(let e of c)n[e]===void 0&&(n[e]=[]);for(let e of t)n[e]===void 0&&(n[e]={})}function vi(n){let c=n;re(c,mi),c.object&&typeof c.object=="object"&&re(c.object,_i);for(let t of c.tasks)re(t,ui,gi);return n}function zt(n){for(let c of n)vi(c);return n}function bi(n,c){if(c.objects)return c.objects;let t=c.delta||[],e=c.removed||[];if(!t.length&&!e.length)return null;let i=new Map(n.map(a=>[a.entry_id,a]));for(let a of t)i.set(a.entry_id,a);for(let a of e)i.delete(a);return[...i.values()]}function Ne(n,c){return c.objects&&zt(c.objects),c.delta&&zt(c.delta),bi(n,c)}var P={overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort"};function it(n){try{return localStorage.getItem(n)}catch{return null}}function Y(n,c){try{localStorage.setItem(n,c)}catch{}}var fi=168*3600*1e3;function Be(){try{let n=it(P.objectsCache);if(!n)return null;let c=JSON.parse(n);return c.v!==ie||!Number.isFinite(c.at)||Date.now()-c.at>fi||!Array.isArray(c.objects)||c.objects.length===0?null:{objects:c.objects,stats:c.stats??null}}catch{return null}}function oe(n,c){if(!(!Array.isArray(n)||n.length===0))try{let t={v:ie,at:Date.now(),objects:n,stats:c};Y(P.objectsCache,JSON.stringify(t))}catch{}}function I(n){return String(n??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c])}function Fe(n,c,t,e,i,a){let o=[[t.manufacturer,n.manufacturer],[t.model,n.model],[t.serial,n.serial_number],[t.installed,n.installation_date?e(n.installation_date):null],[t.warranty,n.warranty_expiry?e(n.warranty_expiry):null]].filter(([,h])=>!!h),p=c.map(h=>{let g=t.scheduleLabel(h);return`<tr>
      <td>${I(h.name)}</td>
      <td>${I(t.typeLabel(h.type))}</td>
      <td>${I(t.statusLabel(h.status))}</td>
      <td>${I(g)}</td>
      <td>${I(h.last_performed?e(h.last_performed):t.none)}</td>
      <td>${I(h.next_due?e(h.next_due):t.none)}</td>
      <td class="num">${h.times_performed??0}</td>
      <td class="num">${I(i(h.total_cost??0))}</td>
    </tr>`}).join(""),l=c.reduce((h,g)=>h+(g.total_cost??0),0);return`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${I(t.title)} \u2014 ${I(n.name)}</title>
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
  <h1>${I(n.name)}</h1>
  <p class="sub">${I(t.title)} \xB7 ${I(t.generated)}: ${I(e(a))}</p>
  ${o.length?`<div class="meta">${o.map(([h,g])=>`<div><div class="k">${I(h)}</div>${I(g)}</div>`).join("")}</div>`:""}
  <h2>${I(t.tasksHeading)} (${c.length})</h2>
  <table>
    <thead><tr>
      <th>${I(t.colTask)}</th><th>${I(t.colType)}</th><th>${I(t.colStatus)}</th>
      <th>${I(t.colSchedule)}</th><th>${I(t.colLastDone)}</th><th>${I(t.colNextDue)}</th>
      <th class="num">${I(t.colTimes)}</th><th class="num">${I(t.colCost)}</th>
    </tr></thead>
    <tbody>${p||`<tr><td colspan="8">${I(t.none)}</td></tr>`}</tbody>
    <tfoot><tr><td colspan="7">${I(t.totalCost)}</td><td class="num">${I(i(l))}</td></tr></tfoot>
  </table>
  ${n.notes?`<div class="notes"><strong>${I(t.notes)}:</strong>
${I(n.notes)}</div>`:""}
</body></html>`}function ne(n,c=new Date){if(!n)return{kind:"none",days:null,date:null};let t=new Date(`${n}T00:00:00`);if(isNaN(t.getTime()))return{kind:"none",days:null,date:null};let e=Date.UTC(c.getFullYear(),c.getMonth(),c.getDate()),i=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),a=Math.round((i-e)/864e5);return a<0?{kind:"expired",days:a,date:n}:a<=60?{kind:"expiring",days:a,date:n}:{kind:"valid",days:a,date:n}}var L=n=>String(n??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);function Ve(n,c,t,e,i,a,o,p,l,h=[]){let g=[[t.object,L(c)],[t.type,L(t.typeLabel(n.type))],[t.interval,L(i(n))],[t.nextDue,n.next_due?L(e(n.next_due)):"\u2014"],[t.lastDone,n.last_performed?L(e(n.last_performed)):L(t.never)]];n.priority&&n.priority!=="normal"&&g.push([t.priority,L(n.priority)]);let v=(n.checklist||[]).map(f=>`<li><span class="box"></span>${L(f)}</li>`).join(""),_=(f,y)=>f?`<figure class="qr"><img src="${f}" alt="" /><figcaption>${L(y)}</figcaption></figure>`:"";return`<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="color-scheme" content="light">
<title>${L(n.name)} \u2014 ${L(t.title)}</title>
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
      <h1>${L(n.name)}</h1>
      <div class="obj">${L(c)}</div>
    </div>
    <div class="qr-row">
      ${_(a,t.scanView)}
      ${_(o,t.scanComplete)}
    </div>
  </header>
  <table class="meta">
    ${g.map(([f,y])=>`<tr><td>${L(f)}</td><td>${y}</td></tr>`).join("")}
  </table>
  ${v?`<h2>${L(t.checklist)}</h2><ul class="check">${v}</ul>`:""}
  ${h.length?`<h2>${L(t.parts)}</h2><ul class="check">${h.map(f=>`<li><span class="box"></span>${L(f)}</li>`).join("")}</ul>`:""}
  ${n.notes?`<h2>${L(t.notes)}</h2><div class="notes">${L(n.notes)}</div>`:""}
  ${p?`<h2>${L(t.manualExcerpt)}</h2>
    <div class="excerpt">${L(p.title)} \u2014 ${L(t.pages)} ${p.startPage}\u2013${p.endPage}:
      <a href="${L(p.url)}" target="_blank" rel="noopener">PDF</a>
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
  <footer>${L(c)} \xB7 ${L(n.name)} \xB7 ${L(t.printedOn)} ${L(l.slice(0,10))}</footer>
</body></html>`}var Ue=O`
  :host {
    display: block;
    height: 100%;
    background: var(--primary-background-color);
  }

  /* The panel lays itself out: a bounded host, the header on top and
     .content as THE scroll container (virtualized table, sticky bulk bar
     and the docked split-view detail all hang off its scroll position).
     HA 2026.8 started wrapping custom panels in a height-less, safe-area
     padded block — which turned our 100% into "auto" and moved scrolling to
     the document. panel.py opts out of that wrapper (handle_safe_area), so
     the insets are ours to apply: same padding HA would have added, inside
     the bounded box. The vars are 0 on desktop / older cores. */
  .panel {
    height: 100%;
    box-sizing: border-box;
    padding:
      var(--safe-area-inset-top, 0px)
      var(--safe-area-content-inset-right, var(--safe-area-inset-right, 0px))
      var(--safe-area-inset-bottom, 0px)
      var(--safe-area-content-inset-left, var(--safe-area-inset-left, 0px));
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

  /* Saved-views "save" icon-button sits in the select row: size it to the
     select (36px) so its icon centres on the select, not 6px above it.
     HA ≥2025.11 sizes ha-icon-button via --ha-icon-button-size (the old
     --mdc-icon-button-size is a no-op there); older cores the other way
     round, so declare both. */
  .views-save-btn {
    --ha-icon-button-size: 36px;
    --mdc-icon-button-size: 36px;
    --mdc-icon-size: 20px;
    color: var(--secondary-text-color);
    margin: 0 -2px 0 -4px;
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

  /* Group-by sections: the OUTER .task-table owns the column tracks (every
     breakpoint's template above applies to it unchanged); each section card
     and its row block are column subgrids, so the badge/object/name columns
     line up across sections — a section whose rows are all "OK" no longer
     starts its names 60px left of one that also carries "Overdue". */
  .task-table.grouped > .group-section {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
  }
  .task-table.grouped .group-section-header { grid-column: 1 / -1; }
  .task-table.grouped .group-rows {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    padding: 0 12px;
  }

  /* Object page task list: it has no object-name cell (the page IS the
     object), so under the shared 7-track template every cell sat one track
     to the left — the ~190px action pair landed in the 150px due track and
     poked past the row's right edge (a horizontal scrollbar as soon as a
     classic vertical one took its 17px; wider still with German labels).
     Six tracks for six cells. Below 769px the narrow/tight layouts place
     the cells explicitly and keep their own four tracks. */
  @media (min-width: 769px) {
    .task-table.object-tasks {
      grid-template-columns: auto minmax(120px, 1fr) minmax(0, 220px) 100px 150px auto;
    }
  }
  @media (min-width: 1200px) {
    .task-table.object-tasks {
      grid-template-columns: auto fit-content(400px) minmax(0, 1fr) 100px 150px auto;
    }
  }

  /* Master-detail split (>=1500px panel, 2026-09-01): list left, docked task
     detail right - the width finally carries content instead of slack. Only
     the dashboard tab uses it; below the threshold everything is unchanged. */
  .split-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(430px, 41%);
    gap: 20px;
    align-items: start;
  }
  .split-list { min-width: 0; }
  /* Inside the split the list is ~60% wide — the type and chips columns are
     redundant there (the docked detail names the type, assignee and labels),
     and squeezed chips read as clutter. Drop both; the task name gets the
     room and the list stays calm. */
  .split-list .task-table { grid-template-columns: auto minmax(100px, 180px) minmax(120px, 1fr) 150px auto; }
  .split-list .task-table.bulk { grid-template-columns: auto auto minmax(100px, 180px) minmax(120px, 1fr) 150px auto; }
  .split-list .cell.type { display: none; }
  .split-list .task-sub { display: none; }
  /* Grouped list: the section cards carry a 12px vertical margin that does
     not collapse inside the grid, so the first card sat 12px below the
     pane's top edge and the two cards read as misaligned. Level them. */
  .split-list .task-table.grouped > .group-section:first-child { margin-top: 0; }
  /* The pane never scrolls on its own: it is as tall as the detail and
     docks scroll-aware (helpers/sticky-pane sets top/margin-top inline) —
     top edge while scrolling up, bottom edge while scrolling down, so a
     long detail is read by scrolling the list, not a nested scrollbar. */
  .split-pane {
    min-width: 0;
    position: sticky;
    top: 8px;
    border: 1px solid var(--divider-color);
    border-radius: 12px;
    padding: 4px 16px 16px;
    background: var(--card-background-color, #fff);
  }
  .split-pane-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 240px;
    gap: 8px;
    color: var(--secondary-text-color);
    text-align: center;
  }
  .split-pane-empty ha-icon { --mdc-icon-size: 40px; opacity: 0.5; }
  .task-row.selected {
    background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
    box-shadow: inset 3px 0 0 var(--primary-color);
  }
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
  .today-row .today-complete { flex: none; --ha-button-font-size: 13px; white-space: nowrap; }
  .today-row .today-complete ha-icon { --mdc-icon-size: 18px; }
  :host([narrow]) .today-row .today-complete,
  :host([tight]) .today-row .today-complete { min-width: 0; --ha-button-height: 36px; }
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
  /* Task name + object name travel as one group: in the wide grids the
     wrapper dissolves (display: contents) so both stay direct grid items in
     their own tracks; the narrow/tight layouts turn it into the first row
     (name left, object right — #150). */
  .row-head { display: contents; }
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
    /* The chips track is minmax(0, …): when the row gets squeezed the track
       may shrink below the chips' natural width — clip instead of painting
       over the neighbouring type column (duty-rotation GIF, 2026-08-30). */
    min-width: 0;
    overflow: hidden;
    /* …and all-or-nothing: below 60 px of track there is no readable chip,
       only fragments — hide them entirely via the container query below. */
    container-type: inline-size;
  }
  @container (max-width: 60px) {
    .sub-chip { display: none; }
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
    /* A single chip wider than the squeezed track truncates instead of
       bleeding into the next column. */
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
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

  /* DESIGN PROTOTYPE (#145 wish 1): labelled, colour-coded action buttons
     instead of bare icons. Complete = filled success pill, Skip = outlined
     warning (orange) pill; both keep the icon as a leading glyph. */
  .row-actions.as-buttons { gap: 4px; }
  .row-actions.as-buttons ha-button {
    --ha-button-font-size: 13px;
    white-space: nowrap;
  }
  .row-actions.as-buttons ha-icon { --mdc-icon-size: 18px; }

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
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 10px;
    padding: 8px 16px;
    background: color-mix(in srgb, var(--primary-color) 14%, var(--card-background-color, #fff));
    border-bottom: 1px solid var(--divider-color);
    font-size: 14px;
  }
  /* The text claims the row; on a phone the buttons wrap under it instead of
     squeezing it into a one-word-per-line column (#150 round, 2026-09-02). */
  .update-banner span {
    flex: 1 1 220px;
  }
  .update-banner ha-button {
    margin-left: auto;
  }
  .update-banner ha-button + ha-button {
    margin-left: 0;
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

  /* Shared column tracks across rows (the wide layout's #66 lesson, applied
     to narrow 2026-09-01): with per-row grids the auto badge/actions columns
     sized independently, so the object-name column started at a different X
     in every row — an "OK" pill vs "Due Soon" + priority chevron made the
     list read jittery. The LIST owns the four tracks, rows subgrid them. */
  :host([narrow]) .task-table {
    display: grid;
    grid-template-columns: auto minmax(76px, 1fr) 100px auto;
    column-gap: 8px;
  }

  :host([narrow]) .task-row {
    /* Mobile: 4-column grid keeps due-cell + actions at deterministic
       X-positions across rows regardless of content (sparkline, bar, %).
       Earlier flex-wrap-based layouts let the row wrap unpredictably so
       "X days" sometimes sat near the middle, sometimes at the right edge.
       Two rows since #150 (was three: name / badge+object+due+actions /
       chips — a phone list scrolled forever):
         row 1  task name ................................ object name
         row 2  [status icon | chips | due 100px | actions]
       The status pill drops its label (icon + colour stay, title/aria keep
       the word), the object name moves up beside the task name, and the
       chips take the freed middle track. */
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
    grid-template-rows: auto auto;
    row-gap: 6px;
    padding: 12px;
  }

  :host([narrow]) .cell.type { display: none; }
  :host([narrow]) .row-head {
    display: flex;
    grid-column: 1 / -1;
    grid-row: 1;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    min-width: 0;
  }
  /* The object page's rows have no object name — there the task name is a
     direct grid item and the grid placement applies; inside .row-head the
     flex rule wins and the grid lines are inert. */
  :host([narrow]) .cell.task-name {
    grid-column: 1 / -1;
    grid-row: 1;
    flex: 1 1 auto;
    min-width: 0;
  }
  :host([narrow]) .cell.object-name {
    order: 1;
    flex: 0 1 auto;
    max-width: 50%;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
  }
  /* Bulk selection on a phone: the checkbox takes the badge column of the
     first row, the name group starts one track further right. */
  :host([narrow]) .task-table.bulk .bulk-check { grid-column: 1; grid-row: 1; align-self: start; }
  :host([narrow]) .task-table.bulk .row-head { grid-column: 2 / -1; }
  :host([narrow]) .cell-badges {
    grid-column: 1;
    grid-row: 2;
    /* Stack extra badges (priority chevron, NFC, disabled) under the status
       pill: in the shared-track table the widest badge ROW sized column 1
       for every row, and a pill+chevron combo pushed Complete/Skip off the
       right edge at phone widths (2026-09-01). */
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  /* Icon-only status pill (#150): a round 22 px disc; the colour + shape
     still carry the state, the label lives in title/aria-label. */
  :host([narrow]) .task-row .status-label { display: none; }
  :host([narrow]) .task-row .status-badge { min-width: 0; padding: 3px; border-radius: 50%; }
  :host([narrow]) .task-row .status-badge ha-icon { --mdc-icon-size: 16px; margin-left: 0; }
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
  /* Prototype: on phones the two labelled pills stack, so the row keeps its
     deterministic column X-positions and neither label gets truncated. */
  /* Labelled buttons stack when the row cannot hold them side by side:
     narrow viewports AND a tight panel (iPad portrait with the sidebar
     docked — the viewport is not narrow but the panel is ~768 px). */
  :host([narrow]) .row-actions.as-buttons,
  :host([tight]) .row-actions.as-buttons {
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
  }
  :host([narrow]) .row-actions.as-buttons ha-button,
  :host([tight]) .row-actions.as-buttons ha-button { --ha-button-font-size: 12px; }
  /* buttons_compact: the labelled buttons collapse to two icon-only
     ha-buttons side by side (solid green Complete, outlined orange Skip) —
     the colour carries the meaning, the row keeps the icon-era height.
     --wa-form-control-padding-inline is the wa-button inset HA's ha-button
     forwards (16 px default -> a 58 px pill around a 20 px glyph). */
  :host([narrow]) .row-actions.as-buttons.compact,
  :host([tight]) .row-actions.as-buttons.compact { flex-direction: row; align-items: center; gap: 4px; }
  :host([narrow]) .row-actions.compact ha-button,
  :host([tight]) .row-actions.compact ha-button { --ha-button-height: 36px; --wa-form-control-padding-inline: 10px; min-width: 0; }
  :host([narrow]) .row-actions.compact ha-icon,
  :host([tight]) .row-actions.compact ha-icon { --mdc-icon-size: 20px; }

  /* A TIGHT panel that is not narrow (iPad portrait with HA's sidebar
     docked: 1024 px viewport, ~768 px panel) gets the narrow row layout too —
     the wide subgrid overflowed its last column at that width even before
     the buttons. Same rules as the :host([narrow]) block above / the
     max-width:768px media mirror below, keyed on the panel's own width. */
  :host([tight]:not([narrow])) .task-table {
    display: grid;
    grid-template-columns: auto minmax(76px, 1fr) 100px auto;
    column-gap: 8px;
  }
  :host([tight]:not([narrow])) .task-row {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
    grid-template-rows: auto auto;
    row-gap: 6px;
    padding: 12px;
    min-width: 0;
  }
  :host([tight]:not([narrow])) .cell.type { display: none; }
  :host([tight]:not([narrow])) .row-head { display: flex; grid-column: 1 / -1; grid-row: 1; align-items: baseline; justify-content: space-between; gap: 10px; min-width: 0; }
  :host([tight]:not([narrow])) .cell.task-name { grid-column: 1 / -1; grid-row: 1; flex: 1 1 auto; min-width: 0; }
  :host([tight]:not([narrow])) .cell.object-name { order: 1; flex: 0 1 auto; max-width: 50%; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; }
  :host([tight]:not([narrow])) .task-table.bulk .bulk-check { grid-column: 1; grid-row: 1; align-self: start; }
  :host([tight]:not([narrow])) .task-table.bulk .row-head { grid-column: 2 / -1; }
  :host([tight]:not([narrow])) .cell-badges { grid-column: 1; grid-row: 2; flex-direction: column; align-items: flex-start; gap: 4px; }
  :host([tight]:not([narrow])) .task-row .status-label { display: none; }
  :host([tight]:not([narrow])) .task-row .status-badge { min-width: 0; padding: 3px; border-radius: 50%; }
  :host([tight]:not([narrow])) .task-row .status-badge ha-icon { --mdc-icon-size: 16px; margin-left: 0; }
  :host([tight]:not([narrow])) .due-cell { grid-column: 3; grid-row: 2; align-items: flex-end; min-width: 0; }
  :host([tight]:not([narrow])) .row-actions { grid-column: 4; grid-row: 2; }
  :host([tight]:not([narrow])) .task-sub { grid-column: 2; grid-row: 2; align-self: center; font-size: 11px; gap: 4px; justify-content: flex-start; flex-wrap: wrap; }
  :host([tight]:not([narrow])) .task-sub-empty { display: none; }
  :host([tight]:not([narrow])) .mini-sparkline { display: none; }
  :host([tight]:not([narrow])) .trend-arrow { display: inline; }
  /* Chips sit in the middle track of row 2 — the slot the object name
     vacated — vertically centred on the 36 px action buttons. */
  :host([narrow]) .task-sub {
    grid-column: 2;
    grid-row: 2;
    align-self: center;
    font-size: 11px;
    gap: 4px;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  :host([narrow]) .task-sub-empty { display: none; }
  :host([narrow]) .mini-sparkline { display: none; }
  :host([narrow]) .trend-arrow { display: inline; }

  /* Phone band (≤429px): with SHARED tracks the widest badge sizes column 1
     for every row, and the fixed 100px due column + both action buttons no
     longer fit — Skip fell off the right edge. Tighter floors, slimmer row
     padding and a smaller Skip icon-button. Bars stay uniform per
     breakpoint (100px above, 84px here). */
  @media (max-width: 429px) {
    :host([narrow]) .task-table {
      grid-template-columns: auto minmax(64px, 1fr) 84px auto;
      column-gap: 6px;
    }
    :host([narrow]) .task-row { padding: 12px 8px; }
  }

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
    /* Mirror the :host([narrow]) grid layout for narrow desktop windows —
       incl. the shared-track table so rows align (2026-09-01). */
    .task-table {
      display: grid;
      grid-template-columns: auto minmax(76px, 1fr) 100px auto;
      column-gap: 8px;
    }
    .task-row {
      display: grid;
      grid-column: 1 / -1;
      grid-template-columns: subgrid;
      grid-template-rows: auto auto;
      row-gap: 6px;
      padding: 12px;
    }
    .cell.type { display: none; }
    .row-head { display: flex; grid-column: 1 / -1; grid-row: 1; align-items: baseline; justify-content: space-between; gap: 10px; min-width: 0; }
    .cell.task-name { grid-column: 1 / -1; grid-row: 1; flex: 1 1 auto; min-width: 0; }
    .cell.object-name { order: 1; flex: 0 1 auto; max-width: 50%; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; }
    .task-table.bulk .bulk-check { grid-column: 1; grid-row: 1; align-self: start; }
    .task-table.bulk .row-head { grid-column: 2 / -1; }
    .cell-badges { grid-column: 1; grid-row: 2; flex-direction: column; align-items: flex-start; gap: 4px; }
    .task-row .status-label { display: none; }
    .task-row .status-badge { min-width: 0; padding: 3px; border-radius: 50%; }
    .task-row .status-badge ha-icon { --mdc-icon-size: 16px; margin-left: 0; }
    .due-cell { grid-column: 3; grid-row: 2; align-items: flex-end; min-width: 0; }
    .row-actions { grid-column: 4; grid-row: 2; }
    .task-sub { grid-column: 2; grid-row: 2; align-self: center; font-size: 11px; gap: 4px; justify-content: flex-start; flex-wrap: wrap; }
    .task-sub-empty { display: none; }
    .mini-sparkline { display: none; }
    .trend-arrow { display: inline; }
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
`;var Kt=class{constructor(c){this._cache=new Map;this._pending=new Map;this.historyFallbackIds=new Set;this._hass=c}updateHass(c){this._hass=c}async getDetailStats(c,t,e=30){return this._getStats(c,e<=35?"hour":"day",e,t)}async getMiniStats(c,t){return this._getStats(c,"day",14,t)}async getBatchMiniStats(c){let t=new Map,e=[];for(let l of c){let h=`${l.entityId}:day:14`,g=this._cache.get(h);g&&Date.now()-g.fetchedAt<3e5?t.set(l.entityId,g.points):e.push(l)}if(e.length===0)return t;let i=e.filter(l=>l.isCounter).map(l=>l.entityId),a=e.filter(l=>!l.isCounter).map(l=>l.entityId),o=new Date(Date.now()-336*60*60*1e3).toISOString(),p=[];return i.length>0&&p.push(this._fetchBatch(i,"day",o,["state","sum","change"],!0,t)),a.length>0&&p.push(this._fetchBatch(a,"day",o,["mean","min","max"],!1,t)),await Promise.all(p),t}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(c,t,e,i){let a=`${c}:${t}:${e}`,o=this._cache.get(a);if(o&&Date.now()-o.fetchedAt<3e5)return o.points;if(this._pending.has(a))return this._pending.get(a);let p=this._fetchAndNormalize(c,t,e,i,a);this._pending.set(a,p);try{return await p}finally{this._pending.delete(a)}}async _fetchAndNormalize(c,t,e,i,a){let o=new Date(Date.now()-e*24*60*60*1e3).toISOString(),p=i?["state","sum","change"]:["mean","min","max"];try{let h=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:o,statistic_ids:[c],period:t,types:p}))[c]||[],g=this._normalizeRows(h,i);if(g.length<2){let v=await this._fetchHistoryFallback(c,o);v.length>=2?(g=v,this.historyFallbackIds.add(c)):this.historyFallbackIds.delete(c)}else this.historyFallbackIds.delete(c);return this._cache.set(a,{entityId:c,fetchedAt:Date.now(),period:t,points:g}),g}catch(l){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${c}:`,l),[]}}async _fetchHistoryFallback(c,t){try{let i=(await this._hass.connection.sendMessagePromise({type:"history/history_during_period",start_time:t,end_time:new Date().toISOString(),entity_ids:[c],minimal_response:!0,no_attributes:!0}))?.[c]||[];if(i.length>1e3){let p=Math.ceil(i.length/500);i=i.filter((l,h)=>h%p===0||h===i.length-1)}let a=[],o=null;for(let p of i){let l=p.s??p.state;if(l==null||l==="unknown"||l==="unavailable")continue;let h;if(l==="on"||l==="open"||l==="true")h=1;else if(l==="off"||l==="closed"||l==="false")h=0;else if(h=parseFloat(l),!Number.isFinite(h))continue;let g=p.lu??p.last_updated??p.last_changed,v=typeof g=="number"?g*1e3:g!=null?Date.parse(g):NaN;Number.isFinite(v)&&(o!=null&&o!==h&&a.push({ts:v,val:o}),a.push({ts:v,val:h}),o=h)}return a.sort((p,l)=>p.ts-l.ts),a.length&&o!=null&&a.push({ts:Date.now(),val:o}),a}catch(e){return console.warn(`[maintenance-supporter] History fallback failed for ${c}:`,e),[]}}async _fetchBatch(c,t,e,i,a,o){try{let p=await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:e,statistic_ids:c,period:t,types:i});for(let l of c){let h=p[l]||[],g=this._normalizeRows(h,a);o.set(l,g),this._cache.set(`${l}:${t}:14`,{entityId:l,fetchedAt:Date.now(),period:t,points:g})}}catch(p){console.warn("[maintenance-supporter] Batch statistics fetch failed:",p)}}_normalizeRows(c,t){let e=[];for(let i of c){let a=null;if(t?a=i.state??null:a=i.mean??null,a===null)continue;let o={ts:i.start,val:a};t||(i.min!=null&&(o.min=i.min),i.max!=null&&(o.max=i.max)),e.push(o)}return e.sort((i,a)=>i.ts-a.ts),e}};function gt(n,c){let t=n??0;return t<1024?`${t} B`:t<1024*1024?`${U(t/1024,c,1)} KB`:`${U(t/(1024*1024),c,1)} MB`}var Tt=["manual","warranty","invoice","spare_parts","photo","other"],Qt={manual:"mdi:book-open-variant",warranty:"mdi:shield-check",invoice:"mdi:receipt-text-outline",spare_parts:"mdi:cog-outline",photo:"mdi:image-outline",other:"mdi:file-document-outline"};function wt(n){return n.title||n.filename||n.url||""}var F=class extends D{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._hint="";this._addingLink=!1;this._linkUrl="";this._linkTitle="";this._category="manual";this._thumbs={};this._lightboxUrl="";this._editingId="";this._editTitle="";this._editCategory="manual";this._dragOver=!1;this._loadedFor=null;this._localeReady=!1}_isImage(t){return t.kind==="file"&&(t.mime||"").startsWith("image/")}async _sign(t){return Ft(this.hass,t.id)}get _lang(){return H(this.hass)}updated(t){super.updated(t),this.hass&&!this._localeReady&&(this._localeReady=!0,J(this._lang).then(()=>this.requestUpdate())),this.hass&&this.entryId&&this._loadedFor!==this.entryId&&(this._loadedFor=this.entryId,this._load())}async _load(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId});this._docs=t.documents||[],this._loaded=!0,this._error="",this._thumbs={},this._loadThumbs()}catch(t){this._error=C(t,this._lang),this._loaded=!0}}async _loadThumbs(){await Promise.all(this._docs.filter(t=>this._isImage(t)).map(async t=>{try{let e=await this._sign(t);this._thumbs={...this._thumbs,[t.id]:e}}catch{}}))}_category_of(t){return(t.tags||[]).find(i=>Tt.includes(i))||"other"}_labelKeydown(t){(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),t.currentTarget.querySelector("input")?.click())}_onFileInput(t){let e=t.target,i=Array.from(e.files??[]);i.length&&this._uploadFiles(i),e.value=""}_onCameraInput(t){let e=t.target,i=Array.from(e.files??[]);i.length&&this._uploadFiles(i,"photo"),e.value=""}_onDrop(t){if(t.preventDefault(),this._dragOver=!1,!this.canWrite||this._busy)return;let e=Array.from(t.dataTransfer?.files??[]);e.length&&this._uploadFiles(e)}_onDragOver(t){this.canWrite&&(t.preventDefault(),this._dragOver=!0)}_onDragLeave(t){let e=t.relatedTarget;(!e||!t.currentTarget.contains(e))&&(this._dragOver=!1)}async _uploadFiles(t,e){let i=e??this._category;this._busy=!0,this._error="",this._hint="";let a=0,o=0;try{for(let p of t){let l=new FormData;l.append("entry_id",this.entryId),l.append("tags",i),l.append("file",p,p.name);let h=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${this.hass.auth?.data?.access_token??""}`},body:l});if(!h.ok){this._error=h.status===413?s("doc_too_large",this._lang):s("doc_upload_failed",this._lang);continue}let g=await h.json();g.duplicate_in_object?o++:g.deduped&&a++}o?this._hint=s("doc_dup_in_object",this._lang):a&&(this._hint=s("doc_deduped",this._lang)),await this._load()}catch{this._error=s("doc_upload_failed",this._lang)}finally{this._busy=!1}}async _download(t){try{await Vt(this.hass,t.id,t.filename||t.title||"document")}catch(e){this._error=C(e,this._lang)}}async _preview(t){if(this._isImage(t)){this._lightboxUrl=this._thumbs[t.id]||await this._sign(t);return}try{await xt(this.hass,t.id)}catch(e){this._error=C(e,this._lang)}}_openDoc(t){t.kind==="file"?this._preview(t):X(t.url)&&window.open(t.url,"_blank","noopener")}_startEdit(t){this._editingId=t.id,this._editTitle=t.title||"",this._editCategory=this._category_of(t),this._addingLink=!1,this._error=""}_cancelEdit(){this._editingId=""}async _saveEdit(t){let e=(t.tags||[]).filter(a=>!Tt.includes(a)),i=t.kind==="file"?[this._editCategory,...e]:t.tags??[];this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:t.id,title:this._editTitle.trim()||t.filename||t.url||"",tags:i}),this._editingId="",await this._load()}catch(a){this._error=C(a,this._lang)}finally{this._busy=!1}}async _delete(t){let e=wt(t);if(window.confirm(s("doc_delete_confirm",this._lang).replace("{name}",e))){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/delete",doc_id:t.id}),await this._load()}catch(i){this._error=C(i,this._lang)}finally{this._busy=!1}}}async _addLink(){let t=this._linkUrl.trim();if(t){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/add_link",entry_id:this.entryId,url:t,title:this._linkTitle.trim()||null}),this._linkUrl="",this._linkTitle="",this._addingLink=!1,await this._load()}catch(e){this._error=C(e,this._lang,s("doc_link_invalid",this._lang))}finally{this._busy=!1}}}render(){let t=this._lang;return r`
      <div
        class="doc-zone ${this._dragOver?"drag-over":""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}
      >
        ${this._dragOver&&this.canWrite?r`<div class="drop-overlay">
              <ha-icon icon="mdi:tray-arrow-down"></ha-icon> ${s("doc_drop_hint",t)}
            </div>`:d}
      <div class="doc-header">
        <h3>${s("documents",t)} (${this._docs.length})</h3>
        ${this.canWrite?r`
              <div class="doc-actions">
                <select
                  class="cat-select"
                  .value=${this._category}
                  ?disabled=${this._busy}
                  @change=${e=>this._category=e.target.value}
                >
                  ${Tt.map(e=>r`<option value=${e}>${s(`doc_cat_${e}`,t)}</option>`)}
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

      ${this._error?r`<div class="doc-msg error">${this._error}</div>`:d}
      ${this._hint?r`<div class="doc-msg hint">${this._hint}</div>`:d}

      ${this._addingLink&&this.canWrite?r`
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

      ${this._loaded?this._docs.length===0?r`<div class="doc-empty">${s("documents_empty",t)}</div>`:r`
              <div class="doc-list">
                ${this._docs.map(e=>this._renderDoc(e,t))}
              </div>
            `:r`<div class="doc-empty">${s("loading",t)}</div>`}

      ${this._lightboxUrl?r`<div class="lightbox" @click=${()=>this._lightboxUrl=""}>
            <img class="lightbox-img" src=${this._lightboxUrl} @click=${e=>e.stopPropagation()} />
            <button class="lightbox-close" title=${s("doc_close",t)} @click=${()=>this._lightboxUrl=""}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>`:d}
      </div>
    `}_renderDoc(t,e){if(this._editingId===t.id)return this._renderEdit(t,e);let i=t.kind==="file",a=this._category_of(t),o=i?`${s(`doc_cat_${a}`,e)} \xB7 ${gt(t.size,e)}`:s("doc_link_badge",e),p=this._thumbs[t.id];return r`
      <div class="doc-row">
        ${i&&p?r`<img
              class="doc-thumb"
              src=${p}
              alt=${t.title||""}
              title=${s("doc_open",e)}
              @click=${()=>this._preview(t)}
            />`:r`<ha-icon
              class="doc-icon ${i?"clickable":""}"
              icon=${i?Qt[a]:"mdi:link-variant"}
              @click=${()=>i&&this._preview(t)}
            ></ha-icon>`}
        <div
          class="doc-info"
          role="button"
          tabindex="0"
          title=${s("doc_open",e)}
          @click=${()=>this._openDoc(t)}
          @keydown=${l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),this._openDoc(t))}}
        >
          <div class="doc-title">${wt(t)}</div>
          <div class="doc-meta">${o}</div>
        </div>
        <div class="doc-row-actions">
          ${i?r`
                <button class="icon-btn" title=${s("doc_open",e)} @click=${()=>this._preview(t)}>
                  <ha-icon icon="mdi:eye-outline"></ha-icon>
                </button>
                <button class="icon-btn" title=${s("doc_download",e)} @click=${()=>this._download(t)}>
                  <ha-icon icon="mdi:download"></ha-icon>
                </button>`:r`<a
                class="icon-btn"
                href=${X(t.url)?t.url:"#"}
                target="_blank"
                rel="noopener noreferrer"
                title=${s("doc_open",e)}
              ><ha-icon icon="mdi:open-in-new"></ha-icon></a>`}
          ${this.canWrite?r`
                <button class="icon-btn" title=${s("edit",e)} ?disabled=${this._busy} @click=${()=>this._startEdit(t)}>
                  <ha-icon icon="mdi:pencil"></ha-icon>
                </button>
                <button class="icon-btn danger" title=${s("delete",e)} ?disabled=${this._busy} @click=${()=>this._delete(t)}>
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>`:d}
        </div>
      </div>
    `}_renderEdit(t,e){let i=t.kind==="file";return r`
      <div class="doc-row editing">
        <input
          class="edit-title"
          type="text"
          placeholder=${s("doc_link_title",e)}
          .value=${this._editTitle}
          ?disabled=${this._busy}
          @input=${a=>this._editTitle=a.target.value}
        />
        ${i?r`<select
              class="cat-select"
              ?disabled=${this._busy}
              @change=${a=>this._editCategory=a.target.value}
            >
              ${Tt.map(a=>r`<option value=${a} ?selected=${a===this._editCategory}>${s(`doc_cat_${a}`,e)}</option>`)}
            </select>`:d}
        <button class="icon-btn" title=${s("save",e)} ?disabled=${this._busy||!this._editTitle.trim()} @click=${()=>this._saveEdit(t)}>
          <ha-icon icon="mdi:check"></ha-icon>
        </button>
        <button class="icon-btn" title=${s("cancel",e)} ?disabled=${this._busy} @click=${this._cancelEdit}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
    `}};F.styles=O`
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
  `,u([k({attribute:!1})],F.prototype,"hass",2),u([k({attribute:!1})],F.prototype,"entryId",2),u([k({type:Boolean})],F.prototype,"canWrite",2),u([m()],F.prototype,"_docs",2),u([m()],F.prototype,"_loaded",2),u([m()],F.prototype,"_busy",2),u([m()],F.prototype,"_error",2),u([m()],F.prototype,"_hint",2),u([m()],F.prototype,"_addingLink",2),u([m()],F.prototype,"_linkUrl",2),u([m()],F.prototype,"_linkTitle",2),u([m()],F.prototype,"_category",2),u([m()],F.prototype,"_thumbs",2),u([m()],F.prototype,"_lightboxUrl",2),u([m()],F.prototype,"_editingId",2),u([m()],F.prototype,"_editTitle",2),u([m()],F.prototype,"_editCategory",2),u([m()],F.prototype,"_dragOver",2);customElements.get("maintenance-documents-section")||customElements.define("maintenance-documents-section",F);var st=class extends D{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._attachId="";this._loadedKey="";this._localeReady=!1}get _lang(){return H(this.hass)}get _refId(){return this.partId||this.taskId||""}get _linkField(){return this.partId?"part_ids":"task_ids"}updated(t){super.updated(t),this.hass&&!this._localeReady&&(this._localeReady=!0,J(this._lang).then(()=>this.requestUpdate()));let e=`${this.entryId}|${this._refId}`;this.hass&&this.entryId&&this._refId&&this._loadedKey!==e&&(this._loadedKey=e,this._load())}async _load(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId});this._docs=t.documents||[],this._loaded=!0,this._error=""}catch(t){this._error=C(t,this._lang),this._loaded=!0}}_links(t){return t[this._linkField]||[]}_linked(){return this._docs.filter(t=>this._links(t).includes(this._refId))}_available(){return this._docs.filter(t=>!this._links(t).includes(this._refId))}async _setLinks(t,e){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:t.id,[this._linkField]:e}),await this._load()}catch(i){this._error=C(i,this._lang)}finally{this._busy=!1}}_link(){let t=this._docs.find(e=>e.id===this._attachId);t&&(this._attachId="",this._setLinks(t,[...this._links(t),this._refId]))}_unlink(t){this._setLinks(t,this._links(t).filter(e=>e!==this._refId))}_isPdf(t){return t.mime==="application/pdf"||(t.filename||"").toLowerCase().endsWith(".pdf")}_pageFor(t){return this._isPdf(t)&&this.taskId?t.task_pages?.[this.taskId]:void 0}async _open(t){if(t.kind==="weblink"){X(t.url)&&window.open(t.url,"_blank","noopener");return}let e=this._pageFor(t);try{await xt(this.hass,t.id,e?`#page=${e}`:"")}catch(i){this._error=C(i,this._lang)}}async _setPage(t,e){if(this.taskId){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:t.id,task_pages:{[this.taskId]:e}}),await this._load()}catch(i){this._error=C(i,this._lang)}finally{this._busy=!1}}}async _download(t){try{await Vt(this.hass,t.id,t.filename||t.title||"document")}catch(e){this._error=C(e,this._lang)}}render(){if(!this._loaded||this._docs.length===0)return d;let t=this._lang,e=this._linked(),i=this._available();return r`
      <div class="task-docs">
        <h3><ha-icon icon="mdi:paperclip"></ha-icon> ${s("documents",t)} (${e.length})</h3>
        ${this._error?r`<div class="tdoc-error">${this._error}</div>`:d}
        ${e.length===0?r`<div class="tdoc-empty">${s(this.partId?"doc_part_none":"doc_task_none",t)}</div>`:r`<div class="tdoc-list">${e.map(a=>this._renderRow(a,t))}</div>`}
        ${this.canWrite&&i.length?r`<div class="tdoc-attach">
              <select
                class="tdoc-select"
                ?disabled=${this._busy}
                @change=${a=>this._attachId=a.target.value}
              >
                <option value="" ?selected=${!this._attachId}>${s("doc_link_existing",t)}</option>
                ${i.map(a=>r`<option value=${a.id} ?selected=${a.id===this._attachId}>${wt(a)}</option>`)}
              </select>
              <button class="tdoc-btn" ?disabled=${this._busy||!this._attachId} @click=${this._link}>
                <ha-icon icon="mdi:link-variant-plus"></ha-icon> ${s("doc_attach",t)}
              </button>
            </div>`:d}
      </div>
    `}_renderRow(t,e){let i=t.kind==="file",a=this._isPdf(t),o=this._pageFor(t),p=(t.tags||[]).find(h=>Tt.includes(h))||"other",l=i?gt(t.size,e):s("doc_link_badge",e);return r`
      <div class="tdoc-row">
        <ha-icon class="tdoc-icon" icon=${i?Qt[p]:"mdi:link-variant"}></ha-icon>
        <div
          class="tdoc-info"
          role="button"
          tabindex="0"
          title=${o?`${s("doc_open",e)} \xB7 ${s("doc_page",e)} ${o}`:s("doc_open",e)}
          @click=${()=>this._open(t)}
          @keydown=${h=>{(h.key==="Enter"||h.key===" ")&&(h.preventDefault(),this._open(t))}}
        >
          <div class="tdoc-title">${wt(t)}</div>
          <div class="tdoc-meta">
            ${l}${o?r` · <span class="tdoc-pagetag">${s("doc_page",e)} ${o}</span>`:d}
          </div>
        </div>
        ${this.canWrite&&a&&this.taskId?r`<input
              class="tdoc-page"
              type="number"
              min="1"
              inputmode="numeric"
              aria-label=${s("doc_page",e)}
              title=${s("doc_page",e)}
              placeholder=${s("doc_page",e)}
              .value=${o?String(o):""}
              ?disabled=${this._busy}
              @change=${h=>{let g=parseInt(h.target.value,10);this._setPage(t,Number.isFinite(g)&&g>=1?g:0)}}
            />`:d}
        <button class="icon-btn" title=${s("doc_open",e)} @click=${()=>this._open(t)}>
          <ha-icon icon=${i?"mdi:eye-outline":"mdi:open-in-new"}></ha-icon>
        </button>
        ${i?r`<button class="icon-btn" title=${s("doc_download",e)} @click=${()=>this._download(t)}>
              <ha-icon icon="mdi:download"></ha-icon>
            </button>`:d}
        ${this.canWrite?r`<button class="icon-btn" title=${s("doc_unlink",e)} ?disabled=${this._busy} @click=${()=>this._unlink(t)}>
              <ha-icon icon="mdi:link-variant-off"></ha-icon>
            </button>`:d}
      </div>
    `}};st.styles=O`
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
  `,u([k({attribute:!1})],st.prototype,"hass",2),u([k({attribute:!1})],st.prototype,"entryId",2),u([k({attribute:!1})],st.prototype,"taskId",2),u([k({attribute:!1})],st.prototype,"partId",2),u([k({type:Boolean})],st.prototype,"canWrite",2),u([m()],st.prototype,"_docs",2),u([m()],st.prototype,"_loaded",2),u([m()],st.prototype,"_busy",2),u([m()],st.prototype,"_error",2),u([m()],st.prototype,"_attachId",2);customElements.get("maintenance-task-documents")||customElements.define("maintenance-task-documents",st);var yi={name:"",vendor:"",mpn:"",gtin:"",storage_location:"",product_url:"",unit:"",cost:"",stock:"",reorder_threshold:"",restock_quantity:"",auto_buy_task:!0,notes:""},Z=class extends D{constructor(){super(...arguments);this.parts=[];this.canWrite=!1;this.currencySymbol="\u20AC";this._editing=null;this._busy=!1;this._error="";this._restockFor=null;this._restockQty="";this._restockInvalid=!1;this._docsFor=null}get _lang(){return H(this.hass)}connectedCallback(){super.connectedCallback(),J(this._lang).then(()=>this.requestUpdate())}_notifyChanged(){this.dispatchEvent(new CustomEvent("parts-changed",{bubbles:!0,composed:!0}))}async _send(t){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(t)}catch(e){return this._error=C(e,this._lang),null}finally{this._busy=!1}}_openAdd(){this._editing={...yi}}_openEdit(t){this._editing={id:t.id,name:t.name,vendor:t.vendor||"",mpn:t.mpn||"",gtin:t.gtin||"",storage_location:t.storage_location||"",product_url:t.product_url||"",unit:t.unit||"",cost:t.cost!=null?String(t.cost):"",stock:t.stock!=null?String(t.stock):"",reorder_threshold:t.reorder_threshold!=null?String(t.reorder_threshold):"",restock_quantity:t.restock_quantity!=null?String(t.restock_quantity):"",auto_buy_task:!!t.auto_buy_task,notes:t.notes||""}}_formValue(t){let e=i=>i.trim()===""?null:Number(i);return{entry_id:this.entryId,name:t.name.trim(),vendor:t.vendor.trim()||null,mpn:t.mpn.trim()||null,gtin:t.gtin.trim()||null,storage_location:t.storage_location.trim()||null,product_url:t.product_url.trim()||null,unit:t.unit.trim()||null,cost:e(t.cost),stock:e(t.stock),reorder_threshold:e(t.reorder_threshold),restock_quantity:e(t.restock_quantity),auto_buy_task:t.auto_buy_task,notes:t.notes.trim()||null}}async _save(){let t=this._editing;if(!t||!t.name.trim())return;let e=this._formValue(t),i=t.id?"maintenance_supporter/part/update":"maintenance_supporter/part/create";await this._send(t.id?{type:i,part_id:t.id,...e}:{type:i,...e})!==null&&(this._editing=null,this._notifyChanged())}async _delete(t){if(!window.confirm(s("part_delete_confirm",this._lang).replace("{name}",t.name)))return;await this._send({type:"maintenance_supporter/part/delete",entry_id:this.entryId,part_id:t.id})!==null&&this._notifyChanged()}async _restock(t){let e=parseFloat(this._restockQty);if(!Number.isFinite(e)||e===0){this._restockInvalid=!0;return}this._restockInvalid=!1;let i=await this._send({type:"maintenance_supporter/part/restock",entry_id:this.entryId,part_id:t.id,delta:e});this._restockFor=null,i!==null&&(t.stock=i.stock,this.requestUpdate(),this._notifyChanged())}_identLine(t){return[t.vendor,t.mpn?`MPN: ${t.mpn}`:"",t.gtin?`GTIN: ${t.gtin}`:""].filter(Boolean).join(" \xB7 ")}_renderRow(t){let e=this._lang,i=t.stock!==null&&t.stock!==void 0,a=this._identLine(t),o=this._docsFor===t.id;return r`
      <div class="part-row ${t.is_low?"low":""}">
        <ha-icon class="part-icon" icon=${t.is_low?"mdi:cart-arrow-down":"mdi:package-variant-closed"}></ha-icon>
        <div class="part-main">
          <div class="part-name">
            ${X(t.shopping_url)?r`<a href=${t.shopping_url} target="_blank" rel="noopener noreferrer">${t.name}</a>`:t.name}
            ${i?r`<span class="stock-badge ${t.is_low?"low":""}"
                  >${t.stock}${t.unit?` ${t.unit}`:""}${t.reorder_threshold!=null?r`<span class="threshold">/${t.reorder_threshold}</span>`:d}</span
                >`:d}
          </div>
          <div class="part-meta">
            ${a?r`<span>${a}</span>`:d}
            ${t.storage_location?r`<span class="loc"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${t.storage_location}</span>`:d}
          </div>
        </div>
        <ha-icon-button
          title=${s("documents",e)}
          class=${o?"docs-open":""}
          @click=${()=>this._docsFor=o?null:t.id}
          ><ha-icon icon="mdi:paperclip"></ha-icon
        ></ha-icon-button>
        ${this.canWrite?r`
              ${this._restockFor===t.id?r`
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
                  `:r`
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
      ${o?r`<div class="part-docs">
            <maintenance-task-documents
              .hass=${this.hass}
              .entryId=${this.entryId}
              .partId=${t.id}
              .canWrite=${this.canWrite}
            ></maintenance-task-documents>
          </div>`:d}
    `}_field(t,e,i={}){let a=this._editing;return r`
      <label class="form-field">
        <span>${t}</span>
        <input
          type=${i.type||"text"}
          .value=${String(a[e]??"")}
          placeholder=${i.placeholder||""}
          @input=${o=>{this._editing[e]=o.target.value,this.requestUpdate()}}
        />
      </label>
    `}_renderForm(){let t=this._lang,e=this._editing;return r`
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
    `}_inventoryValue(){let t=0,e=!1;for(let i of this.parts){let a=typeof i.cost=="number"?i.cost:null,o=typeof i.stock=="number"?i.stock:null;a!==null&&o!==null&&(t+=a*o,e=!0)}return e?t:null}render(){let t=this._lang;return!this.parts.length&&!this.canWrite?d:r`
      <div class="section-head">
        <h3>
          <ha-icon icon="mdi:package-variant"></ha-icon>
          ${s("parts_section",t)} (${this.parts.length})
          ${this._inventoryValue()!==null?r`<span class="inventory-value" title=${s("parts_inventory_value",t)}
                >${s("parts_inventory_value",t)}:
                ${B(this._inventoryValue(),this.currencySymbol,t)}</span>`:d}
        </h3>
        ${this.canWrite&&!this._editing?r`<ha-button appearance="plain" @click=${()=>this._openAdd()}>
              <ha-icon icon="mdi:plus"></ha-icon> ${s("part_add",t)}
            </ha-button>`:d}
      </div>
      ${this._error?r`<div class="error">${this._error}</div>`:d}
      ${this._editing?this._renderForm():d}
      ${this.parts.map(e=>this._renderRow(e))}
    `}};Z.styles=O`
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
  `,u([k({attribute:!1})],Z.prototype,"hass",2),u([k({attribute:!1})],Z.prototype,"entryId",2),u([k({attribute:!1})],Z.prototype,"parts",2),u([k({type:Boolean})],Z.prototype,"canWrite",2),u([k({attribute:!1})],Z.prototype,"currencySymbol",2),u([m()],Z.prototype,"_editing",2),u([m()],Z.prototype,"_busy",2),u([m()],Z.prototype,"_error",2),u([m()],Z.prototype,"_restockFor",2),u([m()],Z.prototype,"_restockQty",2),u([m()],Z.prototype,"_restockInvalid",2),u([m()],Z.prototype,"_docsFor",2);customElements.define("maintenance-parts-section",Z);var xi=new Set(["completed","skipped","reset","missed"]);function qe(n){let c=[];for(let t of n)for(let e of t.history??[]){if(!xi.has(e.type))continue;let i=new Date(e.timestamp).getTime();Number.isFinite(i)&&c.push({ts:i,timestamp:e.timestamp,taskId:t.id,taskName:t.name,type:e.type,cost:typeof e.cost=="number"?e.cost:null,duration:typeof e.duration=="number"?e.duration:null,notes:e.notes??null,completedBy:e.completed_by??null,phaseName:e.phase_id&&t.phases?.[e.phase_id]?.name||null})}return c.sort((t,e)=>e.ts-t.ts||t.taskName.localeCompare(e.taskName)),c}function We(n,c){let t=c.from?new Date(`${c.from}T00:00:00`).getTime():null,e=c.to?new Date(`${c.to}T00:00:00`).getTime()+864e5:null;return n.filter(i=>!(c.taskId&&i.taskId!==c.taskId||t!=null&&i.ts<t||e!=null&&i.ts>=e))}function Xt(n){let c=0,t=0;for(let e of n)e.type==="completed"&&(c++,e.cost!=null&&(t+=e.cost));return{completed:c,totalCost:t}}function N(n){return String(n??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c])}function Ge(n,c,t,e,i,a,o,p={}){let l=c.filter(_=>_.type==="completed"),{totalCost:h}=Xt(l),g=[[t.manufacturer,n.manufacturer],[t.model,n.model],[t.serial,n.serial_number],[t.installed,n.installation_date?e(n.installation_date):null]].filter(([,_])=>_).map(([_,f])=>`<div class="meta-row"><span>${N(_)}</span><strong>${N(f)}</strong></div>`).join(""),v=l.map(_=>{let f=[_.notes,_.completedBy?`${t.completedBy}: ${_.completedBy}`:null].filter(Boolean).join(" \xB7 ");return`<tr>
        <td class="nowrap">${N(e(_.timestamp))}</td>
        <td>${N(_.phaseName?`${_.taskName} \xB7 ${_.phaseName}`:_.taskName)}</td>
        <td class="num">${_.cost!=null?N(a(_.cost)):N(t.none)}</td>
        <td class="num">${_.duration!=null?N(i(_.duration)):N(t.none)}</td>
        <td class="notes">${N(f)||N(t.none)}</td>
      </tr>`}).join(`
`);return`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${N(t.title)} \u2014 ${N(n.name)}</title>
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
<h1>${N(t.title)} \u2014 ${N(n.name)}</h1>
<p class="sub">${N(t.generated)} ${N(e(o))} \xB7 ${N(t.entriesLabel(l.length))}</p>
${g?`<div class="meta">${g}</div>`:""}
<table>
  <thead><tr>
    <th>${N(t.colDate)}</th>
    <th>${N(t.colTask)}</th>
    <th class="num">${N(t.colCost)}</th>
    <th class="num">${N(t.colDuration)}</th>
    <th>${N(t.colNotes)}</th>
  </tr></thead>
  <tbody>
${v}
  </tbody>
  <tfoot><tr>
    <td colspan="2">${N(t.totalLabel)}</td>
    <td class="num">${N(a(h))}</td>
    <td colspan="2"></td>
  </tr></tfoot>
</table>
${p.capped?`<p class="cap-note">${N(t.capNote)}</p>`:""}
</body>
</html>`}var wi=500,tt=class extends D{constructor(){super(...arguments);this.entryId="";this.object=null;this.tasks=[];this.currencySymbol="\u20AC";this.userName=()=>null;this._full={};this._loading=!1;this._filterTask="";this._from="";this._to="";this._expanded=!1;this._loadedFor=null;this._localeReady=!1}get _lang(){return H(this.hass)}updated(t){super.updated(t),!this._localeReady&&this.hass&&(this._localeReady=!0,J(this._lang).then(()=>this.requestUpdate())),this.entryId&&this._loadedFor!==this.entryId&&(this._loadedFor=this.entryId,this._full={},this._filterTask="",this._from="",this._to="",this._loadFullHistories())}async _loadFullHistories(){let t=this.entryId,e=this.tasks;if(!e.length)return;this._loading=!0;let i=await Promise.all(e.map(async a=>{try{let o=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:t,task_id:a.id});return[a.id,o.history??[]]}catch{return[a.id,a.history??[]]}}));this.entryId===t&&(this._full=Object.fromEntries(i),this._loading=!1)}get _entries(){return qe(this.tasks.map(t=>({id:t.id,name:t.name,history:this._full[t.id]??t.history??[]})))}get _capped(){return Object.values(this._full).some(t=>t.length>=wi)}_openTask(t){this.dispatchEvent(new CustomEvent("open-task",{detail:{taskId:t},bubbles:!0,composed:!0}))}_print(t){let e=this._lang,i=this.object;if(!i)return;let a={title:s("service_record_title",e),generated:s("report_generated",e),manufacturer:s("manufacturer",e),model:s("model",e),serial:s("serial_number_label",e),installed:s("installed",e),colDate:s("date",e),colTask:s("task_name",e),colCost:s("cost",e),colDuration:s("duration",e),colNotes:s("notes_label",e),completedBy:s("completed_by",e),totalLabel:s("report_total_cost",e),entriesLabel:l=>`${l} ${s("service_record_entries",e)}`,capNote:s("object_history_cap_note",e),none:"\u2014"},o=t.map(l=>({...l,completedBy:l.completedBy?this.userName(l.completedBy):null})),p=Ge(i,o,a,l=>l?q(l,e):"",l=>`${l} min`,l=>B(l,this.currencySymbol,e),new Date().toISOString(),{capped:this._capped});Dt(p)}render(){let t=this._lang,e=this._entries;if(!e.length&&!this._loading)return d;let i=We(e,{taskId:this._filterTask||null,from:this._from||null,to:this._to||null}),{completed:a,totalCost:o}=Xt(i),p=this._expanded?i:i.slice(0,15);return r`
      <div class="section">
        <h3>
          ${s("object_history_section",t)}
          <span class="count">${i.length}</span>
          ${this._loading?r`<span class="loading-hint">${s("loading",t)}</span>`:d}
          <ha-button appearance="plain" class="print-btn" @click=${()=>this._print(i)}>
            <ha-icon icon="mdi:printer-outline"></ha-icon>
            ${s("service_record_print",t)}
          </ha-button>
        </h3>

        <div class="filters">
          <select .value=${this._filterTask} @change=${l=>{this._filterTask=l.target.value}}>
            <option value="">${s("object_history_all_tasks",t)}</option>
            ${this.tasks.map(l=>r`<option value=${l.id} ?selected=${l.id===this._filterTask}>${l.name}</option>`)}
          </select>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${t}
            .label=${s("date_from",t)}
            .value=${this._from}
            @value-changed=${l=>{this._from=l.detail.value}}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${t}
            .label=${s("date_to",t)}
            .value=${this._to}
            @value-changed=${l=>{this._to=l.detail.value}}
          ></ms-date-field>
        </div>

        ${i.length===0?r`<p class="empty">${s("object_history_empty",t)}</p>`:r`
              <div class="rows">
                ${p.map(l=>r`
                  <div class="row">
                    <span class="date" title=${Et(l.timestamp,t)}>${q(l.timestamp,t)}</span>
                    <span class="type type-${l.type}">${s(l.type,t)}</span>
                    <button class="task-link" @click=${()=>this._openTask(l.taskId)}>${l.taskName}${l.phaseName?` \xB7 ${l.phaseName}`:""}</button>
                    <span class="facts">
                      ${l.cost!=null?r`<span>${B(l.cost,this.currencySymbol,t)}</span>`:d}
                      ${l.duration!=null?r`<span>${l.duration} min</span>`:d}
                    </span>
                    ${l.notes?r`<span class="notes" title=${l.notes}>${l.notes}</span>`:d}
                  </div>
                `)}
              </div>
              ${i.length>p.length?r`<ha-button appearance="plain" class="more" @click=${()=>{this._expanded=!0}}>
                    ${s("show_all",t)} (${i.length})
                  </ha-button>`:d}
              <div class="totals">
                ${a} ${s("service_record_entries",t)} · ${s("report_total_cost",t)}:
                <strong>${B(o,this.currencySymbol,t)}</strong>
              </div>
              ${this._capped?r`<p class="cap-note">${s("object_history_cap_note",t)}</p>`:d}
            `}
      </div>
    `}};tt.styles=O`
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
  `,u([k({attribute:!1})],tt.prototype,"hass",2),u([k()],tt.prototype,"entryId",2),u([k({attribute:!1})],tt.prototype,"object",2),u([k({attribute:!1})],tt.prototype,"tasks",2),u([k()],tt.prototype,"currencySymbol",2),u([k({attribute:!1})],tt.prototype,"userName",2),u([m()],tt.prototype,"_full",2),u([m()],tt.prototype,"_loading",2),u([m()],tt.prototype,"_filterTask",2),u([m()],tt.prototype,"_from",2),u([m()],tt.prototype,"_to",2),u([m()],tt.prototype,"_expanded",2);customElements.get("maintenance-object-history-section")||customElements.define("maintenance-object-history-section",tt);var at=class at extends D{constructor(){super(...arguments);this.flat=!1;this._ov=null;this._loading=!1;this._marking=!1;this._error="";this._history=null;this._rosterSort=at._storedSort();this._typeFilter=null;this._recorded=[];this._historyRequested=!1;this._localeReady=!1;this._markAll=async()=>{await this._mark(void 0)};this._repair=async()=>{if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/setup",language:this._lang}),await this._load()}catch(t){this._error=C(t,this._lang)}finally{this._marking=!1}}};this._loadHistory=async t=>{if(!(!t.target.open||this._historyRequested)){this._historyRequested=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview_history"});this._history=e.series}catch{this._history=null}}}}get _lang(){return H(this.hass)}connectedCallback(){super.connectedCallback(),this.hass&&this._load()}updated(t){St(this,t),t.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,J(this._lang).then(()=>this.requestUpdate()),this._ov===null&&!this._loading&&this._load())}async _load(){this._loading=!0,this._error="";try{this._ov=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview"})}catch(t){this._error=C(t,this._lang)}finally{this._loading=!1}}async _mark(t){if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/mark_replaced",...t?{entity_ids:t}:{}}),await this._load()}catch(e){this._error=C(e,this._lang)}finally{this._marking=!1}}}async _setExcluded(t,e){if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/set_excluded",entity_id:t,excluded:e}),await this._load()}catch(i){this._error=C(i,this._lang)}finally{this._marking=!1}}}async _addBattery(t){let e=t.detail?.value;if(!(!e||this._marking)){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/set_included",entity_id:e,included:!0}),await this._load()}catch(i){this._error=C(i,this._lang)}finally{this._marking=!1}}}async _setTrackSelf(t){let e=t.target.checked;if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/set_track_self_charging",enabled:e}),await this._load()}catch(i){this._error=C(i,this._lang)}finally{this._marking=!1}}}_sparkline(t){let e=this._history?.[t.entity_id];if(!e||e.points.length<2)return d;let i=110,a=24,o=2,p=e.points[0][0],l=e.points[e.points.length-1][0],h=Date.now()/1e3,g=t.status!=="low"&&t.predicted_source==="trend"&&t.days_until!=null?h+t.days_until*86400:null,v=Math.max(l,g??l),_=R=>v===p?o:o+(R-p)/(v-p)*(i-2*o),f=R=>o+(1-Math.min(100,Math.max(0,R))/100)*(a-2*o),y=e.points.map(([R,$])=>`${j(_(R))},${j(f($))}`).join(" "),E=e.points[e.points.length-1][1],M=j(f(e.threshold));return r`<svg
      class="bf-spark"
      viewBox="0 0 ${i} ${a}"
      role="img"
      aria-label=${s("battery_fleet_sparkline_hint",this._lang)}
    >
      <title>${s("battery_fleet_sparkline_hint",this._lang)}</title>
      <line class="bf-spark-th" x1="0" y1=${M} x2=${i} y2=${M}></line>
      <polyline class="bf-spark-line" points=${y}></polyline>
      ${g!==null?r`<line
            class="bf-spark-proj"
            x1=${j(_(l))}
            y1=${j(f(E))}
            x2=${j(_(g))}
            y2=${M}
          ></line>`:d}
    </svg>`}static _storedSort(){return it(P.batteryRosterSort)==="name"?"name":"urgency"}_setSort(t){this._rosterSort=t,Y(P.batteryRosterSort,t)}_sortedRoster(t){let e=this._typeFilter===null?t:t.filter(a=>a.battery_type===this._typeFilter);if(this._rosterSort==="name")return e;let i=a=>a.status==="low"?-1e3+(a.level??101)/101:a.days_until??1/0;return[...e].sort((a,o)=>i(a)-i(o)||a.device_name.localeCompare(o.device_name))}_predictedDate(t){return this._fmtDate(Date.now()+t*864e5)}_fmtDate(t){let e=new Date(t),i=a=>String(a).padStart(2,"0");return q(`${e.getFullYear()}-${i(e.getMonth()+1)}-${i(e.getDate())}`,this._lang)}_shoppingLine(t){return Object.entries(t).map(([e,i])=>r`<button
        class="bf-type-chip ${this._typeFilter===e?"bf-type-chip-active":""}"
        title=${s("battery_fleet_filter_type",this._lang)}
        @click=${()=>this._toggleTypeFilter(e)}
      >
        ${i}× ${e}
      </button>`)}_toggleTypeFilter(t){if(this._typeFilter=this._typeFilter===t?null:t,this._typeFilter!==null){let e=this.shadowRoot?.querySelector("details.bf-roster");e&&!e.open&&(e.open=!0)}}async _recordJump(t,e){if(!this._marking){this._marking=!0,this._error="";try{await this.hass.callService("battery_notes","set_battery_replaced",{device_id:e.device_id,datetime_replaced:new Date(e.at*1e3).toISOString()}),this._recorded=[...this._recorded,t],await this._load()}catch(i){this._error=C(i,this._lang)}finally{this._marking=!1}}}_levelBar(t){let e=t.level;if(e==null)return d;let i=t.low_threshold??20,a=e<=i?"bad":e<=i+20?"warn":"good";return r`<span class="bf-bar" aria-hidden="true"
      ><span class="bf-bar-fill bf-bar-${a}" style="width: ${Math.min(100,Math.max(0,e))}%"></span
    ></span>`}render(){let t=this._lang;if(this._loading&&this._ov===null)return r`<div class="bf-card"><div class="bf-loading">…</div></div>`;let e=this._ov;if(!e)return this._error?r`<div class="bf-card"><div class="bf-error">${this._error}</div></div>`:d;let i=e.low.length;return r`
      <div class="bf-card">
        <div class="bf-head">
          <ha-icon icon="mdi:battery-alert"></ha-icon>
          <span class="bf-title">${s("battery_fleet_title",t)}</span>
          <span class="bf-count ${i?"bad":"ok"}">${i}</span>
        </div>
        ${this._error?r`<div class="bf-error">${this._error}</div>`:d}

        ${e.configured&&e.task_ok===!1?r`
              <div class="bf-repair">
                <span>${s("battery_fleet_trigger_lost",t)}</span>
                <ha-button .disabled=${this._marking} @click=${this._repair}>
                  ${s("battery_fleet_repair",t)}
                </ha-button>
              </div>
            `:d}

        ${i===0?r`<div class="bf-empty">${s("battery_fleet_none_low",t)}</div>`:r`
              <div class="bf-shopping">
                <span class="bf-label">${s("battery_fleet_buy_now",t)}</span>
                <span class="bf-list">${this._shoppingLine(e.needs_now)}</span>
              </div>
              <div class="bf-rows">
                ${e.low.map(a=>r`
                    <div class="bf-row">
                      <span class="bf-dev">${a.device_name}</span>
                      ${a.available===!1?r`<span class="bf-offline">${s("battery_fleet_offline",t)}</span>`:d}
                      <span class="bf-type">${a.quantity}× ${a.battery_type}</span>
                      ${a.rechargeable?r`<span class="bf-recharge" title=${s("battery_fleet_rechargeable",t)}
                            ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
                          ></span>`:d}
                      ${this._levelBar(a)}
                      ${a.level!=null?r`<span class="bf-level">${a.level}%</span>`:d}
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

        ${e.soon.length?r`
              <div class="bf-soon">
                <span class="bf-label">${s("battery_fleet_soon",t)}</span>
                <span class="bf-list">${this._shoppingLine(e.needs_soon)}</span>
                <div class="bf-soon-hint">${s("battery_fleet_soon_hint",t)}</div>
              </div>
            `:d}
        ${e.all?.length?r`
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
                  ${this._sortedRoster(e.all).map(a=>r`
                      <div class="bf-row">
                        <span class="bf-dev">${a.device_name}</span>
                        <span class="bf-status bf-${a.status}">${s("battery_fleet_status_"+a.status,t)}</span>
                        <span class="bf-type">${a.quantity}× ${a.battery_type}</span>
                        ${a.rechargeable?r`<span class="bf-recharge" title=${s("battery_fleet_rechargeable",t)}
                              ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
                            ></span>`:d}
                        ${this._sparkline(a)}
                        ${this._levelBar(a)}
                        ${a.level!=null?r`<span class="bf-level">${a.level}%</span>`:d}
                        ${(()=>{let o=this._history?.[a.entity_id]?.jump;return!o||this._recorded.includes(a.entity_id)?d:r`<button
                            class="bf-mark bf-jump"
                            title=${s("battery_fleet_record_replacement",t).replace("{date}",this._fmtDate(o.at*1e3))}
                            .disabled=${this._marking}
                            @click=${()=>this._recordJump(a.entity_id,o)}
                          >
                            <ha-icon icon="mdi:calendar-sync"></ha-icon>
                          </button>`})()}
                        ${a.days_until!=null?r`<span
                              class="bf-predicted ${a.predicted_source==="trend"?"bf-trend":""} ${a.forecast_overdue?"bf-overdue":""}"
                              title=${a.forecast_overdue?s("battery_fleet_forecast_overdue",t):a.predicted_source==="trend"?s("battery_fleet_predicted_trend",t).replace("{date}",this._predictedDate(a.days_until)).replace("{confidence}",s("cal_confidence_"+(a.prediction_confidence||"medium"),t)):s("battery_fleet_predicted_on",t).replace("{date}",this._predictedDate(a.days_until))}
                              >${a.forecast_overdue?r`<ha-icon icon="mdi:calendar-alert"></ha-icon>`:d}~${this._predictedDate(a.days_until)}</span
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
        ${e.excluded?.length?r`
              <div class="bf-excluded">
                <span class="bf-label">${s("battery_fleet_excluded",t)}</span>
                ${e.excluded.map(a=>r`
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
    `}};at.styles=O`
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
  `,u([k({attribute:!1})],at.prototype,"hass",2),u([k({type:Boolean})],at.prototype,"flat",2),u([m()],at.prototype,"_ov",2),u([m()],at.prototype,"_loading",2),u([m()],at.prototype,"_marking",2),u([m()],at.prototype,"_error",2),u([m()],at.prototype,"_history",2),u([m()],at.prototype,"_rosterSort",2),u([m()],at.prototype,"_typeFilter",2),u([m()],at.prototype,"_recorded",2);var le=at;customElements.get("maintenance-battery-fleet-section")||customElements.define("maintenance-battery-fleet-section",le);var Ye=O`
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
`;function Ke(n){let c=window;c.customCards=c.customCards||[],c.customCards.some(t=>t.type===n.type)||c.customCards.push(n)}var rt=class extends D{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._objectFilter="";this._configuredObjects=[];this._unsub=null;this._dataLoaded=!1;this._lastConnection=null}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(t){if(this._config={...t},t.past_days&&[30,90].includes(t.past_days)?this._pastDays=t.past_days:t.window_days&&[7,14,30,365].includes(t.window_days)&&(this._windowDays=t.window_days,this._pastDays=0),typeof t.user_filter=="string"&&(this._userFilter=t.user_filter),typeof t.object_filter=="string")this._objectFilter=t.object_filter,this._configuredObjects=[];else if(Array.isArray(t.object_filter)){let e=t.object_filter.filter(i=>typeof i=="string"&&i!=="");this._objectFilter=e.length===1?e[0]:"",this._configuredObjects=e.length>1?e:[]}}getCardSize(){return 6}get _lang(){return H(this.hass)}disconnectedCallback(){if(super.disconnectedCallback(),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._dataLoaded=!1,this._lastConnection=null}updated(t){if(super.updated(t),St(this,t),t.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[t,e]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=t.objects,this._stats=e}catch{}}async _subscribe(){try{let t=await this.hass.connection.subscribeMessage(e=>{let i=e;this._objects=i.objects},{type:"maintenance_supporter/subscribe"});if(!this.isConnected){t();return}this._unsub=t}catch{}}_onEventClick(t){if(t.history_timestamp){this._openHistoryEntry(t);return}He(t.entry_id,t.task_id)||this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:t.entry_id,task_id:t.task_id},bubbles:!0,composed:!0}))}async _openHistoryEntry(t){try{let i=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:t.entry_id})).tasks?.find(o=>o.id===t.task_id)?.history?.find(o=>o.timestamp===t.history_timestamp);if(!i||Le({entry_id:t.entry_id,task_id:t.task_id,original_timestamp:t.history_timestamp,type:i.type||"completed",timestamp:i.timestamp||t.history_timestamp,notes:i.notes??null,cost:i.cost??null,duration:i.duration??null,completed_by:i.completed_by??null,used_parts:i.used_parts??null}))return}catch{}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:t.entry_id,task_id:t.task_id,original_timestamp:t.history_timestamp},bubbles:!0,composed:!0}))}render(){if(!this.hass)return d;let t=this._lang,e=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,a=this._config.title,o=null;this._userFilter&&(o=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let p=b=>{let et=b.toLowerCase();return this._objects.find(K=>K.entry_id===b||K.object.name.toLowerCase()===et)?.entry_id??null},l=new Set(this._configuredObjects.map(p).filter(b=>b!==null)),h=l.size?this._objects.filter(b=>l.has(b.entry_id)):this._objects,g=this._config.show_object_filter!==!1&&h.length>1,v=this._objectFilter?p(this._objectFilter):null,_=v&&h.some(b=>b.entry_id===v)?h.filter(b=>b.entry_id===v):h,f=new Date;f.setHours(0,0,0,0);let y=this._pastDays>0,E=y?Oe(_,f,this._pastDays,o):Re(_,f,this._windowDays,o),M=Ce(f),R=this._windowDays===365||y,$=R?E.filter(b=>b.events.length>0):E,A=b=>{let et=`cal-status-${b.status}`,ft=b.projected?"cal-event-projected":"",K=b.status==="overdue"&&b.days_until_due!=null?` (${yt(b.days_until_due,t)})`:"",ct=b.projected&&b.interval_days?r`<span class="cal-event-recur">${b.interval_unit&&b.interval_unit!=="days"?`${b.interval_days} ${s("unit_"+b.interval_unit,t)}`:s("cal_every_n_days",t).replace("{n}",String(b.interval_days))}</span>`:d,Q=b.schedule_type==="sensor_based",ht=Q?r`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${s("cal_source_sensor",t)}" icon="mdi:trending-up"></ha-icon>`:r`<ha-icon class="cal-event-icon cal-source-time"
                title="${b.adaptive_enabled?s("cal_source_time_adaptive",t):s("cal_source_time",t)}"
                icon="${b.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,_t=Q&&b.prediction_confidence&&b.status!=="triggered"&&!b.projected?r`<span class="cal-event-prediction cal-conf-${b.prediction_confidence}">
            ${s("cal_predicted",t)} · ${s(`cal_confidence_${b.prediction_confidence}`,t)}
          </span>`:d,jt=this._stats?.budget?.currency_symbol||Nt,G=b.history_type?s(b.history_type,t):s(b.status,t);return r`
        <div class="cal-event ${ft}"
          @click=${()=>this._onEventClick(b)}>
          ${ht}
          <span class="cal-status-pill ${et}">${G}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${b.object_name} · ${b.task_name}${K}</div>
            ${_t}
            ${ct}
          </div>
          ${b.avg_cost!=null&&b.avg_cost>0?r`<span class="cal-event-cost">${B(b.avg_cost,jt,t,0)}</span>`:d}
        </div>
      `},S=b=>{let[et,ft,K]=b.date.split("-").map(Number),ct=new Date(et,ft-1,K),Q=b.date===M,ht=ve(ct,t,"short"),_t=be(ct,t,"long");return r`
        <div class="cal-day-row">
          <div class="cal-day-pill ${Q?"cal-today":""}">
            <span class="cal-pill-weekday">${ht}</span>
            <span class="cal-pill-day">${ct.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${_t}</span>
              ${Q?r`<span class="cal-day-today-badge">${s("today",t)}</span>`:d}
            </div>
            ${b.events.length===0?r`<div class="cal-empty">${s("cal_no_events",t)}</div>`:b.events.map(A)}
          </div>
        </div>
      `};return r`
      <ha-card .header=${a}>
        ${e||i?r`
              <div class="cal-controls">
                ${e?r`
                      <div class="cal-window-chips cal-past-chips" title="${s("cal_past_windows",t)||"Past windows"}">
                        ${[30,90].map(b=>r`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===b?"active":""}"
                            @click=${()=>{this._pastDays=b}}>
                            −${b}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${s("cal_forward_windows",t)||"Forward windows"}">
                        ${[7,14,30,365].map(b=>r`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===b?"active":""}"
                            @click=${()=>{this._windowDays=b,this._pastDays=0}}>
                            ${b===365?"+1y":`+${b}d`}
                          </button>
                        `)}
                      </div>
                    `:d}
                ${i?r`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${b=>{this._userFilter=b.target.value}}>
                        <option value="">${s("all_users",t)}</option>
                        <option value="current_user">${s("my_tasks",t)}</option>
                      </select>
                    `:d}
                ${g?r`
                      <select class="cal-user-filter"
                        .value=${v??""}
                        @change=${b=>{this._objectFilter=b.target.value}}>
                        <option value="">${s("all_objects",t)}</option>
                        ${[...h].sort((b,et)=>b.object.name.localeCompare(et.object.name)).map(b=>r`<option value=${b.entry_id} ?selected=${b.entry_id===v}>${b.object.name}</option>`)}
                      </select>
                    `:d}
              </div>
            `:d}
        <div class="cal-rolling">
          ${$.length===0&&R?r`<div class="cal-empty">${s("cal_no_events",t)}</div>`:$.map(S)}
        </div>
      </ha-card>
    `}};rt.styles=[Bt,Ye,O`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],u([k({attribute:!1})],rt.prototype,"hass",2),u([m()],rt.prototype,"_config",2),u([m()],rt.prototype,"_objects",2),u([m()],rt.prototype,"_stats",2),u([m()],rt.prototype,"_windowDays",2),u([m()],rt.prototype,"_pastDays",2),u([m()],rt.prototype,"_userFilter",2),u([m()],rt.prototype,"_objectFilter",2),u([m()],rt.prototype,"_unsub",2);var ki=[{value:7,key:"cal_editor_window_week"},{value:14,key:"cal_editor_window_fortnight"},{value:30,key:"cal_editor_window_month"},{value:365,key:"cal_editor_window_year"}],Ct=class extends D{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}get _lang(){return H(this.hass)}setConfig(t){this._config={...t}}updated(){let t=this._lang;t&&!_e(t)&&J(t).then(()=>this.requestUpdate())}_valueChanged(t,e){let i={...this._config,[t]:e};t==="show_window_chips"&&e===!0&&delete i.show_window_chips,t==="show_user_filter"&&e===!0&&delete i.show_user_filter,t==="show_object_filter"&&e===!0&&delete i.show_object_filter,t==="title"&&(!e||typeof e=="string"&&e.trim()==="")&&delete i.title,t==="user_filter"&&e===""&&delete i.user_filter,this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}render(){let t=this._lang,e=this._config.window_days??30,i=this._config.show_window_chips!==!1,a=this._config.show_user_filter!==!1,o=this._config.user_filter??"",p=this._config.title??"";return r`
      <div class="editor">
        <div class="row">
          <label for="title">${s("card_title",t)}</label>
          <input
            id="title"
            type="text"
            .value=${p}
            @input=${l=>this._valueChanged("title",l.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">${s("cal_editor_window",t)}</label>
          <select
            id="window"
            @change=${l=>this._valueChanged("window_days",Number(l.target.value))}
          >
            ${ki.map(l=>r`<option value="${l.value}" ?selected=${l.value===e}>${s(l.key,t)}</option>`)}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">${s("cal_editor_show_chips",t)}</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${i}
            @change=${l=>this._valueChanged("show_window_chips",l.target.checked)}
          />
        </div>
        <div class="hint">${s("cal_editor_chips_hint",t)}</div>
        <div class="row toggle">
          <label for="userf">${s("cal_editor_show_user_filter",t)}</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${a}
            @change=${l=>this._valueChanged("show_user_filter",l.target.checked)}
          />
        </div>
        <div class="row">
          <label for="userv">${s("cal_editor_default_user",t)}</label>
          <select
            id="userv"
            @change=${l=>this._valueChanged("user_filter",l.target.value)}
          >
            <option value="" ?selected=${o===""}>${s("all_users",t)}</option>
            <option value="current_user" ?selected=${o==="current_user"}>
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
            @change=${l=>this._valueChanged("show_object_filter",l.target.checked)}
          />
        </div>
        <div class="hint">${s("cal_editor_object_hint",t)}</div>
      </div>
    `}};Ct.styles=O`
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
  `,u([k({attribute:!1})],Ct.prototype,"hass",2),u([m()],Ct.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",rt);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",Ct);Ke({type:"maintenance-supporter-calendar-card",name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});var ot=class extends D{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel="",this._inputType="",this._inputValue="",this._open=!0,new Promise(e=>{this._resolve=e,this._promptResolve=null})}prompt(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel=t.inputLabel||"",this._inputType=t.inputType||"text",this._inputValue=t.inputValue||"",this._open=!0,new Promise(e=>{this._promptResolve=e,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return d;let t=H(this.hass);return r`
      <ha-dialog open @closed=${this._cancel}>
        <div class="dialog-title">${this._title}</div>
        <div class="content">
          ${this._message}
          ${this._inputLabel?r`
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
    `}};ot.styles=[fe,O`
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
  `],u([k({attribute:!1})],ot.prototype,"hass",2),u([m()],ot.prototype,"_open",2),u([m()],ot.prototype,"_title",2),u([m()],ot.prototype,"_message",2),u([m()],ot.prototype,"_confirmText",2),u([m()],ot.prototype,"_danger",2),u([m()],ot.prototype,"_inputLabel",2),u([m()],ot.prototype,"_inputType",2),u([m()],ot.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",ot);var nt=class extends D{constructor(){super(...arguments);this.objects=[];this._summary=null;this._loaded=!1;this._busy=!1;this._error="";this._query="";this._results=[];this._expanded=!1;this._initiallyLoaded=!1;this._searchTimer=0}get _lang(){return H(this.hass)}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._initiallyLoaded&&(this._initiallyLoaded=!0,this._load(),J(this._lang).then(()=>this.requestUpdate()))}async _load(){this._busy=!0;try{this._summary=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/storage"}),this._error=""}catch(t){this._error=C(t,this._lang)}finally{this._loaded=!0,this._busy=!1}}_nameFor(t){return this.objects.find(i=>i.object?.id===t)?.object?.name||t.slice(0,8)}_entryFor(t){return this.objects.find(e=>e.object?.id===t)?.entry_id}_toggle(){this._expanded=!this._expanded}_openObject(t){this.dispatchEvent(new CustomEvent("open-object",{detail:{entry_id:t},bubbles:!0,composed:!0}))}_onSearch(t){this._query=t.target.value,clearTimeout(this._searchTimer),this._searchTimer=window.setTimeout(()=>{this._doSearch()},250)}async _doSearch(){let t=this._query.trim();if(!t){this._results=[];return}try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/search",query:t});this._results=e.results||[]}catch(e){this._error=C(e,this._lang),this._results=[]}}async _openResult(t){if(t.kind==="weblink"){X(t.url)&&window.open(t.url,"_blank","noopener");return}try{await xt(this.hass,t.id)}catch(e){this._error=C(e,this._lang)}}_renderResult(t,e){return r`
      <div class="obj-row result-row" title=${s("doc_open",e)} @click=${()=>this._openResult(t)}>
        <ha-icon icon=${t.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"}></ha-icon>
        <div class="result-info">
          <div class="result-title">${wt(t)}</div>
          <div class="result-obj">${t.object_name}</div>
        </div>
        <ha-icon class="result-open" icon=${t.kind==="weblink"?"mdi:open-in-new":"mdi:eye-outline"}></ha-icon>
      </div>
    `}render(){if(!this._loaded||!this._summary)return d;let t=this._summary;if(!t.document_count)return d;let e=this._lang,i=Object.entries(t.by_object??{}).filter(([,a])=>a.files>0||a.links>0).map(([a,o])=>({id:a,name:this._nameFor(a),entry:this._entryFor(a),...o})).sort((a,o)=>o.bytes-a.bytes);return r`
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
                ${gt(t.total_bytes,e)}
                ${t.dedup_savings_bytes>0?r`<span class="saved">−${gt(t.dedup_savings_bytes,e)}</span>`:d}
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

          ${this._expanded?r`
                <div class="body">
                  <div class="totals">
                    <div class="stat">
                      <div class="stat-value">${gt(t.total_bytes,e)}</div>
                      <div class="stat-label">
                        <ha-icon icon="mdi:file-document-outline"></ha-icon> ${t.file_count}
                        <ha-icon icon="mdi:link-variant"></ha-icon> ${t.link_count}
                      </div>
                    </div>
                    ${t.dedup_savings_bytes>0?r`<div class="stat">
                          <div class="stat-value saved">−${gt(t.dedup_savings_bytes,e)}</div>
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

                  ${this._error?r`<div class="error">${this._error}</div>`:d}

                  ${this._query.trim()?this._results.length?r`<div class="obj-list">${this._results.map(a=>this._renderResult(a,e))}</div>`:r`<div class="search-empty">${s("doc_search_none",e)}</div>`:i.length?r`<div class="obj-list">${i.map(a=>this._renderObjRow(a,e))}</div>`:d}
                </div>
              `:d}
        </div>
      </ha-card>
    `}_renderObjRow(t,e){let i=t.entry;return r`
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
          ${t.files>0?r`<ha-icon icon="mdi:file-document-outline"></ha-icon>${t.files}`:d}
          ${t.links>0?r`<ha-icon icon="mdi:link-variant"></ha-icon>${t.links}`:d}
        </span>
        <span class="obj-size">${gt(t.bytes,e)}</span>
        ${i?r`<ha-icon class="obj-go" icon="mdi:chevron-right"></ha-icon>`:d}
      </div>
    `}};nt.styles=O`
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
  `,u([k({attribute:!1})],nt.prototype,"hass",2),u([k({attribute:!1})],nt.prototype,"objects",2),u([m()],nt.prototype,"_summary",2),u([m()],nt.prototype,"_loaded",2),u([m()],nt.prototype,"_busy",2),u([m()],nt.prototype,"_error",2),u([m()],nt.prototype,"_query",2),u([m()],nt.prototype,"_results",2),u([m()],nt.prototype,"_expanded",2);customElements.get("maintenance-storage-section-card")||customElements.define("maintenance-storage-section-card",nt);var $i=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"],dt=class extends D{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId="";this._values=new Array(12).fill("");this._save=async()=>{let t=this._buildOverrides();if(t!==null){this._loading=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:t}),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved"))}catch(e){this._error=C(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}};this._clearAll=async()=>{this._loading=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:{}}),this._values=new Array(12).fill(""),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved"))}catch(t){this._error=C(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}get _lang(){return H(this.hass)}open(t,e,i){if(this._entryId=t,this._taskId=e,this._values=new Array(12).fill(""),i)for(let[a,o]of Object.entries(i)){let p=parseInt(a,10);p>=1&&p<=12&&typeof o=="number"&&(this._values[p-1]=o.toString())}this._error="",this._open=!0}_close(){this._open=!1}_buildOverrides(){let t={};for(let e=0;e<12;e++){let i=this._values[e].trim();if(!i)continue;let a=parseFloat(i);if(Number.isNaN(a))return this._error=`${s("month_"+["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][e],this._lang)}: ${s("seasonal_override_invalid",this._lang)}`,null;if(a<.1||a>5)return this._error=s("seasonal_override_range",this._lang),null;t[e+1]=a}return t}render(){if(!this._open)return r``;let t=this._lang;return r`
      <ha-dialog open @closed=${this._close} heading="${s("seasonal_overrides_title",t)}">
        <div class="content">
          <p class="hint">${s("seasonal_overrides_hint",t)}</p>
          ${this._error?r`<div class="error">${this._error}</div>`:d}
          <div class="months">
            ${$i.map((e,i)=>r`
              <label class="month">
                <span class="mn">${s(e,t)}</span>
                <input type="number" step="0.1" min="0.1" max="5.0"
                  placeholder="1.0"
                  .value=${this._values[i]}
                  @input=${a=>{let o=[...this._values];o[i]=a.target.value,this._values=o}} />
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
    `}};dt.styles=O`
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
  `,u([k({attribute:!1})],dt.prototype,"hass",2),u([m()],dt.prototype,"_open",2),u([m()],dt.prototype,"_loading",2),u([m()],dt.prototype,"_error",2),u([m()],dt.prototype,"_entryId",2),u([m()],dt.prototype,"_taskId",2),u([m()],dt.prototype,"_values",2);customElements.get("maintenance-seasonal-overrides-dialog")||customElements.define("maintenance-seasonal-overrides-dialog",dt);var lt=class extends D{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._groupId=null;this._name="";this._description="";this._selected=new Set;this._toggleTask=(t,e)=>{let i=`${t}:${e}`,a=new Set(this._selected);a.has(i)?a.delete(i):a.add(i),this._selected=a};this._save=async()=>{let t=this._name.trim();if(!t){this._error=s("group_name_required",this._lang);return}this._loading=!0,this._error="";try{let e=this._buildTaskRefs();this._groupId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/update",group_id:this._groupId,name:t,description:this._description,task_refs:e}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/create",name:t,description:this._description,task_refs:e}),this._open=!1,this.dispatchEvent(new CustomEvent("group-saved"))}catch(e){this._error=C(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}get _lang(){return H(this.hass)}openCreate(){this._reset(),this._open=!0}openEdit(t,e){this._reset(),this._groupId=t,this._name=e.name,this._description=e.description||"",this._selected=new Set(e.task_refs.map(i=>`${i.entry_id}:${i.task_id}`)),this._open=!0}_reset(){this._groupId=null,this._name="",this._description="",this._selected=new Set,this._error=""}_close(){this._open=!1}_buildTaskRefs(){return[...this._selected].map(t=>{let[e,i]=t.split(":",2);return{entry_id:e,task_id:i}})}render(){if(!this._open)return r``;let t=this._lang,e=this._groupId?s("edit_group",t):s("new_group",t);return r`
      <ha-dialog open @closed=${this._close} heading="${e}">
        <div class="content">
          ${this._error?r`<div class="error">${this._error}</div>`:d}
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
          ${this.objects.length===0?r`<div class="hint">${s("no_objects",t)}</div>`:r`
              <div class="objects">
                ${[...this.objects].sort((i,a)=>i.object.name.localeCompare(a.object.name)).map(i=>r`
                  <div class="object-block">
                    <div class="object-name">${i.object.name}</div>
                    ${i.tasks.length===0?r`<div class="hint small">${s("no_tasks_short",t)}</div>`:[...i.tasks].sort((a,o)=>a.name.localeCompare(o.name)).map(a=>{let o=`${i.entry_id}:${a.id}`,p=this._selected.has(o);return r`
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
    `}};lt.styles=O`
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
  `,u([k({attribute:!1})],lt.prototype,"hass",2),u([k({attribute:!1})],lt.prototype,"objects",2),u([m()],lt.prototype,"_open",2),u([m()],lt.prototype,"_loading",2),u([m()],lt.prototype,"_error",2),u([m()],lt.prototype,"_groupId",2),u([m()],lt.prototype,"_name",2),u([m()],lt.prototype,"_description",2),u([m()],lt.prototype,"_selected",2);customElements.get("maintenance-group-dialog")||customElements.define("maintenance-group-dialog",lt);var mt=class extends D{constructor(){super(...arguments);this._open=!1;this._busy=!1;this._error="";this._name="";this._views=[];this._filters=null;this._localeReady=!1;this._save=async()=>{let t=this._name.trim();if(!(!t||this._busy||!this._filters)){this._busy=!0,this._error="";try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/save",name:t,filters:this._filters});this._name="",this._emitChanged(e.views||[])}catch(e){this._error=C(e,this._lang)}finally{this._busy=!1}}};this._delete=async t=>{if(!this._busy){this._busy=!0,this._error="";try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/delete",view_id:t});this._emitChanged(e.views||[])}catch(e){this._error=C(e,this._lang)}finally{this._busy=!1}}}}get _lang(){return H(this.hass)}updated(t){t.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,J(this._lang).then(()=>this.requestUpdate()))}async open(t,e){this._open=!0,this._error="",this._name="",this._filters=t,this._views=e}_close(){this._open=!1}_emitChanged(t){this._views=t,this.dispatchEvent(new CustomEvent("saved-views-changed",{bubbles:!0,composed:!0,detail:{views:t}}))}render(){if(!this._open)return r``;let t=this._lang;return r`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${e=>e.stopPropagation()}>
          <div class="title">${s("views_dialog_title",t)}</div>
          <div class="hint">${s("views_dialog_hint",t)}</div>
          ${this._error?r`<div class="error">${this._error}</div>`:d}

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

          ${this._views.length===0?r`<div class="empty">${s("views_none_yet",t)}</div>`:r`
                <div class="list">
                  ${this._views.map(e=>r`
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
    `}};mt.styles=O`
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
  `,u([k({attribute:!1})],mt.prototype,"hass",2),u([m()],mt.prototype,"_open",2),u([m()],mt.prototype,"_busy",2),u([m()],mt.prototype,"_error",2),u([m()],mt.prototype,"_name",2),u([m()],mt.prototype,"_views",2);customElements.get("maintenance-saved-views-dialog")||customElements.define("maintenance-saved-views-dialog",mt);var Ti=60,ji=20,Qe=30,Si={approaching:"\u2197",stable:"\u2192",easing:"\u2198"};function ce(n,c){let t=n.trigger_config;if(!t?.entity_id)return null;let e,i=t.type||"threshold";if(i==="threshold")if(t.trigger_above!=null)e=1;else if(t.trigger_below!=null)e=-1;else return null;else if(i==="counter"||i==="runtime"||i==="state_change")e=1;else return null;let a=c.get(t.entity_id)||[],o=a.length>=2?a.map(_=>({ts:_.ts,val:_.val})):(n.history||[]).filter(_=>_.trigger_value!=null).map(_=>({ts:new Date(_.timestamp).getTime(),val:_.trigger_value}));if(n.trigger_current_value!=null&&(o=[...o,{ts:Date.now(),val:n.trigger_current_value}]),o.length<2)return null;o.sort((_,f)=>_.ts-f.ts);let p=o.map(_=>_.val),l=Math.max(...p)-Math.min(...p),h=p[p.length-1]-p[0],g=i==="threshold"?t.trigger_above??t.trigger_below:i==="counter"?t.trigger_target_value:i==="runtime"?t.trigger_runtime_hours:t.trigger_target_changes,v=typeof g=="number"?Math.max(Math.abs(g-p[0]),l):l;return v===0||Math.abs(h)<v*(typeof g=="number"?.05:.15)?"stable":Math.sign(h)===e?"approaching":"easing"}function de(n,c){let t=n.trigger_config??null;if(!t)return d;let e=t.type||"threshold",i=n.trigger_entity_info?.unit_of_measurement??"",a=0,o="";if(e==="threshold"){let h=n.trigger_current_value??null;if(h==null)return d;let g=t.trigger_above,v=t.trigger_below;if(g!=null){let _=v??0,f=g-_||1;a=Math.min(100,Math.max(0,(h-_)/f*100)),o=`${U(h,c?.lang,1)} / ${U(g,c?.lang)} ${i}`}else if(v!=null){let f=n.trigger_entity_info?.max??(v*2||100),y=f-v||1;a=Math.min(100,Math.max(0,(f-h)/y*100)),o=`${U(h,c?.lang,1)} / ${U(v,c?.lang)} ${i}`}else if(t.trigger_equals!=null||t.trigger_not_equals!=null){let _=t.trigger_equals!=null?`= ${t.trigger_equals}`:`\u2260 ${t.trigger_not_equals}`;o=`${U(h,c?.lang,1)} (${_}${i?` ${i}`:""})`,a=n.trigger_active?100:0}else return d}else if(e==="counter"){let h=t.trigger_target_value||1,g;if(t.trigger_delta_mode?(g=n.trigger_current_delta??null,g==null&&n.trigger_baseline_value!=null&&n.trigger_current_value!=null&&(g=n.trigger_current_value-n.trigger_baseline_value)):g=n.trigger_current_value??null,g==null)return d;a=Math.min(100,Math.max(0,g/h*100)),o=`${U(g,c?.lang,1)} / ${U(h,c?.lang)} ${i}`}else if(e==="state_change"){let h=t.trigger_target_changes||1,g=n.trigger_current_value??null;if(g==null)return d;a=Math.min(100,Math.max(0,g/h*100)),o=`${U(g,c?.lang,0)} / ${U(h,c?.lang,0)}`}else if(e==="runtime"){let h=t.trigger_runtime_hours||100,g=n.trigger_current_value??null;if(g==null)return d;a=Math.min(100,Math.max(0,g/h*100)),o=`${U(g,c?.lang,1)}h / ${U(h,c?.lang)}h`}else if(e==="compound"){let h=t.compound_logic||t.operator||"AND",g=t.conditions?.length||0;o=`${h} (${g})`,a=n.trigger_active?100:0}else return d;let p=a>=100,l=a>90?"var(--error-color, #f44336)":a>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return r`
    <div class="trigger-progress">
      <div class="trigger-progress-bar">
        <div class="trigger-progress-fill${p?" overflow":""}" style="width:${a}%;background:${l}"></div>
      </div>
      <span class="trigger-progress-label">${o}${c?.trend?r` <i class="trend-arrow trend-${c.trend}" title="${s(`trend_${c.trend}`,c.lang??"en")}" aria-label="${s(`trend_${c.trend}`,c.lang??"en")}">${Si[c.trend]}</i>`:d}</span>
    </div>
  `}function pe(n,c,t){if(!n.trigger_config?.entity_id)return d;let e=n.trigger_config.entity_id,i=c.get(e)||[],a=[];if(i.length>=2)a=i.map(S=>({ts:S.ts,val:S.val}));else{if(!n.history)return d;for(let S of n.history)S.trigger_value!=null&&a.push({ts:new Date(S.timestamp).getTime(),val:S.trigger_value})}if(n.trigger_current_value!=null&&a.push({ts:Date.now(),val:n.trigger_current_value}),a.length<2)return d;a.sort((S,b)=>S.ts-b.ts);let o=Ti,p=ji,l=a.map(S=>S.val),h=Math.min(...l),g=Math.max(...l),v=g-h||1;h-=v*.1,g+=v*.1;let _=a[0].ts,y=a[a.length-1].ts-_||1,E=S=>(S-_)/y*o,M=S=>2+(1-(S-h)/(g-h))*(p-4),R=a;if(R.length>Qe){let S=Math.ceil(R.length/Qe);R=R.filter((b,et)=>et%S===0||et===R.length-1)}let $=R.map(S=>`${j(E(S.ts))},${j(M(S.val))}`).join(" "),A=n.trigger_active?"var(--error-color, #f44336)":"var(--primary-color)";return r`
    <svg class="mini-sparkline" viewBox="0 0 ${o} ${p}" preserveAspectRatio="none" role="img" aria-label="${s("chart_mini_sparkline",t)}">
      <polyline points="${$}" fill="none" stroke="${A}" stroke-width="1.5" stroke-linejoin="round" />
    </svg>
  `}function Xe(n,c){let t=c;if(n.days_until_due==null||!n.interval_days||n.interval_days<=0)return d;let{pct:e,overflow:i}=Ut(n.interval_days,n.days_until_due,n.interval_unit),a="var(--success-color, #4caf50)";return n.status==="overdue"?a="var(--error-color, #f44336)":n.status==="due_soon"&&(a="var(--warning-color, #ff9800)"),r`
    <div class="days-progress">
      <div class="days-progress-labels">
        <span>${n.last_performed?`${s("last_performed",t)}: ${q(n.last_performed,t)}`:""}</span>
        <span>${n.next_due?`${s("next_due",t)}: ${q(n.next_due,t)}`:""}</span>
      </div>
      <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(e)}" aria-valuemin="0" aria-valuemax="100" aria-label="${s("days_progress",t)}">
        <div class="days-progress-fill${i?" overflow":""}" style="width:${e}%;background:${a}"></div>
      </div>
      <div class="days-progress-text">${yt(n.days_until_due,t)}</div>
    </div>
  `}var Jt=210,pt=46,vt=14,bt=12,Je=14,Ei=20+Je,Mi=[{days:7,key:"chart_range_7d"},{days:30,key:"chart_range_30d"},{days:90,key:"chart_range_90d"},{days:365,key:"chart_range_1y"}],W=class extends D{constructor(){super(...arguments);this.points=[];this.events=[];this.unit="";this.lang="en";this.thresholdAbove=null;this.thresholdBelow=null;this.targetValue=null;this.forceZero=!1;this.projection=null;this.rangeDays=30;this.showRange=!0;this.busy=!1;this.hideOutliers=!1;this.showOutlierToggle=!0;this._width=0;this._hover=null;this._ro=null}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(t=>{let e=Math.floor(t[0]?.contentRect?.width||0);e&&Math.abs(e-this._width)>2&&(this._width=e)}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=null}_emitRange(t){t!==this.rangeDays&&this.dispatchEvent(new CustomEvent("range-change",{detail:{days:t},bubbles:!0,composed:!0}))}_toggleOutliers(){this.dispatchEvent(new CustomEvent("outlier-toggle",{detail:{hide:!this.hideOutliers},bubbles:!0,composed:!0}))}render(){let t=this._width||320,e=[...this.points].sort((a,o)=>a.ts-o.ts),i=this.lang;return r`
      <div class="chart-wrap">
        ${this.showRange?r`<div class="range-chips" role="group">
              ${this.showOutlierToggle?r`<button
                    class="range-chip outlier-chip ${this.hideOutliers?"active":""}"
                    ?disabled=${this.busy}
                    title=${s("hide_outliers",i)}
                    @click=${()=>this._toggleOutliers()}
                  ><ha-icon icon="mdi:filter-variant"></ha-icon></button>`:d}
              ${Mi.map(a=>r`<button
                  class="range-chip ${this.rangeDays===a.days?"active":""}"
                  ?disabled=${this.busy}
                  @click=${()=>this._emitRange(a.days)}
                >${s(a.key,i)}</button>`)}
            </div>`:d}
        ${e.length<2?r`<div class="chart-empty">
              <ha-icon icon="mdi:chart-line"></ha-icon> ${s("loading_chart",i)}
            </div>`:this._renderSvg(t,e)}
      </div>
    `}_renderSvg(t,e){let i=this.lang,a=t-pt-vt,o=Jt-Ei,p=o-bt,l=1/0,h=-1/0;for(let T of e)l=Math.min(l,T.min??T.val),h=Math.max(h,T.max??T.val);this.thresholdAbove!=null&&(l=Math.min(l,this.thresholdAbove),h=Math.max(h,this.thresholdAbove)),this.thresholdBelow!=null&&(l=Math.min(l,this.thresholdBelow),h=Math.max(h,this.thresholdBelow)),this.targetValue!=null&&(l=Math.min(l,this.targetValue),h=Math.max(h,this.targetValue)),this.forceZero&&(l=Math.min(l,0));let g=(h-l||1)*.06,v=this.forceZero&&l>=0?0:l-g,{ticks:_,niceMin:f,niceMax:y}=At(v,h+g,4);this.forceZero&&l>=0&&f<0&&(f=0,_=_.filter(T=>T>=0));let E=e[0].ts,M=this.projection&&this.projection.length===2?this.projection[1].ts:null,R=M!=null?Math.max(e[e.length-1].ts,M):e[e.length-1].ts,$=R-E||1,A=Gt(E,R),S=T=>pt+(T-E)/$*a,b=T=>bt+(1-(T-f)/(y-f||1))*p,et=e.map(T=>`${j(S(T.ts))},${j(b(T.val))}`).join(" "),ft=`M${j(S(e[0].ts))},${o} `+e.map(T=>`L${j(S(T.ts))},${j(b(T.val))}`).join(" ")+` L${j(S(e[e.length-1].ts))},${o} Z`,K="",ct=e.filter(T=>T.min!=null&&T.max!=null);if(ct.length>=2){let T=ct.map(z=>`${j(S(z.ts))},${j(b(z.max))}`),w=[...ct].reverse().map(z=>`${j(S(z.ts))},${j(b(z.min))}`);K=`M${T[0]} `+T.slice(1).map(z=>`L${z}`).join(" ")+` L${w.join(" L")} Z`}let Q=[];if(this.thresholdBelow!=null){let T=b(this.thresholdBelow);Q.push({y:T,h:Math.max(0,o-T),lineY:T,label:`\u25BC ${ut(this.thresholdBelow,i)}`,labelY:Math.min(o-4,T+13)})}if(this.thresholdAbove!=null){let T=b(this.thresholdAbove);Q.push({y:bt,h:Math.max(0,T-bt),lineY:T,label:`\u25B2 ${ut(this.thresholdAbove,i)}`,labelY:Math.max(bt+11,T-5)})}let ht=e[e.length-1],_t=(this.events||[]).filter(T=>T.ts>=E&&T.ts<=R),jt=Yt(E,R,Math.max(2,Math.min(5,Math.floor(a/110)+1))),G=this._hover;return r`
      <div class="svg-holder">
        <svg
          class="chart-svg"
          viewBox="0 0 ${t} ${Jt}"
          width=${t}
          height=${Jt}
          role="img"
          aria-label=${s("chart_sparkline",i)}
          @pointermove=${T=>this._onPointer(T,e,S,b,t)}
          @pointerdown=${T=>this._onPointer(T,e,S,b,t)}
          @pointerleave=${()=>this._hover=null}
        >
          <defs>
            <clipPath id="plot"><rect x="${pt}" y="${bt}" width="${a}" height="${p}" /></clipPath>
            ${Q.length?V`<clipPath id="danger">${Q.map(T=>V`<rect x="${pt}" y="${j(T.y)}" width="${a}" height="${j(T.h)}" />`)}</clipPath>`:d}
            <!-- Diagonal hatch so the danger zone reads without relying on the
                 red tint alone (dark-theme contrast + colour-blind support). -->
            <pattern id="dangerHatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
              <rect width="7" height="7" fill="var(--error-color, #f44336)" opacity="0.10" />
              <line x1="0" y1="0" x2="0" y2="7" stroke="var(--error-color, #f44336)" stroke-width="1.4" opacity="0.5" />
            </pattern>
          </defs>

          ${_.map(T=>{let w=b(T);return w<bt-1||w>o+1?d:V`
              <line x1="${pt}" y1="${j(w)}" x2="${t-vt}" y2="${j(w)}"
                stroke="var(--divider-color)" stroke-width="1" opacity="0.6" />
              <text x="${pt-7}" y="${j(w+3.5)}" text-anchor="end" class="tick-label">${ut(T,i)}</text>`})}

          ${Q.map(T=>V`<rect x="${pt}" y="${j(T.y)}" width="${a}" height="${j(T.h)}"
              fill="url(#dangerHatch)" />`)}

          ${K?V`<path d="${K}" fill="var(--primary-color)" opacity="0.08" clip-path="url(#plot)" />`:d}
          <path d="${ft}" fill="var(--primary-color)" opacity="0.10" clip-path="url(#plot)" />
          <polyline points="${et}" fill="none" stroke="var(--primary-color)" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" clip-path="url(#plot)" />
          ${Q.length?V`<polyline points="${et}" fill="none" stroke="var(--error-color, #f44336)" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" clip-path="url(#danger)" />`:d}

          ${Q.map(T=>V`
              <line x1="${pt}" y1="${j(T.lineY)}" x2="${t-vt}" y2="${j(T.lineY)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${t-vt-4}" y="${j(T.labelY)}" text-anchor="end" class="zone-label">${T.label}</text>`)}

          ${this.targetValue!=null?V`<line x1="${pt}" y1="${j(b(this.targetValue))}" x2="${t-vt}" y2="${j(b(this.targetValue))}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${t-vt-4}" y="${j(b(this.targetValue)-5)}" text-anchor="end" class="zone-label">◆ ${ut(this.targetValue,i)} ${this.unit}</text>`:d}

          ${this.projection&&this.projection.length===2?V`<line x1="${j(S(this.projection[0].ts))}" y1="${j(b(this.projection[0].val))}"
                x2="${j(Math.min(S(this.projection[1].ts),t-vt))}" y2="${j(b(Math.max(f,Math.min(y,this.projection[1].val))))}"
                stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.8" />`:d}

          ${jt.map((T,w)=>{let z=S(T),ee=w===0?"start":w===jt.length-1?"end":"middle";return V`<text x="${j(z)}" y="${Jt-5}" text-anchor="${ee}" class="tick-label">${Mt(T,i,A)}</text>`})}

          <line x1="${pt}" y1="${o}" x2="${t-vt}" y2="${o}" stroke="var(--divider-color)" stroke-width="1" />

          ${_t.map(T=>{let w=S(T.ts),z=T.type==="completed"?"var(--success-color, #4caf50)":T.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return V`
              <line x1="${j(w)}" y1="${bt}" x2="${j(w)}" y2="${o}" stroke="${z}" stroke-width="1" opacity="0.14" />
              <rect x="${j(w-1.5)}" y="${o+3}" width="3" height="${Je-6}" rx="1.5" fill="${z}">
                <title>${ae(T.ts,i)}</title>
              </rect>`})}

          ${G?V`
                <line x1="${j(G.x)}" y1="${bt}" x2="${j(G.x)}" y2="${o}"
                  stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.7" />
                <circle cx="${j(G.x)}" cy="${j(G.y)}" r="4.5" fill="var(--primary-color)"
                  stroke="var(--card-background-color, #fff)" stroke-width="2" />`:V`<circle cx="${j(S(ht.ts))}" cy="${j(b(ht.val))}" r="4" fill="var(--primary-color)"
                stroke="var(--card-background-color, #fff)" stroke-width="1.5" />`}
        </svg>
        ${G?r`<div
              class="hover-chip"
              style="left:${Math.min(Math.max(G.x,70),t-70)}px"
            >
              <div class="hover-date">${ae(G.p.ts,i)}</div>
              <div class="hover-val">
                ${$t(G.p.val,this.unit,i)}
                ${G.p.min!=null&&G.p.max!=null?r`<span class="hover-range">(${ut(G.p.min,i)}–${ut(G.p.max,i)})</span>`:d}
              </div>
            </div>`:d}
      </div>
    `}_onPointer(t,e,i,a,o){let l=t.currentTarget.getBoundingClientRect(),h=(t.clientX-l.left)/l.width*o;if(h<pt-8||h>o-vt+8){this._hover=null;return}let g=e[0],v=1/0;for(let _ of e){let f=Math.abs(i(_.ts)-h);f<v&&(v=f,g=_)}this._hover={x:i(g.ts),y:a(g.val),p:g}}};W.styles=O`
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
  `,u([k({attribute:!1})],W.prototype,"points",2),u([k({attribute:!1})],W.prototype,"events",2),u([k()],W.prototype,"unit",2),u([k()],W.prototype,"lang",2),u([k({attribute:!1})],W.prototype,"thresholdAbove",2),u([k({attribute:!1})],W.prototype,"thresholdBelow",2),u([k({attribute:!1})],W.prototype,"targetValue",2),u([k({type:Boolean})],W.prototype,"forceZero",2),u([k({attribute:!1})],W.prototype,"projection",2),u([k({attribute:!1})],W.prototype,"rangeDays",2),u([k({type:Boolean})],W.prototype,"showRange",2),u([k({type:Boolean})],W.prototype,"busy",2),u([k({type:Boolean})],W.prototype,"hideOutliers",2),u([k({type:Boolean})],W.prototype,"showOutlierToggle",2),u([m()],W.prototype,"_width",2),u([m()],W.prototype,"_hover",2);customElements.get("maintenance-trigger-chart")||customElements.define("maintenance-trigger-chart",W);function Ze(n){let c=(n??"").trim().toLowerCase();return c==="on"||c==="open"||c==="true"?1:c==="off"||c==="closed"||c==="false"?0:null}function Ci(n,c,t){if(n.length<2)return null;let e=t.now??Date.now(),i=Math.max(0,c.trigger_for_minutes??0)*6e4,a=c.trigger_from_state?Ze(c.trigger_from_state):null,o=c.trigger_to_state?Ze(c.trigger_to_state):null;if(c.trigger_from_state&&a===null||c.trigger_to_state&&o===null)return null;let p=[...n].sort(($,A)=>$.ts-A.ts),l=[];for(let $ of p){let A=l[l.length-1];(!A||A.level!==$.val)&&l.push({start:$.ts,level:$.val})}let h=$=>($+1<l.length?l[$+1].start:e)-l[$].start>=i,g=($,A,S)=>{let b=$[$.length-1];b&&b.val!==S&&$.push({ts:A,val:b.val}),$.push({ts:A,val:S})};if((c.trigger_target_changes??1)===1&&o!==null){let $=[];l.forEach((S,b)=>g($,S.start,S.level===o&&h(b)?1:0));let A=$[$.length-1]?.val??0;return $.push({ts:e,val:A}),{points:$,mode:"alarm"}}let _=t.since??l[0].start,f=0,y=[];for(let $=1;$<l.length;$++){let A=l[$-1],S=l[$];a!==null&&A.level!==a||o!==null&&S.level!==o||!h($)||S.start<_||(f+=1,y.push(S.start))}let E=Math.max(0,(t.current??f)-f),M=[{ts:Math.max(_,l[0].start),val:E}],R=E;for(let $ of y)R+=1,g(M,$,R);return M.push({ts:e,val:R}),{points:M,mode:"count"}}function Ri(n){if(n.length<4)return n;let c=n.map(h=>h.val).sort((h,g)=>h-g),t=h=>{let g=(c.length-1)*h,v=Math.floor(g),_=Math.ceil(g);return c[v]+(c[_]-c[v])*(g-v)},e=t(.25),i=t(.75),a=i-e;if(a===0)return n;let o=e-1.5*a,p=i+1.5*a,l=n.filter(h=>h.val>=o&&h.val<=p);return l.length>=2?l:n}function ti(n,c){let t=n.trigger_config;if(!t)return d;let e=c.lang,i=n.trigger_entity_info,a=n.trigger_entity_infos,o=i?.friendly_name||t.entity_id||"\u2014",p=t.entity_id||"",l=t.entity_ids||(p?[p]:[]),h=i?.unit_of_measurement||"",g=n.trigger_current_value,v=t.type||"threshold",_=l.length>1,f=Oi(n,h,c);return r`
    <h3>${s("trigger",e)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${_?r`
            <div class="trigger-entity-name">${l.length} ${s("entities",e)} (${t.entity_logic||"any"})</div>
            <div class="trigger-entity-id">${l.map((y,E)=>r`${E>0?", ":""}<span class="entity-link" @click=${M=>Ot(M,y)}>${y}</span>`)}${t.attribute?` \u2192 ${t.attribute}`:""}</div>
          `:r`
            <div class="trigger-entity-name">${o}</div>
            <div class="trigger-entity-id">${p?r`<span class="entity-link" @click=${y=>Ot(y,p)}>${p}</span>`:""}${t.attribute?` \u2192 ${t.attribute}`:""}</div>
          `}
        </div>
        <span class="status-badge ${n.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
          ${n.trigger_active?s("triggered",e):s("ok",e)}
        </span>
      </div>

      ${f?Di(f,e):g!=null?r`
              <div class="trigger-value-row">
                <span class="trigger-current ${n.trigger_active?"active":""}">${typeof g=="number"?$t(g,"",e):g}</span>
                ${h?r`<span class="trigger-unit">${h}</span>`:d}
              </div>
            `:d}

      <div class="trigger-limits">
        ${v==="threshold"?r`
          ${t.trigger_above!=null?r`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_above",e)}: ${t.trigger_above} ${h}</span>`:d}
          ${t.trigger_below!=null?r`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_below",e)}: ${t.trigger_below} ${h}</span>`:d}
          ${t.trigger_equals!=null?r`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> = ${t.trigger_equals} ${h}</span>`:d}
          ${t.trigger_not_equals!=null?r`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ≠ ${t.trigger_not_equals} ${h}</span>`:d}
          ${t.trigger_for_minutes?r`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${s("for_minutes",e)}: ${t.trigger_for_minutes}</span>`:d}
        `:d}
        ${v==="state_change"?r`
          ${t.trigger_target_changes!=null?r`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("target_changes",e)}: ${t.trigger_target_changes}</span>`:d}
        `:d}
        ${v==="runtime"?r`
          ${t.trigger_runtime_hours!=null?r`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("runtime_hours",e)}: ${t.trigger_runtime_hours}h</span>`:d}
        `:d}
        ${v==="compound"?r`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("compound_logic",e)}: ${t.compound_logic||t.operator||"AND"}</span>
          ${(t.conditions||[]).map((y,E)=>r`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${E+1}. ${s(y.type||"unknown",e)}: ${y.entity_id?r`<span class="entity-link" @click=${M=>Ot(M,y.entity_id)}>${y.entity_id}</span>`:""}</span>
          `)}
        `:d}
      </div>

      ${a&&a.length>1?r`
        <div class="trigger-entity-list">
          ${a.map(y=>r`
            <span class="trigger-entity-id">${y.friendly_name} (<span class="entity-link" @click=${E=>Ot(E,y.entity_id)}>${y.entity_id}</span>)</span>
          `)}
        </div>
      `:d}

      ${Ai(n,h,c)}
    </div>
  `}function Oi(n,c,t){let e=n.trigger_config,i=n.trigger_current_value;if(!e||i==null)return null;switch(e.type||"threshold"){case"counter":{let a=e.trigger_target_value;if(a==null||a<=0)return null;if(!e.trigger_delta_mode)return{progress:Math.max(0,i),target:a,unit:c,meter:null};let o=ei(n,ii(n,t));return{progress:Math.max(0,i-(o?.value??i)),target:a,unit:c,meter:i}}case"state_change":{let a=e.trigger_target_changes;return a==null||a<=0?null:{progress:Math.max(0,i),target:a,unit:"",meter:null}}case"runtime":{let a=e.trigger_runtime_hours;return a==null||a<=0?null:{progress:Math.max(0,i),target:a,unit:"h",meter:null}}}return null}function ei(n,c){if(n.trigger_baseline_value!=null)return{value:n.trigger_baseline_value,ts:Zt(n)};if(!c.length)return null;let t=Zt(n);if(t==null)return{value:c[0].val,ts:null};let e=c[0],i=Math.abs(c[0].ts-t);for(let a of c){let o=Math.abs(a.ts-t);o<i&&(e=a,i=o)}return{value:e.val,ts:t}}function Zt(n){let c=[...n.history].filter(t=>t.type==="completed"||t.type==="reset").sort((t,e)=>new Date(e.timestamp).getTime()-new Date(t.timestamp).getTime())[0];return c?new Date(c.timestamp).getTime():null}function Di(n,c){let t=Math.min(999,Math.round(n.progress/n.target*100)),e=t>=100?"over":t>=75?"near":"ok";return r`
    <div class="counter-progress">
      <div class="counter-progress-nums">
        <span class="counter-progress-main">${$t(n.progress,"",c)}<span class="counter-progress-target"> / ${$t(n.target,n.unit,c)}</span></span>
        <span class="counter-progress-pct ${e}">${t} %</span>
      </div>
      <div class="counter-progress-bar" role="progressbar" aria-valuenow=${t} aria-valuemin="0" aria-valuemax="100">
        <div class="counter-progress-fill ${e}" style="width:${Math.min(100,t)}%"></div>
      </div>
      <div class="counter-progress-caption">
        ${s("chart_since_service",c)}${n.meter!=null?r` · ${s("current",c)}: ${$t(n.meter,n.unit,c)}`:d}
      </div>
    </div>
  `}function ii(n,c){let t=n.trigger_config;if(!t)return[];let e=t.type||"threshold",i=t.entity_id||"",a=e==="runtime"?[]:c.detailStatsData.get(i)||[],o=c.isCounterEntity(t),p=[];if(a.length>=2)for(let h of a){let g={ts:h.ts,val:h.val};!o&&h.min!=null&&h.max!=null&&(g.min=h.min,g.max=h.max),p.push(g)}else for(let h of n.history)h.trigger_value!=null&&p.push({ts:new Date(h.timestamp).getTime(),val:h.trigger_value});let l=!!i&&!!c.historyFallbackIds?.has(i)&&a.length>=2;return n.trigger_current_value!=null&&!l&&p.push({ts:Date.now(),val:n.trigger_current_value}),p.sort((h,g)=>h.ts-g.ts),p}function Ai(n,c,t){let e=n.trigger_config;if(!e)return d;let i=e.type||"threshold",a=e.entity_id||"",o=ii(n,t),p=null;i==="state_change"&&a&&t.historyFallbackIds?.has(a)&&(p=Ci(o,e,{since:Zt(n),current:n.trigger_current_value??null}),p&&(o=p.points)),i==="runtime"&&e.trigger_runtime_hours&&n.trigger_current_value!=null&&(o=[{ts:Zt(n)??o[0]?.ts??Date.now()-864e5,val:0},{ts:Date.now(),val:Math.max(0,n.trigger_current_value)}]),t.hideOutliers&&(o=Ri(o));let l=o.length<2&&!!a&&t.hasStatsService&&!t.detailStatsData.has(a);if(o.length<2&&!l)return d;let h=!!a&&t.detailStatsData.has(a)&&(t.detailStatsData.get(a)?.length??0)<2,g=Date.now()-t.rangeDays*864e5,v=o.filter($=>$.ts>=g);v.length>=2&&(o=v);let _=null,f=!1;if(i==="counter"&&e.trigger_target_value!=null&&o.length){if(e.trigger_delta_mode){let $=ei(n,o);if($){if($.ts!=null){let A=o.filter(S=>S.ts>=$.ts);A.length>=2&&(o=A)}o=o.map(A=>({...A,val:Math.max(0,A.val-$.value)}))}}_=e.trigger_target_value,f=!0}else i==="state_change"&&e.trigger_target_changes&&p?.mode!=="alarm"?(_=e.trigger_target_changes,f=!0):i==="runtime"&&e.trigger_runtime_hours&&(_=e.trigger_runtime_hours,f=!0);let y=null,E=n.degradation_rate,M=E!=null&&(e.trigger_below!=null&&e.trigger_above==null&&E>0||e.trigger_above!=null&&e.trigger_below==null&&E<0);if(_==null&&E!=null&&!M&&(n.degradation_trend!=="stable"||n.days_until_threshold!=null)&&n.degradation_trend!=="insufficient_data"&&o.length>=2){let $=o[o.length-1];y=[$,{ts:$.ts+30*864e5,val:$.val+E*30}]}let R=n.history.filter($=>["completed","skipped","reset"].includes($.type)).map($=>({ts:new Date($.timestamp).getTime(),type:$.type}));return r`
    <maintenance-trigger-chart
      .points=${l?[]:o}
      .events=${R}
      .unit=${c}
      .lang=${t.lang}
      .thresholdAbove=${i==="threshold"?e.trigger_above??null:null}
      .thresholdBelow=${i==="threshold"?e.trigger_below??null:null}
      .targetValue=${_}
      .forceZero=${f}
      .projection=${y}
      .rangeDays=${t.rangeDays}
      .hideOutliers=${t.hideOutliers}
      .busy=${l}
      @range-change=${$=>t.setRangeDays($.detail.days)}
      @outlier-toggle=${$=>t.setHideOutliers($.detail.hide)}
    ></maintenance-trigger-chart>
    ${l?d:a&&t.historyFallbackIds?.has(a)&&!h?r`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${s(p?.mode==="alarm"?"chart_history_alarm":p?.mode==="count"?"chart_history_count":"chart_history_fallback",t.lang)}
        </div>`:h?r`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${s("chart_no_stats",t.lang)}
        </div>`:d}
  `}var zi=200,Pt=10,Pi=22;function si(n,c,t,e,i){let a=n.history.filter(l=>l.type==="completed"&&(l.cost!=null||l.duration!=null));if(a.length<2)return d;let o=a.some(l=>(l.cost??0)>0),p=a.some(l=>(l.duration??0)>0);return!o&&!p?d:r`
    <div class="cost-duration-card">
      <div class="card-header">
        <h3>${s("cost_duration_chart",c)}</h3>
        <div class="toggle-buttons">
          ${o?r`<button
            class="toggle-btn ${t==="cost"?"active":""}"
            @click=${()=>e("cost")}>
            ${s("cost",c)}
          </button>`:d}
          ${o&&p?r`<button
            class="toggle-btn ${t==="both"?"active":""}"
            @click=${()=>e("both")}>
            ${s("both",c)}
          </button>`:d}
          ${p?r`<button
            class="toggle-btn ${t==="duration"?"active":""}"
            @click=${()=>e("duration")}>
            ${s("duration",c)}
          </button>`:d}
        </div>
      </div>
      ${Ii(n,c,t,i)}
    </div>
  `}function Ii(n,c,t,e){let i=n.history.filter(w=>w.type==="completed"&&(w.cost!=null||w.duration!=null)).map(w=>({ts:new Date(w.timestamp).getTime(),cost:w.cost??0,duration:w.duration??0})).sort((w,z)=>w.ts-z.ts);if(i.length<2)return d;let a=i.some(w=>w.cost>0),o=i.some(w=>w.duration>0);if(!a&&!o)return d;let p=t!=="duration"&&a,l=t!=="cost"&&o,h=p||!l&&a,g=l||!p&&o,v=640,_=zi,f=h?44:12,y=g?44:12,E=v-f-y,M=_-Pi,R=M-Pt,$=i[0].ts,A=i[i.length-1].ts,S=(A-$||864e5)*.05,b=$-S,et=A+S,ft=Gt($,A),K=w=>f+(w-b)/(et-b)*E,ct=At(0,Math.max(...i.map(w=>w.cost))||1,3),Q=At(0,Math.max(...i.map(w=>w.duration))||1,3),ht=w=>Pt+(1-w/(ct.niceMax||1))*R,_t=w=>Pt+(1-w/(Q.niceMax||1))*R,jt=i.length>1?Math.min(...i.slice(1).map((w,z)=>K(w.ts)-K(i[z].ts))):E,G=Math.max(6,Math.min(22,jt*.55)),T=Yt($,A,Math.max(2,Math.min(4,i.length)));return r`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${v} ${_}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_history",c)}">
        ${h?ct.ticks.map(w=>{let z=ht(w);return z<Pt-1||z>M+1?d:V`
            <line x1="${f}" y1="${j(z)}" x2="${v-y}" y2="${j(z)}" stroke="var(--divider-color)" stroke-width="1" opacity="0.55" />
            <text x="${f-6}" y="${j(z+3.5)}" text-anchor="end" fill="var(--primary-color)" font-size="10.5">${ut(w,c)}${e}</text>`}):d}
        ${g?Q.ticks.map(w=>{let z=_t(w);return z<Pt-1||z>M+1?d:V`<text x="${v-y+6}" y="${j(z+3.5)}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="10.5">${ut(w,c)}m</text>`}):d}

        ${h?i.filter(w=>w.cost>0).map(w=>V`
          <rect x="${j(K(w.ts)-G/2)}" y="${j(ht(w.cost))}" width="${j(G)}" height="${j(M-ht(w.cost))}"
            fill="var(--primary-color)" opacity="0.6" rx="2">
            <title>${Mt(w.ts,c,!0)}: ${B(w.cost,e,c)}${w.duration?` \xB7 ${w.duration}m`:""}</title>
          </rect>
        `):d}
        ${g?V`
          <polyline points="${i.map(w=>`${j(K(w.ts))},${j(_t(w.duration))}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${i.map(w=>V`
            <circle cx="${j(K(w.ts))}" cy="${j(_t(w.duration))}" r="3.5" fill="var(--accent-color, #ff9800)">
              <title>${Mt(w.ts,c,!0)}: ${w.duration}m${w.cost?` \xB7 ${B(w.cost,e,c)}`:""}</title>
            </circle>
          `)}
        `:d}

        <line x1="${f}" y1="${M}" x2="${v-y}" y2="${M}" stroke="var(--divider-color)" stroke-width="1" />
        ${T.map((w,z)=>{let ee=z===0?"start":z===T.length-1?"end":"middle";return V`<text x="${j(K(w))}" y="${_-6}" text-anchor="${ee}" fill="var(--secondary-text-color)" font-size="10">${Mt(w,c,ft)}</text>`})}
      </svg>
    </div>
    <div class="chart-legend">
      ${h?r`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${s("cost",c)}</span>`:d}
      ${g?r`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${s("duration",c)}</span>`:d}
    </div>
  `}var kt=class extends D{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await Ft(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?d:this._url?r`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:r`<div class="ph"></div>`}};kt.styles=O`
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
  `,u([k({attribute:!1})],kt.prototype,"hass",2),u([k()],kt.prototype,"docId",2),u([m()],kt.prototype,"_url",2),u([m()],kt.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",kt);var Li=["completed","skipped","missed","reset","triggered","trigger_replaced","trigger_removed"];function ai(n,c){let t=c.lang;return r`
    <div class="history-filters-new">
      <div class="filter-chips">
        ${Li.map(e=>{let i=n.history.filter(a=>a.type===e).length;return i===0?d:r`
            <span class="filter-chip ${c.filter===e?"active":""}"
              @click=${()=>c.setFilter(c.filter===e?null:e)}>
              ${s(e,t)} (${i})
            </span>
          `})}
        ${c.filter?r`<span class="filter-chip clear" @click=${()=>c.setFilter(null)}>${s("show_all",t)}</span>`:d}
      </div>
      <div class="filter-controls">
        <input type="text" class="search-input" placeholder="${s("search_notes",t)}..." .value=${c.search} @input=${e=>c.setSearch(e.target.value)} />
      </div>
    </div>
  `}function ri(n,c){let t=c.lang,e=c.filter?n.history.filter(i=>i.type===c.filter):n.history;if(c.search){let i=c.search.toLowerCase();e=e.filter(a=>a.notes?.toLowerCase().includes(i))}return e.length===0?r`<p class="empty">${s("no_history",t)}</p>`:r`
    <div class="history-timeline">
      ${[...e].reverse().map(i=>Hi(i,c))}
    </div>
  `}function Hi(n,c){let t=c.lang,e=["completed","reset","skipped"].includes(n.type);return r`
    <div class="history-entry">
      <div class="history-icon ${n.type}">
        <ha-icon .icon=${Ht[n.type]||"mdi:circle"}></ha-icon>
      </div>
      <div class="history-content">
        <div class="history-row">
          <strong>${s(n.type,t)}</strong>
          ${n.phase_id?r`<span class="history-phase-badge">${c.phaseNames?.[n.phase_id]||n.phase_id}</span>`:d}
          ${n.auto?r`<span class="history-auto-badge">${s("history_auto",t)}</span>`:d}
          ${e?r`<button class="history-edit-btn"
                     title=${s("history_edit_button",t)||"Edit entry"}
                     @click=${()=>c.openEdit(n)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:d}
        </div>
        <div class="history-date">${Et(n.timestamp,t)}</div>
        ${n.notes?r`<div>${n.notes}</div>`:d}
        ${n.photo_doc_id?r`<maintenance-history-photo .hass=${c.hass} .docId=${n.photo_doc_id}></maintenance-history-photo>`:d}
        <div class="history-details">
          ${n.cost!=null?r`<span>${s("cost",t)}: ${B(n.cost,c.currencySymbol,t)}</span>`:d}
          ${n.duration!=null?r`<span>${s("duration",t)}: ${n.duration} min</span>`:d}
          ${n.trigger_value!=null?r`<span>${s("trigger_val",t)}: ${n.trigger_value}</span>`:d}
          ${n.reading_value!=null?r`<span>${s("reading_label",t)}: ${n.reading_value}${c.readingUnit?` ${c.readingUnit}`:""}${(()=>{let i=c.readingDelta?.(n);return i==null?"":` (${i>=0?"+":""}${U(i,t,{maximumFractionDigits:3})})`})()}</span>`:d}
        </div>
      </div>
    </div>
  `}function he(n,c){if(!n.responsible_user_id)return d;let t=c(n.responsible_user_id);return t?r`
    <span class="user-badge">
      <ha-icon icon="mdi:account"></ha-icon>
      ${t}
    </span>
  `:d}function Ni(n,c){let t=c.lang,e=c.isOperator,i=n.archived?"archived":n.is_done?"done":n.status==="due_soon"?"warning":n.status||"ok",a=n.archived?s("archived",t):n.is_done?s("completed",t):s(n.status||"ok",t);return r`
    <div class="task-header">
      <div class="task-header-title">
        <span class="task-name-breadcrumb" @click=${()=>c.showTaskView()}>${n.name}</span>
        <span class="breadcrumb-separator">·</span>
        <span class="object-name-breadcrumb" @click=${()=>c.showObject()}>${c.objectName}</span>
        <span class="status-chip ${i}">${a}</span>
        ${n.due_override?r`<span class="postponed-badge" title="${s("postponed_to",t)}">
          <ha-icon icon="mdi:calendar-arrow-right"></ha-icon>${q(n.due_override,t)}
        </span>`:d}
        ${he(n,c.getUserName)}
        ${n.nfc_tag_id?r`<span class="nfc-badge" title="${s("nfc_tag_id",t)}: ${n.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>`:e?d:r`<span class="nfc-badge unlinked" title="${s("nfc_link_hint",t)}"
              @click=${()=>c.openEdit(n)}>
              <ha-icon icon="mdi:nfc-variant"></ha-icon>
            </span>`}
      </div>
      <div class="task-header-actions">
        <ha-button appearance="accent" variant="success" @click=${()=>c.openComplete(n)}>${s("complete",t)}</ha-button>
        ${n.allow_skip!==!1?r`<ha-button appearance="outlined" variant="warning" .disabled=${c.actionLoading} @click=${()=>c.promptSkip()}>${s("skip",t)}</ha-button>`:d}
        <div class="more-menu-wrapper">
          <ha-icon-button .disabled=${c.actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${()=>c.toggleMoreMenu()}></ha-icon-button>
          ${c.moreMenuOpen?r`
            <div class="popup-menu" @click=${o=>o.stopPropagation()}>
              ${e?d:r`
                <div class="popup-menu-item" @click=${()=>{c.closeMoreMenu(),c.openEdit(n)}}>${s("edit",t)}</div>
              `}
              <div class="popup-menu-item" @click=${()=>{c.closeMoreMenu(),c.openQr(n.name)}}>${s("qr_code",t)}</div>
              <div class="popup-menu-item" @click=${()=>{c.closeMoreMenu(),c.printWorksheet()}}>${s("worksheet",t)}</div>
              ${e?d:r`
                <div class="popup-menu-item" @click=${()=>c.duplicateTask()}>${s("duplicate",t)}</div>
                <div class="popup-menu-item" @click=${()=>{c.closeMoreMenu(),c.promptReset()}}>${s("reset",t)}</div>
                <div class="popup-menu-item" @click=${()=>{c.closeMoreMenu(),c.promptPostpone()}}>${s("postpone",t)}…</div>
                <div class="popup-menu-item" @click=${()=>{c.closeMoreMenu(),c.snoozeTask()}}>${s("snooze",t)}</div>
                <div class="popup-menu-item" @click=${()=>{c.closeMoreMenu(),c.toggleArchive(!!n.archived)}}>${n.archived?s("unarchive",t):s("archive",t)}</div>
                <div class="popup-menu-divider"></div>
                <div class="popup-menu-item danger" @click=${()=>{c.closeMoreMenu(),c.deleteTask()}}>${s("delete",t)}</div>
              `}
            </div>
          `:d}
        </div>
      </div>
    </div>
  `}function Bi(n){let c=n.lang;return r`
    <div class="tab-bar">
      <div class="tab ${n.activeTab==="overview"?"active":""}" @click=${()=>n.setActiveTab("overview")}>
        ${s("overview",c)}
      </div>
      <div class="tab ${n.activeTab==="history"?"active":""}" @click=${()=>n.setActiveTab("history")}>
        ${s("history",c)}
      </div>
    </div>
  `}function oi(n,c,t,e){let i=e.collapsedSections.has(n);return r`
    <div class="collapsible ${i?"collapsed":""}">
      <button class="collapsible-head" @click=${()=>e.toggleSection(n)}
        aria-expanded=${i?"false":"true"}>
        <ha-icon icon="${i?"mdi:chevron-right":"mdi:chevron-down"}"></ha-icon>
        <span>${s(c,e.lang)}</span>
      </button>
      ${i?d:r`<div class="collapsible-body">${t}</div>`}
    </div>
  `}function Fi(n,c){if(!je(n))return d;let t=c.lang,e=n.phase_sequence,i=Te(n.phase_cursor,e.length),a=new Map;for(let o=n.history.length-1;o>=0;o--){let p=n.history[o];p.phase_id&&p.type==="completed"&&!a.has(p.phase_id)&&a.set(p.phase_id,p.timestamp)}return r`
    <div class="phases-card">
      <div class="phases-card-header">
        <ha-icon icon="mdi:rotate-right"></ha-icon>
        <span>${s("phase_sequence_label",t)}</span>
      </div>
      <div class="phases-strip">
        ${e.map((o,p)=>{let l=n.phases?.[o]?.name||o,h=a.get(o);return r`
            <div class="phase-step ${p===i?"current":""}"
              title=${p===i?s("phase_current",t):s("phase_set",t)}
              @click=${()=>{p!==i&&c.setPhaseCursor(p)}}>
              <span class="phase-step-name">${p+1}. ${l}</span>
              ${h?r`<span class="phase-step-last">${q(h,t)}</span>`:d}
            </div>
          `})}
      </div>
    </div>
  `}function Vi(n,c){if(!c.features.checklists)return d;let t=Wt(n)?.checklist??(n.checklist||[]);if(t.length===0)return d;let e=c.lang,i=n.checklist_progress||{},a=t.filter(o=>i[o]).length;return r`
    <div class="checklist-preview-card">
      <div class="checklist-preview-header">
        <ha-icon icon="mdi:format-list-checks"></ha-icon>
        <span>${s("checklist",e)} (${a}/${t.length})</span>
      </div>
      <ol class="checklist-preview-list">
        ${t.map(o=>r`
          <li class=${i[o]?"checked":""}>
            <label>
              <input
                type="checkbox"
                .checked=${!!i[o]}
                @change=${p=>c.setChecklistItem(o,p.target.checked)}
              />
              <span>${o}</span>
            </label>
          </li>
        `)}
      </ol>
    </div>
  `}function Ui(n,c){let t=X(n.documentation_url)?n.documentation_url:null,e=X(c.objectDocUrl)?c.objectDocUrl:null,i=e?null:(c.objectManualDocs||[])[0];if(!n.notes&&!t&&!e&&!i)return d;let a=c.lang;return r`
    <div class="task-meta-card">
      ${n.notes?r`
        <div class="task-meta-row">
          <ha-icon icon="mdi:note-text-outline"></ha-icon>
          <span class="task-meta-notes">${qt(n.notes)}</span>
        </div>
      `:d}
      ${t?r`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:open-in-new"></ha-icon>
          <a href="${t}" target="_blank" rel="noopener noreferrer">${s("documentation_label",a)}</a>
        </div>
      `:d}
      ${e?r`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="${e}" target="_blank" rel="noopener noreferrer">${s("documentation_url_label",a)} (${c.objectName})</a>
        </div>
      `:i?r`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="#" title=${i.title}
            @click=${o=>{o.preventDefault(),c.openManualDoc(i)}}
            >${s("documentation_url_label",a)} (${c.objectName})</a>
        </div>
      `:d}
    </div>
  `}function qi(n,c){let t=c.lang,e=n.times_performed>0?n.total_cost/n.times_performed:0,i=n.days_until_due!==null&&n.days_until_due!==void 0?n.days_until_due<0?"overdue":n.days_until_due<=n.warning_days?"warning":"":"";return r`
    <div class="kpi-bar">
      <div class="kpi-card">
        <div class="kpi-label">${s("next_due",t)}</div>
        <div class="kpi-value">${n.next_due?q(n.next_due,t):"\u2014"}</div>
        ${c.features.schedule_time&&n.schedule_time?r`<div class="kpi-subtext">${s("at_time",t)} ${n.schedule_time}</div>`:d}
      </div>
      <div class="kpi-card ${i}">
        <div class="kpi-label">${s("days_until_due",t)}</div>
        <div class="kpi-value-large">${n.days_until_due!==null&&n.days_until_due!==void 0?n.days_until_due:"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("interval",t)}</div>
        <div class="kpi-value">${Rt(n,t)}</div>
        ${c.features.adaptive&&n.suggested_interval&&n.suggested_interval!==n.interval_days?r`
          <div class="kpi-subtext">${s("recommended",t)}: ${n.suggested_interval}${n.interval_analysis?.confidence_interval_low!=null?` (${n.interval_analysis.confidence_interval_low}\u2013${n.interval_analysis.confidence_interval_high})`:""}</div>
        `:d}
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("warning",t)}</div>
        <div class="kpi-value">${n.warning_days} ${s("days",t)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("last_performed",t)}</div>
        <div class="kpi-value">${n.last_performed?q(n.last_performed,t):"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("avg_cost",t)}</div>
        <div class="kpi-value">${B(e,c.currencySymbol,t,0)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("avg_duration",t)}</div>
        <div class="kpi-value">${n.average_duration?U(n.average_duration,t,0):"\u2014"} min</div>
      </div>
    </div>
  `}function Wi(n,c){let t=c.lang;if(!c.features.adaptive||!n.suggested_interval||n.suggested_interval===n.interval_days)return d;if(c.suggestionDismissed)return d;let e=n.suggested_interval;return r`
    <div class="recommendation-card">
      <h4>${s("suggested_interval",t)}</h4>
      ${ze(n.interval_days,e,n.interval_confidence||"medium",t)}
      <div class="recommendation-actions">
        <ha-button appearance="filled"
          @click=${()=>c.applySuggestion(e)}>
          ${s("apply_suggestion",t)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${()=>c.reanalyze()}>
          ${s("reanalyze",t)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${()=>c.dismissSuggestion()}>
          ${s("dismiss_suggestion",t)}
        </ha-button>
      </div>
    </div>
  `}function Gi(n,c){let t=c.lang,e=n.history.slice(-3).reverse();if(e.length===0)return d;let i=a=>{switch(a){case"completed":return"\u2713";case"triggered":return"\u2297";case"skipped":return"\u21B7";case"reset":return"\u21BA";default:return"\xB7"}};return r`
    <div class="recent-activities">
      <h3>${s("recent_activities",t)}</h3>
      ${e.map(a=>r`
        <div class="activity-item">
          <span class="activity-icon">${i(a.type)}</span>
          <span class="activity-date">${Et(a.timestamp,t)}</span>
          <span class="activity-note">${a.notes||"\u2014"}</span>
          ${a.cost?r`<span class="activity-badge">${B(a.cost,c.currencySymbol,t,0)}</span>`:d}
          ${a.duration?r`<span class="activity-badge">${a.duration}min</span>`:d}
        </div>
      `)}
      <div class="activity-show-all">
        <ha-button appearance="plain" @click=${()=>c.setActiveTab("history")}>${s("show_all",t)} →</ha-button>
      </div>
    </div>
  `}function Yi(n,c){let t=c.lang,e=c.features.adaptive&&n.suggested_interval&&n.suggested_interval!==n.interval_days,i=c.features.seasonal&&n.seasonal_factor&&n.seasonal_factor!==1,a=e||i,o=c.features.adaptive&&n.interval_analysis?.weibull_beta!=null&&n.interval_analysis?.weibull_eta!=null,p=c.features.seasonal&&(n.seasonal_factors?.length===12||n.interval_analysis?.seasonal_factors?.length===12);return r`
    <div class="tab-content overview-tab">
      ${n.battery_fleet_task?r`<maintenance-battery-fleet-section .hass=${c.hass}></maintenance-battery-fleet-section>`:d}
      ${qi(n,c)}
      ${Ui(n,c)}
      ${n.battery_fleet_task?d:r`
            ${Xe(n,c.lang)}
            ${ti(n,c.sparkline)}
            ${Ae(n,t,c.features)}
          `}
      <div class="two-column-layout ${a?"":"single-column"}">
        ${a?r`
          <div class="left-column">
            ${Wi(n,c)}
            ${Pe(n,t,c.features)}
          </div>
        `:d}
        <div class="right-column">
          ${si(n,t,c.costDurationToggle,l=>c.setCostDurationToggle(l),c.currencySymbol)}
        </div>
      </div>
      ${o?oi("weibull","weibull_reliability_curve",De(n,t),c):d}
      ${p?oi("seasonal","seasonal_chart_title",r`
            ${Ie(n,t)}
            <div class="seasonal-actions">
              <ha-button appearance="plain" @click=${()=>c.openSeasonalOverrides(n)}>
                ${s("edit_seasonal_overrides",t)}
              </ha-button>
            </div>
          `,c):d}
      ${Fi(n,c)}
      ${Vi(n,c)}
      ${Gi(n,c)}
    </div>
  `}function Ki(n,c){return r`
    <div class="tab-content history-tab">
      <div class="history-add-past">
        <ha-button appearance="plain" class="history-add-past-btn" @click=${()=>c.openComplete(n)}>
          <ha-icon icon="mdi:calendar-plus"></ha-icon>
          ${s("history_add_past",c.lang)}
        </ha-button>
      </div>
      ${ai(n,c.history)}
      ${ri(n,c.history)}
    </div>
  `}function Qi(n,c){switch(c.activeTab){case"overview":return Yi(n,c);case"history":return Ki(n,c);default:return d}}function ni(n,c){return r`
    <div class="detail-section">
      ${Ni(n,c)}
      ${Bi(c)}
      ${Qi(n,c)}
      <maintenance-task-documents
        .hass=${c.hass}
        .entryId=${c.entryId}
        .taskId=${c.taskId}
        .canWrite=${!c.isOperator}
      ></maintenance-task-documents>
    </div>
  `}var It=class extends D{createRenderRoot(){return this}render(){return!this.task||!this.ctx?d:r`${ni(this.task,this.ctx)}`}};u([k({attribute:!1})],It.prototype,"task",2),u([k({attribute:!1})],It.prototype,"ctx",2);customElements.get("maintenance-task-detail-view")||customElements.define("maintenance-task-detail-view",It);function li(n){if(n.total<=0)return{start:0,end:0,padTop:0,padBottom:0};let c=n.overscan??12,t=Math.max(1,n.step??6),e=Math.max(1,n.rowHeight),i=Math.floor((n.scrollTop-n.listTop)/e),a=Math.ceil(n.viewportHeight/e)+1,o=Math.max(0,i-c);o=Math.floor(o/t)*t;let p=Math.min(n.total,Math.max(i,0)+a+c);return p=Math.min(n.total,Math.ceil(p/t)*t),o>=p&&(o=Math.min(o,Math.max(0,n.total-1)),p=Math.min(n.total,o+Math.max(a,1))),{start:o,end:p,padTop:o*e,padBottom:(n.total-p)*e}}var te={mode:"top",marginTop:0,lastScrollTop:0};function ci(n,c){return n==="top"?8:c.viewH-c.paneH-8}function di(n){let c=n.scrollTop+8-n.layoutTop,t=Math.max(0,n.listH-n.paneH);return{mode:"top",marginTop:c>t?Math.max(0,c):0,lastScrollTop:n.scrollTop}}function pi(n,c){let t=c.scrollTop,e=c.scrollTop>n.lastScrollTop?"down":c.scrollTop<n.lastScrollTop?"up":"none",i=Math.max(0,c.listH-c.paneH),a=c.paneH+16<=c.viewH||c.listH<=c.paneH,{mode:o,marginTop:p}=n;if(a&&(o="top"),o==="top"&&p>0&&e==="up")p=Math.max(0,Math.min(p,c.scrollTop+8-c.layoutTop)),p<=i&&(p=0);else if(!a&&e==="down"&&o==="top"){let l=c.renderedTop-c.layoutTop;l<=i&&(o="bottom",p=Math.max(0,l))}else!a&&e==="up"&&o==="bottom"&&(p=Math.min(Math.max(0,c.renderedTop-c.layoutTop),i),c.scrollTop+8<=c.layoutTop+p&&(o="top",p=0));return{mode:o,marginTop:p,lastScrollTop:t}}var ue=["due_date","object","type","task_name","area","assigned_user","group"],hi=["none","area","group","user","object"],Ji=["today","dashboard","calendar","settings"],Zi=["overdue","due_soon","triggered","ok"],x=class extends D{constructor(){super(...arguments);this.narrow=!1;this.tight=!1;this.split=!1;this._tightObserver=null;this.panel={};this._objects=[];this._stats=null;this._view="overview";this._allParts=null;this._selectedEntryId=null;this._selectedTaskId=null;this._filterStatus="";this._filterUser=null;this._filterLabel=null;this._filterPriority="";this._savedViews=[];this._activeViewId="";this._unsub=null;this._chartRangeDays=(()=>{try{let t=parseInt(it(P.chartRange)||"",10);return[7,30,90,365].includes(t)?t:30}catch{return 30}})();this._hideOutliers=(()=>{try{return it(P.chartHideOutliers)==="1"}catch{return!1}})();this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._adminPanelUserIds=[];this._operatorWriteEnabled=!1;this._defaultWarningDays=7;this._rowActionStyle="buttons_compact";this._rowActionNotice=!1;this._actionLoading=!1;this._moreMenuOpen=!1;this._objMenuOpen=!1;this._toastMessage="";this._toastUndo=null;this._toastActionLabel="";this._filtersOpen=!1;this._newMenuOpen=!1;this._gsSetupsCount=0;this._gsAdoptCount=0;this._gsLoaded=!1;this._batteryFleetSetupAvailable=!1;this._staleBundle=!1;this._staleChecked=!1;this._toastTimer=null;this._dismissedSuggestions=new Set;this._overviewTab=(()=>{try{let t=it(P.overviewTab);return t==="today"||t==="calendar"?t:"dashboard"}catch{return"dashboard"}})();this._activeTab="overview";this._costDurationToggle="both";this._historySearch="";this._sortMode="due_date";this._objectSortMode="alphabetical";this._groupByMode="none";this._objectViewMode="cards";this._objectsTableColumns=we;this._showArchived=!1;this._bulkMode=!1;this._bulkSelected=new Set;this._virtStart=0;this._virtEnd=0;this._virtRowHeight=53;this._virtTotalRows=0;this._virtScrollAttached=!1;this._virtRaf=0;this._stickyState=te;this._stickySelectPending=!1;this._stickyRaf=0;this._stickyAttached=!1;this._stickyObserver=null;this._collapsedGroups=new Set;this._collapsedSections=(()=>{try{return new Set(JSON.parse(it(P.collapsedSections)||"[]"))}catch{return new Set}})();this._paletteOpen=!1;this._paletteQuery="";this._paletteActive=0;this._templateGalleryOpen=!1;this._templates=[];this._templateCategories={};this._templateBusy=!1;this._statsService=null;this._userService=null;this._dataLoaded=!1;this._lastConnection=null;this._popstateHandler=t=>this._onPopState(t);this._locationChangedHandler=()=>this._onLocationChanged();this._lazyUi=null;this._onStickyScroll=()=>{this._stickyRaf||(this._stickyRaf=requestAnimationFrame(()=>{this._stickyRaf=0,this._updateStickyPane()}))};this._onVirtualScroll=()=>{this._virtRaf||(this._virtRaf=requestAnimationFrame(()=>{this._virtRaf=0,this._updateVirtualWindow()}))};this._deepLinkHandled=!1;this._initialLoadDone=!1;this._kpiRefreshInFlight=!1;this._kpiRefreshPending=!1;this._paletteKeydown=t=>{if(t.key==="/"&&!t.ctrlKey&&!t.metaKey&&!t.altKey&&!this._paletteOpen){let i=t.composedPath()[0];if(i instanceof HTMLElement&&(i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.tagName==="SELECT"||i.isContentEditable))return;t.preventDefault(),this._openPalette();return}if(!this._paletteOpen)return;let e=this._paletteResults;if(t.key==="Escape")t.preventDefault(),this._closePalette();else if(t.key==="ArrowDown")t.preventDefault(),this._paletteActive=Math.min(this._paletteActive+1,e.length-1);else if(t.key==="ArrowUp")t.preventDefault(),this._paletteActive=Math.max(this._paletteActive-1,0);else if(t.key==="Enter"){t.preventDefault();let i=e[this._paletteActive];i&&this._selectPaletteResult(i)}};this._onDialogEvent=async()=>{try{await this._loadData()}catch{}};this._onCalendarLlCustom=t=>{let e=t.detail;e?.type==="maintenance-supporter:open-task"&&e.entry_id&&e.task_id&&(t.stopPropagation(),this._showTask(e.entry_id,e.task_id))};this._fullHistory=null;this._onHistoryEntrySaved=async()=>{await this._loadData()}}get _currencySymbol(){return this._budget?.currency_symbol||Nt}get _lang(){return H(this.hass)}get _isOperator(){let t=this.hass?.user;return t?t.is_admin?!1:!(this._operatorWriteEnabled&&this._adminPanelUserIds.includes(t.id)):!0}_ensureLazyUi(){return this._lazyUi||(this._lazyUi=Promise.all([import("/maintenance_supporter_panelfiles/panel-chunks/object-dialog-C3IWZAA2.js"),import("/maintenance_supporter_panelfiles/panel-chunks/task-dialog-UUAB6OPD.js"),import("/maintenance_supporter_panelfiles/panel-chunks/complete-dialog-RFYLAHCN.js"),import("/maintenance_supporter_panelfiles/panel-chunks/qr-dialog-W5BRKWLF.js"),import("/maintenance_supporter_panelfiles/panel-chunks/adopt-problem-sensors-dialog-OT2LTUC4.js"),import("/maintenance_supporter_panelfiles/panel-chunks/suggested-setups-dialog-3XJSUYYN.js"),import("/maintenance_supporter_panelfiles/panel-chunks/settings-view-RUUW5JZO.js")]).then(()=>this.updateComplete)),this._lazyUi}async _ui(t){return await this._ensureLazyUi(),this.shadowRoot?.querySelector(t)??null}connectedCallback(){super.connectedCallback();let t=window.requestIdleCallback,e=()=>this._ensureLazyUi();t?t(e,{timeout:3e3}):window.setTimeout(e,1500),window.addEventListener("popstate",this._popstateHandler),window.addEventListener("location-changed",this._locationChangedHandler),window.addEventListener("keydown",this._paletteKeydown),typeof ResizeObserver<"u"&&(this._tightObserver=new ResizeObserver(i=>{let a=i[0]?.contentRect.width??0;a>0&&(this.tight=a<1e3),a>0&&(this.split=a>=1500)}),this._tightObserver.observe(this)),window.addEventListener("resize",this._onVirtualScroll,{passive:!0});try{let i=it(P.taskSort);i&&ue.includes(i)&&(this._sortMode=i);let a=it(P.objectSort);a&&["alphabetical","due_soonest","task_count"].includes(a)&&(this._objectSortMode=a);let o=it(P.groupBy);o&&hi.includes(o)&&(this._groupByMode=o);let p=it(P.objectView);(p==="cards"||p==="table")&&(this._objectViewMode=p)}catch{}if(this._objects.length===0){let i=Be();i&&(this._objects=i.objects,i.stats&&(this._stats=i.stats))}}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("popstate",this._popstateHandler),window.removeEventListener("location-changed",this._locationChangedHandler),window.removeEventListener("keydown",this._paletteKeydown),this._tightObserver?.disconnect(),this._tightObserver=null,window.removeEventListener("resize",this._onVirtualScroll),this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onVirtualScroll),this._virtScrollAttached=!1,this._virtRaf&&cancelAnimationFrame(this._virtRaf),this._detachStickyPane(),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._initialLoadDone=!1,this._lastConnection=null,this._deepLinkHandled=!1,this._statsService?.clearCache(),this._statsService=null}willUpdate(t){super.willUpdate(t),t.has("_groupByMode")&&this._collapsedGroups.size>0&&(this._collapsedGroups=new Set)}updated(t){if(super.updated(t),St(this,t),t.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},""),this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new Kt(this.hass),this._fetchMiniStatsForOverview()),this._userService?this._userService.updateHass(this.hass):(this._userService=new Me(this.hass),this._userService.getUsers())}let e=this.shadowRoot?.querySelector(".content");e&&!this._virtScrollAttached&&(e.addEventListener("scroll",this._onVirtualScroll,{passive:!0}),this._virtScrollAttached=!0),this._updateVirtualWindow(),this._syncStickyPane(e)}_syncStickyPane(t){let e=this.shadowRoot?.querySelector(".split-pane");if(!e||!t){this._stickyAttached&&this._detachStickyPane();return}this._stickyAttached||(t.addEventListener("scroll",this._onStickyScroll,{passive:!0}),window.addEventListener("resize",this._onStickyScroll),typeof ResizeObserver<"u"&&(this._stickyObserver=new ResizeObserver(this._onStickyScroll)),this._stickyAttached=!0),this._stickyObserver?.observe(e),this._updateStickyPane()}_detachStickyPane(){this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onStickyScroll),window.removeEventListener("resize",this._onStickyScroll),this._stickyObserver?.disconnect(),this._stickyObserver=null,this._stickyRaf&&cancelAnimationFrame(this._stickyRaf),this._stickyRaf=0,this._stickyAttached=!1,this._stickyState=te,this._stickySelectPending=!1}_updateStickyPane(){let t=this.shadowRoot,e=t?.querySelector(".content"),i=t?.querySelector(".split-pane"),a=t?.querySelector(".split-layout"),o=t?.querySelector(".split-list");if(!e||!i||!a||!o)return;let p=e.getBoundingClientRect().top-e.scrollTop,l={scrollTop:e.scrollTop,viewH:e.clientHeight,paneH:i.offsetHeight,listH:o.offsetHeight,layoutTop:a.getBoundingClientRect().top-p,renderedTop:i.getBoundingClientRect().top-p};this._stickySelectPending&&l.scrollTop===this._stickyState.lastScrollTop?this._stickyState=di(l):(this._stickySelectPending=!1,this._stickyState=pi(this._stickyState,l));let h=this._stickyState;i.style.top=`${ci(h.mode,l)}px`,i.style.marginTop=h.marginTop>0?`${h.marginTop}px`:""}_resetStickyPane(){let t=this.shadowRoot?.querySelector(".content");this._stickyState={...te,lastScrollTop:t?.scrollTop??0},this._stickySelectPending=!0}_updateVirtualWindow(){let t=this.shadowRoot?.querySelector(".content"),e=this.shadowRoot?.querySelector(".task-table.virtual");if(!t||!e)return;let i=e.querySelector(".task-row:not(.virt-sizer)");i&&i.offsetHeight>20&&(this._virtRowHeight=i.offsetHeight);let a=e.getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop,o=li({scrollTop:t.scrollTop,viewportHeight:t.clientHeight,listTop:a,rowHeight:this._virtRowHeight,total:this._virtTotalRows});(o.start!==this._virtStart||o.end!==this._virtEnd)&&(this._virtStart=o.start,this._virtEnd=o.end)}async _loadData(){let[t,e,i,a,o,p]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"}).catch(()=>null)]);if(p&&(this._savedViews=p.views||[]),t&&(this._objects=zt(t.objects),oe(this._objects,e??this._stats??null),this._maybeLoadGettingStarted()),this._view==="task"&&this._selectedEntryId&&this._selectedTaskId&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/status"}).then(l=>{this._batteryFleetSetupAvailable=!!l.available&&!l.configured}).catch(()=>{this._batteryFleetSetupAvailable=!1}),this._staleChecked||(this._staleChecked=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/version"}).then(l=>{this._staleBundle=ge(l?.version)}).catch(()=>{})),e&&(this._stats=e),i&&(this._budget=i),a&&(this._groups=a.groups||{}),o){let l=o;this._features=l.features,this._adminPanelUserIds=l.admin_panel_user_ids||[],this._operatorWriteEnabled=l.operator_write_enabled??!1;let h=l.general?.default_warning_days;typeof h=="number"&&h>=0&&h<=365&&(this._defaultWarningDays=h);let g=l.general?.row_action_style;this._rowActionStyle=g==="icons"||g==="buttons"?g:"buttons_compact",this._rowActionNotice=l.general?.row_action_notice_pending===!0,this._objectsTableColumns=ke(l.objects_table_columns)}this._fetchMiniStatsForOverview(),this._initialLoadDone=!0,this._handleDeepLink()}_onLocationChanged(){if(!this._initialLoadDone||!window.location.search)return;let t=`/${typeof this.panel?.url_path=="string"?this.panel.url_path:"maintenance-supporter"}`,e=window.location.pathname;e!==t&&!e.startsWith(`${t}/`)||(this._deepLinkHandled=!1,this._handleDeepLink())}_handleDeepLink(){if(this._deepLinkHandled)return;let t=new URLSearchParams(window.location.search),e=t.get("ms_action"),i=()=>{let y=window.location.pathname+window.location.hash;history.replaceState(history.state,"",y)};if(e==="add_object"){this._deepLinkHandled=!0,i(),this._ui("maintenance-object-dialog").then(y=>y?.openCreate());return}if(e==="open_vacation"||e==="open_budget"||e==="open_groups"||e==="open_settings"){this._deepLinkHandled=!0,i(),this._overviewTab="settings",this._ensureLazyUi().then(()=>requestAnimationFrame(()=>{let y=this.shadowRoot?.querySelector("maintenance-settings-view"),E=e.replace("open_","");y?.scrollToSection?.(E)}));return}let a=t.get("tab"),o=t.get("view"),p=t.get("sort"),l=t.get("status");if(a!==null||o!==null||p!==null||l!==null){if(i(),this._view!=="overview"&&this._showOverview(),Ji.includes(a??"")&&this._setOverviewTab(a),o!==null){let y=o.trim().toLowerCase(),E=this._savedViews.find(M=>M.id===o)??this._savedViews.find(M=>M.name.trim().toLowerCase()===y);E&&(this._overviewTab!=="dashboard"&&this._setOverviewTab("dashboard"),this._applyView(E.id))}ue.includes(p??"")&&(this._sortMode=p,this._activeViewId="",Y(P.taskSort,this._sortMode)),Zi.includes(l??"")&&(this._overviewTab!=="dashboard"&&this._setOverviewTab("dashboard"),this._filterByStatus(l))}let h=t.get("entry_id");if(!h)return;this._deepLinkHandled=!0;let g=t.get("task_id"),v=t.get("action"),_=window.location.pathname+window.location.hash;history.replaceState(history.state,"",_);let f=this._getObject(h);if(!f){this._showOverview();return}if(g){let y=f.tasks.find(E=>E.id===g);if(!y){this._showObject(h);return}this._showTask(h,g),v==="complete"?requestAnimationFrame(()=>{this._openCompleteDialog(h,g,y.name,this._features.checklists?y.checklist:void 0,this._features.adaptive&&!!y.adaptive_config?.enabled)}):v==="quick_complete"&&requestAnimationFrame(()=>{this._handleQuickComplete(h,g,y)})}else this._showObject(h)}_isCounterEntity(t){if(!t)return!1;let e=t.type||"threshold";return e==="counter"||e==="state_change"}async _fetchDetailStats(t,e){if(!this._statsService)return;let i=await this._statsService.getDetailStats(t,e,this._chartRangeDays),a=new Map(this._detailStatsData);a.set(t,i),this._detailStatsData=a}_setChartRange(t){if(t===this._chartRangeDays)return;this._chartRangeDays=t;try{Y(P.chartRange,String(t))}catch{}let e=this._selectedEntryId&&this._selectedTaskId?this._getTask(this._selectedEntryId,this._selectedTaskId):null,i=e?.trigger_config?.entity_id;if(i){let a=new Map(this._detailStatsData);a.delete(i),this._detailStatsData=a,this._fetchDetailStats(i,this._isCounterEntity(e.trigger_config))}}_setHideOutliers(t){if(t!==this._hideOutliers){this._hideOutliers=t;try{Y(P.chartHideOutliers,t?"1":"0")}catch{}}}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let t=[];for(let i of this._objects)for(let a of i.tasks){let o=a.trigger_config?.entity_id;o&&t.push({entityId:o,isCounter:this._isCounterEntity(a.trigger_config)})}if(t.length===0)return;let e=await this._statsService.getBatchMiniStats(t);this._miniStatsData=new Map([...this._miniStatsData,...e])}async _subscribe(){try{let t=await this.hass.connection.subscribeMessage(e=>{let i=e,a=Ne(this._objects,i);a!==null&&(this._objects=a,e.objects&&oe(a,this._stats??null),this._refreshKpis(),this._view==="task"&&this._selectedEntryId&&this._selectedTaskId&&(i.objects||(i.delta||[]).some(o=>o.entry_id===this._selectedEntryId))&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId))},{type:"maintenance_supporter/subscribe",deltas:!0,compact:!0});if(!this.isConnected){t();return}this._unsub=t}catch{}}async _refreshKpis(){if(this._kpiRefreshInFlight){this._kpiRefreshPending=!0;return}this._kpiRefreshInFlight=!0;try{do{this._kpiRefreshPending=!1;let[t,e]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null)]);if(!this.isConnected)return;t&&(this._stats=t),e&&(this._budget=e)}while(this._kpiRefreshPending)}finally{this._kpiRefreshInFlight=!1}}get _taskRows(){let t=[];for(let v of this._objects)for(let _ of v.tasks){if(!this._showArchived&&_.archived||this._filterStatus&&_.status!==this._filterStatus)continue;if(this._filterUser){let y=this._filterUser==="current_user"?this._userService?.getCurrentUserId():this._filterUser;if(_.responsible_user_id!==y)continue}if(this._filterLabel&&!(_.labels||[]).includes(this._filterLabel)||this._filterPriority&&(_.priority||"normal")!==this._filterPriority)continue;let f=[];for(let y of Object.values(this._groups))y.task_refs?.some(E=>E.entry_id===v.entry_id&&E.task_id===_.id)&&f.push(y.name);t.push({entry_id:v.entry_id,task_id:_.id,object_name:v.object.name,allow_skip:_.allow_skip!==!1,task_name:_.name,type:_.type,schedule_type:_.schedule_type,status:_.status,days_until_due:_.days_until_due??null,next_due:_.next_due??null,trigger_active:_.trigger_active,trigger_current_value:_.trigger_current_value??null,trigger_current_delta:_.trigger_current_delta??null,trigger_config:_.trigger_config??null,trigger_entity_info:_.trigger_entity_info??null,times_performed:_.times_performed,total_cost:_.total_cost,interval_days:_.interval_days??null,interval_unit:_.interval_unit??null,interval_anchor:_.interval_anchor??null,is_done:_.is_done??!1,archived:_.archived??!1,history:_.history||[],enabled:_.enabled,nfc_tag_id:_.nfc_tag_id??null,priority:_.priority??"normal",labels:_.labels??[],area_id:v.object.area_id??null,responsible_user_id:_.responsible_user_id??null,group_names:f})}let e={overdue:0,triggered:1,due_soon:2,ok:3},i=(v,_)=>(e[v.status]??9)-(e[_.status]??9),a=(v,_)=>(v.days_until_due??99999)-(_.days_until_due??99999),o=(v,_)=>i(v,_)||a(v,_),p=v=>v.area_id&&this.hass?.areas?.[v.area_id]?.name||"",l=v=>v.responsible_user_id&&this._userService?.getUserName(v.responsible_user_id)||"",h=v=>v.group_names[0]||"",g={due_date:o,object:(v,_)=>v.object_name.localeCompare(_.object_name)||o(v,_),type:(v,_)=>v.type.localeCompare(_.type)||o(v,_),task_name:(v,_)=>v.task_name.localeCompare(_.task_name),area:(v,_)=>{let f=p(v),y=p(_);return!f&&y?1:f&&!y?-1:f.localeCompare(y)||o(v,_)},assigned_user:(v,_)=>{let f=l(v),y=l(_);return!f&&y?1:f&&!y?-1:f.localeCompare(y)||o(v,_)},group:(v,_)=>{let f=h(v),y=h(_);return!f&&y?1:f&&!y?-1:f.localeCompare(y)||o(v,_)}};return t.sort(g[this._sortMode]),t}_getObject(t){return this._objects.find(e=>e.entry_id===t)}_getTask(t,e){return this._getObject(t)?.tasks.find(a=>a.id===e)}_pushPanelState(t,e,i){let a={msp_view:t,msp_entry:e||null,msp_task:i||null};history.pushState(a,"")}_onPopState(t){let e=t.state;if(e?.msp_view&&(this._view=e.msp_view,this._selectedEntryId=e.msp_entry||null,this._selectedTaskId=e.msp_task||null,this._moreMenuOpen=!1,e.msp_view==="all_parts"&&this._loadAllParts(),e.msp_view==="task"&&e.msp_entry&&e.msp_task)){this._historyFilter=null;let i=this._getTask(e.msp_entry,e.msp_task);i?.trigger_config?.entity_id&&this._fetchDetailStats(i.trigger_config.entity_id,this._isCounterEntity(i.trigger_config))}}_showOverview(){this._pushPanelState("overview"),this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()}_showAllObjects(){this._pushPanelState("all_objects"),this._view="all_objects",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_showAllParts(){this._pushPanelState("all_parts"),this._view="all_parts",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop(),this._loadAllParts()}async _loadAllParts(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});this._allParts=t.parts||[]}catch{this._allParts=[]}}_filterByStatus(t){this._filterStatus=t,this._activeViewId="",this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard"),this._scrollContentToTop()}get _allLabels(){let t=new Set;for(let e of this._objects)for(let i of e.tasks)for(let a of i.labels||[])t.add(a);return[...t].sort((e,i)=>e.localeCompare(i))}get _currentFilters(){return{status:this._filterStatus,user_id:this._filterUser,label:this._filterLabel,priority:this._filterPriority,archived:this._showArchived,sort_mode:this._sortMode,group_by:this._groupByMode}}_applyView(t){if(this._activeViewId=t,!t)return;let e=this._savedViews.find(a=>a.id===t);if(!e)return;let i=e.filters;this._filterStatus=i.status||"",this._filterUser=i.user_id||null,this._filterLabel=i.label||null,this._filterPriority=i.priority||"",this._showArchived=!!i.archived,ue.includes(i.sort_mode)&&(this._sortMode=i.sort_mode),hi.includes(i.group_by)&&(this._groupByMode=i.group_by);try{Y(P.taskSort,this._sortMode),Y(P.groupBy,this._groupByMode)}catch{}this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard")}_openSavedViewsDialog(){this.shadowRoot.querySelector("maintenance-saved-views-dialog")?.open(this._currentFilters,this._savedViews)}_onSavedViewsChanged(t){this._savedViews=t.detail.views||[],this._activeViewId&&!this._savedViews.some(e=>e.id===this._activeViewId)&&(this._activeViewId="")}_scrollContentToTop(){requestAnimationFrame(()=>{let t=this.shadowRoot?.querySelector(".content");t&&t.scrollTo({top:0,behavior:"smooth"})})}_showObject(t){this._pushPanelState("object",t),this._view="object",this._selectedEntryId=t,this._selectedTaskId=null,this._scrollContentToTop()}_splitActive(){return this.split&&!this.narrow&&!this.tight&&this._view==="overview"&&this._overviewTab==="dashboard"&&!this._bulkMode}_showTask(t,e){if(this._splitActive()){this._selectedEntryId=t,this._selectedTaskId=e,this._activeTab="overview",this._historyFilter=null,this._resetStickyPane(),this._fetchFullHistory(t,e);let a=this._getTask(t,e);a?.trigger_config?.entity_id&&this._fetchDetailStats(a.trigger_config.entity_id,this._isCounterEntity(a.trigger_config));return}this._pushPanelState("task",t,e),this._view="task",this._selectedEntryId=t,this._selectedTaskId=e,this._activeTab="overview",this._historyFilter=null,this._scrollContentToTop(),this._fetchFullHistory(t,e);let i=this._getTask(t,e);if(i?.trigger_config?.entity_id){let a=i.trigger_config.entity_id,o=this._isCounterEntity(i.trigger_config);this._fetchDetailStats(a,o)}}_showToast(t){this._toastTimer&&clearTimeout(this._toastTimer),this._toastUndo=null,this._toastActionLabel="",this._toastMessage=t,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastTimer=null},4e3)}_showActionToast(t,e,i){this._showUndoToast(t,i),this._toastActionLabel=e}_showUndoToast(t,e){this._toastTimer&&clearTimeout(this._toastTimer),this._toastActionLabel="",this._toastMessage=t,this._toastUndo=e,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastUndo=null,this._toastTimer=null},7e3)}_runToastUndo(){let t=this._toastUndo;this._toastTimer&&clearTimeout(this._toastTimer),this._toastMessage="",this._toastUndo=null,this._toastTimer=null,t?.()}_openPalette(){this._paletteQuery="",this._paletteActive=0,this._paletteOpen=!0,this.updateComplete.then(()=>{this.shadowRoot?.querySelector(".palette-input")?.focus()})}_closePalette(){this._paletteOpen=!1,this._paletteQuery=""}get _paletteResults(){let t=this._paletteQuery.trim().toLowerCase(),e=[];for(let i of this._objects){let a=i.object.name||"";(!t||a.toLowerCase().includes(t))&&e.push({kind:"object",entryId:i.entry_id,label:a,sub:s("object",this._lang)});for(let o of i.tasks){if(o.archived)continue;let p=o.name||"",l=(o.labels||[]).some(h=>h.toLowerCase().includes(t));if(!t||p.toLowerCase().includes(t)||a.toLowerCase().includes(t)||l){let h=(o.labels||[]).length?`  #${(o.labels||[]).join(" #")}`:"";e.push({kind:"task",entryId:i.entry_id,taskId:o.id,label:p,sub:a+h})}}if(e.length>60)break}return e.slice(0,40)}_selectPaletteResult(t){this._closePalette(),t.kind==="task"&&t.taskId?this._showTask(t.entryId,t.taskId):this._showObject(t.entryId)}_renderPalette(){if(!this._paletteOpen)return d;let t=this._lang,e=this._paletteResults;return r`
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
            ${e.length===0?r`<div class="palette-empty">${s("palette_no_results",t)}</div>`:e.map((i,a)=>r`
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
    `}_openAdoptProblemSensors(){this._ui("maintenance-adopt-problem-sensors-dialog").then(t=>t?.open())}async _onProblemSensorsAdopted(t){let e=t.detail?.tasks_created??0,i=t.detail?.created??[];await this._loadData();let a=s("adopt_problem_done",this._lang).replace("{tasks}",String(e));i.length>0?this._showActionToast(a,s("adopt_problem_configure",this._lang),()=>{let o=i[0],p=this._objects.find(h=>h.entry_id===o.entry_id),l=p?.tasks.find(h=>h.id===o.task_id);p&&l&&this._ui("maintenance-task-dialog").then(h=>h?.openEdit(o.entry_id,l))}):this._showToast(a)}async _setupBatteryFleet(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/setup",language:this.hass.language||"en"});this._batteryFleetSetupAvailable=!1,await this._loadData();let e=this._objects.find(a=>a.entry_id===t.entry_id),i=e?.tasks.find(a=>a.id===t.task_id)||e?.tasks[0];e&&i&&this._showTask(e.entry_id,i.id),this._showToast(s("battery_fleet_setup_done",this._lang))}catch(t){this._showToast(C(t,this._lang))}}_openSuggestedSetups(){this._ui("maintenance-suggested-setups-dialog").then(t=>t?.open())}_onSetupsAdopted(t){let e=t.detail?.tasks_created??0;this._showToast(s("setups_done",this._lang).replace("{tasks}",String(e))),this._loadData()}async _openTemplateGallery(){if(this._templateGalleryOpen=!0,!(this._templates.length>0))try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/templates",language:this._lang});this._templateCategories=t.categories||{},this._templates=(t.templates||[]).filter(e=>!e.disabled)}catch{this._showToast(s("action_error",this._lang))}}async _createFromTemplate(t){this._templateBusy=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/from_template",language:this._lang,template_id:t});this._templateGalleryOpen=!1,await this._loadData(),this._showToast(s("template_created",this._lang)),e?.entry_id&&this._showObject(e.entry_id)}catch{this._showToast(s("action_error",this._lang))}finally{this._templateBusy=!1}}_categoryName(t){let e=this._templateCategories[t];return e&&(e[`name_${this._lang}`]||e.name_en)||t}_renderTemplateGallery(){if(!this._templateGalleryOpen)return d;let t=this._lang,e=new Map;for(let i of this._templates)e.has(i.category)||e.set(i.category,[]),e.get(i.category).push(i);return r`
      <div class="palette-backdrop" @click=${()=>{this._templateGalleryOpen=!1}}>
        <div class="template-gallery" @click=${i=>i.stopPropagation()}>
          <div class="template-gallery-head">
            <span>${s("templates_title",t)}</span>
            <ha-icon-button .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
              @click=${()=>{this._templateGalleryOpen=!1}}></ha-icon-button>
          </div>
          <div class="template-gallery-body">
            ${this._templates.length===0?r`<div class="palette-empty">${s("loading",t)}…</div>`:[...e.entries()].map(([i,a])=>r`
                  <div class="template-cat">
                    <div class="template-cat-head">
                      <ha-icon icon="${this._templateCategories[i]?.icon||"mdi:folder-outline"}"></ha-icon>
                      ${this._categoryName(i)}
                    </div>
                    <div class="template-grid">
                      ${a.map(o=>r`
                        <button class="template-card" .disabled=${this._templateBusy}
                          @click=${()=>this._createFromTemplate(o.id)}>
                          <span class="template-card-name">${o.name}</span>
                          <span class="template-card-count">${s("templates_task_count",t).replace("{n}",String(o.tasks.length))}</span>
                        </button>
                      `)}
                    </div>
                  </div>
                `)}
          </div>
        </div>
      </div>
    `}_bulkKey(t){return`${t.entry_id}:${t.task_id}`}_toggleBulkMode(){this._bulkMode=!this._bulkMode,this._bulkMode||(this._bulkSelected=new Set)}_toggleBulkRow(t){let e=this._bulkKey(t),i=new Set(this._bulkSelected);i.has(e)?i.delete(e):i.add(e),this._bulkSelected=i}_bulkSelectAll(t){let e=t.map(a=>this._bulkKey(a)),i=e.every(a=>this._bulkSelected.has(a));this._bulkSelected=i?new Set:new Set(e)}async _runBulk(t,e,i,a){let o=t.filter(l=>this._bulkSelected.has(this._bulkKey(l)));if(o.length===0)return;this._actionLoading=!0;let p=0;for(let l of o)try{await this.hass.connection.sendMessagePromise(e(l)),p++}catch{}this._actionLoading=!1,this._bulkSelected=new Set,this._bulkMode=!1,await this._loadData(),a&&p>0?this._showUndoToast(i(p),a):this._showToast(i(p))}_bulkComplete(t){this._runBulk(t,e=>({type:"maintenance_supporter/task/complete",entry_id:e.entry_id,task_id:e.task_id}),e=>s("bulk_completed",this._lang).replace("{n}",String(e)))}_bulkArchive(t){let e=t.filter(i=>this._bulkSelected.has(this._bulkKey(i))).map(i=>({entry_id:i.entry_id,task_id:i.task_id}));this._runBulk(t,i=>({type:"maintenance_supporter/task/archive",entry_id:i.entry_id,task_id:i.task_id}),i=>s("bulk_archived",this._lang).replace("{n}",String(i)),async()=>{for(let i of e)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/unarchive",entry_id:i.entry_id,task_id:i.task_id})}catch{}await this._loadData()})}async _runAction(t,e){this._actionLoading=!0;try{let i=await this.hass.connection.sendMessagePromise(t);return await this._loadData(),e?.successToast&&this._showToast(e.successToast),i??{}}catch(i){return this._showToast(C(i,this._lang)),null}finally{this._actionLoading=!1}}async _deleteObject(t){if(!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("confirm_delete_object",this._lang),confirmText:s("delete",this._lang),danger:!0}))return;await this._runAction({type:"maintenance_supporter/object/delete",entry_id:t})&&this._showOverview()}_printObjectReport(t){let e=this._getObject(t);if(!e)return;let i=this._lang,a={title:s("report_title",i),generated:s("report_generated",i),manufacturer:s("manufacturer",i),model:s("model",i),serial:s("serial_number_label",i),installed:s("installed",i),warranty:s("warranty",i),area:s("area",i),notes:s("report_notes",i),tasksHeading:s("tasks",i),colTask:s("task_name",i),colType:s("report_col_type",i),colStatus:s("report_col_status",i),colSchedule:s("report_col_schedule",i),colLastDone:s("last_performed",i),colNextDue:s("next_due",i),colCost:s("cost",i),colTimes:s("report_times_done",i),totalCost:s("report_total_cost",i),scheduleLabel:p=>Rt(p,i),none:"\u2014",statusLabel:p=>s(p,i),typeLabel:p=>s(p,i)},o=Fe(e.object,e.tasks,a,p=>p?q(p,i):"",p=>B(p,this._currencySymbol,i),new Date().toISOString());Dt(o)}async _duplicateObject(t){let e=await this._runAction({type:"maintenance_supporter/object/duplicate",entry_id:t},{successToast:s("object_duplicated",this._lang)});e?.entry_id&&this._showObject(e.entry_id)}async _deleteTask(t,e){if(!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("confirm_delete_task",this._lang),confirmText:s("delete",this._lang),danger:!0}))return;await this._runAction({type:"maintenance_supporter/task/delete",entry_id:t,task_id:e})&&this._showObject(t)}async _duplicateTask(t,e){this._moreMenuOpen=!1;let i=await this._runAction({type:"maintenance_supporter/task/duplicate",entry_id:t,task_id:e},{successToast:s("task_duplicated",this._lang)});i?.task_id&&this._showTask(t,i.task_id)}async _toggleArchiveTask(t,e,i){await this._runAction({type:i?"maintenance_supporter/task/unarchive":"maintenance_supporter/task/archive",entry_id:t,task_id:e})&&!i&&this._showUndoToast(s("task_archived",this._lang),()=>this._toggleArchiveTask(t,e,!0))}async _toggleArchiveObject(t,e){await this._runAction({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:t})&&!e&&this._showUndoToast(s("object_archived",this._lang),()=>this._toggleArchiveObject(t,!0))}async _togglePauseObject(t,e){if(!e){let a=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:s("pause_object",this._lang),message:s("pause_until_prompt",this._lang),confirmText:s("pause_object",this._lang),inputLabel:s("pause_until_label",this._lang),inputType:"date"});if(!a?.confirmed)return;let o={type:"maintenance_supporter/object/pause",entry_id:t};a.value&&(o.until=a.value),await this._runAction(o)&&this._showUndoToast(s("object_paused",this._lang),()=>this._togglePauseObject(t,!0));return}await this._runAction({type:"maintenance_supporter/object/resume",entry_id:t},{successToast:s("object_resumed",this._lang)})}async _replaceObject(t,e){let a=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:s("replace_object",this._lang),message:s("replace_object_prompt",this._lang),confirmText:s("replace_object",this._lang),inputLabel:s("replace_name_label",this._lang),inputType:"text",inputValue:e});if(!a?.confirmed)return;let o=await this._runAction({type:"maintenance_supporter/object/replace",entry_id:t,name:a.value||e},{successToast:s("object_replaced",this._lang)});o?.entry_id&&this._showObject(o.entry_id)}async _skipTask(t,e,i){let a={type:"maintenance_supporter/task/skip",entry_id:t,task_id:e};i&&(a.reason=i),await this._runAction(a)}async _resetTask(t,e,i){let a={type:"maintenance_supporter/task/reset",entry_id:t,task_id:e};i&&(a.date=i),await this._runAction(a)}async _applySuggestion(t,e,i){await this._runAction({type:"maintenance_supporter/task/apply_suggestion",entry_id:t,task_id:e,interval:i})}_openSeasonalOverrides(t){let e=this.shadowRoot.querySelector("maintenance-seasonal-overrides-dialog");if(!e||!this._selectedEntryId)return;let i=t.adaptive_config?.seasonal_overrides;e.open(this._selectedEntryId,t.id,i)}async _reanalyzeInterval(t,e){let i=await this._runAction({type:"maintenance_supporter/task/analyze_interval",entry_id:t,task_id:e});i&&(i.recommended_interval?this._showToast(`${s("reanalyze_result",this._lang)}: ${i.recommended_interval} ${s("days",this._lang)} (${s(`confidence_${i.confidence}`,this._lang)}, ${i.data_points} ${s("data_points",this._lang)})`):this._showToast(s("reanalyze_insufficient_data",this._lang)))}async _promptSkipTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("skip",this._lang),message:s("skip_reason_prompt",this._lang),confirmText:s("skip",this._lang),inputLabel:s("reason_optional",this._lang),inputType:"text"});a.confirmed&&this._skipTask(t,e,a.value||void 0)}async _promptResetTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("reset",this._lang),message:s("reset_date_prompt",this._lang),confirmText:s("reset",this._lang),inputLabel:s("reset_date_optional",this._lang),inputType:"date"});a.confirmed&&this._resetTask(t,e,a.value||void 0)}async _postponeTask(t,e,i){await this._runAction({type:"maintenance_supporter/task/postpone",entry_id:t,task_id:e,until:i},{successToast:s("postponed",this._lang)})}async _promptPostponeTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("postpone",this._lang),message:s("postpone_date_prompt",this._lang),confirmText:s("postpone",this._lang),inputLabel:s("postpone_date_label",this._lang),inputType:"date"});!a.confirmed||!a.value||this._postponeTask(t,e,a.value)}async _snoozeTask(t,e){await this._runAction({type:"maintenance_supporter/task/snooze",entry_id:t,task_id:e},{successToast:s("snoozed",this._lang)})}_dismissSuggestion(t,e){t&&e&&this._dismissedSuggestions.add(`${t}_${e}`),this.requestUpdate()}async _handleQuickComplete(t,e,i){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/quick_complete",entry_id:t,task_id:e}),this._showToast(s("quick_complete_success",this._lang))}catch(a){let o=a?.code||"";o==="no_defaults"||o==="completion_details_required"?this._openCompleteDialog(t,e,i.name,this._features.checklists?i.checklist:void 0,this._features.adaptive&&!!i.adaptive_config?.enabled,{viaTagScan:!0}):this._showToast(C(a,this._lang,s("action_error",this._lang)));return}try{await this._loadData()}catch{}}async _printTaskWorksheet(t,e){let i=this._getObject(t),a=i?.tasks.find(o=>o.id===e);if(!(!i||!a)){this._actionLoading=!0;try{let o={type:"maintenance_supporter/qr/generate",entry_id:t,task_id:e,url_mode:"server"},[p,l]=await Promise.all([this.hass.connection.sendMessagePromise({...o,action:"view"}).catch(()=>null),this.hass.connection.sendMessagePromise({...o,action:"complete"}).catch(()=>null)]),h=null;try{let E=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:t})).documents||[]).find(M=>M.kind==="file"&&M.mime==="application/pdf"&&(M.task_ids||[]).includes(e)&&M.task_pages?.[e]);if(E){let M=E.task_pages[e],R=4,$={path:await ye(this.hass,`/api/maintenance_supporter/document/${E.id}/excerpt?start=${M}&count=${R}`,3600)};h={title:E.title||E.filename||"Manual",startPage:M,endPage:M+R-1,url:new URL($.path,window.location.origin).toString(),vendorBase:new URL("/maintenance_supporter_vendor",window.location.origin).toString()}}}catch{}let g=this._lang,v={title:s("worksheet",g),object:s("object",g),type:s("maintenance_type",g),interval:s("interval",g),nextDue:s("next_due",g),lastDone:s("last_performed",g),priority:s("priority",g),checklist:s("checklist",g),notes:s("notes_label",g),scanView:s("worksheet_scan_view",g),scanComplete:s("worksheet_scan_complete",g),manualExcerpt:s("worksheet_manual_excerpt",g),pages:s("worksheet_pages",g),printedOn:s("worksheet_printed",g),never:s("worksheet_never",g),typeLabel:y=>s(y,g),statusLabel:y=>s(y,g),parts:s("consumes_parts_label",g)},_=(a.consumes_parts||[]).map(y=>$e(y,i.entry_id,this._objects,g)),f=Ve(a,i.object.name,v,y=>q(y,g),y=>Rt(y,g),p?.svg_data_uri||null,l?.svg_data_uri||null,h,new Date().toISOString(),_);Dt(f)}finally{this._actionLoading=!1}}}_openManualDoc(t){if(t.kind!=="file"){X(t.url)&&window.open(t.url,"_blank","noopener");return}xt(this.hass,t.id).catch(()=>{})}async _setChecklistItem(t,e,i,a){let p=this._getObject(t)?.tasks.find(g=>g.id===e);if(!p)return;let l={},h=Wt(p)?.checklist??(p.checklist||[]);for(let g of h){let v=p.checklist_progress?.[g]??!1;l[g]=g===i?a:v}await this._runAction({type:"maintenance_supporter/task/checklist_progress",entry_id:t,task_id:e,checklist_state:l})}_openCompleteDialog(t,e,i,a,o,p){this._ui("maintenance-complete-dialog").then(l=>l&&this._fillAndOpenCompleteDialog(l,t,e,i,a,o,p))}_fillAndOpenCompleteDialog(t,e,i,a,o,p,l){Ee(t,Se({entryId:e,taskId:i,taskName:a,task:this._getTask(e,i),objects:this._objects,lang:this._lang,checklist:o,checklistsEnabled:this._features.checklists,adaptiveEnabled:p,currencySymbol:this._currencySymbol,viaTagScan:l?.viaTagScan}),this._lang)}_openQrForObject(t,e){this._ui("maintenance-qr-dialog").then(i=>i?.openForObject(t,e))}_openQrForTask(t,e,i,a){this._ui("maintenance-qr-dialog").then(o=>o?.openForTask(t,e,i,a))}render(){return r`
      <div class="panel">
        ${this._staleBundle?r`
              <div class="update-banner" role="status">
                <ha-icon icon="mdi:update"></ha-icon>
                <span>${s("update_banner",this._lang)}</span>
                <ha-button appearance="plain" @click=${()=>location.reload()}>
                  ${s("update_reload",this._lang)}
                </ha-button>
              </div>
            `:d}
        ${this._rowActionNotice&&this.hass?.user?.is_admin?r`
              <div class="update-banner row-actions-banner" role="status">
                <ha-icon icon="mdi:gesture-tap-button"></ha-icon>
                <span>${s("row_actions_banner",this._lang)}</span>
                <ha-button appearance="plain" @click=${()=>this._dismissRowActionNotice(!1)}>
                  ${s("row_actions_keep",this._lang)}
                </ha-button>
                <ha-button appearance="filled" @click=${()=>this._dismissRowActionNotice(!0)}>
                  ${s("row_actions_back",this._lang)}
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
      ${this._toastMessage?r`<div class="toast">
        <span>${this._toastMessage}</span>
        ${this._toastUndo?r`<button class="toast-undo" @click=${()=>this._runToastUndo()}>${this._toastActionLabel||s("undo",this._lang)}</button>`:d}
      </div>`:d}
      ${this._renderPalette()}
      ${this._renderTemplateGallery()}
    `}_renderHeader(){let t=[{label:s("maintenance",this._lang),action:()=>this._showOverview()}];if(this._view==="object"&&this._selectedEntryId){let e=this._getObject(this._selectedEntryId);t.push({label:e?.object.name||"Object"})}if(this._view==="task"&&this._selectedEntryId&&this._selectedTaskId){let e=this._getObject(this._selectedEntryId);t.push({label:e?.object.name||"Object",action:()=>this._showObject(this._selectedEntryId)});let i=this._getTask(this._selectedEntryId,this._selectedTaskId);t.push({label:i?.name||"Task"})}return r`
      <div class="header">
        ${this.narrow?r`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`:d}
        ${this._view!=="overview"?r`<ha-icon-button
              .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
              @click=${()=>{this._view==="task"?this._showObject(this._selectedEntryId):this._showOverview()}}
            ></ha-icon-button>`:d}
        <div class="breadcrumbs">
          ${t.map((e,i)=>r`
              ${i>0?r`<span class="sep">/</span>`:d}
              ${e.action?r`<a @click=${e.action}>${e.label}</a>`:r`<span class="current">${e.label}</span>`}
            `)}
        </div>
      </div>
    `}_renderOverview(){let t=this._lang,e=!!this.hass?.user?.is_admin,i=this._stats;return!e&&this._overviewTab==="settings"&&(this._overviewTab="dashboard"),r`
      ${i?r`
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
        ${e?r`
          <div class="tab ${this._overviewTab==="settings"?"active":""}"
            @click=${()=>this._setOverviewTab("settings")}>
            ${s("settings",t)}
          </div>
        `:d}
      </div>
      ${this._overviewTab==="today"?this._renderToday():this._overviewTab==="dashboard"?this._renderDashboard():this._overviewTab==="calendar"?r`
            <div @ll-custom=${this._onCalendarLlCustom}>
              <maintenance-supporter-calendar-card
                .hass=${this.hass}
              ></maintenance-supporter-calendar-card>
            </div>
          `:r`<maintenance-settings-view
            .hass=${this.hass}
            .features=${this._features}
            .budget=${this._budget}
            @settings-changed=${this._onSettingsChanged}
          ></maintenance-settings-view>`}
    `}_statusBadge(t,e,i){let a=this._lang,o=t?"archived":e?"done":i,p=t?"archived":e?"completed":i,l=t?s("archived",a):e?s("completed",a):s(i,a);return r`<span class="status-badge ${o}" role="img" title="${l}" aria-label="${l}"><ha-icon icon="${Ht[p]||"mdi:circle-medium"}"></ha-icon><span class="status-label">${l}</span></span>`}_setOverviewTab(t){this._overviewTab=t;try{Y(P.overviewTab,t)}catch{}this._scrollContentToTop()}_renderToday(){let t=this._lang,e=this._taskRows,i=h=>`${h.entry_id}:${h.task_id}`,a=e.filter(h=>h.status==="overdue"||h.trigger_active),o=new Set(a.map(i)),p=e.filter(h=>!o.has(i(h))&&h.days_until_due===0);p.forEach(h=>o.add(i(h)));let l=e.filter(h=>!o.has(i(h))&&h.days_until_due!=null&&h.days_until_due>0&&h.days_until_due<=7);return a.length+p.length+l.length===0?r`
        <div class="today-empty">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <p>${s("today_all_caught_up",t)}</p>
        </div>
      `:r`
      <div class="today-view">
        ${this._renderTodaySection("today_overdue",a,"overdue")}
        ${this._renderTodaySection("today_due_today",p,"due_soon")}
        ${this._renderTodaySection("today_this_week",l,"")}
      </div>
    `}_renderTodaySection(t,e,i){if(e.length===0)return d;let a=this._lang;return r`
      <div class="today-section">
        <div class="today-section-header ${i}">
          <span>${s(t,a)}</span><span class="today-badge">${e.length}</span>
        </div>
        ${e.map(o=>r`
          <div class="today-row" @click=${()=>this._showTask(o.entry_id,o.task_id)}>
            <span class="today-dot ${o.trigger_active?"triggered":o.status}"></span>
            <div class="today-main">
              <div class="today-task">${o.task_name}</div>
              <div class="today-object">${o.object_name} · ${yt(o.days_until_due,a)}</div>
            </div>
            ${this._actionStyle()==="icons"?r`
                <mwc-icon-button class="btn-complete" title="${s("complete",a)}"
                  @click=${p=>{p.stopPropagation(),this._openCompleteDialogForRow(o)}}>
                  <ha-icon icon="mdi:check"></ha-icon>
                </mwc-icon-button>`:r`
                <ha-button size="small" appearance="accent" variant="success" class="today-complete" title="${s("complete",a)}"
                  @click=${p=>{p.stopPropagation(),this._openCompleteDialogForRow(o)}}>
                  ${this._actionStyle()==="buttons_compact"&&(this.narrow||this.tight)?r`<ha-icon icon="mdi:check"></ha-icon>`:r`<ha-icon slot="start" icon="mdi:check"></ha-icon>${s("complete",a)}`}
                </ha-button>`}
          </div>
        `)}
      </div>
    `}_renderDashboard(){let t=this._stats,e=this._taskRows,i=this._lang,a=this._isOperator,o=this._objects.reduce((l,h)=>l+h.tasks.filter(g=>g.archived).length,0),p=(this._filterStatus?1:0)+(this._filterUser?1:0)+(this._filterLabel?1:0)+(this._filterPriority?1:0)+(this._activeViewId?1:0);return r`

      ${this.narrow?r`
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
            @change=${l=>this._applyView(l.target.value)}
          >
            <option value="">${s("views_none",i)}</option>
            ${this._savedViews.map(l=>r`<option value=${l.id} ?selected=${this._activeViewId===l.id}>${l.name}</option>`)}
          </select>
        </label>
        ${a?d:r`
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
            @change=${l=>{this._filterStatus=l.target.value,this._activeViewId=""}}
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
            @change=${l=>{let h=l.target.value;this._filterUser=h||null,this._activeViewId=""}}
          >
            <option value="">${s("all_users",i)}</option>
            <option value="current_user">${s("my_tasks",i)}</option>
          </select>
        </label>
        ${this._allLabels.length>0?r`
          <label class="filter-field">
            <span class="filter-label">${s("label_filter",i)}</span>
            <select
              .value=${this._filterLabel||""}
              @change=${l=>{let h=l.target.value;this._filterLabel=h||null,this._activeViewId=""}}
            >
              <option value="">${s("all_labels",i)}</option>
              ${this._allLabels.map(l=>r`<option value=${l} ?selected=${this._filterLabel===l}>${l}</option>`)}
            </select>
          </label>
        `:d}
        <label class="filter-field">
          <span class="filter-label">${s("priority",i)}</span>
          <select
            .value=${this._filterPriority}
            @change=${l=>{this._filterPriority=l.target.value,this._activeViewId=""}}
          >
            <option value="">${s("all_priorities",i)}</option>
            ${["high","normal","low"].map(l=>r`<option value=${l} ?selected=${this._filterPriority===l}>${s(`priority_${l}`,i)}</option>`)}
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${s("sort_label",i)}</span>
          <select
            .value=${this._sortMode}
            @change=${l=>{this._sortMode=l.target.value,this._activeViewId="";try{Y(P.taskSort,this._sortMode)}catch{}}}
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
            @change=${l=>{this._groupByMode=l.target.value,this._activeViewId="";try{Y(P.groupBy,this._groupByMode)}catch{}}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${s("groupby_none",i)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${s("groupby_area",i)}</option>
            ${this._features.groups?r`<option value="group" ?selected=${this._groupByMode==="group"}>${s("groupby_group",i)}</option>`:d}
            <option value="user" ?selected=${this._groupByMode==="user"}>${s("groupby_user",i)}</option>
            <option value="object" ?selected=${this._groupByMode==="object"}>${s("groupby_object",i)}</option>
          </select>
        </label>
        ${o>0?r`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived,this._activeViewId=""}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?s("hide_archived",i):`${s("show_archived",i)} (${o})`}
          </ha-button>
        `:d}
        ${!a&&e.length>0?r`
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

      ${e.length===0?r`
            <div class="empty-state">
              <ha-svg-icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></ha-svg-icon>
              <p>${s("no_tasks",i)}</p>
              ${!a&&this._objects.length===0?r`
                <p class="empty-onboard-hint">${s("onboard_hint",i)}</p>
                <div class="empty-onboard-actions">
                  <ha-button appearance="filled" @click=${()=>this._openTemplateGallery()}>
                    <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon> ${s("templates_from",i)}
                  </ha-button>
                  <ha-button appearance="plain" @click=${()=>this._ui("maintenance-object-dialog").then(l=>l?.openCreate())}>
                    ${s("new_object",i)}
                  </ha-button>
                </div>
              `:d}
            </div>
          `:r`
            ${this._bulkMode?this._renderBulkBar(e,i):d}
            ${this._splitActive()?r`
                  <div class="split-layout">
                    <div class="split-list">
                      ${this._groupByMode==="none"?this._renderTaskTable(e):this._renderGroupedTasks(e,i)}
                    </div>
                    <div class="split-pane">
                      ${this._selectedEntryId&&this._selectedTaskId&&this._getTask(this._selectedEntryId,this._selectedTaskId)?this._renderTaskDetail():r`<div class="split-pane-empty"><ha-icon icon="mdi:cursor-default-click-outline"></ha-icon><p>${s("split_select_hint",i)}</p></div>`}
                    </div>
                  </div>
                `:this._groupByMode==="none"?this._renderTaskTable(e):this._renderGroupedTasks(e,i)}
          `}

      ${this._features.groups&&!a?this._renderGroupsSection():d}
      ${a?d:r`<maintenance-storage-section-card
            .hass=${this.hass}
            .objects=${this._objects}
            @open-object=${l=>{let h=l.detail?.entry_id;h&&this._showObject(h)}}
          ></maintenance-storage-section-card>`}
    `}_renderTaskTable(t){let e=this._bulkMode?" bulk":"";if(this._virtTotalRows=t.length,this.narrow||t.length<120)return r`
        <div class="task-table${e}">
          ${t.map(g=>this._renderOverviewRow(g))}
        </div>
      `;let i=t.length,a=this._virtRowHeight,o=Math.max(0,Math.min(this._virtStart,i)),p=this._virtEnd>0?Math.min(this._virtEnd,i):Math.min(i,40);p<o&&(o=0,p=Math.min(i,40));let l=o*a,h=(i-p)*a;return r`
      <div class="task-table${e} virtual">
        ${this._renderVirtSizerRow(t)}
        ${l>0?r`<div class="virt-spacer" style="height:${l}px"></div>`:d}
        ${t.slice(o,p).map(g=>this._renderOverviewRow(g))}
        ${h>0?r`<div class="virt-spacer" style="height:${h}px"></div>`:d}
      </div>
    `}_renderVirtSizerRow(t){let e=this._lang,i="",a=!1,o=!1,p=!1;for(let l of t){let h=l.archived?s("archived",e):l.is_done?s("completed",e):s(l.status,e);h.length>i.length&&(i=h),l.enabled||(a=!0),l.nfc_tag_id&&(o=!0),(l.priority==="high"||l.priority==="low")&&(p=!0)}return r`
      <div class="task-row virt-sizer" aria-hidden="true">
        ${this._bulkMode?r`<span></span>`:d}
        <span class="cell-badges">
          <span class="status-badge"><ha-icon icon="mdi:circle-medium"></ha-icon><span class="status-label">${i}</span></span>
          ${a?r`<span class="badge-disabled">${s("disabled",e)}</span>`:d}
          ${o?r`<span class="nfc-badge"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:d}
          ${p?r`<span class="priority-badge"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>`:d}
        </span>
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
    `}_renderBulkBar(t,e){let i=this._bulkSelected.size,a=t.length>0&&t.every(o=>this._bulkSelected.has(this._bulkKey(o)));return r`
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
    `}_renderGroupedTasks(t,e){let i=new Map,a=s("unassigned",e);for(let l of t){let h=[];this._groupByMode==="area"?h=[(l.area_id?this.hass?.areas?.[l.area_id]?.name:null)||a]:this._groupByMode==="user"?h=[(l.responsible_user_id?this._userService?.getUserName(l.responsible_user_id):null)||a]:this._groupByMode==="group"?h=l.group_names.length>0?l.group_names:[a]:this._groupByMode==="object"&&(h=[l.object_name]);for(let g of h)i.has(g)||i.set(g,[]),i.get(g).push(l)}let o=[...i.entries()].sort(([l],[h])=>l===a&&h!==a?1:h===a&&l!==a?-1:l.localeCompare(h)),p=this._groupByMode==="area"?"mdi:map-marker-outline":this._groupByMode==="group"?"mdi:folder-outline":this._groupByMode==="object"?"mdi:cube-outline":"mdi:account-outline";return r`
      <div class="task-table grouped${this._bulkMode?" bulk":""}">
        ${o.map(([l,h])=>{let g=!this._collapsedGroups.has(l);return r`
            <div class="group-section" ?open=${g}>
              <div
                class="group-section-header"
                role="button"
                tabindex="0"
                aria-expanded=${g?"true":"false"}
                @click=${()=>this._toggleGroup(l)}
                @keydown=${v=>{(v.key==="Enter"||v.key===" ")&&(v.preventDefault(),this._toggleGroup(l))}}
              >
                <ha-icon icon="${p}"></ha-icon>
                <span>${l}</span>
                <span class="group-section-count">(${h.length})</span>
              </div>
              ${g?r`<div class="group-rows">${h.map(v=>this._renderOverviewRow(v))}</div>`:d}
            </div>
          `})}
      </div>
    `}_toggleGroup(t){let e=new Set(this._collapsedGroups);e.has(t)?e.delete(t):e.add(t),this._collapsedGroups=e}_warrantyLabel(t,e,i){return t.kind==="expired"?s("warranty_expired",i):t.kind==="expiring"?s("warranty_expires_in",i).replace("{days}",String(t.days??0)):s("warranty_valid_until",i).replace("{date}",q(e,i))}_renderWarrantyMeta(t,e){let i=ne(t);return r`<p class="meta">${s("warranty",e)}:
      <span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,t,e)}</span></p>`}_renderAllObjects(){let t=this._lang,e=this._isOperator,i=this._objectViewMode==="table"&&!this.narrow,a=this._objects.filter(g=>g.object.archived).length,o=g=>{let v=1/0;for(let _ of g.tasks){let f=_.days_until_due;f!=null&&f<v&&(v=f)}return v},p=this._objects.filter(g=>this._showArchived||!g.object.archived);this._objectSortMode==="alphabetical"?p.sort((g,v)=>g.object.name.localeCompare(v.object.name)):this._objectSortMode==="task_count"?p.sort((g,v)=>v.tasks.length-g.tasks.length||g.object.name.localeCompare(v.object.name)):p.sort((g,v)=>o(g)-o(v)||g.object.name.localeCompare(v.object.name));let l=()=>{let g=new Map;for(let v of p){let _=v.object.area_id,f=_?this.hass?.areas?.[_]?.name||s("unassigned",t):s("no_area",t);g.has(f)||g.set(f,[]),g.get(f).push(v)}return new Map([...g.entries()].sort(([v],[_])=>v.localeCompare(_)))},h=g=>{let v=g.tasks.some(_=>_.status==="overdue"||_.status==="triggered");return r`
        <div class="object-card${v?" object-card-overdue":""}" @click=${()=>this._showObject(g.entry_id)}>
          ${v?r`<span class="overdue-dot" title="${s("has_overdue",t)}"></span>`:d}
          <div class="object-card-header">
            <span class="object-card-name">${g.object.name}</span>
            ${g.object.paused?r`<span class="paused-badge" title="${s("object_paused_badge",t)}${g.object.paused_until?` \u2014 ${g.object.paused_until}`:""}">
                  <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
                </span>`:d}
            ${g.object.document_count?r`<span class="doc-badge" title="${g.object.document_count} ${s("documents",t)}">
                  <ha-icon icon="mdi:paperclip"></ha-icon>${g.object.document_count}
                </span>`:d}
            <span class="object-card-count">${g.tasks.length} ${s("tasks_lower",t)}</span>
          </div>
          ${g.object.manufacturer||g.object.model?r`<div class="object-card-meta">${[g.object.manufacturer,g.object.model].filter(Boolean).join(" ")}</div>`:d}
          ${g.tasks.length===0?r`<div class="object-card-empty">${s("no_tasks_yet",t)}</div>`:d}
        </div>
      `};return r`
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
            @change=${g=>{this._objectSortMode=g.target.value;try{Y(P.objectSort,this._objectSortMode)}catch{}}}
          >
            <option value="alphabetical" ?selected=${this._objectSortMode==="alphabetical"}>${s("sort_alphabetical",t)}</option>
            <option value="due_soonest" ?selected=${this._objectSortMode==="due_soonest"}>${s("sort_due_soonest",t)}</option>
            <option value="task_count" ?selected=${this._objectSortMode==="task_count"}>${s("sort_task_count",t)}</option>
          </select>
        </label>
        ${this.narrow?d:r`
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
        ${i?d:r`
        <label class="filter-field">
          <span class="filter-label">${s("group_by_label",t)}</span>
          <select
            .value=${this._groupByMode}
            @change=${g=>{this._groupByMode=g.target.value;try{Y(P.groupBy,this._groupByMode)}catch{}}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${s("groupby_none",t)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${s("groupby_area",t)}</option>
          </select>
        </label>
        `}
        ${e?d:r`
          <ha-button
            @click=${()=>this._ui("maintenance-object-dialog").then(g=>g?.openCreate())}
          >
            ${s("new_object",t)}
          </ha-button>
        `}
        <ha-button appearance="plain" @click=${()=>this._exportObjectsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${s("settings_export_csv",t)}
        </ha-button>
        ${a>0?r`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?s("hide_archived",t):`${s("show_archived",t)} (${a})`}
          </ha-button>
        `:d}
      </div>
      ${i?this._renderObjectsTable(p):this._groupByMode==="area"?r`
          ${[...l().entries()].map(([g,v])=>r`
            <details class="group-section" open>
              <summary class="group-section-header">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <span>${g}</span>
                <span class="group-section-count">(${v.length})</span>
              </summary>
              <div class="objects-grid">${v.map(h)}</div>
            </details>
          `)}
        `:r`<div class="objects-grid">${p.map(h)}</div>`}
    `}_setObjectViewMode(t){this._objectViewMode=t;try{Y(P.objectView,t)}catch{}}_renderAllParts(){let t=this._lang,e=this._allParts,i=this._currencySymbol;return r`
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
      ${e===null?r`<div class="empty-state">…</div>`:e.length===0?r`<div class="empty-state">${s("parts_section",t)}: 0</div>`:r`
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
                ${e.map(a=>r`
                  <tr class="objects-table-row" @click=${()=>this._showObject(a.entry_id)}>
                    <td>
                      <span class="objects-table-name">${a.name}</span>
                      ${a.low?r`<ha-icon class="part-low-icon" icon="mdi:cart-arrow-down"
                            title="${s("part_reorder_threshold",t)}: ${a.reorder_threshold}"></ha-icon>`:d}
                    </td>
                    <td>${a.object_name||"\u2014"}</td>
                    <td>${a.stock!==null?`${a.stock}${a.unit?` ${a.unit}`:""}`:"\u2014"}</td>
                    <td>${a.reorder_threshold??"\u2014"}</td>
                    <td>${a.cost!=null?`${a.cost} ${i}`.trim():"\u2014"}</td>
                    <td>${a.storage_location||"\u2014"}</td>
                    <td>
                      ${a.consumers.length===0?"\u2014":a.consumers.map(o=>r`
                            <span
                              class="part-consumer-chip${o.pooled?" pooled":""}"
                              title=${`${o.object_name??""}: ${o.task_name??o.task_id} (\xD7${o.quantity})`}
                            >${o.pooled?`${o.object_name} \xB7 `:""}${o.task_name??o.task_id}</span>
                          `)}
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `}
    `}_exportPartsCsv(){let t=this._allParts||[],e=p=>{let l=p==null?"":String(p);return/[",\n;]/.test(l)?`"${l.replace(/"/g,'""')}"`:l},a=[["name","object","stock","unit","reorder_threshold","unit_cost","storage_location","vendor","used_by"].join(",")];for(let p of t)a.push([e(p.name),e(p.object_name),e(p.stock),e(p.unit),e(p.reorder_threshold),e(p.cost),e(p.storage_location),e(p.vendor),e(p.consumers.map(l=>`${l.object_name??""}/${l.task_name??l.task_id}\xD7${l.quantity}`).join(" | "))].join(","));let o=new Date().toISOString().slice(0,10);se(a.join(`
`),`maintenance_parts_${o}.csv`,"text/csv;charset=utf-8")}async _exportObjectsCsv(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects/csv"}),e=new Date().toISOString().slice(0,10);se(t.csv,`maintenance_objects_${e}.csv`,"text/csv;charset=utf-8")}catch{this._showToast(s("action_error",this._lang))}}_renderObjectsTable(t){let e=this._lang,i=this._objectsTableColumns;return r`
      <div class="objects-table-wrap">
        <table class="objects-table">
          <thead>
            <tr>
              ${i.map(a=>{let o=xe.find(l=>l.key===a),p=o&&o.key!=="actions"?s(o.labelKey,e):"";return r`<th class="oc-${a}">${p}</th>`})}
            </tr>
          </thead>
          <tbody>
            ${t.map(a=>r`
              <tr class="objects-table-row" @click=${()=>this._showObject(a.entry_id)}>
                ${i.map(o=>this._renderObjectCell(o,a,e))}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `}_renderObjectCell(t,e,i){let a=e.object;switch(t){case"name":return r`<td class="oc-name">
          <span class="objects-table-name">${a.name}</span>
          ${a.document_count?r`<span class="doc-badge" title="${a.document_count} ${s("documents",i)}">
                <ha-icon icon="mdi:paperclip"></ha-icon>${a.document_count}
              </span>`:d}
        </td>`;case"manufacturer":return r`<td class="oc-manufacturer">${a.manufacturer||"\u2014"}</td>`;case"model":return r`<td class="oc-model">${a.model||"\u2014"}</td>`;case"serial_number":return r`<td class="oc-serial_number">${a.serial_number||"\u2014"}</td>`;case"installation_date":return r`<td class="oc-installation_date">${a.installation_date?q(a.installation_date,i):"\u2014"}</td>`;case"warranty_expiry":return r`<td class="oc-warranty_expiry">${this._renderWarrantyCell(a.warranty_expiry,i)}</td>`;case"area_id":{let o=a.area_id?this.hass?.areas?.[a.area_id]?.name||a.area_id:"\u2014";return r`<td class="oc-area_id">${o}</td>`}case"documentation_url":{let o=(a.manual_docs||[])[0];return r`<td class="oc-documentation_url">${X(a.documentation_url)?r`<a href=${a.documentation_url} target="_blank" rel="noopener noreferrer"
                @click=${p=>p.stopPropagation()}><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:o?r`<a href="#" title=${o.title}
                  @click=${p=>{p.preventDefault(),p.stopPropagation(),this._openManualDoc(o)}}
                  ><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:"\u2014"}</td>`}case"notes":return r`<td class="oc-notes" title=${a.notes||""}>${a.notes||"\u2014"}</td>`;case"task_count":return r`<td class="oc-task_count">${e.tasks.length}</td>`;case"actions":return r`<td class="oc-actions">
          <mwc-icon-button title="${s("qr_code",i)}" @click=${o=>{o.stopPropagation(),this._openQrForObject(e.entry_id,a.name)}}>
            <ha-icon icon="mdi:qrcode"></ha-icon>
          </mwc-icon-button>
        </td>`;default:return r`<td></td>`}}_renderWarrantyCell(t,e){let i=ne(t);return i.kind==="none"?r`<span class="warranty-none">—</span>`:r`<span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,t,e)}</span>`}async _onSettingsChanged(){await this._loadData()}_renderGroupsSection(){if(!this._features.groups)return d;let t=Object.entries(this._groups),e=this._lang;return r`
      <div class="groups-section">
        <div class="groups-header">
          <h3>${s("groups",e)}</h3>
          <ha-button appearance="plain" @click=${()=>this._openGroupCreate()}>
            ${s("new_group",e)}
          </ha-button>
        </div>
        ${t.length===0?r`<div class="hint">${s("no_groups",e)}</div>`:r`
            <div class="groups-grid">
              ${t.map(([i,a])=>{let o=a.task_refs.map(p=>this._getTask(p.entry_id,p.task_id)?.name).filter(Boolean);return r`
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
                    ${a.description?r`<div class="group-card-desc">${a.description}</div>`:d}
                    <div class="group-card-tasks">
                      ${o.length>0?o.map(p=>r`<span class="group-task-chip">${p}</span>`):r`<span style="font-size:12px;color:var(--secondary-text-color)">${s("no_tasks_short",e)}</span>`}
                    </div>
                  </div>
                `})}
            </div>
          `}
      </div>
    `}_openGroupCreate(){this.shadowRoot.querySelector("maintenance-group-dialog")?.openCreate()}_openGroupEdit(t){let e=this._groups[t];e&&this.shadowRoot.querySelector("maintenance-group-dialog")?.openEdit(t,e)}async _deleteGroup(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");(i?await i.confirm({title:s("delete_group",this._lang),message:s("delete_group_confirm",this._lang).replace("{name}",e),confirmText:s("delete",this._lang)}):confirm(`${s("delete_group_confirm",this._lang).replace("{name}",e)}`))&&await this._runAction({type:"maintenance_supporter/group/delete",group_id:t})}_renderBudgetTiles(){let t=this._budget;if(!t)return d;let e=this._lang,i=this._currencySymbol,a=(o,p,l)=>{if(l!==null){let h=Math.min(100,Math.max(0,p/l*100)),g=h>=100?"var(--error-color, #f44336)":h>=t.alert_threshold_pct?"var(--warning-color, #ff9800)":"var(--success-color, #4caf50)";return r`
          <div class="stat-item budget-tile" title="${o}: ${U(p,e,2)} / ${B(l,i,e)}">
            <span class="stat-value budget-tile-value">${B(p,i,e)}</span>
            <span class="budget-tile-max">/ ${B(l,i,e,0)}</span>
            <div class="budget-tile-bar"><div style="width:${h}%; background:${g}"></div></div>
            <span class="stat-label">${o}</span>
          </div>
        `}return r`
        <div class="stat-item budget-tile" title="${o}: ${B(p,i,e)}">
          <span class="stat-value budget-tile-value">${B(p,i,e)}</span>
          <span class="stat-label">${o}</span>
        </div>
      `};return r`
      ${a(s("budget_monthly",e),t.monthly_spent||0,t.monthly_budget>0?t.monthly_budget:null)}
      ${a(s("budget_yearly",e),t.yearly_spent||0,t.yearly_budget>0?t.yearly_budget:null)}
    `}_renderOverviewRow(t){let e=this._lang,i=t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0,a=0,o=Lt.ok,p=!1;if(i&&t.days_until_due!==null){let _=Ut(t.interval_days,t.days_until_due,t.interval_unit);a=_.pct,p=_.overflow,t.status==="overdue"?o=Lt.overdue:t.status==="due_soon"&&(o=Lt.due_soon)}let l=t.area_id?this.hass?.areas?.[t.area_id]?.name:null,h=t.responsible_user_id?this._userService?.getUserName(t.responsible_user_id):null,g=t.group_names.length>0||l||h,v=this._bulkMode&&this._bulkSelected.has(this._bulkKey(t));return r`
      <div class="task-row${t.enabled?"":" task-disabled"}${v?" bulk-selected":""}${this._splitActive()&&t.entry_id===this._selectedEntryId&&t.task_id===this._selectedTaskId?" selected":""}">
        ${this._bulkMode?r`
          <label class="cell bulk-check" @click=${_=>_.stopPropagation()}>
            <input type="checkbox" .checked=${v} @change=${()=>this._toggleBulkRow(t)} />
          </label>
        `:d}
        <span class="cell-badges">
          ${this._statusBadge(!!t.archived,t.is_done,t.status)}
          ${t.enabled?d:r`<span class="badge-disabled">${s("disabled",e)}</span>`}
          ${t.nfc_tag_id?r`<span class="nfc-badge" title="${s("nfc_linked",e)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:d}
          ${t.priority==="high"?r`<span class="priority-badge priority-high" title="${s("priority_high",e)}"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>`:d}
          ${t.priority==="low"?r`<span class="priority-badge priority-low" title="${s("priority_low",e)}"><ha-icon icon="mdi:chevron-double-down"></ha-icon></span>`:d}
        </span>
        <span class="row-head">
          <span class="cell object-name" @click=${_=>{_.stopPropagation(),this._showObject(t.entry_id)}}>${t.object_name}</span>
          <span class="cell task-name" @click=${()=>this._showTask(t.entry_id,t.task_id)}>${t.task_name}</span>
        </span>
        <span class="task-sub${g?"":" task-sub-empty"}">
          ${t.group_names.length>0?r`
            <span class="sub-chip" title="${s("groups",e)}">
              <ha-icon icon="mdi:folder-outline"></ha-icon>${t.group_names.join(", ")}
            </span>`:d}
          ${l?r`
            <span class="sub-chip">
              <ha-icon icon="mdi:map-marker-outline"></ha-icon>${l}
            </span>`:d}
          ${h?r`
            <span class="sub-chip" title="${s("responsible_user",e)}">
              <ha-icon icon="mdi:account-outline"></ha-icon>${h}
            </span>`:d}
          ${(t.labels||[]).map(_=>r`
            <span class="sub-chip label-chip" title="${s("labels",e)}">
              <ha-icon icon="mdi:tag-outline"></ha-icon>${_}
            </span>`)}
        </span>
        <span class="cell type">${s(t.type,e)}</span>
        <span class="due-cell" @click=${()=>this._showTask(t.entry_id,t.task_id)}>
          <span class="due-text">${yt(t.days_until_due,e)}</span>
          ${i?r`<div class="days-bar"><div class="days-bar-fill${p?" overflow":""}" style="width:${a}%;background:${o}"></div></div>`:d}
          ${t.trigger_config?de(t,{trend:ce(t,this._miniStatsData),lang:e}):!i&&t.trigger_active?r`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:d}
          ${pe(t,this._miniStatsData,this._lang)}
        </span>
        ${this._renderRowActions(e,()=>this._openCompleteDialogForRow(t),()=>this._promptSkipTask(t.entry_id,t.task_id),t.allow_skip)}
      </div>
    `}_actionStyle(){return this._rowActionStyle}async _dismissRowActionNotice(t){let e={row_action_notice_pending:!1};t&&(e.row_action_style="icons");try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/global/update",settings:e}),this._rowActionNotice=!1,t&&(this._rowActionStyle="icons")}catch(i){console.warn("[maintenance-supporter] row-action notice update failed",i)}}_renderRowActions(t,e,i,a=!0){let o=this._actionStyle();return o==="buttons"||o==="buttons_compact"?o==="buttons_compact"&&(this.narrow||this.tight)?r`
          <span class="row-actions as-buttons compact">
            <ha-button size="small" appearance="accent" variant="success" title="${s("complete",t)}" aria-label="${s("complete",t)}" @click=${l=>{l.stopPropagation(),e()}}>
              <ha-icon icon="mdi:check"></ha-icon>
            </ha-button>
            ${a?r`
              <ha-button size="small" appearance="outlined" variant="warning" title="${s("skip",t)}" aria-label="${s("skip",t)}" ?disabled=${this._actionLoading} @click=${l=>{l.stopPropagation(),i()}}>
                <ha-icon icon="mdi:skip-next"></ha-icon>
              </ha-button>`:d}
          </span>`:r`
        <span class="row-actions as-buttons">
          <ha-button size="small" appearance="accent" variant="success" title="${s("complete",t)}" @click=${l=>{l.stopPropagation(),e()}}>
            <ha-icon slot="start" icon="mdi:check"></ha-icon>${s("complete",t)}
          </ha-button>
          ${a?r`
            <ha-button size="small" appearance="outlined" variant="warning" title="${s("skip",t)}" ?disabled=${this._actionLoading} @click=${l=>{l.stopPropagation(),i()}}>
              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>${s("skip",t)}
            </ha-button>`:d}
        </span>`:r`
      <span class="row-actions">
        <mwc-icon-button class="btn-complete" title="${s("complete",t)}" @click=${p=>{p.stopPropagation(),e()}}>
          <ha-icon icon="mdi:check"></ha-icon>
        </mwc-icon-button>
        ${a?r`
          <mwc-icon-button class="btn-skip" title="${s("skip",t)}" .disabled=${this._actionLoading} @click=${p=>{p.stopPropagation(),i()}}>
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </mwc-icon-button>`:d}
      </span>`}_openCompleteDialogForRow(t){let i=this._objects.find(a=>a.entry_id===t.entry_id)?.tasks.find(a=>a.id===t.task_id);this._openCompleteDialog(t.entry_id,t.task_id,t.task_name,this._features.checklists?i?.checklist:void 0,this._features.adaptive&&!!i?.adaptive_config?.enabled)}_renderObjectDetail(){if(!this._selectedEntryId)return d;let t=this._getObject(this._selectedEntryId);if(!t)return r`<p>Object not found.</p>`;let e=t.object,i=this._lang,a=this._isOperator,o=t.tasks.filter(l=>l.archived).length,p=t.tasks.filter(l=>this._showArchived||!l.archived);return r`
      <div class="detail-section">
        <div class="detail-header">
          <h2>${e.name}</h2>
          <div class="action-buttons">
            ${a?d:r`
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(l=>l?.openCreate(t.entry_id))}}>${s("add_task",i)}</ha-button>
              <ha-button appearance="plain" @click=${()=>{this._ui("maintenance-object-dialog").then(l=>l?.openEdit(t.entry_id,e))}}>${s("edit",i)}</ha-button>
            `}
            <div class="more-menu-wrapper">
              <ha-icon-button .disabled=${this._actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${()=>this._toggleObjMenu()}></ha-icon-button>
              ${this._objMenuOpen?r`
                <div class="popup-menu" @click=${l=>l.stopPropagation()}>
                  <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._openQrForObject(t.entry_id,e.name)}}>${s("qr_code",i)}</div>
                  <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._printObjectReport(t.entry_id)}}>${s("report_button",i)}</div>
                  ${a?d:r`
                    <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._duplicateObject(t.entry_id)}}>${s("duplicate",i)}</div>
                    ${e.archived?d:r`
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
        ${e.paused?r`<p class="meta paused-meta">
              <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
              ${s("object_paused_badge",i)}${e.paused_until?r` — ${s("paused_until_label",i)} ${q(e.paused_until,i)}`:d}
            </p>`:d}
        ${e.manufacturer||e.model?r`<p class="meta">${[e.manufacturer,e.model].filter(Boolean).join(" ")}</p>`:d}
        ${e.serial_number?r`<p class="meta">${s("serial_number_label",i)}: ${e.serial_number}</p>`:d}
        ${X(e.documentation_url)?r`<p class="meta">${s("documentation_url_label",i)}:
              <a href=${e.documentation_url} target="_blank" rel="noopener noreferrer">${e.documentation_url}</a>
            </p>`:(e.manual_docs||[]).length?r`<p class="meta">${s("documentation_url_label",i)}:
                ${e.manual_docs.slice(0,3).map((l,h)=>r`${h>0?" \xB7 ":""}<a href="#"
                    @click=${g=>{g.preventDefault(),this._openManualDoc(l)}}>${l.title}</a>`)}${e.manual_docs.length>3?r` … +${e.manual_docs.length-3}`:d}
              </p>`:d}
        ${e.installation_date?r`<p class="meta">${s("installed",i)}: ${q(e.installation_date,i)}</p>`:d}
        ${e.warranty_expiry?this._renderWarrantyMeta(e.warranty_expiry,i):d}
        ${e.notes?r`<div class="object-notes">
              <div class="object-notes-label">${s("object_notes_label",i)}</div>
              <div class="object-notes-body">${qt(e.notes)}</div>
            </div>`:d}

        <h3>${s("tasks",i)} (${p.length})${o>0?r`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            appearance="plain"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?s("hide_archived",i):`${s("show_archived",i)} (${o})`}
          </ha-button>`:d}</h3>
        ${t.tasks.length===0?r`<div class="empty-state-centered">
              <p class="empty">${s("no_tasks_yet",i)}</p>
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(l=>l?.openCreate(t.entry_id))}}>${s("add_first_task",i)}</ha-button>
            </div>`:r`<div class="task-table object-tasks">${[...p].sort((l,h)=>{let g={overdue:0,triggered:1,due_soon:2,ok:3};return(g[l.status]??9)-(g[h.status]??9)||(l.days_until_due??99999)-(h.days_until_due??99999)}).map(l=>r`
              <div class="task-row${l.enabled?"":" task-disabled"}">
                <span class="cell-badges">
                  ${this._statusBadge(!!l.archived,!!l.is_done,l.status)}
                  ${l.enabled?d:r`<span class="badge-disabled">${s("disabled",i)}</span>`}
                  ${l.nfc_tag_id?r`<span class="nfc-badge" title="${s("nfc_linked",i)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:d}
                  ${l.document_count?r`<span class="doc-badge" title="${l.document_count} ${s("documents",i)}"><ha-icon icon="mdi:paperclip"></ha-icon>${l.document_count}</span>`:d}
                </span>
                <span class="cell task-name" @click=${()=>this._showTask(t.entry_id,l.id)}>${l.name}</span>
                <span class="task-sub${l.responsible_user_id?"":" task-sub-empty"}">${he(l,h=>this._userService?.getUserName(h)??null)}</span>
                <span class="cell type">${s(l.type,i)}</span>
                <span class="due-cell" @click=${()=>this._showTask(t.entry_id,l.id)}>
                  <span class="due-text">${yt(l.days_until_due,i)}</span>
                  ${l.trigger_config?de(l,{trend:ce(l,this._miniStatsData),lang:i}):d}
                  ${pe(l,this._miniStatsData,this._lang)}
                </span>
                ${this._renderRowActions(i,()=>this._openCompleteDialog(t.entry_id,l.id,l.name,this._features.checklists?l.checklist:void 0,this._features.adaptive&&!!l.adaptive_config?.enabled),()=>this._promptSkipTask(t.entry_id,l.id),l.allow_skip)}
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
          .userName=${l=>this._userService?.getUserName(l)??null}
          @open-task=${l=>this._showTask(t.entry_id,l.detail.taskId)}
        ></maintenance-object-history-section>
      </div>
    `}_renderNewMenu(t){return r`
      <div class="new-menu-wrapper">
        <ha-button appearance="filled" class="new-menu-button"
          @click=${e=>{e.stopPropagation(),this._toggleNewMenu()}}>
          <ha-icon icon="mdi:plus"></ha-icon> ${s("add",t)}
          <ha-icon icon="mdi:menu-down"></ha-icon>
        </ha-button>
        ${this._newMenuOpen?r`
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
            ${this._batteryFleetSetupAvailable?r`
              <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._setupBatteryFleet()}}>
                <ha-icon icon="mdi:battery-sync"></ha-icon> ${s("battery_fleet_setup_button",t)}
              </div>
            `:d}
          </div>
        `:d}
      </div>
    `}_togglePopup(t,e){let i=!t();e(i),i&&setTimeout(()=>{let a=()=>{e(!1),document.removeEventListener("click",a)};document.addEventListener("click",a)},0)}_toggleNewMenu(){this._togglePopup(()=>this._newMenuOpen,t=>{this._newMenuOpen=t})}_closeNewMenu(){this._newMenuOpen=!1}_isYoungInstall(){let t=this._objects.filter(i=>!i.object?.battery_fleet),e=t.reduce((i,a)=>i+a.tasks.length,0);return t.length<3&&e<8}_gsDismissed(){try{return new Set(JSON.parse(it(P.gettingStartedDismissed)||"[]"))}catch{return new Set}}_dismissGettingStarted(t){let e=this._gsDismissed();e.add(t);try{Y(P.gettingStartedDismissed,JSON.stringify([...e]))}catch{}this.requestUpdate()}_maybeLoadGettingStarted(){this._gsLoaded||!this._isYoungInstall()||(this._gsLoaded=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/discover"}).then(t=>{this._gsSetupsCount=(t.setups||[]).length}).catch(()=>{this._gsSetupsCount=0}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/problem_sensors/discover"}).then(t=>{this._gsAdoptCount=(t.sensors||[]).length}).catch(()=>{this._gsAdoptCount=0}))}_renderGettingStartedChips(t){let e=this._gsDismissed(),i=this._isYoungInstall(),a=[];return i&&this._gsSetupsCount>0&&!e.has("setups")&&a.push({id:"setups",icon:"mdi:auto-fix",text:s("gs_setups_chip",t).replace("{n}",String(this._gsSetupsCount)),run:()=>this._openSuggestedSetups()}),i&&this._gsAdoptCount>0&&!e.has("adopt")&&a.push({id:"adopt",icon:"mdi:alert-circle-check-outline",text:s("gs_adopt_chip",t).replace("{n}",String(this._gsAdoptCount)),run:()=>this._openAdoptProblemSensors()}),this._batteryFleetSetupAvailable&&!e.has("fleet")&&a.push({id:"fleet",icon:"mdi:battery-sync",text:s("gs_fleet_chip",t),run:()=>this._setupBatteryFleet()}),a.length===0?d:r`
      <div class="gs-chips-wrap">
        <div class="gs-chips-label">${s("gs_label",t)}</div>
        <div class="gs-chips">
          ${a.map(o=>r`
            <div class="gs-chip" @click=${()=>o.run()}>
              <ha-icon icon="${o.icon}"></ha-icon>
              <span>${o.text}</span>
              <span class="gs-chip-x" title="${s("dismiss",t)}"
                @click=${p=>{p.stopPropagation(),this._dismissGettingStarted(o.id)}}>
                <ha-icon icon="mdi:close"></ha-icon>
              </span>
            </div>
          `)}
        </div>
      </div>
    `}_toggleObjMenu(){this._togglePopup(()=>this._objMenuOpen,t=>{this._objMenuOpen=t})}_closeObjMenu(){this._objMenuOpen=!1}_toggleMoreMenu(){this._togglePopup(()=>this._moreMenuOpen,t=>{this._moreMenuOpen=t})}_closeMoreMenu(){this._moreMenuOpen=!1}get _sparklineCtx(){return{lang:this._lang,detailStatsData:this._detailStatsData,hasStatsService:!!this._statsService,historyFallbackIds:this._statsService?.historyFallbackIds,isCounterEntity:t=>this._isCounterEntity(t),rangeDays:this._chartRangeDays,setRangeDays:t=>this._setChartRange(t),hideOutliers:this._hideOutliers,setHideOutliers:t=>this._setHideOutliers(t)}}_toggleSection(t){let e=new Set(this._collapsedSections);e.has(t)?e.delete(t):e.add(t),this._collapsedSections=e;try{Y(P.collapsedSections,JSON.stringify([...e]))}catch{}}_historyCtx(){let t=this._selectedEntryId&&this._selectedTaskId?this._getObject(this._selectedEntryId)?.tasks.find(o=>o.id===this._selectedTaskId):void 0,e=this._fullHistory,a=(e&&e.entryId===this._selectedEntryId&&e.taskId===this._selectedTaskId&&e.entries.length>(t?.history||[]).length?e.entries:t?.history||[]).filter(o=>o.reading_value!=null).sort((o,p)=>o.timestamp.localeCompare(p.timestamp));return{lang:this._lang,hass:this.hass,filter:this._historyFilter,search:this._historySearch,currencySymbol:this._currencySymbol,setFilter:o=>{this._historyFilter=o},setSearch:o=>{this._historySearch=o},openEdit:o=>this._openHistoryEdit(o),readingUnit:t?.reading_unit??null,phaseNames:Object.fromEntries(Object.entries(t?.phases||{}).map(([o,p])=>[o,p.name])),readingDelta:o=>{let p=a.findIndex(l=>l.timestamp===o.timestamp);return p<=0?null:o.reading_value-a[p-1].reading_value}}}_taskDetailCtx(){let t=this._selectedEntryId,e=this._selectedTaskId,i=this._getObject(t);return{lang:this._lang,hass:this.hass,entryId:t,taskId:e,objectName:i?.object.name||"",objectDocUrl:i?.object?.documentation_url??null,objectManualDocs:i?.object?.manual_docs??[],openManualDoc:a=>this._openManualDoc(a),setChecklistItem:(a,o)=>this._setChecklistItem(t,e,a,o),setPhaseCursor:a=>{this._runAction({type:"maintenance_supporter/task/set_phase",entry_id:t,task_id:e,cursor:a})},isOperator:this._isOperator,actionLoading:this._actionLoading,moreMenuOpen:this._moreMenuOpen,activeTab:this._activeTab,features:this._features,currencySymbol:this._currencySymbol,collapsedSections:this._collapsedSections,costDurationToggle:this._costDurationToggle,suggestionDismissed:this._dismissedSuggestions.has(`${t}_${e}`),sparkline:this._sparklineCtx,history:this._historyCtx(),getUserName:a=>this._userService?.getUserName(a)??null,setActiveTab:a=>{this._activeTab=a},toggleSection:a=>this._toggleSection(a),setCostDurationToggle:a=>{this._costDurationToggle=a},showTaskView:()=>{this._view="task"},showObject:()=>this._showObject(t),toggleMoreMenu:()=>this._toggleMoreMenu(),closeMoreMenu:()=>this._closeMoreMenu(),openEdit:a=>{this._ui("maintenance-task-dialog").then(o=>o?.openEdit(t,a))},openComplete:a=>this._openCompleteDialog(t,e,a.name,this._features.checklists?a.checklist:void 0,this._features.adaptive&&!!a.adaptive_config?.enabled),promptSkip:()=>this._promptSkipTask(t,e),toggleArchive:a=>this._toggleArchiveTask(t,e,a),openQr:a=>this._openQrForTask(t,e,i?.object.name||"",a),duplicateTask:()=>this._duplicateTask(t,e),promptReset:()=>this._promptResetTask(t,e),promptPostpone:()=>this._promptPostponeTask(t,e),snoozeTask:()=>this._snoozeTask(t,e),printWorksheet:()=>this._printTaskWorksheet(t,e),deleteTask:()=>this._deleteTask(t,e),applySuggestion:a=>this._applySuggestion(t,e,a),reanalyze:()=>this._reanalyzeInterval(t,e),dismissSuggestion:()=>this._dismissSuggestion(t,e),openSeasonalOverrides:a=>this._openSeasonalOverrides(a)}}async _fetchFullHistory(t,e){try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:t,task_id:e});this._selectedEntryId===t&&this._selectedTaskId===e&&(this._fullHistory={entryId:t,taskId:e,entries:i.history||[]})}catch{this._fullHistory=null}}_renderTaskDetail(){if(!this._selectedEntryId||!this._selectedTaskId)return d;let t=this._getTask(this._selectedEntryId,this._selectedTaskId);if(!t)return r`<p>Task not found.</p>`;let e=this._fullHistory,i=e&&e.entryId===this._selectedEntryId&&e.taskId===this._selectedTaskId&&e.entries.length>(t.history||[]).length?{...t,history:e.entries}:t;return r`<maintenance-task-detail-view
      .task=${i}
      .ctx=${this._taskDetailCtx()}
    ></maintenance-task-detail-view>`}_openHistoryEdit(t){if(!this._selectedEntryId||!this._selectedTaskId)return;let e={entry_id:this._selectedEntryId,task_id:this._selectedTaskId,original_timestamp:t.timestamp,type:t.type,timestamp:t.timestamp,notes:t.notes??null,cost:t.cost??null,duration:t.duration??null,completed_by:t.completed_by??null,used_parts:t.used_parts??null};this.shadowRoot?.querySelector("maintenance-history-edit-dialog")?.openEdit(e)}};x.styles=[Bt,Ue],u([k({attribute:!1})],x.prototype,"hass",2),u([k({type:Boolean,reflect:!0})],x.prototype,"narrow",2),u([k({type:Boolean,reflect:!0})],x.prototype,"tight",2),u([k({type:Boolean,reflect:!0})],x.prototype,"split",2),u([k({attribute:!1})],x.prototype,"panel",2),u([m()],x.prototype,"_objects",2),u([m()],x.prototype,"_stats",2),u([m()],x.prototype,"_view",2),u([m()],x.prototype,"_allParts",2),u([m()],x.prototype,"_selectedEntryId",2),u([m()],x.prototype,"_selectedTaskId",2),u([m()],x.prototype,"_filterStatus",2),u([m()],x.prototype,"_filterUser",2),u([m()],x.prototype,"_filterLabel",2),u([m()],x.prototype,"_filterPriority",2),u([m()],x.prototype,"_savedViews",2),u([m()],x.prototype,"_activeViewId",2),u([m()],x.prototype,"_unsub",2),u([m()],x.prototype,"_chartRangeDays",2),u([m()],x.prototype,"_hideOutliers",2),u([m()],x.prototype,"_historyFilter",2),u([m()],x.prototype,"_budget",2),u([m()],x.prototype,"_groups",2),u([m()],x.prototype,"_detailStatsData",2),u([m()],x.prototype,"_miniStatsData",2),u([m()],x.prototype,"_features",2),u([m()],x.prototype,"_adminPanelUserIds",2),u([m()],x.prototype,"_operatorWriteEnabled",2),u([m()],x.prototype,"_defaultWarningDays",2),u([m()],x.prototype,"_rowActionStyle",2),u([m()],x.prototype,"_rowActionNotice",2),u([m()],x.prototype,"_actionLoading",2),u([m()],x.prototype,"_moreMenuOpen",2),u([m()],x.prototype,"_objMenuOpen",2),u([m()],x.prototype,"_toastMessage",2),u([m()],x.prototype,"_toastUndo",2),u([m()],x.prototype,"_toastActionLabel",2),u([m()],x.prototype,"_filtersOpen",2),u([m()],x.prototype,"_newMenuOpen",2),u([m()],x.prototype,"_gsSetupsCount",2),u([m()],x.prototype,"_gsAdoptCount",2),u([m()],x.prototype,"_batteryFleetSetupAvailable",2),u([m()],x.prototype,"_staleBundle",2),u([m()],x.prototype,"_overviewTab",2),u([m()],x.prototype,"_activeTab",2),u([m()],x.prototype,"_costDurationToggle",2),u([m()],x.prototype,"_historySearch",2),u([m()],x.prototype,"_sortMode",2),u([m()],x.prototype,"_objectSortMode",2),u([m()],x.prototype,"_groupByMode",2),u([m()],x.prototype,"_objectViewMode",2),u([m()],x.prototype,"_objectsTableColumns",2),u([m()],x.prototype,"_showArchived",2),u([m()],x.prototype,"_bulkMode",2),u([m()],x.prototype,"_bulkSelected",2),u([m()],x.prototype,"_virtStart",2),u([m()],x.prototype,"_virtEnd",2),u([m()],x.prototype,"_collapsedGroups",2),u([m()],x.prototype,"_collapsedSections",2),u([m()],x.prototype,"_paletteOpen",2),u([m()],x.prototype,"_paletteQuery",2),u([m()],x.prototype,"_paletteActive",2),u([m()],x.prototype,"_templateGalleryOpen",2),u([m()],x.prototype,"_templates",2),u([m()],x.prototype,"_templateCategories",2),u([m()],x.prototype,"_templateBusy",2),u([m()],x.prototype,"_fullHistory",2),x=u([me("maintenance-supporter-panel")],x);export{x as MaintenanceSupporterPanel};
