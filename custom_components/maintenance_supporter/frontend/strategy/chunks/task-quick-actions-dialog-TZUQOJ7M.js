/*! maintenance_supporter frontend 2.120.0 */
import{c as It,f as Dt,g as Rt}from"./chunk-24YAKAQD.js";import{a as Y,b as kt}from"./chunk-ZHE77KUL.js";import{a as rt}from"./chunk-ICE62O33.js";import{a as bt,b as N,c as $t}from"./chunk-QYFC2E7F.js";import{d as Mt,e as At}from"./chunk-NUT2L357.js";import{a as W,c as wt}from"./chunk-A2S65VNQ.js";import"./chunk-RJQMBQRY.js";import"./chunk-ER2NEHFW.js";import"./chunk-JAOUPLJA.js";import{b as xt}from"./chunk-OFVX6ELI.js";import{c as nt,f as it}from"./chunk-GOF5NWK6.js";import"./chunk-OZ2FCQGE.js";import"./chunk-W22QAADS.js";import{a as Ht,b as Ct,c as Lt,d as Tt}from"./chunk-IEUGPE3C.js";import{a as gt}from"./chunk-IUYVVFDU.js";import"./chunk-K2LIRL6F.js";import"./chunk-YZZFX7FX.js";import{a as st}from"./chunk-5TGQNU77.js";import"./chunk-3AZAKAJO.js";import"./chunk-EBE3TCKA.js";import"./chunk-TAAEJHZI.js";import{a as lt,b as m,c as U}from"./chunk-RSK3UQBO.js";import{A as mt,B as V,E as ft,F as yt,I as vt,J as Z,a as at,d as r,e as C,g as o,i as ot,j as dt,l as ct,n as pt,p as y,q as ht,r as L,t as B,u as A,v as z,x as ut,y as T,z as _t}from"./chunk-MD5RW5PH.js";import{a as u,c as K,d as J,f as Q,g as tt,k as et,l as n,p as O,q as S,s as E,u as P}from"./chunk-7ZPVRRJE.js";function St(e,i,t=new Date){let s=e?.hours,a=P(e?.snoozed_until);if(typeof s!="number"||!Number.isFinite(a))return n("snoozed",i);let d=O(),c=S(a,d)===S(t,d)?B(new Date(a),i):z(e.snoozed_until,i);return pt("snoozed_for","snoozed_for_one",s,i,"hours").replace("{until}",c)}var Et=e=>typeof e=="number"&&Number.isInteger(e)&&e>0;function se(e){return e&&Et(e.ref_no)?String(e.ref_no):null}function Pt(e,i){let t=se(e);return t&&i&&Et(i.ref_no)?`${t}.${i.ref_no}`:null}function zt(e,i){return e?r`<span class="ref-chip" title=${i??""}>#${e}</span>`:o}var ne={"Completed from dashboard button":"hist_note_button","Auto-completed: sensor recovered":"hist_note_auto_recovered_plain","Completed from the To-do list":"hist_note_todo","Completed by voice":"hist_note_voice","Completed from the notification":"hist_note_notification","Completed via NFC tag":"hist_note_nfc","Completed from the shopping list":"hist_note_shopping_list","Completed from a mirrored to-do list":"hist_note_todo_mirror","Skipped from notification":"hist_note_skipped_notification","Skipped from dashboard button":"hist_note_skipped_button","Sensor trigger activated":"hist_note_sensor_triggered","Initial value set during task creation":"hist_note_initial"},Vt={name:"name",notes:"notes_label",recurrence:"task_section_schedule","warning days":"warning_days"},ie=[[/^Auto-completed: sensor recovered \((.+)\)$/,"hist_note_auto_recovered",e=>({value:e[1]})],[/^Auto-completed: (.+) changed to (.+)$/,"hist_note_auto_entity",e=>({entity:e[1],state:e[2]})],[/^Reset to (\d{4}-\d{2}-\d{2})$/,"hist_note_reset",(e,i)=>({date:A(e[1],i)})],[/^Trigger entity replaced: (.+) → (.+)$/,"hist_note_trigger_replaced",e=>({old:e[1],new:e[2]})],[/^From the template: (.+)$/,"hist_note_template_updated",(e,i)=>({fields:e[1].split(", ").map(t=>Vt[t]?n(Vt[t],i):t).join(", ")})],[/^Sensor trigger removed \(entity was: (.+)\)\. Schedule converted to (\w+)\.$/,"hist_note_trigger_removed",(e,i)=>({entity:e[1],schedule:n(e[2],i)})],[/^Entity (.+) removed from compound trigger; (\d+) conditions remain\.$/,"hist_note_compound_removed",e=>({entity:e[1],count:e[2]})]];function Nt(e,i){if(!e)return"";let t=ne[e.trim()];if(t)return n(t,i);for(let[s,a,d]of ie){let l=e.trim().match(s);if(l){let c=d(l,i);return n(a,i).replace(/\{(\w+)\}/g,(f,_)=>c[_]??f)}}return e}function F(e){return typeof e=="string"?e.trim():""}function Wt(e,i,t={}){let s=e.trigger_change;if(s&&typeof s=="object"){let a=F(s.latest),d=F(s.installed);if(a&&d&&a!==d)return n("trigger_update_available",i).split("{latest}").join(a).split("{installed}").join(d);let l=F(s.to),c=F(s.from);if(l)return`${n("trigger_val",i)}: ${c?`${c} \u2192 `:""}${l}`}return t.stateRule||typeof e.trigger_value!="number"||!Number.isFinite(e.trigger_value)?"":`${n("trigger_val",i)}: ${y(e.trigger_value,i,{maximumFractionDigits:3})}${t.unit?` ${t.unit}`:""}`}function Ft(e){let i=t=>{let s=P(t.timestamp);return Number.isNaN(s)?-1/0:s};return(e??[]).map((t,s)=>({entry:t,index:s,at:i(t)})).sort((t,s)=>s.at-t.at||s.index-t.index).map(t=>t.entry)}function re(e,i){return e.taskRef&&i.ref_no?`${e.taskRef}-${i.ref_no}`:null}function ae(e,i){let t=st(i);return t.length>0?r`<div class="history-photos">
        ${t.map(s=>r`<maintenance-history-photo .hass=${e} .docId=${s}></maintenance-history-photo>`)}
      </div>`:o}function oe(e,i){let t=i.lang,s=l=>y(l,t,{maximumFractionDigits:3}),a=l=>l==null?"":` (${l>=0?"+":""}${s(l)})`,d=nt(e);return d.length>0?r`<div class="history-readings">
      ${d.map(l=>r`<span class="history-reading">
        <span class="history-reading-name">${l.name}</span>
        <span class="history-reading-value">${s(l.value)}${l.unit?` ${l.unit}`:""}${a(i.readingSlotDelta?.(e,l.id))}</span>
      </span>`)}
    </div>`:e.reading_value!=null?r`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${n("reading_label",t)}</span>
      <span class="history-reading-value">${s(e.reading_value)}${i.readingUnit?` ${i.readingUnit}`:""}${a(i.readingDelta?.(e))}</span>
    </span></div>`:o}function jt(e,i,t={}){let s=i.lang,{compact:a=!1,showRef:d=!0,showBadges:l=!0,showEdit:c=!0,showHead:f=!0}=t,_=i.openEdit,b=c&&!!_&&K.includes(e.type),$=typeof e.parts_cost=="number"?e.parts_cost:null,k=e.cost_basis==="use",v=k&&!!e.purchase,g=Wt(e,s,{unit:i.triggerUnit,stateRule:i.stateRule});return r`
    <div class="history-entry${a?" compact":""}">
      ${a?o:r`<div class="history-icon ${e.type}" style="background: ${J(e.type)}">
            <ha-icon .icon=${tt[e.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        ${f?r`<div class="history-row">
          <strong>${n(e.type,s)}</strong>
          ${d?zt(re(i,e),n("ref_number",s)):o}
          ${l&&e.phase_id?r`<span class="history-phase-badge">${i.phaseNames?.[e.phase_id]||e.phase_id}</span>`:o}
          ${l&&e.auto?r`<span class="history-auto-badge">${n("history_auto",s)}</span>`:o}
          ${b?r`<button class="history-edit-btn"
                     title=${n("history_edit_button",s)}
                     @click=${()=>_(e)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:o}
        </div>
        <div class="history-date">${z(e.timestamp,s)}</div>`:o}
        ${e.notes?r`<div class="history-notes">${Nt(e.notes,s)}</div>`:o}
        ${ae(i.hass,e)}
        ${oe(e,i)}
        ${e.cost!=null||e.duration!=null||g||$!=null?r`<div class="history-details">
              ${e.cost!=null?v?r`<span>${n("history_purchase_stock",s).replace("{amount}",L(e.cost,i.currencySymbol,s))}</span>`:e.cost<0?r`<span class="history-credit">${ht(e.cost,i.currencySymbol,s)}</span>`:r`<span>${n("cost",s)}: ${L(e.cost,i.currencySymbol,s)}</span>`:o}
              ${$!=null?r`<span title=${n(k?"history_parts_counted_hint":"history_parts_info_hint",s)}>${n(k?"history_parts_counted":"history_parts_info",s).replace("{amount}",L($,i.currencySymbol,s))}</span>`:o}
              ${e.duration!=null?r`<span>${n("duration",s)}: ${V(e.duration,s)}</span>`:o}
              ${g?r`<span>${g}</span>`:o}
            </div>`:o}
      </div>
    </div>
  `}async function qt(e,i,t){if(!e)return null;let s={title:n("delete",t),confirmText:n("delete",t),danger:!0};if(!i?.part_ref)return await e.confirm({...s,message:n("delete_task_confirm",t)})?{}:null;let a=await e.confirmWithCheck({...s,message:n("delete_buy_task_confirm",t),check:n("delete_buy_task_off",t)});return a.confirmed?a.checked?{disable_auto_buy_task:!0}:{}:null}var j=class{constructor(){this._handle=null}schedule(i,t=4e3){this.clear(),this._handle=setTimeout(()=>{this._handle=null,i()},t)}clear(){this._handle!==null&&(clearTimeout(this._handle),this._handle=null)}get pending(){return this._handle!==null}};function p(e){return e.toFixed(1)}function Ot(e,i){let t=e.interval_analysis,s=t?.weibull_beta,a=t?.weibull_eta;if(s==null||a==null||a<=0)return o;let d=e.interval_days??0,l=e.suggested_interval??d;return r`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${n("weibull_reliability_curve",i)}
        ${le(s,i)}
      </div>
      ${de(s,a,d,l,i)}
      ${ce(t,i)}
      ${t?.confidence_interval_low!=null?pe(t,e,i):o}
    </div>
  `}function le(e,i){let t,s,a;return e<.8?(t="early_failures",s="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",a="beta_early_failures"):e<=1.2?(t="random_failures",s="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",a="beta_random_failures"):e<=3.5?(t="wear_out",s="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",a="beta_wear_out"):(t="highly_predictable",s="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",a="beta_highly_predictable"),r`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${s}"></ha-svg-icon>
      ${n(a,i)} (\u03B2=${y(e,i,2)})
    </span>
  `}function de(e,i,t,s,a){let v=Math.max(t,s,i,1)*1.3,g=50,M=[];for(let x=0;x<=g;x++){let w=x/g*v,Qt=1-Math.exp(-Math.pow(w/i,e)),te=32+w/v*260,ee=136-Qt*128;M.push([te,ee])}let I=M.map(([x,w])=>`${p(x)},${p(w)}`).join(" "),q="M32,136 "+M.map(([x,w])=>`L${p(x)},${p(w)}`).join(" ")+` L${p(M[g][0])},136 Z`,H=32+t/v*260,D=1-Math.exp(-Math.pow(t/i,e)),R=136-D*128,Kt=y((1-D)*100,a,0),G=32+s/v*260,Jt=[0,.25,.5,.75,1];return r`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${n("chart_weibull",a)}">
        ${Jt.map(x=>{let w=136-x*128;return C`
            <line x1="${32}" y1="${p(w)}" x2="${292}" y2="${p(w)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${x===.5?"4,3":o}" />
            <text x="${28}" y="${p(w+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${y(x*100,a,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(v/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(v)}</text>

        <path d="${q}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${I}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?C`
          <line x1="${p(H)}" y1="${8}" x2="${p(H)}" y2="${p(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${p(H)}" cy="${p(R)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${p(H+4)}" y="${p(R-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${Kt}%</text>
        `:o}

        ${s>0&&s!==t?C`
          <line x1="${p(G)}" y1="${8}" x2="${p(G)}" y2="${p(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:o}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${n("weibull_failure_probability",a)}</span>
      ${t>0?r`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${n("current_interval_marker",a)}</span>`:o}
      ${s>0&&s!==t?r`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${n("recommended_marker",a)}</span>`:o}
    </div>
  `}function ce(e,i){return r`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${n("characteristic_life",i)}</span>
        <span class="weibull-info-value">${T(Math.round(e.weibull_eta),i)}</span>
      </div>
      ${e.weibull_r_squared!=null?r`
        <div class="weibull-info-item">
          <span>${n("weibull_r_squared",i)}</span>
          <span class="weibull-info-value">${y(e.weibull_r_squared,i,3)}</span>
        </div>
      `:o}
    </div>
  `}function pe(e,i,t){let s=e.confidence_interval_low,a=e.confidence_interval_high,d=i.suggested_interval??i.interval_days??0,l=i.interval_days??0,c=Math.max(0,s-5),_=a+5-c,b=(s-c)/_*100,$=(a-s)/_*100,k=(d-c)/_*100,v=l>0?(l-c)/_*100:-1;return r`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${n("confidence_interval",t)}: ${T(d,t)} (${s}\u2013${a})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${p(b)}%;width:${p($)}%"></div>
        ${v>=0?r`<div class="confidence-marker current" style="left:${p(v)}%"></div>`:o}
        <div class="confidence-marker recommended" style="left:${p(k)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${n("confidence_conservative",t)} (${s}${n("days",t).charAt(0)})</span>
        <span class="confidence-text high">${n("confidence_aggressive",t)} (${a}${n("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function X(e){return Math.max(1,Math.round(e||0))}var he={one:"sensor_prediction_urgency_one",few:"sensor_prediction_urgency_few",other:"sensor_prediction_urgency"};function Bt(e,i,t){let s=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data",a=e.days_until_threshold!=null,d=e.environmental_factor!=null&&e.environmental_factor!==1;if(!s&&!a&&!d)return o;let l=e.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":e.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return r`
    <div class="prediction-section">
      ${e.sensor_prediction_urgency?r`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${n(_t(X(e.days_until_threshold),i,he),i).replace("{days}",String(X(e.days_until_threshold)))}
        </div>
      `:o}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${n("sensor_prediction",i)}
      </div>
      <div class="prediction-grid">
        ${s?r`
          <div class="prediction-item">
            <ha-svg-icon path="${l}"></ha-svg-icon>
            <span class="prediction-label">${n("degradation_trend",i)}</span>
            <span class="prediction-value ${e.degradation_trend}">${n("trend_"+e.degradation_trend,i)}</span>
            ${e.degradation_rate!=null?r`<span class="prediction-rate">${e.degradation_rate>0?"+":""}${y(e.degradation_rate,i,Math.abs(e.degradation_rate)>=10?0:1)} ${e.trigger_entity_info?.unit_of_measurement||""}/${n("day_short",i)}</span>`:o}
          </div>
        `:o}
        ${a?r`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${n("days_until_threshold",i)}</span>
            <span class="prediction-value prediction-days${e.days_until_threshold===0?" exceeded":e.sensor_prediction_urgency?" urgent":""}">${e.days_until_threshold===0?n("threshold_exceeded",i):"~"+ut(X(e.days_until_threshold),i)}</span>
            ${e.threshold_prediction_date?r`<span class="prediction-date">${A(e.threshold_prediction_date,i)}</span>`:o}
            ${e.threshold_prediction_confidence?r`<span class="confidence-dot ${e.threshold_prediction_confidence}"></span>`:o}
            ${(e.prediction_cycles??0)>0?r`<span class="prediction-cycles">${n("prediction_cycles",i)}: ${e.prediction_cycles}</span>`:o}
          </div>
        `:o}
        ${d&&t.environmental?r`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${n("environmental_adjustment",i)}</span>
            <span class="prediction-value">${y(e.environmental_factor,i,2)}x</span>
            ${e.environmental_entity?r`<span class="prediction-entity entity-link" @click=${c=>yt(c,e.environmental_entity)}>${e.environmental_entity}</span>`:o}
          </div>
        `:o}
      </div>
    </div>
  `}function Zt(e,i,t,s){let a=Math.max(e||1,i);return r`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${n("current",s)}: ${e!=null?T(e,s):"\u2014"}
        </div>
        <div class="interval-visual current"
          style="width: ${e!=null?Math.min(e/a*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${n("recommended",s)}: ${T(i,s)}
          <span class="confidence-badge ${t}">${n(`confidence_${t}`,s)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(i/a*100,100)}%"></div>
      </div>
    </div>
  `}var Ut=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function Yt(){return Number(E().slice(5,7))-1}function Xt(e,i,t){if(!t.seasonal||!e.seasonal_factor||e.seasonal_factor===1)return o;let s=Ut.map(c=>n(c,i)),a=Yt(),d=e.seasonal_factors||e.interval_analysis?.seasonal_factors||null,l=d&&d.length===12?d:s.map((c,f)=>{let _=e.seasonal_factor||1,b=Math.sin((f-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,_+b))});return r`
    <div class="seasonal-card-compact">
      <h4>${n("seasonal_awareness",i)}</h4>
      <div class="seasonal-mini-chart">
        ${l.map((c,f)=>{let _=c*40,b=c<.9?"low":c>1.1?"high":"normal";return r`
            <div class="seasonal-bar ${b} ${f===a?"current":""}"
                 style="height: ${_}px"
                 title="${s[f]}: ${y(c,i,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${n("shorter",i)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${n("normal",i)}</span>
        <span class="legend-item"><span class="dot high"></span> ${n("longer",i)}</span>
      </div>
    </div>
  `}function Gt(e,i){return ue(e,i)}function ue(e,i){let t=e.seasonal_factors??e.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return o;let s=e.interval_analysis?.seasonal_reason,a=Yt(),d=300,l=100,c=8,_=l-c-4,b=Math.max(...t,1.5),$=d/12,k=$*.65,v=c+_-1/b*_;return r`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${n("seasonal_chart_title",i)}
        ${s?r`<span class="source-tag">${s==="learned"?n("seasonal_learned",i):n("seasonal_manual",i)}</span>`:o}
      </div>
      <svg viewBox="0 0 ${d} ${l}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${n("chart_seasonal",i)}">
        <line x1="0" y1="${p(v)}" x2="${d}" y2="${p(v)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((g,M)=>{let I=g/b*_,q=M*$+($-k)/2,H=c+_-I,D=M===a,R=g<1?"var(--success-color, #4caf50)":g>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return C`
            <rect x="${p(q)}" y="${p(H)}"
              width="${p(k)}" height="${p(I)}"
              fill="${R}" opacity="${D?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${Ut.map((g,M)=>r`<span class="seasonal-label ${M===a?"active-month":""}">${n(g,i)}</span>`)}
      </div>
    </div>
  `}var h=class extends ot{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showPostpone=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._postponeDate="";this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1,beta_editor:!1};this._toast="";this._toastTimer=new j;this._access=bt;this._currencySymbol="";this._partsCostMode="purchase";this._loadSeq=0}get _lang(){return et(this.hass)}async openFor(t,s){(t!==this._entryId||s!==this._taskId)&&(this._task=null),this._entryId=t,this._taskId=s,this._error="",this._showSkip=!1,this._showReset=!1,this._showPostpone=!1,this._showAdaptive=!1,this._skipReason="",this._postponeDate="",this._resetDate=E(),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let t=await $t(this.hass);this._features={...this._features,...t.features},this._access=t.access,this._currencySymbol=dt(t.budget??void 0),ct(t.budget??void 0),this._partsCostMode=t.partsCostMode}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(t,s){this._toast=t,this._toastTimer.schedule(()=>{this._toast=""},s)}async _loadTask(){let t=this._entryId,s=this._taskId;if(!t||!s)return;let a=++this._loadSeq,d="",l=await Z(this,{type:"maintenance_supporter/object",entry_id:t},{onError:f=>{d=f}});if(a!==this._loadSeq)return;if(l===void 0){this._error=d;return}this._objectName=l?.object?.name||"";let c=(l?.tasks||[]).find(f=>f.id===s);this._task=c??null,this._taskRef=Pt(l?.object,c),c||(this._error=n("ws_err_not_found",this._lang))}_runWs(t){return this._error="",Z(this,t,{busy:s=>{this._busy=s},onError:s=>{this._error=s}})}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(t=!1){if(!(!this._entryId||!this._taskId||!this._task)){if(!t&&W(this._task)){this._onQuickComplete();return}import("./dialog-mount-4LNFT2BG.js").then(async({openCompleteDialog:s})=>{let a=this._task,d=[];try{d=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}s(kt({entryId:this._entryId,taskId:this._taskId,taskName:a.name,task:a,objects:d,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol,partsCostMode:this._partsCostMode}))&&(this._notifyChanged("complete"),this.close())})}}async _onQuickComplete(){let t=this._entryId,s=this._task;this._busy=!0;try{let a=await wt(this.hass,t,s.id,this._lang);if(a.result==="dialog"){this._onComplete(!0);return}if(a.result==="failed"){this._error=a.message;return}if(a.result==="already"){this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:a.message},bubbles:!0,composed:!0})),this.close();return}this._notifyChanged("complete"),a.undo&&xt(this,this.hass,{entryId:t,taskId:s.id,taskName:s.name},this._lang,()=>{}),this.close()}finally{this._busy=!1}}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})!==void 0&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})!==void 0&&(this._notifyChanged("reset"),this.close())}async _onPostponeConfirm(){if(!this._entryId||!this._taskId||!this._postponeDate)return;await this._runWs({type:"maintenance_supporter/task/postpone",entry_id:this._entryId,task_id:this._taskId,until:this._postponeDate})!==void 0&&(this._notifyChanged("postpone"),this.close())}async _onSnooze(){if(!this._entryId||!this._taskId)return;let t=await this._runWs({type:"maintenance_supporter/task/snooze",entry_id:this._entryId,task_id:this._taskId});t!==void 0&&(this._notifyChanged("snooze"),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:St(t,this._lang)},bubbles:!0,composed:!0})),this.close())}_onEdit(){!this._entryId||!this._taskId||import("./dialog-mount-4LNFT2BG.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("./dialog-mount-4LNFT2BG.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let t=await qt(gt(this.hass),this._task,this._lang);if(!t)return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId,...t})!==void 0&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})!==void 0&&(this._showToast(n("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!this._entryId||!this._taskId)return;let t=await this._runWs({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});t!==void 0&&(this._showToast(t?.recommended_interval?`${n("reanalyze_result",this._lang)}: ${mt(t.recommended_interval,"days",this._lang)} (${t.data_points} ${n("data_points",this._lang)})`:n("reanalyze_insufficient_data",this._lang)),await this._loadTask())}_onEditHistoryEntry(t){if(!this._entryId||!this._taskId)return;let s=rt(this._entryId,this._taskId,t,this._task);import("./dialog-mount-4LNFT2BG.js").then(({openHistoryEditDialog:a})=>a(s))}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return o;let s=this._lang;return r`
      <div class="recommendation-card">
        <h4>${n("suggested_interval",s)}</h4>
        ${Zt(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",s)}
        <div class="recommendation-actions">
          ${N(this.hass?.user,this._access)?r`<button class="btn primary qa-apply-suggestion"
                @click=${this._applySuggestion} ?disabled=${this._busy}>
                <ha-icon icon="mdi:check"></ha-icon>
                ${n("apply_suggestion",s)}
              </button>`:o}
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${n("reanalyze",s)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(t){let s=this._lang,a=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,d=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,l=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,c=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!a&&!d&&!l&&!c?r`<div class="adaptive-empty">
        ${n("adaptive_no_data",s)}
      </div>`:r`
      <div class="adaptive-stack">
        ${this._toast?r`<div class="toast">${this._toast}</div>`:o}
        ${a?this._renderRecommendation(t):o}
        ${d?Bt(t,s,this._features):o}
        ${l?Ot(t,s):o}
        ${c?r`
          ${Xt(t,s,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?Gt(t,s):o}
        `:o}
      </div>
    `}_renderDetails(t){let s=this._lang,a=t.history||[],d=t.history_count??a.length,l=Ft(a).slice(0,20);return r`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${n("times_performed",s)}</span>
            <span class="stat-value">${t.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${n("total_cost",s)}</span>
            <span class="stat-value">${L(t.total_cost??0,this._currencySymbol,s)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${n("avg_duration",s)}</span>
            <span class="stat-value">${V(t.average_duration!=null?Math.round(t.average_duration):null,s)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${n("history",s)}</strong>
          <span class="history-count">${d}</span>
        </div>
        ${a.length===0?r`<div class="history-empty">${n("history_empty",s)}</div>`:r`
              <div class="history-list">
                ${l.map(c=>jt(c,{lang:s,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:N(this.hass?.user,this._access)?f=>this._onEditHistoryEntry(f):void 0,readingUnit:t.reading_unit,readingSlotDelta:(f,_)=>it(a,f,_),taskRef:this._taskRef,triggerUnit:Mt(this.hass,t)||null,stateRule:At(t)},{compact:!0}))}
                ${d>l.length?r`<div class="history-more">… +${d-l.length} ${n("older_entries",s)}</div>`:o}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return o;let t=this._lang,s=this._task,a=N(this.hass?.user,this._access),d=!!s&&Q(s);return Lt(()=>this.close(),r`
        ${s?r`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${Dt(s)}"></span>
                  ${Ct()?o:r`<span class="task-name">${s.name}</span>`}
                  ${Rt(s,t)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("./dialog-mount-4LNFT2BG.js").then(({openObjectQuickActions:l})=>{l(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${s.next_due?r`<span><strong>${n("next_due",t)}:</strong> ${A(s.next_due,t)}</span>`:o}
                  ${s.last_performed?r`<span><strong>${n("last_performed",t)}:</strong> ${A(s.last_performed,t)}</span>`:o}
                  ${s.schedule?.kind&&!["manual","one_time"].includes(s.schedule.kind)||s.interval_days!=null?r`<span><strong>${n("interval",t)}:</strong> ${ft(s,t)}</span>`:o}
                  ${Y(s)?r`<span><strong>${n("phase_current",t)}:</strong> ${Y(s)}</span>`:o}
                </div>
                ${s.notes?r`<div class="notes-body">${It(s.notes)}</div>`:o}
              </div>

              ${this._error?U("error",this._error):o}

              ${this._showSkip?r`
                    <div class="inline-form">
                      <ms-textfield label=${n("skip_reason",t)} .value=${this._skipReason}
                        @input=${l=>{this._skipReason=l.target.value}}></ms-textfield>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${n("cancel",t)}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${n("skip",t)}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?r`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${n("reset_to_date",t)}
                        .hass=${this.hass}
                        .lang=${t}
                        .value=${this._resetDate}
                        @value-changed=${l=>{this._resetDate=l.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${n("cancel",t)}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${n("reset",t)}
                        </button>
                      </div>
                    </div>
                  `:this._showPostpone?r`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${n("postpone_date_prompt",t)}
                        .hass=${this.hass}
                        .lang=${t}
                        .value=${this._postponeDate}
                        @value-changed=${l=>{this._postponeDate=l.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showPostpone=!1}} ?disabled=${this._busy}>
                          ${n("cancel",t)}
                        </button>
                        <button class="btn primary qa-postpone-confirm" @click=${this._onPostponeConfirm}
                          ?disabled=${this._busy||!this._postponeDate}>
                          ${n("postpone",t)}
                        </button>
                      </div>
                    </div>
                  `:r`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${()=>this._onComplete()} .disabled=${this._busy}
                        title=${W(s)?n("qr_action_quick_complete",t):n("complete",t)}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${n("complete",t)}
                      </ha-button>
                      ${W(s)?r`<ha-button appearance="outlined" variant="success" class="qa-complete-details" @click=${()=>this._onComplete(!0)} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:text-box-edit-outline"></ha-icon>
                            ${n("complete_with_details",t)}
                          </ha-button>`:o}
                      ${s.allow_skip!==!1?r`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${n("skip",t)}
                            </ha-button>
                          `:o}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${n("reset",t)}
                      </ha-button>
                    </div>
                    <!-- QR is read tier (the panel offers it to operators too);
                         Edit / Archive / Delete follow canWrite() — the panel's
                         operator delegation, not is_admin alone. -->
                    <div class="actions secondary-row">
                      ${a?r`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-edit" @click=${this._onEdit} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                            ${n("edit",t)}
                          </ha-button>`:o}
                      <ha-button size="small" appearance="outlined" variant="neutral" class="qa-qr" @click=${this._onQr} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                        ${n("qr_code",t)}
                      </ha-button>
                      ${d?o:r`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-postpone"
                            @click=${()=>{this._showPostpone=!0}} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:calendar-arrow-right"></ha-icon>
                            ${n("postpone",t)}…
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="neutral" class="qa-snooze" @click=${this._onSnooze} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:bell-sleep-outline"></ha-icon>
                            ${n("snooze",t)}
                          </ha-button>`}
                      ${a?r`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-archive"
                            @click=${s.archived?this._onUnarchive:this._onArchive}
                            .disabled=${this._busy}>
                            <ha-icon slot="start" icon="${s.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                            ${s.archived?n("unarchive",t):n("archive",t)}
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="danger" class="danger qa-delete" @click=${this._onDelete} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                            ${n("delete",t)}
                          </ha-button>`:o}
                    </div>
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?n("hide_details",t):n("show_details",t)}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?r`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?n("hide_stats",t):n("show_stats",t)}
                          </button>`:o}
                    </div>
                    ${this._showDetails?this._renderDetails(s):o}
                    ${this._showAdaptive?this._renderAdaptive(s):o}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${n("open_in_panel",t)}
                      </button>
                    </div>
                  `}
            `:this._error?U("error",this._error):r`<div class="loading">${n("loading",t)}</div>`}
    `,{title:s?.name})}updated(t){t.has("_open")&&this._open&&Tt(this.shadowRoot)}};h.styles=[vt,Ht,at`
    :host { display: contents; --ms-modal-max-width: 460px; }
    .header { display: flex; flex-direction: column; gap: 6px; }
    .title { display: flex; align-items: center; gap: 10px; }
    .status-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
    .task-name { font-size: 18px; font-weight: 600; }
    .object { font-size: 13px; color: var(--secondary-text-color); }
    .link-inline {
      background: transparent; border: none; padding: 0; cursor: pointer;
      color: var(--primary-color); font-size: inherit; font-family: inherit;
    }
    .link-inline:hover { text-decoration: underline; }
    .quick-info {
      display: flex; flex-wrap: wrap; gap: 12px;
      font-size: 12px; color: var(--secondary-text-color);
      padding-top: 4px; border-top: 1px solid var(--divider-color);
    }
    .quick-info strong { color: var(--primary-text-color); font-weight: 500; }
    .actions { display: flex; gap: 8px; }
    .actions.primary-row { gap: 6px; }
    .actions.primary-row .btn { flex: 1; }
    .actions.primary-row ha-button { flex: 1; }
    /* Edit + QR are admin-tools — left-align as a group; Delete is destructive
       so it gets pushed to the far right with margin-left:auto for visual
       separation. Earlier this row was flex-end which left a strange empty
       gap on the left (user feedback). */
    .actions.secondary-row {
      padding-top: 8px; border-top: 1px solid var(--divider-color);
      justify-content: flex-start;
      /* 360 px: Edit + QR + Archive + Delete were 388 px in a 342 px row —
         Delete sat past the dialog edge (audit 2026-09-29). Wrap instead;
         Delete keeps its margin-left:auto on the second line. */
      flex-wrap: wrap;
      row-gap: 6px;
    }
    .actions.secondary-row .btn.danger,
    .actions.secondary-row ha-button.danger {
      margin-left: auto;
    }
    .actions.secondary-row ha-button { --ha-button-font-size: 13px; }
    .btn {
      padding: 8px 12px; font-size: 14px;
      border-radius: var(--ms-radius-6, 6px); cursor: pointer;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color);
      font-weight: 500;
      display: inline-flex; align-items: center; gap: 6px;
      transition: background 0.12s;
    }
    .btn:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .btn[disabled] { opacity: 0.5; cursor: wait; }
    .btn.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, white);
      border-color: var(--primary-color);
    }
    .btn.cancel { background: transparent; }
    .btn.ghost { padding: 6px 10px; font-size: 13px; }
    .btn.danger { color: var(--error-color); }
    .btn ha-icon { --mdc-icon-size: 18px; }
    .inline-form { display: flex; flex-direction: column; gap: 8px; }
    .notes-body {
      margin-top: 8px; padding: 8px; border-radius: var(--ms-radius-6, 6px);
      background: var(--secondary-background-color);
      font-size: 13px; white-space: pre-wrap; word-break: break-word;
    }
    .notes-body ha-markdown { white-space: normal; }
    .inline-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .footer { display: flex; justify-content: center; padding-top: 4px; }
    .link {
      background: transparent; border: none; cursor: pointer;
      color: var(--primary-color); font-size: 13px;
      display: inline-flex; align-items: center; gap: 4px;
    }
    .link:hover { text-decoration: underline; }
    .link ha-icon { --mdc-icon-size: 14px; }
    .loading { padding: 24px; text-align: center; color: var(--secondary-text-color); }
    .error {
      padding: 8px; border-radius: var(--ms-radius-6, 6px);
      background: rgba(211,47,47,0.1);
      color: var(--error-color, #d32f2f); font-size: 13px;
    }

    /* Details (expandable Show details section) */
    .details-toggle { display: flex; justify-content: center; margin-top: 4px; }
    .details {
      display: flex; flex-direction: column; gap: 12px;
      border-top: 1px solid var(--divider-color);
      padding-top: 12px;
    }
    .stats-grid {
      display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;
    }
    .stat {
      display: flex; flex-direction: column; gap: 2px;
      background: var(--secondary-background-color, rgba(255,255,255,0.04));
      padding: 8px; border-radius: var(--ms-radius-6, 6px);
      align-items: center;
    }
    .stat-label { font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { font-size: 16px; font-weight: 600; }
    .history-header {
      display: flex; align-items: baseline; gap: 8px;
      font-size: 14px;
    }
    .history-count {
      font-size: 12px; color: var(--secondary-text-color);
      background: var(--secondary-background-color); padding: 2px 8px; border-radius: 999px;
    }
    .history-empty { color: var(--secondary-text-color); font-style: italic; font-size: 13px; }
    /* The rows themselves are the shared renderer's (.history-entry.compact
       + the history-* classes from sharedStyles); only the list chrome is
       local. */
    .history-list { display: flex; flex-direction: column; max-height: 280px; overflow: auto; }
    .history-list .history-entry {
      padding: 6px 8px; border-radius: var(--ms-radius-6, 6px); border-bottom: none; margin-bottom: 6px;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
    }
    .history-list .history-date { font-size: 11px; }
    .history-list .history-details { font-size: 11px; }
    .history-more { padding: 8px; text-align: center; font-size: 12px; color: var(--secondary-text-color); font-style: italic; }

    /* Adaptive section — wraps the panel renderers (which assume sharedStyles
       are present) and adds dialog-specific layout. */
    .adaptive-stack {
      display: flex; flex-direction: column; gap: 12px;
      border-top: 1px solid var(--divider-color);
      padding-top: 12px;
    }
    .adaptive-empty {
      padding: 16px; text-align: center;
      color: var(--secondary-text-color);
      font-style: italic; font-size: 13px;
      border-top: 1px solid var(--divider-color);
    }
    .toast {
      padding: 8px 12px; border-radius: var(--ms-radius-6, 6px);
      background: rgba(76, 175, 80, 0.15);
      color: var(--success-color, #4caf50); font-size: 13px; font-weight: 500;
    }
    /* The panel's card look (panel-styles.ts is not in this shadow root, so
       the card and its heading rendered bare). */
    .recommendation-card {
      padding: 16px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }
    .recommendation-card h4 { margin: 0 0 12px; font-size: 14px; }
    /* The panel's recommendation-card uses ha-button. We use plain <button>
       in this dialog's button styles. Re-style the action row to match. */
    .recommendation-actions {
      display: flex; gap: 8px; margin-top: 8px;
    }
    /* Constrain SVG charts so they fit the dialog width even on mobile. */
    .weibull-section, .seasonal-card-compact { max-width: 100%; }
    .weibull-chart svg { max-width: 100%; height: auto; }
    .details-toggle { gap: 12px; flex-wrap: wrap; }
  `],u([lt({attribute:!1})],h.prototype,"hass",2),u([m()],h.prototype,"_open",2),u([m()],h.prototype,"_entryId",2),u([m()],h.prototype,"_taskId",2),u([m()],h.prototype,"_task",2),u([m()],h.prototype,"_objectName",2),u([m()],h.prototype,"_taskRef",2),u([m()],h.prototype,"_busy",2),u([m()],h.prototype,"_error",2),u([m()],h.prototype,"_showSkip",2),u([m()],h.prototype,"_showReset",2),u([m()],h.prototype,"_showPostpone",2),u([m()],h.prototype,"_showDetails",2),u([m()],h.prototype,"_showAdaptive",2),u([m()],h.prototype,"_skipReason",2),u([m()],h.prototype,"_resetDate",2),u([m()],h.prototype,"_postponeDate",2),u([m()],h.prototype,"_features",2),u([m()],h.prototype,"_toast",2),u([m()],h.prototype,"_access",2),u([m()],h.prototype,"_partsCostMode",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",h);export{h as MaintenanceTaskQuickActionsDialog};
