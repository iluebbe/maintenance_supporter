/*! maintenance_supporter frontend 2.95.0 */
import{a as Ge,b as Ye,c as Qe,g as ai}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-3KF2MR5G.js";import{a as k}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-XSFV5MUM.js";import{a as li,b as ci,c as di,d as ne,e as pi,f as $e}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-HZCZCXGC.js";import{A as Ei,B as Ri,C as Oi,D as Ci,E as Mi,L as Di,O as Ai,a as st,b as bt,c as yt,d as Qt,e as Mt,f as re,g as ii,h as si,i as oe,j as oi,k as ni,l as O,m as Vt,n as _t,o as Et,p as zt,q as Te,r as de,s as pe,t as wi,u as ki,v as $i,w as ji,x as Ti,y as Si,z as he}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-3ZSIPK2B.js";import{a as bi,b as At,d as yi,e as ce,f as xi}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-DJEJNHXT.js";import{a as le}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-HZLR56SF.js";import{a as Ke,b as ee,c as xt,d as ie,e as Ft,f as se}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-S7ZP4PVX.js";import{a as Yt,c as Ct}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ODPGZXCU.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-NWUT64HM.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-PMGGLDAF.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-4VXXEC4I.js";import{a as _i,b as fi}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BXH3K3KC.js";import{c as vi}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-XCDM7D5I.js";import{a as A,b as Z,c as V}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YQT7IJJB.js";import{a as ae,b as wt,d as Je,e as Xe,f as Ze,g as ti}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-FM5AUGPZ.js";import{b as ei,h as ri}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-4IQS35GT.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-3VSMXG3M.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-IYGSEAFN.js";import{a as ke}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-WUMSAU4G.js";import{c as hi,d as je,e as ui}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-MUD3KSWB.js";import{k as Ut}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LEWJHPDY.js";import{a as P,b as gi,c as mi}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-PZXGGD7D.js";import{B as Y,C as Q,D as Zt,F as G,G as Fe,H as jt,I as Ue,J as Nt,M as Ve,N as We,P as St,Q as qt,T as te,a as g,b as N,c as r,d as J,f as h,h as q,i as we,j as He,k as Be,l as R,m as _,n as Jt,o as Ne,p as Ht,s as a,t as qe,u as at,w as Xt,x as Dt,y as K,z as Bt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-QTWYYRJZ.js";var cs=["assignee_pool","required_completion_fields","checklist","labels","mirror_todo_entities","next_event_titles","history","readings"],ds=["checklist_progress"],ps=["tasks","parts"],hs=["manual_docs","battery_fleet_excluded"];function Se(l,d,t=[]){for(let e of d)l[e]===void 0&&(l[e]=[]);for(let e of t)l[e]===void 0&&(l[e]={})}function us(l){let d=l;Se(d,ps),d.object&&typeof d.object=="object"&&Se(d.object,hs);for(let t of d.tasks)Se(t,cs,ds);return l}function Wt(l){for(let d of l)us(d);return l}function gs(l,d){if(d.objects)return d.objects;let t=d.delta||[],e=d.removed||[];if(!t.length&&!e.length)return null;let i=new Map(l.map(s=>[s.entry_id,s]));for(let s of t)i.set(s.entry_id,s);for(let s of e)i.delete(s);return[...i.values()]}function zi(l,d){return d.objects&&Wt(d.objects),d.delta&&Wt(d.delta),gs(l,d)}var Ee=["today","dashboard","calendar","settings"];var ms=168*3600*1e3;function Ii(){try{let l=Z(A.objectsCache);if(!l)return null;let d=JSON.parse(l);return d.v!==we||!Number.isFinite(d.at)||Date.now()-d.at>ms||!Array.isArray(d.objects)||d.objects.length===0?null:{objects:d.objects,stats:d.stats??null}}catch{return null}}function Re(l,d){if(!(!Array.isArray(l)||l.length===0))try{let t={v:we,at:Date.now(),objects:l,stats:d};V(A.objectsCache,JSON.stringify(t))}catch{}}function Pi(l,d,t,e,i,s){let o=[[t.manufacturer,l.manufacturer],[t.model,l.model],[t.serial,l.serial_number],[t.installed,l.installation_date?e(l.installation_date):null],[t.warranty,l.warranty_expiry?e(l.warranty_expiry):null]].filter(([,u])=>!!u),c=d.map(u=>{let p=t.scheduleLabel(u);return`<tr>
      <td>${k(u.name)}</td>
      <td>${k(t.typeLabel(u.type))}</td>
      <td>${k(t.statusLabel(u.status))}</td>
      <td>${k(p)}</td>
      <td>${k(u.last_performed?e(u.last_performed):t.none)}</td>
      <td>${k(u.next_due?e(u.next_due):t.none)}</td>
      <td class="num">${u.times_performed??0}</td>
      <td class="num">${k(i(u.total_cost??0))}</td>
    </tr>`}).join(""),n=d.reduce((u,p)=>u+(p.total_cost??0),0);return`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${k(t.title)} \u2014 ${k(l.name)}</title>
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
  <h1>${k(l.name)}</h1>
  <p class="sub">${k(t.title)} \xB7 ${k(t.generated)}: ${k(e(s))}</p>
  ${o.length?`<div class="meta">${o.map(([u,p])=>`<div><div class="k">${k(u)}</div>${k(p)}</div>`).join("")}</div>`:""}
  <h2>${k(t.tasksHeading)} (${d.length})</h2>
  <table>
    <thead><tr>
      <th>${k(t.colTask)}</th><th>${k(t.colType)}</th><th>${k(t.colStatus)}</th>
      <th>${k(t.colSchedule)}</th><th>${k(t.colLastDone)}</th><th>${k(t.colNextDue)}</th>
      <th class="num">${k(t.colTimes)}</th><th class="num">${k(t.colCost)}</th>
    </tr></thead>
    <tbody>${c||`<tr><td colspan="8">${k(t.none)}</td></tr>`}</tbody>
    <tfoot><tr><td colspan="7">${k(t.totalCost)}</td><td class="num">${k(i(n))}</td></tr></tfoot>
  </table>
  ${l.notes?`<div class="notes"><strong>${k(t.notes)}:</strong>
${k(l.notes)}</div>`:""}
</body></html>`}function Oe(l,d=new Date){if(!l)return{kind:"none",days:null,date:null};let t=new Date(`${l}T00:00:00`);if(isNaN(t.getTime()))return{kind:"none",days:null,date:null};let e=Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()),i=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),s=Math.round((i-e)/864e5);return s<0?{kind:"expired",days:s,date:l}:s<=60?{kind:"expiring",days:s,date:l}:{kind:"valid",days:s,date:l}}function _s(l,d){let t=new Date(l);return Number.isNaN(t.getTime())?l.slice(0,10):d(wt(t))}var B=l=>String(l??"").replace(/[&<>"']/g,d=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[d]);function Li(l,d,t,e,i,s,o,c,n,u=[],p=null){let m=[[t.object,B(d)],[t.type,B(t.typeLabel(l.type))],[t.interval,B(i(l))],[t.nextDue,l.next_due?B(e(l.next_due)):"\u2014"],[t.lastDone,l.last_performed?B(e(l.last_performed)):B(t.never)]];l.priority&&l.priority!=="normal"&&m.push([t.priority,B(l.priority)]);let v=(l.checklist||[]).map(y=>`<li><span class="box"></span>${B(y)}</li>`).join(""),f=(y,M)=>y?`<figure class="qr"><img src="${y}" alt="" /><figcaption>${B(M)}</figcaption></figure>`:"";return`<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="color-scheme" content="light">
<title>${B(l.name)} \u2014 ${B(t.title)}</title>
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
      <h1>${B(l.name)}${p?` <span class="ref">#${B(p)}</span>`:""}</h1>
      <div class="obj">${B(d)}</div>
    </div>
    <div class="qr-row">
      ${f(s,t.scanView)}
      ${f(o,t.scanComplete)}
    </div>
  </header>
  <table class="meta">
    ${m.map(([y,M])=>`<tr><td>${B(y)}</td><td>${M}</td></tr>`).join("")}
  </table>
  ${v?`<h2>${B(t.checklist)}</h2><ul class="check">${v}</ul>`:""}
  ${u.length?`<h2>${B(t.parts)}</h2><ul class="check">${u.map(y=>`<li><span class="box"></span>${B(y)}</li>`).join("")}</ul>`:""}
  ${l.notes?`<h2>${B(t.notes)}</h2><div class="notes">${B(l.notes)}</div>`:""}
  ${c?`<h2>${B(t.manualExcerpt)}</h2>
    <div class="excerpt">${B(c.title)} \u2014 ${B(t.pages)} ${c.startPage}\u2013${c.endPage}:
      <a href="${B(c.url)}" target="_blank" rel="noopener">PDF</a>
    </div>
    <div id="excerpt-pages" class="excerpt-pages"></div>
    ${c.vendorBase?`<script type="module">
      // Render the excerpt pages inline (downscaled, two per row) so the
      // whole work sheet prints as ONE document. The link above stays as
      // the fallback if pdf.js or the fetch fails.
      try {
        const pdfjs = await import(${JSON.stringify(c.vendorBase+"/pdf.min.mjs")});
        pdfjs.GlobalWorkerOptions.workerSrc = ${JSON.stringify(c.vendorBase+"/pdf.worker.min.mjs")};
        const doc = await pdfjs.getDocument({ url: ${JSON.stringify(c.url)} }).promise;
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
  <footer>${B(d)} \xB7 ${B(l.name)} \xB7 ${B(t.printedOn)} ${B(_s(n,e))}</footer>
</body></html>`}var Tt=["manual","warranty","invoice","spare_parts","photo","other"],ue={manual:"mdi:book-open-variant",warranty:"mdi:shield-check",invoice:"mdi:receipt-text-outline",spare_parts:"mdi:cog-outline",photo:"mdi:image-outline",other:"mdi:file-document-outline"};function rt(l){return l.title||l.filename||l.url||""}function It(l){return(l.tags||[]).find(d=>Tt.includes(d))??"other"}function Pt(l){let d=(l??[]).filter(t=>!!t);return d.length?r`<span class="event-titles"> · ${d.join(", ")}</span>`:h}var Hi=N`
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
  .bulk-more-wrapper { position: relative; display: inline-flex; }
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
  /* v2.93: recommendations from the home profile. */
  .template-cat.recommended .template-cat-head { color: var(--primary-color); }
  .template-cat-hint { font-size: 12px; color: var(--secondary-text-color); margin: -4px 0 8px; }
  .template-card-reasons { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px; }
  .template-card-reason {
    font-size: 11px; padding: 1px 6px; border-radius: 10px;
    background: color-mix(in srgb, var(--primary-color) 12%, transparent); color: var(--primary-text-color);
  }
  .template-card.not-typical { opacity: .6; }
  /* 2.94: the home already has an object for this template. */
  .template-card-setup {
    display: inline-flex; align-items: center; gap: 4px; font-size: 12px;
    color: var(--success-color, #43a047); --mdc-icon-size: 14px;
  }
  .template-legal {
    display: flex; gap: 6px; align-items: flex-start; margin-top: 8px;
    font-size: 12px; color: var(--secondary-text-color);
  }
  .template-legal ha-icon { --mdc-icon-size: 16px; flex: none; margin-top: 1px; }
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
  /* Objects-table QR: a compact icon button, so the row keeps its height. */
  .obj-table-qr {
    display: inline-flex;
    --ha-icon-button-size: 32px;
    --mdc-icon-size: 20px;
  }
  .row-actions ha-icon-button {
    --ha-icon-button-size: 44px;
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
  /* #179: object-page sections fold away. A chevron gutter beside each
     section; open sections keep their own heading line (the child
     component's h3 — buttons and all), the chevron is aligned to it per
     section because their top margins differ. Collapsed = heading row only. */
  .obj-section { display: grid; grid-template-columns: 28px minmax(0, 1fr); align-items: start; }
  .obj-section-toggle {
    grid-column: 1; width: 28px; height: 28px; padding: 0; margin: 12px 0 0;
    display: inline-flex; align-items: center; justify-content: center;
    border: none; border-radius: 50%; background: none; font: inherit;
    color: var(--secondary-text-color); cursor: pointer;
  }
  .obj-section-toggle:hover { background: var(--secondary-background-color); color: var(--primary-text-color); }
  .obj-section-toggle:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 1px; }
  .obj-section-toggle ha-icon { --mdc-icon-size: 22px; }
  .obj-section-body, .obj-section-title { grid-column: 2; min-width: 0; }
  .obj-section-title { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
  .obj-section-count {
    font-size: 12px; font-weight: 400; color: var(--secondary-text-color);
    background: var(--secondary-background-color); padding: 2px 8px; border-radius: 999px;
  }
  .obj-section.parts.open > .obj-section-toggle { margin-top: 17px; }
  .obj-section.history.open > .obj-section-toggle { margin-top: 32px; }
  @media (max-width: 768px) {
    .obj-section { grid-template-columns: 24px minmax(0, 1fr); }
    .obj-section-toggle { width: 24px; }
  }
  .meta { color: var(--secondary-text-color); margin: 4px 0; }
  /* In-panel links on the object page (area, replacement lineage): href="#"
     counts as visited, so the browser painted them purple. */
  .meta a.object-area-link, .meta a.object-lineage-link { color: var(--primary-color); }
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

  .status-chip.due_soon {
    background: var(--warning-color, #ff9800);
    color: #000;
  }

  .status-chip.overdue {
    background: var(--error-color, #f44336);
    color: white;
  }

  /* Key set = renderers/status.ts STATUS_KEYS (tripwired): triggered, paused
     and archived had no rule, so their header chip rendered as bare text. */
  .status-chip.triggered {
    background: var(--deep-orange-color, #ff5722);
    color: white;
  }

  .status-chip.paused {
    background: var(--info-color, #2196f3);
    color: white;
  }

  .status-chip.archived {
    background: var(--disabled-color, #9e9e9e);
    color: #000;
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

  /* #191: the areas page + the area detail — light-DOM components, so they
     reuse the objects table, filter bar and KPI cards above and add only
     what is theirs: sortable headers, count pills, the cost chart. */
  .objects-table th.num,
  .objects-table td.num { text-align: right; }
  .area-sort {
    display: inline-flex; align-items: center; gap: 2px;
    padding: 0; border: none; background: none; cursor: pointer;
    font: inherit; font-weight: 600; color: inherit;
  }
  .area-sort.active { color: var(--primary-text-color); }
  .area-sort ha-icon { --mdc-icon-size: 14px; }
  .area-row-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color); margin-right: 8px; vertical-align: middle; }
  .area-count {
    display: inline-block; min-width: 20px; padding: 0 7px; border-radius: 10px;
    text-align: center; font-size: 12px; font-weight: 600;
    background: var(--secondary-background-color); color: var(--secondary-text-color);
  }
  .area-count.overdue { background: color-mix(in srgb, var(--error-color, #f44336) 15%, transparent); color: var(--error-color, #f44336); }
  .area-count.due-soon { background: color-mix(in srgb, var(--warning-color, #ff9800) 18%, transparent); color: var(--warning-color, #ff9800); }
  .area-filter-bar, .area-filters { justify-content: flex-start; }
  .area-filter-bar { align-items: center; }
  .area-loading { font-size: 12px; color: var(--secondary-text-color); }
  .area-title { display: flex; align-items: center; gap: 8px; }
  .area-title ha-icon { --mdc-icon-size: 24px; color: var(--secondary-text-color); }
  .area-range-chips { margin: 8px 0 4px; }
  .area-range-chips .filter-chip { font-family: inherit; }
  .area-filters ms-date-field { min-width: 150px; }
  .kpi-bar.area-kpis { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); margin: 12px 0 8px; }
  .area-empty { color: var(--secondary-text-color); font-style: italic; font-size: 13px; }
  .area-chart { margin: 4px 0 8px; }
  .area-chart-max { font-size: 11px; color: var(--secondary-text-color); padding-bottom: 2px; }
  /* Hairline gridline at the maximum (labelled above) and the baseline;
     bars <= 24px with a 2px gap and a rounded data end (dataviz specs). */
  .area-chart-bars {
    display: flex; align-items: flex-end; gap: 2px; height: 140px;
    border-top: 1px solid var(--divider-color); border-bottom: 1px solid var(--divider-color);
  }
  .area-bar { flex: 1 1 0; min-width: 0; height: 100%; display: flex; align-items: flex-end; justify-content: center; }
  .area-bar-fill { width: 100%; max-width: 24px; min-height: 1px; background: var(--primary-color); border-radius: 4px 4px 0 0; }
  .area-bar:hover .area-bar-fill { opacity: 0.75; }
  .area-chart-axis { display: flex; gap: 2px; margin-top: 4px; }
  .area-bar-label {
    flex: 1 1 0; min-width: 0; text-align: center;
    font-size: 10.5px; line-height: 1.25; color: var(--secondary-text-color); white-space: nowrap;
  }
  .area-chart-axis.grouped .area-bar-label { text-align: left; }
  .area-share {
    display: inline-block; width: 48px; height: 6px; margin-right: 6px; border-radius: 3px;
    background: var(--secondary-background-color); vertical-align: middle; overflow: hidden;
  }
  .area-share-fill { display: block; height: 100%; background: var(--primary-color); }
  .area-entry-type { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 500; }
  .area-entry-type ha-icon { --mdc-icon-size: 16px; }
  .area-object-link, .area-task-link {
    padding: 0; border: none; background: none; cursor: pointer;
    font: inherit; color: inherit; text-align: left;
  }
  .area-object-link:hover, .area-task-link:hover { color: var(--primary-color); text-decoration: underline; }
  .area-task-link { font-weight: 500; }
  .area-more { margin-top: 6px; }
  .area-cap-note { margin: 8px 0 0; font-size: 11px; color: var(--secondary-text-color); }
  /* A date field carries its keyboard toggle and clear button: on a phone
     each gets its own line, or the date itself is cut off. */
  :host([narrow]) .area-filters ms-date-field { flex: 1 1 100%; }

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
       Ukrainian ("Налаштування") overflowed at 12px 16px (overflow sweep).
       Below that (360px phones, 2026-09-27) a label shortens with an
       ellipsis instead of pushing the bar past the screen edge. */
    padding: 12px 6px;
    font-size: 13px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    .tab { padding: 12px 6px; font-size: 13px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
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
  /* 2.95: confirmations are neutral like HA's own toasts; red is for errors. */
  .toast.info { background: var(--ms-toast-info-bg, #323232); }
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
`;var ge=class{constructor(d){this._cache=new Map;this._pending=new Map;this.historyFallbackIds=new Set;this._hass=d}updateHass(d){this._hass=d}async getDetailStats(d,t,e=30){return this._getStats(d,e<=35?"hour":"day",e,t)}async getMiniStats(d,t){return this._getStats(d,"day",14,t)}async getBatchMiniStats(d){let t=new Map,e=[];for(let n of d){let u=`${n.entityId}:day:14`,p=this._cache.get(u);p&&Date.now()-p.fetchedAt<3e5?t.set(n.entityId,p.points):e.push(n)}if(e.length===0)return t;let i=e.filter(n=>n.isCounter).map(n=>n.entityId),s=e.filter(n=>!n.isCounter).map(n=>n.entityId),o=new Date(Date.now()-336*60*60*1e3).toISOString(),c=[];return i.length>0&&c.push(this._fetchBatch(i,"day",o,["state","sum","change"],!0,t)),s.length>0&&c.push(this._fetchBatch(s,"day",o,["mean","min","max"],!1,t)),await Promise.all(c),t}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(d,t,e,i){let s=`${d}:${t}:${e}`,o=this._cache.get(s);if(o&&Date.now()-o.fetchedAt<3e5)return o.points;if(this._pending.has(s))return this._pending.get(s);let c=this._fetchAndNormalize(d,t,e,i,s);this._pending.set(s,c);try{return await c}finally{this._pending.delete(s)}}async _fetchAndNormalize(d,t,e,i,s){let o=new Date(Date.now()-e*24*60*60*1e3).toISOString(),c=i?["state","sum","change"]:["mean","min","max"];try{let u=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:o,statistic_ids:[d],period:t,types:c}))[d]||[],p=this._normalizeRows(u,i);if(p.length<2){let m=await this._fetchHistoryFallback(d,o);m.length>=2?(p=m,this.historyFallbackIds.add(d)):this.historyFallbackIds.delete(d)}else this.historyFallbackIds.delete(d);return this._cache.set(s,{entityId:d,fetchedAt:Date.now(),period:t,points:p}),p}catch(n){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${d}:`,n),[]}}async _fetchHistoryFallback(d,t){try{let i=(await this._hass.connection.sendMessagePromise({type:"history/history_during_period",start_time:t,end_time:new Date().toISOString(),entity_ids:[d],minimal_response:!0,no_attributes:!0}))?.[d]||[];if(i.length>1e3){let c=Math.ceil(i.length/500);i=i.filter((n,u)=>u%c===0||u===i.length-1)}let s=[],o=null;for(let c of i){let n=c.s??c.state;if(n==null||n==="unknown"||n==="unavailable")continue;let u;if(n==="on"||n==="open"||n==="true")u=1;else if(n==="off"||n==="closed"||n==="false")u=0;else if(u=parseFloat(n),!Number.isFinite(u))continue;let p=c.lu??c.last_updated??c.last_changed,m=typeof p=="number"?p*1e3:p!=null?Date.parse(p):NaN;Number.isFinite(m)&&(o!=null&&o!==u&&s.push({ts:m,val:o}),s.push({ts:m,val:u}),o=u)}return s.sort((c,n)=>c.ts-n.ts),s.length&&o!=null&&s.push({ts:Date.now(),val:o}),s}catch(e){return console.warn(`[maintenance-supporter] History fallback failed for ${d}:`,e),[]}}async _fetchBatch(d,t,e,i,s,o){try{let c=await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:e,statistic_ids:d,period:t,types:i});for(let n of d){let u=c[n]||[],p=this._normalizeRows(u,s);o.set(n,p),this._cache.set(`${n}:${t}:14`,{entityId:n,fetchedAt:Date.now(),period:t,points:p})}}catch(c){console.warn("[maintenance-supporter] Batch statistics fetch failed:",c)}}_normalizeRows(d,t){let e=[];for(let i of d){let s=null;if(t?s=i.state??null:s=i.mean??null,s===null)continue;let o={ts:i.start,val:s};t||(i.min!=null&&(o.min=i.min),i.max!=null&&(o.max=i.max)),e.push(o)}return e.sort((i,s)=>i.ts-s.ts),e}};function vt(l,d){let t=l??0;return t<1024?`${t} B`:t<1024*1024?`${Y(t/1024,d,1)} KB`:`${Y(t/(1024*1024),d,1)} MB`}var me=8,Ce=["newest","oldest","title","category"];function Me(l){return Ce.includes(l??"")?l:"newest"}function Bi(l,d){let t=new Intl.Collator(void 0,{numeric:!0,sensitivity:"base"}),e=c=>rt(c).trim(),i=(c,n)=>t.compare(e(c),e(n)),s=c=>c.kind==="weblink"?Tt.length+1:Tt.indexOf(It(c)),o=[...l];switch(d){case"oldest":return o.sort((c,n)=>(c.added_at||"").localeCompare(n.added_at||""));case"title":return o.sort(i);case"category":return o.sort((c,n)=>s(c)-s(n)||i(c,n));default:return o.sort((c,n)=>(n.added_at||"").localeCompare(c.added_at||""))}}function _e(l,d){let t=Yt(d);if(!t.length)return l;let e=[];for(let i of l){let s=Ct(t,[{text:i.title,weight:3},{text:i.filename,weight:2},{text:(i.tags||[]).join(" "),weight:2},{text:i.description,weight:2},{text:i.url,weight:1}]);s>0&&e.push({doc:i,score:s})}return e.sort((i,s)=>s.score-i.score).map(i=>i.doc)}var F=class extends q{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._filter="";this._loaded=!1;this._busy=!1;this._error="";this._hint="";this._addingLink=!1;this._linkUrl="";this._linkTitle="";this._category="manual";this._thumbs={};this._lightboxUrl="";this._editingId="";this._editTitle="";this._editCategory="manual";this._editDescription="";this._linkDescription="";this._sort=Me(Z(A.docSort));this._dragOver=!1;this._loadedFor=null;this._loadSeq=0;this._localeReady=!1;this._singlePick=_i()}_isImage(t){return t.kind==="file"&&(t.mime||"").startsWith("image/")}async _sign(t){return ee(this.hass,t.id)}get _lang(){return K(this.hass)}updated(t){if(super.updated(t),this.hass&&!this._localeReady&&(this._localeReady=!0,at(this._lang).then(()=>this.requestUpdate())),this.hass&&this.entryId&&this._loadedFor!==this.entryId){let e=this._loadedFor!==null;this._loadedFor=this.entryId,e&&this._resetForObject(),this._load()}}_resetForObject(){this._docs=[],this._loaded=!1,this._thumbs={},this._filter="",this._error="",this._hint="",this._addingLink=!1,this._linkUrl="",this._linkTitle="",this._linkDescription="",this._editingId="",this._lightboxUrl=""}async _load(){let t=this.entryId,e=++this._loadSeq,i=()=>e!==this._loadSeq||t!==this.entryId,s="",o=await P(this,{type:"maintenance_supporter/documents/list",entry_id:t},{onError:c=>{s=c}});if(!i()){if(this._loaded=!0,o===void 0){this._error=s;return}this._docs=o?.documents||[],this._error="",this._thumbs={},this._loadThumbs(i)}}async _write(t,e,i){this._error="",await P(this,t,{busy:s=>{this._busy=s},fallbackKey:i,reload:async()=>{e?.(),await this._load()},onError:s=>{this._error=s}})}async _signed(t){await P(this,t,{onError:e=>{this._error=e}})}async _loadThumbs(t=()=>!1){await Promise.all(this._docs.filter(e=>this._isImage(e)).map(async e=>{try{let i=await this._sign(e);if(t())return;this._thumbs={...this._thumbs,[e.id]:i}}catch{}}))}_category_of(t){return It(t)}_labelKeydown(t){(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),t.currentTarget.querySelector("input")?.click())}_onFileInput(t){let e=t.target,i=Array.from(e.files??[]);i.length&&this._uploadFiles(i),e.value=""}_onDrop(t){if(t.preventDefault(),this._dragOver=!1,!this.canWrite||this._busy)return;let e=Array.from(t.dataTransfer?.files??[]);e.length&&this._uploadFiles(e)}_onDragOver(t){this.canWrite&&(t.preventDefault(),this._dragOver=!0)}_onDragLeave(t){let e=t.relatedTarget;(!e||!t.currentTarget.contains(e))&&(this._dragOver=!1)}async _uploadFiles(t,e){let i=e??this._category,s=this.entryId;this._busy=!0,this._error="",this._hint="";let o=0,c=0;try{for(let n of t){let u;try{u=await vi(this.hass,s,n,[i])}catch(p){let m=p instanceof Error?p.message:"";if(m!=="doc_too_large"&&m!=="doc_upload_failed")throw p;this._error=a(m,this._lang);continue}u.duplicate_in_object?c++:u.deduped&&o++}if(s!==this.entryId)return;c?this._hint=a("doc_dup_in_object",this._lang):o&&(this._hint=a("doc_deduped",this._lang)),await this._load()}catch{this._error=a("doc_upload_failed",this._lang)}finally{this._busy=!1}}async _download(t){await this._signed(()=>ie(this.hass,t.id,t.filename||t.title||"document"))}async _preview(t){if(this._isImage(t)){this._lightboxUrl=this._thumbs[t.id]||await this._sign(t);return}await this._signed(()=>xt(this.hass,t.id))}_openDoc(t){t.kind==="file"?this._preview(t):st(t.url)&&window.open(t.url,"_blank","noopener")}_startEdit(t){this._editingId=t.id,this._editTitle=t.title||"",this._editCategory=this._category_of(t),this._editDescription=t.description||"",this._addingLink=!1,this._error=""}_cancelEdit(){this._editingId=""}_setSort(t){this._sort=Me(t),V(A.docSort,this._sort)}async _saveEdit(t){let e=(t.tags||[]).filter(s=>!Tt.includes(s)),i=t.kind==="file"?[this._editCategory,...e]:t.tags??[];await this._write({type:"maintenance_supporter/documents/update",doc_id:t.id,title:this._editTitle.trim()||t.filename||t.url||"",tags:i,description:this._editDescription.trim()},()=>{this._editingId=""})}async _delete(t){let e=rt(t);window.confirm(a("doc_delete_confirm",this._lang).replace("{name}",e))&&await this._write({type:"maintenance_supporter/documents/delete",doc_id:t.id})}async _addLink(){let t=this._linkUrl.trim();if(!t)return;let e=this.entryId;await this._write({type:"maintenance_supporter/documents/add_link",entry_id:e,url:t,title:this._linkTitle.trim()||null,description:this._linkDescription.trim()||null},()=>{this._linkUrl="",this._linkTitle="",this._linkDescription="",this._addingLink=!1},"doc_link_invalid")}render(){let t=this._lang;return r`
      <div
        class="doc-zone ${this._dragOver?"drag-over":""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}
      >
        ${this._dragOver&&this.canWrite?r`<div class="drop-overlay">
              <ha-icon icon="mdi:tray-arrow-down"></ha-icon> ${a("doc_drop_hint",t)}
            </div>`:h}
      <div class="doc-header">
        <h3>${a("documents",t)} (${this._docs.length})</h3>
        ${this.canWrite?r`
              <div class="doc-actions">
                <select
                  class="cat-select"
                  .value=${this._category}
                  ?disabled=${this._busy}
                  @change=${e=>this._category=e.target.value}
                >
                  ${Tt.map(e=>r`<option value=${e}>${a(`doc_cat_${e}`,t)}</option>`)}
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

      ${this._error?r`<div class="doc-msg error">${this._error}</div>`:h}
      ${this._hint?r`<div class="doc-msg hint">${this._hint}</div>`:h}

      ${this._addingLink&&this.canWrite?r`
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

      ${this._loaded&&this._docs.length>=2?r`<div class="doc-tools">
            <ha-icon icon="mdi:sort"></ha-icon>
            <select class="sort-select" aria-label=${a("doc_sort",t)} .value=${this._sort}
              @change=${e=>this._setSort(e.target.value)}>
              ${Ce.map(e=>r`<option value=${e} ?selected=${e===this._sort}>${a(`doc_sort_${e}`,t)}</option>`)}
            </select>
          </div>`:h}
      ${this._loaded&&this._docs.length>=me?r`<div class="doc-filter">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input type="search" aria-label=${a("doc_search",t)} placeholder=${a("doc_search",t)}
              .value=${this._filter} @input=${e=>this._filter=e.target.value} />
          </div>`:h}
      ${this._loaded?this._docs.length===0?r`<div class="doc-empty">${a("documents_empty",t)}</div>`:(()=>{let e=this._filter.trim()?_e(this._docs,this._filter):Bi(this._docs,this._sort);return e.length===0?r`<div class="doc-empty">${a("doc_search_none",t)}</div>`:r`<div class="doc-list">${e.map(i=>this._renderDoc(i,t))}</div>`})():r`<div class="doc-empty">${a("loading",t)}</div>`}

      ${this._lightboxUrl?r`<div class="lightbox" @click=${()=>this._lightboxUrl=""}>
            <img class="lightbox-img" src=${this._lightboxUrl} @click=${e=>e.stopPropagation()} />
            <button class="lightbox-close" title=${a("doc_close",t)} @click=${()=>this._lightboxUrl=""}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>`:h}
      </div>
    `}_renderDoc(t,e){if(this._editingId===t.id)return this._renderEdit(t,e);let i=t.kind==="file",s=this._category_of(t),o=i?`${a(`doc_cat_${s}`,e)} \xB7 ${vt(t.size,e)}`:a("doc_link_badge",e),c=this._thumbs[t.id];return r`
      <div class="doc-row">
        ${i&&c?r`<img
              class="doc-thumb"
              src=${c}
              alt=${t.title||""}
              title=${a("doc_open",e)}
              @click=${()=>this._preview(t)}
            />`:r`<ha-icon
              class="doc-icon ${i?"clickable":""}"
              icon=${i?ue[s]:"mdi:link-variant"}
              @click=${()=>i&&this._preview(t)}
            ></ha-icon>`}
        <div
          class="doc-info"
          role="button"
          tabindex="0"
          title=${a("doc_open",e)}
          @click=${()=>this._openDoc(t)}
          @keydown=${n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),this._openDoc(t))}}
        >
          <div class="doc-title">${rt(t)}</div>
          <div class="doc-meta">${o}</div>
          ${t.description?r`<div class="doc-desc">${t.description}</div>`:h}
        </div>
        <div class="doc-row-actions">
          ${i?r`
                <button class="icon-btn" title=${a("doc_open",e)} @click=${()=>this._preview(t)}>
                  <ha-icon icon="mdi:eye-outline"></ha-icon>
                </button>
                <button class="icon-btn" title=${a("doc_download",e)} @click=${()=>this._download(t)}>
                  <ha-icon icon="mdi:download"></ha-icon>
                </button>`:r`<a
                class="icon-btn"
                href=${st(t.url)?t.url:"#"}
                target="_blank"
                rel="noopener noreferrer"
                title=${a("doc_open",e)}
              ><ha-icon icon="mdi:open-in-new"></ha-icon></a>`}
          ${this.canWrite?r`
                <button class="icon-btn" title=${a("edit",e)} ?disabled=${this._busy} @click=${()=>this._startEdit(t)}>
                  <ha-icon icon="mdi:pencil"></ha-icon>
                </button>
                <button class="icon-btn danger" title=${a("delete",e)} ?disabled=${this._busy} @click=${()=>this._delete(t)}>
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>`:h}
        </div>
      </div>
    `}_renderEdit(t,e){let i=t.kind==="file";return r`
      <div class="doc-row editing">
        <input
          class="edit-title"
          type="text"
          placeholder=${a("doc_link_title",e)}
          .value=${this._editTitle}
          ?disabled=${this._busy}
          @input=${s=>this._editTitle=s.target.value}
        />
        ${i?r`<select
              class="cat-select"
              ?disabled=${this._busy}
              @change=${s=>this._editCategory=s.target.value}
            >
              ${Tt.map(s=>r`<option value=${s} ?selected=${s===this._editCategory}>${a(`doc_cat_${s}`,e)}</option>`)}
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
    `}};F.styles=[fi,N`
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
  `],g([R({attribute:!1})],F.prototype,"hass",2),g([R({attribute:!1})],F.prototype,"entryId",2),g([R({type:Boolean})],F.prototype,"canWrite",2),g([_()],F.prototype,"_docs",2),g([_()],F.prototype,"_filter",2),g([_()],F.prototype,"_loaded",2),g([_()],F.prototype,"_busy",2),g([_()],F.prototype,"_error",2),g([_()],F.prototype,"_hint",2),g([_()],F.prototype,"_addingLink",2),g([_()],F.prototype,"_linkUrl",2),g([_()],F.prototype,"_linkTitle",2),g([_()],F.prototype,"_category",2),g([_()],F.prototype,"_thumbs",2),g([_()],F.prototype,"_lightboxUrl",2),g([_()],F.prototype,"_editingId",2),g([_()],F.prototype,"_editTitle",2),g([_()],F.prototype,"_editCategory",2),g([_()],F.prototype,"_editDescription",2),g([_()],F.prototype,"_linkDescription",2),g([_()],F.prototype,"_sort",2),g([_()],F.prototype,"_dragOver",2);customElements.get("maintenance-documents-section")||customElements.define("maintenance-documents-section",F);var nt=class extends q{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._attachId="";this._filter="";this._loadedKey="";this._localeReady=!1}get _lang(){return K(this.hass)}get _refId(){return this.partId||this.taskId||""}get _linkField(){return this.partId?"part_ids":"task_ids"}updated(t){super.updated(t),this.hass&&!this._localeReady&&(this._localeReady=!0,at(this._lang).then(()=>this.requestUpdate()));let e=`${this.entryId}|${this._refId}`;this.hass&&this.entryId&&this._refId&&this._loadedKey!==e&&(this._loadedKey=e,this._load())}async _load(){let t=await P(this,{type:"maintenance_supporter/documents/list",entry_id:this.entryId},{onError:e=>{this._error=e}});this._loaded=!0,t!==void 0&&(this._docs=t?.documents||[],this._error="")}async _update(t){this._error="",await P(this,{type:"maintenance_supporter/documents/update",...t},{busy:e=>{this._busy=e},reload:()=>this._load(),onError:e=>{this._error=e}})}async _signed(t){await P(this,t,{onError:e=>{this._error=e}})}_links(t){return t[this._linkField]||[]}_linked(){return this._docs.filter(t=>this._links(t).includes(this._refId))}_available(){return this._docs.filter(t=>!this._links(t).includes(this._refId))}async _setLinks(t,e){await this._update({doc_id:t.id,[this._linkField]:e})}_link(){let t=this._docs.find(e=>e.id===this._attachId);t&&(this._attachId="",this._setLinks(t,[...this._links(t),this._refId]))}_unlink(t){this._setLinks(t,this._links(t).filter(e=>e!==this._refId))}_isPdf(t){return t.mime==="application/pdf"||(t.filename||"").toLowerCase().endsWith(".pdf")}_pageFor(t){return this._isPdf(t)&&this.taskId?t.task_pages?.[this.taskId]:void 0}async _open(t){if(t.kind==="weblink"){st(t.url)&&window.open(t.url,"_blank","noopener");return}let e=this._pageFor(t);await this._signed(()=>xt(this.hass,t.id,e?`#page=${e}`:""))}async _setPage(t,e){this.taskId&&await this._update({doc_id:t.id,task_pages:{[this.taskId]:e}})}async _download(t){await this._signed(()=>ie(this.hass,t.id,t.filename||t.title||"document"))}render(){if(!this._loaded||this._docs.length===0)return h;let t=this._lang,e=this._linked(),i=this._available();return r`
      <div class="task-docs">
        <h3><ha-icon icon="mdi:paperclip"></ha-icon> ${a("documents",t)} (${e.length})</h3>
        ${this._error?r`<div class="tdoc-error">${this._error}</div>`:h}
        ${e.length>=me?r`<div class="doc-filter">
              <ha-icon icon="mdi:magnify"></ha-icon>
              <input type="search" aria-label=${a("doc_search",t)} placeholder=${a("doc_search",t)}
                .value=${this._filter} @input=${s=>this._filter=s.target.value} />
            </div>`:h}
        ${e.length===0?r`<div class="tdoc-empty">${a(this.partId?"doc_part_none":"doc_task_none",t)}</div>`:(()=>{let s=_e(e,this._filter);return s.length===0?r`<div class="tdoc-empty">${a("doc_search_none",t)}</div>`:r`<div class="tdoc-list">${s.map(o=>this._renderRow(o,t))}</div>`})()}
        ${this.canWrite&&i.length?r`<div class="tdoc-attach">
              <select
                class="tdoc-select"
                ?disabled=${this._busy}
                @change=${s=>this._attachId=s.target.value}
              >
                <option value="" ?selected=${!this._attachId}>${a("doc_link_existing",t)}</option>
                ${i.map(s=>r`<option value=${s.id} ?selected=${s.id===this._attachId}>${rt(s)}</option>`)}
              </select>
              <button class="tdoc-btn" ?disabled=${this._busy||!this._attachId} @click=${this._link}>
                <ha-icon icon="mdi:link-variant-plus"></ha-icon> ${a("doc_attach",t)}
              </button>
            </div>`:h}
      </div>
    `}_renderRow(t,e){let i=t.kind==="file",s=this._isPdf(t),o=this._pageFor(t),c=It(t),n=i?vt(t.size,e):a("doc_link_badge",e);return r`
      <div class="tdoc-row">
        <ha-icon class="tdoc-icon" icon=${i?ue[c]:"mdi:link-variant"}></ha-icon>
        <div
          class="tdoc-info"
          role="button"
          tabindex="0"
          title=${o?`${a("doc_open",e)} \xB7 ${a("doc_page",e)} ${o}`:a("doc_open",e)}
          @click=${()=>this._open(t)}
          @keydown=${u=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),this._open(t))}}
        >
          <div class="tdoc-title">${rt(t)}</div>
          ${t.description?r`<div class="tdoc-desc">${t.description}</div>`:h}
          <div class="tdoc-meta">
            ${n}${o?r` · <span class="tdoc-pagetag">${a("doc_page",e)} ${o}</span>`:h}
          </div>
        </div>
        ${this.canWrite&&s&&this.taskId?r`<input
              class="tdoc-page"
              type="number"
              min="1"
              inputmode="numeric"
              aria-label=${a("doc_page",e)}
              title=${a("doc_page",e)}
              placeholder=${a("doc_page",e)}
              .value=${o?String(o):""}
              ?disabled=${this._busy}
              @change=${u=>{let p=parseInt(u.target.value,10);this._setPage(t,Number.isFinite(p)&&p>=1?p:0)}}
            />`:h}
        <button class="icon-btn" title=${a("doc_open",e)} @click=${()=>this._open(t)}>
          <ha-icon icon=${i?"mdi:eye-outline":"mdi:open-in-new"}></ha-icon>
        </button>
        ${i?r`<button class="icon-btn" title=${a("doc_download",e)} @click=${()=>this._download(t)}>
              <ha-icon icon="mdi:download"></ha-icon>
            </button>`:h}
        ${this.canWrite?r`<button class="icon-btn" title=${a("doc_unlink",e)} ?disabled=${this._busy} @click=${()=>this._unlink(t)}>
              <ha-icon icon="mdi:link-variant-off"></ha-icon>
            </button>`:h}
      </div>
    `}};nt.styles=N`
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
    .tdoc-desc { font-size: 12px; color: var(--secondary-text-color, #888); white-space: pre-line; }
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
  `,g([R({attribute:!1})],nt.prototype,"hass",2),g([R({attribute:!1})],nt.prototype,"entryId",2),g([R({attribute:!1})],nt.prototype,"taskId",2),g([R({attribute:!1})],nt.prototype,"partId",2),g([R({type:Boolean})],nt.prototype,"canWrite",2),g([_()],nt.prototype,"_docs",2),g([_()],nt.prototype,"_loaded",2),g([_()],nt.prototype,"_busy",2),g([_()],nt.prototype,"_error",2),g([_()],nt.prototype,"_attachId",2),g([_()],nt.prototype,"_filter",2);customElements.get("maintenance-task-documents")||customElements.define("maintenance-task-documents",nt);var vs={name:"",vendor:"",mpn:"",gtin:"",storage_location:"",product_url:"",unit:"",cost:"",stock:"",reorder_threshold:"",restock_quantity:"",auto_buy_task:!0,notes:""},ot=class extends q{constructor(){super(...arguments);this.parts=[];this.canWrite=!1;this.currencySymbol="\u20AC";this._editing=null;this._busy=!1;this._error="";this._restockFor=null;this._restockQty="";this._restockInvalid=!1;this._docsFor=null}get _lang(){return K(this.hass)}connectedCallback(){super.connectedCallback(),at(this._lang).then(()=>this.requestUpdate())}_notifyChanged(){this.dispatchEvent(new CustomEvent("parts-changed",{bubbles:!0,composed:!0}))}_send(t){return this._error="",P(this,t,{busy:e=>{this._busy=e},onError:e=>{this._error=e}})}_openAdd(){this._editing={...vs}}_openEdit(t){this._editing={id:t.id,name:t.name,vendor:t.vendor||"",mpn:t.mpn||"",gtin:t.gtin||"",storage_location:t.storage_location||"",product_url:t.product_url||"",unit:t.unit||"",cost:t.cost!=null?String(t.cost):"",stock:t.stock!=null?String(t.stock):"",reorder_threshold:t.reorder_threshold!=null?String(t.reorder_threshold):"",restock_quantity:t.restock_quantity!=null?String(t.restock_quantity):"",auto_buy_task:!!t.auto_buy_task,notes:t.notes||""}}_formValue(t){let e=i=>i.trim()===""?null:Number(i);return{entry_id:this.entryId,name:t.name.trim(),vendor:t.vendor.trim()||null,mpn:t.mpn.trim()||null,gtin:t.gtin.trim()||null,storage_location:t.storage_location.trim()||null,product_url:t.product_url.trim()||null,unit:t.unit.trim()||null,cost:e(t.cost),stock:e(t.stock),reorder_threshold:e(t.reorder_threshold),restock_quantity:e(t.restock_quantity),auto_buy_task:t.auto_buy_task,notes:t.notes.trim()||null}}async _save(){let t=this._editing;if(this._busy||!t||!t.name.trim())return;let e=this._formValue(t),i=t.id?"maintenance_supporter/part/update":"maintenance_supporter/part/create";await this._send(t.id?{type:i,part_id:t.id,...e}:{type:i,...e})!==void 0&&(this._editing=null,this._notifyChanged())}async _delete(t){if(!window.confirm(a("part_delete_confirm",this._lang).replace("{name}",t.name)))return;await this._send({type:"maintenance_supporter/part/delete",entry_id:this.entryId,part_id:t.id})!==void 0&&this._notifyChanged()}async _restock(t){if(this._busy)return;let e=parseFloat(this._restockQty);if(!Number.isFinite(e)||e===0){this._restockInvalid=!0;return}this._restockInvalid=!1;let i=await this._send({type:"maintenance_supporter/part/restock",entry_id:this.entryId,part_id:t.id,delta:e});this._restockFor=null,i!==void 0&&(t.stock=i?.stock,this.requestUpdate(),this._notifyChanged())}_identLine(t){return[t.vendor,t.mpn?`MPN: ${t.mpn}`:"",t.gtin?`GTIN: ${t.gtin}`:""].filter(Boolean).join(" \xB7 ")}_renderRow(t){let e=this._lang,i=t.stock!==null&&t.stock!==void 0,s=this._identLine(t),o=this._docsFor===t.id;return r`
      <div class="part-row ${t.is_low?"low":""}">
        <ha-icon class="part-icon" icon=${t.is_low?"mdi:cart-arrow-down":"mdi:package-variant-closed"}></ha-icon>
        <div class="part-main">
          <div class="part-name">
            ${st(t.shopping_url)?r`<a href=${t.shopping_url} target="_blank" rel="noopener noreferrer">${t.name}</a>`:t.name}
            ${i?r`<span class="stock-badge ${t.is_low?"low":""}"
                  >${Zt(t.stock,t.unit,e)}${t.reorder_threshold!=null?r`<span class="threshold">/${Y(t.reorder_threshold,e)}</span>`:h}</span
                >`:h}
          </div>
          <div class="part-meta">
            ${s?r`<span>${s}</span>`:h}
            ${t.storage_location?r`<span class="loc"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${t.storage_location}</span>`:h}
          </div>
          ${t.notes?r`<div class="part-notes">${t.notes}</div>`:h}
        </div>
        <ha-icon-button
          title=${a("documents",e)}
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
                      @input=${c=>this._restockQty=c.target.value}
                      @keydown=${c=>{c.key==="Enter"&&this._restock(t),c.key==="Escape"&&(this._restockFor=null)}}
                    />
                    <ha-icon-button title=${a("save",e)} .disabled=${this._busy} @click=${()=>this._restock(t)}
                      ><ha-icon icon="mdi:check"></ha-icon
                    ></ha-icon-button>
                  `:r`
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
      ${o?r`<div class="part-docs">
            <maintenance-task-documents
              .hass=${this.hass}
              .entryId=${this.entryId}
              .partId=${t.id}
              .canWrite=${this.canWrite}
            ></maintenance-task-documents>
          </div>`:h}
    `}_field(t,e,i={}){let s=this._editing;return r`
      <label class="form-field">
        <span>${t}</span>
        <input
          type=${i.type||"text"}
          .value=${String(s[e]??"")}
          placeholder=${i.placeholder||""}
          @input=${o=>{this._editing[e]=o.target.value,this.requestUpdate()}}
        />
      </label>
    `}_renderForm(){let t=this._lang,e=this._editing;return r`
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
          <!-- Documented and searched since the parts feature, but the form
               never had a field — only the API and imports could set it
               (audit 2026-09-28). -->
          <label class="form-field notes">
            <span>${a("notes_label",t)}</span>
            <textarea
              rows="2"
              maxlength="500"
              .value=${e.notes}
              @input=${i=>{this._editing={...this._editing,notes:i.target.value}}}
            ></textarea>
          </label>
        </div>
        <div class="form-actions">
          <ha-button appearance="plain" @click=${()=>this._editing=null}>${a("cancel",t)}</ha-button>
          <ha-button .disabled=${this._busy||!e.name.trim()} @click=${()=>this._save()}
            >${a("save",t)}</ha-button
          >
        </div>
      </div>
    `}_inventoryValue(){let t=0,e=!1;for(let i of this.parts){let s=typeof i.cost=="number"?i.cost:null,o=typeof i.stock=="number"?i.stock:null;s!==null&&o!==null&&(t+=s*o,e=!0)}return e?t:null}render(){let t=this._lang;return!this.parts.length&&!this.canWrite?h:r`
      <div class="section-head">
        <h3>
          <ha-icon icon="mdi:package-variant"></ha-icon>
          ${a("parts_section",t)} (${this.parts.length})
          ${this._inventoryValue()!==null?r`<span class="inventory-value" title=${a("parts_inventory_value",t)}
                >${a("parts_inventory_value",t)}:
                ${Q(this._inventoryValue(),this.currencySymbol,t)}</span>`:h}
        </h3>
        ${this.canWrite&&!this._editing?r`<ha-button appearance="plain" @click=${()=>this._openAdd()}>
              <ha-icon icon="mdi:plus"></ha-icon> ${a("part_add",t)}
            </ha-button>`:h}
      </div>
      ${this._error?r`<div class="error">${this._error}</div>`:h}
      ${this._editing?this._renderForm():h}
      ${this.parts.map(e=>this._renderRow(e))}
    `}};ot.styles=N`
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
    .form-field.notes {
      grid-column: 1 / -1;
    }
    .form-field textarea {
      padding: 6px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      resize: vertical;
    }
    .part-notes {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: pre-line;
      overflow-wrap: anywhere;
      margin-top: 2px;
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
  `,g([R({attribute:!1})],ot.prototype,"hass",2),g([R({attribute:!1})],ot.prototype,"entryId",2),g([R({attribute:!1})],ot.prototype,"parts",2),g([R({type:Boolean})],ot.prototype,"canWrite",2),g([R({attribute:!1})],ot.prototype,"currencySymbol",2),g([_()],ot.prototype,"_editing",2),g([_()],ot.prototype,"_busy",2),g([_()],ot.prototype,"_error",2),g([_()],ot.prototype,"_restockFor",2),g([_()],ot.prototype,"_restockQty",2),g([_()],ot.prototype,"_restockInvalid",2),g([_()],ot.prototype,"_docsFor",2);customElements.get("maintenance-parts-section")||customElements.define("maintenance-parts-section",ot);var ve={readings:!0,parts:!0,photos:!0,documents:!0,checklist:!0,notes:!0,costs:!0,person:!0,refs:!0,qr:!1,bare:!0,docDescriptions:!0};function fs(l){return!!(l.notes&&l.notes.trim()||l.cost!=null||l.duration!=null||l.readings.length||l.parts.length||l.photoIds.length||l.checklist)}var bs=6;function Ni(l,d,t,e,i,s,o,c={}){let n=c.options??{layout:"chronological",include:ve},u=n.include,p=c.data??{objectRef:null,tasks:[],photos:{},fmtNumber:$=>String($)},m=d.filter($=>$.type==="completed"&&(u.bare!==!1||fs($))),{totalCost:v}=ne(m),f=$=>u.refs&&p.objectRef&&$.taskRefNo!=null&&$.refNo!=null?`${p.objectRef}.${$.taskRefNo}-${$.refNo}`:null,y=$=>u.refs&&p.objectRef&&$.taskRefNo!=null?`${p.objectRef}.${$.taskRefNo}`:null,M=[[t.refNumber,u.refs&&p.objectRef?`#${p.objectRef}`:null],[t.manufacturer,l.manufacturer],[t.model,l.model],[t.serial,l.serial_number],[t.installed,l.installation_date?e(l.installation_date):null]].filter(([,$])=>$).map(([$,L])=>`<div class="meta-row"><span>${k($)}</span><strong>${k(L)}</strong></div>`).join(""),j=$=>{let L=[];if(u.readings&&$.readings.length){let H=$.readings.map(z=>{let W=`${p.fmtNumber(z.value)}${z.unit?` ${k(z.unit)}`:""}`,X=z.delta!=null?` <span class="delta">(${z.delta>=0?"+":"\u2212"}${p.fmtNumber(Math.abs(z.delta))})</span>`:"";return`${z.name?`${k(z.name)}: `:""}${W}${X}`});L.push(`<div class="fact"><span class="k">${k(t.readings)}</span>${H.join(" \xB7 ")}</div>`)}if(u.parts&&$.parts.length&&L.push(`<div class="fact"><span class="k">${k(t.parts)}</span>${$.parts.map(H=>`${k(H.name)} \xD7 ${p.fmtNumber(H.quantity)}`).join(", ")}</div>`),u.checklist&&$.checklist&&L.push(`<div class="fact"><span class="k">${k(t.checklist)}</span>${$.checklist.done}/${$.checklist.total}</div>`),u.photos&&$.photoIds.length){let H=$.photoIds.slice(0,bs),z=H.map(X=>{let U=p.photos[X],S=U?.name||X.slice(0,8);return U?.url?`<figure class="photo"><img src="${k(U.url)}" alt="" /><figcaption>${k(S)}</figcaption></figure>`:`<figure class="photo"><figcaption>${k(S)}</figcaption></figure>`}),W=$.photoIds.length>H.length?`<span class="more">+${$.photoIds.length-H.length}</span>`:"";L.push(`<div class="fact"><span class="k">${k(t.photos)}</span><div class="photos">${z.join("")}${W}</div></div>`)}return L.length?`<div class="details">${L.join("")}</div>`:""},E=$=>[u.notes?$.notes:null,u.person&&$.completedBy?`${t.completedBy}: ${$.completedBy}`:null].filter(Boolean).join(" \xB7 "),x=$=>u.costs?`<td class="num">${$.cost!=null?k(s($.cost)):k(t.none)}</td>
        <td class="num">${$.duration!=null?k(i($.duration)):k(t.none)}</td>`:"",D=$=>$?`<span class="ref">#${k($)}</span>`:"",C=u.costs?5:3,b=$=>`<thead><tr>
    <th>${k(t.colDate)}</th>
    ${$?`<th>${k(t.colTask)}</th>`:"<th></th>"}
    ${u.costs?`<th class="num">${k(t.colCost)}</th><th class="num">${k(t.colDuration)}</th>`:""}
    <th>${k(t.colNotes)}</th>
  </tr></thead>`,it=($,L)=>{let H=E($),z=j($),W=L?k($.phaseName?`${$.taskName} \xB7 ${$.phaseName}`:$.taskName):k($.phaseName||"");return`<tr class="entry">
        <td class="nowrap">${k(e($.timestamp))}${D(f($))}</td>
        <td>${L?`${W} ${D(y($))}`:W}</td>
        ${x($)}
        <td class="notes">${k(H)||(z?"":k(t.none))}</td>
      </tr>${z?`<tr class="entry-details"><td colspan="${C}" class="details-cell">${z}</td></tr>`:""}`},ht;if(n.layout==="by_task"){let $=new Map(p.tasks.map(z=>[z.id,z])),L=[...p.tasks.map(z=>z.id)];for(let z of m)L.includes(z.taskId)||L.push(z.taskId);ht=`${L.map(z=>{let W=m.filter(ut=>ut.taskId===z);if(!W.length)return"";let X=$.get(z),U=X?.name||W[0].taskName,S=u.refs?X?.ref??y(W[0]):null,T=u.documents&&X?.documents.length?`<div class="fact"><span class="k">${k(t.documents)}</span>${X.documents.map(ut=>`${k(ut.title)}${ut.page?` (${k(t.page(ut.page))})`:""}${u.docDescriptions!==!1&&ut.description?` \u2014 <span class="doc-desc">${k(ut.description)}</span>`:""}`).join(", ")}</div>`:"",I=u.qr&&X?.qrDataUri?`<figure class="qr"><img src="${k(X.qrDataUri)}" alt="" /><figcaption>${k(t.scanHint)}</figcaption></figure>`:"",Ot=W.reduce((ut,ls)=>ut+(ls.cost??0),0);return`<section class="task">
  <div class="task-head">
    <div class="task-title">
      <h2>${k(U)} ${D(S)}</h2>
      ${X?.schedule?`<div class="schedule">${k(X.schedule)}</div>`:""}
      ${T}
      <div class="task-count">${k(t.entriesLabel(W.length))}${u.costs&&Ot>0?` \xB7 ${k(s(Ot))}`:""}</div>
    </div>
    ${I}
  </div>
  <table>
    ${b(!1)}
    <tbody>
${W.map(ut=>it(ut,!1)).join(`
`)}
    </tbody>
  </table>
</section>`}).join(`
`)}
<table class="total">
  <tfoot><tr>
    <td>${k(t.totalLabel)}</td>
    <td class="num">${u.costs?k(s(v)):""}</td>
  </tr></tfoot>
</table>`}else ht=`<table>
  ${b(!0)}
  <tbody>
${m.map($=>it($,!0)).join(`
`)}
  </tbody>
  <tfoot><tr>
    <td colspan="2">${k(t.totalLabel)}</td>
    ${u.costs?`<td class="num">${k(s(v))}</td><td colspan="2"></td>`:"<td></td>"}
  </tr></tfoot>
</table>`;return`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${k(t.title)} \u2014 ${k(l.name)}</title>
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
<h1>${k(t.title)} \u2014 ${k(l.name)}</h1>
<p class="sub">${k(t.generated)} ${k(e(o))} \xB7 ${k(t.entriesLabel(m.length))}</p>
${M?`<div class="meta">${M}</div>`:""}
${ht}
${c.capped?`<p class="cap-note">${k(t.capNote)}</p>`:""}
</body>
</html>`}var ys=60,tt=class extends q{constructor(){super(...arguments);this.entryId="";this.object=null;this.tasks=[];this.currencySymbol="\u20AC";this.userName=()=>null;this._full={};this._loading=!1;this._filterTask="";this._from="";this._to="";this._expanded=!1;this._printOpen=!1;this._printLayout="chronological";this._printInclude={...ve};this._printing=!1;this._loadedFor=null;this._loadedSignature="";this._loadSeq=0;this._localeReady=!1}connectedCallback(){super.connectedCallback();try{let t=JSON.parse(Z(A.printOptions)||"null");(t?.layout==="by_task"||t?.layout==="chronological")&&(this._printLayout=t.layout),t?.include&&typeof t.include=="object"&&(this._printInclude={...ve,...t.include})}catch{}}_savePrintOptions(){V(A.printOptions,JSON.stringify({layout:this._printLayout,include:this._printInclude}))}_toggleInclude(t,e){this._printInclude={...this._printInclude,[t]:e},this._savePrintOptions()}get _lang(){return K(this.hass)}updated(t){if(super.updated(t),!this._localeReady&&this.hass&&(this._localeReady=!0,at(this._lang).then(()=>this.requestUpdate())),this.entryId&&this._loadedFor!==this.entryId)this._loadedFor=this.entryId,this._full={},this._filterTask="",this._from="",this._to="",this._loadedSignature=this._historySignature(),this._loadFullHistories();else if(this.entryId&&t.has("tasks")){let e=this._historySignature();e!==this._loadedSignature&&(this._loadedSignature=e,this._loadFullHistories())}}_historySignature(){return JSON.stringify(this.tasks.map(t=>[t.id,t.history_count??null,t.history??[]]))}async _loadFullHistories(){let t=this.entryId,e=this.tasks,i=++this._loadSeq;if(!e.length){this._full={},this._loading=!1;return}this._loading=!0;let s=await Promise.all(e.map(async o=>{try{let c=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:t,task_id:o.id});return[o.id,c.history??[]]}catch{return[o.id,o.history??[]]}}));this.entryId!==t||i!==this._loadSeq||(this._full=Object.fromEntries(s),this._loading=!1)}get _entries(){return ci(this.tasks.map(t=>({id:t.id,name:t.name,history:this._full[t.id]??t.history??[],ref_no:t.ref_no,reading_unit:t.reading_unit})))}get _capped(){return Object.values(this._full).some(t=>t.length>=li)}_openTask(t){this.dispatchEvent(new CustomEvent("open-task",{detail:{taskId:t},bubbles:!0,composed:!0}))}async _bookletData(t){let e=this._printInclude,i=this._lang,s=[];if(e.documents||e.photos)try{s=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId})).documents||[]}catch{s=[]}let o=new Map;e.qr&&this._printLayout==="by_task"&&await Promise.all(this.tasks.map(async u=>{try{let p=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/qr/generate",entry_id:this.entryId,task_id:u.id,url_mode:"server",action:"view"});p.svg_data_uri&&o.set(u.id,p.svg_data_uri)}catch{}}));let c=this.tasks.map(u=>({id:u.id,name:u.name,ref:yt(this.object,u),schedule:St(u,i)||null,documents:s.filter(p=>(p.task_ids||[]).includes(u.id)&&!(p.tags||[]).includes("photo")).map(p=>({title:rt(p),page:p.task_pages?.[u.id]??null,description:p.description||null})),qrDataUri:o.get(u.id)??null})),n={};if(e.photos){let u=[...new Set(t.filter(m=>m.type==="completed").flatMap(m=>m.photoIds))].slice(0,ys),p=new Map(s.map(m=>[m.id,m]));await Promise.all(u.map(async m=>{let v=p.get(m),f=v&&rt(v)||m.slice(0,8);try{n[m]={name:f,url:new URL(await ee(this.hass,m),window.location.origin).href}}catch{n[m]={name:f,url:null}}}))}return{tasks:c,photos:n}}async _print(t){let e=this._lang,i=this.object;if(!i||this._printing)return;let s=se();this._printing=!0;let o;try{o=await this._bookletData(t)}catch(p){throw s?.close(),p}finally{this._printing=!1}this._printOpen=!1;let c={title:a("service_record_title",e),generated:a("report_generated",e),manufacturer:a("manufacturer",e),model:a("model",e),serial:a("serial_number_label",e),installed:a("installed",e),colDate:a("date",e),colTask:a("task_name",e),colCost:a("cost",e),colDuration:a("duration",e),colNotes:a("notes_label",e),completedBy:a("completed_by",e),totalLabel:a("report_total_cost",e),entriesLabel:p=>`${p} ${a("service_record_entries",e)}`,capNote:a("object_history_cap_note",e),none:"\u2014",readings:a("print_inc_readings",e),parts:a("print_inc_parts",e),photos:a("print_inc_photos",e),documents:a("print_inc_documents",e),checklist:a("print_inc_checklist",e),refNumber:a("ref_number",e),scanHint:a("report_scan_hint",e),page:p=>a("search_page",e).replace("{page}",String(p))},n=t.map(p=>({...p,completedBy:p.completedBy?this.userName(p.completedBy):null,notes:p.notes?le(p.notes,e):null})),u=Ni(i,n,c,p=>p?G(p,e):"",p=>Nt(p,e),p=>Q(p,this.currencySymbol,e),new Date().toISOString(),{capped:this._capped,options:{layout:this._printLayout,include:this._printInclude},data:{objectRef:bt(i),tasks:o.tasks,photos:o.photos,fmtNumber:p=>Y(p,e)}});Ft(u,s)}_renderPrintOptions(t){let e=this._lang,i=this._printInclude,s=(c,n,u=!1)=>r`
      <label class="opt ${u?"disabled":""}">
        <input type="checkbox" .checked=${i[c]} ?disabled=${u}
          @change=${p=>this._toggleInclude(c,p.target.checked)} />
        <span>${a(n,e)}</span>
      </label>`,o=this._printLayout==="by_task";return r`
      <div class="print-options" role="dialog" aria-label=${a("print_options_title",e)}>
        <div class="po-title">${a("print_options_title",e)}</div>
        <div class="po-group">
          <span class="po-label">${a("print_layout",e)}</span>
          <label class="opt"><input type="radio" name="layout" value="chronological" .checked=${!o}
            @change=${()=>{this._printLayout="chronological",this._savePrintOptions()}} /><span>${a("print_layout_chronological",e)}</span></label>
          <label class="opt"><input type="radio" name="layout" value="by_task" .checked=${o}
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
          ${s("documents","print_inc_documents",!o)}
          ${s("docDescriptions","print_inc_doc_desc",!o)}
          ${s("qr","print_inc_qr",!o)}
        </div>
        <div class="po-actions">
          <ha-button appearance="plain" @click=${()=>{this._printOpen=!1}}>${a("cancel",e)}</ha-button>
          <ha-button appearance="filled" class="po-print" .disabled=${this._printing} @click=${()=>this._print(t)}>
            ${this._printing?a("loading",e):a("print_button",e)}
          </ha-button>
        </div>
      </div>`}render(){let t=this._lang,e=this._entries;if(!e.length&&!this._loading)return h;let i=di(e,{taskId:this._filterTask||null,from:this._from||null,to:this._to||null}),{completed:s,totalCost:o}=ne(i),c=this._expanded?i:i.slice(0,15);return r`
      <div class="section">
        <h3>
          ${a("object_history_section",t)}
          <span class="count">${i.length}</span>
          ${this._loading?r`<span class="loading-hint">${a("loading",t)}</span>`:h}
          <ha-button appearance="plain" class="print-btn" @click=${()=>{this._printOpen=!this._printOpen}}>
            <ha-icon icon="mdi:printer-outline"></ha-icon>
            ${a("service_record_print",t)}
          </ha-button>
        </h3>
        ${this._printOpen?this._renderPrintOptions(i):h}

        <div class="filters">
          <select .value=${this._filterTask} @change=${n=>{this._filterTask=n.target.value}}>
            <option value="">${a("object_history_all_tasks",t)}</option>
            ${this.tasks.map(n=>r`<option value=${n.id} ?selected=${n.id===this._filterTask}>${n.name}</option>`)}
          </select>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${t}
            .label=${a("date_from",t)}
            .value=${this._from}
            @value-changed=${n=>{this._from=n.detail.value}}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${t}
            .label=${a("date_to",t)}
            .value=${this._to}
            @value-changed=${n=>{this._to=n.detail.value}}
          ></ms-date-field>
        </div>

        ${i.length===0?r`<p class="empty">${a("object_history_empty",t)}</p>`:r`
              <div class="rows">
                ${c.map(n=>r`
                  <div class="row">
                    <span class="date" title=${Fe(n.timestamp,t)}>${G(n.timestamp,t)}</span>
                    <span class="type type-${n.type}">${a(n.type,t)}</span>
                    <button class="task-link" @click=${()=>this._openTask(n.taskId)}>${n.taskName}${n.phaseName?` \xB7 ${n.phaseName}`:""}</button>
                    <span class="facts">
                      ${n.cost!=null?r`<span>${Q(n.cost,this.currencySymbol,t)}</span>`:h}
                      ${n.duration!=null?r`<span>${Nt(n.duration,t)}</span>`:h}
                    </span>
                    ${n.notes?r`<span class="notes" title=${le(n.notes,t)}>${le(n.notes,t)}</span>`:h}
                  </div>
                `)}
              </div>
              ${i.length>c.length?r`<ha-button appearance="plain" class="more" @click=${()=>{this._expanded=!0}}>
                    ${a("show_all",t)} (${i.length})
                  </ha-button>`:h}
              <div class="totals">
                ${s} ${a("service_record_entries",t)} · ${a("report_total_cost",t)}:
                <strong>${Q(o,this.currencySymbol,t)}</strong>
              </div>
              ${this._capped?r`<p class="cap-note">${a("object_history_cap_note",t)}</p>`:h}
            `}
      </div>
    `}};tt.styles=N`
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
  `,g([R({attribute:!1})],tt.prototype,"hass",2),g([R()],tt.prototype,"entryId",2),g([R({attribute:!1})],tt.prototype,"object",2),g([R({attribute:!1})],tt.prototype,"tasks",2),g([R()],tt.prototype,"currencySymbol",2),g([R({attribute:!1})],tt.prototype,"userName",2),g([_()],tt.prototype,"_full",2),g([_()],tt.prototype,"_loading",2),g([_()],tt.prototype,"_filterTask",2),g([_()],tt.prototype,"_from",2),g([_()],tt.prototype,"_to",2),g([_()],tt.prototype,"_expanded",2),g([_()],tt.prototype,"_printOpen",2),g([_()],tt.prototype,"_printLayout",2),g([_()],tt.prototype,"_printInclude",2),g([_()],tt.prototype,"_printing",2);customElements.get("maintenance-object-history-section")||customElements.define("maintenance-object-history-section",tt);var lt=class lt extends q{constructor(){super(...arguments);this.flat=!1;this._ov=null;this._loading=!1;this._marking=!1;this._error="";this._history=null;this._rosterSort=lt._storedSort();this._typeFilter=null;this._recorded=[];this._access=bi;this._historyRequested=!1;this._localeReady=!1;this._markAll=async()=>{await this._mark(void 0)};this._repair=async()=>{await this._act({type:"maintenance_supporter/battery_fleet/setup",language:this._lang})};this._loadHistory=async t=>{let e=t.target.open;if(V(A.batteryRosterOpen,e?"1":"0"),!(!e||this._historyRequested)){this._historyRequested=!0;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview_history"});this._history=i.series}catch{this._history=null}}}}get _lang(){return K(this.hass)}get _canWrite(){return At(this.hass?.user,this._access)}connectedCallback(){super.connectedCallback(),this.hass&&this._load()}updated(t){Dt(this,t),t.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,at(this._lang).then(()=>this.requestUpdate()),ce(this.hass).then(e=>{this._access=e.access}),this._ov===null&&!this._loading&&this._load())}async _load(){this._error="";let t=await P(this,{type:"maintenance_supporter/battery_fleet/overview"},{busy:e=>{this._loading=e},onError:e=>{this._error=e}});t!==void 0&&(this._ov=t)}async _act(t,e){this._marking||(this._error="",await P(this,t,{busy:i=>{this._marking=i},reload:async()=>{e?.(),await this._load()},onError:i=>{this._error=i}}))}async _mark(t){await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",...t?{entity_ids:t}:{}})}async _setExcluded(t,e){await this._act({type:"maintenance_supporter/battery_fleet/set_excluded",entity_id:t,excluded:e})}async _addBattery(t){let e=t.detail?.value;e&&await this._act({type:"maintenance_supporter/battery_fleet/set_included",entity_id:e,included:!0})}async _setTrackSelf(t){await this._setFleetOption("set_track_self_charging",t.target.checked)}async _setDueWithoutSensor(t){await this._setFleetOption("set_due_without_sensor",t.target.checked)}async _setFleetOption(t,e){await this._act({type:`maintenance_supporter/battery_fleet/${t}`,enabled:e})}_rosterOpen(){return Z(A.batteryRosterOpen)!=="0"}_predictedTitle(t,e){if(t.forecast_overdue)return a("battery_fleet_forecast_overdue",e);let i=this._predictedDate(t.days_until??0);if(t.predicted_source==="trend")return a("battery_fleet_predicted_trend",e).replace("{date}",i).replace("{confidence}",a("cal_confidence_"+(t.prediction_confidence||"medium"),e));if(t.lifetime_months!=null&&t.lifetime_source){let s=a("lifetime_source_"+t.lifetime_source,e).replace("{n}",String(t.lifetime_samples??0));return a("battery_fleet_predicted_typical",e).replace("{date}",i).replace("{months}",String(t.lifetime_months)).replace("{type}",t.battery_type).replace("{source}",s)}return a("battery_fleet_predicted_on",e).replace("{date}",i)}_sparkline(t){let e=this._history?.[t.entity_id];if(!e||e.points.length<2)return h;let i=110,s=24,o=2,c=e.points[0][0],n=e.points[e.points.length-1][0],u=Date.now()/1e3,p=t.status!=="low"&&t.predicted_source==="trend"&&t.days_until!=null?u+t.days_until*86400:null,m=Math.max(n,p??n),v=E=>m===c?o:o+(E-c)/(m-c)*(i-2*o),f=E=>o+(1-Math.min(100,Math.max(0,E))/100)*(s-2*o),y=e.points.map(([E,x])=>`${O(v(E))},${O(f(x))}`).join(" "),M=e.points[e.points.length-1][1],j=O(f(e.threshold));return r`<svg
      class="bf-spark"
      viewBox="0 0 ${i} ${s}"
      role="img"
      aria-label=${a("battery_fleet_sparkline_hint",this._lang)}
    >
      <title>${a("battery_fleet_sparkline_hint",this._lang)}</title>
      <line class="bf-spark-th" x1="0" y1=${j} x2=${i} y2=${j}></line>
      <polyline class="bf-spark-line" points=${y}></polyline>
      ${p!==null?r`<line
            class="bf-spark-proj"
            x1=${O(v(n))}
            y1=${O(f(M))}
            x2=${O(v(p))}
            y2=${j}
          ></line>`:h}
    </svg>`}static _storedSort(){return Z(A.batteryRosterSort)==="name"?"name":"urgency"}_setSort(t){this._rosterSort=t,V(A.batteryRosterSort,t)}_sortedRoster(t){let e=this._typeFilter===null?t:t.filter(s=>s.battery_type===this._typeFilter);if(this._rosterSort==="name")return e;let i=s=>s.status==="low"?-1e3+(s.level??101)/101:s.days_until??1/0;return[...e].sort((s,o)=>i(s)-i(o)||s.device_name.localeCompare(o.device_name))}_predictedDate(t){return this._fmtDate(Date.now()+t*864e5)}_fmtDate(t){return G(wt(new Date(t)),this._lang)}_shoppingLine(t){return Object.entries(t).map(([e,i])=>r`<button
        class="bf-type-chip ${this._typeFilter===e?"bf-type-chip-active":""}"
        title=${a("battery_fleet_filter_type",this._lang)}
        @click=${()=>this._toggleTypeFilter(e)}
      >
        ${i}× ${e}
      </button>`)}_toggleTypeFilter(t){if(this._typeFilter=this._typeFilter===t?null:t,this._typeFilter!==null){let e=this.shadowRoot?.querySelector("details.bf-roster");e&&!e.open&&(e.open=!0)}}async _recordJump(t,e){await this._act({type:"maintenance_supporter/battery_fleet/record_replacement",entity_id:t,replaced_at:new Date(e.at*1e3).toISOString()},()=>{this._recorded=[...this._recorded,t]})}_levelBar(t){let e=t.level;if(e==null)return h;let i=t.low_threshold??20,s=e<=i?"bad":e<=i+20?"warn":"good";return r`<span class="bf-bar" aria-hidden="true"
      ><span class="bf-bar-fill bf-bar-${s}" style="width: ${Math.min(100,Math.max(0,e))}%"></span
    ></span>`}_jumpButton(t,e){let i=this._history?.[t.entity_id]?.jump;return!i||this._recorded.includes(t.entity_id)?h:r`<button
      class="bf-mark bf-jump"
      title=${a("battery_fleet_record_replacement",e).replace("{date}",this._fmtDate(i.at*1e3))}
      .disabled=${this._marking}
      @click=${()=>this._recordJump(t.entity_id,i)}
    >
      <ha-icon icon="mdi:calendar-sync"></ha-icon>
    </button>`}_renderRow(t,e,i){let s=t.available===!1?r`<span class="bf-offline">${a("battery_fleet_offline",e)}</span>`:t.no_sensor?r`<span class="bf-offline bf-nosensor">${a("battery_fleet_no_sensor",e)}</span>`:h,o=r`<span class="bf-type">${t.quantity}× ${t.battery_type}</span>`,c=this._canWrite,n=c&&(i.mark==="always"||t.no_sensor||t.can_mark_replaced);return r`
      <div class="bf-row">
        <span class="bf-dev">${t.device_name}</span>
        ${i.status?r`<span class="bf-status bf-${t.status}"
                >${t.no_sensor&&t.status==="low"?a("battery_fleet_status_due",e):a("battery_fleet_status_"+t.status,e)}</span
              >${o}${s}`:r`${s}${o}`}
        ${i.recharge&&t.rechargeable?r`<span class="bf-recharge" title=${a("battery_fleet_rechargeable",e)}
              ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
            ></span>`:h}
        ${i.sparkline?this._sparkline(t):h}
        ${this._levelBar(t)}
        ${t.level!=null?r`<span class="bf-level">${t.level}%</span>`:h}
        ${n?r`<button
              class="bf-mark${i.mark==="replaced"?" bf-replaced":""}"
              title=${t.rechargeable?a("battery_fleet_mark_recharged",e):a("battery_fleet_mark_one",e)}
              .disabled=${this._marking}
              @click=${()=>this._mark([t.entity_id])}
            >
              <ha-icon icon="mdi:battery-sync"></ha-icon>
            </button>`:h}
        ${i.jump&&c?this._jumpButton(t,e):h}
        ${i.predicted&&t.days_until!=null?r`<span
              class="bf-predicted ${t.predicted_source==="trend"?"bf-trend":""} ${t.forecast_overdue?"bf-overdue":""}"
              title=${this._predictedTitle(t,e)}
              >${t.forecast_overdue?r`<ha-icon icon="mdi:calendar-alert"></ha-icon>`:h}~${this._predictedDate(t.days_until)}</span
            >`:h}
        ${i.exclude&&c?r`<button
              class="bf-mark bf-exclude"
              title=${a("battery_fleet_exclude",e)}
              .disabled=${this._marking}
              @click=${()=>this._setExcluded(t.entity_id,!0)}
            >
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>
            </button>`:h}
      </div>
    `}render(){let t=this._lang;if(this._loading&&this._ov===null)return r`<div class="bf-card"><div class="bf-loading">…</div></div>`;let e=this._ov;if(!e)return this._error?r`<div class="bf-card"><div class="bf-error">${this._error}</div></div>`:h;let i=e.low.length;return r`
      <div class="bf-card">
        <div class="bf-head">
          <ha-icon icon="mdi:battery-alert"></ha-icon>
          <span class="bf-title">${a("battery_fleet_title",t)}</span>
          <span class="bf-count ${i?"bad":"ok"}">${i}</span>
        </div>
        ${this._error?r`<div class="bf-error">${this._error}</div>`:h}

        ${e.configured&&e.task_ok===!1?r`
              <div class="bf-repair">
                <span>${a("battery_fleet_trigger_lost",t)}</span>
                ${this._canWrite?r`<ha-button .disabled=${this._marking} @click=${this._repair}>
                      ${a("battery_fleet_repair",t)}
                    </ha-button>`:h}
              </div>
            `:h}

        ${i===0?r`<div class="bf-empty">${a("battery_fleet_none_low",t)}</div>`:r`
              <div class="bf-shopping">
                <span class="bf-label">${a("battery_fleet_buy_now",t)}</span>
                <span class="bf-list">${this._shoppingLine(e.needs_now)}</span>
              </div>
              <div class="bf-rows">
                ${e.low.map(s=>this._renderRow(s,t,{recharge:!0,mark:"always",exclude:!0}))}
              </div>
              ${this._canWrite?r`<div class="bf-actions">
                    <ha-button .disabled=${this._marking} @click=${this._markAll}>
                      <ha-icon icon="mdi:battery-sync"></ha-icon> ${a("battery_fleet_mark_all",t)}
                    </ha-button>
                  </div>`:h}
            `}

        ${e.soon.length?r`
              <div class="bf-soon">
                <span class="bf-label">${a("battery_fleet_soon",t)}</span>
                <span class="bf-list">${this._shoppingLine(e.needs_soon)}</span>
                <div class="bf-soon-hint">${a("battery_fleet_soon_hint",t)}</div>
              </div>
              <div class="bf-rows bf-soon-rows">
                ${e.soon.map(s=>this._renderRow(s,t,{mark:"replaced",predicted:!0}))}
              </div>
            `:h}
        ${e.all?.length?r`
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
                ${this._canWrite?this._renderRosterSettings(e,t):h}
              </details>
            `:h}
        ${this._renderExcluded(e,t)}
        <div class="bf-total">${a("battery_fleet_total",t).replace("{n}",String(e.total))}</div>
      </div>
    `}_renderRosterSettings(t,e){return r`
                <div class="bf-add">
                  <span class="bf-label">${a("battery_fleet_add",e)}</span>
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{entity:{domain:["sensor","binary_sensor"]}}}
                    .value=${""}
                    @value-changed=${this._addBattery}
                  ></ha-selector>
                  <div class="bf-roster-hint">${a("battery_fleet_add_hint",e)}</div>
                </div>
                <label class="bf-track-self">
                  <input
                    type="checkbox"
                    .checked=${!!t.track_self_charging}
                    .disabled=${this._marking}
                    @change=${this._setTrackSelf}
                  />
                  ${a("battery_fleet_track_self",e)}
                </label>
                <div class="bf-roster-hint">${a("battery_fleet_track_self_hint",e)}</div>
                <label class="bf-track-self bf-due-nosensor">
                  <input
                    type="checkbox"
                    .checked=${t.due_without_sensor!==!1}
                    .disabled=${this._marking}
                    @change=${this._setDueWithoutSensor}
                  />
                  ${a("battery_fleet_due_without_sensor",e)}
                </label>
                <div class="bf-roster-hint">${a("battery_fleet_due_without_sensor_hint",e)}</div>
    `}_renderExcluded(t,e){return r`
        ${t.excluded?.length?r`
              <div class="bf-excluded">
                <span class="bf-label">${a("battery_fleet_excluded",e)}</span>
                ${t.excluded.map(i=>r`
                    <span class="bf-excluded-chip">
                      ${i.device_name}
                      ${this._canWrite?r`<button
                            class="bf-mark"
                            title=${a("battery_fleet_include",e)}
                            .disabled=${this._marking}
                            @click=${()=>this._setExcluded(i.entity_id,!1)}
                          >
                            <ha-icon icon="mdi:eye-outline"></ha-icon>
                          </button>`:h}
                    </span>
                  `)}
              </div>
            `:h}
    `}};lt.styles=N`
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
  `,g([R({attribute:!1})],lt.prototype,"hass",2),g([R({type:Boolean})],lt.prototype,"flat",2),g([_()],lt.prototype,"_ov",2),g([_()],lt.prototype,"_loading",2),g([_()],lt.prototype,"_marking",2),g([_()],lt.prototype,"_error",2),g([_()],lt.prototype,"_history",2),g([_()],lt.prototype,"_rosterSort",2),g([_()],lt.prototype,"_typeFilter",2),g([_()],lt.prototype,"_recorded",2),g([_()],lt.prototype,"_access",2);var De=lt;customElements.get("maintenance-battery-fleet-section")||customElements.define("maintenance-battery-fleet-section",De);var qi=N`
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
`;function Fi(l){let d=window;d.customCards=d.customCards||[],d.customCards.some(t=>t.type===l.type)||d.customCards.push(l)}function Ui(l,d){let t=window,e=`__msCardHeal:${l[0]}`;if(t[e])return;t[e]=!0;let i=0,s=0,o=()=>{if(i+=1,l.some(n=>!customElements.get(n))&&s<3){s+=1;try{let n=new URL(d);n.searchParams.set("heal",`${Date.now()}`),import(n.href).catch(()=>{})}catch{return}}i<20&&window.setTimeout(o,i<8?500:2e3)};window.setTimeout(o,250)}var ct=class extends q{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._objectFilter="";this._configuredObjects=[];this._unsub=null;this._pastHistory={};this._pastHistorySig="";this._pastSeq=0;this._dataLoaded=!1;this._lastConnection=null;this._onHistorySaved=t=>{let e=t.detail;!e?.entry_id||!e.task_id||!(Xe(e.entry_id,e.task_id)in this._pastHistory)||(this._pastHistorySig="",this._loadPastHistories())}}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(t){if(this._config={...t},this._windowDays=t.window_days&&[7,14,30,365].includes(t.window_days)?t.window_days:30,this._pastDays=t.past_days&&[30,90].includes(t.past_days)?t.past_days:0,typeof t.user_filter=="string"&&(this._userFilter=t.user_filter),typeof t.object_filter=="string")this._objectFilter=t.object_filter,this._configuredObjects=[];else if(Array.isArray(t.object_filter)){let e=t.object_filter.filter(i=>typeof i=="string"&&i!=="");this._objectFilter=e.length===1?e[0]:"",this._configuredObjects=e.length>1?e:[]}}getCardSize(){return 6}get _lang(){return K(this.hass)}connectedCallback(){super.connectedCallback(),window.addEventListener("history-entry-saved",this._onHistorySaved)}disconnectedCallback(){if(super.disconnectedCallback(),window.removeEventListener("history-entry-saved",this._onHistorySaved),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._dataLoaded=!1,this._lastConnection=null}updated(t){if(super.updated(t),Dt(this,t),this.hass&&this._pastDays>0&&(t.has("_objects")||t.has("_pastDays"))&&this._loadPastHistories(),t.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[t,e]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=t.objects,this._stats=e,Bt(this._stats.budget)}catch{}}async _loadPastHistories(){let t=new Date;t.setHours(0,0,0,0);let e=Ze(this._objects,t,this._pastDays||30),i=e.map(c=>c.sig).join("|");if(i===this._pastHistorySig)return;this._pastHistorySig=i;let s=++this._pastSeq,o=await Promise.all(e.map(async c=>{try{let n=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:c.entryId,task_id:c.taskId});return[c.key,n.history??[]]}catch{return null}}));s===this._pastSeq&&(this._pastHistory=Object.fromEntries(o.filter(c=>c!==null)))}async _subscribe(){try{let t=await this.hass.connection.subscribeMessage(e=>{let i=e;this._objects=i.objects},{type:"maintenance_supporter/subscribe"});if(!this.isConnected){t();return}this._unsub=t}catch{}}_onEventClick(t){if(t.history_timestamp){this._openHistoryEntry(t);return}this._openTask(t)}_openTask(t){Ai(t.entry_id,t.task_id)||this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:t.entry_id,task_id:t.task_id},bubbles:!0,composed:!0}))}async _openHistoryEntry(t){try{let e=await ce(this.hass);if(!At(this.hass?.user,e.access)){this._openTask(t);return}}catch{}try{let e=await ki(this.hass,t.entry_id,t.task_id,t.history_timestamp);if(!e||Di(e))return}catch{}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:t.entry_id,task_id:t.task_id,original_timestamp:t.history_timestamp},bubbles:!0,composed:!0}))}render(){if(!this.hass)return h;let t=this._lang,e=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,s=this._config.title,o=null;this._userFilter&&(o=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let c=b=>{let it=b.toLowerCase();return this._objects.find($=>$.entry_id===b||$.object.name.toLowerCase()===it)?.entry_id??null},n=new Set(this._configuredObjects.map(c).filter(b=>b!==null)),u=n.size?this._objects.filter(b=>n.has(b.entry_id)):this._objects,p=this._config.show_object_filter!==!1&&u.length>1,m=this._objectFilter?c(this._objectFilter):null,v=m&&u.some(b=>b.entry_id===m)?u.filter(b=>b.entry_id===m):u,f=new Date;f.setHours(0,0,0,0);let y=this._pastDays>0,M=y?ti(v,f,this._pastDays,o,this._pastHistory):Je(v,f,this._windowDays,o),j=wt(f),E=this._windowDays===365||y,x=E?M.filter(b=>b.events.length>0):M,D=b=>{let it=`cal-status-${b.status}`,ht=b.projected?"cal-event-projected":"",$=b.status==="overdue"&&b.days_until_due!=null?` (${jt(b.days_until_due,t)})`:"",L=b.projected&&b.interval_days?r`<span class="cal-event-recur">${b.interval_unit&&b.interval_unit!=="days"?Ue(b.interval_days,b.interval_unit,t):b.interval_days===1?a("cal_every_day",t):a("cal_every_n_days",t).replace("{n}",String(b.interval_days))}</span>`:h,H=b.schedule_type==="sensor_based",z=H?r`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${a("cal_source_sensor",t)}" icon="mdi:trending-up"></ha-icon>`:r`<ha-icon class="cal-event-icon cal-source-time"
                title="${b.adaptive_enabled?a("cal_source_time_adaptive",t):a("cal_source_time",t)}"
                icon="${b.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,W=H&&b.prediction_confidence&&b.status!=="triggered"&&!b.projected?r`<span class="cal-event-prediction cal-conf-${b.prediction_confidence}">
            ${a("cal_predicted",t)} · ${a(`cal_confidence_${b.prediction_confidence}`,t)}
          </span>`:h,X=Xt(this._stats?.budget),U=b.history_type?a(b.history_type,t):a(b.status,t);return r`
        <div class="cal-event ${ht}"
          @click=${()=>this._onEventClick(b)}>
          ${z}
          <span class="cal-status-pill ${it}">${U}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${b.object_name} · ${b.task_name}${$}</div>
            ${W}
            ${L}
          </div>
          ${b.avg_cost!=null&&b.avg_cost>0?r`<span class="cal-event-cost">${Q(b.avg_cost,X,t)}</span>`:h}
        </div>
      `},C=b=>{let[it,ht,$]=b.date.split("-").map(Number),L=new Date(it,ht-1,$),H=b.date===j,z=Ve(L,t,"short"),W=We(L,t,"long");return r`
        <div class="cal-day-row">
          <div class="cal-day-pill ${H?"cal-today":""}">
            <span class="cal-pill-weekday">${z}</span>
            <span class="cal-pill-day">${L.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${W}</span>
              ${H?r`<span class="cal-day-today-badge">${a("today",t)}</span>`:h}
            </div>
            ${b.events.length===0?r`<div class="cal-empty">${a("cal_no_events",t)}</div>`:b.events.map(D)}
          </div>
        </div>
      `};return r`
      <ha-card .header=${s}>
        ${e||i||p?r`
              <div class="cal-controls">
                ${e?r`
                      <div class="cal-window-chips cal-past-chips" title="${a("cal_past_windows",t)}">
                        ${[30,90].map(b=>r`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===b?"active":""}"
                            @click=${()=>{this._pastDays=b}}>
                            −${b}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${a("cal_forward_windows",t)}">
                        ${[7,14,30,365].map(b=>r`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===b?"active":""}"
                            @click=${()=>{this._windowDays=b,this._pastDays=0}}>
                            ${b===365?"+1y":`+${b}d`}
                          </button>
                        `)}
                      </div>
                    `:h}
                ${i?r`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${b=>{this._userFilter=b.target.value}}>
                        <option value="">${a("all_users",t)}</option>
                        <option value="current_user">${a("my_tasks",t)}</option>
                      </select>
                    `:h}
                ${p?r`
                      <select class="cal-user-filter"
                        .value=${m??""}
                        @change=${b=>{this._objectFilter=b.target.value}}>
                        <option value="">${a("all_objects",t)}</option>
                        ${[...u].sort((b,it)=>b.object.name.localeCompare(it.object.name)).map(b=>r`<option value=${b.entry_id} ?selected=${b.entry_id===m}>${b.object.name}</option>`)}
                      </select>
                    `:h}
              </div>
            `:h}
        <div class="cal-rolling">
          ${x.length===0&&E?r`<div class="cal-empty">${a("cal_no_events",t)}</div>`:x.map(C)}
        </div>
      </ha-card>
    `}};ct.styles=[te,qi,N`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],g([R({attribute:!1})],ct.prototype,"hass",2),g([_()],ct.prototype,"_config",2),g([_()],ct.prototype,"_objects",2),g([_()],ct.prototype,"_stats",2),g([_()],ct.prototype,"_windowDays",2),g([_()],ct.prototype,"_pastDays",2),g([_()],ct.prototype,"_userFilter",2),g([_()],ct.prototype,"_objectFilter",2),g([_()],ct.prototype,"_unsub",2),g([_()],ct.prototype,"_pastHistory",2);var xs=[{value:7,key:"cal_editor_window_week"},{value:14,key:"cal_editor_window_fortnight"},{value:30,key:"cal_editor_window_month"},{value:365,key:"cal_editor_window_year"}],ws=[{value:30,key:"cal_editor_window_past_30"},{value:90,key:"cal_editor_window_past_90"}],Lt=class extends q{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}get _lang(){return K(this.hass)}setConfig(t){this._config={...t}}updated(){let t=this._lang;t&&!qe(t)&&at(t).then(()=>this.requestUpdate())}_valueChanged(t,e){let i={...this._config,[t]:e};t==="show_window_chips"&&e===!0&&delete i.show_window_chips,t==="show_user_filter"&&e===!0&&delete i.show_user_filter,t==="show_object_filter"&&e===!0&&delete i.show_object_filter,t==="title"&&(!e||typeof e=="string"&&e.trim()==="")&&delete i.title,t==="user_filter"&&e===""&&delete i.user_filter,this._emit(i)}_windowChanged(t){let e={...this._config};t.startsWith("past-")?(e.past_days=Number(t.slice(5)),delete e.window_days):(e.window_days=Number(t),delete e.past_days),this._emit(e)}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}render(){let t=this._lang,e=this._config.past_days?`past-${this._config.past_days}`:`${this._config.window_days??30}`,i=this._config.show_window_chips!==!1,s=this._config.show_user_filter!==!1,o=this._config.user_filter??"",c=this._config.title??"";return r`
      <div class="editor">
        <div class="row">
          <label for="title">${a("card_title",t)}</label>
          <input
            id="title"
            type="text"
            .value=${c}
            @input=${n=>this._valueChanged("title",n.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">${a("cal_editor_window",t)}</label>
          <select
            id="window"
            @change=${n=>this._windowChanged(n.target.value)}
          >
            ${xs.map(n=>r`<option value="${n.value}" ?selected=${`${n.value}`===e}>${a(n.key,t)}</option>`)}
            ${ws.map(n=>r`<option value="past-${n.value}" ?selected=${`past-${n.value}`===e}>${a(n.key,t)}</option>`)}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">${a("cal_editor_show_chips",t)}</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${i}
            @change=${n=>this._valueChanged("show_window_chips",n.target.checked)}
          />
        </div>
        <div class="hint">${a("cal_editor_chips_hint",t)}</div>
        <div class="row toggle">
          <label for="userf">${a("cal_editor_show_user_filter",t)}</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${s}
            @change=${n=>this._valueChanged("show_user_filter",n.target.checked)}
          />
        </div>
        <div class="row">
          <label for="userv">${a("cal_editor_default_user",t)}</label>
          <select
            id="userv"
            @change=${n=>this._valueChanged("user_filter",n.target.value)}
          >
            <option value="" ?selected=${o===""}>${a("all_users",t)}</option>
            <option value="current_user" ?selected=${o==="current_user"}>
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
            @change=${n=>this._valueChanged("show_object_filter",n.target.checked)}
          />
        </div>
        <div class="hint">${a("cal_editor_object_hint",t)}</div>
      </div>
    `}};Lt.styles=N`
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
  `,g([R({attribute:!1})],Lt.prototype,"hass",2),g([_()],Lt.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",ct);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",Lt);Ui(["maintenance-supporter-calendar-card"],import.meta.url);Fi({type:"maintenance-supporter-calendar-card",name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});var dt=class extends q{constructor(){super(...arguments);this.objects=[];this._summary=null;this._loaded=!1;this._busy=!1;this._error="";this._query="";this._results=[];this._expanded=!1;this._initiallyLoaded=!1;this._searchTimer=0;this._searchSeq=0}get _lang(){return K(this.hass)}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._initiallyLoaded&&(this._initiallyLoaded=!0,this._load(),at(this._lang).then(()=>this.requestUpdate()))}async _load(){let t=await P(this,{type:"maintenance_supporter/documents/storage"},{busy:e=>{this._busy=e},onError:e=>{this._error=e}});this._loaded=!0,t!==void 0&&(this._summary=t,this._error="")}_nameFor(t){return this.objects.find(i=>i.object?.id===t)?.object?.name||t.slice(0,8)}_entryFor(t){return this.objects.find(e=>e.object?.id===t)?.entry_id}_toggle(){this._expanded=!this._expanded}_openObject(t){this.dispatchEvent(new CustomEvent("open-object",{detail:{entry_id:t},bubbles:!0,composed:!0}))}_onSearch(t){this._query=t.target.value,clearTimeout(this._searchTimer),this._searchTimer=window.setTimeout(()=>{this._doSearch()},250)}async _doSearch(){let t=this._query.trim(),e=++this._searchSeq;if(!t){this._results=[];return}let i="",s=await P(this,{type:"maintenance_supporter/documents/search",query:t},{onError:o=>{i=o}});if(e===this._searchSeq){if(s===void 0){this._error=i,this._results=[];return}this._results=s?.results||[]}}async _openResult(t){if(t.kind==="weblink"){st(t.url)&&window.open(t.url,"_blank","noopener");return}await P(this,()=>xt(this.hass,t.id),{onError:e=>{this._error=e}})}_renderResult(t,e){return r`
      <div class="obj-row result-row" title=${a("doc_open",e)} @click=${()=>this._openResult(t)}>
        <ha-icon icon=${t.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"}></ha-icon>
        <div class="result-info">
          <div class="result-title">${rt(t)}</div>
          <div class="result-obj">${t.object_name}</div>
        </div>
        <ha-icon class="result-open" icon=${t.kind==="weblink"?"mdi:open-in-new":"mdi:eye-outline"}></ha-icon>
      </div>
    `}render(){if(!this._loaded||!this._summary)return h;let t=this._summary;if(!t.document_count)return h;let e=this._lang,i=Object.entries(t.by_object??{}).filter(([,s])=>s.files>0||s.links>0).map(([s,o])=>({id:s,name:this._nameFor(s),entry:this._entryFor(s),...o})).sort((s,o)=>o.bytes-s.bytes);return r`
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
                ${t.dedup_savings_bytes>0?r`<span class="saved">−${vt(t.dedup_savings_bytes,e)}</span>`:h}
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

          ${this._expanded?r`
                <div class="body">
                  <div class="totals">
                    <div class="stat">
                      <div class="stat-value">${vt(t.total_bytes,e)}</div>
                      <div class="stat-label">
                        <ha-icon icon="mdi:file-document-outline"></ha-icon> ${t.file_count}
                        <ha-icon icon="mdi:link-variant"></ha-icon> ${t.link_count}
                      </div>
                    </div>
                    ${t.dedup_savings_bytes>0?r`<div class="stat">
                          <div class="stat-value saved">−${vt(t.dedup_savings_bytes,e)}</div>
                          <div class="stat-label">${a("doc_storage_saved",e)}</div>
                        </div>`:h}
                  </div>

                  ${t.search_index&&t.search_index.total>0?r`<div class="index-status">
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

                  ${this._error?r`<div class="error">${this._error}</div>`:h}

                  ${this._query.trim()?this._results.length?r`<div class="obj-list">${this._results.map(s=>this._renderResult(s,e))}</div>`:r`<div class="search-empty">${a("doc_search_none",e)}</div>`:i.length?r`<div class="obj-list">${i.map(s=>this._renderObjRow(s,e))}</div>`:h}
                </div>
              `:h}
        </div>
      </ha-card>
    `}_renderObjRow(t,e){let i=t.entry;return r`
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
          ${t.files>0?r`<ha-icon icon="mdi:file-document-outline"></ha-icon>${t.files}`:h}
          ${t.links>0?r`<ha-icon icon="mdi:link-variant"></ha-icon>${t.links}`:h}
        </span>
        <span class="obj-size">${vt(t.bytes,e)}</span>
        ${i?r`<ha-icon class="obj-go" icon="mdi:chevron-right"></ha-icon>`:h}
      </div>
    `}};dt.styles=N`
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
    /* Phone width (2026-09-27): the size moves to a line of its own before
       it could slide under the refresh button; only the title shortens. */
    .toggle {
      display: flex; flex-wrap: wrap; align-items: center; gap: 2px 8px; flex: 1; min-width: 0;
      background: none; border: none; padding: 4px 0; margin: 0; cursor: pointer;
      font: inherit; color: var(--primary-text-color); text-align: left;
    }
    .toggle:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; border-radius: 6px; }
    .chevron { --mdc-icon-size: 22px; color: var(--secondary-text-color, #888); flex: none; }
    .title-text {
      font-size: 16px; font-weight: 500; min-width: 0;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .header-summary {
      margin-left: auto; display: flex; align-items: center; gap: 8px; flex: none;
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
  `,g([R({attribute:!1})],dt.prototype,"hass",2),g([R({attribute:!1})],dt.prototype,"objects",2),g([_()],dt.prototype,"_summary",2),g([_()],dt.prototype,"_loaded",2),g([_()],dt.prototype,"_busy",2),g([_()],dt.prototype,"_error",2),g([_()],dt.prototype,"_query",2),g([_()],dt.prototype,"_results",2),g([_()],dt.prototype,"_expanded",2);customElements.get("maintenance-storage-section-card")||customElements.define("maintenance-storage-section-card",dt);var ks=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"],gt=class extends q{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId="";this._values=new Array(12).fill("");this._save=async()=>{let t=this._buildOverrides();t!==null&&await this._send(t)!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved")))};this._clearAll=async()=>{await this._send({})!==void 0&&(this._values=new Array(12).fill(""),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved")))}}get _lang(){return K(this.hass)}open(t,e,i){if(this._entryId=t,this._taskId=e,this._values=new Array(12).fill(""),i)for(let[s,o]of Object.entries(i)){let c=parseInt(s,10);c>=1&&c<=12&&typeof o=="number"&&(this._values[c-1]=o.toString())}this._error="",this._open=!0}_close(){this._open=!1}_buildOverrides(){let t={};for(let e=0;e<12;e++){let i=this._values[e].trim();if(!i)continue;let s=parseFloat(i);if(Number.isNaN(s))return this._error=`${a("month_"+["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][e],this._lang)}: ${a("seasonal_override_invalid",this._lang)}`,null;if(s<Ut[0]||s>Ut[1])return this._error=a("seasonal_override_range",this._lang),null;t[e+1]=s}return t}_send(t){return this._error="",P(this,{type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:t},{busy:e=>{this._loading=e},fallbackKey:"save_error",onError:e=>{this._error=e}})}render(){if(!this._open)return r``;let t=this._lang;return r`
      <ha-dialog open @closed=${this._close} heading="${a("seasonal_overrides_title",t)}">
        <div class="content">
          <p class="hint">${a("seasonal_overrides_hint",t)}</p>
          ${this._error?r`<div class="error">${this._error}</div>`:h}
          <div class="months">
            ${ks.map((e,i)=>r`
              <label class="month">
                <span class="mn">${a(e,t)}</span>
                <input type="number" step="0.1" min=${Ut[0]} max=${Ut[1]}
                  placeholder="1.0"
                  .value=${this._values[i]}
                  @input=${s=>{let o=[...this._values];o[i]=s.target.value,this._values=o}} />
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
    `}};gt.styles=N`
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
  `,g([R({attribute:!1})],gt.prototype,"hass",2),g([_()],gt.prototype,"_open",2),g([_()],gt.prototype,"_loading",2),g([_()],gt.prototype,"_error",2),g([_()],gt.prototype,"_entryId",2),g([_()],gt.prototype,"_taskId",2),g([_()],gt.prototype,"_values",2);customElements.get("maintenance-seasonal-overrides-dialog")||customElements.define("maintenance-seasonal-overrides-dialog",gt);var pt=class extends q{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._groupId=null;this._name="";this._description="";this._selected=new Set;this._toggleTask=(t,e)=>{let i=`${t}:${e}`,s=new Set(this._selected);s.has(i)?s.delete(i):s.add(i),this._selected=s};this._save=async()=>{let t=this._name.trim();if(!t){this._error=a("group_name_required",this._lang);return}this._error="";let e=this._buildTaskRefs();await P(this,this._groupId?{type:"maintenance_supporter/group/update",group_id:this._groupId,name:t,description:this._description,task_refs:e}:{type:"maintenance_supporter/group/create",name:t,description:this._description,task_refs:e},{busy:s=>{this._loading=s},fallbackKey:"save_error",onError:s=>{this._error=s}})!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("group-saved")))}}get _lang(){return K(this.hass)}openCreate(){this._reset(),this._open=!0}openEdit(t,e){this._reset(),this._groupId=t,this._name=e.name,this._description=e.description||"",this._selected=new Set(e.task_refs.map(i=>`${i.entry_id}:${i.task_id}`)),this._open=!0}_reset(){this._groupId=null,this._name="",this._description="",this._selected=new Set,this._error=""}_close(){this._open=!1}_buildTaskRefs(){return[...this._selected].map(t=>{let[e,i]=t.split(":",2);return{entry_id:e,task_id:i}})}render(){if(!this._open)return r``;let t=this._lang,e=this._groupId?a("edit_group",t):a("new_group",t);return r`
      <ha-dialog open @closed=${this._close} heading="${e}">
        <div class="content">
          ${this._error?r`<div class="error">${this._error}</div>`:h}
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
          ${this.objects.length===0?r`<div class="hint">${a("no_objects",t)}</div>`:r`
              <div class="objects">
                ${[...this.objects].sort((i,s)=>i.object.name.localeCompare(s.object.name)).map(i=>r`
                  <div class="object-block">
                    <div class="object-name">${i.object.name}</div>
                    ${i.tasks.length===0?r`<div class="hint small">${a("no_tasks_short",t)}</div>`:[...i.tasks].sort((s,o)=>s.name.localeCompare(o.name)).map(s=>{let o=`${i.entry_id}:${s.id}`,c=this._selected.has(o);return r`
                          <label class="task-row">
                            <input type="checkbox"
                              .checked=${c}
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
    `}};pt.styles=N`
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
  `,g([R({attribute:!1})],pt.prototype,"hass",2),g([R({attribute:!1})],pt.prototype,"objects",2),g([_()],pt.prototype,"_open",2),g([_()],pt.prototype,"_loading",2),g([_()],pt.prototype,"_error",2),g([_()],pt.prototype,"_groupId",2),g([_()],pt.prototype,"_name",2),g([_()],pt.prototype,"_description",2),g([_()],pt.prototype,"_selected",2);customElements.get("maintenance-group-dialog")||customElements.define("maintenance-group-dialog",pt);var ft=class extends q{constructor(){super(...arguments);this._open=!1;this._busy=!1;this._error="";this._name="";this._views=[];this._filters=null;this._localeReady=!1;this._save=async()=>{let t=this._name.trim();if(!t||this._busy||!this._filters)return;let e=await this._runWs({type:"maintenance_supporter/views/save",name:t,filters:this._filters});e!==void 0&&(this._name="",this._emitChanged(e?.views||[]))};this._delete=async t=>{if(this._busy)return;let e=await this._runWs({type:"maintenance_supporter/views/delete",view_id:t});e!==void 0&&this._emitChanged(e?.views||[])}}get _lang(){return K(this.hass)}updated(t){t.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,at(this._lang).then(()=>this.requestUpdate()))}async open(t,e){this._open=!0,this._error="",this._name="",this._filters=t,this._views=e}_close(){this._open=!1}_emitChanged(t){this._views=t,this.dispatchEvent(new CustomEvent("saved-views-changed",{bubbles:!0,composed:!0,detail:{views:t}}))}_runWs(t){return this._error="",P(this,t,{busy:e=>{this._busy=e},onError:e=>{this._error=e}})}render(){if(!this._open)return r``;let t=this._lang;return r`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${e=>e.stopPropagation()}>
          <div class="title">${a("views_dialog_title",t)}</div>
          <div class="hint">${a("views_dialog_hint",t)}</div>
          ${this._error?r`<div class="error">${this._error}</div>`:h}

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

          ${this._views.length===0?r`<div class="empty">${a("views_none_yet",t)}</div>`:r`
                <div class="list">
                  ${this._views.map(e=>r`
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
    `}};ft.styles=N`
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
  `,g([R({attribute:!1})],ft.prototype,"hass",2),g([_()],ft.prototype,"_open",2),g([_()],ft.prototype,"_busy",2),g([_()],ft.prototype,"_error",2),g([_()],ft.prototype,"_name",2),g([_()],ft.prototype,"_views",2);customElements.get("maintenance-saved-views-dialog")||customElements.define("maintenance-saved-views-dialog",ft);var $s=60,js=20,Vi=30,Ts={approaching:"\u2197",stable:"\u2192",easing:"\u2198"};function Ae(l,d){let t=l.trigger_config;if(!t?.entity_id)return null;let e,i=t.type||"threshold";if(i==="threshold")if(t.trigger_above!=null)e=1;else if(t.trigger_below!=null)e=-1;else return null;else if(i==="counter"||i==="runtime"||i==="state_change")e=1;else return null;let s=d.get(t.entity_id)||[],o=i==="runtime"||i==="state_change",c=s.length>=2?s.map(y=>({ts:y.ts,val:y.val})):o?[]:(l.history||[]).filter(y=>y.trigger_value!=null).map(y=>({ts:new Date(y.timestamp).getTime(),val:y.trigger_value}));if(l.trigger_current_value!=null&&(c=[...c,{ts:Date.now(),val:l.trigger_current_value}]),c.length<2)return null;c.sort((y,M)=>y.ts-M.ts);let n=c.map(y=>y.val),u=Math.max(...n)-Math.min(...n),p=n[n.length-1]-n[0],m=t.trigger_delta_mode&&l.trigger_baseline_value!=null&&t.trigger_target_value!=null?l.trigger_baseline_value+t.trigger_target_value:t.trigger_target_value,v=i==="threshold"?t.trigger_above??t.trigger_below:i==="counter"?m:i==="runtime"?t.trigger_runtime_hours:t.trigger_target_changes,f=typeof v=="number"?Math.max(Math.abs(v-n[0]),u):u;return f===0||Math.abs(p)<f*(typeof v=="number"?.05:.15)?"stable":Math.sign(p)===e?"approaching":"easing"}function ze(l,d){let t=l.trigger_config??null;if(!t)return h;let e=t.type||"threshold",i=l.trigger_entity_info?.unit_of_measurement??"",s=0,o="";if(e==="threshold"){let u=l.trigger_current_value??null;if(u==null)return h;let p=t.trigger_above,m=t.trigger_below;if(p!=null&&m!=null){let v=(p+m)/2,f=Math.abs(p-m)/2||1;s=Math.min(100,Math.max(0,Math.abs(u-v)/f*100));let y=Math.abs(u-p)<=Math.abs(u-m)?p:m;o=`${Y(u,d?.lang,1)} / ${Y(y,d?.lang)} ${i}`}else if(p!=null){let v=l.trigger_entity_info?.min,f=p>0?0:v!=null&&v<p?v:p<0?2*p:-100,y=p-f||1;s=Math.min(100,Math.max(0,(u-f)/y*100)),o=`${Y(u,d?.lang,1)} / ${Y(p,d?.lang)} ${i}`}else if(m!=null){let v=l.trigger_entity_info?.max,f=v!=null&&v>m?v:m>0?m*2:m<0?0:100,y=f-m||1;s=Math.min(100,Math.max(0,(f-u)/y*100)),o=`${Y(u,d?.lang,1)} / ${Y(m,d?.lang)} ${i}`}else if(t.trigger_equals!=null||t.trigger_not_equals!=null){let v=t.trigger_equals!=null?`= ${t.trigger_equals}`:`\u2260 ${t.trigger_not_equals}`;o=`${Y(u,d?.lang,1)} (${v}${i?` ${i}`:""})`,s=l.trigger_active?100:0}else return h}else if(e==="counter"){let u=t.trigger_target_value||1,p;if(t.trigger_delta_mode?(p=l.trigger_current_delta??null,p==null&&l.trigger_baseline_value!=null&&l.trigger_current_value!=null&&(p=l.trigger_current_value-l.trigger_baseline_value)):p=l.trigger_current_value??null,p==null)return h;s=Math.min(100,Math.max(0,p/u*100)),o=`${Y(p,d?.lang,1)} / ${Y(u,d?.lang)} ${i}`}else if(e==="state_change"){let u=t.trigger_target_changes||1,p=l.trigger_current_value??null;if(p==null)return h;s=Math.min(100,Math.max(0,p/u*100)),o=`${Y(p,d?.lang,0)} / ${Y(u,d?.lang,0)}`}else if(e==="runtime"){let u=t.trigger_runtime_hours||100,p=l.trigger_current_value??null;if(p==null)return h;s=Math.min(100,Math.max(0,p/u*100)),o=`${Y(p,d?.lang,1)}h / ${Y(u,d?.lang)}h`}else if(e==="compound"){let u=t.compound_logic||t.operator||"AND",p=t.conditions?.length||0;o=`${u} (${p})`,s=l.trigger_active?100:0}else return h;if(l.battery_fleet_task&&e==="threshold"&&l.trigger_current_value!=null){let u=Math.round(l.trigger_current_value),p=t.trigger_above??0;s=u>p?100:p>0?Math.max(0,u/(p+1)*100):0,o=a("battery_fleet_progress",d?.lang??"en").replace("{n}",Y(u,d?.lang,0))}let c=s>=100,n=s>90?"var(--error-color, #f44336)":s>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return r`
    <div class="trigger-progress">
      <div class="trigger-progress-bar">
        <div class="trigger-progress-fill${c?" overflow":""}" style="width:${s}%;background:${n}"></div>
      </div>
      <span class="trigger-progress-label">${o}${d?.trend?r` <i class="trend-arrow trend-${d.trend}" title="${a(`trend_${d.trend}`,d.lang??"en")}" aria-label="${a(`trend_${d.trend}`,d.lang??"en")}">${Ts[d.trend]}</i>`:h}</span>
    </div>
  `}function Ie(l,d,t){if(!l.trigger_config?.entity_id)return h;let e=l.trigger_config.entity_id,i=d.get(e)||[],s=[];if(i.length>=2)s=i.map(C=>({ts:C.ts,val:C.val}));else{if(!l.history)return h;for(let C of l.history)C.trigger_value!=null&&s.push({ts:new Date(C.timestamp).getTime(),val:C.trigger_value})}if(l.trigger_current_value!=null&&s.push({ts:Date.now(),val:l.trigger_current_value}),s.length<2)return h;s.sort((C,b)=>C.ts-b.ts);let o=$s,c=js,n=s.map(C=>C.val),u=Math.min(...n),p=Math.max(...n),m=p-u||1;u-=m*.1,p+=m*.1;let v=s[0].ts,y=s[s.length-1].ts-v||1,M=C=>(C-v)/y*o,j=C=>2+(1-(C-u)/(p-u))*(c-4),E=s;if(E.length>Vi){let C=Math.ceil(E.length/Vi);E=E.filter((b,it)=>it%C===0||it===E.length-1)}let x=E.map(C=>`${O(M(C.ts))},${O(j(C.val))}`).join(" "),D=l.trigger_active?"var(--error-color, #f44336)":"var(--primary-color)";return r`
    <svg class="mini-sparkline" viewBox="0 0 ${o} ${c}" preserveAspectRatio="none" role="img" aria-label="${a("chart_mini_sparkline",t)}">
      <polyline points="${x}" fill="none" stroke="${D}" stroke-width="1.5" stroke-linejoin="round" />
    </svg>
  `}function Wi(l,d){let t=d;if(l.days_until_due==null||!l.interval_days||l.interval_days<=0)return h;let{pct:e,overflow:i}=ae(l.interval_days,l.days_until_due,l.interval_unit),s="var(--success-color, #4caf50)";return l.status==="overdue"?s="var(--error-color, #f44336)":l.status==="due_soon"&&(s="var(--warning-color, #ff9800)"),r`
    <div class="days-progress">
      <div class="days-progress-labels">
        <span>${l.last_performed?`${a("last_performed",t)}: ${G(l.last_performed,t)}`:""}</span>
        <span>${l.next_due?`${a("next_due",t)}: ${G(l.next_due,t)}`:""}</span>
      </div>
      <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(e)}" aria-valuemin="0" aria-valuemax="100" aria-label="${a("days_progress",t)}">
        <div class="days-progress-fill${i?" overflow":""}" style="width:${e}%;background:${s}"></div>
      </div>
      <div class="days-progress-text">${jt(l.days_until_due,t)}</div>
    </div>
  `}var fe=210,mt=46,kt=14,$t=12,Ki=14,Ss=20+Ki,Es=[{days:7,key:"chart_range_7d"},{days:30,key:"chart_range_30d"},{days:90,key:"chart_range_90d"},{days:365,key:"chart_range_1y"}],et=class extends q{constructor(){super(...arguments);this.points=[];this.events=[];this.unit="";this.lang="en";this.thresholdAbove=null;this.thresholdBelow=null;this.targetValue=null;this.forceZero=!1;this.projection=null;this.rangeDays=30;this.showRange=!0;this.busy=!1;this.hideOutliers=!1;this.showOutlierToggle=!0;this._width=0;this._hover=null;this._ro=null}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(t=>{let e=Math.floor(t[0]?.contentRect?.width||0);e&&Math.abs(e-this._width)>2&&(this._width=e)}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=null}_emitRange(t){t!==this.rangeDays&&this.dispatchEvent(new CustomEvent("range-change",{detail:{days:t},bubbles:!0,composed:!0}))}_toggleOutliers(){this.dispatchEvent(new CustomEvent("outlier-toggle",{detail:{hide:!this.hideOutliers},bubbles:!0,composed:!0}))}render(){let t=this._width||320,e=[...this.points].sort((s,o)=>s.ts-o.ts),i=this.lang;return r`
      <div class="chart-wrap">
        ${this.showRange?r`<div class="range-chips" role="group">
              ${this.showOutlierToggle?r`<button
                    class="range-chip outlier-chip ${this.hideOutliers?"active":""}"
                    ?disabled=${this.busy}
                    title=${a("hide_outliers",i)}
                    @click=${()=>this._toggleOutliers()}
                  ><ha-icon icon="mdi:filter-variant"></ha-icon></button>`:h}
              ${Es.map(s=>r`<button
                  class="range-chip ${this.rangeDays===s.days?"active":""}"
                  ?disabled=${this.busy}
                  @click=${()=>this._emitRange(s.days)}
                >${a(s.key,i)}</button>`)}
            </div>`:h}
        ${e.length<2?r`<div class="chart-empty">
              <ha-icon icon="mdi:chart-line"></ha-icon> ${a("loading_chart",i)}
            </div>`:this._renderSvg(t,e)}
      </div>
    `}_renderSvg(t,e){let i=this.lang,s=t-mt-kt,o=fe-Ss,c=o-$t,n=1/0,u=-1/0;for(let S of e)n=Math.min(n,S.min??S.val),u=Math.max(u,S.max??S.val);this.thresholdAbove!=null&&(n=Math.min(n,this.thresholdAbove),u=Math.max(u,this.thresholdAbove)),this.thresholdBelow!=null&&(n=Math.min(n,this.thresholdBelow),u=Math.max(u,this.thresholdBelow)),this.targetValue!=null&&(n=Math.min(n,this.targetValue),u=Math.max(u,this.targetValue)),this.forceZero&&(n=Math.min(n,0));let p=(u-n||1)*.06,m=this.forceZero&&n>=0?0:n-p,{ticks:v,niceMin:f,niceMax:y}=Vt(m,u+p,4);this.forceZero&&n>=0&&f<0&&(f=0,v=v.filter(S=>S>=0));let M=e[0].ts,j=this.projection&&this.projection.length===2?this.projection[1].ts:null,E=j!=null?Math.max(e[e.length-1].ts,j):e[e.length-1].ts,x=E-M||1,D=de(M,E),C=S=>mt+(S-M)/x*s,b=S=>$t+(1-(S-f)/(y-f||1))*c,it=e.map(S=>`${O(C(S.ts))},${O(b(S.val))}`).join(" "),ht=`M${O(C(e[0].ts))},${o} `+e.map(S=>`L${O(C(S.ts))},${O(b(S.val))}`).join(" ")+` L${O(C(e[e.length-1].ts))},${o} Z`,$="",L=e.filter(S=>S.min!=null&&S.max!=null);if(L.length>=2){let S=L.map(I=>`${O(C(I.ts))},${O(b(I.max))}`),T=[...L].reverse().map(I=>`${O(C(I.ts))},${O(b(I.min))}`);$=`M${S[0]} `+S.slice(1).map(I=>`L${I}`).join(" ")+` L${T.join(" L")} Z`}let H=[];if(this.thresholdBelow!=null){let S=b(this.thresholdBelow);H.push({y:S,h:Math.max(0,o-S),lineY:S,label:`\u25BC ${_t(this.thresholdBelow,i)}`,labelY:Math.min(o-4,S+13)})}if(this.thresholdAbove!=null){let S=b(this.thresholdAbove);H.push({y:$t,h:Math.max(0,S-$t),lineY:S,label:`\u25B2 ${_t(this.thresholdAbove,i)}`,labelY:Math.max($t+11,S-5)})}let z=e[e.length-1],W=(this.events||[]).filter(S=>S.ts>=M&&S.ts<=E),X=pe(M,E,Math.max(2,Math.min(5,Math.floor(s/110)+1))),U=this._hover;return r`
      <div class="svg-holder">
        <svg
          class="chart-svg"
          viewBox="0 0 ${t} ${fe}"
          width=${t}
          height=${fe}
          role="img"
          aria-label=${a("chart_sparkline",i)}
          @pointermove=${S=>this._onPointer(S,e,C,b,t)}
          @pointerdown=${S=>this._onPointer(S,e,C,b,t)}
          @pointerleave=${()=>this._hover=null}
        >
          <defs>
            <clipPath id="plot"><rect x="${mt}" y="${$t}" width="${s}" height="${c}" /></clipPath>
            ${H.length?J`<clipPath id="danger">${H.map(S=>J`<rect x="${mt}" y="${O(S.y)}" width="${s}" height="${O(S.h)}" />`)}</clipPath>`:h}
            <!-- Diagonal hatch so the danger zone reads without relying on the
                 red tint alone (dark-theme contrast + colour-blind support). -->
            <pattern id="dangerHatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
              <rect width="7" height="7" fill="var(--error-color, #f44336)" opacity="0.10" />
              <line x1="0" y1="0" x2="0" y2="7" stroke="var(--error-color, #f44336)" stroke-width="1.4" opacity="0.5" />
            </pattern>
          </defs>

          ${v.map(S=>{let T=b(S);return T<$t-1||T>o+1?h:J`
              <line x1="${mt}" y1="${O(T)}" x2="${t-kt}" y2="${O(T)}"
                stroke="var(--divider-color)" stroke-width="1" opacity="0.6" />
              <text x="${mt-7}" y="${O(T+3.5)}" text-anchor="end" class="tick-label">${_t(S,i)}</text>`})}

          ${H.map(S=>J`<rect x="${mt}" y="${O(S.y)}" width="${s}" height="${O(S.h)}"
              fill="url(#dangerHatch)" />`)}

          ${$?J`<path d="${$}" fill="var(--primary-color)" opacity="0.08" clip-path="url(#plot)" />`:h}
          <path d="${ht}" fill="var(--primary-color)" opacity="0.10" clip-path="url(#plot)" />
          <polyline points="${it}" fill="none" stroke="var(--primary-color)" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" clip-path="url(#plot)" />
          ${H.length?J`<polyline points="${it}" fill="none" stroke="var(--error-color, #f44336)" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" clip-path="url(#danger)" />`:h}

          ${H.map(S=>J`
              <line x1="${mt}" y1="${O(S.lineY)}" x2="${t-kt}" y2="${O(S.lineY)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${t-kt-4}" y="${O(S.labelY)}" text-anchor="end" class="zone-label">${S.label}</text>`)}

          ${this.targetValue!=null?J`<line x1="${mt}" y1="${O(b(this.targetValue))}" x2="${t-kt}" y2="${O(b(this.targetValue))}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${t-kt-4}" y="${O(b(this.targetValue)-5)}" text-anchor="end" class="zone-label">◆ ${_t(this.targetValue,i)} ${this.unit}</text>`:h}

          ${this.projection&&this.projection.length===2?J`<line x1="${O(C(this.projection[0].ts))}" y1="${O(b(this.projection[0].val))}"
                x2="${O(Math.min(C(this.projection[1].ts),t-kt))}" y2="${O(b(Math.max(f,Math.min(y,this.projection[1].val))))}"
                stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.8" />`:h}

          ${X.map((S,T)=>{let I=C(S),Ot=T===0?"start":T===X.length-1?"end":"middle";return J`<text x="${O(I)}" y="${fe-5}" text-anchor="${Ot}" class="tick-label">${zt(S,i,D)}</text>`})}

          <line x1="${mt}" y1="${o}" x2="${t-kt}" y2="${o}" stroke="var(--divider-color)" stroke-width="1" />

          ${W.map(S=>{let T=C(S.ts),I=S.type==="completed"?"var(--success-color, #4caf50)":S.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return J`
              <line x1="${O(T)}" y1="${$t}" x2="${O(T)}" y2="${o}" stroke="${I}" stroke-width="1" opacity="0.14" />
              <rect x="${O(T-1.5)}" y="${o+3}" width="3" height="${Ki-6}" rx="1.5" fill="${I}">
                <title>${Te(S.ts,i)}</title>
              </rect>`})}

          ${U?J`
                <line x1="${O(U.x)}" y1="${$t}" x2="${O(U.x)}" y2="${o}"
                  stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.7" />
                <circle cx="${O(U.x)}" cy="${O(U.y)}" r="4.5" fill="var(--primary-color)"
                  stroke="var(--card-background-color, #fff)" stroke-width="2" />`:J`<circle cx="${O(C(z.ts))}" cy="${O(b(z.val))}" r="4" fill="var(--primary-color)"
                stroke="var(--card-background-color, #fff)" stroke-width="1.5" />`}
        </svg>
        ${U?r`<div
              class="hover-chip"
              style="left:${Math.min(Math.max(U.x,70),t-70)}px"
            >
              <div class="hover-date">${Te(U.p.ts,i)}</div>
              <div class="hover-val">
                ${Et(U.p.val,this.unit,i)}
                ${U.p.min!=null&&U.p.max!=null?r`<span class="hover-range">(${_t(U.p.min,i)}–${_t(U.p.max,i)})</span>`:h}
              </div>
            </div>`:h}
      </div>
    `}_onPointer(t,e,i,s,o){let n=t.currentTarget.getBoundingClientRect(),u=(t.clientX-n.left)/n.width*o;if(u<mt-8||u>o-kt+8){this._hover=null;return}let p=e[0],m=1/0;for(let v of e){let f=Math.abs(i(v.ts)-u);f<m&&(m=f,p=v)}this._hover={x:i(p.ts),y:s(p.val),p}}};et.styles=N`
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
  `,g([R({attribute:!1})],et.prototype,"points",2),g([R({attribute:!1})],et.prototype,"events",2),g([R()],et.prototype,"unit",2),g([R()],et.prototype,"lang",2),g([R({attribute:!1})],et.prototype,"thresholdAbove",2),g([R({attribute:!1})],et.prototype,"thresholdBelow",2),g([R({attribute:!1})],et.prototype,"targetValue",2),g([R({type:Boolean})],et.prototype,"forceZero",2),g([R({attribute:!1})],et.prototype,"projection",2),g([R({attribute:!1})],et.prototype,"rangeDays",2),g([R({type:Boolean})],et.prototype,"showRange",2),g([R({type:Boolean})],et.prototype,"busy",2),g([R({type:Boolean})],et.prototype,"hideOutliers",2),g([R({type:Boolean})],et.prototype,"showOutlierToggle",2),g([_()],et.prototype,"_width",2),g([_()],et.prototype,"_hover",2);customElements.get("maintenance-trigger-chart")||customElements.define("maintenance-trigger-chart",et);function Gi(l){let d=(l??"").trim().toLowerCase();return d==="on"||d==="open"||d==="true"?1:d==="off"||d==="closed"||d==="false"?0:null}function Rs(l,d,t){if(l.length<2)return null;let e=t.now??Date.now(),i=Math.max(0,d.trigger_for_minutes??0)*6e4,s=d.trigger_from_state?Gi(d.trigger_from_state):null,o=d.trigger_to_state?Gi(d.trigger_to_state):null;if(d.trigger_from_state&&s===null||d.trigger_to_state&&o===null)return null;let c=[...l].sort((x,D)=>x.ts-D.ts),n=[];for(let x of c){let D=n[n.length-1];(!D||D.level!==x.val)&&n.push({start:x.ts,level:x.val})}let u=x=>(x+1<n.length?n[x+1].start:e)-n[x].start>=i,p=(x,D,C)=>{let b=x[x.length-1];b&&b.val!==C&&x.push({ts:D,val:b.val}),x.push({ts:D,val:C})};if((d.trigger_target_changes??1)===1&&o!==null){let x=[];n.forEach((C,b)=>p(x,C.start,C.level===o&&u(b)?1:0));let D=x[x.length-1]?.val??0;return x.push({ts:e,val:D}),{points:x,mode:"alarm"}}let v=t.since??n[0].start,f=0,y=[];for(let x=1;x<n.length;x++){let D=n[x-1],C=n[x];s!==null&&D.level!==s||o!==null&&C.level!==o||!u(x)||C.start<v||(f+=1,y.push(C.start))}let M=Math.max(0,(t.current??f)-f),j=[{ts:Math.max(v,n[0].start),val:M}],E=M;for(let x of y)E+=1,p(j,x,E);return j.push({ts:e,val:E}),{points:j,mode:"count"}}function Os(l){if(l.length<4)return l;let d=l.map(u=>u.val).sort((u,p)=>u-p),t=u=>{let p=(d.length-1)*u,m=Math.floor(p),v=Math.ceil(p);return d[m]+(d[v]-d[m])*(p-m)},e=t(.25),i=t(.75),s=i-e;if(s===0)return l;let o=e-1.5*s,c=i+1.5*s,n=l.filter(u=>u.val>=o&&u.val<=c);return n.length>=2?n:l}function Yi(l,d){let t=l.trigger_config;if(!t)return h;let e=d.lang,i=l.trigger_entity_info,s=l.trigger_entity_infos,o=i?.friendly_name||t.entity_id||"\u2014",c=t.entity_id||"",n=t.entity_ids||(c?[c]:[]),u=i?.unit_of_measurement||"",p=l.trigger_current_value,m=t.type||"threshold",v=n.length>1,f=Cs(l,u,d);return r`
    <h3>${a("trigger",e)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${v?r`
            <div class="trigger-entity-name">${n.length} ${a("entities",e)} (${t.entity_logic||"any"})</div>
            <div class="trigger-entity-id">${n.map((y,M)=>r`${M>0?", ":""}<span class="entity-link" @click=${j=>qt(j,y)}>${y}</span>`)}${t.attribute?` \u2192 ${t.attribute}`:""}</div>
          `:r`
            <div class="trigger-entity-name">${o}</div>
            <div class="trigger-entity-id">${c?r`<span class="entity-link" @click=${y=>qt(y,c)}>${c}</span>`:""}${t.attribute?` \u2192 ${t.attribute}`:""}</div>
          `}
        </div>
        <span class="status-badge ${l.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
          ${l.trigger_active?a("triggered",e):a("ok",e)}
        </span>
      </div>

      ${f?Ms(f,e):p!=null?r`
              <div class="trigger-value-row">
                <span class="trigger-current ${l.trigger_active?"active":""}">${typeof p=="number"?Et(p,"",e):p}</span>
                ${u?r`<span class="trigger-unit">${u}</span>`:h}
              </div>
            `:h}

      <div class="trigger-limits">
        ${m==="threshold"?r`
          ${t.trigger_above!=null?r`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("threshold_above",e)}: ${t.trigger_above} ${u}</span>`:h}
          ${t.trigger_below!=null?r`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("threshold_below",e)}: ${t.trigger_below} ${u}</span>`:h}
          ${t.trigger_equals!=null?r`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> = ${t.trigger_equals} ${u}</span>`:h}
          ${t.trigger_not_equals!=null?r`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ≠ ${t.trigger_not_equals} ${u}</span>`:h}
          ${t.trigger_for_minutes?r`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${a("for_minutes",e)}: ${t.trigger_for_minutes}</span>`:h}
        `:h}
        ${m==="state_change"?r`
          ${t.trigger_target_changes!=null?r`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("target_changes",e)}: ${t.trigger_target_changes}</span>`:h}
        `:h}
        ${m==="runtime"?r`
          ${t.trigger_runtime_hours!=null?r`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("runtime_hours",e)}: ${t.trigger_runtime_hours}h</span>`:h}
        `:h}
        ${m==="compound"?r`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("compound_logic",e)}: ${t.compound_logic||t.operator||"AND"}</span>
          ${(t.conditions||[]).map((y,M)=>r`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${M+1}. ${a(y.type||"unknown",e)}: ${y.entity_id?r`<span class="entity-link" @click=${j=>qt(j,y.entity_id)}>${y.entity_id}</span>`:""}</span>
          `)}
        `:h}
      </div>

      ${s&&s.length>1?r`
        <div class="trigger-entity-list">
          ${s.map(y=>r`
            <span class="trigger-entity-id">${y.friendly_name} (<span class="entity-link" @click=${M=>qt(M,y.entity_id)}>${y.entity_id}</span>)</span>
          `)}
        </div>
      `:h}

      ${Ds(l,u,d)}
    </div>
  `}function Cs(l,d,t){let e=l.trigger_config,i=l.trigger_current_value;if(!e||i==null)return null;switch(e.type||"threshold"){case"counter":{let s=e.trigger_target_value;if(s==null||s<=0)return null;if(!e.trigger_delta_mode)return{progress:Math.max(0,i),target:s,unit:d,meter:null};let o=Qi(l,Ji(l,t));return{progress:Math.max(0,i-(o?.value??i)),target:s,unit:d,meter:i}}case"state_change":{let s=e.trigger_target_changes;return s==null||s<=0?null:{progress:Math.max(0,i),target:s,unit:"",meter:null}}case"runtime":{let s=e.trigger_runtime_hours;return s==null||s<=0?null:{progress:Math.max(0,i),target:s,unit:"h",meter:null}}}return null}function Qi(l,d){if(l.trigger_baseline_value!=null)return{value:l.trigger_baseline_value,ts:be(l)};if(!d.length)return null;let t=be(l);if(t==null)return{value:d[0].val,ts:null};let e=d[0],i=Math.abs(d[0].ts-t);for(let s of d){let o=Math.abs(s.ts-t);o<i&&(e=s,i=o)}return{value:e.val,ts:t}}function be(l){let d=[...l.history].filter(t=>t.type==="completed"||t.type==="reset").sort((t,e)=>new Date(e.timestamp).getTime()-new Date(t.timestamp).getTime())[0];return d?new Date(d.timestamp).getTime():null}function Ms(l,d){let t=Math.min(999,Math.round(l.progress/l.target*100)),e=t>=100?"over":t>=75?"near":"ok";return r`
    <div class="counter-progress">
      <div class="counter-progress-nums">
        <span class="counter-progress-main">${Et(l.progress,"",d)}<span class="counter-progress-target"> / ${Et(l.target,l.unit,d)}</span></span>
        <span class="counter-progress-pct ${e}">${t} %</span>
      </div>
      <div class="counter-progress-bar" role="progressbar" aria-valuenow=${t} aria-valuemin="0" aria-valuemax="100">
        <div class="counter-progress-fill ${e}" style="width:${Math.min(100,t)}%"></div>
      </div>
      <div class="counter-progress-caption">
        ${a("chart_since_service",d)}${l.meter!=null?r` · ${a("current",d)}: ${Et(l.meter,l.unit,d)}`:h}
      </div>
    </div>
  `}function Ji(l,d){let t=l.trigger_config;if(!t)return[];let e=t.type||"threshold",i=t.entity_id||"",s=e==="runtime"?[]:d.detailStatsData.get(i)||[],o=d.isCounterEntity(t),c=[];if(s.length>=2)for(let u of s){let p={ts:u.ts,val:u.val};!o&&u.min!=null&&u.max!=null&&(p.min=u.min,p.max=u.max),c.push(p)}else for(let u of l.history)u.trigger_value!=null&&c.push({ts:new Date(u.timestamp).getTime(),val:u.trigger_value});let n=!!i&&!!d.historyFallbackIds?.has(i)&&s.length>=2;return l.trigger_current_value!=null&&!n&&c.push({ts:Date.now(),val:l.trigger_current_value}),c.sort((u,p)=>u.ts-p.ts),c}function Ds(l,d,t){let e=l.trigger_config;if(!e)return h;let i=e.type||"threshold",s=e.entity_id||"",o=Ji(l,t),c=null;i==="state_change"&&s&&t.historyFallbackIds?.has(s)&&(c=Rs(o,e,{since:be(l),current:l.trigger_current_value??null}),c&&(o=c.points)),i==="runtime"&&e.trigger_runtime_hours&&l.trigger_current_value!=null&&(o=[{ts:be(l)??o[0]?.ts??Date.now()-864e5,val:0},{ts:Date.now(),val:Math.max(0,l.trigger_current_value)}]),t.hideOutliers&&(o=Os(o));let n=o.length<2&&!!s&&t.hasStatsService&&!t.detailStatsData.has(s);if(o.length<2&&!n)return h;let u=!!s&&t.detailStatsData.has(s)&&(t.detailStatsData.get(s)?.length??0)<2,p=Date.now()-t.rangeDays*864e5,m=o.filter(x=>x.ts>=p);m.length>=2&&(o=m);let v=null,f=!1;if(i==="counter"&&e.trigger_target_value!=null&&o.length){if(e.trigger_delta_mode){let x=Qi(l,o);if(x){if(x.ts!=null){let D=o.filter(C=>C.ts>=x.ts);D.length>=2&&(o=D)}o=o.map(D=>({...D,val:Math.max(0,D.val-x.value)}))}}v=e.trigger_target_value,f=!0}else i==="state_change"&&e.trigger_target_changes&&c?.mode!=="alarm"?(v=e.trigger_target_changes,f=!0):i==="runtime"&&e.trigger_runtime_hours&&(v=e.trigger_runtime_hours,f=!0);let y=null,M=l.degradation_rate,j=M!=null&&(e.trigger_below!=null&&e.trigger_above==null&&M>0||e.trigger_above!=null&&e.trigger_below==null&&M<0);if(v==null&&M!=null&&!j&&(l.degradation_trend!=="stable"||l.days_until_threshold!=null)&&l.degradation_trend!=="insufficient_data"&&o.length>=2){let x=o[o.length-1];y=[x,{ts:x.ts+30*864e5,val:x.val+M*30}]}let E=l.history.filter(x=>["completed","skipped","reset"].includes(x.type)).map(x=>({ts:new Date(x.timestamp).getTime(),type:x.type}));return r`
    <maintenance-trigger-chart
      .points=${n?[]:o}
      .events=${E}
      .unit=${d}
      .lang=${t.lang}
      .thresholdAbove=${i==="threshold"?e.trigger_above??null:null}
      .thresholdBelow=${i==="threshold"?e.trigger_below??null:null}
      .targetValue=${v}
      .forceZero=${f}
      .projection=${y}
      .rangeDays=${t.rangeDays}
      .hideOutliers=${t.hideOutliers}
      .busy=${n}
      @range-change=${x=>t.setRangeDays(x.detail.days)}
      @outlier-toggle=${x=>t.setHideOutliers(x.detail.hide)}
    ></maintenance-trigger-chart>
    ${n?h:s&&t.historyFallbackIds?.has(s)&&!u?r`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${a(c?.mode==="alarm"?"chart_history_alarm":c?.mode==="count"?"chart_history_count":"chart_history_fallback",t.lang)}
        </div>`:u?r`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${a("chart_no_stats",t.lang)}
        </div>`:h}
  `}var As=200,Kt=10,zs=22;function Xi(l,d,t,e,i){let s=l.history.filter(n=>n.type==="completed"&&(n.cost!=null||n.duration!=null));if(s.length<2)return h;let o=s.some(n=>(n.cost??0)>0),c=s.some(n=>(n.duration??0)>0);return!o&&!c?h:r`
    <div class="cost-duration-card">
      <div class="card-header">
        <h3>${a("cost_duration_chart",d)}</h3>
        <div class="toggle-buttons">
          ${o?r`<button
            class="toggle-btn ${t==="cost"?"active":""}"
            @click=${()=>e("cost")}>
            ${a("cost",d)}
          </button>`:h}
          ${o&&c?r`<button
            class="toggle-btn ${t==="both"?"active":""}"
            @click=${()=>e("both")}>
            ${a("both",d)}
          </button>`:h}
          ${c?r`<button
            class="toggle-btn ${t==="duration"?"active":""}"
            @click=${()=>e("duration")}>
            ${a("duration",d)}
          </button>`:h}
        </div>
      </div>
      ${Is(l,d,t,i)}
    </div>
  `}function Is(l,d,t,e){let i=l.history.filter(T=>T.type==="completed"&&(T.cost!=null||T.duration!=null)).map(T=>({ts:new Date(T.timestamp).getTime(),cost:T.cost??0,duration:T.duration??0})).sort((T,I)=>T.ts-I.ts);if(i.length<2)return h;let s=i.some(T=>T.cost>0),o=i.some(T=>T.duration>0);if(!s&&!o)return h;let c=t!=="duration"&&s,n=t!=="cost"&&o,u=c||!n&&s,p=n||!c&&o,m=640,v=As,f=u?44:12,y=p?44:12,M=m-f-y,j=v-zs,E=j-Kt,x=i[0].ts,D=i[i.length-1].ts,C=(D-x||864e5)*.05,b=x-C,it=D+C,ht=de(x,D),$=T=>f+(T-b)/(it-b)*M,L=Vt(0,Math.max(...i.map(T=>T.cost))||1,3),H=Vt(0,Math.max(...i.map(T=>T.duration))||1,3),z=T=>Kt+(1-T/(L.niceMax||1))*E,W=T=>Kt+(1-T/(H.niceMax||1))*E,X=i.length>1?Math.min(...i.slice(1).map((T,I)=>$(T.ts)-$(i[I].ts))):M,U=Math.max(6,Math.min(22,X*.55)),S=pe(x,D,Math.max(2,Math.min(4,i.length)));return r`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${m} ${v}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${a("chart_history",d)}">
        ${u?L.ticks.map(T=>{let I=z(T);return I<Kt-1||I>j+1?h:J`
            <line x1="${f}" y1="${O(I)}" x2="${m-y}" y2="${O(I)}" stroke="var(--divider-color)" stroke-width="1" opacity="0.55" />
            <text x="${f-6}" y="${O(I+3.5)}" text-anchor="end" fill="var(--primary-color)" font-size="10.5">${_t(T,d)}${e}</text>`}):h}
        ${p?H.ticks.map(T=>{let I=W(T);return I<Kt-1||I>j+1?h:J`<text x="${m-y+6}" y="${O(I+3.5)}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="10.5">${_t(T,d)}m</text>`}):h}

        ${u?i.filter(T=>T.cost>0).map(T=>J`
          <rect x="${O($(T.ts)-U/2)}" y="${O(z(T.cost))}" width="${O(U)}" height="${O(j-z(T.cost))}"
            fill="var(--primary-color)" opacity="0.6" rx="2">
            <title>${zt(T.ts,d,!0)}: ${Q(T.cost,e,d)}${T.duration?` \xB7 ${T.duration}m`:""}</title>
          </rect>
        `):h}
        ${p?J`
          <polyline points="${i.map(T=>`${O($(T.ts))},${O(W(T.duration))}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${i.map(T=>J`
            <circle cx="${O($(T.ts))}" cy="${O(W(T.duration))}" r="3.5" fill="var(--accent-color, #ff9800)">
              <title>${zt(T.ts,d,!0)}: ${T.duration}m${T.cost?` \xB7 ${Q(T.cost,e,d)}`:""}</title>
            </circle>
          `)}
        `:h}

        <line x1="${f}" y1="${j}" x2="${m-y}" y2="${j}" stroke="var(--divider-color)" stroke-width="1" />
        ${S.map((T,I)=>{let Ot=I===0?"start":I===S.length-1?"end":"middle";return J`<text x="${O($(T))}" y="${v-6}" text-anchor="${Ot}" fill="var(--secondary-text-color)" font-size="10">${zt(T,d,ht)}</text>`})}
      </svg>
    </div>
    <div class="chart-legend">
      ${u?r`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${a("cost",d)}</span>`:h}
      ${p?r`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${a("duration",d)}</span>`:h}
    </div>
  `}function Pe(l,d,t){if(!l.responsible_user_id)return h;let e=t?.(l.responsible_user_id)??null;if(e)return r`<span class="user-badge">${hi(e)}${e.name}</span>`;let i=d(l.responsible_user_id);return i?r`
    <span class="user-badge">
      <ha-icon icon="mdi:account"></ha-icon>
      ${i}
    </span>
  `:h}function Ps(l,d){let t=d.lang,e=d.isOperator;return r`
    <div class="task-header">
      <div class="task-header-title">
        <span class="task-name-breadcrumb" @click=${()=>d.showTaskView()}>${l.name}${Pt(l.next_event_titles)}</span>
        ${Mt(d.taskRef??null,a("ref_number",t))}
        <span class="breadcrumb-separator">·</span>
        <span class="object-name-breadcrumb" @click=${()=>d.showObject()}>${d.objectName}</span>
        ${he(l,t,"chip")}
        ${l.due_override?r`<span class="postponed-badge" title="${a("postponed_to",t)}">
          <ha-icon icon="mdi:calendar-arrow-right"></ha-icon>${G(l.due_override,t)}
        </span>`:h}
        ${Pe(l,d.getUserName,d.getPerson)}
        ${l.notify_enabled===!1?r`<span class="nfc-badge muted-badge" title="${a("no_notifications",t)}"><ha-icon icon="mdi:bell-off-outline"></ha-icon></span>`:h}
        ${l.mirror_todo_entities?.length?r`<span class="nfc-badge mirror-badge" title="${a("task_mirror_todo",t)}: ${l.mirror_todo_entities.map(i=>String(d.hass?.states?.[i]?.attributes?.friendly_name??i)).join(", ")}"><ha-icon icon="mdi:clipboard-list-outline"></ha-icon></span>`:h}
        ${l.nfc_tag_id?r`<span class="nfc-badge" title="${a("nfc_tag_id",t)}: ${l.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>`:e?h:r`<span class="nfc-badge unlinked" title="${a("nfc_link_hint",t)}"
              @click=${()=>d.openEdit(l)}>
              <ha-icon icon="mdi:nfc-variant"></ha-icon>
            </span>`}
      </div>
      <div class="task-header-actions">
        <ha-button appearance="accent" variant="success" @click=${()=>d.openComplete(l)}>${a("complete",t)}</ha-button>
        ${l.allow_skip!==!1?r`<ha-button appearance="outlined" variant="warning" .disabled=${d.actionLoading} @click=${()=>d.promptSkip()}>${a("skip",t)}</ha-button>`:h}
        <div class="more-menu-wrapper">
          <ha-icon-button .disabled=${d.actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${()=>d.toggleMoreMenu()}></ha-icon-button>
          ${d.moreMenuOpen?r`
            <div class="popup-menu" @click=${i=>i.stopPropagation()}>
              ${e?h:r`
                <div class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.openEdit(l)}}>${a("edit",t)}</div>
              `}
              <div class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.openQr(l.name)}}>${a("qr_code",t)}</div>
              <div class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.printWorksheet()}}>${a("worksheet",t)}</div>
              ${d.features.adaptive&&l.adaptive_config?.enabled?r`
                <!-- The recommendation card carries Re-analyze too, but only
                     once a differing suggestion exists — the analysis it is
                     meant to trigger was unreachable before (audit 2026-09-28). -->
                <div class="popup-menu-item reanalyze" @click=${()=>{d.closeMoreMenu(),d.reanalyze()}}>${a("reanalyze",t)}</div>
              `:h}
              ${e?h:r`
                <div class="popup-menu-item" @click=${()=>d.duplicateTask()}>${a("duplicate",t)}</div>
                <div class="popup-menu-item" @click=${()=>d.moveTask()}>${a("move_task",t)}</div>
              `}
              <!-- Reset / Postpone / Snooze are household actions (read tier,
                   helpers/permissions HOUSEHOLD_ACTIONS): offered to everyone,
                   like Complete / Skip and the Lovelace quick-actions Reset. -->
              <div class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.promptReset()}}>${a("reset",t)}</div>
              <div class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.promptPostpone()}}>${a("postpone",t)}…</div>
              <div class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.snoozeTask()}}>${a("snooze",t)}</div>
              ${e?h:r`
                <div class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.toggleArchive(!!l.archived)}}>${l.archived?a("unarchive",t):a("archive",t)}</div>
                <div class="popup-menu-divider"></div>
                <div class="popup-menu-item danger" @click=${()=>{d.closeMoreMenu(),d.deleteTask()}}>${a("delete",t)}</div>
              `}
            </div>
          `:h}
        </div>
      </div>
    </div>
  `}function Ls(l){let d=l.lang;return r`
    <div class="tab-bar">
      <div class="tab ${l.activeTab==="overview"?"active":""}" @click=${()=>l.setActiveTab("overview")}>
        ${a("overview",d)}
      </div>
      <div class="tab ${l.activeTab==="history"?"active":""}" @click=${()=>l.setActiveTab("history")}>
        ${a("history",d)}
      </div>
    </div>
  `}function Zi(l,d,t,e){let i=e.collapsedSections.has(l);return r`
    <div class="collapsible ${i?"collapsed":""}">
      <button class="collapsible-head" @click=${()=>e.toggleSection(l)}
        aria-expanded=${i?"false":"true"}>
        <ha-icon icon="${i?"mdi:chevron-right":"mdi:chevron-down"}"></ha-icon>
        <span>${a(d,e.lang)}</span>
      </button>
      ${i?h:r`<div class="collapsible-body">${t}</div>`}
    </div>
  `}function Hs(l,d){if(!si(l))return h;let t=d.lang,e=l.phase_sequence,i=ii(l.phase_cursor,e.length),s=new Map;for(let o=l.history.length-1;o>=0;o--){let c=l.history[o];c.phase_id&&c.type==="completed"&&!s.has(c.phase_id)&&s.set(c.phase_id,c.timestamp)}return r`
    <div class="phases-card">
      <div class="phases-card-header">
        <ha-icon icon="mdi:rotate-right"></ha-icon>
        <span>${a("phase_sequence_label",t)}</span>
      </div>
      <div class="phases-strip">
        ${e.map((o,c)=>{let n=l.phases?.[o]?.name||o,u=s.get(o);return r`
            <div class="phase-step ${c===i?"current":""}"
              title=${c===i?a("phase_current",t):a("phase_set",t)}
              @click=${()=>{c!==i&&d.setPhaseCursor(c)}}>
              <span class="phase-step-name">${c+1}. ${n}</span>
              ${u?r`<span class="phase-step-last">${G(u,t)}</span>`:h}
            </div>
          `})}
      </div>
    </div>
  `}function Bs(l,d){if(!d.features.checklists)return h;let t=oe(l)?.checklist??(l.checklist||[]);if(t.length===0)return h;let e=d.lang,i=l.checklist_progress||{},s=t.filter(o=>i[o]).length;return r`
    <div class="checklist-preview-card">
      <div class="checklist-preview-header">
        <ha-icon icon="mdi:format-list-checks"></ha-icon>
        <span>${a("checklist",e)} (${s}/${t.length})</span>
      </div>
      <ol class="checklist-preview-list">
        ${t.map(o=>r`
          <li class=${i[o]?"checked":""}>
            <label>
              <input
                type="checkbox"
                .checked=${!!i[o]}
                @change=${c=>d.setChecklistItem(o,c.target.checked)}
              />
              <span>${o}</span>
            </label>
          </li>
        `)}
      </ol>
    </div>
  `}function Ns(l,d){let t=st(l.documentation_url)?l.documentation_url:null,e=st(d.objectDocUrl)?d.objectDocUrl:null,i=e?null:(d.objectManualDocs||[])[0];if(!l.notes&&!t&&!e&&!i)return h;let s=d.lang;return r`
    <div class="task-meta-card">
      ${l.notes?r`
        <div class="task-meta-row">
          <ha-icon icon="mdi:note-text-outline"></ha-icon>
          <span class="task-meta-notes">${re(l.notes)}</span>
        </div>
      `:h}
      ${t?r`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:open-in-new"></ha-icon>
          <a href="${t}" target="_blank" rel="noopener noreferrer">${a("documentation_label",s)}</a>
        </div>
      `:h}
      ${e?r`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="${e}" target="_blank" rel="noopener noreferrer">${a("documentation_url_label",s)} (${d.objectName})</a>
        </div>
      `:i?r`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="#" title=${i.title}
            @click=${o=>{o.preventDefault(),d.openManualDoc(i)}}
            >${a("documentation_url_label",s)} (${d.objectName})</a>
        </div>
      `:h}
    </div>
  `}function qs(l,d){let t=d.lang,e=l.times_performed>0?l.total_cost/l.times_performed:0,i=l.days_until_due!==null&&l.days_until_due!==void 0?l.days_until_due<0?"overdue":l.days_until_due<=l.warning_days?"warning":"":"";return r`
    <div class="kpi-bar">
      <div class="kpi-card">
        <div class="kpi-label">${a("next_due",t)}</div>
        <div class="kpi-value">${l.next_due?G(l.next_due,t):"\u2014"}</div>
        ${d.features.schedule_time&&l.schedule_time?r`<div class="kpi-subtext">${a("at_time",t)} ${l.schedule_time}</div>`:h}
      </div>
      <div class="kpi-card ${i}">
        <div class="kpi-label">${a("days_until_due",t)}</div>
        <div class="kpi-value-large">${l.days_until_due!==null&&l.days_until_due!==void 0?l.days_until_due:"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("interval",t)}</div>
        <div class="kpi-value">${St(l,t)}</div>
        ${d.features.adaptive&&l.suggested_interval&&l.suggested_interval!==l.interval_days?r`
          <div class="kpi-subtext">${a("recommended",t)}: ${l.suggested_interval}${l.interval_analysis?.confidence_interval_low!=null?` (${l.interval_analysis.confidence_interval_low}\u2013${l.interval_analysis.confidence_interval_high})`:""}</div>
        `:h}
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("warning",t)}</div>
        <div class="kpi-value">${l.warning_days} ${a("days",t)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("last_performed",t)}</div>
        <div class="kpi-value">${l.last_performed?G(l.last_performed,t):"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("avg_cost",t)}</div>
        <div class="kpi-value">${Q(e,d.currencySymbol,t)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("avg_duration",t)}</div>
        <div class="kpi-value">${l.average_duration?Nt(Math.round(l.average_duration),t):"\u2014"}</div>
      </div>
    </div>
  `}function Fs(l,d){let t=d.lang;if(!d.features.adaptive||!l.suggested_interval||l.suggested_interval===l.interval_days)return h;if(d.suggestionDismissed)return h;let e=l.suggested_interval;return r`
    <div class="recommendation-card">
      <h4>${a("suggested_interval",t)}</h4>
      ${Oi(l.interval_days,e,l.interval_confidence||"medium",t)}
      <div class="recommendation-actions">
        ${d.isOperator?h:r`<ha-button appearance="filled" class="apply-suggestion"
              @click=${()=>d.applySuggestion(e)}>
              ${a("apply_suggestion",t)}
            </ha-button>`}
        <ha-button appearance="plain"
          @click=${()=>d.reanalyze()}>
          ${a("reanalyze",t)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${()=>d.dismissSuggestion()}>
          ${a("dismiss_suggestion",t)}
        </ha-button>
      </div>
    </div>
  `}function Us(l,d){let t=d.lang,e=$i(l.history).slice(0,3);return e.length===0?h:r`
    <div class="recent-activities">
      <h3>${a("recent_activities",t)}</h3>
      ${e.map(i=>Si(i,d.history,{compact:!0,showEdit:!1}))}
      <div class="activity-show-all">
        <ha-button appearance="plain" @click=${()=>d.setActiveTab("history")}>${a("show_all",t)} →</ha-button>
      </div>
    </div>
  `}function Vs(l,d){let t=d.lang,e=d.features.adaptive&&l.suggested_interval&&l.suggested_interval!==l.interval_days,i=d.features.seasonal&&l.seasonal_factor&&l.seasonal_factor!==1,s=e||i,o=d.features.adaptive&&l.interval_analysis?.weibull_beta!=null&&l.interval_analysis?.weibull_eta!=null,c=d.features.seasonal&&(l.seasonal_factors?.length===12||l.interval_analysis?.seasonal_factors?.length===12);return r`
    <div class="tab-content overview-tab">
      ${l.battery_fleet_task?r`<maintenance-battery-fleet-section .hass=${d.hass}></maintenance-battery-fleet-section>`:h}
      ${qs(l,d)}
      ${Ns(l,d)}
      ${l.battery_fleet_task?h:r`
            ${Wi(l,d.lang)}
            ${Yi(l,d.sparkline)}
            ${Ri(l,t,d.features)}
          `}
      <div class="two-column-layout ${s?"":"single-column"}">
        ${s?r`
          <div class="left-column">
            ${Fs(l,d)}
            ${Ci(l,t,d.features)}
          </div>
        `:h}
        <div class="right-column">
          ${Xi(l,t,d.costDurationToggle,n=>d.setCostDurationToggle(n),d.currencySymbol)}
        </div>
      </div>
      ${o?Zi("weibull","weibull_reliability_curve",Ei(l,t),d):h}
      ${c?Zi("seasonal","seasonal_chart_title",r`
            ${Mi(l,t)}
            <div class="seasonal-actions">
              <ha-button appearance="plain" @click=${()=>d.openSeasonalOverrides(l)}>
                ${a("edit_seasonal_overrides",t)}
              </ha-button>
            </div>
          `,d):h}
      ${Hs(l,d)}
      ${Bs(l,d)}
      ${Us(l,d)}
    </div>
  `}function Ws(l,d){return r`
    <div class="tab-content history-tab">
      <div class="history-add-past">
        <ha-button appearance="plain" class="history-add-past-btn" @click=${()=>d.openComplete(l)}>
          <ha-icon icon="mdi:calendar-plus"></ha-icon>
          ${a("history_add_past",d.lang)}
        </ha-button>
      </div>
      ${ji(l,d.history)}
      ${Ti(l,d.history)}
    </div>
  `}function Ks(l,d){switch(d.activeTab){case"overview":return Vs(l,d);case"history":return Ws(l,d);default:return h}}function ts(l,d){return r`
    <div class="detail-section">
      ${Ps(l,d)}
      ${Ls(d)}
      ${Ks(l,d)}
      <maintenance-task-documents
        .hass=${d.hass}
        .entryId=${d.entryId}
        .taskId=${d.taskId}
        .canWrite=${!d.isOperator}
      ></maintenance-task-documents>
    </div>
  `}var Gt=class extends q{createRenderRoot(){return this}render(){return!this.task||!this.ctx?h:r`${ts(this.task,this.ctx)}`}};g([R({attribute:!1})],Gt.prototype,"task",2),g([R({attribute:!1})],Gt.prototype,"ctx",2);customElements.get("maintenance-task-detail-view")||customElements.define("maintenance-task-detail-view",Gt);function es(l){if(l.total<=0)return{start:0,end:0,padTop:0,padBottom:0};let d=l.overscan??12,t=Math.max(1,l.step??6),e=Math.max(1,l.rowHeight),i=Math.floor((l.scrollTop-l.listTop)/e),s=Math.ceil(l.viewportHeight/e)+1,o=Math.max(0,i-d);o=Math.floor(o/t)*t;let c=Math.min(l.total,Math.max(i,0)+s+d);return c=Math.min(l.total,Math.ceil(c/t)*t),o>=c&&(o=Math.min(o,Math.max(0,l.total-1)),c=Math.min(l.total,o+Math.max(s,1))),{start:o,end:c,padTop:o*e,padBottom:(l.total-c)*e}}var ye={mode:"top",marginTop:0,lastScrollTop:0};function is(l,d){return l==="top"?8:d.viewH-d.paneH-8}function ss(l){let d=l.scrollTop+8-l.layoutTop,t=Math.max(0,l.listH-l.paneH);return{mode:"top",marginTop:d>t?Math.max(0,d):0,lastScrollTop:l.scrollTop}}function as(l,d){let t=d.scrollTop,e=d.scrollTop>l.lastScrollTop?"down":d.scrollTop<l.lastScrollTop?"up":"none",i=Math.max(0,d.listH-d.paneH),s=d.paneH+16<=d.viewH||d.listH<=d.paneH,{mode:o,marginTop:c}=l;if(s&&(o="top"),o==="top"&&c>0&&e==="up")c=Math.max(0,Math.min(c,d.scrollTop+8-d.layoutTop)),c<=i&&(c=0);else if(!s&&e==="down"&&o==="top"){let n=d.renderedTop-d.layoutTop;n<=i&&(o="bottom",c=Math.max(0,n))}else!s&&e==="up"&&o==="bottom"&&(c=Math.min(Math.max(0,d.renderedTop-d.layoutTop),i),d.scrollTop+8<=d.layoutTop+c&&(o="top",c=0));return{mode:o,marginTop:c,lastScrollTop:t}}var xe=2,Js=250,Rt={objects:6,tasks:10,parts:6,documents:8,history:6},Xs="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z",Le=["due_date","object","type","task_name","area","assigned_user","group"],rs=["none","area","group","user","object"],os=Ne,ns=["tasks","documents","parts","history"],w=class extends q{constructor(){super(...arguments);this.narrow=!1;this.tight=!1;this.split=!1;this._tightObserver=null;this.panel={};this.embedded=!1;this.presets={};this._presetsApplied=!1;this._mountPath=null;this._objects=[];this._stats=null;this._view="overview";this._allParts=null;this._selectedEntryId=null;this._selectedTaskId=null;this._selectedAreaId=null;this._filterStatus="";this._filterUser=null;this._filterLabel=null;this._filterPriority="";this._savedViews=[];this._activeViewId="";this._unsub=null;this._chartRangeDays=(()=>{try{let t=parseInt(Z(A.chartRange)||"",10);return[7,30,90,365].includes(t)?t:30}catch{return 30}})();this._hideOutliers=(()=>{try{return Z(A.chartHideOutliers)==="1"}catch{return!1}})();this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._adminPanelUserIds=[];this._operatorWriteEnabled=!1;this._defaultWarningDays=7;this._rowActionStyle="buttons_compact";this._refsInLists=!1;this._rowActionNotice=!1;this._actionLoading=!1;this._moreMenuOpen=!1;this._objMenuOpen=!1;this._toastMessage="";this._toastKind="error";this._toastUndo=null;this._toastActionLabel="";this._filtersOpen=!1;this._newMenuOpen=!1;this._gsSetupsCount=0;this._gsAdoptCount=0;this._gsLoaded=!1;this._resetOffersLoaded=!1;this._resetOffersCount=0;this._batteryFleetSetupAvailable=!1;this._staleBundle=!1;this._staleChecked=!1;this._toastTimer=null;this._dismissedSuggestions=new Set;this._overviewTab=(()=>{try{let t=Z(A.overviewTab);return t==="today"||t==="calendar"?t:"dashboard"}catch{return"dashboard"}})();this._activeTab="overview";this._costDurationToggle="both";this._historySearch="";this._sortMode="due_date";this._objectSortMode="alphabetical";this._groupByMode="none";this._objectViewMode="cards";this._objectsTableColumns=Ye;this._showArchived=!1;this._bulkMode=!1;this._bulkSelected=new Set;this._objBulkMode=!1;this._objBulkSelected=new Set;this._bulkMenuOpen=!1;this._virtStart=0;this._virtEnd=0;this._virtRowHeight=53;this._virtTotalRows=0;this._virtScrollAttached=!1;this._virtRaf=0;this._stickyState=ye;this._stickySelectPending=!1;this._stickyRaf=0;this._stickyAttached=!1;this._stickyObserver=null;this._collapsedGroups=new Set;this._collapsedSections=(()=>{try{return new Set(JSON.parse(Z(A.collapsedSections)||"[]"))}catch{return new Set}})();this._objectSectionsCollapsed=(()=>{try{let t=JSON.parse(Z(A.objectSections)||"[]");return new Set((Array.isArray(t)?t:[]).filter(e=>ns.includes(e)))}catch{return new Set}})();this._objectSectionOverride=null;this._paletteOpen=!1;this._paletteQuery="";this._paletteActive=0;this._searchRemote=null;this._searchTimer=null;this._searchSeq=0;this._templateGalleryOpen=!1;this._templates=[];this._homeProfile=null;this._templateCategories={};this._templateBusy=!1;this._statsService=null;this._userService=null;this._dataLoaded=!1;this._lastConnection=null;this._popstateHandler=t=>this._onPopState(t);this._locationChangedHandler=()=>this._onLocationChanged();this._lazyUi=null;this._onStickyScroll=()=>{this._stickyRaf||(this._stickyRaf=requestAnimationFrame(()=>{this._stickyRaf=0,this._updateStickyPane()}))};this._onVirtualScroll=()=>{this._virtRaf||(this._virtRaf=requestAnimationFrame(()=>{this._virtRaf=0,this._updateVirtualWindow()}))};this._deepLinkHandled=!1;this._deepLinkInPlace=!1;this._initialLoadDone=!1;this._detailStatsSeq=new Map;this._kpiRefreshInFlight=!1;this._kpiRefreshPending=!1;this._areaUi=null;this._paletteKeydown=t=>{if(t.key==="/"&&!t.ctrlKey&&!t.metaKey&&!t.altKey&&!this._paletteOpen){let i=t.composedPath()[0];if(i instanceof HTMLElement&&(i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.tagName==="SELECT"||i.isContentEditable))return;t.preventDefault(),this._openPalette();return}if(!this._paletteOpen)return;let e=this._paletteResults;if(t.key==="Escape")t.preventDefault(),this._closePalette();else if(t.key==="ArrowDown")t.preventDefault(),this._paletteActive=Math.min(this._paletteActive+1,e.length-1);else if(t.key==="ArrowUp")t.preventDefault(),this._paletteActive=Math.max(this._paletteActive-1,0);else if(t.key==="Enter"){t.preventDefault();let i=e[this._paletteActive];i&&this._selectPaletteResult(i)}};this._checklistPending=new Map;this._checklistChain=Promise.resolve();this._onDialogEvent=async()=>{try{await this._loadData()}catch{}};this._onCalendarLlCustom=t=>{let e=t.detail;e?.type==="maintenance-supporter:open-task"&&e.entry_id&&e.task_id&&(t.stopPropagation(),this._showTask(e.entry_id,e.task_id))};this._fullHistory=null;this._onHistoryEntrySaved=async()=>{await this._loadData()}}get _currencySymbol(){return Xt(this._budget)}get _lang(){return K(this.hass)}get _isOperator(){return!At(this.hass?.user,{operatorWriteEnabled:this._operatorWriteEnabled,operatorIds:this._adminPanelUserIds})}_ensureLazyUi(){return this._lazyUi||(this._lazyUi=Promise.all([import("/maintenance_supporter_panelfiles/panel-chunks/object-dialog-AWEGMZWU.js"),import("/maintenance_supporter_panelfiles/panel-chunks/task-dialog-G5JECE6C.js"),import("/maintenance_supporter_panelfiles/panel-chunks/complete-dialog-MDO3RPHB.js"),import("/maintenance_supporter_panelfiles/panel-chunks/qr-dialog-5Q4UXKI3.js"),import("/maintenance_supporter_panelfiles/panel-chunks/adopt-problem-sensors-dialog-HGJAG63U.js"),import("/maintenance_supporter_panelfiles/panel-chunks/suggested-setups-dialog-UZAPGDYB.js"),import("/maintenance_supporter_panelfiles/panel-chunks/settings-view-C2GZ665M.js")]).then(()=>this.updateComplete)),this._lazyUi}async _ui(t){return await this._ensureLazyUi(),this.shadowRoot?.querySelector(t)??null}connectedCallback(){super.connectedCallback(),this._mountPath=window.location.pathname;let t=window.requestIdleCallback,e=()=>this._ensureLazyUi();t?t(e,{timeout:3e3}):window.setTimeout(e,1500),window.addEventListener("popstate",this._popstateHandler),window.addEventListener("location-changed",this._locationChangedHandler),window.addEventListener("keydown",this._paletteKeydown),typeof ResizeObserver<"u"&&(this._tightObserver=new ResizeObserver(i=>{let s=i[0]?.contentRect.width??0;s>0&&(this.tight=s<1e3),s>0&&(this.split=s>=1500)}),this._tightObserver.observe(this)),window.addEventListener("resize",this._onVirtualScroll,{passive:!0});try{let i=Z(A.taskSort);i&&Le.includes(i)&&(this._sortMode=i);let s=Z(A.objectSort);s&&["alphabetical","due_soonest","task_count"].includes(s)&&(this._objectSortMode=s);let o=Z(A.groupBy);o&&rs.includes(o)&&(this._groupByMode=o);let c=Z(A.objectView);(c==="cards"||c==="table")&&(this._objectViewMode=c)}catch{}if(this._objects.length===0){let i=Ii();i&&(this._objects=i.objects,i.stats&&(this._stats=i.stats))}}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("popstate",this._popstateHandler),window.removeEventListener("location-changed",this._locationChangedHandler),window.removeEventListener("keydown",this._paletteKeydown),this._tightObserver?.disconnect(),this._tightObserver=null,window.removeEventListener("resize",this._onVirtualScroll),this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onVirtualScroll),this._virtScrollAttached=!1,this._virtRaf&&cancelAnimationFrame(this._virtRaf),this._detachStickyPane(),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._initialLoadDone=!1,this._lastConnection=null,this._deepLinkHandled=!1,this._searchTimer&&(clearTimeout(this._searchTimer),this._searchTimer=null),this._toastTimer&&(clearTimeout(this._toastTimer),this._toastTimer=null),this._toastMessage="",this._toastUndo=null,this._toastActionLabel="",this._statsService?.clearCache(),this._statsService=null}willUpdate(t){super.willUpdate(t),t.has("_groupByMode")&&this._collapsedGroups.size>0&&(this._collapsedGroups=new Set)}updated(t){if(super.updated(t),Dt(this,t),t.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},""),this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new ge(this.hass),this._fetchMiniStatsForOverview()),this._userService?this._userService.updateHass(this.hass):(this._userService=new ui(this.hass),this._userService.getUsers().then(()=>this.requestUpdate()))}let e=this.shadowRoot?.querySelector(".content");e&&!this._virtScrollAttached&&(e.addEventListener("scroll",this._onVirtualScroll,{passive:!0}),this._virtScrollAttached=!0),this._updateVirtualWindow(),this._syncStickyPane(e)}_syncStickyPane(t){let e=this.shadowRoot?.querySelector(".split-pane");if(!e||!t){this._stickyAttached&&this._detachStickyPane();return}this._stickyAttached||(t.addEventListener("scroll",this._onStickyScroll,{passive:!0}),window.addEventListener("resize",this._onStickyScroll),typeof ResizeObserver<"u"&&(this._stickyObserver=new ResizeObserver(this._onStickyScroll)),this._stickyAttached=!0),this._stickyObserver?.observe(e),this._updateStickyPane()}_detachStickyPane(){this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onStickyScroll),window.removeEventListener("resize",this._onStickyScroll),this._stickyObserver?.disconnect(),this._stickyObserver=null,this._stickyRaf&&cancelAnimationFrame(this._stickyRaf),this._stickyRaf=0,this._stickyAttached=!1,this._stickyState=ye,this._stickySelectPending=!1}_updateStickyPane(){let t=this.shadowRoot,e=t?.querySelector(".content"),i=t?.querySelector(".split-pane"),s=t?.querySelector(".split-layout"),o=t?.querySelector(".split-list");if(!e||!i||!s||!o)return;let c=e.getBoundingClientRect().top-e.scrollTop,n={scrollTop:e.scrollTop,viewH:e.clientHeight,paneH:i.offsetHeight,listH:o.offsetHeight,layoutTop:s.getBoundingClientRect().top-c,renderedTop:i.getBoundingClientRect().top-c};this._stickySelectPending&&n.scrollTop===this._stickyState.lastScrollTop?this._stickyState=ss(n):(this._stickySelectPending=!1,this._stickyState=as(this._stickyState,n));let u=this._stickyState;i.style.top=`${is(u.mode,n)}px`,i.style.marginTop=u.marginTop>0?`${u.marginTop}px`:""}_resetStickyPane(){let t=this.shadowRoot?.querySelector(".content");this._stickyState={...ye,lastScrollTop:t?.scrollTop??0},this._stickySelectPending=!0}_updateVirtualWindow(){let t=this.shadowRoot?.querySelector(".content"),e=this.shadowRoot?.querySelector(".task-table.virtual");if(!t||!e)return;let i=e.querySelector(".task-row:not(.virt-sizer)");i&&i.offsetHeight>20&&(this._virtRowHeight=i.offsetHeight);let s=e.getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop,o=es({scrollTop:t.scrollTop,viewportHeight:t.clientHeight,listTop:s,rowHeight:this._virtRowHeight,total:this._virtTotalRows});(o.start!==this._virtStart||o.end!==this._virtEnd)&&(this._virtStart=o.start,this._virtEnd=o.end)}async _loadData(){let[t,e,i,s,o,c]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"}).catch(()=>null)]);if(c&&(this._savedViews=c.views||[]),t&&(this._objects=Wt(t.objects),Re(this._objects,e??this._stats??null),this._maybeLoadGettingStarted()),this._detailOpen()&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/status"}).then(n=>{this._batteryFleetSetupAvailable=!!n.available&&!n.configured}).catch(()=>{this._batteryFleetSetupAvailable=!1}),this._staleChecked||(this._staleChecked=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/version"}).then(n=>{this._staleBundle=He(n?.version)}).catch(()=>{})),e&&(this._stats=e),i&&(this._budget=i,Bt(this._budget)),s&&(this._groups=s.groups||{}),o){let n=yi(o);this._features=n.features,this._adminPanelUserIds=[...n.access.operatorIds],this._operatorWriteEnabled=n.access.operatorWriteEnabled,this._defaultWarningDays=n.defaultWarningDays,this._rowActionStyle=n.rowActionStyle,this._rowActionNotice=n.rowActionNoticePending,this._refsInLists=n.refsInLists,this._objectsTableColumns=Qe(n.objectsTableColumns)}this._fetchMiniStatsForOverview(),this._initialLoadDone=!0,this._handleDeepLink()}_onLocationChanged(){if(!this._initialLoadDone||!window.location.search||this.embedded&&this._mountPath!==null&&window.location.pathname!==this._mountPath)return;if(!this.embedded){let e=`/${typeof this.panel?.url_path=="string"?this.panel.url_path:"maintenance-supporter"}`,i=window.location.pathname;if(i!==e&&!i.startsWith(`${e}/`))return}this._deepLinkHandled=!1,this._deepLinkInPlace=!0;try{this._handleDeepLink()}finally{this._deepLinkInPlace=!1}history.state?.msp_view||history.replaceState({msp_view:this._view,msp_entry:this._selectedEntryId,msp_task:this._selectedTaskId,msp_area:this._selectedAreaId},"")}_handleDeepLink(){if(this._deepLinkHandled)return;let t=new URLSearchParams(window.location.search),e=t.get("ms_action"),i=()=>{let E=window.location.pathname+window.location.hash;history.replaceState(history.state,"",E)};if(e==="add_object"){this._deepLinkHandled=!0,i(),this._ui("maintenance-object-dialog").then(E=>E?.openCreate());return}if(e==="open_vacation"||e==="open_budget"||e==="open_groups"||e==="open_settings"){if(this._deepLinkHandled=!0,i(),!this.hass?.user?.is_admin)return;this._overviewTab="settings",this._ensureLazyUi().then(()=>requestAnimationFrame(()=>{let E=this.shadowRoot?.querySelector("maintenance-settings-view"),x=e.replace("open_","");E?.scrollToSection?.(x)}));return}if(this.embedded&&!this._presetsApplied){this._presetsApplied=!0;let E=this.presets?.tab??"",x=(this.presets?.view??"").trim();if(!t.has("tab")&&Ee.includes(E)&&(E!=="settings"||this.hass?.user?.is_admin)&&(this._overviewTab=E),!t.has("view")&&x){let D=x.toLowerCase(),C=this._savedViews.find(b=>b.id===x)??this._savedViews.find(b=>b.name.trim().toLowerCase()===D);C&&(this._overviewTab="dashboard",this._applyView(C.id))}}let s=t.get("tab"),o=t.get("view"),c=t.get("sort"),n=t.get("status");if(s!==null||o!==null||c!==null||n!==null){if(i(),this._view!=="overview"&&(this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()),Ee.includes(s??"")&&(s!=="settings"||this.hass?.user?.is_admin)&&this._setOverviewTab(s),o!==null){let E=o.trim().toLowerCase(),x=this._savedViews.find(D=>D.id===o)??this._savedViews.find(D=>D.name.trim().toLowerCase()===E);x&&(this._overviewTab!=="dashboard"&&this._setOverviewTab("dashboard"),this._applyView(x.id))}Le.includes(c??"")&&(this._sortMode=c,this._activeViewId="",V(A.taskSort,this._sortMode)),os.includes(n??"")&&(this._overviewTab!=="dashboard"&&this._setOverviewTab("dashboard"),this._filterByStatus(n))}let u=t.get("area");if(u&&!t.get("entry_id")){this._deepLinkHandled=!0,i(),this._objects.some(E=>pi(E.object)===u)?this._showArea(u):this._showAllAreas();return}let p=t.get("entry_id");if(!p)return;this._deepLinkHandled=!0;let m=t.get("task_id"),v=t.get("action"),f=t.get("section"),y=ns.includes(f??"")?f:null,M=window.location.pathname+window.location.hash;history.replaceState(history.state,"",M);let j=this._getObject(p);if(!j){this._showOverview();return}if(m){let E=j.tasks.find(x=>x.id===m);if(!E){this._showObject(p,y);return}this._showTask(p,m),v==="complete"?requestAnimationFrame(()=>{this._openCompleteDialog(p,m,E.name,this._features.checklists?E.checklist:void 0,this._features.adaptive&&!!E.adaptive_config?.enabled,{viaTagScan:!0})}):v==="skip"?requestAnimationFrame(()=>{E.allow_skip!==!1&&this._promptSkipTask(p,m)}):v==="quick_complete"&&requestAnimationFrame(()=>{this._handleQuickComplete(p,m,E)})}else this._showObject(p,y)}_isCounterEntity(t){if(!t)return!1;let e=t.type||"threshold";return e==="counter"||e==="state_change"}async _fetchDetailStats(t,e){if(!this._statsService)return;let i=(this._detailStatsSeq.get(t)??0)+1;this._detailStatsSeq.set(t,i);let s=await this._statsService.getDetailStats(t,e,this._chartRangeDays);if(this._detailStatsSeq.get(t)!==i)return;let o=new Map(this._detailStatsData);o.set(t,s),this._detailStatsData=o}_setChartRange(t){if(t===this._chartRangeDays)return;this._chartRangeDays=t;try{V(A.chartRange,String(t))}catch{}let e=this._selectedEntryId&&this._selectedTaskId?this._getTask(this._selectedEntryId,this._selectedTaskId):null,i=e?.trigger_config?.entity_id;if(i){let s=new Map(this._detailStatsData);s.delete(i),this._detailStatsData=s,this._fetchDetailStats(i,this._isCounterEntity(e.trigger_config))}}_setHideOutliers(t){if(t!==this._hideOutliers){this._hideOutliers=t;try{V(A.chartHideOutliers,t?"1":"0")}catch{}}}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let t=[];for(let i of this._objects)for(let s of i.tasks){let o=s.trigger_config?.entity_id;o&&t.push({entityId:o,isCounter:this._isCounterEntity(s.trigger_config)})}if(t.length===0)return;let e=await this._statsService.getBatchMiniStats(t);this._miniStatsData=new Map([...this._miniStatsData,...e])}async _subscribe(){try{let t=await this.hass.connection.subscribeMessage(e=>{let i=e,s=zi(this._objects,i);s!==null&&(this._objects=s,e.objects&&Re(s,this._stats??null),this._refreshKpis(),this._detailOpen()&&(i.objects||(i.delta||[]).some(o=>o.entry_id===this._selectedEntryId))&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId))},{type:"maintenance_supporter/subscribe",deltas:!0,compact:!0});if(!this.isConnected){t();return}this._unsub=t}catch{}}async _refreshKpis(){if(this._kpiRefreshInFlight){this._kpiRefreshPending=!0;return}this._kpiRefreshInFlight=!0;try{do{this._kpiRefreshPending=!1;let[t,e]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null)]);if(!this.isConnected)return;t&&(this._stats=t),e&&(this._budget=e,Bt(this._budget))}while(this._kpiRefreshPending)}finally{this._kpiRefreshInFlight=!1}}get _taskRows(){let t=[];for(let p of this._objects)for(let m of p.tasks){if(!this._showArchived&&m.archived||this._filterStatus&&m.status!==this._filterStatus)continue;if(this._filterUser){let f=this._filterUser==="current_user"?this._userService?.getCurrentUserId():this._filterUser;if(m.responsible_user_id!==f)continue}if(this._filterLabel&&!(m.labels||[]).includes(this._filterLabel)||this._filterPriority&&(m.priority||"normal")!==this._filterPriority)continue;let v=[];for(let f of Object.values(this._groups))f.task_refs?.some(y=>y.entry_id===p.entry_id&&y.task_id===m.id)&&v.push(f.name);t.push({entry_id:p.entry_id,task_id:m.id,object_name:p.object.name,allow_skip:m.allow_skip!==!1,notify_enabled:m.notify_enabled!==!1,task_name:m.name,type:m.type,schedule_type:m.schedule_type,status:m.status,days_until_due:m.days_until_due??null,next_due:m.next_due??null,next_event_titles:m.next_event_titles??[],trigger_active:m.trigger_active,trigger_current_value:m.trigger_current_value??null,trigger_current_delta:m.trigger_current_delta??null,trigger_config:m.trigger_config??null,trigger_entity_info:m.trigger_entity_info??null,battery_fleet_task:m.battery_fleet_task===!0,times_performed:m.times_performed,total_cost:m.total_cost,interval_days:m.interval_days??null,interval_unit:m.interval_unit??null,interval_anchor:m.interval_anchor??null,is_done:m.is_done??!1,archived:m.archived??!1,history:m.history||[],enabled:m.enabled,nfc_tag_id:m.nfc_tag_id??null,priority:m.priority??"normal",labels:m.labels??[],area_id:p.object.area_id??null,responsible_user_id:m.responsible_user_id??null,group_names:v})}let e=(p,m)=>Ht(p.status)-Ht(m.status),i=(p,m)=>(p.days_until_due??99999)-(m.days_until_due??99999),s=(p,m)=>e(p,m)||i(p,m),o=p=>p.area_id&&this.hass?.areas?.[p.area_id]?.name||"",c=p=>p.responsible_user_id&&this._userService?.getUserName(p.responsible_user_id)||"",n=p=>p.group_names[0]||"",u={due_date:s,object:(p,m)=>p.object_name.localeCompare(m.object_name)||s(p,m),type:(p,m)=>p.type.localeCompare(m.type)||s(p,m),task_name:(p,m)=>p.task_name.localeCompare(m.task_name),area:(p,m)=>{let v=o(p),f=o(m);return!v&&f?1:v&&!f?-1:v.localeCompare(f)||s(p,m)},assigned_user:(p,m)=>{let v=c(p),f=c(m);return!v&&f?1:v&&!f?-1:v.localeCompare(f)||s(p,m)},group:(p,m)=>{let v=n(p),f=n(m);return!v&&f?1:v&&!f?-1:v.localeCompare(f)||s(p,m)}};return t.sort(u[this._sortMode]),t}_getObject(t){return this._objects.find(e=>e.entry_id===t)}_getTask(t,e){return this._getObject(t)?.tasks.find(s=>s.id===e)}_listRef(t,e){if(!this._refsInLists)return h;let i=this._getObject(t);return Mt(yt(i?.object,i?.tasks.find(s=>s.id===e)))}_objRef(t){return this._refsInLists?Mt(bt(t)):h}_pushPanelState(t,e,i,s){let o={msp_view:t,msp_entry:e||null,msp_task:i||null,msp_area:s||null};this._deepLinkInPlace?history.replaceState(o,""):history.pushState(o,"")}_onPopState(t){let e=t.state;if(e?.msp_view&&(this._view=e.msp_view,this._selectedEntryId=e.msp_entry||null,this._selectedTaskId=e.msp_task||null,this._selectedAreaId=e.msp_area||null,this._moreMenuOpen=!1,this._objectSectionOverride=null,e.msp_view==="all_parts"&&this._loadAllParts(),e.msp_view==="task"&&e.msp_entry&&e.msp_task)){this._historyFilter=null;let i=this._getTask(e.msp_entry,e.msp_task);i?.trigger_config?.entity_id&&this._fetchDetailStats(i.trigger_config.entity_id,this._isCounterEntity(i.trigger_config))}}_showOverview(){this._pushPanelState("overview"),this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()}_showAllObjects(){this._pushPanelState("all_objects"),this._view="all_objects",this._objBulkMode=!1,this._objBulkSelected=new Set,this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_showAllParts(){this._pushPanelState("all_parts"),this._view="all_parts",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop(),this._loadAllParts()}async _loadAllParts(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});this._allParts=t.parts||[]}catch{this._allParts=[]}}_showAllAreas(){this._pushPanelState("all_areas"),this._view="all_areas",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_showArea(t){this._pushPanelState("area",null,null,t),this._view="area",this._selectedAreaId=t,this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_ensureAreaUi(){this._areaUi??=Promise.all([import("/maintenance_supporter_panelfiles/panel-chunks/areas-view-BVG6SHUQ.js"),import("/maintenance_supporter_panelfiles/panel-chunks/area-view-N4DMQN7V.js")]).catch(()=>{this._areaUi=null})}_filterByStatus(t){this._filterStatus=t,this._activeViewId="",this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard"),this._scrollContentToTop()}get _allLabels(){let t=new Set;for(let e of this._objects)for(let i of e.tasks)for(let s of i.labels||[])t.add(s);return[...t].sort((e,i)=>e.localeCompare(i))}get _currentFilters(){return{status:this._filterStatus,user_id:this._filterUser,label:this._filterLabel,priority:this._filterPriority,archived:this._showArchived,sort_mode:this._sortMode,group_by:this._groupByMode}}_applyView(t){if(this._activeViewId=t,!t)return;let e=this._savedViews.find(s=>s.id===t);if(!e)return;let i=e.filters;this._filterStatus=i.status||"",this._filterUser=i.user_id||null,this._filterLabel=i.label||null,this._filterPriority=i.priority||"",this._showArchived=!!i.archived,Le.includes(i.sort_mode)&&(this._sortMode=i.sort_mode),rs.includes(i.group_by)&&(this._groupByMode=i.group_by);try{V(A.taskSort,this._sortMode),V(A.groupBy,this._groupByMode)}catch{}this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard")}_openSavedViewsDialog(){this.shadowRoot.querySelector("maintenance-saved-views-dialog")?.open(this._currentFilters,this._savedViews)}_onSavedViewsChanged(t){this._savedViews=t.detail.views||[],this._activeViewId&&!this._savedViews.some(e=>e.id===this._activeViewId)&&(this._activeViewId="")}_scrollContentToTop(){requestAnimationFrame(()=>{let t=this.shadowRoot?.querySelector(".content");t&&t.scrollTo({top:0,behavior:"smooth"})})}_renderLineageLink(t,e){let i=t?this._objects.find(s=>s.entry_id===t):void 0;return i?r`<p class="meta">${e}:
      <a href="#" class="object-lineage-link" @click=${s=>{s.preventDefault(),this._showObject(i.entry_id)}}
        >${i.object.name}</a></p>`:h}_showObject(t,e=null){this._pushPanelState("object",t),this._view="object",this._selectedEntryId=t,this._selectedTaskId=null,this._objectSectionOverride=e,e?this._scrollToObjectSection(e):this._scrollContentToTop()}_scrollToObjectSection(t){this.updateComplete.then(()=>requestAnimationFrame(()=>{let e=this.shadowRoot?.querySelector(`.obj-section[data-section="${t}"]`);e?e.scrollIntoView({block:"start",behavior:"smooth"}):this._scrollContentToTop()}))}_toggleObjectSection(t){let e=new Set(this._objectSectionsCollapsed);this._objectSectionOverride===t||!e.has(t)?e.add(t):e.delete(t),this._objectSectionOverride===t&&(this._objectSectionOverride=null),this._objectSectionsCollapsed=e,V(A.objectSections,JSON.stringify([...e]))}_splitActive(){return this.split&&!this.narrow&&!this.tight&&this._view==="overview"&&this._overviewTab==="dashboard"&&!this._bulkMode}_detailOpen(){return(this._view==="task"||this._splitActive())&&!!this._selectedEntryId&&!!this._selectedTaskId}_showFullTaskPage(t,e){this._view!=="task"&&(this._pushPanelState("task",t,e),this._view="task",this._selectedEntryId=t,this._selectedTaskId=e,this._scrollContentToTop())}_showTask(t,e){if(this._splitActive()){this._selectedEntryId=t,this._selectedTaskId=e,this._activeTab="overview",this._historyFilter=null,this._historySearch="",this._resetStickyPane(),this._fetchFullHistory(t,e);let s=this._getTask(t,e);s?.trigger_config?.entity_id&&this._fetchDetailStats(s.trigger_config.entity_id,this._isCounterEntity(s.trigger_config));return}this._pushPanelState("task",t,e),this._view="task",this._selectedEntryId=t,this._selectedTaskId=e,this._activeTab="overview",this._historyFilter=null,this._historySearch="",this._scrollContentToTop(),this._fetchFullHistory(t,e);let i=this._getTask(t,e);if(i?.trigger_config?.entity_id){let s=i.trigger_config.entity_id,o=this._isCounterEntity(i.trigger_config);this._fetchDetailStats(s,o)}}_countText(t,e,i,s,o=this._lang){return s===1?a(e,o):a(t,o).replace(`{${i}}`,String(s))}_showToast(t,e="error"){this._toastTimer&&clearTimeout(this._toastTimer),this._toastKind=e,this._toastUndo=null,this._toastActionLabel="",this._toastMessage=t,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastTimer=null},4e3)}_showActionToast(t,e,i){this._showUndoToast(t,i),this._toastActionLabel=e}_showUndoToast(t,e){this._toastTimer&&clearTimeout(this._toastTimer),this._toastKind="info",this._toastActionLabel="",this._toastMessage=t,this._toastUndo=e,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastUndo=null,this._toastTimer=null},7e3)}_runToastUndo(){let t=this._toastUndo;this._toastTimer&&clearTimeout(this._toastTimer),this._toastMessage="",this._toastUndo=null,this._toastTimer=null,t?.()}_openPalette(){this._paletteQuery="",this._paletteActive=0,this._paletteOpen=!0,this._searchRemote=null,this.updateComplete.then(()=>{this.shadowRoot?.querySelector(".palette-input")?.focus()})}_closePalette(){this._paletteOpen=!1,this._paletteQuery="",this._searchRemote=null,this._searchTimer&&(clearTimeout(this._searchTimer),this._searchTimer=null)}_onPaletteInput(t){this._paletteQuery=t,this._paletteActive=0,this._searchTimer&&clearTimeout(this._searchTimer);let e=t.trim();if(e.length<xe){this._searchRemote=null;return}this._searchTimer=setTimeout(()=>{this._searchTimer=null;let i=++this._searchSeq;this.hass.connection.sendMessagePromise({type:"maintenance_supporter/search",query:e,limit:Rt.documents}).then(s=>{i!==this._searchSeq||!this._paletteOpen||(this._searchRemote={query:e,documents:s.documents||[],history:s.history||[]})}).catch(()=>{i!==this._searchSeq||!this._paletteOpen||(this._searchRemote={query:e,documents:[],history:[]})})},Js)}get _paletteResults(){let t=this._lang,e=this._paletteQuery.trim();if(e.length<xe&&!Qt(e))return[];let i=Yt(e);if(!i.length)return[];let s=[],o=[],c=[],n=Qt(e);if(n){for(let v of this._objects){let f=v.object;if(f.ref_no!==n.object)continue;let y=bt(f),M=(j,E)=>j?[E,a("archived",t)].filter(Boolean).join(" \xB7 "):E;n.task==null&&s.push({kind:"object",entryId:v.entry_id,label:f.name||"",sub:M(f.archived,a("object",t)),score:1e3,icon:"mdi:package-variant-closed",ref:y});for(let j of v.tasks)n.task!=null&&j.ref_no!==n.task||o.push({kind:"task",entryId:v.entry_id,taskId:j.id,label:j.name||"",sub:M(j.archived||f.archived,f.name||""),score:n.task==null?900:1e3,icon:"mdi:clipboard-check-outline",ref:yt(f,j)})}if(s.length||o.length){let v=this._searchRemote&&this._searchRemote.query===e?this._searchRemote:null,f=[...s,...o.slice(0,Rt.tasks)];for(let y of v?.history.slice(0,1)??[])f.push({kind:"history",entryId:y.entry_id,taskId:y.task_id,label:y.task_name||"",sub:[y.object_name,y.timestamp?G(y.timestamp,t):""].filter(Boolean).join(" \xB7 "),snippet:y.snippet||"",score:y.score,icon:"mdi:note-text-outline",ref:y.ref??null});return f}}for(let v of this._objects){let f=v.object;if(f.archived)continue;let y=f.name||"",M=Ct(i,[{text:y,weight:3},{text:f.manufacturer,weight:2},{text:f.model,weight:2},{text:f.serial_number,weight:2},{text:f.notes,weight:1}]);if(M>0){let j=[f.manufacturer,f.model].filter(Boolean).join(" ");s.push({kind:"object",entryId:v.entry_id,label:y,sub:j||a("object",t),score:M,icon:"mdi:package-variant-closed",ref:bt(f)})}for(let j of v.tasks){if(j.archived)continue;let E=(j.labels||[]).join(" "),x=Ct(i,[{text:j.name,weight:3},{text:y,weight:2},{text:E,weight:2},{text:j.notes,weight:1}]);if(x>0){let D=(j.labels||[]).length?`  #${(j.labels||[]).join(" #")}`:"";o.push({kind:"task",entryId:v.entry_id,taskId:j.id,label:j.name||"",sub:y+D,score:x,icon:"mdi:clipboard-check-outline",ref:yt(f,j)})}}for(let j of v.parts||[]){let E=Ct(i,[{text:j.name,weight:3},{text:j.mpn,weight:2},{text:j.vendor,weight:1},{text:j.storage_location,weight:1},{text:j.notes,weight:1}]);E>0&&c.push({kind:"part",entryId:v.entry_id,label:j.name||"",sub:[y,j.mpn].filter(Boolean).join(" \xB7 "),score:E,icon:"mdi:cog-outline"})}}let u=(v,f)=>f.score-v.score||v.label.localeCompare(f.label),p=[...s.sort(u).slice(0,Rt.objects),...o.sort(u).slice(0,Rt.tasks),...c.sort(u).slice(0,Rt.parts)],m=this._searchRemote&&this._searchRemote.query===e?this._searchRemote:null;if(m){let v=m.documents.slice(0,Rt.documents);for(let f of[...v.filter(y=>y.match!=="content"),...v.filter(y=>y.match==="content")])p.push({kind:f.match==="content"?"content":"document",entryId:f.entry_id,docId:f.id,docKind:f.kind,url:f.url,page:f.page??null,label:rt(f),sub:f.object_name||"",snippet:f.snippet||"",score:f.score,icon:f.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"});for(let f of m.history.slice(0,Rt.history))p.push({kind:"history",entryId:f.entry_id,taskId:f.task_id,label:f.task_name||"",ref:f.ref??null,sub:[f.object_name,f.timestamp?G(f.timestamp,t):""].filter(Boolean).join(" \xB7 "),snippet:f.snippet||"",score:f.score,icon:f.type==="skipped"?"mdi:skip-next-circle-outline":"mdi:note-text-outline"})}return p}_selectPaletteResult(t){let e=this._paletteQuery.trim();switch(this._closePalette(),t.kind){case"task":t.taskId&&this._showTask(t.entryId,t.taskId);return;case"history":if(!t.taskId)return;this._showTask(t.entryId,t.taskId),this._activeTab="history",this._historySearch=e;return;case"document":case"content":t.docKind==="weblink"?st(t.url)&&window.open(t.url,"_blank","noopener"):t.docId&&xt(this.hass,t.docId,t.page?`#page=${t.page}`:"").catch(()=>{}),this._showObject(t.entryId,"documents");return;case"part":this._showObject(t.entryId,"parts");return;default:this._showObject(t.entryId)}}_renderPalette(){if(!this._paletteOpen)return h;let t=this._lang,e=this._paletteResults,i=this._paletteQuery.trim(),s={object:a("objects",t),task:a("tasks",t),part:a("search_group_parts",t),document:a("documents",t),content:a("search_group_content",t),history:a("search_group_history",t)},o=i.length>=xe&&(!this._searchRemote||this._searchRemote.query!==i),c=null;return r`
      <div class="palette-backdrop" @click=${()=>this._closePalette()}>
        <div class="palette" role="dialog" aria-label=${a("search_open",t)} @click=${n=>n.stopPropagation()}>
          <input
            class="palette-input"
            type="text"
            placeholder="${a("palette_placeholder",t)}"
            .value=${this._paletteQuery}
            @input=${n=>this._onPaletteInput(n.target.value)}
          />
          <div class="palette-results">
            ${i.length<xe&&!Qt(i)?r`<div class="palette-empty">${a("search_empty_hint",t)}</div>`:e.length===0?r`<div class="palette-empty">${o?a("search_searching",t):a("palette_no_results",t)}</div>`:e.map((n,u)=>{let p=n.kind!==c?r`<div class="palette-group">${s[n.kind]}</div>`:h;return c=n.kind,r`
                      ${p}
                      <div class="palette-item ${u===this._paletteActive?"active":""} ${n.snippet?"has-snippet":""}"
                        @mouseenter=${()=>{this._paletteActive=u}}
                        @click=${()=>this._selectPaletteResult(n)}>
                        <ha-icon icon="${n.icon}"></ha-icon>
                        <div class="palette-main">
                          <div class="palette-line">
                            <span class="palette-label">${n.label}</span>
                            ${n.ref?r`<span class="ref-chip">#${n.ref}</span>`:h}
                            ${n.page?r`<span class="palette-page">${a("search_page",t).replace("{page}",String(n.page))}</span>`:h}
                            <span class="palette-sub">${n.sub}</span>
                          </div>
                          ${n.snippet?r`<div class="palette-snippet">${n.snippet}</div>`:h}
                        </div>
                      </div>
                    `})}
            ${e.length>0&&o?r`<div class="palette-group palette-waiting">${a("search_searching",t)}</div>`:h}
          </div>
          <div class="palette-hint">${a("palette_hint",t)}</div>
        </div>
      </div>
    `}_openAdoptProblemSensors(){this._ui("maintenance-adopt-problem-sensors-dialog").then(t=>t?.open())}async _onProblemSensorsAdopted(t){let e=t.detail?.tasks_created??0,i=t.detail?.created??[];await this._loadData();let s=this._countText("adopt_problem_done","adopt_problem_done_one","tasks",e);i.length>0?this._showActionToast(s,a("adopt_problem_configure",this._lang),()=>{let o=i[0],c=this._objects.find(u=>u.entry_id===o.entry_id),n=c?.tasks.find(u=>u.id===o.task_id);c&&n&&this._ui("maintenance-task-dialog").then(u=>u?.openEdit(o.entry_id,n))}):this._showToast(s,"info")}async _setupBatteryFleet(){let t=await P(this,{type:"maintenance_supporter/battery_fleet/setup",language:this.hass.language||"en"},{reload:async()=>{this._batteryFleetSetupAvailable=!1,await this._loadData()},onError:s=>this._showToast(s)});if(t===void 0)return;let e=this._objects.find(s=>s.entry_id===t?.entry_id),i=e?.tasks.find(s=>s.id===t?.task_id)||e?.tasks[0];e&&i&&this._showTask(e.entry_id,i.id),this._showToast(a("battery_fleet_setup_done",this._lang),"info")}_openSuggestedSetups(){this._ui("maintenance-suggested-setups-dialog").then(t=>t?.open())}_onResetsWired(t){let e=t.detail?.wired??0;this._showToast(this._countText("reset_offers_done","reset_offers_done_one","count",e),"info"),this._resetOffersLoaded=!1,this._resetOffersCount=0,this._maybeLoadResetOffers(),this._loadData()}_onSetupsAdopted(t){let e=t.detail?.tasks_created??0;this._showToast(this._countText("setups_done","setups_done_one","tasks",e),"info"),this._loadData()}async _openTemplateGallery(){this._templateGalleryOpen=!0;let t=await P(this,{type:"maintenance_supporter/templates",language:this._lang},{onError:e=>this._showToast(e)});t!==void 0&&(this._templateCategories=t?.categories||{},this._templates=(t?.templates||[]).filter(e=>!e.disabled),this._homeProfile=t?.profile??null)}async _createFromTemplate(t){let e=await P(this,{type:"maintenance_supporter/object/from_template",language:this._lang,template_id:t},{busy:i=>{this._templateBusy=i},reload:async()=>{this._templateGalleryOpen=!1,await this._loadData()},successToast:a("template_created",this._lang),onSuccess:i=>this._showToast(i,"info"),onError:i=>this._showToast(i)});e?.entry_id&&this._showObject(e.entry_id)}_categoryName(t){let e=this._templateCategories[t];return e&&(e[`name_${this._lang}`]||e.name_en)||t}_renderTemplateCard(t,e=!1){let i=this._lang,s=this._homeProfile?.country??null;return r`
      <button class="template-card ${t.dwelling_mismatch?"not-typical":""}" .disabled=${this._templateBusy}
        title=${t.dwelling_mismatch?a("templates_not_typical",i):""}
        @click=${()=>this._createFromTemplate(t.id)}>
        <span class="template-card-name">${t.name}</span>
        <span class="template-card-count">${t.tasks.length===1?a("templates_task_count_one",i):a("templates_task_count",i).replace("{n}",String(t.tasks.length))}</span>
        ${e&&t.reasons?.length?r`<span class="template-card-reasons">
              ${t.reasons.map(o=>r`<span class="template-card-reason">${ai(o,i,s)}</span>`)}
            </span>`:h}
        ${t.set_up?r`<span class="template-card-setup"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${a("templates_set_up",i)}</span>`:h}
      </button>
    `}_renderTemplateGallery(){if(!this._templateGalleryOpen)return h;let t=this._lang,e=new Map;for(let s of this._templates)e.has(s.category)||e.set(s.category,[]),e.get(s.category).push(s);for(let s of e.values())s.sort((o,c)=>+!!o.dwelling_mismatch-+!!c.dwelling_mismatch);let i=this._templates.filter(s=>s.recommended&&!s.set_up);return r`
      <div class="palette-backdrop" @click=${()=>{this._templateGalleryOpen=!1}}>
        <div class="template-gallery" @click=${s=>s.stopPropagation()}>
          <div class="template-gallery-head">
            <span>${a("templates_title",t)}</span>
            <ha-icon-button .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
              @click=${()=>{this._templateGalleryOpen=!1}}></ha-icon-button>
          </div>
          <div class="template-gallery-body">
            <div class="template-legal">
              <ha-icon icon="mdi:scale-balance"></ha-icon>
              <span>${a("templates_legal_hint",t)}</span>
            </div>
            ${i.length>0?r`
                  <div class="template-cat recommended">
                    <div class="template-cat-head">
                      <ha-icon icon="mdi:home-heart"></ha-icon>
                      ${a("templates_recommended_title",t)}
                    </div>
                    <div class="template-cat-hint">${a("templates_recommended_hint",t)}</div>
                    <div class="template-grid">${i.map(s=>this._renderTemplateCard(s,!0))}</div>
                  </div>`:h}
            ${this._templates.length===0?r`<div class="palette-empty">${a("loading",t)}…</div>`:[...e.entries()].map(([s,o])=>r`
                  <div class="template-cat">
                    <div class="template-cat-head">
                      <ha-icon icon="${this._templateCategories[s]?.icon||"mdi:folder-outline"}"></ha-icon>
                      ${this._categoryName(s)}
                    </div>
                    <div class="template-grid">${o.map(c=>this._renderTemplateCard(c))}</div>
                  </div>
                `)}
          </div>
        </div>
      </div>
    `}_bulkKey(t){return`${t.entry_id}:${t.task_id}`}_toggleBulkMode(){this._bulkMode=!this._bulkMode,this._bulkMenuOpen=!1,this._bulkMode||(this._bulkSelected=new Set)}_toggleBulkRow(t){let e=this._bulkKey(t),i=new Set(this._bulkSelected);i.has(e)?i.delete(e):i.add(e),this._bulkSelected=i}_bulkSelectAll(t){let e=t.map(s=>this._bulkKey(s)),i=e.every(s=>this._bulkSelected.has(s));this._bulkSelected=i?new Set:new Set(e)}async _runBulkItems(t,e,i,s,o){if(t.length===0)return;this._actionLoading=!0;let{done:c,failed:n}=await gi(this,t,e);this._actionLoading=!1,s(),await this._loadData();let u=mi(i(c.length),n,this._lang);o&&c.length>0?this._showUndoToast(u,()=>o(c)):this._showToast(u,n.length>0?"error":"info")}_runBulk(t,e,i,s){return this._runBulkItems(t.filter(o=>this._bulkSelected.has(this._bulkKey(o))),e,i,()=>{this._bulkSelected=new Set,this._bulkMode=!1},s)}async _bulkMove(t){let e=this._objects.filter(c=>!c.object.archived_at).sort((c,n)=>(c.object.name||"").localeCompare(n.object.name||""));if(!e.length||this._bulkSelected.size===0)return;let s=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("move_task_title",this._lang),message:a("bulk_move_message",this._lang),confirmText:a("move_task_title",this._lang),inputLabel:a("move_task_target",this._lang),inputValue:e[0].entry_id,options:e.map(c=>({value:c.entry_id,label:c.object.name||c.entry_id}))});if(!s?.confirmed||!s.value)return;let o=s.value;await this._runBulk(t.filter(c=>c.entry_id!==o),c=>({type:"maintenance_supporter/task/move",entry_id:c.entry_id,task_id:c.task_id,target_entry_id:o}),c=>a("bulk_moved",this._lang).replace("{n}",String(c)))}_toggleObjBulkMode(){this._objBulkMode=!this._objBulkMode,this._objBulkMode||(this._objBulkSelected=new Set)}_toggleObjBulk(t){let e=new Set(this._objBulkSelected);e.has(t)?e.delete(t):e.add(t),this._objBulkSelected=e}_objBulkSelectAll(t){let e=t.map(s=>s.entry_id),i=e.length>0&&e.every(s=>this._objBulkSelected.has(s));this._objBulkSelected=i?new Set:new Set(e)}_runObjBulk(t,e,i){return this._runBulkItems([...this._objBulkSelected],s=>({type:t,entry_id:s}),e,()=>{this._objBulkSelected=new Set,this._objBulkMode=!1},i?s=>{i(s)}:void 0)}async _objBulkDelete(){let t=this._objBulkSelected.size;t===0||!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:a("delete",this._lang),message:a("bulk_delete_objects_confirm",this._lang).replace("{n}",String(t)),confirmText:a("delete",this._lang),danger:!0})||await this._runObjBulk("maintenance_supporter/object/delete",s=>a("bulk_objects_deleted",this._lang).replace("{n}",String(s)))}_objBulkArchive(){this._runObjBulk("maintenance_supporter/object/archive",t=>a("bulk_objects_archived",this._lang).replace("{n}",String(t)),async t=>{for(let e of t)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/unarchive",entry_id:e})}catch{}await this._loadData()})}_renderObjBulkBar(t,e){let i=this._objBulkSelected.size,s=t.length>0&&t.every(o=>this._objBulkSelected.has(o.entry_id));return r`
      <div class="bulk-bar obj-bulk-bar">
        <label class="bulk-selectall">
          <input type="checkbox" .checked=${s} @change=${()=>this._objBulkSelectAll(t)} />
          ${a("bulk_select_all",e)}
        </label>
        <span class="bulk-count">${a("bulk_n_selected",e).replace("{n}",String(i))}</span>
        <span class="bulk-actions">
          <ha-button appearance="plain" class="obj-bulk-archive" .disabled=${i===0||this._actionLoading} @click=${()=>this._objBulkArchive()}>
            <ha-icon icon="mdi:archive-outline"></ha-icon> ${a("archive",e)}
          </ha-button>
          <ha-button appearance="filled" variant="danger" class="obj-bulk-delete" .disabled=${i===0||this._actionLoading} @click=${()=>this._objBulkDelete()}>
            <ha-icon icon="mdi:delete-outline"></ha-icon> ${a("delete",e)}
          </ha-button>
        </span>
      </div>
    `}_bulkComplete(t){this._runBulk(t,e=>({type:"maintenance_supporter/task/complete",entry_id:e.entry_id,task_id:e.task_id}),e=>a("bulk_completed",this._lang).replace("{n}",String(e)))}_bulkArchive(t){this._runBulk(t,e=>({type:"maintenance_supporter/task/archive",entry_id:e.entry_id,task_id:e.task_id}),e=>a("bulk_archived",this._lang).replace("{n}",String(e)),async e=>{for(let i of e)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/unarchive",entry_id:i.entry_id,task_id:i.task_id})}catch{}await this._loadData()})}async _runAction(t,e){let i=await P(this,t,{busy:s=>{this._actionLoading=s},reload:()=>this._loadData(),successToast:e?.successToast,onSuccess:s=>this._showToast(s,"info"),onError:s=>this._showToast(s)});return i===void 0?null:i??{}}async _deleteObject(t){if(!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:a("delete",this._lang),message:a("delete_object_confirm",this._lang),confirmText:a("delete",this._lang),danger:!0}))return;await this._runAction({type:"maintenance_supporter/object/delete",entry_id:t})&&this._showOverview()}_printObjectReport(t){let e=this._getObject(t);if(!e)return;let i=this._lang,s={title:a("report_title",i),generated:a("report_generated",i),manufacturer:a("manufacturer",i),model:a("model",i),serial:a("serial_number_label",i),installed:a("installed",i),warranty:a("warranty",i),area:a("area",i),notes:a("report_notes",i),tasksHeading:a("tasks",i),colTask:a("task_name",i),colType:a("report_col_type",i),colStatus:a("report_col_status",i),colSchedule:a("report_col_schedule",i),colLastDone:a("last_performed",i),colNextDue:a("next_due",i),colCost:a("cost",i),colTimes:a("report_times_done",i),totalCost:a("report_total_cost",i),scheduleLabel:c=>St(c,i),none:"\u2014",statusLabel:c=>a(c,i),typeLabel:c=>a(c,i)},o=Pi(e.object,e.tasks,s,c=>c?G(c,i):"",c=>Q(c,this._currencySymbol,i),new Date().toISOString());Ft(o)}async _duplicateObject(t){let e=await this._runAction({type:"maintenance_supporter/object/duplicate",entry_id:t},{successToast:a("object_duplicated",this._lang)});e?.entry_id&&this._showObject(e.entry_id)}async _deleteTask(t,e){if(!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:a("delete",this._lang),message:a("delete_task_confirm",this._lang),confirmText:a("delete",this._lang),danger:!0}))return;await this._runAction({type:"maintenance_supporter/task/delete",entry_id:t,task_id:e})&&this._showObject(t)}async _duplicateTask(t,e){this._moreMenuOpen=!1;let i=await this._runAction({type:"maintenance_supporter/task/duplicate",entry_id:t,task_id:e},{successToast:a("task_duplicated",this._lang)});i?.task_id&&this._showTask(t,i.task_id)}async _moveTask(t,e){this._moreMenuOpen=!1;let i=this._objects.filter(n=>n.entry_id!==t&&!n.object.archived_at).sort((n,u)=>(n.object.name||"").localeCompare(u.object.name||""));if(!i.length)return;let o=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("move_task_title",this._lang),message:a("move_task_message",this._lang),confirmText:a("move_task_title",this._lang),inputLabel:a("move_task_target",this._lang),inputValue:i[0].entry_id,options:i.map(n=>({value:n.entry_id,label:n.object.name||n.entry_id}))});if(!o?.confirmed||!o.value)return;let c=await this._runAction({type:"maintenance_supporter/task/move",entry_id:t,task_id:e,target_entry_id:o.value},{successToast:a("task_moved",this._lang)});c?.entry_id&&c.task_id&&this._showTask(c.entry_id,c.task_id)}async _toggleArchiveTask(t,e,i){await this._runAction({type:i?"maintenance_supporter/task/unarchive":"maintenance_supporter/task/archive",entry_id:t,task_id:e})&&!i&&this._showUndoToast(a("task_archived",this._lang),()=>this._toggleArchiveTask(t,e,!0))}async _toggleArchiveObject(t,e){await this._runAction({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:t})&&!e&&this._showUndoToast(a("object_archived",this._lang),()=>this._toggleArchiveObject(t,!0))}async _togglePauseObject(t,e){if(!e){let s=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("pause_object",this._lang),message:a("pause_until_prompt",this._lang),confirmText:a("pause_object",this._lang),inputLabel:a("pause_until_label",this._lang),inputType:"date"});if(!s?.confirmed)return;let o={type:"maintenance_supporter/object/pause",entry_id:t};s.value&&(o.until=s.value),await this._runAction(o)&&this._showUndoToast(a("object_paused",this._lang),()=>this._togglePauseObject(t,!0));return}await this._runAction({type:"maintenance_supporter/object/resume",entry_id:t},{successToast:a("object_resumed",this._lang)})}async _replaceObject(t,e){let s=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("replace_object",this._lang),message:a("replace_object_prompt",this._lang),confirmText:a("replace_object",this._lang),inputLabel:a("replace_name_label",this._lang),inputType:"text",inputValue:e});if(!s?.confirmed)return;let o=await this._runAction({type:"maintenance_supporter/object/replace",entry_id:t,name:s.value||e},{successToast:a("object_replaced",this._lang)});o?.entry_id&&this._showObject(o.entry_id)}async _skipTask(t,e,i){let s={type:"maintenance_supporter/task/skip",entry_id:t,task_id:e};i&&(s.reason=i),await this._runAction(s)}async _resetTask(t,e,i){let s={type:"maintenance_supporter/task/reset",entry_id:t,task_id:e};i&&(s.date=i),await this._runAction(s)}async _applySuggestion(t,e,i){await this._runAction({type:"maintenance_supporter/task/apply_suggestion",entry_id:t,task_id:e,interval:i})}_openSeasonalOverrides(t){let e=this.shadowRoot.querySelector("maintenance-seasonal-overrides-dialog");if(!e||!this._selectedEntryId)return;let i=t.adaptive_config?.seasonal_overrides;e.open(this._selectedEntryId,t.id,i)}async _reanalyzeInterval(t,e){let i=await this._runAction({type:"maintenance_supporter/task/analyze_interval",entry_id:t,task_id:e});i&&(i.recommended_interval?this._showToast(`${a("reanalyze_result",this._lang)}: ${i.recommended_interval} ${a("days",this._lang)} (${a(`confidence_${i.confidence}`,this._lang)}, ${i.data_points} ${a("data_points",this._lang)})`,"info"):this._showToast(a("reanalyze_insufficient_data",this._lang),"info"))}async _promptSkipTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let s=await i.prompt({title:a("skip",this._lang),message:a("skip_reason_prompt",this._lang),confirmText:a("skip",this._lang),inputLabel:a("reason_optional",this._lang),inputType:"text"});s.confirmed&&this._skipTask(t,e,s.value||void 0)}async _promptResetTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let s=await i.prompt({title:a("reset",this._lang),message:a("reset_date_prompt",this._lang),confirmText:a("reset",this._lang),inputLabel:a("reset_date_optional",this._lang),inputType:"date"});s.confirmed&&this._resetTask(t,e,s.value||void 0)}async _postponeTask(t,e,i){await this._runAction({type:"maintenance_supporter/task/postpone",entry_id:t,task_id:e,until:i},{successToast:a("postponed",this._lang)})}async _promptPostponeTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let s=await i.prompt({title:a("postpone",this._lang),message:a("postpone_date_prompt",this._lang),confirmText:a("postpone",this._lang),inputLabel:a("postpone_date_label",this._lang),inputType:"date"});!s.confirmed||!s.value||this._postponeTask(t,e,s.value)}async _snoozeTask(t,e){await this._runAction({type:"maintenance_supporter/task/snooze",entry_id:t,task_id:e},{successToast:a("snoozed",this._lang)})}_dismissSuggestion(t,e){t&&e&&this._dismissedSuggestions.add(`${t}_${e}`),this.requestUpdate()}async _handleQuickComplete(t,e,i){let s=null;if(await P(this,{type:"maintenance_supporter/task/quick_complete",entry_id:t,task_id:e},{fallbackKey:"action_error",onError:(c,n)=>{s={message:c,code:n?.code||""}}})===void 0){let{message:c,code:n}=s??{message:"",code:""};n==="no_defaults"||n==="completion_details_required"?this._openCompleteDialog(t,e,i.name,this._features.checklists?i.checklist:void 0,this._features.adaptive&&!!i.adaptive_config?.enabled,{viaTagScan:!0}):this._showToast(c);return}this._showToast(a("quick_complete_success",this._lang),"info");try{await this._loadData()}catch{}}async _printTaskWorksheet(t,e){let i=this._getObject(t),s=i?.tasks.find(n=>n.id===e);if(!i||!s)return;let o=se(),c=!1;this._actionLoading=!0;try{let n={type:"maintenance_supporter/qr/generate",entry_id:t,task_id:e,url_mode:"server"},[u,p]=await Promise.all([this.hass.connection.sendMessagePromise({...n,action:"view"}).catch(()=>null),this.hass.connection.sendMessagePromise({...n,action:"complete"}).catch(()=>null)]),m=null;try{let E=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:t})).documents||[]).find(x=>x.kind==="file"&&x.mime==="application/pdf"&&(x.task_ids||[]).includes(e)&&x.task_pages?.[e]);if(E){let x=E.task_pages[e],D=4,C={path:await Ke(this.hass,`/api/maintenance_supporter/document/${E.id}/excerpt?start=${x}&count=${D}`,3600)};m={title:rt(E)||"Manual",startPage:x,endPage:x+D-1,url:new URL(C.path,window.location.origin).toString(),vendorBase:new URL("/maintenance_supporter_vendor",window.location.origin).toString()}}}catch{}let v=this._lang,f={title:a("worksheet",v),object:a("object",v),type:a("maintenance_type",v),interval:a("interval",v),nextDue:a("next_due",v),lastDone:a("last_performed",v),priority:a("priority",v),checklist:a("checklist",v),notes:a("notes_label",v),scanView:a("worksheet_scan_view",v),scanComplete:a("worksheet_scan_complete",v),manualExcerpt:a("worksheet_manual_excerpt",v),pages:a("worksheet_pages",v),printedOn:a("worksheet_printed",v),never:a("worksheet_never",v),typeLabel:j=>a(j,v),statusLabel:j=>a(j,v),parts:a("consumes_parts_label",v)},y=(s.consumes_parts||[]).map(j=>ei(j,i.entry_id,this._objects,v)),M=Li(s,i.object.name,f,j=>G(j,v),j=>St(j,v),u?.svg_data_uri||null,p?.svg_data_uri||null,m,new Date().toISOString(),y,yt(i.object,s));Ft(M,o),c=!0}finally{c||o?.close(),this._actionLoading=!1}}_openManualDoc(t){if(t.kind!=="file"){st(t.url)&&window.open(t.url,"_blank","noopener");return}xt(this.hass,t.id).catch(()=>{})}_setChecklistItem(t,e,i,s){let o=`${t}/${e}`;this._checklistPending.set(o,{...this._checklistPending.get(o)??{},[i]:s});let c=this._checklistChain.then(async()=>{let n=this._getObject(t)?.tasks.find(f=>f.id===e);if(!n)return;let u=this._checklistPending.get(o)??{},p={},m=oe(n)?.checklist??(n.checklist||[]);for(let f of m)p[f]=f in u?u[f]:n.checklist_progress?.[f]??!1;await this._runAction({type:"maintenance_supporter/task/checklist_progress",entry_id:t,task_id:e,checklist_state:p});let v=this._checklistPending.get(o);if(v){for(let[f,y]of Object.entries(p))f in v&&v[f]===y&&delete v[f];Object.keys(v).length===0&&this._checklistPending.delete(o)}});return this._checklistChain=c.catch(()=>{}),c}_openCompleteDialog(t,e,i,s,o,c){this._ui("maintenance-complete-dialog").then(n=>n&&this._fillAndOpenCompleteDialog(n,t,e,i,s,o,c))}_fillAndOpenCompleteDialog(t,e,i,s,o,c,n){ni(t,oi({entryId:e,taskId:i,taskName:s,task:this._getTask(e,i),objects:this._objects,lang:this._lang,checklist:o,features:this._features,adaptiveEnabled:c,currencySymbol:this._currencySymbol,viaTagScan:n?.viaTagScan}),this._lang)}_openQrForObject(t,e){this._ui("maintenance-qr-dialog").then(i=>i?.openForObject(t,e))}_openQrForTask(t,e,i,s){this._ui("maintenance-qr-dialog").then(o=>o?.openForTask(t,e,i,s))}render(){return r`
      <div class="panel">
        ${this._staleBundle?r`
              <div class="update-banner" role="status">
                <ha-icon icon="mdi:update"></ha-icon>
                <span>${a("update_banner",this._lang)}</span>
                <ha-button appearance="plain" @click=${()=>location.reload()}>
                  ${a("update_reload",this._lang)}
                </ha-button>
              </div>
            `:h}
        ${this._rowActionNotice&&this.hass?.user?.is_admin?r`
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
          ${this._view==="overview"?this._renderOverview():this._view==="all_objects"?this._renderAllObjects():this._view==="all_parts"?this._renderAllParts():this._view==="all_areas"?this._renderAllAreas():this._view==="area"?this._renderArea():this._view==="object"?this._renderObjectDetail():this._renderTaskDetail()}
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
        .adaptiveFeature=${this._features.adaptive}
        .seasonalFeature=${this._features.seasonal}
        .environmentalFeature=${this._features.environmental}
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
        @reset-counters-wired=${t=>this._onResetsWired(t)}
      ></maintenance-suggested-setups-dialog>
      <maintenance-saved-views-dialog
        .hass=${this.hass}
        @saved-views-changed=${t=>this._onSavedViewsChanged(t)}
      ></maintenance-saved-views-dialog>
      ${this._toastMessage?r`<div class="toast ${this._toastKind}" role=${this._toastKind==="error"?"alert":"status"}>
        <span>${this._toastMessage}</span>
        ${this._toastUndo?r`<button class="toast-undo" @click=${()=>this._runToastUndo()}>${this._toastActionLabel||a("undo",this._lang)}</button>`:h}
      </div>`:h}
      ${this._renderPalette()}
      ${this._renderTemplateGallery()}
    `}_renderSearchButton(t){let e=this._lang;return r`<ha-icon-button
      class=${t}
      .path=${Xs}
      .label=${a("search_open",e)}
      title=${a("search_open",e)}
      @click=${()=>this._openPalette()}
    ></ha-icon-button>`}_renderHeader(){let t=[{label:a("maintenance",this._lang),action:()=>this._showOverview()}];if(this._view==="object"&&this._selectedEntryId){let e=this._getObject(this._selectedEntryId);t.push({label:e?.object.name||"Object"})}if(this._view==="task"&&this._selectedEntryId&&this._selectedTaskId){let e=this._getObject(this._selectedEntryId);t.push({label:e?.object.name||"Object",action:()=>this._showObject(this._selectedEntryId)});let i=this._getTask(this._selectedEntryId,this._selectedTaskId);t.push({label:i?.name||"Task"})}return this._view==="area"&&this._selectedAreaId&&(t.push({label:a("all_areas",this._lang),action:()=>this._showAllAreas()}),t.push({label:$e(this._selectedAreaId,this.hass?.areas,a("no_area",this._lang))})),r`
      <div class="header">
        ${this.narrow&&!this.embedded?r`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`:h}
        ${this._view!=="overview"?r`<ha-icon-button
              .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
              @click=${()=>{this._view==="task"?this._showObject(this._selectedEntryId):this._view==="area"?this._showAllAreas():this._showOverview()}}
            ></ha-icon-button>`:h}
        <div class="breadcrumbs">
          ${t.map((e,i)=>r`
              ${i>0?r`<span class="sep">/</span>`:h}
              ${e.action?r`<a @click=${e.action}>${e.label}</a>`:r`<span class="current">${e.label}</span>`}
            `)}
        </div>
        ${this._renderSearchButton("header-search")}
      </div>
    `}_renderOverview(){let t=this._lang,e=!!this.hass?.user?.is_admin,i=this._stats;return!e&&this._overviewTab==="settings"&&(this._overviewTab="dashboard"),r`
      ${i?r`
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
        ${e?r`
          <div class="tab ${this._overviewTab==="settings"?"active":""}"
            @click=${()=>this._setOverviewTab("settings")}>
            ${a("settings",t)}
          </div>
        `:h}
        ${this.narrow?h:this._renderSearchButton("tab-search")}
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
    `}_statusBadge(t,e,i){return he({archived:t,is_done:e,status:i},this._lang)}_setOverviewTab(t){this._overviewTab=t;try{V(A.overviewTab,t)}catch{}this._scrollContentToTop()}_renderToday(){let t=this._lang,e=this._taskRows,i=u=>`${u.entry_id}:${u.task_id}`,s=e.filter(u=>u.status==="overdue"||u.trigger_active),o=new Set(s.map(i)),c=e.filter(u=>!o.has(i(u))&&u.days_until_due===0);c.forEach(u=>o.add(i(u)));let n=e.filter(u=>!o.has(i(u))&&u.days_until_due!=null&&u.days_until_due>0&&u.days_until_due<=7);return s.length+c.length+n.length===0?r`
        <div class="today-empty">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <p>${a("today_all_caught_up",t)}</p>
        </div>
      `:r`
      <div class="today-view">
        ${this._renderTodaySection("today_overdue",s,"overdue")}
        ${this._renderTodaySection("today_due_today",c,"due_soon")}
        ${this._renderTodaySection("today_this_week",n,"")}
      </div>
    `}_renderTodaySection(t,e,i){if(e.length===0)return h;let s=this._lang,o=c=>this._filterUser||!c.responsible_user_id?null:this._userService?.getPerson(c.responsible_user_id)??null;return r`
      <div class="today-section">
        <div class="today-section-header ${i}">
          <span>${a(t,s)}</span><span class="today-badge">${e.length}</span>
        </div>
        ${e.map(c=>r`
          <div class="today-row" @click=${()=>this._showTask(c.entry_id,c.task_id)}>
            <span class="today-dot ${c.trigger_active?"triggered":c.status}"></span>
            <div class="today-main">
              <div class="today-task">${this._listRef(c.entry_id,c.task_id)}${c.task_name}${Pt(c.next_event_titles)}</div>
              <div class="today-object">
                <span class="today-object-text">${c.object_name} · ${jt(c.days_until_due,s)}</span>
                ${je(o(c),"today-person")}
              </div>
            </div>
            ${this._renderRowActions(s,()=>this._openCompleteDialogForRow(c),void 0,!1)}
          </div>
        `)}
      </div>
    `}_renderDashboard(){let t=this._stats,e=this._taskRows,i=this._lang,s=this._isOperator,o=this._objects.reduce((p,m)=>p+m.tasks.filter(v=>v.archived).length,0),c=new Set;for(let p of this._objects)for(let m of p.tasks)m.responsible_user_id&&c.add(m.responsible_user_id);this._filterUser&&this._filterUser!=="current_user"&&c.add(this._filterUser);let n=[...c].map(p=>({id:p,name:this._userService?.getUserName(p)??null})).filter(p=>p.name!==null||p.id===this._filterUser).sort((p,m)=>(p.name??"").localeCompare(m.name??"")),u=(this._filterStatus?1:0)+(this._filterUser?1:0)+(this._filterLabel?1:0)+(this._filterPriority?1:0)+(this._activeViewId?1:0);return r`

      ${this.narrow?r`
        <div class="mobile-controls">
          <ha-button
            class="mobile-toggle ${this._filtersOpen?"active":""}"
            @click=${()=>{this._filtersOpen=!this._filtersOpen}}
          >
            <ha-icon icon="mdi:filter-variant"></ha-icon>
            ${a("filter_label",i)}${u>0?` (${u})`:""}
          </ha-button>
          ${s?h:this._renderNewMenu(i)}
        </div>
      `:h}

      <div class="filter-bar ${this.narrow&&!this._filtersOpen?"collapsed":""}">
        <label class="filter-field">
          <span class="filter-label">${a("views_label",i)}</span>
          <select
            .value=${this._activeViewId}
            @change=${p=>this._applyView(p.target.value)}
          >
            <option value="">${a("views_none",i)}</option>
            ${this._savedViews.map(p=>r`<option value=${p.id} ?selected=${this._activeViewId===p.id}>${p.name}</option>`)}
          </select>
        </label>
        ${s?h:r`
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
            @change=${p=>{this._filterStatus=p.target.value,this._activeViewId=""}}
          >
            <option value="">${a("all",i)}</option>
            ${os.map(p=>r`<option value=${p} ?selected=${this._filterStatus===p}>${a(p,i)}</option>`)}
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${a("user_label",i)}</span>
          <select
            .value=${this._filterUser||""}
            @change=${p=>{let m=p.target.value;this._filterUser=m||null,this._activeViewId=""}}
          >
            <option value="">${a("all_users",i)}</option>
            <option value="current_user" ?selected=${this._filterUser==="current_user"}>${a("my_tasks",i)}</option>
            ${n.map(p=>r`<option value=${p.id} ?selected=${this._filterUser===p.id}>${p.name??p.id}</option>`)}
          </select>
        </label>
        ${this._allLabels.length>0?r`
          <label class="filter-field">
            <span class="filter-label">${a("label_filter",i)}</span>
            <select
              .value=${this._filterLabel||""}
              @change=${p=>{let m=p.target.value;this._filterLabel=m||null,this._activeViewId=""}}
            >
              <option value="">${a("all_labels",i)}</option>
              ${this._allLabels.map(p=>r`<option value=${p} ?selected=${this._filterLabel===p}>${p}</option>`)}
            </select>
          </label>
        `:h}
        <label class="filter-field">
          <span class="filter-label">${a("priority",i)}</span>
          <select
            .value=${this._filterPriority}
            @change=${p=>{this._filterPriority=p.target.value,this._activeViewId=""}}
          >
            <option value="">${a("all_priorities",i)}</option>
            ${["high","normal","low"].map(p=>r`<option value=${p} ?selected=${this._filterPriority===p}>${a(`priority_${p}`,i)}</option>`)}
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${a("sort_label",i)}</span>
          <select
            .value=${this._sortMode}
            @change=${p=>{this._sortMode=p.target.value,this._activeViewId="";try{V(A.taskSort,this._sortMode)}catch{}}}
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
            @change=${p=>{this._groupByMode=p.target.value,this._activeViewId="";try{V(A.groupBy,this._groupByMode)}catch{}}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${a("groupby_none",i)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${a("groupby_area",i)}</option>
            ${this._features.groups?r`<option value="group" ?selected=${this._groupByMode==="group"}>${a("groupby_group",i)}</option>`:h}
            <option value="user" ?selected=${this._groupByMode==="user"}>${a("groupby_user",i)}</option>
            <option value="object" ?selected=${this._groupByMode==="object"}>${a("groupby_object",i)}</option>
          </select>
        </label>
        ${o>0?r`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived,this._activeViewId=""}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?a("hide_archived",i):`${a("show_archived",i)} (${o})`}
          </ha-button>
        `:h}
        ${!s&&e.length>0?r`
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

      ${e.length===0?r`
            <div class="empty-state">
              <ha-svg-icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></ha-svg-icon>
              <p>${a("no_tasks",i)}</p>
              ${!s&&this._objects.length===0?r`
                <p class="empty-onboard-hint">${a("onboard_hint",i)}</p>
                <div class="empty-onboard-actions">
                  <ha-button appearance="filled" @click=${()=>this._openTemplateGallery()}>
                    <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon> ${a("templates_from",i)}
                  </ha-button>
                  <ha-button appearance="plain" @click=${()=>this._ui("maintenance-object-dialog").then(p=>p?.openCreate())}>
                    ${a("new_object",i)}
                  </ha-button>
                </div>
              `:h}
            </div>
          `:r`
            ${this._bulkMode?this._renderBulkBar(e,i):h}
            ${this._splitActive()?r`
                  <div class="split-layout">
                    <div class="split-list">
                      ${this._groupByMode==="none"?this._renderTaskTable(e):this._renderGroupedTasks(e,i)}
                    </div>
                    <div class="split-pane">
                      ${this._selectedEntryId&&this._selectedTaskId&&this._getTask(this._selectedEntryId,this._selectedTaskId)?this._renderTaskDetail():r`<div class="split-pane-empty"><ha-icon icon="mdi:cursor-default-click-outline"></ha-icon><p>${a("split_select_hint",i)}</p></div>`}
                    </div>
                  </div>
                `:this._groupByMode==="none"?this._renderTaskTable(e):this._renderGroupedTasks(e,i)}
          `}

      ${this._features.groups&&!s?this._renderGroupsSection():h}
      ${s?h:r`<maintenance-storage-section-card
            .hass=${this.hass}
            .objects=${this._objects}
            @open-object=${p=>{let m=p.detail?.entry_id;m&&this._showObject(m)}}
          ></maintenance-storage-section-card>`}
    `}_renderTaskTable(t){let e=this._bulkMode?" bulk":"";if(this._virtTotalRows=t.length,this.narrow||t.length<120)return r`
        <div class="task-table${e}">
          ${t.map(p=>this._renderOverviewRow(p))}
        </div>
      `;let i=t.length,s=this._virtRowHeight,o=Math.max(0,Math.min(this._virtStart,i)),c=this._virtEnd>0?Math.min(this._virtEnd,i):Math.min(i,40);c<o&&(o=0,c=Math.min(i,40));let n=o*s,u=(i-c)*s;return r`
      <div class="task-table${e} virtual">
        ${this._renderVirtSizerRow(t)}
        ${n>0?r`<div class="virt-spacer" style="height:${n}px"></div>`:h}
        ${t.slice(o,c).map(p=>this._renderOverviewRow(p))}
        ${u>0?r`<div class="virt-spacer" style="height:${u}px"></div>`:h}
      </div>
    `}_renderVirtSizerRow(t){let e=this._lang,i="",s=!1,o=!1,c=!1;for(let n of t){let u=n.archived?a("archived",e):n.is_done?a("completed",e):a(n.status,e);u.length>i.length&&(i=u),n.enabled||(s=!0),n.nfc_tag_id&&(o=!0),(n.priority==="high"||n.priority==="low")&&(c=!0)}return r`
      <div class="task-row virt-sizer" aria-hidden="true">
        ${this._bulkMode?r`<span></span>`:h}
        <span class="cell-badges">
          <span class="status-badge"><ha-icon icon="mdi:circle-medium"></ha-icon><span class="status-label">${i}</span></span>
          ${s?r`<span class="badge-disabled">${a("disabled",e)}</span>`:h}
          ${o?r`<span class="nfc-badge"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:h}
          ${c?r`<span class="priority-badge"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>`:h}
        </span>
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
    `}_renderBulkBar(t,e){let i=this._bulkSelected.size,s=t.length>0&&t.every(o=>this._bulkSelected.has(this._bulkKey(o)));return r`
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
          <span class="bulk-more-wrapper">
            <ha-button appearance="plain" class="bulk-more" title=${a("more_actions",e)} aria-label=${a("more_actions",e)} .disabled=${i===0||this._actionLoading}
              @click=${o=>{o.stopPropagation(),this._bulkMenuOpen=!this._bulkMenuOpen}}>
              <ha-icon icon="mdi:dots-vertical"></ha-icon>
            </ha-button>
            ${this._bulkMenuOpen?r`
              <div class="popup-menu" @click=${o=>o.stopPropagation()}>
                <div class="popup-menu-item bulk-move" @click=${()=>{this._bulkMenuOpen=!1,this._bulkMove(t)}}>${a("move_task",e)}</div>
              </div>
            `:h}
          </span>
        </span>
      </div>
    `}_renderGroupedTasks(t,e){let i=new Map,s=a("unassigned",e);for(let n of t){let u=[];this._groupByMode==="area"?u=[(n.area_id?this.hass?.areas?.[n.area_id]?.name:null)||s]:this._groupByMode==="user"?u=[(n.responsible_user_id?this._userService?.getUserName(n.responsible_user_id):null)||s]:this._groupByMode==="group"?u=n.group_names.length>0?n.group_names:[s]:this._groupByMode==="object"&&(u=[n.object_name]);for(let p of u)i.has(p)||i.set(p,[]),i.get(p).push(n)}let o=[...i.entries()].sort(([n],[u])=>n===s&&u!==s?1:u===s&&n!==s?-1:n.localeCompare(u)),c=this._groupByMode==="area"?"mdi:map-marker-outline":this._groupByMode==="group"?"mdi:folder-outline":this._groupByMode==="object"?"mdi:cube-outline":"mdi:account-outline";return r`
      <div class="task-table grouped${this._bulkMode?" bulk":""}">
        ${o.map(([n,u])=>{let p=!this._collapsedGroups.has(n);return r`
            <div class="group-section" ?open=${p}>
              <div
                class="group-section-header"
                role="button"
                tabindex="0"
                aria-expanded=${p?"true":"false"}
                @click=${()=>this._toggleGroup(n)}
                @keydown=${m=>{(m.key==="Enter"||m.key===" ")&&(m.preventDefault(),this._toggleGroup(n))}}
              >
                <ha-icon icon="${c}"></ha-icon>
                <span>${n}</span>
                <span class="group-section-count">(${u.length})</span>
              </div>
              ${p?r`<div class="group-rows">${u.map(m=>this._renderOverviewRow(m))}</div>`:h}
            </div>
          `})}
      </div>
    `}_toggleGroup(t){let e=new Set(this._collapsedGroups);e.has(t)?e.delete(t):e.add(t),this._collapsedGroups=e}_warrantyLabel(t,e,i){return t.kind==="expired"?a("warranty_expired",i):t.kind==="expiring"?a("warranty_expires_in",i).replace("{days}",String(t.days??0)):a("warranty_valid_until",i).replace("{date}",G(e,i))}_renderWarrantyMeta(t,e){let i=Oe(t);return r`<p class="meta">${a("warranty",e)}:
      <span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,t,e)}</span></p>`}_renderAllObjects(){let t=this._lang,e=this._isOperator,i=this._objectViewMode==="table"&&!this.narrow,s=this._objects.filter(p=>p.object.archived).length,o=p=>{let m=1/0;for(let v of p.tasks){let f=v.days_until_due;f!=null&&f<m&&(m=f)}return m},c=this._objects.filter(p=>this._showArchived||!p.object.archived);this._objectSortMode==="alphabetical"?c.sort((p,m)=>p.object.name.localeCompare(m.object.name)):this._objectSortMode==="task_count"?c.sort((p,m)=>m.tasks.length-p.tasks.length||p.object.name.localeCompare(m.object.name)):c.sort((p,m)=>o(p)-o(m)||p.object.name.localeCompare(m.object.name));let n=()=>{let p=new Map;for(let m of c){let v=m.object.area_id,f=v?this.hass?.areas?.[v]?.name||a("unassigned",t):a("no_area",t);p.has(f)||p.set(f,[]),p.get(f).push(m)}return new Map([...p.entries()].sort(([m],[v])=>m.localeCompare(v)))},u=p=>{let m=p.tasks.some(v=>v.status==="overdue"||v.status==="triggered");return r`
        <div class="object-card${m?" object-card-overdue":""}${this._objBulkMode?" selectable":""}${this._objBulkMode&&this._objBulkSelected.has(p.entry_id)?" bulk-selected":""}"
          @click=${()=>this._objBulkMode?this._toggleObjBulk(p.entry_id):this._showObject(p.entry_id)}>
          ${this._objBulkMode?r`<label class="obj-bulk-check bulk-check" @click=${v=>v.stopPropagation()}>
                <input type="checkbox" .checked=${this._objBulkSelected.has(p.entry_id)} @change=${()=>this._toggleObjBulk(p.entry_id)} />
              </label>`:h}
          ${m?r`<span class="overdue-dot" title="${a("has_overdue",t)}"></span>`:h}
          <div class="object-card-header">
            <span class="object-card-name">${this._objRef(p.object)}${p.object.name}</span>
            ${p.object.paused?r`<span class="paused-badge" title="${a("object_paused_badge",t)}${p.object.paused_until?` \u2014 ${G(p.object.paused_until,t)}`:""}">
                  <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
                </span>`:h}
            ${p.object.document_count?r`<span class="doc-badge" title="${p.object.document_count} ${a("documents",t)}">
                  <ha-icon icon="mdi:paperclip"></ha-icon>${p.object.document_count}
                </span>`:h}
            <span class="object-card-count">${p.tasks.length===1?a("templates_task_count_one",t):a("templates_task_count",t).replace("{n}",String(p.tasks.length))}</span>
          </div>
          ${p.object.manufacturer||p.object.model?r`<div class="object-card-meta">${[p.object.manufacturer,p.object.model].filter(Boolean).join(" ")}</div>`:h}
          ${p.tasks.length===0?r`<div class="object-card-empty">${a("no_tasks_yet",t)}</div>`:h}
        </div>
      `};return r`
      <div class="breadcrumb">
        <ha-icon-button @click=${()=>this._showOverview()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${a("all_objects",t)}</span>
        <button class="sibling-view-chip" @click=${()=>this._showAllParts()}>
          <ha-icon icon="mdi:package-variant-closed"></ha-icon> ${a("all_parts",t)}
        </button>
        <button class="sibling-view-chip" data-view="all_areas" @click=${()=>this._showAllAreas()}>
          <ha-icon icon="mdi:floor-plan"></ha-icon> ${a("all_areas",t)}
        </button>
      </div>
      <div class="filter-bar">
        <label class="filter-field">
          <span class="filter-label">${a("sort_label",t)}</span>
          <select
            .value=${this._objectSortMode}
            @change=${p=>{this._objectSortMode=p.target.value;try{V(A.objectSort,this._objectSortMode)}catch{}}}
          >
            <option value="alphabetical" ?selected=${this._objectSortMode==="alphabetical"}>${a("sort_alphabetical",t)}</option>
            <option value="due_soonest" ?selected=${this._objectSortMode==="due_soonest"}>${a("sort_due_soonest",t)}</option>
            <option value="task_count" ?selected=${this._objectSortMode==="task_count"}>${a("sort_task_count",t)}</option>
          </select>
        </label>
        ${this.narrow?h:r`
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
        ${i?h:r`
        <label class="filter-field">
          <span class="filter-label">${a("group_by_label",t)}</span>
          <select
            .value=${this._groupByMode}
            @change=${p=>{this._groupByMode=p.target.value;try{V(A.groupBy,this._groupByMode)}catch{}}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${a("groupby_none",t)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${a("groupby_area",t)}</option>
          </select>
        </label>
        `}
        ${e?h:r`
          <ha-button
            @click=${()=>this._ui("maintenance-object-dialog").then(p=>p?.openCreate())}
          >
            ${a("new_object",t)}
          </ha-button>
        `}
        <ha-button appearance="plain" @click=${()=>this._exportObjectsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${a("settings_export_csv",t)}
        </ha-button>
        ${e?h:r`
          <ha-button appearance="plain" class="bulk-toggle obj-bulk-toggle ${this._objBulkMode?"active":""}" @click=${()=>this._toggleObjBulkMode()}>
            <ha-icon icon="mdi:checkbox-multiple-marked-outline"></ha-icon>
            ${this._objBulkMode?a("cancel",t):a("bulk_select",t)}
          </ha-button>
        `}
        ${s>0?r`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?a("hide_archived",t):`${a("show_archived",t)} (${s})`}
          </ha-button>
        `:h}
      </div>
      ${this._objBulkMode?this._renderObjBulkBar(c,t):h}
      ${i?this._renderObjectsTable(c):this._groupByMode==="area"?r`
          ${[...n().entries()].map(([p,m])=>r`
            <details class="group-section" open>
              <summary class="group-section-header">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <span>${p}</span>
                <span class="group-section-count">(${m.length})</span>
              </summary>
              <div class="objects-grid">${m.map(u)}</div>
            </details>
          `)}
        `:r`<div class="objects-grid">${c.map(u)}</div>`}
    `}_setObjectViewMode(t){this._objectViewMode=t;try{V(A.objectView,t)}catch{}}_renderAllParts(){let t=this._lang,e=this._allParts,i=this._currencySymbol;return r`
      <div class="breadcrumb">
        <ha-icon-button @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${a("all_parts",t)}</span>
        <button class="sibling-view-chip" @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:devices"></ha-icon> ${a("all_objects",t)}
        </button>
        <button class="sibling-view-chip" data-view="all_areas" @click=${()=>this._showAllAreas()}>
          <ha-icon icon="mdi:floor-plan"></ha-icon> ${a("all_areas",t)}
        </button>
      </div>
      <div class="filter-bar">
        <ha-button appearance="plain" @click=${()=>this._exportPartsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${a("settings_export_csv",t)}
        </ha-button>
      </div>
      ${e===null?r`<div class="empty-state">…</div>`:e.length===0?r`<div class="empty-state">${a("parts_section",t)}: 0</div>`:r`
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
                ${e.map(s=>r`
                  <tr class="objects-table-row" @click=${()=>this._showObject(s.entry_id)}>
                    <td>
                      <span class="objects-table-name">${this._objRef(this._getObject(s.entry_id)?.object)}${s.name}</span>
                      ${s.low?r`<ha-icon class="part-low-icon" icon="mdi:cart-arrow-down"
                            title="${a("part_reorder_threshold",t)}: ${s.reorder_threshold}"></ha-icon>`:h}
                    </td>
                    <td>${s.object_name||"\u2014"}</td>
                    <td>${s.stock!==null?Zt(s.stock,s.unit,t):"\u2014"}</td>
                    <td>${s.reorder_threshold??"\u2014"}</td>
                    <td>${s.cost!=null?Q(s.cost,i,t):"\u2014"}</td>
                    <td>${s.storage_location||"\u2014"}</td>
                    <td>
                      ${s.consumers.length===0?"\u2014":s.consumers.map(o=>r`
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
    `}_renderAllAreas(){let t=this._lang;return this._ensureAreaUi(),r`
      <div class="breadcrumb">
        <ha-icon-button @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${a("all_areas",t)}</span>
        <button class="sibling-view-chip" @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:devices"></ha-icon> ${a("all_objects",t)}
        </button>
        <button class="sibling-view-chip" @click=${()=>this._showAllParts()}>
          <ha-icon icon="mdi:package-variant-closed"></ha-icon> ${a("all_parts",t)}
        </button>
      </div>
      <maintenance-areas-view
        .hass=${this.hass}
        .objects=${this._objects}
        .showArchived=${this._showArchived}
        .currencySymbol=${this._currencySymbol}
        @open-area=${e=>this._showArea(e.detail.areaKey)}
        @archived-toggle=${()=>{this._showArchived=!this._showArchived}}
      ></maintenance-areas-view>
    `}_renderArea(){if(!this._selectedAreaId)return h;let t=this._lang;return this._ensureAreaUi(),r`
      <div class="breadcrumb">
        <ha-icon-button @click=${()=>this._showAllAreas()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${a("all_areas",t)}</span>
      </div>
      <maintenance-area-view
        .hass=${this.hass}
        .areaKey=${this._selectedAreaId}
        .objects=${this._objects}
        .showArchived=${this._showArchived}
        .currencySymbol=${this._currencySymbol}
        .userName=${e=>this._userService?.getUserName(e)??null}
        @open-object=${e=>this._showObject(e.detail.entryId)}
        @open-task=${e=>this._showTask(e.detail.entryId,e.detail.taskId)}
      ></maintenance-area-view>
    `}_exportPartsCsv(){let t=this._allParts||[],e=c=>{let n=c==null?"":String(c);return/[",\n;]/.test(n)?`"${n.replace(/"/g,'""')}"`:n},s=[["name","object","stock","unit","reorder_threshold","unit_cost","storage_location","vendor","used_by"].join(",")];for(let c of t)s.push([e(c.name),e(c.object_name),e(c.stock),e(c.unit),e(c.reorder_threshold),e(c.cost),e(c.storage_location),e(c.vendor),e(c.consumers.map(n=>`${n.object_name??""}/${n.task_name??n.task_id}\xD7${n.quantity}`).join(" | "))].join(","));let o=wt(new Date);ke(s.join(`
`),`maintenance_parts_${o}.csv`,"text/csv;charset=utf-8")}async _exportObjectsCsv(){let t=await P(this,{type:"maintenance_supporter/objects/csv"},{onError:i=>this._showToast(i)});if(!t)return;let e=wt(new Date);ke(t.csv,`maintenance_objects_${e}.csv`,"text/csv;charset=utf-8")}_renderObjectsTable(t){let e=this._lang,i=this._objectsTableColumns;return r`
      <div class="objects-table-wrap">
        <table class="objects-table">
          <thead>
            <tr>
              ${this._objBulkMode?r`<th class="oc-bulk"></th>`:h}
              ${i.map(s=>{let o=Ge.find(n=>n.key===s),c=o&&o.key!=="actions"?a(o.labelKey,e):"";return r`<th class="oc-${s}">${c}</th>`})}
            </tr>
          </thead>
          <tbody>
            ${t.map(s=>r`
              <tr class="objects-table-row${this._objBulkMode&&this._objBulkSelected.has(s.entry_id)?" bulk-selected":""}"
                @click=${()=>this._objBulkMode?this._toggleObjBulk(s.entry_id):this._showObject(s.entry_id)}>
                ${this._objBulkMode?r`<td class="oc-bulk"><input type="checkbox" .checked=${this._objBulkSelected.has(s.entry_id)}
                      @click=${o=>o.stopPropagation()} @change=${()=>this._toggleObjBulk(s.entry_id)} /></td>`:h}
                ${i.map(o=>this._renderObjectCell(o,s,e))}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `}_renderObjectCell(t,e,i){let s=e.object;switch(t){case"name":return r`<td class="oc-name">
          <span class="objects-table-name">${this._objRef(s)}${s.name}</span>
          ${s.document_count?r`<span class="doc-badge" title="${s.document_count} ${a("documents",i)}">
                <ha-icon icon="mdi:paperclip"></ha-icon>${s.document_count}
              </span>`:h}
        </td>`;case"manufacturer":return r`<td class="oc-manufacturer">${s.manufacturer||"\u2014"}</td>`;case"model":return r`<td class="oc-model">${s.model||"\u2014"}</td>`;case"serial_number":return r`<td class="oc-serial_number">${s.serial_number||"\u2014"}</td>`;case"installation_date":return r`<td class="oc-installation_date">${s.installation_date?G(s.installation_date,i):"\u2014"}</td>`;case"warranty_expiry":return r`<td class="oc-warranty_expiry">${this._renderWarrantyCell(s.warranty_expiry,i)}</td>`;case"area_id":{let o=s.area_id?this.hass?.areas?.[s.area_id]?.name||s.area_id:"\u2014";return r`<td class="oc-area_id">${o}</td>`}case"documentation_url":{let o=(s.manual_docs||[])[0];return r`<td class="oc-documentation_url">${st(s.documentation_url)?r`<a href=${s.documentation_url} target="_blank" rel="noopener noreferrer"
                @click=${c=>c.stopPropagation()}><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:o?r`<a href="#" title=${o.title}
                  @click=${c=>{c.preventDefault(),c.stopPropagation(),this._openManualDoc(o)}}
                  ><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:"\u2014"}</td>`}case"notes":return r`<td class="oc-notes" title=${s.notes||""}>${s.notes||"\u2014"}</td>`;case"task_count":return r`<td class="oc-task_count">${e.tasks.length}</td>`;case"ref_no":return r`<td class="oc-ref_no">${bt(s)?`#${bt(s)}`:"\u2014"}</td>`;case"actions":return r`<td class="oc-actions">
          <ha-icon-button class="obj-table-qr" title="${a("qr_code",i)}" @click=${o=>{o.stopPropagation(),this._openQrForObject(e.entry_id,s.name)}}>
            <ha-icon icon="mdi:qrcode"></ha-icon>
          </ha-icon-button>
        </td>`;default:return r`<td></td>`}}_renderWarrantyCell(t,e){let i=Oe(t);return i.kind==="none"?r`<span class="warranty-none">—</span>`:r`<span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,t,e)}</span>`}async _onSettingsChanged(){await this._loadData()}_renderGroupsSection(){if(!this._features.groups)return h;let t=Object.entries(this._groups),e=this._lang;return r`
      <div class="groups-section">
        <div class="groups-header">
          <h3>${a("groups",e)}</h3>
          <ha-button appearance="plain" @click=${()=>this._openGroupCreate()}>
            ${a("new_group",e)}
          </ha-button>
        </div>
        ${t.length===0?r`<div class="hint">${a("no_groups",e)}</div>`:r`
            <div class="groups-grid">
              ${t.map(([i,s])=>{let o=s.task_refs.map(c=>this._getTask(c.entry_id,c.task_id)?.name).filter(Boolean);return r`
                  <div class="group-card">
                    <div class="group-card-head">
                      <div class="group-card-name">${s.name}</div>
                      <div class="group-card-actions">
                        <ha-icon-button title="${a("edit",e)}" @click=${()=>this._openGroupEdit(i)}>
                          <ha-svg-icon path="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"></ha-svg-icon>
                        </ha-icon-button>
                        <ha-icon-button title="${a("delete",e)}" @click=${()=>this._deleteGroup(i,s.name)}>
                          <ha-svg-icon path="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z"></ha-svg-icon>
                        </ha-icon-button>
                      </div>
                    </div>
                    ${s.description?r`<div class="group-card-desc">${s.description}</div>`:h}
                    <div class="group-card-tasks">
                      ${o.length>0?o.map(c=>r`<span class="group-task-chip">${c}</span>`):r`<span style="font-size:12px;color:var(--secondary-text-color)">${a("no_tasks_short",e)}</span>`}
                    </div>
                  </div>
                `})}
            </div>
          `}
      </div>
    `}_openGroupCreate(){this.shadowRoot.querySelector("maintenance-group-dialog")?.openCreate()}_openGroupEdit(t){let e=this._groups[t];e&&this.shadowRoot.querySelector("maintenance-group-dialog")?.openEdit(t,e)}async _deleteGroup(t,e){await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:a("delete_group",this._lang),message:a("delete_group_confirm",this._lang).replace("{name}",e),confirmText:a("delete",this._lang),danger:!0})&&await this._runAction({type:"maintenance_supporter/group/delete",group_id:t})}_renderBudgetTiles(){let t=this._budget;if(!t)return h;let e=this._lang,i=this._currencySymbol,s=(o,c,n)=>{if(n!==null){let u=Math.min(100,Math.max(0,c/n*100)),p=u>=100?"var(--error-color, #f44336)":u>=t.alert_threshold_pct?"var(--warning-color, #ff9800)":"var(--success-color, #4caf50)";return r`
          <div class="stat-item budget-tile" title="${o}: ${Q(c,i,e)} / ${Q(n,i,e)}">
            <span class="stat-value budget-tile-value">${Q(c,i,e)}</span>
            <span class="budget-tile-max">/ ${Q(n,i,e)}</span>
            <div class="budget-tile-bar"><div style="width:${u}%; background:${p}"></div></div>
            <span class="stat-label">${o}</span>
          </div>
        `}return r`
        <div class="stat-item budget-tile" title="${o}: ${Q(c,i,e)}">
          <span class="stat-value budget-tile-value">${Q(c,i,e)}</span>
          <span class="stat-label">${o}</span>
        </div>
      `};return r`
      ${s(a("budget_monthly",e),t.monthly_spent||0,t.monthly_budget>0?t.monthly_budget:null)}
      ${s(a("budget_yearly",e),t.yearly_spent||0,t.yearly_budget>0?t.yearly_budget:null)}
    `}_renderOverviewRow(t){let e=this._lang,i=t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0,s=0,o=Jt.ok,c=!1;if(i&&t.days_until_due!==null){let v=ae(t.interval_days,t.days_until_due,t.interval_unit);s=v.pct,c=v.overflow,t.status==="overdue"?o=Jt.overdue:t.status==="due_soon"&&(o=Jt.due_soon)}let n=t.area_id?this.hass?.areas?.[t.area_id]?.name:null,u=t.responsible_user_id?this._userService?.getUserName(t.responsible_user_id):null,p=t.group_names.length>0||n||u,m=this._bulkMode&&this._bulkSelected.has(this._bulkKey(t));return r`
      <div class="task-row${t.enabled?"":" task-disabled"}${m?" bulk-selected":""}${this._splitActive()&&t.entry_id===this._selectedEntryId&&t.task_id===this._selectedTaskId?" selected":""}">
        ${this._bulkMode?r`
          <label class="cell bulk-check" @click=${v=>v.stopPropagation()}>
            <input type="checkbox" .checked=${m} @change=${()=>this._toggleBulkRow(t)} />
          </label>
        `:h}
        <span class="cell-badges">
          ${this._statusBadge(!!t.archived,t.is_done,t.status)}
          ${t.enabled?h:r`<span class="badge-disabled">${a("disabled",e)}</span>`}
          ${t.nfc_tag_id?r`<span class="nfc-badge" title="${a("nfc_linked",e)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:h}
          ${t.priority==="high"?r`<span class="priority-badge priority-high" title="${a("priority_high",e)}"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>`:h}
          ${t.priority==="low"?r`<span class="priority-badge priority-low" title="${a("priority_low",e)}"><ha-icon icon="mdi:chevron-double-down"></ha-icon></span>`:h}
        </span>
        <span class="row-head">
          <span class="cell object-name" @click=${v=>{v.stopPropagation(),this._showObject(t.entry_id)}}>${t.object_name}</span>
          <span class="cell task-name" @click=${()=>this._showTask(t.entry_id,t.task_id)}>${this._listRef(t.entry_id,t.task_id)}${t.task_name}${Pt(t.next_event_titles)}</span>
        </span>
        <span class="task-sub${p?"":" task-sub-empty"}">
          ${t.group_names.length>0?r`
            <span class="sub-chip" title="${a("groups",e)}">
              <ha-icon icon="mdi:folder-outline"></ha-icon>${t.group_names.join(", ")}
            </span>`:h}
          ${n?r`
            <span class="sub-chip">
              <ha-icon icon="mdi:map-marker-outline"></ha-icon>${n}
            </span>`:h}
          ${u?je(this._userService?.getPerson(t.responsible_user_id)??null,"sub-chip"):h}
          ${(t.labels||[]).map(v=>r`
            <span class="sub-chip label-chip" title="${a("labels",e)}">
              <ha-icon icon="mdi:tag-outline"></ha-icon>${v}
            </span>`)}
        </span>
        <span class="cell type">${a(t.type,e)}</span>
        <span class="due-cell" @click=${()=>this._showTask(t.entry_id,t.task_id)}>
          <span class="due-text">${jt(t.days_until_due,e)}</span>
          ${i?r`<div class="days-bar"><div class="days-bar-fill${c?" overflow":""}" style="width:${s}%;background:${o}"></div></div>`:h}
          ${t.trigger_config?ze(t,{trend:Ae(t,this._miniStatsData),lang:e}):!i&&t.trigger_active?r`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:h}
          ${Ie(t,this._miniStatsData,this._lang)}
        </span>
        ${this._renderRowActions(e,()=>this._openCompleteDialogForRow(t),()=>this._promptSkipTask(t.entry_id,t.task_id),t.allow_skip)}
      </div>
    `}_actionStyle(){return this._rowActionStyle}async _dismissRowActionNotice(t){let e={row_action_notice_pending:!1};t&&(e.row_action_style="icons"),await P(this,{type:"maintenance_supporter/global/update",settings:e},{onError:s=>this._showToast(s)})!==void 0&&(this._rowActionNotice=!1,t&&(this._rowActionStyle="icons"),xi())}_renderRowActions(t,e,i,s=!0){let o=this._actionStyle();return o==="buttons"||o==="buttons_compact"?o==="buttons_compact"&&(this.narrow||this.tight)?r`
          <span class="row-actions as-buttons compact">
            <ha-button size="small" appearance="accent" variant="success" title="${a("complete",t)}" aria-label="${a("complete",t)}" @click=${n=>{n.stopPropagation(),e()}}>
              <ha-icon icon="mdi:check"></ha-icon>
            </ha-button>
            ${s?r`
              <ha-button size="small" appearance="outlined" variant="warning" title="${a("skip",t)}" aria-label="${a("skip",t)}" ?disabled=${this._actionLoading} @click=${n=>{n.stopPropagation(),i?.()}}>
                <ha-icon icon="mdi:skip-next"></ha-icon>
              </ha-button>`:h}
          </span>`:r`
        <span class="row-actions as-buttons">
          <ha-button size="small" appearance="accent" variant="success" title="${a("complete",t)}" @click=${n=>{n.stopPropagation(),e()}}>
            <ha-icon slot="start" icon="mdi:check"></ha-icon>${a("complete",t)}
          </ha-button>
          ${s?r`
            <ha-button size="small" appearance="outlined" variant="warning" title="${a("skip",t)}" ?disabled=${this._actionLoading} @click=${n=>{n.stopPropagation(),i?.()}}>
              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>${a("skip",t)}
            </ha-button>`:h}
        </span>`:r`
      <span class="row-actions">
        <ha-icon-button class="btn-complete" title="${a("complete",t)}" @click=${c=>{c.stopPropagation(),e()}}>
          <ha-icon icon="mdi:check"></ha-icon>
        </ha-icon-button>
        ${s?r`
          <ha-icon-button class="btn-skip" title="${a("skip",t)}" .disabled=${this._actionLoading} @click=${c=>{c.stopPropagation(),i?.()}}>
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </ha-icon-button>`:h}
      </span>`}_openCompleteDialogForRow(t){let i=this._objects.find(s=>s.entry_id===t.entry_id)?.tasks.find(s=>s.id===t.task_id);this._openCompleteDialog(t.entry_id,t.task_id,t.task_name,this._features.checklists?i?.checklist:void 0,this._features.adaptive&&!!i?.adaptive_config?.enabled)}_renderObjectDetail(){if(!this._selectedEntryId)return h;let t=this._getObject(this._selectedEntryId);if(!t)return r`<p>Object not found.</p>`;let e=t.object,i=this._lang,s=this._isOperator,o=t.tasks.filter(n=>n.archived).length,c=t.tasks.filter(n=>this._showArchived||!n.archived);return r`
      <div class="detail-section">
        <div class="detail-header">
          <h2>${e.name} ${Mt(bt(e),a("ref_number",i))}</h2>
          <div class="action-buttons">
            ${s?h:r`
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(n=>n?.openCreate(t.entry_id))}}>${a("add_task",i)}</ha-button>
              <ha-button appearance="plain" @click=${()=>{this._ui("maintenance-object-dialog").then(n=>n?.openEdit(t.entry_id,e))}}>${a("edit",i)}</ha-button>
            `}
            <div class="more-menu-wrapper">
              <ha-icon-button .disabled=${this._actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${()=>this._toggleObjMenu()}></ha-icon-button>
              ${this._objMenuOpen?r`
                <div class="popup-menu" @click=${n=>n.stopPropagation()}>
                  <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._openQrForObject(t.entry_id,e.name)}}>${a("qr_code",i)}</div>
                  <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._printObjectReport(t.entry_id)}}>${a("report_button",i)}</div>
                  ${s?h:r`
                    <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._duplicateObject(t.entry_id)}}>${a("duplicate",i)}</div>
                    ${e.archived?h:r`
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
        ${e.paused?r`<p class="meta paused-meta">
              <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
              ${a("object_paused_badge",i)}${e.paused_until?r` — ${a("paused_until_label",i)} ${G(e.paused_until,i)}`:h}
            </p>`:h}
        ${e.manufacturer||e.model?r`<p class="meta">${[e.manufacturer,e.model].filter(Boolean).join(" ")}</p>`:h}
        ${e.serial_number?r`<p class="meta">${a("serial_number_label",i)}: ${e.serial_number}</p>`:h}
        ${this._renderLineageLink(e.predecessor_entry_id,a("object_replaces",i))}
        ${this._renderLineageLink(e.replaced_by_entry_id,a("object_replaced_by",i))}
        ${e.area_id?r`<p class="meta">${a("area",i)}:
              <a href="#" class="object-area-link" @click=${n=>{n.preventDefault(),this._showArea(e.area_id)}}
                >${$e(e.area_id,this.hass?.areas,a("no_area",i))}</a></p>`:h}
        ${st(e.documentation_url)?r`<p class="meta">${a("documentation_url_label",i)}:
              <a href=${e.documentation_url} target="_blank" rel="noopener noreferrer">${e.documentation_url}</a>
            </p>`:(e.manual_docs||[]).length?r`<p class="meta">${a("documentation_url_label",i)}:
                ${e.manual_docs.slice(0,3).map((n,u)=>r`${u>0?" \xB7 ":""}<a href="#"
                    @click=${p=>{p.preventDefault(),this._openManualDoc(n)}}>${n.title}</a>`)}${e.manual_docs.length>3?r` … +${e.manual_docs.length-3}`:h}
              </p>`:h}
        ${e.installation_date?r`<p class="meta">${a("installed",i)}: ${G(e.installation_date,i)}</p>`:h}
        ${e.warranty_expiry?this._renderWarrantyMeta(e.warranty_expiry,i):h}
        ${e.notes?r`<div class="object-notes">
              <div class="object-notes-label">${a("object_notes_label",i)}</div>
              <div class="object-notes-body">${re(e.notes)}</div>
            </div>`:h}

        ${this._renderObjectSection("tasks",a("tasks",i),c.length,()=>r`
        <h3>${a("tasks",i)} (${c.length})${o>0?r`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            appearance="plain"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?a("hide_archived",i):`${a("show_archived",i)} (${o})`}
          </ha-button>`:h}</h3>
        ${t.tasks.length===0?r`<div class="empty-state-centered">
              <p class="empty">${a("no_tasks_yet",i)}</p>
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(n=>n?.openCreate(t.entry_id))}}>${a("add_first_task",i)}</ha-button>
            </div>`:r`<div class="task-table object-tasks">${[...c].sort((n,u)=>Ht(n.status)-Ht(u.status)||(n.days_until_due??99999)-(u.days_until_due??99999)).map(n=>r`
              <div class="task-row${n.enabled?"":" task-disabled"}">
                <span class="cell-badges">
                  ${this._statusBadge(!!n.archived,!!n.is_done,n.status)}
                  ${n.enabled?h:r`<span class="badge-disabled">${a("disabled",i)}</span>`}
                  ${n.nfc_tag_id?r`<span class="nfc-badge" title="${a("nfc_linked",i)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:h}
                  ${n.document_count?r`<span class="doc-badge" title="${n.document_count} ${a("documents",i)}"><ha-icon icon="mdi:paperclip"></ha-icon>${n.document_count}</span>`:h}
                </span>
                <span class="cell task-name" @click=${()=>this._showTask(t.entry_id,n.id)}>${this._listRef(t.entry_id,n.id)}${n.name}${Pt(n.next_event_titles)}</span>
                <span class="task-sub${n.responsible_user_id?"":" task-sub-empty"}">${Pe(n,u=>this._userService?.getUserName(u)??null,u=>this._userService?.getPerson(u)??null)}</span>
                <span class="cell type">${a(n.type,i)}</span>
                <span class="due-cell" @click=${()=>this._showTask(t.entry_id,n.id)}>
                  <span class="due-text">${jt(n.days_until_due,i)}</span>
                  ${n.trigger_config?ze(n,{trend:Ae(n,this._miniStatsData),lang:i}):h}
                  ${Ie(n,this._miniStatsData,this._lang)}
                </span>
                ${this._renderRowActions(i,()=>this._openCompleteDialog(t.entry_id,n.id,n.name,this._features.checklists?n.checklist:void 0,this._features.adaptive&&!!n.adaptive_config?.enabled),()=>this._promptSkipTask(t.entry_id,n.id),n.allow_skip)}
              </div>
            `)}</div>`}
        `)}

        ${this._renderObjectSection("documents",a("documents",i),typeof e.document_count=="number"?e.document_count:null,()=>r`
        <maintenance-documents-section
          .hass=${this.hass}
          .entryId=${t.entry_id}
          .canWrite=${!s}
        ></maintenance-documents-section>
        `)}

        ${(t.parts||[]).length||!s?this._renderObjectSection("parts",a("parts_section",i),(t.parts||[]).length,()=>r`
        <maintenance-parts-section
          .hass=${this.hass}
          .entryId=${t.entry_id}
          .parts=${t.parts||[]}
          .canWrite=${!s}
          .currencySymbol=${this._currencySymbol}
          @parts-changed=${()=>this._loadData()}
        ></maintenance-parts-section>
        `):h}

        ${t.tasks.some(n=>(n.times_performed||0)>0||(n.history||[]).length>0)?this._renderObjectSection("history",a("object_history_section",i),null,()=>r`
        <maintenance-object-history-section
          .hass=${this.hass}
          .entryId=${t.entry_id}
          .object=${e}
          .tasks=${t.tasks}
          .currencySymbol=${this._currencySymbol}
          .userName=${n=>this._userService?.getUserName(n)??null}
          @open-task=${n=>this._showTask(t.entry_id,n.detail.taskId)}
        ></maintenance-object-history-section>
        `):h}
      </div>
    `}_renderObjectSection(t,e,i,s){let o=this._lang,c=this._objectSectionOverride===t||!this._objectSectionsCollapsed.has(t),n=c?a("section_collapse",o):a("section_expand",o);return r`
      <div class="obj-section ${t} ${c?"open":"collapsed"}" data-section=${t}>
        <button class="obj-section-toggle" type="button"
          aria-expanded=${c?"true":"false"}
          aria-label=${n} title=${n}
          @click=${()=>this._toggleObjectSection(t)}>
          <ha-icon icon=${c?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        ${c?r`<div class="obj-section-body">${s()}</div>`:r`<h3 class="obj-section-title" @click=${()=>this._toggleObjectSection(t)}>
              ${e}${i!==null?r`<span class="obj-section-count">${i}</span>`:h}
            </h3>`}
      </div>
    `}_renderNewMenu(t){return r`
      <div class="new-menu-wrapper">
        <ha-button appearance="filled" class="new-menu-button"
          @click=${e=>{e.stopPropagation(),this._toggleNewMenu()}}>
          <ha-icon icon="mdi:plus"></ha-icon> ${a("add",t)}
          <ha-icon icon="mdi:menu-down"></ha-icon>
        </ha-button>
        ${this._newMenuOpen?r`
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
            ${this._batteryFleetSetupAvailable?r`
              <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._setupBatteryFleet()}}>
                <ha-icon icon="mdi:battery-sync"></ha-icon> ${a("battery_fleet_setup_button",t)}
              </div>
            `:h}
          </div>
        `:h}
      </div>
    `}_togglePopup(t,e){let i=!t();e(i),i&&setTimeout(()=>{let s=()=>{e(!1),document.removeEventListener("click",s)};document.addEventListener("click",s)},0)}_toggleNewMenu(){this._togglePopup(()=>this._newMenuOpen,t=>{this._newMenuOpen=t})}_closeNewMenu(){this._newMenuOpen=!1}_isYoungInstall(){let t=this._objects.filter(i=>!i.object?.battery_fleet),e=t.reduce((i,s)=>i+s.tasks.length,0);return t.length<3&&e<8}_gsDismissed(){try{return new Set(JSON.parse(Z(A.gettingStartedDismissed)||"[]"))}catch{return new Set}}_dismissGettingStarted(t){let e=this._gsDismissed();e.add(t);try{V(A.gettingStartedDismissed,JSON.stringify([...e]))}catch{}this.requestUpdate()}_maybeLoadResetOffers(){this._resetOffersLoaded||(this._resetOffersLoaded=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/reset_offers"}).then(t=>{this._resetOffersCount=(t.offers||[]).length}).catch(()=>{this._resetOffersCount=0}))}_maybeLoadGettingStarted(){this._maybeLoadResetOffers(),!(this._gsLoaded||!this._isYoungInstall())&&(this._gsLoaded=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/discover"}).then(t=>{this._gsSetupsCount=(t.setups||[]).length}).catch(()=>{this._gsSetupsCount=0}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/problem_sensors/discover"}).then(t=>{this._gsAdoptCount=(t.sensors||[]).length}).catch(()=>{this._gsAdoptCount=0}))}_renderGettingStartedChips(t){let e=this._gsDismissed(),i=this._isYoungInstall(),s=[];return i&&this._gsSetupsCount>0&&!e.has("setups")&&s.push({id:"setups",icon:"mdi:auto-fix",text:this._countText("gs_setups_chip","gs_setups_chip_one","n",this._gsSetupsCount,t),run:()=>this._openSuggestedSetups()}),i&&this._gsAdoptCount>0&&!e.has("adopt")&&s.push({id:"adopt",icon:"mdi:alert-circle-check-outline",text:this._countText("gs_adopt_chip","gs_adopt_chip_one","n",this._gsAdoptCount,t),run:()=>this._openAdoptProblemSensors()}),this._resetOffersCount>0&&!e.has("resets")&&s.push({id:"resets",icon:"mdi:counter",text:this._countText("gs_reset_chip","gs_reset_chip_one","n",this._resetOffersCount,t),run:()=>this._openSuggestedSetups()}),this._batteryFleetSetupAvailable&&!e.has("fleet")&&s.push({id:"fleet",icon:"mdi:battery-sync",text:a("gs_fleet_chip",t),run:()=>this._setupBatteryFleet()}),s.length===0?h:r`
      <div class="gs-chips-wrap">
        <div class="gs-chips-label">${a("gs_label",t)}</div>
        <div class="gs-chips">
          ${s.map(o=>r`
            <div class="gs-chip" @click=${()=>o.run()}>
              <ha-icon icon="${o.icon}"></ha-icon>
              <span>${o.text}</span>
              <span class="gs-chip-x" title="${a("dismiss",t)}"
                @click=${c=>{c.stopPropagation(),this._dismissGettingStarted(o.id)}}>
                <ha-icon icon="mdi:close"></ha-icon>
              </span>
            </div>
          `)}
        </div>
      </div>
    `}_toggleObjMenu(){this._togglePopup(()=>this._objMenuOpen,t=>{this._objMenuOpen=t})}_closeObjMenu(){this._objMenuOpen=!1}_toggleMoreMenu(){this._togglePopup(()=>this._moreMenuOpen,t=>{this._moreMenuOpen=t})}_closeMoreMenu(){this._moreMenuOpen=!1}get _sparklineCtx(){return{lang:this._lang,detailStatsData:this._detailStatsData,hasStatsService:!!this._statsService,historyFallbackIds:this._statsService?.historyFallbackIds,isCounterEntity:t=>this._isCounterEntity(t),rangeDays:this._chartRangeDays,setRangeDays:t=>this._setChartRange(t),hideOutliers:this._hideOutliers,setHideOutliers:t=>this._setHideOutliers(t)}}_toggleSection(t){let e=new Set(this._collapsedSections);e.has(t)?e.delete(t):e.add(t),this._collapsedSections=e;try{V(A.collapsedSections,JSON.stringify([...e]))}catch{}}_historyCtx(){let t=this._selectedEntryId&&this._selectedTaskId?this._getObject(this._selectedEntryId)?.tasks.find(o=>o.id===this._selectedTaskId):void 0,e=this._fullHistory,i=e&&e.entryId===this._selectedEntryId&&e.taskId===this._selectedTaskId&&e.entries.length>(t?.history||[]).length?e.entries:t?.history||[],s=i.filter(o=>o.reading_value!=null).sort((o,c)=>o.timestamp.localeCompare(c.timestamp));return{lang:this._lang,hass:this.hass,filter:this._historyFilter,search:this._historySearch,currencySymbol:this._currencySymbol,setFilter:o=>{this._historyFilter=o},setSearch:o=>{this._historySearch=o},openEdit:this._isOperator?void 0:o=>this._openHistoryEdit(o),readingUnit:t?.reading_unit??null,taskRef:yt(this._selectedEntryId?this._getObject(this._selectedEntryId)?.object:null,t),phaseNames:Object.fromEntries(Object.entries(t?.phases||{}).map(([o,c])=>[o,c.name])),readingDelta:o=>{let c=s.findIndex(n=>n.timestamp===o.timestamp);return c<=0?null:o.reading_value-s[c-1].reading_value},readingSlotDelta:(o,c)=>ri(i,o,c)}}_taskDetailCtx(){let t=this._selectedEntryId,e=this._selectedTaskId,i=this._getObject(t);return{lang:this._lang,hass:this.hass,entryId:t,taskId:e,objectName:i?.object.name||"",taskRef:yt(i?.object,i?.tasks.find(s=>s.id===e)),objectDocUrl:i?.object?.documentation_url??null,objectManualDocs:i?.object?.manual_docs??[],openManualDoc:s=>this._openManualDoc(s),setChecklistItem:(s,o)=>this._setChecklistItem(t,e,s,o),setPhaseCursor:s=>{this._runAction({type:"maintenance_supporter/task/set_phase",entry_id:t,task_id:e,cursor:s})},isOperator:this._isOperator,actionLoading:this._actionLoading,moreMenuOpen:this._moreMenuOpen,activeTab:this._activeTab,features:this._features,currencySymbol:this._currencySymbol,collapsedSections:this._collapsedSections,costDurationToggle:this._costDurationToggle,suggestionDismissed:this._dismissedSuggestions.has(`${t}_${e}`),sparkline:this._sparklineCtx,history:this._historyCtx(),getUserName:s=>this._userService?.getUserName(s)??null,getPerson:s=>this._userService?.getPerson(s)??null,setActiveTab:s=>{this._activeTab=s},toggleSection:s=>this._toggleSection(s),setCostDurationToggle:s=>{this._costDurationToggle=s},showTaskView:()=>this._showFullTaskPage(t,e),showObject:()=>this._showObject(t),toggleMoreMenu:()=>this._toggleMoreMenu(),closeMoreMenu:()=>this._closeMoreMenu(),openEdit:s=>{this._ui("maintenance-task-dialog").then(o=>o?.openEdit(t,s))},openComplete:s=>this._openCompleteDialog(t,e,s.name,this._features.checklists?s.checklist:void 0,this._features.adaptive&&!!s.adaptive_config?.enabled),promptSkip:()=>this._promptSkipTask(t,e),toggleArchive:s=>this._toggleArchiveTask(t,e,s),openQr:s=>this._openQrForTask(t,e,i?.object.name||"",s),duplicateTask:()=>this._duplicateTask(t,e),moveTask:()=>this._moveTask(t,e),promptReset:()=>this._promptResetTask(t,e),promptPostpone:()=>this._promptPostponeTask(t,e),snoozeTask:()=>this._snoozeTask(t,e),printWorksheet:()=>this._printTaskWorksheet(t,e),deleteTask:()=>this._deleteTask(t,e),applySuggestion:s=>this._applySuggestion(t,e,s),reanalyze:()=>this._reanalyzeInterval(t,e),dismissSuggestion:()=>this._dismissSuggestion(t,e),openSeasonalOverrides:s=>this._openSeasonalOverrides(s)}}async _fetchFullHistory(t,e){try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:t,task_id:e});this._selectedEntryId===t&&this._selectedTaskId===e&&(this._fullHistory={entryId:t,taskId:e,entries:i.history||[]})}catch{this._fullHistory=null}}_renderTaskDetail(){if(!this._selectedEntryId||!this._selectedTaskId)return h;let t=this._getTask(this._selectedEntryId,this._selectedTaskId);if(!t)return r`<p>Task not found.</p>`;let e=this._fullHistory,i=e&&e.entryId===this._selectedEntryId&&e.taskId===this._selectedTaskId&&e.entries.length>(t.history||[]).length?{...t,history:e.entries}:t;return r`<maintenance-task-detail-view
      .task=${i}
      .ctx=${this._taskDetailCtx()}
    ></maintenance-task-detail-view>`}_openHistoryEdit(t){if(!this._selectedEntryId||!this._selectedTaskId)return;let e=this._getTask(this._selectedEntryId,this._selectedTaskId),i=wi(this._selectedEntryId,this._selectedTaskId,t,e);this.shadowRoot?.querySelector("maintenance-history-edit-dialog")?.openEdit(i)}};w.styles=[te,Hi],g([R({attribute:!1})],w.prototype,"hass",2),g([R({type:Boolean,reflect:!0})],w.prototype,"narrow",2),g([R({type:Boolean,reflect:!0})],w.prototype,"tight",2),g([R({type:Boolean,reflect:!0})],w.prototype,"split",2),g([R({attribute:!1})],w.prototype,"panel",2),g([R({type:Boolean,reflect:!0})],w.prototype,"embedded",2),g([R({attribute:!1})],w.prototype,"presets",2),g([_()],w.prototype,"_objects",2),g([_()],w.prototype,"_stats",2),g([_()],w.prototype,"_view",2),g([_()],w.prototype,"_allParts",2),g([_()],w.prototype,"_selectedEntryId",2),g([_()],w.prototype,"_selectedTaskId",2),g([_()],w.prototype,"_selectedAreaId",2),g([_()],w.prototype,"_filterStatus",2),g([_()],w.prototype,"_filterUser",2),g([_()],w.prototype,"_filterLabel",2),g([_()],w.prototype,"_filterPriority",2),g([_()],w.prototype,"_savedViews",2),g([_()],w.prototype,"_activeViewId",2),g([_()],w.prototype,"_unsub",2),g([_()],w.prototype,"_chartRangeDays",2),g([_()],w.prototype,"_hideOutliers",2),g([_()],w.prototype,"_historyFilter",2),g([_()],w.prototype,"_budget",2),g([_()],w.prototype,"_groups",2),g([_()],w.prototype,"_detailStatsData",2),g([_()],w.prototype,"_miniStatsData",2),g([_()],w.prototype,"_features",2),g([_()],w.prototype,"_adminPanelUserIds",2),g([_()],w.prototype,"_operatorWriteEnabled",2),g([_()],w.prototype,"_defaultWarningDays",2),g([_()],w.prototype,"_rowActionStyle",2),g([_()],w.prototype,"_refsInLists",2),g([_()],w.prototype,"_rowActionNotice",2),g([_()],w.prototype,"_actionLoading",2),g([_()],w.prototype,"_moreMenuOpen",2),g([_()],w.prototype,"_objMenuOpen",2),g([_()],w.prototype,"_toastMessage",2),g([_()],w.prototype,"_toastKind",2),g([_()],w.prototype,"_toastUndo",2),g([_()],w.prototype,"_toastActionLabel",2),g([_()],w.prototype,"_filtersOpen",2),g([_()],w.prototype,"_newMenuOpen",2),g([_()],w.prototype,"_gsSetupsCount",2),g([_()],w.prototype,"_gsAdoptCount",2),g([_()],w.prototype,"_resetOffersCount",2),g([_()],w.prototype,"_batteryFleetSetupAvailable",2),g([_()],w.prototype,"_staleBundle",2),g([_()],w.prototype,"_overviewTab",2),g([_()],w.prototype,"_activeTab",2),g([_()],w.prototype,"_costDurationToggle",2),g([_()],w.prototype,"_historySearch",2),g([_()],w.prototype,"_sortMode",2),g([_()],w.prototype,"_objectSortMode",2),g([_()],w.prototype,"_groupByMode",2),g([_()],w.prototype,"_objectViewMode",2),g([_()],w.prototype,"_objectsTableColumns",2),g([_()],w.prototype,"_showArchived",2),g([_()],w.prototype,"_bulkMode",2),g([_()],w.prototype,"_bulkSelected",2),g([_()],w.prototype,"_objBulkMode",2),g([_()],w.prototype,"_objBulkSelected",2),g([_()],w.prototype,"_bulkMenuOpen",2),g([_()],w.prototype,"_virtStart",2),g([_()],w.prototype,"_virtEnd",2),g([_()],w.prototype,"_collapsedGroups",2),g([_()],w.prototype,"_collapsedSections",2),g([_()],w.prototype,"_objectSectionsCollapsed",2),g([_()],w.prototype,"_objectSectionOverride",2),g([_()],w.prototype,"_paletteOpen",2),g([_()],w.prototype,"_paletteQuery",2),g([_()],w.prototype,"_paletteActive",2),g([_()],w.prototype,"_searchRemote",2),g([_()],w.prototype,"_templateGalleryOpen",2),g([_()],w.prototype,"_templates",2),g([_()],w.prototype,"_homeProfile",2),g([_()],w.prototype,"_templateCategories",2),g([_()],w.prototype,"_templateBusy",2),g([_()],w.prototype,"_fullHistory",2),w=g([Be("maintenance-supporter-panel")],w);export{w as MaintenanceSupporterPanel};
