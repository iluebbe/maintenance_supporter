/*! maintenance_supporter frontend 2.68.0 */
import{b as nt,c as st}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-CPVQNQQQ.js";import{a as A}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-PPH3NCFT.js";import{A as X,B as tt,D as et,a as m,b as E,c as o,d as S,f as d,h as H,l as j,m as y,n as N,q as a,s as I,t as Z,u as Y,v as O,w as Q,y as J}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YEY3J44W.js";var $=class extends H{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal=""}get _lang(){return I(this.hass)}openEdit(t){this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._loadPartOptions()}async _loadPartOptions(){let t=this._draft;if(t)try{let n=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"}),i=[];for(let l of n.parts||[]){let c=l.entry_id===t.entry_id,p=l.consumers.some(u=>u.entry_id===t.entry_id&&u.task_id===t.task_id);!c&&!p||i.push({part_id:l.part_id,name:l.name,entry_id:l.entry_id,foreign:!c,object_name:l.object_name})}for(let l of t.used_parts||[]){let c=l.entry_id||t.entry_id;i.some(p=>p.part_id===l.part_id&&p.entry_id===c)||i.push({part_id:l.part_id,name:l.name||l.part_id,entry_id:c,foreign:c!==t.entry_id,object_name:null})}let r={};for(let l of t.used_parts||[])r[`${l.entry_id||t.entry_id}:${l.part_id}`]=l.quantity??1;this._partOptions=i,this._partQty=r,this._partQtyOriginal=this._partSelectionKey()}catch{this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,t])=>t>0).sort(([t],[n])=>t.localeCompare(n)))}close(){this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null}_set(t,n){this._draft&&(this._draft={...this._draft,[t]:n})}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="";try{let t={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(t.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(t.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(t.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(t.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(t.completed_by=this._draft.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(t.used_parts=(this._partOptions||[]).filter(i=>(this._partQty[`${i.entry_id}:${i.part_id}`]||0)>0).map(i=>({part_id:i.part_id,quantity:this._partQty[`${i.entry_id}:${i.part_id}`],...i.foreign?{entry_id:i.entry_id}:{}}))),Object.keys(t).filter(i=>!["type","entry_id","task_id","original_timestamp"].includes(i)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(t),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=A(t,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return d;let t=this._lang,n=this._draft;return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${a("history_edit_title",t)||"Edit history entry"}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${a(n.type,t)||n.type}</span>
        </div>
        <label>
          <span>${a("history_edit_timestamp",t)||"Timestamp"}</span>
          <input type="datetime-local"
            .value=${n.timestamp.length>=16?n.timestamp.slice(0,16):n.timestamp}
            @change=${i=>{let r=i.target.value;this._set("timestamp",r.length===16?`${r}:00`:r)}} />
        </label>
        <label>
          <span>${a("notes_label",t)}</span>
          <textarea
            rows="3"
            @input=${i=>{let r=i.target.value;this._set("notes",r||null)}}
            .value=${n.notes??""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${a("cost",t)||"Cost"}</span>
            <input type="number" min="0" step="0.01"
              .value=${n.cost!=null?String(n.cost):""}
              @input=${i=>{let r=i.target.value;this._set("cost",r?Number(r):null)}} />
          </label>
          <label>
            <span>${a("duration",t)||"Duration (min)"}</span>
            <input type="number" min="0"
              .value=${n.duration!=null?String(n.duration):""}
              @input=${i=>{let r=i.target.value;this._set("duration",r?Number(r):null)}} />
          </label>
        </div>
        ${this._partOptions&&this._partOptions.length>0?o`
          <div class="parts-block">
            <span class="parts-title">${a("complete_parts_used",t)}</span>
            ${this._partOptions.map(i=>{let r=`${i.entry_id}:${i.part_id}`,l=this._partQty[r]||0;return o`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${l>0}
                    @change=${c=>{let p=c.target.checked;this._partQty={...this._partQty,[r]:p?1:0}}} />
                  <span class="part-label">${i.name}${i.foreign&&i.object_name?` (${i.object_name})`:""}</span>
                  ${l>0?o`
                    <input class="part-qty" type="number" min="0.01" max="999" step="0.01"
                      .value=${String(l)}
                      @input=${c=>{let p=parseFloat(c.target.value);!isNaN(p)&&p>0&&(this._partQty={...this._partQty,[r]:p})}} />
                  `:d}
                </label>
              `})}
          </div>
        `:d}
        ${this._error?o`<div class="error">${this._error}</div>`:d}
        <div class="actions">
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${a("cancel",t)||"Cancel"}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?a("saving",t)||"Saving\u2026":a("save",t)||"Save"}
          </button>
        </div>
      </div>
    `}};$.styles=E`
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
  `,m([j({attribute:!1})],$.prototype,"hass",2),m([y()],$.prototype,"_open",2),m([y()],$.prototype,"_saving",2),m([y()],$.prototype,"_error",2),m([y()],$.prototype,"_draft",2),m([y()],$.prototype,"_partOptions",2),m([y()],$.prototype,"_partQty",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",$);var At={days:1,weeks:7,months:30.4368,years:365.25};function U(e,s){return!e||e<=0?0:e*(At[s||"days"]??1)}function Yt(e,s,t){let n=U(e,t);if(n<=0||s==null)return{pct:0,overflow:!1};let i=(n-s)/n*100;return{pct:Math.max(0,Math.min(100,i)),overflow:i>100}}var it=5;function R(e){let s=e.getFullYear(),t=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return`${s}-${t}-${n}`}function Lt(e,s){let t=[];for(let n=0;n<s;n++){let i=new Date(e);i.setDate(i.getDate()+n),i.setHours(0,0,0,0),t.push(R(i))}return t}function V(e,s){let[t,n,i]=e.split("-").map(Number),r=new Date(t,n-1,i);return r.setDate(r.getDate()+s),R(r)}function Mt(e){if(!e||e.length===0)return null;let s=e.map(t=>t.cost).filter(t=>typeof t=="number");return s.length===0?null:s.reduce((t,n)=>t+n,0)/s.length}function Dt(e){let{windowStart:s,windowEnd:t,task:n,entryId:i,objectName:r}=e,l=[],c=(_,g)=>({date:_,entry_id:i,task_id:n.id,task_name:n.name,object_name:r,status:g&&(n.status==="overdue"||n.status==="triggered")?"ok":n.status,days_until_due:g?null:n.days_until_due??null,projected:g,schedule_type:n.schedule_type,interval_days:n.interval_days??null,interval_unit:n.interval_unit??null,responsible_user_id:n.responsible_user_id??null,avg_cost:Mt(n.history),adaptive_enabled:!!n.adaptive_config?.enabled,prediction_confidence:n.threshold_prediction_confidence??null}),p=Math.max(1,Math.round(U(n.interval_days,n.interval_unit)));if(n.status==="overdue"||n.status==="triggered"){if(l.push(c(s,!1)),n.schedule_type==="time_based"&&n.interval_days&&n.interval_days>0){let _=V(s,p),g=1;for(;_<=t&&g<it;)l.push(c(_,!0)),g++,_=V(_,p)}return l}let u=n.next_due;if(typeof u!="string"||!u)return l;let h=u.slice(0,10);if(h>=s&&h<=t)l.push(c(h,!1));else if(h>t)return l;if(n.schedule_type==="time_based"&&n.interval_days&&n.interval_days>0){let _=V(h,p),g=l.length;for(;_<=t&&g<it;)_>=s&&(l.push(c(_,!0)),g++),_=V(_,p)}return l}var at={overdue:0,triggered:1,due_soon:2,ok:3};function Xt(e,s,t,n=null){let i=Lt(s,t),r=i[0],l=i[i.length-1],c=[];for(let u of e){let h=u.object?.name||"",_=u.entry_id,g=u.tasks||[];for(let f of g){if(n&&f.responsible_user_id!==n||f.enabled===!1)continue;let x=Dt({windowStart:r,windowEnd:l,task:f,entryId:_,objectName:h});c.push(...x)}}let p=new Map;for(let u of i)p.set(u,[]);for(let u of c){let h=p.get(u.date);h&&h.push(u)}for(let[,u]of p)u.sort((h,_)=>{let g=at[h.status]??99,f=at[_.status]??99;if(g!==f)return g-f;if(h.projected!==_.projected)return h.projected?1:-1;let x=h.object_name.localeCompare(_.object_name);return x!==0?x:h.task_name.localeCompare(_.task_name)});return i.map(u=>({date:u,events:p.get(u)??[]}))}var Tt={completed:"ok",reset:"ok",skipped:"due_soon",missed:"overdue",triggered:"triggered",trigger_replaced:"triggered",trigger_removed:"ok"};function Pt(e,s){let t=[];for(let n=s-1;n>=0;n--){let i=new Date(e);i.setDate(i.getDate()-n),i.setHours(0,0,0,0),t.push(R(i))}return t}function te(e,s,t,n=null){let i=Pt(s,t),r=i[0],l=i[i.length-1],c=new Map;for(let u of i)c.set(u,[]);for(let u of e){let h=u.object?.name||"",_=u.entry_id,g=u.tasks||[];for(let f of g){if(n&&f.responsible_user_id!==n)continue;let x=f.history||[];for(let v of x){if(typeof v?.timestamp!="string")continue;let M=v.timestamp.slice(0,10);if(M<r||M>l)continue;let C=c.get(M);if(!C)continue;let D=v.type??"completed";C.push({date:M,entry_id:_,task_id:f.id,task_name:f.name,object_name:h,status:Tt[D]??"ok",days_until_due:null,projected:!1,schedule_type:f.schedule_type,interval_days:f.interval_days??null,responsible_user_id:f.responsible_user_id??null,avg_cost:typeof v.cost=="number"?v.cost:null,adaptive_enabled:!!f.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:v.timestamp,history_type:D,history_cost:typeof v.cost=="number"?v.cost:null,history_notes:typeof v.notes=="string"?v.notes:null,history_duration:typeof v.duration=="number"?v.duration:null})}}}let p={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4};for(let[,u]of c)u.sort((h,_)=>{let g=p[h.history_type??""]??99,f=p[_.history_type??""]??99;if(g!==f)return g-f;let x=h.object_name.localeCompare(_.object_name);return x!==0?x:h.task_name.localeCompare(_.task_name)});return i.map(u=>({date:u,events:c.get(u)??[]}))}function It(e,s){if(s<=0)return 0;let t=typeof e=="number"&&Number.isFinite(e)?Math.trunc(e):0;return t<0?0:t%s}function Ct(e){return!!(e?.phases&&e.phase_sequence&&e.phase_sequence.length>0)}function K(e){if(!e||!Ct(e))return null;let s=e.phase_sequence,t=It(e.phase_cursor,s.length),n=s[t],i=e.phases?.[n];return i?{id:n,name:i.name,index:t,count:s.length,notes:i.notes,checklist:i.checklist!==void 0?i.checklist:e.checklist??[],consumesParts:i.consumes_parts!==void 0?i.consumes_parts:e.consumes_parts??[],requiredFields:i.required_completion_fields!==void 0?i.required_completion_fields:e.required_completion_fields??[]}:null}function F(e){let s=K(e);return s?`${s.index+1}/${s.count} \xB7 ${s.name}`:""}function rt(e){let s=e.task??null,t=s?K(s):null,n=t?t.consumesParts:s?.consumes_parts||[],i=!!s?.part_ref,r=e.objects.find(p=>p.entry_id===e.entryId)?.parts||[],l=i?r.find(p=>p.id===s.part_ref.part_id):void 0,c=e.checklistsEnabled??!0;return{entry_id:e.entryId,task_id:e.taskId,task_name:e.taskName,checklist:t?c?t.checklist:[]:e.checklist??[],adaptive_enabled:!!e.adaptiveEnabled,required_completion_fields:t?t.requiredFields:s?.required_completion_fields||[],task_type:s?.type||"",reading_unit:s?.reading_unit||"",parts:i?[]:st({consumes_parts:n},e.entryId,e.objects,e.lang),consumes_parts:i?[]:n,phase_label:t?F(s):"",require_tag_scan:!!s?.require_tag_scan,restock_default:i?l?.restock_quantity??1:null,restock_unit_cost:i?l?.cost??null:null,currency_symbol:e.currencySymbol??"",consumes_info:n.map(p=>nt(p,e.entryId,e.objects,e.lang)),checklist_prefill:s?.checklist_progress||{},via_tag_scan:!!e.viaTagScan}}function ot(e,s,t){e.entryId=s.entry_id,e.taskId=s.task_id,e.taskName=s.task_name,e.lang=t,e.checklist=s.checklist??[],e.adaptiveEnabled=!!s.adaptive_enabled,e.requiredFields=s.required_completion_fields??[],e.taskType=s.task_type??"",e.readingUnit=s.reading_unit??"",e.parts=s.parts??[],e.consumesParts=s.consumes_parts??[],e.phaseLabel=s.phase_label??"",e.requireTagScan=!!s.require_tag_scan,e.restockDefault=s.restock_default??null,e.restockUnitCost=s.restock_unit_cost??null,e.currencySymbol=s.currency_symbol??"",e.consumesInfo=s.consumes_info??[],e.checklistPrefill=s.checklist_prefill??{},e.viaTagScan=!!s.via_tag_scan,e.open({viaTagScan:!!s.via_tag_scan})}function lt(e,s){let t=e.interval_analysis,n=t?.weibull_beta,i=t?.weibull_eta;if(n==null||i==null||i<=0)return d;let r=e.interval_days??0,l=e.suggested_interval??r;return o`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${a("weibull_reliability_curve",s)}
        ${Et(n,s)}
      </div>
      ${St(n,i,r,l,s)}
      ${Ht(t,s)}
      ${t?.confidence_interval_low!=null?jt(t,e,s):d}
    </div>
  `}function Et(e,s){let t,n,i;return e<.8?(t="early_failures",n="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):e<=1.2?(t="random_failures",n="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):e<=3.5?(t="wear_out",n="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(t="highly_predictable",n="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),o`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${n}"></ha-svg-icon>
      ${a(i,s)} (\u03B2=${e.toFixed(2)})
    </span>
  `}function St(e,s,t,n,i){let f=Math.max(t,n,s,1)*1.3,x=50,v=[];for(let k=0;k<=x;k++){let w=k/x*f,kt=1-Math.exp(-Math.pow(w/s,e)),$t=32+w/f*260,wt=136-kt*128;v.push([$t,wt])}let M=v.map(([k,w])=>`${k.toFixed(1)},${w.toFixed(1)}`).join(" "),C="M32,136 "+v.map(([k,w])=>`L${k.toFixed(1)},${w.toFixed(1)}`).join(" ")+` L${v[x][0].toFixed(1)},136 Z`,D=32+t/f*260,z=1-Math.exp(-Math.pow(t/s,e)),q=136-z*128,bt=((1-z)*100).toFixed(0),G=32+n/f*260,xt=[0,.25,.5,.75,1];return o`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${a("chart_weibull",i)}">
        ${xt.map(k=>{let w=136-k*128;return S`
            <line x1="${32}" y1="${w.toFixed(1)}" x2="${292}" y2="${w.toFixed(1)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${k===.5?"4,3":d}" />
            <text x="${28}" y="${(w+3).toFixed(1)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${(k*100).toFixed(0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(f/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(f)}</text>

        <path d="${C}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${M}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?S`
          <line x1="${D.toFixed(1)}" y1="${8}" x2="${D.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${D.toFixed(1)}" cy="${q.toFixed(1)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${(D+4).toFixed(1)}" y="${(q-6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${bt}%</text>
        `:d}

        ${n>0&&n!==t?S`
          <line x1="${G.toFixed(1)}" y1="${8}" x2="${G.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:d}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${a("weibull_failure_probability",i)}</span>
      ${t>0?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${a("current_interval_marker",i)}</span>`:d}
      ${n>0&&n!==t?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${a("recommended_marker",i)}</span>`:d}
    </div>
  `}function Ht(e,s){return o`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${a("characteristic_life",s)}</span>
        <span class="weibull-info-value">${Math.round(e.weibull_eta)} ${a("days",s)}</span>
      </div>
      ${e.weibull_r_squared!=null?o`
        <div class="weibull-info-item">
          <span>${a("weibull_r_squared",s)}</span>
          <span class="weibull-info-value">${e.weibull_r_squared.toFixed(3)}</span>
        </div>
      `:d}
    </div>
  `}function jt(e,s,t){let n=e.confidence_interval_low,i=e.confidence_interval_high,r=s.suggested_interval??s.interval_days??0,l=s.interval_days??0,c=Math.max(0,n-5),u=i+5-c,h=(n-c)/u*100,_=(i-n)/u*100,g=(r-c)/u*100,f=l>0?(l-c)/u*100:-1;return o`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${a("confidence_interval",t)}: ${r} ${a("days",t)} (${n}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${h.toFixed(1)}%;width:${_.toFixed(1)}%"></div>
        ${f>=0?o`<div class="confidence-marker current" style="left:${f.toFixed(1)}%"></div>`:d}
        <div class="confidence-marker recommended" style="left:${g.toFixed(1)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${a("confidence_conservative",t)} (${n}${a("days",t).charAt(0)})</span>
        <span class="confidence-text high">${a("confidence_aggressive",t)} (${i}${a("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function ct(e,s,t){let n=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data",i=e.days_until_threshold!=null,r=e.environmental_factor!=null&&e.environmental_factor!==1;if(!n&&!i&&!r)return d;let l=e.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":e.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return o`
    <div class="prediction-section">
      ${e.sensor_prediction_urgency?o`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${a("sensor_prediction_urgency",s).replace("{days}",String(Math.round(e.days_until_threshold||0)))}
        </div>
      `:d}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${a("sensor_prediction",s)}
      </div>
      <div class="prediction-grid">
        ${n?o`
          <div class="prediction-item">
            <ha-svg-icon path="${l}"></ha-svg-icon>
            <span class="prediction-label">${a("degradation_trend",s)}</span>
            <span class="prediction-value ${e.degradation_trend}">${a("trend_"+e.degradation_trend,s)}</span>
            ${e.degradation_rate!=null?o`<span class="prediction-rate">${e.degradation_rate>0?"+":""}${Math.abs(e.degradation_rate)>=10?Math.round(e.degradation_rate).toLocaleString():e.degradation_rate.toFixed(1)} ${e.trigger_entity_info?.unit_of_measurement||""}/${a("day_short",s)}</span>`:d}
          </div>
        `:d}
        ${i?o`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${a("days_until_threshold",s)}</span>
            <span class="prediction-value prediction-days${e.days_until_threshold===0?" exceeded":e.sensor_prediction_urgency?" urgent":""}">${e.days_until_threshold===0?a("threshold_exceeded",s):"~"+Math.round(e.days_until_threshold)+" "+a("days",s)}</span>
            ${e.threshold_prediction_date?o`<span class="prediction-date">${O(e.threshold_prediction_date,s)}</span>`:d}
            ${e.threshold_prediction_confidence?o`<span class="confidence-dot ${e.threshold_prediction_confidence}"></span>`:d}
            ${(e.prediction_cycles??0)>0?o`<span class="prediction-cycles">${a("prediction_cycles",s)}: ${e.prediction_cycles}</span>`:d}
          </div>
        `:d}
        ${r&&t.environmental?o`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${a("environmental_adjustment",s)}</span>
            <span class="prediction-value">${e.environmental_factor.toFixed(2)}x</span>
            ${e.environmental_entity?o`<span class="prediction-entity entity-link" @click=${c=>tt(c,e.environmental_entity)}>${e.environmental_entity}</span>`:d}
          </div>
        `:d}
      </div>
    </div>
  `}function dt(e,s,t,n){let i=Math.max(e||1,s);return o`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${a("current",n)}: ${e??"\u2014"} ${e!=null?a("days",n):""}
        </div>
        <div class="interval-visual current"
          style="width: ${e!=null?Math.min(e/i*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${a("recommended",n)}: ${s} ${a("days",n)}
          <span class="confidence-badge ${t}">${a(`confidence_${t}`,n)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(s/i*100,100)}%"></div>
      </div>
    </div>
  `}var pt=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function ut(e,s,t){if(!t.seasonal||!e.seasonal_factor||e.seasonal_factor===1)return d;let n=pt.map(c=>a(c,s)),i=new Date().getMonth(),r=e.seasonal_factors||e.interval_analysis?.seasonal_factors||null,l=r&&r.length===12?r:n.map((c,p)=>{let u=e.seasonal_factor||1,h=Math.sin((p-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,u+h))});return o`
    <div class="seasonal-card-compact">
      <h4>${a("seasonal_awareness",s)}</h4>
      <div class="seasonal-mini-chart">
        ${l.map((c,p)=>{let u=c*40,h=c<.9?"low":c>1.1?"high":"normal";return o`
            <div class="seasonal-bar ${h} ${p===i?"current":""}"
                 style="height: ${u}px"
                 title="${n[p]}: ${c.toFixed(2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${a("shorter",s)||"K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${a("normal",s)||"Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${a("longer",s)||"L\xE4nger"}</span>
      </div>
    </div>
  `}function ht(e,s){return Ot(e,s)}function Ot(e,s){let t=e.seasonal_factors??e.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return d;let n=e.interval_analysis?.seasonal_reason,i=new Date().getMonth(),r=300,l=100,c=8,u=l-c-4,h=Math.max(...t,1.5),_=r/12,g=_*.65,f=c+u-1/h*u;return o`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${a("seasonal_chart_title",s)}
        ${n?o`<span class="source-tag">${n==="learned"?a("seasonal_learned",s):a("seasonal_manual",s)}</span>`:d}
      </div>
      <svg viewBox="0 0 ${r} ${l}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${a("chart_seasonal",s)}">
        <line x1="0" y1="${f.toFixed(1)}" x2="${r}" y2="${f.toFixed(1)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((x,v)=>{let M=x/h*u,C=v*_+(_-g)/2,D=c+u-M,z=v===i,q=x<1?"var(--success-color, #4caf50)":x>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return S`
            <rect x="${C.toFixed(1)}" y="${D.toFixed(1)}"
              width="${g.toFixed(1)}" height="${M.toFixed(1)}"
              fill="${q}" opacity="${z?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${pt.map((x,v)=>o`<span class="seasonal-label ${v===i?"active-month":""}">${a(x,s)}</span>`)}
      </div>
    </div>
  `}var b=class extends H{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._featuresLoaded=!1;this._currencySymbol=""}get _lang(){return I(this.hass)}async openFor(t,n){this._entryId=t,this._taskId=n,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=R(new Date),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){if(!this._featuresLoaded)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});t?.features&&(this._features={...this._features,...t.features}),this._currencySymbol=t?.budget?.currency_symbol||"",this._featuresLoaded=!0}catch{}}close(){this._open=!1,this._task=null,this._error=""}async _loadTask(){if(!(!this._entryId||!this._taskId))try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._objectName=t.object?.name||"";let n=(t.tasks||[]).find(i=>i.id===this._taskId);this._task=n??null}catch(t){this._error=A(t,this._lang)}}async _runWs(t){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(t),this._busy=!1,!0}catch(n){return this._error=A(n,this._lang),this._busy=!1,!1}}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-2CKELVLB.js").then(async({openCompleteDialog:t})=>{let n=this._task,i=[];try{i=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}t(rt({entryId:this._entryId,taskId:this._taskId,taskName:n.name,task:n,objects:i,lang:this._lang,checklist:n.checklist||[],adaptiveEnabled:!!n.adaptive_config?.enabled,currencySymbol:this._currencySymbol}))&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-2CKELVLB.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-2CKELVLB.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let t=a("delete_task_confirm",this._lang)||`Delete "${this._task?.name}"?`;if(!window.confirm(t))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})&&(this._toast=a("suggestion_applied",this._lang)||"Applied",this._notifyChanged("apply_suggestion"),await this._loadTask(),setTimeout(()=>{this._toast=""},2500))}async _reanalyzeInterval(){if(!(!this._entryId||!this._taskId)){this._busy=!0,this._error="";try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});this._toast=t.recommended_interval?`${a("reanalyze_result",this._lang)||"Recomputed"}: ${J(t.recommended_interval,"days",this._lang)} (${t.data_points} pts)`:a("reanalyze_insufficient_data",this._lang)||"Not enough data",await this._loadTask(),setTimeout(()=>{this._toast=""},3500)}catch(t){this._error=A(t,this._lang)}finally{this._busy=!1}}}_onEditHistoryEntry(t){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-2CKELVLB.js").then(({openHistoryEditDialog:n})=>{n({entry_id:this._entryId,task_id:this._taskId,original_timestamp:t.timestamp,type:t.type,timestamp:t.timestamp,notes:t.notes??null,cost:t.cost??null,duration:t.duration??null,completed_by:t.completed_by??null,used_parts:t.used_parts??null})})}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return d;let n=this._lang;return o`
      <div class="recommendation-card">
        <h4>${a("suggested_interval",n)}</h4>
        ${dt(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",n)}
        <div class="recommendation-actions">
          <button class="btn primary"
            @click=${this._applySuggestion} ?disabled=${this._busy}>
            <ha-icon icon="mdi:check"></ha-icon>
            ${a("apply_suggestion",n)}
          </button>
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${a("reanalyze",n)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(t){let n=this._lang,i=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,r=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,l=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,c=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!i&&!r&&!l&&!c?o`<div class="adaptive-empty">
        ${a("adaptive_no_data",n)||"Not enough completion history yet for adaptive analysis."}
      </div>`:o`
      <div class="adaptive-stack">
        ${this._toast?o`<div class="toast">${this._toast}</div>`:d}
        ${i?this._renderRecommendation(t):d}
        ${r?ct(t,n,this._features):d}
        ${l?lt(t,n):d}
        ${c?o`
          ${ut(t,n,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?ht(t,n):d}
        `:d}
      </div>
    `}_renderDetails(t){let n=this._lang,i=t.history||[],r=i.filter(p=>p.type==="completed"),l=r.reduce((p,u)=>p+(typeof u.cost=="number"?u.cost:0),0),c=(()=>{let p=r.map(u=>typeof u.duration=="number"?u.duration:null).filter(u=>u!=null);return p.length?Math.round(p.reduce((u,h)=>u+h,0)/p.length):null})();return o`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${a("times_performed",n)||"Performed"}</span>
            <span class="stat-value">${r.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${a("total_cost",n)||"Total cost"}</span>
            <span class="stat-value">${l.toFixed(2)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${a("avg_duration",n)||"Avg duration"}</span>
            <span class="stat-value">${c!=null?`${c}m`:"\u2014"}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${a("history",n)||"History"}</strong>
          <span class="history-count">${i.length}</span>
        </div>
        ${i.length===0?o`<div class="history-empty">${a("history_empty",n)||"No history yet."}</div>`:o`
              <div class="history-list">
                ${[...i].reverse().slice(0,20).map(p=>{let u=["completed","reset","skipped"].includes(p.type);return o`
                    <div class="history-entry">
                      <div class="history-line">
                        <span class="history-type type-${p.type}">${a(p.type,n)}</span>
                        <span class="history-date">${Q(p.timestamp,n)}</span>
                        ${u?o`<button class="history-edit"
                                   title="${a("history_edit_button",n)||"Edit"}"
                                   @click=${()=>this._onEditHistoryEntry(p)}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                            </button>`:d}
                      </div>
                      ${p.notes?o`<div class="history-notes">${p.notes}</div>`:d}
                      ${p.cost!=null||p.duration!=null?o`<div class="history-meta">
                            ${p.cost!=null?o`<span>💰 ${p.cost.toFixed(2)}</span>`:d}
                            ${p.duration!=null?o`<span>⏱️ ${p.duration}m</span>`:d}
                          </div>`:d}
                    </div>
                  `})}
                ${i.length>20?o`<div class="history-more">… +${i.length-20} ${a("older_entries",n)||"older"}</div>`:d}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return d;let t=this._lang,n=this._task,i=this.hass?.user?.is_admin??!0;return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${n?o`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${N[n.status]||"#ccc"}"></span>
                  <span class="task-name">${n.name}</span>
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-2CKELVLB.js").then(({openObjectQuickActions:r})=>{r(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${n.next_due?o`<span><strong>${a("next_due",t)||"Next due"}:</strong> ${O(n.next_due,t)}</span>`:d}
                  ${n.last_performed?o`<span><strong>${a("last_performed",t)||"Last"}:</strong> ${O(n.last_performed,t)}</span>`:d}
                  ${n.schedule?.kind&&!["manual","one_time"].includes(n.schedule.kind)||n.interval_days!=null?o`<span><strong>${a("interval",t)||"Interval"}:</strong> ${X(n,t)}</span>`:d}
                  ${F(n)?o`<span><strong>${a("phase_current",t)}:</strong> ${F(n)}</span>`:d}
                </div>
              </div>

              ${this._error?o`<div class="error">${this._error}</div>`:d}

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
                    ${i?o`
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
                              @click=${n.archived?this._onUnarchive:this._onArchive}
                              ?disabled=${this._busy}>
                              <ha-icon icon="${n.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                              ${n.archived?a("unarchive",t)||"Unarchive":a("archive",t)||"Archive"}
                            </button>
                            <button class="btn ghost danger" @click=${this._onDelete} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:delete"></ha-icon>
                              ${a("delete",t)||"Delete"}
                            </button>
                          </div>
                        `:d}
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?a("hide_details",t)||"Hide details":a("show_details",t)||"Show history + stats"}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?o`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?a("hide_stats",t)||"Hide stats":a("show_stats",t)||"Show stats + graphs"}
                          </button>`:d}
                    </div>
                    ${this._showDetails?this._renderDetails(n):d}
                    ${this._showAdaptive?this._renderAdaptive(n):d}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${a("open_in_panel",t)||"Open in Maintenance panel"}
                      </button>
                    </div>
                  `}
            `:o`<div class="loading">${a("loading",t)||"Loading\u2026"}</div>`}
      </div>
    `}};b.styles=[et,E`
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
  `],m([j({attribute:!1})],b.prototype,"hass",2),m([y()],b.prototype,"_open",2),m([y()],b.prototype,"_entryId",2),m([y()],b.prototype,"_taskId",2),m([y()],b.prototype,"_task",2),m([y()],b.prototype,"_objectName",2),m([y()],b.prototype,"_busy",2),m([y()],b.prototype,"_error",2),m([y()],b.prototype,"_showSkip",2),m([y()],b.prototype,"_showReset",2),m([y()],b.prototype,"_showDetails",2),m([y()],b.prototype,"_showAdaptive",2),m([y()],b.prototype,"_skipReason",2),m([y()],b.prototype,"_resetDate",2),m([y()],b.prototype,"_features",2),m([y()],b.prototype,"_toast",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",b);function _t(e){return!!e&&/^https?:\/\//i.test(e)}function mt(e){return e?customElements.get("ha-markdown")?o`<ha-markdown class="notes-md" .content=${e} breaks></ha-markdown>`:o`${e}`:d}var L=class extends H{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error=""}get _lang(){return I(this.hass)}async openFor(t){this._entryId=t,this._error="",this._open=!0,await this._load()}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._data=t}catch(t){this._error=A(t,this._lang)}}_onEditObject(){!this._entryId||!this._data||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-2CKELVLB.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-2CKELVLB.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data)return;let t=a("delete_object_confirm",this._lang)||`Delete "${this._data.object.name}" and all its tasks?`;if(window.confirm(t)){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(n){this._error=A(n,this._lang)}finally{this._busy=!1}}}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t){let n=a("confirm_archive_object",this._lang)||"Archive this object and its tasks?";if(!window.confirm(n))return}this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(n){this._error=A(n,this._lang)}finally{this._busy=!1}}_onTaskClick(t){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-2CKELVLB.js").then(({openTaskQuickActions:n})=>{n(this._entryId,t)})}render(){if(!this._open)return d;let t=this._lang,n=this._data,i=n?.object,r=n?.tasks||[],l=this.hass?.user?.is_admin??!0;return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${n&&i?o`
              <div class="header">
                <div class="title">${i.name}</div>
                ${this._renderMetaRow(i)}
              </div>

              ${this._error?o`<div class="error">${this._error}</div>`:d}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${a("tasks",t)||"Tasks"}</strong>
                  <span class="count">${r.length}</span>
                </div>
                ${r.length===0?o`<div class="empty">${a("no_tasks",t)||"No tasks yet."}</div>`:o`
                      <div class="task-list">
                        ${r.map(c=>o`
                          <div class="task-row" @click=${()=>this._onTaskClick(c.id)}>
                            <span class="status-dot" style="background: ${N[c.status]||"#ccc"}"></span>
                            <span class="task-name">${c.name}</span>
                            <span class="task-status">${a(c.status||"ok",t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${i.notes?o`
                    <div class="notes-section">
                      <strong>${a("object_notes_label",t)}</strong>
                      <div class="notes-body">${mt(i.notes)}</div>
                    </div>
                  `:d}

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
                        <ha-icon icon="${i.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${i.archived?a("unarchive_object",t)||"Unarchive object":a("archive_object",t)||"Archive object"}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${a("delete",t)||"Delete"}
                      </button>
                    </div>
                  `:d}
            `:o`<div class="loading">${a("loading",t)||"Loading\u2026"}</div>`}
      </div>
    `}_renderMetaRow(t){let n=this._lang,i=[];return t.area_id&&i.push([a("area",n),t.area_id]),t.manufacturer&&i.push([a("manufacturer",n),t.manufacturer]),t.model&&i.push([a("model",n),t.model]),t.serial_number&&i.push([a("serial_number_label",n),t.serial_number]),t.installation_date&&i.push([a("installed",n),t.installation_date]),t.warranty_expiry&&i.push([a("warranty",n),t.warranty_expiry]),t.documentation_url&&i.push([a("documentation_url_label",n),t.documentation_url]),i.length===0?d:o`
      <div class="meta">
        ${i.map(([r,l])=>o`
            <div class="meta-item">
              <span class="meta-label">${r}</span>
              <span class="meta-value">${_t(l)?o`<a href="${l}" target="_blank" rel="noopener noreferrer">${l}</a>`:l}</span>
            </div>
          `)}
      </div>
    `}};L.styles=E`
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
    .notes-body ha-markdown { white-space: normal; }
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
  `,m([j({attribute:!1})],L.prototype,"hass",2),m([y()],L.prototype,"_open",2),m([y()],L.prototype,"_entryId",2),m([y()],L.prototype,"_data",2),m([y()],L.prototype,"_busy",2),m([y()],L.prototype,"_error",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",L);var yt="maintenance-object-dialog",gt="maintenance-task-dialog",Rt="maintenance-history-edit-dialog",Ft="maintenance-complete-dialog",zt="maintenance-qr-dialog",qt="maintenance-task-quick-actions-dialog",Nt="maintenance-object-quick-actions-dialog";function B(){return document.querySelector("home-assistant")?.hass}function Vt(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function T(e){let s=Vt(),t=s.querySelector(e)??document.body.querySelector(e);return t?t.parentNode!==s&&s.appendChild(t):(t=document.createElement(e),s.appendChild(t)),t}function P(e){let s=B();if(!s)return!1;e.hass=s;let t=I(s);return Z(t)||Y(t).then(()=>{e.requestUpdate?.()}),!0}var ft={features:{adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1},defaultWarningDays:7},W=null;function vt(e){return W||(W=e.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(s=>({features:s.features??ft.features,defaultWarningDays:s.general?.default_warning_days??7})).catch(()=>ft),W)}function Qe(){let e=T(yt);return P(e)?(e.openCreate(),!0):!1}function Je(e,s){let t=T(yt);return P(t)?(t.openEdit(e,s),!0):!1}function Xe(e="",s){let t=T(gt);if(!P(t))return!1;let n=B();return n?((async()=>{let i=await vt(n),r=t;r.checklistsEnabled=i.features.checklists,r.scheduleTimeEnabled=i.features.schedule_time,r.completionActionsEnabled=i.features.completion_actions,r.defaultWarningDays=i.defaultWarningDays,r.openCreate(e,s)})(),!0):!1}function tn(e,s){let t=T(gt);if(!P(t))return!1;let n=B();return n?((async()=>{try{let[i,r]=await Promise.all([n.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e}),vt(n)]),l=(i.tasks||[]).find(p=>p.id===s);if(!l){console.warn(`openEditTaskDialog: task ${s} not found in entry ${e}`);return}let c=t;c.checklistsEnabled=r.features.checklists,c.scheduleTimeEnabled=r.features.schedule_time,c.completionActionsEnabled=r.features.completion_actions,c.defaultWarningDays=r.defaultWarningDays,await c.openEdit(e,l)}catch(i){console.warn("openEditTaskDialog: failed to load task/features",i)}})(),!0):!1}function en(e){let s=T(Rt);return P(s)?(s.openEdit(e),!0):!1}function nn(e){let s=T(Ft);return P(s)?(ot(s,e,B()?.language||"en"),!0):!1}function sn(e){let s=T(zt);return P(s)?(s.openForTask(e.entry_id,e.task_id,e.object_name,e.task_name),!0):!1}function an(e,s){let t=T(qt);return P(t)?(t.openFor(e,s),!0):!1}function rn(e){let s=T(Nt);return P(s)?(s.openFor(e),!0):!1}export{_t as a,Yt as b,mt as c,It as d,Ct as e,K as f,rt as g,ot as h,R as i,Xt as j,te as k,lt as l,ct as m,dt as n,ut as o,ht as p,Qe as q,Je as r,Xe as s,tn as t,en as u,nn as v,sn as w,an as x,rn as y};
