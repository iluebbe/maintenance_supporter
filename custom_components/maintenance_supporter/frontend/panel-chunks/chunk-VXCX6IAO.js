/*! maintenance_supporter frontend 2.63.1 */
import{c as tt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-7CRSKNCV.js";import{a as A}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LS7YQ43S.js";import{A as J,C as X,a as m,b as H,c as o,d as P,f as p,g as S,k as j,l as y,m as V,p as a,r as T,s as U,t as G,u as O,v as Z,x as Y,z as Q}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-PFF7S5UN.js";var k=class extends S{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal=""}get _lang(){return T(this.hass)}openEdit(t){this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._loadPartOptions()}async _loadPartOptions(){let t=this._draft;if(t)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"}),s=[];for(let l of e.parts||[]){let d=l.entry_id===t.entry_id,u=l.consumers.some(c=>c.entry_id===t.entry_id&&c.task_id===t.task_id);!d&&!u||s.push({part_id:l.part_id,name:l.name,entry_id:l.entry_id,foreign:!d,object_name:l.object_name})}for(let l of t.used_parts||[]){let d=l.entry_id||t.entry_id;s.some(u=>u.part_id===l.part_id&&u.entry_id===d)||s.push({part_id:l.part_id,name:l.name||l.part_id,entry_id:d,foreign:d!==t.entry_id,object_name:null})}let r={};for(let l of t.used_parts||[])r[`${l.entry_id||t.entry_id}:${l.part_id}`]=l.quantity??1;this._partOptions=s,this._partQty=r,this._partQtyOriginal=this._partSelectionKey()}catch{this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,t])=>t>0).sort(([t],[e])=>t.localeCompare(e)))}close(){this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null}_set(t,e){this._draft&&(this._draft={...this._draft,[t]:e})}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="";try{let t={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(t.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(t.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(t.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(t.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(t.completed_by=this._draft.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(t.used_parts=(this._partOptions||[]).filter(s=>(this._partQty[`${s.entry_id}:${s.part_id}`]||0)>0).map(s=>({part_id:s.part_id,quantity:this._partQty[`${s.entry_id}:${s.part_id}`],...s.foreign?{entry_id:s.entry_id}:{}}))),Object.keys(t).filter(s=>!["type","entry_id","task_id","original_timestamp"].includes(s)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(t),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=A(t,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return p;let t=this._lang,e=this._draft;return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${a("history_edit_title",t)||"Edit history entry"}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${a(e.type,t)||e.type}</span>
        </div>
        <label>
          <span>${a("history_edit_timestamp",t)||"Timestamp"}</span>
          <input type="datetime-local"
            .value=${e.timestamp.length>=16?e.timestamp.slice(0,16):e.timestamp}
            @change=${s=>{let r=s.target.value;this._set("timestamp",r.length===16?`${r}:00`:r)}} />
        </label>
        <label>
          <span>${a("notes_label",t)}</span>
          <textarea
            rows="3"
            @input=${s=>{let r=s.target.value;this._set("notes",r||null)}}
            .value=${e.notes??""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${a("cost",t)||"Cost"}</span>
            <input type="number" min="0" step="0.01"
              .value=${e.cost!=null?String(e.cost):""}
              @input=${s=>{let r=s.target.value;this._set("cost",r?Number(r):null)}} />
          </label>
          <label>
            <span>${a("duration",t)||"Duration (min)"}</span>
            <input type="number" min="0"
              .value=${e.duration!=null?String(e.duration):""}
              @input=${s=>{let r=s.target.value;this._set("duration",r?Number(r):null)}} />
          </label>
        </div>
        ${this._partOptions&&this._partOptions.length>0?o`
          <div class="parts-block">
            <span class="parts-title">${a("complete_parts_used",t)}</span>
            ${this._partOptions.map(s=>{let r=`${s.entry_id}:${s.part_id}`,l=this._partQty[r]||0;return o`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${l>0}
                    @change=${d=>{let u=d.target.checked;this._partQty={...this._partQty,[r]:u?1:0}}} />
                  <span class="part-label">${s.name}${s.foreign&&s.object_name?` (${s.object_name})`:""}</span>
                  ${l>0?o`
                    <input class="part-qty" type="number" min="0.01" max="999" step="0.01"
                      .value=${String(l)}
                      @input=${d=>{let u=parseFloat(d.target.value);!isNaN(u)&&u>0&&(this._partQty={...this._partQty,[r]:u})}} />
                  `:p}
                </label>
              `})}
          </div>
        `:p}
        ${this._error?o`<div class="error">${this._error}</div>`:p}
        <div class="actions">
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${a("cancel",t)||"Cancel"}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?a("saving",t)||"Saving\u2026":a("save",t)||"Save"}
          </button>
        </div>
      </div>
    `}};k.styles=H`
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
  `,m([j({attribute:!1})],k.prototype,"hass",2),m([y()],k.prototype,"_open",2),m([y()],k.prototype,"_saving",2),m([y()],k.prototype,"_error",2),m([y()],k.prototype,"_draft",2),m([y()],k.prototype,"_partOptions",2),m([y()],k.prototype,"_partQty",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",k);var vt={days:1,weeks:7,months:30.4368,years:365.25};function B(n,i){return!n||n<=0?0:n*(vt[i||"days"]??1)}function Wt(n,i,t){let e=B(n,t);if(e<=0||i==null)return{pct:0,overflow:!1};let s=(e-i)/e*100;return{pct:Math.max(0,Math.min(100,s)),overflow:s>100}}var et=5;function R(n){let i=n.getFullYear(),t=String(n.getMonth()+1).padStart(2,"0"),e=String(n.getDate()).padStart(2,"0");return`${i}-${t}-${e}`}function bt(n,i){let t=[];for(let e=0;e<i;e++){let s=new Date(n);s.setDate(s.getDate()+e),s.setHours(0,0,0,0),t.push(R(s))}return t}function W(n,i){let[t,e,s]=n.split("-").map(Number),r=new Date(t,e-1,s);return r.setDate(r.getDate()+i),R(r)}function xt(n){if(!n||n.length===0)return null;let i=n.map(t=>t.cost).filter(t=>typeof t=="number");return i.length===0?null:i.reduce((t,e)=>t+e,0)/i.length}function $t(n){let{windowStart:i,windowEnd:t,task:e,entryId:s,objectName:r}=n,l=[],d=(_,g)=>({date:_,entry_id:s,task_id:e.id,task_name:e.name,object_name:r,status:g&&(e.status==="overdue"||e.status==="triggered")?"ok":e.status,days_until_due:g?null:e.days_until_due??null,projected:g,schedule_type:e.schedule_type,interval_days:e.interval_days??null,interval_unit:e.interval_unit??null,responsible_user_id:e.responsible_user_id??null,avg_cost:xt(e.history),adaptive_enabled:!!e.adaptive_config?.enabled,prediction_confidence:e.threshold_prediction_confidence??null}),u=Math.max(1,Math.round(B(e.interval_days,e.interval_unit)));if(e.status==="overdue"||e.status==="triggered"){if(l.push(d(i,!1)),e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0){let _=W(i,u),g=1;for(;_<=t&&g<et;)l.push(d(_,!0)),g++,_=W(_,u)}return l}let c=e.next_due;if(typeof c!="string"||!c)return l;let h=c.slice(0,10);if(h>=i&&h<=t)l.push(d(h,!1));else if(h>t)return l;if(e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0){let _=W(h,u),g=l.length;for(;_<=t&&g<et;)_>=i&&(l.push(d(_,!0)),g++),_=W(_,u)}return l}var nt={overdue:0,triggered:1,due_soon:2,ok:3};function Bt(n,i,t,e=null){let s=bt(i,t),r=s[0],l=s[s.length-1],d=[];for(let c of n){let h=c.object?.name||"",_=c.entry_id,g=c.tasks||[];for(let f of g){if(e&&f.responsible_user_id!==e||f.enabled===!1)continue;let x=$t({windowStart:r,windowEnd:l,task:f,entryId:_,objectName:h});d.push(...x)}}let u=new Map;for(let c of s)u.set(c,[]);for(let c of d){let h=u.get(c.date);h&&h.push(c)}for(let[,c]of u)c.sort((h,_)=>{let g=nt[h.status]??99,f=nt[_.status]??99;if(g!==f)return g-f;if(h.projected!==_.projected)return h.projected?1:-1;let x=h.object_name.localeCompare(_.object_name);return x!==0?x:h.task_name.localeCompare(_.task_name)});return s.map(c=>({date:c,events:u.get(c)??[]}))}var kt={completed:"ok",reset:"ok",skipped:"due_soon",missed:"overdue",triggered:"triggered",trigger_replaced:"triggered",trigger_removed:"ok"};function wt(n,i){let t=[];for(let e=i-1;e>=0;e--){let s=new Date(n);s.setDate(s.getDate()-e),s.setHours(0,0,0,0),t.push(R(s))}return t}function Kt(n,i,t,e=null){let s=wt(i,t),r=s[0],l=s[s.length-1],d=new Map;for(let c of s)d.set(c,[]);for(let c of n){let h=c.object?.name||"",_=c.entry_id,g=c.tasks||[];for(let f of g){if(e&&f.responsible_user_id!==e)continue;let x=f.history||[];for(let v of x){if(typeof v?.timestamp!="string")continue;let M=v.timestamp.slice(0,10);if(M<r||M>l)continue;let C=d.get(M);if(!C)continue;let D=v.type??"completed";C.push({date:M,entry_id:_,task_id:f.id,task_name:f.name,object_name:h,status:kt[D]??"ok",days_until_due:null,projected:!1,schedule_type:f.schedule_type,interval_days:f.interval_days??null,responsible_user_id:f.responsible_user_id??null,avg_cost:typeof v.cost=="number"?v.cost:null,adaptive_enabled:!!f.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:v.timestamp,history_type:D,history_cost:typeof v.cost=="number"?v.cost:null,history_notes:typeof v.notes=="string"?v.notes:null,history_duration:typeof v.duration=="number"?v.duration:null})}}}let u={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4};for(let[,c]of d)c.sort((h,_)=>{let g=u[h.history_type??""]??99,f=u[_.history_type??""]??99;if(g!==f)return g-f;let x=h.object_name.localeCompare(_.object_name);return x!==0?x:h.task_name.localeCompare(_.task_name)});return s.map(c=>({date:c,events:d.get(c)??[]}))}function st(n,i){let t=n.interval_analysis,e=t?.weibull_beta,s=t?.weibull_eta;if(e==null||s==null||s<=0)return p;let r=n.interval_days??0,l=n.suggested_interval??r;return o`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${a("weibull_reliability_curve",i)}
        ${At(e,i)}
      </div>
      ${Lt(e,s,r,l,i)}
      ${Mt(t,i)}
      ${t?.confidence_interval_low!=null?Dt(t,n,i):p}
    </div>
  `}function At(n,i){let t,e,s;return n<.8?(t="early_failures",e="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",s="beta_early_failures"):n<=1.2?(t="random_failures",e="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",s="beta_random_failures"):n<=3.5?(t="wear_out",e="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",s="beta_wear_out"):(t="highly_predictable",e="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",s="beta_highly_predictable"),o`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${e}"></ha-svg-icon>
      ${a(s,i)} (\u03B2=${n.toFixed(2)})
    </span>
  `}function Lt(n,i,t,e,s){let f=Math.max(t,e,i,1)*1.3,x=50,v=[];for(let $=0;$<=x;$++){let w=$/x*f,ft=1-Math.exp(-Math.pow(w/i,n)),yt=32+w/f*260,gt=136-ft*128;v.push([yt,gt])}let M=v.map(([$,w])=>`${$.toFixed(1)},${w.toFixed(1)}`).join(" "),C="M32,136 "+v.map(([$,w])=>`L${$.toFixed(1)},${w.toFixed(1)}`).join(" ")+` L${v[x][0].toFixed(1)},136 Z`,D=32+t/f*260,F=1-Math.exp(-Math.pow(t/i,n)),z=136-F*128,_t=((1-F)*100).toFixed(0),K=32+e/f*260,mt=[0,.25,.5,.75,1];return o`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${a("chart_weibull",s)}">
        ${mt.map($=>{let w=136-$*128;return P`
            <line x1="${32}" y1="${w.toFixed(1)}" x2="${292}" y2="${w.toFixed(1)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${$===.5?"4,3":p}" />
            <text x="${28}" y="${(w+3).toFixed(1)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${($*100).toFixed(0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(f/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(f)}</text>

        <path d="${C}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${M}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?P`
          <line x1="${D.toFixed(1)}" y1="${8}" x2="${D.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${D.toFixed(1)}" cy="${z.toFixed(1)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${(D+4).toFixed(1)}" y="${(z-6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${_t}%</text>
        `:p}

        ${e>0&&e!==t?P`
          <line x1="${K.toFixed(1)}" y1="${8}" x2="${K.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:p}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${a("weibull_failure_probability",s)}</span>
      ${t>0?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${a("current_interval_marker",s)}</span>`:p}
      ${e>0&&e!==t?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${a("recommended_marker",s)}</span>`:p}
    </div>
  `}function Mt(n,i){return o`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${a("characteristic_life",i)}</span>
        <span class="weibull-info-value">${Math.round(n.weibull_eta)} ${a("days",i)}</span>
      </div>
      ${n.weibull_r_squared!=null?o`
        <div class="weibull-info-item">
          <span>${a("weibull_r_squared",i)}</span>
          <span class="weibull-info-value">${n.weibull_r_squared.toFixed(3)}</span>
        </div>
      `:p}
    </div>
  `}function Dt(n,i,t){let e=n.confidence_interval_low,s=n.confidence_interval_high,r=i.suggested_interval??i.interval_days??0,l=i.interval_days??0,d=Math.max(0,e-5),c=s+5-d,h=(e-d)/c*100,_=(s-e)/c*100,g=(r-d)/c*100,f=l>0?(l-d)/c*100:-1;return o`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${a("confidence_interval",t)}: ${r} ${a("days",t)} (${e}\u2013${s})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${h.toFixed(1)}%;width:${_.toFixed(1)}%"></div>
        ${f>=0?o`<div class="confidence-marker current" style="left:${f.toFixed(1)}%"></div>`:p}
        <div class="confidence-marker recommended" style="left:${g.toFixed(1)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${a("confidence_conservative",t)} (${e}${a("days",t).charAt(0)})</span>
        <span class="confidence-text high">${a("confidence_aggressive",t)} (${s}${a("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function it(n,i,t){let e=n.degradation_trend!=null&&n.degradation_trend!=="insufficient_data",s=n.days_until_threshold!=null,r=n.environmental_factor!=null&&n.environmental_factor!==1;if(!e&&!s&&!r)return p;let l=n.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":n.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return o`
    <div class="prediction-section">
      ${n.sensor_prediction_urgency?o`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${a("sensor_prediction_urgency",i).replace("{days}",String(Math.round(n.days_until_threshold||0)))}
        </div>
      `:p}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${a("sensor_prediction",i)}
      </div>
      <div class="prediction-grid">
        ${e?o`
          <div class="prediction-item">
            <ha-svg-icon path="${l}"></ha-svg-icon>
            <span class="prediction-label">${a("degradation_trend",i)}</span>
            <span class="prediction-value ${n.degradation_trend}">${a("trend_"+n.degradation_trend,i)}</span>
            ${n.degradation_rate!=null?o`<span class="prediction-rate">${n.degradation_rate>0?"+":""}${Math.abs(n.degradation_rate)>=10?Math.round(n.degradation_rate).toLocaleString():n.degradation_rate.toFixed(1)} ${n.trigger_entity_info?.unit_of_measurement||""}/${a("day_short",i)}</span>`:p}
          </div>
        `:p}
        ${s?o`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${a("days_until_threshold",i)}</span>
            <span class="prediction-value prediction-days${n.days_until_threshold===0?" exceeded":n.sensor_prediction_urgency?" urgent":""}">${n.days_until_threshold===0?a("threshold_exceeded",i):"~"+Math.round(n.days_until_threshold)+" "+a("days",i)}</span>
            ${n.threshold_prediction_date?o`<span class="prediction-date">${O(n.threshold_prediction_date,i)}</span>`:p}
            ${n.threshold_prediction_confidence?o`<span class="confidence-dot ${n.threshold_prediction_confidence}"></span>`:p}
          </div>
        `:p}
        ${r&&t.environmental?o`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${a("environmental_adjustment",i)}</span>
            <span class="prediction-value">${n.environmental_factor.toFixed(2)}x</span>
            ${n.environmental_entity?o`<span class="prediction-entity entity-link" @click=${d=>J(d,n.environmental_entity)}>${n.environmental_entity}</span>`:p}
          </div>
        `:p}
      </div>
    </div>
  `}function at(n,i,t,e){let s=Math.max(n||1,i);return o`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${a("current",e)}: ${n??"\u2014"} ${n!=null?a("days",e):""}
        </div>
        <div class="interval-visual current"
          style="width: ${n!=null?Math.min(n/s*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${a("recommended",e)}: ${i} ${a("days",e)}
          <span class="confidence-badge ${t}">${a(`confidence_${t}`,e)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(i/s*100,100)}%"></div>
      </div>
    </div>
  `}var rt=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function ot(n,i,t){if(!t.seasonal||!n.seasonal_factor||n.seasonal_factor===1)return p;let e=rt.map(d=>a(d,i)),s=new Date().getMonth(),r=n.seasonal_factors||n.interval_analysis?.seasonal_factors||null,l=r&&r.length===12?r:e.map((d,u)=>{let c=n.seasonal_factor||1,h=Math.sin((u-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,c+h))});return o`
    <div class="seasonal-card-compact">
      <h4>${a("seasonal_awareness",i)}</h4>
      <div class="seasonal-mini-chart">
        ${l.map((d,u)=>{let c=d*40,h=d<.9?"low":d>1.1?"high":"normal";return o`
            <div class="seasonal-bar ${h} ${u===s?"current":""}"
                 style="height: ${c}px"
                 title="${e[u]}: ${d.toFixed(2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${a("shorter",i)||"K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${a("normal",i)||"Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${a("longer",i)||"L\xE4nger"}</span>
      </div>
    </div>
  `}function lt(n,i){return It(n,i)}function It(n,i){let t=n.seasonal_factors??n.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return p;let e=n.interval_analysis?.seasonal_reason,s=new Date().getMonth(),r=300,l=100,d=8,c=l-d-4,h=Math.max(...t,1.5),_=r/12,g=_*.65,f=d+c-1/h*c;return o`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${a("seasonal_chart_title",i)}
        ${e?o`<span class="source-tag">${e==="learned"?a("seasonal_learned",i):a("seasonal_manual",i)}</span>`:p}
      </div>
      <svg viewBox="0 0 ${r} ${l}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${a("chart_seasonal",i)}">
        <line x1="0" y1="${f.toFixed(1)}" x2="${r}" y2="${f.toFixed(1)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((x,v)=>{let M=x/h*c,C=v*_+(_-g)/2,D=d+c-M,F=v===s,z=x<1?"var(--success-color, #4caf50)":x>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return P`
            <rect x="${C.toFixed(1)}" y="${D.toFixed(1)}"
              width="${g.toFixed(1)}" height="${M.toFixed(1)}"
              fill="${z}" opacity="${F?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${rt.map((x,v)=>o`<span class="seasonal-label ${v===s?"active-month":""}">${a(x,i)}</span>`)}
      </div>
    </div>
  `}var b=class extends S{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._featuresLoaded=!1}get _lang(){return T(this.hass)}async openFor(t,e){this._entryId=t,this._taskId=e,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=R(new Date),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){if(!this._featuresLoaded)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});t?.features&&(this._features={...this._features,...t.features}),this._featuresLoaded=!0}catch{}}close(){this._open=!1,this._task=null,this._error=""}async _loadTask(){if(!(!this._entryId||!this._taskId))try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._objectName=t.object?.name||"";let e=(t.tasks||[]).find(s=>s.id===this._taskId);this._task=e??null}catch(t){this._error=A(t,this._lang)}}async _runWs(t){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(t),this._busy=!1,!0}catch(e){return this._error=A(e,this._lang),this._busy=!1,!1}}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-PY4TVQRX.js").then(async({openCompleteDialog:t})=>{let e=this._task,s=!!e.part_ref,r=[];if(!s)try{let d=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0});r=tt(e,this._entryId,d.objects||[],this._lang)}catch{}t({entry_id:this._entryId,task_id:this._taskId,task_name:e.name,checklist:e.checklist||[],adaptive_enabled:!!e.adaptive_config?.enabled,required_completion_fields:e.required_completion_fields||[],task_type:e.type||"",reading_unit:e.reading_unit||"",parts:r,consumes_parts:s?[]:e.consumes_parts||[]})&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-PY4TVQRX.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-PY4TVQRX.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let t=a("delete_task_confirm",this._lang)||`Delete "${this._task?.name}"?`;if(!window.confirm(t))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})&&(this._toast=a("suggestion_applied",this._lang)||"Applied",this._notifyChanged("apply_suggestion"),await this._loadTask(),setTimeout(()=>{this._toast=""},2500))}async _reanalyzeInterval(){if(!(!this._entryId||!this._taskId)){this._busy=!0,this._error="";try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});this._toast=t.recommended_interval?`${a("reanalyze_result",this._lang)||"Recomputed"}: ${Y(t.recommended_interval,"days",this._lang)} (${t.data_points} pts)`:a("reanalyze_insufficient_data",this._lang)||"Not enough data",await this._loadTask(),setTimeout(()=>{this._toast=""},3500)}catch(t){this._error=A(t,this._lang)}finally{this._busy=!1}}}_onEditHistoryEntry(t){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-PY4TVQRX.js").then(({openHistoryEditDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,original_timestamp:t.timestamp,type:t.type,timestamp:t.timestamp,notes:t.notes??null,cost:t.cost??null,duration:t.duration??null,completed_by:t.completed_by??null,used_parts:t.used_parts??null})})}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return p;let e=this._lang;return o`
      <div class="recommendation-card">
        <h4>${a("suggested_interval",e)}</h4>
        ${at(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",e)}
        <div class="recommendation-actions">
          <button class="btn primary"
            @click=${this._applySuggestion} ?disabled=${this._busy}>
            <ha-icon icon="mdi:check"></ha-icon>
            ${a("apply_suggestion",e)}
          </button>
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${a("reanalyze",e)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(t){let e=this._lang,s=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,r=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,l=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,d=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!s&&!r&&!l&&!d?o`<div class="adaptive-empty">
        ${a("adaptive_no_data",e)||"Not enough completion history yet for adaptive analysis."}
      </div>`:o`
      <div class="adaptive-stack">
        ${this._toast?o`<div class="toast">${this._toast}</div>`:p}
        ${s?this._renderRecommendation(t):p}
        ${r?it(t,e,this._features):p}
        ${l?st(t,e):p}
        ${d?o`
          ${ot(t,e,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?lt(t,e):p}
        `:p}
      </div>
    `}_renderDetails(t){let e=this._lang,s=t.history||[],r=s.filter(u=>u.type==="completed"),l=r.reduce((u,c)=>u+(typeof c.cost=="number"?c.cost:0),0),d=(()=>{let u=r.map(c=>typeof c.duration=="number"?c.duration:null).filter(c=>c!=null);return u.length?Math.round(u.reduce((c,h)=>c+h,0)/u.length):null})();return o`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${a("times_performed",e)||"Performed"}</span>
            <span class="stat-value">${r.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${a("total_cost",e)||"Total cost"}</span>
            <span class="stat-value">${l.toFixed(2)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${a("avg_duration",e)||"Avg duration"}</span>
            <span class="stat-value">${d!=null?`${d}m`:"\u2014"}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${a("history",e)||"History"}</strong>
          <span class="history-count">${s.length}</span>
        </div>
        ${s.length===0?o`<div class="history-empty">${a("history_empty",e)||"No history yet."}</div>`:o`
              <div class="history-list">
                ${[...s].reverse().slice(0,20).map(u=>{let c=["completed","reset","skipped"].includes(u.type);return o`
                    <div class="history-entry">
                      <div class="history-line">
                        <span class="history-type type-${u.type}">${a(u.type,e)}</span>
                        <span class="history-date">${Z(u.timestamp,e)}</span>
                        ${c?o`<button class="history-edit"
                                   title="${a("history_edit_button",e)||"Edit"}"
                                   @click=${()=>this._onEditHistoryEntry(u)}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                            </button>`:p}
                      </div>
                      ${u.notes?o`<div class="history-notes">${u.notes}</div>`:p}
                      ${u.cost!=null||u.duration!=null?o`<div class="history-meta">
                            ${u.cost!=null?o`<span>💰 ${u.cost.toFixed(2)}</span>`:p}
                            ${u.duration!=null?o`<span>⏱️ ${u.duration}m</span>`:p}
                          </div>`:p}
                    </div>
                  `})}
                ${s.length>20?o`<div class="history-more">… +${s.length-20} ${a("older_entries",e)||"older"}</div>`:p}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return p;let t=this._lang,e=this._task,s=this.hass?.user?.is_admin??!0;return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${e?o`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${V[e.status]||"#ccc"}"></span>
                  <span class="task-name">${e.name}</span>
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-PY4TVQRX.js").then(({openObjectQuickActions:r})=>{r(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${e.next_due?o`<span><strong>${a("next_due",t)||"Next due"}:</strong> ${O(e.next_due,t)}</span>`:p}
                  ${e.last_performed?o`<span><strong>${a("last_performed",t)||"Last"}:</strong> ${O(e.last_performed,t)}</span>`:p}
                  ${e.schedule?.kind&&!["manual","one_time"].includes(e.schedule.kind)||e.interval_days!=null?o`<span><strong>${a("interval",t)||"Interval"}:</strong> ${Q(e,t)}</span>`:p}
                </div>
              </div>

              ${this._error?o`<div class="error">${this._error}</div>`:p}

              ${this._showSkip?o`
                    <div class="inline-form">
                      <label>${a("skip_reason",t)||"Skip reason (optional)"}</label>
                      <input type="text" .value=${this._skipReason}
                        @input=${r=>{this._skipReason=r.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${a("cancel",t)||"Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${a("skip",t)||"Skip"}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?o`
                    <div class="inline-form">
                      <label>${a("reset_to_date",t)||"Reset last_performed to"}</label>
                      <input type="date" .value=${this._resetDate}
                        @input=${r=>{this._resetDate=r.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${a("cancel",t)||"Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${a("reset",t)||"Reset"}
                        </button>
                      </div>
                    </div>
                  `:o`
                    <div class="actions primary-row">
                      <button class="btn primary" @click=${this._onComplete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:check"></ha-icon>
                        ${a("complete",t)||"Complete"}
                      </button>
                      <button class="btn" @click=${()=>{this._showSkip=!0}} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:skip-next"></ha-icon>
                        ${a("skip",t)||"Skip"}
                      </button>
                      <button class="btn" @click=${()=>{this._showReset=!0}} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:restart"></ha-icon>
                        ${a("reset",t)||"Reset"}
                      </button>
                    </div>
                    ${s?o`
                          <div class="actions secondary-row">
                            <button class="btn ghost" @click=${this._onEdit} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                              ${a("edit",t)||"Edit"}
                            </button>
                            <button class="btn ghost" @click=${this._onQr} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:qrcode"></ha-icon>
                              ${a("qr_code",t)||"QR"}
                            </button>
                            <button class="btn ghost"
                              @click=${e.archived?this._onUnarchive:this._onArchive}
                              ?disabled=${this._busy}>
                              <ha-icon icon="${e.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                              ${e.archived?a("unarchive",t)||"Unarchive":a("archive",t)||"Archive"}
                            </button>
                            <button class="btn ghost danger" @click=${this._onDelete} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:delete"></ha-icon>
                              ${a("delete",t)||"Delete"}
                            </button>
                          </div>
                        `:p}
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?a("hide_details",t)||"Hide details":a("show_details",t)||"Show history + stats"}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?o`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?a("hide_stats",t)||"Hide stats":a("show_stats",t)||"Show stats + graphs"}
                          </button>`:p}
                    </div>
                    ${this._showDetails?this._renderDetails(e):p}
                    ${this._showAdaptive?this._renderAdaptive(e):p}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${a("open_in_panel",t)||"Open in Maintenance panel"}
                      </button>
                    </div>
                  `}
            `:o`<div class="loading">${a("loading",t)||"Loading\u2026"}</div>`}
      </div>
    `}};b.styles=[X,H`
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
  `],m([j({attribute:!1})],b.prototype,"hass",2),m([y()],b.prototype,"_open",2),m([y()],b.prototype,"_entryId",2),m([y()],b.prototype,"_taskId",2),m([y()],b.prototype,"_task",2),m([y()],b.prototype,"_objectName",2),m([y()],b.prototype,"_busy",2),m([y()],b.prototype,"_error",2),m([y()],b.prototype,"_showSkip",2),m([y()],b.prototype,"_showReset",2),m([y()],b.prototype,"_showDetails",2),m([y()],b.prototype,"_showAdaptive",2),m([y()],b.prototype,"_skipReason",2),m([y()],b.prototype,"_resetDate",2),m([y()],b.prototype,"_features",2),m([y()],b.prototype,"_toast",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",b);function dt(n){return!!n&&/^https?:\/\//i.test(n)}var L=class extends S{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error=""}get _lang(){return T(this.hass)}async openFor(t){this._entryId=t,this._error="",this._open=!0,await this._load()}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._data=t}catch(t){this._error=A(t,this._lang)}}_onEditObject(){!this._entryId||!this._data||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-PY4TVQRX.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-PY4TVQRX.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data)return;let t=a("delete_object_confirm",this._lang)||`Delete "${this._data.object.name}" and all its tasks?`;if(window.confirm(t)){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=A(e,this._lang)}finally{this._busy=!1}}}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t){let e=a("confirm_archive_object",this._lang)||"Archive this object and its tasks?";if(!window.confirm(e))return}this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=A(e,this._lang)}finally{this._busy=!1}}_onTaskClick(t){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-PY4TVQRX.js").then(({openTaskQuickActions:e})=>{e(this._entryId,t)})}render(){if(!this._open)return p;let t=this._lang,e=this._data,s=e?.object,r=e?.tasks||[],l=this.hass?.user?.is_admin??!0;return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${e&&s?o`
              <div class="header">
                <div class="title">${s.name}</div>
                ${this._renderMetaRow(s)}
              </div>

              ${this._error?o`<div class="error">${this._error}</div>`:p}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${a("tasks",t)||"Tasks"}</strong>
                  <span class="count">${r.length}</span>
                </div>
                ${r.length===0?o`<div class="empty">${a("no_tasks",t)||"No tasks yet."}</div>`:o`
                      <div class="task-list">
                        ${r.map(d=>o`
                          <div class="task-row" @click=${()=>this._onTaskClick(d.id)}>
                            <span class="status-dot" style="background: ${V[d.status]||"#ccc"}"></span>
                            <span class="task-name">${d.name}</span>
                            <span class="task-status">${a(d.status||"ok",t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${s.notes?o`
                    <div class="notes-section">
                      <strong>${a("object_notes_label",t)}</strong>
                      <div class="notes-body">${s.notes}</div>
                    </div>
                  `:p}

              ${l?o`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${a("add_task",t)||"Add task"}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${a("edit",t)||"Edit"}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${s.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${s.archived?a("unarchive_object",t)||"Unarchive object":a("archive_object",t)||"Archive object"}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${a("delete",t)||"Delete"}
                      </button>
                    </div>
                  `:p}
            `:o`<div class="loading">${a("loading",t)||"Loading\u2026"}</div>`}
      </div>
    `}_renderMetaRow(t){let e=this._lang,s=[];return t.area_id&&s.push([a("area",e),t.area_id]),t.manufacturer&&s.push([a("manufacturer",e),t.manufacturer]),t.model&&s.push([a("model",e),t.model]),t.serial_number&&s.push([a("serial_number_label",e),t.serial_number]),t.installation_date&&s.push([a("installed",e),t.installation_date]),t.warranty_expiry&&s.push([a("warranty",e),t.warranty_expiry]),t.documentation_url&&s.push([a("documentation_url_label",e),t.documentation_url]),s.length===0?p:o`
      <div class="meta">
        ${s.map(([r,l])=>o`
            <div class="meta-item">
              <span class="meta-label">${r}</span>
              <span class="meta-value">${dt(l)?o`<a href="${l}" target="_blank" rel="noopener noreferrer">${l}</a>`:l}</span>
            </div>
          `)}
      </div>
    `}};L.styles=H`
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
  `,m([j({attribute:!1})],L.prototype,"hass",2),m([y()],L.prototype,"_open",2),m([y()],L.prototype,"_entryId",2),m([y()],L.prototype,"_data",2),m([y()],L.prototype,"_busy",2),m([y()],L.prototype,"_error",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",L);var pt="maintenance-object-dialog",ut="maintenance-task-dialog",Et="maintenance-history-edit-dialog",Tt="maintenance-complete-dialog",Ct="maintenance-qr-dialog",Ht="maintenance-task-quick-actions-dialog",Pt="maintenance-object-quick-actions-dialog";function N(){return document.querySelector("home-assistant")?.hass}function St(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function I(n){let i=St(),t=i.querySelector(n)??document.body.querySelector(n);return t?t.parentNode!==i&&i.appendChild(t):(t=document.createElement(n),i.appendChild(t)),t}function E(n){let i=N();if(!i)return!1;n.hass=i;let t=T(i);return U(t)||G(t).then(()=>{n.requestUpdate?.()}),!0}var ct={features:{adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1},defaultWarningDays:7},q=null;function ht(n){return q||(q=n.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(i=>({features:i.features??ct.features,defaultWarningDays:i.general?.default_warning_days??7})).catch(()=>ct),q)}function Pe(){let n=I(pt);return E(n)?(n.openCreate(),!0):!1}function Se(n,i){let t=I(pt);return E(t)?(t.openEdit(n,i),!0):!1}function je(n="",i){let t=I(ut);if(!E(t))return!1;let e=N();return e?((async()=>{let s=await ht(e),r=t;r.checklistsEnabled=s.features.checklists,r.scheduleTimeEnabled=s.features.schedule_time,r.completionActionsEnabled=s.features.completion_actions,r.defaultWarningDays=s.defaultWarningDays,r.openCreate(n,i)})(),!0):!1}function Oe(n,i){let t=I(ut);if(!E(t))return!1;let e=N();return e?((async()=>{try{let[s,r]=await Promise.all([e.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:n}),ht(e)]),l=(s.tasks||[]).find(u=>u.id===i);if(!l){console.warn(`openEditTaskDialog: task ${i} not found in entry ${n}`);return}let d=t;d.checklistsEnabled=r.features.checklists,d.scheduleTimeEnabled=r.features.schedule_time,d.completionActionsEnabled=r.features.completion_actions,d.defaultWarningDays=r.defaultWarningDays,await d.openEdit(n,l)}catch(s){console.warn("openEditTaskDialog: failed to load task/features",s)}})(),!0):!1}function Re(n){let i=I(Et);return E(i)?(i.openEdit(n),!0):!1}function Fe(n){let i=I(Tt);return E(i)?(i.entryId=n.entry_id,i.taskId=n.task_id,i.taskName=n.task_name,i.checklist=n.checklist??[],i.adaptiveEnabled=!!n.adaptive_enabled,i.requiredFields=n.required_completion_fields??[],i.taskType=n.task_type??"",i.readingUnit=n.reading_unit??"",i.parts=n.parts??[],i.consumesParts=n.consumes_parts??[],i.lang=N()?.language||"en",i.open(),!0):!1}function ze(n){let i=I(Ct);return E(i)?(i.openForTask(n.entry_id,n.task_id,n.object_name,n.task_name),!0):!1}function Ve(n,i){let t=I(Ht);return E(t)?(t.openFor(n,i),!0):!1}function We(n){let i=I(Pt);return E(i)?(i.openFor(n),!0):!1}export{dt as a,Wt as b,R as c,Bt as d,Kt as e,st as f,it as g,at as h,ot as i,lt as j,Pe as k,Se as l,je as m,Oe as n,Re as o,Fe as p,ze as q,Ve as r,We as s};
