/*! maintenance_supporter frontend 2.58.0 */
import{a as x}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-C3DZETWB.js";import{A as Y,a as h,b as H,c as r,d as T,f as l,g as E,i as D,j as _,k as z,n as i,o as P,p as N,q as G,s as S,t as B,v as K,x as U,y as Z}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YBKDHJ6H.js";var g=class extends E{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal=""}get _lang(){return P(this.hass)}openEdit(t){this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._loadPartOptions()}async _loadPartOptions(){let t=this._draft;if(t)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"}),s=[];for(let d of e.parts||[]){let c=d.entry_id===t.entry_id,p=d.consumers.some(u=>u.entry_id===t.entry_id&&u.task_id===t.task_id);!c&&!p||s.push({part_id:d.part_id,name:d.name,entry_id:d.entry_id,foreign:!c,object_name:d.object_name})}for(let d of t.used_parts||[]){let c=d.entry_id||t.entry_id;s.some(p=>p.part_id===d.part_id&&p.entry_id===c)||s.push({part_id:d.part_id,name:d.name||d.part_id,entry_id:c,foreign:c!==t.entry_id,object_name:null})}let o={};for(let d of t.used_parts||[])o[`${d.entry_id||t.entry_id}:${d.part_id}`]=d.quantity??1;this._partOptions=s,this._partQty=o,this._partQtyOriginal=this._partSelectionKey()}catch{this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,t])=>t>0).sort(([t],[e])=>t.localeCompare(e)))}close(){this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null}_set(t,e){this._draft&&(this._draft={...this._draft,[t]:e})}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="";try{let t={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(t.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(t.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(t.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(t.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(t.completed_by=this._draft.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(t.used_parts=(this._partOptions||[]).filter(s=>(this._partQty[`${s.entry_id}:${s.part_id}`]||0)>0).map(s=>({part_id:s.part_id,quantity:this._partQty[`${s.entry_id}:${s.part_id}`],...s.foreign?{entry_id:s.entry_id}:{}}))),Object.keys(t).filter(s=>!["type","entry_id","task_id","original_timestamp"].includes(s)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(t),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=x(t,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return l;let t=this._lang,e=this._draft;return r`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${i("history_edit_title",t)||"Edit history entry"}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${i(e.type,t)||e.type}</span>
        </div>
        <label>
          <span>${i("history_edit_timestamp",t)||"Timestamp"}</span>
          <input type="datetime-local"
            .value=${e.timestamp.length>=16?e.timestamp.slice(0,16):e.timestamp}
            @change=${s=>{let o=s.target.value;this._set("timestamp",o.length===16?`${o}:00`:o)}} />
        </label>
        <label>
          <span>${i("notes_label",t)}</span>
          <textarea
            rows="3"
            @input=${s=>{let o=s.target.value;this._set("notes",o||null)}}
            .value=${e.notes??""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${i("cost",t)||"Cost"}</span>
            <input type="number" min="0" step="0.01"
              .value=${e.cost!=null?String(e.cost):""}
              @input=${s=>{let o=s.target.value;this._set("cost",o?Number(o):null)}} />
          </label>
          <label>
            <span>${i("duration",t)||"Duration (min)"}</span>
            <input type="number" min="0"
              .value=${e.duration!=null?String(e.duration):""}
              @input=${s=>{let o=s.target.value;this._set("duration",o?Number(o):null)}} />
          </label>
        </div>
        ${this._partOptions&&this._partOptions.length>0?r`
          <div class="parts-block">
            <span class="parts-title">${i("complete_parts_used",t)}</span>
            ${this._partOptions.map(s=>{let o=`${s.entry_id}:${s.part_id}`,d=this._partQty[o]||0;return r`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${d>0}
                    @change=${c=>{let p=c.target.checked;this._partQty={...this._partQty,[o]:p?1:0}}} />
                  <span class="part-label">${s.name}${s.foreign&&s.object_name?` (${s.object_name})`:""}</span>
                  ${d>0?r`
                    <input class="part-qty" type="number" min="0.01" max="999" step="0.01"
                      .value=${String(d)}
                      @input=${c=>{let p=parseFloat(c.target.value);!isNaN(p)&&p>0&&(this._partQty={...this._partQty,[o]:p})}} />
                  `:l}
                </label>
              `})}
          </div>
        `:l}
        ${this._error?r`<div class="error">${this._error}</div>`:l}
        <div class="actions">
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${i("cancel",t)||"Cancel"}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?i("saving",t)||"Saving\u2026":i("save",t)||"Save"}
          </button>
        </div>
      </div>
    `}};g.styles=H`
    :host { display: contents; }
    .backdrop {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 100;
    }
    .dialog {
      position: fixed; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: 95vw; max-width: 480px;
      background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
      color: var(--primary-text-color);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      padding: 20px;
      display: flex; flex-direction: column; gap: 12px;
      z-index: 101;
      max-height: 90vh; overflow: auto;
    }
    h2 { margin: 0; font-size: 18px; }
    .entry-type {
      display: flex; align-items: center; gap: 6px;
      color: var(--secondary-text-color); font-size: 13px;
    }
    label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
    label span { color: var(--secondary-text-color); }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    input, textarea {
      padding: 8px; font-size: 14px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px;
      width: 100%; box-sizing: border-box;
      font-family: inherit;
    }
    .actions {
      display: flex; gap: 8px; justify-content: flex-end;
      margin-top: 8px;
    }
    button {
      padding: 8px 16px; font-size: 14px;
      border-radius: 6px; cursor: pointer;
      border: none; font-weight: 500;
    }
    button.cancel {
      background: transparent;
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
    }
    button.save {
      background: var(--primary-color);
      color: var(--text-primary-color, white);
    }
    button[disabled] { opacity: 0.5; cursor: wait; }
    .error {
      color: var(--error-color, #d32f2f);
      font-size: 13px; padding: 8px;
      background: rgba(211,47,47,0.1);
      border-radius: 6px;
    }
    /* #130: parts on the entry */
    .parts-block {
      display: flex; flex-direction: column; gap: 6px;
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px; padding: 8px;
    }
    .parts-title { color: var(--secondary-text-color); font-size: 13px; }
    .part-row-edit {
      display: flex; flex-direction: row; align-items: center; gap: 8px;
      font-size: 14px;
    }
    .part-row-edit input[type="checkbox"] { width: auto; }
    .part-label { flex: 1; color: var(--primary-text-color); }
    .part-qty { width: 76px; }
  `,h([D({attribute:!1})],g.prototype,"hass",2),h([_()],g.prototype,"_open",2),h([_()],g.prototype,"_saving",2),h([_()],g.prototype,"_error",2),h([_()],g.prototype,"_draft",2),h([_()],g.prototype,"_partOptions",2),h([_()],g.prototype,"_partQty",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",g);function Q(a,n){let t=a.interval_analysis,e=t?.weibull_beta,s=t?.weibull_eta;if(e==null||s==null||s<=0)return l;let o=a.interval_days??0,d=a.suggested_interval??o;return r`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${i("weibull_reliability_curve",n)}
        ${ut(e,n)}
      </div>
      ${_t(e,s,o,d,n)}
      ${mt(t,n)}
      ${t?.confidence_interval_low!=null?vt(t,a,n):l}
    </div>
  `}function ut(a,n){let t,e,s;return a<.8?(t="early_failures",e="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",s="beta_early_failures"):a<=1.2?(t="random_failures",e="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",s="beta_random_failures"):a<=3.5?(t="wear_out",e="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",s="beta_wear_out"):(t="highly_predictable",e="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",s="beta_highly_predictable"),r`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${e}"></ha-svg-icon>
      ${i(s,n)} (\u03B2=${a.toFixed(2)})
    </span>
  `}function _t(a,n,t,e,s){let v=Math.max(t,e,n,1)*1.3,k=50,w=[];for(let y=0;y<=k;y++){let b=y/k*v,ct=1-Math.exp(-Math.pow(b/n,a)),pt=32+b/v*260,ht=136-ct*128;w.push([pt,ht])}let j=w.map(([y,b])=>`${y.toFixed(1)},${b.toFixed(1)}`).join(" "),W="M32,136 "+w.map(([y,b])=>`L${y.toFixed(1)},${b.toFixed(1)}`).join(" ")+` L${w[k][0].toFixed(1)},136 Z`,I=32+t/v*260,F=1-Math.exp(-Math.pow(t/n,a)),O=136-F*128,lt=((1-F)*100).toFixed(0),q=32+e/v*260,dt=[0,.25,.5,.75,1];return r`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${i("chart_weibull",s)}">
        ${dt.map(y=>{let b=136-y*128;return T`
            <line x1="${32}" y1="${b.toFixed(1)}" x2="${292}" y2="${b.toFixed(1)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${y===.5?"4,3":l}" />
            <text x="${28}" y="${(b+3).toFixed(1)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${(y*100).toFixed(0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(v/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(v)}</text>

        <path d="${W}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${j}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?T`
          <line x1="${I.toFixed(1)}" y1="${8}" x2="${I.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${I.toFixed(1)}" cy="${O.toFixed(1)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${(I+4).toFixed(1)}" y="${(O-6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${lt}%</text>
        `:l}

        ${e>0&&e!==t?T`
          <line x1="${q.toFixed(1)}" y1="${8}" x2="${q.toFixed(1)}" y2="${136 .toFixed(1)}"
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
      ${t>0?r`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${i("current_interval_marker",s)}</span>`:l}
      ${e>0&&e!==t?r`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${i("recommended_marker",s)}</span>`:l}
    </div>
  `}function mt(a,n){return r`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${i("characteristic_life",n)}</span>
        <span class="weibull-info-value">${Math.round(a.weibull_eta)} ${i("days",n)}</span>
      </div>
      ${a.weibull_r_squared!=null?r`
        <div class="weibull-info-item">
          <span>${i("weibull_r_squared",n)}</span>
          <span class="weibull-info-value">${a.weibull_r_squared.toFixed(3)}</span>
        </div>
      `:l}
    </div>
  `}function vt(a,n,t){let e=a.confidence_interval_low,s=a.confidence_interval_high,o=n.suggested_interval??n.interval_days??0,d=n.interval_days??0,c=Math.max(0,e-5),u=s+5-c,f=(e-c)/u*100,M=(s-e)/u*100,C=(o-c)/u*100,v=d>0?(d-c)/u*100:-1;return r`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${i("confidence_interval",t)}: ${o} ${i("days",t)} (${e}\u2013${s})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${f.toFixed(1)}%;width:${M.toFixed(1)}%"></div>
        ${v>=0?r`<div class="confidence-marker current" style="left:${v.toFixed(1)}%"></div>`:l}
        <div class="confidence-marker recommended" style="left:${C.toFixed(1)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${i("confidence_conservative",t)} (${e}${i("days",t).charAt(0)})</span>
        <span class="confidence-text high">${i("confidence_aggressive",t)} (${s}${i("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function J(a,n,t){let e=a.degradation_trend!=null&&a.degradation_trend!=="insufficient_data",s=a.days_until_threshold!=null,o=a.environmental_factor!=null&&a.environmental_factor!==1;if(!e&&!s&&!o)return l;let d=a.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":a.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return r`
    <div class="prediction-section">
      ${a.sensor_prediction_urgency?r`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${i("sensor_prediction_urgency",n).replace("{days}",String(Math.round(a.days_until_threshold||0)))}
        </div>
      `:l}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${i("sensor_prediction",n)}
      </div>
      <div class="prediction-grid">
        ${e?r`
          <div class="prediction-item">
            <ha-svg-icon path="${d}"></ha-svg-icon>
            <span class="prediction-label">${i("degradation_trend",n)}</span>
            <span class="prediction-value ${a.degradation_trend}">${i("trend_"+a.degradation_trend,n)}</span>
            ${a.degradation_rate!=null?r`<span class="prediction-rate">${a.degradation_rate>0?"+":""}${Math.abs(a.degradation_rate)>=10?Math.round(a.degradation_rate).toLocaleString():a.degradation_rate.toFixed(1)} ${a.trigger_entity_info?.unit_of_measurement||""}/${i("day_short",n)}</span>`:l}
          </div>
        `:l}
        ${s?r`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${i("days_until_threshold",n)}</span>
            <span class="prediction-value prediction-days${a.days_until_threshold===0?" exceeded":a.sensor_prediction_urgency?" urgent":""}">${a.days_until_threshold===0?i("threshold_exceeded",n):"~"+Math.round(a.days_until_threshold)+" "+i("days",n)}</span>
            ${a.threshold_prediction_date?r`<span class="prediction-date">${S(a.threshold_prediction_date,n)}</span>`:l}
            ${a.threshold_prediction_confidence?r`<span class="confidence-dot ${a.threshold_prediction_confidence}"></span>`:l}
          </div>
        `:l}
        ${o&&t.environmental?r`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${i("environmental_adjustment",n)}</span>
            <span class="prediction-value">${a.environmental_factor.toFixed(2)}x</span>
            ${a.environmental_entity?r`<span class="prediction-entity entity-link" @click=${c=>Z(c,a.environmental_entity)}>${a.environmental_entity}</span>`:l}
          </div>
        `:l}
      </div>
    </div>
  `}function X(a,n,t,e){let s=Math.max(a||1,n);return r`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${i("current",e)}: ${a??"\u2014"} ${a!=null?i("days",e):""}
        </div>
        <div class="interval-visual current"
          style="width: ${a!=null?Math.min(a/s*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${i("recommended",e)}: ${n} ${i("days",e)}
          <span class="confidence-badge ${t}">${i(`confidence_${t}`,e)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(n/s*100,100)}%"></div>
      </div>
    </div>
  `}var tt=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function et(a,n,t){if(!t.seasonal||!a.seasonal_factor||a.seasonal_factor===1)return l;let e=tt.map(c=>i(c,n)),s=new Date().getMonth(),o=a.seasonal_factors||a.interval_analysis?.seasonal_factors||null,d=o&&o.length===12?o:e.map((c,p)=>{let u=a.seasonal_factor||1,f=Math.sin((p-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,u+f))});return r`
    <div class="seasonal-card-compact">
      <h4>${i("seasonal_awareness",n)}</h4>
      <div class="seasonal-mini-chart">
        ${d.map((c,p)=>{let u=c*40,f=c<.9?"low":c>1.1?"high":"normal";return r`
            <div class="seasonal-bar ${f} ${p===s?"current":""}"
                 style="height: ${u}px"
                 title="${e[p]}: ${c.toFixed(2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${i("shorter",n)||"K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${i("normal",n)||"Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${i("longer",n)||"L\xE4nger"}</span>
      </div>
    </div>
  `}function it(a,n){return ft(a,n)}function ft(a,n){let t=a.seasonal_factors??a.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return l;let e=a.interval_analysis?.seasonal_reason,s=new Date().getMonth(),o=300,d=100,c=8,u=d-c-4,f=Math.max(...t,1.5),M=o/12,C=M*.65,v=c+u-1/f*u;return r`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${i("seasonal_chart_title",n)}
        ${e?r`<span class="source-tag">${e==="learned"?i("seasonal_learned",n):i("seasonal_manual",n)}</span>`:l}
      </div>
      <svg viewBox="0 0 ${o} ${d}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${i("chart_seasonal",n)}">
        <line x1="0" y1="${v.toFixed(1)}" x2="${o}" y2="${v.toFixed(1)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((k,w)=>{let j=k/f*u,W=w*M+(M-C)/2,I=c+u-j,F=w===s,O=k<1?"var(--success-color, #4caf50)":k>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return T`
            <rect x="${W.toFixed(1)}" y="${I.toFixed(1)}"
              width="${C.toFixed(1)}" height="${j.toFixed(1)}"
              fill="${O}" opacity="${F?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${tt.map((k,w)=>r`<span class="seasonal-label ${w===s?"active-month":""}">${i(k,n)}</span>`)}
      </div>
    </div>
  `}var m=class extends E{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._featuresLoaded=!1}get _lang(){return P(this.hass)}async openFor(t,e){this._entryId=t,this._taskId=e,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=new Date().toISOString().slice(0,10),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){if(!this._featuresLoaded)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});t?.features&&(this._features={...this._features,...t.features}),this._featuresLoaded=!0}catch{}}close(){this._open=!1,this._task=null,this._error=""}async _loadTask(){if(!(!this._entryId||!this._taskId))try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._objectName=t.object?.name||"";let e=(t.tasks||[]).find(s=>s.id===this._taskId);this._task=e??null}catch(t){this._error=x(t,this._lang)}}async _runWs(t){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(t),this._busy=!1,!0}catch(e){return this._error=x(e,this._lang),this._busy=!1,!1}}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-4GIG5SEF.js").then(({openCompleteDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,checklist:this._task.checklist||[],adaptive_enabled:!!this._task.adaptive_config?.enabled})&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-4GIG5SEF.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-4GIG5SEF.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let t=i("delete_task_confirm",this._lang)||`Delete "${this._task?.name}"?`;if(!window.confirm(t))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})&&(this._toast=i("suggestion_applied",this._lang)||"Applied",this._notifyChanged("apply_suggestion"),await this._loadTask(),setTimeout(()=>{this._toast=""},2500))}async _reanalyzeInterval(){if(!(!this._entryId||!this._taskId)){this._busy=!0,this._error="";try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});this._toast=t.recommended_interval?`${i("reanalyze_result",this._lang)||"Recomputed"}: ${K(t.recommended_interval,"days",this._lang)} (${t.data_points} pts)`:i("reanalyze_insufficient_data",this._lang)||"Not enough data",await this._loadTask(),setTimeout(()=>{this._toast=""},3500)}catch(t){this._error=x(t,this._lang)}finally{this._busy=!1}}}_onEditHistoryEntry(t){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-4GIG5SEF.js").then(({openHistoryEditDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,original_timestamp:t.timestamp,type:t.type,timestamp:t.timestamp,notes:t.notes??null,cost:t.cost??null,duration:t.duration??null,completed_by:t.completed_by??null,used_parts:t.used_parts??null})})}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return l;let e=this._lang;return r`
      <div class="recommendation-card">
        <h4>${i("suggested_interval",e)}</h4>
        ${X(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",e)}
        <div class="recommendation-actions">
          <button class="btn primary"
            @click=${this._applySuggestion} ?disabled=${this._busy}>
            <ha-icon icon="mdi:check"></ha-icon>
            ${i("apply_suggestion",e)}
          </button>
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${i("reanalyze",e)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(t){let e=this._lang,s=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,o=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,d=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,c=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!s&&!o&&!d&&!c?r`<div class="adaptive-empty">
        ${i("adaptive_no_data",e)||"Not enough completion history yet for adaptive analysis."}
      </div>`:r`
      <div class="adaptive-stack">
        ${this._toast?r`<div class="toast">${this._toast}</div>`:l}
        ${s?this._renderRecommendation(t):l}
        ${o?J(t,e,this._features):l}
        ${d?Q(t,e):l}
        ${c?r`
          ${et(t,e,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?it(t,e):l}
        `:l}
      </div>
    `}_renderDetails(t){let e=this._lang,s=t.history||[],o=s.filter(p=>p.type==="completed"),d=o.reduce((p,u)=>p+(typeof u.cost=="number"?u.cost:0),0),c=(()=>{let p=o.map(u=>typeof u.duration=="number"?u.duration:null).filter(u=>u!=null);return p.length?Math.round(p.reduce((u,f)=>u+f,0)/p.length):null})();return r`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${i("times_performed",e)||"Performed"}</span>
            <span class="stat-value">${o.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${i("total_cost",e)||"Total cost"}</span>
            <span class="stat-value">${d.toFixed(2)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${i("avg_duration",e)||"Avg duration"}</span>
            <span class="stat-value">${c!=null?`${c}m`:"\u2014"}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${i("history",e)||"History"}</strong>
          <span class="history-count">${s.length}</span>
        </div>
        ${s.length===0?r`<div class="history-empty">${i("history_empty",e)||"No history yet."}</div>`:r`
              <div class="history-list">
                ${[...s].reverse().slice(0,20).map(p=>{let u=["completed","reset","skipped"].includes(p.type);return r`
                    <div class="history-entry">
                      <div class="history-line">
                        <span class="history-type type-${p.type}">${i(p.type,e)}</span>
                        <span class="history-date">${B(p.timestamp,e)}</span>
                        ${u?r`<button class="history-edit"
                                   title="${i("history_edit_button",e)||"Edit"}"
                                   @click=${()=>this._onEditHistoryEntry(p)}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                            </button>`:l}
                      </div>
                      ${p.notes?r`<div class="history-notes">${p.notes}</div>`:l}
                      ${p.cost!=null||p.duration!=null?r`<div class="history-meta">
                            ${p.cost!=null?r`<span>💰 ${p.cost.toFixed(2)}</span>`:l}
                            ${p.duration!=null?r`<span>⏱️ ${p.duration}m</span>`:l}
                          </div>`:l}
                    </div>
                  `})}
                ${s.length>20?r`<div class="history-more">… +${s.length-20} ${i("older_entries",e)||"older"}</div>`:l}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return l;let t=this._lang,e=this._task,s=this.hass?.user?.is_admin??!0;return r`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${e?r`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${z[e.status]||"#ccc"}"></span>
                  <span class="task-name">${e.name}</span>
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-4GIG5SEF.js").then(({openObjectQuickActions:o})=>{o(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${e.next_due?r`<span><strong>${i("next_due",t)||"Next due"}:</strong> ${S(e.next_due,t)}</span>`:l}
                  ${e.last_performed?r`<span><strong>${i("last_performed",t)||"Last"}:</strong> ${S(e.last_performed,t)}</span>`:l}
                  ${e.schedule?.kind&&!["manual","one_time"].includes(e.schedule.kind)||e.interval_days!=null?r`<span><strong>${i("interval",t)||"Interval"}:</strong> ${U(e,t)}</span>`:l}
                </div>
              </div>

              ${this._error?r`<div class="error">${this._error}</div>`:l}

              ${this._showSkip?r`
                    <div class="inline-form">
                      <label>${i("skip_reason",t)||"Skip reason (optional)"}</label>
                      <input type="text" .value=${this._skipReason}
                        @input=${o=>{this._skipReason=o.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${i("cancel",t)||"Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${i("skip",t)||"Skip"}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?r`
                    <div class="inline-form">
                      <label>${i("reset_to_date",t)||"Reset last_performed to"}</label>
                      <input type="date" .value=${this._resetDate}
                        @input=${o=>{this._resetDate=o.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${i("cancel",t)||"Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${i("reset",t)||"Reset"}
                        </button>
                      </div>
                    </div>
                  `:r`
                    <div class="actions primary-row">
                      <button class="btn primary" @click=${this._onComplete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:check"></ha-icon>
                        ${i("complete",t)||"Complete"}
                      </button>
                      <button class="btn" @click=${()=>{this._showSkip=!0}} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:skip-next"></ha-icon>
                        ${i("skip",t)||"Skip"}
                      </button>
                      <button class="btn" @click=${()=>{this._showReset=!0}} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:restart"></ha-icon>
                        ${i("reset",t)||"Reset"}
                      </button>
                    </div>
                    ${s?r`
                          <div class="actions secondary-row">
                            <button class="btn ghost" @click=${this._onEdit} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                              ${i("edit",t)||"Edit"}
                            </button>
                            <button class="btn ghost" @click=${this._onQr} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:qrcode"></ha-icon>
                              ${i("qr_code",t)||"QR"}
                            </button>
                            <button class="btn ghost"
                              @click=${e.archived?this._onUnarchive:this._onArchive}
                              ?disabled=${this._busy}>
                              <ha-icon icon="${e.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                              ${e.archived?i("unarchive",t)||"Unarchive":i("archive",t)||"Archive"}
                            </button>
                            <button class="btn ghost danger" @click=${this._onDelete} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:delete"></ha-icon>
                              ${i("delete",t)||"Delete"}
                            </button>
                          </div>
                        `:l}
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?i("hide_details",t)||"Hide details":i("show_details",t)||"Show history + stats"}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?r`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?i("hide_stats",t)||"Hide stats":i("show_stats",t)||"Show stats + graphs"}
                          </button>`:l}
                    </div>
                    ${this._showDetails?this._renderDetails(e):l}
                    ${this._showAdaptive?this._renderAdaptive(e):l}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${i("open_in_panel",t)||"Open in Maintenance panel"}
                      </button>
                    </div>
                  `}
            `:r`<div class="loading">${i("loading",t)||"Loading\u2026"}</div>`}
      </div>
    `}};m.styles=[Y,H`
    :host { display: contents; }
    .backdrop {
      position: fixed; inset: 0; z-index: 100;
      background: rgba(0,0,0,0.5);
    }
    .dialog {
      position: fixed; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: 95vw; max-width: 460px;
      max-height: 92vh; overflow: auto;
      background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
      color: var(--primary-text-color);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      padding: 20px;
      display: flex; flex-direction: column; gap: 14px;
      z-index: 101;
    }
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
    /* Edit + QR are admin-tools — left-align as a group; Delete is destructive
       so it gets pushed to the far right with margin-left:auto for visual
       separation. Earlier this row was flex-end which left a strange empty
       gap on the left (user feedback). */
    .actions.secondary-row {
      padding-top: 8px; border-top: 1px solid var(--divider-color);
      justify-content: flex-start;
    }
    .actions.secondary-row .btn.danger {
      margin-left: auto;
    }
    .btn {
      padding: 8px 12px; font-size: 14px;
      border-radius: 6px; cursor: pointer;
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
    .inline-form label { font-size: 13px; color: var(--secondary-text-color); }
    .inline-form input {
      padding: 8px; font-size: 14px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px;
    }
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
      padding: 8px; border-radius: 6px;
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
      padding: 8px; border-radius: 6px;
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
    .history-list { display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow: auto; }
    .history-entry {
      padding: 6px 8px; border-radius: 6px;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
      font-size: 13px;
    }
    .history-line {
      display: flex; align-items: center; gap: 8px;
      justify-content: space-between;
    }
    .history-type {
      font-weight: 600; font-size: 11px;
      padding: 2px 6px; border-radius: 4px;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .type-completed { background: rgba(46,125,50,0.2); color: #66bb6a; }
    .type-skipped { background: rgba(158,158,158,0.2); color: var(--secondary-text-color); }
    .type-reset { background: rgba(33,150,243,0.2); color: #64b5f6; }
    .type-triggered { background: rgba(255,87,34,0.2); color: #ff8a65; }
    .history-date { font-size: 11px; color: var(--secondary-text-color); flex: 1; text-align: right; }
    .history-edit {
      background: transparent; border: none; cursor: pointer;
      padding: 4px; border-radius: 4px;
      color: var(--secondary-text-color);
    }
    .history-edit:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); color: var(--primary-color); }
    .history-edit ha-icon { --mdc-icon-size: 14px; }
    .history-notes { margin-top: 4px; color: var(--primary-text-color); }
    .history-meta { display: flex; gap: 12px; margin-top: 4px; color: var(--secondary-text-color); font-size: 11px; }
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
      padding: 8px 12px; border-radius: 6px;
      background: rgba(76, 175, 80, 0.15);
      color: #4caf50; font-size: 13px; font-weight: 500;
    }
    /* The panel's recommendation-card uses ha-button. We use plain <button>
       in this dialog's button styles. Re-style the action row to match. */
    .recommendation-actions {
      display: flex; gap: 8px; margin-top: 8px;
    }
    /* Constrain SVG charts so they fit the dialog width even on mobile. */
    .weibull-section, .seasonal-card-compact { max-width: 100%; }
    .weibull-chart svg { max-width: 100%; height: auto; }
    .details-toggle { gap: 12px; flex-wrap: wrap; }
  `],h([D({attribute:!1})],m.prototype,"hass",2),h([_()],m.prototype,"_open",2),h([_()],m.prototype,"_entryId",2),h([_()],m.prototype,"_taskId",2),h([_()],m.prototype,"_task",2),h([_()],m.prototype,"_objectName",2),h([_()],m.prototype,"_busy",2),h([_()],m.prototype,"_error",2),h([_()],m.prototype,"_showSkip",2),h([_()],m.prototype,"_showReset",2),h([_()],m.prototype,"_showDetails",2),h([_()],m.prototype,"_showAdaptive",2),h([_()],m.prototype,"_skipReason",2),h([_()],m.prototype,"_resetDate",2),h([_()],m.prototype,"_features",2),h([_()],m.prototype,"_toast",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",m);function at(a){return!!a&&/^https?:\/\//i.test(a)}var $=class extends E{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error=""}get _lang(){return P(this.hass)}async openFor(t){this._entryId=t,this._error="",this._open=!0,await this._load()}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._data=t}catch(t){this._error=x(t,this._lang)}}_onEditObject(){!this._entryId||!this._data||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-4GIG5SEF.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-4GIG5SEF.js").then(({openCreateTaskDialog:t})=>{t(),this.close()})}async _onDelete(){if(!this._entryId||!this._data)return;let t=i("delete_object_confirm",this._lang)||`Delete "${this._data.object.name}" and all its tasks?`;if(window.confirm(t)){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=x(e,this._lang)}finally{this._busy=!1}}}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t){let e=i("confirm_archive_object",this._lang)||"Archive this object and its tasks?";if(!window.confirm(e))return}this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=x(e,this._lang)}finally{this._busy=!1}}_onTaskClick(t){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-4GIG5SEF.js").then(({openTaskQuickActions:e})=>{e(this._entryId,t)})}render(){if(!this._open)return l;let t=this._lang,e=this._data,s=e?.object,o=e?.tasks||[],d=this.hass?.user?.is_admin??!0;return r`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${e&&s?r`
              <div class="header">
                <div class="title">${s.name}</div>
                ${this._renderMetaRow(s)}
              </div>

              ${this._error?r`<div class="error">${this._error}</div>`:l}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${i("tasks",t)||"Tasks"}</strong>
                  <span class="count">${o.length}</span>
                </div>
                ${o.length===0?r`<div class="empty">${i("no_tasks",t)||"No tasks yet."}</div>`:r`
                      <div class="task-list">
                        ${o.map(c=>r`
                          <div class="task-row" @click=${()=>this._onTaskClick(c.id)}>
                            <span class="status-dot" style="background: ${z[c.status]||"#ccc"}"></span>
                            <span class="task-name">${c.name}</span>
                            <span class="task-status">${i(c.status||"ok",t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${s.notes?r`
                    <div class="notes-section">
                      <strong>${i("object_notes_label",t)}</strong>
                      <div class="notes-body">${s.notes}</div>
                    </div>
                  `:l}

              ${d?r`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${i("add_task",t)||"Add task"}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${i("edit",t)||"Edit"}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${s.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${s.archived?i("unarchive_object",t)||"Unarchive object":i("archive_object",t)||"Archive object"}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${i("delete",t)||"Delete"}
                      </button>
                    </div>
                  `:l}
            `:r`<div class="loading">${i("loading",t)||"Loading\u2026"}</div>`}
      </div>
    `}_renderMetaRow(t){let e=this._lang,s=[];return t.area_id&&s.push([i("area",e),t.area_id]),t.manufacturer&&s.push([i("manufacturer",e),t.manufacturer]),t.model&&s.push([i("model",e),t.model]),t.serial_number&&s.push([i("serial_number_label",e),t.serial_number]),t.installation_date&&s.push([i("installed",e),t.installation_date]),t.warranty_expiry&&s.push([i("warranty",e),t.warranty_expiry]),t.documentation_url&&s.push([i("documentation_url_label",e),t.documentation_url]),s.length===0?l:r`
      <div class="meta">
        ${s.map(([o,d])=>r`
            <div class="meta-item">
              <span class="meta-label">${o}</span>
              <span class="meta-value">${at(d)?r`<a href="${d}" target="_blank" rel="noopener noreferrer">${d}</a>`:d}</span>
            </div>
          `)}
      </div>
    `}};$.styles=H`
    :host { display: contents; }
    .backdrop {
      position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.5);
    }
    .dialog {
      position: fixed; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: 95vw; max-width: 480px;
      max-height: 92vh; overflow: auto;
      background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
      color: var(--primary-text-color);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      padding: 20px; z-index: 101;
      display: flex; flex-direction: column; gap: 14px;
    }
    .header { display: flex; flex-direction: column; gap: 6px; }
    .title { font-size: 20px; font-weight: 600; }
    .meta { display: flex; flex-direction: column; gap: 4px; padding-top: 4px; border-top: 1px solid var(--divider-color); }
    .meta-item { display: flex; gap: 8px; font-size: 12px; }
    .meta-label { color: var(--secondary-text-color); min-width: 100px; }
    .meta-value { color: var(--primary-text-color); flex: 1; word-break: break-word; }
    .meta-value a { color: var(--primary-color); }
    .tasks-section, .notes-section { display: flex; flex-direction: column; gap: 6px; }
    .section-header { display: flex; align-items: baseline; gap: 8px; }
    .count {
      font-size: 11px; color: var(--secondary-text-color);
      background: var(--secondary-background-color); padding: 2px 8px; border-radius: 999px;
    }
    .empty { color: var(--secondary-text-color); font-style: italic; font-size: 13px; padding: 8px 0; }
    .task-list { display: flex; flex-direction: column; gap: 4px; max-height: 200px; overflow: auto; }
    .task-row {
      display: flex; align-items: center; gap: 10px;
      padding: 8px; border-radius: 6px; cursor: pointer;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
      transition: background 0.12s;
    }
    .task-row:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .task-name { flex: 1; font-size: 14px; }
    .task-status { font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; }
    .notes-body { white-space: pre-wrap; font-size: 13px; padding: 8px; background: var(--secondary-background-color); border-radius: 6px; }
    .actions { display: flex; gap: 8px; padding-top: 8px; border-top: 1px solid var(--divider-color); }
    .actions .btn { flex: 1; }
    .btn {
      padding: 8px; font-size: 13px; border-radius: 6px; cursor: pointer;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color); font-weight: 500;
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    }
    .btn:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .btn[disabled] { opacity: 0.5; cursor: wait; }
    .btn.primary { background: var(--primary-color); color: var(--text-primary-color, white); border-color: var(--primary-color); }
    .btn.danger { color: var(--error-color); }
    .btn ha-icon { --mdc-icon-size: 16px; }
    .loading { padding: 24px; text-align: center; color: var(--secondary-text-color); }
    .error { padding: 8px; border-radius: 6px; background: rgba(211,47,47,0.1); color: var(--error-color); font-size: 13px; }
  `,h([D({attribute:!1})],$.prototype,"hass",2),h([_()],$.prototype,"_open",2),h([_()],$.prototype,"_entryId",2),h([_()],$.prototype,"_data",2),h([_()],$.prototype,"_busy",2),h([_()],$.prototype,"_error",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",$);var nt="maintenance-object-dialog",rt="maintenance-task-dialog",yt="maintenance-history-edit-dialog",gt="maintenance-complete-dialog",bt="maintenance-qr-dialog",xt="maintenance-task-quick-actions-dialog",$t="maintenance-object-quick-actions-dialog";function V(){return document.querySelector("home-assistant")?.hass}function kt(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function A(a){let n=kt(),t=n.querySelector(a)??document.body.querySelector(a);return t?t.parentNode!==n&&n.appendChild(t):(t=document.createElement(a),n.appendChild(t)),t}function L(a){let n=V();if(!n)return!1;a.hass=n;let t=n.language||"en";return N(t)||G(t).then(()=>{a.requestUpdate?.()}),!0}var st={features:{adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1},defaultWarningDays:7},R=null;function ot(a){return R||(R=a.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(n=>({features:n.features??st.features,defaultWarningDays:n.general?.default_warning_days??7})).catch(()=>st),R)}function _e(){let a=A(nt);return L(a)?(a.openCreate(),!0):!1}function me(a,n){let t=A(nt);return L(t)?(t.openEdit(a,n),!0):!1}function ve(){let a=A(rt);if(!L(a))return!1;let n=V();return n?((async()=>{let t=await ot(n),e=a;e.checklistsEnabled=t.features.checklists,e.scheduleTimeEnabled=t.features.schedule_time,e.completionActionsEnabled=t.features.completion_actions,e.defaultWarningDays=t.defaultWarningDays,e.openCreate()})(),!0):!1}function fe(a,n){let t=A(rt);if(!L(t))return!1;let e=V();return e?((async()=>{try{let[s,o]=await Promise.all([e.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:a}),ot(e)]),d=(s.tasks||[]).find(p=>p.id===n);if(!d){console.warn(`openEditTaskDialog: task ${n} not found in entry ${a}`);return}let c=t;c.checklistsEnabled=o.features.checklists,c.scheduleTimeEnabled=o.features.schedule_time,c.completionActionsEnabled=o.features.completion_actions,c.defaultWarningDays=o.defaultWarningDays,await c.openEdit(a,d)}catch(s){console.warn("openEditTaskDialog: failed to load task/features",s)}})(),!0):!1}function ye(a){let n=A(yt);return L(n)?(n.openEdit(a),!0):!1}function ge(a){let n=A(gt);return L(n)?(n.entryId=a.entry_id,n.taskId=a.task_id,n.taskName=a.task_name,n.checklist=a.checklist??[],n.adaptiveEnabled=!!a.adaptive_enabled,n.requiredFields=a.required_completion_fields??[],n.lang=V()?.language||"en",n.open(),!0):!1}function be(a){let n=A(bt);return L(n)?(n.openForTask(a.entry_id,a.task_id,a.object_name,a.task_name),!0):!1}function xe(a,n){let t=A(xt);return L(t)?(t.openFor(a,n),!0):!1}function $e(a){let n=A($t);return L(n)?(n.openFor(a),!0):!1}export{at as a,Q as b,J as c,X as d,et as e,it as f,_e as g,me as h,ve as i,fe as j,ye as k,ge as l,be as m,xe as n,$e as o};
