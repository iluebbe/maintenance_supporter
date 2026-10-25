/*! maintenance_supporter frontend 2.111.0 */
import{a as Ai,b as Pi,c as Ii,g as Bi}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-TASGYARE.js";import{a as ss}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-GHJL7AFI.js";import{A as fs,B as vs,C as ys,D as xs,E as ks,F as ws,G as $s,H as Ot,I as js,J as Ts,K as Ss,L as Es,M as Os,T as Rs,W as Cs,a as ce,b as bi,c as He,d as Se,e as Ee,f as pt,g as qe,h as ft,i as Hi,j as Li,k as vt,l as Ui,m as Vi,n as as,o as R,p as st,q as Me,r as he,s as ls,t as Xt,u as Tt,v as Jt,w as cs,x as St,y as ds,z as ps}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ZZ2ZBMJT.js";import{f as rs,g as Ve,i as ns,j as jt,k as os}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ZOY6YCAE.js";import{a as $t}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-FIM2PXOZ.js";import{a as Di,b as _t,c as Re,d as mt,e as tt,f as bt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-DW64Z326.js";import{a as dt,c as Ne,d as Wi,e as Ki,f as Gi,g as xt,h as Yi,i as kt,j as Kt,z as wt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YIBZYHBN.js";import{a as hs,b as Zt,c as Et,d as ei,e as us}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-PCSRCP7C.js";import{a as Gt,b as _e,c as $e,d as Ue}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-C4AL3XKX.js";import{b as gs}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-MSZ535UK.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-IBCHWRFI.js";import{a as es,b as is}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LXO7O6XG.js";import{c as ts}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-SGM4ASVU.js";import{a as A,b as X,c as U}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BHEIEIWS.js";import{b as yt,c as qi,d as Fi,e as Ce}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-M27HOJKF.js";import{b as zi,i as Ni}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-5K6R4PTF.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-2QP5GPCM.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-URB336NM.js";import{a as Wt,c as x}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-UTXOBKDC.js";import{c as Qi,d as Yt,e as Xi}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-KWAMSPOD.js";import{l as it}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-VWNNSHNQ.js";import{a as _s,b as ms,c as bs}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BVBIOE2H.js";import{a as I,b as Ji,c as Zi,d as Qt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-VNWODCP2.js";import{A as $i,B as ji,C as ke,E as ve,F as Vt,H as Oe,I as Ti,J as ut,K as Fe,L as Xe,N as fe,O as ee,P as Si,Q as V,R as Je,T as q,U as Ei,W as we,X as Oi,Y as Ri,Z as Ze,a as _,aa as Ci,b as H,ba as Mi,c as n,d as Y,da as Le,ea as et,f as h,h as L,i as Ft,ia as gt,j as fi,k as vi,l as yi,m as S,n as f,o as ht,p as xi,q as ki,r as wi,s as Pe,v as N,w as s,x as Ut,y as oe}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-FW2FLQUC.js";var ua=["assignee_pool","required_completion_fields","checklist","labels","mirror_todo_entities","next_event_titles","history","readings"],ga=["checklist_progress"],_a=["tasks","parts"],ma=["manual_docs","battery_fleet_excluded"];function ti(l,d,e=[]){for(let t of d)l[t]===void 0&&(l[t]=[]);for(let t of e)l[t]===void 0&&(l[t]={})}function ba(l){let d=l;ti(d,_a),d.object&&typeof d.object=="object"&&ti(d.object,ma);for(let e of d.tasks)ti(e,ua,ga);return l}function at(l){for(let d of l)ba(d);return l}function fa(l,d){if(d.objects)return d.objects;let e=d.delta||[],t=d.removed||[];if(!e.length&&!t.length)return null;let i=new Map(l.map(a=>[a.entry_id,a]));for(let a of e)i.set(a.entry_id,a);for(let a of t)i.delete(a);return[...i.values()]}function Ms(l,d){return d.objects&&at(d.objects),d.delta&&at(d.delta),fa(l,d)}var ii=["today","dashboard","calendar","settings"];var va=168*3600*1e3;function Ds(){try{let l=X(A.objectsCache);if(!l)return null;let d=JSON.parse(l);return d.v!==Ft||!Number.isFinite(d.at)||Date.now()-d.at>va||!Array.isArray(d.objects)||d.objects.length===0?null:{objects:d.objects,stats:d.stats??null}}catch{return null}}function si(l,d){if(!(!Array.isArray(l)||l.length===0))try{let e={v:Ft,at:Date.now(),objects:l,stats:d};U(A.objectsCache,JSON.stringify(e))}catch{}}function rt(l){return l.responsible_user_id?[l.responsible_user_id]:[...new Set((l.assignee_pool||[]).filter(d=>typeof d=="string"&&d))]}function nt(l,d){return!!d&&rt(l).includes(d)}var ya={days:1,weeks:7,months:30.4368,years:365.25};function ai(l,d){return!l||l<=0?0:l*(ya[d||"days"]??1)}function Rt(l,d,e){let t=ai(l,e);if(t<=0||d==null)return{pct:0,overflow:!1};let i=(t-d)/t*100;return{pct:Math.max(0,Math.min(100,i)),overflow:i>100}}function As(l,d,e,t,i,a){let r=[[e.manufacturer,l.manufacturer],[e.model,l.model],[e.serial,l.serial_number],[e.installed,l.installation_date?t(l.installation_date):null],[e.warranty,l.warranty_expiry?t(l.warranty_expiry):null]].filter(([,u])=>!!u),o=d.map(u=>{let p=e.scheduleLabel(u);return`<tr>
      <td>${x(u.name)}</td>
      <td>${x(e.typeLabel(u.type))}</td>
      <td>${x(e.statusLabel(u.status))}</td>
      <td>${x(p)}</td>
      <td>${x(u.last_performed?t(u.last_performed):e.none)}</td>
      <td>${x(u.next_due?t(u.next_due):e.none)}</td>
      <td class="num">${u.times_performed??0}</td>
      <td class="num">${x(i(u.total_cost??0))}</td>
    </tr>`}).join(""),c=d.reduce((u,p)=>u+(p.total_cost??0),0);return`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${x(e.title)} \u2014 ${x(l.name)}</title>
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
  <h1>${x(l.name)}</h1>
  <p class="sub">${x(e.title)} \xB7 ${x(e.generated)}: ${x(t(a))}</p>
  ${r.length?`<div class="meta">${r.map(([u,p])=>`<div><div class="k">${x(u)}</div>${x(p)}</div>`).join("")}</div>`:""}
  <h2>${x(e.tasksHeading)} (${d.length})</h2>
  <table>
    <thead><tr>
      <th>${x(e.colTask)}</th><th>${x(e.colType)}</th><th>${x(e.colStatus)}</th>
      <th>${x(e.colSchedule)}</th><th>${x(e.colLastDone)}</th><th>${x(e.colNextDue)}</th>
      <th class="num">${x(e.colTimes)}</th><th class="num">${x(e.colCost)}</th>
    </tr></thead>
    <tbody>${o||`<tr><td colspan="8">${x(e.none)}</td></tr>`}</tbody>
    <tfoot><tr><td colspan="7">${x(e.totalCost)}</td><td class="num">${x(i(c))}</td></tr></tfoot>
  </table>
  ${l.notes?`<div class="notes"><strong>${x(e.notes)}:</strong>
${x(l.notes)}</div>`:""}
</body></html>`}var xa=60;function ri(l,d=ke()){if(!l)return{kind:"none",days:null,date:null};let e=Ti(d,l);return Number.isFinite(e)?e<0?{kind:"expired",days:e,date:l}:e<=xa?{kind:"expiring",days:e,date:l}:{kind:"valid",days:e,date:l}:{kind:"none",days:null,date:null}}function ka(l,d){let e=Date.parse(l);return Number.isNaN(e)?l.slice(0,10):d(ji(e,$i()))}function Ps(l,d,e,t,i,a,r,o,c,u=[],p=null){let g=[[e.object,x(d)],[e.type,x(e.typeLabel(l.type))],[e.interval,x(i(l))],[e.nextDue,l.next_due?x(t(l.next_due)):"\u2014"],[e.lastDone,l.last_performed?x(t(l.last_performed)):x(e.never)]];l.priority&&l.priority!=="normal"&&g.push([e.priority,x(e.priorityLabel(l.priority))]);let m=(l.checklist||[]).map(y=>`<li><span class="box"></span>${x(y)}</li>`).join(""),b=(y,$)=>y?`<figure class="qr"><img src="${y}" alt="" /><figcaption>${x($)}</figcaption></figure>`:"";return`<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="color-scheme" content="light">
<title>${x(l.name)} \u2014 ${x(e.title)}</title>
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
      <h1>${x(l.name)}${p?` <span class="ref">#${x(p)}</span>`:""}</h1>
      <div class="obj">${x(d)}</div>
    </div>
    <div class="qr-row">
      ${b(a,e.scanView)}
      ${b(r,e.scanComplete)}
    </div>
  </header>
  <table class="meta">
    ${g.map(([y,$])=>`<tr><td>${x(y)}</td><td>${$}</td></tr>`).join("")}
  </table>
  ${m?`<h2>${x(e.checklist)}</h2><ul class="check">${m}</ul>`:""}
  ${u.length?`<h2>${x(e.parts)}</h2><ul class="check">${u.map(y=>`<li><span class="box"></span>${x(y)}</li>`).join("")}</ul>`:""}
  ${l.notes?`<h2>${x(e.notes)}</h2><div class="notes">${x(l.notes)}</div>`:""}
  ${o?`<h2>${x(e.manualExcerpt)}</h2>
    <div class="excerpt">${x(o.title)} \u2014 ${x(e.pages)} ${o.startPage}\u2013${o.endPage}:
      <a href="${x(o.url)}" target="_blank" rel="noopener">PDF</a>
    </div>
    <div id="excerpt-pages" class="excerpt-pages"></div>
    ${o.vendorBase?`<script type="module">
      // Render the excerpt pages inline (downscaled, two per row) so the
      // whole work sheet prints as ONE document. The link above stays as
      // the fallback if pdf.js or the fetch fails.
      try {
        const pdfjs = await import(${JSON.stringify(o.vendorBase+"/pdf.min.mjs")});
        pdfjs.GlobalWorkerOptions.workerSrc = ${JSON.stringify(o.vendorBase+"/pdf.worker.min.mjs")};
        const doc = await pdfjs.getDocument({ url: ${JSON.stringify(o.url)} }).promise;
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
  <footer>${x(d)} \xB7 ${x(l.name)} \xB7 ${x(e.printedOn)} ${x(ka(c,t))}</footer>
</body></html>`}var Ie=["manual","warranty","invoice","spare_parts","photo","other"],Ct={manual:"mdi:book-open-variant",warranty:"mdi:shield-check",invoice:"mdi:receipt-text-outline",spare_parts:"mdi:cog-outline",photo:"mdi:image-outline",other:"mdi:file-document-outline"};function le(l){return l.title||l.filename||l.url||""}function We(l){return(l.tags||[]).find(d=>Ie.includes(d))??"other"}function Is(l){return(l.tags||[]).includes("photo")}function Ke(l){let d=(l??[]).filter(e=>!!e);return d.length?n`<span class="event-titles"> · ${d.join(", ")}</span>`:h}function Ge(l){return l?n`<span class="event-titles trigger-detail"> · ${l}</span>`:h}var zs=H`
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

  /* One line, never wider than the header: the path broke only at its
     spaces, so on a phone "Maintenance / HVAC System / Filter Replacement"
     pushed the search button off screen. The way up shrinks first; the
     current page keeps its name as long as it can. */
  .breadcrumbs { display: flex; align-items: center; gap: 4px; min-width: 0; }
  .breadcrumbs a, .breadcrumbs .current { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .breadcrumbs a { flex: 0 10 auto; color: inherit; opacity: 0.8; cursor: pointer; text-decoration: none; }
  .breadcrumbs a:hover { opacity: 1; text-decoration: underline; }
  .breadcrumbs .sep { flex: none; opacity: 0.5; margin: 0 4px; }
  .breadcrumbs .current { flex: 0 1 auto; font-weight: 500; }

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

  /* One-line rows line up on their FIRST TEXT LINE, not on their middles.
     The due cell is a stack (date, then bar, sensor value, sparkline) and
     "center" centred the whole stack, so in sensor rows the date sat 11-24 px
     above the type next to it. Baseline alignment puts status, object, task,
     type, date and the button labels on one line; whatever a cell stacks
     below hangs underneath. Only the one-line layout: narrow, tight and the
     768 px fallback lay their rows out in two lines of their own. */
  @media (min-width: 769px) {
    :host(:not([narrow]):not([tight])) .task-row { align-items: first baseline; }
    /* The status pill starts with its icon, which has no text, so the pill
       took its baseline from the icon's bottom edge and sat 3.5 px off the
       line. The label is the taller item, so this does not move it inside
       the pill. */
    :host(:not([narrow]):not([tight])) .task-row .status-label { align-self: baseline; }
    /* Icon-only actions have no text, so they would hang off their bottom
       edge. A zero-width character in their vertical middle gives the pair
       a baseline, and the buttons centre on the text line. */
    :host(:not([narrow]):not([tight])) .row-actions:not(.as-buttons)::before {
      content: "\\200b";
      margin-inline-end: -2px;
    }
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
  .today-section-header.triggered { border-left-color: var(--deep-orange-color, #ff5722); }
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
    color: var(--success-color, #4caf50); --mdc-icon-size: 14px;
  }
  .template-legal {
    display: flex; gap: 6px; align-items: flex-start; margin-top: 8px;
    font-size: 12px; color: var(--secondary-text-color);
  }
  .template-legal ha-icon { --mdc-icon-size: 16px; flex: none; margin-top: 1px; }
  /* #225: the gallery opened from Add sub-object says where the object goes. */
  .template-parent-hint {
    display: flex; gap: 8px; align-items: center; margin-top: 8px;
    font-size: 14px; color: var(--primary-text-color);
  }
  .template-parent-hint ha-icon { --mdc-icon-size: 18px; flex: none; color: var(--primary-color); }
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

  /* Name, object and up to six badges: on a phone they wrap — one row drew
     a postponed, assigned, muted task 505 px wide on a 360 px screen. */
  .task-header-title {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  .task-name-breadcrumb,
  .object-name-breadcrumb {
    cursor: pointer;
    color: var(--primary-text-color);
    text-decoration: none;
    overflow-wrap: anywhere;
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

  /* D#203: a manual task without a due date (outline, muted grey). */
  .status-chip.no_due {
    background: var(--maint-no-due-background, transparent);
    color: var(--secondary-text-color, #727272);
    box-shadow: inset 0 0 0 1px currentColor;
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
  /* #226: the Use pill beside the stock. */
  .all-parts-stock ms-part-use { margin-left: 8px; vertical-align: middle; }

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
  /* 2026-10 places: the object's place on its detail page. */
  .place-meta {
    display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  }
  .place-meta ha-icon { --mdc-icon-size: 16px; color: var(--secondary-text-color); }
  .place-missing-badge {
    font-size: 12px; color: var(--warning-color, #c77700);
  }
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
     bars <= 24px with a 2px gap and a rounded data end (dataviz specs).
     With a credit month (#200) the baseline is the minimum (labelled
     below) and a zero line runs between. */
  .area-chart-bars {
    position: relative;
    display: flex; align-items: flex-end; gap: 2px; height: 140px;
    border-top: 1px solid var(--divider-color); border-bottom: 1px solid var(--divider-color);
  }
  .area-chart-zero { position: absolute; left: 0; right: 0; border-top: 1px solid var(--secondary-text-color); opacity: 0.5; pointer-events: none; }
  .area-chart-min { font-size: 11px; color: var(--secondary-text-color); padding-top: 2px; }
  .area-bar { flex: 1 1 0; min-width: 0; height: 100%; display: flex; align-items: flex-end; justify-content: center; }
  .area-bar-fill { position: relative; width: 100%; max-width: 24px; min-height: 1px; background: var(--primary-color); border-radius: 4px 4px 0 0; }
  .area-bar-fill.credit { background: var(--success-color, #4caf50); border-radius: 0 0 4px 4px; }
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

  .popup-menu-item:hover,
  .popup-menu-item:focus-visible {
    background: var(--table-row-alternative-background-color, rgba(0, 0, 0, 0.04));
  }
  .popup-menu-item:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
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
    background: var(--success-color, #4caf50);
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
  /* The due column is 84-100 px on a phone: "100 / 100 cycles" does not fit,
     so the unit moves to a second line instead of being cut off. */
  :host([narrow]) .trigger-progress-text { white-space: normal; }

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
`;var Hs=300*1e3,wa=30,Mt=14;function ni(l,d,e,t){return`${l}:${d}:${e}:${t?"counter":"level"}`}var Dt=class{constructor(d){this._cache=new Map;this._pending=new Map;this.historyFallbackIds=new Set;this._hass=d}updateHass(d){this._hass=d}async getDetailStats(d,e,t=wa){return this._getStats(d,t<=35?"hour":"day",t,e)}async getMiniStats(d,e){return this._getStats(d,"day",Mt,e)}async getBatchMiniStats(d){let e=new Map,t=[];for(let c of d){let u=ni(c.entityId,"day",Mt,c.isCounter),p=this._cache.get(u);p&&Date.now()-p.fetchedAt<Hs?e.set(Ue(c.entityId,c.isCounter),p.points):t.push(c)}if(t.length===0)return e;let i=t.filter(c=>c.isCounter).map(c=>c.entityId),a=t.filter(c=>!c.isCounter).map(c=>c.entityId),r=new Date(Date.now()-Mt*24*60*60*1e3).toISOString(),o=[];return i.length>0&&o.push(this._fetchBatch(i,"day",r,["state","sum","change"],!0,e)),a.length>0&&o.push(this._fetchBatch(a,"day",r,["mean","min","max"],!1,e)),await Promise.all(o),e}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(d,e,t,i){let a=ni(d,e,t,i),r=this._cache.get(a);if(r&&Date.now()-r.fetchedAt<Hs)return r.points;if(this._pending.has(a))return this._pending.get(a);let o=this._fetchAndNormalize(d,e,t,i,a);this._pending.set(a,o);try{return await o}finally{this._pending.delete(a)}}async _fetchAndNormalize(d,e,t,i,a){let r=new Date(Date.now()-t*24*60*60*1e3).toISOString(),o=i?["state","sum","change"]:["mean","min","max"];try{let u=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:r,statistic_ids:[d],period:e,types:o}))[d]||[],p=this._normalizeRows(u,i);if(p.length<2){let g=await this._fetchHistoryFallback(d,r);g.length>=2?(p=g,this.historyFallbackIds.add(d)):this.historyFallbackIds.delete(d)}else this.historyFallbackIds.delete(d);return this._cache.set(a,{entityId:d,fetchedAt:Date.now(),period:e,points:p}),p}catch(c){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${d}:`,c),[]}}async _fetchHistoryFallback(d,e){try{let i=(await this._hass.connection.sendMessagePromise({type:"history/history_during_period",start_time:e,end_time:new Date().toISOString(),entity_ids:[d],minimal_response:!0,no_attributes:!0}))?.[d]||[];if(i.length>1e3){let o=Math.ceil(i.length/500);i=i.filter((c,u)=>u%o===0||u===i.length-1)}let a=[],r=null;for(let o of i){let c=o.s??o.state;if(c==null||c==="unknown"||c==="unavailable")continue;let u;if(c==="on"||c==="open"||c==="true")u=1;else if(c==="off"||c==="closed"||c==="false")u=0;else if(u=parseFloat(c),!Number.isFinite(u))continue;let p=o.lu??o.last_updated??o.last_changed,g=typeof p=="number"?p*1e3:p!=null?Date.parse(p):NaN;Number.isFinite(g)&&(r!=null&&r!==u&&a.push({ts:g,val:r}),a.push({ts:g,val:u}),r=u)}return a.sort((o,c)=>o.ts-c.ts),a.length&&r!=null&&a.push({ts:Date.now(),val:r}),a}catch(t){return console.warn(`[maintenance-supporter] History fallback failed for ${d}:`,t),[]}}async _fetchBatch(d,e,t,i,a,r){try{let o=await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:t,statistic_ids:d,period:e,types:i});for(let c of d){let u=o[c]||[],p=this._normalizeRows(u,a);r.set(Ue(c,a),p),this._cache.set(ni(c,e,Mt,a),{entityId:c,fetchedAt:Date.now(),period:e,points:p})}}catch(o){console.warn("[maintenance-supporter] Batch statistics fetch failed:",o)}}_normalizeRows(d,e){let t=[];for(let i of d){let a=null;if(e?a=i.state??null:a=i.mean??null,a===null)continue;let r={ts:i.start,val:a};e||(i.min!=null&&(r.min=i.min),i.max!=null&&(r.max=i.max)),t.push(r)}return t.sort((i,a)=>i.ts-a.ts),t}};function je(l,d){let e=l??0;return e<1024?`${e} B`:e<1024*1024?`${ee(e/1024,d,1)} KB`:`${ee(e/(1024*1024),d,1)} MB`}var At=8,oi=["newest","oldest","title","category"];function li(l){return oi.includes(l??"")?l:"newest"}function Ls(l,d){let e=new Intl.Collator(void 0,{numeric:!0,sensitivity:"base"}),t=o=>le(o).trim(),i=(o,c)=>e.compare(t(o),t(c)),a=o=>o.kind==="weblink"?Ie.length+1:Ie.indexOf(We(o)),r=[...l];switch(d){case"oldest":return r.sort((o,c)=>(o.added_at||"").localeCompare(c.added_at||""));case"title":return r.sort(i);case"category":return r.sort((o,c)=>a(o)-a(c)||i(o,c));default:return r.sort((o,c)=>(c.added_at||"").localeCompare(o.added_at||""))}}function Pt(l,d){let e=dt(d);if(!e.length)return l;let t=[];for(let i of l){let a=Ne(e,[{text:i.title,weight:3},{text:i.filename,weight:2},{text:(i.tags||[]).join(" "),weight:2},{text:i.description,weight:2},{text:i.url,weight:1}]);a>0&&t.push({doc:i,score:a})}return t.sort((i,a)=>a.score-i.score).map(i=>i.doc)}var F=class extends L{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._filter="";this._loaded=!1;this._busy=!1;this._error="";this._hint="";this._addingLink=!1;this._linkUrl="";this._linkTitle="";this._category="manual";this._thumbs={};this._lightboxUrl="";this._editingId="";this._editTitle="";this._editCategory="manual";this._editDescription="";this._linkDescription="";this._sort=li(X(A.docSort));this._dragOver=!1;this._loadedFor=null;this._loadSeq=0;this._localeReady=!1;this._singlePick=es()}_isImage(e){return e.kind==="file"&&(e.mime||"").startsWith("image/")}async _sign(e){return _t(this.hass,e.id)}get _lang(){return N(this.hass)}updated(e){if(super.updated(e),this.hass&&!this._localeReady&&(this._localeReady=!0,oe(this._lang).then(()=>this.requestUpdate())),this.hass&&this.entryId&&this._loadedFor!==this.entryId){let t=this._loadedFor!==null;this._loadedFor=this.entryId,t&&this._resetForObject(),this._load()}}_resetForObject(){this._docs=[],this._loaded=!1,this._thumbs={},this._filter="",this._error="",this._hint="",this._addingLink=!1,this._linkUrl="",this._linkTitle="",this._linkDescription="",this._editingId="",this._lightboxUrl=""}async _load(){let e=this.entryId,t=++this._loadSeq,i=()=>t!==this._loadSeq||e!==this.entryId,a="",r=await I(this,{type:"maintenance_supporter/documents/list",entry_id:e},{onError:o=>{a=o}});if(!i()){if(this._loaded=!0,r===void 0){this._error=a;return}this._docs=r?.documents||[],this._error="",this._thumbs={},this._loadThumbs(i)}}async _write(e,t,i){this._error="",await I(this,e,{busy:a=>{this._busy=a},fallbackKey:i,reload:async()=>{t?.(),await this._load()},onError:a=>{this._error=a}})}async _signed(e){await I(this,e,{onError:t=>{this._error=t}})}async _loadThumbs(e=()=>!1){await Promise.all(this._docs.filter(t=>this._isImage(t)).map(async t=>{try{let i=await this._sign(t);if(e())return;this._thumbs={...this._thumbs,[t.id]:i}}catch{}}))}_category_of(e){return We(e)}_labelKeydown(e){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),e.currentTarget.querySelector("input")?.click())}_onFileInput(e){let t=e.target,i=Array.from(t.files??[]);i.length&&this._uploadFiles(i),t.value=""}_onDrop(e){if(e.preventDefault(),this._dragOver=!1,!this.canWrite||this._busy)return;let t=Array.from(e.dataTransfer?.files??[]);t.length&&this._uploadFiles(t)}_onDragOver(e){this.canWrite&&(e.preventDefault(),this._dragOver=!0)}_onDragLeave(e){let t=e.relatedTarget;(!t||!e.currentTarget.contains(t))&&(this._dragOver=!1)}async _uploadFiles(e,t){let i=t??this._category,a=this.entryId;this._busy=!0,this._error="",this._hint="";let r=0,o=0,c=[];try{for(let u of e){let p;try{p=await ts(this.hass,a,u,[i])}catch(g){let m=g instanceof Error&&g.message==="doc_too_large"?"doc_too_large":"doc_upload_failed";c.push(`${u.name}: ${s(m,this._lang)}`);continue}p.duplicate_in_object?o++:p.deduped&&r++}if(a!==this.entryId)return;o?this._hint=s("doc_dup_in_object",this._lang):r&&(this._hint=s("doc_deduped",this._lang)),await this._load()}finally{c.length&&a===this.entryId&&(this._error=c.join(" \xB7 ")),this._busy=!1}}async _download(e){await this._signed(()=>mt(this.hass,e.id,e.filename||e.title||"document"))}async _preview(e){if(this._isImage(e)){this._lightboxUrl=this._thumbs[e.id]||await this._sign(e);return}await this._signed(()=>Re(this.hass,e.id))}_openDoc(e){e.kind==="file"?this._preview(e):ce(e.url)&&window.open(e.url,"_blank","noopener")}_startEdit(e){this._editingId=e.id,this._editTitle=e.title||"",this._editCategory=this._category_of(e),this._editDescription=e.description||"",this._addingLink=!1,this._error=""}_cancelEdit(){this._editingId=""}_setSort(e){this._sort=li(e),U(A.docSort,this._sort)}async _saveEdit(e){let t=(e.tags||[]).filter(a=>!Ie.includes(a)),i=e.kind==="file"?[this._editCategory,...t]:e.tags??[];await this._write({type:"maintenance_supporter/documents/update",doc_id:e.id,title:this._editTitle.trim()||e.filename||e.url||"",tags:i,description:this._editDescription.trim()},()=>{this._editingId=""})}async _delete(e){let t=le(e);window.confirm(s("doc_delete_confirm",this._lang).replace("{name}",t))&&await this._write({type:"maintenance_supporter/documents/delete",doc_id:e.id})}async _addLink(){let e=this._linkUrl.trim();if(!e)return;let t=this.entryId;await this._write({type:"maintenance_supporter/documents/add_link",entry_id:t,url:e,title:this._linkTitle.trim()||null,description:this._linkDescription.trim()||null},()=>{this._linkUrl="",this._linkTitle="",this._linkDescription="",this._addingLink=!1},"doc_link_not_allowed")}render(){let e=this._lang;return n`
      <div
        class="doc-zone ${this._dragOver?"drag-over":""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}
      >
        ${this._dragOver&&this.canWrite?n`<div class="drop-overlay">
              <ha-icon icon="mdi:tray-arrow-down"></ha-icon> ${s("doc_drop_hint",e)}
            </div>`:h}
      <div class="doc-header">
        <h3>${s("documents",e)} (${this._docs.length})</h3>
        ${this.canWrite?n`
              <div class="doc-actions">
                <select
                  class="cat-select"
                  .value=${this._category}
                  ?disabled=${this._busy}
                  @change=${t=>this._category=t.target.value}
                >
                  ${Ie.map(t=>n`<option value=${t}>${s(`doc_cat_${t}`,e)}</option>`)}
                </select>
                <label
                  class="btn primary ${this._busy?"disabled":""}"
                  role="button"
                  tabindex="0"
                  @keydown=${this._labelKeydown}
                >
                  <ha-icon icon="mdi:upload"></ha-icon>
                  ${this._busy?s("doc_uploading",e):s("doc_upload",e)}
                  <input type="file" ?multiple=${!this._singlePick} hidden ?disabled=${this._busy} @change=${this._onFileInput} />
                </label>
                <ms-photo-picker compact .showGallery=${!1} .lang=${e} .disabled=${this._busy}
                  @files-picked=${t=>this._uploadFiles(t.detail.files,"photo")}
                ></ms-photo-picker>
                <button class="btn" ?disabled=${this._busy} @click=${()=>this._addingLink=!this._addingLink}>
                  <ha-icon icon="mdi:link-variant"></ha-icon> ${s("doc_add_link",e)}
                </button>
              </div>
            `:h}
      </div>

      ${this._error?n`<div class="doc-msg error">${this._error}</div>`:h}
      ${this._hint?n`<div class="doc-msg hint">${this._hint}</div>`:h}

      ${this._addingLink&&this.canWrite?n`
            <div class="link-form">
              <input
                type="url"
                placeholder=${s("doc_link_url",e)}
                .value=${this._linkUrl}
                ?disabled=${this._busy}
                @input=${t=>this._linkUrl=t.target.value}
              />
              <input
                type="text"
                placeholder=${s("doc_link_title",e)}
                .value=${this._linkTitle}
                ?disabled=${this._busy}
                @input=${t=>this._linkTitle=t.target.value}
              />
              <input
                type="text"
                class="link-desc"
                placeholder=${s("doc_description",e)}
                .value=${this._linkDescription}
                ?disabled=${this._busy}
                @input=${t=>this._linkDescription=t.target.value}
              />
              <button class="btn primary" ?disabled=${this._busy||!this._linkUrl.trim()} @click=${this._addLink}>
                ${s("add",e)}
              </button>
              <button class="btn" ?disabled=${this._busy} @click=${()=>this._addingLink=!1}>
                ${s("cancel",e)}
              </button>
            </div>
          `:h}

      ${this._loaded&&this._docs.length>=2?n`<div class="doc-tools">
            <ha-icon icon="mdi:sort"></ha-icon>
            <select class="sort-select" aria-label=${s("doc_sort",e)} .value=${this._sort}
              @change=${t=>this._setSort(t.target.value)}>
              ${oi.map(t=>n`<option value=${t} ?selected=${t===this._sort}>${s(`doc_sort_${t}`,e)}</option>`)}
            </select>
          </div>`:h}
      ${this._loaded&&this._docs.length>=At?n`<div class="doc-filter">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input type="search" aria-label=${s("doc_search",e)} placeholder=${s("doc_search",e)}
              .value=${this._filter} @input=${t=>this._filter=t.target.value} />
          </div>`:h}
      ${this._loaded?this._docs.length===0?n`<div class="doc-empty">${s("documents_empty",e)}</div>`:(()=>{let t=this._filter.trim()?Pt(this._docs,this._filter):Ls(this._docs,this._sort);return t.length===0?n`<div class="doc-empty">${s("doc_search_none",e)}</div>`:n`<div class="doc-list">${t.map(i=>this._renderDoc(i,e))}</div>`})():n`<div class="doc-empty">${s("loading",e)}</div>`}

      ${this._lightboxUrl?n`<div class="lightbox" @click=${()=>this._lightboxUrl=""}>
            <img class="lightbox-img" src=${this._lightboxUrl} @click=${t=>t.stopPropagation()} />
            <button class="lightbox-close" title=${s("doc_close",e)} @click=${()=>this._lightboxUrl=""}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>`:h}
      </div>
    `}_renderDoc(e,t){if(this._editingId===e.id)return this._renderEdit(e,t);let i=e.kind==="file",a=this._category_of(e),r=i?`${s(`doc_cat_${a}`,t)} \xB7 ${je(e.size,t)}`:s("doc_link_badge",t),o=this._thumbs[e.id];return n`
      <div class="doc-row">
        ${i&&o?n`<img
              class="doc-thumb"
              src=${o}
              alt=${e.title||""}
              title=${s("doc_open",t)}
              @click=${()=>this._preview(e)}
            />`:n`<ha-icon
              class="doc-icon ${i?"clickable":""}"
              icon=${i?Ct[a]:"mdi:link-variant"}
              @click=${()=>i&&this._preview(e)}
            ></ha-icon>`}
        <div
          class="doc-info"
          role="button"
          tabindex="0"
          title=${s("doc_open",t)}
          @click=${()=>this._openDoc(e)}
          @keydown=${c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),this._openDoc(e))}}
        >
          <div class="doc-title">${le(e)}</div>
          <div class="doc-meta">${r}</div>
          ${e.description?n`<div class="doc-desc">${e.description}</div>`:h}
        </div>
        <div class="doc-row-actions">
          ${i?n`
                <button class="icon-btn" title=${s("doc_open",t)} @click=${()=>this._preview(e)}>
                  <ha-icon icon="mdi:eye-outline"></ha-icon>
                </button>
                <button class="icon-btn" title=${s("doc_download",t)} @click=${()=>this._download(e)}>
                  <ha-icon icon="mdi:download"></ha-icon>
                </button>`:n`<a
                class="icon-btn"
                href=${ce(e.url)?e.url:"#"}
                target="_blank"
                rel="noopener noreferrer"
                title=${s("doc_open",t)}
              ><ha-icon icon="mdi:open-in-new"></ha-icon></a>`}
          ${this.canWrite?n`
                <button class="icon-btn" title=${s("edit",t)} ?disabled=${this._busy} @click=${()=>this._startEdit(e)}>
                  <ha-icon icon="mdi:pencil"></ha-icon>
                </button>
                <button class="icon-btn danger" title=${s("delete",t)} ?disabled=${this._busy} @click=${()=>this._delete(e)}>
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>`:h}
        </div>
      </div>
    `}_renderEdit(e,t){let i=e.kind==="file";return n`
      <div class="doc-row editing">
        <input
          class="edit-title"
          type="text"
          placeholder=${s("doc_link_title",t)}
          .value=${this._editTitle}
          ?disabled=${this._busy}
          @input=${a=>this._editTitle=a.target.value}
        />
        ${i?n`<select
              class="cat-select"
              ?disabled=${this._busy}
              @change=${a=>this._editCategory=a.target.value}
            >
              ${Ie.map(a=>n`<option value=${a} ?selected=${a===this._editCategory}>${s(`doc_cat_${a}`,t)}</option>`)}
            </select>`:h}
        <input
          class="edit-desc"
          type="text"
          placeholder=${s("doc_description",t)}
          .value=${this._editDescription}
          ?disabled=${this._busy}
          @input=${a=>this._editDescription=a.target.value}
        />
        <button class="icon-btn" title=${s("save",t)} ?disabled=${this._busy||!this._editTitle.trim()} @click=${()=>this._saveEdit(e)}>
          <ha-icon icon="mdi:check"></ha-icon>
        </button>
        <button class="icon-btn" title=${s("cancel",t)} ?disabled=${this._busy} @click=${this._cancelEdit}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
    `}};F.styles=[is,H`
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
  `],_([S({attribute:!1})],F.prototype,"hass",2),_([S({attribute:!1})],F.prototype,"entryId",2),_([S({type:Boolean})],F.prototype,"canWrite",2),_([f()],F.prototype,"_docs",2),_([f()],F.prototype,"_filter",2),_([f()],F.prototype,"_loaded",2),_([f()],F.prototype,"_busy",2),_([f()],F.prototype,"_error",2),_([f()],F.prototype,"_hint",2),_([f()],F.prototype,"_addingLink",2),_([f()],F.prototype,"_linkUrl",2),_([f()],F.prototype,"_linkTitle",2),_([f()],F.prototype,"_category",2),_([f()],F.prototype,"_thumbs",2),_([f()],F.prototype,"_lightboxUrl",2),_([f()],F.prototype,"_editingId",2),_([f()],F.prototype,"_editTitle",2),_([f()],F.prototype,"_editCategory",2),_([f()],F.prototype,"_editDescription",2),_([f()],F.prototype,"_linkDescription",2),_([f()],F.prototype,"_sort",2),_([f()],F.prototype,"_dragOver",2);customElements.get("maintenance-documents-section")||customElements.define("maintenance-documents-section",F);function It(l,d,e){return s(`part_waiting_${l}`,e).replace("{count}",ee(d,e))}var de=class extends L{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._attachId="";this._filter="";this._loadedKey="";this._localeReady=!1}get _lang(){return N(this.hass)}get _refId(){return this.partId||this.taskId||""}get _linkField(){return this.partId?"part_ids":"task_ids"}updated(e){super.updated(e),this.hass&&!this._localeReady&&(this._localeReady=!0,oe(this._lang).then(()=>this.requestUpdate()));let t=`${this.entryId}|${this._refId}`;this.hass&&this.entryId&&this._refId&&this._loadedKey!==t&&(this._loadedKey=t,this._load())}async _load(){let e=await I(this,{type:"maintenance_supporter/documents/list",entry_id:this.entryId},{onError:t=>{this._error=t}});this._loaded=!0,e!==void 0&&(this._docs=e?.documents||[],this._error="")}async _update(e){this._error="",await I(this,{type:"maintenance_supporter/documents/update",...e},{busy:t=>{this._busy=t},reload:()=>this._load(),onError:t=>{this._error=t}})}async _signed(e){await I(this,e,{onError:t=>{this._error=t}})}_links(e){return e[this._linkField]||[]}_linked(){return this._docs.filter(e=>this._links(e).includes(this._refId))}_available(){return this._docs.filter(e=>!this._links(e).includes(this._refId))}async _setLinks(e,t){await this._update({doc_id:e.id,[this._linkField]:t})}_link(){let e=this._docs.find(t=>t.id===this._attachId);e&&(this._attachId="",this._setLinks(e,[...this._links(e),this._refId]))}_unlink(e){this._setLinks(e,this._links(e).filter(t=>t!==this._refId))}_isPdf(e){return e.mime==="application/pdf"||(e.filename||"").toLowerCase().endsWith(".pdf")}_pageFor(e){return this._isPdf(e)&&this.taskId?e.task_pages?.[this.taskId]:void 0}async _open(e){if(e.kind==="weblink"){ce(e.url)&&window.open(e.url,"_blank","noopener");return}let t=this._pageFor(e);await this._signed(()=>Re(this.hass,e.id,t?`#page=${t}`:""))}async _setPage(e,t){this.taskId&&await this._update({doc_id:e.id,task_pages:{[this.taskId]:t}})}async _download(e){await this._signed(()=>mt(this.hass,e.id,e.filename||e.title||"document"))}render(){if(!this._loaded||this._docs.length===0)return h;let e=this._lang,t=this._linked(),i=this._available();return n`
      <div class="task-docs">
        <h3><ha-icon icon="mdi:paperclip"></ha-icon> ${s("documents",e)} (${t.length})</h3>
        ${this._error?n`<div class="tdoc-error">${this._error}</div>`:h}
        ${t.length>=At?n`<div class="doc-filter">
              <ha-icon icon="mdi:magnify"></ha-icon>
              <input type="search" aria-label=${s("doc_search",e)} placeholder=${s("doc_search",e)}
                .value=${this._filter} @input=${a=>this._filter=a.target.value} />
            </div>`:h}
        ${t.length===0?n`<div class="tdoc-empty">${s(this.partId?"doc_part_none":"doc_task_none",e)}</div>`:(()=>{let a=Pt(t,this._filter);return a.length===0?n`<div class="tdoc-empty">${s("doc_search_none",e)}</div>`:n`<div class="tdoc-list">${a.map(r=>this._renderRow(r,e))}</div>`})()}
        ${this.canWrite&&i.length?n`<div class="tdoc-attach">
              <select
                class="tdoc-select"
                ?disabled=${this._busy}
                @change=${a=>this._attachId=a.target.value}
              >
                <option value="" ?selected=${!this._attachId}>${s("doc_link_existing",e)}</option>
                ${i.map(a=>n`<option value=${a.id} ?selected=${a.id===this._attachId}>${le(a)}</option>`)}
              </select>
              <button class="tdoc-btn" ?disabled=${this._busy||!this._attachId} @click=${this._link}>
                <ha-icon icon="mdi:link-variant-plus"></ha-icon> ${s("doc_attach",e)}
              </button>
            </div>`:h}
      </div>
    `}_renderRow(e,t){let i=e.kind==="file",a=this._isPdf(e),r=this._pageFor(e),o=We(e),c=i?je(e.size,t):s("doc_link_badge",t);return n`
      <div class="tdoc-row">
        <ha-icon class="tdoc-icon" icon=${i?Ct[o]:"mdi:link-variant"}></ha-icon>
        <div
          class="tdoc-info"
          role="button"
          tabindex="0"
          title=${r?`${s("doc_open",t)} \xB7 ${s("doc_page",t)} ${r}`:s("doc_open",t)}
          @click=${()=>this._open(e)}
          @keydown=${u=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),this._open(e))}}
        >
          <div class="tdoc-title">${le(e)}</div>
          ${e.description?n`<div class="tdoc-desc">${e.description}</div>`:h}
          <div class="tdoc-meta">
            ${c}${r?n` · <span class="tdoc-pagetag">${s("doc_page",t)} ${r}</span>`:h}
          </div>
        </div>
        ${this.canWrite&&a&&this.taskId?n`<input
              class="tdoc-page"
              type="number"
              min="1"
              inputmode="numeric"
              aria-label=${s("doc_page",t)}
              title=${s("doc_page",t)}
              placeholder=${s("doc_page",t)}
              .value=${r?String(r):""}
              ?disabled=${this._busy}
              @change=${u=>{let p=parseInt(u.target.value,10);this._setPage(e,Number.isFinite(p)&&p>=1?p:0)}}
            />`:h}
        <button class="icon-btn" title=${s("doc_open",t)} @click=${()=>this._open(e)}>
          <ha-icon icon=${i?"mdi:eye-outline":"mdi:open-in-new"}></ha-icon>
        </button>
        ${i?n`<button class="icon-btn" title=${s("doc_download",t)} @click=${()=>this._download(e)}>
              <ha-icon icon="mdi:download"></ha-icon>
            </button>`:h}
        ${this.canWrite?n`<button class="icon-btn" title=${s("doc_unlink",t)} ?disabled=${this._busy} @click=${()=>this._unlink(e)}>
              <ha-icon icon="mdi:link-variant-off"></ha-icon>
            </button>`:h}
      </div>
    `}};de.styles=H`
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
  `,_([S({attribute:!1})],de.prototype,"hass",2),_([S({attribute:!1})],de.prototype,"entryId",2),_([S({attribute:!1})],de.prototype,"taskId",2),_([S({attribute:!1})],de.prototype,"partId",2),_([S({type:Boolean})],de.prototype,"canWrite",2),_([f()],de.prototype,"_docs",2),_([f()],de.prototype,"_loaded",2),_([f()],de.prototype,"_busy",2),_([f()],de.prototype,"_error",2),_([f()],de.prototype,"_attachId",2),_([f()],de.prototype,"_filter",2);customElements.get("maintenance-task-documents")||customElements.define("maintenance-task-documents",de);function $a(l){let d=l.package_size;return typeof d=="number"&&Number.isFinite(d)&&d>0?d:1}var ue=class extends L{constructor(){super();this.notBooked=!1;this.nowrap=!1;this._open=!1;this._qty="";this._invalid=!1;this._busy=!1;this._error="";this.addEventListener("click",e=>e.stopPropagation())}get _lang(){return N(this.hass)}updated(){this.toggleAttribute("open",this._open)}_start(){this._qty=String($a(this.sparePart)),this._invalid=!1,this._error="",this._open=!0,this.updateComplete.then(()=>this.shadowRoot?.querySelector("input")?.select())}async _use(){if(this._busy)return;let e=parseFloat(this._qty);if(!Number.isFinite(e)||e<=0){this._invalid=!0;return}this._invalid=!1;let t=await I(this,{type:"maintenance_supporter/part/use",entry_id:this.entryId,part_id:this.sparePart.id,quantity:e},{busy:i=>{this._busy=i},onError:i=>{this._error=i}});t!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("part-used",{detail:{partId:this.sparePart.id,stock:t?.stock??0,restoring:t?.restoring??0},bubbles:!0,composed:!0})))}render(){let e=this._lang;return this._open?n`
      <span class="use-field">
        <input
          class=${this._invalid?"invalid":""}
          type="number"
          min="0"
          step="any"
          .value=${this._qty}
          aria-label=${s("part_use_how_many",e)}
          title=${s("part_use_how_many",e)}
          @input=${t=>this._qty=t.target.value}
          @keydown=${t=>{t.key==="Enter"&&this._use(),t.key==="Escape"&&(this._open=!1)}}
        />
        ${this.sparePart.unit?n`<span class="unit">${this.sparePart.unit}</span>`:h}
        <button class="use-pill confirm" title=${s("part_use_hint",e)} .disabled=${this._busy} @click=${()=>this._use()}>
          <ha-icon icon="mdi:check"></ha-icon>${s("part_use",e)}
        </button>
        <ha-icon-button class="use-cancel" title=${s("cancel",e)} @click=${()=>this._open=!1}
          ><ha-icon icon="mdi:close"></ha-icon
        ></ha-icon-button>
      </span>
      ${this.notBooked?n`<div class="note">${s("part_use_not_booked",e)}</div>`:h}
      ${this._error?n`<div class="error">${this._error}</div>`:h}
    `:n`<button class="use-pill" title=${s("part_use_hint",e)} @click=${()=>this._start()}>
        <ha-icon icon="mdi:package-variant-minus"></ha-icon>${s("part_use",e)}
      </button>`}};ue.styles=H`
    :host {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      max-width: 100%;
      white-space: normal;
    }
    .use-field {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
    }
    :host([nowrap]) .use-field {
      flex-wrap: nowrap;
    }
    .use-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font: inherit;
      font-size: 12px;
      font-weight: 400;
      padding: 2px 10px;
      min-height: 28px;
      border-radius: 14px;
      border: 1px solid var(--divider-color, #ccc);
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      white-space: nowrap;
    }
    .use-pill:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .use-pill.confirm {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .use-pill ha-icon {
      --mdc-icon-size: 16px;
    }
    input {
      width: 72px;
      padding: 4px;
      font: inherit;
      font-size: 13px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    input.invalid {
      border-color: var(--error-color, #f44336);
    }
    .unit {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .use-cancel {
      --ha-icon-button-size: 32px;
    }
    .note,
    .error {
      font-size: 12px;
      line-height: 1.4;
      max-width: 36ch;
    }
    .note {
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
  `,_([S({attribute:!1})],ue.prototype,"hass",2),_([S({attribute:!1})],ue.prototype,"entryId",2),_([S({attribute:!1})],ue.prototype,"sparePart",2),_([S({type:Boolean})],ue.prototype,"notBooked",2),_([S({type:Boolean,reflect:!0})],ue.prototype,"nowrap",2),_([f()],ue.prototype,"_open",2),_([f()],ue.prototype,"_qty",2),_([f()],ue.prototype,"_invalid",2),_([f()],ue.prototype,"_busy",2),_([f()],ue.prototype,"_error",2);customElements.get("ms-part-use")||customElements.define("ms-part-use",ue);var ja=["charge","sharpen","clean","dry","refill","restore"],Ta=500,Sa={name:"",vendor:"",mpn:"",gtin:"",storage_location:"",product_url:"",unit:"",cost:"",stock:"",reuse:"",restoring:"",cost_mode:"",reorder_threshold:"",restock_quantity:"",package_size:"",auto_buy_task:!0,notes:""},J=class extends L{constructor(){super(...arguments);this.parts=[];this.canWrite=!1;this.currencySymbol="\u20AC";this.partsCostMode="purchase";this.fleet=!1;this._editing=null;this._opened=null;this._busy=!1;this._error="";this._restockFor=null;this._restockQty="";this._restockInvalid=!1;this._disposeFor=null;this._disposeQty="1";this._disposeInvalid=!1;this._docsFor=null}get _lang(){return N(this.hass)}connectedCallback(){super.connectedCallback(),oe(this._lang).then(()=>this.requestUpdate())}_notifyChanged(){this.dispatchEvent(new CustomEvent("parts-changed",{bubbles:!0,composed:!0}))}_send(e){return this._error="",I(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_openAdd(){this._editing={...Sa},this._opened=null}_openEdit(e){this._editing={id:e.id,name:e.name,vendor:e.vendor||"",mpn:e.mpn||"",gtin:e.gtin||"",storage_location:e.storage_location||"",product_url:e.product_url||"",unit:e.unit||"",cost:e.cost!=null?String(e.cost):"",stock:e.stock!=null?String(e.stock):"",reuse:e.reuse||"",restoring:e.restoring?String(e.restoring):"",cost_mode:e.cost_mode||"",reorder_threshold:e.reorder_threshold!=null?String(e.reorder_threshold):"",restock_quantity:e.restock_quantity!=null?String(e.restock_quantity):"",package_size:e.package_size!=null?String(e.package_size):"",auto_buy_task:!!e.auto_buy_task,notes:e.notes||""},this._opened={...this._editing}}_formValue(e){let t=i=>i.trim()===""?null:Number(i);return{entry_id:this.entryId,name:e.name.trim(),vendor:e.vendor.trim()||null,mpn:e.mpn.trim()||null,gtin:e.gtin.trim()||null,storage_location:e.storage_location.trim()||null,product_url:e.product_url.trim()||null,unit:e.unit.trim()||null,cost:t(e.cost),stock:t(e.stock),reuse:e.reuse||null,...e.reuse?{restoring:t(e.restoring)??0}:{},...this.fleet?{}:{cost_mode:e.cost_mode||null},reorder_threshold:t(e.reorder_threshold),restock_quantity:t(e.restock_quantity),package_size:t(e.package_size),auto_buy_task:e.auto_buy_task,notes:e.notes.trim()||null}}async _save(){let e=this._editing;if(this._busy||!e||!e.name.trim())return;let t=this._formValue(e),i=this._opened;e.id&&i&&(e.stock===i.stock&&delete t.stock,e.restoring===i.restoring&&e.reuse===i.reuse&&delete t.restoring);let a=e.id?"maintenance_supporter/part/update":"maintenance_supporter/part/create";await this._send(e.id?{type:a,part_id:e.id,...t}:{type:a,...t})!==void 0&&(this._editing=null,this._notifyChanged())}async _delete(e){if(!window.confirm(s("part_delete_confirm",this._lang).replace("{name}",e.name)))return;await this._send({type:"maintenance_supporter/part/delete",entry_id:this.entryId,part_id:e.id})!==void 0&&this._notifyChanged()}async _restock(e){if(this._busy)return;let t=parseFloat(this._restockQty);if(!Number.isFinite(t)||t===0){this._restockInvalid=!0;return}this._restockInvalid=!1;let i=await this._send({type:"maintenance_supporter/part/restock",entry_id:this.entryId,part_id:e.id,delta:t});this._restockFor=null,i!==void 0&&(e.stock=i?.stock,this.requestUpdate(),this._notifyChanged())}async _readyAgain(e){if(this._busy)return;let t=await this._send({type:"maintenance_supporter/part/ready_again",entry_id:this.entryId,part_id:e.id});t&&(e.stock=t.stock,e.restoring=t.restoring,this.requestUpdate(),this._notifyChanged())}async _dispose(e){if(this._busy)return;let t=parseFloat(this._disposeQty);if(!Number.isFinite(t)||t<=0){this._disposeInvalid=!0;return}this._disposeInvalid=!1;let i=await this._send({type:"maintenance_supporter/part/dispose",entry_id:this.entryId,part_id:e.id,quantity:t});this._disposeFor=null,i&&(e.stock=i.stock,e.restoring=i.restoring,this.requestUpdate(),this._notifyChanged())}_onUsed(e,t){e.stock=t.stock,e.restoring=t.restoring,this.requestUpdate(),this._notifyChanged()}_renderUse(e){return!this.canWrite||!(typeof e.stock=="number"&&e.stock>0)?h:n`<ms-part-use
      .hass=${this.hass}
      .entryId=${this.entryId}
      .sparePart=${e}
      ?notBooked=${!this.fleet&&yt(e,this.partsCostMode)==="use"}
      @part-used=${t=>this._onUsed(e,t.detail)}
    ></ms-part-use>`}_renderDispose(e,t){return this._disposeFor!==e.id?n`<button class="ready-again dispose" title=${s("part_dispose_hint",t)} .disabled=${this._busy}
        @click=${()=>{this._disposeFor=e.id,this._disposeQty="1",this._disposeInvalid=!1}}>
        <ha-icon icon="mdi:trash-can-outline"></ha-icon>${s("part_dispose",t)}
      </button>`:n`<input
        class="restock-input dispose-input${this._disposeInvalid?" invalid":""}"
        type="number"
        min="1"
        max=${String(e.restoring??0)}
        .value=${this._disposeQty}
        aria-label=${s("part_dispose_how_many",t)}
        title=${s("part_dispose_how_many",t)}
        @input=${i=>this._disposeQty=i.target.value}
        @keydown=${i=>{i.key==="Enter"&&this._dispose(e),i.key==="Escape"&&(this._disposeFor=null)}}
      />
      <button class="ready-again dispose confirm" title=${s("part_dispose_hint",t)} .disabled=${this._busy} @click=${()=>this._dispose(e)}>
        <ha-icon icon="mdi:check"></ha-icon>${s("part_dispose",t)}
      </button>
      <ha-icon-button title=${s("cancel",t)} @click=${()=>this._disposeFor=null}
        ><ha-icon icon="mdi:close"></ha-icon
      ></ha-icon-button>`}_identLine(e){return[e.vendor,e.mpn?`MPN: ${e.mpn}`:"",e.gtin?`GTIN: ${e.gtin}`:""].filter(Boolean).join(" \xB7 ")}_renderRow(e){let t=this._lang,i=e.stock!==null&&e.stock!==void 0,a=this._identLine(e),r=this._docsFor===e.id;return n`
      <div class="part-row ${e.is_low?"low":""}">
        <ha-icon class="part-icon" icon=${e.is_low?"mdi:cart-arrow-down":"mdi:package-variant-closed"}></ha-icon>
        <div class="part-main">
          <div class="part-name">
            ${bi(e.shopping_url)?n`<a href=${e.shopping_url} target="_blank" rel="noopener noreferrer">${e.name}</a>`:e.name}
            ${i?n`<span class="stock-badge ${e.is_low?"low":""}"
                  >${Je(e.stock,e.unit,t)}${e.reorder_threshold!=null?n`<span class="threshold">/${ee(e.reorder_threshold,t)}</span>`:h}</span
                >`:h}
            ${this._renderUse(e)}
          </div>
          ${i&&e.reuse&&(e.restoring??0)>0?n`<div class="part-waiting">
                <span class="waiting-badge">${It(e.reuse,e.restoring,t)}</span>
                ${this.canWrite?n`<button class="ready-again" title=${s("part_ready_again_hint",t)} .disabled=${this._busy}
                        @click=${()=>this._readyAgain(e)}>
                        <ha-icon icon="mdi:check"></ha-icon>${s(`part_reuse_${e.reuse}`,t)}
                      </button>
                      ${this._renderDispose(e,t)}`:h}
              </div>`:h}
          <div class="part-meta">
            ${a?n`<span>${a}</span>`:h}
            ${e.storage_location?n`<span class="loc"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${e.storage_location}</span>`:h}
          </div>
          ${e.notes?n`<div class="part-notes">${e.notes}</div>`:h}
        </div>
        <ha-icon-button
          title=${s("documents",t)}
          class=${r?"docs-open":""}
          @click=${()=>this._docsFor=r?null:e.id}
          ><ha-icon icon="mdi:paperclip"></ha-icon
        ></ha-icon-button>
        ${this.canWrite?n`
              ${this._restockFor===e.id?n`
                    <input
                      class="restock-input${this._restockInvalid?" invalid":""}"
                      type="number"
                      .value=${this._restockQty}
                      placeholder="+1"
                      @input=${o=>this._restockQty=o.target.value}
                      @keydown=${o=>{o.key==="Enter"&&this._restock(e),o.key==="Escape"&&(this._restockFor=null)}}
                    />
                    <ha-icon-button title=${s("save",t)} .disabled=${this._busy} @click=${()=>this._restock(e)}
                      ><ha-icon icon="mdi:check"></ha-icon
                    ></ha-icon-button>
                  `:n`
                    <ha-icon-button
                      title=${s("part_restock",t)}
                      .disabled=${this._busy}
                      @click=${()=>{this._restockFor=e.id,this._restockInvalid=!1,this._restockQty=String(Fi(e))}}
                      ><ha-icon icon="mdi:plus-minus-variant"></ha-icon
                    ></ha-icon-button>
                  `}
              <ha-icon-button title=${s("edit",t)} .disabled=${this._busy} @click=${()=>this._openEdit(e)}
                ><ha-icon icon="mdi:pencil"></ha-icon
              ></ha-icon-button>
              <ha-icon-button title=${s("delete",t)} .disabled=${this._busy} @click=${()=>this._delete(e)}
                ><ha-icon icon="mdi:delete-outline"></ha-icon
              ></ha-icon-button>
            `:h}
      </div>
      ${r?n`<div class="part-docs">
            <maintenance-task-documents
              .hass=${this.hass}
              .entryId=${this.entryId}
              .partId=${e.id}
              .canWrite=${this.canWrite}
            ></maintenance-task-documents>
          </div>`:h}
    `}_field(e,t,i={}){let a=this._editing;return n`
      <label class="form-field">
        <span>${e}</span>
        <input
          type=${i.type||"text"}
          .value=${String(a[t]??"")}
          placeholder=${i.placeholder||""}
          @input=${r=>{this._editing[t]=r.target.value,this.requestUpdate()}}
        />
      </label>
    `}_renderCostMode(e){let t=this._editing,i=a=>s(a==="use"?"settings_parts_cost_use":"settings_parts_cost_purchase",e);return n`
      <label class="form-field">
        <span>${s("part_cost_mode",e)}</span>
        <select
          class="cost-mode-select"
          .value=${t.cost_mode}
          @change=${a=>{this._editing={...this._editing,cost_mode:a.target.value}}}
        >
          <option value="" ?selected=${!t.cost_mode}>${s("part_cost_mode_house",e).replace("{mode}",i(this.partsCostMode))}</option>
          <option value="purchase" ?selected=${t.cost_mode==="purchase"}>${i("purchase")}</option>
          <option value="use" ?selected=${t.cost_mode==="use"}>${i("use")}</option>
        </select>
      </label>
      <div class="form-hint">${s("part_cost_mode_hint",e)}</div>
    `}_renderForm(){let e=this._lang,t=this._editing;return n`
      <div class="part-form">
        <div class="form-grid">
          ${this._field(s("part_name",e),"name")}
          ${this._field(s("part_vendor",e),"vendor")}
          ${this._field("MPN","mpn")}
          ${this._field("GTIN / EAN","gtin",{placeholder:"4006381333931"})}
          ${this._field(s("part_storage_location",e),"storage_location")}
          ${this._field(s("part_product_url",e),"product_url",{placeholder:"https://\u2026"})}
          ${this._field(s("part_unit",e),"unit")}
          ${this._field(s("part_cost",e),"cost",{type:"number"})}
          ${this.fleet?h:this._renderCostMode(e)}
          ${this._field(s("part_stock",e),"stock",{type:"number"})}
          <label class="form-field">
            <span>${s("part_reuse",e)}</span>
            <select
              class="reuse-select"
              .value=${t.reuse}
              @change=${i=>{this._editing={...this._editing,reuse:i.target.value}}}
            >
              <option value="" ?selected=${!t.reuse}>${s("part_reuse_none",e)}</option>
              ${ja.map(i=>n`<option value=${i} ?selected=${t.reuse===i}>${s(`part_reuse_${i}`,e)}</option>`)}
            </select>
          </label>
          ${t.reuse?this._field(s("part_restoring",e),"restoring",{type:"number"}):h}
          ${t.reuse?n`<div class="form-hint">${s("part_reuse_hint",e)}</div>`:h}
          ${this._field(s("part_reorder_threshold",e),"reorder_threshold",{type:"number"})}
          ${this._field(s("part_package_size",e),"package_size",{type:"number"})}
          ${this._field(t.package_size.trim()?s("part_restock_packages",e):s("part_restock_quantity",e),"restock_quantity",{type:"number"})}
          ${t.package_size.trim()?n`<div class="form-hint">${s("part_package_hint",e)}</div>`:h}
          <label class="form-field checkbox">
            <input
              type="checkbox"
              .checked=${t.auto_buy_task}
              @change=${i=>{this._editing={...t,auto_buy_task:i.target.checked}}}
            />
            <span>${s("part_auto_buy",e)}</span>
          </label>
          <!-- Documented and searched since the parts feature, but the form
               never had a field — only the API and imports could set it
               (audit 2026-09-28). -->
          <label class="form-field notes">
            <span>${s("notes_label",e)}</span>
            <textarea
              rows="2"
              maxlength=${Ta}
              .value=${t.notes}
              @input=${i=>{this._editing={...this._editing,notes:i.target.value}}}
            ></textarea>
          </label>
        </div>
        <div class="form-actions">
          <ha-button appearance="plain" @click=${()=>this._editing=null}>${s("cancel",e)}</ha-button>
          <ha-button .disabled=${this._busy||!t.name.trim()} @click=${()=>this._save()}
            >${s("save",e)}</ha-button
          >
        </div>
      </div>
    `}_inventoryValue(){let e=0,t=!1;for(let i of this.parts){let a=qi(i),r=typeof i.stock=="number"?i.stock:null;a!==null&&r!==null&&(e+=a*r,t=!0)}return t?e:null}render(){let e=this._lang;return!this.parts.length&&!this.canWrite?h:n`
      <div class="section-head">
        <h3>
          <ha-icon icon="mdi:package-variant"></ha-icon>
          ${s("parts_section",e)} (${this.parts.length})
          ${this._inventoryValue()!==null?n`<span class="inventory-value" title=${s("parts_inventory_value",e)}
                >${s("parts_inventory_value",e)}:
                ${V(this._inventoryValue(),this.currencySymbol,e)}</span>`:h}
        </h3>
        ${this.canWrite&&!this._editing?n`<ha-button appearance="plain" @click=${()=>this._openAdd()}>
              <ha-icon icon="mdi:plus"></ha-icon> ${s("part_add",e)}
            </ha-button>`:h}
      </div>
      ${this._error?n`<div class="error">${this._error}</div>`:h}
      ${this._editing?this._renderForm():h}
      ${this.parts.map(t=>this._renderRow(t))}
    `}};J.styles=H`
    :host {
      display: block;
      margin: 12px 0;
      container-type: inline-size;
    }
    /* #226: an open Use field takes a line of its own below the name; on a
       narrow shelf the row's buttons step down a line to give it the width. */
    .part-name ms-part-use[open] {
      flex-basis: 100%;
    }
    @container (max-width: 520px) {
      .part-row:has(ms-part-use[open]) {
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      .part-row:has(ms-part-use[open]) .part-main {
        flex: 1 1 calc(100% - 40px);
      }
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
      flex-wrap: wrap;
      gap: 4px 8px;
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
    .part-waiting {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 4px;
    }
    .waiting-badge {
      font-size: 12px;
      padding: 1px 8px;
      border-radius: 10px;
      background: var(--secondary-background-color, #eee);
      color: var(--primary-text-color);
    }
    .ready-again {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font: inherit;
      font-size: 12px;
      padding: 2px 10px;
      min-height: 28px;
      border-radius: 14px;
      border: 1px solid var(--primary-color);
      background: transparent;
      color: var(--primary-color);
      cursor: pointer;
    }
    .ready-again ha-icon {
      --mdc-icon-size: 16px;
    }
    .ready-again.dispose {
      border-color: var(--divider-color, #ccc);
      color: var(--secondary-text-color);
    }
    .ready-again.dispose.confirm {
      border-color: var(--error-color, #db4437);
      color: var(--error-color, #db4437);
    }
    .reuse-select,
    .cost-mode-select {
      font: inherit;
      padding: 6px;
      border-radius: 4px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
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
    .form-hint {
      grid-column: 1 / -1;
      font-size: 12px;
      color: var(--secondary-text-color);
      line-height: 1.4;
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
  `,_([S({attribute:!1})],J.prototype,"hass",2),_([S({attribute:!1})],J.prototype,"entryId",2),_([S({attribute:!1})],J.prototype,"parts",2),_([S({type:Boolean})],J.prototype,"canWrite",2),_([S({attribute:!1})],J.prototype,"currencySymbol",2),_([S({attribute:!1})],J.prototype,"partsCostMode",2),_([S({type:Boolean})],J.prototype,"fleet",2),_([f()],J.prototype,"_editing",2),_([f()],J.prototype,"_busy",2),_([f()],J.prototype,"_error",2),_([f()],J.prototype,"_restockFor",2),_([f()],J.prototype,"_restockQty",2),_([f()],J.prototype,"_restockInvalid",2),_([f()],J.prototype,"_disposeFor",2),_([f()],J.prototype,"_disposeQty",2),_([f()],J.prototype,"_disposeInvalid",2),_([f()],J.prototype,"_docsFor",2);customElements.get("maintenance-parts-section")||customElements.define("maintenance-parts-section",J);var zt={readings:!0,parts:!0,photos:!0,documents:!0,checklist:!0,notes:!0,costs:!0,person:!0,refs:!0,qr:!1,bare:!0,docDescriptions:!0};function Ea(l){return!!(l.notes&&l.notes.trim()||l.cost!=null||l.duration!=null||l.readings.length||l.parts.length||l.photoIds.length||l.checklist)}var Oa=6;function Bs(l,d,e,t,i,a,r,o={}){let c=o.options??{layout:"chronological",include:zt},u=c.include,p=o.data??{objectRef:null,tasks:[],photos:{},fmtNumber:O=>String(O)},g=d.filter(O=>O.type==="completed"&&(u.bare!==!1||Ea(O))),{totalCost:m}=xt(g),b=O=>u.refs&&p.objectRef&&O.taskRefNo!=null&&O.refNo!=null?`${p.objectRef}.${O.taskRefNo}-${O.refNo}`:null,y=O=>u.refs&&p.objectRef&&O.taskRefNo!=null?`${p.objectRef}.${O.taskRefNo}`:null,$=[[e.refNumber,u.refs&&p.objectRef?`#${p.objectRef}`:null],[e.manufacturer,l.manufacturer],[e.model,l.model],[e.serial,l.serial_number],[e.installed,l.installation_date?t(l.installation_date):null]].filter(([,O])=>O).map(([O,z])=>`<div class="meta-row"><span>${x(O)}</span><strong>${x(z)}</strong></div>`).join(""),k=O=>{let z=[];if(u.readings&&O.readings.length){let B=O.readings.map(P=>{let W=`${p.fmtNumber(P.value)}${P.unit?` ${x(P.unit)}`:""}`,K=P.delta!=null?` <span class="delta">(${P.delta>=0?"+":"\u2212"}${p.fmtNumber(Math.abs(P.delta))})</span>`:"";return`${P.name?`${x(P.name)}: `:""}${W}${K}`});z.push(`<div class="fact"><span class="k">${x(e.readings)}</span>${B.join(" \xB7 ")}</div>`)}if(u.parts&&O.parts.length&&z.push(`<div class="fact"><span class="k">${x(e.parts)}</span>${O.parts.map(B=>`${x(B.name)} \xD7 ${p.fmtNumber(B.quantity)}`).join(", ")}</div>`),u.checklist&&O.checklist&&z.push(`<div class="fact"><span class="k">${x(e.checklist)}</span>${O.checklist.done}/${O.checklist.total}</div>`),u.photos&&O.photoIds.length){let B=O.photoIds.slice(0,Oa),P=B.map(K=>{let Q=p.photos[K],E=Q?.name||K.slice(0,8);return Q?.url?`<figure class="photo"><img src="${x(Q.url)}" alt="" /><figcaption>${x(E)}</figcaption></figure>`:`<figure class="photo"><figcaption>${x(E)}</figcaption></figure>`}),W=O.photoIds.length>B.length?`<span class="more">+${O.photoIds.length-B.length}</span>`:"";z.push(`<div class="fact"><span class="k">${x(e.photos)}</span><div class="photos">${P.join("")}${W}</div></div>`)}return z.length?`<div class="details">${z.join("")}</div>`:""},T=O=>[u.notes?O.notes:null,u.person&&O.completedBy?`${e.completedBy}: ${O.completedBy}`:null].filter(Boolean).join(" \xB7 "),j=O=>u.costs?`<td class="num">${O.cost!=null?x(a(O.cost)):x(e.none)}</td>
        <td class="num">${O.duration!=null?x(i(O.duration)):x(e.none)}</td>`:"",C=O=>O?`<span class="ref">#${x(O)}</span>`:"",v=u.costs?5:3,D=O=>`<thead><tr>
    <th>${x(e.colDate)}</th>
    ${O?`<th>${x(e.colTask)}</th>`:"<th></th>"}
    ${u.costs?`<th class="num">${x(e.colCost)}</th><th class="num">${x(e.colDuration)}</th>`:""}
    <th>${x(e.colNotes)}</th>
  </tr></thead>`,re=(O,z)=>{let B=T(O),P=k(O),W=z?x(O.phaseName?`${O.taskName} \xB7 ${O.phaseName}`:O.taskName):x(O.phaseName||"");return`<tr class="entry">
        <td class="nowrap">${x(t(O.timestamp))}${C(b(O))}</td>
        <td>${z?`${W} ${C(y(O))}`:W}</td>
        ${j(O)}
        <td class="notes">${x(B)||(P?"":x(e.none))}</td>
      </tr>${P?`<tr class="entry-details"><td colspan="${v}" class="details-cell">${P}</td></tr>`:""}`},pe;if(c.layout==="by_task"){let O=new Map(p.tasks.map(P=>[P.id,P])),z=[...p.tasks.map(P=>P.id)];for(let P of g)z.includes(P.taskId)||z.push(P.taskId);pe=`${z.map(P=>{let W=g.filter(ae=>ae.taskId===P);if(!W.length)return"";let K=O.get(P),Q=K?.name||W[0].taskName,E=u.refs?K?.ref??y(W[0]):null,G=u.documents&&K?.documents.length?`<div class="fact"><span class="k">${x(e.documents)}</span>${K.documents.map(ae=>`${x(ae.title)}${ae.page?` (${x(e.page(ae.page))})`:""}${u.docDescriptions!==!1&&ae.description?` \u2014 <span class="doc-desc">${x(ae.description)}</span>`:""}`).join(", ")}</div>`:"",ne=u.qr&&K?.qrDataUri?`<figure class="qr"><img src="${x(K.qrDataUri)}" alt="" /><figcaption>${x(e.scanHint)}</figcaption></figure>`:"",ze=W.reduce((ae,M)=>ae+(M.cost??0),0);return`<section class="task">
  <div class="task-head">
    <div class="task-title">
      <h2>${x(Q)} ${C(E)}</h2>
      ${K?.schedule?`<div class="schedule">${x(K.schedule)}</div>`:""}
      ${G}
      <div class="task-count">${x(e.entriesLabel(W.length))}${u.costs&&ze!==0?` \xB7 ${x(a(ze))}`:""}</div>
    </div>
    ${ne}
  </div>
  <table>
    ${D(!1)}
    <tbody>
${W.map(ae=>re(ae,!1)).join(`
`)}
    </tbody>
  </table>
</section>`}).join(`
`)}
<table class="total">
  <tfoot><tr>
    <td>${x(e.totalLabel)}</td>
    <td class="num">${u.costs?x(a(m)):""}</td>
  </tr></tfoot>
</table>`}else pe=`<table>
  ${D(!0)}
  <tbody>
${g.map(O=>re(O,!0)).join(`
`)}
  </tbody>
  <tfoot><tr>
    <td colspan="2">${x(e.totalLabel)}</td>
    ${u.costs?`<td class="num">${x(a(m))}</td><td colspan="2"></td>`:"<td></td>"}
  </tr></tfoot>
</table>`;return`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${x(e.title)} \u2014 ${x(l.name)}</title>
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
  td.notes { color: #444; white-space: pre-wrap; }
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
<h1>${x(e.title)} \u2014 ${x(l.name)}</h1>
<p class="sub">${x(e.generated)} ${x(t(r))} \xB7 ${x(e.entriesLabel(g.length))}</p>
${$?`<div class="meta">${$}</div>`:""}
${pe}
${o.capped?`<p class="cap-note">${x(e.capNote)}</p>`:""}
</body>
</html>`}var Ra=60,ie=class extends L{constructor(){super(...arguments);this.entryId="";this.object=null;this.tasks=[];this.currencySymbol="\u20AC";this.userName=()=>null;this._filterTask="";this._from="";this._to="";this._expanded=!1;this._printOpen=!1;this._printLayout="chronological";this._printInclude={...zt};this._printing=!1;this._loadedFor=null;this._histories=new ss(this);this._localeReady=!1}connectedCallback(){super.connectedCallback();try{let e=JSON.parse(X(A.printOptions)||"null");(e?.layout==="by_task"||e?.layout==="chronological")&&(this._printLayout=e.layout),e?.include&&typeof e.include=="object"&&(this._printInclude={...zt,...e.include})}catch{}}_savePrintOptions(){U(A.printOptions,JSON.stringify({layout:this._printLayout,include:this._printInclude}))}_toggleInclude(e,t){this._printInclude={...this._printInclude,[e]:t},this._savePrintOptions()}get _lang(){return N(this.hass)}willUpdate(e){super.willUpdate(e),this.entryId&&this._loadedFor!==this.entryId&&(this._loadedFor=this.entryId,this._filterTask="",this._from="",this._to=""),this.entryId&&(e.has("entryId")||e.has("tasks")||e.has("hass")&&e.get("hass")===void 0)&&this._histories.sync(this.hass,this.tasks.map(t=>({entryId:this.entryId,task:t})))}updated(e){super.updated(e),!this._localeReady&&this.hass&&(this._localeReady=!0,oe(this._lang).then(()=>this.requestUpdate()))}get _entries(){return Ki(this.tasks.map(e=>({id:e.id,name:e.name,history:this._histories.historyOf(this.entryId,e),ref_no:e.ref_no,reading_unit:e.reading_unit})))}get _capped(){return this.tasks.some(e=>this._histories.historyOf(this.entryId,e).length>=Wi)}_openTask(e){this.dispatchEvent(new CustomEvent("open-task",{detail:{taskId:e},bubbles:!0,composed:!0}))}async _bookletData(e){let t=this._printInclude,i=this._lang,a=[];if(t.documents||t.photos)try{a=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId})).documents||[]}catch{a=[]}let r=new Map;t.qr&&this._printLayout==="by_task"&&await Promise.all(this.tasks.map(async u=>{try{let p=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/qr/generate",entry_id:this.entryId,task_id:u.id,url_mode:"server",action:"view"});p.svg_data_uri&&r.set(u.id,p.svg_data_uri)}catch{}}));let o=this.tasks.map(u=>({id:u.id,name:u.name,ref:Ee(this.object,u),schedule:Le(u,i)||null,documents:a.filter(p=>(p.task_ids||[]).includes(u.id)&&!Is(p)).map(p=>({title:le(p),page:p.task_pages?.[u.id]??null,description:p.description||null})),qrDataUri:r.get(u.id)??null})),c={};if(t.photos){let u=[...new Set(e.filter(g=>g.type==="completed").flatMap(g=>g.photoIds))].slice(0,Ra),p=new Map(a.map(g=>[g.id,g]));await Promise.all(u.map(async g=>{let m=p.get(g),b=m&&le(m)||g.slice(0,8);try{c[g]={name:b,url:new URL(await _t(this.hass,g),window.location.origin).href}}catch{c[g]={name:b,url:null}}}))}return{tasks:o,photos:c}}_filteredEntries(){return Gi(this._entries,{taskId:this._filterTask||null,from:this._from||null,to:this._to||null})}async _print(){let e=this._lang,t=this.object;if(!t||this._printing)return;let i=bt();this._printing=!0;let a,r;try{await this._histories.settled(),a=this._filteredEntries(),r=await this._bookletData(a)}catch(p){throw i?.close(),p}finally{this._printing=!1}this._printOpen=!1;let o={title:s("service_record_title",e),generated:s("report_generated",e),manufacturer:s("manufacturer",e),model:s("model",e),serial:s("serial_number_label",e),installed:s("installed",e),colDate:s("date",e),colTask:s("task_name",e),colCost:s("cost",e),colDuration:s("duration",e),colNotes:s("notes_label",e),completedBy:s("completed_by",e),totalLabel:s("report_total_cost",e),entriesLabel:p=>`${p} ${s("service_record_entries",e)}`,capNote:s("object_history_cap_note",e),none:"\u2014",readings:s("print_inc_readings",e),parts:s("print_inc_parts",e),photos:s("print_inc_photos",e),documents:s("print_inc_documents",e),checklist:s("print_inc_checklist",e),refNumber:s("ref_number",e),scanHint:s("report_scan_hint",e),page:p=>s("search_page",e).replace("{page}",String(p))},c=a.map(p=>({...p,completedBy:p.completedBy?this.userName(p.completedBy):null,notes:p.notes?$t(p.notes,e):null})),u=Bs(t,c,o,p=>p?q(p,e):"",p=>Ze(p,e),p=>V(p,this.currencySymbol,e),new Date().toISOString(),{capped:this._capped,options:{layout:this._printLayout,include:this._printInclude},data:{objectRef:Se(t),tasks:r.tasks,photos:r.photos,fmtNumber:p=>ee(p,e)}});tt(u,i)}_renderPrintOptions(){let e=this._lang,t=this._printInclude,i=(r,o,c=!1)=>n`
      <label class="opt ${c?"disabled":""}">
        <input type="checkbox" .checked=${t[r]} ?disabled=${c}
          @change=${u=>this._toggleInclude(r,u.target.checked)} />
        <span>${s(o,e)}</span>
      </label>`,a=this._printLayout==="by_task";return n`
      <div class="print-options" role="dialog" aria-label=${s("print_options_title",e)}>
        <div class="po-title">${s("print_options_title",e)}</div>
        <div class="po-group">
          <span class="po-label">${s("print_layout",e)}</span>
          <label class="opt"><input type="radio" name="layout" value="chronological" .checked=${!a}
            @change=${()=>{this._printLayout="chronological",this._savePrintOptions()}} /><span>${s("print_layout_chronological",e)}</span></label>
          <label class="opt"><input type="radio" name="layout" value="by_task" .checked=${a}
            @change=${()=>{this._printLayout="by_task",this._savePrintOptions()}} /><span>${s("print_layout_by_task",e)}</span></label>
        </div>
        <div class="po-group">
          <span class="po-label">${s("print_include",e)}</span>
          ${i("readings","print_inc_readings")}
          ${i("parts","print_inc_parts")}
          ${i("photos","print_inc_photos")}
          ${i("checklist","print_inc_checklist")}
          ${i("notes","print_inc_notes")}
          ${i("costs","print_inc_costs")}
          ${i("person","print_inc_person")}
          ${i("refs","print_inc_refs")}
          ${i("bare","print_inc_bare")}
          ${i("documents","print_inc_documents",!a)}
          ${i("docDescriptions","print_inc_doc_desc",!a)}
          ${i("qr","print_inc_qr",!a)}
        </div>
        <div class="po-actions">
          <ha-button appearance="plain" @click=${()=>{this._printOpen=!1}}>${s("cancel",e)}</ha-button>
          <ha-button appearance="filled" class="po-print" .disabled=${this._printing} @click=${()=>this._print()}>
            ${this._printing?s("loading",e):s("print_button",e)}
          </ha-button>
        </div>
      </div>`}render(){let e=this._lang;if(!this._entries.length&&!this._histories.loading)return h;let i=this._filteredEntries(),{completed:a,totalCost:r}=xt(i),o=this._expanded?i:i.slice(0,15);return n`
      <div class="section">
        <h3>
          ${s("object_history_section",e)}
          <span class="count">${i.length}</span>
          ${this._histories.loading?n`<span class="loading-hint">${s("loading",e)}</span>`:h}
          <ha-button appearance="plain" class="print-btn" @click=${()=>{this._printOpen=!this._printOpen}}>
            <ha-icon icon="mdi:printer-outline"></ha-icon>
            ${s("service_record_print",e)}
          </ha-button>
        </h3>
        ${this._printOpen?this._renderPrintOptions():h}

        <div class="filters">
          <select .value=${this._filterTask} @change=${c=>{this._filterTask=c.target.value}}>
            <option value="">${s("object_history_all_tasks",e)}</option>
            ${this.tasks.map(c=>n`<option value=${c.id} ?selected=${c.id===this._filterTask}>${c.name}</option>`)}
          </select>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            .label=${s("date_from",e)}
            .value=${this._from}
            @value-changed=${c=>{this._from=c.detail.value}}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            .label=${s("date_to",e)}
            .value=${this._to}
            @value-changed=${c=>{this._to=c.detail.value}}
          ></ms-date-field>
        </div>

        ${i.length===0?n`<p class="empty">${s("object_history_empty",e)}</p>`:n`
              <div class="rows">
                ${o.map(c=>n`
                  <div class="row">
                    <span class="date" title=${Ei(c.timestamp,e)}>${q(c.timestamp,e)}</span>
                    <span class="type type-${c.type}" style="--type-color: ${ki(c.type)}">${s(c.type,e)}</span>
                    <button class="task-link" @click=${()=>this._openTask(c.taskId)}>${c.taskName}${c.phaseName?` \xB7 ${c.phaseName}`:""}</button>
                    <span class="facts">
                      ${c.cost!=null?n`<span>${Si(c.cost,this.currencySymbol,e)}</span>`:h}
                      ${c.partsCost!=null?n`<span class="parts-cost" title=${s(c.partsCounted?"history_parts_counted_hint":"history_parts_info_hint",e)}>${s(c.partsCounted?"history_parts_counted":"history_parts_info",e).replace("{amount}",V(c.partsCost,this.currencySymbol,e))}</span>`:h}
                      ${c.purchaseCost!=null?n`<span class="parts-cost">${s("history_purchase_stock",e).replace("{amount}",V(c.purchaseCost,this.currencySymbol,e))}</span>`:h}
                      ${c.duration!=null?n`<span>${Ze(c.duration,e)}</span>`:h}
                    </span>
                    ${c.notes?n`<span class="notes" title=${$t(c.notes,e)}>${$t(c.notes,e)}</span>`:h}
                  </div>
                `)}
              </div>
              ${i.length>o.length?n`<ha-button appearance="plain" class="more" @click=${()=>{this._expanded=!0}}>
                    ${s("show_all",e)} (${i.length})
                  </ha-button>`:h}
              <div class="totals">
                ${a} ${s("service_record_entries",e)} · ${s("report_total_cost",e)}:
                <strong>${V(r,this.currencySymbol,e)}</strong>
              </div>
              ${this._capped?n`<p class="cap-note">${s("object_history_cap_note",e)}</p>`:h}
            `}
      </div>
    `}};ie.styles=H`
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
    /* The colour comes from HISTORY_TYPE_COLORS (status-constants.ts). */
    .type { background: color-mix(in srgb, var(--type-color) 15%, transparent); color: var(--type-color); }
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
  `,_([S({attribute:!1})],ie.prototype,"hass",2),_([S()],ie.prototype,"entryId",2),_([S({attribute:!1})],ie.prototype,"object",2),_([S({attribute:!1})],ie.prototype,"tasks",2),_([S()],ie.prototype,"currencySymbol",2),_([S({attribute:!1})],ie.prototype,"userName",2),_([f()],ie.prototype,"_filterTask",2),_([f()],ie.prototype,"_from",2),_([f()],ie.prototype,"_to",2),_([f()],ie.prototype,"_expanded",2),_([f()],ie.prototype,"_printOpen",2),_([f()],ie.prototype,"_printLayout",2),_([f()],ie.prototype,"_printInclude",2),_([f()],ie.prototype,"_printing",2);customElements.get("maintenance-object-history-section")||customElements.define("maintenance-object-history-section",ie);var se=class se extends L{constructor(){super(...arguments);this.flat=!1;this._ov=null;this._loading=!1;this._marking=!1;this._choosing=null;this._error="";this._disposeFor=null;this._disposeQty="1";this._history=null;this._rosterSort=se._storedSort();this._typeFilter=null;this._recorded=[];this._access=rs;this._historyRequested=!1;this._localeReady=!1;this._markAll=async()=>{await this._mark(void 0)};this._repair=async()=>{await this._act({type:"maintenance_supporter/battery_fleet/setup",language:this._lang})};this._loadHistory=async e=>{let t=e.target.open;if(U(A.batteryRosterOpen,t?"1":"0"),!(!t||this._historyRequested)){this._historyRequested=!0;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview_history"});this._history=i.series}catch{this._history=null}}}}get _lang(){return N(this.hass)}get _canWrite(){return Ve(this.hass?.user,this._access)}connectedCallback(){super.connectedCallback(),this.hass&&this._load()}updated(e){Fe(this,e),e.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,oe(this._lang).then(()=>this.requestUpdate()),jt(this.hass).then(t=>{this._access=t.access}),this._ov===null&&!this._loading&&this._load())}async _load(){this._error="";let e=await I(this,{type:"maintenance_supporter/battery_fleet/overview"},{busy:t=>{this._loading=t},onError:t=>{this._error=t}});e!==void 0&&(this._ov=e)}async _act(e,t){return this._marking?!1:(this._error="",await I(this,e,{busy:a=>{this._marking=a},reload:async()=>{t?.(),await this._load()},onError:a=>{this._error=a}})!==void 0)}async _dispose(e,t){let i=parseFloat(this._disposeQty);!Number.isFinite(i)||i<=0||await this._act({type:"maintenance_supporter/part/dispose",entry_id:e,part_id:t,quantity:i})&&(this._disposeFor=null)}_renderDispose(e,t,i){return this._disposeFor!==t.part_id?n`<button class="bf-charged bf-dispose" title=${s("part_dispose_hint",i)} .disabled=${this._marking}
        @click=${()=>{this._disposeFor=t.part_id,this._disposeQty="1"}}><ha-icon icon="mdi:trash-can-outline"></ha-icon>${s("part_dispose",i)}</button>`:n`<input
        class="bf-dispose-qty"
        type="number"
        min="1"
        max=${String(t.restoring)}
        .value=${this._disposeQty}
        aria-label=${s("part_dispose_how_many",i)}
        title=${s("part_dispose_how_many",i)}
        @input=${a=>this._disposeQty=a.target.value}
        @keydown=${a=>{a.key==="Enter"&&this._dispose(e,t.part_id),a.key==="Escape"&&(this._disposeFor=null)}}
      /><button class="bf-charged bf-dispose confirm" title=${s("part_dispose_hint",i)} .disabled=${this._marking}
        @click=${()=>this._dispose(e,t.part_id)}><ha-icon icon="mdi:check"></ha-icon>${s("part_dispose",i)}</button
      ><button class="bf-charged bf-dispose" title=${s("cancel",i)} @click=${()=>this._disposeFor=null}
        ><ha-icon icon="mdi:close"></ha-icon
      ></button>`}_markOne(e,t){if(e.cell_choices&&e.cell_choices.length>1){this._choosing={entityId:e.entity_id,list:t,selected:e.cells_installed||e.cell_choices[0].type};return}this._mark([e.entity_id])}async _confirmCells(){let e=this._choosing;e&&(this._choosing=null,await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",entity_ids:[e.entityId],cells:{[e.entityId]:e.selected}}))}_renderCellChooser(e,t,i){let a=this._choosing;return!a||a.entityId!==e.entity_id||a.list!==t||!e.cell_choices?h:n`
      <div class="bf-cells" role="group" aria-label=${s("battery_fleet_cells_question",i)}>
        <div class="bf-cells-q">${s("battery_fleet_cells_question",i)}</div>
        ${e.cell_choices.map(r=>n`
          <label class="bf-cell-choice">
            <input type="radio" name=${`cells-${e.entity_id}`} .checked=${a.selected===r.type}
              @change=${()=>{this._choosing={...a,selected:r.type}}} />
            <span>${r.name}</span>
            ${r.rechargeable?n`<span class="bf-cell-tag">${s("battery_fleet_cells_rechargeable",i)}</span>`:h}
          </label>`)}
        <div class="bf-cells-actions">
          <button class="bf-cells-cancel" @click=${()=>{this._choosing=null}}>${s("cancel",i)}</button>
          <button class="bf-cells-ok" .disabled=${this._marking} @click=${()=>this._confirmCells()}>
            ${s("battery_fleet_mark_one",i)}
          </button>
        </div>
      </div>
    `}async _mark(e){await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",...e?{entity_ids:e}:{}})}async _setExcluded(e,t){await this._act({type:"maintenance_supporter/battery_fleet/set_excluded",entity_id:e,excluded:t})}async _addBattery(e){let t=e.detail?.value;t&&await this._act({type:"maintenance_supporter/battery_fleet/set_included",entity_id:t,included:!0})}async _setTrackSelf(e){await this._setFleetOption("set_track_self_charging",e.target)}async _setDueWithoutSensor(e){await this._setFleetOption("set_due_without_sensor",e.target)}async _setAskCells(e){await this._setFleetOption("set_ask_cells",e.target)}async _setFleetOption(e,t){let i=t.checked;await this._act({type:`maintenance_supporter/battery_fleet/${e}`,enabled:i})||(t.checked=!i)}_rosterOpen(){return X(A.batteryRosterOpen)!=="0"}_predictedTitle(e,t){if(e.forecast_overdue)return s("battery_fleet_forecast_overdue",t);let i=this._predictedDate(this._forecastDays(e)??0);if(e.predicted_source==="trend")return s("battery_fleet_predicted_trend",t).replace("{date}",i).replace("{confidence}",s("cal_confidence_"+(e.prediction_confidence||"medium"),t));if(e.lifetime_months!=null&&e.lifetime_source){let a=s("lifetime_source_"+e.lifetime_source,t).replace("{n}",String(e.lifetime_samples??0));return s("battery_fleet_predicted_typical",t).replace("{date}",i).replace("{months}",String(e.lifetime_months)).replace("{type}",e.battery_type).replace("{source}",a)}return s("battery_fleet_predicted_on",t).replace("{date}",i)}_sparkline(e){let t=this._history?.[e.entity_id];if(!t||t.points.length<2)return h;let i=110,a=24,r=2,o=t.points[0][0],c=t.points[t.points.length-1][0],u=Date.now()/1e3,p=e.status!=="low"&&e.predicted_source==="trend"&&e.days_until!=null?u+e.days_until*86400:null,g=Math.max(c,p??c),m=T=>g===o?r:r+(T-o)/(g-o)*(i-2*r),b=T=>r+(1-Math.min(100,Math.max(0,T))/100)*(a-2*r),y=t.points.map(([T,j])=>`${R(m(T))},${R(b(j))}`).join(" "),$=t.points[t.points.length-1][1],k=R(b(t.threshold));return n`<svg
      class="bf-spark"
      viewBox="0 0 ${i} ${a}"
      role="img"
      aria-label=${s("battery_fleet_sparkline_hint",this._lang)}
    >
      <title>${s("battery_fleet_sparkline_hint",this._lang)}</title>
      <line class="bf-spark-th" x1="0" y1=${k} x2=${i} y2=${k}></line>
      <polyline class="bf-spark-line" points=${y}></polyline>
      ${p!==null?n`<line
            class="bf-spark-proj"
            x1=${R(m(c))}
            y1=${R(b($))}
            x2=${R(m(p))}
            y2=${k}
          ></line>`:h}
    </svg>`}static _storedSort(){return X(A.batteryRosterSort)==="name"?"name":"urgency"}_setSort(e){this._rosterSort=e,U(A.batteryRosterSort,e)}_sortedRoster(e){let t=this._typeFilter===null?e:e.filter(a=>a.battery_type===this._typeFilter);if(this._rosterSort==="name")return t;let i=a=>a.status==="low"?-1e3+(a.level??101)/101:a.days_until??1/0;return[...t].sort((a,r)=>i(a)-i(r)||a.device_name.localeCompare(r.device_name))}_predictedDate(e){return q(Oe(ke(),e),this._lang)}_forecastDays(e){return e.forecast_days!==void 0?e.forecast_days:e.days_until}_fmtDate(e){return Number.isFinite(e)?q(new Date(e).toISOString(),this._lang):"\u2014"}_shoppingLine(e){return Object.entries(e).map(([t,i])=>n`<button
        class="bf-type-chip ${this._typeFilter===t?"bf-type-chip-active":""}"
        title=${s("battery_fleet_filter_type",this._lang)}
        @click=${()=>this._toggleTypeFilter(t)}
      >
        ${i}× ${t}
      </button>`)}_toggleTypeFilter(e){if(this._typeFilter=this._typeFilter===e?null:e,this._typeFilter!==null){let t=this.shadowRoot?.querySelector("details.bf-roster");t&&!t.open&&(t.open=!0)}}async _recordJump(e,t){await this._act({type:"maintenance_supporter/battery_fleet/record_replacement",entity_id:e,replaced_at:new Date(t.at*1e3).toISOString()},()=>{this._recorded=[...this._recorded,e]})}_levelTone(e,t){let i=t.low_threshold??20;return e<=i?"bad":e<=i+20?"warn":"good"}_levelBar(e){let t=e.level;return t==null?h:n`<span class="bf-bar" aria-hidden="true"
      ><span class="bf-bar-fill bf-bar-${this._levelTone(t,e)}" style="width: ${Math.min(100,Math.max(0,t))}%"></span
    ></span>`}_jumpButton(e,t){let i=this._history?.[e.entity_id]?.jump;return!i||this._recorded.includes(e.entity_id)?h:n`<button
      class="bf-mark bf-jump"
      title=${s("battery_fleet_record_replacement",t).replace("{date}",this._fmtDate(i.at*1e3))}
      .disabled=${this._marking}
      @click=${()=>this._recordJump(e.entity_id,i)}
    >
      <ha-icon icon="mdi:calendar-sync"></ha-icon>
    </button>`}_renderRow(e,t,i){let a=e.available===!1?n`<span class="bf-offline">${s("battery_fleet_offline",t)}</span>`:e.no_sensor?n`<span class="bf-offline bf-nosensor">${s("battery_fleet_no_sensor",t)}</span>`:h,r=`${e.quantity}\xD7 ${e.battery_type}`,o=n`<span class="bf-type" title=${r}>${r}</span>`,c=this._canWrite,u=c&&(i.mark==="always"||e.no_sensor||e.can_mark_replaced),p=this._forecastDays(e);return n`
      <div class="bf-row">
        <span class="bf-dev">${e.device_name}</span>
        ${i.status?n`<span class="bf-status bf-${e.status}"
                >${e.no_sensor&&e.status==="low"?s("battery_fleet_status_due",t):s("battery_fleet_status_"+e.status,t)}</span
              >${o}${a}`:n`${a}${o}`}
        ${i.recharge&&e.rechargeable?n`<span class="bf-recharge" title=${s("battery_fleet_rechargeable",t)}
              ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
            ></span>`:h}
        ${i.sparkline?this._sparkline(e):h}
        ${this._levelBar(e)}
        ${e.level!=null?n`<span class="bf-level bf-level-${this._levelTone(e.level,e)}">${e.level}%</span>`:h}
        ${u?n`<button
              class="bf-mark${i.mark==="replaced"?" bf-replaced":""}"
              title=${e.rechargeable?s("battery_fleet_mark_recharged",t):s("battery_fleet_mark_one",t)}
              .disabled=${this._marking}
              @click=${()=>this._markOne(e,i.list)}
            >
              <ha-icon icon="mdi:battery-sync"></ha-icon>
            </button>`:h}
        ${i.jump&&c?this._jumpButton(e,t):h}
        ${i.predicted&&p!=null?n`<span
              class="bf-predicted ${e.predicted_source==="trend"?"bf-trend":""} ${e.forecast_overdue?"bf-overdue":""} ${e.forecast_overdue&&e.status==="ok"?"bf-quiet":""}"
              title=${this._predictedTitle(e,t)}
              >${e.forecast_overdue?n`<ha-icon icon="mdi:calendar-alert"></ha-icon>`:h}~${this._predictedDate(p)}</span
            >`:h}
        ${i.exclude&&c?n`<button
              class="bf-mark bf-exclude"
              title=${s("battery_fleet_exclude",t)}
              .disabled=${this._marking}
              @click=${()=>this._setExcluded(e.entity_id,!0)}
            >
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>
            </button>`:h}
      </div>
      ${this._renderCellChooser(e,i.list,t)}
    `}render(){let e=this._lang;if(this._loading&&this._ov===null)return n`<div class="bf-card"><div class="bf-loading">…</div></div>`;let t=this._ov;if(!t)return this._error?n`<div class="bf-card"><div class="bf-error">${this._error}</div></div>`:h;let i=t.low.length;return n`
      <div class="bf-card">
        <div class="bf-head">
          <ha-icon icon="mdi:battery-alert"></ha-icon>
          <span class="bf-title">${s("battery_fleet_title",e)}</span>
          <span class="bf-count ${i?"bad":"ok"}">${i}</span>
        </div>
        ${this._error?n`<div class="bf-error">${this._error}</div>`:h}

        ${t.configured&&t.task_ok===!1?n`
              <div class="bf-repair">
                <span>${s("battery_fleet_trigger_lost",e)}</span>
                ${this._canWrite?n`<ha-button .disabled=${this._marking} @click=${this._repair}>
                      ${s("battery_fleet_repair",e)}
                    </ha-button>`:h}
              </div>
            `:h}

        ${i===0?n`<div class="bf-empty">${s("battery_fleet_none_low",e)}</div>`:n`
              <div class="bf-shopping">
                <span class="bf-label">${s("battery_fleet_buy_now",e)}</span>
                <span class="bf-list">${this._shoppingLine(t.needs_now)}</span>
              </div>
              <div class="bf-rows">
                ${t.low.map(a=>this._renderRow(a,e,{list:"low",recharge:!0,mark:"always",exclude:!0}))}
              </div>
              ${this._canWrite?n`<div class="bf-actions">
                    <ha-button .disabled=${this._marking} @click=${this._markAll}>
                      <ha-icon icon="mdi:battery-sync"></ha-icon> ${s("battery_fleet_mark_all",e)}
                    </ha-button>
                  </div>`:h}
            `}

        ${t.charging?.length?n`
              <div class="bf-charging">
                <span class="bf-label">${s("battery_fleet_charging",e)}</span>
                ${t.charging.map(a=>n`<span class="bf-charge-item">
                    <span class="bf-charge-name">${a.name}</span>
                    <span>${s("battery_fleet_ready",e).replace("{count}",ee(a.stock,e))}</span>
                    ${a.restoring>0?n`<span class="bf-charge-waiting">${It(a.reuse,a.restoring,e)}</span>
                          ${this._canWrite?n`<button
                                class="bf-charged"
                                title=${s("part_ready_again_hint",e)}
                                .disabled=${this._marking}
                                @click=${()=>this._act({type:"maintenance_supporter/part/ready_again",entry_id:t.entry_id,part_id:a.part_id})}
                              ><ha-icon icon="mdi:battery-charging-100"></ha-icon>${s(`part_reuse_${a.reuse}`,e)}</button>
                              ${this._renderDispose(t.entry_id,a,e)}`:h}`:h}
                  </span>`)}
              </div>
            `:h}
        ${t.soon.length?n`
              <div class="bf-soon">
                <span class="bf-label">${s("battery_fleet_soon",e)}</span>
                <span class="bf-list">${this._shoppingLine(t.needs_soon)}</span>
                <div class="bf-soon-hint">${s("battery_fleet_soon_hint",e)}</div>
              </div>
              <div class="bf-rows bf-soon-rows">
                ${t.soon.map(a=>this._renderRow(a,e,{list:"soon",mark:"replaced",predicted:!0}))}
              </div>
            `:h}
        ${t.all?.length?n`
              <details class="bf-roster" ?open=${this._rosterOpen()} @toggle=${this._loadHistory}>
                <summary>${s("battery_fleet_all",e)} (${t.all.length})</summary>
                <div class="bf-roster-tools">
                  <button
                    class="bf-sort ${this._rosterSort==="urgency"?"bf-sort-active":""}"
                    @click=${()=>this._setSort("urgency")}
                  >
                    ${s("battery_fleet_sort_urgency",e)}
                  </button>
                  <button
                    class="bf-sort ${this._rosterSort==="name"?"bf-sort-active":""}"
                    @click=${()=>this._setSort("name")}
                  >
                    ${s("battery_fleet_sort_name",e)}
                  </button>
                </div>
                <div class="bf-rows">
                  ${this._sortedRoster(t.all).map(a=>this._renderRow(a,e,{list:"roster",status:!0,recharge:!0,sparkline:!0,mark:"replaced",jump:!0,predicted:!0,exclude:!0}))}
                </div>
                <div class="bf-roster-hint">${s("battery_fleet_all_hint",e)}</div>
                ${this._canWrite?this._renderRosterSettings(t,e):h}
              </details>
            `:h}
        ${this._renderExcluded(t,e)}
        <div class="bf-total">${s("battery_fleet_total",e).replace("{n}",String(t.total))}</div>
      </div>
    `}_renderRosterSettings(e,t){return n`
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
                <label class="bf-track-self bf-due-nosensor">
                  <input
                    type="checkbox"
                    .checked=${e.due_without_sensor!==!1}
                    .disabled=${this._marking}
                    @change=${this._setDueWithoutSensor}
                  />
                  ${s("battery_fleet_due_without_sensor",t)}
                </label>
                <div class="bf-roster-hint">${s("battery_fleet_due_without_sensor_hint",t)}</div>
                <label class="bf-track-self bf-ask-cells">
                  <input
                    type="checkbox"
                    .checked=${!!e.ask_cells}
                    .disabled=${this._marking}
                    @change=${this._setAskCells}
                  />
                  ${s("battery_fleet_ask_cells",t)}
                </label>
                <div class="bf-roster-hint">${s("battery_fleet_ask_cells_hint",t)}</div>
    `}_renderExcluded(e,t){return n`
        ${e.excluded?.length?n`
              <div class="bf-excluded">
                <span class="bf-label">${s("battery_fleet_excluded",t)}</span>
                ${e.excluded.map(i=>n`
                    <span class="bf-excluded-chip">
                      ${i.device_name}
                      ${this._canWrite?n`<button
                            class="bf-mark"
                            title=${s("battery_fleet_include",t)}
                            .disabled=${this._marking}
                            @click=${()=>this._setExcluded(i.entity_id,!1)}
                          >
                            <ha-icon icon="mdi:eye-outline"></ha-icon>
                          </button>`:h}
                    </span>
                  `)}
              </div>
            `:h}
    `}};se.styles=H`
    /* The query container of the row layout (see "In a narrow list" below):
     * the list's own width, not the screen's. */
    .bf-card {
      container: bf-fleet / inline-size;
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
    .bf-charging {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
    }
    .bf-charge-item {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      padding: 2px 8px;
      border-radius: 12px;
      background: var(--secondary-background-color, #eee);
      font-size: 13px;
    }
    .bf-charge-name {
      font-weight: 500;
    }
    .bf-charge-waiting {
      color: var(--warning-color, #f57c00);
    }
    .bf-charged {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font: inherit;
      font-size: 12px;
      min-height: 28px;
      padding: 2px 10px;
      border-radius: 14px;
      border: 1px solid var(--primary-color);
      background: transparent;
      color: var(--primary-color);
      cursor: pointer;
    }
    .bf-charged ha-icon {
      --mdc-icon-size: 16px;
    }
    .bf-dispose {
      border-color: var(--divider-color, #ccc);
      color: var(--secondary-text-color);
    }
    .bf-dispose.confirm {
      border-color: var(--error-color, #db4437);
      color: var(--error-color, #db4437);
    }
    .bf-dispose-qty {
      width: 56px;
      padding: 4px;
      font: inherit;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
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
      /* The right-hand columns (percentage, action, date, eye) have a
       * minimum width, so they line up across the three lists ("Buy now",
       * "Needed soon", the roster) although each list is a grid of its own
       * and fills different columns - only the roster has the eye, and its
       * dates used to end 32 px left of the soon list's. */
      grid-template-columns:
        minmax(0, 1fr) repeat(5, max-content)
        minmax(40px, max-content) minmax(32px, max-content) minmax(92px, max-content) minmax(32px, max-content);
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
    /* Every row action, the Replaced one included, sits in column 8. The
     * Replaced action used to take the empty percentage slot on sensorless
     * rows (D#162, while nothing else filled column 8) and column 8 on rows
     * with a percentage (since 2.79), so it jumped 40 px between
     * neighbouring rows (prod report 2026-10-13). Rows with a percentage
     * fill column 8 anyway, so one column for all costs no width. The
     * narrow layout below gives Replaced a slot of its own. */
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
    /* Every row shares the list's columns, so ONE long type ("1× BATTERY
     * PACK") widened the type column of all of them (D#162): it stops at
     * 12em and ends in an ellipsis, the full text is the tooltip. */
    .bf-type {
      color: var(--secondary-text-color);
      font-size: 13px;
      max-width: 12em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
    /* In a narrow list the row cannot fit name + chips + curve + bar + date
     * in ONE line: the decorations yield (the percentage still carries the
     * number) and the row wraps to two lines - the name spans the full
     * width, the status chip moves under it (left, into the name column)
     * and the rest keeps its pinned subgrid column, so type / percentage /
     * date / eye stay aligned across rows. Without this the fixed
     * max-content columns overflowed 400 px and the chips overlapped the
     * wrapped names.
     *
     * The LIST's width decides, not the screen's (D#162): the Lovelace card
     * sits in a dashboard column of 400-500 px on a wide screen, kept the
     * one-line layout there and cut off the badge, the date and the hide
     * button. 680 px of list is where the one-line rows stop fitting;
     * desktop task pages (700 px and more) keep them. */
    @container bf-fleet (max-width: 680px) {
      .bf-spark,
      .bf-bar {
        display: none;
      }
      /* No fixed gaps: a column a phone leaves empty (status chip moved,
       * curve and bar hidden) cost its 8 px gap all the same, and together
       * with one long type the rows ran 25 px past a 402 px phone. Each
       * occupied column brings its own 6 px instead, and the type column
       * may shrink - its text ends in an ellipsis. */
      .bf-rows {
        column-gap: 0;
        grid-template-columns: minmax(0, 1fr) max-content minmax(0, max-content) repeat(7, max-content);
      }
      .bf-row > :not(.bf-dev) {
        margin-inline-start: 6px;
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
      /* The column shrinks, the ellipsis comes from the base rule (a cap in
       * vw measured the screen, not the list). */
      .bf-type {
        grid-row: 2;
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
      .bf-row .bf-mark.bf-replaced {
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
    /* The number takes the bar's colour. It was red on every row, from the
     * days it only showed in the low list; the soon list and the roster
     * show it too, and a full battery read as an alarm there (prod report
     * 2026-10-13). A healthy level is plain text. */
    .bf-level {
      font-size: 12px;
    }
    .bf-level-bad {
      color: var(--error-color, #f44336);
    }
    .bf-level-warn {
      color: var(--warning-color, #ff9800);
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
    /* D#213: which cells went in — under the battery's row, across the
     * list's grid (in one column it squeezed into the name's). */
    .bf-cells {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin: 4px 0 8px;
      padding: 8px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }
    .bf-cells-q { font-size: 12px; font-weight: 500; color: var(--secondary-text-color); }
    .bf-cell-choice { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; }
    .bf-cell-choice input { width: 16px; height: 16px; margin: 0; }
    .bf-cell-tag {
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 8px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
    }
    .bf-cells-actions { display: flex; justify-content: flex-end; gap: 8px; }
    .bf-cells-actions button {
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
      cursor: pointer;
    }
    .bf-cells-actions .bf-cells-ok {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
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
    /* #223: the level reads healthy, so the passed type lifetime is only a
       hint — the row is OK. */
    .bf-predicted.bf-overdue.bf-quiet {
      color: var(--secondary-text-color);
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
  `,_([S({attribute:!1})],se.prototype,"hass",2),_([S({type:Boolean})],se.prototype,"flat",2),_([f()],se.prototype,"_ov",2),_([f()],se.prototype,"_loading",2),_([f()],se.prototype,"_marking",2),_([f()],se.prototype,"_choosing",2),_([f()],se.prototype,"_error",2),_([f()],se.prototype,"_disposeFor",2),_([f()],se.prototype,"_disposeQty",2),_([f()],se.prototype,"_history",2),_([f()],se.prototype,"_rosterSort",2),_([f()],se.prototype,"_typeFilter",2),_([f()],se.prototype,"_recorded",2),_([f()],se.prototype,"_access",2);var ci=se;customElements.get("maintenance-battery-fleet-section")||customElements.define("maintenance-battery-fleet-section",ci);var Ns=5;function Ca(l,d){let e=[];for(let t=0;t<d;t++)e.push(Oe(l,t));return e}function Ma(l){if(!l||l.length===0)return null;let d=l.map(e=>Ce(e)).filter(e=>e!==null&&e>=0);return d.length===0?null:d.reduce((e,t)=>e+t,0)/d.length}function Da(l){let{windowStart:d,windowEnd:e,task:t,entryId:i,objectName:a}=l,r=[],o=(g,m)=>({date:g,entry_id:i,task_id:t.id,task_name:t.name,object_name:a,status:m&&(t.status==="overdue"||t.status==="triggered")?"ok":t.status,days_until_due:m?null:t.days_until_due??null,projected:m,schedule_type:t.schedule_type,interval_days:t.interval_days??null,interval_unit:t.interval_unit??null,responsible_user_id:t.responsible_user_id??null,avg_cost:Ma(t.history),adaptive_enabled:!!t.adaptive_config?.enabled,prediction_confidence:t.threshold_prediction_confidence??null}),c=Math.max(1,Math.round(ai(t.interval_days,t.interval_unit)));if(t.status==="overdue"||t.status==="triggered"){if(r.push(o(d,!1)),t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0){let g=Oe(d,c),m=1;for(;g<=e&&m<Ns;)r.push(o(g,!0)),m++,g=Oe(g,c)}return r}let u=t.next_due;if(typeof u!="string"||!u)return r;let p=u.slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(p))return r;if(p>=d&&p<=e)r.push(o(p,!1));else if(p>e)return r;if(t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0){let g=Oe(p,c),m=r.length;for(;g<=e&&m<Ns;)g>=d&&(r.push(o(g,!0)),m++),g=Oe(g,c)}return r}function qs(l,d,e,t=null){let i=Ca(d,e),a=i[0],r=i[i.length-1],o=[];for(let u of l){let p=u.object?.name||"",g=u.entry_id,m=u.tasks||[];for(let b of m){if(t&&!nt(b,t)||b.enabled===!1)continue;let y=Da({windowStart:a,windowEnd:r,task:b,entryId:g,objectName:p});o.push(...y)}}let c=new Map;for(let u of i)c.set(u,[]);for(let u of o){let p=c.get(u.date);p&&p.push(u)}for(let[,u]of c)u.sort((p,g)=>{let m=Pe(p.status),b=Pe(g.status);if(m!==b)return m-b;if(p.projected!==g.projected)return p.projected?1:-1;let y=p.object_name.localeCompare(g.object_name);return y!==0?y:p.task_name.localeCompare(g.task_name)});return i.map(u=>({date:u,events:c.get(u)??[]}))}var Aa={completed:"ok",reset:"ok",skipped:"due_soon",missed:"overdue",triggered:"triggered",trigger_replaced:"triggered",trigger_removed:"ok"};function Ht(l,d){return`${l}/${d}`}function Fs(l,d,e){let t=Us(d,e)[0],i=[];for(let a of l)for(let r of a.tasks||[]){let o=r.history||[],c=r.history_count??o.length;if(c<=o.length)continue;let u=o.map(m=>Vt(m?.timestamp)).filter(m=>!!m),p=u.length?u.reduce((m,b)=>m<b?m:b):"";if(p&&p<t)continue;let g=Ht(a.entry_id,r.id);i.push({entryId:a.entry_id,taskId:r.id,key:g,sig:`${g}:${c}:${Pa(JSON.stringify(o))}`})}return i}function Pa(l){let d=2166136261;for(let e=0;e<l.length;e++)d^=l.charCodeAt(e),d=Math.imul(d,16777619);return(d>>>0).toString(36)}function Us(l,d){let e=[];for(let t=d-1;t>=0;t--)e.push(Oe(l,-t));return e}function Vs(l,d,e,t=null,i={}){let a=Us(d,e),r=a[0],o=a[a.length-1],c=new Map;for(let p of a)c.set(p,[]);for(let p of l){let g=p.object?.name||"",m=p.entry_id,b=p.tasks||[];for(let y of b){if(t&&!nt(y,t))continue;let $=i[Ht(m,y.id)]??(y.history||[]);for(let k of $){if(typeof k?.timestamp!="string")continue;let T=Vt(k.timestamp);if(!T||T<r||T>o)continue;let j=c.get(T);if(!j)continue;let C=k.type??"completed";j.push({date:T,entry_id:m,task_id:y.id,task_name:y.name,object_name:g,status:Aa[C]??"ok",days_until_due:null,projected:!1,schedule_type:y.schedule_type,interval_days:y.interval_days??null,responsible_user_id:y.responsible_user_id??null,avg_cost:Ce(k),adaptive_enabled:!!y.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:k.timestamp,history_type:C,history_cost:Ce(k),history_notes:typeof k.notes=="string"?k.notes:null,history_duration:typeof k.duration=="number"?k.duration:null})}}}let u={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4};for(let[,p]of c)p.sort((g,m)=>{let b=u[g.history_type??""]??99,y=u[m.history_type??""]??99;if(b!==y)return b-y;let $=g.object_name.localeCompare(m.object_name);return $!==0?$:g.task_name.localeCompare(m.task_name)});return a.map(p=>({date:p,events:c.get(p)??[]}))}var Ws=H`
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
`;function Ks(l){let d=window;d.customCards=d.customCards||[],d.customCards.some(e=>e.type===l.type)||d.customCards.push(l)}function Gs(l,d,e=t=>import(t)){let t=window,i;try{let p=new URL(d);i=p.origin+p.pathname}catch{return}let a=`__msCardHeal:${l[0]}:${i}`;if(t[a])return;t[a]=!0;let r=0,o=0,c=!1,u=()=>{if(r+=1,l.some(g=>!customElements.get(g))&&o<3&&!c){o+=1,c=!0;try{let g=new URL(d);g.searchParams.set("heal",`${Date.now()}`),e(g.href).catch(()=>{}).finally(()=>{c=!1})}catch{return}}r<20&&window.setTimeout(u,r<8?500:2e3)};window.setTimeout(u,250)}var ge=class extends L{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._objectFilter="";this._configuredObjects=[];this._unsub=null;this._pastHistory={};this._pastHistorySig="";this._pastSeq=0;this._dataLoaded=!1;this._lastConnection=null;this._onHistorySaved=e=>{let t=e.detail;!t?.entry_id||!t.task_id||!(Ht(t.entry_id,t.task_id)in this._pastHistory)||(this._pastHistorySig="",this._loadPastHistories())};this._subGen=0}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(e){if(this._config={...e},this._windowDays=e.window_days&&[7,14,30,365].includes(e.window_days)?e.window_days:30,this._pastDays=e.past_days&&[30,90].includes(e.past_days)?e.past_days:0,this._userFilter=typeof e.user_filter=="string"?e.user_filter:"",typeof e.object_filter=="string")this._objectFilter=e.object_filter,this._configuredObjects=[];else if(Array.isArray(e.object_filter)){let t=e.object_filter.filter(i=>typeof i=="string"&&i!=="");this._objectFilter=t.length===1?t[0]:"",this._configuredObjects=t.length>1?t:[]}else this._objectFilter="",this._configuredObjects=[]}getCardSize(){return 6}get _lang(){return N(this.hass)}connectedCallback(){super.connectedCallback(),window.addEventListener("history-entry-saved",this._onHistorySaved)}disconnectedCallback(){if(super.disconnectedCallback(),this._subGen++,window.removeEventListener("history-entry-saved",this._onHistorySaved),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._dataLoaded=!1,this._lastConnection=null}updated(e){if(super.updated(e),Fe(this,e),this.hass&&this._pastDays>0&&(e.has("_objects")||e.has("_pastDays"))&&this._loadPastHistories(),e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[e,t]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=e.objects,this._stats=t,Xe(this._stats.budget)}catch{}}async _loadPastHistories(){let e=Fs(this._objects,ke(),this._pastDays||30),t=e.map(r=>r.sig).join("|");if(t===this._pastHistorySig)return;this._pastHistorySig=t;let i=++this._pastSeq,a=await Promise.all(e.map(async r=>{try{let o=await wt(this.hass,r.entryId,r.taskId);return o?[r.key,o]:null}catch{return null}}));i===this._pastSeq&&(this._pastHistory=Object.fromEntries(a.filter(r=>r!==null)))}async _subscribe(){let e=++this._subGen;try{let t=await this.hass.connection.subscribeMessage(i=>{let a=i;this._objects=a.objects},{type:"maintenance_supporter/subscribe"});if(!this.isConnected||e!==this._subGen){t();return}this._unsub=t}catch{}}_onEventClick(e){if(e.history_timestamp&&xi.includes(String(e.history_type||"completed"))){this._openHistoryEntry(e);return}this._openTask(e)}_openTask(e){let t=new CustomEvent("maintenance-supporter-open-task",{detail:{entry_id:e.entry_id,task_id:e.task_id},bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(t)&&(Cs(e.entry_id,e.task_id)||this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:e.entry_id,task_id:e.task_id},bubbles:!0,composed:!0})))}async _openHistoryEntry(e){try{let t=await jt(this.hass);if(!Ve(this.hass?.user,t.access)){this._openTask(e);return}}catch{}try{let t=await ps(this.hass,e.entry_id,e.task_id,e.history_timestamp);if(!t||Rs(t))return}catch{}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:e.entry_id,task_id:e.task_id,original_timestamp:e.history_timestamp},bubbles:!0,composed:!0}))}render(){if(!this.hass)return h;let e=this._lang,t=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,a=this._config.title,r=null;this._userFilter&&(r=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let o=v=>{let D=v.toLowerCase();return this._objects.find(pe=>pe.entry_id===v||pe.object.name.toLowerCase()===D)?.entry_id??null},c=new Set(this._configuredObjects.map(o).filter(v=>v!==null)),u=c.size?this._objects.filter(v=>c.has(v.entry_id)):this._objects,p=this._config.show_object_filter!==!1&&u.length>1,g=this._objectFilter?o(this._objectFilter):null,m=g&&u.some(v=>v.entry_id===g)?u.filter(v=>v.entry_id===g):u,b=ke(),y=this._pastDays>0,$=y?Vs(m,b,this._pastDays,r,this._pastHistory):qs(m,b,this._windowDays,r),k=this._windowDays===365||y,T=k?$.filter(v=>v.events.length>0):$,j=v=>{let D=`cal-status-${v.status}`,re=v.projected?"cal-event-projected":"",pe=v.status==="overdue"&&v.days_until_due!=null?` (${we(v.days_until_due,e)})`:"",O=v.projected&&v.interval_days?n`<span class="cal-event-recur">${v.interval_unit&&v.interval_unit!=="days"?Ri(v.interval_days,v.interval_unit,e):v.interval_days===1?s("cal_every_day",e):s("cal_every_n_days",e).replace("{n}",String(v.interval_days))}</span>`:h,z=v.schedule_type==="sensor_based",B=z?n`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${s("cal_source_sensor",e)}" icon="mdi:trending-up"></ha-icon>`:n`<ha-icon class="cal-event-icon cal-source-time"
                title="${v.adaptive_enabled?s("cal_source_time_adaptive",e):s("cal_source_time",e)}"
                icon="${v.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,P=z&&v.prediction_confidence&&v.status!=="triggered"&&!v.projected?n`<span class="cal-event-prediction cal-conf-${v.prediction_confidence}">
            ${s("cal_predicted",e)} · ${s(`cal_confidence_${v.prediction_confidence}`,e)}
          </span>`:h,W=ut(this._stats?.budget),K=v.history_type?s(v.history_type,e):s(v.status,e);return n`
        <div class="cal-event ${re}"
          @click=${()=>this._onEventClick(v)}>
          ${B}
          <span class="cal-status-pill ${D}">${K}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${v.object_name} · ${v.task_name}${pe}</div>
            ${P}
            ${O}
          </div>
          ${v.avg_cost!=null&&v.avg_cost!==0?n`<span class="cal-event-cost">${V(v.avg_cost,W,e)}</span>`:h}
        </div>
      `},C=v=>{let[D,re,pe]=v.date.split("-").map(Number),O=new Date(D,re-1,pe),z=v.date===b,B=Ci(O,e,"short"),P=Mi(O,e,"long");return n`
        <div class="cal-day-row">
          <div class="cal-day-pill ${z?"cal-today":""}">
            <span class="cal-pill-weekday">${B}</span>
            <span class="cal-pill-day">${O.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${P}</span>
              ${z?n`<span class="cal-day-today-badge">${s("today",e)}</span>`:h}
            </div>
            ${v.events.length===0?n`<div class="cal-empty">${s("cal_no_events",e)}</div>`:v.events.map(j)}
          </div>
        </div>
      `};return n`
      <ha-card .header=${a}>
        ${t||i||p?n`
              <div class="cal-controls">
                ${t?n`
                      <div class="cal-window-chips cal-past-chips" title="${s("cal_past_windows",e)}">
                        ${[30,90].map(v=>n`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===v?"active":""}"
                            @click=${()=>{this._pastDays=v}}>
                            −${v}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${s("cal_forward_windows",e)}">
                        ${[7,14,30,365].map(v=>n`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===v?"active":""}"
                            @click=${()=>{this._windowDays=v,this._pastDays=0}}>
                            ${v===365?"+1y":`+${v}d`}
                          </button>
                        `)}
                      </div>
                    `:h}
                ${i?n`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${v=>{this._userFilter=v.target.value}}>
                        <option value="">${s("all_users",e)}</option>
                        <option value="current_user">${s("my_tasks",e)}</option>
                      </select>
                    `:h}
                ${p?n`
                      <select class="cal-user-filter"
                        .value=${g??""}
                        @change=${v=>{this._objectFilter=v.target.value}}>
                        <option value="">${s("all_objects",e)}</option>
                        ${[...u].sort((v,D)=>v.object.name.localeCompare(D.object.name)).map(v=>n`<option value=${v.entry_id} ?selected=${v.entry_id===g}>${v.object.name}</option>`)}
                      </select>
                    `:h}
              </div>
            `:h}
        <div class="cal-rolling">
          ${T.length===0&&k?n`<div class="cal-empty">${s("cal_no_events",e)}</div>`:T.map(C)}
        </div>
      </ha-card>
    `}};ge.styles=[gt,Ws,H`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],_([S({attribute:!1})],ge.prototype,"hass",2),_([f()],ge.prototype,"_config",2),_([f()],ge.prototype,"_objects",2),_([f()],ge.prototype,"_stats",2),_([f()],ge.prototype,"_windowDays",2),_([f()],ge.prototype,"_pastDays",2),_([f()],ge.prototype,"_userFilter",2),_([f()],ge.prototype,"_objectFilter",2),_([f()],ge.prototype,"_unsub",2),_([f()],ge.prototype,"_pastHistory",2);var Ia=[{value:7,key:"cal_editor_window_week"},{value:14,key:"cal_editor_window_fortnight"},{value:30,key:"cal_editor_window_month"},{value:365,key:"cal_editor_window_year"}],za=[{value:30,key:"cal_editor_window_past_30"},{value:90,key:"cal_editor_window_past_90"}],Ye=class extends L{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}get _lang(){return N(this.hass)}setConfig(e){this._config={...e}}updated(){let e=this._lang;e&&!Ut(e)&&oe(e).then(()=>{Ut(e)&&this.requestUpdate()})}_valueChanged(e,t){let i={...this._config,[e]:t};e==="show_window_chips"&&t===!0&&delete i.show_window_chips,e==="show_user_filter"&&t===!0&&delete i.show_user_filter,e==="show_object_filter"&&t===!0&&delete i.show_object_filter,e==="title"&&(!t||typeof t=="string"&&t.trim()==="")&&delete i.title,e==="user_filter"&&t===""&&delete i.user_filter,this._emit(i)}_windowChanged(e){let t={...this._config};e.startsWith("past-")?(t.past_days=Number(e.slice(5)),delete t.window_days):(t.window_days=Number(e),delete t.past_days),this._emit(t)}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){let e=this._lang,t=this._config.past_days?`past-${this._config.past_days}`:`${this._config.window_days??30}`,i=this._config.show_window_chips!==!1,a=this._config.show_user_filter!==!1,r=this._config.user_filter??"",o=this._config.title??"";return n`
      <div class="editor">
        <div class="row">
          <label for="title">${s("card_title",e)}</label>
          <input
            id="title"
            type="text"
            .value=${o}
            @input=${c=>this._valueChanged("title",c.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">${s("cal_editor_window",e)}</label>
          <select
            id="window"
            @change=${c=>this._windowChanged(c.target.value)}
          >
            ${Ia.map(c=>n`<option value="${c.value}" ?selected=${`${c.value}`===t}>${s(c.key,e)}</option>`)}
            ${za.map(c=>n`<option value="past-${c.value}" ?selected=${`past-${c.value}`===t}>${s(c.key,e)}</option>`)}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">${s("cal_editor_show_chips",e)}</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${i}
            @change=${c=>this._valueChanged("show_window_chips",c.target.checked)}
          />
        </div>
        <div class="hint">${s("cal_editor_chips_hint",e)}</div>
        <div class="row toggle">
          <label for="userf">${s("cal_editor_show_user_filter",e)}</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${a}
            @change=${c=>this._valueChanged("show_user_filter",c.target.checked)}
          />
        </div>
        <div class="row">
          <label for="userv">${s("cal_editor_default_user",e)}</label>
          <select
            id="userv"
            @change=${c=>this._valueChanged("user_filter",c.target.value)}
          >
            <option value="" ?selected=${r===""}>${s("all_users",e)}</option>
            <option value="current_user" ?selected=${r==="current_user"}>
              ${s("cal_editor_my_tasks",e)}
            </option>
          </select>
        </div>
        <div class="row toggle">
          <label for="objf">${s("cal_editor_show_object_filter",e)}</label>
          <input
            id="objf"
            type="checkbox"
            .checked=${this._config.show_object_filter!==!1}
            @change=${c=>this._valueChanged("show_object_filter",c.target.checked)}
          />
        </div>
        <div class="hint">${s("cal_editor_object_hint",e)}</div>
      </div>
    `}};Ye.styles=H`
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
  `,_([S({attribute:!1})],Ye.prototype,"hass",2),_([f()],Ye.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",ge);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",Ye);Gs(["maintenance-supporter-calendar-card"],import.meta.url);Ks({type:"maintenance-supporter-calendar-card",name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});var me=class extends L{constructor(){super(...arguments);this.objects=[];this._summary=null;this._loaded=!1;this._busy=!1;this._error="";this._query="";this._results=[];this._expanded=!1;this._initiallyLoaded=!1;this._searchTimer=0;this._searchSeq=0}get _lang(){return N(this.hass)}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._initiallyLoaded&&(this._initiallyLoaded=!0,this._load(),oe(this._lang).then(()=>this.requestUpdate()))}async _load(){let e=await I(this,{type:"maintenance_supporter/documents/storage"},{busy:t=>{this._busy=t},onError:t=>{this._error=t}});this._loaded=!0,e!==void 0&&(this._summary=e,this._error="")}_nameFor(e){return this.objects.find(i=>i.object?.id===e)?.object?.name||e.slice(0,8)}_entryFor(e){return this.objects.find(t=>t.object?.id===e)?.entry_id}_toggle(){this._expanded=!this._expanded}_openObject(e){this.dispatchEvent(new CustomEvent("open-object",{detail:{entry_id:e},bubbles:!0,composed:!0}))}_onSearch(e){this._query=e.target.value,clearTimeout(this._searchTimer),this._searchTimer=window.setTimeout(()=>{this._doSearch()},250)}async _doSearch(){let e=this._query.trim(),t=++this._searchSeq;if(!e){this._results=[];return}let i="",a=await I(this,{type:"maintenance_supporter/documents/search",query:e},{onError:r=>{i=r}});if(t===this._searchSeq){if(a===void 0){this._error=i,this._results=[];return}this._results=a?.results||[]}}async _openResult(e){if(e.kind==="weblink"){ce(e.url)&&window.open(e.url,"_blank","noopener");return}await I(this,()=>Re(this.hass,e.id),{onError:t=>{this._error=t}})}_renderResult(e,t){return n`
      <div class="obj-row result-row" title=${s("doc_open",t)} @click=${()=>this._openResult(e)}>
        <ha-icon icon=${e.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"}></ha-icon>
        <div class="result-info">
          <div class="result-title">${le(e)}</div>
          <div class="result-obj">${e.object_name}</div>
        </div>
        <ha-icon class="result-open" icon=${e.kind==="weblink"?"mdi:open-in-new":"mdi:eye-outline"}></ha-icon>
      </div>
    `}render(){if(!this._loaded||!this._summary)return h;let e=this._summary;if(!e.document_count)return h;let t=this._lang,i=Object.entries(e.by_object??{}).filter(([,a])=>a.files>0||a.links>0).map(([a,r])=>({id:a,name:this._nameFor(a),entry:this._entryFor(a),...r})).sort((a,r)=>r.bytes-a.bytes);return n`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <button
              class="toggle"
              @click=${this._toggle}
              aria-expanded=${this._expanded?"true":"false"}
              aria-label=${s("doc_storage_title",t)}
            >
              <ha-icon class="chevron" icon=${this._expanded?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
              <span class="emoji">🗄️</span>
              <span class="title-text">${s("doc_storage_title",t)}</span>
              <span class="header-summary">
                ${je(e.total_bytes,t)}
                ${e.dedup_savings_bytes>0?n`<span class="saved">−${je(e.dedup_savings_bytes,t)}</span>`:h}
              </span>
            </button>
            <button
              class="icon-btn"
              title=${s("doc_storage_refresh",t)}
              ?disabled=${this._busy}
              @click=${this._load}
            >
              <ha-icon icon="mdi:refresh"></ha-icon>
            </button>
          </div>

          ${this._expanded?n`
                <div class="body">
                  <div class="totals">
                    <div class="stat">
                      <div class="stat-value">${je(e.total_bytes,t)}</div>
                      <div class="stat-label">
                        <ha-icon icon="mdi:file-document-outline"></ha-icon> ${e.file_count}
                        <ha-icon icon="mdi:link-variant"></ha-icon> ${e.link_count}
                      </div>
                    </div>
                    ${e.dedup_savings_bytes>0?n`<div class="stat">
                          <div class="stat-value saved">−${je(e.dedup_savings_bytes,t)}</div>
                          <div class="stat-label">${s("doc_storage_saved",t)}</div>
                        </div>`:h}
                  </div>

                  ${e.search_index&&e.search_index.total>0?n`<div class="index-status">
                        <ha-icon icon="mdi:text-search"></ha-icon>
                        ${s("search_index_status",t).replace("{indexed}",String(e.search_index.indexed)).replace("{total}",String(e.search_index.total)).replace("{no_text}",String(e.search_index.no_text+e.search_index.unsupported)).replace("{pending}",String(e.search_index.pending))}
                      </div>`:h}
                  <div class="doc-search">
                    <ha-icon icon="mdi:magnify"></ha-icon>
                    <input
                      type="search"
                      aria-label=${s("doc_search",t)}
                      placeholder=${s("doc_search",t)}
                      .value=${this._query}
                      @input=${this._onSearch}
                    />
                  </div>

                  ${this._error?n`<div class="error">${this._error}</div>`:h}

                  ${this._query.trim()?this._results.length?n`<div class="obj-list">${this._results.map(a=>this._renderResult(a,t))}</div>`:n`<div class="search-empty">${s("doc_search_none",t)}</div>`:i.length?n`<div class="obj-list">${i.map(a=>this._renderObjRow(a,t))}</div>`:h}
                </div>
              `:h}
        </div>
      </ha-card>
    `}_renderObjRow(e,t){let i=e.entry;return n`
      <div
        class="obj-row ${i?"clickable":""}"
        role=${i?"button":h}
        tabindex=${i?"0":h}
        aria-label=${i?e.name:h}
        @click=${i?()=>this._openObject(i):void 0}
        @keydown=${i?a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),this._openObject(i))}:void 0}
      >
        <span class="obj-name">${e.name}</span>
        <span class="obj-meta">
          ${e.files>0?n`<ha-icon icon="mdi:file-document-outline"></ha-icon>${e.files}`:h}
          ${e.links>0?n`<ha-icon icon="mdi:link-variant"></ha-icon>${e.links}`:h}
        </span>
        <span class="obj-size">${je(e.bytes,t)}</span>
        ${i?n`<ha-icon class="obj-go" icon="mdi:chevron-right"></ha-icon>`:h}
      </div>
    `}};me.styles=H`
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
  `,_([S({attribute:!1})],me.prototype,"hass",2),_([S({attribute:!1})],me.prototype,"objects",2),_([f()],me.prototype,"_summary",2),_([f()],me.prototype,"_loaded",2),_([f()],me.prototype,"_busy",2),_([f()],me.prototype,"_error",2),_([f()],me.prototype,"_query",2),_([f()],me.prototype,"_results",2),_([f()],me.prototype,"_expanded",2);customElements.get("maintenance-storage-section-card")||customElements.define("maintenance-storage-section-card",me);var Ha=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"],ye=class extends L{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId="";this._values=new Array(12).fill("");this._save=async()=>{let e=this._buildOverrides();e!==null&&await this._send(e)!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved")))};this._clearAll=async()=>{await this._send({})!==void 0&&(this._values=new Array(12).fill(""),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved")))}}get _lang(){return N(this.hass)}open(e,t,i){if(this._entryId=e,this._taskId=t,this._values=new Array(12).fill(""),i)for(let[a,r]of Object.entries(i)){let o=parseInt(a,10);o>=1&&o<=12&&typeof r=="number"&&(this._values[o-1]=r.toString())}this._error="",this._open=!0}_close(){this._open=!1}_buildOverrides(){let e={};for(let t=0;t<12;t++){let i=this._values[t].trim();if(!i)continue;let a=parseFloat(i);if(Number.isNaN(a))return this._error=`${s("month_"+["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][t],this._lang)}: ${s("seasonal_override_invalid",this._lang)}`,null;if(a<it[0]||a>it[1])return this._error=s("seasonal_override_range",this._lang),null;e[t+1]=a}return e}_send(e){return this._error="",I(this,{type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:e},{busy:t=>{this._loading=t},fallbackKey:"save_error",onError:t=>{this._error=t}})}render(){if(!this._open)return n``;let e=this._lang;return n`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${s("seasonal_overrides_title",e)}</div>
        <div class="content">
          <p class="hint">${s("seasonal_overrides_hint",e)}</p>
          ${this._error?n`<div class="error">${this._error}</div>`:h}
          <div class="months">
            ${Ha.map((t,i)=>n`
              <label class="month">
                <span class="mn">${s(t,e)}</span>
                <input type="number" step="0.1" min=${it[0]} max=${it[1]}
                  placeholder="1.0"
                  .value=${this._values[i]}
                  @input=${a=>{let r=[...this._values];r[i]=a.target.value,this._values=r}} />
              </label>
            `)}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._clearAll} .disabled=${this._loading}>
            ${s("clear_all",e)}
          </ha-button>
          <div class="spacer"></div>
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",e)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading}>
            ${this._loading?s("saving",e):s("save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};ye.styles=H`
    .dialog-title { font-size: 18px; font-weight: 500; padding-bottom: 12px; }
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
  `,_([S({attribute:!1})],ye.prototype,"hass",2),_([f()],ye.prototype,"_open",2),_([f()],ye.prototype,"_loading",2),_([f()],ye.prototype,"_error",2),_([f()],ye.prototype,"_entryId",2),_([f()],ye.prototype,"_taskId",2),_([f()],ye.prototype,"_values",2);customElements.get("maintenance-seasonal-overrides-dialog")||customElements.define("maintenance-seasonal-overrides-dialog",ye);var be=class extends L{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._groupId=null;this._name="";this._description="";this._selected=new Set;this._toggleTask=(e,t)=>{let i=`${e}:${t}`,a=new Set(this._selected);a.has(i)?a.delete(i):a.add(i),this._selected=a};this._save=async()=>{let e=this._name.trim();if(!e){this._error=s("group_name_required",this._lang);return}this._error="";let t=this._buildTaskRefs();await I(this,this._groupId?{type:"maintenance_supporter/group/update",group_id:this._groupId,name:e,description:this._description,task_refs:t}:{type:"maintenance_supporter/group/create",name:e,description:this._description,task_refs:t},{busy:a=>{this._loading=a},fallbackKey:"save_error",onError:a=>{this._error=a}})!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("group-saved")))}}get _lang(){return N(this.hass)}openCreate(){this._reset(),this._open=!0}openEdit(e,t){this._reset(),this._groupId=e,this._name=t.name,this._description=t.description||"",this._selected=new Set(t.task_refs.map(i=>`${i.entry_id}:${i.task_id}`)),this._open=!0}_reset(){this._groupId=null,this._name="",this._description="",this._selected=new Set,this._error=""}_close(){this._open=!1}_buildTaskRefs(){return[...this._selected].map(e=>{let[t,i]=e.split(":",2);return{entry_id:t,task_id:i}})}render(){if(!this._open)return n``;let e=this._lang,t=this._groupId?s("edit_group",e):s("new_group",e);return n`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?n`<div class="error">${this._error}</div>`:h}
          <ms-textfield
            label="${s("name",e)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("description_optional",e)}"
            .value=${this._description}
            @input=${i=>this._description=i.target.value}
          ></ms-textfield>

          <div class="section-title">${s("group_select_tasks",e)}</div>
          ${this.objects.length===0?n`<div class="hint">${s("no_objects",e)}</div>`:n`
              <div class="objects">
                ${[...this.objects].sort((i,a)=>i.object.name.localeCompare(a.object.name)).map(i=>n`
                  <div class="object-block">
                    <div class="object-name">${i.object.name}</div>
                    ${i.tasks.length===0?n`<div class="hint small">${s("no_tasks_short",e)}</div>`:[...i.tasks].sort((a,r)=>a.name.localeCompare(r.name)).map(a=>{let r=`${i.entry_id}:${a.id}`,o=this._selected.has(r);return n`
                          <label class="task-row">
                            <input type="checkbox"
                              .checked=${o}
                              @change=${()=>this._toggleTask(i.entry_id,a.id)} />
                            <span>${a.name}</span>
                          </label>
                        `})}
                  </div>
                `)}
              </div>
            `}
          <div class="selected-count">
            ${s("selected",e)}: ${this._selected.size}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",e)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading||!this._name.trim()}>
            ${this._loading?s("saving",e):s("save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};be.styles=H`
    .dialog-title { font-size: 18px; font-weight: 500; padding-bottom: 12px; }
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
  `,_([S({attribute:!1})],be.prototype,"hass",2),_([S({attribute:!1})],be.prototype,"objects",2),_([f()],be.prototype,"_open",2),_([f()],be.prototype,"_loading",2),_([f()],be.prototype,"_error",2),_([f()],be.prototype,"_groupId",2),_([f()],be.prototype,"_name",2),_([f()],be.prototype,"_description",2),_([f()],be.prototype,"_selected",2);customElements.get("maintenance-group-dialog")||customElements.define("maintenance-group-dialog",be);var Te=class extends L{constructor(){super(...arguments);this._open=!1;this._busy=!1;this._error="";this._name="";this._views=[];this._filters=null;this._localeReady=!1;this._save=async()=>{let e=this._name.trim();if(!e||this._busy||!this._filters)return;let t=await this._runWs({type:"maintenance_supporter/views/save",name:e,filters:this._filters});t!==void 0&&(this._name="",this._emitChanged(t?.views||[]))};this._delete=async e=>{if(this._busy)return;let t=await this._runWs({type:"maintenance_supporter/views/delete",view_id:e});t!==void 0&&this._emitChanged(t?.views||[])}}get _lang(){return N(this.hass)}updated(e){e.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,oe(this._lang).then(()=>this.requestUpdate())),e.has("_open")&&this._open&&bs(this.shadowRoot)}async open(e,t){this._open=!0,this._error="",this._name="",this._filters=e,this._views=t}_close(){this._open=!1}_emitChanged(e){this._views=e,this.dispatchEvent(new CustomEvent("saved-views-changed",{bubbles:!0,composed:!0,detail:{views:e}}))}_runWs(e){return this._error="",I(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}render(){if(!this._open)return n``;let e=this._lang;return ms(()=>this._close(),n`
        <div class="title">${s("views_dialog_title",e)}</div>
        <div class="hint">${s("views_dialog_hint",e)}</div>
        ${this._error?n`<div class="error">${this._error}</div>`:h}

        <div class="save-row">
          <input
            class="name-input"
            type="text"
            .value=${this._name}
            placeholder=${s("views_name_placeholder",e)}
            aria-label=${s("views_name_placeholder",e)}
            maxlength="60"
            @input=${t=>this._name=t.target.value}
            @keydown=${t=>{t.key==="Enter"&&this._save()}}
          />
          <ha-button @click=${this._save} .disabled=${!this._name.trim()||this._busy}>
            ${s("views_save_current",e)}
          </ha-button>
        </div>

        ${this._views.length===0?n`<div class="empty">${s("views_none_yet",e)}</div>`:n`
              <div class="list dialog-scroll">
                ${this._views.map(t=>n`
                    <div class="row">
                      <span class="row-name">${t.name}</span>
                      <ha-icon-button
                        .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                        .label=${s("delete",e)}
                        @click=${()=>this._delete(t.id)}
                      ></ha-icon-button>
                    </div>
                  `)}
              </div>
            `}

        <div class="actions">
          <ha-button appearance="plain" @click=${this._close}>${s("close",e)}</ha-button>
        </div>
    `)}};Te.styles=[_s,H`
    :host {
      --ms-modal-max-height: 90dvh;
      --ms-modal-gap: 12px;
      --ms-modal-z: 1000;
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
      gap: 6px;
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
  `],_([S({attribute:!1})],Te.prototype,"hass",2),_([f()],Te.prototype,"_open",2),_([f()],Te.prototype,"_busy",2),_([f()],Te.prototype,"_error",2),_([f()],Te.prototype,"_name",2),_([f()],Te.prototype,"_views",2);customElements.get("maintenance-saved-views-dialog")||customElements.define("maintenance-saved-views-dialog",Te);var La=60,Ba=20,Ys=30,Na={approaching:"\u2197",stable:"\u2192",easing:"\u2198"};function di(l,d){let e=l.trigger_config,t=_e(e);if(!e||!t||l.battery_fleet_task)return null;let i,a=e.type||"threshold";if(a==="threshold")if(e.trigger_above!=null)i=1;else if(e.trigger_below!=null)i=-1;else return null;else if(a==="counter"||a==="runtime"||a==="state_change")i=1;else return null;let r=d.get(Ue(t,$e(e)))||[],o=a==="runtime"||a==="state_change",c=r.length>=2?r.map($=>({ts:$.ts,val:$.val})):o?[]:(l.history||[]).filter($=>$.trigger_value!=null).map($=>({ts:ve($.timestamp),val:$.trigger_value}));if(l.trigger_current_value!=null&&(c=[...c,{ts:Date.now(),val:l.trigger_current_value}]),c.length<2)return null;c.sort(($,k)=>$.ts-k.ts);let u=c.map($=>$.val),p=Math.max(...u)-Math.min(...u),g=u[u.length-1]-u[0],m=e.trigger_delta_mode&&l.trigger_baseline_value!=null&&e.trigger_target_value!=null?l.trigger_baseline_value+e.trigger_target_value:e.trigger_target_value,b=a==="threshold"?e.trigger_above??e.trigger_below:a==="counter"?m:a==="runtime"?e.trigger_runtime_hours:e.trigger_target_changes,y=typeof b=="number"?Math.max(Math.abs(b-u[0]),p):p;return y===0||Math.abs(g)<y*(typeof b=="number"?.05:.15)?"stable":Math.sign(g)===i?"approaching":"easing"}function ot(l){return l>0?Math.ceil(l):Math.trunc(l)||0}function pi(l,d){let e=l.trigger_config??null;if(!e)return h;let t=e.type||"threshold",i=l.trigger_entity_info?.unit_of_measurement??"",a=0,r="",o="";if(t==="threshold"){let p=l.trigger_current_value??null;if(p==null)return h;let g=e.trigger_above,m=e.trigger_below;if(g!=null&&m!=null){let b=(g+m)/2,y=Math.abs(g-m)/2||1;a=Math.min(100,Math.max(0,Math.abs(p-b)/y*100));let $=Math.abs(p-g)<=Math.abs(p-m)?g:m;r=`${he(p,"",d?.lang)} / ${ee($,d?.lang)}`,o=i}else if(g!=null){let b=l.trigger_entity_info?.min,y=g>0?0:b!=null&&b<g?b:g<0?2*g:-100,$=g-y||1;a=Math.min(100,Math.max(0,(p-y)/$*100)),r=`${he(p,"",d?.lang)} / ${ee(g,d?.lang)}`,o=i}else if(m!=null){let b=l.trigger_entity_info?.max,y=b!=null&&b>m?b:m>0?m*2:m<0?0:100,$=y-m||1;a=Math.min(100,Math.max(0,(y-p)/$*100)),r=`${he(p,"",d?.lang)} / ${ee(m,d?.lang)}`,o=i}else if(e.trigger_equals!=null||e.trigger_not_equals!=null){let b=e.trigger_equals!=null?`= ${e.trigger_equals}`:`\u2260 ${e.trigger_not_equals}`;r=`${he(p,"",d?.lang)} (${b}${i?` ${i}`:""})`,a=l.trigger_active?100:0}else return h}else if(t==="counter"){let p=e.trigger_target_value||1,g;if(e.trigger_delta_mode?(g=l.trigger_current_delta??null,g==null&&l.trigger_baseline_value!=null&&l.trigger_current_value!=null&&(g=l.trigger_current_value-l.trigger_baseline_value)):g=l.trigger_current_value??null,g==null)return h;a=Math.min(100,Math.max(0,g/p*100)),r=`${he(g,"",d?.lang)} / ${ee(p,d?.lang)}`,o=i}else if(t==="state_change"){let p=e.trigger_target_changes||1,g=l.trigger_current_value??null;if(g==null)return h;a=Math.min(100,Math.max(0,g/p*100)),r=`${ee(g,d?.lang,0)} / ${ee(p,d?.lang,0)}`}else if(t==="runtime"){let p=e.trigger_runtime_hours||100,g=l.trigger_current_value??null;if(g==null)return h;a=Math.min(100,Math.max(0,g/p*100)),r=`${he(g,"",d?.lang)}h / ${ee(p,d?.lang)}h`}else if(t==="due_date"){let p=l.trigger_current_value??null;if(p==null)return h;let g=e.trigger_days_before??0;a=p<=g?100:Math.max(0,100-(p-g)/30*100),r=we(ot(p),d?.lang)}else if(t==="compound"){let p=e.compound_logic||e.operator||"AND",g=e.conditions?.length||0;r=`${p} (${g})`,a=l.trigger_active?100:0}else return h;if(l.battery_fleet_task&&t==="threshold"&&l.trigger_current_value!=null){let p=Math.round(l.trigger_current_value),g=e.trigger_above??0;a=p>g?100:g>0?Math.max(0,p/(g+1)*100):0,r=s("battery_fleet_progress",d?.lang??"en").replace("{n}",ee(p,d?.lang,0)),o=""}let c=a>=100,u=a>90?"var(--error-color, #f44336)":a>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return n`
    <div class="trigger-progress">
      <div class="trigger-progress-bar">
        <div class="trigger-progress-fill${c?" overflow":""}" style="width:${a}%;background:${u}"></div>
      </div>
      <span class="trigger-progress-label"><span class="trigger-progress-text"><span class="tp-num">${r}</span>${o?n` <span class="tp-unit">${o}</span>`:h}</span>${d?.trend?n`<i class="trend-arrow trend-${d.trend}" title="${s(`trend_${d.trend}`,d.lang??"en")}" aria-label="${s(`trend_${d.trend}`,d.lang??"en")}">${Na[d.trend]}</i>`:h}</span>
    </div>
  `}function hi(l,d,e){let t=_e(l.trigger_config);if(!t||l.battery_fleet_task)return h;let i=d.get(Ue(t,$e(l.trigger_config)))||[],a=[];if(i.length>=2)a=i.map(v=>({ts:v.ts,val:v.val}));else{if(!l.history)return h;for(let v of l.history)v.trigger_value!=null&&a.push({ts:ve(v.timestamp),val:v.trigger_value})}if(l.trigger_current_value!=null&&a.push({ts:Date.now(),val:l.trigger_current_value}),a.length<2)return h;a.sort((v,D)=>v.ts-D.ts);let r=La,o=Ba,c=a.map(v=>v.val),u=Math.min(...c),p=Math.max(...c),g=p-u||1;u-=g*.1,p+=g*.1;let m=a[0].ts,y=a[a.length-1].ts-m||1,$=v=>(v-m)/y*r,k=v=>2+(1-(v-u)/(p-u))*(o-4),T=a;if(T.length>Ys){let v=Math.ceil(T.length/Ys);T=T.filter((D,re)=>re%v===0||re===T.length-1)}let j=T.map(v=>`${R($(v.ts))},${R(k(v.val))}`).join(" "),C=l.trigger_active?"var(--error-color, #f44336)":"var(--primary-color)";return n`
    <svg class="mini-sparkline" viewBox="0 0 ${r} ${o}" preserveAspectRatio="none" role="img" aria-label="${s("chart_mini_sparkline",e)}">
      <polyline points="${j}" fill="none" stroke="${C}" stroke-width="1.5" stroke-linejoin="round" />
    </svg>
  `}function ui(l,d,e="last-done"){let t=Oi(l,d);return t?n`<span class="${e}" title="${s("last_performed",d)}: ${q(l,d)}">${t}</span>`:null}function gi(l,d,e,t="due-text"){return(l==null?ui(d,e,`${t} last-done`):null)??n`<span class="${t}">${we(l,e)}</span>`}function Qs(l,d){let e=d;if(l.days_until_due==null||!l.interval_days||l.interval_days<=0)return h;let{pct:t,overflow:i}=Rt(l.interval_days,l.days_until_due,l.interval_unit),a="var(--success-color, #4caf50)";return l.status==="overdue"?a="var(--error-color, #f44336)":l.status==="due_soon"&&(a="var(--warning-color, #ff9800)"),n`
    <div class="days-progress">
      <div class="days-progress-labels">
        <span>${l.last_performed?`${s("last_performed",e)}: ${q(l.last_performed,e)}`:""}</span>
        <span>${l.next_due?`${s("next_due",e)}: ${q(l.next_due,e)}`:""}</span>
      </div>
      <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(t)}" aria-valuemin="0" aria-valuemax="100" aria-label="${s("days_progress",e)}">
        <div class="days-progress-fill${i?" overflow":""}" style="width:${t}%;background:${a}"></div>
      </div>
      <div class="days-progress-text">${we(l.days_until_due,e)}</div>
    </div>
  `}var Lt=210,xe=46,De=14,Ae=12,Xs=14,qa=20+Xs,Fa=[{days:7,key:"chart_range_7d"},{days:30,key:"chart_range_30d"},{days:90,key:"chart_range_90d"},{days:365,key:"chart_range_1y"}],Z=class extends L{constructor(){super(...arguments);this.points=[];this.events=[];this.unit="";this.lang="en";this.thresholdAbove=null;this.thresholdBelow=null;this.targetValue=null;this.targetMark="\u25C6";this.forceZero=!1;this.projection=null;this.rangeDays=30;this.showRange=!0;this.busy=!1;this.hideOutliers=!1;this.showOutlierToggle=!0;this._width=0;this._hover=null;this._ro=null}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(e=>{let t=Math.floor(e[0]?.contentRect?.width||0);t&&Math.abs(t-this._width)>2&&(this._width=t)}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=null}_emitRange(e){e!==this.rangeDays&&this.dispatchEvent(new CustomEvent("range-change",{detail:{days:e},bubbles:!0,composed:!0}))}_toggleOutliers(){this.dispatchEvent(new CustomEvent("outlier-toggle",{detail:{hide:!this.hideOutliers},bubbles:!0,composed:!0}))}render(){let e=this._width||320,t=[...this.points].sort((a,r)=>a.ts-r.ts),i=this.lang;return n`
      <div class="chart-wrap">
        ${this.showRange?n`<div class="range-chips" role="group">
              ${this.showOutlierToggle?n`<button
                    class="range-chip outlier-chip ${this.hideOutliers?"active":""}"
                    ?disabled=${this.busy}
                    title=${s("hide_outliers",i)}
                    @click=${()=>this._toggleOutliers()}
                  ><ha-icon icon="mdi:filter-variant"></ha-icon></button>`:h}
              ${Fa.map(a=>n`<button
                  class="range-chip ${this.rangeDays===a.days?"active":""}"
                  ?disabled=${this.busy}
                  @click=${()=>this._emitRange(a.days)}
                >${s(a.key,i)}</button>`)}
            </div>`:h}
        ${t.length<2?n`<div class="chart-empty">
              <ha-icon icon="mdi:chart-line"></ha-icon> ${s("loading_chart",i)}
            </div>`:this._renderSvg(e,t)}
      </div>
    `}_renderSvg(e,t){let i=this.lang,a=e-xe-De,r=Lt-qa,o=r-Ae,c=1/0,u=-1/0;for(let E of t)c=Math.min(c,E.min??E.val),u=Math.max(u,E.max??E.val);this.thresholdAbove!=null&&(c=Math.min(c,this.thresholdAbove),u=Math.max(u,this.thresholdAbove)),this.thresholdBelow!=null&&(c=Math.min(c,this.thresholdBelow),u=Math.max(u,this.thresholdBelow)),this.targetValue!=null&&(c=Math.min(c,this.targetValue),u=Math.max(u,this.targetValue)),this.forceZero&&(c=Math.min(c,0));let p=(u-c||1)*.06,g=this.forceZero&&c>=0?0:c>=0?Math.max(0,c-p):c-p,{ticks:m,niceMin:b,niceMax:y}=st(g,u+p,4);c>=0&&b<0&&(b=0,m=m.filter(E=>E>=0));let $=m.length>1?m[1]-m[0]:0,k=t[0].ts,T=this.projection&&this.projection.length===2?this.projection[1].ts:null,j=T!=null?Math.max(t[t.length-1].ts,T):t[t.length-1].ts,C=j-k||1,v=E=>xe+(E-k)/C*a,D=E=>Ae+(1-(E-b)/(y-b||1))*o,re=t.map(E=>`${R(v(E.ts))},${R(D(E.val))}`).join(" "),pe=`M${R(v(t[0].ts))},${r} `+t.map(E=>`L${R(v(E.ts))},${R(D(E.val))}`).join(" ")+` L${R(v(t[t.length-1].ts))},${r} Z`,O="",z=t.filter(E=>E.min!=null&&E.max!=null);if(z.length>=2){let E=z.map(ne=>`${R(v(ne.ts))},${R(D(ne.max))}`),G=[...z].reverse().map(ne=>`${R(v(ne.ts))},${R(D(ne.min))}`);O=`M${E[0]} `+E.slice(1).map(ne=>`L${ne}`).join(" ")+` L${G.join(" L")} Z`}let B=[];if(this.thresholdBelow!=null){let E=D(this.thresholdBelow);B.push({y:E,h:Math.max(0,r-E),lineY:E,label:`\u25BC ${Me(this.thresholdBelow,i)}`,labelY:Math.min(r-4,E+13)})}if(this.thresholdAbove!=null){let E=D(this.thresholdAbove);B.push({y:Ae,h:Math.max(0,E-Ae),lineY:E,label:`\u25B2 ${Me(this.thresholdAbove,i)}`,labelY:Math.max(Ae+11,E-5)})}let P=t[t.length-1],W=(this.events||[]).filter(E=>E.ts>=k&&E.ts<=j),K=St(k,j,Math.max(2,Math.min(5,Math.floor(a/110)+1))),Q=this._hover;return n`
      <div class="svg-holder">
        <svg
          class="chart-svg"
          viewBox="0 0 ${e} ${Lt}"
          width=${e}
          height=${Lt}
          role="img"
          aria-label=${s("chart_sparkline",i)}
          @pointermove=${E=>this._onPointer(E,t,v,D,e)}
          @pointerdown=${E=>this._onPointer(E,t,v,D,e)}
          @pointerleave=${()=>this._hover=null}
        >
          <defs>
            <clipPath id="plot"><rect x="${xe}" y="${Ae}" width="${a}" height="${o}" /></clipPath>
            ${B.length?Y`<clipPath id="danger">${B.map(E=>Y`<rect x="${xe}" y="${R(E.y)}" width="${a}" height="${R(E.h)}" />`)}</clipPath>`:h}
            <!-- Diagonal hatch so the danger zone reads without relying on the
                 red tint alone (dark-theme contrast + colour-blind support). -->
            <pattern id="dangerHatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
              <rect width="7" height="7" fill="var(--error-color, #f44336)" opacity="0.10" />
              <line x1="0" y1="0" x2="0" y2="7" stroke="var(--error-color, #f44336)" stroke-width="1.4" opacity="0.5" />
            </pattern>
          </defs>

          ${m.map(E=>{let G=D(E);return G<Ae-1||G>r+1?h:Y`
              <line x1="${xe}" y1="${R(G)}" x2="${e-De}" y2="${R(G)}"
                stroke="var(--divider-color)" stroke-width="1" opacity="0.6" />
              <text x="${xe-7}" y="${R(G+3.5)}" text-anchor="end" class="tick-label">${ls(E,$,i)}</text>`})}

          ${B.map(E=>Y`<rect x="${xe}" y="${R(E.y)}" width="${a}" height="${R(E.h)}"
              fill="url(#dangerHatch)" />`)}

          ${O?Y`<path d="${O}" fill="var(--primary-color)" opacity="0.08" clip-path="url(#plot)" />`:h}
          <path d="${pe}" fill="var(--primary-color)" opacity="0.10" clip-path="url(#plot)" />
          <polyline points="${re}" fill="none" stroke="var(--primary-color)" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" clip-path="url(#plot)" />
          ${B.length?Y`<polyline points="${re}" fill="none" stroke="var(--error-color, #f44336)" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" clip-path="url(#danger)" />`:h}

          ${B.map(E=>Y`
              <line x1="${xe}" y1="${R(E.lineY)}" x2="${e-De}" y2="${R(E.lineY)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${e-De-4}" y="${R(E.labelY)}" text-anchor="end" class="zone-label">${E.label}</text>`)}

          ${this.targetValue!=null?Y`<line x1="${xe}" y1="${R(D(this.targetValue))}" x2="${e-De}" y2="${R(D(this.targetValue))}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${e-De-4}" y="${R(D(this.targetValue)-5)}" text-anchor="end" class="zone-label">${this.targetMark} ${Me(this.targetValue,i)} ${this.unit}</text>`:h}

          ${this.projection&&this.projection.length===2?Y`<line x1="${R(v(this.projection[0].ts))}" y1="${R(D(this.projection[0].val))}"
                x2="${R(Math.min(v(this.projection[1].ts),e-De))}" y2="${R(D(Math.max(b,Math.min(y,this.projection[1].val))))}"
                stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.8" />`:h}

          ${K.map((E,G)=>{let ne=v(E),ze=G===0?"start":G===K.length-1?"end":"middle",ae=Xt(E,i,k,j);return G>0&&ae===Xt(K[G-1],i,k,j)?h:Y`<text x="${R(ne)}" y="${Lt-5}" text-anchor="${ze}" class="tick-label">${ae}</text>`})}

          <line x1="${xe}" y1="${r}" x2="${e-De}" y2="${r}" stroke="var(--divider-color)" stroke-width="1" />

          ${W.map(E=>{let G=v(E.ts),ne=E.type==="completed"?"var(--success-color, #4caf50)":E.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return Y`
              <line x1="${R(G)}" y1="${Ae}" x2="${R(G)}" y2="${r}" stroke="${ne}" stroke-width="1" opacity="0.14" />
              <rect x="${R(G-1.5)}" y="${r+3}" width="3" height="${Xs-6}" rx="1.5" fill="${ne}">
                <title>${Jt(E.ts,i)}</title>
              </rect>`})}

          ${Q?Y`
                <line x1="${R(Q.x)}" y1="${Ae}" x2="${R(Q.x)}" y2="${r}"
                  stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.7" />
                <circle cx="${R(Q.x)}" cy="${R(Q.y)}" r="4.5" fill="var(--primary-color)"
                  stroke="var(--card-background-color, #fff)" stroke-width="2" />`:Y`<circle cx="${R(v(P.ts))}" cy="${R(D(P.val))}" r="4" fill="var(--primary-color)"
                stroke="var(--card-background-color, #fff)" stroke-width="1.5" />`}
        </svg>
        ${Q?n`<div
              class="hover-chip"
              style="left:${Math.min(Math.max(Q.x,70),e-70)}px"
            >
              <div class="hover-date">${Jt(Q.p.ts,i)}</div>
              <div class="hover-val">
                ${he(Q.p.val,this.unit,i)}
                ${Q.p.min!=null&&Q.p.max!=null?n`<span class="hover-range">(${Me(Q.p.min,i)}–${Me(Q.p.max,i)})</span>`:h}
              </div>
            </div>`:h}
      </div>
    `}_onPointer(e,t,i,a,r){let c=e.currentTarget.getBoundingClientRect(),u=(e.clientX-c.left)/c.width*r;if(u<xe-8||u>r-De+8){this._hover=null;return}let p=t[0],g=1/0;for(let m of t){let b=Math.abs(i(m.ts)-u);b<g&&(g=b,p=m)}this._hover={x:i(p.ts),y:a(p.val),p}}};Z.styles=H`
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
  `,_([S({attribute:!1})],Z.prototype,"points",2),_([S({attribute:!1})],Z.prototype,"events",2),_([S()],Z.prototype,"unit",2),_([S()],Z.prototype,"lang",2),_([S({attribute:!1})],Z.prototype,"thresholdAbove",2),_([S({attribute:!1})],Z.prototype,"thresholdBelow",2),_([S({attribute:!1})],Z.prototype,"targetValue",2),_([S()],Z.prototype,"targetMark",2),_([S({type:Boolean})],Z.prototype,"forceZero",2),_([S({attribute:!1})],Z.prototype,"projection",2),_([S({attribute:!1})],Z.prototype,"rangeDays",2),_([S({type:Boolean})],Z.prototype,"showRange",2),_([S({type:Boolean})],Z.prototype,"busy",2),_([S({type:Boolean})],Z.prototype,"hideOutliers",2),_([S({type:Boolean})],Z.prototype,"showOutlierToggle",2),_([f()],Z.prototype,"_width",2),_([f()],Z.prototype,"_hover",2);customElements.get("maintenance-trigger-chart")||customElements.define("maintenance-trigger-chart",Z);function Js(l){let d=(l??"").trim().toLowerCase();return d==="on"||d==="open"||d==="true"?1:d==="off"||d==="closed"||d==="false"?0:null}function Ua(l,d,e){if(l.length<2)return null;let t=e.now??Date.now(),i=Math.max(0,d.trigger_for_minutes??0)*6e4,a=d.trigger_from_state?Js(d.trigger_from_state):null,r=d.trigger_to_state?Js(d.trigger_to_state):null;if(d.trigger_from_state&&a===null||d.trigger_to_state&&r===null)return null;let o=[...l].sort((j,C)=>j.ts-C.ts),c=[];for(let j of o){let C=c[c.length-1];(!C||C.level!==j.val)&&c.push({start:j.ts,level:j.val})}let u=j=>(j+1<c.length?c[j+1].start:t)-c[j].start>=i,p=(j,C,v)=>{let D=j[j.length-1];D&&D.val!==v&&j.push({ts:C,val:D.val}),j.push({ts:C,val:v})};if((d.trigger_target_changes??1)===1&&r!==null){let j=[];c.forEach((v,D)=>p(j,v.start,v.level===r&&u(D)?1:0));let C=j[j.length-1]?.val??0;return j.push({ts:t,val:C}),{points:j,mode:"alarm"}}let m=e.since??c[0].start,b=0,y=[];for(let j=1;j<c.length;j++){let C=c[j-1],v=c[j];a!==null&&C.level!==a||r!==null&&v.level!==r||!u(j)||v.start<m||(b+=1,y.push(v.start))}let $=Math.max(0,(e.current??b)-b),k=[{ts:Math.max(m,c[0].start),val:$}],T=$;for(let j of y)T+=1,p(k,j,T);return k.push({ts:t,val:T}),{points:k,mode:"count"}}function Va(l){if(l.length<4)return l;let d=l.map(u=>u.val).sort((u,p)=>u-p),e=u=>{let p=(d.length-1)*u,g=Math.floor(p),m=Math.ceil(p);return d[g]+(d[m]-d[g])*(p-g)},t=e(.25),i=e(.75),a=i-t;if(a===0)return l;let r=t-1.5*a,o=i+1.5*a,c=l.filter(u=>u.val>=r&&u.val<=o);return c.length>=2?c:l}function Zs(l,d){let e=l.trigger_config;if(!e)return h;let t=d.lang,i=l.trigger_entity_info,a=l.trigger_entity_infos,r=_e(e)||"",o=i?.friendly_name||r||"\u2014",c=Gt(e),u=i?.unit_of_measurement||"",p=l.trigger_current_value,g=e.type||"threshold",m=c.length>1,b=Wa(l,u,d);return n`
    <h3>${s("trigger",t)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${m?n`
            <div class="trigger-entity-name">${c.length} ${s("entities",t)} (${e.entity_logic||"any"})</div>
            <div class="trigger-entity-id">${c.map((y,$)=>n`${$>0?", ":""}<span class="entity-link" @click=${k=>et(k,y)}>${y}</span>`)}${e.attribute?` \u2192 ${e.attribute}`:""}</div>
          `:n`
            <div class="trigger-entity-name">${o}</div>
            <div class="trigger-entity-id">${r?n`<span class="entity-link" @click=${y=>et(y,r)}>${r}</span>`:""}${e.attribute?` \u2192 ${e.attribute}`:""}</div>
          `}
        </div>
        <span class="status-badge ${l.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
          ${l.trigger_active?s("triggered",t):s("ok",t)}
        </span>
      </div>

      ${b?Ka(b,t):p!=null?n`
              <div class="trigger-value-row">
                <span class="trigger-current ${l.trigger_active?"active":""}">${g==="due_date"&&typeof p=="number"?we(ot(p),t):typeof p=="number"?he(p,"",t):p}</span>
                ${u?n`<span class="trigger-unit">${u}</span>`:h}
              </div>
            `:h}

      <div class="trigger-limits">
        ${g==="threshold"?n`
          ${e.trigger_above!=null?n`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_above",t)}: ${e.trigger_above} ${u}</span>`:h}
          ${e.trigger_below!=null?n`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_below",t)}: ${e.trigger_below} ${u}</span>`:h}
          ${e.trigger_equals!=null?n`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> = ${e.trigger_equals} ${u}</span>`:h}
          ${e.trigger_not_equals!=null?n`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ≠ ${e.trigger_not_equals} ${u}</span>`:h}
          ${e.trigger_for_minutes?n`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${s("for_minutes",t)}: ${e.trigger_for_minutes}</span>`:h}
        `:h}
        ${g==="state_change"?n`
          ${e.trigger_target_changes!=null?n`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("target_changes",t)}: ${e.trigger_target_changes}</span>`:h}
        `:h}
        ${g==="runtime"?n`
          ${e.trigger_runtime_hours!=null?n`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("runtime_hours",t)}: ${e.trigger_runtime_hours}h</span>`:h}
        `:h}
        ${g==="due_date"?n`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("days_before",t)}: ${e.trigger_days_before??0}</span>
        `:h}
        ${g==="compound"?n`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("compound_logic",t)}: ${e.compound_logic||e.operator||"AND"}</span>
          ${(e.conditions||[]).map((y,$)=>n`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${$+1}. ${s(y.type==="due_date"?"trigger_type_due_date":y.type||"unknown",t)}: ${Gt(y).map((k,T)=>n`${T>0?", ":""}<span class="entity-link" @click=${j=>et(j,k)}>${k}</span>`)}</span>
          `)}
        `:h}
      </div>

      ${a&&a.length>1?n`
        <div class="trigger-entity-list">
          ${a.map(y=>n`
            <span class="trigger-entity-id">${y.friendly_name} (<span class="entity-link" @click=${$=>et($,y.entity_id)}>${y.entity_id}</span>)</span>
          `)}
        </div>
      `:h}

      ${Ga(l,u,d)}
    </div>
  `}function Wa(l,d,e){let t=l.trigger_config,i=l.trigger_current_value;if(!t||i==null)return null;switch(t.type||"threshold"){case"counter":{let a=t.trigger_target_value;if(a==null||a<=0)return null;if(!t.trigger_delta_mode)return{progress:Math.max(0,i),target:a,unit:d,meter:null};let r=ea(l,ta(l,e));return{progress:Math.max(0,i-(r?.value??i)),target:a,unit:d,meter:i}}case"state_change":{let a=t.trigger_target_changes;return a==null||a<=0?null:{progress:Math.max(0,i),target:a,unit:"",meter:null}}case"runtime":{let a=t.trigger_runtime_hours;return a==null||a<=0?null:{progress:Math.max(0,i),target:a,unit:"h",meter:null}}}return null}function ea(l,d){if(l.trigger_baseline_value!=null)return{value:l.trigger_baseline_value,ts:Bt(l)};if(!d.length)return null;let e=Bt(l);if(e==null)return{value:d[0].val,ts:null};let t=d[0],i=Math.abs(d[0].ts-e);for(let a of d){let r=Math.abs(a.ts-e);r<i&&(t=a,i=r)}return{value:t.val,ts:e}}function Bt(l){let d=[...l.history].filter(e=>e.type==="completed"||e.type==="reset").sort((e,t)=>ve(t.timestamp)-ve(e.timestamp))[0];return d?ve(d.timestamp):null}function Ka(l,d){let e=Math.min(999,Math.round(l.progress/l.target*100)),t=e>=100?"over":e>=75?"near":"ok";return n`
    <div class="counter-progress">
      <div class="counter-progress-nums">
        <span class="counter-progress-main">${he(l.progress,"",d)}<span class="counter-progress-target"> / ${he(l.target,l.unit,d)}</span></span>
        <span class="counter-progress-pct ${t}">${e} %</span>
      </div>
      <div class="counter-progress-bar" role="progressbar" aria-valuenow=${e} aria-valuemin="0" aria-valuemax="100">
        <div class="counter-progress-fill ${t}" style="width:${Math.min(100,e)}%"></div>
      </div>
      <div class="counter-progress-caption">
        ${s("chart_since_service",d)}${l.meter!=null?n` · ${s("current",d)}: ${he(l.meter,l.unit,d)}`:h}
      </div>
    </div>
  `}function ta(l,d){let e=l.trigger_config;if(!e)return[];let t=e.type||"threshold",i=_e(e)||"",a=t==="runtime"?[]:d.detailStatsData.get(i)||[],r=d.isCounterEntity(e),o=[];if(a.length>=2)for(let u of a){let p={ts:u.ts,val:u.val};!r&&u.min!=null&&u.max!=null&&(p.min=u.min,p.max=u.max),o.push(p)}else for(let u of l.history)u.trigger_value!=null&&o.push({ts:ve(u.timestamp),val:u.trigger_value});let c=!!i&&!!d.historyFallbackIds?.has(i)&&a.length>=2;return l.trigger_current_value!=null&&!c&&o.push({ts:Date.now(),val:l.trigger_current_value}),o.sort((u,p)=>u.ts-p.ts),o}function Ga(l,d,e){let t=l.trigger_config;if(!t)return h;let i=t.type||"threshold",a=_e(t)||"";if(i==="due_date")return h;let r=ta(l,e),o=null;i==="state_change"&&a&&e.historyFallbackIds?.has(a)&&(o=Ua(r,t,{since:Bt(l),current:l.trigger_current_value??null}),o&&(r=o.points)),i==="runtime"&&t.trigger_runtime_hours&&l.trigger_current_value!=null&&(r=[{ts:Bt(l)??r[0]?.ts??Date.now()-864e5,val:0},{ts:Date.now(),val:Math.max(0,l.trigger_current_value)}]),e.hideOutliers&&(r=Va(r));let c=r.length<2&&!!a&&e.hasStatsService&&!e.detailStatsData.has(a);if(r.length<2&&!c)return h;let u=!!a&&e.detailStatsData.has(a)&&(e.detailStatsData.get(a)?.length??0)<2,p=Date.now()-e.rangeDays*864e5,g=r.filter(C=>C.ts>=p);g.length>=2&&(r=g);let m=null,b="\u25C6",y=!1;if(i==="threshold"&&t.trigger_above==null&&t.trigger_below==null&&(t.trigger_equals!=null||t.trigger_not_equals!=null))m=t.trigger_equals??t.trigger_not_equals??null,b=t.trigger_equals!=null?"=":"\u2260";else if(i==="counter"&&t.trigger_target_value!=null&&r.length){if(t.trigger_delta_mode){let C=ea(l,r);if(C){if(C.ts!=null){let v=r.filter(D=>D.ts>=C.ts);v.length>=2&&(r=v)}r=r.map(v=>({...v,val:Math.max(0,v.val-C.value)}))}}m=t.trigger_target_value,y=!0}else i==="state_change"&&t.trigger_target_changes&&o?.mode!=="alarm"?(m=t.trigger_target_changes,y=!0):i==="runtime"&&t.trigger_runtime_hours&&(m=t.trigger_runtime_hours,y=!0);let $=null,k=l.degradation_rate,T=k!=null&&(t.trigger_below!=null&&t.trigger_above==null&&k>0||t.trigger_above!=null&&t.trigger_below==null&&k<0);if(m==null&&k!=null&&!T&&(l.degradation_trend!=="stable"||l.days_until_threshold!=null)&&l.degradation_trend!=="insufficient_data"&&r.length>=2){let C=r[r.length-1];$=[C,{ts:C.ts+30*864e5,val:C.val+k*30}]}let j=l.history.filter(C=>["completed","skipped","reset"].includes(C.type)).map(C=>({ts:ve(C.timestamp),type:C.type}));return n`
    <maintenance-trigger-chart
      .points=${c?[]:r}
      .events=${j}
      .unit=${d}
      .lang=${e.lang}
      .thresholdAbove=${i==="threshold"?t.trigger_above??null:null}
      .thresholdBelow=${i==="threshold"?t.trigger_below??null:null}
      .targetValue=${m}
      .targetMark=${b}
      .forceZero=${y}
      .projection=${$}
      .rangeDays=${e.rangeDays}
      .hideOutliers=${e.hideOutliers}
      .busy=${c}
      @range-change=${C=>e.setRangeDays(C.detail.days)}
      @outlier-toggle=${C=>e.setHideOutliers(C.detail.hide)}
    ></maintenance-trigger-chart>
    ${c?h:a&&e.historyFallbackIds?.has(a)&&!u?n`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${s(o?.mode==="alarm"?"chart_history_alarm":o?.mode==="count"?"chart_history_count":"chart_history_fallback",e.lang)}
        </div>`:u?n`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${s("chart_no_stats",e.lang)}
        </div>`:h}
  `}var Ya=200,lt=10,Qa=22;function ia(l,d,e,t,i){let a=l.history.filter(c=>c.type==="completed"&&(Ce(c)!=null||c.duration!=null));if(a.length<2)return h;let r=a.some(c=>(Ce(c)??0)!==0),o=a.some(c=>(c.duration??0)>0);return!r&&!o?h:n`
    <div class="cost-duration-card">
      <div class="card-header">
        <h3>${s("cost_duration_chart",d)}</h3>
        <div class="toggle-buttons">
          ${r?n`<button
            class="toggle-btn ${e==="cost"?"active":""}"
            @click=${()=>t("cost")}>
            ${s("cost",d)}
          </button>`:h}
          ${r&&o?n`<button
            class="toggle-btn ${e==="both"?"active":""}"
            @click=${()=>t("both")}>
            ${s("both",d)}
          </button>`:h}
          ${o?n`<button
            class="toggle-btn ${e==="duration"?"active":""}"
            @click=${()=>t("duration")}>
            ${s("duration",d)}
          </button>`:h}
        </div>
      </div>
      ${Xa(l,d,e,i)}
    </div>
  `}function Xa(l,d,e,t){let i=l.history.filter(M=>M.type==="completed"&&(Ce(M)!=null||M.duration!=null)).map(M=>({ts:ve(M.timestamp),cost:Ce(M)??0,duration:M.duration??0})).sort((M,te)=>M.ts-te.ts);if(i.length<2)return h;let a=i.some(M=>M.cost!==0),r=i.some(M=>M.cost<0),o=i.some(M=>M.duration>0);if(!a&&!o)return h;let c=e!=="duration"&&a,u=e!=="cost"&&o,p=c||!u&&a,g=u||!c&&o,m=640,b=Ya,y=p?44:12,$=g?44:12,k=m-y-$,T=b-Qa,j=T-lt,C=i[0].ts,v=i[i.length-1].ts,D=(v-C||864e5)*.05,re=C-D,pe=v+D,O=cs(C,v),z=M=>y+(M-re)/(pe-re)*k,B=Math.min(0,...i.map(M=>M.cost)),P=Math.max(0,...i.map(M=>M.cost)),W=st(B,P>B?P:B+1,3),K=st(0,Math.max(...i.map(M=>M.duration))||1,3),Q=W.niceMax-W.niceMin||1,E=M=>lt+(1-(M-W.niceMin)/Q)*j,G=M=>lt+(1-M/(K.niceMax||1))*j,ne=i.length>1?Math.min(...i.slice(1).map((M,te)=>z(M.ts)-z(i[te].ts))):k,ze=Math.max(6,Math.min(22,ne*.55)),ae=St(C,v,Math.max(2,Math.min(4,i.length)));return n`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${m} ${b}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_history",d)}">
        ${p?W.ticks.map(M=>{let te=E(M);return te<lt-1||te>T+1?h:Y`
            <line x1="${y}" y1="${R(te)}" x2="${m-$}" y2="${R(te)}" stroke="var(--divider-color)" stroke-width="1" opacity="0.55" />
            <text x="${y-6}" y="${R(te+3.5)}" text-anchor="end" fill="var(--primary-color)" font-size="10.5">${Me(M,d)}${t}</text>`}):h}
        ${g?K.ticks.map(M=>{let te=G(M);return te<lt-1||te>T+1?h:Y`<text x="${m-$+6}" y="${R(te+3.5)}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="10.5">${Me(M,d)}m</text>`}):h}

        ${p&&W.niceMin<0?Y`
          <line class="cost-zero" x1="${y}" y1="${R(E(0))}" x2="${m-$}" y2="${R(E(0))}" stroke="var(--secondary-text-color)" stroke-width="1" opacity="0.7" />
        `:h}
        ${p?i.filter(M=>M.cost!==0).map(M=>{let te=E(Math.max(M.cost,0)),Qe=M.cost<0;return Y`
          <rect class="${Qe?"credit-bar":"cost-bar"}" x="${R(z(M.ts)-ze/2)}" y="${R(te)}" width="${R(ze)}" height="${R(E(Math.min(M.cost,0))-te)}"
            fill="${Qe?"var(--success-color, #4caf50)":"var(--primary-color)"}" opacity="0.6" rx="2">
            <title>${Tt(M.ts,d,!0)}: ${Qe?`${s("cost_kind_credit",d)} `:""}${V(Math.abs(M.cost),t,d)}${M.duration?` \xB7 ${M.duration}m`:""}</title>
          </rect>`}):h}
        ${g?Y`
          <polyline points="${i.map(M=>`${R(z(M.ts))},${R(G(M.duration))}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${i.map(M=>Y`
            <circle cx="${R(z(M.ts))}" cy="${R(G(M.duration))}" r="3.5" fill="var(--accent-color, #ff9800)">
              <title>${Tt(M.ts,d,!0)}: ${M.duration}m${M.cost?` \xB7 ${V(M.cost,t,d)}`:""}</title>
            </circle>
          `)}
        `:h}

        <line x1="${y}" y1="${T}" x2="${m-$}" y2="${T}" stroke="var(--divider-color)" stroke-width="1" />
        ${ae.map((M,te)=>{let Qe=te===0?"start":te===ae.length-1?"end":"middle";return Y`<text x="${R(z(M))}" y="${b-6}" text-anchor="${Qe}" fill="var(--secondary-text-color)" font-size="10">${Tt(M,d,O)}</text>`})}
      </svg>
    </div>
    <div class="chart-legend">
      ${p?n`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${s("cost",d)}</span>`:h}
      ${p&&r?n`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50);opacity:0.6"></span>${s("cost_kind_credit",d)}</span>`:h}
      ${g?n`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${s("duration",d)}</span>`:h}
    </div>
  `}function _i(l,d,e){if(!l.responsible_user_id)return h;let t=e?.(l.responsible_user_id)??null;if(t)return n`<span class="user-badge">${Qi(t)}${t.name}</span>`;let i=d(l.responsible_user_id);return i?n`
    <span class="user-badge">
      <ha-icon icon="mdi:account"></ha-icon>
      ${i}
    </span>
  `:h}function Ja(l,d){let e=d.lang,t=d.isOperator;return n`
    <div class="task-header">
      <div class="task-header-title">
        <span class="task-name-breadcrumb" @click=${()=>d.showTaskView()}>${l.name}${Ke(l.next_event_titles)}${Ge(l.trigger_detail)}</span>
        ${qe(d.taskRef??null,s("ref_number",e))}
        <span class="breadcrumb-separator">·</span>
        <span class="object-name-breadcrumb" @click=${()=>d.showObject()}>${d.objectName}</span>
        ${Ot(l,e,"chip")}
        ${l.paused&&l.paused_until?n`<span class="postponed-badge paused-until" title="${s("task_paused",e)}">
          <ha-icon icon="mdi:pause-circle-outline"></ha-icon>${s("paused_until_label",e)} ${q(l.paused_until,e)}
        </span>`:h}
        ${l.due_override?n`<span class="postponed-badge" title="${s("postponed_to",e)}">
          <ha-icon icon="mdi:calendar-arrow-right"></ha-icon>${q(l.due_override,e)}
        </span>`:h}
        ${_i(l,d.getUserName,d.getPerson)}
        ${l.notify_enabled===!1?n`<span class="nfc-badge muted-badge" title="${s("no_notifications",e)}"><ha-icon icon="mdi:bell-off-outline"></ha-icon></span>`:h}
        ${cr(l,d,e)}
        ${l.complete_when?.entity_id?n`<span class="nfc-badge complete-when-badge" title="${s("complete_when_badge",e).replace("{entity}",String(d.hass?.states?.[l.complete_when.entity_id]?.attributes?.friendly_name??l.complete_when.entity_id)).replace("{state}",l.complete_when.to_state)}"><ha-icon icon="mdi:check-circle-outline"></ha-icon></span>`:h}
        ${l.nfc_tag_id?n`<span class="nfc-badge" title="${s("nfc_tag_id",e)}: ${l.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>`:t?h:n`<span class="nfc-badge unlinked" title="${s("nfc_link_hint",e)}"
              @click=${()=>d.openEdit(l)}>
              <ha-icon icon="mdi:nfc-variant"></ha-icon>
            </span>`}
      </div>
      <div class="task-header-actions">
        <ha-button appearance="accent" variant="success" @click=${()=>d.openComplete(l)}>${s("complete",e)}</ha-button>
        ${l.allow_skip!==!1?n`<ha-button appearance="outlined" variant="warning" .disabled=${d.actionLoading} @click=${()=>d.promptSkip()}>${s("skip",e)}</ha-button>`:h}
        <div class="more-menu-wrapper">
          <ha-icon-button .disabled=${d.actionLoading} .label=${s("more_actions",e)} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${()=>d.toggleMoreMenu()}></ha-icon-button>
          ${d.moreMenuOpen?n`
            <div class="popup-menu" role="menu" @keydown=${He} @click=${i=>i.stopPropagation()}>
              ${t?h:n`
                <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.openEdit(l)}}>${s("edit",e)}</div>
              `}
              <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.openQr(l.name)}}>${s("qr_code",e)}</div>
              <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.printWorksheet()}}>${s("worksheet",e)}</div>
              ${d.features.adaptive&&l.adaptive_config?.enabled?n`
                <!-- The recommendation card carries Re-analyze too, but only
                     once a differing suggestion exists — the analysis it is
                     meant to trigger was unreachable before (audit 2026-09-28). -->
                <div role="menuitem" tabindex="0" class="popup-menu-item reanalyze" @click=${()=>{d.closeMoreMenu(),d.reanalyze()}}>${s("reanalyze",e)}</div>
              `:h}
              ${t?h:n`
                <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>d.duplicateTask()}>${s("duplicate",e)}</div>
                <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>d.moveTask()}>${s("move_task",e)}</div>
              `}
              <!-- Reset / Postpone / Snooze are household actions (read tier,
                   helpers/permissions HOUSEHOLD_ACTIONS): offered to everyone,
                   like Complete / Skip and the Lovelace quick-actions Reset. -->
              <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.promptReset()}}>${s("reset",e)}</div>
              <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.promptPostpone()}}>${s("postpone",e)}…</div>
              <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.snoozeTask()}}>${s("snooze",e)}</div>
              ${t?h:n`
                ${l.archived?h:n`<div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.togglePause(!!l.paused)}}>${l.paused?s("resume_task",e):`${s("pause_task",e)}\u2026`}</div>`}
                <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.toggleArchive(!!l.archived)}}>${l.archived?s("unarchive",e):s("archive",e)}</div>
                <div class="popup-menu-divider"></div>
                <div role="menuitem" tabindex="0" class="popup-menu-item danger" @click=${()=>{d.closeMoreMenu(),d.deleteTask()}}>${s("delete",e)}</div>
              `}
            </div>
          `:h}
        </div>
      </div>
    </div>
  `}function Za(l){let d=l.lang;return n`
    <div class="tab-bar">
      <div class="tab ${l.activeTab==="overview"?"active":""}" @click=${()=>l.setActiveTab("overview")}>
        ${s("overview",d)}
      </div>
      <div class="tab ${l.activeTab==="history"?"active":""}" @click=${()=>l.setActiveTab("history")}>
        ${s("history",d)}
      </div>
    </div>
  `}function sa(l,d,e,t){let i=t.collapsedSections.has(l);return n`
    <div class="collapsible ${i?"collapsed":""}">
      <button class="collapsible-head" @click=${()=>t.toggleSection(l)}
        aria-expanded=${i?"false":"true"}>
        <ha-icon icon="${i?"mdi:chevron-right":"mdi:chevron-down"}"></ha-icon>
        <span>${s(d,t.lang)}</span>
      </button>
      ${i?h:n`<div class="collapsible-body">${e}</div>`}
    </div>
  `}function er(l,d){if(!Li(l))return h;let e=d.lang,t=l.phase_sequence,i=Hi(l.phase_cursor,t.length),a=new Map;for(let r=l.history.length-1;r>=0;r--){let o=l.history[r];o.phase_id&&o.type==="completed"&&!a.has(o.phase_id)&&a.set(o.phase_id,o.timestamp)}return n`
    <div class="phases-card">
      <div class="phases-card-header">
        <ha-icon icon="mdi:rotate-right"></ha-icon>
        <span>${s("phase_sequence_label",e)}</span>
      </div>
      <div class="phases-strip">
        ${t.map((r,o)=>{let c=l.phases?.[r]?.name||r,u=a.get(r);return n`
            <div class="phase-step ${o===i?"current":""}"
              title=${o===i?s("phase_current",e):s("phase_set",e)}
              @click=${()=>{o!==i&&d.setPhaseCursor(o)}}>
              <span class="phase-step-name">${o+1}. ${c}</span>
              ${u?n`<span class="phase-step-last">${q(u,e)}</span>`:h}
            </div>
          `})}
      </div>
    </div>
  `}function tr(l,d){if(!d.features.checklists)return h;let e=vt(l)?.checklist??(l.checklist||[]);if(e.length===0)return h;let t=d.lang,i=l.checklist_progress||{},a=e.filter(r=>i[r]).length;return n`
    <div class="checklist-preview-card">
      <div class="checklist-preview-header">
        <ha-icon icon="mdi:format-list-checks"></ha-icon>
        <span>${s("checklist",t)} (${a}/${e.length})</span>
      </div>
      <ol class="checklist-preview-list">
        ${e.map(r=>n`
          <li class=${i[r]?"checked":""}>
            <label>
              <input
                type="checkbox"
                .checked=${!!i[r]}
                @change=${o=>d.setChecklistItem(r,o.target.checked)}
              />
              <span>${r}</span>
            </label>
          </li>
        `)}
      </ol>
    </div>
  `}function ir(l,d){let e=ce(l.documentation_url)?l.documentation_url:null,t=ce(d.objectDocUrl)?d.objectDocUrl:null,i=t?null:(d.objectManualDocs||[])[0];if(!l.notes&&!e&&!t&&!i)return h;let a=d.lang;return n`
    <div class="task-meta-card">
      ${l.notes?n`
        <div class="task-meta-row">
          <ha-icon icon="mdi:note-text-outline"></ha-icon>
          <span class="task-meta-notes">${ft(l.notes)}</span>
        </div>
      `:h}
      ${e?n`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:open-in-new"></ha-icon>
          <a href="${e}" target="_blank" rel="noopener noreferrer">${s("documentation_label",a)}</a>
        </div>
      `:h}
      ${t?n`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="${t}" target="_blank" rel="noopener noreferrer">${s("documentation_url_label",a)} (${d.objectName})</a>
        </div>
      `:i?n`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="#" title=${i.title}
            @click=${r=>{r.preventDefault(),d.openManualDoc(i)}}
            >${s("documentation_url_label",a)} (${d.objectName})</a>
        </div>
      `:h}
    </div>
  `}function sr(l,d){let e=d.lang,t=l.average_cost!==void 0?l.average_cost:l.times_performed>0?l.total_cost/l.times_performed:null,i=l.trigger_config,a=l.next_due==null&&i?.type==="due_date"&&l.trigger_current_value!=null,r=a?new Date(Date.now()+l.trigger_current_value*864e5).toISOString():l.next_due,o=a?ot(l.trigger_current_value):l.days_until_due,c=a?i?.trigger_days_before??0:l.warning_days,u=o!=null?o<0?"overdue":o<=c?"warning":"":"";return n`
    <div class="kpi-bar">
      <div class="kpi-card">
        <div class="kpi-label">${s("next_due",e)}</div>
        <div class="kpi-value">${r?q(r,e):"\u2014"}</div>
        ${a?n`<div class="kpi-subtext">${s("kpi_reported_by_sensor",e)}</div>`:d.features.schedule_time&&l.schedule_time?n`<div class="kpi-subtext">${s("at_time",e)} ${l.schedule_time}</div>`:h}
      </div>
      <div class="kpi-card ${u}">
        <div class="kpi-label">${s("days_until_due",e)}</div>
        <div class="kpi-value-large">${o??"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("interval",e)}</div>
        <div class="kpi-value">${Le(l,e)}</div>
        ${d.features.adaptive&&l.suggested_interval&&l.suggested_interval!==l.interval_days?n`
          <div class="kpi-subtext">${s("recommended",e)}: ${l.suggested_interval}${l.interval_analysis?.confidence_interval_low!=null?` (${l.interval_analysis.confidence_interval_low}\u2013${l.interval_analysis.confidence_interval_high})`:""}</div>
        `:h}
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("warning",e)}</div>
        <div class="kpi-value">${l.warning_days} ${s("days",e)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("last_performed",e)}</div>
        <div class="kpi-value">${l.last_performed?q(l.last_performed,e):"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("avg_cost",e)}</div>
        <div class="kpi-value">${t!=null?V(t,d.currencySymbol,e):"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("avg_duration",e)}</div>
        <div class="kpi-value">${l.average_duration?Ze(Math.round(l.average_duration),e):"\u2014"}</div>
      </div>
    </div>
  `}function ar(l,d){let e=d.lang;if(!d.features.adaptive||!l.suggested_interval||l.suggested_interval===l.interval_days)return h;if(d.suggestionDismissed)return h;let t=l.suggested_interval;return n`
    <div class="recommendation-card">
      <h4>${s("suggested_interval",e)}</h4>
      ${Ss(l.interval_days,t,l.interval_confidence||"medium",e)}
      <div class="recommendation-actions">
        ${d.isOperator?h:n`<ha-button appearance="filled" class="apply-suggestion"
              @click=${()=>d.applySuggestion(t)}>
              ${s("apply_suggestion",e)}
            </ha-button>`}
        <ha-button appearance="plain"
          @click=${()=>d.reanalyze()}>
          ${s("reanalyze",e)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${()=>d.dismissSuggestion()}>
          ${s("dismiss_suggestion",e)}
        </ha-button>
      </div>
    </div>
  `}function rr(l,d){let e=d.lang,t=vs(l.history).slice(0,3);return t.length===0?h:n`
    <div class="recent-activities">
      <h3>${s("recent_activities",e)}</h3>
      ${t.map(i=>ks(i,d.history,{compact:!0,showEdit:!1}))}
      <div class="activity-show-all">
        <ha-button appearance="plain" @click=${()=>d.setActiveTab("history")}>${s("show_all",e)} →</ha-button>
      </div>
    </div>
  `}function nr(l,d){let e=d.lang,t=d.features.adaptive&&l.suggested_interval&&l.suggested_interval!==l.interval_days,i=d.features.seasonal&&l.seasonal_factor&&l.seasonal_factor!==1,a=t||i,r=d.features.adaptive&&l.interval_analysis?.weibull_beta!=null&&l.interval_analysis?.weibull_eta!=null,o=d.features.seasonal&&(l.seasonal_factors?.length===12||l.interval_analysis?.seasonal_factors?.length===12);return n`
    <div class="tab-content overview-tab">
      ${l.battery_fleet_task?n`<maintenance-battery-fleet-section .hass=${d.hass}></maintenance-battery-fleet-section>`:h}
      ${sr(l,d)}
      ${ir(l,d)}
      ${l.battery_fleet_task?h:n`
            ${Qs(l,d.lang)}
            ${Zs(l,d.sparkline)}
            ${Ts(l,e,d.features)}
          `}
      <div class="two-column-layout ${a?"":"single-column"}">
        ${a?n`
          <div class="left-column">
            ${ar(l,d)}
            ${Es(l,e,d.features)}
          </div>
        `:h}
        <div class="right-column">
          ${ia(l,e,d.costDurationToggle,c=>d.setCostDurationToggle(c),d.currencySymbol)}
        </div>
      </div>
      ${r?sa("weibull","weibull_reliability_curve",js(l,e),d):h}
      ${o?sa("seasonal","seasonal_chart_title",n`
            ${Os(l,e)}
            <div class="seasonal-actions">
              <ha-button appearance="plain" @click=${()=>d.openSeasonalOverrides(l)}>
                ${s("edit_seasonal_overrides",e)}
              </ha-button>
            </div>
          `,d):h}
      ${er(l,d)}
      ${tr(l,d)}
      ${rr(l,d)}
    </div>
  `}function or(l,d){return n`
    <div class="tab-content history-tab">
      <div class="history-add-past">
        <ha-button appearance="plain" class="history-add-past-btn" @click=${()=>d.openComplete(l)}>
          <ha-icon icon="mdi:calendar-plus"></ha-icon>
          ${s("history_add_past",d.lang)}
        </ha-button>
      </div>
      ${ys(l,d.history)}
      ${xs(l,d.history)}
    </div>
  `}function lr(l,d){switch(d.activeTab){case"overview":return nr(l,d);case"history":return or(l,d);default:return h}}function cr(l,d,e){let t=l.mirror_todo_entities??[],i=t.length?t:l.mirror_todo_use_default===!1?[]:d.mirrorTodoDefault??[];if(!i.length)return h;let a=i.map(o=>String(d.hass?.states?.[o]?.attributes?.friendly_name??o)).join(", "),r=t.length?`${s("task_mirror_todo",e)}: ${a}`:s("task_mirror_todo_default",e).replace("{lists}",a);return n`<span class="nfc-badge mirror-badge ${t.length?"":"inherited"}" title=${r}><ha-icon icon="mdi:clipboard-list-outline"></ha-icon></span>`}function aa(l,d){return n`
    <div class="detail-section">
      ${Ja(l,d)}
      ${Za(d)}
      ${lr(l,d)}
      <maintenance-task-documents
        .hass=${d.hass}
        .entryId=${d.entryId}
        .taskId=${d.taskId}
        .canWrite=${!d.isOperator}
      ></maintenance-task-documents>
    </div>
  `}var ct=class extends L{createRenderRoot(){return this}render(){return!this.task||!this.ctx?h:n`${aa(this.task,this.ctx)}`}};_([S({attribute:!1})],ct.prototype,"task",2),_([S({attribute:!1})],ct.prototype,"ctx",2);customElements.get("maintenance-task-detail-view")||customElements.define("maintenance-task-detail-view",ct);function ra(l){if(l.total<=0)return{start:0,end:0,padTop:0,padBottom:0};let d=l.overscan??12,e=Math.max(1,l.step??6),t=Math.max(1,l.rowHeight),i=Math.floor((l.scrollTop-l.listTop)/t),a=Math.ceil(l.viewportHeight/t)+1,r=Math.max(0,i-d);r=Math.floor(r/e)*e;let o=Math.min(l.total,Math.max(i,0)+a+d);return o=Math.min(l.total,Math.ceil(o/e)*e),r>=o&&(r=Math.min(r,Math.max(0,l.total-1)),o=Math.min(l.total,r+Math.max(a,1))),{start:r,end:o,padTop:r*t,padBottom:(l.total-o)*t}}var Nt={mode:"top",marginTop:0,lastScrollTop:0};function na(l,d){return l==="top"?8:d.viewH-d.paneH-8}function oa(l){let d=l.scrollTop+8-l.layoutTop,e=Math.max(0,l.listH-l.paneH);return{mode:"top",marginTop:d>e?Math.max(0,d):0,lastScrollTop:l.scrollTop}}function la(l,d){let e=d.scrollTop,t=d.scrollTop>l.lastScrollTop?"down":d.scrollTop<l.lastScrollTop?"up":"none",i=Math.max(0,d.listH-d.paneH),a=d.paneH+16<=d.viewH||d.listH<=d.paneH,{mode:r,marginTop:o}=l;if(a&&(r="top"),r==="top"&&o>0&&t==="up")o=Math.max(0,Math.min(o,d.scrollTop+8-d.layoutTop)),o<=i&&(o=0);else if(!a&&t==="down"&&r==="top"){let c=d.renderedTop-d.layoutTop;c<=i&&(r="bottom",o=Math.max(0,c))}else!a&&t==="up"&&r==="bottom"&&(o=Math.min(Math.max(0,d.renderedTop-d.layoutTop),i),d.scrollTop+8<=d.layoutTop+o&&(r="top",o=0));return{mode:r,marginTop:o,lastScrollTop:e}}function ca(l,d,e){let t=Math.min(100,Math.max(0,l/d*100)),i=e??80;return{pct:t,level:t>=100?"danger":t>=i?"warning":"ok"}}var qt=2,ur=250,Be={objects:6,tasks:10,parts:6,documents:8,history:6},gr="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z",mi=["due_date","object","type","task_name","area","assigned_user","group"],da=["none","area","group","user","object"],pa=wi,ha=["children","tasks","documents","parts","history"],w=class extends L{constructor(){super(...arguments);this.narrow=!1;this.tight=!1;this.split=!1;this._tightObserver=null;this.panel={};this.embedded=!1;this.presets={};this._presetsApplied=!1;this._mountPath=null;this._objects=[];this._stats=null;this._view="overview";this._allParts=null;this._selectedEntryId=null;this._selectedTaskId=null;this._selectedAreaId=null;this._filterStatus="";this._filterUser=null;this._filterLabel=null;this._filterPlace="";this._filterPriority="";this._savedViews=[];this._activeViewId="";this._unsub=null;this._chartRangeDays=(()=>{try{let e=parseInt(X(A.chartRange)||"",10);return[7,30,90,365].includes(e)?e:30}catch{return 30}})();this._hideOutliers=(()=>{try{return X(A.chartHideOutliers)==="1"}catch{return!1}})();this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1};this._adminPanelUserIds=[];this._operatorWriteEnabled=!1;this._defaultWarningDays=7;this._mirrorTodoDefault=[];this._rowActionStyle="buttons_compact";this._refsInLists=!1;this._partsCostMode="purchase";this._rowActionNotice=!1;this._actionLoading=!1;this._moreMenuOpen=!1;this._objMenuOpen=!1;this._subObjMenu=null;this._toastMessage="";this._toastKind="error";this._toastUndo=null;this._toastActionLabel="";this._filtersOpen=!1;this._newMenuOpen=!1;this._gsSetupsCount=0;this._gsAdoptCount=0;this._gsLoaded=!1;this._resetOffersLoaded=!1;this._resetOffersCount=0;this._batteryFleetSetupAvailable=!1;this._staleBundle=!1;this._restartPendingVersion=null;this._staleChecked=!1;this._onReconnect=()=>this._checkServerVersion();this._toastTimer=null;this._dismissedSuggestions=new Set;this._overviewTab=(()=>{try{let e=X(A.overviewTab);return e==="today"||e==="calendar"?e:"dashboard"}catch{return"dashboard"}})();this._activeTab="overview";this._costDurationToggle="both";this._historySearch="";this._sortMode="due_date";this._objectSortMode="alphabetical";this._groupByMode="none";this._objectViewMode="cards";this._objectsTableColumns=Pi;this._showArchived=!1;this._bulkMode=!1;this._bulkSelected=new Set;this._objBulkMode=!1;this._objBulkSelected=new Set;this._bulkMenuOpen=!1;this._virtStart=0;this._virtEnd=0;this._virtRowHeight=53;this._virtMeasure=!0;this._virtTotalRows=0;this._virtScrollAttached=!1;this._virtRaf=0;this._stickyState=Nt;this._stickySelectPending=!1;this._stickyRaf=0;this._stickyAttached=!1;this._stickyObserver=null;this._collapsedGroups=new Set;this._collapsedSections=(()=>{try{return new Set(JSON.parse(X(A.collapsedSections)||"[]"))}catch{return new Set}})();this._objectSectionsCollapsed=(()=>{try{let e=JSON.parse(X(A.objectSections)||"[]");return new Set((Array.isArray(e)?e:[]).filter(t=>ha.includes(t)))}catch{return new Set}})();this._objectSectionOverride=null;this._objTreeOpen=(()=>{try{let e=JSON.parse(X(A.objectTreeOpen)||"[]");return new Set((Array.isArray(e)?e:[]).filter(t=>typeof t=="string"))}catch{return new Set}})();this._paletteOpen=!1;this._paletteQuery="";this._paletteActive=0;this._searchRemote=null;this._searchTimer=null;this._searchSeq=0;this._templateGalleryOpen=!1;this._templates=[];this._homeProfile=null;this._templateCategories={};this._templateBusy=!1;this._templateParentId=null;this._statsService=null;this._userService=null;this._dataLoaded=!1;this._lastConnection=null;this._popstateHandler=e=>this._onPopState(e);this._locationChangedHandler=()=>this._onLocationChanged();this._lazyUi=null;this._onStickyScroll=()=>{this._stickyRaf||(this._stickyRaf=requestAnimationFrame(()=>{this._stickyRaf=0,this._updateStickyPane()}))};this._onVirtualScroll=()=>{this._virtMeasure=!0,!this._virtRaf&&(this._virtRaf=requestAnimationFrame(()=>{this._virtRaf=0,this._updateVirtualWindow()}))};this._deepLinkHandled=!1;this._deepLinkInPlace=!1;this._initialLoadDone=!1;this._detailStatsSeq=new Map;this._subGen=0;this._kpiRefreshInFlight=!1;this._kpiRefreshPending=!1;this._areaUi=null;this._paletteKeydown=e=>{if(e.key==="/"&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!this._paletteOpen){let i=e.composedPath()[0];if(i instanceof HTMLElement&&(i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.tagName==="SELECT"||i.isContentEditable))return;e.preventDefault(),this._openPalette();return}if(!this._paletteOpen)return;let t=this._paletteResults;if(e.key==="Escape")e.preventDefault(),this._closePalette();else if(e.key==="ArrowDown")e.preventDefault(),this._paletteActive=Math.min(this._paletteActive+1,t.length-1);else if(e.key==="ArrowUp")e.preventDefault(),this._paletteActive=Math.max(this._paletteActive-1,0);else if(e.key==="Enter"){e.preventDefault();let i=t[this._paletteActive];i&&this._selectPaletteResult(i)}};this._onObjectReplaced=async e=>{this._showToast([s("object_replaced",this._lang),this._deviceSwapText(e.detail.device_swap)].filter(Boolean).join(" \xB7 "),"info");try{await this._loadData()}catch{}e.detail.entry_id&&this._showObject(e.detail.entry_id)};this._onObjectSaved=async e=>{let t=this._deviceSwapText(e.detail?.device_swap);t&&this._showToast(t,"info"),await this._onDialogEvent()};this._checklistPending=new Map;this._checklistChain=Promise.resolve();this._onDialogEvent=async()=>{try{await this._loadData()}catch{}};this._onTaskCompleted=async e=>{await this._onDialogEvent();let t=e.detail;t?.undo&&this._offerUndo(t.entryId,t.taskId,s("task_completed_named",this._lang).replace("{task}",t.taskName))};this._onCalendarOpenTask=e=>{let t=e.detail;t?.entry_id&&t.task_id&&(e.preventDefault(),e.stopPropagation(),this._showTask(t.entry_id,t.task_id))};this._onCalendarLlCustom=e=>{let t=e.detail;t?.type==="maintenance-supporter:open-task"&&t.entry_id&&t.task_id&&(e.stopPropagation(),this._showTask(t.entry_id,t.task_id))};this._popupClosers=new Map;this._fullHistory=null;this._onHistoryEntrySaved=async()=>{await this._loadData()}}get _currencySymbol(){return ut(this._budget)}get _lang(){return N(this.hass)}get _isOperator(){return!Ve(this.hass?.user,{operatorWriteEnabled:this._operatorWriteEnabled,operatorIds:this._adminPanelUserIds})}_ensureLazyUi(){return this._lazyUi||(this._lazyUi=Promise.all([import("/maintenance_supporter_panelfiles/panel-chunks/object-dialog-TGS336DZ.js"),import("/maintenance_supporter_panelfiles/panel-chunks/task-dialog-P4XMDKM3.js"),import("/maintenance_supporter_panelfiles/panel-chunks/complete-dialog-HSUYKDZG.js"),import("/maintenance_supporter_panelfiles/panel-chunks/qr-dialog-DF4RTB7S.js"),import("/maintenance_supporter_panelfiles/panel-chunks/adopt-problem-sensors-dialog-MCOAELPK.js"),import("/maintenance_supporter_panelfiles/panel-chunks/suggested-setups-dialog-D3AYEQS2.js"),import("/maintenance_supporter_panelfiles/panel-chunks/settings-view-YWPMNEWR.js"),import("/maintenance_supporter_panelfiles/panel-chunks/bulk-edit-dialog-57CRABVU.js")]).then(()=>this.updateComplete)),this._lazyUi}async _ui(e){return await this._ensureLazyUi(),this.shadowRoot?.querySelector(e)??null}connectedCallback(){super.connectedCallback(),this._mountPath=window.location.pathname;let e=window.requestIdleCallback,t=()=>this._ensureLazyUi();e?e(t,{timeout:3e3}):window.setTimeout(t,1500),window.addEventListener("popstate",this._popstateHandler),window.addEventListener("location-changed",this._locationChangedHandler),window.addEventListener("keydown",this._paletteKeydown),typeof ResizeObserver<"u"&&(this._tightObserver=new ResizeObserver(i=>{let a=i[0]?.contentRect.width??0;a>0&&(this.tight=a<1e3),a>0&&(this.split=a>=1500)}),this._tightObserver.observe(this)),window.addEventListener("resize",this._onVirtualScroll,{passive:!0});try{let i=X(A.taskSort);i&&mi.includes(i)&&(this._sortMode=i);let a=X(A.objectSort);a&&["alphabetical","due_soonest","task_count"].includes(a)&&(this._objectSortMode=a);let r=X(A.groupBy);r&&da.includes(r)&&(this._groupByMode=r);let o=X(A.objectView);(o==="cards"||o==="table")&&(this._objectViewMode=o)}catch{}if(this._objects.length===0){let i=Ds();i&&(this._objects=i.objects,i.stats&&(this._stats=i.stats))}}disconnectedCallback(){super.disconnectedCallback(),this._subGen++,window.removeEventListener("popstate",this._popstateHandler),window.removeEventListener("location-changed",this._locationChangedHandler),window.removeEventListener("keydown",this._paletteKeydown);for(let e of[...this._popupClosers.keys()])this._dropPopupCloser(e);this._tightObserver?.disconnect(),this._tightObserver=null,window.removeEventListener("resize",this._onVirtualScroll),this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onVirtualScroll),this._virtScrollAttached=!1,this._virtRaf&&cancelAnimationFrame(this._virtRaf),this._detachStickyPane(),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._initialLoadDone=!1,this._watchConnection(null),this._deepLinkHandled=!1,this._searchTimer&&(clearTimeout(this._searchTimer),this._searchTimer=null),this._toastTimer&&(clearTimeout(this._toastTimer),this._toastTimer=null),this._toastMessage="",this._toastUndo=null,this._toastActionLabel="",this._statsService?.clearCache(),this._statsService=null}willUpdate(e){super.willUpdate(e),e.has("_groupByMode")&&this._collapsedGroups.size>0&&(this._collapsedGroups=new Set)}updated(e){if(super.updated(e),Fe(this,e),e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._watchConnection(this.hass.connection),history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},""),this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._watchConnection(this.hass.connection),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new Dt(this.hass),this._fetchMiniStatsForOverview()),this._userService?this._userService.updateHass(this.hass):(this._userService=new Xi(this.hass),this._userService.getUsers().then(()=>this.requestUpdate()))}let t=this.shadowRoot?.querySelector(".content");t&&!this._virtScrollAttached&&(t.addEventListener("scroll",this._onVirtualScroll,{passive:!0}),this._virtScrollAttached=!0),this._updateVirtualWindow(),this._syncStickyPane(t)}_syncStickyPane(e){let t=this.shadowRoot?.querySelector(".split-pane");if(!t||!e){this._stickyAttached&&this._detachStickyPane();return}this._stickyAttached||(e.addEventListener("scroll",this._onStickyScroll,{passive:!0}),window.addEventListener("resize",this._onStickyScroll),typeof ResizeObserver<"u"&&(this._stickyObserver=new ResizeObserver(this._onStickyScroll)),this._stickyAttached=!0),this._stickyObserver?.observe(t),this._updateStickyPane()}_detachStickyPane(){this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onStickyScroll),window.removeEventListener("resize",this._onStickyScroll),this._stickyObserver?.disconnect(),this._stickyObserver=null,this._stickyRaf&&cancelAnimationFrame(this._stickyRaf),this._stickyRaf=0,this._stickyAttached=!1,this._stickyState=Nt,this._stickySelectPending=!1}_updateStickyPane(){let e=this.shadowRoot,t=e?.querySelector(".content"),i=e?.querySelector(".split-pane"),a=e?.querySelector(".split-layout"),r=e?.querySelector(".split-list");if(!t||!i||!a||!r)return;let o=t.getBoundingClientRect().top-t.scrollTop,c={scrollTop:t.scrollTop,viewH:t.clientHeight,paneH:i.offsetHeight,listH:r.offsetHeight,layoutTop:a.getBoundingClientRect().top-o,renderedTop:i.getBoundingClientRect().top-o};this._stickySelectPending&&c.scrollTop===this._stickyState.lastScrollTop?this._stickyState=oa(c):(this._stickySelectPending=!1,this._stickyState=la(this._stickyState,c));let u=this._stickyState;i.style.top=`${na(u.mode,c)}px`,i.style.marginTop=u.marginTop>0?`${u.marginTop}px`:""}_resetStickyPane(){let e=this.shadowRoot?.querySelector(".content");this._stickyState={...Nt,lastScrollTop:e?.scrollTop??0},this._stickySelectPending=!0}_updateVirtualWindow(){let e=this.shadowRoot?.querySelector(".content"),t=this.shadowRoot?.querySelector(".task-table.virtual");if(!e||!t)return;if(this._virtMeasure){let r=[...t.querySelectorAll(".task-row:not(.virt-sizer)")],o=r.length?r.reduce((c,u)=>c+u.offsetHeight,0)/r.length:0;o>20&&(Math.abs(o-this._virtRowHeight)>=2&&(this._virtRowHeight=Math.round(o)),this._virtMeasure=!1)}let i=t.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop,a=ra({scrollTop:e.scrollTop,viewportHeight:e.clientHeight,listTop:i,rowHeight:this._virtRowHeight,total:this._virtTotalRows});(a.start!==this._virtStart||a.end!==this._virtEnd)&&(this._virtStart=a.start,this._virtEnd=a.end)}_watchConnection(e){this._lastConnection?.removeEventListener?.("ready",this._onReconnect),this._lastConnection=e,e?.addEventListener?.("ready",this._onReconnect)}_checkServerVersion(){this.hass.connection.sendMessagePromise({type:"maintenance_supporter/version"}).then(e=>{this._restartPendingVersion=vi(e),this._staleBundle=!this._restartPendingVersion&&fi(e?.version)}).catch(()=>{})}async _loadData(){let[e,t,i,a,r,o]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"}).catch(()=>null)]);if(o&&(this._savedViews=o.views||[]),e&&(this._objects=at(e.objects),si(this._objects,t??this._stats??null),this._maybeLoadGettingStarted()),this._detailOpen()&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/status"}).then(c=>{this._batteryFleetSetupAvailable=!!c.available&&!c.configured}).catch(()=>{this._batteryFleetSetupAvailable=!1}),this._staleChecked||(this._staleChecked=!0,this._checkServerVersion()),t&&(this._stats=t),i&&(this._budget=i,Xe(this._budget)),a&&(this._groups=a.groups||{}),r){let c=ns(r);this._features=c.features,this._adminPanelUserIds=[...c.access.operatorIds],this._operatorWriteEnabled=c.access.operatorWriteEnabled,this._defaultWarningDays=c.defaultWarningDays,this._mirrorTodoDefault=c.mirrorTodoDefault,this._rowActionStyle=c.rowActionStyle,this._rowActionNotice=c.rowActionNoticePending,this._refsInLists=c.refsInLists,this._objectsTableColumns=Ii(c.objectsTableColumns),this._partsCostMode=c.partsCostMode}this._fetchMiniStatsForOverview(),this._initialLoadDone=!0,this._handleDeepLink()}_onLocationChanged(){if(!this._initialLoadDone||!window.location.search||this.embedded&&this._mountPath!==null&&window.location.pathname!==this._mountPath)return;if(!this.embedded){let t=`/${typeof this.panel?.url_path=="string"?this.panel.url_path:"maintenance-supporter"}`,i=window.location.pathname;if(i!==t&&!i.startsWith(`${t}/`))return}this._deepLinkHandled=!1,this._deepLinkInPlace=!0;try{this._handleDeepLink()}finally{this._deepLinkInPlace=!1}history.state?.msp_view||history.replaceState({msp_view:this._view,msp_entry:this._selectedEntryId,msp_task:this._selectedTaskId,msp_area:this._selectedAreaId},"")}_handleDeepLink(){if(this._deepLinkHandled)return;let e=new URLSearchParams(window.location.search),t=e.get("ms_action"),i=()=>{let T=window.location.pathname+window.location.hash;history.replaceState(history.state,"",T)};if(t==="add_object"){this._deepLinkHandled=!0,i(),this._ui("maintenance-object-dialog").then(T=>T?.openCreate());return}if(t==="open_vacation"||t==="open_budget"||t==="open_groups"||t==="open_settings"){if(this._deepLinkHandled=!0,i(),!this.hass?.user?.is_admin)return;this._overviewTab="settings",this._ensureLazyUi().then(()=>requestAnimationFrame(()=>{let T=this.shadowRoot?.querySelector("maintenance-settings-view"),j=t.replace("open_","");T?.scrollToSection?.(j)}));return}if(this.embedded&&!this._presetsApplied){this._presetsApplied=!0;let T=this.presets?.tab??"",j=(this.presets?.view??"").trim();if(!e.has("tab")&&ii.includes(T)&&(T!=="settings"||this.hass?.user?.is_admin)&&(this._overviewTab=T),!e.has("view")&&j){let C=j.toLowerCase(),v=this._savedViews.find(D=>D.id===j)??this._savedViews.find(D=>D.name.trim().toLowerCase()===C);v&&(this._overviewTab="dashboard",this._applyView(v.id))}}let a=e.get("tab"),r=e.get("view"),o=e.get("sort"),c=e.get("status");if(a!==null||r!==null||o!==null||c!==null){if(i(),this._view!=="overview"&&(this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()),ii.includes(a??"")&&(a!=="settings"||this.hass?.user?.is_admin)&&this._setOverviewTab(a),r!==null){let T=r.trim().toLowerCase(),j=this._savedViews.find(C=>C.id===r)??this._savedViews.find(C=>C.name.trim().toLowerCase()===T);j&&(this._overviewTab!=="dashboard"&&this._setOverviewTab("dashboard"),this._applyView(j.id))}mi.includes(o??"")&&(this._sortMode=o,this._activeViewId="",U(A.taskSort,this._sortMode)),pa.includes(c??"")&&(this._overviewTab!=="dashboard"&&this._setOverviewTab("dashboard"),this._filterByStatus(c))}let u=e.get("area");if(u&&!e.get("entry_id")){this._deepLinkHandled=!0,i(),this._objects.some(T=>Yi(T.object)===u)?this._showArea(u):this._showAllAreas();return}let p=e.get("entry_id");if(!p)return;this._deepLinkHandled=!0;let g=e.get("task_id"),m=e.get("action"),b=e.get("section"),y=ha.includes(b??"")?b:null,$=window.location.pathname+window.location.hash;history.replaceState(history.state,"",$);let k=this._getObject(p);if(!k){this._showOverview();return}if(g){let T=k.tasks.find(j=>j.id===g);if(!T){this._showObject(p,y);return}this._showTask(p,g),m==="complete"?requestAnimationFrame(()=>{this._openCompleteDialog(p,g,T.name,this._features.checklists?T.checklist:void 0,this._features.adaptive&&!!T.adaptive_config?.enabled,{viaTagScan:!0})}):m==="skip"?requestAnimationFrame(()=>{T.allow_skip!==!1&&this._promptSkipTask(p,g)}):m==="quick_complete"&&requestAnimationFrame(()=>{this._handleQuickComplete(p,g,T)})}else this._showObject(p,y)}async _fetchDetailStats(e,t){if(!this._statsService)return;let i=(this._detailStatsSeq.get(e)??0)+1;this._detailStatsSeq.set(e,i);let a=await this._statsService.getDetailStats(e,t,this._chartRangeDays);if(this._detailStatsSeq.get(e)!==i)return;let r=new Map(this._detailStatsData);r.set(e,a),this._detailStatsData=r}_setChartRange(e){if(e===this._chartRangeDays)return;this._chartRangeDays=e;try{U(A.chartRange,String(e))}catch{}let t=this._selectedEntryId&&this._selectedTaskId?this._getTask(this._selectedEntryId,this._selectedTaskId):null,i=_e(t?.trigger_config);if(i){let a=new Map(this._detailStatsData);a.delete(i),this._detailStatsData=a,this._fetchDetailStats(i,$e(t.trigger_config))}}_setHideOutliers(e){if(e!==this._hideOutliers){this._hideOutliers=e;try{U(A.chartHideOutliers,e?"1":"0")}catch{}}}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let e=[];for(let i of this._objects)for(let a of i.tasks){let r=a.battery_fleet_task?void 0:_e(a.trigger_config);r&&e.push({entityId:r,isCounter:$e(a.trigger_config)})}if(e.length===0)return;let t=await this._statsService.getBatchMiniStats(e);this._miniStatsData=new Map([...this._miniStatsData,...t])}async _subscribe(){let e=++this._subGen;try{let t=await this.hass.connection.subscribeMessage(i=>{let a=i,r=Ms(this._objects,a);r!==null&&(this._objects=r,i.objects&&si(r,this._stats??null),this._refreshKpis(),this._detailOpen()&&(a.objects||(a.delta||[]).some(o=>o.entry_id===this._selectedEntryId))&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId))},{type:"maintenance_supporter/subscribe",deltas:!0,compact:!0});if(!this.isConnected||e!==this._subGen){t();return}this._unsub=t}catch{}}async _refreshKpis(){if(this._kpiRefreshInFlight){this._kpiRefreshPending=!0;return}this._kpiRefreshInFlight=!0;try{do{this._kpiRefreshPending=!1;let[e,t]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null)]);if(!this.isConnected)return;e&&(this._stats=e),t&&(this._budget=t,Xe(this._budget))}while(this._kpiRefreshPending)}finally{this._kpiRefreshInFlight=!1}}get _taskRows(){return this._rowsFiltered(!0)}_rowsFiltered(e){let t=[];for(let m of this._objects)for(let b of m.tasks){if(!this._showArchived&&b.archived||e&&this._filterStatus&&b.status!==this._filterStatus)continue;if(this._filterUser){let $=this._filterUser==="current_user"?this._userService?.getCurrentUserId():this._filterUser;if(!nt(b,$))continue}if(this._filterLabel&&!(b.labels||[]).includes(this._filterLabel)||this._filterPlace&&(m.object.place||"home")!==this._filterPlace||this._filterPriority&&(b.priority||"normal")!==this._filterPriority)continue;let y=[];for(let $ of Object.values(this._groups))$.task_refs?.some(k=>k.entry_id===m.entry_id&&k.task_id===b.id)&&y.push($.name);t.push({entry_id:m.entry_id,task_id:b.id,object_name:m.object.name,allow_skip:b.allow_skip!==!1,notify_enabled:b.notify_enabled!==!1,task_name:b.name,type:b.type,schedule_type:b.schedule_type,status:b.status,days_until_due:b.days_until_due??null,next_due:b.next_due??null,last_performed:b.last_performed??null,next_event_titles:b.next_event_titles??[],trigger_active:b.trigger_active,trigger_detail:b.trigger_detail??null,trigger_current_value:b.trigger_current_value??null,trigger_current_delta:b.trigger_current_delta??null,trigger_config:b.trigger_config??null,trigger_entity_info:b.trigger_entity_info??null,battery_fleet_task:b.battery_fleet_task===!0,times_performed:b.times_performed,total_cost:b.total_cost,interval_days:b.interval_days??null,interval_unit:b.interval_unit??null,interval_anchor:b.interval_anchor??null,is_done:b.is_done??!1,archived:b.archived??!1,history:b.history||[],enabled:b.enabled,nfc_tag_id:b.nfc_tag_id??null,priority:b.priority??"normal",labels:b.labels??[],area_id:m.object.area_id??null,responsible_user_id:b.responsible_user_id??null,assignee_pool:b.assignee_pool??null,group_names:y})}let i=(m,b)=>Pe(m.status)-Pe(b.status),a=(m,b)=>(m.days_until_due??99999)-(b.days_until_due??99999),r=(m,b)=>i(m,b)||a(m,b),o=m=>m.area_id&&this.hass?.areas?.[m.area_id]?.name||"",c=m=>rt(m).map(b=>this._userService?.getUserName(b)||"").filter(Boolean),u=m=>c(m).sort((b,y)=>b.localeCompare(y)).join(", "),p=m=>m.group_names[0]||"",g={due_date:r,object:(m,b)=>m.object_name.localeCompare(b.object_name)||r(m,b),type:(m,b)=>m.type.localeCompare(b.type)||r(m,b),task_name:(m,b)=>m.task_name.localeCompare(b.task_name),area:(m,b)=>{let y=o(m),$=o(b);return!y&&$?1:y&&!$?-1:y.localeCompare($)||r(m,b)},assigned_user:(m,b)=>{let y=u(m),$=u(b);return!y&&$?1:y&&!$?-1:y.localeCompare($)||r(m,b)},group:(m,b)=>{let y=p(m),$=p(b);return!y&&$?1:y&&!$?-1:y.localeCompare($)||r(m,b)}};return t.sort(g[this._sortMode]),t}_getObject(e){return this._objects.find(t=>t.entry_id===e)}_getTask(e,t){return this._getObject(e)?.tasks.find(a=>a.id===t)}_listRef(e,t){if(!this._refsInLists)return h;let i=this._getObject(e);return qe(Ee(i?.object,i?.tasks.find(a=>a.id===t)))}_objRef(e){return this._refsInLists?qe(Se(e)):h}_pushPanelState(e,t,i,a){let r={msp_view:e,msp_entry:t||null,msp_task:i||null,msp_area:a||null};this._deepLinkInPlace?history.replaceState(r,""):history.pushState(r,"")}_onPopState(e){let t=e.state;if(t?.msp_view&&(this._view=t.msp_view,this._selectedEntryId=t.msp_entry||null,this._selectedTaskId=t.msp_task||null,this._selectedAreaId=t.msp_area||null,this._moreMenuOpen=!1,this._objectSectionOverride=null,t.msp_view==="all_parts"&&this._loadAllParts(),t.msp_view==="task"&&t.msp_entry&&t.msp_task)){this._historyFilter=null,this._fetchFullHistory(t.msp_entry,t.msp_task);let i=this._getTask(t.msp_entry,t.msp_task),a=_e(i?.trigger_config);i&&a&&this._fetchDetailStats(a,$e(i.trigger_config))}}_showOverview(){this._pushPanelState("overview"),this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()}_showAllObjects(){this._pushPanelState("all_objects"),this._view="all_objects",this._objBulkMode=!1,this._objBulkSelected=new Set,this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_showAllParts(){this._pushPanelState("all_parts"),this._view="all_parts",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop(),this._loadAllParts()}async _loadAllParts(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});this._allParts=e.parts||[]}catch{this._allParts=[]}}_showAllAreas(){this._pushPanelState("all_areas"),this._view="all_areas",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_showArea(e){this._pushPanelState("area",null,null,e),this._view="area",this._selectedAreaId=e,this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_ensureAreaUi(){this._areaUi??=Promise.all([import("/maintenance_supporter_panelfiles/panel-chunks/areas-view-ZY27PF5G.js"),import("/maintenance_supporter_panelfiles/panel-chunks/area-view-7HDDMXCC.js")]).catch(()=>{this._areaUi=null})}_filterByStatus(e){this._filterStatus=e,this._activeViewId="",this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard"),this._scrollContentToTop()}get _allLabels(){let e=new Set;for(let t of this._objects)for(let i of t.tasks)for(let a of i.labels||[])e.add(a);return[...e].sort((t,i)=>t.localeCompare(i))}get _allPlaces(){let e=new Map;for(let t of this._objects){let i=t.object;i.place&&!e.has(i.place)&&e.set(i.place,i.place_name||i.place)}return[...e].map(([t,i])=>({id:t,name:i})).sort((t,i)=>t.name.localeCompare(i.name))}get _currentFilters(){return{status:this._filterStatus,user_id:this._filterUser,label:this._filterLabel,priority:this._filterPriority,place:this._filterPlace,archived:this._showArchived,sort_mode:this._sortMode,group_by:this._groupByMode}}_applyView(e){if(this._activeViewId=e,!e)return;let t=this._savedViews.find(a=>a.id===e);if(!t)return;let i=t.filters;this._filterStatus=i.status||"",this._filterUser=i.user_id||null,this._filterLabel=i.label||null,this._filterPriority=i.priority||"",this._filterPlace=i.place||"",this._showArchived=!!i.archived,mi.includes(i.sort_mode)&&(this._sortMode=i.sort_mode),da.includes(i.group_by)&&(this._groupByMode=i.group_by);try{U(A.taskSort,this._sortMode),U(A.groupBy,this._groupByMode)}catch{}this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard")}_openSavedViewsDialog(){this.shadowRoot.querySelector("maintenance-saved-views-dialog")?.open(this._currentFilters,this._savedViews)}_onSavedViewsChanged(e){this._savedViews=e.detail.views||[],this._activeViewId&&!this._savedViews.some(t=>t.id===this._activeViewId)&&(this._activeViewId="")}_scrollContentToTop(){requestAnimationFrame(()=>{let e=this.shadowRoot?.querySelector(".content");e&&e.scrollTo({top:0,behavior:"smooth"})})}_renderLineageLink(e,t){let i=e?this._objects.find(a=>a.entry_id===e):void 0;return i?n`<p class="meta">${t}:
      <a href="#" class="object-lineage-link" @click=${a=>{a.preventDefault(),this._showObject(i.entry_id)}}
        >${i.object.name}</a></p>`:h}_addSubObject(e){this._ui("maintenance-object-dialog").then(t=>t?.openCreate(e))}_moveHereChoices(e){let t=this._objects,i=new Set(Et(t,e).map(a=>a.entry_id));return t.filter(a=>a.entry_id!==e&&!i.has(a.entry_id)&&a.object.parent_entry_id!==e&&!a.object.archived&&!a.object.battery_fleet).map(a=>({value:a.entry_id,label:[...Et(t,a.entry_id),a].map(r=>r.object.name).join(" \u203A ")})).sort((a,r)=>a.label.localeCompare(r.label))}async _moveObjectHere(e){let t=this._moveHereChoices(e);if(!t.length)return;let i=this._lang,a=this._objects.find(c=>c.entry_id===e)?.object.name??"",o=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:s("sub_object_move_here",i),message:s("sub_object_move_message",i).replace("{name}",a),confirmText:s("sub_object_move_confirm",i),inputLabel:s("object",i),inputValue:t[0].value,options:t});!o?.confirmed||!o.value||await this._runAction({type:"maintenance_supporter/object/update",entry_id:o.value,parent_entry_id:e},{successToast:s("sub_object_moved",i).replace("{name}",a)})}_toggleSubObjMenu(e){this._subObjMenu&&this._subObjMenu!==e&&(this._subObjMenu=null),this._togglePopup("sub-object",()=>this._subObjMenu!==null,t=>{this._subObjMenu=t?e:null})}_closeSubObjMenu(){this._subObjMenu=null}_renderSubObjMenu(e,t){return n`
      <div class="popup-menu sub-object-menu ${this._subObjMenu==="head"?"sub-object-menu-head":""}" role="menu"
        @keydown=${He} @click=${i=>i.stopPropagation()}>
        <div role="menuitem" tabindex="0" class="popup-menu-item sub-object-new" @click=${()=>{this._closeSubObjMenu(),this._addSubObject(e)}}>
          <ha-icon icon="mdi:package-variant-closed-plus"></ha-icon> ${s("new_object",t).replace(/^\+\s*/,"")}
        </div>
        <div role="menuitem" tabindex="0" class="popup-menu-item sub-object-template" @click=${()=>{this._closeSubObjMenu(),this._openTemplateGallery(e)}}>
          <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon> ${s("templates_from",t)}
        </div>
        ${this._moveHereChoices(e).length?n`
          <div role="menuitem" tabindex="0" class="popup-menu-item sub-object-move" @click=${()=>{this._closeSubObjMenu(),this._moveObjectHere(e)}}>
            <ha-icon icon="mdi:folder-move-outline"></ha-icon> ${s("sub_object_move_here",t)}
          </div>`:h}
      </div>
    `}_showObject(e,t=null){this._pushPanelState("object",e),this._view="object",this._selectedEntryId=e,this._selectedTaskId=null,this._objectSectionOverride=t,t?this._scrollToObjectSection(t):this._scrollContentToTop()}_scrollToObjectSection(e){this.updateComplete.then(()=>requestAnimationFrame(()=>{let t=this.shadowRoot?.querySelector(`.obj-section[data-section="${e}"]`);t?t.scrollIntoView({block:"start",behavior:"smooth"}):this._scrollContentToTop()}))}_toggleObjectSection(e){let t=new Set(this._objectSectionsCollapsed);this._objectSectionOverride===e||!t.has(e)?t.add(e):t.delete(e),this._objectSectionOverride===e&&(this._objectSectionOverride=null),this._objectSectionsCollapsed=t,U(A.objectSections,JSON.stringify([...t]))}_splitActive(){return this.split&&!this.narrow&&!this.tight&&this._view==="overview"&&this._overviewTab==="dashboard"&&!this._bulkMode}_detailOpen(){return(this._view==="task"||this._splitActive())&&!!this._selectedEntryId&&!!this._selectedTaskId}_showFullTaskPage(e,t){this._view!=="task"&&(this._pushPanelState("task",e,t),this._view="task",this._selectedEntryId=e,this._selectedTaskId=t,this._scrollContentToTop())}_showTask(e,t){if(this._splitActive()){this._selectedEntryId=e,this._selectedTaskId=t,this._activeTab="overview",this._historyFilter=null,this._historySearch="",this._resetStickyPane(),this._fetchFullHistory(e,t);let r=this._getTask(e,t),o=_e(r?.trigger_config);r&&o&&this._fetchDetailStats(o,$e(r.trigger_config));return}this._pushPanelState("task",e,t),this._view="task",this._selectedEntryId=e,this._selectedTaskId=t,this._activeTab="overview",this._historyFilter=null,this._historySearch="",this._scrollContentToTop(),this._fetchFullHistory(e,t);let i=this._getTask(e,t),a=_e(i?.trigger_config);i&&a&&this._fetchDetailStats(a,$e(i.trigger_config))}_showToast(e,t="error"){this._toastTimer&&clearTimeout(this._toastTimer),this._toastKind=t,this._toastUndo=null,this._toastActionLabel="",this._toastMessage=e,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastTimer=null},4e3)}_showActionToast(e,t,i){this._showUndoToast(e,i),this._toastActionLabel=t}_showUndoToast(e,t){this._toastTimer&&clearTimeout(this._toastTimer),this._toastKind="info",this._toastActionLabel="",this._toastMessage=e,this._toastUndo=t,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastUndo=null,this._toastTimer=null},7e3)}_runToastUndo(){let e=this._toastUndo;this._toastTimer&&clearTimeout(this._toastTimer),this._toastMessage="",this._toastUndo=null,this._toastTimer=null,e?.()}_openPalette(){this._paletteQuery="",this._paletteActive=0,this._paletteOpen=!0,this._searchRemote=null,this.updateComplete.then(()=>{this.shadowRoot?.querySelector(".palette-input")?.focus()})}_closePalette(){this._paletteOpen=!1,this._paletteQuery="",this._searchRemote=null,this._searchTimer&&(clearTimeout(this._searchTimer),this._searchTimer=null)}_onPaletteInput(e){this._paletteQuery=e,this._paletteActive=0,this._searchTimer&&clearTimeout(this._searchTimer);let t=e.trim();if(t.length<qt){this._searchRemote=null;return}this._searchTimer=setTimeout(()=>{this._searchTimer=null;let i=++this._searchSeq;this.hass.connection.sendMessagePromise({type:"maintenance_supporter/search",query:t,limit:Be.documents}).then(a=>{i!==this._searchSeq||!this._paletteOpen||(this._searchRemote={query:t,documents:a.documents||[],history:a.history||[]})}).catch(()=>{i!==this._searchSeq||!this._paletteOpen||(this._searchRemote={query:t,documents:[],history:[]})})},ur)}get _paletteResults(){let e=this._lang,t=this._paletteQuery.trim();if(t.length<qt&&!pt(t))return[];let i=dt(t);if(!i.length)return[];let a=[],r=[],o=[],c=pt(t);if(c){for(let m of this._objects){let b=m.object;if(b.ref_no!==c.object)continue;let y=Se(b),$=(k,T)=>k?[T,s("archived",e)].filter(Boolean).join(" \xB7 "):T;c.task==null&&a.push({kind:"object",entryId:m.entry_id,label:b.name||"",sub:$(b.archived,s("object",e)),score:1e3,icon:"mdi:package-variant-closed",ref:y});for(let k of m.tasks)c.task!=null&&k.ref_no!==c.task||r.push({kind:"task",entryId:m.entry_id,taskId:k.id,label:k.name||"",sub:$(k.archived||b.archived,b.name||""),score:c.task==null?900:1e3,icon:"mdi:clipboard-check-outline",ref:Ee(b,k)})}if(a.length||r.length){let m=this._searchRemote&&this._searchRemote.query===t?this._searchRemote:null,b=[...a,...r.slice(0,Be.tasks)];for(let y of m?.history.slice(0,1)??[])b.push({kind:"history",entryId:y.entry_id,taskId:y.task_id,label:y.task_name||"",sub:[y.object_name,y.timestamp?q(y.timestamp,e):""].filter(Boolean).join(" \xB7 "),snippet:y.snippet||"",score:y.score,icon:"mdi:note-text-outline",ref:y.ref??null});return b}}for(let m of this._objects){let b=m.object;if(b.archived)continue;let y=b.name||"",$=Ne(i,[{text:y,weight:3},{text:b.manufacturer,weight:2},{text:b.model,weight:2},{text:b.serial_number,weight:2},{text:b.notes,weight:1}]);if($>0){let k=[b.manufacturer,b.model].filter(Boolean).join(" ");a.push({kind:"object",entryId:m.entry_id,label:y,sub:k||s("object",e),score:$,icon:"mdi:package-variant-closed",ref:Se(b)})}for(let k of m.tasks){if(k.archived)continue;let T=(k.labels||[]).join(" "),j=Ne(i,[{text:k.name,weight:3},{text:y,weight:2},{text:T,weight:2},{text:k.notes,weight:1}]);if(j>0){let C=(k.labels||[]).length?`  #${(k.labels||[]).join(" #")}`:"";r.push({kind:"task",entryId:m.entry_id,taskId:k.id,label:k.name||"",sub:y+C,score:j,icon:"mdi:clipboard-check-outline",ref:Ee(b,k)})}}for(let k of m.parts||[]){let T=Ne(i,[{text:k.name,weight:3},{text:k.mpn,weight:2},{text:k.vendor,weight:1},{text:k.storage_location,weight:1},{text:k.notes,weight:1}]);T>0&&o.push({kind:"part",entryId:m.entry_id,label:k.name||"",sub:[y,k.mpn].filter(Boolean).join(" \xB7 "),score:T,icon:"mdi:cog-outline"})}}let u=(m,b)=>b.score-m.score||m.label.localeCompare(b.label),p=[...a.sort(u).slice(0,Be.objects),...r.sort(u).slice(0,Be.tasks),...o.sort(u).slice(0,Be.parts)],g=this._searchRemote&&this._searchRemote.query===t?this._searchRemote:null;if(g){let m=g.documents.slice(0,Be.documents);for(let b of[...m.filter(y=>y.match!=="content"),...m.filter(y=>y.match==="content")])p.push({kind:b.match==="content"?"content":"document",entryId:b.entry_id,docId:b.id,docKind:b.kind,url:b.url,page:b.page??null,label:le(b),sub:b.object_name||"",snippet:b.snippet||"",score:b.score,icon:b.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"});for(let b of g.history.slice(0,Be.history))p.push({kind:"history",entryId:b.entry_id,taskId:b.task_id,label:b.task_name||"",ref:b.ref??null,sub:[b.object_name,b.timestamp?q(b.timestamp,e):""].filter(Boolean).join(" \xB7 "),snippet:b.snippet||"",score:b.score,icon:b.type==="skipped"?"mdi:skip-next-circle-outline":"mdi:note-text-outline"})}return p}_selectPaletteResult(e){let t=this._paletteQuery.trim();switch(this._closePalette(),e.kind){case"task":e.taskId&&this._showTask(e.entryId,e.taskId);return;case"history":if(!e.taskId)return;this._showTask(e.entryId,e.taskId),this._activeTab="history",this._historySearch=t;return;case"document":case"content":e.docKind==="weblink"?ce(e.url)&&window.open(e.url,"_blank","noopener"):e.docId&&Re(this.hass,e.docId,e.page?`#page=${e.page}`:"").catch(()=>{}),this._showObject(e.entryId,"documents");return;case"part":this._showObject(e.entryId,"parts");return;default:this._showObject(e.entryId)}}_renderPalette(){if(!this._paletteOpen)return h;let e=this._lang,t=this._paletteResults,i=this._paletteQuery.trim(),a={object:s("objects",e),task:s("tasks",e),part:s("search_group_parts",e),document:s("documents",e),content:s("search_group_content",e),history:s("search_group_history",e)},r=i.length>=qt&&(!this._searchRemote||this._searchRemote.query!==i),o=null;return n`
      <div class="palette-backdrop" @click=${()=>this._closePalette()}>
        <div class="palette" role="dialog" aria-label=${s("search_open",e)} @click=${c=>c.stopPropagation()}>
          <input
            class="palette-input"
            type="text"
            placeholder="${s("palette_placeholder",e)}"
            .value=${this._paletteQuery}
            @input=${c=>this._onPaletteInput(c.target.value)}
          />
          <div class="palette-results">
            ${i.length<qt&&!pt(i)?n`<div class="palette-empty">${s("search_empty_hint",e)}</div>`:t.length===0?n`<div class="palette-empty">${r?s("search_searching",e):s("palette_no_results",e)}</div>`:t.map((c,u)=>{let p=c.kind!==o?n`<div class="palette-group">${a[c.kind]}</div>`:h;return o=c.kind,n`
                      ${p}
                      <div class="palette-item ${u===this._paletteActive?"active":""} ${c.snippet?"has-snippet":""}"
                        @mouseenter=${()=>{this._paletteActive=u}}
                        @click=${()=>this._selectPaletteResult(c)}>
                        <ha-icon icon="${c.icon}"></ha-icon>
                        <div class="palette-main">
                          <div class="palette-line">
                            <span class="palette-label">${c.label}</span>
                            ${c.ref?n`<span class="ref-chip">#${c.ref}</span>`:h}
                            ${c.page?n`<span class="palette-page">${s("search_page",e).replace("{page}",String(c.page))}</span>`:h}
                            <span class="palette-sub">${c.sub}</span>
                          </div>
                          ${c.snippet?n`<div class="palette-snippet">${c.snippet}</div>`:h}
                        </div>
                      </div>
                    `})}
            ${t.length>0&&r?n`<div class="palette-group palette-waiting">${s("search_searching",e)}</div>`:h}
          </div>
          <div class="palette-hint">${s("palette_hint",e)}</div>
        </div>
      </div>
    `}_openAdoptProblemSensors(){this._ui("maintenance-adopt-problem-sensors-dialog").then(e=>e?.open())}async _onProblemSensorsAdopted(e){let t=e.detail?.tasks_created??0,i=e.detail?.created??[];await this._loadData();let a=fe("adopt_problem_done","adopt_problem_done_one",t,this._lang,"tasks");i.length>0?this._showActionToast(a,s("adopt_problem_configure",this._lang),()=>{let r=i[0],o=this._objects.find(u=>u.entry_id===r.entry_id),c=o?.tasks.find(u=>u.id===r.task_id);o&&c&&this._ui("maintenance-task-dialog").then(u=>u?.openEdit(r.entry_id,c))}):this._showToast(a,"info")}async _setupBatteryFleet(){let e=await I(this,{type:"maintenance_supporter/battery_fleet/setup",language:N(this.hass)},{reload:async()=>{this._batteryFleetSetupAvailable=!1,await this._loadData()},onError:a=>this._showToast(a)});if(e===void 0)return;let t=this._objects.find(a=>a.entry_id===e?.entry_id),i=t?.tasks.find(a=>a.id===e?.task_id)||t?.tasks[0];t&&i&&this._showTask(t.entry_id,i.id),this._showToast(s("battery_fleet_setup_done",this._lang),"info")}_openSuggestedSetups(){this._ui("maintenance-suggested-setups-dialog").then(e=>e?.open())}_onResetsWired(e){let t=e.detail?.wired??0;this._showToast(fe("reset_offers_done","reset_offers_done_one",t,this._lang,"count"),"info"),this._resetOffersLoaded=!1,this._resetOffersCount=0,this._maybeLoadResetOffers(),this._loadData()}_onSetupsAdopted(e){let t=e.detail?.tasks_created??0;this._showToast(fe("setups_done","setups_done_one",t,this._lang,"tasks"),"info"),this._loadData()}async _openTemplateGallery(e=null){this._templateParentId=e,this._templateGalleryOpen=!0;let t=await I(this,{type:"maintenance_supporter/templates",language:this._lang},{onError:i=>this._showToast(i)});t!==void 0&&(this._templateCategories=t?.categories||{},this._templates=(t?.templates||[]).filter(i=>!i.disabled),this._homeProfile=t?.profile??null)}async _createFromTemplate(e){let t=await I(this,{type:"maintenance_supporter/object/from_template",language:this._lang,template_id:e,...this._templateParentId?{parent_entry_id:this._templateParentId}:{}},{busy:i=>{this._templateBusy=i},reload:async()=>{this._templateGalleryOpen=!1,await this._loadData()},successToast:s("template_created",this._lang),onSuccess:i=>this._showToast(i,"info"),onError:i=>this._showToast(i)});t?.entry_id&&this._showObject(t.entry_id)}_categoryName(e){let t=this._templateCategories[e];return t&&(t[`name_${this._lang}`]||t.name_en)||e}_renderTemplateCard(e,t=!1){let i=this._lang,a=this._homeProfile?.country??null;return n`
      <button class="template-card ${e.dwelling_mismatch?"not-typical":""}" .disabled=${this._templateBusy}
        title=${e.dwelling_mismatch?s("templates_not_typical",i):""}
        @click=${()=>this._createFromTemplate(e.id)}>
        <span class="template-card-name">${e.name}</span>
        <span class="template-card-count">${fe("templates_task_count","templates_task_count_one",e.tasks.length,i)}</span>
        ${t&&e.reasons?.length?n`<span class="template-card-reasons">
              ${e.reasons.map(r=>n`<span class="template-card-reason">${Bi(r,i,a)}</span>`)}
            </span>`:h}
        ${e.set_up?n`<span class="template-card-setup"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${s("templates_set_up",i)}</span>`:h}
      </button>
    `}_renderTemplateGallery(){if(!this._templateGalleryOpen)return h;let e=this._lang,t=new Map;for(let r of this._templates)t.has(r.category)||t.set(r.category,[]),t.get(r.category).push(r);for(let r of t.values())r.sort((o,c)=>+!!o.dwelling_mismatch-+!!c.dwelling_mismatch);let i=this._templates.filter(r=>r.recommended&&!r.set_up),a=this._templateParentId?this._objects.find(r=>r.entry_id===this._templateParentId):void 0;return n`
      <div class="palette-backdrop" @click=${()=>{this._templateGalleryOpen=!1}}>
        <div class="template-gallery" @click=${r=>r.stopPropagation()}>
          <div class="template-gallery-head">
            <span>${s("templates_title",e)}</span>
            <ha-icon-button .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
              @click=${()=>{this._templateGalleryOpen=!1}}></ha-icon-button>
          </div>
          <div class="template-gallery-body">
            ${a?n`
              <div class="template-parent-hint">
                <ha-icon icon="mdi:file-tree-outline"></ha-icon>
                <span>${s("templates_inside",e).replace("{name}",a.object.name)}</span>
              </div>`:h}
            <div class="template-legal">
              <ha-icon icon="mdi:scale-balance"></ha-icon>
              <span>${s("templates_legal_hint",e)}</span>
            </div>
            ${i.length>0?n`
                  <div class="template-cat recommended">
                    <div class="template-cat-head">
                      <ha-icon icon="mdi:home-heart"></ha-icon>
                      ${s("templates_recommended_title",e)}
                    </div>
                    <div class="template-cat-hint">${s("templates_recommended_hint",e)}</div>
                    <div class="template-grid">${i.map(r=>this._renderTemplateCard(r,!0))}</div>
                  </div>`:h}
            ${this._templates.length===0?n`<div class="palette-empty">${s("loading",e)}…</div>`:[...t.entries()].map(([r,o])=>n`
                  <div class="template-cat">
                    <div class="template-cat-head">
                      <ha-icon icon="${this._templateCategories[r]?.icon||"mdi:folder-outline"}"></ha-icon>
                      ${this._categoryName(r)}
                    </div>
                    <div class="template-grid">${o.map(c=>this._renderTemplateCard(c))}</div>
                  </div>
                `)}
          </div>
        </div>
      </div>
    `}_bulkKey(e){return`${e.entry_id}:${e.task_id}`}_toggleBulkMode(){this._bulkMode=!this._bulkMode,this._bulkMenuOpen=!1,this._bulkMode||(this._bulkSelected=new Set)}_toggleBulkRow(e){let t=this._bulkKey(e),i=new Set(this._bulkSelected);i.has(t)?i.delete(t):i.add(t),this._bulkSelected=i}_bulkSelectAll(e){let t=e.map(a=>this._bulkKey(a)),i=t.every(a=>this._bulkSelected.has(a));this._bulkSelected=i?new Set:new Set(t)}async _runBulkItems(e,t,i,a,r){if(e.length===0)return;this._actionLoading=!0;let{done:o,failed:c}=await Ji(this,e,t);this._actionLoading=!1,a(),await this._loadData();let u=Qt(i(o.length),c,this._lang);r&&o.length>0?this._showUndoToast(u,()=>r(o)):this._showToast(u,c.length>0?"error":"info")}_runBulk(e,t,i,a){return this._runBulkItems(e.filter(r=>this._bulkSelected.has(this._bulkKey(r))),t,i,()=>{this._bulkSelected=new Set,this._bulkMode=!1},a)}async _bulkMove(e){let t=this._objects.filter(o=>!o.object.archived_at).sort((o,c)=>(o.object.name||"").localeCompare(c.object.name||""));if(!t.length||this._bulkSelected.size===0)return;let a=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:s("move_task_title",this._lang),message:s("bulk_move_message",this._lang),confirmText:s("move_task_title",this._lang),inputLabel:s("move_task_target",this._lang),inputValue:t[0].entry_id,options:t.map(o=>({value:o.entry_id,label:o.object.name||o.entry_id}))});if(!a?.confirmed||!a.value)return;let r=a.value;await this._runBulk(e.filter(o=>o.entry_id!==r),o=>({type:"maintenance_supporter/task/move",entry_id:o.entry_id,task_id:o.task_id,target_entry_id:r}),o=>s("bulk_moved",this._lang).replace("{n}",String(o)))}_toggleObjBulkMode(){this._objBulkMode=!this._objBulkMode,this._objBulkMode||(this._objBulkSelected=new Set)}_toggleObjBulk(e){let t=new Set(this._objBulkSelected);t.has(e)?t.delete(e):t.add(e),this._objBulkSelected=t}_objBulkSelectAll(e){let t=e.map(a=>a.entry_id),i=t.length>0&&t.every(a=>this._objBulkSelected.has(a));this._objBulkSelected=i?new Set:new Set(t)}_runObjBulk(e,t,i,a={}){return this._runBulkItems([...this._objBulkSelected],r=>({type:e,entry_id:r,...a}),t,()=>{this._objBulkSelected=new Set,this._objBulkMode=!1},i?r=>{i(r)}:void 0)}async _objBulkDelete(){let e=this._objBulkSelected.size;e===0||!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("bulk_delete_objects_confirm",this._lang).replace("{n}",String(e)),confirmText:s("delete",this._lang),danger:!0})||await this._runObjBulk("maintenance_supporter/object/delete",a=>s("bulk_objects_deleted",this._lang).replace("{n}",String(a)))}async _objBulkArea(){let e=[...this._objBulkSelected];if(e.length===0)return;let t=Object.values(this.hass?.areas||{}).sort((o,c)=>o.name.localeCompare(c.name)),a=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:s("area",this._lang),message:s("bulk_n_selected",this._lang).replace("{n}",String(e.length)),confirmText:s("save",this._lang),inputLabel:s("area",this._lang),inputValue:"",options:[{value:"",label:s("no_area",this._lang)},...t.map(o=>({value:o.area_id,label:o.name}))]});if(!a?.confirmed)return;let r=new Map(e.map(o=>[o,this._getObject(o)?.object.area_id??null]));this._runObjBulk("maintenance_supporter/object/update",o=>s("bulk_objects_area",this._lang).replace("{n}",String(o)),async o=>{for(let c of o)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:c,area_id:r.get(c)??null})}catch{}await this._loadData()},{area_id:a.value||null})}_objBulkArchive(){this._runObjBulk("maintenance_supporter/object/archive",e=>s("bulk_objects_archived",this._lang).replace("{n}",String(e)),async e=>{for(let t of e)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/unarchive",entry_id:t,undo:!0})}catch{}await this._loadData()})}_renderObjBulkBar(e,t){let i=this._objBulkSelected.size,a=e.length>0&&e.every(r=>this._objBulkSelected.has(r.entry_id));return n`
      <div class="bulk-bar obj-bulk-bar">
        <label class="bulk-selectall">
          <input type="checkbox" .checked=${a} @change=${()=>this._objBulkSelectAll(e)} />
          ${s("bulk_select_all",t)}
        </label>
        <span class="bulk-count">${s("bulk_n_selected",t).replace("{n}",String(i))}</span>
        <span class="bulk-actions">
          <ha-button appearance="plain" class="obj-bulk-area" .disabled=${i===0||this._actionLoading} @click=${()=>{this._objBulkArea()}}>
            <ha-icon icon="mdi:floor-plan"></ha-icon> ${s("area",t)}…
          </ha-button>
          <ha-button appearance="plain" class="obj-bulk-archive" .disabled=${i===0||this._actionLoading} @click=${()=>this._objBulkArchive()}>
            <ha-icon icon="mdi:archive-outline"></ha-icon> ${s("archive",t)}
          </ha-button>
          <ha-button appearance="filled" variant="danger" class="obj-bulk-delete" .disabled=${i===0||this._actionLoading} @click=${()=>this._objBulkDelete()}>
            <ha-icon icon="mdi:delete-outline"></ha-icon> ${s("delete",t)}
          </ha-button>
        </span>
      </div>
    `}_bulkComplete(e){this._runBulk(e,t=>({type:"maintenance_supporter/task/complete",entry_id:t.entry_id,task_id:t.task_id}),t=>s("bulk_completed",this._lang).replace("{n}",String(t)))}_bulkArchive(e){this._runBulk(e,t=>({type:"maintenance_supporter/task/archive",entry_id:t.entry_id,task_id:t.task_id}),t=>s("bulk_archived",this._lang).replace("{n}",String(t)),async t=>{for(let i of t)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/unarchive",entry_id:i.entry_id,task_id:i.task_id,undo:!0})}catch{}await this._loadData()})}async _bulkEdit(e,t){let i=t.filter(c=>this._bulkSelected.has(this._bulkKey(c)));if(i.length===0)return;let a=await this._ui("maintenance-bulk-edit-dialog"),r=this._userService?await this._userService.getUsers():[],o=await a?.open(e,i,r);o&&await this._sendBulkUpdate(i.map(c=>({entry_id:c.entry_id,task_id:c.task_id})),o)}async _sendBulkUpdate(e,t){let i=await I(this,{type:"maintenance_supporter/tasks/update_many",items:e,...t?{changes:t}:{}},{busy:c=>{this._actionLoading=c},onError:c=>this._showToast(c,"error")});if(!i)return;let a=t===null;a||(this._bulkSelected=new Set,this._bulkMode=!1),await this._loadData();let r=Zi(i.failed,this._lang),o=Qt(s("bulk_updated",this._lang).replace("{n}",String(i.updated.length)),r,this._lang);!a&&i.previous.length>0?this._showUndoToast(o,()=>{this._sendBulkUpdate(i.previous,null)}):this._showToast(o,r.length>0?"error":"info")}async _bulkPause(e){let t=e.filter(r=>this._bulkSelected.has(this._bulkKey(r))&&r.status!=="paused");if(t.length===0)return;let a=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:s("pause_task",this._lang),message:s("pause_task_prompt",this._lang),confirmText:s("pause_task",this._lang),inputLabel:s("pause_until_label",this._lang),inputType:"date"});a?.confirmed&&this._runBulk(t,r=>({type:"maintenance_supporter/task/pause",entry_id:r.entry_id,task_id:r.task_id,...a.value?{until:a.value}:{}}),r=>s("bulk_paused",this._lang).replace("{n}",String(r)),async r=>{for(let o of r)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/resume",entry_id:o.entry_id,task_id:o.task_id,undo:!0})}catch{}await this._loadData()})}_bulkResume(e){this._runBulk(e.filter(t=>t.status==="paused"),t=>({type:"maintenance_supporter/task/resume",entry_id:t.entry_id,task_id:t.task_id}),t=>s("bulk_resumed",this._lang).replace("{n}",String(t)))}async _runAction(e,t){let i=await I(this,e,{busy:a=>{this._actionLoading=a},reload:()=>this._loadData(),successToast:t?.successToast,onSuccess:a=>this._showToast(a,"info"),onError:a=>this._showToast(a)});return i===void 0?null:i??{}}async _deleteObject(e){if(!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("delete_object_confirm",this._lang),confirmText:s("delete",this._lang),danger:!0}))return;await this._runAction({type:"maintenance_supporter/object/delete",entry_id:e})&&this._showOverview()}_printObjectReport(e){let t=this._getObject(e);if(!t)return;let i=this._lang,a={title:s("report_title",i),generated:s("report_generated",i),manufacturer:s("manufacturer",i),model:s("model",i),serial:s("serial_number_label",i),installed:s("installed",i),warranty:s("warranty",i),area:s("area",i),notes:s("report_notes",i),tasksHeading:s("tasks",i),colTask:s("task_name",i),colType:s("report_col_type",i),colStatus:s("report_col_status",i),colSchedule:s("report_col_schedule",i),colLastDone:s("last_performed",i),colNextDue:s("next_due",i),colCost:s("cost",i),colTimes:s("report_times_done",i),totalCost:s("report_total_cost",i),scheduleLabel:o=>Le(o,i),none:"\u2014",statusLabel:o=>s(o,i),typeLabel:o=>s(o,i)},r=As(t.object,t.tasks,a,o=>o?q(o,i):"",o=>V(o,this._currencySymbol,i),new Date().toISOString());tt(r)}async _duplicateObject(e){let t=await this._runAction({type:"maintenance_supporter/object/duplicate",entry_id:e},{successToast:s("object_duplicated",this._lang)});t?.entry_id&&this._showObject(t.entry_id)}async _deleteTask(e,t){if(!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("delete_task_confirm",this._lang),confirmText:s("delete",this._lang),danger:!0}))return;await this._runAction({type:"maintenance_supporter/task/delete",entry_id:e,task_id:t})&&this._showObject(e)}async _duplicateTask(e,t){this._moreMenuOpen=!1;let i=await this._runAction({type:"maintenance_supporter/task/duplicate",entry_id:e,task_id:t},{successToast:s("task_duplicated",this._lang)});i?.task_id&&this._showTask(e,i.task_id)}async _moveTask(e,t){this._moreMenuOpen=!1;let i=this._objects.filter(c=>c.entry_id!==e&&!c.object.archived_at).sort((c,u)=>(c.object.name||"").localeCompare(u.object.name||""));if(!i.length)return;let r=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:s("move_task_title",this._lang),message:s("move_task_message",this._lang),confirmText:s("move_task_title",this._lang),inputLabel:s("move_task_target",this._lang),inputValue:i[0].entry_id,options:i.map(c=>({value:c.entry_id,label:c.object.name||c.entry_id}))});if(!r?.confirmed||!r.value)return;let o=await this._runAction({type:"maintenance_supporter/task/move",entry_id:e,task_id:t,target_entry_id:r.value},{successToast:s("task_moved",this._lang)});o?.entry_id&&o.task_id&&this._showTask(o.entry_id,o.task_id)}async _toggleArchiveTask(e,t,i,a=!1){await this._runAction({type:i?"maintenance_supporter/task/unarchive":"maintenance_supporter/task/archive",entry_id:e,task_id:t,...a?{undo:!0}:{}})&&!i&&this._showUndoToast(s("task_archived",this._lang),()=>this._toggleArchiveTask(e,t,!0,!0))}async _togglePauseTask(e,t,i,a=!1){if(!i){let o=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:s("pause_task",this._lang),message:s("pause_task_prompt",this._lang),confirmText:s("pause_task",this._lang),inputLabel:s("pause_until_label",this._lang),inputType:"date"});if(!o?.confirmed)return;let c={type:"maintenance_supporter/task/pause",entry_id:e,task_id:t};o.value&&(c.until=o.value),await this._runAction(c)&&this._showUndoToast(s("task_paused",this._lang),()=>this._togglePauseTask(e,t,!0,!0));return}await this._runAction({type:"maintenance_supporter/task/resume",entry_id:e,task_id:t,...a?{undo:!0}:{}},{successToast:s("task_resumed",this._lang)})}async _toggleArchiveObject(e,t,i=!1){await this._runAction({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:e,...i?{undo:!0}:{}})&&!t&&this._showUndoToast(s("object_archived",this._lang),()=>this._toggleArchiveObject(e,!0,!0))}async _togglePauseObject(e,t,i=!1){if(!t){let r=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:s("pause_object",this._lang),message:s("pause_until_prompt",this._lang),confirmText:s("pause_object",this._lang),inputLabel:s("pause_until_label",this._lang),inputType:"date"});if(!r?.confirmed)return;let o={type:"maintenance_supporter/object/pause",entry_id:e};r.value&&(o.until=r.value),await this._runAction(o)&&this._showUndoToast(s("object_paused",this._lang),()=>this._togglePauseObject(e,!0,!0));return}await this._runAction({type:"maintenance_supporter/object/resume",entry_id:e,...i?{undo:!0}:{}},{successToast:s("object_resumed",this._lang)})}_replaceObject(e,t){this._ui("maintenance-object-dialog").then(i=>i?.openReplace(e,t))}_deviceSwapText(e){if(!e||!e.moved&&!e.unmatched.length)return"";let t=[];return e.moved&&t.push(fe("device_swap_moved","device_swap_moved_one",e.moved,this._lang,"count")),e.unmatched.length&&t.push(fe("device_swap_unmatched","device_swap_unmatched_one",e.unmatched.length,this._lang,"count")),t.join(" ")}async _skipTask(e,t,i){let a={type:"maintenance_supporter/task/skip",entry_id:e,task_id:t};i&&(a.reason=i),await this._runAction(a)}async _resetTask(e,t,i){let a={type:"maintenance_supporter/task/reset",entry_id:e,task_id:t};i&&(a.date=i),await this._runAction(a)}async _applySuggestion(e,t,i){await this._runAction({type:"maintenance_supporter/task/apply_suggestion",entry_id:e,task_id:t,interval:i})}_openSeasonalOverrides(e){let t=this.shadowRoot.querySelector("maintenance-seasonal-overrides-dialog");if(!t||!this._selectedEntryId)return;let i=e.adaptive_config?.seasonal_overrides;t.open(this._selectedEntryId,e.id,i)}async _reanalyzeInterval(e,t){let i=await this._runAction({type:"maintenance_supporter/task/analyze_interval",entry_id:e,task_id:t});i&&(i.recommended_interval?this._showToast(`${s("reanalyze_result",this._lang)}: ${i.recommended_interval} ${s("days",this._lang)} (${s(`confidence_${i.confidence}`,this._lang)}, ${i.data_points} ${s("data_points",this._lang)})`,"info"):this._showToast(s("reanalyze_insufficient_data",this._lang),"info"))}async _promptSkipTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("skip",this._lang),message:s("skip_reason_prompt",this._lang),confirmText:s("skip",this._lang),inputLabel:s("reason_optional",this._lang),inputType:"text"});a.confirmed&&this._skipTask(e,t,a.value||void 0)}async _promptResetTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("reset",this._lang),message:s("reset_date_prompt",this._lang),confirmText:s("reset",this._lang),inputLabel:s("reset_date_optional",this._lang),inputType:"date"});a.confirmed&&this._resetTask(e,t,a.value||void 0)}async _postponeTask(e,t,i){await this._runAction({type:"maintenance_supporter/task/postpone",entry_id:e,task_id:t,until:i},{successToast:s("postponed",this._lang)})}async _promptPostponeTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("postpone",this._lang),message:s("postpone_date_prompt",this._lang),confirmText:s("postpone",this._lang),inputLabel:s("postpone_date_label",this._lang),inputType:"date"});!a.confirmed||!a.value||this._postponeTask(e,t,a.value)}async _snoozeTask(e,t){let i=await this._runAction({type:"maintenance_supporter/task/snooze",entry_id:e,task_id:t});i&&this._showToast(fs(i,this._lang),"info")}_dismissSuggestion(e,t){e&&t&&this._dismissedSuggestions.add(`${e}_${t}`),this.requestUpdate()}async _handleQuickComplete(e,t,i){let a=null,r=await I(this,{type:"maintenance_supporter/task/quick_complete",entry_id:e,task_id:t},{fallbackKey:"action_error",onError:(o,c)=>{a={message:o,code:c?.code||""}}});if(r===void 0){let{message:o,code:c}=a??{message:"",code:""};c==="no_defaults"||c==="completion_details_required"?this._openCompleteDialog(e,t,i.name,this._features.checklists?i.checklist:void 0,this._features.adaptive&&!!i.adaptive_config?.enabled,{viaTagScan:!0}):this._showToast(o);return}r?.undo?this._offerUndo(e,t,s("quick_complete_success",this._lang)):this._showToast(s("quick_complete_success",this._lang),"info");try{await this._loadData()}catch{}}async _printTaskWorksheet(e,t){let i=this._getObject(e),a=i?.tasks.find(c=>c.id===t);if(!i||!a)return;let r=bt(),o=!1;this._actionLoading=!0;try{let c={type:"maintenance_supporter/qr/generate",entry_id:e,task_id:t,url_mode:"server"},[u,p]=await Promise.all([this.hass.connection.sendMessagePromise({...c,action:"view"}).catch(()=>null),this.hass.connection.sendMessagePromise({...c,action:"complete"}).catch(()=>null)]),g=null;try{let T=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:e})).documents||[]).find(j=>j.kind==="file"&&j.mime==="application/pdf"&&(j.task_ids||[]).includes(t)&&j.task_pages?.[t]);if(T){let j=T.task_pages[t],C=4,v={path:await Di(this.hass,`/api/maintenance_supporter/document/${T.id}/excerpt?start=${j}&count=${C}`,3600)};g={title:le(T)||"Manual",startPage:j,endPage:j+C-1,url:new URL(v.path,window.location.origin).toString(),vendorBase:new URL("/maintenance_supporter_vendor",window.location.origin).toString()}}}catch{}let m=this._lang,b={title:s("worksheet",m),object:s("object",m),type:s("maintenance_type",m),interval:s("interval",m),nextDue:s("next_due",m),lastDone:s("last_performed",m),priority:s("priority",m),checklist:s("checklist",m),notes:s("notes_label",m),scanView:s("worksheet_scan_view",m),scanComplete:s("worksheet_scan_complete",m),manualExcerpt:s("worksheet_manual_excerpt",m),pages:s("worksheet_pages",m),printedOn:s("worksheet_printed",m),never:s("worksheet_never",m),typeLabel:k=>s(k,m),statusLabel:k=>s(k,m),priorityLabel:k=>s(`priority_${k}`,m),parts:s("consumes_parts_label",m)},y=(a.consumes_parts||[]).map(k=>zi(k,i.entry_id,this._objects,m)),$=Ps(a,i.object.name,b,k=>q(k,m),k=>Le(k,m),u?.svg_data_uri||null,p?.svg_data_uri||null,g,new Date().toISOString(),y,Ee(i.object,a));tt($,r),o=!0}finally{o||r?.close(),this._actionLoading=!1}}_openManualDoc(e){if(e.kind!=="file"){ce(e.url)&&window.open(e.url,"_blank","noopener");return}Re(this.hass,e.id).catch(()=>{})}_setChecklistItem(e,t,i,a){let r=`${e}/${t}`;this._checklistPending.set(r,{...this._checklistPending.get(r)??{},[i]:a});let o=this._checklistChain.then(async()=>{let c=this._getObject(e)?.tasks.find(b=>b.id===t);if(!c)return;let u=this._checklistPending.get(r)??{},p={},g=vt(c)?.checklist??(c.checklist||[]);for(let b of g)p[b]=b in u?u[b]:c.checklist_progress?.[b]??!1;await this._runAction({type:"maintenance_supporter/task/checklist_progress",entry_id:e,task_id:t,checklist_state:p});let m=this._checklistPending.get(r);if(m){for(let[b,y]of Object.entries(p))b in m&&m[b]===y&&delete m[b];Object.keys(m).length===0&&this._checklistPending.delete(r)}});return this._checklistChain=o.catch(()=>{}),o}_openCompleteDialog(e,t,i,a,r,o){this._ui("maintenance-complete-dialog").then(c=>c&&this._fillAndOpenCompleteDialog(c,e,t,i,a,r,o))}_fillAndOpenCompleteDialog(e,t,i,a,r,o,c){Vi(e,Ui({entryId:t,taskId:i,taskName:a,task:this._getTask(t,i),objects:this._objects,lang:this._lang,checklist:r,features:this._features,adaptiveEnabled:o,currencySymbol:this._currencySymbol,viaTagScan:c?.viaTagScan,partsCostMode:this._partsCostMode}),this._lang)}_openQrForObject(e,t){this._ui("maintenance-qr-dialog").then(i=>i?.openForObject(e,t))}_openQrForTask(e,t,i,a){this._ui("maintenance-qr-dialog").then(r=>r?.openForTask(e,t,i,a))}_offerUndo(e,t,i){this._showUndoToast(i,()=>{this._undoCompletion(e,t)})}async _undoCompletion(e,t){let i=await as(this.hass,e,t,this._lang);this._showToast(i.message,i.ok?"info":"error"),i.ok&&await this._onDialogEvent()}render(){return n`
      <div class="panel">
        ${this._restartPendingVersion?n`
              <div class="update-banner restart-pending-banner" role="status">
                <ha-icon icon="mdi:restart"></ha-icon>
                <span>${s("restart_pending_banner",this._lang).replace("{version}",this._restartPendingVersion)}</span>
              </div>
            `:h}
        ${this._staleBundle?n`
              <div class="update-banner" role="status">
                <ha-icon icon="mdi:update"></ha-icon>
                <span>${s("update_banner",this._lang)}</span>
                <ha-button appearance="plain" @click=${()=>location.reload()}>
                  ${s("update_reload",this._lang)}
                </ha-button>
              </div>
            `:h}
        ${this._rowActionNotice&&this.hass?.user?.is_admin?n`
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
            `:h}
        ${this.narrow||this._view!=="overview"?this._renderHeader():h}
        <div class="content">
          ${this._view==="overview"?this._renderOverview():this._view==="all_objects"?this._renderAllObjects():this._view==="all_parts"?this._renderAllParts():this._view==="all_areas"?this._renderAllAreas():this._view==="area"?this._renderArea():this._view==="object"?this._renderObjectDetail():this._renderTaskDetail()}
        </div>
      </div>
      <maintenance-object-dialog
        .hass=${this.hass}
        .objects=${this._objects}
        .placesEnabled=${this._features.places}
        @object-saved=${this._onObjectSaved}
        @object-replaced=${this._onObjectReplaced}
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
        .mirrorTodoDefault=${this._mirrorTodoDefault}
        @task-saved=${this._onDialogEvent}
      ></maintenance-task-dialog>
      <maintenance-complete-dialog
        .hass=${this.hass}
        @task-completed=${this._onTaskCompleted}
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
      <maintenance-bulk-edit-dialog .hass=${this.hass}></maintenance-bulk-edit-dialog>
      <maintenance-adopt-problem-sensors-dialog
        .hass=${this.hass}
        @problem-sensors-adopted=${e=>this._onProblemSensorsAdopted(e)}
      ></maintenance-adopt-problem-sensors-dialog>
      <maintenance-suggested-setups-dialog
        .hass=${this.hass}
        @integration-setups-adopted=${e=>this._onSetupsAdopted(e)}
        @reset-counters-wired=${e=>this._onResetsWired(e)}
      ></maintenance-suggested-setups-dialog>
      <maintenance-saved-views-dialog
        .hass=${this.hass}
        @saved-views-changed=${e=>this._onSavedViewsChanged(e)}
      ></maintenance-saved-views-dialog>
      ${this._toastMessage?n`<div class="toast ${this._toastKind}" role=${this._toastKind==="error"?"alert":"status"}>
        <span>${this._toastMessage}</span>
        ${this._toastUndo?n`<button class="toast-undo" @click=${()=>this._runToastUndo()}>${this._toastActionLabel||s("undo",this._lang)}</button>`:h}
      </div>`:h}
      ${this._renderPalette()}
      ${this._renderTemplateGallery()}
    `}_renderSearchButton(e){let t=this._lang;return n`<ha-icon-button
      class=${e}
      .path=${gr}
      .label=${s("search_open",t)}
      title=${s("search_open",t)}
      @click=${()=>this._openPalette()}
    ></ha-icon-button>`}_renderHeader(){let e=[{label:s("maintenance",this._lang),action:()=>this._showOverview()}],t=(this._view==="object"||this._view==="task")&&this._selectedEntryId?Et(this._objects,this._selectedEntryId):[];for(let i of this.narrow?t.slice(-1):t)e.push({label:i.object.name,action:()=>this._showObject(i.entry_id)});if(this._view==="object"&&this._selectedEntryId){let i=this._getObject(this._selectedEntryId);e.push({label:i?.object.name||"Object"})}if(this._view==="task"&&this._selectedEntryId&&this._selectedTaskId){let i=this._getObject(this._selectedEntryId);e.push({label:i?.object.name||"Object",action:()=>this._showObject(this._selectedEntryId)});let a=this._getTask(this._selectedEntryId,this._selectedTaskId);e.push({label:a?.name||"Task"})}return this._view==="area"&&this._selectedAreaId&&(e.push({label:s("all_areas",this._lang),action:()=>this._showAllAreas()}),e.push({label:Kt(this._selectedAreaId,this.hass?.areas,s("no_area",this._lang))})),n`
      <div class="header">
        ${this.narrow&&!this.embedded?n`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`:h}
        ${this._view!=="overview"?n`<ha-icon-button
              .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
              @click=${()=>{this._view==="task"?this._showObject(this._selectedEntryId):this._view==="area"?this._showAllAreas():this._view==="object"&&t.length?this._showObject(t[t.length-1].entry_id):this._showOverview()}}
            ></ha-icon-button>`:h}
        <div class="breadcrumbs">
          ${e.map((i,a)=>n`
              ${a>0?n`<span class="sep">/</span>`:h}
              ${i.action?n`<a @click=${i.action}>${i.label}</a>`:n`<span class="current">${i.label}</span>`}
            `)}
        </div>
        ${this._renderSearchButton("header-search")}
      </div>
    `}_renderOverview(){let e=this._lang,t=!!this.hass?.user?.is_admin,i=this._stats;return!t&&this._overviewTab==="settings"&&(this._overviewTab="dashboard"),n`
      ${i?n`
            <div class="stats-bar">
              <div class="stat-item clickable"
                   @click=${()=>this._showAllObjects()}
                   title=${s("show_all_objects",e)}>
                <span class="stat-value">${i.total_objects}</span>
                <span class="stat-label">${s("objects",e)}</span>
              </div>
              <div class="stat-item clickable"
                   @click=${()=>this._filterByStatus("")}
                   title=${s("show_all_tasks",e)}>
                <span class="stat-value">${i.total_tasks}</span>
                <span class="stat-label">${s("tasks",e)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="overdue"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("overdue")}
                   title=${s("filter_to_overdue",e)}>
                <span class="stat-value" style="color: var(--error-color)">${i.overdue}</span>
                <span class="stat-label">${s("overdue",e)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="due_soon"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("due_soon")}
                   title=${s("filter_to_due_soon",e)}>
                <span class="stat-value" style="color: var(--warning-color)">${i.due_soon}</span>
                <span class="stat-label">${s("due_soon",e)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="triggered"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("triggered")}
                   title=${s("filter_to_triggered",e)}>
                <span class="stat-value" style="color: #ff5722">${i.triggered}</span>
                <span class="stat-label">${s("triggered",e)}</span>
              </div>
              ${this._features.budget?this._renderBudgetTiles():h}
            </div>
          `:h}
      <div class="tab-bar">
        <div class="tab ${this._overviewTab==="today"?"active":""}"
          @click=${()=>this._setOverviewTab("today")}>
          ${s("tab_today",e)}
        </div>
        <div class="tab ${this._overviewTab==="dashboard"?"active":""}"
          @click=${()=>this._setOverviewTab("dashboard")}>
          ${s("dashboard",e)}
        </div>
        <div class="tab ${this._overviewTab==="calendar"?"active":""}"
          @click=${()=>this._setOverviewTab("calendar")}>
          ${s("tab_calendar",e)}
        </div>
        ${t?n`
          <div class="tab ${this._overviewTab==="settings"?"active":""}"
            @click=${()=>this._setOverviewTab("settings")}>
            ${s("settings",e)}
          </div>
        `:h}
        ${this.narrow?h:this._renderSearchButton("tab-search")}
      </div>
      ${this._overviewTab==="today"?this._renderToday():this._overviewTab==="dashboard"?this._renderDashboard():this._overviewTab==="calendar"?n`
            <div @ll-custom=${this._onCalendarLlCustom} @maintenance-supporter-open-task=${this._onCalendarOpenTask}>
              <maintenance-supporter-calendar-card
                .hass=${this.hass}
              ></maintenance-supporter-calendar-card>
            </div>
          `:n`<maintenance-settings-view
            .hass=${this.hass}
            .features=${this._features}
            .budget=${this._budget}
            @settings-changed=${this._onSettingsChanged}
          ></maintenance-settings-view>`}
    `}_statusBadge(e){return Ot(e,this._lang)}_setOverviewTab(e){this._overviewTab=e;try{U(A.overviewTab,e)}catch{}this._scrollContentToTop()}_renderToday(){let e=this._lang,t=this._rowsFiltered(!1),i=p=>`${p.entry_id}:${p.task_id}`,a=t.filter(p=>p.status==="overdue"),r=t.filter(p=>p.status==="triggered"),o=new Set([...a,...r].map(i)),c=t.filter(p=>!o.has(i(p))&&p.days_until_due===0);c.forEach(p=>o.add(i(p)));let u=t.filter(p=>!o.has(i(p))&&p.days_until_due!=null&&p.days_until_due>0&&p.days_until_due<=7);return a.length+r.length+c.length+u.length===0?n`
        <div class="today-empty">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <p>${s("today_all_caught_up",e)}</p>
        </div>
      `:n`
      <div class="today-view">
        ${this._renderTodaySection("today_overdue",a,"overdue")}
        ${this._renderTodaySection("triggered",r,"triggered")}
        ${this._renderTodaySection("today_due_today",c,"due_soon")}
        ${this._renderTodaySection("today_this_week",u,"")}
      </div>
    `}_renderTodaySection(e,t,i){if(t.length===0)return h;let a=this._lang,r=o=>this._filterUser||!o.responsible_user_id?null:this._userService?.getPerson(o.responsible_user_id)??null;return n`
      <div class="today-section">
        <div class="today-section-header ${i}">
          <span>${s(e,a)}</span><span class="today-badge">${t.length}</span>
        </div>
        ${t.map(o=>n`
          <div class="today-row" @click=${()=>this._showTask(o.entry_id,o.task_id)}>
            <span class="today-dot ${o.trigger_active?"triggered":o.status}"></span>
            <div class="today-main">
              <div class="today-task">${this._listRef(o.entry_id,o.task_id)}${o.task_name}${Ke(o.next_event_titles)}${Ge(o.trigger_detail)}</div>
              <div class="today-object">
                <span class="today-object-text">${o.object_name} · ${o.days_until_due==null?ui(o.last_performed,a)??"\u2014":we(o.days_until_due,a)}</span>
                ${Yt(r(o),"today-person")}
              </div>
            </div>
            ${this._renderRowActions(a,()=>this._openCompleteDialogForRow(o),void 0,!1)}
          </div>
        `)}
      </div>
    `}_renderDashboard(){let e=this._stats,t=this._taskRows,i=this._lang,a=this._isOperator,r=this._objects.reduce((p,g)=>p+g.tasks.filter(m=>m.archived).length,0),o=new Set;for(let p of this._objects)for(let g of p.tasks)for(let m of rt(g))o.add(m);this._filterUser&&this._filterUser!=="current_user"&&o.add(this._filterUser);let c=[...o].map(p=>({id:p,name:this._userService?.getUserName(p)??null})).filter(p=>p.name!==null||p.id===this._filterUser).sort((p,g)=>(p.name??"").localeCompare(g.name??"")),u=(this._filterStatus?1:0)+(this._filterUser?1:0)+(this._filterLabel?1:0)+(this._filterPlace?1:0)+(this._filterPriority?1:0)+(this._activeViewId?1:0);return n`

      ${this.narrow?n`
        <div class="mobile-controls">
          <ha-button
            class="mobile-toggle ${this._filtersOpen?"active":""}"
            @click=${()=>{this._filtersOpen=!this._filtersOpen}}
          >
            <ha-icon icon="mdi:filter-variant"></ha-icon>
            ${s("filter_label",i)}${u>0?` (${u})`:""}
          </ha-button>
          ${a?h:this._renderNewMenu(i)}
        </div>
      `:h}

      <div class="filter-bar ${this.narrow&&!this._filtersOpen?"collapsed":""}">
        <label class="filter-field">
          <span class="filter-label">${s("views_label",i)}</span>
          <select
            .value=${this._activeViewId}
            @change=${p=>this._applyView(p.target.value)}
          >
            <option value="">${s("views_none",i)}</option>
            ${this._savedViews.map(p=>n`<option value=${p.id} ?selected=${this._activeViewId===p.id}>${p.name}</option>`)}
          </select>
        </label>
        ${a?h:n`
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
            @change=${p=>{this._filterStatus=p.target.value,this._activeViewId=""}}
          >
            <option value="">${s("all",i)}</option>
            ${pa.map(p=>n`<option value=${p} ?selected=${this._filterStatus===p}>${s(p,i)}</option>`)}
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${s("user_label",i)}</span>
          <select
            .value=${this._filterUser||""}
            @change=${p=>{let g=p.target.value;this._filterUser=g||null,this._activeViewId=""}}
          >
            <option value="">${s("all_users",i)}</option>
            <option value="current_user" ?selected=${this._filterUser==="current_user"}>${s("my_tasks",i)}</option>
            ${c.map(p=>n`<option value=${p.id} ?selected=${this._filterUser===p.id}>${p.name??p.id}</option>`)}
          </select>
        </label>
        ${this._allLabels.length>0?n`
          <label class="filter-field">
            <span class="filter-label">${s("label_filter",i)}</span>
            <select
              .value=${this._filterLabel||""}
              @change=${p=>{let g=p.target.value;this._filterLabel=g||null,this._activeViewId=""}}
            >
              <option value="">${s("all_labels",i)}</option>
              ${this._allLabels.map(p=>n`<option value=${p} ?selected=${this._filterLabel===p}>${p}</option>`)}
            </select>
          </label>
        `:h}
        ${this._features.places&&this._allPlaces.length>0?n`
          <label class="filter-field">
            <span class="filter-label">${s("filter_place",i)}</span>
            <select
              .value=${this._filterPlace}
              @change=${p=>{this._filterPlace=p.target.value,this._activeViewId=""}}
            >
              <option value="">${s("filter_place_all",i)}</option>
              <option value="home" ?selected=${this._filterPlace==="home"}>${s("place_home",i)}</option>
              ${this._allPlaces.map(p=>n`<option value=${p.id} ?selected=${this._filterPlace===p.id}>${p.name}</option>`)}
            </select>
          </label>
        `:h}
        <label class="filter-field">
          <span class="filter-label">${s("priority",i)}</span>
          <select
            .value=${this._filterPriority}
            @change=${p=>{this._filterPriority=p.target.value,this._activeViewId=""}}
          >
            <option value="">${s("all_priorities",i)}</option>
            ${gs.map(p=>n`<option value=${p} ?selected=${this._filterPriority===p}>${s(`priority_${p}`,i)}</option>`)}
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${s("sort_label",i)}</span>
          <select
            .value=${this._sortMode}
            @change=${p=>{this._sortMode=p.target.value,this._activeViewId="";try{U(A.taskSort,this._sortMode)}catch{}}}
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
            @change=${p=>{this._groupByMode=p.target.value,this._activeViewId="";try{U(A.groupBy,this._groupByMode)}catch{}}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${s("groupby_none",i)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${s("groupby_area",i)}</option>
            ${this._features.groups?n`<option value="group" ?selected=${this._groupByMode==="group"}>${s("groupby_group",i)}</option>`:h}
            <option value="user" ?selected=${this._groupByMode==="user"}>${s("groupby_user",i)}</option>
            <option value="object" ?selected=${this._groupByMode==="object"}>${s("groupby_object",i)}</option>
          </select>
        </label>
        ${r>0?n`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived,this._activeViewId=""}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?s("hide_archived",i):`${s("show_archived",i)} (${r})`}
          </ha-button>
        `:h}
        ${!a&&t.length>0?n`
          <ha-button
            class="bulk-toggle ${this._bulkMode?"active":""}"
            @click=${()=>this._toggleBulkMode()}
          >
            <ha-icon icon="mdi:checkbox-multiple-marked-outline"></ha-icon>
            ${this._bulkMode?s("cancel",i):s("bulk_select",i)}
          </ha-button>
        `:h}
        ${!a&&!this.narrow?this._renderNewMenu(i):h}
      </div>

      ${a?h:this._renderGettingStartedChips(i)}

      ${t.length===0?n`
            <div class="empty-state">
              <ha-svg-icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></ha-svg-icon>
              <p>${s("no_tasks",i)}</p>
              ${!a&&this._objects.length===0?n`
                <p class="empty-onboard-hint">${s("onboard_hint",i)}</p>
                <div class="empty-onboard-actions">
                  <ha-button appearance="filled" @click=${()=>this._openTemplateGallery()}>
                    <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon> ${s("templates_from",i)}
                  </ha-button>
                  <ha-button appearance="plain" @click=${()=>this._ui("maintenance-object-dialog").then(p=>p?.openCreate())}>
                    ${s("new_object",i)}
                  </ha-button>
                </div>
              `:h}
            </div>
          `:n`
            ${this._bulkMode?this._renderBulkBar(t,i):h}
            ${this._splitActive()?n`
                  <div class="split-layout">
                    <div class="split-list">
                      ${this._groupByMode==="none"?this._renderTaskTable(t):this._renderGroupedTasks(t,i)}
                    </div>
                    <div class="split-pane">
                      ${this._selectedEntryId&&this._selectedTaskId&&this._getTask(this._selectedEntryId,this._selectedTaskId)?this._renderTaskDetail():n`<div class="split-pane-empty"><ha-icon icon="mdi:cursor-default-click-outline"></ha-icon><p>${s("split_select_hint",i)}</p></div>`}
                    </div>
                  </div>
                `:this._groupByMode==="none"?this._renderTaskTable(t):this._renderGroupedTasks(t,i)}
          `}

      ${this._features.groups&&!a?this._renderGroupsSection():h}
      ${a?h:n`<maintenance-storage-section-card
            .hass=${this.hass}
            .objects=${this._objects}
            @open-object=${p=>{let g=p.detail?.entry_id;g&&this._showObject(g)}}
          ></maintenance-storage-section-card>`}
    `}_renderTaskTable(e){let t=this._bulkMode?" bulk":"";if(this._virtTotalRows=e.length,this.narrow||e.length<120)return n`
        <div class="task-table${t}">
          ${e.map(p=>this._renderOverviewRow(p))}
        </div>
      `;let i=e.length,a=this._virtRowHeight,r=Math.max(0,Math.min(this._virtStart,i)),o=this._virtEnd>0?Math.min(this._virtEnd,i):Math.min(i,40);o<r&&(r=0,o=Math.min(i,40));let c=r*a,u=(i-o)*a;return n`
      <div class="task-table${t} virtual">
        ${this._renderVirtSizerRow(e)}
        ${c>0?n`<div class="virt-spacer" style="height:${c}px"></div>`:h}
        ${e.slice(r,o).map(p=>this._renderOverviewRow(p))}
        ${u>0?n`<div class="virt-spacer" style="height:${u}px"></div>`:h}
      </div>
    `}_renderVirtSizerRow(e){let t=this._lang,i="",a=!1,r=!1,o=!1;for(let c of e){let u=$s(ws(c),t);u.length>i.length&&(i=u),c.enabled||(a=!0),c.nfc_tag_id&&(r=!0),(c.priority==="high"||c.priority==="low")&&(o=!0)}return n`
      <div class="task-row virt-sizer" aria-hidden="true">
        ${this._bulkMode?n`<span></span>`:h}
        <span class="cell-badges">
          <span class="status-badge"><ha-icon icon="mdi:circle-medium"></ha-icon><span class="status-label">${i}</span></span>
          ${a?n`<span class="badge-disabled">${s("disabled",t)}</span>`:h}
          ${r?n`<span class="nfc-badge"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:h}
          ${o?n`<span class="priority-badge"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>`:h}
        </span>
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
    `}_renderBulkBar(e,t){let i=this._bulkSelected.size,a=e.length>0&&e.every(r=>this._bulkSelected.has(this._bulkKey(r)));return n`
      <div class="bulk-bar">
        <label class="bulk-selectall">
          <input type="checkbox" .checked=${a} @change=${()=>this._bulkSelectAll(e)} />
          ${s("bulk_select_all",t)}
        </label>
        <span class="bulk-count">${s("bulk_n_selected",t).replace("{n}",String(i))}</span>
        <span class="bulk-actions">
          <ha-button appearance="filled" .disabled=${i===0||this._actionLoading}
            @click=${()=>this._bulkComplete(e)}>
            <ha-icon icon="mdi:check"></ha-icon> ${s("complete",t)}
          </ha-button>
          <ha-button appearance="plain" .disabled=${i===0||this._actionLoading}
            @click=${()=>this._bulkArchive(e)}>
            <ha-icon icon="mdi:archive-outline"></ha-icon> ${s("archive",t)}
          </ha-button>
          <span class="bulk-more-wrapper">
            <ha-button appearance="plain" class="bulk-more" title=${s("more_actions",t)} aria-label=${s("more_actions",t)} .disabled=${i===0||this._actionLoading}
              @click=${r=>{r.stopPropagation(),this._bulkMenuOpen=!this._bulkMenuOpen}}>
              <ha-icon icon="mdi:dots-vertical"></ha-icon>
            </ha-button>
            ${this._bulkMenuOpen?n`
              <div class="popup-menu" role="menu" @keydown=${He} @click=${r=>r.stopPropagation()}>
                <div role="menuitem" tabindex="0" class="popup-menu-item bulk-move" @click=${()=>{this._bulkMenuOpen=!1,this._bulkMove(e)}}>${s("move_task",t)}</div>
                <div role="menuitem" tabindex="0" class="popup-menu-item bulk-assign" @click=${()=>{this._bulkMenuOpen=!1,this._bulkEdit("assign",e)}}>${s("bulk_assign",t)}…</div>
                <div role="menuitem" tabindex="0" class="popup-menu-item bulk-labels" @click=${()=>{this._bulkMenuOpen=!1,this._bulkEdit("labels",e)}}>${s("labels",t)}…</div>
                <div role="menuitem" tabindex="0" class="popup-menu-item bulk-edit" @click=${()=>{this._bulkMenuOpen=!1,this._bulkEdit("edit",e)}}>${s("edit",t)}…</div>
                <div role="menuitem" tabindex="0" class="popup-menu-item bulk-pause" @click=${()=>{this._bulkMenuOpen=!1,this._bulkPause(e)}}>${s("pause_task",t)}…</div>
                <div role="menuitem" tabindex="0" class="popup-menu-item bulk-resume" @click=${()=>{this._bulkMenuOpen=!1,this._bulkResume(e)}}>${s("resume_task",t)}</div>
              </div>
            `:h}
          </span>
        </span>
      </div>
    `}_renderGroupedTasks(e,t){let i=new Map,a=s("unassigned",t);for(let c of e){let u=[];if(this._groupByMode==="area")u=[kt(c.area_id,this.hass?.areas,s("no_area",t))];else if(this._groupByMode==="user"){let p=rt(c).map(g=>this._userService?.getUserName(g)).filter(g=>!!g);u=p.length>0?[...new Set(p)]:[a]}else this._groupByMode==="group"?u=c.group_names.length>0?c.group_names:[a]:this._groupByMode==="object"&&(u=[c.object_name]);for(let p of u)i.has(p)||i.set(p,[]),i.get(p).push(c)}let r=[...i.entries()].sort(([c],[u])=>c===a&&u!==a?1:u===a&&c!==a?-1:c.localeCompare(u)),o=this._groupByMode==="area"?"mdi:map-marker-outline":this._groupByMode==="group"?"mdi:folder-outline":this._groupByMode==="object"?"mdi:cube-outline":"mdi:account-outline";return n`
      <div class="task-table grouped${this._bulkMode?" bulk":""}">
        ${r.map(([c,u])=>{let p=!this._collapsedGroups.has(c);return n`
            <div class="group-section" ?open=${p}>
              <div
                class="group-section-header"
                role="button"
                tabindex="0"
                aria-expanded=${p?"true":"false"}
                @click=${()=>this._toggleGroup(c)}
                @keydown=${g=>{(g.key==="Enter"||g.key===" ")&&(g.preventDefault(),this._toggleGroup(c))}}
              >
                <ha-icon icon="${o}"></ha-icon>
                <span>${c}</span>
                <span class="group-section-count">(${u.length})</span>
              </div>
              ${p?n`<div class="group-rows">${u.map(g=>this._renderOverviewRow(g))}</div>`:h}
            </div>
          `})}
      </div>
    `}_toggleGroup(e){let t=new Set(this._collapsedGroups);t.has(e)?t.delete(e):t.add(e),this._collapsedGroups=t}_warrantyLabel(e,t,i){return e.kind==="expired"?s("warranty_expired",i):e.kind==="expiring"?s("warranty_expires_in",i).replace("{days}",String(e.days??0)):s("warranty_valid_until",i).replace("{date}",q(t,i))}_renderWarrantyMeta(e,t){let i=ri(e);return n`<p class="meta">${s("warranty",t)}:
      <span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,e,t)}</span></p>`}_renderAllObjects(){let e=this._lang,t=this._isOperator,i=this._objectViewMode==="table"&&!this.narrow,a=this._objects.filter(p=>p.object.archived).length,r=this._objects.filter(p=>this._showArchived||!p.object.archived),o=p=>this._arrangeObjects(p,!this._objBulkMode),c=o(r),u=()=>{let p=new Map;for(let g of r){let m=kt(g.object.area_id,this.hass?.areas,s("no_area",e));p.has(m)||p.set(m,[]),p.get(m).push(g)}return[...p.entries()].sort(([g],[m])=>g.localeCompare(m))};return n`
      <div class="breadcrumb">
        <ha-icon-button .label=${s("back",e)} @click=${()=>this._showOverview()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${s("all_objects",e)}</span>
        <button class="sibling-view-chip" @click=${()=>this._showAllParts()}>
          <ha-icon icon="mdi:package-variant-closed"></ha-icon> ${s("all_parts",e)}
        </button>
        <button class="sibling-view-chip" data-view="all_areas" @click=${()=>this._showAllAreas()}>
          <ha-icon icon="mdi:floor-plan"></ha-icon> ${s("all_areas",e)}
        </button>
      </div>
      <div class="filter-bar">
        <label class="filter-field">
          <span class="filter-label">${s("sort_label",e)}</span>
          <select
            .value=${this._objectSortMode}
            @change=${p=>{this._objectSortMode=p.target.value;try{U(A.objectSort,this._objectSortMode)}catch{}}}
          >
            <option value="alphabetical" ?selected=${this._objectSortMode==="alphabetical"}>${s("sort_alphabetical",e)}</option>
            <option value="due_soonest" ?selected=${this._objectSortMode==="due_soonest"}>${s("sort_due_soonest",e)}</option>
            <option value="task_count" ?selected=${this._objectSortMode==="task_count"}>${s("sort_task_count",e)}</option>
          </select>
        </label>
        ${this.narrow?h:n`
          <div class="view-toggle" role="group" aria-label="${s("view_mode_label",e)}">
            <button
              class="view-toggle-btn${i?"":" active"}"
              title="${s("view_cards",e)}"
              @click=${()=>this._setObjectViewMode("cards")}
            ><ha-icon icon="mdi:view-grid-outline"></ha-icon></button>
            <button
              class="view-toggle-btn${i?" active":""}"
              title="${s("view_table",e)}"
              @click=${()=>this._setObjectViewMode("table")}
            ><ha-icon icon="mdi:table"></ha-icon></button>
          </div>
        `}
        ${i?h:n`
        <label class="filter-field">
          <span class="filter-label">${s("group_by_label",e)}</span>
          <select
            .value=${this._groupByMode}
            @change=${p=>{this._groupByMode=p.target.value;try{U(A.groupBy,this._groupByMode)}catch{}}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${s("groupby_none",e)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${s("groupby_area",e)}</option>
          </select>
        </label>
        `}
        ${t?h:n`
          <ha-button
            @click=${()=>this._ui("maintenance-object-dialog").then(p=>p?.openCreate())}
          >
            ${s("new_object",e)}
          </ha-button>
        `}
        <ha-button appearance="plain" @click=${()=>this._exportObjectsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${s("settings_export_csv",e)}
        </ha-button>
        ${t?h:n`
          <ha-button appearance="plain" class="bulk-toggle obj-bulk-toggle ${this._objBulkMode?"active":""}" @click=${()=>this._toggleObjBulkMode()}>
            <ha-icon icon="mdi:checkbox-multiple-marked-outline"></ha-icon>
            ${this._objBulkMode?s("cancel",e):s("bulk_select",e)}
          </ha-button>
        `}
        ${a>0?n`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?s("hide_archived",e):`${s("show_archived",e)} (${a})`}
          </ha-button>
        `:h}
      </div>
      ${this._objBulkMode?this._renderObjBulkBar(c.roots,e):h}
      ${i?this._renderObjectsTable(c):this._groupByMode==="area"?n`
          ${u().map(([p,g])=>{let m=o(g);return n`
            <details class="group-section" open>
              <summary class="group-section-header">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <span>${p}</span>
                <span class="group-section-count">(${g.length})</span>
              </summary>
              <div class="objects-grid">${m.roots.map(b=>this._renderObjectCard(b,m))}</div>
            </details>
          `})}
        `:n`<div class="objects-grid">${c.roots.map(p=>this._renderObjectCard(p,c))}</div>`}
    `}_arrangeObjects(e,t=!0){let i=t?hs(e):{roots:[...e],children:new Map},a=(c,u)=>c.object.name.localeCompare(u.object.name);if(this._objectSortMode==="alphabetical")return ei(i,a),i;let r=new Map;for(let c of e){let u=Zt(i,c);if(this._objectSortMode==="task_count")r.set(c.entry_id,u.reduce((p,g)=>p+g.tasks.length,0));else{let p=1/0;for(let g of u)for(let m of g.tasks){let b=m.days_until_due;b!=null&&b<p&&(p=b)}r.set(c.entry_id,p)}}let o=c=>r.get(c.entry_id)??0;return ei(i,this._objectSortMode==="task_count"?(c,u)=>o(u)-o(c)||a(c,u):(c,u)=>o(c)-o(u)||a(c,u)),i}_renderObjectCard(e,t){let i=this._lang,a=t.children.get(e.entry_id)??[],r=p=>p.tasks.some(g=>g.status==="overdue"||g.status==="triggered"),o=p=>Zt(t,p).some(r),c=o(e),u=this._objBulkMode&&this._view==="all_objects";return n`
      <div class="object-card${c?" object-card-overdue":""}${u?" selectable":""}${u&&this._objBulkSelected.has(e.entry_id)?" bulk-selected":""}"
        data-entry-id=${e.entry_id}
        @click=${()=>u?this._toggleObjBulk(e.entry_id):this._showObject(e.entry_id)}>
        ${u?n`<label class="obj-bulk-check bulk-check" @click=${p=>p.stopPropagation()}>
              <input type="checkbox" .checked=${this._objBulkSelected.has(e.entry_id)} @change=${()=>this._toggleObjBulk(e.entry_id)} />
            </label>`:h}
        ${c?n`<span class="overdue-dot" title="${s("has_overdue",i)}"></span>`:h}
        <div class="object-card-header">
          <span class="object-card-name">${this._objRef(e.object)}${e.object.name}</span>
          ${e.object.paused?n`<span class="paused-badge" title="${s("object_paused_badge",i)}${e.object.paused_until?` \u2014 ${q(e.object.paused_until,i)}`:""}">
                <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
              </span>`:h}
          ${e.object.document_count?n`<span class="doc-badge" title="${e.object.document_count} ${s("documents",i)}">
                <ha-icon icon="mdi:paperclip"></ha-icon>${e.object.document_count}
              </span>`:h}
          <span class="object-card-count">${a.length&&!e.tasks.length?fe("sub_objects_count","sub_objects_count_one",a.length,i):fe("templates_task_count","templates_task_count_one",e.tasks.length,i)}</span>
        </div>
        ${e.object.manufacturer||e.object.model?n`<div class="object-card-meta">${[e.object.manufacturer,e.object.model].filter(Boolean).join(" ")}</div>`:h}
        ${a.length?n`<div class="object-card-children" aria-label=${s("sub_objects",i)}>
              ${a.map(p=>{let g=t.children.get(p.entry_id)?.length??0;return n`<button class="object-child-chip${o(p)?" overdue":""}"
                  data-entry-id=${p.entry_id}
                  title=${o(p)?`${p.object.name}: ${s("has_overdue",i)}`:p.object.name}
                  @click=${m=>{m.stopPropagation(),this._showObject(p.entry_id)}}
                  ><span class="object-child-name">${p.object.name}</span>${g?n`<span class="object-child-count">${g}</span>`:h}</button>`})}
            </div>`:e.tasks.length===0?n`<div class="object-card-empty">${s("no_tasks_yet",i)}</div>`:h}
      </div>
    `}_setObjectViewMode(e){this._objectViewMode=e;try{U(A.objectView,e)}catch{}}_renderAllParts(){let e=this._lang,t=this._allParts,i=this._currencySymbol;return n`
      <div class="breadcrumb">
        <ha-icon-button .label=${s("back",e)} @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${s("all_parts",e)}</span>
        <button class="sibling-view-chip" @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:devices"></ha-icon> ${s("all_objects",e)}
        </button>
        <button class="sibling-view-chip" data-view="all_areas" @click=${()=>this._showAllAreas()}>
          <ha-icon icon="mdi:floor-plan"></ha-icon> ${s("all_areas",e)}
        </button>
      </div>
      <div class="filter-bar">
        <ha-button appearance="plain" @click=${()=>this._exportPartsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${s("settings_export_csv",e)}
        </ha-button>
      </div>
      ${t===null?n`<div class="empty-state">…</div>`:t.length===0?n`<div class="empty-state">${s("parts_section",e)}: 0</div>`:n`
          <div class="objects-table-wrap">
            <table class="objects-table">
              <thead>
                <tr>
                  <th>${s("part_name",e)}</th>
                  <th>${s("object",e)}</th>
                  <th>${s("part_stock",e)}</th>
                  <th>${s("part_reorder_threshold",e)}</th>
                  <th>${s("part_cost",e)}</th>
                  <th>${s("part_storage_location",e)}</th>
                  <th>${s("parts_used_by",e)}</th>
                </tr>
              </thead>
              <tbody>
                ${t.map(a=>n`
                  <tr class="objects-table-row" @click=${()=>this._showObject(a.entry_id)}>
                    <td>
                      <span class="objects-table-name">${this._objRef(this._getObject(a.entry_id)?.object)}${a.name}</span>
                      ${a.low?n`<ha-icon class="part-low-icon" icon="mdi:cart-arrow-down"
                            title="${s("part_reorder_threshold",e)}: ${a.reorder_threshold}"></ha-icon>`:h}
                    </td>
                    <td>${a.object_name||"\u2014"}</td>
                    <td class="all-parts-stock">${a.stock!==null?Je(a.stock,a.unit,e):"\u2014"}${this._renderAllPartsUse(a)}</td>
                    <td>${a.reorder_threshold??"\u2014"}</td>
                    <td>${a.cost!=null?a.package_size?`${V(a.cost,i,e)} / ${Je(a.package_size,a.unit??void 0,e)}`:V(a.cost,i,e):"\u2014"}</td>
                    <td>${a.storage_location||"\u2014"}</td>
                    <td>
                      ${a.consumers.length===0?"\u2014":a.consumers.map(r=>n`
                            <span
                              class="part-consumer-chip${r.pooled?" pooled":""}"
                              title=${`${r.object_name??""}: ${r.task_name??r.task_id} (\xD7${r.quantity})`}
                            >${r.pooled?`${r.object_name} \xB7 `:""}${r.task_name??r.task_id}</span>
                          `)}
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `}
    `}_renderAllPartsUse(e){if(this._isOperator||!(typeof e.stock=="number"&&e.stock>0))return h;let t=!!this._getObject(e.entry_id)?.object.battery_fleet;return n`<ms-part-use
      nowrap
      .hass=${this.hass}
      .entryId=${e.entry_id}
      .sparePart=${{id:e.part_id,unit:e.unit??void 0,package_size:e.package_size??void 0}}
      ?notBooked=${!t&&yt(e,this._partsCostMode)==="use"}
      @part-used=${()=>{this._loadAllParts(),this._loadData()}}
    ></ms-part-use>`}_renderAllAreas(){let e=this._lang;return this._ensureAreaUi(),n`
      <div class="breadcrumb">
        <ha-icon-button .label=${s("back",e)} @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${s("all_areas",e)}</span>
        <button class="sibling-view-chip" @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:devices"></ha-icon> ${s("all_objects",e)}
        </button>
        <button class="sibling-view-chip" @click=${()=>this._showAllParts()}>
          <ha-icon icon="mdi:package-variant-closed"></ha-icon> ${s("all_parts",e)}
        </button>
      </div>
      <maintenance-areas-view
        .hass=${this.hass}
        .objects=${this._objects}
        .showArchived=${this._showArchived}
        .currencySymbol=${this._currencySymbol}
        @open-area=${t=>this._showArea(t.detail.areaKey)}
        @archived-toggle=${()=>{this._showArchived=!this._showArchived}}
      ></maintenance-areas-view>
    `}_renderArea(){if(!this._selectedAreaId)return h;let e=this._lang;return this._ensureAreaUi(),n`
      <div class="breadcrumb">
        <ha-icon-button .label=${s("back",e)} @click=${()=>this._showAllAreas()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${s("all_areas",e)}</span>
      </div>
      <maintenance-area-view
        .hass=${this.hass}
        .areaKey=${this._selectedAreaId}
        .objects=${this._objects}
        .showArchived=${this._showArchived}
        .currencySymbol=${this._currencySymbol}
        .userName=${t=>this._userService?.getUserName(t)??null}
        @open-object=${t=>this._showObject(t.detail.entryId)}
        @open-task=${t=>this._showTask(t.detail.entryId,t.detail.taskId)}
      ></maintenance-area-view>
    `}_exportPartsCsv(){let e=this._allParts||[],t=o=>{let c=o==null?"":String(o);return/[",\n;]/.test(c)?`"${c.replace(/"/g,'""')}"`:c},a=[["name","object","stock","unit","reorder_threshold","unit_cost","storage_location","vendor","used_by"].join(",")];for(let o of e)a.push([t(o.name),t(o.object_name),t(o.stock),t(o.unit),t(o.reorder_threshold),t(o.cost),t(o.storage_location),t(o.vendor),t(o.consumers.map(c=>`${c.object_name??""}/${c.task_name??c.task_id}\xD7${c.quantity}`).join(" | "))].join(","));let r=ke();Wt(a.join(`
`),`maintenance_parts_${r}.csv`,"text/csv;charset=utf-8")}async _exportObjectsCsv(){let e=await I(this,{type:"maintenance_supporter/objects/csv"},{onError:i=>this._showToast(i)});if(!e)return;let t=ke();Wt(e.csv,`maintenance_objects_${t}.csv`,"text/csv;charset=utf-8")}_renderObjectsTable(e){let t=this._lang,i=this._objectsTableColumns,a=us(e,o=>this._objTreeOpen.has(o)),r=e.children.size>0;return n`
      <div class="objects-table-wrap">
        <table class="objects-table">
          <thead>
            <tr>
              ${this._objBulkMode?n`<th class="oc-bulk"></th>`:h}
              ${i.map(o=>{let c=Ai.find(p=>p.key===o),u=c&&c.key!=="actions"?s(c.labelKey,t):"";return n`<th class="oc-${o}">${u}</th>`})}
            </tr>
          </thead>
          <tbody>
            ${a.map(({obj:o,depth:c})=>n`
              <tr class="objects-table-row${this._objBulkMode&&this._objBulkSelected.has(o.entry_id)?" bulk-selected":""}${c?" sub-object-row":""}"
                data-entry-id=${o.entry_id}
                @click=${()=>this._objBulkMode?this._toggleObjBulk(o.entry_id):this._showObject(o.entry_id)}>
                ${this._objBulkMode?n`<td class="oc-bulk"><input type="checkbox" .checked=${this._objBulkSelected.has(o.entry_id)}
                      @click=${u=>u.stopPropagation()} @change=${()=>this._toggleObjBulk(o.entry_id)} /></td>`:h}
                ${i.map(u=>u==="name"?this._renderObjectNameCell(o,t,c,e.children.get(o.entry_id)?.length??0,r):this._renderObjectCell(u,o,t))}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `}_renderObjectNameCell(e,t,i=0,a=0,r=!1){let o=e.object,c=this._objTreeOpen.has(e.entry_id),u=c?s("sub_objects_hide",t):s("sub_objects_show",t);return n`<td class="oc-name" style=${i?`padding-left: ${12+i*22}px`:""}>
      ${a?n`<button class="object-tree-toggle" type="button" aria-expanded=${c?"true":"false"}
            aria-label=${u} title=${u}
            @click=${p=>{p.stopPropagation(),this._toggleObjTree(e.entry_id)}}
            ><ha-icon icon=${c?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon></button>`:r?n`<span class="object-tree-spacer"></span>`:h}
      <span class="objects-table-name">${this._objRef(o)}${o.name}</span>
      ${a&&!c?n`<span class="object-tree-count" title=${s("sub_objects",t)}>${a}</span>`:h}
      ${o.document_count?n`<span class="doc-badge" title="${o.document_count} ${s("documents",t)}">
            <ha-icon icon="mdi:paperclip"></ha-icon>${o.document_count}
          </span>`:h}
    </td>`}_toggleObjTree(e){let t=new Set(this._objTreeOpen);t.has(e)?t.delete(e):t.add(e),this._objTreeOpen=t,U(A.objectTreeOpen,JSON.stringify([...t]))}_renderObjectCell(e,t,i){let a=t.object;switch(e){case"name":return this._renderObjectNameCell(t,i);case"manufacturer":return n`<td class="oc-manufacturer">${a.manufacturer||"\u2014"}</td>`;case"model":return n`<td class="oc-model">${a.model||"\u2014"}</td>`;case"serial_number":return n`<td class="oc-serial_number">${a.serial_number||"\u2014"}</td>`;case"installation_date":return n`<td class="oc-installation_date">${a.installation_date?q(a.installation_date,i):"\u2014"}</td>`;case"warranty_expiry":return n`<td class="oc-warranty_expiry">${this._renderWarrantyCell(a.warranty_expiry,i)}</td>`;case"area_id":{let r=kt(a.area_id,this.hass?.areas,"\u2014");return n`<td class="oc-area_id">${r}</td>`}case"documentation_url":{let r=(a.manual_docs||[])[0];return n`<td class="oc-documentation_url">${ce(a.documentation_url)?n`<a href=${a.documentation_url} target="_blank" rel="noopener noreferrer"
                @click=${o=>o.stopPropagation()}><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:r?n`<a href="#" title=${r.title}
                  @click=${o=>{o.preventDefault(),o.stopPropagation(),this._openManualDoc(r)}}
                  ><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:"\u2014"}</td>`}case"notes":return n`<td class="oc-notes" title=${a.notes||""}>${a.notes||"\u2014"}</td>`;case"task_count":return n`<td class="oc-task_count">${t.tasks.length}</td>`;case"ref_no":return n`<td class="oc-ref_no">${Se(a)?`#${Se(a)}`:"\u2014"}</td>`;case"actions":return n`<td class="oc-actions">
          <ha-icon-button class="obj-table-qr" title="${s("qr_code",i)}" @click=${r=>{r.stopPropagation(),this._openQrForObject(t.entry_id,a.name)}}>
            <ha-icon icon="mdi:qrcode"></ha-icon>
          </ha-icon-button>
        </td>`;default:return n`<td></td>`}}_renderWarrantyCell(e,t){let i=ri(e);return i.kind==="none"?n`<span class="warranty-none">—</span>`:n`<span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,e,t)}</span>`}async _onSettingsChanged(){await this._loadData()}_renderGroupsSection(){if(!this._features.groups)return h;let e=Object.entries(this._groups),t=this._lang;return n`
      <div class="groups-section">
        <div class="groups-header">
          <h3>${s("groups",t)}</h3>
          <ha-button appearance="plain" @click=${()=>this._openGroupCreate()}>
            ${s("new_group",t)}
          </ha-button>
        </div>
        ${e.length===0?n`<div class="hint">${s("no_groups",t)}</div>`:n`
            <div class="groups-grid">
              ${e.map(([i,a])=>{let r=a.task_refs.map(o=>this._getTask(o.entry_id,o.task_id)?.name).filter(Boolean);return n`
                  <div class="group-card">
                    <div class="group-card-head">
                      <div class="group-card-name">${a.name}</div>
                      <div class="group-card-actions">
                        <ha-icon-button title="${s("edit",t)}" @click=${()=>this._openGroupEdit(i)}>
                          <ha-svg-icon path="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"></ha-svg-icon>
                        </ha-icon-button>
                        <ha-icon-button title="${s("delete",t)}" @click=${()=>this._deleteGroup(i,a.name)}>
                          <ha-svg-icon path="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z"></ha-svg-icon>
                        </ha-icon-button>
                      </div>
                    </div>
                    ${a.description?n`<div class="group-card-desc">${a.description}</div>`:h}
                    <div class="group-card-tasks">
                      ${r.length>0?r.map(o=>n`<span class="group-task-chip">${o}</span>`):n`<span style="font-size:12px;color:var(--secondary-text-color)">${s("no_tasks_short",t)}</span>`}
                    </div>
                  </div>
                `})}
            </div>
          `}
      </div>
    `}_openGroupCreate(){this.shadowRoot.querySelector("maintenance-group-dialog")?.openCreate()}_openGroupEdit(e){let t=this._groups[e];t&&this.shadowRoot.querySelector("maintenance-group-dialog")?.openEdit(e,t)}async _deleteGroup(e,t){await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete_group",this._lang),message:s("delete_group_confirm",this._lang).replace("{name}",t),confirmText:s("delete",this._lang),danger:!0})&&await this._runAction({type:"maintenance_supporter/group/delete",group_id:e})}_renderBudgetTiles(){let e=this._budget;if(!e)return h;let t=this._lang,i=this._currencySymbol,a=(r,o,c)=>{if(c!==null){let{pct:u,level:p}=ca(o,c,e.alert_threshold_pct),g={danger:"var(--error-color, #f44336)",warning:"var(--warning-color, #ff9800)",ok:"var(--success-color, #4caf50)"}[p];return n`
          <div class="stat-item budget-tile" title="${r}: ${V(o,i,t)} / ${V(c,i,t)}">
            <span class="stat-value budget-tile-value">${V(o,i,t)}</span>
            <span class="budget-tile-max">/ ${V(c,i,t)}</span>
            <div class="budget-tile-bar"><div style="width:${u}%; background:${g}"></div></div>
            <span class="stat-label">${r}</span>
          </div>
        `}return n`
        <div class="stat-item budget-tile" title="${r}: ${V(o,i,t)}">
          <span class="stat-value budget-tile-value">${V(o,i,t)}</span>
          <span class="stat-label">${r}</span>
        </div>
      `};return n`
      ${a(s("budget_monthly",t),e.monthly_spent||0,e.monthly_budget>0?e.monthly_budget:null)}
      ${a(s("budget_yearly",t),e.yearly_spent||0,e.yearly_budget>0?e.yearly_budget:null)}
    `}_renderOverviewRow(e){let t=this._lang,i=e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0,a=0,r=ht.ok,o=!1;if(i&&e.days_until_due!==null){let m=Rt(e.interval_days,e.days_until_due,e.interval_unit);a=m.pct,o=m.overflow,e.status==="overdue"?r=ht.overdue:e.status==="due_soon"&&(r=ht.due_soon)}let c=e.area_id?this.hass?.areas?.[e.area_id]?.name:null,u=e.responsible_user_id?this._userService?.getUserName(e.responsible_user_id):null,p=e.group_names.length>0||c||u,g=this._bulkMode&&this._bulkSelected.has(this._bulkKey(e));return n`
      <div class="task-row${e.enabled?"":" task-disabled"}${g?" bulk-selected":""}${this._splitActive()&&e.entry_id===this._selectedEntryId&&e.task_id===this._selectedTaskId?" selected":""}">
        ${this._bulkMode?n`
          <label class="cell bulk-check" @click=${m=>m.stopPropagation()}>
            <input type="checkbox" .checked=${g} @change=${()=>this._toggleBulkRow(e)} />
          </label>
        `:h}
        <span class="cell-badges">
          ${this._statusBadge(e)}
          ${e.enabled?h:n`<span class="badge-disabled">${s("disabled",t)}</span>`}
          ${e.nfc_tag_id?n`<span class="nfc-badge" title="${s("nfc_linked",t)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:h}
          ${e.priority==="high"?n`<span class="priority-badge priority-high" title="${s("priority_high",t)}"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>`:h}
          ${e.priority==="low"?n`<span class="priority-badge priority-low" title="${s("priority_low",t)}"><ha-icon icon="mdi:chevron-double-down"></ha-icon></span>`:h}
        </span>
        <span class="row-head">
          <span class="cell object-name" @click=${m=>{m.stopPropagation(),this._showObject(e.entry_id)}}>${e.object_name}</span>
          <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,e.task_id)}>${this._listRef(e.entry_id,e.task_id)}${e.task_name}${Ke(e.next_event_titles)}${Ge(e.trigger_detail)}</span>
        </span>
        <span class="task-sub${p?"":" task-sub-empty"}">
          ${e.group_names.length>0?n`
            <span class="sub-chip" title="${s("groups",t)}">
              <ha-icon icon="mdi:folder-outline"></ha-icon>${e.group_names.join(", ")}
            </span>`:h}
          ${c?n`
            <span class="sub-chip">
              <ha-icon icon="mdi:map-marker-outline"></ha-icon>${c}
            </span>`:h}
          ${u?Yt(this._userService?.getPerson(e.responsible_user_id)??null,"sub-chip"):h}
          ${(e.labels||[]).map(m=>n`
            <span class="sub-chip label-chip" title="${s("labels",t)}">
              <ha-icon icon="mdi:tag-outline"></ha-icon>${m}
            </span>`)}
        </span>
        <span class="cell type">${s(e.type,t)}</span>
        <span class="due-cell" @click=${()=>this._showTask(e.entry_id,e.task_id)}>
          ${gi(e.days_until_due,e.last_performed,t)}
          ${i?n`<div class="days-bar"><div class="days-bar-fill${o?" overflow":""}" style="width:${a}%;background:${r}"></div></div>`:h}
          ${e.trigger_config?pi(e,{trend:di(e,this._miniStatsData),lang:t}):!i&&e.trigger_active?n`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:h}
          ${hi(e,this._miniStatsData,this._lang)}
        </span>
        ${this._renderRowActions(t,()=>this._openCompleteDialogForRow(e),()=>this._promptSkipTask(e.entry_id,e.task_id),e.allow_skip)}
      </div>
    `}_actionStyle(){return this._rowActionStyle}async _dismissRowActionNotice(e){let t={row_action_notice_pending:!1};e&&(t.row_action_style="icons"),await I(this,{type:"maintenance_supporter/global/update",settings:t},{onError:a=>this._showToast(a)})!==void 0&&(this._rowActionNotice=!1,e&&(this._rowActionStyle="icons"),os())}_renderRowActions(e,t,i,a=!0){let r=this._actionStyle();return r==="buttons"||r==="buttons_compact"?r==="buttons_compact"&&(this.narrow||this.tight)?n`
          <span class="row-actions as-buttons compact">
            <ha-button size="small" appearance="accent" variant="success" title="${s("complete",e)}" aria-label="${s("complete",e)}" @click=${c=>{c.stopPropagation(),t()}}>
              <ha-icon icon="mdi:check"></ha-icon>
            </ha-button>
            ${a?n`
              <ha-button size="small" appearance="outlined" variant="warning" title="${s("skip",e)}" aria-label="${s("skip",e)}" ?disabled=${this._actionLoading} @click=${c=>{c.stopPropagation(),i?.()}}>
                <ha-icon icon="mdi:skip-next"></ha-icon>
              </ha-button>`:h}
          </span>`:n`
        <span class="row-actions as-buttons">
          <ha-button size="small" appearance="accent" variant="success" title="${s("complete",e)}" @click=${c=>{c.stopPropagation(),t()}}>
            <ha-icon slot="start" icon="mdi:check"></ha-icon>${s("complete",e)}
          </ha-button>
          ${a?n`
            <ha-button size="small" appearance="outlined" variant="warning" title="${s("skip",e)}" ?disabled=${this._actionLoading} @click=${c=>{c.stopPropagation(),i?.()}}>
              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>${s("skip",e)}
            </ha-button>`:h}
        </span>`:n`
      <span class="row-actions">
        <ha-icon-button class="btn-complete" title="${s("complete",e)}" @click=${o=>{o.stopPropagation(),t()}}>
          <ha-icon icon="mdi:check"></ha-icon>
        </ha-icon-button>
        ${a?n`
          <ha-icon-button class="btn-skip" title="${s("skip",e)}" .disabled=${this._actionLoading} @click=${o=>{o.stopPropagation(),i?.()}}>
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </ha-icon-button>`:h}
      </span>`}_openCompleteDialogForRow(e){let i=this._objects.find(a=>a.entry_id===e.entry_id)?.tasks.find(a=>a.id===e.task_id);this._openCompleteDialog(e.entry_id,e.task_id,e.task_name,this._features.checklists?i?.checklist:void 0,this._features.adaptive&&!!i?.adaptive_config?.enabled)}_renderObjectDetail(){if(!this._selectedEntryId)return h;let e=this._getObject(this._selectedEntryId);if(!e)return n`<p>Object not found.</p>`;let t=e.object,i=this._lang,a=this._isOperator,r=e.tasks.filter(g=>g.archived).length,o=e.tasks.filter(g=>this._showArchived||!g.archived),c=this._arrangeObjects(this._objects.filter(g=>g.entry_id===e.entry_id||this._showArchived||!g.object.archived)),u=c.children.get(e.entry_id)??[],p=!a&&!t.archived&&!t.battery_fleet;return n`
      <div class="detail-section">
        <div class="detail-header">
          <h2>${t.name} ${qe(Se(t),s("ref_number",i))}</h2>
          <div class="action-buttons">
            ${a?h:n`
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(g=>g?.openCreate(e.entry_id))}}>${s("add_task",i)}</ha-button>
              <ha-button appearance="plain" @click=${()=>{this._ui("maintenance-object-dialog").then(g=>g?.openEdit(e.entry_id,t))}}>${s("edit",i)}</ha-button>
            `}
            <div class="more-menu-wrapper">
              <ha-icon-button .disabled=${this._actionLoading} .label=${s("more_actions",i)} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${()=>this._toggleObjMenu()}></ha-icon-button>
              ${this._objMenuOpen?n`
                <div class="popup-menu" role="menu" @keydown=${He} @click=${g=>g.stopPropagation()}>
                  <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._openQrForObject(e.entry_id,t.name)}}>${s("qr_code",i)}</div>
                  <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._printObjectReport(e.entry_id)}}>${s("report_button",i)}</div>
                  ${a?h:n`
                    ${t.battery_fleet?h:n`
                      <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._duplicateObject(e.entry_id)}}>${s("duplicate",i)}</div>
                    `}
                    ${p?n`
                      <div role="menuitem" tabindex="0" class="popup-menu-item add-sub-object-item" @click=${()=>{this._closeObjMenu(),this._toggleSubObjMenu("more")}}>${s("add_sub_object",i)}</div>
                    `:h}
                    ${t.archived?h:n`
                      <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._togglePauseObject(e.entry_id,!!t.paused)}}>${t.paused?s("resume_object",i):s("pause_object",i)}</div>
                      ${t.battery_fleet?h:n`
                        <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._replaceObject(e.entry_id,t)}}>${s("replace_object",i)}</div>
                      `}
                    `}
                    <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._toggleArchiveObject(e.entry_id,!!t.archived)}}>${t.archived?s("unarchive_object",i):s("archive_object",i)}</div>
                    <div class="popup-menu-divider"></div>
                    <div role="menuitem" tabindex="0" class="popup-menu-item danger" @click=${()=>{this._closeObjMenu(),this._deleteObject(e.entry_id)}}>${s("delete",i)}</div>
                  `}
                </div>
              `:h}
              ${this._subObjMenu==="more"&&p?this._renderSubObjMenu(e.entry_id,i):h}
            </div>
          </div>
        </div>
        ${t.paused?n`<p class="meta paused-meta">
              <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
              ${s("object_paused_badge",i)}${t.paused_until?n` — ${s("paused_until_label",i)} ${q(t.paused_until,i)}`:h}
            </p>`:h}
        ${t.manufacturer||t.model?n`<p class="meta">${[t.manufacturer,t.model].filter(Boolean).join(" ")}</p>`:h}
        ${t.serial_number?n`<p class="meta">${s("serial_number_label",i)}: ${t.serial_number}</p>`:h}
        ${this._renderLineageLink(t.predecessor_entry_id,s("object_replaces",i))}
        ${this._renderLineageLink(t.replaced_by_entry_id,s("object_replaced_by",i))}
        ${t.area_id?n`<p class="meta">${s("area",i)}:
              <a href="#" class="object-area-link" @click=${g=>{g.preventDefault(),this._showArea(t.area_id)}}
                >${Kt(t.area_id,this.hass?.areas,s("no_area",i))}</a></p>`:h}
        ${t.place?n`<p class="meta place-meta">
              <ha-icon icon="mdi:map-marker-outline"></ha-icon>
              ${s("filter_place",i)}: ${t.place_name||t.place}${t.remind_on_site?n` · ${s("remind_on_site",i)}`:h}
              ${t.place_missing?n`<span class="place-missing-badge">${s("place_missing",i)}</span>`:h}
            </p>`:h}
        ${ce(t.documentation_url)?n`<p class="meta">${s("documentation_url_label",i)}:
              <a href=${t.documentation_url} target="_blank" rel="noopener noreferrer">${t.documentation_url}</a>
            </p>`:(t.manual_docs||[]).length?n`<p class="meta">${s("documentation_url_label",i)}:
                ${t.manual_docs.slice(0,3).map((g,m)=>n`${m>0?" \xB7 ":""}<a href="#"
                    @click=${b=>{b.preventDefault(),this._openManualDoc(g)}}>${g.title}</a>`)}${t.manual_docs.length>3?n` … +${t.manual_docs.length-3}`:h}
              </p>`:h}
        ${t.installation_date?n`<p class="meta">${s("installed",i)}: ${q(t.installation_date,i)}</p>`:h}
        ${t.warranty_expiry?this._renderWarrantyMeta(t.warranty_expiry,i):h}
        ${t.notes?n`<div class="object-notes">
              <div class="object-notes-label">${s("object_notes_label",i)}</div>
              <div class="object-notes-body">${ft(t.notes)}</div>
            </div>`:h}

        ${u.length?this._renderObjectSection("children",s("sub_objects",i),u.length,()=>n`
        <h3 class="sub-objects-head"><span>${s("sub_objects",i)} (${u.length})</span>${p?n`
          <span class="sub-object-add-wrap">
            <ha-button appearance="plain" class="add-sub-object" @click=${()=>this._toggleSubObjMenu("head")}>
              <ha-icon icon="mdi:plus"></ha-icon> ${s("add_sub_object",i)}
              <ha-icon icon="mdi:menu-down"></ha-icon>
            </ha-button>
            ${this._subObjMenu==="head"?this._renderSubObjMenu(e.entry_id,i):h}
          </span>`:h}</h3>
        <div class="objects-grid sub-objects">${u.map(g=>this._renderObjectCard(g,c))}</div>
        `):h}

        ${this._renderObjectSection("tasks",s("tasks",i),o.length,()=>n`
        <h3>${s("tasks",i)} (${o.length})${r>0?n`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            appearance="plain"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?s("hide_archived",i):`${s("show_archived",i)} (${r})`}
          </ha-button>`:h}</h3>
        ${e.tasks.length===0?n`<div class="empty-state-centered">
              <p class="empty">${s("no_tasks_yet",i)}</p>
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(g=>g?.openCreate(e.entry_id))}}>${s("add_first_task",i)}</ha-button>
            </div>`:n`<div class="task-table object-tasks">${[...o].sort((g,m)=>Pe(g.status)-Pe(m.status)||(g.days_until_due??99999)-(m.days_until_due??99999)).map(g=>n`
              <div class="task-row${g.enabled?"":" task-disabled"}">
                <span class="cell-badges">
                  ${this._statusBadge(g)}
                  ${g.enabled?h:n`<span class="badge-disabled">${s("disabled",i)}</span>`}
                  ${g.nfc_tag_id?n`<span class="nfc-badge" title="${s("nfc_linked",i)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:h}
                  ${g.document_count?n`<span class="doc-badge" title="${g.document_count} ${s("documents",i)}"><ha-icon icon="mdi:paperclip"></ha-icon>${g.document_count}</span>`:h}
                </span>
                <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,g.id)}>${this._listRef(e.entry_id,g.id)}${g.name}${Ke(g.next_event_titles)}${Ge(g.trigger_detail)}</span>
                <span class="task-sub${g.responsible_user_id?"":" task-sub-empty"}">${_i(g,m=>this._userService?.getUserName(m)??null,m=>this._userService?.getPerson(m)??null)}</span>
                <span class="cell type">${s(g.type,i)}</span>
                <span class="due-cell" @click=${()=>this._showTask(e.entry_id,g.id)}>
                  ${gi(g.days_until_due,g.last_performed,i)}
                  ${g.trigger_config?pi(g,{trend:di(g,this._miniStatsData),lang:i}):h}
                  ${hi(g,this._miniStatsData,this._lang)}
                </span>
                ${this._renderRowActions(i,()=>this._openCompleteDialog(e.entry_id,g.id,g.name,this._features.checklists?g.checklist:void 0,this._features.adaptive&&!!g.adaptive_config?.enabled),()=>this._promptSkipTask(e.entry_id,g.id),g.allow_skip)}
              </div>
            `)}</div>`}
        `)}

        ${this._renderObjectSection("documents",s("documents",i),typeof t.document_count=="number"?t.document_count:null,()=>n`
        <maintenance-documents-section
          .hass=${this.hass}
          .entryId=${e.entry_id}
          .canWrite=${!a}
        ></maintenance-documents-section>
        `)}

        ${(e.parts||[]).length||!a?this._renderObjectSection("parts",s("parts_section",i),(e.parts||[]).length,()=>n`
        <maintenance-parts-section
          .hass=${this.hass}
          .entryId=${e.entry_id}
          .parts=${e.parts||[]}
          .canWrite=${!a}
          .currencySymbol=${this._currencySymbol}
          .partsCostMode=${this._partsCostMode}
          .fleet=${!!t.battery_fleet}
          @parts-changed=${()=>this._loadData()}
        ></maintenance-parts-section>
        `):h}

        ${e.tasks.some(g=>(g.times_performed||0)>0||(g.history||[]).length>0)?this._renderObjectSection("history",s("object_history_section",i),null,()=>n`
        <maintenance-object-history-section
          .hass=${this.hass}
          .entryId=${e.entry_id}
          .object=${t}
          .tasks=${e.tasks}
          .currencySymbol=${this._currencySymbol}
          .userName=${g=>this._userService?.getUserName(g)??null}
          @open-task=${g=>this._showTask(e.entry_id,g.detail.taskId)}
        ></maintenance-object-history-section>
        `):h}
      </div>
    `}_renderObjectSection(e,t,i,a){let r=this._lang,o=this._objectSectionOverride===e||!this._objectSectionsCollapsed.has(e),c=o?s("section_collapse",r):s("section_expand",r);return n`
      <div class="obj-section ${e} ${o?"open":"collapsed"}" data-section=${e}>
        <button class="obj-section-toggle" type="button"
          aria-expanded=${o?"true":"false"}
          aria-label=${c} title=${c}
          @click=${()=>this._toggleObjectSection(e)}>
          <ha-icon icon=${o?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        ${o?n`<div class="obj-section-body">${a()}</div>`:n`<h3 class="obj-section-title" @click=${()=>this._toggleObjectSection(e)}>
              ${t}${i!==null?n`<span class="obj-section-count">${i}</span>`:h}
            </h3>`}
      </div>
    `}_renderNewMenu(e){return n`
      <div class="new-menu-wrapper">
        <ha-button appearance="filled" class="new-menu-button"
          @click=${t=>{t.stopPropagation(),this._toggleNewMenu()}}>
          <ha-icon icon="mdi:plus"></ha-icon> ${s("add",e)}
          <ha-icon icon="mdi:menu-down"></ha-icon>
        </ha-button>
        ${this._newMenuOpen?n`
          <div class="popup-menu new-menu-popup" role="menu" @keydown=${He} @click=${t=>t.stopPropagation()}>
            <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._ui("maintenance-task-dialog").then(t=>t?.openCreate("",this._objects))}}>
              <ha-icon icon="mdi:clipboard-plus-outline"></ha-icon> ${s("new_task",e)}
            </div>
            <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._ui("maintenance-object-dialog").then(t=>t?.openCreate())}}>
              <ha-icon icon="mdi:package-variant-closed-plus"></ha-icon> ${s("new_object",e).replace(/^\+\s*/,"")}
            </div>
            <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._openTemplateGallery()}}>
              <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon> ${s("templates_from",e)}
            </div>
            <div class="popup-menu-divider"></div>
            <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._openAdoptProblemSensors()}}>
              <ha-icon icon="mdi:alert-circle-check-outline"></ha-icon> ${s("adopt_problem_button",e)}
            </div>
            <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._openSuggestedSetups()}}>
              <ha-icon icon="mdi:auto-fix"></ha-icon> ${s("setups_button",e)}
            </div>
            ${this._batteryFleetSetupAvailable?n`
              <div role="menuitem" tabindex="0" class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._setupBatteryFleet()}}>
                <ha-icon icon="mdi:battery-sync"></ha-icon> ${s("battery_fleet_setup_button",e)}
              </div>
            `:h}
          </div>
        `:h}
      </div>
    `}_togglePopup(e,t,i){let a=!t();i(a),this._dropPopupCloser(e),a&&setTimeout(()=>{if(!t())return;let r=()=>{i(!1),this._dropPopupCloser(e)};this._popupClosers.set(e,r),document.addEventListener("click",r)},0)}_dropPopupCloser(e){let t=this._popupClosers.get(e);t&&document.removeEventListener("click",t),this._popupClosers.delete(e)}_toggleNewMenu(){this._togglePopup("new",()=>this._newMenuOpen,e=>{this._newMenuOpen=e})}_closeNewMenu(){this._newMenuOpen=!1}_isYoungInstall(){let e=this._objects.filter(i=>!i.object?.battery_fleet),t=e.reduce((i,a)=>i+a.tasks.length,0);return e.length<3&&t<8}_gsDismissed(){try{return new Set(JSON.parse(X(A.gettingStartedDismissed)||"[]"))}catch{return new Set}}_dismissGettingStarted(e){let t=this._gsDismissed();t.add(e);try{U(A.gettingStartedDismissed,JSON.stringify([...t]))}catch{}this.requestUpdate()}_maybeLoadResetOffers(){this._resetOffersLoaded||(this._resetOffersLoaded=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/reset_offers"}).then(e=>{this._resetOffersCount=(e.offers||[]).length}).catch(()=>{this._resetOffersCount=0}))}_maybeLoadGettingStarted(){this._maybeLoadResetOffers(),!(this._gsLoaded||!this._isYoungInstall())&&(this._gsLoaded=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/discover"}).then(e=>{this._gsSetupsCount=(e.setups||[]).length}).catch(()=>{this._gsSetupsCount=0}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/problem_sensors/discover"}).then(e=>{this._gsAdoptCount=(e.sensors||[]).length}).catch(()=>{this._gsAdoptCount=0}))}_renderGettingStartedChips(e){let t=this._gsDismissed(),i=this._isYoungInstall(),a=[];return i&&this._gsSetupsCount>0&&!t.has("setups")&&a.push({id:"setups",icon:"mdi:auto-fix",text:fe("gs_setups_chip","gs_setups_chip_one",this._gsSetupsCount,e),run:()=>this._openSuggestedSetups()}),i&&this._gsAdoptCount>0&&!t.has("adopt")&&a.push({id:"adopt",icon:"mdi:alert-circle-check-outline",text:fe("gs_adopt_chip","gs_adopt_chip_one",this._gsAdoptCount,e),run:()=>this._openAdoptProblemSensors()}),this._resetOffersCount>0&&!t.has("resets")&&a.push({id:"resets",icon:"mdi:counter",text:fe("gs_reset_chip","gs_reset_chip_one",this._resetOffersCount,e),run:()=>this._openSuggestedSetups()}),this._batteryFleetSetupAvailable&&!t.has("fleet")&&a.push({id:"fleet",icon:"mdi:battery-sync",text:s("gs_fleet_chip",e),run:()=>this._setupBatteryFleet()}),a.length===0?h:n`
      <div class="gs-chips-wrap">
        <div class="gs-chips-label">${s("gs_label",e)}</div>
        <div class="gs-chips">
          ${a.map(r=>n`
            <div class="gs-chip" @click=${()=>r.run()}>
              <ha-icon icon="${r.icon}"></ha-icon>
              <span>${r.text}</span>
              <span class="gs-chip-x" title="${s("dismiss",e)}"
                @click=${o=>{o.stopPropagation(),this._dismissGettingStarted(r.id)}}>
                <ha-icon icon="mdi:close"></ha-icon>
              </span>
            </div>
          `)}
        </div>
      </div>
    `}_toggleObjMenu(){this._togglePopup("object",()=>this._objMenuOpen,e=>{this._objMenuOpen=e})}_closeObjMenu(){this._objMenuOpen=!1}_toggleMoreMenu(){this._togglePopup("more",()=>this._moreMenuOpen,e=>{this._moreMenuOpen=e})}_closeMoreMenu(){this._moreMenuOpen=!1}get _sparklineCtx(){return{lang:this._lang,detailStatsData:this._detailStatsData,hasStatsService:!!this._statsService,historyFallbackIds:this._statsService?.historyFallbackIds,isCounterEntity:$e,rangeDays:this._chartRangeDays,setRangeDays:e=>this._setChartRange(e),hideOutliers:this._hideOutliers,setHideOutliers:e=>this._setHideOutliers(e)}}_toggleSection(e){let t=new Set(this._collapsedSections);t.has(e)?t.delete(e):t.add(e),this._collapsedSections=t;try{U(A.collapsedSections,JSON.stringify([...t]))}catch{}}_historyCtx(){let e=this._selectedEntryId&&this._selectedTaskId?this._getObject(this._selectedEntryId)?.tasks.find(r=>r.id===this._selectedTaskId):void 0,t=this._fullHistory,i=t&&t.entryId===this._selectedEntryId&&t.taskId===this._selectedTaskId&&t.entries.length>(e?.history||[]).length?t.entries:e?.history||[],a=i.filter(r=>r.reading_value!=null).sort((r,o)=>r.timestamp.localeCompare(o.timestamp));return{lang:this._lang,hass:this.hass,filter:this._historyFilter,search:this._historySearch,currencySymbol:this._currencySymbol,setFilter:r=>{this._historyFilter=r},setSearch:r=>{this._historySearch=r},openEdit:this._isOperator?void 0:r=>this._openHistoryEdit(r),readingUnit:e?.reading_unit??null,taskRef:Ee(this._selectedEntryId?this._getObject(this._selectedEntryId)?.object:null,e),phaseNames:Object.fromEntries(Object.entries(e?.phases||{}).map(([r,o])=>[r,o.name])),readingDelta:r=>{let o=a.findIndex(c=>c.timestamp===r.timestamp);return o<=0?null:r.reading_value-a[o-1].reading_value},readingSlotDelta:(r,o)=>Ni(i,r,o)}}_taskDetailCtx(){let e=this._selectedEntryId,t=this._selectedTaskId,i=this._getObject(e);return{lang:this._lang,hass:this.hass,entryId:e,taskId:t,objectName:i?.object.name||"",taskRef:Ee(i?.object,i?.tasks.find(a=>a.id===t)),objectDocUrl:i?.object?.documentation_url??null,objectManualDocs:i?.object?.manual_docs??[],openManualDoc:a=>this._openManualDoc(a),setChecklistItem:(a,r)=>this._setChecklistItem(e,t,a,r),setPhaseCursor:a=>{this._runAction({type:"maintenance_supporter/task/set_phase",entry_id:e,task_id:t,cursor:a})},isOperator:this._isOperator,actionLoading:this._actionLoading,moreMenuOpen:this._moreMenuOpen,activeTab:this._activeTab,features:this._features,mirrorTodoDefault:this._mirrorTodoDefault,currencySymbol:this._currencySymbol,collapsedSections:this._collapsedSections,costDurationToggle:this._costDurationToggle,suggestionDismissed:this._dismissedSuggestions.has(`${e}_${t}`),sparkline:this._sparklineCtx,history:this._historyCtx(),getUserName:a=>this._userService?.getUserName(a)??null,getPerson:a=>this._userService?.getPerson(a)??null,setActiveTab:a=>{this._activeTab=a},toggleSection:a=>this._toggleSection(a),setCostDurationToggle:a=>{this._costDurationToggle=a},showTaskView:()=>this._showFullTaskPage(e,t),showObject:()=>this._showObject(e),toggleMoreMenu:()=>this._toggleMoreMenu(),closeMoreMenu:()=>this._closeMoreMenu(),openEdit:a=>{this._ui("maintenance-task-dialog").then(r=>r?.openEdit(e,a))},openComplete:a=>this._openCompleteDialog(e,t,a.name,this._features.checklists?a.checklist:void 0,this._features.adaptive&&!!a.adaptive_config?.enabled),promptSkip:()=>this._promptSkipTask(e,t),toggleArchive:a=>this._toggleArchiveTask(e,t,a),togglePause:a=>this._togglePauseTask(e,t,a),openQr:a=>this._openQrForTask(e,t,i?.object.name||"",a),duplicateTask:()=>this._duplicateTask(e,t),moveTask:()=>this._moveTask(e,t),promptReset:()=>this._promptResetTask(e,t),promptPostpone:()=>this._promptPostponeTask(e,t),snoozeTask:()=>this._snoozeTask(e,t),printWorksheet:()=>this._printTaskWorksheet(e,t),deleteTask:()=>this._deleteTask(e,t),applySuggestion:a=>this._applySuggestion(e,t,a),reanalyze:()=>this._reanalyzeInterval(e,t),dismissSuggestion:()=>this._dismissSuggestion(e,t),openSeasonalOverrides:a=>this._openSeasonalOverrides(a)}}async _fetchFullHistory(e,t){let i;try{i=await wt(this.hass,e,t)}catch{i=null}this._selectedEntryId===e&&this._selectedTaskId===t&&(this._fullHistory=i?{entryId:e,taskId:t,entries:i}:null)}_renderTaskDetail(){if(!this._selectedEntryId||!this._selectedTaskId)return h;let e=this._getTask(this._selectedEntryId,this._selectedTaskId);if(!e)return n`<p>Task not found.</p>`;let t=this._fullHistory,i=t&&t.entryId===this._selectedEntryId&&t.taskId===this._selectedTaskId&&t.entries.length>(e.history||[]).length?{...e,history:t.entries}:e;return n`<maintenance-task-detail-view
      .task=${i}
      .ctx=${this._taskDetailCtx()}
    ></maintenance-task-detail-view>`}_openHistoryEdit(e){if(!this._selectedEntryId||!this._selectedTaskId)return;let t=this._getTask(this._selectedEntryId,this._selectedTaskId),i=ds(this._selectedEntryId,this._selectedTaskId,e,t);this.shadowRoot?.querySelector("maintenance-history-edit-dialog")?.openEdit(i)}};w.styles=[gt,zs],_([S({attribute:!1})],w.prototype,"hass",2),_([S({type:Boolean,reflect:!0})],w.prototype,"narrow",2),_([S({type:Boolean,reflect:!0})],w.prototype,"tight",2),_([S({type:Boolean,reflect:!0})],w.prototype,"split",2),_([S({attribute:!1})],w.prototype,"panel",2),_([S({type:Boolean,reflect:!0})],w.prototype,"embedded",2),_([S({attribute:!1})],w.prototype,"presets",2),_([f()],w.prototype,"_objects",2),_([f()],w.prototype,"_stats",2),_([f()],w.prototype,"_view",2),_([f()],w.prototype,"_allParts",2),_([f()],w.prototype,"_selectedEntryId",2),_([f()],w.prototype,"_selectedTaskId",2),_([f()],w.prototype,"_selectedAreaId",2),_([f()],w.prototype,"_filterStatus",2),_([f()],w.prototype,"_filterUser",2),_([f()],w.prototype,"_filterLabel",2),_([f()],w.prototype,"_filterPlace",2),_([f()],w.prototype,"_filterPriority",2),_([f()],w.prototype,"_savedViews",2),_([f()],w.prototype,"_activeViewId",2),_([f()],w.prototype,"_unsub",2),_([f()],w.prototype,"_chartRangeDays",2),_([f()],w.prototype,"_hideOutliers",2),_([f()],w.prototype,"_historyFilter",2),_([f()],w.prototype,"_budget",2),_([f()],w.prototype,"_groups",2),_([f()],w.prototype,"_detailStatsData",2),_([f()],w.prototype,"_miniStatsData",2),_([f()],w.prototype,"_features",2),_([f()],w.prototype,"_adminPanelUserIds",2),_([f()],w.prototype,"_operatorWriteEnabled",2),_([f()],w.prototype,"_defaultWarningDays",2),_([f()],w.prototype,"_mirrorTodoDefault",2),_([f()],w.prototype,"_rowActionStyle",2),_([f()],w.prototype,"_refsInLists",2),_([f()],w.prototype,"_partsCostMode",2),_([f()],w.prototype,"_rowActionNotice",2),_([f()],w.prototype,"_actionLoading",2),_([f()],w.prototype,"_moreMenuOpen",2),_([f()],w.prototype,"_objMenuOpen",2),_([f()],w.prototype,"_subObjMenu",2),_([f()],w.prototype,"_toastMessage",2),_([f()],w.prototype,"_toastKind",2),_([f()],w.prototype,"_toastUndo",2),_([f()],w.prototype,"_toastActionLabel",2),_([f()],w.prototype,"_filtersOpen",2),_([f()],w.prototype,"_newMenuOpen",2),_([f()],w.prototype,"_gsSetupsCount",2),_([f()],w.prototype,"_gsAdoptCount",2),_([f()],w.prototype,"_resetOffersCount",2),_([f()],w.prototype,"_batteryFleetSetupAvailable",2),_([f()],w.prototype,"_staleBundle",2),_([f()],w.prototype,"_restartPendingVersion",2),_([f()],w.prototype,"_overviewTab",2),_([f()],w.prototype,"_activeTab",2),_([f()],w.prototype,"_costDurationToggle",2),_([f()],w.prototype,"_historySearch",2),_([f()],w.prototype,"_sortMode",2),_([f()],w.prototype,"_objectSortMode",2),_([f()],w.prototype,"_groupByMode",2),_([f()],w.prototype,"_objectViewMode",2),_([f()],w.prototype,"_objectsTableColumns",2),_([f()],w.prototype,"_showArchived",2),_([f()],w.prototype,"_bulkMode",2),_([f()],w.prototype,"_bulkSelected",2),_([f()],w.prototype,"_objBulkMode",2),_([f()],w.prototype,"_objBulkSelected",2),_([f()],w.prototype,"_bulkMenuOpen",2),_([f()],w.prototype,"_virtStart",2),_([f()],w.prototype,"_virtEnd",2),_([f()],w.prototype,"_collapsedGroups",2),_([f()],w.prototype,"_collapsedSections",2),_([f()],w.prototype,"_objectSectionsCollapsed",2),_([f()],w.prototype,"_objectSectionOverride",2),_([f()],w.prototype,"_objTreeOpen",2),_([f()],w.prototype,"_paletteOpen",2),_([f()],w.prototype,"_paletteQuery",2),_([f()],w.prototype,"_paletteActive",2),_([f()],w.prototype,"_searchRemote",2),_([f()],w.prototype,"_templateGalleryOpen",2),_([f()],w.prototype,"_templates",2),_([f()],w.prototype,"_homeProfile",2),_([f()],w.prototype,"_templateCategories",2),_([f()],w.prototype,"_templateBusy",2),_([f()],w.prototype,"_templateParentId",2),_([f()],w.prototype,"_fullHistory",2),w=_([yi("maintenance-supporter-panel")],w);export{w as MaintenanceSupporterPanel};
