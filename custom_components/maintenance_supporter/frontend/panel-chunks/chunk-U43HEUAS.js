/*! maintenance_supporter frontend 2.74.0 */
import{b as dt,f as B,g as mt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-RXE27YTY.js";import{a as ht,b as _t,c as J}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-45FQYU3O.js";import{b as pt,c as ut}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-KR2XOAGJ.js";import{a as L}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-OSRYKBRL.js";import{A as at,C as rt,H as Z,I as ot,J as lt,L as ct,a as h,b as S,c as o,d as R,f as u,h as j,l as P,m,n as U,q as a,s as H,t as et,u as nt,v as st,w as x,y as it,z as q}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-KDS7VT7O.js";var O=class extends j{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await dt(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?u:this._url?o`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:o`<div class="ph"></div>`}};O.styles=S`
    .wrap { display: inline-block; margin-top: 4px; }
    /* #161: uniform 96px tiles — several photos sit in a strip, so a
       tiny or portrait shot must not collapse its slot. */
    img {
      width: 96px;
      height: 96px;
      object-fit: cover;
      border-radius: 6px;
      display: block;
      border: 1px solid var(--divider-color);
      box-sizing: border-box;
    }
    .ph {
      width: 96px;
      height: 96px;
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      margin-top: 4px;
    }
  `,h([P({attribute:!1})],O.prototype,"hass",2),h([P()],O.prototype,"docId",2),h([m()],O.prototype,"_url",2),h([m()],O.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",O);var w=class extends j{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._photos=[];this._photosOriginal="";this._uploadedIds=[];this._photoUploading=!1}get _lang(){return H(this.hass)}openEdit(t){this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos=[...t.photo_doc_ids??[]],this._photosOriginal=JSON.stringify(this._photos),this._uploadedIds=[],this._photoUploading=!1,this._loadPartOptions()}async _onPhotoInput(t){let n=t.target,i=Array.from(n.files??[]);n.value="";let r=this._draft;if(i.length===0||!r)return;let c=10-this._photos.length,p=i.slice(0,Math.max(c,0));this._photoUploading=!0,this._error="";try{for(let d of p){let l=await _t(this.hass,r.entry_id,d);this._uploadedIds=[...this._uploadedIds,l],this._photos=[...this._photos,l]}i.length>p.length&&(this._error=a("photos_limit",this._lang).replace("{max}",String(10)))}catch(d){let l=d instanceof Error&&d.message==="doc_too_large"?"doc_too_large":"doc_upload_failed";this._error=a(l,this._lang)}finally{this._photoUploading=!1}}_removePhoto(t){this._photos=this._photos.filter(n=>n!==t),this._uploadedIds.includes(t)&&(this._uploadedIds=this._uploadedIds.filter(n=>n!==t),J(this.hass,[t]))}async _loadPartOptions(){let t=this._draft;if(t)try{let n=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"}),i=[];for(let c of n.parts||[]){let p=c.entry_id===t.entry_id,d=c.consumers.some(l=>l.entry_id===t.entry_id&&l.task_id===t.task_id);!p&&!d||i.push({part_id:c.part_id,name:c.name,entry_id:c.entry_id,foreign:!p,object_name:c.object_name})}for(let c of t.used_parts||[]){let p=c.entry_id||t.entry_id;i.some(d=>d.part_id===c.part_id&&d.entry_id===p)||i.push({part_id:c.part_id,name:c.name||c.part_id,entry_id:p,foreign:p!==t.entry_id,object_name:null})}let r={};for(let c of t.used_parts||[])r[`${c.entry_id||t.entry_id}:${c.part_id}`]=c.quantity??1;this._partOptions=i,this._partQty=r,this._partQtyOriginal=this._partSelectionKey()}catch{this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,t])=>t>0).sort(([t],[n])=>t.localeCompare(n)))}close(){if(this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._uploadedIds.length>0){let t=this._uploadedIds;this._uploadedIds=[],J(this.hass,t)}}_set(t,n){this._draft&&(this._draft={...this._draft,[t]:n})}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="";try{let t={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(t.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(t.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(t.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(t.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(t.completed_by=this._draft.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(t.used_parts=(this._partOptions||[]).filter(i=>(this._partQty[`${i.entry_id}:${i.part_id}`]||0)>0).map(i=>({part_id:i.part_id,quantity:this._partQty[`${i.entry_id}:${i.part_id}`],...i.foreign?{entry_id:i.entry_id}:{}}))),JSON.stringify(this._photos)!==this._photosOriginal&&(t.photo_doc_ids=[...this._photos]),Object.keys(t).filter(i=>!["type","entry_id","task_id","original_timestamp"].includes(i)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(t),this._uploadedIds=[],this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=L(t,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return u;let t=this._lang,n=this._draft;return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${a("history_edit_title",t)||"Edit history entry"}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${a(n.type,t)||n.type}</span>
        </div>
        <ms-date-field
          kind="datetime"
          required
          .hass=${this.hass}
          .lang=${t}
          .label=${a("history_edit_timestamp",t)||"Timestamp"}
          .value=${n.timestamp.slice(0,19)}
          @value-changed=${i=>{let r=i.detail.value;r&&this._set("timestamp",r)}}
        ></ms-date-field>
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
            ${this._partOptions.map(i=>{let r=`${i.entry_id}:${i.part_id}`,c=this._partQty[r]||0;return o`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${c>0}
                    @change=${p=>{let d=p.target.checked;this._partQty={...this._partQty,[r]:d?1:0}}} />
                  <span class="part-label">${i.name}${i.foreign&&i.object_name?` (${i.object_name})`:""}</span>
                  ${c>0?o`
                    <input class="part-qty" type="number" min="0.01" max="999" step="0.01"
                      .value=${String(c)}
                      @input=${p=>{let d=parseFloat(p.target.value);!isNaN(d)&&d>0&&(this._partQty={...this._partQty,[r]:d})}} />
                  `:u}
                </label>
              `})}
          </div>
        `:u}
        <div class="photos-block">
          <span class="parts-title">${a("completion_photos",t)}</span>
          ${this._photos.length>0?o`
            <div class="photo-strip">
              ${this._photos.map(i=>o`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${i}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${a("remove",t)}
                    @click=${()=>this._removePhoto(i)}>✕</button>
                </div>`)}
            </div>`:u}
          ${this._photos.length<10?o`
            <label class="photo-add">
              <ha-icon icon="mdi:image-plus"></ha-icon>
              <span>${this._photoUploading?a("uploading",t):a("add_photos",t)}</span>
              <input type="file" accept="image/*" multiple
                ?disabled=${this._photoUploading}
                @change=${this._onPhotoInput} />
            </label>`:o`<span class="photos-hint">${a("photos_limit",t).replace("{max}",String(10))}</span>`}
          <span class="photos-hint">${a("history_edit_photos_hint",t)}</span>
        </div>
        ${this._error?o`<div class="error">${this._error}</div>`:u}
        <div class="actions">
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${a("cancel",t)||"Cancel"}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?a("saving",t)||"Saving\u2026":a("save",t)||"Save"}
          </button>
        </div>
      </div>
    `}};w.styles=S`
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
    /* #161: photos on the entry */
    .photos-block {
      display: flex; flex-direction: column; gap: 6px;
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px; padding: 8px;
    }
    .photo-strip { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 6px; }
    .photo-tile { position: relative; width: fit-content; }
    .photo-remove {
      position: absolute; top: -4px; right: -8px;
      width: 22px; height: 22px; border-radius: 50%; border: none;
      background: var(--error-color, #db4437); color: #fff;
      cursor: pointer; font-size: 11px; line-height: 1; padding: 0;
    }
    .photo-add {
      display: inline-flex; flex-direction: row; align-items: center; gap: 8px;
      width: fit-content; padding: 6px 10px;
      border: 1px dashed var(--divider-color, #444); border-radius: 8px;
      cursor: pointer; font-size: 13px; color: var(--secondary-text-color);
      --mdc-icon-size: 18px;
    }
    .photo-add:hover { border-color: var(--primary-color); }
    .photo-add input[type="file"] { display: none; }
    .photos-hint { font-size: 12px; color: var(--secondary-text-color); }
  `,h([P({attribute:!1})],w.prototype,"hass",2),h([m()],w.prototype,"_open",2),h([m()],w.prototype,"_saving",2),h([m()],w.prototype,"_error",2),h([m()],w.prototype,"_draft",2),h([m()],w.prototype,"_partOptions",2),h([m()],w.prototype,"_partQty",2),h([m()],w.prototype,"_photos",2),h([m()],w.prototype,"_photoUploading",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",w);var jt={days:1,weeks:7,months:30.4368,years:365.25};function Q(e,s){return!e||e<=0?0:e*(jt[s||"days"]??1)}function _e(e,s,t){let n=Q(e,t);if(n<=0||s==null)return{pct:0,overflow:!1};let i=(n-s)/n*100;return{pct:Math.max(0,Math.min(100,i)),overflow:i>100}}var ft=5;function N(e){let s=e.getFullYear(),t=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return`${s}-${t}-${n}`}function Ht(e,s){let t=[];for(let n=0;n<s;n++){let i=new Date(e);i.setDate(i.getDate()+n),i.setHours(0,0,0,0),t.push(N(i))}return t}function G(e,s){let[t,n,i]=e.split("-").map(Number),r=new Date(t,n-1,i);return r.setDate(r.getDate()+s),N(r)}function Ot(e){if(!e||e.length===0)return null;let s=e.map(t=>t.cost).filter(t=>typeof t=="number");return s.length===0?null:s.reduce((t,n)=>t+n,0)/s.length}function zt(e){let{windowStart:s,windowEnd:t,task:n,entryId:i,objectName:r}=e,c=[],p=(f,v)=>({date:f,entry_id:i,task_id:n.id,task_name:n.name,object_name:r,status:v&&(n.status==="overdue"||n.status==="triggered")?"ok":n.status,days_until_due:v?null:n.days_until_due??null,projected:v,schedule_type:n.schedule_type,interval_days:n.interval_days??null,interval_unit:n.interval_unit??null,responsible_user_id:n.responsible_user_id??null,avg_cost:Ot(n.history),adaptive_enabled:!!n.adaptive_config?.enabled,prediction_confidence:n.threshold_prediction_confidence??null}),d=Math.max(1,Math.round(Q(n.interval_days,n.interval_unit)));if(n.status==="overdue"||n.status==="triggered"){if(c.push(p(s,!1)),n.schedule_type==="time_based"&&n.interval_days&&n.interval_days>0){let f=G(s,d),v=1;for(;f<=t&&v<ft;)c.push(p(f,!0)),v++,f=G(f,d)}return c}let l=n.next_due;if(typeof l!="string"||!l)return c;let _=l.slice(0,10);if(_>=s&&_<=t)c.push(p(_,!1));else if(_>t)return c;if(n.schedule_type==="time_based"&&n.interval_days&&n.interval_days>0){let f=G(_,d),v=c.length;for(;f<=t&&v<ft;)f>=s&&(c.push(p(f,!0)),v++),f=G(f,d)}return c}var gt={overdue:0,triggered:1,due_soon:2,ok:3};function ge(e,s,t,n=null){let i=Ht(s,t),r=i[0],c=i[i.length-1],p=[];for(let l of e){let _=l.object?.name||"",f=l.entry_id,v=l.tasks||[];for(let g of v){if(n&&g.responsible_user_id!==n||g.enabled===!1)continue;let $=zt({windowStart:r,windowEnd:c,task:g,entryId:f,objectName:_});p.push(...$)}}let d=new Map;for(let l of i)d.set(l,[]);for(let l of p){let _=d.get(l.date);_&&_.push(l)}for(let[,l]of d)l.sort((_,f)=>{let v=gt[_.status]??99,g=gt[f.status]??99;if(v!==g)return v-g;if(_.projected!==f.projected)return _.projected?1:-1;let $=_.object_name.localeCompare(f.object_name);return $!==0?$:_.task_name.localeCompare(f.task_name)});return i.map(l=>({date:l,events:d.get(l)??[]}))}var Rt={completed:"ok",reset:"ok",skipped:"due_soon",missed:"overdue",triggered:"triggered",trigger_replaced:"triggered",trigger_removed:"ok"};function qt(e,s){let t=[];for(let n=s-1;n>=0;n--){let i=new Date(e);i.setDate(i.getDate()-n),i.setHours(0,0,0,0),t.push(N(i))}return t}function ye(e,s,t,n=null){let i=qt(s,t),r=i[0],c=i[i.length-1],p=new Map;for(let l of i)p.set(l,[]);for(let l of e){let _=l.object?.name||"",f=l.entry_id,v=l.tasks||[];for(let g of v){if(n&&g.responsible_user_id!==n)continue;let $=g.history||[];for(let b of $){if(typeof b?.timestamp!="string")continue;let M=b.timestamp.slice(0,10);if(M<r||M>c)continue;let z=p.get(M);if(!z)continue;let T=b.type??"completed";z.push({date:M,entry_id:f,task_id:g.id,task_name:g.name,object_name:_,status:Rt[T]??"ok",days_until_due:null,projected:!1,schedule_type:g.schedule_type,interval_days:g.interval_days??null,responsible_user_id:g.responsible_user_id??null,avg_cost:typeof b.cost=="number"?b.cost:null,adaptive_enabled:!!g.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:b.timestamp,history_type:T,history_cost:typeof b.cost=="number"?b.cost:null,history_notes:typeof b.notes=="string"?b.notes:null,history_duration:typeof b.duration=="number"?b.duration:null})}}}let d={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4};for(let[,l]of p)l.sort((_,f)=>{let v=d[_.history_type??""]??99,g=d[f.history_type??""]??99;if(v!==g)return v-g;let $=_.object_name.localeCompare(f.object_name);return $!==0?$:_.task_name.localeCompare(f.task_name)});return i.map(l=>({date:l,events:p.get(l)??[]}))}function Nt(e,s){if(s<=0)return 0;let t=typeof e=="number"&&Number.isFinite(e)?Math.trunc(e):0;return t<0?0:t%s}function Vt(e){return!!(e?.phases&&e.phase_sequence&&e.phase_sequence.length>0)}function X(e){if(!e||!Vt(e))return null;let s=e.phase_sequence,t=Nt(e.phase_cursor,s.length),n=s[t],i=e.phases?.[n];return i?{id:n,name:i.name,index:t,count:s.length,notes:i.notes,checklist:i.checklist!==void 0?i.checklist:e.checklist??[],consumesParts:i.consumes_parts!==void 0?i.consumes_parts:e.consumes_parts??[],requiredFields:i.required_completion_fields!==void 0?i.required_completion_fields:e.required_completion_fields??[]}:null}function V(e){let s=X(e);return s?`${s.index+1}/${s.count} \xB7 ${s.name}`:""}function yt(e){let s=e.task??null,t=s?X(s):null,n=t?t.consumesParts:s?.consumes_parts||[],i=!!s?.part_ref,r=e.objects.find(d=>d.entry_id===e.entryId)?.parts||[],c=i?r.find(d=>d.id===s.part_ref.part_id):void 0,p=e.checklistsEnabled??!0;return{entry_id:e.entryId,task_id:e.taskId,task_name:e.taskName,checklist:t?p?t.checklist:[]:e.checklist??[],adaptive_enabled:!!e.adaptiveEnabled,required_completion_fields:t?t.requiredFields:s?.required_completion_fields||[],task_type:s?.type||"",reading_unit:s?.reading_unit||"",parts:i?[]:ut({consumes_parts:n},e.entryId,e.objects,e.lang),consumes_parts:i?[]:n,phase_label:t?V(s):"",require_tag_scan:!!s?.require_tag_scan,restock_default:i?c?.restock_quantity??1:null,restock_unit_cost:i?c?.cost??null:null,currency_symbol:e.currencySymbol??"",consumes_info:n.map(d=>pt(d,e.entryId,e.objects,e.lang)),checklist_prefill:s?.checklist_progress||{},via_tag_scan:!!e.viaTagScan}}function vt(e,s,t){e.entryId=s.entry_id,e.taskId=s.task_id,e.taskName=s.task_name,e.lang=t,e.checklist=s.checklist??[],e.adaptiveEnabled=!!s.adaptive_enabled,e.requiredFields=s.required_completion_fields??[],e.taskType=s.task_type??"",e.readingUnit=s.reading_unit??"",e.parts=s.parts??[],e.consumesParts=s.consumes_parts??[],e.phaseLabel=s.phase_label??"",e.requireTagScan=!!s.require_tag_scan,e.restockDefault=s.restock_default??null,e.restockUnitCost=s.restock_unit_cost??null,e.currencySymbol=s.currency_symbol??"",e.consumesInfo=s.consumes_info??[],e.checklistPrefill=s.checklist_prefill??{},e.viaTagScan=!!s.via_tag_scan,e.open({viaTagScan:!!s.via_tag_scan})}function y(e){return e.toFixed(1)}function Ae(e,s,t=4){if(!isFinite(e)||!isFinite(s))return{ticks:[],niceMin:0,niceMax:1};if(e===s){let l=Math.abs(e)*.1||1;e-=l,s+=l}let n=s-e,i=Math.pow(10,Math.floor(Math.log10(n/Math.max(1,t)))),r=i;for(let l of[1,2,5,10])if(r=i*l,n/r<=t+.5)break;let c=Math.floor(e/r)*r,p=Math.ceil(s/r)*r,d=[];for(let l=c;l<=p+r*1e-6;l+=r)d.push(Math.abs(l)<r*1e-9?0:l);return{ticks:d,niceMin:c,niceMax:p}}function Ie(e,s){let t=Math.abs(e),n=i=>({maximumFractionDigits:i});return t>=1e6?x(e/1e6,s,n(t>=1e7?0:1))+"M":t>=1e4?x(e/1e3,s,n(0))+"k":t>=1e3?x(e/1e3,s,n(1))+"k":t>=100?x(e,s,n(0)):t>=1?x(e,s,n(1)):t===0?"0":x(e,s,n(2))}function Le(e,s,t){let n=x(e,t,{maximumFractionDigits:Math.abs(e)>=100?0:1});return s?`${n} ${s}`:n}function De(e,s,t){return Z(new Date(e),s,t)}function Me(e,s){let t=new Date(e);return`${Z(t,s)}, ${it(t,s)}`}function Te(e,s){return new Date(e).getFullYear()!==new Date(s).getFullYear()}function Pe(e,s,t){if(t<2||s<=e)return[e,s];let n=[];for(let i=0;i<t;i++)n.push(e+(s-e)*i/(t-1));return n}function bt(e,s){let t=e.interval_analysis,n=t?.weibull_beta,i=t?.weibull_eta;if(n==null||i==null||i<=0)return u;let r=e.interval_days??0,c=e.suggested_interval??r;return o`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${a("weibull_reliability_curve",s)}
        ${Ft(n,s)}
      </div>
      ${Wt(n,i,r,c,s)}
      ${Ut(t,s)}
      ${t?.confidence_interval_low!=null?Bt(t,e,s):u}
    </div>
  `}function Ft(e,s){let t,n,i;return e<.8?(t="early_failures",n="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):e<=1.2?(t="random_failures",n="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):e<=3.5?(t="wear_out",n="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(t="highly_predictable",n="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),o`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${n}"></ha-svg-icon>
      ${a(i,s)} (\u03B2=${x(e,s,2)})
    </span>
  `}function Wt(e,s,t,n,i){let g=Math.max(t,n,s,1)*1.3,$=50,b=[];for(let A=0;A<=$;A++){let I=A/$*g,Et=1-Math.exp(-Math.pow(I/s,e)),Ct=32+I/g*260,St=136-Et*128;b.push([Ct,St])}let M=b.map(([A,I])=>`${y(A)},${y(I)}`).join(" "),z="M32,136 "+b.map(([A,I])=>`L${y(A)},${y(I)}`).join(" ")+` L${y(b[$][0])},136 Z`,T=32+t/g*260,F=1-Math.exp(-Math.pow(t/s,e)),W=136-F*128,Tt=x((1-F)*100,i,0),tt=32+n/g*260,Pt=[0,.25,.5,.75,1];return o`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${a("chart_weibull",i)}">
        ${Pt.map(A=>{let I=136-A*128;return R`
            <line x1="${32}" y1="${y(I)}" x2="${292}" y2="${y(I)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${A===.5?"4,3":u}" />
            <text x="${28}" y="${y(I+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${x(A*100,i,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(g/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(g)}</text>

        <path d="${z}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${M}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?R`
          <line x1="${y(T)}" y1="${8}" x2="${y(T)}" y2="${y(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${y(T)}" cy="${y(W)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${y(T+4)}" y="${y(W-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${Tt}%</text>
        `:u}

        ${n>0&&n!==t?R`
          <line x1="${y(tt)}" y1="${8}" x2="${y(tt)}" y2="${y(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:u}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${a("weibull_failure_probability",i)}</span>
      ${t>0?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${a("current_interval_marker",i)}</span>`:u}
      ${n>0&&n!==t?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${a("recommended_marker",i)}</span>`:u}
    </div>
  `}function Ut(e,s){return o`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${a("characteristic_life",s)}</span>
        <span class="weibull-info-value">${Math.round(e.weibull_eta)} ${a("days",s)}</span>
      </div>
      ${e.weibull_r_squared!=null?o`
        <div class="weibull-info-item">
          <span>${a("weibull_r_squared",s)}</span>
          <span class="weibull-info-value">${x(e.weibull_r_squared,s,3)}</span>
        </div>
      `:u}
    </div>
  `}function Bt(e,s,t){let n=e.confidence_interval_low,i=e.confidence_interval_high,r=s.suggested_interval??s.interval_days??0,c=s.interval_days??0,p=Math.max(0,n-5),l=i+5-p,_=(n-p)/l*100,f=(i-n)/l*100,v=(r-p)/l*100,g=c>0?(c-p)/l*100:-1;return o`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${a("confidence_interval",t)}: ${r} ${a("days",t)} (${n}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${y(_)}%;width:${y(f)}%"></div>
        ${g>=0?o`<div class="confidence-marker current" style="left:${y(g)}%"></div>`:u}
        <div class="confidence-marker recommended" style="left:${y(v)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${a("confidence_conservative",t)} (${n}${a("days",t).charAt(0)})</span>
        <span class="confidence-text high">${a("confidence_aggressive",t)} (${i}${a("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function xt(e,s,t){let n=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data",i=e.days_until_threshold!=null,r=e.environmental_factor!=null&&e.environmental_factor!==1;if(!n&&!i&&!r)return u;let c=e.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":e.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return o`
    <div class="prediction-section">
      ${e.sensor_prediction_urgency?o`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${a("sensor_prediction_urgency",s).replace("{days}",String(Math.round(e.days_until_threshold||0)))}
        </div>
      `:u}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${a("sensor_prediction",s)}
      </div>
      <div class="prediction-grid">
        ${n?o`
          <div class="prediction-item">
            <ha-svg-icon path="${c}"></ha-svg-icon>
            <span class="prediction-label">${a("degradation_trend",s)}</span>
            <span class="prediction-value ${e.degradation_trend}">${a("trend_"+e.degradation_trend,s)}</span>
            ${e.degradation_rate!=null?o`<span class="prediction-rate">${e.degradation_rate>0?"+":""}${x(e.degradation_rate,s,Math.abs(e.degradation_rate)>=10?0:1)} ${e.trigger_entity_info?.unit_of_measurement||""}/${a("day_short",s)}</span>`:u}
          </div>
        `:u}
        ${i?o`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${a("days_until_threshold",s)}</span>
            <span class="prediction-value prediction-days${e.days_until_threshold===0?" exceeded":e.sensor_prediction_urgency?" urgent":""}">${e.days_until_threshold===0?a("threshold_exceeded",s):"~"+Math.round(e.days_until_threshold)+" "+a("days",s)}</span>
            ${e.threshold_prediction_date?o`<span class="prediction-date">${q(e.threshold_prediction_date,s)}</span>`:u}
            ${e.threshold_prediction_confidence?o`<span class="confidence-dot ${e.threshold_prediction_confidence}"></span>`:u}
            ${(e.prediction_cycles??0)>0?o`<span class="prediction-cycles">${a("prediction_cycles",s)}: ${e.prediction_cycles}</span>`:u}
          </div>
        `:u}
        ${r&&t.environmental?o`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${a("environmental_adjustment",s)}</span>
            <span class="prediction-value">${x(e.environmental_factor,s,2)}x</span>
            ${e.environmental_entity?o`<span class="prediction-entity entity-link" @click=${p=>lt(p,e.environmental_entity)}>${e.environmental_entity}</span>`:u}
          </div>
        `:u}
      </div>
    </div>
  `}function kt(e,s,t,n){let i=Math.max(e||1,s);return o`
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
  `}var $t=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function wt(e,s,t){if(!t.seasonal||!e.seasonal_factor||e.seasonal_factor===1)return u;let n=$t.map(p=>a(p,s)),i=new Date().getMonth(),r=e.seasonal_factors||e.interval_analysis?.seasonal_factors||null,c=r&&r.length===12?r:n.map((p,d)=>{let l=e.seasonal_factor||1,_=Math.sin((d-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,l+_))});return o`
    <div class="seasonal-card-compact">
      <h4>${a("seasonal_awareness",s)}</h4>
      <div class="seasonal-mini-chart">
        ${c.map((p,d)=>{let l=p*40,_=p<.9?"low":p>1.1?"high":"normal";return o`
            <div class="seasonal-bar ${_} ${d===i?"current":""}"
                 style="height: ${l}px"
                 title="${n[d]}: ${x(p,s,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${a("shorter",s)||"K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${a("normal",s)||"Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${a("longer",s)||"L\xE4nger"}</span>
      </div>
    </div>
  `}function At(e,s){return Kt(e,s)}function Kt(e,s){let t=e.seasonal_factors??e.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return u;let n=e.interval_analysis?.seasonal_reason,i=new Date().getMonth(),r=300,c=100,p=8,l=c-p-4,_=Math.max(...t,1.5),f=r/12,v=f*.65,g=p+l-1/_*l;return o`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${a("seasonal_chart_title",s)}
        ${n?o`<span class="source-tag">${n==="learned"?a("seasonal_learned",s):a("seasonal_manual",s)}</span>`:u}
      </div>
      <svg viewBox="0 0 ${r} ${c}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${a("chart_seasonal",s)}">
        <line x1="0" y1="${y(g)}" x2="${r}" y2="${y(g)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map(($,b)=>{let M=$/_*l,z=b*f+(f-v)/2,T=p+l-M,F=b===i,W=$<1?"var(--success-color, #4caf50)":$>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return R`
            <rect x="${y(z)}" y="${y(T)}"
              width="${y(v)}" height="${y(M)}"
              fill="${W}" opacity="${F?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${$t.map(($,b)=>o`<span class="seasonal-label ${b===i?"active-month":""}">${a($,s)}</span>`)}
      </div>
    </div>
  `}var k=class extends j{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._featuresLoaded=!1;this._currencySymbol=""}get _lang(){return H(this.hass)}async openFor(t,n){this._entryId=t,this._taskId=n,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=N(new Date),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){if(!this._featuresLoaded)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});t?.features&&(this._features={...this._features,...t.features}),this._currencySymbol=t?.budget?.currency_symbol||"",this._featuresLoaded=!0}catch{}}close(){this._open=!1,this._task=null,this._error=""}async _loadTask(){if(!(!this._entryId||!this._taskId))try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._objectName=t.object?.name||"";let n=(t.tasks||[]).find(i=>i.id===this._taskId);this._task=n??null}catch(t){this._error=L(t,this._lang)}}async _runWs(t){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(t),this._busy=!1,!0}catch(n){return this._error=L(n,this._lang),this._busy=!1,!1}}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-SFIRVV34.js").then(async({openCompleteDialog:t})=>{let n=this._task,i=[];try{i=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}t(yt({entryId:this._entryId,taskId:this._taskId,taskName:n.name,task:n,objects:i,lang:this._lang,checklist:n.checklist||[],adaptiveEnabled:!!n.adaptive_config?.enabled,currencySymbol:this._currencySymbol}))&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-SFIRVV34.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-SFIRVV34.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let t=a("delete_task_confirm",this._lang)||`Delete "${this._task?.name}"?`;if(!window.confirm(t))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})&&(this._toast=a("suggestion_applied",this._lang)||"Applied",this._notifyChanged("apply_suggestion"),await this._loadTask(),setTimeout(()=>{this._toast=""},2500))}async _reanalyzeInterval(){if(!(!this._entryId||!this._taskId)){this._busy=!0,this._error="";try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});this._toast=t.recommended_interval?`${a("reanalyze_result",this._lang)||"Recomputed"}: ${rt(t.recommended_interval,"days",this._lang)} (${t.data_points} pts)`:a("reanalyze_insufficient_data",this._lang)||"Not enough data",await this._loadTask(),setTimeout(()=>{this._toast=""},3500)}catch(t){this._error=L(t,this._lang)}finally{this._busy=!1}}}_onEditHistoryEntry(t){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-SFIRVV34.js").then(({openHistoryEditDialog:n})=>{n({entry_id:this._entryId,task_id:this._taskId,original_timestamp:t.timestamp,type:t.type,timestamp:t.timestamp,notes:t.notes??null,cost:t.cost??null,duration:t.duration??null,completed_by:t.completed_by??null,used_parts:t.used_parts??null,photo_doc_ids:ht(t)})})}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return u;let n=this._lang;return o`
      <div class="recommendation-card">
        <h4>${a("suggested_interval",n)}</h4>
        ${kt(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",n)}
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
    `}_renderAdaptive(t){let n=this._lang,i=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,r=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,c=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,p=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!i&&!r&&!c&&!p?o`<div class="adaptive-empty">
        ${a("adaptive_no_data",n)||"Not enough completion history yet for adaptive analysis."}
      </div>`:o`
      <div class="adaptive-stack">
        ${this._toast?o`<div class="toast">${this._toast}</div>`:u}
        ${i?this._renderRecommendation(t):u}
        ${r?xt(t,n,this._features):u}
        ${c?bt(t,n):u}
        ${p?o`
          ${wt(t,n,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?At(t,n):u}
        `:u}
      </div>
    `}_renderDetails(t){let n=this._lang,i=t.history||[],r=i.filter(d=>d.type==="completed"),c=r.reduce((d,l)=>d+(typeof l.cost=="number"?l.cost:0),0),p=(()=>{let d=r.map(l=>typeof l.duration=="number"?l.duration:null).filter(l=>l!=null);return d.length?Math.round(d.reduce((l,_)=>l+_,0)/d.length):null})();return o`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${a("times_performed",n)||"Performed"}</span>
            <span class="stat-value">${r.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${a("total_cost",n)||"Total cost"}</span>
            <span class="stat-value">${x(c,n,2)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${a("avg_duration",n)||"Avg duration"}</span>
            <span class="stat-value">${p!=null?`${p}m`:"\u2014"}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${a("history",n)||"History"}</strong>
          <span class="history-count">${i.length}</span>
        </div>
        ${i.length===0?o`<div class="history-empty">${a("history_empty",n)||"No history yet."}</div>`:o`
              <div class="history-list">
                ${[...i].reverse().slice(0,20).map(d=>{let l=["completed","reset","skipped"].includes(d.type);return o`
                    <div class="history-entry">
                      <div class="history-line">
                        <span class="history-type type-${d.type}">${a(d.type,n)}</span>
                        <span class="history-date">${at(d.timestamp,n)}</span>
                        ${l?o`<button class="history-edit"
                                   title="${a("history_edit_button",n)||"Edit"}"
                                   @click=${()=>this._onEditHistoryEntry(d)}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                            </button>`:u}
                      </div>
                      ${d.notes?o`<div class="history-notes">${d.notes}</div>`:u}
                      ${d.cost!=null||d.duration!=null?o`<div class="history-meta">
                            ${d.cost!=null?o`<span>💰 ${x(d.cost,n,2)}</span>`:u}
                            ${d.duration!=null?o`<span>⏱️ ${d.duration}m</span>`:u}
                          </div>`:u}
                    </div>
                  `})}
                ${i.length>20?o`<div class="history-more">… +${i.length-20} ${a("older_entries",n)||"older"}</div>`:u}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return u;let t=this._lang,n=this._task,i=this.hass?.user?.is_admin??!0;return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${n?o`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${U[n.status]||"#ccc"}"></span>
                  <span class="task-name">${n.name}</span>
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-SFIRVV34.js").then(({openObjectQuickActions:r})=>{r(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${n.next_due?o`<span><strong>${a("next_due",t)||"Next due"}:</strong> ${q(n.next_due,t)}</span>`:u}
                  ${n.last_performed?o`<span><strong>${a("last_performed",t)||"Last"}:</strong> ${q(n.last_performed,t)}</span>`:u}
                  ${n.schedule?.kind&&!["manual","one_time"].includes(n.schedule.kind)||n.interval_days!=null?o`<span><strong>${a("interval",t)||"Interval"}:</strong> ${ot(n,t)}</span>`:u}
                  ${V(n)?o`<span><strong>${a("phase_current",t)}:</strong> ${V(n)}</span>`:u}
                </div>
              </div>

              ${this._error?o`<div class="error">${this._error}</div>`:u}

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
                      <ms-date-field
                        kind="date"
                        .hass=${this.hass}
                        .lang=${t}
                        .value=${this._resetDate}
                        @value-changed=${r=>{this._resetDate=r.detail.value}}
                      ></ms-date-field>
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
                      <ha-button appearance="accent" variant="success" @click=${this._onComplete} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${a("complete",t)||"Complete"}
                      </ha-button>
                      ${n.allow_skip!==!1?o`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${a("skip",t)||"Skip"}
                            </ha-button>
                          `:u}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${a("reset",t)||"Reset"}
                      </ha-button>
                    </div>
                    ${i?o`
                          <div class="actions secondary-row">
                            <ha-button size="small" appearance="outlined" variant="neutral" @click=${this._onEdit} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                              ${a("edit",t)||"Edit"}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="neutral" @click=${this._onQr} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                              ${a("qr_code",t)||"QR"}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="neutral"
                              @click=${n.archived?this._onUnarchive:this._onArchive}
                              .disabled=${this._busy}>
                              <ha-icon slot="start" icon="${n.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                              ${n.archived?a("unarchive",t)||"Unarchive":a("archive",t)||"Archive"}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="danger" class="danger" @click=${this._onDelete} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                              ${a("delete",t)||"Delete"}
                            </ha-button>
                          </div>
                        `:u}
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?a("hide_details",t)||"Hide details":a("show_details",t)||"Show history + stats"}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?o`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?a("hide_stats",t)||"Hide stats":a("show_stats",t)||"Show stats + graphs"}
                          </button>`:u}
                    </div>
                    ${this._showDetails?this._renderDetails(n):u}
                    ${this._showAdaptive?this._renderAdaptive(n):u}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${a("open_in_panel",t)||"Open in Maintenance panel"}
                      </button>
                    </div>
                  `}
            `:o`<div class="loading">${a("loading",t)||"Loading\u2026"}</div>`}
      </div>
    `}};k.styles=[ct,S`
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
    .actions.primary-row ha-button { flex: 1; }
    /* Edit + QR are admin-tools — left-align as a group; Delete is destructive
       so it gets pushed to the far right with margin-left:auto for visual
       separation. Earlier this row was flex-end which left a strange empty
       gap on the left (user feedback). */
    .actions.secondary-row {
      padding-top: 8px; border-top: 1px solid var(--divider-color);
      justify-content: flex-start;
    }
    .actions.secondary-row .btn.danger,
    .actions.secondary-row ha-button.danger {
      margin-left: auto;
    }
    .actions.secondary-row ha-button { --ha-button-font-size: 13px; }
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
  `],h([P({attribute:!1})],k.prototype,"hass",2),h([m()],k.prototype,"_open",2),h([m()],k.prototype,"_entryId",2),h([m()],k.prototype,"_taskId",2),h([m()],k.prototype,"_task",2),h([m()],k.prototype,"_objectName",2),h([m()],k.prototype,"_busy",2),h([m()],k.prototype,"_error",2),h([m()],k.prototype,"_showSkip",2),h([m()],k.prototype,"_showReset",2),h([m()],k.prototype,"_showDetails",2),h([m()],k.prototype,"_showAdaptive",2),h([m()],k.prototype,"_skipReason",2),h([m()],k.prototype,"_resetDate",2),h([m()],k.prototype,"_features",2),h([m()],k.prototype,"_toast",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",k);function It(e){return!!e&&/^https?:\/\//i.test(e)}function Lt(e){return e?customElements.get("ha-markdown")?o`<ha-markdown class="notes-md" .content=${e} breaks></ha-markdown>`:o`${e}`:u}var D=class extends j{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error=""}get _lang(){return H(this.hass)}async openFor(t){this._entryId=t,this._error="",this._open=!0,await this._load()}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._data=t}catch(t){this._error=L(t,this._lang)}}_onEditObject(){!this._entryId||!this._data||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-SFIRVV34.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-SFIRVV34.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data)return;let t=a("delete_object_confirm",this._lang)||`Delete "${this._data.object.name}" and all its tasks?`;if(window.confirm(t)){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(n){this._error=L(n,this._lang)}finally{this._busy=!1}}}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t){let n=a("confirm_archive_object",this._lang)||"Archive this object and its tasks?";if(!window.confirm(n))return}this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(n){this._error=L(n,this._lang)}finally{this._busy=!1}}_onTaskClick(t){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-SFIRVV34.js").then(({openTaskQuickActions:n})=>{n(this._entryId,t)})}render(){if(!this._open)return u;let t=this._lang,n=this._data,i=n?.object,r=n?.tasks||[],c=this.hass?.user?.is_admin??!0;return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${n&&i?o`
              <div class="header">
                <div class="title">${i.name}</div>
                ${this._renderMetaRow(i)}
              </div>

              ${this._error?o`<div class="error">${this._error}</div>`:u}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${a("tasks",t)||"Tasks"}</strong>
                  <span class="count">${r.length}</span>
                </div>
                ${r.length===0?o`<div class="empty">${a("no_tasks",t)||"No tasks yet."}</div>`:o`
                      <div class="task-list">
                        ${r.map(p=>o`
                          <div class="task-row" @click=${()=>this._onTaskClick(p.id)}>
                            <span class="status-dot" style="background: ${U[p.status]||"#ccc"}"></span>
                            <span class="task-name">${p.name}</span>
                            <span class="task-status">${a(p.status||"ok",t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${i.notes?o`
                    <div class="notes-section">
                      <strong>${a("object_notes_label",t)}</strong>
                      <div class="notes-body">${Lt(i.notes)}</div>
                    </div>
                  `:u}

              ${c?o`
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
                  `:u}
            `:o`<div class="loading">${a("loading",t)||"Loading\u2026"}</div>`}
      </div>
    `}_renderMetaRow(t){let n=this._lang,i=[];return t.area_id&&i.push([a("area",n),t.area_id]),t.manufacturer&&i.push([a("manufacturer",n),t.manufacturer]),t.model&&i.push([a("model",n),t.model]),t.serial_number&&i.push([a("serial_number_label",n),t.serial_number]),t.installation_date&&i.push([a("installed",n),t.installation_date]),t.warranty_expiry&&i.push([a("warranty",n),t.warranty_expiry]),t.documentation_url&&i.push([a("documentation_url_label",n),t.documentation_url]),i.length===0?u:o`
      <div class="meta">
        ${i.map(([r,c])=>o`
            <div class="meta-item">
              <span class="meta-label">${r}</span>
              <span class="meta-value">${It(c)?o`<a href="${c}" target="_blank" rel="noopener noreferrer">${c}</a>`:c}</span>
            </div>
          `)}
      </div>
    `}};D.styles=S`
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
  `,h([P({attribute:!1})],D.prototype,"hass",2),h([m()],D.prototype,"_open",2),h([m()],D.prototype,"_entryId",2),h([m()],D.prototype,"_data",2),h([m()],D.prototype,"_busy",2),h([m()],D.prototype,"_error",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",D);var Dt="maintenance-object-dialog",Mt="maintenance-task-dialog",Gt="maintenance-history-edit-dialog",Yt="maintenance-complete-dialog",Zt="maintenance-qr-dialog",Jt="maintenance-task-quick-actions-dialog",Qt="maintenance-object-quick-actions-dialog";function Y(){return document.querySelector("home-assistant")?.hass}function Xt(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function E(e){let s=Xt(),t=s.querySelector(e)??document.body.querySelector(e);return t?t.parentNode!==s&&s.appendChild(t):(t=document.createElement(e),s.appendChild(t)),t}function C(e){let s=Y();if(!s)return!1;e.hass=s;let t=H(s);return et(t)||nt(t).then(()=>{e.requestUpdate?.()}),st(s.locale,s.config?.country),!0}function Tn(e){return B(e).then(s=>s.rowActionStyle)}function Pn(){mt()}function En(){let e=E(Dt);return C(e)?(e.openCreate(),!0):!1}function Cn(e,s){let t=E(Dt);return C(t)?(t.openEdit(e,s),!0):!1}function Sn(e="",s){let t=E(Mt);if(!C(t))return!1;let n=Y();return n?((async()=>{let i=await B(n),r=t;r.checklistsEnabled=i.features.checklists,r.scheduleTimeEnabled=i.features.schedule_time,r.completionActionsEnabled=i.features.completion_actions,r.defaultWarningDays=i.defaultWarningDays,r.openCreate(e,s)})(),!0):!1}function jn(e,s){let t=E(Mt);if(!C(t))return!1;let n=Y();return n?((async()=>{try{let[i,r]=await Promise.all([n.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e}),B(n)]),c=(i.tasks||[]).find(d=>d.id===s);if(!c){console.warn(`openEditTaskDialog: task ${s} not found in entry ${e}`);return}let p=t;p.checklistsEnabled=r.features.checklists,p.scheduleTimeEnabled=r.features.schedule_time,p.completionActionsEnabled=r.features.completion_actions,p.defaultWarningDays=r.defaultWarningDays,await p.openEdit(e,c)}catch(i){console.warn("openEditTaskDialog: failed to load task/features",i)}})(),!0):!1}function Hn(e){let s=E(Gt);return C(s)?(s.openEdit(e),!0):!1}function On(e){let s=E(Yt);return C(s)?(vt(s,e,Y()?.language||"en"),!0):!1}function zn(e){let s=E(Zt);return C(s)?(s.openForTask(e.entry_id,e.task_id,e.object_name,e.task_name),!0):!1}function Rn(e,s){let t=E(Jt);return C(t)?(t.openFor(e,s),!0):!1}function qn(e){let s=E(Qt);return C(s)?(s.openFor(e),!0):!1}export{It as a,_e as b,Lt as c,Nt as d,Vt as e,X as f,yt as g,vt as h,y as i,Ae as j,Ie as k,Le as l,De as m,Me as n,Te as o,Pe as p,N as q,ge as r,ye as s,bt as t,xt as u,kt as v,wt as w,At as x,Tn as y,Pn as z,En as A,Cn as B,Sn as C,jn as D,Hn as E,On as F,zn as G,Rn as H,qn as I};
