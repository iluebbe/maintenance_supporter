/*! maintenance_supporter frontend 2.84.0 */
import{a as Be,b as Fe,c as qe}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ACT3E3JT.js";import{A as ci,B as di,C as pi,D as hi,E as ui,L as mi,O as _i,a as at,b as Wt,c as Ct,d as yt,e as xt,f as Gt,g as Dt,h as te,i as Ue,j as We,k as ee,l as Ye,m as Ke,n as R,o as Bt,p as _t,q as Et,r as At,s as ve,t as ie,u as se,v as ai,w as ri,x as oi,y as ni,z as li}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-XM6OKCQH.js";import{a as Ne,b as Xt,c as wt,d as Jt,e as Nt,f as Zt,g as Ft,h as ii,i as si,k as gi}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-XV2UGQED.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-SODCV2J2.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-NOGMKIQD.js";import{a as fe}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-PW5R4XWT.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-ZX7ELJYQ.js";import{a as Je,b as Ze,c as ti,d as ei}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-SDXJ7JSR.js";import{b as Ve,h as Ge}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YWARUTNU.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-72EZBRXN.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-JFWPXYF3.js";import{a as me}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-KOD72V74.js";import{c as Qe,d as _e,e as Xe}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-7LKR5NXL.js";import{a as D}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-R6EFOWVO.js";import{A as Q,B as Pe,C as Tt,E as Lt,H as ze,I as Le,K as St,L as Ht,M as He,O as Qt,a as g,b as L,c as o,d as X,f as h,h as H,i as ge,j as Ce,k as De,l as S,m,n as Yt,o as Ie,p as Kt,q as a,r as It,s as U,t as Ae,u as rt,v as zt,x as et,y as K}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-UNDNGVCD.js";var Vi=["assignee_pool","required_completion_fields","checklist","labels","history","readings"],Ui=["checklist_progress"],Wi=["tasks","parts"],Gi=["manual_docs","battery_fleet_excluded"];function be(l,c,t=[]){for(let e of c)l[e]===void 0&&(l[e]=[]);for(let e of t)l[e]===void 0&&(l[e]={})}function Yi(l){let c=l;be(c,Wi),c.object&&typeof c.object=="object"&&be(c.object,Gi);for(let t of c.tasks)be(t,Vi,Ui);return l}function qt(l){for(let c of l)Yi(c);return l}function Ki(l,c){if(c.objects)return c.objects;let t=c.delta||[],e=c.removed||[];if(!t.length&&!e.length)return null;let i=new Map(l.map(s=>[s.entry_id,s]));for(let s of t)i.set(s.entry_id,s);for(let s of e)i.delete(s);return[...i.values()]}function vi(l,c){return c.objects&&qt(c.objects),c.delta&&qt(c.delta),Ki(l,c)}var ye=["today","dashboard","calendar","settings"];var I={printOptions:"msp-print-options",batteryRosterOpen:"msp-bf-roster-open",docSort:"msp-doc-sort",overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort"};function it(l){try{return localStorage.getItem(l)}catch{return null}}function Y(l,c){try{localStorage.setItem(l,c)}catch{}}var Qi=168*3600*1e3;function fi(){try{let l=it(I.objectsCache);if(!l)return null;let c=JSON.parse(l);return c.v!==ge||!Number.isFinite(c.at)||Date.now()-c.at>Qi||!Array.isArray(c.objects)||c.objects.length===0?null:{objects:c.objects,stats:c.stats??null}}catch{return null}}function xe(l,c){if(!(!Array.isArray(l)||l.length===0))try{let t={v:ge,at:Date.now(),objects:l,stats:c};Y(I.objectsCache,JSON.stringify(t))}catch{}}function N(l){return String(l??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c])}function bi(l,c,t,e,i,s){let n=[[t.manufacturer,l.manufacturer],[t.model,l.model],[t.serial,l.serial_number],[t.installed,l.installation_date?e(l.installation_date):null],[t.warranty,l.warranty_expiry?e(l.warranty_expiry):null]].filter(([,p])=>!!p),d=c.map(p=>{let u=t.scheduleLabel(p);return`<tr>
      <td>${N(p.name)}</td>
      <td>${N(t.typeLabel(p.type))}</td>
      <td>${N(t.statusLabel(p.status))}</td>
      <td>${N(u)}</td>
      <td>${N(p.last_performed?e(p.last_performed):t.none)}</td>
      <td>${N(p.next_due?e(p.next_due):t.none)}</td>
      <td class="num">${p.times_performed??0}</td>
      <td class="num">${N(i(p.total_cost??0))}</td>
    </tr>`}).join(""),r=c.reduce((p,u)=>p+(u.total_cost??0),0);return`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${N(t.title)} \u2014 ${N(l.name)}</title>
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
  <h1>${N(l.name)}</h1>
  <p class="sub">${N(t.title)} \xB7 ${N(t.generated)}: ${N(e(s))}</p>
  ${n.length?`<div class="meta">${n.map(([p,u])=>`<div><div class="k">${N(p)}</div>${N(u)}</div>`).join("")}</div>`:""}
  <h2>${N(t.tasksHeading)} (${c.length})</h2>
  <table>
    <thead><tr>
      <th>${N(t.colTask)}</th><th>${N(t.colType)}</th><th>${N(t.colStatus)}</th>
      <th>${N(t.colSchedule)}</th><th>${N(t.colLastDone)}</th><th>${N(t.colNextDue)}</th>
      <th class="num">${N(t.colTimes)}</th><th class="num">${N(t.colCost)}</th>
    </tr></thead>
    <tbody>${d||`<tr><td colspan="8">${N(t.none)}</td></tr>`}</tbody>
    <tfoot><tr><td colspan="7">${N(t.totalCost)}</td><td class="num">${N(i(r))}</td></tr></tfoot>
  </table>
  ${l.notes?`<div class="notes"><strong>${N(t.notes)}:</strong>
${N(l.notes)}</div>`:""}
</body></html>`}function we(l,c=new Date){if(!l)return{kind:"none",days:null,date:null};let t=new Date(`${l}T00:00:00`);if(isNaN(t.getTime()))return{kind:"none",days:null,date:null};let e=Date.UTC(c.getFullYear(),c.getMonth(),c.getDate()),i=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),s=Math.round((i-e)/864e5);return s<0?{kind:"expired",days:s,date:l}:s<=60?{kind:"expiring",days:s,date:l}:{kind:"valid",days:s,date:l}}var q=l=>String(l??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);function yi(l,c,t,e,i,s,n,d,r,p=[],u=null){let _=[[t.object,q(c)],[t.type,q(t.typeLabel(l.type))],[t.interval,q(i(l))],[t.nextDue,l.next_due?q(e(l.next_due)):"\u2014"],[t.lastDone,l.last_performed?q(e(l.last_performed)):q(t.never)]];l.priority&&l.priority!=="normal"&&_.push([t.priority,q(l.priority)]);let v=(l.checklist||[]).map(b=>`<li><span class="box"></span>${q(b)}</li>`).join(""),f=(b,T)=>b?`<figure class="qr"><img src="${b}" alt="" /><figcaption>${q(T)}</figcaption></figure>`:"";return`<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="color-scheme" content="light">
<title>${q(l.name)} \u2014 ${q(t.title)}</title>
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
  h1 .ref { font-size: 12px; font-weight: 500; color: #555; border: 1px solid #ccc; border-radius: 5px; padding: 1px 6px; vertical-align: middle; font-variant-numeric: tabular-nums; }
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
      <h1>${q(l.name)}${u?` <span class="ref">#${q(u)}</span>`:""}</h1>
      <div class="obj">${q(c)}</div>
    </div>
    <div class="qr-row">
      ${f(s,t.scanView)}
      ${f(n,t.scanComplete)}
    </div>
  </header>
  <table class="meta">
    ${_.map(([b,T])=>`<tr><td>${q(b)}</td><td>${T}</td></tr>`).join("")}
  </table>
  ${v?`<h2>${q(t.checklist)}</h2><ul class="check">${v}</ul>`:""}
  ${p.length?`<h2>${q(t.parts)}</h2><ul class="check">${p.map(b=>`<li><span class="box"></span>${q(b)}</li>`).join("")}</ul>`:""}
  ${l.notes?`<h2>${q(t.notes)}</h2><div class="notes">${q(l.notes)}</div>`:""}
  ${d?`<h2>${q(t.manualExcerpt)}</h2>
    <div class="excerpt">${q(d.title)} \u2014 ${q(t.pages)} ${d.startPage}\u2013${d.endPage}:
      <a href="${q(d.url)}" target="_blank" rel="noopener">PDF</a>
    </div>
    <div id="excerpt-pages" class="excerpt-pages"></div>
    ${d.vendorBase?`<script type="module">
      // Render the excerpt pages inline (downscaled, two per row) so the
      // whole work sheet prints as ONE document. The link above stays as
      // the fallback if pdf.js or the fetch fails.
      try {
        const pdfjs = await import(${JSON.stringify(d.vendorBase+"/pdf.min.mjs")});
        pdfjs.GlobalWorkerOptions.workerSrc = ${JSON.stringify(d.vendorBase+"/pdf.worker.min.mjs")};
        const doc = await pdfjs.getDocument({ url: ${JSON.stringify(d.url)} }).promise;
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
  <footer>${q(c)} \xB7 ${q(l.name)} \xB7 ${q(t.printedOn)} ${q(r.slice(0,10))}</footer>
</body></html>`}var xi=L`
  /* #170: reference chips in front of list names. */
  .task-name .ref-chip, .today-task .ref-chip, .object-card-name .ref-chip, .objects-table-name .ref-chip { margin-right: 6px; }

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

  /* #174: inside a card the dashboard wrapper owns the insets. */
  :host([embedded]) .panel { padding: 0; }

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
  /* #169: the sub-line is a flex row of two parts that truncate on their
     own — a long object name shortens itself instead of pushing the
     person chip out of the row on a phone (a single nowrap text line cut
     the chip first, i.e. entirely). The chip keeps a readable minimum. */
  .today-object {
    color: var(--secondary-text-color); font-size: 12.5px;
    display: flex; align-items: center; gap: 8px; min-width: 0;
  }
  .today-object-text { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .today-object .today-person { flex: 0 0 auto; min-width: 0; max-width: 45%; font-size: 12px; }
  .today-object .today-person .person-avatar { width: 18px; height: 18px; font-size: 9px; }
  /* Narrow: the avatar alone — initials + colour identify the member,
     the object name keeps its room. */
  :host([narrow]) .today-object .today-person .person-name,
  :host([tight]) .today-object .today-person .person-name { display: none; }
  /* The row actions are the shared _renderRowActions markup (Complete only,
     no Skip on Today); .row-actions carries the icon/button sizing. */
  .today-row .row-actions { flex: none; }
  .today-row .btn-complete { color: var(--success-color, #4caf50); }
  :host([narrow]) .today-row .row-actions.as-buttons ha-button,
  :host([tight]) .today-row .row-actions.as-buttons ha-button { min-width: 0; --ha-button-height: 36px; }
  .today-empty {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    padding: 48px 16px; color: var(--secondary-text-color); text-align: center;
  }
  .today-empty ha-icon { --mdc-icon-size: 56px; color: var(--success-color, #4caf50); }

  .header .header-search { margin-left: auto; color: var(--app-header-text-color, white); --ha-icon-button-size: 40px; flex: none; }
  .tab-bar .tab-search { margin-left: auto; align-self: center; color: var(--secondary-text-color); --ha-icon-button-size: 40px; flex: none; }

  /* Global search overlay ("/" or the header magnifier; #171). */
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
  .palette-main { min-width: 0; flex: 1; }
  .palette-line { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .palette-label { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .palette-sub { margin-left: auto; color: var(--secondary-text-color); font-size: 12.5px; flex: none; padding-left: 10px; max-width: 45%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .palette-page { flex: none; font-size: 11.5px; padding: 1px 7px; border-radius: 10px; background: color-mix(in srgb, var(--primary-color) 14%, transparent); color: var(--primary-color); }
  .palette-snippet { font-size: 12.5px; color: var(--secondary-text-color); margin-top: 2px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .palette-group { padding: 10px 16px 4px; font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--secondary-text-color); }
  .palette-group + .palette-item { border-top: none; }
  .palette-waiting { font-weight: 400; text-transform: none; letter-spacing: 0; padding-bottom: 10px; }
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
  /* #169 follow-up: the member avatar sits inside the pill at chip height */
  .sub-chip .person-avatar { width: 16px; height: 16px; font-size: 8.5px; margin-left: -4px; }

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
    gap: 5px;
    padding: 2px 8px 2px 3px;
    margin-left: 8px;
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
    color: var(--primary-text-color);
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
    line-height: 1.4;
  }
  .user-badge .person-avatar { width: 18px; height: 18px; font-size: 9px; }

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
`;var ae=class{constructor(c){this._cache=new Map;this._pending=new Map;this.historyFallbackIds=new Set;this._hass=c}updateHass(c){this._hass=c}async getDetailStats(c,t,e=30){return this._getStats(c,e<=35?"hour":"day",e,t)}async getMiniStats(c,t){return this._getStats(c,"day",14,t)}async getBatchMiniStats(c){let t=new Map,e=[];for(let r of c){let p=`${r.entityId}:day:14`,u=this._cache.get(p);u&&Date.now()-u.fetchedAt<3e5?t.set(r.entityId,u.points):e.push(r)}if(e.length===0)return t;let i=e.filter(r=>r.isCounter).map(r=>r.entityId),s=e.filter(r=>!r.isCounter).map(r=>r.entityId),n=new Date(Date.now()-336*60*60*1e3).toISOString(),d=[];return i.length>0&&d.push(this._fetchBatch(i,"day",n,["state","sum","change"],!0,t)),s.length>0&&d.push(this._fetchBatch(s,"day",n,["mean","min","max"],!1,t)),await Promise.all(d),t}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(c,t,e,i){let s=`${c}:${t}:${e}`,n=this._cache.get(s);if(n&&Date.now()-n.fetchedAt<3e5)return n.points;if(this._pending.has(s))return this._pending.get(s);let d=this._fetchAndNormalize(c,t,e,i,s);this._pending.set(s,d);try{return await d}finally{this._pending.delete(s)}}async _fetchAndNormalize(c,t,e,i,s){let n=new Date(Date.now()-e*24*60*60*1e3).toISOString(),d=i?["state","sum","change"]:["mean","min","max"];try{let p=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:n,statistic_ids:[c],period:t,types:d}))[c]||[],u=this._normalizeRows(p,i);if(u.length<2){let _=await this._fetchHistoryFallback(c,n);_.length>=2?(u=_,this.historyFallbackIds.add(c)):this.historyFallbackIds.delete(c)}else this.historyFallbackIds.delete(c);return this._cache.set(s,{entityId:c,fetchedAt:Date.now(),period:t,points:u}),u}catch(r){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${c}:`,r),[]}}async _fetchHistoryFallback(c,t){try{let i=(await this._hass.connection.sendMessagePromise({type:"history/history_during_period",start_time:t,end_time:new Date().toISOString(),entity_ids:[c],minimal_response:!0,no_attributes:!0}))?.[c]||[];if(i.length>1e3){let d=Math.ceil(i.length/500);i=i.filter((r,p)=>p%d===0||p===i.length-1)}let s=[],n=null;for(let d of i){let r=d.s??d.state;if(r==null||r==="unknown"||r==="unavailable")continue;let p;if(r==="on"||r==="open"||r==="true")p=1;else if(r==="off"||r==="closed"||r==="false")p=0;else if(p=parseFloat(r),!Number.isFinite(p))continue;let u=d.lu??d.last_updated??d.last_changed,_=typeof u=="number"?u*1e3:u!=null?Date.parse(u):NaN;Number.isFinite(_)&&(n!=null&&n!==p&&s.push({ts:_,val:n}),s.push({ts:_,val:p}),n=p)}return s.sort((d,r)=>d.ts-r.ts),s.length&&n!=null&&s.push({ts:Date.now(),val:n}),s}catch(e){return console.warn(`[maintenance-supporter] History fallback failed for ${c}:`,e),[]}}async _fetchBatch(c,t,e,i,s,n){try{let d=await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:e,statistic_ids:c,period:t,types:i});for(let r of c){let p=d[r]||[],u=this._normalizeRows(p,s);n.set(r,u),this._cache.set(`${r}:${t}:14`,{entityId:r,fetchedAt:Date.now(),period:t,points:u})}}catch(d){console.warn("[maintenance-supporter] Batch statistics fetch failed:",d)}}_normalizeRows(c,t){let e=[];for(let i of c){let s=null;if(t?s=i.state??null:s=i.mean??null,s===null)continue;let n={ts:i.start,val:s};t||(i.min!=null&&(n.min=i.min),i.max!=null&&(n.max=i.max)),e.push(n)}return e.sort((i,s)=>i.ts-s.ts),e}};function vt(l,c){let t=l??0;return t<1024?`${t} B`:t<1024*1024?`${et(t/1024,c,1)} KB`:`${et(t/(1024*1024),c,1)} MB`}var Rt=["manual","warranty","invoice","spare_parts","photo","other"],re={manual:"mdi:book-open-variant",warranty:"mdi:shield-check",invoice:"mdi:receipt-text-outline",spare_parts:"mdi:cog-outline",photo:"mdi:image-outline",other:"mdi:file-document-outline"};function jt(l){return l.title||l.filename||l.url||""}var oe=8,$e=["newest","oldest","title","category"];function Te(l){return $e.includes(l??"")?l:"newest"}var ke=["manual","warranty","invoice","spare_parts","photo","other"];function wi(l,c){let t=new Intl.Collator(void 0,{numeric:!0,sensitivity:"base"}),e=d=>(d.title||d.filename||d.url||"").trim(),i=(d,r)=>t.compare(e(d),e(r)),s=d=>{if(d.kind==="weblink")return ke.length+1;let r=(d.tags||[]).find(p=>ke.includes(p))||"other";return ke.indexOf(r)},n=[...l];switch(c){case"oldest":return n.sort((d,r)=>(d.added_at||"").localeCompare(r.added_at||""));case"title":return n.sort(i);case"category":return n.sort((d,r)=>s(d)-s(r)||i(d,r));default:return n.sort((d,r)=>(r.added_at||"").localeCompare(d.added_at||""))}}function ne(l,c){let t=Wt(c);if(!t.length)return l;let e=[];for(let i of l){let s=Ct(t,[{text:i.title,weight:3},{text:i.filename,weight:2},{text:(i.tags||[]).join(" "),weight:2},{text:i.description,weight:2},{text:i.url,weight:1}]);s>0&&e.push({doc:i,score:s})}return e.sort((i,s)=>s.score-i.score).map(i=>i.doc)}var V=class extends H{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._filter="";this._loaded=!1;this._busy=!1;this._error="";this._hint="";this._addingLink=!1;this._linkUrl="";this._linkTitle="";this._category="manual";this._thumbs={};this._lightboxUrl="";this._editingId="";this._editTitle="";this._editCategory="manual";this._editDescription="";this._linkDescription="";this._sort=Te(it(I.docSort));this._dragOver=!1;this._loadedFor=null;this._localeReady=!1;this._singlePick=Je()}_isImage(t){return t.kind==="file"&&(t.mime||"").startsWith("image/")}async _sign(t){return Xt(this.hass,t.id)}get _lang(){return U(this.hass)}updated(t){super.updated(t),this.hass&&!this._localeReady&&(this._localeReady=!0,rt(this._lang).then(()=>this.requestUpdate())),this.hass&&this.entryId&&this._loadedFor!==this.entryId&&(this._loadedFor=this.entryId,this._load())}async _load(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId});this._docs=t.documents||[],this._loaded=!0,this._error="",this._thumbs={},this._loadThumbs()}catch(t){this._error=D(t,this._lang),this._loaded=!0}}async _loadThumbs(){await Promise.all(this._docs.filter(t=>this._isImage(t)).map(async t=>{try{let e=await this._sign(t);this._thumbs={...this._thumbs,[t.id]:e}}catch{}}))}_category_of(t){return(t.tags||[]).find(i=>Rt.includes(i))||"other"}_labelKeydown(t){(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),t.currentTarget.querySelector("input")?.click())}_onFileInput(t){let e=t.target,i=Array.from(e.files??[]);i.length&&this._uploadFiles(i),e.value=""}_onDrop(t){if(t.preventDefault(),this._dragOver=!1,!this.canWrite||this._busy)return;let e=Array.from(t.dataTransfer?.files??[]);e.length&&this._uploadFiles(e)}_onDragOver(t){this.canWrite&&(t.preventDefault(),this._dragOver=!0)}_onDragLeave(t){let e=t.relatedTarget;(!e||!t.currentTarget.contains(e))&&(this._dragOver=!1)}async _uploadFiles(t,e){let i=e??this._category;this._busy=!0,this._error="",this._hint="";let s=0,n=0;try{for(let d of t){let r;try{r=await ti(this.hass,this.entryId,d,[i])}catch(p){let u=p instanceof Error?p.message:"";if(u!=="doc_too_large"&&u!=="doc_upload_failed")throw p;this._error=a(u,this._lang);continue}r.duplicate_in_object?n++:r.deduped&&s++}n?this._hint=a("doc_dup_in_object",this._lang):s&&(this._hint=a("doc_deduped",this._lang)),await this._load()}catch{this._error=a("doc_upload_failed",this._lang)}finally{this._busy=!1}}async _download(t){try{await Jt(this.hass,t.id,t.filename||t.title||"document")}catch(e){this._error=D(e,this._lang)}}async _preview(t){if(this._isImage(t)){this._lightboxUrl=this._thumbs[t.id]||await this._sign(t);return}try{await wt(this.hass,t.id)}catch(e){this._error=D(e,this._lang)}}_openDoc(t){t.kind==="file"?this._preview(t):at(t.url)&&window.open(t.url,"_blank","noopener")}_startEdit(t){this._editingId=t.id,this._editTitle=t.title||"",this._editCategory=this._category_of(t),this._editDescription=t.description||"",this._addingLink=!1,this._error=""}_cancelEdit(){this._editingId=""}_setSort(t){this._sort=Te(t),Y(I.docSort,this._sort)}async _saveEdit(t){let e=(t.tags||[]).filter(s=>!Rt.includes(s)),i=t.kind==="file"?[this._editCategory,...e]:t.tags??[];this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:t.id,title:this._editTitle.trim()||t.filename||t.url||"",tags:i,description:this._editDescription.trim()}),this._editingId="",await this._load()}catch(s){this._error=D(s,this._lang)}finally{this._busy=!1}}async _delete(t){let e=jt(t);if(window.confirm(a("doc_delete_confirm",this._lang).replace("{name}",e))){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/delete",doc_id:t.id}),await this._load()}catch(i){this._error=D(i,this._lang)}finally{this._busy=!1}}}async _addLink(){let t=this._linkUrl.trim();if(t){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/add_link",entry_id:this.entryId,url:t,title:this._linkTitle.trim()||null,description:this._linkDescription.trim()||null}),this._linkUrl="",this._linkTitle="",this._linkDescription="",this._addingLink=!1,await this._load()}catch(e){this._error=D(e,this._lang,a("doc_link_invalid",this._lang))}finally{this._busy=!1}}}render(){let t=this._lang;return o`
      <div
        class="doc-zone ${this._dragOver?"drag-over":""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}
      >
        ${this._dragOver&&this.canWrite?o`<div class="drop-overlay">
              <ha-icon icon="mdi:tray-arrow-down"></ha-icon> ${a("doc_drop_hint",t)}
            </div>`:h}
      <div class="doc-header">
        <h3>${a("documents",t)} (${this._docs.length})</h3>
        ${this.canWrite?o`
              <div class="doc-actions">
                <select
                  class="cat-select"
                  .value=${this._category}
                  ?disabled=${this._busy}
                  @change=${e=>this._category=e.target.value}
                >
                  ${Rt.map(e=>o`<option value=${e}>${a(`doc_cat_${e}`,t)}</option>`)}
                </select>
                <label
                  class="btn primary ${this._busy?"disabled":""}"
                  role="button"
                  tabindex="0"
                  @keydown=${this._labelKeydown}
                >
                  <ha-icon icon="mdi:upload"></ha-icon>
                  ${this._busy?a("doc_uploading",t):a("doc_upload",t)}
                  <input type="file" ?multiple=${!this._singlePick} hidden ?disabled=${this._busy} @change=${this._onFileInput} />
                </label>
                <ms-photo-picker compact .showGallery=${!1} .lang=${t} .disabled=${this._busy}
                  @files-picked=${e=>this._uploadFiles(e.detail.files,"photo")}
                ></ms-photo-picker>
                <button class="btn" ?disabled=${this._busy} @click=${()=>this._addingLink=!this._addingLink}>
                  <ha-icon icon="mdi:link-variant"></ha-icon> ${a("doc_add_link",t)}
                </button>
              </div>
            `:h}
      </div>

      ${this._error?o`<div class="doc-msg error">${this._error}</div>`:h}
      ${this._hint?o`<div class="doc-msg hint">${this._hint}</div>`:h}

      ${this._addingLink&&this.canWrite?o`
            <div class="link-form">
              <input
                type="url"
                placeholder=${a("doc_link_url",t)}
                .value=${this._linkUrl}
                ?disabled=${this._busy}
                @input=${e=>this._linkUrl=e.target.value}
              />
              <input
                type="text"
                placeholder=${a("doc_link_title",t)}
                .value=${this._linkTitle}
                ?disabled=${this._busy}
                @input=${e=>this._linkTitle=e.target.value}
              />
              <input
                type="text"
                class="link-desc"
                placeholder=${a("doc_description",t)}
                .value=${this._linkDescription}
                ?disabled=${this._busy}
                @input=${e=>this._linkDescription=e.target.value}
              />
              <button class="btn primary" ?disabled=${this._busy||!this._linkUrl.trim()} @click=${this._addLink}>
                ${a("add",t)}
              </button>
              <button class="btn" ?disabled=${this._busy} @click=${()=>this._addingLink=!1}>
                ${a("cancel",t)}
              </button>
            </div>
          `:h}

      ${this._loaded&&this._docs.length>=2?o`<div class="doc-tools">
            <ha-icon icon="mdi:sort"></ha-icon>
            <select class="sort-select" aria-label=${a("doc_sort",t)} .value=${this._sort}
              @change=${e=>this._setSort(e.target.value)}>
              ${$e.map(e=>o`<option value=${e} ?selected=${e===this._sort}>${a(`doc_sort_${e}`,t)}</option>`)}
            </select>
          </div>`:h}
      ${this._loaded&&this._docs.length>=oe?o`<div class="doc-filter">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input type="search" aria-label=${a("doc_search",t)} placeholder=${a("doc_search",t)}
              .value=${this._filter} @input=${e=>this._filter=e.target.value} />
          </div>`:h}
      ${this._loaded?this._docs.length===0?o`<div class="doc-empty">${a("documents_empty",t)}</div>`:(()=>{let e=this._filter.trim()?ne(this._docs,this._filter):wi(this._docs,this._sort);return e.length===0?o`<div class="doc-empty">${a("doc_search_none",t)}</div>`:o`<div class="doc-list">${e.map(i=>this._renderDoc(i,t))}</div>`})():o`<div class="doc-empty">${a("loading",t)}</div>`}

      ${this._lightboxUrl?o`<div class="lightbox" @click=${()=>this._lightboxUrl=""}>
            <img class="lightbox-img" src=${this._lightboxUrl} @click=${e=>e.stopPropagation()} />
            <button class="lightbox-close" title=${a("doc_close",t)} @click=${()=>this._lightboxUrl=""}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>`:h}
      </div>
    `}_renderDoc(t,e){if(this._editingId===t.id)return this._renderEdit(t,e);let i=t.kind==="file",s=this._category_of(t),n=i?`${a(`doc_cat_${s}`,e)} \xB7 ${vt(t.size,e)}`:a("doc_link_badge",e),d=this._thumbs[t.id];return o`
      <div class="doc-row">
        ${i&&d?o`<img
              class="doc-thumb"
              src=${d}
              alt=${t.title||""}
              title=${a("doc_open",e)}
              @click=${()=>this._preview(t)}
            />`:o`<ha-icon
              class="doc-icon ${i?"clickable":""}"
              icon=${i?re[s]:"mdi:link-variant"}
              @click=${()=>i&&this._preview(t)}
            ></ha-icon>`}
        <div
          class="doc-info"
          role="button"
          tabindex="0"
          title=${a("doc_open",e)}
          @click=${()=>this._openDoc(t)}
          @keydown=${r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),this._openDoc(t))}}
        >
          <div class="doc-title">${jt(t)}</div>
          <div class="doc-meta">${n}</div>
          ${t.description?o`<div class="doc-desc">${t.description}</div>`:h}
        </div>
        <div class="doc-row-actions">
          ${i?o`
                <button class="icon-btn" title=${a("doc_open",e)} @click=${()=>this._preview(t)}>
                  <ha-icon icon="mdi:eye-outline"></ha-icon>
                </button>
                <button class="icon-btn" title=${a("doc_download",e)} @click=${()=>this._download(t)}>
                  <ha-icon icon="mdi:download"></ha-icon>
                </button>`:o`<a
                class="icon-btn"
                href=${at(t.url)?t.url:"#"}
                target="_blank"
                rel="noopener noreferrer"
                title=${a("doc_open",e)}
              ><ha-icon icon="mdi:open-in-new"></ha-icon></a>`}
          ${this.canWrite?o`
                <button class="icon-btn" title=${a("edit",e)} ?disabled=${this._busy} @click=${()=>this._startEdit(t)}>
                  <ha-icon icon="mdi:pencil"></ha-icon>
                </button>
                <button class="icon-btn danger" title=${a("delete",e)} ?disabled=${this._busy} @click=${()=>this._delete(t)}>
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>`:h}
        </div>
      </div>
    `}_renderEdit(t,e){let i=t.kind==="file";return o`
      <div class="doc-row editing">
        <input
          class="edit-title"
          type="text"
          placeholder=${a("doc_link_title",e)}
          .value=${this._editTitle}
          ?disabled=${this._busy}
          @input=${s=>this._editTitle=s.target.value}
        />
        ${i?o`<select
              class="cat-select"
              ?disabled=${this._busy}
              @change=${s=>this._editCategory=s.target.value}
            >
              ${Rt.map(s=>o`<option value=${s} ?selected=${s===this._editCategory}>${a(`doc_cat_${s}`,e)}</option>`)}
            </select>`:h}
        <input
          class="edit-desc"
          type="text"
          placeholder=${a("doc_description",e)}
          .value=${this._editDescription}
          ?disabled=${this._busy}
          @input=${s=>this._editDescription=s.target.value}
        />
        <button class="icon-btn" title=${a("save",e)} ?disabled=${this._busy||!this._editTitle.trim()} @click=${()=>this._saveEdit(t)}>
          <ha-icon icon="mdi:check"></ha-icon>
        </button>
        <button class="icon-btn" title=${a("cancel",e)} ?disabled=${this._busy} @click=${this._cancelEdit}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
    `}};V.styles=[ei,L`
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
    /* The camera picker (ms-photo-picker, light DOM) wears the toolbar's
       .btn look instead of the dialogs' dashed tile. */
    .doc-actions .photo-pick {
      padding: 6px 10px; gap: 6px; border-style: solid; border-radius: 6px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color); border-color: var(--divider-color);
    }
    .doc-actions .photo-pick ha-icon { --mdc-icon-size: 18px; }
    .doc-actions .photo-pick.disabled { opacity: 0.5; pointer-events: none; }
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
    .doc-filter { display: flex; align-items: center; gap: 6px; margin: 4px 0 8px; }
    .doc-filter ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color, #888); }
    .doc-filter input {
      flex: 1; min-width: 0; font: inherit; font-size: 13px; padding: 6px 8px; border-radius: 6px;
      border: 1px solid var(--divider-color); background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .doc-filter input:focus { outline: none; border-color: var(--primary-color); }
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
    .doc-desc { font-size: 12.5px; color: var(--secondary-text-color, #888); margin-top: 2px; white-space: pre-wrap; overflow-wrap: anywhere; }
    .doc-tools { display: flex; align-items: center; gap: 6px; margin: 6px 0 2px; color: var(--secondary-text-color, #888); }
    .doc-tools ha-icon { --mdc-icon-size: 18px; }
    .sort-select {
      padding: 4px 6px; border-radius: 6px; font: inherit; font-size: 13px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .doc-row.editing { flex-wrap: wrap; }
    .edit-desc, .link-desc { flex: 1 1 100%; min-width: 0; }
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
  `],g([S({attribute:!1})],V.prototype,"hass",2),g([S({attribute:!1})],V.prototype,"entryId",2),g([S({type:Boolean})],V.prototype,"canWrite",2),g([m()],V.prototype,"_docs",2),g([m()],V.prototype,"_filter",2),g([m()],V.prototype,"_loaded",2),g([m()],V.prototype,"_busy",2),g([m()],V.prototype,"_error",2),g([m()],V.prototype,"_hint",2),g([m()],V.prototype,"_addingLink",2),g([m()],V.prototype,"_linkUrl",2),g([m()],V.prototype,"_linkTitle",2),g([m()],V.prototype,"_category",2),g([m()],V.prototype,"_thumbs",2),g([m()],V.prototype,"_lightboxUrl",2),g([m()],V.prototype,"_editingId",2),g([m()],V.prototype,"_editTitle",2),g([m()],V.prototype,"_editCategory",2),g([m()],V.prototype,"_editDescription",2),g([m()],V.prototype,"_linkDescription",2),g([m()],V.prototype,"_sort",2),g([m()],V.prototype,"_dragOver",2);customElements.get("maintenance-documents-section")||customElements.define("maintenance-documents-section",V);var nt=class extends H{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._attachId="";this._filter="";this._loadedKey="";this._localeReady=!1}get _lang(){return U(this.hass)}get _refId(){return this.partId||this.taskId||""}get _linkField(){return this.partId?"part_ids":"task_ids"}updated(t){super.updated(t),this.hass&&!this._localeReady&&(this._localeReady=!0,rt(this._lang).then(()=>this.requestUpdate()));let e=`${this.entryId}|${this._refId}`;this.hass&&this.entryId&&this._refId&&this._loadedKey!==e&&(this._loadedKey=e,this._load())}async _load(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId});this._docs=t.documents||[],this._loaded=!0,this._error=""}catch(t){this._error=D(t,this._lang),this._loaded=!0}}_links(t){return t[this._linkField]||[]}_linked(){return this._docs.filter(t=>this._links(t).includes(this._refId))}_available(){return this._docs.filter(t=>!this._links(t).includes(this._refId))}async _setLinks(t,e){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:t.id,[this._linkField]:e}),await this._load()}catch(i){this._error=D(i,this._lang)}finally{this._busy=!1}}_link(){let t=this._docs.find(e=>e.id===this._attachId);t&&(this._attachId="",this._setLinks(t,[...this._links(t),this._refId]))}_unlink(t){this._setLinks(t,this._links(t).filter(e=>e!==this._refId))}_isPdf(t){return t.mime==="application/pdf"||(t.filename||"").toLowerCase().endsWith(".pdf")}_pageFor(t){return this._isPdf(t)&&this.taskId?t.task_pages?.[this.taskId]:void 0}async _open(t){if(t.kind==="weblink"){at(t.url)&&window.open(t.url,"_blank","noopener");return}let e=this._pageFor(t);try{await wt(this.hass,t.id,e?`#page=${e}`:"")}catch(i){this._error=D(i,this._lang)}}async _setPage(t,e){if(this.taskId){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:t.id,task_pages:{[this.taskId]:e}}),await this._load()}catch(i){this._error=D(i,this._lang)}finally{this._busy=!1}}}async _download(t){try{await Jt(this.hass,t.id,t.filename||t.title||"document")}catch(e){this._error=D(e,this._lang)}}render(){if(!this._loaded||this._docs.length===0)return h;let t=this._lang,e=this._linked(),i=this._available();return o`
      <div class="task-docs">
        <h3><ha-icon icon="mdi:paperclip"></ha-icon> ${a("documents",t)} (${e.length})</h3>
        ${this._error?o`<div class="tdoc-error">${this._error}</div>`:h}
        ${e.length>=oe?o`<div class="doc-filter">
              <ha-icon icon="mdi:magnify"></ha-icon>
              <input type="search" aria-label=${a("doc_search",t)} placeholder=${a("doc_search",t)}
                .value=${this._filter} @input=${s=>this._filter=s.target.value} />
            </div>`:h}
        ${e.length===0?o`<div class="tdoc-empty">${a(this.partId?"doc_part_none":"doc_task_none",t)}</div>`:(()=>{let s=ne(e,this._filter);return s.length===0?o`<div class="tdoc-empty">${a("doc_search_none",t)}</div>`:o`<div class="tdoc-list">${s.map(n=>this._renderRow(n,t))}</div>`})()}
        ${this.canWrite&&i.length?o`<div class="tdoc-attach">
              <select
                class="tdoc-select"
                ?disabled=${this._busy}
                @change=${s=>this._attachId=s.target.value}
              >
                <option value="" ?selected=${!this._attachId}>${a("doc_link_existing",t)}</option>
                ${i.map(s=>o`<option value=${s.id} ?selected=${s.id===this._attachId}>${jt(s)}</option>`)}
              </select>
              <button class="tdoc-btn" ?disabled=${this._busy||!this._attachId} @click=${this._link}>
                <ha-icon icon="mdi:link-variant-plus"></ha-icon> ${a("doc_attach",t)}
              </button>
            </div>`:h}
      </div>
    `}_renderRow(t,e){let i=t.kind==="file",s=this._isPdf(t),n=this._pageFor(t),d=(t.tags||[]).find(p=>Rt.includes(p))||"other",r=i?vt(t.size,e):a("doc_link_badge",e);return o`
      <div class="tdoc-row">
        <ha-icon class="tdoc-icon" icon=${i?re[d]:"mdi:link-variant"}></ha-icon>
        <div
          class="tdoc-info"
          role="button"
          tabindex="0"
          title=${n?`${a("doc_open",e)} \xB7 ${a("doc_page",e)} ${n}`:a("doc_open",e)}
          @click=${()=>this._open(t)}
          @keydown=${p=>{(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),this._open(t))}}
        >
          <div class="tdoc-title">${jt(t)}</div>
          <div class="tdoc-meta">
            ${r}${n?o` · <span class="tdoc-pagetag">${a("doc_page",e)} ${n}</span>`:h}
          </div>
        </div>
        ${this.canWrite&&s&&this.taskId?o`<input
              class="tdoc-page"
              type="number"
              min="1"
              inputmode="numeric"
              aria-label=${a("doc_page",e)}
              title=${a("doc_page",e)}
              placeholder=${a("doc_page",e)}
              .value=${n?String(n):""}
              ?disabled=${this._busy}
              @change=${p=>{let u=parseInt(p.target.value,10);this._setPage(t,Number.isFinite(u)&&u>=1?u:0)}}
            />`:h}
        <button class="icon-btn" title=${a("doc_open",e)} @click=${()=>this._open(t)}>
          <ha-icon icon=${i?"mdi:eye-outline":"mdi:open-in-new"}></ha-icon>
        </button>
        ${i?o`<button class="icon-btn" title=${a("doc_download",e)} @click=${()=>this._download(t)}>
              <ha-icon icon="mdi:download"></ha-icon>
            </button>`:h}
        ${this.canWrite?o`<button class="icon-btn" title=${a("doc_unlink",e)} ?disabled=${this._busy} @click=${()=>this._unlink(t)}>
              <ha-icon icon="mdi:link-variant-off"></ha-icon>
            </button>`:h}
      </div>
    `}};nt.styles=L`
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
    .doc-filter { display: flex; align-items: center; gap: 6px; margin: 4px 0 8px; }
    .doc-filter ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color, #888); }
    .doc-filter input {
      flex: 1; min-width: 0; font: inherit; font-size: 13px; padding: 6px 8px; border-radius: 6px;
      border: 1px solid var(--divider-color); background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .doc-filter input:focus { outline: none; border-color: var(--primary-color); }
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
  `,g([S({attribute:!1})],nt.prototype,"hass",2),g([S({attribute:!1})],nt.prototype,"entryId",2),g([S({attribute:!1})],nt.prototype,"taskId",2),g([S({attribute:!1})],nt.prototype,"partId",2),g([S({type:Boolean})],nt.prototype,"canWrite",2),g([m()],nt.prototype,"_docs",2),g([m()],nt.prototype,"_loaded",2),g([m()],nt.prototype,"_busy",2),g([m()],nt.prototype,"_error",2),g([m()],nt.prototype,"_attachId",2),g([m()],nt.prototype,"_filter",2);customElements.get("maintenance-task-documents")||customElements.define("maintenance-task-documents",nt);var Xi={name:"",vendor:"",mpn:"",gtin:"",storage_location:"",product_url:"",unit:"",cost:"",stock:"",reorder_threshold:"",restock_quantity:"",auto_buy_task:!0,notes:""},ot=class extends H{constructor(){super(...arguments);this.parts=[];this.canWrite=!1;this.currencySymbol="\u20AC";this._editing=null;this._busy=!1;this._error="";this._restockFor=null;this._restockQty="";this._restockInvalid=!1;this._docsFor=null}get _lang(){return U(this.hass)}connectedCallback(){super.connectedCallback(),rt(this._lang).then(()=>this.requestUpdate())}_notifyChanged(){this.dispatchEvent(new CustomEvent("parts-changed",{bubbles:!0,composed:!0}))}async _send(t){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(t)}catch(e){return this._error=D(e,this._lang),null}finally{this._busy=!1}}_openAdd(){this._editing={...Xi}}_openEdit(t){this._editing={id:t.id,name:t.name,vendor:t.vendor||"",mpn:t.mpn||"",gtin:t.gtin||"",storage_location:t.storage_location||"",product_url:t.product_url||"",unit:t.unit||"",cost:t.cost!=null?String(t.cost):"",stock:t.stock!=null?String(t.stock):"",reorder_threshold:t.reorder_threshold!=null?String(t.reorder_threshold):"",restock_quantity:t.restock_quantity!=null?String(t.restock_quantity):"",auto_buy_task:!!t.auto_buy_task,notes:t.notes||""}}_formValue(t){let e=i=>i.trim()===""?null:Number(i);return{entry_id:this.entryId,name:t.name.trim(),vendor:t.vendor.trim()||null,mpn:t.mpn.trim()||null,gtin:t.gtin.trim()||null,storage_location:t.storage_location.trim()||null,product_url:t.product_url.trim()||null,unit:t.unit.trim()||null,cost:e(t.cost),stock:e(t.stock),reorder_threshold:e(t.reorder_threshold),restock_quantity:e(t.restock_quantity),auto_buy_task:t.auto_buy_task,notes:t.notes.trim()||null}}async _save(){let t=this._editing;if(!t||!t.name.trim())return;let e=this._formValue(t),i=t.id?"maintenance_supporter/part/update":"maintenance_supporter/part/create";await this._send(t.id?{type:i,part_id:t.id,...e}:{type:i,...e})!==null&&(this._editing=null,this._notifyChanged())}async _delete(t){if(!window.confirm(a("part_delete_confirm",this._lang).replace("{name}",t.name)))return;await this._send({type:"maintenance_supporter/part/delete",entry_id:this.entryId,part_id:t.id})!==null&&this._notifyChanged()}async _restock(t){let e=parseFloat(this._restockQty);if(!Number.isFinite(e)||e===0){this._restockInvalid=!0;return}this._restockInvalid=!1;let i=await this._send({type:"maintenance_supporter/part/restock",entry_id:this.entryId,part_id:t.id,delta:e});this._restockFor=null,i!==null&&(t.stock=i.stock,this.requestUpdate(),this._notifyChanged())}_identLine(t){return[t.vendor,t.mpn?`MPN: ${t.mpn}`:"",t.gtin?`GTIN: ${t.gtin}`:""].filter(Boolean).join(" \xB7 ")}_renderRow(t){let e=this._lang,i=t.stock!==null&&t.stock!==void 0,s=this._identLine(t),n=this._docsFor===t.id;return o`
      <div class="part-row ${t.is_low?"low":""}">
        <ha-icon class="part-icon" icon=${t.is_low?"mdi:cart-arrow-down":"mdi:package-variant-closed"}></ha-icon>
        <div class="part-main">
          <div class="part-name">
            ${at(t.shopping_url)?o`<a href=${t.shopping_url} target="_blank" rel="noopener noreferrer">${t.name}</a>`:t.name}
            ${i?o`<span class="stock-badge ${t.is_low?"low":""}"
                  >${t.stock}${t.unit?` ${t.unit}`:""}${t.reorder_threshold!=null?o`<span class="threshold">/${t.reorder_threshold}</span>`:h}</span
                >`:h}
          </div>
          <div class="part-meta">
            ${s?o`<span>${s}</span>`:h}
            ${t.storage_location?o`<span class="loc"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${t.storage_location}</span>`:h}
          </div>
        </div>
        <ha-icon-button
          title=${a("documents",e)}
          class=${n?"docs-open":""}
          @click=${()=>this._docsFor=n?null:t.id}
          ><ha-icon icon="mdi:paperclip"></ha-icon
        ></ha-icon-button>
        ${this.canWrite?o`
              ${this._restockFor===t.id?o`
                    <input
                      class="restock-input${this._restockInvalid?" invalid":""}"
                      type="number"
                      .value=${this._restockQty}
                      placeholder="+1"
                      @input=${d=>this._restockQty=d.target.value}
                      @keydown=${d=>{d.key==="Enter"&&this._restock(t),d.key==="Escape"&&(this._restockFor=null)}}
                    />
                    <ha-icon-button title=${a("save",e)} @click=${()=>this._restock(t)}
                      ><ha-icon icon="mdi:check"></ha-icon
                    ></ha-icon-button>
                  `:o`
                    <ha-icon-button
                      title=${a("part_restock",e)}
                      .disabled=${this._busy}
                      @click=${()=>{this._restockFor=t.id,this._restockInvalid=!1,this._restockQty=String(t.restock_quantity||1)}}
                      ><ha-icon icon="mdi:plus-minus-variant"></ha-icon
                    ></ha-icon-button>
                  `}
              <ha-icon-button title=${a("edit",e)} .disabled=${this._busy} @click=${()=>this._openEdit(t)}
                ><ha-icon icon="mdi:pencil"></ha-icon
              ></ha-icon-button>
              <ha-icon-button title=${a("delete",e)} .disabled=${this._busy} @click=${()=>this._delete(t)}
                ><ha-icon icon="mdi:delete-outline"></ha-icon
              ></ha-icon-button>
            `:h}
      </div>
      ${n?o`<div class="part-docs">
            <maintenance-task-documents
              .hass=${this.hass}
              .entryId=${this.entryId}
              .partId=${t.id}
              .canWrite=${this.canWrite}
            ></maintenance-task-documents>
          </div>`:h}
    `}_field(t,e,i={}){let s=this._editing;return o`
      <label class="form-field">
        <span>${t}</span>
        <input
          type=${i.type||"text"}
          .value=${String(s[e]??"")}
          placeholder=${i.placeholder||""}
          @input=${n=>{this._editing[e]=n.target.value,this.requestUpdate()}}
        />
      </label>
    `}_renderForm(){let t=this._lang,e=this._editing;return o`
      <div class="part-form">
        <div class="form-grid">
          ${this._field(a("part_name",t),"name")}
          ${this._field(a("part_vendor",t),"vendor")}
          ${this._field("MPN","mpn")}
          ${this._field("GTIN / EAN","gtin",{placeholder:"4006381333931"})}
          ${this._field(a("part_storage_location",t),"storage_location")}
          ${this._field(a("part_product_url",t),"product_url",{placeholder:"https://\u2026"})}
          ${this._field(a("part_unit",t),"unit")}
          ${this._field(a("part_cost",t),"cost",{type:"number"})}
          ${this._field(a("part_stock",t),"stock",{type:"number"})}
          ${this._field(a("part_reorder_threshold",t),"reorder_threshold",{type:"number"})}
          ${this._field(a("part_restock_quantity",t),"restock_quantity",{type:"number"})}
          <label class="form-field checkbox">
            <input
              type="checkbox"
              .checked=${e.auto_buy_task}
              @change=${i=>{this._editing={...e,auto_buy_task:i.target.checked}}}
            />
            <span>${a("part_auto_buy",t)}</span>
          </label>
        </div>
        <div class="form-actions">
          <ha-button appearance="plain" @click=${()=>this._editing=null}>${a("cancel",t)}</ha-button>
          <ha-button .disabled=${this._busy||!e.name.trim()} @click=${()=>this._save()}
            >${a("save",t)}</ha-button
          >
        </div>
      </div>
    `}_inventoryValue(){let t=0,e=!1;for(let i of this.parts){let s=typeof i.cost=="number"?i.cost:null,n=typeof i.stock=="number"?i.stock:null;s!==null&&n!==null&&(t+=s*n,e=!0)}return e?t:null}render(){let t=this._lang;return!this.parts.length&&!this.canWrite?h:o`
      <div class="section-head">
        <h3>
          <ha-icon icon="mdi:package-variant"></ha-icon>
          ${a("parts_section",t)} (${this.parts.length})
          ${this._inventoryValue()!==null?o`<span class="inventory-value" title=${a("parts_inventory_value",t)}
                >${a("parts_inventory_value",t)}:
                ${K(this._inventoryValue(),this.currencySymbol,t)}</span>`:h}
        </h3>
        ${this.canWrite&&!this._editing?o`<ha-button appearance="plain" @click=${()=>this._openAdd()}>
              <ha-icon icon="mdi:plus"></ha-icon> ${a("part_add",t)}
            </ha-button>`:h}
      </div>
      ${this._error?o`<div class="error">${this._error}</div>`:h}
      ${this._editing?this._renderForm():h}
      ${this.parts.map(e=>this._renderRow(e))}
    `}};ot.styles=L`
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
  `,g([S({attribute:!1})],ot.prototype,"hass",2),g([S({attribute:!1})],ot.prototype,"entryId",2),g([S({attribute:!1})],ot.prototype,"parts",2),g([S({type:Boolean})],ot.prototype,"canWrite",2),g([S({attribute:!1})],ot.prototype,"currencySymbol",2),g([m()],ot.prototype,"_editing",2),g([m()],ot.prototype,"_busy",2),g([m()],ot.prototype,"_error",2),g([m()],ot.prototype,"_restockFor",2),g([m()],ot.prototype,"_restockQty",2),g([m()],ot.prototype,"_restockInvalid",2),g([m()],ot.prototype,"_docsFor",2);customElements.get("maintenance-parts-section")||customElements.define("maintenance-parts-section",ot);var Ji=new Set(["completed","skipped","reset","missed"]);function Zi(l,c){let t=l.reading_values||[];return t.length?t.filter(e=>typeof e.value=="number").map(e=>({id:e.id,name:e.name||"",value:e.value,unit:e.unit||""})):typeof l.reading_value=="number"?[{id:"",name:"",value:l.reading_value,unit:c||""}]:[]}function ki(l){let c=[];for(let t of l){let e=[...t.history??[]].map(s=>({h:s,ts:new Date(s.timestamp).getTime()})).filter(s=>Number.isFinite(s.ts)).sort((s,n)=>s.ts-n.ts),i=new Map;for(let{h:s,ts:n}of e){let d=Zi(s,t.reading_unit).map(p=>{let u=i.get(p.id);return i.set(p.id,p.value),{name:p.name,value:p.value,unit:p.unit,delta:u==null?null:p.value-u}});if(!Ji.has(s.type))continue;let r=s.checklist_state&&typeof s.checklist_state=="object"?Object.values(s.checklist_state):null;c.push({ts:n,timestamp:s.timestamp,taskId:t.id,taskName:t.name,type:s.type,cost:typeof s.cost=="number"?s.cost:null,duration:typeof s.duration=="number"?s.duration:null,notes:s.notes??null,completedBy:s.completed_by??null,phaseName:s.phase_id&&t.phases?.[s.phase_id]?.name||null,refNo:typeof s.ref_no=="number"?s.ref_no:null,taskRefNo:typeof t.ref_no=="number"?t.ref_no:null,readings:d,parts:(s.used_parts||[]).filter(p=>p&&(p.name||p.part_id)).map(p=>({name:p.name||p.part_id,quantity:typeof p.quantity=="number"?p.quantity:1})),photoIds:Ze(s),checklist:r&&r.length?{done:r.filter(Boolean).length,total:r.length}:null})}}return c.sort((t,e)=>e.ts-t.ts||t.taskName.localeCompare(e.taskName)),c}function $i(l,c){let t=c.from?new Date(`${c.from}T00:00:00`).getTime():null,e=c.to?new Date(`${c.to}T00:00:00`).getTime()+864e5:null;return l.filter(i=>!(c.taskId&&i.taskId!==c.taskId||t!=null&&i.ts<t||e!=null&&i.ts>=e))}function le(l){let c=0,t=0;for(let e of l)e.type==="completed"&&(c++,e.cost!=null&&(t+=e.cost));return{completed:c,totalCost:t}}var ce={readings:!0,parts:!0,photos:!0,documents:!0,checklist:!0,notes:!0,costs:!0,person:!0,refs:!0,qr:!1,bare:!0};function ts(l){return!!(l.notes&&l.notes.trim()||l.cost!=null||l.duration!=null||l.readings.length||l.parts.length||l.photoIds.length||l.checklist)}function O(l){return String(l??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c])}var es=6;function Ti(l,c,t,e,i,s,n,d={}){let r=d.options??{layout:"chronological",include:ce},p=r.include,u=d.data??{objectRef:null,tasks:[],photos:{},fmtNumber:x=>String(x)},_=c.filter(x=>x.type==="completed"&&(p.bare!==!1||ts(x))),{totalCost:v}=le(_),f=x=>p.refs&&u.objectRef&&x.taskRefNo!=null&&x.refNo!=null?`${u.objectRef}.${x.taskRefNo}-${x.refNo}`:null,b=x=>p.refs&&u.objectRef&&x.taskRefNo!=null?`${u.objectRef}.${x.taskRefNo}`:null,T=[[t.refNumber,p.refs&&u.objectRef?`#${u.objectRef}`:null],[t.manufacturer,l.manufacturer],[t.model,l.model],[t.serial,l.serial_number],[t.installed,l.installation_date?e(l.installation_date):null]].filter(([,x])=>x).map(([x,B])=>`<div class="meta-row"><span>${O(x)}</span><strong>${O(B)}</strong></div>`).join(""),E=x=>{let B=[];if(p.readings&&x.readings.length){let F=x.readings.map(A=>{let G=`${u.fmtNumber(A.value)}${A.unit?` ${O(A.unit)}`:""}`,J=A.delta!=null?` <span class="delta">(${A.delta>=0?"+":"\u2212"}${u.fmtNumber(Math.abs(A.delta))})</span>`:"";return`${A.name?`${O(A.name)}: `:""}${G}${J}`});B.push(`<div class="fact"><span class="k">${O(t.readings)}</span>${F.join(" \xB7 ")}</div>`)}if(p.parts&&x.parts.length&&B.push(`<div class="fact"><span class="k">${O(t.parts)}</span>${x.parts.map(F=>`${O(F.name)} \xD7 ${u.fmtNumber(F.quantity)}`).join(", ")}</div>`),p.checklist&&x.checklist&&B.push(`<div class="fact"><span class="k">${O(t.checklist)}</span>${x.checklist.done}/${x.checklist.total}</div>`),p.photos&&x.photoIds.length){let F=x.photoIds.slice(0,es),A=F.map(J=>{let W=u.photos[J],j=W?.name||J.slice(0,8);return W?.url?`<figure class="photo"><img src="${O(W.url)}" alt="" /><figcaption>${O(j)}</figcaption></figure>`:`<figure class="photo"><figcaption>${O(j)}</figcaption></figure>`}),G=x.photoIds.length>F.length?`<span class="more">+${x.photoIds.length-F.length}</span>`:"";B.push(`<div class="fact"><span class="k">${O(t.photos)}</span><div class="photos">${A.join("")}${G}</div></div>`)}return B.length?`<div class="details">${B.join("")}</div>`:""},C=x=>[p.notes?x.notes:null,p.person&&x.completedBy?`${t.completedBy}: ${x.completedBy}`:null].filter(Boolean).join(" \xB7 "),k=x=>p.costs?`<td class="num">${x.cost!=null?O(s(x.cost)):O(t.none)}</td>
        <td class="num">${x.duration!=null?O(i(x.duration)):O(t.none)}</td>`:"",P=x=>x?`<span class="ref">#${O(x)}</span>`:"",M=p.costs?5:3,y=x=>`<thead><tr>
    <th>${O(t.colDate)}</th>
    ${x?`<th>${O(t.colTask)}</th>`:"<th></th>"}
    ${p.costs?`<th class="num">${O(t.colCost)}</th><th class="num">${O(t.colDuration)}</th>`:""}
    <th>${O(t.colNotes)}</th>
  </tr></thead>`,st=(x,B)=>{let F=C(x),A=E(x),G=O(B?x.phaseName?`${x.taskName} \xB7 ${x.phaseName}`:x.taskName:x.phaseName||"");return`<tr class="entry">
        <td class="nowrap">${O(e(x.timestamp))}${P(f(x))}</td>
        <td>${B?`${G} ${P(b(x))}`:G}</td>
        ${k(x)}
        <td class="notes">${O(F)||(A?"":O(t.none))}</td>
      </tr>${A?`<tr class="entry-details"><td colspan="${M}" class="details-cell">${A}</td></tr>`:""}`},ut;if(r.layout==="by_task"){let x=new Map(u.tasks.map(A=>[A.id,A])),B=[...u.tasks.map(A=>A.id)];for(let A of _)B.includes(A.taskId)||B.push(A.taskId);ut=`${B.map(A=>{let G=_.filter(bt=>bt.taskId===A);if(!G.length)return"";let J=x.get(A),W=J?.name||G[0].taskName,j=p.refs?J?.ref??b(G[0]):null,$=p.documents&&J?.documents.length?`<div class="fact"><span class="k">${O(t.documents)}</span>${J.documents.map(bt=>`${O(bt.title)}${bt.page?` (${O(t.page(bt.page))})`:""}`).join(", ")}</div>`:"",z=p.qr&&J?.qrDataUri?`<figure class="qr"><img src="${O(J.qrDataUri)}" alt="" /><figcaption>${O(t.scanHint)}</figcaption></figure>`:"",Ot=G.reduce((bt,qi)=>bt+(qi.cost??0),0);return`<section class="task">
  <div class="task-head">
    <div class="task-title">
      <h2>${O(W)} ${P(j)}</h2>
      ${J?.schedule?`<div class="schedule">${O(J.schedule)}</div>`:""}
      ${$}
      <div class="task-count">${O(t.entriesLabel(G.length))}${p.costs&&Ot>0?` \xB7 ${O(s(Ot))}`:""}</div>
    </div>
    ${z}
  </div>
  <table>
    ${y(!1)}
    <tbody>
${G.map(bt=>st(bt,!1)).join(`
`)}
    </tbody>
  </table>
</section>`}).join(`
`)}
<table class="total">
  <tfoot><tr>
    <td>${O(t.totalLabel)}</td>
    <td class="num">${p.costs?O(s(v)):""}</td>
  </tr></tfoot>
</table>`}else ut=`<table>
  ${y(!0)}
  <tbody>
${_.map(x=>st(x,!0)).join(`
`)}
  </tbody>
  <tfoot><tr>
    <td colspan="2">${O(t.totalLabel)}</td>
    ${p.costs?`<td class="num">${O(s(v))}</td><td colspan="2"></td>`:"<td></td>"}
  </tr></tfoot>
</table>`;return`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${O(t.title)} \u2014 ${O(l.name)}</title>
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
<h1>${O(t.title)} \u2014 ${O(l.name)}</h1>
<p class="sub">${O(t.generated)} ${O(e(n))} \xB7 ${O(t.entriesLabel(_.length))}</p>
${T?`<div class="meta">${T}</div>`:""}
${ut}
${d.capped?`<p class="cap-note">${O(t.capNote)}</p>`:""}
</body>
</html>`}var is=500,ss=60,Z=class extends H{constructor(){super(...arguments);this.entryId="";this.object=null;this.tasks=[];this.currencySymbol="\u20AC";this.userName=()=>null;this._full={};this._loading=!1;this._filterTask="";this._from="";this._to="";this._expanded=!1;this._printOpen=!1;this._printLayout="chronological";this._printInclude={...ce};this._printing=!1;this._loadedFor=null;this._localeReady=!1}connectedCallback(){super.connectedCallback();try{let t=JSON.parse(it(I.printOptions)||"null");(t?.layout==="by_task"||t?.layout==="chronological")&&(this._printLayout=t.layout),t?.include&&typeof t.include=="object"&&(this._printInclude={...ce,...t.include})}catch{}}_savePrintOptions(){Y(I.printOptions,JSON.stringify({layout:this._printLayout,include:this._printInclude}))}_toggleInclude(t,e){this._printInclude={...this._printInclude,[t]:e},this._savePrintOptions()}get _lang(){return U(this.hass)}updated(t){super.updated(t),!this._localeReady&&this.hass&&(this._localeReady=!0,rt(this._lang).then(()=>this.requestUpdate())),this.entryId&&this._loadedFor!==this.entryId&&(this._loadedFor=this.entryId,this._full={},this._filterTask="",this._from="",this._to="",this._loadFullHistories())}async _loadFullHistories(){let t=this.entryId,e=this.tasks;if(!e.length)return;this._loading=!0;let i=await Promise.all(e.map(async s=>{try{let n=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:t,task_id:s.id});return[s.id,n.history??[]]}catch{return[s.id,s.history??[]]}}));this.entryId===t&&(this._full=Object.fromEntries(i),this._loading=!1)}get _entries(){return ki(this.tasks.map(t=>({id:t.id,name:t.name,history:this._full[t.id]??t.history??[],ref_no:t.ref_no,reading_unit:t.reading_unit})))}get _capped(){return Object.values(this._full).some(t=>t.length>=is)}_openTask(t){this.dispatchEvent(new CustomEvent("open-task",{detail:{taskId:t},bubbles:!0,composed:!0}))}async _bookletData(t){let e=this._printInclude,i=this._lang,s=[];if(e.documents||e.photos)try{s=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId})).documents||[]}catch{s=[]}let n=new Map;e.qr&&this._printLayout==="by_task"&&await Promise.all(this.tasks.map(async p=>{try{let u=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/qr/generate",entry_id:this.entryId,task_id:p.id,url_mode:"server",action:"view"});u.svg_data_uri&&n.set(p.id,u.svg_data_uri)}catch{}}));let d=this.tasks.map(p=>({id:p.id,name:p.name,ref:xt(this.object,p),schedule:St(p,i)||null,documents:s.filter(u=>(u.task_ids||[]).includes(p.id)&&!(u.tags||[]).includes("photo")).map(u=>({title:u.title||u.filename||"",page:u.task_pages?.[p.id]??null})),qrDataUri:n.get(p.id)??null})),r={};if(e.photos){let p=[...new Set(t.filter(_=>_.type==="completed").flatMap(_=>_.photoIds))].slice(0,ss),u=new Map(s.map(_=>[_.id,_]));await Promise.all(p.map(async _=>{let v=u.get(_),f=v?.title||v?.filename||_.slice(0,8);try{r[_]={name:f,url:new URL(await Xt(this.hass,_),window.location.origin).href}}catch{r[_]={name:f,url:null}}}))}return{tasks:d,photos:r}}async _print(t){let e=this._lang,i=this.object;if(!i||this._printing)return;this._printing=!0;let s;try{s=await this._bookletData(t)}finally{this._printing=!1}this._printOpen=!1;let n={title:a("service_record_title",e),generated:a("report_generated",e),manufacturer:a("manufacturer",e),model:a("model",e),serial:a("serial_number_label",e),installed:a("installed",e),colDate:a("date",e),colTask:a("task_name",e),colCost:a("cost",e),colDuration:a("duration",e),colNotes:a("notes_label",e),completedBy:a("completed_by",e),totalLabel:a("report_total_cost",e),entriesLabel:p=>`${p} ${a("service_record_entries",e)}`,capNote:a("object_history_cap_note",e),none:"\u2014",readings:a("print_inc_readings",e),parts:a("print_inc_parts",e),photos:a("print_inc_photos",e),documents:a("print_inc_documents",e),checklist:a("print_inc_checklist",e),refNumber:a("ref_number",e),scanHint:a("report_scan_hint",e),page:p=>a("search_page",e).replace("{page}",String(p))},d=t.map(p=>({...p,completedBy:p.completedBy?this.userName(p.completedBy):null})),r=Ti(i,d,n,p=>p?Q(p,e):"",p=>Lt(p,e),p=>K(p,this.currencySymbol,e),new Date().toISOString(),{capped:this._capped,options:{layout:this._printLayout,include:this._printInclude},data:{objectRef:yt(i),tasks:s.tasks,photos:s.photos,fmtNumber:p=>et(p,e)}});Nt(r)}_renderPrintOptions(t){let e=this._lang,i=this._printInclude,s=(d,r,p=!1)=>o`
      <label class="opt ${p?"disabled":""}">
        <input type="checkbox" .checked=${i[d]} ?disabled=${p}
          @change=${u=>this._toggleInclude(d,u.target.checked)} />
        <span>${a(r,e)}</span>
      </label>`,n=this._printLayout==="by_task";return o`
      <div class="print-options" role="dialog" aria-label=${a("print_options_title",e)}>
        <div class="po-title">${a("print_options_title",e)}</div>
        <div class="po-group">
          <span class="po-label">${a("print_layout",e)}</span>
          <label class="opt"><input type="radio" name="layout" value="chronological" .checked=${!n}
            @change=${()=>{this._printLayout="chronological",this._savePrintOptions()}} /><span>${a("print_layout_chronological",e)}</span></label>
          <label class="opt"><input type="radio" name="layout" value="by_task" .checked=${n}
            @change=${()=>{this._printLayout="by_task",this._savePrintOptions()}} /><span>${a("print_layout_by_task",e)}</span></label>
        </div>
        <div class="po-group">
          <span class="po-label">${a("print_include",e)}</span>
          ${s("readings","print_inc_readings")}
          ${s("parts","print_inc_parts")}
          ${s("photos","print_inc_photos")}
          ${s("checklist","print_inc_checklist")}
          ${s("notes","print_inc_notes")}
          ${s("costs","print_inc_costs")}
          ${s("person","print_inc_person")}
          ${s("refs","print_inc_refs")}
          ${s("bare","print_inc_bare")}
          ${s("documents","print_inc_documents",!n)}
          ${s("qr","print_inc_qr",!n)}
        </div>
        <div class="po-actions">
          <ha-button appearance="plain" @click=${()=>{this._printOpen=!1}}>${a("cancel",e)}</ha-button>
          <ha-button appearance="filled" class="po-print" .disabled=${this._printing} @click=${()=>this._print(t)}>
            ${this._printing?a("loading",e):a("print_button",e)}
          </ha-button>
        </div>
      </div>`}render(){let t=this._lang,e=this._entries;if(!e.length&&!this._loading)return h;let i=$i(e,{taskId:this._filterTask||null,from:this._from||null,to:this._to||null}),{completed:s,totalCost:n}=le(i),d=this._expanded?i:i.slice(0,15);return o`
      <div class="section">
        <h3>
          ${a("object_history_section",t)}
          <span class="count">${i.length}</span>
          ${this._loading?o`<span class="loading-hint">${a("loading",t)}</span>`:h}
          <ha-button appearance="plain" class="print-btn" @click=${()=>{this._printOpen=!this._printOpen}}>
            <ha-icon icon="mdi:printer-outline"></ha-icon>
            ${a("service_record_print",t)}
          </ha-button>
        </h3>
        ${this._printOpen?this._renderPrintOptions(i):h}

        <div class="filters">
          <select .value=${this._filterTask} @change=${r=>{this._filterTask=r.target.value}}>
            <option value="">${a("object_history_all_tasks",t)}</option>
            ${this.tasks.map(r=>o`<option value=${r.id} ?selected=${r.id===this._filterTask}>${r.name}</option>`)}
          </select>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${t}
            .label=${a("date_from",t)}
            .value=${this._from}
            @value-changed=${r=>{this._from=r.detail.value}}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${t}
            .label=${a("date_to",t)}
            .value=${this._to}
            @value-changed=${r=>{this._to=r.detail.value}}
          ></ms-date-field>
        </div>

        ${i.length===0?o`<p class="empty">${a("object_history_empty",t)}</p>`:o`
              <div class="rows">
                ${d.map(r=>o`
                  <div class="row">
                    <span class="date" title=${Pe(r.timestamp,t)}>${Q(r.timestamp,t)}</span>
                    <span class="type type-${r.type}">${a(r.type,t)}</span>
                    <button class="task-link" @click=${()=>this._openTask(r.taskId)}>${r.taskName}${r.phaseName?` \xB7 ${r.phaseName}`:""}</button>
                    <span class="facts">
                      ${r.cost!=null?o`<span>${K(r.cost,this.currencySymbol,t)}</span>`:h}
                      ${r.duration!=null?o`<span>${Lt(r.duration,t)}</span>`:h}
                    </span>
                    ${r.notes?o`<span class="notes" title=${r.notes}>${r.notes}</span>`:h}
                  </div>
                `)}
              </div>
              ${i.length>d.length?o`<ha-button appearance="plain" class="more" @click=${()=>{this._expanded=!0}}>
                    ${a("show_all",t)} (${i.length})
                  </ha-button>`:h}
              <div class="totals">
                ${s} ${a("service_record_entries",t)} · ${a("report_total_cost",t)}:
                <strong>${K(n,this.currencySymbol,t)}</strong>
              </div>
              ${this._capped?o`<p class="cap-note">${a("object_history_cap_note",t)}</p>`:h}
            `}
      </div>
    `}};Z.styles=L`
    .section { margin-top: 28px; }
    h3 { display: flex; align-items: center; gap: 8px; margin: 0 0 10px; }
    .count {
      font-size: 12px; color: var(--secondary-text-color);
      background: var(--secondary-background-color); padding: 2px 8px; border-radius: 999px;
    }
    .loading-hint { font-size: 12px; color: var(--secondary-text-color); font-weight: 400; }
    .print-btn { margin-left: auto; }
    .print-btn ha-icon { --mdc-icon-size: 16px; margin-right: 4px; }
    .print-options {
      border: 1px solid var(--divider-color); border-radius: 10px; padding: 12px 14px; margin: 0 0 12px;
      background: var(--card-background-color); display: flex; flex-direction: column; gap: 10px; font-size: 13px;
    }
    .po-title { font-weight: 600; }
    .po-group { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: center; }
    .po-label { color: var(--secondary-text-color); font-size: 11.5px; text-transform: uppercase; letter-spacing: .04em; min-width: 64px; }
    .opt { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
    .opt.disabled { opacity: .5; cursor: default; }
    .po-actions { display: flex; justify-content: flex-end; gap: 8px; }
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
  `,g([S({attribute:!1})],Z.prototype,"hass",2),g([S()],Z.prototype,"entryId",2),g([S({attribute:!1})],Z.prototype,"object",2),g([S({attribute:!1})],Z.prototype,"tasks",2),g([S()],Z.prototype,"currencySymbol",2),g([S({attribute:!1})],Z.prototype,"userName",2),g([m()],Z.prototype,"_full",2),g([m()],Z.prototype,"_loading",2),g([m()],Z.prototype,"_filterTask",2),g([m()],Z.prototype,"_from",2),g([m()],Z.prototype,"_to",2),g([m()],Z.prototype,"_expanded",2),g([m()],Z.prototype,"_printOpen",2),g([m()],Z.prototype,"_printLayout",2),g([m()],Z.prototype,"_printInclude",2),g([m()],Z.prototype,"_printing",2);customElements.get("maintenance-object-history-section")||customElements.define("maintenance-object-history-section",Z);var lt=class lt extends H{constructor(){super(...arguments);this.flat=!1;this._ov=null;this._loading=!1;this._marking=!1;this._error="";this._history=null;this._rosterSort=lt._storedSort();this._typeFilter=null;this._recorded=[];this._historyRequested=!1;this._localeReady=!1;this._markAll=async()=>{await this._mark(void 0)};this._repair=async()=>{if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/setup",language:this._lang}),await this._load()}catch(t){this._error=D(t,this._lang)}finally{this._marking=!1}}};this._loadHistory=async t=>{let e=t.target.open;if(Y(I.batteryRosterOpen,e?"1":"0"),!(!e||this._historyRequested)){this._historyRequested=!0;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview_history"});this._history=i.series}catch{this._history=null}}}}get _lang(){return U(this.hass)}connectedCallback(){super.connectedCallback(),this.hass&&this._load()}updated(t){It(this,t),t.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,rt(this._lang).then(()=>this.requestUpdate()),this._ov===null&&!this._loading&&this._load())}async _load(){this._loading=!0,this._error="";try{this._ov=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview"})}catch(t){this._error=D(t,this._lang)}finally{this._loading=!1}}async _mark(t){if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/mark_replaced",...t?{entity_ids:t}:{}}),await this._load()}catch(e){this._error=D(e,this._lang)}finally{this._marking=!1}}}async _setExcluded(t,e){if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/set_excluded",entity_id:t,excluded:e}),await this._load()}catch(i){this._error=D(i,this._lang)}finally{this._marking=!1}}}async _addBattery(t){let e=t.detail?.value;if(!(!e||this._marking)){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/set_included",entity_id:e,included:!0}),await this._load()}catch(i){this._error=D(i,this._lang)}finally{this._marking=!1}}}async _setTrackSelf(t){await this._setFleetOption("set_track_self_charging",t.target.checked)}async _setDueWithoutSensor(t){await this._setFleetOption("set_due_without_sensor",t.target.checked)}async _setFleetOption(t,e){if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:`maintenance_supporter/battery_fleet/${t}`,enabled:e}),await this._load()}catch(i){this._error=D(i,this._lang)}finally{this._marking=!1}}}_rosterOpen(){return it(I.batteryRosterOpen)!=="0"}_predictedTitle(t,e){if(t.forecast_overdue)return a("battery_fleet_forecast_overdue",e);let i=this._predictedDate(t.days_until??0);if(t.predicted_source==="trend")return a("battery_fleet_predicted_trend",e).replace("{date}",i).replace("{confidence}",a("cal_confidence_"+(t.prediction_confidence||"medium"),e));if(t.lifetime_months!=null&&t.lifetime_source){let s=a("lifetime_source_"+t.lifetime_source,e).replace("{n}",String(t.lifetime_samples??0));return a("battery_fleet_predicted_typical",e).replace("{date}",i).replace("{months}",String(t.lifetime_months)).replace("{type}",t.battery_type).replace("{source}",s)}return a("battery_fleet_predicted_on",e).replace("{date}",i)}_sparkline(t){let e=this._history?.[t.entity_id];if(!e||e.points.length<2)return h;let i=110,s=24,n=2,d=e.points[0][0],r=e.points[e.points.length-1][0],p=Date.now()/1e3,u=t.status!=="low"&&t.predicted_source==="trend"&&t.days_until!=null?p+t.days_until*86400:null,_=Math.max(r,u??r),v=C=>_===d?n:n+(C-d)/(_-d)*(i-2*n),f=C=>n+(1-Math.min(100,Math.max(0,C))/100)*(s-2*n),b=e.points.map(([C,k])=>`${R(v(C))},${R(f(k))}`).join(" "),T=e.points[e.points.length-1][1],E=R(f(e.threshold));return o`<svg
      class="bf-spark"
      viewBox="0 0 ${i} ${s}"
      role="img"
      aria-label=${a("battery_fleet_sparkline_hint",this._lang)}
    >
      <title>${a("battery_fleet_sparkline_hint",this._lang)}</title>
      <line class="bf-spark-th" x1="0" y1=${E} x2=${i} y2=${E}></line>
      <polyline class="bf-spark-line" points=${b}></polyline>
      ${u!==null?o`<line
            class="bf-spark-proj"
            x1=${R(v(r))}
            y1=${R(f(T))}
            x2=${R(v(u))}
            y2=${E}
          ></line>`:h}
    </svg>`}static _storedSort(){return it(I.batteryRosterSort)==="name"?"name":"urgency"}_setSort(t){this._rosterSort=t,Y(I.batteryRosterSort,t)}_sortedRoster(t){let e=this._typeFilter===null?t:t.filter(s=>s.battery_type===this._typeFilter);if(this._rosterSort==="name")return e;let i=s=>s.status==="low"?-1e3+(s.level??101)/101:s.days_until??1/0;return[...e].sort((s,n)=>i(s)-i(n)||s.device_name.localeCompare(n.device_name))}_predictedDate(t){return this._fmtDate(Date.now()+t*864e5)}_fmtDate(t){let e=new Date(t),i=s=>String(s).padStart(2,"0");return Q(`${e.getFullYear()}-${i(e.getMonth()+1)}-${i(e.getDate())}`,this._lang)}_shoppingLine(t){return Object.entries(t).map(([e,i])=>o`<button
        class="bf-type-chip ${this._typeFilter===e?"bf-type-chip-active":""}"
        title=${a("battery_fleet_filter_type",this._lang)}
        @click=${()=>this._toggleTypeFilter(e)}
      >
        ${i}× ${e}
      </button>`)}_toggleTypeFilter(t){if(this._typeFilter=this._typeFilter===t?null:t,this._typeFilter!==null){let e=this.shadowRoot?.querySelector("details.bf-roster");e&&!e.open&&(e.open=!0)}}async _recordJump(t,e){if(!this._marking){this._marking=!0,this._error="";try{await this.hass.callService("battery_notes","set_battery_replaced",{device_id:e.device_id,datetime_replaced:new Date(e.at*1e3).toISOString()}),this._recorded=[...this._recorded,t],await this._load()}catch(i){this._error=D(i,this._lang)}finally{this._marking=!1}}}_levelBar(t){let e=t.level;if(e==null)return h;let i=t.low_threshold??20,s=e<=i?"bad":e<=i+20?"warn":"good";return o`<span class="bf-bar" aria-hidden="true"
      ><span class="bf-bar-fill bf-bar-${s}" style="width: ${Math.min(100,Math.max(0,e))}%"></span
    ></span>`}_jumpButton(t,e){let i=this._history?.[t.entity_id]?.jump;return!i||this._recorded.includes(t.entity_id)?h:o`<button
      class="bf-mark bf-jump"
      title=${a("battery_fleet_record_replacement",e).replace("{date}",this._fmtDate(i.at*1e3))}
      .disabled=${this._marking}
      @click=${()=>this._recordJump(t.entity_id,i)}
    >
      <ha-icon icon="mdi:calendar-sync"></ha-icon>
    </button>`}_renderRow(t,e,i){let s=t.available===!1?o`<span class="bf-offline">${a("battery_fleet_offline",e)}</span>`:t.no_sensor?o`<span class="bf-offline bf-nosensor">${a("battery_fleet_no_sensor",e)}</span>`:h,n=o`<span class="bf-type">${t.quantity}× ${t.battery_type}</span>`,d=i.mark==="always"||t.no_sensor||t.can_mark_replaced;return o`
      <div class="bf-row">
        <span class="bf-dev">${t.device_name}</span>
        ${i.status?o`<span class="bf-status bf-${t.status}"
                >${t.no_sensor&&t.status==="low"?a("battery_fleet_status_due",e):a("battery_fleet_status_"+t.status,e)}</span
              >${n}${s}`:o`${s}${n}`}
        ${i.recharge&&t.rechargeable?o`<span class="bf-recharge" title=${a("battery_fleet_rechargeable",e)}
              ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
            ></span>`:h}
        ${i.sparkline?this._sparkline(t):h}
        ${this._levelBar(t)}
        ${t.level!=null?o`<span class="bf-level">${t.level}%</span>`:h}
        ${d?o`<button
              class="bf-mark${i.mark==="replaced"?" bf-replaced":""}"
              title=${t.rechargeable?a("battery_fleet_mark_recharged",e):a("battery_fleet_mark_one",e)}
              .disabled=${this._marking}
              @click=${()=>this._mark([t.entity_id])}
            >
              <ha-icon icon="mdi:battery-sync"></ha-icon>
            </button>`:h}
        ${i.jump?this._jumpButton(t,e):h}
        ${i.predicted&&t.days_until!=null?o`<span
              class="bf-predicted ${t.predicted_source==="trend"?"bf-trend":""} ${t.forecast_overdue?"bf-overdue":""}"
              title=${this._predictedTitle(t,e)}
              >${t.forecast_overdue?o`<ha-icon icon="mdi:calendar-alert"></ha-icon>`:h}~${this._predictedDate(t.days_until)}</span
            >`:h}
        ${i.exclude?o`<button
              class="bf-mark bf-exclude"
              title=${a("battery_fleet_exclude",e)}
              .disabled=${this._marking}
              @click=${()=>this._setExcluded(t.entity_id,!0)}
            >
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>
            </button>`:h}
      </div>
    `}render(){let t=this._lang;if(this._loading&&this._ov===null)return o`<div class="bf-card"><div class="bf-loading">…</div></div>`;let e=this._ov;if(!e)return this._error?o`<div class="bf-card"><div class="bf-error">${this._error}</div></div>`:h;let i=e.low.length;return o`
      <div class="bf-card">
        <div class="bf-head">
          <ha-icon icon="mdi:battery-alert"></ha-icon>
          <span class="bf-title">${a("battery_fleet_title",t)}</span>
          <span class="bf-count ${i?"bad":"ok"}">${i}</span>
        </div>
        ${this._error?o`<div class="bf-error">${this._error}</div>`:h}

        ${e.configured&&e.task_ok===!1?o`
              <div class="bf-repair">
                <span>${a("battery_fleet_trigger_lost",t)}</span>
                <ha-button .disabled=${this._marking} @click=${this._repair}>
                  ${a("battery_fleet_repair",t)}
                </ha-button>
              </div>
            `:h}

        ${i===0?o`<div class="bf-empty">${a("battery_fleet_none_low",t)}</div>`:o`
              <div class="bf-shopping">
                <span class="bf-label">${a("battery_fleet_buy_now",t)}</span>
                <span class="bf-list">${this._shoppingLine(e.needs_now)}</span>
              </div>
              <div class="bf-rows">
                ${e.low.map(s=>this._renderRow(s,t,{recharge:!0,mark:"always",exclude:!0}))}
              </div>
              <div class="bf-actions">
                <ha-button .disabled=${this._marking} @click=${this._markAll}>
                  <ha-icon icon="mdi:battery-sync"></ha-icon> ${a("battery_fleet_mark_all",t)}
                </ha-button>
              </div>
            `}

        ${e.soon.length?o`
              <div class="bf-soon">
                <span class="bf-label">${a("battery_fleet_soon",t)}</span>
                <span class="bf-list">${this._shoppingLine(e.needs_soon)}</span>
                <div class="bf-soon-hint">${a("battery_fleet_soon_hint",t)}</div>
              </div>
              <div class="bf-rows bf-soon-rows">
                ${e.soon.map(s=>this._renderRow(s,t,{mark:"replaced",predicted:!0}))}
              </div>
            `:h}
        ${e.all?.length?o`
              <details class="bf-roster" ?open=${this._rosterOpen()} @toggle=${this._loadHistory}>
                <summary>${a("battery_fleet_all",t)} (${e.all.length})</summary>
                <div class="bf-roster-tools">
                  <button
                    class="bf-sort ${this._rosterSort==="urgency"?"bf-sort-active":""}"
                    @click=${()=>this._setSort("urgency")}
                  >
                    ${a("battery_fleet_sort_urgency",t)}
                  </button>
                  <button
                    class="bf-sort ${this._rosterSort==="name"?"bf-sort-active":""}"
                    @click=${()=>this._setSort("name")}
                  >
                    ${a("battery_fleet_sort_name",t)}
                  </button>
                </div>
                <div class="bf-rows">
                  ${this._sortedRoster(e.all).map(s=>this._renderRow(s,t,{status:!0,recharge:!0,sparkline:!0,mark:"replaced",jump:!0,predicted:!0,exclude:!0}))}
                </div>
                <div class="bf-roster-hint">${a("battery_fleet_all_hint",t)}</div>
                <div class="bf-add">
                  <span class="bf-label">${a("battery_fleet_add",t)}</span>
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{entity:{domain:["sensor","binary_sensor"]}}}
                    .value=${""}
                    @value-changed=${this._addBattery}
                  ></ha-selector>
                  <div class="bf-roster-hint">${a("battery_fleet_add_hint",t)}</div>
                </div>
                <label class="bf-track-self">
                  <input
                    type="checkbox"
                    .checked=${!!e.track_self_charging}
                    .disabled=${this._marking}
                    @change=${this._setTrackSelf}
                  />
                  ${a("battery_fleet_track_self",t)}
                </label>
                <div class="bf-roster-hint">${a("battery_fleet_track_self_hint",t)}</div>
                <label class="bf-track-self bf-due-nosensor">
                  <input
                    type="checkbox"
                    .checked=${e.due_without_sensor!==!1}
                    .disabled=${this._marking}
                    @change=${this._setDueWithoutSensor}
                  />
                  ${a("battery_fleet_due_without_sensor",t)}
                </label>
                <div class="bf-roster-hint">${a("battery_fleet_due_without_sensor_hint",t)}</div>
              </details>
            `:h}
        ${e.excluded?.length?o`
              <div class="bf-excluded">
                <span class="bf-label">${a("battery_fleet_excluded",t)}</span>
                ${e.excluded.map(s=>o`
                    <span class="bf-excluded-chip">
                      ${s.device_name}
                      <button
                        class="bf-mark"
                        title=${a("battery_fleet_include",t)}
                        .disabled=${this._marking}
                        @click=${()=>this._setExcluded(s.entity_id,!1)}
                      >
                        <ha-icon icon="mdi:eye-outline"></ha-icon>
                      </button>
                    </span>
                  `)}
              </div>
            `:h}
        <div class="bf-total">${a("battery_fleet_total",t).replace("{n}",String(e.total))}</div>
      </div>
    `}};lt.styles=L`
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
    /* D#162: the roster's "No sensor" / offline chip takes the level bar's
     * slot (such a row has no bar); column 2 stays the status chip's. */
    .bf-status + .bf-type + .bf-offline {
      grid-column: 6;
      justify-self: start;
      white-space: nowrap;
    }
    .bf-level {
      grid-column: 7;
      justify-self: end;
    }
    .bf-row .bf-mark {
      grid-column: 8;
    }
    /* D#162: the sensorless row's Replaced action sits in the percentage
     * slot (always empty for such a row) instead of the row-action column
     * - a new max-content track there widens EVERY row via the subgrid
     * and pushed the phone roster 34 px past its edge. */
    .bf-row .bf-mark.bf-replaced {
      grid-column: 7;
      justify-self: end;
    }
    /* D#162 (maisun's iPhone): since 2.79 rows WITH a level offer Replaced
     * too — level and button shared column 7 and overlapped. With a
     * percentage present the button takes the row-action column instead. */
    .bf-row .bf-level + .bf-mark.bf-replaced {
      grid-column: 8;
      justify-self: start;
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
      /* Phone (D#162, maisun): the percentage belongs to the name line - it
       * is what you scan for - and the Replaced action to line 2 with type
       * and date. A row WITH a percentage therefore lifts it to line 1 (the
       * name yields column 8; in the "Needed soon" list, which has no status
       * chip, it takes the chip's place at the right edge) and the action
       * takes the percentage's slot on line 2 - the same slot a sensorless
       * row uses, so every row's action lines up. Before, the action shared
       * the slot with the percentage and painted over it. */
      .bf-row .bf-level {
        grid-row: 1;
        grid-column: 8;
        justify-self: end;
      }
      .bf-soon-rows .bf-row .bf-level {
        grid-column: 9 / 11;
      }
      .bf-row:has(.bf-level) .bf-dev {
        grid-column: 1 / 8;
      }
      .bf-soon-rows .bf-row:has(.bf-level) .bf-dev {
        grid-column: 1 / 9;
      }
      .bf-row .bf-level + .bf-mark.bf-replaced {
        grid-row: 2;
        grid-column: 7;
        justify-self: end;
      }
      /* The roster's "No sensor" chip would widen the shared bar track
       * for EVERY row (subgrid) - on phones the missing percentage and
       * the "Due" status already tell the story, so it yields like the
       * bar and the sparkline do. */
      .bf-status + .bf-type + .bf-offline {
        display: none;
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
  `,g([S({attribute:!1})],lt.prototype,"hass",2),g([S({type:Boolean})],lt.prototype,"flat",2),g([m()],lt.prototype,"_ov",2),g([m()],lt.prototype,"_loading",2),g([m()],lt.prototype,"_marking",2),g([m()],lt.prototype,"_error",2),g([m()],lt.prototype,"_history",2),g([m()],lt.prototype,"_rosterSort",2),g([m()],lt.prototype,"_typeFilter",2),g([m()],lt.prototype,"_recorded",2);var je=lt;customElements.get("maintenance-battery-fleet-section")||customElements.define("maintenance-battery-fleet-section",je);var ji=L`
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
`;function Si(l){let c=window;c.customCards=c.customCards||[],c.customCards.some(t=>t.type===l.type)||c.customCards.push(l)}var dt=class extends H{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._objectFilter="";this._configuredObjects=[];this._unsub=null;this._dataLoaded=!1;this._lastConnection=null}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(t){if(this._config={...t},t.past_days&&[30,90].includes(t.past_days)?this._pastDays=t.past_days:t.window_days&&[7,14,30,365].includes(t.window_days)&&(this._windowDays=t.window_days,this._pastDays=0),typeof t.user_filter=="string"&&(this._userFilter=t.user_filter),typeof t.object_filter=="string")this._objectFilter=t.object_filter,this._configuredObjects=[];else if(Array.isArray(t.object_filter)){let e=t.object_filter.filter(i=>typeof i=="string"&&i!=="");this._objectFilter=e.length===1?e[0]:"",this._configuredObjects=e.length>1?e:[]}}getCardSize(){return 6}get _lang(){return U(this.hass)}disconnectedCallback(){if(super.disconnectedCallback(),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._dataLoaded=!1,this._lastConnection=null}updated(t){if(super.updated(t),It(this,t),t.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[t,e]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=t.objects,this._stats=e,zt(this._stats.budget)}catch{}}async _subscribe(){try{let t=await this.hass.connection.subscribeMessage(e=>{let i=e;this._objects=i.objects},{type:"maintenance_supporter/subscribe"});if(!this.isConnected){t();return}this._unsub=t}catch{}}_onEventClick(t){if(t.history_timestamp){this._openHistoryEntry(t);return}_i(t.entry_id,t.task_id)||this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:t.entry_id,task_id:t.task_id},bubbles:!0,composed:!0}))}async _openHistoryEntry(t){try{let e=await ri(this.hass,t.entry_id,t.task_id,t.history_timestamp);if(!e||mi(e))return}catch{}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:t.entry_id,task_id:t.task_id,original_timestamp:t.history_timestamp},bubbles:!0,composed:!0}))}render(){if(!this.hass)return h;let t=this._lang,e=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,s=this._config.title,n=null;this._userFilter&&(n=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let d=y=>{let st=y.toLowerCase();return this._objects.find(x=>x.entry_id===y||x.object.name.toLowerCase()===st)?.entry_id??null},r=new Set(this._configuredObjects.map(d).filter(y=>y!==null)),p=r.size?this._objects.filter(y=>r.has(y.entry_id)):this._objects,u=this._config.show_object_filter!==!1&&p.length>1,_=this._objectFilter?d(this._objectFilter):null,v=_&&p.some(y=>y.entry_id===_)?p.filter(y=>y.entry_id===_):p,f=new Date;f.setHours(0,0,0,0);let b=this._pastDays>0,T=b?si(v,f,this._pastDays,n):ii(v,f,this._windowDays,n),E=Ft(f),C=this._windowDays===365||b,k=C?T.filter(y=>y.events.length>0):T,P=y=>{let st=`cal-status-${y.status}`,ut=y.projected?"cal-event-projected":"",x=y.status==="overdue"&&y.days_until_due!=null?` (${Tt(y.days_until_due,t)})`:"",B=y.projected&&y.interval_days?o`<span class="cal-event-recur">${y.interval_unit&&y.interval_unit!=="days"?`${y.interval_days} ${a("unit_"+y.interval_unit,t)}`:a("cal_every_n_days",t).replace("{n}",String(y.interval_days))}</span>`:h,F=y.schedule_type==="sensor_based",A=F?o`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${a("cal_source_sensor",t)}" icon="mdi:trending-up"></ha-icon>`:o`<ha-icon class="cal-event-icon cal-source-time"
                title="${y.adaptive_enabled?a("cal_source_time_adaptive",t):a("cal_source_time",t)}"
                icon="${y.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,G=F&&y.prediction_confidence&&y.status!=="triggered"&&!y.projected?o`<span class="cal-event-prediction cal-conf-${y.prediction_confidence}">
            ${a("cal_predicted",t)} · ${a(`cal_confidence_${y.prediction_confidence}`,t)}
          </span>`:h,J=Kt(this._stats?.budget),W=y.history_type?a(y.history_type,t):a(y.status,t);return o`
        <div class="cal-event ${ut}"
          @click=${()=>this._onEventClick(y)}>
          ${A}
          <span class="cal-status-pill ${st}">${W}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${y.object_name} · ${y.task_name}${x}</div>
            ${G}
            ${B}
          </div>
          ${y.avg_cost!=null&&y.avg_cost>0?o`<span class="cal-event-cost">${K(y.avg_cost,J,t)}</span>`:h}
        </div>
      `},M=y=>{let[st,ut,x]=y.date.split("-").map(Number),B=new Date(st,ut-1,x),F=y.date===E,A=ze(B,t,"short"),G=Le(B,t,"long");return o`
        <div class="cal-day-row">
          <div class="cal-day-pill ${F?"cal-today":""}">
            <span class="cal-pill-weekday">${A}</span>
            <span class="cal-pill-day">${B.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${G}</span>
              ${F?o`<span class="cal-day-today-badge">${a("today",t)}</span>`:h}
            </div>
            ${y.events.length===0?o`<div class="cal-empty">${a("cal_no_events",t)}</div>`:y.events.map(P)}
          </div>
        </div>
      `};return o`
      <ha-card .header=${s}>
        ${e||i?o`
              <div class="cal-controls">
                ${e?o`
                      <div class="cal-window-chips cal-past-chips" title="${a("cal_past_windows",t)}">
                        ${[30,90].map(y=>o`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===y?"active":""}"
                            @click=${()=>{this._pastDays=y}}>
                            −${y}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${a("cal_forward_windows",t)}">
                        ${[7,14,30,365].map(y=>o`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===y?"active":""}"
                            @click=${()=>{this._windowDays=y,this._pastDays=0}}>
                            ${y===365?"+1y":`+${y}d`}
                          </button>
                        `)}
                      </div>
                    `:h}
                ${i?o`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${y=>{this._userFilter=y.target.value}}>
                        <option value="">${a("all_users",t)}</option>
                        <option value="current_user">${a("my_tasks",t)}</option>
                      </select>
                    `:h}
                ${u?o`
                      <select class="cal-user-filter"
                        .value=${_??""}
                        @change=${y=>{this._objectFilter=y.target.value}}>
                        <option value="">${a("all_objects",t)}</option>
                        ${[...p].sort((y,st)=>y.object.name.localeCompare(st.object.name)).map(y=>o`<option value=${y.entry_id} ?selected=${y.entry_id===_}>${y.object.name}</option>`)}
                      </select>
                    `:h}
              </div>
            `:h}
        <div class="cal-rolling">
          ${k.length===0&&C?o`<div class="cal-empty">${a("cal_no_events",t)}</div>`:k.map(M)}
        </div>
      </ha-card>
    `}};dt.styles=[Qt,ji,L`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],g([S({attribute:!1})],dt.prototype,"hass",2),g([m()],dt.prototype,"_config",2),g([m()],dt.prototype,"_objects",2),g([m()],dt.prototype,"_stats",2),g([m()],dt.prototype,"_windowDays",2),g([m()],dt.prototype,"_pastDays",2),g([m()],dt.prototype,"_userFilter",2),g([m()],dt.prototype,"_objectFilter",2),g([m()],dt.prototype,"_unsub",2);var as=[{value:7,key:"cal_editor_window_week"},{value:14,key:"cal_editor_window_fortnight"},{value:30,key:"cal_editor_window_month"},{value:365,key:"cal_editor_window_year"}],Pt=class extends H{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}get _lang(){return U(this.hass)}setConfig(t){this._config={...t}}updated(){let t=this._lang;t&&!Ae(t)&&rt(t).then(()=>this.requestUpdate())}_valueChanged(t,e){let i={...this._config,[t]:e};t==="show_window_chips"&&e===!0&&delete i.show_window_chips,t==="show_user_filter"&&e===!0&&delete i.show_user_filter,t==="show_object_filter"&&e===!0&&delete i.show_object_filter,t==="title"&&(!e||typeof e=="string"&&e.trim()==="")&&delete i.title,t==="user_filter"&&e===""&&delete i.user_filter,this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}render(){let t=this._lang,e=this._config.window_days??30,i=this._config.show_window_chips!==!1,s=this._config.show_user_filter!==!1,n=this._config.user_filter??"",d=this._config.title??"";return o`
      <div class="editor">
        <div class="row">
          <label for="title">${a("card_title",t)}</label>
          <input
            id="title"
            type="text"
            .value=${d}
            @input=${r=>this._valueChanged("title",r.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">${a("cal_editor_window",t)}</label>
          <select
            id="window"
            @change=${r=>this._valueChanged("window_days",Number(r.target.value))}
          >
            ${as.map(r=>o`<option value="${r.value}" ?selected=${r.value===e}>${a(r.key,t)}</option>`)}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">${a("cal_editor_show_chips",t)}</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${i}
            @change=${r=>this._valueChanged("show_window_chips",r.target.checked)}
          />
        </div>
        <div class="hint">${a("cal_editor_chips_hint",t)}</div>
        <div class="row toggle">
          <label for="userf">${a("cal_editor_show_user_filter",t)}</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${s}
            @change=${r=>this._valueChanged("show_user_filter",r.target.checked)}
          />
        </div>
        <div class="row">
          <label for="userv">${a("cal_editor_default_user",t)}</label>
          <select
            id="userv"
            @change=${r=>this._valueChanged("user_filter",r.target.value)}
          >
            <option value="" ?selected=${n===""}>${a("all_users",t)}</option>
            <option value="current_user" ?selected=${n==="current_user"}>
              ${a("cal_editor_my_tasks",t)}
            </option>
          </select>
        </div>
        <div class="row toggle">
          <label for="objf">${a("cal_editor_show_object_filter",t)}</label>
          <input
            id="objf"
            type="checkbox"
            .checked=${this._config.show_object_filter!==!1}
            @change=${r=>this._valueChanged("show_object_filter",r.target.checked)}
          />
        </div>
        <div class="hint">${a("cal_editor_object_hint",t)}</div>
      </div>
    `}};Pt.styles=L`
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
  `,g([S({attribute:!1})],Pt.prototype,"hass",2),g([m()],Pt.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",dt);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",Pt);Si({type:"maintenance-supporter-calendar-card",name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});var ct=class extends H{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._options=null;this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel="",this._inputType="",this._options=null,this._inputValue="",this._open=!0,new Promise(e=>{this._resolve=e,this._promptResolve=null})}prompt(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel=t.inputLabel||"",this._inputType=t.inputType||"text",this._options=t.options&&t.options.length?t.options:null,this._inputValue=t.inputValue||"",this._open=!0,new Promise(e=>{this._promptResolve=e,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return h;let t=U(this.hass);return o`
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
              ${this._options?o`<select class="field-input field-select"
                    @change=${e=>this._inputValue=e.target.value}>
                    ${this._options.map(e=>o`<option value=${e.value} ?selected=${e.value===this._inputValue}>${e.label}</option>`)}
                  </select>`:o`<input class="field-input"
                    type="${this._inputType||"text"}"
                    .value=${this._inputValue}
                    @input=${e=>this._inputValue=e.target.value} />`}
            </label>
          `:h}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._cancel}>
            ${a("cancel",t)}
          </ha-button>
          <ha-button
            class="${this._danger?"danger":""}"
            @click=${this._confirmAction}
          >
            ${this._confirmText}
          </ha-button>
        </div>
      </ha-dialog>
    `}};ct.styles=[He,L`
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
  `],g([S({attribute:!1})],ct.prototype,"hass",2),g([m()],ct.prototype,"_open",2),g([m()],ct.prototype,"_title",2),g([m()],ct.prototype,"_message",2),g([m()],ct.prototype,"_confirmText",2),g([m()],ct.prototype,"_danger",2),g([m()],ct.prototype,"_inputLabel",2),g([m()],ct.prototype,"_inputType",2),g([m()],ct.prototype,"_options",2),g([m()],ct.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",ct);var pt=class extends H{constructor(){super(...arguments);this.objects=[];this._summary=null;this._loaded=!1;this._busy=!1;this._error="";this._query="";this._results=[];this._expanded=!1;this._initiallyLoaded=!1;this._searchTimer=0}get _lang(){return U(this.hass)}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._initiallyLoaded&&(this._initiallyLoaded=!0,this._load(),rt(this._lang).then(()=>this.requestUpdate()))}async _load(){this._busy=!0;try{this._summary=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/storage"}),this._error=""}catch(t){this._error=D(t,this._lang)}finally{this._loaded=!0,this._busy=!1}}_nameFor(t){return this.objects.find(i=>i.object?.id===t)?.object?.name||t.slice(0,8)}_entryFor(t){return this.objects.find(e=>e.object?.id===t)?.entry_id}_toggle(){this._expanded=!this._expanded}_openObject(t){this.dispatchEvent(new CustomEvent("open-object",{detail:{entry_id:t},bubbles:!0,composed:!0}))}_onSearch(t){this._query=t.target.value,clearTimeout(this._searchTimer),this._searchTimer=window.setTimeout(()=>{this._doSearch()},250)}async _doSearch(){let t=this._query.trim();if(!t){this._results=[];return}try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/search",query:t});this._results=e.results||[]}catch(e){this._error=D(e,this._lang),this._results=[]}}async _openResult(t){if(t.kind==="weblink"){at(t.url)&&window.open(t.url,"_blank","noopener");return}try{await wt(this.hass,t.id)}catch(e){this._error=D(e,this._lang)}}_renderResult(t,e){return o`
      <div class="obj-row result-row" title=${a("doc_open",e)} @click=${()=>this._openResult(t)}>
        <ha-icon icon=${t.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"}></ha-icon>
        <div class="result-info">
          <div class="result-title">${jt(t)}</div>
          <div class="result-obj">${t.object_name}</div>
        </div>
        <ha-icon class="result-open" icon=${t.kind==="weblink"?"mdi:open-in-new":"mdi:eye-outline"}></ha-icon>
      </div>
    `}render(){if(!this._loaded||!this._summary)return h;let t=this._summary;if(!t.document_count)return h;let e=this._lang,i=Object.entries(t.by_object??{}).filter(([,s])=>s.files>0||s.links>0).map(([s,n])=>({id:s,name:this._nameFor(s),entry:this._entryFor(s),...n})).sort((s,n)=>n.bytes-s.bytes);return o`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <button
              class="toggle"
              @click=${this._toggle}
              aria-expanded=${this._expanded?"true":"false"}
              aria-label=${a("doc_storage_title",e)}
            >
              <ha-icon class="chevron" icon=${this._expanded?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
              <span class="emoji">🗄️</span>
              <span class="title-text">${a("doc_storage_title",e)}</span>
              <span class="header-summary">
                ${vt(t.total_bytes,e)}
                ${t.dedup_savings_bytes>0?o`<span class="saved">−${vt(t.dedup_savings_bytes,e)}</span>`:h}
              </span>
            </button>
            <button
              class="icon-btn"
              title=${a("doc_storage_refresh",e)}
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
                      <div class="stat-value">${vt(t.total_bytes,e)}</div>
                      <div class="stat-label">
                        <ha-icon icon="mdi:file-document-outline"></ha-icon> ${t.file_count}
                        <ha-icon icon="mdi:link-variant"></ha-icon> ${t.link_count}
                      </div>
                    </div>
                    ${t.dedup_savings_bytes>0?o`<div class="stat">
                          <div class="stat-value saved">−${vt(t.dedup_savings_bytes,e)}</div>
                          <div class="stat-label">${a("doc_storage_saved",e)}</div>
                        </div>`:h}
                  </div>

                  ${t.search_index&&t.search_index.total>0?o`<div class="index-status">
                        <ha-icon icon="mdi:text-search"></ha-icon>
                        ${a("search_index_status",e).replace("{indexed}",String(t.search_index.indexed)).replace("{total}",String(t.search_index.total)).replace("{no_text}",String(t.search_index.no_text+t.search_index.unsupported)).replace("{pending}",String(t.search_index.pending))}
                      </div>`:h}
                  <div class="doc-search">
                    <ha-icon icon="mdi:magnify"></ha-icon>
                    <input
                      type="search"
                      aria-label=${a("doc_search",e)}
                      placeholder=${a("doc_search",e)}
                      .value=${this._query}
                      @input=${this._onSearch}
                    />
                  </div>

                  ${this._error?o`<div class="error">${this._error}</div>`:h}

                  ${this._query.trim()?this._results.length?o`<div class="obj-list">${this._results.map(s=>this._renderResult(s,e))}</div>`:o`<div class="search-empty">${a("doc_search_none",e)}</div>`:i.length?o`<div class="obj-list">${i.map(s=>this._renderObjRow(s,e))}</div>`:h}
                </div>
              `:h}
        </div>
      </ha-card>
    `}_renderObjRow(t,e){let i=t.entry;return o`
      <div
        class="obj-row ${i?"clickable":""}"
        role=${i?"button":h}
        tabindex=${i?"0":h}
        aria-label=${i?t.name:h}
        @click=${i?()=>this._openObject(i):void 0}
        @keydown=${i?s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),this._openObject(i))}:void 0}
      >
        <span class="obj-name">${t.name}</span>
        <span class="obj-meta">
          ${t.files>0?o`<ha-icon icon="mdi:file-document-outline"></ha-icon>${t.files}`:h}
          ${t.links>0?o`<ha-icon icon="mdi:link-variant"></ha-icon>${t.links}`:h}
        </span>
        <span class="obj-size">${vt(t.bytes,e)}</span>
        ${i?o`<ha-icon class="obj-go" icon="mdi:chevron-right"></ha-icon>`:h}
      </div>
    `}};pt.styles=L`
    ha-card { margin-top: 16px; }
    .card-content { padding: 16px; }
    .index-status {
      display: flex; align-items: center; gap: 6px; margin: 10px 0 0; font-size: 12.5px;
      color: var(--secondary-text-color, #888);
    }
    .index-status ha-icon { --mdc-icon-size: 18px; }
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
  `,g([S({attribute:!1})],pt.prototype,"hass",2),g([S({attribute:!1})],pt.prototype,"objects",2),g([m()],pt.prototype,"_summary",2),g([m()],pt.prototype,"_loaded",2),g([m()],pt.prototype,"_busy",2),g([m()],pt.prototype,"_error",2),g([m()],pt.prototype,"_query",2),g([m()],pt.prototype,"_results",2),g([m()],pt.prototype,"_expanded",2);customElements.get("maintenance-storage-section-card")||customElements.define("maintenance-storage-section-card",pt);var rs=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"],gt=class extends H{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId="";this._values=new Array(12).fill("");this._save=async()=>{let t=this._buildOverrides();if(t!==null){this._loading=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:t}),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved"))}catch(e){this._error=D(e,this._lang,a("save_error",this._lang))}finally{this._loading=!1}}};this._clearAll=async()=>{this._loading=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:{}}),this._values=new Array(12).fill(""),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved"))}catch(t){this._error=D(t,this._lang,a("save_error",this._lang))}finally{this._loading=!1}}}get _lang(){return U(this.hass)}open(t,e,i){if(this._entryId=t,this._taskId=e,this._values=new Array(12).fill(""),i)for(let[s,n]of Object.entries(i)){let d=parseInt(s,10);d>=1&&d<=12&&typeof n=="number"&&(this._values[d-1]=n.toString())}this._error="",this._open=!0}_close(){this._open=!1}_buildOverrides(){let t={};for(let e=0;e<12;e++){let i=this._values[e].trim();if(!i)continue;let s=parseFloat(i);if(Number.isNaN(s))return this._error=`${a("month_"+["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][e],this._lang)}: ${a("seasonal_override_invalid",this._lang)}`,null;if(s<.1||s>5)return this._error=a("seasonal_override_range",this._lang),null;t[e+1]=s}return t}render(){if(!this._open)return o``;let t=this._lang;return o`
      <ha-dialog open @closed=${this._close} heading="${a("seasonal_overrides_title",t)}">
        <div class="content">
          <p class="hint">${a("seasonal_overrides_hint",t)}</p>
          ${this._error?o`<div class="error">${this._error}</div>`:h}
          <div class="months">
            ${rs.map((e,i)=>o`
              <label class="month">
                <span class="mn">${a(e,t)}</span>
                <input type="number" step="0.1" min="0.1" max="5.0"
                  placeholder="1.0"
                  .value=${this._values[i]}
                  @input=${s=>{let n=[...this._values];n[i]=s.target.value,this._values=n}} />
              </label>
            `)}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._clearAll} .disabled=${this._loading}>
            ${a("clear_all",t)}
          </ha-button>
          <div class="spacer"></div>
          <ha-button appearance="plain" @click=${this._close}>
            ${a("cancel",t)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading}>
            ${this._loading?a("saving",t):a("save",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};gt.styles=L`
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
  `,g([S({attribute:!1})],gt.prototype,"hass",2),g([m()],gt.prototype,"_open",2),g([m()],gt.prototype,"_loading",2),g([m()],gt.prototype,"_error",2),g([m()],gt.prototype,"_entryId",2),g([m()],gt.prototype,"_taskId",2),g([m()],gt.prototype,"_values",2);customElements.get("maintenance-seasonal-overrides-dialog")||customElements.define("maintenance-seasonal-overrides-dialog",gt);var ht=class extends H{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._groupId=null;this._name="";this._description="";this._selected=new Set;this._toggleTask=(t,e)=>{let i=`${t}:${e}`,s=new Set(this._selected);s.has(i)?s.delete(i):s.add(i),this._selected=s};this._save=async()=>{let t=this._name.trim();if(!t){this._error=a("group_name_required",this._lang);return}this._loading=!0,this._error="";try{let e=this._buildTaskRefs();this._groupId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/update",group_id:this._groupId,name:t,description:this._description,task_refs:e}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/create",name:t,description:this._description,task_refs:e}),this._open=!1,this.dispatchEvent(new CustomEvent("group-saved"))}catch(e){this._error=D(e,this._lang,a("save_error",this._lang))}finally{this._loading=!1}}}get _lang(){return U(this.hass)}openCreate(){this._reset(),this._open=!0}openEdit(t,e){this._reset(),this._groupId=t,this._name=e.name,this._description=e.description||"",this._selected=new Set(e.task_refs.map(i=>`${i.entry_id}:${i.task_id}`)),this._open=!0}_reset(){this._groupId=null,this._name="",this._description="",this._selected=new Set,this._error=""}_close(){this._open=!1}_buildTaskRefs(){return[...this._selected].map(t=>{let[e,i]=t.split(":",2);return{entry_id:e,task_id:i}})}render(){if(!this._open)return o``;let t=this._lang,e=this._groupId?a("edit_group",t):a("new_group",t);return o`
      <ha-dialog open @closed=${this._close} heading="${e}">
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:h}
          <ms-textfield
            label="${a("name",t)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${a("description_optional",t)}"
            .value=${this._description}
            @input=${i=>this._description=i.target.value}
          ></ms-textfield>

          <div class="section-title">${a("group_select_tasks",t)}</div>
          ${this.objects.length===0?o`<div class="hint">${a("no_objects",t)}</div>`:o`
              <div class="objects">
                ${[...this.objects].sort((i,s)=>i.object.name.localeCompare(s.object.name)).map(i=>o`
                  <div class="object-block">
                    <div class="object-name">${i.object.name}</div>
                    ${i.tasks.length===0?o`<div class="hint small">${a("no_tasks_short",t)}</div>`:[...i.tasks].sort((s,n)=>s.name.localeCompare(n.name)).map(s=>{let n=`${i.entry_id}:${s.id}`,d=this._selected.has(n);return o`
                          <label class="task-row">
                            <input type="checkbox"
                              .checked=${d}
                              @change=${()=>this._toggleTask(i.entry_id,s.id)} />
                            <span>${s.name}</span>
                          </label>
                        `})}
                  </div>
                `)}
              </div>
            `}
          <div class="selected-count">
            ${a("selected",t)}: ${this._selected.size}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${a("cancel",t)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading||!this._name.trim()}>
            ${this._loading?a("saving",t):a("save",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};ht.styles=L`
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
  `,g([S({attribute:!1})],ht.prototype,"hass",2),g([S({attribute:!1})],ht.prototype,"objects",2),g([m()],ht.prototype,"_open",2),g([m()],ht.prototype,"_loading",2),g([m()],ht.prototype,"_error",2),g([m()],ht.prototype,"_groupId",2),g([m()],ht.prototype,"_name",2),g([m()],ht.prototype,"_description",2),g([m()],ht.prototype,"_selected",2);customElements.get("maintenance-group-dialog")||customElements.define("maintenance-group-dialog",ht);var ft=class extends H{constructor(){super(...arguments);this._open=!1;this._busy=!1;this._error="";this._name="";this._views=[];this._filters=null;this._localeReady=!1;this._save=async()=>{let t=this._name.trim();if(!(!t||this._busy||!this._filters)){this._busy=!0,this._error="";try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/save",name:t,filters:this._filters});this._name="",this._emitChanged(e.views||[])}catch(e){this._error=D(e,this._lang)}finally{this._busy=!1}}};this._delete=async t=>{if(!this._busy){this._busy=!0,this._error="";try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/delete",view_id:t});this._emitChanged(e.views||[])}catch(e){this._error=D(e,this._lang)}finally{this._busy=!1}}}}get _lang(){return U(this.hass)}updated(t){t.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,rt(this._lang).then(()=>this.requestUpdate()))}async open(t,e){this._open=!0,this._error="",this._name="",this._filters=t,this._views=e}_close(){this._open=!1}_emitChanged(t){this._views=t,this.dispatchEvent(new CustomEvent("saved-views-changed",{bubbles:!0,composed:!0,detail:{views:t}}))}render(){if(!this._open)return o``;let t=this._lang;return o`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${e=>e.stopPropagation()}>
          <div class="title">${a("views_dialog_title",t)}</div>
          <div class="hint">${a("views_dialog_hint",t)}</div>
          ${this._error?o`<div class="error">${this._error}</div>`:h}

          <div class="save-row">
            <input
              class="name-input"
              type="text"
              .value=${this._name}
              placeholder=${a("views_name_placeholder",t)}
              maxlength="60"
              @input=${e=>this._name=e.target.value}
              @keydown=${e=>{e.key==="Enter"&&this._save()}}
            />
            <ha-button @click=${this._save} .disabled=${!this._name.trim()||this._busy}>
              ${a("views_save_current",t)}
            </ha-button>
          </div>

          ${this._views.length===0?o`<div class="empty">${a("views_none_yet",t)}</div>`:o`
                <div class="list">
                  ${this._views.map(e=>o`
                      <div class="row">
                        <span class="row-name">${e.name}</span>
                        <ha-icon-button
                          .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                          .label=${a("delete",t)}
                          @click=${()=>this._delete(e.id)}
                        ></ha-icon-button>
                      </div>
                    `)}
                </div>
              `}

          <div class="actions">
            <ha-button appearance="plain" @click=${this._close}>${a("close",t)}</ha-button>
          </div>
        </div>
      </div>
    `}};ft.styles=L`
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
  `,g([S({attribute:!1})],ft.prototype,"hass",2),g([m()],ft.prototype,"_open",2),g([m()],ft.prototype,"_busy",2),g([m()],ft.prototype,"_error",2),g([m()],ft.prototype,"_name",2),g([m()],ft.prototype,"_views",2);customElements.get("maintenance-saved-views-dialog")||customElements.define("maintenance-saved-views-dialog",ft);var os=60,ns=20,Ei=30,ls={approaching:"\u2197",stable:"\u2192",easing:"\u2198"};function Se(l,c){let t=l.trigger_config;if(!t?.entity_id)return null;let e,i=t.type||"threshold";if(i==="threshold")if(t.trigger_above!=null)e=1;else if(t.trigger_below!=null)e=-1;else return null;else if(i==="counter"||i==="runtime"||i==="state_change")e=1;else return null;let s=c.get(t.entity_id)||[],n=i==="runtime"||i==="state_change",d=s.length>=2?s.map(b=>({ts:b.ts,val:b.val})):n?[]:(l.history||[]).filter(b=>b.trigger_value!=null).map(b=>({ts:new Date(b.timestamp).getTime(),val:b.trigger_value}));if(l.trigger_current_value!=null&&(d=[...d,{ts:Date.now(),val:l.trigger_current_value}]),d.length<2)return null;d.sort((b,T)=>b.ts-T.ts);let r=d.map(b=>b.val),p=Math.max(...r)-Math.min(...r),u=r[r.length-1]-r[0],_=t.trigger_delta_mode&&l.trigger_baseline_value!=null&&t.trigger_target_value!=null?l.trigger_baseline_value+t.trigger_target_value:t.trigger_target_value,v=i==="threshold"?t.trigger_above??t.trigger_below:i==="counter"?_:i==="runtime"?t.trigger_runtime_hours:t.trigger_target_changes,f=typeof v=="number"?Math.max(Math.abs(v-r[0]),p):p;return f===0||Math.abs(u)<f*(typeof v=="number"?.05:.15)?"stable":Math.sign(u)===e?"approaching":"easing"}function Ee(l,c){let t=l.trigger_config??null;if(!t)return h;let e=t.type||"threshold",i=l.trigger_entity_info?.unit_of_measurement??"",s=0,n="";if(e==="threshold"){let p=l.trigger_current_value??null;if(p==null)return h;let u=t.trigger_above,_=t.trigger_below;if(u!=null&&_!=null){let v=(u+_)/2,f=Math.abs(u-_)/2||1;s=Math.min(100,Math.max(0,Math.abs(p-v)/f*100));let b=Math.abs(p-u)<=Math.abs(p-_)?u:_;n=`${et(p,c?.lang,1)} / ${et(b,c?.lang)} ${i}`}else if(u!=null){let v=l.trigger_entity_info?.min,f=u>0?0:v!=null&&v<u?v:u<0?2*u:-100,b=u-f||1;s=Math.min(100,Math.max(0,(p-f)/b*100)),n=`${et(p,c?.lang,1)} / ${et(u,c?.lang)} ${i}`}else if(_!=null){let v=l.trigger_entity_info?.max,f=v!=null&&v>_?v:_>0?_*2:_<0?0:100,b=f-_||1;s=Math.min(100,Math.max(0,(f-p)/b*100)),n=`${et(p,c?.lang,1)} / ${et(_,c?.lang)} ${i}`}else if(t.trigger_equals!=null||t.trigger_not_equals!=null){let v=t.trigger_equals!=null?`= ${t.trigger_equals}`:`\u2260 ${t.trigger_not_equals}`;n=`${et(p,c?.lang,1)} (${v}${i?` ${i}`:""})`,s=l.trigger_active?100:0}else return h}else if(e==="counter"){let p=t.trigger_target_value||1,u;if(t.trigger_delta_mode?(u=l.trigger_current_delta??null,u==null&&l.trigger_baseline_value!=null&&l.trigger_current_value!=null&&(u=l.trigger_current_value-l.trigger_baseline_value)):u=l.trigger_current_value??null,u==null)return h;s=Math.min(100,Math.max(0,u/p*100)),n=`${et(u,c?.lang,1)} / ${et(p,c?.lang)} ${i}`}else if(e==="state_change"){let p=t.trigger_target_changes||1,u=l.trigger_current_value??null;if(u==null)return h;s=Math.min(100,Math.max(0,u/p*100)),n=`${et(u,c?.lang,0)} / ${et(p,c?.lang,0)}`}else if(e==="runtime"){let p=t.trigger_runtime_hours||100,u=l.trigger_current_value??null;if(u==null)return h;s=Math.min(100,Math.max(0,u/p*100)),n=`${et(u,c?.lang,1)}h / ${et(p,c?.lang)}h`}else if(e==="compound"){let p=t.compound_logic||t.operator||"AND",u=t.conditions?.length||0;n=`${p} (${u})`,s=l.trigger_active?100:0}else return h;let d=s>=100,r=s>90?"var(--error-color, #f44336)":s>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return o`
    <div class="trigger-progress">
      <div class="trigger-progress-bar">
        <div class="trigger-progress-fill${d?" overflow":""}" style="width:${s}%;background:${r}"></div>
      </div>
      <span class="trigger-progress-label">${n}${c?.trend?o` <i class="trend-arrow trend-${c.trend}" title="${a(`trend_${c.trend}`,c.lang??"en")}" aria-label="${a(`trend_${c.trend}`,c.lang??"en")}">${ls[c.trend]}</i>`:h}</span>
    </div>
  `}function Re(l,c,t){if(!l.trigger_config?.entity_id)return h;let e=l.trigger_config.entity_id,i=c.get(e)||[],s=[];if(i.length>=2)s=i.map(M=>({ts:M.ts,val:M.val}));else{if(!l.history)return h;for(let M of l.history)M.trigger_value!=null&&s.push({ts:new Date(M.timestamp).getTime(),val:M.trigger_value})}if(l.trigger_current_value!=null&&s.push({ts:Date.now(),val:l.trigger_current_value}),s.length<2)return h;s.sort((M,y)=>M.ts-y.ts);let n=os,d=ns,r=s.map(M=>M.val),p=Math.min(...r),u=Math.max(...r),_=u-p||1;p-=_*.1,u+=_*.1;let v=s[0].ts,b=s[s.length-1].ts-v||1,T=M=>(M-v)/b*n,E=M=>2+(1-(M-p)/(u-p))*(d-4),C=s;if(C.length>Ei){let M=Math.ceil(C.length/Ei);C=C.filter((y,st)=>st%M===0||st===C.length-1)}let k=C.map(M=>`${R(T(M.ts))},${R(E(M.val))}`).join(" "),P=l.trigger_active?"var(--error-color, #f44336)":"var(--primary-color)";return o`
    <svg class="mini-sparkline" viewBox="0 0 ${n} ${d}" preserveAspectRatio="none" role="img" aria-label="${a("chart_mini_sparkline",t)}">
      <polyline points="${k}" fill="none" stroke="${P}" stroke-width="1.5" stroke-linejoin="round" />
    </svg>
  `}function Ri(l,c){let t=c;if(l.days_until_due==null||!l.interval_days||l.interval_days<=0)return h;let{pct:e,overflow:i}=Zt(l.interval_days,l.days_until_due,l.interval_unit),s="var(--success-color, #4caf50)";return l.status==="overdue"?s="var(--error-color, #f44336)":l.status==="due_soon"&&(s="var(--warning-color, #ff9800)"),o`
    <div class="days-progress">
      <div class="days-progress-labels">
        <span>${l.last_performed?`${a("last_performed",t)}: ${Q(l.last_performed,t)}`:""}</span>
        <span>${l.next_due?`${a("next_due",t)}: ${Q(l.next_due,t)}`:""}</span>
      </div>
      <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(e)}" aria-valuemin="0" aria-valuemax="100" aria-label="${a("days_progress",t)}">
        <div class="days-progress-fill${i?" overflow":""}" style="width:${e}%;background:${s}"></div>
      </div>
      <div class="days-progress-text">${Tt(l.days_until_due,t)}</div>
    </div>
  `}var de=210,mt=46,kt=14,$t=12,Mi=14,cs=20+Mi,ds=[{days:7,key:"chart_range_7d"},{days:30,key:"chart_range_30d"},{days:90,key:"chart_range_90d"},{days:365,key:"chart_range_1y"}],tt=class extends H{constructor(){super(...arguments);this.points=[];this.events=[];this.unit="";this.lang="en";this.thresholdAbove=null;this.thresholdBelow=null;this.targetValue=null;this.forceZero=!1;this.projection=null;this.rangeDays=30;this.showRange=!0;this.busy=!1;this.hideOutliers=!1;this.showOutlierToggle=!0;this._width=0;this._hover=null;this._ro=null}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(t=>{let e=Math.floor(t[0]?.contentRect?.width||0);e&&Math.abs(e-this._width)>2&&(this._width=e)}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=null}_emitRange(t){t!==this.rangeDays&&this.dispatchEvent(new CustomEvent("range-change",{detail:{days:t},bubbles:!0,composed:!0}))}_toggleOutliers(){this.dispatchEvent(new CustomEvent("outlier-toggle",{detail:{hide:!this.hideOutliers},bubbles:!0,composed:!0}))}render(){let t=this._width||320,e=[...this.points].sort((s,n)=>s.ts-n.ts),i=this.lang;return o`
      <div class="chart-wrap">
        ${this.showRange?o`<div class="range-chips" role="group">
              ${this.showOutlierToggle?o`<button
                    class="range-chip outlier-chip ${this.hideOutliers?"active":""}"
                    ?disabled=${this.busy}
                    title=${a("hide_outliers",i)}
                    @click=${()=>this._toggleOutliers()}
                  ><ha-icon icon="mdi:filter-variant"></ha-icon></button>`:h}
              ${ds.map(s=>o`<button
                  class="range-chip ${this.rangeDays===s.days?"active":""}"
                  ?disabled=${this.busy}
                  @click=${()=>this._emitRange(s.days)}
                >${a(s.key,i)}</button>`)}
            </div>`:h}
        ${e.length<2?o`<div class="chart-empty">
              <ha-icon icon="mdi:chart-line"></ha-icon> ${a("loading_chart",i)}
            </div>`:this._renderSvg(t,e)}
      </div>
    `}_renderSvg(t,e){let i=this.lang,s=t-mt-kt,n=de-cs,d=n-$t,r=1/0,p=-1/0;for(let j of e)r=Math.min(r,j.min??j.val),p=Math.max(p,j.max??j.val);this.thresholdAbove!=null&&(r=Math.min(r,this.thresholdAbove),p=Math.max(p,this.thresholdAbove)),this.thresholdBelow!=null&&(r=Math.min(r,this.thresholdBelow),p=Math.max(p,this.thresholdBelow)),this.targetValue!=null&&(r=Math.min(r,this.targetValue),p=Math.max(p,this.targetValue)),this.forceZero&&(r=Math.min(r,0));let u=(p-r||1)*.06,_=this.forceZero&&r>=0?0:r-u,{ticks:v,niceMin:f,niceMax:b}=Bt(_,p+u,4);this.forceZero&&r>=0&&f<0&&(f=0,v=v.filter(j=>j>=0));let T=e[0].ts,E=this.projection&&this.projection.length===2?this.projection[1].ts:null,C=E!=null?Math.max(e[e.length-1].ts,E):e[e.length-1].ts,k=C-T||1,P=ie(T,C),M=j=>mt+(j-T)/k*s,y=j=>$t+(1-(j-f)/(b-f||1))*d,st=e.map(j=>`${R(M(j.ts))},${R(y(j.val))}`).join(" "),ut=`M${R(M(e[0].ts))},${n} `+e.map(j=>`L${R(M(j.ts))},${R(y(j.val))}`).join(" ")+` L${R(M(e[e.length-1].ts))},${n} Z`,x="",B=e.filter(j=>j.min!=null&&j.max!=null);if(B.length>=2){let j=B.map(z=>`${R(M(z.ts))},${R(y(z.max))}`),$=[...B].reverse().map(z=>`${R(M(z.ts))},${R(y(z.min))}`);x=`M${j[0]} `+j.slice(1).map(z=>`L${z}`).join(" ")+` L${$.join(" L")} Z`}let F=[];if(this.thresholdBelow!=null){let j=y(this.thresholdBelow);F.push({y:j,h:Math.max(0,n-j),lineY:j,label:`\u25BC ${_t(this.thresholdBelow,i)}`,labelY:Math.min(n-4,j+13)})}if(this.thresholdAbove!=null){let j=y(this.thresholdAbove);F.push({y:$t,h:Math.max(0,j-$t),lineY:j,label:`\u25B2 ${_t(this.thresholdAbove,i)}`,labelY:Math.max($t+11,j-5)})}let A=e[e.length-1],G=(this.events||[]).filter(j=>j.ts>=T&&j.ts<=C),J=se(T,C,Math.max(2,Math.min(5,Math.floor(s/110)+1))),W=this._hover;return o`
      <div class="svg-holder">
        <svg
          class="chart-svg"
          viewBox="0 0 ${t} ${de}"
          width=${t}
          height=${de}
          role="img"
          aria-label=${a("chart_sparkline",i)}
          @pointermove=${j=>this._onPointer(j,e,M,y,t)}
          @pointerdown=${j=>this._onPointer(j,e,M,y,t)}
          @pointerleave=${()=>this._hover=null}
        >
          <defs>
            <clipPath id="plot"><rect x="${mt}" y="${$t}" width="${s}" height="${d}" /></clipPath>
            ${F.length?X`<clipPath id="danger">${F.map(j=>X`<rect x="${mt}" y="${R(j.y)}" width="${s}" height="${R(j.h)}" />`)}</clipPath>`:h}
            <!-- Diagonal hatch so the danger zone reads without relying on the
                 red tint alone (dark-theme contrast + colour-blind support). -->
            <pattern id="dangerHatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
              <rect width="7" height="7" fill="var(--error-color, #f44336)" opacity="0.10" />
              <line x1="0" y1="0" x2="0" y2="7" stroke="var(--error-color, #f44336)" stroke-width="1.4" opacity="0.5" />
            </pattern>
          </defs>

          ${v.map(j=>{let $=y(j);return $<$t-1||$>n+1?h:X`
              <line x1="${mt}" y1="${R($)}" x2="${t-kt}" y2="${R($)}"
                stroke="var(--divider-color)" stroke-width="1" opacity="0.6" />
              <text x="${mt-7}" y="${R($+3.5)}" text-anchor="end" class="tick-label">${_t(j,i)}</text>`})}

          ${F.map(j=>X`<rect x="${mt}" y="${R(j.y)}" width="${s}" height="${R(j.h)}"
              fill="url(#dangerHatch)" />`)}

          ${x?X`<path d="${x}" fill="var(--primary-color)" opacity="0.08" clip-path="url(#plot)" />`:h}
          <path d="${ut}" fill="var(--primary-color)" opacity="0.10" clip-path="url(#plot)" />
          <polyline points="${st}" fill="none" stroke="var(--primary-color)" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" clip-path="url(#plot)" />
          ${F.length?X`<polyline points="${st}" fill="none" stroke="var(--error-color, #f44336)" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" clip-path="url(#danger)" />`:h}

          ${F.map(j=>X`
              <line x1="${mt}" y1="${R(j.lineY)}" x2="${t-kt}" y2="${R(j.lineY)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${t-kt-4}" y="${R(j.labelY)}" text-anchor="end" class="zone-label">${j.label}</text>`)}

          ${this.targetValue!=null?X`<line x1="${mt}" y1="${R(y(this.targetValue))}" x2="${t-kt}" y2="${R(y(this.targetValue))}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${t-kt-4}" y="${R(y(this.targetValue)-5)}" text-anchor="end" class="zone-label">◆ ${_t(this.targetValue,i)} ${this.unit}</text>`:h}

          ${this.projection&&this.projection.length===2?X`<line x1="${R(M(this.projection[0].ts))}" y1="${R(y(this.projection[0].val))}"
                x2="${R(Math.min(M(this.projection[1].ts),t-kt))}" y2="${R(y(Math.max(f,Math.min(b,this.projection[1].val))))}"
                stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.8" />`:h}

          ${J.map((j,$)=>{let z=M(j),Ot=$===0?"start":$===J.length-1?"end":"middle";return X`<text x="${R(z)}" y="${de-5}" text-anchor="${Ot}" class="tick-label">${At(j,i,P)}</text>`})}

          <line x1="${mt}" y1="${n}" x2="${t-kt}" y2="${n}" stroke="var(--divider-color)" stroke-width="1" />

          ${G.map(j=>{let $=M(j.ts),z=j.type==="completed"?"var(--success-color, #4caf50)":j.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return X`
              <line x1="${R($)}" y1="${$t}" x2="${R($)}" y2="${n}" stroke="${z}" stroke-width="1" opacity="0.14" />
              <rect x="${R($-1.5)}" y="${n+3}" width="3" height="${Mi-6}" rx="1.5" fill="${z}">
                <title>${ve(j.ts,i)}</title>
              </rect>`})}

          ${W?X`
                <line x1="${R(W.x)}" y1="${$t}" x2="${R(W.x)}" y2="${n}"
                  stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.7" />
                <circle cx="${R(W.x)}" cy="${R(W.y)}" r="4.5" fill="var(--primary-color)"
                  stroke="var(--card-background-color, #fff)" stroke-width="2" />`:X`<circle cx="${R(M(A.ts))}" cy="${R(y(A.val))}" r="4" fill="var(--primary-color)"
                stroke="var(--card-background-color, #fff)" stroke-width="1.5" />`}
        </svg>
        ${W?o`<div
              class="hover-chip"
              style="left:${Math.min(Math.max(W.x,70),t-70)}px"
            >
              <div class="hover-date">${ve(W.p.ts,i)}</div>
              <div class="hover-val">
                ${Et(W.p.val,this.unit,i)}
                ${W.p.min!=null&&W.p.max!=null?o`<span class="hover-range">(${_t(W.p.min,i)}–${_t(W.p.max,i)})</span>`:h}
              </div>
            </div>`:h}
      </div>
    `}_onPointer(t,e,i,s,n){let r=t.currentTarget.getBoundingClientRect(),p=(t.clientX-r.left)/r.width*n;if(p<mt-8||p>n-kt+8){this._hover=null;return}let u=e[0],_=1/0;for(let v of e){let f=Math.abs(i(v.ts)-p);f<_&&(_=f,u=v)}this._hover={x:i(u.ts),y:s(u.val),p:u}}};tt.styles=L`
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
  `,g([S({attribute:!1})],tt.prototype,"points",2),g([S({attribute:!1})],tt.prototype,"events",2),g([S()],tt.prototype,"unit",2),g([S()],tt.prototype,"lang",2),g([S({attribute:!1})],tt.prototype,"thresholdAbove",2),g([S({attribute:!1})],tt.prototype,"thresholdBelow",2),g([S({attribute:!1})],tt.prototype,"targetValue",2),g([S({type:Boolean})],tt.prototype,"forceZero",2),g([S({attribute:!1})],tt.prototype,"projection",2),g([S({attribute:!1})],tt.prototype,"rangeDays",2),g([S({type:Boolean})],tt.prototype,"showRange",2),g([S({type:Boolean})],tt.prototype,"busy",2),g([S({type:Boolean})],tt.prototype,"hideOutliers",2),g([S({type:Boolean})],tt.prototype,"showOutlierToggle",2),g([m()],tt.prototype,"_width",2),g([m()],tt.prototype,"_hover",2);customElements.get("maintenance-trigger-chart")||customElements.define("maintenance-trigger-chart",tt);function Oi(l){let c=(l??"").trim().toLowerCase();return c==="on"||c==="open"||c==="true"?1:c==="off"||c==="closed"||c==="false"?0:null}function ps(l,c,t){if(l.length<2)return null;let e=t.now??Date.now(),i=Math.max(0,c.trigger_for_minutes??0)*6e4,s=c.trigger_from_state?Oi(c.trigger_from_state):null,n=c.trigger_to_state?Oi(c.trigger_to_state):null;if(c.trigger_from_state&&s===null||c.trigger_to_state&&n===null)return null;let d=[...l].sort((k,P)=>k.ts-P.ts),r=[];for(let k of d){let P=r[r.length-1];(!P||P.level!==k.val)&&r.push({start:k.ts,level:k.val})}let p=k=>(k+1<r.length?r[k+1].start:e)-r[k].start>=i,u=(k,P,M)=>{let y=k[k.length-1];y&&y.val!==M&&k.push({ts:P,val:y.val}),k.push({ts:P,val:M})};if((c.trigger_target_changes??1)===1&&n!==null){let k=[];r.forEach((M,y)=>u(k,M.start,M.level===n&&p(y)?1:0));let P=k[k.length-1]?.val??0;return k.push({ts:e,val:P}),{points:k,mode:"alarm"}}let v=t.since??r[0].start,f=0,b=[];for(let k=1;k<r.length;k++){let P=r[k-1],M=r[k];s!==null&&P.level!==s||n!==null&&M.level!==n||!p(k)||M.start<v||(f+=1,b.push(M.start))}let T=Math.max(0,(t.current??f)-f),E=[{ts:Math.max(v,r[0].start),val:T}],C=T;for(let k of b)C+=1,u(E,k,C);return E.push({ts:e,val:C}),{points:E,mode:"count"}}function hs(l){if(l.length<4)return l;let c=l.map(p=>p.val).sort((p,u)=>p-u),t=p=>{let u=(c.length-1)*p,_=Math.floor(u),v=Math.ceil(u);return c[_]+(c[v]-c[_])*(u-_)},e=t(.25),i=t(.75),s=i-e;if(s===0)return l;let n=e-1.5*s,d=i+1.5*s,r=l.filter(p=>p.val>=n&&p.val<=d);return r.length>=2?r:l}function Ci(l,c){let t=l.trigger_config;if(!t)return h;let e=c.lang,i=l.trigger_entity_info,s=l.trigger_entity_infos,n=i?.friendly_name||t.entity_id||"\u2014",d=t.entity_id||"",r=t.entity_ids||(d?[d]:[]),p=i?.unit_of_measurement||"",u=l.trigger_current_value,_=t.type||"threshold",v=r.length>1,f=us(l,p,c);return o`
    <h3>${a("trigger",e)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${v?o`
            <div class="trigger-entity-name">${r.length} ${a("entities",e)} (${t.entity_logic||"any"})</div>
            <div class="trigger-entity-id">${r.map((b,T)=>o`${T>0?", ":""}<span class="entity-link" @click=${E=>Ht(E,b)}>${b}</span>`)}${t.attribute?` \u2192 ${t.attribute}`:""}</div>
          `:o`
            <div class="trigger-entity-name">${n}</div>
            <div class="trigger-entity-id">${d?o`<span class="entity-link" @click=${b=>Ht(b,d)}>${d}</span>`:""}${t.attribute?` \u2192 ${t.attribute}`:""}</div>
          `}
        </div>
        <span class="status-badge ${l.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
          ${l.trigger_active?a("triggered",e):a("ok",e)}
        </span>
      </div>

      ${f?gs(f,e):u!=null?o`
              <div class="trigger-value-row">
                <span class="trigger-current ${l.trigger_active?"active":""}">${typeof u=="number"?Et(u,"",e):u}</span>
                ${p?o`<span class="trigger-unit">${p}</span>`:h}
              </div>
            `:h}

      <div class="trigger-limits">
        ${_==="threshold"?o`
          ${t.trigger_above!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("threshold_above",e)}: ${t.trigger_above} ${p}</span>`:h}
          ${t.trigger_below!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("threshold_below",e)}: ${t.trigger_below} ${p}</span>`:h}
          ${t.trigger_equals!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> = ${t.trigger_equals} ${p}</span>`:h}
          ${t.trigger_not_equals!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ≠ ${t.trigger_not_equals} ${p}</span>`:h}
          ${t.trigger_for_minutes?o`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${a("for_minutes",e)}: ${t.trigger_for_minutes}</span>`:h}
        `:h}
        ${_==="state_change"?o`
          ${t.trigger_target_changes!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("target_changes",e)}: ${t.trigger_target_changes}</span>`:h}
        `:h}
        ${_==="runtime"?o`
          ${t.trigger_runtime_hours!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("runtime_hours",e)}: ${t.trigger_runtime_hours}h</span>`:h}
        `:h}
        ${_==="compound"?o`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("compound_logic",e)}: ${t.compound_logic||t.operator||"AND"}</span>
          ${(t.conditions||[]).map((b,T)=>o`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${T+1}. ${a(b.type||"unknown",e)}: ${b.entity_id?o`<span class="entity-link" @click=${E=>Ht(E,b.entity_id)}>${b.entity_id}</span>`:""}</span>
          `)}
        `:h}
      </div>

      ${s&&s.length>1?o`
        <div class="trigger-entity-list">
          ${s.map(b=>o`
            <span class="trigger-entity-id">${b.friendly_name} (<span class="entity-link" @click=${T=>Ht(T,b.entity_id)}>${b.entity_id}</span>)</span>
          `)}
        </div>
      `:h}

      ${ms(l,p,c)}
    </div>
  `}function us(l,c,t){let e=l.trigger_config,i=l.trigger_current_value;if(!e||i==null)return null;switch(e.type||"threshold"){case"counter":{let s=e.trigger_target_value;if(s==null||s<=0)return null;if(!e.trigger_delta_mode)return{progress:Math.max(0,i),target:s,unit:c,meter:null};let n=Di(l,Ii(l,t));return{progress:Math.max(0,i-(n?.value??i)),target:s,unit:c,meter:i}}case"state_change":{let s=e.trigger_target_changes;return s==null||s<=0?null:{progress:Math.max(0,i),target:s,unit:"",meter:null}}case"runtime":{let s=e.trigger_runtime_hours;return s==null||s<=0?null:{progress:Math.max(0,i),target:s,unit:"h",meter:null}}}return null}function Di(l,c){if(l.trigger_baseline_value!=null)return{value:l.trigger_baseline_value,ts:pe(l)};if(!c.length)return null;let t=pe(l);if(t==null)return{value:c[0].val,ts:null};let e=c[0],i=Math.abs(c[0].ts-t);for(let s of c){let n=Math.abs(s.ts-t);n<i&&(e=s,i=n)}return{value:e.val,ts:t}}function pe(l){let c=[...l.history].filter(t=>t.type==="completed"||t.type==="reset").sort((t,e)=>new Date(e.timestamp).getTime()-new Date(t.timestamp).getTime())[0];return c?new Date(c.timestamp).getTime():null}function gs(l,c){let t=Math.min(999,Math.round(l.progress/l.target*100)),e=t>=100?"over":t>=75?"near":"ok";return o`
    <div class="counter-progress">
      <div class="counter-progress-nums">
        <span class="counter-progress-main">${Et(l.progress,"",c)}<span class="counter-progress-target"> / ${Et(l.target,l.unit,c)}</span></span>
        <span class="counter-progress-pct ${e}">${t} %</span>
      </div>
      <div class="counter-progress-bar" role="progressbar" aria-valuenow=${t} aria-valuemin="0" aria-valuemax="100">
        <div class="counter-progress-fill ${e}" style="width:${Math.min(100,t)}%"></div>
      </div>
      <div class="counter-progress-caption">
        ${a("chart_since_service",c)}${l.meter!=null?o` · ${a("current",c)}: ${Et(l.meter,l.unit,c)}`:h}
      </div>
    </div>
  `}function Ii(l,c){let t=l.trigger_config;if(!t)return[];let e=t.type||"threshold",i=t.entity_id||"",s=e==="runtime"?[]:c.detailStatsData.get(i)||[],n=c.isCounterEntity(t),d=[];if(s.length>=2)for(let p of s){let u={ts:p.ts,val:p.val};!n&&p.min!=null&&p.max!=null&&(u.min=p.min,u.max=p.max),d.push(u)}else for(let p of l.history)p.trigger_value!=null&&d.push({ts:new Date(p.timestamp).getTime(),val:p.trigger_value});let r=!!i&&!!c.historyFallbackIds?.has(i)&&s.length>=2;return l.trigger_current_value!=null&&!r&&d.push({ts:Date.now(),val:l.trigger_current_value}),d.sort((p,u)=>p.ts-u.ts),d}function ms(l,c,t){let e=l.trigger_config;if(!e)return h;let i=e.type||"threshold",s=e.entity_id||"",n=Ii(l,t),d=null;i==="state_change"&&s&&t.historyFallbackIds?.has(s)&&(d=ps(n,e,{since:pe(l),current:l.trigger_current_value??null}),d&&(n=d.points)),i==="runtime"&&e.trigger_runtime_hours&&l.trigger_current_value!=null&&(n=[{ts:pe(l)??n[0]?.ts??Date.now()-864e5,val:0},{ts:Date.now(),val:Math.max(0,l.trigger_current_value)}]),t.hideOutliers&&(n=hs(n));let r=n.length<2&&!!s&&t.hasStatsService&&!t.detailStatsData.has(s);if(n.length<2&&!r)return h;let p=!!s&&t.detailStatsData.has(s)&&(t.detailStatsData.get(s)?.length??0)<2,u=Date.now()-t.rangeDays*864e5,_=n.filter(k=>k.ts>=u);_.length>=2&&(n=_);let v=null,f=!1;if(i==="counter"&&e.trigger_target_value!=null&&n.length){if(e.trigger_delta_mode){let k=Di(l,n);if(k){if(k.ts!=null){let P=n.filter(M=>M.ts>=k.ts);P.length>=2&&(n=P)}n=n.map(P=>({...P,val:Math.max(0,P.val-k.value)}))}}v=e.trigger_target_value,f=!0}else i==="state_change"&&e.trigger_target_changes&&d?.mode!=="alarm"?(v=e.trigger_target_changes,f=!0):i==="runtime"&&e.trigger_runtime_hours&&(v=e.trigger_runtime_hours,f=!0);let b=null,T=l.degradation_rate,E=T!=null&&(e.trigger_below!=null&&e.trigger_above==null&&T>0||e.trigger_above!=null&&e.trigger_below==null&&T<0);if(v==null&&T!=null&&!E&&(l.degradation_trend!=="stable"||l.days_until_threshold!=null)&&l.degradation_trend!=="insufficient_data"&&n.length>=2){let k=n[n.length-1];b=[k,{ts:k.ts+30*864e5,val:k.val+T*30}]}let C=l.history.filter(k=>["completed","skipped","reset"].includes(k.type)).map(k=>({ts:new Date(k.timestamp).getTime(),type:k.type}));return o`
    <maintenance-trigger-chart
      .points=${r?[]:n}
      .events=${C}
      .unit=${c}
      .lang=${t.lang}
      .thresholdAbove=${i==="threshold"?e.trigger_above??null:null}
      .thresholdBelow=${i==="threshold"?e.trigger_below??null:null}
      .targetValue=${v}
      .forceZero=${f}
      .projection=${b}
      .rangeDays=${t.rangeDays}
      .hideOutliers=${t.hideOutliers}
      .busy=${r}
      @range-change=${k=>t.setRangeDays(k.detail.days)}
      @outlier-toggle=${k=>t.setHideOutliers(k.detail.hide)}
    ></maintenance-trigger-chart>
    ${r?h:s&&t.historyFallbackIds?.has(s)&&!p?o`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${a(d?.mode==="alarm"?"chart_history_alarm":d?.mode==="count"?"chart_history_count":"chart_history_fallback",t.lang)}
        </div>`:p?o`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${a("chart_no_stats",t.lang)}
        </div>`:h}
  `}var _s=200,Vt=10,vs=22;function Ai(l,c,t,e,i){let s=l.history.filter(r=>r.type==="completed"&&(r.cost!=null||r.duration!=null));if(s.length<2)return h;let n=s.some(r=>(r.cost??0)>0),d=s.some(r=>(r.duration??0)>0);return!n&&!d?h:o`
    <div class="cost-duration-card">
      <div class="card-header">
        <h3>${a("cost_duration_chart",c)}</h3>
        <div class="toggle-buttons">
          ${n?o`<button
            class="toggle-btn ${t==="cost"?"active":""}"
            @click=${()=>e("cost")}>
            ${a("cost",c)}
          </button>`:h}
          ${n&&d?o`<button
            class="toggle-btn ${t==="both"?"active":""}"
            @click=${()=>e("both")}>
            ${a("both",c)}
          </button>`:h}
          ${d?o`<button
            class="toggle-btn ${t==="duration"?"active":""}"
            @click=${()=>e("duration")}>
            ${a("duration",c)}
          </button>`:h}
        </div>
      </div>
      ${fs(l,c,t,i)}
    </div>
  `}function fs(l,c,t,e){let i=l.history.filter($=>$.type==="completed"&&($.cost!=null||$.duration!=null)).map($=>({ts:new Date($.timestamp).getTime(),cost:$.cost??0,duration:$.duration??0})).sort(($,z)=>$.ts-z.ts);if(i.length<2)return h;let s=i.some($=>$.cost>0),n=i.some($=>$.duration>0);if(!s&&!n)return h;let d=t!=="duration"&&s,r=t!=="cost"&&n,p=d||!r&&s,u=r||!d&&n,_=640,v=_s,f=p?44:12,b=u?44:12,T=_-f-b,E=v-vs,C=E-Vt,k=i[0].ts,P=i[i.length-1].ts,M=(P-k||864e5)*.05,y=k-M,st=P+M,ut=ie(k,P),x=$=>f+($-y)/(st-y)*T,B=Bt(0,Math.max(...i.map($=>$.cost))||1,3),F=Bt(0,Math.max(...i.map($=>$.duration))||1,3),A=$=>Vt+(1-$/(B.niceMax||1))*C,G=$=>Vt+(1-$/(F.niceMax||1))*C,J=i.length>1?Math.min(...i.slice(1).map(($,z)=>x($.ts)-x(i[z].ts))):T,W=Math.max(6,Math.min(22,J*.55)),j=se(k,P,Math.max(2,Math.min(4,i.length)));return o`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${_} ${v}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${a("chart_history",c)}">
        ${p?B.ticks.map($=>{let z=A($);return z<Vt-1||z>E+1?h:X`
            <line x1="${f}" y1="${R(z)}" x2="${_-b}" y2="${R(z)}" stroke="var(--divider-color)" stroke-width="1" opacity="0.55" />
            <text x="${f-6}" y="${R(z+3.5)}" text-anchor="end" fill="var(--primary-color)" font-size="10.5">${_t($,c)}${e}</text>`}):h}
        ${u?F.ticks.map($=>{let z=G($);return z<Vt-1||z>E+1?h:X`<text x="${_-b+6}" y="${R(z+3.5)}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="10.5">${_t($,c)}m</text>`}):h}

        ${p?i.filter($=>$.cost>0).map($=>X`
          <rect x="${R(x($.ts)-W/2)}" y="${R(A($.cost))}" width="${R(W)}" height="${R(E-A($.cost))}"
            fill="var(--primary-color)" opacity="0.6" rx="2">
            <title>${At($.ts,c,!0)}: ${K($.cost,e,c)}${$.duration?` \xB7 ${$.duration}m`:""}</title>
          </rect>
        `):h}
        ${u?X`
          <polyline points="${i.map($=>`${R(x($.ts))},${R(G($.duration))}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${i.map($=>X`
            <circle cx="${R(x($.ts))}" cy="${R(G($.duration))}" r="3.5" fill="var(--accent-color, #ff9800)">
              <title>${At($.ts,c,!0)}: ${$.duration}m${$.cost?` \xB7 ${K($.cost,e,c)}`:""}</title>
            </circle>
          `)}
        `:h}

        <line x1="${f}" y1="${E}" x2="${_-b}" y2="${E}" stroke="var(--divider-color)" stroke-width="1" />
        ${j.map(($,z)=>{let Ot=z===0?"start":z===j.length-1?"end":"middle";return X`<text x="${R(x($))}" y="${v-6}" text-anchor="${Ot}" fill="var(--secondary-text-color)" font-size="10">${At($,c,ut)}</text>`})}
      </svg>
    </div>
    <div class="chart-legend">
      ${p?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${a("cost",c)}</span>`:h}
      ${u?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${a("duration",c)}</span>`:h}
    </div>
  `}function Me(l,c,t){if(!l.responsible_user_id)return h;let e=t?.(l.responsible_user_id)??null;if(e)return o`<span class="user-badge">${Qe(e)}${e.name}</span>`;let i=c(l.responsible_user_id);return i?o`
    <span class="user-badge">
      <ha-icon icon="mdi:account"></ha-icon>
      ${i}
    </span>
  `:h}function bs(l,c){let t=c.lang,e=c.isOperator,i=l.archived?"archived":l.is_done?"done":l.status==="due_soon"?"warning":l.status||"ok",s=l.archived?a("archived",t):l.is_done?a("completed",t):a(l.status||"ok",t);return o`
    <div class="task-header">
      <div class="task-header-title">
        <span class="task-name-breadcrumb" @click=${()=>c.showTaskView()}>${l.name}</span>
        ${Dt(c.taskRef??null,a("ref_number",t))}
        <span class="breadcrumb-separator">·</span>
        <span class="object-name-breadcrumb" @click=${()=>c.showObject()}>${c.objectName}</span>
        <span class="status-chip ${i}">${s}</span>
        ${l.due_override?o`<span class="postponed-badge" title="${a("postponed_to",t)}">
          <ha-icon icon="mdi:calendar-arrow-right"></ha-icon>${Q(l.due_override,t)}
        </span>`:h}
        ${Me(l,c.getUserName,c.getPerson)}
        ${l.notify_enabled===!1?o`<span class="nfc-badge muted-badge" title="${a("no_notifications",t)}"><ha-icon icon="mdi:bell-off-outline"></ha-icon></span>`:h}
        ${l.nfc_tag_id?o`<span class="nfc-badge" title="${a("nfc_tag_id",t)}: ${l.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>`:e?h:o`<span class="nfc-badge unlinked" title="${a("nfc_link_hint",t)}"
              @click=${()=>c.openEdit(l)}>
              <ha-icon icon="mdi:nfc-variant"></ha-icon>
            </span>`}
      </div>
      <div class="task-header-actions">
        <ha-button appearance="accent" variant="success" @click=${()=>c.openComplete(l)}>${a("complete",t)}</ha-button>
        ${l.allow_skip!==!1?o`<ha-button appearance="outlined" variant="warning" .disabled=${c.actionLoading} @click=${()=>c.promptSkip()}>${a("skip",t)}</ha-button>`:h}
        <div class="more-menu-wrapper">
          <ha-icon-button .disabled=${c.actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${()=>c.toggleMoreMenu()}></ha-icon-button>
          ${c.moreMenuOpen?o`
            <div class="popup-menu" @click=${n=>n.stopPropagation()}>
              ${e?h:o`
                <div class="popup-menu-item" @click=${()=>{c.closeMoreMenu(),c.openEdit(l)}}>${a("edit",t)}</div>
              `}
              <div class="popup-menu-item" @click=${()=>{c.closeMoreMenu(),c.openQr(l.name)}}>${a("qr_code",t)}</div>
              <div class="popup-menu-item" @click=${()=>{c.closeMoreMenu(),c.printWorksheet()}}>${a("worksheet",t)}</div>
              ${e?h:o`
                <div class="popup-menu-item" @click=${()=>c.duplicateTask()}>${a("duplicate",t)}</div>
                <div class="popup-menu-item" @click=${()=>c.moveTask()}>${a("move_task",t)}</div>
                <div class="popup-menu-item" @click=${()=>{c.closeMoreMenu(),c.promptReset()}}>${a("reset",t)}</div>
                <div class="popup-menu-item" @click=${()=>{c.closeMoreMenu(),c.promptPostpone()}}>${a("postpone",t)}…</div>
                <div class="popup-menu-item" @click=${()=>{c.closeMoreMenu(),c.snoozeTask()}}>${a("snooze",t)}</div>
                <div class="popup-menu-item" @click=${()=>{c.closeMoreMenu(),c.toggleArchive(!!l.archived)}}>${l.archived?a("unarchive",t):a("archive",t)}</div>
                <div class="popup-menu-divider"></div>
                <div class="popup-menu-item danger" @click=${()=>{c.closeMoreMenu(),c.deleteTask()}}>${a("delete",t)}</div>
              `}
            </div>
          `:h}
        </div>
      </div>
    </div>
  `}function ys(l){let c=l.lang;return o`
    <div class="tab-bar">
      <div class="tab ${l.activeTab==="overview"?"active":""}" @click=${()=>l.setActiveTab("overview")}>
        ${a("overview",c)}
      </div>
      <div class="tab ${l.activeTab==="history"?"active":""}" @click=${()=>l.setActiveTab("history")}>
        ${a("history",c)}
      </div>
    </div>
  `}function Pi(l,c,t,e){let i=e.collapsedSections.has(l);return o`
    <div class="collapsible ${i?"collapsed":""}">
      <button class="collapsible-head" @click=${()=>e.toggleSection(l)}
        aria-expanded=${i?"false":"true"}>
        <ha-icon icon="${i?"mdi:chevron-right":"mdi:chevron-down"}"></ha-icon>
        <span>${a(c,e.lang)}</span>
      </button>
      ${i?h:o`<div class="collapsible-body">${t}</div>`}
    </div>
  `}function xs(l,c){if(!We(l))return h;let t=c.lang,e=l.phase_sequence,i=Ue(l.phase_cursor,e.length),s=new Map;for(let n=l.history.length-1;n>=0;n--){let d=l.history[n];d.phase_id&&d.type==="completed"&&!s.has(d.phase_id)&&s.set(d.phase_id,d.timestamp)}return o`
    <div class="phases-card">
      <div class="phases-card-header">
        <ha-icon icon="mdi:rotate-right"></ha-icon>
        <span>${a("phase_sequence_label",t)}</span>
      </div>
      <div class="phases-strip">
        ${e.map((n,d)=>{let r=l.phases?.[n]?.name||n,p=s.get(n);return o`
            <div class="phase-step ${d===i?"current":""}"
              title=${d===i?a("phase_current",t):a("phase_set",t)}
              @click=${()=>{d!==i&&c.setPhaseCursor(d)}}>
              <span class="phase-step-name">${d+1}. ${r}</span>
              ${p?o`<span class="phase-step-last">${Q(p,t)}</span>`:h}
            </div>
          `})}
      </div>
    </div>
  `}function ws(l,c){if(!c.features.checklists)return h;let t=ee(l)?.checklist??(l.checklist||[]);if(t.length===0)return h;let e=c.lang,i=l.checklist_progress||{},s=t.filter(n=>i[n]).length;return o`
    <div class="checklist-preview-card">
      <div class="checklist-preview-header">
        <ha-icon icon="mdi:format-list-checks"></ha-icon>
        <span>${a("checklist",e)} (${s}/${t.length})</span>
      </div>
      <ol class="checklist-preview-list">
        ${t.map(n=>o`
          <li class=${i[n]?"checked":""}>
            <label>
              <input
                type="checkbox"
                .checked=${!!i[n]}
                @change=${d=>c.setChecklistItem(n,d.target.checked)}
              />
              <span>${n}</span>
            </label>
          </li>
        `)}
      </ol>
    </div>
  `}function ks(l,c){let t=at(l.documentation_url)?l.documentation_url:null,e=at(c.objectDocUrl)?c.objectDocUrl:null,i=e?null:(c.objectManualDocs||[])[0];if(!l.notes&&!t&&!e&&!i)return h;let s=c.lang;return o`
    <div class="task-meta-card">
      ${l.notes?o`
        <div class="task-meta-row">
          <ha-icon icon="mdi:note-text-outline"></ha-icon>
          <span class="task-meta-notes">${te(l.notes)}</span>
        </div>
      `:h}
      ${t?o`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:open-in-new"></ha-icon>
          <a href="${t}" target="_blank" rel="noopener noreferrer">${a("documentation_label",s)}</a>
        </div>
      `:h}
      ${e?o`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="${e}" target="_blank" rel="noopener noreferrer">${a("documentation_url_label",s)} (${c.objectName})</a>
        </div>
      `:i?o`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="#" title=${i.title}
            @click=${n=>{n.preventDefault(),c.openManualDoc(i)}}
            >${a("documentation_url_label",s)} (${c.objectName})</a>
        </div>
      `:h}
    </div>
  `}function $s(l,c){let t=c.lang,e=l.times_performed>0?l.total_cost/l.times_performed:0,i=l.days_until_due!==null&&l.days_until_due!==void 0?l.days_until_due<0?"overdue":l.days_until_due<=l.warning_days?"warning":"":"";return o`
    <div class="kpi-bar">
      <div class="kpi-card">
        <div class="kpi-label">${a("next_due",t)}</div>
        <div class="kpi-value">${l.next_due?Q(l.next_due,t):"\u2014"}</div>
        ${c.features.schedule_time&&l.schedule_time?o`<div class="kpi-subtext">${a("at_time",t)} ${l.schedule_time}</div>`:h}
      </div>
      <div class="kpi-card ${i}">
        <div class="kpi-label">${a("days_until_due",t)}</div>
        <div class="kpi-value-large">${l.days_until_due!==null&&l.days_until_due!==void 0?l.days_until_due:"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("interval",t)}</div>
        <div class="kpi-value">${St(l,t)}</div>
        ${c.features.adaptive&&l.suggested_interval&&l.suggested_interval!==l.interval_days?o`
          <div class="kpi-subtext">${a("recommended",t)}: ${l.suggested_interval}${l.interval_analysis?.confidence_interval_low!=null?` (${l.interval_analysis.confidence_interval_low}\u2013${l.interval_analysis.confidence_interval_high})`:""}</div>
        `:h}
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("warning",t)}</div>
        <div class="kpi-value">${l.warning_days} ${a("days",t)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("last_performed",t)}</div>
        <div class="kpi-value">${l.last_performed?Q(l.last_performed,t):"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("avg_cost",t)}</div>
        <div class="kpi-value">${K(e,c.currencySymbol,t)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("avg_duration",t)}</div>
        <div class="kpi-value">${l.average_duration?Lt(Math.round(l.average_duration),t):"\u2014"}</div>
      </div>
    </div>
  `}function Ts(l,c){let t=c.lang;if(!c.features.adaptive||!l.suggested_interval||l.suggested_interval===l.interval_days)return h;if(c.suggestionDismissed)return h;let e=l.suggested_interval;return o`
    <div class="recommendation-card">
      <h4>${a("suggested_interval",t)}</h4>
      ${pi(l.interval_days,e,l.interval_confidence||"medium",t)}
      <div class="recommendation-actions">
        <ha-button appearance="filled"
          @click=${()=>c.applySuggestion(e)}>
          ${a("apply_suggestion",t)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${()=>c.reanalyze()}>
          ${a("reanalyze",t)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${()=>c.dismissSuggestion()}>
          ${a("dismiss_suggestion",t)}
        </ha-button>
      </div>
    </div>
  `}function js(l,c){let t=c.lang,e=l.history.slice(-3).reverse();return e.length===0?h:o`
    <div class="recent-activities">
      <h3>${a("recent_activities",t)}</h3>
      ${e.map(i=>li(i,c.history,{compact:!0,showEdit:!1}))}
      <div class="activity-show-all">
        <ha-button appearance="plain" @click=${()=>c.setActiveTab("history")}>${a("show_all",t)} →</ha-button>
      </div>
    </div>
  `}function Ss(l,c){let t=c.lang,e=c.features.adaptive&&l.suggested_interval&&l.suggested_interval!==l.interval_days,i=c.features.seasonal&&l.seasonal_factor&&l.seasonal_factor!==1,s=e||i,n=c.features.adaptive&&l.interval_analysis?.weibull_beta!=null&&l.interval_analysis?.weibull_eta!=null,d=c.features.seasonal&&(l.seasonal_factors?.length===12||l.interval_analysis?.seasonal_factors?.length===12);return o`
    <div class="tab-content overview-tab">
      ${l.battery_fleet_task?o`<maintenance-battery-fleet-section .hass=${c.hass}></maintenance-battery-fleet-section>`:h}
      ${$s(l,c)}
      ${ks(l,c)}
      ${l.battery_fleet_task?h:o`
            ${Ri(l,c.lang)}
            ${Ci(l,c.sparkline)}
            ${di(l,t,c.features)}
          `}
      <div class="two-column-layout ${s?"":"single-column"}">
        ${s?o`
          <div class="left-column">
            ${Ts(l,c)}
            ${hi(l,t,c.features)}
          </div>
        `:h}
        <div class="right-column">
          ${Ai(l,t,c.costDurationToggle,r=>c.setCostDurationToggle(r),c.currencySymbol)}
        </div>
      </div>
      ${n?Pi("weibull","weibull_reliability_curve",ci(l,t),c):h}
      ${d?Pi("seasonal","seasonal_chart_title",o`
            ${ui(l,t)}
            <div class="seasonal-actions">
              <ha-button appearance="plain" @click=${()=>c.openSeasonalOverrides(l)}>
                ${a("edit_seasonal_overrides",t)}
              </ha-button>
            </div>
          `,c):h}
      ${xs(l,c)}
      ${ws(l,c)}
      ${js(l,c)}
    </div>
  `}function Es(l,c){return o`
    <div class="tab-content history-tab">
      <div class="history-add-past">
        <ha-button appearance="plain" class="history-add-past-btn" @click=${()=>c.openComplete(l)}>
          <ha-icon icon="mdi:calendar-plus"></ha-icon>
          ${a("history_add_past",c.lang)}
        </ha-button>
      </div>
      ${oi(l,c.history)}
      ${ni(l,c.history)}
    </div>
  `}function Rs(l,c){switch(c.activeTab){case"overview":return Ss(l,c);case"history":return Es(l,c);default:return h}}function zi(l,c){return o`
    <div class="detail-section">
      ${bs(l,c)}
      ${ys(c)}
      ${Rs(l,c)}
      <maintenance-task-documents
        .hass=${c.hass}
        .entryId=${c.entryId}
        .taskId=${c.taskId}
        .canWrite=${!c.isOperator}
      ></maintenance-task-documents>
    </div>
  `}var Ut=class extends H{createRenderRoot(){return this}render(){return!this.task||!this.ctx?h:o`${zi(this.task,this.ctx)}`}};g([S({attribute:!1})],Ut.prototype,"task",2),g([S({attribute:!1})],Ut.prototype,"ctx",2);customElements.get("maintenance-task-detail-view")||customElements.define("maintenance-task-detail-view",Ut);function Li(l){if(l.total<=0)return{start:0,end:0,padTop:0,padBottom:0};let c=l.overscan??12,t=Math.max(1,l.step??6),e=Math.max(1,l.rowHeight),i=Math.floor((l.scrollTop-l.listTop)/e),s=Math.ceil(l.viewportHeight/e)+1,n=Math.max(0,i-c);n=Math.floor(n/t)*t;let d=Math.min(l.total,Math.max(i,0)+s+c);return d=Math.min(l.total,Math.ceil(d/t)*t),n>=d&&(n=Math.min(n,Math.max(0,l.total-1)),d=Math.min(l.total,n+Math.max(s,1))),{start:n,end:d,padTop:n*e,padBottom:(l.total-d)*e}}var he={mode:"top",marginTop:0,lastScrollTop:0};function Hi(l,c){return l==="top"?8:c.viewH-c.paneH-8}function Ni(l){let c=l.scrollTop+8-l.layoutTop,t=Math.max(0,l.listH-l.paneH);return{mode:"top",marginTop:c>t?Math.max(0,c):0,lastScrollTop:l.scrollTop}}function Bi(l,c){let t=c.scrollTop,e=c.scrollTop>l.lastScrollTop?"down":c.scrollTop<l.lastScrollTop?"up":"none",i=Math.max(0,c.listH-c.paneH),s=c.paneH+16<=c.viewH||c.listH<=c.paneH,{mode:n,marginTop:d}=l;if(s&&(n="top"),n==="top"&&d>0&&e==="up")d=Math.max(0,Math.min(d,c.scrollTop+8-c.layoutTop)),d<=i&&(d=0);else if(!s&&e==="down"&&n==="top"){let r=c.renderedTop-c.layoutTop;r<=i&&(n="bottom",d=Math.max(0,r))}else!s&&e==="up"&&n==="bottom"&&(d=Math.min(Math.max(0,c.renderedTop-c.layoutTop),i),c.scrollTop+8<=c.layoutTop+d&&(n="top",d=0));return{mode:n,marginTop:d,lastScrollTop:t}}var ue=2,Os=250,Mt={objects:6,tasks:10,parts:6,documents:8,history:6},Cs="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z",Oe=["due_date","object","type","task_name","area","assigned_user","group"],Fi=["none","area","group","user","object"],Ds=["overdue","due_soon","triggered","ok"],w=class extends H{constructor(){super(...arguments);this.narrow=!1;this.tight=!1;this.split=!1;this._tightObserver=null;this.panel={};this.embedded=!1;this.presets={};this._presetsApplied=!1;this._mountPath=null;this._objects=[];this._stats=null;this._view="overview";this._allParts=null;this._selectedEntryId=null;this._selectedTaskId=null;this._filterStatus="";this._filterUser=null;this._filterLabel=null;this._filterPriority="";this._savedViews=[];this._activeViewId="";this._unsub=null;this._chartRangeDays=(()=>{try{let t=parseInt(it(I.chartRange)||"",10);return[7,30,90,365].includes(t)?t:30}catch{return 30}})();this._hideOutliers=(()=>{try{return it(I.chartHideOutliers)==="1"}catch{return!1}})();this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._adminPanelUserIds=[];this._operatorWriteEnabled=!1;this._defaultWarningDays=7;this._rowActionStyle="buttons_compact";this._refsInLists=!1;this._rowActionNotice=!1;this._actionLoading=!1;this._moreMenuOpen=!1;this._objMenuOpen=!1;this._toastMessage="";this._toastUndo=null;this._toastActionLabel="";this._filtersOpen=!1;this._newMenuOpen=!1;this._gsSetupsCount=0;this._gsAdoptCount=0;this._gsLoaded=!1;this._batteryFleetSetupAvailable=!1;this._staleBundle=!1;this._staleChecked=!1;this._toastTimer=null;this._dismissedSuggestions=new Set;this._overviewTab=(()=>{try{let t=it(I.overviewTab);return t==="today"||t==="calendar"?t:"dashboard"}catch{return"dashboard"}})();this._activeTab="overview";this._costDurationToggle="both";this._historySearch="";this._sortMode="due_date";this._objectSortMode="alphabetical";this._groupByMode="none";this._objectViewMode="cards";this._objectsTableColumns=Fe;this._showArchived=!1;this._bulkMode=!1;this._bulkSelected=new Set;this._virtStart=0;this._virtEnd=0;this._virtRowHeight=53;this._virtTotalRows=0;this._virtScrollAttached=!1;this._virtRaf=0;this._stickyState=he;this._stickySelectPending=!1;this._stickyRaf=0;this._stickyAttached=!1;this._stickyObserver=null;this._collapsedGroups=new Set;this._collapsedSections=(()=>{try{return new Set(JSON.parse(it(I.collapsedSections)||"[]"))}catch{return new Set}})();this._paletteOpen=!1;this._paletteQuery="";this._paletteActive=0;this._searchRemote=null;this._searchTimer=null;this._searchSeq=0;this._templateGalleryOpen=!1;this._templates=[];this._templateCategories={};this._templateBusy=!1;this._statsService=null;this._userService=null;this._dataLoaded=!1;this._lastConnection=null;this._popstateHandler=t=>this._onPopState(t);this._locationChangedHandler=()=>this._onLocationChanged();this._lazyUi=null;this._onStickyScroll=()=>{this._stickyRaf||(this._stickyRaf=requestAnimationFrame(()=>{this._stickyRaf=0,this._updateStickyPane()}))};this._onVirtualScroll=()=>{this._virtRaf||(this._virtRaf=requestAnimationFrame(()=>{this._virtRaf=0,this._updateVirtualWindow()}))};this._deepLinkHandled=!1;this._deepLinkInPlace=!1;this._initialLoadDone=!1;this._kpiRefreshInFlight=!1;this._kpiRefreshPending=!1;this._paletteKeydown=t=>{if(t.key==="/"&&!t.ctrlKey&&!t.metaKey&&!t.altKey&&!this._paletteOpen){let i=t.composedPath()[0];if(i instanceof HTMLElement&&(i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.tagName==="SELECT"||i.isContentEditable))return;t.preventDefault(),this._openPalette();return}if(!this._paletteOpen)return;let e=this._paletteResults;if(t.key==="Escape")t.preventDefault(),this._closePalette();else if(t.key==="ArrowDown")t.preventDefault(),this._paletteActive=Math.min(this._paletteActive+1,e.length-1);else if(t.key==="ArrowUp")t.preventDefault(),this._paletteActive=Math.max(this._paletteActive-1,0);else if(t.key==="Enter"){t.preventDefault();let i=e[this._paletteActive];i&&this._selectPaletteResult(i)}};this._onDialogEvent=async()=>{try{await this._loadData()}catch{}};this._onCalendarLlCustom=t=>{let e=t.detail;e?.type==="maintenance-supporter:open-task"&&e.entry_id&&e.task_id&&(t.stopPropagation(),this._showTask(e.entry_id,e.task_id))};this._fullHistory=null;this._onHistoryEntrySaved=async()=>{await this._loadData()}}get _currencySymbol(){return Kt(this._budget)}get _lang(){return U(this.hass)}get _isOperator(){let t=this.hass?.user;return t?t.is_admin?!1:!(this._operatorWriteEnabled&&this._adminPanelUserIds.includes(t.id)):!0}_ensureLazyUi(){return this._lazyUi||(this._lazyUi=Promise.all([import("/maintenance_supporter_panelfiles/panel-chunks/object-dialog-5UQNDIIJ.js"),import("/maintenance_supporter_panelfiles/panel-chunks/task-dialog-TW6W4CMC.js"),import("/maintenance_supporter_panelfiles/panel-chunks/complete-dialog-MHAHBIAG.js"),import("/maintenance_supporter_panelfiles/panel-chunks/qr-dialog-AUMM56DD.js"),import("/maintenance_supporter_panelfiles/panel-chunks/adopt-problem-sensors-dialog-5J46BCZT.js"),import("/maintenance_supporter_panelfiles/panel-chunks/suggested-setups-dialog-WWGWZOP4.js"),import("/maintenance_supporter_panelfiles/panel-chunks/settings-view-HTQJE4RB.js")]).then(()=>this.updateComplete)),this._lazyUi}async _ui(t){return await this._ensureLazyUi(),this.shadowRoot?.querySelector(t)??null}connectedCallback(){super.connectedCallback(),this._mountPath=window.location.pathname;let t=window.requestIdleCallback,e=()=>this._ensureLazyUi();t?t(e,{timeout:3e3}):window.setTimeout(e,1500),window.addEventListener("popstate",this._popstateHandler),window.addEventListener("location-changed",this._locationChangedHandler),window.addEventListener("keydown",this._paletteKeydown),typeof ResizeObserver<"u"&&(this._tightObserver=new ResizeObserver(i=>{let s=i[0]?.contentRect.width??0;s>0&&(this.tight=s<1e3),s>0&&(this.split=s>=1500)}),this._tightObserver.observe(this)),window.addEventListener("resize",this._onVirtualScroll,{passive:!0});try{let i=it(I.taskSort);i&&Oe.includes(i)&&(this._sortMode=i);let s=it(I.objectSort);s&&["alphabetical","due_soonest","task_count"].includes(s)&&(this._objectSortMode=s);let n=it(I.groupBy);n&&Fi.includes(n)&&(this._groupByMode=n);let d=it(I.objectView);(d==="cards"||d==="table")&&(this._objectViewMode=d)}catch{}if(this._objects.length===0){let i=fi();i&&(this._objects=i.objects,i.stats&&(this._stats=i.stats))}}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("popstate",this._popstateHandler),window.removeEventListener("location-changed",this._locationChangedHandler),window.removeEventListener("keydown",this._paletteKeydown),this._tightObserver?.disconnect(),this._tightObserver=null,window.removeEventListener("resize",this._onVirtualScroll),this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onVirtualScroll),this._virtScrollAttached=!1,this._virtRaf&&cancelAnimationFrame(this._virtRaf),this._detachStickyPane(),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._initialLoadDone=!1,this._lastConnection=null,this._deepLinkHandled=!1,this._searchTimer&&(clearTimeout(this._searchTimer),this._searchTimer=null),this._toastTimer&&(clearTimeout(this._toastTimer),this._toastTimer=null),this._toastMessage="",this._toastUndo=null,this._toastActionLabel="",this._statsService?.clearCache(),this._statsService=null}willUpdate(t){super.willUpdate(t),t.has("_groupByMode")&&this._collapsedGroups.size>0&&(this._collapsedGroups=new Set)}updated(t){if(super.updated(t),It(this,t),t.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},""),this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new ae(this.hass),this._fetchMiniStatsForOverview()),this._userService?this._userService.updateHass(this.hass):(this._userService=new Xe(this.hass),this._userService.getUsers())}let e=this.shadowRoot?.querySelector(".content");e&&!this._virtScrollAttached&&(e.addEventListener("scroll",this._onVirtualScroll,{passive:!0}),this._virtScrollAttached=!0),this._updateVirtualWindow(),this._syncStickyPane(e)}_syncStickyPane(t){let e=this.shadowRoot?.querySelector(".split-pane");if(!e||!t){this._stickyAttached&&this._detachStickyPane();return}this._stickyAttached||(t.addEventListener("scroll",this._onStickyScroll,{passive:!0}),window.addEventListener("resize",this._onStickyScroll),typeof ResizeObserver<"u"&&(this._stickyObserver=new ResizeObserver(this._onStickyScroll)),this._stickyAttached=!0),this._stickyObserver?.observe(e),this._updateStickyPane()}_detachStickyPane(){this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onStickyScroll),window.removeEventListener("resize",this._onStickyScroll),this._stickyObserver?.disconnect(),this._stickyObserver=null,this._stickyRaf&&cancelAnimationFrame(this._stickyRaf),this._stickyRaf=0,this._stickyAttached=!1,this._stickyState=he,this._stickySelectPending=!1}_updateStickyPane(){let t=this.shadowRoot,e=t?.querySelector(".content"),i=t?.querySelector(".split-pane"),s=t?.querySelector(".split-layout"),n=t?.querySelector(".split-list");if(!e||!i||!s||!n)return;let d=e.getBoundingClientRect().top-e.scrollTop,r={scrollTop:e.scrollTop,viewH:e.clientHeight,paneH:i.offsetHeight,listH:n.offsetHeight,layoutTop:s.getBoundingClientRect().top-d,renderedTop:i.getBoundingClientRect().top-d};this._stickySelectPending&&r.scrollTop===this._stickyState.lastScrollTop?this._stickyState=Ni(r):(this._stickySelectPending=!1,this._stickyState=Bi(this._stickyState,r));let p=this._stickyState;i.style.top=`${Hi(p.mode,r)}px`,i.style.marginTop=p.marginTop>0?`${p.marginTop}px`:""}_resetStickyPane(){let t=this.shadowRoot?.querySelector(".content");this._stickyState={...he,lastScrollTop:t?.scrollTop??0},this._stickySelectPending=!0}_updateVirtualWindow(){let t=this.shadowRoot?.querySelector(".content"),e=this.shadowRoot?.querySelector(".task-table.virtual");if(!t||!e)return;let i=e.querySelector(".task-row:not(.virt-sizer)");i&&i.offsetHeight>20&&(this._virtRowHeight=i.offsetHeight);let s=e.getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop,n=Li({scrollTop:t.scrollTop,viewportHeight:t.clientHeight,listTop:s,rowHeight:this._virtRowHeight,total:this._virtTotalRows});(n.start!==this._virtStart||n.end!==this._virtEnd)&&(this._virtStart=n.start,this._virtEnd=n.end)}async _loadData(){let[t,e,i,s,n,d]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"}).catch(()=>null)]);if(d&&(this._savedViews=d.views||[]),t&&(this._objects=qt(t.objects),xe(this._objects,e??this._stats??null),this._maybeLoadGettingStarted()),this._detailOpen()&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/status"}).then(r=>{this._batteryFleetSetupAvailable=!!r.available&&!r.configured}).catch(()=>{this._batteryFleetSetupAvailable=!1}),this._staleChecked||(this._staleChecked=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/version"}).then(r=>{this._staleBundle=Ce(r?.version)}).catch(()=>{})),e&&(this._stats=e),i&&(this._budget=i,zt(this._budget)),s&&(this._groups=s.groups||{}),n){let r=n;this._features=r.features,this._adminPanelUserIds=r.admin_panel_user_ids||[],this._operatorWriteEnabled=r.operator_write_enabled??!1;let p=r.general?.default_warning_days;typeof p=="number"&&p>=0&&p<=365&&(this._defaultWarningDays=p);let u=r.general?.row_action_style;this._rowActionStyle=u==="icons"||u==="buttons"?u:"buttons_compact",this._rowActionNotice=r.general?.row_action_notice_pending===!0,this._refsInLists=r.general?.ref_numbers_in_lists===!0,this._objectsTableColumns=qe(r.objects_table_columns)}this._fetchMiniStatsForOverview(),this._initialLoadDone=!0,this._handleDeepLink()}_onLocationChanged(){if(!this._initialLoadDone||!window.location.search||this.embedded&&this._mountPath!==null&&window.location.pathname!==this._mountPath)return;if(!this.embedded){let e=`/${typeof this.panel?.url_path=="string"?this.panel.url_path:"maintenance-supporter"}`,i=window.location.pathname;if(i!==e&&!i.startsWith(`${e}/`))return}this._deepLinkHandled=!1,this._deepLinkInPlace=!0;try{this._handleDeepLink()}finally{this._deepLinkInPlace=!1}history.state?.msp_view||history.replaceState({msp_view:this._view,msp_entry:this._selectedEntryId,msp_task:this._selectedTaskId},"")}_handleDeepLink(){if(this._deepLinkHandled)return;let t=new URLSearchParams(window.location.search),e=t.get("ms_action"),i=()=>{let b=window.location.pathname+window.location.hash;history.replaceState(history.state,"",b)};if(e==="add_object"){this._deepLinkHandled=!0,i(),this._ui("maintenance-object-dialog").then(b=>b?.openCreate());return}if(e==="open_vacation"||e==="open_budget"||e==="open_groups"||e==="open_settings"){if(this._deepLinkHandled=!0,i(),!this.hass?.user?.is_admin)return;this._overviewTab="settings",this._ensureLazyUi().then(()=>requestAnimationFrame(()=>{let b=this.shadowRoot?.querySelector("maintenance-settings-view"),T=e.replace("open_","");b?.scrollToSection?.(T)}));return}if(this.embedded&&!this._presetsApplied){this._presetsApplied=!0;let b=this.presets?.tab??"",T=(this.presets?.view??"").trim();if(!t.has("tab")&&ye.includes(b)&&(b!=="settings"||this.hass?.user?.is_admin)&&(this._overviewTab=b),!t.has("view")&&T){let E=T.toLowerCase(),C=this._savedViews.find(k=>k.id===T)??this._savedViews.find(k=>k.name.trim().toLowerCase()===E);C&&(this._overviewTab="dashboard",this._applyView(C.id))}}let s=t.get("tab"),n=t.get("view"),d=t.get("sort"),r=t.get("status");if(s!==null||n!==null||d!==null||r!==null){if(i(),this._view!=="overview"&&(this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()),ye.includes(s??"")&&(s!=="settings"||this.hass?.user?.is_admin)&&this._setOverviewTab(s),n!==null){let b=n.trim().toLowerCase(),T=this._savedViews.find(E=>E.id===n)??this._savedViews.find(E=>E.name.trim().toLowerCase()===b);T&&(this._overviewTab!=="dashboard"&&this._setOverviewTab("dashboard"),this._applyView(T.id))}Oe.includes(d??"")&&(this._sortMode=d,this._activeViewId="",Y(I.taskSort,this._sortMode)),Ds.includes(r??"")&&(this._overviewTab!=="dashboard"&&this._setOverviewTab("dashboard"),this._filterByStatus(r))}let p=t.get("entry_id");if(!p)return;this._deepLinkHandled=!0;let u=t.get("task_id"),_=t.get("action"),v=window.location.pathname+window.location.hash;history.replaceState(history.state,"",v);let f=this._getObject(p);if(!f){this._showOverview();return}if(u){let b=f.tasks.find(T=>T.id===u);if(!b){this._showObject(p);return}this._showTask(p,u),_==="complete"?requestAnimationFrame(()=>{this._openCompleteDialog(p,u,b.name,this._features.checklists?b.checklist:void 0,this._features.adaptive&&!!b.adaptive_config?.enabled)}):_==="quick_complete"&&requestAnimationFrame(()=>{this._handleQuickComplete(p,u,b)})}else this._showObject(p)}_isCounterEntity(t){if(!t)return!1;let e=t.type||"threshold";return e==="counter"||e==="state_change"}async _fetchDetailStats(t,e){if(!this._statsService)return;let i=await this._statsService.getDetailStats(t,e,this._chartRangeDays),s=new Map(this._detailStatsData);s.set(t,i),this._detailStatsData=s}_setChartRange(t){if(t===this._chartRangeDays)return;this._chartRangeDays=t;try{Y(I.chartRange,String(t))}catch{}let e=this._selectedEntryId&&this._selectedTaskId?this._getTask(this._selectedEntryId,this._selectedTaskId):null,i=e?.trigger_config?.entity_id;if(i){let s=new Map(this._detailStatsData);s.delete(i),this._detailStatsData=s,this._fetchDetailStats(i,this._isCounterEntity(e.trigger_config))}}_setHideOutliers(t){if(t!==this._hideOutliers){this._hideOutliers=t;try{Y(I.chartHideOutliers,t?"1":"0")}catch{}}}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let t=[];for(let i of this._objects)for(let s of i.tasks){let n=s.trigger_config?.entity_id;n&&t.push({entityId:n,isCounter:this._isCounterEntity(s.trigger_config)})}if(t.length===0)return;let e=await this._statsService.getBatchMiniStats(t);this._miniStatsData=new Map([...this._miniStatsData,...e])}async _subscribe(){try{let t=await this.hass.connection.subscribeMessage(e=>{let i=e,s=vi(this._objects,i);s!==null&&(this._objects=s,e.objects&&xe(s,this._stats??null),this._refreshKpis(),this._detailOpen()&&(i.objects||(i.delta||[]).some(n=>n.entry_id===this._selectedEntryId))&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId))},{type:"maintenance_supporter/subscribe",deltas:!0,compact:!0});if(!this.isConnected){t();return}this._unsub=t}catch{}}async _refreshKpis(){if(this._kpiRefreshInFlight){this._kpiRefreshPending=!0;return}this._kpiRefreshInFlight=!0;try{do{this._kpiRefreshPending=!1;let[t,e]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null)]);if(!this.isConnected)return;t&&(this._stats=t),e&&(this._budget=e,zt(this._budget))}while(this._kpiRefreshPending)}finally{this._kpiRefreshInFlight=!1}}get _taskRows(){let t=[];for(let _ of this._objects)for(let v of _.tasks){if(!this._showArchived&&v.archived||this._filterStatus&&v.status!==this._filterStatus)continue;if(this._filterUser){let b=this._filterUser==="current_user"?this._userService?.getCurrentUserId():this._filterUser;if(v.responsible_user_id!==b)continue}if(this._filterLabel&&!(v.labels||[]).includes(this._filterLabel)||this._filterPriority&&(v.priority||"normal")!==this._filterPriority)continue;let f=[];for(let b of Object.values(this._groups))b.task_refs?.some(T=>T.entry_id===_.entry_id&&T.task_id===v.id)&&f.push(b.name);t.push({entry_id:_.entry_id,task_id:v.id,object_name:_.object.name,allow_skip:v.allow_skip!==!1,notify_enabled:v.notify_enabled!==!1,task_name:v.name,type:v.type,schedule_type:v.schedule_type,status:v.status,days_until_due:v.days_until_due??null,next_due:v.next_due??null,trigger_active:v.trigger_active,trigger_current_value:v.trigger_current_value??null,trigger_current_delta:v.trigger_current_delta??null,trigger_config:v.trigger_config??null,trigger_entity_info:v.trigger_entity_info??null,times_performed:v.times_performed,total_cost:v.total_cost,interval_days:v.interval_days??null,interval_unit:v.interval_unit??null,interval_anchor:v.interval_anchor??null,is_done:v.is_done??!1,archived:v.archived??!1,history:v.history||[],enabled:v.enabled,nfc_tag_id:v.nfc_tag_id??null,priority:v.priority??"normal",labels:v.labels??[],area_id:_.object.area_id??null,responsible_user_id:v.responsible_user_id??null,group_names:f})}let e={overdue:0,triggered:1,due_soon:2,ok:3},i=(_,v)=>(e[_.status]??9)-(e[v.status]??9),s=(_,v)=>(_.days_until_due??99999)-(v.days_until_due??99999),n=(_,v)=>i(_,v)||s(_,v),d=_=>_.area_id&&this.hass?.areas?.[_.area_id]?.name||"",r=_=>_.responsible_user_id&&this._userService?.getUserName(_.responsible_user_id)||"",p=_=>_.group_names[0]||"",u={due_date:n,object:(_,v)=>_.object_name.localeCompare(v.object_name)||n(_,v),type:(_,v)=>_.type.localeCompare(v.type)||n(_,v),task_name:(_,v)=>_.task_name.localeCompare(v.task_name),area:(_,v)=>{let f=d(_),b=d(v);return!f&&b?1:f&&!b?-1:f.localeCompare(b)||n(_,v)},assigned_user:(_,v)=>{let f=r(_),b=r(v);return!f&&b?1:f&&!b?-1:f.localeCompare(b)||n(_,v)},group:(_,v)=>{let f=p(_),b=p(v);return!f&&b?1:f&&!b?-1:f.localeCompare(b)||n(_,v)}};return t.sort(u[this._sortMode]),t}_getObject(t){return this._objects.find(e=>e.entry_id===t)}_getTask(t,e){return this._getObject(t)?.tasks.find(s=>s.id===e)}_listRef(t,e){if(!this._refsInLists)return h;let i=this._getObject(t);return Dt(xt(i?.object,i?.tasks.find(s=>s.id===e)))}_objRef(t){return this._refsInLists?Dt(yt(t)):h}_pushPanelState(t,e,i){let s={msp_view:t,msp_entry:e||null,msp_task:i||null};this._deepLinkInPlace?history.replaceState(s,""):history.pushState(s,"")}_onPopState(t){let e=t.state;if(e?.msp_view&&(this._view=e.msp_view,this._selectedEntryId=e.msp_entry||null,this._selectedTaskId=e.msp_task||null,this._moreMenuOpen=!1,e.msp_view==="all_parts"&&this._loadAllParts(),e.msp_view==="task"&&e.msp_entry&&e.msp_task)){this._historyFilter=null;let i=this._getTask(e.msp_entry,e.msp_task);i?.trigger_config?.entity_id&&this._fetchDetailStats(i.trigger_config.entity_id,this._isCounterEntity(i.trigger_config))}}_showOverview(){this._pushPanelState("overview"),this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()}_showAllObjects(){this._pushPanelState("all_objects"),this._view="all_objects",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_showAllParts(){this._pushPanelState("all_parts"),this._view="all_parts",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop(),this._loadAllParts()}async _loadAllParts(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});this._allParts=t.parts||[]}catch{this._allParts=[]}}_filterByStatus(t){this._filterStatus=t,this._activeViewId="",this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard"),this._scrollContentToTop()}get _allLabels(){let t=new Set;for(let e of this._objects)for(let i of e.tasks)for(let s of i.labels||[])t.add(s);return[...t].sort((e,i)=>e.localeCompare(i))}get _currentFilters(){return{status:this._filterStatus,user_id:this._filterUser,label:this._filterLabel,priority:this._filterPriority,archived:this._showArchived,sort_mode:this._sortMode,group_by:this._groupByMode}}_applyView(t){if(this._activeViewId=t,!t)return;let e=this._savedViews.find(s=>s.id===t);if(!e)return;let i=e.filters;this._filterStatus=i.status||"",this._filterUser=i.user_id||null,this._filterLabel=i.label||null,this._filterPriority=i.priority||"",this._showArchived=!!i.archived,Oe.includes(i.sort_mode)&&(this._sortMode=i.sort_mode),Fi.includes(i.group_by)&&(this._groupByMode=i.group_by);try{Y(I.taskSort,this._sortMode),Y(I.groupBy,this._groupByMode)}catch{}this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard")}_openSavedViewsDialog(){this.shadowRoot.querySelector("maintenance-saved-views-dialog")?.open(this._currentFilters,this._savedViews)}_onSavedViewsChanged(t){this._savedViews=t.detail.views||[],this._activeViewId&&!this._savedViews.some(e=>e.id===this._activeViewId)&&(this._activeViewId="")}_scrollContentToTop(){requestAnimationFrame(()=>{let t=this.shadowRoot?.querySelector(".content");t&&t.scrollTo({top:0,behavior:"smooth"})})}_showObject(t){this._pushPanelState("object",t),this._view="object",this._selectedEntryId=t,this._selectedTaskId=null,this._scrollContentToTop()}_splitActive(){return this.split&&!this.narrow&&!this.tight&&this._view==="overview"&&this._overviewTab==="dashboard"&&!this._bulkMode}_detailOpen(){return(this._view==="task"||this._splitActive())&&!!this._selectedEntryId&&!!this._selectedTaskId}_showFullTaskPage(t,e){this._view!=="task"&&(this._pushPanelState("task",t,e),this._view="task",this._selectedEntryId=t,this._selectedTaskId=e,this._scrollContentToTop())}_showTask(t,e){if(this._splitActive()){this._selectedEntryId=t,this._selectedTaskId=e,this._activeTab="overview",this._historyFilter=null,this._historySearch="",this._resetStickyPane(),this._fetchFullHistory(t,e);let s=this._getTask(t,e);s?.trigger_config?.entity_id&&this._fetchDetailStats(s.trigger_config.entity_id,this._isCounterEntity(s.trigger_config));return}this._pushPanelState("task",t,e),this._view="task",this._selectedEntryId=t,this._selectedTaskId=e,this._activeTab="overview",this._historyFilter=null,this._historySearch="",this._scrollContentToTop(),this._fetchFullHistory(t,e);let i=this._getTask(t,e);if(i?.trigger_config?.entity_id){let s=i.trigger_config.entity_id,n=this._isCounterEntity(i.trigger_config);this._fetchDetailStats(s,n)}}_showToast(t){this._toastTimer&&clearTimeout(this._toastTimer),this._toastUndo=null,this._toastActionLabel="",this._toastMessage=t,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastTimer=null},4e3)}_showActionToast(t,e,i){this._showUndoToast(t,i),this._toastActionLabel=e}_showUndoToast(t,e){this._toastTimer&&clearTimeout(this._toastTimer),this._toastActionLabel="",this._toastMessage=t,this._toastUndo=e,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastUndo=null,this._toastTimer=null},7e3)}_runToastUndo(){let t=this._toastUndo;this._toastTimer&&clearTimeout(this._toastTimer),this._toastMessage="",this._toastUndo=null,this._toastTimer=null,t?.()}_openPalette(){this._paletteQuery="",this._paletteActive=0,this._paletteOpen=!0,this._searchRemote=null,this.updateComplete.then(()=>{this.shadowRoot?.querySelector(".palette-input")?.focus()})}_closePalette(){this._paletteOpen=!1,this._paletteQuery="",this._searchRemote=null,this._searchTimer&&(clearTimeout(this._searchTimer),this._searchTimer=null)}_onPaletteInput(t){this._paletteQuery=t,this._paletteActive=0,this._searchTimer&&clearTimeout(this._searchTimer);let e=t.trim();if(e.length<ue){this._searchRemote=null;return}this._searchTimer=setTimeout(()=>{this._searchTimer=null;let i=++this._searchSeq;this.hass.connection.sendMessagePromise({type:"maintenance_supporter/search",query:e,limit:Mt.documents}).then(s=>{i!==this._searchSeq||!this._paletteOpen||(this._searchRemote={query:e,documents:s.documents||[],history:s.history||[]})}).catch(()=>{i!==this._searchSeq||!this._paletteOpen||(this._searchRemote={query:e,documents:[],history:[]})})},Os)}get _paletteResults(){let t=this._lang,e=this._paletteQuery.trim();if(e.length<ue&&!Gt(e))return[];let i=Wt(e);if(!i.length)return[];let s=[],n=[],d=[],r=Gt(e);if(r){for(let v of this._objects){let f=v.object;if(f.ref_no!==r.object)continue;let b=yt(f);r.task==null&&s.push({kind:"object",entryId:v.entry_id,label:f.name||"",sub:a("object",t),score:1e3,icon:"mdi:package-variant-closed",ref:b});for(let T of v.tasks)T.archived||r.task!=null&&T.ref_no!==r.task||n.push({kind:"task",entryId:v.entry_id,taskId:T.id,label:T.name||"",sub:f.name||"",score:r.task==null?900:1e3,icon:"mdi:clipboard-check-outline",ref:xt(f,T)})}if(s.length||n.length){let v=this._searchRemote&&this._searchRemote.query===e?this._searchRemote:null,f=[...s,...n.slice(0,Mt.tasks)];for(let b of v?.history.slice(0,1)??[])f.push({kind:"history",entryId:b.entry_id,taskId:b.task_id,label:b.task_name||"",sub:[b.object_name,b.timestamp?Q(b.timestamp,t):""].filter(Boolean).join(" \xB7 "),snippet:b.snippet||"",score:b.score,icon:"mdi:note-text-outline",ref:b.ref??null});return f}}for(let v of this._objects){let f=v.object;if(f.archived)continue;let b=f.name||"",T=Ct(i,[{text:b,weight:3},{text:f.manufacturer,weight:2},{text:f.model,weight:2},{text:f.serial_number,weight:2},{text:f.notes,weight:1}]);if(T>0){let E=[f.manufacturer,f.model].filter(Boolean).join(" ");s.push({kind:"object",entryId:v.entry_id,label:b,sub:E||a("object",t),score:T,icon:"mdi:package-variant-closed",ref:yt(f)})}for(let E of v.tasks){if(E.archived)continue;let C=(E.labels||[]).join(" "),k=Ct(i,[{text:E.name,weight:3},{text:b,weight:2},{text:C,weight:2},{text:E.notes,weight:1}]);if(k>0){let P=(E.labels||[]).length?`  #${(E.labels||[]).join(" #")}`:"";n.push({kind:"task",entryId:v.entry_id,taskId:E.id,label:E.name||"",sub:b+P,score:k,icon:"mdi:clipboard-check-outline",ref:xt(f,E)})}}for(let E of v.parts||[]){let C=Ct(i,[{text:E.name,weight:3},{text:E.mpn,weight:2},{text:E.vendor,weight:1},{text:E.storage_location,weight:1},{text:E.notes,weight:1}]);C>0&&d.push({kind:"part",entryId:v.entry_id,label:E.name||"",sub:[b,E.mpn].filter(Boolean).join(" \xB7 "),score:C,icon:"mdi:cog-outline"})}}let p=(v,f)=>f.score-v.score||v.label.localeCompare(f.label),u=[...s.sort(p).slice(0,Mt.objects),...n.sort(p).slice(0,Mt.tasks),...d.sort(p).slice(0,Mt.parts)],_=this._searchRemote&&this._searchRemote.query===e?this._searchRemote:null;if(_){let v=_.documents.slice(0,Mt.documents);for(let f of[...v.filter(b=>b.match!=="content"),...v.filter(b=>b.match==="content")])u.push({kind:f.match==="content"?"content":"document",entryId:f.entry_id,docId:f.id,docKind:f.kind,url:f.url,page:f.page??null,label:f.title||f.filename||f.url||"",sub:f.object_name||"",snippet:f.snippet||"",score:f.score,icon:f.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"});for(let f of _.history.slice(0,Mt.history))u.push({kind:"history",entryId:f.entry_id,taskId:f.task_id,label:f.task_name||"",ref:f.ref??null,sub:[f.object_name,f.timestamp?Q(f.timestamp,t):""].filter(Boolean).join(" \xB7 "),snippet:f.snippet||"",score:f.score,icon:f.type==="skipped"?"mdi:skip-next-circle-outline":"mdi:note-text-outline"})}return u}_selectPaletteResult(t){let e=this._paletteQuery.trim();switch(this._closePalette(),t.kind){case"task":t.taskId&&this._showTask(t.entryId,t.taskId);return;case"history":if(!t.taskId)return;this._showTask(t.entryId,t.taskId),this._activeTab="history",this._historySearch=e;return;case"document":case"content":t.docKind==="weblink"?at(t.url)&&window.open(t.url,"_blank","noopener"):t.docId&&wt(this.hass,t.docId,t.page?`#page=${t.page}`:"").catch(()=>{});return;default:this._showObject(t.entryId)}}_renderPalette(){if(!this._paletteOpen)return h;let t=this._lang,e=this._paletteResults,i=this._paletteQuery.trim(),s={object:a("objects",t),task:a("tasks",t),part:a("search_group_parts",t),document:a("documents",t),content:a("search_group_content",t),history:a("search_group_history",t)},n=i.length>=ue&&(!this._searchRemote||this._searchRemote.query!==i),d=null;return o`
      <div class="palette-backdrop" @click=${()=>this._closePalette()}>
        <div class="palette" role="dialog" aria-label=${a("search_open",t)} @click=${r=>r.stopPropagation()}>
          <input
            class="palette-input"
            type="text"
            placeholder="${a("palette_placeholder",t)}"
            .value=${this._paletteQuery}
            @input=${r=>this._onPaletteInput(r.target.value)}
          />
          <div class="palette-results">
            ${i.length<ue&&!Gt(i)?o`<div class="palette-empty">${a("search_empty_hint",t)}</div>`:e.length===0?o`<div class="palette-empty">${n?a("search_searching",t):a("palette_no_results",t)}</div>`:e.map((r,p)=>{let u=r.kind!==d?o`<div class="palette-group">${s[r.kind]}</div>`:h;return d=r.kind,o`
                      ${u}
                      <div class="palette-item ${p===this._paletteActive?"active":""} ${r.snippet?"has-snippet":""}"
                        @mouseenter=${()=>{this._paletteActive=p}}
                        @click=${()=>this._selectPaletteResult(r)}>
                        <ha-icon icon="${r.icon}"></ha-icon>
                        <div class="palette-main">
                          <div class="palette-line">
                            <span class="palette-label">${r.label}</span>
                            ${r.ref?o`<span class="ref-chip">#${r.ref}</span>`:h}
                            ${r.page?o`<span class="palette-page">${a("search_page",t).replace("{page}",String(r.page))}</span>`:h}
                            <span class="palette-sub">${r.sub}</span>
                          </div>
                          ${r.snippet?o`<div class="palette-snippet">${r.snippet}</div>`:h}
                        </div>
                      </div>
                    `})}
            ${e.length>0&&n?o`<div class="palette-group palette-waiting">${a("search_searching",t)}</div>`:h}
          </div>
          <div class="palette-hint">${a("palette_hint",t)}</div>
        </div>
      </div>
    `}_openAdoptProblemSensors(){this._ui("maintenance-adopt-problem-sensors-dialog").then(t=>t?.open())}async _onProblemSensorsAdopted(t){let e=t.detail?.tasks_created??0,i=t.detail?.created??[];await this._loadData();let s=a("adopt_problem_done",this._lang).replace("{tasks}",String(e));i.length>0?this._showActionToast(s,a("adopt_problem_configure",this._lang),()=>{let n=i[0],d=this._objects.find(p=>p.entry_id===n.entry_id),r=d?.tasks.find(p=>p.id===n.task_id);d&&r&&this._ui("maintenance-task-dialog").then(p=>p?.openEdit(n.entry_id,r))}):this._showToast(s)}async _setupBatteryFleet(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/setup",language:this.hass.language||"en"});this._batteryFleetSetupAvailable=!1,await this._loadData();let e=this._objects.find(s=>s.entry_id===t.entry_id),i=e?.tasks.find(s=>s.id===t.task_id)||e?.tasks[0];e&&i&&this._showTask(e.entry_id,i.id),this._showToast(a("battery_fleet_setup_done",this._lang))}catch(t){this._showToast(D(t,this._lang))}}_openSuggestedSetups(){this._ui("maintenance-suggested-setups-dialog").then(t=>t?.open())}_onSetupsAdopted(t){let e=t.detail?.tasks_created??0;this._showToast(a("setups_done",this._lang).replace("{tasks}",String(e))),this._loadData()}async _openTemplateGallery(){if(this._templateGalleryOpen=!0,!(this._templates.length>0))try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/templates",language:this._lang});this._templateCategories=t.categories||{},this._templates=(t.templates||[]).filter(e=>!e.disabled)}catch{this._showToast(a("action_error",this._lang))}}async _createFromTemplate(t){this._templateBusy=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/from_template",language:this._lang,template_id:t});this._templateGalleryOpen=!1,await this._loadData(),this._showToast(a("template_created",this._lang)),e?.entry_id&&this._showObject(e.entry_id)}catch{this._showToast(a("action_error",this._lang))}finally{this._templateBusy=!1}}_categoryName(t){let e=this._templateCategories[t];return e&&(e[`name_${this._lang}`]||e.name_en)||t}_renderTemplateGallery(){if(!this._templateGalleryOpen)return h;let t=this._lang,e=new Map;for(let i of this._templates)e.has(i.category)||e.set(i.category,[]),e.get(i.category).push(i);return o`
      <div class="palette-backdrop" @click=${()=>{this._templateGalleryOpen=!1}}>
        <div class="template-gallery" @click=${i=>i.stopPropagation()}>
          <div class="template-gallery-head">
            <span>${a("templates_title",t)}</span>
            <ha-icon-button .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
              @click=${()=>{this._templateGalleryOpen=!1}}></ha-icon-button>
          </div>
          <div class="template-gallery-body">
            ${this._templates.length===0?o`<div class="palette-empty">${a("loading",t)}…</div>`:[...e.entries()].map(([i,s])=>o`
                  <div class="template-cat">
                    <div class="template-cat-head">
                      <ha-icon icon="${this._templateCategories[i]?.icon||"mdi:folder-outline"}"></ha-icon>
                      ${this._categoryName(i)}
                    </div>
                    <div class="template-grid">
                      ${s.map(n=>o`
                        <button class="template-card" .disabled=${this._templateBusy}
                          @click=${()=>this._createFromTemplate(n.id)}>
                          <span class="template-card-name">${n.name}</span>
                          <span class="template-card-count">${a("templates_task_count",t).replace("{n}",String(n.tasks.length))}</span>
                        </button>
                      `)}
                    </div>
                  </div>
                `)}
          </div>
        </div>
      </div>
    `}_bulkKey(t){return`${t.entry_id}:${t.task_id}`}_toggleBulkMode(){this._bulkMode=!this._bulkMode,this._bulkMode||(this._bulkSelected=new Set)}_toggleBulkRow(t){let e=this._bulkKey(t),i=new Set(this._bulkSelected);i.has(e)?i.delete(e):i.add(e),this._bulkSelected=i}_bulkSelectAll(t){let e=t.map(s=>this._bulkKey(s)),i=e.every(s=>this._bulkSelected.has(s));this._bulkSelected=i?new Set:new Set(e)}async _runBulk(t,e,i,s){let n=t.filter(r=>this._bulkSelected.has(this._bulkKey(r)));if(n.length===0)return;this._actionLoading=!0;let d=0;for(let r of n)try{await this.hass.connection.sendMessagePromise(e(r)),d++}catch{}this._actionLoading=!1,this._bulkSelected=new Set,this._bulkMode=!1,await this._loadData(),s&&d>0?this._showUndoToast(i(d),s):this._showToast(i(d))}_bulkComplete(t){this._runBulk(t,e=>({type:"maintenance_supporter/task/complete",entry_id:e.entry_id,task_id:e.task_id}),e=>a("bulk_completed",this._lang).replace("{n}",String(e)))}_bulkArchive(t){let e=t.filter(i=>this._bulkSelected.has(this._bulkKey(i))).map(i=>({entry_id:i.entry_id,task_id:i.task_id}));this._runBulk(t,i=>({type:"maintenance_supporter/task/archive",entry_id:i.entry_id,task_id:i.task_id}),i=>a("bulk_archived",this._lang).replace("{n}",String(i)),async()=>{for(let i of e)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/unarchive",entry_id:i.entry_id,task_id:i.task_id})}catch{}await this._loadData()})}async _runAction(t,e){this._actionLoading=!0;try{let i=await this.hass.connection.sendMessagePromise(t);return await this._loadData(),e?.successToast&&this._showToast(e.successToast),i??{}}catch(i){return this._showToast(D(i,this._lang)),null}finally{this._actionLoading=!1}}async _deleteObject(t){if(!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:a("delete",this._lang),message:a("confirm_delete_object",this._lang),confirmText:a("delete",this._lang),danger:!0}))return;await this._runAction({type:"maintenance_supporter/object/delete",entry_id:t})&&this._showOverview()}_printObjectReport(t){let e=this._getObject(t);if(!e)return;let i=this._lang,s={title:a("report_title",i),generated:a("report_generated",i),manufacturer:a("manufacturer",i),model:a("model",i),serial:a("serial_number_label",i),installed:a("installed",i),warranty:a("warranty",i),area:a("area",i),notes:a("report_notes",i),tasksHeading:a("tasks",i),colTask:a("task_name",i),colType:a("report_col_type",i),colStatus:a("report_col_status",i),colSchedule:a("report_col_schedule",i),colLastDone:a("last_performed",i),colNextDue:a("next_due",i),colCost:a("cost",i),colTimes:a("report_times_done",i),totalCost:a("report_total_cost",i),scheduleLabel:d=>St(d,i),none:"\u2014",statusLabel:d=>a(d,i),typeLabel:d=>a(d,i)},n=bi(e.object,e.tasks,s,d=>d?Q(d,i):"",d=>K(d,this._currencySymbol,i),new Date().toISOString());Nt(n)}async _duplicateObject(t){let e=await this._runAction({type:"maintenance_supporter/object/duplicate",entry_id:t},{successToast:a("object_duplicated",this._lang)});e?.entry_id&&this._showObject(e.entry_id)}async _deleteTask(t,e){if(!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:a("delete",this._lang),message:a("confirm_delete_task",this._lang),confirmText:a("delete",this._lang),danger:!0}))return;await this._runAction({type:"maintenance_supporter/task/delete",entry_id:t,task_id:e})&&this._showObject(t)}async _duplicateTask(t,e){this._moreMenuOpen=!1;let i=await this._runAction({type:"maintenance_supporter/task/duplicate",entry_id:t,task_id:e},{successToast:a("task_duplicated",this._lang)});i?.task_id&&this._showTask(t,i.task_id)}async _moveTask(t,e){this._moreMenuOpen=!1;let i=this._objects.filter(r=>r.entry_id!==t&&!r.object.archived_at).sort((r,p)=>(r.object.name||"").localeCompare(p.object.name||""));if(!i.length)return;let n=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("move_task_title",this._lang),message:a("move_task_message",this._lang),confirmText:a("move_task_title",this._lang),inputLabel:a("move_task_target",this._lang),inputValue:i[0].entry_id,options:i.map(r=>({value:r.entry_id,label:r.object.name||r.entry_id}))});if(!n?.confirmed||!n.value)return;let d=await this._runAction({type:"maintenance_supporter/task/move",entry_id:t,task_id:e,target_entry_id:n.value},{successToast:a("task_moved",this._lang)});d?.entry_id&&d.task_id&&this._showTask(d.entry_id,d.task_id)}async _toggleArchiveTask(t,e,i){await this._runAction({type:i?"maintenance_supporter/task/unarchive":"maintenance_supporter/task/archive",entry_id:t,task_id:e})&&!i&&this._showUndoToast(a("task_archived",this._lang),()=>this._toggleArchiveTask(t,e,!0))}async _toggleArchiveObject(t,e){await this._runAction({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:t})&&!e&&this._showUndoToast(a("object_archived",this._lang),()=>this._toggleArchiveObject(t,!0))}async _togglePauseObject(t,e){if(!e){let s=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("pause_object",this._lang),message:a("pause_until_prompt",this._lang),confirmText:a("pause_object",this._lang),inputLabel:a("pause_until_label",this._lang),inputType:"date"});if(!s?.confirmed)return;let n={type:"maintenance_supporter/object/pause",entry_id:t};s.value&&(n.until=s.value),await this._runAction(n)&&this._showUndoToast(a("object_paused",this._lang),()=>this._togglePauseObject(t,!0));return}await this._runAction({type:"maintenance_supporter/object/resume",entry_id:t},{successToast:a("object_resumed",this._lang)})}async _replaceObject(t,e){let s=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("replace_object",this._lang),message:a("replace_object_prompt",this._lang),confirmText:a("replace_object",this._lang),inputLabel:a("replace_name_label",this._lang),inputType:"text",inputValue:e});if(!s?.confirmed)return;let n=await this._runAction({type:"maintenance_supporter/object/replace",entry_id:t,name:s.value||e},{successToast:a("object_replaced",this._lang)});n?.entry_id&&this._showObject(n.entry_id)}async _skipTask(t,e,i){let s={type:"maintenance_supporter/task/skip",entry_id:t,task_id:e};i&&(s.reason=i),await this._runAction(s)}async _resetTask(t,e,i){let s={type:"maintenance_supporter/task/reset",entry_id:t,task_id:e};i&&(s.date=i),await this._runAction(s)}async _applySuggestion(t,e,i){await this._runAction({type:"maintenance_supporter/task/apply_suggestion",entry_id:t,task_id:e,interval:i})}_openSeasonalOverrides(t){let e=this.shadowRoot.querySelector("maintenance-seasonal-overrides-dialog");if(!e||!this._selectedEntryId)return;let i=t.adaptive_config?.seasonal_overrides;e.open(this._selectedEntryId,t.id,i)}async _reanalyzeInterval(t,e){let i=await this._runAction({type:"maintenance_supporter/task/analyze_interval",entry_id:t,task_id:e});i&&(i.recommended_interval?this._showToast(`${a("reanalyze_result",this._lang)}: ${i.recommended_interval} ${a("days",this._lang)} (${a(`confidence_${i.confidence}`,this._lang)}, ${i.data_points} ${a("data_points",this._lang)})`):this._showToast(a("reanalyze_insufficient_data",this._lang)))}async _promptSkipTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let s=await i.prompt({title:a("skip",this._lang),message:a("skip_reason_prompt",this._lang),confirmText:a("skip",this._lang),inputLabel:a("reason_optional",this._lang),inputType:"text"});s.confirmed&&this._skipTask(t,e,s.value||void 0)}async _promptResetTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let s=await i.prompt({title:a("reset",this._lang),message:a("reset_date_prompt",this._lang),confirmText:a("reset",this._lang),inputLabel:a("reset_date_optional",this._lang),inputType:"date"});s.confirmed&&this._resetTask(t,e,s.value||void 0)}async _postponeTask(t,e,i){await this._runAction({type:"maintenance_supporter/task/postpone",entry_id:t,task_id:e,until:i},{successToast:a("postponed",this._lang)})}async _promptPostponeTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let s=await i.prompt({title:a("postpone",this._lang),message:a("postpone_date_prompt",this._lang),confirmText:a("postpone",this._lang),inputLabel:a("postpone_date_label",this._lang),inputType:"date"});!s.confirmed||!s.value||this._postponeTask(t,e,s.value)}async _snoozeTask(t,e){await this._runAction({type:"maintenance_supporter/task/snooze",entry_id:t,task_id:e},{successToast:a("snoozed",this._lang)})}_dismissSuggestion(t,e){t&&e&&this._dismissedSuggestions.add(`${t}_${e}`),this.requestUpdate()}async _handleQuickComplete(t,e,i){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/quick_complete",entry_id:t,task_id:e}),this._showToast(a("quick_complete_success",this._lang))}catch(s){let n=s?.code||"";n==="no_defaults"||n==="completion_details_required"?this._openCompleteDialog(t,e,i.name,this._features.checklists?i.checklist:void 0,this._features.adaptive&&!!i.adaptive_config?.enabled,{viaTagScan:!0}):this._showToast(D(s,this._lang,a("action_error",this._lang)));return}try{await this._loadData()}catch{}}async _printTaskWorksheet(t,e){let i=this._getObject(t),s=i?.tasks.find(n=>n.id===e);if(!(!i||!s)){this._actionLoading=!0;try{let n={type:"maintenance_supporter/qr/generate",entry_id:t,task_id:e,url_mode:"server"},[d,r]=await Promise.all([this.hass.connection.sendMessagePromise({...n,action:"view"}).catch(()=>null),this.hass.connection.sendMessagePromise({...n,action:"complete"}).catch(()=>null)]),p=null;try{let T=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:t})).documents||[]).find(E=>E.kind==="file"&&E.mime==="application/pdf"&&(E.task_ids||[]).includes(e)&&E.task_pages?.[e]);if(T){let E=T.task_pages[e],C=4,k={path:await Ne(this.hass,`/api/maintenance_supporter/document/${T.id}/excerpt?start=${E}&count=${C}`,3600)};p={title:T.title||T.filename||"Manual",startPage:E,endPage:E+C-1,url:new URL(k.path,window.location.origin).toString(),vendorBase:new URL("/maintenance_supporter_vendor",window.location.origin).toString()}}}catch{}let u=this._lang,_={title:a("worksheet",u),object:a("object",u),type:a("maintenance_type",u),interval:a("interval",u),nextDue:a("next_due",u),lastDone:a("last_performed",u),priority:a("priority",u),checklist:a("checklist",u),notes:a("notes_label",u),scanView:a("worksheet_scan_view",u),scanComplete:a("worksheet_scan_complete",u),manualExcerpt:a("worksheet_manual_excerpt",u),pages:a("worksheet_pages",u),printedOn:a("worksheet_printed",u),never:a("worksheet_never",u),typeLabel:b=>a(b,u),statusLabel:b=>a(b,u),parts:a("consumes_parts_label",u)},v=(s.consumes_parts||[]).map(b=>Ve(b,i.entry_id,this._objects,u)),f=yi(s,i.object.name,_,b=>Q(b,u),b=>St(b,u),d?.svg_data_uri||null,r?.svg_data_uri||null,p,new Date().toISOString(),v,xt(i.object,s));Nt(f)}finally{this._actionLoading=!1}}}_openManualDoc(t){if(t.kind!=="file"){at(t.url)&&window.open(t.url,"_blank","noopener");return}wt(this.hass,t.id).catch(()=>{})}async _setChecklistItem(t,e,i,s){let d=this._getObject(t)?.tasks.find(u=>u.id===e);if(!d)return;let r={},p=ee(d)?.checklist??(d.checklist||[]);for(let u of p){let _=d.checklist_progress?.[u]??!1;r[u]=u===i?s:_}await this._runAction({type:"maintenance_supporter/task/checklist_progress",entry_id:t,task_id:e,checklist_state:r})}_openCompleteDialog(t,e,i,s,n,d){this._ui("maintenance-complete-dialog").then(r=>r&&this._fillAndOpenCompleteDialog(r,t,e,i,s,n,d))}_fillAndOpenCompleteDialog(t,e,i,s,n,d,r){Ke(t,Ye({entryId:e,taskId:i,taskName:s,task:this._getTask(e,i),objects:this._objects,lang:this._lang,checklist:n,checklistsEnabled:this._features.checklists,adaptiveEnabled:d,currencySymbol:this._currencySymbol,viaTagScan:r?.viaTagScan}),this._lang)}_openQrForObject(t,e){this._ui("maintenance-qr-dialog").then(i=>i?.openForObject(t,e))}_openQrForTask(t,e,i,s){this._ui("maintenance-qr-dialog").then(n=>n?.openForTask(t,e,i,s))}render(){return o`
      <div class="panel">
        ${this._staleBundle?o`
              <div class="update-banner" role="status">
                <ha-icon icon="mdi:update"></ha-icon>
                <span>${a("update_banner",this._lang)}</span>
                <ha-button appearance="plain" @click=${()=>location.reload()}>
                  ${a("update_reload",this._lang)}
                </ha-button>
              </div>
            `:h}
        ${this._rowActionNotice&&this.hass?.user?.is_admin?o`
              <div class="update-banner row-actions-banner" role="status">
                <ha-icon icon="mdi:gesture-tap-button"></ha-icon>
                <span>${a("row_actions_banner",this._lang)}</span>
                <ha-button appearance="plain" @click=${()=>this._dismissRowActionNotice(!1)}>
                  ${a("row_actions_keep",this._lang)}
                </ha-button>
                <ha-button appearance="filled" @click=${()=>this._dismissRowActionNotice(!0)}>
                  ${a("row_actions_back",this._lang)}
                </ha-button>
              </div>
            `:h}
        ${this.narrow||this._view!=="overview"?this._renderHeader():h}
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
        ${this._toastUndo?o`<button class="toast-undo" @click=${()=>this._runToastUndo()}>${this._toastActionLabel||a("undo",this._lang)}</button>`:h}
      </div>`:h}
      ${this._renderPalette()}
      ${this._renderTemplateGallery()}
    `}_renderSearchButton(t){let e=this._lang;return o`<ha-icon-button
      class=${t}
      .path=${Cs}
      .label=${a("search_open",e)}
      title=${a("search_open",e)}
      @click=${()=>this._openPalette()}
    ></ha-icon-button>`}_renderHeader(){let t=[{label:a("maintenance",this._lang),action:()=>this._showOverview()}];if(this._view==="object"&&this._selectedEntryId){let e=this._getObject(this._selectedEntryId);t.push({label:e?.object.name||"Object"})}if(this._view==="task"&&this._selectedEntryId&&this._selectedTaskId){let e=this._getObject(this._selectedEntryId);t.push({label:e?.object.name||"Object",action:()=>this._showObject(this._selectedEntryId)});let i=this._getTask(this._selectedEntryId,this._selectedTaskId);t.push({label:i?.name||"Task"})}return o`
      <div class="header">
        ${this.narrow&&!this.embedded?o`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`:h}
        ${this._view!=="overview"?o`<ha-icon-button
              .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
              @click=${()=>{this._view==="task"?this._showObject(this._selectedEntryId):this._showOverview()}}
            ></ha-icon-button>`:h}
        <div class="breadcrumbs">
          ${t.map((e,i)=>o`
              ${i>0?o`<span class="sep">/</span>`:h}
              ${e.action?o`<a @click=${e.action}>${e.label}</a>`:o`<span class="current">${e.label}</span>`}
            `)}
        </div>
        ${this._renderSearchButton("header-search")}
      </div>
    `}_renderOverview(){let t=this._lang,e=!!this.hass?.user?.is_admin,i=this._stats;return!e&&this._overviewTab==="settings"&&(this._overviewTab="dashboard"),o`
      ${i?o`
            <div class="stats-bar">
              <div class="stat-item clickable"
                   @click=${()=>this._showAllObjects()}
                   title=${a("show_all_objects",t)}>
                <span class="stat-value">${i.total_objects}</span>
                <span class="stat-label">${a("objects",t)}</span>
              </div>
              <div class="stat-item clickable"
                   @click=${()=>this._filterByStatus("")}
                   title=${a("show_all_tasks",t)}>
                <span class="stat-value">${i.total_tasks}</span>
                <span class="stat-label">${a("tasks",t)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="overdue"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("overdue")}
                   title=${a("filter_to_overdue",t)}>
                <span class="stat-value" style="color: var(--error-color)">${i.overdue}</span>
                <span class="stat-label">${a("overdue",t)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="due_soon"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("due_soon")}
                   title=${a("filter_to_due_soon",t)}>
                <span class="stat-value" style="color: var(--warning-color)">${i.due_soon}</span>
                <span class="stat-label">${a("due_soon",t)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="triggered"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("triggered")}
                   title=${a("filter_to_triggered",t)}>
                <span class="stat-value" style="color: #ff5722">${i.triggered}</span>
                <span class="stat-label">${a("triggered",t)}</span>
              </div>
              ${this._features.budget?this._renderBudgetTiles():h}
            </div>
          `:h}
      <div class="tab-bar">
        <div class="tab ${this._overviewTab==="today"?"active":""}"
          @click=${()=>this._setOverviewTab("today")}>
          ${a("tab_today",t)}
        </div>
        <div class="tab ${this._overviewTab==="dashboard"?"active":""}"
          @click=${()=>this._setOverviewTab("dashboard")}>
          ${a("dashboard",t)}
        </div>
        <div class="tab ${this._overviewTab==="calendar"?"active":""}"
          @click=${()=>this._setOverviewTab("calendar")}>
          ${a("tab_calendar",t)}
        </div>
        ${e?o`
          <div class="tab ${this._overviewTab==="settings"?"active":""}"
            @click=${()=>this._setOverviewTab("settings")}>
            ${a("settings",t)}
          </div>
        `:h}
        ${this.narrow?h:this._renderSearchButton("tab-search")}
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
    `}_statusBadge(t,e,i){let s=this._lang,n=t?"archived":e?"done":i,d=t?"archived":e?"completed":i,r=t?a("archived",s):e?a("completed",s):a(i,s);return o`<span class="status-badge ${n}" role="img" title="${r}" aria-label="${r}"><ha-icon icon="${Ie[d]||"mdi:circle-medium"}"></ha-icon><span class="status-label">${r}</span></span>`}_setOverviewTab(t){this._overviewTab=t;try{Y(I.overviewTab,t)}catch{}this._scrollContentToTop()}_renderToday(){let t=this._lang,e=this._taskRows,i=p=>`${p.entry_id}:${p.task_id}`,s=e.filter(p=>p.status==="overdue"||p.trigger_active),n=new Set(s.map(i)),d=e.filter(p=>!n.has(i(p))&&p.days_until_due===0);d.forEach(p=>n.add(i(p)));let r=e.filter(p=>!n.has(i(p))&&p.days_until_due!=null&&p.days_until_due>0&&p.days_until_due<=7);return s.length+d.length+r.length===0?o`
        <div class="today-empty">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <p>${a("today_all_caught_up",t)}</p>
        </div>
      `:o`
      <div class="today-view">
        ${this._renderTodaySection("today_overdue",s,"overdue")}
        ${this._renderTodaySection("today_due_today",d,"due_soon")}
        ${this._renderTodaySection("today_this_week",r,"")}
      </div>
    `}_renderTodaySection(t,e,i){if(e.length===0)return h;let s=this._lang,n=d=>this._filterUser||!d.responsible_user_id?null:this._userService?.getPerson(d.responsible_user_id)??null;return o`
      <div class="today-section">
        <div class="today-section-header ${i}">
          <span>${a(t,s)}</span><span class="today-badge">${e.length}</span>
        </div>
        ${e.map(d=>o`
          <div class="today-row" @click=${()=>this._showTask(d.entry_id,d.task_id)}>
            <span class="today-dot ${d.trigger_active?"triggered":d.status}"></span>
            <div class="today-main">
              <div class="today-task">${this._listRef(d.entry_id,d.task_id)}${d.task_name}</div>
              <div class="today-object">
                <span class="today-object-text">${d.object_name} · ${Tt(d.days_until_due,s)}</span>
                ${_e(n(d),"today-person")}
              </div>
            </div>
            ${this._renderRowActions(s,()=>this._openCompleteDialogForRow(d),void 0,!1)}
          </div>
        `)}
      </div>
    `}_renderDashboard(){let t=this._stats,e=this._taskRows,i=this._lang,s=this._isOperator,n=this._objects.reduce((r,p)=>r+p.tasks.filter(u=>u.archived).length,0),d=(this._filterStatus?1:0)+(this._filterUser?1:0)+(this._filterLabel?1:0)+(this._filterPriority?1:0)+(this._activeViewId?1:0);return o`

      ${this.narrow?o`
        <div class="mobile-controls">
          <ha-button
            class="mobile-toggle ${this._filtersOpen?"active":""}"
            @click=${()=>{this._filtersOpen=!this._filtersOpen}}
          >
            <ha-icon icon="mdi:filter-variant"></ha-icon>
            ${a("filter_label",i)}${d>0?` (${d})`:""}
          </ha-button>
          ${s?h:this._renderNewMenu(i)}
        </div>
      `:h}

      <div class="filter-bar ${this.narrow&&!this._filtersOpen?"collapsed":""}">
        <label class="filter-field">
          <span class="filter-label">${a("views_label",i)}</span>
          <select
            .value=${this._activeViewId}
            @change=${r=>this._applyView(r.target.value)}
          >
            <option value="">${a("views_none",i)}</option>
            ${this._savedViews.map(r=>o`<option value=${r.id} ?selected=${this._activeViewId===r.id}>${r.name}</option>`)}
          </select>
        </label>
        ${s?h:o`
          <ha-icon-button
            class="views-save-btn"
            .path=${"M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"}
            .label=${a("views_manage",i)}
            title=${a("views_manage",i)}
            @click=${()=>this._openSavedViewsDialog()}
          ></ha-icon-button>
        `}
        <label class="filter-field">
          <span class="filter-label">${a("filter_label",i)}</span>
          <select
            .value=${this._filterStatus}
            @change=${r=>{this._filterStatus=r.target.value,this._activeViewId=""}}
          >
            <option value="">${a("all",i)}</option>
            <option value="overdue">${a("overdue",i)}</option>
            <option value="due_soon">${a("due_soon",i)}</option>
            <option value="triggered">${a("triggered",i)}</option>
            <option value="ok">${a("ok",i)}</option>
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${a("user_label",i)}</span>
          <select
            .value=${this._filterUser||""}
            @change=${r=>{let p=r.target.value;this._filterUser=p||null,this._activeViewId=""}}
          >
            <option value="">${a("all_users",i)}</option>
            <option value="current_user">${a("my_tasks",i)}</option>
          </select>
        </label>
        ${this._allLabels.length>0?o`
          <label class="filter-field">
            <span class="filter-label">${a("label_filter",i)}</span>
            <select
              .value=${this._filterLabel||""}
              @change=${r=>{let p=r.target.value;this._filterLabel=p||null,this._activeViewId=""}}
            >
              <option value="">${a("all_labels",i)}</option>
              ${this._allLabels.map(r=>o`<option value=${r} ?selected=${this._filterLabel===r}>${r}</option>`)}
            </select>
          </label>
        `:h}
        <label class="filter-field">
          <span class="filter-label">${a("priority",i)}</span>
          <select
            .value=${this._filterPriority}
            @change=${r=>{this._filterPriority=r.target.value,this._activeViewId=""}}
          >
            <option value="">${a("all_priorities",i)}</option>
            ${["high","normal","low"].map(r=>o`<option value=${r} ?selected=${this._filterPriority===r}>${a(`priority_${r}`,i)}</option>`)}
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${a("sort_label",i)}</span>
          <select
            .value=${this._sortMode}
            @change=${r=>{this._sortMode=r.target.value,this._activeViewId="";try{Y(I.taskSort,this._sortMode)}catch{}}}
          >
            <option value="due_date" ?selected=${this._sortMode==="due_date"}>${a("sort_due_date",i)}</option>
            <option value="object" ?selected=${this._sortMode==="object"}>${a("sort_object",i)}</option>
            <option value="type" ?selected=${this._sortMode==="type"}>${a("sort_type",i)}</option>
            <option value="task_name" ?selected=${this._sortMode==="task_name"}>${a("sort_task_name",i)}</option>
            <option value="area" ?selected=${this._sortMode==="area"}>${a("sort_area",i)}</option>
            <option value="assigned_user" ?selected=${this._sortMode==="assigned_user"}>${a("sort_assigned_user",i)}</option>
            <option value="group" ?selected=${this._sortMode==="group"}>${a("sort_group",i)}</option>
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${a("group_by_label",i)}</span>
          <select
            .value=${this._groupByMode}
            @change=${r=>{this._groupByMode=r.target.value,this._activeViewId="";try{Y(I.groupBy,this._groupByMode)}catch{}}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${a("groupby_none",i)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${a("groupby_area",i)}</option>
            ${this._features.groups?o`<option value="group" ?selected=${this._groupByMode==="group"}>${a("groupby_group",i)}</option>`:h}
            <option value="user" ?selected=${this._groupByMode==="user"}>${a("groupby_user",i)}</option>
            <option value="object" ?selected=${this._groupByMode==="object"}>${a("groupby_object",i)}</option>
          </select>
        </label>
        ${n>0?o`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived,this._activeViewId=""}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?a("hide_archived",i):`${a("show_archived",i)} (${n})`}
          </ha-button>
        `:h}
        ${!s&&e.length>0?o`
          <ha-button
            class="bulk-toggle ${this._bulkMode?"active":""}"
            @click=${()=>this._toggleBulkMode()}
          >
            <ha-icon icon="mdi:checkbox-multiple-marked-outline"></ha-icon>
            ${this._bulkMode?a("cancel",i):a("bulk_select",i)}
          </ha-button>
        `:h}
        ${!s&&!this.narrow?this._renderNewMenu(i):h}
      </div>

      ${s?h:this._renderGettingStartedChips(i)}

      ${e.length===0?o`
            <div class="empty-state">
              <ha-svg-icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></ha-svg-icon>
              <p>${a("no_tasks",i)}</p>
              ${!s&&this._objects.length===0?o`
                <p class="empty-onboard-hint">${a("onboard_hint",i)}</p>
                <div class="empty-onboard-actions">
                  <ha-button appearance="filled" @click=${()=>this._openTemplateGallery()}>
                    <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon> ${a("templates_from",i)}
                  </ha-button>
                  <ha-button appearance="plain" @click=${()=>this._ui("maintenance-object-dialog").then(r=>r?.openCreate())}>
                    ${a("new_object",i)}
                  </ha-button>
                </div>
              `:h}
            </div>
          `:o`
            ${this._bulkMode?this._renderBulkBar(e,i):h}
            ${this._splitActive()?o`
                  <div class="split-layout">
                    <div class="split-list">
                      ${this._groupByMode==="none"?this._renderTaskTable(e):this._renderGroupedTasks(e,i)}
                    </div>
                    <div class="split-pane">
                      ${this._selectedEntryId&&this._selectedTaskId&&this._getTask(this._selectedEntryId,this._selectedTaskId)?this._renderTaskDetail():o`<div class="split-pane-empty"><ha-icon icon="mdi:cursor-default-click-outline"></ha-icon><p>${a("split_select_hint",i)}</p></div>`}
                    </div>
                  </div>
                `:this._groupByMode==="none"?this._renderTaskTable(e):this._renderGroupedTasks(e,i)}
          `}

      ${this._features.groups&&!s?this._renderGroupsSection():h}
      ${s?h:o`<maintenance-storage-section-card
            .hass=${this.hass}
            .objects=${this._objects}
            @open-object=${r=>{let p=r.detail?.entry_id;p&&this._showObject(p)}}
          ></maintenance-storage-section-card>`}
    `}_renderTaskTable(t){let e=this._bulkMode?" bulk":"";if(this._virtTotalRows=t.length,this.narrow||t.length<120)return o`
        <div class="task-table${e}">
          ${t.map(u=>this._renderOverviewRow(u))}
        </div>
      `;let i=t.length,s=this._virtRowHeight,n=Math.max(0,Math.min(this._virtStart,i)),d=this._virtEnd>0?Math.min(this._virtEnd,i):Math.min(i,40);d<n&&(n=0,d=Math.min(i,40));let r=n*s,p=(i-d)*s;return o`
      <div class="task-table${e} virtual">
        ${this._renderVirtSizerRow(t)}
        ${r>0?o`<div class="virt-spacer" style="height:${r}px"></div>`:h}
        ${t.slice(n,d).map(u=>this._renderOverviewRow(u))}
        ${p>0?o`<div class="virt-spacer" style="height:${p}px"></div>`:h}
      </div>
    `}_renderVirtSizerRow(t){let e=this._lang,i="",s=!1,n=!1,d=!1;for(let r of t){let p=r.archived?a("archived",e):r.is_done?a("completed",e):a(r.status,e);p.length>i.length&&(i=p),r.enabled||(s=!0),r.nfc_tag_id&&(n=!0),(r.priority==="high"||r.priority==="low")&&(d=!0)}return o`
      <div class="task-row virt-sizer" aria-hidden="true">
        ${this._bulkMode?o`<span></span>`:h}
        <span class="cell-badges">
          <span class="status-badge"><ha-icon icon="mdi:circle-medium"></ha-icon><span class="status-label">${i}</span></span>
          ${s?o`<span class="badge-disabled">${a("disabled",e)}</span>`:h}
          ${n?o`<span class="nfc-badge"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:h}
          ${d?o`<span class="priority-badge"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>`:h}
        </span>
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
    `}_renderBulkBar(t,e){let i=this._bulkSelected.size,s=t.length>0&&t.every(n=>this._bulkSelected.has(this._bulkKey(n)));return o`
      <div class="bulk-bar">
        <label class="bulk-selectall">
          <input type="checkbox" .checked=${s} @change=${()=>this._bulkSelectAll(t)} />
          ${a("bulk_select_all",e)}
        </label>
        <span class="bulk-count">${a("bulk_n_selected",e).replace("{n}",String(i))}</span>
        <span class="bulk-actions">
          <ha-button appearance="filled" .disabled=${i===0||this._actionLoading}
            @click=${()=>this._bulkComplete(t)}>
            <ha-icon icon="mdi:check"></ha-icon> ${a("complete",e)}
          </ha-button>
          <ha-button appearance="plain" .disabled=${i===0||this._actionLoading}
            @click=${()=>this._bulkArchive(t)}>
            <ha-icon icon="mdi:archive-outline"></ha-icon> ${a("archive",e)}
          </ha-button>
        </span>
      </div>
    `}_renderGroupedTasks(t,e){let i=new Map,s=a("unassigned",e);for(let r of t){let p=[];this._groupByMode==="area"?p=[(r.area_id?this.hass?.areas?.[r.area_id]?.name:null)||s]:this._groupByMode==="user"?p=[(r.responsible_user_id?this._userService?.getUserName(r.responsible_user_id):null)||s]:this._groupByMode==="group"?p=r.group_names.length>0?r.group_names:[s]:this._groupByMode==="object"&&(p=[r.object_name]);for(let u of p)i.has(u)||i.set(u,[]),i.get(u).push(r)}let n=[...i.entries()].sort(([r],[p])=>r===s&&p!==s?1:p===s&&r!==s?-1:r.localeCompare(p)),d=this._groupByMode==="area"?"mdi:map-marker-outline":this._groupByMode==="group"?"mdi:folder-outline":this._groupByMode==="object"?"mdi:cube-outline":"mdi:account-outline";return o`
      <div class="task-table grouped${this._bulkMode?" bulk":""}">
        ${n.map(([r,p])=>{let u=!this._collapsedGroups.has(r);return o`
            <div class="group-section" ?open=${u}>
              <div
                class="group-section-header"
                role="button"
                tabindex="0"
                aria-expanded=${u?"true":"false"}
                @click=${()=>this._toggleGroup(r)}
                @keydown=${_=>{(_.key==="Enter"||_.key===" ")&&(_.preventDefault(),this._toggleGroup(r))}}
              >
                <ha-icon icon="${d}"></ha-icon>
                <span>${r}</span>
                <span class="group-section-count">(${p.length})</span>
              </div>
              ${u?o`<div class="group-rows">${p.map(_=>this._renderOverviewRow(_))}</div>`:h}
            </div>
          `})}
      </div>
    `}_toggleGroup(t){let e=new Set(this._collapsedGroups);e.has(t)?e.delete(t):e.add(t),this._collapsedGroups=e}_warrantyLabel(t,e,i){return t.kind==="expired"?a("warranty_expired",i):t.kind==="expiring"?a("warranty_expires_in",i).replace("{days}",String(t.days??0)):a("warranty_valid_until",i).replace("{date}",Q(e,i))}_renderWarrantyMeta(t,e){let i=we(t);return o`<p class="meta">${a("warranty",e)}:
      <span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,t,e)}</span></p>`}_renderAllObjects(){let t=this._lang,e=this._isOperator,i=this._objectViewMode==="table"&&!this.narrow,s=this._objects.filter(u=>u.object.archived).length,n=u=>{let _=1/0;for(let v of u.tasks){let f=v.days_until_due;f!=null&&f<_&&(_=f)}return _},d=this._objects.filter(u=>this._showArchived||!u.object.archived);this._objectSortMode==="alphabetical"?d.sort((u,_)=>u.object.name.localeCompare(_.object.name)):this._objectSortMode==="task_count"?d.sort((u,_)=>_.tasks.length-u.tasks.length||u.object.name.localeCompare(_.object.name)):d.sort((u,_)=>n(u)-n(_)||u.object.name.localeCompare(_.object.name));let r=()=>{let u=new Map;for(let _ of d){let v=_.object.area_id,f=v?this.hass?.areas?.[v]?.name||a("unassigned",t):a("no_area",t);u.has(f)||u.set(f,[]),u.get(f).push(_)}return new Map([...u.entries()].sort(([_],[v])=>_.localeCompare(v)))},p=u=>{let _=u.tasks.some(v=>v.status==="overdue"||v.status==="triggered");return o`
        <div class="object-card${_?" object-card-overdue":""}" @click=${()=>this._showObject(u.entry_id)}>
          ${_?o`<span class="overdue-dot" title="${a("has_overdue",t)}"></span>`:h}
          <div class="object-card-header">
            <span class="object-card-name">${this._objRef(u.object)}${u.object.name}</span>
            ${u.object.paused?o`<span class="paused-badge" title="${a("object_paused_badge",t)}${u.object.paused_until?` \u2014 ${u.object.paused_until}`:""}">
                  <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
                </span>`:h}
            ${u.object.document_count?o`<span class="doc-badge" title="${u.object.document_count} ${a("documents",t)}">
                  <ha-icon icon="mdi:paperclip"></ha-icon>${u.object.document_count}
                </span>`:h}
            <span class="object-card-count">${u.tasks.length} ${a("tasks_lower",t)}</span>
          </div>
          ${u.object.manufacturer||u.object.model?o`<div class="object-card-meta">${[u.object.manufacturer,u.object.model].filter(Boolean).join(" ")}</div>`:h}
          ${u.tasks.length===0?o`<div class="object-card-empty">${a("no_tasks_yet",t)}</div>`:h}
        </div>
      `};return o`
      <div class="breadcrumb">
        <ha-icon-button @click=${()=>this._showOverview()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${a("all_objects",t)}</span>
        <button class="sibling-view-chip" @click=${()=>this._showAllParts()}>
          <ha-icon icon="mdi:package-variant-closed"></ha-icon> ${a("all_parts",t)}
        </button>
      </div>
      <div class="filter-bar">
        <label class="filter-field">
          <span class="filter-label">${a("sort_label",t)}</span>
          <select
            .value=${this._objectSortMode}
            @change=${u=>{this._objectSortMode=u.target.value;try{Y(I.objectSort,this._objectSortMode)}catch{}}}
          >
            <option value="alphabetical" ?selected=${this._objectSortMode==="alphabetical"}>${a("sort_alphabetical",t)}</option>
            <option value="due_soonest" ?selected=${this._objectSortMode==="due_soonest"}>${a("sort_due_soonest",t)}</option>
            <option value="task_count" ?selected=${this._objectSortMode==="task_count"}>${a("sort_task_count",t)}</option>
          </select>
        </label>
        ${this.narrow?h:o`
          <div class="view-toggle" role="group" aria-label="${a("view_mode_label",t)}">
            <button
              class="view-toggle-btn${i?"":" active"}"
              title="${a("view_cards",t)}"
              @click=${()=>this._setObjectViewMode("cards")}
            ><ha-icon icon="mdi:view-grid-outline"></ha-icon></button>
            <button
              class="view-toggle-btn${i?" active":""}"
              title="${a("view_table",t)}"
              @click=${()=>this._setObjectViewMode("table")}
            ><ha-icon icon="mdi:table"></ha-icon></button>
          </div>
        `}
        ${i?h:o`
        <label class="filter-field">
          <span class="filter-label">${a("group_by_label",t)}</span>
          <select
            .value=${this._groupByMode}
            @change=${u=>{this._groupByMode=u.target.value;try{Y(I.groupBy,this._groupByMode)}catch{}}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${a("groupby_none",t)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${a("groupby_area",t)}</option>
          </select>
        </label>
        `}
        ${e?h:o`
          <ha-button
            @click=${()=>this._ui("maintenance-object-dialog").then(u=>u?.openCreate())}
          >
            ${a("new_object",t)}
          </ha-button>
        `}
        <ha-button appearance="plain" @click=${()=>this._exportObjectsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${a("settings_export_csv",t)}
        </ha-button>
        ${s>0?o`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?a("hide_archived",t):`${a("show_archived",t)} (${s})`}
          </ha-button>
        `:h}
      </div>
      ${i?this._renderObjectsTable(d):this._groupByMode==="area"?o`
          ${[...r().entries()].map(([u,_])=>o`
            <details class="group-section" open>
              <summary class="group-section-header">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <span>${u}</span>
                <span class="group-section-count">(${_.length})</span>
              </summary>
              <div class="objects-grid">${_.map(p)}</div>
            </details>
          `)}
        `:o`<div class="objects-grid">${d.map(p)}</div>`}
    `}_setObjectViewMode(t){this._objectViewMode=t;try{Y(I.objectView,t)}catch{}}_renderAllParts(){let t=this._lang,e=this._allParts,i=this._currencySymbol;return o`
      <div class="breadcrumb">
        <ha-icon-button @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${a("all_parts",t)}</span>
        <button class="sibling-view-chip" @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:devices"></ha-icon> ${a("all_objects",t)}
        </button>
      </div>
      <div class="filter-bar">
        <ha-button appearance="plain" @click=${()=>this._exportPartsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${a("settings_export_csv",t)}
        </ha-button>
      </div>
      ${e===null?o`<div class="empty-state">…</div>`:e.length===0?o`<div class="empty-state">${a("parts_section",t)}: 0</div>`:o`
          <div class="objects-table-wrap">
            <table class="objects-table">
              <thead>
                <tr>
                  <th>${a("part_name",t)}</th>
                  <th>${a("object",t)}</th>
                  <th>${a("part_stock",t)}</th>
                  <th>${a("part_reorder_threshold",t)}</th>
                  <th>${a("part_cost",t)}</th>
                  <th>${a("part_storage_location",t)}</th>
                  <th>${a("parts_used_by",t)}</th>
                </tr>
              </thead>
              <tbody>
                ${e.map(s=>o`
                  <tr class="objects-table-row" @click=${()=>this._showObject(s.entry_id)}>
                    <td>
                      <span class="objects-table-name">${this._objRef(this._getObject(s.entry_id)?.object)}${s.name}</span>
                      ${s.low?o`<ha-icon class="part-low-icon" icon="mdi:cart-arrow-down"
                            title="${a("part_reorder_threshold",t)}: ${s.reorder_threshold}"></ha-icon>`:h}
                    </td>
                    <td>${s.object_name||"\u2014"}</td>
                    <td>${s.stock!==null?`${s.stock}${s.unit?` ${s.unit}`:""}`:"\u2014"}</td>
                    <td>${s.reorder_threshold??"\u2014"}</td>
                    <td>${s.cost!=null?K(s.cost,i,t):"\u2014"}</td>
                    <td>${s.storage_location||"\u2014"}</td>
                    <td>
                      ${s.consumers.length===0?"\u2014":s.consumers.map(n=>o`
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
    `}_exportPartsCsv(){let t=this._allParts||[],e=d=>{let r=d==null?"":String(d);return/[",\n;]/.test(r)?`"${r.replace(/"/g,'""')}"`:r},s=[["name","object","stock","unit","reorder_threshold","unit_cost","storage_location","vendor","used_by"].join(",")];for(let d of t)s.push([e(d.name),e(d.object_name),e(d.stock),e(d.unit),e(d.reorder_threshold),e(d.cost),e(d.storage_location),e(d.vendor),e(d.consumers.map(r=>`${r.object_name??""}/${r.task_name??r.task_id}\xD7${r.quantity}`).join(" | "))].join(","));let n=Ft(new Date);me(s.join(`
`),`maintenance_parts_${n}.csv`,"text/csv;charset=utf-8")}async _exportObjectsCsv(){let t=await fe(this,{type:"maintenance_supporter/objects/csv"},{onError:i=>this._showToast(i)});if(!t)return;let e=Ft(new Date);me(t.csv,`maintenance_objects_${e}.csv`,"text/csv;charset=utf-8")}_renderObjectsTable(t){let e=this._lang,i=this._objectsTableColumns;return o`
      <div class="objects-table-wrap">
        <table class="objects-table">
          <thead>
            <tr>
              ${i.map(s=>{let n=Be.find(r=>r.key===s),d=n&&n.key!=="actions"?a(n.labelKey,e):"";return o`<th class="oc-${s}">${d}</th>`})}
            </tr>
          </thead>
          <tbody>
            ${t.map(s=>o`
              <tr class="objects-table-row" @click=${()=>this._showObject(s.entry_id)}>
                ${i.map(n=>this._renderObjectCell(n,s,e))}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `}_renderObjectCell(t,e,i){let s=e.object;switch(t){case"name":return o`<td class="oc-name">
          <span class="objects-table-name">${this._objRef(s)}${s.name}</span>
          ${s.document_count?o`<span class="doc-badge" title="${s.document_count} ${a("documents",i)}">
                <ha-icon icon="mdi:paperclip"></ha-icon>${s.document_count}
              </span>`:h}
        </td>`;case"manufacturer":return o`<td class="oc-manufacturer">${s.manufacturer||"\u2014"}</td>`;case"model":return o`<td class="oc-model">${s.model||"\u2014"}</td>`;case"serial_number":return o`<td class="oc-serial_number">${s.serial_number||"\u2014"}</td>`;case"installation_date":return o`<td class="oc-installation_date">${s.installation_date?Q(s.installation_date,i):"\u2014"}</td>`;case"warranty_expiry":return o`<td class="oc-warranty_expiry">${this._renderWarrantyCell(s.warranty_expiry,i)}</td>`;case"area_id":{let n=s.area_id?this.hass?.areas?.[s.area_id]?.name||s.area_id:"\u2014";return o`<td class="oc-area_id">${n}</td>`}case"documentation_url":{let n=(s.manual_docs||[])[0];return o`<td class="oc-documentation_url">${at(s.documentation_url)?o`<a href=${s.documentation_url} target="_blank" rel="noopener noreferrer"
                @click=${d=>d.stopPropagation()}><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:n?o`<a href="#" title=${n.title}
                  @click=${d=>{d.preventDefault(),d.stopPropagation(),this._openManualDoc(n)}}
                  ><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:"\u2014"}</td>`}case"notes":return o`<td class="oc-notes" title=${s.notes||""}>${s.notes||"\u2014"}</td>`;case"task_count":return o`<td class="oc-task_count">${e.tasks.length}</td>`;case"ref_no":return o`<td class="oc-ref_no">${yt(s)?`#${yt(s)}`:"\u2014"}</td>`;case"actions":return o`<td class="oc-actions">
          <mwc-icon-button title="${a("qr_code",i)}" @click=${n=>{n.stopPropagation(),this._openQrForObject(e.entry_id,s.name)}}>
            <ha-icon icon="mdi:qrcode"></ha-icon>
          </mwc-icon-button>
        </td>`;default:return o`<td></td>`}}_renderWarrantyCell(t,e){let i=we(t);return i.kind==="none"?o`<span class="warranty-none">—</span>`:o`<span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,t,e)}</span>`}async _onSettingsChanged(){await this._loadData()}_renderGroupsSection(){if(!this._features.groups)return h;let t=Object.entries(this._groups),e=this._lang;return o`
      <div class="groups-section">
        <div class="groups-header">
          <h3>${a("groups",e)}</h3>
          <ha-button appearance="plain" @click=${()=>this._openGroupCreate()}>
            ${a("new_group",e)}
          </ha-button>
        </div>
        ${t.length===0?o`<div class="hint">${a("no_groups",e)}</div>`:o`
            <div class="groups-grid">
              ${t.map(([i,s])=>{let n=s.task_refs.map(d=>this._getTask(d.entry_id,d.task_id)?.name).filter(Boolean);return o`
                  <div class="group-card">
                    <div class="group-card-head">
                      <div class="group-card-name">${s.name}</div>
                      <div class="group-card-actions">
                        <mwc-icon-button title="${a("edit",e)}" @click=${()=>this._openGroupEdit(i)}>
                          <ha-svg-icon path="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"></ha-svg-icon>
                        </mwc-icon-button>
                        <mwc-icon-button title="${a("delete",e)}" @click=${()=>this._deleteGroup(i,s.name)}>
                          <ha-svg-icon path="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z"></ha-svg-icon>
                        </mwc-icon-button>
                      </div>
                    </div>
                    ${s.description?o`<div class="group-card-desc">${s.description}</div>`:h}
                    <div class="group-card-tasks">
                      ${n.length>0?n.map(d=>o`<span class="group-task-chip">${d}</span>`):o`<span style="font-size:12px;color:var(--secondary-text-color)">${a("no_tasks_short",e)}</span>`}
                    </div>
                  </div>
                `})}
            </div>
          `}
      </div>
    `}_openGroupCreate(){this.shadowRoot.querySelector("maintenance-group-dialog")?.openCreate()}_openGroupEdit(t){let e=this._groups[t];e&&this.shadowRoot.querySelector("maintenance-group-dialog")?.openEdit(t,e)}async _deleteGroup(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");(i?await i.confirm({title:a("delete_group",this._lang),message:a("delete_group_confirm",this._lang).replace("{name}",e),confirmText:a("delete",this._lang)}):confirm(`${a("delete_group_confirm",this._lang).replace("{name}",e)}`))&&await this._runAction({type:"maintenance_supporter/group/delete",group_id:t})}_renderBudgetTiles(){let t=this._budget;if(!t)return h;let e=this._lang,i=this._currencySymbol,s=(n,d,r)=>{if(r!==null){let p=Math.min(100,Math.max(0,d/r*100)),u=p>=100?"var(--error-color, #f44336)":p>=t.alert_threshold_pct?"var(--warning-color, #ff9800)":"var(--success-color, #4caf50)";return o`
          <div class="stat-item budget-tile" title="${n}: ${K(d,i,e)} / ${K(r,i,e)}">
            <span class="stat-value budget-tile-value">${K(d,i,e)}</span>
            <span class="budget-tile-max">/ ${K(r,i,e)}</span>
            <div class="budget-tile-bar"><div style="width:${p}%; background:${u}"></div></div>
            <span class="stat-label">${n}</span>
          </div>
        `}return o`
        <div class="stat-item budget-tile" title="${n}: ${K(d,i,e)}">
          <span class="stat-value budget-tile-value">${K(d,i,e)}</span>
          <span class="stat-label">${n}</span>
        </div>
      `};return o`
      ${s(a("budget_monthly",e),t.monthly_spent||0,t.monthly_budget>0?t.monthly_budget:null)}
      ${s(a("budget_yearly",e),t.yearly_spent||0,t.yearly_budget>0?t.yearly_budget:null)}
    `}_renderOverviewRow(t){let e=this._lang,i=t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0,s=0,n=Yt.ok,d=!1;if(i&&t.days_until_due!==null){let v=Zt(t.interval_days,t.days_until_due,t.interval_unit);s=v.pct,d=v.overflow,t.status==="overdue"?n=Yt.overdue:t.status==="due_soon"&&(n=Yt.due_soon)}let r=t.area_id?this.hass?.areas?.[t.area_id]?.name:null,p=t.responsible_user_id?this._userService?.getUserName(t.responsible_user_id):null,u=t.group_names.length>0||r||p,_=this._bulkMode&&this._bulkSelected.has(this._bulkKey(t));return o`
      <div class="task-row${t.enabled?"":" task-disabled"}${_?" bulk-selected":""}${this._splitActive()&&t.entry_id===this._selectedEntryId&&t.task_id===this._selectedTaskId?" selected":""}">
        ${this._bulkMode?o`
          <label class="cell bulk-check" @click=${v=>v.stopPropagation()}>
            <input type="checkbox" .checked=${_} @change=${()=>this._toggleBulkRow(t)} />
          </label>
        `:h}
        <span class="cell-badges">
          ${this._statusBadge(!!t.archived,t.is_done,t.status)}
          ${t.enabled?h:o`<span class="badge-disabled">${a("disabled",e)}</span>`}
          ${t.nfc_tag_id?o`<span class="nfc-badge" title="${a("nfc_linked",e)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:h}
          ${t.priority==="high"?o`<span class="priority-badge priority-high" title="${a("priority_high",e)}"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>`:h}
          ${t.priority==="low"?o`<span class="priority-badge priority-low" title="${a("priority_low",e)}"><ha-icon icon="mdi:chevron-double-down"></ha-icon></span>`:h}
        </span>
        <span class="row-head">
          <span class="cell object-name" @click=${v=>{v.stopPropagation(),this._showObject(t.entry_id)}}>${t.object_name}</span>
          <span class="cell task-name" @click=${()=>this._showTask(t.entry_id,t.task_id)}>${this._listRef(t.entry_id,t.task_id)}${t.task_name}</span>
        </span>
        <span class="task-sub${u?"":" task-sub-empty"}">
          ${t.group_names.length>0?o`
            <span class="sub-chip" title="${a("groups",e)}">
              <ha-icon icon="mdi:folder-outline"></ha-icon>${t.group_names.join(", ")}
            </span>`:h}
          ${r?o`
            <span class="sub-chip">
              <ha-icon icon="mdi:map-marker-outline"></ha-icon>${r}
            </span>`:h}
          ${p?_e(this._userService?.getPerson(t.responsible_user_id)??null,"sub-chip"):h}
          ${(t.labels||[]).map(v=>o`
            <span class="sub-chip label-chip" title="${a("labels",e)}">
              <ha-icon icon="mdi:tag-outline"></ha-icon>${v}
            </span>`)}
        </span>
        <span class="cell type">${a(t.type,e)}</span>
        <span class="due-cell" @click=${()=>this._showTask(t.entry_id,t.task_id)}>
          <span class="due-text">${Tt(t.days_until_due,e)}</span>
          ${i?o`<div class="days-bar"><div class="days-bar-fill${d?" overflow":""}" style="width:${s}%;background:${n}"></div></div>`:h}
          ${t.trigger_config?Ee(t,{trend:Se(t,this._miniStatsData),lang:e}):!i&&t.trigger_active?o`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:h}
          ${Re(t,this._miniStatsData,this._lang)}
        </span>
        ${this._renderRowActions(e,()=>this._openCompleteDialogForRow(t),()=>this._promptSkipTask(t.entry_id,t.task_id),t.allow_skip)}
      </div>
    `}_actionStyle(){return this._rowActionStyle}async _dismissRowActionNotice(t){let e={row_action_notice_pending:!1};t&&(e.row_action_style="icons"),await fe(this,{type:"maintenance_supporter/global/update",settings:e},{onError:s=>this._showToast(s)})!==void 0&&(this._rowActionNotice=!1,t&&(this._rowActionStyle="icons"),gi())}_renderRowActions(t,e,i,s=!0){let n=this._actionStyle();return n==="buttons"||n==="buttons_compact"?n==="buttons_compact"&&(this.narrow||this.tight)?o`
          <span class="row-actions as-buttons compact">
            <ha-button size="small" appearance="accent" variant="success" title="${a("complete",t)}" aria-label="${a("complete",t)}" @click=${r=>{r.stopPropagation(),e()}}>
              <ha-icon icon="mdi:check"></ha-icon>
            </ha-button>
            ${s?o`
              <ha-button size="small" appearance="outlined" variant="warning" title="${a("skip",t)}" aria-label="${a("skip",t)}" ?disabled=${this._actionLoading} @click=${r=>{r.stopPropagation(),i?.()}}>
                <ha-icon icon="mdi:skip-next"></ha-icon>
              </ha-button>`:h}
          </span>`:o`
        <span class="row-actions as-buttons">
          <ha-button size="small" appearance="accent" variant="success" title="${a("complete",t)}" @click=${r=>{r.stopPropagation(),e()}}>
            <ha-icon slot="start" icon="mdi:check"></ha-icon>${a("complete",t)}
          </ha-button>
          ${s?o`
            <ha-button size="small" appearance="outlined" variant="warning" title="${a("skip",t)}" ?disabled=${this._actionLoading} @click=${r=>{r.stopPropagation(),i?.()}}>
              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>${a("skip",t)}
            </ha-button>`:h}
        </span>`:o`
      <span class="row-actions">
        <mwc-icon-button class="btn-complete" title="${a("complete",t)}" @click=${d=>{d.stopPropagation(),e()}}>
          <ha-icon icon="mdi:check"></ha-icon>
        </mwc-icon-button>
        ${s?o`
          <mwc-icon-button class="btn-skip" title="${a("skip",t)}" .disabled=${this._actionLoading} @click=${d=>{d.stopPropagation(),i?.()}}>
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </mwc-icon-button>`:h}
      </span>`}_openCompleteDialogForRow(t){let i=this._objects.find(s=>s.entry_id===t.entry_id)?.tasks.find(s=>s.id===t.task_id);this._openCompleteDialog(t.entry_id,t.task_id,t.task_name,this._features.checklists?i?.checklist:void 0,this._features.adaptive&&!!i?.adaptive_config?.enabled)}_renderObjectDetail(){if(!this._selectedEntryId)return h;let t=this._getObject(this._selectedEntryId);if(!t)return o`<p>Object not found.</p>`;let e=t.object,i=this._lang,s=this._isOperator,n=t.tasks.filter(r=>r.archived).length,d=t.tasks.filter(r=>this._showArchived||!r.archived);return o`
      <div class="detail-section">
        <div class="detail-header">
          <h2>${e.name} ${Dt(yt(e),a("ref_number",i))}</h2>
          <div class="action-buttons">
            ${s?h:o`
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(r=>r?.openCreate(t.entry_id))}}>${a("add_task",i)}</ha-button>
              <ha-button appearance="plain" @click=${()=>{this._ui("maintenance-object-dialog").then(r=>r?.openEdit(t.entry_id,e))}}>${a("edit",i)}</ha-button>
            `}
            <div class="more-menu-wrapper">
              <ha-icon-button .disabled=${this._actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${()=>this._toggleObjMenu()}></ha-icon-button>
              ${this._objMenuOpen?o`
                <div class="popup-menu" @click=${r=>r.stopPropagation()}>
                  <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._openQrForObject(t.entry_id,e.name)}}>${a("qr_code",i)}</div>
                  <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._printObjectReport(t.entry_id)}}>${a("report_button",i)}</div>
                  ${s?h:o`
                    <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._duplicateObject(t.entry_id)}}>${a("duplicate",i)}</div>
                    ${e.archived?h:o`
                      <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._togglePauseObject(t.entry_id,!!e.paused)}}>${e.paused?a("resume_object",i):a("pause_object",i)}</div>
                      <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._replaceObject(t.entry_id,e.name)}}>${a("replace_object",i)}</div>
                    `}
                    <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._toggleArchiveObject(t.entry_id,!!e.archived)}}>${e.archived?a("unarchive_object",i):a("archive_object",i)}</div>
                    <div class="popup-menu-divider"></div>
                    <div class="popup-menu-item danger" @click=${()=>{this._closeObjMenu(),this._deleteObject(t.entry_id)}}>${a("delete",i)}</div>
                  `}
                </div>
              `:h}
            </div>
          </div>
        </div>
        ${e.paused?o`<p class="meta paused-meta">
              <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
              ${a("object_paused_badge",i)}${e.paused_until?o` — ${a("paused_until_label",i)} ${Q(e.paused_until,i)}`:h}
            </p>`:h}
        ${e.manufacturer||e.model?o`<p class="meta">${[e.manufacturer,e.model].filter(Boolean).join(" ")}</p>`:h}
        ${e.serial_number?o`<p class="meta">${a("serial_number_label",i)}: ${e.serial_number}</p>`:h}
        ${at(e.documentation_url)?o`<p class="meta">${a("documentation_url_label",i)}:
              <a href=${e.documentation_url} target="_blank" rel="noopener noreferrer">${e.documentation_url}</a>
            </p>`:(e.manual_docs||[]).length?o`<p class="meta">${a("documentation_url_label",i)}:
                ${e.manual_docs.slice(0,3).map((r,p)=>o`${p>0?" \xB7 ":""}<a href="#"
                    @click=${u=>{u.preventDefault(),this._openManualDoc(r)}}>${r.title}</a>`)}${e.manual_docs.length>3?o` … +${e.manual_docs.length-3}`:h}
              </p>`:h}
        ${e.installation_date?o`<p class="meta">${a("installed",i)}: ${Q(e.installation_date,i)}</p>`:h}
        ${e.warranty_expiry?this._renderWarrantyMeta(e.warranty_expiry,i):h}
        ${e.notes?o`<div class="object-notes">
              <div class="object-notes-label">${a("object_notes_label",i)}</div>
              <div class="object-notes-body">${te(e.notes)}</div>
            </div>`:h}

        <h3>${a("tasks",i)} (${d.length})${n>0?o`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            appearance="plain"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?a("hide_archived",i):`${a("show_archived",i)} (${n})`}
          </ha-button>`:h}</h3>
        ${t.tasks.length===0?o`<div class="empty-state-centered">
              <p class="empty">${a("no_tasks_yet",i)}</p>
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(r=>r?.openCreate(t.entry_id))}}>${a("add_first_task",i)}</ha-button>
            </div>`:o`<div class="task-table object-tasks">${[...d].sort((r,p)=>{let u={overdue:0,triggered:1,due_soon:2,ok:3};return(u[r.status]??9)-(u[p.status]??9)||(r.days_until_due??99999)-(p.days_until_due??99999)}).map(r=>o`
              <div class="task-row${r.enabled?"":" task-disabled"}">
                <span class="cell-badges">
                  ${this._statusBadge(!!r.archived,!!r.is_done,r.status)}
                  ${r.enabled?h:o`<span class="badge-disabled">${a("disabled",i)}</span>`}
                  ${r.nfc_tag_id?o`<span class="nfc-badge" title="${a("nfc_linked",i)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:h}
                  ${r.document_count?o`<span class="doc-badge" title="${r.document_count} ${a("documents",i)}"><ha-icon icon="mdi:paperclip"></ha-icon>${r.document_count}</span>`:h}
                </span>
                <span class="cell task-name" @click=${()=>this._showTask(t.entry_id,r.id)}>${this._listRef(t.entry_id,r.id)}${r.name}</span>
                <span class="task-sub${r.responsible_user_id?"":" task-sub-empty"}">${Me(r,p=>this._userService?.getUserName(p)??null,p=>this._userService?.getPerson(p)??null)}</span>
                <span class="cell type">${a(r.type,i)}</span>
                <span class="due-cell" @click=${()=>this._showTask(t.entry_id,r.id)}>
                  <span class="due-text">${Tt(r.days_until_due,i)}</span>
                  ${r.trigger_config?Ee(r,{trend:Se(r,this._miniStatsData),lang:i}):h}
                  ${Re(r,this._miniStatsData,this._lang)}
                </span>
                ${this._renderRowActions(i,()=>this._openCompleteDialog(t.entry_id,r.id,r.name,this._features.checklists?r.checklist:void 0,this._features.adaptive&&!!r.adaptive_config?.enabled),()=>this._promptSkipTask(t.entry_id,r.id),r.allow_skip)}
              </div>
            `)}</div>`}

        <maintenance-documents-section
          .hass=${this.hass}
          .entryId=${t.entry_id}
          .canWrite=${!s}
        ></maintenance-documents-section>

        <maintenance-parts-section
          .hass=${this.hass}
          .entryId=${t.entry_id}
          .parts=${t.parts||[]}
          .canWrite=${!s}
          .currencySymbol=${this._currencySymbol}
          @parts-changed=${()=>this._loadData()}
        ></maintenance-parts-section>

        <maintenance-object-history-section
          .hass=${this.hass}
          .entryId=${t.entry_id}
          .object=${e}
          .tasks=${t.tasks}
          .currencySymbol=${this._currencySymbol}
          .userName=${r=>this._userService?.getUserName(r)??null}
          @open-task=${r=>this._showTask(t.entry_id,r.detail.taskId)}
        ></maintenance-object-history-section>
      </div>
    `}_renderNewMenu(t){return o`
      <div class="new-menu-wrapper">
        <ha-button appearance="filled" class="new-menu-button"
          @click=${e=>{e.stopPropagation(),this._toggleNewMenu()}}>
          <ha-icon icon="mdi:plus"></ha-icon> ${a("add",t)}
          <ha-icon icon="mdi:menu-down"></ha-icon>
        </ha-button>
        ${this._newMenuOpen?o`
          <div class="popup-menu new-menu-popup" @click=${e=>e.stopPropagation()}>
            <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._ui("maintenance-task-dialog").then(e=>e?.openCreate("",this._objects))}}>
              <ha-icon icon="mdi:clipboard-plus-outline"></ha-icon> ${a("new_task",t)}
            </div>
            <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._ui("maintenance-object-dialog").then(e=>e?.openCreate())}}>
              <ha-icon icon="mdi:package-variant-closed-plus"></ha-icon> ${a("new_object",t).replace(/^\+\s*/,"")}
            </div>
            <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._openTemplateGallery()}}>
              <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon> ${a("templates_from",t)}
            </div>
            <div class="popup-menu-divider"></div>
            <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._openAdoptProblemSensors()}}>
              <ha-icon icon="mdi:alert-circle-check-outline"></ha-icon> ${a("adopt_problem_button",t)}
            </div>
            <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._openSuggestedSetups()}}>
              <ha-icon icon="mdi:auto-fix"></ha-icon> ${a("setups_button",t)}
            </div>
            ${this._batteryFleetSetupAvailable?o`
              <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._setupBatteryFleet()}}>
                <ha-icon icon="mdi:battery-sync"></ha-icon> ${a("battery_fleet_setup_button",t)}
              </div>
            `:h}
          </div>
        `:h}
      </div>
    `}_togglePopup(t,e){let i=!t();e(i),i&&setTimeout(()=>{let s=()=>{e(!1),document.removeEventListener("click",s)};document.addEventListener("click",s)},0)}_toggleNewMenu(){this._togglePopup(()=>this._newMenuOpen,t=>{this._newMenuOpen=t})}_closeNewMenu(){this._newMenuOpen=!1}_isYoungInstall(){let t=this._objects.filter(i=>!i.object?.battery_fleet),e=t.reduce((i,s)=>i+s.tasks.length,0);return t.length<3&&e<8}_gsDismissed(){try{return new Set(JSON.parse(it(I.gettingStartedDismissed)||"[]"))}catch{return new Set}}_dismissGettingStarted(t){let e=this._gsDismissed();e.add(t);try{Y(I.gettingStartedDismissed,JSON.stringify([...e]))}catch{}this.requestUpdate()}_maybeLoadGettingStarted(){this._gsLoaded||!this._isYoungInstall()||(this._gsLoaded=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/discover"}).then(t=>{this._gsSetupsCount=(t.setups||[]).length}).catch(()=>{this._gsSetupsCount=0}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/problem_sensors/discover"}).then(t=>{this._gsAdoptCount=(t.sensors||[]).length}).catch(()=>{this._gsAdoptCount=0}))}_renderGettingStartedChips(t){let e=this._gsDismissed(),i=this._isYoungInstall(),s=[];return i&&this._gsSetupsCount>0&&!e.has("setups")&&s.push({id:"setups",icon:"mdi:auto-fix",text:a("gs_setups_chip",t).replace("{n}",String(this._gsSetupsCount)),run:()=>this._openSuggestedSetups()}),i&&this._gsAdoptCount>0&&!e.has("adopt")&&s.push({id:"adopt",icon:"mdi:alert-circle-check-outline",text:a("gs_adopt_chip",t).replace("{n}",String(this._gsAdoptCount)),run:()=>this._openAdoptProblemSensors()}),this._batteryFleetSetupAvailable&&!e.has("fleet")&&s.push({id:"fleet",icon:"mdi:battery-sync",text:a("gs_fleet_chip",t),run:()=>this._setupBatteryFleet()}),s.length===0?h:o`
      <div class="gs-chips-wrap">
        <div class="gs-chips-label">${a("gs_label",t)}</div>
        <div class="gs-chips">
          ${s.map(n=>o`
            <div class="gs-chip" @click=${()=>n.run()}>
              <ha-icon icon="${n.icon}"></ha-icon>
              <span>${n.text}</span>
              <span class="gs-chip-x" title="${a("dismiss",t)}"
                @click=${d=>{d.stopPropagation(),this._dismissGettingStarted(n.id)}}>
                <ha-icon icon="mdi:close"></ha-icon>
              </span>
            </div>
          `)}
        </div>
      </div>
    `}_toggleObjMenu(){this._togglePopup(()=>this._objMenuOpen,t=>{this._objMenuOpen=t})}_closeObjMenu(){this._objMenuOpen=!1}_toggleMoreMenu(){this._togglePopup(()=>this._moreMenuOpen,t=>{this._moreMenuOpen=t})}_closeMoreMenu(){this._moreMenuOpen=!1}get _sparklineCtx(){return{lang:this._lang,detailStatsData:this._detailStatsData,hasStatsService:!!this._statsService,historyFallbackIds:this._statsService?.historyFallbackIds,isCounterEntity:t=>this._isCounterEntity(t),rangeDays:this._chartRangeDays,setRangeDays:t=>this._setChartRange(t),hideOutliers:this._hideOutliers,setHideOutliers:t=>this._setHideOutliers(t)}}_toggleSection(t){let e=new Set(this._collapsedSections);e.has(t)?e.delete(t):e.add(t),this._collapsedSections=e;try{Y(I.collapsedSections,JSON.stringify([...e]))}catch{}}_historyCtx(){let t=this._selectedEntryId&&this._selectedTaskId?this._getObject(this._selectedEntryId)?.tasks.find(n=>n.id===this._selectedTaskId):void 0,e=this._fullHistory,i=e&&e.entryId===this._selectedEntryId&&e.taskId===this._selectedTaskId&&e.entries.length>(t?.history||[]).length?e.entries:t?.history||[],s=i.filter(n=>n.reading_value!=null).sort((n,d)=>n.timestamp.localeCompare(d.timestamp));return{lang:this._lang,hass:this.hass,filter:this._historyFilter,search:this._historySearch,currencySymbol:this._currencySymbol,setFilter:n=>{this._historyFilter=n},setSearch:n=>{this._historySearch=n},openEdit:n=>this._openHistoryEdit(n),readingUnit:t?.reading_unit??null,taskRef:xt(this._selectedEntryId?this._getObject(this._selectedEntryId)?.object:null,t),phaseNames:Object.fromEntries(Object.entries(t?.phases||{}).map(([n,d])=>[n,d.name])),readingDelta:n=>{let d=s.findIndex(r=>r.timestamp===n.timestamp);return d<=0?null:n.reading_value-s[d-1].reading_value},readingSlotDelta:(n,d)=>Ge(i,n,d)}}_taskDetailCtx(){let t=this._selectedEntryId,e=this._selectedTaskId,i=this._getObject(t);return{lang:this._lang,hass:this.hass,entryId:t,taskId:e,objectName:i?.object.name||"",taskRef:xt(i?.object,i?.tasks.find(s=>s.id===e)),objectDocUrl:i?.object?.documentation_url??null,objectManualDocs:i?.object?.manual_docs??[],openManualDoc:s=>this._openManualDoc(s),setChecklistItem:(s,n)=>this._setChecklistItem(t,e,s,n),setPhaseCursor:s=>{this._runAction({type:"maintenance_supporter/task/set_phase",entry_id:t,task_id:e,cursor:s})},isOperator:this._isOperator,actionLoading:this._actionLoading,moreMenuOpen:this._moreMenuOpen,activeTab:this._activeTab,features:this._features,currencySymbol:this._currencySymbol,collapsedSections:this._collapsedSections,costDurationToggle:this._costDurationToggle,suggestionDismissed:this._dismissedSuggestions.has(`${t}_${e}`),sparkline:this._sparklineCtx,history:this._historyCtx(),getUserName:s=>this._userService?.getUserName(s)??null,getPerson:s=>this._userService?.getPerson(s)??null,setActiveTab:s=>{this._activeTab=s},toggleSection:s=>this._toggleSection(s),setCostDurationToggle:s=>{this._costDurationToggle=s},showTaskView:()=>this._showFullTaskPage(t,e),showObject:()=>this._showObject(t),toggleMoreMenu:()=>this._toggleMoreMenu(),closeMoreMenu:()=>this._closeMoreMenu(),openEdit:s=>{this._ui("maintenance-task-dialog").then(n=>n?.openEdit(t,s))},openComplete:s=>this._openCompleteDialog(t,e,s.name,this._features.checklists?s.checklist:void 0,this._features.adaptive&&!!s.adaptive_config?.enabled),promptSkip:()=>this._promptSkipTask(t,e),toggleArchive:s=>this._toggleArchiveTask(t,e,s),openQr:s=>this._openQrForTask(t,e,i?.object.name||"",s),duplicateTask:()=>this._duplicateTask(t,e),moveTask:()=>this._moveTask(t,e),promptReset:()=>this._promptResetTask(t,e),promptPostpone:()=>this._promptPostponeTask(t,e),snoozeTask:()=>this._snoozeTask(t,e),printWorksheet:()=>this._printTaskWorksheet(t,e),deleteTask:()=>this._deleteTask(t,e),applySuggestion:s=>this._applySuggestion(t,e,s),reanalyze:()=>this._reanalyzeInterval(t,e),dismissSuggestion:()=>this._dismissSuggestion(t,e),openSeasonalOverrides:s=>this._openSeasonalOverrides(s)}}async _fetchFullHistory(t,e){try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:t,task_id:e});this._selectedEntryId===t&&this._selectedTaskId===e&&(this._fullHistory={entryId:t,taskId:e,entries:i.history||[]})}catch{this._fullHistory=null}}_renderTaskDetail(){if(!this._selectedEntryId||!this._selectedTaskId)return h;let t=this._getTask(this._selectedEntryId,this._selectedTaskId);if(!t)return o`<p>Task not found.</p>`;let e=this._fullHistory,i=e&&e.entryId===this._selectedEntryId&&e.taskId===this._selectedTaskId&&e.entries.length>(t.history||[]).length?{...t,history:e.entries}:t;return o`<maintenance-task-detail-view
      .task=${i}
      .ctx=${this._taskDetailCtx()}
    ></maintenance-task-detail-view>`}_openHistoryEdit(t){if(!this._selectedEntryId||!this._selectedTaskId)return;let e=this._getTask(this._selectedEntryId,this._selectedTaskId),i=ai(this._selectedEntryId,this._selectedTaskId,t,e);this.shadowRoot?.querySelector("maintenance-history-edit-dialog")?.openEdit(i)}};w.styles=[Qt,xi],g([S({attribute:!1})],w.prototype,"hass",2),g([S({type:Boolean,reflect:!0})],w.prototype,"narrow",2),g([S({type:Boolean,reflect:!0})],w.prototype,"tight",2),g([S({type:Boolean,reflect:!0})],w.prototype,"split",2),g([S({attribute:!1})],w.prototype,"panel",2),g([S({type:Boolean,reflect:!0})],w.prototype,"embedded",2),g([S({attribute:!1})],w.prototype,"presets",2),g([m()],w.prototype,"_objects",2),g([m()],w.prototype,"_stats",2),g([m()],w.prototype,"_view",2),g([m()],w.prototype,"_allParts",2),g([m()],w.prototype,"_selectedEntryId",2),g([m()],w.prototype,"_selectedTaskId",2),g([m()],w.prototype,"_filterStatus",2),g([m()],w.prototype,"_filterUser",2),g([m()],w.prototype,"_filterLabel",2),g([m()],w.prototype,"_filterPriority",2),g([m()],w.prototype,"_savedViews",2),g([m()],w.prototype,"_activeViewId",2),g([m()],w.prototype,"_unsub",2),g([m()],w.prototype,"_chartRangeDays",2),g([m()],w.prototype,"_hideOutliers",2),g([m()],w.prototype,"_historyFilter",2),g([m()],w.prototype,"_budget",2),g([m()],w.prototype,"_groups",2),g([m()],w.prototype,"_detailStatsData",2),g([m()],w.prototype,"_miniStatsData",2),g([m()],w.prototype,"_features",2),g([m()],w.prototype,"_adminPanelUserIds",2),g([m()],w.prototype,"_operatorWriteEnabled",2),g([m()],w.prototype,"_defaultWarningDays",2),g([m()],w.prototype,"_rowActionStyle",2),g([m()],w.prototype,"_refsInLists",2),g([m()],w.prototype,"_rowActionNotice",2),g([m()],w.prototype,"_actionLoading",2),g([m()],w.prototype,"_moreMenuOpen",2),g([m()],w.prototype,"_objMenuOpen",2),g([m()],w.prototype,"_toastMessage",2),g([m()],w.prototype,"_toastUndo",2),g([m()],w.prototype,"_toastActionLabel",2),g([m()],w.prototype,"_filtersOpen",2),g([m()],w.prototype,"_newMenuOpen",2),g([m()],w.prototype,"_gsSetupsCount",2),g([m()],w.prototype,"_gsAdoptCount",2),g([m()],w.prototype,"_batteryFleetSetupAvailable",2),g([m()],w.prototype,"_staleBundle",2),g([m()],w.prototype,"_overviewTab",2),g([m()],w.prototype,"_activeTab",2),g([m()],w.prototype,"_costDurationToggle",2),g([m()],w.prototype,"_historySearch",2),g([m()],w.prototype,"_sortMode",2),g([m()],w.prototype,"_objectSortMode",2),g([m()],w.prototype,"_groupByMode",2),g([m()],w.prototype,"_objectViewMode",2),g([m()],w.prototype,"_objectsTableColumns",2),g([m()],w.prototype,"_showArchived",2),g([m()],w.prototype,"_bulkMode",2),g([m()],w.prototype,"_bulkSelected",2),g([m()],w.prototype,"_virtStart",2),g([m()],w.prototype,"_virtEnd",2),g([m()],w.prototype,"_collapsedGroups",2),g([m()],w.prototype,"_collapsedSections",2),g([m()],w.prototype,"_paletteOpen",2),g([m()],w.prototype,"_paletteQuery",2),g([m()],w.prototype,"_paletteActive",2),g([m()],w.prototype,"_searchRemote",2),g([m()],w.prototype,"_templateGalleryOpen",2),g([m()],w.prototype,"_templates",2),g([m()],w.prototype,"_templateCategories",2),g([m()],w.prototype,"_templateBusy",2),g([m()],w.prototype,"_fullHistory",2),w=g([De("maintenance-supporter-panel")],w);export{w as MaintenanceSupporterPanel};
