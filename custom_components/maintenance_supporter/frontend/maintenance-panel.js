/*! maintenance_supporter frontend 2.117.0 */
import{a as z3,b as N3,c as W3,d as U3,h as K3}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-WOJXBYUZ.js";import{a as l0}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-3O4OWOUK.js";import{A as u0,B as b0,C as S0,D as y0,E as k0,F as p5,G as w0,H as O0,I as c5,J as $0,K as T0,L as P0,M as B0,N as R0,U as E0,X as D0,a as o1,b as A3,c as k1,d as P1,e as I2,f as L2,g as E3,h as e5,i as j5,j as q3,k as Q3,l as t5,m as C0,n as e0,o as r0,p as O,q as P2,r as F1,s as u1,t as c0,u as W5,v as n5,w as U5,x as A0,y as s5,z as m0}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-KDFYY4X3.js";import{b as a5,c as d0,d as A2,f as N5,h as M5,i as p0,k as Y5}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-VPNN3SP4.js";import{a as c2}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-G6XAILXY.js";import{a as R3,b as Q2,c as E1,d as K2,e as w2,f as Y2}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-QG47BDDX.js";import{a as F2,b as m3,c as r2,d as t0,e as H0,f as V0,g as r5,h as F5,i as O2,j as I5,z as o5}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-4VVXCYUX.js";import{a as G5,b as v0,c as q5,d as Q5,e as x0,f as l5,g as h0}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LOCGDB7R.js";import{a as d5}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-N55JIO36.js";import{a as l2,b as $2,c as b1,d as K1,e as d2,f as j1,g as p2,h as n0,i as s0}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-2EUYRRWN.js";import{b as K5}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-XAQ5CQEH.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-FMC36R76.js";import{a as a0,b as M0}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-UCO4UTWG.js";import{c as o0}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6OUD47GV.js";import{a as P,b as X,c as I}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-H7MUEL35.js";import{b as n2,c as H5,d as X3,e as J3,f as V5,g as D1}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-TMONILC5.js";import{b as G3,i as Y3}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-5NKC6VSZ.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-YAWF6RRL.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-CQXK2V7R.js";import{a as k2,c as f}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-U5PKEUMU.js";import{a as e2}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-34BXBLTY.js";import{a as F3,b as I3}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-QH4BCVIF.js";import{d as L0,e as z5,f as i0}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-2OGO6RA7.js";import{a as i5}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-NO6HWDCN.js";import{a as Y1,m as T2}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-DT46EPSM.js";import{a as g0,b as f0,c as _0,d as Z0}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6W2EY7XF.js";import{a as s2,b as L5}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-WA5WTQBY.js";import{a as h3,b as z2,c as N2,e as i2,f as G1,g as g3,h as f3,i as W2}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-GKV7QHMT.js";import{a as m1}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-KS2VC4OW.js";import{a as B,b as D3,c as j3,d as D5}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ITRBG52Q.js";import{a as M1,b as E5,d as X2,e as J2,f as C5}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-K7VUGLO5.js";import{$ as q2,A as b2,B as l1,D as y3,E as k3,F as d1,H as Z1,I as R5,K as B1,L as w3,M as G2,N as a2,O as S2,Q as p1,R as w1,S as U,T as O3,U as Q,V as Q1,X as N,Y as h1,_ as O1,a as d,b as E,ba as $3,c as i,ca as T3,d as q,da as y2,e as _2,f as s,ga as P3,h as D,ha as B3,i as B5,j as u3,ja as R1,k as v3,ka as o2,l as x3,m as b,n as A,o as U2,oa as M2,p as _3,q as Z3,r as b3,s as q1,t as S3,u as Z2,y as F,z as V}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YL2MHJNE.js";var t4=["assignee_pool","required_completion_fields","checklist","labels","mirror_todo_entities","next_event_titles","history","readings"],H4=["checklist_progress"],V4=["tasks","parts"],r4=["manual_docs","battery_fleet_excluded"];function X5(r,a,C=[]){for(let e of a)r[e]===void 0&&(r[e]=[]);for(let e of C)r[e]===void 0&&(r[e]={})}function L4(r){let a=r;X5(a,V4),a.object&&typeof a.object=="object"&&X5(a.object,r4);for(let C of a.tasks)X5(C,t4,H4);return r}function B2(r){for(let a of r)L4(a);return r}function i4(r,a){if(a.objects)return a.objects;let C=a.delta||[],e=a.removed||[];if(!C.length&&!e.length)return null;let t=new Map(r.map(H=>[H.entry_id,H]));for(let H of C)t.set(H.entry_id,H);for(let H of e)t.delete(H);return[...t.values()]}function j0(r,a){return a.objects&&B2(a.objects),a.delta&&B2(a.delta),i4(r,a)}var F0=(r,a,C)=>{let e=new Map;for(let t=a;t<=C;t++)e.set(r[t],t);return e},I0=z2(class extends N2{constructor(r){if(super(r),r.type!==h3.CHILD)throw Error("repeat() can only be used in text expressions")}dt(r,a,C){let e;C===void 0?C=a:a!==void 0&&(e=a);let t=[],H=[],L=0;for(let o of r)t[L]=e?e(o,L):L,H[L]=C(o,L),L++;return{values:H,keys:t}}render(r,a,C){return this.dt(r,a,C).values}update(r,[a,C,e]){let t=f3(r),{values:H,keys:L}=this.dt(a,C,e);if(!Array.isArray(t))return this.ut=L,H;let o=this.ut??=[],M=[],l,n,p=0,c=t.length-1,m=0,g=H.length-1;for(;p<=c&&m<=g;)if(t[p]===null)p++;else if(t[c]===null)c--;else if(o[p]===L[m])M[m]=G1(t[p],H[m]),p++,m++;else if(o[c]===L[g])M[g]=G1(t[c],H[g]),c--,g--;else if(o[p]===L[g])M[g]=G1(t[p],H[g]),i2(r,M[g+1],t[p]),p++,g--;else if(o[c]===L[m])M[m]=G1(t[c],H[m]),i2(r,t[p],t[c]),c--,m++;else if(l===void 0&&(l=F0(L,m,g),n=F0(o,p,c)),l.has(o[p]))if(l.has(o[c])){let Z=n.get(L[m]),v=Z!==void 0?t[Z]:null;if(v===null){let h=i2(r,t[p]);G1(h,H[m]),M[m]=h}else M[m]=G1(v,H[m]),i2(r,t[p],v),t[Z]=null;m++}else W2(t[c]),c--;else W2(t[p]),p++;for(;m<=g;){let Z=i2(r,M[g+1]);G1(Z,H[m]),M[m++]=Z}for(;p<=c;){let Z=t[p++];Z!==null&&W2(Z)}return this.ut=L,g3(r,M),_2}});var a4={},z0=z2(class extends N2{constructor(){super(...arguments),this.ot=a4}render(r,a){return a()}update(r,[a,C]){if(Array.isArray(a)){if(Array.isArray(this.ot)&&this.ot.length===a.length&&a.every((e,t)=>e===this.ot[t]))return _2}else if(this.ot===a)return _2;return this.ot=Array.isArray(a)?Array.from(a):a,this.render(a,C)}});function N0(r,a){let C=r,e=a;if(C===e||C.states===e.states)return!1;for(let t of new Set([...Object.keys(C),...Object.keys(e)]))if(t!=="states"&&C[t]!==e[t])return!1;return!0}var W0="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z";var U0="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";var G0="M16.59,5.59L18,7L12,13L6,7L7.41,5.59L12,10.17L16.59,5.59M16.59,11.59L18,13L12,19L6,13L7.41,11.59L12,16.17L16.59,11.59Z";var q0="M7.41,18.41L6,17L12,11L18,17L16.59,18.41L12,13.83L7.41,18.41M7.41,12.41L6,11L12,5L18,11L16.59,12.41L12,7.83L7.41,12.41Z";var Q0="M20,18H4V8H20M20,6H12L10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6Z";var K0="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z";var Y0="M18,6H13A2,2 0 0,0 11,8V10.28C10.41,10.62 10,11.26 10,12A2,2 0 0,0 12,14C13.11,14 14,13.1 14,12C14,11.26 13.6,10.62 13,10.28V8H16V16H8V8H10V6H8L6,6V18H18M20,20H4V4H20M20,2H4A2,2 0 0,0 2,4V20A2,2 0 0,0 4,22H20C21.11,22 22,21.1 22,20V4C22,2.89 21.11,2 20,2Z";var X0="M16,18H18V6H16M6,18L14.5,12L6,6V18Z";var J0="M21.41 11.58L12.41 2.58A2 2 0 0 0 11 2H4A2 2 0 0 0 2 4V11A2 2 0 0 0 2.59 12.42L11.59 21.42A2 2 0 0 0 13 22A2 2 0 0 0 14.41 21.41L21.41 14.41A2 2 0 0 0 22 13A2 2 0 0 0 21.41 11.58M13 20L4 11V4H11L20 13M6.5 5A1.5 1.5 0 1 1 5 6.5A1.5 1.5 0 0 1 6.5 5Z";var J5=["today","dashboard","calendar","settings"];var o4=168*3600*1e3;function C7(){try{let r=X(P.objectsCache);if(!r)return null;let a=JSON.parse(r);return a.v!==B5||!Number.isFinite(a.at)||Date.now()-a.at>o4||!Array.isArray(a.objects)||a.objects.length===0?null:{objects:a.objects,stats:a.stats??null,...typeof a.beta=="boolean"?{beta:a.beta}:{}}}catch{return null}}function C3(r,a,C=M1()){if(!(!Array.isArray(r)||r.length===0))try{let e={v:B5,at:Date.now(),objects:r,stats:a,beta:C};I(P.objectsCache,JSON.stringify(e))}catch{}}function I1(r){return r.responsible_user_id?[r.responsible_user_id]:[...new Set((r.assignee_pool||[]).filter(a=>typeof a=="string"&&a))]}function R2(r,a){return!!a&&I1(r).includes(a)}var M4={days:1,weeks:7,months:30.4368,years:365.25};function e3(r,a){return!r||r<=0?0:r*(M4[a||"days"]??1)}function A5(r,a,C){let e=e3(r,C);if(e<=0||a==null)return{pct:0,overflow:!1};let t=(e-a)/e*100;return{pct:Math.max(0,Math.min(100,t)),overflow:t>100}}function e7(r,a,C,e,t,H){let L=[[C.manufacturer,r.manufacturer],[C.model,r.model],[C.serial,r.serial_number],[C.installed,r.installation_date?e(r.installation_date):null],[C.warranty,r.warranty_expiry?e(r.warranty_expiry):null]].filter(([,l])=>!!l),o=a.map(l=>{let n=C.scheduleLabel(l);return`<tr>
      <td>${f(l.name)}</td>
      <td>${f(C.typeLabel(l.type))}</td>
      <td>${f(C.statusLabel(l.status))}</td>
      <td>${f(n)}</td>
      <td>${f(l.last_performed?e(l.last_performed):C.none)}</td>
      <td>${f(l.next_due?e(l.next_due):C.none)}</td>
      <td class="num">${l.times_performed??0}</td>
      <td class="num">${f(t(l.total_cost??0))}</td>
    </tr>`}).join(""),M=a.reduce((l,n)=>l+(n.total_cost??0),0);return`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${f(C.title)} \u2014 ${f(r.name)}</title>
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
  <h1>${f(r.name)}</h1>
  <p class="sub">${f(C.title)} \xB7 ${f(C.generated)}: ${f(e(H))}</p>
  ${L.length?`<div class="meta">${L.map(([l,n])=>`<div><div class="k">${f(l)}</div>${f(n)}</div>`).join("")}</div>`:""}
  <h2>${f(C.tasksHeading)} (${a.length})</h2>
  <table>
    <thead><tr>
      <th>${f(C.colTask)}</th><th>${f(C.colType)}</th><th>${f(C.colStatus)}</th>
      <th>${f(C.colSchedule)}</th><th>${f(C.colLastDone)}</th><th>${f(C.colNextDue)}</th>
      <th class="num">${f(C.colTimes)}</th><th class="num">${f(C.colCost)}</th>
    </tr></thead>
    <tbody>${o||`<tr><td colspan="8">${f(C.none)}</td></tr>`}</tbody>
    <tfoot><tr><td colspan="7">${f(C.totalCost)}</td><td class="num">${f(t(M))}</td></tr></tfoot>
  </table>
  ${r.notes?`<div class="notes"><strong>${f(C.notes)}:</strong>
${f(r.notes)}</div>`:""}
</body></html>`}var n4=60;function t3(r,a=d1()){if(!r)return{kind:"none",days:null,date:null};let C=w3(a,r);return Number.isFinite(C)?C<0?{kind:"expired",days:C,date:r}:C<=n4?{kind:"expiring",days:C,date:r}:{kind:"valid",days:C,date:r}:{kind:"none",days:null,date:null}}function s4(r,a){let C=Date.parse(r);return Number.isNaN(C)?r.slice(0,10):a(k3(C,y3()))}function t7(r,a,C,e,t,H,L,o,M,l=[],n=null){let p=[[C.object,f(a)],[C.type,f(C.typeLabel(r.type))],[C.interval,f(t(r))],[C.nextDue,r.next_due?f(e(r.next_due)):"\u2014"],[C.lastDone,r.last_performed?f(e(r.last_performed)):f(C.never)]];r.priority&&r.priority!=="normal"&&p.push([C.priority,f(C.priorityLabel(r.priority))]);let c=(r.checklist||[]).map(g=>`<li><span class="box"></span>${f(g)}</li>`).join(""),m=(g,Z)=>g?`<figure class="qr"><img src="${g}" alt="" /><figcaption>${f(Z)}</figcaption></figure>`:"";return`<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="color-scheme" content="light">
<title>${f(r.name)} \u2014 ${f(C.title)}</title>
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
      <h1>${f(r.name)}${n?` <span class="ref">#${f(n)}</span>`:""}</h1>
      <div class="obj">${f(a)}</div>
    </div>
    <div class="qr-row">
      ${m(H,C.scanView)}
      ${m(L,C.scanComplete)}
    </div>
  </header>
  <table class="meta">
    ${p.map(([g,Z])=>`<tr><td>${f(g)}</td><td>${Z}</td></tr>`).join("")}
  </table>
  ${c?`<h2>${f(C.checklist)}</h2><ul class="check">${c}</ul>`:""}
  ${l.length?`<h2>${f(C.parts)}</h2><ul class="check">${l.map(g=>`<li><span class="box"></span>${f(g)}</li>`).join("")}</ul>`:""}
  ${r.notes?`<h2>${f(C.notes)}</h2><div class="notes">${f(r.notes)}</div>`:""}
  ${o?`<h2>${f(C.manualExcerpt)}</h2>
    <div class="excerpt">${f(o.title)} \u2014 ${f(C.pages)} ${o.startPage}\u2013${o.endPage}:
      <a href="${f(o.url)}" target="_blank" rel="noopener">PDF</a>
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
  <footer>${f(a)} \xB7 ${f(r.name)} \xB7 ${f(C.printedOn)} ${f(s4(M,e))}</footer>
</body></html>`}var X1=["manual","warranty","invoice","spare_parts","photo","other"],m5={manual:"mdi:book-open-variant",warranty:"mdi:shield-check",invoice:"mdi:receipt-text-outline",spare_parts:"mdi:cog-outline",photo:"mdi:image-outline",other:"mdi:file-document-outline"};function c1(r){return r.title||r.filename||r.url||""}function m2(r){return(r.tags||[]).find(a=>X1.includes(a))??"other"}function H7(r){return(r.tags||[]).includes("photo")}function u2(r){let a=(r??[]).filter(C=>!!C);return a.length?i`<span class="event-titles"> · ${a.join(", ")}</span>`:s}function v2(r){return r?i`<span class="event-titles trigger-detail"> · ${r}</span>`:s}var V7=E`
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

  /* ── Beta overview as Home Assistant's list pages (Settings › Entities,
     2026.11, measured): a 56-px toolbar of 32-px chips with a 10-px radius,
     12-px labels and 16-px gaps; the filter pane beside the list, 250 px,
     its head as tall as the toolbar; the table's header row; the create
     button at the bottom right. ── */
  .ms-list-layout.with-pane {
    display: grid;
    grid-template-columns: 250px minmax(0, 1fr);
    align-items: start;
  }
  .ms-list-main { min-width: 0; padding-bottom: 88px; }
  .ms-list-layout.with-pane .ms-list-main { padding-left: 16px; }
  .ms-toolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 56px;
    box-sizing: border-box;
  }
  .ms-chip {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex: none;
    height: 32px;
    padding: 0 12px 0 8px;
    box-sizing: border-box;
    border: 1px solid var(--outline-color, var(--divider-color));
    border-radius: 10px;
    background: transparent;
    color: var(--primary-text-color);
    font: inherit;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
  }
  .ms-chip ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color); }
  .ms-chip:hover { background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .ms-chip:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  .ms-chip.active {
    border-color: transparent;
    background: color-mix(in srgb, var(--primary-color) 15%, transparent);
  }
  .ms-chip.active ha-icon { color: var(--primary-color); }
  .ms-chip.icon-only { width: 34px; padding: 0; justify-content: center; }
  .ms-chip .ms-chip-caret { margin: 0 -4px 0 -2px; }
  .ms-chip-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    box-sizing: border-box;
    border-radius: 8px;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    font-size: 11px;
    font-weight: 500;
  }
  .ms-pane-section-head .ms-chip-badge { position: static; margin-left: 8px; }
  .ms-search {
    flex: 1;
    min-width: 140px;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 32px;
    padding: 0 8px 0 10px;
    box-sizing: border-box;
    border: 1px solid var(--outline-color, var(--divider-color));
    border-radius: 10px;
    color: var(--secondary-text-color);
  }
  .ms-search:focus-within { border-color: var(--primary-color); }
  .ms-search ha-icon { --mdc-icon-size: 18px; }
  .ms-search input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--primary-text-color);
    font: inherit;
    font-size: 14px;
  }
  .ms-search input::-webkit-search-cancel-button { display: none; }
  .ms-search-clear { display: inline-flex; padding: 0; border: none; background: none; color: var(--secondary-text-color); cursor: pointer; }
  ha-dropdown-item.selected { color: var(--primary-color); font-weight: 500; }
  .ms-filter-pane {
    position: sticky;
    top: 0;
    max-height: calc(100vh - 140px);
    overflow-y: auto;
    border-right: 1px solid var(--divider-color);
  }
  .ms-pane-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 56px;
    padding-right: 4px;
    border-bottom: 1px solid var(--divider-color);
  }
  .ms-pane-clear { color: var(--secondary-text-color); }
  .ms-pane-section {
    display: block;
    border-bottom: 1px solid var(--divider-color);
    --expansion-panel-summary-padding: 0 12px 0 8px;
    --expansion-panel-content-padding: 0;
  }
  .ms-pane-section-head { display: flex; align-items: center; font-size: 14px; font-weight: 500; }
  .ms-pane-options { display: flex; flex-direction: column; padding-bottom: 8px; }
  .ms-pane-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 44px;
    padding: 0 12px 0 16px;
    border: none;
    background: none;
    color: var(--primary-text-color);
    font: inherit;
    font-size: 14px;
    text-align: left;
    cursor: pointer;
  }
  .ms-pane-option:hover { background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); }
  .ms-pane-option:focus-visible { outline: 2px solid var(--primary-color); outline-offset: -2px; }
  .ms-pane-option ha-icon { --mdc-icon-size: 22px; color: var(--secondary-text-color); flex: none; }
  .ms-pane-option.on ha-icon { color: var(--primary-color); }
  .ms-pane-option-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ms-pane-link {
    align-self: flex-start;
    margin: 4px 16px 0;
    padding: 6px 0;
    border: none;
    background: none;
    color: var(--primary-color);
    font: inherit;
    font-size: 14px;
    cursor: pointer;
  }
  /* The table's header row: the columns named, the sortable ones tappable
     with HA's arrow on the one in force. Same subgrid as the rows. */
  .task-head {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    align-items: center;
    column-gap: 12px;
    min-height: 48px;
    padding: 0 12px;
    border-top: 1px solid var(--divider-color);
    border-bottom: 1px solid var(--divider-color);
  }
  .task-head .th {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 500;
    color: var(--primary-text-color);
  }
  .task-head button.th {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    justify-self: start;
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    font-size: 12px;
    font-weight: 500;
    color: var(--primary-text-color);
    cursor: pointer;
  }
  .task-head button.th:hover span { text-decoration: underline; }
  .task-head button.th ha-icon { --mdc-icon-size: 16px; }
  .task-head .th.th-due { justify-self: end; }
  .split-list .task-head .th-type, .split-list .task-head .th-sub { display: none; }
  /* With the filter pane open the list is 250 px narrower: below 1700 px it
     drops the type and the chips, as the split list does, before the task
     name has to wrap. */
  @media (max-width: 1700px) {
    :host(:not([narrow]):not([tight])) .ms-list-layout.with-pane .task-table:not(.object-tasks) { grid-template-columns: auto minmax(100px, 180px) minmax(120px, 1fr) 150px auto; }
    :host(:not([narrow]):not([tight])) .ms-list-layout.with-pane .task-table.bulk:not(.object-tasks) { grid-template-columns: auto auto minmax(100px, 180px) minmax(120px, 1fr) 150px auto; }
    :host(:not([narrow]):not([tight])) .ms-list-layout.with-pane .task-table .cell.type,
    :host(:not([narrow]):not([tight])) .ms-list-layout.with-pane .task-table .task-sub,
    :host(:not([narrow]):not([tight])) .ms-list-layout.with-pane .task-head .th-type,
    :host(:not([narrow]):not([tight])) .ms-list-layout.with-pane .task-head .th-sub { display: none; }
  }
  /* Create, at the bottom right like Home Assistant's "Create automation". */
  .ms-fab-wrapper {
    position: fixed;
    right: calc(16px + env(safe-area-inset-right, 0px));
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    z-index: 5;
  }
  .ms-fab { box-shadow: var(--ha-box-shadow-l, 0 4px 12px rgba(0, 0, 0, 0.24)); border-radius: 16px; }
  :host([narrow]) .ms-toolbar { flex-wrap: wrap; gap: 8px; padding: 8px 0; }
  :host([narrow]) .ms-search { order: 5; flex-basis: 100%; }
  :host([narrow]) .ms-list-layout.with-pane { grid-template-columns: minmax(0, 1fr); }
  :host([narrow]) .ms-filter-pane { position: static; max-height: none; border-right: none; border-bottom: 1px solid var(--divider-color); }
  :host([narrow]) .ms-list-layout.with-pane .ms-list-main { padding-left: 0; }

  /* Beta: Home Assistant's select, its label inside — as wide as the native
     one reads (the floor below), wrapping like it. */
  .filter-bar ms-ha-select { display: block; min-width: 160px; }
  :host([narrow]) .filter-bar ms-ha-select { min-width: 0; width: 100%; }

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
     across ALL rows, so columns can't jitter while scrolling.
     No scroll anchoring inside it: lit reuses the row elements by position,
     so after the window moves an element shows a row further down, Chrome
     reads that as the anchor having moved, scrolls after it, the window
     moves again, and one wheel step ran off to the end of the list. */
  .task-table.virtual { overflow-anchor: none; }
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

  /* 2560 px and wider (a QHD or 4K screen at 100 %): the name or chips track
     took all the slack, so the due date and the buttons sat 1000 px and more
     to the right of the task's name (4K capture 2026-11-01). The name hugs
     the longest name, the chips get a bounded track, and an empty last track
     takes the rest: a row reads left to right in one sweep. The rows span
     every track (1 / -1), so the empty one still belongs to the row. The
     object column grows to 360 px there: at 180 px a long object name took
     four lines beside all that space. */
  @media (min-width: 2400px) {
    .task-table {
      grid-template-columns: auto fit-content(360px) fit-content(520px) minmax(0, 440px) 100px 150px auto minmax(0, 1fr);
    }
    .task-table.bulk {
      grid-template-columns: auto auto fit-content(360px) fit-content(520px) minmax(0, 440px) 100px 150px auto minmax(0, 1fr);
    }
    .task-table.object-tasks {
      grid-template-columns: auto fit-content(520px) minmax(0, 440px) 100px 150px auto minmax(0, 1fr);
    }
    .split-list .task-table { grid-template-columns: auto fit-content(360px) fit-content(720px) 150px auto minmax(0, 1fr); }
    .split-list .task-table.bulk { grid-template-columns: auto auto fit-content(360px) fit-content(720px) 150px auto minmax(0, 1fr); }
  }

  /* The object page as master-detail (beta, from 1500 px): its task list has
     no object column, so inside the split it is badges, name, due date and
     buttons (the shared split template would shift every cell one track). */
  .split-list .task-table.object-tasks { grid-template-columns: auto minmax(120px, 1fr) 150px auto; }
  @media (min-width: 2400px) {
    .split-list .task-table.object-tasks { grid-template-columns: auto fit-content(720px) 150px auto minmax(0, 1fr); }
  }
  /* From 2200 px of panel (beta): the work on the left (sub-objects, tasks,
     history), what the object is and has on the right (its data, documents,
     parts), side by side instead of one long column. */
  .object-columns {
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
    gap: 24px;
    align-items: start;
  }
  .object-col { min-width: 0; }
  .object-meta {
    padding: 12px 16px;
    margin-bottom: 16px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ms-radius-10, 12px);
  }
  .object-meta .meta:first-child { margin-top: 0; }
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
  .collapsible { margin: 8px 0; border: 1px solid var(--divider-color); border-radius: var(--ms-radius-10, 10px); overflow: hidden; }
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
    /* Its own fade: the toast's keyframes carry the toast's translateX(-50%),
       which slid the search and the gallery in from half a screen left. */
    animation: backdrop-in .15s ease;
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
  .palette-page { flex: none; font-size: 11.5px; padding: 1px 7px; border-radius: var(--ms-radius-10, 10px); background: color-mix(in srgb, var(--primary-color) 14%, transparent); color: var(--primary-color); }
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
    padding: 12px 14px; border: 1px solid var(--divider-color); border-radius: var(--ms-radius-10, 10px);
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
    font-size: 11px; padding: 1px 6px; border-radius: var(--ms-radius-10, 10px);
    background: color-mix(in srgb, var(--primary-color) 12%, transparent); color: var(--primary-text-color);
  }
  .template-card.not-typical { opacity: .6; }
  /* 2026-10 beta: a template's tasks to tick before creating it. */
  .template-preview-name { flex: 1 1 auto; min-width: 0; }
  .template-preview-task {
    display: flex; gap: 12px; align-items: flex-start; padding: 8px 4px;
    border-bottom: 1px solid var(--divider-color); cursor: pointer;
  }
  .template-preview-task input { margin-top: 3px; flex: none; }
  .template-preview-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .template-preview-task-name { font-size: 14px; }
  .template-preview-rule { font-size: 12px; color: var(--secondary-text-color); }
  .template-preview-actions { display: flex; justify-content: flex-end; padding-top: 12px; }
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
  /* A word with no break in it ("Kondensatablaufschlauchreinigungs…", 53
     letters) ran out of its cell over the due date, and on a phone over the
     object's name: names may break anywhere when nothing else fits. */
  .cell.task-name, .cell.object-name, .detail-header h2, .task-header-title, .task-name-breadcrumb {
    overflow-wrap: anywhere;
    min-width: 0;
  }
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
    border-radius: var(--ms-radius-10, 10px);
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.1));
    line-height: 1.4;
    /* A single chip wider than the squeezed track truncates instead of
       bleeding into the next column. */
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sub-chip ha-icon,
  .sub-chip ha-svg-icon {
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
    border-radius: var(--ms-radius-10, 10px);
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
    border-radius: var(--ms-radius-10, 10px);
    font-size: 12px;
    color: var(--secondary-text-color);
  }
  .part-consumer-chip.pooled { border-style: dashed; }
  /* #226: the Use pill beside the stock. */
  .all-parts-stock ms-part-use { margin-left: 8px; vertical-align: middle; }
  .all-parts-stock ms-part-purchase { margin-left: 8px; vertical-align: middle; }
  .all-parts-stock ms-part-purchase[open] { margin: 6px 0 0; }

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
  /* The name stays put while the other columns scroll sideways: with a dozen
     columns it went out of view, and the rows read as nobody's (column test
     2026-11-01). Opaque, the row's own tint laid over the card. */
  .objects-table .oc-name {
    position: sticky;
    left: 0;
    z-index: 1;
    background: var(--card-background-color, #fff);
    box-shadow: inset -1px 0 0 var(--divider-color);
  }
  .objects-table thead th.oc-name {
    z-index: 2;
    background: linear-gradient(var(--secondary-background-color, rgba(0, 0, 0, 0.03)), var(--secondary-background-color, rgba(0, 0, 0, 0.03))), var(--card-background-color, #fff);
  }
  .objects-table tbody tr:hover td.oc-name {
    background: linear-gradient(var(--secondary-background-color, rgba(0, 0, 0, 0.04)), var(--secondary-background-color, rgba(0, 0, 0, 0.04))), var(--card-background-color, #fff);
  }
  .objects-table tbody tr.bulk-selected td.oc-name {
    background: linear-gradient(color-mix(in srgb, var(--primary-color) 10%, transparent), color-mix(in srgb, var(--primary-color) 10%, transparent)), var(--card-background-color, #fff);
  }
  .doc-badge {
    display: inline-flex; align-items: center; gap: 2px; vertical-align: middle;
    margin-left: 8px; padding: 1px 7px 1px 5px; border-radius: var(--ms-radius-10, 10px);
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
    display: inline-block; min-width: 20px; padding: 0 7px; border-radius: var(--ms-radius-10, 10px);
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
  .priority-badge ha-icon,
  .priority-badge ha-svg-icon {
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
    border-radius: var(--ms-radius-10, 10px);
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
  .label-chip ha-icon,
  .label-chip ha-svg-icon {
    --mdc-icon-size: 13px;
  }
  .nfc-badge ha-icon,
  .nfc-badge ha-svg-icon {
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
  /* Beta UI: HA's ha-tab-group draws its own track and indicator. */
  .tab-bar.ha-tabs {
    align-items: center;
    border-bottom: 0;
  }
  .tab-bar.ha-tabs ha-tab-group {
    flex: 1 1 auto;
    min-width: 0;
  }
  /* HA's tabs are wide: at 390 px "Today" scrolled out behind a scroll
     button. Narrower sides keep all four on a phone. */
  .tab-bar.ha-tabs ha-tab-group-tab::part(base) {
    padding-inline: 12px;
  }
  @media (max-width: 420px) {
    .tab-bar.ha-tabs ha-tab-group-tab::part(base) {
      padding-inline: 8px;
    }
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

  /* As many cards in a row as fit, the rest in the next: seven in one row on
     a full page, two rows in a docked task beside the list (seven fixed
     columns ran 5 px past a 635 px pane at 1920 with the filter pane open,
     clip check 2026-11-01). */
  .kpi-bar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
    gap: 12px;
    margin-bottom: 24px;
  }

  .kpi-card {
    background: var(--card-background-color, #fff);
    border-radius: 8px;
    padding: 16px 12px;
    text-align: center;
    border: 1px solid var(--divider-color);
    min-width: 0;
    overflow-wrap: anywhere;
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
    border-radius: var(--ms-radius-6, 6px); padding: 4px 12px; text-transform: uppercase; font-size: 12.5px;
  }
  .toast-undo:hover { background: rgba(255,255,255,.15); }
  @keyframes toast-in {
    from { opacity: 0; transform: translateX(-50%) translateY(16px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  @keyframes backdrop-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;function J1(){return X2("ha-dropdown")}var r7=r=>r.filter(a=>!!a);function t2(r,a,C=""){return i`
    <div class="popup-menu${C?" "+C:""}" role="menu" @keydown=${r0} @click=${e=>e.stopPropagation()}>
      ${r7(r).map(e=>e==="divider"?i`<div class="popup-menu-divider"></div>`:i`<div role="menuitem" tabindex="0" class="popup-menu-item${e.cls?" "+e.cls:""}${e.danger?" danger":""}${e.selected?" selected":""}"
            @click=${()=>{a(),e.action()}}>${e.icon?i`<ha-icon icon=${e.icon}></ha-icon> `:s}${e.label}</div>`)}
    </div>`}function z1(r,a,C={}){let e=r7(a);return i`
    <ha-dropdown class=${C.cls??""} placement=${C.placement??"bottom-end"}
      @wa-select=${t=>{let H=t.detail?.item,L=e[Number(H?.value??H?.getAttribute("value"))];L&&L!=="divider"&&L.action()}}>
      ${r}
      ${e.map((t,H)=>t==="divider"?i`<wa-divider></wa-divider>`:i`<ha-dropdown-item value=${String(H)} class=${`${t.cls??""}${t.selected?" selected":""}`} variant=${t.danger?"danger":"default"}>
            ${t.icon?i`<ha-icon slot="icon" icon=${t.icon}></ha-icon>`:s}${t.label}
          </ha-dropdown-item>`)}
    </ha-dropdown>`}var L7=300*1e3,l4=30,u5=14;function H3(r,a,C,e){return`${r}:${a}:${C}:${e?"counter":"level"}`}var v5=class{constructor(a){this._cache=new Map;this._pending=new Map;this.historyFallbackIds=new Set;this._hass=a}updateHass(a){this._hass=a}async getDetailStats(a,C,e=l4){return this._getStats(a,e<=35?"hour":"day",e,C)}async getMiniStats(a,C){return this._getStats(a,"day",u5,C)}async getBatchMiniStats(a){let C=new Map,e=[];for(let M of a){let l=H3(M.entityId,"day",u5,M.isCounter),n=this._cache.get(l);n&&Date.now()-n.fetchedAt<L7?C.set(p2(M.entityId,M.isCounter),n.points):e.push(M)}if(e.length===0)return C;let t=e.filter(M=>M.isCounter).map(M=>M.entityId),H=e.filter(M=>!M.isCounter).map(M=>M.entityId),L=new Date(Date.now()-u5*24*60*60*1e3).toISOString(),o=[];return t.length>0&&o.push(this._fetchBatch(t,"day",L,["state","sum","change"],!0,C)),H.length>0&&o.push(this._fetchBatch(H,"day",L,["mean","min","max"],!1,C)),await Promise.all(o),C}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(a,C,e,t){let H=H3(a,C,e,t),L=this._cache.get(H);if(L&&Date.now()-L.fetchedAt<L7)return L.points;if(this._pending.has(H))return this._pending.get(H);let o=this._fetchAndNormalize(a,C,e,t,H);this._pending.set(H,o);try{return await o}finally{this._pending.delete(H)}}async _fetchAndNormalize(a,C,e,t,H){let L=new Date(Date.now()-e*24*60*60*1e3).toISOString(),o=t?["state","sum","change"]:["mean","min","max"];try{let l=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:L,statistic_ids:[a],period:C,types:o}))[a]||[],n=this._normalizeRows(l,t);if(n.length<2){let p=await this._fetchHistoryFallback(a,L);p.length>=2?(n=p,this.historyFallbackIds.add(a)):this.historyFallbackIds.delete(a)}else this.historyFallbackIds.delete(a);return this._cache.set(H,{entityId:a,fetchedAt:Date.now(),period:C,points:n}),n}catch(M){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${a}:`,M),[]}}async _fetchHistoryFallback(a,C){try{let t=(await this._hass.connection.sendMessagePromise({type:"history/history_during_period",start_time:C,end_time:new Date().toISOString(),entity_ids:[a],minimal_response:!0,no_attributes:!0}))?.[a]||[];if(t.length>1e3){let o=Math.ceil(t.length/500);t=t.filter((M,l)=>l%o===0||l===t.length-1)}let H=[],L=null;for(let o of t){let M=o.s??o.state;if(M==null||M==="unknown"||M==="unavailable")continue;let l;if(M==="on"||M==="open"||M==="true")l=1;else if(M==="off"||M==="closed"||M==="false")l=0;else if(l=parseFloat(M),!Number.isFinite(l))continue;let n=o.lu??o.last_updated??o.last_changed,p=typeof n=="number"?n*1e3:n!=null?Date.parse(n):NaN;Number.isFinite(p)&&(L!=null&&L!==l&&H.push({ts:p,val:L}),H.push({ts:p,val:l}),L=l)}return H.sort((o,M)=>o.ts-M.ts),H.length&&L!=null&&H.push({ts:Date.now(),val:L}),H}catch(e){return console.warn(`[maintenance-supporter] History fallback failed for ${a}:`,e),[]}}async _fetchBatch(a,C,e,t,H,L){try{let o=await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:e,statistic_ids:a,period:C,types:t});for(let M of a){let l=o[M]||[],n=this._normalizeRows(l,H);L.set(p2(M,H),n),this._cache.set(H3(M,C,u5,H),{entityId:M,fetchedAt:Date.now(),period:C,points:n})}}catch(o){console.warn("[maintenance-supporter] Batch statistics fetch failed:",o)}}_normalizeRows(a,C){let e=[];for(let t of a){let H=null;if(C?H=t.state??null:H=t.mean??null,H===null)continue;let L={ts:t.start,val:H};C||(t.min!=null&&(L.min=t.min),t.max!=null&&(L.max=t.max)),e.push(L)}return e.sort((t,H)=>t.ts-H.ts),e}};function $1(r,a){let C=r??0;return C<1024?`${C} B`:C<1024*1024?`${U(C/1024,a,1)} KB`:`${U(C/(1024*1024),a,1)} MB`}var x5=8,V3=["newest","oldest","title","category"];function r3(r){return V3.includes(r??"")?r:"newest"}function i7(r,a){let C=new Intl.Collator(void 0,{numeric:!0,sensitivity:"base"}),e=o=>c1(o).trim(),t=(o,M)=>C.compare(e(o),e(M)),H=o=>o.kind==="weblink"?X1.length+1:X1.indexOf(m2(o)),L=[...r];switch(a){case"oldest":return L.sort((o,M)=>(o.added_at||"").localeCompare(M.added_at||""));case"title":return L.sort(t);case"category":return L.sort((o,M)=>H(o)-H(M)||t(o,M));default:return L.sort((o,M)=>(M.added_at||"").localeCompare(o.added_at||""))}}function h5(r,a){let C=F2(a);if(!C.length)return r;let e=[];for(let t of r){let H=r2(C,[{text:t.title,weight:3},{text:t.filename,weight:2},{text:(t.tags||[]).join(" "),weight:2},{text:t.description,weight:2},{text:t.url,weight:1}]);H>0&&e.push({doc:t,score:H})}return e.sort((t,H)=>H.score-t.score).map(t=>t.doc)}var G=class extends D{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._filter="";this._loaded=!1;this._busy=!1;this._error="";this._hint="";this._addingLink=!1;this._linkUrl="";this._linkTitle="";this._category="manual";this._thumbs={};this._lightboxUrl="";this._editingId="";this._editTitle="";this._editCategory="manual";this._editDescription="";this._linkDescription="";this._sort=r3(X(P.docSort));this._dragOver=!1;this._loadedFor=null;this._loadSeq=0;this._localeReady=!1;this._singlePick=a0()}_isImage(C){return C.kind==="file"&&(C.mime||"").startsWith("image/")}async _sign(C){return Q2(this.hass,C.id)}get _lang(){return F(this.hass)}updated(C){if(super.updated(C),this.hass&&!this._localeReady&&(this._localeReady=!0,l1(this._lang).then(()=>this.requestUpdate())),this.hass&&this.entryId&&this._loadedFor!==this.entryId){let e=this._loadedFor!==null;this._loadedFor=this.entryId,e&&this._resetForObject(),this._load()}}_resetForObject(){this._docs=[],this._loaded=!1,this._thumbs={},this._filter="",this._error="",this._hint="",this._addingLink=!1,this._linkUrl="",this._linkTitle="",this._linkDescription="",this._editingId="",this._lightboxUrl=""}async _load(){let C=this.entryId,e=++this._loadSeq,t=()=>e!==this._loadSeq||C!==this.entryId,H="",L=await B(this,{type:"maintenance_supporter/documents/list",entry_id:C},{onError:o=>{H=o}});if(!t()){if(this._loaded=!0,L===void 0){this._error=H;return}this._docs=L?.documents||[],this._error="",this._thumbs={},this._loadThumbs(t)}}async _write(C,e,t){this._error="",await B(this,C,{busy:H=>{this._busy=H},fallbackKey:t,reload:async()=>{e?.(),await this._load()},onError:H=>{this._error=H}})}async _signed(C){await B(this,C,{onError:e=>{this._error=e}})}async _loadThumbs(C=()=>!1){await Promise.all(this._docs.filter(e=>this._isImage(e)).map(async e=>{try{let t=await this._sign(e);if(C())return;this._thumbs={...this._thumbs,[e.id]:t}}catch{}}))}_category_of(C){return m2(C)}_labelKeydown(C){(C.key==="Enter"||C.key===" ")&&(C.preventDefault(),C.currentTarget.querySelector("input")?.click())}_onFileInput(C){let e=C.target,t=Array.from(e.files??[]);t.length&&this._uploadFiles(t),e.value=""}_onDrop(C){if(C.preventDefault(),this._dragOver=!1,!this.canWrite||this._busy)return;let e=Array.from(C.dataTransfer?.files??[]);e.length&&this._uploadFiles(e)}_onDragOver(C){this.canWrite&&(C.preventDefault(),this._dragOver=!0)}_onDragLeave(C){let e=C.relatedTarget;(!e||!C.currentTarget.contains(e))&&(this._dragOver=!1)}async _uploadFiles(C,e){let t=e??this._category,H=this.entryId;this._busy=!0,this._error="",this._hint="";let L=0,o=0,M=[];try{for(let l of C){let n;try{n=await o0(this.hass,H,l,[t])}catch(p){let c=p instanceof Error&&p.message==="doc_too_large"?"doc_too_large":"doc_upload_failed";M.push(`${l.name}: ${V(c,this._lang)}`);continue}n.duplicate_in_object?o++:n.deduped&&L++}if(H!==this.entryId)return;o?this._hint=V("doc_dup_in_object",this._lang):L&&(this._hint=V("doc_deduped",this._lang)),await this._load()}finally{M.length&&H===this.entryId&&(this._error=M.join(" \xB7 ")),this._busy=!1}}async _download(C){await this._signed(()=>K2(this.hass,C.id,C.filename||C.title||"document"))}async _preview(C){if(this._isImage(C)){this._lightboxUrl=this._thumbs[C.id]||await this._sign(C);return}await this._signed(()=>E1(this.hass,C.id))}_openDoc(C){C.kind==="file"?this._preview(C):o1(C.url)&&window.open(C.url,"_blank","noopener")}_startEdit(C){this._editingId=C.id,this._editTitle=C.title||"",this._editCategory=this._category_of(C),this._editDescription=C.description||"",this._addingLink=!1,this._error=""}_cancelEdit(){this._editingId=""}_setSort(C){this._sort=r3(C),I(P.docSort,this._sort)}async _saveEdit(C){let e=(C.tags||[]).filter(H=>!X1.includes(H)),t=C.kind==="file"?[this._editCategory,...e]:C.tags??[];await this._write({type:"maintenance_supporter/documents/update",doc_id:C.id,title:this._editTitle.trim()||C.filename||C.url||"",tags:t,description:this._editDescription.trim()},()=>{this._editingId=""})}async _delete(C){let e=c1(C);await a5(this.hass,{title:V("delete",this._lang),message:V("doc_delete_confirm",this._lang).replace("{name}",e),confirmText:V("delete",this._lang),danger:!0})&&await this._write({type:"maintenance_supporter/documents/delete",doc_id:C.id})}async _addLink(){let C=this._linkUrl.trim();if(!C)return;let e=this.entryId;await this._write({type:"maintenance_supporter/documents/add_link",entry_id:e,url:C,title:this._linkTitle.trim()||null,description:this._linkDescription.trim()||null},()=>{this._linkUrl="",this._linkTitle="",this._linkDescription="",this._addingLink=!1},"doc_link_not_allowed")}render(){let C=this._lang;return i`
      <div
        class="doc-zone ${this._dragOver?"drag-over":""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}
      >
        ${this._dragOver&&this.canWrite?i`<div class="drop-overlay">
              <ha-icon icon="mdi:tray-arrow-down"></ha-icon> ${V("doc_drop_hint",C)}
            </div>`:s}
      <div class="doc-header">
        <h3>${V("documents",C)} (${this._docs.length})</h3>
        ${this.canWrite?i`
              <div class="doc-actions">
                <select
                  class="cat-select"
                  .value=${this._category}
                  ?disabled=${this._busy}
                  @change=${e=>this._category=e.target.value}
                >
                  ${X1.map(e=>i`<option value=${e}>${V(`doc_cat_${e}`,C)}</option>`)}
                </select>
                <label
                  class="btn primary ${this._busy?"disabled":""}"
                  role="button"
                  tabindex="0"
                  @keydown=${this._labelKeydown}
                >
                  <ha-icon icon="mdi:upload"></ha-icon>
                  ${this._busy?V("doc_uploading",C):V("doc_upload",C)}
                  <input type="file" ?multiple=${!this._singlePick} hidden ?disabled=${this._busy} @change=${this._onFileInput} />
                </label>
                <ms-photo-picker compact .showGallery=${!1} .lang=${C} .disabled=${this._busy}
                  @files-picked=${e=>this._uploadFiles(e.detail.files,"photo")}
                ></ms-photo-picker>
                <button class="btn" ?disabled=${this._busy} @click=${()=>this._addingLink=!this._addingLink}>
                  <ha-icon icon="mdi:link-variant"></ha-icon> ${V("doc_add_link",C)}
                </button>
              </div>
            `:s}
      </div>

      ${this._error?i`<div class="doc-msg error">${this._error}</div>`:s}
      ${this._hint?i`<div class="doc-msg hint">${this._hint}</div>`:s}

      ${this._addingLink&&this.canWrite?i`
            <div class="link-form">
              <input
                type="url"
                placeholder=${V("doc_link_url",C)}
                .value=${this._linkUrl}
                ?disabled=${this._busy}
                @input=${e=>this._linkUrl=e.target.value}
              />
              <input
                type="text"
                placeholder=${V("doc_link_title",C)}
                .value=${this._linkTitle}
                ?disabled=${this._busy}
                @input=${e=>this._linkTitle=e.target.value}
              />
              <input
                type="text"
                class="link-desc"
                placeholder=${V("doc_description",C)}
                .value=${this._linkDescription}
                ?disabled=${this._busy}
                @input=${e=>this._linkDescription=e.target.value}
              />
              <button class="btn primary" ?disabled=${this._busy||!this._linkUrl.trim()} @click=${this._addLink}>
                ${V("add",C)}
              </button>
              <button class="btn" ?disabled=${this._busy} @click=${()=>this._addingLink=!1}>
                ${V("cancel",C)}
              </button>
            </div>
          `:s}

      ${this._loaded&&this._docs.length>=2?i`<div class="doc-tools">
            <ha-icon icon="mdi:sort"></ha-icon>
            <select class="sort-select" aria-label=${V("doc_sort",C)} .value=${this._sort}
              @change=${e=>this._setSort(e.target.value)}>
              ${V3.map(e=>i`<option value=${e} ?selected=${e===this._sort}>${V(`doc_sort_${e}`,C)}</option>`)}
            </select>
          </div>`:s}
      ${this._loaded&&this._docs.length>=x5?i`<div class="doc-filter">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input type="search" aria-label=${V("doc_search",C)} placeholder=${V("doc_search",C)}
              .value=${this._filter} @input=${e=>this._filter=e.target.value} />
          </div>`:s}
      ${this._loaded?this._docs.length===0?i`<div class="doc-empty">${V("documents_empty",C)}</div>`:(()=>{let e=this._filter.trim()?h5(this._docs,this._filter):i7(this._docs,this._sort);return e.length===0?i`<div class="doc-empty">${V("doc_search_none",C)}</div>`:i`<div class="doc-list">${e.map(t=>this._renderDoc(t,C))}</div>`})():i`<div class="doc-empty">${V("loading",C)}</div>`}

      ${this._lightboxUrl?i`<div class="lightbox top-layer" popover="manual" ${s2} @click=${()=>this._lightboxUrl=""}>
            <img class="lightbox-img" src=${this._lightboxUrl} @click=${e=>e.stopPropagation()} />
            <button class="lightbox-close" title=${V("doc_close",C)} @click=${()=>this._lightboxUrl=""}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>`:s}
      </div>
    `}_renderDoc(C,e){if(this._editingId===C.id)return this._renderEdit(C,e);let t=C.kind==="file",H=this._category_of(C),L=t?`${V(`doc_cat_${H}`,e)} \xB7 ${$1(C.size,e)}`:V("doc_link_badge",e),o=this._thumbs[C.id];return i`
      <div class="doc-row">
        ${t&&o?i`<img
              class="doc-thumb"
              src=${o}
              alt=${C.title||""}
              title=${V("doc_open",e)}
              @click=${()=>this._preview(C)}
            />`:i`<ha-icon
              class="doc-icon ${t?"clickable":""}"
              icon=${t?m5[H]:"mdi:link-variant"}
              @click=${()=>t&&this._preview(C)}
            ></ha-icon>`}
        <div
          class="doc-info"
          role="button"
          tabindex="0"
          title=${V("doc_open",e)}
          @click=${()=>this._openDoc(C)}
          @keydown=${M=>{(M.key==="Enter"||M.key===" ")&&(M.preventDefault(),this._openDoc(C))}}
        >
          <div class="doc-title">${c1(C)}</div>
          <div class="doc-meta">${L}</div>
          ${C.description?i`<div class="doc-desc">${C.description}</div>`:s}
        </div>
        <div class="doc-row-actions">
          ${t?i`
                <button class="icon-btn" title=${V("doc_open",e)} @click=${()=>this._preview(C)}>
                  <ha-icon icon="mdi:eye-outline"></ha-icon>
                </button>
                <button class="icon-btn" title=${V("doc_download",e)} @click=${()=>this._download(C)}>
                  <ha-icon icon="mdi:download"></ha-icon>
                </button>`:i`<a
                class="icon-btn"
                href=${o1(C.url)?C.url:"#"}
                target="_blank"
                rel="noopener noreferrer"
                title=${V("doc_open",e)}
              ><ha-icon icon="mdi:open-in-new"></ha-icon></a>`}
          ${this.canWrite?i`
                <button class="icon-btn" title=${V("edit",e)} ?disabled=${this._busy} @click=${()=>this._startEdit(C)}>
                  <ha-icon icon="mdi:pencil"></ha-icon>
                </button>
                <button class="icon-btn danger" title=${V("delete",e)} ?disabled=${this._busy} @click=${()=>this._delete(C)}>
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>`:s}
        </div>
      </div>
    `}_renderEdit(C,e){let t=C.kind==="file";return i`
      <div class="doc-row editing">
        <input
          class="edit-title"
          type="text"
          placeholder=${V("doc_link_title",e)}
          .value=${this._editTitle}
          ?disabled=${this._busy}
          @input=${H=>this._editTitle=H.target.value}
        />
        ${t?i`<select
              class="cat-select"
              ?disabled=${this._busy}
              @change=${H=>this._editCategory=H.target.value}
            >
              ${X1.map(H=>i`<option value=${H} ?selected=${H===this._editCategory}>${V(`doc_cat_${H}`,e)}</option>`)}
            </select>`:s}
        <input
          class="edit-desc"
          type="text"
          placeholder=${V("doc_description",e)}
          .value=${this._editDescription}
          ?disabled=${this._busy}
          @input=${H=>this._editDescription=H.target.value}
        />
        <button class="icon-btn" title=${V("save",e)} ?disabled=${this._busy||!this._editTitle.trim()} @click=${()=>this._saveEdit(C)}>
          <ha-icon icon="mdi:check"></ha-icon>
        </button>
        <button class="icon-btn" title=${V("cancel",e)} ?disabled=${this._busy} @click=${this._cancelEdit}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
    `}};G.styles=[M0,L5,E`
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
      padding: 6px 10px; gap: 6px; border-style: solid; border-radius: var(--ms-radius-6, 6px);
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
      padding: 6px 8px; border-radius: var(--ms-radius-6, 6px); font: inherit;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .btn {
      display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
      padding: 6px 12px; border-radius: var(--ms-radius-6, 6px); font: inherit; font-size: 13px;
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
      flex: 1 1 180px; padding: 6px 10px; border-radius: var(--ms-radius-6, 6px); font: inherit;
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
      flex: 1; min-width: 0; font: inherit; font-size: 13px; padding: 6px 8px; border-radius: var(--ms-radius-6, 6px);
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
      flex: 1; min-width: 0; padding: 6px 10px; border-radius: var(--ms-radius-6, 6px); font: inherit;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .doc-icon { color: var(--primary-color); --mdc-icon-size: 24px; flex: none; }
    .doc-icon.clickable { cursor: pointer; }
    .doc-thumb {
      width: 40px; height: 40px; object-fit: cover; border-radius: var(--ms-radius-6, 6px); flex: none;
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
    .doc-info { flex: 1; min-width: 0; cursor: pointer; border-radius: var(--ms-radius-6, 6px); }
    .doc-info:hover .doc-title { text-decoration: underline; }
    .doc-info:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .doc-title { font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .doc-meta { font-size: 12px; color: var(--secondary-text-color, #888); }
    .doc-desc { font-size: 12.5px; color: var(--secondary-text-color, #888); margin-top: 2px; white-space: pre-wrap; overflow-wrap: anywhere; }
    .doc-tools { display: flex; align-items: center; gap: 6px; margin: 6px 0 2px; color: var(--secondary-text-color, #888); }
    .doc-tools ha-icon { --mdc-icon-size: 18px; }
    .sort-select {
      padding: 4px 6px; border-radius: var(--ms-radius-6, 6px); font: inherit; font-size: 13px;
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
  `],d([b({attribute:!1})],G.prototype,"hass",2),d([b({attribute:!1})],G.prototype,"entryId",2),d([b({type:Boolean})],G.prototype,"canWrite",2),d([A()],G.prototype,"_docs",2),d([A()],G.prototype,"_filter",2),d([A()],G.prototype,"_loaded",2),d([A()],G.prototype,"_busy",2),d([A()],G.prototype,"_error",2),d([A()],G.prototype,"_hint",2),d([A()],G.prototype,"_addingLink",2),d([A()],G.prototype,"_linkUrl",2),d([A()],G.prototype,"_linkTitle",2),d([A()],G.prototype,"_category",2),d([A()],G.prototype,"_thumbs",2),d([A()],G.prototype,"_lightboxUrl",2),d([A()],G.prototype,"_editingId",2),d([A()],G.prototype,"_editTitle",2),d([A()],G.prototype,"_editCategory",2),d([A()],G.prototype,"_editDescription",2),d([A()],G.prototype,"_linkDescription",2),d([A()],G.prototype,"_sort",2),d([A()],G.prototype,"_dragOver",2);customElements.get("maintenance-documents-section")||customElements.define("maintenance-documents-section",G);function g5(r,a,C){return V(`part_waiting_${r}`,C).replace("{count}",U(a,C))}var A1=class extends D{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._attachId="";this._filter="";this._loadedKey="";this._localeReady=!1}get _lang(){return F(this.hass)}get _refId(){return this.partId||this.taskId||""}get _linkField(){return this.partId?"part_ids":"task_ids"}updated(C){super.updated(C),this.hass&&!this._localeReady&&(this._localeReady=!0,l1(this._lang).then(()=>this.requestUpdate()));let e=`${this.entryId}|${this._refId}`;this.hass&&this.entryId&&this._refId&&this._loadedKey!==e&&(this._loadedKey=e,this._load())}async _load(){let C=await B(this,{type:"maintenance_supporter/documents/list",entry_id:this.entryId},{onError:e=>{this._error=e}});this._loaded=!0,C!==void 0&&(this._docs=C?.documents||[],this._error="")}async _update(C){this._error="",await B(this,{type:"maintenance_supporter/documents/update",...C},{busy:e=>{this._busy=e},reload:()=>this._load(),onError:e=>{this._error=e}})}async _signed(C){await B(this,C,{onError:e=>{this._error=e}})}_links(C){return C[this._linkField]||[]}_linked(){return this._docs.filter(C=>this._links(C).includes(this._refId))}_available(){return this._docs.filter(C=>!this._links(C).includes(this._refId))}async _setLinks(C,e){await this._update({doc_id:C.id,[this._linkField]:e})}_link(){let C=this._docs.find(e=>e.id===this._attachId);C&&(this._attachId="",this._setLinks(C,[...this._links(C),this._refId]))}_unlink(C){this._setLinks(C,this._links(C).filter(e=>e!==this._refId))}_isPdf(C){return C.mime==="application/pdf"||(C.filename||"").toLowerCase().endsWith(".pdf")}_pageFor(C){return this._isPdf(C)&&this.taskId?C.task_pages?.[this.taskId]:void 0}async _open(C){if(C.kind==="weblink"){o1(C.url)&&window.open(C.url,"_blank","noopener");return}let e=this._pageFor(C);await this._signed(()=>E1(this.hass,C.id,e?`#page=${e}`:""))}async _setPage(C,e){this.taskId&&await this._update({doc_id:C.id,task_pages:{[this.taskId]:e}})}async _download(C){await this._signed(()=>K2(this.hass,C.id,C.filename||C.title||"document"))}render(){if(!this._loaded||this._docs.length===0)return s;let C=this._lang,e=this._linked(),t=this._available();return i`
      <div class="task-docs">
        <h3><ha-icon icon="mdi:paperclip"></ha-icon> ${V("documents",C)} (${e.length})</h3>
        ${this._error?i`<div class="tdoc-error">${this._error}</div>`:s}
        ${e.length>=x5?i`<div class="doc-filter">
              <ha-icon icon="mdi:magnify"></ha-icon>
              <input type="search" aria-label=${V("doc_search",C)} placeholder=${V("doc_search",C)}
                .value=${this._filter} @input=${H=>this._filter=H.target.value} />
            </div>`:s}
        ${e.length===0?i`<div class="tdoc-empty">${V(this.partId?"doc_part_none":"doc_task_none",C)}</div>`:(()=>{let H=h5(e,this._filter);return H.length===0?i`<div class="tdoc-empty">${V("doc_search_none",C)}</div>`:i`<div class="tdoc-list">${H.map(L=>this._renderRow(L,C))}</div>`})()}
        ${this.canWrite&&t.length?i`<div class="tdoc-attach">
              <select
                class="tdoc-select"
                ?disabled=${this._busy}
                @change=${H=>this._attachId=H.target.value}
              >
                <option value="" ?selected=${!this._attachId}>${V("doc_link_existing",C)}</option>
                ${t.map(H=>i`<option value=${H.id} ?selected=${H.id===this._attachId}>${c1(H)}</option>`)}
              </select>
              <button class="tdoc-btn" ?disabled=${this._busy||!this._attachId} @click=${this._link}>
                <ha-icon icon="mdi:link-variant-plus"></ha-icon> ${V("doc_attach",C)}
              </button>
            </div>`:s}
      </div>
    `}_renderRow(C,e){let t=C.kind==="file",H=this._isPdf(C),L=this._pageFor(C),o=m2(C),M=t?$1(C.size,e):V("doc_link_badge",e);return i`
      <div class="tdoc-row">
        <ha-icon class="tdoc-icon" icon=${t?m5[o]:"mdi:link-variant"}></ha-icon>
        <div
          class="tdoc-info"
          role="button"
          tabindex="0"
          title=${L?`${V("doc_open",e)} \xB7 ${V("doc_page",e)} ${L}`:V("doc_open",e)}
          @click=${()=>this._open(C)}
          @keydown=${l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),this._open(C))}}
        >
          <div class="tdoc-title">${c1(C)}</div>
          ${C.description?i`<div class="tdoc-desc">${C.description}</div>`:s}
          <div class="tdoc-meta">
            ${M}${L?i` · <span class="tdoc-pagetag">${V("doc_page",e)} ${L}</span>`:s}
          </div>
        </div>
        ${this.canWrite&&H&&this.taskId?i`<input
              class="tdoc-page"
              type="number"
              min="1"
              inputmode="numeric"
              aria-label=${V("doc_page",e)}
              title=${V("doc_page",e)}
              placeholder=${V("doc_page",e)}
              .value=${L?String(L):""}
              ?disabled=${this._busy}
              @change=${l=>{let n=parseInt(l.target.value,10);this._setPage(C,Number.isFinite(n)&&n>=1?n:0)}}
            />`:s}
        <button class="icon-btn" title=${V("doc_open",e)} @click=${()=>this._open(C)}>
          <ha-icon icon=${t?"mdi:eye-outline":"mdi:open-in-new"}></ha-icon>
        </button>
        ${t?i`<button class="icon-btn" title=${V("doc_download",e)} @click=${()=>this._download(C)}>
              <ha-icon icon="mdi:download"></ha-icon>
            </button>`:s}
        ${this.canWrite?i`<button class="icon-btn" title=${V("doc_unlink",e)} ?disabled=${this._busy} @click=${()=>this._unlink(C)}>
              <ha-icon icon="mdi:link-variant-off"></ha-icon>
            </button>`:s}
      </div>
    `}};A1.styles=E`
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
      flex: 1; min-width: 0; font: inherit; font-size: 13px; padding: 6px 8px; border-radius: var(--ms-radius-6, 6px);
      border: 1px solid var(--divider-color); background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .doc-filter input:focus { outline: none; border-color: var(--primary-color); }
    .tdoc-row {
      display: flex; align-items: center; gap: 10px; padding: 6px 10px;
      border: 1px solid var(--divider-color); border-radius: 8px;
    }
    .tdoc-icon { color: var(--primary-color); --mdc-icon-size: 22px; flex: none; }
    .tdoc-info { flex: 1; min-width: 0; cursor: pointer; border-radius: var(--ms-radius-6, 6px); }
    .tdoc-info:hover .tdoc-title { text-decoration: underline; }
    .tdoc-info:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .tdoc-title { font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tdoc-meta { font-size: 12px; color: var(--secondary-text-color, #888); }
    .tdoc-desc { font-size: 12px; color: var(--secondary-text-color, #888); white-space: pre-line; }
    .tdoc-pagetag { color: var(--primary-color); font-weight: 500; }
    .tdoc-page {
      flex: none; width: 76px; padding: 5px 8px; border-radius: var(--ms-radius-6, 6px); font: inherit; font-size: 13px;
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
      flex: 1; min-width: 160px; padding: 6px 10px; border-radius: var(--ms-radius-6, 6px); font: inherit;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .tdoc-btn {
      display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
      padding: 6px 12px; border-radius: var(--ms-radius-6, 6px); font: inherit; font-size: 13px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .tdoc-btn ha-icon { --mdc-icon-size: 18px; }
    .tdoc-btn[disabled] { opacity: 0.5; pointer-events: none; }
  `,d([b({attribute:!1})],A1.prototype,"hass",2),d([b({attribute:!1})],A1.prototype,"entryId",2),d([b({attribute:!1})],A1.prototype,"taskId",2),d([b({attribute:!1})],A1.prototype,"partId",2),d([b({type:Boolean})],A1.prototype,"canWrite",2),d([A()],A1.prototype,"_docs",2),d([A()],A1.prototype,"_loaded",2),d([A()],A1.prototype,"_busy",2),d([A()],A1.prototype,"_error",2),d([A()],A1.prototype,"_attachId",2),d([A()],A1.prototype,"_filter",2);customElements.get("maintenance-task-documents")||customElements.define("maintenance-task-documents",A1);function d4(r){let a=r.package_size;return typeof a=="number"&&Number.isFinite(a)&&a>0?a:1}var v1=class extends D{constructor(){super();this.notBooked=!1;this.nowrap=!1;this._open=!1;this._qty="";this._invalid=!1;this._busy=!1;this._error="";this.addEventListener("click",C=>C.stopPropagation())}get _lang(){return F(this.hass)}updated(){this.toggleAttribute("open",this._open)}_start(){this._qty=String(d4(this.sparePart)),this._invalid=!1,this._error="",this._open=!0,this.updateComplete.then(()=>this.shadowRoot?.querySelector("input")?.select())}async _use(){if(this._busy)return;let C=parseFloat(this._qty);if(!Number.isFinite(C)||C<=0){this._invalid=!0;return}this._invalid=!1;let e=await B(this,{type:"maintenance_supporter/part/use",entry_id:this.entryId,part_id:this.sparePart.id,quantity:C},{busy:t=>{this._busy=t},onError:t=>{this._error=t}});e!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("part-used",{detail:{partId:this.sparePart.id,stock:e?.stock??0,restoring:e?.restoring??0},bubbles:!0,composed:!0})))}render(){let C=this._lang;return this._open?i`
      <span class="use-field">
        <input
          class=${this._invalid?"invalid":""}
          type="number"
          min="0"
          step="any"
          .value=${this._qty}
          aria-label=${V("part_use_how_many",C)}
          title=${V("part_use_how_many",C)}
          @input=${e=>this._qty=e.target.value}
          @keydown=${e=>{e.key==="Enter"&&this._use(),e.key==="Escape"&&(this._open=!1)}}
        />
        ${this.sparePart.unit?i`<span class="unit">${this.sparePart.unit}</span>`:s}
        <button class="use-pill confirm" title=${V("part_use_hint",C)} .disabled=${this._busy} @click=${()=>this._use()}>
          <ha-icon icon="mdi:check"></ha-icon>${V("part_use",C)}
        </button>
        <ha-icon-button class="use-cancel" title=${V("cancel",C)} @click=${()=>this._open=!1}
          ><ha-icon icon="mdi:close"></ha-icon
        ></ha-icon-button>
      </span>
      ${this.notBooked?i`<div class="note">${V("part_use_not_booked",C)}</div>`:s}
      ${this._error?m1("error",this._error):s}
    `:i`<button class="use-pill" title=${V("part_use_hint",C)} @click=${()=>this._start()}>
        <ha-icon icon="mdi:package-variant-minus"></ha-icon>${V("part_use",C)}
      </button>`}};v1.styles=E`
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
  `,d([b({attribute:!1})],v1.prototype,"hass",2),d([b({attribute:!1})],v1.prototype,"entryId",2),d([b({attribute:!1})],v1.prototype,"sparePart",2),d([b({type:Boolean})],v1.prototype,"notBooked",2),d([b({type:Boolean,reflect:!0})],v1.prototype,"nowrap",2),d([A()],v1.prototype,"_open",2),d([A()],v1.prototype,"_qty",2),d([A()],v1.prototype,"_invalid",2),d([A()],v1.prototype,"_busy",2),d([A()],v1.prototype,"_error",2);customElements.get("ms-part-use")||customElements.define("ms-part-use",v1);function p4(r){return J3(r)}var H2=r=>r.trim()===""?NaN:parseFloat(r),r1=class extends D{constructor(){super();this.currencySymbol="\u20AC";this.onUse=!1;this._open=!1;this._qty="";this._price="";this._total="";this._date="";this._notes="";this._invalid="";this._busy=!1;this._error="";this.addEventListener("click",C=>C.stopPropagation())}get _lang(){return F(this.hass)}updated(){this.toggleAttribute("open",this._open)}_start(){let C=this.sparePart;this._qty=String(p4(C)),this._price=typeof C.cost=="number"?String(C.cost):"",this._total="",this._followPrice(),this._date=d1(),this._notes="",this._invalid="",this._error="",this._open=!0,this.updateComplete.then(()=>this.shadowRoot?.querySelector("input.qty")?.select())}_followPrice(){let C=H2(this._qty),e=H2(this._price);Number.isFinite(C)&&Number.isFinite(e)?this._total=String(H5(C*e)):this._price.trim()===""&&(this._total="")}_followTotal(){let C=H2(this._qty),e=H2(this._total);Number.isFinite(C)&&C>0&&Number.isFinite(e)?this._price=String(H5(e/C)):this._total.trim()===""&&(this._price="")}async _record(){if(this._busy)return;let C=H2(this._qty),e=H2(this._total);if(!Number.isFinite(C)||C<=0){this._invalid="qty";return}if(this._total.trim()!==""&&(!Number.isFinite(e)||e<0)){this._invalid="total";return}this._invalid="";let t={type:"maintenance_supporter/part/purchase",entry_id:this.entryId,part_id:this.sparePart.id,quantity:C};this._total.trim()!==""&&(t.cost=H5(e)),this._date&&this._date!==d1()&&(t.date=this._date),this._notes.trim()&&(t.notes=this._notes.trim());let H=await B(this,t,{busy:L=>{this._busy=L},onError:L=>{this._error=L}});H!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("part-bought",{detail:{partId:this.sparePart.id,stock:H?.stock??0},bubbles:!0,composed:!0})))}_keys(C){C.target?.tagName==="INPUT"&&(C.key==="Enter"&&this._record(),C.key==="Escape"&&(this._open=!1))}render(){let C=this._lang;if(!this._open)return i`<button class="buy-pill" title=${V("part_bought_hint",C)} @click=${()=>this._start()}>
        <ha-icon icon="mdi:cart-plus"></ha-icon>${V("part_bought",C)}
      </button>`;let e=this.sparePart,t=typeof e.package_size=="number"&&e.package_size>0?e.package_size:null,H=H2(this._qty),L=this.currencySymbol;return i`
      <div class="buy-form" @keydown=${o=>this._keys(o)}>
        <label class="f">
          <span>${t?V("part_bought_packages",C).replace("{size}",Q1(t,e.unit,C)):V("part_bought_quantity",C)}</span>
          <input class="qty ${this._invalid==="qty"?"invalid":""}" type="number" min="0" step="any" inputmode="decimal"
            .value=${this._qty}
            @input=${o=>{this._qty=o.target.value,this._followPrice()}} />
        </label>
        <label class="f">
          <span>${t?V("part_bought_price_package",C):V("part_bought_price_each",C)} (${L})</span>
          <input class="price" type="number" min="0" step="0.01" inputmode="decimal"
            .value=${this._price}
            @input=${o=>{this._price=o.target.value,this._followPrice()}} />
        </label>
        <label class="f">
          <span>${V("part_bought_total",C)} (${L})</span>
          <input class="total ${this._invalid==="total"?"invalid":""}" type="number" min="0" step="0.01" inputmode="decimal"
            .value=${this._total}
            @input=${o=>{this._total=o.target.value,this._followTotal()}} />
        </label>
        <div class="f date">
          <span>${V("part_bought_date",C)}</span>
          <ms-date-field kind="date" .hass=${this.hass} .lang=${C} .value=${this._date}
            @value-changed=${o=>this._date=o.detail.value||d1()}></ms-date-field>
        </div>
        <label class="f notes">
          <span>${V("notes_label",C)}</span>
          <input class="notes-input" type="text" maxlength="2000" placeholder=${V("part_bought_note",C)}
            .value=${this._notes}
            @input=${o=>this._notes=o.target.value} />
        </label>
        <div class="adds">
          ${Number.isFinite(H)&&H>0?V("part_bought_adds",C).replace("{qty}",Q1(V5(e,H),e.unit,C)):s}
        </div>
        ${this.onUse?i`<div class="note">${V("part_bought_on_use",C)}</div>`:s}
        ${this._error?m1("error",this._error):s}
        <div class="actions">
          <button class="buy-pill confirm" .disabled=${this._busy} @click=${()=>this._record()}>
            <ha-icon icon="mdi:check"></ha-icon>${V("part_bought_confirm",C)}
          </button>
          <button class="buy-pill" @click=${()=>this._open=!1}>${V("cancel",C)}</button>
        </div>
      </div>
    `}};r1.styles=E`
    :host {
      display: inline-flex;
      max-width: 100%;
      white-space: normal;
    }
    :host([open]) {
      display: block;
      width: 100%;
      min-width: min(100%, 280px);
    }
    .buy-pill {
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
    .buy-pill:hover,
    .buy-pill.confirm {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .buy-pill ha-icon {
      --mdc-icon-size: 16px;
    }
    /* Wraps instead of a grid: the date picker needs its width, and on a
       narrow shelf or in a table cell every field takes a line. */
    .buy-form {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 8px 10px;
      margin: 6px 0 4px;
      padding: 10px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      font-weight: 400;
    }
    .f {
      display: flex;
      flex-direction: column;
      gap: 3px;
      flex: 1 1 110px;
      min-width: 0;
    }
    .f.date {
      flex: 1 1 190px;
    }
    .f > span {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .f.notes,
    .adds,
    .note,
    .error,
    .actions {
      flex: 1 1 100%;
    }
    input {
      width: 100%;
      box-sizing: border-box;
      padding: 5px 6px;
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
    .adds,
    .note,
    .error {
      font-size: 12px;
      line-height: 1.4;
    }
    .adds,
    .note {
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  `,d([b({attribute:!1})],r1.prototype,"hass",2),d([b({attribute:!1})],r1.prototype,"entryId",2),d([b({attribute:!1})],r1.prototype,"sparePart",2),d([b({attribute:!1})],r1.prototype,"currencySymbol",2),d([b({type:Boolean})],r1.prototype,"onUse",2),d([A()],r1.prototype,"_open",2),d([A()],r1.prototype,"_qty",2),d([A()],r1.prototype,"_price",2),d([A()],r1.prototype,"_total",2),d([A()],r1.prototype,"_date",2),d([A()],r1.prototype,"_notes",2),d([A()],r1.prototype,"_invalid",2),d([A()],r1.prototype,"_busy",2),d([A()],r1.prototype,"_error",2);customElements.get("ms-part-purchase")||customElements.define("ms-part-purchase",r1);var c4=["charge","sharpen","clean","dry","refill","restore"],A4=500,m4={name:"",vendor:"",mpn:"",gtin:"",storage_location:"",product_url:"",unit:"",cost:"",stock:"",reuse:"",restoring:"",cost_mode:"",reorder_threshold:"",restock_quantity:"",package_size:"",auto_buy_task:!0,notes:""},t1=class extends D{constructor(){super(...arguments);this.parts=[];this.canWrite=!1;this.currencySymbol="\u20AC";this.partsCostMode="purchase";this.fleet=!1;this._editing=null;this._opened=null;this._busy=!1;this._error="";this._restockFor=null;this._restockQty="";this._restockInvalid=!1;this._disposeFor=null;this._disposeQty="1";this._disposeInvalid=!1;this._docsFor=null}get _lang(){return F(this.hass)}connectedCallback(){super.connectedCallback(),l1(this._lang).then(()=>this.requestUpdate())}_notifyChanged(){this.dispatchEvent(new CustomEvent("parts-changed",{bubbles:!0,composed:!0}))}_send(C){return this._error="",B(this,C,{busy:e=>{this._busy=e},onError:e=>{this._error=e}})}_openAdd(){this._editing={...m4},this._opened=null}_openEdit(C){this._editing={id:C.id,name:C.name,vendor:C.vendor||"",mpn:C.mpn||"",gtin:C.gtin||"",storage_location:C.storage_location||"",product_url:C.product_url||"",unit:C.unit||"",cost:C.cost!=null?String(C.cost):"",stock:C.stock!=null?String(C.stock):"",reuse:C.reuse||"",restoring:C.restoring?String(C.restoring):"",cost_mode:C.cost_mode||"",reorder_threshold:C.reorder_threshold!=null?String(C.reorder_threshold):"",restock_quantity:C.restock_quantity!=null?String(C.restock_quantity):"",package_size:C.package_size!=null?String(C.package_size):"",auto_buy_task:!!C.auto_buy_task,notes:C.notes||""},this._opened={...this._editing}}_formValue(C){let e=t=>t.trim()===""?null:Number(t);return{entry_id:this.entryId,name:C.name.trim(),vendor:C.vendor.trim()||null,mpn:C.mpn.trim()||null,gtin:C.gtin.trim()||null,storage_location:C.storage_location.trim()||null,product_url:C.product_url.trim()||null,unit:C.unit.trim()||null,cost:e(C.cost),stock:e(C.stock),reuse:C.reuse||null,...C.reuse?{restoring:e(C.restoring)??0}:{},...this.fleet?{}:{cost_mode:C.cost_mode||null},reorder_threshold:e(C.reorder_threshold),restock_quantity:e(C.restock_quantity),package_size:e(C.package_size),auto_buy_task:C.auto_buy_task,notes:C.notes.trim()||null}}async _save(){let C=this._editing;if(this._busy||!C||!C.name.trim())return;let e=this._formValue(C),t=this._opened;C.id&&t&&(C.stock===t.stock&&delete e.stock,C.restoring===t.restoring&&C.reuse===t.reuse&&delete e.restoring);let H=C.id?"maintenance_supporter/part/update":"maintenance_supporter/part/create";await this._send(C.id?{type:H,part_id:C.id,...e}:{type:H,...e})!==void 0&&(this._editing=null,this._notifyChanged())}async _delete(C){if(!await a5(this.hass,{title:V("delete",this._lang),message:V("part_delete_confirm",this._lang).replace("{name}",C.name),confirmText:V("delete",this._lang),danger:!0}))return;await this._send({type:"maintenance_supporter/part/delete",entry_id:this.entryId,part_id:C.id})!==void 0&&this._notifyChanged()}async _restock(C){if(this._busy)return;let e=parseFloat(this._restockQty);if(!Number.isFinite(e)||e===0){this._restockInvalid=!0;return}this._restockInvalid=!1;let t=await this._send({type:"maintenance_supporter/part/restock",entry_id:this.entryId,part_id:C.id,delta:e});this._restockFor=null,t!==void 0&&(C.stock=t?.stock,this.requestUpdate(),this._notifyChanged())}async _readyAgain(C){if(this._busy)return;let e=await this._send({type:"maintenance_supporter/part/ready_again",entry_id:this.entryId,part_id:C.id});e&&(C.stock=e.stock,C.restoring=e.restoring,this.requestUpdate(),this._notifyChanged())}async _dispose(C){if(this._busy)return;let e=parseFloat(this._disposeQty);if(!Number.isFinite(e)||e<=0){this._disposeInvalid=!0;return}this._disposeInvalid=!1;let t=await this._send({type:"maintenance_supporter/part/dispose",entry_id:this.entryId,part_id:C.id,quantity:e});this._disposeFor=null,t&&(C.stock=t.stock,C.restoring=t.restoring,this.requestUpdate(),this._notifyChanged())}_onUsed(C,e){C.stock=e.stock,C.restoring=e.restoring,this.requestUpdate(),this._notifyChanged()}_renderUse(C){return!this.canWrite||!(typeof C.stock=="number"&&C.stock>0)?s:i`<ms-part-use
      .hass=${this.hass}
      .entryId=${this.entryId}
      .sparePart=${C}
      ?notBooked=${n2(C,this.partsCostMode,this.fleet)==="use"}
      @part-used=${e=>this._onUsed(C,e.detail)}
    ></ms-part-use>`}_onBought(C,e){C.stock=e.stock,this.requestUpdate(),this._notifyChanged()}_renderBought(C){return!this.canWrite||typeof C.stock!="number"?s:i`<ms-part-purchase
      .hass=${this.hass}
      .entryId=${this.entryId}
      .sparePart=${C}
      .currencySymbol=${this.currencySymbol}
      ?onUse=${n2(C,this.partsCostMode,this.fleet)==="use"}
      @part-bought=${e=>this._onBought(C,e.detail)}
    ></ms-part-purchase>`}_renderDispose(C,e){return this._disposeFor!==C.id?i`<button class="ready-again dispose" title=${V("part_dispose_hint",e)} .disabled=${this._busy}
        @click=${()=>{this._disposeFor=C.id,this._disposeQty="1",this._disposeInvalid=!1}}>
        <ha-icon icon="mdi:trash-can-outline"></ha-icon>${V("part_dispose",e)}
      </button>`:i`<input
        class="restock-input dispose-input${this._disposeInvalid?" invalid":""}"
        type="number"
        min="1"
        max=${String(C.restoring??0)}
        .value=${this._disposeQty}
        aria-label=${V("part_dispose_how_many",e)}
        title=${V("part_dispose_how_many",e)}
        @input=${t=>this._disposeQty=t.target.value}
        @keydown=${t=>{t.key==="Enter"&&this._dispose(C),t.key==="Escape"&&(this._disposeFor=null)}}
      />
      <button class="ready-again dispose confirm" title=${V("part_dispose_hint",e)} .disabled=${this._busy} @click=${()=>this._dispose(C)}>
        <ha-icon icon="mdi:check"></ha-icon>${V("part_dispose",e)}
      </button>
      <ha-icon-button title=${V("cancel",e)} @click=${()=>this._disposeFor=null}
        ><ha-icon icon="mdi:close"></ha-icon
      ></ha-icon-button>`}_identLine(C){return[C.vendor,C.mpn?`MPN: ${C.mpn}`:"",C.gtin?`GTIN: ${C.gtin}`:""].filter(Boolean).join(" \xB7 ")}_renderRow(C){let e=this._lang,t=C.stock!==null&&C.stock!==void 0,H=this._identLine(C),L=this._docsFor===C.id;return i`
      <div class="part-row ${C.is_low?"low":""}">
        <ha-icon class="part-icon" icon=${C.is_low?"mdi:cart-arrow-down":"mdi:package-variant-closed"}></ha-icon>
        <div class="part-main">
          <div class="part-name">
            ${A3(C.shopping_url)?i`<a href=${C.shopping_url} target="_blank" rel="noopener noreferrer">${C.name}</a>`:C.name}
            ${t?i`<span class="stock-badge ${C.is_low?"low":""}"
                  >${Q1(C.stock,C.unit,e)}${C.reorder_threshold!=null?i`<span class="threshold">/${U(C.reorder_threshold,e)}</span>`:s}</span
                >`:s}
            ${this._renderUse(C)}
            ${this._renderBought(C)}
          </div>
          ${t&&C.reuse&&(C.restoring??0)>0?i`<div class="part-waiting">
                <span class="waiting-badge">${g5(C.reuse,C.restoring,e)}</span>
                ${this.canWrite?i`<button class="ready-again" title=${V("part_ready_again_hint",e)} .disabled=${this._busy}
                        @click=${()=>this._readyAgain(C)}>
                        <ha-icon icon="mdi:check"></ha-icon>${V(`part_reuse_${C.reuse}`,e)}
                      </button>
                      ${this._renderDispose(C,e)}`:s}
              </div>`:s}
          <div class="part-meta">
            ${H?i`<span>${H}</span>`:s}
            ${C.storage_location?i`<span class="loc"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${C.storage_location}</span>`:s}
          </div>
          ${C.notes?i`<div class="part-notes">${C.notes}</div>`:s}
        </div>
        <ha-icon-button
          title=${V("documents",e)}
          class=${L?"docs-open":""}
          @click=${()=>this._docsFor=L?null:C.id}
          ><ha-icon icon="mdi:paperclip"></ha-icon
        ></ha-icon-button>
        ${this.canWrite?i`
              ${this._restockFor===C.id?i`
                    <input
                      class="restock-input${this._restockInvalid?" invalid":""}"
                      type="number"
                      .value=${this._restockQty}
                      placeholder="+1"
                      @input=${o=>this._restockQty=o.target.value}
                      @keydown=${o=>{o.key==="Enter"&&this._restock(C),o.key==="Escape"&&(this._restockFor=null)}}
                    />
                    <ha-icon-button title=${V("save",e)} .disabled=${this._busy} @click=${()=>this._restock(C)}
                      ><ha-icon icon="mdi:check"></ha-icon
                    ></ha-icon-button>
                  `:i`
                    <ha-icon-button
                      title=${V("part_restock",e)}
                      .disabled=${this._busy}
                      @click=${()=>{this._restockFor=C.id,this._restockInvalid=!1,this._restockQty=String(V5(C))}}
                      ><ha-icon icon="mdi:plus-minus-variant"></ha-icon
                    ></ha-icon-button>
                  `}
              <ha-icon-button title=${V("edit",e)} .disabled=${this._busy} @click=${()=>this._openEdit(C)}
                ><ha-icon icon="mdi:pencil"></ha-icon
              ></ha-icon-button>
              <ha-icon-button title=${V("delete",e)} .disabled=${this._busy} @click=${()=>this._delete(C)}
                ><ha-icon icon="mdi:delete-outline"></ha-icon
              ></ha-icon-button>
            `:s}
      </div>
      ${L?i`<div class="part-docs">
            <maintenance-task-documents
              .hass=${this.hass}
              .entryId=${this.entryId}
              .partId=${C.id}
              .canWrite=${this.canWrite}
            ></maintenance-task-documents>
          </div>`:s}
    `}_field(C,e,t={}){let H=this._editing;return i`
      <label class="form-field">
        <span>${C}</span>
        <input
          type=${t.type||"text"}
          .value=${String(H[e]??"")}
          placeholder=${t.placeholder||""}
          @input=${L=>{this._editing[e]=L.target.value,this.requestUpdate()}}
        />
      </label>
    `}_renderCostMode(C){let e=this._editing,t=H=>V(H==="use"?"settings_parts_cost_use":"settings_parts_cost_purchase",C);return i`
      <label class="form-field">
        <span>${V("part_cost_mode",C)}</span>
        <select
          class="cost-mode-select"
          .value=${e.cost_mode}
          @change=${H=>{this._editing={...this._editing,cost_mode:H.target.value}}}
        >
          <option value="" ?selected=${!e.cost_mode}>${V("part_cost_mode_house",C).replace("{mode}",t(this.partsCostMode))}</option>
          <option value="purchase" ?selected=${e.cost_mode==="purchase"}>${t("purchase")}</option>
          <option value="use" ?selected=${e.cost_mode==="use"}>${t("use")}</option>
        </select>
      </label>
      <div class="form-hint">${V("part_cost_mode_hint",C)}</div>
    `}_renderForm(){let C=this._lang,e=this._editing;return i`
      <div class="part-form">
        <div class="form-grid">
          ${this._field(V("part_name",C),"name")}
          ${this._field(V("part_vendor",C),"vendor")}
          ${this._field("MPN","mpn")}
          ${this._field("GTIN / EAN","gtin",{placeholder:"4006381333931"})}
          ${this._field(V("part_storage_location",C),"storage_location")}
          ${this._field(V("part_product_url",C),"product_url",{placeholder:"https://\u2026"})}
          ${this._field(V("part_unit",C),"unit")}
          ${this._field(V("part_cost",C),"cost",{type:"number"})}
          ${this.fleet?s:this._renderCostMode(C)}
          ${this._field(V("part_stock",C),"stock",{type:"number"})}
          <label class="form-field">
            <span>${V("part_reuse",C)}</span>
            <select
              class="reuse-select"
              .value=${e.reuse}
              @change=${t=>{this._editing={...this._editing,reuse:t.target.value}}}
            >
              <option value="" ?selected=${!e.reuse}>${V("part_reuse_none",C)}</option>
              ${c4.map(t=>i`<option value=${t} ?selected=${e.reuse===t}>${V(`part_reuse_${t}`,C)}</option>`)}
            </select>
          </label>
          ${e.reuse?this._field(V("part_restoring",C),"restoring",{type:"number"}):s}
          ${e.reuse?i`<div class="form-hint">${V("part_reuse_hint",C)}</div>`:s}
          ${this._field(V("part_reorder_threshold",C),"reorder_threshold",{type:"number"})}
          ${this._field(V("part_package_size",C),"package_size",{type:"number"})}
          ${this._field(e.package_size.trim()?V("part_restock_packages",C):V("part_restock_quantity",C),"restock_quantity",{type:"number"})}
          ${e.package_size.trim()?i`<div class="form-hint">${V("part_package_hint",C)}</div>`:s}
          <label class="form-field checkbox">
            <input
              type="checkbox"
              .checked=${e.auto_buy_task}
              @change=${t=>{this._editing={...e,auto_buy_task:t.target.checked}}}
            />
            <span>${V("part_auto_buy",C)}</span>
          </label>
          <!-- Documented and searched since the parts feature, but the form
               never had a field — only the API and imports could set it
               (audit 2026-09-28). -->
          <label class="form-field notes">
            <span>${V("notes_label",C)}</span>
            <textarea
              rows="2"
              maxlength=${A4}
              .value=${e.notes}
              @input=${t=>{this._editing={...this._editing,notes:t.target.value}}}
            ></textarea>
          </label>
        </div>
        <div class="form-actions">
          <ha-button appearance="plain" @click=${()=>this._editing=null}>${V("cancel",C)}</ha-button>
          <ha-button .disabled=${this._busy||!e.name.trim()} @click=${()=>this._save()}
            >${V("save",C)}</ha-button
          >
        </div>
      </div>
    `}_inventoryValue(){let C=0,e=!1;for(let t of this.parts){let H=X3(t),L=typeof t.stock=="number"?t.stock:null;H!==null&&L!==null&&(C+=H*L,e=!0)}return e?C:null}render(){let C=this._lang;return!this.parts.length&&!this.canWrite?s:i`
      <div class="section-head">
        <h3>
          <ha-icon icon="mdi:package-variant"></ha-icon>
          ${V("parts_section",C)} (${this.parts.length})
          ${this._inventoryValue()!==null?i`<span class="inventory-value" title=${V("parts_inventory_value",C)}
                >${V("parts_inventory_value",C)}:
                ${Q(this._inventoryValue(),this.currencySymbol,C)}</span>`:s}
        </h3>
        ${this.canWrite&&!this._editing?i`<ha-button appearance="plain" @click=${()=>this._openAdd()}>
              <ha-icon icon="mdi:plus"></ha-icon> ${V("part_add",C)}
            </ha-button>`:s}
      </div>
      ${this._error?m1("error",this._error):s}
      ${this._editing?this._renderForm():s}
      ${this.parts.map(e=>this._renderRow(e))}
    `}};t1.styles=E`
    :host {
      display: block;
      margin: 12px 0;
      container-type: inline-size;
    }
    /* #226: an open Use field takes a line of its own below the name; on a
       narrow shelf the row's buttons step down a line to give it the width. */
    .part-name ms-part-use[open],
    .part-name ms-part-purchase[open] {
      flex-basis: 100%;
    }
    @container (max-width: 520px) {
      .part-row:has(ms-part-use[open]),
      .part-row:has(ms-part-purchase[open]) {
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      .part-row:has(ms-part-use[open]) .part-main,
      .part-row:has(ms-part-purchase[open]) .part-main {
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
      border-radius: var(--ms-radius-10, 10px);
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
      border-radius: var(--ms-radius-10, 10px);
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
  `,d([b({attribute:!1})],t1.prototype,"hass",2),d([b({attribute:!1})],t1.prototype,"entryId",2),d([b({attribute:!1})],t1.prototype,"parts",2),d([b({type:Boolean})],t1.prototype,"canWrite",2),d([b({attribute:!1})],t1.prototype,"currencySymbol",2),d([b({attribute:!1})],t1.prototype,"partsCostMode",2),d([b({type:Boolean})],t1.prototype,"fleet",2),d([A()],t1.prototype,"_editing",2),d([A()],t1.prototype,"_busy",2),d([A()],t1.prototype,"_error",2),d([A()],t1.prototype,"_restockFor",2),d([A()],t1.prototype,"_restockQty",2),d([A()],t1.prototype,"_restockInvalid",2),d([A()],t1.prototype,"_disposeFor",2),d([A()],t1.prototype,"_disposeQty",2),d([A()],t1.prototype,"_disposeInvalid",2),d([A()],t1.prototype,"_docsFor",2);customElements.get("maintenance-parts-section")||customElements.define("maintenance-parts-section",t1);var f5={readings:!0,parts:!0,photos:!0,documents:!0,checklist:!0,notes:!0,costs:!0,person:!0,refs:!0,qr:!1,bare:!0,docDescriptions:!0};function u4(r){return!!(r.notes&&r.notes.trim()||r.cost!=null||r.duration!=null||r.readings.length||r.parts.length||r.photoIds.length||r.checklist)}var v4=6;function a7(r,a,C,e,t,H,L,o={}){let M=o.options??{layout:"chronological",include:f5},l=M.include,n=o.data??{objectRef:null,tasks:[],photos:{},fmtNumber:k=>String(k)},p=a.filter(k=>k.type==="completed"&&(l.bare!==!1||u4(k))),{totalCost:c}=r5(p),m=k=>l.refs&&n.objectRef&&k.taskRefNo!=null&&k.refNo!=null?`${n.objectRef}.${k.taskRefNo}-${k.refNo}`:null,g=k=>l.refs&&n.objectRef&&k.taskRefNo!=null?`${n.objectRef}.${k.taskRefNo}`:null,Z=[[C.refNumber,l.refs&&n.objectRef?`#${n.objectRef}`:null],[C.manufacturer,r.manufacturer],[C.model,r.model],[C.serial,r.serial_number],[C.installed,r.installation_date?e(r.installation_date):null]].filter(([,k])=>k).map(([k,j])=>`<div class="meta-row"><span>${f(k)}</span><strong>${f(j)}</strong></div>`).join(""),v=k=>{let j=[];if(l.readings&&k.readings.length){let W=k.readings.map(R=>{let Y=`${n.fmtNumber(R.value)}${R.unit?` ${f(R.unit)}`:""}`,J=R.delta!=null?` <span class="delta">(${R.delta>=0?"+":"\u2212"}${n.fmtNumber(Math.abs(R.delta))})</span>`:"";return`${R.name?`${f(R.name)}: `:""}${Y}${J}`});j.push(`<div class="fact"><span class="k">${f(C.readings)}</span>${W.join(" \xB7 ")}</div>`)}if(l.parts&&k.parts.length&&j.push(`<div class="fact"><span class="k">${f(C.parts)}</span>${k.parts.map(W=>`${f(W.name)} \xD7 ${n.fmtNumber(W.quantity)}`).join(", ")}</div>`),l.checklist&&k.checklist&&j.push(`<div class="fact"><span class="k">${f(C.checklist)}</span>${k.checklist.done}/${k.checklist.total}</div>`),l.photos&&k.photoIds.length){let W=k.photoIds.slice(0,v4),R=W.map(J=>{let e1=n.photos[J],w=e1?.name||J.slice(0,8);return e1?.url?`<figure class="photo"><img src="${f(e1.url)}" alt="" /><figcaption>${f(w)}</figcaption></figure>`:`<figure class="photo"><figcaption>${f(w)}</figcaption></figure>`}),Y=k.photoIds.length>W.length?`<span class="more">+${k.photoIds.length-W.length}</span>`:"";j.push(`<div class="fact"><span class="k">${f(C.photos)}</span><div class="photos">${R.join("")}${Y}</div></div>`)}return j.length?`<div class="details">${j.join("")}</div>`:""},h=k=>[l.notes?k.notes:null,l.person&&k.completedBy?`${C.completedBy}: ${k.completedBy}`:null].filter(Boolean).join(" \xB7 "),x=k=>l.costs?`<td class="num">${k.cost!=null?f(H(k.cost)):f(C.none)}</td>
        <td class="num">${k.duration!=null?f(t(k.duration)):f(C.none)}</td>`:"",S=k=>k?`<span class="ref">#${f(k)}</span>`:"",u=l.costs?5:3,T=k=>`<thead><tr>
    <th>${f(C.colDate)}</th>
    ${k?`<th>${f(C.colTask)}</th>`:"<th></th>"}
    ${l.costs?`<th class="num">${f(C.colCost)}</th><th class="num">${f(C.colDuration)}</th>`:""}
    <th>${f(C.colNotes)}</th>
  </tr></thead>`,y=(k,j)=>{let W=h(k),R=v(k),Y=j?f(k.phaseName?`${k.taskName} \xB7 ${k.phaseName}`:k.taskName):f(k.phaseName||"");return`<tr class="entry">
        <td class="nowrap">${f(e(k.timestamp))}${S(m(k))}</td>
        <td>${j?`${Y} ${S(g(k))}`:Y}</td>
        ${x(k)}
        <td class="notes">${f(W)||(R?"":f(C.none))}</td>
      </tr>${R?`<tr class="entry-details"><td colspan="${u}" class="details-cell">${R}</td></tr>`:""}`},K;if(M.layout==="by_task"){let k=new Map(n.tasks.map(R=>[R.id,R])),j=[...n.tasks.map(R=>R.id)];for(let R of p)j.includes(R.taskId)||j.push(R.taskId);K=`${j.map(R=>{let Y=p.filter(a1=>a1.taskId===R);if(!Y.length)return"";let J=k.get(R),e1=J?.name||Y[0].taskName,w=l.refs?J?.ref??g(Y[0]):null,C1=l.documents&&J?.documents.length?`<div class="fact"><span class="k">${f(C.documents)}</span>${J.documents.map(a1=>`${f(a1.title)}${a1.page?` (${f(C.page(a1.page))})`:""}${l.docDescriptions!==!1&&a1.description?` \u2014 <span class="doc-desc">${f(a1.description)}</span>`:""}`).join(", ")}</div>`:"",s1=l.qr&&J?.qrDataUri?`<figure class="qr"><img src="${f(J.qrDataUri)}" alt="" /><figcaption>${f(C.scanHint)}</figcaption></figure>`:"",C2=Y.reduce((a1,$)=>a1+($.cost??0),0);return`<section class="task">
  <div class="task-head">
    <div class="task-title">
      <h2>${f(e1)} ${S(w)}</h2>
      ${J?.schedule?`<div class="schedule">${f(J.schedule)}</div>`:""}
      ${C1}
      <div class="task-count">${f(C.entriesLabel(Y.length))}${l.costs&&C2!==0?` \xB7 ${f(H(C2))}`:""}</div>
    </div>
    ${s1}
  </div>
  <table>
    ${T(!1)}
    <tbody>
${Y.map(a1=>y(a1,!1)).join(`
`)}
    </tbody>
  </table>
</section>`}).join(`
`)}
<table class="total">
  <tfoot><tr>
    <td>${f(C.totalLabel)}</td>
    <td class="num">${l.costs?f(H(c)):""}</td>
  </tr></tfoot>
</table>`}else K=`<table>
  ${T(!0)}
  <tbody>
${p.map(k=>y(k,!0)).join(`
`)}
  </tbody>
  <tfoot><tr>
    <td colspan="2">${f(C.totalLabel)}</td>
    ${l.costs?`<td class="num">${f(H(c))}</td><td colspan="2"></td>`:"<td></td>"}
  </tr></tfoot>
</table>`;return`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${f(C.title)} \u2014 ${f(r.name)}</title>
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
<h1>${f(C.title)} \u2014 ${f(r.name)}</h1>
<p class="sub">${f(C.generated)} ${f(e(L))} \xB7 ${f(C.entriesLabel(p.length))}</p>
${Z?`<div class="meta">${Z}</div>`:""}
${K}
${o.capped?`<p class="cap-note">${f(C.capNote)}</p>`:""}
</body>
</html>`}var x4=60,L1=class extends D{constructor(){super(...arguments);this.entryId="";this.object=null;this.tasks=[];this.currencySymbol="\u20AC";this.userName=()=>null;this._filterTask="";this._from="";this._to="";this._expanded=!1;this._printOpen=!1;this._printLayout="chronological";this._printInclude={...f5};this._printing=!1;this._loadedFor=null;this._histories=new l0(this);this._localeReady=!1}connectedCallback(){super.connectedCallback();try{let C=JSON.parse(X(P.printOptions)||"null");(C?.layout==="by_task"||C?.layout==="chronological")&&(this._printLayout=C.layout),C?.include&&typeof C.include=="object"&&(this._printInclude={...f5,...C.include})}catch{}}_savePrintOptions(){I(P.printOptions,JSON.stringify({layout:this._printLayout,include:this._printInclude}))}_toggleInclude(C,e){this._printInclude={...this._printInclude,[C]:e},this._savePrintOptions()}get _lang(){return F(this.hass)}willUpdate(C){super.willUpdate(C),this.entryId&&this._loadedFor!==this.entryId&&(this._loadedFor=this.entryId,this._filterTask="",this._from="",this._to=""),this.entryId&&(C.has("entryId")||C.has("tasks")||C.has("hass")&&C.get("hass")===void 0)&&this._histories.sync(this.hass,this.tasks.map(e=>({entryId:this.entryId,task:e})))}updated(C){super.updated(C),!this._localeReady&&this.hass&&(this._localeReady=!0,l1(this._lang).then(()=>this.requestUpdate()))}get _entries(){return H0(this.tasks.map(C=>({id:C.id,name:C.name,history:this._histories.historyOf(this.entryId,C),ref_no:C.ref_no,reading_unit:C.reading_unit})))}get _capped(){return this.tasks.some(C=>this._histories.historyOf(this.entryId,C).length>=t0)}_openTask(C){this.dispatchEvent(new CustomEvent("open-task",{detail:{taskId:C},bubbles:!0,composed:!0}))}async _bookletData(C){let e=this._printInclude,t=this._lang,H=[];if(e.documents||e.photos)try{H=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId})).documents||[]}catch{H=[]}let L=new Map;e.qr&&this._printLayout==="by_task"&&await Promise.all(this.tasks.map(async l=>{try{let n=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/qr/generate",entry_id:this.entryId,task_id:l.id,url_mode:"server",action:"view"});n.svg_data_uri&&L.set(l.id,n.svg_data_uri)}catch{}}));let o=this.tasks.map(l=>({id:l.id,name:l.name,ref:P1(this.object,l),schedule:R1(l,t)||null,documents:H.filter(n=>(n.task_ids||[]).includes(l.id)&&!H7(n)).map(n=>({title:c1(n),page:n.task_pages?.[l.id]??null,description:n.description||null})),qrDataUri:L.get(l.id)??null})),M={};if(e.photos){let l=[...new Set(C.filter(p=>p.type==="completed").flatMap(p=>p.photoIds))].slice(0,x4),n=new Map(H.map(p=>[p.id,p]));await Promise.all(l.map(async p=>{let c=n.get(p),m=c&&c1(c)||p.slice(0,8);try{M[p]={name:m,url:new URL(await Q2(this.hass,p),window.location.origin).href}}catch{M[p]={name:m,url:null}}}))}return{tasks:o,photos:M}}_filteredEntries(){return V0(this._entries,{taskId:this._filterTask||null,from:this._from||null,to:this._to||null})}async _print(){let C=this._lang,e=this.object;if(!e||this._printing)return;let t=Y2();this._printing=!0;let H,L;try{await this._histories.settled(),H=this._filteredEntries(),L=await this._bookletData(H)}catch(n){throw t?.close(),n}finally{this._printing=!1}this._printOpen=!1;let o={title:V("service_record_title",C),generated:V("report_generated",C),manufacturer:V("manufacturer",C),model:V("model",C),serial:V("serial_number_label",C),installed:V("installed",C),colDate:V("date",C),colTask:V("task_name",C),colCost:V("cost",C),colDuration:V("duration",C),colNotes:V("notes_label",C),completedBy:V("completed_by",C),totalLabel:V("report_total_cost",C),entriesLabel:n=>`${n} ${V("service_record_entries",C)}`,capNote:V("object_history_cap_note",C),none:"\u2014",readings:V("print_inc_readings",C),parts:V("print_inc_parts",C),photos:V("print_inc_photos",C),documents:V("print_inc_documents",C),checklist:V("print_inc_checklist",C),refNumber:V("ref_number",C),scanHint:V("report_scan_hint",C),page:n=>V("search_page",C).replace("{page}",String(n))},M=H.map(n=>({...n,completedBy:n.completedBy?n.completedVia?V("completed_via",C).replace("{person}",this.userName(n.completedBy)??"").replace("{device}",this.userName(n.completedVia)??""):this.userName(n.completedBy):null,notes:n.notes?c2(n.notes,C):null})),l=a7(e,M,o,n=>n?N(n,C):"",n=>y2(n,C),n=>Q(n,this.currencySymbol,C),new Date().toISOString(),{capped:this._capped,options:{layout:this._printLayout,include:this._printInclude},data:{objectRef:k1(e),tasks:L.tasks,photos:L.photos,fmtNumber:n=>U(n,C)}});w2(l,t)}_renderPrintOptions(){let C=this._lang,e=this._printInclude,t=(L,o,M=!1)=>i`
      <label class="opt ${M?"disabled":""}">
        <input type="checkbox" .checked=${e[L]} ?disabled=${M}
          @change=${l=>this._toggleInclude(L,l.target.checked)} />
        <span>${V(o,C)}</span>
      </label>`,H=this._printLayout==="by_task";return i`
      <div class="print-options" role="dialog" aria-label=${V("print_options_title",C)}>
        <div class="po-title">${V("print_options_title",C)}</div>
        <div class="po-group">
          <span class="po-label">${V("print_layout",C)}</span>
          <label class="opt"><input type="radio" name="layout" value="chronological" .checked=${!H}
            @change=${()=>{this._printLayout="chronological",this._savePrintOptions()}} /><span>${V("print_layout_chronological",C)}</span></label>
          <label class="opt"><input type="radio" name="layout" value="by_task" .checked=${H}
            @change=${()=>{this._printLayout="by_task",this._savePrintOptions()}} /><span>${V("print_layout_by_task",C)}</span></label>
        </div>
        <div class="po-group">
          <span class="po-label">${V("print_include",C)}</span>
          ${t("readings","print_inc_readings")}
          ${t("parts","print_inc_parts")}
          ${t("photos","print_inc_photos")}
          ${t("checklist","print_inc_checklist")}
          ${t("notes","print_inc_notes")}
          ${t("costs","print_inc_costs")}
          ${t("person","print_inc_person")}
          ${t("refs","print_inc_refs")}
          ${t("bare","print_inc_bare")}
          ${t("documents","print_inc_documents",!H)}
          ${t("docDescriptions","print_inc_doc_desc",!H)}
          ${t("qr","print_inc_qr",!H)}
        </div>
        <div class="po-actions">
          <ha-button appearance="plain" @click=${()=>{this._printOpen=!1}}>${V("cancel",C)}</ha-button>
          <ha-button appearance="filled" class="po-print" .disabled=${this._printing} @click=${()=>this._print()}>
            ${this._printing?V("loading",C):V("print_button",C)}
          </ha-button>
        </div>
      </div>`}render(){let C=this._lang;if(!this._entries.length&&!this._histories.loading)return s;let t=this._filteredEntries(),{completed:H,totalCost:L}=r5(t),o=this._expanded?t:t.slice(0,15);return i`
      <div class="section">
        <h3>
          ${V("object_history_section",C)}
          <span class="count">${t.length}</span>
          ${this._histories.loading?i`<span class="loading-hint">${V("loading",C)}</span>`:s}
          <ha-button appearance="plain" class="print-btn" @click=${()=>{this._printOpen=!this._printOpen}}>
            <ha-icon icon="mdi:printer-outline"></ha-icon>
            ${V("service_record_print",C)}
          </ha-button>
        </h3>
        ${this._printOpen?this._renderPrintOptions():s}

        <div class="filters">
          <select .value=${this._filterTask} @change=${M=>{this._filterTask=M.target.value}}>
            <option value="">${V("object_history_all_tasks",C)}</option>
            ${this.tasks.map(M=>i`<option value=${M.id} ?selected=${M.id===this._filterTask}>${M.name}</option>`)}
          </select>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${C}
            .label=${V("date_from",C)}
            .value=${this._from}
            @value-changed=${M=>{this._from=M.detail.value}}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${C}
            .label=${V("date_to",C)}
            .value=${this._to}
            @value-changed=${M=>{this._to=M.detail.value}}
          ></ms-date-field>
        </div>

        ${t.length===0?i`<p class="empty">${V("object_history_empty",C)}</p>`:i`
              <div class="rows">
                ${o.map(M=>i`
                  <div class="row">
                    <span class="date" title=${h1(M.timestamp,C)}>${N(M.timestamp,C)}</span>
                    <span class="type type-${M.type}" style="--type-color: ${Z3(M.type)}">${V(M.type,C)}</span>
                    <button class="task-link" @click=${()=>this._openTask(M.taskId)}>${M.taskName}${M.phaseName?` \xB7 ${M.phaseName}`:""}</button>
                    <span class="facts">
                      ${M.cost!=null?i`<span>${O3(M.cost,this.currencySymbol,C)}</span>`:s}
                      ${M.partsCost!=null?i`<span class="parts-cost" title=${V(M.partsCounted?"history_parts_counted_hint":"history_parts_info_hint",C)}>${V(M.partsCounted?"history_parts_counted":"history_parts_info",C).replace("{amount}",Q(M.partsCost,this.currencySymbol,C))}</span>`:s}
                      ${M.purchaseCost!=null?i`<span class="parts-cost">${V("history_purchase_stock",C).replace("{amount}",Q(M.purchaseCost,this.currencySymbol,C))}</span>`:s}
                      ${M.duration!=null?i`<span>${y2(M.duration,C)}</span>`:s}
                    </span>
                    ${M.notes?i`<span class="notes" title=${c2(M.notes,C)}>${c2(M.notes,C)}</span>`:s}
                  </div>
                `)}
              </div>
              ${t.length>o.length?i`<ha-button appearance="plain" class="more" @click=${()=>{this._expanded=!0}}>
                    ${V("show_all",C)} (${t.length})
                  </ha-button>`:s}
              <div class="totals">
                ${H} ${V("service_record_entries",C)} · ${V("report_total_cost",C)}:
                <strong>${Q(L,this.currencySymbol,C)}</strong>
              </div>
              ${this._capped?i`<p class="cap-note">${V("object_history_cap_note",C)}</p>`:s}
            `}
      </div>
    `}};L1.styles=E`
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
      border: 1px solid var(--divider-color); border-radius: var(--ms-radius-10, 10px); padding: 12px 14px; margin: 0 0 12px;
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
      border-radius: var(--ms-radius-6, 6px); padding: 5px 8px; font: inherit;
    }
    /* A select is as wide as its longest option: a long task name pushed the
       filter past a phone's edge (2026-10-31, 373 px in a 320 px section). */
    .filters select {
      max-width: 100%;
      min-width: 0;
      text-overflow: ellipsis;
    }
    /* HA's date picker is about 286 px at its narrowest: on a 320 px phone the
       From/To fields stuck out of the section. They may shrink in the row. */
    .filters ms-date-field {
      flex: 1 1 140px;
      min-width: 0;
      max-width: 100%;
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
  `,d([b({attribute:!1})],L1.prototype,"hass",2),d([b()],L1.prototype,"entryId",2),d([b({attribute:!1})],L1.prototype,"object",2),d([b({attribute:!1})],L1.prototype,"tasks",2),d([b()],L1.prototype,"currencySymbol",2),d([b({attribute:!1})],L1.prototype,"userName",2),d([A()],L1.prototype,"_filterTask",2),d([A()],L1.prototype,"_from",2),d([A()],L1.prototype,"_to",2),d([A()],L1.prototype,"_expanded",2),d([A()],L1.prototype,"_printOpen",2),d([A()],L1.prototype,"_printLayout",2),d([A()],L1.prototype,"_printInclude",2),d([A()],L1.prototype,"_printing",2);customElements.get("maintenance-object-history-section")||customElements.define("maintenance-object-history-section",L1);var i1=class i1 extends D{constructor(){super(...arguments);this.flat=!1;this._ov=null;this._loading=!1;this._marking=!1;this._choosing=null;this._error="";this._disposeFor=null;this._disposeQty="1";this._history=null;this._rosterSort=i1._storedSort();this._typeFilter=null;this._recorded=[];this._access=d0;this._historyRequested=!1;this._localeReady=!1;this._markAll=async()=>{await this._mark(void 0)};this._repair=async()=>{await this._act({type:"maintenance_supporter/battery_fleet/setup",language:this._lang})};this._loadHistory=async C=>{if(I(P.batteryRosterOpen,C?"1":"0"),!(!C||this._historyRequested)){this._historyRequested=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview_history"});this._history=e.series}catch{this._history=null}}}}get _lang(){return F(this.hass)}get _canWrite(){return A2(this.hass?.user,this._access)}connectedCallback(){super.connectedCallback(),this.hass&&this._load()}updated(C){a2(this,C),C.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,l1(this._lang).then(()=>this.requestUpdate()),M5(this.hass).then(e=>{this._access=e.access}),this._ov===null&&!this._loading&&this._load())}async _load(){this._error="";let C=await B(this,{type:"maintenance_supporter/battery_fleet/overview"},{busy:e=>{this._loading=e},onError:e=>{this._error=e}});C!==void 0&&(this._ov=C)}async _act(C,e){return this._marking?!1:(this._error="",await B(this,C,{busy:H=>{this._marking=H},reload:async()=>{e?.(),await this._load()},onError:H=>{this._error=H}})!==void 0)}async _dispose(C,e){let t=parseFloat(this._disposeQty);!Number.isFinite(t)||t<=0||await this._act({type:"maintenance_supporter/part/dispose",entry_id:C,part_id:e,quantity:t})&&(this._disposeFor=null)}_renderDispose(C,e,t){return this._disposeFor!==e.part_id?i`<button class="bf-charged bf-dispose" title=${V("part_dispose_hint",t)} .disabled=${this._marking}
        @click=${()=>{this._disposeFor=e.part_id,this._disposeQty="1"}}><ha-icon icon="mdi:trash-can-outline"></ha-icon>${V("part_dispose",t)}</button>`:i`<input
        class="bf-dispose-qty"
        type="number"
        min="1"
        max=${String(e.restoring)}
        .value=${this._disposeQty}
        aria-label=${V("part_dispose_how_many",t)}
        title=${V("part_dispose_how_many",t)}
        @input=${H=>this._disposeQty=H.target.value}
        @keydown=${H=>{H.key==="Enter"&&this._dispose(C,e.part_id),H.key==="Escape"&&(this._disposeFor=null)}}
      /><button class="bf-charged bf-dispose confirm" title=${V("part_dispose_hint",t)} .disabled=${this._marking}
        @click=${()=>this._dispose(C,e.part_id)}><ha-icon icon="mdi:check"></ha-icon>${V("part_dispose",t)}</button
      ><button class="bf-charged bf-dispose" title=${V("cancel",t)} @click=${()=>this._disposeFor=null}
        ><ha-icon icon="mdi:close"></ha-icon
      ></button>`}_markOne(C,e){if(C.cell_choices&&C.cell_choices.length>1){this._choosing={entityId:C.entity_id,list:e,selected:C.cells_installed||C.cell_choices[0].type};return}this._mark([C.entity_id])}async _confirmCells(){let C=this._choosing;C&&(this._choosing=null,await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",entity_ids:[C.entityId],cells:{[C.entityId]:C.selected}}))}_renderCellChooser(C,e,t){let H=this._choosing;return!H||H.entityId!==C.entity_id||H.list!==e||!C.cell_choices?s:i`
      <div class="bf-cells" role="group" aria-label=${V("battery_fleet_cells_question",t)}>
        <div class="bf-cells-q">${V("battery_fleet_cells_question",t)}</div>
        ${C.cell_choices.map(L=>i`
          <label class="bf-cell-choice">
            <input type="radio" name=${`cells-${C.entity_id}`} .checked=${H.selected===L.type}
              @change=${()=>{this._choosing={...H,selected:L.type}}} />
            <span>${L.name}</span>
            ${L.rechargeable?i`<span class="bf-cell-tag">${V("battery_fleet_cells_rechargeable",t)}</span>`:s}
          </label>`)}
        <div class="bf-cells-actions">
          <button class="bf-cells-cancel" @click=${()=>{this._choosing=null}}>${V("cancel",t)}</button>
          <button class="bf-cells-ok" .disabled=${this._marking} @click=${()=>this._confirmCells()}>
            ${V("battery_fleet_mark_one",t)}
          </button>
        </div>
      </div>
    `}async _mark(C){await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",...C?{entity_ids:C}:{}})}async _setExcluded(C,e){await this._act({type:"maintenance_supporter/battery_fleet/set_excluded",entity_id:C,excluded:e})}async _addBattery(C){let e=C.detail?.value;e&&await this._act({type:"maintenance_supporter/battery_fleet/set_included",entity_id:e,included:!0})}async _setTrackSelf(C){await this._setFleetOption("set_track_self_charging",C.target)}async _setDueWithoutSensor(C){await this._setFleetOption("set_due_without_sensor",C.target)}async _setAskCells(C){await this._setFleetOption("set_ask_cells",C.target)}async _setFleetOption(C,e){let t=e.checked;await this._act({type:`maintenance_supporter/battery_fleet/${C}`,enabled:t})||(e.checked=!t)}_rosterOpen(){return X(P.batteryRosterOpen)!=="0"}_predictedTitle(C,e){if(C.forecast_overdue)return V("battery_fleet_forecast_overdue",e);let t=this._predictedDate(this._forecastDays(C)??0);if(C.predicted_source==="trend")return V("battery_fleet_predicted_trend",e).replace("{date}",t).replace("{confidence}",V("cal_confidence_"+(C.prediction_confidence||"medium"),e));if(C.lifetime_months!=null&&C.lifetime_source){let H=V("lifetime_source_"+C.lifetime_source,e).replace("{n}",String(C.lifetime_samples??0));return V("battery_fleet_predicted_typical",e).replace("{date}",t).replace("{months}",String(C.lifetime_months)).replace("{type}",C.battery_type).replace("{source}",H)}return V("battery_fleet_predicted_on",e).replace("{date}",t)}_sparkline(C){let e=this._history?.[C.entity_id];if(!e||e.points.length<2)return s;let t=110,H=24,L=2,o=e.points[0][0],M=e.points[e.points.length-1][0],l=Date.now()/1e3,n=C.status!=="low"&&C.predicted_source==="trend"&&C.days_until!=null?l+C.days_until*86400:null,p=Math.max(M,n??M),c=h=>p===o?L:L+(h-o)/(p-o)*(t-2*L),m=h=>L+(1-Math.min(100,Math.max(0,h))/100)*(H-2*L),g=e.points.map(([h,x])=>`${O(c(h))},${O(m(x))}`).join(" "),Z=e.points[e.points.length-1][1],v=O(m(e.threshold));return i`<svg
      class="bf-spark"
      viewBox="0 0 ${t} ${H}"
      role="img"
      aria-label=${V("battery_fleet_sparkline_hint",this._lang)}
    >
      <title>${V("battery_fleet_sparkline_hint",this._lang)}</title>
      <line class="bf-spark-th" x1="0" y1=${v} x2=${t} y2=${v}></line>
      <polyline class="bf-spark-line" points=${g}></polyline>
      ${n!==null?i`<line
            class="bf-spark-proj"
            x1=${O(c(M))}
            y1=${O(m(Z))}
            x2=${O(c(n))}
            y2=${v}
          ></line>`:s}
    </svg>`}static _storedSort(){return X(P.batteryRosterSort)==="name"?"name":"urgency"}_setSort(C){this._rosterSort=C,I(P.batteryRosterSort,C)}_sortedRoster(C){let e=this._typeFilter===null?C:C.filter(H=>H.battery_type===this._typeFilter);if(this._rosterSort==="name")return e;let t=H=>H.status==="low"?-1e3+(H.level??101)/101:H.days_until??1/0;return[...e].sort((H,L)=>t(H)-t(L)||H.device_name.localeCompare(L.device_name))}_predictedDate(C){return N(B1(d1(),C),this._lang)}_forecastDays(C){return C.forecast_days!==void 0?C.forecast_days:C.days_until}_fmtDate(C){return Number.isFinite(C)?N(new Date(C).toISOString(),this._lang):"\u2014"}_shoppingLine(C){return Object.entries(C).map(([e,t])=>i`<button
        class="bf-type-chip ${this._typeFilter===e?"bf-type-chip-active":""}"
        title=${V("battery_fleet_filter_type",this._lang)}
        @click=${()=>this._toggleTypeFilter(e)}
      >
        ${t}× ${e}
      </button>`)}_toggleTypeFilter(C){if(this._typeFilter=this._typeFilter===C?null:C,this._typeFilter!==null){let e=this.shadowRoot?.querySelector(".bf-roster");e instanceof HTMLDetailsElement?e.open||(e.open=!0):e&&!e.expanded&&(e.expanded=!0,this._loadHistory(!0))}}async _recordJump(C,e){await this._act({type:"maintenance_supporter/battery_fleet/record_replacement",entity_id:C,replaced_at:new Date(e.at*1e3).toISOString()},()=>{this._recorded=[...this._recorded,C]})}_levelTone(C,e){let t=e.low_threshold??20;return C<=t?"bad":C<=t+20?"warn":"good"}_levelBar(C){let e=C.level;return e==null?s:i`<span class="bf-bar" aria-hidden="true"
      ><span class="bf-bar-fill bf-bar-${this._levelTone(e,C)}" style="width: ${Math.min(100,Math.max(0,e))}%"></span
    ></span>`}_jumpButton(C,e){let t=this._history?.[C.entity_id]?.jump;return!t||this._recorded.includes(C.entity_id)?s:i`<button
      class="bf-mark bf-jump"
      title=${V("battery_fleet_record_replacement",e).replace("{date}",this._fmtDate(t.at*1e3))}
      .disabled=${this._marking}
      @click=${()=>this._recordJump(C.entity_id,t)}
    >
      <ha-icon icon="mdi:calendar-sync"></ha-icon>
    </button>`}_renderRow(C,e,t){let H=C.available===!1?i`<span class="bf-offline">${V("battery_fleet_offline",e)}</span>`:C.no_sensor?i`<span class="bf-offline bf-nosensor">${V("battery_fleet_no_sensor",e)}</span>`:s,L=`${C.quantity}\xD7 ${C.battery_type}`,o=i`<span class="bf-type" title=${L}>${L}</span>`,M=this._canWrite,l=M&&(t.mark==="always"||C.no_sensor||C.can_mark_replaced),n=this._forecastDays(C);return i`
      <div class="bf-row">
        <span class="bf-dev">${C.device_name}</span>
        ${t.status?i`<span class="bf-status bf-${C.status}"
                >${C.no_sensor&&C.status==="low"?V("battery_fleet_status_due",e):V("battery_fleet_status_"+C.status,e)}</span
              >${o}${H}`:i`${H}${o}`}
        ${t.recharge&&C.rechargeable?i`<span class="bf-recharge" title=${V("battery_fleet_rechargeable",e)}
              ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
            ></span>`:s}
        ${t.sparkline?this._sparkline(C):s}
        ${this._levelBar(C)}
        ${C.level!=null?i`<span class="bf-level bf-level-${this._levelTone(C.level,C)}">${C.level}%</span>`:s}
        ${l?i`<button
              class="bf-mark${t.mark==="replaced"?" bf-replaced":""}"
              title=${C.rechargeable?V("battery_fleet_mark_recharged",e):V("battery_fleet_mark_one",e)}
              .disabled=${this._marking}
              @click=${()=>this._markOne(C,t.list)}
            >
              <ha-icon icon="mdi:battery-sync"></ha-icon>
            </button>`:s}
        ${t.jump&&M?this._jumpButton(C,e):s}
        ${t.predicted&&n!=null?i`<span
              class="bf-predicted ${C.predicted_source==="trend"?"bf-trend":""} ${C.forecast_overdue?"bf-overdue":""} ${C.forecast_overdue&&C.status==="ok"?"bf-quiet":""}"
              title=${this._predictedTitle(C,e)}
              >${C.forecast_overdue?i`<ha-icon icon="mdi:calendar-alert"></ha-icon>`:s}~${this._predictedDate(n)}</span
            >`:s}
        ${t.exclude&&M?i`<button
              class="bf-mark bf-exclude"
              title=${V("battery_fleet_exclude",e)}
              .disabled=${this._marking}
              @click=${()=>this._setExcluded(C.entity_id,!0)}
            >
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>
            </button>`:s}
      </div>
      ${this._renderCellChooser(C,t.list,e)}
    `}render(){let C=this._lang;if(this._loading&&this._ov===null)return i`<div class="bf-card"><div class="bf-loading">…</div></div>`;let e=this._ov;if(!e)return this._error?i`<div class="bf-card"><div class="bf-error">${this._error}</div></div>`:s;let t=e.low.length;return i`
      <div class="bf-card">
        <div class="bf-head">
          <ha-icon icon="mdi:battery-alert"></ha-icon>
          <span class="bf-title">${V("battery_fleet_title",C)}</span>
          <span class="bf-count ${t?"bad":"ok"}">${t}</span>
        </div>
        ${this._error?i`<div class="bf-error">${this._error}</div>`:s}

        ${e.configured&&e.task_ok===!1?i`
              <div class="bf-repair">
                <span>${V("battery_fleet_trigger_lost",C)}</span>
                ${this._canWrite?i`<ha-button .disabled=${this._marking} @click=${this._repair}>
                      ${V("battery_fleet_repair",C)}
                    </ha-button>`:s}
              </div>
            `:s}

        ${t===0?i`<div class="bf-empty">${V("battery_fleet_none_low",C)}</div>`:i`
              <div class="bf-shopping">
                <span class="bf-label">${V("battery_fleet_buy_now",C)}</span>
                <span class="bf-list">${this._shoppingLine(e.needs_now)}</span>
              </div>
              <div class="bf-rows">
                ${e.low.map(H=>this._renderRow(H,C,{list:"low",recharge:!0,mark:"always",exclude:!0}))}
              </div>
              ${this._canWrite?i`<div class="bf-actions">
                    <ha-button .disabled=${this._marking} @click=${this._markAll}>
                      <ha-icon icon="mdi:battery-sync"></ha-icon> ${V("battery_fleet_mark_all",C)}
                    </ha-button>
                  </div>`:s}
            `}

        ${e.charging?.length?i`
              <div class="bf-charging">
                <span class="bf-label">${V("battery_fleet_charging",C)}</span>
                ${e.charging.map(H=>i`<span class="bf-charge-item">
                    <span class="bf-charge-name">${H.name}</span>
                    <span>${V("battery_fleet_ready",C).replace("{count}",U(H.stock,C))}</span>
                    ${H.restoring>0?i`<span class="bf-charge-waiting">${g5(H.reuse,H.restoring,C)}</span>
                          ${this._canWrite?i`<button
                                class="bf-charged"
                                title=${V("part_ready_again_hint",C)}
                                .disabled=${this._marking}
                                @click=${()=>this._act({type:"maintenance_supporter/part/ready_again",entry_id:e.entry_id,part_id:H.part_id})}
                              ><ha-icon icon="mdi:battery-charging-100"></ha-icon>${V(`part_reuse_${H.reuse}`,C)}</button>
                              ${this._renderDispose(e.entry_id,H,C)}`:s}`:s}
                  </span>`)}
              </div>
            `:s}
        ${e.soon.length?i`
              <div class="bf-soon">
                <span class="bf-label">${V("battery_fleet_soon",C)}</span>
                <span class="bf-list">${this._shoppingLine(e.needs_soon)}</span>
                <div class="bf-soon-hint">${V("battery_fleet_soon_hint",C)}</div>
              </div>
              <div class="bf-rows bf-soon-rows">
                ${e.soon.map(H=>this._renderRow(H,C,{list:"soon",mark:"replaced",predicted:!0}))}
              </div>
            `:s}
        ${e.all?.length?i`
              ${i5({cls:"bf-roster",open:this._rosterOpen(),onToggle:this._loadHistory,header:i`${V("battery_fleet_all",C)} (${e.all.length})`},i`
                <div class="bf-roster-tools">
                  <button
                    class="bf-sort ${this._rosterSort==="urgency"?"bf-sort-active":""}"
                    @click=${()=>this._setSort("urgency")}
                  >
                    ${V("battery_fleet_sort_urgency",C)}
                  </button>
                  <button
                    class="bf-sort ${this._rosterSort==="name"?"bf-sort-active":""}"
                    @click=${()=>this._setSort("name")}
                  >
                    ${V("battery_fleet_sort_name",C)}
                  </button>
                </div>
                <div class="bf-rows">
                  ${this._sortedRoster(e.all).map(H=>this._renderRow(H,C,{list:"roster",status:!0,recharge:!0,sparkline:!0,mark:"replaced",jump:!0,predicted:!0,exclude:!0}))}
                </div>
                <div class="bf-roster-hint">${V("battery_fleet_all_hint",C)}</div>
                ${this._canWrite?this._renderRosterSettings(e,C):s}
              `)}
            `:s}
        ${this._renderExcluded(e,C)}
        <div class="bf-total">${V("battery_fleet_total",C).replace("{n}",String(e.total))}</div>
      </div>
    `}_renderRosterSettings(C,e){return i`
                <div class="bf-add">
                  <span class="bf-label">${V("battery_fleet_add",e)}</span>
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{entity:{domain:["sensor","binary_sensor"]}}}
                    .value=${""}
                    @value-changed=${this._addBattery}
                  ></ha-selector>
                  <div class="bf-roster-hint">${V("battery_fleet_add_hint",e)}</div>
                </div>
                ${Y1({cls:"bf-track-self",checked:!!C.track_self_charging,disabled:this._marking,onChange:this._setTrackSelf},i`${V("battery_fleet_track_self",e)}`)}
                <div class="bf-roster-hint">${V("battery_fleet_track_self_hint",e)}</div>
                ${Y1({cls:"bf-track-self bf-due-nosensor",checked:C.due_without_sensor!==!1,disabled:this._marking,onChange:this._setDueWithoutSensor},i`${V("battery_fleet_due_without_sensor",e)}`)}
                <div class="bf-roster-hint">${V("battery_fleet_due_without_sensor_hint",e)}</div>
                ${Y1({cls:"bf-track-self bf-ask-cells",checked:!!C.ask_cells,disabled:this._marking,onChange:this._setAskCells},i`${V("battery_fleet_ask_cells",e)}`)}
                <div class="bf-roster-hint">${V("battery_fleet_ask_cells_hint",e)}</div>
    `}_renderExcluded(C,e){return i`
        ${C.excluded?.length?i`
              <div class="bf-excluded">
                <span class="bf-label">${V("battery_fleet_excluded",e)}</span>
                ${C.excluded.map(t=>i`
                    <span class="bf-excluded-chip">
                      ${t.device_name}
                      ${this._canWrite?i`<button
                            class="bf-mark"
                            title=${V("battery_fleet_include",e)}
                            .disabled=${this._marking}
                            @click=${()=>this._setExcluded(t.entity_id,!1)}
                          >
                            <ha-icon icon="mdi:eye-outline"></ha-icon>
                          </button>`:s}
                    </span>
                  `)}
              </div>
            `:s}
    `}};i1.styles=E`
    /* The query container of the row layout (see "In a narrow list" below):
     * the list's own width, not the screen's. */
    .bf-card {
      container: bf-fleet / inline-size;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color);
      border-radius: var(--ms-radius-10, 10px);
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
      border-radius: var(--ms-radius-10, 10px);
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
      border-radius: var(--ms-radius-10, 10px);
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
      border-radius: var(--ms-radius-6, 6px);
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
      border-radius: var(--ms-radius-10, 10px);
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
  `,d([b({attribute:!1})],i1.prototype,"hass",2),d([b({type:Boolean})],i1.prototype,"flat",2),d([A()],i1.prototype,"_ov",2),d([A()],i1.prototype,"_loading",2),d([A()],i1.prototype,"_marking",2),d([A()],i1.prototype,"_choosing",2),d([A()],i1.prototype,"_error",2),d([A()],i1.prototype,"_disposeFor",2),d([A()],i1.prototype,"_disposeQty",2),d([A()],i1.prototype,"_history",2),d([A()],i1.prototype,"_rosterSort",2),d([A()],i1.prototype,"_typeFilter",2),d([A()],i1.prototype,"_recorded",2),d([A()],i1.prototype,"_access",2);var L3=i1;customElements.get("maintenance-battery-fleet-section")||customElements.define("maintenance-battery-fleet-section",L3);var o7=5;function h4(r,a){let C=[];for(let e=0;e<a;e++)C.push(B1(r,e));return C}function g4(r){if(!r||r.length===0)return null;let a=r.map(C=>D1(C)).filter(C=>C!==null&&C>=0);return a.length===0?null:a.reduce((C,e)=>C+e,0)/a.length}function f4(r){let{windowStart:a,windowEnd:C,task:e,entryId:t,objectName:H}=r,L=[],o=(p,c)=>({date:p,entry_id:t,task_id:e.id,task_name:e.name,object_name:H,status:c&&Z2(e.status)?"ok":e.status,days_until_due:c?null:e.days_until_due??null,projected:c,schedule_type:e.schedule_type,interval_days:e.interval_days??null,interval_unit:e.interval_unit??null,responsible_user_id:e.responsible_user_id??null,avg_cost:g4(e.history),adaptive_enabled:!!e.adaptive_config?.enabled,prediction_confidence:e.threshold_prediction_confidence??null}),M=Math.max(1,Math.round(e3(e.interval_days,e.interval_unit)));if(Z2(e.status)){if(L.push(o(a,!1)),e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0){let p=B1(a,M),c=1;for(;p<=C&&c<o7;)L.push(o(p,!0)),c++,p=B1(p,M)}return L}let l=e.next_due;if(typeof l!="string"||!l)return L;let n=l.slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(n))return L;if(n>=a&&n<=C)L.push(o(n,!1));else if(n>C)return L;if(e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0){let p=B1(n,M),c=L.length;for(;p<=C&&c<o7;)p>=a&&(L.push(o(p,!0)),c++),p=B1(p,M)}return L}function M7(r,a,C,e=null){let t=h4(a,C),H=t[0],L=t[t.length-1],o=[];for(let l of r){let n=l.object?.name||"",p=l.entry_id,c=l.tasks||[];for(let m of c){if(e&&!R2(m,e)||m.enabled===!1)continue;let g=f4({windowStart:H,windowEnd:L,task:m,entryId:p,objectName:n});o.push(...g)}}let M=new Map;for(let l of t)M.set(l,[]);for(let l of o){let n=M.get(l.date);n&&n.push(l)}for(let[,l]of M)l.sort((n,p)=>{let c=q1(n.status),m=q1(p.status);if(c!==m)return c-m;if(n.projected!==p.projected)return n.projected?1:-1;let g=n.object_name.localeCompare(p.object_name);return g!==0?g:n.task_name.localeCompare(p.task_name)});return t.map(l=>({date:l,events:M.get(l)??[]}))}var _4={completed:"ok",reset:"ok",skipped:"due_soon",missed:"overdue",triggered:"triggered",trigger_replaced:"triggered",trigger_removed:"ok"};function _5(r,a){return`${r}/${a}`}function n7(r,a,C){let e=s7(a,C)[0],t=[];for(let H of r)for(let L of H.tasks||[]){let o=L.history||[],M=L.history_count??o.length;if(M<=o.length)continue;let l=o.map(c=>R5(c?.timestamp)).filter(c=>!!c),n=l.length?l.reduce((c,m)=>c<m?c:m):"";if(n&&n<e)continue;let p=_5(H.entry_id,L.id);t.push({entryId:H.entry_id,taskId:L.id,key:p,sig:`${p}:${M}:${Z4(JSON.stringify(o))}`})}return t}function Z4(r){let a=2166136261;for(let C=0;C<r.length;C++)a^=r.charCodeAt(C),a=Math.imul(a,16777619);return(a>>>0).toString(36)}function s7(r,a){let C=[];for(let e=a-1;e>=0;e--)C.push(B1(r,-e));return C}function l7(r,a,C,e=null,t={}){let H=s7(a,C),L=H[0],o=H[H.length-1],M=new Map;for(let n of H)M.set(n,[]);for(let n of r){let p=n.object?.name||"",c=n.entry_id,m=n.tasks||[];for(let g of m){if(e&&!R2(g,e))continue;let Z=t[_5(c,g.id)]??(g.history||[]);for(let v of Z){if(typeof v?.timestamp!="string")continue;let h=R5(v.timestamp);if(!h||h<L||h>o)continue;let x=M.get(h);if(!x)continue;let S=v.type??"completed";x.push({date:h,entry_id:c,task_id:g.id,task_name:g.name,object_name:p,status:_4[S]??"ok",days_until_due:null,projected:!1,schedule_type:g.schedule_type,interval_days:g.interval_days??null,responsible_user_id:g.responsible_user_id??null,avg_cost:D1(v),adaptive_enabled:!!g.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:v.timestamp,history_type:S,history_cost:D1(v),history_notes:typeof v.notes=="string"?v.notes:null,history_duration:typeof v.duration=="number"?v.duration:null})}}}let l={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4};for(let[,n]of M)n.sort((p,c)=>{let m=l[p.history_type??""]??99,g=l[c.history_type??""]??99;if(m!==g)return m-g;let Z=p.object_name.localeCompare(c.object_name);return Z!==0?Z:p.task_name.localeCompare(c.task_name)});return H.map(n=>({date:n,events:M.get(n)??[]}))}var d7=E`
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
    border-radius: var(--ms-radius-6, 6px);
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
`;function p7(r){let a=window;a.customCards=a.customCards||[],a.customCards.some(C=>C.type===r.type)||a.customCards.push(r)}function c7(r,a,C=e=>import(e)){let e=window,t;try{let n=new URL(a);t=n.origin+n.pathname}catch{return}let H=`__msCardHeal:${r[0]}:${t}`;if(e[H])return;e[H]=!0;let L=0,o=0,M=!1,l=()=>{if(L+=1,r.some(p=>!customElements.get(p))&&o<3&&!M){o+=1,M=!0;try{let p=new URL(a);p.searchParams.set("heal",`${Date.now()}`),C(p.href).catch(()=>{}).finally(()=>{M=!1})}catch{return}}L<20&&window.setTimeout(l,L<8?500:2e3)};window.setTimeout(l,250)}var x1=class extends D{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._objectFilter="";this._configuredObjects=[];this._unsub=null;this._pastHistory={};this._pastHistorySig="";this._pastSeq=0;this._dataLoaded=!1;this._lastConnection=null;this._onHistorySaved=C=>{let e=C.detail;!e?.entry_id||!e.task_id||!(_5(e.entry_id,e.task_id)in this._pastHistory)||(this._pastHistorySig="",this._loadPastHistories())};this._subGen=0}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(C){if(this._config={...C},this._windowDays=C.window_days&&[7,14,30,365].includes(C.window_days)?C.window_days:30,this._pastDays=C.past_days&&[30,90].includes(C.past_days)?C.past_days:0,this._userFilter=typeof C.user_filter=="string"?C.user_filter:"",typeof C.object_filter=="string")this._objectFilter=C.object_filter,this._configuredObjects=[];else if(Array.isArray(C.object_filter)){let e=C.object_filter.filter(t=>typeof t=="string"&&t!=="");this._objectFilter=e.length===1?e[0]:"",this._configuredObjects=e.length>1?e:[]}else this._objectFilter="",this._configuredObjects=[]}getCardSize(){return 6}get _lang(){return F(this.hass)}connectedCallback(){super.connectedCallback(),window.addEventListener("history-entry-saved",this._onHistorySaved)}disconnectedCallback(){if(super.disconnectedCallback(),this._subGen++,window.removeEventListener("history-entry-saved",this._onHistorySaved),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._dataLoaded=!1,this._lastConnection=null}updated(C){if(super.updated(C),a2(this,C),this.hass&&this._pastDays>0&&(C.has("_objects")||C.has("_pastDays"))&&this._loadPastHistories(),C.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[C,e]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=C.objects,this._stats=e,S2(this._stats.budget)}catch{}}async _loadPastHistories(){let C=n7(this._objects,d1(),this._pastDays||30),e=C.map(L=>L.sig).join("|");if(e===this._pastHistorySig)return;this._pastHistorySig=e;let t=++this._pastSeq,H=await Promise.all(C.map(async L=>{try{let o=await o5(this.hass,L.entryId,L.taskId);return o?[L.key,o]:null}catch{return null}}));t===this._pastSeq&&(this._pastHistory=Object.fromEntries(H.filter(L=>L!==null)))}async _subscribe(){let C=++this._subGen;try{let e=await this.hass.connection.subscribeMessage(t=>{let H=t;this._objects=H.objects},{type:"maintenance_supporter/subscribe"});if(!this.isConnected||C!==this._subGen){e();return}this._unsub=e}catch{}}_onEventClick(C){if(C.history_timestamp&&_3.includes(String(C.history_type||"completed"))){this._openHistoryEntry(C);return}this._openTask(C)}_openTask(C){let e=new CustomEvent("maintenance-supporter-open-task",{detail:{entry_id:C.entry_id,task_id:C.task_id},bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(e)&&(D0(C.entry_id,C.task_id)||this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:C.entry_id,task_id:C.task_id},bubbles:!0,composed:!0})))}async _openHistoryEntry(C){try{let e=await M5(this.hass);if(!A2(this.hass?.user,e.access)){this._openTask(C);return}}catch{}try{let e=await u0(this.hass,C.entry_id,C.task_id,C.history_timestamp);if(!e||E0(e))return}catch{}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:C.entry_id,task_id:C.task_id,original_timestamp:C.history_timestamp},bubbles:!0,composed:!0}))}render(){if(!this.hass)return s;let C=this._lang,e=this._config.show_window_chips!==!1,t=this._config.show_user_filter!==!1,H=this._config.title,L=null;this._userFilter&&(L=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let o=u=>{let T=u.toLowerCase();return this._objects.find(K=>K.entry_id===u||K.object.name.toLowerCase()===T)?.entry_id??null},M=new Set(this._configuredObjects.map(o).filter(u=>u!==null)),l=M.size?this._objects.filter(u=>M.has(u.entry_id)):this._objects,n=this._config.show_object_filter!==!1&&l.length>1,p=this._objectFilter?o(this._objectFilter):null,c=p&&l.some(u=>u.entry_id===p)?l.filter(u=>u.entry_id===p):l,m=d1(),g=this._pastDays>0,Z=g?l7(c,m,this._pastDays,L,this._pastHistory):M7(c,m,this._windowDays,L),v=this._windowDays===365||g,h=v?Z.filter(u=>u.events.length>0):Z,x=u=>{let T=`cal-status-${u.status}`,y=u.projected?"cal-event-projected":"",K=u.status==="overdue"&&u.days_until_due!=null?` (${O1(u.days_until_due,C)})`:"",k=u.projected&&u.interval_days?i`<span class="cal-event-recur">${u.interval_unit&&u.interval_unit!=="days"?T3(u.interval_days,u.interval_unit,C):u.interval_days===1?V("cal_every_day",C):V("cal_every_n_days",C).replace("{n}",String(u.interval_days))}</span>`:s,j=u.schedule_type==="sensor_based",W=j?i`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${V("cal_source_sensor",C)}" icon="mdi:trending-up"></ha-icon>`:i`<ha-icon class="cal-event-icon cal-source-time"
                title="${u.adaptive_enabled?V("cal_source_time_adaptive",C):V("cal_source_time",C)}"
                icon="${u.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,R=j&&u.prediction_confidence&&u.status!=="triggered"&&!u.projected?i`<span class="cal-event-prediction cal-conf-${u.prediction_confidence}">
            ${V("cal_predicted",C)} · ${V(`cal_confidence_${u.prediction_confidence}`,C)}
          </span>`:s,Y=G2(this._stats?.budget),J=u.history_type?V(u.history_type,C):V(u.status,C);return i`
        <div class="cal-event ${y}"
          @click=${()=>this._onEventClick(u)}>
          ${W}
          <span class="cal-status-pill ${T}">${J}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${u.object_name} · ${u.task_name}${K}</div>
            ${R}
            ${k}
          </div>
          ${u.avg_cost!=null&&u.avg_cost!==0?i`<span class="cal-event-cost">${Q(u.avg_cost,Y,C)}</span>`:s}
        </div>
      `},S=u=>{let[T,y,K]=u.date.split("-").map(Number),k=new Date(T,y-1,K),j=u.date===m,W=P3(k,C,"short"),R=B3(k,C,"long");return i`
        <div class="cal-day-row">
          <div class="cal-day-pill ${j?"cal-today":""}">
            <span class="cal-pill-weekday">${W}</span>
            <span class="cal-pill-day">${k.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${R}</span>
              ${j?i`<span class="cal-day-today-badge">${V("today",C)}</span>`:s}
            </div>
            ${u.events.length===0?i`<div class="cal-empty">${V("cal_no_events",C)}</div>`:u.events.map(x)}
          </div>
        </div>
      `};return i`
      <ha-card .header=${H}>
        ${e||t||n?i`
              <div class="cal-controls">
                ${e?i`
                      <div class="cal-window-chips cal-past-chips" title="${V("cal_past_windows",C)}">
                        ${[30,90].map(u=>i`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===u?"active":""}"
                            @click=${()=>{this._pastDays=u}}>
                            −${u}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${V("cal_forward_windows",C)}">
                        ${[7,14,30,365].map(u=>i`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===u?"active":""}"
                            @click=${()=>{this._windowDays=u,this._pastDays=0}}>
                            ${u===365?"+1y":`+${u}d`}
                          </button>
                        `)}
                      </div>
                    `:s}
                ${t?i`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${u=>{this._userFilter=u.target.value}}>
                        <option value="">${V("all_users",C)}</option>
                        <option value="current_user">${V("my_tasks",C)}</option>
                      </select>
                    `:s}
                ${n?i`
                      <select class="cal-user-filter"
                        .value=${p??""}
                        @change=${u=>{this._objectFilter=u.target.value}}>
                        <option value="">${V("all_objects",C)}</option>
                        ${[...l].sort((u,T)=>u.object.name.localeCompare(T.object.name)).map(u=>i`<option value=${u.entry_id} ?selected=${u.entry_id===p}>${u.object.name}</option>`)}
                      </select>
                    `:s}
              </div>
            `:s}
        <div class="cal-rolling">
          ${h.length===0&&v?i`<div class="cal-empty">${V("cal_no_events",C)}</div>`:h.map(S)}
        </div>
      </ha-card>
    `}};x1.styles=[M2,d7,E`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],d([b({attribute:!1})],x1.prototype,"hass",2),d([A()],x1.prototype,"_config",2),d([A()],x1.prototype,"_objects",2),d([A()],x1.prototype,"_stats",2),d([A()],x1.prototype,"_windowDays",2),d([A()],x1.prototype,"_pastDays",2),d([A()],x1.prototype,"_userFilter",2),d([A()],x1.prototype,"_objectFilter",2),d([A()],x1.prototype,"_unsub",2),d([A()],x1.prototype,"_pastHistory",2);var b4=[{value:7,key:"cal_editor_window_week"},{value:14,key:"cal_editor_window_fortnight"},{value:30,key:"cal_editor_window_month"},{value:365,key:"cal_editor_window_year"}],S4=[{value:30,key:"cal_editor_window_past_30"},{value:90,key:"cal_editor_window_past_90"}],x2=class extends D{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}get _lang(){return F(this.hass)}setConfig(C){this._config={...C}}updated(){let C=this._lang;C&&!b2(C)&&l1(C).then(()=>{b2(C)&&this.requestUpdate()})}_valueChanged(C,e){let t={...this._config,[C]:e};C==="show_window_chips"&&e===!0&&delete t.show_window_chips,C==="show_user_filter"&&e===!0&&delete t.show_user_filter,C==="show_object_filter"&&e===!0&&delete t.show_object_filter,C==="title"&&(!e||typeof e=="string"&&e.trim()==="")&&delete t.title,C==="user_filter"&&e===""&&delete t.user_filter,this._emit(t)}_windowChanged(C){let e={...this._config};C.startsWith("past-")?(e.past_days=Number(C.slice(5)),delete e.window_days):(e.window_days=Number(C),delete e.past_days),this._emit(e)}_emit(C){this._config=C,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:C},bubbles:!0,composed:!0}))}render(){let C=this._lang,e=this._config.past_days?`past-${this._config.past_days}`:`${this._config.window_days??30}`,t=this._config.show_window_chips!==!1,H=this._config.show_user_filter!==!1,L=this._config.user_filter??"",o=this._config.title??"";return i`
      <div class="editor">
        <div class="row">
          <label for="title">${V("card_title",C)}</label>
          <input
            id="title"
            type="text"
            .value=${o}
            @input=${M=>this._valueChanged("title",M.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">${V("cal_editor_window",C)}</label>
          <select
            id="window"
            @change=${M=>this._windowChanged(M.target.value)}
          >
            ${b4.map(M=>i`<option value="${M.value}" ?selected=${`${M.value}`===e}>${V(M.key,C)}</option>`)}
            ${S4.map(M=>i`<option value="past-${M.value}" ?selected=${`past-${M.value}`===e}>${V(M.key,C)}</option>`)}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">${V("cal_editor_show_chips",C)}</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${t}
            @change=${M=>this._valueChanged("show_window_chips",M.target.checked)}
          />
        </div>
        <div class="hint">${V("cal_editor_chips_hint",C)}</div>
        <div class="row toggle">
          <label for="userf">${V("cal_editor_show_user_filter",C)}</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${H}
            @change=${M=>this._valueChanged("show_user_filter",M.target.checked)}
          />
        </div>
        <div class="row">
          <label for="userv">${V("cal_editor_default_user",C)}</label>
          <select
            id="userv"
            @change=${M=>this._valueChanged("user_filter",M.target.value)}
          >
            <option value="" ?selected=${L===""}>${V("all_users",C)}</option>
            <option value="current_user" ?selected=${L==="current_user"}>
              ${V("cal_editor_my_tasks",C)}
            </option>
          </select>
        </div>
        <div class="row toggle">
          <label for="objf">${V("cal_editor_show_object_filter",C)}</label>
          <input
            id="objf"
            type="checkbox"
            .checked=${this._config.show_object_filter!==!1}
            @change=${M=>this._valueChanged("show_object_filter",M.target.checked)}
          />
        </div>
        <div class="hint">${V("cal_editor_object_hint",C)}</div>
      </div>
    `}};x2.styles=E`
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
  `,d([b({attribute:!1})],x2.prototype,"hass",2),d([A()],x2.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",x1);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",x2);c7(["maintenance-supporter-calendar-card"],import.meta.url);p7({type:"maintenance-supporter-calendar-card",name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});var g1=class extends D{constructor(){super(...arguments);this.objects=[];this._summary=null;this._loaded=!1;this._busy=!1;this._error="";this._query="";this._results=[];this._expanded=!1;this._initiallyLoaded=!1;this._searchTimer=0;this._searchSeq=0}get _lang(){return F(this.hass)}updated(C){super.updated(C),C.has("hass")&&this.hass&&!this._initiallyLoaded&&(this._initiallyLoaded=!0,this._load(),l1(this._lang).then(()=>this.requestUpdate()))}async _load(){let C=await B(this,{type:"maintenance_supporter/documents/storage"},{busy:e=>{this._busy=e},onError:e=>{this._error=e}});this._loaded=!0,C!==void 0&&(this._summary=C,this._error="")}_nameFor(C){return this.objects.find(t=>t.object?.id===C)?.object?.name||C.slice(0,8)}_entryFor(C){return this.objects.find(e=>e.object?.id===C)?.entry_id}_toggle(){this._expanded=!this._expanded}_openObject(C){this.dispatchEvent(new CustomEvent("open-object",{detail:{entry_id:C},bubbles:!0,composed:!0}))}_onSearch(C){this._query=C.target.value,clearTimeout(this._searchTimer),this._searchTimer=window.setTimeout(()=>{this._doSearch()},250)}async _doSearch(){let C=this._query.trim(),e=++this._searchSeq;if(!C){this._results=[];return}let t="",H=await B(this,{type:"maintenance_supporter/documents/search",query:C},{onError:L=>{t=L}});if(e===this._searchSeq){if(H===void 0){this._error=t,this._results=[];return}this._results=H?.results||[]}}async _openResult(C){if(C.kind==="weblink"){o1(C.url)&&window.open(C.url,"_blank","noopener");return}await B(this,()=>E1(this.hass,C.id),{onError:e=>{this._error=e}})}_renderResult(C,e){return i`
      <div class="obj-row result-row" title=${V("doc_open",e)} @click=${()=>this._openResult(C)}>
        <ha-icon icon=${C.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"}></ha-icon>
        <div class="result-info">
          <div class="result-title">${c1(C)}</div>
          <div class="result-obj">${C.object_name}</div>
        </div>
        <ha-icon class="result-open" icon=${C.kind==="weblink"?"mdi:open-in-new":"mdi:eye-outline"}></ha-icon>
      </div>
    `}render(){if(!this._loaded||!this._summary)return s;let C=this._summary;if(!C.document_count)return s;let e=this._lang,t=Object.entries(C.by_object??{}).filter(([,H])=>H.files>0||H.links>0).map(([H,L])=>({id:H,name:this._nameFor(H),entry:this._entryFor(H),...L})).sort((H,L)=>L.bytes-H.bytes);return i`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <button
              class="toggle"
              @click=${this._toggle}
              aria-expanded=${this._expanded?"true":"false"}
              aria-label=${V("doc_storage_title",e)}
            >
              <ha-icon class="chevron" icon=${this._expanded?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
              <span class="emoji">🗄️</span>
              <span class="title-text">${V("doc_storage_title",e)}</span>
              <span class="header-summary">
                ${$1(C.total_bytes,e)}
                ${C.dedup_savings_bytes>0?i`<span class="saved">−${$1(C.dedup_savings_bytes,e)}</span>`:s}
              </span>
            </button>
            <button
              class="icon-btn"
              title=${V("doc_storage_refresh",e)}
              ?disabled=${this._busy}
              @click=${this._load}
            >
              <ha-icon icon="mdi:refresh"></ha-icon>
            </button>
          </div>

          ${this._expanded?i`
                <div class="body">
                  <div class="totals">
                    <div class="stat">
                      <div class="stat-value">${$1(C.total_bytes,e)}</div>
                      <div class="stat-label">
                        <ha-icon icon="mdi:file-document-outline"></ha-icon> ${C.file_count}
                        <ha-icon icon="mdi:link-variant"></ha-icon> ${C.link_count}
                      </div>
                    </div>
                    ${C.dedup_savings_bytes>0?i`<div class="stat">
                          <div class="stat-value saved">−${$1(C.dedup_savings_bytes,e)}</div>
                          <div class="stat-label">${V("doc_storage_saved",e)}</div>
                        </div>`:s}
                  </div>

                  ${C.search_index&&C.search_index.total>0?i`<div class="index-status">
                        <ha-icon icon="mdi:text-search"></ha-icon>
                        ${V("search_index_status",e).replace("{indexed}",String(C.search_index.indexed)).replace("{total}",String(C.search_index.total)).replace("{no_text}",String(C.search_index.no_text+C.search_index.unsupported)).replace("{pending}",String(C.search_index.pending))}
                      </div>`:s}
                  <div class="doc-search">
                    <ha-icon icon="mdi:magnify"></ha-icon>
                    <input
                      type="search"
                      aria-label=${V("doc_search",e)}
                      placeholder=${V("doc_search",e)}
                      .value=${this._query}
                      @input=${this._onSearch}
                    />
                  </div>

                  ${this._error?m1("error",this._error):s}

                  ${this._query.trim()?this._results.length?i`<div class="obj-list">${this._results.map(H=>this._renderResult(H,e))}</div>`:i`<div class="search-empty">${V("doc_search_none",e)}</div>`:t.length?i`<div class="obj-list">${t.map(H=>this._renderObjRow(H,e))}</div>`:s}
                </div>
              `:s}
        </div>
      </ha-card>
    `}_renderObjRow(C,e){let t=C.entry;return i`
      <div
        class="obj-row ${t?"clickable":""}"
        role=${t?"button":s}
        tabindex=${t?"0":s}
        aria-label=${t?C.name:s}
        @click=${t?()=>this._openObject(t):void 0}
        @keydown=${t?H=>{(H.key==="Enter"||H.key===" ")&&(H.preventDefault(),this._openObject(t))}:void 0}
      >
        <span class="obj-name">${C.name}</span>
        <span class="obj-meta">
          ${C.files>0?i`<ha-icon icon="mdi:file-document-outline"></ha-icon>${C.files}`:s}
          ${C.links>0?i`<ha-icon icon="mdi:link-variant"></ha-icon>${C.links}`:s}
        </span>
        <span class="obj-size">${$1(C.bytes,e)}</span>
        ${t?i`<ha-icon class="obj-go" icon="mdi:chevron-right"></ha-icon>`:s}
      </div>
    `}};g1.styles=E`
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
    .toggle:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; border-radius: var(--ms-radius-6, 6px); }
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
      padding: 6px 8px; border-radius: var(--ms-radius-6, 6px);
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
  `,d([b({attribute:!1})],g1.prototype,"hass",2),d([b({attribute:!1})],g1.prototype,"objects",2),d([A()],g1.prototype,"_summary",2),d([A()],g1.prototype,"_loaded",2),d([A()],g1.prototype,"_busy",2),d([A()],g1.prototype,"_error",2),d([A()],g1.prototype,"_query",2),d([A()],g1.prototype,"_results",2),d([A()],g1.prototype,"_expanded",2);customElements.get("maintenance-storage-section-card")||customElements.define("maintenance-storage-section-card",g1);var y4=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"],S1=class extends D{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId="";this._values=new Array(12).fill("");this._save=async()=>{let C=this._buildOverrides();C!==null&&await this._send(C)!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved")))};this._clearAll=async()=>{await this._send({})!==void 0&&(this._values=new Array(12).fill(""),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved")))}}get _lang(){return F(this.hass)}open(C,e,t){if(this._entryId=C,this._taskId=e,this._values=new Array(12).fill(""),t)for(let[H,L]of Object.entries(t)){let o=parseInt(H,10);o>=1&&o<=12&&typeof L=="number"&&(this._values[o-1]=L.toString())}this._error="",this._open=!0}_close(){this._open=!1}_buildOverrides(){let C={};for(let e=0;e<12;e++){let t=this._values[e].trim();if(!t)continue;let H=parseFloat(t);if(Number.isNaN(H))return this._error=`${V("month_"+["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][e],this._lang)}: ${V("seasonal_override_invalid",this._lang)}`,null;if(H<T2[0]||H>T2[1])return this._error=V("seasonal_override_range",this._lang),null;C[e+1]=H}return C}_send(C){return this._error="",B(this,{type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:C},{busy:e=>{this._loading=e},fallbackKey:"save_error",onError:e=>{this._error=e}})}render(){if(!this._open)return i``;let C=this._lang;return i`
      <ha-dialog open .headerTitle=${J2(V("seasonal_overrides_title",C))} @closed=${this._close}>
        ${C5(V("seasonal_overrides_title",C))}
        <div class="content">
          <p class="hint">${V("seasonal_overrides_hint",C)}</p>
          ${this._error?m1("error",this._error):s}
          <div class="months">
            ${y4.map((e,t)=>i`
              <label class="month">
                <span class="mn">${V(e,C)}</span>
                <input type="number" step="0.1" min=${T2[0]} max=${T2[1]}
                  placeholder="1.0"
                  .value=${this._values[t]}
                  @input=${H=>{let L=[...this._values];L[t]=H.target.value,this._values=L}} />
              </label>
            `)}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._clearAll} .disabled=${this._loading}>
            ${V("clear_all",C)}
          </ha-button>
          <div class="spacer"></div>
          <ha-button appearance="plain" @click=${this._close}>
            ${V("cancel",C)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading}>
            ${this._loading?V("saving",C):V("save",C)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};S1.styles=E`
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
  `,d([b({attribute:!1})],S1.prototype,"hass",2),d([A()],S1.prototype,"_open",2),d([A()],S1.prototype,"_loading",2),d([A()],S1.prototype,"_error",2),d([A()],S1.prototype,"_entryId",2),d([A()],S1.prototype,"_taskId",2),d([A()],S1.prototype,"_values",2);customElements.get("maintenance-seasonal-overrides-dialog")||customElements.define("maintenance-seasonal-overrides-dialog",S1);var f1=class extends D{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._groupId=null;this._name="";this._description="";this._selected=new Set;this._toggleTask=(C,e)=>{let t=`${C}:${e}`,H=new Set(this._selected);H.has(t)?H.delete(t):H.add(t),this._selected=H};this._save=async()=>{let C=this._name.trim();if(!C){this._error=V("group_name_required",this._lang);return}this._error="";let e=this._buildTaskRefs();await B(this,this._groupId?{type:"maintenance_supporter/group/update",group_id:this._groupId,name:C,description:this._description,task_refs:e}:{type:"maintenance_supporter/group/create",name:C,description:this._description,task_refs:e},{busy:H=>{this._loading=H},fallbackKey:"save_error",onError:H=>{this._error=H}})!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("group-saved")))}}get _lang(){return F(this.hass)}openCreate(){this._reset(),this._open=!0}openEdit(C,e){this._reset(),this._groupId=C,this._name=e.name,this._description=e.description||"",this._selected=new Set(e.task_refs.map(t=>`${t.entry_id}:${t.task_id}`)),this._open=!0}_reset(){this._groupId=null,this._name="",this._description="",this._selected=new Set,this._error=""}_close(){this._open=!1}_buildTaskRefs(){return[...this._selected].map(C=>{let[e,t]=C.split(":",2);return{entry_id:e,task_id:t}})}render(){if(!this._open)return i``;let C=this._lang,e=this._groupId?V("edit_group",C):V("new_group",C);return i`
      <ha-dialog open .headerTitle=${J2(e)} @closed=${this._close}>
        ${C5(e)}
        <div class="content">
          ${this._error?m1("error",this._error):s}
          <ms-textfield
            label="${V("name",C)}"
            required
            .value=${this._name}
            @input=${t=>this._name=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${V("description_optional",C)}"
            .value=${this._description}
            @input=${t=>this._description=t.target.value}
          ></ms-textfield>

          <div class="section-title">${V("group_select_tasks",C)}</div>
          ${this.objects.length===0?i`<div class="hint">${V("no_objects",C)}</div>`:i`
              <div class="objects">
                ${[...this.objects].sort((t,H)=>t.object.name.localeCompare(H.object.name)).map(t=>i`
                  <div class="object-block">
                    <div class="object-name">${t.object.name}</div>
                    ${t.tasks.length===0?i`<div class="hint small">${V("no_tasks_short",C)}</div>`:[...t.tasks].sort((H,L)=>H.name.localeCompare(L.name)).map(H=>{let L=`${t.entry_id}:${H.id}`,o=this._selected.has(L);return i`
                          <label class="task-row">
                            <input type="checkbox"
                              .checked=${o}
                              @change=${()=>this._toggleTask(t.entry_id,H.id)} />
                            <span>${H.name}</span>
                          </label>
                        `})}
                  </div>
                `)}
              </div>
            `}
          <div class="selected-count">
            ${V("selected",C)}: ${this._selected.size}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${V("cancel",C)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading||!this._name.trim()}>
            ${this._loading?V("saving",C):V("save",C)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};f1.styles=E`
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
      border-radius: var(--ms-radius-6, 6px);
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
  `,d([b({attribute:!1})],f1.prototype,"hass",2),d([b({attribute:!1})],f1.prototype,"objects",2),d([A()],f1.prototype,"_open",2),d([A()],f1.prototype,"_loading",2),d([A()],f1.prototype,"_error",2),d([A()],f1.prototype,"_groupId",2),d([A()],f1.prototype,"_name",2),d([A()],f1.prototype,"_description",2),d([A()],f1.prototype,"_selected",2);customElements.get("maintenance-group-dialog")||customElements.define("maintenance-group-dialog",f1);var T1=class extends D{constructor(){super(...arguments);this._open=!1;this._busy=!1;this._error="";this._name="";this._views=[];this._filters=null;this._localeReady=!1;this._save=async()=>{let C=this._name.trim();if(!C||this._busy||!this._filters)return;let e=await this._runWs({type:"maintenance_supporter/views/save",name:C,filters:this._filters});e!==void 0&&(this._name="",this._emitChanged(e?.views||[]))};this._delete=async C=>{if(this._busy)return;let e=await this._runWs({type:"maintenance_supporter/views/delete",view_id:C});e!==void 0&&this._emitChanged(e?.views||[])}}get _lang(){return F(this.hass)}updated(C){C.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,l1(this._lang).then(()=>this.requestUpdate())),C.has("_open")&&this._open&&Z0(this.shadowRoot)}async open(C,e){this._open=!0,this._error="",this._name="",this._filters=C,this._views=e}_close(){this._open=!1}_emitChanged(C){this._views=C,this.dispatchEvent(new CustomEvent("saved-views-changed",{bubbles:!0,composed:!0,detail:{views:C}}))}_runWs(C){return this._error="",B(this,C,{busy:e=>{this._busy=e},onError:e=>{this._error=e}})}render(){if(!this._open)return i``;let C=this._lang;return _0(()=>this._close(),i`
        ${f0()?s:i`<div class="title">${V("views_dialog_title",C)}</div>`}
        <div class="hint">${V("views_dialog_hint",C)}</div>
        ${this._error?m1("error",this._error):s}

        <div class="save-row">
          <input
            class="name-input"
            type="text"
            .value=${this._name}
            placeholder=${V("views_name_placeholder",C)}
            aria-label=${V("views_name_placeholder",C)}
            maxlength="60"
            @input=${e=>this._name=e.target.value}
            @keydown=${e=>{e.key==="Enter"&&this._save()}}
          />
          <ha-button @click=${this._save} .disabled=${!this._name.trim()||this._busy}>
            ${V("views_save_current",C)}
          </ha-button>
        </div>

        ${this._views.length===0?i`<div class="empty">${V("views_none_yet",C)}</div>`:i`
              <div class="list dialog-scroll">
                ${this._views.map(e=>i`
                    <div class="row">
                      <span class="row-name">${e.name}</span>
                      <ha-icon-button
                        .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                        .label=${V("delete",C)}
                        @click=${()=>this._delete(e.id)}
                      ></ha-icon-button>
                    </div>
                  `)}
              </div>
            `}

        <div class="actions">
          <ha-button appearance="plain" @click=${this._close}>${V("close",C)}</ha-button>
        </div>
    `,{title:V("views_dialog_title",C)})}};T1.styles=[g0,E`
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
      border-radius: var(--ms-radius-6, 6px);
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
      border-radius: var(--ms-radius-6, 6px);
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
  `],d([b({attribute:!1})],T1.prototype,"hass",2),d([A()],T1.prototype,"_open",2),d([A()],T1.prototype,"_busy",2),d([A()],T1.prototype,"_error",2),d([A()],T1.prototype,"_name",2),d([A()],T1.prototype,"_views",2);customElements.get("maintenance-saved-views-dialog")||customElements.define("maintenance-saved-views-dialog",T1);var k4=60,w4=20,A7=30,O4={approaching:"\u2197",stable:"\u2192",easing:"\u2198"};function i3(r,a){let C=r.trigger_config,e=b1(C);if(!C||!e||r.battery_fleet_task)return null;let t,H=C.type||"threshold";if(H==="threshold")if(C.trigger_above!=null)t=1;else if(C.trigger_below!=null)t=-1;else return null;else if(H==="counter"||H==="runtime"||H==="state_change")t=1;else return null;let L=a.get(p2(e,j1(C)))||[],o=H==="runtime"||H==="state_change",M=L.length>=2?L.map(Z=>({ts:Z.ts,val:Z.val})):o?[]:(r.history||[]).filter(Z=>Z.trigger_value!=null).map(Z=>({ts:Z1(Z.timestamp),val:Z.trigger_value}));if(r.trigger_current_value!=null&&(M=[...M,{ts:Date.now(),val:r.trigger_current_value}]),M.length<2)return null;M.sort((Z,v)=>Z.ts-v.ts);let l=M.map(Z=>Z.val),n=Math.max(...l)-Math.min(...l),p=l[l.length-1]-l[0],c=C.trigger_delta_mode&&r.trigger_baseline_value!=null&&C.trigger_target_value!=null?r.trigger_baseline_value+C.trigger_target_value:C.trigger_target_value,m=H==="threshold"?C.trigger_above??C.trigger_below:H==="counter"?c:H==="runtime"?C.trigger_runtime_hours:C.trigger_target_changes,g=typeof m=="number"?Math.max(Math.abs(m-l[0]),n):n;return g===0||Math.abs(p)<g*(typeof m=="number"?.05:.15)?"stable":Math.sign(p)===t?"approaching":"easing"}function E2(r){return r>0?Math.ceil(r):Math.trunc(r)||0}function a3(r,a){let C=r.trigger_config??null;if(!C)return s;let e=C.type||"threshold",t=r.trigger_entity_info?.unit_of_measurement??"",H=0,L="",o="";if(e==="threshold"){let n=r.trigger_current_value??null;if(n==null)return s;let p=C.trigger_above,c=C.trigger_below;if(p!=null&&c!=null){let m=(p+c)/2,g=Math.abs(p-c)/2||1;H=Math.min(100,Math.max(0,Math.abs(n-m)/g*100));let Z=Math.abs(n-p)<=Math.abs(n-c)?p:c;L=`${u1(n,"",a?.lang)} / ${U(Z,a?.lang)}`,o=t}else if(p!=null){let m=r.trigger_entity_info?.min,g=p>0?0:m!=null&&m<p?m:p<0?2*p:-100,Z=p-g||1;H=Math.min(100,Math.max(0,(n-g)/Z*100)),L=`${u1(n,"",a?.lang)} / ${U(p,a?.lang)}`,o=t}else if(c!=null){let m=r.trigger_entity_info?.max,g=m!=null&&m>c?m:c>0?c*2:c<0?0:100,Z=g-c||1;H=Math.min(100,Math.max(0,(g-n)/Z*100)),L=`${u1(n,"",a?.lang)} / ${U(c,a?.lang)}`,o=t}else if(C.trigger_equals!=null||C.trigger_not_equals!=null){let m=C.trigger_equals!=null?`= ${C.trigger_equals}`:`\u2260 ${C.trigger_not_equals}`;L=`${u1(n,"",a?.lang)} (${m}${t?` ${t}`:""})`,H=r.trigger_active?100:0}else return s}else if(e==="counter"){let n=C.trigger_target_value||1,p;if(C.trigger_delta_mode?(p=r.trigger_current_delta??null,p==null&&r.trigger_baseline_value!=null&&r.trigger_current_value!=null&&(p=r.trigger_current_value-r.trigger_baseline_value)):p=r.trigger_current_value??null,p==null)return s;H=Math.min(100,Math.max(0,p/n*100)),L=`${u1(p,"",a?.lang)} / ${U(n,a?.lang)}`,o=t}else if(e==="state_change"){let n=C.trigger_target_changes||1,p=r.trigger_current_value??null;if(p==null)return s;H=Math.min(100,Math.max(0,p/n*100)),L=`${U(p,a?.lang,0)} / ${U(n,a?.lang,0)}`}else if(e==="runtime"){let n=C.trigger_runtime_hours||100,p=r.trigger_current_value??null;if(p==null)return s;H=Math.min(100,Math.max(0,p/n*100)),L=`${u1(p,"",a?.lang)}h / ${U(n,a?.lang)}h`}else if(e==="due_date"){let n=r.trigger_current_value??null;if(n==null)return s;let p=C.trigger_days_before??0;H=n<=p?100:Math.max(0,100-(n-p)/30*100),L=O1(E2(n),a?.lang)}else if(e==="compound"){let n=C.compound_logic||C.operator||"AND",p=C.conditions?.length||0;L=`${n} (${p})`,H=r.trigger_active?100:0}else return s;if(r.battery_fleet_task&&e==="threshold"&&r.trigger_current_value!=null){let n=Math.round(r.trigger_current_value),p=C.trigger_above??0;H=n>p?100:p>0?Math.max(0,n/(p+1)*100):0,L=V("battery_fleet_progress",a?.lang??"en").replace("{n}",U(n,a?.lang,0)),o=""}let M=H>=100,l=H>90?"var(--error-color, #f44336)":H>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return i`
    <div class="trigger-progress">
      <div class="trigger-progress-bar">
        <div class="trigger-progress-fill${M?" overflow":""}" style="width:${H}%;background:${l}"></div>
      </div>
      <span class="trigger-progress-label"><span class="trigger-progress-text"><span class="tp-num">${L}</span>${o?i` <span class="tp-unit">${o}</span>`:s}</span>${a?.trend?i`<i class="trend-arrow trend-${a.trend}" title="${V(`trend_${a.trend}`,a.lang??"en")}" aria-label="${V(`trend_${a.trend}`,a.lang??"en")}">${O4[a.trend]}</i>`:s}</span>
    </div>
  `}function o3(r,a,C){let e=b1(r.trigger_config);if(!e||r.battery_fleet_task)return s;let t=a.get(p2(e,j1(r.trigger_config)))||[],H=[];if(t.length>=2)H=t.map(u=>({ts:u.ts,val:u.val}));else{if(!r.history)return s;for(let u of r.history)u.trigger_value!=null&&H.push({ts:Z1(u.timestamp),val:u.trigger_value})}if(r.trigger_current_value!=null&&H.push({ts:Date.now(),val:r.trigger_current_value}),H.length<2)return s;H.sort((u,T)=>u.ts-T.ts);let L=k4,o=w4,M=H.map(u=>u.val),l=Math.min(...M),n=Math.max(...M),p=n-l||1;l-=p*.1,n+=p*.1;let c=H[0].ts,g=H[H.length-1].ts-c||1,Z=u=>(u-c)/g*L,v=u=>2+(1-(u-l)/(n-l))*(o-4),h=H;if(h.length>A7){let u=Math.ceil(h.length/A7);h=h.filter((T,y)=>y%u===0||y===h.length-1)}let x=h.map(u=>`${O(Z(u.ts))},${O(v(u.val))}`).join(" "),S=r.trigger_active?"var(--error-color, #f44336)":"var(--primary-color)";return i`
    <svg class="mini-sparkline" viewBox="0 0 ${L} ${o}" preserveAspectRatio="none" role="img" aria-label="${V("chart_mini_sparkline",C)}">
      <polyline points="${x}" fill="none" stroke="${S}" stroke-width="1.5" stroke-linejoin="round" />
    </svg>
  `}function M3(r,a,C="last-done"){let e=$3(r,a);return e?i`<span class="${C}" title="${V("last_performed",a)}: ${N(r,a)}">${e}</span>`:null}function n3(r,a,C,e="due-text"){return(r==null?M3(a,C,`${e} last-done`):null)??i`<span class="${e}">${O1(r,C)}</span>`}function m7(r,a){let C=a;if(r.days_until_due==null||!r.interval_days||r.interval_days<=0)return s;let{pct:e,overflow:t}=A5(r.interval_days,r.days_until_due,r.interval_unit),H="var(--success-color, #4caf50)";return r.status==="overdue"?H="var(--error-color, #f44336)":r.status==="due_soon"&&(H="var(--warning-color, #ff9800)"),i`
    <div class="days-progress">
      <div class="days-progress-labels">
        <span>${r.last_performed?`${V("last_performed",C)}: ${N(r.last_performed,C)}`:""}</span>
        <span>${r.next_due?`${V("next_due",C)}: ${N(r.next_due,C)}`:""}</span>
      </div>
      <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(e)}" aria-valuemin="0" aria-valuemax="100" aria-label="${V("days_progress",C)}">
        <div class="days-progress-fill${t?" overflow":""}" style="width:${e}%;background:${H}"></div>
      </div>
      <div class="days-progress-text">${O1(r.days_until_due,C)}</div>
    </div>
  `}var Z5=210,y1=46,N1=14,W1=12,u7=14,$4=20+u7,T4=[{days:7,key:"chart_range_7d"},{days:30,key:"chart_range_30d"},{days:90,key:"chart_range_90d"},{days:365,key:"chart_range_1y"}],H1=class extends D{constructor(){super(...arguments);this.points=[];this.events=[];this.unit="";this.lang="en";this.thresholdAbove=null;this.thresholdBelow=null;this.targetValue=null;this.targetMark="\u25C6";this.forceZero=!1;this.projection=null;this.rangeDays=30;this.showRange=!0;this.busy=!1;this.hideOutliers=!1;this.showOutlierToggle=!0;this._width=0;this._hover=null;this._ro=null}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(C=>{let e=Math.floor(C[0]?.contentRect?.width||0);e&&Math.abs(e-this._width)>2&&(this._width=e)}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=null}_emitRange(C){C!==this.rangeDays&&this.dispatchEvent(new CustomEvent("range-change",{detail:{days:C},bubbles:!0,composed:!0}))}_toggleOutliers(){this.dispatchEvent(new CustomEvent("outlier-toggle",{detail:{hide:!this.hideOutliers},bubbles:!0,composed:!0}))}render(){let C=this._width||320,e=[...this.points].sort((H,L)=>H.ts-L.ts),t=this.lang;return i`
      <div class="chart-wrap">
        ${this.showRange?i`<div class="range-chips" role="group">
              ${this.showOutlierToggle?i`<button
                    class="range-chip outlier-chip ${this.hideOutliers?"active":""}"
                    ?disabled=${this.busy}
                    title=${V("hide_outliers",t)}
                    @click=${()=>this._toggleOutliers()}
                  ><ha-icon icon="mdi:filter-variant"></ha-icon></button>`:s}
              ${T4.map(H=>i`<button
                  class="range-chip ${this.rangeDays===H.days?"active":""}"
                  ?disabled=${this.busy}
                  @click=${()=>this._emitRange(H.days)}
                >${V(H.key,t)}</button>`)}
            </div>`:s}
        ${e.length<2?i`<div class="chart-empty">
              <ha-icon icon="mdi:chart-line"></ha-icon> ${V("loading_chart",t)}
            </div>`:this._renderSvg(C,e)}
      </div>
    `}_renderSvg(C,e){let t=this.lang,H=C-y1-N1,L=Z5-$4,o=L-W1,M=1/0,l=-1/0;for(let w of e)M=Math.min(M,w.min??w.val),l=Math.max(l,w.max??w.val);this.thresholdAbove!=null&&(M=Math.min(M,this.thresholdAbove),l=Math.max(l,this.thresholdAbove)),this.thresholdBelow!=null&&(M=Math.min(M,this.thresholdBelow),l=Math.max(l,this.thresholdBelow)),this.targetValue!=null&&(M=Math.min(M,this.targetValue),l=Math.max(l,this.targetValue)),this.forceZero&&(M=Math.min(M,0));let n=(l-M||1)*.06,p=this.forceZero&&M>=0?0:M>=0?Math.max(0,M-n):M-n,{ticks:c,niceMin:m,niceMax:g}=P2(p,l+n,4);M>=0&&m<0&&(m=0,c=c.filter(w=>w>=0));let Z=c.length>1?c[1]-c[0]:0,v=e[0].ts,h=this.projection&&this.projection.length===2?this.projection[1].ts:null,x=h!=null?Math.max(e[e.length-1].ts,h):e[e.length-1].ts,S=x-v||1,u=w=>y1+(w-v)/S*H,T=w=>W1+(1-(w-m)/(g-m||1))*o,y=e.map(w=>`${O(u(w.ts))},${O(T(w.val))}`).join(" "),K=`M${O(u(e[0].ts))},${L} `+e.map(w=>`L${O(u(w.ts))},${O(T(w.val))}`).join(" ")+` L${O(u(e[e.length-1].ts))},${L} Z`,k="",j=e.filter(w=>w.min!=null&&w.max!=null);if(j.length>=2){let w=j.map(s1=>`${O(u(s1.ts))},${O(T(s1.max))}`),C1=[...j].reverse().map(s1=>`${O(u(s1.ts))},${O(T(s1.min))}`);k=`M${w[0]} `+w.slice(1).map(s1=>`L${s1}`).join(" ")+` L${C1.join(" L")} Z`}let W=[];if(this.thresholdBelow!=null){let w=T(this.thresholdBelow);W.push({y:w,h:Math.max(0,L-w),lineY:w,label:`\u25BC ${F1(this.thresholdBelow,t)}`,labelY:Math.min(L-4,w+13)})}if(this.thresholdAbove!=null){let w=T(this.thresholdAbove);W.push({y:W1,h:Math.max(0,w-W1),lineY:w,label:`\u25B2 ${F1(this.thresholdAbove,t)}`,labelY:Math.max(W1+11,w-5)})}let R=e[e.length-1],Y=(this.events||[]).filter(w=>w.ts>=v&&w.ts<=x),J=s5(v,x,Math.max(2,Math.min(5,Math.floor(H/110)+1))),e1=this._hover;return i`
      <div class="svg-holder">
        <svg
          class="chart-svg"
          viewBox="0 0 ${C} ${Z5}"
          width=${C}
          height=${Z5}
          role="img"
          aria-label=${V("chart_sparkline",t)}
          @pointermove=${w=>this._onPointer(w,e,u,T,C)}
          @pointerdown=${w=>this._onPointer(w,e,u,T,C)}
          @pointerleave=${()=>this._hover=null}
        >
          <defs>
            <clipPath id="plot"><rect x="${y1}" y="${W1}" width="${H}" height="${o}" /></clipPath>
            ${W.length?q`<clipPath id="danger">${W.map(w=>q`<rect x="${y1}" y="${O(w.y)}" width="${H}" height="${O(w.h)}" />`)}</clipPath>`:s}
            <!-- Diagonal hatch so the danger zone reads without relying on the
                 red tint alone (dark-theme contrast + colour-blind support). -->
            <pattern id="dangerHatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
              <rect width="7" height="7" fill="var(--error-color, #f44336)" opacity="0.10" />
              <line x1="0" y1="0" x2="0" y2="7" stroke="var(--error-color, #f44336)" stroke-width="1.4" opacity="0.5" />
            </pattern>
          </defs>

          ${c.map(w=>{let C1=T(w);return C1<W1-1||C1>L+1?s:q`
              <line x1="${y1}" y1="${O(C1)}" x2="${C-N1}" y2="${O(C1)}"
                stroke="var(--divider-color)" stroke-width="1" opacity="0.6" />
              <text x="${y1-7}" y="${O(C1+3.5)}" text-anchor="end" class="tick-label">${c0(w,Z,t)}</text>`})}

          ${W.map(w=>q`<rect x="${y1}" y="${O(w.y)}" width="${H}" height="${O(w.h)}"
              fill="url(#dangerHatch)" />`)}

          ${k?q`<path d="${k}" fill="var(--primary-color)" opacity="0.08" clip-path="url(#plot)" />`:s}
          <path d="${K}" fill="var(--primary-color)" opacity="0.10" clip-path="url(#plot)" />
          <polyline points="${y}" fill="none" stroke="var(--primary-color)" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" clip-path="url(#plot)" />
          ${W.length?q`<polyline points="${y}" fill="none" stroke="var(--error-color, #f44336)" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" clip-path="url(#danger)" />`:s}

          ${W.map(w=>q`
              <line x1="${y1}" y1="${O(w.lineY)}" x2="${C-N1}" y2="${O(w.lineY)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${C-N1-4}" y="${O(w.labelY)}" text-anchor="end" class="zone-label">${w.label}</text>`)}

          ${this.targetValue!=null?q`<line x1="${y1}" y1="${O(T(this.targetValue))}" x2="${C-N1}" y2="${O(T(this.targetValue))}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${C-N1-4}" y="${O(T(this.targetValue)-5)}" text-anchor="end" class="zone-label">${this.targetMark} ${F1(this.targetValue,t)} ${this.unit}</text>`:s}

          ${this.projection&&this.projection.length===2?q`<line x1="${O(u(this.projection[0].ts))}" y1="${O(T(this.projection[0].val))}"
                x2="${O(Math.min(u(this.projection[1].ts),C-N1))}" y2="${O(T(Math.max(m,Math.min(g,this.projection[1].val))))}"
                stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.8" />`:s}

          ${J.map((w,C1)=>{let s1=u(w),C2=C1===0?"start":C1===J.length-1?"end":"middle",a1=W5(w,t,v,x);return C1>0&&a1===W5(J[C1-1],t,v,x)?s:q`<text x="${O(s1)}" y="${Z5-5}" text-anchor="${C2}" class="tick-label">${a1}</text>`})}

          <line x1="${y1}" y1="${L}" x2="${C-N1}" y2="${L}" stroke="var(--divider-color)" stroke-width="1" />

          ${Y.map(w=>{let C1=u(w.ts),s1=w.type==="completed"?"var(--success-color, #4caf50)":w.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return q`
              <line x1="${O(C1)}" y1="${W1}" x2="${O(C1)}" y2="${L}" stroke="${s1}" stroke-width="1" opacity="0.14" />
              <rect x="${O(C1-1.5)}" y="${L+3}" width="3" height="${u7-6}" rx="1.5" fill="${s1}">
                <title>${U5(w.ts,t)}</title>
              </rect>`})}

          ${e1?q`
                <line x1="${O(e1.x)}" y1="${W1}" x2="${O(e1.x)}" y2="${L}"
                  stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.7" />
                <circle cx="${O(e1.x)}" cy="${O(e1.y)}" r="4.5" fill="var(--primary-color)"
                  stroke="var(--card-background-color, #fff)" stroke-width="2" />`:q`<circle cx="${O(u(R.ts))}" cy="${O(T(R.val))}" r="4" fill="var(--primary-color)"
                stroke="var(--card-background-color, #fff)" stroke-width="1.5" />`}
        </svg>
        ${e1?i`<div
              class="hover-chip"
              style="left:${Math.min(Math.max(e1.x,70),C-70)}px"
            >
              <div class="hover-date">${U5(e1.p.ts,t)}</div>
              <div class="hover-val">
                ${u1(e1.p.val,this.unit,t)}
                ${e1.p.min!=null&&e1.p.max!=null?i`<span class="hover-range">(${F1(e1.p.min,t)}–${F1(e1.p.max,t)})</span>`:s}
              </div>
            </div>`:s}
      </div>
    `}_onPointer(C,e,t,H,L){let M=C.currentTarget.getBoundingClientRect(),l=(C.clientX-M.left)/M.width*L;if(l<y1-8||l>L-N1+8){this._hover=null;return}let n=e[0],p=1/0;for(let c of e){let m=Math.abs(t(c.ts)-l);m<p&&(p=m,n=c)}this._hover={x:t(n.ts),y:H(n.val),p:n}}};H1.styles=E`
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
  `,d([b({attribute:!1})],H1.prototype,"points",2),d([b({attribute:!1})],H1.prototype,"events",2),d([b()],H1.prototype,"unit",2),d([b()],H1.prototype,"lang",2),d([b({attribute:!1})],H1.prototype,"thresholdAbove",2),d([b({attribute:!1})],H1.prototype,"thresholdBelow",2),d([b({attribute:!1})],H1.prototype,"targetValue",2),d([b()],H1.prototype,"targetMark",2),d([b({type:Boolean})],H1.prototype,"forceZero",2),d([b({attribute:!1})],H1.prototype,"projection",2),d([b({attribute:!1})],H1.prototype,"rangeDays",2),d([b({type:Boolean})],H1.prototype,"showRange",2),d([b({type:Boolean})],H1.prototype,"busy",2),d([b({type:Boolean})],H1.prototype,"hideOutliers",2),d([b({type:Boolean})],H1.prototype,"showOutlierToggle",2),d([A()],H1.prototype,"_width",2),d([A()],H1.prototype,"_hover",2);customElements.get("maintenance-trigger-chart")||customElements.define("maintenance-trigger-chart",H1);function v7(r){let a=(r??"").trim().toLowerCase();return a==="on"||a==="open"||a==="true"?1:a==="off"||a==="closed"||a==="false"?0:null}function P4(r,a,C){if(r.length<2)return null;let e=C.now??Date.now(),t=Math.max(0,a.trigger_for_minutes??0)*6e4,H=a.trigger_from_state?v7(a.trigger_from_state):null,L=a.trigger_to_state?v7(a.trigger_to_state):null;if(a.trigger_from_state&&H===null||a.trigger_to_state&&L===null)return null;let o=[...r].sort((x,S)=>x.ts-S.ts),M=[];for(let x of o){let S=M[M.length-1];(!S||S.level!==x.val)&&M.push({start:x.ts,level:x.val})}let l=x=>(x+1<M.length?M[x+1].start:e)-M[x].start>=t,n=(x,S,u)=>{let T=x[x.length-1];T&&T.val!==u&&x.push({ts:S,val:T.val}),x.push({ts:S,val:u})};if((a.trigger_target_changes??1)===1&&L!==null){let x=[];M.forEach((u,T)=>n(x,u.start,u.level===L&&l(T)?1:0));let S=x[x.length-1]?.val??0;return x.push({ts:e,val:S}),{points:x,mode:"alarm"}}let c=C.since??M[0].start,m=0,g=[];for(let x=1;x<M.length;x++){let S=M[x-1],u=M[x];H!==null&&S.level!==H||L!==null&&u.level!==L||!l(x)||u.start<c||(m+=1,g.push(u.start))}let Z=Math.max(0,(C.current??m)-m),v=[{ts:Math.max(c,M[0].start),val:Z}],h=Z;for(let x of g)h+=1,n(v,x,h);return v.push({ts:e,val:h}),{points:v,mode:"count"}}function B4(r){if(r.length<4)return r;let a=r.map(l=>l.val).sort((l,n)=>l-n),C=l=>{let n=(a.length-1)*l,p=Math.floor(n),c=Math.ceil(n);return a[p]+(a[c]-a[p])*(n-p)},e=C(.25),t=C(.75),H=t-e;if(H===0)return r;let L=e-1.5*H,o=t+1.5*H,M=r.filter(l=>l.val>=L&&l.val<=o);return M.length>=2?M:r}function x7(r,a){let C=r.trigger_config;if(!C)return s;if(M1())return F4(r,a);let e=a.lang,t=r.trigger_entity_info,H=r.trigger_entity_infos,L=b1(C)||"",o=t?.friendly_name||L||"\u2014",M=$2(C),l=t?.unit_of_measurement||"",n=r.trigger_current_value,p=C.type||"threshold",c=M.length>1,m=h7(r,l,a);return i`
    <h3>${V("trigger",e)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${c?i`
            <div class="trigger-entity-name">${M.length} ${V("entities",e)} (${C.entity_logic||"any"})</div>
            <div class="trigger-entity-id">${M.map((g,Z)=>i`${Z>0?", ":""}<span class="entity-link" @click=${v=>o2(v,g)}>${g}</span>`)}${C.attribute?` \u2192 ${C.attribute}`:""}</div>
          `:i`
            <div class="trigger-entity-name">${o}</div>
            <div class="trigger-entity-id">${L?i`<span class="entity-link" @click=${g=>o2(g,L)}>${L}</span>`:""}${C.attribute?` \u2192 ${C.attribute}`:""}</div>
          `}
        </div>
        <span class="status-badge ${r.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
          ${r.trigger_active?V("triggered",e):V("ok",e)}
        </span>
      </div>

      ${m?f7(m,e):n!=null?i`
              <div class="trigger-value-row">
                <span class="trigger-current ${r.trigger_active?"active":""}">${p==="due_date"&&typeof n=="number"?O1(E2(n),e):typeof n=="number"?u1(n,"",e):n}</span>
                ${l?i`<span class="trigger-unit">${l}</span>`:s}
              </div>
            `:s}

      <div class="trigger-limits">
        ${p==="threshold"?i`
          ${C.trigger_above!=null?i`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${V("threshold_above",e)}: ${C.trigger_above} ${l}</span>`:s}
          ${C.trigger_below!=null?i`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${V("threshold_below",e)}: ${C.trigger_below} ${l}</span>`:s}
          ${C.trigger_equals!=null?i`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> = ${C.trigger_equals} ${l}</span>`:s}
          ${C.trigger_not_equals!=null?i`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ≠ ${C.trigger_not_equals} ${l}</span>`:s}
          ${C.trigger_for_minutes?i`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${V("for_minutes",e)}: ${C.trigger_for_minutes}</span>`:s}
        `:s}
        ${p==="state_change"?i`
          ${C.trigger_target_changes!=null?i`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${V("target_changes",e)}: ${C.trigger_target_changes}</span>`:s}
        `:s}
        ${p==="runtime"?i`
          ${C.trigger_runtime_hours!=null?i`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${V("runtime_hours",e)}: ${C.trigger_runtime_hours}h</span>`:s}
        `:s}
        ${p==="due_date"?i`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${V("days_before",e)}: ${C.trigger_days_before??0}</span>
        `:s}
        ${p==="compound"?i`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${V("compound_logic",e)}: ${C.compound_logic||C.operator||"AND"}</span>
          ${(C.conditions||[]).map((g,Z)=>i`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${Z+1}. ${V(g.type==="due_date"?"trigger_type_due_date":g.type||"unknown",e)}: ${$2(g).map((v,h)=>i`${h>0?", ":""}<span class="entity-link" @click=${x=>o2(x,v)}>${v}</span>`)}</span>
          `)}
        `:s}
      </div>

      ${H&&H.length>1?i`
        <div class="trigger-entity-list">
          ${H.map(g=>i`
            <span class="trigger-entity-id">${g.friendly_name} (<span class="entity-link" @click=${Z=>o2(Z,g.entity_id)}>${g.entity_id}</span>)</span>
          `)}
        </div>
      `:s}

      ${Z7(r,l,a)}
    </div>
  `}function R4(r,a){r.preventDefault(),history.pushState(null,"",`/history?entity_id=${a.map(encodeURIComponent).join(",")}`),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}var b5=88,h2=28,E4=48;function D4(r,a,C=null){if(!r||r.length<2)return s;let e=C!==null&&Number.isFinite(C)&&r[r.length-1].ts<Date.now()?[...r,{ts:Date.now(),val:C}]:r,t=Math.max(1,Math.ceil(e.length/E4)),H=[];for(let u=0;u<e.length;u+=t)H.push(e[u]);H[H.length-1]!==e[e.length-1]&&H.push(e[e.length-1]);let L=(a.type||"threshold")==="threshold"?[a.trigger_above,a.trigger_below].filter(u=>typeof u=="number"):[],o=H.map(u=>u.val),M=Math.min(...o),l=Math.max(...o),n=l-M||Math.abs(l)||1,p=L.filter(u=>u>=M-2*n&&u<=l+2*n);for(let u of p)M=Math.min(M,u),l=Math.max(l,u);let c=l-M||1,m=H[0].ts,g=H[H.length-1].ts,Z=u=>g===m?0:(u-m)/(g-m)*(b5-2)+1,v=u=>h2-2-(u-M)/c*(h2-4),h=H.map((u,T)=>`${T?"L":"M"}${O(Z(u.ts))},${O(v(u.val))}`).join(" "),x=H[H.length-1].val,S=a.trigger_above!=null&&x>a.trigger_above||a.trigger_below!=null&&x<a.trigger_below;return i`<svg class="sensor-trend ${S?"past":""}" viewBox="0 0 ${b5} ${h2}" width=${b5} height=${h2}
    preserveAspectRatio="none" aria-hidden="true">
    ${p.map(u=>q`<line class="sensor-trend-limit" x1="0" x2=${b5} y1=${O(v(u))} y2=${O(v(u))}></line>`)}
    <path class="sensor-trend-area" d=${`${h} L${O(Z(g))},${h2} L${O(Z(m))},${h2} Z`}></path>
    <path class="sensor-trend-line" d=${h}></path>
  </svg>`}function j4(r,a,C){let e=a.lang,t=a.hass,H=t?.states?.[r.entityId],L=(C.trigger_entity_infos||[]).find(c=>c.entity_id===r.entityId)??(C.trigger_entity_info?.entity_id===r.entityId?C.trigger_entity_info:void 0),o=H?.attributes?.unit_of_measurement??L?.unit_of_measurement??"",M=H?.attributes?.friendly_name||L?.friendly_name||r.entityId,l=t,n="\u2014";H&&(r.cond.attribute?n=l?.formatEntityAttributeValue?.(H,r.cond.attribute)??String(H.attributes?.[r.cond.attribute]??"\u2014"):n=l?.formatEntityState?.(H)??`${H.state}${o?` ${o}`:""}`);let p=c=>o2(c,r.entityId);return i`
    <div class="sensor-row" role="button" tabindex="0" data-entity=${r.entityId} title=${M}
      @click=${p}
      @keydown=${c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),p(c))}}>
      ${H&&customElements.get("state-badge")?i`<state-badge class="sensor-badge" .hass=${t} .stateObj=${H} stateColor></state-badge>`:i`<ha-icon class="sensor-badge" icon=${H?.attributes?.icon||"mdi:eye"}></ha-icon>`}
      <div class="sensor-info">
        <div class="sensor-name">${M}</div>
        <div class="sensor-cond">${d5(r.cond,o,e)}</div>
      </div>
      ${D4(a.detailStatsData.get(r.entityId),r.cond,H?parseFloat(String(r.cond.attribute?H.attributes?.[r.cond.attribute]:H.state)):null)}
      <div class="sensor-state">${n}</div>
    </div>
  `}function F4(r,a){let C=r.trigger_config,e=a.lang,t=d2(C),H=[...new Set(t.map(p=>p.entityId))],L=K1(a.hass,r),o=h7(r,L,a),M=C.type==="compound"?(C.conditions||[]).length:H.length,l=C.type==="compound"?(C.compound_logic||"AND")==="AND":C.entity_logic==="all",n=M>1?V(l?"beta_rules_all_of":"beta_rules_any_of",e).split("{n}").join(String(M)):"";return i`
    <div class="trigger-card sensor-rule">
      <div class="sensor-rule-head">
        <div class="sensor-rule-title">
          <span>${V("beta_sensor_rule",e)}</span>
          ${n?i`<span class="sensor-rule-sub">${n}</span>`:s}
        </div>
        <span class="status-badge ${r.trigger_active?"triggered":"ok"}">
          ${r.trigger_active?V("triggered",e):V("ok",e)}
        </span>
      </div>
      <div class="sensor-rows">${t.map(p=>j4(p,a,r))}</div>
      ${o?f7(o,e):s}
      ${Z7(r,L,a)}
      ${H.length?i`<div class="sensor-rule-foot">
            <a class="sensor-rule-more" href=${`/history?entity_id=${H.map(encodeURIComponent).join(",")}`}
              @click=${p=>R4(p,H)}>${V("beta_show_history",e)}</a>
          </div>`:s}
    </div>
  `}function h7(r,a,C){let e=r.trigger_config,t=r.trigger_current_value;if(!e||t==null)return null;switch(e.type||"threshold"){case"counter":{let H=e.trigger_target_value;if(H==null||H<=0)return null;if(!e.trigger_delta_mode)return{progress:Math.max(0,t),target:H,unit:a,meter:null};let L=g7(r,_7(r,C));return{progress:Math.max(0,t-(L?.value??t)),target:H,unit:a,meter:t}}case"state_change":{let H=e.trigger_target_changes;return H==null||H<=0?null:{progress:Math.max(0,t),target:H,unit:"",meter:null}}case"runtime":{let H=e.trigger_runtime_hours;return H==null||H<=0?null:{progress:Math.max(0,t),target:H,unit:"h",meter:null}}}return null}function g7(r,a){if(r.trigger_baseline_value!=null)return{value:r.trigger_baseline_value,ts:S5(r)};if(!a.length)return null;let C=S5(r);if(C==null)return{value:a[0].val,ts:null};let e=a[0],t=Math.abs(a[0].ts-C);for(let H of a){let L=Math.abs(H.ts-C);L<t&&(e=H,t=L)}return{value:e.val,ts:C}}function S5(r){let a=[...r.history].filter(C=>C.type==="completed"||C.type==="reset").sort((C,e)=>Z1(e.timestamp)-Z1(C.timestamp))[0];return a?Z1(a.timestamp):null}function f7(r,a){let C=Math.min(999,Math.round(r.progress/r.target*100)),e=C>=100?"over":C>=75?"near":"ok";return i`
    <div class="counter-progress">
      <div class="counter-progress-nums">
        <span class="counter-progress-main">${u1(r.progress,"",a)}<span class="counter-progress-target"> / ${u1(r.target,r.unit,a)}</span></span>
        <span class="counter-progress-pct ${e}">${C} %</span>
      </div>
      <div class="counter-progress-bar" role="progressbar" aria-valuenow=${C} aria-valuemin="0" aria-valuemax="100">
        <div class="counter-progress-fill ${e}" style="width:${Math.min(100,C)}%"></div>
      </div>
      <div class="counter-progress-caption">
        ${V("chart_since_service",a)}${r.meter!=null?i` · ${V("current",a)}: ${u1(r.meter,r.unit,a)}`:s}
      </div>
    </div>
  `}function _7(r,a){let C=r.trigger_config;if(!C)return[];let e=C.type||"threshold",t=b1(C)||"",H=e==="runtime"?[]:a.detailStatsData.get(t)||[],L=a.isCounterEntity(C),o=[];if(H.length>=2)for(let l of H){let n={ts:l.ts,val:l.val};!L&&l.min!=null&&l.max!=null&&(n.min=l.min,n.max=l.max),o.push(n)}else for(let l of r.history)l.trigger_value!=null&&o.push({ts:Z1(l.timestamp),val:l.trigger_value});let M=!!t&&!!a.historyFallbackIds?.has(t)&&H.length>=2;return r.trigger_current_value!=null&&!M&&o.push({ts:Date.now(),val:r.trigger_current_value}),o.sort((l,n)=>l.ts-n.ts),o}function Z7(r,a,C){let e=r.trigger_config;if(!e)return s;let t=e.type||"threshold",H=b1(e)||"";if(t==="due_date")return s;let L=_7(r,C),o=null;t==="state_change"&&H&&C.historyFallbackIds?.has(H)&&(o=P4(L,e,{since:S5(r),current:r.trigger_current_value??null}),o&&(L=o.points)),t==="runtime"&&e.trigger_runtime_hours&&r.trigger_current_value!=null&&(L=[{ts:S5(r)??L[0]?.ts??Date.now()-864e5,val:0},{ts:Date.now(),val:Math.max(0,r.trigger_current_value)}]),C.hideOutliers&&(L=B4(L));let M=L.length<2&&!!H&&C.hasStatsService&&!C.detailStatsData.has(H);if(L.length<2&&!M)return s;let l=!!H&&C.detailStatsData.has(H)&&(C.detailStatsData.get(H)?.length??0)<2;if(M1()&&t==="state_change"&&l&&!(H&&C.historyFallbackIds?.has(H)))return s;let n=Date.now()-C.rangeDays*864e5,p=L.filter(S=>S.ts>=n);p.length>=2&&(L=p);let c=null,m="\u25C6",g=!1;if(t==="threshold"&&e.trigger_above==null&&e.trigger_below==null&&(e.trigger_equals!=null||e.trigger_not_equals!=null))c=e.trigger_equals??e.trigger_not_equals??null,m=e.trigger_equals!=null?"=":"\u2260";else if(t==="counter"&&e.trigger_target_value!=null&&L.length){if(e.trigger_delta_mode){let S=g7(r,L);if(S){if(S.ts!=null){let u=L.filter(T=>T.ts>=S.ts);u.length>=2&&(L=u)}L=L.map(u=>({...u,val:Math.max(0,u.val-S.value)}))}}c=e.trigger_target_value,g=!0}else t==="state_change"&&e.trigger_target_changes&&o?.mode!=="alarm"?(c=e.trigger_target_changes,g=!0):t==="runtime"&&e.trigger_runtime_hours&&(c=e.trigger_runtime_hours,g=!0);let Z=null,v=r.degradation_rate,h=v!=null&&(e.trigger_below!=null&&e.trigger_above==null&&v>0||e.trigger_above!=null&&e.trigger_below==null&&v<0);if(c==null&&v!=null&&!h&&(r.degradation_trend!=="stable"||r.days_until_threshold!=null)&&r.degradation_trend!=="insufficient_data"&&L.length>=2){let S=L[L.length-1];Z=[S,{ts:S.ts+30*864e5,val:S.val+v*30}]}let x=r.history.filter(S=>["completed","skipped","reset"].includes(S.type)).map(S=>({ts:Z1(S.timestamp),type:S.type}));return i`
    <maintenance-trigger-chart
      .points=${M?[]:L}
      .events=${x}
      .unit=${a}
      .lang=${C.lang}
      .thresholdAbove=${t==="threshold"?e.trigger_above??null:null}
      .thresholdBelow=${t==="threshold"?e.trigger_below??null:null}
      .targetValue=${c}
      .targetMark=${m}
      .forceZero=${g}
      .projection=${Z}
      .rangeDays=${C.rangeDays}
      .hideOutliers=${C.hideOutliers}
      .busy=${M}
      @range-change=${S=>C.setRangeDays(S.detail.days)}
      @outlier-toggle=${S=>C.setHideOutliers(S.detail.hide)}
    ></maintenance-trigger-chart>
    ${M?s:H&&C.historyFallbackIds?.has(H)&&!l?i`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${V(o?.mode==="alarm"?"chart_history_alarm":o?.mode==="count"?"chart_history_count":"chart_history_fallback",C.lang)}
        </div>`:l?i`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${V("chart_no_stats",C.lang)}
        </div>`:s}
  `}var I4=200,D2=10,z4=22;function b7(r,a,C,e,t){let H=r.history.filter(M=>M.type==="completed"&&(D1(M)!=null||M.duration!=null));if(H.length<2)return s;let L=H.some(M=>(D1(M)??0)!==0),o=H.some(M=>(M.duration??0)>0);return!L&&!o?s:i`
    <div class="cost-duration-card">
      <div class="card-header">
        <h3>${V("cost_duration_chart",a)}</h3>
        <div class="toggle-buttons">
          ${L?i`<button
            class="toggle-btn ${C==="cost"?"active":""}"
            @click=${()=>e("cost")}>
            ${V("cost",a)}
          </button>`:s}
          ${L&&o?i`<button
            class="toggle-btn ${C==="both"?"active":""}"
            @click=${()=>e("both")}>
            ${V("both",a)}
          </button>`:s}
          ${o?i`<button
            class="toggle-btn ${C==="duration"?"active":""}"
            @click=${()=>e("duration")}>
            ${V("duration",a)}
          </button>`:s}
        </div>
      </div>
      ${N4(r,a,C,t)}
    </div>
  `}function N4(r,a,C,e){let t=r.history.filter($=>$.type==="completed"&&(D1($)!=null||$.duration!=null)).map($=>({ts:Z1($.timestamp),cost:D1($)??0,duration:$.duration??0})).sort(($,V1)=>$.ts-V1.ts);if(t.length<2)return s;let H=t.some($=>$.cost!==0),L=t.some($=>$.cost<0),o=t.some($=>$.duration>0);if(!H&&!o)return s;let M=C!=="duration"&&H,l=C!=="cost"&&o,n=M||!l&&H,p=l||!M&&o,c=640,m=I4,g=n?44:12,Z=p?44:12,v=c-g-Z,h=m-z4,x=h-D2,S=t[0].ts,u=t[t.length-1].ts,T=(u-S||864e5)*.05,y=S-T,K=u+T,k=A0(S,u),j=$=>g+($-y)/(K-y)*v,W=Math.min(0,...t.map($=>$.cost)),R=Math.max(0,...t.map($=>$.cost)),Y=P2(W,R>W?R:W+1,3),J=P2(0,Math.max(...t.map($=>$.duration))||1,3),e1=Y.niceMax-Y.niceMin||1,w=$=>D2+(1-($-Y.niceMin)/e1)*x,C1=$=>D2+(1-$/(J.niceMax||1))*x,s1=t.length>1?Math.min(...t.slice(1).map(($,V1)=>j($.ts)-j(t[V1].ts))):v,C2=Math.max(6,Math.min(22,s1*.55)),a1=s5(S,u,Math.max(2,Math.min(4,t.length)));return i`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${c} ${m}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${V("chart_history",a)}">
        ${n?Y.ticks.map($=>{let V1=w($);return V1<D2-1||V1>h+1?s:q`
            <line x1="${g}" y1="${O(V1)}" x2="${c-Z}" y2="${O(V1)}" stroke="var(--divider-color)" stroke-width="1" opacity="0.55" />
            <text x="${g-6}" y="${O(V1+3.5)}" text-anchor="end" fill="var(--primary-color)" font-size="10.5">${F1($,a)}${e}</text>`}):s}
        ${p?J.ticks.map($=>{let V1=C1($);return V1<D2-1||V1>h+1?s:q`<text x="${c-Z+6}" y="${O(V1+3.5)}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="10.5">${F1($,a)}m</text>`}):s}

        ${n&&Y.niceMin<0?q`
          <line class="cost-zero" x1="${g}" y1="${O(w(0))}" x2="${c-Z}" y2="${O(w(0))}" stroke="var(--secondary-text-color)" stroke-width="1" opacity="0.7" />
        `:s}
        ${n?t.filter($=>$.cost!==0).map($=>{let V1=w(Math.max($.cost,0)),f2=$.cost<0;return q`
          <rect class="${f2?"credit-bar":"cost-bar"}" x="${O(j($.ts)-C2/2)}" y="${O(V1)}" width="${O(C2)}" height="${O(w(Math.min($.cost,0))-V1)}"
            fill="${f2?"var(--success-color, #4caf50)":"var(--primary-color)"}" opacity="0.6" rx="2">
            <title>${n5($.ts,a,!0)}: ${f2?`${V("cost_kind_credit",a)} `:""}${Q(Math.abs($.cost),e,a)}${$.duration?` \xB7 ${$.duration}m`:""}</title>
          </rect>`}):s}
        ${p?q`
          <polyline points="${t.map($=>`${O(j($.ts))},${O(C1($.duration))}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${t.map($=>q`
            <circle cx="${O(j($.ts))}" cy="${O(C1($.duration))}" r="3.5" fill="var(--accent-color, #ff9800)">
              <title>${n5($.ts,a,!0)}: ${$.duration}m${$.cost?` \xB7 ${Q($.cost,e,a)}`:""}</title>
            </circle>
          `)}
        `:s}

        <line x1="${g}" y1="${h}" x2="${c-Z}" y2="${h}" stroke="var(--divider-color)" stroke-width="1" />
        ${a1.map(($,V1)=>{let f2=V1===0?"start":V1===a1.length-1?"end":"middle";return q`<text x="${O(j($))}" y="${m-6}" text-anchor="${f2}" fill="var(--secondary-text-color)" font-size="10">${n5($,a,k)}</text>`})}
      </svg>
    </div>
    <div class="chart-legend">
      ${n?i`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${V("cost",a)}</span>`:s}
      ${n&&L?i`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50);opacity:0.6"></span>${V("cost_kind_credit",a)}</span>`:s}
      ${p?i`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${V("duration",a)}</span>`:s}
    </div>
  `}var W4={ok:"mdi:check-circle-outline",due_soon:"mdi:calendar-clock",overdue:"mdi:calendar-alert",triggered:"mdi:alert-circle-outline",paused:"mdi:pause-circle-outline",archived:"mdi:archive-outline"},O7={completed:"mdi:check-circle",skipped:"mdi:debug-step-over",missed:"mdi:calendar-remove",reset:"mdi:restore",triggered:"mdi:alert-circle-outline",trigger_removed:"mdi:link-off",trigger_replaced:"mdi:swap-horizontal"},$7=new Set(["completed","skipped","reset"]),U4=new Set(S3),T7="Sensor trigger activated",G4={counted:"beta_trace_dw_counted",waiting:"beta_trace_dw_waiting",left_early:"beta_trace_dw_left_early",not_due:"beta_trace_dw_not_due",inert:"beta_trace_dw_inert",recent:"beta_trace_dw_recent"},q4={done:"beta_trace_cleared_done",status_left:"beta_trace_cleared_status",inert:"beta_trace_cleared_inert"};function z(r){return typeof r=="string"?r:r==null?"":String(r)}function U1(r,a){return Object.entries(a).reduce((C,[e,t])=>C.split(`{${e}}`).join(t),r)}function y5(r,a){return r?V(r,a):"\u2014"}function s3(r){return r.replace(/\s*[(（][^)）]*[)）]\s*$/,"").trim()}function g2(r,a){let C=Math.max(1,Math.round(r/6e4));if(C<60)return w1(C,"minute",a);let e=Math.round(r/36e5);return e<48?w1(e,"hour",a):w1(Math.round(r/864e5),"day",a)}function Q4(r,a){let C=a;switch(r.kind){case"status":{let e=z(r.from),t=z(r.to);return{at:r.at,icon:W4[t]??"mdi:information-outline",text:`${y5(e,C)} \u2192 ${y5(t,C)}`,tone:"status",details:[],group:`status:${e}>${t}`,watch:e==="triggered"||t==="triggered"?"rule":void 0}}case"reminder":{if(r.reminder==="lead"){let t=Number(r.days);return{at:r.at,icon:"mdi:bell-outline",text:U1(V("beta_trace_reminder_lead",C),{interval:Number.isFinite(t)?w1(t,"day",C):"\u2014"}),tone:"info",details:[],group:`reminder:lead:${z(r.days)}`}}let e=r.reminder==="bundle";return{at:r.at,icon:"mdi:bell-ring-outline",text:U1(V("beta_trace_reminder",C),{status:y5(z(r.status),C)}),tone:"info",details:e?[{label:V("beta_trace_message",C),value:V("beta_trace_bundle",C)}]:[],group:`reminder:${z(r.reminder)}:${z(r.status)}`}}case"reminder_cleared":return{at:r.at,icon:"mdi:bell-off-outline",text:V(q4[z(r.reason)]??"beta_trace_cleared_done",C),tone:"info",details:[],group:`cleared:${z(r.reason)}`};case"snoozed":{let e=Number(r.hours);return{at:r.at,icon:"mdi:alarm-snooze",text:U1(V("beta_trace_snoozed",C),{time:h1(z(r.until),C)}),tone:"info",details:Number.isFinite(e)&&e>0?[{label:V("duration",C),value:w1(e,"hour",C)}]:[],group:`snoozed:${z(r.until)}`}}case"done_when":{let e=z(r.result),t=Number(r.minutes),H=z(r.entity)||"\u2014",L=z(r.state)||"\u2014",o=[{label:s3(V("complete_when",C)),value:`${H} \u2192 ${L}`}];return e==="not_due"&&z(r.status)&&o.push({label:V("report_col_status",C),value:y5(z(r.status),C)}),{at:r.at,icon:e==="counted"?"mdi:check-circle-outline":e==="waiting"?"mdi:timer-sand":"mdi:cancel",text:U1(V(G4[e]??"beta_trace_dw_not_due",C),{entity:H,state:L,duration:Number.isFinite(t)&&t>0?w1(t,"minute",C):"\u2014"}),tone:e==="counted"?"done":e==="waiting"?"info":"skipped",details:o,group:`done_when:${e}:${H}:${L}`,watch:"done_when"}}case"edited":{let e=Array.isArray(r.fields)?r.fields.map(z).filter(Boolean):[],t=U1(V("beta_trace_edited",C),{fields:K4(e,C)||"\u2014"}),H={};if(k5(r.changes))for(let[L,o]of Object.entries(r.changes))Array.isArray(o)&&o.length===2&&(H[L]=[o[0],o[1]]);return{at:r.at,icon:"mdi:pencil-outline",text:t,tone:"info",details:[],group:`edited:${r.at}`,changes:H}}default:return{at:r.at,icon:"mdi:information-outline",text:r.kind,tone:"info",details:[],group:`kind:${r.kind}`}}}var P7={name:"task_name",type:"maintenance_type",enabled:"task_enabled",schedule:"schedule_type",schedule_type:"schedule_type",interval_days:"interval",interval_unit:"interval",interval_anchor:"interval_anchor",due_date:"due_date",due_override:"postponed",last_performed:"last_performed",warning_days:"warning_days",earliest_completion_days:"earliest_completion_days",schedule_time:"schedule_time_toggle",trigger_config:"beta_sensor_rule",complete_when:"complete_when",notes:"notes_label",documentation_url:"documentation_url_label",custom_icon:"custom_icon_optional",priority:"priority",labels:"labels",checklist:"checklist",phases:"phases_section",phase_sequence:"phases_section",reading_unit:"reading_unit_label",readings:"readings_section",responsible_user_id:"responsible_user",assignee_pool:"task_shared_with",rotation_strategy:"rotation_strategy",nfc_tag_id:"nfc_tag_id",require_tag_scan:"require_tag_scan",allow_skip:"disallow_skip",on_complete_action:"on_complete_action_title",quick_complete_defaults:"qr_action_quick_complete",consumes_parts:"consumes_parts_label",notify_icon:"notify_icon",mirror_todo_entities:"task_mirror_todo",mirror_todo_use_default:"task_mirror_todo",adaptive_config:"adaptive_enabled"};function K4(r,a){let C=[],e=!1;for(let t of r){let H=P7[t];if(!H){e=!0;continue}let L=s3(V(H,a));L&&!C.includes(L)&&C.push(L)}return e&&C.push(V("beta_trace_edited_other",a)),C.join(", ")}function k5(r){return!!r&&typeof r=="object"&&!Array.isArray(r)}var S7=/^[a-z_]+\.[a-z0-9_]+$/;function y7(r,a){return r.length>a?`${r.slice(0,a-1)}\u2026`:r}function Y4(r,a){let C=a.lang;if(r.type==="compound"){let H=String((r.conditions||[]).length);return V((r.compound_logic||"AND")==="AND"?"beta_rules_all_of":"beta_rules_any_of",C).split("{n}").join(H)}let e=$2(r).map(a.entityName).join(", "),t=d5(r,a.unit,C);return e?`${e}: ${t}`:t}function k7(r,a,C){let e=C.lang;if(a==null||a===""||Array.isArray(a)&&!a.length)return"\u2014";switch(r){case"schedule":return k5(a)?R1({schedule:a},e):"\u2014";case"trigger_config":return k5(a)?Y4(a,C):"\u2014";case"complete_when":return k5(a)&&typeof a.entity_id=="string"?`${C.entityName(a.entity_id)} \u2192 ${z(a.to_state)||"\u2014"}`:"\u2014";case"interval_days":case"warning_days":case"earliest_completion_days":return typeof a=="number"?w1(a,"day",e):z(a);case"responsible_user_id":return typeof a=="string"?C.userName(a)??a:"\u2014";case"assignee_pool":return Array.isArray(a)?a.map(t=>typeof t=="string"?C.userName(t)??t:z(t)).join(", "):"\u2014";case"due_date":case"due_override":case"last_performed":return typeof a=="string"?N(a,e):"\u2014";case"priority":return V(`priority_${z(a)}`,e);case"type":return V(z(a),e)}return typeof a=="boolean"?a?"\u2713":"\u2717":typeof a=="number"?U(a,e):typeof a=="string"?S7.test(a)?C.entityName(a):y7(a,60):Array.isArray(a)&&a.every(t=>t===null||typeof t!="object")?y7(a.map(t=>typeof t=="string"&&S7.test(t)?C.entityName(t):z(t)).join(", "),80):"\u2026"}function B7(r,a){if(!r)return[];let C=[];for(let[e,[t,H]]of Object.entries(r)){let L=P7[e];L&&C.push({label:s3(V(L,a.lang)),value:`${k7(e,t,a)} \u2192 ${k7(e,H,a)}`})}return C}function R7(r,a,C=20){let e=[];for(let[t,H]of Object.entries(r??{}))for(let L of H??[]){let o=L.lu??L.lc,M=typeof o=="number"?o*1e3:Date.parse(L.last_updated??L.last_changed??""),l=L.s??L.state;Number.isFinite(M)&&typeof l=="string"&&e.push({at:M,entityId:t,state:l})}return e.sort((t,H)=>Math.abs(t.at-a)-Math.abs(H.at-a)).slice(0,C).sort((t,H)=>t.at-H.at)}function E7(r,a,C){let e=r.completed_by?a(r.completed_by):null;if(!e)return null;let t=r.completed_via?a(r.completed_via):null;return{label:V("completed_by",C),value:t?U1(V("completed_via",C),{person:e,device:t}):e}}function X4(r,a){let C=a,e=[],t=r.checklist_state&&typeof r.checklist_state=="object"?Object.values(r.checklist_state):[];return t.length&&e.push({label:V("checklist",C),value:`${t.filter(Boolean).length}/${t.length}`}),r.feedback&&e.push({label:V("was_maintenance_needed",C),value:V(`feedback_${r.feedback}`,C)}),e}function J4(r,a,C={}){let e=z(r.type),t=z(r.notes).trim(),L=e==="triggered"&&t===T7?"":c2(t,a).trim(),o=L.length>80?`${L.slice(0,79)}\u2026`:L,M=o?`${V(e,a)} \xB7 ${o}`:V(e,a),l=e==="triggered"&&typeof r.trigger_value=="number"&&Number.isFinite(r.trigger_value)?`${U(r.trigger_value,a,{maximumFractionDigits:3})}${C.triggerUnit?` ${C.triggerUnit}`:""}`:"";return{at:z(r.timestamp),icon:O7[e]??"mdi:history",text:l?`${M} \xB7 ${V("trigger_val",a)}: ${l}`:M,tone:$7.has(e)?"done":e==="triggered"?"status":"info",details:X4(r,a),group:e==="triggered"||e==="missed"?`history:${e}:${t}`:`history:${e}:${z(r.timestamp)}`,foldText:M,history:r,watch:e==="triggered"?"rule":void 0}}function D7(r){return z(r.type)==="triggered"&&z(r.notes).trim()===T7?{...r,notes:null}:r}function _1(r){let a=Date.parse(r);return Number.isFinite(a)?a:0}var C9=new Set(["status","reminder_cleared"]),e9=6e4;function t9(r){let a=[];for(let e of r){let t=a[a.length-1];if(t&&t.group===e.group){t.repeats||(t.repeats=[{...t}]),t.repeats.push(e);continue}a.push(e)}let C=null;for(let e of a)e.gapMs=C===null?null:_1(e.at)-_1(C),C=e.repeats?e.repeats[e.repeats.length-1].at:e.at;return a}function j7(r,a,C,e={}){let t=[],H=0;for(let n of r)!n||typeof n.at!="string"||typeof n.kind!="string"||t.push({item:Q4(n,C),ends:!1,kind:n.kind,order:H++,type:""});for(let n of a){if(!n||typeof n.timestamp!="string")continue;let p=z(n.type);t.push({item:J4(n,C,e),ends:$7.has(p),kind:`history:${p}`,order:H++,type:p})}t.sort((n,p)=>_1(n.item.at)-_1(p.item.at)||n.order-p.order);let L=null;for(let n of t)n.kind==="status"&&(L&&L.details.push({label:V("duration",C),value:g2(_1(n.item.at)-_1(L.at),C)}),L=n.item);let o=[],M=[],l;for(let n of t){if(n.kind==="status"){let c=n.item.group.slice(n.item.group.indexOf(">")+1);U4.has(c)?l??=n.item.at:l=void 0}let p=o[o.length-1];if(!M.length&&p&&C9.has(n.kind)&&_1(n.item.at)-_1(p.end)<=e9){p.items.push(n.item);continue}M.push(n.item),n.ends&&(o.push({start:M[0].at,end:n.item.at,closed:!0,items:M,endType:n.type,since:p?.end,dueAt:l}),M=[])}M.length&&o.push({start:M[0].at,end:M[M.length-1].at,closed:!1,items:M,since:o[o.length-1]?.end,dueAt:l});for(let n of o)n.items=t9(n.items);return o}function H9(r){return r.items.flatMap(a=>a.repeats??[a]).filter(a=>a.group.startsWith("status:"))}function w7(r,a){return r.items.flatMap(C=>C.repeats??[C]).filter(C=>C.group.startsWith(a)).length}function F7(r,a,C=Date.now()){let e=a,t=H9(r),H=p=>p.slice(p.indexOf(">")+1),L=r.dueAt,o=[];if(r.closed){if(r.endType==="completed"){let p=L?_1(r.end)-_1(L):0;L&&p>=6e4?o.push(U1(V("beta_trace_after_due",e),{span:g2(p,e)})):t.some(c=>H(c.group)==="due_soon")&&o.push(V("beta_trace_before_due",e))}r.since&&o.push(U1(V("beta_trace_cycle_length",e),{span:g2(_1(r.end)-_1(r.since),e)}))}else L&&o.push(U1(V("beta_trace_due_for",e),{span:g2(C-_1(L),e)}));let M=w7(r,"reminder:");M&&o.push(p1("beta_trace_reminders","beta_trace_reminders_one",M,e));let l=w7(r,"snoozed:");if(l&&o.push(p1("beta_trace_snoozes","beta_trace_snoozes_one",l,e)),!r.closed)return{text:V("beta_trace_running",e),icon:"mdi:progress-clock",tone:"info",facts:o};let n=r.endType??"completed";return{text:`${V(n,e)} \xB7 ${h1(r.end,e)}`,icon:O7[n]??"mdi:check-circle",tone:"done",facts:o}}var V9="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",r9="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z",L9="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z",i9=60*6e4,a9=15*6e4,o9=6e4,n1=class extends D{constructor(){super(...arguments);this.entryId="";this.taskId="";this.task=null;this.currencySymbol="\u20AC";this.taskRef=null;this.userName=()=>null;this._enabled=!0;this._cycles=null;this._index=-1;this._sel=-1;this._failed=!1;this._raw=null;this._activity=new Map;this._loadedFor=""}updated(){let C=`${this.entryId}/${this.taskId}`;this.hass&&this.entryId&&this.taskId&&C!==this._loadedFor&&(this._loadedFor=C,this._load())}async _load(){this._cycles=null,this._failed=!1,this._index=-1,this._sel=-1,this._raw=null,this._activity=new Map;try{let C=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/trace",entry_id:this.entryId,task_id:this.taskId});this._raw=C??{},this._enabled=C?.enabled!==!1,this._cycles=j7(C?.events??[],C?.history??[],F(this.hass),{triggerUnit:K1(this.hass,this.task)||void 0})}catch{this._failed=!0,this._cycles=[]}}_current(){let C=this._cycles??[];if(!C.length)return{cycle:null,index:-1};let e=this._index<0||this._index>=C.length?C.length-1:this._index;return{cycle:C[e],index:e}}_step(C){let{index:e}=this._current(),t=e+C;this._cycles&&t>=0&&t<this._cycles.length&&(this._index=t,this._sel=-1)}render(){let C=F(this.hass);if(this._cycles===null)return i`<div class="trace-note">…</div>`;let{cycle:e,index:t}=this._current(),H=this._cycles.length,L=e?`${h1(e.start,C)} \u2013 ${e.closed?h1(e.end,C):V("beta_trace_current",C)}`:V("beta_trace_current",C);return i`
      ${this._enabled?s:i`<div class="trace-note trace-off">${V("beta_trace_off",C)}</div>`}
      ${this._failed?i`<div class="trace-note">${V("beta_trace_load_failed",C)}</div>`:s}
      <div class="trace-cycles">
        <ha-icon-button class="trace-older" .path=${V9} .label=${V("beta_trace_older",C)} .disabled=${t<=0}
          @click=${()=>this._step(-1)}></ha-icon-button>
        <span class="trace-cycle-label">${L}</span>
        <ha-icon-button class="trace-newer" .path=${r9} .label=${V("beta_trace_newer",C)} .disabled=${t<0||t>=H-1}
          @click=${()=>this._step(1)}></ha-icon-button>
        <ha-icon-button class="trace-download" .path=${L9} .label=${V("beta_trace_download",C)} .disabled=${!this._raw}
          @click=${()=>this._download()}></ha-icon-button>
      </div>
      ${!e||!e.items.length?i`<div class="trace-note">${V("beta_trace_empty",C)}</div>`:i`
          ${this._renderResult(e,C)}
          <ol class="trace-steps" aria-label=${V("beta_trace",C)}>
            ${e.items.map((o,M)=>this._renderStep(o,M,e.items[M+1],`${t}:${M}`,C))}
          </ol>`}
    `}_renderResult(C,e){let t=F7(C,e);return i`
      <div class="trace-result ${t.tone}">
        <ha-icon icon=${t.icon}></ha-icon>
        <span class="trace-result-text">${t.text}</span>
        ${t.facts.map(H=>i`<span class="trace-fact">${H}</span>`)}
      </div>`}_renderStep(C,e,t,H,L){let o=this._sel===e,M=C.repeats?.length??0,l=M?C.repeats[M-1]:C,n=C.gapMs!=null&&C.gapMs>=o9?V("beta_trace_later",L).replace("{span}",g2(C.gapMs,L)):"";return i`
      <li class="trace-item ${C.tone} ${t?.tone==="skipped"?"next-skipped":""}">
        <button type="button" class="trace-step ${C.tone} ${o?"selected":""}" aria-expanded=${o?"true":"false"}
          @click=${()=>this._toggle(C,e,H)}>
          <span class="trace-node ${C.tone}"><ha-icon icon=${C.icon}></ha-icon></span>
          <span class="trace-main">
            <span class="trace-time">
              ${h1(C.at,L)}${M?i` – ${h1(l.at,L)}`:s}
              ${n?i`<span class="trace-gap">${n}</span>`:s}
            </span>
            <span class="trace-text">${M?C.foldText??C.text:C.text}${M?i` <span class="trace-count">×${M}</span>`:s}</span>
          </span>
          <ha-icon class="trace-chevron" icon=${o?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        ${o?this._renderDetails(C,H,L):s}
      </li>`}_toggle(C,e,t){if(this._sel===e){this._sel=-1;return}this._sel=e;let H=this._watched(C);H.length&&!this._activity.has(t)&&this._loadActivity(t,C,H)}_watched(C){let e=this.task;return C.watch==="rule"&&e?.trigger_config?[...new Set(d2(e.trigger_config).map(t=>t.entityId))]:C.watch==="done_when"&&e?.complete_when?.entity_id?[e.complete_when.entity_id]:[]}async _loadActivity(C,e,t){this._activity=new Map(this._activity).set(C,"loading");let H=Date.parse((e.repeats?e.repeats[e.repeats.length-1]:e).at),L;try{let o=await this.hass.connection.sendMessagePromise({type:"history/history_during_period",start_time:new Date(H-i9).toISOString(),end_time:new Date(H+a9).toISOString(),entity_ids:t,minimal_response:!0,no_attributes:!0,significant_changes_only:!1});L=R7(o,H)}catch{L="failed"}this._activity=new Map(this._activity).set(C,L)}_download(){if(!this._raw)return;let{history:C,...e}=this.task??{},t=(this.task?.name||this.taskId).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"task",H={exported_at:new Date().toISOString(),entry_id:this.entryId,task_id:this.taskId,task:e,...this._raw};k2(JSON.stringify(H,null,2),`trace-${t}-${d1()}.json`,"application/json")}_changeContext(C){return{lang:C,entityName:e=>l2(this.hass,e),userName:this.userName,unit:K1(this.hass,this.task)||void 0}}_renderActivity(C,e){let t=this._activity.get(C);return t===void 0?s:i`
      <div class="trace-activity">
        <div class="trace-activity-title">${V("beta_trace_activity",e)}</div>
        ${t==="loading"?i`<div class="trace-activity-none">…</div>`:t==="failed"||!t.length?i`<div class="trace-activity-none">${V("beta_trace_activity_none",e)}</div>`:i`<ol class="trace-repeats">
                ${t.map(H=>i`<li><span class="trace-time">${h1(new Date(H.at).toISOString(),e,!0)}</span><span>${l2(this.hass,H.entityId)}: ${this._stateText(H,e)}</span></li>`)}
              </ol>`}
      </div>`}_stateText(C,e){let t=Number(C.state);if(C.state===""||!Number.isFinite(t))return C.state;let H=this.hass?.states?.[C.entityId]?.attributes?.unit_of_measurement;return`${U(t,e,{maximumFractionDigits:3})}${typeof H=="string"&&H?` ${H}`:""}`}_renderDetails(C,e,t){let H=[{label:V("history_edit_timestamp",t),value:h1(C.at,t,!0)}];if(!C.repeats){H.push(...C.details,...B7(C.changes,this._changeContext(t)));let L=C.history?E7(C.history,this.userName,t):null;L&&H.push(L)}return i`
      <div class="trace-details" role="region" aria-label=${V("task_section_details",t)}>
        <dl class="trace-facts">
          ${H.map(L=>i`<dt>${L.label}</dt><dd>${L.value}</dd>`)}
        </dl>
        ${C.repeats?i`<ol class="trace-repeats">
              ${C.repeats.map(L=>i`<li><span class="trace-time">${h1(L.at,t,!0)}</span><span>${L.text}</span></li>`)}
            </ol>`:C.history?p5(D7(C.history),{lang:t,hass:this.hass,currencySymbol:this.currencySymbol,taskRef:this.taskRef,triggerUnit:K1(this.hass,this.task)||null},{compact:!0,showEdit:!1,showHead:!1}):s}
        ${this._renderActivity(e,t)}
      </div>`}};n1.styles=[M2,E`
    :host {
      display: block;
      padding: 8px 0;
    }
    .trace-note {
      padding: 8px 12px;
      color: var(--secondary-text-color);
      font-size: 14px;
    }
    .trace-off {
      border: 1px dashed var(--divider-color);
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .trace-cycles {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 4px 0 12px;
    }
    .trace-cycle-label {
      flex: 0 1 520px;
      text-align: center;
      padding: 6px 16px;
      border-radius: 9999px;
      background: var(--secondary-background-color, #e6e6e6);
      font-size: 14px;
      font-weight: 500;
    }
    .trace-result {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px 10px;
      margin: 0 8px 12px;
      padding: 8px 12px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ms-radius-10, 10px);
      font-size: 14px;
    }
    .trace-result ha-icon {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
    }
    .trace-result.done ha-icon {
      color: var(--success-color, #00883c);
    }
    .trace-result-text {
      font-weight: 500;
    }
    .trace-fact {
      padding: 2px 10px;
      border-radius: 9999px;
      background: var(--secondary-background-color, #eff9fe);
      font-size: 12px;
      line-height: 20px;
    }
    .trace-steps {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    /* The rail: each step draws the line into its node (::before) and out
       of it (::after), so node and text share one line whatever its height,
       open details included. Node: 32 px at 6 px from the top, centred on
       24 px from the left. */
    .trace-item {
      position: relative;
    }
    .trace-item::before,
    .trace-item::after {
      content: "";
      position: absolute;
      left: 23px;
      border-left: 2px solid var(--success-color, #00883c);
    }
    .trace-item::before {
      top: 0;
      height: 6px;
    }
    .trace-item::after {
      top: 38px;
      bottom: 0;
    }
    .trace-item:first-child::before,
    .trace-item:last-child::after {
      display: none;
    }
    .trace-item.skipped::before,
    .trace-item.next-skipped::after {
      border-left: 2px dashed var(--divider-color);
    }
    .trace-step {
      display: grid;
      grid-template-columns: 32px minmax(0, 1fr) 20px;
      gap: 12px;
      align-items: start;
      width: 100%;
      padding: 6px 8px;
      border: none;
      border-radius: 8px;
      background: none;
      color: inherit;
      font: inherit;
      text-align: start;
      cursor: pointer;
    }
    .trace-step:hover,
    .trace-step.selected {
      background: var(--secondary-background-color, #eff9fe);
    }
    .trace-step:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .trace-node {
      width: 32px;
      height: 32px;
      box-sizing: border-box;
      display: grid;
      place-items: center;
      border: 2px solid var(--divider-color);
      border-radius: var(--ms-radius-10, 10px);
      background: var(--card-background-color, #fff);
      color: var(--secondary-text-color);
      --mdc-icon-size: 18px;
    }
    .trace-node.done {
      border-color: var(--success-color, #00883c);
      color: var(--success-color, #00883c);
    }
    .trace-node.status {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .trace-node.skipped {
      border-style: dashed;
    }
    .trace-step.selected .trace-node {
      outline: 3px solid var(--primary-color);
      outline-offset: 2px;
    }
    /* Time beside the text, under it when the line is narrow. */
    .trace-main {
      display: flex;
      flex-wrap: wrap;
      gap: 0 12px;
      padding-top: 6px;
      min-width: 0;
    }
    .trace-time {
      flex: 0 0 auto;
      min-width: 96px;
      font-size: 12px;
      line-height: 20px;
      color: var(--secondary-text-color);
    }
    .trace-gap {
      display: block;
      font-size: 11px;
      line-height: 16px;
    }
    .trace-text {
      flex: 1 1 220px;
      min-width: 0;
      font-size: 14px;
      line-height: 20px;
      overflow-wrap: anywhere;
    }
    .trace-step.skipped .trace-text {
      color: var(--secondary-text-color);
    }
    .trace-count {
      display: inline-block;
      padding: 0 6px;
      border-radius: 9999px;
      background: var(--secondary-background-color, #eff9fe);
      font-size: 12px;
      font-weight: 500;
    }
    .trace-chevron {
      margin-top: 6px;
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
    }
    .trace-details {
      margin: 2px 8px 8px 52px;
      padding: 8px 12px;
      border-radius: 8px;
      background: var(--secondary-background-color, #eff9fe);
      font-size: 13px;
    }
    .trace-facts {
      display: grid;
      grid-template-columns: max-content minmax(0, 1fr);
      gap: 4px 12px;
      margin: 0;
    }
    .trace-facts dt {
      color: var(--secondary-text-color);
    }
    .trace-facts dd {
      margin: 0;
      overflow-wrap: anywhere;
    }
    .trace-details .history-entry {
      border-bottom: none;
      padding-bottom: 0;
    }
    .trace-repeats {
      list-style: none;
      margin: 8px 0 0;
      padding: 0;
      display: grid;
      gap: 2px;
    }
    .trace-repeats li {
      display: flex;
      flex-wrap: wrap;
      gap: 0 12px;
    }
    .trace-repeats .trace-time {
      min-width: 140px;
    }
    .trace-activity {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid var(--divider-color);
    }
    .trace-activity-title {
      font-weight: 500;
    }
    .trace-activity-none {
      color: var(--secondary-text-color);
      margin-top: 4px;
    }
  `],d([b({attribute:!1})],n1.prototype,"hass",2),d([b({attribute:!1})],n1.prototype,"entryId",2),d([b({attribute:!1})],n1.prototype,"taskId",2),d([b({attribute:!1})],n1.prototype,"task",2),d([b({attribute:!1})],n1.prototype,"currencySymbol",2),d([b({attribute:!1})],n1.prototype,"taskRef",2),d([b({attribute:!1})],n1.prototype,"userName",2),d([A()],n1.prototype,"_enabled",2),d([A()],n1.prototype,"_cycles",2),d([A()],n1.prototype,"_index",2),d([A()],n1.prototype,"_sel",2),d([A()],n1.prototype,"_failed",2),d([A()],n1.prototype,"_activity",2);customElements.get("maintenance-task-trace")||customElements.define("maintenance-task-trace",n1);function w5(r,a,C,e=s){let t=r.filter(H=>!!H);return X2("ha-tab-group")?i`
      <div class="tab-bar ha-tabs">
        <ha-tab-group .active=${a} @wa-tab-show=${H=>{let L=t.find(o=>o.key===H.detail?.name)?.key;L&&L!==a&&C(L)}}>
          ${t.map(H=>i`<ha-tab-group-tab slot="nav" panel=${H.key} class=${H.cls??s} .active=${H.key===a}>${H.label}</ha-tab-group-tab>`)}
        </ha-tab-group>
        ${e}
      </div>`:i`
    <div class="tab-bar">
      ${t.map(H=>i`
        <div class="tab${H.cls?" "+H.cls:""} ${H.key===a?"active":""}" @click=${()=>C(H.key)}>
          ${H.label}
        </div>`)}
      ${e}
    </div>`}function l3(r,a,C){let e=I1(r);if(e.length===0)return s;let t=e.map(L=>C?.(L)??null);if(t.every(L=>L!==null))return i`<span class="user-badge">${L0(t)}${t.map(L=>L.name).join(", ")}</span>`;let H=e.map(L=>a(L)).filter(Boolean).join(", ");return H?i`
    <span class="user-badge">
      <ha-icon icon="mdi:account"></ha-icon>
      ${H}
    </span>
  `:s}function M9(r,a,C){let e=V("complete_when_badge",C).replace("{entity}",a).replace("{state}",r.to_state);return r.for_minutes&&(e+=` ${V("complete_when_badge_for",C).replace("{minutes}",String(r.for_minutes))}`),r.any_time&&(e+=`, ${V("complete_when_badge_any_time",C)}`),e}var I7="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z";function z7(r,a,C){let e=!a.isOperator;return[e&&{label:V("edit",C),action:()=>a.openEdit(r)},e2(r)&&{label:V("complete_with_details",C),cls:"complete-details",action:()=>a.openComplete(r,{details:!0})},{label:V("qr_code",C),action:()=>a.openQr(r.name)},{label:V("worksheet",C),action:()=>a.printWorksheet()},a.features.adaptive&&r.adaptive_config?.enabled&&{label:V("reanalyze",C),cls:"reanalyze",action:()=>a.reanalyze()},e&&{label:V("duplicate",C),action:()=>a.duplicateTask()},e&&{label:V("move_task",C),action:()=>a.moveTask()},{label:V("reset",C),action:()=>a.promptReset()},{label:`${V("postpone",C)}\u2026`,action:()=>a.promptPostpone()},{label:V("snooze",C),action:()=>a.snoozeTask()},e&&!r.archived&&{label:r.paused?V("resume_task",C):`${V("pause_task",C)}\u2026`,action:()=>a.togglePause(!!r.paused)},e&&{label:r.archived?V("unarchive",C):V("archive",C),action:()=>a.toggleArchive(!!r.archived)},e&&"divider",e&&{label:V("delete",C),danger:!0,action:()=>a.deleteTask()}]}function n9(r,a){let C=a.lang,e=a.isOperator;return i`
    <div class="task-header">
      <div class="task-header-title">
        <span class="task-name-breadcrumb" @click=${()=>a.showTaskView()}>${r.name}${u2(r.next_event_titles)}${v2(r.trigger_detail)}</span>
        ${L2(a.taskRef??null,V("ref_number",C))}
        <span class="breadcrumb-separator">·</span>
        <span class="object-name-breadcrumb" @click=${()=>a.showObject()}>${a.objectName}</span>
        ${c5(r,C,"chip")}
        ${r.paused&&r.paused_until?i`<span class="postponed-badge paused-until" title="${V("task_paused",C)}">
          <ha-icon icon="mdi:pause-circle-outline"></ha-icon>${V("paused_until_label",C)} ${N(r.paused_until,C)}
        </span>`:s}
        ${r.due_override?i`<span class="postponed-badge" title="${V("postponed_to",C)}">
          <ha-icon icon="mdi:calendar-arrow-right"></ha-icon>${N(r.due_override,C)}
        </span>`:s}
        ${l3(r,a.getUserName,a.getPerson)}
        ${r.notify_enabled===!1?i`<span class="nfc-badge muted-badge" title="${V("no_notifications",C)}"><ha-icon icon="mdi:bell-off-outline"></ha-icon></span>`:s}
        ${x9(r,a,C)}
        ${r.complete_when?.entity_id?i`<span class="nfc-badge complete-when-badge" title="${M9(r.complete_when,l2(a.hass,r.complete_when.entity_id),C)}"><ha-icon icon="mdi:check-circle-outline"></ha-icon></span>`:s}
        ${e2(r)?i`<span class="nfc-badge quick-complete-badge" title="${V("quick_complete_help",C)}"><ha-icon icon="mdi:flash-outline"></ha-icon> ${V("quick_complete_label",C)}</span>`:s}
        ${r.nfc_tag_id?i`<span class="nfc-badge" title="${V("nfc_tag_id",C)}: ${r.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>`:e?s:i`<span class="nfc-badge unlinked" title="${V("nfc_link_hint",C)}"
              @click=${()=>a.openEdit(r)}>
              <ha-icon icon="mdi:nfc-variant"></ha-icon>
            </span>`}
      </div>
      <div class="task-header-actions">
        <ha-button appearance="accent" variant="success" @click=${()=>a.openComplete(r)}>${V("complete",C)}</ha-button>
        ${r.allow_skip!==!1?i`<ha-button appearance="outlined" variant="warning" .disabled=${a.actionLoading} @click=${()=>a.promptSkip()}>${V("skip",C)}</ha-button>`:s}
        <div class="more-menu-wrapper">
          ${J1()?z1(i`<ha-icon-button slot="trigger" .disabled=${a.actionLoading} .label=${V("more_actions",C)} .path=${I7}></ha-icon-button>`,z7(r,a,C)):i`<ha-icon-button .disabled=${a.actionLoading} .label=${V("more_actions",C)} .path=${I7} @click=${()=>a.toggleMoreMenu()}></ha-icon-button>
              ${a.moreMenuOpen?t2(z7(r,a,C),()=>a.closeMoreMenu()):s}`}
        </div>
      </div>
    </div>
  `}function s9(r){let a=r.lang;return w5([{key:"overview",label:V("overview",a)},{key:"history",label:V("history",a)},r.features.beta_editor&&{key:"trace",label:V("beta_trace",a),cls:"trace-tab"}],r.activeTab,C=>r.setActiveTab(C))}function N7(r,a,C,e){let t=e.collapsedSections.has(r);return i`
    <div class="collapsible ${t?"collapsed":""}">
      <button class="collapsible-head" @click=${()=>e.toggleSection(r)}
        aria-expanded=${t?"false":"true"}>
        <ha-icon icon="${t?"mdi:chevron-right":"mdi:chevron-down"}"></ha-icon>
        <span>${V(a,e.lang)}</span>
      </button>
      ${t?s:i`<div class="collapsible-body">${C}</div>`}
    </div>
  `}function l9(r,a){if(!Q3(r))return s;let C=a.lang,e=r.phase_sequence,t=q3(r.phase_cursor,e.length),H=new Map;for(let L=r.history.length-1;L>=0;L--){let o=r.history[L];o.phase_id&&o.type==="completed"&&!H.has(o.phase_id)&&H.set(o.phase_id,o.timestamp)}return i`
    <div class="phases-card">
      <div class="phases-card-header">
        <ha-icon icon="mdi:rotate-right"></ha-icon>
        <span>${V("phase_sequence_label",C)}</span>
      </div>
      <div class="phases-strip">
        ${e.map((L,o)=>{let M=r.phases?.[L]?.name||L,l=H.get(L);return i`
            <div class="phase-step ${o===t?"current":""}"
              title=${o===t?V("phase_current",C):V("phase_set",C)}
              @click=${()=>{o!==t&&a.setPhaseCursor(o)}}>
              <span class="phase-step-name">${o+1}. ${M}</span>
              ${l?i`<span class="phase-step-last">${N(l,C)}</span>`:s}
            </div>
          `})}
      </div>
    </div>
  `}function d9(r,a){if(!a.features.checklists)return s;let C=t5(r)?.checklist??(r.checklist||[]);if(C.length===0)return s;let e=a.lang,t=r.checklist_progress||{},H=C.filter(L=>t[L]).length;return i`
    <div class="checklist-preview-card">
      <div class="checklist-preview-header">
        <ha-icon icon="mdi:format-list-checks"></ha-icon>
        <span>${V("checklist",e)} (${H}/${C.length})</span>
      </div>
      <ol class="checklist-preview-list">
        ${C.map(L=>i`
          <li class=${t[L]?"checked":""}>
            <label>
              <input
                type="checkbox"
                .checked=${!!t[L]}
                @change=${o=>a.setChecklistItem(L,o.target.checked)}
              />
              <span>${L}</span>
            </label>
          </li>
        `)}
      </ol>
    </div>
  `}function p9(r,a){let C=o1(r.documentation_url)?r.documentation_url:null,e=o1(a.objectDocUrl)?a.objectDocUrl:null,t=e?null:(a.objectManualDocs||[])[0];if(!r.notes&&!C&&!e&&!t)return s;let H=a.lang;return i`
    <div class="task-meta-card">
      ${r.notes?i`
        <div class="task-meta-row">
          <ha-icon icon="mdi:note-text-outline"></ha-icon>
          <span class="task-meta-notes">${e5(r.notes)}</span>
        </div>
      `:s}
      ${C?i`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:open-in-new"></ha-icon>
          <a href="${C}" target="_blank" rel="noopener noreferrer">${V("documentation_label",H)}</a>
        </div>
      `:s}
      ${e?i`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="${e}" target="_blank" rel="noopener noreferrer">${V("documentation_url_label",H)} (${a.objectName})</a>
        </div>
      `:t?i`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="#" title=${t.title}
            @click=${L=>{L.preventDefault(),a.openManualDoc(t)}}
            >${V("documentation_url_label",H)} (${a.objectName})</a>
        </div>
      `:s}
    </div>
  `}function c9(r,a){let C=a.lang,e=r.average_cost!==void 0?r.average_cost:r.times_performed>0?r.total_cost/r.times_performed:null,t=r.trigger_config,H=r.next_due==null&&t?.type==="due_date"&&r.trigger_current_value!=null,L=H?new Date(Date.now()+r.trigger_current_value*864e5).toISOString():r.next_due,o=H?E2(r.trigger_current_value):r.days_until_due,M=H?t?.trigger_days_before??0:r.warning_days,l=o!=null?o<0?"overdue":o<=M?"warning":"":"";return i`
    <div class="kpi-bar">
      <div class="kpi-card">
        <div class="kpi-label">${V("next_due",C)}</div>
        <div class="kpi-value">${L?N(L,C):"\u2014"}</div>
        ${H?i`<div class="kpi-subtext">${V("kpi_reported_by_sensor",C)}</div>`:a.features.schedule_time&&r.schedule_time?i`<div class="kpi-subtext">${V("at_time",C)} ${r.schedule_time}</div>`:s}
      </div>
      <div class="kpi-card ${l}">
        <div class="kpi-label">${V("days_until_due",C)}</div>
        <div class="kpi-value-large">${o??"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${V("interval",C)}</div>
        <div class="kpi-value">${R1(r,C)}</div>
        ${a.features.adaptive&&r.suggested_interval&&r.suggested_interval!==r.interval_days?i`
          <div class="kpi-subtext">${V("recommended",C)}: ${r.suggested_interval}${r.interval_analysis?.confidence_interval_low!=null?` (${r.interval_analysis.confidence_interval_low}\u2013${r.interval_analysis.confidence_interval_high})`:""}</div>
        `:s}
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${V("warning",C)}</div>
        <div class="kpi-value">${q2(r.warning_days,C)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${V("last_performed",C)}</div>
        <div class="kpi-value">${r.last_performed?N(r.last_performed,C):"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${V("avg_cost",C)}</div>
        <div class="kpi-value">${e!=null?Q(e,a.currencySymbol,C):"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${V("avg_duration",C)}</div>
        <div class="kpi-value">${r.average_duration?y2(Math.round(r.average_duration),C):"\u2014"}</div>
      </div>
    </div>
  `}function A9(r,a){let C=a.lang;if(!a.features.adaptive||!r.suggested_interval||r.suggested_interval===r.interval_days)return s;if(a.suggestionDismissed)return s;let e=r.suggested_interval;return i`
    <div class="recommendation-card">
      <h4>${V("suggested_interval",C)}</h4>
      ${P0(r.interval_days,e,r.interval_confidence||"medium",C)}
      <div class="recommendation-actions">
        ${a.isOperator?s:i`<ha-button appearance="filled" class="apply-suggestion"
              @click=${()=>a.applySuggestion(e)}>
              ${V("apply_suggestion",C)}
            </ha-button>`}
        <ha-button appearance="plain"
          @click=${()=>a.reanalyze()}>
          ${V("reanalyze",C)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${()=>a.dismissSuggestion()}>
          ${V("dismiss_suggestion",C)}
        </ha-button>
      </div>
    </div>
  `}function m9(r,a){let C=a.lang,e=S0(r.history).slice(0,3);return e.length===0?s:i`
    <div class="recent-activities">
      <h3>${V("recent_activities",C)}</h3>
      ${e.map(t=>p5(t,a.history,{compact:!0,showEdit:!1}))}
      <div class="activity-show-all">
        <ha-button appearance="plain" @click=${()=>a.setActiveTab("history")}>${V("show_all",C)} →</ha-button>
      </div>
    </div>
  `}function W7(r,a){let C=a.lang,e=a.features.adaptive&&r.suggested_interval&&r.suggested_interval!==r.interval_days,t=a.features.seasonal&&r.seasonal_factor&&r.seasonal_factor!==1,H=e||t,L=a.features.adaptive&&r.interval_analysis?.weibull_beta!=null&&r.interval_analysis?.weibull_eta!=null,o=a.features.seasonal&&(r.seasonal_factors?.length===12||r.interval_analysis?.seasonal_factors?.length===12);return i`
    <div class="tab-content overview-tab">
      ${r.battery_fleet_task?i`<maintenance-battery-fleet-section .hass=${a.hass}></maintenance-battery-fleet-section>`:s}
      ${c9(r,a)}
      ${p9(r,a)}
      ${r.battery_fleet_task?s:i`
            ${m7(r,a.lang)}
            ${x7(r,a.sparkline)}
            ${T0(r,C,a.features)}
          `}
      <div class="two-column-layout ${H?"":"single-column"}">
        ${H?i`
          <div class="left-column">
            ${A9(r,a)}
            ${B0(r,C,a.features)}
          </div>
        `:s}
        <div class="right-column">
          ${b7(r,C,a.costDurationToggle,M=>a.setCostDurationToggle(M),a.currencySymbol)}
        </div>
      </div>
      ${L?N7("weibull","weibull_reliability_curve",$0(r,C),a):s}
      ${o?N7("seasonal","seasonal_chart_title",i`
            ${R0(r,C)}
            <div class="seasonal-actions">
              <ha-button appearance="plain" @click=${()=>a.openSeasonalOverrides(r)}>
                ${V("edit_seasonal_overrides",C)}
              </ha-button>
            </div>
          `,a):s}
      ${l9(r,a)}
      ${d9(r,a)}
      ${m9(r,a)}
    </div>
  `}function u9(r,a){return i`
    <div class="tab-content history-tab">
      <div class="history-add-past">
        <ha-button appearance="plain" class="history-add-past-btn" @click=${()=>a.openComplete(r,{details:!0})}>
          <ha-icon icon="mdi:calendar-plus"></ha-icon>
          ${V("history_add_past",a.lang)}
        </ha-button>
      </div>
      ${y0(r,a.history)}
      ${k0(r,a.history)}
    </div>
  `}function v9(r,a){switch(a.activeTab){case"overview":return W7(r,a);case"history":return u9(r,a);case"trace":return a.features.beta_editor?i`<div class="tab-content trace-tab-content">
            <maintenance-task-trace .hass=${a.hass} .entryId=${a.entryId} .taskId=${a.taskId} .task=${r}
              .currencySymbol=${a.currencySymbol} .taskRef=${a.taskRef??null} .userName=${a.getUserName}></maintenance-task-trace>
          </div>`:W7(r,a);default:return s}}function x9(r,a,C){let e=r.mirror_todo_entities??[],t=e.length?e:r.mirror_todo_use_default===!1?[]:a.mirrorTodoDefault??[];if(!t.length)return s;let H=t.map(o=>l2(a.hass,o)).join(", "),L=e.length?`${V("task_mirror_todo",C)}: ${H}`:V("task_mirror_todo_default",C).replace("{lists}",H);return i`<span class="nfc-badge mirror-badge ${e.length?"":"inherited"}" title=${L}><ha-icon icon="mdi:clipboard-list-outline"></ha-icon></span>`}function U7(r,a){return i`
    <div class="detail-section">
      ${n9(r,a)}
      ${s9(a)}
      ${v9(r,a)}
      <maintenance-task-documents
        .hass=${a.hass}
        .entryId=${a.entryId}
        .taskId=${a.taskId}
        .canWrite=${!a.isOperator}
      ></maintenance-task-documents>
    </div>
  `}var j2=class extends D{createRenderRoot(){return this}render(){return!this.task||!this.ctx?s:i`${U7(this.task,this.ctx)}`}};d([b({attribute:!1})],j2.prototype,"task",2),d([b({attribute:!1})],j2.prototype,"ctx",2);customElements.get("maintenance-task-detail-view")||customElements.define("maintenance-task-detail-view",j2);function G7(r,a,C){let e=0,t=a-1;for(;e<t;){let H=e+t+1>>1;C(H)<=r?e=H:t=H-1}return e}function q7(r){if(r.total<=0)return{start:0,end:0,padTop:0,padBottom:0};let a=r.overscan??12,C=Math.max(1,r.step??6),e=Math.max(1,r.rowHeight??53),t=r.offsets,H=t?p=>t[p]:p=>p*e,L=r.scrollTop-r.listTop,o=G7(L,r.total,H),M=G7(L+r.viewportHeight,r.total,H),l=Math.max(0,o-a);l=Math.floor(l/C)*C;let n=Math.min(r.total,M+1+a);return n=Math.min(r.total,Math.ceil(n/C)*C),{start:l,end:n,padTop:H(l),padBottom:H(r.total)-H(n)}}var O5=class{constructor(){this._heights=new Map;this._sum=0;this._width=-1}setWidth(a){Math.abs(a-this._width)<1||(this._width=a,this._heights.clear(),this._sum=0)}record(a,C){if(!(C>0))return;let e=this._heights.get(a);e!==C&&(this._sum+=C-(e??0),this._heights.set(a,C))}get estimate(){return this._heights.size?this._sum/this._heights.size:53}offsets(a){let C=this.estimate,e=new Float64Array(a.length+1);for(let t=0;t<a.length;t++)e[t+1]=e[t]+(this._heights.get(a[t])??C);return e}};var $5={mode:"top",marginTop:0,lastScrollTop:0};function Q7(r,a){return r==="top"?8:a.viewH-a.paneH-8}function K7(r){let a=r.scrollTop+8-r.layoutTop,C=Math.max(0,r.listH-r.paneH);return{mode:"top",marginTop:a>C?Math.max(0,a):0,lastScrollTop:r.scrollTop}}function Y7(r,a){let C=a.scrollTop,e=a.scrollTop>r.lastScrollTop?"down":a.scrollTop<r.lastScrollTop?"up":"none",t=Math.max(0,a.listH-a.paneH),H=a.paneH+16<=a.viewH||a.listH<=a.paneH,{mode:L,marginTop:o}=r;if(H&&(L="top"),L==="top"&&o>0&&e==="up")o=Math.max(0,Math.min(o,a.scrollTop+8-a.layoutTop)),o<=t&&(o=0);else if(!H&&e==="down"&&L==="top"){let M=a.renderedTop-a.layoutTop;M<=t&&(L="bottom",o=Math.max(0,M))}else!H&&e==="up"&&L==="bottom"&&(o=Math.min(Math.max(0,a.renderedTop-a.layoutTop),t),a.scrollTop+8<=a.layoutTop+o&&(L="top",o=0));return{mode:L,marginTop:o,lastScrollTop:C}}function X7(r,a,C){let e=Math.min(100,Math.max(0,r/a*100)),t=C??80;return{pct:e,level:e>=100?"danger":e>=t?"warning":"ok"}}var T5=2,Z9=250,b9=150,V2={objects:6,tasks:10,parts:6,documents:8,history:6},S9="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z",P5=["due_date","object","type","task_name","area","assigned_user","group"],d3=["none","area","group","user","object"],p3=b3,J7=["children","tasks","documents","parts","history"],C4=r=>`${r.entry_id}/${r.task_id}`,c3=(r,a)=>`${V("documents",a)}: ${U(r,a)}`,e4="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",_=class extends D{constructor(){super(...arguments);this.narrow=!1;this.tight=!1;this.split=!1;this.wide=!1;this._tightObserver=null;this.panel={};this.embedded=!1;this.presets={};this._presetsApplied=!1;this._mountPath=null;this._objects=[];this._stats=null;this._view="overview";this._allParts=null;this._selectedEntryId=null;this._selectedTaskId=null;this._selectedAreaId=null;this._filterStatus="";this._filterUser=null;this._filterLabel=null;this._filterPlace="";this._filterPriority="";this._savedViews=[];this._activeViewId="";this._unsub=null;this._chartRangeDays=(()=>{try{let C=parseInt(X(P.chartRange)||"",10);return[7,30,90,365].includes(C)?C:30}catch{return 30}})();this._hideOutliers=(()=>{try{return X(P.chartHideOutliers)==="1"}catch{return!1}})();this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1,beta_editor:!1};this._adminPanelUserIds=[];this._operatorWriteEnabled=!1;this._defaultWarningDays=7;this._mirrorTodoDefault=[];this._rowActionStyle="buttons_compact";this._refsInLists=!1;this._partsCostMode="purchase";this._rowActionNotice=!1;this._actionLoading=!1;this._moreMenuOpen=!1;this._objMenuOpen=!1;this._subObjMenu=null;this._toastMessage="";this._toastKind="error";this._toastUndo=null;this._toastActionLabel="";this._filtersOpen=!1;this._listSearch="";this._listSearchDraft="";this._listSearchTimer=0;this._filterPaneOpen=X(P.filterPane)==="1";this._paneSections=new Set(["status"]);this._newMenuOpen=!1;this._gsSetupsCount=0;this._gsAdoptCount=0;this._gsLoaded=!1;this._resetOffersLoaded=!1;this._resetOffersCount=0;this._batteryFleetSetupAvailable=!1;this._staleBundle=!1;this._restartPendingVersion=null;this._staleChecked=!1;this._onReconnect=()=>this._checkServerVersion();this._toastTimer=null;this._dismissedSuggestions=new Set;this._overviewTab=(()=>{try{let C=X(P.overviewTab);return C==="today"||C==="calendar"?C:"dashboard"}catch{return"dashboard"}})();this._activeTab="overview";this._costDurationToggle="both";this._historySearch="";this._sortMode="due_date";this._objectSortMode="alphabetical";this._objTableSort=null;this._groupByMode="none";this._objectViewMode="cards";this._objectsTableColumns=W3;this._showArchived=!1;this._bulkMode=!1;this._bulkSelected=new Set;this._objBulkMode=!1;this._objBulkSelected=new Set;this._bulkMenuOpen=!1;this._virtStart=0;this._virtEnd=0;this._virtHeights=new O5;this._virtKeys=[];this._virtRenderedStart=0;this._virtPasses=0;this._virtTotalRows=0;this._virtScrollAttached=!1;this._virtRaf=0;this._stickyState=$5;this._stickySelectPending=!1;this._stickyRaf=0;this._stickyAttached=!1;this._stickyObserver=null;this._collapsedGroups=new Set;this._collapsedSections=(()=>{try{return new Set(JSON.parse(X(P.collapsedSections)||"[]"))}catch{return new Set}})();this._objectSectionsCollapsed=(()=>{try{let C=JSON.parse(X(P.objectSections)||"[]");return new Set((Array.isArray(C)?C:[]).filter(e=>J7.includes(e)))}catch{return new Set}})();this._objectSectionOverride=null;this._objTreeOpen=(()=>{try{let C=JSON.parse(X(P.objectTreeOpen)||"[]");return new Set((Array.isArray(C)?C:[]).filter(e=>typeof e=="string"))}catch{return new Set}})();this._paletteOpen=!1;this._paletteQuery="";this._paletteActive=0;this._searchRemote=null;this._searchTimer=null;this._searchSeq=0;this._templateGalleryOpen=!1;this._templates=[];this._homeProfile=null;this._templateCategories={};this._templateBusy=!1;this._templateParentId=null;this._templatePreview=null;this._templatePicked=new Set;this._statsService=null;this._userService=null;this._usersVersion=0;this._rowsMemo=new Map;this._rowsMemoInputs=[];this._rowsGeneration=0;this._virtRenderedSig="";this._virtMeasuredSig="";this._hassHeld=null;this._hassTimer=0;this._lastRender=0;this._dataLoaded=!1;this._lastConnection=null;this._popstateHandler=C=>this._onPopState(C);this._locationChangedHandler=()=>this._onLocationChanged();this._lazyUi=null;this._onStickyScroll=()=>{this._stickyRaf||(this._stickyRaf=requestAnimationFrame(()=>{this._stickyRaf=0,this._updateStickyPane()}))};this._onVirtualScroll=()=>{this._virtPasses=0,!this._virtRaf&&(this._virtRaf=requestAnimationFrame(()=>{this._virtRaf=0,this._updateVirtualWindow()}))};this._deepLinkHandled=!1;this._reloadState=null;this._deepLinkInPlace=!1;this._initialLoadDone=!1;this._detailStatsSeq=new Map;this._subGen=0;this._kpiRefreshInFlight=!1;this._kpiRefreshPending=!1;this._areaUi=null;this._paletteKeydown=C=>{if(C.key==="/"&&!C.ctrlKey&&!C.metaKey&&!C.altKey&&!this._paletteOpen){let t=C.composedPath()[0];if(t instanceof HTMLElement&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"||t.isContentEditable))return;C.preventDefault(),this._openPalette();return}if(!this._paletteOpen)return;let e=this._paletteResults;if(C.key==="Escape")C.preventDefault(),this._closePalette();else if(C.key==="ArrowDown")C.preventDefault(),this._paletteActive=Math.min(this._paletteActive+1,e.length-1);else if(C.key==="ArrowUp")C.preventDefault(),this._paletteActive=Math.max(this._paletteActive-1,0);else if(C.key==="Enter"){C.preventDefault();let t=e[this._paletteActive];t&&this._selectPaletteResult(t)}};this._onObjectReplaced=async C=>{this._showToast([V("object_replaced",this._lang),this._deviceSwapText(C.detail.device_swap)].filter(Boolean).join(" \xB7 "),"info");try{await this._loadData()}catch{}C.detail.entry_id&&this._showObject(C.detail.entry_id)};this._onObjectSaved=async C=>{let e=this._deviceSwapText(C.detail?.device_swap);e&&this._showToast(e,"info"),await this._onDialogEvent()};this._checklistPending=new Map;this._checklistChain=Promise.resolve();this._onDialogEvent=async()=>{try{await this._loadData()}catch{}};this._onTaskCompleted=async C=>{await this._onDialogEvent();let e=C.detail;e?.undo&&this._offerUndo(e.entryId,e.taskId,V("task_completed_named",this._lang).replace("{task}",e.taskName))};this._onCalendarOpenTask=C=>{let e=C.detail;e?.entry_id&&e.task_id&&(C.preventDefault(),C.stopPropagation(),this._showTask(e.entry_id,e.task_id))};this._onCalendarLlCustom=C=>{let e=C.detail;e?.type==="maintenance-supporter:open-task"&&e.entry_id&&e.task_id&&(C.stopPropagation(),this._showTask(e.entry_id,e.task_id))};this._popupClosers=new Map;this._fullHistory=null;this._onHistoryEntrySaved=async()=>{await this._loadData()}}get _currencySymbol(){return G2(this._budget)}get _lang(){return F(this.hass)}get _isOperator(){return!A2(this.hass?.user,{operatorWriteEnabled:this._operatorWriteEnabled,operatorIds:this._adminPanelUserIds})}_ensureLazyUi(){return this._lazyUi||(this._lazyUi=Promise.all([import("/maintenance_supporter_panelfiles/panel-chunks/object-dialog-BRNGE4JJ.js"),import("/maintenance_supporter_panelfiles/panel-chunks/task-dialog-V3RPALQ5.js"),import("/maintenance_supporter_panelfiles/panel-chunks/complete-dialog-UMHVNTCD.js"),import("/maintenance_supporter_panelfiles/panel-chunks/qr-dialog-7GY33LZI.js"),import("/maintenance_supporter_panelfiles/panel-chunks/adopt-problem-sensors-dialog-7YMKQVWV.js"),import("/maintenance_supporter_panelfiles/panel-chunks/suggested-setups-dialog-G7PQZRKF.js"),import("/maintenance_supporter_panelfiles/panel-chunks/settings-view-54SK6JLV.js"),import("/maintenance_supporter_panelfiles/panel-chunks/bulk-edit-dialog-B2Q5FOY7.js")]).then(()=>this.updateComplete)),this._lazyUi}async _ui(C){return await this._ensureLazyUi(),this.shadowRoot?.querySelector(C)??null}connectedCallback(){super.connectedCallback(),this._mountPath=window.location.pathname;let C=window.requestIdleCallback,e=()=>this._ensureLazyUi();C?C(e,{timeout:3e3}):window.setTimeout(e,1500),window.addEventListener("popstate",this._popstateHandler),window.addEventListener("location-changed",this._locationChangedHandler),window.addEventListener("keydown",this._paletteKeydown),typeof ResizeObserver<"u"&&(this._tightObserver=new ResizeObserver(t=>{let H=t[0]?.contentRect.width??0;H>0&&(this.tight=H<1e3),H>0&&(this.split=H>=1500),H>0&&(this.wide=H>=2200)}),this._tightObserver.observe(this)),window.addEventListener("resize",this._onVirtualScroll,{passive:!0});try{let t=X(P.taskSort);t&&P5.includes(t)&&(this._sortMode=t);let H=X(P.objectSort);H&&["alphabetical","due_soonest","task_count"].includes(H)&&(this._objectSortMode=H);let[L,o]=(X(P.objectTableSort)??"").split(":");N3.includes(L)&&L!=="actions"&&(o==="asc"||o==="desc")&&(this._objTableSort={key:L,dir:o});let M=X(P.groupBy);M&&d3.includes(M)&&(this._groupByMode=M);let l=X(P.objectView);(l==="cards"||l==="table")&&(this._objectViewMode=l)}catch{}if(this._objects.length===0){let t=C7();t&&(t.beta!==void 0&&E5(t.beta),this._objects=t.objects,t.stats&&(this._stats=t.stats))}}disconnectedCallback(){super.disconnectedCallback(),this._subGen++,window.removeEventListener("popstate",this._popstateHandler),window.removeEventListener("location-changed",this._locationChangedHandler),window.removeEventListener("keydown",this._paletteKeydown);for(let C of[...this._popupClosers.keys()])this._dropPopupCloser(C);this._tightObserver?.disconnect(),this._tightObserver=null,window.removeEventListener("resize",this._onVirtualScroll),this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onVirtualScroll),this._virtScrollAttached=!1,this._virtRaf&&cancelAnimationFrame(this._virtRaf),this._detachStickyPane(),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._initialLoadDone=!1,this._watchConnection(null),this._deepLinkHandled=!1,this._searchTimer&&(clearTimeout(this._searchTimer),this._searchTimer=null),this._toastTimer&&(clearTimeout(this._toastTimer),this._toastTimer=null),this._toastMessage="",this._toastUndo=null,this._toastActionLabel="",this._statsService?.clearCache(),this._statsService=null}shouldUpdate(C){if(this.hasUpdated&&C.size===1&&C.has("hass")){let e=C.get("hass"),t=1e3-(performance.now()-this._lastRender);if(e&&this.hass&&t>0&&N0(e,this.hass))return this._hassHeld??=e,this._hassTimer||(this._hassTimer=window.setTimeout(()=>{this._hassTimer=0,this.requestUpdate()},t)),!1}return!0}willUpdate(C){super.willUpdate(C),this._hassHeld&&(C.has("hass")||C.set("hass",this._hassHeld),this._hassHeld=null),this._hassTimer&&(clearTimeout(this._hassTimer),this._hassTimer=0),C.has("_groupByMode")&&this._collapsedGroups.size>0&&(this._collapsedGroups=new Set)}updated(C){if(super.updated(C),this._lastRender=performance.now(),a2(this,C),C.has("hass")&&this.hass){if(this._dataLoaded){if(this.hass.connection!==this._lastConnection){if(this._watchConnection(this.hass.connection),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}else{this._dataLoaded=!0,this._watchConnection(this.hass.connection);let H=history.state;!this.embedded&&H?.msp_view&&H.msp_view!=="overview"?this._reloadState=H:history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},""),this._loadData(),this._subscribe()}this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new v5(this.hass),this._fetchMiniStatsForOverview()),this._userService?this._userService.updateHass(this.hass):(this._userService=new i0(this.hass),this._userService.getUsers().then(()=>{this._usersVersion++,this.requestUpdate()}))}let e=this.shadowRoot?.querySelector(".content");e&&!this._virtScrollAttached&&(e.addEventListener("scroll",this._onVirtualScroll,{passive:!0}),this._virtScrollAttached=!0),(!(C.size===1&&C.has("hass"))||this._virtRenderedSig!==this._virtMeasuredSig)&&(this._virtMeasuredSig=this._virtRenderedSig,this._updateVirtualWindow()),this._syncStickyPane(e)}_syncStickyPane(C){let e=this.shadowRoot?.querySelector(".split-pane");if(!e||!C){this._stickyAttached&&this._detachStickyPane();return}this._stickyAttached||(C.addEventListener("scroll",this._onStickyScroll,{passive:!0}),window.addEventListener("resize",this._onStickyScroll),typeof ResizeObserver<"u"&&(this._stickyObserver=new ResizeObserver(this._onStickyScroll)),this._stickyAttached=!0),this._stickyObserver?.observe(e),this._updateStickyPane()}_detachStickyPane(){this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onStickyScroll),window.removeEventListener("resize",this._onStickyScroll),this._stickyObserver?.disconnect(),this._stickyObserver=null,this._stickyRaf&&cancelAnimationFrame(this._stickyRaf),this._stickyRaf=0,this._stickyAttached=!1,this._stickyState=$5,this._stickySelectPending=!1}_updateStickyPane(){let C=this.shadowRoot,e=C?.querySelector(".content"),t=C?.querySelector(".split-pane"),H=C?.querySelector(".split-layout"),L=C?.querySelector(".split-list");if(!e||!t||!H||!L)return;let o=e.getBoundingClientRect().top-e.scrollTop,M={scrollTop:e.scrollTop,viewH:e.clientHeight,paneH:t.offsetHeight,listH:L.offsetHeight,layoutTop:H.getBoundingClientRect().top-o,renderedTop:t.getBoundingClientRect().top-o};this._stickySelectPending&&M.scrollTop===this._stickyState.lastScrollTop?this._stickyState=K7(M):(this._stickySelectPending=!1,this._stickyState=Y7(this._stickyState,M));let l=this._stickyState;t.style.top=`${Q7(l.mode,M)}px`,t.style.marginTop=l.marginTop>0?`${l.marginTop}px`:""}_resetStickyPane(){let C=this.shadowRoot?.querySelector(".content");this._stickyState={...$5,lastScrollTop:C?.scrollTop??0},this._stickySelectPending=!0}_updateVirtualWindow(){let C=this.shadowRoot?.querySelector(".content"),e=this.shadowRoot?.querySelector(".task-table.virtual");if(!C||!e)return;this._virtHeights.setWidth(e.clientWidth),e.querySelectorAll(".task-row:not(.virt-sizer)").forEach((M,l)=>{let n=this._virtKeys[this._virtRenderedStart+l];n!==void 0&&this._virtHeights.record(n,M.offsetHeight)});let L=(e.querySelector(".virt-sizer")??e).getBoundingClientRect().top-C.getBoundingClientRect().top+C.scrollTop,o=q7({scrollTop:C.scrollTop,viewportHeight:C.clientHeight,listTop:L,offsets:this._virtHeights.offsets(this._virtKeys),total:this._virtTotalRows});o.start===this._virtStart&&o.end===this._virtEnd||this._virtPasses>=8||(this._virtPasses++,this._virtStart=o.start,this._virtEnd=o.end)}_watchConnection(C){this._lastConnection?.removeEventListener?.("ready",this._onReconnect),this._lastConnection=C,C?.addEventListener?.("ready",this._onReconnect)}_checkServerVersion(){this.hass.connection.sendMessagePromise({type:"maintenance_supporter/version"}).then(C=>{this._restartPendingVersion=v3(C),this._staleBundle=!this._restartPendingVersion&&u3(C?.version)}).catch(()=>{})}async _loadData(){let[C,e,t,H,L,o]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"}).catch(()=>null)]);if(o&&(this._savedViews=o.views||[]),C&&(this._objects=B2(C.objects),C3(this._objects,e??this._stats??null,L?N5(L).features.beta_editor:M1()),this._maybeLoadGettingStarted()),this._detailOpen()&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/status"}).then(l=>{this._batteryFleetSetupAvailable=!!l.available&&!l.configured}).catch(()=>{this._batteryFleetSetupAvailable=!1}),this._staleChecked||(this._staleChecked=!0,this._checkServerVersion()),e&&(this._stats=e),t&&(this._budget=t,S2(this._budget)),H&&(this._groups=H.groups||{}),L){let l=N5(L);this._features=l.features,E5(l.features.beta_editor),this._adminPanelUserIds=[...l.access.operatorIds],this._operatorWriteEnabled=l.access.operatorWriteEnabled,this._defaultWarningDays=l.defaultWarningDays,this._mirrorTodoDefault=l.mirrorTodoDefault,this._rowActionStyle=l.rowActionStyle,this._rowActionNotice=l.rowActionNoticePending,this._refsInLists=l.refsInLists,this._objectsTableColumns=U3(l.objectsTableColumns),this._partsCostMode=l.partsCostMode}this._fetchMiniStatsForOverview(),this._initialLoadDone=!0;let M=!!window.location.search;this._handleDeepLink(),this._restoreAfterReload(M)}_restoreAfterReload(C){let e=this._reloadState;if(this._reloadState=null,!e?.msp_view||C||this._deepLinkHandled)return;if((e.msp_view==="object"||e.msp_view==="task")&&!this._getObject(e.msp_entry??"")||e.msp_view==="task"&&!this._getTask(e.msp_entry??"",e.msp_task??"")||e.msp_view==="area"&&!this._objects.some(H=>F5(H.object)===e.msp_area)){history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},"");return}this._applyPanelState(e)}_onLocationChanged(){if(!this._initialLoadDone||!window.location.search||this.embedded&&this._mountPath!==null&&window.location.pathname!==this._mountPath)return;if(!this.embedded){let e=`/${typeof this.panel?.url_path=="string"?this.panel.url_path:"maintenance-supporter"}`,t=window.location.pathname;if(t!==e&&!t.startsWith(`${e}/`))return}this._deepLinkHandled=!1,this._deepLinkInPlace=!0;try{this._handleDeepLink()}finally{this._deepLinkInPlace=!1}history.state?.msp_view||history.replaceState({msp_view:this._view,msp_entry:this._selectedEntryId,msp_task:this._selectedTaskId,msp_area:this._selectedAreaId},"")}_handleDeepLink(){if(this._deepLinkHandled)return;let C=new URLSearchParams(window.location.search),e=C.get("ms_action"),t=()=>{let h=window.location.pathname+window.location.hash;history.replaceState(history.state,"",h)};if(e==="add_object"){this._deepLinkHandled=!0,t(),this._ui("maintenance-object-dialog").then(h=>h?.openCreate());return}if(e==="open_vacation"||e==="open_budget"||e==="open_groups"||e==="open_settings"){if(this._deepLinkHandled=!0,t(),!this.hass?.user?.is_admin)return;this._overviewTab="settings",this._ensureLazyUi().then(()=>requestAnimationFrame(()=>{let h=this.shadowRoot?.querySelector("maintenance-settings-view"),x=e.replace("open_","");h?.scrollToSection?.(x)}));return}if(this.embedded&&!this._presetsApplied){this._presetsApplied=!0;let h=this.presets?.tab??"",x=(this.presets?.view??"").trim();if(!C.has("tab")&&J5.includes(h)&&(h!=="settings"||this.hass?.user?.is_admin)&&(this._overviewTab=h),!C.has("view")&&x){let S=x.toLowerCase(),u=this._savedViews.find(T=>T.id===x)??this._savedViews.find(T=>T.name.trim().toLowerCase()===S);u&&(this._overviewTab="dashboard",this._applyView(u.id))}}let H=C.get("tab"),L=C.get("view"),o=C.get("sort"),M=C.get("status");if(H!==null||L!==null||o!==null||M!==null){if(t(),this._view!=="overview"&&(this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()),J5.includes(H??"")&&(H!=="settings"||this.hass?.user?.is_admin)&&this._setOverviewTab(H),L!==null){let h=L.trim().toLowerCase(),x=this._savedViews.find(S=>S.id===L)??this._savedViews.find(S=>S.name.trim().toLowerCase()===h);x&&(this._overviewTab!=="dashboard"&&this._setOverviewTab("dashboard"),this._applyView(x.id))}P5.includes(o??"")&&(this._sortMode=o,this._activeViewId="",I(P.taskSort,this._sortMode)),p3.includes(M??"")&&(this._overviewTab!=="dashboard"&&this._setOverviewTab("dashboard"),this._filterByStatus(M))}let l=C.get("area");if(l&&!C.get("entry_id")){this._deepLinkHandled=!0,t(),this._objects.some(h=>F5(h.object)===l)?this._showArea(l):this._showAllAreas();return}let n=C.get("entry_id");if(!n)return;this._deepLinkHandled=!0;let p=C.get("task_id"),c=C.get("action"),m=C.get("section"),g=J7.includes(m??"")?m:null,Z=window.location.pathname+window.location.hash;history.replaceState(history.state,"",Z);let v=this._getObject(n);if(!v){this._showOverview();return}if(p){let h=v.tasks.find(x=>x.id===p);if(!h){this._showObject(n,g);return}this._showTask(n,p),c==="complete"?requestAnimationFrame(()=>{this._openCompleteDialog(n,p,h.name,this._features.checklists?h.checklist:void 0,this._features.adaptive&&!!h.adaptive_config?.enabled,{viaTagScan:!0})}):c==="skip"?requestAnimationFrame(()=>{h.allow_skip!==!1&&this._promptSkipTask(n,p)}):c==="quick_complete"&&requestAnimationFrame(()=>{this._handleQuickComplete(n,p,h)})}else this._showObject(n,g)}async _fetchDetailStats(C,e){if(!this._statsService)return;let t=(this._detailStatsSeq.get(C)??0)+1;this._detailStatsSeq.set(C,t);let H=await this._statsService.getDetailStats(C,e,this._chartRangeDays);if(this._detailStatsSeq.get(C)!==t)return;let L=new Map(this._detailStatsData);L.set(C,H),this._detailStatsData=L}_fetchRuleStats(C){let e=C?.trigger_config;if(!e)return;let t=b1(e);t&&this._fetchDetailStats(t,j1(e));for(let H of d2(e))H.entityId!==t&&this._fetchDetailStats(H.entityId,j1(H.cond))}_setChartRange(C){if(C===this._chartRangeDays)return;this._chartRangeDays=C;try{I(P.chartRange,String(C))}catch{}let e=this._selectedEntryId&&this._selectedTaskId?this._getTask(this._selectedEntryId,this._selectedTaskId):null,t=b1(e?.trigger_config);if(t){let H=new Map(this._detailStatsData);H.delete(t),this._detailStatsData=H,this._fetchDetailStats(t,j1(e.trigger_config))}}_setHideOutliers(C){if(C!==this._hideOutliers){this._hideOutliers=C;try{I(P.chartHideOutliers,C?"1":"0")}catch{}}}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let C=[];for(let t of this._objects)for(let H of t.tasks){let L=H.battery_fleet_task?void 0:b1(H.trigger_config);L&&C.push({entityId:L,isCounter:j1(H.trigger_config)})}if(C.length===0)return;let e=await this._statsService.getBatchMiniStats(C);this._miniStatsData=new Map([...this._miniStatsData,...e])}async _subscribe(){let C=++this._subGen;try{let e=await this.hass.connection.subscribeMessage(t=>{let H=t,L=j0(this._objects,H);L!==null&&(this._objects=L,t.objects&&C3(L,this._stats??null),this._refreshKpis(),this._detailOpen()&&(H.objects||(H.delta||[]).some(o=>o.entry_id===this._selectedEntryId))&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId))},{type:"maintenance_supporter/subscribe",deltas:!0,compact:!0});if(!this.isConnected||C!==this._subGen){e();return}this._unsub=e}catch{}}async _refreshKpis(){if(this._kpiRefreshInFlight){this._kpiRefreshPending=!0;return}this._kpiRefreshInFlight=!0;try{do{this._kpiRefreshPending=!1;let[C,e]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null)]);if(!this.isConnected)return;C&&(this._stats=C),e&&(this._budget=e,S2(this._budget))}while(this._kpiRefreshPending)}finally{this._kpiRefreshInFlight=!1}}get _taskRows(){return this._rowsFiltered(!0)}_rowsFiltered(C,e=C){let t=[this._objects,this._groups,this._listSearch,this._showArchived,this._filterStatus,this._filterUser,this._filterLabel,this._filterPlace,this._filterPriority,this._sortMode,this.hass?.areas,this.hass?.user?.id,M1(),this._usersVersion];(t.length!==this._rowsMemoInputs.length||t.some((h,x)=>h!==this._rowsMemoInputs[x]))&&(this._rowsMemo=new Map,this._rowsMemoInputs=t,this._rowsGeneration++);let H=`${C}|${e}`,L=this._rowsMemo.get(H);if(L)return L;let o=[],M=e&&M1()?this._listSearch.trim():"";for(let h of this._objects)for(let x of h.tasks){if(M&&!m3([x.name,h.object.name,...x.labels||[],h.object.area_id?this.hass?.areas?.[h.object.area_id]?.name:""].join(" "),M)||!this._showArchived&&x.archived||C&&this._filterStatus&&x.status!==this._filterStatus)continue;if(this._filterUser){let u=this._filterUser==="current_user"?this._userService?.getCurrentUserId():this._filterUser;if(!R2(x,u))continue}if(this._filterLabel&&!(x.labels||[]).includes(this._filterLabel)||this._filterPlace&&(h.object.place||"home")!==this._filterPlace||this._filterPriority&&(x.priority||"normal")!==this._filterPriority)continue;let S=[];for(let u of Object.values(this._groups))u.task_refs?.some(T=>T.entry_id===h.entry_id&&T.task_id===x.id)&&S.push(u.name);o.push({entry_id:h.entry_id,task_id:x.id,object_name:h.object.name,allow_skip:x.allow_skip!==!1,notify_enabled:x.notify_enabled!==!1,task_name:x.name,type:x.type,schedule_type:x.schedule_type,status:x.status,days_until_due:x.days_until_due??null,next_due:x.next_due??null,last_performed:x.last_performed??null,next_event_titles:x.next_event_titles??[],trigger_active:x.trigger_active,trigger_detail:x.trigger_detail??null,trigger_current_value:x.trigger_current_value??null,trigger_current_delta:x.trigger_current_delta??null,trigger_config:x.trigger_config??null,trigger_entity_info:x.trigger_entity_info??null,battery_fleet_task:x.battery_fleet_task===!0,times_performed:x.times_performed,total_cost:x.total_cost,interval_days:x.interval_days??null,interval_unit:x.interval_unit??null,interval_anchor:x.interval_anchor??null,is_done:x.is_done??!1,archived:x.archived??!1,history:x.history||[],enabled:x.enabled,nfc_tag_id:x.nfc_tag_id??null,priority:x.priority??"normal",labels:x.labels??[],area_id:h.object.area_id??null,responsible_user_id:x.responsible_user_id??null,assignee_pool:x.assignee_pool??null,group_names:S})}let l=(h,x)=>q1(h.status)-q1(x.status),n=(h,x)=>(h.days_until_due??99999)-(x.days_until_due??99999),p=(h,x)=>l(h,x)||n(h,x),c=h=>h.area_id&&this.hass?.areas?.[h.area_id]?.name||"",m=h=>I1(h).map(x=>this._userService?.getUserName(x)||"").filter(Boolean),g=h=>m(h).sort((x,S)=>x.localeCompare(S)).join(", "),Z=h=>h.group_names[0]||"",v={due_date:p,object:(h,x)=>h.object_name.localeCompare(x.object_name)||p(h,x),type:(h,x)=>h.type.localeCompare(x.type)||p(h,x),task_name:(h,x)=>h.task_name.localeCompare(x.task_name),area:(h,x)=>{let S=c(h),u=c(x);return!S&&u?1:S&&!u?-1:S.localeCompare(u)||p(h,x)},assigned_user:(h,x)=>{let S=g(h),u=g(x);return!S&&u?1:S&&!u?-1:S.localeCompare(u)||p(h,x)},group:(h,x)=>{let S=Z(h),u=Z(x);return!S&&u?1:S&&!u?-1:S.localeCompare(u)||p(h,x)}};return o.sort(v[this._sortMode]),this._rowsMemo.set(H,o),o}_getObject(C){return this._objects.find(e=>e.entry_id===C)}_getTask(C,e){return this._getObject(C)?.tasks.find(H=>H.id===e)}_listRef(C,e){if(!this._refsInLists)return s;let t=this._getObject(C);return L2(P1(t?.object,t?.tasks.find(H=>H.id===e)))}_objRef(C){return this._refsInLists?L2(k1(C)):s}_pushPanelState(C,e,t,H){let L={msp_view:C,msp_entry:e||null,msp_task:t||null,msp_area:H||null};this._deepLinkInPlace?history.replaceState(L,""):history.pushState(L,"")}_onPopState(C){let e=C.state;e?.msp_view&&this._applyPanelState(e)}_applyPanelState(C){this._view=C.msp_view??"overview",this._selectedEntryId=C.msp_entry||null,this._selectedTaskId=C.msp_task||null,this._selectedAreaId=C.msp_area||null,this._moreMenuOpen=!1,this._objectSectionOverride=null,C.msp_view==="all_parts"&&this._loadAllParts(),(C.msp_view==="task"||C.msp_view==="object")&&C.msp_entry&&C.msp_task&&(this._historyFilter=null,this._fetchFullHistory(C.msp_entry,C.msp_task),this._fetchRuleStats(this._getTask(C.msp_entry,C.msp_task)))}_showOverview(){this._pushPanelState("overview"),this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()}_showAllObjects(){this._pushPanelState("all_objects"),this._view="all_objects",this._objBulkMode=!1,this._objBulkSelected=new Set,this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_showAllParts(){this._pushPanelState("all_parts"),this._view="all_parts",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop(),this._loadAllParts()}async _loadAllParts(){try{let C=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});this._allParts=C.parts||[]}catch{this._allParts=[]}}_showAllAreas(){this._pushPanelState("all_areas"),this._view="all_areas",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_showArea(C){this._pushPanelState("area",null,null,C),this._view="area",this._selectedAreaId=C,this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_ensureAreaUi(){this._areaUi??=Promise.all([import("/maintenance_supporter_panelfiles/panel-chunks/areas-view-KR4DAOGK.js"),import("/maintenance_supporter_panelfiles/panel-chunks/area-view-XTRN2QLE.js")]).catch(()=>{this._areaUi=null})}_filterByStatus(C){this._filterStatus=C,this._activeViewId="",this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard"),this._scrollContentToTop()}get _allLabels(){let C=new Set;for(let e of this._objects)for(let t of e.tasks)for(let H of t.labels||[])C.add(H);return[...C].sort((e,t)=>e.localeCompare(t))}get _allPlaces(){let C=new Map;for(let e of this._objects){let t=e.object;t.place&&!C.has(t.place)&&C.set(t.place,t.place_name||t.place)}return[...C].map(([e,t])=>({id:e,name:t})).sort((e,t)=>e.name.localeCompare(t.name))}get _currentFilters(){return{status:this._filterStatus,user_id:this._filterUser,label:this._filterLabel,priority:this._filterPriority,place:this._filterPlace,archived:this._showArchived,sort_mode:this._sortMode,group_by:this._groupByMode}}_applyView(C){if(this._activeViewId=C,!C)return;let e=this._savedViews.find(H=>H.id===C);if(!e)return;let t=e.filters;this._filterStatus=t.status||"",this._filterUser=t.user_id||null,this._filterLabel=t.label||null,this._filterPriority=t.priority||"",this._filterPlace=t.place||"",this._showArchived=!!t.archived,P5.includes(t.sort_mode)&&(this._sortMode=t.sort_mode),d3.includes(t.group_by)&&(this._groupByMode=t.group_by);try{I(P.taskSort,this._sortMode),I(P.groupBy,this._groupByMode)}catch{}this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard")}_openSavedViewsDialog(){this.shadowRoot.querySelector("maintenance-saved-views-dialog")?.open(this._currentFilters,this._savedViews)}_onSavedViewsChanged(C){this._savedViews=C.detail.views||[],this._activeViewId&&!this._savedViews.some(e=>e.id===this._activeViewId)&&(this._activeViewId="")}_scrollContentToTop(){requestAnimationFrame(()=>{let C=this.shadowRoot?.querySelector(".content");C&&C.scrollTo({top:0,behavior:"smooth"})})}_renderLineageLink(C,e){let t=C?this._objects.find(H=>H.entry_id===C):void 0;return t?i`<p class="meta">${e}:
      <a href="#" class="object-lineage-link" @click=${H=>{H.preventDefault(),this._showObject(t.entry_id)}}
        >${t.object.name}</a></p>`:s}_addSubObject(C){this._ui("maintenance-object-dialog").then(e=>e?.openCreate(C))}_moveHereChoices(C){let e=this._objects,t=new Set(Q5(e,C).map(H=>H.entry_id));return e.filter(H=>H.entry_id!==C&&!t.has(H.entry_id)&&H.object.parent_entry_id!==C&&G5(H)).map(H=>({value:H.entry_id,label:x0(e,H)})).sort((H,L)=>H.label.localeCompare(L.label))}async _moveObjectHere(C){let e=this._moveHereChoices(C);if(!e.length)return;let t=this._lang,H=this._objects.find(M=>M.entry_id===C)?.object.name??"",o=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:V("sub_object_move_here",t),message:V("sub_object_move_message",t).replace("{name}",H),confirmText:V("sub_object_move_confirm",t),inputLabel:V("object",t),inputValue:e[0].value,options:e});!o?.confirmed||!o.value||await this._runAction({type:"maintenance_supporter/object/update",entry_id:o.value,parent_entry_id:C},{successToast:V("sub_object_moved",t).replace("{name}",H)})}_toggleSubObjMenu(C){this._subObjMenu&&this._subObjMenu!==C&&(this._subObjMenu=null),this._togglePopup("sub-object",()=>this._subObjMenu!==null,e=>{this._subObjMenu=e?C:null})}_closeSubObjMenu(){this._subObjMenu=null}_renderSubObjMenu(C,e){return t2(this._subObjEntries(C,e),()=>this._closeSubObjMenu(),`sub-object-menu${this._subObjMenu==="head"?" sub-object-menu-head":""}`)}_subObjEntries(C,e,t=""){let H=L=>t?`${t}: ${L}`:L;return[{label:H(V("new_object",e).replace(/^\+\s*/,"")),icon:"mdi:package-variant-closed-plus",cls:"sub-object-new",action:()=>this._addSubObject(C)},{label:H(V("templates_from",e)),icon:"mdi:view-grid-plus-outline",cls:"sub-object-template",action:()=>{this._openTemplateGallery(C)}},this._moveHereChoices(C).length>0&&{label:H(V("sub_object_move_here",e)),icon:"mdi:folder-move-outline",cls:"sub-object-move",action:()=>{this._moveObjectHere(C)}}]}_objMenuEntries(C,e,t,H,L){let o=C.object,M=!t;return[{label:V("qr_code",H),action:()=>this._openQrForObject(C.entry_id,o.name)},{label:V("report_button",H),action:()=>this._printObjectReport(C.entry_id)},M&&!o.battery_fleet&&{label:V("duplicate",H),action:()=>this._duplicateObject(C.entry_id)},...M&&e?L?this._subObjEntries(C.entry_id,H,V("add_sub_object",H)):[{label:V("add_sub_object",H),cls:"add-sub-object-item",action:()=>this._toggleSubObjMenu("more")}]:[],M&&!o.archived&&{label:o.paused?V("resume_object",H):V("pause_object",H),action:()=>this._togglePauseObject(C.entry_id,!!o.paused)},M&&!o.archived&&!o.battery_fleet&&{label:V("replace_object",H),action:()=>this._replaceObject(C.entry_id,o)},M&&{label:o.archived?V("unarchive_object",H):V("archive_object",H),action:()=>this._toggleArchiveObject(C.entry_id,!!o.archived)},M&&"divider",M&&{label:V("delete",H),danger:!0,action:()=>this._deleteObject(C.entry_id)}]}_showObject(C,e=null){this._pushPanelState("object",C),this._view="object",this._selectedEntryId=C,this._selectedTaskId=null,this._objectSectionOverride=e,e?this._scrollToObjectSection(e):this._scrollContentToTop()}_scrollToObjectSection(C){this.updateComplete.then(()=>requestAnimationFrame(()=>{let e=this.shadowRoot?.querySelector(`.obj-section[data-section="${C}"]`);e?e.scrollIntoView({block:"start",behavior:"smooth"}):this._scrollContentToTop()}))}_toggleObjectSection(C){let e=new Set(this._objectSectionsCollapsed);this._objectSectionOverride===C||!e.has(C)?e.add(C):e.delete(C),this._objectSectionOverride===C&&(this._objectSectionOverride=null),this._objectSectionsCollapsed=e,I(P.objectSections,JSON.stringify([...e]))}_splitActive(){return this.split&&!this.narrow&&!this.tight&&this._view==="overview"&&this._overviewTab==="dashboard"&&!this._bulkMode}_detailOpen(){return(this._view==="task"||this._splitActive()||this._objectSplitActive())&&!!this._selectedEntryId&&!!this._selectedTaskId}_objectSplitActive(){return M1()&&this.split&&!this.narrow&&!this.tight&&this._view==="object"&&!this._objBulkMode}_showFullTaskPage(C,e){this._view!=="task"&&(this._pushPanelState("task",C,e),this._view="task",this._selectedEntryId=C,this._selectedTaskId=e,this._scrollContentToTop())}_showTask(C,e){let t=this._objectSplitActive()&&C===this._selectedEntryId;if(t&&history.replaceState({...history.state,msp_task:e},""),this._splitActive()||t){this._selectedEntryId=C,this._selectedTaskId=e,this._activeTab="overview",this._historyFilter=null,this._historySearch="",this._resetStickyPane(),this._fetchFullHistory(C,e),this._fetchRuleStats(this._getTask(C,e));return}this._pushPanelState("task",C,e),this._view="task",this._selectedEntryId=C,this._selectedTaskId=e,this._activeTab="overview",this._historyFilter=null,this._historySearch="",this._scrollContentToTop(),this._fetchFullHistory(C,e),this._fetchRuleStats(this._getTask(C,e))}_showToast(C,e="error"){if(M1()){Y5(this,C);return}this._toastTimer&&clearTimeout(this._toastTimer),this._toastKind=e,this._toastUndo=null,this._toastActionLabel="",this._toastMessage=C,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastTimer=null},4e3)}_showActionToast(C,e,t){this._showUndoToast(C,t,e)}_showUndoToast(C,e,t=""){if(M1()){Y5(this,C,{text:t||V("undo",this._lang),action:e});return}this._toastTimer&&clearTimeout(this._toastTimer),this._toastKind="info",this._toastActionLabel=t,this._toastMessage=C,this._toastUndo=e,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastUndo=null,this._toastTimer=null},7e3)}_runToastUndo(){let C=this._toastUndo;this._toastTimer&&clearTimeout(this._toastTimer),this._toastMessage="",this._toastUndo=null,this._toastTimer=null,C?.()}_openPalette(){this._paletteQuery="",this._paletteActive=0,this._paletteOpen=!0,this._searchRemote=null,this.updateComplete.then(()=>{this.shadowRoot?.querySelector(".palette-input")?.focus()})}_closePalette(){this._paletteOpen=!1,this._paletteQuery="",this._searchRemote=null,this._searchTimer&&(clearTimeout(this._searchTimer),this._searchTimer=null)}_onPaletteInput(C){this._paletteQuery=C,this._paletteActive=0,this._searchTimer&&clearTimeout(this._searchTimer);let e=C.trim();if(e.length<T5){this._searchRemote=null;return}this._searchTimer=setTimeout(()=>{this._searchTimer=null;let t=++this._searchSeq;this.hass.connection.sendMessagePromise({type:"maintenance_supporter/search",query:e,limit:V2.documents}).then(H=>{t!==this._searchSeq||!this._paletteOpen||(this._searchRemote={query:e,documents:H.documents||[],history:H.history||[]})}).catch(()=>{t!==this._searchSeq||!this._paletteOpen||(this._searchRemote={query:e,documents:[],history:[]})})},Z9)}get _paletteResults(){let C=this._lang,e=this._paletteQuery.trim();if(e.length<T5&&!I2(e))return[];let t=F2(e);if(!t.length)return[];let H=[],L=[],o=[],M=I2(e);if(M){for(let c of this._objects){let m=c.object;if(m.ref_no!==M.object)continue;let g=k1(m),Z=(v,h)=>v?[h,V("archived",C)].filter(Boolean).join(" \xB7 "):h;M.task==null&&H.push({kind:"object",entryId:c.entry_id,label:m.name||"",sub:Z(m.archived,V("object",C)),score:1e3,icon:"mdi:package-variant-closed",ref:g});for(let v of c.tasks)M.task!=null&&v.ref_no!==M.task||L.push({kind:"task",entryId:c.entry_id,taskId:v.id,label:v.name||"",sub:Z(v.archived||m.archived,m.name||""),score:M.task==null?900:1e3,icon:"mdi:clipboard-check-outline",ref:P1(m,v)})}if(H.length||L.length){let c=this._searchRemote&&this._searchRemote.query===e?this._searchRemote:null,m=[...H,...L.slice(0,V2.tasks)];for(let g of c?.history.slice(0,1)??[])m.push({kind:"history",entryId:g.entry_id,taskId:g.task_id,label:g.task_name||"",sub:[g.object_name,g.timestamp?N(g.timestamp,C):""].filter(Boolean).join(" \xB7 "),snippet:g.snippet||"",score:g.score,icon:"mdi:note-text-outline",ref:g.ref??null});return m}}for(let c of this._objects){let m=c.object;if(m.archived)continue;let g=m.name||"",Z=r2(t,[{text:g,weight:3},{text:m.manufacturer,weight:2},{text:m.model,weight:2},{text:m.serial_number,weight:2},{text:m.notes,weight:1}]);if(Z>0){let v=[m.manufacturer,m.model].filter(Boolean).join(" ");H.push({kind:"object",entryId:c.entry_id,label:g,sub:v||V("object",C),score:Z,icon:"mdi:package-variant-closed",ref:k1(m)})}for(let v of c.tasks){if(v.archived)continue;let h=(v.labels||[]).join(" "),x=r2(t,[{text:v.name,weight:3},{text:g,weight:2},{text:h,weight:2},{text:v.notes,weight:1}]);if(x>0){let S=(v.labels||[]).length?`  #${(v.labels||[]).join(" #")}`:"";L.push({kind:"task",entryId:c.entry_id,taskId:v.id,label:v.name||"",sub:g+S,score:x,icon:"mdi:clipboard-check-outline",ref:P1(m,v)})}}for(let v of c.parts||[]){let h=r2(t,[{text:v.name,weight:3},{text:v.mpn,weight:2},{text:v.vendor,weight:1},{text:v.storage_location,weight:1},{text:v.notes,weight:1}]);h>0&&o.push({kind:"part",entryId:c.entry_id,label:v.name||"",sub:[g,v.mpn].filter(Boolean).join(" \xB7 "),score:h,icon:"mdi:cog-outline"})}}let l=(c,m)=>m.score-c.score||c.label.localeCompare(m.label),n=[...H.sort(l).slice(0,V2.objects),...L.sort(l).slice(0,V2.tasks),...o.sort(l).slice(0,V2.parts)],p=this._searchRemote&&this._searchRemote.query===e?this._searchRemote:null;if(p){let c=p.documents.slice(0,V2.documents);for(let m of[...c.filter(g=>g.match!=="content"),...c.filter(g=>g.match==="content")])n.push({kind:m.match==="content"?"content":"document",entryId:m.entry_id,docId:m.id,docKind:m.kind,url:m.url,page:m.page??null,label:c1(m),sub:m.object_name||"",snippet:m.snippet||"",score:m.score,icon:m.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"});for(let m of p.history.slice(0,V2.history))n.push({kind:"history",entryId:m.entry_id,taskId:m.task_id,label:m.task_name||"",ref:m.ref??null,sub:[m.object_name,m.timestamp?N(m.timestamp,C):""].filter(Boolean).join(" \xB7 "),snippet:m.snippet||"",score:m.score,icon:m.type==="skipped"?"mdi:skip-next-circle-outline":"mdi:note-text-outline"})}return n}_selectPaletteResult(C){let e=this._paletteQuery.trim();switch(this._closePalette(),C.kind){case"task":C.taskId&&this._showTask(C.entryId,C.taskId);return;case"history":if(!C.taskId)return;this._showTask(C.entryId,C.taskId),this._activeTab="history",this._historySearch=e;return;case"document":case"content":C.docKind==="weblink"?o1(C.url)&&window.open(C.url,"_blank","noopener"):C.docId&&E1(this.hass,C.docId,C.page?`#page=${C.page}`:"").catch(()=>{}),this._showObject(C.entryId,"documents");return;case"part":this._showObject(C.entryId,"parts");return;default:this._showObject(C.entryId)}}_renderPalette(){if(!this._paletteOpen)return s;let C=this._lang,e=this._paletteResults,t=this._paletteQuery.trim(),H={object:V("objects",C),task:V("tasks",C),part:V("search_group_parts",C),document:V("documents",C),content:V("search_group_content",C),history:V("search_group_history",C)},L=t.length>=T5&&(!this._searchRemote||this._searchRemote.query!==t),o=null;return i`
      <div class="palette-backdrop top-layer" popover="manual" ${s2} @click=${()=>this._closePalette()}>
        <div class="palette" role="dialog" aria-label=${V("search_open",C)} @click=${M=>M.stopPropagation()}>
          <input
            class="palette-input"
            type="text"
            placeholder="${V("palette_placeholder",C)}"
            .value=${this._paletteQuery}
            @input=${M=>this._onPaletteInput(M.target.value)}
          />
          <div class="palette-results">
            ${t.length<T5&&!I2(t)?i`<div class="palette-empty">${V("search_empty_hint",C)}</div>`:e.length===0?i`<div class="palette-empty">${L?V("search_searching",C):V("palette_no_results",C)}</div>`:e.map((M,l)=>{let n=M.kind!==o?i`<div class="palette-group">${H[M.kind]}</div>`:s;return o=M.kind,i`
                      ${n}
                      <div class="palette-item ${l===this._paletteActive?"active":""} ${M.snippet?"has-snippet":""}"
                        @mouseenter=${()=>{this._paletteActive=l}}
                        @click=${()=>this._selectPaletteResult(M)}>
                        <ha-icon icon="${M.icon}"></ha-icon>
                        <div class="palette-main">
                          <div class="palette-line">
                            <span class="palette-label">${M.label}</span>
                            ${M.ref?i`<span class="ref-chip">#${M.ref}</span>`:s}
                            ${M.page?i`<span class="palette-page">${V("search_page",C).replace("{page}",String(M.page))}</span>`:s}
                            <span class="palette-sub">${M.sub}</span>
                          </div>
                          ${M.snippet?i`<div class="palette-snippet">${M.snippet}</div>`:s}
                        </div>
                      </div>
                    `})}
            ${e.length>0&&L?i`<div class="palette-group palette-waiting">${V("search_searching",C)}</div>`:s}
          </div>
          <div class="palette-hint">${V("palette_hint",C)}</div>
        </div>
      </div>
    `}_openAdoptProblemSensors(){this._ui("maintenance-adopt-problem-sensors-dialog").then(C=>C?.open())}async _onProblemSensorsAdopted(C){let e=C.detail?.tasks_created??0,t=C.detail?.created??[];await this._loadData();let H=p1("adopt_problem_done","adopt_problem_done_one",e,this._lang,"tasks");t.length>0?this._showActionToast(H,V("adopt_problem_configure",this._lang),()=>{let L=t.flatMap(o=>{let M=this._objects.find(l=>l.entry_id===o.entry_id)?.tasks.find(l=>l.id===o.task_id);return M?[{entryId:o.entry_id,task:M}]:[]});L.length>0&&this._ui("maintenance-task-dialog").then(o=>o?.openEditSeries(L))}):this._showToast(H,"info")}async _setupBatteryFleet(){let C=await B(this,{type:"maintenance_supporter/battery_fleet/setup",language:F(this.hass)},{reload:async()=>{this._batteryFleetSetupAvailable=!1,await this._loadData()},onError:H=>this._showToast(H)});if(C===void 0)return;let e=this._objects.find(H=>H.entry_id===C?.entry_id),t=e?.tasks.find(H=>H.id===C?.task_id)||e?.tasks[0];e&&t&&this._showTask(e.entry_id,t.id),this._showToast(V("battery_fleet_setup_done",this._lang),"info")}_openSuggestedSetups(){this._ui("maintenance-suggested-setups-dialog").then(C=>C?.open())}_onResetsWired(C){let e=C.detail?.wired??0;this._showToast(p1("reset_offers_done","reset_offers_done_one",e,this._lang,"count"),"info"),this._resetOffersLoaded=!1,this._resetOffersCount=0,this._maybeLoadResetOffers(),this._loadData()}_onSetupsAdopted(C){let e=C.detail?.tasks_created??0;this._showToast(p1("setups_done","setups_done_one",e,this._lang,"tasks"),"info"),this._loadData()}async _openTemplateGallery(C=null){this._templateParentId=C,this._templateGalleryOpen=!0,this._templatePreview=null;let e=await B(this,{type:"maintenance_supporter/templates",language:this._lang},{onError:t=>this._showToast(t)});e!==void 0&&(this._templateCategories=e?.categories||{},this._templates=(e?.templates||[]).filter(t=>!t.disabled),this._homeProfile=e?.profile??null)}async _createFromTemplate(C,e){let t=await B(this,{type:"maintenance_supporter/object/from_template",language:this._lang,template_id:C,...this._templateParentId?{parent_entry_id:this._templateParentId}:{},...e?{task_names:e}:{}},{busy:H=>{this._templateBusy=H},reload:async()=>{this._templateGalleryOpen=!1,this._templatePreview=null,await this._loadData()},successToast:V("template_created",this._lang),onSuccess:H=>this._showToast(H,"info"),onError:H=>this._showToast(H)});t?.entry_id&&this._showObject(t.entry_id)}_categoryName(C){let e=this._templateCategories[C];return e&&(e[`name_${this._lang}`]||e.name_en)||C}_renderTemplateCard(C,e=!1){let t=this._lang,H=this._homeProfile?.country??null;return i`
      <button class="template-card ${C.dwelling_mismatch?"not-typical":""}" .disabled=${this._templateBusy}
        title=${C.dwelling_mismatch?V("templates_not_typical",t):""}
        @click=${()=>this._features.beta_editor?this._openTemplatePreview(C):this._createFromTemplate(C.id)}>
        <span class="template-card-name">${C.name}</span>
        <span class="template-card-count">${p1("templates_task_count","templates_task_count_one",C.tasks.length,t)}</span>
        ${e&&C.reasons?.length?i`<span class="template-card-reasons">
              ${C.reasons.map(L=>i`<span class="template-card-reason">${K3(L,t,H)}</span>`)}
            </span>`:s}
        ${C.set_up?i`<span class="template-card-setup"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${V("templates_set_up",t)}</span>`:s}
      </button>
    `}_openTemplatePreview(C){this._templatePreview=C,this._templatePicked=new Set(C.tasks.map((e,t)=>t))}_toggleTemplateTask(C,e){let t=new Set(this._templatePicked);e?t.add(C):t.delete(C),this._templatePicked=t}_renderTemplatePreview(C){let e=this._lang,t=C.tasks,H=this._templatePicked,L=t.filter((l,n)=>H.has(n)).length,o=l=>l.interval_days&&l.interval_days>0?V("beta_rules_every",e).replace("{interval}",w1(l.interval_days,"day",e)):V(l.schedule_type||"manual",e),M=()=>{this._templateGalleryOpen=!1,this._templatePreview=null};return i`
      <div class="palette-backdrop top-layer" popover="manual" ${s2} @click=${M}>
        <div class="template-gallery template-preview" @click=${l=>l.stopPropagation()}>
          <div class="template-gallery-head">
            <ha-icon-button class="template-preview-back" .label=${V("back",e)} .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
              @click=${()=>{this._templatePreview=null}}></ha-icon-button>
            <span class="template-preview-name">${C.name}</span>
            <ha-icon-button .label=${V("close",e)} .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
              @click=${M}></ha-icon-button>
          </div>
          <div class="template-gallery-body">
            <div class="template-cat-head">${V("beta_template_pick",e)}</div>
            ${t.map((l,n)=>i`
              ${Y1({cls:"template-preview-task",checked:H.has(n),onChange:p=>this._toggleTemplateTask(n,p.target.checked)},i`<span class="template-preview-text">
                  <span class="template-preview-task-name">${l.name}</span>
                  <span class="template-preview-rule">${o(l)}</span>
                </span>`)}`)}
            ${L===0?i`<div class="template-cat-hint template-preview-none">${V("beta_template_none",e)}</div>`:s}
            <div class="template-preview-actions">
              <ha-button class="template-preview-create" .disabled=${L===0||this._templateBusy}
                @click=${()=>this._createFromTemplate(C.id,t.filter((l,n)=>H.has(n)).map(l=>l.name))}>
                ${p1("beta_template_create","beta_template_create_one",L,e)}
              </ha-button>
            </div>
          </div>
        </div>
      </div>
    `}_renderTemplateGallery(){if(!this._templateGalleryOpen)return s;if(this._templatePreview)return this._renderTemplatePreview(this._templatePreview);let C=this._lang,e=new Map;for(let L of this._templates)e.has(L.category)||e.set(L.category,[]),e.get(L.category).push(L);for(let L of e.values())L.sort((o,M)=>+!!o.dwelling_mismatch-+!!M.dwelling_mismatch);let t=this._templates.filter(L=>L.recommended&&!L.set_up),H=this._templateParentId?this._objects.find(L=>L.entry_id===this._templateParentId):void 0;return i`
      <div class="palette-backdrop top-layer" popover="manual" ${s2} @click=${()=>{this._templateGalleryOpen=!1}}>
        <div class="template-gallery" @click=${L=>L.stopPropagation()}>
          <div class="template-gallery-head">
            <span>${V("templates_title",C)}</span>
            <ha-icon-button .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
              @click=${()=>{this._templateGalleryOpen=!1}}></ha-icon-button>
          </div>
          <div class="template-gallery-body">
            ${H?i`
              <div class="template-parent-hint">
                <ha-icon icon="mdi:file-tree-outline"></ha-icon>
                <span>${V("templates_inside",C).replace("{name}",H.object.name)}</span>
              </div>`:s}
            <div class="template-legal">
              <ha-icon icon="mdi:scale-balance"></ha-icon>
              <span>${V("templates_legal_hint",C)}</span>
            </div>
            ${t.length>0?i`
                  <div class="template-cat recommended">
                    <div class="template-cat-head">
                      <ha-icon icon="mdi:home-heart"></ha-icon>
                      ${V("templates_recommended_title",C)}
                    </div>
                    <div class="template-cat-hint">${V("templates_recommended_hint",C)}</div>
                    <div class="template-grid">${t.map(L=>this._renderTemplateCard(L,!0))}</div>
                  </div>`:s}
            ${this._templates.length===0?i`<div class="palette-empty">${V("loading",C)}…</div>`:[...e.entries()].map(([L,o])=>i`
                  <div class="template-cat">
                    <div class="template-cat-head">
                      <ha-icon icon="${this._templateCategories[L]?.icon||"mdi:folder-outline"}"></ha-icon>
                      ${this._categoryName(L)}
                    </div>
                    <div class="template-grid">${o.map(M=>this._renderTemplateCard(M))}</div>
                  </div>
                `)}
          </div>
        </div>
      </div>
    `}_bulkKey(C){return`${C.entry_id}:${C.task_id}`}_toggleBulkMode(){this._bulkMode=!this._bulkMode,this._bulkMenuOpen=!1,this._bulkMode||(this._bulkSelected=new Set)}_toggleBulkRow(C){let e=this._bulkKey(C),t=new Set(this._bulkSelected);t.has(e)?t.delete(e):t.add(e),this._bulkSelected=t}_bulkSelectAll(C){let e=C.map(H=>this._bulkKey(H)),t=e.every(H=>this._bulkSelected.has(H));this._bulkSelected=t?new Set:new Set(e)}async _runBulkItems(C,e,t,H,L){if(C.length===0)return;this._actionLoading=!0;let{done:o,failed:M}=await D3(this,C,e);this._actionLoading=!1,H(),await this._loadData();let l=D5(t(o.length),M,this._lang);L&&o.length>0?this._showUndoToast(l,()=>L(o)):this._showToast(l,M.length>0?"error":"info")}_runBulk(C,e,t,H){return this._runBulkItems(C.filter(L=>this._bulkSelected.has(this._bulkKey(L))),e,t,()=>{this._bulkSelected=new Set,this._bulkMode=!1},H)}async _bulkMove(C){let e=this._objects.filter(o=>!o.object.archived_at).sort((o,M)=>(o.object.name||"").localeCompare(M.object.name||""));if(!e.length||this._bulkSelected.size===0)return;let H=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:V("move_task_title",this._lang),message:V("bulk_move_message",this._lang),confirmText:V("move_task_title",this._lang),inputLabel:V("move_task_target",this._lang),inputValue:e[0].entry_id,options:e.map(o=>({value:o.entry_id,label:o.object.name||o.entry_id}))});if(!H?.confirmed||!H.value)return;let L=H.value;await this._runBulk(C.filter(o=>o.entry_id!==L),o=>({type:"maintenance_supporter/task/move",entry_id:o.entry_id,task_id:o.task_id,target_entry_id:L}),o=>V("bulk_moved",this._lang).replace("{n}",String(o)))}_toggleObjBulkMode(){this._objBulkMode=!this._objBulkMode,this._objBulkMode||(this._objBulkSelected=new Set)}_toggleObjBulk(C){let e=new Set(this._objBulkSelected);e.has(C)?e.delete(C):e.add(C),this._objBulkSelected=e}_objBulkSelectAll(C){let e=C.map(H=>H.entry_id),t=e.length>0&&e.every(H=>this._objBulkSelected.has(H));this._objBulkSelected=t?new Set:new Set(e)}_runObjBulk(C,e,t,H={}){return this._runBulkItems([...this._objBulkSelected],L=>({type:C,entry_id:L,...H}),e,()=>{this._objBulkSelected=new Set,this._objBulkMode=!1},t?L=>{t(L)}:void 0)}async _objBulkDelete(){let C=this._objBulkSelected.size;C===0||!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:V("delete",this._lang),message:V("bulk_delete_objects_confirm",this._lang).replace("{n}",String(C)),confirmText:V("delete",this._lang),danger:!0})||await this._runObjBulk("maintenance_supporter/object/delete",H=>V("bulk_objects_deleted",this._lang).replace("{n}",String(H)))}async _objBulkArea(){let C=[...this._objBulkSelected];if(C.length===0)return;let e=Object.values(this.hass?.areas||{}).sort((o,M)=>o.name.localeCompare(M.name)),H=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:V("area",this._lang),message:V("bulk_n_selected",this._lang).replace("{n}",String(C.length)),confirmText:V("save",this._lang),inputLabel:V("area",this._lang),inputValue:"",options:[{value:"",label:V("no_area",this._lang)},...e.map(o=>({value:o.area_id,label:o.name}))]});if(!H?.confirmed)return;let L=new Map(C.map(o=>[o,this._getObject(o)?.object.area_id??null]));this._runObjBulk("maintenance_supporter/object/update",o=>V("bulk_objects_area",this._lang).replace("{n}",String(o)),async o=>{for(let M of o)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:M,area_id:L.get(M)??null})}catch{}await this._loadData()},{area_id:H.value||null})}_objBulkArchive(){this._runObjBulk("maintenance_supporter/object/archive",C=>V("bulk_objects_archived",this._lang).replace("{n}",String(C)),async C=>{for(let e of C)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/unarchive",entry_id:e,undo:!0})}catch{}await this._loadData()})}_renderObjBulkBar(C,e){let t=this._objBulkSelected.size,H=C.length>0&&C.every(L=>this._objBulkSelected.has(L.entry_id));return i`
      <div class="bulk-bar obj-bulk-bar">
        ${Y1({cls:"bulk-selectall",checked:H,onChange:()=>this._objBulkSelectAll(C)},i`${V("bulk_select_all",e)}`)}
        <span class="bulk-count">${V("bulk_n_selected",e).replace("{n}",String(t))}</span>
        <span class="bulk-actions">
          <ha-button appearance="plain" class="obj-bulk-area" .disabled=${t===0||this._actionLoading} @click=${()=>{this._objBulkArea()}}>
            <ha-icon icon="mdi:floor-plan"></ha-icon> ${V("area",e)}…
          </ha-button>
          <ha-button appearance="plain" class="obj-bulk-archive" .disabled=${t===0||this._actionLoading} @click=${()=>this._objBulkArchive()}>
            <ha-icon icon="mdi:archive-outline"></ha-icon> ${V("archive",e)}
          </ha-button>
          <ha-button appearance="filled" variant="danger" class="obj-bulk-delete" .disabled=${t===0||this._actionLoading} @click=${()=>this._objBulkDelete()}>
            <ha-icon icon="mdi:delete-outline"></ha-icon> ${V("delete",e)}
          </ha-button>
        </span>
      </div>
    `}_bulkComplete(C){this._runBulk(C,e=>({type:"maintenance_supporter/task/complete",entry_id:e.entry_id,task_id:e.task_id}),e=>V("bulk_completed",this._lang).replace("{n}",String(e)))}_bulkArchive(C){this._runBulk(C,e=>({type:"maintenance_supporter/task/archive",entry_id:e.entry_id,task_id:e.task_id}),e=>V("bulk_archived",this._lang).replace("{n}",String(e)),async e=>{for(let t of e)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/unarchive",entry_id:t.entry_id,task_id:t.task_id,undo:!0})}catch{}await this._loadData()})}async _bulkEdit(C,e){let t=e.filter(M=>this._bulkSelected.has(this._bulkKey(M)));if(t.length===0)return;let H=await this._ui("maintenance-bulk-edit-dialog"),L=this._userService?await this._userService.getUsers():[],o=await H?.open(C,t,L);o&&await this._sendBulkUpdate(t.map(M=>({entry_id:M.entry_id,task_id:M.task_id})),o)}async _sendBulkUpdate(C,e){let t=await B(this,{type:"maintenance_supporter/tasks/update_many",items:C,...e?{changes:e}:{}},{busy:M=>{this._actionLoading=M},onError:M=>this._showToast(M,"error")});if(!t)return;let H=e===null;H||(this._bulkSelected=new Set,this._bulkMode=!1),await this._loadData();let L=j3(t.failed,this._lang),o=D5(V("bulk_updated",this._lang).replace("{n}",String(t.updated.length)),L,this._lang);!H&&t.previous.length>0?this._showUndoToast(o,()=>{this._sendBulkUpdate(t.previous,null)}):this._showToast(o,L.length>0?"error":"info")}async _bulkPause(C){let e=C.filter(L=>this._bulkSelected.has(this._bulkKey(L))&&L.status!=="paused");if(e.length===0)return;let H=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:V("pause_task",this._lang),message:V("pause_task_prompt",this._lang),confirmText:V("pause_task",this._lang),inputLabel:V("pause_until_label",this._lang),inputType:"date"});H?.confirmed&&this._runBulk(e,L=>({type:"maintenance_supporter/task/pause",entry_id:L.entry_id,task_id:L.task_id,...H.value?{until:H.value}:{}}),L=>V("bulk_paused",this._lang).replace("{n}",String(L)),async L=>{for(let o of L)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/resume",entry_id:o.entry_id,task_id:o.task_id,undo:!0})}catch{}await this._loadData()})}_bulkResume(C){this._runBulk(C.filter(e=>e.status==="paused"),e=>({type:"maintenance_supporter/task/resume",entry_id:e.entry_id,task_id:e.task_id}),e=>V("bulk_resumed",this._lang).replace("{n}",String(e)))}async _runAction(C,e){let t=await B(this,C,{busy:H=>{this._actionLoading=H},reload:()=>this._loadData(),successToast:e?.successToast,onSuccess:H=>this._showToast(H,"info"),onError:H=>this._showToast(H)});return t===void 0?null:t??{}}async _deleteObject(C){if(!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:V("delete",this._lang),message:V("delete_object_confirm",this._lang),confirmText:V("delete",this._lang),danger:!0}))return;await this._runAction({type:"maintenance_supporter/object/delete",entry_id:C})&&this._showOverview()}_printObjectReport(C){let e=this._getObject(C);if(!e)return;let t=this._lang,H={title:V("report_title",t),generated:V("report_generated",t),manufacturer:V("manufacturer",t),model:V("model",t),serial:V("serial_number_label",t),installed:V("installed",t),warranty:V("warranty",t),area:V("area",t),notes:V("report_notes",t),tasksHeading:V("tasks",t),colTask:V("task_name",t),colType:V("report_col_type",t),colStatus:V("report_col_status",t),colSchedule:V("report_col_schedule",t),colLastDone:V("last_performed",t),colNextDue:V("next_due",t),colCost:V("cost",t),colTimes:V("report_times_done",t),totalCost:V("report_total_cost",t),scheduleLabel:o=>R1(o,t),none:"\u2014",statusLabel:o=>V(o,t),typeLabel:o=>V(o,t)},L=e7(e.object,e.tasks,H,o=>o?N(o,t):"",o=>Q(o,this._currencySymbol,t),new Date().toISOString());w2(L)}async _duplicateObject(C){let e=await this._runAction({type:"maintenance_supporter/object/duplicate",entry_id:C},{successToast:V("object_duplicated",this._lang)});e?.entry_id&&this._showObject(e.entry_id)}async _deleteTask(C,e){let t=this.shadowRoot.querySelector("maintenance-confirm-dialog"),H=await E3(t,this._getTask(C,e),this._lang);if(!H)return;await this._runAction({type:"maintenance_supporter/task/delete",entry_id:C,task_id:e,...H})&&this._showObject(C)}async _duplicateTask(C,e){this._moreMenuOpen=!1;let t=await this._runAction({type:"maintenance_supporter/task/duplicate",entry_id:C,task_id:e},{successToast:V("task_duplicated",this._lang)});t?.task_id&&this._showTask(C,t.task_id)}async _moveTask(C,e){this._moreMenuOpen=!1;let t=this._objects.filter(M=>M.entry_id!==C&&!M.object.archived_at).sort((M,l)=>(M.object.name||"").localeCompare(l.object.name||""));if(!t.length)return;let L=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:V("move_task_title",this._lang),message:V("move_task_message",this._lang),confirmText:V("move_task_title",this._lang),inputLabel:V("move_task_target",this._lang),inputValue:t[0].entry_id,options:t.map(M=>({value:M.entry_id,label:M.object.name||M.entry_id}))});if(!L?.confirmed||!L.value)return;let o=await this._runAction({type:"maintenance_supporter/task/move",entry_id:C,task_id:e,target_entry_id:L.value},{successToast:V("task_moved",this._lang)});o?.entry_id&&o.task_id&&this._showTask(o.entry_id,o.task_id)}async _toggleArchiveTask(C,e,t,H=!1){await this._runAction({type:t?"maintenance_supporter/task/unarchive":"maintenance_supporter/task/archive",entry_id:C,task_id:e,...H?{undo:!0}:{}})&&!t&&this._showUndoToast(V("task_archived",this._lang),()=>this._toggleArchiveTask(C,e,!0,!0))}async _togglePauseTask(C,e,t,H=!1){if(!t){let o=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:V("pause_task",this._lang),message:V("pause_task_prompt",this._lang),confirmText:V("pause_task",this._lang),inputLabel:V("pause_until_label",this._lang),inputType:"date"});if(!o?.confirmed)return;let M={type:"maintenance_supporter/task/pause",entry_id:C,task_id:e};o.value&&(M.until=o.value),await this._runAction(M)&&this._showUndoToast(V("task_paused",this._lang),()=>this._togglePauseTask(C,e,!0,!0));return}await this._runAction({type:"maintenance_supporter/task/resume",entry_id:C,task_id:e,...H?{undo:!0}:{}},{successToast:V("task_resumed",this._lang)})}async _toggleArchiveObject(C,e,t=!1){await this._runAction({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:C,...t?{undo:!0}:{}})&&!e&&this._showUndoToast(V("object_archived",this._lang),()=>this._toggleArchiveObject(C,!0,!0))}async _togglePauseObject(C,e,t=!1){if(!e){let L=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:V("pause_object",this._lang),message:V("pause_until_prompt",this._lang),confirmText:V("pause_object",this._lang),inputLabel:V("pause_until_label",this._lang),inputType:"date"});if(!L?.confirmed)return;let o={type:"maintenance_supporter/object/pause",entry_id:C};L.value&&(o.until=L.value),await this._runAction(o)&&this._showUndoToast(V("object_paused",this._lang),()=>this._togglePauseObject(C,!0,!0));return}await this._runAction({type:"maintenance_supporter/object/resume",entry_id:C,...t?{undo:!0}:{}},{successToast:V("object_resumed",this._lang)})}_replaceObject(C,e){this._ui("maintenance-object-dialog").then(t=>t?.openReplace(C,e))}_deviceSwapText(C){if(!C||!C.moved&&!C.unmatched.length)return"";let e=[];return C.moved&&e.push(p1("device_swap_moved","device_swap_moved_one",C.moved,this._lang,"count")),C.unmatched.length&&e.push(p1("device_swap_unmatched","device_swap_unmatched_one",C.unmatched.length,this._lang,"count")),e.join(" ")}async _skipTask(C,e,t){let H={type:"maintenance_supporter/task/skip",entry_id:C,task_id:e};t&&(H.reason=t),await this._runAction(H)}async _resetTask(C,e,t){let H={type:"maintenance_supporter/task/reset",entry_id:C,task_id:e};t&&(H.date=t),await this._runAction(H)}async _applySuggestion(C,e,t){await this._runAction({type:"maintenance_supporter/task/apply_suggestion",entry_id:C,task_id:e,interval:t})}_openSeasonalOverrides(C){let e=this.shadowRoot.querySelector("maintenance-seasonal-overrides-dialog");if(!e||!this._selectedEntryId)return;let t=C.adaptive_config?.seasonal_overrides;e.open(this._selectedEntryId,C.id,t)}async _reanalyzeInterval(C,e){let t=await this._runAction({type:"maintenance_supporter/task/analyze_interval",entry_id:C,task_id:e});t&&(t.recommended_interval?this._showToast(`${V("reanalyze_result",this._lang)}: ${q2(t.recommended_interval,this._lang)} (${V(`confidence_${t.confidence}`,this._lang)}, ${t.data_points} ${V("data_points",this._lang)})`,"info"):this._showToast(V("reanalyze_insufficient_data",this._lang),"info"))}async _promptSkipTask(C,e){let t=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!t)return;let H=await t.prompt({title:V("skip",this._lang),message:V("skip_reason_prompt",this._lang),confirmText:V("skip",this._lang),inputLabel:V("reason_optional",this._lang),inputType:"text"});H.confirmed&&this._skipTask(C,e,H.value||void 0)}async _promptResetTask(C,e){let t=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!t)return;let H=await t.prompt({title:V("reset",this._lang),message:V("reset_date_prompt",this._lang),confirmText:V("reset",this._lang),inputLabel:V("reset_date_optional",this._lang),inputType:"date"});H.confirmed&&this._resetTask(C,e,H.value||void 0)}async _postponeTask(C,e,t){await this._runAction({type:"maintenance_supporter/task/postpone",entry_id:C,task_id:e,until:t},{successToast:V("postponed",this._lang)})}async _promptPostponeTask(C,e){let t=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!t)return;let H=await t.prompt({title:V("postpone",this._lang),message:V("postpone_date_prompt",this._lang),confirmText:V("postpone",this._lang),inputLabel:V("postpone_date_label",this._lang),inputType:"date"});!H.confirmed||!H.value||this._postponeTask(C,e,H.value)}async _snoozeTask(C,e){let t=await this._runAction({type:"maintenance_supporter/task/snooze",entry_id:C,task_id:e});t&&this._showToast(b0(t,this._lang),"info")}_dismissSuggestion(C,e){C&&e&&this._dismissedSuggestions.add(`${C}_${e}`),this.requestUpdate()}async _handleQuickComplete(C,e,t,H="qr"){let L=null,o=await B(this,{type:"maintenance_supporter/task/quick_complete",entry_id:C,task_id:e,source:H},{fallbackKey:"action_error",onError:(l,n)=>{L={message:l,code:n?.code||""}}});if(o===void 0){let{message:l,code:n}=L??{message:"",code:""};n==="no_defaults"||n==="completion_details_required"||n==="tag_scan_required"?this._openCompleteDialog(C,e,t.name,this._features.checklists?t.checklist:void 0,this._features.adaptive&&!!t.adaptive_config?.enabled,{viaTagScan:H==="qr",details:!0}):this._showToast(l);return}let M=I3(o,this._lang);if(M){this._showToast(M,"info");return}o?.undo?this._offerUndo(C,e,V("quick_complete_success",this._lang)):this._showToast(V("quick_complete_success",this._lang),"info");try{await this._loadData()}catch{}}async _printTaskWorksheet(C,e){let t=this._getObject(C),H=t?.tasks.find(M=>M.id===e);if(!t||!H)return;let L=Y2(),o=!1;this._actionLoading=!0;try{let M={type:"maintenance_supporter/qr/generate",entry_id:C,task_id:e,url_mode:"server"},[l,n]=await Promise.all([this.hass.connection.sendMessagePromise({...M,action:"view"}).catch(()=>null),this.hass.connection.sendMessagePromise({...M,action:"complete"}).catch(()=>null)]),p=null;try{let h=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:C})).documents||[]).find(x=>x.kind==="file"&&x.mime==="application/pdf"&&(x.task_ids||[]).includes(e)&&x.task_pages?.[e]);if(h){let x=h.task_pages[e],S=4,u={path:await R3(this.hass,`/api/maintenance_supporter/document/${h.id}/excerpt?start=${x}&count=${S}`,3600)};p={title:c1(h)||"Manual",startPage:x,endPage:x+S-1,url:new URL(u.path,window.location.origin).toString(),vendorBase:new URL("/maintenance_supporter_vendor",window.location.origin).toString()}}}catch{}let c=this._lang,m={title:V("worksheet",c),object:V("object",c),type:V("maintenance_type",c),interval:V("interval",c),nextDue:V("next_due",c),lastDone:V("last_performed",c),priority:V("priority",c),checklist:V("checklist",c),notes:V("notes_label",c),scanView:V("worksheet_scan_view",c),scanComplete:V("worksheet_scan_complete",c),manualExcerpt:V("worksheet_manual_excerpt",c),pages:V("worksheet_pages",c),printedOn:V("worksheet_printed",c),never:V("worksheet_never",c),typeLabel:v=>V(v,c),statusLabel:v=>V(v,c),priorityLabel:v=>V(`priority_${v}`,c),parts:V("consumes_parts_label",c)},g=(H.consumes_parts||[]).map(v=>G3(v,t.entry_id,this._objects,c)),Z=t7(H,t.object.name,m,v=>N(v,c),v=>R1(v,c),l?.svg_data_uri||null,n?.svg_data_uri||null,p,new Date().toISOString(),g,P1(t.object,H));w2(Z,L),o=!0}finally{o||L?.close(),this._actionLoading=!1}}_openManualDoc(C){if(C.kind!=="file"){o1(C.url)&&window.open(C.url,"_blank","noopener");return}E1(this.hass,C.id).catch(()=>{})}_setChecklistItem(C,e,t,H){let L=`${C}/${e}`;this._checklistPending.set(L,{...this._checklistPending.get(L)??{},[t]:H});let o=this._checklistChain.then(async()=>{let M=this._getObject(C)?.tasks.find(m=>m.id===e);if(!M)return;let l=this._checklistPending.get(L)??{},n={},p=t5(M)?.checklist??(M.checklist||[]);for(let m of p)n[m]=m in l?l[m]:M.checklist_progress?.[m]??!1;await this._runAction({type:"maintenance_supporter/task/checklist_progress",entry_id:C,task_id:e,checklist_state:n});let c=this._checklistPending.get(L);if(c){for(let[m,g]of Object.entries(n))m in c&&c[m]===g&&delete c[m];Object.keys(c).length===0&&this._checklistPending.delete(L)}});return this._checklistChain=o.catch(()=>{}),o}_openCompleteDialog(C,e,t,H,L,o){let M=this._getTask(C,e);if(!o?.details&&!o?.viaTagScan&&M&&e2(M)){this._handleQuickComplete(C,e,M,"panel");return}this._ui("maintenance-complete-dialog").then(l=>l&&this._fillAndOpenCompleteDialog(l,C,e,t,H,L,o))}_fillAndOpenCompleteDialog(C,e,t,H,L,o,M){e0(C,C0({entryId:e,taskId:t,taskName:H,task:this._getTask(e,t),objects:this._objects,lang:this._lang,checklist:L,features:this._features,adaptiveEnabled:o,currencySymbol:this._currencySymbol,viaTagScan:M?.viaTagScan,partsCostMode:this._partsCostMode}),this._lang)}_openQrForObject(C,e){this._ui("maintenance-qr-dialog").then(t=>t?.openForObject(C,e))}_openQrForTask(C,e,t,H){this._ui("maintenance-qr-dialog").then(L=>L?.openForTask(C,e,t,H))}_offerUndo(C,e,t){this._showUndoToast(t,()=>{this._undoCompletion(C,e)})}async _undoCompletion(C,e){let t=await F3(this.hass,C,e,this._lang);this._showToast(t.message,t.ok?"info":"error"),t.ok&&await this._onDialogEvent()}render(){return i`
      <div class="panel">
        ${this._restartPendingVersion?i`
              <div class="update-banner restart-pending-banner" role="status">
                <ha-icon icon="mdi:restart"></ha-icon>
                <span>${V("restart_pending_banner",this._lang).replace("{version}",this._restartPendingVersion)}</span>
              </div>
            `:s}
        ${this._staleBundle?i`
              <div class="update-banner" role="status">
                <ha-icon icon="mdi:update"></ha-icon>
                <span>${V("update_banner",this._lang)}</span>
                <ha-button appearance="plain" @click=${()=>location.reload()}>
                  ${V("update_reload",this._lang)}
                </ha-button>
              </div>
            `:s}
        ${this._rowActionNotice&&this.hass?.user?.is_admin?i`
              <div class="update-banner row-actions-banner" role="status">
                <ha-icon icon="mdi:gesture-tap-button"></ha-icon>
                <span>${V("row_actions_banner",this._lang)}</span>
                <ha-button appearance="plain" @click=${()=>this._dismissRowActionNotice(!1)}>
                  ${V("row_actions_keep",this._lang)}
                </ha-button>
                <ha-button appearance="filled" @click=${()=>this._dismissRowActionNotice(!0)}>
                  ${V("row_actions_back",this._lang)}
                </ha-button>
              </div>
            `:s}
        ${this.narrow||this._view!=="overview"?this._renderHeader():s}
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
        .betaEditor=${this._features.beta_editor}
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
        @problem-sensors-adopted=${C=>this._onProblemSensorsAdopted(C)}
      ></maintenance-adopt-problem-sensors-dialog>
      <maintenance-suggested-setups-dialog
        .hass=${this.hass}
        @integration-setups-adopted=${C=>this._onSetupsAdopted(C)}
        @reset-counters-wired=${C=>this._onResetsWired(C)}
      ></maintenance-suggested-setups-dialog>
      <maintenance-saved-views-dialog
        .hass=${this.hass}
        @saved-views-changed=${C=>this._onSavedViewsChanged(C)}
      ></maintenance-saved-views-dialog>
      ${this._toastMessage?i`<div class="toast ${this._toastKind}" role=${this._toastKind==="error"?"alert":"status"}>
        <span>${this._toastMessage}</span>
        ${this._toastUndo?i`<button class="toast-undo" @click=${()=>this._runToastUndo()}>${this._toastActionLabel||V("undo",this._lang)}</button>`:s}
      </div>`:s}
      ${this._renderPalette()}
      ${this._renderTemplateGallery()}
    `}_renderSearchButton(C){let e=this._lang;return i`<ha-icon-button
      class=${C}
      .path=${S9}
      .label=${V("search_open",e)}
      title=${V("search_open",e)}
      @click=${()=>this._openPalette()}
    ></ha-icon-button>`}_renderHeader(){let C=[{label:V("maintenance",this._lang),action:()=>this._showOverview()}],e=(this._view==="object"||this._view==="task")&&this._selectedEntryId?Q5(this._objects,this._selectedEntryId):[];for(let t of this.narrow?e.slice(-1):e)C.push({label:t.object.name,action:()=>this._showObject(t.entry_id)});if(this._view==="object"&&this._selectedEntryId){let t=this._getObject(this._selectedEntryId);C.push({label:t?.object.name||"Object"})}if(this._view==="task"&&this._selectedEntryId&&this._selectedTaskId){let t=this._getObject(this._selectedEntryId);C.push({label:t?.object.name||"Object",action:()=>this._showObject(this._selectedEntryId)});let H=this._getTask(this._selectedEntryId,this._selectedTaskId);C.push({label:H?.name||"Task"})}return this._view==="area"&&this._selectedAreaId&&(C.push({label:V("all_areas",this._lang),action:()=>this._showAllAreas()}),C.push({label:I5(this._selectedAreaId,this.hass?.areas,V("no_area",this._lang))})),i`
      <div class="header">
        ${this.narrow&&!this.embedded?i`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`:s}
        ${this._view!=="overview"?i`<ha-icon-button
              .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
              @click=${()=>{this._view==="task"?this._showObject(this._selectedEntryId):this._view==="area"?this._showAllAreas():this._view==="object"&&e.length?this._showObject(e[e.length-1].entry_id):this._showOverview()}}
            ></ha-icon-button>`:s}
        <div class="breadcrumbs">
          ${(M1()&&this.narrow?C.slice(-1):C).map((t,H)=>i`
              ${H>0?i`<span class="sep">/</span>`:s}
              ${t.action?i`<a @click=${t.action}>${t.label}</a>`:i`<span class="current">${t.label}</span>`}
            `)}
        </div>
        ${this._renderSearchButton("header-search")}
      </div>
    `}_renderOverview(){let C=this._lang,e=!!this.hass?.user?.is_admin,t=this._stats;return!e&&this._overviewTab==="settings"&&(this._overviewTab="dashboard"),i`
      ${t?i`
            <div class="stats-bar">
              <div class="stat-item clickable"
                   @click=${()=>this._showAllObjects()}
                   title=${V("show_all_objects",C)}>
                <span class="stat-value">${t.total_objects}</span>
                <span class="stat-label">${V("objects",C)}</span>
              </div>
              <div class="stat-item clickable"
                   @click=${()=>this._filterByStatus("")}
                   title=${V("show_all_tasks",C)}>
                <span class="stat-value">${t.total_tasks}</span>
                <span class="stat-label">${V("tasks",C)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="overdue"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("overdue")}
                   title=${V("filter_to_overdue",C)}>
                <span class="stat-value" style="color: var(--error-color)">${t.overdue}</span>
                <span class="stat-label">${V("overdue",C)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="due_soon"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("due_soon")}
                   title=${V("filter_to_due_soon",C)}>
                <span class="stat-value" style="color: var(--warning-color)">${t.due_soon}</span>
                <span class="stat-label">${V("due_soon",C)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="triggered"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("triggered")}
                   title=${V("filter_to_triggered",C)}>
                <span class="stat-value" style="color: #ff5722">${t.triggered}</span>
                <span class="stat-label">${V("triggered",C)}</span>
              </div>
              ${this._features.budget?this._renderBudgetTiles():s}
            </div>
          `:s}
      ${w5([{key:"today",label:V("tab_today",C)},{key:"dashboard",label:V("dashboard",C)},{key:"calendar",label:V("tab_calendar",C)},e&&{key:"settings",label:V("settings",C)}],this._overviewTab,H=>this._setOverviewTab(H),this.narrow?s:this._renderSearchButton("tab-search"))}
      ${this._overviewTab==="today"?this._renderToday():this._overviewTab==="dashboard"?this._renderDashboard():this._overviewTab==="calendar"?i`
            <div @ll-custom=${this._onCalendarLlCustom} @maintenance-supporter-open-task=${this._onCalendarOpenTask}>
              <maintenance-supporter-calendar-card
                .hass=${this.hass}
              ></maintenance-supporter-calendar-card>
            </div>
          `:i`<maintenance-settings-view
            .hass=${this.hass}
            .features=${this._features}
            .budget=${this._budget}
            @settings-changed=${this._onSettingsChanged}
          ></maintenance-settings-view>`}
    `}_statusBadge(C){return c5(C,this._lang)}_setOverviewTab(C){this._overviewTab=C;try{I(P.overviewTab,C)}catch{}this._scrollContentToTop()}_renderToday(){let C=this._lang,e=this._rowsFiltered(!1),t=n=>`${n.entry_id}:${n.task_id}`,H=e.filter(n=>n.status==="overdue"),L=e.filter(n=>n.status==="triggered"),o=new Set([...H,...L].map(t)),M=e.filter(n=>!o.has(t(n))&&n.days_until_due===0);M.forEach(n=>o.add(t(n)));let l=e.filter(n=>!o.has(t(n))&&n.days_until_due!=null&&n.days_until_due>0&&n.days_until_due<=7);return H.length+L.length+M.length+l.length===0?i`
        <div class="today-empty">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <p>${V("today_all_caught_up",C)}</p>
        </div>
      `:i`
      <div class="today-view">
        ${this._renderTodaySection("today_overdue",H,"overdue")}
        ${this._renderTodaySection("triggered",L,"triggered")}
        ${this._renderTodaySection("today_due_today",M,"due_soon")}
        ${this._renderTodaySection("today_this_week",l,"")}
      </div>
    `}_peopleOf(C){return I1(C).map(e=>this._userService?.getPerson(e)??null)}_renderTodaySection(C,e,t){if(e.length===0)return s;let H=this._lang,L=o=>this._filterUser?[]:this._peopleOf(o);return i`
      <div class="today-section">
        <div class="today-section-header ${t}">
          <span>${V(C,H)}</span><span class="today-badge">${e.length}</span>
        </div>
        ${e.map(o=>i`
          <div class="today-row" @click=${()=>this._showTask(o.entry_id,o.task_id)}>
            <span class="today-dot ${o.trigger_active?"triggered":o.status}"></span>
            <div class="today-main">
              <div class="today-task">${this._listRef(o.entry_id,o.task_id)}${o.task_name}${u2(o.next_event_titles)}${v2(o.trigger_detail)}</div>
              <div class="today-object">
                <span class="today-object-text">${o.object_name} · ${o.days_until_due==null?M3(o.last_performed,H)??"\u2014":O1(o.days_until_due,H)}</span>
                ${z5(L(o),"today-person")}
              </div>
            </div>
            ${this._renderRowActions(H,()=>this._openCompleteDialogForRow(o),void 0,!1,this._isQuick(o))}
          </div>
        `)}
      </div>
    `}_renderDashboard(){let C=this._stats,e=this._taskRows,t=this._lang,H=this._isOperator,L=this._objects.reduce((v,h)=>v+h.tasks.filter(x=>x.archived).length,0),o=new Set;for(let v of this._objects)for(let h of v.tasks)for(let x of I1(h))o.add(x);this._filterUser&&this._filterUser!=="current_user"&&o.add(this._filterUser);let M=[...o].map(v=>({id:v,name:this._userService?.getUserName(v)??null})).filter(v=>v.name!==null||v.id===this._filterUser).sort((v,h)=>(v.name??"").localeCompare(h.name??"")),l=(this._filterStatus?1:0)+(this._filterUser?1:0)+(this._filterLabel?1:0)+(this._filterPlace?1:0)+(this._filterPriority?1:0)+(this._activeViewId?1:0),n=!!(this._selectedEntryId&&this._selectedTaskId&&this._getTask(this._selectedEntryId,this._selectedTaskId)),p=this._splitActive()&&!(M1()&&this._filterPaneOpen&&!this.wide&&!n),c=i`
      ${this.narrow?i`
        <div class="mobile-controls">
          <ha-button
            class="mobile-toggle ${this._filtersOpen?"active":""}"
            @click=${()=>{this._filtersOpen=!this._filtersOpen}}
          >
            <ha-icon icon="mdi:filter-variant"></ha-icon>
            ${V("filter_label",t)}${l>0?` (${l})`:""}
          </ha-button>
          ${H?s:this._renderNewMenu(t)}
        </div>
      `:s}

      <div class="filter-bar ${this.narrow&&!this._filtersOpen?"collapsed":""}">
        ${this._filterSelect(V("views_label",t),this._activeViewId,v=>this._applyView(v.target.value),i`
            <option value="">${V("views_none",t)}</option>
            ${this._savedViews.map(v=>i`<option value=${v.id} ?selected=${this._activeViewId===v.id}>${v.name}</option>`)}
        `)}
        ${H?s:i`
          <ha-icon-button
            class="views-save-btn"
            .path=${"M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"}
            .label=${V("views_manage",t)}
            title=${V("views_manage",t)}
            @click=${()=>this._openSavedViewsDialog()}
          ></ha-icon-button>
        `}
        ${this._filterSelect(V("filter_label",t),this._filterStatus,v=>{this._filterStatus=v.target.value,this._activeViewId=""},i`
            <option value="">${V("all",t)}</option>
            ${p3.map(v=>i`<option value=${v} ?selected=${this._filterStatus===v}>${V(v,t)}</option>`)}
        `)}
        ${this._filterSelect(V("user_label",t),this._filterUser||"",v=>{let h=v.target.value;this._filterUser=h||null,this._activeViewId=""},i`
            <option value="">${V("all_users",t)}</option>
            <option value="current_user" ?selected=${this._filterUser==="current_user"}>${V("my_tasks",t)}</option>
            ${M.map(v=>i`<option value=${v.id} ?selected=${this._filterUser===v.id}>${v.name??v.id}</option>`)}
        `)}
        ${this._allLabels.length>0?i`
          ${this._filterSelect(V("label_filter",t),this._filterLabel||"",v=>{let h=v.target.value;this._filterLabel=h||null,this._activeViewId=""},i`
              <option value="">${V("all_labels",t)}</option>
              ${this._allLabels.map(v=>i`<option value=${v} ?selected=${this._filterLabel===v}>${v}</option>`)}
          `)}
        `:s}
        ${this._features.places&&this._allPlaces.length>0?i`
          ${this._filterSelect(V("filter_place",t),this._filterPlace,v=>{this._filterPlace=v.target.value,this._activeViewId=""},i`
              <option value="">${V("filter_place_all",t)}</option>
              <option value="home" ?selected=${this._filterPlace==="home"}>${V("place_home",t)}</option>
              ${this._allPlaces.map(v=>i`<option value=${v.id} ?selected=${this._filterPlace===v.id}>${v.name}</option>`)}
          `)}
        `:s}
        ${this._filterSelect(V("priority",t),this._filterPriority,v=>{this._filterPriority=v.target.value,this._activeViewId=""},i`
            <option value="">${V("all_priorities",t)}</option>
            ${K5.map(v=>i`<option value=${v} ?selected=${this._filterPriority===v}>${V(`priority_${v}`,t)}</option>`)}
        `)}
        ${this._filterSelect(V("sort_label",t),this._sortMode,v=>{this._sortMode=v.target.value,this._activeViewId="";try{I(P.taskSort,this._sortMode)}catch{}},i`
            <option value="due_date" ?selected=${this._sortMode==="due_date"}>${V("sort_due_date",t)}</option>
            <option value="object" ?selected=${this._sortMode==="object"}>${V("sort_object",t)}</option>
            <option value="type" ?selected=${this._sortMode==="type"}>${V("sort_type",t)}</option>
            <option value="task_name" ?selected=${this._sortMode==="task_name"}>${V("sort_task_name",t)}</option>
            <option value="area" ?selected=${this._sortMode==="area"}>${V("sort_area",t)}</option>
            <option value="assigned_user" ?selected=${this._sortMode==="assigned_user"}>${V("sort_assigned_user",t)}</option>
            <option value="group" ?selected=${this._sortMode==="group"}>${V("sort_group",t)}</option>
        `)}
        ${this._filterSelect(V("group_by_label",t),this._groupByMode,v=>{this._groupByMode=v.target.value,this._activeViewId="";try{I(P.groupBy,this._groupByMode)}catch{}},i`
            <option value="none" ?selected=${this._groupByMode==="none"}>${V("groupby_none",t)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${V("groupby_area",t)}</option>
            ${this._features.groups?i`<option value="group" ?selected=${this._groupByMode==="group"}>${V("groupby_group",t)}</option>`:s}
            <option value="user" ?selected=${this._groupByMode==="user"}>${V("groupby_user",t)}</option>
            <option value="object" ?selected=${this._groupByMode==="object"}>${V("groupby_object",t)}</option>
        `)}
        ${L>0?i`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived,this._activeViewId=""}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?V("hide_archived",t):`${V("show_archived",t)} (${L})`}
          </ha-button>
        `:s}
        ${!H&&e.length>0?i`
          <ha-button
            class="bulk-toggle ${this._bulkMode?"active":""}"
            @click=${()=>this._toggleBulkMode()}
          >
            <ha-icon icon="mdi:checkbox-multiple-marked-outline"></ha-icon>
            ${this._bulkMode?V("cancel",t):V("bulk_select",t)}
          </ha-button>
        `:s}
        ${!H&&!this.narrow?this._renderNewMenu(t):s}
      </div>
    `,m=H?s:this._renderGettingStartedChips(t),g=i`
      ${e.length===0?i`
            <div class="empty-state">
              <ha-svg-icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></ha-svg-icon>
              <p>${V("no_tasks",t)}</p>
              ${!H&&this._objects.length===0?i`
                <p class="empty-onboard-hint">${V("onboard_hint",t)}</p>
                <div class="empty-onboard-actions">
                  <ha-button appearance="filled" @click=${()=>this._openTemplateGallery()}>
                    <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon> ${V("templates_from",t)}
                  </ha-button>
                  <ha-button appearance="plain" @click=${()=>this._ui("maintenance-object-dialog").then(v=>v?.openCreate())}>
                    ${V("new_object",t)}
                  </ha-button>
                </div>
              `:s}
            </div>
          `:i`
            ${this._bulkMode?this._renderBulkBar(e,t):s}
            ${p?i`
                  <div class="split-layout">
                    <div class="split-list">
                      ${this._groupByMode==="none"?this._renderTaskTable(e):this._renderGroupedTasks(e,t)}
                    </div>
                    <div class="split-pane">
                      ${this._selectedEntryId&&this._selectedTaskId&&this._getTask(this._selectedEntryId,this._selectedTaskId)?this._renderTaskDetail():i`<div class="split-pane-empty"><ha-icon icon="mdi:cursor-default-click-outline"></ha-icon><p>${V("split_select_hint",t)}</p></div>`}
                    </div>
                  </div>
                `:this._groupByMode==="none"?this._renderTaskTable(e):this._renderGroupedTasks(e,t)}
          `}
    `,Z=M1()&&J1();return i`
      ${Z?i`
            <div class="ms-list-layout ${this._filterPaneOpen?"with-pane":""}">
              ${this._filterPaneOpen?this._renderFilterPane(M,L,H,t):s}
              <div class="ms-list-main">
                ${this._renderBetaToolbar(this._rowsFiltered(!0,!1).length,l,H,t)}
                ${m}${g}
              </div>
            </div>
            ${H?s:this._renderNewMenu(t,!this.embedded)}`:i`${c}${m}${g}`}

      ${this._features.groups&&!H?this._renderGroupsSection():s}
      ${H?s:i`<maintenance-storage-section-card
            .hass=${this.hass}
            .objects=${this._objects}
            @open-object=${v=>{let h=v.detail?.entry_id;h&&this._showObject(h)}}
          ></maintenance-storage-section-card>`}
    `}_renderBetaToolbar(C,e,t,H){let L={none:V("groupby_none",H),area:V("sort_area",H),group:V("sort_group",H),user:V("sort_assigned_user",H),object:V("object",H)},o={due_date:V("sort_due_date",H),object:V("sort_object",H),type:V("sort_type",H),task_name:V("sort_task_name",H),area:V("sort_area",H),assigned_user:V("sort_assigned_user",H),group:V("sort_group",H)},M=c=>i`<button class="ms-chip" slot="trigger" type="button">
      <span>${c}</span><ha-icon class="ms-chip-caret" icon="mdi:menu-down"></ha-icon></button>`,l=d3.filter(c=>c!=="group"||this._features.groups),n=P5.filter(c=>c!=="group"||this._features.groups),p=this._groupByMode;return i`
      <div class="ms-toolbar">
        ${this._filterPaneOpen?s:i`
          <button class="ms-chip ${e?"active":""}" type="button" aria-expanded="false" @click=${()=>this._toggleFilterPane()}>
            <ha-icon icon="mdi:filter-variant"></ha-icon><span>${V("beta_filters",H)}</span>
            ${e?i`<span class="ms-chip-badge">${e}</span>`:s}
          </button>`}
        ${!t&&C>0?i`
          <button class="ms-chip icon-only ${this._bulkMode?"active":""}" type="button" title=${V("bulk_select",H)} aria-label=${V("bulk_select",H)}
            aria-pressed=${this._bulkMode?"true":"false"} @click=${()=>this._toggleBulkMode()}>
            <ha-icon icon="mdi:order-bool-ascending-variant"></ha-icon>
          </button>`:s}
        <label class="ms-search">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input type="search" .value=${this._listSearchDraft} placeholder=${V("beta_search_tasks",H).replace("{count}",String(C))}
            aria-label=${V("beta_search_tasks",H).replace("{count}",String(C))}
            @input=${c=>this._onListSearchInput(c.target.value)} />
          ${this._listSearch||this._listSearchDraft?i`<button class="ms-search-clear" type="button" aria-label=${V("clear",H)} title=${V("clear",H)}
            @click=${()=>this._setListSearch("")}><ha-icon icon="mdi:close"></ha-icon></button>`:s}
        </label>
        ${z1(M(p==="none"?V("group_by_label",H):`${V("group_by_label",H)} ${L[p]}`),l.map(c=>({label:L[c],selected:c===p,action:()=>this._setGroupBy(c)})),{cls:"ms-chip-menu"})}
        ${z1(M(V("beta_sort_by",H).replace("{sort}",o[this._sortMode])),n.map(c=>({label:o[c],selected:c===this._sortMode,action:()=>this._setSortMode(c)})),{cls:"ms-chip-menu"})}
      </div>
    `}_toggleFilterPane(){this._filterPaneOpen=!this._filterPaneOpen,I(P.filterPane,this._filterPaneOpen?"1":"")}_setGroupBy(C){this._groupByMode=C,this._activeViewId="",I(P.groupBy,C)}_setSortMode(C){this._sortMode=C,this._activeViewId="",I(P.taskSort,C)}_renderFilterPane(C,e,t,H){let L=(n,p,c)=>i`
      <button class="ms-pane-option ${p?"on":""}" type="button" role="menuitemcheckbox" aria-checked=${p?"true":"false"} @click=${c}>
        <span class="ms-pane-option-label">${n}</span>
        <ha-icon icon=${p?"mdi:checkbox-marked":"mdi:checkbox-blank-outline"}></ha-icon>
      </button>`,o=(n,p,c,m)=>i`
      <ha-expansion-panel class="ms-pane-section" .expanded=${c||this._paneSections.has(n)}
        @expanded-changed=${g=>{if(g.target!==g.currentTarget)return;let Z=new Set(this._paneSections);g.detail.expanded?Z.add(n):Z.delete(n),this._paneSections=Z}}>
        <div slot="header" class="ms-pane-section-head">${p}${c?i`<span class="ms-chip-badge">1</span>`:s}</div>
        <div class="ms-pane-options">${m}</div>
      </ha-expansion-panel>`,M=n=>()=>{n(),this._activeViewId=""},l=!!(this._filterStatus||this._filterUser||this._filterLabel||this._filterPlace||this._filterPriority||this._activeViewId);return i`
      <aside class="ms-filter-pane" aria-label=${V("beta_filters",H)}>
        <div class="ms-pane-head">
          <button class="ms-chip active" type="button" aria-expanded="true" @click=${()=>this._toggleFilterPane()}>
            <ha-icon icon="mdi:filter-variant"></ha-icon><span>${V("beta_filters",H)}</span>
          </button>
          ${l?i`<ha-icon-button class="ms-pane-clear" .label=${V("beta_filters_clear",H)} title=${V("beta_filters_clear",H)}
            .path=${"M14.76,20.83L17.6,18L14.76,15.17L16.17,13.76L19,16.57L21.83,13.76L23.24,15.17L20.41,18L23.24,20.83L21.83,22.24L19,19.4L16.17,22.24L14.76,20.83M12,12V19.88C12.04,20.18 11.94,20.5 11.71,20.71C11.32,21.1 10.69,21.1 10.3,20.71L8.29,18.7C8.06,18.47 7.96,18.16 8,17.87V12H7.97L2.21,4.62C1.87,4.19 1.95,3.56 2.38,3.22C2.57,3.08 2.78,3 3,3H17C17.22,3 17.43,3.08 17.62,3.22C18.05,3.56 18.13,4.19 17.79,4.62L12.03,12H12Z"}
            @click=${()=>this._clearFilters()}></ha-icon-button>`:s}
        </div>
        ${this._savedViews.length||!t?o("views",V("views_label",H),!!this._activeViewId,i`
          ${this._savedViews.map(n=>L(n.name,this._activeViewId===n.id,()=>this._applyView(this._activeViewId===n.id?"":n.id)))}
          ${t?s:i`<button class="ms-pane-link" type="button" @click=${()=>this._openSavedViewsDialog()}>${V("views_manage",H)}</button>`}
        `):s}
        ${o("status",V("beta_filter_status",H),!!this._filterStatus,p3.map(n=>L(V(n,H),this._filterStatus===n,M(()=>{this._filterStatus=this._filterStatus===n?"":n}))))}
        ${o("user",V("user_label",H),!!this._filterUser,i`
          ${L(V("my_tasks",H),this._filterUser==="current_user",M(()=>{this._filterUser=this._filterUser==="current_user"?null:"current_user"}))}
          ${C.map(n=>L(n.name??n.id,this._filterUser===n.id,M(()=>{this._filterUser=this._filterUser===n.id?null:n.id})))}
        `)}
        ${this._allLabels.length?o("label",V("label_filter",H),!!this._filterLabel,this._allLabels.map(n=>L(n,this._filterLabel===n,M(()=>{this._filterLabel=this._filterLabel===n?null:n})))):s}
        ${this._features.places&&this._allPlaces.length?o("place",V("filter_place",H),!!this._filterPlace,i`
          ${L(V("place_home",H),this._filterPlace==="home",M(()=>{this._filterPlace=this._filterPlace==="home"?"":"home"}))}
          ${this._allPlaces.map(n=>L(n.name,this._filterPlace===n.id,M(()=>{this._filterPlace=this._filterPlace===n.id?"":n.id})))}
        `):s}
        ${o("priority",V("priority",H),!!this._filterPriority,K5.map(n=>L(V(`priority_${n}`,H),this._filterPriority===n,M(()=>{this._filterPriority=this._filterPriority===n?"":n}))))}
        ${e>0?o("archived",V("show_archived",H),this._showArchived,L(`${V("show_archived",H)} (${e})`,this._showArchived,M(()=>{this._showArchived=!this._showArchived}))):s}
      </aside>
    `}_onListSearchInput(C){this._listSearchDraft=C,clearTimeout(this._listSearchTimer),this._listSearchTimer=window.setTimeout(()=>this._setListSearch(this._listSearchDraft),b9)}_setListSearch(C){clearTimeout(this._listSearchTimer),this._listSearchDraft=C,this._listSearch=C}_clearFilters(){this._filterStatus="",this._filterUser=null,this._filterLabel=null,this._filterPlace="",this._filterPriority="",this._activeViewId=""}_renderTaskTable(C){let e=this._bulkMode?" bulk":"";if(this._virtTotalRows=C.length,this.narrow||C.length<120)return this._virtRenderedSig="",i`
        <div class="task-table${e}">
          ${this._renderTaskHead()}
          ${this._renderRows(C)}
        </div>
      `;let t=C.length,H=C.map(C4);(H.length!==this._virtKeys.length||H.some((p,c)=>p!==this._virtKeys[c]))&&(this._virtPasses=0),this._virtKeys=H;let L=this._virtHeights.offsets(H),o=Math.max(0,Math.min(this._virtStart,t)),M=this._virtEnd>0?Math.min(this._virtEnd,t):Math.min(t,40);M<o&&(o=0,M=Math.min(t,40)),this._virtRenderedStart=o,this._virtRenderedSig=`${this._rowsGeneration}:${o}:${M}:${t}`;let l=L[o],n=L[t]-L[M];return i`
      <div class="task-table${e} virtual">
        ${this._renderTaskHead()}
        ${this._renderVirtSizerRow(C)}
        ${l>0?i`<div class="virt-spacer" style="height:${l}px"></div>`:s}
        ${this._renderRows(C.slice(o,M))}
        ${n>0?i`<div class="virt-spacer" style="height:${n}px"></div>`:s}
      </div>
    `}_renderTaskHead(){if(!M1()||this.narrow||this.tight)return s;let C=this._lang,e=(t,H,L)=>L?i`<button class="th ${H} sortable ${this._sortMode===L?"active":""}" type="button" role="columnheader"
          aria-sort=${this._sortMode===L?"ascending":"none"} @click=${()=>this._setSortMode(L)}>
          ${this._sortMode===L?i`<ha-icon icon="mdi:arrow-up"></ha-icon>`:s}<span>${t}</span></button>`:i`<span class="th ${H}" role="columnheader">${t}</span>`;return i`
      <div class="task-head" role="row">
        ${this._bulkMode?i`<span></span>`:s}
        ${e(V("beta_filter_status",C),"th-status")}
        ${e(V("object",C),"th-object","object")}
        ${e(V("task_name",C),"th-task","task_name")}
        <span class="th th-sub"></span>
        ${e(V("sort_type",C),"th-type","type")}
        ${e(V("sort_due_date",C),"th-due","due_date")}
        <span class="th th-actions"></span>
      </div>`}_renderVirtSizerRow(C){let e=this._lang,t="",H=!1,L=!1,o=!1;for(let M of C){let l=O0(w0(M),e);l.length>t.length&&(t=l),M.enabled||(H=!0),M.nfc_tag_id&&(L=!0),(M.priority==="high"||M.priority==="low")&&(o=!0)}return i`
      <div class="task-row virt-sizer" aria-hidden="true">
        ${this._bulkMode?i`<span></span>`:s}
        <span class="cell-badges">
          <span class="status-badge"><ha-icon icon="mdi:circle-medium"></ha-icon><span class="status-label">${t}</span></span>
          ${H?i`<span class="badge-disabled">${V("disabled",e)}</span>`:s}
          ${L?i`<span class="nfc-badge"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:s}
          ${o?i`<span class="priority-badge"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>`:s}
        </span>
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
    `}_renderBulkBar(C,e){let t=this._bulkSelected.size,H=C.length>0&&C.every(L=>this._bulkSelected.has(this._bulkKey(L)));return i`
      <div class="bulk-bar">
        ${Y1({cls:"bulk-selectall",checked:H,onChange:()=>this._bulkSelectAll(C)},i`${V("bulk_select_all",e)}`)}
        <span class="bulk-count">${V("bulk_n_selected",e).replace("{n}",String(t))}</span>
        <span class="bulk-actions">
          <ha-button appearance="filled" .disabled=${t===0||this._actionLoading}
            @click=${()=>this._bulkComplete(C)}>
            <ha-icon icon="mdi:check"></ha-icon> ${V("complete",e)}
          </ha-button>
          <ha-button appearance="plain" .disabled=${t===0||this._actionLoading}
            @click=${()=>this._bulkArchive(C)}>
            <ha-icon icon="mdi:archive-outline"></ha-icon> ${V("archive",e)}
          </ha-button>
          <span class="bulk-more-wrapper">
            ${(()=>{let L=[{label:V("move_task",e),cls:"bulk-move",action:()=>{this._bulkMove(C)}},{label:`${V("bulk_assign",e)}\u2026`,cls:"bulk-assign",action:()=>{this._bulkEdit("assign",C)}},{label:`${V("labels",e)}\u2026`,cls:"bulk-labels",action:()=>{this._bulkEdit("labels",C)}},{label:`${V("edit",e)}\u2026`,cls:"bulk-edit",action:()=>{this._bulkEdit("edit",C)}},{label:`${V("pause_task",e)}\u2026`,cls:"bulk-pause",action:()=>{this._bulkPause(C)}},{label:V("resume_task",e),cls:"bulk-resume",action:()=>this._bulkResume(C)}],o=t===0||this._actionLoading;return J1()?z1(i`<ha-button slot="trigger" appearance="plain" class="bulk-more" title=${V("more_actions",e)} aria-label=${V("more_actions",e)} .disabled=${o}>
                    <ha-icon icon="mdi:dots-vertical"></ha-icon>
                  </ha-button>`,L):i`<ha-button appearance="plain" class="bulk-more" title=${V("more_actions",e)} aria-label=${V("more_actions",e)} .disabled=${o}
                    @click=${M=>{M.stopPropagation(),this._bulkMenuOpen=!this._bulkMenuOpen}}>
                    <ha-icon icon="mdi:dots-vertical"></ha-icon>
                  </ha-button>
                  ${this._bulkMenuOpen?t2(L,()=>{this._bulkMenuOpen=!1}):s}`})()}
          </span>
        </span>
      </div>
    `}_renderGroupedTasks(C,e){let t=new Map,H=V("unassigned",e);for(let M of C){let l=[];if(this._groupByMode==="area")l=[O2(M.area_id,this.hass?.areas,V("no_area",e))];else if(this._groupByMode==="user"){let n=I1(M).map(p=>this._userService?.getUserName(p)).filter(p=>!!p);l=n.length>0?[...new Set(n)]:[H]}else this._groupByMode==="group"?l=M.group_names.length>0?M.group_names:[H]:this._groupByMode==="object"&&(l=[M.object_name]);for(let n of l)t.has(n)||t.set(n,[]),t.get(n).push(M)}let L=[...t.entries()].sort(([M],[l])=>M===H&&l!==H?1:l===H&&M!==H?-1:M.localeCompare(l)),o=this._groupByMode==="area"?"mdi:map-marker-outline":this._groupByMode==="group"?"mdi:folder-outline":this._groupByMode==="object"?"mdi:cube-outline":"mdi:account-outline";return i`
      <div class="task-table grouped${this._bulkMode?" bulk":""}">
        ${this._renderTaskHead()}
        ${L.map(([M,l])=>{let n=!this._collapsedGroups.has(M);return i`
            <div class="group-section" ?open=${n}>
              <div
                class="group-section-header"
                role="button"
                tabindex="0"
                aria-expanded=${n?"true":"false"}
                @click=${()=>this._toggleGroup(M)}
                @keydown=${p=>{(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),this._toggleGroup(M))}}
              >
                <ha-icon icon="${o}"></ha-icon>
                <span>${M}</span>
                <span class="group-section-count">(${l.length})</span>
              </div>
              ${n?i`<div class="group-rows">${this._renderRows(l)}</div>`:s}
            </div>
          `})}
      </div>
    `}_toggleGroup(C){let e=new Set(this._collapsedGroups);e.has(C)?e.delete(C):e.add(C),this._collapsedGroups=e}_warrantyLabel(C,e,t){return C.kind==="expired"?V("warranty_expired",t):C.kind==="expiring"?V("warranty_expires_in",t).replace("{days}",String(C.days??0)):V("warranty_valid_until",t).replace("{date}",N(e,t))}_renderWarrantyMeta(C,e){let t=t3(C);return i`<p class="meta">${V("warranty",e)}:
      <span class="warranty-chip warranty-${t.kind}">${this._warrantyLabel(t,C,e)}</span></p>`}_filterSelect(C,e,t,H){let L=s0({label:C,value:e,onChange:t},H);return n0()?i`<div class="filter-field">${L}</div>`:i`<label class="filter-field"><span class="filter-label">${C}</span>${L}</label>`}_renderAllObjects(){let C=this._lang,e=this._isOperator,t=this._objectViewMode==="table"&&!this.narrow,H=this._objects.filter(n=>n.object.archived).length,L=this._objects.filter(n=>this._showArchived||!n.object.archived),o=n=>this._arrangeObjects(n,!this._objBulkMode),M=o(L),l=()=>{let n=new Map;for(let p of L){let c=O2(p.object.area_id,this.hass?.areas,V("no_area",C));n.has(c)||n.set(c,[]),n.get(c).push(p)}return[...n.entries()].sort(([p],[c])=>p.localeCompare(c))};return i`
      <div class="breadcrumb">
        <ha-icon-button .label=${V("back",C)} @click=${()=>this._showOverview()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${V("all_objects",C)}</span>
        <button class="sibling-view-chip" @click=${()=>this._showAllParts()}>
          <ha-icon icon="mdi:package-variant-closed"></ha-icon> ${V("all_parts",C)}
        </button>
        <button class="sibling-view-chip" data-view="all_areas" @click=${()=>this._showAllAreas()}>
          <ha-icon icon="mdi:floor-plan"></ha-icon> ${V("all_areas",C)}
        </button>
      </div>
      <div class="filter-bar">
        ${this._filterSelect(V("sort_label",C),this._objectSortMode,n=>{this._objectSortMode=n.target.value;try{I(P.objectSort,this._objectSortMode)}catch{}this._setObjTableSort(null)},i`
            <option value="alphabetical" ?selected=${this._objectSortMode==="alphabetical"}>${V("sort_alphabetical",C)}</option>
            <option value="due_soonest" ?selected=${this._objectSortMode==="due_soonest"}>${V("sort_due_soonest",C)}</option>
            <option value="task_count" ?selected=${this._objectSortMode==="task_count"}>${V("sort_task_count",C)}</option>
        `)}
        ${this.narrow?s:i`
          <div class="view-toggle" role="group" aria-label="${V("view_mode_label",C)}">
            <button
              class="view-toggle-btn${t?"":" active"}"
              title="${V("view_cards",C)}"
              @click=${()=>this._setObjectViewMode("cards")}
            ><ha-icon icon="mdi:view-grid-outline"></ha-icon></button>
            <button
              class="view-toggle-btn${t?" active":""}"
              title="${V("view_table",C)}"
              @click=${()=>this._setObjectViewMode("table")}
            ><ha-icon icon="mdi:table"></ha-icon></button>
          </div>
        `}
        ${t?s:i`
        ${this._filterSelect(V("group_by_label",C),this._groupByMode,n=>{this._groupByMode=n.target.value;try{I(P.groupBy,this._groupByMode)}catch{}},i`
            <option value="none" ?selected=${this._groupByMode==="none"}>${V("groupby_none",C)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${V("groupby_area",C)}</option>
        `)}
        `}
        ${e?s:i`
          <ha-button
            @click=${()=>this._ui("maintenance-object-dialog").then(n=>n?.openCreate())}
          >
            ${V("new_object",C)}
          </ha-button>
        `}
        <ha-button appearance="plain" @click=${()=>this._exportObjectsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${V("settings_export_csv",C)}
        </ha-button>
        ${e?s:i`
          <ha-button appearance="plain" class="bulk-toggle obj-bulk-toggle ${this._objBulkMode?"active":""}" @click=${()=>this._toggleObjBulkMode()}>
            <ha-icon icon="mdi:checkbox-multiple-marked-outline"></ha-icon>
            ${this._objBulkMode?V("cancel",C):V("bulk_select",C)}
          </ha-button>
        `}
        ${H>0?i`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?V("hide_archived",C):`${V("show_archived",C)} (${H})`}
          </ha-button>
        `:s}
      </div>
      ${this._objBulkMode?this._renderObjBulkBar(M.roots,C):s}
      ${t?this._renderObjectsTable(M):this._groupByMode==="area"?i`
          ${l().map(([n,p])=>{let c=o(p);return i`
            ${i5({cls:"group-section",open:!0,headerCls:"group-section-header",header:i`
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <span>${n}</span>
                <span class="group-section-count">(${p.length})</span>`},i`
              <div class="objects-grid">${c.roots.map(m=>this._renderObjectCard(m,c))}</div>
            `)}
          `})}
        `:i`<div class="objects-grid">${M.roots.map(n=>this._renderObjectCard(n,M))}</div>`}
    `}_arrangeObjects(C,e=!0){let t=e?v0(C):{roots:[...C],children:new Map},H=(M,l)=>M.object.name.localeCompare(l.object.name);if(this._objectSortMode==="alphabetical")return l5(t,H),t;let L=new Map;for(let M of C){let l=q5(t,M);if(this._objectSortMode==="task_count")L.set(M.entry_id,l.reduce((n,p)=>n+p.tasks.length,0));else{let n=1/0;for(let p of l)for(let c of p.tasks){let m=c.days_until_due;m!=null&&m<n&&(n=m)}L.set(M.entry_id,n)}}let o=M=>L.get(M.entry_id)??0;return l5(t,this._objectSortMode==="task_count"?(M,l)=>o(l)-o(M)||H(M,l):(M,l)=>o(M)-o(l)||H(M,l)),t}_renderObjectCard(C,e){let t=this._lang,H=e.children.get(C.entry_id)??[],L=n=>n.tasks.some(p=>Z2(p.status)),o=n=>q5(e,n).some(L),M=o(C),l=this._objBulkMode&&this._view==="all_objects";return i`
      <div class="object-card${M?" object-card-overdue":""}${l?" selectable":""}${l&&this._objBulkSelected.has(C.entry_id)?" bulk-selected":""}"
        data-entry-id=${C.entry_id}
        @click=${()=>l?this._toggleObjBulk(C.entry_id):this._showObject(C.entry_id)}>
        ${l?i`<label class="obj-bulk-check bulk-check" @click=${n=>n.stopPropagation()}>
              <input type="checkbox" .checked=${this._objBulkSelected.has(C.entry_id)} @change=${()=>this._toggleObjBulk(C.entry_id)} />
            </label>`:s}
        ${M?i`<span class="overdue-dot" title="${V("has_overdue",t)}"></span>`:s}
        <div class="object-card-header">
          <span class="object-card-name">${this._objRef(C.object)}${C.object.name}</span>
          ${C.object.paused?i`<span class="paused-badge" title="${V("object_paused_badge",t)}${C.object.paused_until?` \u2014 ${N(C.object.paused_until,t)}`:""}">
                <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
              </span>`:s}
          ${C.object.document_count?i`<span class="doc-badge" title="${c3(C.object.document_count,t)}">
                <ha-icon icon="mdi:paperclip"></ha-icon>${C.object.document_count}
              </span>`:s}
          <span class="object-card-count">${H.length&&!C.tasks.length?p1("sub_objects_count","sub_objects_count_one",H.length,t):p1("templates_task_count","templates_task_count_one",C.tasks.length,t)}</span>
        </div>
        ${C.object.manufacturer||C.object.model?i`<div class="object-card-meta">${[C.object.manufacturer,C.object.model].filter(Boolean).join(" ")}</div>`:s}
        ${H.length?i`<div class="object-card-children" aria-label=${V("sub_objects",t)}>
              ${H.map(n=>{let p=e.children.get(n.entry_id)?.length??0;return i`<button class="object-child-chip${o(n)?" overdue":""}"
                  data-entry-id=${n.entry_id}
                  title=${o(n)?`${n.object.name}: ${V("has_overdue",t)}`:n.object.name}
                  @click=${c=>{c.stopPropagation(),this._showObject(n.entry_id)}}
                  ><span class="object-child-name">${n.object.name}</span>${p?i`<span class="object-child-count">${p}</span>`:s}</button>`})}
            </div>`:C.tasks.length===0?i`<div class="object-card-empty">${V("no_tasks_yet",t)}</div>`:s}
      </div>
    `}_setObjectViewMode(C){this._objectViewMode=C;try{I(P.objectView,C)}catch{}}_renderAllParts(){let C=this._lang,e=this._allParts,t=this._currencySymbol;return i`
      <div class="breadcrumb">
        <ha-icon-button .label=${V("back",C)} @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${V("all_parts",C)}</span>
        <button class="sibling-view-chip" @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:devices"></ha-icon> ${V("all_objects",C)}
        </button>
        <button class="sibling-view-chip" data-view="all_areas" @click=${()=>this._showAllAreas()}>
          <ha-icon icon="mdi:floor-plan"></ha-icon> ${V("all_areas",C)}
        </button>
      </div>
      <div class="filter-bar">
        <ha-button appearance="plain" @click=${()=>this._exportPartsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${V("settings_export_csv",C)}
        </ha-button>
      </div>
      ${e===null?i`<div class="empty-state">…</div>`:e.length===0?i`<div class="empty-state">${V("parts_section",C)}: 0</div>`:i`
          <div class="objects-table-wrap">
            <table class="objects-table">
              <thead>
                <tr>
                  <th>${V("part_name",C)}</th>
                  <th>${V("object",C)}</th>
                  <th>${V("part_stock",C)}</th>
                  <th>${V("part_reorder_threshold",C)}</th>
                  <th>${V("part_cost",C)}</th>
                  <th>${V("part_storage_location",C)}</th>
                  <th>${V("parts_used_by",C)}</th>
                </tr>
              </thead>
              <tbody>
                ${e.map(H=>i`
                  <tr class="objects-table-row" @click=${()=>this._showObject(H.entry_id)}>
                    <td>
                      <span class="objects-table-name">${this._objRef(this._getObject(H.entry_id)?.object)}${H.name}</span>
                      ${H.low?i`<ha-icon class="part-low-icon" icon="mdi:cart-arrow-down"
                            title="${V("part_reorder_threshold",C)}: ${H.reorder_threshold}"></ha-icon>`:s}
                    </td>
                    <td>${H.object_name||"\u2014"}</td>
                    <td class="all-parts-stock">${H.stock!==null?Q1(H.stock,H.unit,C):"\u2014"}${this._renderAllPartsUse(H)}${this._renderAllPartsBought(H)}</td>
                    <td>${H.reorder_threshold??"\u2014"}</td>
                    <td>${H.cost!=null?H.package_size?`${Q(H.cost,t,C)} / ${Q1(H.package_size,H.unit??void 0,C)}`:Q(H.cost,t,C):"\u2014"}</td>
                    <td>${H.storage_location||"\u2014"}</td>
                    <td>
                      ${H.consumers.length===0?"\u2014":H.consumers.map(L=>i`
                            <span
                              class="part-consumer-chip${L.pooled?" pooled":""}"
                              title=${`${L.object_name??""}: ${L.task_name??L.task_id} (\xD7${L.quantity})`}
                            >${L.pooled?`${L.object_name} \xB7 `:""}${L.task_name??L.task_id}</span>
                          `)}
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `}
    `}_renderAllPartsUse(C){if(this._isOperator||!(typeof C.stock=="number"&&C.stock>0))return s;let e=!!this._getObject(C.entry_id)?.object.battery_fleet;return i`<ms-part-use
      nowrap
      .hass=${this.hass}
      .entryId=${C.entry_id}
      .sparePart=${{id:C.part_id,unit:C.unit??void 0,package_size:C.package_size??void 0}}
      ?notBooked=${n2(C,this._partsCostMode,e)==="use"}
      @part-used=${()=>{this._loadAllParts(),this._loadData()}}
    ></ms-part-use>`}_renderAllPartsBought(C){if(this._isOperator||typeof C.stock!="number")return s;let e=!!this._getObject(C.entry_id)?.object.battery_fleet;return i`<ms-part-purchase
      .hass=${this.hass}
      .entryId=${C.entry_id}
      .sparePart=${{id:C.part_id,unit:C.unit??void 0,package_size:C.package_size??void 0,cost:C.cost??void 0,restock_quantity:C.restock_quantity??void 0}}
      .currencySymbol=${this._currencySymbol}
      ?onUse=${n2(C,this._partsCostMode,e)==="use"}
      @part-bought=${()=>{this._loadAllParts(),this._loadData()}}
    ></ms-part-purchase>`}_renderAllAreas(){let C=this._lang;return this._ensureAreaUi(),i`
      <div class="breadcrumb">
        <ha-icon-button .label=${V("back",C)} @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${V("all_areas",C)}</span>
        <button class="sibling-view-chip" @click=${()=>this._showAllObjects()}>
          <ha-icon icon="mdi:devices"></ha-icon> ${V("all_objects",C)}
        </button>
        <button class="sibling-view-chip" @click=${()=>this._showAllParts()}>
          <ha-icon icon="mdi:package-variant-closed"></ha-icon> ${V("all_parts",C)}
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
    `}_renderArea(){if(!this._selectedAreaId)return s;let C=this._lang;return this._ensureAreaUi(),i`
      <div class="breadcrumb">
        <ha-icon-button .label=${V("back",C)} @click=${()=>this._showAllAreas()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${V("all_areas",C)}</span>
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
    `}_exportPartsCsv(){let C=this._allParts||[],e=o=>{let M=o==null?"":String(o);return/[",\n;]/.test(M)?`"${M.replace(/"/g,'""')}"`:M},H=[["name","object","stock","unit","reorder_threshold","unit_cost","storage_location","vendor","used_by"].join(",")];for(let o of C)H.push([e(o.name),e(o.object_name),e(o.stock),e(o.unit),e(o.reorder_threshold),e(o.cost),e(o.storage_location),e(o.vendor),e(o.consumers.map(M=>`${M.object_name??""}/${M.task_name??M.task_id}\xD7${M.quantity}`).join(" | "))].join(","));let L=d1();k2(H.join(`
`),`maintenance_parts_${L}.csv`,"text/csv;charset=utf-8")}async _exportObjectsCsv(){let C=await B(this,{type:"maintenance_supporter/objects/csv"},{onError:t=>this._showToast(t)});if(!C)return;let e=d1();k2(C.csv,`maintenance_objects_${e}.csv`,"text/csv;charset=utf-8")}_renderObjectsTable(C){let e=this._lang,t=this._objectsTableColumns,H=this._objTableSort;H&&l5(C,this._objColumnCompare(H.key,H.dir));let L=h0(C,M=>this._objTreeOpen.has(M)),o=C.children.size>0;return i`
      <div class="objects-table-wrap">
        <table class="objects-table">
          <thead>
            <tr>
              ${this._objBulkMode?i`<th class="oc-bulk"></th>`:s}
              ${t.map(M=>{let l=z3.find(p=>p.key===M);if(!l||l.key==="actions")return i`<th class="oc-${M}"></th>`;let n=H?.key===M;return i`<th class="oc-${M}" aria-sort=${n?H.dir==="asc"?"ascending":"descending":"none"}>
                  <button class="area-sort ${n?"active":""}" title=${V("sort_label",e)} @click=${()=>this._setObjTableSort(M)}>
                    ${V(l.labelKey,e)}
                    ${n?i`<ha-icon icon=${H.dir==="asc"?"mdi:arrow-up":"mdi:arrow-down"}></ha-icon>`:s}
                  </button>
                </th>`})}
            </tr>
          </thead>
          <tbody>
            ${L.map(({obj:M,depth:l})=>i`
              <tr class="objects-table-row${this._objBulkMode&&this._objBulkSelected.has(M.entry_id)?" bulk-selected":""}${l?" sub-object-row":""}"
                data-entry-id=${M.entry_id}
                @click=${()=>this._objBulkMode?this._toggleObjBulk(M.entry_id):this._showObject(M.entry_id)}>
                ${this._objBulkMode?i`<td class="oc-bulk"><input type="checkbox" .checked=${this._objBulkSelected.has(M.entry_id)}
                      @click=${n=>n.stopPropagation()} @change=${()=>this._toggleObjBulk(M.entry_id)} /></td>`:s}
                ${t.map(n=>n==="name"?this._renderObjectNameCell(M,e,l,C.children.get(M.entry_id)?.length??0,o):this._renderObjectCell(n,M,e))}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `}_setObjTableSort(C){let e=this._objTableSort;this._objTableSort=C===null?null:e?.key===C?{key:C,dir:e.dir==="asc"?"desc":"asc"}:{key:C,dir:C==="task_count"?"desc":"asc"};let t=this._objTableSort;I(P.objectTableSort,t?`${t.key}:${t.dir}`:"")}_objColumnValue(C,e){let t=e.object;switch(C){case"name":return t.name;case"ref_no":return k1(t)||null;case"area_id":return t.area_id&&O2(t.area_id,this.hass?.areas,"")||null;case"documentation_url":return o1(t.documentation_url)||(t.manual_docs||[]).length?1:null;case"notes":return j5(t.notes)||null;case"task_count":return e.tasks.length;default:{let H=t[C];return typeof H=="string"&&H.trim()?H:null}}}_objColumnCompare(C,e){let t=e==="asc"?1:-1,H=(L,o)=>L.object.name.localeCompare(o.object.name,this._lang);return(L,o)=>{let M=this._objColumnValue(C,L),l=this._objColumnValue(C,o);return M===null||l===null?M===l?H(L,o):M===null?1:-1:(typeof M=="number"&&typeof l=="number"?M-l:String(M).localeCompare(String(l),this._lang,{numeric:!0,sensitivity:"base"}))*t||H(L,o)}}_renderObjectNameCell(C,e,t=0,H=0,L=!1){let o=C.object,M=this._objTreeOpen.has(C.entry_id),l=M?V("sub_objects_hide",e):V("sub_objects_show",e);return i`<td class="oc-name" style=${t?`padding-left: ${12+t*22}px`:""}>
      ${H?i`<button class="object-tree-toggle" type="button" aria-expanded=${M?"true":"false"}
            aria-label=${l} title=${l}
            @click=${n=>{n.stopPropagation(),this._toggleObjTree(C.entry_id)}}
            ><ha-icon icon=${M?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon></button>`:L?i`<span class="object-tree-spacer"></span>`:s}
      <span class="objects-table-name">${this._objRef(o)}${o.name}</span>
      ${H&&!M?i`<span class="object-tree-count" title=${V("sub_objects",e)}>${H}</span>`:s}
      ${o.document_count?i`<span class="doc-badge" title="${c3(o.document_count,e)}">
            <ha-icon icon="mdi:paperclip"></ha-icon>${o.document_count}
          </span>`:s}
    </td>`}_toggleObjTree(C){let e=new Set(this._objTreeOpen);e.has(C)?e.delete(C):e.add(C),this._objTreeOpen=e,I(P.objectTreeOpen,JSON.stringify([...e]))}_renderObjectCell(C,e,t){let H=e.object;switch(C){case"name":return this._renderObjectNameCell(e,t);case"manufacturer":return i`<td class="oc-manufacturer">${H.manufacturer||"\u2014"}</td>`;case"model":return i`<td class="oc-model">${H.model||"\u2014"}</td>`;case"serial_number":return i`<td class="oc-serial_number">${H.serial_number||"\u2014"}</td>`;case"installation_date":return i`<td class="oc-installation_date">${H.installation_date?N(H.installation_date,t):"\u2014"}</td>`;case"warranty_expiry":return i`<td class="oc-warranty_expiry">${this._renderWarrantyCell(H.warranty_expiry,t)}</td>`;case"area_id":{let L=O2(H.area_id,this.hass?.areas,"\u2014");return i`<td class="oc-area_id">${L}</td>`}case"documentation_url":{let L=(H.manual_docs||[])[0];return i`<td class="oc-documentation_url">${o1(H.documentation_url)?i`<a href=${H.documentation_url} target="_blank" rel="noopener noreferrer"
                @click=${o=>o.stopPropagation()}><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:L?i`<a href="#" title=${L.title}
                  @click=${o=>{o.preventDefault(),o.stopPropagation(),this._openManualDoc(L)}}
                  ><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:"\u2014"}</td>`}case"notes":{let L=j5(H.notes);return i`<td class="oc-notes" title=${L}>${L||"\u2014"}</td>`}case"task_count":return i`<td class="oc-task_count">${e.tasks.length}</td>`;case"ref_no":return i`<td class="oc-ref_no">${k1(H)?`#${k1(H)}`:"\u2014"}</td>`;case"actions":return i`<td class="oc-actions">
          <ha-icon-button class="obj-table-qr" title="${V("qr_code",t)}" @click=${L=>{L.stopPropagation(),this._openQrForObject(e.entry_id,H.name)}}>
            <ha-icon icon="mdi:qrcode"></ha-icon>
          </ha-icon-button>
        </td>`;default:return i`<td></td>`}}_renderWarrantyCell(C,e){let t=t3(C);return t.kind==="none"?i`<span class="warranty-none">—</span>`:i`<span class="warranty-chip warranty-${t.kind}">${this._warrantyLabel(t,C,e)}</span>`}async _onSettingsChanged(){await this._loadData()}_renderGroupsSection(){if(!this._features.groups)return s;let C=Object.entries(this._groups),e=this._lang;return i`
      <div class="groups-section">
        <div class="groups-header">
          <h3>${V("groups",e)}</h3>
          <ha-button appearance="plain" @click=${()=>this._openGroupCreate()}>
            ${V("new_group",e)}
          </ha-button>
        </div>
        ${C.length===0?i`<div class="hint">${V("no_groups",e)}</div>`:i`
            <div class="groups-grid">
              ${C.map(([t,H])=>{let L=H.task_refs.map(o=>this._getTask(o.entry_id,o.task_id)?.name).filter(Boolean);return i`
                  <div class="group-card">
                    <div class="group-card-head">
                      <div class="group-card-name">${H.name}</div>
                      <div class="group-card-actions">
                        <ha-icon-button title="${V("edit",e)}" @click=${()=>this._openGroupEdit(t)}>
                          <ha-svg-icon path="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"></ha-svg-icon>
                        </ha-icon-button>
                        <ha-icon-button title="${V("delete",e)}" @click=${()=>this._deleteGroup(t,H.name)}>
                          <ha-svg-icon path="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z"></ha-svg-icon>
                        </ha-icon-button>
                      </div>
                    </div>
                    ${H.description?i`<div class="group-card-desc">${H.description}</div>`:s}
                    <div class="group-card-tasks">
                      ${L.length>0?L.map(o=>i`<span class="group-task-chip">${o}</span>`):i`<span style="font-size:12px;color:var(--secondary-text-color)">${V("no_tasks_short",e)}</span>`}
                    </div>
                  </div>
                `})}
            </div>
          `}
      </div>
    `}_openGroupCreate(){this.shadowRoot.querySelector("maintenance-group-dialog")?.openCreate()}_openGroupEdit(C){let e=this._groups[C];e&&this.shadowRoot.querySelector("maintenance-group-dialog")?.openEdit(C,e)}async _deleteGroup(C,e){await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:V("delete_group",this._lang),message:V("delete_group_confirm",this._lang).replace("{name}",e),confirmText:V("delete",this._lang),danger:!0})&&await this._runAction({type:"maintenance_supporter/group/delete",group_id:C})}_renderBudgetTiles(){let C=this._budget;if(!C)return s;let e=this._lang,t=this._currencySymbol,H=(L,o,M)=>{if(M!==null){let{pct:l,level:n}=X7(o,M,C.alert_threshold_pct),p={danger:"var(--error-color, #f44336)",warning:"var(--warning-color, #ff9800)",ok:"var(--success-color, #4caf50)"}[n];return i`
          <div class="stat-item budget-tile" title="${L}: ${Q(o,t,e)} / ${Q(M,t,e)}">
            <span class="stat-value budget-tile-value">${Q(o,t,e)}</span>
            <span class="budget-tile-max">/ ${Q(M,t,e)}</span>
            <div class="budget-tile-bar"><div style="width:${l}%; background:${p}"></div></div>
            <span class="stat-label">${L}</span>
          </div>
        `}return i`
        <div class="stat-item budget-tile" title="${L}: ${Q(o,t,e)}">
          <span class="stat-value budget-tile-value">${Q(o,t,e)}</span>
          <span class="stat-label">${L}</span>
        </div>
      `};return i`
      ${H(V("budget_monthly",e),C.monthly_spent||0,C.monthly_budget>0?C.monthly_budget:null)}
      ${H(V("budget_yearly",e),C.yearly_spent||0,C.yearly_budget>0?C.yearly_budget:null)}
    `}_renderRows(C){let e=[this._lang,b2(this._lang),this.hass?.locale,this._bulkMode,this._bulkSelected,this._selectedEntryId,this._selectedTaskId,this._splitActive(),this._miniStatsData,this._actionLoading,this._rowActionStyle,this.narrow,this.tight];return I0(C,C4,t=>z0([t,...e],()=>this._renderOverviewRow(t)))}_renderOverviewRow(C){let e=this._lang,t=C.schedule_type==="time_based"&&C.interval_days&&C.interval_days>0,H=0,L=U2.ok,o=!1;if(t&&C.days_until_due!==null){let c=A5(C.interval_days,C.days_until_due,C.interval_unit);H=c.pct,o=c.overflow,C.status==="overdue"?L=U2.overdue:C.status==="due_soon"&&(L=U2.due_soon)}let M=C.area_id?this.hass?.areas?.[C.area_id]?.name:null,l=this._peopleOf(C).filter(c=>c!==null),n=C.group_names.length>0||M||l.length>0,p=this._bulkMode&&this._bulkSelected.has(this._bulkKey(C));return i`
      <div class="task-row${C.enabled?"":" task-disabled"}${p?" bulk-selected":""}${this._splitActive()&&C.entry_id===this._selectedEntryId&&C.task_id===this._selectedTaskId?" selected":""}">
        ${this._bulkMode?i`
          <label class="cell bulk-check" @click=${c=>c.stopPropagation()}>
            <input type="checkbox" .checked=${p} @change=${()=>this._toggleBulkRow(C)} />
          </label>
        `:s}
        <span class="cell-badges">
          ${this._statusBadge(C)}
          ${C.enabled?s:i`<span class="badge-disabled">${V("disabled",e)}</span>`}
          ${C.nfc_tag_id?i`<span class="nfc-badge" title="${V("nfc_linked",e)}"><ha-svg-icon .path=${Y0}></ha-svg-icon></span>`:s}
          ${C.priority==="high"?i`<span class="priority-badge priority-high" title="${V("priority_high",e)}"><ha-svg-icon .path=${q0}></ha-svg-icon></span>`:s}
          ${C.priority==="low"?i`<span class="priority-badge priority-low" title="${V("priority_low",e)}"><ha-svg-icon .path=${G0}></ha-svg-icon></span>`:s}
        </span>
        <span class="row-head">
          <span class="cell object-name" @click=${c=>{c.stopPropagation(),this._showObject(C.entry_id)}}>${C.object_name}</span>
          <span class="cell task-name" @click=${()=>this._showTask(C.entry_id,C.task_id)}>${this._listRef(C.entry_id,C.task_id)}${C.task_name}${u2(C.next_event_titles)}${v2(C.trigger_detail)}</span>
        </span>
        <span class="task-sub${n?"":" task-sub-empty"}">
          ${C.group_names.length>0?i`
            <span class="sub-chip" title="${V("groups",e)}">
              <ha-svg-icon .path=${Q0}></ha-svg-icon>${C.group_names.join(", ")}
            </span>`:s}
          ${M?i`
            <span class="sub-chip">
              <ha-svg-icon .path=${K0}></ha-svg-icon>${M}
            </span>`:s}
          ${z5(l,"sub-chip")}
          ${(C.labels||[]).map(c=>i`
            <span class="sub-chip label-chip" title="${V("labels",e)}">
              <ha-svg-icon .path=${J0}></ha-svg-icon>${c}
            </span>`)}
        </span>
        <span class="cell type">${V(C.type,e)}</span>
        <span class="due-cell" @click=${()=>this._showTask(C.entry_id,C.task_id)}>
          ${n3(C.days_until_due,C.last_performed,e)}
          ${t?i`<div class="days-bar"><div class="days-bar-fill${o?" overflow":""}" style="width:${H}%;background:${L}"></div></div>`:s}
          ${C.trigger_config?a3(C,{trend:i3(C,this._miniStatsData),lang:e}):!t&&C.trigger_active?i`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:s}
          ${o3(C,this._miniStatsData,this._lang)}
        </span>
        ${this._renderRowActions(e,()=>this._openCompleteDialogForRow(C),()=>this._promptSkipTask(C.entry_id,C.task_id),C.allow_skip,this._isQuick(C))}
      </div>
    `}_actionStyle(){return this._rowActionStyle}async _dismissRowActionNotice(C){let e={row_action_notice_pending:!1};C&&(e.row_action_style="icons"),await B(this,{type:"maintenance_supporter/global/update",settings:e},{onError:H=>this._showToast(H)})!==void 0&&(this._rowActionNotice=!1,C&&(this._rowActionStyle="icons"),p0())}_renderRowActions(C,e,t,H=!0,L=!1){let o=this._actionStyle(),M=L?"mdi:checkbox-blank-circle-outline":"mdi:check",l=L?V("qr_action_quick_complete",C):V("complete",C);return o==="buttons"||o==="buttons_compact"?o==="buttons_compact"&&(this.narrow||this.tight)?i`
          <span class="row-actions as-buttons compact">
            <ha-button size="small" appearance="accent" variant="success" title="${l}" aria-label="${l}" @click=${p=>{p.stopPropagation(),e()}}>
              <ha-icon icon=${M}></ha-icon>
            </ha-button>
            ${H?i`
              <ha-button size="small" appearance="outlined" variant="warning" title="${V("skip",C)}" aria-label="${V("skip",C)}" ?disabled=${this._actionLoading} @click=${p=>{p.stopPropagation(),t?.()}}>
                <ha-icon icon="mdi:skip-next"></ha-icon>
              </ha-button>`:s}
          </span>`:i`
        <span class="row-actions as-buttons">
          <ha-button size="small" appearance="accent" variant="success" title="${l}" @click=${p=>{p.stopPropagation(),e()}}>
            <ha-icon slot="start" icon="mdi:check"></ha-icon>${V("complete",C)}
          </ha-button>
          ${H?i`
            <ha-button size="small" appearance="outlined" variant="warning" title="${V("skip",C)}" ?disabled=${this._actionLoading} @click=${p=>{p.stopPropagation(),t?.()}}>
              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>${V("skip",C)}
            </ha-button>`:s}
        </span>`:i`
      <span class="row-actions">
        <ha-icon-button class="btn-complete${L?" quick":""}" title="${l}" .label=${l}
          .path=${L?U0:W0} @click=${n=>{n.stopPropagation(),e()}}></ha-icon-button>
        ${H?i`
          <ha-icon-button class="btn-skip" title="${V("skip",C)}" .label=${V("skip",C)} .path=${X0} .disabled=${this._actionLoading}
            @click=${n=>{n.stopPropagation(),t?.()}}></ha-icon-button>`:s}
      </span>`}_isQuick(C){return e2(this._getTask(C.entry_id,C.task_id))}_openCompleteDialogForRow(C){let t=this._objects.find(H=>H.entry_id===C.entry_id)?.tasks.find(H=>H.id===C.task_id);this._openCompleteDialog(C.entry_id,C.task_id,C.task_name,this._features.checklists?t?.checklist:void 0,this._features.adaptive&&!!t?.adaptive_config?.enabled)}_renderObjectDetail(){if(!this._selectedEntryId)return s;let C=this._getObject(this._selectedEntryId);if(!C)return i`<p>Object not found.</p>`;let e=C.object,t=this._lang,H=this._isOperator,L=C.tasks.filter(y=>y.archived).length,o=C.tasks.filter(y=>this._showArchived||!y.archived),M=this._arrangeObjects(this._objects.filter(y=>y.entry_id===C.entry_id||this._showArchived||!y.object.archived)),l=M.children.get(C.entry_id)??[],n=!H&&G5(C),p=i`
        <div class="detail-header">
          <h2>${e.name} ${L2(k1(e),V("ref_number",t))}</h2>
          <div class="action-buttons">
            ${H?s:i`
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(y=>y?.openCreate(C.entry_id))}}>${V("add_task",t)}</ha-button>
              <ha-button appearance="plain" @click=${()=>{this._ui("maintenance-object-dialog").then(y=>y?.openEdit(C.entry_id,e))}}>${V("edit",t)}</ha-button>
            `}
            <div class="more-menu-wrapper">
              ${J1()?z1(i`<ha-icon-button slot="trigger" .disabled=${this._actionLoading} .label=${V("more_actions",t)} .path=${e4}></ha-icon-button>`,this._objMenuEntries(C,n,H,t,!0)):i`<ha-icon-button .disabled=${this._actionLoading} .label=${V("more_actions",t)} .path=${e4} @click=${()=>this._toggleObjMenu()}></ha-icon-button>
                  ${this._objMenuOpen?t2(this._objMenuEntries(C,n,H,t,!1),()=>this._closeObjMenu()):s}
                  ${this._subObjMenu==="more"&&n?this._renderSubObjMenu(C.entry_id,t):s}`}
            </div>
          </div>
        </div>
        ${e.paused?i`<p class="meta paused-meta">
              <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
              ${V("object_paused_badge",t)}${e.paused_until?i` — ${V("paused_until_label",t)} ${N(e.paused_until,t)}`:s}
            </p>`:s}
    `,c=i`
        ${e.manufacturer||e.model?i`<p class="meta">${[e.manufacturer,e.model].filter(Boolean).join(" ")}</p>`:s}
        ${e.serial_number?i`<p class="meta">${V("serial_number_label",t)}: ${e.serial_number}</p>`:s}
        ${this._renderLineageLink(e.predecessor_entry_id,V("object_replaces",t))}
        ${this._renderLineageLink(e.replaced_by_entry_id,V("object_replaced_by",t))}
        ${e.area_id?i`<p class="meta">${V("area",t)}:
              <a href="#" class="object-area-link" @click=${y=>{y.preventDefault(),this._showArea(e.area_id)}}
                >${I5(e.area_id,this.hass?.areas,V("no_area",t))}</a></p>`:s}
        ${e.place?i`<p class="meta place-meta">
              <ha-icon icon="mdi:map-marker-outline"></ha-icon>
              ${V("filter_place",t)}: ${e.place_name||e.place}${e.remind_on_site?i` · ${V("remind_on_site",t)}`:s}
              ${e.place_missing?i`<span class="place-missing-badge">${V("place_missing",t)}</span>`:s}
            </p>`:s}
        ${o1(e.documentation_url)?i`<p class="meta">${V("documentation_url_label",t)}:
              <a href=${e.documentation_url} target="_blank" rel="noopener noreferrer">${e.documentation_url}</a>
            </p>`:(e.manual_docs||[]).length?i`<p class="meta">${V("documentation_url_label",t)}:
                ${e.manual_docs.slice(0,3).map((y,K)=>i`${K>0?" \xB7 ":""}<a href="#"
                    @click=${k=>{k.preventDefault(),this._openManualDoc(y)}}>${y.title}</a>`)}${e.manual_docs.length>3?i` … +${e.manual_docs.length-3}`:s}
              </p>`:s}
        ${e.installation_date?i`<p class="meta">${V("installed",t)}: ${N(e.installation_date,t)}</p>`:s}
        ${e.warranty_expiry?this._renderWarrantyMeta(e.warranty_expiry,t):s}
        ${e.notes?i`<div class="object-notes">
              <div class="object-notes-label">${V("object_notes_label",t)}</div>
              <div class="object-notes-body">${e5(e.notes)}</div>
            </div>`:s}
    `,m=i`
        ${l.length?this._renderObjectSection("children",V("sub_objects",t),l.length,()=>i`
        <h3 class="sub-objects-head"><span>${V("sub_objects",t)} (${l.length})</span>${n?i`
          <span class="sub-object-add-wrap">
            ${J1()?z1(i`<ha-button slot="trigger" appearance="plain" class="add-sub-object">
                    <ha-icon icon="mdi:plus"></ha-icon> ${V("add_sub_object",t)}
                    <ha-icon icon="mdi:menu-down"></ha-icon>
                  </ha-button>`,this._subObjEntries(C.entry_id,t),{placement:"bottom-start"}):i`<ha-button appearance="plain" class="add-sub-object" @click=${()=>this._toggleSubObjMenu("head")}>
                  <ha-icon icon="mdi:plus"></ha-icon> ${V("add_sub_object",t)}
                  <ha-icon icon="mdi:menu-down"></ha-icon>
                </ha-button>
                ${this._subObjMenu==="head"?this._renderSubObjMenu(C.entry_id,t):s}`}
          </span>`:s}</h3>
        <div class="objects-grid sub-objects">${l.map(y=>this._renderObjectCard(y,M))}</div>
        `):s}
    `,g=i`
        ${this._renderObjectSection("tasks",V("tasks",t),o.length,()=>i`
        <h3>${V("tasks",t)} (${o.length})${L>0?i`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            appearance="plain"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?V("hide_archived",t):`${V("show_archived",t)} (${L})`}
          </ha-button>`:s}</h3>
        ${C.tasks.length===0?i`<div class="empty-state-centered">
              <p class="empty">${V("no_tasks_yet",t)}</p>
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(y=>y?.openCreate(C.entry_id))}}>${V("add_first_task",t)}</ha-button>
            </div>`:i`<div class="task-table object-tasks">${[...o].sort((y,K)=>q1(y.status)-q1(K.status)||(y.days_until_due??99999)-(K.days_until_due??99999)).map(y=>i`
              <div class="task-row${y.enabled?"":" task-disabled"}${this._objectSplitActive()&&y.id===this._selectedTaskId?" selected":""}">
                <span class="cell-badges">
                  ${this._statusBadge(y)}
                  ${y.enabled?s:i`<span class="badge-disabled">${V("disabled",t)}</span>`}
                  ${y.nfc_tag_id?i`<span class="nfc-badge" title="${V("nfc_linked",t)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:s}
                  ${y.document_count?i`<span class="doc-badge" title="${c3(y.document_count,t)}"><ha-icon icon="mdi:paperclip"></ha-icon>${y.document_count}</span>`:s}
                </span>
                <span class="cell task-name" @click=${()=>this._showTask(C.entry_id,y.id)}>${this._listRef(C.entry_id,y.id)}${y.name}${u2(y.next_event_titles)}${v2(y.trigger_detail)}</span>
                <span class="task-sub${I1(y).length?"":" task-sub-empty"}">${l3(y,K=>this._userService?.getUserName(K)??null,K=>this._userService?.getPerson(K)??null)}</span>
                <span class="cell type">${V(y.type,t)}</span>
                <span class="due-cell" @click=${()=>this._showTask(C.entry_id,y.id)}>
                  ${n3(y.days_until_due,y.last_performed,t)}
                  ${y.trigger_config?a3(y,{trend:i3(y,this._miniStatsData),lang:t}):s}
                  ${o3(y,this._miniStatsData,this._lang)}
                </span>
                ${this._renderRowActions(t,()=>this._openCompleteDialog(C.entry_id,y.id,y.name,this._features.checklists?y.checklist:void 0,this._features.adaptive&&!!y.adaptive_config?.enabled),()=>this._promptSkipTask(C.entry_id,y.id),y.allow_skip,e2(y))}
              </div>
            `)}</div>`}
        `)}
    `,Z=i`
        ${this._renderObjectSection("documents",V("documents",t),typeof e.document_count=="number"?e.document_count:null,()=>i`
        <maintenance-documents-section
          .hass=${this.hass}
          .entryId=${C.entry_id}
          .canWrite=${!H}
        ></maintenance-documents-section>
        `)}
    `,v=i`
        ${(C.parts||[]).length||!H?this._renderObjectSection("parts",V("parts_section",t),(C.parts||[]).length,()=>i`
        <maintenance-parts-section
          .hass=${this.hass}
          .entryId=${C.entry_id}
          .parts=${C.parts||[]}
          .canWrite=${!H}
          .currencySymbol=${this._currencySymbol}
          .partsCostMode=${this._partsCostMode}
          .fleet=${!!e.battery_fleet}
          @parts-changed=${()=>this._loadData()}
        ></maintenance-parts-section>
        `):s}
    `,h=i`
        ${C.tasks.some(y=>(y.times_performed||0)>0||(y.history||[]).length>0)?this._renderObjectSection("history",V("object_history_section",t),null,()=>i`
        <maintenance-object-history-section
          .hass=${this.hass}
          .entryId=${C.entry_id}
          .object=${e}
          .tasks=${C.tasks}
          .currencySymbol=${this._currencySymbol}
          .userName=${y=>this._userService?.getUserName(y)??null}
          @open-task=${y=>this._showTask(C.entry_id,y.detail.taskId)}
        ></maintenance-object-history-section>
        `):s}
    `,x=!!(e.manufacturer||e.model||e.serial_number||e.predecessor_entry_id||e.replaced_by_entry_id||e.area_id||e.place||o1(e.documentation_url)||(e.manual_docs||[]).length||e.installation_date||e.warranty_expiry||e.notes),S=this.wide&&M1()?i`${p}
          <div class="object-columns">
            <div class="object-col">${m}${g}${h}</div>
            <div class="object-col">${x?i`<div class="object-meta">${c}</div>`:s}${Z}${v}</div>
          </div>`:i`${p}${c}${m}${g}${Z}${v}${h}`,u=i`<div class="detail-section">${S}</div>`;if(!this._objectSplitActive())return u;let T=this._selectedTaskId&&this._getTask(C.entry_id,this._selectedTaskId);return i`
      <div class="split-layout object-split">
        <div class="split-list">${u}</div>
        <div class="split-pane">
          ${T?this._renderTaskDetail():i`<div class="split-pane-empty"><ha-icon icon="mdi:cursor-default-click-outline"></ha-icon><p>${V("split_select_hint",t)}</p></div>`}
        </div>
      </div>
    `}_renderObjectSection(C,e,t,H){let L=this._lang,o=this._objectSectionOverride===C||!this._objectSectionsCollapsed.has(C),M=o?V("section_collapse",L):V("section_expand",L);return i`
      <div class="obj-section ${C} ${o?"open":"collapsed"}" data-section=${C}>
        <button class="obj-section-toggle" type="button"
          aria-expanded=${o?"true":"false"}
          aria-label=${M} title=${M}
          @click=${()=>this._toggleObjectSection(C)}>
          <ha-icon icon=${o?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        ${o?i`<div class="obj-section-body">${H()}</div>`:i`<h3 class="obj-section-title" @click=${()=>this._toggleObjectSection(C)}>
              ${e}${t!==null?i`<span class="obj-section-count">${t}</span>`:s}
            </h3>`}
      </div>
    `}_renderNewMenu(C,e=!1){let t=L=>i`
      <ha-button appearance=${e?"accent":"filled"} class="new-menu-button${e?" ms-fab":""}" size=${e?"large":s} slot=${L?"trigger":s}
        @click=${L?s:o=>{o.stopPropagation(),this._toggleNewMenu()}}>
        <ha-icon icon="mdi:plus"></ha-icon> ${V("add",C)}
        <ha-icon icon="mdi:menu-down"></ha-icon>
      </ha-button>`,H=[{label:V("new_task",C),icon:"mdi:clipboard-plus-outline",action:()=>{this._ui("maintenance-task-dialog").then(L=>L?.openCreate("",this._objects))}},{label:V("new_object",C).replace(/^\+\s*/,""),icon:"mdi:package-variant-closed-plus",action:()=>{this._ui("maintenance-object-dialog").then(L=>L?.openCreate())}},{label:V("templates_from",C),icon:"mdi:view-grid-plus-outline",action:()=>{this._openTemplateGallery()}},"divider",{label:V("adopt_problem_button",C),icon:"mdi:alert-circle-check-outline",action:()=>this._openAdoptProblemSensors()},{label:V("setups_button",C),icon:"mdi:auto-fix",action:()=>this._openSuggestedSetups()},this._batteryFleetSetupAvailable&&{label:V("battery_fleet_setup_button",C),icon:"mdi:battery-sync",action:()=>{this._setupBatteryFleet()}}];return i`
      <div class="new-menu-wrapper${e?" ms-fab-wrapper":""}">
        ${J1()?z1(t(!0),H,e?{placement:"top-end"}:{}):i`${t(!1)}${this._newMenuOpen?t2(H,()=>this._closeNewMenu(),"new-menu-popup"):s}`}
      </div>
    `}_togglePopup(C,e,t){let H=!e();t(H),this._dropPopupCloser(C),H&&setTimeout(()=>{if(!e())return;let L=()=>{t(!1),this._dropPopupCloser(C)};this._popupClosers.set(C,L),document.addEventListener("click",L)},0)}_dropPopupCloser(C){let e=this._popupClosers.get(C);e&&document.removeEventListener("click",e),this._popupClosers.delete(C)}_toggleNewMenu(){this._togglePopup("new",()=>this._newMenuOpen,C=>{this._newMenuOpen=C})}_closeNewMenu(){this._newMenuOpen=!1}_isYoungInstall(){let C=this._objects.filter(t=>!t.object?.battery_fleet),e=C.reduce((t,H)=>t+H.tasks.length,0);return C.length<3&&e<8}_gsDismissed(){try{return new Set(JSON.parse(X(P.gettingStartedDismissed)||"[]"))}catch{return new Set}}_dismissGettingStarted(C){let e=this._gsDismissed();e.add(C);try{I(P.gettingStartedDismissed,JSON.stringify([...e]))}catch{}this.requestUpdate()}_maybeLoadResetOffers(){this._resetOffersLoaded||(this._resetOffersLoaded=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/reset_offers"}).then(C=>{this._resetOffersCount=(C.offers||[]).length}).catch(()=>{this._resetOffersCount=0}))}_maybeLoadGettingStarted(){this._maybeLoadResetOffers(),!(this._gsLoaded||!this._isYoungInstall())&&(this._gsLoaded=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/discover"}).then(C=>{this._gsSetupsCount=(C.setups||[]).length}).catch(()=>{this._gsSetupsCount=0}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/problem_sensors/discover"}).then(C=>{this._gsAdoptCount=(C.sensors||[]).length}).catch(()=>{this._gsAdoptCount=0}))}_renderGettingStartedChips(C){let e=this._gsDismissed(),t=this._isYoungInstall(),H=[];return t&&this._gsSetupsCount>0&&!e.has("setups")&&H.push({id:"setups",icon:"mdi:auto-fix",text:p1("gs_setups_chip","gs_setups_chip_one",this._gsSetupsCount,C),run:()=>this._openSuggestedSetups()}),t&&this._gsAdoptCount>0&&!e.has("adopt")&&H.push({id:"adopt",icon:"mdi:alert-circle-check-outline",text:p1("gs_adopt_chip","gs_adopt_chip_one",this._gsAdoptCount,C),run:()=>this._openAdoptProblemSensors()}),this._resetOffersCount>0&&!e.has("resets")&&H.push({id:"resets",icon:"mdi:counter",text:p1("gs_reset_chip","gs_reset_chip_one",this._resetOffersCount,C),run:()=>this._openSuggestedSetups()}),this._batteryFleetSetupAvailable&&!e.has("fleet")&&H.push({id:"fleet",icon:"mdi:battery-sync",text:V("gs_fleet_chip",C),run:()=>this._setupBatteryFleet()}),H.length===0?s:i`
      <div class="gs-chips-wrap">
        <div class="gs-chips-label">${V("gs_label",C)}</div>
        <div class="gs-chips">
          ${H.map(L=>i`
            <div class="gs-chip" @click=${()=>L.run()}>
              <ha-icon icon="${L.icon}"></ha-icon>
              <span>${L.text}</span>
              <span class="gs-chip-x" title="${V("dismiss",C)}"
                @click=${o=>{o.stopPropagation(),this._dismissGettingStarted(L.id)}}>
                <ha-icon icon="mdi:close"></ha-icon>
              </span>
            </div>
          `)}
        </div>
      </div>
    `}_toggleObjMenu(){this._togglePopup("object",()=>this._objMenuOpen,C=>{this._objMenuOpen=C})}_closeObjMenu(){this._objMenuOpen=!1}_toggleMoreMenu(){this._togglePopup("more",()=>this._moreMenuOpen,C=>{this._moreMenuOpen=C})}_closeMoreMenu(){this._moreMenuOpen=!1}get _sparklineCtx(){return{lang:this._lang,hass:this.hass,detailStatsData:this._detailStatsData,hasStatsService:!!this._statsService,historyFallbackIds:this._statsService?.historyFallbackIds,isCounterEntity:j1,rangeDays:this._chartRangeDays,setRangeDays:C=>this._setChartRange(C),hideOutliers:this._hideOutliers,setHideOutliers:C=>this._setHideOutliers(C)}}_toggleSection(C){let e=new Set(this._collapsedSections);e.has(C)?e.delete(C):e.add(C),this._collapsedSections=e;try{I(P.collapsedSections,JSON.stringify([...e]))}catch{}}_historyCtx(){let C=this._selectedEntryId&&this._selectedTaskId?this._getObject(this._selectedEntryId)?.tasks.find(L=>L.id===this._selectedTaskId):void 0,e=this._fullHistory,t=e&&e.entryId===this._selectedEntryId&&e.taskId===this._selectedTaskId&&e.entries.length>(C?.history||[]).length?e.entries:C?.history||[],H=t.filter(L=>L.reading_value!=null).sort((L,o)=>L.timestamp.localeCompare(o.timestamp));return{lang:this._lang,hass:this.hass,filter:this._historyFilter,search:this._historySearch,currencySymbol:this._currencySymbol,setFilter:L=>{this._historyFilter=L},setSearch:L=>{this._historySearch=L},openEdit:this._isOperator?void 0:L=>this._openHistoryEdit(L),readingUnit:C?.reading_unit??null,triggerUnit:K1(this.hass,C)||null,taskRef:P1(this._selectedEntryId?this._getObject(this._selectedEntryId)?.object:null,C),phaseNames:Object.fromEntries(Object.entries(C?.phases||{}).map(([L,o])=>[L,o.name])),readingDelta:L=>{let o=H.findIndex(M=>M.timestamp===L.timestamp);return o<=0?null:L.reading_value-H[o-1].reading_value},readingSlotDelta:(L,o)=>Y3(t,L,o)}}_taskDetailCtx(){let C=this._selectedEntryId,e=this._selectedTaskId,t=this._getObject(C);return{lang:this._lang,hass:this.hass,entryId:C,taskId:e,objectName:t?.object.name||"",taskRef:P1(t?.object,t?.tasks.find(H=>H.id===e)),objectDocUrl:t?.object?.documentation_url??null,objectManualDocs:t?.object?.manual_docs??[],openManualDoc:H=>this._openManualDoc(H),setChecklistItem:(H,L)=>this._setChecklistItem(C,e,H,L),setPhaseCursor:H=>{this._runAction({type:"maintenance_supporter/task/set_phase",entry_id:C,task_id:e,cursor:H})},isOperator:this._isOperator,actionLoading:this._actionLoading,moreMenuOpen:this._moreMenuOpen,activeTab:this._activeTab,features:this._features,mirrorTodoDefault:this._mirrorTodoDefault,currencySymbol:this._currencySymbol,collapsedSections:this._collapsedSections,costDurationToggle:this._costDurationToggle,suggestionDismissed:this._dismissedSuggestions.has(`${C}_${e}`),sparkline:this._sparklineCtx,history:this._historyCtx(),getUserName:H=>this._userService?.getUserName(H)??null,getPerson:H=>this._userService?.getPerson(H)??null,setActiveTab:H=>{this._activeTab=H},toggleSection:H=>this._toggleSection(H),setCostDurationToggle:H=>{this._costDurationToggle=H},showTaskView:()=>this._showFullTaskPage(C,e),showObject:()=>this._showObject(C),toggleMoreMenu:()=>this._toggleMoreMenu(),closeMoreMenu:()=>this._closeMoreMenu(),openEdit:H=>{this._ui("maintenance-task-dialog").then(L=>L?.openEdit(C,H))},openComplete:(H,L)=>this._openCompleteDialog(C,e,H.name,this._features.checklists?H.checklist:void 0,this._features.adaptive&&!!H.adaptive_config?.enabled,L),promptSkip:()=>this._promptSkipTask(C,e),toggleArchive:H=>this._toggleArchiveTask(C,e,H),togglePause:H=>this._togglePauseTask(C,e,H),openQr:H=>this._openQrForTask(C,e,t?.object.name||"",H),duplicateTask:()=>this._duplicateTask(C,e),moveTask:()=>this._moveTask(C,e),promptReset:()=>this._promptResetTask(C,e),promptPostpone:()=>this._promptPostponeTask(C,e),snoozeTask:()=>this._snoozeTask(C,e),printWorksheet:()=>this._printTaskWorksheet(C,e),deleteTask:()=>this._deleteTask(C,e),applySuggestion:H=>this._applySuggestion(C,e,H),reanalyze:()=>this._reanalyzeInterval(C,e),dismissSuggestion:()=>this._dismissSuggestion(C,e),openSeasonalOverrides:H=>this._openSeasonalOverrides(H)}}async _fetchFullHistory(C,e){let t;try{t=await o5(this.hass,C,e)}catch{t=null}this._selectedEntryId===C&&this._selectedTaskId===e&&(this._fullHistory=t?{entryId:C,taskId:e,entries:t}:null)}_renderTaskDetail(){if(!this._selectedEntryId||!this._selectedTaskId)return s;let C=this._getTask(this._selectedEntryId,this._selectedTaskId);if(!C)return i`<p>Task not found.</p>`;let e=this._fullHistory,t=e&&e.entryId===this._selectedEntryId&&e.taskId===this._selectedTaskId&&e.entries.length>(C.history||[]).length?{...C,history:e.entries}:C;return i`<maintenance-task-detail-view
      .task=${t}
      .ctx=${this._taskDetailCtx()}
    ></maintenance-task-detail-view>`}_openHistoryEdit(C){if(!this._selectedEntryId||!this._selectedTaskId)return;let e=this._getTask(this._selectedEntryId,this._selectedTaskId),t=m0(this._selectedEntryId,this._selectedTaskId,C,e);this.shadowRoot?.querySelector("maintenance-history-edit-dialog")?.openEdit(t)}};_.styles=[M2,L5,V7],d([b({attribute:!1})],_.prototype,"hass",2),d([b({type:Boolean,reflect:!0})],_.prototype,"narrow",2),d([b({type:Boolean,reflect:!0})],_.prototype,"tight",2),d([b({type:Boolean,reflect:!0})],_.prototype,"split",2),d([b({type:Boolean,reflect:!0})],_.prototype,"wide",2),d([b({attribute:!1})],_.prototype,"panel",2),d([b({type:Boolean,reflect:!0})],_.prototype,"embedded",2),d([b({attribute:!1})],_.prototype,"presets",2),d([A()],_.prototype,"_objects",2),d([A()],_.prototype,"_stats",2),d([A()],_.prototype,"_view",2),d([A()],_.prototype,"_allParts",2),d([A()],_.prototype,"_selectedEntryId",2),d([A()],_.prototype,"_selectedTaskId",2),d([A()],_.prototype,"_selectedAreaId",2),d([A()],_.prototype,"_filterStatus",2),d([A()],_.prototype,"_filterUser",2),d([A()],_.prototype,"_filterLabel",2),d([A()],_.prototype,"_filterPlace",2),d([A()],_.prototype,"_filterPriority",2),d([A()],_.prototype,"_savedViews",2),d([A()],_.prototype,"_activeViewId",2),d([A()],_.prototype,"_unsub",2),d([A()],_.prototype,"_chartRangeDays",2),d([A()],_.prototype,"_hideOutliers",2),d([A()],_.prototype,"_historyFilter",2),d([A()],_.prototype,"_budget",2),d([A()],_.prototype,"_groups",2),d([A()],_.prototype,"_detailStatsData",2),d([A()],_.prototype,"_miniStatsData",2),d([A()],_.prototype,"_features",2),d([A()],_.prototype,"_adminPanelUserIds",2),d([A()],_.prototype,"_operatorWriteEnabled",2),d([A()],_.prototype,"_defaultWarningDays",2),d([A()],_.prototype,"_mirrorTodoDefault",2),d([A()],_.prototype,"_rowActionStyle",2),d([A()],_.prototype,"_refsInLists",2),d([A()],_.prototype,"_partsCostMode",2),d([A()],_.prototype,"_rowActionNotice",2),d([A()],_.prototype,"_actionLoading",2),d([A()],_.prototype,"_moreMenuOpen",2),d([A()],_.prototype,"_objMenuOpen",2),d([A()],_.prototype,"_subObjMenu",2),d([A()],_.prototype,"_toastMessage",2),d([A()],_.prototype,"_toastKind",2),d([A()],_.prototype,"_toastUndo",2),d([A()],_.prototype,"_toastActionLabel",2),d([A()],_.prototype,"_filtersOpen",2),d([A()],_.prototype,"_listSearch",2),d([A()],_.prototype,"_filterPaneOpen",2),d([A()],_.prototype,"_paneSections",2),d([A()],_.prototype,"_newMenuOpen",2),d([A()],_.prototype,"_gsSetupsCount",2),d([A()],_.prototype,"_gsAdoptCount",2),d([A()],_.prototype,"_resetOffersCount",2),d([A()],_.prototype,"_batteryFleetSetupAvailable",2),d([A()],_.prototype,"_staleBundle",2),d([A()],_.prototype,"_restartPendingVersion",2),d([A()],_.prototype,"_overviewTab",2),d([A()],_.prototype,"_activeTab",2),d([A()],_.prototype,"_costDurationToggle",2),d([A()],_.prototype,"_historySearch",2),d([A()],_.prototype,"_sortMode",2),d([A()],_.prototype,"_objectSortMode",2),d([A()],_.prototype,"_objTableSort",2),d([A()],_.prototype,"_groupByMode",2),d([A()],_.prototype,"_objectViewMode",2),d([A()],_.prototype,"_objectsTableColumns",2),d([A()],_.prototype,"_showArchived",2),d([A()],_.prototype,"_bulkMode",2),d([A()],_.prototype,"_bulkSelected",2),d([A()],_.prototype,"_objBulkMode",2),d([A()],_.prototype,"_objBulkSelected",2),d([A()],_.prototype,"_bulkMenuOpen",2),d([A()],_.prototype,"_virtStart",2),d([A()],_.prototype,"_virtEnd",2),d([A()],_.prototype,"_collapsedGroups",2),d([A()],_.prototype,"_collapsedSections",2),d([A()],_.prototype,"_objectSectionsCollapsed",2),d([A()],_.prototype,"_objectSectionOverride",2),d([A()],_.prototype,"_objTreeOpen",2),d([A()],_.prototype,"_paletteOpen",2),d([A()],_.prototype,"_paletteQuery",2),d([A()],_.prototype,"_paletteActive",2),d([A()],_.prototype,"_searchRemote",2),d([A()],_.prototype,"_templateGalleryOpen",2),d([A()],_.prototype,"_templates",2),d([A()],_.prototype,"_homeProfile",2),d([A()],_.prototype,"_templateCategories",2),d([A()],_.prototype,"_templateBusy",2),d([A()],_.prototype,"_templateParentId",2),d([A()],_.prototype,"_templatePreview",2),d([A()],_.prototype,"_templatePicked",2),d([A()],_.prototype,"_fullHistory",2),_=d([x3("maintenance-supporter-panel")],_);export{_ as MaintenanceSupporterPanel};
/*! Bundled license information:

lit-html/directives/repeat.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/guard.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
