/*! maintenance_supporter frontend 2.122.0 */
import{a as B}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-3QQTYQF5.js";import{a as st}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BKG53B77.js";import{a as rt,c as it}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-QTBFQPXH.js";import{f as F}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-5JFLCGFN.js";import{b as z}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-TNZ6SG2O.js";import{a as W}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-7P7IAHWF.js";import{$ as S,D as R,E as w,F as K,H as M,Q as X,R as V,T as h,V as x,W as G,X as N,Z as C,_ as Q,ba as J,ca as T,da as tt,e as a,f as L,ga as et,h as u,la as Z,oa as nt,p as Y,q as O,w as q,z as s}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-JNJVTVMS.js";var ot=t=>typeof t=="number"&&Number.isInteger(t)&&t>0;function $t(t){return t&&ot(t.ref_no)?String(t.ref_no):null}function jt(t,e){let r=$t(t);return r&&e&&ot(e.ref_no)?`${r}.${e.ref_no}`:null}function zt(t){let e=/^(\d+)(?:\.(\d+)(?:-(\d+))?)?$/.exec(t.trim());return e?{object:Number(e[1]),task:e[2]?Number(e[2]):null,entry:e[3]?Number(e[3]):null}:null}function at(t,e){return t?a`<span class="ref-chip" title=${e??""}>#${t}</span>`:u}async function It(t,e,r){if(!t)return null;let n={title:s("delete",r),confirmText:s("delete",r),danger:!0};if(!e?.part_ref)return await t.confirm({...n,message:s("delete_task_confirm",r)})?{}:null;let i=await t.confirmWithCheck({...n,message:s("delete_buy_task_confirm",r),check:s("delete_buy_task_off",r)});return i.confirmed?i.checked?{disable_auto_buy_task:!0}:{}:null}function vt(t,e,r,n){let i=r,l=p=>typeof p=="string"?p:null,o=p=>typeof p=="number"?p:null,c=l(i.timestamp)??"";return{entry_id:t,task_id:e,original_timestamp:c,type:l(i.type)||"completed",timestamp:c,notes:l(i.notes),cost:o(i.cost),duration:o(i.duration),completed_by:l(i.completed_by),used_parts:Array.isArray(i.used_parts)?i.used_parts:null,photo_doc_ids:W(i),reading_value:o(i.reading_value),reading_values:F(i),readings:n?.readings??[],task_type:n?.type??null,reading_unit:n?.reading_unit??null}}async function Kt(t,e,r,n){let l=(await t.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e})).tasks?.find(c=>c.id===r);if(!l)return null;let o=l.history?.find(c=>c.timestamp===n);return o||(o=(await st(t,e,r))?.find(p=>p.timestamp===n)),o?vt(e,r,o,l):null}function Jt(t,e,r=new Date){let n=t?.hours,i=M(t?.snoozed_until);if(typeof n!="number"||!Number.isFinite(i))return s("snoozed",e);let l=R(),c=w(i,l)===w(r,l)?C(new Date(i),e):S(t.snoozed_until,e);return X("snoozed_for","snoozed_for_one",n,e,"hours").replace("{until}",c)}function lt(t,e){let r=Math.max(1,Math.round(t/6e4));if(r<60)return V(r,"minute",e);let n=Math.round(t/36e5);return n<48?V(n,"hour",e):V(Math.round(t/864e5),"day",e)}function D(t){return typeof t=="string"?t.trim():""}function ct(t,e){let r=D(t.entity);return!r||!e.entityName||(e.sensors??1)<2?"":e.entityName(r)}var bt=new Set(["triggered","completed","skipped","reset"]);function Ht(t,e,r){let n=M(t.timestamp);if(!e||Number.isNaN(n))return"";let i=null,l=-1/0;for(let o of e){if(o===t||!bt.has(o.type))continue;let c=M(o.timestamp);Number.isNaN(c)||c>n||c<l||c===n&&o.type!=="triggered"||(i=o,l=c)}return!i||i.type!=="triggered"||!(n-l>0)?"":s("trigger_after_report",r).split("{duration}").join(lt(n-l,r))}function Mt(t,e,r){let n=t.trigger_change;if(!n||typeof n!="object")return"";let i=D(n.installed),l=[i?s("trigger_update_installed",e).split("{installed}").join(i):"",Ht(t,r.history,e)].filter(Boolean),o=ct(n,r),c=l.join(" \xB7 ");return o&&c?`${o}: ${c}`:o||c}function ut(t,e,r={}){if(t.type==="completed")return Mt(t,e,r);let n=t.trigger_change;if(n&&typeof n=="object"){let i=ct(n,r),l=m=>i?`${i}: ${m}`:m,o=D(n.latest),c=D(n.installed);if(o&&c&&o!==c)return l(s("trigger_update_available",e).split("{latest}").join(o).split("{installed}").join(c));let p=D(n.to),f=D(n.from);if(p)return l(`${s("trigger_val",e)}: ${f?`${f} \u2192 `:""}${p}`)}return r.stateRule||typeof t.trigger_value!="number"||!Number.isFinite(t.trigger_value)?"":`${s("trigger_val",e)}: ${x(h(t.trigger_value,e,{maximumFractionDigits:3}),r.unit,e)}`}function xt(t){let e=r=>{let n=M(r.timestamp);return Number.isNaN(n)?-1/0:n};return(t??[]).map((r,n)=>({entry:r,index:n,at:e(r)})).sort((r,n)=>n.at-r.at||n.index-r.index).map(r=>r.entry)}function At(t){return{unit:t.triggerUnit,stateRule:t.stateRule,entityName:e=>rt(t.hass,e),sensors:it(t.task?.trigger_config).length,history:t.task?.history}}var Lt=["completed","skipped","missed","reset","triggered","trigger_replaced","trigger_removed","updated"];function $e(t,e){let r=e.lang;return a`
    <div class="history-filters-new">
      <div class="filter-chips">
        ${Lt.map(n=>{let i=t.history.filter(l=>l.type===n).length;return i===0?u:a`
            <span class="filter-chip ${e.filter===n?"active":""}"
              @click=${()=>e.setFilter(e.filter===n?null:n)}>
              ${s(n,r)} (${i})
            </span>
          `})}
        ${e.filter?a`<span class="filter-chip clear" @click=${()=>e.setFilter(null)}>${s("show_all",r)}</span>`:u}
      </div>
      <div class="filter-controls">
        <input type="text" class="search-input" placeholder="${s("search_notes",r)}..." .value=${e.search} @input=${n=>e.setSearch(n.target.value)} />
      </div>
    </div>
  `}function ve(t,e){let r=e.lang,n=e.filter?t.history.filter(i=>i.type===e.filter):t.history;if(e.search){let i=e.search.toLowerCase();n=n.filter(l=>z(l.notes,e.search)||z(B(l.notes,r),e.search)||(dt(e,l)??"").toLowerCase().endsWith(i))}return n.length===0?a`<p class="empty">${s("no_history",r)}</p>`:a`
    <div class="history-timeline">
      ${xt(n).map(i=>Dt(i,e))}
    </div>
  `}function dt(t,e){return t.taskRef&&e.ref_no?`${t.taskRef}-${e.ref_no}`:null}function wt(t,e){let r=W(e);return r.length>0?a`<div class="history-photos">
        ${r.map(n=>a`<maintenance-history-photo .hass=${t} .docId=${n}></maintenance-history-photo>`)}
      </div>`:u}function Tt(t,e){let r=e.lang,n=o=>h(o,r,{maximumFractionDigits:3}),i=o=>o==null?"":` (${o>=0?"+":""}${n(o)})`,l=F(t);return l.length>0?a`<div class="history-readings">
      ${l.map(o=>a`<span class="history-reading">
        <span class="history-reading-name">${o.name}</span>
        <span class="history-reading-value">${x(n(o.value),o.unit,r)}${i(e.readingSlotDelta?.(t,o.id))}</span>
      </span>`)}
    </div>`:t.reading_value!=null?a`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${s("reading_label",r)}</span>
      <span class="history-reading-value">${x(n(t.reading_value),e.readingUnit,r)}${i(e.readingDelta?.(t))}</span>
    </span></div>`:u}function Dt(t,e,r={}){let n=e.lang,{compact:i=!1,showRef:l=!0,showBadges:o=!0,showEdit:c=!0,showHead:p=!0}=r,f=e.openEdit,m=c&&!!f&&Y.includes(t.type),g=typeof t.parts_cost=="number"?t.parts_cost:null,b=t.cost_basis==="use",y=b&&!!t.purchase,_=ut(t,n,At(e));return a`
    <div class="history-entry${i?" compact":""}">
      ${i?u:a`<div class="history-icon ${t.type}" style="background: ${O(t.type)}">
            <ha-icon .icon=${q[t.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        ${p?a`<div class="history-row">
          <strong>${s(t.type,n)}</strong>
          ${l?at(dt(e,t),s("ref_number",n)):u}
          ${o&&t.phase_id?a`<span class="history-phase-badge">${e.phaseNames?.[t.phase_id]||t.phase_id}</span>`:u}
          ${o&&t.auto?a`<span class="history-auto-badge">${s("history_auto",n)}</span>`:u}
          ${m?a`<button class="history-edit-btn"
                     title=${s("history_edit_button",n)}
                     @click=${()=>f(t)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:u}
        </div>
        <div class="history-date">${S(t.timestamp,n)}</div>`:u}
        ${t.notes?a`<div class="history-notes">${B(t.notes,n)}</div>`:u}
        ${wt(e.hass,t)}
        ${Tt(t,e)}
        ${t.cost!=null||t.duration!=null||_||g!=null?a`<div class="history-details">
              ${t.cost!=null?y?a`<span>${s("history_purchase_stock",n).replace("{amount}",N(t.cost,e.currencySymbol,n))}</span>`:t.cost<0?a`<span class="history-credit">${G(t.cost,e.currencySymbol,n)}</span>`:a`<span>${s("cost",n)}: ${N(t.cost,e.currencySymbol,n)}</span>`:u}
              ${g!=null?a`<span title=${s(b?"history_parts_counted_hint":"history_parts_info_hint",n)}>${s(b?"history_parts_counted":"history_parts_info",n).replace("{amount}",N(g,e.currencySymbol,n))}</span>`:u}
              ${t.duration!=null?a`<span>${s("duration",n)}: ${et(t.duration,n)}</span>`:u}
              ${_?a`<span>${_}</span>`:u}
            </div>`:u}
      </div>
    </div>
  `}function d(t){return t.toFixed(1)}function xe(t,e,r=4,n=!1){if(!isFinite(t)||!isFinite(e))return{ticks:[],niceMin:0,niceMax:1};if(t===e){let m=Math.abs(t)*.1||1;t-=m,e+=m}let i=e-t,l=Math.pow(10,Math.floor(Math.log10(i/Math.max(1,r)))),o=l;for(let m of[1,2,5,10])if(o=l*m,i/o<=r+.5)break;n&&o<1&&(o=1);let c=Math.floor(t/o)*o,p=Math.ceil(e/o)*o,f=[];for(let m=c;m<=p+o*1e-6;m+=o)f.push(Math.abs(m)<o*1e-9?0:m);return{ticks:f,niceMin:c,niceMax:p}}function Ct(t,e){let r=Math.abs(t),n=i=>({maximumFractionDigits:i});return r>=1e6?h(t/1e6,e,n(r>=1e7?0:1))+"M":r>=1e4?h(t/1e3,e,n(0))+"k":r>=1e3?h(t/1e3,e,n(1))+"k":r>=100?h(t,e,n(0)):r>=1?h(t,e,n(1)):r===0?"0":h(t,e,n(2))}function Ae(t,e,r){let n=Math.abs(t),i=h(t,r,{maximumFractionDigits:n>=100?0:n>=1||n===0?1:2});return x(i,e,r)}function Le(t,e,r){if(Math.abs(t)>=1e3||!(e>0))return Ct(t,r);let n=Math.max(0,Math.min(4,-Math.floor(Math.log10(e)+1e-9)));return h(t,r,{maximumFractionDigits:n})}function we(t,e,r,n){return n-r<2*864e5?C(new Date(t),e):Pt(t,e,kt(r,n))}function Pt(t,e,r){return Z(new Date(t),e,r)}function Te(t,e){let r=new Date(t);return`${Z(r,e)}, ${C(r,e)}`}function kt(t,e){if(!Number.isFinite(t)||!Number.isFinite(e))return!1;let r=R();return w(t,r).slice(0,4)!==w(e,r).slice(0,4)}function De(t,e,r){if(r<2||e<=t)return[t,e];let n=[];for(let i=0;i<r;i++)n.push(t+(e-t)*i/(r-1));return n}function Re(t,e){let r=t.interval_analysis,n=r?.weibull_beta,i=r?.weibull_eta;if(n==null||i==null||i<=0)return u;let l=t.interval_days??0,o=t.suggested_interval??l;return a`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${s("weibull_reliability_curve",e)}
        ${Et(n,e)}
      </div>
      ${Rt(n,i,l,o,e)}
      ${Vt(r,e)}
      ${r?.confidence_interval_low!=null?Nt(r,t,e):u}
    </div>
  `}function Et(t,e){let r,n,i;return t<.8?(r="early_failures",n="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):t<=1.2?(r="random_failures",n="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):t<=3.5?(r="wear_out",n="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(r="highly_predictable",n="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),a`
    <span class="beta-badge ${r}">
      <ha-svg-icon path="${n}"></ha-svg-icon>
      ${s(i,e)} (\u03B2=${h(t,e,2)})
    </span>
  `}function Rt(t,e,r,n,i){let y=Math.max(r,n,e,1)*1.3,_=50,H=[];for(let $=0;$<=_;$++){let v=$/_*y,yt=1-Math.exp(-Math.pow(v/e,t)),_t=32+v/y*260,gt=136-yt*128;H.push([_t,gt])}let P=H.map(([$,v])=>`${d($)},${d(v)}`).join(" "),j="M32,136 "+H.map(([$,v])=>`L${d($)},${d(v)}`).join(" ")+` L${d(H[_][0])},136 Z`,A=32+r/y*260,k=1-Math.exp(-Math.pow(r/e,t)),E=136-k*128,ft=h((1-k)*100,i,0),U=32+n/y*260,ht=[0,.25,.5,.75,1];return a`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_weibull",i)}">
        ${ht.map($=>{let v=136-$*128;return L`
            <line x1="${32}" y1="${d(v)}" x2="${292}" y2="${d(v)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${$===.5?"4,3":u}" />
            <text x="${28}" y="${d(v+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${h($*100,i,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(y/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(y)}</text>

        <path d="${j}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${P}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${r>0?L`
          <line x1="${d(A)}" y1="${8}" x2="${d(A)}" y2="${d(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${d(A)}" cy="${d(E)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${d(A+4)}" y="${d(E-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${ft}%</text>
        `:u}

        ${n>0&&n!==r?L`
          <line x1="${d(U)}" y1="${8}" x2="${d(U)}" y2="${d(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:u}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${s("weibull_failure_probability",i)}</span>
      ${r>0?a`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${s("current_interval_marker",i)}</span>`:u}
      ${n>0&&n!==r?a`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${s("recommended_marker",i)}</span>`:u}
    </div>
  `}function Vt(t,e){return a`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${s("characteristic_life",e)}</span>
        <span class="weibull-info-value">${T(Math.round(t.weibull_eta),e)}</span>
      </div>
      ${t.weibull_r_squared!=null?a`
        <div class="weibull-info-item">
          <span>${s("weibull_r_squared",e)}</span>
          <span class="weibull-info-value">${h(t.weibull_r_squared,e,3)}</span>
        </div>
      `:u}
    </div>
  `}function Nt(t,e,r){let n=t.confidence_interval_low,i=t.confidence_interval_high,l=e.suggested_interval??e.interval_days??0,o=e.interval_days??0,c=Math.max(0,n-5),f=i+5-c,m=(n-c)/f*100,g=(i-n)/f*100,b=(l-c)/f*100,y=o>0?(o-c)/f*100:-1;return a`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${s("confidence_interval",r)}: ${T(l,r)} (${n}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${d(m)}%;width:${d(g)}%"></div>
        ${y>=0?a`<div class="confidence-marker current" style="left:${d(y)}%"></div>`:u}
        <div class="confidence-marker recommended" style="left:${d(b)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${s("confidence_conservative",r)} (${n}${s("days",r).charAt(0)})</span>
        <span class="confidence-text high">${s("confidence_aggressive",r)} (${i}${s("days",r).charAt(0)})</span>
      </div>
    </div>
  `}function I(t){return Math.max(1,Math.round(t||0))}var St={one:"sensor_prediction_urgency_one",few:"sensor_prediction_urgency_few",other:"sensor_prediction_urgency"};function Fe(t,e,r){let n=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data",i=t.days_until_threshold!=null,l=t.environmental_factor!=null&&t.environmental_factor!==1;if(!n&&!i&&!l)return u;let o=t.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":t.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return a`
    <div class="prediction-section">
      ${t.sensor_prediction_urgency?a`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${s(tt(I(t.days_until_threshold),e,St),e).replace("{days}",String(I(t.days_until_threshold)))}
        </div>
      `:u}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${s("sensor_prediction",e)}
      </div>
      <div class="prediction-grid">
        ${n?a`
          <div class="prediction-item">
            <ha-svg-icon path="${o}"></ha-svg-icon>
            <span class="prediction-label">${s("degradation_trend",e)}</span>
            <span class="prediction-value ${t.degradation_trend}">${s("trend_"+t.degradation_trend,e)}</span>
            ${t.degradation_rate!=null?a`<span class="prediction-rate">${t.degradation_rate>0?"+":""}${h(t.degradation_rate,e,Math.abs(t.degradation_rate)>=10?0:1)} ${t.trigger_entity_info?.unit_of_measurement||""}/${s("day_short",e)}</span>`:u}
          </div>
        `:u}
        ${i?a`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${s("days_until_threshold",e)}</span>
            <span class="prediction-value prediction-days${t.days_until_threshold===0?" exceeded":t.sensor_prediction_urgency?" urgent":""}">${t.days_until_threshold===0?s("threshold_exceeded",e):"~"+J(I(t.days_until_threshold),e)}</span>
            ${t.threshold_prediction_date?a`<span class="prediction-date">${Q(t.threshold_prediction_date,e)}</span>`:u}
            ${t.threshold_prediction_confidence?a`<span class="confidence-dot ${t.threshold_prediction_confidence}"></span>`:u}
            ${(t.prediction_cycles??0)>0?a`<span class="prediction-cycles">${s("prediction_cycles",e)}: ${t.prediction_cycles}</span>`:u}
          </div>
        `:u}
        ${l&&r.environmental?a`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${s("environmental_adjustment",e)}</span>
            <span class="prediction-value">${h(t.environmental_factor,e,2)}x</span>
            ${t.environmental_entity?a`<span class="prediction-entity entity-link" @click=${c=>nt(c,t.environmental_entity)}>${t.environmental_entity}</span>`:u}
          </div>
        `:u}
      </div>
    </div>
  `}function Ze(t,e,r,n){let i=Math.max(t||1,e);return a`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${s("current",n)}: ${t!=null?T(t,n):"\u2014"}
        </div>
        <div class="interval-visual current"
          style="width: ${t!=null?Math.min(t/i*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${s("recommended",n)}: ${T(e,n)}
          <span class="confidence-badge ${r}">${s(`confidence_${r}`,n)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(e/i*100,100)}%"></div>
      </div>
    </div>
  `}var pt=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function mt(){return Number(K().slice(5,7))-1}function qe(t,e,r){if(!r.seasonal||!t.seasonal_factor||t.seasonal_factor===1)return u;let n=pt.map(c=>s(c,e)),i=mt(),l=t.seasonal_factors||t.interval_analysis?.seasonal_factors||null,o=l&&l.length===12?l:n.map((c,p)=>{let f=t.seasonal_factor||1,m=Math.sin((p-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,f+m))});return a`
    <div class="seasonal-card-compact">
      <h4>${s("seasonal_awareness",e)}</h4>
      <div class="seasonal-mini-chart">
        ${o.map((c,p)=>{let f=c*40,m=c<.9?"low":c>1.1?"high":"normal";return a`
            <div class="seasonal-bar ${m} ${p===i?"current":""}"
                 style="height: ${f}px"
                 title="${n[p]}: ${h(c,e,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${s("shorter",e)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${s("normal",e)}</span>
        <span class="legend-item"><span class="dot high"></span> ${s("longer",e)}</span>
      </div>
    </div>
  `}function Ke(t,e){return Ft(t,e)}function Ft(t,e){let r=t.seasonal_factors??t.interval_analysis?.seasonal_factors;if(!r||r.length!==12)return u;let n=t.interval_analysis?.seasonal_reason,i=mt(),l=300,o=100,c=8,f=o-c-4,m=Math.max(...r,1.5),g=l/12,b=g*.65,y=c+f-1/m*f;return a`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${s("seasonal_chart_title",e)}
        ${n?a`<span class="source-tag">${n==="learned"?s("seasonal_learned",e):s("seasonal_manual",e)}</span>`:u}
      </div>
      <svg viewBox="0 0 ${l} ${o}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_seasonal",e)}">
        <line x1="0" y1="${d(y)}" x2="${l}" y2="${d(y)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${r.map((_,H)=>{let P=_/m*f,j=H*g+(g-b)/2,A=c+f-P,k=H===i,E=_<1?"var(--success-color, #4caf50)":_>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return L`
            <rect x="${d(j)}" y="${d(A)}"
              width="${d(b)}" height="${d(P)}"
              fill="${E}" opacity="${k?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${pt.map((_,H)=>a`<span class="seasonal-label ${H===i?"active-month":""}">${s(_,e)}</span>`)}
      </div>
    </div>
  `}export{$t as a,jt as b,zt as c,at as d,It as e,d as f,xe as g,Ct as h,Ae as i,Le as j,we as k,Pt as l,Te as m,kt as n,De as o,vt as p,Kt as q,Jt as r,lt as s,ut as t,xt as u,$e as v,ve as w,Dt as x,Re as y,Fe as z,Ze as A,qe as B,Ke as C};
