/*! maintenance_supporter frontend 2.103.5 */
import{a as _i,b as fi,c as vi,g as ki}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YFTMDMJ3.js";import{a as w}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6C3PPBVK.js";import{a as Ei,b as Ri,c as Oi,d as _t,e as Ci,f as Pt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-NJYYC6OV.js";import{A as Xi,B as Ji,C as Zi,D as es,E as ts,F as xt,G as is,H as ss,I as as,J as rs,K as ns,R as os,U as ls,a as ce,b as si,c as Se,d as je,e as nt,f as He,g as gt,h as yi,i as xi,j as mt,k as $i,l as Si,m as O,n as Je,o as Oe,p as ue,q as qi,r as Bt,s as bt,t as Nt,u as Fi,v as yt,w as Ui,x as Vi,y as Yi,z as Qi}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-VNFF7YAL.js";import{f as Hi,g as Ne,i as Bi,j as vt,k as Ni}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-63HNTYGT.js";import{a as ft}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6DGQ37XW.js";import{a as mi,b as pt,c as Ee,d as ht,e as Qe,f as ut}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-4GTVLOBO.js";import{a as rt,c as Le}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-FLZMUCVY.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-Q6TXXML2.js";import{a as qt,b as me}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-XG4REMPM.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-6WZRNPFA.js";import{a as zi,b as Li}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-JZZTH2AG.js";import{c as Pi}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6CZO3XPW.js";import{a as A,b as Z,c as V}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ED6CQ4TB.js";import{c as ji,d as Ti,e as Re}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-G2CSQOQG.js";import{b as bi,i as wi}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-DIRVBGMO.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-T2ML3ISH.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-TEKG2PEC.js";import{a as zt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ABAZPJDT.js";import{c as Mi,d as Lt,e as Di}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-PHOGZTOD.js";import{l as Xe}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-RJ4GHD3L.js";import{a as Wi,b as Ki,c as Gi}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6QTVA2HO.js";import{a as P,b as Ai,c as Ii,d as Ht}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-MBMHS7GD.js";import{$ as ze,B as ve,C as It,E as Te,F as di,G as lt,H as Be,I as K,J as We,L as se,M as U,N as Ke,P as q,Q as pi,S as ke,T as ct,U as hi,V as Ge,Y as ui,Z as gi,a as _,aa as Ye,b as B,c as n,d as Q,da as dt,f as h,h as N,i as Dt,j as ai,k as ri,l as ni,m as R,n as f,o as ot,p as oi,q as De,t as a,u as At,v as ne,x as li,y as ci,z as xe}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-IVHO27NW.js";var Fs=["assignee_pool","required_completion_fields","checklist","labels","mirror_todo_entities","next_event_titles","history","readings"],Us=["checklist_progress"],Vs=["tasks","parts"],Ws=["manual_docs","battery_fleet_excluded"];function Ft(l,d,e=[]){for(let t of d)l[t]===void 0&&(l[t]=[]);for(let t of e)l[t]===void 0&&(l[t]={})}function Ks(l){let d=l;Ft(d,Vs),d.object&&typeof d.object=="object"&&Ft(d.object,Ws);for(let e of d.tasks)Ft(e,Fs,Us);return l}function Ze(l){for(let d of l)Ks(d);return l}function Gs(l,d){if(d.objects)return d.objects;let e=d.delta||[],t=d.removed||[];if(!e.length&&!t.length)return null;let i=new Map(l.map(s=>[s.entry_id,s]));for(let s of e)i.set(s.entry_id,s);for(let s of t)i.delete(s);return[...i.values()]}function cs(l,d){return d.objects&&Ze(d.objects),d.delta&&Ze(d.delta),Gs(l,d)}var Ut=["today","dashboard","calendar","settings"];var Ys=168*3600*1e3;function ds(){try{let l=Z(A.objectsCache);if(!l)return null;let d=JSON.parse(l);return d.v!==Dt||!Number.isFinite(d.at)||Date.now()-d.at>Ys||!Array.isArray(d.objects)||d.objects.length===0?null:{objects:d.objects,stats:d.stats??null}}catch{return null}}function Vt(l,d){if(!(!Array.isArray(l)||l.length===0))try{let e={v:Dt,at:Date.now(),objects:l,stats:d};V(A.objectsCache,JSON.stringify(e))}catch{}}function et(l){return l.responsible_user_id?[l.responsible_user_id]:[...new Set((l.assignee_pool||[]).filter(d=>typeof d=="string"&&d))]}function tt(l,d){return!!d&&et(l).includes(d)}var Qs={days:1,weeks:7,months:30.4368,years:365.25};function Wt(l,d){return!l||l<=0?0:l*(Qs[d||"days"]??1)}function kt(l,d,e){let t=Wt(l,e);if(t<=0||d==null)return{pct:0,overflow:!1};let i=(t-d)/t*100;return{pct:Math.max(0,Math.min(100,i)),overflow:i>100}}function ps(l,d,e,t,i,s){let r=[[e.manufacturer,l.manufacturer],[e.model,l.model],[e.serial,l.serial_number],[e.installed,l.installation_date?t(l.installation_date):null],[e.warranty,l.warranty_expiry?t(l.warranty_expiry):null]].filter(([,u])=>!!u),c=d.map(u=>{let p=e.scheduleLabel(u);return`<tr>
      <td>${w(u.name)}</td>
      <td>${w(e.typeLabel(u.type))}</td>
      <td>${w(e.statusLabel(u.status))}</td>
      <td>${w(p)}</td>
      <td>${w(u.last_performed?t(u.last_performed):e.none)}</td>
      <td>${w(u.next_due?t(u.next_due):e.none)}</td>
      <td class="num">${u.times_performed??0}</td>
      <td class="num">${w(i(u.total_cost??0))}</td>
    </tr>`}).join(""),o=d.reduce((u,p)=>u+(p.total_cost??0),0);return`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${w(e.title)} \u2014 ${w(l.name)}</title>
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
  <h1>${w(l.name)}</h1>
  <p class="sub">${w(e.title)} \xB7 ${w(e.generated)}: ${w(t(s))}</p>
  ${r.length?`<div class="meta">${r.map(([u,p])=>`<div><div class="k">${w(u)}</div>${w(p)}</div>`).join("")}</div>`:""}
  <h2>${w(e.tasksHeading)} (${d.length})</h2>
  <table>
    <thead><tr>
      <th>${w(e.colTask)}</th><th>${w(e.colType)}</th><th>${w(e.colStatus)}</th>
      <th>${w(e.colSchedule)}</th><th>${w(e.colLastDone)}</th><th>${w(e.colNextDue)}</th>
      <th class="num">${w(e.colTimes)}</th><th class="num">${w(e.colCost)}</th>
    </tr></thead>
    <tbody>${c||`<tr><td colspan="8">${w(e.none)}</td></tr>`}</tbody>
    <tfoot><tr><td colspan="7">${w(e.totalCost)}</td><td class="num">${w(i(o))}</td></tr></tfoot>
  </table>
  ${l.notes?`<div class="notes"><strong>${w(e.notes)}:</strong>
${w(l.notes)}</div>`:""}
</body></html>`}var Xs=60;function Kt(l,d=xe()){if(!l)return{kind:"none",days:null,date:null};let e=di(d,l);return Number.isFinite(e)?e<0?{kind:"expired",days:e,date:l}:e<=Xs?{kind:"expiring",days:e,date:l}:{kind:"valid",days:e,date:l}:{kind:"none",days:null,date:null}}function Js(l,d){let e=Date.parse(l);return Number.isNaN(e)?l.slice(0,10):d(ci(e,li()))}var L=l=>String(l??"").replace(/[&<>"']/g,d=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[d]);function hs(l,d,e,t,i,s,r,c,o,u=[],p=null){let g=[[e.object,L(d)],[e.type,L(e.typeLabel(l.type))],[e.interval,L(i(l))],[e.nextDue,l.next_due?L(t(l.next_due)):"\u2014"],[e.lastDone,l.last_performed?L(t(l.last_performed)):L(e.never)]];l.priority&&l.priority!=="normal"&&g.push([e.priority,L(l.priority)]);let m=(l.checklist||[]).map(y=>`<li><span class="box"></span>${L(y)}</li>`).join(""),v=(y,E)=>y?`<figure class="qr"><img src="${y}" alt="" /><figcaption>${L(E)}</figcaption></figure>`:"";return`<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="color-scheme" content="light">
<title>${L(l.name)} \u2014 ${L(e.title)}</title>
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
      <h1>${L(l.name)}${p?` <span class="ref">#${L(p)}</span>`:""}</h1>
      <div class="obj">${L(d)}</div>
    </div>
    <div class="qr-row">
      ${v(s,e.scanView)}
      ${v(r,e.scanComplete)}
    </div>
  </header>
  <table class="meta">
    ${g.map(([y,E])=>`<tr><td>${L(y)}</td><td>${E}</td></tr>`).join("")}
  </table>
  ${m?`<h2>${L(e.checklist)}</h2><ul class="check">${m}</ul>`:""}
  ${u.length?`<h2>${L(e.parts)}</h2><ul class="check">${u.map(y=>`<li><span class="box"></span>${L(y)}</li>`).join("")}</ul>`:""}
  ${l.notes?`<h2>${L(e.notes)}</h2><div class="notes">${L(l.notes)}</div>`:""}
  ${c?`<h2>${L(e.manualExcerpt)}</h2>
    <div class="excerpt">${L(c.title)} \u2014 ${L(e.pages)} ${c.startPage}\u2013${c.endPage}:
      <a href="${L(c.url)}" target="_blank" rel="noopener">PDF</a>
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
  <footer>${L(d)} \xB7 ${L(l.name)} \xB7 ${L(e.printedOn)} ${L(Js(o,t))}</footer>
</body></html>`}var Ae=["manual","warranty","invoice","spare_parts","photo","other"],wt={manual:"mdi:book-open-variant",warranty:"mdi:shield-check",invoice:"mdi:receipt-text-outline",spare_parts:"mdi:cog-outline",photo:"mdi:image-outline",other:"mdi:file-document-outline"};function oe(l){return l.title||l.filename||l.url||""}function qe(l){return(l.tags||[]).find(d=>Ae.includes(d))??"other"}function us(l){return(l.tags||[]).includes("photo")}function Fe(l){let d=(l??[]).filter(e=>!!e);return d.length?n`<span class="event-titles"> · ${d.join(", ")}</span>`:h}var gs=B`
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
  .area-bar-fill.credit { background: var(--success-color, #43a047); border-radius: 0 0 4px 4px; }
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
`;var $t=class{constructor(d){this._cache=new Map;this._pending=new Map;this.historyFallbackIds=new Set;this._hass=d}updateHass(d){this._hass=d}async getDetailStats(d,e,t=30){return this._getStats(d,t<=35?"hour":"day",t,e)}async getMiniStats(d,e){return this._getStats(d,"day",14,e)}async getBatchMiniStats(d){let e=new Map,t=[];for(let o of d){let u=`${o.entityId}:day:14`,p=this._cache.get(u);p&&Date.now()-p.fetchedAt<3e5?e.set(o.entityId,p.points):t.push(o)}if(t.length===0)return e;let i=t.filter(o=>o.isCounter).map(o=>o.entityId),s=t.filter(o=>!o.isCounter).map(o=>o.entityId),r=new Date(Date.now()-336*60*60*1e3).toISOString(),c=[];return i.length>0&&c.push(this._fetchBatch(i,"day",r,["state","sum","change"],!0,e)),s.length>0&&c.push(this._fetchBatch(s,"day",r,["mean","min","max"],!1,e)),await Promise.all(c),e}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(d,e,t,i){let s=`${d}:${e}:${t}`,r=this._cache.get(s);if(r&&Date.now()-r.fetchedAt<3e5)return r.points;if(this._pending.has(s))return this._pending.get(s);let c=this._fetchAndNormalize(d,e,t,i,s);this._pending.set(s,c);try{return await c}finally{this._pending.delete(s)}}async _fetchAndNormalize(d,e,t,i,s){let r=new Date(Date.now()-t*24*60*60*1e3).toISOString(),c=i?["state","sum","change"]:["mean","min","max"];try{let u=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:r,statistic_ids:[d],period:e,types:c}))[d]||[],p=this._normalizeRows(u,i);if(p.length<2){let g=await this._fetchHistoryFallback(d,r);g.length>=2?(p=g,this.historyFallbackIds.add(d)):this.historyFallbackIds.delete(d)}else this.historyFallbackIds.delete(d);return this._cache.set(s,{entityId:d,fetchedAt:Date.now(),period:e,points:p}),p}catch(o){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${d}:`,o),[]}}async _fetchHistoryFallback(d,e){try{let i=(await this._hass.connection.sendMessagePromise({type:"history/history_during_period",start_time:e,end_time:new Date().toISOString(),entity_ids:[d],minimal_response:!0,no_attributes:!0}))?.[d]||[];if(i.length>1e3){let c=Math.ceil(i.length/500);i=i.filter((o,u)=>u%c===0||u===i.length-1)}let s=[],r=null;for(let c of i){let o=c.s??c.state;if(o==null||o==="unknown"||o==="unavailable")continue;let u;if(o==="on"||o==="open"||o==="true")u=1;else if(o==="off"||o==="closed"||o==="false")u=0;else if(u=parseFloat(o),!Number.isFinite(u))continue;let p=c.lu??c.last_updated??c.last_changed,g=typeof p=="number"?p*1e3:p!=null?Date.parse(p):NaN;Number.isFinite(g)&&(r!=null&&r!==u&&s.push({ts:g,val:r}),s.push({ts:g,val:u}),r=u)}return s.sort((c,o)=>c.ts-o.ts),s.length&&r!=null&&s.push({ts:Date.now(),val:r}),s}catch(t){return console.warn(`[maintenance-supporter] History fallback failed for ${d}:`,t),[]}}async _fetchBatch(d,e,t,i,s,r){try{let c=await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:t,statistic_ids:d,period:e,types:i});for(let o of d){let u=c[o]||[],p=this._normalizeRows(u,s);r.set(o,p),this._cache.set(`${o}:${e}:14`,{entityId:o,fetchedAt:Date.now(),period:e,points:p})}}catch(c){console.warn("[maintenance-supporter] Batch statistics fetch failed:",c)}}_normalizeRows(d,e){let t=[];for(let i of d){let s=null;if(e?s=i.state??null:s=i.mean??null,s===null)continue;let r={ts:i.start,val:s};e||(i.min!=null&&(r.min=i.min),i.max!=null&&(r.max=i.max)),t.push(r)}return t.sort((i,s)=>i.ts-s.ts),t}};function we(l,d){let e=l??0;return e<1024?`${e} B`:e<1024*1024?`${se(e/1024,d,1)} KB`:`${se(e/(1024*1024),d,1)} MB`}var St=8,Gt=["newest","oldest","title","category"];function Yt(l){return Gt.includes(l??"")?l:"newest"}function ms(l,d){let e=new Intl.Collator(void 0,{numeric:!0,sensitivity:"base"}),t=c=>oe(c).trim(),i=(c,o)=>e.compare(t(c),t(o)),s=c=>c.kind==="weblink"?Ae.length+1:Ae.indexOf(qe(c)),r=[...l];switch(d){case"oldest":return r.sort((c,o)=>(c.added_at||"").localeCompare(o.added_at||""));case"title":return r.sort(i);case"category":return r.sort((c,o)=>s(c)-s(o)||i(c,o));default:return r.sort((c,o)=>(o.added_at||"").localeCompare(c.added_at||""))}}function jt(l,d){let e=rt(d);if(!e.length)return l;let t=[];for(let i of l){let s=Le(e,[{text:i.title,weight:3},{text:i.filename,weight:2},{text:(i.tags||[]).join(" "),weight:2},{text:i.description,weight:2},{text:i.url,weight:1}]);s>0&&t.push({doc:i,score:s})}return t.sort((i,s)=>s.score-i.score).map(i=>i.doc)}var F=class extends N{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._filter="";this._loaded=!1;this._busy=!1;this._error="";this._hint="";this._addingLink=!1;this._linkUrl="";this._linkTitle="";this._category="manual";this._thumbs={};this._lightboxUrl="";this._editingId="";this._editTitle="";this._editCategory="manual";this._editDescription="";this._linkDescription="";this._sort=Yt(Z(A.docSort));this._dragOver=!1;this._loadedFor=null;this._loadSeq=0;this._localeReady=!1;this._singlePick=zi()}_isImage(e){return e.kind==="file"&&(e.mime||"").startsWith("image/")}async _sign(e){return pt(this.hass,e.id)}get _lang(){return K(this.hass)}updated(e){if(super.updated(e),this.hass&&!this._localeReady&&(this._localeReady=!0,ne(this._lang).then(()=>this.requestUpdate())),this.hass&&this.entryId&&this._loadedFor!==this.entryId){let t=this._loadedFor!==null;this._loadedFor=this.entryId,t&&this._resetForObject(),this._load()}}_resetForObject(){this._docs=[],this._loaded=!1,this._thumbs={},this._filter="",this._error="",this._hint="",this._addingLink=!1,this._linkUrl="",this._linkTitle="",this._linkDescription="",this._editingId="",this._lightboxUrl=""}async _load(){let e=this.entryId,t=++this._loadSeq,i=()=>t!==this._loadSeq||e!==this.entryId,s="",r=await P(this,{type:"maintenance_supporter/documents/list",entry_id:e},{onError:c=>{s=c}});if(!i()){if(this._loaded=!0,r===void 0){this._error=s;return}this._docs=r?.documents||[],this._error="",this._thumbs={},this._loadThumbs(i)}}async _write(e,t,i){this._error="",await P(this,e,{busy:s=>{this._busy=s},fallbackKey:i,reload:async()=>{t?.(),await this._load()},onError:s=>{this._error=s}})}async _signed(e){await P(this,e,{onError:t=>{this._error=t}})}async _loadThumbs(e=()=>!1){await Promise.all(this._docs.filter(t=>this._isImage(t)).map(async t=>{try{let i=await this._sign(t);if(e())return;this._thumbs={...this._thumbs,[t.id]:i}}catch{}}))}_category_of(e){return qe(e)}_labelKeydown(e){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),e.currentTarget.querySelector("input")?.click())}_onFileInput(e){let t=e.target,i=Array.from(t.files??[]);i.length&&this._uploadFiles(i),t.value=""}_onDrop(e){if(e.preventDefault(),this._dragOver=!1,!this.canWrite||this._busy)return;let t=Array.from(e.dataTransfer?.files??[]);t.length&&this._uploadFiles(t)}_onDragOver(e){this.canWrite&&(e.preventDefault(),this._dragOver=!0)}_onDragLeave(e){let t=e.relatedTarget;(!t||!e.currentTarget.contains(t))&&(this._dragOver=!1)}async _uploadFiles(e,t){let i=t??this._category,s=this.entryId;this._busy=!0,this._error="",this._hint="";let r=0,c=0,o=[];try{for(let u of e){let p;try{p=await Pi(this.hass,s,u,[i])}catch(g){let m=g instanceof Error&&g.message==="doc_too_large"?"doc_too_large":"doc_upload_failed";o.push(`${u.name}: ${a(m,this._lang)}`);continue}p.duplicate_in_object?c++:p.deduped&&r++}if(s!==this.entryId)return;c?this._hint=a("doc_dup_in_object",this._lang):r&&(this._hint=a("doc_deduped",this._lang)),await this._load()}finally{o.length&&s===this.entryId&&(this._error=o.join(" \xB7 ")),this._busy=!1}}async _download(e){await this._signed(()=>ht(this.hass,e.id,e.filename||e.title||"document"))}async _preview(e){if(this._isImage(e)){this._lightboxUrl=this._thumbs[e.id]||await this._sign(e);return}await this._signed(()=>Ee(this.hass,e.id))}_openDoc(e){e.kind==="file"?this._preview(e):ce(e.url)&&window.open(e.url,"_blank","noopener")}_startEdit(e){this._editingId=e.id,this._editTitle=e.title||"",this._editCategory=this._category_of(e),this._editDescription=e.description||"",this._addingLink=!1,this._error=""}_cancelEdit(){this._editingId=""}_setSort(e){this._sort=Yt(e),V(A.docSort,this._sort)}async _saveEdit(e){let t=(e.tags||[]).filter(s=>!Ae.includes(s)),i=e.kind==="file"?[this._editCategory,...t]:e.tags??[];await this._write({type:"maintenance_supporter/documents/update",doc_id:e.id,title:this._editTitle.trim()||e.filename||e.url||"",tags:i,description:this._editDescription.trim()},()=>{this._editingId=""})}async _delete(e){let t=oe(e);window.confirm(a("doc_delete_confirm",this._lang).replace("{name}",t))&&await this._write({type:"maintenance_supporter/documents/delete",doc_id:e.id})}async _addLink(){let e=this._linkUrl.trim();if(!e)return;let t=this.entryId;await this._write({type:"maintenance_supporter/documents/add_link",entry_id:t,url:e,title:this._linkTitle.trim()||null,description:this._linkDescription.trim()||null},()=>{this._linkUrl="",this._linkTitle="",this._linkDescription="",this._addingLink=!1},"doc_link_not_allowed")}render(){let e=this._lang;return n`
      <div
        class="doc-zone ${this._dragOver?"drag-over":""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}
      >
        ${this._dragOver&&this.canWrite?n`<div class="drop-overlay">
              <ha-icon icon="mdi:tray-arrow-down"></ha-icon> ${a("doc_drop_hint",e)}
            </div>`:h}
      <div class="doc-header">
        <h3>${a("documents",e)} (${this._docs.length})</h3>
        ${this.canWrite?n`
              <div class="doc-actions">
                <select
                  class="cat-select"
                  .value=${this._category}
                  ?disabled=${this._busy}
                  @change=${t=>this._category=t.target.value}
                >
                  ${Ae.map(t=>n`<option value=${t}>${a(`doc_cat_${t}`,e)}</option>`)}
                </select>
                <label
                  class="btn primary ${this._busy?"disabled":""}"
                  role="button"
                  tabindex="0"
                  @keydown=${this._labelKeydown}
                >
                  <ha-icon icon="mdi:upload"></ha-icon>
                  ${this._busy?a("doc_uploading",e):a("doc_upload",e)}
                  <input type="file" ?multiple=${!this._singlePick} hidden ?disabled=${this._busy} @change=${this._onFileInput} />
                </label>
                <ms-photo-picker compact .showGallery=${!1} .lang=${e} .disabled=${this._busy}
                  @files-picked=${t=>this._uploadFiles(t.detail.files,"photo")}
                ></ms-photo-picker>
                <button class="btn" ?disabled=${this._busy} @click=${()=>this._addingLink=!this._addingLink}>
                  <ha-icon icon="mdi:link-variant"></ha-icon> ${a("doc_add_link",e)}
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
                placeholder=${a("doc_link_url",e)}
                .value=${this._linkUrl}
                ?disabled=${this._busy}
                @input=${t=>this._linkUrl=t.target.value}
              />
              <input
                type="text"
                placeholder=${a("doc_link_title",e)}
                .value=${this._linkTitle}
                ?disabled=${this._busy}
                @input=${t=>this._linkTitle=t.target.value}
              />
              <input
                type="text"
                class="link-desc"
                placeholder=${a("doc_description",e)}
                .value=${this._linkDescription}
                ?disabled=${this._busy}
                @input=${t=>this._linkDescription=t.target.value}
              />
              <button class="btn primary" ?disabled=${this._busy||!this._linkUrl.trim()} @click=${this._addLink}>
                ${a("add",e)}
              </button>
              <button class="btn" ?disabled=${this._busy} @click=${()=>this._addingLink=!1}>
                ${a("cancel",e)}
              </button>
            </div>
          `:h}

      ${this._loaded&&this._docs.length>=2?n`<div class="doc-tools">
            <ha-icon icon="mdi:sort"></ha-icon>
            <select class="sort-select" aria-label=${a("doc_sort",e)} .value=${this._sort}
              @change=${t=>this._setSort(t.target.value)}>
              ${Gt.map(t=>n`<option value=${t} ?selected=${t===this._sort}>${a(`doc_sort_${t}`,e)}</option>`)}
            </select>
          </div>`:h}
      ${this._loaded&&this._docs.length>=St?n`<div class="doc-filter">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input type="search" aria-label=${a("doc_search",e)} placeholder=${a("doc_search",e)}
              .value=${this._filter} @input=${t=>this._filter=t.target.value} />
          </div>`:h}
      ${this._loaded?this._docs.length===0?n`<div class="doc-empty">${a("documents_empty",e)}</div>`:(()=>{let t=this._filter.trim()?jt(this._docs,this._filter):ms(this._docs,this._sort);return t.length===0?n`<div class="doc-empty">${a("doc_search_none",e)}</div>`:n`<div class="doc-list">${t.map(i=>this._renderDoc(i,e))}</div>`})():n`<div class="doc-empty">${a("loading",e)}</div>`}

      ${this._lightboxUrl?n`<div class="lightbox" @click=${()=>this._lightboxUrl=""}>
            <img class="lightbox-img" src=${this._lightboxUrl} @click=${t=>t.stopPropagation()} />
            <button class="lightbox-close" title=${a("doc_close",e)} @click=${()=>this._lightboxUrl=""}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>`:h}
      </div>
    `}_renderDoc(e,t){if(this._editingId===e.id)return this._renderEdit(e,t);let i=e.kind==="file",s=this._category_of(e),r=i?`${a(`doc_cat_${s}`,t)} \xB7 ${we(e.size,t)}`:a("doc_link_badge",t),c=this._thumbs[e.id];return n`
      <div class="doc-row">
        ${i&&c?n`<img
              class="doc-thumb"
              src=${c}
              alt=${e.title||""}
              title=${a("doc_open",t)}
              @click=${()=>this._preview(e)}
            />`:n`<ha-icon
              class="doc-icon ${i?"clickable":""}"
              icon=${i?wt[s]:"mdi:link-variant"}
              @click=${()=>i&&this._preview(e)}
            ></ha-icon>`}
        <div
          class="doc-info"
          role="button"
          tabindex="0"
          title=${a("doc_open",t)}
          @click=${()=>this._openDoc(e)}
          @keydown=${o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),this._openDoc(e))}}
        >
          <div class="doc-title">${oe(e)}</div>
          <div class="doc-meta">${r}</div>
          ${e.description?n`<div class="doc-desc">${e.description}</div>`:h}
        </div>
        <div class="doc-row-actions">
          ${i?n`
                <button class="icon-btn" title=${a("doc_open",t)} @click=${()=>this._preview(e)}>
                  <ha-icon icon="mdi:eye-outline"></ha-icon>
                </button>
                <button class="icon-btn" title=${a("doc_download",t)} @click=${()=>this._download(e)}>
                  <ha-icon icon="mdi:download"></ha-icon>
                </button>`:n`<a
                class="icon-btn"
                href=${ce(e.url)?e.url:"#"}
                target="_blank"
                rel="noopener noreferrer"
                title=${a("doc_open",t)}
              ><ha-icon icon="mdi:open-in-new"></ha-icon></a>`}
          ${this.canWrite?n`
                <button class="icon-btn" title=${a("edit",t)} ?disabled=${this._busy} @click=${()=>this._startEdit(e)}>
                  <ha-icon icon="mdi:pencil"></ha-icon>
                </button>
                <button class="icon-btn danger" title=${a("delete",t)} ?disabled=${this._busy} @click=${()=>this._delete(e)}>
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>`:h}
        </div>
      </div>
    `}_renderEdit(e,t){let i=e.kind==="file";return n`
      <div class="doc-row editing">
        <input
          class="edit-title"
          type="text"
          placeholder=${a("doc_link_title",t)}
          .value=${this._editTitle}
          ?disabled=${this._busy}
          @input=${s=>this._editTitle=s.target.value}
        />
        ${i?n`<select
              class="cat-select"
              ?disabled=${this._busy}
              @change=${s=>this._editCategory=s.target.value}
            >
              ${Ae.map(s=>n`<option value=${s} ?selected=${s===this._editCategory}>${a(`doc_cat_${s}`,t)}</option>`)}
            </select>`:h}
        <input
          class="edit-desc"
          type="text"
          placeholder=${a("doc_description",t)}
          .value=${this._editDescription}
          ?disabled=${this._busy}
          @input=${s=>this._editDescription=s.target.value}
        />
        <button class="icon-btn" title=${a("save",t)} ?disabled=${this._busy||!this._editTitle.trim()} @click=${()=>this._saveEdit(e)}>
          <ha-icon icon="mdi:check"></ha-icon>
        </button>
        <button class="icon-btn" title=${a("cancel",t)} ?disabled=${this._busy} @click=${this._cancelEdit}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
    `}};F.styles=[Li,B`
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
  `],_([R({attribute:!1})],F.prototype,"hass",2),_([R({attribute:!1})],F.prototype,"entryId",2),_([R({type:Boolean})],F.prototype,"canWrite",2),_([f()],F.prototype,"_docs",2),_([f()],F.prototype,"_filter",2),_([f()],F.prototype,"_loaded",2),_([f()],F.prototype,"_busy",2),_([f()],F.prototype,"_error",2),_([f()],F.prototype,"_hint",2),_([f()],F.prototype,"_addingLink",2),_([f()],F.prototype,"_linkUrl",2),_([f()],F.prototype,"_linkTitle",2),_([f()],F.prototype,"_category",2),_([f()],F.prototype,"_thumbs",2),_([f()],F.prototype,"_lightboxUrl",2),_([f()],F.prototype,"_editingId",2),_([f()],F.prototype,"_editTitle",2),_([f()],F.prototype,"_editCategory",2),_([f()],F.prototype,"_editDescription",2),_([f()],F.prototype,"_linkDescription",2),_([f()],F.prototype,"_sort",2),_([f()],F.prototype,"_dragOver",2);customElements.get("maintenance-documents-section")||customElements.define("maintenance-documents-section",F);var de=class extends N{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._attachId="";this._filter="";this._loadedKey="";this._localeReady=!1}get _lang(){return K(this.hass)}get _refId(){return this.partId||this.taskId||""}get _linkField(){return this.partId?"part_ids":"task_ids"}updated(e){super.updated(e),this.hass&&!this._localeReady&&(this._localeReady=!0,ne(this._lang).then(()=>this.requestUpdate()));let t=`${this.entryId}|${this._refId}`;this.hass&&this.entryId&&this._refId&&this._loadedKey!==t&&(this._loadedKey=t,this._load())}async _load(){let e=await P(this,{type:"maintenance_supporter/documents/list",entry_id:this.entryId},{onError:t=>{this._error=t}});this._loaded=!0,e!==void 0&&(this._docs=e?.documents||[],this._error="")}async _update(e){this._error="",await P(this,{type:"maintenance_supporter/documents/update",...e},{busy:t=>{this._busy=t},reload:()=>this._load(),onError:t=>{this._error=t}})}async _signed(e){await P(this,e,{onError:t=>{this._error=t}})}_links(e){return e[this._linkField]||[]}_linked(){return this._docs.filter(e=>this._links(e).includes(this._refId))}_available(){return this._docs.filter(e=>!this._links(e).includes(this._refId))}async _setLinks(e,t){await this._update({doc_id:e.id,[this._linkField]:t})}_link(){let e=this._docs.find(t=>t.id===this._attachId);e&&(this._attachId="",this._setLinks(e,[...this._links(e),this._refId]))}_unlink(e){this._setLinks(e,this._links(e).filter(t=>t!==this._refId))}_isPdf(e){return e.mime==="application/pdf"||(e.filename||"").toLowerCase().endsWith(".pdf")}_pageFor(e){return this._isPdf(e)&&this.taskId?e.task_pages?.[this.taskId]:void 0}async _open(e){if(e.kind==="weblink"){ce(e.url)&&window.open(e.url,"_blank","noopener");return}let t=this._pageFor(e);await this._signed(()=>Ee(this.hass,e.id,t?`#page=${t}`:""))}async _setPage(e,t){this.taskId&&await this._update({doc_id:e.id,task_pages:{[this.taskId]:t}})}async _download(e){await this._signed(()=>ht(this.hass,e.id,e.filename||e.title||"document"))}render(){if(!this._loaded||this._docs.length===0)return h;let e=this._lang,t=this._linked(),i=this._available();return n`
      <div class="task-docs">
        <h3><ha-icon icon="mdi:paperclip"></ha-icon> ${a("documents",e)} (${t.length})</h3>
        ${this._error?n`<div class="tdoc-error">${this._error}</div>`:h}
        ${t.length>=St?n`<div class="doc-filter">
              <ha-icon icon="mdi:magnify"></ha-icon>
              <input type="search" aria-label=${a("doc_search",e)} placeholder=${a("doc_search",e)}
                .value=${this._filter} @input=${s=>this._filter=s.target.value} />
            </div>`:h}
        ${t.length===0?n`<div class="tdoc-empty">${a(this.partId?"doc_part_none":"doc_task_none",e)}</div>`:(()=>{let s=jt(t,this._filter);return s.length===0?n`<div class="tdoc-empty">${a("doc_search_none",e)}</div>`:n`<div class="tdoc-list">${s.map(r=>this._renderRow(r,e))}</div>`})()}
        ${this.canWrite&&i.length?n`<div class="tdoc-attach">
              <select
                class="tdoc-select"
                ?disabled=${this._busy}
                @change=${s=>this._attachId=s.target.value}
              >
                <option value="" ?selected=${!this._attachId}>${a("doc_link_existing",e)}</option>
                ${i.map(s=>n`<option value=${s.id} ?selected=${s.id===this._attachId}>${oe(s)}</option>`)}
              </select>
              <button class="tdoc-btn" ?disabled=${this._busy||!this._attachId} @click=${this._link}>
                <ha-icon icon="mdi:link-variant-plus"></ha-icon> ${a("doc_attach",e)}
              </button>
            </div>`:h}
      </div>
    `}_renderRow(e,t){let i=e.kind==="file",s=this._isPdf(e),r=this._pageFor(e),c=qe(e),o=i?we(e.size,t):a("doc_link_badge",t);return n`
      <div class="tdoc-row">
        <ha-icon class="tdoc-icon" icon=${i?wt[c]:"mdi:link-variant"}></ha-icon>
        <div
          class="tdoc-info"
          role="button"
          tabindex="0"
          title=${r?`${a("doc_open",t)} \xB7 ${a("doc_page",t)} ${r}`:a("doc_open",t)}
          @click=${()=>this._open(e)}
          @keydown=${u=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),this._open(e))}}
        >
          <div class="tdoc-title">${oe(e)}</div>
          ${e.description?n`<div class="tdoc-desc">${e.description}</div>`:h}
          <div class="tdoc-meta">
            ${o}${r?n` · <span class="tdoc-pagetag">${a("doc_page",t)} ${r}</span>`:h}
          </div>
        </div>
        ${this.canWrite&&s&&this.taskId?n`<input
              class="tdoc-page"
              type="number"
              min="1"
              inputmode="numeric"
              aria-label=${a("doc_page",t)}
              title=${a("doc_page",t)}
              placeholder=${a("doc_page",t)}
              .value=${r?String(r):""}
              ?disabled=${this._busy}
              @change=${u=>{let p=parseInt(u.target.value,10);this._setPage(e,Number.isFinite(p)&&p>=1?p:0)}}
            />`:h}
        <button class="icon-btn" title=${a("doc_open",t)} @click=${()=>this._open(e)}>
          <ha-icon icon=${i?"mdi:eye-outline":"mdi:open-in-new"}></ha-icon>
        </button>
        ${i?n`<button class="icon-btn" title=${a("doc_download",t)} @click=${()=>this._download(e)}>
              <ha-icon icon="mdi:download"></ha-icon>
            </button>`:h}
        ${this.canWrite?n`<button class="icon-btn" title=${a("doc_unlink",t)} ?disabled=${this._busy} @click=${()=>this._unlink(e)}>
              <ha-icon icon="mdi:link-variant-off"></ha-icon>
            </button>`:h}
      </div>
    `}};de.styles=B`
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
  `,_([R({attribute:!1})],de.prototype,"hass",2),_([R({attribute:!1})],de.prototype,"entryId",2),_([R({attribute:!1})],de.prototype,"taskId",2),_([R({attribute:!1})],de.prototype,"partId",2),_([R({type:Boolean})],de.prototype,"canWrite",2),_([f()],de.prototype,"_docs",2),_([f()],de.prototype,"_loaded",2),_([f()],de.prototype,"_busy",2),_([f()],de.prototype,"_error",2),_([f()],de.prototype,"_attachId",2),_([f()],de.prototype,"_filter",2);customElements.get("maintenance-task-documents")||customElements.define("maintenance-task-documents",de);var Zs=["charge","sharpen","clean","dry","refill","restore"],ea={name:"",vendor:"",mpn:"",gtin:"",storage_location:"",product_url:"",unit:"",cost:"",stock:"",reuse:"",restoring:"",reorder_threshold:"",restock_quantity:"",package_size:"",auto_buy_task:!0,notes:""},le=class extends N{constructor(){super(...arguments);this.parts=[];this.canWrite=!1;this.currencySymbol="\u20AC";this._editing=null;this._opened=null;this._busy=!1;this._error="";this._restockFor=null;this._restockQty="";this._restockInvalid=!1;this._docsFor=null}get _lang(){return K(this.hass)}connectedCallback(){super.connectedCallback(),ne(this._lang).then(()=>this.requestUpdate())}_notifyChanged(){this.dispatchEvent(new CustomEvent("parts-changed",{bubbles:!0,composed:!0}))}_send(e){return this._error="",P(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_openAdd(){this._editing={...ea},this._opened=null}_openEdit(e){this._editing={id:e.id,name:e.name,vendor:e.vendor||"",mpn:e.mpn||"",gtin:e.gtin||"",storage_location:e.storage_location||"",product_url:e.product_url||"",unit:e.unit||"",cost:e.cost!=null?String(e.cost):"",stock:e.stock!=null?String(e.stock):"",reuse:e.reuse||"",restoring:e.restoring?String(e.restoring):"",reorder_threshold:e.reorder_threshold!=null?String(e.reorder_threshold):"",restock_quantity:e.restock_quantity!=null?String(e.restock_quantity):"",package_size:e.package_size!=null?String(e.package_size):"",auto_buy_task:!!e.auto_buy_task,notes:e.notes||""},this._opened={...this._editing}}_formValue(e){let t=i=>i.trim()===""?null:Number(i);return{entry_id:this.entryId,name:e.name.trim(),vendor:e.vendor.trim()||null,mpn:e.mpn.trim()||null,gtin:e.gtin.trim()||null,storage_location:e.storage_location.trim()||null,product_url:e.product_url.trim()||null,unit:e.unit.trim()||null,cost:t(e.cost),stock:t(e.stock),reuse:e.reuse||null,...e.reuse?{restoring:t(e.restoring)??0}:{},reorder_threshold:t(e.reorder_threshold),restock_quantity:t(e.restock_quantity),package_size:t(e.package_size),auto_buy_task:e.auto_buy_task,notes:e.notes.trim()||null}}async _save(){let e=this._editing;if(this._busy||!e||!e.name.trim())return;let t=this._formValue(e),i=this._opened;e.id&&i&&(e.stock===i.stock&&delete t.stock,e.restoring===i.restoring&&e.reuse===i.reuse&&delete t.restoring);let s=e.id?"maintenance_supporter/part/update":"maintenance_supporter/part/create";await this._send(e.id?{type:s,part_id:e.id,...t}:{type:s,...t})!==void 0&&(this._editing=null,this._notifyChanged())}async _delete(e){if(!window.confirm(a("part_delete_confirm",this._lang).replace("{name}",e.name)))return;await this._send({type:"maintenance_supporter/part/delete",entry_id:this.entryId,part_id:e.id})!==void 0&&this._notifyChanged()}async _restock(e){if(this._busy)return;let t=parseFloat(this._restockQty);if(!Number.isFinite(t)||t===0){this._restockInvalid=!0;return}this._restockInvalid=!1;let i=await this._send({type:"maintenance_supporter/part/restock",entry_id:this.entryId,part_id:e.id,delta:t});this._restockFor=null,i!==void 0&&(e.stock=i?.stock,this.requestUpdate(),this._notifyChanged())}async _readyAgain(e){if(this._busy)return;let t=await this._send({type:"maintenance_supporter/part/ready_again",entry_id:this.entryId,part_id:e.id});t&&(e.stock=t.stock,e.restoring=t.restoring,this.requestUpdate(),this._notifyChanged())}_identLine(e){return[e.vendor,e.mpn?`MPN: ${e.mpn}`:"",e.gtin?`GTIN: ${e.gtin}`:""].filter(Boolean).join(" \xB7 ")}_renderRow(e){let t=this._lang,i=e.stock!==null&&e.stock!==void 0,s=this._identLine(e),r=this._docsFor===e.id;return n`
      <div class="part-row ${e.is_low?"low":""}">
        <ha-icon class="part-icon" icon=${e.is_low?"mdi:cart-arrow-down":"mdi:package-variant-closed"}></ha-icon>
        <div class="part-main">
          <div class="part-name">
            ${si(e.shopping_url)?n`<a href=${e.shopping_url} target="_blank" rel="noopener noreferrer">${e.name}</a>`:e.name}
            ${i?n`<span class="stock-badge ${e.is_low?"low":""}"
                  >${Ke(e.stock,e.unit,t)}${e.reorder_threshold!=null?n`<span class="threshold">/${se(e.reorder_threshold,t)}</span>`:h}</span
                >`:h}
          </div>
          ${i&&e.reuse&&(e.restoring??0)>0?n`<div class="part-waiting">
                <span class="waiting-badge">${a(`part_waiting_${e.reuse}`,t).replace("{count}",se(e.restoring,t))}</span>
                ${this.canWrite?n`<button class="ready-again" title=${a("part_ready_again_hint",t)} .disabled=${this._busy}
                      @click=${()=>this._readyAgain(e)}>
                      <ha-icon icon="mdi:check"></ha-icon>${a(`part_reuse_${e.reuse}`,t)}
                    </button>`:h}
              </div>`:h}
          <div class="part-meta">
            ${s?n`<span>${s}</span>`:h}
            ${e.storage_location?n`<span class="loc"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${e.storage_location}</span>`:h}
          </div>
          ${e.notes?n`<div class="part-notes">${e.notes}</div>`:h}
        </div>
        <ha-icon-button
          title=${a("documents",t)}
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
                      @input=${c=>this._restockQty=c.target.value}
                      @keydown=${c=>{c.key==="Enter"&&this._restock(e),c.key==="Escape"&&(this._restockFor=null)}}
                    />
                    <ha-icon-button title=${a("save",t)} .disabled=${this._busy} @click=${()=>this._restock(e)}
                      ><ha-icon icon="mdi:check"></ha-icon
                    ></ha-icon-button>
                  `:n`
                    <ha-icon-button
                      title=${a("part_restock",t)}
                      .disabled=${this._busy}
                      @click=${()=>{this._restockFor=e.id,this._restockInvalid=!1,this._restockQty=String(Ti(e))}}
                      ><ha-icon icon="mdi:plus-minus-variant"></ha-icon
                    ></ha-icon-button>
                  `}
              <ha-icon-button title=${a("edit",t)} .disabled=${this._busy} @click=${()=>this._openEdit(e)}
                ><ha-icon icon="mdi:pencil"></ha-icon
              ></ha-icon-button>
              <ha-icon-button title=${a("delete",t)} .disabled=${this._busy} @click=${()=>this._delete(e)}
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
    `}_field(e,t,i={}){let s=this._editing;return n`
      <label class="form-field">
        <span>${e}</span>
        <input
          type=${i.type||"text"}
          .value=${String(s[t]??"")}
          placeholder=${i.placeholder||""}
          @input=${r=>{this._editing[t]=r.target.value,this.requestUpdate()}}
        />
      </label>
    `}_renderForm(){let e=this._lang,t=this._editing;return n`
      <div class="part-form">
        <div class="form-grid">
          ${this._field(a("part_name",e),"name")}
          ${this._field(a("part_vendor",e),"vendor")}
          ${this._field("MPN","mpn")}
          ${this._field("GTIN / EAN","gtin",{placeholder:"4006381333931"})}
          ${this._field(a("part_storage_location",e),"storage_location")}
          ${this._field(a("part_product_url",e),"product_url",{placeholder:"https://\u2026"})}
          ${this._field(a("part_unit",e),"unit")}
          ${this._field(a("part_cost",e),"cost",{type:"number"})}
          ${this._field(a("part_stock",e),"stock",{type:"number"})}
          <label class="form-field">
            <span>${a("part_reuse",e)}</span>
            <select
              class="reuse-select"
              .value=${t.reuse}
              @change=${i=>{this._editing={...this._editing,reuse:i.target.value}}}
            >
              <option value="" ?selected=${!t.reuse}>${a("part_reuse_none",e)}</option>
              ${Zs.map(i=>n`<option value=${i} ?selected=${t.reuse===i}>${a(`part_reuse_${i}`,e)}</option>`)}
            </select>
          </label>
          ${t.reuse?this._field(a("part_restoring",e),"restoring",{type:"number"}):h}
          ${t.reuse?n`<div class="form-hint">${a("part_reuse_hint",e)}</div>`:h}
          ${this._field(a("part_reorder_threshold",e),"reorder_threshold",{type:"number"})}
          ${this._field(a("part_package_size",e),"package_size",{type:"number"})}
          ${this._field(t.package_size.trim()?a("part_restock_packages",e):a("part_restock_quantity",e),"restock_quantity",{type:"number"})}
          ${t.package_size.trim()?n`<div class="form-hint">${a("part_package_hint",e)}</div>`:h}
          <label class="form-field checkbox">
            <input
              type="checkbox"
              .checked=${t.auto_buy_task}
              @change=${i=>{this._editing={...t,auto_buy_task:i.target.checked}}}
            />
            <span>${a("part_auto_buy",e)}</span>
          </label>
          <!-- Documented and searched since the parts feature, but the form
               never had a field — only the API and imports could set it
               (audit 2026-09-28). -->
          <label class="form-field notes">
            <span>${a("notes_label",e)}</span>
            <textarea
              rows="2"
              maxlength="500"
              .value=${t.notes}
              @input=${i=>{this._editing={...this._editing,notes:i.target.value}}}
            ></textarea>
          </label>
        </div>
        <div class="form-actions">
          <ha-button appearance="plain" @click=${()=>this._editing=null}>${a("cancel",e)}</ha-button>
          <ha-button .disabled=${this._busy||!t.name.trim()} @click=${()=>this._save()}
            >${a("save",e)}</ha-button
          >
        </div>
      </div>
    `}_inventoryValue(){let e=0,t=!1;for(let i of this.parts){let s=ji(i),r=typeof i.stock=="number"?i.stock:null;s!==null&&r!==null&&(e+=s*r,t=!0)}return t?e:null}render(){let e=this._lang;return!this.parts.length&&!this.canWrite?h:n`
      <div class="section-head">
        <h3>
          <ha-icon icon="mdi:package-variant"></ha-icon>
          ${a("parts_section",e)} (${this.parts.length})
          ${this._inventoryValue()!==null?n`<span class="inventory-value" title=${a("parts_inventory_value",e)}
                >${a("parts_inventory_value",e)}:
                ${U(this._inventoryValue(),this.currencySymbol,e)}</span>`:h}
        </h3>
        ${this.canWrite&&!this._editing?n`<ha-button appearance="plain" @click=${()=>this._openAdd()}>
              <ha-icon icon="mdi:plus"></ha-icon> ${a("part_add",e)}
            </ha-button>`:h}
      </div>
      ${this._error?n`<div class="error">${this._error}</div>`:h}
      ${this._editing?this._renderForm():h}
      ${this.parts.map(t=>this._renderRow(t))}
    `}};le.styles=B`
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
    .reuse-select {
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
  `,_([R({attribute:!1})],le.prototype,"hass",2),_([R({attribute:!1})],le.prototype,"entryId",2),_([R({attribute:!1})],le.prototype,"parts",2),_([R({type:Boolean})],le.prototype,"canWrite",2),_([R({attribute:!1})],le.prototype,"currencySymbol",2),_([f()],le.prototype,"_editing",2),_([f()],le.prototype,"_busy",2),_([f()],le.prototype,"_error",2),_([f()],le.prototype,"_restockFor",2),_([f()],le.prototype,"_restockQty",2),_([f()],le.prototype,"_restockInvalid",2),_([f()],le.prototype,"_docsFor",2);customElements.get("maintenance-parts-section")||customElements.define("maintenance-parts-section",le);var Tt={readings:!0,parts:!0,photos:!0,documents:!0,checklist:!0,notes:!0,costs:!0,person:!0,refs:!0,qr:!1,bare:!0,docDescriptions:!0};function ta(l){return!!(l.notes&&l.notes.trim()||l.cost!=null||l.duration!=null||l.readings.length||l.parts.length||l.photoIds.length||l.checklist)}var ia=6;function _s(l,d,e,t,i,s,r,c={}){let o=c.options??{layout:"chronological",include:Tt},u=o.include,p=c.data??{objectRef:null,tasks:[],photos:{},fmtNumber:T=>String(T)},g=d.filter(T=>T.type==="completed"&&(u.bare!==!1||ta(T))),{totalCost:m}=_t(g),v=T=>u.refs&&p.objectRef&&T.taskRefNo!=null&&T.refNo!=null?`${p.objectRef}.${T.taskRefNo}-${T.refNo}`:null,y=T=>u.refs&&p.objectRef&&T.taskRefNo!=null?`${p.objectRef}.${T.taskRefNo}`:null,E=[[e.refNumber,u.refs&&p.objectRef?`#${p.objectRef}`:null],[e.manufacturer,l.manufacturer],[e.model,l.model],[e.serial,l.serial_number],[e.installed,l.installation_date?t(l.installation_date):null]].filter(([,T])=>T).map(([T,z])=>`<div class="meta-row"><span>${w(T)}</span><strong>${w(z)}</strong></div>`).join(""),x=T=>{let z=[];if(u.readings&&T.readings.length){let H=T.readings.map(I=>{let W=`${p.fmtNumber(I.value)}${I.unit?` ${w(I.unit)}`:""}`,G=I.delta!=null?` <span class="delta">(${I.delta>=0?"+":"\u2212"}${p.fmtNumber(Math.abs(I.delta))})</span>`:"";return`${I.name?`${w(I.name)}: `:""}${W}${G}`});z.push(`<div class="fact"><span class="k">${w(e.readings)}</span>${H.join(" \xB7 ")}</div>`)}if(u.parts&&T.parts.length&&z.push(`<div class="fact"><span class="k">${w(e.parts)}</span>${T.parts.map(H=>`${w(H.name)} \xD7 ${p.fmtNumber(H.quantity)}`).join(", ")}</div>`),u.checklist&&T.checklist&&z.push(`<div class="fact"><span class="k">${w(e.checklist)}</span>${T.checklist.done}/${T.checklist.total}</div>`),u.photos&&T.photoIds.length){let H=T.photoIds.slice(0,ia),I=H.map(G=>{let X=p.photos[G],j=X?.name||G.slice(0,8);return X?.url?`<figure class="photo"><img src="${w(X.url)}" alt="" /><figcaption>${w(j)}</figcaption></figure>`:`<figure class="photo"><figcaption>${w(j)}</figcaption></figure>`}),W=T.photoIds.length>H.length?`<span class="more">+${T.photoIds.length-H.length}</span>`:"";z.push(`<div class="fact"><span class="k">${w(e.photos)}</span><div class="photos">${I.join("")}${W}</div></div>`)}return z.length?`<div class="details">${z.join("")}</div>`:""},S=T=>[u.notes?T.notes:null,u.person&&T.completedBy?`${e.completedBy}: ${T.completedBy}`:null].filter(Boolean).join(" \xB7 "),$=T=>u.costs?`<td class="num">${T.cost!=null?w(s(T.cost)):w(e.none)}</td>
        <td class="num">${T.duration!=null?w(i(T.duration)):w(e.none)}</td>`:"",C=T=>T?`<span class="ref">#${w(T)}</span>`:"",b=u.costs?5:3,D=T=>`<thead><tr>
    <th>${w(e.colDate)}</th>
    ${T?`<th>${w(e.colTask)}</th>`:"<th></th>"}
    ${u.costs?`<th class="num">${w(e.colCost)}</th><th class="num">${w(e.colDuration)}</th>`:""}
    <th>${w(e.colNotes)}</th>
  </tr></thead>`,ae=(T,z)=>{let H=S(T),I=x(T),W=z?w(T.phaseName?`${T.taskName} \xB7 ${T.phaseName}`:T.taskName):w(T.phaseName||"");return`<tr class="entry">
        <td class="nowrap">${w(t(T.timestamp))}${C(v(T))}</td>
        <td>${z?`${W} ${C(y(T))}`:W}</td>
        ${$(T)}
        <td class="notes">${w(H)||(I?"":w(e.none))}</td>
      </tr>${I?`<tr class="entry-details"><td colspan="${b}" class="details-cell">${I}</td></tr>`:""}`},he;if(o.layout==="by_task"){let T=new Map(p.tasks.map(I=>[I.id,I])),z=[...p.tasks.map(I=>I.id)];for(let I of g)z.includes(I.taskId)||z.push(I.taskId);he=`${z.map(I=>{let W=g.filter(ie=>ie.taskId===I);if(!W.length)return"";let G=T.get(I),X=G?.name||W[0].taskName,j=u.refs?G?.ref??y(W[0]):null,Y=u.documents&&G?.documents.length?`<div class="fact"><span class="k">${w(e.documents)}</span>${G.documents.map(ie=>`${w(ie.title)}${ie.page?` (${w(e.page(ie.page))})`:""}${u.docDescriptions!==!1&&ie.description?` \u2014 <span class="doc-desc">${w(ie.description)}</span>`:""}`).join(", ")}</div>`:"",re=u.qr&&G?.qrDataUri?`<figure class="qr"><img src="${w(G.qrDataUri)}" alt="" /><figcaption>${w(e.scanHint)}</figcaption></figure>`:"",Ie=W.reduce((ie,M)=>ie+(M.cost??0),0);return`<section class="task">
  <div class="task-head">
    <div class="task-title">
      <h2>${w(X)} ${C(j)}</h2>
      ${G?.schedule?`<div class="schedule">${w(G.schedule)}</div>`:""}
      ${Y}
      <div class="task-count">${w(e.entriesLabel(W.length))}${u.costs&&Ie!==0?` \xB7 ${w(s(Ie))}`:""}</div>
    </div>
    ${re}
  </div>
  <table>
    ${D(!1)}
    <tbody>
${W.map(ie=>ae(ie,!1)).join(`
`)}
    </tbody>
  </table>
</section>`}).join(`
`)}
<table class="total">
  <tfoot><tr>
    <td>${w(e.totalLabel)}</td>
    <td class="num">${u.costs?w(s(m)):""}</td>
  </tr></tfoot>
</table>`}else he=`<table>
  ${D(!0)}
  <tbody>
${g.map(T=>ae(T,!0)).join(`
`)}
  </tbody>
  <tfoot><tr>
    <td colspan="2">${w(e.totalLabel)}</td>
    ${u.costs?`<td class="num">${w(s(m))}</td><td colspan="2"></td>`:"<td></td>"}
  </tr></tfoot>
</table>`;return`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${w(e.title)} \u2014 ${w(l.name)}</title>
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
<h1>${w(e.title)} \u2014 ${w(l.name)}</h1>
<p class="sub">${w(e.generated)} ${w(t(r))} \xB7 ${w(e.entriesLabel(g.length))}</p>
${E?`<div class="meta">${E}</div>`:""}
${he}
${c.capped?`<p class="cap-note">${w(e.capNote)}</p>`:""}
</body>
</html>`}var sa=60,ee=class extends N{constructor(){super(...arguments);this.entryId="";this.object=null;this.tasks=[];this.currencySymbol="\u20AC";this.userName=()=>null;this._full={};this._loading=!1;this._filterTask="";this._from="";this._to="";this._expanded=!1;this._printOpen=!1;this._printLayout="chronological";this._printInclude={...Tt};this._printing=!1;this._loadedFor=null;this._loadedSignature="";this._loadSeq=0;this._localeReady=!1}connectedCallback(){super.connectedCallback();try{let e=JSON.parse(Z(A.printOptions)||"null");(e?.layout==="by_task"||e?.layout==="chronological")&&(this._printLayout=e.layout),e?.include&&typeof e.include=="object"&&(this._printInclude={...Tt,...e.include})}catch{}}_savePrintOptions(){V(A.printOptions,JSON.stringify({layout:this._printLayout,include:this._printInclude}))}_toggleInclude(e,t){this._printInclude={...this._printInclude,[e]:t},this._savePrintOptions()}get _lang(){return K(this.hass)}updated(e){if(super.updated(e),!this._localeReady&&this.hass&&(this._localeReady=!0,ne(this._lang).then(()=>this.requestUpdate())),this.entryId&&this._loadedFor!==this.entryId)this._loadedFor=this.entryId,this._full={},this._filterTask="",this._from="",this._to="",this._loadedSignature=this._historySignature(),this._loadFullHistories();else if(this.entryId&&e.has("tasks")){let t=this._historySignature();t!==this._loadedSignature&&(this._loadedSignature=t,this._loadFullHistories())}}_historySignature(){return JSON.stringify(this.tasks.map(e=>[e.id,e.history_count??null,e.history??[]]))}async _loadFullHistories(){let e=this.entryId,t=this.tasks,i=++this._loadSeq;if(!t.length){this._full={},this._loading=!1;return}this._loading=!0;let s=await Promise.all(t.map(async r=>{try{let c=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:e,task_id:r.id});return[r.id,c.history??[]]}catch{return[r.id,r.history??[]]}}));this.entryId!==e||i!==this._loadSeq||(this._full=Object.fromEntries(s),this._loading=!1)}get _entries(){return Ri(this.tasks.map(e=>({id:e.id,name:e.name,history:this._full[e.id]??e.history??[],ref_no:e.ref_no,reading_unit:e.reading_unit})))}get _capped(){return Object.values(this._full).some(e=>e.length>=Ei)}_openTask(e){this.dispatchEvent(new CustomEvent("open-task",{detail:{taskId:e},bubbles:!0,composed:!0}))}async _bookletData(e){let t=this._printInclude,i=this._lang,s=[];if(t.documents||t.photos)try{s=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId})).documents||[]}catch{s=[]}let r=new Map;t.qr&&this._printLayout==="by_task"&&await Promise.all(this.tasks.map(async u=>{try{let p=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/qr/generate",entry_id:this.entryId,task_id:u.id,url_mode:"server",action:"view"});p.svg_data_uri&&r.set(u.id,p.svg_data_uri)}catch{}}));let c=this.tasks.map(u=>({id:u.id,name:u.name,ref:je(this.object,u),schedule:ze(u,i)||null,documents:s.filter(p=>(p.task_ids||[]).includes(u.id)&&!us(p)).map(p=>({title:oe(p),page:p.task_pages?.[u.id]??null,description:p.description||null})),qrDataUri:r.get(u.id)??null})),o={};if(t.photos){let u=[...new Set(e.filter(g=>g.type==="completed").flatMap(g=>g.photoIds))].slice(0,sa),p=new Map(s.map(g=>[g.id,g]));await Promise.all(u.map(async g=>{let m=p.get(g),v=m&&oe(m)||g.slice(0,8);try{o[g]={name:v,url:new URL(await pt(this.hass,g),window.location.origin).href}}catch{o[g]={name:v,url:null}}}))}return{tasks:c,photos:o}}async _print(e){let t=this._lang,i=this.object;if(!i||this._printing)return;let s=ut();this._printing=!0;let r;try{r=await this._bookletData(e)}catch(p){throw s?.close(),p}finally{this._printing=!1}this._printOpen=!1;let c={title:a("service_record_title",t),generated:a("report_generated",t),manufacturer:a("manufacturer",t),model:a("model",t),serial:a("serial_number_label",t),installed:a("installed",t),colDate:a("date",t),colTask:a("task_name",t),colCost:a("cost",t),colDuration:a("duration",t),colNotes:a("notes_label",t),completedBy:a("completed_by",t),totalLabel:a("report_total_cost",t),entriesLabel:p=>`${p} ${a("service_record_entries",t)}`,capNote:a("object_history_cap_note",t),none:"\u2014",readings:a("print_inc_readings",t),parts:a("print_inc_parts",t),photos:a("print_inc_photos",t),documents:a("print_inc_documents",t),checklist:a("print_inc_checklist",t),refNumber:a("ref_number",t),scanHint:a("report_scan_hint",t),page:p=>a("search_page",t).replace("{page}",String(p))},o=e.map(p=>({...p,completedBy:p.completedBy?this.userName(p.completedBy):null,notes:p.notes?ft(p.notes,t):null})),u=_s(i,o,c,p=>p?q(p,t):"",p=>Ge(p,t),p=>U(p,this.currencySymbol,t),new Date().toISOString(),{capped:this._capped,options:{layout:this._printLayout,include:this._printInclude},data:{objectRef:Se(i),tasks:r.tasks,photos:r.photos,fmtNumber:p=>se(p,t)}});Qe(u,s)}_renderPrintOptions(e){let t=this._lang,i=this._printInclude,s=(c,o,u=!1)=>n`
      <label class="opt ${u?"disabled":""}">
        <input type="checkbox" .checked=${i[c]} ?disabled=${u}
          @change=${p=>this._toggleInclude(c,p.target.checked)} />
        <span>${a(o,t)}</span>
      </label>`,r=this._printLayout==="by_task";return n`
      <div class="print-options" role="dialog" aria-label=${a("print_options_title",t)}>
        <div class="po-title">${a("print_options_title",t)}</div>
        <div class="po-group">
          <span class="po-label">${a("print_layout",t)}</span>
          <label class="opt"><input type="radio" name="layout" value="chronological" .checked=${!r}
            @change=${()=>{this._printLayout="chronological",this._savePrintOptions()}} /><span>${a("print_layout_chronological",t)}</span></label>
          <label class="opt"><input type="radio" name="layout" value="by_task" .checked=${r}
            @change=${()=>{this._printLayout="by_task",this._savePrintOptions()}} /><span>${a("print_layout_by_task",t)}</span></label>
        </div>
        <div class="po-group">
          <span class="po-label">${a("print_include",t)}</span>
          ${s("readings","print_inc_readings")}
          ${s("parts","print_inc_parts")}
          ${s("photos","print_inc_photos")}
          ${s("checklist","print_inc_checklist")}
          ${s("notes","print_inc_notes")}
          ${s("costs","print_inc_costs")}
          ${s("person","print_inc_person")}
          ${s("refs","print_inc_refs")}
          ${s("bare","print_inc_bare")}
          ${s("documents","print_inc_documents",!r)}
          ${s("docDescriptions","print_inc_doc_desc",!r)}
          ${s("qr","print_inc_qr",!r)}
        </div>
        <div class="po-actions">
          <ha-button appearance="plain" @click=${()=>{this._printOpen=!1}}>${a("cancel",t)}</ha-button>
          <ha-button appearance="filled" class="po-print" .disabled=${this._printing} @click=${()=>this._print(e)}>
            ${this._printing?a("loading",t):a("print_button",t)}
          </ha-button>
        </div>
      </div>`}render(){let e=this._lang,t=this._entries;if(!t.length&&!this._loading)return h;let i=Oi(t,{taskId:this._filterTask||null,from:this._from||null,to:this._to||null}),{completed:s,totalCost:r}=_t(i),c=this._expanded?i:i.slice(0,15);return n`
      <div class="section">
        <h3>
          ${a("object_history_section",e)}
          <span class="count">${i.length}</span>
          ${this._loading?n`<span class="loading-hint">${a("loading",e)}</span>`:h}
          <ha-button appearance="plain" class="print-btn" @click=${()=>{this._printOpen=!this._printOpen}}>
            <ha-icon icon="mdi:printer-outline"></ha-icon>
            ${a("service_record_print",e)}
          </ha-button>
        </h3>
        ${this._printOpen?this._renderPrintOptions(i):h}

        <div class="filters">
          <select .value=${this._filterTask} @change=${o=>{this._filterTask=o.target.value}}>
            <option value="">${a("object_history_all_tasks",e)}</option>
            ${this.tasks.map(o=>n`<option value=${o.id} ?selected=${o.id===this._filterTask}>${o.name}</option>`)}
          </select>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            .label=${a("date_from",e)}
            .value=${this._from}
            @value-changed=${o=>{this._from=o.detail.value}}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            .label=${a("date_to",e)}
            .value=${this._to}
            @value-changed=${o=>{this._to=o.detail.value}}
          ></ms-date-field>
        </div>

        ${i.length===0?n`<p class="empty">${a("object_history_empty",e)}</p>`:n`
              <div class="rows">
                ${c.map(o=>n`
                  <div class="row">
                    <span class="date" title=${pi(o.timestamp,e)}>${q(o.timestamp,e)}</span>
                    <span class="type type-${o.type}">${a(o.type,e)}</span>
                    <button class="task-link" @click=${()=>this._openTask(o.taskId)}>${o.taskName}${o.phaseName?` \xB7 ${o.phaseName}`:""}</button>
                    <span class="facts">
                      ${o.cost!=null?n`<span>${U(o.cost,this.currencySymbol,e)}</span>`:h}
                      ${o.partsCost!=null?n`<span class="parts-cost" title=${a(o.partsCounted?"history_parts_counted_hint":"history_parts_info_hint",e)}>${a(o.partsCounted?"history_parts_counted":"history_parts_info",e).replace("{amount}",U(o.partsCost,this.currencySymbol,e))}</span>`:h}
                      ${o.purchaseCost!=null?n`<span class="parts-cost">${a("history_purchase_stock",e).replace("{amount}",U(o.purchaseCost,this.currencySymbol,e))}</span>`:h}
                      ${o.duration!=null?n`<span>${Ge(o.duration,e)}</span>`:h}
                    </span>
                    ${o.notes?n`<span class="notes" title=${ft(o.notes,e)}>${ft(o.notes,e)}</span>`:h}
                  </div>
                `)}
              </div>
              ${i.length>c.length?n`<ha-button appearance="plain" class="more" @click=${()=>{this._expanded=!0}}>
                    ${a("show_all",e)} (${i.length})
                  </ha-button>`:h}
              <div class="totals">
                ${s} ${a("service_record_entries",e)} · ${a("report_total_cost",e)}:
                <strong>${U(r,this.currencySymbol,e)}</strong>
              </div>
              ${this._capped?n`<p class="cap-note">${a("object_history_cap_note",e)}</p>`:h}
            `}
      </div>
    `}};ee.styles=B`
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
  `,_([R({attribute:!1})],ee.prototype,"hass",2),_([R()],ee.prototype,"entryId",2),_([R({attribute:!1})],ee.prototype,"object",2),_([R({attribute:!1})],ee.prototype,"tasks",2),_([R()],ee.prototype,"currencySymbol",2),_([R({attribute:!1})],ee.prototype,"userName",2),_([f()],ee.prototype,"_full",2),_([f()],ee.prototype,"_loading",2),_([f()],ee.prototype,"_filterTask",2),_([f()],ee.prototype,"_from",2),_([f()],ee.prototype,"_to",2),_([f()],ee.prototype,"_expanded",2),_([f()],ee.prototype,"_printOpen",2),_([f()],ee.prototype,"_printLayout",2),_([f()],ee.prototype,"_printInclude",2),_([f()],ee.prototype,"_printing",2);customElements.get("maintenance-object-history-section")||customElements.define("maintenance-object-history-section",ee);async function fs(l,d,e,t){try{let i=await l.connection.sendMessagePromise({type:"maintenance_supporter/task/undo",entry_id:d,task_id:e});return{ok:!0,message:a(i?.action_ran?"undo_done_action_ran":"undo_done",t)}}catch(i){let s=i?.code;return s==="changed_since"?{ok:!1,message:a("undo_changed",t)}:s==="nothing_to_undo"?{ok:!1,message:a("undo_nothing",t)}:{ok:!1,message:a("action_error",t)}}}var pe=class pe extends N{constructor(){super(...arguments);this.flat=!1;this._ov=null;this._loading=!1;this._marking=!1;this._error="";this._history=null;this._rosterSort=pe._storedSort();this._typeFilter=null;this._recorded=[];this._access=Hi;this._historyRequested=!1;this._localeReady=!1;this._markAll=async()=>{await this._mark(void 0)};this._repair=async()=>{await this._act({type:"maintenance_supporter/battery_fleet/setup",language:this._lang})};this._loadHistory=async e=>{let t=e.target.open;if(V(A.batteryRosterOpen,t?"1":"0"),!(!t||this._historyRequested)){this._historyRequested=!0;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview_history"});this._history=i.series}catch{this._history=null}}}}get _lang(){return K(this.hass)}get _canWrite(){return Ne(this.hass?.user,this._access)}connectedCallback(){super.connectedCallback(),this.hass&&this._load()}updated(e){Be(this,e),e.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,ne(this._lang).then(()=>this.requestUpdate()),vt(this.hass).then(t=>{this._access=t.access}),this._ov===null&&!this._loading&&this._load())}async _load(){this._error="";let e=await P(this,{type:"maintenance_supporter/battery_fleet/overview"},{busy:t=>{this._loading=t},onError:t=>{this._error=t}});e!==void 0&&(this._ov=e)}async _act(e,t){this._marking||(this._error="",await P(this,e,{busy:i=>{this._marking=i},reload:async()=>{t?.(),await this._load()},onError:i=>{this._error=i}}))}async _mark(e){await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",...e?{entity_ids:e}:{}})}async _setExcluded(e,t){await this._act({type:"maintenance_supporter/battery_fleet/set_excluded",entity_id:e,excluded:t})}async _addBattery(e){let t=e.detail?.value;t&&await this._act({type:"maintenance_supporter/battery_fleet/set_included",entity_id:t,included:!0})}async _setTrackSelf(e){await this._setFleetOption("set_track_self_charging",e.target.checked)}async _setDueWithoutSensor(e){await this._setFleetOption("set_due_without_sensor",e.target.checked)}async _setFleetOption(e,t){await this._act({type:`maintenance_supporter/battery_fleet/${e}`,enabled:t})}_rosterOpen(){return Z(A.batteryRosterOpen)!=="0"}_predictedTitle(e,t){if(e.forecast_overdue)return a("battery_fleet_forecast_overdue",t);let i=this._predictedDate(this._forecastDays(e)??0);if(e.predicted_source==="trend")return a("battery_fleet_predicted_trend",t).replace("{date}",i).replace("{confidence}",a("cal_confidence_"+(e.prediction_confidence||"medium"),t));if(e.lifetime_months!=null&&e.lifetime_source){let s=a("lifetime_source_"+e.lifetime_source,t).replace("{n}",String(e.lifetime_samples??0));return a("battery_fleet_predicted_typical",t).replace("{date}",i).replace("{months}",String(e.lifetime_months)).replace("{type}",e.battery_type).replace("{source}",s)}return a("battery_fleet_predicted_on",t).replace("{date}",i)}_sparkline(e){let t=this._history?.[e.entity_id];if(!t||t.points.length<2)return h;let i=110,s=24,r=2,c=t.points[0][0],o=t.points[t.points.length-1][0],u=Date.now()/1e3,p=e.status!=="low"&&e.predicted_source==="trend"&&e.days_until!=null?u+e.days_until*86400:null,g=Math.max(o,p??o),m=S=>g===c?r:r+(S-c)/(g-c)*(i-2*r),v=S=>r+(1-Math.min(100,Math.max(0,S))/100)*(s-2*r),y=t.points.map(([S,$])=>`${O(m(S))},${O(v($))}`).join(" "),E=t.points[t.points.length-1][1],x=O(v(t.threshold));return n`<svg
      class="bf-spark"
      viewBox="0 0 ${i} ${s}"
      role="img"
      aria-label=${a("battery_fleet_sparkline_hint",this._lang)}
    >
      <title>${a("battery_fleet_sparkline_hint",this._lang)}</title>
      <line class="bf-spark-th" x1="0" y1=${x} x2=${i} y2=${x}></line>
      <polyline class="bf-spark-line" points=${y}></polyline>
      ${p!==null?n`<line
            class="bf-spark-proj"
            x1=${O(m(o))}
            y1=${O(v(E))}
            x2=${O(m(p))}
            y2=${x}
          ></line>`:h}
    </svg>`}static _storedSort(){return Z(A.batteryRosterSort)==="name"?"name":"urgency"}_setSort(e){this._rosterSort=e,V(A.batteryRosterSort,e)}_sortedRoster(e){let t=this._typeFilter===null?e:e.filter(s=>s.battery_type===this._typeFilter);if(this._rosterSort==="name")return t;let i=s=>s.status==="low"?-1e3+(s.level??101)/101:s.days_until??1/0;return[...t].sort((s,r)=>i(s)-i(r)||s.device_name.localeCompare(r.device_name))}_predictedDate(e){return q(Te(xe(),e),this._lang)}_forecastDays(e){return e.forecast_days!==void 0?e.forecast_days:e.days_until}_fmtDate(e){return Number.isFinite(e)?q(new Date(e).toISOString(),this._lang):"\u2014"}_shoppingLine(e){return Object.entries(e).map(([t,i])=>n`<button
        class="bf-type-chip ${this._typeFilter===t?"bf-type-chip-active":""}"
        title=${a("battery_fleet_filter_type",this._lang)}
        @click=${()=>this._toggleTypeFilter(t)}
      >
        ${i}× ${t}
      </button>`)}_toggleTypeFilter(e){if(this._typeFilter=this._typeFilter===e?null:e,this._typeFilter!==null){let t=this.shadowRoot?.querySelector("details.bf-roster");t&&!t.open&&(t.open=!0)}}async _recordJump(e,t){await this._act({type:"maintenance_supporter/battery_fleet/record_replacement",entity_id:e,replaced_at:new Date(t.at*1e3).toISOString()},()=>{this._recorded=[...this._recorded,e]})}_levelTone(e,t){let i=t.low_threshold??20;return e<=i?"bad":e<=i+20?"warn":"good"}_levelBar(e){let t=e.level;return t==null?h:n`<span class="bf-bar" aria-hidden="true"
      ><span class="bf-bar-fill bf-bar-${this._levelTone(t,e)}" style="width: ${Math.min(100,Math.max(0,t))}%"></span
    ></span>`}_jumpButton(e,t){let i=this._history?.[e.entity_id]?.jump;return!i||this._recorded.includes(e.entity_id)?h:n`<button
      class="bf-mark bf-jump"
      title=${a("battery_fleet_record_replacement",t).replace("{date}",this._fmtDate(i.at*1e3))}
      .disabled=${this._marking}
      @click=${()=>this._recordJump(e.entity_id,i)}
    >
      <ha-icon icon="mdi:calendar-sync"></ha-icon>
    </button>`}_renderRow(e,t,i){let s=e.available===!1?n`<span class="bf-offline">${a("battery_fleet_offline",t)}</span>`:e.no_sensor?n`<span class="bf-offline bf-nosensor">${a("battery_fleet_no_sensor",t)}</span>`:h,r=`${e.quantity}\xD7 ${e.battery_type}`,c=n`<span class="bf-type" title=${r}>${r}</span>`,o=this._canWrite,u=o&&(i.mark==="always"||e.no_sensor||e.can_mark_replaced),p=this._forecastDays(e);return n`
      <div class="bf-row">
        <span class="bf-dev">${e.device_name}</span>
        ${i.status?n`<span class="bf-status bf-${e.status}"
                >${e.no_sensor&&e.status==="low"?a("battery_fleet_status_due",t):a("battery_fleet_status_"+e.status,t)}</span
              >${c}${s}`:n`${s}${c}`}
        ${i.recharge&&e.rechargeable?n`<span class="bf-recharge" title=${a("battery_fleet_rechargeable",t)}
              ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
            ></span>`:h}
        ${i.sparkline?this._sparkline(e):h}
        ${this._levelBar(e)}
        ${e.level!=null?n`<span class="bf-level bf-level-${this._levelTone(e.level,e)}">${e.level}%</span>`:h}
        ${u?n`<button
              class="bf-mark${i.mark==="replaced"?" bf-replaced":""}"
              title=${e.rechargeable?a("battery_fleet_mark_recharged",t):a("battery_fleet_mark_one",t)}
              .disabled=${this._marking}
              @click=${()=>this._mark([e.entity_id])}
            >
              <ha-icon icon="mdi:battery-sync"></ha-icon>
            </button>`:h}
        ${i.jump&&o?this._jumpButton(e,t):h}
        ${i.predicted&&p!=null?n`<span
              class="bf-predicted ${e.predicted_source==="trend"?"bf-trend":""} ${e.forecast_overdue?"bf-overdue":""}"
              title=${this._predictedTitle(e,t)}
              >${e.forecast_overdue?n`<ha-icon icon="mdi:calendar-alert"></ha-icon>`:h}~${this._predictedDate(p)}</span
            >`:h}
        ${i.exclude&&o?n`<button
              class="bf-mark bf-exclude"
              title=${a("battery_fleet_exclude",t)}
              .disabled=${this._marking}
              @click=${()=>this._setExcluded(e.entity_id,!0)}
            >
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>
            </button>`:h}
      </div>
    `}render(){let e=this._lang;if(this._loading&&this._ov===null)return n`<div class="bf-card"><div class="bf-loading">…</div></div>`;let t=this._ov;if(!t)return this._error?n`<div class="bf-card"><div class="bf-error">${this._error}</div></div>`:h;let i=t.low.length;return n`
      <div class="bf-card">
        <div class="bf-head">
          <ha-icon icon="mdi:battery-alert"></ha-icon>
          <span class="bf-title">${a("battery_fleet_title",e)}</span>
          <span class="bf-count ${i?"bad":"ok"}">${i}</span>
        </div>
        ${this._error?n`<div class="bf-error">${this._error}</div>`:h}

        ${t.configured&&t.task_ok===!1?n`
              <div class="bf-repair">
                <span>${a("battery_fleet_trigger_lost",e)}</span>
                ${this._canWrite?n`<ha-button .disabled=${this._marking} @click=${this._repair}>
                      ${a("battery_fleet_repair",e)}
                    </ha-button>`:h}
              </div>
            `:h}

        ${i===0?n`<div class="bf-empty">${a("battery_fleet_none_low",e)}</div>`:n`
              <div class="bf-shopping">
                <span class="bf-label">${a("battery_fleet_buy_now",e)}</span>
                <span class="bf-list">${this._shoppingLine(t.needs_now)}</span>
              </div>
              <div class="bf-rows">
                ${t.low.map(s=>this._renderRow(s,e,{recharge:!0,mark:"always",exclude:!0}))}
              </div>
              ${this._canWrite?n`<div class="bf-actions">
                    <ha-button .disabled=${this._marking} @click=${this._markAll}>
                      <ha-icon icon="mdi:battery-sync"></ha-icon> ${a("battery_fleet_mark_all",e)}
                    </ha-button>
                  </div>`:h}
            `}

        ${t.charging?.length?n`
              <div class="bf-charging">
                <span class="bf-label">${a("battery_fleet_charging",e)}</span>
                ${t.charging.map(s=>n`<span class="bf-charge-item">
                    <span class="bf-charge-name">${s.name}</span>
                    <span>${a("battery_fleet_ready",e).replace("{count}",String(s.stock))}</span>
                    ${s.restoring>0?n`<span class="bf-charge-waiting">${a(`part_waiting_${s.reuse}`,e).replace("{count}",String(s.restoring))}</span>
                          ${this._canWrite?n`<button
                                class="bf-charged"
                                title=${a("part_ready_again_hint",e)}
                                .disabled=${this._marking}
                                @click=${()=>this._act({type:"maintenance_supporter/part/ready_again",entry_id:t.entry_id,part_id:s.part_id})}
                              ><ha-icon icon="mdi:battery-charging-100"></ha-icon>${a(`part_reuse_${s.reuse}`,e)}</button>`:h}`:h}
                  </span>`)}
              </div>
            `:h}
        ${t.soon.length?n`
              <div class="bf-soon">
                <span class="bf-label">${a("battery_fleet_soon",e)}</span>
                <span class="bf-list">${this._shoppingLine(t.needs_soon)}</span>
                <div class="bf-soon-hint">${a("battery_fleet_soon_hint",e)}</div>
              </div>
              <div class="bf-rows bf-soon-rows">
                ${t.soon.map(s=>this._renderRow(s,e,{mark:"replaced",predicted:!0}))}
              </div>
            `:h}
        ${t.all?.length?n`
              <details class="bf-roster" ?open=${this._rosterOpen()} @toggle=${this._loadHistory}>
                <summary>${a("battery_fleet_all",e)} (${t.all.length})</summary>
                <div class="bf-roster-tools">
                  <button
                    class="bf-sort ${this._rosterSort==="urgency"?"bf-sort-active":""}"
                    @click=${()=>this._setSort("urgency")}
                  >
                    ${a("battery_fleet_sort_urgency",e)}
                  </button>
                  <button
                    class="bf-sort ${this._rosterSort==="name"?"bf-sort-active":""}"
                    @click=${()=>this._setSort("name")}
                  >
                    ${a("battery_fleet_sort_name",e)}
                  </button>
                </div>
                <div class="bf-rows">
                  ${this._sortedRoster(t.all).map(s=>this._renderRow(s,e,{status:!0,recharge:!0,sparkline:!0,mark:"replaced",jump:!0,predicted:!0,exclude:!0}))}
                </div>
                <div class="bf-roster-hint">${a("battery_fleet_all_hint",e)}</div>
                ${this._canWrite?this._renderRosterSettings(t,e):h}
              </details>
            `:h}
        ${this._renderExcluded(t,e)}
        <div class="bf-total">${a("battery_fleet_total",e).replace("{n}",String(t.total))}</div>
      </div>
    `}_renderRosterSettings(e,t){return n`
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
    `}_renderExcluded(e,t){return n`
        ${e.excluded?.length?n`
              <div class="bf-excluded">
                <span class="bf-label">${a("battery_fleet_excluded",t)}</span>
                ${e.excluded.map(i=>n`
                    <span class="bf-excluded-chip">
                      ${i.device_name}
                      ${this._canWrite?n`<button
                            class="bf-mark"
                            title=${a("battery_fleet_include",t)}
                            .disabled=${this._marking}
                            @click=${()=>this._setExcluded(i.entity_id,!1)}
                          >
                            <ha-icon icon="mdi:eye-outline"></ha-icon>
                          </button>`:h}
                    </span>
                  `)}
              </div>
            `:h}
    `}};pe.styles=B`
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
  `,_([R({attribute:!1})],pe.prototype,"hass",2),_([R({type:Boolean})],pe.prototype,"flat",2),_([f()],pe.prototype,"_ov",2),_([f()],pe.prototype,"_loading",2),_([f()],pe.prototype,"_marking",2),_([f()],pe.prototype,"_error",2),_([f()],pe.prototype,"_history",2),_([f()],pe.prototype,"_rosterSort",2),_([f()],pe.prototype,"_typeFilter",2),_([f()],pe.prototype,"_recorded",2),_([f()],pe.prototype,"_access",2);var Qt=pe;customElements.get("maintenance-battery-fleet-section")||customElements.define("maintenance-battery-fleet-section",Qt);var vs=5;function aa(l,d){let e=[];for(let t=0;t<d;t++)e.push(Te(l,t));return e}function ra(l){if(!l||l.length===0)return null;let d=l.map(e=>Re(e)).filter(e=>e!==null&&e>=0);return d.length===0?null:d.reduce((e,t)=>e+t,0)/d.length}function na(l){let{windowStart:d,windowEnd:e,task:t,entryId:i,objectName:s}=l,r=[],c=(g,m)=>({date:g,entry_id:i,task_id:t.id,task_name:t.name,object_name:s,status:m&&(t.status==="overdue"||t.status==="triggered")?"ok":t.status,days_until_due:m?null:t.days_until_due??null,projected:m,schedule_type:t.schedule_type,interval_days:t.interval_days??null,interval_unit:t.interval_unit??null,responsible_user_id:t.responsible_user_id??null,avg_cost:ra(t.history),adaptive_enabled:!!t.adaptive_config?.enabled,prediction_confidence:t.threshold_prediction_confidence??null}),o=Math.max(1,Math.round(Wt(t.interval_days,t.interval_unit)));if(t.status==="overdue"||t.status==="triggered"){if(r.push(c(d,!1)),t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0){let g=Te(d,o),m=1;for(;g<=e&&m<vs;)r.push(c(g,!0)),m++,g=Te(g,o)}return r}let u=t.next_due;if(typeof u!="string"||!u)return r;let p=u.slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(p))return r;if(p>=d&&p<=e)r.push(c(p,!1));else if(p>e)return r;if(t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0){let g=Te(p,o),m=r.length;for(;g<=e&&m<vs;)g>=d&&(r.push(c(g,!0)),m++),g=Te(g,o)}return r}function bs(l,d,e,t=null){let i=aa(d,e),s=i[0],r=i[i.length-1],c=[];for(let u of l){let p=u.object?.name||"",g=u.entry_id,m=u.tasks||[];for(let v of m){if(t&&!tt(v,t)||v.enabled===!1)continue;let y=na({windowStart:s,windowEnd:r,task:v,entryId:g,objectName:p});c.push(...y)}}let o=new Map;for(let u of i)o.set(u,[]);for(let u of c){let p=o.get(u.date);p&&p.push(u)}for(let[,u]of o)u.sort((p,g)=>{let m=De(p.status),v=De(g.status);if(m!==v)return m-v;if(p.projected!==g.projected)return p.projected?1:-1;let y=p.object_name.localeCompare(g.object_name);return y!==0?y:p.task_name.localeCompare(g.task_name)});return i.map(u=>({date:u,events:o.get(u)??[]}))}var oa={completed:"ok",reset:"ok",skipped:"due_soon",missed:"overdue",triggered:"triggered",trigger_replaced:"triggered",trigger_removed:"ok"};function Et(l,d){return`${l}/${d}`}function ys(l,d,e){let t=xs(d,e)[0],i=[];for(let s of l)for(let r of s.tasks||[]){let c=r.history||[],o=r.history_count??c.length;if(o<=c.length)continue;let u=c.map(m=>It(m?.timestamp)).filter(m=>!!m),p=u.length?u.reduce((m,v)=>m<v?m:v):"";if(p&&p<t)continue;let g=Et(s.entry_id,r.id);i.push({entryId:s.entry_id,taskId:r.id,key:g,sig:`${g}:${o}:${la(JSON.stringify(c))}`})}return i}function la(l){let d=2166136261;for(let e=0;e<l.length;e++)d^=l.charCodeAt(e),d=Math.imul(d,16777619);return(d>>>0).toString(36)}function xs(l,d){let e=[];for(let t=d-1;t>=0;t--)e.push(Te(l,-t));return e}function ks(l,d,e,t=null,i={}){let s=xs(d,e),r=s[0],c=s[s.length-1],o=new Map;for(let p of s)o.set(p,[]);for(let p of l){let g=p.object?.name||"",m=p.entry_id,v=p.tasks||[];for(let y of v){if(t&&!tt(y,t))continue;let E=i[Et(m,y.id)]??(y.history||[]);for(let x of E){if(typeof x?.timestamp!="string")continue;let S=It(x.timestamp);if(!S||S<r||S>c)continue;let $=o.get(S);if(!$)continue;let C=x.type??"completed";$.push({date:S,entry_id:m,task_id:y.id,task_name:y.name,object_name:g,status:oa[C]??"ok",days_until_due:null,projected:!1,schedule_type:y.schedule_type,interval_days:y.interval_days??null,responsible_user_id:y.responsible_user_id??null,avg_cost:Re(x),adaptive_enabled:!!y.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:x.timestamp,history_type:C,history_cost:Re(x),history_notes:typeof x.notes=="string"?x.notes:null,history_duration:typeof x.duration=="number"?x.duration:null})}}}let u={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4};for(let[,p]of o)p.sort((g,m)=>{let v=u[g.history_type??""]??99,y=u[m.history_type??""]??99;if(v!==y)return v-y;let E=g.object_name.localeCompare(m.object_name);return E!==0?E:g.task_name.localeCompare(m.task_name)});return s.map(p=>({date:p,events:o.get(p)??[]}))}var ws=B`
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
`;function $s(l){let d=window;d.customCards=d.customCards||[],d.customCards.some(e=>e.type===l.type)||d.customCards.push(l)}function Ss(l,d,e=t=>import(t)){let t=window,i;try{let p=new URL(d);i=p.origin+p.pathname}catch{return}let s=`__msCardHeal:${l[0]}:${i}`;if(t[s])return;t[s]=!0;let r=0,c=0,o=!1,u=()=>{if(r+=1,l.some(g=>!customElements.get(g))&&c<3&&!o){c+=1,o=!0;try{let g=new URL(d);g.searchParams.set("heal",`${Date.now()}`),e(g.href).catch(()=>{}).finally(()=>{o=!1})}catch{return}}r<20&&window.setTimeout(u,r<8?500:2e3)};window.setTimeout(u,250)}var ge=class extends N{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._objectFilter="";this._configuredObjects=[];this._unsub=null;this._pastHistory={};this._pastHistorySig="";this._pastSeq=0;this._dataLoaded=!1;this._lastConnection=null;this._onHistorySaved=e=>{let t=e.detail;!t?.entry_id||!t.task_id||!(Et(t.entry_id,t.task_id)in this._pastHistory)||(this._pastHistorySig="",this._loadPastHistories())}}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(e){if(this._config={...e},this._windowDays=e.window_days&&[7,14,30,365].includes(e.window_days)?e.window_days:30,this._pastDays=e.past_days&&[30,90].includes(e.past_days)?e.past_days:0,this._userFilter=typeof e.user_filter=="string"?e.user_filter:"",typeof e.object_filter=="string")this._objectFilter=e.object_filter,this._configuredObjects=[];else if(Array.isArray(e.object_filter)){let t=e.object_filter.filter(i=>typeof i=="string"&&i!=="");this._objectFilter=t.length===1?t[0]:"",this._configuredObjects=t.length>1?t:[]}else this._objectFilter="",this._configuredObjects=[]}getCardSize(){return 6}get _lang(){return K(this.hass)}connectedCallback(){super.connectedCallback(),window.addEventListener("history-entry-saved",this._onHistorySaved)}disconnectedCallback(){if(super.disconnectedCallback(),window.removeEventListener("history-entry-saved",this._onHistorySaved),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._dataLoaded=!1,this._lastConnection=null}updated(e){if(super.updated(e),Be(this,e),this.hass&&this._pastDays>0&&(e.has("_objects")||e.has("_pastDays"))&&this._loadPastHistories(),e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[e,t]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=e.objects,this._stats=t,We(this._stats.budget)}catch{}}async _loadPastHistories(){let e=ys(this._objects,xe(),this._pastDays||30),t=e.map(r=>r.sig).join("|");if(t===this._pastHistorySig)return;this._pastHistorySig=t;let i=++this._pastSeq,s=await Promise.all(e.map(async r=>{try{let c=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:r.entryId,task_id:r.taskId});return[r.key,c.history??[]]}catch{return null}}));i===this._pastSeq&&(this._pastHistory=Object.fromEntries(s.filter(r=>r!==null)))}async _subscribe(){try{let e=await this.hass.connection.subscribeMessage(t=>{let i=t;this._objects=i.objects},{type:"maintenance_supporter/subscribe"});if(!this.isConnected){e();return}this._unsub=e}catch{}}_onEventClick(e){if(e.history_timestamp){this._openHistoryEntry(e);return}this._openTask(e)}_openTask(e){ls(e.entry_id,e.task_id)||this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:e.entry_id,task_id:e.task_id},bubbles:!0,composed:!0}))}async _openHistoryEntry(e){try{let t=await vt(this.hass);if(!Ne(this.hass?.user,t.access)){this._openTask(e);return}}catch{}try{let t=await Vi(this.hass,e.entry_id,e.task_id,e.history_timestamp);if(!t||os(t))return}catch{}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:e.entry_id,task_id:e.task_id,original_timestamp:e.history_timestamp},bubbles:!0,composed:!0}))}render(){if(!this.hass)return h;let e=this._lang,t=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,s=this._config.title,r=null;this._userFilter&&(r=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let c=b=>{let D=b.toLowerCase();return this._objects.find(he=>he.entry_id===b||he.object.name.toLowerCase()===D)?.entry_id??null},o=new Set(this._configuredObjects.map(c).filter(b=>b!==null)),u=o.size?this._objects.filter(b=>o.has(b.entry_id)):this._objects,p=this._config.show_object_filter!==!1&&u.length>1,g=this._objectFilter?c(this._objectFilter):null,m=g&&u.some(b=>b.entry_id===g)?u.filter(b=>b.entry_id===g):u,v=xe(),y=this._pastDays>0,E=y?ks(m,v,this._pastDays,r,this._pastHistory):bs(m,v,this._windowDays,r),x=this._windowDays===365||y,S=x?E.filter(b=>b.events.length>0):E,$=b=>{let D=`cal-status-${b.status}`,ae=b.projected?"cal-event-projected":"",he=b.status==="overdue"&&b.days_until_due!=null?` (${ke(b.days_until_due,e)})`:"",T=b.projected&&b.interval_days?n`<span class="cal-event-recur">${b.interval_unit&&b.interval_unit!=="days"?hi(b.interval_days,b.interval_unit,e):b.interval_days===1?a("cal_every_day",e):a("cal_every_n_days",e).replace("{n}",String(b.interval_days))}</span>`:h,z=b.schedule_type==="sensor_based",H=z?n`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${a("cal_source_sensor",e)}" icon="mdi:trending-up"></ha-icon>`:n`<ha-icon class="cal-event-icon cal-source-time"
                title="${b.adaptive_enabled?a("cal_source_time_adaptive",e):a("cal_source_time",e)}"
                icon="${b.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,I=z&&b.prediction_confidence&&b.status!=="triggered"&&!b.projected?n`<span class="cal-event-prediction cal-conf-${b.prediction_confidence}">
            ${a("cal_predicted",e)} · ${a(`cal_confidence_${b.prediction_confidence}`,e)}
          </span>`:h,W=lt(this._stats?.budget),G=b.history_type?a(b.history_type,e):a(b.status,e);return n`
        <div class="cal-event ${ae}"
          @click=${()=>this._onEventClick(b)}>
          ${H}
          <span class="cal-status-pill ${D}">${G}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${b.object_name} · ${b.task_name}${he}</div>
            ${I}
            ${T}
          </div>
          ${b.avg_cost!=null&&b.avg_cost!==0?n`<span class="cal-event-cost">${U(b.avg_cost,W,e)}</span>`:h}
        </div>
      `},C=b=>{let[D,ae,he]=b.date.split("-").map(Number),T=new Date(D,ae-1,he),z=b.date===v,H=ui(T,e,"short"),I=gi(T,e,"long");return n`
        <div class="cal-day-row">
          <div class="cal-day-pill ${z?"cal-today":""}">
            <span class="cal-pill-weekday">${H}</span>
            <span class="cal-pill-day">${T.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${I}</span>
              ${z?n`<span class="cal-day-today-badge">${a("today",e)}</span>`:h}
            </div>
            ${b.events.length===0?n`<div class="cal-empty">${a("cal_no_events",e)}</div>`:b.events.map($)}
          </div>
        </div>
      `};return n`
      <ha-card .header=${s}>
        ${t||i||p?n`
              <div class="cal-controls">
                ${t?n`
                      <div class="cal-window-chips cal-past-chips" title="${a("cal_past_windows",e)}">
                        ${[30,90].map(b=>n`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===b?"active":""}"
                            @click=${()=>{this._pastDays=b}}>
                            −${b}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${a("cal_forward_windows",e)}">
                        ${[7,14,30,365].map(b=>n`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===b?"active":""}"
                            @click=${()=>{this._windowDays=b,this._pastDays=0}}>
                            ${b===365?"+1y":`+${b}d`}
                          </button>
                        `)}
                      </div>
                    `:h}
                ${i?n`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${b=>{this._userFilter=b.target.value}}>
                        <option value="">${a("all_users",e)}</option>
                        <option value="current_user">${a("my_tasks",e)}</option>
                      </select>
                    `:h}
                ${p?n`
                      <select class="cal-user-filter"
                        .value=${g??""}
                        @change=${b=>{this._objectFilter=b.target.value}}>
                        <option value="">${a("all_objects",e)}</option>
                        ${[...u].sort((b,D)=>b.object.name.localeCompare(D.object.name)).map(b=>n`<option value=${b.entry_id} ?selected=${b.entry_id===g}>${b.object.name}</option>`)}
                      </select>
                    `:h}
              </div>
            `:h}
        <div class="cal-rolling">
          ${S.length===0&&x?n`<div class="cal-empty">${a("cal_no_events",e)}</div>`:S.map(C)}
        </div>
      </ha-card>
    `}};ge.styles=[dt,ws,B`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],_([R({attribute:!1})],ge.prototype,"hass",2),_([f()],ge.prototype,"_config",2),_([f()],ge.prototype,"_objects",2),_([f()],ge.prototype,"_stats",2),_([f()],ge.prototype,"_windowDays",2),_([f()],ge.prototype,"_pastDays",2),_([f()],ge.prototype,"_userFilter",2),_([f()],ge.prototype,"_objectFilter",2),_([f()],ge.prototype,"_unsub",2),_([f()],ge.prototype,"_pastHistory",2);var ca=[{value:7,key:"cal_editor_window_week"},{value:14,key:"cal_editor_window_fortnight"},{value:30,key:"cal_editor_window_month"},{value:365,key:"cal_editor_window_year"}],da=[{value:30,key:"cal_editor_window_past_30"},{value:90,key:"cal_editor_window_past_90"}],Ue=class extends N{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}get _lang(){return K(this.hass)}setConfig(e){this._config={...e}}updated(){let e=this._lang;e&&!At(e)&&ne(e).then(()=>{At(e)&&this.requestUpdate()})}_valueChanged(e,t){let i={...this._config,[e]:t};e==="show_window_chips"&&t===!0&&delete i.show_window_chips,e==="show_user_filter"&&t===!0&&delete i.show_user_filter,e==="show_object_filter"&&t===!0&&delete i.show_object_filter,e==="title"&&(!t||typeof t=="string"&&t.trim()==="")&&delete i.title,e==="user_filter"&&t===""&&delete i.user_filter,this._emit(i)}_windowChanged(e){let t={...this._config};e.startsWith("past-")?(t.past_days=Number(e.slice(5)),delete t.window_days):(t.window_days=Number(e),delete t.past_days),this._emit(t)}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){let e=this._lang,t=this._config.past_days?`past-${this._config.past_days}`:`${this._config.window_days??30}`,i=this._config.show_window_chips!==!1,s=this._config.show_user_filter!==!1,r=this._config.user_filter??"",c=this._config.title??"";return n`
      <div class="editor">
        <div class="row">
          <label for="title">${a("card_title",e)}</label>
          <input
            id="title"
            type="text"
            .value=${c}
            @input=${o=>this._valueChanged("title",o.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">${a("cal_editor_window",e)}</label>
          <select
            id="window"
            @change=${o=>this._windowChanged(o.target.value)}
          >
            ${ca.map(o=>n`<option value="${o.value}" ?selected=${`${o.value}`===t}>${a(o.key,e)}</option>`)}
            ${da.map(o=>n`<option value="past-${o.value}" ?selected=${`past-${o.value}`===t}>${a(o.key,e)}</option>`)}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">${a("cal_editor_show_chips",e)}</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${i}
            @change=${o=>this._valueChanged("show_window_chips",o.target.checked)}
          />
        </div>
        <div class="hint">${a("cal_editor_chips_hint",e)}</div>
        <div class="row toggle">
          <label for="userf">${a("cal_editor_show_user_filter",e)}</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${s}
            @change=${o=>this._valueChanged("show_user_filter",o.target.checked)}
          />
        </div>
        <div class="row">
          <label for="userv">${a("cal_editor_default_user",e)}</label>
          <select
            id="userv"
            @change=${o=>this._valueChanged("user_filter",o.target.value)}
          >
            <option value="" ?selected=${r===""}>${a("all_users",e)}</option>
            <option value="current_user" ?selected=${r==="current_user"}>
              ${a("cal_editor_my_tasks",e)}
            </option>
          </select>
        </div>
        <div class="row toggle">
          <label for="objf">${a("cal_editor_show_object_filter",e)}</label>
          <input
            id="objf"
            type="checkbox"
            .checked=${this._config.show_object_filter!==!1}
            @change=${o=>this._valueChanged("show_object_filter",o.target.checked)}
          />
        </div>
        <div class="hint">${a("cal_editor_object_hint",e)}</div>
      </div>
    `}};Ue.styles=B`
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
  `,_([R({attribute:!1})],Ue.prototype,"hass",2),_([f()],Ue.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",ge);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",Ue);Ss(["maintenance-supporter-calendar-card"],import.meta.url);$s({type:"maintenance-supporter-calendar-card",name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});var _e=class extends N{constructor(){super(...arguments);this.objects=[];this._summary=null;this._loaded=!1;this._busy=!1;this._error="";this._query="";this._results=[];this._expanded=!1;this._initiallyLoaded=!1;this._searchTimer=0;this._searchSeq=0}get _lang(){return K(this.hass)}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._initiallyLoaded&&(this._initiallyLoaded=!0,this._load(),ne(this._lang).then(()=>this.requestUpdate()))}async _load(){let e=await P(this,{type:"maintenance_supporter/documents/storage"},{busy:t=>{this._busy=t},onError:t=>{this._error=t}});this._loaded=!0,e!==void 0&&(this._summary=e,this._error="")}_nameFor(e){return this.objects.find(i=>i.object?.id===e)?.object?.name||e.slice(0,8)}_entryFor(e){return this.objects.find(t=>t.object?.id===e)?.entry_id}_toggle(){this._expanded=!this._expanded}_openObject(e){this.dispatchEvent(new CustomEvent("open-object",{detail:{entry_id:e},bubbles:!0,composed:!0}))}_onSearch(e){this._query=e.target.value,clearTimeout(this._searchTimer),this._searchTimer=window.setTimeout(()=>{this._doSearch()},250)}async _doSearch(){let e=this._query.trim(),t=++this._searchSeq;if(!e){this._results=[];return}let i="",s=await P(this,{type:"maintenance_supporter/documents/search",query:e},{onError:r=>{i=r}});if(t===this._searchSeq){if(s===void 0){this._error=i,this._results=[];return}this._results=s?.results||[]}}async _openResult(e){if(e.kind==="weblink"){ce(e.url)&&window.open(e.url,"_blank","noopener");return}await P(this,()=>Ee(this.hass,e.id),{onError:t=>{this._error=t}})}_renderResult(e,t){return n`
      <div class="obj-row result-row" title=${a("doc_open",t)} @click=${()=>this._openResult(e)}>
        <ha-icon icon=${e.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"}></ha-icon>
        <div class="result-info">
          <div class="result-title">${oe(e)}</div>
          <div class="result-obj">${e.object_name}</div>
        </div>
        <ha-icon class="result-open" icon=${e.kind==="weblink"?"mdi:open-in-new":"mdi:eye-outline"}></ha-icon>
      </div>
    `}render(){if(!this._loaded||!this._summary)return h;let e=this._summary;if(!e.document_count)return h;let t=this._lang,i=Object.entries(e.by_object??{}).filter(([,s])=>s.files>0||s.links>0).map(([s,r])=>({id:s,name:this._nameFor(s),entry:this._entryFor(s),...r})).sort((s,r)=>r.bytes-s.bytes);return n`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <button
              class="toggle"
              @click=${this._toggle}
              aria-expanded=${this._expanded?"true":"false"}
              aria-label=${a("doc_storage_title",t)}
            >
              <ha-icon class="chevron" icon=${this._expanded?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
              <span class="emoji">🗄️</span>
              <span class="title-text">${a("doc_storage_title",t)}</span>
              <span class="header-summary">
                ${we(e.total_bytes,t)}
                ${e.dedup_savings_bytes>0?n`<span class="saved">−${we(e.dedup_savings_bytes,t)}</span>`:h}
              </span>
            </button>
            <button
              class="icon-btn"
              title=${a("doc_storage_refresh",t)}
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
                      <div class="stat-value">${we(e.total_bytes,t)}</div>
                      <div class="stat-label">
                        <ha-icon icon="mdi:file-document-outline"></ha-icon> ${e.file_count}
                        <ha-icon icon="mdi:link-variant"></ha-icon> ${e.link_count}
                      </div>
                    </div>
                    ${e.dedup_savings_bytes>0?n`<div class="stat">
                          <div class="stat-value saved">−${we(e.dedup_savings_bytes,t)}</div>
                          <div class="stat-label">${a("doc_storage_saved",t)}</div>
                        </div>`:h}
                  </div>

                  ${e.search_index&&e.search_index.total>0?n`<div class="index-status">
                        <ha-icon icon="mdi:text-search"></ha-icon>
                        ${a("search_index_status",t).replace("{indexed}",String(e.search_index.indexed)).replace("{total}",String(e.search_index.total)).replace("{no_text}",String(e.search_index.no_text+e.search_index.unsupported)).replace("{pending}",String(e.search_index.pending))}
                      </div>`:h}
                  <div class="doc-search">
                    <ha-icon icon="mdi:magnify"></ha-icon>
                    <input
                      type="search"
                      aria-label=${a("doc_search",t)}
                      placeholder=${a("doc_search",t)}
                      .value=${this._query}
                      @input=${this._onSearch}
                    />
                  </div>

                  ${this._error?n`<div class="error">${this._error}</div>`:h}

                  ${this._query.trim()?this._results.length?n`<div class="obj-list">${this._results.map(s=>this._renderResult(s,t))}</div>`:n`<div class="search-empty">${a("doc_search_none",t)}</div>`:i.length?n`<div class="obj-list">${i.map(s=>this._renderObjRow(s,t))}</div>`:h}
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
        @keydown=${i?s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),this._openObject(i))}:void 0}
      >
        <span class="obj-name">${e.name}</span>
        <span class="obj-meta">
          ${e.files>0?n`<ha-icon icon="mdi:file-document-outline"></ha-icon>${e.files}`:h}
          ${e.links>0?n`<ha-icon icon="mdi:link-variant"></ha-icon>${e.links}`:h}
        </span>
        <span class="obj-size">${we(e.bytes,t)}</span>
        ${i?n`<ha-icon class="obj-go" icon="mdi:chevron-right"></ha-icon>`:h}
      </div>
    `}};_e.styles=B`
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
  `,_([R({attribute:!1})],_e.prototype,"hass",2),_([R({attribute:!1})],_e.prototype,"objects",2),_([f()],_e.prototype,"_summary",2),_([f()],_e.prototype,"_loaded",2),_([f()],_e.prototype,"_busy",2),_([f()],_e.prototype,"_error",2),_([f()],_e.prototype,"_query",2),_([f()],_e.prototype,"_results",2),_([f()],_e.prototype,"_expanded",2);customElements.get("maintenance-storage-section-card")||customElements.define("maintenance-storage-section-card",_e);var pa=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"],be=class extends N{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId="";this._values=new Array(12).fill("");this._save=async()=>{let e=this._buildOverrides();e!==null&&await this._send(e)!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved")))};this._clearAll=async()=>{await this._send({})!==void 0&&(this._values=new Array(12).fill(""),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved")))}}get _lang(){return K(this.hass)}open(e,t,i){if(this._entryId=e,this._taskId=t,this._values=new Array(12).fill(""),i)for(let[s,r]of Object.entries(i)){let c=parseInt(s,10);c>=1&&c<=12&&typeof r=="number"&&(this._values[c-1]=r.toString())}this._error="",this._open=!0}_close(){this._open=!1}_buildOverrides(){let e={};for(let t=0;t<12;t++){let i=this._values[t].trim();if(!i)continue;let s=parseFloat(i);if(Number.isNaN(s))return this._error=`${a("month_"+["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][t],this._lang)}: ${a("seasonal_override_invalid",this._lang)}`,null;if(s<Xe[0]||s>Xe[1])return this._error=a("seasonal_override_range",this._lang),null;e[t+1]=s}return e}_send(e){return this._error="",P(this,{type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:e},{busy:t=>{this._loading=t},fallbackKey:"save_error",onError:t=>{this._error=t}})}render(){if(!this._open)return n``;let e=this._lang;return n`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${a("seasonal_overrides_title",e)}</div>
        <div class="content">
          <p class="hint">${a("seasonal_overrides_hint",e)}</p>
          ${this._error?n`<div class="error">${this._error}</div>`:h}
          <div class="months">
            ${pa.map((t,i)=>n`
              <label class="month">
                <span class="mn">${a(t,e)}</span>
                <input type="number" step="0.1" min=${Xe[0]} max=${Xe[1]}
                  placeholder="1.0"
                  .value=${this._values[i]}
                  @input=${s=>{let r=[...this._values];r[i]=s.target.value,this._values=r}} />
              </label>
            `)}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._clearAll} .disabled=${this._loading}>
            ${a("clear_all",e)}
          </ha-button>
          <div class="spacer"></div>
          <ha-button appearance="plain" @click=${this._close}>
            ${a("cancel",e)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading}>
            ${this._loading?a("saving",e):a("save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};be.styles=B`
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
  `,_([R({attribute:!1})],be.prototype,"hass",2),_([f()],be.prototype,"_open",2),_([f()],be.prototype,"_loading",2),_([f()],be.prototype,"_error",2),_([f()],be.prototype,"_entryId",2),_([f()],be.prototype,"_taskId",2),_([f()],be.prototype,"_values",2);customElements.get("maintenance-seasonal-overrides-dialog")||customElements.define("maintenance-seasonal-overrides-dialog",be);var fe=class extends N{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._groupId=null;this._name="";this._description="";this._selected=new Set;this._toggleTask=(e,t)=>{let i=`${e}:${t}`,s=new Set(this._selected);s.has(i)?s.delete(i):s.add(i),this._selected=s};this._save=async()=>{let e=this._name.trim();if(!e){this._error=a("group_name_required",this._lang);return}this._error="";let t=this._buildTaskRefs();await P(this,this._groupId?{type:"maintenance_supporter/group/update",group_id:this._groupId,name:e,description:this._description,task_refs:t}:{type:"maintenance_supporter/group/create",name:e,description:this._description,task_refs:t},{busy:s=>{this._loading=s},fallbackKey:"save_error",onError:s=>{this._error=s}})!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("group-saved")))}}get _lang(){return K(this.hass)}openCreate(){this._reset(),this._open=!0}openEdit(e,t){this._reset(),this._groupId=e,this._name=t.name,this._description=t.description||"",this._selected=new Set(t.task_refs.map(i=>`${i.entry_id}:${i.task_id}`)),this._open=!0}_reset(){this._groupId=null,this._name="",this._description="",this._selected=new Set,this._error=""}_close(){this._open=!1}_buildTaskRefs(){return[...this._selected].map(e=>{let[t,i]=e.split(":",2);return{entry_id:t,task_id:i}})}render(){if(!this._open)return n``;let e=this._lang,t=this._groupId?a("edit_group",e):a("new_group",e);return n`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?n`<div class="error">${this._error}</div>`:h}
          <ms-textfield
            label="${a("name",e)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${a("description_optional",e)}"
            .value=${this._description}
            @input=${i=>this._description=i.target.value}
          ></ms-textfield>

          <div class="section-title">${a("group_select_tasks",e)}</div>
          ${this.objects.length===0?n`<div class="hint">${a("no_objects",e)}</div>`:n`
              <div class="objects">
                ${[...this.objects].sort((i,s)=>i.object.name.localeCompare(s.object.name)).map(i=>n`
                  <div class="object-block">
                    <div class="object-name">${i.object.name}</div>
                    ${i.tasks.length===0?n`<div class="hint small">${a("no_tasks_short",e)}</div>`:[...i.tasks].sort((s,r)=>s.name.localeCompare(r.name)).map(s=>{let r=`${i.entry_id}:${s.id}`,c=this._selected.has(r);return n`
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
            ${a("selected",e)}: ${this._selected.size}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${a("cancel",e)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading||!this._name.trim()}>
            ${this._loading?a("saving",e):a("save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};fe.styles=B`
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
  `,_([R({attribute:!1})],fe.prototype,"hass",2),_([R({attribute:!1})],fe.prototype,"objects",2),_([f()],fe.prototype,"_open",2),_([f()],fe.prototype,"_loading",2),_([f()],fe.prototype,"_error",2),_([f()],fe.prototype,"_groupId",2),_([f()],fe.prototype,"_name",2),_([f()],fe.prototype,"_description",2),_([f()],fe.prototype,"_selected",2);customElements.get("maintenance-group-dialog")||customElements.define("maintenance-group-dialog",fe);var $e=class extends N{constructor(){super(...arguments);this._open=!1;this._busy=!1;this._error="";this._name="";this._views=[];this._filters=null;this._localeReady=!1;this._save=async()=>{let e=this._name.trim();if(!e||this._busy||!this._filters)return;let t=await this._runWs({type:"maintenance_supporter/views/save",name:e,filters:this._filters});t!==void 0&&(this._name="",this._emitChanged(t?.views||[]))};this._delete=async e=>{if(this._busy)return;let t=await this._runWs({type:"maintenance_supporter/views/delete",view_id:e});t!==void 0&&this._emitChanged(t?.views||[])}}get _lang(){return K(this.hass)}updated(e){e.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,ne(this._lang).then(()=>this.requestUpdate())),e.has("_open")&&this._open&&Gi(this.shadowRoot)}async open(e,t){this._open=!0,this._error="",this._name="",this._filters=e,this._views=t}_close(){this._open=!1}_emitChanged(e){this._views=e,this.dispatchEvent(new CustomEvent("saved-views-changed",{bubbles:!0,composed:!0,detail:{views:e}}))}_runWs(e){return this._error="",P(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}render(){if(!this._open)return n``;let e=this._lang;return Ki(()=>this._close(),n`
        <div class="title">${a("views_dialog_title",e)}</div>
        <div class="hint">${a("views_dialog_hint",e)}</div>
        ${this._error?n`<div class="error">${this._error}</div>`:h}

        <div class="save-row">
          <input
            class="name-input"
            type="text"
            .value=${this._name}
            placeholder=${a("views_name_placeholder",e)}
            maxlength="60"
            @input=${t=>this._name=t.target.value}
            @keydown=${t=>{t.key==="Enter"&&this._save()}}
          />
          <ha-button @click=${this._save} .disabled=${!this._name.trim()||this._busy}>
            ${a("views_save_current",e)}
          </ha-button>
        </div>

        ${this._views.length===0?n`<div class="empty">${a("views_none_yet",e)}</div>`:n`
              <div class="list dialog-scroll">
                ${this._views.map(t=>n`
                    <div class="row">
                      <span class="row-name">${t.name}</span>
                      <ha-icon-button
                        .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                        .label=${a("delete",e)}
                        @click=${()=>this._delete(t.id)}
                      ></ha-icon-button>
                    </div>
                  `)}
              </div>
            `}

        <div class="actions">
          <ha-button appearance="plain" @click=${this._close}>${a("close",e)}</ha-button>
        </div>
    `)}};$e.styles=[Wi,B`
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
  `],_([R({attribute:!1})],$e.prototype,"hass",2),_([f()],$e.prototype,"_open",2),_([f()],$e.prototype,"_busy",2),_([f()],$e.prototype,"_error",2),_([f()],$e.prototype,"_name",2),_([f()],$e.prototype,"_views",2);customElements.get("maintenance-saved-views-dialog")||customElements.define("maintenance-saved-views-dialog",$e);var ha=60,ua=20,js=30,ga={approaching:"\u2197",stable:"\u2192",easing:"\u2198"};function Xt(l,d){let e=l.trigger_config,t=me(e);if(!e||!t||l.battery_fleet_task)return null;let i,s=e.type||"threshold";if(s==="threshold")if(e.trigger_above!=null)i=1;else if(e.trigger_below!=null)i=-1;else return null;else if(s==="counter"||s==="runtime"||s==="state_change")i=1;else return null;let r=d.get(t)||[],c=s==="runtime"||s==="state_change",o=r.length>=2?r.map(E=>({ts:E.ts,val:E.val})):c?[]:(l.history||[]).filter(E=>E.trigger_value!=null).map(E=>({ts:ve(E.timestamp),val:E.trigger_value}));if(l.trigger_current_value!=null&&(o=[...o,{ts:Date.now(),val:l.trigger_current_value}]),o.length<2)return null;o.sort((E,x)=>E.ts-x.ts);let u=o.map(E=>E.val),p=Math.max(...u)-Math.min(...u),g=u[u.length-1]-u[0],m=e.trigger_delta_mode&&l.trigger_baseline_value!=null&&e.trigger_target_value!=null?l.trigger_baseline_value+e.trigger_target_value:e.trigger_target_value,v=s==="threshold"?e.trigger_above??e.trigger_below:s==="counter"?m:s==="runtime"?e.trigger_runtime_hours:e.trigger_target_changes,y=typeof v=="number"?Math.max(Math.abs(v-u[0]),p):p;return y===0||Math.abs(g)<y*(typeof v=="number"?.05:.15)?"stable":Math.sign(g)===i?"approaching":"easing"}function it(l){return l>0?Math.ceil(l):Math.trunc(l)||0}function Jt(l,d){let e=l.trigger_config??null;if(!e)return h;let t=e.type||"threshold",i=l.trigger_entity_info?.unit_of_measurement??"",s=0,r="",c="";if(t==="threshold"){let p=l.trigger_current_value??null;if(p==null)return h;let g=e.trigger_above,m=e.trigger_below;if(g!=null&&m!=null){let v=(g+m)/2,y=Math.abs(g-m)/2||1;s=Math.min(100,Math.max(0,Math.abs(p-v)/y*100));let E=Math.abs(p-g)<=Math.abs(p-m)?g:m;r=`${ue(p,"",d?.lang)} / ${se(E,d?.lang)}`,c=i}else if(g!=null){let v=l.trigger_entity_info?.min,y=g>0?0:v!=null&&v<g?v:g<0?2*g:-100,E=g-y||1;s=Math.min(100,Math.max(0,(p-y)/E*100)),r=`${ue(p,"",d?.lang)} / ${se(g,d?.lang)}`,c=i}else if(m!=null){let v=l.trigger_entity_info?.max,y=v!=null&&v>m?v:m>0?m*2:m<0?0:100,E=y-m||1;s=Math.min(100,Math.max(0,(y-p)/E*100)),r=`${ue(p,"",d?.lang)} / ${se(m,d?.lang)}`,c=i}else if(e.trigger_equals!=null||e.trigger_not_equals!=null){let v=e.trigger_equals!=null?`= ${e.trigger_equals}`:`\u2260 ${e.trigger_not_equals}`;r=`${ue(p,"",d?.lang)} (${v}${i?` ${i}`:""})`,s=l.trigger_active?100:0}else return h}else if(t==="counter"){let p=e.trigger_target_value||1,g;if(e.trigger_delta_mode?(g=l.trigger_current_delta??null,g==null&&l.trigger_baseline_value!=null&&l.trigger_current_value!=null&&(g=l.trigger_current_value-l.trigger_baseline_value)):g=l.trigger_current_value??null,g==null)return h;s=Math.min(100,Math.max(0,g/p*100)),r=`${ue(g,"",d?.lang)} / ${se(p,d?.lang)}`,c=i}else if(t==="state_change"){let p=e.trigger_target_changes||1,g=l.trigger_current_value??null;if(g==null)return h;s=Math.min(100,Math.max(0,g/p*100)),r=`${se(g,d?.lang,0)} / ${se(p,d?.lang,0)}`}else if(t==="runtime"){let p=e.trigger_runtime_hours||100,g=l.trigger_current_value??null;if(g==null)return h;s=Math.min(100,Math.max(0,g/p*100)),r=`${ue(g,"",d?.lang)}h / ${se(p,d?.lang)}h`}else if(t==="due_date"){let p=l.trigger_current_value??null;if(p==null)return h;let g=e.trigger_days_before??0;s=p<=g?100:Math.max(0,100-(p-g)/30*100),r=ke(it(p),d?.lang)}else if(t==="compound"){let p=e.compound_logic||e.operator||"AND",g=e.conditions?.length||0;r=`${p} (${g})`,s=l.trigger_active?100:0}else return h;if(l.battery_fleet_task&&t==="threshold"&&l.trigger_current_value!=null){let p=Math.round(l.trigger_current_value),g=e.trigger_above??0;s=p>g?100:g>0?Math.max(0,p/(g+1)*100):0,r=a("battery_fleet_progress",d?.lang??"en").replace("{n}",se(p,d?.lang,0)),c=""}let o=s>=100,u=s>90?"var(--error-color, #f44336)":s>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return n`
    <div class="trigger-progress">
      <div class="trigger-progress-bar">
        <div class="trigger-progress-fill${o?" overflow":""}" style="width:${s}%;background:${u}"></div>
      </div>
      <span class="trigger-progress-label"><span class="trigger-progress-text"><span class="tp-num">${r}</span>${c?n` <span class="tp-unit">${c}</span>`:h}</span>${d?.trend?n`<i class="trend-arrow trend-${d.trend}" title="${a(`trend_${d.trend}`,d.lang??"en")}" aria-label="${a(`trend_${d.trend}`,d.lang??"en")}">${ga[d.trend]}</i>`:h}</span>
    </div>
  `}function Zt(l,d,e){let t=me(l.trigger_config);if(!t||l.battery_fleet_task)return h;let i=d.get(t)||[],s=[];if(i.length>=2)s=i.map(b=>({ts:b.ts,val:b.val}));else{if(!l.history)return h;for(let b of l.history)b.trigger_value!=null&&s.push({ts:ve(b.timestamp),val:b.trigger_value})}if(l.trigger_current_value!=null&&s.push({ts:Date.now(),val:l.trigger_current_value}),s.length<2)return h;s.sort((b,D)=>b.ts-D.ts);let r=ha,c=ua,o=s.map(b=>b.val),u=Math.min(...o),p=Math.max(...o),g=p-u||1;u-=g*.1,p+=g*.1;let m=s[0].ts,y=s[s.length-1].ts-m||1,E=b=>(b-m)/y*r,x=b=>2+(1-(b-u)/(p-u))*(c-4),S=s;if(S.length>js){let b=Math.ceil(S.length/js);S=S.filter((D,ae)=>ae%b===0||ae===S.length-1)}let $=S.map(b=>`${O(E(b.ts))},${O(x(b.val))}`).join(" "),C=l.trigger_active?"var(--error-color, #f44336)":"var(--primary-color)";return n`
    <svg class="mini-sparkline" viewBox="0 0 ${r} ${c}" preserveAspectRatio="none" role="img" aria-label="${a("chart_mini_sparkline",e)}">
      <polyline points="${$}" fill="none" stroke="${C}" stroke-width="1.5" stroke-linejoin="round" />
    </svg>
  `}function ei(l,d,e,t="due-text"){if(l==null){let i=ct(d,e);if(i)return n`<span class="${t} last-done" title="${a("last_performed",e)}: ${q(d,e)}">${i}</span>`}return n`<span class="${t}">${ke(l,e)}</span>`}function Ts(l,d){let e=d;if(l.days_until_due==null||!l.interval_days||l.interval_days<=0)return h;let{pct:t,overflow:i}=kt(l.interval_days,l.days_until_due,l.interval_unit),s="var(--success-color, #4caf50)";return l.status==="overdue"?s="var(--error-color, #f44336)":l.status==="due_soon"&&(s="var(--warning-color, #ff9800)"),n`
    <div class="days-progress">
      <div class="days-progress-labels">
        <span>${l.last_performed?`${a("last_performed",e)}: ${q(l.last_performed,e)}`:""}</span>
        <span>${l.next_due?`${a("next_due",e)}: ${q(l.next_due,e)}`:""}</span>
      </div>
      <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(t)}" aria-valuemin="0" aria-valuemax="100" aria-label="${a("days_progress",e)}">
        <div class="days-progress-fill${i?" overflow":""}" style="width:${t}%;background:${s}"></div>
      </div>
      <div class="days-progress-text">${ke(l.days_until_due,e)}</div>
    </div>
  `}var Rt=210,ye=46,Ce=14,Me=12,Es=14,ma=20+Es,_a=[{days:7,key:"chart_range_7d"},{days:30,key:"chart_range_30d"},{days:90,key:"chart_range_90d"},{days:365,key:"chart_range_1y"}],J=class extends N{constructor(){super(...arguments);this.points=[];this.events=[];this.unit="";this.lang="en";this.thresholdAbove=null;this.thresholdBelow=null;this.targetValue=null;this.targetMark="\u25C6";this.forceZero=!1;this.projection=null;this.rangeDays=30;this.showRange=!0;this.busy=!1;this.hideOutliers=!1;this.showOutlierToggle=!0;this._width=0;this._hover=null;this._ro=null}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(e=>{let t=Math.floor(e[0]?.contentRect?.width||0);t&&Math.abs(t-this._width)>2&&(this._width=t)}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=null}_emitRange(e){e!==this.rangeDays&&this.dispatchEvent(new CustomEvent("range-change",{detail:{days:e},bubbles:!0,composed:!0}))}_toggleOutliers(){this.dispatchEvent(new CustomEvent("outlier-toggle",{detail:{hide:!this.hideOutliers},bubbles:!0,composed:!0}))}render(){let e=this._width||320,t=[...this.points].sort((s,r)=>s.ts-r.ts),i=this.lang;return n`
      <div class="chart-wrap">
        ${this.showRange?n`<div class="range-chips" role="group">
              ${this.showOutlierToggle?n`<button
                    class="range-chip outlier-chip ${this.hideOutliers?"active":""}"
                    ?disabled=${this.busy}
                    title=${a("hide_outliers",i)}
                    @click=${()=>this._toggleOutliers()}
                  ><ha-icon icon="mdi:filter-variant"></ha-icon></button>`:h}
              ${_a.map(s=>n`<button
                  class="range-chip ${this.rangeDays===s.days?"active":""}"
                  ?disabled=${this.busy}
                  @click=${()=>this._emitRange(s.days)}
                >${a(s.key,i)}</button>`)}
            </div>`:h}
        ${t.length<2?n`<div class="chart-empty">
              <ha-icon icon="mdi:chart-line"></ha-icon> ${a("loading_chart",i)}
            </div>`:this._renderSvg(e,t)}
      </div>
    `}_renderSvg(e,t){let i=this.lang,s=e-ye-Ce,r=Rt-ma,c=r-Me,o=1/0,u=-1/0;for(let j of t)o=Math.min(o,j.min??j.val),u=Math.max(u,j.max??j.val);this.thresholdAbove!=null&&(o=Math.min(o,this.thresholdAbove),u=Math.max(u,this.thresholdAbove)),this.thresholdBelow!=null&&(o=Math.min(o,this.thresholdBelow),u=Math.max(u,this.thresholdBelow)),this.targetValue!=null&&(o=Math.min(o,this.targetValue),u=Math.max(u,this.targetValue)),this.forceZero&&(o=Math.min(o,0));let p=(u-o||1)*.06,g=this.forceZero&&o>=0?0:o>=0?Math.max(0,o-p):o-p,{ticks:m,niceMin:v,niceMax:y}=Je(g,u+p,4);o>=0&&v<0&&(v=0,m=m.filter(j=>j>=0));let E=m.length>1?m[1]-m[0]:0,x=t[0].ts,S=this.projection&&this.projection.length===2?this.projection[1].ts:null,$=S!=null?Math.max(t[t.length-1].ts,S):t[t.length-1].ts,C=$-x||1,b=j=>ye+(j-x)/C*s,D=j=>Me+(1-(j-v)/(y-v||1))*c,ae=t.map(j=>`${O(b(j.ts))},${O(D(j.val))}`).join(" "),he=`M${O(b(t[0].ts))},${r} `+t.map(j=>`L${O(b(j.ts))},${O(D(j.val))}`).join(" ")+` L${O(b(t[t.length-1].ts))},${r} Z`,T="",z=t.filter(j=>j.min!=null&&j.max!=null);if(z.length>=2){let j=z.map(re=>`${O(b(re.ts))},${O(D(re.max))}`),Y=[...z].reverse().map(re=>`${O(b(re.ts))},${O(D(re.min))}`);T=`M${j[0]} `+j.slice(1).map(re=>`L${re}`).join(" ")+` L${Y.join(" L")} Z`}let H=[];if(this.thresholdBelow!=null){let j=D(this.thresholdBelow);H.push({y:j,h:Math.max(0,r-j),lineY:j,label:`\u25BC ${Oe(this.thresholdBelow,i)}`,labelY:Math.min(r-4,j+13)})}if(this.thresholdAbove!=null){let j=D(this.thresholdAbove);H.push({y:Me,h:Math.max(0,j-Me),lineY:j,label:`\u25B2 ${Oe(this.thresholdAbove,i)}`,labelY:Math.max(Me+11,j-5)})}let I=t[t.length-1],W=(this.events||[]).filter(j=>j.ts>=x&&j.ts<=$),G=yt(x,$,Math.max(2,Math.min(5,Math.floor(s/110)+1))),X=this._hover;return n`
      <div class="svg-holder">
        <svg
          class="chart-svg"
          viewBox="0 0 ${e} ${Rt}"
          width=${e}
          height=${Rt}
          role="img"
          aria-label=${a("chart_sparkline",i)}
          @pointermove=${j=>this._onPointer(j,t,b,D,e)}
          @pointerdown=${j=>this._onPointer(j,t,b,D,e)}
          @pointerleave=${()=>this._hover=null}
        >
          <defs>
            <clipPath id="plot"><rect x="${ye}" y="${Me}" width="${s}" height="${c}" /></clipPath>
            ${H.length?Q`<clipPath id="danger">${H.map(j=>Q`<rect x="${ye}" y="${O(j.y)}" width="${s}" height="${O(j.h)}" />`)}</clipPath>`:h}
            <!-- Diagonal hatch so the danger zone reads without relying on the
                 red tint alone (dark-theme contrast + colour-blind support). -->
            <pattern id="dangerHatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
              <rect width="7" height="7" fill="var(--error-color, #f44336)" opacity="0.10" />
              <line x1="0" y1="0" x2="0" y2="7" stroke="var(--error-color, #f44336)" stroke-width="1.4" opacity="0.5" />
            </pattern>
          </defs>

          ${m.map(j=>{let Y=D(j);return Y<Me-1||Y>r+1?h:Q`
              <line x1="${ye}" y1="${O(Y)}" x2="${e-Ce}" y2="${O(Y)}"
                stroke="var(--divider-color)" stroke-width="1" opacity="0.6" />
              <text x="${ye-7}" y="${O(Y+3.5)}" text-anchor="end" class="tick-label">${qi(j,E,i)}</text>`})}

          ${H.map(j=>Q`<rect x="${ye}" y="${O(j.y)}" width="${s}" height="${O(j.h)}"
              fill="url(#dangerHatch)" />`)}

          ${T?Q`<path d="${T}" fill="var(--primary-color)" opacity="0.08" clip-path="url(#plot)" />`:h}
          <path d="${he}" fill="var(--primary-color)" opacity="0.10" clip-path="url(#plot)" />
          <polyline points="${ae}" fill="none" stroke="var(--primary-color)" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" clip-path="url(#plot)" />
          ${H.length?Q`<polyline points="${ae}" fill="none" stroke="var(--error-color, #f44336)" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" clip-path="url(#danger)" />`:h}

          ${H.map(j=>Q`
              <line x1="${ye}" y1="${O(j.lineY)}" x2="${e-Ce}" y2="${O(j.lineY)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${e-Ce-4}" y="${O(j.labelY)}" text-anchor="end" class="zone-label">${j.label}</text>`)}

          ${this.targetValue!=null?Q`<line x1="${ye}" y1="${O(D(this.targetValue))}" x2="${e-Ce}" y2="${O(D(this.targetValue))}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${e-Ce-4}" y="${O(D(this.targetValue)-5)}" text-anchor="end" class="zone-label">${this.targetMark} ${Oe(this.targetValue,i)} ${this.unit}</text>`:h}

          ${this.projection&&this.projection.length===2?Q`<line x1="${O(b(this.projection[0].ts))}" y1="${O(D(this.projection[0].val))}"
                x2="${O(Math.min(b(this.projection[1].ts),e-Ce))}" y2="${O(D(Math.max(v,Math.min(y,this.projection[1].val))))}"
                stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.8" />`:h}

          ${G.map((j,Y)=>{let re=b(j),Ie=Y===0?"start":Y===G.length-1?"end":"middle",ie=Bt(j,i,x,$);return Y>0&&ie===Bt(G[Y-1],i,x,$)?h:Q`<text x="${O(re)}" y="${Rt-5}" text-anchor="${Ie}" class="tick-label">${ie}</text>`})}

          <line x1="${ye}" y1="${r}" x2="${e-Ce}" y2="${r}" stroke="var(--divider-color)" stroke-width="1" />

          ${W.map(j=>{let Y=b(j.ts),re=j.type==="completed"?"var(--success-color, #4caf50)":j.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return Q`
              <line x1="${O(Y)}" y1="${Me}" x2="${O(Y)}" y2="${r}" stroke="${re}" stroke-width="1" opacity="0.14" />
              <rect x="${O(Y-1.5)}" y="${r+3}" width="3" height="${Es-6}" rx="1.5" fill="${re}">
                <title>${Nt(j.ts,i)}</title>
              </rect>`})}

          ${X?Q`
                <line x1="${O(X.x)}" y1="${Me}" x2="${O(X.x)}" y2="${r}"
                  stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.7" />
                <circle cx="${O(X.x)}" cy="${O(X.y)}" r="4.5" fill="var(--primary-color)"
                  stroke="var(--card-background-color, #fff)" stroke-width="2" />`:Q`<circle cx="${O(b(I.ts))}" cy="${O(D(I.val))}" r="4" fill="var(--primary-color)"
                stroke="var(--card-background-color, #fff)" stroke-width="1.5" />`}
        </svg>
        ${X?n`<div
              class="hover-chip"
              style="left:${Math.min(Math.max(X.x,70),e-70)}px"
            >
              <div class="hover-date">${Nt(X.p.ts,i)}</div>
              <div class="hover-val">
                ${ue(X.p.val,this.unit,i)}
                ${X.p.min!=null&&X.p.max!=null?n`<span class="hover-range">(${Oe(X.p.min,i)}–${Oe(X.p.max,i)})</span>`:h}
              </div>
            </div>`:h}
      </div>
    `}_onPointer(e,t,i,s,r){let o=e.currentTarget.getBoundingClientRect(),u=(e.clientX-o.left)/o.width*r;if(u<ye-8||u>r-Ce+8){this._hover=null;return}let p=t[0],g=1/0;for(let m of t){let v=Math.abs(i(m.ts)-u);v<g&&(g=v,p=m)}this._hover={x:i(p.ts),y:s(p.val),p}}};J.styles=B`
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
  `,_([R({attribute:!1})],J.prototype,"points",2),_([R({attribute:!1})],J.prototype,"events",2),_([R()],J.prototype,"unit",2),_([R()],J.prototype,"lang",2),_([R({attribute:!1})],J.prototype,"thresholdAbove",2),_([R({attribute:!1})],J.prototype,"thresholdBelow",2),_([R({attribute:!1})],J.prototype,"targetValue",2),_([R()],J.prototype,"targetMark",2),_([R({type:Boolean})],J.prototype,"forceZero",2),_([R({attribute:!1})],J.prototype,"projection",2),_([R({attribute:!1})],J.prototype,"rangeDays",2),_([R({type:Boolean})],J.prototype,"showRange",2),_([R({type:Boolean})],J.prototype,"busy",2),_([R({type:Boolean})],J.prototype,"hideOutliers",2),_([R({type:Boolean})],J.prototype,"showOutlierToggle",2),_([f()],J.prototype,"_width",2),_([f()],J.prototype,"_hover",2);customElements.get("maintenance-trigger-chart")||customElements.define("maintenance-trigger-chart",J);function Rs(l){let d=(l??"").trim().toLowerCase();return d==="on"||d==="open"||d==="true"?1:d==="off"||d==="closed"||d==="false"?0:null}function fa(l,d,e){if(l.length<2)return null;let t=e.now??Date.now(),i=Math.max(0,d.trigger_for_minutes??0)*6e4,s=d.trigger_from_state?Rs(d.trigger_from_state):null,r=d.trigger_to_state?Rs(d.trigger_to_state):null;if(d.trigger_from_state&&s===null||d.trigger_to_state&&r===null)return null;let c=[...l].sort(($,C)=>$.ts-C.ts),o=[];for(let $ of c){let C=o[o.length-1];(!C||C.level!==$.val)&&o.push({start:$.ts,level:$.val})}let u=$=>($+1<o.length?o[$+1].start:t)-o[$].start>=i,p=($,C,b)=>{let D=$[$.length-1];D&&D.val!==b&&$.push({ts:C,val:D.val}),$.push({ts:C,val:b})};if((d.trigger_target_changes??1)===1&&r!==null){let $=[];o.forEach((b,D)=>p($,b.start,b.level===r&&u(D)?1:0));let C=$[$.length-1]?.val??0;return $.push({ts:t,val:C}),{points:$,mode:"alarm"}}let m=e.since??o[0].start,v=0,y=[];for(let $=1;$<o.length;$++){let C=o[$-1],b=o[$];s!==null&&C.level!==s||r!==null&&b.level!==r||!u($)||b.start<m||(v+=1,y.push(b.start))}let E=Math.max(0,(e.current??v)-v),x=[{ts:Math.max(m,o[0].start),val:E}],S=E;for(let $ of y)S+=1,p(x,$,S);return x.push({ts:t,val:S}),{points:x,mode:"count"}}function va(l){if(l.length<4)return l;let d=l.map(u=>u.val).sort((u,p)=>u-p),e=u=>{let p=(d.length-1)*u,g=Math.floor(p),m=Math.ceil(p);return d[g]+(d[m]-d[g])*(p-g)},t=e(.25),i=e(.75),s=i-t;if(s===0)return l;let r=t-1.5*s,c=i+1.5*s,o=l.filter(u=>u.val>=r&&u.val<=c);return o.length>=2?o:l}function Os(l,d){let e=l.trigger_config;if(!e)return h;let t=d.lang,i=l.trigger_entity_info,s=l.trigger_entity_infos,r=me(e)||"",c=i?.friendly_name||r||"\u2014",o=qt(e),u=i?.unit_of_measurement||"",p=l.trigger_current_value,g=e.type||"threshold",m=o.length>1,v=ba(l,u,d);return n`
    <h3>${a("trigger",t)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${m?n`
            <div class="trigger-entity-name">${o.length} ${a("entities",t)} (${e.entity_logic||"any"})</div>
            <div class="trigger-entity-id">${o.map((y,E)=>n`${E>0?", ":""}<span class="entity-link" @click=${x=>Ye(x,y)}>${y}</span>`)}${e.attribute?` \u2192 ${e.attribute}`:""}</div>
          `:n`
            <div class="trigger-entity-name">${c}</div>
            <div class="trigger-entity-id">${r?n`<span class="entity-link" @click=${y=>Ye(y,r)}>${r}</span>`:""}${e.attribute?` \u2192 ${e.attribute}`:""}</div>
          `}
        </div>
        <span class="status-badge ${l.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
          ${l.trigger_active?a("triggered",t):a("ok",t)}
        </span>
      </div>

      ${v?ya(v,t):p!=null?n`
              <div class="trigger-value-row">
                <span class="trigger-current ${l.trigger_active?"active":""}">${g==="due_date"&&typeof p=="number"?ke(it(p),t):typeof p=="number"?ue(p,"",t):p}</span>
                ${u?n`<span class="trigger-unit">${u}</span>`:h}
              </div>
            `:h}

      <div class="trigger-limits">
        ${g==="threshold"?n`
          ${e.trigger_above!=null?n`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("threshold_above",t)}: ${e.trigger_above} ${u}</span>`:h}
          ${e.trigger_below!=null?n`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("threshold_below",t)}: ${e.trigger_below} ${u}</span>`:h}
          ${e.trigger_equals!=null?n`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> = ${e.trigger_equals} ${u}</span>`:h}
          ${e.trigger_not_equals!=null?n`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ≠ ${e.trigger_not_equals} ${u}</span>`:h}
          ${e.trigger_for_minutes?n`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${a("for_minutes",t)}: ${e.trigger_for_minutes}</span>`:h}
        `:h}
        ${g==="state_change"?n`
          ${e.trigger_target_changes!=null?n`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("target_changes",t)}: ${e.trigger_target_changes}</span>`:h}
        `:h}
        ${g==="runtime"?n`
          ${e.trigger_runtime_hours!=null?n`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("runtime_hours",t)}: ${e.trigger_runtime_hours}h</span>`:h}
        `:h}
        ${g==="due_date"?n`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("days_before",t)}: ${e.trigger_days_before??0}</span>
        `:h}
        ${g==="compound"?n`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("compound_logic",t)}: ${e.compound_logic||e.operator||"AND"}</span>
          ${(e.conditions||[]).map((y,E)=>n`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${E+1}. ${a(y.type==="due_date"?"trigger_type_due_date":y.type||"unknown",t)}: ${qt(y).map((x,S)=>n`${S>0?", ":""}<span class="entity-link" @click=${$=>Ye($,x)}>${x}</span>`)}</span>
          `)}
        `:h}
      </div>

      ${s&&s.length>1?n`
        <div class="trigger-entity-list">
          ${s.map(y=>n`
            <span class="trigger-entity-id">${y.friendly_name} (<span class="entity-link" @click=${E=>Ye(E,y.entity_id)}>${y.entity_id}</span>)</span>
          `)}
        </div>
      `:h}

      ${xa(l,u,d)}
    </div>
  `}function ba(l,d,e){let t=l.trigger_config,i=l.trigger_current_value;if(!t||i==null)return null;switch(t.type||"threshold"){case"counter":{let s=t.trigger_target_value;if(s==null||s<=0)return null;if(!t.trigger_delta_mode)return{progress:Math.max(0,i),target:s,unit:d,meter:null};let r=Cs(l,Ms(l,e));return{progress:Math.max(0,i-(r?.value??i)),target:s,unit:d,meter:i}}case"state_change":{let s=t.trigger_target_changes;return s==null||s<=0?null:{progress:Math.max(0,i),target:s,unit:"",meter:null}}case"runtime":{let s=t.trigger_runtime_hours;return s==null||s<=0?null:{progress:Math.max(0,i),target:s,unit:"h",meter:null}}}return null}function Cs(l,d){if(l.trigger_baseline_value!=null)return{value:l.trigger_baseline_value,ts:Ot(l)};if(!d.length)return null;let e=Ot(l);if(e==null)return{value:d[0].val,ts:null};let t=d[0],i=Math.abs(d[0].ts-e);for(let s of d){let r=Math.abs(s.ts-e);r<i&&(t=s,i=r)}return{value:t.val,ts:e}}function Ot(l){let d=[...l.history].filter(e=>e.type==="completed"||e.type==="reset").sort((e,t)=>ve(t.timestamp)-ve(e.timestamp))[0];return d?ve(d.timestamp):null}function ya(l,d){let e=Math.min(999,Math.round(l.progress/l.target*100)),t=e>=100?"over":e>=75?"near":"ok";return n`
    <div class="counter-progress">
      <div class="counter-progress-nums">
        <span class="counter-progress-main">${ue(l.progress,"",d)}<span class="counter-progress-target"> / ${ue(l.target,l.unit,d)}</span></span>
        <span class="counter-progress-pct ${t}">${e} %</span>
      </div>
      <div class="counter-progress-bar" role="progressbar" aria-valuenow=${e} aria-valuemin="0" aria-valuemax="100">
        <div class="counter-progress-fill ${t}" style="width:${Math.min(100,e)}%"></div>
      </div>
      <div class="counter-progress-caption">
        ${a("chart_since_service",d)}${l.meter!=null?n` · ${a("current",d)}: ${ue(l.meter,l.unit,d)}`:h}
      </div>
    </div>
  `}function Ms(l,d){let e=l.trigger_config;if(!e)return[];let t=e.type||"threshold",i=me(e)||"",s=t==="runtime"?[]:d.detailStatsData.get(i)||[],r=d.isCounterEntity(e),c=[];if(s.length>=2)for(let u of s){let p={ts:u.ts,val:u.val};!r&&u.min!=null&&u.max!=null&&(p.min=u.min,p.max=u.max),c.push(p)}else for(let u of l.history)u.trigger_value!=null&&c.push({ts:ve(u.timestamp),val:u.trigger_value});let o=!!i&&!!d.historyFallbackIds?.has(i)&&s.length>=2;return l.trigger_current_value!=null&&!o&&c.push({ts:Date.now(),val:l.trigger_current_value}),c.sort((u,p)=>u.ts-p.ts),c}function xa(l,d,e){let t=l.trigger_config;if(!t)return h;let i=t.type||"threshold",s=me(t)||"";if(i==="due_date")return h;let r=Ms(l,e),c=null;i==="state_change"&&s&&e.historyFallbackIds?.has(s)&&(c=fa(r,t,{since:Ot(l),current:l.trigger_current_value??null}),c&&(r=c.points)),i==="runtime"&&t.trigger_runtime_hours&&l.trigger_current_value!=null&&(r=[{ts:Ot(l)??r[0]?.ts??Date.now()-864e5,val:0},{ts:Date.now(),val:Math.max(0,l.trigger_current_value)}]),e.hideOutliers&&(r=va(r));let o=r.length<2&&!!s&&e.hasStatsService&&!e.detailStatsData.has(s);if(r.length<2&&!o)return h;let u=!!s&&e.detailStatsData.has(s)&&(e.detailStatsData.get(s)?.length??0)<2,p=Date.now()-e.rangeDays*864e5,g=r.filter(C=>C.ts>=p);g.length>=2&&(r=g);let m=null,v="\u25C6",y=!1;if(i==="threshold"&&t.trigger_above==null&&t.trigger_below==null&&(t.trigger_equals!=null||t.trigger_not_equals!=null))m=t.trigger_equals??t.trigger_not_equals??null,v=t.trigger_equals!=null?"=":"\u2260";else if(i==="counter"&&t.trigger_target_value!=null&&r.length){if(t.trigger_delta_mode){let C=Cs(l,r);if(C){if(C.ts!=null){let b=r.filter(D=>D.ts>=C.ts);b.length>=2&&(r=b)}r=r.map(b=>({...b,val:Math.max(0,b.val-C.value)}))}}m=t.trigger_target_value,y=!0}else i==="state_change"&&t.trigger_target_changes&&c?.mode!=="alarm"?(m=t.trigger_target_changes,y=!0):i==="runtime"&&t.trigger_runtime_hours&&(m=t.trigger_runtime_hours,y=!0);let E=null,x=l.degradation_rate,S=x!=null&&(t.trigger_below!=null&&t.trigger_above==null&&x>0||t.trigger_above!=null&&t.trigger_below==null&&x<0);if(m==null&&x!=null&&!S&&(l.degradation_trend!=="stable"||l.days_until_threshold!=null)&&l.degradation_trend!=="insufficient_data"&&r.length>=2){let C=r[r.length-1];E=[C,{ts:C.ts+30*864e5,val:C.val+x*30}]}let $=l.history.filter(C=>["completed","skipped","reset"].includes(C.type)).map(C=>({ts:ve(C.timestamp),type:C.type}));return n`
    <maintenance-trigger-chart
      .points=${o?[]:r}
      .events=${$}
      .unit=${d}
      .lang=${e.lang}
      .thresholdAbove=${i==="threshold"?t.trigger_above??null:null}
      .thresholdBelow=${i==="threshold"?t.trigger_below??null:null}
      .targetValue=${m}
      .targetMark=${v}
      .forceZero=${y}
      .projection=${E}
      .rangeDays=${e.rangeDays}
      .hideOutliers=${e.hideOutliers}
      .busy=${o}
      @range-change=${C=>e.setRangeDays(C.detail.days)}
      @outlier-toggle=${C=>e.setHideOutliers(C.detail.hide)}
    ></maintenance-trigger-chart>
    ${o?h:s&&e.historyFallbackIds?.has(s)&&!u?n`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${a(c?.mode==="alarm"?"chart_history_alarm":c?.mode==="count"?"chart_history_count":"chart_history_fallback",e.lang)}
        </div>`:u?n`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${a("chart_no_stats",e.lang)}
        </div>`:h}
  `}var ka=200,st=10,wa=22;function Ds(l,d,e,t,i){let s=l.history.filter(o=>o.type==="completed"&&(Re(o)!=null||o.duration!=null));if(s.length<2)return h;let r=s.some(o=>(Re(o)??0)!==0),c=s.some(o=>(o.duration??0)>0);return!r&&!c?h:n`
    <div class="cost-duration-card">
      <div class="card-header">
        <h3>${a("cost_duration_chart",d)}</h3>
        <div class="toggle-buttons">
          ${r?n`<button
            class="toggle-btn ${e==="cost"?"active":""}"
            @click=${()=>t("cost")}>
            ${a("cost",d)}
          </button>`:h}
          ${r&&c?n`<button
            class="toggle-btn ${e==="both"?"active":""}"
            @click=${()=>t("both")}>
            ${a("both",d)}
          </button>`:h}
          ${c?n`<button
            class="toggle-btn ${e==="duration"?"active":""}"
            @click=${()=>t("duration")}>
            ${a("duration",d)}
          </button>`:h}
        </div>
      </div>
      ${$a(l,d,e,i)}
    </div>
  `}function $a(l,d,e,t){let i=l.history.filter(M=>M.type==="completed"&&(Re(M)!=null||M.duration!=null)).map(M=>({ts:ve(M.timestamp),cost:Re(M)??0,duration:M.duration??0})).sort((M,te)=>M.ts-te.ts);if(i.length<2)return h;let s=i.some(M=>M.cost!==0),r=i.some(M=>M.cost<0),c=i.some(M=>M.duration>0);if(!s&&!c)return h;let o=e!=="duration"&&s,u=e!=="cost"&&c,p=o||!u&&s,g=u||!o&&c,m=640,v=ka,y=p?44:12,E=g?44:12,x=m-y-E,S=v-wa,$=S-st,C=i[0].ts,b=i[i.length-1].ts,D=(b-C||864e5)*.05,ae=C-D,he=b+D,T=Fi(C,b),z=M=>y+(M-ae)/(he-ae)*x,H=Math.min(0,...i.map(M=>M.cost)),I=Math.max(0,...i.map(M=>M.cost)),W=Je(H,I>H?I:H+1,3),G=Je(0,Math.max(...i.map(M=>M.duration))||1,3),X=W.niceMax-W.niceMin||1,j=M=>st+(1-(M-W.niceMin)/X)*$,Y=M=>st+(1-M/(G.niceMax||1))*$,re=i.length>1?Math.min(...i.slice(1).map((M,te)=>z(M.ts)-z(i[te].ts))):x,Ie=Math.max(6,Math.min(22,re*.55)),ie=yt(C,b,Math.max(2,Math.min(4,i.length)));return n`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${m} ${v}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${a("chart_history",d)}">
        ${p?W.ticks.map(M=>{let te=j(M);return te<st-1||te>S+1?h:Q`
            <line x1="${y}" y1="${O(te)}" x2="${m-E}" y2="${O(te)}" stroke="var(--divider-color)" stroke-width="1" opacity="0.55" />
            <text x="${y-6}" y="${O(te+3.5)}" text-anchor="end" fill="var(--primary-color)" font-size="10.5">${Oe(M,d)}${t}</text>`}):h}
        ${g?G.ticks.map(M=>{let te=Y(M);return te<st-1||te>S+1?h:Q`<text x="${m-E+6}" y="${O(te+3.5)}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="10.5">${Oe(M,d)}m</text>`}):h}

        ${p&&W.niceMin<0?Q`
          <line class="cost-zero" x1="${y}" y1="${O(j(0))}" x2="${m-E}" y2="${O(j(0))}" stroke="var(--secondary-text-color)" stroke-width="1" opacity="0.7" />
        `:h}
        ${p?i.filter(M=>M.cost!==0).map(M=>{let te=j(Math.max(M.cost,0)),Ve=M.cost<0;return Q`
          <rect class="${Ve?"credit-bar":"cost-bar"}" x="${O(z(M.ts)-Ie/2)}" y="${O(te)}" width="${O(Ie)}" height="${O(j(Math.min(M.cost,0))-te)}"
            fill="${Ve?"var(--success-color, #43a047)":"var(--primary-color)"}" opacity="0.6" rx="2">
            <title>${bt(M.ts,d,!0)}: ${Ve?`${a("cost_kind_credit",d)} `:""}${U(Math.abs(M.cost),t,d)}${M.duration?` \xB7 ${M.duration}m`:""}</title>
          </rect>`}):h}
        ${g?Q`
          <polyline points="${i.map(M=>`${O(z(M.ts))},${O(Y(M.duration))}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${i.map(M=>Q`
            <circle cx="${O(z(M.ts))}" cy="${O(Y(M.duration))}" r="3.5" fill="var(--accent-color, #ff9800)">
              <title>${bt(M.ts,d,!0)}: ${M.duration}m${M.cost?` \xB7 ${U(M.cost,t,d)}`:""}</title>
            </circle>
          `)}
        `:h}

        <line x1="${y}" y1="${S}" x2="${m-E}" y2="${S}" stroke="var(--divider-color)" stroke-width="1" />
        ${ie.map((M,te)=>{let Ve=te===0?"start":te===ie.length-1?"end":"middle";return Q`<text x="${O(z(M))}" y="${v-6}" text-anchor="${Ve}" fill="var(--secondary-text-color)" font-size="10">${bt(M,d,T)}</text>`})}
      </svg>
    </div>
    <div class="chart-legend">
      ${p?n`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${a("cost",d)}</span>`:h}
      ${p&&r?n`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #43a047);opacity:0.6"></span>${a("cost_kind_credit",d)}</span>`:h}
      ${g?n`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${a("duration",d)}</span>`:h}
    </div>
  `}function ti(l,d,e){if(!l.responsible_user_id)return h;let t=e?.(l.responsible_user_id)??null;if(t)return n`<span class="user-badge">${Mi(t)}${t.name}</span>`;let i=d(l.responsible_user_id);return i?n`
    <span class="user-badge">
      <ha-icon icon="mdi:account"></ha-icon>
      ${i}
    </span>
  `:h}function Sa(l,d){let e=d.lang,t=d.isOperator;return n`
    <div class="task-header">
      <div class="task-header-title">
        <span class="task-name-breadcrumb" @click=${()=>d.showTaskView()}>${l.name}${Fe(l.next_event_titles)}</span>
        ${He(d.taskRef??null,a("ref_number",e))}
        <span class="breadcrumb-separator">·</span>
        <span class="object-name-breadcrumb" @click=${()=>d.showObject()}>${d.objectName}</span>
        ${xt(l,e,"chip")}
        ${l.paused&&l.paused_until?n`<span class="postponed-badge paused-until" title="${a("task_paused",e)}">
          <ha-icon icon="mdi:pause-circle-outline"></ha-icon>${a("paused_until_label",e)} ${q(l.paused_until,e)}
        </span>`:h}
        ${l.due_override?n`<span class="postponed-badge" title="${a("postponed_to",e)}">
          <ha-icon icon="mdi:calendar-arrow-right"></ha-icon>${q(l.due_override,e)}
        </span>`:h}
        ${ti(l,d.getUserName,d.getPerson)}
        ${l.notify_enabled===!1?n`<span class="nfc-badge muted-badge" title="${a("no_notifications",e)}"><ha-icon icon="mdi:bell-off-outline"></ha-icon></span>`:h}
        ${l.mirror_todo_entities?.length?n`<span class="nfc-badge mirror-badge" title="${a("task_mirror_todo",e)}: ${l.mirror_todo_entities.map(i=>String(d.hass?.states?.[i]?.attributes?.friendly_name??i)).join(", ")}"><ha-icon icon="mdi:clipboard-list-outline"></ha-icon></span>`:h}
        ${l.nfc_tag_id?n`<span class="nfc-badge" title="${a("nfc_tag_id",e)}: ${l.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>`:t?h:n`<span class="nfc-badge unlinked" title="${a("nfc_link_hint",e)}"
              @click=${()=>d.openEdit(l)}>
              <ha-icon icon="mdi:nfc-variant"></ha-icon>
            </span>`}
      </div>
      <div class="task-header-actions">
        <ha-button appearance="accent" variant="success" @click=${()=>d.openComplete(l)}>${a("complete",e)}</ha-button>
        ${l.allow_skip!==!1?n`<ha-button appearance="outlined" variant="warning" .disabled=${d.actionLoading} @click=${()=>d.promptSkip()}>${a("skip",e)}</ha-button>`:h}
        <div class="more-menu-wrapper">
          <ha-icon-button .disabled=${d.actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${()=>d.toggleMoreMenu()}></ha-icon-button>
          ${d.moreMenuOpen?n`
            <div class="popup-menu" @click=${i=>i.stopPropagation()}>
              ${t?h:n`
                <div class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.openEdit(l)}}>${a("edit",e)}</div>
              `}
              <div class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.openQr(l.name)}}>${a("qr_code",e)}</div>
              <div class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.printWorksheet()}}>${a("worksheet",e)}</div>
              ${d.features.adaptive&&l.adaptive_config?.enabled?n`
                <!-- The recommendation card carries Re-analyze too, but only
                     once a differing suggestion exists — the analysis it is
                     meant to trigger was unreachable before (audit 2026-09-28). -->
                <div class="popup-menu-item reanalyze" @click=${()=>{d.closeMoreMenu(),d.reanalyze()}}>${a("reanalyze",e)}</div>
              `:h}
              ${t?h:n`
                <div class="popup-menu-item" @click=${()=>d.duplicateTask()}>${a("duplicate",e)}</div>
                <div class="popup-menu-item" @click=${()=>d.moveTask()}>${a("move_task",e)}</div>
              `}
              <!-- Reset / Postpone / Snooze are household actions (read tier,
                   helpers/permissions HOUSEHOLD_ACTIONS): offered to everyone,
                   like Complete / Skip and the Lovelace quick-actions Reset. -->
              <div class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.promptReset()}}>${a("reset",e)}</div>
              <div class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.promptPostpone()}}>${a("postpone",e)}…</div>
              <div class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.snoozeTask()}}>${a("snooze",e)}</div>
              ${t?h:n`
                ${l.archived?h:n`<div class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.togglePause(!!l.paused)}}>${l.paused?a("resume_task",e):`${a("pause_task",e)}\u2026`}</div>`}
                <div class="popup-menu-item" @click=${()=>{d.closeMoreMenu(),d.toggleArchive(!!l.archived)}}>${l.archived?a("unarchive",e):a("archive",e)}</div>
                <div class="popup-menu-divider"></div>
                <div class="popup-menu-item danger" @click=${()=>{d.closeMoreMenu(),d.deleteTask()}}>${a("delete",e)}</div>
              `}
            </div>
          `:h}
        </div>
      </div>
    </div>
  `}function ja(l){let d=l.lang;return n`
    <div class="tab-bar">
      <div class="tab ${l.activeTab==="overview"?"active":""}" @click=${()=>l.setActiveTab("overview")}>
        ${a("overview",d)}
      </div>
      <div class="tab ${l.activeTab==="history"?"active":""}" @click=${()=>l.setActiveTab("history")}>
        ${a("history",d)}
      </div>
    </div>
  `}function As(l,d,e,t){let i=t.collapsedSections.has(l);return n`
    <div class="collapsible ${i?"collapsed":""}">
      <button class="collapsible-head" @click=${()=>t.toggleSection(l)}
        aria-expanded=${i?"false":"true"}>
        <ha-icon icon="${i?"mdi:chevron-right":"mdi:chevron-down"}"></ha-icon>
        <span>${a(d,t.lang)}</span>
      </button>
      ${i?h:n`<div class="collapsible-body">${e}</div>`}
    </div>
  `}function Ta(l,d){if(!xi(l))return h;let e=d.lang,t=l.phase_sequence,i=yi(l.phase_cursor,t.length),s=new Map;for(let r=l.history.length-1;r>=0;r--){let c=l.history[r];c.phase_id&&c.type==="completed"&&!s.has(c.phase_id)&&s.set(c.phase_id,c.timestamp)}return n`
    <div class="phases-card">
      <div class="phases-card-header">
        <ha-icon icon="mdi:rotate-right"></ha-icon>
        <span>${a("phase_sequence_label",e)}</span>
      </div>
      <div class="phases-strip">
        ${t.map((r,c)=>{let o=l.phases?.[r]?.name||r,u=s.get(r);return n`
            <div class="phase-step ${c===i?"current":""}"
              title=${c===i?a("phase_current",e):a("phase_set",e)}
              @click=${()=>{c!==i&&d.setPhaseCursor(c)}}>
              <span class="phase-step-name">${c+1}. ${o}</span>
              ${u?n`<span class="phase-step-last">${q(u,e)}</span>`:h}
            </div>
          `})}
      </div>
    </div>
  `}function Ea(l,d){if(!d.features.checklists)return h;let e=mt(l)?.checklist??(l.checklist||[]);if(e.length===0)return h;let t=d.lang,i=l.checklist_progress||{},s=e.filter(r=>i[r]).length;return n`
    <div class="checklist-preview-card">
      <div class="checklist-preview-header">
        <ha-icon icon="mdi:format-list-checks"></ha-icon>
        <span>${a("checklist",t)} (${s}/${e.length})</span>
      </div>
      <ol class="checklist-preview-list">
        ${e.map(r=>n`
          <li class=${i[r]?"checked":""}>
            <label>
              <input
                type="checkbox"
                .checked=${!!i[r]}
                @change=${c=>d.setChecklistItem(r,c.target.checked)}
              />
              <span>${r}</span>
            </label>
          </li>
        `)}
      </ol>
    </div>
  `}function Ra(l,d){let e=ce(l.documentation_url)?l.documentation_url:null,t=ce(d.objectDocUrl)?d.objectDocUrl:null,i=t?null:(d.objectManualDocs||[])[0];if(!l.notes&&!e&&!t&&!i)return h;let s=d.lang;return n`
    <div class="task-meta-card">
      ${l.notes?n`
        <div class="task-meta-row">
          <ha-icon icon="mdi:note-text-outline"></ha-icon>
          <span class="task-meta-notes">${gt(l.notes)}</span>
        </div>
      `:h}
      ${e?n`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:open-in-new"></ha-icon>
          <a href="${e}" target="_blank" rel="noopener noreferrer">${a("documentation_label",s)}</a>
        </div>
      `:h}
      ${t?n`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="${t}" target="_blank" rel="noopener noreferrer">${a("documentation_url_label",s)} (${d.objectName})</a>
        </div>
      `:i?n`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="#" title=${i.title}
            @click=${r=>{r.preventDefault(),d.openManualDoc(i)}}
            >${a("documentation_url_label",s)} (${d.objectName})</a>
        </div>
      `:h}
    </div>
  `}function Oa(l,d){let e=d.lang,t=l.average_cost!==void 0?l.average_cost??0:l.times_performed>0?l.total_cost/l.times_performed:0,i=l.trigger_config,s=l.next_due==null&&i?.type==="due_date"&&l.trigger_current_value!=null,r=s?new Date(Date.now()+l.trigger_current_value*864e5).toISOString():l.next_due,c=s?it(l.trigger_current_value):l.days_until_due,o=s?i?.trigger_days_before??0:l.warning_days,u=c!=null?c<0?"overdue":c<=o?"warning":"":"";return n`
    <div class="kpi-bar">
      <div class="kpi-card">
        <div class="kpi-label">${a("next_due",e)}</div>
        <div class="kpi-value">${r?q(r,e):"\u2014"}</div>
        ${s?n`<div class="kpi-subtext">${a("kpi_reported_by_sensor",e)}</div>`:d.features.schedule_time&&l.schedule_time?n`<div class="kpi-subtext">${a("at_time",e)} ${l.schedule_time}</div>`:h}
      </div>
      <div class="kpi-card ${u}">
        <div class="kpi-label">${a("days_until_due",e)}</div>
        <div class="kpi-value-large">${c??"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("interval",e)}</div>
        <div class="kpi-value">${ze(l,e)}</div>
        ${d.features.adaptive&&l.suggested_interval&&l.suggested_interval!==l.interval_days?n`
          <div class="kpi-subtext">${a("recommended",e)}: ${l.suggested_interval}${l.interval_analysis?.confidence_interval_low!=null?` (${l.interval_analysis.confidence_interval_low}\u2013${l.interval_analysis.confidence_interval_high})`:""}</div>
        `:h}
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("warning",e)}</div>
        <div class="kpi-value">${l.warning_days} ${a("days",e)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("last_performed",e)}</div>
        <div class="kpi-value">${l.last_performed?q(l.last_performed,e):"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("avg_cost",e)}</div>
        <div class="kpi-value">${U(t,d.currencySymbol,e)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("avg_duration",e)}</div>
        <div class="kpi-value">${l.average_duration?Ge(Math.round(l.average_duration),e):"\u2014"}</div>
      </div>
    </div>
  `}function Ca(l,d){let e=d.lang;if(!d.features.adaptive||!l.suggested_interval||l.suggested_interval===l.interval_days)return h;if(d.suggestionDismissed)return h;let t=l.suggested_interval;return n`
    <div class="recommendation-card">
      <h4>${a("suggested_interval",e)}</h4>
      ${as(l.interval_days,t,l.interval_confidence||"medium",e)}
      <div class="recommendation-actions">
        ${d.isOperator?h:n`<ha-button appearance="filled" class="apply-suggestion"
              @click=${()=>d.applySuggestion(t)}>
              ${a("apply_suggestion",e)}
            </ha-button>`}
        <ha-button appearance="plain"
          @click=${()=>d.reanalyze()}>
          ${a("reanalyze",e)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${()=>d.dismissSuggestion()}>
          ${a("dismiss_suggestion",e)}
        </ha-button>
      </div>
    </div>
  `}function Ma(l,d){let e=d.lang,t=Qi(l.history).slice(0,3);return t.length===0?h:n`
    <div class="recent-activities">
      <h3>${a("recent_activities",e)}</h3>
      ${t.map(i=>Zi(i,d.history,{compact:!0,showEdit:!1}))}
      <div class="activity-show-all">
        <ha-button appearance="plain" @click=${()=>d.setActiveTab("history")}>${a("show_all",e)} →</ha-button>
      </div>
    </div>
  `}function Da(l,d){let e=d.lang,t=d.features.adaptive&&l.suggested_interval&&l.suggested_interval!==l.interval_days,i=d.features.seasonal&&l.seasonal_factor&&l.seasonal_factor!==1,s=t||i,r=d.features.adaptive&&l.interval_analysis?.weibull_beta!=null&&l.interval_analysis?.weibull_eta!=null,c=d.features.seasonal&&(l.seasonal_factors?.length===12||l.interval_analysis?.seasonal_factors?.length===12);return n`
    <div class="tab-content overview-tab">
      ${l.battery_fleet_task?n`<maintenance-battery-fleet-section .hass=${d.hass}></maintenance-battery-fleet-section>`:h}
      ${Oa(l,d)}
      ${Ra(l,d)}
      ${l.battery_fleet_task?h:n`
            ${Ts(l,d.lang)}
            ${Os(l,d.sparkline)}
            ${ss(l,e,d.features)}
          `}
      <div class="two-column-layout ${s?"":"single-column"}">
        ${s?n`
          <div class="left-column">
            ${Ca(l,d)}
            ${rs(l,e,d.features)}
          </div>
        `:h}
        <div class="right-column">
          ${Ds(l,e,d.costDurationToggle,o=>d.setCostDurationToggle(o),d.currencySymbol)}
        </div>
      </div>
      ${r?As("weibull","weibull_reliability_curve",is(l,e),d):h}
      ${c?As("seasonal","seasonal_chart_title",n`
            ${ns(l,e)}
            <div class="seasonal-actions">
              <ha-button appearance="plain" @click=${()=>d.openSeasonalOverrides(l)}>
                ${a("edit_seasonal_overrides",e)}
              </ha-button>
            </div>
          `,d):h}
      ${Ta(l,d)}
      ${Ea(l,d)}
      ${Ma(l,d)}
    </div>
  `}function Aa(l,d){return n`
    <div class="tab-content history-tab">
      <div class="history-add-past">
        <ha-button appearance="plain" class="history-add-past-btn" @click=${()=>d.openComplete(l)}>
          <ha-icon icon="mdi:calendar-plus"></ha-icon>
          ${a("history_add_past",d.lang)}
        </ha-button>
      </div>
      ${Xi(l,d.history)}
      ${Ji(l,d.history)}
    </div>
  `}function Ia(l,d){switch(d.activeTab){case"overview":return Da(l,d);case"history":return Aa(l,d);default:return h}}function Is(l,d){return n`
    <div class="detail-section">
      ${Sa(l,d)}
      ${ja(d)}
      ${Ia(l,d)}
      <maintenance-task-documents
        .hass=${d.hass}
        .entryId=${d.entryId}
        .taskId=${d.taskId}
        .canWrite=${!d.isOperator}
      ></maintenance-task-documents>
    </div>
  `}var at=class extends N{createRenderRoot(){return this}render(){return!this.task||!this.ctx?h:n`${Is(this.task,this.ctx)}`}};_([R({attribute:!1})],at.prototype,"task",2),_([R({attribute:!1})],at.prototype,"ctx",2);customElements.get("maintenance-task-detail-view")||customElements.define("maintenance-task-detail-view",at);function zs(l){if(l.total<=0)return{start:0,end:0,padTop:0,padBottom:0};let d=l.overscan??12,e=Math.max(1,l.step??6),t=Math.max(1,l.rowHeight),i=Math.floor((l.scrollTop-l.listTop)/t),s=Math.ceil(l.viewportHeight/t)+1,r=Math.max(0,i-d);r=Math.floor(r/e)*e;let c=Math.min(l.total,Math.max(i,0)+s+d);return c=Math.min(l.total,Math.ceil(c/e)*e),r>=c&&(r=Math.min(r,Math.max(0,l.total-1)),c=Math.min(l.total,r+Math.max(s,1))),{start:r,end:c,padTop:r*t,padBottom:(l.total-c)*t}}var Ct={mode:"top",marginTop:0,lastScrollTop:0};function Ps(l,d){return l==="top"?8:d.viewH-d.paneH-8}function Ls(l){let d=l.scrollTop+8-l.layoutTop,e=Math.max(0,l.listH-l.paneH);return{mode:"top",marginTop:d>e?Math.max(0,d):0,lastScrollTop:l.scrollTop}}function Hs(l,d){let e=d.scrollTop,t=d.scrollTop>l.lastScrollTop?"down":d.scrollTop<l.lastScrollTop?"up":"none",i=Math.max(0,d.listH-d.paneH),s=d.paneH+16<=d.viewH||d.listH<=d.paneH,{mode:r,marginTop:c}=l;if(s&&(r="top"),r==="top"&&c>0&&t==="up")c=Math.max(0,Math.min(c,d.scrollTop+8-d.layoutTop)),c<=i&&(c=0);else if(!s&&t==="down"&&r==="top"){let o=d.renderedTop-d.layoutTop;o<=i&&(r="bottom",c=Math.max(0,o))}else!s&&t==="up"&&r==="bottom"&&(c=Math.min(Math.max(0,d.renderedTop-d.layoutTop),i),d.scrollTop+8<=d.layoutTop+c&&(r="top",c=0));return{mode:r,marginTop:c,lastScrollTop:e}}var Mt=2,Ha=250,Pe={objects:6,tasks:10,parts:6,documents:8,history:6},Ba="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z",ii=["due_date","object","type","task_name","area","assigned_user","group"],Bs=["none","area","group","user","object"],Ns=oi,qs=["tasks","documents","parts","history"],k=class extends N{constructor(){super(...arguments);this.narrow=!1;this.tight=!1;this.split=!1;this._tightObserver=null;this.panel={};this.embedded=!1;this.presets={};this._presetsApplied=!1;this._mountPath=null;this._objects=[];this._stats=null;this._view="overview";this._allParts=null;this._selectedEntryId=null;this._selectedTaskId=null;this._selectedAreaId=null;this._filterStatus="";this._filterUser=null;this._filterLabel=null;this._filterPlace="";this._filterPriority="";this._savedViews=[];this._activeViewId="";this._unsub=null;this._chartRangeDays=(()=>{try{let e=parseInt(Z(A.chartRange)||"",10);return[7,30,90,365].includes(e)?e:30}catch{return 30}})();this._hideOutliers=(()=>{try{return Z(A.chartHideOutliers)==="1"}catch{return!1}})();this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1};this._adminPanelUserIds=[];this._operatorWriteEnabled=!1;this._defaultWarningDays=7;this._rowActionStyle="buttons_compact";this._refsInLists=!1;this._partsCostMode="purchase";this._rowActionNotice=!1;this._actionLoading=!1;this._moreMenuOpen=!1;this._objMenuOpen=!1;this._toastMessage="";this._toastKind="error";this._toastUndo=null;this._toastActionLabel="";this._filtersOpen=!1;this._newMenuOpen=!1;this._gsSetupsCount=0;this._gsAdoptCount=0;this._gsLoaded=!1;this._resetOffersLoaded=!1;this._resetOffersCount=0;this._batteryFleetSetupAvailable=!1;this._staleBundle=!1;this._restartPendingVersion=null;this._staleChecked=!1;this._onReconnect=()=>this._checkServerVersion();this._toastTimer=null;this._dismissedSuggestions=new Set;this._overviewTab=(()=>{try{let e=Z(A.overviewTab);return e==="today"||e==="calendar"?e:"dashboard"}catch{return"dashboard"}})();this._activeTab="overview";this._costDurationToggle="both";this._historySearch="";this._sortMode="due_date";this._objectSortMode="alphabetical";this._groupByMode="none";this._objectViewMode="cards";this._objectsTableColumns=fi;this._showArchived=!1;this._bulkMode=!1;this._bulkSelected=new Set;this._objBulkMode=!1;this._objBulkSelected=new Set;this._bulkMenuOpen=!1;this._virtStart=0;this._virtEnd=0;this._virtRowHeight=53;this._virtMeasure=!0;this._virtTotalRows=0;this._virtScrollAttached=!1;this._virtRaf=0;this._stickyState=Ct;this._stickySelectPending=!1;this._stickyRaf=0;this._stickyAttached=!1;this._stickyObserver=null;this._collapsedGroups=new Set;this._collapsedSections=(()=>{try{return new Set(JSON.parse(Z(A.collapsedSections)||"[]"))}catch{return new Set}})();this._objectSectionsCollapsed=(()=>{try{let e=JSON.parse(Z(A.objectSections)||"[]");return new Set((Array.isArray(e)?e:[]).filter(t=>qs.includes(t)))}catch{return new Set}})();this._objectSectionOverride=null;this._paletteOpen=!1;this._paletteQuery="";this._paletteActive=0;this._searchRemote=null;this._searchTimer=null;this._searchSeq=0;this._templateGalleryOpen=!1;this._templates=[];this._homeProfile=null;this._templateCategories={};this._templateBusy=!1;this._statsService=null;this._userService=null;this._dataLoaded=!1;this._lastConnection=null;this._popstateHandler=e=>this._onPopState(e);this._locationChangedHandler=()=>this._onLocationChanged();this._lazyUi=null;this._onStickyScroll=()=>{this._stickyRaf||(this._stickyRaf=requestAnimationFrame(()=>{this._stickyRaf=0,this._updateStickyPane()}))};this._onVirtualScroll=()=>{this._virtMeasure=!0,!this._virtRaf&&(this._virtRaf=requestAnimationFrame(()=>{this._virtRaf=0,this._updateVirtualWindow()}))};this._deepLinkHandled=!1;this._deepLinkInPlace=!1;this._initialLoadDone=!1;this._detailStatsSeq=new Map;this._kpiRefreshInFlight=!1;this._kpiRefreshPending=!1;this._areaUi=null;this._paletteKeydown=e=>{if(e.key==="/"&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!this._paletteOpen){let i=e.composedPath()[0];if(i instanceof HTMLElement&&(i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.tagName==="SELECT"||i.isContentEditable))return;e.preventDefault(),this._openPalette();return}if(!this._paletteOpen)return;let t=this._paletteResults;if(e.key==="Escape")e.preventDefault(),this._closePalette();else if(e.key==="ArrowDown")e.preventDefault(),this._paletteActive=Math.min(this._paletteActive+1,t.length-1);else if(e.key==="ArrowUp")e.preventDefault(),this._paletteActive=Math.max(this._paletteActive-1,0);else if(e.key==="Enter"){e.preventDefault();let i=t[this._paletteActive];i&&this._selectPaletteResult(i)}};this._onObjectReplaced=async e=>{this._showToast([a("object_replaced",this._lang),this._deviceSwapText(e.detail.device_swap)].filter(Boolean).join(" \xB7 "),"info");try{await this._loadData()}catch{}e.detail.entry_id&&this._showObject(e.detail.entry_id)};this._onObjectSaved=async e=>{let t=this._deviceSwapText(e.detail?.device_swap);t&&this._showToast(t,"info"),await this._onDialogEvent()};this._checklistPending=new Map;this._checklistChain=Promise.resolve();this._onDialogEvent=async()=>{try{await this._loadData()}catch{}};this._onTaskCompleted=async e=>{await this._onDialogEvent();let t=e.detail;t?.undo&&this._offerUndo(t.entryId,t.taskId,a("task_completed_named",this._lang).replace("{task}",t.taskName))};this._onCalendarLlCustom=e=>{let t=e.detail;t?.type==="maintenance-supporter:open-task"&&t.entry_id&&t.task_id&&(e.stopPropagation(),this._showTask(t.entry_id,t.task_id))};this._fullHistory=null;this._onHistoryEntrySaved=async()=>{await this._loadData()}}get _currencySymbol(){return lt(this._budget)}get _lang(){return K(this.hass)}get _isOperator(){return!Ne(this.hass?.user,{operatorWriteEnabled:this._operatorWriteEnabled,operatorIds:this._adminPanelUserIds})}_ensureLazyUi(){return this._lazyUi||(this._lazyUi=Promise.all([import("/maintenance_supporter_panelfiles/panel-chunks/object-dialog-6POFBZ7Z.js"),import("/maintenance_supporter_panelfiles/panel-chunks/task-dialog-SISULJJF.js"),import("/maintenance_supporter_panelfiles/panel-chunks/complete-dialog-VFJRAVNT.js"),import("/maintenance_supporter_panelfiles/panel-chunks/qr-dialog-4FDU7ESY.js"),import("/maintenance_supporter_panelfiles/panel-chunks/adopt-problem-sensors-dialog-ATFY33EA.js"),import("/maintenance_supporter_panelfiles/panel-chunks/suggested-setups-dialog-XGNKP4JD.js"),import("/maintenance_supporter_panelfiles/panel-chunks/settings-view-EHE2BJPV.js"),import("/maintenance_supporter_panelfiles/panel-chunks/bulk-edit-dialog-JWP6FERD.js")]).then(()=>this.updateComplete)),this._lazyUi}async _ui(e){return await this._ensureLazyUi(),this.shadowRoot?.querySelector(e)??null}connectedCallback(){super.connectedCallback(),this._mountPath=window.location.pathname;let e=window.requestIdleCallback,t=()=>this._ensureLazyUi();e?e(t,{timeout:3e3}):window.setTimeout(t,1500),window.addEventListener("popstate",this._popstateHandler),window.addEventListener("location-changed",this._locationChangedHandler),window.addEventListener("keydown",this._paletteKeydown),typeof ResizeObserver<"u"&&(this._tightObserver=new ResizeObserver(i=>{let s=i[0]?.contentRect.width??0;s>0&&(this.tight=s<1e3),s>0&&(this.split=s>=1500)}),this._tightObserver.observe(this)),window.addEventListener("resize",this._onVirtualScroll,{passive:!0});try{let i=Z(A.taskSort);i&&ii.includes(i)&&(this._sortMode=i);let s=Z(A.objectSort);s&&["alphabetical","due_soonest","task_count"].includes(s)&&(this._objectSortMode=s);let r=Z(A.groupBy);r&&Bs.includes(r)&&(this._groupByMode=r);let c=Z(A.objectView);(c==="cards"||c==="table")&&(this._objectViewMode=c)}catch{}if(this._objects.length===0){let i=ds();i&&(this._objects=i.objects,i.stats&&(this._stats=i.stats))}}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("popstate",this._popstateHandler),window.removeEventListener("location-changed",this._locationChangedHandler),window.removeEventListener("keydown",this._paletteKeydown),this._tightObserver?.disconnect(),this._tightObserver=null,window.removeEventListener("resize",this._onVirtualScroll),this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onVirtualScroll),this._virtScrollAttached=!1,this._virtRaf&&cancelAnimationFrame(this._virtRaf),this._detachStickyPane(),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._initialLoadDone=!1,this._watchConnection(null),this._deepLinkHandled=!1,this._searchTimer&&(clearTimeout(this._searchTimer),this._searchTimer=null),this._toastTimer&&(clearTimeout(this._toastTimer),this._toastTimer=null),this._toastMessage="",this._toastUndo=null,this._toastActionLabel="",this._statsService?.clearCache(),this._statsService=null}willUpdate(e){super.willUpdate(e),e.has("_groupByMode")&&this._collapsedGroups.size>0&&(this._collapsedGroups=new Set)}updated(e){if(super.updated(e),Be(this,e),e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._watchConnection(this.hass.connection),history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},""),this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._watchConnection(this.hass.connection),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new $t(this.hass),this._fetchMiniStatsForOverview()),this._userService?this._userService.updateHass(this.hass):(this._userService=new Di(this.hass),this._userService.getUsers().then(()=>this.requestUpdate()))}let t=this.shadowRoot?.querySelector(".content");t&&!this._virtScrollAttached&&(t.addEventListener("scroll",this._onVirtualScroll,{passive:!0}),this._virtScrollAttached=!0),this._updateVirtualWindow(),this._syncStickyPane(t)}_syncStickyPane(e){let t=this.shadowRoot?.querySelector(".split-pane");if(!t||!e){this._stickyAttached&&this._detachStickyPane();return}this._stickyAttached||(e.addEventListener("scroll",this._onStickyScroll,{passive:!0}),window.addEventListener("resize",this._onStickyScroll),typeof ResizeObserver<"u"&&(this._stickyObserver=new ResizeObserver(this._onStickyScroll)),this._stickyAttached=!0),this._stickyObserver?.observe(t),this._updateStickyPane()}_detachStickyPane(){this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onStickyScroll),window.removeEventListener("resize",this._onStickyScroll),this._stickyObserver?.disconnect(),this._stickyObserver=null,this._stickyRaf&&cancelAnimationFrame(this._stickyRaf),this._stickyRaf=0,this._stickyAttached=!1,this._stickyState=Ct,this._stickySelectPending=!1}_updateStickyPane(){let e=this.shadowRoot,t=e?.querySelector(".content"),i=e?.querySelector(".split-pane"),s=e?.querySelector(".split-layout"),r=e?.querySelector(".split-list");if(!t||!i||!s||!r)return;let c=t.getBoundingClientRect().top-t.scrollTop,o={scrollTop:t.scrollTop,viewH:t.clientHeight,paneH:i.offsetHeight,listH:r.offsetHeight,layoutTop:s.getBoundingClientRect().top-c,renderedTop:i.getBoundingClientRect().top-c};this._stickySelectPending&&o.scrollTop===this._stickyState.lastScrollTop?this._stickyState=Ls(o):(this._stickySelectPending=!1,this._stickyState=Hs(this._stickyState,o));let u=this._stickyState;i.style.top=`${Ps(u.mode,o)}px`,i.style.marginTop=u.marginTop>0?`${u.marginTop}px`:""}_resetStickyPane(){let e=this.shadowRoot?.querySelector(".content");this._stickyState={...Ct,lastScrollTop:e?.scrollTop??0},this._stickySelectPending=!0}_updateVirtualWindow(){let e=this.shadowRoot?.querySelector(".content"),t=this.shadowRoot?.querySelector(".task-table.virtual");if(!e||!t)return;if(this._virtMeasure){let r=[...t.querySelectorAll(".task-row:not(.virt-sizer)")],c=r.length?r.reduce((o,u)=>o+u.offsetHeight,0)/r.length:0;c>20&&(Math.abs(c-this._virtRowHeight)>=2&&(this._virtRowHeight=Math.round(c)),this._virtMeasure=!1)}let i=t.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop,s=zs({scrollTop:e.scrollTop,viewportHeight:e.clientHeight,listTop:i,rowHeight:this._virtRowHeight,total:this._virtTotalRows});(s.start!==this._virtStart||s.end!==this._virtEnd)&&(this._virtStart=s.start,this._virtEnd=s.end)}_watchConnection(e){this._lastConnection?.removeEventListener?.("ready",this._onReconnect),this._lastConnection=e,e?.addEventListener?.("ready",this._onReconnect)}_checkServerVersion(){this.hass.connection.sendMessagePromise({type:"maintenance_supporter/version"}).then(e=>{this._restartPendingVersion=ri(e),this._staleBundle=!this._restartPendingVersion&&ai(e?.version)}).catch(()=>{})}async _loadData(){let[e,t,i,s,r,c]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"}).catch(()=>null)]);if(c&&(this._savedViews=c.views||[]),e&&(this._objects=Ze(e.objects),Vt(this._objects,t??this._stats??null),this._maybeLoadGettingStarted()),this._detailOpen()&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/status"}).then(o=>{this._batteryFleetSetupAvailable=!!o.available&&!o.configured}).catch(()=>{this._batteryFleetSetupAvailable=!1}),this._staleChecked||(this._staleChecked=!0,this._checkServerVersion()),t&&(this._stats=t),i&&(this._budget=i,We(this._budget)),s&&(this._groups=s.groups||{}),r){let o=Bi(r);this._features=o.features,this._adminPanelUserIds=[...o.access.operatorIds],this._operatorWriteEnabled=o.access.operatorWriteEnabled,this._defaultWarningDays=o.defaultWarningDays,this._rowActionStyle=o.rowActionStyle,this._rowActionNotice=o.rowActionNoticePending,this._refsInLists=o.refsInLists,this._objectsTableColumns=vi(o.objectsTableColumns),this._partsCostMode=o.partsCostMode}this._fetchMiniStatsForOverview(),this._initialLoadDone=!0,this._handleDeepLink()}_onLocationChanged(){if(!this._initialLoadDone||!window.location.search||this.embedded&&this._mountPath!==null&&window.location.pathname!==this._mountPath)return;if(!this.embedded){let t=`/${typeof this.panel?.url_path=="string"?this.panel.url_path:"maintenance-supporter"}`,i=window.location.pathname;if(i!==t&&!i.startsWith(`${t}/`))return}this._deepLinkHandled=!1,this._deepLinkInPlace=!0;try{this._handleDeepLink()}finally{this._deepLinkInPlace=!1}history.state?.msp_view||history.replaceState({msp_view:this._view,msp_entry:this._selectedEntryId,msp_task:this._selectedTaskId,msp_area:this._selectedAreaId},"")}_handleDeepLink(){if(this._deepLinkHandled)return;let e=new URLSearchParams(window.location.search),t=e.get("ms_action"),i=()=>{let S=window.location.pathname+window.location.hash;history.replaceState(history.state,"",S)};if(t==="add_object"){this._deepLinkHandled=!0,i(),this._ui("maintenance-object-dialog").then(S=>S?.openCreate());return}if(t==="open_vacation"||t==="open_budget"||t==="open_groups"||t==="open_settings"){if(this._deepLinkHandled=!0,i(),!this.hass?.user?.is_admin)return;this._overviewTab="settings",this._ensureLazyUi().then(()=>requestAnimationFrame(()=>{let S=this.shadowRoot?.querySelector("maintenance-settings-view"),$=t.replace("open_","");S?.scrollToSection?.($)}));return}if(this.embedded&&!this._presetsApplied){this._presetsApplied=!0;let S=this.presets?.tab??"",$=(this.presets?.view??"").trim();if(!e.has("tab")&&Ut.includes(S)&&(S!=="settings"||this.hass?.user?.is_admin)&&(this._overviewTab=S),!e.has("view")&&$){let C=$.toLowerCase(),b=this._savedViews.find(D=>D.id===$)??this._savedViews.find(D=>D.name.trim().toLowerCase()===C);b&&(this._overviewTab="dashboard",this._applyView(b.id))}}let s=e.get("tab"),r=e.get("view"),c=e.get("sort"),o=e.get("status");if(s!==null||r!==null||c!==null||o!==null){if(i(),this._view!=="overview"&&(this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()),Ut.includes(s??"")&&(s!=="settings"||this.hass?.user?.is_admin)&&this._setOverviewTab(s),r!==null){let S=r.trim().toLowerCase(),$=this._savedViews.find(C=>C.id===r)??this._savedViews.find(C=>C.name.trim().toLowerCase()===S);$&&(this._overviewTab!=="dashboard"&&this._setOverviewTab("dashboard"),this._applyView($.id))}ii.includes(c??"")&&(this._sortMode=c,this._activeViewId="",V(A.taskSort,this._sortMode)),Ns.includes(o??"")&&(this._overviewTab!=="dashboard"&&this._setOverviewTab("dashboard"),this._filterByStatus(o))}let u=e.get("area");if(u&&!e.get("entry_id")){this._deepLinkHandled=!0,i(),this._objects.some(S=>Ci(S.object)===u)?this._showArea(u):this._showAllAreas();return}let p=e.get("entry_id");if(!p)return;this._deepLinkHandled=!0;let g=e.get("task_id"),m=e.get("action"),v=e.get("section"),y=qs.includes(v??"")?v:null,E=window.location.pathname+window.location.hash;history.replaceState(history.state,"",E);let x=this._getObject(p);if(!x){this._showOverview();return}if(g){let S=x.tasks.find($=>$.id===g);if(!S){this._showObject(p,y);return}this._showTask(p,g),m==="complete"?requestAnimationFrame(()=>{this._openCompleteDialog(p,g,S.name,this._features.checklists?S.checklist:void 0,this._features.adaptive&&!!S.adaptive_config?.enabled,{viaTagScan:!0})}):m==="skip"?requestAnimationFrame(()=>{S.allow_skip!==!1&&this._promptSkipTask(p,g)}):m==="quick_complete"&&requestAnimationFrame(()=>{this._handleQuickComplete(p,g,S)})}else this._showObject(p,y)}_isCounterEntity(e){if(!e)return!1;let t=e.type||"threshold";return t==="counter"||t==="state_change"}async _fetchDetailStats(e,t){if(!this._statsService)return;let i=(this._detailStatsSeq.get(e)??0)+1;this._detailStatsSeq.set(e,i);let s=await this._statsService.getDetailStats(e,t,this._chartRangeDays);if(this._detailStatsSeq.get(e)!==i)return;let r=new Map(this._detailStatsData);r.set(e,s),this._detailStatsData=r}_setChartRange(e){if(e===this._chartRangeDays)return;this._chartRangeDays=e;try{V(A.chartRange,String(e))}catch{}let t=this._selectedEntryId&&this._selectedTaskId?this._getTask(this._selectedEntryId,this._selectedTaskId):null,i=me(t?.trigger_config);if(i){let s=new Map(this._detailStatsData);s.delete(i),this._detailStatsData=s,this._fetchDetailStats(i,this._isCounterEntity(t.trigger_config))}}_setHideOutliers(e){if(e!==this._hideOutliers){this._hideOutliers=e;try{V(A.chartHideOutliers,e?"1":"0")}catch{}}}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let e=[];for(let i of this._objects)for(let s of i.tasks){let r=s.battery_fleet_task?void 0:me(s.trigger_config);r&&e.push({entityId:r,isCounter:this._isCounterEntity(s.trigger_config)})}if(e.length===0)return;let t=await this._statsService.getBatchMiniStats(e);this._miniStatsData=new Map([...this._miniStatsData,...t])}async _subscribe(){try{let e=await this.hass.connection.subscribeMessage(t=>{let i=t,s=cs(this._objects,i);s!==null&&(this._objects=s,t.objects&&Vt(s,this._stats??null),this._refreshKpis(),this._detailOpen()&&(i.objects||(i.delta||[]).some(r=>r.entry_id===this._selectedEntryId))&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId))},{type:"maintenance_supporter/subscribe",deltas:!0,compact:!0});if(!this.isConnected){e();return}this._unsub=e}catch{}}async _refreshKpis(){if(this._kpiRefreshInFlight){this._kpiRefreshPending=!0;return}this._kpiRefreshInFlight=!0;try{do{this._kpiRefreshPending=!1;let[e,t]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null)]);if(!this.isConnected)return;e&&(this._stats=e),t&&(this._budget=t,We(this._budget))}while(this._kpiRefreshPending)}finally{this._kpiRefreshInFlight=!1}}get _taskRows(){let e=[];for(let g of this._objects)for(let m of g.tasks){if(!this._showArchived&&m.archived||this._filterStatus&&m.status!==this._filterStatus)continue;if(this._filterUser){let y=this._filterUser==="current_user"?this._userService?.getCurrentUserId():this._filterUser;if(!tt(m,y))continue}if(this._filterLabel&&!(m.labels||[]).includes(this._filterLabel)||this._filterPlace&&(g.object.place||"home")!==this._filterPlace||this._filterPriority&&(m.priority||"normal")!==this._filterPriority)continue;let v=[];for(let y of Object.values(this._groups))y.task_refs?.some(E=>E.entry_id===g.entry_id&&E.task_id===m.id)&&v.push(y.name);e.push({entry_id:g.entry_id,task_id:m.id,object_name:g.object.name,allow_skip:m.allow_skip!==!1,notify_enabled:m.notify_enabled!==!1,task_name:m.name,type:m.type,schedule_type:m.schedule_type,status:m.status,days_until_due:m.days_until_due??null,next_due:m.next_due??null,last_performed:m.last_performed??null,next_event_titles:m.next_event_titles??[],trigger_active:m.trigger_active,trigger_current_value:m.trigger_current_value??null,trigger_current_delta:m.trigger_current_delta??null,trigger_config:m.trigger_config??null,trigger_entity_info:m.trigger_entity_info??null,battery_fleet_task:m.battery_fleet_task===!0,times_performed:m.times_performed,total_cost:m.total_cost,interval_days:m.interval_days??null,interval_unit:m.interval_unit??null,interval_anchor:m.interval_anchor??null,is_done:m.is_done??!1,archived:m.archived??!1,history:m.history||[],enabled:m.enabled,nfc_tag_id:m.nfc_tag_id??null,priority:m.priority??"normal",labels:m.labels??[],area_id:g.object.area_id??null,responsible_user_id:m.responsible_user_id??null,assignee_pool:m.assignee_pool??null,group_names:v})}let t=(g,m)=>De(g.status)-De(m.status),i=(g,m)=>(g.days_until_due??99999)-(m.days_until_due??99999),s=(g,m)=>t(g,m)||i(g,m),r=g=>g.area_id&&this.hass?.areas?.[g.area_id]?.name||"",c=g=>et(g).map(m=>this._userService?.getUserName(m)||"").filter(Boolean),o=g=>c(g).sort((m,v)=>m.localeCompare(v)).join(", "),u=g=>g.group_names[0]||"",p={due_date:s,object:(g,m)=>g.object_name.localeCompare(m.object_name)||s(g,m),type:(g,m)=>g.type.localeCompare(m.type)||s(g,m),task_name:(g,m)=>g.task_name.localeCompare(m.task_name),area:(g,m)=>{let v=r(g),y=r(m);return!v&&y?1:v&&!y?-1:v.localeCompare(y)||s(g,m)},assigned_user:(g,m)=>{let v=o(g),y=o(m);return!v&&y?1:v&&!y?-1:v.localeCompare(y)||s(g,m)},group:(g,m)=>{let v=u(g),y=u(m);return!v&&y?1:v&&!y?-1:v.localeCompare(y)||s(g,m)}};return e.sort(p[this._sortMode]),e}_getObject(e){return this._objects.find(t=>t.entry_id===e)}_getTask(e,t){return this._getObject(e)?.tasks.find(s=>s.id===t)}_listRef(e,t){if(!this._refsInLists)return h;let i=this._getObject(e);return He(je(i?.object,i?.tasks.find(s=>s.id===t)))}_objRef(e){return this._refsInLists?He(Se(e)):h}_pushPanelState(e,t,i,s){let r={msp_view:e,msp_entry:t||null,msp_task:i||null,msp_area:s||null};this._deepLinkInPlace?history.replaceState(r,""):history.pushState(r,"")}_onPopState(e){let t=e.state;if(t?.msp_view&&(this._view=t.msp_view,this._selectedEntryId=t.msp_entry||null,this._selectedTaskId=t.msp_task||null,this._selectedAreaId=t.msp_area||null,this._moreMenuOpen=!1,this._objectSectionOverride=null,t.msp_view==="all_parts"&&this._loadAllParts(),t.msp_view==="task"&&t.msp_entry&&t.msp_task)){this._historyFilter=null;let i=this._getTask(t.msp_entry,t.msp_task),s=me(i?.trigger_config);i&&s&&this._fetchDetailStats(s,this._isCounterEntity(i.trigger_config))}}_showOverview(){this._pushPanelState("overview"),this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()}_showAllObjects(){this._pushPanelState("all_objects"),this._view="all_objects",this._objBulkMode=!1,this._objBulkSelected=new Set,this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_showAllParts(){this._pushPanelState("all_parts"),this._view="all_parts",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop(),this._loadAllParts()}async _loadAllParts(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});this._allParts=e.parts||[]}catch{this._allParts=[]}}_showAllAreas(){this._pushPanelState("all_areas"),this._view="all_areas",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_showArea(e){this._pushPanelState("area",null,null,e),this._view="area",this._selectedAreaId=e,this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_ensureAreaUi(){this._areaUi??=Promise.all([import("/maintenance_supporter_panelfiles/panel-chunks/areas-view-244TIPFT.js"),import("/maintenance_supporter_panelfiles/panel-chunks/area-view-BLP4MECM.js")]).catch(()=>{this._areaUi=null})}_filterByStatus(e){this._filterStatus=e,this._activeViewId="",this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard"),this._scrollContentToTop()}get _allLabels(){let e=new Set;for(let t of this._objects)for(let i of t.tasks)for(let s of i.labels||[])e.add(s);return[...e].sort((t,i)=>t.localeCompare(i))}get _allPlaces(){let e=new Map;for(let t of this._objects){let i=t.object;i.place&&!e.has(i.place)&&e.set(i.place,i.place_name||i.place)}return[...e].map(([t,i])=>({id:t,name:i})).sort((t,i)=>t.name.localeCompare(i.name))}get _currentFilters(){return{status:this._filterStatus,user_id:this._filterUser,label:this._filterLabel,priority:this._filterPriority,archived:this._showArchived,sort_mode:this._sortMode,group_by:this._groupByMode}}_applyView(e){if(this._activeViewId=e,!e)return;let t=this._savedViews.find(s=>s.id===e);if(!t)return;let i=t.filters;this._filterStatus=i.status||"",this._filterUser=i.user_id||null,this._filterLabel=i.label||null,this._filterPriority=i.priority||"",this._showArchived=!!i.archived,ii.includes(i.sort_mode)&&(this._sortMode=i.sort_mode),Bs.includes(i.group_by)&&(this._groupByMode=i.group_by);try{V(A.taskSort,this._sortMode),V(A.groupBy,this._groupByMode)}catch{}this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard")}_openSavedViewsDialog(){this.shadowRoot.querySelector("maintenance-saved-views-dialog")?.open(this._currentFilters,this._savedViews)}_onSavedViewsChanged(e){this._savedViews=e.detail.views||[],this._activeViewId&&!this._savedViews.some(t=>t.id===this._activeViewId)&&(this._activeViewId="")}_scrollContentToTop(){requestAnimationFrame(()=>{let e=this.shadowRoot?.querySelector(".content");e&&e.scrollTo({top:0,behavior:"smooth"})})}_renderLineageLink(e,t){let i=e?this._objects.find(s=>s.entry_id===e):void 0;return i?n`<p class="meta">${t}:
      <a href="#" class="object-lineage-link" @click=${s=>{s.preventDefault(),this._showObject(i.entry_id)}}
        >${i.object.name}</a></p>`:h}_showObject(e,t=null){this._pushPanelState("object",e),this._view="object",this._selectedEntryId=e,this._selectedTaskId=null,this._objectSectionOverride=t,t?this._scrollToObjectSection(t):this._scrollContentToTop()}_scrollToObjectSection(e){this.updateComplete.then(()=>requestAnimationFrame(()=>{let t=this.shadowRoot?.querySelector(`.obj-section[data-section="${e}"]`);t?t.scrollIntoView({block:"start",behavior:"smooth"}):this._scrollContentToTop()}))}_toggleObjectSection(e){let t=new Set(this._objectSectionsCollapsed);this._objectSectionOverride===e||!t.has(e)?t.add(e):t.delete(e),this._objectSectionOverride===e&&(this._objectSectionOverride=null),this._objectSectionsCollapsed=t,V(A.objectSections,JSON.stringify([...t]))}_splitActive(){return this.split&&!this.narrow&&!this.tight&&this._view==="overview"&&this._overviewTab==="dashboard"&&!this._bulkMode}_detailOpen(){return(this._view==="task"||this._splitActive())&&!!this._selectedEntryId&&!!this._selectedTaskId}_showFullTaskPage(e,t){this._view!=="task"&&(this._pushPanelState("task",e,t),this._view="task",this._selectedEntryId=e,this._selectedTaskId=t,this._scrollContentToTop())}_showTask(e,t){if(this._splitActive()){this._selectedEntryId=e,this._selectedTaskId=t,this._activeTab="overview",this._historyFilter=null,this._historySearch="",this._resetStickyPane(),this._fetchFullHistory(e,t);let r=this._getTask(e,t),c=me(r?.trigger_config);r&&c&&this._fetchDetailStats(c,this._isCounterEntity(r.trigger_config));return}this._pushPanelState("task",e,t),this._view="task",this._selectedEntryId=e,this._selectedTaskId=t,this._activeTab="overview",this._historyFilter=null,this._historySearch="",this._scrollContentToTop(),this._fetchFullHistory(e,t);let i=this._getTask(e,t),s=me(i?.trigger_config);i&&s&&this._fetchDetailStats(s,this._isCounterEntity(i.trigger_config))}_countText(e,t,i,s,r=this._lang){return s===1?a(t,r):a(e,r).replace(`{${i}}`,String(s))}_showToast(e,t="error"){this._toastTimer&&clearTimeout(this._toastTimer),this._toastKind=t,this._toastUndo=null,this._toastActionLabel="",this._toastMessage=e,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastTimer=null},4e3)}_showActionToast(e,t,i){this._showUndoToast(e,i),this._toastActionLabel=t}_showUndoToast(e,t){this._toastTimer&&clearTimeout(this._toastTimer),this._toastKind="info",this._toastActionLabel="",this._toastMessage=e,this._toastUndo=t,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastUndo=null,this._toastTimer=null},7e3)}_runToastUndo(){let e=this._toastUndo;this._toastTimer&&clearTimeout(this._toastTimer),this._toastMessage="",this._toastUndo=null,this._toastTimer=null,e?.()}_openPalette(){this._paletteQuery="",this._paletteActive=0,this._paletteOpen=!0,this._searchRemote=null,this.updateComplete.then(()=>{this.shadowRoot?.querySelector(".palette-input")?.focus()})}_closePalette(){this._paletteOpen=!1,this._paletteQuery="",this._searchRemote=null,this._searchTimer&&(clearTimeout(this._searchTimer),this._searchTimer=null)}_onPaletteInput(e){this._paletteQuery=e,this._paletteActive=0,this._searchTimer&&clearTimeout(this._searchTimer);let t=e.trim();if(t.length<Mt){this._searchRemote=null;return}this._searchTimer=setTimeout(()=>{this._searchTimer=null;let i=++this._searchSeq;this.hass.connection.sendMessagePromise({type:"maintenance_supporter/search",query:t,limit:Pe.documents}).then(s=>{i!==this._searchSeq||!this._paletteOpen||(this._searchRemote={query:t,documents:s.documents||[],history:s.history||[]})}).catch(()=>{i!==this._searchSeq||!this._paletteOpen||(this._searchRemote={query:t,documents:[],history:[]})})},Ha)}get _paletteResults(){let e=this._lang,t=this._paletteQuery.trim();if(t.length<Mt&&!nt(t))return[];let i=rt(t);if(!i.length)return[];let s=[],r=[],c=[],o=nt(t);if(o){for(let m of this._objects){let v=m.object;if(v.ref_no!==o.object)continue;let y=Se(v),E=(x,S)=>x?[S,a("archived",e)].filter(Boolean).join(" \xB7 "):S;o.task==null&&s.push({kind:"object",entryId:m.entry_id,label:v.name||"",sub:E(v.archived,a("object",e)),score:1e3,icon:"mdi:package-variant-closed",ref:y});for(let x of m.tasks)o.task!=null&&x.ref_no!==o.task||r.push({kind:"task",entryId:m.entry_id,taskId:x.id,label:x.name||"",sub:E(x.archived||v.archived,v.name||""),score:o.task==null?900:1e3,icon:"mdi:clipboard-check-outline",ref:je(v,x)})}if(s.length||r.length){let m=this._searchRemote&&this._searchRemote.query===t?this._searchRemote:null,v=[...s,...r.slice(0,Pe.tasks)];for(let y of m?.history.slice(0,1)??[])v.push({kind:"history",entryId:y.entry_id,taskId:y.task_id,label:y.task_name||"",sub:[y.object_name,y.timestamp?q(y.timestamp,e):""].filter(Boolean).join(" \xB7 "),snippet:y.snippet||"",score:y.score,icon:"mdi:note-text-outline",ref:y.ref??null});return v}}for(let m of this._objects){let v=m.object;if(v.archived)continue;let y=v.name||"",E=Le(i,[{text:y,weight:3},{text:v.manufacturer,weight:2},{text:v.model,weight:2},{text:v.serial_number,weight:2},{text:v.notes,weight:1}]);if(E>0){let x=[v.manufacturer,v.model].filter(Boolean).join(" ");s.push({kind:"object",entryId:m.entry_id,label:y,sub:x||a("object",e),score:E,icon:"mdi:package-variant-closed",ref:Se(v)})}for(let x of m.tasks){if(x.archived)continue;let S=(x.labels||[]).join(" "),$=Le(i,[{text:x.name,weight:3},{text:y,weight:2},{text:S,weight:2},{text:x.notes,weight:1}]);if($>0){let C=(x.labels||[]).length?`  #${(x.labels||[]).join(" #")}`:"";r.push({kind:"task",entryId:m.entry_id,taskId:x.id,label:x.name||"",sub:y+C,score:$,icon:"mdi:clipboard-check-outline",ref:je(v,x)})}}for(let x of m.parts||[]){let S=Le(i,[{text:x.name,weight:3},{text:x.mpn,weight:2},{text:x.vendor,weight:1},{text:x.storage_location,weight:1},{text:x.notes,weight:1}]);S>0&&c.push({kind:"part",entryId:m.entry_id,label:x.name||"",sub:[y,x.mpn].filter(Boolean).join(" \xB7 "),score:S,icon:"mdi:cog-outline"})}}let u=(m,v)=>v.score-m.score||m.label.localeCompare(v.label),p=[...s.sort(u).slice(0,Pe.objects),...r.sort(u).slice(0,Pe.tasks),...c.sort(u).slice(0,Pe.parts)],g=this._searchRemote&&this._searchRemote.query===t?this._searchRemote:null;if(g){let m=g.documents.slice(0,Pe.documents);for(let v of[...m.filter(y=>y.match!=="content"),...m.filter(y=>y.match==="content")])p.push({kind:v.match==="content"?"content":"document",entryId:v.entry_id,docId:v.id,docKind:v.kind,url:v.url,page:v.page??null,label:oe(v),sub:v.object_name||"",snippet:v.snippet||"",score:v.score,icon:v.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"});for(let v of g.history.slice(0,Pe.history))p.push({kind:"history",entryId:v.entry_id,taskId:v.task_id,label:v.task_name||"",ref:v.ref??null,sub:[v.object_name,v.timestamp?q(v.timestamp,e):""].filter(Boolean).join(" \xB7 "),snippet:v.snippet||"",score:v.score,icon:v.type==="skipped"?"mdi:skip-next-circle-outline":"mdi:note-text-outline"})}return p}_selectPaletteResult(e){let t=this._paletteQuery.trim();switch(this._closePalette(),e.kind){case"task":e.taskId&&this._showTask(e.entryId,e.taskId);return;case"history":if(!e.taskId)return;this._showTask(e.entryId,e.taskId),this._activeTab="history",this._historySearch=t;return;case"document":case"content":e.docKind==="weblink"?ce(e.url)&&window.open(e.url,"_blank","noopener"):e.docId&&Ee(this.hass,e.docId,e.page?`#page=${e.page}`:"").catch(()=>{}),this._showObject(e.entryId,"documents");return;case"part":this._showObject(e.entryId,"parts");return;default:this._showObject(e.entryId)}}_renderPalette(){if(!this._paletteOpen)return h;let e=this._lang,t=this._paletteResults,i=this._paletteQuery.trim(),s={object:a("objects",e),task:a("tasks",e),part:a("search_group_parts",e),document:a("documents",e),content:a("search_group_content",e),history:a("search_group_history",e)},r=i.length>=Mt&&(!this._searchRemote||this._searchRemote.query!==i),c=null;return n`
      <div class="palette-backdrop" @click=${()=>this._closePalette()}>
        <div class="palette" role="dialog" aria-label=${a("search_open",e)} @click=${o=>o.stopPropagation()}>
          <input
            class="palette-input"
            type="text"
            placeholder="${a("palette_placeholder",e)}"
            .value=${this._paletteQuery}
            @input=${o=>this._onPaletteInput(o.target.value)}
          />
          <div class="palette-results">
            ${i.length<Mt&&!nt(i)?n`<div class="palette-empty">${a("search_empty_hint",e)}</div>`:t.length===0?n`<div class="palette-empty">${r?a("search_searching",e):a("palette_no_results",e)}</div>`:t.map((o,u)=>{let p=o.kind!==c?n`<div class="palette-group">${s[o.kind]}</div>`:h;return c=o.kind,n`
                      ${p}
                      <div class="palette-item ${u===this._paletteActive?"active":""} ${o.snippet?"has-snippet":""}"
                        @mouseenter=${()=>{this._paletteActive=u}}
                        @click=${()=>this._selectPaletteResult(o)}>
                        <ha-icon icon="${o.icon}"></ha-icon>
                        <div class="palette-main">
                          <div class="palette-line">
                            <span class="palette-label">${o.label}</span>
                            ${o.ref?n`<span class="ref-chip">#${o.ref}</span>`:h}
                            ${o.page?n`<span class="palette-page">${a("search_page",e).replace("{page}",String(o.page))}</span>`:h}
                            <span class="palette-sub">${o.sub}</span>
                          </div>
                          ${o.snippet?n`<div class="palette-snippet">${o.snippet}</div>`:h}
                        </div>
                      </div>
                    `})}
            ${t.length>0&&r?n`<div class="palette-group palette-waiting">${a("search_searching",e)}</div>`:h}
          </div>
          <div class="palette-hint">${a("palette_hint",e)}</div>
        </div>
      </div>
    `}_openAdoptProblemSensors(){this._ui("maintenance-adopt-problem-sensors-dialog").then(e=>e?.open())}async _onProblemSensorsAdopted(e){let t=e.detail?.tasks_created??0,i=e.detail?.created??[];await this._loadData();let s=this._countText("adopt_problem_done","adopt_problem_done_one","tasks",t);i.length>0?this._showActionToast(s,a("adopt_problem_configure",this._lang),()=>{let r=i[0],c=this._objects.find(u=>u.entry_id===r.entry_id),o=c?.tasks.find(u=>u.id===r.task_id);c&&o&&this._ui("maintenance-task-dialog").then(u=>u?.openEdit(r.entry_id,o))}):this._showToast(s,"info")}async _setupBatteryFleet(){let e=await P(this,{type:"maintenance_supporter/battery_fleet/setup",language:this.hass.language||"en"},{reload:async()=>{this._batteryFleetSetupAvailable=!1,await this._loadData()},onError:s=>this._showToast(s)});if(e===void 0)return;let t=this._objects.find(s=>s.entry_id===e?.entry_id),i=t?.tasks.find(s=>s.id===e?.task_id)||t?.tasks[0];t&&i&&this._showTask(t.entry_id,i.id),this._showToast(a("battery_fleet_setup_done",this._lang),"info")}_openSuggestedSetups(){this._ui("maintenance-suggested-setups-dialog").then(e=>e?.open())}_onResetsWired(e){let t=e.detail?.wired??0;this._showToast(this._countText("reset_offers_done","reset_offers_done_one","count",t),"info"),this._resetOffersLoaded=!1,this._resetOffersCount=0,this._maybeLoadResetOffers(),this._loadData()}_onSetupsAdopted(e){let t=e.detail?.tasks_created??0;this._showToast(this._countText("setups_done","setups_done_one","tasks",t),"info"),this._loadData()}async _openTemplateGallery(){this._templateGalleryOpen=!0;let e=await P(this,{type:"maintenance_supporter/templates",language:this._lang},{onError:t=>this._showToast(t)});e!==void 0&&(this._templateCategories=e?.categories||{},this._templates=(e?.templates||[]).filter(t=>!t.disabled),this._homeProfile=e?.profile??null)}async _createFromTemplate(e){let t=await P(this,{type:"maintenance_supporter/object/from_template",language:this._lang,template_id:e},{busy:i=>{this._templateBusy=i},reload:async()=>{this._templateGalleryOpen=!1,await this._loadData()},successToast:a("template_created",this._lang),onSuccess:i=>this._showToast(i,"info"),onError:i=>this._showToast(i)});t?.entry_id&&this._showObject(t.entry_id)}_categoryName(e){let t=this._templateCategories[e];return t&&(t[`name_${this._lang}`]||t.name_en)||e}_renderTemplateCard(e,t=!1){let i=this._lang,s=this._homeProfile?.country??null;return n`
      <button class="template-card ${e.dwelling_mismatch?"not-typical":""}" .disabled=${this._templateBusy}
        title=${e.dwelling_mismatch?a("templates_not_typical",i):""}
        @click=${()=>this._createFromTemplate(e.id)}>
        <span class="template-card-name">${e.name}</span>
        <span class="template-card-count">${e.tasks.length===1?a("templates_task_count_one",i):a("templates_task_count",i).replace("{n}",String(e.tasks.length))}</span>
        ${t&&e.reasons?.length?n`<span class="template-card-reasons">
              ${e.reasons.map(r=>n`<span class="template-card-reason">${ki(r,i,s)}</span>`)}
            </span>`:h}
        ${e.set_up?n`<span class="template-card-setup"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${a("templates_set_up",i)}</span>`:h}
      </button>
    `}_renderTemplateGallery(){if(!this._templateGalleryOpen)return h;let e=this._lang,t=new Map;for(let s of this._templates)t.has(s.category)||t.set(s.category,[]),t.get(s.category).push(s);for(let s of t.values())s.sort((r,c)=>+!!r.dwelling_mismatch-+!!c.dwelling_mismatch);let i=this._templates.filter(s=>s.recommended&&!s.set_up);return n`
      <div class="palette-backdrop" @click=${()=>{this._templateGalleryOpen=!1}}>
        <div class="template-gallery" @click=${s=>s.stopPropagation()}>
          <div class="template-gallery-head">
            <span>${a("templates_title",e)}</span>
            <ha-icon-button .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
              @click=${()=>{this._templateGalleryOpen=!1}}></ha-icon-button>
          </div>
          <div class="template-gallery-body">
            <div class="template-legal">
              <ha-icon icon="mdi:scale-balance"></ha-icon>
              <span>${a("templates_legal_hint",e)}</span>
            </div>
            ${i.length>0?n`
                  <div class="template-cat recommended">
                    <div class="template-cat-head">
                      <ha-icon icon="mdi:home-heart"></ha-icon>
                      ${a("templates_recommended_title",e)}
                    </div>
                    <div class="template-cat-hint">${a("templates_recommended_hint",e)}</div>
                    <div class="template-grid">${i.map(s=>this._renderTemplateCard(s,!0))}</div>
                  </div>`:h}
            ${this._templates.length===0?n`<div class="palette-empty">${a("loading",e)}…</div>`:[...t.entries()].map(([s,r])=>n`
                  <div class="template-cat">
                    <div class="template-cat-head">
                      <ha-icon icon="${this._templateCategories[s]?.icon||"mdi:folder-outline"}"></ha-icon>
                      ${this._categoryName(s)}
                    </div>
                    <div class="template-grid">${r.map(c=>this._renderTemplateCard(c))}</div>
                  </div>
                `)}
          </div>
        </div>
      </div>
    `}_bulkKey(e){return`${e.entry_id}:${e.task_id}`}_toggleBulkMode(){this._bulkMode=!this._bulkMode,this._bulkMenuOpen=!1,this._bulkMode||(this._bulkSelected=new Set)}_toggleBulkRow(e){let t=this._bulkKey(e),i=new Set(this._bulkSelected);i.has(t)?i.delete(t):i.add(t),this._bulkSelected=i}_bulkSelectAll(e){let t=e.map(s=>this._bulkKey(s)),i=t.every(s=>this._bulkSelected.has(s));this._bulkSelected=i?new Set:new Set(t)}async _runBulkItems(e,t,i,s,r){if(e.length===0)return;this._actionLoading=!0;let{done:c,failed:o}=await Ai(this,e,t);this._actionLoading=!1,s(),await this._loadData();let u=Ht(i(c.length),o,this._lang);r&&c.length>0?this._showUndoToast(u,()=>r(c)):this._showToast(u,o.length>0?"error":"info")}_runBulk(e,t,i,s){return this._runBulkItems(e.filter(r=>this._bulkSelected.has(this._bulkKey(r))),t,i,()=>{this._bulkSelected=new Set,this._bulkMode=!1},s)}async _bulkMove(e){let t=this._objects.filter(c=>!c.object.archived_at).sort((c,o)=>(c.object.name||"").localeCompare(o.object.name||""));if(!t.length||this._bulkSelected.size===0)return;let s=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("move_task_title",this._lang),message:a("bulk_move_message",this._lang),confirmText:a("move_task_title",this._lang),inputLabel:a("move_task_target",this._lang),inputValue:t[0].entry_id,options:t.map(c=>({value:c.entry_id,label:c.object.name||c.entry_id}))});if(!s?.confirmed||!s.value)return;let r=s.value;await this._runBulk(e.filter(c=>c.entry_id!==r),c=>({type:"maintenance_supporter/task/move",entry_id:c.entry_id,task_id:c.task_id,target_entry_id:r}),c=>a("bulk_moved",this._lang).replace("{n}",String(c)))}_toggleObjBulkMode(){this._objBulkMode=!this._objBulkMode,this._objBulkMode||(this._objBulkSelected=new Set)}_toggleObjBulk(e){let t=new Set(this._objBulkSelected);t.has(e)?t.delete(e):t.add(e),this._objBulkSelected=t}_objBulkSelectAll(e){let t=e.map(s=>s.entry_id),i=t.length>0&&t.every(s=>this._objBulkSelected.has(s));this._objBulkSelected=i?new Set:new Set(t)}_runObjBulk(e,t,i,s={}){return this._runBulkItems([...this._objBulkSelected],r=>({type:e,entry_id:r,...s}),t,()=>{this._objBulkSelected=new Set,this._objBulkMode=!1},i?r=>{i(r)}:void 0)}async _objBulkDelete(){let e=this._objBulkSelected.size;e===0||!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:a("delete",this._lang),message:a("bulk_delete_objects_confirm",this._lang).replace("{n}",String(e)),confirmText:a("delete",this._lang),danger:!0})||await this._runObjBulk("maintenance_supporter/object/delete",s=>a("bulk_objects_deleted",this._lang).replace("{n}",String(s)))}async _objBulkArea(){let e=[...this._objBulkSelected];if(e.length===0)return;let t=Object.values(this.hass?.areas||{}).sort((c,o)=>c.name.localeCompare(o.name)),s=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("area",this._lang),message:a("bulk_n_selected",this._lang).replace("{n}",String(e.length)),confirmText:a("save",this._lang),inputLabel:a("area",this._lang),inputValue:"",options:[{value:"",label:a("no_area",this._lang)},...t.map(c=>({value:c.area_id,label:c.name}))]});if(!s?.confirmed)return;let r=new Map(e.map(c=>[c,this._getObject(c)?.object.area_id??null]));this._runObjBulk("maintenance_supporter/object/update",c=>a("bulk_objects_area",this._lang).replace("{n}",String(c)),async c=>{for(let o of c)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:o,area_id:r.get(o)??null})}catch{}await this._loadData()},{area_id:s.value||null})}_objBulkArchive(){this._runObjBulk("maintenance_supporter/object/archive",e=>a("bulk_objects_archived",this._lang).replace("{n}",String(e)),async e=>{for(let t of e)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/unarchive",entry_id:t,undo:!0})}catch{}await this._loadData()})}_renderObjBulkBar(e,t){let i=this._objBulkSelected.size,s=e.length>0&&e.every(r=>this._objBulkSelected.has(r.entry_id));return n`
      <div class="bulk-bar obj-bulk-bar">
        <label class="bulk-selectall">
          <input type="checkbox" .checked=${s} @change=${()=>this._objBulkSelectAll(e)} />
          ${a("bulk_select_all",t)}
        </label>
        <span class="bulk-count">${a("bulk_n_selected",t).replace("{n}",String(i))}</span>
        <span class="bulk-actions">
          <ha-button appearance="plain" class="obj-bulk-area" .disabled=${i===0||this._actionLoading} @click=${()=>{this._objBulkArea()}}>
            <ha-icon icon="mdi:floor-plan"></ha-icon> ${a("area",t)}…
          </ha-button>
          <ha-button appearance="plain" class="obj-bulk-archive" .disabled=${i===0||this._actionLoading} @click=${()=>this._objBulkArchive()}>
            <ha-icon icon="mdi:archive-outline"></ha-icon> ${a("archive",t)}
          </ha-button>
          <ha-button appearance="filled" variant="danger" class="obj-bulk-delete" .disabled=${i===0||this._actionLoading} @click=${()=>this._objBulkDelete()}>
            <ha-icon icon="mdi:delete-outline"></ha-icon> ${a("delete",t)}
          </ha-button>
        </span>
      </div>
    `}_bulkComplete(e){this._runBulk(e,t=>({type:"maintenance_supporter/task/complete",entry_id:t.entry_id,task_id:t.task_id}),t=>a("bulk_completed",this._lang).replace("{n}",String(t)))}_bulkArchive(e){this._runBulk(e,t=>({type:"maintenance_supporter/task/archive",entry_id:t.entry_id,task_id:t.task_id}),t=>a("bulk_archived",this._lang).replace("{n}",String(t)),async t=>{for(let i of t)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/unarchive",entry_id:i.entry_id,task_id:i.task_id,undo:!0})}catch{}await this._loadData()})}async _bulkEdit(e,t){let i=t.filter(o=>this._bulkSelected.has(this._bulkKey(o)));if(i.length===0)return;let s=await this._ui("maintenance-bulk-edit-dialog"),r=this._userService?await this._userService.getUsers():[],c=await s?.open(e,i,r);c&&await this._sendBulkUpdate(i.map(o=>({entry_id:o.entry_id,task_id:o.task_id})),c)}async _sendBulkUpdate(e,t){let i=await P(this,{type:"maintenance_supporter/tasks/update_many",items:e,...t?{changes:t}:{}},{busy:o=>{this._actionLoading=o},onError:o=>this._showToast(o,"error")});if(!i)return;let s=t===null;s||(this._bulkSelected=new Set,this._bulkMode=!1),await this._loadData();let r=Ii(i.failed,this._lang),c=Ht(a("bulk_updated",this._lang).replace("{n}",String(i.updated.length)),r,this._lang);!s&&i.previous.length>0?this._showUndoToast(c,()=>{this._sendBulkUpdate(i.previous,null)}):this._showToast(c,r.length>0?"error":"info")}async _bulkPause(e){let t=e.filter(r=>this._bulkSelected.has(this._bulkKey(r))&&r.status!=="paused");if(t.length===0)return;let s=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("pause_task",this._lang),message:a("pause_task_prompt",this._lang),confirmText:a("pause_task",this._lang),inputLabel:a("pause_until_label",this._lang),inputType:"date"});s?.confirmed&&this._runBulk(t,r=>({type:"maintenance_supporter/task/pause",entry_id:r.entry_id,task_id:r.task_id,...s.value?{until:s.value}:{}}),r=>a("bulk_paused",this._lang).replace("{n}",String(r)),async r=>{for(let c of r)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/resume",entry_id:c.entry_id,task_id:c.task_id,undo:!0})}catch{}await this._loadData()})}_bulkResume(e){this._runBulk(e.filter(t=>t.status==="paused"),t=>({type:"maintenance_supporter/task/resume",entry_id:t.entry_id,task_id:t.task_id}),t=>a("bulk_resumed",this._lang).replace("{n}",String(t)))}async _runAction(e,t){let i=await P(this,e,{busy:s=>{this._actionLoading=s},reload:()=>this._loadData(),successToast:t?.successToast,onSuccess:s=>this._showToast(s,"info"),onError:s=>this._showToast(s)});return i===void 0?null:i??{}}async _deleteObject(e){if(!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:a("delete",this._lang),message:a("delete_object_confirm",this._lang),confirmText:a("delete",this._lang),danger:!0}))return;await this._runAction({type:"maintenance_supporter/object/delete",entry_id:e})&&this._showOverview()}_printObjectReport(e){let t=this._getObject(e);if(!t)return;let i=this._lang,s={title:a("report_title",i),generated:a("report_generated",i),manufacturer:a("manufacturer",i),model:a("model",i),serial:a("serial_number_label",i),installed:a("installed",i),warranty:a("warranty",i),area:a("area",i),notes:a("report_notes",i),tasksHeading:a("tasks",i),colTask:a("task_name",i),colType:a("report_col_type",i),colStatus:a("report_col_status",i),colSchedule:a("report_col_schedule",i),colLastDone:a("last_performed",i),colNextDue:a("next_due",i),colCost:a("cost",i),colTimes:a("report_times_done",i),totalCost:a("report_total_cost",i),scheduleLabel:c=>ze(c,i),none:"\u2014",statusLabel:c=>a(c,i),typeLabel:c=>a(c,i)},r=ps(t.object,t.tasks,s,c=>c?q(c,i):"",c=>U(c,this._currencySymbol,i),new Date().toISOString());Qe(r)}async _duplicateObject(e){let t=await this._runAction({type:"maintenance_supporter/object/duplicate",entry_id:e},{successToast:a("object_duplicated",this._lang)});t?.entry_id&&this._showObject(t.entry_id)}async _deleteTask(e,t){if(!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:a("delete",this._lang),message:a("delete_task_confirm",this._lang),confirmText:a("delete",this._lang),danger:!0}))return;await this._runAction({type:"maintenance_supporter/task/delete",entry_id:e,task_id:t})&&this._showObject(e)}async _duplicateTask(e,t){this._moreMenuOpen=!1;let i=await this._runAction({type:"maintenance_supporter/task/duplicate",entry_id:e,task_id:t},{successToast:a("task_duplicated",this._lang)});i?.task_id&&this._showTask(e,i.task_id)}async _moveTask(e,t){this._moreMenuOpen=!1;let i=this._objects.filter(o=>o.entry_id!==e&&!o.object.archived_at).sort((o,u)=>(o.object.name||"").localeCompare(u.object.name||""));if(!i.length)return;let r=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("move_task_title",this._lang),message:a("move_task_message",this._lang),confirmText:a("move_task_title",this._lang),inputLabel:a("move_task_target",this._lang),inputValue:i[0].entry_id,options:i.map(o=>({value:o.entry_id,label:o.object.name||o.entry_id}))});if(!r?.confirmed||!r.value)return;let c=await this._runAction({type:"maintenance_supporter/task/move",entry_id:e,task_id:t,target_entry_id:r.value},{successToast:a("task_moved",this._lang)});c?.entry_id&&c.task_id&&this._showTask(c.entry_id,c.task_id)}async _toggleArchiveTask(e,t,i,s=!1){await this._runAction({type:i?"maintenance_supporter/task/unarchive":"maintenance_supporter/task/archive",entry_id:e,task_id:t,...s?{undo:!0}:{}})&&!i&&this._showUndoToast(a("task_archived",this._lang),()=>this._toggleArchiveTask(e,t,!0,!0))}async _togglePauseTask(e,t,i,s=!1){if(!i){let c=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("pause_task",this._lang),message:a("pause_task_prompt",this._lang),confirmText:a("pause_task",this._lang),inputLabel:a("pause_until_label",this._lang),inputType:"date"});if(!c?.confirmed)return;let o={type:"maintenance_supporter/task/pause",entry_id:e,task_id:t};c.value&&(o.until=c.value),await this._runAction(o)&&this._showUndoToast(a("task_paused",this._lang),()=>this._togglePauseTask(e,t,!0,!0));return}await this._runAction({type:"maintenance_supporter/task/resume",entry_id:e,task_id:t,...s?{undo:!0}:{}},{successToast:a("task_resumed",this._lang)})}async _toggleArchiveObject(e,t,i=!1){await this._runAction({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:e,...i?{undo:!0}:{}})&&!t&&this._showUndoToast(a("object_archived",this._lang),()=>this._toggleArchiveObject(e,!0,!0))}async _togglePauseObject(e,t,i=!1){if(!t){let r=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("pause_object",this._lang),message:a("pause_until_prompt",this._lang),confirmText:a("pause_object",this._lang),inputLabel:a("pause_until_label",this._lang),inputType:"date"});if(!r?.confirmed)return;let c={type:"maintenance_supporter/object/pause",entry_id:e};r.value&&(c.until=r.value),await this._runAction(c)&&this._showUndoToast(a("object_paused",this._lang),()=>this._togglePauseObject(e,!0,!0));return}await this._runAction({type:"maintenance_supporter/object/resume",entry_id:e,...i?{undo:!0}:{}},{successToast:a("object_resumed",this._lang)})}_replaceObject(e,t){this._ui("maintenance-object-dialog").then(i=>i?.openReplace(e,t))}_deviceSwapText(e){if(!e||!e.moved&&!e.unmatched.length)return"";let t=[];return e.moved&&t.push(this._countText("device_swap_moved","device_swap_moved_one","count",e.moved)),e.unmatched.length&&t.push(this._countText("device_swap_unmatched","device_swap_unmatched_one","count",e.unmatched.length)),t.join(" ")}async _skipTask(e,t,i){let s={type:"maintenance_supporter/task/skip",entry_id:e,task_id:t};i&&(s.reason=i),await this._runAction(s)}async _resetTask(e,t,i){let s={type:"maintenance_supporter/task/reset",entry_id:e,task_id:t};i&&(s.date=i),await this._runAction(s)}async _applySuggestion(e,t,i){await this._runAction({type:"maintenance_supporter/task/apply_suggestion",entry_id:e,task_id:t,interval:i})}_openSeasonalOverrides(e){let t=this.shadowRoot.querySelector("maintenance-seasonal-overrides-dialog");if(!t||!this._selectedEntryId)return;let i=e.adaptive_config?.seasonal_overrides;t.open(this._selectedEntryId,e.id,i)}async _reanalyzeInterval(e,t){let i=await this._runAction({type:"maintenance_supporter/task/analyze_interval",entry_id:e,task_id:t});i&&(i.recommended_interval?this._showToast(`${a("reanalyze_result",this._lang)}: ${i.recommended_interval} ${a("days",this._lang)} (${a(`confidence_${i.confidence}`,this._lang)}, ${i.data_points} ${a("data_points",this._lang)})`,"info"):this._showToast(a("reanalyze_insufficient_data",this._lang),"info"))}async _promptSkipTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let s=await i.prompt({title:a("skip",this._lang),message:a("skip_reason_prompt",this._lang),confirmText:a("skip",this._lang),inputLabel:a("reason_optional",this._lang),inputType:"text"});s.confirmed&&this._skipTask(e,t,s.value||void 0)}async _promptResetTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let s=await i.prompt({title:a("reset",this._lang),message:a("reset_date_prompt",this._lang),confirmText:a("reset",this._lang),inputLabel:a("reset_date_optional",this._lang),inputType:"date"});s.confirmed&&this._resetTask(e,t,s.value||void 0)}async _postponeTask(e,t,i){await this._runAction({type:"maintenance_supporter/task/postpone",entry_id:e,task_id:t,until:i},{successToast:a("postponed",this._lang)})}async _promptPostponeTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let s=await i.prompt({title:a("postpone",this._lang),message:a("postpone_date_prompt",this._lang),confirmText:a("postpone",this._lang),inputLabel:a("postpone_date_label",this._lang),inputType:"date"});!s.confirmed||!s.value||this._postponeTask(e,t,s.value)}async _snoozeTask(e,t){let i=await this._runAction({type:"maintenance_supporter/task/snooze",entry_id:e,task_id:t});i&&this._showToast(Yi(i,this._lang),"info")}_dismissSuggestion(e,t){e&&t&&this._dismissedSuggestions.add(`${e}_${t}`),this.requestUpdate()}async _handleQuickComplete(e,t,i){let s=null,r=await P(this,{type:"maintenance_supporter/task/quick_complete",entry_id:e,task_id:t},{fallbackKey:"action_error",onError:(c,o)=>{s={message:c,code:o?.code||""}}});if(r===void 0){let{message:c,code:o}=s??{message:"",code:""};o==="no_defaults"||o==="completion_details_required"?this._openCompleteDialog(e,t,i.name,this._features.checklists?i.checklist:void 0,this._features.adaptive&&!!i.adaptive_config?.enabled,{viaTagScan:!0}):this._showToast(c);return}r?.undo?this._offerUndo(e,t,a("quick_complete_success",this._lang)):this._showToast(a("quick_complete_success",this._lang),"info");try{await this._loadData()}catch{}}async _printTaskWorksheet(e,t){let i=this._getObject(e),s=i?.tasks.find(o=>o.id===t);if(!i||!s)return;let r=ut(),c=!1;this._actionLoading=!0;try{let o={type:"maintenance_supporter/qr/generate",entry_id:e,task_id:t,url_mode:"server"},[u,p]=await Promise.all([this.hass.connection.sendMessagePromise({...o,action:"view"}).catch(()=>null),this.hass.connection.sendMessagePromise({...o,action:"complete"}).catch(()=>null)]),g=null;try{let S=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:e})).documents||[]).find($=>$.kind==="file"&&$.mime==="application/pdf"&&($.task_ids||[]).includes(t)&&$.task_pages?.[t]);if(S){let $=S.task_pages[t],C=4,b={path:await mi(this.hass,`/api/maintenance_supporter/document/${S.id}/excerpt?start=${$}&count=${C}`,3600)};g={title:oe(S)||"Manual",startPage:$,endPage:$+C-1,url:new URL(b.path,window.location.origin).toString(),vendorBase:new URL("/maintenance_supporter_vendor",window.location.origin).toString()}}}catch{}let m=this._lang,v={title:a("worksheet",m),object:a("object",m),type:a("maintenance_type",m),interval:a("interval",m),nextDue:a("next_due",m),lastDone:a("last_performed",m),priority:a("priority",m),checklist:a("checklist",m),notes:a("notes_label",m),scanView:a("worksheet_scan_view",m),scanComplete:a("worksheet_scan_complete",m),manualExcerpt:a("worksheet_manual_excerpt",m),pages:a("worksheet_pages",m),printedOn:a("worksheet_printed",m),never:a("worksheet_never",m),typeLabel:x=>a(x,m),statusLabel:x=>a(x,m),parts:a("consumes_parts_label",m)},y=(s.consumes_parts||[]).map(x=>bi(x,i.entry_id,this._objects,m)),E=hs(s,i.object.name,v,x=>q(x,m),x=>ze(x,m),u?.svg_data_uri||null,p?.svg_data_uri||null,g,new Date().toISOString(),y,je(i.object,s));Qe(E,r),c=!0}finally{c||r?.close(),this._actionLoading=!1}}_openManualDoc(e){if(e.kind!=="file"){ce(e.url)&&window.open(e.url,"_blank","noopener");return}Ee(this.hass,e.id).catch(()=>{})}_setChecklistItem(e,t,i,s){let r=`${e}/${t}`;this._checklistPending.set(r,{...this._checklistPending.get(r)??{},[i]:s});let c=this._checklistChain.then(async()=>{let o=this._getObject(e)?.tasks.find(v=>v.id===t);if(!o)return;let u=this._checklistPending.get(r)??{},p={},g=mt(o)?.checklist??(o.checklist||[]);for(let v of g)p[v]=v in u?u[v]:o.checklist_progress?.[v]??!1;await this._runAction({type:"maintenance_supporter/task/checklist_progress",entry_id:e,task_id:t,checklist_state:p});let m=this._checklistPending.get(r);if(m){for(let[v,y]of Object.entries(p))v in m&&m[v]===y&&delete m[v];Object.keys(m).length===0&&this._checklistPending.delete(r)}});return this._checklistChain=c.catch(()=>{}),c}_openCompleteDialog(e,t,i,s,r,c){this._ui("maintenance-complete-dialog").then(o=>o&&this._fillAndOpenCompleteDialog(o,e,t,i,s,r,c))}_fillAndOpenCompleteDialog(e,t,i,s,r,c,o){Si(e,$i({entryId:t,taskId:i,taskName:s,task:this._getTask(t,i),objects:this._objects,lang:this._lang,checklist:r,features:this._features,adaptiveEnabled:c,currencySymbol:this._currencySymbol,viaTagScan:o?.viaTagScan,partsCostMode:this._partsCostMode}),this._lang)}_openQrForObject(e,t){this._ui("maintenance-qr-dialog").then(i=>i?.openForObject(e,t))}_openQrForTask(e,t,i,s){this._ui("maintenance-qr-dialog").then(r=>r?.openForTask(e,t,i,s))}_offerUndo(e,t,i){this._showUndoToast(i,()=>{this._undoCompletion(e,t)})}async _undoCompletion(e,t){let i=await fs(this.hass,e,t,this._lang);this._showToast(i.message,i.ok?"info":"error"),i.ok&&await this._onDialogEvent()}render(){return n`
      <div class="panel">
        ${this._restartPendingVersion?n`
              <div class="update-banner restart-pending-banner" role="status">
                <ha-icon icon="mdi:restart"></ha-icon>
                <span>${a("restart_pending_banner",this._lang).replace("{version}",this._restartPendingVersion)}</span>
              </div>
            `:h}
        ${this._staleBundle?n`
              <div class="update-banner" role="status">
                <ha-icon icon="mdi:update"></ha-icon>
                <span>${a("update_banner",this._lang)}</span>
                <ha-button appearance="plain" @click=${()=>location.reload()}>
                  ${a("update_reload",this._lang)}
                </ha-button>
              </div>
            `:h}
        ${this._rowActionNotice&&this.hass?.user?.is_admin?n`
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
        ${this._toastUndo?n`<button class="toast-undo" @click=${()=>this._runToastUndo()}>${this._toastActionLabel||a("undo",this._lang)}</button>`:h}
      </div>`:h}
      ${this._renderPalette()}
      ${this._renderTemplateGallery()}
    `}_renderSearchButton(e){let t=this._lang;return n`<ha-icon-button
      class=${e}
      .path=${Ba}
      .label=${a("search_open",t)}
      title=${a("search_open",t)}
      @click=${()=>this._openPalette()}
    ></ha-icon-button>`}_renderHeader(){let e=[{label:a("maintenance",this._lang),action:()=>this._showOverview()}];if(this._view==="object"&&this._selectedEntryId){let t=this._getObject(this._selectedEntryId);e.push({label:t?.object.name||"Object"})}if(this._view==="task"&&this._selectedEntryId&&this._selectedTaskId){let t=this._getObject(this._selectedEntryId);e.push({label:t?.object.name||"Object",action:()=>this._showObject(this._selectedEntryId)});let i=this._getTask(this._selectedEntryId,this._selectedTaskId);e.push({label:i?.name||"Task"})}return this._view==="area"&&this._selectedAreaId&&(e.push({label:a("all_areas",this._lang),action:()=>this._showAllAreas()}),e.push({label:Pt(this._selectedAreaId,this.hass?.areas,a("no_area",this._lang))})),n`
      <div class="header">
        ${this.narrow&&!this.embedded?n`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`:h}
        ${this._view!=="overview"?n`<ha-icon-button
              .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
              @click=${()=>{this._view==="task"?this._showObject(this._selectedEntryId):this._view==="area"?this._showAllAreas():this._showOverview()}}
            ></ha-icon-button>`:h}
        <div class="breadcrumbs">
          ${e.map((t,i)=>n`
              ${i>0?n`<span class="sep">/</span>`:h}
              ${t.action?n`<a @click=${t.action}>${t.label}</a>`:n`<span class="current">${t.label}</span>`}
            `)}
        </div>
        ${this._renderSearchButton("header-search")}
      </div>
    `}_renderOverview(){let e=this._lang,t=!!this.hass?.user?.is_admin,i=this._stats;return!t&&this._overviewTab==="settings"&&(this._overviewTab="dashboard"),n`
      ${i?n`
            <div class="stats-bar">
              <div class="stat-item clickable"
                   @click=${()=>this._showAllObjects()}
                   title=${a("show_all_objects",e)}>
                <span class="stat-value">${i.total_objects}</span>
                <span class="stat-label">${a("objects",e)}</span>
              </div>
              <div class="stat-item clickable"
                   @click=${()=>this._filterByStatus("")}
                   title=${a("show_all_tasks",e)}>
                <span class="stat-value">${i.total_tasks}</span>
                <span class="stat-label">${a("tasks",e)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="overdue"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("overdue")}
                   title=${a("filter_to_overdue",e)}>
                <span class="stat-value" style="color: var(--error-color)">${i.overdue}</span>
                <span class="stat-label">${a("overdue",e)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="due_soon"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("due_soon")}
                   title=${a("filter_to_due_soon",e)}>
                <span class="stat-value" style="color: var(--warning-color)">${i.due_soon}</span>
                <span class="stat-label">${a("due_soon",e)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="triggered"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("triggered")}
                   title=${a("filter_to_triggered",e)}>
                <span class="stat-value" style="color: #ff5722">${i.triggered}</span>
                <span class="stat-label">${a("triggered",e)}</span>
              </div>
              ${this._features.budget?this._renderBudgetTiles():h}
            </div>
          `:h}
      <div class="tab-bar">
        <div class="tab ${this._overviewTab==="today"?"active":""}"
          @click=${()=>this._setOverviewTab("today")}>
          ${a("tab_today",e)}
        </div>
        <div class="tab ${this._overviewTab==="dashboard"?"active":""}"
          @click=${()=>this._setOverviewTab("dashboard")}>
          ${a("dashboard",e)}
        </div>
        <div class="tab ${this._overviewTab==="calendar"?"active":""}"
          @click=${()=>this._setOverviewTab("calendar")}>
          ${a("tab_calendar",e)}
        </div>
        ${t?n`
          <div class="tab ${this._overviewTab==="settings"?"active":""}"
            @click=${()=>this._setOverviewTab("settings")}>
            ${a("settings",e)}
          </div>
        `:h}
        ${this.narrow?h:this._renderSearchButton("tab-search")}
      </div>
      ${this._overviewTab==="today"?this._renderToday():this._overviewTab==="dashboard"?this._renderDashboard():this._overviewTab==="calendar"?n`
            <div @ll-custom=${this._onCalendarLlCustom}>
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
    `}_statusBadge(e){return xt(e,this._lang)}_setOverviewTab(e){this._overviewTab=e;try{V(A.overviewTab,e)}catch{}this._scrollContentToTop()}_renderToday(){let e=this._lang,t=this._taskRows,i=p=>`${p.entry_id}:${p.task_id}`,s=t.filter(p=>p.status==="overdue"),r=t.filter(p=>p.status==="triggered"),c=new Set([...s,...r].map(i)),o=t.filter(p=>!c.has(i(p))&&p.days_until_due===0);o.forEach(p=>c.add(i(p)));let u=t.filter(p=>!c.has(i(p))&&p.days_until_due!=null&&p.days_until_due>0&&p.days_until_due<=7);return s.length+r.length+o.length+u.length===0?n`
        <div class="today-empty">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <p>${a("today_all_caught_up",e)}</p>
        </div>
      `:n`
      <div class="today-view">
        ${this._renderTodaySection("today_overdue",s,"overdue")}
        ${this._renderTodaySection("triggered",r,"triggered")}
        ${this._renderTodaySection("today_due_today",o,"due_soon")}
        ${this._renderTodaySection("today_this_week",u,"")}
      </div>
    `}_renderTodaySection(e,t,i){if(t.length===0)return h;let s=this._lang,r=c=>this._filterUser||!c.responsible_user_id?null:this._userService?.getPerson(c.responsible_user_id)??null;return n`
      <div class="today-section">
        <div class="today-section-header ${i}">
          <span>${a(e,s)}</span><span class="today-badge">${t.length}</span>
        </div>
        ${t.map(c=>n`
          <div class="today-row" @click=${()=>this._showTask(c.entry_id,c.task_id)}>
            <span class="today-dot ${c.trigger_active?"triggered":c.status}"></span>
            <div class="today-main">
              <div class="today-task">${this._listRef(c.entry_id,c.task_id)}${c.task_name}${Fe(c.next_event_titles)}</div>
              <div class="today-object">
                <span class="today-object-text">${c.object_name} · ${c.days_until_due==null?ct(c.last_performed,s)??"\u2014":ke(c.days_until_due,s)}</span>
                ${Lt(r(c),"today-person")}
              </div>
            </div>
            ${this._renderRowActions(s,()=>this._openCompleteDialogForRow(c),void 0,!1)}
          </div>
        `)}
      </div>
    `}_renderDashboard(){let e=this._stats,t=this._taskRows,i=this._lang,s=this._isOperator,r=this._objects.reduce((p,g)=>p+g.tasks.filter(m=>m.archived).length,0),c=new Set;for(let p of this._objects)for(let g of p.tasks)for(let m of et(g))c.add(m);this._filterUser&&this._filterUser!=="current_user"&&c.add(this._filterUser);let o=[...c].map(p=>({id:p,name:this._userService?.getUserName(p)??null})).filter(p=>p.name!==null||p.id===this._filterUser).sort((p,g)=>(p.name??"").localeCompare(g.name??"")),u=(this._filterStatus?1:0)+(this._filterUser?1:0)+(this._filterLabel?1:0)+(this._filterPlace?1:0)+(this._filterPriority?1:0)+(this._activeViewId?1:0);return n`

      ${this.narrow?n`
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
            ${this._savedViews.map(p=>n`<option value=${p.id} ?selected=${this._activeViewId===p.id}>${p.name}</option>`)}
          </select>
        </label>
        ${s?h:n`
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
            ${Ns.map(p=>n`<option value=${p} ?selected=${this._filterStatus===p}>${a(p,i)}</option>`)}
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${a("user_label",i)}</span>
          <select
            .value=${this._filterUser||""}
            @change=${p=>{let g=p.target.value;this._filterUser=g||null,this._activeViewId=""}}
          >
            <option value="">${a("all_users",i)}</option>
            <option value="current_user" ?selected=${this._filterUser==="current_user"}>${a("my_tasks",i)}</option>
            ${o.map(p=>n`<option value=${p.id} ?selected=${this._filterUser===p.id}>${p.name??p.id}</option>`)}
          </select>
        </label>
        ${this._allLabels.length>0?n`
          <label class="filter-field">
            <span class="filter-label">${a("label_filter",i)}</span>
            <select
              .value=${this._filterLabel||""}
              @change=${p=>{let g=p.target.value;this._filterLabel=g||null,this._activeViewId=""}}
            >
              <option value="">${a("all_labels",i)}</option>
              ${this._allLabels.map(p=>n`<option value=${p} ?selected=${this._filterLabel===p}>${p}</option>`)}
            </select>
          </label>
        `:h}
        ${this._features.places&&this._allPlaces.length>0?n`
          <label class="filter-field">
            <span class="filter-label">${a("filter_place",i)}</span>
            <select
              .value=${this._filterPlace}
              @change=${p=>{this._filterPlace=p.target.value,this._activeViewId=""}}
            >
              <option value="">${a("filter_place_all",i)}</option>
              <option value="home" ?selected=${this._filterPlace==="home"}>${a("place_home",i)}</option>
              ${this._allPlaces.map(p=>n`<option value=${p.id} ?selected=${this._filterPlace===p.id}>${p.name}</option>`)}
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
            ${["high","normal","low"].map(p=>n`<option value=${p} ?selected=${this._filterPriority===p}>${a(`priority_${p}`,i)}</option>`)}
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
            ${this._features.groups?n`<option value="group" ?selected=${this._groupByMode==="group"}>${a("groupby_group",i)}</option>`:h}
            <option value="user" ?selected=${this._groupByMode==="user"}>${a("groupby_user",i)}</option>
            <option value="object" ?selected=${this._groupByMode==="object"}>${a("groupby_object",i)}</option>
          </select>
        </label>
        ${r>0?n`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived,this._activeViewId=""}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?a("hide_archived",i):`${a("show_archived",i)} (${r})`}
          </ha-button>
        `:h}
        ${!s&&t.length>0?n`
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

      ${t.length===0?n`
            <div class="empty-state">
              <ha-svg-icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></ha-svg-icon>
              <p>${a("no_tasks",i)}</p>
              ${!s&&this._objects.length===0?n`
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
          `:n`
            ${this._bulkMode?this._renderBulkBar(t,i):h}
            ${this._splitActive()?n`
                  <div class="split-layout">
                    <div class="split-list">
                      ${this._groupByMode==="none"?this._renderTaskTable(t):this._renderGroupedTasks(t,i)}
                    </div>
                    <div class="split-pane">
                      ${this._selectedEntryId&&this._selectedTaskId&&this._getTask(this._selectedEntryId,this._selectedTaskId)?this._renderTaskDetail():n`<div class="split-pane-empty"><ha-icon icon="mdi:cursor-default-click-outline"></ha-icon><p>${a("split_select_hint",i)}</p></div>`}
                    </div>
                  </div>
                `:this._groupByMode==="none"?this._renderTaskTable(t):this._renderGroupedTasks(t,i)}
          `}

      ${this._features.groups&&!s?this._renderGroupsSection():h}
      ${s?h:n`<maintenance-storage-section-card
            .hass=${this.hass}
            .objects=${this._objects}
            @open-object=${p=>{let g=p.detail?.entry_id;g&&this._showObject(g)}}
          ></maintenance-storage-section-card>`}
    `}_renderTaskTable(e){let t=this._bulkMode?" bulk":"";if(this._virtTotalRows=e.length,this.narrow||e.length<120)return n`
        <div class="task-table${t}">
          ${e.map(p=>this._renderOverviewRow(p))}
        </div>
      `;let i=e.length,s=this._virtRowHeight,r=Math.max(0,Math.min(this._virtStart,i)),c=this._virtEnd>0?Math.min(this._virtEnd,i):Math.min(i,40);c<r&&(r=0,c=Math.min(i,40));let o=r*s,u=(i-c)*s;return n`
      <div class="task-table${t} virtual">
        ${this._renderVirtSizerRow(e)}
        ${o>0?n`<div class="virt-spacer" style="height:${o}px"></div>`:h}
        ${e.slice(r,c).map(p=>this._renderOverviewRow(p))}
        ${u>0?n`<div class="virt-spacer" style="height:${u}px"></div>`:h}
      </div>
    `}_renderVirtSizerRow(e){let t=this._lang,i="",s=!1,r=!1,c=!1;for(let o of e){let u=ts(es(o),t);u.length>i.length&&(i=u),o.enabled||(s=!0),o.nfc_tag_id&&(r=!0),(o.priority==="high"||o.priority==="low")&&(c=!0)}return n`
      <div class="task-row virt-sizer" aria-hidden="true">
        ${this._bulkMode?n`<span></span>`:h}
        <span class="cell-badges">
          <span class="status-badge"><ha-icon icon="mdi:circle-medium"></ha-icon><span class="status-label">${i}</span></span>
          ${s?n`<span class="badge-disabled">${a("disabled",t)}</span>`:h}
          ${r?n`<span class="nfc-badge"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:h}
          ${c?n`<span class="priority-badge"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>`:h}
        </span>
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
    `}_renderBulkBar(e,t){let i=this._bulkSelected.size,s=e.length>0&&e.every(r=>this._bulkSelected.has(this._bulkKey(r)));return n`
      <div class="bulk-bar">
        <label class="bulk-selectall">
          <input type="checkbox" .checked=${s} @change=${()=>this._bulkSelectAll(e)} />
          ${a("bulk_select_all",t)}
        </label>
        <span class="bulk-count">${a("bulk_n_selected",t).replace("{n}",String(i))}</span>
        <span class="bulk-actions">
          <ha-button appearance="filled" .disabled=${i===0||this._actionLoading}
            @click=${()=>this._bulkComplete(e)}>
            <ha-icon icon="mdi:check"></ha-icon> ${a("complete",t)}
          </ha-button>
          <ha-button appearance="plain" .disabled=${i===0||this._actionLoading}
            @click=${()=>this._bulkArchive(e)}>
            <ha-icon icon="mdi:archive-outline"></ha-icon> ${a("archive",t)}
          </ha-button>
          <span class="bulk-more-wrapper">
            <ha-button appearance="plain" class="bulk-more" title=${a("more_actions",t)} aria-label=${a("more_actions",t)} .disabled=${i===0||this._actionLoading}
              @click=${r=>{r.stopPropagation(),this._bulkMenuOpen=!this._bulkMenuOpen}}>
              <ha-icon icon="mdi:dots-vertical"></ha-icon>
            </ha-button>
            ${this._bulkMenuOpen?n`
              <div class="popup-menu" @click=${r=>r.stopPropagation()}>
                <div class="popup-menu-item bulk-move" @click=${()=>{this._bulkMenuOpen=!1,this._bulkMove(e)}}>${a("move_task",t)}</div>
                <div class="popup-menu-item bulk-assign" @click=${()=>{this._bulkMenuOpen=!1,this._bulkEdit("assign",e)}}>${a("bulk_assign",t)}…</div>
                <div class="popup-menu-item bulk-labels" @click=${()=>{this._bulkMenuOpen=!1,this._bulkEdit("labels",e)}}>${a("labels",t)}…</div>
                <div class="popup-menu-item bulk-edit" @click=${()=>{this._bulkMenuOpen=!1,this._bulkEdit("edit",e)}}>${a("edit",t)}…</div>
                <div class="popup-menu-item bulk-pause" @click=${()=>{this._bulkMenuOpen=!1,this._bulkPause(e)}}>${a("pause_task",t)}…</div>
                <div class="popup-menu-item bulk-resume" @click=${()=>{this._bulkMenuOpen=!1,this._bulkResume(e)}}>${a("resume_task",t)}</div>
              </div>
            `:h}
          </span>
        </span>
      </div>
    `}_renderGroupedTasks(e,t){let i=new Map,s=a("unassigned",t);for(let o of e){let u=[];if(this._groupByMode==="area")u=[(o.area_id?this.hass?.areas?.[o.area_id]?.name:null)||s];else if(this._groupByMode==="user"){let p=et(o).map(g=>this._userService?.getUserName(g)).filter(g=>!!g);u=p.length>0?[...new Set(p)]:[s]}else this._groupByMode==="group"?u=o.group_names.length>0?o.group_names:[s]:this._groupByMode==="object"&&(u=[o.object_name]);for(let p of u)i.has(p)||i.set(p,[]),i.get(p).push(o)}let r=[...i.entries()].sort(([o],[u])=>o===s&&u!==s?1:u===s&&o!==s?-1:o.localeCompare(u)),c=this._groupByMode==="area"?"mdi:map-marker-outline":this._groupByMode==="group"?"mdi:folder-outline":this._groupByMode==="object"?"mdi:cube-outline":"mdi:account-outline";return n`
      <div class="task-table grouped${this._bulkMode?" bulk":""}">
        ${r.map(([o,u])=>{let p=!this._collapsedGroups.has(o);return n`
            <div class="group-section" ?open=${p}>
              <div
                class="group-section-header"
                role="button"
                tabindex="0"
                aria-expanded=${p?"true":"false"}
                @click=${()=>this._toggleGroup(o)}
                @keydown=${g=>{(g.key==="Enter"||g.key===" ")&&(g.preventDefault(),this._toggleGroup(o))}}
              >
                <ha-icon icon="${c}"></ha-icon>
                <span>${o}</span>
                <span class="group-section-count">(${u.length})</span>
              </div>
              ${p?n`<div class="group-rows">${u.map(g=>this._renderOverviewRow(g))}</div>`:h}
            </div>
          `})}
      </div>
    `}_toggleGroup(e){let t=new Set(this._collapsedGroups);t.has(e)?t.delete(e):t.add(e),this._collapsedGroups=t}_warrantyLabel(e,t,i){return e.kind==="expired"?a("warranty_expired",i):e.kind==="expiring"?a("warranty_expires_in",i).replace("{days}",String(e.days??0)):a("warranty_valid_until",i).replace("{date}",q(t,i))}_renderWarrantyMeta(e,t){let i=Kt(e);return n`<p class="meta">${a("warranty",t)}:
      <span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,e,t)}</span></p>`}_renderAllObjects(){let e=this._lang,t=this._isOperator,i=this._objectViewMode==="table"&&!this.narrow,s=this._objects.filter(p=>p.object.archived).length,r=p=>{let g=1/0;for(let m of p.tasks){let v=m.days_until_due;v!=null&&v<g&&(g=v)}return g},c=this._objects.filter(p=>this._showArchived||!p.object.archived);this._objectSortMode==="alphabetical"?c.sort((p,g)=>p.object.name.localeCompare(g.object.name)):this._objectSortMode==="task_count"?c.sort((p,g)=>g.tasks.length-p.tasks.length||p.object.name.localeCompare(g.object.name)):c.sort((p,g)=>r(p)-r(g)||p.object.name.localeCompare(g.object.name));let o=()=>{let p=new Map;for(let g of c){let m=g.object.area_id,v=m?this.hass?.areas?.[m]?.name||a("unassigned",e):a("no_area",e);p.has(v)||p.set(v,[]),p.get(v).push(g)}return new Map([...p.entries()].sort(([g],[m])=>g.localeCompare(m)))},u=p=>{let g=p.tasks.some(m=>m.status==="overdue"||m.status==="triggered");return n`
        <div class="object-card${g?" object-card-overdue":""}${this._objBulkMode?" selectable":""}${this._objBulkMode&&this._objBulkSelected.has(p.entry_id)?" bulk-selected":""}"
          @click=${()=>this._objBulkMode?this._toggleObjBulk(p.entry_id):this._showObject(p.entry_id)}>
          ${this._objBulkMode?n`<label class="obj-bulk-check bulk-check" @click=${m=>m.stopPropagation()}>
                <input type="checkbox" .checked=${this._objBulkSelected.has(p.entry_id)} @change=${()=>this._toggleObjBulk(p.entry_id)} />
              </label>`:h}
          ${g?n`<span class="overdue-dot" title="${a("has_overdue",e)}"></span>`:h}
          <div class="object-card-header">
            <span class="object-card-name">${this._objRef(p.object)}${p.object.name}</span>
            ${p.object.paused?n`<span class="paused-badge" title="${a("object_paused_badge",e)}${p.object.paused_until?` \u2014 ${q(p.object.paused_until,e)}`:""}">
                  <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
                </span>`:h}
            ${p.object.document_count?n`<span class="doc-badge" title="${p.object.document_count} ${a("documents",e)}">
                  <ha-icon icon="mdi:paperclip"></ha-icon>${p.object.document_count}
                </span>`:h}
            <span class="object-card-count">${p.tasks.length===1?a("templates_task_count_one",e):a("templates_task_count",e).replace("{n}",String(p.tasks.length))}</span>
          </div>
          ${p.object.manufacturer||p.object.model?n`<div class="object-card-meta">${[p.object.manufacturer,p.object.model].filter(Boolean).join(" ")}</div>`:h}
          ${p.tasks.length===0?n`<div class="object-card-empty">${a("no_tasks_yet",e)}</div>`:h}
        </div>
      `};return n`
      <div class="breadcrumb">
        <ha-icon-button @click=${()=>this._showOverview()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${a("all_objects",e)}</span>
        <button class="sibling-view-chip" @click=${()=>this._showAllParts()}>
          <ha-icon icon="mdi:package-variant-closed"></ha-icon> ${a("all_parts",e)}
        </button>
        <button class="sibling-view-chip" data-view="all_areas" @click=${()=>this._showAllAreas()}>
          <ha-icon icon="mdi:floor-plan"></ha-icon> ${a("all_areas",e)}
        </button>
      </div>
      <div class="filter-bar">
        <label class="filter-field">
          <span class="filter-label">${a("sort_label",e)}</span>
          <select
            .value=${this._objectSortMode}
            @change=${p=>{this._objectSortMode=p.target.value;try{V(A.objectSort,this._objectSortMode)}catch{}}}
          >
            <option value="alphabetical" ?selected=${this._objectSortMode==="alphabetical"}>${a("sort_alphabetical",e)}</option>
            <option value="due_soonest" ?selected=${this._objectSortMode==="due_soonest"}>${a("sort_due_soonest",e)}</option>
            <option value="task_count" ?selected=${this._objectSortMode==="task_count"}>${a("sort_task_count",e)}</option>
          </select>
        </label>
        ${this.narrow?h:n`
          <div class="view-toggle" role="group" aria-label="${a("view_mode_label",e)}">
            <button
              class="view-toggle-btn${i?"":" active"}"
              title="${a("view_cards",e)}"
              @click=${()=>this._setObjectViewMode("cards")}
            ><ha-icon icon="mdi:view-grid-outline"></ha-icon></button>
            <button
              class="view-toggle-btn${i?" active":""}"
              title="${a("view_table",e)}"
              @click=${()=>this._setObjectViewMode("table")}
            ><ha-icon icon="mdi:table"></ha-icon></button>
          </div>
        `}
        ${i?h:n`
        <label class="filter-field">
          <span class="filter-label">${a("group_by_label",e)}</span>
          <select
            .value=${this._groupByMode}
            @change=${p=>{this._groupByMode=p.target.value;try{V(A.groupBy,this._groupByMode)}catch{}}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${a("groupby_none",e)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${a("groupby_area",e)}</option>
          </select>
        </label>
        `}
        ${t?h:n`
          <ha-button
            @click=${()=>this._ui("maintenance-object-dialog").then(p=>p?.openCreate())}
          >
            ${a("new_object",e)}
          </ha-button>
        `}
        <ha-button appearance="plain" @click=${()=>this._exportObjectsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${a("settings_export_csv",e)}
        </ha-button>
        ${t?h:n`
          <ha-button appearance="plain" class="bulk-toggle obj-bulk-toggle ${this._objBulkMode?"active":""}" @click=${()=>this._toggleObjBulkMode()}>
            <ha-icon icon="mdi:checkbox-multiple-marked-outline"></ha-icon>
            ${this._objBulkMode?a("cancel",e):a("bulk_select",e)}
          </ha-button>
        `}
        ${s>0?n`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?a("hide_archived",e):`${a("show_archived",e)} (${s})`}
          </ha-button>
        `:h}
      </div>
      ${this._objBulkMode?this._renderObjBulkBar(c,e):h}
      ${i?this._renderObjectsTable(c):this._groupByMode==="area"?n`
          ${[...o().entries()].map(([p,g])=>n`
            <details class="group-section" open>
              <summary class="group-section-header">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <span>${p}</span>
                <span class="group-section-count">(${g.length})</span>
              </summary>
              <div class="objects-grid">${g.map(u)}</div>
            </details>
          `)}
        `:n`<div class="objects-grid">${c.map(u)}</div>`}
    `}_setObjectViewMode(e){this._objectViewMode=e;try{V(A.objectView,e)}catch{}}_renderAllParts(){let e=this._lang,t=this._allParts,i=this._currencySymbol;return n`
      <div class="breadcrumb">
        <ha-icon-button @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${a("all_parts",e)}</span>
        <button class="sibling-view-chip" @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:devices"></ha-icon> ${a("all_objects",e)}
        </button>
        <button class="sibling-view-chip" data-view="all_areas" @click=${()=>this._showAllAreas()}>
          <ha-icon icon="mdi:floor-plan"></ha-icon> ${a("all_areas",e)}
        </button>
      </div>
      <div class="filter-bar">
        <ha-button appearance="plain" @click=${()=>this._exportPartsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${a("settings_export_csv",e)}
        </ha-button>
      </div>
      ${t===null?n`<div class="empty-state">…</div>`:t.length===0?n`<div class="empty-state">${a("parts_section",e)}: 0</div>`:n`
          <div class="objects-table-wrap">
            <table class="objects-table">
              <thead>
                <tr>
                  <th>${a("part_name",e)}</th>
                  <th>${a("object",e)}</th>
                  <th>${a("part_stock",e)}</th>
                  <th>${a("part_reorder_threshold",e)}</th>
                  <th>${a("part_cost",e)}</th>
                  <th>${a("part_storage_location",e)}</th>
                  <th>${a("parts_used_by",e)}</th>
                </tr>
              </thead>
              <tbody>
                ${t.map(s=>n`
                  <tr class="objects-table-row" @click=${()=>this._showObject(s.entry_id)}>
                    <td>
                      <span class="objects-table-name">${this._objRef(this._getObject(s.entry_id)?.object)}${s.name}</span>
                      ${s.low?n`<ha-icon class="part-low-icon" icon="mdi:cart-arrow-down"
                            title="${a("part_reorder_threshold",e)}: ${s.reorder_threshold}"></ha-icon>`:h}
                    </td>
                    <td>${s.object_name||"\u2014"}</td>
                    <td>${s.stock!==null?Ke(s.stock,s.unit,e):"\u2014"}</td>
                    <td>${s.reorder_threshold??"\u2014"}</td>
                    <td>${s.cost!=null?s.package_size?`${U(s.cost,i,e)} / ${Ke(s.package_size,s.unit??void 0,e)}`:U(s.cost,i,e):"\u2014"}</td>
                    <td>${s.storage_location||"\u2014"}</td>
                    <td>
                      ${s.consumers.length===0?"\u2014":s.consumers.map(r=>n`
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
    `}_renderAllAreas(){let e=this._lang;return this._ensureAreaUi(),n`
      <div class="breadcrumb">
        <ha-icon-button @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${a("all_areas",e)}</span>
        <button class="sibling-view-chip" @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:devices"></ha-icon> ${a("all_objects",e)}
        </button>
        <button class="sibling-view-chip" @click=${()=>this._showAllParts()}>
          <ha-icon icon="mdi:package-variant-closed"></ha-icon> ${a("all_parts",e)}
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
        <ha-icon-button @click=${()=>this._showAllAreas()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${a("all_areas",e)}</span>
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
    `}_exportPartsCsv(){let e=this._allParts||[],t=c=>{let o=c==null?"":String(c);return/[",\n;]/.test(o)?`"${o.replace(/"/g,'""')}"`:o},s=[["name","object","stock","unit","reorder_threshold","unit_cost","storage_location","vendor","used_by"].join(",")];for(let c of e)s.push([t(c.name),t(c.object_name),t(c.stock),t(c.unit),t(c.reorder_threshold),t(c.cost),t(c.storage_location),t(c.vendor),t(c.consumers.map(o=>`${o.object_name??""}/${o.task_name??o.task_id}\xD7${o.quantity}`).join(" | "))].join(","));let r=xe();zt(s.join(`
`),`maintenance_parts_${r}.csv`,"text/csv;charset=utf-8")}async _exportObjectsCsv(){let e=await P(this,{type:"maintenance_supporter/objects/csv"},{onError:i=>this._showToast(i)});if(!e)return;let t=xe();zt(e.csv,`maintenance_objects_${t}.csv`,"text/csv;charset=utf-8")}_renderObjectsTable(e){let t=this._lang,i=this._objectsTableColumns;return n`
      <div class="objects-table-wrap">
        <table class="objects-table">
          <thead>
            <tr>
              ${this._objBulkMode?n`<th class="oc-bulk"></th>`:h}
              ${i.map(s=>{let r=_i.find(o=>o.key===s),c=r&&r.key!=="actions"?a(r.labelKey,t):"";return n`<th class="oc-${s}">${c}</th>`})}
            </tr>
          </thead>
          <tbody>
            ${e.map(s=>n`
              <tr class="objects-table-row${this._objBulkMode&&this._objBulkSelected.has(s.entry_id)?" bulk-selected":""}"
                @click=${()=>this._objBulkMode?this._toggleObjBulk(s.entry_id):this._showObject(s.entry_id)}>
                ${this._objBulkMode?n`<td class="oc-bulk"><input type="checkbox" .checked=${this._objBulkSelected.has(s.entry_id)}
                      @click=${r=>r.stopPropagation()} @change=${()=>this._toggleObjBulk(s.entry_id)} /></td>`:h}
                ${i.map(r=>this._renderObjectCell(r,s,t))}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `}_renderObjectCell(e,t,i){let s=t.object;switch(e){case"name":return n`<td class="oc-name">
          <span class="objects-table-name">${this._objRef(s)}${s.name}</span>
          ${s.document_count?n`<span class="doc-badge" title="${s.document_count} ${a("documents",i)}">
                <ha-icon icon="mdi:paperclip"></ha-icon>${s.document_count}
              </span>`:h}
        </td>`;case"manufacturer":return n`<td class="oc-manufacturer">${s.manufacturer||"\u2014"}</td>`;case"model":return n`<td class="oc-model">${s.model||"\u2014"}</td>`;case"serial_number":return n`<td class="oc-serial_number">${s.serial_number||"\u2014"}</td>`;case"installation_date":return n`<td class="oc-installation_date">${s.installation_date?q(s.installation_date,i):"\u2014"}</td>`;case"warranty_expiry":return n`<td class="oc-warranty_expiry">${this._renderWarrantyCell(s.warranty_expiry,i)}</td>`;case"area_id":{let r=s.area_id?this.hass?.areas?.[s.area_id]?.name||s.area_id:"\u2014";return n`<td class="oc-area_id">${r}</td>`}case"documentation_url":{let r=(s.manual_docs||[])[0];return n`<td class="oc-documentation_url">${ce(s.documentation_url)?n`<a href=${s.documentation_url} target="_blank" rel="noopener noreferrer"
                @click=${c=>c.stopPropagation()}><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:r?n`<a href="#" title=${r.title}
                  @click=${c=>{c.preventDefault(),c.stopPropagation(),this._openManualDoc(r)}}
                  ><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:"\u2014"}</td>`}case"notes":return n`<td class="oc-notes" title=${s.notes||""}>${s.notes||"\u2014"}</td>`;case"task_count":return n`<td class="oc-task_count">${t.tasks.length}</td>`;case"ref_no":return n`<td class="oc-ref_no">${Se(s)?`#${Se(s)}`:"\u2014"}</td>`;case"actions":return n`<td class="oc-actions">
          <ha-icon-button class="obj-table-qr" title="${a("qr_code",i)}" @click=${r=>{r.stopPropagation(),this._openQrForObject(t.entry_id,s.name)}}>
            <ha-icon icon="mdi:qrcode"></ha-icon>
          </ha-icon-button>
        </td>`;default:return n`<td></td>`}}_renderWarrantyCell(e,t){let i=Kt(e);return i.kind==="none"?n`<span class="warranty-none">—</span>`:n`<span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,e,t)}</span>`}async _onSettingsChanged(){await this._loadData()}_renderGroupsSection(){if(!this._features.groups)return h;let e=Object.entries(this._groups),t=this._lang;return n`
      <div class="groups-section">
        <div class="groups-header">
          <h3>${a("groups",t)}</h3>
          <ha-button appearance="plain" @click=${()=>this._openGroupCreate()}>
            ${a("new_group",t)}
          </ha-button>
        </div>
        ${e.length===0?n`<div class="hint">${a("no_groups",t)}</div>`:n`
            <div class="groups-grid">
              ${e.map(([i,s])=>{let r=s.task_refs.map(c=>this._getTask(c.entry_id,c.task_id)?.name).filter(Boolean);return n`
                  <div class="group-card">
                    <div class="group-card-head">
                      <div class="group-card-name">${s.name}</div>
                      <div class="group-card-actions">
                        <ha-icon-button title="${a("edit",t)}" @click=${()=>this._openGroupEdit(i)}>
                          <ha-svg-icon path="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"></ha-svg-icon>
                        </ha-icon-button>
                        <ha-icon-button title="${a("delete",t)}" @click=${()=>this._deleteGroup(i,s.name)}>
                          <ha-svg-icon path="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z"></ha-svg-icon>
                        </ha-icon-button>
                      </div>
                    </div>
                    ${s.description?n`<div class="group-card-desc">${s.description}</div>`:h}
                    <div class="group-card-tasks">
                      ${r.length>0?r.map(c=>n`<span class="group-task-chip">${c}</span>`):n`<span style="font-size:12px;color:var(--secondary-text-color)">${a("no_tasks_short",t)}</span>`}
                    </div>
                  </div>
                `})}
            </div>
          `}
      </div>
    `}_openGroupCreate(){this.shadowRoot.querySelector("maintenance-group-dialog")?.openCreate()}_openGroupEdit(e){let t=this._groups[e];t&&this.shadowRoot.querySelector("maintenance-group-dialog")?.openEdit(e,t)}async _deleteGroup(e,t){await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:a("delete_group",this._lang),message:a("delete_group_confirm",this._lang).replace("{name}",t),confirmText:a("delete",this._lang),danger:!0})&&await this._runAction({type:"maintenance_supporter/group/delete",group_id:e})}_renderBudgetTiles(){let e=this._budget;if(!e)return h;let t=this._lang,i=this._currencySymbol,s=(r,c,o)=>{if(o!==null){let u=Math.min(100,Math.max(0,c/o*100)),p=u>=100?"var(--error-color, #f44336)":u>=e.alert_threshold_pct?"var(--warning-color, #ff9800)":"var(--success-color, #4caf50)";return n`
          <div class="stat-item budget-tile" title="${r}: ${U(c,i,t)} / ${U(o,i,t)}">
            <span class="stat-value budget-tile-value">${U(c,i,t)}</span>
            <span class="budget-tile-max">/ ${U(o,i,t)}</span>
            <div class="budget-tile-bar"><div style="width:${u}%; background:${p}"></div></div>
            <span class="stat-label">${r}</span>
          </div>
        `}return n`
        <div class="stat-item budget-tile" title="${r}: ${U(c,i,t)}">
          <span class="stat-value budget-tile-value">${U(c,i,t)}</span>
          <span class="stat-label">${r}</span>
        </div>
      `};return n`
      ${s(a("budget_monthly",t),e.monthly_spent||0,e.monthly_budget>0?e.monthly_budget:null)}
      ${s(a("budget_yearly",t),e.yearly_spent||0,e.yearly_budget>0?e.yearly_budget:null)}
    `}_renderOverviewRow(e){let t=this._lang,i=e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0,s=0,r=ot.ok,c=!1;if(i&&e.days_until_due!==null){let m=kt(e.interval_days,e.days_until_due,e.interval_unit);s=m.pct,c=m.overflow,e.status==="overdue"?r=ot.overdue:e.status==="due_soon"&&(r=ot.due_soon)}let o=e.area_id?this.hass?.areas?.[e.area_id]?.name:null,u=e.responsible_user_id?this._userService?.getUserName(e.responsible_user_id):null,p=e.group_names.length>0||o||u,g=this._bulkMode&&this._bulkSelected.has(this._bulkKey(e));return n`
      <div class="task-row${e.enabled?"":" task-disabled"}${g?" bulk-selected":""}${this._splitActive()&&e.entry_id===this._selectedEntryId&&e.task_id===this._selectedTaskId?" selected":""}">
        ${this._bulkMode?n`
          <label class="cell bulk-check" @click=${m=>m.stopPropagation()}>
            <input type="checkbox" .checked=${g} @change=${()=>this._toggleBulkRow(e)} />
          </label>
        `:h}
        <span class="cell-badges">
          ${this._statusBadge(e)}
          ${e.enabled?h:n`<span class="badge-disabled">${a("disabled",t)}</span>`}
          ${e.nfc_tag_id?n`<span class="nfc-badge" title="${a("nfc_linked",t)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:h}
          ${e.priority==="high"?n`<span class="priority-badge priority-high" title="${a("priority_high",t)}"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>`:h}
          ${e.priority==="low"?n`<span class="priority-badge priority-low" title="${a("priority_low",t)}"><ha-icon icon="mdi:chevron-double-down"></ha-icon></span>`:h}
        </span>
        <span class="row-head">
          <span class="cell object-name" @click=${m=>{m.stopPropagation(),this._showObject(e.entry_id)}}>${e.object_name}</span>
          <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,e.task_id)}>${this._listRef(e.entry_id,e.task_id)}${e.task_name}${Fe(e.next_event_titles)}</span>
        </span>
        <span class="task-sub${p?"":" task-sub-empty"}">
          ${e.group_names.length>0?n`
            <span class="sub-chip" title="${a("groups",t)}">
              <ha-icon icon="mdi:folder-outline"></ha-icon>${e.group_names.join(", ")}
            </span>`:h}
          ${o?n`
            <span class="sub-chip">
              <ha-icon icon="mdi:map-marker-outline"></ha-icon>${o}
            </span>`:h}
          ${u?Lt(this._userService?.getPerson(e.responsible_user_id)??null,"sub-chip"):h}
          ${(e.labels||[]).map(m=>n`
            <span class="sub-chip label-chip" title="${a("labels",t)}">
              <ha-icon icon="mdi:tag-outline"></ha-icon>${m}
            </span>`)}
        </span>
        <span class="cell type">${a(e.type,t)}</span>
        <span class="due-cell" @click=${()=>this._showTask(e.entry_id,e.task_id)}>
          ${ei(e.days_until_due,e.last_performed,t)}
          ${i?n`<div class="days-bar"><div class="days-bar-fill${c?" overflow":""}" style="width:${s}%;background:${r}"></div></div>`:h}
          ${e.trigger_config?Jt(e,{trend:Xt(e,this._miniStatsData),lang:t}):!i&&e.trigger_active?n`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:h}
          ${Zt(e,this._miniStatsData,this._lang)}
        </span>
        ${this._renderRowActions(t,()=>this._openCompleteDialogForRow(e),()=>this._promptSkipTask(e.entry_id,e.task_id),e.allow_skip)}
      </div>
    `}_actionStyle(){return this._rowActionStyle}async _dismissRowActionNotice(e){let t={row_action_notice_pending:!1};e&&(t.row_action_style="icons"),await P(this,{type:"maintenance_supporter/global/update",settings:t},{onError:s=>this._showToast(s)})!==void 0&&(this._rowActionNotice=!1,e&&(this._rowActionStyle="icons"),Ni())}_renderRowActions(e,t,i,s=!0){let r=this._actionStyle();return r==="buttons"||r==="buttons_compact"?r==="buttons_compact"&&(this.narrow||this.tight)?n`
          <span class="row-actions as-buttons compact">
            <ha-button size="small" appearance="accent" variant="success" title="${a("complete",e)}" aria-label="${a("complete",e)}" @click=${o=>{o.stopPropagation(),t()}}>
              <ha-icon icon="mdi:check"></ha-icon>
            </ha-button>
            ${s?n`
              <ha-button size="small" appearance="outlined" variant="warning" title="${a("skip",e)}" aria-label="${a("skip",e)}" ?disabled=${this._actionLoading} @click=${o=>{o.stopPropagation(),i?.()}}>
                <ha-icon icon="mdi:skip-next"></ha-icon>
              </ha-button>`:h}
          </span>`:n`
        <span class="row-actions as-buttons">
          <ha-button size="small" appearance="accent" variant="success" title="${a("complete",e)}" @click=${o=>{o.stopPropagation(),t()}}>
            <ha-icon slot="start" icon="mdi:check"></ha-icon>${a("complete",e)}
          </ha-button>
          ${s?n`
            <ha-button size="small" appearance="outlined" variant="warning" title="${a("skip",e)}" ?disabled=${this._actionLoading} @click=${o=>{o.stopPropagation(),i?.()}}>
              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>${a("skip",e)}
            </ha-button>`:h}
        </span>`:n`
      <span class="row-actions">
        <ha-icon-button class="btn-complete" title="${a("complete",e)}" @click=${c=>{c.stopPropagation(),t()}}>
          <ha-icon icon="mdi:check"></ha-icon>
        </ha-icon-button>
        ${s?n`
          <ha-icon-button class="btn-skip" title="${a("skip",e)}" .disabled=${this._actionLoading} @click=${c=>{c.stopPropagation(),i?.()}}>
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </ha-icon-button>`:h}
      </span>`}_openCompleteDialogForRow(e){let i=this._objects.find(s=>s.entry_id===e.entry_id)?.tasks.find(s=>s.id===e.task_id);this._openCompleteDialog(e.entry_id,e.task_id,e.task_name,this._features.checklists?i?.checklist:void 0,this._features.adaptive&&!!i?.adaptive_config?.enabled)}_renderObjectDetail(){if(!this._selectedEntryId)return h;let e=this._getObject(this._selectedEntryId);if(!e)return n`<p>Object not found.</p>`;let t=e.object,i=this._lang,s=this._isOperator,r=e.tasks.filter(o=>o.archived).length,c=e.tasks.filter(o=>this._showArchived||!o.archived);return n`
      <div class="detail-section">
        <div class="detail-header">
          <h2>${t.name} ${He(Se(t),a("ref_number",i))}</h2>
          <div class="action-buttons">
            ${s?h:n`
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(o=>o?.openCreate(e.entry_id))}}>${a("add_task",i)}</ha-button>
              <ha-button appearance="plain" @click=${()=>{this._ui("maintenance-object-dialog").then(o=>o?.openEdit(e.entry_id,t))}}>${a("edit",i)}</ha-button>
            `}
            <div class="more-menu-wrapper">
              <ha-icon-button .disabled=${this._actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${()=>this._toggleObjMenu()}></ha-icon-button>
              ${this._objMenuOpen?n`
                <div class="popup-menu" @click=${o=>o.stopPropagation()}>
                  <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._openQrForObject(e.entry_id,t.name)}}>${a("qr_code",i)}</div>
                  <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._printObjectReport(e.entry_id)}}>${a("report_button",i)}</div>
                  ${s?h:n`
                    <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._duplicateObject(e.entry_id)}}>${a("duplicate",i)}</div>
                    ${t.archived?h:n`
                      <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._togglePauseObject(e.entry_id,!!t.paused)}}>${t.paused?a("resume_object",i):a("pause_object",i)}</div>
                      <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._replaceObject(e.entry_id,t)}}>${a("replace_object",i)}</div>
                    `}
                    <div class="popup-menu-item" @click=${()=>{this._closeObjMenu(),this._toggleArchiveObject(e.entry_id,!!t.archived)}}>${t.archived?a("unarchive_object",i):a("archive_object",i)}</div>
                    <div class="popup-menu-divider"></div>
                    <div class="popup-menu-item danger" @click=${()=>{this._closeObjMenu(),this._deleteObject(e.entry_id)}}>${a("delete",i)}</div>
                  `}
                </div>
              `:h}
            </div>
          </div>
        </div>
        ${t.paused?n`<p class="meta paused-meta">
              <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
              ${a("object_paused_badge",i)}${t.paused_until?n` — ${a("paused_until_label",i)} ${q(t.paused_until,i)}`:h}
            </p>`:h}
        ${t.manufacturer||t.model?n`<p class="meta">${[t.manufacturer,t.model].filter(Boolean).join(" ")}</p>`:h}
        ${t.serial_number?n`<p class="meta">${a("serial_number_label",i)}: ${t.serial_number}</p>`:h}
        ${this._renderLineageLink(t.predecessor_entry_id,a("object_replaces",i))}
        ${this._renderLineageLink(t.replaced_by_entry_id,a("object_replaced_by",i))}
        ${t.area_id?n`<p class="meta">${a("area",i)}:
              <a href="#" class="object-area-link" @click=${o=>{o.preventDefault(),this._showArea(t.area_id)}}
                >${Pt(t.area_id,this.hass?.areas,a("no_area",i))}</a></p>`:h}
        ${t.place?n`<p class="meta place-meta">
              <ha-icon icon="mdi:map-marker-outline"></ha-icon>
              ${a("filter_place",i)}: ${t.place_name||t.place}${t.remind_on_site?n` · ${a("remind_on_site",i)}`:h}
              ${t.place_missing?n`<span class="place-missing-badge">${a("place_missing",i)}</span>`:h}
            </p>`:h}
        ${ce(t.documentation_url)?n`<p class="meta">${a("documentation_url_label",i)}:
              <a href=${t.documentation_url} target="_blank" rel="noopener noreferrer">${t.documentation_url}</a>
            </p>`:(t.manual_docs||[]).length?n`<p class="meta">${a("documentation_url_label",i)}:
                ${t.manual_docs.slice(0,3).map((o,u)=>n`${u>0?" \xB7 ":""}<a href="#"
                    @click=${p=>{p.preventDefault(),this._openManualDoc(o)}}>${o.title}</a>`)}${t.manual_docs.length>3?n` … +${t.manual_docs.length-3}`:h}
              </p>`:h}
        ${t.installation_date?n`<p class="meta">${a("installed",i)}: ${q(t.installation_date,i)}</p>`:h}
        ${t.warranty_expiry?this._renderWarrantyMeta(t.warranty_expiry,i):h}
        ${t.notes?n`<div class="object-notes">
              <div class="object-notes-label">${a("object_notes_label",i)}</div>
              <div class="object-notes-body">${gt(t.notes)}</div>
            </div>`:h}

        ${this._renderObjectSection("tasks",a("tasks",i),c.length,()=>n`
        <h3>${a("tasks",i)} (${c.length})${r>0?n`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            appearance="plain"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?a("hide_archived",i):`${a("show_archived",i)} (${r})`}
          </ha-button>`:h}</h3>
        ${e.tasks.length===0?n`<div class="empty-state-centered">
              <p class="empty">${a("no_tasks_yet",i)}</p>
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(o=>o?.openCreate(e.entry_id))}}>${a("add_first_task",i)}</ha-button>
            </div>`:n`<div class="task-table object-tasks">${[...c].sort((o,u)=>De(o.status)-De(u.status)||(o.days_until_due??99999)-(u.days_until_due??99999)).map(o=>n`
              <div class="task-row${o.enabled?"":" task-disabled"}">
                <span class="cell-badges">
                  ${this._statusBadge(o)}
                  ${o.enabled?h:n`<span class="badge-disabled">${a("disabled",i)}</span>`}
                  ${o.nfc_tag_id?n`<span class="nfc-badge" title="${a("nfc_linked",i)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:h}
                  ${o.document_count?n`<span class="doc-badge" title="${o.document_count} ${a("documents",i)}"><ha-icon icon="mdi:paperclip"></ha-icon>${o.document_count}</span>`:h}
                </span>
                <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,o.id)}>${this._listRef(e.entry_id,o.id)}${o.name}${Fe(o.next_event_titles)}</span>
                <span class="task-sub${o.responsible_user_id?"":" task-sub-empty"}">${ti(o,u=>this._userService?.getUserName(u)??null,u=>this._userService?.getPerson(u)??null)}</span>
                <span class="cell type">${a(o.type,i)}</span>
                <span class="due-cell" @click=${()=>this._showTask(e.entry_id,o.id)}>
                  ${ei(o.days_until_due,o.last_performed,i)}
                  ${o.trigger_config?Jt(o,{trend:Xt(o,this._miniStatsData),lang:i}):h}
                  ${Zt(o,this._miniStatsData,this._lang)}
                </span>
                ${this._renderRowActions(i,()=>this._openCompleteDialog(e.entry_id,o.id,o.name,this._features.checklists?o.checklist:void 0,this._features.adaptive&&!!o.adaptive_config?.enabled),()=>this._promptSkipTask(e.entry_id,o.id),o.allow_skip)}
              </div>
            `)}</div>`}
        `)}

        ${this._renderObjectSection("documents",a("documents",i),typeof t.document_count=="number"?t.document_count:null,()=>n`
        <maintenance-documents-section
          .hass=${this.hass}
          .entryId=${e.entry_id}
          .canWrite=${!s}
        ></maintenance-documents-section>
        `)}

        ${(e.parts||[]).length||!s?this._renderObjectSection("parts",a("parts_section",i),(e.parts||[]).length,()=>n`
        <maintenance-parts-section
          .hass=${this.hass}
          .entryId=${e.entry_id}
          .parts=${e.parts||[]}
          .canWrite=${!s}
          .currencySymbol=${this._currencySymbol}
          @parts-changed=${()=>this._loadData()}
        ></maintenance-parts-section>
        `):h}

        ${e.tasks.some(o=>(o.times_performed||0)>0||(o.history||[]).length>0)?this._renderObjectSection("history",a("object_history_section",i),null,()=>n`
        <maintenance-object-history-section
          .hass=${this.hass}
          .entryId=${e.entry_id}
          .object=${t}
          .tasks=${e.tasks}
          .currencySymbol=${this._currencySymbol}
          .userName=${o=>this._userService?.getUserName(o)??null}
          @open-task=${o=>this._showTask(e.entry_id,o.detail.taskId)}
        ></maintenance-object-history-section>
        `):h}
      </div>
    `}_renderObjectSection(e,t,i,s){let r=this._lang,c=this._objectSectionOverride===e||!this._objectSectionsCollapsed.has(e),o=c?a("section_collapse",r):a("section_expand",r);return n`
      <div class="obj-section ${e} ${c?"open":"collapsed"}" data-section=${e}>
        <button class="obj-section-toggle" type="button"
          aria-expanded=${c?"true":"false"}
          aria-label=${o} title=${o}
          @click=${()=>this._toggleObjectSection(e)}>
          <ha-icon icon=${c?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        ${c?n`<div class="obj-section-body">${s()}</div>`:n`<h3 class="obj-section-title" @click=${()=>this._toggleObjectSection(e)}>
              ${t}${i!==null?n`<span class="obj-section-count">${i}</span>`:h}
            </h3>`}
      </div>
    `}_renderNewMenu(e){return n`
      <div class="new-menu-wrapper">
        <ha-button appearance="filled" class="new-menu-button"
          @click=${t=>{t.stopPropagation(),this._toggleNewMenu()}}>
          <ha-icon icon="mdi:plus"></ha-icon> ${a("add",e)}
          <ha-icon icon="mdi:menu-down"></ha-icon>
        </ha-button>
        ${this._newMenuOpen?n`
          <div class="popup-menu new-menu-popup" @click=${t=>t.stopPropagation()}>
            <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._ui("maintenance-task-dialog").then(t=>t?.openCreate("",this._objects))}}>
              <ha-icon icon="mdi:clipboard-plus-outline"></ha-icon> ${a("new_task",e)}
            </div>
            <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._ui("maintenance-object-dialog").then(t=>t?.openCreate())}}>
              <ha-icon icon="mdi:package-variant-closed-plus"></ha-icon> ${a("new_object",e).replace(/^\+\s*/,"")}
            </div>
            <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._openTemplateGallery()}}>
              <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon> ${a("templates_from",e)}
            </div>
            <div class="popup-menu-divider"></div>
            <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._openAdoptProblemSensors()}}>
              <ha-icon icon="mdi:alert-circle-check-outline"></ha-icon> ${a("adopt_problem_button",e)}
            </div>
            <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._openSuggestedSetups()}}>
              <ha-icon icon="mdi:auto-fix"></ha-icon> ${a("setups_button",e)}
            </div>
            ${this._batteryFleetSetupAvailable?n`
              <div class="popup-menu-item" @click=${()=>{this._closeNewMenu(),this._setupBatteryFleet()}}>
                <ha-icon icon="mdi:battery-sync"></ha-icon> ${a("battery_fleet_setup_button",e)}
              </div>
            `:h}
          </div>
        `:h}
      </div>
    `}_togglePopup(e,t){let i=!e();t(i),i&&setTimeout(()=>{let s=()=>{t(!1),document.removeEventListener("click",s)};document.addEventListener("click",s)},0)}_toggleNewMenu(){this._togglePopup(()=>this._newMenuOpen,e=>{this._newMenuOpen=e})}_closeNewMenu(){this._newMenuOpen=!1}_isYoungInstall(){let e=this._objects.filter(i=>!i.object?.battery_fleet),t=e.reduce((i,s)=>i+s.tasks.length,0);return e.length<3&&t<8}_gsDismissed(){try{return new Set(JSON.parse(Z(A.gettingStartedDismissed)||"[]"))}catch{return new Set}}_dismissGettingStarted(e){let t=this._gsDismissed();t.add(e);try{V(A.gettingStartedDismissed,JSON.stringify([...t]))}catch{}this.requestUpdate()}_maybeLoadResetOffers(){this._resetOffersLoaded||(this._resetOffersLoaded=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/reset_offers"}).then(e=>{this._resetOffersCount=(e.offers||[]).length}).catch(()=>{this._resetOffersCount=0}))}_maybeLoadGettingStarted(){this._maybeLoadResetOffers(),!(this._gsLoaded||!this._isYoungInstall())&&(this._gsLoaded=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/discover"}).then(e=>{this._gsSetupsCount=(e.setups||[]).length}).catch(()=>{this._gsSetupsCount=0}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/problem_sensors/discover"}).then(e=>{this._gsAdoptCount=(e.sensors||[]).length}).catch(()=>{this._gsAdoptCount=0}))}_renderGettingStartedChips(e){let t=this._gsDismissed(),i=this._isYoungInstall(),s=[];return i&&this._gsSetupsCount>0&&!t.has("setups")&&s.push({id:"setups",icon:"mdi:auto-fix",text:this._countText("gs_setups_chip","gs_setups_chip_one","n",this._gsSetupsCount,e),run:()=>this._openSuggestedSetups()}),i&&this._gsAdoptCount>0&&!t.has("adopt")&&s.push({id:"adopt",icon:"mdi:alert-circle-check-outline",text:this._countText("gs_adopt_chip","gs_adopt_chip_one","n",this._gsAdoptCount,e),run:()=>this._openAdoptProblemSensors()}),this._resetOffersCount>0&&!t.has("resets")&&s.push({id:"resets",icon:"mdi:counter",text:this._countText("gs_reset_chip","gs_reset_chip_one","n",this._resetOffersCount,e),run:()=>this._openSuggestedSetups()}),this._batteryFleetSetupAvailable&&!t.has("fleet")&&s.push({id:"fleet",icon:"mdi:battery-sync",text:a("gs_fleet_chip",e),run:()=>this._setupBatteryFleet()}),s.length===0?h:n`
      <div class="gs-chips-wrap">
        <div class="gs-chips-label">${a("gs_label",e)}</div>
        <div class="gs-chips">
          ${s.map(r=>n`
            <div class="gs-chip" @click=${()=>r.run()}>
              <ha-icon icon="${r.icon}"></ha-icon>
              <span>${r.text}</span>
              <span class="gs-chip-x" title="${a("dismiss",e)}"
                @click=${c=>{c.stopPropagation(),this._dismissGettingStarted(r.id)}}>
                <ha-icon icon="mdi:close"></ha-icon>
              </span>
            </div>
          `)}
        </div>
      </div>
    `}_toggleObjMenu(){this._togglePopup(()=>this._objMenuOpen,e=>{this._objMenuOpen=e})}_closeObjMenu(){this._objMenuOpen=!1}_toggleMoreMenu(){this._togglePopup(()=>this._moreMenuOpen,e=>{this._moreMenuOpen=e})}_closeMoreMenu(){this._moreMenuOpen=!1}get _sparklineCtx(){return{lang:this._lang,detailStatsData:this._detailStatsData,hasStatsService:!!this._statsService,historyFallbackIds:this._statsService?.historyFallbackIds,isCounterEntity:e=>this._isCounterEntity(e),rangeDays:this._chartRangeDays,setRangeDays:e=>this._setChartRange(e),hideOutliers:this._hideOutliers,setHideOutliers:e=>this._setHideOutliers(e)}}_toggleSection(e){let t=new Set(this._collapsedSections);t.has(e)?t.delete(e):t.add(e),this._collapsedSections=t;try{V(A.collapsedSections,JSON.stringify([...t]))}catch{}}_historyCtx(){let e=this._selectedEntryId&&this._selectedTaskId?this._getObject(this._selectedEntryId)?.tasks.find(r=>r.id===this._selectedTaskId):void 0,t=this._fullHistory,i=t&&t.entryId===this._selectedEntryId&&t.taskId===this._selectedTaskId&&t.entries.length>(e?.history||[]).length?t.entries:e?.history||[],s=i.filter(r=>r.reading_value!=null).sort((r,c)=>r.timestamp.localeCompare(c.timestamp));return{lang:this._lang,hass:this.hass,filter:this._historyFilter,search:this._historySearch,currencySymbol:this._currencySymbol,setFilter:r=>{this._historyFilter=r},setSearch:r=>{this._historySearch=r},openEdit:this._isOperator?void 0:r=>this._openHistoryEdit(r),readingUnit:e?.reading_unit??null,taskRef:je(this._selectedEntryId?this._getObject(this._selectedEntryId)?.object:null,e),phaseNames:Object.fromEntries(Object.entries(e?.phases||{}).map(([r,c])=>[r,c.name])),readingDelta:r=>{let c=s.findIndex(o=>o.timestamp===r.timestamp);return c<=0?null:r.reading_value-s[c-1].reading_value},readingSlotDelta:(r,c)=>wi(i,r,c)}}_taskDetailCtx(){let e=this._selectedEntryId,t=this._selectedTaskId,i=this._getObject(e);return{lang:this._lang,hass:this.hass,entryId:e,taskId:t,objectName:i?.object.name||"",taskRef:je(i?.object,i?.tasks.find(s=>s.id===t)),objectDocUrl:i?.object?.documentation_url??null,objectManualDocs:i?.object?.manual_docs??[],openManualDoc:s=>this._openManualDoc(s),setChecklistItem:(s,r)=>this._setChecklistItem(e,t,s,r),setPhaseCursor:s=>{this._runAction({type:"maintenance_supporter/task/set_phase",entry_id:e,task_id:t,cursor:s})},isOperator:this._isOperator,actionLoading:this._actionLoading,moreMenuOpen:this._moreMenuOpen,activeTab:this._activeTab,features:this._features,currencySymbol:this._currencySymbol,collapsedSections:this._collapsedSections,costDurationToggle:this._costDurationToggle,suggestionDismissed:this._dismissedSuggestions.has(`${e}_${t}`),sparkline:this._sparklineCtx,history:this._historyCtx(),getUserName:s=>this._userService?.getUserName(s)??null,getPerson:s=>this._userService?.getPerson(s)??null,setActiveTab:s=>{this._activeTab=s},toggleSection:s=>this._toggleSection(s),setCostDurationToggle:s=>{this._costDurationToggle=s},showTaskView:()=>this._showFullTaskPage(e,t),showObject:()=>this._showObject(e),toggleMoreMenu:()=>this._toggleMoreMenu(),closeMoreMenu:()=>this._closeMoreMenu(),openEdit:s=>{this._ui("maintenance-task-dialog").then(r=>r?.openEdit(e,s))},openComplete:s=>this._openCompleteDialog(e,t,s.name,this._features.checklists?s.checklist:void 0,this._features.adaptive&&!!s.adaptive_config?.enabled),promptSkip:()=>this._promptSkipTask(e,t),toggleArchive:s=>this._toggleArchiveTask(e,t,s),togglePause:s=>this._togglePauseTask(e,t,s),openQr:s=>this._openQrForTask(e,t,i?.object.name||"",s),duplicateTask:()=>this._duplicateTask(e,t),moveTask:()=>this._moveTask(e,t),promptReset:()=>this._promptResetTask(e,t),promptPostpone:()=>this._promptPostponeTask(e,t),snoozeTask:()=>this._snoozeTask(e,t),printWorksheet:()=>this._printTaskWorksheet(e,t),deleteTask:()=>this._deleteTask(e,t),applySuggestion:s=>this._applySuggestion(e,t,s),reanalyze:()=>this._reanalyzeInterval(e,t),dismissSuggestion:()=>this._dismissSuggestion(e,t),openSeasonalOverrides:s=>this._openSeasonalOverrides(s)}}async _fetchFullHistory(e,t){try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:e,task_id:t});this._selectedEntryId===e&&this._selectedTaskId===t&&(this._fullHistory={entryId:e,taskId:t,entries:i.history||[]})}catch{this._fullHistory=null}}_renderTaskDetail(){if(!this._selectedEntryId||!this._selectedTaskId)return h;let e=this._getTask(this._selectedEntryId,this._selectedTaskId);if(!e)return n`<p>Task not found.</p>`;let t=this._fullHistory,i=t&&t.entryId===this._selectedEntryId&&t.taskId===this._selectedTaskId&&t.entries.length>(e.history||[]).length?{...e,history:t.entries}:e;return n`<maintenance-task-detail-view
      .task=${i}
      .ctx=${this._taskDetailCtx()}
    ></maintenance-task-detail-view>`}_openHistoryEdit(e){if(!this._selectedEntryId||!this._selectedTaskId)return;let t=this._getTask(this._selectedEntryId,this._selectedTaskId),i=Ui(this._selectedEntryId,this._selectedTaskId,e,t);this.shadowRoot?.querySelector("maintenance-history-edit-dialog")?.openEdit(i)}};k.styles=[dt,gs],_([R({attribute:!1})],k.prototype,"hass",2),_([R({type:Boolean,reflect:!0})],k.prototype,"narrow",2),_([R({type:Boolean,reflect:!0})],k.prototype,"tight",2),_([R({type:Boolean,reflect:!0})],k.prototype,"split",2),_([R({attribute:!1})],k.prototype,"panel",2),_([R({type:Boolean,reflect:!0})],k.prototype,"embedded",2),_([R({attribute:!1})],k.prototype,"presets",2),_([f()],k.prototype,"_objects",2),_([f()],k.prototype,"_stats",2),_([f()],k.prototype,"_view",2),_([f()],k.prototype,"_allParts",2),_([f()],k.prototype,"_selectedEntryId",2),_([f()],k.prototype,"_selectedTaskId",2),_([f()],k.prototype,"_selectedAreaId",2),_([f()],k.prototype,"_filterStatus",2),_([f()],k.prototype,"_filterUser",2),_([f()],k.prototype,"_filterLabel",2),_([f()],k.prototype,"_filterPlace",2),_([f()],k.prototype,"_filterPriority",2),_([f()],k.prototype,"_savedViews",2),_([f()],k.prototype,"_activeViewId",2),_([f()],k.prototype,"_unsub",2),_([f()],k.prototype,"_chartRangeDays",2),_([f()],k.prototype,"_hideOutliers",2),_([f()],k.prototype,"_historyFilter",2),_([f()],k.prototype,"_budget",2),_([f()],k.prototype,"_groups",2),_([f()],k.prototype,"_detailStatsData",2),_([f()],k.prototype,"_miniStatsData",2),_([f()],k.prototype,"_features",2),_([f()],k.prototype,"_adminPanelUserIds",2),_([f()],k.prototype,"_operatorWriteEnabled",2),_([f()],k.prototype,"_defaultWarningDays",2),_([f()],k.prototype,"_rowActionStyle",2),_([f()],k.prototype,"_refsInLists",2),_([f()],k.prototype,"_partsCostMode",2),_([f()],k.prototype,"_rowActionNotice",2),_([f()],k.prototype,"_actionLoading",2),_([f()],k.prototype,"_moreMenuOpen",2),_([f()],k.prototype,"_objMenuOpen",2),_([f()],k.prototype,"_toastMessage",2),_([f()],k.prototype,"_toastKind",2),_([f()],k.prototype,"_toastUndo",2),_([f()],k.prototype,"_toastActionLabel",2),_([f()],k.prototype,"_filtersOpen",2),_([f()],k.prototype,"_newMenuOpen",2),_([f()],k.prototype,"_gsSetupsCount",2),_([f()],k.prototype,"_gsAdoptCount",2),_([f()],k.prototype,"_resetOffersCount",2),_([f()],k.prototype,"_batteryFleetSetupAvailable",2),_([f()],k.prototype,"_staleBundle",2),_([f()],k.prototype,"_restartPendingVersion",2),_([f()],k.prototype,"_overviewTab",2),_([f()],k.prototype,"_activeTab",2),_([f()],k.prototype,"_costDurationToggle",2),_([f()],k.prototype,"_historySearch",2),_([f()],k.prototype,"_sortMode",2),_([f()],k.prototype,"_objectSortMode",2),_([f()],k.prototype,"_groupByMode",2),_([f()],k.prototype,"_objectViewMode",2),_([f()],k.prototype,"_objectsTableColumns",2),_([f()],k.prototype,"_showArchived",2),_([f()],k.prototype,"_bulkMode",2),_([f()],k.prototype,"_bulkSelected",2),_([f()],k.prototype,"_objBulkMode",2),_([f()],k.prototype,"_objBulkSelected",2),_([f()],k.prototype,"_bulkMenuOpen",2),_([f()],k.prototype,"_virtStart",2),_([f()],k.prototype,"_virtEnd",2),_([f()],k.prototype,"_collapsedGroups",2),_([f()],k.prototype,"_collapsedSections",2),_([f()],k.prototype,"_objectSectionsCollapsed",2),_([f()],k.prototype,"_objectSectionOverride",2),_([f()],k.prototype,"_paletteOpen",2),_([f()],k.prototype,"_paletteQuery",2),_([f()],k.prototype,"_paletteActive",2),_([f()],k.prototype,"_searchRemote",2),_([f()],k.prototype,"_templateGalleryOpen",2),_([f()],k.prototype,"_templates",2),_([f()],k.prototype,"_homeProfile",2),_([f()],k.prototype,"_templateCategories",2),_([f()],k.prototype,"_templateBusy",2),_([f()],k.prototype,"_fullHistory",2),k=_([ni("maintenance-supporter-panel")],k);export{k as MaintenanceSupporterPanel};
