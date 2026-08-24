/*! maintenance_supporter frontend 2.63.1 */
import{a as le,b as It,c as _t,d as Pt,e as Yt,f as ce,g as de,h as pe}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-FU3XFEHD.js";import{a as N,b as Ft,c as ge,d as _e,e as me,f as ve,g as be,h as fe,i as ye,j as xe,o as $e,r as we}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-VXCX6IAO.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-ALK3CDDX.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-C6EDVDM4.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-4KTXJBBZ.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-HA5JV6QL.js";import{b as Gt,c as he}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-7CRSKNCV.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-Q3GW6K35.js";import{a as Wt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-IMKP65C5.js";import{a as ue}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BBM5E3UT.js";import{a as T}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LS7YQ43S.js";import{A as Tt,B as ne,C as Lt,a as u,b as C,c as r,d as I,f as d,g as D,h as qt,i as ae,j as re,k as w,l as _,m as Dt,n as Ot,o as Rt,p as s,q as At,r as z,s as oe,t as Y,u as G,v as zt,w as gt,z as jt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-PFF7S5UN.js";var Ve=["assignee_pool","required_completion_fields","checklist","labels","history"],qe=["checklist_progress"],We=["tasks","parts"],Ye=["manual_docs","battery_fleet_excluded"];function Kt(o,l,t=[]){for(let e of l)o[e]===void 0&&(o[e]=[]);for(let e of t)o[e]===void 0&&(o[e]={})}function Ge(o){let l=o;Kt(l,We),l.object&&typeof l.object=="object"&&Kt(l.object,Ye);for(let t of l.tasks)Kt(t,Ve,qe);return o}function St(o){for(let l of o)Ge(l);return o}function Ke(o,l){if(l.objects)return l.objects;let t=l.delta||[],e=l.removed||[];if(!t.length&&!e.length)return null;let i=new Map(o.map(a=>[a.entry_id,a]));for(let a of t)i.set(a.entry_id,a);for(let a of e)i.delete(a);return[...i.values()]}function ke(o,l){return l.objects&&St(l.objects),l.delta&&St(l.delta),Ke(o,l)}var R={overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort"};function K(o){try{return localStorage.getItem(o)}catch{return null}}function B(o,l){try{localStorage.setItem(o,l)}catch{}}var Qe=168*3600*1e3;function je(){try{let o=K(R.objectsCache);if(!o)return null;let l=JSON.parse(o);return l.v!==qt||!Number.isFinite(l.at)||Date.now()-l.at>Qe||!Array.isArray(l.objects)||l.objects.length===0?null:{objects:l.objects,stats:l.stats??null}}catch{return null}}function Qt(o,l){if(!(!Array.isArray(o)||o.length===0))try{let t={v:qt,at:Date.now(),objects:o,stats:l};B(R.objectsCache,JSON.stringify(t))}catch{}}function O(o){return String(o??"").replace(/[&<>"']/g,l=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[l])}function Te(o,l,t,e,i,a){let n=[[t.manufacturer,o.manufacturer],[t.model,o.model],[t.serial,o.serial_number],[t.installed,o.installation_date?e(o.installation_date):null],[t.warranty,o.warranty_expiry?e(o.warranty_expiry):null]].filter(([,p])=>!!p),h=l.map(p=>{let g=t.scheduleLabel(p);return`<tr>
      <td>${O(p.name)}</td>
      <td>${O(t.typeLabel(p.type))}</td>
      <td>${O(t.statusLabel(p.status))}</td>
      <td>${O(g)}</td>
      <td>${O(p.last_performed?e(p.last_performed):t.none)}</td>
      <td>${O(p.next_due?e(p.next_due):t.none)}</td>
      <td class="num">${p.times_performed??0}</td>
      <td class="num">${(p.total_cost??0).toFixed(2)} ${O(i)}</td>
    </tr>`}).join(""),c=l.reduce((p,g)=>p+(g.total_cost??0),0);return`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${O(t.title)} \u2014 ${O(o.name)}</title>
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
  <h1>${O(o.name)}</h1>
  <p class="sub">${O(t.title)} \xB7 ${O(t.generated)}: ${O(e(a))}</p>
  ${n.length?`<div class="meta">${n.map(([p,g])=>`<div><div class="k">${O(p)}</div>${O(g)}</div>`).join("")}</div>`:""}
  <h2>${O(t.tasksHeading)} (${l.length})</h2>
  <table>
    <thead><tr>
      <th>${O(t.colTask)}</th><th>${O(t.colType)}</th><th>${O(t.colStatus)}</th>
      <th>${O(t.colSchedule)}</th><th>${O(t.colLastDone)}</th><th>${O(t.colNextDue)}</th>
      <th class="num">${O(t.colTimes)}</th><th class="num">${O(t.colCost)}</th>
    </tr></thead>
    <tbody>${h||`<tr><td colspan="8">${O(t.none)}</td></tr>`}</tbody>
    <tfoot><tr><td colspan="7">${O(t.totalCost)}</td><td class="num">${c.toFixed(2)} ${O(i)}</td></tr></tfoot>
  </table>
  ${o.notes?`<div class="notes"><strong>${O(t.notes)}:</strong>
${O(o.notes)}</div>`:""}
</body></html>`}function Zt(o,l=new Date){if(!o)return{kind:"none",days:null,date:null};let t=new Date(`${o}T00:00:00`);if(isNaN(t.getTime()))return{kind:"none",days:null,date:null};let e=Date.UTC(l.getFullYear(),l.getMonth(),l.getDate()),i=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),a=Math.round((i-e)/864e5);return a<0?{kind:"expired",days:a,date:o}:a<=60?{kind:"expiring",days:a,date:o}:{kind:"valid",days:a,date:o}}var A=o=>String(o??"").replace(/[&<>"']/g,l=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[l]);function Se(o,l,t,e,i,a,n,h,c,p=[]){let g=[[t.object,A(l)],[t.type,A(t.typeLabel(o.type))],[t.interval,A(i(o))],[t.nextDue,o.next_due?A(e(o.next_due)):"\u2014"],[t.lastDone,o.last_performed?A(e(o.last_performed)):A(t.never)]];o.priority&&o.priority!=="normal"&&g.push([t.priority,A(o.priority)]);let m=(o.checklist||[]).map(x=>`<li><span class="box"></span>${A(x)}</li>`).join(""),v=(x,$)=>x?`<figure class="qr"><img src="${x}" alt="" /><figcaption>${A($)}</figcaption></figure>`:"";return`<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="color-scheme" content="light">
<title>${A(o.name)} \u2014 ${A(t.title)}</title>
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
      <h1>${A(o.name)}</h1>
      <div class="obj">${A(l)}</div>
    </div>
    <div class="qr-row">
      ${v(a,t.scanView)}
      ${v(n,t.scanComplete)}
    </div>
  </header>
  <table class="meta">
    ${g.map(([x,$])=>`<tr><td>${A(x)}</td><td>${$}</td></tr>`).join("")}
  </table>
  ${m?`<h2>${A(t.checklist)}</h2><ul class="check">${m}</ul>`:""}
  ${p.length?`<h2>${A(t.parts)}</h2><ul class="check">${p.map(x=>`<li><span class="box"></span>${A(x)}</li>`).join("")}</ul>`:""}
  ${o.notes?`<h2>${A(t.notes)}</h2><div class="notes">${A(o.notes)}</div>`:""}
  ${h?`<h2>${A(t.manualExcerpt)}</h2>
    <div class="excerpt">${A(h.title)} \u2014 ${A(t.pages)} ${h.startPage}\u2013${h.endPage}:
      <a href="${A(h.url)}" target="_blank" rel="noopener">PDF</a>
    </div>
    <div id="excerpt-pages" class="excerpt-pages"></div>
    ${h.vendorBase?`<script type="module">
      // Render the excerpt pages inline (downscaled, two per row) so the
      // whole work sheet prints as ONE document. The link above stays as
      // the fallback if pdf.js or the fetch fails.
      try {
        const pdfjs = await import(${JSON.stringify(h.vendorBase+"/pdf.min.mjs")});
        pdfjs.GlobalWorkerOptions.workerSrc = ${JSON.stringify(h.vendorBase+"/pdf.worker.min.mjs")};
        const doc = await pdfjs.getDocument({ url: ${JSON.stringify(h.url)} }).promise;
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
  <footer>${A(l)} \xB7 ${A(o.name)} \xB7 ${A(t.printedOn)} ${A(c.slice(0,10))}</footer>
</body></html>`}var Ee=C`
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
`;var Ht=class{constructor(l){this._cache=new Map;this._pending=new Map;this._hass=l}updateHass(l){this._hass=l}async getDetailStats(l,t,e=30){return this._getStats(l,e<=35?"hour":"day",e,t)}async getMiniStats(l,t){return this._getStats(l,"day",14,t)}async getBatchMiniStats(l){let t=new Map,e=[];for(let c of l){let p=`${c.entityId}:day:14`,g=this._cache.get(p);g&&Date.now()-g.fetchedAt<3e5?t.set(c.entityId,g.points):e.push(c)}if(e.length===0)return t;let i=e.filter(c=>c.isCounter).map(c=>c.entityId),a=e.filter(c=>!c.isCounter).map(c=>c.entityId),n=new Date(Date.now()-336*60*60*1e3).toISOString(),h=[];return i.length>0&&h.push(this._fetchBatch(i,"day",n,["state","sum","change"],!0,t)),a.length>0&&h.push(this._fetchBatch(a,"day",n,["mean","min","max"],!1,t)),await Promise.all(h),t}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(l,t,e,i){let a=`${l}:${t}:${e}`,n=this._cache.get(a);if(n&&Date.now()-n.fetchedAt<3e5)return n.points;if(this._pending.has(a))return this._pending.get(a);let h=this._fetchAndNormalize(l,t,e,i,a);this._pending.set(a,h);try{return await h}finally{this._pending.delete(a)}}async _fetchAndNormalize(l,t,e,i,a){let n=new Date(Date.now()-e*24*60*60*1e3).toISOString(),h=i?["state","sum","change"]:["mean","min","max"];try{let p=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:n,statistic_ids:[l],period:t,types:h}))[l]||[],g=this._normalizeRows(p,i);return this._cache.set(a,{entityId:l,fetchedAt:Date.now(),period:t,points:g}),g}catch(c){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${l}:`,c),[]}}async _fetchBatch(l,t,e,i,a,n){try{let h=await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:e,statistic_ids:l,period:t,types:i});for(let c of l){let p=h[c]||[],g=this._normalizeRows(p,a);n.set(c,g),this._cache.set(`${c}:${t}:14`,{entityId:c,fetchedAt:Date.now(),period:t,points:g})}}catch(h){console.warn("[maintenance-supporter] Batch statistics fetch failed:",h)}}_normalizeRows(l,t){let e=[];for(let i of l){let a=null;if(t?a=i.state??null:a=i.mean??null,a===null)continue;let n={ts:i.start,val:a};t||(i.min!=null&&(n.min=i.min),i.max!=null&&(n.max=i.max)),e.push(n)}return e.sort((i,a)=>i.ts-a.ts),e}};function lt(o){let l=o??0;return l<1024?`${l} B`:l<1024*1024?`${(l/1024).toFixed(1)} KB`:`${(l/(1024*1024)).toFixed(1)} MB`}var yt=["manual","warranty","invoice","spare_parts","photo","other"],Bt={manual:"mdi:book-open-variant",warranty:"mdi:shield-check",invoice:"mdi:receipt-text-outline",spare_parts:"mdi:cog-outline",photo:"mdi:image-outline",other:"mdi:file-document-outline"};function mt(o){return o.title||o.filename||o.url||""}var L=class extends D{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._hint="";this._addingLink=!1;this._linkUrl="";this._linkTitle="";this._category="manual";this._thumbs={};this._lightboxUrl="";this._editingId="";this._editTitle="";this._editCategory="manual";this._dragOver=!1;this._loadedFor=null;this._localeReady=!1}_isImage(t){return t.kind==="file"&&(t.mime||"").startsWith("image/")}async _sign(t){return It(this.hass,t.id)}get _lang(){return z(this.hass)}updated(t){super.updated(t),this.hass&&!this._localeReady&&(this._localeReady=!0,Y(this._lang).then(()=>this.requestUpdate())),this.hass&&this.entryId&&this._loadedFor!==this.entryId&&(this._loadedFor=this.entryId,this._load())}async _load(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId});this._docs=t.documents||[],this._loaded=!0,this._error="",this._thumbs={},this._loadThumbs()}catch(t){this._error=T(t,this._lang),this._loaded=!0}}async _loadThumbs(){await Promise.all(this._docs.filter(t=>this._isImage(t)).map(async t=>{try{let e=await this._sign(t);this._thumbs={...this._thumbs,[t.id]:e}}catch{}}))}_category_of(t){return(t.tags||[]).find(i=>yt.includes(i))||"other"}_labelKeydown(t){(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),t.currentTarget.querySelector("input")?.click())}_onFileInput(t){let e=t.target,i=Array.from(e.files??[]);i.length&&this._uploadFiles(i),e.value=""}_onCameraInput(t){let e=t.target,i=Array.from(e.files??[]);i.length&&this._uploadFiles(i,"photo"),e.value=""}_onDrop(t){if(t.preventDefault(),this._dragOver=!1,!this.canWrite||this._busy)return;let e=Array.from(t.dataTransfer?.files??[]);e.length&&this._uploadFiles(e)}_onDragOver(t){this.canWrite&&(t.preventDefault(),this._dragOver=!0)}_onDragLeave(t){let e=t.relatedTarget;(!e||!t.currentTarget.contains(e))&&(this._dragOver=!1)}async _uploadFiles(t,e){let i=e??this._category;this._busy=!0,this._error="",this._hint="";let a=0,n=0;try{for(let h of t){let c=new FormData;c.append("entry_id",this.entryId),c.append("tags",i),c.append("file",h,h.name);let p=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${this.hass.auth?.data?.access_token??""}`},body:c});if(!p.ok){this._error=p.status===413?s("doc_too_large",this._lang):s("doc_upload_failed",this._lang);continue}let g=await p.json();g.duplicate_in_object?n++:g.deduped&&a++}n?this._hint=s("doc_dup_in_object",this._lang):a&&(this._hint=s("doc_deduped",this._lang)),await this._load()}catch{this._error=s("doc_upload_failed",this._lang)}finally{this._busy=!1}}async _download(t){try{await Pt(this.hass,t.id,t.filename||t.title||"document")}catch(e){this._error=T(e,this._lang)}}async _preview(t){if(this._isImage(t)){this._lightboxUrl=this._thumbs[t.id]||await this._sign(t);return}try{await _t(this.hass,t.id)}catch(e){this._error=T(e,this._lang)}}_openDoc(t){t.kind==="file"?this._preview(t):N(t.url)&&window.open(t.url,"_blank","noopener")}_startEdit(t){this._editingId=t.id,this._editTitle=t.title||"",this._editCategory=this._category_of(t),this._addingLink=!1,this._error=""}_cancelEdit(){this._editingId=""}async _saveEdit(t){let e=(t.tags||[]).filter(a=>!yt.includes(a)),i=t.kind==="file"?[this._editCategory,...e]:t.tags??[];this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:t.id,title:this._editTitle.trim()||t.filename||t.url||"",tags:i}),this._editingId="",await this._load()}catch(a){this._error=T(a,this._lang)}finally{this._busy=!1}}async _delete(t){let e=mt(t);if(window.confirm(s("doc_delete_confirm",this._lang).replace("{name}",e))){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/delete",doc_id:t.id}),await this._load()}catch(i){this._error=T(i,this._lang)}finally{this._busy=!1}}}async _addLink(){let t=this._linkUrl.trim();if(t){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/add_link",entry_id:this.entryId,url:t,title:this._linkTitle.trim()||null}),this._linkUrl="",this._linkTitle="",this._addingLink=!1,await this._load()}catch(e){this._error=T(e,this._lang,s("doc_link_invalid",this._lang))}finally{this._busy=!1}}}render(){let t=this._lang;return r`
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
                  ${yt.map(e=>r`<option value=${e}>${s(`doc_cat_${e}`,t)}</option>`)}
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
    `}_renderDoc(t,e){if(this._editingId===t.id)return this._renderEdit(t,e);let i=t.kind==="file",a=this._category_of(t),n=i?`${s(`doc_cat_${a}`,e)} \xB7 ${lt(t.size)}`:s("doc_link_badge",e),h=this._thumbs[t.id];return r`
      <div class="doc-row">
        ${i&&h?r`<img
              class="doc-thumb"
              src=${h}
              alt=${t.title||""}
              title=${s("doc_open",e)}
              @click=${()=>this._preview(t)}
            />`:r`<ha-icon
              class="doc-icon ${i?"clickable":""}"
              icon=${i?Bt[a]:"mdi:link-variant"}
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
          <div class="doc-title">${mt(t)}</div>
          <div class="doc-meta">${n}</div>
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
                href=${N(t.url)?t.url:"#"}
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
              ${yt.map(a=>r`<option value=${a} ?selected=${a===this._editCategory}>${s(`doc_cat_${a}`,e)}</option>`)}
            </select>`:d}
        <button class="icon-btn" title=${s("save",e)} ?disabled=${this._busy||!this._editTitle.trim()} @click=${()=>this._saveEdit(t)}>
          <ha-icon icon="mdi:check"></ha-icon>
        </button>
        <button class="icon-btn" title=${s("cancel",e)} ?disabled=${this._busy} @click=${this._cancelEdit}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
    `}};L.styles=C`
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
  `,u([w({attribute:!1})],L.prototype,"hass",2),u([w({attribute:!1})],L.prototype,"entryId",2),u([w({type:Boolean})],L.prototype,"canWrite",2),u([_()],L.prototype,"_docs",2),u([_()],L.prototype,"_loaded",2),u([_()],L.prototype,"_busy",2),u([_()],L.prototype,"_error",2),u([_()],L.prototype,"_hint",2),u([_()],L.prototype,"_addingLink",2),u([_()],L.prototype,"_linkUrl",2),u([_()],L.prototype,"_linkTitle",2),u([_()],L.prototype,"_category",2),u([_()],L.prototype,"_thumbs",2),u([_()],L.prototype,"_lightboxUrl",2),u([_()],L.prototype,"_editingId",2),u([_()],L.prototype,"_editTitle",2),u([_()],L.prototype,"_editCategory",2),u([_()],L.prototype,"_dragOver",2);customElements.get("maintenance-documents-section")||customElements.define("maintenance-documents-section",L);var Q=class extends D{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._attachId="";this._loadedKey="";this._localeReady=!1}get _lang(){return z(this.hass)}get _refId(){return this.partId||this.taskId||""}get _linkField(){return this.partId?"part_ids":"task_ids"}updated(t){super.updated(t),this.hass&&!this._localeReady&&(this._localeReady=!0,Y(this._lang).then(()=>this.requestUpdate()));let e=`${this.entryId}|${this._refId}`;this.hass&&this.entryId&&this._refId&&this._loadedKey!==e&&(this._loadedKey=e,this._load())}async _load(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId});this._docs=t.documents||[],this._loaded=!0,this._error=""}catch(t){this._error=T(t,this._lang),this._loaded=!0}}_links(t){return t[this._linkField]||[]}_linked(){return this._docs.filter(t=>this._links(t).includes(this._refId))}_available(){return this._docs.filter(t=>!this._links(t).includes(this._refId))}async _setLinks(t,e){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:t.id,[this._linkField]:e}),await this._load()}catch(i){this._error=T(i,this._lang)}finally{this._busy=!1}}_link(){let t=this._docs.find(e=>e.id===this._attachId);t&&(this._attachId="",this._setLinks(t,[...this._links(t),this._refId]))}_unlink(t){this._setLinks(t,this._links(t).filter(e=>e!==this._refId))}_isPdf(t){return t.mime==="application/pdf"||(t.filename||"").toLowerCase().endsWith(".pdf")}_pageFor(t){return this._isPdf(t)&&this.taskId?t.task_pages?.[this.taskId]:void 0}async _open(t){if(t.kind==="weblink"){N(t.url)&&window.open(t.url,"_blank","noopener");return}let e=this._pageFor(t);try{await _t(this.hass,t.id,e?`#page=${e}`:"")}catch(i){this._error=T(i,this._lang)}}async _setPage(t,e){if(this.taskId){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:t.id,task_pages:{[this.taskId]:e}}),await this._load()}catch(i){this._error=T(i,this._lang)}finally{this._busy=!1}}}async _download(t){try{await Pt(this.hass,t.id,t.filename||t.title||"document")}catch(e){this._error=T(e,this._lang)}}render(){if(!this._loaded||this._docs.length===0)return d;let t=this._lang,e=this._linked(),i=this._available();return r`
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
                ${i.map(a=>r`<option value=${a.id} ?selected=${a.id===this._attachId}>${mt(a)}</option>`)}
              </select>
              <button class="tdoc-btn" ?disabled=${this._busy||!this._attachId} @click=${this._link}>
                <ha-icon icon="mdi:link-variant-plus"></ha-icon> ${s("doc_attach",t)}
              </button>
            </div>`:d}
      </div>
    `}_renderRow(t,e){let i=t.kind==="file",a=this._isPdf(t),n=this._pageFor(t),h=(t.tags||[]).find(p=>yt.includes(p))||"other",c=i?lt(t.size):s("doc_link_badge",e);return r`
      <div class="tdoc-row">
        <ha-icon class="tdoc-icon" icon=${i?Bt[h]:"mdi:link-variant"}></ha-icon>
        <div
          class="tdoc-info"
          role="button"
          tabindex="0"
          title=${n?`${s("doc_open",e)} \xB7 ${s("doc_page",e)} ${n}`:s("doc_open",e)}
          @click=${()=>this._open(t)}
          @keydown=${p=>{(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),this._open(t))}}
        >
          <div class="tdoc-title">${mt(t)}</div>
          <div class="tdoc-meta">
            ${c}${n?r` · <span class="tdoc-pagetag">${s("doc_page",e)} ${n}</span>`:d}
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
              .value=${n?String(n):""}
              ?disabled=${this._busy}
              @change=${p=>{let g=parseInt(p.target.value,10);this._setPage(t,Number.isFinite(g)&&g>=1?g:0)}}
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
    `}};Q.styles=C`
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
  `,u([w({attribute:!1})],Q.prototype,"hass",2),u([w({attribute:!1})],Q.prototype,"entryId",2),u([w({attribute:!1})],Q.prototype,"taskId",2),u([w({attribute:!1})],Q.prototype,"partId",2),u([w({type:Boolean})],Q.prototype,"canWrite",2),u([_()],Q.prototype,"_docs",2),u([_()],Q.prototype,"_loaded",2),u([_()],Q.prototype,"_busy",2),u([_()],Q.prototype,"_error",2),u([_()],Q.prototype,"_attachId",2);customElements.get("maintenance-task-documents")||customElements.define("maintenance-task-documents",Q);var Ze={name:"",vendor:"",mpn:"",gtin:"",storage_location:"",product_url:"",unit:"",cost:"",stock:"",reorder_threshold:"",restock_quantity:"",auto_buy_task:!0,notes:""},U=class extends D{constructor(){super(...arguments);this.parts=[];this.canWrite=!1;this.currencySymbol="\u20AC";this._editing=null;this._busy=!1;this._error="";this._restockFor=null;this._restockQty="";this._restockInvalid=!1;this._docsFor=null}get _lang(){return z(this.hass)}connectedCallback(){super.connectedCallback(),Y(this._lang).then(()=>this.requestUpdate())}_notifyChanged(){this.dispatchEvent(new CustomEvent("parts-changed",{bubbles:!0,composed:!0}))}async _send(t){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(t)}catch(e){return this._error=T(e,this._lang),null}finally{this._busy=!1}}_openAdd(){this._editing={...Ze}}_openEdit(t){this._editing={id:t.id,name:t.name,vendor:t.vendor||"",mpn:t.mpn||"",gtin:t.gtin||"",storage_location:t.storage_location||"",product_url:t.product_url||"",unit:t.unit||"",cost:t.cost!=null?String(t.cost):"",stock:t.stock!=null?String(t.stock):"",reorder_threshold:t.reorder_threshold!=null?String(t.reorder_threshold):"",restock_quantity:t.restock_quantity!=null?String(t.restock_quantity):"",auto_buy_task:!!t.auto_buy_task,notes:t.notes||""}}_formValue(t){let e=i=>i.trim()===""?null:Number(i);return{entry_id:this.entryId,name:t.name.trim(),vendor:t.vendor.trim()||null,mpn:t.mpn.trim()||null,gtin:t.gtin.trim()||null,storage_location:t.storage_location.trim()||null,product_url:t.product_url.trim()||null,unit:t.unit.trim()||null,cost:e(t.cost),stock:e(t.stock),reorder_threshold:e(t.reorder_threshold),restock_quantity:e(t.restock_quantity),auto_buy_task:t.auto_buy_task,notes:t.notes.trim()||null}}async _save(){let t=this._editing;if(!t||!t.name.trim())return;let e=this._formValue(t),i=t.id?"maintenance_supporter/part/update":"maintenance_supporter/part/create";await this._send(t.id?{type:i,part_id:t.id,...e}:{type:i,...e})!==null&&(this._editing=null,this._notifyChanged())}async _delete(t){if(!window.confirm(s("part_delete_confirm",this._lang).replace("{name}",t.name)))return;await this._send({type:"maintenance_supporter/part/delete",entry_id:this.entryId,part_id:t.id})!==null&&this._notifyChanged()}async _restock(t){let e=parseFloat(this._restockQty);if(!Number.isFinite(e)||e===0){this._restockInvalid=!0;return}this._restockInvalid=!1;let i=await this._send({type:"maintenance_supporter/part/restock",entry_id:this.entryId,part_id:t.id,delta:e});this._restockFor=null,i!==null&&(t.stock=i.stock,this.requestUpdate(),this._notifyChanged())}_identLine(t){return[t.vendor,t.mpn?`MPN: ${t.mpn}`:"",t.gtin?`GTIN: ${t.gtin}`:""].filter(Boolean).join(" \xB7 ")}_renderRow(t){let e=this._lang,i=t.stock!==null&&t.stock!==void 0,a=this._identLine(t),n=this._docsFor===t.id;return r`
      <div class="part-row ${t.is_low?"low":""}">
        <ha-icon class="part-icon" icon=${t.is_low?"mdi:cart-arrow-down":"mdi:package-variant-closed"}></ha-icon>
        <div class="part-main">
          <div class="part-name">
            ${N(t.shopping_url)?r`<a href=${t.shopping_url} target="_blank" rel="noopener noreferrer">${t.name}</a>`:t.name}
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
          class=${n?"docs-open":""}
          @click=${()=>this._docsFor=n?null:t.id}
          ><ha-icon icon="mdi:paperclip"></ha-icon
        ></ha-icon-button>
        ${this.canWrite?r`
              ${this._restockFor===t.id?r`
                    <input
                      class="restock-input${this._restockInvalid?" invalid":""}"
                      type="number"
                      .value=${this._restockQty}
                      placeholder="+1"
                      @input=${h=>this._restockQty=h.target.value}
                      @keydown=${h=>{h.key==="Enter"&&this._restock(t),h.key==="Escape"&&(this._restockFor=null)}}
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
      ${n?r`<div class="part-docs">
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
          @input=${n=>{this._editing[e]=n.target.value,this.requestUpdate()}}
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
    `}_inventoryValue(){let t=0,e=!1;for(let i of this.parts){let a=typeof i.cost=="number"?i.cost:null,n=typeof i.stock=="number"?i.stock:null;a!==null&&n!==null&&(t+=a*n,e=!0)}return e?t:null}render(){let t=this._lang;return!this.parts.length&&!this.canWrite?d:r`
      <div class="section-head">
        <h3>
          <ha-icon icon="mdi:package-variant"></ha-icon>
          ${s("parts_section",t)} (${this.parts.length})
          ${this._inventoryValue()!==null?r`<span class="inventory-value" title=${s("parts_inventory_value",t)}
                >${s("parts_inventory_value",t)}:
                ${this._inventoryValue().toFixed(2)}&nbsp;${this.currencySymbol}</span>`:d}
        </h3>
        ${this.canWrite&&!this._editing?r`<ha-button appearance="plain" @click=${()=>this._openAdd()}>
              <ha-icon icon="mdi:plus"></ha-icon> ${s("part_add",t)}
            </ha-button>`:d}
      </div>
      ${this._error?r`<div class="error">${this._error}</div>`:d}
      ${this._editing?this._renderForm():d}
      ${this.parts.map(e=>this._renderRow(e))}
    `}};U.styles=C`
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
  `,u([w({attribute:!1})],U.prototype,"hass",2),u([w({attribute:!1})],U.prototype,"entryId",2),u([w({attribute:!1})],U.prototype,"parts",2),u([w({type:Boolean})],U.prototype,"canWrite",2),u([w({attribute:!1})],U.prototype,"currencySymbol",2),u([_()],U.prototype,"_editing",2),u([_()],U.prototype,"_busy",2),u([_()],U.prototype,"_error",2),u([_()],U.prototype,"_restockFor",2),u([_()],U.prototype,"_restockQty",2),u([_()],U.prototype,"_restockInvalid",2),u([_()],U.prototype,"_docsFor",2);customElements.define("maintenance-parts-section",U);var Z=class Z extends D{constructor(){super(...arguments);this.flat=!1;this._ov=null;this._loading=!1;this._marking=!1;this._error="";this._history=null;this._rosterSort=Z._storedSort();this._typeFilter=null;this._recorded=[];this._historyRequested=!1;this._localeReady=!1;this._markAll=async()=>{await this._mark(void 0)};this._repair=async()=>{if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/setup",language:this._lang}),await this._load()}catch(t){this._error=T(t,this._lang)}finally{this._marking=!1}}};this._loadHistory=async t=>{if(!(!t.target.open||this._historyRequested)){this._historyRequested=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview_history"});this._history=e.series}catch{this._history=null}}}}get _lang(){return z(this.hass)}connectedCallback(){super.connectedCallback(),this.hass&&this._load()}updated(t){t.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,Y(this._lang).then(()=>this.requestUpdate()),this._ov===null&&!this._loading&&this._load())}async _load(){this._loading=!0,this._error="";try{this._ov=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview"})}catch(t){this._error=T(t,this._lang)}finally{this._loading=!1}}async _mark(t){if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/mark_replaced",...t?{entity_ids:t}:{}}),await this._load()}catch(e){this._error=T(e,this._lang)}finally{this._marking=!1}}}async _setExcluded(t,e){if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/set_excluded",entity_id:t,excluded:e}),await this._load()}catch(i){this._error=T(i,this._lang)}finally{this._marking=!1}}}async _addBattery(t){let e=t.detail?.value;if(!(!e||this._marking)){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/set_included",entity_id:e,included:!0}),await this._load()}catch(i){this._error=T(i,this._lang)}finally{this._marking=!1}}}async _setTrackSelf(t){let e=t.target.checked;if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/set_track_self_charging",enabled:e}),await this._load()}catch(i){this._error=T(i,this._lang)}finally{this._marking=!1}}}_sparkline(t){let e=this._history?.[t.entity_id];if(!e||e.points.length<2)return d;let i=110,a=24,n=2,h=e.points[0][0],c=e.points[e.points.length-1][0],p=Date.now()/1e3,g=t.status!=="low"&&t.predicted_source==="trend"&&t.days_until!=null?p+t.days_until*86400:null,m=Math.max(c,g??c),v=M=>m===h?n:n+(M-h)/(m-h)*(i-2*n),x=M=>n+(1-Math.min(100,Math.max(0,M))/100)*(a-2*n),$=e.points.map(([M,V])=>`${v(M).toFixed(1)},${x(V).toFixed(1)}`).join(" "),k=e.points[e.points.length-1][1],S=x(e.threshold).toFixed(1);return r`<svg
      class="bf-spark"
      viewBox="0 0 ${i} ${a}"
      role="img"
      aria-label=${s("battery_fleet_sparkline_hint",this._lang)}
    >
      <title>${s("battery_fleet_sparkline_hint",this._lang)}</title>
      <line class="bf-spark-th" x1="0" y1=${S} x2=${i} y2=${S}></line>
      <polyline class="bf-spark-line" points=${$}></polyline>
      ${g!==null?r`<line
            class="bf-spark-proj"
            x1=${v(c).toFixed(1)}
            y1=${x(k).toFixed(1)}
            x2=${v(g).toFixed(1)}
            y2=${S}
          ></line>`:d}
    </svg>`}static _storedSort(){return K(R.batteryRosterSort)==="name"?"name":"urgency"}_setSort(t){this._rosterSort=t,B(R.batteryRosterSort,t)}_sortedRoster(t){let e=this._typeFilter===null?t:t.filter(a=>a.battery_type===this._typeFilter);if(this._rosterSort==="name")return e;let i=a=>a.status==="low"?-1e3+(a.level??101)/101:a.days_until??1/0;return[...e].sort((a,n)=>i(a)-i(n)||a.device_name.localeCompare(n.device_name))}_predictedDate(t){return this._fmtDate(Date.now()+t*864e5)}_fmtDate(t){return new Intl.DateTimeFormat(this._lang,{day:"numeric",month:"numeric",year:"numeric"}).format(new Date(t))}_shoppingLine(t){return Object.entries(t).map(([e,i])=>r`<button
        class="bf-type-chip ${this._typeFilter===e?"bf-type-chip-active":""}"
        title=${s("battery_fleet_filter_type",this._lang)}
        @click=${()=>this._toggleTypeFilter(e)}
      >
        ${i}× ${e}
      </button>`)}_toggleTypeFilter(t){if(this._typeFilter=this._typeFilter===t?null:t,this._typeFilter!==null){let e=this.shadowRoot?.querySelector("details.bf-roster");e&&!e.open&&(e.open=!0)}}async _recordJump(t,e){if(!this._marking){this._marking=!0,this._error="";try{await this.hass.callService("battery_notes","set_battery_replaced",{device_id:e.device_id,datetime_replaced:new Date(e.at*1e3).toISOString()}),this._recorded=[...this._recorded,t],await this._load()}catch(i){this._error=T(i,this._lang)}finally{this._marking=!1}}}_levelBar(t){let e=t.level;if(e==null)return d;let i=t.low_threshold??20,a=e<=i?"bad":e<=i+20?"warn":"good";return r`<span class="bf-bar" aria-hidden="true"
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
                        ${(()=>{let n=this._history?.[a.entity_id]?.jump;return!n||this._recorded.includes(a.entity_id)?d:r`<button
                            class="bf-mark bf-jump"
                            title=${s("battery_fleet_record_replacement",t).replace("{date}",this._fmtDate(n.at*1e3))}
                            .disabled=${this._marking}
                            @click=${()=>this._recordJump(a.entity_id,n)}
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
    `}};Z.styles=C`
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
  `,u([w({attribute:!1})],Z.prototype,"hass",2),u([w({type:Boolean})],Z.prototype,"flat",2),u([_()],Z.prototype,"_ov",2),u([_()],Z.prototype,"_loading",2),u([_()],Z.prototype,"_marking",2),u([_()],Z.prototype,"_error",2),u([_()],Z.prototype,"_history",2),u([_()],Z.prototype,"_rosterSort",2),u([_()],Z.prototype,"_typeFilter",2),u([_()],Z.prototype,"_recorded",2);var Jt=Z;customElements.get("maintenance-battery-fleet-section")||customElements.define("maintenance-battery-fleet-section",Jt);var Me=C`
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
`;function Ce(o){let l=window;l.customCards=l.customCards||[],l.customCards.some(t=>t.type===o.type)||l.customCards.push(o)}var tt=class extends D{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._objectFilter="";this._configuredObjects=[];this._unsub=null;this._dataLoaded=!1;this._lastConnection=null}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(t){if(this._config={...t},t.past_days&&[30,90].includes(t.past_days)?this._pastDays=t.past_days:t.window_days&&[7,14,30,365].includes(t.window_days)&&(this._windowDays=t.window_days,this._pastDays=0),typeof t.user_filter=="string"&&(this._userFilter=t.user_filter),typeof t.object_filter=="string")this._objectFilter=t.object_filter,this._configuredObjects=[];else if(Array.isArray(t.object_filter)){let e=t.object_filter.filter(i=>typeof i=="string"&&i!=="");this._objectFilter=e.length===1?e[0]:"",this._configuredObjects=e.length>1?e:[]}}getCardSize(){return 6}get _lang(){return z(this.hass)}disconnectedCallback(){if(super.disconnectedCallback(),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._dataLoaded=!1,this._lastConnection=null}updated(t){if(super.updated(t),At(this,t),t.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[t,e]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=t.objects,this._stats=e}catch{}}async _subscribe(){try{let t=await this.hass.connection.subscribeMessage(e=>{let i=e;this._objects=i.objects},{type:"maintenance_supporter/subscribe"});if(!this.isConnected){t();return}this._unsub=t}catch{}}_onEventClick(t){if(t.history_timestamp){this._openHistoryEntry(t);return}we(t.entry_id,t.task_id)||this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:t.entry_id,task_id:t.task_id},bubbles:!0,composed:!0}))}async _openHistoryEntry(t){try{let i=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:t.entry_id})).tasks?.find(n=>n.id===t.task_id)?.history?.find(n=>n.timestamp===t.history_timestamp);if(!i||$e({entry_id:t.entry_id,task_id:t.task_id,original_timestamp:t.history_timestamp,type:i.type||"completed",timestamp:i.timestamp||t.history_timestamp,notes:i.notes??null,cost:i.cost??null,duration:i.duration??null,completed_by:i.completed_by??null,used_parts:i.used_parts??null}))return}catch{}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:t.entry_id,task_id:t.task_id,original_timestamp:t.history_timestamp},bubbles:!0,composed:!0}))}render(){if(!this.hass)return d;let t=this._lang,e=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,a=this._config.title,n=null;this._userFilter&&(n=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let h=f=>{let q=f.toLowerCase();return this._objects.find(X=>X.entry_id===f||X.object.name.toLowerCase()===q)?.entry_id??null},c=new Set(this._configuredObjects.map(h).filter(f=>f!==null)),p=c.size?this._objects.filter(f=>c.has(f.entry_id)):this._objects,g=this._config.show_object_filter!==!1&&p.length>1,m=this._objectFilter?h(this._objectFilter):null,v=m&&p.some(f=>f.entry_id===m)?p.filter(f=>f.entry_id===m):p,x=new Date;x.setHours(0,0,0,0);let $=this._pastDays>0,k=$?me(v,x,this._pastDays,n):_e(v,x,this._windowDays,n),S=ge(x),M=this._windowDays===365||$,V=M?k.filter(f=>f.events.length>0):k,ut=f=>{let q=`cal-status-${f.status}`,J=f.projected?"cal-event-projected":"",X=f.status==="overdue"&&f.days_until_due!=null?` (${gt(f.days_until_due,t)})`:"",at=f.projected&&f.interval_days?r`<span class="cal-event-recur">${f.interval_unit&&f.interval_unit!=="days"?`${f.interval_days} ${s("unit_"+f.interval_unit,t)}`:s("cal_every_n_days",t).replace("{n}",String(f.interval_days))}</span>`:d,H=f.schedule_type==="sensor_based",nt=H?r`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${s("cal_source_sensor",t)}" icon="mdi:trending-up"></ha-icon>`:r`<ha-icon class="cal-event-icon cal-source-time"
                title="${f.adaptive_enabled?s("cal_source_time_adaptive",t):s("cal_source_time",t)}"
                icon="${f.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,bt=H&&f.prediction_confidence&&f.status!=="triggered"&&!f.projected?r`<span class="cal-event-prediction cal-conf-${f.prediction_confidence}">
            ${s("cal_predicted",t)} · ${s(`cal_confidence_${f.prediction_confidence}`,t)}
          </span>`:d,ft=this._stats?.budget?.currency_symbol||Rt,F=f.history_type?s(f.history_type,t):s(f.status,t);return r`
        <div class="cal-event ${J}"
          @click=${()=>this._onEventClick(f)}>
          ${nt}
          <span class="cal-status-pill ${q}">${F}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${f.object_name} · ${f.task_name}${X}</div>
            ${bt}
            ${at}
          </div>
          ${f.avg_cost!=null&&f.avg_cost>0?r`<span class="cal-event-cost">${f.avg_cost.toFixed(0)} ${ft}</span>`:d}
        </div>
      `},j=f=>{let[q,J,X]=f.date.split("-").map(Number),at=new Date(q,J-1,X),H=f.date===S,nt=at.toLocaleDateString(t,{weekday:"short"}),bt=at.toLocaleDateString(t,{month:"long"});return r`
        <div class="cal-day-row">
          <div class="cal-day-pill ${H?"cal-today":""}">
            <span class="cal-pill-weekday">${nt}</span>
            <span class="cal-pill-day">${at.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${bt}</span>
              ${H?r`<span class="cal-day-today-badge">${s("today",t)}</span>`:d}
            </div>
            ${f.events.length===0?r`<div class="cal-empty">${s("cal_no_events",t)}</div>`:f.events.map(ut)}
          </div>
        </div>
      `};return r`
      <ha-card .header=${a}>
        ${e||i?r`
              <div class="cal-controls">
                ${e?r`
                      <div class="cal-window-chips cal-past-chips" title="${s("cal_past_windows",t)||"Past windows"}">
                        ${[30,90].map(f=>r`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===f?"active":""}"
                            @click=${()=>{this._pastDays=f}}>
                            −${f}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${s("cal_forward_windows",t)||"Forward windows"}">
                        ${[7,14,30,365].map(f=>r`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===f?"active":""}"
                            @click=${()=>{this._windowDays=f,this._pastDays=0}}>
                            ${f===365?"+1y":`+${f}d`}
                          </button>
                        `)}
                      </div>
                    `:d}
                ${i?r`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${f=>{this._userFilter=f.target.value}}>
                        <option value="">${s("all_users",t)}</option>
                        <option value="current_user">${s("my_tasks",t)}</option>
                      </select>
                    `:d}
                ${g?r`
                      <select class="cal-user-filter"
                        .value=${m??""}
                        @change=${f=>{this._objectFilter=f.target.value}}>
                        <option value="">${s("all_objects",t)}</option>
                        ${[...p].sort((f,q)=>f.object.name.localeCompare(q.object.name)).map(f=>r`<option value=${f.entry_id} ?selected=${f.entry_id===m}>${f.object.name}</option>`)}
                      </select>
                    `:d}
              </div>
            `:d}
        <div class="cal-rolling">
          ${V.length===0&&M?r`<div class="cal-empty">${s("cal_no_events",t)}</div>`:V.map(j)}
        </div>
      </ha-card>
    `}};tt.styles=[Lt,Me,C`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],u([w({attribute:!1})],tt.prototype,"hass",2),u([_()],tt.prototype,"_config",2),u([_()],tt.prototype,"_objects",2),u([_()],tt.prototype,"_stats",2),u([_()],tt.prototype,"_windowDays",2),u([_()],tt.prototype,"_pastDays",2),u([_()],tt.prototype,"_userFilter",2),u([_()],tt.prototype,"_objectFilter",2),u([_()],tt.prototype,"_unsub",2);var Je=[{value:7,key:"cal_editor_window_week"},{value:14,key:"cal_editor_window_fortnight"},{value:30,key:"cal_editor_window_month"},{value:365,key:"cal_editor_window_year"}],$t=class extends D{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}get _lang(){return z(this.hass)}setConfig(t){this._config={...t}}updated(){let t=this._lang;t&&!oe(t)&&Y(t).then(()=>this.requestUpdate())}_valueChanged(t,e){let i={...this._config,[t]:e};t==="show_window_chips"&&e===!0&&delete i.show_window_chips,t==="show_user_filter"&&e===!0&&delete i.show_user_filter,t==="show_object_filter"&&e===!0&&delete i.show_object_filter,t==="title"&&(!e||typeof e=="string"&&e.trim()==="")&&delete i.title,t==="user_filter"&&e===""&&delete i.user_filter,this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}render(){let t=this._lang,e=this._config.window_days??30,i=this._config.show_window_chips!==!1,a=this._config.show_user_filter!==!1,n=this._config.user_filter??"",h=this._config.title??"";return r`
      <div class="editor">
        <div class="row">
          <label for="title">${s("card_title",t)}</label>
          <input
            id="title"
            type="text"
            .value=${h}
            @input=${c=>this._valueChanged("title",c.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">${s("cal_editor_window",t)}</label>
          <select
            id="window"
            @change=${c=>this._valueChanged("window_days",Number(c.target.value))}
          >
            ${Je.map(c=>r`<option value="${c.value}" ?selected=${c.value===e}>${s(c.key,t)}</option>`)}
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
            <option value="" ?selected=${n===""}>${s("all_users",t)}</option>
            <option value="current_user" ?selected=${n==="current_user"}>
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
    `}};$t.styles=C`
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
  `,u([w({attribute:!1})],$t.prototype,"hass",2),u([_()],$t.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",tt);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",$t);Ce({type:"maintenance-supporter-calendar-card",name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});var et=class extends D{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel="",this._inputType="",this._inputValue="",this._open=!0,new Promise(e=>{this._resolve=e,this._promptResolve=null})}prompt(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel=t.inputLabel||"",this._inputType=t.inputType||"text",this._inputValue=t.inputValue||"",this._open=!0,new Promise(e=>{this._promptResolve=e,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return d;let t=z(this.hass);return r`
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
    `}};et.styles=[ne,C`
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
  `],u([w({attribute:!1})],et.prototype,"hass",2),u([_()],et.prototype,"_open",2),u([_()],et.prototype,"_title",2),u([_()],et.prototype,"_message",2),u([_()],et.prototype,"_confirmText",2),u([_()],et.prototype,"_danger",2),u([_()],et.prototype,"_inputLabel",2),u([_()],et.prototype,"_inputType",2),u([_()],et.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",et);var it=class extends D{constructor(){super(...arguments);this.objects=[];this._summary=null;this._loaded=!1;this._busy=!1;this._error="";this._query="";this._results=[];this._expanded=!1;this._initiallyLoaded=!1;this._searchTimer=0}get _lang(){return z(this.hass)}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._initiallyLoaded&&(this._initiallyLoaded=!0,this._load(),Y(this._lang).then(()=>this.requestUpdate()))}async _load(){this._busy=!0;try{this._summary=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/storage"}),this._error=""}catch(t){this._error=T(t,this._lang)}finally{this._loaded=!0,this._busy=!1}}_nameFor(t){return this.objects.find(i=>i.object?.id===t)?.object?.name||t.slice(0,8)}_entryFor(t){return this.objects.find(e=>e.object?.id===t)?.entry_id}_toggle(){this._expanded=!this._expanded}_openObject(t){this.dispatchEvent(new CustomEvent("open-object",{detail:{entry_id:t},bubbles:!0,composed:!0}))}_onSearch(t){this._query=t.target.value,clearTimeout(this._searchTimer),this._searchTimer=window.setTimeout(()=>{this._doSearch()},250)}async _doSearch(){let t=this._query.trim();if(!t){this._results=[];return}try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/search",query:t});this._results=e.results||[]}catch(e){this._error=T(e,this._lang),this._results=[]}}async _openResult(t){if(t.kind==="weblink"){N(t.url)&&window.open(t.url,"_blank","noopener");return}try{await _t(this.hass,t.id)}catch(e){this._error=T(e,this._lang)}}_renderResult(t,e){return r`
      <div class="obj-row result-row" title=${s("doc_open",e)} @click=${()=>this._openResult(t)}>
        <ha-icon icon=${t.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"}></ha-icon>
        <div class="result-info">
          <div class="result-title">${mt(t)}</div>
          <div class="result-obj">${t.object_name}</div>
        </div>
        <ha-icon class="result-open" icon=${t.kind==="weblink"?"mdi:open-in-new":"mdi:eye-outline"}></ha-icon>
      </div>
    `}render(){if(!this._loaded||!this._summary)return d;let t=this._summary;if(t.document_count===0)return d;let e=this._lang,i=Object.entries(t.by_object).filter(([,a])=>a.files>0||a.links>0).map(([a,n])=>({id:a,name:this._nameFor(a),entry:this._entryFor(a),...n})).sort((a,n)=>n.bytes-a.bytes);return r`
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
                ${lt(t.total_bytes)}
                ${t.dedup_savings_bytes>0?r`<span class="saved">−${lt(t.dedup_savings_bytes)}</span>`:d}
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
                      <div class="stat-value">${lt(t.total_bytes)}</div>
                      <div class="stat-label">
                        <ha-icon icon="mdi:file-document-outline"></ha-icon> ${t.file_count}
                        <ha-icon icon="mdi:link-variant"></ha-icon> ${t.link_count}
                      </div>
                    </div>
                    ${t.dedup_savings_bytes>0?r`<div class="stat">
                          <div class="stat-value saved">−${lt(t.dedup_savings_bytes)}</div>
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
        <span class="obj-size">${lt(t.bytes)}</span>
        ${i?r`<ha-icon class="obj-go" icon="mdi:chevron-right"></ha-icon>`:d}
      </div>
    `}};it.styles=C`
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
  `,u([w({attribute:!1})],it.prototype,"hass",2),u([w({attribute:!1})],it.prototype,"objects",2),u([_()],it.prototype,"_summary",2),u([_()],it.prototype,"_loaded",2),u([_()],it.prototype,"_busy",2),u([_()],it.prototype,"_error",2),u([_()],it.prototype,"_query",2),u([_()],it.prototype,"_results",2),u([_()],it.prototype,"_expanded",2);customElements.get("maintenance-storage-section-card")||customElements.define("maintenance-storage-section-card",it);var Xe=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"],rt=class extends D{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId="";this._values=new Array(12).fill("");this._save=async()=>{let t=this._buildOverrides();if(t!==null){this._loading=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:t}),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved"))}catch(e){this._error=T(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}};this._clearAll=async()=>{this._loading=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:{}}),this._values=new Array(12).fill(""),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved"))}catch(t){this._error=T(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}get _lang(){return z(this.hass)}open(t,e,i){if(this._entryId=t,this._taskId=e,this._values=new Array(12).fill(""),i)for(let[a,n]of Object.entries(i)){let h=parseInt(a,10);h>=1&&h<=12&&typeof n=="number"&&(this._values[h-1]=n.toString())}this._error="",this._open=!0}_close(){this._open=!1}_buildOverrides(){let t={};for(let e=0;e<12;e++){let i=this._values[e].trim();if(!i)continue;let a=parseFloat(i);if(Number.isNaN(a))return this._error=`${s("month_"+["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][e],this._lang)}: ${s("seasonal_override_invalid",this._lang)}`,null;if(a<.1||a>5)return this._error=s("seasonal_override_range",this._lang),null;t[e+1]=a}return t}render(){if(!this._open)return r``;let t=this._lang;return r`
      <ha-dialog open @closed=${this._close} heading="${s("seasonal_overrides_title",t)}">
        <div class="content">
          <p class="hint">${s("seasonal_overrides_hint",t)}</p>
          ${this._error?r`<div class="error">${this._error}</div>`:d}
          <div class="months">
            ${Xe.map((e,i)=>r`
              <label class="month">
                <span class="mn">${s(e,t)}</span>
                <input type="number" step="0.1" min="0.1" max="5.0"
                  placeholder="1.0"
                  .value=${this._values[i]}
                  @input=${a=>{let n=[...this._values];n[i]=a.target.value,this._values=n}} />
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
    `}};rt.styles=C`
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
  `,u([w({attribute:!1})],rt.prototype,"hass",2),u([_()],rt.prototype,"_open",2),u([_()],rt.prototype,"_loading",2),u([_()],rt.prototype,"_error",2),u([_()],rt.prototype,"_entryId",2),u([_()],rt.prototype,"_taskId",2),u([_()],rt.prototype,"_values",2);customElements.get("maintenance-seasonal-overrides-dialog")||customElements.define("maintenance-seasonal-overrides-dialog",rt);var st=class extends D{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._groupId=null;this._name="";this._description="";this._selected=new Set;this._toggleTask=(t,e)=>{let i=`${t}:${e}`,a=new Set(this._selected);a.has(i)?a.delete(i):a.add(i),this._selected=a};this._save=async()=>{let t=this._name.trim();if(!t){this._error=s("group_name_required",this._lang);return}this._loading=!0,this._error="";try{let e=this._buildTaskRefs();this._groupId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/update",group_id:this._groupId,name:t,description:this._description,task_refs:e}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/create",name:t,description:this._description,task_refs:e}),this._open=!1,this.dispatchEvent(new CustomEvent("group-saved"))}catch(e){this._error=T(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}get _lang(){return z(this.hass)}openCreate(){this._reset(),this._open=!0}openEdit(t,e){this._reset(),this._groupId=t,this._name=e.name,this._description=e.description||"",this._selected=new Set(e.task_refs.map(i=>`${i.entry_id}:${i.task_id}`)),this._open=!0}_reset(){this._groupId=null,this._name="",this._description="",this._selected=new Set,this._error=""}_close(){this._open=!1}_buildTaskRefs(){return[...this._selected].map(t=>{let[e,i]=t.split(":",2);return{entry_id:e,task_id:i}})}render(){if(!this._open)return r``;let t=this._lang,e=this._groupId?s("edit_group",t):s("new_group",t);return r`
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
                    ${i.tasks.length===0?r`<div class="hint small">${s("no_tasks_short",t)}</div>`:[...i.tasks].sort((a,n)=>a.name.localeCompare(n.name)).map(a=>{let n=`${i.entry_id}:${a.id}`,h=this._selected.has(n);return r`
                          <label class="task-row">
                            <input type="checkbox"
                              .checked=${h}
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
    `}};st.styles=C`
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
  `,u([w({attribute:!1})],st.prototype,"hass",2),u([w({attribute:!1})],st.prototype,"objects",2),u([_()],st.prototype,"_open",2),u([_()],st.prototype,"_loading",2),u([_()],st.prototype,"_error",2),u([_()],st.prototype,"_groupId",2),u([_()],st.prototype,"_name",2),u([_()],st.prototype,"_description",2),u([_()],st.prototype,"_selected",2);customElements.get("maintenance-group-dialog")||customElements.define("maintenance-group-dialog",st);var ct=class extends D{constructor(){super(...arguments);this._open=!1;this._busy=!1;this._error="";this._name="";this._views=[];this._filters=null;this._localeReady=!1;this._save=async()=>{let t=this._name.trim();if(!(!t||this._busy||!this._filters)){this._busy=!0,this._error="";try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/save",name:t,filters:this._filters});this._name="",this._emitChanged(e.views||[])}catch(e){this._error=T(e,this._lang)}finally{this._busy=!1}}};this._delete=async t=>{if(!this._busy){this._busy=!0,this._error="";try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/delete",view_id:t});this._emitChanged(e.views||[])}catch(e){this._error=T(e,this._lang)}finally{this._busy=!1}}}}get _lang(){return z(this.hass)}updated(t){t.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,Y(this._lang).then(()=>this.requestUpdate()))}async open(t,e){this._open=!0,this._error="",this._name="",this._filters=t,this._views=e}_close(){this._open=!1}_emitChanged(t){this._views=t,this.dispatchEvent(new CustomEvent("saved-views-changed",{bubbles:!0,composed:!0,detail:{views:t}}))}render(){if(!this._open)return r``;let t=this._lang;return r`
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
    `}};ct.styles=C`
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
  `,u([w({attribute:!1})],ct.prototype,"hass",2),u([_()],ct.prototype,"_open",2),u([_()],ct.prototype,"_busy",2),u([_()],ct.prototype,"_error",2),u([_()],ct.prototype,"_name",2),u([_()],ct.prototype,"_views",2);customElements.get("maintenance-saved-views-dialog")||customElements.define("maintenance-saved-views-dialog",ct);var ti=60,ei=20,De=30;function Xt(o){let l=o.trigger_config??null;if(!l)return d;let t=l.type||"threshold",e=o.trigger_entity_info?.unit_of_measurement??"",i=0,a="";if(t==="threshold"){let c=o.trigger_current_value??null;if(c==null)return d;let p=l.trigger_above,g=l.trigger_below;if(p!=null){let m=g??0,v=p-m||1;i=Math.min(100,Math.max(0,(c-m)/v*100)),a=`${c.toFixed(1)} / ${p} ${e}`}else if(g!=null){let v=o.trigger_entity_info?.max??(g*2||100),x=v-g||1;i=Math.min(100,Math.max(0,(v-c)/x*100)),a=`${c.toFixed(1)} / ${g} ${e}`}else if(l.trigger_equals!=null||l.trigger_not_equals!=null){let m=l.trigger_equals!=null?`= ${l.trigger_equals}`:`\u2260 ${l.trigger_not_equals}`;a=`${c.toFixed(1)} (${m}${e?` ${e}`:""})`,i=o.trigger_active?100:0}else return d}else if(t==="counter"){let c=l.trigger_target_value||1,p;if(l.trigger_delta_mode?(p=o.trigger_current_delta??null,p==null&&o.trigger_baseline_value!=null&&o.trigger_current_value!=null&&(p=o.trigger_current_value-o.trigger_baseline_value)):p=o.trigger_current_value??null,p==null)return d;i=Math.min(100,Math.max(0,p/c*100)),a=`${p.toFixed(1)} / ${c} ${e}`}else if(t==="state_change"){let c=l.trigger_target_changes||1,p=o.trigger_current_value??null;if(p==null)return d;i=Math.min(100,Math.max(0,p/c*100)),a=`${Math.round(p)} / ${c}`}else if(t==="runtime"){let c=l.trigger_runtime_hours||100,p=o.trigger_current_value??null;if(p==null)return d;i=Math.min(100,Math.max(0,p/c*100)),a=`${p.toFixed(1)}h / ${c}h`}else if(t==="compound"){let c=l.compound_logic||l.operator||"AND",p=l.conditions?.length||0;a=`${c} (${p})`,i=o.trigger_active?100:0}else return d;let n=i>=100,h=i>90?"var(--error-color, #f44336)":i>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return r`
    <div class="trigger-progress">
      <div class="trigger-progress-bar">
        <div class="trigger-progress-fill${n?" overflow":""}" style="width:${i}%;background:${h}"></div>
      </div>
      <span class="trigger-progress-label">${a}</span>
    </div>
  `}function te(o,l,t){if(!o.trigger_config?.entity_id)return d;let e=o.trigger_config.entity_id,i=l.get(e)||[],a=[];if(i.length>=2)a=i.map(j=>({ts:j.ts,val:j.val}));else{if(!o.history)return d;for(let j of o.history)j.trigger_value!=null&&a.push({ts:new Date(j.timestamp).getTime(),val:j.trigger_value})}if(o.trigger_current_value!=null&&a.push({ts:Date.now(),val:o.trigger_current_value}),a.length<2)return d;a.sort((j,f)=>j.ts-f.ts);let n=ti,h=ei,c=a.map(j=>j.val),p=Math.min(...c),g=Math.max(...c),m=g-p||1;p-=m*.1,g+=m*.1;let v=a[0].ts,$=a[a.length-1].ts-v||1,k=j=>(j-v)/$*n,S=j=>2+(1-(j-p)/(g-p))*(h-4),M=a;if(M.length>De){let j=Math.ceil(M.length/De);M=M.filter((f,q)=>q%j===0||q===M.length-1)}let V=M.map(j=>`${k(j.ts).toFixed(1)},${S(j.val).toFixed(1)}`).join(" "),ut=o.trigger_active?"var(--error-color, #f44336)":"var(--primary-color)";return r`
    <svg class="mini-sparkline" viewBox="0 0 ${n} ${h}" preserveAspectRatio="none" role="img" aria-label="${s("chart_mini_sparkline",t)}">
      <polyline points="${V}" fill="none" stroke="${ut}" stroke-width="1.5" stroke-linejoin="round" />
    </svg>
  `}function Oe(o,l){let t=l;if(o.days_until_due==null||!o.interval_days||o.interval_days<=0)return d;let{pct:e,overflow:i}=Ft(o.interval_days,o.days_until_due,o.interval_unit),a="var(--success-color, #4caf50)";return o.status==="overdue"?a="var(--error-color, #f44336)":o.status==="due_soon"&&(a="var(--warning-color, #ff9800)"),r`
    <div class="days-progress">
      <div class="days-progress-labels">
        <span>${o.last_performed?`${s("last_performed",t)}: ${G(o.last_performed,t)}`:""}</span>
        <span>${o.next_due?`${s("next_due",t)}: ${G(o.next_due,t)}`:""}</span>
      </div>
      <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(e)}" aria-valuemin="0" aria-valuemax="100" aria-label="${s("days_progress",t)}">
        <div class="days-progress-fill${i?" overflow":""}" style="width:${e}%;background:${a}"></div>
      </div>
      <div class="days-progress-text">${gt(o.days_until_due,t)}</div>
    </div>
  `}function Et(o,l,t=4){if(!isFinite(o)||!isFinite(l))return{ticks:[],niceMin:0,niceMax:1};if(o===l){let p=Math.abs(o)*.1||1;o-=p,l+=p}let e=l-o,i=Math.pow(10,Math.floor(Math.log10(e/Math.max(1,t)))),a=i;for(let p of[1,2,5,10])if(a=i*p,e/a<=t+.5)break;let n=Math.floor(o/a)*a,h=Math.ceil(l/a)*a,c=[];for(let p=n;p<=h+a*1e-6;p+=a)c.push(Math.abs(p)<a*1e-9?0:p);return{ticks:c,niceMin:n,niceMax:h}}function dt(o){let l=Math.abs(o);return l>=1e6?wt((o/1e6).toFixed(l>=1e7?0:1))+"M":l>=1e4?wt((o/1e3).toFixed(0))+"k":l>=1e3?wt((o/1e3).toFixed(1))+"k":l>=100?o.toFixed(0):l>=10||l>=1?wt(o.toFixed(1)):l===0?"0":wt(o.toFixed(2))}function wt(o){return o.replace(/\.0+$/,"").replace(/(\.\d*[1-9])0+$/,"$1")}function xt(o,l,t){let e=o.toLocaleString(t,{maximumFractionDigits:Math.abs(o)>=100?0:1});return l?`${e} ${l}`:e}function kt(o,l,t){let e=new Date(o),i=t?{month:"short",day:"numeric",year:"2-digit"}:{month:"short",day:"numeric"};return e.toLocaleDateString(l,i)}function ee(o,l){return new Date(o).toLocaleDateString(l,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function Nt(o,l){return new Date(o).getFullYear()!==new Date(l).getFullYear()}function Ut(o,l,t){if(t<2||l<=o)return[o,l];let e=[];for(let i=0;i<t;i++)e.push(o+(l-o)*i/(t-1));return e}var Vt=210,ot=46,pt=14,ht=12,Re=14,ii=20+Re,si=[{days:7,key:"chart_range_7d"},{days:30,key:"chart_range_30d"},{days:90,key:"chart_range_90d"},{days:365,key:"chart_range_1y"}],P=class extends D{constructor(){super(...arguments);this.points=[];this.events=[];this.unit="";this.lang="en";this.thresholdAbove=null;this.thresholdBelow=null;this.targetValue=null;this.forceZero=!1;this.projection=null;this.rangeDays=30;this.showRange=!0;this.busy=!1;this.hideOutliers=!1;this.showOutlierToggle=!0;this._width=0;this._hover=null;this._ro=null}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(t=>{let e=Math.floor(t[0]?.contentRect?.width||0);e&&Math.abs(e-this._width)>2&&(this._width=e)}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=null}_emitRange(t){t!==this.rangeDays&&this.dispatchEvent(new CustomEvent("range-change",{detail:{days:t},bubbles:!0,composed:!0}))}_toggleOutliers(){this.dispatchEvent(new CustomEvent("outlier-toggle",{detail:{hide:!this.hideOutliers},bubbles:!0,composed:!0}))}render(){let t=this._width||320,e=[...this.points].sort((a,n)=>a.ts-n.ts),i=this.lang;return r`
      <div class="chart-wrap">
        ${this.showRange?r`<div class="range-chips" role="group">
              ${this.showOutlierToggle?r`<button
                    class="range-chip outlier-chip ${this.hideOutliers?"active":""}"
                    ?disabled=${this.busy}
                    title=${s("hide_outliers",i)}
                    @click=${()=>this._toggleOutliers()}
                  ><ha-icon icon="mdi:filter-variant"></ha-icon></button>`:d}
              ${si.map(a=>r`<button
                  class="range-chip ${this.rangeDays===a.days?"active":""}"
                  ?disabled=${this.busy}
                  @click=${()=>this._emitRange(a.days)}
                >${s(a.key,i)}</button>`)}
            </div>`:d}
        ${e.length<2?r`<div class="chart-empty">
              <ha-icon icon="mdi:chart-line"></ha-icon> ${s("loading_chart",i)}
            </div>`:this._renderSvg(t,e)}
      </div>
    `}_renderSvg(t,e){let i=this.lang,a=t-ot-pt,n=Vt-ii,h=n-ht,c=1/0,p=-1/0;for(let b of e)c=Math.min(c,b.min??b.val),p=Math.max(p,b.max??b.val);this.thresholdAbove!=null&&(c=Math.min(c,this.thresholdAbove),p=Math.max(p,this.thresholdAbove)),this.thresholdBelow!=null&&(c=Math.min(c,this.thresholdBelow),p=Math.max(p,this.thresholdBelow)),this.targetValue!=null&&(c=Math.min(c,this.targetValue),p=Math.max(p,this.targetValue)),this.forceZero&&(c=Math.min(c,0));let g=(p-c||1)*.06,m=this.forceZero&&c>=0?0:c-g,{ticks:v,niceMin:x,niceMax:$}=Et(m,p+g,4);this.forceZero&&c>=0&&x<0&&(x=0,v=v.filter(b=>b>=0));let k=e[0].ts,S=this.projection&&this.projection.length===2?this.projection[1].ts:null,M=S!=null?Math.max(e[e.length-1].ts,S):e[e.length-1].ts,V=M-k||1,ut=Nt(k,M),j=b=>ot+(b-k)/V*a,f=b=>ht+(1-(b-x)/($-x||1))*h,q=e.map(b=>`${j(b.ts).toFixed(1)},${f(b.val).toFixed(1)}`).join(" "),J=`M${j(e[0].ts).toFixed(1)},${n} `+e.map(b=>`L${j(b.ts).toFixed(1)},${f(b.val).toFixed(1)}`).join(" ")+` L${j(e[e.length-1].ts).toFixed(1)},${n} Z`,X="",at=e.filter(b=>b.min!=null&&b.max!=null);if(at.length>=2){let b=at.map(W=>`${j(W.ts).toFixed(1)},${f(W.max).toFixed(1)}`),E=[...at].reverse().map(W=>`${j(W.ts).toFixed(1)},${f(W.min).toFixed(1)}`);X=`M${b[0]} `+b.slice(1).map(W=>`L${W}`).join(" ")+` L${E.join(" L")} Z`}let H=[];if(this.thresholdBelow!=null){let b=f(this.thresholdBelow);H.push({y:b,h:Math.max(0,n-b),lineY:b,label:`\u25BC ${dt(this.thresholdBelow)}`,labelY:Math.min(n-4,b+13)})}if(this.thresholdAbove!=null){let b=f(this.thresholdAbove);H.push({y:ht,h:Math.max(0,b-ht),lineY:b,label:`\u25B2 ${dt(this.thresholdAbove)}`,labelY:Math.max(ht+11,b-5)})}let nt=e[e.length-1],bt=(this.events||[]).filter(b=>b.ts>=k&&b.ts<=M),ft=Ut(k,M,Math.max(2,Math.min(5,Math.floor(a/110)+1))),F=this._hover;return r`
      <div class="svg-holder">
        <svg
          class="chart-svg"
          viewBox="0 0 ${t} ${Vt}"
          width=${t}
          height=${Vt}
          role="img"
          aria-label=${s("chart_sparkline",i)}
          @pointermove=${b=>this._onPointer(b,e,j,f,t)}
          @pointerdown=${b=>this._onPointer(b,e,j,f,t)}
          @pointerleave=${()=>this._hover=null}
        >
          <defs>
            <clipPath id="plot"><rect x="${ot}" y="${ht}" width="${a}" height="${h}" /></clipPath>
            ${H.length?I`<clipPath id="danger">${H.map(b=>I`<rect x="${ot}" y="${b.y.toFixed(1)}" width="${a}" height="${b.h.toFixed(1)}" />`)}</clipPath>`:d}
            <!-- Diagonal hatch so the danger zone reads without relying on the
                 red tint alone (dark-theme contrast + colour-blind support). -->
            <pattern id="dangerHatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
              <rect width="7" height="7" fill="var(--error-color, #f44336)" opacity="0.10" />
              <line x1="0" y1="0" x2="0" y2="7" stroke="var(--error-color, #f44336)" stroke-width="1.4" opacity="0.5" />
            </pattern>
          </defs>

          ${v.map(b=>{let E=f(b);return E<ht-1||E>n+1?d:I`
              <line x1="${ot}" y1="${E.toFixed(1)}" x2="${t-pt}" y2="${E.toFixed(1)}"
                stroke="var(--divider-color)" stroke-width="1" opacity="0.6" />
              <text x="${ot-7}" y="${(E+3.5).toFixed(1)}" text-anchor="end" class="tick-label">${dt(b)}</text>`})}

          ${H.map(b=>I`<rect x="${ot}" y="${b.y.toFixed(1)}" width="${a}" height="${b.h.toFixed(1)}"
              fill="url(#dangerHatch)" />`)}

          ${X?I`<path d="${X}" fill="var(--primary-color)" opacity="0.08" clip-path="url(#plot)" />`:d}
          <path d="${J}" fill="var(--primary-color)" opacity="0.10" clip-path="url(#plot)" />
          <polyline points="${q}" fill="none" stroke="var(--primary-color)" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" clip-path="url(#plot)" />
          ${H.length?I`<polyline points="${q}" fill="none" stroke="var(--error-color, #f44336)" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" clip-path="url(#danger)" />`:d}

          ${H.map(b=>I`
              <line x1="${ot}" y1="${b.lineY.toFixed(1)}" x2="${t-pt}" y2="${b.lineY.toFixed(1)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${t-pt-4}" y="${b.labelY.toFixed(1)}" text-anchor="end" class="zone-label">${b.label}</text>`)}

          ${this.targetValue!=null?I`<line x1="${ot}" y1="${f(this.targetValue).toFixed(1)}" x2="${t-pt}" y2="${f(this.targetValue).toFixed(1)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${t-pt-4}" y="${(f(this.targetValue)-5).toFixed(1)}" text-anchor="end" class="zone-label">◆ ${dt(this.targetValue)} ${this.unit}</text>`:d}

          ${this.projection&&this.projection.length===2?I`<line x1="${j(this.projection[0].ts).toFixed(1)}" y1="${f(this.projection[0].val).toFixed(1)}"
                x2="${Math.min(j(this.projection[1].ts),t-pt).toFixed(1)}" y2="${f(Math.max(x,Math.min($,this.projection[1].val))).toFixed(1)}"
                stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.8" />`:d}

          ${ft.map((b,E)=>{let W=j(b),Ue=E===0?"start":E===ft.length-1?"end":"middle";return I`<text x="${W.toFixed(1)}" y="${Vt-5}" text-anchor="${Ue}" class="tick-label">${kt(b,i,ut)}</text>`})}

          <line x1="${ot}" y1="${n}" x2="${t-pt}" y2="${n}" stroke="var(--divider-color)" stroke-width="1" />

          ${bt.map(b=>{let E=j(b.ts),W=b.type==="completed"?"var(--success-color, #4caf50)":b.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return I`
              <line x1="${E.toFixed(1)}" y1="${ht}" x2="${E.toFixed(1)}" y2="${n}" stroke="${W}" stroke-width="1" opacity="0.14" />
              <rect x="${(E-1.5).toFixed(1)}" y="${n+3}" width="3" height="${Re-6}" rx="1.5" fill="${W}">
                <title>${ee(b.ts,i)}</title>
              </rect>`})}

          ${F?I`
                <line x1="${F.x.toFixed(1)}" y1="${ht}" x2="${F.x.toFixed(1)}" y2="${n}"
                  stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.7" />
                <circle cx="${F.x.toFixed(1)}" cy="${F.y.toFixed(1)}" r="4.5" fill="var(--primary-color)"
                  stroke="var(--card-background-color, #fff)" stroke-width="2" />`:I`<circle cx="${j(nt.ts).toFixed(1)}" cy="${f(nt.val).toFixed(1)}" r="4" fill="var(--primary-color)"
                stroke="var(--card-background-color, #fff)" stroke-width="1.5" />`}
        </svg>
        ${F?r`<div
              class="hover-chip"
              style="left:${Math.min(Math.max(F.x,70),t-70)}px"
            >
              <div class="hover-date">${ee(F.p.ts,i)}</div>
              <div class="hover-val">
                ${xt(F.p.val,this.unit,i)}
                ${F.p.min!=null&&F.p.max!=null?r`<span class="hover-range">(${dt(F.p.min)}–${dt(F.p.max)})</span>`:d}
              </div>
            </div>`:d}
      </div>
    `}_onPointer(t,e,i,a,n){let c=t.currentTarget.getBoundingClientRect(),p=(t.clientX-c.left)/c.width*n;if(p<ot-8||p>n-pt+8){this._hover=null;return}let g=e[0],m=1/0;for(let v of e){let x=Math.abs(i(v.ts)-p);x<m&&(m=x,g=v)}this._hover={x:i(g.ts),y:a(g.val),p:g}}};P.styles=C`
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
  `,u([w({attribute:!1})],P.prototype,"points",2),u([w({attribute:!1})],P.prototype,"events",2),u([w()],P.prototype,"unit",2),u([w()],P.prototype,"lang",2),u([w({attribute:!1})],P.prototype,"thresholdAbove",2),u([w({attribute:!1})],P.prototype,"thresholdBelow",2),u([w({attribute:!1})],P.prototype,"targetValue",2),u([w({type:Boolean})],P.prototype,"forceZero",2),u([w({attribute:!1})],P.prototype,"projection",2),u([w({attribute:!1})],P.prototype,"rangeDays",2),u([w({type:Boolean})],P.prototype,"showRange",2),u([w({type:Boolean})],P.prototype,"busy",2),u([w({type:Boolean})],P.prototype,"hideOutliers",2),u([w({type:Boolean})],P.prototype,"showOutlierToggle",2),u([_()],P.prototype,"_width",2),u([_()],P.prototype,"_hover",2);customElements.get("maintenance-trigger-chart")||customElements.define("maintenance-trigger-chart",P);function ai(o){if(o.length<4)return o;let l=o.map(p=>p.val).sort((p,g)=>p-g),t=p=>{let g=(l.length-1)*p,m=Math.floor(g),v=Math.ceil(g);return l[m]+(l[v]-l[m])*(g-m)},e=t(.25),i=t(.75),a=i-e;if(a===0)return o;let n=e-1.5*a,h=i+1.5*a,c=o.filter(p=>p.val>=n&&p.val<=h);return c.length>=2?c:o}function Ae(o,l){let t=o.trigger_config;if(!t)return d;let e=l.lang,i=o.trigger_entity_info,a=o.trigger_entity_infos,n=i?.friendly_name||t.entity_id||"\u2014",h=t.entity_id||"",c=t.entity_ids||(h?[h]:[]),p=i?.unit_of_measurement||"",g=o.trigger_current_value,m=t.type||"threshold",v=c.length>1,x=ri(o,p,l);return r`
    <h3>${s("trigger",e)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${v?r`
            <div class="trigger-entity-name">${c.length} ${s("entities",e)} (${t.entity_logic||"any"})</div>
            <div class="trigger-entity-id">${c.map(($,k)=>r`${k>0?", ":""}<span class="entity-link" @click=${S=>Tt(S,$)}>${$}</span>`)}${t.attribute?` \u2192 ${t.attribute}`:""}</div>
          `:r`
            <div class="trigger-entity-name">${n}</div>
            <div class="trigger-entity-id">${h?r`<span class="entity-link" @click=${$=>Tt($,h)}>${h}</span>`:""}${t.attribute?` \u2192 ${t.attribute}`:""}</div>
          `}
        </div>
        <span class="status-badge ${o.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
          ${o.trigger_active?s("triggered",e):s("ok",e)}
        </span>
      </div>

      ${x?oi(x,e):g!=null?r`
              <div class="trigger-value-row">
                <span class="trigger-current ${o.trigger_active?"active":""}">${typeof g=="number"?xt(g,"",e):g}</span>
                ${p?r`<span class="trigger-unit">${p}</span>`:d}
              </div>
            `:d}

      <div class="trigger-limits">
        ${m==="threshold"?r`
          ${t.trigger_above!=null?r`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_above",e)}: ${t.trigger_above} ${p}</span>`:d}
          ${t.trigger_below!=null?r`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_below",e)}: ${t.trigger_below} ${p}</span>`:d}
          ${t.trigger_equals!=null?r`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> = ${t.trigger_equals} ${p}</span>`:d}
          ${t.trigger_not_equals!=null?r`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ≠ ${t.trigger_not_equals} ${p}</span>`:d}
          ${t.trigger_for_minutes?r`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${s("for_minutes",e)}: ${t.trigger_for_minutes}</span>`:d}
        `:d}
        ${m==="state_change"?r`
          ${t.trigger_target_changes!=null?r`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("target_changes",e)}: ${t.trigger_target_changes}</span>`:d}
        `:d}
        ${m==="runtime"?r`
          ${t.trigger_runtime_hours!=null?r`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("runtime_hours",e)}: ${t.trigger_runtime_hours}h</span>`:d}
        `:d}
        ${m==="compound"?r`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("compound_logic",e)}: ${t.compound_logic||t.operator||"AND"}</span>
          ${(t.conditions||[]).map(($,k)=>r`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${k+1}. ${s($.type||"unknown",e)}: ${$.entity_id?r`<span class="entity-link" @click=${S=>Tt(S,$.entity_id)}>${$.entity_id}</span>`:""}</span>
          `)}
        `:d}
      </div>

      ${a&&a.length>1?r`
        <div class="trigger-entity-list">
          ${a.map($=>r`
            <span class="trigger-entity-id">${$.friendly_name} (<span class="entity-link" @click=${k=>Tt(k,$.entity_id)}>${$.entity_id}</span>)</span>
          `)}
        </div>
      `:d}

      ${ni(o,p,l)}
    </div>
  `}function ri(o,l,t){let e=o.trigger_config,i=o.trigger_current_value;if(!e||i==null)return null;switch(e.type||"threshold"){case"counter":{let a=e.trigger_target_value;if(a==null||a<=0)return null;if(!e.trigger_delta_mode)return{progress:Math.max(0,i),target:a,unit:l,meter:null};let n=ze(o,Le(o,t));return{progress:Math.max(0,i-(n?.value??i)),target:a,unit:l,meter:i}}case"state_change":{let a=e.trigger_target_changes;return a==null||a<=0?null:{progress:Math.max(0,i),target:a,unit:"",meter:null}}case"runtime":{let a=e.trigger_runtime_hours;return a==null||a<=0?null:{progress:Math.max(0,i),target:a,unit:"h",meter:null}}}return null}function ze(o,l){if(o.trigger_baseline_value!=null)return{value:o.trigger_baseline_value,ts:ie(o)};if(!l.length)return null;let t=ie(o);if(t==null)return{value:l[0].val,ts:null};let e=l[0],i=Math.abs(l[0].ts-t);for(let a of l){let n=Math.abs(a.ts-t);n<i&&(e=a,i=n)}return{value:e.val,ts:t}}function ie(o){let l=[...o.history].filter(t=>t.type==="completed"||t.type==="reset").sort((t,e)=>new Date(e.timestamp).getTime()-new Date(t.timestamp).getTime())[0];return l?new Date(l.timestamp).getTime():null}function oi(o,l){let t=Math.min(999,Math.round(o.progress/o.target*100)),e=t>=100?"over":t>=75?"near":"ok";return r`
    <div class="counter-progress">
      <div class="counter-progress-nums">
        <span class="counter-progress-main">${xt(o.progress,"",l)}<span class="counter-progress-target"> / ${xt(o.target,o.unit,l)}</span></span>
        <span class="counter-progress-pct ${e}">${t} %</span>
      </div>
      <div class="counter-progress-bar" role="progressbar" aria-valuenow=${t} aria-valuemin="0" aria-valuemax="100">
        <div class="counter-progress-fill ${e}" style="width:${Math.min(100,t)}%"></div>
      </div>
      <div class="counter-progress-caption">
        ${s("chart_since_service",l)}${o.meter!=null?r` · ${s("current",l)}: ${xt(o.meter,o.unit,l)}`:d}
      </div>
    </div>
  `}function Le(o,l){let t=o.trigger_config;if(!t)return[];let e=t.type||"threshold",i=t.entity_id||"",a=e==="runtime"?[]:l.detailStatsData.get(i)||[],n=l.isCounterEntity(t),h=[];if(a.length>=2)for(let c of a){let p={ts:c.ts,val:c.val};!n&&c.min!=null&&c.max!=null&&(p.min=c.min,p.max=c.max),h.push(p)}else for(let c of o.history)c.trigger_value!=null&&h.push({ts:new Date(c.timestamp).getTime(),val:c.trigger_value});return o.trigger_current_value!=null&&h.push({ts:Date.now(),val:o.trigger_current_value}),h.sort((c,p)=>c.ts-p.ts),h}function ni(o,l,t){let e=o.trigger_config;if(!e)return d;let i=e.type||"threshold",a=e.entity_id||"",n=Le(o,t);i==="runtime"&&e.trigger_runtime_hours&&o.trigger_current_value!=null&&(n=[{ts:ie(o)??n[0]?.ts??Date.now()-864e5,val:0},{ts:Date.now(),val:Math.max(0,o.trigger_current_value)}]),t.hideOutliers&&(n=ai(n));let h=n.length<2&&!!a&&t.hasStatsService&&!t.detailStatsData.has(a);if(n.length<2&&!h)return d;let c=!!a&&t.detailStatsData.has(a)&&(t.detailStatsData.get(a)?.length??0)<2,p=Date.now()-t.rangeDays*864e5,g=n.filter(k=>k.ts>=p);g.length>=2&&(n=g);let m=null,v=!1;if(i==="counter"&&e.trigger_target_value!=null&&n.length){if(e.trigger_delta_mode){let k=ze(o,n);if(k){if(k.ts!=null){let S=n.filter(M=>M.ts>=k.ts);S.length>=2&&(n=S)}n=n.map(S=>({...S,val:Math.max(0,S.val-k.value)}))}}m=e.trigger_target_value,v=!0}else i==="state_change"&&e.trigger_target_changes?(m=e.trigger_target_changes,v=!0):i==="runtime"&&e.trigger_runtime_hours&&(m=e.trigger_runtime_hours,v=!0);let x=null;if(m==null&&o.degradation_rate!=null&&(o.degradation_trend!=="stable"||o.days_until_threshold!=null)&&o.degradation_trend!=="insufficient_data"&&n.length>=2){let k=n[n.length-1];x=[k,{ts:k.ts+30*864e5,val:k.val+o.degradation_rate*30}]}let $=o.history.filter(k=>["completed","skipped","reset"].includes(k.type)).map(k=>({ts:new Date(k.timestamp).getTime(),type:k.type}));return r`
    <maintenance-trigger-chart
      .points=${h?[]:n}
      .events=${$}
      .unit=${l}
      .lang=${t.lang}
      .thresholdAbove=${i==="threshold"?e.trigger_above??null:null}
      .thresholdBelow=${i==="threshold"?e.trigger_below??null:null}
      .targetValue=${m}
      .forceZero=${v}
      .projection=${x}
      .rangeDays=${t.rangeDays}
      .hideOutliers=${t.hideOutliers}
      .busy=${h}
      @range-change=${k=>t.setRangeDays(k.detail.days)}
      @outlier-toggle=${k=>t.setHideOutliers(k.detail.hide)}
    ></maintenance-trigger-chart>
    ${c&&!h?r`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${s("chart_no_stats",t.lang)}
        </div>`:d}
  `}var li=200,Mt=10,ci=22;function Ie(o,l,t,e){let i=o.history.filter(h=>h.type==="completed"&&(h.cost!=null||h.duration!=null));if(i.length<2)return d;let a=i.some(h=>(h.cost??0)>0),n=i.some(h=>(h.duration??0)>0);return!a&&!n?d:r`
    <div class="cost-duration-card">
      <div class="card-header">
        <h3>${s("cost_duration_chart",l)}</h3>
        <div class="toggle-buttons">
          ${a?r`<button
            class="toggle-btn ${t==="cost"?"active":""}"
            @click=${()=>e("cost")}>
            ${s("cost",l)}
          </button>`:d}
          ${a&&n?r`<button
            class="toggle-btn ${t==="both"?"active":""}"
            @click=${()=>e("both")}>
            ${s("both",l)}
          </button>`:d}
          ${n?r`<button
            class="toggle-btn ${t==="duration"?"active":""}"
            @click=${()=>e("duration")}>
            ${s("duration",l)}
          </button>`:d}
        </div>
      </div>
      ${di(o,l,t)}
    </div>
  `}function di(o,l,t){let e=o.history.filter(b=>b.type==="completed"&&(b.cost!=null||b.duration!=null)).map(b=>({ts:new Date(b.timestamp).getTime(),cost:b.cost??0,duration:b.duration??0})).sort((b,E)=>b.ts-E.ts);if(e.length<2)return d;let i=e.some(b=>b.cost>0),a=e.some(b=>b.duration>0);if(!i&&!a)return d;let n=t!=="duration"&&i,h=t!=="cost"&&a,c=n||!h&&i,p=h||!n&&a,g=640,m=li,v=c?44:12,x=p?44:12,$=g-v-x,k=m-ci,S=k-Mt,M=e[0].ts,V=e[e.length-1].ts,ut=(V-M||864e5)*.05,j=M-ut,f=V+ut,q=Nt(M,V),J=b=>v+(b-j)/(f-j)*$,X=Et(0,Math.max(...e.map(b=>b.cost))||1,3),at=Et(0,Math.max(...e.map(b=>b.duration))||1,3),H=b=>Mt+(1-b/(X.niceMax||1))*S,nt=b=>Mt+(1-b/(at.niceMax||1))*S,bt=e.length>1?Math.min(...e.slice(1).map((b,E)=>J(b.ts)-J(e[E].ts))):$,ft=Math.max(6,Math.min(22,bt*.55)),F=Ut(M,V,Math.max(2,Math.min(4,e.length)));return r`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${g} ${m}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_history",l)}">
        ${c?X.ticks.map(b=>{let E=H(b);return E<Mt-1||E>k+1?d:I`
            <line x1="${v}" y1="${E.toFixed(1)}" x2="${g-x}" y2="${E.toFixed(1)}" stroke="var(--divider-color)" stroke-width="1" opacity="0.55" />
            <text x="${v-6}" y="${(E+3.5).toFixed(1)}" text-anchor="end" fill="var(--primary-color)" font-size="10.5">${dt(b)}€</text>`}):d}
        ${p?at.ticks.map(b=>{let E=nt(b);return E<Mt-1||E>k+1?d:I`<text x="${g-x+6}" y="${(E+3.5).toFixed(1)}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="10.5">${dt(b)}m</text>`}):d}

        ${c?e.filter(b=>b.cost>0).map(b=>I`
          <rect x="${(J(b.ts)-ft/2).toFixed(1)}" y="${H(b.cost).toFixed(1)}" width="${ft.toFixed(1)}" height="${(k-H(b.cost)).toFixed(1)}"
            fill="var(--primary-color)" opacity="0.6" rx="2">
            <title>${kt(b.ts,l,!0)}: ${b.cost.toLocaleString(l)}€${b.duration?` \xB7 ${b.duration}m`:""}</title>
          </rect>
        `):d}
        ${p?I`
          <polyline points="${e.map(b=>`${J(b.ts).toFixed(1)},${nt(b.duration).toFixed(1)}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${e.map(b=>I`
            <circle cx="${J(b.ts).toFixed(1)}" cy="${nt(b.duration).toFixed(1)}" r="3.5" fill="var(--accent-color, #ff9800)">
              <title>${kt(b.ts,l,!0)}: ${b.duration}m${b.cost?` \xB7 ${b.cost.toLocaleString(l)}\u20AC`:""}</title>
            </circle>
          `)}
        `:d}

        <line x1="${v}" y1="${k}" x2="${g-x}" y2="${k}" stroke="var(--divider-color)" stroke-width="1" />
        ${F.map((b,E)=>{let W=E===0?"start":E===F.length-1?"end":"middle";return I`<text x="${J(b).toFixed(1)}" y="${m-6}" text-anchor="${W}" fill="var(--secondary-text-color)" font-size="10">${kt(b,l,q)}</text>`})}
      </svg>
    </div>
    <div class="chart-legend">
      ${c?r`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${s("cost",l)}</span>`:d}
      ${p?r`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${s("duration",l)}</span>`:d}
    </div>
  `}var vt=class extends D{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await It(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?d:this._url?r`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:r`<div class="ph"></div>`}};vt.styles=C`
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
  `,u([w({attribute:!1})],vt.prototype,"hass",2),u([w()],vt.prototype,"docId",2),u([_()],vt.prototype,"_url",2),u([_()],vt.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",vt);var pi=["completed","skipped","missed","reset","triggered","trigger_replaced","trigger_removed"];function Pe(o,l){let t=l.lang;return r`
    <div class="history-filters-new">
      <div class="filter-chips">
        ${pi.map(e=>{let i=o.history.filter(a=>a.type===e).length;return i===0?d:r`
            <span class="filter-chip ${l.filter===e?"active":""}"
              @click=${()=>l.setFilter(l.filter===e?null:e)}>
              ${s(e,t)} (${i})
            </span>
          `})}
        ${l.filter?r`<span class="filter-chip clear" @click=${()=>l.setFilter(null)}>${s("show_all",t)}</span>`:d}
      </div>
      <div class="filter-controls">
        <input type="text" class="search-input" placeholder="${s("search_notes",t)}..." .value=${l.search} @input=${e=>l.setSearch(e.target.value)} />
      </div>
    </div>
  `}function Fe(o,l){let t=l.lang,e=l.filter?o.history.filter(i=>i.type===l.filter):o.history;if(l.search){let i=l.search.toLowerCase();e=e.filter(a=>a.notes?.toLowerCase().includes(i))}return e.length===0?r`<p class="empty">${s("no_history",t)}</p>`:r`
    <div class="history-timeline">
      ${[...e].reverse().map(i=>hi(i,l))}
    </div>
  `}function hi(o,l){let t=l.lang,e=["completed","reset","skipped"].includes(o.type);return r`
    <div class="history-entry">
      <div class="history-icon ${o.type}">
        <ha-icon .icon=${Ot[o.type]||"mdi:circle"}></ha-icon>
      </div>
      <div class="history-content">
        <div class="history-row">
          <strong>${s(o.type,t)}</strong>
          ${o.auto?r`<span class="history-auto-badge">${s("history_auto",t)}</span>`:d}
          ${e?r`<button class="history-edit-btn"
                     title=${s("history_edit_button",t)||"Edit entry"}
                     @click=${()=>l.openEdit(o)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:d}
        </div>
        <div class="history-date">${zt(o.timestamp,t)}</div>
        ${o.notes?r`<div>${o.notes}</div>`:d}
        ${o.photo_doc_id?r`<maintenance-history-photo .hass=${l.hass} .docId=${o.photo_doc_id}></maintenance-history-photo>`:d}
        <div class="history-details">
          ${o.cost!=null?r`<span>${s("cost",t)}: ${o.cost.toFixed(2)} ${l.currencySymbol}</span>`:d}
          ${o.duration!=null?r`<span>${s("duration",t)}: ${o.duration} min</span>`:d}
          ${o.trigger_value!=null?r`<span>${s("trigger_val",t)}: ${o.trigger_value}</span>`:d}
          ${o.reading_value!=null?r`<span>${s("reading_label",t)}: ${o.reading_value}${l.readingUnit?` ${l.readingUnit}`:""}${(()=>{let i=l.readingDelta?.(o);return i==null?"":` (${i>=0?"+":""}${Number(i.toFixed(3))})`})()}</span>`:d}
        </div>
      </div>
    </div>
  `}function se(o,l){if(!o.responsible_user_id)return d;let t=l(o.responsible_user_id);return t?r`
    <span class="user-badge">
      <ha-icon icon="mdi:account"></ha-icon>
      ${t}
    </span>
  `:d}function ui(o,l){let t=l.lang,e=l.isOperator,i=o.archived?"archived":o.is_done?"done":o.status==="due_soon"?"warning":o.status||"ok",a=o.archived?s("archived",t):o.is_done?s("completed",t):s(o.status||"ok",t);return r`
    <div class="task-header">
      <div class="task-header-title">
        <span class="task-name-breadcrumb" @click=${()=>l.showTaskView()}>${o.name}</span>
        <span class="breadcrumb-separator">·</span>
        <span class="object-name-breadcrumb" @click=${()=>l.showObject()}>${l.objectName}</span>
        <span class="status-chip ${i}">${a}</span>
        ${o.due_override?r`<span class="postponed-badge" title="${s("postponed_to",t)}">
          <ha-icon icon="mdi:calendar-arrow-right"></ha-icon>${G(o.due_override,t)}
        </span>`:d}
        ${se(o,l.getUserName)}
        ${o.nfc_tag_id?r`<span class="nfc-badge" title="${s("nfc_tag_id",t)}: ${o.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>`:e?d:r`<span class="nfc-badge unlinked" title="${s("nfc_link_hint",t)}"
              @click=${()=>l.openEdit(o)}>
              <ha-icon icon="mdi:nfc-variant"></ha-icon>
            </span>`}
      </div>
      <div class="task-header-actions">
        <ha-button appearance="filled" @click=${()=>l.openComplete(o)}>${s("complete",t)}</ha-button>
        <ha-button appearance="plain" .disabled=${l.actionLoading} @click=${()=>l.promptSkip()}>${s("skip",t)}</ha-button>
        <div class="more-menu-wrapper">
          <ha-icon-button .disabled=${l.actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${()=>l.toggleMoreMenu()}></ha-icon-button>
          ${l.moreMenuOpen?r`
            <div class="popup-menu" @click=${n=>n.stopPropagation()}>
              ${e?d:r`
                <div class="popup-menu-item" @click=${()=>{l.closeMoreMenu(),l.openEdit(o)}}>${s("edit",t)}</div>
              `}
              <div class="popup-menu-item" @click=${()=>{l.closeMoreMenu(),l.openQr(o.name)}}>${s("qr_code",t)}</div>
              <div class="popup-menu-item" @click=${()=>{l.closeMoreMenu(),l.printWorksheet()}}>${s("worksheet",t)}</div>
              ${e?d:r`
                <div class="popup-menu-item" @click=${()=>l.duplicateTask()}>${s("duplicate",t)}</div>
                <div class="popup-menu-item" @click=${()=>{l.closeMoreMenu(),l.promptReset()}}>${s("reset",t)}</div>
                <div class="popup-menu-item" @click=${()=>{l.closeMoreMenu(),l.promptPostpone()}}>${s("postpone",t)}…</div>
                <div class="popup-menu-item" @click=${()=>{l.closeMoreMenu(),l.snoozeTask()}}>${s("snooze",t)}</div>
                <div class="popup-menu-item" @click=${()=>{l.closeMoreMenu(),l.toggleArchive(!!o.archived)}}>${o.archived?s("unarchive",t):s("archive",t)}</div>
                <div class="popup-menu-divider"></div>
                <div class="popup-menu-item danger" @click=${()=>{l.closeMoreMenu(),l.deleteTask()}}>${s("delete",t)}</div>
              `}
            </div>
          `:d}
        </div>
      </div>
    </div>
  `}function gi(o){let l=o.lang;return r`
    <div class="tab-bar">
      <div class="tab ${o.activeTab==="overview"?"active":""}" @click=${()=>o.setActiveTab("overview")}>
        ${s("overview",l)}
      </div>
      <div class="tab ${o.activeTab==="history"?"active":""}" @click=${()=>o.setActiveTab("history")}>
        ${s("history",l)}
      </div>
    </div>
  `}function He(o,l,t,e){let i=e.collapsedSections.has(o);return r`
    <div class="collapsible ${i?"collapsed":""}">
      <button class="collapsible-head" @click=${()=>e.toggleSection(o)}
        aria-expanded=${i?"false":"true"}>
        <ha-icon icon="${i?"mdi:chevron-right":"mdi:chevron-down"}"></ha-icon>
        <span>${s(l,e.lang)}</span>
      </button>
      ${i?d:r`<div class="collapsible-body">${t}</div>`}
    </div>
  `}function _i(o,l){if(!l.features.checklists)return d;let t=o.checklist||[];if(t.length===0)return d;let e=l.lang,i=o.checklist_progress||{},a=t.filter(n=>i[n]).length;return r`
    <div class="checklist-preview-card">
      <div class="checklist-preview-header">
        <ha-icon icon="mdi:format-list-checks"></ha-icon>
        <span>${s("checklist",e)} (${a}/${t.length})</span>
      </div>
      <ol class="checklist-preview-list">
        ${t.map(n=>r`
          <li class=${i[n]?"checked":""}>
            <label>
              <input
                type="checkbox"
                .checked=${!!i[n]}
                @change=${h=>l.setChecklistItem(n,h.target.checked)}
              />
              <span>${n}</span>
            </label>
          </li>
        `)}
      </ol>
    </div>
  `}function mi(o,l){let t=N(o.documentation_url)?o.documentation_url:null,e=N(l.objectDocUrl)?l.objectDocUrl:null,i=e?null:(l.objectManualDocs||[])[0];if(!o.notes&&!t&&!e&&!i)return d;let a=l.lang;return r`
    <div class="task-meta-card">
      ${o.notes?r`
        <div class="task-meta-row">
          <ha-icon icon="mdi:note-text-outline"></ha-icon>
          <span class="task-meta-notes">${o.notes}</span>
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
          <a href="${e}" target="_blank" rel="noopener noreferrer">${s("documentation_url_label",a)} (${l.objectName})</a>
        </div>
      `:i?r`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="#" title=${i.title}
            @click=${n=>{n.preventDefault(),l.openManualDoc(i)}}
            >${s("documentation_url_label",a)} (${l.objectName})</a>
        </div>
      `:d}
    </div>
  `}function vi(o,l){let t=l.lang,e=o.times_performed>0?o.total_cost/o.times_performed:0,i=o.days_until_due!==null&&o.days_until_due!==void 0?o.days_until_due<0?"overdue":o.days_until_due<=o.warning_days?"warning":"":"";return r`
    <div class="kpi-bar">
      <div class="kpi-card">
        <div class="kpi-label">${s("next_due",t)}</div>
        <div class="kpi-value">${o.next_due?G(o.next_due,t):"\u2014"}</div>
        ${l.features.schedule_time&&o.schedule_time?r`<div class="kpi-subtext">${s("at_time",t)} ${o.schedule_time}</div>`:d}
      </div>
      <div class="kpi-card ${i}">
        <div class="kpi-label">${s("days_until_due",t)}</div>
        <div class="kpi-value-large">${o.days_until_due!==null&&o.days_until_due!==void 0?o.days_until_due:"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("interval",t)}</div>
        <div class="kpi-value">${jt(o,t)}</div>
        ${l.features.adaptive&&o.suggested_interval&&o.suggested_interval!==o.interval_days?r`
          <div class="kpi-subtext">${s("recommended",t)}: ${o.suggested_interval}${o.interval_analysis?.confidence_interval_low!=null?` (${o.interval_analysis.confidence_interval_low}\u2013${o.interval_analysis.confidence_interval_high})`:""}</div>
        `:d}
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("warning",t)}</div>
        <div class="kpi-value">${o.warning_days} ${s("days",t)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("last_performed",t)}</div>
        <div class="kpi-value">${o.last_performed?G(o.last_performed,t):"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("avg_cost",t)}</div>
        <div class="kpi-value">${e.toFixed(0)} ${l.currencySymbol}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("avg_duration",t)}</div>
        <div class="kpi-value">${o.average_duration?o.average_duration.toFixed(0):"\u2014"} min</div>
      </div>
    </div>
  `}function bi(o,l){let t=l.lang;if(!l.features.adaptive||!o.suggested_interval||o.suggested_interval===o.interval_days)return d;if(l.suggestionDismissed)return d;let e=o.suggested_interval;return r`
    <div class="recommendation-card">
      <h4>${s("suggested_interval",t)}</h4>
      ${fe(o.interval_days,e,o.interval_confidence||"medium",t)}
      <div class="recommendation-actions">
        <ha-button appearance="filled"
          @click=${()=>l.applySuggestion(e)}>
          ${s("apply_suggestion",t)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${()=>l.reanalyze()}>
          ${s("reanalyze",t)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${()=>l.dismissSuggestion()}>
          ${s("dismiss_suggestion",t)}
        </ha-button>
      </div>
    </div>
  `}function fi(o,l){let t=l.lang,e=o.history.slice(-3).reverse();if(e.length===0)return d;let i=a=>{switch(a){case"completed":return"\u2713";case"triggered":return"\u2297";case"skipped":return"\u21B7";case"reset":return"\u21BA";default:return"\xB7"}};return r`
    <div class="recent-activities">
      <h3>${s("recent_activities",t)}</h3>
      ${e.map(a=>r`
        <div class="activity-item">
          <span class="activity-icon">${i(a.type)}</span>
          <span class="activity-date">${zt(a.timestamp,t)}</span>
          <span class="activity-note">${a.notes||"\u2014"}</span>
          ${a.cost?r`<span class="activity-badge">${a.cost.toFixed(0)}${l.currencySymbol}</span>`:d}
          ${a.duration?r`<span class="activity-badge">${a.duration}min</span>`:d}
        </div>
      `)}
      <div class="activity-show-all">
        <ha-button appearance="plain" @click=${()=>l.setActiveTab("history")}>${s("show_all",t)} →</ha-button>
      </div>
    </div>
  `}function yi(o,l){let t=l.lang,e=l.features.adaptive&&o.suggested_interval&&o.suggested_interval!==o.interval_days,i=l.features.seasonal&&o.seasonal_factor&&o.seasonal_factor!==1,a=e||i,n=l.features.adaptive&&o.interval_analysis?.weibull_beta!=null&&o.interval_analysis?.weibull_eta!=null,h=l.features.seasonal&&(o.seasonal_factors?.length===12||o.interval_analysis?.seasonal_factors?.length===12);return r`
    <div class="tab-content overview-tab">
      ${o.battery_fleet_task?r`<maintenance-battery-fleet-section .hass=${l.hass}></maintenance-battery-fleet-section>`:d}
      ${vi(o,l)}
      ${mi(o,l)}
      ${o.battery_fleet_task?d:r`
            ${Oe(o,l.lang)}
            ${Ae(o,l.sparkline)}
            ${be(o,t,l.features)}
          `}
      <div class="two-column-layout ${a?"":"single-column"}">
        ${a?r`
          <div class="left-column">
            ${bi(o,l)}
            ${ye(o,t,l.features)}
          </div>
        `:d}
        <div class="right-column">
          ${Ie(o,t,l.costDurationToggle,c=>l.setCostDurationToggle(c))}
        </div>
      </div>
      ${n?He("weibull","weibull_reliability_curve",ve(o,t),l):d}
      ${h?He("seasonal","seasonal_chart_title",r`
            ${xe(o,t)}
            <div class="seasonal-actions">
              <ha-button appearance="plain" @click=${()=>l.openSeasonalOverrides(o)}>
                ${s("edit_seasonal_overrides",t)}
              </ha-button>
            </div>
          `,l):d}
      ${_i(o,l)}
      ${fi(o,l)}
    </div>
  `}function xi(o,l){return r`
    <div class="tab-content history-tab">
      ${Pe(o,l.history)}
      ${Fe(o,l.history)}
    </div>
  `}function $i(o,l){switch(l.activeTab){case"overview":return yi(o,l);case"history":return xi(o,l);default:return d}}function Be(o,l){return r`
    <div class="detail-section">
      ${ui(o,l)}
      ${gi(l)}
      ${$i(o,l)}
      <maintenance-task-documents
        .hass=${l.hass}
        .entryId=${l.entryId}
        .taskId=${l.taskId}
        .canWrite=${!l.isOperator}
      ></maintenance-task-documents>
    </div>
  `}var Ct=class extends D{createRenderRoot(){return this}render(){return!this.task||!this.ctx?d:r`${Be(this.task,this.ctx)}`}};u([w({attribute:!1})],Ct.prototype,"task",2),u([w({attribute:!1})],Ct.prototype,"ctx",2);customElements.get("maintenance-task-detail-view")||customElements.define("maintenance-task-detail-view",Ct);function Ne(o){if(o.total<=0)return{start:0,end:0,padTop:0,padBottom:0};let l=o.overscan??12,t=Math.max(1,o.step??6),e=Math.max(1,o.rowHeight),i=Math.floor((o.scrollTop-o.listTop)/e),a=Math.ceil(o.viewportHeight/e)+1,n=Math.max(0,i-l);n=Math.floor(n/t)*t;let h=Math.min(o.total,Math.max(i,0)+a+l);return h=Math.min(o.total,Math.ceil(h/t)*t),n>=h&&(n=Math.min(n,Math.max(0,o.total-1)),h=Math.min(o.total,n+Math.max(a,1))),{start:n,end:h,padTop:n*e,padBottom:(o.total-h)*e}}var y=class extends D{constructor(){super(...arguments);this.narrow=!1;this.panel={};this._objects=[];this._stats=null;this._view="overview";this._allParts=null;this._selectedEntryId=null;this._selectedTaskId=null;this._filterStatus="";this._filterUser=null;this._filterLabel=null;this._filterPriority="";this._savedViews=[];this._activeViewId="";this._unsub=null;this._chartRangeDays=(()=>{try{let t=parseInt(K(R.chartRange)||"",10);return[7,30,90,365].includes(t)?t:30}catch{return 30}})();this._hideOutliers=(()=>{try{return K(R.chartHideOutliers)==="1"}catch{return!1}})();this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._adminPanelUserIds=[];this._operatorWriteEnabled=!1;this._defaultWarningDays=7;this._actionLoading=!1;this._moreMenuOpen=!1;this._objMenuOpen=!1;this._toastMessage="";this._toastUndo=null;this._toastActionLabel="";this._filtersOpen=!1;this._newMenuOpen=!1;this._gsSetupsCount=0;this._gsAdoptCount=0;this._gsLoaded=!1;this._batteryFleetSetupAvailable=!1;this._staleBundle=!1;this._staleChecked=!1;this._toastTimer=null;this._dismissedSuggestions=new Set;this._overviewTab=(()=>{try{let t=K(R.overviewTab);return t==="today"||t==="calendar"?t:"dashboard"}catch{return"dashboard"}})();this._activeTab="overview";this._costDurationToggle="both";this._historySearch="";this._sortMode="due_date";this._objectSortMode="alphabetical";this._groupByMode="none";this._objectViewMode="cards";this._objectsTableColumns=de;this._showArchived=!1;this._bulkMode=!1;this._bulkSelected=new Set;this._virtStart=0;this._virtEnd=0;this._virtRowHeight=53;this._virtTotalRows=0;this._virtScrollAttached=!1;this._virtRaf=0;this._collapsedSections=(()=>{try{return new Set(JSON.parse(K(R.collapsedSections)||"[]"))}catch{return new Set}})();this._paletteOpen=!1;this._paletteQuery="";this._paletteActive=0;this._templateGalleryOpen=!1;this._templates=[];this._templateCategories={};this._templateBusy=!1;this._statsService=null;this._userService=null;this._dataLoaded=!1;this._lastConnection=null;this._popstateHandler=t=>this._onPopState(t);this._lazyUi=null;this._onVirtualScroll=()=>{this._virtRaf||(this._virtRaf=requestAnimationFrame(()=>{this._virtRaf=0,this._updateVirtualWindow()}))};this._deepLinkHandled=!1;this._paletteKeydown=t=>{if(t.key==="/"&&!t.ctrlKey&&!t.metaKey&&!t.altKey&&!this._paletteOpen){let i=t.composedPath()[0];if(i instanceof HTMLElement&&(i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.tagName==="SELECT"||i.isContentEditable))return;t.preventDefault(),this._openPalette();return}if(!this._paletteOpen)return;let e=this._paletteResults;if(t.key==="Escape")t.preventDefault(),this._closePalette();else if(t.key==="ArrowDown")t.preventDefault(),this._paletteActive=Math.min(this._paletteActive+1,e.length-1);else if(t.key==="ArrowUp")t.preventDefault(),this._paletteActive=Math.max(this._paletteActive-1,0);else if(t.key==="Enter"){t.preventDefault();let i=e[this._paletteActive];i&&this._selectPaletteResult(i)}};this._onDialogEvent=async()=>{try{await this._loadData()}catch{}};this._onCalendarLlCustom=t=>{let e=t.detail;e?.type==="maintenance-supporter:open-task"&&e.entry_id&&e.task_id&&(t.stopPropagation(),this._showTask(e.entry_id,e.task_id))};this._fullHistory=null;this._onHistoryEntrySaved=async()=>{await this._loadData()}}get _currencySymbol(){return this._budget?.currency_symbol||Rt}get _lang(){return z(this.hass)}get _isOperator(){let t=this.hass?.user;return t?t.is_admin?!1:!(this._operatorWriteEnabled&&this._adminPanelUserIds.includes(t.id)):!0}_ensureLazyUi(){return this._lazyUi||(this._lazyUi=Promise.all([import("/maintenance_supporter_panelfiles/panel-chunks/object-dialog-OZVLC3AY.js"),import("/maintenance_supporter_panelfiles/panel-chunks/task-dialog-ANLUEI42.js"),import("/maintenance_supporter_panelfiles/panel-chunks/complete-dialog-6XF2LMYM.js"),import("/maintenance_supporter_panelfiles/panel-chunks/qr-dialog-NJELJFTA.js"),import("/maintenance_supporter_panelfiles/panel-chunks/adopt-problem-sensors-dialog-MXVQVGRO.js"),import("/maintenance_supporter_panelfiles/panel-chunks/suggested-setups-dialog-QZZ3B7HZ.js"),import("/maintenance_supporter_panelfiles/panel-chunks/settings-view-EWPXS47H.js")]).then(()=>this.updateComplete)),this._lazyUi}async _ui(t){return await this._ensureLazyUi(),this.shadowRoot?.querySelector(t)??null}connectedCallback(){super.connectedCallback();let t=window.requestIdleCallback,e=()=>this._ensureLazyUi();t?t(e,{timeout:3e3}):window.setTimeout(e,1500),window.addEventListener("popstate",this._popstateHandler),window.addEventListener("keydown",this._paletteKeydown),window.addEventListener("resize",this._onVirtualScroll,{passive:!0});try{let i=K(R.taskSort);i&&["due_date","object","type","task_name","area","assigned_user","group"].includes(i)&&(this._sortMode=i);let a=K(R.objectSort);a&&["alphabetical","due_soonest","task_count"].includes(a)&&(this._objectSortMode=a);let n=K(R.groupBy);n&&["none","area","group","user"].includes(n)&&(this._groupByMode=n);let h=K(R.objectView);(h==="cards"||h==="table")&&(this._objectViewMode=h)}catch{}if(this._objects.length===0){let i=je();i&&(this._objects=i.objects,i.stats&&(this._stats=i.stats))}}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("popstate",this._popstateHandler),window.removeEventListener("keydown",this._paletteKeydown),window.removeEventListener("resize",this._onVirtualScroll),this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onVirtualScroll),this._virtScrollAttached=!1,this._virtRaf&&cancelAnimationFrame(this._virtRaf),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._lastConnection=null,this._deepLinkHandled=!1,this._statsService?.clearCache(),this._statsService=null}updated(t){if(super.updated(t),At(this,t),t.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},""),this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new Ht(this.hass),this._fetchMiniStatsForOverview()),this._userService?this._userService.updateHass(this.hass):(this._userService=new ue(this.hass),this._userService.getUsers())}let e=this.shadowRoot?.querySelector(".content");e&&!this._virtScrollAttached&&(e.addEventListener("scroll",this._onVirtualScroll,{passive:!0}),this._virtScrollAttached=!0),this._updateVirtualWindow()}_updateVirtualWindow(){let t=this.shadowRoot?.querySelector(".content"),e=this.shadowRoot?.querySelector(".task-table.virtual");if(!t||!e)return;let i=e.querySelector(".task-row:not(.virt-sizer)");i&&i.offsetHeight>20&&(this._virtRowHeight=i.offsetHeight);let a=e.getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop,n=Ne({scrollTop:t.scrollTop,viewportHeight:t.clientHeight,listTop:a,rowHeight:this._virtRowHeight,total:this._virtTotalRows});(n.start!==this._virtStart||n.end!==this._virtEnd)&&(this._virtStart=n.start,this._virtEnd=n.end)}async _loadData(){let[t,e,i,a,n,h]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"}).catch(()=>null)]);if(h&&(this._savedViews=h.views||[]),t&&(this._objects=St(t.objects),Qt(this._objects,e??this._stats??null),this._maybeLoadGettingStarted()),this._view==="task"&&this._selectedEntryId&&this._selectedTaskId&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/status"}).then(c=>{this._batteryFleetSetupAvailable=!!c.available&&!c.configured}).catch(()=>{this._batteryFleetSetupAvailable=!1}),this._staleChecked||(this._staleChecked=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/version"}).then(c=>{this._staleBundle=ae(c?.version)}).catch(()=>{})),e&&(this._stats=e),i&&(this._budget=i),a&&(this._groups=a.groups||{}),n){let c=n;this._features=c.features,this._adminPanelUserIds=c.admin_panel_user_ids||[],this._operatorWriteEnabled=c.operator_write_enabled??!1;let p=c.general?.default_warning_days;typeof p=="number"&&p>=0&&p<=365&&(this._defaultWarningDays=p),this._objectsTableColumns=pe(c.objects_table_columns)}this._fetchMiniStatsForOverview(),this._handleDeepLink()}_handleDeepLink(){if(this._deepLinkHandled)return;let t=new URLSearchParams(window.location.search),e=t.get("ms_action"),i=()=>{let g=window.location.pathname+window.location.hash;history.replaceState(history.state,"",g)};if(e==="add_object"){this._deepLinkHandled=!0,i(),this._ui("maintenance-object-dialog").then(g=>g?.openCreate());return}if(e==="open_vacation"||e==="open_budget"||e==="open_groups"||e==="open_settings"){this._deepLinkHandled=!0,i(),this._overviewTab="settings",this._ensureLazyUi().then(()=>requestAnimationFrame(()=>{let g=this.shadowRoot?.querySelector("maintenance-settings-view"),m=e.replace("open_","");g?.scrollToSection?.(m)}));return}let a=t.get("entry_id");if(!a)return;this._deepLinkHandled=!0;let n=t.get("task_id"),h=t.get("action"),c=window.location.pathname+window.location.hash;history.replaceState(history.state,"",c);let p=this._getObject(a);if(!p){this._showOverview();return}if(n){let g=p.tasks.find(m=>m.id===n);if(!g){this._showObject(a);return}this._showTask(a,n),h==="complete"?requestAnimationFrame(()=>{this._openCompleteDialog(a,n,g.name,this._features.checklists?g.checklist:void 0,this._features.adaptive&&!!g.adaptive_config?.enabled)}):h==="quick_complete"&&requestAnimationFrame(()=>{this._handleQuickComplete(a,n,g)})}else this._showObject(a)}_isCounterEntity(t){if(!t)return!1;let e=t.type||"threshold";return e==="counter"||e==="state_change"}async _fetchDetailStats(t,e){if(!this._statsService)return;let i=await this._statsService.getDetailStats(t,e,this._chartRangeDays),a=new Map(this._detailStatsData);a.set(t,i),this._detailStatsData=a}_setChartRange(t){if(t===this._chartRangeDays)return;this._chartRangeDays=t;try{B(R.chartRange,String(t))}catch{}let e=this._selectedEntryId&&this._selectedTaskId?this._getTask(this._selectedEntryId,this._selectedTaskId):null,i=e?.trigger_config?.entity_id;if(i){let a=new Map(this._detailStatsData);a.delete(i),this._detailStatsData=a,this._fetchDetailStats(i,this._isCounterEntity(e.trigger_config))}}_setHideOutliers(t){if(t!==this._hideOutliers){this._hideOutliers=t;try{B(R.chartHideOutliers,t?"1":"0")}catch{}}}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let t=[];for(let i of this._objects)for(let a of i.tasks){let n=a.trigger_config?.entity_id;n&&t.push({entityId:n,isCounter:this._isCounterEntity(a.trigger_config)})}if(t.length===0)return;let e=await this._statsService.getBatchMiniStats(t);this._miniStatsData=new Map([...this._miniStatsData,...e])}async _subscribe(){try{let t=await this.hass.connection.subscribeMessage(e=>{let i=e,a=ke(this._objects,i);a!==null&&(this._objects=a,e.objects&&Qt(a,this._stats??null))},{type:"maintenance_supporter/subscribe",deltas:!0,compact:!0});if(!this.isConnected){t();return}this._unsub=t}catch{}}get _taskRows(){let t=[];for(let m of this._objects)for(let v of m.tasks){if(!this._showArchived&&v.archived||this._filterStatus&&v.status!==this._filterStatus)continue;if(this._filterUser){let $=this._filterUser==="current_user"?this._userService?.getCurrentUserId():this._filterUser;if(v.responsible_user_id!==$)continue}if(this._filterLabel&&!(v.labels||[]).includes(this._filterLabel)||this._filterPriority&&(v.priority||"normal")!==this._filterPriority)continue;let x=[];for(let $ of Object.values(this._groups))$.task_refs?.some(k=>k.entry_id===m.entry_id&&k.task_id===v.id)&&x.push($.name);t.push({entry_id:m.entry_id,task_id:v.id,object_name:m.object.name,task_name:v.name,type:v.type,schedule_type:v.schedule_type,status:v.status,days_until_due:v.days_until_due??null,next_due:v.next_due??null,trigger_active:v.trigger_active,trigger_current_value:v.trigger_current_value??null,trigger_current_delta:v.trigger_current_delta??null,trigger_config:v.trigger_config??null,trigger_entity_info:v.trigger_entity_info??null,times_performed:v.times_performed,total_cost:v.total_cost,interval_days:v.interval_days??null,interval_unit:v.interval_unit??null,interval_anchor:v.interval_anchor??null,is_done:v.is_done??!1,archived:v.archived??!1,history:v.history||[],enabled:v.enabled,nfc_tag_id:v.nfc_tag_id??null,priority:v.priority??"normal",labels:v.labels??[],area_id:m.object.area_id??null,responsible_user_id:v.responsible_user_id??null,group_names:x})}let e={overdue:0,triggered:1,due_soon:2,ok:3},i=(m,v)=>(e[m.status]??9)-(e[v.status]??9),a=(m,v)=>(m.days_until_due??99999)-(v.days_until_due??99999),n=(m,v)=>i(m,v)||a(m,v),h=m=>m.area_id&&this.hass?.areas?.[m.area_id]?.name||"",c=m=>m.responsible_user_id&&this._userService?.getUserName(m.responsible_user_id)||"",p=m=>m.group_names[0]||"",g={due_date:n,object:(m,v)=>m.object_name.localeCompare(v.object_name)||n(m,v),type:(m,v)=>m.type.localeCompare(v.type)||n(m,v),task_name:(m,v)=>m.task_name.localeCompare(v.task_name),area:(m,v)=>{let x=h(m),$=h(v);return!x&&$?1:x&&!$?-1:x.localeCompare($)||n(m,v)},assigned_user:(m,v)=>{let x=c(m),$=c(v);return!x&&$?1:x&&!$?-1:x.localeCompare($)||n(m,v)},group:(m,v)=>{let x=p(m),$=p(v);return!x&&$?1:x&&!$?-1:x.localeCompare($)||n(m,v)}};return t.sort(g[this._sortMode]),t}_getObject(t){return this._objects.find(e=>e.entry_id===t)}_getTask(t,e){return this._getObject(t)?.tasks.find(a=>a.id===e)}_pushPanelState(t,e,i){let a={msp_view:t,msp_entry:e||null,msp_task:i||null};history.pushState(a,"")}_onPopState(t){let e=t.state;if(e?.msp_view&&(this._view=e.msp_view,this._selectedEntryId=e.msp_entry||null,this._selectedTaskId=e.msp_task||null,this._moreMenuOpen=!1,e.msp_view==="all_parts"&&this._loadAllParts(),e.msp_view==="task"&&e.msp_entry&&e.msp_task)){this._historyFilter=null;let i=this._getTask(e.msp_entry,e.msp_task);i?.trigger_config?.entity_id&&this._fetchDetailStats(i.trigger_config.entity_id,this._isCounterEntity(i.trigger_config))}}_showOverview(){this._pushPanelState("overview"),this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()}_showAllObjects(){this._pushPanelState("all_objects"),this._view="all_objects",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_showAllParts(){this._pushPanelState("all_parts"),this._view="all_parts",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop(),this._loadAllParts()}async _loadAllParts(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});this._allParts=t.parts||[]}catch{this._allParts=[]}}_filterByStatus(t){this._filterStatus=t,this._activeViewId="",this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard"),this._scrollContentToTop()}get _allLabels(){let t=new Set;for(let e of this._objects)for(let i of e.tasks)for(let a of i.labels||[])t.add(a);return[...t].sort((e,i)=>e.localeCompare(i))}get _currentFilters(){return{status:this._filterStatus,user_id:this._filterUser,label:this._filterLabel,priority:this._filterPriority,archived:this._showArchived,sort_mode:this._sortMode,group_by:this._groupByMode}}_applyView(t){if(this._activeViewId=t,!t)return;let e=this._savedViews.find(a=>a.id===t);if(!e)return;let i=e.filters;this._filterStatus=i.status||"",this._filterUser=i.user_id||null,this._filterLabel=i.label||null,this._filterPriority=i.priority||"",this._showArchived=!!i.archived,["due_date","object","type","task_name","area","assigned_user","group"].includes(i.sort_mode)&&(this._sortMode=i.sort_mode),["none","area","group","user"].includes(i.group_by)&&(this._groupByMode=i.group_by);try{B(R.taskSort,this._sortMode),B(R.groupBy,this._groupByMode)}catch{}this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard")}_openSavedViewsDialog(){this.shadowRoot.querySelector("maintenance-saved-views-dialog")?.open(this._currentFilters,this._savedViews)}_onSavedViewsChanged(t){this._savedViews=t.detail.views||[],this._activeViewId&&!this._savedViews.some(e=>e.id===this._activeViewId)&&(this._activeViewId="")}_scrollContentToTop(){requestAnimationFrame(()=>{let t=this.shadowRoot?.querySelector(".content");t&&t.scrollTo({top:0,behavior:"smooth"})})}_showObject(t){this._pushPanelState("object",t),this._view="object",this._selectedEntryId=t,this._selectedTaskId=null,this._scrollContentToTop()}_showTask(t,e){this._pushPanelState("task",t,e),this._view="task",this._selectedEntryId=t,this._selectedTaskId=e,this._activeTab="overview",this._historyFilter=null,this._scrollContentToTop(),this._fetchFullHistory(t,e);let i=this._getTask(t,e);if(i?.trigger_config?.entity_id){let a=i.trigger_config.entity_id,n=this._isCounterEntity(i.trigger_config);this._fetchDetailStats(a,n)}}_showToast(t){this._toastTimer&&clearTimeout(this._toastTimer),this._toastUndo=null,this._toastActionLabel="",this._toastMessage=t,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastTimer=null},4e3)}_showActionToast(t,e,i){this._showUndoToast(t,i),this._toastActionLabel=e}_showUndoToast(t,e){this._toastTimer&&clearTimeout(this._toastTimer),this._toastActionLabel="",this._toastMessage=t,this._toastUndo=e,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastUndo=null,this._toastTimer=null},7e3)}_runToastUndo(){let t=this._toastUndo;this._toastTimer&&clearTimeout(this._toastTimer),this._toastMessage="",this._toastUndo=null,this._toastTimer=null,t?.()}_openPalette(){this._paletteQuery="",this._paletteActive=0,this._paletteOpen=!0,this.updateComplete.then(()=>{this.shadowRoot?.querySelector(".palette-input")?.focus()})}_closePalette(){this._paletteOpen=!1,this._paletteQuery=""}get _paletteResults(){let t=this._paletteQuery.trim().toLowerCase(),e=[];for(let i of this._objects){let a=i.object.name||"";(!t||a.toLowerCase().includes(t))&&e.push({kind:"object",entryId:i.entry_id,label:a,sub:s("object",this._lang)});for(let n of i.tasks){if(n.archived)continue;let h=n.name||"",c=(n.labels||[]).some(p=>p.toLowerCase().includes(t));if(!t||h.toLowerCase().includes(t)||a.toLowerCase().includes(t)||c){let p=(n.labels||[]).length?`  #${(n.labels||[]).join(" #")}`:"";e.push({kind:"task",entryId:i.entry_id,taskId:n.id,label:h,sub:a+p})}}if(e.length>60)break}return e.slice(0,40)}_selectPaletteResult(t){this._closePalette(),t.kind==="task"&&t.taskId?this._showTask(t.entryId,t.taskId):this._showObject(t.entryId)}_renderPalette(){if(!this._paletteOpen)return d;let t=this._lang,e=this._paletteResults;return r`
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
    `}_openAdoptProblemSensors(){this._ui("maintenance-adopt-problem-sensors-dialog").then(t=>t?.open())}async _onProblemSensorsAdopted(t){let e=t.detail?.tasks_created??0,i=t.detail?.created??[];await this._loadData();let a=s("adopt_problem_done",this._lang).replace("{tasks}",String(e));i.length>0?this._showActionToast(a,s("adopt_problem_configure",this._lang),()=>{let n=i[0],h=this._objects.find(p=>p.entry_id===n.entry_id),c=h?.tasks.find(p=>p.id===n.task_id);h&&c&&this._ui("maintenance-task-dialog").then(p=>p?.openEdit(n.entry_id,c))}):this._showToast(a)}async _setupBatteryFleet(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/setup",language:this.hass.language||"en"});this._batteryFleetSetupAvailable=!1,await this._loadData();let e=this._objects.find(a=>a.entry_id===t.entry_id),i=e?.tasks.find(a=>a.id===t.task_id)||e?.tasks[0];e&&i&&this._showTask(e.entry_id,i.id),this._showToast(s("battery_fleet_setup_done",this._lang))}catch(t){this._showToast(T(t,this._lang))}}_openSuggestedSetups(){this._ui("maintenance-suggested-setups-dialog").then(t=>t?.open())}_onSetupsAdopted(t){let e=t.detail?.tasks_created??0;this._showToast(s("setups_done",this._lang).replace("{tasks}",String(e))),this._loadData()}async _openTemplateGallery(){if(this._templateGalleryOpen=!0,!(this._templates.length>0))try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/templates",language:this._lang});this._templateCategories=t.categories||{},this._templates=(t.templates||[]).filter(e=>!e.disabled)}catch{this._showToast(s("action_error",this._lang))}}async _createFromTemplate(t){this._templateBusy=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/from_template",language:this._lang,template_id:t});this._templateGalleryOpen=!1,await this._loadData(),this._showToast(s("template_created",this._lang)),e?.entry_id&&this._showObject(e.entry_id)}catch{this._showToast(s("action_error",this._lang))}finally{this._templateBusy=!1}}_categoryName(t){let e=this._templateCategories[t];return e&&(e[`name_${this._lang}`]||e.name_en)||t}_renderTemplateGallery(){if(!this._templateGalleryOpen)return d;let t=this._lang,e=new Map;for(let i of this._templates)e.has(i.category)||e.set(i.category,[]),e.get(i.category).push(i);return r`
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
                      ${a.map(n=>r`
                        <button class="template-card" .disabled=${this._templateBusy}
                          @click=${()=>this._createFromTemplate(n.id)}>
                          <span class="template-card-name">${n.name}</span>
                          <span class="template-card-count">${s("templates_task_count",t).replace("{n}",String(n.tasks.length))}</span>
                        </button>
                      `)}
                    </div>
                  </div>
                `)}
          </div>
        </div>
      </div>
    `}_bulkKey(t){return`${t.entry_id}:${t.task_id}`}_toggleBulkMode(){this._bulkMode=!this._bulkMode,this._bulkMode||(this._bulkSelected=new Set)}_toggleBulkRow(t){let e=this._bulkKey(t),i=new Set(this._bulkSelected);i.has(e)?i.delete(e):i.add(e),this._bulkSelected=i}_bulkSelectAll(t){let e=t.map(a=>this._bulkKey(a)),i=e.every(a=>this._bulkSelected.has(a));this._bulkSelected=i?new Set:new Set(e)}async _runBulk(t,e,i,a){let n=t.filter(c=>this._bulkSelected.has(this._bulkKey(c)));if(n.length===0)return;this._actionLoading=!0;let h=0;for(let c of n)try{await this.hass.connection.sendMessagePromise(e(c)),h++}catch{}this._actionLoading=!1,this._bulkSelected=new Set,this._bulkMode=!1,await this._loadData(),a&&h>0?this._showUndoToast(i(h),a):this._showToast(i(h))}_bulkComplete(t){this._runBulk(t,e=>({type:"maintenance_supporter/task/complete",entry_id:e.entry_id,task_id:e.task_id}),e=>s("bulk_completed",this._lang).replace("{n}",String(e)))}_bulkArchive(t){let e=t.filter(i=>this._bulkSelected.has(this._bulkKey(i))).map(i=>({entry_id:i.entry_id,task_id:i.task_id}));this._runBulk(t,i=>({type:"maintenance_supporter/task/archive",entry_id:i.entry_id,task_id:i.task_id}),i=>s("bulk_archived",this._lang).replace("{n}",String(i)),async()=>{for(let i of e)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/unarchive",entry_id:i.entry_id,task_id:i.task_id})}catch{}await this._loadData()})}async _runAction(t,e){this._actionLoading=!0;try{let i=await this.hass.connection.sendMessagePromise(t);return await this._loadData(),e?.successToast&&this._showToast(e.successToast),i??{}}catch(i){return this._showToast(T(i,this._lang)),null}finally{this._actionLoading=!1}}async _deleteObject(t){if(!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("confirm_delete_object",this._lang),confirmText:s("delete",this._lang),danger:!0}))return;await this._runAction({type:"maintenance_supporter/object/delete",entry_id:t})&&this._showOverview()}_printObjectReport(t){let e=this._getObject(t);if(!e)return;let i=this._lang,a={title:s("report_title",i),generated:s("report_generated",i),manufacturer:s("manufacturer",i),model:s("model",i),serial:s("serial_number_label",i),installed:s("installed",i),warranty:s("warranty",i),area:s("area",i),notes:s("report_notes",i),tasksHeading:s("tasks",i),colTask:s("task_name",i),colType:s("report_col_type",i),colStatus:s("report_col_status",i),colSchedule:s("report_col_schedule",i),colLastDone:s("last_performed",i),colNextDue:s("next_due",i),colCost:s("cost",i),colTimes:s("report_times_done",i),totalCost:s("report_total_cost",i),scheduleLabel:h=>jt(h,i),none:"\u2014",statusLabel:h=>s(h,i),typeLabel:h=>s(h,i)},n=Te(e.object,e.tasks,a,h=>h?G(h,i):"",this._currencySymbol,new Date().toISOString());Yt(n)}async _duplicateObject(t){let e=await this._runAction({type:"maintenance_supporter/object/duplicate",entry_id:t},{successToast:s("object_duplicated",this._lang)});e?.entry_id&&this._showObject(e.entry_id)}async _deleteTask(t,e){if(!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("confirm_delete_task",this._lang),confirmText:s("delete",this._lang),danger:!0}))return;await this._runAction({type:"maintenance_supporter/task/delete",entry_id:t,task_id:e})&&this._showObject(t)}async _duplicateTask(t,e){this._moreMenuOpen=!1;let i=await this._runAction({type:"maintenance_supporter/task/duplicate",entry_id:t,task_id:e},{successToast:s("task_duplicated",this._lang)});i?.task_id&&this._showTask(t,i.task_id)}async _toggleArchiveTask(t,e,i){await this._runAction({type:i?"maintenance_supporter/task/unarchive":"maintenance_supporter/task/archive",entry_id:t,task_id:e})&&!i&&this._showUndoToast(s("task_archived",this._lang),()=>this._toggleArchiveTask(t,e,!0))}async _toggleArchiveObject(t,e){await this._runAction({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:t})&&!e&&this._showUndoToast(s("object_archived",this._lang),()=>this._toggleArchiveObject(t,!0))}async _togglePauseObject(t,e){if(!e){let a=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:s("pause_object",this._lang),message:s("pause_until_prompt",this._lang),confirmText:s("pause_object",this._lang),inputLabel:s("pause_until_label",this._lang),inputType:"date"});if(!a?.confirmed)return;let n={type:"maintenance_supporter/object/pause",entry_id:t};a.value&&(n.until=a.value),await this._runAction(n)&&this._showUndoToast(s("object_paused",this._lang),()=>this._togglePauseObject(t,!0));return}await this._runAction({type:"maintenance_supporter/object/resume",entry_id:t},{successToast:s("object_resumed",this._lang)})}async _replaceObject(t,e){let a=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:s("replace_object",this._lang),message:s("replace_object_prompt",this._lang),confirmText:s("replace_object",this._lang),inputLabel:s("replace_name_label",this._lang),inputType:"text",inputValue:e});if(!a?.confirmed)return;let n=await this._runAction({type:"maintenance_supporter/object/replace",entry_id:t,name:a.value||e},{successToast:s("object_replaced",this._lang)});n?.entry_id&&this._showObject(n.entry_id)}async _skipTask(t,e,i){let a={type:"maintenance_supporter/task/skip",entry_id:t,task_id:e};i&&(a.reason=i),await this._runAction(a)}async _resetTask(t,e,i){let a={type:"maintenance_supporter/task/reset",entry_id:t,task_id:e};i&&(a.date=i),await this._runAction(a)}async _applySuggestion(t,e,i){await this._runAction({type:"maintenance_supporter/task/apply_suggestion",entry_id:t,task_id:e,interval:i})}_openSeasonalOverrides(t){let e=this.shadowRoot.querySelector("maintenance-seasonal-overrides-dialog");if(!e||!this._selectedEntryId)return;let i=t.adaptive_config?.seasonal_overrides;e.open(this._selectedEntryId,t.id,i)}async _reanalyzeInterval(t,e){let i=await this._runAction({type:"maintenance_supporter/task/analyze_interval",entry_id:t,task_id:e});i&&(i.recommended_interval?this._showToast(`${s("reanalyze_result",this._lang)}: ${i.recommended_interval} ${s("days",this._lang)} (${s(`confidence_${i.confidence}`,this._lang)}, ${i.data_points} ${s("data_points",this._lang)})`):this._showToast(s("reanalyze_insufficient_data",this._lang)))}async _promptSkipTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("skip",this._lang),message:s("skip_reason_prompt",this._lang),confirmText:s("skip",this._lang),inputLabel:s("reason_optional",this._lang),inputType:"text"});a.confirmed&&this._skipTask(t,e,a.value||void 0)}async _promptResetTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("reset",this._lang),message:s("reset_date_prompt",this._lang),confirmText:s("reset",this._lang),inputLabel:s("reset_date_optional",this._lang),inputType:"date"});a.confirmed&&this._resetTask(t,e,a.value||void 0)}async _postponeTask(t,e,i){await this._runAction({type:"maintenance_supporter/task/postpone",entry_id:t,task_id:e,until:i},{successToast:s("postponed",this._lang)})}async _promptPostponeTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("postpone",this._lang),message:s("postpone_date_prompt",this._lang),confirmText:s("postpone",this._lang),inputLabel:s("postpone_date_label",this._lang),inputType:"date"});!a.confirmed||!a.value||this._postponeTask(t,e,a.value)}async _snoozeTask(t,e){await this._runAction({type:"maintenance_supporter/task/snooze",entry_id:t,task_id:e},{successToast:s("snoozed",this._lang)})}_dismissSuggestion(t,e){t&&e&&this._dismissedSuggestions.add(`${t}_${e}`),this.requestUpdate()}async _handleQuickComplete(t,e,i){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/quick_complete",entry_id:t,task_id:e}),this._showToast(s("quick_complete_success",this._lang))}catch(a){(a?.code||"")==="no_defaults"?this._openCompleteDialog(t,e,i.name,this._features.checklists?i.checklist:void 0,this._features.adaptive&&!!i.adaptive_config?.enabled):this._showToast(s("action_error",this._lang))}}async _printTaskWorksheet(t,e){let i=this._getObject(t),a=i?.tasks.find(n=>n.id===e);if(!(!i||!a)){this._actionLoading=!0;try{let n={type:"maintenance_supporter/qr/generate",entry_id:t,task_id:e,url_mode:"server"},[h,c]=await Promise.all([this.hass.connection.sendMessagePromise({...n,action:"view"}).catch(()=>null),this.hass.connection.sendMessagePromise({...n,action:"complete"}).catch(()=>null)]),p=null;try{let k=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:t})).documents||[]).find(S=>S.kind==="file"&&S.mime==="application/pdf"&&(S.task_ids||[]).includes(e)&&S.task_pages?.[e]);if(k){let S=k.task_pages[e],M=4,V={path:await le(this.hass,`/api/maintenance_supporter/document/${k.id}/excerpt?start=${S}&count=${M}`,3600)};p={title:k.title||k.filename||"Manual",startPage:S,endPage:S+M-1,url:new URL(V.path,window.location.origin).toString(),vendorBase:new URL("/maintenance_supporter_vendor",window.location.origin).toString()}}}catch{}let g=this._lang,m={title:s("worksheet",g),object:s("object",g),type:s("maintenance_type",g),interval:s("interval",g),nextDue:s("next_due",g),lastDone:s("last_performed",g),priority:s("priority",g),checklist:s("checklist",g),notes:s("notes_label",g),scanView:s("worksheet_scan_view",g),scanComplete:s("worksheet_scan_complete",g),manualExcerpt:s("worksheet_manual_excerpt",g),pages:s("worksheet_pages",g),printedOn:s("worksheet_printed",g),never:s("worksheet_never",g),typeLabel:$=>s($,g),statusLabel:$=>s($,g),parts:s("consumes_parts_label",g)},v=(a.consumes_parts||[]).map($=>Gt($,i.entry_id,this._objects,g)),x=Se(a,i.object.name,m,$=>G($,g),$=>jt($,g),h?.svg_data_uri||null,c?.svg_data_uri||null,p,new Date().toISOString(),v);Yt(x)}finally{this._actionLoading=!1}}}_openManualDoc(t){if(t.kind!=="file"){N(t.url)&&window.open(t.url,"_blank","noopener");return}_t(this.hass,t.id).catch(()=>{})}async _setChecklistItem(t,e,i,a){let h=this._getObject(t)?.tasks.find(p=>p.id===e);if(!h)return;let c={};for(let p of h.checklist||[]){let g=h.checklist_progress?.[p]??!1;c[p]=p===i?a:g}await this._runAction({type:"maintenance_supporter/task/checklist_progress",entry_id:t,task_id:e,checklist_state:c})}_openCompleteDialog(t,e,i,a,n){this._ui("maintenance-complete-dialog").then(h=>h&&this._fillAndOpenCompleteDialog(h,t,e,i,a,n))}_fillAndOpenCompleteDialog(t,e,i,a,n,h){t.entryId=e,t.taskId=i,t.taskName=a,t.lang=this._lang,t.checklist=n||[],t.adaptiveEnabled=!!h;let c=this._objects.find(m=>m.entry_id===e)?.tasks.find(m=>m.id===i);t.taskType=c?.type||"",t.readingUnit=c?.reading_unit||"",t.checklistPrefill=c?.checklist_progress||{},t.requiredFields=c?.required_completion_fields||[];let p=this._objects.find(m=>m.entry_id===e)?.parts||[],g=c?.part_ref?p.find(m=>m.id===c.part_ref.part_id):void 0;t.restockDefault=c?.part_ref?g?.restock_quantity??1:null,t.restockUnitCost=c?.part_ref?g?.cost??null:null,t.currencySymbol=this._currencySymbol,t.consumesInfo=(c?.consumes_parts||[]).map(m=>Gt(m,e,this._objects,this._lang)),t.parts=c?.part_ref?[]:he(c,e,this._objects,this._lang),t.consumesParts=c?.part_ref?[]:c?.consumes_parts||[],t.open()}_openQrForObject(t,e){this._ui("maintenance-qr-dialog").then(i=>i?.openForObject(t,e))}_openQrForTask(t,e,i,a){this._ui("maintenance-qr-dialog").then(n=>n?.openForTask(t,e,i,a))}render(){return r`
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
    `}_statusBadge(t,e,i){let a=this._lang,n=t?"archived":e?"done":i,h=t?"archived":e?"completed":i,c=t?s("archived",a):e?s("completed",a):s(i,a);return r`<span class="status-badge ${n}"><ha-icon icon="${Ot[h]||"mdi:circle-medium"}"></ha-icon>${c}</span>`}_setOverviewTab(t){this._overviewTab=t;try{B(R.overviewTab,t)}catch{}this._scrollContentToTop()}_renderToday(){let t=this._lang,e=this._taskRows,i=p=>`${p.entry_id}:${p.task_id}`,a=e.filter(p=>p.status==="overdue"||p.trigger_active),n=new Set(a.map(i)),h=e.filter(p=>!n.has(i(p))&&p.days_until_due===0);h.forEach(p=>n.add(i(p)));let c=e.filter(p=>!n.has(i(p))&&p.days_until_due!=null&&p.days_until_due>0&&p.days_until_due<=7);return a.length+h.length+c.length===0?r`
        <div class="today-empty">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <p>${s("today_all_caught_up",t)}</p>
        </div>
      `:r`
      <div class="today-view">
        ${this._renderTodaySection("today_overdue",a,"overdue")}
        ${this._renderTodaySection("today_due_today",h,"due_soon")}
        ${this._renderTodaySection("today_this_week",c,"")}
      </div>
    `}_renderTodaySection(t,e,i){if(e.length===0)return d;let a=this._lang;return r`
      <div class="today-section">
        <div class="today-section-header ${i}">
          <span>${s(t,a)}</span><span class="today-badge">${e.length}</span>
        </div>
        ${e.map(n=>r`
          <div class="today-row" @click=${()=>this._showTask(n.entry_id,n.task_id)}>
            <span class="today-dot ${n.trigger_active?"triggered":n.status}"></span>
            <div class="today-main">
              <div class="today-task">${n.task_name}</div>
              <div class="today-object">${n.object_name} · ${gt(n.days_until_due,a)}</div>
            </div>
            <mwc-icon-button class="btn-complete" title="${s("complete",a)}"
              @click=${h=>{h.stopPropagation(),this._openCompleteDialogForRow(n)}}>
              <ha-icon icon="mdi:check"></ha-icon>
            </mwc-icon-button>
          </div>
        `)}
      </div>
    `}_renderDashboard(){let t=this._stats,e=this._taskRows,i=this._lang,a=this._isOperator,n=this._objects.reduce((c,p)=>c+p.tasks.filter(g=>g.archived).length,0),h=(this._filterStatus?1:0)+(this._filterUser?1:0)+(this._filterLabel?1:0)+(this._filterPriority?1:0)+(this._activeViewId?1:0);return r`

      ${this.narrow?r`
        <div class="mobile-controls">
          <ha-button
            class="mobile-toggle ${this._filtersOpen?"active":""}"
            @click=${()=>{this._filtersOpen=!this._filtersOpen}}
          >
            <ha-icon icon="mdi:filter-variant"></ha-icon>
            ${s("filter_label",i)}${h>0?` (${h})`:""}
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
            ${this._savedViews.map(c=>r`<option value=${c.id} ?selected=${this._activeViewId===c.id}>${c.name}</option>`)}
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
            @change=${c=>{let p=c.target.value;this._filterUser=p||null,this._activeViewId=""}}
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
              @change=${c=>{let p=c.target.value;this._filterLabel=p||null,this._activeViewId=""}}
            >
              <option value="">${s("all_labels",i)}</option>
              ${this._allLabels.map(c=>r`<option value=${c} ?selected=${this._filterLabel===c}>${c}</option>`)}
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
            ${["high","normal","low"].map(c=>r`<option value=${c} ?selected=${this._filterPriority===c}>${s(`priority_${c}`,i)}</option>`)}
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${s("sort_label",i)}</span>
          <select
            .value=${this._sortMode}
            @change=${c=>{this._sortMode=c.target.value,this._activeViewId="";try{B(R.taskSort,this._sortMode)}catch{}}}
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
            @change=${c=>{this._groupByMode=c.target.value,this._activeViewId="";try{B(R.groupBy,this._groupByMode)}catch{}}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${s("groupby_none",i)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${s("groupby_area",i)}</option>
            ${this._features.groups?r`<option value="group" ?selected=${this._groupByMode==="group"}>${s("groupby_group",i)}</option>`:d}
            <option value="user" ?selected=${this._groupByMode==="user"}>${s("groupby_user",i)}</option>
          </select>
        </label>
        ${n>0?r`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived,this._activeViewId=""}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?s("hide_archived",i):`${s("show_archived",i)} (${n})`}
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
                  <ha-button appearance="plain" @click=${()=>this._ui("maintenance-object-dialog").then(c=>c?.openCreate())}>
                    ${s("new_object",i)}
                  </ha-button>
                </div>
              `:d}
            </div>
          `:r`
            ${this._bulkMode?this._renderBulkBar(e,i):d}
            ${this._groupByMode==="none"?this._renderTaskTable(e):this._renderGroupedTasks(e,i)}
          `}

      ${this._features.groups&&!a?this._renderGroupsSection():d}
      ${a?d:r`<maintenance-storage-section-card
            .hass=${this.hass}
            .objects=${this._objects}
            @open-object=${c=>{let p=c.detail?.entry_id;p&&this._showObject(p)}}
          ></maintenance-storage-section-card>`}
    `}_renderTaskTable(t){let e=this._bulkMode?" bulk":"";if(this._virtTotalRows=t.length,this.narrow||t.length<120)return r`
        <div class="task-table${e}">
          ${t.map(g=>this._renderOverviewRow(g))}
        </div>
      `;let i=t.length,a=this._virtRowHeight,n=Math.max(0,Math.min(this._virtStart,i)),h=this._virtEnd>0?Math.min(this._virtEnd,i):Math.min(i,40);h<n&&(n=0,h=Math.min(i,40));let c=n*a,p=(i-h)*a;return r`
      <div class="task-table${e} virtual">
        ${this._renderVirtSizerRow(t)}
        ${c>0?r`<div class="virt-spacer" style="height:${c}px"></div>`:d}
        ${t.slice(n,h).map(g=>this._renderOverviewRow(g))}
        ${p>0?r`<div class="virt-spacer" style="height:${p}px"></div>`:d}
      </div>
    `}_renderVirtSizerRow(t){let e=this._lang,i="",a=!1,n=!1,h=!1;for(let c of t){let p=c.archived?s("archived",e):c.is_done?s("completed",e):s(c.status,e);p.length>i.length&&(i=p),c.enabled||(a=!0),c.nfc_tag_id&&(n=!0),(c.priority==="high"||c.priority==="low")&&(h=!0)}return r`
      <div class="task-row virt-sizer" aria-hidden="true">
        ${this._bulkMode?r`<span></span>`:d}
        <span class="cell-badges">
          <span class="status-badge"><ha-icon icon="mdi:circle-medium"></ha-icon>${i}</span>
          ${a?r`<span class="badge-disabled">${s("disabled",e)}</span>`:d}
          ${n?r`<span class="nfc-badge"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:d}
          ${h?r`<span class="priority-badge"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>`:d}
        </span>
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
    `}_renderBulkBar(t,e){let i=this._bulkSelected.size,a=t.length>0&&t.every(n=>this._bulkSelected.has(this._bulkKey(n)));return r`
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
    `}_renderGroupedTasks(t,e){let i=new Map,a=s("unassigned",e);for(let c of t){let p=[];this._groupByMode==="area"?p=[(c.area_id?this.hass?.areas?.[c.area_id]?.name:null)||a]:this._groupByMode==="user"?p=[(c.responsible_user_id?this._userService?.getUserName(c.responsible_user_id):null)||a]:this._groupByMode==="group"&&(p=c.group_names.length>0?c.group_names:[a]);for(let g of p)i.has(g)||i.set(g,[]),i.get(g).push(c)}let n=[...i.entries()].sort(([c],[p])=>c===a&&p!==a?1:p===a&&c!==a?-1:c.localeCompare(p)),h=this._groupByMode==="area"?"mdi:map-marker-outline":this._groupByMode==="group"?"mdi:folder-outline":"mdi:account-outline";return r`
      ${n.map(([c,p])=>r`
        <details class="group-section" open>
          <summary class="group-section-header">
            <ha-icon icon="${h}"></ha-icon>
            <span>${c}</span>
            <span class="group-section-count">(${p.length})</span>
          </summary>
          <div class="task-table${this._bulkMode?" bulk":""}">
            ${p.map(g=>this._renderOverviewRow(g))}
          </div>
        </details>
      `)}
    `}_warrantyLabel(t,e,i){return t.kind==="expired"?s("warranty_expired",i):t.kind==="expiring"?s("warranty_expires_in",i).replace("{days}",String(t.days??0)):s("warranty_valid_until",i).replace("{date}",G(e,i))}_renderWarrantyMeta(t,e){let i=Zt(t);return r`<p class="meta">${s("warranty",e)}:
      <span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,t,e)}</span></p>`}_renderAllObjects(){let t=this._lang,e=this._isOperator,i=this._objectViewMode==="table"&&!this.narrow,a=this._objects.filter(g=>g.object.archived).length,n=g=>{let m=1/0;for(let v of g.tasks){let x=v.days_until_due;x!=null&&x<m&&(m=x)}return m},h=this._objects.filter(g=>this._showArchived||!g.object.archived);this._objectSortMode==="alphabetical"?h.sort((g,m)=>g.object.name.localeCompare(m.object.name)):this._objectSortMode==="task_count"?h.sort((g,m)=>m.tasks.length-g.tasks.length||g.object.name.localeCompare(m.object.name)):h.sort((g,m)=>n(g)-n(m)||g.object.name.localeCompare(m.object.name));let c=()=>{let g=new Map;for(let m of h){let v=m.object.area_id,x=v?this.hass?.areas?.[v]?.name||s("unassigned",t):s("no_area",t);g.has(x)||g.set(x,[]),g.get(x).push(m)}return new Map([...g.entries()].sort(([m],[v])=>m.localeCompare(v)))},p=g=>{let m=g.tasks.some(v=>v.status==="overdue"||v.status==="triggered");return r`
        <div class="object-card${m?" object-card-overdue":""}" @click=${()=>this._showObject(g.entry_id)}>
          ${m?r`<span class="overdue-dot" title="${s("has_overdue",t)}"></span>`:d}
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
            @change=${g=>{this._objectSortMode=g.target.value;try{B(R.objectSort,this._objectSortMode)}catch{}}}
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
            @change=${g=>{this._groupByMode=g.target.value;try{B(R.groupBy,this._groupByMode)}catch{}}}
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
      ${i?this._renderObjectsTable(h):this._groupByMode==="area"?r`
          ${[...c().entries()].map(([g,m])=>r`
            <details class="group-section" open>
              <summary class="group-section-header">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <span>${g}</span>
                <span class="group-section-count">(${m.length})</span>
              </summary>
              <div class="objects-grid">${m.map(p)}</div>
            </details>
          `)}
        `:r`<div class="objects-grid">${h.map(p)}</div>`}
    `}_setObjectViewMode(t){this._objectViewMode=t;try{B(R.objectView,t)}catch{}}_renderAllParts(){let t=this._lang,e=this._allParts,i=this._currencySymbol;return r`
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
                      ${a.consumers.length===0?"\u2014":a.consumers.map(n=>r`
                            <span
                              class="part-consumer-chip${n.pooled?" pooled":""}"
                              title=${`${n.object_name??""}: ${n.task_name??n.task_id} (\xD7${n.quantity})`}
                            >${n.pooled?`${n.object_name} \xB7 `:""}${n.task_name??n.task_id}</span>
                          `)}
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `}
    `}_exportPartsCsv(){let t=this._allParts||[],e=h=>{let c=h==null?"":String(h);return/[",\n;]/.test(c)?`"${c.replace(/"/g,'""')}"`:c},a=[["name","object","stock","unit","reorder_threshold","unit_cost","storage_location","vendor","used_by"].join(",")];for(let h of t)a.push([e(h.name),e(h.object_name),e(h.stock),e(h.unit),e(h.reorder_threshold),e(h.cost),e(h.storage_location),e(h.vendor),e(h.consumers.map(c=>`${c.object_name??""}/${c.task_name??c.task_id}\xD7${c.quantity}`).join(" | "))].join(","));let n=new Date().toISOString().slice(0,10);Wt(a.join(`
`),`maintenance_parts_${n}.csv`,"text/csv;charset=utf-8")}async _exportObjectsCsv(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects/csv"}),e=new Date().toISOString().slice(0,10);Wt(t.csv,`maintenance_objects_${e}.csv`,"text/csv;charset=utf-8")}catch{this._showToast(s("action_error",this._lang))}}_renderObjectsTable(t){let e=this._lang,i=this._objectsTableColumns;return r`
      <div class="objects-table-wrap">
        <table class="objects-table">
          <thead>
            <tr>
              ${i.map(a=>{let n=ce.find(c=>c.key===a),h=n&&n.key!=="actions"?s(n.labelKey,e):"";return r`<th class="oc-${a}">${h}</th>`})}
            </tr>
          </thead>
          <tbody>
            ${t.map(a=>r`
              <tr class="objects-table-row" @click=${()=>this._showObject(a.entry_id)}>
                ${i.map(n=>this._renderObjectCell(n,a,e))}
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
        </td>`;case"manufacturer":return r`<td class="oc-manufacturer">${a.manufacturer||"\u2014"}</td>`;case"model":return r`<td class="oc-model">${a.model||"\u2014"}</td>`;case"serial_number":return r`<td class="oc-serial_number">${a.serial_number||"\u2014"}</td>`;case"installation_date":return r`<td class="oc-installation_date">${a.installation_date?G(a.installation_date,i):"\u2014"}</td>`;case"warranty_expiry":return r`<td class="oc-warranty_expiry">${this._renderWarrantyCell(a.warranty_expiry,i)}</td>`;case"area_id":{let n=a.area_id?this.hass?.areas?.[a.area_id]?.name||a.area_id:"\u2014";return r`<td class="oc-area_id">${n}</td>`}case"documentation_url":{let n=(a.manual_docs||[])[0];return r`<td class="oc-documentation_url">${N(a.documentation_url)?r`<a href=${a.documentation_url} target="_blank" rel="noopener noreferrer"
                @click=${h=>h.stopPropagation()}><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:n?r`<a href="#" title=${n.title}
                  @click=${h=>{h.preventDefault(),h.stopPropagation(),this._openManualDoc(n)}}
                  ><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:"\u2014"}</td>`}case"notes":return r`<td class="oc-notes" title=${a.notes||""}>${a.notes||"\u2014"}</td>`;case"task_count":return r`<td class="oc-task_count">${e.tasks.length}</td>`;case"actions":return r`<td class="oc-actions">
          <mwc-icon-button title="${s("qr_code",i)}" @click=${n=>{n.stopPropagation(),this._openQrForObject(e.entry_id,a.name)}}>
            <ha-icon icon="mdi:qrcode"></ha-icon>
          </mwc-icon-button>
        </td>`;default:return r`<td></td>`}}_renderWarrantyCell(t,e){let i=Zt(t);return i.kind==="none"?r`<span class="warranty-none">—</span>`:r`<span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,t,e)}</span>`}async _onSettingsChanged(){await this._loadData()}_renderGroupsSection(){if(!this._features.groups)return d;let t=Object.entries(this._groups),e=this._lang;return r`
      <div class="groups-section">
        <div class="groups-header">
          <h3>${s("groups",e)}</h3>
          <ha-button appearance="plain" @click=${()=>this._openGroupCreate()}>
            ${s("new_group",e)}
          </ha-button>
        </div>
        ${t.length===0?r`<div class="hint">${s("no_groups",e)}</div>`:r`
            <div class="groups-grid">
              ${t.map(([i,a])=>{let n=a.task_refs.map(h=>this._getTask(h.entry_id,h.task_id)?.name).filter(Boolean);return r`
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
                      ${n.length>0?n.map(h=>r`<span class="group-task-chip">${h}</span>`):r`<span style="font-size:12px;color:var(--secondary-text-color)">${s("no_tasks_short",e)}</span>`}
                    </div>
                  </div>
                `})}
            </div>
          `}
      </div>
    `}_openGroupCreate(){this.shadowRoot.querySelector("maintenance-group-dialog")?.openCreate()}_openGroupEdit(t){let e=this._groups[t];e&&this.shadowRoot.querySelector("maintenance-group-dialog")?.openEdit(t,e)}async _deleteGroup(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");(i?await i.confirm({title:s("delete_group",this._lang),message:s("delete_group_confirm",this._lang).replace("{name}",e),confirmText:s("delete",this._lang)}):confirm(`${s("delete_group_confirm",this._lang).replace("{name}",e)}`))&&await this._runAction({type:"maintenance_supporter/group/delete",group_id:t})}_renderBudgetTiles(){let t=this._budget;if(!t)return d;let e=this._lang,i=this._currencySymbol,a=(n,h,c)=>{if(c!==null){let p=Math.min(100,Math.max(0,h/c*100)),g=p>=100?"var(--error-color, #f44336)":p>=t.alert_threshold_pct?"var(--warning-color, #ff9800)":"var(--success-color, #4caf50)";return r`
          <div class="stat-item budget-tile" title="${n}: ${h.toFixed(2)} / ${c.toFixed(2)} ${i}">
            <span class="stat-value budget-tile-value">${h.toFixed(2)} ${i}</span>
            <span class="budget-tile-max">/ ${c.toFixed(0)} ${i}</span>
            <div class="budget-tile-bar"><div style="width:${p}%; background:${g}"></div></div>
            <span class="stat-label">${n}</span>
          </div>
        `}return r`
        <div class="stat-item budget-tile" title="${n}: ${h.toFixed(2)} ${i}">
          <span class="stat-value budget-tile-value">${h.toFixed(2)} ${i}</span>
          <span class="stat-label">${n}</span>
        </div>
      `};return r`
      ${a(s("budget_monthly",e),t.monthly_spent||0,t.monthly_budget>0?t.monthly_budget:null)}
      ${a(s("budget_yearly",e),t.yearly_spent||0,t.yearly_budget>0?t.yearly_budget:null)}
    `}_renderOverviewRow(t){let e=this._lang,i=t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0,a=0,n=Dt.ok,h=!1;if(i&&t.days_until_due!==null){let v=Ft(t.interval_days,t.days_until_due,t.interval_unit);a=v.pct,h=v.overflow,t.status==="overdue"?n=Dt.overdue:t.status==="due_soon"&&(n=Dt.due_soon)}let c=t.area_id?this.hass?.areas?.[t.area_id]?.name:null,p=t.responsible_user_id?this._userService?.getUserName(t.responsible_user_id):null,g=t.group_names.length>0||c||p,m=this._bulkMode&&this._bulkSelected.has(this._bulkKey(t));return r`
      <div class="task-row${t.enabled?"":" task-disabled"}${m?" bulk-selected":""}">
        ${this._bulkMode?r`
          <label class="cell bulk-check" @click=${v=>v.stopPropagation()}>
            <input type="checkbox" .checked=${m} @change=${()=>this._toggleBulkRow(t)} />
          </label>
        `:d}
        <span class="cell-badges">
          ${this._statusBadge(!!t.archived,t.is_done,t.status)}
          ${t.enabled?d:r`<span class="badge-disabled">${s("disabled",e)}</span>`}
          ${t.nfc_tag_id?r`<span class="nfc-badge" title="${s("nfc_linked",e)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:d}
          ${t.priority==="high"?r`<span class="priority-badge priority-high" title="${s("priority_high",e)}"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>`:d}
          ${t.priority==="low"?r`<span class="priority-badge priority-low" title="${s("priority_low",e)}"><ha-icon icon="mdi:chevron-double-down"></ha-icon></span>`:d}
        </span>
        <span class="cell object-name" @click=${v=>{v.stopPropagation(),this._showObject(t.entry_id)}}>${t.object_name}</span>
        <span class="cell task-name" @click=${()=>this._showTask(t.entry_id,t.task_id)}>${t.task_name}</span>
        <span class="task-sub${g?"":" task-sub-empty"}">
          ${t.group_names.length>0?r`
            <span class="sub-chip" title="${s("groups",e)}">
              <ha-icon icon="mdi:folder-outline"></ha-icon>${t.group_names.join(", ")}
            </span>`:d}
          ${c?r`
            <span class="sub-chip">
              <ha-icon icon="mdi:map-marker-outline"></ha-icon>${c}
            </span>`:d}
          ${p?r`
            <span class="sub-chip" title="${s("responsible_user",e)}">
              <ha-icon icon="mdi:account-outline"></ha-icon>${p}
            </span>`:d}
          ${(t.labels||[]).map(v=>r`
            <span class="sub-chip label-chip" title="${s("labels",e)}">
              <ha-icon icon="mdi:tag-outline"></ha-icon>${v}
            </span>`)}
        </span>
        <span class="cell type">${s(t.type,e)}</span>
        <span class="due-cell" @click=${()=>this._showTask(t.entry_id,t.task_id)}>
          <span class="due-text">${gt(t.days_until_due,e)}</span>
          ${i?r`<div class="days-bar"><div class="days-bar-fill${h?" overflow":""}" style="width:${a}%;background:${n}"></div></div>`:d}
          ${t.trigger_config?Xt(t):!i&&t.trigger_active?r`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:d}
          ${te(t,this._miniStatsData,this._lang)}
        </span>
        <span class="row-actions">
          <mwc-icon-button class="btn-complete" title="${s("complete",e)}" @click=${v=>{v.stopPropagation(),this._openCompleteDialogForRow(t)}}>
            <ha-icon icon="mdi:check"></ha-icon>
          </mwc-icon-button>
          <mwc-icon-button class="btn-skip" title="${s("skip",e)}" .disabled=${this._actionLoading} @click=${v=>{v.stopPropagation(),this._promptSkipTask(t.entry_id,t.task_id)}}>
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </mwc-icon-button>
        </span>
      </div>
    `}_openCompleteDialogForRow(t){let i=this._objects.find(a=>a.entry_id===t.entry_id)?.tasks.find(a=>a.id===t.task_id);this._openCompleteDialog(t.entry_id,t.task_id,t.task_name,this._features.checklists?i?.checklist:void 0,this._features.adaptive&&!!i?.adaptive_config?.enabled)}_renderObjectDetail(){if(!this._selectedEntryId)return d;let t=this._getObject(this._selectedEntryId);if(!t)return r`<p>Object not found.</p>`;let e=t.object,i=this._lang,a=this._isOperator,n=t.tasks.filter(c=>c.archived).length,h=t.tasks.filter(c=>this._showArchived||!c.archived);return r`
      <div class="detail-section">
        <div class="detail-header">
          <h2>${e.name}</h2>
          <div class="action-buttons">
            ${a?d:r`
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(c=>c?.openCreate(t.entry_id))}}>${s("add_task",i)}</ha-button>
              <ha-button appearance="plain" @click=${()=>{this._ui("maintenance-object-dialog").then(c=>c?.openEdit(t.entry_id,e))}}>${s("edit",i)}</ha-button>
            `}
            <div class="more-menu-wrapper">
              <ha-icon-button .disabled=${this._actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${()=>this._toggleObjMenu()}></ha-icon-button>
              ${this._objMenuOpen?r`
                <div class="popup-menu" @click=${c=>c.stopPropagation()}>
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
              ${s("object_paused_badge",i)}${e.paused_until?r` — ${s("paused_until_label",i)} ${G(e.paused_until,i)}`:d}
            </p>`:d}
        ${e.manufacturer||e.model?r`<p class="meta">${[e.manufacturer,e.model].filter(Boolean).join(" ")}</p>`:d}
        ${e.serial_number?r`<p class="meta">${s("serial_number_label",i)}: ${e.serial_number}</p>`:d}
        ${N(e.documentation_url)?r`<p class="meta">${s("documentation_url_label",i)}:
              <a href=${e.documentation_url} target="_blank" rel="noopener noreferrer">${e.documentation_url}</a>
            </p>`:(e.manual_docs||[]).length?r`<p class="meta">${s("documentation_url_label",i)}:
                ${e.manual_docs.slice(0,3).map((c,p)=>r`${p>0?" \xB7 ":""}<a href="#"
                    @click=${g=>{g.preventDefault(),this._openManualDoc(c)}}>${c.title}</a>`)}${e.manual_docs.length>3?r` … +${e.manual_docs.length-3}`:d}
              </p>`:d}
        ${e.installation_date?r`<p class="meta">${s("installed",i)}: ${G(e.installation_date,i)}</p>`:d}
        ${e.warranty_expiry?this._renderWarrantyMeta(e.warranty_expiry,i):d}
        ${e.notes?r`<div class="object-notes">
              <div class="object-notes-label">${s("object_notes_label",i)}</div>
              <div class="object-notes-body">${e.notes}</div>
            </div>`:d}

        <h3>${s("tasks",i)} (${h.length})${n>0?r`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            appearance="plain"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?s("hide_archived",i):`${s("show_archived",i)} (${n})`}
          </ha-button>`:d}</h3>
        ${t.tasks.length===0?r`<div class="empty-state-centered">
              <p class="empty">${s("no_tasks_yet",i)}</p>
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(c=>c?.openCreate(t.entry_id))}}>${s("add_first_task",i)}</ha-button>
            </div>`:r`<div class="task-table">${[...h].sort((c,p)=>{let g={overdue:0,triggered:1,due_soon:2,ok:3};return(g[c.status]??9)-(g[p.status]??9)||(c.days_until_due??99999)-(p.days_until_due??99999)}).map(c=>r`
              <div class="task-row${c.enabled?"":" task-disabled"}">
                <span class="cell-badges">
                  ${this._statusBadge(!!c.archived,!!c.is_done,c.status)}
                  ${c.enabled?d:r`<span class="badge-disabled">${s("disabled",i)}</span>`}
                  ${c.nfc_tag_id?r`<span class="nfc-badge" title="${s("nfc_linked",i)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:d}
                  ${c.document_count?r`<span class="doc-badge" title="${c.document_count} ${s("documents",i)}"><ha-icon icon="mdi:paperclip"></ha-icon>${c.document_count}</span>`:d}
                </span>
                <span class="cell task-name" @click=${()=>this._showTask(t.entry_id,c.id)}>${c.name}</span>
                <span class="task-sub${c.responsible_user_id?"":" task-sub-empty"}">${se(c,p=>this._userService?.getUserName(p)??null)}</span>
                <span class="cell type">${s(c.type,i)}</span>
                <span class="due-cell" @click=${()=>this._showTask(t.entry_id,c.id)}>
                  <span class="due-text">${gt(c.days_until_due,i)}</span>
                  ${c.trigger_config?Xt(c):d}
                  ${te(c,this._miniStatsData,this._lang)}
                </span>
                <span class="row-actions">
                  <mwc-icon-button class="btn-complete" title="${s("complete",i)}" @click=${p=>{p.stopPropagation(),this._openCompleteDialog(t.entry_id,c.id,c.name,this._features.checklists?c.checklist:void 0,this._features.adaptive&&!!c.adaptive_config?.enabled)}}>
                    <ha-icon icon="mdi:check"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button class="btn-skip" title="${s("skip",i)}" .disabled=${this._actionLoading} @click=${p=>{p.stopPropagation(),this._promptSkipTask(t.entry_id,c.id)}}>
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
    `}_togglePopup(t,e){let i=!t();e(i),i&&setTimeout(()=>{let a=()=>{e(!1),document.removeEventListener("click",a)};document.addEventListener("click",a)},0)}_toggleNewMenu(){this._togglePopup(()=>this._newMenuOpen,t=>{this._newMenuOpen=t})}_closeNewMenu(){this._newMenuOpen=!1}_isYoungInstall(){let t=this._objects.filter(i=>!i.object?.battery_fleet),e=t.reduce((i,a)=>i+a.tasks.length,0);return t.length<3&&e<8}_gsDismissed(){try{return new Set(JSON.parse(K(R.gettingStartedDismissed)||"[]"))}catch{return new Set}}_dismissGettingStarted(t){let e=this._gsDismissed();e.add(t);try{B(R.gettingStartedDismissed,JSON.stringify([...e]))}catch{}this.requestUpdate()}_maybeLoadGettingStarted(){this._gsLoaded||!this._isYoungInstall()||(this._gsLoaded=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/discover"}).then(t=>{this._gsSetupsCount=(t.setups||[]).length}).catch(()=>{this._gsSetupsCount=0}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/problem_sensors/discover"}).then(t=>{this._gsAdoptCount=(t.sensors||[]).length}).catch(()=>{this._gsAdoptCount=0}))}_renderGettingStartedChips(t){let e=this._gsDismissed(),i=this._isYoungInstall(),a=[];return i&&this._gsSetupsCount>0&&!e.has("setups")&&a.push({id:"setups",icon:"mdi:auto-fix",text:s("gs_setups_chip",t).replace("{n}",String(this._gsSetupsCount)),run:()=>this._openSuggestedSetups()}),i&&this._gsAdoptCount>0&&!e.has("adopt")&&a.push({id:"adopt",icon:"mdi:alert-circle-check-outline",text:s("gs_adopt_chip",t).replace("{n}",String(this._gsAdoptCount)),run:()=>this._openAdoptProblemSensors()}),this._batteryFleetSetupAvailable&&!e.has("fleet")&&a.push({id:"fleet",icon:"mdi:battery-sync",text:s("gs_fleet_chip",t),run:()=>this._setupBatteryFleet()}),a.length===0?d:r`
      <div class="gs-chips-wrap">
        <div class="gs-chips-label">${s("gs_label",t)}</div>
        <div class="gs-chips">
          ${a.map(n=>r`
            <div class="gs-chip" @click=${()=>n.run()}>
              <ha-icon icon="${n.icon}"></ha-icon>
              <span>${n.text}</span>
              <span class="gs-chip-x" title="${s("dismiss",t)}"
                @click=${h=>{h.stopPropagation(),this._dismissGettingStarted(n.id)}}>
                <ha-icon icon="mdi:close"></ha-icon>
              </span>
            </div>
          `)}
        </div>
      </div>
    `}_toggleObjMenu(){this._togglePopup(()=>this._objMenuOpen,t=>{this._objMenuOpen=t})}_closeObjMenu(){this._objMenuOpen=!1}_toggleMoreMenu(){this._togglePopup(()=>this._moreMenuOpen,t=>{this._moreMenuOpen=t})}_closeMoreMenu(){this._moreMenuOpen=!1}get _sparklineCtx(){return{lang:this._lang,detailStatsData:this._detailStatsData,hasStatsService:!!this._statsService,isCounterEntity:t=>this._isCounterEntity(t),rangeDays:this._chartRangeDays,setRangeDays:t=>this._setChartRange(t),hideOutliers:this._hideOutliers,setHideOutliers:t=>this._setHideOutliers(t)}}_toggleSection(t){let e=new Set(this._collapsedSections);e.has(t)?e.delete(t):e.add(t),this._collapsedSections=e;try{B(R.collapsedSections,JSON.stringify([...e]))}catch{}}_historyCtx(){let t=this._selectedEntryId&&this._selectedTaskId?this._getObject(this._selectedEntryId)?.tasks.find(n=>n.id===this._selectedTaskId):void 0,e=this._fullHistory,a=(e&&e.entryId===this._selectedEntryId&&e.taskId===this._selectedTaskId&&e.entries.length>(t?.history||[]).length?e.entries:t?.history||[]).filter(n=>n.reading_value!=null).sort((n,h)=>n.timestamp.localeCompare(h.timestamp));return{lang:this._lang,hass:this.hass,filter:this._historyFilter,search:this._historySearch,currencySymbol:this._currencySymbol,setFilter:n=>{this._historyFilter=n},setSearch:n=>{this._historySearch=n},openEdit:n=>this._openHistoryEdit(n),readingUnit:t?.reading_unit??null,readingDelta:n=>{let h=a.findIndex(c=>c.timestamp===n.timestamp);return h<=0?null:n.reading_value-a[h-1].reading_value}}}_taskDetailCtx(){let t=this._selectedEntryId,e=this._selectedTaskId,i=this._getObject(t);return{lang:this._lang,hass:this.hass,entryId:t,taskId:e,objectName:i?.object.name||"",objectDocUrl:i?.object?.documentation_url??null,objectManualDocs:i?.object?.manual_docs??[],openManualDoc:a=>this._openManualDoc(a),setChecklistItem:(a,n)=>this._setChecklistItem(t,e,a,n),isOperator:this._isOperator,actionLoading:this._actionLoading,moreMenuOpen:this._moreMenuOpen,activeTab:this._activeTab,features:this._features,currencySymbol:this._currencySymbol,collapsedSections:this._collapsedSections,costDurationToggle:this._costDurationToggle,suggestionDismissed:this._dismissedSuggestions.has(`${t}_${e}`),sparkline:this._sparklineCtx,history:this._historyCtx(),getUserName:a=>this._userService?.getUserName(a)??null,setActiveTab:a=>{this._activeTab=a},toggleSection:a=>this._toggleSection(a),setCostDurationToggle:a=>{this._costDurationToggle=a},showTaskView:()=>{this._view="task"},showObject:()=>this._showObject(t),toggleMoreMenu:()=>this._toggleMoreMenu(),closeMoreMenu:()=>this._closeMoreMenu(),openEdit:a=>{this._ui("maintenance-task-dialog").then(n=>n?.openEdit(t,a))},openComplete:a=>this._openCompleteDialog(t,e,a.name,this._features.checklists?a.checklist:void 0,this._features.adaptive&&!!a.adaptive_config?.enabled),promptSkip:()=>this._promptSkipTask(t,e),toggleArchive:a=>this._toggleArchiveTask(t,e,a),openQr:a=>this._openQrForTask(t,e,i?.object.name||"",a),duplicateTask:()=>this._duplicateTask(t,e),promptReset:()=>this._promptResetTask(t,e),promptPostpone:()=>this._promptPostponeTask(t,e),snoozeTask:()=>this._snoozeTask(t,e),printWorksheet:()=>this._printTaskWorksheet(t,e),deleteTask:()=>this._deleteTask(t,e),applySuggestion:a=>this._applySuggestion(t,e,a),reanalyze:()=>this._reanalyzeInterval(t,e),dismissSuggestion:()=>this._dismissSuggestion(t,e),openSeasonalOverrides:a=>this._openSeasonalOverrides(a)}}async _fetchFullHistory(t,e){try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:t,task_id:e});this._selectedEntryId===t&&this._selectedTaskId===e&&(this._fullHistory={entryId:t,taskId:e,entries:i.history||[]})}catch{this._fullHistory=null}}_renderTaskDetail(){if(!this._selectedEntryId||!this._selectedTaskId)return d;let t=this._getTask(this._selectedEntryId,this._selectedTaskId);if(!t)return r`<p>Task not found.</p>`;let e=this._fullHistory,i=e&&e.entryId===this._selectedEntryId&&e.taskId===this._selectedTaskId&&e.entries.length>(t.history||[]).length?{...t,history:e.entries}:t;return r`<maintenance-task-detail-view
      .task=${i}
      .ctx=${this._taskDetailCtx()}
    ></maintenance-task-detail-view>`}_openHistoryEdit(t){if(!this._selectedEntryId||!this._selectedTaskId)return;let e={entry_id:this._selectedEntryId,task_id:this._selectedTaskId,original_timestamp:t.timestamp,type:t.type,timestamp:t.timestamp,notes:t.notes??null,cost:t.cost??null,duration:t.duration??null,completed_by:t.completed_by??null,used_parts:t.used_parts??null};this.shadowRoot?.querySelector("maintenance-history-edit-dialog")?.openEdit(e)}};y.styles=[Lt,Ee],u([w({attribute:!1})],y.prototype,"hass",2),u([w({type:Boolean,reflect:!0})],y.prototype,"narrow",2),u([w({attribute:!1})],y.prototype,"panel",2),u([_()],y.prototype,"_objects",2),u([_()],y.prototype,"_stats",2),u([_()],y.prototype,"_view",2),u([_()],y.prototype,"_allParts",2),u([_()],y.prototype,"_selectedEntryId",2),u([_()],y.prototype,"_selectedTaskId",2),u([_()],y.prototype,"_filterStatus",2),u([_()],y.prototype,"_filterUser",2),u([_()],y.prototype,"_filterLabel",2),u([_()],y.prototype,"_filterPriority",2),u([_()],y.prototype,"_savedViews",2),u([_()],y.prototype,"_activeViewId",2),u([_()],y.prototype,"_unsub",2),u([_()],y.prototype,"_chartRangeDays",2),u([_()],y.prototype,"_hideOutliers",2),u([_()],y.prototype,"_historyFilter",2),u([_()],y.prototype,"_budget",2),u([_()],y.prototype,"_groups",2),u([_()],y.prototype,"_detailStatsData",2),u([_()],y.prototype,"_miniStatsData",2),u([_()],y.prototype,"_features",2),u([_()],y.prototype,"_adminPanelUserIds",2),u([_()],y.prototype,"_operatorWriteEnabled",2),u([_()],y.prototype,"_defaultWarningDays",2),u([_()],y.prototype,"_actionLoading",2),u([_()],y.prototype,"_moreMenuOpen",2),u([_()],y.prototype,"_objMenuOpen",2),u([_()],y.prototype,"_toastMessage",2),u([_()],y.prototype,"_toastUndo",2),u([_()],y.prototype,"_toastActionLabel",2),u([_()],y.prototype,"_filtersOpen",2),u([_()],y.prototype,"_newMenuOpen",2),u([_()],y.prototype,"_gsSetupsCount",2),u([_()],y.prototype,"_gsAdoptCount",2),u([_()],y.prototype,"_batteryFleetSetupAvailable",2),u([_()],y.prototype,"_staleBundle",2),u([_()],y.prototype,"_overviewTab",2),u([_()],y.prototype,"_activeTab",2),u([_()],y.prototype,"_costDurationToggle",2),u([_()],y.prototype,"_historySearch",2),u([_()],y.prototype,"_sortMode",2),u([_()],y.prototype,"_objectSortMode",2),u([_()],y.prototype,"_groupByMode",2),u([_()],y.prototype,"_objectViewMode",2),u([_()],y.prototype,"_objectsTableColumns",2),u([_()],y.prototype,"_showArchived",2),u([_()],y.prototype,"_bulkMode",2),u([_()],y.prototype,"_bulkSelected",2),u([_()],y.prototype,"_virtStart",2),u([_()],y.prototype,"_virtEnd",2),u([_()],y.prototype,"_collapsedSections",2),u([_()],y.prototype,"_paletteOpen",2),u([_()],y.prototype,"_paletteQuery",2),u([_()],y.prototype,"_paletteActive",2),u([_()],y.prototype,"_templateGalleryOpen",2),u([_()],y.prototype,"_templates",2),u([_()],y.prototype,"_templateCategories",2),u([_()],y.prototype,"_templateBusy",2),u([_()],y.prototype,"_fullHistory",2),y=u([re("maintenance-supporter-panel")],y);export{y as MaintenanceSupporterPanel};
