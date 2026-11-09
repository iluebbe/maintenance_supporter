/*! maintenance_supporter frontend 2.120.0 */
import{a as Z}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-E56GYP3O.js";import{a as et}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ICZ3AGZC.js";import{f as E}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-N4K7RQ5B.js";import{b as W}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-S3FVZEJZ.js";import{a as N}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-M6QGV47U.js";import{$ as L,D as R,E as A,F as U,H as C,Q as q,S as m,T as K,U as k,W as D,X,Y as V,_ as G,aa as Q,da as J,e as o,f as x,h as l,ia as z,ka as tt,p as Y,q as I,w as O,z as i}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-VGLEFN6D.js";var nt=t=>typeof t=="number"&&Number.isInteger(t)&&t>0;function mt(t){return t&&nt(t.ref_no)?String(t.ref_no):null}function Pt(t,e){let r=mt(t);return r&&e&&nt(e.ref_no)?`${r}.${e.ref_no}`:null}function Rt(t){let e=/^(\d+)(?:\.(\d+)(?:-(\d+))?)?$/.exec(t.trim());return e?{object:Number(e[1]),task:e[2]?Number(e[2]):null,entry:e[3]?Number(e[3]):null}:null}function rt(t,e){return t?o`<span class="ref-chip" title=${e??""}>#${t}</span>`:l}async function Vt(t,e,r){if(!t)return null;let n={title:i("delete",r),confirmText:i("delete",r),danger:!0};if(!e?.part_ref)return await t.confirm({...n,message:i("delete_task_confirm",r)})?{}:null;let s=await t.confirmWithCheck({...n,message:i("delete_buy_task_confirm",r),check:i("delete_buy_task_off",r)});return s.confirmed?s.checked?{disable_auto_buy_task:!0}:{}:null}function ft(t,e,r,n){let s=r,a=f=>typeof f=="string"?f:null,c=f=>typeof f=="number"?f:null,d=a(s.timestamp)??"";return{entry_id:t,task_id:e,original_timestamp:d,type:a(s.type)||"completed",timestamp:d,notes:a(s.notes),cost:c(s.cost),duration:c(s.duration),completed_by:a(s.completed_by),used_parts:Array.isArray(s.used_parts)?s.used_parts:null,photo_doc_ids:N(s),reading_value:c(s.reading_value),reading_values:E(s),readings:n?.readings??[],task_type:n?.type??null,reading_unit:n?.reading_unit??null}}async function Wt(t,e,r,n){let a=(await t.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e})).tasks?.find(d=>d.id===r);if(!a)return null;let c=a.history?.find(d=>d.timestamp===n);return c||(c=(await et(t,e,r))?.find(f=>f.timestamp===n)),c?ft(e,r,c,a):null}function jt(t,e,r=new Date){let n=t?.hours,s=C(t?.snoozed_until);if(typeof n!="number"||!Number.isFinite(s))return i("snoozed",e);let a=R(),d=A(s,a)===A(r,a)?D(new Date(s),e):V(t.snoozed_until,e);return q("snoozed_for","snoozed_for_one",n,e,"hours").replace("{until}",d)}function S(t){return typeof t=="string"?t.trim():""}function st(t,e,r={}){let n=t.trigger_change;if(n&&typeof n=="object"){let s=S(n.latest),a=S(n.installed);if(s&&a&&s!==a)return i("trigger_update_available",e).split("{latest}").join(s).split("{installed}").join(a);let c=S(n.to),d=S(n.from);if(c)return`${i("trigger_val",e)}: ${d?`${d} \u2192 `:""}${c}`}return r.stateRule||typeof t.trigger_value!="number"||!Number.isFinite(t.trigger_value)?"":`${i("trigger_val",e)}: ${m(t.trigger_value,e,{maximumFractionDigits:3})}${r.unit?` ${r.unit}`:""}`}function ht(t){let e=r=>{let n=C(r.timestamp);return Number.isNaN(n)?-1/0:n};return(t??[]).map((r,n)=>({entry:r,index:n,at:e(r)})).sort((r,n)=>n.at-r.at||n.index-r.index).map(r=>r.entry)}var _t=["completed","skipped","missed","reset","triggered","trigger_replaced","trigger_removed","updated"];function se(t,e){let r=e.lang;return o`
    <div class="history-filters-new">
      <div class="filter-chips">
        ${_t.map(n=>{let s=t.history.filter(a=>a.type===n).length;return s===0?l:o`
            <span class="filter-chip ${e.filter===n?"active":""}"
              @click=${()=>e.setFilter(e.filter===n?null:n)}>
              ${i(n,r)} (${s})
            </span>
          `})}
        ${e.filter?o`<span class="filter-chip clear" @click=${()=>e.setFilter(null)}>${i("show_all",r)}</span>`:l}
      </div>
      <div class="filter-controls">
        <input type="text" class="search-input" placeholder="${i("search_notes",r)}..." .value=${e.search} @input=${n=>e.setSearch(n.target.value)} />
      </div>
    </div>
  `}function ie(t,e){let r=e.lang,n=e.filter?t.history.filter(s=>s.type===e.filter):t.history;if(e.search){let s=e.search.toLowerCase();n=n.filter(a=>W(a.notes,e.search)||W(Z(a.notes,r),e.search)||(it(e,a)??"").toLowerCase().endsWith(s))}return n.length===0?o`<p class="empty">${i("no_history",r)}</p>`:o`
    <div class="history-timeline">
      ${ht(n).map(s=>gt(s,e))}
    </div>
  `}function it(t,e){return t.taskRef&&e.ref_no?`${t.taskRef}-${e.ref_no}`:null}function yt(t,e){let r=N(e);return r.length>0?o`<div class="history-photos">
        ${r.map(n=>o`<maintenance-history-photo .hass=${t} .docId=${n}></maintenance-history-photo>`)}
      </div>`:l}function $t(t,e){let r=e.lang,n=c=>m(c,r,{maximumFractionDigits:3}),s=c=>c==null?"":` (${c>=0?"+":""}${n(c)})`,a=E(t);return a.length>0?o`<div class="history-readings">
      ${a.map(c=>o`<span class="history-reading">
        <span class="history-reading-name">${c.name}</span>
        <span class="history-reading-value">${n(c.value)}${c.unit?` ${c.unit}`:""}${s(e.readingSlotDelta?.(t,c.id))}</span>
      </span>`)}
    </div>`:t.reading_value!=null?o`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${i("reading_label",r)}</span>
      <span class="history-reading-value">${n(t.reading_value)}${e.readingUnit?` ${e.readingUnit}`:""}${s(e.readingDelta?.(t))}</span>
    </span></div>`:l}function gt(t,e,r={}){let n=e.lang,{compact:s=!1,showRef:a=!0,showBadges:c=!0,showEdit:d=!0,showHead:f=!0}=r,p=e.openEdit,y=d&&!!p&&Y.includes(t.type),$=typeof t.parts_cost=="number"?t.parts_cost:null,b=t.cost_basis==="use",h=b&&!!t.purchase,_=st(t,n,{unit:e.triggerUnit,stateRule:e.stateRule});return o`
    <div class="history-entry${s?" compact":""}">
      ${s?l:o`<div class="history-icon ${t.type}" style="background: ${I(t.type)}">
            <ha-icon .icon=${O[t.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        ${f?o`<div class="history-row">
          <strong>${i(t.type,n)}</strong>
          ${a?rt(it(e,t),i("ref_number",n)):l}
          ${c&&t.phase_id?o`<span class="history-phase-badge">${e.phaseNames?.[t.phase_id]||t.phase_id}</span>`:l}
          ${c&&t.auto?o`<span class="history-auto-badge">${i("history_auto",n)}</span>`:l}
          ${y?o`<button class="history-edit-btn"
                     title=${i("history_edit_button",n)}
                     @click=${()=>p(t)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:l}
        </div>
        <div class="history-date">${V(t.timestamp,n)}</div>`:l}
        ${t.notes?o`<div class="history-notes">${Z(t.notes,n)}</div>`:l}
        ${yt(e.hass,t)}
        ${$t(t,e)}
        ${t.cost!=null||t.duration!=null||_||$!=null?o`<div class="history-details">
              ${t.cost!=null?h?o`<span>${i("history_purchase_stock",n).replace("{amount}",k(t.cost,e.currencySymbol,n))}</span>`:t.cost<0?o`<span class="history-credit">${K(t.cost,e.currencySymbol,n)}</span>`:o`<span>${i("cost",n)}: ${k(t.cost,e.currencySymbol,n)}</span>`:l}
              ${$!=null?o`<span title=${i(b?"history_parts_counted_hint":"history_parts_info_hint",n)}>${i(b?"history_parts_counted":"history_parts_info",n).replace("{amount}",k($,e.currencySymbol,n))}</span>`:l}
              ${t.duration!=null?o`<span>${i("duration",n)}: ${J(t.duration,n)}</span>`:l}
              ${_?o`<span>${_}</span>`:l}
            </div>`:l}
      </div>
    </div>
  `}function u(t){return t.toFixed(1)}function ce(t,e,r=4){if(!isFinite(t)||!isFinite(e))return{ticks:[],niceMin:0,niceMax:1};if(t===e){let p=Math.abs(t)*.1||1;t-=p,e+=p}let n=e-t,s=Math.pow(10,Math.floor(Math.log10(n/Math.max(1,r)))),a=s;for(let p of[1,2,5,10])if(a=s*p,n/a<=r+.5)break;let c=Math.floor(t/a)*a,d=Math.ceil(e/a)*a,f=[];for(let p=c;p<=d+a*1e-6;p+=a)f.push(Math.abs(p)<a*1e-9?0:p);return{ticks:f,niceMin:c,niceMax:d}}function vt(t,e){let r=Math.abs(t),n=s=>({maximumFractionDigits:s});return r>=1e6?m(t/1e6,e,n(r>=1e7?0:1))+"M":r>=1e4?m(t/1e3,e,n(0))+"k":r>=1e3?m(t/1e3,e,n(1))+"k":r>=100?m(t,e,n(0)):r>=1?m(t,e,n(1)):r===0?"0":m(t,e,n(2))}function de(t,e,r){let n=Math.abs(t),s=m(t,r,{maximumFractionDigits:n>=100?0:n>=1||n===0?1:2});return e?`${s} ${e}`:s}function ue(t,e,r){if(Math.abs(t)>=1e3||!(e>0))return vt(t,r);let n=Math.max(0,Math.min(4,-Math.floor(Math.log10(e)+1e-9)));return m(t,r,{maximumFractionDigits:n})}function pe(t,e,r,n){return n-r<2*864e5?D(new Date(t),e):bt(t,e,Ht(r,n))}function bt(t,e,r){return z(new Date(t),e,r)}function me(t,e){let r=new Date(t);return`${z(r,e)}, ${D(r,e)}`}function Ht(t,e){if(!Number.isFinite(t)||!Number.isFinite(e))return!1;let r=R();return A(t,r).slice(0,4)!==A(e,r).slice(0,4)}function fe(t,e,r){if(r<2||e<=t)return[t,e];let n=[];for(let s=0;s<r;s++)n.push(t+(e-t)*s/(r-1));return n}function ge(t,e){let r=t.interval_analysis,n=r?.weibull_beta,s=r?.weibull_eta;if(n==null||s==null||s<=0)return l;let a=t.interval_days??0,c=t.suggested_interval??a;return o`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${i("weibull_reliability_curve",e)}
        ${Mt(n,e)}
      </div>
      ${xt(n,s,a,c,e)}
      ${At(r,e)}
      ${r?.confidence_interval_low!=null?Lt(r,t,e):l}
    </div>
  `}function Mt(t,e){let r,n,s;return t<.8?(r="early_failures",n="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",s="beta_early_failures"):t<=1.2?(r="random_failures",n="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",s="beta_random_failures"):t<=3.5?(r="wear_out",n="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",s="beta_wear_out"):(r="highly_predictable",n="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",s="beta_highly_predictable"),o`
    <span class="beta-badge ${r}">
      <ha-svg-icon path="${n}"></ha-svg-icon>
      ${i(s,e)} (\u03B2=${m(t,e,2)})
    </span>
  `}function xt(t,e,r,n,s){let h=Math.max(r,n,e,1)*1.3,_=50,H=[];for(let g=0;g<=_;g++){let v=g/_*h,dt=1-Math.exp(-Math.pow(v/e,t)),ut=32+v/h*260,pt=136-dt*128;H.push([ut,pt])}let w=H.map(([g,v])=>`${u(g)},${u(v)}`).join(" "),F="M32,136 "+H.map(([g,v])=>`L${u(g)},${u(v)}`).join(" ")+` L${u(H[_][0])},136 Z`,M=32+r/h*260,T=1-Math.exp(-Math.pow(r/e,t)),P=136-T*128,lt=m((1-T)*100,s,0),j=32+n/h*260,ct=[0,.25,.5,.75,1];return o`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${i("chart_weibull",s)}">
        ${ct.map(g=>{let v=136-g*128;return x`
            <line x1="${32}" y1="${u(v)}" x2="${292}" y2="${u(v)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${g===.5?"4,3":l}" />
            <text x="${28}" y="${u(v+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${m(g*100,s,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(h/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(h)}</text>

        <path d="${F}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${w}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${r>0?x`
          <line x1="${u(M)}" y1="${8}" x2="${u(M)}" y2="${u(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${u(M)}" cy="${u(P)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${u(M+4)}" y="${u(P-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${lt}%</text>
        `:l}

        ${n>0&&n!==r?x`
          <line x1="${u(j)}" y1="${8}" x2="${u(j)}" y2="${u(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:l}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${i("weibull_failure_probability",s)}</span>
      ${r>0?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${i("current_interval_marker",s)}</span>`:l}
      ${n>0&&n!==r?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${i("recommended_marker",s)}</span>`:l}
    </div>
  `}function At(t,e){return o`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${i("characteristic_life",e)}</span>
        <span class="weibull-info-value">${L(Math.round(t.weibull_eta),e)}</span>
      </div>
      ${t.weibull_r_squared!=null?o`
        <div class="weibull-info-item">
          <span>${i("weibull_r_squared",e)}</span>
          <span class="weibull-info-value">${m(t.weibull_r_squared,e,3)}</span>
        </div>
      `:l}
    </div>
  `}function Lt(t,e,r){let n=t.confidence_interval_low,s=t.confidence_interval_high,a=e.suggested_interval??e.interval_days??0,c=e.interval_days??0,d=Math.max(0,n-5),p=s+5-d,y=(n-d)/p*100,$=(s-n)/p*100,b=(a-d)/p*100,h=c>0?(c-d)/p*100:-1;return o`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${i("confidence_interval",r)}: ${L(a,r)} (${n}\u2013${s})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${u(y)}%;width:${u($)}%"></div>
        ${h>=0?o`<div class="confidence-marker current" style="left:${u(h)}%"></div>`:l}
        <div class="confidence-marker recommended" style="left:${u(b)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${i("confidence_conservative",r)} (${n}${i("days",r).charAt(0)})</span>
        <span class="confidence-text high">${i("confidence_aggressive",r)} (${s}${i("days",r).charAt(0)})</span>
      </div>
    </div>
  `}function B(t){return Math.max(1,Math.round(t||0))}var Dt={one:"sensor_prediction_urgency_one",few:"sensor_prediction_urgency_few",other:"sensor_prediction_urgency"};function Me(t,e,r){let n=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data",s=t.days_until_threshold!=null,a=t.environmental_factor!=null&&t.environmental_factor!==1;if(!n&&!s&&!a)return l;let c=t.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":t.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return o`
    <div class="prediction-section">
      ${t.sensor_prediction_urgency?o`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${i(Q(B(t.days_until_threshold),e,Dt),e).replace("{days}",String(B(t.days_until_threshold)))}
        </div>
      `:l}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${i("sensor_prediction",e)}
      </div>
      <div class="prediction-grid">
        ${n?o`
          <div class="prediction-item">
            <ha-svg-icon path="${c}"></ha-svg-icon>
            <span class="prediction-label">${i("degradation_trend",e)}</span>
            <span class="prediction-value ${t.degradation_trend}">${i("trend_"+t.degradation_trend,e)}</span>
            ${t.degradation_rate!=null?o`<span class="prediction-rate">${t.degradation_rate>0?"+":""}${m(t.degradation_rate,e,Math.abs(t.degradation_rate)>=10?0:1)} ${t.trigger_entity_info?.unit_of_measurement||""}/${i("day_short",e)}</span>`:l}
          </div>
        `:l}
        ${s?o`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${i("days_until_threshold",e)}</span>
            <span class="prediction-value prediction-days${t.days_until_threshold===0?" exceeded":t.sensor_prediction_urgency?" urgent":""}">${t.days_until_threshold===0?i("threshold_exceeded",e):"~"+G(B(t.days_until_threshold),e)}</span>
            ${t.threshold_prediction_date?o`<span class="prediction-date">${X(t.threshold_prediction_date,e)}</span>`:l}
            ${t.threshold_prediction_confidence?o`<span class="confidence-dot ${t.threshold_prediction_confidence}"></span>`:l}
            ${(t.prediction_cycles??0)>0?o`<span class="prediction-cycles">${i("prediction_cycles",e)}: ${t.prediction_cycles}</span>`:l}
          </div>
        `:l}
        ${a&&r.environmental?o`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${i("environmental_adjustment",e)}</span>
            <span class="prediction-value">${m(t.environmental_factor,e,2)}x</span>
            ${t.environmental_entity?o`<span class="prediction-entity entity-link" @click=${d=>tt(d,t.environmental_entity)}>${t.environmental_entity}</span>`:l}
          </div>
        `:l}
      </div>
    </div>
  `}function De(t,e,r,n){let s=Math.max(t||1,e);return o`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${i("current",n)}: ${t!=null?L(t,n):"\u2014"}
        </div>
        <div class="interval-visual current"
          style="width: ${t!=null?Math.min(t/s*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${i("recommended",n)}: ${L(e,n)}
          <span class="confidence-badge ${r}">${i(`confidence_${r}`,n)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(e/s*100,100)}%"></div>
      </div>
    </div>
  `}var ot=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function at(){return Number(U().slice(5,7))-1}function ke(t,e,r){if(!r.seasonal||!t.seasonal_factor||t.seasonal_factor===1)return l;let n=ot.map(d=>i(d,e)),s=at(),a=t.seasonal_factors||t.interval_analysis?.seasonal_factors||null,c=a&&a.length===12?a:n.map((d,f)=>{let p=t.seasonal_factor||1,y=Math.sin((f-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,p+y))});return o`
    <div class="seasonal-card-compact">
      <h4>${i("seasonal_awareness",e)}</h4>
      <div class="seasonal-mini-chart">
        ${c.map((d,f)=>{let p=d*40,y=d<.9?"low":d>1.1?"high":"normal";return o`
            <div class="seasonal-bar ${y} ${f===s?"current":""}"
                 style="height: ${p}px"
                 title="${n[f]}: ${m(d,e,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${i("shorter",e)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${i("normal",e)}</span>
        <span class="legend-item"><span class="dot high"></span> ${i("longer",e)}</span>
      </div>
    </div>
  `}function Ve(t,e){return wt(t,e)}function wt(t,e){let r=t.seasonal_factors??t.interval_analysis?.seasonal_factors;if(!r||r.length!==12)return l;let n=t.interval_analysis?.seasonal_reason,s=at(),a=300,c=100,d=8,p=c-d-4,y=Math.max(...r,1.5),$=a/12,b=$*.65,h=d+p-1/y*p;return o`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${i("seasonal_chart_title",e)}
        ${n?o`<span class="source-tag">${n==="learned"?i("seasonal_learned",e):i("seasonal_manual",e)}</span>`:l}
      </div>
      <svg viewBox="0 0 ${a} ${c}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${i("chart_seasonal",e)}">
        <line x1="0" y1="${u(h)}" x2="${a}" y2="${u(h)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${r.map((_,H)=>{let w=_/y*p,F=H*$+($-b)/2,M=d+p-w,T=H===s,P=_<1?"var(--success-color, #4caf50)":_>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return x`
            <rect x="${u(F)}" y="${u(M)}"
              width="${u(b)}" height="${u(w)}"
              fill="${P}" opacity="${T?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${ot.map((_,H)=>o`<span class="seasonal-label ${H===s?"active-month":""}">${i(_,e)}</span>`)}
      </div>
    </div>
  `}export{mt as a,Pt as b,Rt as c,rt as d,Vt as e,u as f,ce as g,vt as h,de as i,ue as j,pe as k,bt as l,me as m,Ht as n,fe as o,ft as p,Wt as q,jt as r,st as s,ht as t,se as u,ie as v,gt as w,ge as x,Me as y,De as z,ke as A,Ve as B};
