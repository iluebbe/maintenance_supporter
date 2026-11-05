/*! maintenance_supporter frontend 2.119.0 */
import{a as ga,b as fa,c as ba,d as va,h as ka}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-GH7TCUGY.js";import{a as Ba}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-RIIKTJFM.js";import{$ as pr,A as Ea,B as Ma,C as M,D as Vt,E as Ve,F as xe,G as qa,H as os,I as yi,J as ls,K as Ua,L as xi,M as Va,N as Wa,O as er,P as tr,Q as ir,R as sr,S as ar,T as $i,U as rr,V as nr,W as Ti,X as or,Y as lr,Z as cr,_ as dr,a as de,b as zs,c as Pe,d as Le,e as Zt,f as ht,g as Vs,ga as hr,h as ti,i as Ki,j as Ws,ja as ur,k as Yi,l as Gs,m as Ks,n as Qi,o as Xi,p as Ji,q as Ys,r as ii,s as Qs,t as pa,u as di,v as is,w as xa,x as wa,y as pi,z as ja}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-UHKS5N6C.js";import{b as fi,d as qt,e as Na,f as $t,h as ns,j as vi,k as Fa}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-7YCXBEC7.js";import{a as kt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-TEFSP4ED.js";import{a as da,b as ni,c as Fe,d as oi,e as Lt,f as li}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-RCWBWZBC.js";import{a as Jt,b as Hs,c as pt,d as Ra,e as Ca,f as Oa,g as mi,h as ss,i as Bt,j as as,z as bi}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6ZZAPEXI.js";import{a as cs,b as Ga,c as ds,d as ps,e as Ka,f as wi,g as Ya}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-W2OI7O2P.js";import{a as ki}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-U3U5HRYU.js";import{a as yt,b as Nt,c as Ce,d as tt,e as Ft,f as xt,g as Ue,h as wt,i as Ha,j as La}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6ITCU3EE.js";import{b as hs}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-Y3MQXILK.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-YSDG2L7V.js";import{a as Pa,b as za}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-I4COVMXV.js";import{c as Ia}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-GKA57HQ4.js";import{a as P,b as X,c as q}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-VR5ABDM3.js";import{b as bt,c as hi,d as Ta,e as Sa,f as ui,g as qe}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-FZDD2TTP.js";import{b as ya,i as $a}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-5T3S4STG.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-66SCM6JH.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-I5U7PLLG.js";import{a as Ht,c as $}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-5I7KRA6P.js";import{a as nt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-O2TITNSP.js";import{a as ma,b as _a}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-22HREMWC.js";import{d as Aa,e as rs,f as Da}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-7WCA6GIY.js";import{a as gi}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-THBZ3MNR.js";import{a as Oe,m as Ut}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ZCPDAFMC.js";import{a as Qa,b as Xa,c as Ja,d as Za}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BZ4PN27M.js";import{a as vt,b as _i}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-4HZVT2CP.js";import{a as Fs,b as Qe,c as Xe,d as Gi,e as qs,g as Be,h as Je,i as rt,j as At,k as ei,l as Us}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-OWE53YIN.js";import{a as ge}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-NN6CK3TX.js";import{a as I,b as ha,c as ua,d as ts}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-EYZY6SRU.js";import{a as pe,b as es,d as ci,e as gt,f as ft}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-GXVIXKKT.js";import{$ as Ie,A as a,B as Pt,C as me,E as ta,F as ia,G as _e,I as Ee,J as Zi,L as Ne,M as sa,N as ai,O as ut,P as It,R as ne,S as je,T as W,U as aa,V as Y,W as et,Y as U,Z as ye,a as _,aa as ri,b as H,c as o,ca as ra,d as K,da as na,e as Ot,ea as zt,f as h,ga as oa,h as Mt,ha as la,i as L,ia as ca,j as Wi,k as Ls,ka as Re,l as Bs,la as mt,m as Ns,n as j,o as f,p as si,pa as _t,q as Xs,r as Js,s as Zs,t as Ze,u as ea,v as Dt,z as F}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6NL3YWME.js";var Tn=["assignee_pool","required_completion_fields","checklist","labels","mirror_todo_entities","next_event_titles","history","readings"],Sn=["checklist_progress"],jn=["tasks","parts"],En=["manual_docs","battery_fleet_excluded"];function us(n,l,e=[]){for(let t of l)n[t]===void 0&&(n[t]=[]);for(let t of e)n[t]===void 0&&(n[t]={})}function Rn(n){let l=n;us(l,jn),l.object&&typeof l.object=="object"&&us(l.object,En);for(let e of l.tasks)us(e,Tn,Sn);return n}function Wt(n){for(let l of n)Rn(l);return n}function Cn(n,l){if(l.objects)return l.objects;let e=l.delta||[],t=l.removed||[];if(!e.length&&!t.length)return null;let i=new Map(n.map(s=>[s.entry_id,s]));for(let s of e)i.set(s.entry_id,s);for(let s of t)i.delete(s);return[...i.values()]}function mr(n,l){return l.objects&&Wt(l.objects),l.delta&&Wt(l.delta),Cn(n,l)}var _r=(n,l,e)=>{let t=new Map;for(let i=l;i<=e;i++)t.set(n[i],i);return t},gr=Qe(class extends Xe{constructor(n){if(super(n),n.type!==Fs.CHILD)throw Error("repeat() can only be used in text expressions")}dt(n,l,e){let t;e===void 0?e=l:l!==void 0&&(t=l);let i=[],s=[],r=0;for(let c of n)i[r]=t?t(c,r):r,s[r]=e(c,r),r++;return{values:s,keys:i}}render(n,l,e){return this.dt(n,l,e).values}update(n,[l,e,t]){let i=At(n),{values:s,keys:r}=this.dt(l,e,t);if(!Array.isArray(i))return this.ut=r,s;let c=this.ut??=[],d=[],u,p,g=0,m=i.length-1,b=0,x=s.length-1;for(;g<=m&&b<=x;)if(i[g]===null)g++;else if(i[m]===null)m--;else if(c[g]===r[b])d[b]=Je(i[g],s[b]),g++,b++;else if(c[m]===r[x])d[x]=Je(i[m],s[x]),m--,x--;else if(c[g]===r[x])d[x]=Je(i[g],s[x]),Be(n,d[x+1],i[g]),g++,x--;else if(c[m]===r[b])d[b]=Je(i[m],s[b]),Be(n,i[g],i[m]),m--,b++;else if(u===void 0&&(u=_r(r,b,x),p=_r(c,g,m)),u.has(c[g]))if(u.has(c[m])){let T=p.get(r[b]),v=T!==void 0?i[T]:null;if(v===null){let k=Be(n,i[g]);Je(k,s[b]),d[b]=k}else d[b]=Je(v,s[b]),Be(n,i[g],v),i[T]=null;b++}else ei(i[m]),m--;else ei(i[g]),g++;for(;b<=x;){let T=Be(n,d[x+1]);Je(T,s[b]),d[b++]=T}for(;g<=m;){let T=i[g++];T!==null&&ei(T)}return this.ut=r,rt(n,d),Ot}});var On={},fr=Qe(class extends Xe{constructor(){super(...arguments),this.ot=On}render(n,l){return l()}update(n,[l,e]){if(Array.isArray(l)){if(Array.isArray(this.ot)&&this.ot.length===l.length&&l.every((t,i)=>t===this.ot[i]))return Ot}else if(this.ot===l)return Ot;return this.ot=Array.isArray(l)?Array.from(l):l,this.render(l,e)}});var br=n=>qs(n)?n._$litType$.h:n.strings,ms=Qe(class extends Xe{constructor(n){super(n),this.et=new WeakMap}render(n){return[n]}update(n,[l]){let e=Gi(this.it)?br(this.it):null,t=Gi(l)?br(l):null;if(e!==null&&(t===null||e!==t)){let i=At(n).pop(),s=this.et.get(e);if(s===void 0){let r=document.createDocumentFragment();s=Mt(h,r),s.setConnected(!1),this.et.set(e,s)}rt(s,[i]),Be(s,void 0,i)}if(t!==null){if(e===null||e!==t){let i=this.et.get(t);if(i!==void 0){let s=At(i).pop();Us(n),Be(n,void 0,s),rt(n,[s])}}this.it=l}else this.it=void 0;return this.render(l)}});var vr=Qe(class extends Xe{constructor(){super(...arguments),this.key=h}render(n,l){return this.key=n,l}update(n,[l,e]){return l!==this.key&&(rt(n),this.key=l),e}});function yr(n,l){let e=n,t=l;if(e===t||e.states===t.states)return!1;for(let i of new Set([...Object.keys(e),...Object.keys(t)]))if(i!=="states"&&e[i]!==t[i])return!1;return!0}var _s=["today","dashboard","calendar","settings"];var Mn=168*3600*1e3;function xr(){try{let n=X(P.objectsCache);if(!n)return null;let l=JSON.parse(n);return l.v!==Wi||!Number.isFinite(l.at)||Date.now()-l.at>Mn||!Array.isArray(l.objects)||l.objects.length===0?null:{objects:l.objects,stats:l.stats??null,...typeof l.beta=="boolean"?{beta:l.beta}:{}}}catch{return null}}function gs(n,l,e=pe()){if(!(!Array.isArray(n)||n.length===0))try{let t={v:Wi,at:Date.now(),objects:n,stats:l,beta:e};q(P.objectsCache,JSON.stringify(t))}catch{}}function We(n){return n.responsible_user_id?[n.responsible_user_id]:[...new Set((n.assignee_pool||[]).filter(l=>typeof l=="string"&&l))]}function Gt(n,l){return!!l&&We(n).includes(l)}var An={days:1,weeks:7,months:30.4368,years:365.25};function fs(n,l){return!n||n<=0?0:n*(An[l||"days"]??1)}function Si(n,l,e){let t=fs(n,e);if(t<=0||l==null)return{pct:0,overflow:!1};let i=(t-l)/t*100;return{pct:Math.max(0,Math.min(100,i)),overflow:i>100}}function wr(n,l,e,t,i,s){let r=[[e.manufacturer,n.manufacturer],[e.model,n.model],[e.serial,n.serial_number],[e.installed,n.installation_date?t(n.installation_date):null],[e.warranty,n.warranty_expiry?t(n.warranty_expiry):null]].filter(([,u])=>!!u),c=l.map(u=>{let p=e.scheduleLabel(u);return`<tr>
      <td>${$(u.name)}</td>
      <td>${$(e.typeLabel(u.type))}</td>
      <td>${$(e.statusLabel(u.status))}</td>
      <td>${$(p)}</td>
      <td>${$(u.last_performed?t(u.last_performed):e.none)}</td>
      <td>${$(u.next_due?t(u.next_due):e.none)}</td>
      <td class="num">${u.times_performed??0}</td>
      <td class="num">${$(i(u.total_cost??0))}</td>
    </tr>`}).join(""),d=l.reduce((u,p)=>u+(p.total_cost??0),0);return`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${$(e.title)} \u2014 ${$(n.name)}</title>
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
  <h1>${$(n.name)}</h1>
  <p class="sub">${$(e.title)} \xB7 ${$(e.generated)}: ${$(t(s))}</p>
  ${r.length?`<div class="meta">${r.map(([u,p])=>`<div><div class="k">${$(u)}</div>${$(p)}</div>`).join("")}</div>`:""}
  <h2>${$(e.tasksHeading)} (${l.length})</h2>
  <table>
    <thead><tr>
      <th>${$(e.colTask)}</th><th>${$(e.colType)}</th><th>${$(e.colStatus)}</th>
      <th>${$(e.colSchedule)}</th><th>${$(e.colLastDone)}</th><th>${$(e.colNextDue)}</th>
      <th class="num">${$(e.colTimes)}</th><th class="num">${$(e.colCost)}</th>
    </tr></thead>
    <tbody>${c||`<tr><td colspan="8">${$(e.none)}</td></tr>`}</tbody>
    <tfoot><tr><td colspan="7">${$(e.totalCost)}</td><td class="num">${$(i(d))}</td></tr></tfoot>
  </table>
  ${n.notes?`<div class="notes"><strong>${$(e.notes)}:</strong>
${$(n.notes)}</div>`:""}
</body></html>`}var Dn=60;function bs(n,l=_e()){if(!n)return{kind:"none",days:null,date:null};let e=sa(l,n);return Number.isFinite(e)?e<0?{kind:"expired",days:e,date:n}:e<=Dn?{kind:"expiring",days:e,date:n}:{kind:"valid",days:e,date:n}:{kind:"none",days:null,date:null}}function Pn(n,l){let e=Date.parse(n);return Number.isNaN(e)?n.slice(0,10):l(ia(e,ta()))}function kr(n,l,e,t,i,s,r,c,d,u=[],p=null){let g=[[e.object,$(l)],[e.type,$(e.typeLabel(n.type))],[e.interval,$(i(n))],[e.nextDue,n.next_due?$(t(n.next_due)):"\u2014"],[e.lastDone,n.last_performed?$(t(n.last_performed)):$(e.never)]];n.priority&&n.priority!=="normal"&&g.push([e.priority,$(e.priorityLabel(n.priority))]);let m=(n.checklist||[]).map(x=>`<li><span class="box"></span>${$(x)}</li>`).join(""),b=(x,T)=>x?`<figure class="qr"><img src="${x}" alt="" /><figcaption>${$(T)}</figcaption></figure>`:"";return`<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="color-scheme" content="light">
<title>${$(n.name)} \u2014 ${$(e.title)}</title>
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
      <h1>${$(n.name)}${p?` <span class="ref">#${$(p)}</span>`:""}</h1>
      <div class="obj">${$(l)}</div>
    </div>
    <div class="qr-row">
      ${b(s,e.scanView)}
      ${b(r,e.scanComplete)}
    </div>
  </header>
  <table class="meta">
    ${g.map(([x,T])=>`<tr><td>${$(x)}</td><td>${T}</td></tr>`).join("")}
  </table>
  ${m?`<h2>${$(e.checklist)}</h2><ul class="check">${m}</ul>`:""}
  ${u.length?`<h2>${$(e.parts)}</h2><ul class="check">${u.map(x=>`<li><span class="box"></span>${$(x)}</li>`).join("")}</ul>`:""}
  ${n.notes?`<h2>${$(e.notes)}</h2><div class="notes">${$(n.notes)}</div>`:""}
  ${c?`<h2>${$(e.manualExcerpt)}</h2>
    <div class="excerpt">${$(c.title)} \u2014 ${$(e.pages)} ${c.startPage}\u2013${c.endPage}:
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
  <footer>${$(l)} \xB7 ${$(n.name)} \xB7 ${$(e.printedOn)} ${$(Pn(d,t))}</footer>
</body></html>`}var it=["manual","warranty","invoice","spare_parts","photo","other"],ji={manual:"mdi:book-open-variant",warranty:"mdi:shield-check",invoice:"mdi:receipt-text-outline",spare_parts:"mdi:cog-outline",photo:"mdi:image-outline",other:"mdi:file-document-outline"};function fe(n){return n.title||n.filename||n.url||""}function Tt(n){return(n.tags||[]).find(l=>it.includes(l))??"other"}function $r(n){return(n.tags||[]).includes("photo")}function St(n){let l=(n??[]).filter(e=>!!e);return l.length?o`<span class="event-titles"> · ${l.join(", ")}</span>`:h}function jt(n){return n?o`<span class="event-titles trigger-detail"> · ${n}</span>`:h}var Tr=H`
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
`;function st(){return ci("ha-dropdown")}var Sr=n=>n.filter(l=>!!l);function ot(n,l,e=""){return o`
    <div class="popup-menu${e?" "+e:""}" role="menu" @keydown=${Ma} @click=${t=>t.stopPropagation()}>
      ${Sr(n).map(t=>t==="divider"?o`<div class="popup-menu-divider"></div>`:o`<div role="menuitem" tabindex="0" class="popup-menu-item${t.cls?" "+t.cls:""}${t.danger?" danger":""}${t.selected?" selected":""}"
            @click=${()=>{l(),t.action()}}>${t.icon?o`<ha-icon icon=${t.icon}></ha-icon> `:h}${t.label}</div>`)}
    </div>`}function Ge(n,l,e={}){let t=Sr(l);return o`
    <ha-dropdown class=${e.cls??""} placement=${e.placement??"bottom-end"}
      @wa-select=${i=>{let s=i.detail?.item,r=t[Number(s?.value??s?.getAttribute("value"))];r&&r!=="divider"&&r.action()}}>
      ${n}
      ${t.map((i,s)=>i==="divider"?o`<wa-divider></wa-divider>`:o`<ha-dropdown-item value=${String(s)} class=${`${i.cls??""}${i.selected?" selected":""}`} variant=${i.danger?"danger":"default"}>
            ${i.icon?o`<ha-icon slot="icon" icon=${i.icon}></ha-icon>`:h}${i.label}
          </ha-dropdown-item>`)}
    </ha-dropdown>`}var jr=300*1e3,In=30,Ei=14;function vs(n,l,e,t){return`${n}:${l}:${e}:${t?"counter":"level"}`}var Ri=class{constructor(l){this._cache=new Map;this._pending=new Map;this.historyFallbackIds=new Set;this._hass=l}updateHass(l){this._hass=l}async getDetailStats(l,e,t=In){return this._getStats(l,t<=35?"hour":"day",t,e)}async getMiniStats(l,e){return this._getStats(l,"day",Ei,e)}async getBatchMiniStats(l){let e=new Map,t=[];for(let d of l){let u=vs(d.entityId,"day",Ei,d.isCounter),p=this._cache.get(u);p&&Date.now()-p.fetchedAt<jr?e.set(wt(d.entityId,d.isCounter),p.points):t.push(d)}if(t.length===0)return e;let i=t.filter(d=>d.isCounter).map(d=>d.entityId),s=t.filter(d=>!d.isCounter).map(d=>d.entityId),r=new Date(Date.now()-Ei*24*60*60*1e3).toISOString(),c=[];return i.length>0&&c.push(this._fetchBatch(i,"day",r,["state","sum","change"],!0,e)),s.length>0&&c.push(this._fetchBatch(s,"day",r,["mean","min","max"],!1,e)),await Promise.all(c),e}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(l,e,t,i){let s=vs(l,e,t,i),r=this._cache.get(s);if(r&&Date.now()-r.fetchedAt<jr)return r.points;if(this._pending.has(s))return this._pending.get(s);let c=this._fetchAndNormalize(l,e,t,i,s);this._pending.set(s,c);try{return await c}finally{this._pending.delete(s)}}async _fetchAndNormalize(l,e,t,i,s){let r=new Date(Date.now()-t*24*60*60*1e3).toISOString(),c=i?["state","sum","change"]:["mean","min","max"];try{let u=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:r,statistic_ids:[l],period:e,types:c}))[l]||[],p=this._normalizeRows(u,i);if(p.length<2){let g=await this._fetchHistoryFallback(l,r);g.length>=2?(p=g,this.historyFallbackIds.add(l)):this.historyFallbackIds.delete(l)}else this.historyFallbackIds.delete(l);return this._cache.set(s,{entityId:l,fetchedAt:Date.now(),period:e,points:p}),p}catch(d){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${l}:`,d),[]}}async _fetchHistoryFallback(l,e){try{let i=(await this._hass.connection.sendMessagePromise({type:"history/history_during_period",start_time:e,end_time:new Date().toISOString(),entity_ids:[l],minimal_response:!0,no_attributes:!0}))?.[l]||[];if(i.length>1e3){let c=Math.ceil(i.length/500);i=i.filter((d,u)=>u%c===0||u===i.length-1)}let s=[],r=null;for(let c of i){let d=c.s??c.state;if(d==null||d==="unknown"||d==="unavailable")continue;let u;if(d==="on"||d==="open"||d==="true")u=1;else if(d==="off"||d==="closed"||d==="false")u=0;else if(u=parseFloat(d),!Number.isFinite(u))continue;let p=c.lu??c.last_updated??c.last_changed,g=typeof p=="number"?p*1e3:p!=null?Date.parse(p):NaN;Number.isFinite(g)&&(r!=null&&r!==u&&s.push({ts:g,val:r}),s.push({ts:g,val:u}),r=u)}return s.sort((c,d)=>c.ts-d.ts),s.length&&r!=null&&s.push({ts:Date.now(),val:r}),s}catch(t){return console.warn(`[maintenance-supporter] History fallback failed for ${l}:`,t),[]}}async _fetchBatch(l,e,t,i,s,r){try{let c=await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:t,statistic_ids:l,period:e,types:i});for(let d of l){let u=c[d]||[],p=this._normalizeRows(u,s);r.set(wt(d,s),p),this._cache.set(vs(d,e,Ei,s),{entityId:d,fetchedAt:Date.now(),period:e,points:p})}}catch(c){console.warn("[maintenance-supporter] Batch statistics fetch failed:",c)}}_normalizeRows(l,e){let t=[];for(let i of l){let s=null;if(e?s=i.state??null:s=i.mean??null,s===null)continue;let r={ts:i.start,val:s};e||(i.min!=null&&(r.min=i.min),i.max!=null&&(r.max=i.max)),t.push(r)}return t.sort((i,s)=>i.ts-s.ts),t}};function ze(n,l){let e=n??0;return e<1024?`${e} B`:e<1024*1024?`${W(e/1024,l,1)} KB`:`${W(e/(1024*1024),l,1)} MB`}var Ci=8,ys=["newest","oldest","title","category"];function xs(n){return ys.includes(n??"")?n:"newest"}function Er(n,l){let e=new Intl.Collator(void 0,{numeric:!0,sensitivity:"base"}),t=c=>fe(c).trim(),i=(c,d)=>e.compare(t(c),t(d)),s=c=>c.kind==="weblink"?it.length+1:it.indexOf(Tt(c)),r=[...n];switch(l){case"oldest":return r.sort((c,d)=>(c.added_at||"").localeCompare(d.added_at||""));case"title":return r.sort(i);case"category":return r.sort((c,d)=>s(c)-s(d)||i(c,d));default:return r.sort((c,d)=>(d.added_at||"").localeCompare(c.added_at||""))}}function Oi(n,l){let e=Jt(l);if(!e.length)return n;let t=[];for(let i of n){let s=pt(e,[{text:i.title,weight:3},{text:i.filename,weight:2},{text:(i.tags||[]).join(" "),weight:2},{text:i.description,weight:2},{text:i.url,weight:1}]);s>0&&t.push({doc:i,score:s})}return t.sort((i,s)=>s.score-i.score).map(i=>i.doc)}var G=class extends L{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._filter="";this._loaded=!1;this._busy=!1;this._error="";this._hint="";this._addingLink=!1;this._linkUrl="";this._linkTitle="";this._category="manual";this._thumbs={};this._lightboxUrl="";this._editingId="";this._editTitle="";this._editCategory="manual";this._editDescription="";this._linkDescription="";this._sort=xs(X(P.docSort));this._dragOver=!1;this._loadedFor=null;this._loadSeq=0;this._localeReady=!1;this._singlePick=Pa()}_isImage(e){return e.kind==="file"&&(e.mime||"").startsWith("image/")}async _sign(e){return ni(this.hass,e.id)}get _lang(){return F(this.hass)}updated(e){if(super.updated(e),this.hass&&!this._localeReady&&(this._localeReady=!0,me(this._lang).then(()=>this.requestUpdate())),this.hass&&this.entryId&&this._loadedFor!==this.entryId){let t=this._loadedFor!==null;this._loadedFor=this.entryId,t&&this._resetForObject(),this._load()}}_resetForObject(){this._docs=[],this._loaded=!1,this._thumbs={},this._filter="",this._error="",this._hint="",this._addingLink=!1,this._linkUrl="",this._linkTitle="",this._linkDescription="",this._editingId="",this._lightboxUrl=""}async _load(){let e=this.entryId,t=++this._loadSeq,i=()=>t!==this._loadSeq||e!==this.entryId,s="",r=await I(this,{type:"maintenance_supporter/documents/list",entry_id:e},{onError:c=>{s=c}});if(!i()){if(this._loaded=!0,r===void 0){this._error=s;return}this._docs=r?.documents||[],this._error="",this._thumbs={},this._loadThumbs(i)}}async _write(e,t,i){this._error="",await I(this,e,{busy:s=>{this._busy=s},fallbackKey:i,reload:async()=>{t?.(),await this._load()},onError:s=>{this._error=s}})}async _signed(e){await I(this,e,{onError:t=>{this._error=t}})}async _loadThumbs(e=()=>!1){await Promise.all(this._docs.filter(t=>this._isImage(t)).map(async t=>{try{let i=await this._sign(t);if(e())return;this._thumbs={...this._thumbs,[t.id]:i}}catch{}}))}_category_of(e){return Tt(e)}_labelKeydown(e){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),e.currentTarget.querySelector("input")?.click())}_onFileInput(e){let t=e.target,i=Array.from(t.files??[]);i.length&&this._uploadFiles(i),t.value=""}_onDrop(e){if(e.preventDefault(),this._dragOver=!1,!this.canWrite||this._busy)return;let t=Array.from(e.dataTransfer?.files??[]);t.length&&this._uploadFiles(t)}_onDragOver(e){this.canWrite&&(e.preventDefault(),this._dragOver=!0)}_onDragLeave(e){let t=e.relatedTarget;(!t||!e.currentTarget.contains(t))&&(this._dragOver=!1)}async _uploadFiles(e,t){let i=t??this._category,s=this.entryId;this._busy=!0,this._error="",this._hint="";let r=0,c=0,d=[];try{for(let u of e){let p;try{p=await Ia(this.hass,s,u,[i])}catch(g){let m=g instanceof Error&&g.message==="doc_too_large"?"doc_too_large":"doc_upload_failed";d.push(`${u.name}: ${a(m,this._lang)}`);continue}p.duplicate_in_object?c++:p.deduped&&r++}if(s!==this.entryId)return;c?this._hint=a("doc_dup_in_object",this._lang):r&&(this._hint=a("doc_deduped",this._lang)),await this._load()}finally{d.length&&s===this.entryId&&(this._error=d.join(" \xB7 ")),this._busy=!1}}async _download(e){await this._signed(()=>oi(this.hass,e.id,e.filename||e.title||"document"))}async _preview(e){if(this._isImage(e)){this._lightboxUrl=this._thumbs[e.id]||await this._sign(e);return}await this._signed(()=>Fe(this.hass,e.id))}_openDoc(e){e.kind==="file"?this._preview(e):de(e.url)&&window.open(e.url,"_blank","noopener")}_startEdit(e){this._editingId=e.id,this._editTitle=e.title||"",this._editCategory=this._category_of(e),this._editDescription=e.description||"",this._addingLink=!1,this._error=""}_cancelEdit(){this._editingId=""}_setSort(e){this._sort=xs(e),q(P.docSort,this._sort)}async _saveEdit(e){let t=(e.tags||[]).filter(s=>!it.includes(s)),i=e.kind==="file"?[this._editCategory,...t]:e.tags??[];await this._write({type:"maintenance_supporter/documents/update",doc_id:e.id,title:this._editTitle.trim()||e.filename||e.url||"",tags:i,description:this._editDescription.trim()},()=>{this._editingId=""})}async _delete(e){let t=fe(e);await fi(this.hass,{title:a("delete",this._lang),message:a("doc_delete_confirm",this._lang).replace("{name}",t),confirmText:a("delete",this._lang),danger:!0})&&await this._write({type:"maintenance_supporter/documents/delete",doc_id:e.id})}async _addLink(){let e=this._linkUrl.trim();if(!e)return;let t=this.entryId;await this._write({type:"maintenance_supporter/documents/add_link",entry_id:t,url:e,title:this._linkTitle.trim()||null,description:this._linkDescription.trim()||null},()=>{this._linkUrl="",this._linkTitle="",this._linkDescription="",this._addingLink=!1},"doc_link_not_allowed")}render(){let e=this._lang;return o`
      <div
        class="doc-zone ${this._dragOver?"drag-over":""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}
      >
        ${this._dragOver&&this.canWrite?o`<div class="drop-overlay">
              <ha-icon icon="mdi:tray-arrow-down"></ha-icon> ${a("doc_drop_hint",e)}
            </div>`:h}
      <div class="doc-header">
        <h3>${a("documents",e)} (${this._docs.length})</h3>
        ${this.canWrite?o`
              <div class="doc-actions">
                <select
                  class="cat-select"
                  .value=${this._category}
                  ?disabled=${this._busy}
                  @change=${t=>this._category=t.target.value}
                >
                  ${it.map(t=>o`<option value=${t}>${a(`doc_cat_${t}`,e)}</option>`)}
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

      ${this._error?o`<div class="doc-msg error">${this._error}</div>`:h}
      ${this._hint?o`<div class="doc-msg hint">${this._hint}</div>`:h}

      ${this._addingLink&&this.canWrite?o`
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

      ${this._loaded&&this._docs.length>=2?o`<div class="doc-tools">
            <ha-icon icon="mdi:sort"></ha-icon>
            <select class="sort-select" aria-label=${a("doc_sort",e)} .value=${this._sort}
              @change=${t=>this._setSort(t.target.value)}>
              ${ys.map(t=>o`<option value=${t} ?selected=${t===this._sort}>${a(`doc_sort_${t}`,e)}</option>`)}
            </select>
          </div>`:h}
      ${this._loaded&&this._docs.length>=Ci?o`<div class="doc-filter">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input type="search" aria-label=${a("doc_search",e)} placeholder=${a("doc_search",e)}
              .value=${this._filter} @input=${t=>this._filter=t.target.value} />
          </div>`:h}
      ${this._loaded?this._docs.length===0?o`<div class="doc-empty">${a("documents_empty",e)}</div>`:(()=>{let t=this._filter.trim()?Oi(this._docs,this._filter):Er(this._docs,this._sort);return t.length===0?o`<div class="doc-empty">${a("doc_search_none",e)}</div>`:o`<div class="doc-list">${t.map(i=>this._renderDoc(i,e))}</div>`})():o`<div class="doc-empty">${a("loading",e)}</div>`}

      ${this._lightboxUrl?o`<div class="lightbox top-layer" popover="manual" ${vt} @click=${()=>this._lightboxUrl=""}>
            <img class="lightbox-img" src=${this._lightboxUrl} @click=${t=>t.stopPropagation()} />
            <button class="lightbox-close" title=${a("doc_close",e)} @click=${()=>this._lightboxUrl=""}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>`:h}
      </div>
    `}_renderDoc(e,t){if(this._editingId===e.id)return this._renderEdit(e,t);let i=e.kind==="file",s=this._category_of(e),r=i?`${a(`doc_cat_${s}`,t)} \xB7 ${ze(e.size,t)}`:a("doc_link_badge",t),c=this._thumbs[e.id];return o`
      <div class="doc-row">
        ${i&&c?o`<img
              class="doc-thumb"
              src=${c}
              alt=${e.title||""}
              title=${a("doc_open",t)}
              @click=${()=>this._preview(e)}
            />`:o`<ha-icon
              class="doc-icon ${i?"clickable":""}"
              icon=${i?ji[s]:"mdi:link-variant"}
              @click=${()=>i&&this._preview(e)}
            ></ha-icon>`}
        <div
          class="doc-info"
          role="button"
          tabindex="0"
          title=${a("doc_open",t)}
          @click=${()=>this._openDoc(e)}
          @keydown=${d=>{(d.key==="Enter"||d.key===" ")&&(d.preventDefault(),this._openDoc(e))}}
        >
          <div class="doc-title">${fe(e)}</div>
          <div class="doc-meta">${r}</div>
          ${e.description?o`<div class="doc-desc">${e.description}</div>`:h}
        </div>
        <div class="doc-row-actions">
          ${i?o`
                <button class="icon-btn" title=${a("doc_open",t)} @click=${()=>this._preview(e)}>
                  <ha-icon icon="mdi:eye-outline"></ha-icon>
                </button>
                <button class="icon-btn" title=${a("doc_download",t)} @click=${()=>this._download(e)}>
                  <ha-icon icon="mdi:download"></ha-icon>
                </button>`:o`<a
                class="icon-btn"
                href=${de(e.url)?e.url:"#"}
                target="_blank"
                rel="noopener noreferrer"
                title=${a("doc_open",t)}
              ><ha-icon icon="mdi:open-in-new"></ha-icon></a>`}
          ${this.canWrite?o`
                <button class="icon-btn" title=${a("edit",t)} ?disabled=${this._busy} @click=${()=>this._startEdit(e)}>
                  <ha-icon icon="mdi:pencil"></ha-icon>
                </button>
                <button class="icon-btn danger" title=${a("delete",t)} ?disabled=${this._busy} @click=${()=>this._delete(e)}>
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>`:h}
        </div>
      </div>
    `}_renderEdit(e,t){let i=e.kind==="file";return o`
      <div class="doc-row editing">
        <input
          class="edit-title"
          type="text"
          placeholder=${a("doc_link_title",t)}
          .value=${this._editTitle}
          ?disabled=${this._busy}
          @input=${s=>this._editTitle=s.target.value}
        />
        ${i?o`<select
              class="cat-select"
              ?disabled=${this._busy}
              @change=${s=>this._editCategory=s.target.value}
            >
              ${it.map(s=>o`<option value=${s} ?selected=${s===this._editCategory}>${a(`doc_cat_${s}`,t)}</option>`)}
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
    `}};G.styles=[za,_i,H`
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
  `],_([j({attribute:!1})],G.prototype,"hass",2),_([j({attribute:!1})],G.prototype,"entryId",2),_([j({type:Boolean})],G.prototype,"canWrite",2),_([f()],G.prototype,"_docs",2),_([f()],G.prototype,"_filter",2),_([f()],G.prototype,"_loaded",2),_([f()],G.prototype,"_busy",2),_([f()],G.prototype,"_error",2),_([f()],G.prototype,"_hint",2),_([f()],G.prototype,"_addingLink",2),_([f()],G.prototype,"_linkUrl",2),_([f()],G.prototype,"_linkTitle",2),_([f()],G.prototype,"_category",2),_([f()],G.prototype,"_thumbs",2),_([f()],G.prototype,"_lightboxUrl",2),_([f()],G.prototype,"_editingId",2),_([f()],G.prototype,"_editTitle",2),_([f()],G.prototype,"_editCategory",2),_([f()],G.prototype,"_editDescription",2),_([f()],G.prototype,"_linkDescription",2),_([f()],G.prototype,"_sort",2),_([f()],G.prototype,"_dragOver",2);customElements.get("maintenance-documents-section")||customElements.define("maintenance-documents-section",G);function Mi(n,l,e){return a(`part_waiting_${n}`,e).replace("{count}",W(l,e))}var ve=class extends L{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._attachId="";this._filter="";this._loadedKey="";this._localeReady=!1}get _lang(){return F(this.hass)}get _refId(){return this.partId||this.taskId||""}get _linkField(){return this.partId?"part_ids":"task_ids"}updated(e){super.updated(e),this.hass&&!this._localeReady&&(this._localeReady=!0,me(this._lang).then(()=>this.requestUpdate()));let t=`${this.entryId}|${this._refId}`;this.hass&&this.entryId&&this._refId&&this._loadedKey!==t&&(this._loadedKey=t,this._load())}async _load(){let e=await I(this,{type:"maintenance_supporter/documents/list",entry_id:this.entryId},{onError:t=>{this._error=t}});this._loaded=!0,e!==void 0&&(this._docs=e?.documents||[],this._error="")}async _update(e){this._error="",await I(this,{type:"maintenance_supporter/documents/update",...e},{busy:t=>{this._busy=t},reload:()=>this._load(),onError:t=>{this._error=t}})}async _signed(e){await I(this,e,{onError:t=>{this._error=t}})}_links(e){return e[this._linkField]||[]}_linked(){return this._docs.filter(e=>this._links(e).includes(this._refId))}_available(){return this._docs.filter(e=>!this._links(e).includes(this._refId))}async _setLinks(e,t){await this._update({doc_id:e.id,[this._linkField]:t})}_link(){let e=this._docs.find(t=>t.id===this._attachId);e&&(this._attachId="",this._setLinks(e,[...this._links(e),this._refId]))}_unlink(e){this._setLinks(e,this._links(e).filter(t=>t!==this._refId))}_isPdf(e){return e.mime==="application/pdf"||(e.filename||"").toLowerCase().endsWith(".pdf")}_pageFor(e){return this._isPdf(e)&&this.taskId?e.task_pages?.[this.taskId]:void 0}async _open(e){if(e.kind==="weblink"){de(e.url)&&window.open(e.url,"_blank","noopener");return}let t=this._pageFor(e);await this._signed(()=>Fe(this.hass,e.id,t?`#page=${t}`:""))}async _setPage(e,t){this.taskId&&await this._update({doc_id:e.id,task_pages:{[this.taskId]:t}})}async _download(e){await this._signed(()=>oi(this.hass,e.id,e.filename||e.title||"document"))}render(){if(!this._loaded||this._docs.length===0)return h;let e=this._lang,t=this._linked(),i=this._available();return o`
      <div class="task-docs">
        <h3><ha-icon icon="mdi:paperclip"></ha-icon> ${a("documents",e)} (${t.length})</h3>
        ${this._error?o`<div class="tdoc-error">${this._error}</div>`:h}
        ${t.length>=Ci?o`<div class="doc-filter">
              <ha-icon icon="mdi:magnify"></ha-icon>
              <input type="search" aria-label=${a("doc_search",e)} placeholder=${a("doc_search",e)}
                .value=${this._filter} @input=${s=>this._filter=s.target.value} />
            </div>`:h}
        ${t.length===0?o`<div class="tdoc-empty">${a(this.partId?"doc_part_none":"doc_task_none",e)}</div>`:(()=>{let s=Oi(t,this._filter);return s.length===0?o`<div class="tdoc-empty">${a("doc_search_none",e)}</div>`:o`<div class="tdoc-list">${s.map(r=>this._renderRow(r,e))}</div>`})()}
        ${this.canWrite&&i.length?o`<div class="tdoc-attach">
              <select
                class="tdoc-select"
                ?disabled=${this._busy}
                @change=${s=>this._attachId=s.target.value}
              >
                <option value="" ?selected=${!this._attachId}>${a("doc_link_existing",e)}</option>
                ${i.map(s=>o`<option value=${s.id} ?selected=${s.id===this._attachId}>${fe(s)}</option>`)}
              </select>
              <button class="tdoc-btn" ?disabled=${this._busy||!this._attachId} @click=${this._link}>
                <ha-icon icon="mdi:link-variant-plus"></ha-icon> ${a("doc_attach",e)}
              </button>
            </div>`:h}
      </div>
    `}_renderRow(e,t){let i=e.kind==="file",s=this._isPdf(e),r=this._pageFor(e),c=Tt(e),d=i?ze(e.size,t):a("doc_link_badge",t);return o`
      <div class="tdoc-row">
        <ha-icon class="tdoc-icon" icon=${i?ji[c]:"mdi:link-variant"}></ha-icon>
        <div
          class="tdoc-info"
          role="button"
          tabindex="0"
          title=${r?`${a("doc_open",t)} \xB7 ${a("doc_page",t)} ${r}`:a("doc_open",t)}
          @click=${()=>this._open(e)}
          @keydown=${u=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),this._open(e))}}
        >
          <div class="tdoc-title">${fe(e)}</div>
          ${e.description?o`<div class="tdoc-desc">${e.description}</div>`:h}
          <div class="tdoc-meta">
            ${d}${r?o` · <span class="tdoc-pagetag">${a("doc_page",t)} ${r}</span>`:h}
          </div>
        </div>
        ${this.canWrite&&s&&this.taskId?o`<input
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
        ${i?o`<button class="icon-btn" title=${a("doc_download",t)} @click=${()=>this._download(e)}>
              <ha-icon icon="mdi:download"></ha-icon>
            </button>`:h}
        ${this.canWrite?o`<button class="icon-btn" title=${a("doc_unlink",t)} ?disabled=${this._busy} @click=${()=>this._unlink(e)}>
              <ha-icon icon="mdi:link-variant-off"></ha-icon>
            </button>`:h}
      </div>
    `}};ve.styles=H`
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
  `,_([j({attribute:!1})],ve.prototype,"hass",2),_([j({attribute:!1})],ve.prototype,"entryId",2),_([j({attribute:!1})],ve.prototype,"taskId",2),_([j({attribute:!1})],ve.prototype,"partId",2),_([j({type:Boolean})],ve.prototype,"canWrite",2),_([f()],ve.prototype,"_docs",2),_([f()],ve.prototype,"_loaded",2),_([f()],ve.prototype,"_busy",2),_([f()],ve.prototype,"_error",2),_([f()],ve.prototype,"_attachId",2),_([f()],ve.prototype,"_filter",2);customElements.get("maintenance-task-documents")||customElements.define("maintenance-task-documents",ve);function zn(n){let l=n.package_size;return typeof l=="number"&&Number.isFinite(l)&&l>0?l:1}var we=class extends L{constructor(){super();this.notBooked=!1;this.nowrap=!1;this._open=!1;this._qty="";this._invalid=!1;this._busy=!1;this._error="";this.addEventListener("click",e=>e.stopPropagation())}get _lang(){return F(this.hass)}updated(){this.toggleAttribute("open",this._open)}_start(){this._qty=String(zn(this.sparePart)),this._invalid=!1,this._error="",this._open=!0,this.updateComplete.then(()=>this.shadowRoot?.querySelector("input")?.select())}async _use(){if(this._busy)return;let e=parseFloat(this._qty);if(!Number.isFinite(e)||e<=0){this._invalid=!0;return}this._invalid=!1;let t=await I(this,{type:"maintenance_supporter/part/use",entry_id:this.entryId,part_id:this.sparePart.id,quantity:e},{busy:i=>{this._busy=i},onError:i=>{this._error=i}});t!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("part-used",{detail:{partId:this.sparePart.id,stock:t?.stock??0,restoring:t?.restoring??0},bubbles:!0,composed:!0})))}render(){let e=this._lang;return this._open?o`
      <span class="use-field">
        <input
          class=${this._invalid?"invalid":""}
          type="number"
          min="0"
          step="any"
          .value=${this._qty}
          aria-label=${a("part_use_how_many",e)}
          title=${a("part_use_how_many",e)}
          @input=${t=>this._qty=t.target.value}
          @keydown=${t=>{t.key==="Enter"&&this._use(),t.key==="Escape"&&(this._open=!1)}}
        />
        ${this.sparePart.unit?o`<span class="unit">${this.sparePart.unit}</span>`:h}
        <button class="use-pill confirm" title=${a("part_use_hint",e)} .disabled=${this._busy} @click=${()=>this._use()}>
          <ha-icon icon="mdi:check"></ha-icon>${a("part_use",e)}
        </button>
        <ha-icon-button class="use-cancel" title=${a("cancel",e)} @click=${()=>this._open=!1}
          ><ha-icon icon="mdi:close"></ha-icon
        ></ha-icon-button>
      </span>
      ${this.notBooked?o`<div class="note">${a("part_use_not_booked",e)}</div>`:h}
      ${this._error?ge("error",this._error):h}
    `:o`<button class="use-pill" title=${a("part_use_hint",e)} @click=${()=>this._start()}>
        <ha-icon icon="mdi:package-variant-minus"></ha-icon>${a("part_use",e)}
      </button>`}};we.styles=H`
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
  `,_([j({attribute:!1})],we.prototype,"hass",2),_([j({attribute:!1})],we.prototype,"entryId",2),_([j({attribute:!1})],we.prototype,"sparePart",2),_([j({type:Boolean})],we.prototype,"notBooked",2),_([j({type:Boolean,reflect:!0})],we.prototype,"nowrap",2),_([f()],we.prototype,"_open",2),_([f()],we.prototype,"_qty",2),_([f()],we.prototype,"_invalid",2),_([f()],we.prototype,"_busy",2),_([f()],we.prototype,"_error",2);customElements.get("ms-part-use")||customElements.define("ms-part-use",we);function Hn(n){return Sa(n)}var lt=n=>n.trim()===""?NaN:parseFloat(n),oe=class extends L{constructor(){super();this.currencySymbol="\u20AC";this.onUse=!1;this._open=!1;this._qty="";this._price="";this._total="";this._date="";this._notes="";this._invalid="";this._busy=!1;this._error="";this.addEventListener("click",e=>e.stopPropagation())}get _lang(){return F(this.hass)}updated(){this.toggleAttribute("open",this._open)}_start(){let e=this.sparePart;this._qty=String(Hn(e)),this._price=typeof e.cost=="number"?String(e.cost):"",this._total="",this._followPrice(),this._date=_e(),this._notes="",this._invalid="",this._error="",this._open=!0,this.updateComplete.then(()=>this.shadowRoot?.querySelector("input.qty")?.select())}_followPrice(){let e=lt(this._qty),t=lt(this._price);Number.isFinite(e)&&Number.isFinite(t)?this._total=String(hi(e*t)):this._price.trim()===""&&(this._total="")}_followTotal(){let e=lt(this._qty),t=lt(this._total);Number.isFinite(e)&&e>0&&Number.isFinite(t)?this._price=String(hi(t/e)):this._total.trim()===""&&(this._price="")}async _record(){if(this._busy)return;let e=lt(this._qty),t=lt(this._total);if(!Number.isFinite(e)||e<=0){this._invalid="qty";return}if(this._total.trim()!==""&&(!Number.isFinite(t)||t<0)){this._invalid="total";return}this._invalid="";let i={type:"maintenance_supporter/part/purchase",entry_id:this.entryId,part_id:this.sparePart.id,quantity:e};this._total.trim()!==""&&(i.cost=hi(t)),this._date&&this._date!==_e()&&(i.date=this._date),this._notes.trim()&&(i.notes=this._notes.trim());let s=await I(this,i,{busy:r=>{this._busy=r},onError:r=>{this._error=r}});s!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("part-bought",{detail:{partId:this.sparePart.id,stock:s?.stock??0},bubbles:!0,composed:!0})))}_keys(e){e.target?.tagName==="INPUT"&&(e.key==="Enter"&&this._record(),e.key==="Escape"&&(this._open=!1))}render(){let e=this._lang;if(!this._open)return o`<button class="buy-pill" title=${a("part_bought_hint",e)} @click=${()=>this._start()}>
        <ha-icon icon="mdi:cart-plus"></ha-icon>${a("part_bought",e)}
      </button>`;let t=this.sparePart,i=typeof t.package_size=="number"&&t.package_size>0?t.package_size:null,s=lt(this._qty),r=this.currencySymbol;return o`
      <div class="buy-form" @keydown=${c=>this._keys(c)}>
        <label class="f">
          <span>${i?a("part_bought_packages",e).replace("{size}",et(i,t.unit,e)):a("part_bought_quantity",e)}</span>
          <input class="qty ${this._invalid==="qty"?"invalid":""}" type="number" min="0" step="any" inputmode="decimal"
            .value=${this._qty}
            @input=${c=>{this._qty=c.target.value,this._followPrice()}} />
        </label>
        <label class="f">
          <span>${i?a("part_bought_price_package",e):a("part_bought_price_each",e)} (${r})</span>
          <input class="price" type="number" min="0" step="0.01" inputmode="decimal"
            .value=${this._price}
            @input=${c=>{this._price=c.target.value,this._followPrice()}} />
        </label>
        <label class="f">
          <span>${a("part_bought_total",e)} (${r})</span>
          <input class="total ${this._invalid==="total"?"invalid":""}" type="number" min="0" step="0.01" inputmode="decimal"
            .value=${this._total}
            @input=${c=>{this._total=c.target.value,this._followTotal()}} />
        </label>
        <div class="f date">
          <span>${a("part_bought_date",e)}</span>
          <ms-date-field kind="date" .hass=${this.hass} .lang=${e} .value=${this._date}
            @value-changed=${c=>this._date=c.detail.value||_e()}></ms-date-field>
        </div>
        <label class="f notes">
          <span>${a("notes_label",e)}</span>
          <input class="notes-input" type="text" maxlength="2000" placeholder=${a("part_bought_note",e)}
            .value=${this._notes}
            @input=${c=>this._notes=c.target.value} />
        </label>
        <div class="adds">
          ${Number.isFinite(s)&&s>0?a("part_bought_adds",e).replace("{qty}",et(ui(t,s),t.unit,e)):h}
        </div>
        ${this.onUse?o`<div class="note">${a("part_bought_on_use",e)}</div>`:h}
        ${this._error?ge("error",this._error):h}
        <div class="actions">
          <button class="buy-pill confirm" .disabled=${this._busy} @click=${()=>this._record()}>
            <ha-icon icon="mdi:check"></ha-icon>${a("part_bought_confirm",e)}
          </button>
          <button class="buy-pill" @click=${()=>this._open=!1}>${a("cancel",e)}</button>
        </div>
      </div>
    `}};oe.styles=H`
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
  `,_([j({attribute:!1})],oe.prototype,"hass",2),_([j({attribute:!1})],oe.prototype,"entryId",2),_([j({attribute:!1})],oe.prototype,"sparePart",2),_([j({attribute:!1})],oe.prototype,"currencySymbol",2),_([j({type:Boolean})],oe.prototype,"onUse",2),_([f()],oe.prototype,"_open",2),_([f()],oe.prototype,"_qty",2),_([f()],oe.prototype,"_price",2),_([f()],oe.prototype,"_total",2),_([f()],oe.prototype,"_date",2),_([f()],oe.prototype,"_notes",2),_([f()],oe.prototype,"_invalid",2),_([f()],oe.prototype,"_busy",2),_([f()],oe.prototype,"_error",2);customElements.get("ms-part-purchase")||customElements.define("ms-part-purchase",oe);var Ln=["charge","sharpen","clean","dry","refill","restore"],Bn=500,Nn={name:"",vendor:"",mpn:"",gtin:"",storage_location:"",product_url:"",unit:"",cost:"",stock:"",reuse:"",restoring:"",cost_mode:"",reorder_threshold:"",restock_quantity:"",package_size:"",auto_buy_task:!0,notes:""},te=class extends L{constructor(){super(...arguments);this.parts=[];this.canWrite=!1;this.currencySymbol="\u20AC";this.partsCostMode="purchase";this.fleet=!1;this._editing=null;this._opened=null;this._busy=!1;this._error="";this._restockFor=null;this._restockQty="";this._restockInvalid=!1;this._disposeFor=null;this._disposeQty="1";this._disposeInvalid=!1;this._docsFor=null}get _lang(){return F(this.hass)}connectedCallback(){super.connectedCallback(),me(this._lang).then(()=>this.requestUpdate())}_notifyChanged(){this.dispatchEvent(new CustomEvent("parts-changed",{bubbles:!0,composed:!0}))}_send(e){return this._error="",I(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_openAdd(){this._editing={...Nn},this._opened=null}_openEdit(e){this._editing={id:e.id,name:e.name,vendor:e.vendor||"",mpn:e.mpn||"",gtin:e.gtin||"",storage_location:e.storage_location||"",product_url:e.product_url||"",unit:e.unit||"",cost:e.cost!=null?String(e.cost):"",stock:e.stock!=null?String(e.stock):"",reuse:e.reuse||"",restoring:e.restoring?String(e.restoring):"",cost_mode:e.cost_mode||"",reorder_threshold:e.reorder_threshold!=null?String(e.reorder_threshold):"",restock_quantity:e.restock_quantity!=null?String(e.restock_quantity):"",package_size:e.package_size!=null?String(e.package_size):"",auto_buy_task:!!e.auto_buy_task,notes:e.notes||""},this._opened={...this._editing}}_formValue(e){let t=i=>i.trim()===""?null:Number(i);return{entry_id:this.entryId,name:e.name.trim(),vendor:e.vendor.trim()||null,mpn:e.mpn.trim()||null,gtin:e.gtin.trim()||null,storage_location:e.storage_location.trim()||null,product_url:e.product_url.trim()||null,unit:e.unit.trim()||null,cost:t(e.cost),stock:t(e.stock),reuse:e.reuse||null,...e.reuse?{restoring:t(e.restoring)??0}:{},...this.fleet?{}:{cost_mode:e.cost_mode||null},reorder_threshold:t(e.reorder_threshold),restock_quantity:t(e.restock_quantity),package_size:t(e.package_size),auto_buy_task:e.auto_buy_task,notes:e.notes.trim()||null}}async _save(){let e=this._editing;if(this._busy||!e||!e.name.trim())return;let t=this._formValue(e),i=this._opened;e.id&&i&&(e.stock===i.stock&&delete t.stock,e.restoring===i.restoring&&e.reuse===i.reuse&&delete t.restoring);let s=e.id?"maintenance_supporter/part/update":"maintenance_supporter/part/create";await this._send(e.id?{type:s,part_id:e.id,...t}:{type:s,...t})!==void 0&&(this._editing=null,this._notifyChanged())}async _delete(e){if(!await fi(this.hass,{title:a("delete",this._lang),message:a("part_delete_confirm",this._lang).replace("{name}",e.name),confirmText:a("delete",this._lang),danger:!0}))return;await this._send({type:"maintenance_supporter/part/delete",entry_id:this.entryId,part_id:e.id})!==void 0&&this._notifyChanged()}async _restock(e){if(this._busy)return;let t=parseFloat(this._restockQty);if(!Number.isFinite(t)||t===0){this._restockInvalid=!0;return}this._restockInvalid=!1;let i=await this._send({type:"maintenance_supporter/part/restock",entry_id:this.entryId,part_id:e.id,delta:t});this._restockFor=null,i!==void 0&&(e.stock=i?.stock,this.requestUpdate(),this._notifyChanged())}async _readyAgain(e){if(this._busy)return;let t=await this._send({type:"maintenance_supporter/part/ready_again",entry_id:this.entryId,part_id:e.id});t&&(e.stock=t.stock,e.restoring=t.restoring,this.requestUpdate(),this._notifyChanged())}async _dispose(e){if(this._busy)return;let t=parseFloat(this._disposeQty);if(!Number.isFinite(t)||t<=0){this._disposeInvalid=!0;return}this._disposeInvalid=!1;let i=await this._send({type:"maintenance_supporter/part/dispose",entry_id:this.entryId,part_id:e.id,quantity:t});this._disposeFor=null,i&&(e.stock=i.stock,e.restoring=i.restoring,this.requestUpdate(),this._notifyChanged())}_onUsed(e,t){e.stock=t.stock,e.restoring=t.restoring,this.requestUpdate(),this._notifyChanged()}_renderUse(e){return!this.canWrite||!(typeof e.stock=="number"&&e.stock>0)?h:o`<ms-part-use
      .hass=${this.hass}
      .entryId=${this.entryId}
      .sparePart=${e}
      ?notBooked=${bt(e,this.partsCostMode,this.fleet)==="use"}
      @part-used=${t=>this._onUsed(e,t.detail)}
    ></ms-part-use>`}_onBought(e,t){e.stock=t.stock,this.requestUpdate(),this._notifyChanged()}_renderBought(e){return!this.canWrite||typeof e.stock!="number"?h:o`<ms-part-purchase
      .hass=${this.hass}
      .entryId=${this.entryId}
      .sparePart=${e}
      .currencySymbol=${this.currencySymbol}
      ?onUse=${bt(e,this.partsCostMode,this.fleet)==="use"}
      @part-bought=${t=>this._onBought(e,t.detail)}
    ></ms-part-purchase>`}_renderDispose(e,t){return this._disposeFor!==e.id?o`<button class="ready-again dispose" title=${a("part_dispose_hint",t)} .disabled=${this._busy}
        @click=${()=>{this._disposeFor=e.id,this._disposeQty="1",this._disposeInvalid=!1}}>
        <ha-icon icon="mdi:trash-can-outline"></ha-icon>${a("part_dispose",t)}
      </button>`:o`<input
        class="restock-input dispose-input${this._disposeInvalid?" invalid":""}"
        type="number"
        min="1"
        max=${String(e.restoring??0)}
        .value=${this._disposeQty}
        aria-label=${a("part_dispose_how_many",t)}
        title=${a("part_dispose_how_many",t)}
        @input=${i=>this._disposeQty=i.target.value}
        @keydown=${i=>{i.key==="Enter"&&this._dispose(e),i.key==="Escape"&&(this._disposeFor=null)}}
      />
      <button class="ready-again dispose confirm" title=${a("part_dispose_hint",t)} .disabled=${this._busy} @click=${()=>this._dispose(e)}>
        <ha-icon icon="mdi:check"></ha-icon>${a("part_dispose",t)}
      </button>
      <ha-icon-button title=${a("cancel",t)} @click=${()=>this._disposeFor=null}
        ><ha-icon icon="mdi:close"></ha-icon
      ></ha-icon-button>`}_identLine(e){return[e.vendor,e.mpn?`MPN: ${e.mpn}`:"",e.gtin?`GTIN: ${e.gtin}`:""].filter(Boolean).join(" \xB7 ")}_renderRow(e){let t=this._lang,i=e.stock!==null&&e.stock!==void 0,s=this._identLine(e),r=this._docsFor===e.id;return o`
      <div class="part-row ${e.is_low?"low":""}">
        <ha-icon class="part-icon" icon=${e.is_low?"mdi:cart-arrow-down":"mdi:package-variant-closed"}></ha-icon>
        <div class="part-main">
          <div class="part-name">
            ${zs(e.shopping_url)?o`<a href=${e.shopping_url} target="_blank" rel="noopener noreferrer">${e.name}</a>`:e.name}
            ${i?o`<span class="stock-badge ${e.is_low?"low":""}"
                  >${et(e.stock,e.unit,t)}${e.reorder_threshold!=null?o`<span class="threshold">/${W(e.reorder_threshold,t)}</span>`:h}</span
                >`:h}
            ${this._renderUse(e)}
            ${this._renderBought(e)}
          </div>
          ${i&&e.reuse&&(e.restoring??0)>0?o`<div class="part-waiting">
                <span class="waiting-badge">${Mi(e.reuse,e.restoring,t)}</span>
                ${this.canWrite?o`<button class="ready-again" title=${a("part_ready_again_hint",t)} .disabled=${this._busy}
                        @click=${()=>this._readyAgain(e)}>
                        <ha-icon icon="mdi:check"></ha-icon>${a(`part_reuse_${e.reuse}`,t)}
                      </button>
                      ${this._renderDispose(e,t)}`:h}
              </div>`:h}
          <div class="part-meta">
            ${s?o`<span>${s}</span>`:h}
            ${e.storage_location?o`<span class="loc"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${e.storage_location}</span>`:h}
          </div>
          ${e.notes?o`<div class="part-notes">${e.notes}</div>`:h}
        </div>
        <ha-icon-button
          title=${a("documents",t)}
          class=${r?"docs-open":""}
          @click=${()=>this._docsFor=r?null:e.id}
          ><ha-icon icon="mdi:paperclip"></ha-icon
        ></ha-icon-button>
        ${this.canWrite?o`
              ${this._restockFor===e.id?o`
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
                  `:o`
                    <ha-icon-button
                      title=${a("part_restock",t)}
                      .disabled=${this._busy}
                      @click=${()=>{this._restockFor=e.id,this._restockInvalid=!1,this._restockQty=String(ui(e))}}
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
      ${r?o`<div class="part-docs">
            <maintenance-task-documents
              .hass=${this.hass}
              .entryId=${this.entryId}
              .partId=${e.id}
              .canWrite=${this.canWrite}
            ></maintenance-task-documents>
          </div>`:h}
    `}_field(e,t,i={}){let s=this._editing;return o`
      <label class="form-field">
        <span>${e}</span>
        <input
          type=${i.type||"text"}
          .value=${String(s[t]??"")}
          placeholder=${i.placeholder||""}
          @input=${r=>{this._editing[t]=r.target.value,this.requestUpdate()}}
        />
      </label>
    `}_renderCostMode(e){let t=this._editing,i=s=>a(s==="use"?"settings_parts_cost_use":"settings_parts_cost_purchase",e);return o`
      <label class="form-field">
        <span>${a("part_cost_mode",e)}</span>
        <select
          class="cost-mode-select"
          .value=${t.cost_mode}
          @change=${s=>{this._editing={...this._editing,cost_mode:s.target.value}}}
        >
          <option value="" ?selected=${!t.cost_mode}>${a("part_cost_mode_house",e).replace("{mode}",i(this.partsCostMode))}</option>
          <option value="purchase" ?selected=${t.cost_mode==="purchase"}>${i("purchase")}</option>
          <option value="use" ?selected=${t.cost_mode==="use"}>${i("use")}</option>
        </select>
      </label>
      <div class="form-hint">${a("part_cost_mode_hint",e)}</div>
    `}_renderForm(){let e=this._lang,t=this._editing;return o`
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
          ${this.fleet?h:this._renderCostMode(e)}
          ${this._field(a("part_stock",e),"stock",{type:"number"})}
          <label class="form-field">
            <span>${a("part_reuse",e)}</span>
            <select
              class="reuse-select"
              .value=${t.reuse}
              @change=${i=>{this._editing={...this._editing,reuse:i.target.value}}}
            >
              <option value="" ?selected=${!t.reuse}>${a("part_reuse_none",e)}</option>
              ${Ln.map(i=>o`<option value=${i} ?selected=${t.reuse===i}>${a(`part_reuse_${i}`,e)}</option>`)}
            </select>
          </label>
          ${t.reuse?this._field(a("part_restoring",e),"restoring",{type:"number"}):h}
          ${t.reuse?o`<div class="form-hint">${a("part_reuse_hint",e)}</div>`:h}
          ${this._field(a("part_reorder_threshold",e),"reorder_threshold",{type:"number"})}
          ${this._field(a("part_package_size",e),"package_size",{type:"number"})}
          ${this._field(t.package_size.trim()?a("part_restock_packages",e):a("part_restock_quantity",e),"restock_quantity",{type:"number"})}
          ${t.package_size.trim()?o`<div class="form-hint">${a("part_package_hint",e)}</div>`:h}
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
              maxlength=${Bn}
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
    `}_inventoryValue(){let e=0,t=!1;for(let i of this.parts){let s=Ta(i),r=typeof i.stock=="number"?i.stock:null;s!==null&&r!==null&&(e+=s*r,t=!0)}return t?e:null}render(){let e=this._lang;return!this.parts.length&&!this.canWrite?h:o`
      <div class="section-head">
        <h3>
          <ha-icon icon="mdi:package-variant"></ha-icon>
          ${a("parts_section",e)} (${this.parts.length})
          ${this._inventoryValue()!==null?o`<span class="inventory-value" title=${a("parts_inventory_value",e)}
                >${a("parts_inventory_value",e)}:
                ${Y(this._inventoryValue(),this.currencySymbol,e)}</span>`:h}
        </h3>
        ${this.canWrite&&!this._editing?o`<ha-button appearance="plain" @click=${()=>this._openAdd()}>
              <ha-icon icon="mdi:plus"></ha-icon> ${a("part_add",e)}
            </ha-button>`:h}
      </div>
      ${this._error?ge("error",this._error):h}
      ${this._editing?this._renderForm():h}
      ${this.parts.map(t=>this._renderRow(t))}
    `}};te.styles=H`
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
  `,_([j({attribute:!1})],te.prototype,"hass",2),_([j({attribute:!1})],te.prototype,"entryId",2),_([j({attribute:!1})],te.prototype,"parts",2),_([j({type:Boolean})],te.prototype,"canWrite",2),_([j({attribute:!1})],te.prototype,"currencySymbol",2),_([j({attribute:!1})],te.prototype,"partsCostMode",2),_([j({type:Boolean})],te.prototype,"fleet",2),_([f()],te.prototype,"_editing",2),_([f()],te.prototype,"_busy",2),_([f()],te.prototype,"_error",2),_([f()],te.prototype,"_restockFor",2),_([f()],te.prototype,"_restockQty",2),_([f()],te.prototype,"_restockInvalid",2),_([f()],te.prototype,"_disposeFor",2),_([f()],te.prototype,"_disposeQty",2),_([f()],te.prototype,"_disposeInvalid",2),_([f()],te.prototype,"_docsFor",2);customElements.get("maintenance-parts-section")||customElements.define("maintenance-parts-section",te);var Ai={readings:!0,parts:!0,photos:!0,documents:!0,checklist:!0,notes:!0,costs:!0,person:!0,refs:!0,qr:!1,bare:!0,docDescriptions:!0};function Fn(n){return!!(n.notes&&n.notes.trim()||n.cost!=null||n.duration!=null||n.readings.length||n.parts.length||n.photoIds.length||n.checklist)}var qn=6;function Rr(n,l,e,t,i,s,r,c={}){let d=c.options??{layout:"chronological",include:Ai},u=d.include,p=c.data??{objectRef:null,tasks:[],photos:{},fmtNumber:R=>String(R)},g=l.filter(R=>R.type==="completed"&&(u.bare!==!1||Fn(R))),{totalCost:m}=mi(g),b=R=>u.refs&&p.objectRef&&R.taskRefNo!=null&&R.refNo!=null?`${p.objectRef}.${R.taskRefNo}-${R.refNo}`:null,x=R=>u.refs&&p.objectRef&&R.taskRefNo!=null?`${p.objectRef}.${R.taskRefNo}`:null,T=[[e.refNumber,u.refs&&p.objectRef?`#${p.objectRef}`:null],[e.manufacturer,n.manufacturer],[e.model,n.model],[e.serial,n.serial_number],[e.installed,n.installation_date?t(n.installation_date):null]].filter(([,R])=>R).map(([R,B])=>`<div class="meta-row"><span>${$(R)}</span><strong>${$(B)}</strong></div>`).join(""),v=R=>{let B=[];if(u.readings&&R.readings.length){let V=R.readings.map(z=>{let Q=`${p.fmtNumber(z.value)}${z.unit?` ${$(z.unit)}`:""}`,J=z.delta!=null?` <span class="delta">(${z.delta>=0?"+":"\u2212"}${p.fmtNumber(Math.abs(z.delta))})</span>`:"";return`${z.name?`${$(z.name)}: `:""}${Q}${J}`});B.push(`<div class="fact"><span class="k">${$(e.readings)}</span>${V.join(" \xB7 ")}</div>`)}if(u.parts&&R.parts.length&&B.push(`<div class="fact"><span class="k">${$(e.parts)}</span>${R.parts.map(V=>`${$(V.name)} \xD7 ${p.fmtNumber(V.quantity)}`).join(", ")}</div>`),u.checklist&&R.checklist&&B.push(`<div class="fact"><span class="k">${$(e.checklist)}</span>${R.checklist.done}/${R.checklist.total}</div>`),u.photos&&R.photoIds.length){let V=R.photoIds.slice(0,qn),z=V.map(J=>{let ee=p.photos[J],O=ee?.name||J.slice(0,8);return ee?.url?`<figure class="photo"><img src="${$(ee.url)}" alt="" /><figcaption>${$(O)}</figcaption></figure>`:`<figure class="photo"><figcaption>${$(O)}</figcaption></figure>`}),Q=R.photoIds.length>V.length?`<span class="more">+${R.photoIds.length-V.length}</span>`:"";B.push(`<div class="fact"><span class="k">${$(e.photos)}</span><div class="photos">${z.join("")}${Q}</div></div>`)}return B.length?`<div class="details">${B.join("")}</div>`:""},k=R=>[u.notes?R.notes:null,u.person&&R.completedBy?`${e.completedBy}: ${R.completedBy}`:null].filter(Boolean).join(" \xB7 "),w=R=>u.costs?`<td class="num">${R.cost!=null?$(s(R.cost)):$(e.none)}</td>
        <td class="num">${R.duration!=null?$(i(R.duration)):$(e.none)}</td>`:"",E=R=>R?`<span class="ref">#${$(R)}</span>`:"",y=u.costs?5:3,D=R=>`<thead><tr>
    <th>${$(e.colDate)}</th>
    ${R?`<th>${$(e.colTask)}</th>`:"<th></th>"}
    ${u.costs?`<th class="num">${$(e.colCost)}</th><th class="num">${$(e.colDuration)}</th>`:""}
    <th>${$(e.colNotes)}</th>
  </tr></thead>`,re=(R,B)=>{let V=k(R),z=v(R),Q=B?$(R.phaseName?`${R.taskName} \xB7 ${R.phaseName}`:R.taskName):$(R.phaseName||"");return`<tr class="entry">
        <td class="nowrap">${$(t(R.timestamp))}${E(b(R))}</td>
        <td>${B?`${Q} ${E(x(R))}`:Q}</td>
        ${w(R)}
        <td class="notes">${$(V)||(z?"":$(e.none))}</td>
      </tr>${z?`<tr class="entry-details"><td colspan="${y}" class="details-cell">${z}</td></tr>`:""}`},C;if(d.layout==="by_task"){let R=new Map(p.tasks.map(z=>[z.id,z])),B=[...p.tasks.map(z=>z.id)];for(let z of g)B.includes(z.taskId)||B.push(z.taskId);C=`${B.map(z=>{let Q=g.filter(ce=>ce.taskId===z);if(!Q.length)return"";let J=R.get(z),ee=J?.name||Q[0].taskName,O=u.refs?J?.ref??x(Q[0]):null,Z=u.documents&&J?.documents.length?`<div class="fact"><span class="k">${$(e.documents)}</span>${J.documents.map(ce=>`${$(ce.title)}${ce.page?` (${$(e.page(ce.page))})`:""}${u.docDescriptions!==!1&&ce.description?` \u2014 <span class="doc-desc">${$(ce.description)}</span>`:""}`).join(", ")}</div>`:"",ue=u.qr&&J?.qrDataUri?`<figure class="qr"><img src="${$(J.qrDataUri)}" alt="" /><figcaption>${$(e.scanHint)}</figcaption></figure>`:"",at=Q.reduce((ce,A)=>ce+(A.cost??0),0);return`<section class="task">
  <div class="task-head">
    <div class="task-title">
      <h2>${$(ee)} ${E(O)}</h2>
      ${J?.schedule?`<div class="schedule">${$(J.schedule)}</div>`:""}
      ${Z}
      <div class="task-count">${$(e.entriesLabel(Q.length))}${u.costs&&at!==0?` \xB7 ${$(s(at))}`:""}</div>
    </div>
    ${ue}
  </div>
  <table>
    ${D(!1)}
    <tbody>
${Q.map(ce=>re(ce,!1)).join(`
`)}
    </tbody>
  </table>
</section>`}).join(`
`)}
<table class="total">
  <tfoot><tr>
    <td>${$(e.totalLabel)}</td>
    <td class="num">${u.costs?$(s(m)):""}</td>
  </tr></tfoot>
</table>`}else C=`<table>
  ${D(!0)}
  <tbody>
${g.map(R=>re(R,!0)).join(`
`)}
  </tbody>
  <tfoot><tr>
    <td colspan="2">${$(e.totalLabel)}</td>
    ${u.costs?`<td class="num">${$(s(m))}</td><td colspan="2"></td>`:"<td></td>"}
  </tr></tfoot>
</table>`;return`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${$(e.title)} \u2014 ${$(n.name)}</title>
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
<h1>${$(e.title)} \u2014 ${$(n.name)}</h1>
<p class="sub">${$(e.generated)} ${$(t(r))} \xB7 ${$(e.entriesLabel(g.length))}</p>
${T?`<div class="meta">${T}</div>`:""}
${C}
${c.capped?`<p class="cap-note">${$(e.capNote)}</p>`:""}
</body>
</html>`}var Un=60,ae=class extends L{constructor(){super(...arguments);this.entryId="";this.object=null;this.tasks=[];this.currencySymbol="\u20AC";this.userName=()=>null;this._filterTask="";this._from="";this._to="";this._expanded=!1;this._printOpen=!1;this._printLayout="chronological";this._printInclude={...Ai};this._printing=!1;this._loadedFor=null;this._histories=new Ba(this);this._localeReady=!1;this._datePickers=!1}connectedCallback(){super.connectedCallback();try{let e=JSON.parse(X(P.printOptions)||"null");(e?.layout==="by_task"||e?.layout==="chronological")&&(this._printLayout=e.layout),e?.include&&typeof e.include=="object"&&(this._printInclude={...Ai,...e.include})}catch{}}_savePrintOptions(){q(P.printOptions,JSON.stringify({layout:this._printLayout,include:this._printInclude}))}_toggleInclude(e,t){this._printInclude={...this._printInclude,[e]:t},this._savePrintOptions()}get _lang(){return F(this.hass)}willUpdate(e){super.willUpdate(e),this.entryId&&this._loadedFor!==this.entryId&&(this._loadedFor=this.entryId,this._filterTask="",this._from="",this._to=""),this.entryId&&(e.has("entryId")||e.has("tasks")||e.has("hass")&&e.get("hass")===void 0)&&this._histories.sync(this.hass,this.tasks.map(t=>({entryId:this.entryId,task:t})))}firstUpdated(){requestAnimationFrame(()=>{this._datePickers=!0})}updated(e){super.updated(e),!this._localeReady&&this.hass&&(this._localeReady=!0,me(this._lang).then(()=>this.requestUpdate()))}get _entries(){return Ca(this.tasks.map(e=>({id:e.id,name:e.name,history:this._histories.historyOf(this.entryId,e),ref_no:e.ref_no,reading_unit:e.reading_unit})))}get _capped(){return this.tasks.some(e=>this._histories.historyOf(this.entryId,e).length>=Ra)}_openTask(e){this.dispatchEvent(new CustomEvent("open-task",{detail:{taskId:e},bubbles:!0,composed:!0}))}async _bookletData(e){let t=this._printInclude,i=this._lang,s=[];if(t.documents||t.photos)try{s=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId})).documents||[]}catch{s=[]}let r=new Map;t.qr&&this._printLayout==="by_task"&&await Promise.all(this.tasks.map(async u=>{try{let p=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/qr/generate",entry_id:this.entryId,task_id:u.id,url_mode:"server",action:"view"});p.svg_data_uri&&r.set(u.id,p.svg_data_uri)}catch{}}));let c=this.tasks.map(u=>({id:u.id,name:u.name,ref:Le(this.object,u),schedule:Re(u,i)||null,documents:s.filter(p=>(p.task_ids||[]).includes(u.id)&&!$r(p)).map(p=>({title:fe(p),page:p.task_pages?.[u.id]??null,description:p.description||null})),qrDataUri:r.get(u.id)??null})),d={};if(t.photos){let u=[...new Set(e.filter(g=>g.type==="completed").flatMap(g=>g.photoIds))].slice(0,Un),p=new Map(s.map(g=>[g.id,g]));await Promise.all(u.map(async g=>{let m=p.get(g),b=m&&fe(m)||g.slice(0,8);try{d[g]={name:b,url:new URL(await ni(this.hass,g),window.location.origin).href}}catch{d[g]={name:b,url:null}}}))}return{tasks:c,photos:d}}_filteredEntries(){return Oa(this._entries,{taskId:this._filterTask||null,from:this._from||null,to:this._to||null})}async _print(){let e=this._lang,t=this.object;if(!t||this._printing)return;let i=li();this._printing=!0;let s,r;try{await this._histories.settled(),s=this._filteredEntries(),r=await this._bookletData(s)}catch(p){throw i?.close(),p}finally{this._printing=!1}this._printOpen=!1;let c={title:a("service_record_title",e),generated:a("report_generated",e),manufacturer:a("manufacturer",e),model:a("model",e),serial:a("serial_number_label",e),installed:a("installed",e),colDate:a("date",e),colTask:a("task_name",e),colCost:a("cost",e),colDuration:a("duration",e),colNotes:a("notes_label",e),completedBy:a("completed_by",e),totalLabel:a("report_total_cost",e),entriesLabel:p=>`${p} ${a("service_record_entries",e)}`,capNote:a("object_history_cap_note",e),none:"\u2014",readings:a("print_inc_readings",e),parts:a("print_inc_parts",e),photos:a("print_inc_photos",e),documents:a("print_inc_documents",e),checklist:a("print_inc_checklist",e),refNumber:a("ref_number",e),scanHint:a("report_scan_hint",e),page:p=>a("search_page",e).replace("{page}",String(p))},d=s.map(p=>({...p,completedBy:p.completedBy?p.completedVia?a("completed_via",e).replace("{person}",this.userName(p.completedBy)??"").replace("{device}",this.userName(p.completedVia)??""):this.userName(p.completedBy):null,notes:p.notes?kt(p.notes,e):null})),u=Rr(t,d,c,p=>p?U(p,e):"",p=>zt(p,e),p=>Y(p,this.currencySymbol,e),new Date().toISOString(),{capped:this._capped,options:{layout:this._printLayout,include:this._printInclude},data:{objectRef:Pe(t),tasks:r.tasks,photos:r.photos,fmtNumber:p=>W(p,e)}});Lt(u,i)}_renderPrintOptions(){let e=this._lang,t=this._printInclude,i=(r,c,d=!1)=>o`
      <label class="opt ${d?"disabled":""}">
        <input type="checkbox" .checked=${t[r]} ?disabled=${d}
          @change=${u=>this._toggleInclude(r,u.target.checked)} />
        <span>${a(c,e)}</span>
      </label>`,s=this._printLayout==="by_task";return o`
      <div class="print-options" role="dialog" aria-label=${a("print_options_title",e)}>
        <div class="po-title">${a("print_options_title",e)}</div>
        <div class="po-group">
          <span class="po-label">${a("print_layout",e)}</span>
          <label class="opt"><input type="radio" name="layout" value="chronological" .checked=${!s}
            @change=${()=>{this._printLayout="chronological",this._savePrintOptions()}} /><span>${a("print_layout_chronological",e)}</span></label>
          <label class="opt"><input type="radio" name="layout" value="by_task" .checked=${s}
            @change=${()=>{this._printLayout="by_task",this._savePrintOptions()}} /><span>${a("print_layout_by_task",e)}</span></label>
        </div>
        <div class="po-group">
          <span class="po-label">${a("print_include",e)}</span>
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
          <ha-button appearance="plain" @click=${()=>{this._printOpen=!1}}>${a("cancel",e)}</ha-button>
          <ha-button appearance="filled" class="po-print" .disabled=${this._printing} @click=${()=>this._print()}>
            ${this._printing?a("loading",e):a("print_button",e)}
          </ha-button>
        </div>
      </div>`}render(){let e=this._lang;if(!this._entries.length&&!this._histories.loading)return h;let i=this._filteredEntries(),{completed:s,totalCost:r}=mi(i),c=this._expanded?i:i.slice(0,15);return o`
      <div class="section">
        <h3>
          ${a("object_history_section",e)}
          <span class="count">${i.length}</span>
          ${this._histories.loading?o`<span class="loading-hint">${a("loading",e)}</span>`:h}
          <ha-button appearance="plain" class="print-btn" @click=${()=>{this._printOpen=!this._printOpen}}>
            <ha-icon icon="mdi:printer-outline"></ha-icon>
            ${a("service_record_print",e)}
          </ha-button>
        </h3>
        ${this._printOpen?this._renderPrintOptions():h}

        <div class="filters">
          <select .value=${this._filterTask} @change=${d=>{this._filterTask=d.target.value}}>
            <option value="">${a("object_history_all_tasks",e)}</option>
            ${this.tasks.map(d=>o`<option value=${d.id} ?selected=${d.id===this._filterTask}>${d.name}</option>`)}
          </select>
          ${this._datePickers?o`
            <ms-date-field
              kind="date"
              clearable
              .hass=${this.hass}
              .lang=${e}
              .label=${a("date_from",e)}
              .value=${this._from}
              @value-changed=${d=>{this._from=d.detail.value}}
            ></ms-date-field>
            <ms-date-field
              kind="date"
              clearable
              .hass=${this.hass}
              .lang=${e}
              .label=${a("date_to",e)}
              .value=${this._to}
              @value-changed=${d=>{this._to=d.detail.value}}
            ></ms-date-field>`:o`<span class="date-slot"></span><span class="date-slot"></span>`}
        </div>

        ${i.length===0?o`<p class="empty">${a("object_history_empty",e)}</p>`:o`
              <div class="rows">
                ${c.map(d=>o`
                  <div class="row">
                    <span class="date" title=${ye(d.timestamp,e)}>${U(d.timestamp,e)}</span>
                    <span class="type type-${d.type}" style="--type-color: ${Js(d.type)}">${a(d.type,e)}</span>
                    <button class="task-link" @click=${()=>this._openTask(d.taskId)}>${d.taskName}${d.phaseName?` \xB7 ${d.phaseName}`:""}</button>
                    <span class="facts">
                      ${d.cost!=null?o`<span>${aa(d.cost,this.currencySymbol,e)}</span>`:h}
                      ${d.partsCost!=null?o`<span class="parts-cost" title=${a(d.partsCounted?"history_parts_counted_hint":"history_parts_info_hint",e)}>${a(d.partsCounted?"history_parts_counted":"history_parts_info",e).replace("{amount}",Y(d.partsCost,this.currencySymbol,e))}</span>`:h}
                      ${d.purchaseCost!=null?o`<span class="parts-cost">${a("history_purchase_stock",e).replace("{amount}",Y(d.purchaseCost,this.currencySymbol,e))}</span>`:h}
                      ${d.duration!=null?o`<span>${zt(d.duration,e)}</span>`:h}
                    </span>
                    ${d.notes?o`<span class="notes" title=${kt(d.notes,e)}>${kt(d.notes,e)}</span>`:h}
                  </div>
                `)}
              </div>
              ${i.length>c.length?o`<ha-button appearance="plain" class="more" @click=${()=>{this._expanded=!0}}>
                    ${a("show_all",e)} (${i.length})
                  </ha-button>`:h}
              <div class="totals">
                ${s} ${a("service_record_entries",e)} · ${a("report_total_cost",e)}:
                <strong>${Y(r,this.currencySymbol,e)}</strong>
              </div>
              ${this._capped?o`<p class="cap-note">${a("object_history_cap_note",e)}</p>`:h}
            `}
      </div>
    `}};ae.styles=H`
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
    .filters ms-date-field, .filters .date-slot {
      flex: 1 1 140px;
      min-width: 0;
      max-width: 100%;
    }
    /* A From/To field's height (label and HA's date picker, HA 2026.10).
       HA loads the picker a few frames after the field: without the floor
       the row grew by 28 px under the reader's eyes (56 on a phone). */
    .filters ms-date-field, .filters .date-slot { min-height: 82px; }
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
  `,_([j({attribute:!1})],ae.prototype,"hass",2),_([j()],ae.prototype,"entryId",2),_([j({attribute:!1})],ae.prototype,"object",2),_([j({attribute:!1})],ae.prototype,"tasks",2),_([j()],ae.prototype,"currencySymbol",2),_([j({attribute:!1})],ae.prototype,"userName",2),_([f()],ae.prototype,"_filterTask",2),_([f()],ae.prototype,"_from",2),_([f()],ae.prototype,"_to",2),_([f()],ae.prototype,"_expanded",2),_([f()],ae.prototype,"_printOpen",2),_([f()],ae.prototype,"_printLayout",2),_([f()],ae.prototype,"_printInclude",2),_([f()],ae.prototype,"_printing",2),_([f()],ae.prototype,"_datePickers",2);customElements.get("maintenance-object-history-section")||customElements.define("maintenance-object-history-section",ae);var Vn={name:"name",notes:"notes_label",recurrence:"task_section_schedule",warning_days:"warning_days"},Di=n=>`${n.task_id}|${n.field}`,Pi=n=>`new|${n.key}`;function Cr(n,l){let e=Re({schedule:n??null},l),t=n?.season_months||[];return t.length?`${e} \xB7 ${[...t].sort((i,s)=>i-s).map(i=>oa(i-1,l,"short")).join(", ")}`:e}var Me=class extends L{constructor(){super(...arguments);this.entryId="";this._updates=null;this._open=!1;this._busy=!1;this._error="";this._picked=new Set}get _lang(){return F(this.hass)}updated(e){e.has("entryId")&&this._load()}async _load(){let e=this.entryId;if(this._updates=null,!(!e||!this.hass))try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/template_updates",entry_id:e,language:this.hass.language});this.entryId===e&&(this._updates=t)}catch{}}get _count(){return this._updates?this._updates.changes.length+this._updates.new_tasks.length:0}_openDialog(){let e=this._updates;e&&(this._picked=new Set([...e.changes.filter(t=>!t.conflict).map(Di),...e.new_tasks.map(Pi)]),this._error="",this._open=!0)}_toggle(e,t){let i=new Set(this._picked);t?i.add(e):i.delete(e),this._picked=i}async _apply(){let e=this._updates;!e||await I(this,{type:"maintenance_supporter/template_updates/apply",entry_id:this.entryId,changes:e.changes.map(i=>({task_id:i.task_id,field:i.field,accept:this._picked.has(Di(i))})),new_tasks:e.new_tasks.map(i=>({key:i.key,accept:this._picked.has(Pi(i))}))},{busy:i=>{this._busy=i},fallbackKey:"save_error",onError:i=>{this._error=i}})===void 0||(this._open=!1,qt(this,a("template_updates_done",this._lang)),this.dispatchEvent(new CustomEvent("template-updates-applied",{bubbles:!0,composed:!0})),await this._load())}_value(e,t){let i=this._lang;return e==="recurrence"?Cr(t,i):e==="warning_days"?je(Number(t),"day",i):typeof t=="string"&&t?t:e==="notes"?a("template_updates_no_notes",i):"\u2014"}_renderChange(e){let t=this._lang;return Oe({cls:`tpl-change${e.conflict?" conflict":""}`,checked:this._picked.has(Di(e)),onChange:i=>this._toggle(Di(e),i.target.checked)},o`<span class="tpl-change-text">
      <span class="tpl-field">${a(Vn[e.field],t)}</span>
      <span class="tpl-values ${e.field}">
        <span class="tpl-before">${this._value(e.field,e.before)}</span>
        <span class="tpl-arrow" aria-hidden="true">→</span>
        <span class="tpl-after">${this._value(e.field,e.after)}</span>
      </span>
      ${e.conflict?o`<span class="tpl-conflict">${a("template_updates_conflict",t)}</span>`:h}
    </span>`)}_renderDialog(){let e=this._updates;if(!this._open||!e)return h;let t=this._lang,i=new Map;for(let r of e.changes)i.set(r.task_id,[...i.get(r.task_id)||[],r]);let s=a("template_updates_title",t);return o`
      <ha-dialog open .headerTitle=${gt(s)} @closed=${()=>{this._open=!1}}>
        ${ft(s)}
        <div class="content">
          <p class="hint">${a("template_updates_hint",t)}</p>
          ${this._error?ge("error",this._error):h}
          ${[...i.values()].map(r=>o`
            <div class="tpl-task">
              <div class="tpl-task-name">${r[0].task_name}</div>
              ${r.map(c=>this._renderChange(c))}
            </div>`)}
          ${e.new_tasks.length?o`
            <div class="tpl-task tpl-new">
              <div class="tpl-task-name">${a("template_updates_new_tasks",t)}</div>
              ${e.new_tasks.map(r=>Oe({cls:"tpl-change tpl-new-task",checked:this._picked.has(Pi(r)),onChange:c=>this._toggle(Pi(r),c.target.checked)},o`<span class="tpl-change-text">
                <span class="tpl-new-name">${r.name}</span>
                <span class="tpl-values">${Cr(r.schedule,t)}</span>
              </span>`))}
            </div>`:h}
        </div>
        <div class="dialog-actions">
          <div class="spacer"></div>
          <ha-button appearance="plain" @click=${()=>{this._open=!1}}>${a("template_updates_later",t)}</ha-button>
          <ha-button class="tpl-apply" @click=${()=>{this._apply()}} .disabled=${this._busy}>
            ${this._busy?a("saving",t):a("apply_suggestion",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}render(){let e=this._updates,t=this._count;if(!e||!t)return h;let i=this._lang,s=ne("template_updates_banner","template_updates_banner_one",t,i).replace("{template}",e.template_name||"");return o`
      <div class="tpl-banner" role="status">
        <ha-icon icon="mdi:file-replace-outline"></ha-icon>
        <span class="tpl-banner-text">${s}</span>
        <ha-button appearance="plain" class="tpl-review" @click=${()=>this._openDialog()}>${a("template_updates_review",i)}</ha-button>
      </div>
      ${this._renderDialog()}
    `}};Me.styles=H`
    :host { display: block; }
    .tpl-banner {
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
      margin: 8px 0 12px; padding: 8px 12px;
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--secondary-background-color);
      color: var(--primary-text-color); font-size: 14px;
    }
    .tpl-banner ha-icon { color: var(--primary-color); --mdc-icon-size: 20px; flex: none; }
    .tpl-banner-text { flex: 1 1 200px; min-width: 0; overflow-wrap: anywhere; }
    .dialog-title { font-size: 18px; font-weight: 500; padding-bottom: 12px; }
    .content { min-width: min(320px, 100%); max-width: 560px; }
    .hint { color: var(--secondary-text-color); font-size: 13px; margin: 0 0 12px; }
    .tpl-task { margin: 0 0 14px; }
    .tpl-task-name { font-weight: 500; margin-bottom: 4px; overflow-wrap: anywhere; }
    .tpl-change { display: flex; align-items: flex-start; gap: 8px; padding: 4px 0; }
    .tpl-change-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .tpl-field { font-size: 12px; color: var(--secondary-text-color); }
    .tpl-values { font-size: 14px; overflow-wrap: anywhere; }
    .tpl-values.notes { white-space: pre-wrap; max-height: 9em; overflow: auto; }
    .tpl-before { color: var(--secondary-text-color); text-decoration: line-through; }
    .tpl-arrow { margin: 0 4px; color: var(--secondary-text-color); }
    .tpl-conflict { font-size: 12px; color: var(--warning-color, #ff9800); }
    .dialog-actions { display: flex; align-items: center; gap: 8px; padding-top: 16px; }
    .spacer { flex: 1; }
  `,_([j({attribute:!1})],Me.prototype,"hass",2),_([j({attribute:!1})],Me.prototype,"entryId",2),_([f()],Me.prototype,"_updates",2),_([f()],Me.prototype,"_open",2),_([f()],Me.prototype,"_busy",2),_([f()],Me.prototype,"_error",2),_([f()],Me.prototype,"_picked",2);customElements.get("maintenance-template-updates")||customElements.define("maintenance-template-updates",Me);var le=class le extends L{constructor(){super(...arguments);this.flat=!1;this._ov=null;this._loading=!1;this._marking=!1;this._choosing=null;this._error="";this._disposeFor=null;this._disposeQty="1";this._history=null;this._rosterSort=le._storedSort();this._typeFilter=null;this._recorded=[];this._access=Na;this._historyRequested=!1;this._localeReady=!1;this._markAll=async()=>{await this._mark(void 0)};this._repair=async()=>{await this._act({type:"maintenance_supporter/battery_fleet/setup",language:this._lang})};this._loadHistory=async e=>{if(q(P.batteryRosterOpen,e?"1":"0"),!(!e||this._historyRequested)){this._historyRequested=!0;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview_history"});this._history=t.series}catch{this._history=null}}}}get _lang(){return F(this.hass)}get _canWrite(){return $t(this.hass?.user,this._access)}connectedCallback(){super.connectedCallback(),this.hass&&this._load()}updated(e){ut(this,e),e.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,me(this._lang).then(()=>this.requestUpdate()),vi(this.hass).then(t=>{this._access=t.access}),this._ov===null&&!this._loading&&this._load())}async _load(){this._error="";let e=await I(this,{type:"maintenance_supporter/battery_fleet/overview"},{busy:t=>{this._loading=t},onError:t=>{this._error=t}});e!==void 0&&(this._ov=e)}async _act(e,t){return this._marking?!1:(this._error="",await I(this,e,{busy:s=>{this._marking=s},reload:async()=>{t?.(),await this._load()},onError:s=>{this._error=s}})!==void 0)}async _dispose(e,t){let i=parseFloat(this._disposeQty);!Number.isFinite(i)||i<=0||await this._act({type:"maintenance_supporter/part/dispose",entry_id:e,part_id:t,quantity:i})&&(this._disposeFor=null)}_renderDispose(e,t,i){return this._disposeFor!==t.part_id?o`<button class="bf-charged bf-dispose" title=${a("part_dispose_hint",i)} .disabled=${this._marking}
        @click=${()=>{this._disposeFor=t.part_id,this._disposeQty="1"}}><ha-icon icon="mdi:trash-can-outline"></ha-icon>${a("part_dispose",i)}</button>`:o`<input
        class="bf-dispose-qty"
        type="number"
        min="1"
        max=${String(t.restoring)}
        .value=${this._disposeQty}
        aria-label=${a("part_dispose_how_many",i)}
        title=${a("part_dispose_how_many",i)}
        @input=${s=>this._disposeQty=s.target.value}
        @keydown=${s=>{s.key==="Enter"&&this._dispose(e,t.part_id),s.key==="Escape"&&(this._disposeFor=null)}}
      /><button class="bf-charged bf-dispose confirm" title=${a("part_dispose_hint",i)} .disabled=${this._marking}
        @click=${()=>this._dispose(e,t.part_id)}><ha-icon icon="mdi:check"></ha-icon>${a("part_dispose",i)}</button
      ><button class="bf-charged bf-dispose" title=${a("cancel",i)} @click=${()=>this._disposeFor=null}
        ><ha-icon icon="mdi:close"></ha-icon
      ></button>`}_markOne(e,t){if(e.cell_choices&&e.cell_choices.length>1){this._choosing={entityId:e.entity_id,list:t,selected:e.cells_installed||e.cell_choices[0].type};return}this._mark([e.entity_id])}async _confirmCells(){let e=this._choosing;e&&(this._choosing=null,await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",entity_ids:[e.entityId],cells:{[e.entityId]:e.selected}}))}_renderCellChooser(e,t,i){let s=this._choosing;return!s||s.entityId!==e.entity_id||s.list!==t||!e.cell_choices?h:o`
      <div class="bf-cells" role="group" aria-label=${a("battery_fleet_cells_question",i)}>
        <div class="bf-cells-q">${a("battery_fleet_cells_question",i)}</div>
        ${e.cell_choices.map(r=>o`
          <label class="bf-cell-choice">
            <input type="radio" name=${`cells-${e.entity_id}`} .checked=${s.selected===r.type}
              @change=${()=>{this._choosing={...s,selected:r.type}}} />
            <span>${r.name}</span>
            ${r.rechargeable?o`<span class="bf-cell-tag">${a("battery_fleet_cells_rechargeable",i)}</span>`:h}
          </label>`)}
        <div class="bf-cells-actions">
          <button class="bf-cells-cancel" @click=${()=>{this._choosing=null}}>${a("cancel",i)}</button>
          <button class="bf-cells-ok" .disabled=${this._marking} @click=${()=>this._confirmCells()}>
            ${a("battery_fleet_mark_one",i)}
          </button>
        </div>
      </div>
    `}async _mark(e){await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",...e?{entity_ids:e}:{}})}async _setExcluded(e,t){await this._act({type:"maintenance_supporter/battery_fleet/set_excluded",entity_id:e,excluded:t})}async _addBattery(e){let t=e.detail?.value;t&&await this._act({type:"maintenance_supporter/battery_fleet/set_included",entity_id:t,included:!0})}async _setTrackSelf(e){await this._setFleetOption("set_track_self_charging",e.target)}async _setDueWithoutSensor(e){await this._setFleetOption("set_due_without_sensor",e.target)}async _setAskCells(e){await this._setFleetOption("set_ask_cells",e.target)}async _setFleetOption(e,t){let i=t.checked;await this._act({type:`maintenance_supporter/battery_fleet/${e}`,enabled:i})||(t.checked=!i)}_rosterOpen(){return X(P.batteryRosterOpen)!=="0"}_predictedTitle(e,t){if(e.forecast_overdue)return a("battery_fleet_forecast_overdue",t);let i=this._predictedDate(this._forecastDays(e)??0);if(e.predicted_source==="trend")return a("battery_fleet_predicted_trend",t).replace("{date}",i).replace("{confidence}",a("cal_confidence_"+(e.prediction_confidence||"medium"),t));if(e.lifetime_months!=null&&e.lifetime_source){let s=a("lifetime_source_"+e.lifetime_source,t).replace("{n}",String(e.lifetime_samples??0));return a("battery_fleet_predicted_typical",t).replace("{date}",i).replace("{months}",String(e.lifetime_months)).replace("{type}",e.battery_type).replace("{source}",s)}return a("battery_fleet_predicted_on",t).replace("{date}",i)}_sparkline(e){let t=this._history?.[e.entity_id];if(!t||t.points.length<2)return h;let i=110,s=24,r=2,c=t.points[0][0],d=t.points[t.points.length-1][0],u=Date.now()/1e3,p=e.status!=="low"&&e.predicted_source==="trend"&&e.days_until!=null?u+e.days_until*86400:null,g=Math.max(d,p??d),m=k=>g===c?r:r+(k-c)/(g-c)*(i-2*r),b=k=>r+(1-Math.min(100,Math.max(0,k))/100)*(s-2*r),x=t.points.map(([k,w])=>`${M(m(k))},${M(b(w))}`).join(" "),T=t.points[t.points.length-1][1],v=M(b(t.threshold));return o`<svg
      class="bf-spark"
      viewBox="0 0 ${i} ${s}"
      role="img"
      aria-label=${a("battery_fleet_sparkline_hint",this._lang)}
    >
      <title>${a("battery_fleet_sparkline_hint",this._lang)}</title>
      <line class="bf-spark-th" x1="0" y1=${v} x2=${i} y2=${v}></line>
      <polyline class="bf-spark-line" points=${x}></polyline>
      ${p!==null?o`<line
            class="bf-spark-proj"
            x1=${M(m(d))}
            y1=${M(b(T))}
            x2=${M(m(p))}
            y2=${v}
          ></line>`:h}
    </svg>`}static _storedSort(){return X(P.batteryRosterSort)==="name"?"name":"urgency"}_setSort(e){this._rosterSort=e,q(P.batteryRosterSort,e)}_sortedRoster(e){let t=this._typeFilter===null?e:e.filter(s=>s.battery_type===this._typeFilter);if(this._rosterSort==="name")return t;let i=s=>s.status==="low"?-1e3+(s.level??101)/101:s.days_until??1/0;return[...t].sort((s,r)=>i(s)-i(r)||s.device_name.localeCompare(r.device_name))}_predictedDate(e){return U(Ne(_e(),e),this._lang)}_forecastDays(e){return e.forecast_days!==void 0?e.forecast_days:e.days_until}_fmtDate(e){return Number.isFinite(e)?U(new Date(e).toISOString(),this._lang):"\u2014"}_shoppingLine(e){return Object.entries(e).map(([t,i])=>o`<button
        class="bf-type-chip ${this._typeFilter===t?"bf-type-chip-active":""}"
        title=${a("battery_fleet_filter_type",this._lang)}
        @click=${()=>this._toggleTypeFilter(t)}
      >
        ${i}× ${t}
      </button>`)}_toggleTypeFilter(e){if(this._typeFilter=this._typeFilter===e?null:e,this._typeFilter!==null){let t=this.shadowRoot?.querySelector(".bf-roster");t instanceof HTMLDetailsElement?t.open||(t.open=!0):t&&!t.expanded&&(t.expanded=!0,this._loadHistory(!0))}}async _recordJump(e,t){await this._act({type:"maintenance_supporter/battery_fleet/record_replacement",entity_id:e,replaced_at:new Date(t.at*1e3).toISOString()},()=>{this._recorded=[...this._recorded,e]})}_levelTone(e,t){let i=t.low_threshold??20;return e<=i?"bad":e<=i+20?"warn":"good"}_levelBar(e){let t=e.level;return t==null?h:o`<span class="bf-bar" aria-hidden="true"
      ><span class="bf-bar-fill bf-bar-${this._levelTone(t,e)}" style="width: ${Math.min(100,Math.max(0,t))}%"></span
    ></span>`}_jumpButton(e,t){let i=this._history?.[e.entity_id]?.jump;return!i||this._recorded.includes(e.entity_id)?h:o`<button
      class="bf-mark bf-jump"
      title=${a("battery_fleet_record_replacement",t).replace("{date}",this._fmtDate(i.at*1e3))}
      .disabled=${this._marking}
      @click=${()=>this._recordJump(e.entity_id,i)}
    >
      <ha-icon icon="mdi:calendar-sync"></ha-icon>
    </button>`}_renderRow(e,t,i){let s=e.available===!1?o`<span class="bf-offline">${a("battery_fleet_offline",t)}</span>`:e.no_sensor?o`<span class="bf-offline bf-nosensor">${a("battery_fleet_no_sensor",t)}</span>`:h,r=`${e.quantity}\xD7 ${e.battery_type}`,c=o`<span class="bf-type" title=${r}>${r}</span>`,d=this._canWrite,u=d&&(i.mark==="always"||e.no_sensor||e.can_mark_replaced),p=this._forecastDays(e);return o`
      <div class="bf-row">
        <span class="bf-dev">${e.device_name}</span>
        ${i.status?o`<span class="bf-status bf-${e.status}"
                >${e.no_sensor&&e.status==="low"?a("battery_fleet_status_due",t):a("battery_fleet_status_"+e.status,t)}</span
              >${c}${s}`:o`${s}${c}`}
        ${i.recharge&&e.rechargeable?o`<span class="bf-recharge" title=${a("battery_fleet_rechargeable",t)}
              ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
            ></span>`:h}
        ${i.sparkline?this._sparkline(e):h}
        ${this._levelBar(e)}
        ${e.level!=null?o`<span class="bf-level bf-level-${this._levelTone(e.level,e)}">${e.level}%</span>`:h}
        ${u?o`<button
              class="bf-mark${i.mark==="replaced"?" bf-replaced":""}"
              title=${e.rechargeable?a("battery_fleet_mark_recharged",t):a("battery_fleet_mark_one",t)}
              .disabled=${this._marking}
              @click=${()=>this._markOne(e,i.list)}
            >
              <ha-icon icon="mdi:battery-sync"></ha-icon>
            </button>`:h}
        ${i.jump&&d?this._jumpButton(e,t):h}
        ${i.predicted&&p!=null?o`<span
              class="bf-predicted ${e.predicted_source==="trend"?"bf-trend":""} ${e.forecast_overdue?"bf-overdue":""} ${e.forecast_overdue&&e.status==="ok"?"bf-quiet":""}"
              title=${this._predictedTitle(e,t)}
              >${e.forecast_overdue?o`<ha-icon icon="mdi:calendar-alert"></ha-icon>`:h}~${this._predictedDate(p)}</span
            >`:h}
        ${i.exclude&&d?o`<button
              class="bf-mark bf-exclude"
              title=${a("battery_fleet_exclude",t)}
              .disabled=${this._marking}
              @click=${()=>this._setExcluded(e.entity_id,!0)}
            >
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>
            </button>`:h}
      </div>
      ${this._renderCellChooser(e,i.list,t)}
    `}render(){let e=this._lang;if(this._loading&&this._ov===null)return o`<div class="bf-card"><div class="bf-loading">…</div></div>`;let t=this._ov;if(!t)return this._error?o`<div class="bf-card"><div class="bf-error">${this._error}</div></div>`:h;let i=t.low.length;return o`
      <div class="bf-card">
        <div class="bf-head">
          <ha-icon icon="mdi:battery-alert"></ha-icon>
          <span class="bf-title">${a("battery_fleet_title",e)}</span>
          <span class="bf-count ${i?"bad":"ok"}">${i}</span>
        </div>
        ${this._error?o`<div class="bf-error">${this._error}</div>`:h}

        ${t.configured&&t.task_ok===!1?o`
              <div class="bf-repair">
                <span>${a("battery_fleet_trigger_lost",e)}</span>
                ${this._canWrite?o`<ha-button .disabled=${this._marking} @click=${this._repair}>
                      ${a("battery_fleet_repair",e)}
                    </ha-button>`:h}
              </div>
            `:h}

        ${i===0?o`<div class="bf-empty">${a("battery_fleet_none_low",e)}</div>`:o`
              <div class="bf-shopping">
                <span class="bf-label">${a("battery_fleet_buy_now",e)}</span>
                <span class="bf-list">${this._shoppingLine(t.needs_now)}</span>
              </div>
              <div class="bf-rows">
                ${t.low.map(s=>this._renderRow(s,e,{list:"low",recharge:!0,mark:"always",exclude:!0}))}
              </div>
              ${this._canWrite?o`<div class="bf-actions">
                    <ha-button .disabled=${this._marking} @click=${this._markAll}>
                      <ha-icon icon="mdi:battery-sync"></ha-icon> ${a("battery_fleet_mark_all",e)}
                    </ha-button>
                  </div>`:h}
            `}

        ${t.charging?.length?o`
              <div class="bf-charging">
                <span class="bf-label">${a("battery_fleet_charging",e)}</span>
                ${t.charging.map(s=>o`<span class="bf-charge-item">
                    <span class="bf-charge-name">${s.name}</span>
                    <span>${a("battery_fleet_ready",e).replace("{count}",W(s.stock,e))}</span>
                    ${s.restoring>0?o`<span class="bf-charge-waiting">${Mi(s.reuse,s.restoring,e)}</span>
                          ${this._canWrite?o`<button
                                class="bf-charged"
                                title=${a("part_ready_again_hint",e)}
                                .disabled=${this._marking}
                                @click=${()=>this._act({type:"maintenance_supporter/part/ready_again",entry_id:t.entry_id,part_id:s.part_id})}
                              ><ha-icon icon="mdi:battery-charging-100"></ha-icon>${a(`part_reuse_${s.reuse}`,e)}</button>
                              ${this._renderDispose(t.entry_id,s,e)}`:h}`:h}
                  </span>`)}
              </div>
            `:h}
        ${t.soon.length?o`
              <div class="bf-soon">
                <span class="bf-label">${a("battery_fleet_soon",e)}</span>
                <span class="bf-list">${this._shoppingLine(t.needs_soon)}</span>
                <div class="bf-soon-hint">${a("battery_fleet_soon_hint",e)}</div>
              </div>
              <div class="bf-rows bf-soon-rows">
                ${t.soon.map(s=>this._renderRow(s,e,{list:"soon",mark:"replaced",predicted:!0}))}
              </div>
            `:h}
        ${t.all?.length?o`
              ${gi({cls:"bf-roster",open:this._rosterOpen(),onToggle:this._loadHistory,header:o`${a("battery_fleet_all",e)} (${t.all.length})`},o`
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
                  ${this._sortedRoster(t.all).map(s=>this._renderRow(s,e,{list:"roster",status:!0,recharge:!0,sparkline:!0,mark:"replaced",jump:!0,predicted:!0,exclude:!0}))}
                </div>
                <div class="bf-roster-hint">${a("battery_fleet_all_hint",e)}</div>
                ${this._canWrite?this._renderRosterSettings(t,e):h}
              `)}
            `:h}
        ${this._renderExcluded(t,e)}
        <div class="bf-total">${a("battery_fleet_total",e).replace("{n}",String(t.total))}</div>
      </div>
    `}_renderRosterSettings(e,t){return o`
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
                ${Oe({cls:"bf-track-self",checked:!!e.track_self_charging,disabled:this._marking,onChange:this._setTrackSelf},o`${a("battery_fleet_track_self",t)}`)}
                <div class="bf-roster-hint">${a("battery_fleet_track_self_hint",t)}</div>
                ${Oe({cls:"bf-track-self bf-due-nosensor",checked:e.due_without_sensor!==!1,disabled:this._marking,onChange:this._setDueWithoutSensor},o`${a("battery_fleet_due_without_sensor",t)}`)}
                <div class="bf-roster-hint">${a("battery_fleet_due_without_sensor_hint",t)}</div>
                ${Oe({cls:"bf-track-self bf-ask-cells",checked:!!e.ask_cells,disabled:this._marking,onChange:this._setAskCells},o`${a("battery_fleet_ask_cells",t)}`)}
                <div class="bf-roster-hint">${a("battery_fleet_ask_cells_hint",t)}</div>
    `}_renderExcluded(e,t){return o`
        ${e.excluded?.length?o`
              <div class="bf-excluded">
                <span class="bf-label">${a("battery_fleet_excluded",t)}</span>
                ${e.excluded.map(i=>o`
                    <span class="bf-excluded-chip">
                      ${i.device_name}
                      ${this._canWrite?o`<button
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
    `}};le.styles=H`
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
  `,_([j({attribute:!1})],le.prototype,"hass",2),_([j({type:Boolean})],le.prototype,"flat",2),_([f()],le.prototype,"_ov",2),_([f()],le.prototype,"_loading",2),_([f()],le.prototype,"_marking",2),_([f()],le.prototype,"_choosing",2),_([f()],le.prototype,"_error",2),_([f()],le.prototype,"_disposeFor",2),_([f()],le.prototype,"_disposeQty",2),_([f()],le.prototype,"_history",2),_([f()],le.prototype,"_rosterSort",2),_([f()],le.prototype,"_typeFilter",2),_([f()],le.prototype,"_recorded",2),_([f()],le.prototype,"_access",2);var ws=le;customElements.get("maintenance-battery-fleet-section")||customElements.define("maintenance-battery-fleet-section",ws);var Or=5;function Wn(n,l){let e=[];for(let t=0;t<l;t++)e.push(Ne(n,t));return e}function Gn(n){if(!n||n.length===0)return null;let l=n.map(e=>qe(e)).filter(e=>e!==null&&e>=0);return l.length===0?null:l.reduce((e,t)=>e+t,0)/l.length}function Kn(n){let{windowStart:l,windowEnd:e,task:t,entryId:i,objectName:s}=n,r=[],c=(g,m)=>({date:g,entry_id:i,task_id:t.id,task_name:t.name,object_name:s,status:m&&Dt(t.status)?"ok":t.status,days_until_due:m?null:t.days_until_due??null,projected:m,schedule_type:t.schedule_type,interval_days:t.interval_days??null,interval_unit:t.interval_unit??null,responsible_user_id:t.responsible_user_id??null,avg_cost:Gn(t.history),adaptive_enabled:!!t.adaptive_config?.enabled,prediction_confidence:t.threshold_prediction_confidence??null}),d=Math.max(1,Math.round(fs(t.interval_days,t.interval_unit)));if(Dt(t.status)){if(r.push(c(l,!1)),t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0){let g=Ne(l,d),m=1;for(;g<=e&&m<Or;)r.push(c(g,!0)),m++,g=Ne(g,d)}return r}let u=t.next_due;if(typeof u!="string"||!u)return r;let p=u.slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(p))return r;if(p>=l&&p<=e)r.push(c(p,!1));else if(p>e)return r;if(t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0){let g=Ne(p,d),m=r.length;for(;g<=e&&m<Or;)g>=l&&(r.push(c(g,!0)),m++),g=Ne(g,d)}return r}function Mr(n,l,e,t=null){let i=Wn(l,e),s=i[0],r=i[i.length-1],c=[];for(let u of n){let p=u.object?.name||"",g=u.entry_id,m=u.tasks||[];for(let b of m){if(t&&!Gt(b,t)||b.enabled===!1)continue;let x=Kn({windowStart:s,windowEnd:r,task:b,entryId:g,objectName:p});c.push(...x)}}let d=new Map;for(let u of i)d.set(u,[]);for(let u of c){let p=d.get(u.date);p&&p.push(u)}for(let[,u]of d)u.sort((p,g)=>{let m=Ze(p.status),b=Ze(g.status);if(m!==b)return m-b;if(p.projected!==g.projected)return p.projected?1:-1;let x=p.object_name.localeCompare(g.object_name);return x!==0?x:p.task_name.localeCompare(g.task_name)});return i.map(u=>({date:u,events:d.get(u)??[]}))}var Yn={completed:"ok",reset:"ok",skipped:"due_soon",missed:"overdue",triggered:"triggered",trigger_replaced:"triggered",trigger_removed:"ok",updated:"ok"};function Ii(n,l){return`${n}/${l}`}function Ar(n,l,e){let t=Dr(l,e)[0],i=[];for(let s of n)for(let r of s.tasks||[]){let c=r.history||[],d=r.history_count??c.length;if(d<=c.length)continue;let u=c.map(m=>Zi(m?.timestamp)).filter(m=>!!m),p=u.length?u.reduce((m,b)=>m<b?m:b):"";if(p&&p<t)continue;let g=Ii(s.entry_id,r.id);i.push({entryId:s.entry_id,taskId:r.id,key:g,sig:`${g}:${d}:${Qn(JSON.stringify(c))}`})}return i}function Qn(n){let l=2166136261;for(let e=0;e<n.length;e++)l^=n.charCodeAt(e),l=Math.imul(l,16777619);return(l>>>0).toString(36)}function Dr(n,l){let e=[];for(let t=l-1;t>=0;t--)e.push(Ne(n,-t));return e}function Pr(n,l,e,t=null,i={}){let s=Dr(l,e),r=s[0],c=s[s.length-1],d=new Map;for(let p of s)d.set(p,[]);for(let p of n){let g=p.object?.name||"",m=p.entry_id,b=p.tasks||[];for(let x of b){if(t&&!Gt(x,t))continue;let T=i[Ii(m,x.id)]??(x.history||[]);for(let v of T){if(typeof v?.timestamp!="string")continue;let k=Zi(v.timestamp);if(!k||k<r||k>c)continue;let w=d.get(k);if(!w)continue;let E=v.type??"completed";w.push({date:k,entry_id:m,task_id:x.id,task_name:x.name,object_name:g,status:Yn[E]??"ok",days_until_due:null,projected:!1,schedule_type:x.schedule_type,interval_days:x.interval_days??null,responsible_user_id:x.responsible_user_id??null,avg_cost:qe(v),adaptive_enabled:!!x.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:v.timestamp,history_type:E,history_cost:qe(v),history_notes:typeof v.notes=="string"?v.notes:null,history_duration:typeof v.duration=="number"?v.duration:null})}}}let u={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4,updated:5};for(let[,p]of d)p.sort((g,m)=>{let b=u[g.history_type??""]??99,x=u[m.history_type??""]??99;if(b!==x)return b-x;let T=g.object_name.localeCompare(m.object_name);return T!==0?T:g.task_name.localeCompare(m.task_name)});return s.map(p=>({date:p,events:d.get(p)??[]}))}var Ir=H`
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
`;function zr(n){let l=window;l.customCards=l.customCards||[],l.customCards.some(e=>e.type===n.type)||l.customCards.push(n)}function Hr(n,l,e=t=>import(t)){let t=window,i;try{let p=new URL(l);i=p.origin+p.pathname}catch{return}let s=`__msCardHeal:${n[0]}:${i}`;if(t[s])return;t[s]=!0;let r=0,c=0,d=!1,u=()=>{if(r+=1,n.some(g=>!customElements.get(g))&&c<3&&!d){c+=1,d=!0;try{let g=new URL(l);g.searchParams.set("heal",`${Date.now()}`),e(g.href).catch(()=>{}).finally(()=>{d=!1})}catch{return}}r<20&&window.setTimeout(u,r<8?500:2e3)};window.setTimeout(u,250)}var ke=class extends L{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._objectFilter="";this._configuredObjects=[];this._unsub=null;this._pastHistory={};this._pastHistorySig="";this._pastSeq=0;this._dataLoaded=!1;this._lastConnection=null;this._onHistorySaved=e=>{let t=e.detail;!t?.entry_id||!t.task_id||!(Ii(t.entry_id,t.task_id)in this._pastHistory)||(this._pastHistorySig="",this._loadPastHistories())};this._subGen=0}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(e){if(this._config={...e},this._windowDays=e.window_days&&[7,14,30,365].includes(e.window_days)?e.window_days:30,this._pastDays=e.past_days&&[30,90].includes(e.past_days)?e.past_days:0,this._userFilter=typeof e.user_filter=="string"?e.user_filter:"",typeof e.object_filter=="string")this._objectFilter=e.object_filter,this._configuredObjects=[];else if(Array.isArray(e.object_filter)){let t=e.object_filter.filter(i=>typeof i=="string"&&i!=="");this._objectFilter=t.length===1?t[0]:"",this._configuredObjects=t.length>1?t:[]}else this._objectFilter="",this._configuredObjects=[]}getCardSize(){return 6}get _lang(){return F(this.hass)}connectedCallback(){super.connectedCallback(),window.addEventListener("history-entry-saved",this._onHistorySaved)}disconnectedCallback(){if(super.disconnectedCallback(),this._subGen++,window.removeEventListener("history-entry-saved",this._onHistorySaved),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._dataLoaded=!1,this._lastConnection=null}updated(e){if(super.updated(e),ut(this,e),this.hass&&this._pastDays>0&&(e.has("_objects")||e.has("_pastDays"))&&this._loadPastHistories(),e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[e,t]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=e.objects,this._stats=t,It(this._stats.budget)}catch{}}async _loadPastHistories(){let e=Ar(this._objects,_e(),this._pastDays||30),t=e.map(r=>r.sig).join("|");if(t===this._pastHistorySig)return;this._pastHistorySig=t;let i=++this._pastSeq,s=await Promise.all(e.map(async r=>{try{let c=await bi(this.hass,r.entryId,r.taskId);return c?[r.key,c]:null}catch{return null}}));i===this._pastSeq&&(this._pastHistory=Object.fromEntries(s.filter(r=>r!==null)))}async _subscribe(){let e=++this._subGen;try{let t=await this.hass.connection.subscribeMessage(i=>{let s=i;this._objects=s.objects},{type:"maintenance_supporter/subscribe"});if(!this.isConnected||e!==this._subGen){t();return}this._unsub=t}catch{}}_onEventClick(e){if(e.history_timestamp&&Xs.includes(String(e.history_type||"completed"))){this._openHistoryEntry(e);return}this._openTask(e)}_openTask(e){let t=new CustomEvent("maintenance-supporter-open-task",{detail:{entry_id:e.entry_id,task_id:e.task_id},bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(t)&&(ur(e.entry_id,e.task_id)||this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:e.entry_id,task_id:e.task_id},bubbles:!0,composed:!0})))}async _openHistoryEntry(e){try{let t=await vi(this.hass);if(!$t(this.hass?.user,t.access)){this._openTask(e);return}}catch{}try{let t=await Wa(this.hass,e.entry_id,e.task_id,e.history_timestamp);if(!t||hr(t))return}catch{}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:e.entry_id,task_id:e.task_id,original_timestamp:e.history_timestamp},bubbles:!0,composed:!0}))}render(){if(!this.hass)return h;let e=this._lang,t=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,s=this._config.title,r=null;this._userFilter&&(r=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let c=y=>{let D=y.toLowerCase();return this._objects.find(C=>C.entry_id===y||C.object.name.toLowerCase()===D)?.entry_id??null},d=new Set(this._configuredObjects.map(c).filter(y=>y!==null)),u=d.size?this._objects.filter(y=>d.has(y.entry_id)):this._objects,p=this._config.show_object_filter!==!1&&u.length>1,g=this._objectFilter?c(this._objectFilter):null,m=g&&u.some(y=>y.entry_id===g)?u.filter(y=>y.entry_id===g):u,b=_e(),x=this._pastDays>0,T=x?Pr(m,b,this._pastDays,r,this._pastHistory):Mr(m,b,this._windowDays,r),v=this._windowDays===365||x,k=v?T.filter(y=>y.events.length>0):T,w=y=>{let D=`cal-status-${y.status}`,re=y.projected?"cal-event-projected":"",C=y.status==="overdue"&&y.days_until_due!=null?` (${Ie(y.days_until_due,e)})`:"",R=y.projected&&y.interval_days?o`<span class="cal-event-recur">${y.interval_unit&&y.interval_unit!=="days"?na(y.interval_days,y.interval_unit,e):y.interval_days===1?a("cal_every_day",e):a("cal_every_n_days",e).replace("{n}",String(y.interval_days))}</span>`:h,B=y.schedule_type==="sensor_based",V=B?o`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${a("cal_source_sensor",e)}" icon="mdi:trending-up"></ha-icon>`:o`<ha-icon class="cal-event-icon cal-source-time"
                title="${y.adaptive_enabled?a("cal_source_time_adaptive",e):a("cal_source_time",e)}"
                icon="${y.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,z=B&&y.prediction_confidence&&y.status!=="triggered"&&!y.projected?o`<span class="cal-event-prediction cal-conf-${y.prediction_confidence}">
            ${a("cal_predicted",e)} · ${a(`cal_confidence_${y.prediction_confidence}`,e)}
          </span>`:h,Q=ai(this._stats?.budget),J=y.history_type?a(y.history_type,e):a(y.status,e);return o`
        <div class="cal-event ${re}"
          @click=${()=>this._onEventClick(y)}>
          ${V}
          <span class="cal-status-pill ${D}">${J}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${y.object_name} · ${y.task_name}${C}</div>
            ${z}
            ${R}
          </div>
          ${y.avg_cost!=null&&y.avg_cost!==0?o`<span class="cal-event-cost">${Y(y.avg_cost,Q,e)}</span>`:h}
        </div>
      `},E=y=>{let[D,re,C]=y.date.split("-").map(Number),R=new Date(D,re-1,C),B=y.date===b,V=la(R,e,"short"),z=ca(R,e,"long");return o`
        <div class="cal-day-row">
          <div class="cal-day-pill ${B?"cal-today":""}">
            <span class="cal-pill-weekday">${V}</span>
            <span class="cal-pill-day">${R.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${z}</span>
              ${B?o`<span class="cal-day-today-badge">${a("today",e)}</span>`:h}
            </div>
            ${y.events.length===0?o`<div class="cal-empty">${a("cal_no_events",e)}</div>`:y.events.map(w)}
          </div>
        </div>
      `};return o`
      <ha-card .header=${s}>
        ${t||i||p?o`
              <div class="cal-controls">
                ${t?o`
                      <div class="cal-window-chips cal-past-chips" title="${a("cal_past_windows",e)}">
                        ${[30,90].map(y=>o`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===y?"active":""}"
                            @click=${()=>{this._pastDays=y}}>
                            −${y}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${a("cal_forward_windows",e)}">
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
                        <option value="">${a("all_users",e)}</option>
                        <option value="current_user">${a("my_tasks",e)}</option>
                      </select>
                    `:h}
                ${p?o`
                      <select class="cal-user-filter"
                        .value=${g??""}
                        @change=${y=>{this._objectFilter=y.target.value}}>
                        <option value="">${a("all_objects",e)}</option>
                        ${[...u].sort((y,D)=>y.object.name.localeCompare(D.object.name)).map(y=>o`<option value=${y.entry_id} ?selected=${y.entry_id===g}>${y.object.name}</option>`)}
                      </select>
                    `:h}
              </div>
            `:h}
        <div class="cal-rolling">
          ${k.length===0&&v?o`<div class="cal-empty">${a("cal_no_events",e)}</div>`:k.map(E)}
        </div>
      </ha-card>
    `}};ke.styles=[_t,Ir,H`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],_([j({attribute:!1})],ke.prototype,"hass",2),_([f()],ke.prototype,"_config",2),_([f()],ke.prototype,"_objects",2),_([f()],ke.prototype,"_stats",2),_([f()],ke.prototype,"_windowDays",2),_([f()],ke.prototype,"_pastDays",2),_([f()],ke.prototype,"_userFilter",2),_([f()],ke.prototype,"_objectFilter",2),_([f()],ke.prototype,"_unsub",2),_([f()],ke.prototype,"_pastHistory",2);var Xn=[{value:7,key:"cal_editor_window_week"},{value:14,key:"cal_editor_window_fortnight"},{value:30,key:"cal_editor_window_month"},{value:365,key:"cal_editor_window_year"}],Jn=[{value:30,key:"cal_editor_window_past_30"},{value:90,key:"cal_editor_window_past_90"}],Et=class extends L{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}get _lang(){return F(this.hass)}setConfig(e){this._config={...e}}updated(){let e=this._lang;e&&!Pt(e)&&me(e).then(()=>{Pt(e)&&this.requestUpdate()})}_valueChanged(e,t){let i={...this._config,[e]:t};e==="show_window_chips"&&t===!0&&delete i.show_window_chips,e==="show_user_filter"&&t===!0&&delete i.show_user_filter,e==="show_object_filter"&&t===!0&&delete i.show_object_filter,e==="title"&&(!t||typeof t=="string"&&t.trim()==="")&&delete i.title,e==="user_filter"&&t===""&&delete i.user_filter,this._emit(i)}_windowChanged(e){let t={...this._config};e.startsWith("past-")?(t.past_days=Number(e.slice(5)),delete t.window_days):(t.window_days=Number(e),delete t.past_days),this._emit(t)}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){let e=this._lang,t=this._config.past_days?`past-${this._config.past_days}`:`${this._config.window_days??30}`,i=this._config.show_window_chips!==!1,s=this._config.show_user_filter!==!1,r=this._config.user_filter??"",c=this._config.title??"";return o`
      <div class="editor">
        <div class="row">
          <label for="title">${a("card_title",e)}</label>
          <input
            id="title"
            type="text"
            .value=${c}
            @input=${d=>this._valueChanged("title",d.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">${a("cal_editor_window",e)}</label>
          <select
            id="window"
            @change=${d=>this._windowChanged(d.target.value)}
          >
            ${Xn.map(d=>o`<option value="${d.value}" ?selected=${`${d.value}`===t}>${a(d.key,e)}</option>`)}
            ${Jn.map(d=>o`<option value="past-${d.value}" ?selected=${`past-${d.value}`===t}>${a(d.key,e)}</option>`)}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">${a("cal_editor_show_chips",e)}</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${i}
            @change=${d=>this._valueChanged("show_window_chips",d.target.checked)}
          />
        </div>
        <div class="hint">${a("cal_editor_chips_hint",e)}</div>
        <div class="row toggle">
          <label for="userf">${a("cal_editor_show_user_filter",e)}</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${s}
            @change=${d=>this._valueChanged("show_user_filter",d.target.checked)}
          />
        </div>
        <div class="row">
          <label for="userv">${a("cal_editor_default_user",e)}</label>
          <select
            id="userv"
            @change=${d=>this._valueChanged("user_filter",d.target.value)}
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
            @change=${d=>this._valueChanged("show_object_filter",d.target.checked)}
          />
        </div>
        <div class="hint">${a("cal_editor_object_hint",e)}</div>
      </div>
    `}};Et.styles=H`
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
  `,_([j({attribute:!1})],Et.prototype,"hass",2),_([f()],Et.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",ke);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",Et);Hr(["maintenance-supporter-calendar-card"],import.meta.url);zr({type:"maintenance-supporter-calendar-card",name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});var $e=class extends L{constructor(){super(...arguments);this.objects=[];this._summary=null;this._loaded=!1;this._busy=!1;this._error="";this._query="";this._results=[];this._expanded=!1;this._initiallyLoaded=!1;this._searchTimer=0;this._searchSeq=0}get _lang(){return F(this.hass)}connectedCallback(){super.connectedCallback(),this._initiallyLoaded&&this._load()}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._initiallyLoaded&&(this._initiallyLoaded=!0,this._load(),me(this._lang).then(()=>this.requestUpdate()))}async _load(){let e=await I(this,{type:"maintenance_supporter/documents/storage"},{busy:t=>{this._busy=t},onError:t=>{this._error=t}});this._loaded=!0,e!==void 0&&(this._summary=e,this._error="")}_nameFor(e){return this.objects.find(i=>i.object?.id===e)?.object?.name||e.slice(0,8)}_entryFor(e){return this.objects.find(t=>t.object?.id===e)?.entry_id}_toggle(){this._expanded=!this._expanded}_openObject(e){this.dispatchEvent(new CustomEvent("open-object",{detail:{entry_id:e},bubbles:!0,composed:!0}))}_onSearch(e){this._query=e.target.value,clearTimeout(this._searchTimer),this._searchTimer=window.setTimeout(()=>{this._doSearch()},250)}async _doSearch(){let e=this._query.trim(),t=++this._searchSeq;if(!e){this._results=[];return}let i="",s=await I(this,{type:"maintenance_supporter/documents/search",query:e},{onError:r=>{i=r}});if(t===this._searchSeq){if(s===void 0){this._error=i,this._results=[];return}this._results=s?.results||[]}}async _openResult(e){if(e.kind==="weblink"){de(e.url)&&window.open(e.url,"_blank","noopener");return}await I(this,()=>Fe(this.hass,e.id),{onError:t=>{this._error=t}})}_renderResult(e,t){return o`
      <div class="obj-row result-row" title=${a("doc_open",t)} @click=${()=>this._openResult(e)}>
        <ha-icon icon=${e.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"}></ha-icon>
        <div class="result-info">
          <div class="result-title">${fe(e)}</div>
          <div class="result-obj">${e.object_name}</div>
        </div>
        <ha-icon class="result-open" icon=${e.kind==="weblink"?"mdi:open-in-new":"mdi:eye-outline"}></ha-icon>
      </div>
    `}render(){if(!this._loaded||!this._summary)return h;let e=this._summary;if(!e.document_count)return h;let t=this._lang,i=Object.entries(e.by_object??{}).filter(([,s])=>s.files>0||s.links>0).map(([s,r])=>({id:s,name:this._nameFor(s),entry:this._entryFor(s),...r})).sort((s,r)=>r.bytes-s.bytes);return o`
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
                ${ze(e.total_bytes,t)}
                ${e.dedup_savings_bytes>0?o`<span class="saved">−${ze(e.dedup_savings_bytes,t)}</span>`:h}
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

          ${this._expanded?o`
                <div class="body">
                  <div class="totals">
                    <div class="stat">
                      <div class="stat-value">${ze(e.total_bytes,t)}</div>
                      <div class="stat-label">
                        <ha-icon icon="mdi:file-document-outline"></ha-icon> ${e.file_count}
                        <ha-icon icon="mdi:link-variant"></ha-icon> ${e.link_count}
                      </div>
                    </div>
                    ${e.dedup_savings_bytes>0?o`<div class="stat">
                          <div class="stat-value saved">−${ze(e.dedup_savings_bytes,t)}</div>
                          <div class="stat-label">${a("doc_storage_saved",t)}</div>
                        </div>`:h}
                  </div>

                  ${e.search_index&&e.search_index.total>0?o`<div class="index-status">
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

                  ${this._error?ge("error",this._error):h}

                  ${this._query.trim()?this._results.length?o`<div class="obj-list">${this._results.map(s=>this._renderResult(s,t))}</div>`:o`<div class="search-empty">${a("doc_search_none",t)}</div>`:i.length?o`<div class="obj-list">${i.map(s=>this._renderObjRow(s,t))}</div>`:h}
                </div>
              `:h}
        </div>
      </ha-card>
    `}_renderObjRow(e,t){let i=e.entry;return o`
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
          ${e.files>0?o`<ha-icon icon="mdi:file-document-outline"></ha-icon>${e.files}`:h}
          ${e.links>0?o`<ha-icon icon="mdi:link-variant"></ha-icon>${e.links}`:h}
        </span>
        <span class="obj-size">${ze(e.bytes,t)}</span>
        ${i?o`<ha-icon class="obj-go" icon="mdi:chevron-right"></ha-icon>`:h}
      </div>
    `}};$e.styles=H`
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
  `,_([j({attribute:!1})],$e.prototype,"hass",2),_([j({attribute:!1})],$e.prototype,"objects",2),_([f()],$e.prototype,"_summary",2),_([f()],$e.prototype,"_loaded",2),_([f()],$e.prototype,"_busy",2),_([f()],$e.prototype,"_error",2),_([f()],$e.prototype,"_query",2),_([f()],$e.prototype,"_results",2),_([f()],$e.prototype,"_expanded",2);customElements.get("maintenance-storage-section-card")||customElements.define("maintenance-storage-section-card",$e);var Zn=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"],Ae=class extends L{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId="";this._values=new Array(12).fill("");this._save=async()=>{let e=this._buildOverrides();e!==null&&await this._send(e)!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved")))};this._clearAll=async()=>{await this._send({})!==void 0&&(this._values=new Array(12).fill(""),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved")))}}get _lang(){return F(this.hass)}open(e,t,i){if(this._entryId=e,this._taskId=t,this._values=new Array(12).fill(""),i)for(let[s,r]of Object.entries(i)){let c=parseInt(s,10);c>=1&&c<=12&&typeof r=="number"&&(this._values[c-1]=r.toString())}this._error="",this._open=!0}_close(){this._open=!1}_buildOverrides(){let e={};for(let t=0;t<12;t++){let i=this._values[t].trim();if(!i)continue;let s=parseFloat(i);if(Number.isNaN(s))return this._error=`${a("month_"+["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][t],this._lang)}: ${a("seasonal_override_invalid",this._lang)}`,null;if(s<Ut[0]||s>Ut[1])return this._error=a("seasonal_override_range",this._lang),null;e[t+1]=s}return e}_send(e){return this._error="",I(this,{type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:e},{busy:t=>{this._loading=t},fallbackKey:"save_error",onError:t=>{this._error=t}})}render(){if(!this._open)return o``;let e=this._lang;return o`
      <ha-dialog open .headerTitle=${gt(a("seasonal_overrides_title",e))} @closed=${this._close}>
        ${ft(a("seasonal_overrides_title",e))}
        <div class="content">
          <p class="hint">${a("seasonal_overrides_hint",e)}</p>
          ${this._error?ge("error",this._error):h}
          <div class="months">
            ${Zn.map((t,i)=>o`
              <label class="month">
                <span class="mn">${a(t,e)}</span>
                <input type="number" step="0.1" min=${Ut[0]} max=${Ut[1]}
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
    `}};Ae.styles=H`
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
  `,_([j({attribute:!1})],Ae.prototype,"hass",2),_([f()],Ae.prototype,"_open",2),_([f()],Ae.prototype,"_loading",2),_([f()],Ae.prototype,"_error",2),_([f()],Ae.prototype,"_entryId",2),_([f()],Ae.prototype,"_taskId",2),_([f()],Ae.prototype,"_values",2);customElements.get("maintenance-seasonal-overrides-dialog")||customElements.define("maintenance-seasonal-overrides-dialog",Ae);var Te=class extends L{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._groupId=null;this._name="";this._description="";this._selected=new Set;this._toggleTask=(e,t)=>{let i=`${e}:${t}`,s=new Set(this._selected);s.has(i)?s.delete(i):s.add(i),this._selected=s};this._save=async()=>{let e=this._name.trim();if(!e){this._error=a("group_name_required",this._lang);return}this._error="";let t=this._buildTaskRefs();await I(this,this._groupId?{type:"maintenance_supporter/group/update",group_id:this._groupId,name:e,description:this._description,task_refs:t}:{type:"maintenance_supporter/group/create",name:e,description:this._description,task_refs:t},{busy:s=>{this._loading=s},fallbackKey:"save_error",onError:s=>{this._error=s}})!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("group-saved")))}}get _lang(){return F(this.hass)}openCreate(){this._reset(),this._open=!0}openEdit(e,t){this._reset(),this._groupId=e,this._name=t.name,this._description=t.description||"",this._selected=new Set(t.task_refs.map(i=>`${i.entry_id}:${i.task_id}`)),this._open=!0}_reset(){this._groupId=null,this._name="",this._description="",this._selected=new Set,this._error=""}_close(){this._open=!1}_buildTaskRefs(){return[...this._selected].map(e=>{let[t,i]=e.split(":",2);return{entry_id:t,task_id:i}})}render(){if(!this._open)return o``;let e=this._lang,t=this._groupId?a("edit_group",e):a("new_group",e);return o`
      <ha-dialog open .headerTitle=${gt(t)} @closed=${this._close}>
        ${ft(t)}
        <div class="content">
          ${this._error?ge("error",this._error):h}
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
          ${this.objects.length===0?o`<div class="hint">${a("no_objects",e)}</div>`:o`
              <div class="objects">
                ${[...this.objects].sort((i,s)=>i.object.name.localeCompare(s.object.name)).map(i=>o`
                  <div class="object-block">
                    <div class="object-name">${i.object.name}</div>
                    ${i.tasks.length===0?o`<div class="hint small">${a("no_tasks_short",e)}</div>`:[...i.tasks].sort((s,r)=>s.name.localeCompare(r.name)).map(s=>{let r=`${i.entry_id}:${s.id}`,c=this._selected.has(r);return o`
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
    `}};Te.styles=H`
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
  `,_([j({attribute:!1})],Te.prototype,"hass",2),_([j({attribute:!1})],Te.prototype,"objects",2),_([f()],Te.prototype,"_open",2),_([f()],Te.prototype,"_loading",2),_([f()],Te.prototype,"_error",2),_([f()],Te.prototype,"_groupId",2),_([f()],Te.prototype,"_name",2),_([f()],Te.prototype,"_description",2),_([f()],Te.prototype,"_selected",2);customElements.get("maintenance-group-dialog")||customElements.define("maintenance-group-dialog",Te);var He=class extends L{constructor(){super(...arguments);this._open=!1;this._busy=!1;this._error="";this._name="";this._views=[];this._filters=null;this._localeReady=!1;this._save=async()=>{let e=this._name.trim();if(!e||this._busy||!this._filters)return;let t=await this._runWs({type:"maintenance_supporter/views/save",name:e,filters:this._filters});t!==void 0&&(this._name="",this._emitChanged(t?.views||[]))};this._delete=async e=>{if(this._busy)return;let t=await this._runWs({type:"maintenance_supporter/views/delete",view_id:e});t!==void 0&&this._emitChanged(t?.views||[])}}get _lang(){return F(this.hass)}updated(e){e.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,me(this._lang).then(()=>this.requestUpdate())),e.has("_open")&&this._open&&Za(this.shadowRoot)}async open(e,t){this._open=!0,this._error="",this._name="",this._filters=e,this._views=t}_close(){this._open=!1}_emitChanged(e){this._views=e,this.dispatchEvent(new CustomEvent("saved-views-changed",{bubbles:!0,composed:!0,detail:{views:e}}))}_runWs(e){return this._error="",I(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}render(){if(!this._open)return o``;let e=this._lang;return Ja(()=>this._close(),o`
        ${Xa()?h:o`<div class="title">${a("views_dialog_title",e)}</div>`}
        <div class="hint">${a("views_dialog_hint",e)}</div>
        ${this._error?ge("error",this._error):h}

        <div class="save-row">
          <input
            class="name-input"
            type="text"
            .value=${this._name}
            placeholder=${a("views_name_placeholder",e)}
            aria-label=${a("views_name_placeholder",e)}
            maxlength="60"
            @input=${t=>this._name=t.target.value}
            @keydown=${t=>{t.key==="Enter"&&this._save()}}
          />
          <ha-button @click=${this._save} .disabled=${!this._name.trim()||this._busy}>
            ${a("views_save_current",e)}
          </ha-button>
        </div>

        ${this._views.length===0?o`<div class="empty">${a("views_none_yet",e)}</div>`:o`
              <div class="list dialog-scroll">
                ${this._views.map(t=>o`
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
    `,{title:a("views_dialog_title",e)})}};He.styles=[Qa,H`
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
  `],_([j({attribute:!1})],He.prototype,"hass",2),_([f()],He.prototype,"_open",2),_([f()],He.prototype,"_busy",2),_([f()],He.prototype,"_error",2),_([f()],He.prototype,"_name",2),_([f()],He.prototype,"_views",2);customElements.get("maintenance-saved-views-dialog")||customElements.define("maintenance-saved-views-dialog",He);var eo=60,to=20,Lr=30,io={approaching:"\u2197",stable:"\u2192",easing:"\u2198"};function ks(n,l){let e=n.trigger_config,t=Ce(e);if(!e||!t||n.battery_fleet_task)return null;let i,s=e.type||"threshold";if(s==="threshold")if(e.trigger_above!=null)i=1;else if(e.trigger_below!=null)i=-1;else return null;else if(s==="counter"||s==="runtime"||s==="state_change")i=1;else return null;let r=l.get(wt(t,Ue(e)))||[],c=s==="runtime"||s==="state_change",d=r.length>=2?r.map(T=>({ts:T.ts,val:T.val})):c?[]:(n.history||[]).filter(T=>T.trigger_value!=null).map(T=>({ts:Ee(T.timestamp),val:T.trigger_value}));if(n.trigger_current_value!=null&&(d=[...d,{ts:Date.now(),val:n.trigger_current_value}]),d.length<2)return null;d.sort((T,v)=>T.ts-v.ts);let u=d.map(T=>T.val),p=Math.max(...u)-Math.min(...u),g=u[u.length-1]-u[0],m=e.trigger_delta_mode&&n.trigger_baseline_value!=null&&e.trigger_target_value!=null?n.trigger_baseline_value+e.trigger_target_value:e.trigger_target_value,b=s==="threshold"?e.trigger_above??e.trigger_below:s==="counter"?m:s==="runtime"?e.trigger_runtime_hours:e.trigger_target_changes,x=typeof b=="number"?Math.max(Math.abs(b-u[0]),p):p;return x===0||Math.abs(g)<x*(typeof b=="number"?.05:.15)?"stable":Math.sign(g)===i?"approaching":"easing"}function Kt(n){return n>0?Math.ceil(n):Math.trunc(n)||0}function $s(n,l){let e=n.trigger_config??null;if(!e)return h;let t=e.type||"threshold",i=n.trigger_entity_info?.unit_of_measurement??"",s=0,r="",c="";if(t==="threshold"){let p=n.trigger_current_value??null;if(p==null)return h;let g=e.trigger_above,m=e.trigger_below;if(g!=null&&m!=null){let b=(g+m)/2,x=Math.abs(g-m)/2||1;s=Math.min(100,Math.max(0,Math.abs(p-b)/x*100));let T=Math.abs(p-g)<=Math.abs(p-m)?g:m;r=`${xe(p,"",l?.lang)} / ${W(T,l?.lang)}`,c=i}else if(g!=null){let b=n.trigger_entity_info?.min,x=g>0?0:b!=null&&b<g?b:g<0?2*g:-100,T=g-x||1;s=Math.min(100,Math.max(0,(p-x)/T*100)),r=`${xe(p,"",l?.lang)} / ${W(g,l?.lang)}`,c=i}else if(m!=null){let b=n.trigger_entity_info?.max,x=b!=null&&b>m?b:m>0?m*2:m<0?0:100,T=x-m||1;s=Math.min(100,Math.max(0,(x-p)/T*100)),r=`${xe(p,"",l?.lang)} / ${W(m,l?.lang)}`,c=i}else if(e.trigger_equals!=null||e.trigger_not_equals!=null){let b=e.trigger_equals!=null?`= ${e.trigger_equals}`:`\u2260 ${e.trigger_not_equals}`;r=`${xe(p,"",l?.lang)} (${b}${i?` ${i}`:""})`,s=n.trigger_active?100:0}else return h}else if(t==="counter"){let p=e.trigger_target_value||1,g;if(e.trigger_delta_mode?(g=n.trigger_current_delta??null,g==null&&n.trigger_baseline_value!=null&&n.trigger_current_value!=null&&(g=n.trigger_current_value-n.trigger_baseline_value)):g=n.trigger_current_value??null,g==null)return h;s=Math.min(100,Math.max(0,g/p*100)),r=`${xe(g,"",l?.lang)} / ${W(p,l?.lang)}`,c=i}else if(t==="state_change"){let p=e.trigger_target_changes||1,g=n.trigger_current_value??null;if(g==null)return h;s=Math.min(100,Math.max(0,g/p*100)),r=`${W(g,l?.lang,0)} / ${W(p,l?.lang,0)}`}else if(t==="runtime"){let p=e.trigger_runtime_hours||100,g=n.trigger_current_value??null;if(g==null)return h;s=Math.min(100,Math.max(0,g/p*100)),r=`${xe(g,"",l?.lang)}h / ${W(p,l?.lang)}h`}else if(t==="due_date"){let p=n.trigger_current_value??null;if(p==null)return h;let g=e.trigger_days_before??0;s=p<=g?100:Math.max(0,100-(p-g)/30*100),r=Ie(Kt(p),l?.lang)}else if(t==="compound"){let p=e.compound_logic||e.operator||"AND",g=e.conditions?.length||0;r=`${p} (${g})`,s=n.trigger_active?100:0}else return h;if(n.battery_fleet_task&&t==="threshold"&&n.trigger_current_value!=null){let p=Math.round(n.trigger_current_value),g=e.trigger_above??0;s=p>g?100:g>0?Math.max(0,p/(g+1)*100):0,r=a("battery_fleet_progress",l?.lang??"en").replace("{n}",W(p,l?.lang,0)),c=""}let d=s>=100,u=s>90?"var(--error-color, #f44336)":s>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return o`
    <div class="trigger-progress">
      <div class="trigger-progress-bar">
        <div class="trigger-progress-fill${d?" overflow":""}" style="width:${s}%;background:${u}"></div>
      </div>
      <span class="trigger-progress-label"><span class="trigger-progress-text"><span class="tp-num">${r}</span>${c?o` <span class="tp-unit">${c}</span>`:h}</span>${l?.trend?o`<i class="trend-arrow trend-${l.trend}" title="${a(`trend_${l.trend}`,l.lang??"en")}" aria-label="${a(`trend_${l.trend}`,l.lang??"en")}">${io[l.trend]}</i>`:h}</span>
    </div>
  `}function Ts(n,l,e){let t=Ce(n.trigger_config);if(!t||n.battery_fleet_task)return h;let i=l.get(wt(t,Ue(n.trigger_config)))||[],s=[];if(i.length>=2)s=i.map(y=>({ts:y.ts,val:y.val}));else{if(!n.history)return h;for(let y of n.history)y.trigger_value!=null&&s.push({ts:Ee(y.timestamp),val:y.trigger_value})}if(n.trigger_current_value!=null&&s.push({ts:Date.now(),val:n.trigger_current_value}),s.length<2)return h;s.sort((y,D)=>y.ts-D.ts);let r=eo,c=to,d=s.map(y=>y.val),u=Math.min(...d),p=Math.max(...d),g=p-u||1;u-=g*.1,p+=g*.1;let m=s[0].ts,x=s[s.length-1].ts-m||1,T=y=>(y-m)/x*r,v=y=>2+(1-(y-u)/(p-u))*(c-4),k=s;if(k.length>Lr){let y=Math.ceil(k.length/Lr);k=k.filter((D,re)=>re%y===0||re===k.length-1)}let w=k.map(y=>`${M(T(y.ts))},${M(v(y.val))}`).join(" "),E=n.trigger_active?"var(--error-color, #f44336)":"var(--primary-color)";return o`
    <svg class="mini-sparkline" viewBox="0 0 ${r} ${c}" preserveAspectRatio="none" role="img" aria-label="${a("chart_mini_sparkline",e)}">
      <polyline points="${w}" fill="none" stroke="${E}" stroke-width="1.5" stroke-linejoin="round" />
    </svg>
  `}function Ss(n,l,e="last-done"){let t=ra(n,l);return t?o`<span class="${e}" title="${a("last_performed",l)}: ${U(n,l)}">${t}</span>`:null}function js(n,l,e,t="due-text"){return(n==null?Ss(l,e,`${t} last-done`):null)??o`<span class="${t}">${Ie(n,e)}</span>`}function Br(n,l){let e=l;if(n.days_until_due==null||!n.interval_days||n.interval_days<=0)return h;let{pct:t,overflow:i}=Si(n.interval_days,n.days_until_due,n.interval_unit),s="var(--success-color, #4caf50)";return n.status==="overdue"?s="var(--error-color, #f44336)":n.status==="due_soon"&&(s="var(--warning-color, #ff9800)"),o`
    <div class="days-progress">
      <div class="days-progress-labels">
        <span>${n.last_performed?`${a("last_performed",e)}: ${U(n.last_performed,e)}`:""}</span>
        <span>${n.next_due?`${a("next_due",e)}: ${U(n.next_due,e)}`:""}</span>
      </div>
      <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(t)}" aria-valuemin="0" aria-valuemax="100" aria-label="${a("days_progress",e)}">
        <div class="days-progress-fill${i?" overflow":""}" style="width:${t}%;background:${s}"></div>
      </div>
      <div class="days-progress-text">${Ie(n.days_until_due,e)}</div>
    </div>
  `}var zi=210,De=46,Ke=14,Ye=12,Nr=14,so=20+Nr,ao=[{days:7,key:"chart_range_7d"},{days:30,key:"chart_range_30d"},{days:90,key:"chart_range_90d"},{days:365,key:"chart_range_1y"}],ie=class extends L{constructor(){super(...arguments);this.points=[];this.events=[];this.unit="";this.lang="en";this.thresholdAbove=null;this.thresholdBelow=null;this.targetValue=null;this.targetMark="\u25C6";this.forceZero=!1;this.projection=null;this.rangeDays=30;this.showRange=!0;this.busy=!1;this.hideOutliers=!1;this.showOutlierToggle=!0;this._width=0;this._hover=null;this._ro=null}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(e=>{let t=Math.floor(e[0]?.contentRect?.width||0);t&&Math.abs(t-this._width)>2&&(this._width=t)}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=null}_emitRange(e){e!==this.rangeDays&&this.dispatchEvent(new CustomEvent("range-change",{detail:{days:e},bubbles:!0,composed:!0}))}_toggleOutliers(){this.dispatchEvent(new CustomEvent("outlier-toggle",{detail:{hide:!this.hideOutliers},bubbles:!0,composed:!0}))}render(){let e=this._width||320,t=[...this.points].sort((s,r)=>s.ts-r.ts),i=this.lang;return o`
      <div class="chart-wrap">
        ${this.showRange?o`<div class="range-chips" role="group">
              ${this.showOutlierToggle?o`<button
                    class="range-chip outlier-chip ${this.hideOutliers?"active":""}"
                    ?disabled=${this.busy}
                    title=${a("hide_outliers",i)}
                    @click=${()=>this._toggleOutliers()}
                  ><ha-icon icon="mdi:filter-variant"></ha-icon></button>`:h}
              ${ao.map(s=>o`<button
                  class="range-chip ${this.rangeDays===s.days?"active":""}"
                  ?disabled=${this.busy}
                  @click=${()=>this._emitRange(s.days)}
                >${a(s.key,i)}</button>`)}
            </div>`:h}
        ${t.length<2?o`<div class="chart-empty">
              <ha-icon icon="mdi:chart-line"></ha-icon> ${a("loading_chart",i)}
            </div>`:this._renderSvg(e,t)}
      </div>
    `}_renderSvg(e,t){let i=this.lang,s=e-De-Ke,r=zi-so,c=r-Ye,d=1/0,u=-1/0;for(let O of t)d=Math.min(d,O.min??O.val),u=Math.max(u,O.max??O.val);this.thresholdAbove!=null&&(d=Math.min(d,this.thresholdAbove),u=Math.max(u,this.thresholdAbove)),this.thresholdBelow!=null&&(d=Math.min(d,this.thresholdBelow),u=Math.max(u,this.thresholdBelow)),this.targetValue!=null&&(d=Math.min(d,this.targetValue),u=Math.max(u,this.targetValue)),this.forceZero&&(d=Math.min(d,0));let p=(u-d||1)*.06,g=this.forceZero&&d>=0?0:d>=0?Math.max(0,d-p):d-p,{ticks:m,niceMin:b,niceMax:x}=Vt(g,u+p,4);d>=0&&b<0&&(b=0,m=m.filter(O=>O>=0));let T=m.length>1?m[1]-m[0]:0,v=t[0].ts,k=this.projection&&this.projection.length===2?this.projection[1].ts:null,w=k!=null?Math.max(t[t.length-1].ts,k):t[t.length-1].ts,E=w-v||1,y=O=>De+(O-v)/E*s,D=O=>Ye+(1-(O-b)/(x-b||1))*c,re=t.map(O=>`${M(y(O.ts))},${M(D(O.val))}`).join(" "),C=`M${M(y(t[0].ts))},${r} `+t.map(O=>`L${M(y(O.ts))},${M(D(O.val))}`).join(" ")+` L${M(y(t[t.length-1].ts))},${r} Z`,R="",B=t.filter(O=>O.min!=null&&O.max!=null);if(B.length>=2){let O=B.map(ue=>`${M(y(ue.ts))},${M(D(ue.max))}`),Z=[...B].reverse().map(ue=>`${M(y(ue.ts))},${M(D(ue.min))}`);R=`M${O[0]} `+O.slice(1).map(ue=>`L${ue}`).join(" ")+` L${Z.join(" L")} Z`}let V=[];if(this.thresholdBelow!=null){let O=D(this.thresholdBelow);V.push({y:O,h:Math.max(0,r-O),lineY:O,label:`\u25BC ${Ve(this.thresholdBelow,i)}`,labelY:Math.min(r-4,O+13)})}if(this.thresholdAbove!=null){let O=D(this.thresholdAbove);V.push({y:Ye,h:Math.max(0,O-Ye),lineY:O,label:`\u25B2 ${Ve(this.thresholdAbove,i)}`,labelY:Math.max(Ye+11,O-5)})}let z=t[t.length-1],Q=(this.events||[]).filter(O=>O.ts>=v&&O.ts<=w),J=xi(v,w,Math.max(2,Math.min(5,Math.floor(s/110)+1))),ee=this._hover;return o`
      <div class="svg-holder">
        <svg
          class="chart-svg"
          viewBox="0 0 ${e} ${zi}"
          width=${e}
          height=${zi}
          role="img"
          aria-label=${a("chart_sparkline",i)}
          @pointermove=${O=>this._onPointer(O,t,y,D,e)}
          @pointerdown=${O=>this._onPointer(O,t,y,D,e)}
          @pointerleave=${()=>this._hover=null}
        >
          <defs>
            <clipPath id="plot"><rect x="${De}" y="${Ye}" width="${s}" height="${c}" /></clipPath>
            ${V.length?K`<clipPath id="danger">${V.map(O=>K`<rect x="${De}" y="${M(O.y)}" width="${s}" height="${M(O.h)}" />`)}</clipPath>`:h}
            <!-- Diagonal hatch so the danger zone reads without relying on the
                 red tint alone (dark-theme contrast + colour-blind support). -->
            <pattern id="dangerHatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
              <rect width="7" height="7" fill="var(--error-color, #f44336)" opacity="0.10" />
              <line x1="0" y1="0" x2="0" y2="7" stroke="var(--error-color, #f44336)" stroke-width="1.4" opacity="0.5" />
            </pattern>
          </defs>

          ${m.map(O=>{let Z=D(O);return Z<Ye-1||Z>r+1?h:K`
              <line x1="${De}" y1="${M(Z)}" x2="${e-Ke}" y2="${M(Z)}"
                stroke="var(--divider-color)" stroke-width="1" opacity="0.6" />
              <text x="${De-7}" y="${M(Z+3.5)}" text-anchor="end" class="tick-label">${qa(O,T,i)}</text>`})}

          ${V.map(O=>K`<rect x="${De}" y="${M(O.y)}" width="${s}" height="${M(O.h)}"
              fill="url(#dangerHatch)" />`)}

          ${R?K`<path d="${R}" fill="var(--primary-color)" opacity="0.08" clip-path="url(#plot)" />`:h}
          <path d="${C}" fill="var(--primary-color)" opacity="0.10" clip-path="url(#plot)" />
          <polyline points="${re}" fill="none" stroke="var(--primary-color)" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" clip-path="url(#plot)" />
          ${V.length?K`<polyline points="${re}" fill="none" stroke="var(--error-color, #f44336)" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" clip-path="url(#danger)" />`:h}

          ${V.map(O=>K`
              <line x1="${De}" y1="${M(O.lineY)}" x2="${e-Ke}" y2="${M(O.lineY)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${e-Ke-4}" y="${M(O.labelY)}" text-anchor="end" class="zone-label">${O.label}</text>`)}

          ${this.targetValue!=null?K`<line x1="${De}" y1="${M(D(this.targetValue))}" x2="${e-Ke}" y2="${M(D(this.targetValue))}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${e-Ke-4}" y="${M(D(this.targetValue)-5)}" text-anchor="end" class="zone-label">${this.targetMark} ${Ve(this.targetValue,i)} ${this.unit}</text>`:h}

          ${this.projection&&this.projection.length===2?K`<line x1="${M(y(this.projection[0].ts))}" y1="${M(D(this.projection[0].val))}"
                x2="${M(Math.min(y(this.projection[1].ts),e-Ke))}" y2="${M(D(Math.max(b,Math.min(x,this.projection[1].val))))}"
                stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.8" />`:h}

          ${J.map((O,Z)=>{let ue=y(O),at=Z===0?"start":Z===J.length-1?"end":"middle",ce=os(O,i,v,w);return Z>0&&ce===os(J[Z-1],i,v,w)?h:K`<text x="${M(ue)}" y="${zi-5}" text-anchor="${at}" class="tick-label">${ce}</text>`})}

          <line x1="${De}" y1="${r}" x2="${e-Ke}" y2="${r}" stroke="var(--divider-color)" stroke-width="1" />

          ${Q.map(O=>{let Z=y(O.ts),ue=O.type==="completed"?"var(--success-color, #4caf50)":O.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return K`
              <line x1="${M(Z)}" y1="${Ye}" x2="${M(Z)}" y2="${r}" stroke="${ue}" stroke-width="1" opacity="0.14" />
              <rect x="${M(Z-1.5)}" y="${r+3}" width="3" height="${Nr-6}" rx="1.5" fill="${ue}">
                <title>${ls(O.ts,i)}</title>
              </rect>`})}

          ${ee?K`
                <line x1="${M(ee.x)}" y1="${Ye}" x2="${M(ee.x)}" y2="${r}"
                  stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.7" />
                <circle cx="${M(ee.x)}" cy="${M(ee.y)}" r="4.5" fill="var(--primary-color)"
                  stroke="var(--card-background-color, #fff)" stroke-width="2" />`:K`<circle cx="${M(y(z.ts))}" cy="${M(D(z.val))}" r="4" fill="var(--primary-color)"
                stroke="var(--card-background-color, #fff)" stroke-width="1.5" />`}
        </svg>
        ${ee?o`<div
              class="hover-chip"
              style="left:${Math.min(Math.max(ee.x,70),e-70)}px"
            >
              <div class="hover-date">${ls(ee.p.ts,i)}</div>
              <div class="hover-val">
                ${xe(ee.p.val,this.unit,i)}
                ${ee.p.min!=null&&ee.p.max!=null?o`<span class="hover-range">(${Ve(ee.p.min,i)}–${Ve(ee.p.max,i)})</span>`:h}
              </div>
            </div>`:h}
      </div>
    `}_onPointer(e,t,i,s,r){let d=e.currentTarget.getBoundingClientRect(),u=(e.clientX-d.left)/d.width*r;if(u<De-8||u>r-Ke+8){this._hover=null;return}let p=t[0],g=1/0;for(let m of t){let b=Math.abs(i(m.ts)-u);b<g&&(g=b,p=m)}this._hover={x:i(p.ts),y:s(p.val),p}}};ie.styles=H`
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
  `,_([j({attribute:!1})],ie.prototype,"points",2),_([j({attribute:!1})],ie.prototype,"events",2),_([j()],ie.prototype,"unit",2),_([j()],ie.prototype,"lang",2),_([j({attribute:!1})],ie.prototype,"thresholdAbove",2),_([j({attribute:!1})],ie.prototype,"thresholdBelow",2),_([j({attribute:!1})],ie.prototype,"targetValue",2),_([j()],ie.prototype,"targetMark",2),_([j({type:Boolean})],ie.prototype,"forceZero",2),_([j({attribute:!1})],ie.prototype,"projection",2),_([j({attribute:!1})],ie.prototype,"rangeDays",2),_([j({type:Boolean})],ie.prototype,"showRange",2),_([j({type:Boolean})],ie.prototype,"busy",2),_([j({type:Boolean})],ie.prototype,"hideOutliers",2),_([j({type:Boolean})],ie.prototype,"showOutlierToggle",2),_([f()],ie.prototype,"_width",2),_([f()],ie.prototype,"_hover",2);customElements.get("maintenance-trigger-chart")||customElements.define("maintenance-trigger-chart",ie);function Fr(n){let l=(n??"").trim().toLowerCase();return l==="on"||l==="open"||l==="true"?1:l==="off"||l==="closed"||l==="false"?0:null}function ro(n,l,e){if(n.length<2)return null;let t=e.now??Date.now(),i=Math.max(0,l.trigger_for_minutes??0)*6e4,s=l.trigger_from_state?Fr(l.trigger_from_state):null,r=l.trigger_to_state?Fr(l.trigger_to_state):null;if(l.trigger_from_state&&s===null||l.trigger_to_state&&r===null)return null;let c=[...n].sort((w,E)=>w.ts-E.ts),d=[];for(let w of c){let E=d[d.length-1];(!E||E.level!==w.val)&&d.push({start:w.ts,level:w.val})}let u=w=>(w+1<d.length?d[w+1].start:t)-d[w].start>=i,p=(w,E,y)=>{let D=w[w.length-1];D&&D.val!==y&&w.push({ts:E,val:D.val}),w.push({ts:E,val:y})};if((l.trigger_target_changes??1)===1&&r!==null){let w=[];d.forEach((y,D)=>p(w,y.start,y.level===r&&u(D)?1:0));let E=w[w.length-1]?.val??0;return w.push({ts:t,val:E}),{points:w,mode:"alarm"}}let m=e.since??d[0].start,b=0,x=[];for(let w=1;w<d.length;w++){let E=d[w-1],y=d[w];s!==null&&E.level!==s||r!==null&&y.level!==r||!u(w)||y.start<m||(b+=1,x.push(y.start))}let T=Math.max(0,(e.current??b)-b),v=[{ts:Math.max(m,d[0].start),val:T}],k=T;for(let w of x)k+=1,p(v,w,k);return v.push({ts:t,val:k}),{points:v,mode:"count"}}function no(n){if(n.length<4)return n;let l=n.map(u=>u.val).sort((u,p)=>u-p),e=u=>{let p=(l.length-1)*u,g=Math.floor(p),m=Math.ceil(p);return l[g]+(l[m]-l[g])*(p-g)},t=e(.25),i=e(.75),s=i-t;if(s===0)return n;let r=t-1.5*s,c=i+1.5*s,d=n.filter(u=>u.val>=r&&u.val<=c);return d.length>=2?d:n}function qr(n,l){let e=n.trigger_config;if(!e)return h;if(pe())return ho(n,l);let t=l.lang,i=n.trigger_entity_info,s=n.trigger_entity_infos,r=Ce(e)||"",c=i?.friendly_name||r||"\u2014",d=Nt(e),u=i?.unit_of_measurement||"",p=n.trigger_current_value,g=e.type||"threshold",m=d.length>1,b=Ur(n,u,l);return o`
    <h3>${a("trigger",t)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${m?o`
            <div class="trigger-entity-name">${d.length} ${a("entities",t)} (${e.entity_logic||"any"})</div>
            <div class="trigger-entity-id">${d.map((x,T)=>o`${T>0?", ":""}<span class="entity-link" @click=${v=>mt(v,x)}>${x}</span>`)}${e.attribute?` \u2192 ${e.attribute}`:""}</div>
          `:o`
            <div class="trigger-entity-name">${c}</div>
            <div class="trigger-entity-id">${r?o`<span class="entity-link" @click=${x=>mt(x,r)}>${r}</span>`:""}${e.attribute?` \u2192 ${e.attribute}`:""}</div>
          `}
        </div>
        <span class="status-badge ${n.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
          ${n.trigger_active?a("triggered",t):a("ok",t)}
        </span>
      </div>

      ${b?Wr(b,t):p!=null?o`
              <div class="trigger-value-row">
                <span class="trigger-current ${n.trigger_active?"active":""}">${g==="due_date"&&typeof p=="number"?Ie(Kt(p),t):typeof p=="number"?xe(p,"",t):p}</span>
                ${u?o`<span class="trigger-unit">${u}</span>`:h}
              </div>
            `:h}

      <div class="trigger-limits">
        ${g==="threshold"?o`
          ${e.trigger_above!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("threshold_above",t)}: ${e.trigger_above} ${u}</span>`:h}
          ${e.trigger_below!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("threshold_below",t)}: ${e.trigger_below} ${u}</span>`:h}
          ${e.trigger_equals!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> = ${e.trigger_equals} ${u}</span>`:h}
          ${e.trigger_not_equals!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ≠ ${e.trigger_not_equals} ${u}</span>`:h}
          ${e.trigger_for_minutes?o`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${a("for_minutes",t)}: ${e.trigger_for_minutes}</span>`:h}
        `:h}
        ${g==="state_change"?o`
          ${e.trigger_target_changes!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("target_changes",t)}: ${e.trigger_target_changes}</span>`:h}
        `:h}
        ${g==="runtime"?o`
          ${e.trigger_runtime_hours!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("runtime_hours",t)}: ${e.trigger_runtime_hours}h</span>`:h}
        `:h}
        ${g==="due_date"?o`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("days_before",t)}: ${e.trigger_days_before??0}</span>
        `:h}
        ${g==="compound"?o`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${a("compound_logic",t)}: ${e.compound_logic||e.operator||"AND"}</span>
          ${(e.conditions||[]).map((x,T)=>o`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${T+1}. ${a(x.type==="due_date"?"trigger_type_due_date":x.type||"unknown",t)}: ${Nt(x).map((v,k)=>o`${k>0?", ":""}<span class="entity-link" @click=${w=>mt(w,v)}>${v}</span>`)}</span>
          `)}
        `:h}
      </div>

      ${s&&s.length>1?o`
        <div class="trigger-entity-list">
          ${s.map(x=>o`
            <span class="trigger-entity-id">${x.friendly_name} (<span class="entity-link" @click=${T=>mt(T,x.entity_id)}>${x.entity_id}</span>)</span>
          `)}
        </div>
      `:h}

      ${Kr(n,u,l)}
    </div>
  `}function oo(n,l){n.preventDefault(),history.pushState(null,"",`/history?entity_id=${l.map(encodeURIComponent).join(",")}`),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}var Hi=88,Rt=28,lo=48;function co(n,l,e=null){if(!n||n.length<2)return h;let t=e!==null&&Number.isFinite(e)&&n[n.length-1].ts<Date.now()?[...n,{ts:Date.now(),val:e}]:n,i=Math.max(1,Math.ceil(t.length/lo)),s=[];for(let y=0;y<t.length;y+=i)s.push(t[y]);s[s.length-1]!==t[t.length-1]&&s.push(t[t.length-1]);let r=(l.type||"threshold")==="threshold"?[l.trigger_above,l.trigger_below].filter(y=>typeof y=="number"):[],c=s.map(y=>y.val),d=Math.min(...c),u=Math.max(...c),p=u-d||Math.abs(u)||1,g=r.filter(y=>y>=d-2*p&&y<=u+2*p);for(let y of g)d=Math.min(d,y),u=Math.max(u,y);let m=u-d||1,b=s[0].ts,x=s[s.length-1].ts,T=y=>x===b?0:(y-b)/(x-b)*(Hi-2)+1,v=y=>Rt-2-(y-d)/m*(Rt-4),k=s.map((y,D)=>`${D?"L":"M"}${M(T(y.ts))},${M(v(y.val))}`).join(" "),w=s[s.length-1].val,E=l.trigger_above!=null&&w>l.trigger_above||l.trigger_below!=null&&w<l.trigger_below;return o`<svg class="sensor-trend ${E?"past":""}" viewBox="0 0 ${Hi} ${Rt}" width=${Hi} height=${Rt}
    preserveAspectRatio="none" aria-hidden="true">
    ${g.map(y=>K`<line class="sensor-trend-limit" x1="0" x2=${Hi} y1=${M(v(y))} y2=${M(v(y))}></line>`)}
    <path class="sensor-trend-area" d=${`${k} L${M(T(x))},${Rt} L${M(T(b))},${Rt} Z`}></path>
    <path class="sensor-trend-line" d=${k}></path>
  </svg>`}function po(n,l,e){let t=l.lang,i=l.hass,s=i?.states?.[n.entityId],r=(e.trigger_entity_infos||[]).find(m=>m.entity_id===n.entityId)??(e.trigger_entity_info?.entity_id===n.entityId?e.trigger_entity_info:void 0),c=s?.attributes?.unit_of_measurement??r?.unit_of_measurement??"",d=s?.attributes?.friendly_name||r?.friendly_name||n.entityId,u=i,p="\u2014";s&&(n.cond.attribute?p=u?.formatEntityAttributeValue?.(s,n.cond.attribute)??String(s.attributes?.[n.cond.attribute]??"\u2014"):p=u?.formatEntityState?.(s)??`${s.state}${c?` ${c}`:""}`);let g=m=>mt(m,n.entityId);return o`
    <div class="sensor-row" role="button" tabindex="0" data-entity=${n.entityId} title=${d}
      @click=${g}
      @keydown=${m=>{(m.key==="Enter"||m.key===" ")&&(m.preventDefault(),g(m))}}>
      ${s&&customElements.get("state-badge")?o`<state-badge class="sensor-badge" .hass=${i} .stateObj=${s} stateColor></state-badge>`:o`<ha-icon class="sensor-badge" icon=${s?.attributes?.icon||"mdi:eye"}></ha-icon>`}
      <div class="sensor-info">
        <div class="sensor-name">${d}</div>
        <div class="sensor-cond">${ki(n.cond,c,t)}</div>
      </div>
      ${co(l.detailStatsData.get(n.entityId),n.cond,s?parseFloat(String(n.cond.attribute?s.attributes?.[n.cond.attribute]:s.state)):null)}
      <div class="sensor-state">${p}</div>
    </div>
  `}function ho(n,l){let e=n.trigger_config,t=l.lang,i=xt(e),s=[...new Set(i.map(g=>g.entityId))],r=tt(l.hass,n),c=Ur(n,r,l),d=e.type==="compound"?(e.conditions||[]).length:s.length,u=e.type==="compound"?(e.compound_logic||"AND")==="AND":e.entity_logic==="all",p=d>1?a(u?"beta_rules_all_of":"beta_rules_any_of",t).split("{n}").join(String(d)):"";return o`
    <div class="trigger-card sensor-rule">
      <div class="sensor-rule-head">
        <div class="sensor-rule-title">
          <span>${a("beta_sensor_rule",t)}</span>
          ${p?o`<span class="sensor-rule-sub">${p}</span>`:h}
        </div>
        <span class="status-badge ${n.trigger_active?"triggered":"ok"}">
          ${n.trigger_active?a("triggered",t):a("ok",t)}
        </span>
      </div>
      <div class="sensor-rows">${i.map(g=>po(g,l,n))}</div>
      ${c?Wr(c,t):h}
      ${Kr(n,r,l)}
      ${s.length?o`<div class="sensor-rule-foot">
            <a class="sensor-rule-more" href=${`/history?entity_id=${s.map(encodeURIComponent).join(",")}`}
              @click=${g=>oo(g,s)}>${a("beta_show_history",t)}</a>
          </div>`:h}
    </div>
  `}function Ur(n,l,e){let t=n.trigger_config,i=n.trigger_current_value;if(!t||i==null)return null;switch(t.type||"threshold"){case"counter":{let s=t.trigger_target_value;if(s==null||s<=0)return null;if(!t.trigger_delta_mode)return{progress:Math.max(0,i),target:s,unit:l,meter:null};let r=Vr(n,Gr(n,e));return{progress:Math.max(0,i-(r?.value??i)),target:s,unit:l,meter:i}}case"state_change":{let s=t.trigger_target_changes;return s==null||s<=0?null:{progress:Math.max(0,i),target:s,unit:"",meter:null}}case"runtime":{let s=t.trigger_runtime_hours;return s==null||s<=0?null:{progress:Math.max(0,i),target:s,unit:"h",meter:null}}}return null}function Vr(n,l){if(n.trigger_baseline_value!=null)return{value:n.trigger_baseline_value,ts:Li(n)};if(!l.length)return null;let e=Li(n);if(e==null)return{value:l[0].val,ts:null};let t=l[0],i=Math.abs(l[0].ts-e);for(let s of l){let r=Math.abs(s.ts-e);r<i&&(t=s,i=r)}return{value:t.val,ts:e}}function Li(n){let l=[...n.history].filter(e=>e.type==="completed"||e.type==="reset").sort((e,t)=>Ee(t.timestamp)-Ee(e.timestamp))[0];return l?Ee(l.timestamp):null}function Wr(n,l){let e=Math.min(999,Math.round(n.progress/n.target*100)),t=e>=100?"over":e>=75?"near":"ok";return o`
    <div class="counter-progress">
      <div class="counter-progress-nums">
        <span class="counter-progress-main">${xe(n.progress,"",l)}<span class="counter-progress-target"> / ${xe(n.target,n.unit,l)}</span></span>
        <span class="counter-progress-pct ${t}">${e} %</span>
      </div>
      <div class="counter-progress-bar" role="progressbar" aria-valuenow=${e} aria-valuemin="0" aria-valuemax="100">
        <div class="counter-progress-fill ${t}" style="width:${Math.min(100,e)}%"></div>
      </div>
      <div class="counter-progress-caption">
        ${a("chart_since_service",l)}${n.meter!=null?o` · ${a("current",l)}: ${xe(n.meter,n.unit,l)}`:h}
      </div>
    </div>
  `}function Gr(n,l){let e=n.trigger_config;if(!e)return[];let t=e.type||"threshold",i=Ce(e)||"",s=t==="runtime"?[]:l.detailStatsData.get(i)||[],r=l.isCounterEntity(e),c=[];if(s.length>=2)for(let u of s){let p={ts:u.ts,val:u.val};!r&&u.min!=null&&u.max!=null&&(p.min=u.min,p.max=u.max),c.push(p)}else for(let u of n.history)u.trigger_value!=null&&c.push({ts:Ee(u.timestamp),val:u.trigger_value});let d=!!i&&!!l.historyFallbackIds?.has(i)&&s.length>=2;return n.trigger_current_value!=null&&!d&&c.push({ts:Date.now(),val:n.trigger_current_value}),c.sort((u,p)=>u.ts-p.ts),c}function Kr(n,l,e){let t=n.trigger_config;if(!t)return h;let i=t.type||"threshold",s=Ce(t)||"";if(i==="due_date")return h;let r=Gr(n,e),c=null;i==="state_change"&&s&&e.historyFallbackIds?.has(s)&&(c=ro(r,t,{since:Li(n),current:n.trigger_current_value??null}),c&&(r=c.points)),i==="runtime"&&t.trigger_runtime_hours&&n.trigger_current_value!=null&&(r=[{ts:Li(n)??r[0]?.ts??Date.now()-864e5,val:0},{ts:Date.now(),val:Math.max(0,n.trigger_current_value)}]),e.hideOutliers&&(r=no(r));let d=r.length<2&&!!s&&e.hasStatsService&&!e.detailStatsData.has(s);if(r.length<2&&!d)return h;let u=!!s&&e.detailStatsData.has(s)&&(e.detailStatsData.get(s)?.length??0)<2;if(pe()&&i==="state_change"&&u&&!(s&&e.historyFallbackIds?.has(s)))return h;let p=Date.now()-e.rangeDays*864e5,g=r.filter(E=>E.ts>=p);g.length>=2&&(r=g);let m=null,b="\u25C6",x=!1;if(i==="threshold"&&t.trigger_above==null&&t.trigger_below==null&&(t.trigger_equals!=null||t.trigger_not_equals!=null))m=t.trigger_equals??t.trigger_not_equals??null,b=t.trigger_equals!=null?"=":"\u2260";else if(i==="counter"&&t.trigger_target_value!=null&&r.length){if(t.trigger_delta_mode){let E=Vr(n,r);if(E){if(E.ts!=null){let y=r.filter(D=>D.ts>=E.ts);y.length>=2&&(r=y)}r=r.map(y=>({...y,val:Math.max(0,y.val-E.value)}))}}m=t.trigger_target_value,x=!0}else i==="state_change"&&t.trigger_target_changes&&c?.mode!=="alarm"?(m=t.trigger_target_changes,x=!0):i==="runtime"&&t.trigger_runtime_hours&&(m=t.trigger_runtime_hours,x=!0);let T=null,v=n.degradation_rate,k=v!=null&&(t.trigger_below!=null&&t.trigger_above==null&&v>0||t.trigger_above!=null&&t.trigger_below==null&&v<0);if(m==null&&v!=null&&!k&&(n.degradation_trend!=="stable"||n.days_until_threshold!=null)&&n.degradation_trend!=="insufficient_data"&&r.length>=2){let E=r[r.length-1];T=[E,{ts:E.ts+30*864e5,val:E.val+v*30}]}let w=n.history.filter(E=>["completed","skipped","reset"].includes(E.type)).map(E=>({ts:Ee(E.timestamp),type:E.type}));return o`
    <maintenance-trigger-chart
      .points=${d?[]:r}
      .events=${w}
      .unit=${l}
      .lang=${e.lang}
      .thresholdAbove=${i==="threshold"?t.trigger_above??null:null}
      .thresholdBelow=${i==="threshold"?t.trigger_below??null:null}
      .targetValue=${m}
      .targetMark=${b}
      .forceZero=${x}
      .projection=${T}
      .rangeDays=${e.rangeDays}
      .hideOutliers=${e.hideOutliers}
      .busy=${d}
      @range-change=${E=>e.setRangeDays(E.detail.days)}
      @outlier-toggle=${E=>e.setHideOutliers(E.detail.hide)}
    ></maintenance-trigger-chart>
    ${d?h:s&&e.historyFallbackIds?.has(s)&&!u?o`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${a(c?.mode==="alarm"?"chart_history_alarm":c?.mode==="count"?"chart_history_count":"chart_history_fallback",e.lang)}
        </div>`:u?o`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${a("chart_no_stats",e.lang)}
        </div>`:h}
  `}var uo=200,Yt=10,mo=22;function Yr(n,l,e,t,i){let s=n.history.filter(d=>d.type==="completed"&&(qe(d)!=null||d.duration!=null));if(s.length<2)return h;let r=s.some(d=>(qe(d)??0)!==0),c=s.some(d=>(d.duration??0)>0);return!r&&!c?h:o`
    <div class="cost-duration-card">
      <div class="card-header">
        <h3>${a("cost_duration_chart",l)}</h3>
        <div class="toggle-buttons">
          ${r?o`<button
            class="toggle-btn ${e==="cost"?"active":""}"
            @click=${()=>t("cost")}>
            ${a("cost",l)}
          </button>`:h}
          ${r&&c?o`<button
            class="toggle-btn ${e==="both"?"active":""}"
            @click=${()=>t("both")}>
            ${a("both",l)}
          </button>`:h}
          ${c?o`<button
            class="toggle-btn ${e==="duration"?"active":""}"
            @click=${()=>t("duration")}>
            ${a("duration",l)}
          </button>`:h}
        </div>
      </div>
      ${_o(n,l,e,i)}
    </div>
  `}function _o(n,l,e,t){let i=n.history.filter(A=>A.type==="completed"&&(qe(A)!=null||A.duration!=null)).map(A=>({ts:Ee(A.timestamp),cost:qe(A)??0,duration:A.duration??0})).sort((A,se)=>A.ts-se.ts);if(i.length<2)return h;let s=i.some(A=>A.cost!==0),r=i.some(A=>A.cost<0),c=i.some(A=>A.duration>0);if(!s&&!c)return h;let d=e!=="duration"&&s,u=e!=="cost"&&c,p=d||!u&&s,g=u||!d&&c,m=640,b=uo,x=p?44:12,T=g?44:12,v=m-x-T,k=b-mo,w=k-Yt,E=i[0].ts,y=i[i.length-1].ts,D=(y-E||864e5)*.05,re=E-D,C=y+D,R=Ua(E,y),B=A=>x+(A-re)/(C-re)*v,V=Math.min(0,...i.map(A=>A.cost)),z=Math.max(0,...i.map(A=>A.cost)),Q=Vt(V,z>V?z:V+1,3),J=Vt(0,Math.max(...i.map(A=>A.duration))||1,3),ee=Q.niceMax-Q.niceMin||1,O=A=>Yt+(1-(A-Q.niceMin)/ee)*w,Z=A=>Yt+(1-A/(J.niceMax||1))*w,ue=i.length>1?Math.min(...i.slice(1).map((A,se)=>B(A.ts)-B(i[se].ts))):v,at=Math.max(6,Math.min(22,ue*.55)),ce=xi(E,y,Math.max(2,Math.min(4,i.length)));return o`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${m} ${b}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${a("chart_history",l)}">
        ${p?Q.ticks.map(A=>{let se=O(A);return se<Yt-1||se>k+1?h:K`
            <line x1="${x}" y1="${M(se)}" x2="${m-T}" y2="${M(se)}" stroke="var(--divider-color)" stroke-width="1" opacity="0.55" />
            <text x="${x-6}" y="${M(se+3.5)}" text-anchor="end" fill="var(--primary-color)" font-size="10.5">${Ve(A,l)}${t}</text>`}):h}
        ${g?J.ticks.map(A=>{let se=Z(A);return se<Yt-1||se>k+1?h:K`<text x="${m-T+6}" y="${M(se+3.5)}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="10.5">${Ve(A,l)}m</text>`}):h}

        ${p&&Q.niceMin<0?K`
          <line class="cost-zero" x1="${x}" y1="${M(O(0))}" x2="${m-T}" y2="${M(O(0))}" stroke="var(--secondary-text-color)" stroke-width="1" opacity="0.7" />
        `:h}
        ${p?i.filter(A=>A.cost!==0).map(A=>{let se=O(Math.max(A.cost,0)),Ct=A.cost<0;return K`
          <rect class="${Ct?"credit-bar":"cost-bar"}" x="${M(B(A.ts)-at/2)}" y="${M(se)}" width="${M(at)}" height="${M(O(Math.min(A.cost,0))-se)}"
            fill="${Ct?"var(--success-color, #4caf50)":"var(--primary-color)"}" opacity="0.6" rx="2">
            <title>${yi(A.ts,l,!0)}: ${Ct?`${a("cost_kind_credit",l)} `:""}${Y(Math.abs(A.cost),t,l)}${A.duration?` \xB7 ${A.duration}m`:""}</title>
          </rect>`}):h}
        ${g?K`
          <polyline points="${i.map(A=>`${M(B(A.ts))},${M(Z(A.duration))}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${i.map(A=>K`
            <circle cx="${M(B(A.ts))}" cy="${M(Z(A.duration))}" r="3.5" fill="var(--accent-color, #ff9800)">
              <title>${yi(A.ts,l,!0)}: ${A.duration}m${A.cost?` \xB7 ${Y(A.cost,t,l)}`:""}</title>
            </circle>
          `)}
        `:h}

        <line x1="${x}" y1="${k}" x2="${m-T}" y2="${k}" stroke="var(--divider-color)" stroke-width="1" />
        ${ce.map((A,se)=>{let Ct=se===0?"start":se===ce.length-1?"end":"middle";return K`<text x="${M(B(A))}" y="${b-6}" text-anchor="${Ct}" fill="var(--secondary-text-color)" font-size="10">${yi(A,l,R)}</text>`})}
      </svg>
    </div>
    <div class="chart-legend">
      ${p?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${a("cost",l)}</span>`:h}
      ${p&&r?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50);opacity:0.6"></span>${a("cost_kind_credit",l)}</span>`:h}
      ${g?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${a("duration",l)}</span>`:h}
    </div>
  `}var go={ok:"mdi:check-circle-outline",due_soon:"mdi:calendar-clock",overdue:"mdi:calendar-alert",triggered:"mdi:alert-circle-outline",paused:"mdi:pause-circle-outline",archived:"mdi:archive-outline"},en={completed:"mdi:check-circle",skipped:"mdi:debug-step-over",missed:"mdi:calendar-remove",reset:"mdi:restore",triggered:"mdi:alert-circle-outline",trigger_removed:"mdi:link-off",trigger_replaced:"mdi:swap-horizontal",updated:"mdi:file-replace-outline"},tn=new Set(["completed","skipped","reset"]),fo=new Set(ea),sn="Sensor trigger activated",bo={counted:"beta_trace_dw_counted",waiting:"beta_trace_dw_waiting",left_early:"beta_trace_dw_left_early",not_due:"beta_trace_dw_not_due",inert:"beta_trace_dw_inert",recent:"beta_trace_dw_recent"},vo={done:"beta_trace_cleared_done",status_left:"beta_trace_cleared_status",inert:"beta_trace_cleared_inert"};function N(n){return typeof n=="string"?n:n==null?"":String(n)}function Se(n,l){return Object.entries(l).reduce((e,[t,i])=>e.split(`{${t}}`).join(i),n)}function Bi(n,l){return n?a(n,l):"\u2014"}function Cs(n){return n.replace(/\s*[(（][^)）]*[)）]\s*$/,"").trim()}function ct(n,l){let e=Math.max(1,Math.round(n/6e4));if(e<60)return je(e,"minute",l);let t=Math.round(n/36e5);return t<48?je(t,"hour",l):je(Math.round(n/864e5),"day",l)}function yo(n,l){let e=l;switch(n.kind){case"status":{let t=N(n.from),i=N(n.to);return{at:n.at,icon:go[i]??"mdi:information-outline",text:`${Bi(t,e)} \u2192 ${Bi(i,e)}`,tone:"status",details:[],group:`status:${t}>${i}`,watch:t==="triggered"||i==="triggered"?"rule":void 0}}case"reminder":{if(n.reminder==="lead"){let i=Number(n.days);return{at:n.at,icon:"mdi:bell-outline",text:Se(a("beta_trace_reminder_lead",e),{interval:Number.isFinite(i)?je(i,"day",e):"\u2014"}),tone:"info",details:[],group:`reminder:lead:${N(n.days)}`}}let t=n.reminder==="bundle";return{at:n.at,icon:"mdi:bell-ring-outline",text:Se(a("beta_trace_reminder",e),{status:Bi(N(n.status),e)}),tone:"info",details:t?[{label:a("beta_trace_message",e),value:a("beta_trace_bundle",e)}]:[],group:`reminder:${N(n.reminder)}:${N(n.status)}`}}case"reminder_cleared":return{at:n.at,icon:"mdi:bell-off-outline",text:a(vo[N(n.reason)]??"beta_trace_cleared_done",e),tone:"info",details:[],group:`cleared:${N(n.reason)}`};case"snoozed":{let t=Number(n.hours);return{at:n.at,icon:"mdi:alarm-snooze",text:Se(a("beta_trace_snoozed",e),{time:ye(N(n.until),e)}),tone:"info",details:Number.isFinite(t)&&t>0?[{label:a("duration",e),value:je(t,"hour",e)}]:[],group:`snoozed:${N(n.until)}`}}case"done_when":{let t=N(n.result),i=Number(n.minutes),s=N(n.entity)||"\u2014",r=N(n.state)||"\u2014",c=[{label:Cs(a("complete_when",e)),value:`${s} \u2192 ${r}`}];return t==="not_due"&&N(n.status)&&c.push({label:a("report_col_status",e),value:Bi(N(n.status),e)}),{at:n.at,icon:t==="counted"?"mdi:check-circle-outline":t==="waiting"?"mdi:timer-sand":"mdi:cancel",text:Se(a(bo[t]??"beta_trace_dw_not_due",e),{entity:s,state:r,duration:Number.isFinite(i)&&i>0?je(i,"minute",e):"\u2014"}),tone:t==="counted"?"done":t==="waiting"?"info":"skipped",details:c,group:`done_when:${t}:${s}:${r}`,watch:"done_when"}}case"edited":{let t=Array.isArray(n.fields)?n.fields.map(N).filter(Boolean):[],i=Se(a("beta_trace_edited",e),{fields:xo(t,e)||"\u2014"}),s={};if(Ni(n.changes))for(let[r,c]of Object.entries(n.changes))Array.isArray(c)&&c.length===2&&(s[r]=[c[0],c[1]]);return{at:n.at,icon:"mdi:pencil-outline",text:i,tone:"info",details:[],group:`edited:${n.at}`,changes:s}}case"trigger_cleared":{let t=N(n.installed),i=N(n.state),s=typeof n.value=="number"&&Number.isFinite(n.value)?n.value:null,r=t?Se(a("beta_trace_trigger_cleared_update",e),{installed:t}):i?Se(a("beta_trace_trigger_cleared_state",e),{state:i}):s!==null?Se(a("beta_trace_trigger_cleared_value",e),{value:W(s,e,{maximumFractionDigits:3})}):a("beta_trace_trigger_cleared",e),c=N(n.entity)?[{label:a("beta_sensor_rule",e),value:N(n.entity)}]:[];return{at:n.at,icon:"mdi:alert-circle-check-outline",text:r,tone:"status",details:c,group:`trigger_cleared:${N(n.entity)}:${i||t}`,watch:"rule"}}default:return{at:n.at,icon:"mdi:information-outline",text:n.kind,tone:"info",details:[],group:`kind:${n.kind}`}}}var an={name:"task_name",type:"maintenance_type",enabled:"task_enabled",schedule:"schedule_type",schedule_type:"schedule_type",interval_days:"interval",interval_unit:"interval",interval_anchor:"interval_anchor",due_date:"due_date",due_override:"postponed",last_performed:"last_performed",warning_days:"warning_days",earliest_completion_days:"earliest_completion_days",schedule_time:"schedule_time_toggle",trigger_config:"beta_sensor_rule",complete_when:"complete_when",notes:"notes_label",documentation_url:"documentation_url_label",custom_icon:"custom_icon_optional",priority:"priority",labels:"labels",checklist:"checklist",phases:"phases_section",phase_sequence:"phases_section",reading_unit:"reading_unit_label",readings:"readings_section",responsible_user_id:"responsible_user",assignee_pool:"task_shared_with",rotation_strategy:"rotation_strategy",nfc_tag_id:"nfc_tag_id",require_tag_scan:"require_tag_scan",allow_skip:"disallow_skip",on_complete_action:"on_complete_action_title",quick_complete_defaults:"qr_action_quick_complete",consumes_parts:"consumes_parts_label",notify_icon:"notify_icon",mirror_todo_entities:"task_mirror_todo",mirror_todo_use_default:"task_mirror_todo",adaptive_config:"adaptive_enabled"};function xo(n,l){let e=[],t=!1;for(let i of n){let s=an[i];if(!s){t=!0;continue}let r=Cs(a(s,l));r&&!e.includes(r)&&e.push(r)}return t&&e.push(a("beta_trace_edited_other",l)),e.join(", ")}function Ni(n){return!!n&&typeof n=="object"&&!Array.isArray(n)}var Qr=/^[a-z_]+\.[a-z0-9_]+$/;function Xr(n,l){return n.length>l?`${n.slice(0,l-1)}\u2026`:n}function wo(n,l){let e=l.lang;if(n.type==="compound"){let s=String((n.conditions||[]).length);return a((n.compound_logic||"AND")==="AND"?"beta_rules_all_of":"beta_rules_any_of",e).split("{n}").join(s)}let t=Nt(n).map(l.entityName).join(", "),i=ki(n,l.unit,e);return t?`${t}: ${i}`:i}function Jr(n,l,e){let t=e.lang;if(l==null||l===""||Array.isArray(l)&&!l.length)return"\u2014";switch(n){case"schedule":return Ni(l)?Re({schedule:l},t):"\u2014";case"trigger_config":return Ni(l)?wo(l,e):"\u2014";case"complete_when":return Ni(l)&&typeof l.entity_id=="string"?`${e.entityName(l.entity_id)} \u2192 ${N(l.to_state)||"\u2014"}`:"\u2014";case"interval_days":case"warning_days":case"earliest_completion_days":return typeof l=="number"?je(l,"day",t):N(l);case"responsible_user_id":return typeof l=="string"?e.userName(l)??l:"\u2014";case"assignee_pool":return Array.isArray(l)?l.map(i=>typeof i=="string"?e.userName(i)??i:N(i)).join(", "):"\u2014";case"due_date":case"due_override":case"last_performed":return typeof l=="string"?U(l,t):"\u2014";case"priority":return a(`priority_${N(l)}`,t);case"type":return a(N(l),t)}return typeof l=="boolean"?l?"\u2713":"\u2717":typeof l=="number"?W(l,t):typeof l=="string"?Qr.test(l)?e.entityName(l):Xr(l,60):Array.isArray(l)&&l.every(i=>i===null||typeof i!="object")?Xr(l.map(i=>typeof i=="string"&&Qr.test(i)?e.entityName(i):N(i)).join(", "),80):"\u2026"}function rn(n,l){if(!n)return[];let e=[];for(let[t,[i,s]]of Object.entries(n)){let r=an[t];r&&e.push({label:Cs(a(r,l.lang)),value:`${Jr(t,i,l)} \u2192 ${Jr(t,s,l)}`})}return e}function nn(n,l,e=20){let t=[];for(let[i,s]of Object.entries(n??{}))for(let r of s??[]){let c=r.lu??r.lc,d=typeof c=="number"?c*1e3:Date.parse(r.last_updated??r.last_changed??""),u=r.s??r.state;Number.isFinite(d)&&typeof u=="string"&&t.push({at:d,entityId:i,state:u})}return t.sort((i,s)=>Math.abs(i.at-l)-Math.abs(s.at-l)).slice(0,e).sort((i,s)=>i.at-s.at)}function on(n,l,e){let t=n.completed_by?l(n.completed_by):null;if(!t)return null;let i=n.completed_via?l(n.completed_via):null;return{label:a("completed_by",e),value:i?Se(a("completed_via",e),{person:t,device:i}):t}}function ko(n,l){let e=l,t=[],i=n.checklist_state&&typeof n.checklist_state=="object"?Object.values(n.checklist_state):[];return i.length&&t.push({label:a("checklist",e),value:`${i.filter(Boolean).length}/${i.length}`}),n.feedback&&t.push({label:a("was_maintenance_needed",e),value:a(`feedback_${n.feedback}`,e)}),t}function $o(n,l,e={}){let t=N(n.type),i=N(n.notes).trim(),r=t==="triggered"&&i===sn?"":kt(i,l).trim(),c=r.length>80?`${r.slice(0,79)}\u2026`:r,d=c?`${a(t,l)} \xB7 ${c}`:a(t,l),u=t==="triggered"?tr(n,l,{unit:e.triggerUnit,stateRule:e.stateRule}):"";return{at:N(n.timestamp),icon:en[t]??"mdi:history",text:u?`${d} \xB7 ${u}`:d,tone:tn.has(t)?"done":t==="triggered"?"status":"info",details:ko(n,l),group:t==="triggered"||t==="missed"?`history:${t}:${i}`:`history:${t}:${N(n.timestamp)}`,foldText:d,history:n,watch:t==="triggered"?"rule":void 0}}function ln(n){return N(n.type)==="triggered"&&N(n.notes).trim()===sn?{...n,notes:null}:n}function be(n){let l=Date.parse(n);return Number.isFinite(l)?l:0}var To=new Set(["status","reminder_cleared"]),Es=6e4,Rs="self_ended",So=new Set(["ok","due_soon"]);function jo(n){let l=[];for(let t of n){let i=l[l.length-1];if(i&&i.group===t.group){i.repeats||(i.repeats=[{...i}]),i.repeats.push(t);continue}l.push(t)}let e=null;for(let t of l)t.gapMs=e===null?null:be(t.at)-be(e),e=t.repeats?t.repeats[t.repeats.length-1].at:t.at;return l}function cn(n,l,e,t={}){let i=[],s=0;for(let m of n)!m||typeof m.at!="string"||typeof m.kind!="string"||i.push({item:yo(m,e),ends:!1,kind:m.kind,order:s++,type:""});for(let m of l){if(!m||typeof m.timestamp!="string")continue;let b=N(m.type);i.push({item:$o(m,e,t),ends:tn.has(b),kind:`history:${b}`,order:s++,type:b})}i.sort((m,b)=>be(m.item.at)-be(b.item.at)||m.order-b.order);let r=null;for(let m of i)m.kind==="status"&&(r&&r.details.push({label:a("duration",e),value:ct(be(m.item.at)-be(r.at),e)}),r=m.item);let c=[],d=[],u,p=-1/0,g=-1/0;for(let m of i){let b=be(m.item.at),x=!1,T=u;if(m.kind==="trigger_cleared"&&(g=b),m.kind==="status"){let k=m.item.group,w=k.slice(7,k.indexOf(">")),E=k.slice(k.indexOf(">")+1);x=w==="triggered"&&So.has(E)&&(b-g<=Es||b-p>Es),T=u,fo.has(E)?u??=m.item.at:u=void 0}m.kind.startsWith("history:")&&(p=b);let v=c[c.length-1];if(!d.length&&v&&To.has(m.kind)&&be(m.item.at)-be(v.end)<=Es){v.items.push(m.item);continue}d.push(m.item),(m.ends||x)&&(c.push({start:d[0].at,end:m.item.at,closed:!0,items:d,endType:m.ends?m.type:Rs,since:v?.end,dueAt:m.ends?u:T}),d=[])}d.length&&c.push({start:d[0].at,end:d[d.length-1].at,closed:!1,items:d,since:c[c.length-1]?.end,dueAt:u});for(let m of c)m.items=jo(m.items);return c}function Eo(n){return n.items.flatMap(l=>l.repeats??[l]).filter(l=>l.group.startsWith("status:"))}function Zr(n,l){return n.items.flatMap(e=>e.repeats??[e]).filter(e=>e.group.startsWith(l)).length}function dn(n,l,e=Date.now()){let t=l,i=Eo(n),s=g=>g.slice(g.indexOf(">")+1),r=n.dueAt,c=[];if(n.closed){if(n.endType===Rs&&r&&c.push(Se(a("beta_trace_triggered_for",t),{span:ct(be(n.end)-be(r),t)})),n.endType==="completed"){let g=r?be(n.end)-be(r):0;r&&g>=6e4?c.push(Se(a("beta_trace_after_due",t),{span:ct(g,t)})):i.some(m=>s(m.group)==="due_soon")&&c.push(a("beta_trace_before_due",t))}n.since&&c.push(Se(a("beta_trace_cycle_length",t),{span:ct(be(n.end)-be(n.since),t)}))}else r&&c.push(Se(a("beta_trace_due_for",t),{span:ct(e-be(r),t)}));let d=Zr(n,"reminder:");d&&c.push(ne("beta_trace_reminders","beta_trace_reminders_one",d,t));let u=Zr(n,"snoozed:");if(u&&c.push(ne("beta_trace_snoozes","beta_trace_snoozes_one",u,t)),!n.closed)return{text:a("beta_trace_running",t),icon:"mdi:progress-clock",tone:"info",facts:c};if(n.endType===Rs)return{text:`${a("beta_trace_cycle_self_ended",t)} \xB7 ${ye(n.end,t)}`,icon:"mdi:alert-circle-check-outline",tone:"status",facts:c};let p=n.endType??"completed";return{text:`${a(p,t)} \xB7 ${ye(n.end,t)}`,icon:en[p]??"mdi:check-circle",tone:"done",facts:c}}var Ro="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",Co="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z",Oo="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z",Mo=60*6e4,Ao=15*6e4,Do=6e4,he=class extends L{constructor(){super(...arguments);this.entryId="";this.taskId="";this.task=null;this.currencySymbol="\u20AC";this.taskRef=null;this.userName=()=>null;this._enabled=!0;this._cycles=null;this._index=-1;this._sel=-1;this._failed=!1;this._raw=null;this._activity=new Map;this._loadedFor=""}updated(){let e=`${this.entryId}/${this.taskId}`;this.hass&&this.entryId&&this.taskId&&e!==this._loadedFor&&(this._loadedFor=e,this._load())}async _load(){this._cycles=null,this._failed=!1,this._index=-1,this._sel=-1,this._raw=null,this._activity=new Map;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/trace",entry_id:this.entryId,task_id:this.taskId});this._raw=e??{},this._enabled=e?.enabled!==!1,this._cycles=cn(e?.events??[],e?.history??[],F(this.hass),{triggerUnit:tt(this.hass,this.task)||void 0,stateRule:Ft(this.task)})}catch{this._failed=!0,this._cycles=[]}}_current(){let e=this._cycles??[];if(!e.length)return{cycle:null,index:-1};let t=this._index<0||this._index>=e.length?e.length-1:this._index;return{cycle:e[t],index:t}}_step(e){let{index:t}=this._current(),i=t+e;this._cycles&&i>=0&&i<this._cycles.length&&(this._index=i,this._sel=-1)}render(){let e=F(this.hass);if(this._cycles===null)return o`<div class="trace-note">…</div>`;let{cycle:t,index:i}=this._current(),s=this._cycles.length,r=t?`${ye(t.start,e)} \u2013 ${t.closed?ye(t.end,e):a("beta_trace_current",e)}`:a("beta_trace_current",e);return o`
      ${this._enabled?h:o`<div class="trace-note trace-off">${a("beta_trace_off",e)}</div>`}
      ${this._failed?o`<div class="trace-note">${a("beta_trace_load_failed",e)}</div>`:h}
      <div class="trace-cycles">
        <ha-icon-button class="trace-older" .path=${Ro} .label=${a("beta_trace_older",e)} .disabled=${i<=0}
          @click=${()=>this._step(-1)}></ha-icon-button>
        <span class="trace-cycle-label">${r}</span>
        <ha-icon-button class="trace-newer" .path=${Co} .label=${a("beta_trace_newer",e)} .disabled=${i<0||i>=s-1}
          @click=${()=>this._step(1)}></ha-icon-button>
        <ha-icon-button class="trace-download" .path=${Oo} .label=${a("beta_trace_download",e)} .disabled=${!this._raw}
          @click=${()=>this._download()}></ha-icon-button>
      </div>
      ${!t||!t.items.length?o`<div class="trace-note">${a("beta_trace_empty",e)}</div>`:o`
          ${this._renderResult(t,e)}
          <ol class="trace-steps" aria-label=${a("beta_trace",e)}>
            ${t.items.map((c,d)=>this._renderStep(c,d,t.items[d+1],`${i}:${d}`,e))}
          </ol>`}
    `}_renderResult(e,t){let i=dn(e,t);return o`
      <div class="trace-result ${i.tone}">
        <ha-icon icon=${i.icon}></ha-icon>
        <span class="trace-result-text">${i.text}</span>
        ${i.facts.map(s=>o`<span class="trace-fact">${s}</span>`)}
      </div>`}_renderStep(e,t,i,s,r){let c=this._sel===t,d=e.repeats?.length??0,u=d?e.repeats[d-1]:e,p=e.gapMs!=null&&e.gapMs>=Do?a("beta_trace_later",r).replace("{span}",ct(e.gapMs,r)):"";return o`
      <li class="trace-item ${e.tone} ${i?.tone==="skipped"?"next-skipped":""}">
        <button type="button" class="trace-step ${e.tone} ${c?"selected":""}" aria-expanded=${c?"true":"false"}
          @click=${()=>this._toggle(e,t,s)}>
          <span class="trace-node ${e.tone}"><ha-icon icon=${e.icon}></ha-icon></span>
          <span class="trace-main">
            <span class="trace-time">
              ${ye(e.at,r)}${d?o` – ${ye(u.at,r)}`:h}
              ${p?o`<span class="trace-gap">${p}</span>`:h}
            </span>
            <span class="trace-text">${d?e.foldText??e.text:e.text}${d?o` <span class="trace-count">×${d}</span>`:h}</span>
          </span>
          <ha-icon class="trace-chevron" icon=${c?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        ${c?this._renderDetails(e,s,r):h}
      </li>`}_toggle(e,t,i){if(this._sel===t){this._sel=-1;return}this._sel=t;let s=this._watched(e);s.length&&!this._activity.has(i)&&this._loadActivity(i,e,s)}_watched(e){let t=this.task;return e.watch==="rule"&&t?.trigger_config?[...new Set(xt(t.trigger_config).map(i=>i.entityId))]:e.watch==="done_when"&&t?.complete_when?.entity_id?[t.complete_when.entity_id]:[]}async _loadActivity(e,t,i){this._activity=new Map(this._activity).set(e,"loading");let s=Date.parse((t.repeats?t.repeats[t.repeats.length-1]:t).at),r;try{let c=await this.hass.connection.sendMessagePromise({type:"history/history_during_period",start_time:new Date(s-Mo).toISOString(),end_time:new Date(s+Ao).toISOString(),entity_ids:i,minimal_response:!0,no_attributes:!0,significant_changes_only:!1});r=nn(c,s)}catch{r="failed"}this._activity=new Map(this._activity).set(e,r)}_download(){if(!this._raw)return;let{history:e,...t}=this.task??{},i=(this.task?.name||this.taskId).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"task",s={exported_at:new Date().toISOString(),entry_id:this.entryId,task_id:this.taskId,task:t,...this._raw};Ht(JSON.stringify(s,null,2),`trace-${i}-${_e()}.json`,"application/json")}_changeContext(e){return{lang:e,entityName:t=>yt(this.hass,t),userName:this.userName,unit:tt(this.hass,this.task)||void 0}}_renderActivity(e,t){let i=this._activity.get(e);return i===void 0?h:o`
      <div class="trace-activity">
        <div class="trace-activity-title">${a("beta_trace_activity",t)}</div>
        ${i==="loading"?o`<div class="trace-activity-none">…</div>`:i==="failed"||!i.length?o`<div class="trace-activity-none">${a("beta_trace_activity_none",t)}</div>`:o`<ol class="trace-repeats">
                ${i.map(s=>o`<li><span class="trace-time">${ye(new Date(s.at).toISOString(),t,!0)}</span><span>${yt(this.hass,s.entityId)}: ${this._stateText(s,t)}</span></li>`)}
              </ol>`}
      </div>`}_stateText(e,t){let i=Number(e.state);if(e.state===""||!Number.isFinite(i))return e.state;let s=this.hass?.states?.[e.entityId]?.attributes?.unit_of_measurement;return`${W(i,t,{maximumFractionDigits:3})}${typeof s=="string"&&s?` ${s}`:""}`}_renderDetails(e,t,i){let s=[{label:a("history_edit_timestamp",i),value:ye(e.at,i,!0)}];if(!e.repeats){s.push(...e.details,...rn(e.changes,this._changeContext(i)));let r=e.history?on(e.history,this.userName,i):null;r&&s.push(r)}return o`
      <div class="trace-details" role="region" aria-label=${a("task_section_details",i)}>
        <dl class="trace-facts">
          ${s.map(r=>o`<dt>${r.label}</dt><dd>${r.value}</dd>`)}
        </dl>
        ${e.repeats?o`<ol class="trace-repeats">
              ${e.repeats.map(r=>o`<li><span class="trace-time">${ye(r.at,i,!0)}</span><span>${r.text}</span></li>`)}
            </ol>`:e.history?$i(ln(e.history),{lang:i,hass:this.hass,currencySymbol:this.currencySymbol,taskRef:this.taskRef,triggerUnit:tt(this.hass,this.task)||null,stateRule:Ft(this.task)},{compact:!0,showEdit:!1,showHead:!1}):h}
        ${this._renderActivity(t,i)}
      </div>`}};he.styles=[_t,H`
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
  `],_([j({attribute:!1})],he.prototype,"hass",2),_([j({attribute:!1})],he.prototype,"entryId",2),_([j({attribute:!1})],he.prototype,"taskId",2),_([j({attribute:!1})],he.prototype,"task",2),_([j({attribute:!1})],he.prototype,"currencySymbol",2),_([j({attribute:!1})],he.prototype,"taskRef",2),_([j({attribute:!1})],he.prototype,"userName",2),_([f()],he.prototype,"_enabled",2),_([f()],he.prototype,"_cycles",2),_([f()],he.prototype,"_index",2),_([f()],he.prototype,"_sel",2),_([f()],he.prototype,"_failed",2),_([f()],he.prototype,"_activity",2);customElements.get("maintenance-task-trace")||customElements.define("maintenance-task-trace",he);function Fi(n,l,e,t=h){let i=n.filter(s=>!!s);return ci("ha-tab-group")?o`
      <div class="tab-bar ha-tabs">
        <ha-tab-group without-scroll-controls .active=${l} @wa-tab-show=${s=>{let r=i.find(c=>c.key===s.detail?.name)?.key;r&&r!==l&&e(r)}}>
          ${i.map(s=>o`<ha-tab-group-tab slot="nav" panel=${s.key} class=${s.cls??h} .active=${s.key===l}>${s.label}</ha-tab-group-tab>`)}
        </ha-tab-group>
        ${t}
      </div>`:o`
    <div class="tab-bar">
      ${i.map(s=>o`
        <div class="tab${s.cls?" "+s.cls:""} ${s.key===l?"active":""}" @click=${()=>e(s.key)}>
          ${s.label}
        </div>`)}
      ${t}
    </div>`}function Os(n,l,e){let t=We(n);if(t.length===0)return h;let i=t.map(r=>e?.(r)??null);if(i.every(r=>r!==null))return o`<span class="user-badge">${Aa(i)}${i.map(r=>r.name).join(", ")}</span>`;let s=t.map(r=>l(r)).filter(Boolean).join(", ");return s?o`
    <span class="user-badge">
      <ha-icon icon="mdi:account"></ha-icon>
      ${s}
    </span>
  `:h}function Po(n,l,e){let t=a("complete_when_badge",e).replace("{entity}",l).replace("{state}",n.to_state);return n.for_minutes&&(t+=` ${a("complete_when_badge_for",e).replace("{minutes}",String(n.for_minutes))}`),n.any_time&&(t+=`, ${a("complete_when_badge_any_time",e)}`),t}var pn="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z";function hn(n,l,e){let t=!l.isOperator;return[t&&{label:a("edit",e),action:()=>l.openEdit(n)},nt(n)&&{label:a("complete_with_details",e),cls:"complete-details",action:()=>l.openComplete(n,{details:!0})},{label:a("qr_code",e),action:()=>l.openQr(n.name)},{label:a("worksheet",e),action:()=>l.printWorksheet()},l.features.adaptive&&n.adaptive_config?.enabled&&{label:a("reanalyze",e),cls:"reanalyze",action:()=>l.reanalyze()},t&&{label:a("duplicate",e),action:()=>l.duplicateTask()},t&&{label:a("move_task",e),action:()=>l.moveTask()},{label:a("reset",e),action:()=>l.promptReset()},{label:`${a("postpone",e)}\u2026`,action:()=>l.promptPostpone()},{label:a("snooze",e),action:()=>l.snoozeTask()},t&&!n.archived&&{label:n.paused?a("resume_task",e):`${a("pause_task",e)}\u2026`,action:()=>l.togglePause(!!n.paused)},t&&{label:n.archived?a("unarchive",e):a("archive",e),action:()=>l.toggleArchive(!!n.archived)},t&&"divider",t&&{label:a("delete",e),danger:!0,action:()=>l.deleteTask()}]}function Io(n,l){let e=l.lang,t=l.isOperator;return o`
    <div class="task-header">
      <div class="task-header-title">
        <span class="task-name-breadcrumb" @click=${()=>l.showTaskView()}>${n.name}${St(n.next_event_titles)}${jt(n.trigger_detail)}</span>
        ${ht(l.taskRef??null,a("ref_number",e))}
        <span class="breadcrumb-separator">·</span>
        <span class="object-name-breadcrumb" @click=${()=>l.showObject()}>${l.objectName}</span>
        ${Ti(n,e,"chip")}
        ${n.paused&&n.paused_until?o`<span class="postponed-badge paused-until" title="${a("task_paused",e)}">
          <ha-icon icon="mdi:pause-circle-outline"></ha-icon>${a("paused_until_label",e)} ${U(n.paused_until,e)}
        </span>`:h}
        ${n.due_override?o`<span class="postponed-badge" title="${a("postponed_to",e)}">
          <ha-icon icon="mdi:calendar-arrow-right"></ha-icon>${U(n.due_override,e)}
        </span>`:h}
        ${Os(n,l.getUserName,l.getPerson)}
        ${n.notify_enabled===!1?o`<span class="nfc-badge muted-badge" title="${a("no_notifications",e)}"><ha-icon icon="mdi:bell-off-outline"></ha-icon></span>`:h}
        ${Wo(n,l,e)}
        ${n.complete_when?.entity_id?o`<span class="nfc-badge complete-when-badge" title="${Po(n.complete_when,yt(l.hass,n.complete_when.entity_id),e)}"><ha-icon icon="mdi:check-circle-outline"></ha-icon></span>`:h}
        ${nt(n)?o`<span class="nfc-badge quick-complete-badge" title="${a("quick_complete_help",e)}"><ha-icon icon="mdi:flash-outline"></ha-icon> ${a("quick_complete_label",e)}</span>`:h}
        ${n.nfc_tag_id?o`<span class="nfc-badge" title="${a("nfc_tag_id",e)}: ${n.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>`:t?h:o`<span class="nfc-badge unlinked" title="${a("nfc_link_hint",e)}"
              @click=${()=>l.openEdit(n)}>
              <ha-icon icon="mdi:nfc-variant"></ha-icon>
            </span>`}
      </div>
      <div class="task-header-actions">
        <ha-button appearance="accent" variant="success" @click=${()=>l.openComplete(n)}>${a("complete",e)}</ha-button>
        ${n.allow_skip!==!1?o`<ha-button appearance="outlined" variant="warning" .disabled=${l.actionLoading} @click=${()=>l.promptSkip()}>${a("skip",e)}</ha-button>`:h}
        <div class="more-menu-wrapper">
          ${st()?Ge(o`<ha-icon-button slot="trigger" .disabled=${l.actionLoading} .label=${a("more_actions",e)} .path=${pn}></ha-icon-button>`,hn(n,l,e)):o`<ha-icon-button .disabled=${l.actionLoading} .label=${a("more_actions",e)} .path=${pn} @click=${()=>l.toggleMoreMenu()}></ha-icon-button>
              ${l.moreMenuOpen?ot(hn(n,l,e),()=>l.closeMoreMenu()):h}`}
        </div>
      </div>
    </div>
  `}function zo(n){let l=n.lang;return Fi([{key:"overview",label:a("overview",l)},{key:"history",label:a("history",l)},n.features.beta_editor&&{key:"trace",label:a("beta_trace",l),cls:"trace-tab"}],n.activeTab,e=>n.setActiveTab(e))}function un(n,l,e,t){let i=t.collapsedSections.has(n);return o`
    <div class="collapsible ${i?"collapsed":""}">
      <button class="collapsible-head" @click=${()=>t.toggleSection(n)}
        aria-expanded=${i?"false":"true"}>
        <ha-icon icon="${i?"mdi:chevron-right":"mdi:chevron-down"}"></ha-icon>
        <span>${a(l,t.lang)}</span>
      </button>
      ${i?h:o`<div class="collapsible-body">${e}</div>`}
    </div>
  `}function Ho(n,l){if(!wa(n))return h;let e=l.lang,t=n.phase_sequence,i=xa(n.phase_cursor,t.length),s=new Map;for(let r=n.history.length-1;r>=0;r--){let c=n.history[r];c.phase_id&&c.type==="completed"&&!s.has(c.phase_id)&&s.set(c.phase_id,c.timestamp)}return o`
    <div class="phases-card">
      <div class="phases-card-header">
        <ha-icon icon="mdi:rotate-right"></ha-icon>
        <span>${a("phase_sequence_label",e)}</span>
      </div>
      <div class="phases-strip">
        ${t.map((r,c)=>{let d=n.phases?.[r]?.name||r,u=s.get(r);return o`
            <div class="phase-step ${c===i?"current":""}"
              title=${c===i?a("phase_current",e):a("phase_set",e)}
              @click=${()=>{c!==i&&l.setPhaseCursor(c)}}>
              <span class="phase-step-name">${c+1}. ${d}</span>
              ${u?o`<span class="phase-step-last">${U(u,e)}</span>`:h}
            </div>
          `})}
      </div>
    </div>
  `}function Lo(n,l){if(!l.features.checklists)return h;let e=pi(n)?.checklist??(n.checklist||[]);if(e.length===0)return h;let t=l.lang,i=n.checklist_progress||{},s=e.filter(r=>i[r]).length;return o`
    <div class="checklist-preview-card">
      <div class="checklist-preview-header">
        <ha-icon icon="mdi:format-list-checks"></ha-icon>
        <span>${a("checklist",t)} (${s}/${e.length})</span>
      </div>
      <ol class="checklist-preview-list">
        ${e.map(r=>o`
          <li class=${i[r]?"checked":""}>
            <label>
              <input
                type="checkbox"
                .checked=${!!i[r]}
                @change=${c=>l.setChecklistItem(r,c.target.checked)}
              />
              <span>${r}</span>
            </label>
          </li>
        `)}
      </ol>
    </div>
  `}function Bo(n,l){let e=de(n.documentation_url)?n.documentation_url:null,t=de(l.objectDocUrl)?l.objectDocUrl:null,i=t?null:(l.objectManualDocs||[])[0];if(!n.notes&&!e&&!t&&!i)return h;let s=l.lang;return o`
    <div class="task-meta-card">
      ${n.notes?o`
        <div class="task-meta-row">
          <ha-icon icon="mdi:note-text-outline"></ha-icon>
          <span class="task-meta-notes">${di(n.notes)}</span>
        </div>
      `:h}
      ${e?o`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:open-in-new"></ha-icon>
          <a href="${e}" target="_blank" rel="noopener noreferrer">${a("documentation_label",s)}</a>
        </div>
      `:h}
      ${t?o`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="${t}" target="_blank" rel="noopener noreferrer">${a("documentation_url_label",s)} (${l.objectName})</a>
        </div>
      `:i?o`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="#" title=${i.title}
            @click=${r=>{r.preventDefault(),l.openManualDoc(i)}}
            >${a("documentation_url_label",s)} (${l.objectName})</a>
        </div>
      `:h}
    </div>
  `}function No(n,l){let e=l.lang,t=n.average_cost!==void 0?n.average_cost:n.times_performed>0?n.total_cost/n.times_performed:null,i=n.trigger_config,s=n.next_due==null&&i?.type==="due_date"&&n.trigger_current_value!=null,r=s?new Date(Date.now()+n.trigger_current_value*864e5).toISOString():n.next_due,c=s?Kt(n.trigger_current_value):n.days_until_due,d=s?i?.trigger_days_before??0:n.warning_days,u=c!=null?c<0?"overdue":c<=d?"warning":"":"";return o`
    <div class="kpi-bar">
      <div class="kpi-card">
        <div class="kpi-label">${a("next_due",e)}</div>
        <div class="kpi-value">${r?U(r,e):"\u2014"}</div>
        ${s?o`<div class="kpi-subtext">${a("kpi_reported_by_sensor",e)}</div>`:l.features.schedule_time&&n.schedule_time?o`<div class="kpi-subtext">${a("at_time",e)} ${n.schedule_time}</div>`:h}
      </div>
      <div class="kpi-card ${u}">
        <div class="kpi-label">${a("days_until_due",e)}</div>
        <div class="kpi-value-large">${c??"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("interval",e)}</div>
        <div class="kpi-value">${Re(n,e)}</div>
        ${l.features.adaptive&&n.suggested_interval&&n.suggested_interval!==n.interval_days?o`
          <div class="kpi-subtext">${a("recommended",e)}: ${n.suggested_interval}${n.interval_analysis?.confidence_interval_low!=null?` (${n.interval_analysis.confidence_interval_low}\u2013${n.interval_analysis.confidence_interval_high})`:""}</div>
        `:h}
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("warning",e)}</div>
        <div class="kpi-value">${ri(n.warning_days,e)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("last_performed",e)}</div>
        <div class="kpi-value">${n.last_performed?U(n.last_performed,e):"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("avg_cost",e)}</div>
        <div class="kpi-value">${t!=null?Y(t,l.currencySymbol,e):"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${a("avg_duration",e)}</div>
        <div class="kpi-value">${n.average_duration?zt(Math.round(n.average_duration),e):"\u2014"}</div>
      </div>
    </div>
  `}function Fo(n,l){let e=l.lang;if(!l.features.adaptive||!n.suggested_interval||n.suggested_interval===n.interval_days)return h;if(l.suggestionDismissed)return h;let t=n.suggested_interval;return o`
    <div class="recommendation-card">
      <h4>${a("suggested_interval",e)}</h4>
      ${cr(n.interval_days,t,n.interval_confidence||"medium",e)}
      <div class="recommendation-actions">
        ${l.isOperator?h:o`<ha-button appearance="filled" class="apply-suggestion"
              @click=${()=>l.applySuggestion(t)}>
              ${a("apply_suggestion",e)}
            </ha-button>`}
        <ha-button appearance="plain"
          @click=${()=>l.reanalyze()}>
          ${a("reanalyze",e)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${()=>l.dismissSuggestion()}>
          ${a("dismiss_suggestion",e)}
        </ha-button>
      </div>
    </div>
  `}function qo(n,l){let e=l.lang,t=ir(n.history).slice(0,3);return t.length===0?h:o`
    <div class="recent-activities">
      <h3>${a("recent_activities",e)}</h3>
      ${t.map(i=>$i(i,l.history,{compact:!0,showEdit:!1}))}
      <div class="activity-show-all">
        <ha-button appearance="plain" @click=${()=>l.setActiveTab("history")}>${a("show_all",e)} →</ha-button>
      </div>
    </div>
  `}function mn(n,l){let e=l.lang,t=l.features.adaptive&&n.suggested_interval&&n.suggested_interval!==n.interval_days,i=l.features.seasonal&&n.seasonal_factor&&n.seasonal_factor!==1,s=t||i,r=l.features.adaptive&&n.interval_analysis?.weibull_beta!=null&&n.interval_analysis?.weibull_eta!=null,c=l.features.seasonal&&(n.seasonal_factors?.length===12||n.interval_analysis?.seasonal_factors?.length===12);return o`
    <div class="tab-content overview-tab">
      ${n.battery_fleet_task?o`<maintenance-battery-fleet-section .hass=${l.hass}></maintenance-battery-fleet-section>`:h}
      ${No(n,l)}
      ${Bo(n,l)}
      ${n.battery_fleet_task?h:o`
            ${Br(n,l.lang)}
            ${qr(n,l.sparkline)}
            ${lr(n,e,l.features)}
          `}
      <div class="two-column-layout ${s?"":"single-column"}">
        ${s?o`
          <div class="left-column">
            ${Fo(n,l)}
            ${dr(n,e,l.features)}
          </div>
        `:h}
        <div class="right-column">
          ${Yr(n,e,l.costDurationToggle,d=>l.setCostDurationToggle(d),l.currencySymbol)}
        </div>
      </div>
      ${r?un("weibull","weibull_reliability_curve",or(n,e),l):h}
      ${c?un("seasonal","seasonal_chart_title",o`
            ${pr(n,e)}
            <div class="seasonal-actions">
              <ha-button appearance="plain" @click=${()=>l.openSeasonalOverrides(n)}>
                ${a("edit_seasonal_overrides",e)}
              </ha-button>
            </div>
          `,l):h}
      ${Ho(n,l)}
      ${Lo(n,l)}
      ${qo(n,l)}
    </div>
  `}function Uo(n,l){return o`
    <div class="tab-content history-tab">
      <div class="history-add-past">
        <ha-button appearance="plain" class="history-add-past-btn" @click=${()=>l.openComplete(n,{details:!0})}>
          <ha-icon icon="mdi:calendar-plus"></ha-icon>
          ${a("history_add_past",l.lang)}
        </ha-button>
      </div>
      ${sr(n,l.history)}
      ${ar(n,l.history)}
    </div>
  `}function Vo(n,l){switch(l.activeTab){case"overview":return mn(n,l);case"history":return Uo(n,l);case"trace":return l.features.beta_editor?o`<div class="tab-content trace-tab-content">
            <maintenance-task-trace .hass=${l.hass} .entryId=${l.entryId} .taskId=${l.taskId} .task=${n}
              .currencySymbol=${l.currencySymbol} .taskRef=${l.taskRef??null} .userName=${l.getUserName}></maintenance-task-trace>
          </div>`:mn(n,l);default:return h}}function Wo(n,l,e){let t=n.mirror_todo_entities??[],i=t.length?t:n.mirror_todo_use_default===!1?[]:l.mirrorTodoDefault??[];if(!i.length)return h;let s=i.map(c=>yt(l.hass,c)).join(", "),r=t.length?`${a("task_mirror_todo",e)}: ${s}`:a("task_mirror_todo_default",e).replace("{lists}",s);return o`<span class="nfc-badge mirror-badge ${t.length?"":"inherited"}" title=${r}><ha-icon icon="mdi:clipboard-list-outline"></ha-icon></span>`}function _n(n,l){return o`
    <div class="detail-section">
      ${Io(n,l)}
      ${zo(l)}
      ${Vo(n,l)}
      <maintenance-task-documents
        .hass=${l.hass}
        .entryId=${l.entryId}
        .taskId=${l.taskId}
        .canWrite=${!l.isOperator}
      ></maintenance-task-documents>
    </div>
  `}var Qt=class extends L{createRenderRoot(){return this}render(){return!this.task||!this.ctx?h:o`${_n(this.task,this.ctx)}`}};_([j({attribute:!1})],Qt.prototype,"task",2),_([j({attribute:!1})],Qt.prototype,"ctx",2);customElements.get("maintenance-task-detail-view")||customElements.define("maintenance-task-detail-view",Qt);function gn(n,l,e){let t=0,i=l-1;for(;t<i;){let s=t+i+1>>1;e(s)<=n?t=s:i=s-1}return t}function Ms(n){if(n.total<=0)return{start:0,end:0,padTop:0,padBottom:0};let l=n.overscan??12,e=Math.max(1,n.step??6),t=Math.max(1,n.rowHeight??53),i=n.offsets,s=i?g=>i[g]:g=>g*t,r=n.scrollTop-n.listTop,c=gn(r,n.total,s),d=gn(r+n.viewportHeight,n.total,s),u=Math.max(0,c-l);u=Math.floor(u/e)*e;let p=Math.min(n.total,d+1+l);return p=Math.min(n.total,Math.ceil(p/e)*e),{start:u,end:p,padTop:s(u),padBottom:s(n.total)-s(p)}}function fn(n){if(n.total<=0)return[0,0];let l=n.offsets[n.total],e=(n.overscan??12)*(l/n.total);if(n.listTop+l<n.scrollTop-e||n.listTop>n.scrollTop+n.viewportHeight+e)return[0,0];let t=Ms(n);return[t.start,t.end]}var Xt=class{constructor(){this._heights=new Map;this._sum=0;this._width=-1}setWidth(l){Math.abs(l-this._width)<1||(this._width=l,this._heights.clear(),this._sum=0)}record(l,e){if(!(e>0))return;let t=this._heights.get(l);t!==e&&(this._sum+=e-(t??0),this._heights.set(l,e))}get estimate(){return this._heights.size?this._sum/this._heights.size:53}offsets(l){let e=this.estimate,t=new Float64Array(l.length+1);for(let i=0;i<l.length;i++)t[i+1]=t[i]+(this._heights.get(l[i])??e);return t}};var qi={mode:"top",marginTop:0,lastScrollTop:0};function bn(n,l){return n==="top"?8:l.viewH-l.paneH-8}function vn(n){let l=n.scrollTop+8-n.layoutTop,e=Math.max(0,n.listH-n.paneH);return{mode:"top",marginTop:l>e?Math.max(0,l):0,lastScrollTop:n.scrollTop}}function yn(n,l){let e=l.scrollTop,t=l.scrollTop>n.lastScrollTop?"down":l.scrollTop<n.lastScrollTop?"up":"none",i=Math.max(0,l.listH-l.paneH),s=l.paneH+16<=l.viewH||l.listH<=l.paneH,{mode:r,marginTop:c}=n;if(s&&(r="top"),r==="top"&&c>0&&t==="up")c=Math.max(0,Math.min(c,l.scrollTop+8-l.layoutTop)),c<=i&&(c=0);else if(!s&&t==="down"&&r==="top"){let d=l.renderedTop-l.layoutTop;d<=i&&(r="bottom",c=Math.max(0,d))}else!s&&t==="up"&&r==="bottom"&&(c=Math.min(Math.max(0,l.renderedTop-l.layoutTop),i),l.scrollTop+8<=l.layoutTop+c&&(r="top",c=0));return{mode:r,marginTop:c,lastScrollTop:e}}function xn(n,l,e){let t=Math.min(100,Math.max(0,n/l*100)),i=e??80;return{pct:t,level:t>=100?"danger":t>=i?"warning":"ok"}}var Ui=2,Qo=250,Xo=150,dt={objects:6,tasks:10,parts:6,documents:8,history:6},Jo="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z",Vi=["due_date","object","type","task_name","area","assigned_user","group"],As=["none","area","group","user","object"],Ds=Zs,kn=["children","tasks","documents","parts","history"],Ps=n=>`${n.entry_id}/${n.task_id}`,Is=(n,l)=>`${a("documents",l)}: ${W(n,l)}`,$n="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",S=class extends L{constructor(){super(...arguments);this.narrow=!1;this.tight=!1;this.split=!1;this.wide=!1;this._tightObserver=null;this.panel={};this.embedded=!1;this.presets={};this._presetsApplied=!1;this._mountPath=null;this._objects=[];this._stats=null;this._view="overview";this._allParts=null;this._selectedEntryId=null;this._selectedTaskId=null;this._selectedAreaId=null;this._filterStatus="";this._filterUser=null;this._filterLabel=null;this._filterPlace="";this._filterPriority="";this._savedViews=[];this._activeViewId="";this._unsub=null;this._chartRangeDays=(()=>{try{let e=parseInt(X(P.chartRange)||"",10);return[7,30,90,365].includes(e)?e:30}catch{return 30}})();this._hideOutliers=(()=>{try{return X(P.chartHideOutliers)==="1"}catch{return!1}})();this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1,beta_editor:!1};this._adminPanelUserIds=[];this._operatorWriteEnabled=!1;this._defaultWarningDays=7;this._mirrorTodoDefault=[];this._rowActionStyle="buttons_compact";this._refsInLists=!1;this._partsCostMode="purchase";this._rowActionNotice=!1;this._actionLoading=!1;this._moreMenuOpen=!1;this._objMenuOpen=!1;this._subObjMenu=null;this._toastMessage="";this._toastKind="error";this._toastUndo=null;this._toastActionLabel="";this._filtersOpen=!1;this._listSearch="";this._listSearchDraft="";this._listSearchTimer=0;this._filterPaneOpen=X(P.filterPane)==="1";this._paneSections=new Set(["status"]);this._newMenuOpen=!1;this._gsSetupsCount=0;this._gsAdoptCount=0;this._gsLoaded=!1;this._resetOffersLoaded=!1;this._resetOffersCount=0;this._batteryFleetSetupAvailable=!1;this._staleBundle=!1;this._restartPendingVersion=null;this._staleChecked=!1;this._onReconnect=()=>this._checkServerVersion();this._toastTimer=null;this._dismissedSuggestions=new Set;this._overviewTab=(()=>{try{let e=X(P.overviewTab);return e==="today"||e==="calendar"?e:"dashboard"}catch{return"dashboard"}})();this._activeTab="overview";this._costDurationToggle="both";this._historySearch="";this._sortMode="due_date";this._objectSortMode="alphabetical";this._objTableSort=null;this._groupByMode="none";this._objectViewMode="cards";this._objectsTableColumns=ba;this._showArchived=!1;this._bulkMode=!1;this._bulkSelected=new Set;this._objBulkMode=!1;this._objBulkSelected=new Set;this._bulkMenuOpen=!1;this._virtStart=0;this._virtEnd=0;this._virtHeights=new Xt;this._virtKeys=[];this._virtRenderedStart=0;this._virtPasses=0;this._virtTotalRows=0;this._virtScrollAttached=!1;this._virtRaf=0;this._virtGroups=[];this._virtGroupDrawn=[];this._virtGroupWin=new Map;this._virtGroupHeights=new Xt;this._virtGroupSig="";this._listScroll=new Map;this._restoreListScroll=!1;this._contentScrollTop=0;this._viewEntry=0;this._stickyState=qi;this._stickySelectPending=!1;this._stickyRaf=0;this._stickyAttached=!1;this._stickyObserver=null;this._collapsedGroups=new Set;this._collapsedSections=(()=>{try{return new Set(JSON.parse(X(P.collapsedSections)||"[]"))}catch{return new Set}})();this._objectSectionsCollapsed=(()=>{try{let e=JSON.parse(X(P.objectSections)||"[]");return new Set((Array.isArray(e)?e:[]).filter(t=>kn.includes(t)))}catch{return new Set}})();this._objectSectionOverride=null;this._objTreeOpen=(()=>{try{let e=JSON.parse(X(P.objectTreeOpen)||"[]");return new Set((Array.isArray(e)?e:[]).filter(t=>typeof t=="string"))}catch{return new Set}})();this._paletteOpen=!1;this._paletteQuery="";this._paletteActive=0;this._searchRemote=null;this._searchTimer=null;this._searchSeq=0;this._templateGalleryOpen=!1;this._templates=[];this._homeProfile=null;this._templateCategories={};this._templateBusy=!1;this._templateParentId=null;this._templatePreview=null;this._templatePicked=new Set;this._statsService=null;this._userService=null;this._usersVersion=0;this._rowsMemo=new Map;this._rowsMemoInputs=[];this._rowsGeneration=0;this._virtRenderedSig="";this._virtMeasuredSig="";this._hassHeld=null;this._hassTimer=0;this._lastRender=0;this._dataLoaded=!1;this._lastConnection=null;this._popstateHandler=e=>this._onPopState(e);this._locationChangedHandler=()=>this._onLocationChanged();this._lazyUi=null;this._warmedUp=!1;this._objectWarmedUp=!1;this._warmPending=!1;this._onStickyScroll=()=>{this._stickyRaf||(this._stickyRaf=requestAnimationFrame(()=>{this._stickyRaf=0,this._updateStickyPane()}))};this._onVirtualScroll=e=>{e?.currentTarget instanceof HTMLElement&&(this._contentScrollTop=e.currentTarget.scrollTop),this._virtPasses=0,this._scheduleVirtualWindow()};this._deepLinkHandled=!1;this._reloadState=null;this._deepLinkInPlace=!1;this._initialLoadDone=!1;this._detailStatsSeq=new Map;this._subGen=0;this._kpiRefreshInFlight=!1;this._kpiRefreshPending=!1;this._areaUi=null;this._paletteKeydown=e=>{if(e.key==="/"&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!this._paletteOpen){let i=e.composedPath()[0];if(i instanceof HTMLElement&&(i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.tagName==="SELECT"||i.isContentEditable))return;e.preventDefault(),this._openPalette();return}if(!this._paletteOpen)return;let t=this._paletteResults;if(e.key==="Escape")e.preventDefault(),this._closePalette();else if(e.key==="ArrowDown")e.preventDefault(),this._paletteActive=Math.min(this._paletteActive+1,t.length-1);else if(e.key==="ArrowUp")e.preventDefault(),this._paletteActive=Math.max(this._paletteActive-1,0);else if(e.key==="Enter"){e.preventDefault();let i=t[this._paletteActive];i&&this._selectPaletteResult(i)}};this._onObjectReplaced=async e=>{this._showToast([a("object_replaced",this._lang),this._deviceSwapText(e.detail.device_swap)].filter(Boolean).join(" \xB7 "),"info");try{await this._loadData()}catch{}e.detail.entry_id&&this._showObject(e.detail.entry_id)};this._onObjectSaved=async e=>{let t=this._deviceSwapText(e.detail?.device_swap);t&&this._showToast(t,"info"),await this._onDialogEvent()};this._checklistPending=new Map;this._checklistChain=Promise.resolve();this._onDialogEvent=async()=>{try{await this._loadData()}catch{}};this._onTaskCompleted=async e=>{await this._onDialogEvent();let t=e.detail;t?.undo&&this._offerUndo(t.entryId,t.taskId,a("task_completed_named",this._lang).replace("{task}",t.taskName))};this._onCalendarOpenTask=e=>{let t=e.detail;t?.entry_id&&t.task_id&&(e.preventDefault(),e.stopPropagation(),this._showTask(t.entry_id,t.task_id))};this._onCalendarLlCustom=e=>{let t=e.detail;t?.type==="maintenance-supporter:open-task"&&t.entry_id&&t.task_id&&(e.stopPropagation(),this._showTask(t.entry_id,t.task_id))};this._popupClosers=new Map;this._fullHistory=null;this._onHistoryEntrySaved=async()=>{await this._loadData()}}get _currencySymbol(){return ai(this._budget)}get _lang(){return F(this.hass)}get _isOperator(){return!$t(this.hass?.user,{operatorWriteEnabled:this._operatorWriteEnabled,operatorIds:this._adminPanelUserIds})}_ensureLazyUi(){return this._lazyUi||(this._lazyUi=Promise.all([import("/maintenance_supporter_panelfiles/panel-chunks/object-dialog-I6AVMMHO.js"),import("/maintenance_supporter_panelfiles/panel-chunks/task-dialog-M6QEZWFC.js"),import("/maintenance_supporter_panelfiles/panel-chunks/complete-dialog-KBDMJXAN.js"),import("/maintenance_supporter_panelfiles/panel-chunks/qr-dialog-Q27HIRSR.js"),import("/maintenance_supporter_panelfiles/panel-chunks/adopt-problem-sensors-dialog-ZGZUMGPY.js"),import("/maintenance_supporter_panelfiles/panel-chunks/suggested-setups-dialog-ZCBAK4VK.js"),import("/maintenance_supporter_panelfiles/panel-chunks/settings-view-VOHTTNOM.js"),import("/maintenance_supporter_panelfiles/panel-chunks/bulk-edit-dialog-I2LMKZJT.js")]).then(()=>this.updateComplete)),this._lazyUi}_scheduleWarmUp(){if(this._warmedUp&&this._objectWarmedUp||this._warmPending)return;this._warmPending=!0;let e=()=>{if(this._warmPending=!1,this._warmedUp){this._warmUpObjectPage();return}this._warmUpTaskPage(),this._warmedUp&&this._scheduleWarmUp()},t=window.requestIdleCallback;t?t(e,{timeout:5e3}):window.setTimeout(e,1500)}_warmUpTaskPage(){let e=this.shadowRoot;if(this._warmedUp||!e||!this.isConnected)return;let t=this._objects.find(c=>c.tasks.length>0);if(!t||(this._warmedUp=!0,e.querySelector("maintenance-task-detail-view")))return;let i=t.tasks[0],s=document.createElement("maintenance-task-detail-view");s.task=i,s.ctx={...this._taskDetailCtx(t.entry_id,i.id),entryId:""};let r=document.createElement("div");r.hidden=!0,r.attachShadow({mode:"open"}).append(s),e.prepend(r),s.updateComplete.then(()=>requestAnimationFrame(()=>r.remove()))}_warmUpObjectPage(){let e=this.shadowRoot;if(this._objectWarmedUp||!e||!this.isConnected)return;let t=c=>+(c.tasks.length>0)+ +((c.parts||[]).length>0)+Number(c.tasks.some(d=>(d.history||[]).length>0)),i=this._objects.reduce((c,d)=>!c||t(d)>t(c)?d:c,void 0);if(!i)return;this._objectWarmedUp=!0;let s=document.createElement("div");s.hidden=!0;let r=s.attachShadow({mode:"open"});e.prepend(s),Mt(this._renderObjectPage(i,!0),r,{host:this}),requestAnimationFrame(()=>{Mt(h,r),s.remove()})}async _ui(e){return await this._ensureLazyUi(),this.shadowRoot?.querySelector(e)??null}connectedCallback(){super.connectedCallback(),this._mountPath=window.location.pathname;let e=window.requestIdleCallback,t=()=>{this._ensureLazyUi().then(()=>this._scheduleWarmUp())};e?e(t,{timeout:3e3}):window.setTimeout(t,1500),window.addEventListener("popstate",this._popstateHandler),window.addEventListener("location-changed",this._locationChangedHandler),window.addEventListener("keydown",this._paletteKeydown),typeof ResizeObserver<"u"&&(this._tightObserver=new ResizeObserver(i=>{let s=i[0]?.contentRect.width??0;s>0&&(this.tight=s<1e3),s>0&&(this.split=s>=1500),s>0&&(this.wide=s>=2200)}),this._tightObserver.observe(this)),window.addEventListener("resize",this._onVirtualScroll,{passive:!0});try{let i=X(P.taskSort);i&&Vi.includes(i)&&(this._sortMode=i);let s=X(P.objectSort);s&&["alphabetical","due_soonest","task_count"].includes(s)&&(this._objectSortMode=s);let[r,c]=(X(P.objectTableSort)??"").split(":");fa.includes(r)&&r!=="actions"&&(c==="asc"||c==="desc")&&(this._objTableSort={key:r,dir:c});let d=X(P.groupBy);d&&As.includes(d)&&(this._groupByMode=d);let u=X(P.objectView);(u==="cards"||u==="table")&&(this._objectViewMode=u)}catch{}if(this._objects.length===0){let i=xr();i&&(i.beta!==void 0&&es(i.beta),this._objects=i.objects,i.stats&&(this._stats=i.stats))}}disconnectedCallback(){super.disconnectedCallback(),this._subGen++,window.removeEventListener("popstate",this._popstateHandler),window.removeEventListener("location-changed",this._locationChangedHandler),window.removeEventListener("keydown",this._paletteKeydown);for(let e of[...this._popupClosers.keys()])this._dropPopupCloser(e);this._tightObserver?.disconnect(),this._tightObserver=null,window.removeEventListener("resize",this._onVirtualScroll),this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onVirtualScroll),this._virtScrollAttached=!1,this._virtRaf&&cancelAnimationFrame(this._virtRaf),this._virtRaf=0,this._detachStickyPane(),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._initialLoadDone=!1,this._watchConnection(null),this._deepLinkHandled=!1,this._searchTimer&&(clearTimeout(this._searchTimer),this._searchTimer=null),this._toastTimer&&(clearTimeout(this._toastTimer),this._toastTimer=null),this._toastMessage="",this._toastUndo=null,this._toastActionLabel="",this._statsService?.clearCache(),this._statsService=null}shouldUpdate(e){if(this.hasUpdated&&e.size===1&&e.has("hass")){let t=e.get("hass"),i=1e3-(performance.now()-this._lastRender);if(t&&this.hass&&i>0&&yr(t,this.hass))return this._hassHeld??=t,this._hassTimer||(this._hassTimer=window.setTimeout(()=>{this._hassTimer=0,this.requestUpdate()},i)),!1}return!0}willUpdate(e){if(super.willUpdate(e),this._hassHeld&&(e.has("hass")||e.set("hass",this._hassHeld),this._hassHeld=null),this._hassTimer&&(clearTimeout(this._hassTimer),this._hassTimer=0),e.has("_groupByMode")&&this._collapsedGroups.size>0&&(this._collapsedGroups=new Set),e.has("_groupByMode")&&(this._virtGroupWin=new Map),e.has("_view")){this._viewEntry++;let t=e.get("_view");(t==="overview"||t==="all_objects")&&this._listScroll.set(t,this._contentScrollTop)}}updated(e){if(super.updated(e),this._lastRender=performance.now(),ut(this,e),e.has("hass")&&this.hass){if(this._dataLoaded){if(this.hass.connection!==this._lastConnection){if(this._watchConnection(this.hass.connection),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}else{this._dataLoaded=!0,this._watchConnection(this.hass.connection);let s=history.state;!this.embedded&&s?.msp_view&&s.msp_view!=="overview"?this._reloadState=s:history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},""),this._loadData(),this._subscribe()}this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new Ri(this.hass),this._fetchMiniStatsForOverview()),this._userService?this._userService.updateHass(this.hass):(this._userService=new Da(this.hass),this._userService.getUsers().then(()=>{this._usersVersion++,this.requestUpdate()}))}let t=this.shadowRoot?.querySelector(".content");if(t&&!this._virtScrollAttached&&(t.addEventListener("scroll",this._onVirtualScroll,{passive:!0}),this._virtScrollAttached=!0),e.has("_view")&&this._restoreListScroll){this._restoreListScroll=!1;let s=this._listScroll.get(this._view)??0;requestAnimationFrame(()=>{let r=this.shadowRoot?.querySelector(".content");r&&(r.scrollTop=s)})}(!(e.size===1&&e.has("hass"))||this._virtRenderedSig!==this._virtMeasuredSig)&&(this._virtMeasuredSig=this._virtRenderedSig,this._scheduleVirtualWindow()),this._syncStickyPane(t),e.has("_objects")&&this._lazyUi&&!(this._warmedUp&&this._objectWarmedUp)&&this._scheduleWarmUp()}_syncStickyPane(e){let t=this.shadowRoot?.querySelector(".split-pane");if(!t||!e){this._stickyAttached&&this._detachStickyPane();return}this._stickyAttached||(e.addEventListener("scroll",this._onStickyScroll,{passive:!0}),window.addEventListener("resize",this._onStickyScroll),typeof ResizeObserver<"u"&&(this._stickyObserver=new ResizeObserver(this._onStickyScroll)),this._stickyAttached=!0),this._stickyObserver?.observe(t),this._updateStickyPane()}_detachStickyPane(){this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onStickyScroll),window.removeEventListener("resize",this._onStickyScroll),this._stickyObserver?.disconnect(),this._stickyObserver=null,this._stickyRaf&&cancelAnimationFrame(this._stickyRaf),this._stickyRaf=0,this._stickyAttached=!1,this._stickyState=qi,this._stickySelectPending=!1}_updateStickyPane(){let e=this.shadowRoot,t=e?.querySelector(".content"),i=e?.querySelector(".split-pane"),s=e?.querySelector(".split-layout"),r=e?.querySelector(".split-list");if(!t||!i||!s||!r)return;let c=t.getBoundingClientRect().top-t.scrollTop,d={scrollTop:t.scrollTop,viewH:t.clientHeight,paneH:i.offsetHeight,listH:r.offsetHeight,layoutTop:s.getBoundingClientRect().top-c,renderedTop:i.getBoundingClientRect().top-c};this._stickySelectPending&&d.scrollTop===this._stickyState.lastScrollTop?this._stickyState=vn(d):(this._stickySelectPending=!1,this._stickyState=yn(this._stickyState,d));let u=this._stickyState;i.style.top=`${bn(u.mode,d)}px`,i.style.marginTop=u.marginTop>0?`${u.marginTop}px`:""}_resetStickyPane(){let e=this.shadowRoot?.querySelector(".content");this._stickyState={...qi,lastScrollTop:e?.scrollTop??0},this._stickySelectPending=!0}_scheduleVirtualWindow(){this._virtRaf||(this._virtRaf=requestAnimationFrame(()=>{this._virtRaf=0,this._updateVirtualWindow()}))}_updateVirtualWindow(){let e=this.shadowRoot?.querySelector(".content"),t=this.shadowRoot?.querySelector(".task-table.virtual");if(!e||!t)return;if(t.classList.contains("grouped")){this._updateGroupedWindow(e,t);return}this._virtHeights.setWidth(t.clientWidth),t.querySelectorAll(".task-row:not(.virt-sizer)").forEach((d,u)=>{let p=this._virtKeys[this._virtRenderedStart+u];p!==void 0&&this._virtHeights.record(p,d.offsetHeight)});let r=(t.querySelector(".virt-sizer")??t).getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop,c=Ms({scrollTop:e.scrollTop,viewportHeight:e.clientHeight,listTop:r,offsets:this._virtHeights.offsets(this._virtKeys),total:this._virtTotalRows});c.start===this._virtStart&&c.end===this._virtEnd||this._virtPasses>=8||(this._virtPasses++,this._virtStart=c.start,this._virtEnd=c.end)}_updateGroupedWindow(e,t){let i=this._virtGroups,s=t.querySelectorAll(":scope > .group-section"),r=i.map((g,m)=>s[m]?.querySelector(":scope > .group-rows")??null),c=this._virtGroupHeights;c.setWidth(t.clientWidth),r.forEach((g,m)=>{let b=this._virtGroupDrawn[m]?.[0]??0;g?.querySelectorAll(":scope > .task-row").forEach((x,T)=>{let v=i[m].keys[b+T];v!==void 0&&c.record(v,x.offsetHeight)})});let d=e.getBoundingClientRect().top-e.scrollTop,u=new Map;r.forEach((g,m)=>{let b=i[m];!g||b.keys.length===0||u.set(b.key,fn({scrollTop:e.scrollTop,viewportHeight:e.clientHeight,listTop:g.getBoundingClientRect().top-d,offsets:c.offsets(b.keys),total:b.keys.length}))});let p=this._virtGroupWin;u.size===p.size&&[...u].every(([g,m])=>p.get(g)?.[0]===m[0]&&p.get(g)?.[1]===m[1])||this._virtPasses>=8||(this._virtPasses++,this._virtGroupWin=u)}_watchConnection(e){this._lastConnection?.removeEventListener?.("ready",this._onReconnect),this._lastConnection=e,e?.addEventListener?.("ready",this._onReconnect)}_checkServerVersion(){this.hass.connection.sendMessagePromise({type:"maintenance_supporter/version"}).then(e=>{this._restartPendingVersion=Bs(e),this._staleBundle=!this._restartPendingVersion&&Ls(e?.version)}).catch(()=>{})}async _loadData(){let[e,t,i,s,r,c]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"}).catch(()=>null)]);if(c&&(this._savedViews=c.views||[]),e&&(this._objects=Wt(e.objects),gs(this._objects,t??this._stats??null,r?ns(r).features.beta_editor:pe()),this._maybeLoadGettingStarted()),this._detailOpen()&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/status"}).then(u=>{this._batteryFleetSetupAvailable=!!u.available&&!u.configured}).catch(()=>{this._batteryFleetSetupAvailable=!1}),this._staleChecked||(this._staleChecked=!0,this._checkServerVersion()),t&&(this._stats=t),i&&(this._budget=i,It(this._budget)),s&&(this._groups=s.groups||{}),r){let u=ns(r);this._features=u.features,es(u.features.beta_editor),this._adminPanelUserIds=[...u.access.operatorIds],this._operatorWriteEnabled=u.access.operatorWriteEnabled,this._defaultWarningDays=u.defaultWarningDays,this._mirrorTodoDefault=u.mirrorTodoDefault,this._rowActionStyle=u.rowActionStyle,this._rowActionNotice=u.rowActionNoticePending,this._refsInLists=u.refsInLists,this._objectsTableColumns=va(u.objectsTableColumns),this._partsCostMode=u.partsCostMode}this._fetchMiniStatsForOverview(),this._initialLoadDone=!0;let d=!!window.location.search;this._handleDeepLink(),this._restoreAfterReload(d)}_restoreAfterReload(e){let t=this._reloadState;if(this._reloadState=null,!t?.msp_view||e||this._deepLinkHandled)return;if((t.msp_view==="object"||t.msp_view==="task")&&!this._getObject(t.msp_entry??"")||t.msp_view==="task"&&!this._getTask(t.msp_entry??"",t.msp_task??"")||t.msp_view==="area"&&!this._objects.some(s=>ss(s.object)===t.msp_area)){history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},"");return}this._applyPanelState(t)}_onLocationChanged(){if(!this._initialLoadDone||!window.location.search||this.embedded&&this._mountPath!==null&&window.location.pathname!==this._mountPath)return;if(!this.embedded){let t=`/${typeof this.panel?.url_path=="string"?this.panel.url_path:"maintenance-supporter"}`,i=window.location.pathname;if(i!==t&&!i.startsWith(`${t}/`))return}this._deepLinkHandled=!1,this._deepLinkInPlace=!0;try{this._handleDeepLink()}finally{this._deepLinkInPlace=!1}history.state?.msp_view||history.replaceState({msp_view:this._view,msp_entry:this._selectedEntryId,msp_task:this._selectedTaskId,msp_area:this._selectedAreaId},"")}_handleDeepLink(){if(this._deepLinkHandled)return;let e=new URLSearchParams(window.location.search),t=e.get("ms_action"),i=()=>{let k=window.location.pathname+window.location.hash;history.replaceState(history.state,"",k)};if(t==="add_object"){this._deepLinkHandled=!0,i(),this._ui("maintenance-object-dialog").then(k=>k?.openCreate());return}if(t==="open_vacation"||t==="open_budget"||t==="open_groups"||t==="open_settings"){if(this._deepLinkHandled=!0,i(),!this.hass?.user?.is_admin)return;this._overviewTab="settings",this._ensureLazyUi().then(()=>requestAnimationFrame(()=>{let k=this.shadowRoot?.querySelector("maintenance-settings-view"),w=t.replace("open_","");k?.scrollToSection?.(w)}));return}if(this.embedded&&!this._presetsApplied){this._presetsApplied=!0;let k=this.presets?.tab??"",w=(this.presets?.view??"").trim();if(!e.has("tab")&&_s.includes(k)&&(k!=="settings"||this.hass?.user?.is_admin)&&(this._overviewTab=k),!e.has("view")&&w){let E=w.toLowerCase(),y=this._savedViews.find(D=>D.id===w)??this._savedViews.find(D=>D.name.trim().toLowerCase()===E);y&&(this._overviewTab="dashboard",this._applyView(y.id))}}let s=e.get("tab"),r=e.get("view"),c=e.get("sort"),d=e.get("status");if(s!==null||r!==null||c!==null||d!==null){if(i(),this._view!=="overview"&&(this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()),_s.includes(s??"")&&(s!=="settings"||this.hass?.user?.is_admin)&&this._setOverviewTab(s),r!==null){let k=r.trim().toLowerCase(),w=this._savedViews.find(E=>E.id===r)??this._savedViews.find(E=>E.name.trim().toLowerCase()===k);w&&(this._overviewTab!=="dashboard"&&this._setOverviewTab("dashboard"),this._applyView(w.id))}Vi.includes(c??"")&&(this._sortMode=c,this._activeViewId="",q(P.taskSort,this._sortMode)),Ds.includes(d??"")&&(this._overviewTab!=="dashboard"&&this._setOverviewTab("dashboard"),this._filterByStatus(d))}let u=e.get("area");if(u&&!e.get("entry_id")){this._deepLinkHandled=!0,i(),this._objects.some(k=>ss(k.object)===u)?this._showArea(u):this._showAllAreas();return}let p=e.get("entry_id");if(!p)return;this._deepLinkHandled=!0;let g=e.get("task_id"),m=e.get("action"),b=e.get("section"),x=kn.includes(b??"")?b:null,T=window.location.pathname+window.location.hash;history.replaceState(history.state,"",T);let v=this._getObject(p);if(!v){this._showOverview();return}if(g){let k=v.tasks.find(w=>w.id===g);if(!k){this._showObject(p,x);return}this._showTask(p,g),m==="complete"?requestAnimationFrame(()=>{this._openCompleteDialog(p,g,k.name,this._features.checklists?k.checklist:void 0,this._features.adaptive&&!!k.adaptive_config?.enabled,{viaTagScan:!0})}):m==="skip"?requestAnimationFrame(()=>{k.allow_skip!==!1&&this._promptSkipTask(p,g)}):m==="quick_complete"&&requestAnimationFrame(()=>{this._handleQuickComplete(p,g,k)})}else this._showObject(p,x)}async _fetchDetailStats(e,t){if(!this._statsService)return;let i=(this._detailStatsSeq.get(e)??0)+1;this._detailStatsSeq.set(e,i);let s=await this._statsService.getDetailStats(e,t,this._chartRangeDays);if(this._detailStatsSeq.get(e)!==i)return;let r=new Map(this._detailStatsData);r.set(e,s),this._detailStatsData=r}_fetchRuleStats(e){let t=e?.trigger_config;if(!t)return;let i=Ce(t);i&&this._fetchDetailStats(i,Ue(t));for(let s of xt(t))s.entityId!==i&&this._fetchDetailStats(s.entityId,Ue(s.cond))}_setChartRange(e){if(e===this._chartRangeDays)return;this._chartRangeDays=e;try{q(P.chartRange,String(e))}catch{}let t=this._selectedEntryId&&this._selectedTaskId?this._getTask(this._selectedEntryId,this._selectedTaskId):null,i=Ce(t?.trigger_config);if(i){let s=new Map(this._detailStatsData);s.delete(i),this._detailStatsData=s,this._fetchDetailStats(i,Ue(t.trigger_config))}}_setHideOutliers(e){if(e!==this._hideOutliers){this._hideOutliers=e;try{q(P.chartHideOutliers,e?"1":"0")}catch{}}}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let e=[];for(let i of this._objects)for(let s of i.tasks){let r=s.battery_fleet_task?void 0:Ce(s.trigger_config);r&&e.push({entityId:r,isCounter:Ue(s.trigger_config)})}if(e.length===0)return;let t=await this._statsService.getBatchMiniStats(e);this._miniStatsData=new Map([...this._miniStatsData,...t])}async _subscribe(){let e=++this._subGen;try{let t=await this.hass.connection.subscribeMessage(i=>{let s=i,r=mr(this._objects,s);r!==null&&(this._objects=r,i.objects&&gs(r,this._stats??null),this._refreshKpis(),this._detailOpen()&&(s.objects||(s.delta||[]).some(c=>c.entry_id===this._selectedEntryId))&&this._fetchFullHistory(this._selectedEntryId,this._selectedTaskId))},{type:"maintenance_supporter/subscribe",deltas:!0,compact:!0});if(!this.isConnected||e!==this._subGen){t();return}this._unsub=t}catch{}}async _refreshKpis(){if(this._kpiRefreshInFlight){this._kpiRefreshPending=!0;return}this._kpiRefreshInFlight=!0;try{do{this._kpiRefreshPending=!1;let[e,t]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null)]);if(!this.isConnected)return;e&&(this._stats=e),t&&(this._budget=t,It(this._budget))}while(this._kpiRefreshPending)}finally{this._kpiRefreshInFlight=!1}}get _taskRows(){return this._rowsFiltered(!0)}_rowsFiltered(e,t=e){let i=[this._objects,this._groups,this._listSearch,this._showArchived,this._filterStatus,this._filterUser,this._filterLabel,this._filterPlace,this._filterPriority,this._sortMode,this.hass?.areas,this.hass?.user?.id,pe(),this._usersVersion];(i.length!==this._rowsMemoInputs.length||i.some((k,w)=>k!==this._rowsMemoInputs[w]))&&(this._rowsMemo=new Map,this._rowsMemoInputs=i,this._rowsGeneration++);let s=`${e}|${t}`,r=this._rowsMemo.get(s);if(r)return r;let c=[],d=t&&pe()?this._listSearch.trim():"";for(let k of this._objects)for(let w of k.tasks){if(d&&!Hs([w.name,k.object.name,...w.labels||[],k.object.area_id?this.hass?.areas?.[k.object.area_id]?.name:""].join(" "),d)||!this._showArchived&&w.archived||e&&this._filterStatus&&w.status!==this._filterStatus)continue;if(this._filterUser){let y=this._filterUser==="current_user"?this._userService?.getCurrentUserId():this._filterUser;if(!Gt(w,y))continue}if(this._filterLabel&&!(w.labels||[]).includes(this._filterLabel)||this._filterPlace&&(k.object.place||"home")!==this._filterPlace||this._filterPriority&&(w.priority||"normal")!==this._filterPriority)continue;let E=[];for(let y of Object.values(this._groups))y.task_refs?.some(D=>D.entry_id===k.entry_id&&D.task_id===w.id)&&E.push(y.name);c.push({entry_id:k.entry_id,task_id:w.id,object_name:k.object.name,allow_skip:w.allow_skip!==!1,notify_enabled:w.notify_enabled!==!1,task_name:w.name,type:w.type,schedule_type:w.schedule_type,status:w.status,days_until_due:w.days_until_due??null,next_due:w.next_due??null,last_performed:w.last_performed??null,next_event_titles:w.next_event_titles??[],trigger_active:w.trigger_active,trigger_detail:w.trigger_detail??null,trigger_current_value:w.trigger_current_value??null,trigger_current_delta:w.trigger_current_delta??null,trigger_config:w.trigger_config??null,trigger_entity_info:w.trigger_entity_info??null,battery_fleet_task:w.battery_fleet_task===!0,times_performed:w.times_performed,total_cost:w.total_cost,interval_days:w.interval_days??null,interval_unit:w.interval_unit??null,interval_anchor:w.interval_anchor??null,is_done:w.is_done??!1,archived:w.archived??!1,history:w.history||[],enabled:w.enabled,nfc_tag_id:w.nfc_tag_id??null,priority:w.priority??"normal",labels:w.labels??[],area_id:k.object.area_id??null,responsible_user_id:w.responsible_user_id??null,assignee_pool:w.assignee_pool??null,group_names:E})}let u=(k,w)=>Ze(k.status)-Ze(w.status),p=(k,w)=>(k.days_until_due??99999)-(w.days_until_due??99999),g=(k,w)=>u(k,w)||p(k,w),m=k=>k.area_id&&this.hass?.areas?.[k.area_id]?.name||"",b=k=>We(k).map(w=>this._userService?.getUserName(w)||"").filter(Boolean),x=k=>b(k).sort((w,E)=>w.localeCompare(E)).join(", "),T=k=>k.group_names[0]||"",v={due_date:g,object:(k,w)=>k.object_name.localeCompare(w.object_name)||g(k,w),type:(k,w)=>k.type.localeCompare(w.type)||g(k,w),task_name:(k,w)=>k.task_name.localeCompare(w.task_name),area:(k,w)=>{let E=m(k),y=m(w);return!E&&y?1:E&&!y?-1:E.localeCompare(y)||g(k,w)},assigned_user:(k,w)=>{let E=x(k),y=x(w);return!E&&y?1:E&&!y?-1:E.localeCompare(y)||g(k,w)},group:(k,w)=>{let E=T(k),y=T(w);return!E&&y?1:E&&!y?-1:E.localeCompare(y)||g(k,w)}};return c.sort(v[this._sortMode]),this._rowsMemo.set(s,c),c}_getObject(e){return this._objects.find(t=>t.entry_id===e)}_getTask(e,t){return this._getObject(e)?.tasks.find(s=>s.id===t)}_listRef(e,t){if(!this._refsInLists)return h;let i=this._getObject(e);return ht(Le(i?.object,i?.tasks.find(s=>s.id===t)))}_objRef(e){return this._refsInLists?ht(Pe(e)):h}_pushPanelState(e,t,i,s){let r={msp_view:e,msp_entry:t||null,msp_task:i||null,msp_area:s||null};this._deepLinkInPlace?history.replaceState(r,""):history.pushState(r,"")}_onPopState(e){let t=e.state;t?.msp_view&&this._applyPanelState(t)}_applyPanelState(e){(e.msp_view??"overview")!==this._view&&(this._restoreListScroll=!0),this._view=e.msp_view??"overview",this._selectedEntryId=e.msp_entry||null,this._selectedTaskId=e.msp_task||null,this._selectedAreaId=e.msp_area||null,this._moreMenuOpen=!1,this._objectSectionOverride=null,e.msp_view==="all_parts"&&this._loadAllParts(),(e.msp_view==="task"||e.msp_view==="object")&&e.msp_entry&&e.msp_task&&(this._historyFilter=null,this._fetchFullHistory(e.msp_entry,e.msp_task),this._fetchRuleStats(this._getTask(e.msp_entry,e.msp_task)))}_showOverview(e=!1){this._pushPanelState("overview"),e&&this._view!=="overview"&&(this._restoreListScroll=!0),this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,e||this._scrollContentToTop()}_showAllObjects(){this._pushPanelState("all_objects"),this._view="all_objects",this._objBulkMode=!1,this._objBulkSelected=new Set,this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_showAllParts(){this._pushPanelState("all_parts"),this._view="all_parts",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop(),this._loadAllParts()}async _loadAllParts(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});this._allParts=e.parts||[]}catch{this._allParts=[]}}_showAllAreas(){this._pushPanelState("all_areas"),this._view="all_areas",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_showArea(e){this._pushPanelState("area",null,null,e),this._view="area",this._selectedAreaId=e,this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_ensureAreaUi(){this._areaUi??=Promise.all([import("/maintenance_supporter_panelfiles/panel-chunks/areas-view-P4S2BVWD.js"),import("/maintenance_supporter_panelfiles/panel-chunks/area-view-XJSFQFAU.js")]).catch(()=>{this._areaUi=null})}_filterByStatus(e){this._filterStatus=e,this._activeViewId="",this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard"),this._scrollContentToTop()}get _allLabels(){let e=new Set;for(let t of this._objects)for(let i of t.tasks)for(let s of i.labels||[])e.add(s);return[...e].sort((t,i)=>t.localeCompare(i))}get _allPlaces(){let e=new Map;for(let t of this._objects){let i=t.object;i.place&&!e.has(i.place)&&e.set(i.place,i.place_name||i.place)}return[...e].map(([t,i])=>({id:t,name:i})).sort((t,i)=>t.name.localeCompare(i.name))}get _currentFilters(){return{status:this._filterStatus,user_id:this._filterUser,label:this._filterLabel,priority:this._filterPriority,place:this._filterPlace,archived:this._showArchived,sort_mode:this._sortMode,group_by:this._groupByMode}}_applyView(e){if(this._activeViewId=e,!e)return;let t=this._savedViews.find(s=>s.id===e);if(!t)return;let i=t.filters;this._filterStatus=i.status||"",this._filterUser=i.user_id||null,this._filterLabel=i.label||null,this._filterPriority=i.priority||"",this._filterPlace=i.place||"",this._showArchived=!!i.archived,Vi.includes(i.sort_mode)&&(this._sortMode=i.sort_mode),As.includes(i.group_by)&&(this._groupByMode=i.group_by);try{q(P.taskSort,this._sortMode),q(P.groupBy,this._groupByMode)}catch{}this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard")}_openSavedViewsDialog(){this.shadowRoot.querySelector("maintenance-saved-views-dialog")?.open(this._currentFilters,this._savedViews)}_onSavedViewsChanged(e){this._savedViews=e.detail.views||[],this._activeViewId&&!this._savedViews.some(t=>t.id===this._activeViewId)&&(this._activeViewId="")}_scrollContentToTop(){requestAnimationFrame(()=>{let e=this.shadowRoot?.querySelector(".content");e&&(e.scrollTop=0)})}_renderLineageLink(e,t){let i=e?this._objects.find(s=>s.entry_id===e):void 0;return i?o`<p class="meta">${t}:
      <a href="#" class="object-lineage-link" @click=${s=>{s.preventDefault(),this._showObject(i.entry_id)}}
        >${i.object.name}</a></p>`:h}_addSubObject(e){this._ui("maintenance-object-dialog").then(t=>t?.openCreate(e))}_moveHereChoices(e){let t=this._objects,i=new Set(ps(t,e).map(s=>s.entry_id));return t.filter(s=>s.entry_id!==e&&!i.has(s.entry_id)&&s.object.parent_entry_id!==e&&cs(s)).map(s=>({value:s.entry_id,label:Ka(t,s)})).sort((s,r)=>s.label.localeCompare(r.label))}async _moveObjectHere(e){let t=this._moveHereChoices(e);if(!t.length)return;let i=this._lang,s=this._objects.find(d=>d.entry_id===e)?.object.name??"",c=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("sub_object_move_here",i),message:a("sub_object_move_message",i).replace("{name}",s),confirmText:a("sub_object_move_confirm",i),inputLabel:a("object",i),inputValue:t[0].value,options:t});!c?.confirmed||!c.value||await this._runAction({type:"maintenance_supporter/object/update",entry_id:c.value,parent_entry_id:e},{successToast:a("sub_object_moved",i).replace("{name}",s)})}_toggleSubObjMenu(e){this._subObjMenu&&this._subObjMenu!==e&&(this._subObjMenu=null),this._togglePopup("sub-object",()=>this._subObjMenu!==null,t=>{this._subObjMenu=t?e:null})}_closeSubObjMenu(){this._subObjMenu=null}_renderSubObjMenu(e,t){return ot(this._subObjEntries(e,t),()=>this._closeSubObjMenu(),`sub-object-menu${this._subObjMenu==="head"?" sub-object-menu-head":""}`)}_subObjEntries(e,t,i=""){let s=r=>i?`${i}: ${r}`:r;return[{label:s(a("new_object",t).replace(/^\+\s*/,"")),icon:"mdi:package-variant-closed-plus",cls:"sub-object-new",action:()=>this._addSubObject(e)},{label:s(a("templates_from",t)),icon:"mdi:view-grid-plus-outline",cls:"sub-object-template",action:()=>{this._openTemplateGallery(e)}},this._moveHereChoices(e).length>0&&{label:s(a("sub_object_move_here",t)),icon:"mdi:folder-move-outline",cls:"sub-object-move",action:()=>{this._moveObjectHere(e)}}]}_objMenuEntries(e,t,i,s,r){let c=e.object,d=!i;return[{label:a("qr_code",s),action:()=>this._openQrForObject(e.entry_id,c.name)},{label:a("report_button",s),action:()=>this._printObjectReport(e.entry_id)},d&&!c.battery_fleet&&{label:a("duplicate",s),action:()=>this._duplicateObject(e.entry_id)},...d&&t?r?this._subObjEntries(e.entry_id,s,a("add_sub_object",s)):[{label:a("add_sub_object",s),cls:"add-sub-object-item",action:()=>this._toggleSubObjMenu("more")}]:[],d&&!c.archived&&{label:c.paused?a("resume_object",s):a("pause_object",s),action:()=>this._togglePauseObject(e.entry_id,!!c.paused)},d&&!c.archived&&!c.battery_fleet&&{label:a("replace_object",s),action:()=>this._replaceObject(e.entry_id,c)},d&&{label:c.archived?a("unarchive_object",s):a("archive_object",s),action:()=>this._toggleArchiveObject(e.entry_id,!!c.archived)},d&&"divider",d&&{label:a("delete",s),danger:!0,action:()=>this._deleteObject(e.entry_id)}]}_showObject(e,t=null){this._pushPanelState("object",e),this._view="object",this._selectedEntryId=e,this._selectedTaskId=null,this._objectSectionOverride=t,t?this._scrollToObjectSection(t):this._scrollContentToTop()}_scrollToObjectSection(e){this.updateComplete.then(()=>requestAnimationFrame(()=>{let t=this.shadowRoot?.querySelector(`.obj-section[data-section="${e}"]`);t?t.scrollIntoView({block:"start",behavior:"smooth"}):this._scrollContentToTop()}))}_toggleObjectSection(e){let t=new Set(this._objectSectionsCollapsed);this._objectSectionOverride===e||!t.has(e)?t.add(e):t.delete(e),this._objectSectionOverride===e&&(this._objectSectionOverride=null),this._objectSectionsCollapsed=t,q(P.objectSections,JSON.stringify([...t]))}_splitActive(){return this.split&&!this.narrow&&!this.tight&&this._view==="overview"&&this._overviewTab==="dashboard"&&!this._bulkMode}_detailOpen(){return(this._view==="task"||this._splitActive()||this._objectSplitActive())&&!!this._selectedEntryId&&!!this._selectedTaskId}_objectSplitActive(){return pe()&&this.split&&!this.narrow&&!this.tight&&this._view==="object"&&!this._objBulkMode}_showFullTaskPage(e,t){this._view!=="task"&&(this._pushPanelState("task",e,t),this._view="task",this._selectedEntryId=e,this._selectedTaskId=t,this._scrollContentToTop())}_showTask(e,t){let i=this._objectSplitActive()&&e===this._selectedEntryId;if(i&&history.replaceState({...history.state,msp_task:t},""),this._splitActive()||i){this._selectedEntryId=e,this._selectedTaskId=t,this._activeTab="overview",this._historyFilter=null,this._historySearch="",this._resetStickyPane(),this._fetchFullHistory(e,t),this._fetchRuleStats(this._getTask(e,t));return}this._pushPanelState("task",e,t),this._view="task",this._selectedEntryId=e,this._selectedTaskId=t,this._activeTab="overview",this._historyFilter=null,this._historySearch="",this._scrollContentToTop(),this._fetchFullHistory(e,t),this._fetchRuleStats(this._getTask(e,t))}_showToast(e,t="error"){if(pe()){qt(this,e);return}this._toastTimer&&clearTimeout(this._toastTimer),this._toastKind=t,this._toastUndo=null,this._toastActionLabel="",this._toastMessage=e,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastTimer=null},4e3)}_showActionToast(e,t,i){this._showUndoToast(e,i,t)}_showUndoToast(e,t,i=""){if(pe()){qt(this,e,{text:i||a("undo",this._lang),action:t});return}this._toastTimer&&clearTimeout(this._toastTimer),this._toastKind="info",this._toastActionLabel=i,this._toastMessage=e,this._toastUndo=t,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastUndo=null,this._toastTimer=null},7e3)}_runToastUndo(){let e=this._toastUndo;this._toastTimer&&clearTimeout(this._toastTimer),this._toastMessage="",this._toastUndo=null,this._toastTimer=null,e?.()}_openPalette(){this._paletteQuery="",this._paletteActive=0,this._paletteOpen=!0,this._searchRemote=null,this.updateComplete.then(()=>{this.shadowRoot?.querySelector(".palette-input")?.focus()})}_closePalette(){this._paletteOpen=!1,this._paletteQuery="",this._searchRemote=null,this._searchTimer&&(clearTimeout(this._searchTimer),this._searchTimer=null)}_onPaletteInput(e){this._paletteQuery=e,this._paletteActive=0,this._searchTimer&&clearTimeout(this._searchTimer);let t=e.trim();if(t.length<Ui){this._searchRemote=null;return}this._searchTimer=setTimeout(()=>{this._searchTimer=null;let i=++this._searchSeq;this.hass.connection.sendMessagePromise({type:"maintenance_supporter/search",query:t,limit:dt.documents}).then(s=>{i!==this._searchSeq||!this._paletteOpen||(this._searchRemote={query:t,documents:s.documents||[],history:s.history||[]})}).catch(()=>{i!==this._searchSeq||!this._paletteOpen||(this._searchRemote={query:t,documents:[],history:[]})})},Qo)}get _paletteResults(){let e=this._lang,t=this._paletteQuery.trim();if(t.length<Ui&&!Zt(t))return[];let i=Jt(t);if(!i.length)return[];let s=[],r=[],c=[],d=Zt(t);if(d){for(let m of this._objects){let b=m.object;if(b.ref_no!==d.object)continue;let x=Pe(b),T=(v,k)=>v?[k,a("archived",e)].filter(Boolean).join(" \xB7 "):k;d.task==null&&s.push({kind:"object",entryId:m.entry_id,label:b.name||"",sub:T(b.archived,a("object",e)),score:1e3,icon:"mdi:package-variant-closed",ref:x});for(let v of m.tasks)d.task!=null&&v.ref_no!==d.task||r.push({kind:"task",entryId:m.entry_id,taskId:v.id,label:v.name||"",sub:T(v.archived||b.archived,b.name||""),score:d.task==null?900:1e3,icon:"mdi:clipboard-check-outline",ref:Le(b,v)})}if(s.length||r.length){let m=this._searchRemote&&this._searchRemote.query===t?this._searchRemote:null,b=[...s,...r.slice(0,dt.tasks)];for(let x of m?.history.slice(0,1)??[])b.push({kind:"history",entryId:x.entry_id,taskId:x.task_id,label:x.task_name||"",sub:[x.object_name,x.timestamp?U(x.timestamp,e):""].filter(Boolean).join(" \xB7 "),snippet:x.snippet||"",score:x.score,icon:"mdi:note-text-outline",ref:x.ref??null});return b}}for(let m of this._objects){let b=m.object;if(b.archived)continue;let x=b.name||"",T=pt(i,[{text:x,weight:3},{text:b.manufacturer,weight:2},{text:b.model,weight:2},{text:b.serial_number,weight:2},{text:b.notes,weight:1}]);if(T>0){let v=[b.manufacturer,b.model].filter(Boolean).join(" ");s.push({kind:"object",entryId:m.entry_id,label:x,sub:v||a("object",e),score:T,icon:"mdi:package-variant-closed",ref:Pe(b)})}for(let v of m.tasks){if(v.archived)continue;let k=(v.labels||[]).join(" "),w=pt(i,[{text:v.name,weight:3},{text:x,weight:2},{text:k,weight:2},{text:v.notes,weight:1}]);if(w>0){let E=(v.labels||[]).length?`  #${(v.labels||[]).join(" #")}`:"";r.push({kind:"task",entryId:m.entry_id,taskId:v.id,label:v.name||"",sub:x+E,score:w,icon:"mdi:clipboard-check-outline",ref:Le(b,v)})}}for(let v of m.parts||[]){let k=pt(i,[{text:v.name,weight:3},{text:v.mpn,weight:2},{text:v.vendor,weight:1},{text:v.storage_location,weight:1},{text:v.notes,weight:1}]);k>0&&c.push({kind:"part",entryId:m.entry_id,label:v.name||"",sub:[x,v.mpn].filter(Boolean).join(" \xB7 "),score:k,icon:"mdi:cog-outline"})}}let u=(m,b)=>b.score-m.score||m.label.localeCompare(b.label),p=[...s.sort(u).slice(0,dt.objects),...r.sort(u).slice(0,dt.tasks),...c.sort(u).slice(0,dt.parts)],g=this._searchRemote&&this._searchRemote.query===t?this._searchRemote:null;if(g){let m=g.documents.slice(0,dt.documents);for(let b of[...m.filter(x=>x.match!=="content"),...m.filter(x=>x.match==="content")])p.push({kind:b.match==="content"?"content":"document",entryId:b.entry_id,docId:b.id,docKind:b.kind,url:b.url,page:b.page??null,label:fe(b),sub:b.object_name||"",snippet:b.snippet||"",score:b.score,icon:b.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"});for(let b of g.history.slice(0,dt.history))p.push({kind:"history",entryId:b.entry_id,taskId:b.task_id,label:b.task_name||"",ref:b.ref??null,sub:[b.object_name,b.timestamp?U(b.timestamp,e):""].filter(Boolean).join(" \xB7 "),snippet:b.snippet||"",score:b.score,icon:b.type==="skipped"?"mdi:skip-next-circle-outline":"mdi:note-text-outline"})}return p}_selectPaletteResult(e){let t=this._paletteQuery.trim();switch(this._closePalette(),e.kind){case"task":e.taskId&&this._showTask(e.entryId,e.taskId);return;case"history":if(!e.taskId)return;this._showTask(e.entryId,e.taskId),this._activeTab="history",this._historySearch=t;return;case"document":case"content":e.docKind==="weblink"?de(e.url)&&window.open(e.url,"_blank","noopener"):e.docId&&Fe(this.hass,e.docId,e.page?`#page=${e.page}`:"").catch(()=>{}),this._showObject(e.entryId,"documents");return;case"part":this._showObject(e.entryId,"parts");return;default:this._showObject(e.entryId)}}_renderPalette(){if(!this._paletteOpen)return h;let e=this._lang,t=this._paletteResults,i=this._paletteQuery.trim(),s={object:a("objects",e),task:a("tasks",e),part:a("search_group_parts",e),document:a("documents",e),content:a("search_group_content",e),history:a("search_group_history",e)},r=i.length>=Ui&&(!this._searchRemote||this._searchRemote.query!==i),c=null;return o`
      <div class="palette-backdrop top-layer" popover="manual" ${vt} @click=${()=>this._closePalette()}>
        <div class="palette" role="dialog" aria-label=${a("search_open",e)} @click=${d=>d.stopPropagation()}>
          <input
            class="palette-input"
            type="text"
            placeholder="${a("palette_placeholder",e)}"
            .value=${this._paletteQuery}
            @input=${d=>this._onPaletteInput(d.target.value)}
          />
          <div class="palette-results">
            ${i.length<Ui&&!Zt(i)?o`<div class="palette-empty">${a("search_empty_hint",e)}</div>`:t.length===0?o`<div class="palette-empty">${r?a("search_searching",e):a("palette_no_results",e)}</div>`:t.map((d,u)=>{let p=d.kind!==c?o`<div class="palette-group">${s[d.kind]}</div>`:h;return c=d.kind,o`
                      ${p}
                      <div class="palette-item ${u===this._paletteActive?"active":""} ${d.snippet?"has-snippet":""}"
                        @mouseenter=${()=>{this._paletteActive=u}}
                        @click=${()=>this._selectPaletteResult(d)}>
                        <ha-icon icon="${d.icon}"></ha-icon>
                        <div class="palette-main">
                          <div class="palette-line">
                            <span class="palette-label">${d.label}</span>
                            ${d.ref?o`<span class="ref-chip">#${d.ref}</span>`:h}
                            ${d.page?o`<span class="palette-page">${a("search_page",e).replace("{page}",String(d.page))}</span>`:h}
                            <span class="palette-sub">${d.sub}</span>
                          </div>
                          ${d.snippet?o`<div class="palette-snippet">${d.snippet}</div>`:h}
                        </div>
                      </div>
                    `})}
            ${t.length>0&&r?o`<div class="palette-group palette-waiting">${a("search_searching",e)}</div>`:h}
          </div>
          <div class="palette-hint">${a("palette_hint",e)}</div>
        </div>
      </div>
    `}_openAdoptProblemSensors(){this._ui("maintenance-adopt-problem-sensors-dialog").then(e=>e?.open())}async _onProblemSensorsAdopted(e){let t=e.detail?.tasks_created??0,i=e.detail?.created??[];await this._loadData();let s=ne("adopt_problem_done","adopt_problem_done_one",t,this._lang,"tasks");i.length>0?this._showActionToast(s,a("adopt_problem_configure",this._lang),()=>{let r=i.flatMap(c=>{let d=this._objects.find(u=>u.entry_id===c.entry_id)?.tasks.find(u=>u.id===c.task_id);return d?[{entryId:c.entry_id,task:d}]:[]});r.length>0&&this._ui("maintenance-task-dialog").then(c=>c?.openEditSeries(r))}):this._showToast(s,"info")}async _setupBatteryFleet(){let e=await I(this,{type:"maintenance_supporter/battery_fleet/setup",language:F(this.hass)},{reload:async()=>{this._batteryFleetSetupAvailable=!1,await this._loadData()},onError:s=>this._showToast(s)});if(e===void 0)return;let t=this._objects.find(s=>s.entry_id===e?.entry_id),i=t?.tasks.find(s=>s.id===e?.task_id)||t?.tasks[0];t&&i&&this._showTask(t.entry_id,i.id),this._showToast(a("battery_fleet_setup_done",this._lang),"info")}_openSuggestedSetups(){this._ui("maintenance-suggested-setups-dialog").then(e=>e?.open())}_onResetsWired(e){let t=e.detail?.wired??0;this._showToast(ne("reset_offers_done","reset_offers_done_one",t,this._lang,"count"),"info"),this._resetOffersLoaded=!1,this._resetOffersCount=0,this._maybeLoadResetOffers(),this._loadData()}_onSetupsAdopted(e){let t=e.detail?.tasks_created??0;this._showToast(ne("setups_done","setups_done_one",t,this._lang,"tasks"),"info"),this._loadData()}async _openTemplateGallery(e=null){this._templateParentId=e,this._templateGalleryOpen=!0,this._templatePreview=null;let t=await I(this,{type:"maintenance_supporter/templates",language:this._lang},{onError:i=>this._showToast(i)});t!==void 0&&(this._templateCategories=t?.categories||{},this._templates=(t?.templates||[]).filter(i=>!i.disabled),this._homeProfile=t?.profile??null)}async _createFromTemplate(e,t){let i=await I(this,{type:"maintenance_supporter/object/from_template",language:this._lang,template_id:e,...this._templateParentId?{parent_entry_id:this._templateParentId}:{},...t?{task_names:t}:{}},{busy:s=>{this._templateBusy=s},reload:async()=>{this._templateGalleryOpen=!1,this._templatePreview=null,await this._loadData()},successToast:a("template_created",this._lang),onSuccess:s=>this._showToast(s,"info"),onError:s=>this._showToast(s)});i?.entry_id&&this._showObject(i.entry_id)}_categoryName(e){let t=this._templateCategories[e];return t&&(t[`name_${this._lang}`]||t.name_en)||e}_renderTemplateCard(e,t=!1){let i=this._lang,s=this._homeProfile?.country??null;return o`
      <button class="template-card ${e.dwelling_mismatch?"not-typical":""}" .disabled=${this._templateBusy}
        title=${e.dwelling_mismatch?a("templates_not_typical",i):""}
        @click=${()=>this._features.beta_editor?this._openTemplatePreview(e):this._createFromTemplate(e.id)}>
        <span class="template-card-name">${e.name}</span>
        <span class="template-card-count">${ne("templates_task_count","templates_task_count_one",e.tasks.length,i)}</span>
        ${t&&e.reasons?.length?o`<span class="template-card-reasons">
              ${e.reasons.map(r=>o`<span class="template-card-reason">${ka(r,i,s)}</span>`)}
            </span>`:h}
        ${e.set_up?o`<span class="template-card-setup"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${a("templates_set_up",i)}</span>`:h}
      </button>
    `}_openTemplatePreview(e){this._templatePreview=e,this._templatePicked=new Set(e.tasks.map((t,i)=>i))}_toggleTemplateTask(e,t){let i=new Set(this._templatePicked);t?i.add(e):i.delete(e),this._templatePicked=i}_renderTemplatePreview(e){let t=this._lang,i=e.tasks,s=this._templatePicked,r=i.filter((u,p)=>s.has(p)).length,c=u=>u.interval_days&&u.interval_days>0?a("beta_rules_every",t).replace("{interval}",je(u.interval_days,"day",t)):a(u.schedule_type||"manual",t),d=()=>{this._templateGalleryOpen=!1,this._templatePreview=null};return o`
      <div class="palette-backdrop top-layer" popover="manual" ${vt} @click=${d}>
        <div class="template-gallery template-preview" @click=${u=>u.stopPropagation()}>
          <div class="template-gallery-head">
            <ha-icon-button class="template-preview-back" .label=${a("back",t)} .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
              @click=${()=>{this._templatePreview=null}}></ha-icon-button>
            <span class="template-preview-name">${e.name}</span>
            <ha-icon-button .label=${a("close",t)} .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
              @click=${d}></ha-icon-button>
          </div>
          <div class="template-gallery-body">
            <div class="template-cat-head">${a("beta_template_pick",t)}</div>
            ${i.map((u,p)=>o`
              ${Oe({cls:"template-preview-task",checked:s.has(p),onChange:g=>this._toggleTemplateTask(p,g.target.checked)},o`<span class="template-preview-text">
                  <span class="template-preview-task-name">${u.name}</span>
                  <span class="template-preview-rule">${c(u)}</span>
                </span>`)}`)}
            ${r===0?o`<div class="template-cat-hint template-preview-none">${a("beta_template_none",t)}</div>`:h}
            <div class="template-preview-actions">
              <ha-button class="template-preview-create" .disabled=${r===0||this._templateBusy}
                @click=${()=>this._createFromTemplate(e.id,i.filter((u,p)=>s.has(p)).map(u=>u.name))}>
                ${ne("beta_template_create","beta_template_create_one",r,t)}
              </ha-button>
            </div>
          </div>
        </div>
      </div>
    `}_renderTemplateGallery(){if(!this._templateGalleryOpen)return h;if(this._templatePreview)return this._renderTemplatePreview(this._templatePreview);let e=this._lang,t=new Map;for(let r of this._templates)t.has(r.category)||t.set(r.category,[]),t.get(r.category).push(r);for(let r of t.values())r.sort((c,d)=>+!!c.dwelling_mismatch-+!!d.dwelling_mismatch);let i=this._templates.filter(r=>r.recommended&&!r.set_up),s=this._templateParentId?this._objects.find(r=>r.entry_id===this._templateParentId):void 0;return o`
      <div class="palette-backdrop top-layer" popover="manual" ${vt} @click=${()=>{this._templateGalleryOpen=!1}}>
        <div class="template-gallery" @click=${r=>r.stopPropagation()}>
          <div class="template-gallery-head">
            <span>${a("templates_title",e)}</span>
            <ha-icon-button .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
              @click=${()=>{this._templateGalleryOpen=!1}}></ha-icon-button>
          </div>
          <div class="template-gallery-body">
            ${s?o`
              <div class="template-parent-hint">
                <ha-icon icon="mdi:file-tree-outline"></ha-icon>
                <span>${a("templates_inside",e).replace("{name}",s.object.name)}</span>
              </div>`:h}
            <div class="template-legal">
              <ha-icon icon="mdi:scale-balance"></ha-icon>
              <span>${a("templates_legal_hint",e)}</span>
            </div>
            ${i.length>0?o`
                  <div class="template-cat recommended">
                    <div class="template-cat-head">
                      <ha-icon icon="mdi:home-heart"></ha-icon>
                      ${a("templates_recommended_title",e)}
                    </div>
                    <div class="template-cat-hint">${a("templates_recommended_hint",e)}</div>
                    <div class="template-grid">${i.map(r=>this._renderTemplateCard(r,!0))}</div>
                  </div>`:h}
            ${this._templates.length===0?o`<div class="palette-empty">${a("loading",e)}…</div>`:[...t.entries()].map(([r,c])=>o`
                  <div class="template-cat">
                    <div class="template-cat-head">
                      <ha-icon icon="${this._templateCategories[r]?.icon||"mdi:folder-outline"}"></ha-icon>
                      ${this._categoryName(r)}
                    </div>
                    <div class="template-grid">${c.map(d=>this._renderTemplateCard(d))}</div>
                  </div>
                `)}
          </div>
        </div>
      </div>
    `}_bulkKey(e){return`${e.entry_id}:${e.task_id}`}_toggleBulkMode(){this._bulkMode=!this._bulkMode,this._bulkMenuOpen=!1,this._bulkMode||(this._bulkSelected=new Set)}_toggleBulkRow(e){let t=this._bulkKey(e),i=new Set(this._bulkSelected);i.has(t)?i.delete(t):i.add(t),this._bulkSelected=i}_bulkSelectAll(e){let t=e.map(s=>this._bulkKey(s)),i=t.every(s=>this._bulkSelected.has(s));this._bulkSelected=i?new Set:new Set(t)}async _runBulkItems(e,t,i,s,r){if(e.length===0)return;this._actionLoading=!0;let{done:c,failed:d}=await ha(this,e,t);this._actionLoading=!1,s(),await this._loadData();let u=ts(i(c.length),d,this._lang);r&&c.length>0?this._showUndoToast(u,()=>r(c)):this._showToast(u,d.length>0?"error":"info")}_runBulk(e,t,i,s){return this._runBulkItems(e.filter(r=>this._bulkSelected.has(this._bulkKey(r))),t,i,()=>{this._bulkSelected=new Set,this._bulkMode=!1},s)}async _bulkMove(e){let t=this._objects.filter(c=>!c.object.archived_at).sort((c,d)=>(c.object.name||"").localeCompare(d.object.name||""));if(!t.length||this._bulkSelected.size===0)return;let s=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("move_task_title",this._lang),message:a("bulk_move_message",this._lang),confirmText:a("move_task_title",this._lang),inputLabel:a("move_task_target",this._lang),inputValue:t[0].entry_id,options:t.map(c=>({value:c.entry_id,label:c.object.name||c.entry_id}))});if(!s?.confirmed||!s.value)return;let r=s.value;await this._runBulk(e.filter(c=>c.entry_id!==r),c=>({type:"maintenance_supporter/task/move",entry_id:c.entry_id,task_id:c.task_id,target_entry_id:r}),c=>a("bulk_moved",this._lang).replace("{n}",String(c)))}_toggleObjBulkMode(){this._objBulkMode=!this._objBulkMode,this._objBulkMode||(this._objBulkSelected=new Set)}_toggleObjBulk(e){let t=new Set(this._objBulkSelected);t.has(e)?t.delete(e):t.add(e),this._objBulkSelected=t}_objBulkSelectAll(e){let t=e.map(s=>s.entry_id),i=t.length>0&&t.every(s=>this._objBulkSelected.has(s));this._objBulkSelected=i?new Set:new Set(t)}_runObjBulk(e,t,i,s={}){return this._runBulkItems([...this._objBulkSelected],r=>({type:e,entry_id:r,...s}),t,()=>{this._objBulkSelected=new Set,this._objBulkMode=!1},i?r=>{i(r)}:void 0)}async _objBulkDelete(){let e=this._objBulkSelected.size;e===0||!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:a("delete",this._lang),message:a("bulk_delete_objects_confirm",this._lang).replace("{n}",String(e)),confirmText:a("delete",this._lang),danger:!0})||await this._runObjBulk("maintenance_supporter/object/delete",s=>a("bulk_objects_deleted",this._lang).replace("{n}",String(s)))}async _objBulkArea(){let e=[...this._objBulkSelected];if(e.length===0)return;let t=Object.values(this.hass?.areas||{}).sort((c,d)=>c.name.localeCompare(d.name)),s=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("area",this._lang),message:a("bulk_n_selected",this._lang).replace("{n}",String(e.length)),confirmText:a("save",this._lang),inputLabel:a("area",this._lang),inputValue:"",options:[{value:"",label:a("no_area",this._lang)},...t.map(c=>({value:c.area_id,label:c.name}))]});if(!s?.confirmed)return;let r=new Map(e.map(c=>[c,this._getObject(c)?.object.area_id??null]));this._runObjBulk("maintenance_supporter/object/update",c=>a("bulk_objects_area",this._lang).replace("{n}",String(c)),async c=>{for(let d of c)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:d,area_id:r.get(d)??null})}catch{}await this._loadData()},{area_id:s.value||null})}_objBulkArchive(){this._runObjBulk("maintenance_supporter/object/archive",e=>a("bulk_objects_archived",this._lang).replace("{n}",String(e)),async e=>{for(let t of e)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/unarchive",entry_id:t,undo:!0})}catch{}await this._loadData()})}_renderObjBulkBar(e,t){let i=this._objBulkSelected.size,s=e.length>0&&e.every(r=>this._objBulkSelected.has(r.entry_id));return o`
      <div class="bulk-bar obj-bulk-bar">
        ${Oe({cls:"bulk-selectall",checked:s,onChange:()=>this._objBulkSelectAll(e)},o`${a("bulk_select_all",t)}`)}
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
    `}_bulkComplete(e){this._runBulk(e,t=>({type:"maintenance_supporter/task/complete",entry_id:t.entry_id,task_id:t.task_id}),t=>a("bulk_completed",this._lang).replace("{n}",String(t)))}_bulkArchive(e){this._runBulk(e,t=>({type:"maintenance_supporter/task/archive",entry_id:t.entry_id,task_id:t.task_id}),t=>a("bulk_archived",this._lang).replace("{n}",String(t)),async t=>{for(let i of t)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/unarchive",entry_id:i.entry_id,task_id:i.task_id,undo:!0})}catch{}await this._loadData()})}async _bulkEdit(e,t){let i=t.filter(d=>this._bulkSelected.has(this._bulkKey(d)));if(i.length===0)return;let s=await this._ui("maintenance-bulk-edit-dialog"),r=this._userService?await this._userService.getUsers():[],c=await s?.open(e,i,r);c&&await this._sendBulkUpdate(i.map(d=>({entry_id:d.entry_id,task_id:d.task_id})),c)}async _sendBulkUpdate(e,t){let i=await I(this,{type:"maintenance_supporter/tasks/update_many",items:e,...t?{changes:t}:{}},{busy:d=>{this._actionLoading=d},onError:d=>this._showToast(d,"error")});if(!i)return;let s=t===null;s||(this._bulkSelected=new Set,this._bulkMode=!1),await this._loadData();let r=ua(i.failed,this._lang),c=ts(a("bulk_updated",this._lang).replace("{n}",String(i.updated.length)),r,this._lang);!s&&i.previous.length>0?this._showUndoToast(c,()=>{this._sendBulkUpdate(i.previous,null)}):this._showToast(c,r.length>0?"error":"info")}async _bulkPause(e){let t=e.filter(r=>this._bulkSelected.has(this._bulkKey(r))&&r.status!=="paused");if(t.length===0)return;let s=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("pause_task",this._lang),message:a("pause_task_prompt",this._lang),confirmText:a("pause_task",this._lang),inputLabel:a("pause_until_label",this._lang),inputType:"date"});s?.confirmed&&this._runBulk(t,r=>({type:"maintenance_supporter/task/pause",entry_id:r.entry_id,task_id:r.task_id,...s.value?{until:s.value}:{}}),r=>a("bulk_paused",this._lang).replace("{n}",String(r)),async r=>{for(let c of r)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/resume",entry_id:c.entry_id,task_id:c.task_id,undo:!0})}catch{}await this._loadData()})}_bulkResume(e){this._runBulk(e.filter(t=>t.status==="paused"),t=>({type:"maintenance_supporter/task/resume",entry_id:t.entry_id,task_id:t.task_id}),t=>a("bulk_resumed",this._lang).replace("{n}",String(t)))}async _runAction(e,t){let i=await I(this,e,{busy:s=>{this._actionLoading=s},reload:()=>this._loadData(),successToast:t?.successToast,onSuccess:s=>this._showToast(s,"info"),onError:s=>this._showToast(s)});return i===void 0?null:i??{}}async _deleteObject(e){if(!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:a("delete",this._lang),message:a("delete_object_confirm",this._lang),confirmText:a("delete",this._lang),danger:!0}))return;await this._runAction({type:"maintenance_supporter/object/delete",entry_id:e})&&this._showOverview()}_printObjectReport(e){let t=this._getObject(e);if(!t)return;let i=this._lang,s={title:a("report_title",i),generated:a("report_generated",i),manufacturer:a("manufacturer",i),model:a("model",i),serial:a("serial_number_label",i),installed:a("installed",i),warranty:a("warranty",i),area:a("area",i),notes:a("report_notes",i),tasksHeading:a("tasks",i),colTask:a("task_name",i),colType:a("report_col_type",i),colStatus:a("report_col_status",i),colSchedule:a("report_col_schedule",i),colLastDone:a("last_performed",i),colNextDue:a("next_due",i),colCost:a("cost",i),colTimes:a("report_times_done",i),totalCost:a("report_total_cost",i),scheduleLabel:c=>Re(c,i),none:"\u2014",statusLabel:c=>a(c,i),typeLabel:c=>a(c,i)},r=wr(t.object,t.tasks,s,c=>c?U(c,i):"",c=>Y(c,this._currencySymbol,i),new Date().toISOString());Lt(r)}async _duplicateObject(e){let t=await this._runAction({type:"maintenance_supporter/object/duplicate",entry_id:e},{successToast:a("object_duplicated",this._lang)});t?.entry_id&&this._showObject(t.entry_id)}async _deleteTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog"),s=await pa(i,this._getTask(e,t),this._lang);if(!s)return;await this._runAction({type:"maintenance_supporter/task/delete",entry_id:e,task_id:t,...s})&&this._showObject(e)}async _duplicateTask(e,t){this._moreMenuOpen=!1;let i=await this._runAction({type:"maintenance_supporter/task/duplicate",entry_id:e,task_id:t},{successToast:a("task_duplicated",this._lang)});i?.task_id&&this._showTask(e,i.task_id)}async _moveTask(e,t){this._moreMenuOpen=!1;let i=this._objects.filter(d=>d.entry_id!==e&&!d.object.archived_at).sort((d,u)=>(d.object.name||"").localeCompare(u.object.name||""));if(!i.length)return;let r=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("move_task_title",this._lang),message:a("move_task_message",this._lang),confirmText:a("move_task_title",this._lang),inputLabel:a("move_task_target",this._lang),inputValue:i[0].entry_id,options:i.map(d=>({value:d.entry_id,label:d.object.name||d.entry_id}))});if(!r?.confirmed||!r.value)return;let c=await this._runAction({type:"maintenance_supporter/task/move",entry_id:e,task_id:t,target_entry_id:r.value},{successToast:a("task_moved",this._lang)});c?.entry_id&&c.task_id&&this._showTask(c.entry_id,c.task_id)}async _toggleArchiveTask(e,t,i,s=!1){await this._runAction({type:i?"maintenance_supporter/task/unarchive":"maintenance_supporter/task/archive",entry_id:e,task_id:t,...s?{undo:!0}:{}})&&!i&&this._showUndoToast(a("task_archived",this._lang),()=>this._toggleArchiveTask(e,t,!0,!0))}async _togglePauseTask(e,t,i,s=!1){if(!i){let c=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("pause_task",this._lang),message:a("pause_task_prompt",this._lang),confirmText:a("pause_task",this._lang),inputLabel:a("pause_until_label",this._lang),inputType:"date"});if(!c?.confirmed)return;let d={type:"maintenance_supporter/task/pause",entry_id:e,task_id:t};c.value&&(d.until=c.value),await this._runAction(d)&&this._showUndoToast(a("task_paused",this._lang),()=>this._togglePauseTask(e,t,!0,!0));return}await this._runAction({type:"maintenance_supporter/task/resume",entry_id:e,task_id:t,...s?{undo:!0}:{}},{successToast:a("task_resumed",this._lang)})}async _toggleArchiveObject(e,t,i=!1){await this._runAction({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:e,...i?{undo:!0}:{}})&&!t&&this._showUndoToast(a("object_archived",this._lang),()=>this._toggleArchiveObject(e,!0,!0))}async _togglePauseObject(e,t,i=!1){if(!t){let r=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:a("pause_object",this._lang),message:a("pause_until_prompt",this._lang),confirmText:a("pause_object",this._lang),inputLabel:a("pause_until_label",this._lang),inputType:"date"});if(!r?.confirmed)return;let c={type:"maintenance_supporter/object/pause",entry_id:e};r.value&&(c.until=r.value),await this._runAction(c)&&this._showUndoToast(a("object_paused",this._lang),()=>this._togglePauseObject(e,!0,!0));return}await this._runAction({type:"maintenance_supporter/object/resume",entry_id:e,...i?{undo:!0}:{}},{successToast:a("object_resumed",this._lang)})}_replaceObject(e,t){this._ui("maintenance-object-dialog").then(i=>i?.openReplace(e,t))}_deviceSwapText(e){if(!e||!e.moved&&!e.unmatched.length)return"";let t=[];return e.moved&&t.push(ne("device_swap_moved","device_swap_moved_one",e.moved,this._lang,"count")),e.unmatched.length&&t.push(ne("device_swap_unmatched","device_swap_unmatched_one",e.unmatched.length,this._lang,"count")),t.join(" ")}async _skipTask(e,t,i){let s={type:"maintenance_supporter/task/skip",entry_id:e,task_id:t};i&&(s.reason=i),await this._runAction(s)}async _resetTask(e,t,i){let s={type:"maintenance_supporter/task/reset",entry_id:e,task_id:t};i&&(s.date=i),await this._runAction(s)}async _applySuggestion(e,t,i){await this._runAction({type:"maintenance_supporter/task/apply_suggestion",entry_id:e,task_id:t,interval:i})}_openSeasonalOverrides(e){let t=this.shadowRoot.querySelector("maintenance-seasonal-overrides-dialog");if(!t||!this._selectedEntryId)return;let i=e.adaptive_config?.seasonal_overrides;t.open(this._selectedEntryId,e.id,i)}async _reanalyzeInterval(e,t){let i=await this._runAction({type:"maintenance_supporter/task/analyze_interval",entry_id:e,task_id:t});i&&(i.recommended_interval?this._showToast(`${a("reanalyze_result",this._lang)}: ${ri(i.recommended_interval,this._lang)} (${a(`confidence_${i.confidence}`,this._lang)}, ${i.data_points} ${a("data_points",this._lang)})`,"info"):this._showToast(a("reanalyze_insufficient_data",this._lang),"info"))}async _promptSkipTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let s=await i.prompt({title:a("skip",this._lang),message:a("skip_reason_prompt",this._lang),confirmText:a("skip",this._lang),inputLabel:a("reason_optional",this._lang),inputType:"text"});s.confirmed&&this._skipTask(e,t,s.value||void 0)}async _promptResetTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let s=await i.prompt({title:a("reset",this._lang),message:a("reset_date_prompt",this._lang),confirmText:a("reset",this._lang),inputLabel:a("reset_date_optional",this._lang),inputType:"date"});s.confirmed&&this._resetTask(e,t,s.value||void 0)}async _postponeTask(e,t,i){await this._runAction({type:"maintenance_supporter/task/postpone",entry_id:e,task_id:t,until:i},{successToast:a("postponed",this._lang)})}async _promptPostponeTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let s=await i.prompt({title:a("postpone",this._lang),message:a("postpone_date_prompt",this._lang),confirmText:a("postpone",this._lang),inputLabel:a("postpone_date_label",this._lang),inputType:"date"});!s.confirmed||!s.value||this._postponeTask(e,t,s.value)}async _snoozeTask(e,t){let i=await this._runAction({type:"maintenance_supporter/task/snooze",entry_id:e,task_id:t});i&&this._showToast(er(i,this._lang),"info")}_dismissSuggestion(e,t){e&&t&&this._dismissedSuggestions.add(`${e}_${t}`),this.requestUpdate()}async _handleQuickComplete(e,t,i,s="qr"){let r=null,c=await I(this,{type:"maintenance_supporter/task/quick_complete",entry_id:e,task_id:t,source:s},{fallbackKey:"action_error",onError:(u,p)=>{r={message:u,code:p?.code||""}}});if(c===void 0){let{message:u,code:p}=r??{message:"",code:""};p==="no_defaults"||p==="completion_details_required"||p==="tag_scan_required"?this._openCompleteDialog(e,t,i.name,this._features.checklists?i.checklist:void 0,this._features.adaptive&&!!i.adaptive_config?.enabled,{viaTagScan:s==="qr",details:!0}):this._showToast(u);return}let d=_a(c,this._lang);if(d){this._showToast(d,"info");return}c?.undo?this._offerUndo(e,t,a("quick_complete_success",this._lang)):this._showToast(a("quick_complete_success",this._lang),"info");try{await this._loadData()}catch{}}async _printTaskWorksheet(e,t){let i=this._getObject(e),s=i?.tasks.find(d=>d.id===t);if(!i||!s)return;let r=li(),c=!1;this._actionLoading=!0;try{let d={type:"maintenance_supporter/qr/generate",entry_id:e,task_id:t,url_mode:"server"},[u,p]=await Promise.all([this.hass.connection.sendMessagePromise({...d,action:"view"}).catch(()=>null),this.hass.connection.sendMessagePromise({...d,action:"complete"}).catch(()=>null)]),g=null;try{let k=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:e})).documents||[]).find(w=>w.kind==="file"&&w.mime==="application/pdf"&&(w.task_ids||[]).includes(t)&&w.task_pages?.[t]);if(k){let w=k.task_pages[t],E=4,y={path:await da(this.hass,`/api/maintenance_supporter/document/${k.id}/excerpt?start=${w}&count=${E}`,3600)};g={title:fe(k)||"Manual",startPage:w,endPage:w+E-1,url:new URL(y.path,window.location.origin).toString(),vendorBase:new URL("/maintenance_supporter_vendor",window.location.origin).toString()}}}catch{}let m=this._lang,b={title:a("worksheet",m),object:a("object",m),type:a("maintenance_type",m),interval:a("interval",m),nextDue:a("next_due",m),lastDone:a("last_performed",m),priority:a("priority",m),checklist:a("checklist",m),notes:a("notes_label",m),scanView:a("worksheet_scan_view",m),scanComplete:a("worksheet_scan_complete",m),manualExcerpt:a("worksheet_manual_excerpt",m),pages:a("worksheet_pages",m),printedOn:a("worksheet_printed",m),never:a("worksheet_never",m),typeLabel:v=>a(v,m),statusLabel:v=>a(v,m),priorityLabel:v=>a(`priority_${v}`,m),parts:a("consumes_parts_label",m)},x=(s.consumes_parts||[]).map(v=>ya(v,i.entry_id,this._objects,m)),T=kr(s,i.object.name,b,v=>U(v,m),v=>Re(v,m),u?.svg_data_uri||null,p?.svg_data_uri||null,g,new Date().toISOString(),x,Le(i.object,s));Lt(T,r),c=!0}finally{c||r?.close(),this._actionLoading=!1}}_openManualDoc(e){if(e.kind!=="file"){de(e.url)&&window.open(e.url,"_blank","noopener");return}Fe(this.hass,e.id).catch(()=>{})}_setChecklistItem(e,t,i,s){let r=`${e}/${t}`;this._checklistPending.set(r,{...this._checklistPending.get(r)??{},[i]:s});let c=this._checklistChain.then(async()=>{let d=this._getObject(e)?.tasks.find(b=>b.id===t);if(!d)return;let u=this._checklistPending.get(r)??{},p={},g=pi(d)?.checklist??(d.checklist||[]);for(let b of g)p[b]=b in u?u[b]:d.checklist_progress?.[b]??!1;await this._runAction({type:"maintenance_supporter/task/checklist_progress",entry_id:e,task_id:t,checklist_state:p});let m=this._checklistPending.get(r);if(m){for(let[b,x]of Object.entries(p))b in m&&m[b]===x&&delete m[b];Object.keys(m).length===0&&this._checklistPending.delete(r)}});return this._checklistChain=c.catch(()=>{}),c}_openCompleteDialog(e,t,i,s,r,c){let d=this._getTask(e,t);if(!c?.details&&!c?.viaTagScan&&d&&nt(d)){this._handleQuickComplete(e,t,d,"panel");return}this._ui("maintenance-complete-dialog").then(u=>u&&this._fillAndOpenCompleteDialog(u,e,t,i,s,r,c))}_fillAndOpenCompleteDialog(e,t,i,s,r,c,d){Ea(e,ja({entryId:t,taskId:i,taskName:s,task:this._getTask(t,i),objects:this._objects,lang:this._lang,checklist:r,features:this._features,adaptiveEnabled:c,currencySymbol:this._currencySymbol,viaTagScan:d?.viaTagScan,partsCostMode:this._partsCostMode}),this._lang)}_openQrForObject(e,t){this._ui("maintenance-qr-dialog").then(i=>i?.openForObject(e,t))}_openQrForTask(e,t,i,s){this._ui("maintenance-qr-dialog").then(r=>r?.openForTask(e,t,i,s))}_offerUndo(e,t,i){this._showUndoToast(i,()=>{this._undoCompletion(e,t)})}async _undoCompletion(e,t){let i=await ma(this.hass,e,t,this._lang);this._showToast(i.message,i.ok?"info":"error"),i.ok&&await this._onDialogEvent()}render(){return o`
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
        <div class="content">${ms(this._renderView())}</div>
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
        .objects=${this._objects}
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
      ${this._toastMessage?o`<div class="toast ${this._toastKind}" role=${this._toastKind==="error"?"alert":"status"}>
        <span>${this._toastMessage}</span>
        ${this._toastUndo?o`<button class="toast-undo" @click=${()=>this._runToastUndo()}>${this._toastActionLabel||a("undo",this._lang)}</button>`:h}
      </div>`:h}
      ${this._renderPalette()}
      ${this._renderTemplateGallery()}
    `}_renderSearchButton(e){let t=this._lang;return o`<ha-icon-button
      class=${e}
      .path=${Jo}
      .label=${a("search_open",t)}
      title=${a("search_open",t)}
      @click=${()=>this._openPalette()}
    ></ha-icon-button>`}_renderView(){return this._view==="overview"?this._renderOverview():this._view==="all_objects"?this._renderAllObjects():[this._view==="all_parts"?this._renderAllParts():this._view==="all_areas"?this._renderAllAreas():this._view==="area"?this._renderArea():this._view==="object"?this._renderObjectDetail():this._renderTaskDetail()]}_renderHeader(){let e=[{label:a("maintenance",this._lang),action:()=>this._showOverview()}],t=(this._view==="object"||this._view==="task")&&this._selectedEntryId?ps(this._objects,this._selectedEntryId):[];for(let i of this.narrow?t.slice(-1):t)e.push({label:i.object.name,action:()=>this._showObject(i.entry_id)});if(this._view==="object"&&this._selectedEntryId){let i=this._getObject(this._selectedEntryId);e.push({label:i?.object.name||"Object"})}if(this._view==="task"&&this._selectedEntryId&&this._selectedTaskId){let i=this._getObject(this._selectedEntryId);e.push({label:i?.object.name||"Object",action:()=>this._showObject(this._selectedEntryId)});let s=this._getTask(this._selectedEntryId,this._selectedTaskId);e.push({label:s?.name||"Task"})}return this._view==="area"&&this._selectedAreaId&&(e.push({label:a("all_areas",this._lang),action:()=>this._showAllAreas()}),e.push({label:as(this._selectedAreaId,this.hass?.areas,a("no_area",this._lang))})),o`
      <div class="header">
        ${this.narrow&&!this.embedded?o`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`:h}
        ${this._view!=="overview"?o`<ha-icon-button
              .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
              @click=${()=>{this._view==="task"?this._showObject(this._selectedEntryId):this._view==="area"?this._showAllAreas():this._view==="object"&&t.length?this._showObject(t[t.length-1].entry_id):this._showOverview(!0)}}
            ></ha-icon-button>`:h}
        <div class="breadcrumbs">
          ${(pe()&&this.narrow?e.slice(-1):e).map((i,s)=>o`
              ${s>0?o`<span class="sep">/</span>`:h}
              ${i.action?o`<a @click=${i.action}>${i.label}</a>`:o`<span class="current">${i.label}</span>`}
            `)}
        </div>
        ${this._renderSearchButton("header-search")}
      </div>
    `}_renderOverview(){let e=this._lang,t=!!this.hass?.user?.is_admin,i=this._stats;return!t&&this._overviewTab==="settings"&&(this._overviewTab="dashboard"),o`
      ${i?o`
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
      ${Fi([{key:"today",label:a("tab_today",e)},{key:"dashboard",label:a("dashboard",e)},{key:"calendar",label:a("tab_calendar",e)},t&&{key:"settings",label:a("settings",e)}],this._overviewTab,s=>this._setOverviewTab(s),this.narrow?h:this._renderSearchButton("tab-search"))}
      ${ms(this._overviewTab==="today"?this._renderToday():this._overviewTab==="dashboard"?this._renderDashboard():vr(this._viewEntry,this._overviewTab==="calendar"?o`
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
    `}_statusBadge(e){return Ti(e,this._lang)}_setOverviewTab(e){this._overviewTab=e;try{q(P.overviewTab,e)}catch{}this._scrollContentToTop()}_renderToday(){let e=this._lang,t=this._rowsFiltered(!1),i=p=>`${p.entry_id}:${p.task_id}`,s=t.filter(p=>p.status==="overdue"),r=t.filter(p=>p.status==="triggered"),c=new Set([...s,...r].map(i)),d=t.filter(p=>!c.has(i(p))&&p.days_until_due===0);d.forEach(p=>c.add(i(p)));let u=t.filter(p=>!c.has(i(p))&&p.days_until_due!=null&&p.days_until_due>0&&p.days_until_due<=7);return s.length+r.length+d.length+u.length===0?o`
        <div class="today-empty">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <p>${a("today_all_caught_up",e)}</p>
        </div>
      `:o`
      <div class="today-view">
        ${this._renderTodaySection("today_overdue",s,"overdue")}
        ${this._renderTodaySection("triggered",r,"triggered")}
        ${this._renderTodaySection("today_due_today",d,"due_soon")}
        ${this._renderTodaySection("today_this_week",u,"")}
      </div>
    `}_peopleOf(e){return We(e).map(t=>this._userService?.getPerson(t)??null)}_renderTodaySection(e,t,i){if(t.length===0)return h;let s=this._lang,r=c=>this._filterUser?[]:this._peopleOf(c);return o`
      <div class="today-section">
        <div class="today-section-header ${i}">
          <span>${a(e,s)}</span><span class="today-badge">${t.length}</span>
        </div>
        ${t.map(c=>o`
          <div class="today-row" @click=${()=>this._showTask(c.entry_id,c.task_id)}>
            <span class="today-dot ${c.trigger_active?"triggered":c.status}"></span>
            <div class="today-main">
              <div class="today-task">${this._listRef(c.entry_id,c.task_id)}${c.task_name}${St(c.next_event_titles)}${jt(c.trigger_detail)}</div>
              <div class="today-object">
                <span class="today-object-text">${c.object_name} · ${c.days_until_due==null?Ss(c.last_performed,s)??"\u2014":Ie(c.days_until_due,s)}</span>
                ${rs(r(c),"today-person")}
              </div>
            </div>
            ${this._renderRowActions(s,()=>this._openCompleteDialogForRow(c),void 0,!1,this._isQuick(c))}
          </div>
        `)}
      </div>
    `}_renderDashboard(){let e=this._stats,t=this._taskRows,i=this._lang,s=this._isOperator,r=this._objects.reduce((v,k)=>v+k.tasks.filter(w=>w.archived).length,0),c=new Set;for(let v of this._objects)for(let k of v.tasks)for(let w of We(k))c.add(w);this._filterUser&&this._filterUser!=="current_user"&&c.add(this._filterUser);let d=[...c].map(v=>({id:v,name:this._userService?.getUserName(v)??null})).filter(v=>v.name!==null||v.id===this._filterUser).sort((v,k)=>(v.name??"").localeCompare(k.name??"")),u=(this._filterStatus?1:0)+(this._filterUser?1:0)+(this._filterLabel?1:0)+(this._filterPlace?1:0)+(this._filterPriority?1:0)+(this._activeViewId?1:0),p=!!(this._selectedEntryId&&this._selectedTaskId&&this._getTask(this._selectedEntryId,this._selectedTaskId)),g=this._splitActive()&&!(pe()&&this._filterPaneOpen&&!this.wide&&!p),m=o`
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
        ${this._filterSelect(a("views_label",i),this._activeViewId,v=>this._applyView(v.target.value),o`
            <option value="">${a("views_none",i)}</option>
            ${this._savedViews.map(v=>o`<option value=${v.id} ?selected=${this._activeViewId===v.id}>${v.name}</option>`)}
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
        ${this._filterSelect(a("filter_label",i),this._filterStatus,v=>{this._filterStatus=v.target.value,this._activeViewId=""},o`
            <option value="">${a("all",i)}</option>
            ${Ds.map(v=>o`<option value=${v} ?selected=${this._filterStatus===v}>${a(v,i)}</option>`)}
        `)}
        ${this._filterSelect(a("user_label",i),this._filterUser||"",v=>{let k=v.target.value;this._filterUser=k||null,this._activeViewId=""},o`
            <option value="">${a("all_users",i)}</option>
            <option value="current_user" ?selected=${this._filterUser==="current_user"}>${a("my_tasks",i)}</option>
            ${d.map(v=>o`<option value=${v.id} ?selected=${this._filterUser===v.id}>${v.name??v.id}</option>`)}
        `)}
        ${this._allLabels.length>0?o`
          ${this._filterSelect(a("label_filter",i),this._filterLabel||"",v=>{let k=v.target.value;this._filterLabel=k||null,this._activeViewId=""},o`
              <option value="">${a("all_labels",i)}</option>
              ${this._allLabels.map(v=>o`<option value=${v} ?selected=${this._filterLabel===v}>${v}</option>`)}
          `)}
        `:h}
        ${this._features.places&&this._allPlaces.length>0?o`
          ${this._filterSelect(a("filter_place",i),this._filterPlace,v=>{this._filterPlace=v.target.value,this._activeViewId=""},o`
              <option value="">${a("filter_place_all",i)}</option>
              <option value="home" ?selected=${this._filterPlace==="home"}>${a("place_home",i)}</option>
              ${this._allPlaces.map(v=>o`<option value=${v.id} ?selected=${this._filterPlace===v.id}>${v.name}</option>`)}
          `)}
        `:h}
        ${this._filterSelect(a("priority",i),this._filterPriority,v=>{this._filterPriority=v.target.value,this._activeViewId=""},o`
            <option value="">${a("all_priorities",i)}</option>
            ${hs.map(v=>o`<option value=${v} ?selected=${this._filterPriority===v}>${a(`priority_${v}`,i)}</option>`)}
        `)}
        ${this._filterSelect(a("sort_label",i),this._sortMode,v=>{this._sortMode=v.target.value,this._activeViewId="";try{q(P.taskSort,this._sortMode)}catch{}},o`
            <option value="due_date" ?selected=${this._sortMode==="due_date"}>${a("sort_due_date",i)}</option>
            <option value="object" ?selected=${this._sortMode==="object"}>${a("sort_object",i)}</option>
            <option value="type" ?selected=${this._sortMode==="type"}>${a("sort_type",i)}</option>
            <option value="task_name" ?selected=${this._sortMode==="task_name"}>${a("sort_task_name",i)}</option>
            <option value="area" ?selected=${this._sortMode==="area"}>${a("sort_area",i)}</option>
            <option value="assigned_user" ?selected=${this._sortMode==="assigned_user"}>${a("sort_assigned_user",i)}</option>
            <option value="group" ?selected=${this._sortMode==="group"}>${a("sort_group",i)}</option>
        `)}
        ${this._filterSelect(a("group_by_label",i),this._groupByMode,v=>{this._groupByMode=v.target.value,this._activeViewId="";try{q(P.groupBy,this._groupByMode)}catch{}},o`
            <option value="none" ?selected=${this._groupByMode==="none"}>${a("groupby_none",i)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${a("groupby_area",i)}</option>
            ${this._features.groups?o`<option value="group" ?selected=${this._groupByMode==="group"}>${a("groupby_group",i)}</option>`:h}
            <option value="user" ?selected=${this._groupByMode==="user"}>${a("groupby_user",i)}</option>
            <option value="object" ?selected=${this._groupByMode==="object"}>${a("groupby_object",i)}</option>
        `)}
        ${r>0?o`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived,this._activeViewId=""}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?a("hide_archived",i):`${a("show_archived",i)} (${r})`}
          </ha-button>
        `:h}
        ${!s&&t.length>0?o`
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
      ${t.length===0?o`
            <div class="empty-state">
              <ha-svg-icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></ha-svg-icon>
              <p>${a("no_tasks",i)}</p>
              ${!s&&this._objects.length===0?o`
                <p class="empty-onboard-hint">${a("onboard_hint",i)}</p>
                <div class="empty-onboard-actions">
                  <ha-button appearance="filled" @click=${()=>this._openTemplateGallery()}>
                    <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon> ${a("templates_from",i)}
                  </ha-button>
                  <ha-button appearance="plain" @click=${()=>this._ui("maintenance-object-dialog").then(v=>v?.openCreate())}>
                    ${a("new_object",i)}
                  </ha-button>
                </div>
              `:h}
            </div>
          `:o`
            ${this._bulkMode?this._renderBulkBar(t,i):h}
            ${g?o`
                  <div class="split-layout">
                    <div class="split-list">
                      ${this._groupByMode==="none"?this._renderTaskTable(t):this._renderGroupedTasks(t,i)}
                    </div>
                    <div class="split-pane">
                      ${this._selectedEntryId&&this._selectedTaskId&&this._getTask(this._selectedEntryId,this._selectedTaskId)?this._renderTaskDetail():o`<div class="split-pane-empty"><ha-icon icon="mdi:cursor-default-click-outline"></ha-icon><p>${a("split_select_hint",i)}</p></div>`}
                    </div>
                  </div>
                `:this._groupByMode==="none"?this._renderTaskTable(t):this._renderGroupedTasks(t,i)}
          `}
    `,T=pe()&&st();return o`
      ${T?o`
            <div class="ms-list-layout ${this._filterPaneOpen?"with-pane":""}">
              ${this._filterPaneOpen?this._renderFilterPane(d,r,s,i):h}
              <div class="ms-list-main">
                ${this._renderBetaToolbar(this._rowsFiltered(!0,!1).length,u,s,i)}
                ${b}${x}
              </div>
            </div>
            ${s?h:this._renderNewMenu(i,!this.embedded)}`:o`${m}${b}${x}`}

      ${this._features.groups&&!s?this._renderGroupsSection():h}
      ${s?h:o`<maintenance-storage-section-card
            .hass=${this.hass}
            .objects=${this._objects}
            @open-object=${v=>{let k=v.detail?.entry_id;k&&this._showObject(k)}}
          ></maintenance-storage-section-card>`}
    `}_renderBetaToolbar(e,t,i,s){let r={none:a("groupby_none",s),area:a("sort_area",s),group:a("sort_group",s),user:a("sort_assigned_user",s),object:a("object",s)},c={due_date:a("sort_due_date",s),object:a("sort_object",s),type:a("sort_type",s),task_name:a("sort_task_name",s),area:a("sort_area",s),assigned_user:a("sort_assigned_user",s),group:a("sort_group",s)},d=m=>o`<button class="ms-chip" slot="trigger" type="button">
      <span>${m}</span><ha-icon class="ms-chip-caret" icon="mdi:menu-down"></ha-icon></button>`,u=As.filter(m=>m!=="group"||this._features.groups),p=Vi.filter(m=>m!=="group"||this._features.groups),g=this._groupByMode;return o`
      <div class="ms-toolbar">
        ${this._filterPaneOpen?h:o`
          <button class="ms-chip ${t?"active":""}" type="button" aria-expanded="false" @click=${()=>this._toggleFilterPane()}>
            <ha-icon icon="mdi:filter-variant"></ha-icon><span>${a("beta_filters",s)}</span>
            ${t?o`<span class="ms-chip-badge">${t}</span>`:h}
          </button>`}
        ${!i&&e>0?o`
          <button class="ms-chip icon-only ${this._bulkMode?"active":""}" type="button" title=${a("bulk_select",s)} aria-label=${a("bulk_select",s)}
            aria-pressed=${this._bulkMode?"true":"false"} @click=${()=>this._toggleBulkMode()}>
            <ha-icon icon="mdi:order-bool-ascending-variant"></ha-icon>
          </button>`:h}
        <label class="ms-search">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input type="search" .value=${this._listSearchDraft} placeholder=${a("beta_search_tasks",s).replace("{count}",String(e))}
            aria-label=${a("beta_search_tasks",s).replace("{count}",String(e))}
            @input=${m=>this._onListSearchInput(m.target.value)} />
          ${this._listSearch||this._listSearchDraft?o`<button class="ms-search-clear" type="button" aria-label=${a("clear",s)} title=${a("clear",s)}
            @click=${()=>this._setListSearch("")}><ha-icon icon="mdi:close"></ha-icon></button>`:h}
        </label>
        ${Ge(d(g==="none"?a("group_by_label",s):`${a("group_by_label",s)} ${r[g]}`),u.map(m=>({label:r[m],selected:m===g,action:()=>this._setGroupBy(m)})),{cls:"ms-chip-menu"})}
        ${Ge(d(a("beta_sort_by",s).replace("{sort}",c[this._sortMode])),p.map(m=>({label:c[m],selected:m===this._sortMode,action:()=>this._setSortMode(m)})),{cls:"ms-chip-menu"})}
      </div>
    `}_toggleFilterPane(){this._filterPaneOpen=!this._filterPaneOpen,q(P.filterPane,this._filterPaneOpen?"1":"")}_setGroupBy(e){this._groupByMode=e,this._activeViewId="",q(P.groupBy,e)}_setSortMode(e){this._sortMode=e,this._activeViewId="",q(P.taskSort,e)}_renderFilterPane(e,t,i,s){let r=(p,g,m)=>o`
      <button class="ms-pane-option ${g?"on":""}" type="button" role="menuitemcheckbox" aria-checked=${g?"true":"false"} @click=${m}>
        <span class="ms-pane-option-label">${p}</span>
        <ha-icon icon=${g?"mdi:checkbox-marked":"mdi:checkbox-blank-outline"}></ha-icon>
      </button>`,c=(p,g,m,b)=>o`
      <ha-expansion-panel class="ms-pane-section" .expanded=${m||this._paneSections.has(p)}
        @expanded-changed=${x=>{if(x.target!==x.currentTarget)return;let T=new Set(this._paneSections);x.detail.expanded?T.add(p):T.delete(p),this._paneSections=T}}>
        <div slot="header" class="ms-pane-section-head">${g}${m?o`<span class="ms-chip-badge">1</span>`:h}</div>
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
          ${this._savedViews.map(p=>r(p.name,this._activeViewId===p.id,()=>this._applyView(this._activeViewId===p.id?"":p.id)))}
          ${i?h:o`<button class="ms-pane-link" type="button" @click=${()=>this._openSavedViewsDialog()}>${a("views_manage",s)}</button>`}
        `):h}
        ${c("status",a("beta_filter_status",s),!!this._filterStatus,Ds.map(p=>r(a(p,s),this._filterStatus===p,d(()=>{this._filterStatus=this._filterStatus===p?"":p}))))}
        ${c("user",a("user_label",s),!!this._filterUser,o`
          ${r(a("my_tasks",s),this._filterUser==="current_user",d(()=>{this._filterUser=this._filterUser==="current_user"?null:"current_user"}))}
          ${e.map(p=>r(p.name??p.id,this._filterUser===p.id,d(()=>{this._filterUser=this._filterUser===p.id?null:p.id})))}
        `)}
        ${this._allLabels.length?c("label",a("label_filter",s),!!this._filterLabel,this._allLabels.map(p=>r(p,this._filterLabel===p,d(()=>{this._filterLabel=this._filterLabel===p?null:p})))):h}
        ${this._features.places&&this._allPlaces.length?c("place",a("filter_place",s),!!this._filterPlace,o`
          ${r(a("place_home",s),this._filterPlace==="home",d(()=>{this._filterPlace=this._filterPlace==="home"?"":"home"}))}
          ${this._allPlaces.map(p=>r(p.name,this._filterPlace===p.id,d(()=>{this._filterPlace=this._filterPlace===p.id?"":p.id})))}
        `):h}
        ${c("priority",a("priority",s),!!this._filterPriority,hs.map(p=>r(a(`priority_${p}`,s),this._filterPriority===p,d(()=>{this._filterPriority=this._filterPriority===p?"":p}))))}
        ${t>0?c("archived",a("show_archived",s),this._showArchived,r(`${a("show_archived",s)} (${t})`,this._showArchived,d(()=>{this._showArchived=!this._showArchived}))):h}
      </aside>
    `}_onListSearchInput(e){this._listSearchDraft=e,clearTimeout(this._listSearchTimer),this._listSearchTimer=window.setTimeout(()=>this._setListSearch(this._listSearchDraft),Xo)}_setListSearch(e){clearTimeout(this._listSearchTimer),this._listSearchDraft=e,this._listSearch=e}_clearFilters(){this._filterStatus="",this._filterUser=null,this._filterLabel=null,this._filterPlace="",this._filterPriority="",this._activeViewId=""}_renderTaskTable(e){let t=this._bulkMode?" bulk":"";if(this._virtTotalRows=e.length,e.length<120)return this._virtRenderedSig="",o`
        <div class="task-table${t}">
          ${this._renderTaskHead()}
          ${this._renderRows(e)}
        </div>
      `;let i=e.length,s=e.map(Ps);(s.length!==this._virtKeys.length||s.some((g,m)=>g!==this._virtKeys[m]))&&(this._virtPasses=0),this._virtKeys=s;let r=this._virtHeights.offsets(s),c=Math.max(0,Math.min(this._virtStart,i)),d=this._virtEnd>0?Math.min(this._virtEnd,i):Math.min(i,40);d<c&&(c=0,d=Math.min(i,40)),this._virtRenderedStart=c,this._virtRenderedSig=`${this._rowsGeneration}:${c}:${d}:${i}`;let u=r[c],p=r[i]-r[d];return o`
      <div class="task-table${t} virtual">
        ${this._renderTaskHead()}
        ${this._renderVirtSizerRow(e)}
        ${u>0?o`<div class="virt-spacer" style="height:${u}px"></div>`:h}
        ${this._renderRows(e.slice(c,d))}
        ${p>0?o`<div class="virt-spacer" style="height:${p}px"></div>`:h}
      </div>
    `}_renderTaskHead(){if(!pe()||this.narrow||this.tight)return h;let e=this._lang,t=(i,s,r)=>r?o`<button class="th ${s} sortable ${this._sortMode===r?"active":""}" type="button" role="columnheader"
          aria-sort=${this._sortMode===r?"ascending":"none"} @click=${()=>this._setSortMode(r)}>
          ${this._sortMode===r?o`<ha-icon icon="mdi:arrow-up"></ha-icon>`:h}<span>${i}</span></button>`:o`<span class="th ${s}" role="columnheader">${i}</span>`;return o`
      <div class="task-head" role="row">
        ${this._bulkMode?o`<span></span>`:h}
        ${t(a("beta_filter_status",e),"th-status")}
        ${t(a("object",e),"th-object","object")}
        ${t(a("task_name",e),"th-task","task_name")}
        <span class="th th-sub"></span>
        ${t(a("sort_type",e),"th-type","type")}
        ${t(a("sort_due_date",e),"th-due","due_date")}
        <span class="th th-actions"></span>
      </div>`}_renderVirtSizerRow(e){let t=this._lang,i="",s=!1,r=!1,c=!1;for(let d of e){let u=nr(rr(d),t);u.length>i.length&&(i=u),d.enabled||(s=!0),d.nfc_tag_id&&(r=!0),(d.priority==="high"||d.priority==="low")&&(c=!0)}return o`
      <div class="task-row virt-sizer" aria-hidden="true">
        ${this._bulkMode?o`<span></span>`:h}
        <span class="cell-badges">
          <span class="status-badge"><ha-svg-icon .path=${Gs}></ha-svg-icon><span class="status-label">${i}</span></span>
          ${s?o`<span class="badge-disabled">${a("disabled",t)}</span>`:h}
          ${r?o`<span class="nfc-badge"><ha-svg-icon .path=${Ji}></ha-svg-icon></span>`:h}
          ${c?o`<span class="priority-badge"><ha-svg-icon .path=${Yi}></ha-svg-icon></span>`:h}
        </span>
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
    `}_renderBulkBar(e,t){let i=this._bulkSelected.size,s=e.length>0&&e.every(r=>this._bulkSelected.has(this._bulkKey(r)));return o`
      <div class="bulk-bar">
        ${Oe({cls:"bulk-selectall",checked:s,onChange:()=>this._bulkSelectAll(e)},o`${a("bulk_select_all",t)}`)}
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
            ${(()=>{let r=[{label:a("move_task",t),cls:"bulk-move",action:()=>{this._bulkMove(e)}},{label:`${a("bulk_assign",t)}\u2026`,cls:"bulk-assign",action:()=>{this._bulkEdit("assign",e)}},{label:`${a("labels",t)}\u2026`,cls:"bulk-labels",action:()=>{this._bulkEdit("labels",e)}},{label:`${a("edit",t)}\u2026`,cls:"bulk-edit",action:()=>{this._bulkEdit("edit",e)}},{label:`${a("pause_task",t)}\u2026`,cls:"bulk-pause",action:()=>{this._bulkPause(e)}},{label:a("resume_task",t),cls:"bulk-resume",action:()=>this._bulkResume(e)}],c=i===0||this._actionLoading;return st()?Ge(o`<ha-button slot="trigger" appearance="plain" class="bulk-more" title=${a("more_actions",t)} aria-label=${a("more_actions",t)} .disabled=${c}>
                    <ha-icon icon="mdi:dots-vertical"></ha-icon>
                  </ha-button>`,r):o`<ha-button appearance="plain" class="bulk-more" title=${a("more_actions",t)} aria-label=${a("more_actions",t)} .disabled=${c}
                    @click=${d=>{d.stopPropagation(),this._bulkMenuOpen=!this._bulkMenuOpen}}>
                    <ha-icon icon="mdi:dots-vertical"></ha-icon>
                  </ha-button>
                  ${this._bulkMenuOpen?ot(r,()=>{this._bulkMenuOpen=!1}):h}`})()}
          </span>
        </span>
      </div>
    `}_renderGroupedTasks(e,t){let i=new Map,s=a("unassigned",t);for(let m of e){let b=[];if(this._groupByMode==="area")b=[Bt(m.area_id,this.hass?.areas,a("no_area",t))];else if(this._groupByMode==="user"){let x=We(m).map(T=>this._userService?.getUserName(T)).filter(T=>!!T);b=x.length>0?[...new Set(x)]:[s]}else this._groupByMode==="group"?b=m.group_names.length>0?m.group_names:[s]:this._groupByMode==="object"&&(b=[m.object_name]);for(let x of b)i.has(x)||i.set(x,[]),i.get(x).push(m)}let r=[...i.entries()].sort(([m],[b])=>m===s&&b!==s?1:b===s&&m!==s?-1:m.localeCompare(b)),c=this._groupByMode==="area"?Xi:this._groupByMode==="group"?Qi:this._groupByMode==="object"?Ks:Vs,u=r.reduce((m,[b,x])=>m+(this._collapsedGroups.has(b)?0:x.length),0)>=120;this._virtGroups=u?r.map(([m,b])=>({key:m,keys:this._collapsedGroups.has(m)?[]:b.map(Ps)})):[];let p=this._virtGroups.map(m=>`${m.key}${m.keys.join("")}`).join("");p!==this._virtGroupSig&&(this._virtPasses=0),this._virtGroupSig=p;let g=40;return this._virtGroupDrawn=this._virtGroups.map(m=>{let b=m.keys.length,x=this._virtGroupWin.get(m.key);if(x){let v=Math.min(x[0],b);return[v,Math.max(v,Math.min(x[1],b))]}let T=Math.min(b,g);return g-=T,[0,T]}),this._virtRenderedSig=u?`${this._rowsGeneration}:g:${this._virtGroupDrawn.map(m=>m.join("-")).join(",")}`:"",o`
      <div class="task-table grouped${this._bulkMode?" bulk":""}${u?" virtual":""}">
        ${this._renderTaskHead()}
        ${u?this._renderVirtSizerRow(e):h}
        ${r.map(([m,b],x)=>{let T=!this._collapsedGroups.has(m);return o`
            <div class="group-section" ?open=${T}>
              <div
                class="group-section-header"
                role="button"
                tabindex="0"
                aria-expanded=${T?"true":"false"}
                @click=${()=>this._toggleGroup(m)}
                @keydown=${v=>{(v.key==="Enter"||v.key===" ")&&(v.preventDefault(),this._toggleGroup(m))}}
              >
                <ha-svg-icon .path=${c}></ha-svg-icon>
                <span>${m}</span>
                <span class="group-section-count">(${b.length})</span>
              </div>
              ${T?o`<div class="group-rows">${u?this._renderGroupWindow(this._virtGroups[x].keys,this._virtGroupDrawn[x],b):this._renderRows(b)}</div>`:h}
            </div>
          `})}
      </div>
    `}_renderGroupWindow(e,[t,i],s){let r=this._virtGroupHeights.offsets(e),c=r[t],d=r[e.length]-r[i];return o`
      ${c>0?o`<div class="virt-spacer" style="height:${c}px"></div>`:h}
      ${this._renderRows(s.slice(t,i))}
      ${d>0?o`<div class="virt-spacer" style="height:${d}px"></div>`:h}
    `}_toggleGroup(e){let t=new Set(this._collapsedGroups);t.has(e)?t.delete(e):t.add(e),this._collapsedGroups=t}_warrantyLabel(e,t,i){return e.kind==="expired"?a("warranty_expired",i):e.kind==="expiring"?a("warranty_expires_in",i).replace("{days}",String(e.days??0)):a("warranty_valid_until",i).replace("{date}",U(t,i))}_renderWarrantyMeta(e,t){let i=bs(e);return o`<p class="meta">${a("warranty",t)}:
      <span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,e,t)}</span></p>`}_filterSelect(e,t,i,s){let r=La({label:e,value:t,onChange:i},s);return Ha()?o`<div class="filter-field">${r}</div>`:o`<label class="filter-field"><span class="filter-label">${e}</span>${r}</label>`}_renderAllObjects(){let e=this._lang,t=this._isOperator,i=this._objectViewMode==="table"&&!this.narrow,s=this._objects.filter(p=>p.object.archived).length,r=this._objects.filter(p=>this._showArchived||!p.object.archived),c=p=>this._arrangeObjects(p,!this._objBulkMode),d=c(r),u=()=>{let p=new Map;for(let g of r){let m=Bt(g.object.area_id,this.hass?.areas,a("no_area",e));p.has(m)||p.set(m,[]),p.get(m).push(g)}return[...p.entries()].sort(([g],[m])=>g.localeCompare(m))};return o`
      <div class="breadcrumb">
        <ha-icon-button .label=${a("back",e)} @click=${()=>this._showOverview(!0)}>
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
        ${this._filterSelect(a("sort_label",e),this._objectSortMode,p=>{this._objectSortMode=p.target.value;try{q(P.objectSort,this._objectSortMode)}catch{}this._setObjTableSort(null)},o`
            <option value="alphabetical" ?selected=${this._objectSortMode==="alphabetical"}>${a("sort_alphabetical",e)}</option>
            <option value="due_soonest" ?selected=${this._objectSortMode==="due_soonest"}>${a("sort_due_soonest",e)}</option>
            <option value="task_count" ?selected=${this._objectSortMode==="task_count"}>${a("sort_task_count",e)}</option>
        `)}
        ${this.narrow?h:o`
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
        ${i?h:o`
        ${this._filterSelect(a("group_by_label",e),this._groupByMode,p=>{this._groupByMode=p.target.value;try{q(P.groupBy,this._groupByMode)}catch{}},o`
            <option value="none" ?selected=${this._groupByMode==="none"}>${a("groupby_none",e)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${a("groupby_area",e)}</option>
        `)}
        `}
        ${t?h:o`
          <ha-button
            @click=${()=>this._ui("maintenance-object-dialog").then(p=>p?.openCreate())}
          >
            ${a("new_object",e)}
          </ha-button>
        `}
        <ha-button appearance="plain" @click=${()=>this._exportObjectsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${a("settings_export_csv",e)}
        </ha-button>
        ${t?h:o`
          <ha-button appearance="plain" class="bulk-toggle obj-bulk-toggle ${this._objBulkMode?"active":""}" @click=${()=>this._toggleObjBulkMode()}>
            <ha-icon icon="mdi:checkbox-multiple-marked-outline"></ha-icon>
            ${this._objBulkMode?a("cancel",e):a("bulk_select",e)}
          </ha-button>
        `}
        ${s>0?o`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?a("hide_archived",e):`${a("show_archived",e)} (${s})`}
          </ha-button>
        `:h}
      </div>
      ${this._objBulkMode?this._renderObjBulkBar(d.roots,e):h}
      ${i?this._renderObjectsTable(d):this._groupByMode==="area"?o`
          ${u().map(([p,g])=>{let m=c(g);return o`
            ${gi({cls:"group-section",open:!0,headerCls:"group-section-header",header:o`
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <span>${p}</span>
                <span class="group-section-count">(${g.length})</span>`},o`
              <div class="objects-grid">${m.roots.map(b=>this._renderObjectCard(b,m))}</div>
            `)}
          `})}
        `:o`<div class="objects-grid">${d.roots.map(p=>this._renderObjectCard(p,d))}</div>`}
    `}_arrangeObjects(e,t=!0){let i=t?Ga(e):{roots:[...e],children:new Map},s=(d,u)=>d.object.name.localeCompare(u.object.name);if(this._objectSortMode==="alphabetical")return wi(i,s),i;let r=new Map;for(let d of e){let u=ds(i,d);if(this._objectSortMode==="task_count")r.set(d.entry_id,u.reduce((p,g)=>p+g.tasks.length,0));else{let p=1/0;for(let g of u)for(let m of g.tasks){let b=m.days_until_due;b!=null&&b<p&&(p=b)}r.set(d.entry_id,p)}}let c=d=>r.get(d.entry_id)??0;return wi(i,this._objectSortMode==="task_count"?(d,u)=>c(u)-c(d)||s(d,u):(d,u)=>c(d)-c(u)||s(d,u)),i}_renderObjectCard(e,t){let i=this._lang,s=t.children.get(e.entry_id)??[],r=p=>p.tasks.some(g=>Dt(g.status)),c=p=>ds(t,p).some(r),d=c(e),u=this._objBulkMode&&this._view==="all_objects";return o`
      <div class="object-card${d?" object-card-overdue":""}${u?" selectable":""}${u&&this._objBulkSelected.has(e.entry_id)?" bulk-selected":""}"
        data-entry-id=${e.entry_id}
        @click=${()=>u?this._toggleObjBulk(e.entry_id):this._showObject(e.entry_id)}>
        ${u?o`<label class="obj-bulk-check bulk-check" @click=${p=>p.stopPropagation()}>
              <input type="checkbox" .checked=${this._objBulkSelected.has(e.entry_id)} @change=${()=>this._toggleObjBulk(e.entry_id)} />
            </label>`:h}
        ${d?o`<span class="overdue-dot" title="${a("has_overdue",i)}"></span>`:h}
        <div class="object-card-header">
          <span class="object-card-name">${this._objRef(e.object)}${e.object.name}</span>
          ${e.object.paused?o`<span class="paused-badge" title="${a("object_paused_badge",i)}${e.object.paused_until?` \u2014 ${U(e.object.paused_until,i)}`:""}">
                <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
              </span>`:h}
          ${e.object.document_count?o`<span class="doc-badge" title="${Is(e.object.document_count,i)}">
                <ha-icon icon="mdi:paperclip"></ha-icon>${e.object.document_count}
              </span>`:h}
          <span class="object-card-count">${s.length&&!e.tasks.length?ne("sub_objects_count","sub_objects_count_one",s.length,i):ne("templates_task_count","templates_task_count_one",e.tasks.length,i)}</span>
        </div>
        ${e.object.manufacturer||e.object.model?o`<div class="object-card-meta">${[e.object.manufacturer,e.object.model].filter(Boolean).join(" ")}</div>`:h}
        ${s.length?o`<div class="object-card-children" aria-label=${a("sub_objects",i)}>
              ${s.map(p=>{let g=t.children.get(p.entry_id)?.length??0;return o`<button class="object-child-chip${c(p)?" overdue":""}"
                  data-entry-id=${p.entry_id}
                  title=${c(p)?`${p.object.name}: ${a("has_overdue",i)}`:p.object.name}
                  @click=${m=>{m.stopPropagation(),this._showObject(p.entry_id)}}
                  ><span class="object-child-name">${p.object.name}</span>${g?o`<span class="object-child-count">${g}</span>`:h}</button>`})}
            </div>`:e.tasks.length===0?o`<div class="object-card-empty">${a("no_tasks_yet",i)}</div>`:h}
      </div>
    `}_setObjectViewMode(e){this._objectViewMode=e;try{q(P.objectView,e)}catch{}}_renderAllParts(){let e=this._lang,t=this._allParts,i=this._currencySymbol;return o`
      <div class="breadcrumb">
        <ha-icon-button .label=${a("back",e)} @click=${()=>this._showAllObjects()}>
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
      ${t===null?o`<div class="empty-state">…</div>`:t.length===0?o`<div class="empty-state">${a("parts_section",e)}: 0</div>`:o`
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
                ${t.map(s=>o`
                  <tr class="objects-table-row" @click=${()=>this._showObject(s.entry_id)}>
                    <td>
                      <span class="objects-table-name">${this._objRef(this._getObject(s.entry_id)?.object)}${s.name}</span>
                      ${s.low?o`<ha-icon class="part-low-icon" icon="mdi:cart-arrow-down"
                            title="${a("part_reorder_threshold",e)}: ${s.reorder_threshold}"></ha-icon>`:h}
                    </td>
                    <td>${s.object_name||"\u2014"}</td>
                    <td class="all-parts-stock">${s.stock!==null?et(s.stock,s.unit,e):"\u2014"}${this._renderAllPartsUse(s)}${this._renderAllPartsBought(s)}</td>
                    <td>${s.reorder_threshold??"\u2014"}</td>
                    <td>${s.cost!=null?s.package_size?`${Y(s.cost,i,e)} / ${et(s.package_size,s.unit??void 0,e)}`:Y(s.cost,i,e):"\u2014"}</td>
                    <td>${s.storage_location||"\u2014"}</td>
                    <td>
                      ${s.consumers.length===0?"\u2014":s.consumers.map(r=>o`
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
    `}_renderAllPartsUse(e){if(this._isOperator||!(typeof e.stock=="number"&&e.stock>0))return h;let t=!!this._getObject(e.entry_id)?.object.battery_fleet;return o`<ms-part-use
      nowrap
      .hass=${this.hass}
      .entryId=${e.entry_id}
      .sparePart=${{id:e.part_id,unit:e.unit??void 0,package_size:e.package_size??void 0}}
      ?notBooked=${bt(e,this._partsCostMode,t)==="use"}
      @part-used=${()=>{this._loadAllParts(),this._loadData()}}
    ></ms-part-use>`}_renderAllPartsBought(e){if(this._isOperator||typeof e.stock!="number")return h;let t=!!this._getObject(e.entry_id)?.object.battery_fleet;return o`<ms-part-purchase
      .hass=${this.hass}
      .entryId=${e.entry_id}
      .sparePart=${{id:e.part_id,unit:e.unit??void 0,package_size:e.package_size??void 0,cost:e.cost??void 0,restock_quantity:e.restock_quantity??void 0}}
      .currencySymbol=${this._currencySymbol}
      ?onUse=${bt(e,this._partsCostMode,t)==="use"}
      @part-bought=${()=>{this._loadAllParts(),this._loadData()}}
    ></ms-part-purchase>`}_renderAllAreas(){let e=this._lang;return this._ensureAreaUi(),o`
      <div class="breadcrumb">
        <ha-icon-button .label=${a("back",e)} @click=${()=>this._showAllObjects()}>
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
    `}_renderArea(){if(!this._selectedAreaId)return h;let e=this._lang;return this._ensureAreaUi(),o`
      <div class="breadcrumb">
        <ha-icon-button .label=${a("back",e)} @click=${()=>this._showAllAreas()}>
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
    `}_exportPartsCsv(){let e=this._allParts||[],t=c=>{let d=c==null?"":String(c);return/[",\n;]/.test(d)?`"${d.replace(/"/g,'""')}"`:d},s=[["name","object","stock","unit","reorder_threshold","unit_cost","storage_location","vendor","used_by"].join(",")];for(let c of e)s.push([t(c.name),t(c.object_name),t(c.stock),t(c.unit),t(c.reorder_threshold),t(c.cost),t(c.storage_location),t(c.vendor),t(c.consumers.map(d=>`${d.object_name??""}/${d.task_name??d.task_id}\xD7${d.quantity}`).join(" | "))].join(","));let r=_e();Ht(s.join(`
`),`maintenance_parts_${r}.csv`,"text/csv;charset=utf-8")}async _exportObjectsCsv(){let e=await I(this,{type:"maintenance_supporter/objects/csv"},{onError:i=>this._showToast(i)});if(!e)return;let t=_e();Ht(e.csv,`maintenance_objects_${t}.csv`,"text/csv;charset=utf-8")}_renderObjectsTable(e){let t=this._lang,i=this._objectsTableColumns,s=this._objTableSort;s&&wi(e,this._objColumnCompare(s.key,s.dir));let r=Ya(e,d=>this._objTreeOpen.has(d)),c=e.children.size>0;return o`
      <div class="objects-table-wrap">
        <table class="objects-table">
          <thead>
            <tr>
              ${this._objBulkMode?o`<th class="oc-bulk"></th>`:h}
              ${i.map(d=>{let u=ga.find(g=>g.key===d);if(!u||u.key==="actions")return o`<th class="oc-${d}"></th>`;let p=s?.key===d;return o`<th class="oc-${d}" aria-sort=${p?s.dir==="asc"?"ascending":"descending":"none"}>
                  <button class="area-sort ${p?"active":""}" title=${a("sort_label",t)} @click=${()=>this._setObjTableSort(d)}>
                    ${a(u.labelKey,t)}
                    ${p?o`<ha-icon icon=${s.dir==="asc"?"mdi:arrow-up":"mdi:arrow-down"}></ha-icon>`:h}
                  </button>
                </th>`})}
            </tr>
          </thead>
          <tbody>
            ${r.map(({obj:d,depth:u})=>o`
              <tr class="objects-table-row${this._objBulkMode&&this._objBulkSelected.has(d.entry_id)?" bulk-selected":""}${u?" sub-object-row":""}"
                data-entry-id=${d.entry_id}
                @click=${()=>this._objBulkMode?this._toggleObjBulk(d.entry_id):this._showObject(d.entry_id)}>
                ${this._objBulkMode?o`<td class="oc-bulk"><input type="checkbox" .checked=${this._objBulkSelected.has(d.entry_id)}
                      @click=${p=>p.stopPropagation()} @change=${()=>this._toggleObjBulk(d.entry_id)} /></td>`:h}
                ${i.map(p=>p==="name"?this._renderObjectNameCell(d,t,u,e.children.get(d.entry_id)?.length??0,c):this._renderObjectCell(p,d,t))}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `}_setObjTableSort(e){let t=this._objTableSort;this._objTableSort=e===null?null:t?.key===e?{key:e,dir:t.dir==="asc"?"desc":"asc"}:{key:e,dir:e==="task_count"?"desc":"asc"};let i=this._objTableSort;q(P.objectTableSort,i?`${i.key}:${i.dir}`:"")}_objColumnValue(e,t){let i=t.object;switch(e){case"name":return i.name;case"ref_no":return Pe(i)||null;case"area_id":return i.area_id&&Bt(i.area_id,this.hass?.areas,"")||null;case"documentation_url":return de(i.documentation_url)||(i.manual_docs||[]).length?1:null;case"notes":return is(i.notes)||null;case"task_count":return t.tasks.length;default:{let s=i[e];return typeof s=="string"&&s.trim()?s:null}}}_objColumnCompare(e,t){let i=t==="asc"?1:-1,s=(r,c)=>r.object.name.localeCompare(c.object.name,this._lang);return(r,c)=>{let d=this._objColumnValue(e,r),u=this._objColumnValue(e,c);return d===null||u===null?d===u?s(r,c):d===null?1:-1:(typeof d=="number"&&typeof u=="number"?d-u:String(d).localeCompare(String(u),this._lang,{numeric:!0,sensitivity:"base"}))*i||s(r,c)}}_renderObjectNameCell(e,t,i=0,s=0,r=!1){let c=e.object,d=this._objTreeOpen.has(e.entry_id),u=d?a("sub_objects_hide",t):a("sub_objects_show",t);return o`<td class="oc-name" style=${i?`padding-left: ${12+i*22}px`:""}>
      ${s?o`<button class="object-tree-toggle" type="button" aria-expanded=${d?"true":"false"}
            aria-label=${u} title=${u}
            @click=${p=>{p.stopPropagation(),this._toggleObjTree(e.entry_id)}}
            ><ha-icon icon=${d?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon></button>`:r?o`<span class="object-tree-spacer"></span>`:h}
      <span class="objects-table-name">${this._objRef(c)}${c.name}</span>
      ${s&&!d?o`<span class="object-tree-count" title=${a("sub_objects",t)}>${s}</span>`:h}
      ${c.document_count?o`<span class="doc-badge" title="${Is(c.document_count,t)}">
            <ha-icon icon="mdi:paperclip"></ha-icon>${c.document_count}
          </span>`:h}
    </td>`}_toggleObjTree(e){let t=new Set(this._objTreeOpen);t.has(e)?t.delete(e):t.add(e),this._objTreeOpen=t,q(P.objectTreeOpen,JSON.stringify([...t]))}_renderObjectCell(e,t,i){let s=t.object;switch(e){case"name":return this._renderObjectNameCell(t,i);case"manufacturer":return o`<td class="oc-manufacturer">${s.manufacturer||"\u2014"}</td>`;case"model":return o`<td class="oc-model">${s.model||"\u2014"}</td>`;case"serial_number":return o`<td class="oc-serial_number">${s.serial_number||"\u2014"}</td>`;case"installation_date":return o`<td class="oc-installation_date">${s.installation_date?U(s.installation_date,i):"\u2014"}</td>`;case"warranty_expiry":return o`<td class="oc-warranty_expiry">${this._renderWarrantyCell(s.warranty_expiry,i)}</td>`;case"area_id":{let r=Bt(s.area_id,this.hass?.areas,"\u2014");return o`<td class="oc-area_id">${r}</td>`}case"documentation_url":{let r=(s.manual_docs||[])[0];return o`<td class="oc-documentation_url">${de(s.documentation_url)?o`<a href=${s.documentation_url} target="_blank" rel="noopener noreferrer"
                @click=${c=>c.stopPropagation()}><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:r?o`<a href="#" title=${r.title}
                  @click=${c=>{c.preventDefault(),c.stopPropagation(),this._openManualDoc(r)}}
                  ><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:"\u2014"}</td>`}case"notes":{let r=is(s.notes);return o`<td class="oc-notes" title=${r}>${r||"\u2014"}</td>`}case"task_count":return o`<td class="oc-task_count">${t.tasks.length}</td>`;case"ref_no":return o`<td class="oc-ref_no">${Pe(s)?`#${Pe(s)}`:"\u2014"}</td>`;case"actions":return o`<td class="oc-actions">
          <button type="button" class="row-icon-btn obj-table-qr" title="${a("qr_code",i)}" aria-label=${a("qr_code",i)}
            @click=${r=>{r.stopPropagation(),this._openQrForObject(t.entry_id,s.name)}}><ha-svg-icon .path=${Ys}></ha-svg-icon></button>
        </td>`;default:return o`<td></td>`}}_renderWarrantyCell(e,t){let i=bs(e);return i.kind==="none"?o`<span class="warranty-none">—</span>`:o`<span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,e,t)}</span>`}async _onSettingsChanged(){await this._loadData()}_renderGroupsSection(){if(!this._features.groups)return h;let e=Object.entries(this._groups),t=this._lang;return o`
      <div class="groups-section">
        <div class="groups-header">
          <h3>${a("groups",t)}</h3>
          <ha-button appearance="plain" @click=${()=>this._openGroupCreate()}>
            ${a("new_group",t)}
          </ha-button>
        </div>
        ${e.length===0?o`<div class="hint">${a("no_groups",t)}</div>`:o`
            <div class="groups-grid">
              ${e.map(([i,s])=>{let r=s.task_refs.map(c=>this._getTask(c.entry_id,c.task_id)?.name).filter(Boolean);return o`
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
                    ${s.description?o`<div class="group-card-desc">${s.description}</div>`:h}
                    <div class="group-card-tasks">
                      ${r.length>0?r.map(c=>o`<span class="group-task-chip">${c}</span>`):o`<span style="font-size:12px;color:var(--secondary-text-color)">${a("no_tasks_short",t)}</span>`}
                    </div>
                  </div>
                `})}
            </div>
          `}
      </div>
    `}_openGroupCreate(){this.shadowRoot.querySelector("maintenance-group-dialog")?.openCreate()}_openGroupEdit(e){let t=this._groups[e];t&&this.shadowRoot.querySelector("maintenance-group-dialog")?.openEdit(e,t)}async _deleteGroup(e,t){await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:a("delete_group",this._lang),message:a("delete_group_confirm",this._lang).replace("{name}",t),confirmText:a("delete",this._lang),danger:!0})&&await this._runAction({type:"maintenance_supporter/group/delete",group_id:e})}_renderBudgetTiles(){let e=this._budget;if(!e)return h;let t=this._lang,i=this._currencySymbol,s=(r,c,d)=>{if(d!==null){let{pct:u,level:p}=xn(c,d,e.alert_threshold_pct),g={danger:"var(--error-color, #f44336)",warning:"var(--warning-color, #ff9800)",ok:"var(--success-color, #4caf50)"}[p];return o`
          <div class="stat-item budget-tile" title="${r}: ${Y(c,i,t)} / ${Y(d,i,t)}">
            <span class="stat-value budget-tile-value">${Y(c,i,t)}</span>
            <span class="budget-tile-max">/ ${Y(d,i,t)}</span>
            <div class="budget-tile-bar"><div style="width:${u}%; background:${g}"></div></div>
            <span class="stat-label">${r}</span>
          </div>
        `}return o`
        <div class="stat-item budget-tile" title="${r}: ${Y(c,i,t)}">
          <span class="stat-value budget-tile-value">${Y(c,i,t)}</span>
          <span class="stat-label">${r}</span>
        </div>
      `};return o`
      ${s(a("budget_monthly",t),e.monthly_spent||0,e.monthly_budget>0?e.monthly_budget:null)}
      ${s(a("budget_yearly",t),e.yearly_spent||0,e.yearly_budget>0?e.yearly_budget:null)}
    `}_renderRows(e){let t=this._splitActive(),i=[this._lang,Pt(this._lang),this.hass?.locale,this._bulkMode,this._bulkSelected,t&&this._selectedEntryId,t&&this._selectedTaskId,t,this._miniStatsData,this._actionLoading,this._rowActionStyle,this.narrow,this.tight];return gr(e,Ps,s=>fr([s,...i],()=>this._renderOverviewRow(s)))}_renderOverviewRow(e){let t=this._lang,i=e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0,s=0,r=si.ok,c=!1;if(i&&e.days_until_due!==null){let m=Si(e.interval_days,e.days_until_due,e.interval_unit);s=m.pct,c=m.overflow,e.status==="overdue"?r=si.overdue:e.status==="due_soon"&&(r=si.due_soon)}let d=e.area_id?this.hass?.areas?.[e.area_id]?.name:null,u=this._peopleOf(e).filter(m=>m!==null),p=e.group_names.length>0||d||u.length>0,g=this._bulkMode&&this._bulkSelected.has(this._bulkKey(e));return o`
      <div class="task-row${e.enabled?"":" task-disabled"}${g?" bulk-selected":""}${this._splitActive()&&e.entry_id===this._selectedEntryId&&e.task_id===this._selectedTaskId?" selected":""}">
        ${this._bulkMode?o`
          <label class="cell bulk-check" @click=${m=>m.stopPropagation()}>
            <input type="checkbox" .checked=${g} @change=${()=>this._toggleBulkRow(e)} />
          </label>
        `:h}
        <span class="cell-badges">
          ${this._statusBadge(e)}
          ${e.enabled?h:o`<span class="badge-disabled">${a("disabled",t)}</span>`}
          ${e.nfc_tag_id?o`<span class="nfc-badge" title="${a("nfc_linked",t)}"><ha-svg-icon .path=${Ji}></ha-svg-icon></span>`:h}
          ${e.priority==="high"?o`<span class="priority-badge priority-high" title="${a("priority_high",t)}"><ha-svg-icon .path=${Yi}></ha-svg-icon></span>`:h}
          ${e.priority==="low"?o`<span class="priority-badge priority-low" title="${a("priority_low",t)}"><ha-svg-icon .path=${Ws}></ha-svg-icon></span>`:h}
        </span>
        <span class="row-head">
          <span class="cell object-name" @click=${m=>{m.stopPropagation(),this._showObject(e.entry_id)}}>${e.object_name}</span>
          <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,e.task_id)}>${this._listRef(e.entry_id,e.task_id)}${e.task_name}${St(e.next_event_titles)}${jt(e.trigger_detail)}</span>
        </span>
        <span class="task-sub${p?"":" task-sub-empty"}">
          ${e.group_names.length>0?o`
            <span class="sub-chip" title="${a("groups",t)}">
              <ha-svg-icon .path=${Qi}></ha-svg-icon>${e.group_names.join(", ")}
            </span>`:h}
          ${d?o`
            <span class="sub-chip">
              <ha-svg-icon .path=${Xi}></ha-svg-icon>${d}
            </span>`:h}
          ${rs(u,"sub-chip")}
          ${(e.labels||[]).map(m=>o`
            <span class="sub-chip label-chip" title="${a("labels",t)}">
              <ha-svg-icon .path=${Qs}></ha-svg-icon>${m}
            </span>`)}
        </span>
        <span class="cell type">${a(e.type,t)}</span>
        <span class="due-cell" @click=${()=>this._showTask(e.entry_id,e.task_id)}>
          ${js(e.days_until_due,e.last_performed,t)}
          ${i?o`<div class="days-bar"><div class="days-bar-fill${c?" overflow":""}" style="width:${s}%;background:${r}"></div></div>`:h}
          ${e.trigger_config?$s(e,{trend:ks(e,this._miniStatsData),lang:t}):!i&&e.trigger_active?o`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:h}
          ${Ts(e,this._miniStatsData,this._lang)}
        </span>
        ${this._renderRowActions(t,()=>this._openCompleteDialogForRow(e),()=>this._promptSkipTask(e.entry_id,e.task_id),e.allow_skip,this._isQuick(e))}
      </div>
    `}_actionStyle(){return this._rowActionStyle}async _dismissRowActionNotice(e){let t={row_action_notice_pending:!1};e&&(t.row_action_style="icons"),await I(this,{type:"maintenance_supporter/global/update",settings:t},{onError:s=>this._showToast(s)})!==void 0&&(this._rowActionNotice=!1,e&&(this._rowActionStyle="icons"),Fa())}_renderRowActions(e,t,i,s=!0,r=!1){let c=this._actionStyle(),d=r?Ki:ti,u=r?a("qr_action_quick_complete",e):a("complete",e);return c==="buttons"||c==="buttons_compact"?c==="buttons_compact"&&(this.narrow||this.tight)?o`
          <span class="row-actions as-buttons compact">
            <ha-button size="small" appearance="accent" variant="success" title="${u}" aria-label="${u}" @click=${g=>{g.stopPropagation(),t()}}>
              <ha-svg-icon .path=${d}></ha-svg-icon>
            </ha-button>
            ${s?o`
              <ha-button size="small" appearance="outlined" variant="warning" title="${a("skip",e)}" aria-label="${a("skip",e)}" ?disabled=${this._actionLoading} @click=${g=>{g.stopPropagation(),i?.()}}>
                <ha-svg-icon .path=${ii}></ha-svg-icon>
              </ha-button>`:h}
          </span>`:o`
        <span class="row-actions as-buttons">
          <ha-button size="small" appearance="accent" variant="success" title="${u}" @click=${g=>{g.stopPropagation(),t()}}>
            <ha-svg-icon slot="start" .path=${ti}></ha-svg-icon>${a("complete",e)}
          </ha-button>
          ${s?o`
            <ha-button size="small" appearance="outlined" variant="warning" title="${a("skip",e)}" ?disabled=${this._actionLoading} @click=${g=>{g.stopPropagation(),i?.()}}>
              <ha-svg-icon slot="start" .path=${ii}></ha-svg-icon>${a("skip",e)}
            </ha-button>`:h}
        </span>`:o`
      <span class="row-actions">
        <button type="button" class="row-icon-btn btn-complete${r?" quick":""}" title="${u}" aria-label=${u}
          @click=${p=>{p.stopPropagation(),t()}}><ha-svg-icon .path=${r?Ki:ti}></ha-svg-icon></button>
        ${s?o`
          <button type="button" class="row-icon-btn btn-skip" title="${a("skip",e)}" aria-label=${a("skip",e)} ?disabled=${this._actionLoading}
            @click=${p=>{p.stopPropagation(),i?.()}}><ha-svg-icon .path=${ii}></ha-svg-icon></button>`:h}
      </span>`}_isQuick(e){return nt(this._getTask(e.entry_id,e.task_id))}_openCompleteDialogForRow(e){let i=this._objects.find(s=>s.entry_id===e.entry_id)?.tasks.find(s=>s.id===e.task_id);this._openCompleteDialog(e.entry_id,e.task_id,e.task_name,this._features.checklists?i?.checklist:void 0,this._features.adaptive&&!!i?.adaptive_config?.enabled)}_renderObjectDetail(){if(!this._selectedEntryId)return h;let e=this._getObject(this._selectedEntryId);if(!e)return o`<p>Object not found.</p>`;this._objectWarmedUp=!0;let t=this._renderObjectPage(e);if(!this._objectSplitActive())return t;let i=this._selectedTaskId&&this._getTask(e.entry_id,this._selectedTaskId);return o`
      <div class="split-layout object-split">
        <div class="split-list">${t}</div>
        <div class="split-pane">
          ${i?this._renderTaskDetail():o`<div class="split-pane-empty"><ha-icon icon="mdi:cursor-default-click-outline"></ha-icon><p>${a("split_select_hint",this._lang)}</p></div>`}
        </div>
      </div>
    `}_renderObjectPage(e,t=!1){let i=e.object,s=t?"":e.entry_id,r=this._lang,c=this._isOperator,d=e.tasks.filter(C=>C.archived).length,u=e.tasks.filter(C=>this._showArchived||!C.archived),p=this._arrangeObjects(this._objects.filter(C=>C.entry_id===e.entry_id||this._showArchived||!C.object.archived)),g=p.children.get(e.entry_id)??[],m=!c&&cs(e),b=o`
        <div class="detail-header">
          <h2>${i.name} ${ht(Pe(i),a("ref_number",r))}</h2>
          <div class="action-buttons">
            ${c?h:o`
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(C=>C?.openCreate(e.entry_id))}}>${a("add_task",r)}</ha-button>
              <ha-button appearance="plain" @click=${()=>{this._ui("maintenance-object-dialog").then(C=>C?.openEdit(e.entry_id,i))}}>${a("edit",r)}</ha-button>
            `}
            <div class="more-menu-wrapper">
              ${st()?Ge(o`<ha-icon-button slot="trigger" .disabled=${this._actionLoading} .label=${a("more_actions",r)} .path=${$n}></ha-icon-button>`,this._objMenuEntries(e,m,c,r,!0)):o`<ha-icon-button .disabled=${this._actionLoading} .label=${a("more_actions",r)} .path=${$n} @click=${()=>this._toggleObjMenu()}></ha-icon-button>
                  ${this._objMenuOpen?ot(this._objMenuEntries(e,m,c,r,!1),()=>this._closeObjMenu()):h}
                  ${this._subObjMenu==="more"&&m?this._renderSubObjMenu(e.entry_id,r):h}`}
            </div>
          </div>
        </div>
        ${i.paused?o`<p class="meta paused-meta">
              <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
              ${a("object_paused_badge",r)}${i.paused_until?o` — ${a("paused_until_label",r)} ${U(i.paused_until,r)}`:h}
            </p>`:h}
    `,x=o`
        ${i.manufacturer||i.model?o`<p class="meta">${[i.manufacturer,i.model].filter(Boolean).join(" ")}</p>`:h}
        ${i.serial_number?o`<p class="meta">${a("serial_number_label",r)}: ${i.serial_number}</p>`:h}
        ${this._renderLineageLink(i.predecessor_entry_id,a("object_replaces",r))}
        ${this._renderLineageLink(i.replaced_by_entry_id,a("object_replaced_by",r))}
        ${i.area_id?o`<p class="meta">${a("area",r)}:
              <a href="#" class="object-area-link" @click=${C=>{C.preventDefault(),this._showArea(i.area_id)}}
                >${as(i.area_id,this.hass?.areas,a("no_area",r))}</a></p>`:h}
        ${i.place?o`<p class="meta place-meta">
              <ha-icon icon="mdi:map-marker-outline"></ha-icon>
              ${a("filter_place",r)}: ${i.place_name||i.place}${i.remind_on_site?o` · ${a("remind_on_site",r)}`:h}
              ${i.place_missing?o`<span class="place-missing-badge">${a("place_missing",r)}</span>`:h}
            </p>`:h}
        ${de(i.documentation_url)?o`<p class="meta">${a("documentation_url_label",r)}:
              <a href=${i.documentation_url} target="_blank" rel="noopener noreferrer">${i.documentation_url}</a>
            </p>`:(i.manual_docs||[]).length?o`<p class="meta">${a("documentation_url_label",r)}:
                ${i.manual_docs.slice(0,3).map((C,R)=>o`${R>0?" \xB7 ":""}<a href="#"
                    @click=${B=>{B.preventDefault(),this._openManualDoc(C)}}>${C.title}</a>`)}${i.manual_docs.length>3?o` … +${i.manual_docs.length-3}`:h}
              </p>`:h}
        ${i.installation_date?o`<p class="meta">${a("installed",r)}: ${U(i.installation_date,r)}</p>`:h}
        ${i.warranty_expiry?this._renderWarrantyMeta(i.warranty_expiry,r):h}
        ${i.notes?o`<div class="object-notes">
              <div class="object-notes-label">${a("object_notes_label",r)}</div>
              <div class="object-notes-body">${di(i.notes)}</div>
            </div>`:h}
    `,T=o`
        ${g.length?this._renderObjectSection("children",a("sub_objects",r),g.length,()=>o`
        <h3 class="sub-objects-head"><span>${a("sub_objects",r)} (${g.length})</span>${m?o`
          <span class="sub-object-add-wrap">
            ${st()?Ge(o`<ha-button slot="trigger" appearance="plain" class="add-sub-object">
                    <ha-icon icon="mdi:plus"></ha-icon> ${a("add_sub_object",r)}
                    <ha-icon icon="mdi:menu-down"></ha-icon>
                  </ha-button>`,this._subObjEntries(e.entry_id,r),{placement:"bottom-start"}):o`<ha-button appearance="plain" class="add-sub-object" @click=${()=>this._toggleSubObjMenu("head")}>
                  <ha-icon icon="mdi:plus"></ha-icon> ${a("add_sub_object",r)}
                  <ha-icon icon="mdi:menu-down"></ha-icon>
                </ha-button>
                ${this._subObjMenu==="head"?this._renderSubObjMenu(e.entry_id,r):h}`}
          </span>`:h}</h3>
        <div class="objects-grid sub-objects">${g.map(C=>this._renderObjectCard(C,p))}</div>
        `):h}
    `,v=o`
        ${this._renderObjectSection("tasks",a("tasks",r),u.length,()=>o`
        <h3>${a("tasks",r)} (${u.length})${d>0?o`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            appearance="plain"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?a("hide_archived",r):`${a("show_archived",r)} (${d})`}
          </ha-button>`:h}</h3>
        ${e.tasks.length===0?o`<div class="empty-state-centered">
              <p class="empty">${a("no_tasks_yet",r)}</p>
              <ha-button appearance="filled" @click=${()=>{this._ui("maintenance-task-dialog").then(C=>C?.openCreate(e.entry_id))}}>${a("add_first_task",r)}</ha-button>
            </div>`:o`<div class="task-table object-tasks">${[...u].sort((C,R)=>Ze(C.status)-Ze(R.status)||(C.days_until_due??99999)-(R.days_until_due??99999)).map(C=>o`
              <div class="task-row${C.enabled?"":" task-disabled"}${this._objectSplitActive()&&C.id===this._selectedTaskId?" selected":""}">
                <span class="cell-badges">
                  ${this._statusBadge(C)}
                  ${C.enabled?h:o`<span class="badge-disabled">${a("disabled",r)}</span>`}
                  ${C.nfc_tag_id?o`<span class="nfc-badge" title="${a("nfc_linked",r)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:h}
                  ${C.document_count?o`<span class="doc-badge" title="${Is(C.document_count,r)}"><ha-icon icon="mdi:paperclip"></ha-icon>${C.document_count}</span>`:h}
                </span>
                <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,C.id)}>${this._listRef(e.entry_id,C.id)}${C.name}${St(C.next_event_titles)}${jt(C.trigger_detail)}</span>
                <span class="task-sub${We(C).length?"":" task-sub-empty"}">${Os(C,R=>this._userService?.getUserName(R)??null,R=>this._userService?.getPerson(R)??null)}</span>
                <span class="cell type">${a(C.type,r)}</span>
                <span class="due-cell" @click=${()=>this._showTask(e.entry_id,C.id)}>
                  ${js(C.days_until_due,C.last_performed,r)}
                  ${C.trigger_config?$s(C,{trend:ks(C,this._miniStatsData),lang:r}):h}
                  ${Ts(C,this._miniStatsData,this._lang)}
                </span>
                ${this._renderRowActions(r,()=>this._openCompleteDialog(e.entry_id,C.id,C.name,this._features.checklists?C.checklist:void 0,this._features.adaptive&&!!C.adaptive_config?.enabled),()=>this._promptSkipTask(e.entry_id,C.id),C.allow_skip,nt(C))}
              </div>
            `)}</div>`}
        `)}
    `,k=o`
        ${this._renderObjectSection("documents",a("documents",r),typeof i.document_count=="number"?i.document_count:null,()=>o`
        <maintenance-documents-section
          .hass=${this.hass}
          .entryId=${s}
          .canWrite=${!c}
        ></maintenance-documents-section>
        `)}
    `,w=o`
        ${(e.parts||[]).length||!c?this._renderObjectSection("parts",a("parts_section",r),(e.parts||[]).length,()=>o`
        <maintenance-parts-section
          .hass=${this.hass}
          .entryId=${s}
          .parts=${e.parts||[]}
          .canWrite=${!c}
          .currencySymbol=${this._currencySymbol}
          .partsCostMode=${this._partsCostMode}
          .fleet=${!!i.battery_fleet}
          @parts-changed=${()=>this._loadData()}
        ></maintenance-parts-section>
        `):h}
    `,E=o`
        ${e.tasks.some(C=>(C.times_performed||0)>0||(C.history||[]).length>0)?this._renderObjectSection("history",a("object_history_section",r),null,()=>o`
        <maintenance-object-history-section
          .hass=${this.hass}
          .entryId=${s}
          .object=${i}
          .tasks=${e.tasks}
          .currencySymbol=${this._currencySymbol}
          .userName=${C=>this._userService?.getUserName(C)??null}
          @open-task=${C=>this._showTask(e.entry_id,C.detail.taskId)}
        ></maintenance-object-history-section>
        `):h}
    `,y=!!(i.manufacturer||i.model||i.serial_number||i.predecessor_entry_id||i.replaced_by_entry_id||i.area_id||i.place||de(i.documentation_url)||(i.manual_docs||[]).length||i.installation_date||i.warranty_expiry||i.notes),D=i.template_id&&!c?o`<maintenance-template-updates .hass=${this.hass} .entryId=${s}
          @template-updates-applied=${()=>this._loadData()}></maintenance-template-updates>`:h,re=this.wide&&pe()?o`${b}${D}
          <div class="object-columns">
            <div class="object-col">${T}${v}${E}</div>
            <div class="object-col">${y?o`<div class="object-meta">${x}</div>`:h}${k}${w}</div>
          </div>`:o`${b}${D}${x}${T}${v}${k}${w}${E}`;return o`<div class="detail-section">${re}</div>`}_renderObjectSection(e,t,i,s){let r=this._lang,c=this._objectSectionOverride===e||!this._objectSectionsCollapsed.has(e),d=c?a("section_collapse",r):a("section_expand",r);return o`
      <div class="obj-section ${e} ${c?"open":"collapsed"}" data-section=${e}>
        <button class="obj-section-toggle" type="button"
          aria-expanded=${c?"true":"false"}
          aria-label=${d} title=${d}
          @click=${()=>this._toggleObjectSection(e)}>
          <ha-icon icon=${c?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        ${c?o`<div class="obj-section-body">${s()}</div>`:o`<h3 class="obj-section-title" @click=${()=>this._toggleObjectSection(e)}>
              ${t}${i!==null?o`<span class="obj-section-count">${i}</span>`:h}
            </h3>`}
      </div>
    `}_renderNewMenu(e,t=!1){let i=r=>o`
      <ha-button appearance=${t?"accent":"filled"} class="new-menu-button${t?" ms-fab":""}" size=${t?"large":h} slot=${r?"trigger":h}
        @click=${r?h:c=>{c.stopPropagation(),this._toggleNewMenu()}}>
        <ha-icon icon="mdi:plus"></ha-icon> ${a("add",e)}
        <ha-icon icon="mdi:menu-down"></ha-icon>
      </ha-button>`,s=[{label:a("new_task",e),icon:"mdi:clipboard-plus-outline",action:()=>{this._ui("maintenance-task-dialog").then(r=>r?.openCreate("",this._objects))}},{label:a("new_object",e).replace(/^\+\s*/,""),icon:"mdi:package-variant-closed-plus",action:()=>{this._ui("maintenance-object-dialog").then(r=>r?.openCreate())}},{label:a("templates_from",e),icon:"mdi:view-grid-plus-outline",action:()=>{this._openTemplateGallery()}},"divider",{label:a("adopt_problem_button",e),icon:"mdi:alert-circle-check-outline",action:()=>this._openAdoptProblemSensors()},{label:a("setups_button",e),icon:"mdi:auto-fix",action:()=>this._openSuggestedSetups()},this._batteryFleetSetupAvailable&&{label:a("battery_fleet_setup_button",e),icon:"mdi:battery-sync",action:()=>{this._setupBatteryFleet()}}];return o`
      <div class="new-menu-wrapper${t?" ms-fab-wrapper":""}">
        ${st()?Ge(i(!0),s,t?{placement:"top-end"}:{}):o`${i(!1)}${this._newMenuOpen?ot(s,()=>this._closeNewMenu(),"new-menu-popup"):h}`}
      </div>
    `}_togglePopup(e,t,i){let s=!t();i(s),this._dropPopupCloser(e),s&&setTimeout(()=>{if(!t())return;let r=()=>{i(!1),this._dropPopupCloser(e)};this._popupClosers.set(e,r),document.addEventListener("click",r)},0)}_dropPopupCloser(e){let t=this._popupClosers.get(e);t&&document.removeEventListener("click",t),this._popupClosers.delete(e)}_toggleNewMenu(){this._togglePopup("new",()=>this._newMenuOpen,e=>{this._newMenuOpen=e})}_closeNewMenu(){this._newMenuOpen=!1}_isYoungInstall(){let e=this._objects.filter(i=>!i.object?.battery_fleet),t=e.reduce((i,s)=>i+s.tasks.length,0);return e.length<3&&t<8}_gsDismissed(){try{return new Set(JSON.parse(X(P.gettingStartedDismissed)||"[]"))}catch{return new Set}}_dismissGettingStarted(e){let t=this._gsDismissed();t.add(e);try{q(P.gettingStartedDismissed,JSON.stringify([...t]))}catch{}this.requestUpdate()}_maybeLoadResetOffers(){this._resetOffersLoaded||(this._resetOffersLoaded=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/reset_offers"}).then(e=>{this._resetOffersCount=(e.offers||[]).length}).catch(()=>{this._resetOffersCount=0}))}_maybeLoadGettingStarted(){this._maybeLoadResetOffers(),!(this._gsLoaded||!this._isYoungInstall())&&(this._gsLoaded=!0,this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/discover"}).then(e=>{this._gsSetupsCount=(e.setups||[]).length}).catch(()=>{this._gsSetupsCount=0}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/problem_sensors/discover"}).then(e=>{this._gsAdoptCount=(e.sensors||[]).length}).catch(()=>{this._gsAdoptCount=0}))}_renderGettingStartedChips(e){let t=this._gsDismissed(),i=this._isYoungInstall(),s=[];return i&&this._gsSetupsCount>0&&!t.has("setups")&&s.push({id:"setups",icon:"mdi:auto-fix",text:ne("gs_setups_chip","gs_setups_chip_one",this._gsSetupsCount,e),run:()=>this._openSuggestedSetups()}),i&&this._gsAdoptCount>0&&!t.has("adopt")&&s.push({id:"adopt",icon:"mdi:alert-circle-check-outline",text:ne("gs_adopt_chip","gs_adopt_chip_one",this._gsAdoptCount,e),run:()=>this._openAdoptProblemSensors()}),this._resetOffersCount>0&&!t.has("resets")&&s.push({id:"resets",icon:"mdi:counter",text:ne("gs_reset_chip","gs_reset_chip_one",this._resetOffersCount,e),run:()=>this._openSuggestedSetups()}),this._batteryFleetSetupAvailable&&!t.has("fleet")&&s.push({id:"fleet",icon:"mdi:battery-sync",text:a("gs_fleet_chip",e),run:()=>this._setupBatteryFleet()}),s.length===0?h:o`
      <div class="gs-chips-wrap">
        <div class="gs-chips-label">${a("gs_label",e)}</div>
        <div class="gs-chips">
          ${s.map(r=>o`
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
    `}_toggleObjMenu(){this._togglePopup("object",()=>this._objMenuOpen,e=>{this._objMenuOpen=e})}_closeObjMenu(){this._objMenuOpen=!1}_toggleMoreMenu(){this._togglePopup("more",()=>this._moreMenuOpen,e=>{this._moreMenuOpen=e})}_closeMoreMenu(){this._moreMenuOpen=!1}get _sparklineCtx(){return{lang:this._lang,hass:this.hass,detailStatsData:this._detailStatsData,hasStatsService:!!this._statsService,historyFallbackIds:this._statsService?.historyFallbackIds,isCounterEntity:Ue,rangeDays:this._chartRangeDays,setRangeDays:e=>this._setChartRange(e),hideOutliers:this._hideOutliers,setHideOutliers:e=>this._setHideOutliers(e)}}_toggleSection(e){let t=new Set(this._collapsedSections);t.has(e)?t.delete(e):t.add(e),this._collapsedSections=t;try{q(P.collapsedSections,JSON.stringify([...t]))}catch{}}_historyCtx(){let e=this._selectedEntryId&&this._selectedTaskId?this._getObject(this._selectedEntryId)?.tasks.find(r=>r.id===this._selectedTaskId):void 0,t=this._fullHistory,i=t&&t.entryId===this._selectedEntryId&&t.taskId===this._selectedTaskId&&t.entries.length>(e?.history||[]).length?t.entries:e?.history||[],s=i.filter(r=>r.reading_value!=null).sort((r,c)=>r.timestamp.localeCompare(c.timestamp));return{lang:this._lang,hass:this.hass,filter:this._historyFilter,search:this._historySearch,currencySymbol:this._currencySymbol,setFilter:r=>{this._historyFilter=r},setSearch:r=>{this._historySearch=r},openEdit:this._isOperator?void 0:r=>this._openHistoryEdit(r),readingUnit:e?.reading_unit??null,triggerUnit:tt(this.hass,e)||null,stateRule:Ft(e),taskRef:Le(this._selectedEntryId?this._getObject(this._selectedEntryId)?.object:null,e),phaseNames:Object.fromEntries(Object.entries(e?.phases||{}).map(([r,c])=>[r,c.name])),readingDelta:r=>{let c=s.findIndex(d=>d.timestamp===r.timestamp);return c<=0?null:r.reading_value-s[c-1].reading_value},readingSlotDelta:(r,c)=>$a(i,r,c)}}_taskDetailCtx(e=this._selectedEntryId,t=this._selectedTaskId){let i=this._getObject(e);return{lang:this._lang,hass:this.hass,entryId:e,taskId:t,objectName:i?.object.name||"",taskRef:Le(i?.object,i?.tasks.find(s=>s.id===t)),objectDocUrl:i?.object?.documentation_url??null,objectManualDocs:i?.object?.manual_docs??[],openManualDoc:s=>this._openManualDoc(s),setChecklistItem:(s,r)=>this._setChecklistItem(e,t,s,r),setPhaseCursor:s=>{this._runAction({type:"maintenance_supporter/task/set_phase",entry_id:e,task_id:t,cursor:s})},isOperator:this._isOperator,actionLoading:this._actionLoading,moreMenuOpen:this._moreMenuOpen,activeTab:this._activeTab,features:this._features,mirrorTodoDefault:this._mirrorTodoDefault,currencySymbol:this._currencySymbol,collapsedSections:this._collapsedSections,costDurationToggle:this._costDurationToggle,suggestionDismissed:this._dismissedSuggestions.has(`${e}_${t}`),sparkline:this._sparklineCtx,history:this._historyCtx(),getUserName:s=>this._userService?.getUserName(s)??null,getPerson:s=>this._userService?.getPerson(s)??null,setActiveTab:s=>{this._activeTab=s},toggleSection:s=>this._toggleSection(s),setCostDurationToggle:s=>{this._costDurationToggle=s},showTaskView:()=>this._showFullTaskPage(e,t),showObject:()=>this._showObject(e),toggleMoreMenu:()=>this._toggleMoreMenu(),closeMoreMenu:()=>this._closeMoreMenu(),openEdit:s=>{this._ui("maintenance-task-dialog").then(r=>r?.openEdit(e,s))},openComplete:(s,r)=>this._openCompleteDialog(e,t,s.name,this._features.checklists?s.checklist:void 0,this._features.adaptive&&!!s.adaptive_config?.enabled,r),promptSkip:()=>this._promptSkipTask(e,t),toggleArchive:s=>this._toggleArchiveTask(e,t,s),togglePause:s=>this._togglePauseTask(e,t,s),openQr:s=>this._openQrForTask(e,t,i?.object.name||"",s),duplicateTask:()=>this._duplicateTask(e,t),moveTask:()=>this._moveTask(e,t),promptReset:()=>this._promptResetTask(e,t),promptPostpone:()=>this._promptPostponeTask(e,t),snoozeTask:()=>this._snoozeTask(e,t),printWorksheet:()=>this._printTaskWorksheet(e,t),deleteTask:()=>this._deleteTask(e,t),applySuggestion:s=>this._applySuggestion(e,t,s),reanalyze:()=>this._reanalyzeInterval(e,t),dismissSuggestion:()=>this._dismissSuggestion(e,t),openSeasonalOverrides:s=>this._openSeasonalOverrides(s)}}async _fetchFullHistory(e,t){let i;try{i=await bi(this.hass,e,t)}catch{i=null}this._selectedEntryId===e&&this._selectedTaskId===t&&(this._fullHistory=i?{entryId:e,taskId:t,entries:i}:null)}_renderTaskDetail(){if(!this._selectedEntryId||!this._selectedTaskId)return h;let e=this._getTask(this._selectedEntryId,this._selectedTaskId);if(!e)return o`<p>Task not found.</p>`;let t=this._fullHistory,i=t&&t.entryId===this._selectedEntryId&&t.taskId===this._selectedTaskId&&t.entries.length>(e.history||[]).length?{...e,history:t.entries}:e;return o`<maintenance-task-detail-view
      .task=${i}
      .ctx=${this._taskDetailCtx()}
    ></maintenance-task-detail-view>`}_openHistoryEdit(e){if(!this._selectedEntryId||!this._selectedTaskId)return;let t=this._getTask(this._selectedEntryId,this._selectedTaskId),i=Va(this._selectedEntryId,this._selectedTaskId,e,t);this.shadowRoot?.querySelector("maintenance-history-edit-dialog")?.openEdit(i)}};S.styles=[_t,_i,Tr],_([j({attribute:!1})],S.prototype,"hass",2),_([j({type:Boolean,reflect:!0})],S.prototype,"narrow",2),_([j({type:Boolean,reflect:!0})],S.prototype,"tight",2),_([j({type:Boolean,reflect:!0})],S.prototype,"split",2),_([j({type:Boolean,reflect:!0})],S.prototype,"wide",2),_([j({attribute:!1})],S.prototype,"panel",2),_([j({type:Boolean,reflect:!0})],S.prototype,"embedded",2),_([j({attribute:!1})],S.prototype,"presets",2),_([f()],S.prototype,"_objects",2),_([f()],S.prototype,"_stats",2),_([f()],S.prototype,"_view",2),_([f()],S.prototype,"_allParts",2),_([f()],S.prototype,"_selectedEntryId",2),_([f()],S.prototype,"_selectedTaskId",2),_([f()],S.prototype,"_selectedAreaId",2),_([f()],S.prototype,"_filterStatus",2),_([f()],S.prototype,"_filterUser",2),_([f()],S.prototype,"_filterLabel",2),_([f()],S.prototype,"_filterPlace",2),_([f()],S.prototype,"_filterPriority",2),_([f()],S.prototype,"_savedViews",2),_([f()],S.prototype,"_activeViewId",2),_([f()],S.prototype,"_unsub",2),_([f()],S.prototype,"_chartRangeDays",2),_([f()],S.prototype,"_hideOutliers",2),_([f()],S.prototype,"_historyFilter",2),_([f()],S.prototype,"_budget",2),_([f()],S.prototype,"_groups",2),_([f()],S.prototype,"_detailStatsData",2),_([f()],S.prototype,"_miniStatsData",2),_([f()],S.prototype,"_features",2),_([f()],S.prototype,"_adminPanelUserIds",2),_([f()],S.prototype,"_operatorWriteEnabled",2),_([f()],S.prototype,"_defaultWarningDays",2),_([f()],S.prototype,"_mirrorTodoDefault",2),_([f()],S.prototype,"_rowActionStyle",2),_([f()],S.prototype,"_refsInLists",2),_([f()],S.prototype,"_partsCostMode",2),_([f()],S.prototype,"_rowActionNotice",2),_([f()],S.prototype,"_actionLoading",2),_([f()],S.prototype,"_moreMenuOpen",2),_([f()],S.prototype,"_objMenuOpen",2),_([f()],S.prototype,"_subObjMenu",2),_([f()],S.prototype,"_toastMessage",2),_([f()],S.prototype,"_toastKind",2),_([f()],S.prototype,"_toastUndo",2),_([f()],S.prototype,"_toastActionLabel",2),_([f()],S.prototype,"_filtersOpen",2),_([f()],S.prototype,"_listSearch",2),_([f()],S.prototype,"_filterPaneOpen",2),_([f()],S.prototype,"_paneSections",2),_([f()],S.prototype,"_newMenuOpen",2),_([f()],S.prototype,"_gsSetupsCount",2),_([f()],S.prototype,"_gsAdoptCount",2),_([f()],S.prototype,"_resetOffersCount",2),_([f()],S.prototype,"_batteryFleetSetupAvailable",2),_([f()],S.prototype,"_staleBundle",2),_([f()],S.prototype,"_restartPendingVersion",2),_([f()],S.prototype,"_overviewTab",2),_([f()],S.prototype,"_activeTab",2),_([f()],S.prototype,"_costDurationToggle",2),_([f()],S.prototype,"_historySearch",2),_([f()],S.prototype,"_sortMode",2),_([f()],S.prototype,"_objectSortMode",2),_([f()],S.prototype,"_objTableSort",2),_([f()],S.prototype,"_groupByMode",2),_([f()],S.prototype,"_objectViewMode",2),_([f()],S.prototype,"_objectsTableColumns",2),_([f()],S.prototype,"_showArchived",2),_([f()],S.prototype,"_bulkMode",2),_([f()],S.prototype,"_bulkSelected",2),_([f()],S.prototype,"_objBulkMode",2),_([f()],S.prototype,"_objBulkSelected",2),_([f()],S.prototype,"_bulkMenuOpen",2),_([f()],S.prototype,"_virtStart",2),_([f()],S.prototype,"_virtEnd",2),_([f()],S.prototype,"_virtGroupWin",2),_([f()],S.prototype,"_collapsedGroups",2),_([f()],S.prototype,"_collapsedSections",2),_([f()],S.prototype,"_objectSectionsCollapsed",2),_([f()],S.prototype,"_objectSectionOverride",2),_([f()],S.prototype,"_objTreeOpen",2),_([f()],S.prototype,"_paletteOpen",2),_([f()],S.prototype,"_paletteQuery",2),_([f()],S.prototype,"_paletteActive",2),_([f()],S.prototype,"_searchRemote",2),_([f()],S.prototype,"_templateGalleryOpen",2),_([f()],S.prototype,"_templates",2),_([f()],S.prototype,"_homeProfile",2),_([f()],S.prototype,"_templateCategories",2),_([f()],S.prototype,"_templateBusy",2),_([f()],S.prototype,"_templateParentId",2),_([f()],S.prototype,"_templatePreview",2),_([f()],S.prototype,"_templatePicked",2),_([f()],S.prototype,"_fullHistory",2),S=_([Ns("maintenance-supporter-panel")],S);export{S as MaintenanceSupporterPanel};
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
