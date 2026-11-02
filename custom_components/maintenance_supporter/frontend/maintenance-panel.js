/*! maintenance_supporter frontend 2.117.1 */
import{a as ca,b as da,c as pa,d as ha,h as ga}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-XUU5OHBY.js";import{a as Aa}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-RKESJIX7.js";import{A as xa,B as Ta,C as M,D as Le,E as qt,F as vt,G as Ia,H as es,I as gi,J as is,K as za,L as fi,M as Ha,N as La,O as Ga,P as Ka,Q as Ya,R as Qa,S as yi,T as Xa,U as Ja,V as xi,W as Za,X as tr,Y as er,Z as ir,_ as sr,a as ct,b as Os,c as Ct,d as Pt,e as Ge,f as de,fa as ar,g as Ls,h as Ye,i as qi,ia as rr,j as Bs,k as Fi,l as Ns,m as qs,n as Ui,o as Vi,p as Wi,q as Fs,r as Qe,s as Us,t as aa,u as ni,v as Qi,w as ma,x as _a,y as oi,z as ya}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-OD4Z56EF.js";import{b as ui,c as Da,d as ye,f as ts,h as _i,i as Pa,k as os}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-7EISV3UQ.js";import{a as ve}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-C2PPOSIE.js";import{a as sa,b as ti,c as Lt,d as ei,e as Pe,f as ii}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-S4QLK2YS.js";import{a as We,b as Ms,c as ce,d as wa,e as ka,f as $a,g as di,h as Xi,i as Ie,j as Ji,z as mi}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-66H4EP2U.js";import{a as ss,b as Ba,c as as,d as rs,e as Na,f as bi,g as qa}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-GJ3CET3P.js";import{a as vi}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-JWQ5V2FU.js";import{a as ge,b as ze,c as jt,d as Zt,e as fe,f as Nt,g as be,h as Oa,i as Ma}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-4JCL5ODL.js";import{b as ns}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-P2LL2RRL.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-L7WUZSXK.js";import{a as Ea,b as Ca}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-CLXWLSQT.js";import{c as Ra}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YD6ZKFPM.js";import{a as P,b as J,c as q}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-OKFYIODZ.js";import{b as me,c as li,d as ba,e as va,f as ci,g as Bt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-JKMAY2UF.js";import{b as ua,i as fa}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ISRXFJNT.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-ZPA7ULMY.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-TAWYUIN3.js";import{a as De,c as $}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6CP33J4R.js";import{a as re}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6TACRSHP.js";import{a as oa,b as la}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BTFPVHIJ.js";import{d as Sa,e as Zi,f as ja}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-CCUM3UPQ.js";import{a as hi}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-CSVN5VOV.js";import{a as te,m as He}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-A7XXBZWS.js";import{a as Fa,b as Ua,c as Va,d as Wa}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-2GNREGP6.js";import{a as _e,b as pi}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-67RXJJIJ.js";import{a as Is,b as Kt,c as Yt,d as Ni,e as zs,g as It,h as Qt,i as ae,j as Re,k as Ke,l as Hs}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BLQMFVFO.js";import{a as bt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-EHGALKJR.js";import{a as I,b as ra,c as na,d as Yi}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-JDFQHH5S.js";import{a as dt,b as Ki,d as si,e as ai,f as ri}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-J5BX3TZ6.js";import{$ as Mt,A as a,B as Oe,C as ut,E as Ys,F as Qs,G as mt,I as St,J as Gi,L as zt,M as Xs,N as Je,O as pe,P as Me,R as _t,S as Ot,T as W,U as Js,V as Y,W as Jt,Y as U,Z as wt,a as m,aa as Ze,b as H,c as o,ca as Zs,d as K,da as ta,e as Ee,ea as Ae,f as h,h as Cs,ha as ea,i as L,ia,j as Bi,k as As,ka as Ht,l as Ds,la as he,m as Ps,n as j,o as f,p as Xe,pa as ue,q as Vs,r as Ws,s as Gs,t as Xt,u as Ks,v as Ce,z as N}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-WFO3C6B4.js";var gn=["assignee_pool","required_completion_fields","checklist","labels","mirror_todo_entities","next_event_titles","history","readings"],fn=["checklist_progress"],bn=["tasks","parts"],vn=["manual_docs","battery_fleet_excluded"];function ls(r,l,t=[]){for(let e of l)r[e]===void 0&&(r[e]=[]);for(let e of t)r[e]===void 0&&(r[e]={})}function yn(r){let l=r;ls(l,bn),l.object&&typeof l.object=="object"&&ls(l.object,vn);for(let t of l.tasks)ls(t,gn,fn);return r}function Be(r){for(let l of r)yn(l);return r}function xn(r,l){if(l.objects)return l.objects;let t=l.delta||[],e=l.removed||[];if(!t.length&&!e.length)return null;let i=new Map(r.map(s=>[s.entry_id,s]));for(let s of t)i.set(s.entry_id,s);for(let s of e)i.delete(s);return[...i.values()]}function nr(r,l){return l.objects&&Be(l.objects),l.delta&&Be(l.delta),xn(r,l)}var or=(r,l,t)=>{let e=new Map;for(let i=l;i<=t;i++)e.set(r[i],i);return e},lr=Kt(class extends Yt{constructor(r){if(super(r),r.type!==Is.CHILD)throw Error("repeat() can only be used in text expressions")}dt(r,l,t){let e;t===void 0?t=l:l!==void 0&&(e=l);let i=[],s=[],n=0;for(let c of r)i[n]=e?e(c,n):n,s[n]=t(c,n),n++;return{values:s,keys:i}}render(r,l,t){return this.dt(r,l,t).values}update(r,[l,t,e]){let i=Re(r),{values:s,keys:n}=this.dt(l,t,e);if(!Array.isArray(i))return this.ut=n,s;let c=this.ut??=[],d=[],u,p,_=0,g=i.length-1,b=0,x=s.length-1;for(;_<=g&&b<=x;)if(i[_]===null)_++;else if(i[g]===null)g--;else if(c[_]===n[b])d[b]=Qt(i[_],s[b]),_++,b++;else if(c[g]===n[x])d[x]=Qt(i[g],s[x]),g--,x--;else if(c[_]===n[x])d[x]=Qt(i[_],s[x]),It(r,d[x+1],i[_]),_++,x--;else if(c[g]===n[b])d[b]=Qt(i[g],s[b]),It(r,i[_],i[g]),g--,b++;else if(u===void 0&&(u=or(n,b,x),p=or(c,_,g)),u.has(c[_]))if(u.has(c[g])){let T=p.get(n[b]),y=T!==void 0?i[T]:null;if(y===null){let k=It(r,i[_]);Qt(k,s[b]),d[b]=k}else d[b]=Qt(y,s[b]),It(r,i[_],y),i[T]=null;b++}else Ke(i[g]),g--;else Ke(i[_]),_++;for(;b<=x;){let T=It(r,d[x+1]);Qt(T,s[b]),d[b++]=T}for(;_<=g;){let T=i[_++];T!==null&&Ke(T)}return this.ut=n,ae(r,d),Ee}});var wn={},cr=Kt(class extends Yt{constructor(){super(...arguments),this.ot=wn}render(r,l){return l()}update(r,[l,t]){if(Array.isArray(l)){if(Array.isArray(this.ot)&&this.ot.length===l.length&&l.every((e,i)=>e===this.ot[i]))return Ee}else if(this.ot===l)return Ee;return this.ot=Array.isArray(l)?Array.from(l):l,this.render(l,t)}});var dr=r=>zs(r)?r._$litType$.h:r.strings,cs=Kt(class extends Yt{constructor(r){super(r),this.et=new WeakMap}render(r){return[r]}update(r,[l]){let t=Ni(this.it)?dr(this.it):null,e=Ni(l)?dr(l):null;if(t!==null&&(e===null||t!==e)){let i=Re(r).pop(),s=this.et.get(t);if(s===void 0){let n=document.createDocumentFragment();s=Cs(h,n),s.setConnected(!1),this.et.set(t,s)}ae(s,[i]),It(s,void 0,i)}if(e!==null){if(t===null||t!==e){let i=this.et.get(e);if(i!==void 0){let s=Re(i).pop();Hs(r),It(r,void 0,s),ae(r,[s])}}this.it=l}else this.it=void 0;return this.render(l)}});var pr=Kt(class extends Yt{constructor(){super(...arguments),this.key=h}render(r,l){return this.key=r,l}update(r,[l,t]){return l!==this.key&&(ae(r),this.key=l),t}});function hr(r,l){let t=r,e=l;if(t===e||t.states===e.states)return!1;for(let i of new Set([...Object.keys(t),...Object.keys(e)]))if(i!=="states"&&t[i]!==e[i])return!1;return!0}var ds=["today","dashboard","calendar","settings"];var kn=168*3600*1e3;function ur(){try{let r=J(P.objectsCache);if(!r)return null;let l=JSON.parse(r);return l.v!==Bi||!Number.isFinite(l.at)||Date.now()-l.at>kn||!Array.isArray(l.objects)||l.objects.length===0?null:{objects:l.objects,stats:l.stats??null,...typeof l.beta=="boolean"?{beta:l.beta}:{}}}catch{return null}}function ps(r,l,t=dt()){if(!(!Array.isArray(r)||r.length===0))try{let e={v:Bi,at:Date.now(),objects:r,stats:l,beta:t};q(P.objectsCache,JSON.stringify(e))}catch{}}function Ft(r){return r.responsible_user_id?[r.responsible_user_id]:[...new Set((r.assignee_pool||[]).filter(l=>typeof l=="string"&&l))]}function Ne(r,l){return!!l&&Ft(r).includes(l)}var $n={days:1,weeks:7,months:30.4368,years:365.25};function hs(r,l){return!r||r<=0?0:r*($n[l||"days"]??1)}function wi(r,l,t){let e=hs(r,t);if(e<=0||l==null)return{pct:0,overflow:!1};let i=(e-l)/e*100;return{pct:Math.max(0,Math.min(100,i)),overflow:i>100}}function mr(r,l,t,e,i,s){let n=[[t.manufacturer,r.manufacturer],[t.model,r.model],[t.serial,r.serial_number],[t.installed,r.installation_date?e(r.installation_date):null],[t.warranty,r.warranty_expiry?e(r.warranty_expiry):null]].filter(([,u])=>!!u),c=l.map(u=>{let p=t.scheduleLabel(u);return`<tr>
      <td>${$(u.name)}</td>
      <td>${$(t.typeLabel(u.type))}</td>
      <td>${$(t.statusLabel(u.status))}</td>
      <td>${$(p)}</td>
      <td>${$(u.last_performed?e(u.last_performed):t.none)}</td>
      <td>${$(u.next_due?e(u.next_due):t.none)}</td>
      <td class="num">${u.times_performed??0}</td>
      <td class="num">${$(i(u.total_cost??0))}</td>
    </tr>`}).join(""),d=l.reduce((u,p)=>u+(p.total_cost??0),0);return`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${$(t.title)} \u2014 ${$(r.name)}</title>
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
  <h1>${$(r.name)}</h1>
  <p class="sub">${$(t.title)} \xB7 ${$(t.generated)}: ${$(e(s))}</p>
  ${n.length?`<div class="meta">${n.map(([u,p])=>`<div><div class="k">${$(u)}</div>${$(p)}</div>`).join("")}</div>`:""}
  <h2>${$(t.tasksHeading)} (${l.length})</h2>
  <table>
    <thead><tr>
      <th>${$(t.colTask)}</th><th>${$(t.colType)}</th><th>${$(t.colStatus)}</th>
      <th>${$(t.colSchedule)}</th><th>${$(t.colLastDone)}</th><th>${$(t.colNextDue)}</th>
      <th class="num">${$(t.colTimes)}</th><th class="num">${$(t.colCost)}</th>
    </tr></thead>
    <tbody>${c||`<tr><td colspan="8">${$(t.none)}</td></tr>`}</tbody>
    <tfoot><tr><td colspan="7">${$(t.totalCost)}</td><td class="num">${$(i(d))}</td></tr></tfoot>
  </table>
  ${r.notes?`<div class="notes"><strong>${$(t.notes)}:</strong>
${$(r.notes)}</div>`:""}
</body></html>`}var Tn=60;function us(r,l=mt()){if(!r)return{kind:"none",days:null,date:null};let t=Xs(l,r);return Number.isFinite(t)?t<0?{kind:"expired",days:t,date:r}:t<=Tn?{kind:"expiring",days:t,date:r}:{kind:"valid",days:t,date:r}:{kind:"none",days:null,date:null}}function Sn(r,l){let t=Date.parse(r);return Number.isNaN(t)?r.slice(0,10):l(Qs(t,Ys()))}function _r(r,l,t,e,i,s,n,c,d,u=[],p=null){let _=[[t.object,$(l)],[t.type,$(t.typeLabel(r.type))],[t.interval,$(i(r))],[t.nextDue,r.next_due?$(e(r.next_due)):"\u2014"],[t.lastDone,r.last_performed?$(e(r.last_performed)):$(t.never)]];r.priority&&r.priority!=="normal"&&_.push([t.priority,$(t.priorityLabel(r.priority))]);let g=(r.checklist||[]).map(x=>`<li><span class="box"></span>${$(x)}</li>`).join(""),b=(x,T)=>x?`<figure class="qr"><img src="${x}" alt="" /><figcaption>${$(T)}</figcaption></figure>`:"";return`<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="color-scheme" content="light">
<title>${$(r.name)} \u2014 ${$(t.title)}</title>
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
      <h1>${$(r.name)}${p?` <span class="ref">#${$(p)}</span>`:""}</h1>
      <div class="obj">${$(l)}</div>
    </div>
    <div class="qr-row">
      ${b(s,t.scanView)}
      ${b(n,t.scanComplete)}
    </div>
  </header>
  <table class="meta">
    ${_.map(([x,T])=>`<tr><td>${$(x)}</td><td>${T}</td></tr>`).join("")}
  </table>
  ${g?`<h2>${$(t.checklist)}</h2><ul class="check">${g}</ul>`:""}
  ${u.length?`<h2>${$(t.parts)}</h2><ul class="check">${u.map(x=>`<li><span class="box"></span>${$(x)}</li>`).join("")}</ul>`:""}
  ${r.notes?`<h2>${$(t.notes)}</h2><div class="notes">${$(r.notes)}</div>`:""}
  ${c?`<h2>${$(t.manualExcerpt)}</h2>
    <div class="excerpt">${$(c.title)} \u2014 ${$(t.pages)} ${c.startPage}\u2013${c.endPage}:
      <a href="${$(c.url)}" target="_blank" rel="noopener">PDF</a>
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
  <footer>${$(l)} \xB7 ${$(r.name)} \xB7 ${$(t.printedOn)} ${$(Sn(d,e))}</footer>
</body></html>`}var ee=["manual","warranty","invoice","spare_parts","photo","other"],ki={manual:"mdi:book-open-variant",warranty:"mdi:shield-check",invoice:"mdi:receipt-text-outline",spare_parts:"mdi:cog-outline",photo:"mdi:image-outline",other:"mdi:file-document-outline"};function gt(r){return r.title||r.filename||r.url||""}function xe(r){return(r.tags||[]).find(l=>ee.includes(l))??"other"}function gr(r){return(r.tags||[]).includes("photo")}function we(r){let l=(r??[]).filter(t=>!!t);return l.length?o`<span class="event-titles"> · ${l.join(", ")}</span>`:h}function ke(r){return r?o`<span class="event-titles trigger-detail"> · ${r}</span>`:h}var fr=H`
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
  .split-list .task-table.grouped > .group-section:first-child,
  .split-list .task-table.grouped > .virt-sizer:first-child + .group-section { margin-top: 0; }
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
  /* The chip's baseline is its text's, as it was while the glyph was an
     ha-icon (a line box inside). An ha-svg-icon in front gave it the
     glyph's bottom edge, and on the baseline-aligned desktop row the chips
     sat 3 px above the task name (v2.117.0). A zero-width character leads
     instead, its negative margin taking back the gap. */
  .sub-chip::before {
    content: "\\200b";
    margin-inline-end: -4px;
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
  .row-actions ha-icon-button,
  .row-actions .row-icon-btn {
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
  .row-actions.as-buttons ha-icon,
  .row-actions.as-buttons ha-svg-icon { --mdc-icon-size: 18px; }

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
  :host([narrow]) .task-row .status-badge ha-icon,
  :host([narrow]) .task-row .status-badge ha-svg-icon { --mdc-icon-size: 16px; margin-left: 0; }
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
  :host([tight]) .row-actions.compact ha-icon,
  :host([narrow]) .row-actions.compact ha-svg-icon,
  :host([tight]) .row-actions.compact ha-svg-icon { --mdc-icon-size: 20px; }

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
  :host([tight]:not([narrow])) .task-row .status-badge ha-icon,
  :host([tight]:not([narrow])) .task-row .status-badge ha-svg-icon { --mdc-icon-size: 16px; margin-left: 0; }
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
    .task-row .status-badge ha-icon,
    .task-row .status-badge ha-svg-icon { --mdc-icon-size: 16px; margin-left: 0; }
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
`;function ie(){return si("ha-dropdown")}var br=r=>r.filter(l=>!!l);function ne(r,l,t=""){return o`
    <div class="popup-menu${t?" "+t:""}" role="menu" @keydown=${Ta} @click=${e=>e.stopPropagation()}>
      ${br(r).map(e=>e==="divider"?o`<div class="popup-menu-divider"></div>`:o`<div role="menuitem" tabindex="0" class="popup-menu-item${e.cls?" "+e.cls:""}${e.danger?" danger":""}${e.selected?" selected":""}"
            @click=${()=>{l(),e.action()}}>${e.icon?o`<ha-icon icon=${e.icon}></ha-icon> `:h}${e.label}</div>`)}
    </div>`}function Ut(r,l,t={}){let e=br(l);return o`
    <ha-dropdown class=${t.cls??""} placement=${t.placement??"bottom-end"}
      @wa-select=${i=>{let s=i.detail?.item,n=e[Number(s?.value??s?.getAttribute("value"))];n&&n!=="divider"&&n.action()}}>
      ${r}
      ${e.map((i,s)=>i==="divider"?o`<wa-divider></wa-divider>`:o`<ha-dropdown-item value=${String(s)} class=${`${i.cls??""}${i.selected?" selected":""}`} variant=${i.danger?"danger":"default"}>
            ${i.icon?o`<ha-icon slot="icon" icon=${i.icon}></ha-icon>`:h}${i.label}
          </ha-dropdown-item>`)}
    </ha-dropdown>`}var vr=300*1e3,jn=30,$i=14;function ms(r,l,t,e){return`${r}:${l}:${t}:${e?"counter":"level"}`}var Ti=class{constructor(l){this._cache=new Map;this._pending=new Map;this.historyFallbackIds=new Set;this._hass=l}updateHass(l){this._hass=l}async getDetailStats(l,t,e=jn){return this._getStats(l,e<=35?"hour":"day",e,t)}async getMiniStats(l,t){return this._getStats(l,"day",$i,t)}async getBatchMiniStats(l){let t=new Map,e=[];for(let d of l){let u=ms(d.entityId,"day",$i,d.isCounter),p=this._cache.get(u);p&&Date.now()-p.fetchedAt<vr?t.set(be(d.entityId,d.isCounter),p.points):e.push(d)}if(e.length===0)return t;let i=e.filter(d=>d.isCounter).map(d=>d.entityId),s=e.filter(d=>!d.isCounter).map(d=>d.entityId),n=new Date(Date.now()-$i*24*60*60*1e3).toISOString(),c=[];return i.length>0&&c.push(this._fetchBatch(i,"day",n,["state","sum","change"],!0,t)),s.length>0&&c.push(this._fetchBatch(s,"day",n,["mean","min","max"],!1,t)),await Promise.all(c),t}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(l,t,e,i){let s=ms(l,t,e,i),n=this._cache.get(s);if(n&&Date.now()-n.fetchedAt<vr)return n.points;if(this._pending.has(s))return this._pending.get(s);let c=this._fetchAndNormalize(l,t,e,i,s);this._pending.set(s,c);try{return await c}finally{this._pending.delete(s)}}async _fetchAndNormalize(l,t,e,i,s){let n=new Date(Date.now()-e*24*60*60*1e3).toISOString(),c=i?["state","sum","change"]:["mean","min","max"];try{let u=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:n,statistic_ids:[l],period:t,types:c}))[l]||[],p=this._normalizeRows(u,i);if(p.length<2){let _=await this._fetchHistoryFallback(l,n);_.length>=2?(p=_,this.historyFallbackIds.add(l)):this.historyFallbackIds.delete(l)}else this.historyFallbackIds.delete(l);return this._cache.set(s,{entityId:l,fetchedAt:Date.now(),period:t,points:p}),p}catch(d){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${l}:`,d),[]}}async _fetchHistoryFallback(l,t){try{let i=(await this._hass.connection.sendMessagePromise({type:"history/history_during_period",start_time:t,end_time:new Date().toISOString(),entity_ids:[l],minimal_response:!0,no_attributes:!0}))?.[l]||[];if(i.length>1e3){let c=Math.ceil(i.length/500);i=i.filter((d,u)=>u%c===0||u===i.length-1)}let s=[],n=null;for(let c of i){let d=c.s??c.state;if(d==null||d==="unknown"||d==="unavailable")continue;let u;if(d==="on"||d==="open"||d==="true")u=1;else if(d==="off"||d==="closed"||d==="false")u=0;else if(u=parseFloat(d),!Number.isFinite(u))continue;let p=c.lu??c.last_updated??c.last_changed,_=typeof p=="number"?p*1e3:p!=null?Date.parse(p):NaN;Number.isFinite(_)&&(n!=null&&n!==u&&s.push({ts:_,val:n}),s.push({ts:_,val:u}),n=u)}return s.sort((c,d)=>c.ts-d.ts),s.length&&n!=null&&s.push({ts:Date.now(),val:n}),s}catch(e){return console.warn(`[maintenance-supporter] History fallback failed for ${l}:`,e),[]}}async _fetchBatch(l,t,e,i,s,n){try{let c=await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:e,statistic_ids:l,period:t,types:i});for(let d of l){let u=c[d]||[],p=this._normalizeRows(u,s);n.set(be(d,s),p),this._cache.set(ms(d,t,$i,s),{entityId:d,fetchedAt:Date.now(),period:t,points:p})}}catch(c){console.warn("[maintenance-supporter] Batch statistics fetch failed:",c)}}_normalizeRows(l,t){let e=[];for(let i of l){let s=null;if(t?s=i.state??null:s=i.mean??null,s===null)continue;let n={ts:i.start,val:s};t||(i.min!=null&&(n.min=i.min),i.max!=null&&(n.max=i.max)),e.push(n)}return e.sort((i,s)=>i.ts-s.ts),e}};function At(r,l){let t=r??0;return t<1024?`${t} B`:t<1024*1024?`${W(t/1024,l,1)} KB`:`${W(t/(1024*1024),l,1)} MB`}var Si=8,_s=["newest","oldest","title","category"];function gs(r){return _s.includes(r??"")?r:"newest"}function yr(r,l){let t=new Intl.Collator(void 0,{numeric:!0,sensitivity:"base"}),e=c=>gt(c).trim(),i=(c,d)=>t.compare(e(c),e(d)),s=c=>c.kind==="weblink"?ee.length+1:ee.indexOf(xe(c)),n=[...r];switch(l){case"oldest":return n.sort((c,d)=>(c.added_at||"").localeCompare(d.added_at||""));case"title":return n.sort(i);case"category":return n.sort((c,d)=>s(c)-s(d)||i(c,d));default:return n.sort((c,d)=>(d.added_at||"").localeCompare(c.added_at||""))}}function ji(r,l){let t=We(l);if(!t.length)return r;let e=[];for(let i of r){let s=ce(t,[{text:i.title,weight:3},{text:i.filename,weight:2},{text:(i.tags||[]).join(" "),weight:2},{text:i.description,weight:2},{text:i.url,weight:1}]);s>0&&e.push({doc:i,score:s})}return e.sort((i,s)=>s.score-i.score).map(i=>i.doc)}var G=class extends L{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._filter="";this._loaded=!1;this._busy=!1;this._error="";this._hint="";this._addingLink=!1;this._linkUrl="";this._linkTitle="";this._category="manual";this._thumbs={};this._lightboxUrl="";this._editingId="";this._editTitle="";this._editCategory="manual";this._editDescription="";this._linkDescription="";this._sort=gs(J(P.docSort));this._dragOver=!1;this._loadedFor=null;this._loadSeq=0;this._localeReady=!1;this._singlePick=Ea()}_isImage(t){return t.kind==="file"&&(t.mime||"").startsWith("image/")}async _sign(t){return ti(this.hass,t.id)}get _lang(){return N(this.hass)}updated(t){if(super.updated(t),this.hass&&!this._localeReady&&(this._localeReady=!0,ut(this._lang).then(()=>this.requestUpdate())),this.hass&&this.entryId&&this._loadedFor!==this.entryId){let e=this._loadedFor!==null;this._loadedFor=this.entryId,e&&this._resetForObject(),this._load()}}_resetForObject(){this._docs=[],this._loaded=!1,this._thumbs={},this._filter="",this._error="",this._hint="",this._addingLink=!1,this._linkUrl="",this._linkTitle="",this._linkDescription="",this._editingId="",this._lightboxUrl=""}async _load(){let t=this.entryId,e=++this._loadSeq,i=()=>e!==this._loadSeq||t!==this.entryId,s="",n=await I(this,{type:"maintenance_supporter/documents/list",entry_id:t},{onError:c=>{s=c}});if(!i()){if(this._loaded=!0,n===void 0){this._error=s;return}this._docs=n?.documents||[],this._error="",this._thumbs={},this._loadThumbs(i)}}async _write(t,e,i){this._error="",await I(this,t,{busy:s=>{this._busy=s},fallbackKey:i,reload:async()=>{e?.(),await this._load()},onError:s=>{this._error=s}})}async _signed(t){await I(this,t,{onError:e=>{this._error=e}})}async _loadThumbs(t=()=>!1){await Promise.all(this._docs.filter(e=>this._isImage(e)).map(async e=>{try{let i=await this._sign(e);if(t())return;this._thumbs={...this._thumbs,[e.id]:i}}catch{}}))}_category_of(t){return xe(t)}_labelKeydown(t){(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),t.currentTarget.querySelector("input")?.click())}_onFileInput(t){let e=t.target,i=Array.from(e.files??[]);i.length&&this._uploadFiles(i),e.value=""}_onDrop(t){if(t.preventDefault(),this._dragOver=!1,!this.canWrite||this._busy)return;let e=Array.from(t.dataTransfer?.files??[]);e.length&&this._uploadFiles(e)}_onDragOver(t){this.canWrite&&(t.preventDefault(),this._dragOver=!0)}_onDragLeave(t){let e=t.relatedTarget;(!e||!t.currentTarget.contains(e))&&(this._dragOver=!1)}async _uploadFiles(t,e){let i=e??this._category,s=this.entryId;this._busy=!0,this._error="",this._hint="";let n=0,c=0,d=[];try{for(let u of t){let p;try{p=await Ra(this.hass,s,u,[i])}catch(_){let g=_ instanceof Error&&_.message==="doc_too_large"?"doc_too_large":"doc_upload_failed";d.push(`${u.name}: ${a(g,this._lang)}`);continue}p.duplicate_in_object?c++:p.deduped&&n++}if(s!==this.entryId)return;c?this._hint=a("doc_dup_in_object",this._lang):n&&(this._hint=a("doc_deduped",this._lang)),await this._load()}finally{d.length&&s===this.entryId&&(this._error=d.join(" \xB7 ")),this._busy=!1}}async _download(t){await this._signed(()=>ei(this.hass,t.id,t.filename||t.title||"document"))}async _preview(t){if(this._isImage(t)){this._lightboxUrl=this._thumbs[t.id]||await this._sign(t);return}await this._signed(()=>Lt(this.hass,t.id))}_openDoc(t){t.kind==="file"?this._preview(t):ct(t.url)&&window.open(t.url,"_blank","noopener")}_startEdit(t){this._editingId=t.id,this._editTitle=t.title||"",this._editCategory=this._category_of(t),this._editDescription=t.description||"",this._addingLink=!1,this._error=""}_cancelEdit(){this._editingId=""}_setSort(t){this._sort=gs(t),q(P.docSort,this._sort)}async _saveEdit(t){let e=(t.tags||[]).filter(s=>!ee.includes(s)),i=t.kind==="file"?[this._editCategory,...e]:t.tags??[];await this._write({type:"maintenance_supporter/documents/update",doc_id:t.id,title:this._editTitle.trim()||t.filename||t.url||"",tags:i,description:this._editDescription.trim()},()=>{this._editingId=""})}async _delete(t){let e=gt(t);await ui(this.hass,{title:a("delete",this._lang),message:a("doc_delete_confirm",this._lang).replace("{name}",e),confirmText:a("delete",this._lang),danger:!0})&&await this._write({type:"maintenance_supporter/documents/delete",doc_id:t.id})}async _addLink(){let t=this._linkUrl.trim();if(!t)return;let e=this.entryId;await this._write({type:"maintenance_supporter/documents/add_link",entry_id:e,url:t,title:this._linkTitle.trim()||null,description:this._linkDescription.trim()||null},()=>{this._linkUrl="",this._linkTitle="",this._linkDescription="",this._addingLink=!1},"doc_link_not_allowed")}render(){let t=this._lang;return o`
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
                  ${ee.map(e=>o`<option value=${e}>${a(`doc_cat_${e}`,t)}</option>`)}
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
              ${_s.map(e=>o`<option value=${e} ?selected=${e===this._sort}>${a(`doc_sort_${e}`,t)}</option>`)}
            </select>
          </div>`:h}
      ${this._loaded&&this._docs.length>=Si?o`<div class="doc-filter">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input type="search" aria-label=${a("doc_search",t)} placeholder=${a("doc_search",t)}
              .value=${this._filter} @input=${e=>this._filter=e.target.value} />
          </div>`:h}
      ${this._loaded?this._docs.length===0?o`<div class="doc-empty">${a("documents_empty",t)}</div>`:(()=>{let e=this._filter.trim()?ji(this._docs,this._filter):yr(this._docs,this._sort);return e.length===0?o`<div class="doc-empty">${a("doc_search_none",t)}</div>`:o`<div class="doc-list">${e.map(i=>this._renderDoc(i,t))}</div>`})():o`<div class="doc-empty">${a("loading",t)}</div>`}

      ${this._lightboxUrl?o`<div class="lightbox top-layer" popover="manual" ${_e} @click=${()=>this._lightboxUrl=""}>
            <img class="lightbox-img" src=${this._lightboxUrl} @click=${e=>e.stopPropagation()} />
            <button class="lightbox-close" title=${a("doc_close",t)} @click=${()=>this._lightboxUrl=""}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>`:h}
      </div>
    `}_renderDoc(t,e){if(this._editingId===t.id)return this._renderEdit(t,e);let i=t.kind==="file",s=this._category_of(t),n=i?`${a(`doc_cat_${s}`,e)} \xB7 ${At(t.size,e)}`:a("doc_link_badge",e),c=this._thumbs[t.id];return o`
      <div class="doc-row">
        ${i&&c?o`<img
              class="doc-thumb"
              src=${c}
              alt=${t.title||""}
              title=${a("doc_open",e)}
              @click=${()=>this._preview(t)}
            />`:o`<ha-icon
              class="doc-icon ${i?"clickable":""}"
              icon=${i?ki[s]:"mdi:link-variant"}
              @click=${()=>i&&this._preview(t)}
            ></ha-icon>`}
        <div
          class="doc-info"
          role="button"
          tabindex="0"
          title=${a("doc_open",e)}
          @click=${()=>this._openDoc(t)}
          @keydown=${d=>{(d.key==="Enter"||d.key===" ")&&(d.preventDefault(),this._openDoc(t))}}
        >
          <div class="doc-title">${gt(t)}</div>
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
                href=${ct(t.url)?t.url:"#"}
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
              ${ee.map(s=>o`<option value=${s} ?selected=${s===this._editCategory}>${a(`doc_cat_${s}`,e)}</option>`)}
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
    `}};G.styles=[Ca,pi,H`
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
  `],m([j({attribute:!1})],G.prototype,"hass",2),m([j({attribute:!1})],G.prototype,"entryId",2),m([j({type:Boolean})],G.prototype,"canWrite",2),m([f()],G.prototype,"_docs",2),m([f()],G.prototype,"_filter",2),m([f()],G.prototype,"_loaded",2),m([f()],G.prototype,"_busy",2),m([f()],G.prototype,"_error",2),m([f()],G.prototype,"_hint",2),m([f()],G.prototype,"_addingLink",2),m([f()],G.prototype,"_linkUrl",2),m([f()],G.prototype,"_linkTitle",2),m([f()],G.prototype,"_category",2),m([f()],G.prototype,"_thumbs",2),m([f()],G.prototype,"_lightboxUrl",2),m([f()],G.prototype,"_editingId",2),m([f()],G.prototype,"_editTitle",2),m([f()],G.prototype,"_editCategory",2),m([f()],G.prototype,"_editDescription",2),m([f()],G.prototype,"_linkDescription",2),m([f()],G.prototype,"_sort",2),m([f()],G.prototype,"_dragOver",2);customElements.get("maintenance-documents-section")||customElements.define("maintenance-documents-section",G);function Ei(r,l,t){return a(`part_waiting_${r}`,t).replace("{count}",W(l,t))}var ft=class extends L{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._attachId="";this._filter="";this._loadedKey="";this._localeReady=!1}get _lang(){return N(this.hass)}get _refId(){return this.partId||this.taskId||""}get _linkField(){return this.partId?"part_ids":"task_ids"}updated(t){super.updated(t),this.hass&&!this._localeReady&&(this._localeReady=!0,ut(this._lang).then(()=>this.requestUpdate()));let e=`${this.entryId}|${this._refId}`;this.hass&&this.entryId&&this._refId&&this._loadedKey!==e&&(this._loadedKey=e,this._load())}async _load(){let t=await I(this,{type:"maintenance_supporter/documents/list",entry_id:this.entryId},{onError:e=>{this._error=e}});this._loaded=!0,t!==void 0&&(this._docs=t?.documents||[],this._error="")}async _update(t){this._error="",await I(this,{type:"maintenance_supporter/documents/update",...t},{busy:e=>{this._busy=e},reload:()=>this._load(),onError:e=>{this._error=e}})}async _signed(t){await I(this,t,{onError:e=>{this._error=e}})}_links(t){return t[this._linkField]||[]}_linked(){return this._docs.filter(t=>this._links(t).includes(this._refId))}_available(){return this._docs.filter(t=>!this._links(t).includes(this._refId))}async _setLinks(t,e){await this._update({doc_id:t.id,[this._linkField]:e})}_link(){let t=this._docs.find(e=>e.id===this._attachId);t&&(this._attachId="",this._setLinks(t,[...this._links(t),this._refId]))}_unlink(t){this._setLinks(t,this._links(t).filter(e=>e!==this._refId))}_isPdf(t){return t.mime==="application/pdf"||(t.filename||"").toLowerCase().endsWith(".pdf")}_pageFor(t){return this._isPdf(t)&&this.taskId?t.task_pages?.[this.taskId]:void 0}async _open(t){if(t.kind==="weblink"){ct(t.url)&&window.open(t.url,"_blank","noopener");return}let e=this._pageFor(t);await this._signed(()=>Lt(this.hass,t.id,e?`#page=${e}`:""))}async _setPage(t,e){this.taskId&&await this._update({doc_id:t.id,task_pages:{[this.taskId]:e}})}async _download(t){await this._signed(()=>ei(this.hass,t.id,t.filename||t.title||"document"))}render(){if(!this._loaded||this._docs.length===0)return h;let t=this._lang,e=this._linked(),i=this._available();return o`
      <div class="task-docs">
        <h3><ha-icon icon="mdi:paperclip"></ha-icon> ${a("documents",t)} (${e.length})</h3>
        ${this._error?o`<div class="tdoc-error">${this._error}</div>`:h}
        ${e.length>=Si?o`<div class="doc-filter">
              <ha-icon icon="mdi:magnify"></ha-icon>
              <input type="search" aria-label=${a("doc_search",t)} placeholder=${a("doc_search",t)}
                .value=${this._filter} @input=${s=>this._filter=s.target.value} />
            </div>`:h}
        ${e.length===0?o`<div class="tdoc-empty">${a(this.partId?"doc_part_none":"doc_task_none",t)}</div>`:(()=>{let s=ji(e,this._filter);return s.length===0?o`<div class="tdoc-empty">${a("doc_search_none",t)}</div>`:o`<div class="tdoc-list">${s.map(n=>this._renderRow(n,t))}</div>`})()}
        ${this.canWrite&&i.length?o`<div class="tdoc-attach">
              <select
                class="tdoc-select"
                ?disabled=${this._busy}
                @change=${s=>this._attachId=s.target.value}
              >
                <option value="" ?selected=${!this._attachId}>${a("doc_link_existing",t)}</option>
                ${i.map(s=>o`<option value=${s.id} ?selected=${s.id===this._attachId}>${gt(s)}</option>`)}
              </select>
              <button class="tdoc-btn" ?disabled=${this._busy||!this._attachId} @click=${this._link}>
                <ha-icon icon="mdi:link-variant-plus"></ha-icon> ${a("doc_attach",t)}
              </button>
            </div>`:h}
      </div>
    `}_renderRow(t,e){let i=t.kind==="file",s=this._isPdf(t),n=this._pageFor(t),c=xe(t),d=i?At(t.size,e):a("doc_link_badge",e);return o`
      <div class="tdoc-row">
        <ha-icon class="tdoc-icon" icon=${i?ki[c]:"mdi:link-variant"}></ha-icon>
        <div
          class="tdoc-info"
          role="button"
          tabindex="0"
          title=${n?`${a("doc_open",e)} \xB7 ${a("doc_page",e)} ${n}`:a("doc_open",e)}
          @click=${()=>this._open(t)}
          @keydown=${u=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),this._open(t))}}
        >
          <div class="tdoc-title">${gt(t)}</div>
          ${t.description?o`<div class="tdoc-desc">${t.description}</div>`:h}
          <div class="tdoc-meta">
            ${d}${n?o` · <span class="tdoc-pagetag">${a("doc_page",e)} ${n}</span>`:h}
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
              @change=${u=>{let p=parseInt(u.target.value,10);this._setPage(t,Number.isFinite(p)&&p>=1?p:0)}}
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
    `}};ft.styles=H`
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
  `,m([j({attribute:!1})],ft.prototype,"hass",2),m([j({attribute:!1})],ft.prototype,"entryId",2),m([j({attribute:!1})],ft.prototype,"taskId",2),m([j({attribute:!1})],ft.prototype,"partId",2),m([j({type:Boolean})],ft.prototype,"canWrite",2),m([f()],ft.prototype,"_docs",2),m([f()],ft.prototype,"_loaded",2),m([f()],ft.prototype,"_busy",2),m([f()],ft.prototype,"_error",2),m([f()],ft.prototype,"_attachId",2),m([f()],ft.prototype,"_filter",2);customElements.get("maintenance-task-documents")||customElements.define("maintenance-task-documents",ft);function En(r){let l=r.package_size;return typeof l=="number"&&Number.isFinite(l)&&l>0?l:1}var yt=class extends L{constructor(){super();this.notBooked=!1;this.nowrap=!1;this._open=!1;this._qty="";this._invalid=!1;this._busy=!1;this._error="";this.addEventListener("click",t=>t.stopPropagation())}get _lang(){return N(this.hass)}updated(){this.toggleAttribute("open",this._open)}_start(){this._qty=String(En(this.sparePart)),this._invalid=!1,this._error="",this._open=!0,this.updateComplete.then(()=>this.shadowRoot?.querySelector("input")?.select())}async _use(){if(this._busy)return;let t=parseFloat(this._qty);if(!Number.isFinite(t)||t<=0){this._invalid=!0;return}this._invalid=!1;let e=await I(this,{type:"maintenance_supporter/part/use",entry_id:this.entryId,part_id:this.sparePart.id,quantity:t},{busy:i=>{this._busy=i},onError:i=>{this._error=i}});e!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("part-used",{detail:{partId:this.sparePart.id,stock:e?.stock??0,restoring:e?.restoring??0},bubbles:!0,composed:!0})))}render(){let t=this._lang;return this._open?o`
      <span class="use-field">
        <input
          class=${this._invalid?"invalid":""}
          type="number"
          min="0"
          step="any"
          .value=${this._qty}
          aria-label=${a("part_use_how_many",t)}
          title=${a("part_use_how_many",t)}
          @input=${e=>this._qty=e.target.value}
          @keydown=${e=>{e.key==="Enter"&&this._use(),e.key==="Escape"&&(this._open=!1)}}
        />
        ${this.sparePart.unit?o`<span class="unit">${this.sparePart.unit}</span>`:h}
        <button class="use-pill confirm" title=${a("part_use_hint",t)} .disabled=${this._busy} @click=${()=>this._use()}>
          <ha-icon icon="mdi:check"></ha-icon>${a("part_use",t)}
        </button>
        <ha-icon-button class="use-cancel" title=${a("cancel",t)} @click=${()=>this._open=!1}
          ><ha-icon icon="mdi:close"></ha-icon
        ></ha-icon-button>
      </span>
      ${this.notBooked?o`<div class="note">${a("part_use_not_booked",t)}</div>`:h}
      ${this._error?bt("error",this._error):h}
    `:o`<button class="use-pill" title=${a("part_use_hint",t)} @click=${()=>this._start()}>
        <ha-icon icon="mdi:package-variant-minus"></ha-icon>${a("part_use",t)}
      </button>`}};yt.styles=H`
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
  `,m([j({attribute:!1})],yt.prototype,"hass",2),m([j({attribute:!1})],yt.prototype,"entryId",2),m([j({attribute:!1})],yt.prototype,"sparePart",2),m([j({type:Boolean})],yt.prototype,"notBooked",2),m([j({type:Boolean,reflect:!0})],yt.prototype,"nowrap",2),m([f()],yt.prototype,"_open",2),m([f()],yt.prototype,"_qty",2),m([f()],yt.prototype,"_invalid",2),m([f()],yt.prototype,"_busy",2),m([f()],yt.prototype,"_error",2);customElements.get("ms-part-use")||customElements.define("ms-part-use",yt);function Rn(r){return va(r)}var oe=r=>r.trim()===""?NaN:parseFloat(r),rt=class extends L{constructor(){super();this.currencySymbol="\u20AC";this.onUse=!1;this._open=!1;this._qty="";this._price="";this._total="";this._date="";this._notes="";this._invalid="";this._busy=!1;this._error="";this.addEventListener("click",t=>t.stopPropagation())}get _lang(){return N(this.hass)}updated(){this.toggleAttribute("open",this._open)}_start(){let t=this.sparePart;this._qty=String(Rn(t)),this._price=typeof t.cost=="number"?String(t.cost):"",this._total="",this._followPrice(),this._date=mt(),this._notes="",this._invalid="",this._error="",this._open=!0,this.updateComplete.then(()=>this.shadowRoot?.querySelector("input.qty")?.select())}_followPrice(){let t=oe(this._qty),e=oe(this._price);Number.isFinite(t)&&Number.isFinite(e)?this._total=String(li(t*e)):this._price.trim()===""&&(this._total="")}_followTotal(){let t=oe(this._qty),e=oe(this._total);Number.isFinite(t)&&t>0&&Number.isFinite(e)?this._price=String(li(e/t)):this._total.trim()===""&&(this._price="")}async _record(){if(this._busy)return;let t=oe(this._qty),e=oe(this._total);if(!Number.isFinite(t)||t<=0){this._invalid="qty";return}if(this._total.trim()!==""&&(!Number.isFinite(e)||e<0)){this._invalid="total";return}this._invalid="";let i={type:"maintenance_supporter/part/purchase",entry_id:this.entryId,part_id:this.sparePart.id,quantity:t};this._total.trim()!==""&&(i.cost=li(e)),this._date&&this._date!==mt()&&(i.date=this._date),this._notes.trim()&&(i.notes=this._notes.trim());let s=await I(this,i,{busy:n=>{this._busy=n},onError:n=>{this._error=n}});s!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("part-bought",{detail:{partId:this.sparePart.id,stock:s?.stock??0},bubbles:!0,composed:!0})))}_keys(t){t.target?.tagName==="INPUT"&&(t.key==="Enter"&&this._record(),t.key==="Escape"&&(this._open=!1))}render(){let t=this._lang;if(!this._open)return o`<button class="buy-pill" title=${a("part_bought_hint",t)} @click=${()=>this._start()}>
        <ha-icon icon="mdi:cart-plus"></ha-icon>${a("part_bought",t)}
      </button>`;let e=this.sparePart,i=typeof e.package_size=="number"&&e.package_size>0?e.package_size:null,s=oe(this._qty),n=this.currencySymbol;return o`
      <div class="buy-form" @keydown=${c=>this._keys(c)}>
        <label class="f">
          <span>${i?a("part_bought_packages",t).replace("{size}",Jt(i,e.unit,t)):a("part_bought_quantity",t)}</span>
          <input class="qty ${this._invalid==="qty"?"invalid":""}" type="number" min="0" step="any" inputmode="decimal"
            .value=${this._qty}
            @input=${c=>{this._qty=c.target.value,this._followPrice()}} />
        </label>
        <label class="f">
          <span>${i?a("part_bought_price_package",t):a("part_bought_price_each",t)} (${n})</span>
          <input class="price" type="number" min="0" step="0.01" inputmode="decimal"
            .value=${this._price}
            @input=${c=>{this._price=c.target.value,this._followPrice()}} />
        </label>
        <label class="f">
          <span>${a("part_bought_total",t)} (${n})</span>
          <input class="total ${this._invalid==="total"?"invalid":""}" type="number" min="0" step="0.01" inputmode="decimal"
            .value=${this._total}
            @input=${c=>{this._total=c.target.value,this._followTotal()}} />
        </label>
        <div class="f date">
          <span>${a("part_bought_date",t)}</span>
          <ms-date-field kind="date" .hass=${this.hass} .lang=${t} .value=${this._date}
            @value-changed=${c=>this._date=c.detail.value||mt()}></ms-date-field>
        </div>
        <label class="f notes">
          <span>${a("notes_label",t)}</span>
          <input class="notes-input" type="text" maxlength="2000" placeholder=${a("part_bought_note",t)}
            .value=${this._notes}
            @input=${c=>this._notes=c.target.value} />
        </label>
        <div class="adds">
          ${Number.isFinite(s)&&s>0?a("part_bought_adds",t).replace("{qty}",Jt(ci(e,s),e.unit,t)):h}
        </div>
        ${this.onUse?o`<div class="note">${a("part_bought_on_use",t)}</div>`:h}
        ${this._error?bt("error",this._error):h}
        <div class="actions">
          <button class="buy-pill confirm" .disabled=${this._busy} @click=${()=>this._record()}>
            <ha-icon icon="mdi:check"></ha-icon>${a("part_bought_confirm",t)}
          </button>
          <button class="buy-pill" @click=${()=>this._open=!1}>${a("cancel",t)}</button>
        </div>
      </div>
    `}};rt.styles=H`
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
  `,m([j({attribute:!1})],rt.prototype,"hass",2),m([j({attribute:!1})],rt.prototype,"entryId",2),m([j({attribute:!1})],rt.prototype,"sparePart",2),m([j({attribute:!1})],rt.prototype,"currencySymbol",2),m([j({type:Boolean})],rt.prototype,"onUse",2),m([f()],rt.prototype,"_open",2),m([f()],rt.prototype,"_qty",2),m([f()],rt.prototype,"_price",2),m([f()],rt.prototype,"_total",2),m([f()],rt.prototype,"_date",2),m([f()],rt.prototype,"_notes",2),m([f()],rt.prototype,"_invalid",2),m([f()],rt.prototype,"_busy",2),m([f()],rt.prototype,"_error",2);customElements.get("ms-part-purchase")||customElements.define("ms-part-purchase",rt);var Cn=["charge","sharpen","clean","dry","refill","restore"],On=500,Mn={name:"",vendor:"",mpn:"",gtin:"",storage_location:"",product_url:"",unit:"",cost:"",stock:"",reuse:"",restoring:"",cost_mode:"",reorder_threshold:"",restock_quantity:"",package_size:"",auto_buy_task:!0,notes:""},it=class extends L{constructor(){super(...arguments);this.parts=[];this.canWrite=!1;this.currencySymbol="\u20AC";this.partsCostMode="purchase";this.fleet=!1;this._editing=null;this._opened=null;this._busy=!1;this._error="";this._restockFor=null;this._restockQty="";this._restockInvalid=!1;this._disposeFor=null;this._disposeQty="1";this._disposeInvalid=!1;this._docsFor=null}get _lang(){return N(this.hass)}connectedCallback(){super.connectedCallback(),ut(this._lang).then(()=>this.requestUpdate())}_notifyChanged(){this.dispatchEvent(new CustomEvent("parts-changed",{bubbles:!0,composed:!0}))}_send(t){return this._error="",I(this,t,{busy:e=>{this._busy=e},onError:e=>{this._error=e}})}_openAdd(){this._editing={...Mn},this._opened=null}_openEdit(t){this._editing={id:t.id,name:t.name,vendor:t.vendor||"",mpn:t.mpn||"",gtin:t.gtin||"",storage_location:t.storage_location||"",product_url:t.product_url||"",unit:t.unit||"",cost:t.cost!=null?String(t.cost):"",stock:t.stock!=null?String(t.stock):"",reuse:t.reuse||"",restoring:t.restoring?String(t.restoring):"",cost_mode:t.cost_mode||"",reorder_threshold:t.reorder_threshold!=null?String(t.reorder_threshold):"",restock_quantity:t.restock_quantity!=null?String(t.restock_quantity):"",package_size:t.package_size!=null?String(t.package_size):"",auto_buy_task:!!t.auto_buy_task,notes:t.notes||""},this._opened={...this._editing}}_formValue(t){let e=i=>i.trim()===""?null:Number(i);return{entry_id:this.entryId,name:t.name.trim(),vendor:t.vendor.trim()||null,mpn:t.mpn.trim()||null,gtin:t.gtin.trim()||null,storage_location:t.storage_location.trim()||null,product_url:t.product_url.trim()||null,unit:t.unit.trim()||null,cost:e(t.cost),stock:e(t.stock),reuse:t.reuse||null,...t.reuse?{restoring:e(t.restoring)??0}:{},...this.fleet?{}:{cost_mode:t.cost_mode||null},reorder_threshold:e(t.reorder_threshold),restock_quantity:e(t.restock_quantity),package_size:e(t.package_size),auto_buy_task:t.auto_buy_task,notes:t.notes.trim()||null}}async _save(){let t=this._editing;if(this._busy||!t||!t.name.trim())return;let e=this._formValue(t),i=this._opened;t.id&&i&&(t.stock===i.stock&&delete e.stock,t.restoring===i.restoring&&t.reuse===i.reuse&&delete e.restoring);let s=t.id?"maintenance_supporter/part/update":"maintenance_supporter/part/create";await this._send(t.id?{type:s,part_id:t.id,...e}:{type:s,...e})!==void 0&&(this._editing=null,this._notifyChanged())}async _delete(t){if(!await ui(this.hass,{title:a("delete",this._lang),message:a("part_delete_confirm",this._lang).replace("{name}",t.name),confirmText:a("delete",this._lang),danger:!0}))return;await this._send({type:"maintenance_supporter/part/delete",entry_id:this.entryId,part_id:t.id})!==void 0&&this._notifyChanged()}async _restock(t){if(this._busy)return;let e=parseFloat(this._restockQty);if(!Number.isFinite(e)||e===0){this._restockInvalid=!0;return}this._restockInvalid=!1;let i=await this._send({type:"maintenance_supporter/part/restock",entry_id:this.entryId,part_id:t.id,delta:e});this._restockFor=null,i!==void 0&&(t.stock=i?.stock,this.requestUpdate(),this._notifyChanged())}async _readyAgain(t){if(this._busy)return;let e=await this._send({type:"maintenance_supporter/part/ready_again",entry_id:this.entryId,part_id:t.id});e&&(t.stock=e.stock,t.restoring=e.restoring,this.requestUpdate(),this._notifyChanged())}async _dispose(t){if(this._busy)return;let e=parseFloat(this._disposeQty);if(!Number.isFinite(e)||e<=0){this._disposeInvalid=!0;return}this._disposeInvalid=!1;let i=await this._send({type:"maintenance_supporter/part/dispose",entry_id:this.entryId,part_id:t.id,quantity:e});this._disposeFor=null,i&&(t.stock=i.stock,t.restoring=i.restoring,this.requestUpdate(),this._notifyChanged())}_onUsed(t,e){t.stock=e.stock,t.restoring=e.restoring,this.requestUpdate(),this._notifyChanged()}_renderUse(t){return!this.canWrite||!(typeof t.stock=="number"&&t.stock>0)?h:o`<ms-part-use
      .hass=${this.hass}
      .entryId=${this.entryId}
      .sparePart=${t}
      ?notBooked=${me(t,this.partsCostMode,this.fleet)==="use"}
      @part-used=${e=>this._onUsed(t,e.detail)}
    ></ms-part-use>`}_onBought(t,e){t.stock=e.stock,this.requestUpdate(),this._notifyChanged()}_renderBought(t){return!this.canWrite||typeof t.stock!="number"?h:o`<ms-part-purchase
      .hass=${this.hass}
      .entryId=${this.entryId}
      .sparePart=${t}
      .currencySymbol=${this.currencySymbol}
      ?onUse=${me(t,this.partsCostMode,this.fleet)==="use"}
      @part-bought=${e=>this._onBought(t,e.detail)}
    ></ms-part-purchase>`}_renderDispose(t,e){return this._disposeFor!==t.id?o`<button class="ready-again dispose" title=${a("part_dispose_hint",e)} .disabled=${this._busy}
        @click=${()=>{this._disposeFor=t.id,this._disposeQty="1",this._disposeInvalid=!1}}>
        <ha-icon icon="mdi:trash-can-outline"></ha-icon>${a("part_dispose",e)}
      </button>`:o`<input
        class="restock-input dispose-input${this._disposeInvalid?" invalid":""}"
        type="number"
        min="1"
        max=${String(t.restoring??0)}
        .value=${this._disposeQty}
        aria-label=${a("part_dispose_how_many",e)}
        title=${a("part_dispose_how_many",e)}
        @input=${i=>this._disposeQty=i.target.value}
        @keydown=${i=>{i.key==="Enter"&&this._dispose(t),i.key==="Escape"&&(this._disposeFor=null)}}
      />
      <button class="ready-again dispose confirm" title=${a("part_dispose_hint",e)} .disabled=${this._busy} @click=${()=>this._dispose(t)}>
        <ha-icon icon="mdi:check"></ha-icon>${a("part_dispose",e)}
      </button>
      <ha-icon-button title=${a("cancel",e)} @click=${()=>this._disposeFor=null}
        ><ha-icon icon="mdi:close"></ha-icon
      ></ha-icon-button>`}_identLine(t){return[t.vendor,t.mpn?`MPN: ${t.mpn}`:"",t.gtin?`GTIN: ${t.gtin}`:""].filter(Boolean).join(" \xB7 ")}_renderRow(t){let e=this._lang,i=t.stock!==null&&t.stock!==void 0,s=this._identLine(t),n=this._docsFor===t.id;return o`
      <div class="part-row ${t.is_low?"low":""}">
        <ha-icon class="part-icon" icon=${t.is_low?"mdi:cart-arrow-down":"mdi:package-variant-closed"}></ha-icon>
        <div class="part-main">
          <div class="part-name">
            ${Os(t.shopping_url)?o`<a href=${t.shopping_url} target="_blank" rel="noopener noreferrer">${t.name}</a>`:t.name}
            ${i?o`<span class="stock-badge ${t.is_low?"low":""}"
                  >${Jt(t.stock,t.unit,e)}${t.reorder_threshold!=null?o`<span class="threshold">/${W(t.reorder_threshold,e)}</span>`:h}</span
                >`:h}
            ${this._renderUse(t)}
            ${this._renderBought(t)}
          </div>
          ${i&&t.reuse&&(t.restoring??0)>0?o`<div class="part-waiting">
                <span class="waiting-badge">${Ei(t.reuse,t.restoring,e)}</span>
                ${this.canWrite?o`<button class="ready-again" title=${a("part_ready_again_hint",e)} .disabled=${this._busy}
                        @click=${()=>this._readyAgain(t)}>
                        <ha-icon icon="mdi:check"></ha-icon>${a(`part_reuse_${t.reuse}`,e)}
                      </button>
                      ${this._renderDispose(t,e)}`:h}
              </div>`:h}
          <div class="part-meta">
            ${s?o`<span>${s}</span>`:h}
            ${t.storage_location?o`<span class="loc"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${t.storage_location}</span>`:h}
          </div>
          ${t.notes?o`<div class="part-notes">${t.notes}</div>`:h}
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
                      @input=${c=>this._restockQty=c.target.value}
                      @keydown=${c=>{c.key==="Enter"&&this._restock(t),c.key==="Escape"&&(this._restockFor=null)}}
                    />
                    <ha-icon-button title=${a("save",e)} .disabled=${this._busy} @click=${()=>this._restock(t)}
                      ><ha-icon icon="mdi:check"></ha-icon
                    ></ha-icon-button>
                  `:o`
                    <ha-icon-button
                      title=${a("part_restock",e)}
                      .disabled=${this._busy}
                      @click=${()=>{this._restockFor=t.id,this._restockInvalid=!1,this._restockQty=String(ci(t))}}
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
    `}_renderCostMode(t){let e=this._editing,i=s=>a(s==="use"?"settings_parts_cost_use":"settings_parts_cost_purchase",t);return o`
      <label class="form-field">
        <span>${a("part_cost_mode",t)}</span>
        <select
          class="cost-mode-select"
          .value=${e.cost_mode}
          @change=${s=>{this._editing={...this._editing,cost_mode:s.target.value}}}
        >
          <option value="" ?selected=${!e.cost_mode}>${a("part_cost_mode_house",t).replace("{mode}",i(this.partsCostMode))}</option>
          <option value="purchase" ?selected=${e.cost_mode==="purchase"}>${i("purchase")}</option>
          <option value="use" ?selected=${e.cost_mode==="use"}>${i("use")}</option>
        </select>
      </label>
      <div class="form-hint">${a("part_cost_mode_hint",t)}</div>
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
          ${this.fleet?h:this._renderCostMode(t)}
          ${this._field(a("part_stock",t),"stock",{type:"number"})}
          <label class="form-field">
            <span>${a("part_reuse",t)}</span>
            <select
              class="reuse-select"
              .value=${e.reuse}
              @change=${i=>{this._editing={...this._editing,reuse:i.target.value}}}
            >
              <option value="" ?selected=${!e.reuse}>${a("part_reuse_none",t)}</option>
              ${Cn.map(i=>o`<option value=${i} ?selected=${e.reuse===i}>${a(`part_reuse_${i}`,t)}</option>`)}
            </select>
          </label>
          ${e.reuse?this._field(a("part_restoring",t),"restoring",{type:"number"}):h}
          ${e.reuse?o`<div class="form-hint">${a("part_reuse_hint",t)}</div>`:h}
          ${this._field(a("part_reorder_threshold",t),"reorder_threshold",{type:"number"})}
          ${this._field(a("part_package_size",t),"package_size",{type:"number"})}
          ${this._field(e.package_size.trim()?a("part_restock_packages",t):a("part_restock_quantity",t),"restock_quantity",{type:"number"})}
          ${e.package_size.trim()?o`<div class="form-hint">${a("part_package_hint",t)}</div>`:h}
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
              maxlength=${On}
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
    `}_inventoryValue(){let t=0,e=!1;for(let i of this.parts){let s=ba(i),n=typeof i.stock=="number"?i.stock:null;s!==null&&n!==null&&(t+=s*n,e=!0)}return e?t:null}render(){let t=this._lang;return!this.parts.length&&!this.canWrite?h:o`
      <div class="section-head">
        <h3>
          <ha-icon icon="mdi:package-variant"></ha-icon>
          ${a("parts_section",t)} (${this.parts.length})
          ${this._inventoryValue()!==null?o`<span class="inventory-value" title=${a("parts_inventory_value",t)}
                >${a("parts_inventory_value",t)}:
                ${Y(this._inventoryValue(),this.currencySymbol,t)}</span>`:h}
        </h3>
        ${this.canWrite&&!this._editing?o`<ha-button appearance="plain" @click=${()=>this._openAdd()}>
              <ha-icon icon="mdi:plus"></ha-icon> ${a("part_add",t)}
            </ha-button>`:h}
      </div>
      ${this._error?bt("error",this._error):h}
      ${this._editing?this._renderForm():h}
      ${this.parts.map(e=>this._renderRow(e))}
    `}};it.styles=H`
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
  `,m([j({attribute:!1})],it.prototype,"hass",2),m([j({attribute:!1})],it.prototype,"entryId",2),m([j({attribute:!1})],it.prototype,"parts",2),m([j({type:Boolean})],it.prototype,"canWrite",2),m([j({attribute:!1})],it.prototype,"currencySymbol",2),m([j({attribute:!1})],it.prototype,"partsCostMode",2),m([j({type:Boolean})],it.prototype,"fleet",2),m([f()],it.prototype,"_editing",2),m([f()],it.prototype,"_busy",2),m([f()],it.prototype,"_error",2),m([f()],it.prototype,"_restockFor",2),m([f()],it.prototype,"_restockQty",2),m([f()],it.prototype,"_restockInvalid",2),m([f()],it.prototype,"_disposeFor",2),m([f()],it.prototype,"_disposeQty",2),m([f()],it.prototype,"_disposeInvalid",2),m([f()],it.prototype,"_docsFor",2);customElements.get("maintenance-parts-section")||customElements.define("maintenance-parts-section",it);var Ri={readings:!0,parts:!0,photos:!0,documents:!0,checklist:!0,notes:!0,costs:!0,person:!0,refs:!0,qr:!1,bare:!0,docDescriptions:!0};function An(r){return!!(r.notes&&r.notes.trim()||r.cost!=null||r.duration!=null||r.readings.length||r.parts.length||r.photoIds.length||r.checklist)}var Dn=6;function xr(r,l,t,e,i,s,n,c={}){let d=c.options??{layout:"chronological",include:Ri},u=d.include,p=c.data??{objectRef:null,tasks:[],photos:{},fmtNumber:C=>String(C)},_=l.filter(C=>C.type==="completed"&&(u.bare!==!1||An(C))),{totalCost:g}=di(_),b=C=>u.refs&&p.objectRef&&C.taskRefNo!=null&&C.refNo!=null?`${p.objectRef}.${C.taskRefNo}-${C.refNo}`:null,x=C=>u.refs&&p.objectRef&&C.taskRefNo!=null?`${p.objectRef}.${C.taskRefNo}`:null,T=[[t.refNumber,u.refs&&p.objectRef?`#${p.objectRef}`:null],[t.manufacturer,r.manufacturer],[t.model,r.model],[t.serial,r.serial_number],[t.installed,r.installation_date?e(r.installation_date):null]].filter(([,C])=>C).map(([C,B])=>`<div class="meta-row"><span>${$(C)}</span><strong>${$(B)}</strong></div>`).join(""),y=C=>{let B=[];if(u.readings&&C.readings.length){let V=C.readings.map(z=>{let X=`${p.fmtNumber(z.value)}${z.unit?` ${$(z.unit)}`:""}`,Z=z.delta!=null?` <span class="delta">(${z.delta>=0?"+":"\u2212"}${p.fmtNumber(Math.abs(z.delta))})</span>`:"";return`${z.name?`${$(z.name)}: `:""}${X}${Z}`});B.push(`<div class="fact"><span class="k">${$(t.readings)}</span>${V.join(" \xB7 ")}</div>`)}if(u.parts&&C.parts.length&&B.push(`<div class="fact"><span class="k">${$(t.parts)}</span>${C.parts.map(V=>`${$(V.name)} \xD7 ${p.fmtNumber(V.quantity)}`).join(", ")}</div>`),u.checklist&&C.checklist&&B.push(`<div class="fact"><span class="k">${$(t.checklist)}</span>${C.checklist.done}/${C.checklist.total}</div>`),u.photos&&C.photoIds.length){let V=C.photoIds.slice(0,Dn),z=V.map(Z=>{let et=p.photos[Z],O=et?.name||Z.slice(0,8);return et?.url?`<figure class="photo"><img src="${$(et.url)}" alt="" /><figcaption>${$(O)}</figcaption></figure>`:`<figure class="photo"><figcaption>${$(O)}</figcaption></figure>`}),X=C.photoIds.length>V.length?`<span class="more">+${C.photoIds.length-V.length}</span>`:"";B.push(`<div class="fact"><span class="k">${$(t.photos)}</span><div class="photos">${z.join("")}${X}</div></div>`)}return B.length?`<div class="details">${B.join("")}</div>`:""},k=C=>[u.notes?C.notes:null,u.person&&C.completedBy?`${t.completedBy}: ${C.completedBy}`:null].filter(Boolean).join(" \xB7 "),w=C=>u.costs?`<td class="num">${C.cost!=null?$(s(C.cost)):$(t.none)}</td>
        <td class="num">${C.duration!=null?$(i(C.duration)):$(t.none)}</td>`:"",E=C=>C?`<span class="ref">#${$(C)}</span>`:"",v=u.costs?5:3,D=C=>`<thead><tr>
    <th>${$(t.colDate)}</th>
    ${C?`<th>${$(t.colTask)}</th>`:"<th></th>"}
    ${u.costs?`<th class="num">${$(t.colCost)}</th><th class="num">${$(t.colDuration)}</th>`:""}
    <th>${$(t.colNotes)}</th>
  </tr></thead>`,R=(C,B)=>{let V=k(C),z=y(C),X=B?$(C.phaseName?`${C.taskName} \xB7 ${C.phaseName}`:C.taskName):$(C.phaseName||"");return`<tr class="entry">
        <td class="nowrap">${$(e(C.timestamp))}${E(b(C))}</td>
        <td>${B?`${X} ${E(x(C))}`:X}</td>
        ${w(C)}
        <td class="notes">${$(V)||(z?"":$(t.none))}</td>
      </tr>${z?`<tr class="entry-details"><td colspan="${v}" class="details-cell">${z}</td></tr>`:""}`},Q;if(d.layout==="by_task"){let C=new Map(p.tasks.map(z=>[z.id,z])),B=[...p.tasks.map(z=>z.id)];for(let z of _)B.includes(z.taskId)||B.push(z.taskId);Q=`${B.map(z=>{let X=_.filter(lt=>lt.taskId===z);if(!X.length)return"";let Z=C.get(z),et=Z?.name||X[0].taskName,O=u.refs?Z?.ref??x(X[0]):null,tt=u.documents&&Z?.documents.length?`<div class="fact"><span class="k">${$(t.documents)}</span>${Z.documents.map(lt=>`${$(lt.title)}${lt.page?` (${$(t.page(lt.page))})`:""}${u.docDescriptions!==!1&&lt.description?` \u2014 <span class="doc-desc">${$(lt.description)}</span>`:""}`).join(", ")}</div>`:"",ht=u.qr&&Z?.qrDataUri?`<figure class="qr"><img src="${$(Z.qrDataUri)}" alt="" /><figcaption>${$(t.scanHint)}</figcaption></figure>`:"",se=X.reduce((lt,A)=>lt+(A.cost??0),0);return`<section class="task">
  <div class="task-head">
    <div class="task-title">
      <h2>${$(et)} ${E(O)}</h2>
      ${Z?.schedule?`<div class="schedule">${$(Z.schedule)}</div>`:""}
      ${tt}
      <div class="task-count">${$(t.entriesLabel(X.length))}${u.costs&&se!==0?` \xB7 ${$(s(se))}`:""}</div>
    </div>
    ${ht}
  </div>
  <table>
    ${D(!1)}
    <tbody>
${X.map(lt=>R(lt,!1)).join(`
`)}
    </tbody>
  </table>
</section>`}).join(`
`)}
<table class="total">
  <tfoot><tr>
    <td>${$(t.totalLabel)}</td>
    <td class="num">${u.costs?$(s(g)):""}</td>
  </tr></tfoot>
</table>`}else Q=`<table>
  ${D(!0)}
  <tbody>
${_.map(C=>R(C,!0)).join(`
`)}
  </tbody>
  <tfoot><tr>
    <td colspan="2">${$(t.totalLabel)}</td>
    ${u.costs?`<td class="num">${$(s(g))}</td><td colspan="2"></td>`:"<td></td>"}
  </tr></tfoot>
</table>`;return`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${$(t.title)} \u2014 ${$(r.name)}</title>
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
<h1>${$(t.title)} \u2014 ${$(r.name)}</h1>
<p class="sub">${$(t.generated)} ${$(e(n))} \xB7 ${$(t.entriesLabel(_.length))}</p>
${T?`<div class="meta">${T}</div>`:""}
${Q}
${c.capped?`<p class="cap-note">${$(t.capNote)}</p>`:""}
</body>
</html>`}var Pn=60,nt=class extends L{constructor(){super(...arguments);this.entryId="";this.object=null;this.tasks=[];this.currencySymbol="\u20AC";this.userName=()=>null;this._filterTask="";this._from="";this._to="";this._expanded=!1;this._printOpen=!1;this._printLayout="chronological";this._printInclude={...Ri};this._printing=!1;this._loadedFor=null;this._histories=new Aa(this);this._localeReady=!1}connectedCallback(){super.connectedCallback();try{let t=JSON.parse(J(P.printOptions)||"null");(t?.layout==="by_task"||t?.layout==="chronological")&&(this._printLayout=t.layout),t?.include&&typeof t.include=="object"&&(this._printInclude={...Ri,...t.include})}catch{}}_savePrintOptions(){q(P.printOptions,JSON.stringify({layout:this._printLayout,include:this._printInclude}))}_toggleInclude(t,e){this._printInclude={...this._printInclude,[t]:e},this._savePrintOptions()}get _lang(){return N(this.hass)}willUpdate(t){super.willUpdate(t),this.entryId&&this._loadedFor!==this.entryId&&(this._loadedFor=this.entryId,this._filterTask="",this._from="",this._to=""),this.entryId&&(t.has("entryId")||t.has("tasks")||t.has("hass")&&t.get("hass")===void 0)&&this._histories.sync(this.hass,this.tasks.map(e=>({entryId:this.entryId,task:e})))}updated(t){super.updated(t),!this._localeReady&&this.hass&&(this._localeReady=!0,ut(this._lang).then(()=>this.requestUpdate()))}get _entries(){return ka(this.tasks.map(t=>({id:t.id,name:t.name,history:this._histories.historyOf(this.entryId,t),ref_no:t.ref_no,reading_unit:t.reading_unit})))}get _capped(){return this.tasks.some(t=>this._histories.historyOf(this.entryId,t).length>=wa)}_openTask(t){this.dispatchEvent(new CustomEvent("open-task",{detail:{taskId:t},bubbles:!0,composed:!0}))}async _bookletData(t){let e=this._printInclude,i=this._lang,s=[];if(e.documents||e.photos)try{s=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId})).documents||[]}catch{s=[]}let n=new Map;e.qr&&this._printLayout==="by_task"&&await Promise.all(this.tasks.map(async u=>{try{let p=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/qr/generate",entry_id:this.entryId,task_id:u.id,url_mode:"server",action:"view"});p.svg_data_uri&&n.set(u.id,p.svg_data_uri)}catch{}}));let c=this.tasks.map(u=>({id:u.id,name:u.name,ref:Pt(this.object,u),schedule:Ht(u,i)||null,documents:s.filter(p=>(p.task_ids||[]).includes(u.id)&&!gr(p)).map(p=>({title:gt(p),page:p.task_pages?.[u.id]??null,description:p.description||null})),qrDataUri:n.get(u.id)??null})),d={};if(e.photos){let u=[...new Set(t.filter(_=>_.type==="completed").flatMap(_=>_.photoIds))].slice(0,Pn),p=new Map(s.map(_=>[_.id,_]));await Promise.all(u.map(async _=>{let g=p.get(_),b=g&&gt(g)||_.slice(0,8);try{d[_]={name:b,url:new URL(await ti(this.hass,_),window.location.origin).href}}catch{d[_]={name:b,url:null}}}))}return{tasks:c,photos:d}}_filteredEntries(){return $a(this._entries,{taskId:this._filterTask||null,from:this._from||null,to:this._to||null})}async _print(){let t=this._lang,e=this.object;if(!e||this._printing)return;let i=ii();this._printing=!0;let s,n;try{await this._histories.settled(),s=this._filteredEntries(),n=await this._bookletData(s)}catch(p){throw i?.close(),p}finally{this._printing=!1}this._printOpen=!1;let c={title:a("service_record_title",t),generated:a("report_generated",t),manufacturer:a("manufacturer",t),model:a("model",t),serial:a("serial_number_label",t),installed:a("installed",t),colDate:a("date",t),colTask:a("task_name",t),colCost:a("cost",t),colDuration:a("duration",t),colNotes:a("notes_label",t),completedBy:a("completed_by",t),totalLabel:a("report_total_cost",t),entriesLabel:p=>`${p} ${a("service_record_entries",t)}`,capNote:a("object_history_cap_note",t),none:"\u2014",readings:a("print_inc_readings",t),parts:a("print_inc_parts",t),photos:a("print_inc_photos",t),documents:a("print_inc_documents",t),checklist:a("print_inc_checklist",t),refNumber:a("ref_number",t),scanHint:a("report_scan_hint",t),page:p=>a("search_page",t).replace("{page}",String(p))},d=s.map(p=>({...p,completedBy:p.completedBy?p.completedVia?a("completed_via",t).replace("{person}",this.userName(p.completedBy)??"").replace("{device}",this.userName(p.completedVia)??""):this.userName(p.completedBy):null,notes:p.notes?ve(p.notes,t):null})),u=xr(e,d,c,p=>p?U(p,t):"",p=>Ae(p,t),p=>Y(p,this.currencySymbol,t),new Date().toISOString(),{capped:this._capped,options:{layout:this._printLayout,include:this._printInclude},data:{objectRef:Ct(e),tasks:n.tasks,photos:n.photos,fmtNumber:p=>W(p,t)}});Pe(u,i)}_renderPrintOptions(){let t=this._lang,e=this._printInclude,i=(n,c,d=!1)=>o`
      <label class="opt ${d?"disabled":""}">
        <input type="checkbox" .checked=${e[n]} ?disabled=${d}
          @change=${u=>this._toggleInclude(n,u.target.checked)} />
        <span>${a(c,t)}</span>
      </label>`,s=this._printLayout==="by_task";return o`
      <div class="print-options" role="dialog" aria-label=${a("print_options_title",t)}>
        <div class="po-title">${a("print_options_title",t)}</div>
        <div class="po-group">
          <span class="po-label">${a("print_layout",t)}</span>
          <label class="opt"><input type="radio" name="layout" value="chronological" .checked=${!s}
            @change=${()=>{this._printLayout="chronological",this._savePrintOptions()}} /><span>${a("print_layout_chronological",t)}</span></label>
          <label class="opt"><input type="radio" name="layout" value="by_task" .checked=${s}
            @change=${()=>{this._printLayout="by_task",this._savePrintOptions()}} /><span>${a("print_layout_by_task",t)}</span></label>
        </div>
        <div class="po-group">
          <span class="po-label">${a("print_include",t)}</span>
          ${i("readings","print_inc_readings")}
          ${i("parts","print_inc_parts")}
          ${i("photos","print_inc_photos")}
          ${i("checklist","print_inc_checklist")}
          ${i("notes","print_inc_notes")}
          ${i("costs","print_inc_costs")}
          ${i("person","print_inc_person")}
          ${i("refs","print_inc_refs")}
          ${i("bare","print_inc_bare")}
          ${i("documents","print_inc_documents",!s)}
          ${i("docDescriptions","print_inc_doc_desc",!s)}
          ${i("qr","print_inc_qr",!s)}
        </div>
        <div class="po-actions">
          <ha-button appearance="plain" @click=${()=>{this._printOpen=!1}}>${a("cancel",t)}</ha-button>
          <ha-button appearance="filled" class="po-print" .disabled=${this._printing} @click=${()=>this._print()}>
            ${this._printing?a("loading",t):a("print_button",t)}
          </ha-button>
        </div>
      </div>`}render(){let t=this._lang;if(!this._entries.length&&!this._histories.loading)return h;let i=this._filteredEntries(),{completed:s,totalCost:n}=di(i),c=this._expanded?i:i.slice(0,15);return o`
      <div class="section">
        <h3>
          ${a("object_history_section",t)}
          <span class="count">${i.length}</span>
          ${this._histories.loading?o`<span class="loading-hint">${a("loading",t)}</span>`:h}
          <ha-button appearance="plain" class="print-btn" @click=${()=>{this._printOpen=!this._printOpen}}>
            <ha-icon icon="mdi:printer-outline"></ha-icon>
            ${a("service_record_print",t)}
          </ha-button>
        </h3>
        ${this._printOpen?this._renderPrintOptions():h}

        <div class="filters">
          <select .value=${this._filterTask} @change=${d=>{this._filterTask=d.target.value}}>
            <option value="">${a("object_history_all_tasks",t)}</option>
            ${this.tasks.map(d=>o`<option value=${d.id} ?selected=${d.id===this._filterTask}>${d.name}</option>`)}
          </select>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${t}
            .label=${a("date_from",t)}
            .value=${this._from}
            @value-changed=${d=>{this._from=d.detail.value}}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${t}
            .label=${a("date_to",t)}
            .value=${this._to}
            @value-changed=${d=>{this._to=d.detail.value}}
          ></ms-date-field>
        </div>

        ${i.length===0?o`<p class="empty">${a("object_history_empty",t)}</p>`:o`
              <div class="rows">
                ${c.map(d=>o`
                  <div class="row">
                    <span class="date" title=${wt(d.timestamp,t)}>${U(d.timestamp,t)}</span>
                    <span class="type type-${d.type}" style="--type-color: ${Ws(d.type)}">${a(d.type,t)}</span>
                    <button class="task-link" @click=${()=>this._openTask(d.taskId)}>${d.taskName}${d.phaseName?` \xB7 ${d.phaseName}`:""}</button>
                    <span class="facts">
                      ${d.cost!=null?o`<span>${Js(d.cost,this.currencySymbol,t)}</span>`:h}
                      ${d.partsCost!=null?o`<span class="parts-cost" title=${a(d.partsCounted?"history_parts_counted_hint":"history_parts_info_hint",t)}>${a(d.partsCounted?"history_parts_counted":"history_parts_info",t).replace("{amount}",Y(d.partsCost,this.currencySymbol,t))}</span>`:h}
                      ${d.purchaseCost!=null?o`<span class="parts-cost">${a("history_purchase_stock",t).replace("{amount}",Y(d.purchaseCost,this.currencySymbol,t))}</span>`:h}
                      ${d.duration!=null?o`<span>${Ae(d.duration,t)}</span>`:h}
                    </span>
                    ${d.notes?o`<span class="notes" title=${ve(d.notes,t)}>${ve(d.notes,t)}</span>`:h}
                  </div>
                `)}
              </div>
              ${i.length>c.length?o`<ha-button appearance="plain" class="more" @click=${()=>{this._expanded=!0}}>
                    ${a("show_all",t)} (${i.length})
                  </ha-button>`:h}
              <div class="totals">
                ${s} ${a("service_record_entries",t)} · ${a("report_total_cost",t)}:
                <strong>${Y(n,this.currencySymbol,t)}</strong>
              </div>
              ${this._capped?o`<p class="cap-note">${a("object_history_cap_note",t)}</p>`:h}
            `}
      </div>
    `}};nt.styles=H`
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
  `,m([j({attribute:!1})],nt.prototype,"hass",2),m([j()],nt.prototype,"entryId",2),m([j({attribute:!1})],nt.prototype,"object",2),m([j({attribute:!1})],nt.prototype,"tasks",2),m([j()],nt.prototype,"currencySymbol",2),m([j({attribute:!1})],nt.prototype,"userName",2),m([f()],nt.prototype,"_filterTask",2),m([f()],nt.prototype,"_from",2),m([f()],nt.prototype,"_to",2),m([f()],nt.prototype,"_expanded",2),m([f()],nt.prototype,"_printOpen",2),m([f()],nt.prototype,"_printLayout",2),m([f()],nt.prototype,"_printInclude",2),m([f()],nt.prototype,"_printing",2);customElements.get("maintenance-object-history-section")||customElements.define("maintenance-object-history-section",nt);var ot=class ot extends L{constructor(){super(...arguments);this.flat=!1;this._ov=null;this._loading=!1;this._marking=!1;this._choosing=null;this._error="";this._disposeFor=null;this._disposeQty="1";this._history=null;this._rosterSort=ot._storedSort();this._typeFilter=null;this._recorded=[];this._access=Da;this._historyRequested=!1;this._localeReady=!1;this._markAll=async()=>{await this._mark(void 0)};this._repair=async()=>{await this._act({type:"maintenance_supporter/battery_fleet/setup",language:this._lang})};this._loadHistory=async t=>{if(q(P.batteryRosterOpen,t?"1":"0"),!(!t||this._historyRequested)){this._historyRequested=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview_history"});this._history=e.series}catch{this._history=null}}}}get _lang(){return N(this.hass)}get _canWrite(){return ye(this.hass?.user,this._access)}connectedCallback(){super.connectedCallback(),this.hass&&this._load()}updated(t){pe(this,t),t.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,ut(this._lang).then(()=>this.requestUpdate()),_i(this.hass).then(e=>{this._access=e.access}),this._ov===null&&!this._loading&&this._load())}async _load(){this._error="";let t=await I(this,{type:"maintenance_supporter/battery_fleet/overview"},{busy:e=>{this._loading=e},onError:e=>{this._error=e}});t!==void 0&&(this._ov=t)}async _act(t,e){return this._marking?!1:(this._error="",await I(this,t,{busy:s=>{this._marking=s},reload:async()=>{e?.(),await this._load()},onError:s=>{this._error=s}})!==void 0)}async _dispose(t,e){let i=parseFloat(this._disposeQty);!Number.isFinite(i)||i<=0||await this._act({type:"maintenance_supporter/part/dispose",entry_id:t,part_id:e,quantity:i})&&(this._disposeFor=null)}_renderDispose(t,e,i){return this._disposeFor!==e.part_id?o`<button class="bf-charged bf-dispose" title=${a("part_dispose_hint",i)} .disabled=${this._marking}
        @click=${()=>{this._disposeFor=e.part_id,this._disposeQty="1"}}><ha-icon icon="mdi:trash-can-outline"></ha-icon>${a("part_dispose",i)}</button>`:o`<input
        class="bf-dispose-qty"
        type="number"
        min="1"
        max=${String(e.restoring)}
        .value=${this._disposeQty}
        aria-label=${a("part_dispose_how_many",i)}
        title=${a("part_dispose_how_many",i)}
        @input=${s=>this._disposeQty=s.target.value}
        @keydown=${s=>{s.key==="Enter"&&this._dispose(t,e.part_id),s.key==="Escape"&&(this._disposeFor=null)}}
      /><button class="bf-charged bf-dispose confirm" title=${a("part_dispose_hint",i)} .disabled=${this._marking}
        @click=${()=>this._dispose(t,e.part_id)}><ha-icon icon="mdi:check"></ha-icon>${a("part_dispose",i)}</button
      ><button class="bf-charged bf-dispose" title=${a("cancel",i)} @click=${()=>this._disposeFor=null}
        ><ha-icon icon="mdi:close"></ha-icon
      ></button>`}_markOne(t,e){if(t.cell_choices&&t.cell_choices.length>1){this._choosing={entityId:t.entity_id,list:e,selected:t.cells_installed||t.cell_choices[0].type};return}this._mark([t.entity_id])}async _confirmCells(){let t=this._choosing;t&&(this._choosing=null,await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",entity_ids:[t.entityId],cells:{[t.entityId]:t.selected}}))}_renderCellChooser(t,e,i){let s=this._choosing;return!s||s.entityId!==t.entity_id||s.list!==e||!t.cell_choices?h:o`
      <div class="bf-cells" role="group" aria-label=${a("battery_fleet_cells_question",i)}>
        <div class="bf-cells-q">${a("battery_fleet_cells_question",i)}</div>
        ${t.cell_choices.map(n=>o`
          <label class="bf-cell-choice">
            <input type="radio" name=${`cells-${t.entity_id}`} .checked=${s.selected===n.type}
              @change=${()=>{this._choosing={...s,selected:n.type}}} />
            <span>${n.name}</span>
            ${n.rechargeable?o`<span class="bf-cell-tag">${a("battery_fleet_cells_rechargeable",i)}</span>`:h}
          </label>`)}
        <div class="bf-cells-actions">
          <button class="bf-cells-cancel" @click=${()=>{this._choosing=null}}>${a("cancel",i)}</button>
          <button class="bf-cells-ok" .disabled=${this._marking} @click=${()=>this._confirmCells()}>
            ${a("battery_fleet_mark_one",i)}
          </button>
        </div>
      </div>
    `}async _mark(t){await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",...t?{entity_ids:t}:{}})}async _setExcluded(t,e){await this._act({type:"maintenance_supporter/battery_fleet/set_excluded",entity_id:t,excluded:e})}async _addBattery(t){let e=t.detail?.value;e&&await this._act({type:"maintenance_supporter/battery_fleet/set_included",entity_id:e,included:!0})}async _setTrackSelf(t){await this._setFleetOption("set_track_self_charging",t.target)}async _setDueWithoutSensor(t){await this._setFleetOption("set_due_without_sensor",t.target)}async _setAskCells(t){await this._setFleetOption("set_ask_cells",t.target)}async _setFleetOption(t,e){let i=e.checked;await this._act({type:`maintenance_supporter/battery_fleet/${t}`,enabled:i})||(e.checked=!i)}_rosterOpen(){return J(P.batteryRosterOpen)!=="0"}_predictedTitle(t,e){if(t.forecast_overdue)return a("battery_fleet_forecast_overdue",e);let i=this._predictedDate(this._forecastDays(t)??0);if(t.predicted_source==="trend")return a("battery_fleet_predicted_trend",e).replace("{date}",i).replace("{confidence}",a("cal_confidence_"+(t.prediction_confidence||"medium"),e));if(t.lifetime_months!=null&&t.lifetime_source){let s=a("lifetime_source_"+t.lifetime_source,e).replace("{n}",String(t.lifetime_samples??0));return a("battery_fleet_predicted_typical",e).replace("{date}",i).replace("{months}",String(t.lifetime_months)).replace("{type}",t.battery_type).replace("{source}",s)}return a("battery_fleet_predicted_on",e).replace("{date}",i)}_sparkline(t){let e=this._history?.[t.entity_id];if(!e||e.points.length<2)return h;let i=110,s=24,n=2,c=e.points[0][0],d=e.points[e.points.length-1][0],u=Date.now()/1e3,p=t.status!=="low"&&t.predicted_source==="trend"&&t.days_until!=null?u+t.days_until*86400:null,_=Math.max(d,p??d),g=k=>_===c?n:n+(k-c)/(_-c)*(i-2*n),b=k=>n+(1-Math.min(100,Math.max(0,k))/100)*(s-2*n),x=e.points.map(([k,w])=>`${M(g(k))},${M(b(w))}`).join(" "),T=e.points[e.points.length-1][1],y=M(b(e.threshold));return o`<svg
      class="bf-spark"
      viewBox="0 0 ${i} ${s}"
      role="img"
      aria-label=${a("battery_fleet_sparkline_hint",this._lang)}
    >
      <title>${a("battery_fleet_sparkline_hint",this._lang)}</title>
      <line class="bf-spark-th" x1="0" y1=${y} x2=${i} y2=${y}></line>
      <polyline class="bf-spark-line" points=${x}></polyline>
      ${p!==null?o`<line
            class="bf-spark-proj"
            x1=${M(g(d))}
            y1=${M(b(T))}
            x2=${M(g(p))}
            y2=${y}
          ></line>`:h}
    </svg>`}static _storedSort(){return J(P.batteryRosterSort)==="name"?"name":"urgency"}_setSort(t){this._rosterSort=t,q(P.batteryRosterSort,t)}_sortedRoster(t){let e=this._typeFilter===null?t:t.filter(s=>s.battery_type===this._typeFilter);if(this._rosterSort==="name")return e;let i=s=>s.status==="low"?-1e3+(s.level??101)/101:s.days_until??1/0;return[...e].sort((s,n)=>i(s)-i(n)||s.device_name.localeCompare(n.device_name))}_predictedDate(t){return U(zt(mt(),t),this._lang)}_forecastDays(t){return t.forecast_days!==void 0?t.forecast_days:t.days_until}_fmtDate(t){return Number.isFinite(t)?U(new Date(t).toISOString(),this._lang):"\u2014"}_shoppingLine(t){return Object.entries(t).map(([e,i])=>o`<button
        class="bf-type-chip ${this._typeFilter===e?"bf-type-chip-active":""}"
        title=${a("battery_fleet_filter_type",this._lang)}
        @click=${()=>this._toggleTypeFilter(e)}
      >
        ${i}× ${e}
      </button>`)}_toggleTypeFilter(t){if(this._typeFilter=this._typeFilter===t?null:t,this._typeFilter!==null){let e=this.shadowRoot?.querySelector(".bf-roster");e instanceof HTMLDetailsElement?e.open||(e.open=!0):e&&!e.expanded&&(e.expanded=!0,this._loadHistory(!0))}}async _recordJump(t,e){await this._act({type:"maintenance_supporter/battery_fleet/record_replacement",entity_id:t,replaced_at:new Date(e.at*1e3).toISOString()},()=>{this._recorded=[...this._recorded,t]})}_levelTone(t,e){let i=e.low_threshold??20;return t<=i?"bad":t<=i+20?"warn":"good"}_levelBar(t){let e=t.level;return e==null?h:o`<span class="bf-bar" aria-hidden="true"
      ><span class="bf-bar-fill bf-bar-${this._levelTone(e,t)}" style="width: ${Math.min(100,Math.max(0,e))}%"></span
    ></span>`}_jumpButton(t,e){let i=this._history?.[t.entity_id]?.jump;return!i||this._recorded.includes(t.entity_id)?h:o`<button
      class="bf-mark bf-jump"
      title=${a("battery_fleet_record_replacement",e).replace("{date}",this._fmtDate(i.at*1e3))}
      .disabled=${this._marking}
      @click=${()=>this._recordJump(t.entity_id,i)}
    >
      <ha-icon icon="mdi:calendar-sync"></ha-icon>
    </button>`}_renderRow(t,e,i){let s=t.available===!1?o`<span class="bf-offline">${a("battery_fleet_offline",e)}</span>`:t.no_sensor?o`<span class="bf-offline bf-nosensor">${a("battery_fleet_no_sensor",e)}</span>`:h,n=`${t.quantity}\xD7 ${t.battery_type}`,c=o`<span class="bf-type" title=${n}>${n}</span>`,d=this._canWrite,u=d&&(i.mark==="always"||t.no_sensor||t.can_mark_replaced),p=this._forecastDays(t);return o`
      <div class="bf-row">
        <span class="bf-dev">${t.device_name}</span>
        ${i.status?o`<span class="bf-status bf-${t.status}"
                >${t.no_sensor&&t.status==="low"?a("battery_fleet_status_due",e):a("battery_fleet_status_"+t.status,e)}</span
              >${c}${s}`:o`${s}${c}`}
        ${i.recharge&&t.rechargeable?o`<span class="bf-recharge" title=${a("battery_fleet_rechargeable",e)}
              ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
            ></span>`:h}
        ${i.sparkline?this._sparkline(t):h}
        ${this._levelBar(t)}
        ${t.level!=null?o`<span class="bf-level bf-level-${this._levelTone(t.level,t)}">${t.level}%</span>`:h}
        ${u?o`<button
              class="bf-mark${i.mark==="replaced"?" bf-replaced":""}"
              title=${t.rechargeable?a("battery_fleet_mark_recharged",e):a("battery_fleet_mark_one",e)}
              .disabled=${this._marking}
              @click=${()=>this._markOne(t,i.list)}
            >
              <ha-icon icon="mdi:battery-sync"></ha-icon>
            </button>`:h}
        ${i.jump&&d?this._jumpButton(t,e):h}
        ${i.predicted&&p!=null?o`<span
              class="bf-predicted ${t.predicted_source==="trend"?"bf-trend":""} ${t.forecast_overdue?"bf-overdue":""} ${t.forecast_overdue&&t.status==="ok"?"bf-quiet":""}"
              title=${this._predictedTitle(t,e)}
              >${t.forecast_overdue?o`<ha-icon icon="mdi:calendar-alert"></ha-icon>`:h}~${this._predictedDate(p)}</span
            >`:h}
        ${i.exclude&&d?o`<button
              class="bf-mark bf-exclude"
              title=${a("battery_fleet_exclude",e)}
              .disabled=${this._marking}
              @click=${()=>this._setExcluded(t.entity_id,!0)}
            >
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>
            </button>`:h}
      </div>
      ${this._renderCellChooser(t,i.list,e)}
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
                ${this._canWrite?o`<ha-button .disabled=${this._marking} @click=${this._repair}>
                      ${a("battery_fleet_repair",t)}
                    </ha-button>`:h}
              </div>
            `:h}

        ${i===0?o`<div class="bf-empty">${a("battery_fleet_none_low",t)}</div>`:o`
              <div class="bf-shopping">
                <span class="bf-label">${a("battery_fleet_buy_now",t)}</span>
                <span class="bf-list">${this._shoppingLine(e.needs_now)}</span>
              </div>
              <div class="bf-rows">
                ${e.low.map(s=>this._renderRow(s,t,{list:"low",recharge:!0,mark:"always",exclude:!0}))}
              </div>
              ${this._canWrite?o`<div class="bf-actions">
                    <ha-button .disabled=${this._marking} @click=${this._markAll}>
                      <ha-icon icon="mdi:battery-sync"></ha-icon> ${a("battery_fleet_mark_all",t)}
                    </ha-button>
                  </div>`:h}
            `}

        ${e.charging?.length?o`
              <div class="bf-charging">
                <span class="bf-label">${a("battery_fleet_charging",t)}</span>
                ${e.charging.map(s=>o`<span class="bf-charge-item">
                    <span class="bf-charge-name">${s.name}</span>
                    <span>${a("battery_fleet_ready",t).replace("{count}",W(s.stock,t))}</span>
                    ${s.restoring>0?o`<span class="bf-charge-waiting">${Ei(s.reuse,s.restoring,t)}</span>
                          ${this._canWrite?o`<button
                                class="bf-charged"
                                title=${a("part_ready_again_hint",t)}
                                .disabled=${this._marking}
                                @click=${()=>this._act({type:"maintenance_supporter/part/ready_again",entry_id:e.entry_id,part_id:s.part_id})}
                              ><ha-icon icon="mdi:battery-charging-100"></ha-icon>${a(`part_reuse_${s.reuse}`,t)}</button>
                              ${this._renderDispose(e.entry_id,s,t)}`:h}`:h}
                  </span>`)}
              </div>
            `:h}
        ${e.soon.length?o`
              <div class="bf-soon">
                <span class="bf-label">${a("battery_fleet_soon",t)}</span>
                <span class="bf-list">${this._shoppingLine(e.needs_soon)}</span>
                <div class="bf-soon-hint">${a("battery_fleet_soon_hint",t)}</div>
              </div>
              <div class="bf-rows bf-soon-rows">
                ${e.soon.map(s=>this._renderRow(s,t,{list:"soon",mark:"replaced",predicted:!0}))}
              </div>
            `:h}
        ${e.all?.length?o`
              ${hi({cls:"bf-roster",open:this._rosterOpen(),onToggle:this._loadHistory,header:o`${a("battery_fleet_all",t)} (${e.all.length})`},o`
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
                  ${this._sortedRoster(e.all).map(s=>this._renderRow(s,t,{list:"roster",status:!0,recharge:!0,sparkline:!0,mark:"replaced",jump:!0,predicted:!0,exclude:!0}))}
                </div>
                <div class="bf-roster-hint">${a("battery_fleet_all_hint",t)}</div>
                ${this._canWrite?this._renderRosterSettings(e,t):h}
              `)}
            `:h}
        ${this._renderExcluded(e,t)}
        <div class="bf-total">${a("battery_fleet_total",t).replace("{n}",String(e.total))}</div>
      </div>
    `}_renderRosterSettings(t,e){return o`
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
                ${te({cls:"bf-track-self",checked:!!t.track_self_charging,disabled:this._marking,onChange:this._setTrackSelf},o`${a("battery_fleet_track_self",e)}`)}
                <div class="bf-roster-hint">${a("battery_fleet_track_self_hint",e)}</div>
                ${te({cls:"bf-track-self bf-due-nosensor",checked:t.due_without_sensor!==!1,disabled:this._marking,onChange:this._setDueWithoutSensor},o`${a("battery_fleet_due_without_sensor",e)}`)}
                <div class="bf-roster-hint">${a("battery_fleet_due_without_sensor_hint",e)}</div>
                ${te({cls:"bf-track-self bf-ask-cells",checked:!!t.ask_cells,disabled:this._marking,onChange:this._setAskCells},o`${a("battery_fleet_ask_cells",e)}`)}
                <div class="bf-roster-hint">${a("battery_fleet_ask_cells_hint",e)}</div>
    `}_renderExcluded(t,e){return o`
        ${t.excluded?.length?o`
              <div class="bf-excluded">
                <span class="bf-label">${a("battery_fleet_excluded",e)}</span>
                ${t.excluded.map(i=>o`
                    <span class="bf-excluded-chip">
                      ${i.device_name}
                      ${this._canWrite?o`<button
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
    `}};ot.styles=H`
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
  `,m([j({attribute:!1})],ot.prototype,"hass",2),m([j({type:Boolean})],ot.prototype,"flat",2),m([f()],ot.prototype,"_ov",2),m([f()],ot.prototype,"_loading",2),m([f()],ot.prototype,"_marking",2),m([f()],ot.prototype,"_choosing",2),m([f()],ot.prototype,"_error",2),m([f()],ot.prototype,"_disposeFor",2),m([f()],ot.prototype,"_disposeQty",2),m([f()],ot.prototype,"_history",2),m([f()],ot.prototype,"_rosterSort",2),m([f()],ot.prototype,"_typeFilter",2),m([f()],ot.prototype,"_recorded",2),m([f()],ot.prototype,"_access",2);var fs=ot;customElements.get("maintenance-battery-fleet-section")||customElements.define("maintenance-battery-fleet-section",fs);var wr=5;function In(r,l){let t=[];for(let e=0;e<l;e++)t.push(zt(r,e));return t}function zn(r){if(!r||r.length===0)return null;let l=r.map(t=>Bt(t)).filter(t=>t!==null&&t>=0);return l.length===0?null:l.reduce((t,e)=>t+e,0)/l.length}function Hn(r){let{windowStart:l,windowEnd:t,task:e,entryId:i,objectName:s}=r,n=[],c=(_,g)=>({date:_,entry_id:i,task_id:e.id,task_name:e.name,object_name:s,status:g&&Ce(e.status)?"ok":e.status,days_until_due:g?null:e.days_until_due??null,projected:g,schedule_type:e.schedule_type,interval_days:e.interval_days??null,interval_unit:e.interval_unit??null,responsible_user_id:e.responsible_user_id??null,avg_cost:zn(e.history),adaptive_enabled:!!e.adaptive_config?.enabled,prediction_confidence:e.threshold_prediction_confidence??null}),d=Math.max(1,Math.round(hs(e.interval_days,e.interval_unit)));if(Ce(e.status)){if(n.push(c(l,!1)),e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0){let _=zt(l,d),g=1;for(;_<=t&&g<wr;)n.push(c(_,!0)),g++,_=zt(_,d)}return n}let u=e.next_due;if(typeof u!="string"||!u)return n;let p=u.slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(p))return n;if(p>=l&&p<=t)n.push(c(p,!1));else if(p>t)return n;if(e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0){let _=zt(p,d),g=n.length;for(;_<=t&&g<wr;)_>=l&&(n.push(c(_,!0)),g++),_=zt(_,d)}return n}function kr(r,l,t,e=null){let i=In(l,t),s=i[0],n=i[i.length-1],c=[];for(let u of r){let p=u.object?.name||"",_=u.entry_id,g=u.tasks||[];for(let b of g){if(e&&!Ne(b,e)||b.enabled===!1)continue;let x=Hn({windowStart:s,windowEnd:n,task:b,entryId:_,objectName:p});c.push(...x)}}let d=new Map;for(let u of i)d.set(u,[]);for(let u of c){let p=d.get(u.date);p&&p.push(u)}for(let[,u]of d)u.sort((p,_)=>{let g=Xt(p.status),b=Xt(_.status);if(g!==b)return g-b;if(p.projected!==_.projected)return p.projected?1:-1;let x=p.object_name.localeCompare(_.object_name);return x!==0?x:p.task_name.localeCompare(_.task_name)});return i.map(u=>({date:u,events:d.get(u)??[]}))}var Ln={completed:"ok",reset:"ok",skipped:"due_soon",missed:"overdue",triggered:"triggered",trigger_replaced:"triggered",trigger_removed:"ok"};function Ci(r,l){return`${r}/${l}`}function $r(r,l,t){let e=Tr(l,t)[0],i=[];for(let s of r)for(let n of s.tasks||[]){let c=n.history||[],d=n.history_count??c.length;if(d<=c.length)continue;let u=c.map(g=>Gi(g?.timestamp)).filter(g=>!!g),p=u.length?u.reduce((g,b)=>g<b?g:b):"";if(p&&p<e)continue;let _=Ci(s.entry_id,n.id);i.push({entryId:s.entry_id,taskId:n.id,key:_,sig:`${_}:${d}:${Bn(JSON.stringify(c))}`})}return i}function Bn(r){let l=2166136261;for(let t=0;t<r.length;t++)l^=r.charCodeAt(t),l=Math.imul(l,16777619);return(l>>>0).toString(36)}function Tr(r,l){let t=[];for(let e=l-1;e>=0;e--)t.push(zt(r,-e));return t}function Sr(r,l,t,e=null,i={}){let s=Tr(l,t),n=s[0],c=s[s.length-1],d=new Map;for(let p of s)d.set(p,[]);for(let p of r){let _=p.object?.name||"",g=p.entry_id,b=p.tasks||[];for(let x of b){if(e&&!Ne(x,e))continue;let T=i[Ci(g,x.id)]??(x.history||[]);for(let y of T){if(typeof y?.timestamp!="string")continue;let k=Gi(y.timestamp);if(!k||k<n||k>c)continue;let w=d.get(k);if(!w)continue;let E=y.type??"completed";w.push({date:k,entry_id:g,task_id:x.id,task_name:x.name,object_name:_,status:Ln[E]??"ok",days_until_due:null,projected:!1,schedule_type:x.schedule_type,interval_days:x.interval_days??null,responsible_user_id:x.responsible_user_id??null,avg_cost:Bt(y),adaptive_enabled:!!x.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:y.timestamp,history_type:E,history_cost:Bt(y),history_notes:typeof y.notes=="string"?y.notes:null,history_duration:typeof y.duration=="number"?y.duration:null})}}}let u={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4};for(let[,p]of d)p.sort((_,g)=>{let b=u[_.history_type??""]??99,x=u[g.history_type??""]??99;if(b!==x)return b-x;let T=_.object_name.localeCompare(g.object_name);return T!==0?T:_.task_name.localeCompare(g.task_name)});return s.map(p=>({date:p,events:d.get(p)??[]}))}var jr=H`
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
`;function Er(r){let l=window;l.customCards=l.customCards||[],l.customCards.some(t=>t.type===r.type)||l.customCards.push(r)}function Rr(r,l,t=e=>import(e)){let e=window,i;try{let p=new URL(l);i=p.origin+p.pathname}catch{return}let s=`__msCardHeal:${r[0]}:${i}`;if(e[s])return;e[s]=!0;let n=0,c=0,d=!1,u=()=>{if(n+=1,r.some(_=>!customElements.get(_))&&c<3&&!d){c+=1,d=!0;try{let _=new URL(l);_.searchParams.set("heal",`${Date.now()}`),t(_.href).catch(()=>{}).finally(()=>{d=!1})}catch{return}}n<20&&window.setTimeout(u,n<8?500:2e3)};window.setTimeout(u,250)}var xt=class extends L{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._objectFilter="";this._configuredObjects=[];this._unsub=null;this._pastHistory={};this._pastHistorySig="";this._pastSeq=0;this._dataLoaded=!1;this._lastConnection=null;this._onHistorySaved=t=>{let e=t.detail;!e?.entry_id||!e.task_id||!(Ci(e.entry_id,e.task_id)in this._pastHistory)||(this._pastHistorySig="",this._loadPastHistories())};this._subGen=0}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(t){if(this._config={...t},this._windowDays=t.window_days&&[7,14,30,365].includes(t.window_days)?t.window_days:30,this._pastDays=t.past_days&&[30,90].includes(t.past_days)?t.past_days:0,this._userFilter=typeof t.user_filter=="string"?t.user_filter:"",typeof t.object_filter=="string")this._objectFilter=t.object_filter,this._configuredObjects=[];else if(Array.isArray(t.object_filter)){let e=t.object_filter.filter(i=>typeof i=="string"&&i!=="");this._objectFilter=e.length===1?e[0]:"",this._configuredObjects=e.length>1?e:[]}else this._objectFilter="",this._configuredObjects=[]}getCardSize(){return 6}get _lang(){return N(this.hass)}connectedCallback(){super.connectedCallback(),window.addEventListener("history-entry-saved",this._onHistorySaved)}disconnectedCallback(){if(super.disconnectedCallback(),this._subGen++,window.removeEventListener("history-entry-saved",this._onHistorySaved),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._dataLoaded=!1,this._lastConnection=null}updated(t){if(super.updated(t),pe(this,t),this.hass&&this._pastDays>0&&(t.has("_objects")||t.has("_pastDays"))&&this._loadPastHistories(),t.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[t,e]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=t.objects,this._stats=e,Me(this._stats.budget)}catch{}}async _loadPastHistories(){let t=$r(this._objects,mt(),this._pastDays||30),e=t.map(n=>n.sig).join("|");if(e===this._pastHistorySig)return;this._pastHistorySig=e;let i=++this._pastSeq,s=await Promise.all(t.map(async n=>{try{let c=await mi(this.hass,n.entryId,n.taskId);return c?[n.key,c]:null}catch{return null}}));i===this._pastSeq&&(this._pastHistory=Object.fromEntries(s.filter(n=>n!==null)))}async _subscribe(){let t=++this._subGen;try{let e=await this.hass.connection.subscribeMessage(i=>{let s=i;this._objects=s.objects},{type:"maintenance_supporter/subscribe"});if(!this.isConnected||t!==this._subGen){e();return}this._unsub=e}catch{}}_onEventClick(t){if(t.history_timestamp&&Vs.includes(String(t.history_type||"completed"))){this._openHistoryEntry(t);return}this._openTask(t)}_openTask(t){let e=new CustomEvent("maintenance-supporter-open-task",{detail:{entry_id:t.entry_id,task_id:t.task_id},bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(e)&&(rr(t.entry_id,t.task_id)||this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:t.entry_id,task_id:t.task_id},bubbles:!0,composed:!0})))}async _openHistoryEntry(t){try{let e=await _i(this.hass);if(!ye(this.hass?.user,e.access)){this._openTask(t);return}}catch{}try{let e=await La(this.hass,t.entry_id,t.task_id,t.history_timestamp);if(!e||ar(e))return}catch{}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:t.entry_id,task_id:t.task_id,original_timestamp:t.history_timestamp},bubbles:!0,composed:!0}))}render(){if(!this.hass)return h;let t=this._lang,e=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,s=this._config.title,n=null;this._userFilter&&(n=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let c=v=>{let D=v.toLowerCase();return this._objects.find(Q=>Q.entry_id===v||Q.object.name.toLowerCase()===D)?.entry_id??null},d=new Set(this._configuredObjects.map(c).filter(v=>v!==null)),u=d.size?this._objects.filter(v=>d.has(v.entry_id)):this._objects,p=this._config.show_object_filter!==!1&&u.length>1,_=this._objectFilter?c(this._objectFilter):null,g=_&&u.some(v=>v.entry_id===_)?u.filter(v=>v.entry_id===_):u,b=mt(),x=this._pastDays>0,T=x?Sr(g,b,this._pastDays,n,this._pastHistory):kr(g,b,this._windowDays,n),y=this._windowDays===365||x,k=y?T.filter(v=>v.events.length>0):T,w=v=>{let D=`cal-status-${v.status}`,R=v.projected?"cal-event-projected":"",Q=v.status==="overdue"&&v.days_until_due!=null?` (${Mt(v.days_until_due,t)})`:"",C=v.projected&&v.interval_days?o`<span class="cal-event-recur">${v.interval_unit&&v.interval_unit!=="days"?ta(v.interval_days,v.interval_unit,t):v.interval_days===1?a("cal_every_day",t):a("cal_every_n_days",t).replace("{n}",String(v.interval_days))}</span>`:h,B=v.schedule_type==="sensor_based",V=B?o`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${a("cal_source_sensor",t)}" icon="mdi:trending-up"></ha-icon>`:o`<ha-icon class="cal-event-icon cal-source-time"
                title="${v.adaptive_enabled?a("cal_source_time_adaptive",t):a("cal_source_time",t)}"
                icon="${v.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,z=B&&v.prediction_confidence&&v.status!=="triggered"&&!v.projected?o`<span class="cal-event-prediction cal-conf-${v.prediction_confidence}">
            ${a("cal_predicted",t)} · ${a(`cal_confidence_${v.prediction_confidence}`,t)}
          </span>`:h,X=Je(this._stats?.budget),Z=v.history_type?a(v.history_type,t):a(v.status,t);return o`
        <div class="cal-event ${R}"
          @click=${()=>this._onEventClick(v)}>
          ${V}
          <span class="cal-status-pill ${D}">${Z}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${v.object_name} · ${v.task_name}${Q}</div>
            ${z}
            ${C}
          </div>
          ${v.avg_cost!=null&&v.avg_cost!==0?o`<span class="cal-event-cost">${Y(v.avg_cost,X,t)}</span>`:h}
        </div>
      `},E=v=>{let[D,R,Q]=v.date.split("-").map(Number),C=new Date(D,R-1,Q),B=v.date===b,V=ea(C,t,"short"),z=ia(C,t,"long");return o`
        <div class="cal-day-row">
          <div class="cal-day-pill ${B?"cal-today":""}">
            <span class="cal-pill-weekday">${V}</span>
            <span class="cal-pill-day">${C.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${z}</span>
              ${B?o`<span class="cal-day-today-badge">${a("today",t)}</span>`:h}
            </div>
            ${v.events.length===0?o`<div class="cal-empty">${a("cal_no_events",t)}</div>`:v.events.map(w)}
          </div>
        </div>
      `};return o`
      <ha-card .header=${s}>
        ${e||i||p?o`
              <div class="cal-controls">
                ${e?o`
                      <div class="cal-window-chips cal-past-chips" title="${a("cal_past_windows",t)}">
                        ${[30,90].map(v=>o`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===v?"active":""}"
                            @click=${()=>{this._pastDays=v}}>
                            −${v}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${a("cal_forward_windows",t)}">
                        ${[7,14,30,365].map(v=>o`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===v?"active":""}"
                            @click=${()=>{this._windowDays=v,this._pastDays=0}}>
                            ${v===365?"+1y":`+${v}d`}
                          </button>
                        `)}
                      </div>
                    `:h}
                ${i?o`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${v=>{this._userFilter=v.target.value}}>
                        <option value="">${a("all_users",t)}</option>
                        <option value="current_user">${a("my_tasks",t)}</option>
                      </select>
                    `:h}
                ${p?o`
                      <select class="cal-user-filter"
                        .value=${_??""}
                        @change=${v=>{this._objectFilter=v.target.value}}>
                        <option value="">${a("all_objects",t)}</option>
                        ${[...u].sort((v,D)=>v.object.name.localeCompare(D.object.name)).map(v=>o`<option value=${v.entry_id} ?selected=${v.entry_id===_}>${v.object.name}</option>`)}
                      </select>
                    `:h}
              </div>
            `:h}
        <div class="cal-rolling">
          ${k.length===0&&y?o`<div class="cal-empty">${a("cal_no_events",t)}</div>`:k.map(E)}
        </div>
      </ha-card>
    `}};xt.styles=[ue,jr,H`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],m([j({attribute:!1})],xt.prototype,"hass",2),m([f()],xt.prototype,"_config",2),m([f()],xt.prototype,"_objects",2),m([f()],xt.prototype,"_stats",2),m([f()],xt.prototype,"_windowDays",2),m([f()],xt.prototype,"_pastDays",2),m([f()],xt.prototype,"_userFilter",2),m([f()],xt.prototype,"_objectFilter",2),m([f()],xt.prototype,"_unsub",2),m([f()],xt.prototype,"_pastHistory",2);var Nn=[{value:7,key:"cal_editor_window_week"},{value:14,key:"cal_editor_window_fortnight"},{value:30,key:"cal_editor_window_month"},{value:365,key:"cal_editor_window_year"}],qn=[{value:30,key:"cal_editor_window_past_30"},{value:90,key:"cal_editor_window_past_90"}],$e=class extends L{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}get _lang(){return N(this.hass)}setConfig(t){this._config={...t}}updated(){let t=this._lang;t&&!Oe(t)&&ut(t).then(()=>{Oe(t)&&this.requestUpdate()})}_valueChanged(t,e){let i={...this._config,[t]:e};t==="show_window_chips"&&e===!0&&delete i.show_window_chips,t==="show_user_filter"&&e===!0&&delete i.show_user_filter,t==="show_object_filter"&&e===!0&&delete i.show_object_filter,t==="title"&&(!e||typeof e=="string"&&e.trim()==="")&&delete i.title,t==="user_filter"&&e===""&&delete i.user_filter,this._emit(i)}_windowChanged(t){let e={...this._config};t.startsWith("past-")?(e.past_days=Number(t.slice(5)),delete e.window_days):(e.window_days=Number(t),delete e.past_days),this._emit(e)}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}render(){let t=this._lang,e=this._config.past_days?`past-${this._config.past_days}`:`${this._config.window_days??30}`,i=this._config.show_window_chips!==!1,s=this._config.show_user_filter!==!1,n=this._config.user_filter??"",c=this._config.title??"";return o`
      <div class="editor">
        <div class="row">
          <label for="title">${a("card_title",t)}</label>
          <input
            id="title"
            type="text"
            .value=${c}
            @input=${d=>this._valueChanged("title",d.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">${a("cal_editor_window",t)}</label>
          <select
            id="window"
            @change=${d=>this._windowChanged(d.target.value)}
          >
            ${Nn.map(d=>o`<option value="${d.value}" ?selected=${`${d.value}`===e}>${a(d.key,t)}</option>`)}
            ${qn.map(d=>o`<option value="past-${d.value}" ?selected=${`past-${d.value}`===e}>${a(d.key,t)}</option>`)}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">${a("cal_editor_show_chips",t)}</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${i}
            @change=${d=>this._valueChanged("show_window_chips",d.target.checked)}
          />
        </div>
        <div class="hint">${a("cal_editor_chips_hint",t)}</div>
        <div class="row toggle">
          <label for="userf">${a("cal_editor_show_user_filter",t)}</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${s}
            @change=${d=>this._valueChanged("show_user_filter",d.target.checked)}
          />
        </div>
        <div class="row">
          <label for="userv">${a("cal_editor_default_user",t)}</label>
          <select
            id="userv"
            @change=${d=>this._valueChanged("user_filter",d.target.value)}
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
            @change=${d=>this._valueChanged("show_object_filter",d.target.checked)}
          />
        </div>
        <div class="hint">${a("cal_editor_object_hint",t)}</div>
      </div>
    `}};$e.styles=H`
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
  `,m([j({attribute:!1})],$e.prototype,"hass",2),m([f()],$e.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",xt);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",$e);Rr(["maintenance-supporter-calendar-card"],import.meta.url);Er({type:"maintenance-supporter-calendar-card",name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});var kt=class extends L{constructor(){super(...arguments);this.objects=[];this._summary=null;this._loaded=!1;this._busy=!1;this._error="";this._query="";this._results=[];this._expanded=!1;this._initiallyLoaded=!1;this._searchTimer=0;this._searchSeq=0}get _lang(){return N(this.hass)}connectedCallback(){super.connectedCallback(),this._initiallyLoaded&&this._load()}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._initiallyLoaded&&(this._initiallyLoaded=!0,this._load(),ut(this._lang).then(()=>this.requestUpdate()))}async _load(){let t=await I(this,{type:"maintenance_supporter/documents/storage"},{busy:e=>{this._busy=e},onError:e=>{this._error=e}});this._loaded=!0,t!==void 0&&(this._summary=t,this._error="")}_nameFor(t){return this.objects.find(i=>i.object?.id===t)?.object?.name||t.slice(0,8)}_entryFor(t){return this.objects.find(e=>e.object?.id===t)?.entry_id}_toggle(){this._expanded=!this._expanded}_openObject(t){this.dispatchEvent(new CustomEvent("open-object",{detail:{entry_id:t},bubbles:!0,composed:!0}))}_onSearch(t){this._query=t.target.value,clearTimeout(this._searchTimer),this._searchTimer=window.setTimeout(()=>{this._doSearch()},250)}async _doSearch(){let t=this._query.trim(),e=++this._searchSeq;if(!t){this._results=[];return}let i="",s=await I(this,{type:"maintenance_supporter/documents/search",query:t},{onError:n=>{i=n}});if(e===this._searchSeq){if(s===void 0){this._error=i,this._results=[];return}this._results=s?.results||[]}}async _openResult(t){if(t.kind==="weblink"){ct(t.url)&&window.open(t.url,"_blank","noopener");return}await I(this,()=>Lt(this.hass,t.id),{onError:e=>{this._error=e}})}_renderResult(t,e){return o`
      <div class="obj-row result-row" title=${a("doc_open",e)} @click=${()=>this._openResult(t)}>
        <ha-icon icon=${t.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"}></ha-icon>
        <div class="result-info">
          <div class="result-title">${gt(t)}</div>
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
                ${At(t.total_bytes,e)}
                ${t.dedup_savings_bytes>0?o`<span class="saved">−${At(t.dedup_savings_bytes,e)}</span>`:h}
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
                      <div class="stat-value">${At(t.total_bytes,e)}</div>
                      <div class="stat-label">
                        <ha-icon icon="mdi:file-document-outline"></ha-icon> ${t.file_count}
                        <ha-icon icon="mdi:link-variant"></ha-icon> ${t.link_count}
                      </div>
                    </div>
                    ${t.dedup_savings_bytes>0?o`<div class="stat">
                          <div class="stat-value saved">−${At(t.dedup_savings_bytes,e)}</div>
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

                  ${this._error?bt("error",this._error):h}

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
        <span class="obj-size">${At(t.bytes,e)}</span>
        ${i?o`<ha-icon class="obj-go" icon="mdi:chevron-right"></ha-icon>`:h}
      </div>
    `}};kt.styles=H`
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
  `,m([j({attribute:!1})],kt.prototype,"hass",2),m([j({attribute:!1})],kt.prototype,"objects",2),m([f()],kt.prototype,"_summary",2),m([f()],kt.prototype,"_loaded",2),m([f()],kt.prototype,"_busy",2),m([f()],kt.prototype,"_error",2),m([f()],kt.prototype,"_query",2),m([f()],kt.prototype,"_results",2),m([f()],kt.prototype,"_expanded",2);customElements.get("maintenance-storage-section-card")||customElements.define("maintenance-storage-section-card",kt);var Fn=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"],Et=class extends L{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId="";this._values=new Array(12).fill("");this._save=async()=>{let t=this._buildOverrides();t!==null&&await this._send(t)!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved")))};this._clearAll=async()=>{await this._send({})!==void 0&&(this._values=new Array(12).fill(""),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved")))}}get _lang(){return N(this.hass)}open(t,e,i){if(this._entryId=t,this._taskId=e,this._values=new Array(12).fill(""),i)for(let[s,n]of Object.entries(i)){let c=parseInt(s,10);c>=1&&c<=12&&typeof n=="number"&&(this._values[c-1]=n.toString())}this._error="",this._open=!0}_close(){this._open=!1}_buildOverrides(){let t={};for(let e=0;e<12;e++){let i=this._values[e].trim();if(!i)continue;let s=parseFloat(i);if(Number.isNaN(s))return this._error=`${a("month_"+["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][e],this._lang)}: ${a("seasonal_override_invalid",this._lang)}`,null;if(s<He[0]||s>He[1])return this._error=a("seasonal_override_range",this._lang),null;t[e+1]=s}return t}_send(t){return this._error="",I(this,{type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:t},{busy:e=>{this._loading=e},fallbackKey:"save_error",onError:e=>{this._error=e}})}render(){if(!this._open)return o``;let t=this._lang;return o`
      <ha-dialog open .headerTitle=${ai(a("seasonal_overrides_title",t))} @closed=${this._close}>
        ${ri(a("seasonal_overrides_title",t))}
        <div class="content">
          <p class="hint">${a("seasonal_overrides_hint",t)}</p>
          ${this._error?bt("error",this._error):h}
          <div class="months">
            ${Fn.map((e,i)=>o`
              <label class="month">
                <span class="mn">${a(e,t)}</span>
                <input type="number" step="0.1" min=${He[0]} max=${He[1]}
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
    `}};Et.styles=H`
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
  `,m([j({attribute:!1})],Et.prototype,"hass",2),m([f()],Et.prototype,"_open",2),m([f()],Et.prototype,"_loading",2),m([f()],Et.prototype,"_error",2),m([f()],Et.prototype,"_entryId",2),m([f()],Et.prototype,"_taskId",2),m([f()],Et.prototype,"_values",2);customElements.get("maintenance-seasonal-overrides-dialog")||customElements.define("maintenance-seasonal-overrides-dialog",Et);var $t=class extends L{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._groupId=null;this._name="";this._description="";this._selected=new Set;this._toggleTask=(t,e)=>{let i=`${t}:${e}`,s=new Set(this._selected);s.has(i)?s.delete(i):s.add(i),this._selected=s};this._save=async()=>{let t=this._name.trim();if(!t){this._error=a("group_name_required",this._lang);return}this._error="";let e=this._buildTaskRefs();await I(this,this._groupId?{type:"maintenance_supporter/group/update",group_id:this._groupId,name:t,description:this._description,task_refs:e}:{type:"maintenance_supporter/group/create",name:t,description:this._description,task_refs:e},{busy:s=>{this._loading=s},fallbackKey:"save_error",onError:s=>{this._error=s}})!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("group-saved")))}}get _lang(){return N(this.hass)}openCreate(){this._reset(),this._open=!0}openEdit(t,e){this._reset(),this._groupId=t,this._name=e.name,this._description=e.description||"",this._selected=new Set(e.task_refs.map(i=>`${i.entry_id}:${i.task_id}`)),this._open=!0}_reset(){this._groupId=null,this._name="",this._description="",this._selected=new Set,this._error=""}_close(){this._open=!1}_buildTaskRefs(){return[...this._selected].map(t=>{let[e,i]=t.split(":",2);return{entry_id:e,task_id:i}})}render(){if(!this._open)return o``;let t=this._lang,e=this._groupId?a("edit_group",t):a("new_group",t);return o`
      <ha-dialog open .headerTitle=${ai(e)} @closed=${this._close}>
        ${ri(e)}
        <div class="content">
          ${this._error?bt("error",this._error):h}
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
                    ${i.tasks.length===0?o`<div class="hint small">${a("no_tasks_short",t)}</div>`:[...i.tasks].sort((s,n)=>s.name.localeCompare(n.name)).map(s=>{let n=`${i.entry_id}:${s.id}`,c=this._selected.has(n);return o`
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
    `}};$t.styles=H`
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
  `,m([j({attribute:!1})],$t.prototype,"hass",2),m([j({attribute:!1})],$t.prototype,"objects",2),m([f()],$t.prototype,"_open",2),m([f()],$t.prototype,"_loading",2),m([f()],$t.prototype,"_error",2),m([f()],$t.prototype,"_groupId",2),m([f()],$t.prototype,"_name",2),m([f()],$t.prototype,"_description",2),m([f()],$t.prototype,"_selected",2);customElements.get("maintenance-group-dialog")||customElements.define("maintenance-group-dialog",$t);var Dt=class extends L{constructor(){super(...arguments);this._open=!1;this._busy=!1;this._error="";this._name="";this._views=[];this._filters=null;this._localeReady=!1;this._save=async()=>{let t=this._name.trim();if(!t||this._busy||!this._filters)return;let e=await this._runWs({type:"maintenance_supporter/views/save",name:t,filters:this._filters});e!==void 0&&(this._name="",this._emitChanged(e?.views||[]))};this._delete=async t=>{if(this._busy)return;let e=await this._runWs({type:"maintenance_supporter/views/delete",view_id:t});e!==void 0&&this._emitChanged(e?.views||[])}}get _lang(){return N(this.hass)}updated(t){t.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,ut(this._lang).then(()=>this.requestUpdate())),t.has("_open")&&this._open&&Wa(this.shadowRoot)}async open(t,e){this._open=!0,this._error="",this._name="",this._filters=t,this._views=e}_close(){this._open=!1}_emitChanged(t){this._views=t,this.dispatchEvent(new CustomEvent("saved-views-changed",{bubbles:!0,composed:!0,detail:{views:t}}))}_runWs(t){return this._error="",I(this,t,{busy:e=>{this._busy=e},onError:e=>{this._error=e}})}render(){if(!this._open)return o``;let t=this._lang;return Va(()=>this._close(),o`
        ${Ua()?h:o`<div class="title">${a("views_dialog_title",t)}</div>`}
        <div class="hint">${a("views_dialog_hint",t)}</div>
        ${this._error?bt("error",this._error):h}

        <div class="save-row">
          <input
            class="name-input"
            type="text"
            .value=${this._name}
            placeholder=${a("views_name_placeholder",t)}
            aria-label=${a("views_name_placeholder",t)}
            maxlength="60"
            @input=${e=>this._name=e.target.value}
            @keydown=${e=>{e.key==="Enter"&&this._save()}}
          />
          <ha-button @click=${this._save} .disabled=${!this._name.trim()||this._busy}>
            ${a("views_save_current",t)}
          </ha-button>
        </div>

        ${this._views.length===0?o`<div class="empty">${a("views_none_yet",t)}</div>`:o`
              <div class="list dialog-scroll">
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
    `,{title:a("views_dialog_title",t)})}};Dt.styles=[Fa,H`
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
  `],m([j({attribute:!1})],Dt.prototype,"hass",2),m([f()],Dt.prototype,"_open",2),m([f()],Dt.prototype,"_busy",2),m([f()],Dt.prototype,"_error",2),m([f()],Dt.prototype,"_name",2),m([f()],Dt.prototype,"_views",2);customElements.get("maintenance-saved-views-dialog")||customElements.define("maintenance-saved-views-dialog",Dt);var Un=60,Vn=20,Cr=30,Wn={approaching:"\u2197",stable:"\u2192",easing:"\u2198"};function bs(r,l){let t=r.trigger_config,e=jt(t);if(!t||!e||r.battery_fleet_task)return null;let i,s=t.type||"threshold";if(s==="threshold")if(t.trigger_above!=null)i=1;else if(t.trigger_below!=null)i=-1;else return null;else if(s==="counter"||s==="runtime"||s==="state_change")i=1;else return null;let n=l.get(be(e,Nt(t)))||[],c=s==="runtime"||s==="state_change",d=n.length>=2?n.map(T=>({ts:T.ts,val:T.val})):c?[]:(r.history||[]).filter(T=>T.trigger_value!=null).map(T=>({ts:St(T.timestamp),val:T.trigger_value}));if(r.trigger_current_value!=null&&(d=[...d,{ts:Date.now(),val:r.trigger_current_value}]),d.length<2)return null;d.sort((T,y)=>T.ts-y.ts);let u=d.map(T=>T.val),p=Math.max(...u)-Math.min(...u),_=u[u.length-1]-u[0],g=t.trigger_delta_mode&&r.trigger_baseline_value!=null&&t.trigger_target_value!=null?r.trigger_baseline_value+t.trigger_target_value:t.trigger_target_value,b=s==="threshold"?t.trigger_above??t.trigger_below:s==="counter"?g:s==="runtime"?t.trigger_runtime_hours:t.trigger_target_changes,x=typeof b=="number"?Math.max(Math.abs(b-u[0]),p):p;return x===0||Math.abs(_)<x*(typeof b=="number"?.05:.15)?"stable":Math.sign(_)===i?"approaching":"easing"}function qe(r){return r>0?Math.ceil(r):Math.trunc(r)||0}function vs(r,l){let t=r.trigger_config??null;if(!t)return h;let e=t.type||"threshold",i=r.trigger_entity_info?.unit_of_measurement??"",s=0,n="",c="";if(e==="threshold"){let p=r.trigger_current_value??null;if(p==null)return h;let _=t.trigger_above,g=t.trigger_below;if(_!=null&&g!=null){let b=(_+g)/2,x=Math.abs(_-g)/2||1;s=Math.min(100,Math.max(0,Math.abs(p-b)/x*100));let T=Math.abs(p-_)<=Math.abs(p-g)?_:g;n=`${vt(p,"",l?.lang)} / ${W(T,l?.lang)}`,c=i}else if(_!=null){let b=r.trigger_entity_info?.min,x=_>0?0:b!=null&&b<_?b:_<0?2*_:-100,T=_-x||1;s=Math.min(100,Math.max(0,(p-x)/T*100)),n=`${vt(p,"",l?.lang)} / ${W(_,l?.lang)}`,c=i}else if(g!=null){let b=r.trigger_entity_info?.max,x=b!=null&&b>g?b:g>0?g*2:g<0?0:100,T=x-g||1;s=Math.min(100,Math.max(0,(x-p)/T*100)),n=`${vt(p,"",l?.lang)} / ${W(g,l?.lang)}`,c=i}else if(t.trigger_equals!=null||t.trigger_not_equals!=null){let b=t.trigger_equals!=null?`= ${t.trigger_equals}`:`\u2260 ${t.trigger_not_equals}`;n=`${vt(p,"",l?.lang)} (${b}${i?` ${i}`:""})`,s=r.trigger_active?100:0}else return h}else if(e==="counter"){let p=t.trigger_target_value||1,_;if(t.trigger_delta_mode?(_=r.trigger_current_delta??null,_==null&&r.trigger_baseline_value!=null&&r.trigger_current_value!=null&&(_=r.trigger_current_value-r.trigger_baseline_value)):_=r.trigger_current_value??null,_==null)return h;s=Math.min(100,Math.max(0,_/p*100)),n=`${vt(_,"",l?.lang)} / ${W(p,l?.lang)}`,c=i}else if(e==="state_change"){let p=t.trigger_target_changes||1,_=r.trigger_current_value??null;if(_==null)return h;s=Math.min(100,Math.max(0,_/p*100)),n=`${W(_,l?.lang,0)} / ${W(p,l?.lang,0)}`}else if(e==="runtime"){let p=t.trigger_runtime_hours||100,_=r.trigger_current_value??null;if(_==null)return h;s=Math.min(100,Math.max(0,_/p*100)),n=`${vt(_,"",l?.lang)}h / ${W(p,l?.lang)}h`}else if(e==="due_date"){let p=r.trigger_current_value??null;if(p==null)return h;let _=t.trigger_days_before??0;s=p<=_?100:Math.max(0,100-(p-_)/30*100),n=Mt(qe(p),l?.lang)}else if(e==="compound"){let p=t.compound_logic||t.operator||"AND",_=t.conditions?.length||0;n=`${p} (${_})`,s=r.trigger_active?100:0}else return h;if(r.battery_fleet_task&&e==="threshold"&&r.trigger_current_value!=null){let p=Math.round(r.trigger_current_value),_=t.trigger_above??0;s=p>_?100:_>0?Math.max(0,p/(_+1)*100):0,n=a("battery_fleet_progress",l?.lang??"en").replace("{n}",W(p,l?.lang,0)),c=""}let d=s>=100,u=s>90?"var(--error-color, #f44336)":s>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return o`
    <div class="trigger-progress">
      <div class="trigger-progress-bar">
        <div class="trigger-progress-fill${d?" overflow":""}" style="width:${s}%;background:${u}"></div>
      </div>
      <span class="trigger-progress-label"><span class="trigger-progress-text"><span class="tp-num">${n}</span>${c?o` <span class="tp-unit">${c}</span>`:h}</span>${l?.trend?o`<i class="trend-arrow trend-${l.trend}" title="${a(`trend_${l.trend}`,l.lang??"en")}" aria-label="${a(`trend_${l.trend}`,l.lang??"en")}">${Wn[l.trend]}</i>`:h}</span>
    </div>
  `}function ys(r,l,t){let e=jt(r.trigger_config);if(!e||r.battery_fleet_task)return h;let i=l.get(be(e,Nt(r.trigger_config)))||[],s=[];if(i.length>=2)s=i.map(v=>({ts:v.ts,val:v.val}));else{if(!r.history)return h;for(let v of r.history)v.trigger_value!=null&&s.push({ts:St(v.timestamp),val:v.trigger_value})}if(r.trigger_current_value!=null&&s.push({ts:Date.now(),val:r.trigger_current_value}),s.length<2)return h;s.sort((v,D)=>v.ts-D.ts);let n=Un,c=Vn,d=s.map(v=>v.val),u=Math.min(...d),p=Math.max(...d),_=p-u||1;u-=_*.1,p+=_*.1;let g=s[0].ts,x=s[s.length-1].ts-g||1,T=v=>(v-g)/x*n,y=v=>2+(1-(v-u)/(p-u))*(c-4),k=s;if(k.length>Cr){let v=Math.ceil(k.length/Cr);k=k.filter((D,R)=>R%v===0||R===k.length-1)}let w=k.map(v=>`${M(T(v.ts))},${M(y(v.val))}`).join(" "),E=r.trigger_active?"var(--error-color, #f44336)":"var(--primary-color)";return o`
    <svg class="mini-sparkline" viewBox="0 0 ${n} ${c}" preserveAspectRatio="none" role="img" aria-label="${a("chart_mini_sparkline",t)}">
      <polyline points="${w}" fill="none" stroke="${E}" stroke-width="1.5" stroke-linejoin="round" />
    </svg>
  `}function xs(r,l,t="last-done"){let e=Zs(r,l);return e?o`<span class="${t}" title="${a("last_performed",l)}: ${U(r,l)}">${e}</span>`:null}function ws(r,l,t,e="due-text"){return(r==null?xs(l,t,`${e} last-done`):null)??o`<span class="${e}">${Mt(r,t)}</span>`}function Or(r,l){let t=l;if(r.days_until_due==null||!r.interval_days||r.interval_days<=0)return h;let{pct:e,overflow:i}=wi(r.interval_days,r.days_until_due,r.interval_unit),s="var(--success-color, #4caf50)";return r.status==="overdue"?s="var(--error-color, #f44336)":r.status==="due_soon"&&(s="var(--warning-color, #ff9800)"),o`
    <div class="days-progress">
      <div class="days-progress-labels">
        <span>${r.last_performed?`${a("last_performed",t)}: ${U(r.last_performed,t)}`:""}</span>
        <span>${r.next_due?`${a("next_due",t)}: ${U(r.next_due,t)}`:""}</span>
      </div>
      <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(e)}" aria-valuemin="0" aria-valuemax="100" aria-label="${a("days_progress",t)}">
        <div class="days-progress-fill${i?" overflow":""}" style="width:${e}%;background:${s}"></div>
      </div>
      <div class="days-progress-text">${Mt(r.days_until_due,t)}</div>
    </div>
  `}var Oi=210,Rt=46,Vt=14,Wt=12,Mr=14,Gn=20+Mr,Kn=[{days:7,key:"chart_range_7d"},{days:30,key:"chart_range_30d"},{days:90,key:"chart_range_90d"},{days:365,key:"chart_range_1y"}],st=class extends L{constructor(){super(...arguments);this.points=[];this.events=[];this.unit="";this.lang="en";this.thresholdAbove=null;this.thresholdBelow=null;this.targetValue=null;this.targetMark="\u25C6";this.forceZero=!1;this.projection=null;this.rangeDays=30;this.showRange=!0;this.busy=!1;this.hideOutliers=!1;this.showOutlierToggle=!0;this._width=0;this._hover=null;this._ro=null}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(t=>{let e=Math.floor(t[0]?.contentRect?.width||0);e&&Math.abs(e-this._width)>2&&(this._width=e)}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=null}_emitRange(t){t!==this.rangeDays&&this.dispatchEvent(new CustomEvent("range-change",{detail:{days:t},bubbles:!0,composed:!0}))}_toggleOutliers(){this.dispatchEvent(new CustomEvent("outlier-toggle",{detail:{hide:!this.hideOutliers},bubbles:!0,composed:!0}))}render(){let t=this._width||320,e=[...this.points].sort((s,n)=>s.ts-n.ts),i=this.lang;return o`
      <div class="chart-wrap">
        ${this.showRange?o`<div class="range-chips" role="group">
              ${this.showOutlierToggle?o`<button
                    class="range-chip outlier-chip ${this.hideOutliers?"active":""}"
                    ?disabled=${this.busy}
                    title=${a("hide_outliers",i)}
                    @click=${()=>this._toggleOutliers()}
                  ><ha-icon icon="mdi:filter-variant"></ha-icon></button>`:h}
              ${Kn.map(s=>o`<button
                  class="range-chip ${this.rangeDays===s.days?"active":""}"
                  ?disabled=${this.busy}
                  @click=${()=>this._emitRange(s.days)}
                >${a(s.key,i)}</button>`)}
            </div>`:h}
        ${e.length<2?o`<div class="chart-empty">
              <ha-icon icon="mdi:chart-line"></ha-icon> ${a("loading_chart",i)}
            </div>`:this._renderSvg(t,e)}
      </div>
    `}_renderSvg(t,e){let i=this.lang,s=t-Rt-Vt,n=Oi-Gn,c=n-Wt,d=1/0,u=-1/0;for(let O of e)d=Math.min(d,O.min??O.val),u=Math.max(u,O.max??O.val);this.thresholdAbove!=null&&(d=Math.min(d,this.thresholdAbove),u=Math.max(u,this.thresholdAbove)),this.thresholdBelow!=null&&(d=Math.min(d,this.thresholdBelow),u=Math.max(u,this.thresholdBelow)),this.targetValue!=null&&(d=Math.min(d,this.targetValue),u=Math.max(u,this.targetValue)),this.forceZero&&(d=Math.min(d,0));let p=(u-d||1)*.06,_=this.forceZero&&d>=0?0:d>=0?Math.max(0,d-p):d-p,{ticks:g,niceMin:b,niceMax:x}=Le(_,u+p,4);d>=0&&b<0&&(b=0,g=g.filter(O=>O>=0));let T=g.length>1?g[1]-g[0]:0,y=e[0].ts,k=this.projection&&this.projection.length===2?this.projection[1].ts:null,w=k!=null?Math.max(e[e.length-1].ts,k):e[e.length-1].ts,E=w-y||1,v=O=>Rt+(O-y)/E*s,D=O=>Wt+(1-(O-b)/(x-b||1))*c,R=e.map(O=>`${M(v(O.ts))},${M(D(O.val))}`).join(" "),Q=`M${M(v(e[0].ts))},${n} `+e.map(O=>`L${M(v(O.ts))},${M(D(O.val))}`).join(" ")+` L${M(v(e[e.length-1].ts))},${n} Z`,C="",B=e.filter(O=>O.min!=null&&O.max!=null);if(B.length>=2){let O=B.map(ht=>`${M(v(ht.ts))},${M(D(ht.max))}`),tt=[...B].reverse().map(ht=>`${M(v(ht.ts))},${M(D(ht.min))}`);C=`M${O[0]} `+O.slice(1).map(ht=>`L${ht}`).join(" ")+` L${tt.join(" L")} Z`}let V=[];if(this.thresholdBelow!=null){let O=D(this.thresholdBelow);V.push({y:O,h:Math.max(0,n-O),lineY:O,label:`\u25BC ${qt(this.thresholdBelow,i)}`,labelY:Math.min(n-4,O+13)})}if(this.thresholdAbove!=null){let O=D(this.thresholdAbove);V.push({y:Wt,h:Math.max(0,O-Wt),lineY:O,label:`\u25B2 ${qt(this.thresholdAbove,i)}`,labelY:Math.max(Wt+11,O-5)})}let z=e[e.length-1],X=(this.events||[]).filter(O=>O.ts>=y&&O.ts<=w),Z=fi(y,w,Math.max(2,Math.min(5,Math.floor(s/110)+1))),et=this._hover;return o`
      <div class="svg-holder">
        <svg
          class="chart-svg"
          viewBox="0 0 ${t} ${Oi}"
          width=${t}
          height=${Oi}
          role="img"
          aria-label=${a("chart_sparkline",i)}
          @pointermove=${O=>this._onPointer(O,e,v,D,t)}
          @pointerdown=${O=>this._onPointer(O,e,v,D,t)}
          @pointerleave=${()=>this._hover=null}
        >
          <defs>
            <clipPath id="plot"><rect x="${Rt}" y="${Wt}" width="${s}" height="${c}" /></clipPath>
            ${V.length?K`<clipPath id="danger">${V.map(O=>K`<rect x="${Rt}" y="${M(O.y)}" width="${s}" height="${M(O.h)}" />`)}</clipPath>`:h}
            <!-- Diagonal hatch so the danger zone reads without relying on the
                 red tint alone (dark-theme contrast + colour-blind support). -->
            <pattern id="dangerHatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
              <rect width="7" height="7" fill="var(--error-color, #f44336)" opacity="0.10" />
              <line x1="0" y1="0" x2="0" y2="7" stroke="var(--error-color, #f44336)" stroke-width="1.4" opacity="0.5" />
            </pattern>
          </defs>

          ${g.map(O=>{let tt=D(O);return tt<Wt-1||tt>n+1?h:K`
              <line x1="${Rt}" y1="${M(tt)}" x2="${t-Vt}" y2="${M(tt)}"
                stroke="var(--divider-color)" stroke-width="1" opacity="0.6" />
              <text x="${Rt-7}" y="${M(tt+3.5)}" text-anchor="end" class="tick-label">${Ia(O,T,i)}</text>`})}

          ${V.map(O=>K`<rect x="${Rt}" y="${M(O.y)}" width="${s}" height="${M(O.h)}"
              fill="url(#dangerHatch)" />`)}

          ${C?K`<path d="${C}" fill="var(--primary-color)" opacity="0.08" clip-path="url(#plot)" />`:h}
          <path d="${Q}" fill="var(--primary-color)" opacity="0.10" clip-path="url(#plot)" />
          <polyline points="${R}" fill="none" stroke="var(--primary-color)" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" clip-path="url(#plot)" />
          ${V.length?K`<polyline points="${R}" fill="none" stroke="var(--error-color, #f44336)" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" clip-path="url(#danger)" />`:h}

          ${V.map(O=>K`
              <line x1="${Rt}" y1="${M(O.lineY)}" x2="${t-Vt}" y2="${M(O.lineY)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${t-Vt-4}" y="${M(O.labelY)}" text-anchor="end" class="zone-label">${O.label}</text>`)}

          ${this.targetValue!=null?K`<line x1="${Rt}" y1="${M(D(this.targetValue))}" x2="${t-Vt}" y2="${M(D(this.targetValue))}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${t-Vt-4}" y="${M(D(this.targetValue)-5)}" text-anchor="end" class="zone-label">${this.targetMark} ${qt(this.targetValue,i)} ${this.unit}</text>`:h}

          ${this.projection&&this.projection.length===2?K`<line x1="${M(v(this.projection[0].ts))}" y1="${M(D(this.projection[0].val))}"
                x2="${M(Math.min(v(this.projection[1].ts),t-Vt))}" y2="${M(D(Math.max(b,Math.min(x,this.projection[1].val))))}"
                stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.8" />`:h}

          ${Z.map((O,tt)=>{let ht=v(O),se=tt===0?"start":tt===Z.length-1?"end":"middle",lt=es(O,i,y,w);return tt>0&&lt===es(Z[tt-1],i,y,w)?h:K`<text x="${M(ht)}" y="${Oi-5}" text-anchor="${se}" class="tick-label">${lt}</text>`})}

          <line x1="${Rt}" y1="${n}" x2="${t-Vt}" y2="${n}" stroke="var(--divider-color)" stroke-width="1" />

          ${X.map(O=>{let tt=v(O.ts),ht=O.type==="completed"?"var(--success-color, #4caf50)":O.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return K`
              <line x1="${M(tt)}" y1="${Wt}" x2="${M(tt)}" y2="${n}" stroke="${ht}" stroke-width="1" opacity="0.14" />
              <rect x="${M(tt-1.5)}" y="${n+3}" width="3" height="${Mr-6}" rx="1.5" fill="${ht}">
                <title>${is(O.ts,i)}</title>
              </rect>`})}

          ${et?K`
                <line x1="${M(et.x)}" y1="${Wt}" x2="${M(et.x)}" y2="${n}"
                  stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.7" />
                <circle cx="${M(et.x)}" cy="${M(et.y)}" r="4.5" fill="var(--primary-color)"
                  stroke="var(--card-background-color, #fff)" stroke-width="2" />`:K`<circle cx="${M(v(z.ts))}" cy="${M(D(z.val))}" r="4" fill="var(--primary-color)"
                stroke="var(--card-background-color, #fff)" stroke-width="1.5" />`}
        </svg>
        ${et?o`<div
              class="hover-chip"
              style="left:${Math.min(Math.max(et.x,70),t-70)}px"
            >
              <div class="hover-date">${is(et.p.ts,i)}</div>
              <div class="hover-val">
                ${vt(et.p.val,this.unit,i)}
                ${et.p.min!=null&&et.p.max!=null?o`<span class="hover-range">(${qt(et.p.min,i)}–${qt(et.p.max,i)})</span>`:h}
              </div>
            </div>`:h}
      </div>
    `}_onPointer(t,e,i,s,n){let d=t.currentTarget.getBoundingClientRect(),u=(t.clientX-d.left)/d.width*n;if(u<Rt-8||u>n-Vt+8){this._hover=null;return}let p=e[0],_=1/0;for(let g of e){let b=Math.abs(i(g.ts)-u);b<_&&(_=b,p=g)}this._hover={x:i(p.ts),y:s(p.val),p}}};st.styles=H`
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
  `,m([j({attribute:!1})],st.prototype,"points",2),m([j({attribute:!1})],st.prototype,"events",2),m([j()],st.prototype,"unit",2),m([j()],st.prototype,"lang",2),m([j({attribute:!1})],st.prototype,"thresholdAbove",2),m([j({attribute:!1})],st.prototype,"thresholdBelow",2),m([j({attribute:!1})],st.prototype,"targetValue",2),m([j()],st.prototype,"targetMark",2),m([j({type:Boolean})],st.prototype,"forceZero",2),m([j({attribute:!1})],st.prototype,"projection",2),m([j({attribute:!1})],st.prototype,"rangeDays",2),m([j({type:Boolean})],st.prototype,"showRange",2),m([j({type:Boolean})],st.prototype,"busy",2),m([j({type:Boolean})],st.prototype,"hideOutliers",2),m([j({type:Boolean})],st.prototype,"showOutlierToggle",2),m([f()],st.prototype,"_width",2),m([f()],st.prototype,"_hover",2);customElements.get("maintenance-trigger-chart")||customElements.define("maintenance-trigger-chart",st);function Ar(r){let l=(r??"").trim().toLowerCase();return l==="on"||l==="open"||l==="true"?1:l==="off"||l==="closed"||l==="false"?0:null}function Yn(r,l,t){if(r.length<2)return null;let e=t.now??Date.now(),i=Math.max(0,l.trigger_for_minutes??0)*6e4,s=l.trigger_from_state?Ar(l.trigger_from_state):null,n=l.trigger_to_state?Ar(l.trigger_to_state):null;if(l.trigger_from_state&&s===null||l.trigger_to_state&&n===null)return null;let c=[...r].sort((w,E)=>w.ts-E.ts),d=[];for(let w of c){let E=d[d.length-1];(!E||E.level!==w.val)&&d.push({start:w.ts,level:w.val})}let u=w=>(w+1<d.length?d[w+1].start:e)-d[w].start>=i,p=(w,E,v)=>{let D=w[w.length-1];D&&D.val!==v&&w.push({ts:E,val:D.val}),w.push({ts:E,val:v})};if((l.trigger_target_changes??1)===1&&n!==null){let w=[];d.forEach((v,D)=>p(w,v.start,v.level===n&&u(D)?1:0));let E=w[w.length-1]?.val??0;return w.push({ts:e,val:E}),{points:w,mode:"alarm"}}let g=t.since??d[0].start,b=0,x=[];for(let w=1;w<d.length;w++){let E=d[w-1],v=d[w];s!==null&&E.level!==s||n!==null&&v.level!==n||!u(w)||v.start<g||(b+=1,x.push(v.start))}let T=Math.max(0,(t.current??b)-b),y=[{ts:Math.max(g,d[0].start),val:T}],k=T;for(let w of x)k+=1,p(y,w,k);return y.push({ts:e,val:k}),{points:y,mode:"count"}}function Qn(r){if(r.length<4)return r;let l=r.map(u=>u.val).sort((u,p)=>u-p),t=u=>{let p=(l.length-1)*u,_=Math.floor(p),g=Math.ceil(p);return l[_]+(l[g]-l[_])*(p-_)},e=t(.25),i=t(.75),s=i-e;if(s===0)return r;let n=e-1.5*s,c=i+1.5*s,d=r.filter(u=>u.val>=n&&u.val<=c);return d.length>=2?d:r}function Dr(r,l){let t=r.trigger_config;if(!t)return h;if(dt())return eo(r,l);let e=l.lang,i=r.trigger_entity_info,s=r.trigger_entity_infos,n=jt(t)||"",c=i?.friendly_name||n||"\u2014",d=ze(t),u=i?.unit_of_measurement||"",p=r.trigger_current_value,_=t.type||"threshold",g=d.length>1,b=Pr(r,u,l);return o`
    <h3>${a("trigger",e)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${g?o`
            <div class="trigger-entity-name">${d.length} ${a("entities",e)} (${t.entity_logic||"any"})</div>
            <div class="trigger-entity-id">${d.map((x,T)=>o`${T>0?", ":""}<span class="entity-link" @click=${y=>he(y,x)}>${x}</span>`)}${t.attribute?` \u2192 ${t.attribute}`:""}</div>
          `:o`
            <div class="trigger-entity-name">${c}</div>
            <div class="trigger-entity-id">${n?o`<span class="entity-link" @click=${x=>he(x,n)}>${n}</span>`:""}${t.attribute?` \u2192 ${t.attribute}`:""}</div>
          `}
        </div>
        <span class="status-badge ${r.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
          ${r.trigger_active?a("triggered",e):a("ok",e)}
        </span>
      </div>

      ${b?zr(b,e):p!=null?o`
              <div class="trigger-value-row">
                <span class="trigger-current ${r.trigger_active?"active":""}">${_==="due_date"&&typeof p=="number"?Mt(qe(p),e):typeof p=="number"?vt(p,"",e):p}</span>
                ${u?o`<span class="trigger-unit">${u}</span>`:h}
              </div>
            `:h}

      <div class="trigger-limits">
        ${_==="threshold"?o`
          ${t.trigger_above!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("threshold_above",e)}: ${t.trigger_above} ${u}</span>`:h}
          ${t.trigger_below!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("threshold_below",e)}: ${t.trigger_below} ${u}</span>`:h}
          ${t.trigger_equals!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> = ${t.trigger_equals} ${u}</span>`:h}
          ${t.trigger_not_equals!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ≠ ${t.trigger_not_equals} ${u}</span>`:h}
          ${t.trigger_for_minutes?o`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${a("for_minutes",e)}: ${t.trigger_for_minutes}</span>`:h}
        `:h}
        ${_==="state_change"?o`
          ${t.trigger_target_changes!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("target_changes",e)}: ${t.trigger_target_changes}</span>`:h}
        `:h}
        ${_==="runtime"?o`
          ${t.trigger_runtime_hours!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("runtime_hours",e)}: ${t.trigger_runtime_hours}h</span>`:h}
        `:h}
        ${_==="due_date"?o`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("days_before",e)}: ${t.trigger_days_before??0}</span>
        `:h}
        ${_==="compound"?o`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("compound_logic",e)}: ${t.compound_logic||t.operator||"AND"}</span>
          ${(t.conditions||[]).map((x,T)=>o`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${T+1}. ${a(x.type==="due_date"?"trigger_type_due_date":x.type||"unknown",e)}: ${ze(x).map((y,k)=>o`${k>0?", ":""}<span class="entity-link" @click=${w=>he(w,y)}>${y}</span>`)}</span>
          `)}
        `:h}
      </div>

      ${s&&s.length>1?o`
        <div class="trigger-entity-list">
          ${s.map(x=>o`
            <span class="trigger-entity-id">${x.friendly_name} (<span class="entity-link" @click=${T=>he(T,x.entity_id)}>${x.entity_id}</span>)</span>
          `)}
        </div>
      `:h}

      ${Lr(r,u,l)}
    </div>
  `}function Xn(r,l){r.preventDefault(),history.pushState(null,"",`/history?entity_id=${l.map(encodeURIComponent).join(",")}`),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}var Mi=88,Te=28,Jn=48;function Zn(r,l,t=null){if(!r||r.length<2)return h;let e=t!==null&&Number.isFinite(t)&&r[r.length-1].ts<Date.now()?[...r,{ts:Date.now(),val:t}]:r,i=Math.max(1,Math.ceil(e.length/Jn)),s=[];for(let v=0;v<e.length;v+=i)s.push(e[v]);s[s.length-1]!==e[e.length-1]&&s.push(e[e.length-1]);let n=(l.type||"threshold")==="threshold"?[l.trigger_above,l.trigger_below].filter(v=>typeof v=="number"):[],c=s.map(v=>v.val),d=Math.min(...c),u=Math.max(...c),p=u-d||Math.abs(u)||1,_=n.filter(v=>v>=d-2*p&&v<=u+2*p);for(let v of _)d=Math.min(d,v),u=Math.max(u,v);let g=u-d||1,b=s[0].ts,x=s[s.length-1].ts,T=v=>x===b?0:(v-b)/(x-b)*(Mi-2)+1,y=v=>Te-2-(v-d)/g*(Te-4),k=s.map((v,D)=>`${D?"L":"M"}${M(T(v.ts))},${M(y(v.val))}`).join(" "),w=s[s.length-1].val,E=l.trigger_above!=null&&w>l.trigger_above||l.trigger_below!=null&&w<l.trigger_below;return o`<svg class="sensor-trend ${E?"past":""}" viewBox="0 0 ${Mi} ${Te}" width=${Mi} height=${Te}
    preserveAspectRatio="none" aria-hidden="true">
    ${_.map(v=>K`<line class="sensor-trend-limit" x1="0" x2=${Mi} y1=${M(y(v))} y2=${M(y(v))}></line>`)}
    <path class="sensor-trend-area" d=${`${k} L${M(T(x))},${Te} L${M(T(b))},${Te} Z`}></path>
    <path class="sensor-trend-line" d=${k}></path>
  </svg>`}function to(r,l,t){let e=l.lang,i=l.hass,s=i?.states?.[r.entityId],n=(t.trigger_entity_infos||[]).find(g=>g.entity_id===r.entityId)??(t.trigger_entity_info?.entity_id===r.entityId?t.trigger_entity_info:void 0),c=s?.attributes?.unit_of_measurement??n?.unit_of_measurement??"",d=s?.attributes?.friendly_name||n?.friendly_name||r.entityId,u=i,p="\u2014";s&&(r.cond.attribute?p=u?.formatEntityAttributeValue?.(s,r.cond.attribute)??String(s.attributes?.[r.cond.attribute]??"\u2014"):p=u?.formatEntityState?.(s)??`${s.state}${c?` ${c}`:""}`);let _=g=>he(g,r.entityId);return o`
    <div class="sensor-row" role="button" tabindex="0" data-entity=${r.entityId} title=${d}
      @click=${_}
      @keydown=${g=>{(g.key==="Enter"||g.key===" ")&&(g.preventDefault(),_(g))}}>
      ${s&&customElements.get("state-badge")?o`<state-badge class="sensor-badge" .hass=${i} .stateObj=${s} stateColor></state-badge>`:o`<ha-icon class="sensor-badge" icon=${s?.attributes?.icon||"mdi:eye"}></ha-icon>`}
      <div class="sensor-info">
        <div class="sensor-name">${d}</div>
        <div class="sensor-cond">${vi(r.cond,c,e)}</div>
      </div>
      ${Zn(l.detailStatsData.get(r.entityId),r.cond,s?parseFloat(String(r.cond.attribute?s.attributes?.[r.cond.attribute]:s.state)):null)}
      <div class="sensor-state">${p}</div>
    </div>
  `}function eo(r,l){let t=r.trigger_config,e=l.lang,i=fe(t),s=[...new Set(i.map(_=>_.entityId))],n=Zt(l.hass,r),c=Pr(r,n,l),d=t.type==="compound"?(t.conditions||[]).length:s.length,u=t.type==="compound"?(t.compound_logic||"AND")==="AND":t.entity_logic==="all",p=d>1?a(u?"beta_rules_all_of":"beta_rules_any_of",e).split("{n}").join(String(d)):"";return o`
    <div class="trigger-card sensor-rule">
      <div class="sensor-rule-head">
        <div class="sensor-rule-title">
          <span>${a("beta_sensor_rule",e)}</span>
          ${p?o`<span class="sensor-rule-sub">${p}</span>`:h}
        </div>
        <span class="status-badge ${r.trigger_active?"triggered":"ok"}">
          ${r.trigger_active?a("triggered",e):a("ok",e)}
        </span>
      </div>
      <div class="sensor-rows">${i.map(_=>to(_,l,r))}</div>
      ${c?zr(c,e):h}
      ${Lr(r,n,l)}
      ${s.length?o`<div class="sensor-rule-foot">
            <a class="sensor-rule-more" href=${`/history?entity_id=${s.map(encodeURIComponent).join(",")}`}
              @click=${_=>Xn(_,s)}>${a("beta_show_history",e)}</a>
          </div>`:h}
    </div>
  `}function Pr(r,l,t){let e=r.trigger_config,i=r.trigger_current_value;if(!e||i==null)return null;switch(e.type||"threshold"){case"counter":{let s=e.trigger_target_value;if(s==null||s<=0)return null;if(!e.trigger_delta_mode)return{progress:Math.max(0,i),target:s,unit:l,meter:null};let n=Ir(r,Hr(r,t));return{progress:Math.max(0,i-(n?.value??i)),target:s,unit:l,meter:i}}case"state_change":{let s=e.trigger_target_changes;return s==null||s<=0?null:{progress:Math.max(0,i),target:s,unit:"",meter:null}}case"runtime":{let s=e.trigger_runtime_hours;return s==null||s<=0?null:{progress:Math.max(0,i),target:s,unit:"h",meter:null}}}return null}function Ir(r,l){if(r.trigger_baseline_value!=null)return{value:r.trigger_baseline_value,ts:Ai(r)};if(!l.length)return null;let t=Ai(r);if(t==null)return{value:l[0].val,ts:null};let e=l[0],i=Math.abs(l[0].ts-t);for(let s of l){let n=Math.abs(s.ts-t);n<i&&(e=s,i=n)}return{value:e.val,ts:t}}function Ai(r){let l=[...r.history].filter(t=>t.type==="completed"||t.type==="reset").sort((t,e)=>St(e.timestamp)-St(t.timestamp))[0];return l?St(l.timestamp):null}function zr(r,l){let t=Math.min(999,Math.round(r.progress/r.target*100)),e=t>=100?"over":t>=75?"near":"ok";return o`
    <div class="counter-progress">
      <div class="counter-progress-nums">
        <span class="counter-progress-main">${vt(r.progress,"",l)}<span class="counter-progress-target"> / ${vt(r.target,r.unit,l)}</span></span>
        <span class="counter-progress-pct ${e}">${t} %</span>
      </div>
      <div class="counter-progress-bar" role="progressbar" aria-valuenow=${t} aria-valuemin="0" aria-valuemax="100">
        <div class="counter-progress-fill ${e}" style="width:${Math.min(100,t)}%"></div>
      </div>
      <div class="counter-progress-caption">
        ${a("chart_since_service",l)}${r.meter!=null?o` · ${a("current",l)}: ${vt(r.meter,r.unit,l)}`:h}
      </div>
    </div>
  `}function Hr(r,l){let t=r.trigger_config;if(!t)return[];let e=t.type||"threshold",i=jt(t)||"",s=e==="runtime"?[]:l.detailStatsData.get(i)||[],n=l.isCounterEntity(t),c=[];if(s.length>=2)for(let u of s){let p={ts:u.ts,val:u.val};!n&&u.min!=null&&u.max!=null&&(p.min=u.min,p.max=u.max),c.push(p)}else for(let u of r.history)u.trigger_value!=null&&c.push({ts:St(u.timestamp),val:u.trigger_value});let d=!!i&&!!l.historyFallbackIds?.has(i)&&s.length>=2;return r.trigger_current_value!=null&&!d&&c.push({ts:Date.now(),val:r.trigger_current_value}),c.sort((u,p)=>u.ts-p.ts),c}function Lr(r,l,t){let e=r.trigger_config;if(!e)return h;let i=e.type||"threshold",s=jt(e)||"";if(i==="due_date")return h;let n=Hr(r,t),c=null;i==="state_change"&&s&&t.historyFallbackIds?.has(s)&&(c=Yn(n,e,{since:Ai(r),current:r.trigger_current_value??null}),c&&(n=c.points)),i==="runtime"&&e.trigger_runtime_hours&&r.trigger_current_value!=null&&(n=[{ts:Ai(r)??n[0]?.ts??Date.now()-864e5,val:0},{ts:Date.now(),val:Math.max(0,r.trigger_current_value)}]),t.hideOutliers&&(n=Qn(n));let d=n.length<2&&!!s&&t.hasStatsService&&!t.detailStatsData.has(s);if(n.length<2&&!d)return h;let u=!!s&&t.detailStatsData.has(s)&&(t.detailStatsData.get(s)?.length??0)<2;if(dt()&&i==="state_change"&&u&&!(s&&t.historyFallbackIds?.has(s)))return h;let p=Date.now()-t.rangeDays*864e5,_=n.filter(E=>E.ts>=p);_.length>=2&&(n=_);let g=null,b="\u25C6",x=!1;if(i==="threshold"&&e.trigger_above==null&&e.trigger_below==null&&(e.trigger_equals!=null||e.trigger_not_equals!=null))g=e.trigger_equals??e.trigger_not_equals??null,b=e.trigger_equals!=null?"=":"\u2260";else if(i==="counter"&&e.trigger_target_value!=null&&n.length){if(e.trigger_delta_mode){let E=Ir(r,n);if(E){if(E.ts!=null){let v=n.filter(D=>D.ts>=E.ts);v.length>=2&&(n=v)}n=n.map(v=>({...v,val:Math.max(0,v.val-E.value)}))}}g=e.trigger_target_value,x=!0}else i==="state_change"&&e.trigger_target_changes&&c?.mode!=="alarm"?(g=e.trigger_target_changes,x=!0):i==="runtime"&&e.trigger_runtime_hours&&(g=e.trigger_runtime_hours,x=!0);let T=null,y=r.degradation_rate,k=y!=null&&(e.trigger_below!=null&&e.trigger_above==null&&y>0||e.trigger_above!=null&&e.trigger_below==null&&y<0);if(g==null&&y!=null&&!k&&(r.degradation_trend!=="stable"||r.days_until_threshold!=null)&&r.degradation_trend!=="insufficient_data"&&n.length>=2){let E=n[n.length-1];T=[E,{ts:E.ts+30*864e5,val:E.val+y*30}]}let w=r.history.filter(E=>["completed","skipped","reset"].includes(E.type)).map(E=>({ts:St(E.timestamp),type:E.type}));return o`
    <maintenance-trigger-chart
      .points=${d?[]:n}
      .events=${w}
      .unit=${l}
      .lang=${t.lang}
      .thresholdAbove=${i==="threshold"?e.trigger_above??null:null}
      .thresholdBelow=${i==="threshold"?e.trigger_below??null:null}
      .targetValue=${g}
      .targetMark=${b}
      .forceZero=${x}
      .projection=${T}
      .rangeDays=${t.rangeDays}
      .hideOutliers=${t.hideOutliers}
      .busy=${d}
      @range-change=${E=>t.setRangeDays(E.detail.days)}
      @outlier-toggle=${E=>t.setHideOutliers(E.detail.hide)}
    ></maintenance-trigger-chart>
    ${d?h:s&&t.historyFallbackIds?.has(s)&&!u?o`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${a(c?.mode==="alarm"?"chart_history_alarm":c?.mode==="count"?"chart_history_count":"chart_history_fallback",t.lang)}
        </div>`:u?o`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${a("chart_no_stats",t.lang)}
        </div>`:h}
  `}var io=200,Fe=10,so=22;function Br(r,l,t,e,i){let s=r.history.filter(d=>d.type==="completed"&&(Bt(d)!=null||d.duration!=null));if(s.length<2)return h;let n=s.some(d=>(Bt(d)??0)!==0),c=s.some(d=>(d.duration??0)>0);return!n&&!c?h:o`
    <div class="cost-duration-card">
      <div class="card-header">
        <h3>${a("cost_duration_chart",l)}</h3>
        <div class="toggle-buttons">
          ${n?o`<button
            class="toggle-btn ${t==="cost"?"active":""}"
            @click=${()=>e("cost")}>
            ${a("cost",l)}
          </button>`:h}
          ${n&&c?o`<button
            class="toggle-btn ${t==="both"?"active":""}"
            @click=${()=>e("both")}>
            ${a("both",l)}
          </button>`:h}
          ${c?o`<button
            class="toggle-btn ${t==="duration"?"active":""}"
            @click=${()=>e("duration")}>
            ${a("duration",l)}
          </button>`:h}
        </div>
      </div>
      ${ao(r,l,t,i)}
    </div>
  `}function ao(r,l,t,e){let i=r.history.filter(A=>A.type==="completed"&&(Bt(A)!=null||A.duration!=null)).map(A=>({ts:St(A.timestamp),cost:Bt(A)??0,duration:A.duration??0})).sort((A,at)=>A.ts-at.ts);if(i.length<2)return h;let s=i.some(A=>A.cost!==0),n=i.some(A=>A.cost<0),c=i.some(A=>A.duration>0);if(!s&&!c)return h;let d=t!=="duration"&&s,u=t!=="cost"&&c,p=d||!u&&s,_=u||!d&&c,g=640,b=io,x=p?44:12,T=_?44:12,y=g-x-T,k=b-so,w=k-Fe,E=i[0].ts,v=i[i.length-1].ts,D=(v-E||864e5)*.05,R=E-D,Q=v+D,C=za(E,v),B=A=>x+(A-R)/(Q-R)*y,V=Math.min(0,...i.map(A=>A.cost)),z=Math.max(0,...i.map(A=>A.cost)),X=Le(V,z>V?z:V+1,3),Z=Le(0,Math.max(...i.map(A=>A.duration))||1,3),et=X.niceMax-X.niceMin||1,O=A=>Fe+(1-(A-X.niceMin)/et)*w,tt=A=>Fe+(1-A/(Z.niceMax||1))*w,ht=i.length>1?Math.min(...i.slice(1).map((A,at)=>B(A.ts)-B(i[at].ts))):y,se=Math.max(6,Math.min(22,ht*.55)),lt=fi(E,v,Math.max(2,Math.min(4,i.length)));return o`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${g} ${b}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${a("chart_history",l)}">
        ${p?X.ticks.map(A=>{let at=O(A);return at<Fe-1||at>k+1?h:K`
            <line x1="${x}" y1="${M(at)}" x2="${g-T}" y2="${M(at)}" stroke="var(--divider-color)" stroke-width="1" opacity="0.55" />
            <text x="${x-6}" y="${M(at+3.5)}" text-anchor="end" fill="var(--primary-color)" font-size="10.5">${qt(A,l)}${e}</text>`}):h}
        ${_?Z.ticks.map(A=>{let at=tt(A);return at<Fe-1||at>k+1?h:K`<text x="${g-T+6}" y="${M(at+3.5)}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="10.5">${qt(A,l)}m</text>`}):h}

        ${p&&X.niceMin<0?K`
          <line class="cost-zero" x1="${x}" y1="${M(O(0))}" x2="${g-T}" y2="${M(O(0))}" stroke="var(--secondary-text-color)" stroke-width="1" opacity="0.7" />
        `:h}
        ${p?i.filter(A=>A.cost!==0).map(A=>{let at=O(Math.max(A.cost,0)),je=A.cost<0;return K`
          <rect class="${je?"credit-bar":"cost-bar"}" x="${M(B(A.ts)-se/2)}" y="${M(at)}" width="${M(se)}" height="${M(O(Math.min(A.cost,0))-at)}"
            fill="${je?"var(--success-color, #4caf50)":"var(--primary-color)"}" opacity="0.6" rx="2">
            <title>${gi(A.ts,l,!0)}: ${je?`${a("cost_kind_credit",l)} `:""}${Y(Math.abs(A.cost),e,l)}${A.duration?` \xB7 ${A.duration}m`:""}</title>
          </rect>`}):h}
        ${_?K`
          <polyline points="${i.map(A=>`${M(B(A.ts))},${M(tt(A.duration))}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${i.map(A=>K`
            <circle cx="${M(B(A.ts))}" cy="${M(tt(A.duration))}" r="3.5" fill="var(--accent-color, #ff9800)">
              <title>${gi(A.ts,l,!0)}: ${A.duration}m${A.cost?` \xB7 ${Y(A.cost,e,l)}`:""}</title>
            </circle>
          `)}
        `:h}

        <line x1="${x}" y1="${k}" x2="${g-T}" y2="${k}" stroke="var(--divider-color)" stroke-width="1" />
        ${lt.map((A,at)=>{let je=at===0?"start":at===lt.length-1?"end":"middle";return K`<text x="${M(B(A))}" y="${b-6}" text-anchor="${je}" fill="var(--secondary-text-color)" font-size="10">${gi(A,l,C)}</text>`})}
      </svg>
    </div>
    <div class="chart-legend">
      ${p?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${a("cost",l)}</span>`:h}
      ${p&&n?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50);opacity:0.6"></span>${a("cost_kind_credit",l)}</span>`:h}
      ${_?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${a("duration",l)}</span>`:h}
    </div>
  `}var ro={ok:"mdi:check-circle-outline",due_soon:"mdi:calendar-clock",overdue:"mdi:calendar-alert",triggered:"mdi:alert-circle-outline",paused:"mdi:pause-circle-outline",archived:"mdi:archive-outline"},Vr={completed:"mdi:check-circle",skipped:"mdi:debug-step-over",missed:"mdi:calendar-remove",reset:"mdi:restore",triggered:"mdi:alert-circle-outline",trigger_removed:"mdi:link-off",trigger_replaced:"mdi:swap-horizontal"},Wr=new Set(["completed","skipped","reset"]),no=new Set(Ks),Gr="Sensor trigger activated",oo={counted:"beta_trace_dw_counted",waiting:"beta_trace_dw_waiting",left_early:"beta_trace_dw_left_early",not_due:"beta_trace_dw_not_due",inert:"beta_trace_dw_inert",recent:"beta_trace_dw_recent"},lo={done:"beta_trace_cleared_done",status_left:"beta_trace_cleared_status",inert:"beta_trace_cleared_inert"};function F(r){return typeof r=="string"?r:r==null?"":String(r)}function Gt(r,l){return Object.entries(l).reduce((t,[e,i])=>t.split(`{${e}}`).join(i),r)}function Di(r,l){return r?a(r,l):"\u2014"}function ks(r){return r.replace(/\s*[(（][^)）]*[)）]\s*$/,"").trim()}function Se(r,l){let t=Math.max(1,Math.round(r/6e4));if(t<60)return Ot(t,"minute",l);let e=Math.round(r/36e5);return e<48?Ot(e,"hour",l):Ot(Math.round(r/864e5),"day",l)}function co(r,l){let t=l;switch(r.kind){case"status":{let e=F(r.from),i=F(r.to);return{at:r.at,icon:ro[i]??"mdi:information-outline",text:`${Di(e,t)} \u2192 ${Di(i,t)}`,tone:"status",details:[],group:`status:${e}>${i}`,watch:e==="triggered"||i==="triggered"?"rule":void 0}}case"reminder":{if(r.reminder==="lead"){let i=Number(r.days);return{at:r.at,icon:"mdi:bell-outline",text:Gt(a("beta_trace_reminder_lead",t),{interval:Number.isFinite(i)?Ot(i,"day",t):"\u2014"}),tone:"info",details:[],group:`reminder:lead:${F(r.days)}`}}let e=r.reminder==="bundle";return{at:r.at,icon:"mdi:bell-ring-outline",text:Gt(a("beta_trace_reminder",t),{status:Di(F(r.status),t)}),tone:"info",details:e?[{label:a("beta_trace_message",t),value:a("beta_trace_bundle",t)}]:[],group:`reminder:${F(r.reminder)}:${F(r.status)}`}}case"reminder_cleared":return{at:r.at,icon:"mdi:bell-off-outline",text:a(lo[F(r.reason)]??"beta_trace_cleared_done",t),tone:"info",details:[],group:`cleared:${F(r.reason)}`};case"snoozed":{let e=Number(r.hours);return{at:r.at,icon:"mdi:alarm-snooze",text:Gt(a("beta_trace_snoozed",t),{time:wt(F(r.until),t)}),tone:"info",details:Number.isFinite(e)&&e>0?[{label:a("duration",t),value:Ot(e,"hour",t)}]:[],group:`snoozed:${F(r.until)}`}}case"done_when":{let e=F(r.result),i=Number(r.minutes),s=F(r.entity)||"\u2014",n=F(r.state)||"\u2014",c=[{label:ks(a("complete_when",t)),value:`${s} \u2192 ${n}`}];return e==="not_due"&&F(r.status)&&c.push({label:a("report_col_status",t),value:Di(F(r.status),t)}),{at:r.at,icon:e==="counted"?"mdi:check-circle-outline":e==="waiting"?"mdi:timer-sand":"mdi:cancel",text:Gt(a(oo[e]??"beta_trace_dw_not_due",t),{entity:s,state:n,duration:Number.isFinite(i)&&i>0?Ot(i,"minute",t):"\u2014"}),tone:e==="counted"?"done":e==="waiting"?"info":"skipped",details:c,group:`done_when:${e}:${s}:${n}`,watch:"done_when"}}case"edited":{let e=Array.isArray(r.fields)?r.fields.map(F).filter(Boolean):[],i=Gt(a("beta_trace_edited",t),{fields:po(e,t)||"\u2014"}),s={};if(Pi(r.changes))for(let[n,c]of Object.entries(r.changes))Array.isArray(c)&&c.length===2&&(s[n]=[c[0],c[1]]);return{at:r.at,icon:"mdi:pencil-outline",text:i,tone:"info",details:[],group:`edited:${r.at}`,changes:s}}default:return{at:r.at,icon:"mdi:information-outline",text:r.kind,tone:"info",details:[],group:`kind:${r.kind}`}}}var Kr={name:"task_name",type:"maintenance_type",enabled:"task_enabled",schedule:"schedule_type",schedule_type:"schedule_type",interval_days:"interval",interval_unit:"interval",interval_anchor:"interval_anchor",due_date:"due_date",due_override:"postponed",last_performed:"last_performed",warning_days:"warning_days",earliest_completion_days:"earliest_completion_days",schedule_time:"schedule_time_toggle",trigger_config:"beta_sensor_rule",complete_when:"complete_when",notes:"notes_label",documentation_url:"documentation_url_label",custom_icon:"custom_icon_optional",priority:"priority",labels:"labels",checklist:"checklist",phases:"phases_section",phase_sequence:"phases_section",reading_unit:"reading_unit_label",readings:"readings_section",responsible_user_id:"responsible_user",assignee_pool:"task_shared_with",rotation_strategy:"rotation_strategy",nfc_tag_id:"nfc_tag_id",require_tag_scan:"require_tag_scan",allow_skip:"disallow_skip",on_complete_action:"on_complete_action_title",quick_complete_defaults:"qr_action_quick_complete",consumes_parts:"consumes_parts_label",notify_icon:"notify_icon",mirror_todo_entities:"task_mirror_todo",mirror_todo_use_default:"task_mirror_todo",adaptive_config:"adaptive_enabled"};function po(r,l){let t=[],e=!1;for(let i of r){let s=Kr[i];if(!s){e=!0;continue}let n=ks(a(s,l));n&&!t.includes(n)&&t.push(n)}return e&&t.push(a("beta_trace_edited_other",l)),t.join(", ")}function Pi(r){return!!r&&typeof r=="object"&&!Array.isArray(r)}var Nr=/^[a-z_]+\.[a-z0-9_]+$/;function qr(r,l){return r.length>l?`${r.slice(0,l-1)}\u2026`:r}function ho(r,l){let t=l.lang;if(r.type==="compound"){let s=String((r.conditions||[]).length);return a((r.compound_logic||"AND")==="AND"?"beta_rules_all_of":"beta_rules_any_of",t).split("{n}").join(s)}let e=ze(r).map(l.entityName).join(", "),i=vi(r,l.unit,t);return e?`${e}: ${i}`:i}function Fr(r,l,t){let e=t.lang;if(l==null||l===""||Array.isArray(l)&&!l.length)return"\u2014";switch(r){case"schedule":return Pi(l)?Ht({schedule:l},e):"\u2014";case"trigger_config":return Pi(l)?ho(l,t):"\u2014";case"complete_when":return Pi(l)&&typeof l.entity_id=="string"?`${t.entityName(l.entity_id)} \u2192 ${F(l.to_state)||"\u2014"}`:"\u2014";case"interval_days":case"warning_days":case"earliest_completion_days":return typeof l=="number"?Ot(l,"day",e):F(l);case"responsible_user_id":return typeof l=="string"?t.userName(l)??l:"\u2014";case"assignee_pool":return Array.isArray(l)?l.map(i=>typeof i=="string"?t.userName(i)??i:F(i)).join(", "):"\u2014";case"due_date":case"due_override":case"last_performed":return typeof l=="string"?U(l,e):"\u2014";case"priority":return a(`priority_${F(l)}`,e);case"type":return a(F(l),e)}return typeof l=="boolean"?l?"\u2713":"\u2717":typeof l=="number"?W(l,e):typeof l=="string"?Nr.test(l)?t.entityName(l):qr(l,60):Array.isArray(l)&&l.every(i=>i===null||typeof i!="object")?qr(l.map(i=>typeof i=="string"&&Nr.test(i)?t.entityName(i):F(i)).join(", "),80):"\u2026"}function Yr(r,l){if(!r)return[];let t=[];for(let[e,[i,s]]of Object.entries(r)){let n=Kr[e];n&&t.push({label:ks(a(n,l.lang)),value:`${Fr(e,i,l)} \u2192 ${Fr(e,s,l)}`})}return t}function Qr(r,l,t=20){let e=[];for(let[i,s]of Object.entries(r??{}))for(let n of s??[]){let c=n.lu??n.lc,d=typeof c=="number"?c*1e3:Date.parse(n.last_updated??n.last_changed??""),u=n.s??n.state;Number.isFinite(d)&&typeof u=="string"&&e.push({at:d,entityId:i,state:u})}return e.sort((i,s)=>Math.abs(i.at-l)-Math.abs(s.at-l)).slice(0,t).sort((i,s)=>i.at-s.at)}function Xr(r,l,t){let e=r.completed_by?l(r.completed_by):null;if(!e)return null;let i=r.completed_via?l(r.completed_via):null;return{label:a("completed_by",t),value:i?Gt(a("completed_via",t),{person:e,device:i}):e}}function uo(r,l){let t=l,e=[],i=r.checklist_state&&typeof r.checklist_state=="object"?Object.values(r.checklist_state):[];return i.length&&e.push({label:a("checklist",t),value:`${i.filter(Boolean).length}/${i.length}`}),r.feedback&&e.push({label:a("was_maintenance_needed",t),value:a(`feedback_${r.feedback}`,t)}),e}function mo(r,l,t={}){let e=F(r.type),i=F(r.notes).trim(),n=e==="triggered"&&i===Gr?"":ve(i,l).trim(),c=n.length>80?`${n.slice(0,79)}\u2026`:n,d=c?`${a(e,l)} \xB7 ${c}`:a(e,l),u=e==="triggered"&&typeof r.trigger_value=="number"&&Number.isFinite(r.trigger_value)?`${W(r.trigger_value,l,{maximumFractionDigits:3})}${t.triggerUnit?` ${t.triggerUnit}`:""}`:"";return{at:F(r.timestamp),icon:Vr[e]??"mdi:history",text:u?`${d} \xB7 ${a("trigger_val",l)}: ${u}`:d,tone:Wr.has(e)?"done":e==="triggered"?"status":"info",details:uo(r,l),group:e==="triggered"||e==="missed"?`history:${e}:${i}`:`history:${e}:${F(r.timestamp)}`,foldText:d,history:r,watch:e==="triggered"?"rule":void 0}}function Jr(r){return F(r.type)==="triggered"&&F(r.notes).trim()===Gr?{...r,notes:null}:r}function Tt(r){let l=Date.parse(r);return Number.isFinite(l)?l:0}var _o=new Set(["status","reminder_cleared"]),go=6e4;function fo(r){let l=[];for(let e of r){let i=l[l.length-1];if(i&&i.group===e.group){i.repeats||(i.repeats=[{...i}]),i.repeats.push(e);continue}l.push(e)}let t=null;for(let e of l)e.gapMs=t===null?null:Tt(e.at)-Tt(t),t=e.repeats?e.repeats[e.repeats.length-1].at:e.at;return l}function Zr(r,l,t,e={}){let i=[],s=0;for(let p of r)!p||typeof p.at!="string"||typeof p.kind!="string"||i.push({item:co(p,t),ends:!1,kind:p.kind,order:s++,type:""});for(let p of l){if(!p||typeof p.timestamp!="string")continue;let _=F(p.type);i.push({item:mo(p,t,e),ends:Wr.has(_),kind:`history:${_}`,order:s++,type:_})}i.sort((p,_)=>Tt(p.item.at)-Tt(_.item.at)||p.order-_.order);let n=null;for(let p of i)p.kind==="status"&&(n&&n.details.push({label:a("duration",t),value:Se(Tt(p.item.at)-Tt(n.at),t)}),n=p.item);let c=[],d=[],u;for(let p of i){if(p.kind==="status"){let g=p.item.group.slice(p.item.group.indexOf(">")+1);no.has(g)?u??=p.item.at:u=void 0}let _=c[c.length-1];if(!d.length&&_&&_o.has(p.kind)&&Tt(p.item.at)-Tt(_.end)<=go){_.items.push(p.item);continue}d.push(p.item),p.ends&&(c.push({start:d[0].at,end:p.item.at,closed:!0,items:d,endType:p.type,since:_?.end,dueAt:u}),d=[])}d.length&&c.push({start:d[0].at,end:d[d.length-1].at,closed:!1,items:d,since:c[c.length-1]?.end,dueAt:u});for(let p of c)p.items=fo(p.items);return c}function bo(r){return r.items.flatMap(l=>l.repeats??[l]).filter(l=>l.group.startsWith("status:"))}function Ur(r,l){return r.items.flatMap(t=>t.repeats??[t]).filter(t=>t.group.startsWith(l)).length}function tn(r,l,t=Date.now()){let e=l,i=bo(r),s=_=>_.slice(_.indexOf(">")+1),n=r.dueAt,c=[];if(r.closed){if(r.endType==="completed"){let _=n?Tt(r.end)-Tt(n):0;n&&_>=6e4?c.push(Gt(a("beta_trace_after_due",e),{span:Se(_,e)})):i.some(g=>s(g.group)==="due_soon")&&c.push(a("beta_trace_before_due",e))}r.since&&c.push(Gt(a("beta_trace_cycle_length",e),{span:Se(Tt(r.end)-Tt(r.since),e)}))}else n&&c.push(Gt(a("beta_trace_due_for",e),{span:Se(t-Tt(n),e)}));let d=Ur(r,"reminder:");d&&c.push(_t("beta_trace_reminders","beta_trace_reminders_one",d,e));let u=Ur(r,"snoozed:");if(u&&c.push(_t("beta_trace_snoozes","beta_trace_snoozes_one",u,e)),!r.closed)return{text:a("beta_trace_running",e),icon:"mdi:progress-clock",tone:"info",facts:c};let p=r.endType??"completed";return{text:`${a(p,e)} \xB7 ${wt(r.end,e)}`,icon:Vr[p]??"mdi:check-circle",tone:"done",facts:c}}var vo="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",yo="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z",xo="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z",wo=60*6e4,ko=15*6e4,$o=6e4,pt=class extends L{constructor(){super(...arguments);this.entryId="";this.taskId="";this.task=null;this.currencySymbol="\u20AC";this.taskRef=null;this.userName=()=>null;this._enabled=!0;this._cycles=null;this._index=-1;this._sel=-1;this._failed=!1;this._raw=null;this._activity=new Map;this._loadedFor=""}updated(){let t=`${this.entryId}/${this.taskId}`;this.hass&&this.entryId&&this.taskId&&t!==this._loadedFor&&(this._loadedFor=t,this._load())}async _load(){this._cycles=null,this._failed=!1,this._index=-1,this._sel=-1,this._raw=null,this._activity=new Map;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/trace",entry_id:this.entryId,task_id:this.taskId});this._raw=t??{},this._enabled=t?.enabled!==!1,this._cycles=Zr(t?.events??[],t?.history??[],N(this.hass),{triggerUnit:Zt(this.hass,this.task)||void 0})}catch{this._failed=!0,this._cycles=[]}}_current(){let t=this._cycles??[];if(!t.length)return{cycle:null,index:-1};let e=this._index<0||this._index>=t.length?t.length-1:this._index;return{cycle:t[e],index:e}}_step(t){let{index:e}=this._current(),i=e+t;this._cycles&&i>=0&&i<this._cycles.length&&(this._index=i,this._sel=-1)}render(){let t=N(this.hass);if(this._cycles===null)return o`<div class="trace-note">…</div>`;let{cycle:e,index:i}=this._current(),s=this._cycles.length,n=e?`${wt(e.start,t)} \u2013 ${e.closed?wt(e.end,t):a("beta_trace_current",t)}`:a("beta_trace_current",t);return o`
      ${this._enabled?h:o`<div class="trace-note trace-off">${a("beta_trace_off",t)}</div>`}
      ${this._failed?o`<div class="trace-note">${a("beta_trace_load_failed",t)}</div>`:h}
      <div class="trace-cycles">
        <ha-icon-button class="trace-older" .path=${vo} .label=${a("beta_trace_older",t)} .disabled=${i<=0}
          @click=${()=>this._step(-1)}></ha-icon-button>
        <span class="trace-cycle-label">${n}</span>
        <ha-icon-button class="trace-newer" .path=${yo} .label=${a("beta_trace_newer",t)} .disabled=${i<0||i>=s-1}
          @click=${()=>this._step(1)}></ha-icon-button>
        <ha-icon-button class="trace-download" .path=${xo} .label=${a("beta_trace_download",t)} .disabled=${!this._raw}
          @click=${()=>this._download()}></ha-icon-button>
      </div>
      ${!e||!e.items.length?o`<div class="trace-note">${a("beta_trace_empty",t)}</div>`:o`
          ${this._renderResult(e,t)}
          <ol class="trace-steps" aria-label=${a("beta_trace",t)}>
            ${e.items.map((c,d)=>this._renderStep(c,d,e.items[d+1],`${i}:${d}`,t))}
          </ol>`}
    `}_renderResult(t,e){let i=tn(t,e);return o`
      <div class="trace-result ${i.tone}">
        <ha-icon icon=${i.icon}></ha-icon>
        <span class="trace-result-text">${i.text}</span>
        ${i.facts.map(s=>o`<span class="trace-fact">${s}</span>`)}
      </div>`}_renderStep(t,e,i,s,n){let c=this._sel===e,d=t.repeats?.length??0,u=d?t.repeats[d-1]:t,p=t.gapMs!=null&&t.gapMs>=$o?a("beta_trace_later",n).replace("{span}",Se(t.gapMs,n)):"";return o`
      <li class="trace-item ${t.tone} ${i?.tone==="skipped"?"next-skipped":""}">
        <button type="button" class="trace-step ${t.tone} ${c?"selected":""}" aria-expanded=${c?"true":"false"}
          @click=${()=>this._toggle(t,e,s)}>
          <span class="trace-node ${t.tone}"><ha-icon icon=${t.icon}></ha-icon></span>
          <span class="trace-main">
            <span class="trace-time">
              ${wt(t.at,n)}${d?o` – ${wt(u.at,n)}`:h}
              ${p?o`<span class="trace-gap">${p}</span>`:h}
            </span>
            <span class="trace-text">${d?t.foldText??t.text:t.text}${d?o` <span class="trace-count">×${d}</span>`:h}</span>
          </span>
          <ha-icon class="trace-chevron" icon=${c?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        ${c?this._renderDetails(t,s,n):h}
      </li>`}_toggle(t,e,i){if(this._sel===e){this._sel=-1;return}this._sel=e;let s=this._watched(t);s.length&&!this._activity.has(i)&&this._loadActivity(i,t,s)}_watched(t){let e=this.task;return t.watch==="rule"&&e?.trigger_config?[...new Set(fe(e.trigger_config).map(i=>i.entityId))]:t.watch==="done_when"&&e?.complete_when?.entity_id?[e.complete_when.entity_id]:[]}async _loadActivity(t,e,i){this._activity=new Map(this._activity).set(t,"loading");let s=Date.parse((e.repeats?e.repeats[e.repeats.length-1]:e).at),n;try{let c=await this.hass.connection.sendMessagePromise({type:"history/history_during_period",start_time:new Date(s-wo).toISOString(),end_time:new Date(s+ko).toISOString(),entity_ids:i,minimal_response:!0,no_attributes:!0,significant_changes_only:!1});n=Qr(c,s)}catch{n="failed"}this._activity=new Map(this._activity).set(t,n)}_download(){if(!this._raw)return;let{history:t,...e}=this.task??{},i=(this.task?.name||this.taskId).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"task",s={exported_at:new Date().toISOString(),entry_id:this.entryId,task_id:this.taskId,task:e,...this._raw};De(JSON.stringify(s,null,2),`trace-${i}-${mt()}.json`,"application/json")}_changeContext(t){return{lang:t,entityName:e=>ge(this.hass,e),userName:this.userName,unit:Zt(this.hass,this.task)||void 0}}_renderActivity(t,e){let i=this._activity.get(t);return i===void 0?h:o`
      <div class="trace-activity">
        <div class="trace-activity-title">${a("beta_trace_activity",e)}</div>
        ${i==="loading"?o`<div class="trace-activity-none">…</div>`:i==="failed"||!i.length?o`<div class="trace-activity-none">${a("beta_trace_activity_none",e)}</div>`:o`<ol class="trace-repeats">
                ${i.map(s=>o`<li><span class="trace-time">${wt(new Date(s.at).toISOString(),e,!0)}</span><span>${ge(this.hass,s.entityId)}: ${this._stateText(s,e)}</span></li>`)}
              </ol>`}
      </div>`}_stateText(t,e){let i=Number(t.state);if(t.state===""||!Number.isFinite(i))return t.state;let s=this.hass?.states?.[t.entityId]?.attributes?.unit_of_measurement;return`${W(i,e,{maximumFractionDigits:3})}${typeof s=="string"&&s?` ${s}`:""}`}_renderDetails(t,e,i){let s=[{label:a("history_edit_timestamp",i),value:wt(t.at,i,!0)}];if(!t.repeats){s.push(...t.details,...Yr(t.changes,this._changeContext(i)));let n=t.history?Xr(t.history,this.userName,i):null;n&&s.push(n)}return o`
      <div class="trace-details" role="region" aria-label=${a("task_section_details",i)}>
        <dl class="trace-facts">
          ${s.map(n=>o`<dt>${n.label}</dt><dd>${n.value}</dd>`)}
        </dl>
        ${t.repeats?o`<ol class="trace-repeats">
              ${t.repeats.map(n=>o`<li><span class="trace-time">${wt(n.at,i,!0)}</span><span>${n.text}</span></li>`)}
            </ol>`:t.history?yi(Jr(t.history),{lang:i,hass:this.hass,currencySymbol:this.currencySymbol,taskRef:this.taskRef,triggerUnit:Zt(this.hass,this.task)||null},{compact:!0,showEdit:!1,showHead:!1}):h}
        ${this._renderActivity(e,i)}
      </div>`}};pt.styles=[ue,H`
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
  `],m([j({attribute:!1})],pt.prototype,"hass",2),m([j({attribute:!1})],pt.prototype,"entryId",2),m([j({attribute:!1})],pt.prototype,"taskId",2),m([j({attribute:!1})],pt.prototype,"task",2),m([j({attribute:!1})],pt.prototype,"currencySymbol",2),m([j({attribute:!1})],pt.prototype,"taskRef",2),m([j({attribute:!1})],pt.prototype,"userName",2),m([f()],pt.prototype,"_enabled",2),m([f()],pt.prototype,"_cycles",2),m([f()],pt.prototype,"_index",2),m([f()],pt.prototype,"_sel",2),m([f()],pt.prototype,"_failed",2),m([f()],pt.prototype,"_activity",2);customElements.get("maintenance-task-trace")||customElements.define("maintenance-task-trace",pt);function Ii(r,l,t,e=h){let i=r.filter(s=>!!s);return si("ha-tab-group")?o`
      <div class="tab-bar ha-tabs">
        <ha-tab-group without-scroll-controls .active=${l} @wa-tab-show=${s=>{let n=i.find(c=>c.key===s.detail?.name)?.key;n&&n!==l&&t(n)}}>
          ${i.map(s=>o`<ha-tab-group-tab slot="nav" panel=${s.key} class=${s.cls??h} .active=${s.key===l}>${s.label}</ha-tab-group-tab>`)}
        </ha-tab-group>
        ${e}
      </div>`:o`
    <div class="tab-bar">
      ${i.map(s=>o`
        <div class="tab${s.cls?" "+s.cls:""} ${s.key===l?"active":""}" @click=${()=>t(s.key)}>
          ${s.label}
        </div>`)}
      ${e}
    </div>`}function $s(r,l,t){let e=Ft(r);if(e.length===0)return h;let i=e.map(n=>t?.(n)??null);if(i.every(n=>n!==null))return o`<span class="user-badge">${Sa(i)}${i.map(n=>n.name).join(", ")}</span>`;let s=e.map(n=>l(n)).filter(Boolean).join(", ");return s?o`
    <span class="user-badge">
      <ha-icon icon="mdi:account"></ha-icon>
      ${s}
    </span>
  `:h}function To(r,l,t){let e=a("complete_when_badge",t).replace("{entity}",l).replace("{state}",r.to_state);return r.for_minutes&&(e+=` ${a("complete_when_badge_for",t).replace("{minutes}",String(r.for_minutes))}`),r.any_time&&(e+=`, ${a("complete_when_badge_any_time",t)}`),e}var en="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z";function sn(r,l,t){let e=!l.isOperator;return[e&&{label:a("edit",t),action:()=>l.openEdit(r)},re(r)&&{label:a("complete_with_details",t),cls:"complete-details",action:()=>l.openComplete(r,{details:!0})},{label:a("qr_code",t),action:()=>l.openQr(r.name)},{label:a("worksheet",t),action:()=>l.printWorksheet()},l.features.adaptive&&r.adaptive_config?.enabled&&{label:a("reanalyze",t),cls:"reanalyze",action:()=>l.reanalyze()},e&&{label:a("duplicate",t),action:()=>l.duplicateTask()},e&&{label:a("move_task",t),action:()=>l.moveTask()},{label:a("reset",t),action:()=>l.promptReset()},{label:`${a("postpone",t)}\u2026`,action:()=>l.promptPostpone()},{label:a("snooze",t),action:()=>l.snoozeTask()},e&&!r.archived&&{label:r.paused?a("resume_task",t):`${a("pause_task",t)}\u2026`,action:()=>l.togglePause(!!r.paused)},e&&{label:r.archived?a("unarchive",t):a("archive",t),action:()=>l.toggleArchive(!!r.archived)},e&&"divider",e&&{label:a("delete",t),danger:!0,action:()=>l.deleteTask()}]}function So(r,l){let t=l.lang,e=l.isOperator;return o`
    <div class="task-header">
      <div class="task-header-title">
        <span class="task-name-breadcrumb" @click=${()=>l.showTaskView()}>${r.name}${we(r.next_event_titles)}${ke(r.trigger_detail)}</span>
        ${de(l.taskRef??null,a("ref_number",t))}
        <span class="breadcrumb-separator">·</span>
        <span class="object-name-breadcrumb" @click=${()=>l.showObject()}>${l.objectName}</span>
        ${xi(r,t,"chip")}
        ${r.paused&&r.paused_until?o`<span class="postponed-badge paused-until" title="${a("task_paused",t)}">
          <ha-icon icon="mdi:pause-circle-outline"></ha-icon>${a("paused_until_label",t)} ${U(r.paused_until,t)}
        </span>`:h}
        ${r.due_override?o`<span class="postponed-badge" title="${a("postponed_to",t)}">
          <ha-icon icon="mdi:calendar-arrow-right"></ha-icon>${U(r.due_override,t)}
        </span>`:h}
        ${$s(r,l.getUserName,l.getPerson)}
        ${r.notify_enabled===!1?o`<span class="nfc-badge muted-badge" title="${a("no_notifications",t)}"><ha-icon icon="mdi:bell-off-outline"></ha-icon></span>`:h}
        ${Io(r,l,t)}
        ${r.complete_when?.entity_id?o`<span class="nfc-badge complete-when-badge" title="${To(r.complete_when,ge(l.hass,r.complete_when.entity_id),t)}"><ha-icon icon="mdi:check-circle-outline"></ha-icon></span>`:h}
        ${re(r)?o`<span class="nfc-badge quick-complete-badge" title="${a("quick_complete_help",t)}"><ha-icon icon="mdi:flash-outline"></ha-icon> ${a("quick_complete_label",t)}</span>`:h}
        ${r.nfc_tag_id?o`<span class="nfc-badge" title="${a("nfc_tag_id",t)}: ${r.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>`:e?h:o`<span class="nfc-badge unlinked" title="${a("nfc_link_hint",t)}"
              @click=${()=>l.openEdit(r)}>
              <ha-icon icon="mdi:nfc-variant"></ha-icon>
            </span>`}
      </div>
      <div class="task-header-actions">
        <ha-button appearance="accent" variant="success" @click=${()=>l.openComplete(r)}>${a("complete",t)}</ha-button>
        ${r.allow_skip!==!1?o`<ha-button appearance="outlined" variant="warning" .disabled=${l.actionLoading} @click=${()=>l.promptSkip()}>${a("skip",t)}</ha-button>`:h}
        <div class="more-menu-wrapper">
          ${ie()?Ut(o`<ha-icon-button slot="trigger" .disabled=${l.actionLoading} .label=${a("more_actions",t)} .path=${en}></ha-icon-button>`,sn(r,l,t)):o`<ha-icon-button .disabled=${l.actionLoading} .label=${a("more_actions",t)} .path=${en} @click=${()=>l.toggleMoreMenu()}></ha-icon-button>
              ${l.moreMenuOpen?ne(sn(r,l,t),()=>l.closeMoreMenu()):h}`}
        </div>
      </div>
    </div>
  `}function jo(r){let l=r.lang;return Ii([{key:"overview",label:a("overview",l)},{key:"history",label:a("history",l)},r.features.beta_editor&&{key:"trace",label:a("beta_trace",l),cls:"trace-tab"}],r.activeTab,t=>r.setActiveTab(t))}function an(r,l,t,e){let i=e.collapsedSections.has(r);return o`
    <div class="collapsible ${i?"collapsed":""}">
      <button class="collapsible-head" @click=${()=>e.toggleSection(r)}
        aria-expanded=${i?"false":"true"}>
        <ha-icon icon="${i?"mdi:chevron-right":"mdi:chevron-down"}"></ha-icon>
        <span>${a(l,e.lang)}</span>
      </button>
      ${i?h:o`<div class="collapsible-body">${t}</div>`}
    </div>
  `}function Eo(r,l){if(!_a(r))return h;let t=l.lang,e=r.phase_sequence,i=ma(r.phase_cursor,e.length),s=new Map;for(let n=r.history.length-1;n>=0;n--){let c=r.history[n];c.phase_id&&c.type==="completed"&&!s.has(c.phase_id)&&s.set(c.phase_id,c.timestamp)}return o`
    <div class="phases-card">
      <div class="phases-card-header">
        <ha-icon icon="mdi:rotate-right"></ha-icon>
        <span>${a("phase_sequence_label",t)}</span>
      </div>
      <div class="phases-strip">
        ${e.map((n,c)=>{let d=r.phases?.[n]?.name||n,u=s.get(n);return o`
            <div class="phase-step ${c===i?"current":""}"
              title=${c===i?a("phase_current",t):a("phase_set",t)}
              @click=${()=>{c!==i&&l.setPhaseCursor(c)}}>
              <span class="phase-step-name">${c+1}. ${d}</span>
              ${u?o`<span class="phase-step-last">${U(u,t)}</span>`:h}
            </div>
          `})}
      </div>
    </div>
  `}function Ro(r,l){if(!l.features.checklists)return h;let t=oi(r)?.checklist??(r.checklist||[]);if(t.length===0)return h;let e=l.lang,i=r.checklist_progress||{},s=t.filter(n=>i[n]).length;return o`
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
                @change=${c=>l.setChecklistItem(n,c.target.checked)}
              />
              <span>${n}</span>
            </label>
          </li>
        `)}
      </ol>
    </div>
  `}function Co(r,l){let t=ct(r.documentation_url)?r.documentation_url:null,e=ct(l.objectDocUrl)?l.objectDocUrl:null,i=e?null:(l.objectManualDocs||[])[0];if(!r.notes&&!t&&!e&&!i)return h;let s=l.lang;return o`
    <div class="task-meta-card">
      ${r.notes?o`
        <div class="task-meta-row">
          <ha-icon icon="mdi:note-text-outline"></ha-icon>
          <span class="task-meta-notes">${ni(r.notes)}</span>
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
          <a href="${e}" target="_blank" rel="noopener noreferrer">${a("documentation_url_label",s)} (${l.objectName})</a>
        </div>
      `:i?o`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="#" title=${i.title}
            @click=${n=>{n.preventDefault(),l.openManualDoc(i)}}
            >${a("documentation_url_label",s)} (${l.objectName})</a>
        </div>
      `:h}
    </div>
  `}function Oo(r,l){let t=l.lang,e=r.average_cost!==void 0?r.average_cost:r.times_performed>0?r.total_cost/r.times_performed:null,i=r.trigger_config,s=r.next_due==null&&i?.type==="due_date"&&r.trigger_current_value!=null,n=s?new Date(Date.now()+r.trigger_current_value*864e5).toISOString():r.next_due,c=s?qe(r.trigger_current_value):r.days_until_due,d=s?i?.trigger_days_before??0:r.warning_days,u=c!=null?c<0?"overdue":c<=d?"warning":"":"";return o`
    <div class="kpi-bar">
      <div class="kpi-card">
        <div class="kpi-label">${a("next_due",t)}</div>
        <div class="kpi-value">${n?U(n,t):"\u2014"}</div>
        ${s?o`<div class="kpi-subtext">${a("kpi_reported_by_sensor",t)}</div>`:l.features.schedule_time&&r.schedule_time?o`<div class="kpi-subtext">${a("at_time",t)} ${r.schedule_time}</div>`:h}
      </div>
      <div class="kpi-card ${u}">
        <div class="kpi-label">${a("days_until_due",t)}</div>
        <div class="kpi-value-large">${c??"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("interval",t)}</div>
        <div class="kpi-value">${Ht(r,t)}</div>
        ${l.features.adaptive&&r.suggested_interval&&r.suggested_interval!==r.interval_days?o`
          <div class="kpi-subtext">${a("recommended",t)}: ${r.suggested_interval}${r.interval_analysis?.confidence_interval_low!=null?` (${r.interval_analysis.confidence_interval_low}\u2013${r.interval_analysis.confidence_interval_high})`:""}</div>
        `:h}
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("warning",t)}</div>
        <div class="kpi-value">${Ze(r.warning_days,t)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("last_performed",t)}</div>
        <div class="kpi-value">${r.last_performed?U(r.last_performed,t):"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("avg_cost",t)}</div>
        <div class="kpi-value">${e!=null?Y(e,l.currencySymbol,t):"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("avg_duration",t)}</div>
        <div class="kpi-value">${r.average_duration?Ae(Math.round(r.average_duration),t):"\u2014"}</div>
      </div>
    </div>
  `}function Mo(r,l){let t=l.lang;if(!l.features.adaptive||!r.suggested_interval||r.suggested_interval===r.interval_days)return h;if(l.suggestionDismissed)return h;let e=r.suggested_interval;return o`
    <div class="recommendation-card">
      <h4>${a("suggested_interval",t)}</h4>
      ${er(r.interval_days,e,r.interval_confidence||"medium",t)}
      <div class="recommendation-actions">
        ${l.isOperator?h:o`<ha-button appearance="filled" class="apply-suggestion"
              @click=${()=>l.applySuggestion(e)}>
              ${a("apply_suggestion",t)}
            </ha-button>`}
        <ha-button appearance="plain"
          @click=${()=>l.reanalyze()}>
          ${a("reanalyze",t)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${()=>l.dismissSuggestion()}>
          ${a("dismiss_suggestion",t)}
        </ha-button>
      </div>
    </div>
  `}function Ao(r,l){let t=l.lang,e=Ka(r.history).slice(0,3);return e.length===0?h:o`
    <div class="recent-activities">
      <h3>${a("recent_activities",t)}</h3>
      ${e.map(i=>yi(i,l.history,{compact:!0,showEdit:!1}))}
      <div class="activity-show-all">
        <ha-button appearance="plain" @click=${()=>l.setActiveTab("history")}>${a("show_all",t)} →</ha-button>
      </div>
    </div>
  `}function rn(r,l){let t=l.lang,e=l.features.adaptive&&r.suggested_interval&&r.suggested_interval!==r.interval_days,i=l.features.seasonal&&r.seasonal_factor&&r.seasonal_factor!==1,s=e||i,n=l.features.adaptive&&r.interval_analysis?.weibull_beta!=null&&r.interval_analysis?.weibull_eta!=null,c=l.features.seasonal&&(r.seasonal_factors?.length===12||r.interval_analysis?.seasonal_factors?.length===12);return o`
    <div class="tab-content overview-tab">
      ${r.battery_fleet_task?o`<maintenance-battery-fleet-section .hass=${l.hass}></maintenance-battery-fleet-section>`:h}
      ${Oo(r,l)}
      ${Co(r,l)}
      ${r.battery_fleet_task?h:o`
            ${Or(r,l.lang)}
            ${Dr(r,l.sparkline)}
            ${tr(r,t,l.features)}
          `}
      <div class="two-column-layout ${s?"":"single-column"}">
        ${s?o`
          <div class="left-column">
            ${Mo(r,l)}
            ${ir(r,t,l.features)}
          </div>
        `:h}
        <div class="right-column">
          ${Br(r,t,l.costDurationToggle,d=>l.setCostDurationToggle(d),l.currencySymbol)}
        </div>
      </div>
      ${n?an("weibull","weibull_reliability_curve",Za(r,t),l):h}
      ${c?an("seasonal","seasonal_chart_title",o`
            ${sr(r,t)}
            <div class="seasonal-actions">
              <ha-button appearance="plain" @click=${()=>l.openSeasonalOverrides(r)}>
                ${a("edit_seasonal_overrides",t)}
              </ha-button>
            </div>
          `,l):h}
      ${Eo(r,l)}
      ${Ro(r,l)}
      ${Ao(r,l)}
    </div>
  `}function Do(r,l){return o`
    <div class="tab-content history-tab">
      <div class="history-add-past">
        <ha-button appearance="plain" class="history-add-past-btn" @click=${()=>l.openComplete(r,{details:!0})}>
          <ha-icon icon="mdi:calendar-plus"></ha-icon>
          ${a("history_add_past",l.lang)}
        </ha-button>
      </div>
      ${Ya(r,l.history)}
      ${Qa(r,l.history)}
    </div>
  `}function Po(r,l){switch(l.activeTab){case"overview":return rn(r,l);case"history":return Do(r,l);case"trace":return l.features.beta_editor?o`<div class="tab-content trace-tab-content">
            <maintenance-task-trace .hass=${l.hass} .entryId=${l.entryId} .taskId=${l.taskId} .task=${r}
              .currencySymbol=${l.currencySymbol} .taskRef=${l.taskRef??null} .userName=${l.getUserName}></maintenance-task-trace>
          </div>`:rn(r,l);default:return h}}function Io(r,l,t){let e=r.mirror_todo_entities??[],i=e.length?e:r.mirror_todo_use_default===!1?[]:l.mirrorTodoDefault??[];if(!i.length)return h;let s=i.map(c=>ge(l.hass,c)).join(", "),n=e.length?`${a("task_mirror_todo",t)}: ${s}`:a("task_mirror_todo_default",t).replace("{lists}",s);return o`<span class="nfc-badge mirror-badge ${e.length?"":"inherited"}" title=${n}><ha-icon icon="mdi:clipboard-list-outline"></ha-icon></span>`}function nn(r,l){return o`
    <div class="detail-section">
      ${So(r,l)}
      ${jo(l)}
      ${Po(r,l)}
      <maintenance-task-documents
        .hass=${l.hass}
        .entryId=${l.entryId}
        .taskId=${l.taskId}
        .canWrite=${!l.isOperator}
      ></maintenance-task-documents>
    </div>
  `}var Ue=class extends L{createRenderRoot(){return this}render(){return!this.task||!this.ctx?h:o`${nn(this.task,this.ctx)}`}};m([j({attribute:!1})],Ue.prototype,"task",2),m([j({attribute:!1})],Ue.prototype,"ctx",2);customElements.get("maintenance-task-detail-view")||customElements.define("maintenance-task-detail-view",Ue);function on(r,l,t){let e=0,i=l-1;for(;e<i;){let s=e+i+1>>1;t(s)<=r?e=s:i=s-1}return e}function Ts(r){if(r.total<=0)return{start:0,end:0,padTop:0,padBottom:0};let l=r.overscan??12,t=Math.max(1,r.step??6),e=Math.max(1,r.rowHeight??53),i=r.offsets,s=i?_=>i[_]:_=>_*e,n=r.scrollTop-r.listTop,c=on(n,r.total,s),d=on(n+r.viewportHeight,r.total,s),u=Math.max(0,c-l);u=Math.floor(u/t)*t;let p=Math.min(r.total,d+1+l);return p=Math.min(r.total,Math.ceil(p/t)*t),{start:u,end:p,padTop:s(u),padBottom:s(r.total)-s(p)}}function ln(r){if(r.total<=0)return[0,0];let l=r.offsets[r.total],t=(r.overscan??12)*(l/r.total);if(r.listTop+l<r.scrollTop-t||r.listTop>r.scrollTop+r.viewportHeight+t)return[0,0];let e=Ts(r);return[e.start,e.end]}var Ve=class{constructor(){this._heights=new Map;this._sum=0;this._width=-1}setWidth(l){Math.abs(l-this._width)<1||(this._width=l,this._heights.clear(),this._sum=0)}record(l,t){if(!(t>0))return;let e=this._heights.get(l);e!==t&&(this._sum+=t-(e??0),this._heights.set(l,t))}get estimate(){return this._heights.size?this._sum/this._heights.size:53}offsets(l){let t=this.estimate,e=new Float64Array(l.length+1);for(let i=0;i<l.length;i++)e[i+1]=e[i]+(this._heights.get(l[i])??t);return e}};var zi={mode:"top",marginTop:0,lastScrollTop:0};function cn(r,l){return r==="top"?8:l.viewH-l.paneH-8}function dn(r){let l=r.scrollTop+8-r.layoutTop,t=Math.max(0,r.listH-r.paneH);return{mode:"top",marginTop:l>t?Math.max(0,l):0,lastScrollTop:r.scrollTop}}function pn(r,l){let t=l.scrollTop,e=l.scrollTop>r.lastScrollTop?"down":l.scrollTop<r.lastScrollTop?"up":"none",i=Math.max(0,l.listH-l.paneH),s=l.paneH+16<=l.viewH||l.listH<=l.paneH,{mode:n,marginTop:c}=r;if(s&&(n="top"),n==="top"&&c>0&&e==="up")c=Math.max(0,Math.min(c,l.scrollTop+8-l.layoutTop)),c<=i&&(c=0);else if(!s&&e==="down"&&n==="top"){let d=l.renderedTop-l.layoutTop;d<=i&&(n="bottom",c=Math.max(0,d))}else!s&&e==="up"&&n==="bottom"&&(c=Math.min(Math.max(0,l.renderedTop-l.layoutTop),i),l.scrollTop+8<=l.layoutTop+c&&(n="top",c=0));return{mode:n,marginTop:c,lastScrollTop:t}}function hn(r,l,t){let e=Math.min(100,Math.max(0,r/l*100)),i=t??80;return{pct:e,level:e>=100?"danger":e>=i?"warning":"ok"}}var Hi=2,Bo=250,No=150,le={objects:6,tasks:10,parts:6,documents:8,history:6},qo="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z",Li=["due_date","object","type","task_name","area","assigned_user","group"],Ss=["none","area","group","user","object"],js=Gs,mn=["children","tasks","documents","parts","history"],Es=r=>`${r.entry_id}/${r.task_id}`,Rs=(r,l)=>`${a("documents",l)}: ${W(r,l)}`,_n="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",S=class extends L{constructor(){super(...arguments);this.narrow=!1;this.tight=!1;this.split=!1;this.wide=!1;this._tightObserver=null;this.panel={};this.embedded=!1;this.presets={};this._presetsApplied=!1;this._mountPath=null;this._objects=[];this._stats=null;this._view="overview";this._allParts=null;this._selectedEntryId=null;this._selectedTaskId=null;this._selectedAreaId=null;this._filterStatus="";this._filterUser=null;this._filterLabel=null;this._filterPlace="";this._filterPriority="";this._savedViews=[];this._activeViewId="";this._unsub=null;this._chartRangeDays=(()=>{try{let t=parseInt(J(P.chartRange)||"",10);return[7,30,90,365].includes(t)?t:30}catch{return 30}})();this._hideOutliers=(()=>{try{return J(P.chartHideOutliers)==="1"}catch{return!1}})();this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1,beta_editor:!1};this._adminPanelUserIds=[];this._operatorWriteEnabled=!1;this._defaultWarningDays=7;this._mirrorTodoDefault=[];this._rowActionStyle="buttons_compact";this._refsInLists=!1;this._partsCostMode="purchase";this._rowActionNotice=!1;this._actionLoading=!1;this._moreMenuOpen=!1;this._objMenuOpen=!1;this._subObjMenu=null;this._toastMessage="";this._toastKind="error";this._toastUndo=null;this._toastActionLabel="";this._filtersOpen=!1;this._listSearch="";this._listSearchDraft="";this._listSearchTimer=0;this._filterPaneOpen=J(P.filterPane)==="1";this._paneSections=new Set(["status"]);this._newMenuOpen=!1;this._gsSetupsCount=0;this._gsAdoptCount=0;this._gsLoaded=!1;this._resetOffersLoaded=!1;this._resetOffersCount=0;this._batteryFleetSetupAvailable=!1;this._staleBundle=!1;this._restartPendingVersion=null;this._staleChecked=!1;this._onReconnect=()=>this._checkServerVersion();this._toastTimer=null;this._dismissedSuggestions=new Set;this._overviewTab=(()=>{try{let t=J(P.overviewTab);return t==="today"||t==="calendar"?t:"dashboard"}catch{return"dashboard"}})();this._activeTab="overview";this._costDurationToggle="both";this._historySearch="";this._sortMode="due_date";this._objectSortMode="alphabetical";this._objTableSort=null;this._groupByMode="none";this._objectViewMode="cards";this._objectsTableColumns=pa;this._showArchived=!1;this._bulkMode=!1;this._bulkSelected=new Set;this._objBulkMode=!1;this._objBulkSelected=new Set;this._bulkMenuOpen=!1;this._virtStart=0;this._virtEnd=0;this._virtHeights=new Ve;this._virtKeys=[];this._virtRenderedStart=0;this._virtPasses=0;this._virtTotalRows=0;this._virtScrollAttached=!1;this._virtRaf=0;this._virtGroups=[];this._virtGroupDrawn=[];this._virtGroupWin=new Map;this._virtGroupHeights=new Ve;this._virtGroupSig="";this._listScroll=new Map;this._restoreListScroll=!1;this._contentScrollTop=0;this._viewEntry=0;this._stickyState=zi;this._stickySelectPending=!1;this._stickyRaf=0;this._stickyAttached=!1;this._stickyObserver=null;this._collapsedGroups=new Set;this._collapsedSections=(()=>{try{return new Set(JSON.parse(J(P.collapsedSections)||"[]"))}catch{return new Set}})();this._objectSectionsCollapsed=(()=>{try{let t=JSON.parse(J(P.objectSections)||"[]");return new Set((Array.isArray(t)?t:[]).filter(e=>mn.includes(e)))}catch{return new Set}})();this._objectSectionOverride=null;this._objTreeOpen=(()=>{try{let t=JSON.parse(J(P.objectTreeOpen)||"[]");return new Set((Array.isArray(t)?t:[]).filter(e=>typeof e=="string"))}catch{return new Set}})();this._paletteOpen=!1;this._paletteQuery="";this._paletteActive=0;this._searchRemote=null;this._searchTimer=null;this._searchSeq=0;this._templateGalleryOpen=!1;this._templates=[];this._homeProfile=null;this._templateCategories={};this._templateBusy=!1;this._templateParentId=null;this._templatePreview=null;this._templatePicked=new Set;this._statsService=null;this._userService=null;this._usersVersion=0;this._rowsMemo=new Map;this._rowsMemoInputs=[];this._rowsGeneration=0;this._virtRenderedSig="";this._virtMeasuredSig="";this._hassHeld=null;this._hassTimer=0;this._lastRender=0;this._dataLoaded=!1;this._lastConnection=null;this._popstateHandler=t=>this._onPopState(t);this._locationChangedHandler=()=>this._onLocationChanged();this._lazyUi=null;this._warmedUp=!1;this._warmPending=!1;this._onStickyScroll=()=>{this._stickyRaf||(this._stickyRaf=requestAnimationFrame(()=>{this._stickyRaf=0,this._updateStickyPane()}))};this._onVirtualScroll=t=>{t?.currentTarget instanceof HTMLElement&&(this._contentScrollTop=t.currentTarget.scrollTop),this._virtPasses=0,this._scheduleVirtualWindow()};this._deepLinkHandled=!1;this._reloadState=null;this._deepLinkInPlace=!1;this._initialLoadDone=!1;this._detailStatsSeq=new Map;this._subGen=0;this._kpiRefreshInFlight=!1;this._kpiRefreshPending=!1;this._areaUi=null;this._paletteKeydown=t=>{if(t.key==="/"&&!t.ctrlKey&&!t.metaKey&&!t.altKey&&!this._paletteOpen){let i=t.composedPath()[0];if(i instanceof HTMLElement&&(i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.tagName==="SELECT"||i.isContentEditable))return;t.preventDefault(),this._openPalette();return}if(!this._paletteOpen)return;let e=this._paletteResults;if(t.key==="Escape")t.preventDefault(),this._closePalette();else if(t.key==="ArrowDown")t.preventDefault(),this._paletteActive=Math.min(this._paletteActive+1,e.length-1);else if(t.key==="ArrowUp")t.preventDefault(),this._paletteActive=Math.max(this._paletteActive-1,0);else if(t.key==="Enter"){t.preventDefault();let i=e[this._paletteActive];i&&this._selectPaletteResult(i)}};this._onObjectReplaced=async t=>{this._showToast([a("object_replaced",this._lang),this._deviceSwapText(t.detail.device_swap)].filter(Boolean).join(" \xB7 "),"info");try{await this._loadData()}catch{}t.detail.entry_id&&this._showObject(t.detail.entry_id)};this._onObjectSaved=async t=>{let e=this._deviceSwapText(t.detail?.device_swap);e&&this._showToast(e,"info"),await this._onDialogEvent()};this._checklistPending=new Map;this._checklistChain=Promise.resolve();this._onDialogEvent=async()=>{try{await this._loadData()}catch{}};this._onTaskCompleted=async t=>{await this._onDialogEvent();let e=t.detail;e?.undo&&this._offerUndo(e.entryId,e.taskId,a("task_completed_named",this._lang).replace("{task}",e.taskName))};this._onCalendarOpenTask=t=>{let e=t.detail;e?.entry_id&&e.task_id&&(t.preventDefault(),t.stopPropagation(),this._showTask(e.entry_id,e.task_id))};this._onCalendarLlCustom=t=>{let e=t.detail;e?.type==="maintenance-supporter:open-task"&&e.entry_id&&e.task_id&&(t.stopPropagation(),this._showTask(e.entry_id,e.task_id))};this._popupClosers=new Map;this._fullHistory=null;this._onHistoryEntrySaved=async()=>{await this._loadData()}}get _currencySymbol(){return Je(this._budget)}get _lang(){return N(this.hass)}get _isOperator(){return!ye(this.hass?.user,{operatorWriteEnabled:this._operatorWriteEnabled,operatorIds:this._adminPanelUserIds})}_ensureLazyUi(){return this._lazyUi||(this._lazyUi=Promise.all([import("/maintenance_supporter_panelfiles/panel-chunks/object-dialog-LWH336R4.js"),import("/maintenance_supporter_panelfiles/panel-chunks/task-dialog-A6FQFLPJ.js"),import("/maintenance_supporter_panelfiles/panel-chunks/complete-dialog-XDV2A523.js"),import("/maintenance_supporter_panelfiles/panel-chunks/qr-dialog-7YARY5A5.js"),import("/maintenance_supporter_panelfiles/panel-chunks/adopt-problem-sensors-dialog-3VLC5EX5.js"),import("/maintenance_supporter_panelfiles/panel-chunks/suggested-setups-dialog-AZED3PZD.js"),import("/maintenance_supporter_panelfiles/panel-chunks/settings-view-BL2RM7FG.js"),import("/maintenance_supporter_panelfiles/panel-chunks/bulk-edit-dialog-BTLNHLP2.js")]).then(()=>this.updateComplete)),this._lazyUi}_scheduleWarmUp(){if(this._warmedUp||this._warmPending)return;this._warmPending=!0;let t=()=>{this._warmPending=!1,this._warmUpTaskPage()},e=window.requestIdleCallback;e?e(t,{timeout:5e3}):window.setTimeout(t,1500)}_warmUpTaskPage(){let t=this.shadowRoot;if(this._warmedUp||!t||!this.isConnected)return;let e=this._objects.find(c=>c.tasks.length>0);if(!e||(this._warmedUp=!0,t.querySelector("maintenance-task-detail-view")))return;let i=e.tasks[0],s=document.createElement("maintenance-task-detail-view");s.task=i,s.ctx={...this._taskDetailCtx(e.entry_id,i.id),entryId:""};let n=document.createElement("div");n.hidden=!0,n.attachShadow({mode:"open"}).append(s),t.prepend(n),s.updateComplete.then(()=>requestAnimationFrame(()=>n.remove()))}async _ui(t){return await this._ensureLazyUi(),this.shadowRoot?.querySelector(t)??null}connectedCallback(){super.connectedCallback(),this._mountPath=window.location.pathname;let t=window.requestIdleCallback,e=()=>{this._ensureLazyUi().then(()=>this._scheduleWarmUp())};t?t(e,{timeout:3e3}):window.setTimeout(e,1500),window.addEventListener("popstate",this._popstateHandler),window.addEventListener("location-changed",this._locationChangedHandler),window.addEventListener("keydown",this._paletteKeydown),typeof ResizeObserver<"u"&&(this._tightObserver=new ResizeObserver(i=>{let s=i[0]?.contentRect.width??0;s>0&&(this.tight=s<1e3),s>0&&(this.split=s>=1500),s>0&&(this.wide=s>=2200)}),this._tightObserver.observe(this)),window.addEventListener("resize",this._onVirtualScroll,{passive:!0});try{let i=J(P.taskSort);i&&Li.includes(i)&&(this._sortMode=i);let s=J(P.objectSort);s&&["alphabetical","due_soonest","task_count"].includes(s)&&(this._objectSortMode=s);let[n,c]=(J(P.objectTableSort)??"").split(":");da.includes(n)&&n!=="actions"&&(c==="asc"||c==="desc")&&(this._objTableSort={key:n,dir:c});let d=J(P.groupBy);d&&Ss.includes(d)&&(this._groupByMode=d);let u=J(P.objectView);(u==="cards"||u==="table")&&(this._objectViewMode=u)}catch{}if(this._objects.length===0){let i=ur();i&&(i.beta!==void 0&&Ki(i.beta),this._objects=i.objects,i.stats&&(this._stats=i.stats))}}disconnectedCallback(){super.disconnectedCallback(),this._subGen++,window.removeEventListener("popstate",this._popstateHandler),window.removeEventListener("location-changed",this._locationChangedHandler),window.removeEventListener("keydown",this._paletteKeydown);for(let t of[...this._popupClosers.keys()])this._dropPopupCloser(t);this._tightObserver?.disconnect(),this._tightObserver=null,window.removeEventListener("resize",this._onVirtualScroll),this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onVirtualScroll),this._virtScrollAttached=!1,this._virtRaf&&cancelAnimationFrame(this._virtRaf),this._virtRaf=0,this._detachStickyPane(),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._initialLoadDone=!1,this._watchConnection(null),this._deepLinkHandled=!1,this._searchTimer&&(clearTimeout(this._searchTimer),this._searchTimer=null),this._toastTimer&&(clearTimeout(this._toastTimer),this._toastTimer=null),this._toastMessage="",this._toastUndo=null,this._toastActionLabel="",this._statsService?.clearCache(),this._statsService=null}shouldUpdate(t){if(this.hasUpdated&&t.size===1&&t.has("hass")){let e=t.get("hass"),i=1e3-(performance.now()-this._lastRender);if(e&&this.hass&&i>0&&hr(e,this.hass))return this._hassHeld??=e,this._hassTimer||(this._hassTimer=window.setTimeout(()=>{this._hassTimer=0,this.requestUpdate()},i)),!1}return!0}willUpdate(t){if(super.willUpdate(t),this._hassHeld&&(t.has("hass")||t.set("hass",this._hassHeld),this._hassHeld=null),this._hassTimer&&(clearTimeout(this._hassTimer),this._hassTimer=0),t.has("_groupByMode")&&this._collapsedGroups.size>0&&(this._collapsedGroups=new Set),t.has("_groupByMode")&&(this._virtGroupWin=new Map),t.has("_view")){this._viewEntry++;let e=t.get("_view");(e==="overview"||e==="all_objects")&&this._listScroll.set(e,this._contentScrollTop)}}updated(t){if(super.updated(t),this._lastRender=performance.now(),pe(this,t),t.has("hass")&&this.hass){if(this._dataLoaded){if(this.hass.connection!==this._lastConnection){if(this._watchConnection(this.hass.connection),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}else{this._dataLoaded=!0,this._watchConnection(this.hass.connection);let s=history.state;!this.embedded&&s?.msp_view&&s.msp_view!=="overview"?this._reloadState=s:history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},""),this._loadData(),this._subscribe()}this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new Ti(this.hass),this._fetchMiniStatsForOverview()),this._userService?this._userService.updateHass(this.hass):(this._userService=new ja(this.hass),this._userService.getUsers().then(()=>{this._usersVersion++,this.requestUpdate()}))}let e=this.shadowRoot?.querySelector(".content");if(e&&!this._virtScrollAttached&&(e.addEventListener("scroll",this._onVirtualScroll,{passive:!0}),this._virtScrollAttached=!0),t.has("_view")&&this._restoreListScroll){this._restoreListScroll=!1;let s=this._listScroll.get(this._view)??0;requestAnimationFrame(()=>{let n=this.shadowRoot?.querySelector(".content");n&&(n.scrollTop=s)})}(!(t.size===1&&t.has("hass"))||this._virtRenderedSig!==this._virtMeasuredSig)&&(this._virtMeasuredSig=this._virtRenderedSig,this._scheduleVirtualWindow()),this._syncStickyPane(e),t.has("_objects")&&this._lazyUi&&!this._warmedUp&&this._scheduleWarmUp()}_syncStickyPane(t){let e=this.shadowRoot?.querySelector(".split-pane");if(!e||!t){this._stickyAttached&&this._detachStickyPane();return}this._stickyAttached||(t.addEventListener("scroll",this._onStickyScroll,{passive:!0}),window.addEventListener("resize",this._onStickyScroll),typeof ResizeObserver<"u"&&(this._stickyObserver=new ResizeObserver(this._onStickyScroll)),this._stickyAttached=!0),this._stickyObserver?.observe(e),this._updateStickyPane()}_detachStickyPane(){this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onStickyScroll),window.removeEventListener("resize",this._onStickyScroll),this._stickyObserver?.disconnect(),this._stickyObserver=null,this._stickyRaf&&cancelAnimationFrame(this._stickyRaf),this._stickyRaf=0,this._stickyAttached=!1,this._stickyState=zi,this._stickySelectPending=!1}_updateStickyPane(){let t=this.shadowRoot,e=t?.querySelector(".content"),i=t?.querySelector(".split-pane"),s=t?.querySelector(".split-layout"),n=t?.querySelector(".split-list");if(!e||!i||!s||!n)return;let c=e.getBoundingClientRect().top-e.scrollTop,d={scrollTop:e.scrollTop,viewH:e.clientHeight,paneH:i.offsetHeight,listH:n.offsetHeight,layoutTop:s.getBoundingClientRect().top-c,renderedTop:i.getBoundingClientRect().top-c};this._stickySelectPending&&d.scrollTop===this._stickyState.lastScrollTop?this._stickyState=dn(d):(this._stickySelectPending=!1,this._stickyState=pn(this._stickyState,d));let u=this._stickyState;i.style.top=`${cn(u.mode,d)}px`,i.style.marginTop=u.marginTop>0?`${u.marginTop}px`:""}_resetStickyPane(){let t=this.shadowRoot?.querySelector(".content");this._stickyState={...zi,lastScrollTop:t?.scrollTop??0},this._stickySelectPending=!0}_scheduleVirtualWindow(){this._virtRaf||(this._virtRaf=requestAnimationFrame(()=>{this._virtRaf=0,this._updateVirtualWindow()}))}_updateVirtualWindow(){let t=this.shadowRoot?.querySelector(".content"),e=this.shadowRoot?.querySelector(".task-table.virtual");if(!t||!e)return;if(e.classList.contains("grouped")){this._updateGroupedWindow(t,e);return}this._virtHeights.setWidth(e.clientWidth),e.querySelectorAll(".task-row:not(.virt-sizer)").forEach((d,u)=>{let p=this._virtKeys[this._virtRenderedStart+u];p!==void 0&&this._virtHeights.record(p,d.offsetHeight)});let n=(e.querySelector(".virt-sizer")??e).getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop,c=Ts({scrollTop:t.scrollTop,viewportHeight:t.clientHeight,listTop:n,offsets:this._virtHeights.offsets(this._virtKeys),total:this._virtTotalRows});c.start===this._virtStart&&c.end===this._virtEnd||this._virtPasses>=8||(this._virtPasses++,this._virtStart=c.start,this._virtEnd=c.end)}_updateGroupedWindow(t,e){let i=this._virtGroups,s=e.querySelectorAll(":scope > .group-section"),n=i.map((_,g)=>s[g]?.querySelector(":scope > .group-rows")??null),c=this._virtGroupHeights;c.setWidth(e.clientWidth),n.forEach((_,g)=>{let b=this._virtGroupDrawn[g]?.[0]??0;_?.querySelectorAll(":scope > .task-row").forEach((x,T)=>{let y=i[g].keys[b+T];y!==void 0&&c.record(y,x.offsetHeight)})});let d=t.getBoundingClientRect().top-t.scrollTop,u=new Map;n.forEach((_,g)=>{let b=i[g];!_||b.keys.length===0||u.set(b.key,ln({scrollTop:t.scrollTop,viewportHeight:t.clientHeight,listTop:_.getBoundingClientRect().top-d,offsets:c.offsets(b.keys),total:b.keys.length}))});let p=this._virtGroupWin;u.size===p.size&&[...u].every(([_,g])=>p.get(_)?.[0]===g[0]&&p.get(_)?.[1]===g[1])||this._virtPasses>=8||(this._virtPasses++,this._virtGroupWin=u)}_watchConnection(t){this._lastConnection?.removeEventListener?.("ready",this._onReconnect),this._lastConnection=t,t?.addEventListener?.("ready",this._onReconnect)}_checkServerVersion(){this.hass.connection.sendMessagePromise({type:"maintenance_supporter/version"}).then(t=>{this._restartPendingVersion=Ds(t),this._staleBundle=!this._restartPendingVersion&&As(t?.version)}).catch(()=>{})}async _loadData(){let[t,e,i,s,n,c]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"}).catch(()=>null)]);if(c&&(this._savedViews=c.views||[]),t&&(this._objects=Be(t.objects),ps(this._objects,e??this._stats??null,n?ts(n).features.beta_editor:dt()),this._maybeLoadGettingStarted()),this._detailOpen()&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/status"}).then(u=>{this._batteryFleetSetupAvailable=!!u.available&&!u.configured}).catch(()=>{this._batteryFleetSetupAvailable=!1}),this._staleChecked||(this._staleChecked=!0,this._checkServerVersion()),e&&(this._stats=e),i&&(this._budget=i,Me(this._budget)),s&&(this._groups=s.groups||{}),n){let u=ts(n);this._features=u.features,Ki(u.features.beta_editor),this._adminPanelUserIds=[...u.access.operatorIds],this._operatorWriteEnabled=u.access.operatorWriteEnabled,this._defaultWarningDays=u.defaultWarningDays,this._mirrorTodoDefault=u.mirrorTodoDefault,this._rowActionStyle=u.rowActionStyle,this._rowActionNotice=u.rowActionNoticePending,this._refsInLists=u.refsInLists,this._objectsTableColumns=ha(u.objectsTableColumns),this._partsCostMode=u.partsCostMode}this._fetchMiniStatsForOverview(),this._initialLoadDone=!0;let d=!!window.location.search;this._handleDeepLink(),this._restoreAfterReload(d)}_restoreAfterReload(t){let e=this._reloadState;if(this._reloadState=null,!e?.msp_view||t||this._deepLinkHandled)return;if((e.msp_view==="object"||e.msp_view==="task")&&!this._getObject(e.msp_entry??"")||e.msp_view==="task"&&!this._getTask(e.msp_entry??"",e.msp_task??"")||e.msp_view==="area"&&!this._objects.some(s=>Xi(s.object)===e.msp_area)){history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},"");return}this._applyPanelState(e)}_onLocationChanged(){if(!this._initialLoadDone||!window.location.search||this.embedded&&this._mountPath!==null&&window.location.pathname!==this._mountPath)return;if(!this.embedded){let e=`/${typeof this.panel?.url_path=="string"?this.panel.url_path:"maintenance-supporter"}`,i=window.location.pathname;if(i!==e&&!i.startsWith(`${e}/`))return}this._deepLinkHandled=!1,this._deepLinkInPlace=!0;try{this._handleDeepLink()}finally{this._deepLinkInPlace=!1}history.state?.msp_view||history.replaceState({msp_view:this._view,msp_entry:this._selectedEntryId,msp_task:this._selectedTaskId,msp_area:this._selectedAreaId},"")}_handleDeepLink(){if(this._deepLinkHandled)return;let t=new URLSearchParams(window.location.search),e=t.get("ms_action"),i=()=>{let k=window.location.pathname+window.location.hash;history.replaceState(history.state,"",k)};if(e==="add_object"){this._deepLinkHandled=!0,i(),this._ui("maintenance-object-dialog").then(k=>k?.openCreate());return}if(e==="open_vacation"||e==="open_budget"||e==="open_groups"||e==="open_settings"){if(this._deepLinkHandled=!0,i(),!this.hass?.user?.is_admin)return;this._overviewTab="settings",this._ensureLazyUi().then(()=>requestAnimationFrame(()=>{let k=this.shadowRoot?.querySelector("maintenance-settings-view"),w=e.replace("open_","");k?.scrollToSection?.(w)}));return}if(this.embedded&&!this._presetsApplied){this._presetsApplied=!0;let k=this.presets?.tab??"",w=(this.presets?.view??"").trim();if(!t.has("tab")&&ds.includes(k)&&(k!=="settings"||this.hass?.user?.is_admin)&&(this._overviewTab=k),!t.has("view")&&w){let E=w.toLowerCase(),v=this._savedViews.find(D=>D.id===w)??this._savedViews.find(D=>D.name.trim().toLowerCase()===E);v&&(this._overviewTab="dashboard",this._applyView(v.id))}}let s=t.get("tab"),n=t.get("view"),c=t.get("sort"),d=t.get("status");if(s!==null||n!==null||c!==null||d!==null){if(i(),this._view!=="overview"&&(this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()),ds.includes(s??"")&&(s!=="settings"||this.hass?.user?.is_admin)&&this._setOverviewTab(s),n!==null){let k=n.trim().toLowerCase(),w=this._savedViews.find(E=>E.id===n)??this._savedViews.find(E=>E.name.trim().toLowerCase()===k);w&&(this._overviewTab!=="dashboard"&&this._setOverviewTab("dashboard"),this._applyView(w.id))}Li.includes(c??"")&&(this._sortMode=c,this._activeViewId="",q(P.taskSort,this._sortMode)),js.includes(d??"")&&(this._overviewTab!=="dashboard"&&this._setOverviewTab("dashboard"),this._filterByStatus(d))}let u=t.get("area");if(u&&!t.get("entry_id")){this._deepLinkHandled=!0,i(),this._objects.some(k=>Xi(k.object)===u)?this._showArea(u):this._showAllAreas();return}let p=t.get("entry_id");if(!p)return;this._deepLinkHandled=!0;let _=t.get("task_id"),g=t.get("action"),b=t.get("section"),x=mn.includes(b??"")?b:null,T=window.location.pathname+window.location.hash;history.replaceState(history.state,"",T);let y=this._getObject(p);if(!y){this._showOverview();return}if(_){let k=y.tasks.find(w=>w.id===_);if(!k){this._showObject(p,x);return}this._showTask(p,_),g==="complete"?requestAnimationFrame(()=>{this._openCompleteDialog(p,_,k.name,this._features.checklists?k.checklist:void 0,this._features.adaptive&&!!k.adaptive_config?.enabled,{viaTagScan:!0})}):g==="skip"?requestAnimationFrame(()=>{k.allow_skip!==!1&&this._promptSkipTask(p,_)}):g==="quick_complete"&&requestAnimationFrame(()=>{this._handleQuickComplete(p,_,k)})}else this._showObject(p,x)}async _fetchDetailStats(t,e){if(!this._statsService)return;let i=(this._detailStatsSeq.get(t)??0)+1;this._detailStatsSeq.set(t,i);let s=await this._statsService.getDetailStats(t,e,this._chartRangeDays);if(this._detailStatsSeq.get(t)!==i)return;let n=new Map(this._detailStatsData);n.set(t,s),this._detailStatsData=n}_fetchRuleStats(t){let e=t?.trigger_config;if(!e)return;let i=jt(e);i&&this._fetchDetailStats(i,Nt(e));for(let s of fe(e))s.entityId!==i&&this._fetchDetailStats(s.entityId,Nt(s.cond))}_setChartRange(t){if(t===this._chartRangeDays)return;this._chartRangeDays=t;try{q(P.chartRange,String(t))}catch{}let e=this._selectedEntryId&&this._selectedTaskId?this._getTask(this._selectedEntryId,this._selectedTaskId):null,i=jt(e?.trigger_config);if(i){let s=new Map(this._detailStatsData);s.delete(i),this._detailStatsData=s,this._fetchDetailStats(i,Nt(e.trigger_config))}}_setHideOutliers(t){if(t!==this._hideOutliers){this._hideOutliers=t;try{q(P.chartHideOutliers,t?"1":"0")}catch{}}}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let t=[];for(let i of this._objects)for(let s of i.tasks){let n=s.battery_fleet_task?void 0:jt(s.trigger_config);n&&t.push({entityId:n,isCounter:Nt(s.trigger_config)})}if(t.length===0)return;let e=await this._statsService.getBatchMiniStats(t);this._miniStatsData=new Map([...this._miniStatsData,...e])}async _subscribe(){let t=++this._subGen;try{let e=await this.hass.connection.subscribeMessage(i=>{let s=i,n=nr(this._objects,s);n!==null&&(this._objects=n,i.objects&&ps(n,this._stats??null),this._refreshKpis(),this._detailOpen()&&(s.objects||(s.delta||[]).some(c=>c.entry_id===this._selectedEntryId))&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId))},{type:"maintenance_supporter/subscribe",deltas:!0,compact:!0});if(!this.isConnected||t!==this._subGen){e();return}this._unsub=e}catch{}}async _refreshKpis(){if(this._kpiRefreshInFlight){this._kpiRefreshPending=!0;return}this._kpiRefreshInFlight=!0;try{do{this._kpiRefreshPending=!1;let[t,e]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null)]);if(!this.isConnected)return;t&&(this._stats=t),e&&(this._budget=e,Me(this._budget))}while(this._kpiRefreshPending)}finally{this._kpiRefreshInFlight=!1}}get _taskRows(){return this._rowsFiltered(!0)}_rowsFiltered(t,e=t){let i=[this._objects,this._groups,this._listSearch,this._showArchived,this._filterStatus,this._filterUser,this._filterLabel,this._filterPlace,this._filterPriority,this._sortMode,this.hass?.areas,this.hass?.user?.id,dt(),this._usersVersion];(i.length!==this._rowsMemoInputs.length||i.some((k,w)=>k!==this._rowsMemoInputs[w]))&&(this._rowsMemo=new Map,this._rowsMemoInputs=i,this._rowsGeneration++);let s=`${t}|${e}`,n=this._rowsMemo.get(s);if(n)return n;let c=[],d=e&&dt()?this._listSearch.trim():"";for(let k of this._objects)for(let w of k.tasks){if(d&&!Ms([w.name,k.object.name,...w.labels||[],k.object.area_id?this.hass?.areas?.[k.object.area_id]?.name:""].join(" "),d)||!this._showArchived&&w.archived||t&&this._filterStatus&&w.status!==this._filterStatus)continue;if(this._filterUser){let v=this._filterUser==="current_user"?this._userService?.getCurrentUserId():this._filterUser;if(!Ne(w,v))continue}if(this._filterLabel&&!(w.labels||[]).includes(this._filterLabel)||this._filterPlace&&(k.object.place||"home")!==this._filterPlace||this._filterPriority&&(w.priority||"normal")!==this._filterPriority)continue;let E=[];for(let v of Object.values(this._groups))v.task_refs?.some(D=>D.entry_id===k.entry_id&&D.task_id===w.id)&&E.push(v.name);c.push({entry_id:k.entry_id,task_id:w.id,object_name:k.object.name,allow_skip:w.allow_skip!==!1,notify_enabled:w.notify_enabled!==!1,task_name:w.name,type:w.type,schedule_type:w.schedule_type,status:w.status,days_until_due:w.days_until_due??null,next_due:w.next_due??null,last_performed:w.last_performed??null,next_event_titles:w.next_event_titles??[],trigger_active:w.trigger_active,trigger_detail:w.trigger_detail??null,trigger_current_value:w.trigger_current_value??null,trigger_current_delta:w.trigger_current_delta??null,trigger_config:w.trigger_config??null,trigger_entity_info:w.trigger_entity_info??null,battery_fleet_task:w.battery_fleet_task===!0,times_performed:w.times_performed,total_cost:w.total_cost,interval_days:w.interval_days??null,interval_unit:w.interval_unit??null,interval_anchor:w.interval_anchor??null,is_done:w.is_done??!1,archived:w.archived??!1,history:w.history||[],enabled:w.enabled,nfc_tag_id:w.nfc_tag_id??null,priority:w.priority??"normal",labels:w.labels??[],area_id:k.object.area_id??null,responsible_user_id:w.responsible_user_id??null,assignee_pool:w.assignee_pool??null,group_names:E})}let u=(k,w)=>Xt(k.status)-Xt(w.status),p=(k,w)=>(k.days_until_due??99999)-(w.days_until_due??99999),_=(k,w)=>u(k,w)||p(k,w),g=k=>k.area_id&&this.hass?.areas?.[k.area_id]?.name||"",b=k=>Ft(k).map(w=>this._userService?.getUserName(w)||"").filter(Boolean),x=k=>b(k).sort((w,E)=>w.localeCompare(E)).join(", "),T=k=>k.group_names[0]||"",y={due_date:_,object:(k,w)=>k.object_name.localeCompare(w.object_name)||_(k,w),type:(k,w)=>k.type.localeCompare(w.type)||_(k,w),task_name:(k,w)=>k.task_name.localeCompare(w.task_name),area:(k,w)=>{let E=g(k),v=g(w);return!E&&v?1:E&&!v?-1:E.localeCompare(v)||_(k,w)},assigned_user:(k,w)=>{let E=x(k),v=x(w);return!E&&v?1:E&&!v?-1:E.localeCompare(v)||_(k,w)},group:(k,w)=>{let E=T(k),v=T(w);return!E&&v?1:E&&!v?-1:E.localeCompare(v)||_(k,w)}};return c.sort(y[this._sortMode]),this._rowsMemo.set(s,c),c}_getObject(t){return this._objects.find(e=>e.entry_id===t)}_getTask(t,e){return this._getObject(t)?.tasks.find(s=>s.id===e)}_listRef(t,e){if(!this._refsInLists)return h;let i=this._getObject(t);return de(Pt(i?.object,i?.tasks.find(s=>s.id===e)))}_objRef(t){return this._refsInLists?de(Ct(t)):h}_pushPanelState(t,e,i,s){let n={msp_view:t,msp_entry:e||null,msp_task:i||null,msp_area:s||null};this._deepLinkInPlace?history.replaceState(n,""):history.pushState(n,"")}_onPopState(t){let e=t.state;e?.msp_view&&this._applyPanelState(e)}_applyPanelState(t){(t.msp_view??"overview")!==this._view&&(this._restoreListScroll=!0),this._view=t.msp_view??"overview",this._selectedEntryId=t.msp_entry||null,this._selectedTaskId=t.msp_task||null,this._selectedAreaId=t.msp_area||null,this._moreMenuOpen=!1,this._objectSectionOverride=null,t.msp_view==="all_parts"&&this._loadAllParts(),(t.msp_view==="task"||t.msp_view==="object")&&t.msp_entry&&t.msp_task&&(this._historyFilter=null,this._fetchFullHistory(t.msp_entry,t.msp_task),this._fetchRuleStats(this._getTask(t.msp_entry,t.msp_task)))}_showOverview(t=!1){this._pushPanelState("overview"),t&&this._view!=="overview"&&(this._restoreListScroll=!0),this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,t||this._scrollContentToTop()}_showAllObjects(){this._pushPanelState("all_objects"),this._view="all_objects",this._objBulkMode=!1,this._objBulkSelected=new Set,this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_showAllParts(){this._pushPanelState("all_parts"),this._view="all_parts",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop(),this._loadAllParts()}async _loadAllParts(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});this._allParts=t.parts||[]}catch{this._allParts=[]}}_showAllAreas(){this._pushPanelState("all_areas"),this._view="all_areas",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_showArea(t){this._pushPanelState("area",null,null,t),this._view="area",this._selectedAreaId=t,this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_ensureAreaUi(){this._areaUi??=Promise.all([import("/maintenance_supporter_panelfiles/panel-chunks/areas-view-NJMOEJLY.js"),import("/maintenance_supporter_panelfiles/panel-chunks/area-view-43ELIDUK.js")]).catch(()=>{this._areaUi=null})}_filterByStatus(t){this._filterStatus=t,this._activeViewId="",this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard"),this._scrollContentToTop()}get _allLabels(){let t=new Set;for(let e of this._objects)for(let i of e.tasks)for(let s of i.labels||[])t.add(s);return[...t].sort((e,i)=>e.localeCompare(i))}get _allPlaces(){let t=new Map;for(let e of this._objects){let i=e.object;i.place&&!t.has(i.place)&&t.set(i.place,i.place_name||i.place)}return[...t].map(([e,i])=>({id:e,name:i})).sort((e,i)=>e.name.localeCompare(i.name))}get _currentFilters(){return{status:this._filterStatus,user_id:this._filterUser,label:this._filterLabel,priority:this._filterPriority,place:this._filterPlace,archived:this._showArchived,sort_mode:this._sortMode,group_by:this._groupByMode}}_applyView(t){if(this._activeViewId=t,!t)return;let e=this._savedViews.find(s=>s.id===t);if(!e)return;let i=e.filters;this._filterStatus=i.status||"",this._filterUser=i.user_id||null,this._filterLabel=i.label||null,this._filterPriority=i.priority||"",this._filterPlace=i.place||"",this._showArchived=!!i.archived,Li.includes(i.sort_mode)&&(this._sortMode=i.sort_mode),Ss.includes(i.group_by)&&(this._groupByMode=i.group_by);try{q(P.taskSort,this._sortMode),q(P.groupBy,this._groupByMode)}catch{}this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard")}_openSavedViewsDialog(){this.shadowRoot.querySelector("maintenance-saved-views-dialog")?.open(this._currentFilters,this._savedViews)}_onSavedViewsChanged(t){this._savedViews=t.detail.views||[],this._activeViewId&&!this._savedViews.some(e=>e.id===this._activeViewId)&&(this._activeViewId="")}_scrollContentToTop(){requestAnimationFrame(()=>{let t=this.shadowRoot?.querySelector(".content");t&&(t.scrollTop=0)})}_renderLineageLink(t,e){let i=t?this._objects.find(s=>s.entry_id===t):void 0;return i?o`<p class="meta">${e}:
      <a href="#" class="object-lineage-link" @click=${s=>{s.preventDefault(),this._showObject(i.entry_id)}}
        >${i.object.name}</a></p>`:h}_addSubObject(t){this._ui("maintenance-object-dialog").then(e=>e?.openCreate(t))}_moveHereChoices(t){let e=this._objects,i=new Set(rs(e,t).map(s=>s.entry_id));return e.filter(s=>s.entry_id!==t&&!i.has(s.entry_id)&&s.object.parent_entry_id!==t&&ss(s)).map(s=>({value:s.entry_id,label:Na(e,s)})).sort((s,n)=>s.label.localeCompare(n.label))}async _moveObjectHere(t){let e=this._moveHereChoices(t);if(!e.length)return;let i=this._lang,s=this._objects.find(d=>d.entry_id===t)?.object.name??"",c=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("sub_object_move_here",i),message:a("sub_object_move_message",i).replace("{name}",s),confirmText:a("sub_object_move_confirm",i),inputLabel:a("object",i),inputValue:e[0].value,options:e});!c?.confirmed||!c.value||await this._runAction({type:"maintenance_supporter/object/update",entry_id:c.value,parent_entry_id:t},{successToast:a("sub_object_moved",i).replace("{name}",s)})}_toggleSubObjMenu(t){this._subObjMenu&&this._subObjMenu!==t&&(this._subObjMenu=null),this._togglePopup("sub-object",()=>this._subObjMenu!==null,e=>{this._subObjMenu=e?t:null})}_closeSubObjMenu(){this._subObjMenu=null}_renderSubObjMenu(t,e){return ne(this._subObjEntries(t,e),()=>this._closeSubObjMenu(),`sub-object-menu${this._subObjMenu==="head"?" sub-object-menu-head":""}`)}_subObjEntries(t,e,i=""){let s=n=>i?`${i}: ${n}`:n;return[{label:s(a("new_object",e).replace(/^\+\s*/,"")),icon:"mdi:package-variant-closed-plus",cls:"sub-object-new",action:()=>this._addSubObject(t)},{label:s(a("templates_from",e)),icon:"mdi:view-grid-plus-outline",cls:"sub-object-template",action:()=>{this._openTemplateGallery(t)}},this._moveHereChoices(t).length>0&&{label:s(a("sub_object_move_here",e)),icon:"mdi:folder-move-outline",cls:"sub-object-move",action:()=>{this._moveObjectHere(t)}}]}_objMenuEntries(t,e,i,s,n){let c=t.object,d=!i;return[{label:a("qr_code",s),action:()=>this._openQrForObject(t.entry_id,c.name)},{label:a("report_button",s),action:()=>this._printObjectReport(t.entry_id)},d&&!c.battery_fleet&&{label:a("duplicate",s),action:()=>this._duplicateObject(t.entry_id)},...d&&e?n?this._subObjEntries(t.entry_id,s,a("add_sub_object",s)):[{label:a("add_sub_object",s),cls:"add-sub-object-item",action:()=>this._toggleSubObjMenu("more")}]:[],d&&!c.archived&&{label:c.paused?a("resume_object",s):a("pause_object",s),action:()=>this._togglePauseObject(t.entry_id,!!c.paused)},d&&!c.archived&&!c.battery_fleet&&{label:a("replace_object",s),action:()=>this._replaceObject(t.entry_id,c)},d&&{label:c.archived?a("unarchive_object",s):a("archive_object",s),action:()=>this._toggleArchiveObject(t.entry_id,!!c.archived)},d&&"divider",d&&{label:a("delete",s),danger:!0,action:()=>this._deleteObject(t.entry_id)}]}_showObject(t,e=null){this._pushPanelState("object",t),this._view="object",this._selectedEntryId=t,this._selectedTaskId=null,this._objectSectionOverride=e,e?this._scrollToObjectSection(e):this._scrollContentToTop()}_scrollToObjectSection(t){this.updateComplete.then(()=>requestAnimationFrame(()=>{let e=this.shadowRoot?.querySelector(`.obj-section[data-section="${t}"]`);e?e.scrollIntoView({block:"start",behavior:"smooth"}):this._scrollContentToTop()}))}_toggleObjectSection(t){let e=new Set(this._objectSectionsCollapsed);this._objectSectionOverride===t||!e.has(t)?e.add(t):e.delete(t),this._objectSectionOverride===t&&(this._objectSectionOverride=null),this._objectSectionsCollapsed=e,q(P.objectSections,JSON.stringify([...e]))}_splitActive(){return this.split&&!this.narrow&&!this.tight&&this._view==="overview"&&this._overviewTab==="dashboard"&&!this._bulkMode}_detailOpen(){return(this._view==="task"||this._splitActive()||this._objectSplitActive())&&!!this._selectedEntryId&&!!this._selectedTaskId}_objectSplitActive(){return dt()&&this.split&&!this.narrow&&!this.tight&&this._view==="object"&&!this._objBulkMode}_showFullTaskPage(t,e){this._view!=="task"&&(this._pushPanelState("task",t,e),this._view="task",this._selectedEntryId=t,this._selectedTaskId=e,this._scrollContentToTop())}_showTask(t,e){let i=this._objectSplitActive()&&t===this._selectedEntryId;if(i&&history.replaceState({...history.state,msp_task:e},""),this._splitActive()||i){this._selectedEntryId=t,this._selectedTaskId=e,this._activeTab="overview",this._historyFilter=null,this._historySearch="",this._resetStickyPane(),this._fetchFullHistory(t,e),this._fetchRuleStats(this._getTask(t,e));return}this._pushPanelState("task",t,e),this._view="task",this._selectedEntryId=t,this._selectedTaskId=e,this._activeTab="overview",this._historyFilter=null,this._historySearch="",this._scrollContentToTop(),this._fetchFullHistory(t,e),this._fetchRuleStats(this._getTask(t,e))}_showToast(t,e="error"){if(dt()){os(this,t);return}this._toastTimer&&clearTimeout(this._toastTimer),this._toastKind=e,this._toastUndo=null,this._toastActionLabel="",this._toastMessage=t,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastTimer=null},4e3)}_showActionToast(t,e,i){this._showUndoToast(t,i,e)}_showUndoToast(t,e,i=""){if(dt()){os(this,t,{text:i||a("undo",this._lang),action:e});return}this._toastTimer&&clearTimeout(this._toastTimer),this._toastKind="info",this._toastActionLabel=i,this._toastMessage=t,this._toastUndo=e,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastUndo=null,this._toastTimer=null},7e3)}_runToastUndo(){let t=this._toastUndo;this._toastTimer&&clearTimeout(this._toastTimer),this._toastMessage="",this._toastUndo=null,this._toastTimer=null,t?.()}_openPalette(){this._paletteQuery="",this._paletteActive=0,this._paletteOpen=!0,this._searchRemote=null,this.updateComplete.then(()=>{this.shadowRoot?.querySelector(".palette-input")?.focus()})}_closePalette(){this._paletteOpen=!1,this._paletteQuery="",this._searchRemote=null,this._searchTimer&&(clearTimeout(this._searchTimer),this._searchTimer=null)}_onPaletteInput(t){this._paletteQuery=t,this._paletteActive=0,this._searchTimer&&clearTimeout(this._searchTimer);let e=t.trim();if(e.length<Hi){this._searchRemote=null;return}this._searchTimer=setTimeout(()=>{this._searchTimer=null;let i=++this._searchSeq;this.hass.connection.sendMessagePromise({type:"maintenance_supporter/search",query:e,limit:le.documents}).then(s=>{i!==this._searchSeq||!this._paletteOpen||(this._searchRemote={query:e,documents:s.documents||[],history:s.history||[]})}).catch(()=>{i!==this._searchSeq||!this._paletteOpen||(this._searchRemote={query:e,documents:[],history:[]})})},Bo)}get _paletteResults(){let t=this._lang,e=this._paletteQuery.trim();if(e.length<Hi&&!Ge(e))return[];let i=We(e);if(!i.length)return[];let s=[],n=[],c=[],d=Ge(e);if(d){for(let g of this._objects){let b=g.object;if(b.ref_no!==d.object)continue;let x=Ct(b),T=(y,k)=>y?[k,a("archived",t)].filter(Boolean).join(" \xB7 "):k;d.task==null&&s.push({kind:"object",entryId:g.entry_id,label:b.name||"",sub:T(b.archived,a("object",t)),score:1e3,icon:"mdi:package-variant-closed",ref:x});for(let y of g.tasks)d.task!=null&&y.ref_no!==d.task||n.push({kind:"task",entryId:g.entry_id,taskId:y.id,label:y.name||"",sub:T(y.archived||b.archived,b.name||""),score:d.task==null?900:1e3,icon:"mdi:clipboard-check-outline",ref:Pt(b,y)})}if(s.length||n.length){let g=this._searchRemote&&this._searchRemote.query===e?this._searchRemote:null,b=[...s,...n.slice(0,le.tasks)];for(let x of g?.history.slice(0,1)??[])b.push({kind:"history",entryId:x.entry_id,taskId:x.task_id,label:x.task_name||"",sub:[x.object_name,x.timestamp?U(x.timestamp,t):""].filter(Boolean).join(" \xB7 "),snippet:x.snippet||"",score:x.score,icon:"mdi:note-text-outline",ref:x.ref??null});return b}}for(let g of this._objects){let b=g.object;if(b.archived)continue;let x=b.name||"",T=ce(i,[{text:x,weight:3},{text:b.manufacturer,weight:2},{text:b.model,weight:2},{text:b.serial_number,weight:2},{text:b.notes,weight:1}]);if(T>0){let y=[b.manufacturer,b.model].filter(Boolean).join(" ");s.push({kind:"object",entryId:g.entry_id,label:x,sub:y||a("object",t),score:T,icon:"mdi:package-variant-closed",ref:Ct(b)})}for(let y of g.tasks){if(y.archived)continue;let k=(y.labels||[]).join(" "),w=ce(i,[{text:y.name,weight:3},{text:x,weight:2},{text:k,weight:2},{text:y.notes,weight:1}]);if(w>0){let E=(y.labels||[]).length?`  #${(y.labels||[]).join(" #")}`:"";n.push({kind:"task",entryId:g.entry_id,taskId:y.id,label:y.name||"",sub:x+E,score:w,icon:"mdi:clipboard-check-outline",ref:Pt(b,y)})}}for(let y of g.parts||[]){let k=ce(i,[{text:y.name,weight:3},{text:y.mpn,weight:2},{text:y.vendor,weight:1},{text:y.storage_location,weight:1},{text:y.notes,weight:1}]);k>0&&c.push({kind:"part",entryId:g.entry_id,label:y.name||"",sub:[x,y.mpn].filter(Boolean).join(" \xB7 "),score:k,icon:"mdi:cog-outline"})}}let u=(g,b)=>b.score-g.score||g.label.localeCompare(b.label),p=[...s.sort(u).slice(0,le.objects),...n.sort(u).slice(0,le.tasks),...c.sort(u).slice(0,le.parts)],_=this._searchRemote&&this._searchRemote.query===e?this._searchRemote:null;if(_){let g=_.documents.slice(0,le.documents);for(let b of[...g.filter(x=>x.match!=="content"),...g.filter(x=>x.match==="content")])p.push({kind:b.match==="content"?"content":"document",entryId:b.entry_id,docId:b.id,docKind:b.kind,url:b.url,page:b.page??null,label:gt(b),sub:b.object_name||"",snippet:b.snippet||"",score:b.score,icon:b.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"});for(let b of _.history.slice(0,le.history))p.push({kind:"history",entryId:b.entry_id,taskId:b.task_id,label:b.task_name||"",ref:b.ref??null,sub:[b.object_name,b.timestamp?U(b.timestamp,t):""].filter(Boolean).join(" \xB7 "),snippet:b.snippet||"",score:b.score,icon:b.type==="skipped"?"mdi:skip-next-circle-outline":"mdi:note-text-outline"})}return p}_selectPaletteResult(t){let e=this._paletteQuery.trim();switch(this._closePalette(),t.kind){case"task":t.taskId&&this._showTask(t.entryId,t.taskId);return;case"history":if(!t.taskId)return;this._showTask(t.entryId,t.taskId),this._activeTab="history",this._historySearch=e;return;case"document":case"content":t.docKind==="weblink"?ct(t.url)&&window.open(t.url,"_blank","noopener"):t.docId&&Lt(this.hass,t.docId,t.page?`#page=${t.page}`:"").catch(()=>{}),this._showObject(t.entryId,"documents");return;case"part":this._showObject(t.entryId,"parts");return;default:this._showObject(t.entryId)}}_renderPalette(){if(!this._paletteOpen)return h;let t=this._lang,e=this._paletteResults,i=this._paletteQuery.trim(),s={object:a("objects",t),task:a("tasks",t),part:a("search_group_parts",t),document:a("documents",t),content:a("search_group_content",t),history:a("search_group_history",t)},n=i.length>=Hi&&(!this._searchRemote||this._searchRemote.query!==i),c=null;return o`
      <div class="palette-backdrop top-layer" popover="manual" ${_e} @click=${()=>this._closePalette()}>
        <div class="palette" role="dialog" aria-label=${a("search_open",t)} @click=${d=>d.stopPropagation()}>
          <input
            class="palette-input"
            type="text"
            placeholder="${a("palette_placeholder",t)}"
            .value=${this._paletteQuery}
            @input=${d=>this._onPaletteInput(d.target.value)}
          />
          <div class="palette-results">
            ${i.length<Hi&&!Ge(i)?o`<div class="palette-empty">${a("search_empty_hint",t)}</div>`:e.length===0?o`<div class="palette-empty">${n?a("search_searching",t):a("palette_no_results",t)}</div>`:e.map((d,u)=>{let p=d.kind!==c?o`<div class="palette-group">${s[d.kind]}</div>`:h;return c=d.kind,o`
                      ${p}
                      <div class="palette-item ${u===this._paletteActive?"active":""} ${d.snippet?"has-snippet":""}"
                        @mouseenter=${()=>{this._paletteActive=u}}
                        @click=${()=>this._selectPaletteResult(d)}>
                        <ha-icon icon="${d.icon}"></ha-icon>
                        <div class="palette-main">
                          <div class="palette-line">
                            <span class="palette-label">${d.label}</span>
                            ${d.ref?o`<span class="ref-chip">#${d.ref}</span>`:h}
                            ${d.page?o`<span class="palette-page">${a("search_page",t).replace("{page}",String(d.page))}</span>`:h}
                            <span class="palette-sub">${d.sub}</span>
                          </div>
                          ${d.snippet?o`<div class="palette-snippet">${d.snippet}</div>`:h}
                        </div>
                      </div>
                    `})}
            ${e.length>0&&n?o`<div class="palette-group palette-waiting">${a("search_searching",t)}</div>`:h}
          </div>
          <div class="palette-hint">${a("palette_hint",t)}</div>
        </div>
      </div>
    `}_openAdoptProblemSensors(){this._ui("maintenance-adopt-problem-sensors-dialog").then(t=>t?.open())}async _onProblemSensorsAdopted(t){let e=t.detail?.tasks_created??0,i=t.detail?.created??[];await this._loadData();let s=_t("adopt_problem_done","adopt_problem_done_one",e,this._lang,"tasks");i.length>0?this._showActionToast(s,a("adopt_problem_configure",this._lang),()=>{let n=i.flatMap(c=>{let d=this._objects.find(u=>u.entry_id===c.entry_id)?.tasks.find(u=>u.id===c.task_id);return d?[{entryId:c.entry_id,task:d}]:[]});n.length>0&&this._ui("maintenance-task-dialog").then(c=>c?.openEditSeries(n))}):this._showToast(s,"info")}async _setupBatteryFleet(){let t=await I(this,{type:"maintenance_supporter/battery_fleet/setup",language:N(this.hass)},{reload:async()=>{this._batteryFleetSetupAvailable=!1,await this._loadData()},onError:s=>this._showToast(s)});if(t===void 0)return;let e=this._objects.find(s=>s.entry_id===t?.entry_id),i=e?.tasks.find(s=>s.id===t?.task_id)||e?.tasks[0];e&&i&&this._showTask(e.entry_id,i.id),this._showToast(a("battery_fleet_setup_done",this._lang),"info")}_openSuggestedSetups(){this._ui("maintenance-suggested-setups-dialog").then(t=>t?.open())}_onResetsWired(t){let e=t.detail?.wired??0;this._showToast(_t("reset_offers_done","reset_offers_done_one",e,this._lang,"count"),"info"),this._resetOffersLoaded=!1,this._resetOffersCount=0,this._maybeLoadResetOffers(),this._loadData()}_onSetupsAdopted(t){let e=t.detail?.tasks_created??0;this._showToast(_t("setups_done","setups_done_one",e,this._lang,"tasks"),"info"),this._loadData()}async _openTemplateGallery(t=null){this._templateParentId=t,this._templateGalleryOpen=!0,this._templatePreview=null;let e=await I(this,{type:"maintenance_supporter/templates",language:this._lang},{onError:i=>this._showToast(i)});e!==void 0&&(this._templateCategories=e?.categories||{},this._templates=(e?.templates||[]).filter(i=>!i.disabled),this._homeProfile=e?.profile??null)}async _createFromTemplate(t,e){let i=await I(this,{type:"maintenance_supporter/object/from_template",language:this._lang,template_id:t,...this._templateParentId?{parent_entry_id:this._templateParentId}:{},...e?{task_names:e}:{}},{busy:s=>{this._templateBusy=s},reload:async()=>{this._templateGalleryOpen=!1,this._templatePreview=null,await this._loadData()},successToast:a("template_created",this._lang),onSuccess:s=>this._showToast(s,"info"),onError:s=>this._showToast(s)});i?.entry_id&&this._showObject(i.entry_id)}_categoryName(t){let e=this._templateCategories[t];return e&&(e[`name_${this._lang}`]||e.name_en)||t}_renderTemplateCard(t,e=!1){let i=this._lang,s=this._homeProfile?.country??null;return o`
      <button class="template-card ${t.dwelling_mismatch?"not-typical":""}" .disabled=${this._templateBusy}
        title=${t.dwelling_mismatch?a("templates_not_typical",i):""}
        @click=${()=>this._features.beta_editor?this._openTemplatePreview(t):this._createFromTemplate(t.id)}>
        <span class="template-card-name">${t.name}</span>
        <span class="template-card-count">${_t("templates_task_count","templates_task_count_one",t.tasks.length,i)}</span>
        ${e&&t.reasons?.length?o`<span class="template-card-reasons">
              ${t.reasons.map(n=>o`<span class="template-card-reason">${ga(n,i,s)}</span>`)}
            </span>`:h}
        ${t.set_up?o`<span class="template-card-setup"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${a("templates_set_up",i)}</span>`:h}
      </button>
    `}_openTemplatePreview(t){this._templatePreview=t,this._templatePicked=new Set(t.tasks.map((e,i)=>i))}_toggleTemplateTask(t,e){let i=new Set(this._templatePicked);e?i.add(t):i.delete(t),this._templatePicked=i}_renderTemplatePreview(t){let e=this._lang,i=t.tasks,s=this._templatePicked,n=i.filter((u,p)=>s.has(p)).length,c=u=>u.interval_days&&u.interval_days>0?a("beta_rules_every",e).replace("{interval}",Ot(u.interval_days,"day",e)):a(u.schedule_type||"manual",e),d=()=>{this._templateGalleryOpen=!1,this._templatePreview=null};return o`
      <div class="palette-backdrop top-layer" popover="manual" ${_e} @click=${d}>
        <div class="template-gallery template-preview" @click=${u=>u.stopPropagation()}>
          <div class="template-gallery-head">
            <ha-icon-button class="template-preview-back" .label=${a("back",e)} .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
              @click=${()=>{this._templatePreview=null}}></ha-icon-button>
            <span class="template-preview-name">${t.name}</span>
            <ha-icon-button .label=${a("close",e)} .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
              @click=${d}></ha-icon-button>
          </div>
          <div class="template-gallery-body">
            <div class="template-cat-head">${a("beta_template_pick",e)}</div>
            ${i.map((u,p)=>o`
              ${te({cls:"template-preview-task",checked:s.has(p),onChange:_=>this._toggleTemplateTask(p,_.target.checked)},o`<span class="template-preview-text">
                  <span class="template-preview-task-name">${u.name}</span>
                  <span class="template-preview-rule">${c(u)}</span>
                </span>`)}`)}
            ${n===0?o`<div class="template-cat-hint template-preview-none">${a("beta_template_none",e)}</div>`:h}
            <div class="template-preview-actions">
              <ha-button class="template-preview-create" .disabled=${n===0||this._templateBusy}
                @click=${()=>this._createFromTemplate(t.id,i.filter((u,p)=>s.has(p)).map(u=>u.name))}>
                ${_t("beta_template_create","beta_template_create_one",n,e)}
              </ha-button>
            </div>
          </div>
        </div>
      </div>
    `}_renderTemplateGallery(){if(!this._templateGalleryOpen)return h;if(this._templatePreview)return this._renderTemplatePreview(this._templatePreview);let t=this._lang,e=new Map;for(let n of this._templates)e.has(n.category)||e.set(n.category,[]),e.get(n.category).push(n);for(let n of e.values())n.sort((c,d)=>+!!c.dwelling_mismatch-+!!d.dwelling_mismatch);let i=this._templates.filter(n=>n.recommended&&!n.set_up),s=this._templateParentId?this._objects.find(n=>n.entry_id===this._templateParentId):void 0;return o`
      <div class="palette-backdrop top-layer" popover="manual" ${_e} @click=${()=>{this._templateGalleryOpen=!1}}>
        <div class="template-gallery" @click=${n=>n.stopPropagation()}>
          <div class="template-gallery-head">
            <span>${a("templates_title",t)}</span>
            <ha-icon-button .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
              @click=${()=>{this._templateGalleryOpen=!1}}></ha-icon-button>
          </div>
          <div class="template-gallery-body">
            ${s?o`
              <div class="template-parent-hint">
                <ha-icon icon="mdi:file-tree-outline"></ha-icon>
                <span>${a("templates_inside",t).replace("{name}",s.object.name)}</span>
              </div>`:h}
            <div class="template-legal">
              <ha-icon icon="mdi:scale-balance"></ha-icon>
              <span>${a("templates_legal_hint",t)}</span>
            </div>
            ${i.length>0?o`
                  <div class="template-cat recommended">
                    <div class="template-cat-head">
                      <ha-icon icon="mdi:home-heart"></ha-icon>
                      ${a("templates_recommended_title",t)}
                    </div>
                    <div class="template-cat-hint">${a("templates_recommended_hint",t)}</div>
                    <div class="template-grid">${i.map(n=>this._renderTemplateCard(n,!0))}</div>
                  </div>`:h}
            ${this._templates.length===0?o`<div class="palette-empty">${a("loading",t)}…</div>`:[...e.entries()].map(([n,c])=>o`
                  <div class="template-cat">
                    <div class="template-cat-head">
                      <ha-icon icon="${this._templateCategories[n]?.icon||"mdi:folder-outline"}"></ha-icon>
                      ${this._categoryName(n)}
                    </div>
                    <div class="template-grid">${c.map(d=>this._renderTemplateCard(d))}</div>
                  </div>
                `)}
          </div>
        </div>
      </div>
    `}_bulkKey(t){return`${t.entry_id}:${t.task_id}`}_toggleBulkMode(){this._bulkMode=!this._bulkMode,this._bulkMenuOpen=!1,this._bulkMode||(this._bulkSelected=new Set)}_toggleBulkRow(t){let e=this._bulkKey(t),i=new Set(this._bulkSelected);i.has(e)?i.delete(e):i.add(e),this._bulkSelected=i}_bulkSelectAll(t){let e=t.map(s=>this._bulkKey(s)),i=e.every(s=>this._bulkSelected.has(s));this._bulkSelected=i?new Set:new Set(e)}async _runBulkItems(t,e,i,s,n){if(t.length===0)return;this._actionLoading=!0;let{done:c,failed:d}=await ra(this,t,e);this._actionLoading=!1,s(),await this._loadData();let u=Yi(i(c.length),d,this._lang);n&&c.length>0?this._showUndoToast(u,()=>n(c)):this._showToast(u,d.length>0?"error":"info")}_runBulk(t,e,i,s){return this._runBulkItems(t.filter(n=>this._bulkSelected.has(this._bulkKey(n))),e,i,()=>{this._bulkSelected=new Set,this._bulkMode=!1},s)}async _bulkMove(t){let e=this._objects.filter(c=>!c.object.archived_at).sort((c,d)=>(c.object.name||"").localeCompare(d.object.name||""));if(!e.length||this._bulkSelected.size===0)return;let s=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("move_task_title",this._lang),message:a("bulk_move_message",this._lang),confirmText:a("move_task_title",this._lang),inputLabel:a("move_task_target",this._lang),inputValue:e[0].entry_id,options:e.map(c=>({value:c.entry_id,label:c.object.name||c.entry_id}))});if(!s?.confirmed||!s.value)return;let n=s.value;await this._runBulk(t.filter(c=>c.entry_id!==n),c=>({type:"maintenance_supporter/task/move",entry_id:c.entry_id,task_id:c.task_id,target_entry_id:n}),c=>a("bulk_moved",this._lang).replace("{n}",String(c)))}_toggleObjBulkMode(){this._objBulkMode=!this._objBulkMode,this._objBulkMode||(this._objBulkSelected=new Set)}_toggleObjBulk(t){let e=new Set(this._objBulkSelected);e.has(t)?e.delete(t):e.add(t),this._objBulkSelected=e}_objBulkSelectAll(t){let e=t.map(s=>s.entry_id),i=e.length>0&&e.every(s=>this._objBulkSelected.has(s));this._objBulkSelected=i?new Set:new Set(e)}_runObjBulk(t,e,i,s={}){return this._runBulkItems([...this._objBulkSelected],n=>({type:t,entry_id:n,...s}),e,()=>{this._objBulkSelected=new Set,this._objBulkMode=!1},i?n=>{i(n)}:void 0)}async _objBulkDelete(){let t=this._objBulkSelected.size;t===0||!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:a("delete",this._lang),message:a("bulk_delete_objects_confirm",this._lang).replace("{n}",String(t)),confirmText:a("delete",this._lang),danger:!0})||await this._runObjBulk("maintenance_supporter/object/delete",s=>a("bulk_objects_deleted",this._lang).replace("{n}",String(s)))}async _objBulkArea(){let t=[...this._objBulkSelected];if(t.length===0)return;let e=Object.values(this.hass?.areas||{}).sort((c,d)=>c.name.localeCompare(d.name)),s=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("area",this._lang),message:a("bulk_n_selected",this._lang).replace("{n}",String(t.length)),confirmText:a("save",this._lang),inputLabel:a("area",this._lang),inputValue:"",options:[{value:"",label:a("no_area",this._lang)},...e.map(c=>({value:c.area_id,label:c.name}))]});if(!s?.confirmed)return;let n=new Map(t.map(c=>[c,this._getObject(c)?.object.area_id??null]));this._runObjBulk("maintenance_supporter/object/update",c=>a("bulk_objects_area",this._lang).replace("{n}",String(c)),async c=>{for(let d of c)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:d,area_id:n.get(d)??null})}catch{}await this._loadData()},{area_id:s.value||null})}_objBulkArchive(){this._runObjBulk("maintenance_supporter/object/archive",t=>a("bulk_objects_archived",this._lang).replace("{n}",String(t)),async t=>{for(let e of t)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/unarchive",entry_id:e,undo:!0})}catch{}await this._loadData()})}_renderObjBulkBar(t,e){let i=this._objBulkSelected.size,s=t.length>0&&t.every(n=>this._objBulkSelected.has(n.entry_id));return o`
      <div class="bulk-bar obj-bulk-bar">
        ${te({cls:"bulk-selectall",checked:s,onChange:()=>this._objBulkSelectAll(t)},o`${a("bulk_select_all",e)}`)}
        <span class="bulk-count">${a("bulk_n_selected",e).replace("{n}",String(i))}</span>
        <span class="bulk-actions">
          <ha-button appearance="plain" class="obj-bulk-area" .disabled=${i===0||this._actionLoading} @click=${()=>{this._objBulkArea()}}>
            <ha-icon icon="mdi:floor-plan"></ha-icon> ${a("area",e)}…
          </ha-button>
          <ha-button appearance="plain" class="obj-bulk-archive" .disabled=${i===0||this._actionLoading} @click=${()=>this._objBulkArchive()}>
            <ha-icon icon="mdi:archive-outline"></ha-icon> ${a("archive",e)}
          </ha-button>
          <ha-button appearance="filled" variant="danger" class="obj-bulk-delete" .disabled=${i===0||this._actionLoading} @click=${()=>this._objBulkDelete()}>
            <ha-icon icon="mdi:delete-outline"></ha-icon> ${a("delete",e)}
          </ha-button>
        </span>
      </div>
    `}_bulkComplete(t){this._runBulk(t,e=>({type:"maintenance_supporter/task/complete",entry_id:e.entry_id,task_id:e.task_id}),e=>a("bulk_completed",this._lang).replace("{n}",String(e)))}_bulkArchive(t){this._runBulk(t,e=>({type:"maintenance_supporter/task/archive",entry_id:e.entry_id,task_id:e.task_id}),e=>a("bulk_archived",this._lang).replace("{n}",String(e)),async e=>{for(let i of e)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/unarchive",entry_id:i.entry_id,task_id:i.task_id,undo:!0})}catch{}await this._loadData()})}async _bulkEdit(t,e){let i=e.filter(d=>this._bulkSelected.has(this._bulkKey(d)));if(i.length===0)return;let s=await this._ui("maintenance-bulk-edit-dialog"),n=this._userService?await this._userService.getUsers():[],c=await s?.open(t,i,n);c&&await this._sendBulkUpdate(i.map(d=>({entry_id:d.entry_id,task_id:d.task_id})),c)}async _sendBulkUpdate(t,e){let i=await I(this,{type:"maintenance_supporter/tasks/update_many",items:t,...e?{changes:e}:{}},{busy:d=>{this._actionLoading=d},onError:d=>this._showToast(d,"error")});if(!i)return;let s=e===null;s||(this._bulkSelected=new Set,this._bulkMode=!1),await this._loadData();let n=na(i.failed,this._lang),c=Yi(a("bulk_updated",this._lang).replace("{n}",String(i.updated.length)),n,this._lang);!s&&i.previous.length>0?this._showUndoToast(c,()=>{this._sendBulkUpdate(i.previous,null)}):this._showToast(c,n.length>0?"error":"info")}async _bulkPause(t){let e=t.filter(n=>this._bulkSelected.has(this._bulkKey(n))&&n.status!=="paused");if(e.length===0)return;let s=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("pause_task",this._lang),message:a("pause_task_prompt",this._lang),confirmText:a("pause_task",this._lang),inputLabel:a("pause_until_label",this._lang),inputType:"date"});s?.confirmed&&this._runBulk(e,n=>({type:"maintenance_supporter/task/pause",entry_id:n.entry_id,task_id:n.task_id,...s.value?{until:s.value}:{}}),n=>a("bulk_paused",this._lang).replace("{n}",String(n)),async n=>{for(let c of n)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/resume",entry_id:c.entry_id,task_id:c.task_id,undo:!0})}catch{}await this._loadData()})}_bulkResume(t){this._runBulk(t.filter(e=>e.status==="paused"),e=>({type:"maintenance_supporter/task/resume",entry_id:e.entry_id,task_id:e.task_id}),e=>a("bulk_resumed",this._lang).replace("{n}",String(e)))}async _runAction(t,e){let i=await I(this,t,{busy:s=>{this._actionLoading=s},reload:()=>this._loadData(),successToast:e?.successToast,onSuccess:s=>this._showToast(s,"info"),onError:s=>this._showToast(s)});return i===void 0?null:i??{}}async _deleteObject(t){if(!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:a("delete",this._lang),message:a("delete_object_confirm",this._lang),confirmText:a("delete",this._lang),danger:!0}))return;await this._runAction({type:"maintenance_supporter/object/delete",entry_id:t})&&this._showOverview()}_printObjectReport(t){let e=this._getObject(t);if(!e)return;let i=this._lang,s={title:a("report_title",i),generated:a("report_generated",i),manufacturer:a("manufacturer",i),model:a("model",i),serial:a("serial_number_label",i),installed:a("installed",i),warranty:a("warranty",i),area:a("area",i),notes:a("report_notes",i),tasksHeading:a("tasks",i),colTask:a("task_name",i),colType:a("report_col_type",i),colStatus:a("report_col_status",i),colSchedule:a("report_col_schedule",i),colLastDone:a("last_performed",i),colNextDue:a("next_due",i),colCost:a("cost",i),colTimes:a("report_times_done",i),totalCost:a("report_total_cost",i),scheduleLabel:c=>Ht(c,i),none:"\u2014",statusLabel:c=>a(c,i),typeLabel:c=>a(c,i)},n=mr(e.object,e.tasks,s,c=>c?U(c,i):"",c=>Y(c,this._currencySymbol,i),new Date().toISOString());Pe(n)}async _duplicateObject(t){let e=await this._runAction({type:"maintenance_supporter/object/duplicate",entry_id:t},{successToast:a("object_duplicated",this._lang)});e?.entry_id&&this._showObject(e.entry_id)}async _deleteTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog"),s=await aa(i,this._getTask(t,e),this._lang);if(!s)return;await this._runAction({type:"maintenance_supporter/task/delete",entry_id:t,task_id:e,...s})&&this._showObject(t)}async _duplicateTask(t,e){this._moreMenuOpen=!1;let i=await this._runAction({type:"maintenance_supporter/task/duplicate",entry_id:t,task_id:e},{successToast:a("task_duplicated",this._lang)});i?.task_id&&this._showTask(t,i.task_id)}async _moveTask(t,e){this._moreMenuOpen=!1;let i=this._objects.filter(d=>d.entry_id!==t&&!d.object.archived_at).sort((d,u)=>(d.object.name||"").localeCompare(u.object.name||""));if(!i.length)return;let n=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("move_task_title",this._lang),message:a("move_task_message",this._lang),confirmText:a("move_task_title",this._lang),inputLabel:a("move_task_target",this._lang),inputValue:i[0].entry_id,options:i.map(d=>({value:d.entry_id,label:d.object.name||d.entry_id}))});if(!n?.confirmed||!n.value)return;let c=await this._runAction({type:"maintenance_supporter/task/move",entry_id:t,task_id:e,target_entry_id:n.value},{successToast:a("task_moved",this._lang)});c?.entry_id&&c.task_id&&this._showTask(c.entry_id,c.task_id)}async _toggleArchiveTask(t,e,i,s=!1){await this._runAction({type:i?"maintenance_supporter/task/unarchive":"maintenance_supporter/task/archive",entry_id:t,task_id:e,...s?{undo:!0}:{}})&&!i&&this._showUndoToast(a("task_archived",this._lang),()=>this._toggleArchiveTask(t,e,!0,!0))}async _togglePauseTask(t,e,i,s=!1){if(!i){let c=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("pause_task",this._lang),message:a("pause_task_prompt",this._lang),confirmText:a("pause_task",this._lang),inputLabel:a("pause_until_label",this._lang),inputType:"date"});if(!c?.confirmed)return;let d={type:"maintenance_supporter/task/pause",entry_id:t,task_id:e};c.value&&(d.until=c.value),await this._runAction(d)&&this._showUndoToast(a("task_paused",this._lang),()=>this._togglePauseTask(t,e,!0,!0));return}await this._runAction({type:"maintenance_supporter/task/resume",entry_id:t,task_id:e,...s?{undo:!0}:{}},{successToast:a("task_resumed",this._lang)})}async _toggleArchiveObject(t,e,i=!1){await this._runAction({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:t,...i?{undo:!0}:{}})&&!e&&this._showUndoToast(a("object_archived",this._lang),()=>this._toggleArchiveObject(t,!0,!0))}async _togglePauseObject(t,e,i=!1){if(!e){let n=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("pause_object",this._lang),message:a("pause_until_prompt",this._lang),confirmText:a("pause_object",this._lang),inputLabel:a("pause_until_label",this._lang),inputType:"date"});if(!n?.confirmed)return;let c={type:"maintenance_supporter/object/pause",entry_id:t};n.value&&(c.until=n.value),await this._runAction(c)&&this._showUndoToast(a("object_paused",this._lang),()=>this._togglePauseObject(t,!0,!0));return}await this._runAction({type:"maintenance_supporter/object/resume",entry_id:t,...i?{undo:!0}:{}},{successToast:a("object_resumed",this._lang)})}_replaceObject(t,e){this._ui("maintenance-object-dialog").then(i=>i?.openReplace(t,e))}_deviceSwapText(t){if(!t||!t.moved&&!t.unmatched.length)return"";let e=[];return t.moved&&e.push(_t("device_swap_moved","device_swap_moved_one",t.moved,this._lang,"count")),t.unmatched.length&&e.push(_t("device_swap_unmatched","device_swap_unmatched_one",t.unmatched.length,this._lang,"count")),e.join(" ")}async _skipTask(t,e,i){let s={type:"maintenance_supporter/task/skip",entry_id:t,task_id:e};i&&(s.reason=i),await this._runAction(s)}async _resetTask(t,e,i){let s={type:"maintenance_supporter/task/reset",entry_id:t,task_id:e};i&&(s.date=i),await this._runAction(s)}async _applySuggestion(t,e,i){await this._runAction({type:"maintenance_supporter/task/apply_suggestion",entry_id:t,task_id:e,interval:i})}_openSeasonalOverrides(t){let e=this.shadowRoot.querySelector("maintenance-seasonal-overrides-dialog");if(!e||!this._selectedEntryId)return;let i=t.adaptive_config?.seasonal_overrides;e.open(this._selectedEntryId,t.id,i)}async _reanalyzeInterval(t,e){let i=await this._runAction({type:"maintenance_supporter/task/analyze_interval",entry_id:t,task_id:e});i&&(i.recommended_interval?this._showToast(`${a("reanalyze_result",this._lang)}: ${Ze(i.recommended_interval,this._lang)} (${a(`confidence_${i.confidence}`,this._lang)}, ${i.data_points} ${a("data_points",this._lang)})`,"info"):this._showToast(a("reanalyze_insufficient_data",this._lang),"info"))}async _promptSkipTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let s=await i.prompt({title:a("skip",this._lang),message:a("skip_reason_prompt",this._lang),confirmText:a("skip",this._lang),inputLabel:a("reason_optional",this._lang),inputType:"text"});s.confirmed&&this._skipTask(t,e,s.value||void 0)}async _promptResetTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let s=await i.prompt({title:a("reset",this._lang),message:a("reset_date_prompt",this._lang),confirmText:a("reset",this._lang),inputLabel:a("reset_date_optional",this._lang),inputType:"date"});s.confirmed&&this._resetTask(t,e,s.value||void 0)}async _postponeTask(t,e,i){await this._runAction({type:"maintenance_supporter/task/postpone",entry_id:t,task_id:e,until:i},{successToast:a("postponed",this._lang)})}async _promptPostponeTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let s=await i.prompt({title:a("postpone",this._lang),message:a("postpone_date_prompt",this._lang),confirmText:a("postpone",this._lang),inputLabel:a("postpone_date_label",this._lang),inputType:"date"});!s.confirmed||!s.value||this._postponeTask(t,e,s.value)}async _snoozeTask(t,e){let i=await this._runAction({type:"maintenance_supporter/task/snooze",entry_id:t,task_id:e});i&&this._showToast(Ga(i,this._lang),"info")}_dismissSuggestion(t,e){t&&e&&this._dismissedSuggestions.add(`${t}_${e}`),this.requestUpdate()}async _handleQuickComplete(t,e,i,s="qr"){let n=null,c=await I(this,{type:"maintenance_supporter/task/quick_complete",entry_id:t,task_id:e,source:s},{fallbackKey:"action_error",onError:(u,p)=>{n={message:u,code:p?.code||""}}});if(c===void 0){let{message:u,code:p}=n??{message:"",code:""};p==="no_defaults"||p==="completion_details_required"||p==="tag_scan_required"?this._openCompleteDialog(t,e,i.name,this._features.checklists?i.checklist:void 0,this._features.adaptive&&!!i.adaptive_config?.enabled,{viaTagScan:s==="qr",details:!0}):this._showToast(u);return}let d=la(c,this._lang);if(d){this._showToast(d,"info");return}c?.undo?this._offerUndo(t,e,a("quick_complete_success",this._lang)):this._showToast(a("quick_complete_success",this._lang),"info");try{await this._loadData()}catch{}}async _printTaskWorksheet(t,e){let i=this._getObject(t),s=i?.tasks.find(d=>d.id===e);if(!i||!s)return;let n=ii(),c=!1;this._actionLoading=!0;try{let d={type:"maintenance_supporter/qr/generate",entry_id:t,task_id:e,url_mode:"server"},[u,p]=await Promise.all([this.hass.connection.sendMessagePromise({...d,action:"view"}).catch(()=>null),this.hass.connection.sendMessagePromise({...d,action:"complete"}).catch(()=>null)]),_=null;try{let k=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:t})).documents||[]).find(w=>w.kind==="file"&&w.mime==="application/pdf"&&(w.task_ids||[]).includes(e)&&w.task_pages?.[e]);if(k){let w=k.task_pages[e],E=4,v={path:await sa(this.hass,`/api/maintenance_supporter/document/${k.id}/excerpt?start=${w}&count=${E}`,3600)};_={title:gt(k)||"Manual",startPage:w,endPage:w+E-1,url:new URL(v.path,window.location.origin).toString(),vendorBase:new URL("/maintenance_supporter_vendor",window.location.origin).toString()}}}catch{}let g=this._lang,b={title:a("worksheet",g),object:a("object",g),type:a("maintenance_type",g),interval:a("interval",g),nextDue:a("next_due",g),lastDone:a("last_performed",g),priority:a("priority",g),checklist:a("checklist",g),notes:a("notes_label",g),scanView:a("worksheet_scan_view",g),scanComplete:a("worksheet_scan_complete",g),manualExcerpt:a("worksheet_manual_excerpt",g),pages:a("worksheet_pages",g),printedOn:a("worksheet_printed",g),never:a("worksheet_never",g),typeLabel:y=>a(y,g),statusLabel:y=>a(y,g),priorityLabel:y=>a(`priority_${y}`,g),parts:a("consumes_parts_label",g)},x=(s.consumes_parts||[]).map(y=>ua(y,i.entry_id,this._objects,g)),T=_r(s,i.object.name,b,y=>U(y,g),y=>Ht(y,g),u?.svg_data_uri||null,p?.svg_data_uri||null,_,new Date().toISOString(),x,Pt(i.object,s));Pe(T,n),c=!0}finally{c||n?.close(),this._actionLoading=!1}}_openManualDoc(t){if(t.kind!=="file"){ct(t.url)&&window.open(t.url,"_blank","noopener");return}Lt(this.hass,t.id).catch(()=>{})}_setChecklistItem(t,e,i,s){let n=`${t}/${e}`;this._checklistPending.set(n,{...this._checklistPending.get(n)??{},[i]:s});let c=this._checklistChain.then(async()=>{let d=this._getObject(t)?.tasks.find(b=>b.id===e);if(!d)return;let u=this._checklistPending.get(n)??{},p={},_=oi(d)?.checklist??(d.checklist||[]);for(let b of _)p[b]=b in u?u[b]:d.checklist_progress?.[b]??!1;await this._runAction({type:"maintenance_supporter/task/checklist_progress",entry_id:t,task_id:e,checklist_state:p});let g=this._checklistPending.get(n);if(g){for(let[b,x]of Object.entries(p))b in g&&g[b]===x&&delete g[b];Object.keys(g).length===0&&this._checklistPending.delete(n)}});return this._checklistChain=c.catch(()=>{}),c}_openCompleteDialog(t,e,i,s,n,c){let d=this._getTask(t,e);if(!c?.details&&!c?.viaTagScan&&d&&re(d)){this._handleQuickComplete(t,e,d,"panel");return}this._ui("maintenance-complete-dialog").then(u=>u&&this._fillAndOpenCompleteDialog(u,t,e,i,s,n,c))}_fillAndOpenCompleteDialog(t,e,i,s,n,c,d){xa(t,ya({entryId:e,taskId:i,taskName:s,task:this._getTask(e,i),objects:this._objects,lang:this._lang,checklist:n,features:this._features,adaptiveEnabled:c,currencySymbol:this._currencySymbol,viaTagScan:d?.viaTagScan,partsCostMode:this._partsCostMode}),this._lang)}_openQrForObject(t,e){this._ui("maintenance-qr-dialog").then(i=>i?.openForObject(t,e))}_openQrForTask(t,e,i,s){this._ui("maintenance-qr-dialog").then(n=>n?.openForTask(t,e,i,s))}_offerUndo(t,e,i){this._showUndoToast(i,()=>{this._undoCompletion(t,e)})}async _undoCompletion(t,e){let i=await oa(this.hass,t,e,this._lang);this._showToast(i.message,i.ok?"info":"error"),i.ok&&await this._onDialogEvent()}render(){return o`
      <div class="panel">
        ${this._restartPendingVersion?o`
              <div class="update-banner restart-pending-banner" role="status">
                <ha-icon icon="mdi:restart"></ha-icon>
                <span>${a("restart_pending_banner",this._lang).replace("{version}",this._restartPendingVersion)}</span>
              </div>
            `:h}
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
        <div class="content">${cs(this._renderView())}</div>
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
      ${this._toastMessage?o`<div class="toast ${this._toastKind}" role=${this._toastKind==="error"?"alert":"status"}>
        <span>${this._toastMessage}</span>
        ${this._toastUndo?o`<button class="toast-undo" @click=${()=>this._runToastUndo()}>${this._toastActionLabel||a("undo",this._lang)}</button>`:h}
      </div>`:h}
      ${this._renderPalette()}
      ${this._renderTemplateGallery()}
    `}_renderSearchButton(t){let e=this._lang;return o`<ha-icon-button
      class=${t}
      .path=${qo}
      .label=${a("search_open",e)}
      title=${a("search_open",e)}
      @click=${()=>this._openPalette()}
    ></ha-icon-button>`}_renderView(){return this._view==="overview"?this._renderOverview():this._view==="all_objects"?this._renderAllObjects():[this._view==="all_parts"?this._renderAllParts():this._view==="all_areas"?this._renderAllAreas():this._view==="area"?this._renderArea():this._view==="object"?this._renderObjectDetail():this._renderTaskDetail()]}_renderHeader(){let t=[{label:a("maintenance",this._lang),action:()=>this._showOverview()}],e=(this._view==="object"||this._view==="task")&&this._selectedEntryId?rs(this._objects,this._selectedEntryId):[];for(let i of this.narrow?e.slice(-1):e)t.push({label:i.object.name,action:()=>this._showObject(i.entry_id)});if(this._view==="object"&&this._selectedEntryId){let i=this._getObject(this._selectedEntryId);t.push({label:i?.object.name||"Object"})}if(this._view==="task"&&this._selectedEntryId&&this._selectedTaskId){let i=this._getObject(this._selectedEntryId);t.push({label:i?.object.name||"Object",action:()=>this._showObject(this._selectedEntryId)});let s=this._getTask(this._selectedEntryId,this._selectedTaskId);t.push({label:s?.name||"Task"})}return this._view==="area"&&this._selectedAreaId&&(t.push({label:a("all_areas",this._lang),action:()=>this._showAllAreas()}),t.push({label:Ji(this._selectedAreaId,this.hass?.areas,a("no_area",this._lang))})),o`
      <div class="header">
        ${this.narrow&&!this.embedded?o`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`:h}
        ${this._view!=="overview"?o`<ha-icon-button
              .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
              @click=${()=>{this._view==="task"?this._showObject(this._selectedEntryId):this._view==="area"?this._showAllAreas():this._view==="object"&&e.length?this._showObject(e[e.length-1].entry_id):this._showOverview(!0)}}
            ></ha-icon-button>`:h}
        <div class="breadcrumbs">
          ${(dt()&&this.narrow?t.slice(-1):t).map((i,s)=>o`
              ${s>0?o`<span class="sep">/</span>`:h}
              ${i.action?o`<a @click=${i.action}>${i.label}</a>`:o`<span class="current">${i.label}</span>`}
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
      ${Ii([{key:"today",label:a("tab_today",t)},{key:"dashboard",label:a("dashboard",t)},{key:"calendar",label:a("tab_calendar",t)},e&&{key:"settings",label:a("settings",t)}],this._overviewTab,s=>this._setOverviewTab(s),this.narrow?h:this._renderSearchButton("tab-search"))}
      ${cs(this._overviewTab==="today"?this._renderToday():this._overviewTab==="dashboard"?this._renderDashboard():pr(this._viewEntry,this._overviewTab==="calendar"?o`
            <div @ll-custom=${this._onCalendarLlCustom} @maintenance-supporter-open-task=${this._onCalendarOpenTask}>
              <maintenance-supporter-calendar-card
                .hass=${this.hass}
              ></maintenance-supporter-calendar-card>
            </div>
          `:o`<maintenance-settings-view
            .hass=${this.hass}
            .features=${this._features}
            .budget=${this._budget}
            @settings-changed=${this._onSettingsChanged}
          ></maintenance-settings-view>`))}
    `}_statusBadge(t){return xi(t,this._lang)}_setOverviewTab(t){this._overviewTab=t;try{q(P.overviewTab,t)}catch{}this._scrollContentToTop()}_renderToday(){let t=this._lang,e=this._rowsFiltered(!1),i=p=>`${p.entry_id}:${p.task_id}`,s=e.filter(p=>p.status==="overdue"),n=e.filter(p=>p.status==="triggered"),c=new Set([...s,...n].map(i)),d=e.filter(p=>!c.has(i(p))&&p.days_until_due===0);d.forEach(p=>c.add(i(p)));let u=e.filter(p=>!c.has(i(p))&&p.days_until_due!=null&&p.days_until_due>0&&p.days_until_due<=7);return s.length+n.length+d.length+u.length===0?o`
        <div class="today-empty">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <p>${a("today_all_caught_up",t)}</p>
        </div>
      `:o`
      <div class="today-view">
        ${this._renderTodaySection("today_overdue",s,"overdue")}
        ${this._renderTodaySection("triggered",n,"triggered")}
        ${this._renderTodaySection("today_due_today",d,"due_soon")}
        ${this._renderTodaySection("today_this_week",u,"")}
      </div>
    `}_peopleOf(t){return Ft(t).map(e=>this._userService?.getPerson(e)??null)}_renderTodaySection(t,e,i){if(e.length===0)return h;let s=this._lang,n=c=>this._filterUser?[]:this._peopleOf(c);return o`
      <div class="today-section">
        <div class="today-section-header ${i}">
          <span>${a(t,s)}</span><span class="today-badge">${e.length}</span>
        </div>
        ${e.map(c=>o`
          <div class="today-row" @click=${()=>this._showTask(c.entry_id,c.task_id)}>
            <span class="today-dot ${c.trigger_active?"triggered":c.status}"></span>
            <div class="today-main">
              <div class="today-task">${this._listRef(c.entry_id,c.task_id)}${c.task_name}${we(c.next_event_titles)}${ke(c.trigger_detail)}</div>
              <div class="today-object">
                <span class="today-object-text">${c.object_name} · ${c.days_until_due==null?xs(c.last_performed,s)??"\u2014":Mt(c.days_until_due,s)}</span>
                ${Zi(n(c),"today-person")}
              </div>
            </div>
            ${this._renderRowActions(s,()=>this._openCompleteDialogForRow(c),void 0,!1,this._isQuick(c))}
          </div>
        `)}
      </div>
    `}_renderDashboard(){let t=this._stats,e=this._taskRows,i=this._lang,s=this._isOperator,n=this._objects.reduce((y,k)=>y+k.tasks.filter(w=>w.archived).length,0),c=new Set;for(let y of this._objects)for(let k of y.tasks)for(let w of Ft(k))c.add(w);this._filterUser&&this._filterUser!=="current_user"&&c.add(this._filterUser);let d=[...c].map(y=>({id:y,name:this._userService?.getUserName(y)??null})).filter(y=>y.name!==null||y.id===this._filterUser).sort((y,k)=>(y.name??"").localeCompare(k.name??"")),u=(this._filterStatus?1:0)+(this._filterUser?1:0)+(this._filterLabel?1:0)+(this._filterPlace?1:0)+(this._filterPriority?1:0)+(this._activeViewId?1:0),p=!!(this._selectedEntryId&&this._selectedTaskId&&this._getTask(this._selectedEntryId,this._selectedTaskId)),_=this._splitActive()&&!(dt()&&this._filterPaneOpen&&!this.wide&&!p),g=o`
      ${this.narrow?o`
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
        ${this._filterSelect(a("views_label",i),this._activeViewId,y=>this._applyView(y.target.value),o`
            <option value="">${a("views_none",i)}</option>
            ${this._savedViews.map(y=>o`<option value=${y.id} ?selected=${this._activeViewId===y.id}>${y.name}</option>`)}
        `)}
        ${s?h:o`
          <ha-icon-button
            class="views-save-btn"
            .path=${"M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"}
            .label=${a("views_manage",i)}
            title=${a("views_manage",i)}
            @click=${()=>this._openSavedViewsDialog()}
          ></ha-icon-button>
        `}
        ${this._filterSelect(a("filter_label",i),this._filterStatus,y=>{this._filterStatus=y.target.value,this._activeViewId=""},o`
            <option value="">${a("all",i)}</option>
            ${js.map(y=>o`<option value=${y} ?selected=${this._filterStatus===y}>${a(y,i)}</option>`)}
        `)}
        ${this._filterSelect(a("user_label",i),this._filterUser||"",y=>{let k=y.target.value;this._filterUser=k||null,this._activeViewId=""},o`
            <option value="">${a("all_users",i)}</option>
            <option value="current_user" ?selected=${this._filterUser==="current_user"}>${a("my_tasks",i)}</option>
            ${d.map(y=>o`<option value=${y.id} ?selected=${this._filterUser===y.id}>${y.name??y.id}</option>`)}
        `)}
        ${this._allLabels.length>0?o`
          ${this._filterSelect(a("label_filter",i),this._filterLabel||"",y=>{let k=y.target.value;this._filterLabel=k||null,this._activeViewId=""},o`
              <option value="">${a("all_labels",i)}</option>
              ${this._allLabels.map(y=>o`<option value=${y} ?selected=${this._filterLabel===y}>${y}</option>`)}
          `)}
        `:h}
        ${this._features.places&&this._allPlaces.length>0?o`
          ${this._filterSelect(a("filter_place",i),this._filterPlace,y=>{this._filterPlace=y.target.value,this._activeViewId=""},o`
              <option value="">${a("filter_place_all",i)}</option>
              <option value="home" ?selected=${this._filterPlace==="home"}>${a("place_home",i)}</option>
              ${this._allPlaces.map(y=>o`<option value=${y.id} ?selected=${this._filterPlace===y.id}>${y.name}</option>`)}
          `)}
        `:h}
        ${this._filterSelect(a("priority",i),this._filterPriority,y=>{this._filterPriority=y.target.value,this._activeViewId=""},o`
            <option value="">${a("all_priorities",i)}</option>
            ${ns.map(y=>o`<option value=${y} ?selected=${this._filterPriority===y}>${a(`priority_${y}`,i)}</option>`)}
        `)}
        ${this._filterSelect(a("sort_label",i),this._sortMode,y=>{this._sortMode=y.target.value,this._activeViewId="";try{q(P.taskSort,this._sortMode)}catch{}},o`
            <option value="due_date" ?selected=${this._sortMode==="due_date"}>${a("sort_due_date",i)}</option>
            <option value="object" ?selected=${this._sortMode==="object"}>${a("sort_object",i)}</option>
            <option value="type" ?selected=${this._sortMode==="type"}>${a("sort_type",i)}</option>
            <option value="task_name" ?selected=${this._sortMode==="task_name"}>${a("sort_task_name",i)}</option>
            <option value="area" ?selected=${this._sortMode==="area"}>${a("sort_area",i)}</option>
            <option value="assigned_user" ?selected=${this._sortMode==="assigned_user"}>${a("sort_assigned_user",i)}</option>
            <option value="group" ?selected=${this._sortMode==="group"}>${a("sort_group",i)}</option>
        `)}
        ${this._filterSelect(a("group_by_label",i),this._groupByMode,y=>{this._groupByMode=y.target.value,this._activeViewId="";try{q(P.groupBy,this._groupByMode)}catch{}},o`
            <option value="none" ?selected=${this._groupByMode==="none"}>${a("groupby_none",i)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${a("groupby_area",i)}</option>
            ${this._features.groups?o`<option value="group" ?selected=${this._groupByMode==="group"}>${a("groupby_group",i)}</option>`:h}
            <option value="user" ?selected=${this._groupByMode==="user"}>${a("groupby_user",i)}</option>
            <option value="object" ?selected=${this._groupByMode==="object"}>${a("groupby_object",i)}</option>
        `)}
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
    `,b=s?h:this._renderGettingStartedChips(i),x=o`
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
                  <ha-button appearance="plain" @click=${()=>this._ui("maintenance-object-dialog").then(y=>y?.openCreate())}>
                    ${a("new_object",i)}
                  </ha-button>
                </div>
              `:h}
            </div>
          `:o`
            ${this._bulkMode?this._renderBulkBar(e,i):h}
            ${_?o`
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
    `,T=dt()&&ie();return o`
      ${T?o`
            <div class="ms-list-layout ${this._filterPaneOpen?"with-pane":""}">
              ${this._filterPaneOpen?this._renderFilterPane(d,n,s,i):h}
              <div class="ms-list-main">
                ${this._renderBetaToolbar(this._rowsFiltered(!0,!1).length,u,s,i)}
                ${b}${x}
              </div>
            </div>
            ${s?h:this._renderNewMenu(i,!this.embedded)}`:o`${g}${b}${x}`}

      ${this._features.groups&&!s?this._renderGroupsSection():h}
      ${s?h:o`<maintenance-storage-section-card
            .hass=${this.hass}
            .objects=${this._objects}
            @open-object=${y=>{let k=y.detail?.entry_id;k&&this._showObject(k)}}
          ></maintenance-storage-section-card>`}
    `}_renderBetaToolbar(t,e,i,s){let n={none:a("groupby_none",s),area:a("sort_area",s),group:a("sort_group",s),user:a("sort_assigned_user",s),object:a("object",s)},c={due_date:a("sort_due_date",s),object:a("sort_object",s),type:a("sort_type",s),task_name:a("sort_task_name",s),area:a("sort_area",s),assigned_user:a("sort_assigned_user",s),group:a("sort_group",s)},d=g=>o`<button class="ms-chip" slot="trigger" type="button">
      <span>${g}</span><ha-icon class="ms-chip-caret" icon="mdi:menu-down"></ha-icon></button>`,u=Ss.filter(g=>g!=="group"||this._features.groups),p=Li.filter(g=>g!=="group"||this._features.groups),_=this._groupByMode;return o`
      <div class="ms-toolbar">
        ${this._filterPaneOpen?h:o`
          <button class="ms-chip ${e?"active":""}" type="button" aria-expanded="false" @click=${()=>this._toggleFilterPane()}>
            <ha-icon icon="mdi:filter-variant"></ha-icon><span>${a("beta_filters",s)}</span>
            ${e?o`<span class="ms-chip-badge">${e}</span>`:h}
          </button>`}
        ${!i&&t>0?o`
          <button class="ms-chip icon-only ${this._bulkMode?"active":""}" type="button" title=${a("bulk_select",s)} aria-label=${a("bulk_select",s)}
            aria-pressed=${this._bulkMode?"true":"false"} @click=${()=>this._toggleBulkMode()}>
            <ha-icon icon="mdi:order-bool-ascending-variant"></ha-icon>
          </button>`:h}
        <label class="ms-search">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input type="search" .value=${this._listSearchDraft} placeholder=${a("beta_search_tasks",s).replace("{count}",String(t))}
            aria-label=${a("beta_search_tasks",s).replace("{count}",String(t))}
            @input=${g=>this._onListSearchInput(g.target.value)} />
          ${this._listSearch||this._listSearchDraft?o`<button class="ms-search-clear" type="button" aria-label=${a("clear",s)} title=${a("clear",s)}
            @click=${()=>this._setListSearch("")}><ha-icon icon="mdi:close"></ha-icon></button>`:h}
        </label>
        ${Ut(d(_==="none"?a("group_by_label",s):`${a("group_by_label",s)} ${n[_]}`),u.map(g=>({label:n[g],selected:g===_,action:()=>this._setGroupBy(g)})),{cls:"ms-chip-menu"})}
        ${Ut(d(a("beta_sort_by",s).replace("{sort}",c[this._sortMode])),p.map(g=>({label:c[g],selected:g===this._sortMode,action:()=>this._setSortMode(g)})),{cls:"ms-chip-menu"})}
      </div>
    `}_toggleFilterPane(){this._filterPaneOpen=!this._filterPaneOpen,q(P.filterPane,this._filterPaneOpen?"1":"")}_setGroupBy(t){this._groupByMode=t,this._activeViewId="",q(P.groupBy,t)}_setSortMode(t){this._sortMode=t,this._activeViewId="",q(P.taskSort,t)}_renderFilterPane(t,e,i,s){let n=(p,_,g)=>o`
      <button class="ms-pane-option ${_?"on":""}" type="button" role="menuitemcheckbox" aria-checked=${_?"true":"false"} @click=${g}>
        <span class="ms-pane-option-label">${p}</span>
        <ha-icon icon=${_?"mdi:checkbox-marked":"mdi:checkbox-blank-outline"}></ha-icon>
      </button>`,c=(p,_,g,b)=>o`
      <ha-expansion-panel class="ms-pane-section" .expanded=${g||this._paneSections.has(p)}
        @expanded-changed=${x=>{if(x.target!==x.currentTarget)return;let T=new Set(this._paneSections);x.detail.expanded?T.add(p):T.delete(p),this._paneSections=T}}>
        <div slot="header" class="ms-pane-section-head">${_}${g?o`<span class="ms-chip-badge">1</span>`:h}</div>
        <div class="ms-pane-options">${b}</div>
      </ha-expansion-panel>`,d=p=>()=>{p(),this._activeViewId=""},u=!!(this._filterStatus||this._filterUser||this._filterLabel||this._filterPlace||this._filterPriority||this._activeViewId);return o`
      <aside class="ms-filter-pane" aria-label=${a("beta_filters",s)}>
        <div class="ms-pane-head">
          <button class="ms-chip active" type="button" aria-expanded="true" @click=${()=>this._toggleFilterPane()}>
            <ha-icon icon="mdi:filter-variant"></ha-icon><span>${a("beta_filters",s)}</span>
          </button>
          ${u?o`<ha-icon-button class="ms-pane-clear" .label=${a("beta_filters_clear",s)} title=${a("beta_filters_clear",s)}
            .path=${"M14.76,20.83L17.6,18L14.76,15.17L16.17,13.76L19,16.57L21.83,13.76L23.24,15.17L20.41,18L23.24,20.83L21.83,22.24L19,19.4L16.17,22.24L14.76,20.83M12,12V19.88C12.04,20.18 11.94,20.5 11.71,20.71C11.32,21.1 10.69,21.1 10.3,20.71L8.29,18.7C8.06,18.47 7.96,18.16 8,17.87V12H7.97L2.21,4.62C1.87,4.19 1.95,3.56 2.38,3.22C2.57,3.08 2.78,3 3,3H17C17.22,3 17.43,3.08 17.62,3.22C18.05,3.56 18.13,4.19 17.79,4.62L12.03,12H12Z"}
            @click=${()=>this._clearFilters()}></ha-icon-button>`:h}
        </div>
        ${this._savedViews.length||!i?c("views",a("views_label",s),!!this._activeViewId,o`
          ${this._savedViews.map(p=>n(p.name,this._activeViewId===p.id,()=>this._applyView(this._activeViewId===p.id?"":p.id)))}
          ${i?h:o`<button class="ms-pane-link" type="button" @click=${()=>this._openSavedViewsDialog()}>${a("views_manage",s)}</button>`}
        `):h}
        ${c("status",a("beta_filter_status",s),!!this._filterStatus,js.map(p=>n(a(p,s),this._filterStatus===p,d(()=>{this._filterStatus=this._filterStatus===p?"":p}))))}
        ${c("user",a("user_label",s),!!this._filterUser,o`
          ${n(a("my_tasks",s),this._filterUser==="current_user",d(()=>{this._filterUser=this._filterUser==="current_user"?null:"current_user"}))}
          ${t.map(p=>n(p.name??p.id,this._filterUser===p.id,d(()=>{this._filterUser=this._filterUser===p.id?null:p.id})))}
        `)}
        ${this._allLabels.length?c("label",a("label_filter",s),!!this._filterLabel,this._allLabels.map(p=>n(p,this._filterLabel===p,d(()=>{this._filterLabel=this._filterLabel===p?null:p})))):h}
        ${this._features.places&&this._allPlaces.length?c("place",a("filter_place",s),!!this._filterPlace,o`
          ${n(a("place_home",s),this._filterPlace==="home",d(()=>{this._filterPlace=this._filterPlace==="home"?"":"home"}))}
          ${this._allPlaces.map(p=>n(p.name,this._filterPlace===p.id,d(()=>{this._filterPlace=this._filterPlace===p.id?"":p.id})))}
        `):h}
        ${c("priority",a("priority",s),!!this._filterPriority,ns.map(p=>n(a(`priority_${p}`,s),this._filterPriority===p,d(()=>{this._filterPriority=this._filterPriority===p?"":p}))))}
        ${e>0?c("archived",a("show_archived",s),this._showArchived,n(`${a("show_archived",s)} (${e})`,this._showArchived,d(()=>{this._showArchived=!this._showArchived}))):h}
      </aside>
    `}_onListSearchInput(t){this._listSearchDraft=t,clearTimeout(this._listSearchTimer),this._listSearchTimer=window.setTimeout(()=>this._setListSearch(this._listSearchDraft),No)}_setListSearch(t){clearTimeout(this._listSearchTimer),this._listSearchDraft=t,this._listSearch=t}_clearFilters(){this._filterStatus="",this._filterUser=null,this._filterLabel=null,this._filterPlace="",this._filterPriority="",this._activeViewId=""}_renderTaskTable(t){let e=this._bulkMode?" bulk":"";if(this._virtTotalRows=t.length,t.length<120)return this._virtRenderedSig="",o`
        <div class="task-table${e}">
          ${this._renderTaskHead()}
          ${this._renderRows(t)}
        </div>
      `;let i=t.length,s=t.map(Es);(s.length!==this._virtKeys.length||s.some((_,g)=>_!==this._virtKeys[g]))&&(this._virtPasses=0),this._virtKeys=s;let n=this._virtHeights.offsets(s),c=Math.max(0,Math.min(this._virtStart,i)),d=this._virtEnd>0?Math.min(this._virtEnd,i):Math.min(i,40);d<c&&(c=0,d=Math.min(i,40)),this._virtRenderedStart=c,this._virtRenderedSig=`${this._rowsGeneration}:${c}:${d}:${i}`;let u=n[c],p=n[i]-n[d];return o`
      <div class="task-table${e} virtual">
        ${this._renderTaskHead()}
        ${this._renderVirtSizerRow(t)}
        ${u>0?o`<div class="virt-spacer" style="height:${u}px"></div>`:h}
        ${this._renderRows(t.slice(c,d))}
        ${p>0?o`<div class="virt-spacer" style="height:${p}px"></div>`:h}
      </div>
    `}_renderTaskHead(){if(!dt()||this.narrow||this.tight)return h;let t=this._lang,e=(i,s,n)=>n?o`<button class="th ${s} sortable ${this._sortMode===n?"active":""}" type="button" role="columnheader"
          aria-sort=${this._sortMode===n?"ascending":"none"} @click=${()=>this._setSortMode(n)}>
          ${this._sortMode===n?o`<ha-icon icon="mdi:arrow-up"></ha-icon>`:h}<span>${i}</span></button>`:o`<span class="th ${s}" role="columnheader">${i}</span>`;return o`
      <div class="task-head" role="row">
        ${this._bulkMode?o`<span></span>`:h}
        ${e(a("beta_filter_status",t),"th-status")}
        ${e(a("object",t),"th-object","object")}
        ${e(a("task_name",t),"th-task","task_name")}
        <span class="th th-sub"></span>
        ${e(a("sort_type",t),"th-type","type")}
        ${e(a("sort_due_date",t),"th-due","due_date")}
        <span class="th th-actions"></span>
      </div>`}_renderVirtSizerRow(t){let e=this._lang,i="",s=!1,n=!1,c=!1;for(let d of t){let u=Ja(Xa(d),e);u.length>i.length&&(i=u),d.enabled||(s=!0),d.nfc_tag_id&&(n=!0),(d.priority==="high"||d.priority==="low")&&(c=!0)}return o`
      <div class="task-row virt-sizer" aria-hidden="true">
        ${this._bulkMode?o`<span></span>`:h}
        <span class="cell-badges">
          <span class="status-badge"><ha-svg-icon .path=${Ns}></ha-svg-icon><span class="status-label">${i}</span></span>
          ${s?o`<span class="badge-disabled">${a("disabled",e)}</span>`:h}
          ${n?o`<span class="nfc-badge"><ha-svg-icon .path=${Wi}></ha-svg-icon></span>`:h}
          ${c?o`<span class="priority-badge"><ha-svg-icon .path=${Fi}></ha-svg-icon></span>`:h}
        </span>
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
    `}_renderBulkBar(t,e){let i=this._bulkSelected.size,s=t.length>0&&t.every(n=>this._bulkSelected.has(this._bulkKey(n)));return o`
      <div class="bulk-bar">
        ${te({cls:"bulk-selectall",checked:s,onChange:()=>this._bulkSelectAll(t)},o`${a("bulk_select_all",e)}`)}
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
            ${(()=>{let n=[{label:a("move_task",e),cls:"bulk-move",action:()=>{this._bulkMove(t)}},{label:`${a("bulk_assign",e)}\u2026`,cls:"bulk-assign",action:()=>{this._bulkEdit("assign",t)}},{label:`${a("labels",e)}\u2026`,cls:"bulk-labels",action:()=>{this._bulkEdit("labels",t)}},{label:`${a("edit",e)}\u2026`,cls:"bulk-edit",action:()=>{this._bulkEdit("edit",t)}},{label:`${a("pause_task",e)}\u2026`,cls:"bulk-pause",action:()=>{this._bulkPause(t)}},{label:a("resume_task",e),cls:"bulk-resume",action:()=>this._bulkResume(t)}],c=i===0||this._actionLoading;return ie()?Ut(o`<ha-button slot="trigger" appearance="plain" class="bulk-more" title=${a("more_actions",e)} aria-label=${a("more_actions",e)} .disabled=${c}>
                    <ha-icon icon="mdi:dots-vertical"></ha-icon>
                  </ha-button>`,n):o`<ha-button appearance="plain" class="bulk-more" title=${a("more_actions",e)} aria-label=${a("more_actions",e)} .disabled=${c}
                    @click=${d=>{d.stopPropagation(),this._bulkMenuOpen=!this._bulkMenuOpen}}>
                    <ha-icon icon="mdi:dots-vertical"></ha-icon>
                  </ha-button>
                  ${this._bulkMenuOpen?ne(n,()=>{this._bulkMenuOpen=!1}):h}`})()}
          </span>
        </span>
      </div>
    `}_renderGroupedTasks(t,e){let i=new Map,s=a("unassigned",e);for(let g of t){let b=[];if(this._groupByMode==="area")b=[Ie(g.area_id,this.hass?.areas,a("no_area",e))];else if(this._groupByMode==="user"){let x=Ft(g).map(T=>this._userService?.getUserName(T)).filter(T=>!!T);b=x.length>0?[...new Set(x)]:[s]}else this._groupByMode==="group"?b=g.group_names.length>0?g.group_names:[s]:this._groupByMode==="object"&&(b=[g.object_name]);for(let x of b)i.has(x)||i.set(x,[]),i.get(x).push(g)}let n=[...i.entries()].sort(([g],[b])=>g===s&&b!==s?1:b===s&&g!==s?-1:g.localeCompare(b)),c=this._groupByMode==="area"?Vi:this._groupByMode==="group"?Ui:this._groupByMode==="object"?qs:Ls,u=n.reduce((g,[b,x])=>g+(this._collapsedGroups.has(b)?0:x.length),0)>=120;this._virtGroups=u?n.map(([g,b])=>({key:g,keys:this._collapsedGroups.has(g)?[]:b.map(Es)})):[];let p=this._virtGroups.map(g=>`${g.key}${g.keys.join("")}`).join("");p!==this._virtGroupSig&&(this._virtPasses=0),this._virtGroupSig=p;let _=40;return this._virtGroupDrawn=this._virtGroups.map(g=>{let b=g.keys.length,x=this._virtGroupWin.get(g.key);if(x){let y=Math.min(x[0],b);return[y,Math.max(y,Math.min(x[1],b))]}let T=Math.min(b,_);return _-=T,[0,T]}),this._virtRenderedSig=u?`${this._rowsGeneration}:g:${this._virtGroupDrawn.map(g=>g.join("-")).join(",")}`:"",o`
      <div class="task-table grouped${this._bulkMode?" bulk":""}${u?" virtual":""}">
        ${this._renderTaskHead()}
        ${u?this._renderVirtSizerRow(t):h}
        ${n.map(([g,b],x)=>{let T=!this._collapsedGroups.has(g);return o`
            <div class="group-section" ?open=${T}>
              <div
                class="group-section-header"
                role="button"
                tabindex="0"
                aria-expanded=${T?"true":"false"}
                @click=${()=>this._toggleGroup(g)}
                @keydown=${y=>{(y.key==="Enter"||y.key===" ")&&(y.preventDefault(),this._toggleGroup(g))}}
              >
                <ha-svg-icon .path=${c}></ha-svg-icon>
                <span>${g}</span>
                <span class="group-section-count">(${b.length})</span>
              </div>
              ${T?o`<div class="group-rows">${u?this._renderGroupWindow(this._virtGroups[x].keys,this._virtGroupDrawn[x],b):this._renderRows(b)}</div>`:h}
            </div>
          `})}
      </div>
    `}_renderGroupWindow(t,[e,i],s){let n=this._virtGroupHeights.offsets(t),c=n[e],d=n[t.length]-n[i];return o`
      ${c>0?o`<div class="virt-spacer" style="height:${c}px"></div>`:h}
      ${this._renderRows(s.slice(e,i))}
      ${d>0?o`<div class="virt-spacer" style="height:${d}px"></div>`:h}
    `}_toggleGroup(t){let e=new Set(this._collapsedGroups);e.has(t)?e.delete(t):e.add(t),this._collapsedGroups=e}_warrantyLabel(t,e,i){return t.kind==="expired"?a("warranty_expired",i):t.kind==="expiring"?a("warranty_expires_in",i).replace("{days}",String(t.days??0)):a("warranty_valid_until",i).replace("{date}",U(e,i))}_renderWarrantyMeta(t,e){let i=us(t);return o`<p class="meta">${a("warranty",e)}:
      <span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,t,e)}</span></p>`}_filterSelect(t,e,i,s){let n=Ma({label:t,value:e,onChange:i},s);return Oa()?o`<div class="filter-field">${n}</div>`:o`<label class="filter-field"><span class="filter-label">${t}</span>${n}</label>`}_renderAllObjects(){let t=this._lang,e=this._isOperator,i=this._objectViewMode==="table"&&!this.narrow,s=this._objects.filter(p=>p.object.archived).length,n=this._objects.filter(p=>this._showArchived||!p.object.archived),c=p=>this._arrangeObjects(p,!this._objBulkMode),d=c(n),u=()=>{let p=new Map;for(let _ of n){let g=Ie(_.object.area_id,this.hass?.areas,a("no_area",t));p.has(g)||p.set(g,[]),p.get(g).push(_)}return[...p.entries()].sort(([_],[g])=>_.localeCompare(g))};return o`
      <div class="breadcrumb">
        <ha-icon-button .label=${a("back",t)} @click=${()=>this._showOverview(!0)}>
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
        ${this._filterSelect(a("sort_label",t),this._objectSortMode,p=>{this._objectSortMode=p.target.value;try{q(P.objectSort,this._objectSortMode)}catch{}this._setObjTableSort(null)},o`
            <option value="alphabetical" ?selected=${this._objectSortMode==="alphabetical"}>${a("sort_alphabetical",t)}</option>
            <option value="due_soonest" ?selected=${this._objectSortMode==="due_soonest"}>${a("sort_due_soonest",t)}</option>
            <option value="task_count" ?selected=${this._objectSortMode==="task_count"}>${a("sort_task_count",t)}</option>
        `)}
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
        ${this._filterSelect(a("group_by_label",t),this._groupByMode,p=>{this._groupByMode=p.target.value;try{q(P.groupBy,this._groupByMode)}catch{}},o`
            <option value="none" ?selected=${this._groupByMode==="none"}>${a("groupby_none",t)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${a("groupby_area",t)}</option>
        `)}
        `}
        ${e?h:o`
          <ha-button
            @click=${()=>this._ui("maintenance-object-dialog").then(p=>p?.openCreate())}
          >
            ${a("new_object",t)}
          </ha-button>
        `}
        <ha-button appearance="plain" @click=${()=>this._exportObjectsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${a("settings_export_csv",t)}
        </ha-button>
        ${e?h:o`
          <ha-button appearance="plain" class="bulk-toggle obj-bulk-toggle ${this._objBulkMode?"active":""}" @click=${()=>this._toggleObjBulkMode()}>
            <ha-icon icon="mdi:checkbox-multiple-marked-outline"></ha-icon>
            ${this._objBulkMode?a("cancel",t):a("bulk_select",t)}
          </ha-button>
        `}
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
      ${this._objBulkMode?this._renderObjBulkBar(d.roots,t):h}
      ${i?this._renderObjectsTable(d):this._groupByMode==="area"?o`
          ${u().map(([p,_])=>{let g=c(_);return o`
            ${hi({cls:"group-section",open:!0,headerCls:"group-section-header",header:o`
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <span>${p}</span>
                <span class="group-section-count">(${_.length})</span>`},o`
              <div class="objects-grid">${g.roots.map(b=>this._renderObjectCard(b,g))}</div>
            `)}
          `})}
        `:o`<div class="objects-grid">${d.roots.map(p=>this._renderObjectCard(p,d))}</div>`}
    `}_arrangeObjects(t,e=!0){let i=e?Ba(t):{roots:[...t],children:new Map},s=(d,u)=>d.object.name.localeCompare(u.object.name);if(this._objectSortMode==="alphabetical")return bi(i,s),i;let n=new Map;for(let d of t){let u=as(i,d);if(this._objectSortMode==="task_count")n.set(d.entry_id,u.reduce((p,_)=>p+_.tasks.length,0));else{let p=1/0;for(let _ of u)for(let g of _.tasks){let b=g.days_until_due;b!=null&&b<p&&(p=b)}n.set(d.entry_id,p)}}let c=d=>n.get(d.entry_id)??0;return bi(i,this._objectSortMode==="task_count"?(d,u)=>c(u)-c(d)||s(d,u):(d,u)=>c(d)-c(u)||s(d,u)),i}_renderObjectCard(t,e){let i=this._lang,s=e.children.get(t.entry_id)??[],n=p=>p.tasks.some(_=>Ce(_.status)),c=p=>as(e,p).some(n),d=c(t),u=this._objBulkMode&&this._view==="all_objects";return o`
      <div class="object-card${d?" object-card-overdue":""}${u?" selectable":""}${u&&this._objBulkSelected.has(t.entry_id)?" bulk-selected":""}"
        data-entry-id=${t.entry_id}
        @click=${()=>u?this._toggleObjBulk(t.entry_id):this._showObject(t.entry_id)}>
        ${u?o`<label class="obj-bulk-check bulk-check" @click=${p=>p.stopPropagation()}>
              <input type="checkbox" .checked=${this._objBulkSelected.has(t.entry_id)} @change=${()=>this._toggleObjBulk(t.entry_id)} />
            </label>`:h}
        ${d?o`<span class="overdue-dot" title="${a("has_overdue",i)}"></span>`:h}
        <div class="object-card-header">
          <span class="object-card-name">${this._objRef(t.object)}${t.object.name}</span>
          ${t.object.paused?o`<span class="paused-badge" title="${a("object_paused_badge",i)}${t.object.paused_until?` \u2014 ${U(t.object.paused_until,i)}`:""}">
                <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
              </span>`:h}
          ${t.object.document_count?o`<span class="doc-badge" title="${Rs(t.object.document_count,i)}">
                <ha-icon icon="mdi:paperclip"></ha-icon>${t.object.document_count}
              </span>`:h}
          <span class="object-card-count">${s.length&&!t.tasks.length?_t("sub_objects_count","sub_objects_count_one",s.length,i):_t("templates_task_count","templates_task_count_one",t.tasks.length,i)}</span>
        </div>
        ${t.object.manufacturer||t.object.model?o`<div class="object-card-meta">${[t.object.manufacturer,t.object.model].filter(Boolean).join(" ")}</div>`:h}
        ${s.length?o`<div class="object-card-children" aria-label=${a("sub_objects",i)}>
              ${s.map(p=>{let _=e.children.get(p.entry_id)?.length??0;return o`<button class="object-child-chip${c(p)?" overdue":""}"
                  data-entry-id=${p.entry_id}
                  title=${c(p)?`${p.object.name}: ${a("has_overdue",i)}`:p.object.name}
                  @click=${g=>{g.stopPropagation(),this._showObject(p.entry_id)}}
                  ><span class="object-child-name">${p.object.name}</span>${_?o`<span class="object-child-count">${_}</span>`:h}</button>`})}
            </div>`:t.tasks.length===0?o`<div class="object-card-empty">${a("no_tasks_yet",i)}</div>`:h}
      </div>
    `}_setObjectViewMode(t){this._objectViewMode=t;try{q(P.objectView,t)}catch{}}_renderAllParts(){let t=this._lang,e=this._allParts,i=this._currencySymbol;return o`
      <div class="breadcrumb">
        <ha-icon-button .label=${a("back",t)} @click=${()=>this._showAllObjects()}>
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
                    <td class="all-parts-stock">${s.stock!==null?Jt(s.stock,s.unit,t):"\u2014"}${this._renderAllPartsUse(s)}${this._renderAllPartsBought(s)}</td>
                    <td>${s.reorder_threshold??"\u2014"}</td>
                    <td>${s.cost!=null?s.package_size?`${Y(s.cost,i,t)} / ${Jt(s.package_size,s.unit??void 0,t)}`:Y(s.cost,i,t):"\u2014"}</td>
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
    `}_renderAllPartsUse(t){if(this._isOperator||!(typeof t.stock=="number"&&t.stock>0))return h;let e=!!this._getObject(t.entry_id)?.object.battery_fleet;return o`<ms-part-use
      nowrap
      .hass=${this.hass}
      .entryId=${t.entry_id}
      .sparePart=${{id:t.part_id,unit:t.unit??void 0,package_size:t.package_size??void 0}}
      ?notBooked=${me(t,this._partsCostMode,e)==="use"}
      @part-used=${()=>{this._loadAllParts(),this._loadData()}}
    ></ms-part-use>`}_renderAllPartsBought(t){if(this._isOperator||typeof t.stock!="number")return h;let e=!!this._getObject(t.entry_id)?.object.battery_fleet;return o`<ms-part-purchase
      .hass=${this.hass}
      .entryId=${t.entry_id}
      .sparePart=${{id:t.part_id,unit:t.unit??void 0,package_size:t.package_size??void 0,cost:t.cost??void 0,restock_quantity:t.restock_quantity??void 0}}
      .currencySymbol=${this._currencySymbol}
      ?onUse=${me(t,this._partsCostMode,e)==="use"}
      @part-bought=${()=>{this._loadAllParts(),this._loadData()}}
    ></ms-part-purchase>`}_renderAllAreas(){let t=this._lang;return this._ensureAreaUi(),o`
      <div class="breadcrumb">
        <ha-icon-button .label=${a("back",t)} @click=${()=>this._showAllObjects()}>
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
    `}_renderArea(){if(!this._selectedAreaId)return h;let t=this._lang;return this._ensureAreaUi(),o`
      <div class="breadcrumb">
        <ha-icon-button .label=${a("back",t)} @click=${()=>this._showAllAreas()}>
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
    `}_exportPartsCsv(){let t=this._allParts||[],e=c=>{let d=c==null?"":String(c);return/[",\n;]/.test(d)?`"${d.replace(/"/g,'""')}"`:d},s=[["name","object","stock","unit","reorder_threshold","unit_cost","storage_location","vendor","used_by"].join(",")];for(let c of t)s.push([e(c.name),e(c.object_name),e(c.stock),e(c.unit),e(c.reorder_threshold),e(c.cost),e(c.storage_location),e(c.vendor),e(c.consumers.map(d=>`${d.object_name??""}/${d.task_name??d.task_id}\xD7${d.quantity}`).join(" | "))].join(","));let n=mt();De(s.join(`
`),`maintenance_parts_${n}.csv`,"text/csv;charset=utf-8")}async _exportObjectsCsv(){let t=await I(this,{type:"maintenance_supporter/objects/csv"},{onError:i=>this._showToast(i)});if(!t)return;let e=mt();De(t.csv,`maintenance_objects_${e}.csv`,"text/csv;charset=utf-8")}_renderObjectsTable(t){let e=this._lang,i=this._objectsTableColumns,s=this._objTableSort;s&&bi(t,this._objColumnCompare(s.key,s.dir));let n=qa(t,d=>this._objTreeOpen.has(d)),c=t.children.size>0;return o`
      <div class="objects-table-wrap">
        <table class="objects-table">
          <thead>
            <tr>
              ${this._objBulkMode?o`<th class="oc-bulk"></th>`:h}
              ${i.map(d=>{let u=ca.find(_=>_.key===d);if(!u||u.key==="actions")return o`<th class="oc-${d}"></th>`;let p=s?.key===d;return o`<th class="oc-${d}" aria-sort=${p?s.dir==="asc"?"ascending":"descending":"none"}>
                  <button class="area-sort ${p?"active":""}" title=${a("sort_label",e)} @click=${()=>this._setObjTableSort(d)}>
                    ${a(u.labelKey,e)}
                    ${p?o`<ha-icon icon=${s.dir==="asc"?"mdi:arrow-up":"mdi:arrow-down"}></ha-icon>`:h}
                  </button>
                </th>`})}
            </tr>
          </thead>
          <tbody>
            ${n.map(({obj:d,depth:u})=>o`
              <tr class="objects-table-row${this._objBulkMode&&this._objBulkSelected.has(d.entry_id)?" bulk-selected":""}${u?" sub-object-row":""}"
                data-entry-id=${d.entry_id}
                @click=${()=>this._objBulkMode?this._toggleObjBulk(d.entry_id):this._showObject(d.entry_id)}>
                ${this._objBulkMode?o`<td class="oc-bulk"><input type="checkbox" .checked=${this._objBulkSelected.has(d.entry_id)}
                      @click=${p=>p.stopPropagation()} @change=${()=>this._toggleObjBulk(d.entry_id)} /></td>`:h}
                ${i.map(p=>p==="name"?this._renderObjectNameCell(d,e,u,t.children.get(d.entry_id)?.length??0,c):this._renderObjectCell(p,d,e))}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `}_setObjTableSort(t){let e=this._objTableSort;this._objTableSort=t===null?null:e?.key===t?{key:t,dir:e.dir==="asc"?"desc":"asc"}:{key:t,dir:t==="task_count"?"desc":"asc"};let i=this._objTableSort;q(P.objectTableSort,i?`${i.key}:${i.dir}`:"")}_objColumnValue(t,e){let i=e.object;switch(t){case"name":return i.name;case"ref_no":return Ct(i)||null;case"area_id":return i.area_id&&Ie(i.area_id,this.hass?.areas,"")||null;case"documentation_url":return ct(i.documentation_url)||(i.manual_docs||[]).length?1:null;case"notes":return Qi(i.notes)||null;case"task_count":return e.tasks.length;default:{let s=i[t];return typeof s=="string"&&s.trim()?s:null}}}_objColumnCompare(t,e){let i=e==="asc"?1:-1,s=(n,c)=>n.object.name.localeCompare(c.object.name,this._lang);return(n,c)=>{let d=this._objColumnValue(t,n),u=this._objColumnValue(t,c);return d===null||u===null?d===u?s(n,c):d===null?1:-1:(typeof d=="number"&&typeof u=="number"?d-u:String(d).localeCompare(String(u),this._lang,{numeric:!0,sensitivity:"base"}))*i||s(n,c)}}_renderObjectNameCell(t,e,i=0,s=0,n=!1){let c=t.object,d=this._objTreeOpen.has(t.entry_id),u=d?a("sub_objects_hide",e):a("sub_objects_show",e);return o`<td class="oc-name" style=${i?`padding-left: ${12+i*22}px`:""}>
      ${s?o`<button class="object-tree-toggle" type="button" aria-expanded=${d?"true":"false"}
            aria-label=${u} title=${u}
            @click=${p=>{p.stopPropagation(),this._toggleObjTree(t.entry_id)}}
            ><ha-icon icon=${d?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon></button>`:n?o`<span class="object-tree-spacer"></span>`:h}
      <span class="objects-table-name">${this._objRef(c)}${c.name}</span>
      ${s&&!d?o`<span class="object-tree-count" title=${a("sub_objects",e)}>${s}</span>`:h}
      ${c.document_count?o`<span class="doc-badge" title="${Rs(c.document_count,e)}">
            <ha-icon icon="mdi:paperclip"></ha-icon>${c.document_count}
          </span>`:h}
    </td>`}_toggleObjTree(t){let e=new Set(this._objTreeOpen);e.has(t)?e.delete(t):e.add(t),this._objTreeOpen=e,q(P.objectTreeOpen,JSON.stringify([...e]))}_renderObjectCell(t,e,i){let s=e.object;switch(t){case"name":return this._renderObjectNameCell(e,i);case"manufacturer":return o`<td class="oc-manufacturer">${s.manufacturer||"\u2014"}</td>`;case"model":return o`<td class="oc-model">${s.model||"\u2014"}</td>`;case"serial_number":return o`<td class="oc-serial_number">${s.serial_number||"\u2014"}</td>`;case"installation_date":return o`<td class="oc-installation_date">${s.installation_date?U(s.installation_date,i):"\u2014"}</td>`;case"warranty_expiry":return o`<td class="oc-warranty_expiry">${this._renderWarrantyCell(s.warranty_expiry,i)}</td>`;case"area_id":{let n=Ie(s.area_id,this.hass?.areas,"\u2014");return o`<td class="oc-area_id">${n}</td>`}case"documentation_url":{let n=(s.manual_docs||[])[0];return o`<td class="oc-documentation_url">${ct(s.documentation_url)?o`<a href=${s.documentation_url} target="_blank" rel="noopener noreferrer"
                @click=${c=>c.stopPropagation()}><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:n?o`<a href="#" title=${n.title}
                  @click=${c=>{c.preventDefault(),c.stopPropagation(),this._openManualDoc(n)}}
                  ><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:"\u2014"}</td>`}case"notes":{let n=Qi(s.notes);return o`<td class="oc-notes" title=${n}>${n||"\u2014"}</td>`}case"task_count":return o`<td class="oc-task_count">${e.tasks.length}</td>`;case"ref_no":return o`<td class="oc-ref_no">${Ct(s)?`#${Ct(s)}`:"\u2014"}</td>`;case"actions":return o`<td class="oc-actions">
          <button type="button" class="row-icon-btn obj-table-qr" title="${a("qr_code",i)}" aria-label=${a("qr_code",i)}
            @click=${n=>{n.stopPropagation(),this._openQrForObject(e.entry_id,s.name)}}><ha-svg-icon .path=${Fs}></ha-svg-icon></button>
        </td>`;default:return o`<td></td>`}}_renderWarrantyCell(t,e){let i=us(t);return i.kind==="none"?o`<span class="warranty-none">—</span>`:o`<span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,t,e)}</span>`}async _onSettingsChanged(){await this._loadData()}_renderGroupsSection(){if(!this._features.groups)return h;let t=Object.entries(this._groups),e=this._lang;return o`
      <div class="groups-section">
        <div class="groups-header">
          <h3>${a("groups",e)}</h3>
          <ha-button appearance="plain" @click=${()=>this._openGroupCreate()}>
            ${a("new_group",e)}
          </ha-button>
        </div>
        ${t.length===0?o`<div class="hint">${a("no_groups",e)}</div>`:o`
            <div class="groups-grid">
              ${t.map(([i,s])=>{let n=s.task_refs.map(c=>this._getTask(c.entry_id,c.task_id)?.name).filter(Boolean);return o`
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
                    ${s.description?o`<div class="group-card-desc">${s.description}</div>`:h}
                    <div class="group-card-tasks">
                      ${n.length>0?n.map(c=>o`<span class="group-task-chip">${c}</span>`):o`<span style="font-size:12px;color:var(--secondary-text-color)">${a("no_tasks_short",e)}</span>`}
                    </div>
                  </div>
                `})}
            </div>
          `}
      </div>
    `}_openGroupCreate(){this.shadowRoot.querySelector("maintenance-group-dialog")?.openCreate()}_openGroupEdit(t){let e=this._groups[t];e&&this.shadowRoot.querySelector("maintenance-group-dialog")?.openEdit(t,e)}async _deleteGroup(t,e){await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:a("delete_group",this._lang),message:a("delete_group_confirm",this._lang).replace("{name}",e),confirmText:a("delete",this._lang),danger:!0})&&await this._runAction({type:"maintenance_supporter/group/delete",group_id:t})}_renderBudgetTiles(){let t=this._budget;if(!t)return h;let e=this._lang,i=this._currencySymbol,s=(n,c,d)=>{if(d!==null){let{pct:u,level:p}=hn(c,d,t.alert_threshold_pct),_={danger:"var(--error-color, #f44336)",warning:"var(--warning-color, #ff9800)",ok:"var(--success-color, #4caf50)"}[p];return o`
          <div class="stat-item budget-tile" title="${n}: ${Y(c,i,e)} / ${Y(d,i,e)}">
            <span class="stat-value budget-tile-value">${Y(c,i,e)}</span>
            <span class="budget-tile-max">/ ${Y(d,i,e)}</span>
            <div class="budget-tile-bar"><div style="width:${u}%; background:${_}"></div></div>
            <span class="stat-label">${n}</span>
          </div>
        `}return o`
        <div class="stat-item budget-tile" title="${n}: ${Y(c,i,e)}">
          <span class="stat-value budget-tile-value">${Y(c,i,e)}</span>
          <span class="stat-label">${n}</span>
        </div>
      `};return o`
      ${s(a("budget_monthly",e),t.monthly_spent||0,t.monthly_budget>0?t.monthly_budget:null)}
      ${s(a("budget_yearly",e),t.yearly_spent||0,t.yearly_budget>0?t.yearly_budget:null)}
    `}_renderRows(t){let e=this._splitActive(),i=[this._lang,Oe(this._lang),this.hass?.locale,this._bulkMode,this._bulkSelected,e&&this._selectedEntryId,e&&this._selectedTaskId,e,this._miniStatsData,this._actionLoading,this._rowActionStyle,this.narrow,this.tight];return lr(t,Es,s=>cr([s,...i],()=>this._renderOverviewRow(s)))}_renderOverviewRow(t){let e=this._lang,i=t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0,s=0,n=Xe.ok,c=!1;if(i&&t.days_until_due!==null){let g=wi(t.interval_days,t.days_until_due,t.interval_unit);s=g.pct,c=g.overflow,t.status==="overdue"?n=Xe.overdue:t.status==="due_soon"&&(n=Xe.due_soon)}let d=t.area_id?this.hass?.areas?.[t.area_id]?.name:null,u=this._peopleOf(t).filter(g=>g!==null),p=t.group_names.length>0||d||u.length>0,_=this._bulkMode&&this._bulkSelected.has(this._bulkKey(t));return o`
      <div class="task-row${t.enabled?"":" task-disabled"}${_?" bulk-selected":""}${this._splitActive()&&t.entry_id===this._selectedEntryId&&t.task_id===this._selectedTaskId?" selected":""}">
        ${this._bulkMode?o`
          <label class="cell bulk-check" @click=${g=>g.stopPropagation()}>
            <input type="checkbox" .checked=${_} @change=${()=>this._toggleBulkRow(t)} />
          </label>
        `:h}
        <span class="cell-badges">
          ${this._statusBadge(t)}
          ${t.enabled?h:o`<span class="badge-disabled">${a("disabled",e)}</span>`}
          ${t.nfc_tag_id?o`<span class="nfc-badge" title="${a("nfc_linked",e)}"><ha-svg-icon .path=${Wi}></ha-svg-icon></span>`:h}
          ${t.priority==="high"?o`<span class="priority-badge priority-high" title="${a("priority_high",e)}"><ha-svg-icon .path=${Fi}></ha-svg-icon></span>`:h}
          ${t.priority==="low"?o`<span class="priority-badge priority-low" title="${a("priority_low",e)}"><ha-svg-icon .path=${Bs}></ha-svg-icon></span>`:h}
        </span>
        <span class="row-head">
          <span class="cell object-name" @click=${g=>{g.stopPropagation(),this._showObject(t.entry_id)}}>${t.object_name}</span>
          <span class="cell task-name" @click=${()=>this._showTask(t.entry_id,t.task_id)}>${this._listRef(t.entry_id,t.task_id)}${t.task_name}${we(t.next_event_titles)}${ke(t.trigger_detail)}</span>
        </span>
        <span class="task-sub${p?"":" task-sub-empty"}">
          ${t.group_names.length>0?o`
            <span class="sub-chip" title="${a("groups",e)}">
              <ha-svg-icon .path=${Ui}></ha-svg-icon>${t.group_names.join(", ")}
            </span>`:h}
          ${d?o`
            <span class="sub-chip">
              <ha-svg-icon .path=${Vi}></ha-svg-icon>${d}
            </span>`:h}
          ${Zi(u,"sub-chip")}
          ${(t.labels||[]).map(g=>o`
            <span class="sub-chip label-chip" title="${a("labels",e)}">
              <ha-svg-icon .path=${Us}></ha-svg-icon>${g}
            </span>`)}
        </span>
        <span class="cell type">${a(t.type,e)}</span>
        <span class="due-cell" @click=${()=>this._showTask(t.entry_id,t.task_id)}>
          ${ws(t.days_until_due,t.last_performed,e)}
          ${i?o`<div class="days-bar"><div class="days-bar-fill${c?" overflow":""}" style="width:${s}%;background:${n}"></div></div>`:h}
          ${t.trigger_config?vs(t,{trend:bs(t,this._miniStatsData),lang:e}):!i&&t.trigger_active?o`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:h}
          ${ys(t,this._miniStatsData,this._lang)}
        </span>
        ${this._renderRowActions(e,()=>this._openCompleteDialogForRow(t),()=>this._promptSkipTask(t.entry_id,t.task_id),t.allow_skip,this._isQuick(t))}
      </div>
    `}_actionStyle(){return this._rowActionStyle}async _dismissRowActionNotice(t){let e={row_action_notice_pending:!1};t&&(e.row_action_style="icons"),await I(this,{type:"maintenance_supporter/global/update",settings:e},{onError:s=>this._showToast(s)})!==void 0&&(this._rowActionNotice=!1,t&&(this._rowActionStyle="icons"),Pa())}_renderRowActions(t,e,i,s=!0,n=!1){let c=this._actionStyle(),d=n?qi:Ye,u=n?a("qr_action_quick_complete",t):a("complete",t);return c==="buttons"||c==="buttons_compact"?c==="buttons_compact"&&(this.narrow||this.tight)?o`
          <span class="row-actions as-buttons compact">
            <ha-button size="small" appearance="accent" variant="success" title="${u}" aria-label="${u}" @click=${_=>{_.stopPropagation(),e()}}>
              <ha-svg-icon .path=${d}></ha-svg-icon>
            </ha-button>
            ${s?o`
              <ha-button size="small" appearance="outlined" variant="warning" title="${a("skip",t)}" aria-label="${a("skip",t)}" ?disabled=${this._actionLoading} @click=${_=>{_.stopPropagation(),i?.()}}>
                <ha-svg-icon .path=${Qe}></ha-svg-icon>
              </ha-button>`:h}
          </span>`:o`
        <span class="row-actions as-buttons">
          <ha-button size="small" appearance="accent" variant="success" title="${u}" @click=${_=>{_.stopPropagation(),e()}}>
            <ha-svg-icon slot="start" .path=${Ye}></ha-svg-icon>${a("complete",t)}
          </ha-button>
          ${s?o`
            <ha-button size="small" appearance="outlined" variant="warning" title="${a("skip",t)}" ?disabled=${this._actionLoading} @click=${_=>{_.stopPropagation(),i?.()}}>
              <ha-svg-icon slot="start" .path=${Qe}></ha-svg-icon>${a("skip",t)}
            </ha-button>`:h}
        </span>`:o`
      <span class="row-actions">
        <button type="button" class="row-icon-btn btn-complete${n?" quick":""}" title="${u}" aria-label=${u}
          @click=${p=>{p.stopPropagation(),e()}}><ha-svg-icon .path=${n?qi:Ye}></ha-svg-icon></button>
        ${s?o`
          <button type="button" class="row-icon-btn btn-skip" title="${a("skip",t)}" aria-label=${a("skip",t)} ?disabled=${this._actionLoading}
            @click=${p=>{p.stopPropagation(),i?.()}}><ha-svg-icon .path=${Qe}></ha-svg-icon></button>`:h}
      </span>`}_isQuick(t){return re(this._getTask(t.entry_id,t.task_id))}_openCompleteDialogForRow(t){let i=this._objects.find(s=>s.entry_id===t.entry_id)?.tasks.find(s=>s.id===t.task_id);this._openCompleteDialog(t.entry_id,t.task_id,t.task_name,this._features.checklists?i?.checklist:void 0,this._features.adaptive&&!!i?.adaptive_config?.enabled)}_renderObjectDetail(){if(!this._selectedEntryId)return h;let t=this._getObject(this._selectedEntryId);if(!t)return o`<p>Object not found.</p>`;let e=t.object,i=this._lang,s=this._isOperator,n=t.tasks.filter(R=>R.archived).length,c=t.tasks.filter(R=>this._showArchived||!R.archived),d=this._arrangeObjects(this._objects.filter(R=>R.entry_id===t.entry_id||this._showArchived||!R.object.archived)),u=d.children.get(t.entry_id)??[],p=!s&&ss(t),_=o`
        <div class="detail-header">
          <h2>${e.name} ${de(Ct(e),a("ref_number",i))}</h2>
          <div class="action-buttons">
            ${s?h:o`
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(R=>R?.openCreate(t.entry_id))}}>${a("add_task",i)}</ha-button>
              <ha-button appearance="plain" @click=${()=>{this._ui("maintenance-object-dialog").then(R=>R?.openEdit(t.entry_id,e))}}>${a("edit",i)}</ha-button>
            `}
            <div class="more-menu-wrapper">
              ${ie()?Ut(o`<ha-icon-button slot="trigger" .disabled=${this._actionLoading} .label=${a("more_actions",i)} .path=${_n}></ha-icon-button>`,this._objMenuEntries(t,p,s,i,!0)):o`<ha-icon-button .disabled=${this._actionLoading} .label=${a("more_actions",i)} .path=${_n} @click=${()=>this._toggleObjMenu()}></ha-icon-button>
                  ${this._objMenuOpen?ne(this._objMenuEntries(t,p,s,i,!1),()=>this._closeObjMenu()):h}
                  ${this._subObjMenu==="more"&&p?this._renderSubObjMenu(t.entry_id,i):h}`}
            </div>
          </div>
        </div>
        ${e.paused?o`<p class="meta paused-meta">
              <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
              ${a("object_paused_badge",i)}${e.paused_until?o` — ${a("paused_until_label",i)} ${U(e.paused_until,i)}`:h}
            </p>`:h}
    `,g=o`
        ${e.manufacturer||e.model?o`<p class="meta">${[e.manufacturer,e.model].filter(Boolean).join(" ")}</p>`:h}
        ${e.serial_number?o`<p class="meta">${a("serial_number_label",i)}: ${e.serial_number}</p>`:h}
        ${this._renderLineageLink(e.predecessor_entry_id,a("object_replaces",i))}
        ${this._renderLineageLink(e.replaced_by_entry_id,a("object_replaced_by",i))}
        ${e.area_id?o`<p class="meta">${a("area",i)}:
              <a href="#" class="object-area-link" @click=${R=>{R.preventDefault(),this._showArea(e.area_id)}}
                >${Ji(e.area_id,this.hass?.areas,a("no_area",i))}</a></p>`:h}
        ${e.place?o`<p class="meta place-meta">
              <ha-icon icon="mdi:map-marker-outline"></ha-icon>
              ${a("filter_place",i)}: ${e.place_name||e.place}${e.remind_on_site?o` · ${a("remind_on_site",i)}`:h}
              ${e.place_missing?o`<span class="place-missing-badge">${a("place_missing",i)}</span>`:h}
            </p>`:h}
        ${ct(e.documentation_url)?o`<p class="meta">${a("documentation_url_label",i)}:
              <a href=${e.documentation_url} target="_blank" rel="noopener noreferrer">${e.documentation_url}</a>
            </p>`:(e.manual_docs||[]).length?o`<p class="meta">${a("documentation_url_label",i)}:
                ${e.manual_docs.slice(0,3).map((R,Q)=>o`${Q>0?" \xB7 ":""}<a href="#"
                    @click=${C=>{C.preventDefault(),this._openManualDoc(R)}}>${R.title}</a>`)}${e.manual_docs.length>3?o` … +${e.manual_docs.length-3}`:h}
              </p>`:h}
        ${e.installation_date?o`<p class="meta">${a("installed",i)}: ${U(e.installation_date,i)}</p>`:h}
        ${e.warranty_expiry?this._renderWarrantyMeta(e.warranty_expiry,i):h}
        ${e.notes?o`<div class="object-notes">
              <div class="object-notes-label">${a("object_notes_label",i)}</div>
              <div class="object-notes-body">${ni(e.notes)}</div>
            </div>`:h}
    `,b=o`
        ${u.length?this._renderObjectSection("children",a("sub_objects",i),u.length,()=>o`
        <h3 class="sub-objects-head"><span>${a("sub_objects",i)} (${u.length})</span>${p?o`
          <span class="sub-object-add-wrap">
            ${ie()?Ut(o`<ha-button slot="trigger" appearance="plain" class="add-sub-object">
                    <ha-icon icon="mdi:plus"></ha-icon> ${a("add_sub_object",i)}
                    <ha-icon icon="mdi:menu-down"></ha-icon>
                  </ha-button>`,this._subObjEntries(t.entry_id,i),{placement:"bottom-start"}):o`<ha-button appearance="plain" class="add-sub-object" @click=${()=>this._toggleSubObjMenu("head")}>
                  <ha-icon icon="mdi:plus"></ha-icon> ${a("add_sub_object",i)}
                  <ha-icon icon="mdi:menu-down"></ha-icon>
                </ha-button>
                ${this._subObjMenu==="head"?this._renderSubObjMenu(t.entry_id,i):h}`}
          </span>`:h}</h3>
        <div class="objects-grid sub-objects">${u.map(R=>this._renderObjectCard(R,d))}</div>
        `):h}
    `,x=o`
        ${this._renderObjectSection("tasks",a("tasks",i),c.length,()=>o`
        <h3>${a("tasks",i)} (${c.length})${n>0?o`
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
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(R=>R?.openCreate(t.entry_id))}}>${a("add_first_task",i)}</ha-button>
            </div>`:o`<div class="task-table object-tasks">${[...c].sort((R,Q)=>Xt(R.status)-Xt(Q.status)||(R.days_until_due??99999)-(Q.days_until_due??99999)).map(R=>o`
              <div class="task-row${R.enabled?"":" task-disabled"}${this._objectSplitActive()&&R.id===this._selectedTaskId?" selected":""}">
                <span class="cell-badges">
                  ${this._statusBadge(R)}
                  ${R.enabled?h:o`<span class="badge-disabled">${a("disabled",i)}</span>`}
                  ${R.nfc_tag_id?o`<span class="nfc-badge" title="${a("nfc_linked",i)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:h}
                  ${R.document_count?o`<span class="doc-badge" title="${Rs(R.document_count,i)}"><ha-icon icon="mdi:paperclip"></ha-icon>${R.document_count}</span>`:h}
                </span>
                <span class="cell task-name" @click=${()=>this._showTask(t.entry_id,R.id)}>${this._listRef(t.entry_id,R.id)}${R.name}${we(R.next_event_titles)}${ke(R.trigger_detail)}</span>
                <span class="task-sub${Ft(R).length?"":" task-sub-empty"}">${$s(R,Q=>this._userService?.getUserName(Q)??null,Q=>this._userService?.getPerson(Q)??null)}</span>
                <span class="cell type">${a(R.type,i)}</span>
                <span class="due-cell" @click=${()=>this._showTask(t.entry_id,R.id)}>
                  ${ws(R.days_until_due,R.last_performed,i)}
                  ${R.trigger_config?vs(R,{trend:bs(R,this._miniStatsData),lang:i}):h}
                  ${ys(R,this._miniStatsData,this._lang)}
                </span>
                ${this._renderRowActions(i,()=>this._openCompleteDialog(t.entry_id,R.id,R.name,this._features.checklists?R.checklist:void 0,this._features.adaptive&&!!R.adaptive_config?.enabled),()=>this._promptSkipTask(t.entry_id,R.id),R.allow_skip,re(R))}
              </div>
            `)}</div>`}
        `)}
    `,T=o`
        ${this._renderObjectSection("documents",a("documents",i),typeof e.document_count=="number"?e.document_count:null,()=>o`
        <maintenance-documents-section
          .hass=${this.hass}
          .entryId=${t.entry_id}
          .canWrite=${!s}
        ></maintenance-documents-section>
        `)}
    `,y=o`
        ${(t.parts||[]).length||!s?this._renderObjectSection("parts",a("parts_section",i),(t.parts||[]).length,()=>o`
        <maintenance-parts-section
          .hass=${this.hass}
          .entryId=${t.entry_id}
          .parts=${t.parts||[]}
          .canWrite=${!s}
          .currencySymbol=${this._currencySymbol}
          .partsCostMode=${this._partsCostMode}
          .fleet=${!!e.battery_fleet}
          @parts-changed=${()=>this._loadData()}
        ></maintenance-parts-section>
        `):h}
    `,k=o`
        ${t.tasks.some(R=>(R.times_performed||0)>0||(R.history||[]).length>0)?this._renderObjectSection("history",a("object_history_section",i),null,()=>o`
        <maintenance-object-history-section
          .hass=${this.hass}
          .entryId=${t.entry_id}
          .object=${e}
          .tasks=${t.tasks}
          .currencySymbol=${this._currencySymbol}
          .userName=${R=>this._userService?.getUserName(R)??null}
          @open-task=${R=>this._showTask(t.entry_id,R.detail.taskId)}
        ></maintenance-object-history-section>
        `):h}
    `,w=!!(e.manufacturer||e.model||e.serial_number||e.predecessor_entry_id||e.replaced_by_entry_id||e.area_id||e.place||ct(e.documentation_url)||(e.manual_docs||[]).length||e.installation_date||e.warranty_expiry||e.notes),E=this.wide&&dt()?o`${_}
          <div class="object-columns">
            <div class="object-col">${b}${x}${k}</div>
            <div class="object-col">${w?o`<div class="object-meta">${g}</div>`:h}${T}${y}</div>
          </div>`:o`${_}${g}${b}${x}${T}${y}${k}`,v=o`<div class="detail-section">${E}</div>`;if(!this._objectSplitActive())return v;let D=this._selectedTaskId&&this._getTask(t.entry_id,this._selectedTaskId);return o`
      <div class="split-layout object-split">
        <div class="split-list">${v}</div>
        <div class="split-pane">
          ${D?this._renderTaskDetail():o`<div class="split-pane-empty"><ha-icon icon="mdi:cursor-default-click-outline"></ha-icon><p>${a("split_select_hint",i)}</p></div>`}
        </div>
      </div>
    `}_renderObjectSection(t,e,i,s){let n=this._lang,c=this._objectSectionOverride===t||!this._objectSectionsCollapsed.has(t),d=c?a("section_collapse",n):a("section_expand",n);return o`
      <div class="obj-section ${t} ${c?"open":"collapsed"}" data-section=${t}>
        <button class="obj-section-toggle" type="button"
          aria-expanded=${c?"true":"false"}
          aria-label=${d} title=${d}
          @click=${()=>this._toggleObjectSection(t)}>
          <ha-icon icon=${c?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        ${c?o`<div class="obj-section-body">${s()}</div>`:o`<h3 class="obj-section-title" @click=${()=>this._toggleObjectSection(t)}>
              ${e}${i!==null?o`<span class="obj-section-count">${i}</span>`:h}
            </h3>`}
      </div>
    `}_renderNewMenu(t,e=!1){let i=n=>o`
      <ha-button appearance=${e?"accent":"filled"} class="new-menu-button${e?" ms-fab":""}" size=${e?"large":h} slot=${n?"trigger":h}
        @click=${n?h:c=>{c.stopPropagation(),this._toggleNewMenu()}}>
        <ha-icon icon="mdi:plus"></ha-icon> ${a("add",t)}
        <ha-icon icon="mdi:menu-down"></ha-icon>
      </ha-button>`,s=[{label:a("new_task",t),icon:"mdi:clipboard-plus-outline",action:()=>{this._ui("maintenance-task-dialog").then(n=>n?.openCreate("",this._objects))}},{label:a("new_object",t).replace(/^\+\s*/,""),icon:"mdi:package-variant-closed-plus",action:()=>{this._ui("maintenance-object-dialog").then(n=>n?.openCreate())}},{label:a("templates_from",t),icon:"mdi:view-grid-plus-outline",action:()=>{this._openTemplateGallery()}},"divider",{label:a("adopt_problem_button",t),icon:"mdi:alert-circle-check-outline",action:()=>this._openAdoptProblemSensors()},{label:a("setups_button",t),icon:"mdi:auto-fix",action:()=>this._openSuggestedSetups()},this._batteryFleetSetupAvailable&&{label:a("battery_fleet_setup_button",t),icon:"mdi:battery-sync",action:()=>{this._setupBatteryFleet()}}];return o`
      <div class="new-menu-wrapper${e?" ms-fab-wrapper":""}">
        ${ie()?Ut(i(!0),s,e?{placement:"top-end"}:{}):o`${i(!1)}${this._newMenuOpen?ne(s,()=>this._closeNewMenu(),"new-menu-popup"):h}`}
      </div>
    `}_togglePopup(t,e,i){let s=!e();i(s),this._dropPopupCloser(t),s&&setTimeout(()=>{if(!e())return;let n=()=>{i(!1),this._dropPopupCloser(t)};this._popupClosers.set(t,n),document.addEventListener("click",n)},0)}_dropPopupCloser(t){let e=this._popupClosers.get(t);e&&document.removeEventListener("click",e),this._popupClosers.delete(t)}_toggleNewMenu(){this._togglePopup("new",()=>this._newMenuOpen,t=>{this._newMenuOpen=t})}_closeNewMenu(){this._newMenuOpen=!1}_isYoungInstall(){let t=this._objects.filter(i=>!i.object?.battery_fleet),e=t.reduce((i,s)=>i+s.tasks.length,0);return t.length<3&&e<8}_gsDismissed(){try{return new Set(JSON.parse(J(P.gettingStartedDismissed)||"[]"))}catch{return new Set}}_dismissGettingStarted(t){let e=this._gsDismissed();e.add(t);try{q(P.gettingStartedDismissed,JSON.stringify([...e]))}catch{}this.requestUpdate()}_maybeLoadResetOffers(){this._resetOffersLoaded||(this._resetOffersLoaded=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/reset_offers"}).then(t=>{this._resetOffersCount=(t.offers||[]).length}).catch(()=>{this._resetOffersCount=0}))}_maybeLoadGettingStarted(){this._maybeLoadResetOffers(),!(this._gsLoaded||!this._isYoungInstall())&&(this._gsLoaded=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/discover"}).then(t=>{this._gsSetupsCount=(t.setups||[]).length}).catch(()=>{this._gsSetupsCount=0}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/problem_sensors/discover"}).then(t=>{this._gsAdoptCount=(t.sensors||[]).length}).catch(()=>{this._gsAdoptCount=0}))}_renderGettingStartedChips(t){let e=this._gsDismissed(),i=this._isYoungInstall(),s=[];return i&&this._gsSetupsCount>0&&!e.has("setups")&&s.push({id:"setups",icon:"mdi:auto-fix",text:_t("gs_setups_chip","gs_setups_chip_one",this._gsSetupsCount,t),run:()=>this._openSuggestedSetups()}),i&&this._gsAdoptCount>0&&!e.has("adopt")&&s.push({id:"adopt",icon:"mdi:alert-circle-check-outline",text:_t("gs_adopt_chip","gs_adopt_chip_one",this._gsAdoptCount,t),run:()=>this._openAdoptProblemSensors()}),this._resetOffersCount>0&&!e.has("resets")&&s.push({id:"resets",icon:"mdi:counter",text:_t("gs_reset_chip","gs_reset_chip_one",this._resetOffersCount,t),run:()=>this._openSuggestedSetups()}),this._batteryFleetSetupAvailable&&!e.has("fleet")&&s.push({id:"fleet",icon:"mdi:battery-sync",text:a("gs_fleet_chip",t),run:()=>this._setupBatteryFleet()}),s.length===0?h:o`
      <div class="gs-chips-wrap">
        <div class="gs-chips-label">${a("gs_label",t)}</div>
        <div class="gs-chips">
          ${s.map(n=>o`
            <div class="gs-chip" @click=${()=>n.run()}>
              <ha-icon icon="${n.icon}"></ha-icon>
              <span>${n.text}</span>
              <span class="gs-chip-x" title="${a("dismiss",t)}"
                @click=${c=>{c.stopPropagation(),this._dismissGettingStarted(n.id)}}>
                <ha-icon icon="mdi:close"></ha-icon>
              </span>
            </div>
          `)}
        </div>
      </div>
    `}_toggleObjMenu(){this._togglePopup("object",()=>this._objMenuOpen,t=>{this._objMenuOpen=t})}_closeObjMenu(){this._objMenuOpen=!1}_toggleMoreMenu(){this._togglePopup("more",()=>this._moreMenuOpen,t=>{this._moreMenuOpen=t})}_closeMoreMenu(){this._moreMenuOpen=!1}get _sparklineCtx(){return{lang:this._lang,hass:this.hass,detailStatsData:this._detailStatsData,hasStatsService:!!this._statsService,historyFallbackIds:this._statsService?.historyFallbackIds,isCounterEntity:Nt,rangeDays:this._chartRangeDays,setRangeDays:t=>this._setChartRange(t),hideOutliers:this._hideOutliers,setHideOutliers:t=>this._setHideOutliers(t)}}_toggleSection(t){let e=new Set(this._collapsedSections);e.has(t)?e.delete(t):e.add(t),this._collapsedSections=e;try{q(P.collapsedSections,JSON.stringify([...e]))}catch{}}_historyCtx(){let t=this._selectedEntryId&&this._selectedTaskId?this._getObject(this._selectedEntryId)?.tasks.find(n=>n.id===this._selectedTaskId):void 0,e=this._fullHistory,i=e&&e.entryId===this._selectedEntryId&&e.taskId===this._selectedTaskId&&e.entries.length>(t?.history||[]).length?e.entries:t?.history||[],s=i.filter(n=>n.reading_value!=null).sort((n,c)=>n.timestamp.localeCompare(c.timestamp));return{lang:this._lang,hass:this.hass,filter:this._historyFilter,search:this._historySearch,currencySymbol:this._currencySymbol,setFilter:n=>{this._historyFilter=n},setSearch:n=>{this._historySearch=n},openEdit:this._isOperator?void 0:n=>this._openHistoryEdit(n),readingUnit:t?.reading_unit??null,triggerUnit:Zt(this.hass,t)||null,taskRef:Pt(this._selectedEntryId?this._getObject(this._selectedEntryId)?.object:null,t),phaseNames:Object.fromEntries(Object.entries(t?.phases||{}).map(([n,c])=>[n,c.name])),readingDelta:n=>{let c=s.findIndex(d=>d.timestamp===n.timestamp);return c<=0?null:n.reading_value-s[c-1].reading_value},readingSlotDelta:(n,c)=>fa(i,n,c)}}_taskDetailCtx(t=this._selectedEntryId,e=this._selectedTaskId){let i=this._getObject(t);return{lang:this._lang,hass:this.hass,entryId:t,taskId:e,objectName:i?.object.name||"",taskRef:Pt(i?.object,i?.tasks.find(s=>s.id===e)),objectDocUrl:i?.object?.documentation_url??null,objectManualDocs:i?.object?.manual_docs??[],openManualDoc:s=>this._openManualDoc(s),setChecklistItem:(s,n)=>this._setChecklistItem(t,e,s,n),setPhaseCursor:s=>{this._runAction({type:"maintenance_supporter/task/set_phase",entry_id:t,task_id:e,cursor:s})},isOperator:this._isOperator,actionLoading:this._actionLoading,moreMenuOpen:this._moreMenuOpen,activeTab:this._activeTab,features:this._features,mirrorTodoDefault:this._mirrorTodoDefault,currencySymbol:this._currencySymbol,collapsedSections:this._collapsedSections,costDurationToggle:this._costDurationToggle,suggestionDismissed:this._dismissedSuggestions.has(`${t}_${e}`),sparkline:this._sparklineCtx,history:this._historyCtx(),getUserName:s=>this._userService?.getUserName(s)??null,getPerson:s=>this._userService?.getPerson(s)??null,setActiveTab:s=>{this._activeTab=s},toggleSection:s=>this._toggleSection(s),setCostDurationToggle:s=>{this._costDurationToggle=s},showTaskView:()=>this._showFullTaskPage(t,e),showObject:()=>this._showObject(t),toggleMoreMenu:()=>this._toggleMoreMenu(),closeMoreMenu:()=>this._closeMoreMenu(),openEdit:s=>{this._ui("maintenance-task-dialog").then(n=>n?.openEdit(t,s))},openComplete:(s,n)=>this._openCompleteDialog(t,e,s.name,this._features.checklists?s.checklist:void 0,this._features.adaptive&&!!s.adaptive_config?.enabled,n),promptSkip:()=>this._promptSkipTask(t,e),toggleArchive:s=>this._toggleArchiveTask(t,e,s),togglePause:s=>this._togglePauseTask(t,e,s),openQr:s=>this._openQrForTask(t,e,i?.object.name||"",s),duplicateTask:()=>this._duplicateTask(t,e),moveTask:()=>this._moveTask(t,e),promptReset:()=>this._promptResetTask(t,e),promptPostpone:()=>this._promptPostponeTask(t,e),snoozeTask:()=>this._snoozeTask(t,e),printWorksheet:()=>this._printTaskWorksheet(t,e),deleteTask:()=>this._deleteTask(t,e),applySuggestion:s=>this._applySuggestion(t,e,s),reanalyze:()=>this._reanalyzeInterval(t,e),dismissSuggestion:()=>this._dismissSuggestion(t,e),openSeasonalOverrides:s=>this._openSeasonalOverrides(s)}}async _fetchFullHistory(t,e){let i;try{i=await mi(this.hass,t,e)}catch{i=null}this._selectedEntryId===t&&this._selectedTaskId===e&&(this._fullHistory=i?{entryId:t,taskId:e,entries:i}:null)}_renderTaskDetail(){if(!this._selectedEntryId||!this._selectedTaskId)return h;let t=this._getTask(this._selectedEntryId,this._selectedTaskId);if(!t)return o`<p>Task not found.</p>`;let e=this._fullHistory,i=e&&e.entryId===this._selectedEntryId&&e.taskId===this._selectedTaskId&&e.entries.length>(t.history||[]).length?{...t,history:e.entries}:t;return o`<maintenance-task-detail-view
      .task=${i}
      .ctx=${this._taskDetailCtx()}
    ></maintenance-task-detail-view>`}_openHistoryEdit(t){if(!this._selectedEntryId||!this._selectedTaskId)return;let e=this._getTask(this._selectedEntryId,this._selectedTaskId),i=Ha(this._selectedEntryId,this._selectedTaskId,t,e);this.shadowRoot?.querySelector("maintenance-history-edit-dialog")?.openEdit(i)}};S.styles=[ue,pi,fr],m([j({attribute:!1})],S.prototype,"hass",2),m([j({type:Boolean,reflect:!0})],S.prototype,"narrow",2),m([j({type:Boolean,reflect:!0})],S.prototype,"tight",2),m([j({type:Boolean,reflect:!0})],S.prototype,"split",2),m([j({type:Boolean,reflect:!0})],S.prototype,"wide",2),m([j({attribute:!1})],S.prototype,"panel",2),m([j({type:Boolean,reflect:!0})],S.prototype,"embedded",2),m([j({attribute:!1})],S.prototype,"presets",2),m([f()],S.prototype,"_objects",2),m([f()],S.prototype,"_stats",2),m([f()],S.prototype,"_view",2),m([f()],S.prototype,"_allParts",2),m([f()],S.prototype,"_selectedEntryId",2),m([f()],S.prototype,"_selectedTaskId",2),m([f()],S.prototype,"_selectedAreaId",2),m([f()],S.prototype,"_filterStatus",2),m([f()],S.prototype,"_filterUser",2),m([f()],S.prototype,"_filterLabel",2),m([f()],S.prototype,"_filterPlace",2),m([f()],S.prototype,"_filterPriority",2),m([f()],S.prototype,"_savedViews",2),m([f()],S.prototype,"_activeViewId",2),m([f()],S.prototype,"_unsub",2),m([f()],S.prototype,"_chartRangeDays",2),m([f()],S.prototype,"_hideOutliers",2),m([f()],S.prototype,"_historyFilter",2),m([f()],S.prototype,"_budget",2),m([f()],S.prototype,"_groups",2),m([f()],S.prototype,"_detailStatsData",2),m([f()],S.prototype,"_miniStatsData",2),m([f()],S.prototype,"_features",2),m([f()],S.prototype,"_adminPanelUserIds",2),m([f()],S.prototype,"_operatorWriteEnabled",2),m([f()],S.prototype,"_defaultWarningDays",2),m([f()],S.prototype,"_mirrorTodoDefault",2),m([f()],S.prototype,"_rowActionStyle",2),m([f()],S.prototype,"_refsInLists",2),m([f()],S.prototype,"_partsCostMode",2),m([f()],S.prototype,"_rowActionNotice",2),m([f()],S.prototype,"_actionLoading",2),m([f()],S.prototype,"_moreMenuOpen",2),m([f()],S.prototype,"_objMenuOpen",2),m([f()],S.prototype,"_subObjMenu",2),m([f()],S.prototype,"_toastMessage",2),m([f()],S.prototype,"_toastKind",2),m([f()],S.prototype,"_toastUndo",2),m([f()],S.prototype,"_toastActionLabel",2),m([f()],S.prototype,"_filtersOpen",2),m([f()],S.prototype,"_listSearch",2),m([f()],S.prototype,"_filterPaneOpen",2),m([f()],S.prototype,"_paneSections",2),m([f()],S.prototype,"_newMenuOpen",2),m([f()],S.prototype,"_gsSetupsCount",2),m([f()],S.prototype,"_gsAdoptCount",2),m([f()],S.prototype,"_resetOffersCount",2),m([f()],S.prototype,"_batteryFleetSetupAvailable",2),m([f()],S.prototype,"_staleBundle",2),m([f()],S.prototype,"_restartPendingVersion",2),m([f()],S.prototype,"_overviewTab",2),m([f()],S.prototype,"_activeTab",2),m([f()],S.prototype,"_costDurationToggle",2),m([f()],S.prototype,"_historySearch",2),m([f()],S.prototype,"_sortMode",2),m([f()],S.prototype,"_objectSortMode",2),m([f()],S.prototype,"_objTableSort",2),m([f()],S.prototype,"_groupByMode",2),m([f()],S.prototype,"_objectViewMode",2),m([f()],S.prototype,"_objectsTableColumns",2),m([f()],S.prototype,"_showArchived",2),m([f()],S.prototype,"_bulkMode",2),m([f()],S.prototype,"_bulkSelected",2),m([f()],S.prototype,"_objBulkMode",2),m([f()],S.prototype,"_objBulkSelected",2),m([f()],S.prototype,"_bulkMenuOpen",2),m([f()],S.prototype,"_virtStart",2),m([f()],S.prototype,"_virtEnd",2),m([f()],S.prototype,"_virtGroupWin",2),m([f()],S.prototype,"_collapsedGroups",2),m([f()],S.prototype,"_collapsedSections",2),m([f()],S.prototype,"_objectSectionsCollapsed",2),m([f()],S.prototype,"_objectSectionOverride",2),m([f()],S.prototype,"_objTreeOpen",2),m([f()],S.prototype,"_paletteOpen",2),m([f()],S.prototype,"_paletteQuery",2),m([f()],S.prototype,"_paletteActive",2),m([f()],S.prototype,"_searchRemote",2),m([f()],S.prototype,"_templateGalleryOpen",2),m([f()],S.prototype,"_templates",2),m([f()],S.prototype,"_homeProfile",2),m([f()],S.prototype,"_templateCategories",2),m([f()],S.prototype,"_templateBusy",2),m([f()],S.prototype,"_templateParentId",2),m([f()],S.prototype,"_templatePreview",2),m([f()],S.prototype,"_templatePicked",2),m([f()],S.prototype,"_fullHistory",2),S=m([Ps("maintenance-supporter-panel")],S);export{S as MaintenanceSupporterPanel};
/*! Bundled license information:

lit-html/directives/repeat.js:
lit-html/directives/cache.js:
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

lit-html/directives/keyed.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
