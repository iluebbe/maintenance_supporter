/*! maintenance_supporter frontend 2.83.0 */
import{b as ct,g as ft,j as B,k as yt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-2CPDYZJA.js";import{b as J,d as mt,e as gt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-JBIZNRCU.js";import{b as pt,c as ht,e as Y,f as ut,h as _t}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-RZWHKIBD.js";import{a as $}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-3KSZKTVA.js";import{A as z,B as at,D as rt,I as K,J as ot,K as lt,N as dt,a as u,b as E,c as o,d as O,f as d,h as S,l as I,m as _,n as W,p as j,q as a,s as M,t as tt,u as et,v as it,w as st,x as f,y as Z,z as nt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-K3GKVVUU.js";var H=class extends S{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await ct(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?d:this._url?o`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:o`<div class="ph"></div>`}};H.styles=E`
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
  `,u([I({attribute:!1})],H.prototype,"hass",2),u([I()],H.prototype,"docId",2),u([_()],H.prototype,"_url",2),u([_()],H.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",H);var v=class extends S{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._photos=new gt(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return M(this.hass)}openEdit(t){this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(t.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(t),this._loadPartOptions()}_seedReadings(t){let i=[],n=new Set;for(let l of t.readings??[])n.has(l.id)||(n.add(l.id),i.push({id:l.id,name:l.name,unit:l.unit??null}));for(let l of t.reading_values??[])n.has(l.id)||(n.add(l.id),i.push({id:l.id,name:l.name,unit:l.unit??null}));this._readingRows=i;let r={};for(let l of t.reading_values??[])r[l.id]=String(l.value);this._readingText=r,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let t={};for(let i of this._readingRows){let n=(this._readingText[i.id]??"").trim();if(n==="")continue;let r=parseFloat(n.replace(",","."));isNaN(r)||(t[i.id]=r)}return t}async _loadPartOptions(){let t=this._draft;if(t)try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"}),n=[];for(let l of i.parts||[]){let c=l.entry_id===t.entry_id,p=l.consumers.some(h=>h.entry_id===t.entry_id&&h.task_id===t.task_id);!c&&!p||n.push({part_id:l.part_id,name:l.name,entry_id:l.entry_id,foreign:!c,object_name:l.object_name})}for(let l of t.used_parts||[]){let c=l.entry_id||t.entry_id;n.some(p=>p.part_id===l.part_id&&p.entry_id===c)||n.push({part_id:l.part_id,name:l.name||l.part_id,entry_id:c,foreign:c!==t.entry_id,object_name:null})}let r={};for(let l of t.used_parts||[])r[`${l.entry_id||t.entry_id}:${l.part_id}`]=l.quantity??1;this._partOptions=n,this._partQty=r,this._partQtyOriginal=this._partSelectionKey()}catch{this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,t])=>t>0).sort(([t],[i])=>t.localeCompare(i)))}close(){this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(t,i){this._draft&&(this._draft={...this._draft,[t]:i})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let t=this._lang;if(window.confirm(a("history_delete_confirm",t))){this._saving=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/history/delete",entry_id:this._draft.entry_id,task_id:this._draft.task_id,timestamp:this._originalSnapshot.original_timestamp}),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close()}catch(i){this._error=$(i,t)}finally{this._saving=!1}}}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="",this._photos.clearError();try{let t={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(t.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(t.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(t.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(t.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(t.completed_by=this._draft.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(t.used_parts=(this._partOptions||[]).filter(n=>(this._partQty[`${n.entry_id}:${n.part_id}`]||0)>0).map(n=>({part_id:n.part_id,quantity:this._partQty[`${n.entry_id}:${n.part_id}`],...n.foreign?{entry_id:n.entry_id}:{}}))),this._draft.reading_value!==this._originalSnapshot.reading_value&&(t.reading_value=this._draft.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let n=this._readingNumbers(),r={};for(let l of this._readingRows)r[l.id]=n[l.id]??null;t.reading_values=r}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(t.photo_doc_ids=this._photos.ids),Object.keys(t).filter(n=>!["type","entry_id","task_id","original_timestamp"].includes(n)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(t),this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=$(t,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return d;let t=this._lang,i=this._draft,n=this._error||this._photos.errorText(t);return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${a("history_edit_title",t)}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${a(i.type,t)||i.type}</span>
        </div>
        <ms-date-field
          kind="datetime"
          required
          .hass=${this.hass}
          .lang=${t}
          .label=${a("history_edit_timestamp",t)}
          .value=${i.timestamp.slice(0,19)}
          @value-changed=${r=>{let l=r.detail.value;l&&this._set("timestamp",l)}}
        ></ms-date-field>
        <label>
          <span>${a("notes_label",t)}</span>
          <textarea
            rows="3"
            @input=${r=>{let l=r.target.value;this._set("notes",l||null)}}
            .value=${i.notes??""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${a("cost",t)}</span>
            <input type="number" min="0" step="0.01"
              .value=${i.cost!=null?String(i.cost):""}
              @input=${r=>{let l=r.target.value;this._set("cost",l?Number(l):null)}} />
          </label>
          <label>
            <span>${a("duration",t)}</span>
            <input type="number" min="0"
              .value=${i.duration!=null?String(i.duration):""}
              @input=${r=>{let l=r.target.value;this._set("duration",l?Number(l):null)}} />
          </label>
        </div>
        ${this._renderReadings(i,t)}
        ${this._partOptions&&this._partOptions.length>0?o`
          <div class="parts-block">
            <span class="parts-title">${a("complete_parts_used",t)}</span>
            ${this._partOptions.map(r=>{let l=`${r.entry_id}:${r.part_id}`,c=this._partQty[l]||0;return o`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${c>0}
                    @change=${p=>{let h=p.target.checked;this._partQty={...this._partQty,[l]:h?1:0}}} />
                  <span class="part-label">${r.name}${r.foreign&&r.object_name?` (${r.object_name})`:""}</span>
                  ${c>0?o`
                    <input class="part-qty" type="number" min="0.01" max="999" step="0.01"
                      .value=${String(c)}
                      @input=${p=>{let h=parseFloat(p.target.value);!isNaN(h)&&h>0&&(this._partQty={...this._partQty,[l]:h})}} />
                  `:d}
                </label>
              `})}
          </div>
        `:d}
        <div class="photos-block">
          <span class="parts-title">${a("completion_photos",t)}</span>
          ${this._photos.photos.length>0?o`
            <div class="photo-strip">
              ${this._photos.photos.map(r=>o`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${r.id}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${a("remove",t)}
                    @click=${()=>this._photos.remove(r.id)}>✕</button>
                </div>`)}
            </div>`:d}
          ${this._photos.full?o`<span class="photos-hint">${a("photos_limit",t).replace("{max}",String(this._photos.max))}</span>`:o`<ms-photo-picker .lang=${t} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${r=>this._photos.addFiles(r.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${a("history_edit_photos_hint",t)}</span>
        </div>
        ${n?o`<div class="error">${n}</div>`:d}
        <div class="actions">
          <button class="delete-entry" @click=${this._delete} ?disabled=${this._saving} title=${a("history_delete_entry",t)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon> ${a("history_delete_entry",t)}
          </button>
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${a("cancel",t)}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?a("saving",t):a("save",t)}
          </button>
        </div>
      </div>
    `}_renderReadings(t,i){return this._readingRows.length>0?o`
        <div class="readings-block">
          <span class="parts-title">${a("readings_section",i)}</span>
          ${this._readingRows.map(n=>o`
            <label class="reading-row-edit">
              <span class="reading-row-name">${n.name}${n.unit?` (${n.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[n.id]??""}
                @input=${r=>{this._readingText={...this._readingText,[n.id]:r.target.value}}} />
            </label>
          `)}
        </div>`:t.reading_value==null&&t.task_type!=="reading"?d:o`
      <label>
        <span>${a("reading_value_label",i)}${t.reading_unit?` (${t.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${t.reading_value!=null?String(t.reading_value):""}
          @input=${n=>{let r=n.target.value,l=r===""?NaN:Number(r);this._set("reading_value",isNaN(l)?null:l)}} />
      </label>`}};v.styles=[mt,E`
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
    .delete-entry { margin-right: auto; color: var(--error-color, #d32f2f); background: transparent; border: 1px solid var(--error-color, #d32f2f); border-radius: 6px; padding: 6px 10px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
    .delete-entry ha-icon { --mdc-icon-size: 18px; }
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
    /* #161 phase 2: readings on the entry */
    .readings-block {
      display: flex; flex-direction: column; gap: 6px;
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px; padding: 8px;
    }
    .reading-row-edit {
      display: flex; flex-direction: row; align-items: center; gap: 8px;
      font-size: 14px;
    }
    .reading-row-name { flex: 1; color: var(--primary-text-color); min-width: 0; }
    .reading-row-input { width: 140px; font-variant-numeric: tabular-nums; }
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
    /* the camera / gallery pickers come from photoPickerStyles (ms-photo-picker) */
    .photos-hint { font-size: 12px; color: var(--secondary-text-color); }
  `],u([I({attribute:!1})],v.prototype,"hass",2),u([_()],v.prototype,"_open",2),u([_()],v.prototype,"_saving",2),u([_()],v.prototype,"_error",2),u([_()],v.prototype,"_draft",2),u([_()],v.prototype,"_partOptions",2),u([_()],v.prototype,"_partQty",2),u([_()],v.prototype,"_readingRows",2),u([_()],v.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",v);function Ot(e,s){if(s<=0)return 0;let t=typeof e=="number"&&Number.isFinite(e)?Math.trunc(e):0;return t<0?0:t%s}function Rt(e){return!!(e?.phases&&e.phase_sequence&&e.phase_sequence.length>0)}function Q(e){if(!e||!Rt(e))return null;let s=e.phase_sequence,t=Ot(e.phase_cursor,s.length),i=s[t],n=e.phases?.[i];return n?{id:i,name:n.name,index:t,count:s.length,notes:n.notes,checklist:n.checklist!==void 0?n.checklist:e.checklist??[],consumesParts:n.consumes_parts!==void 0?n.consumes_parts:e.consumes_parts??[],requiredFields:n.required_completion_fields!==void 0?n.required_completion_fields:e.required_completion_fields??[]}:null}function q(e){let s=Q(e);return s?`${s.index+1}/${s.count} \xB7 ${s.name}`:""}function vt(e){let s=e.task??null,t=s?Q(s):null,i=t?t.consumesParts:s?.consumes_parts||[],n=!!s?.part_ref,r=e.objects.find(p=>p.entry_id===e.entryId)?.parts||[],l=n?r.find(p=>p.id===s.part_ref.part_id):void 0,c=e.checklistsEnabled??!0;return{entry_id:e.entryId,task_id:e.taskId,task_name:e.taskName,checklist:t?c?t.checklist:[]:e.checklist??[],adaptive_enabled:!!e.adaptiveEnabled,required_completion_fields:t?t.requiredFields:s?.required_completion_fields||[],task_type:s?.type||"",reading_unit:s?.reading_unit||"",readings:s?.readings||[],reading_history:ut(s?.history),parts:n?[]:ht({consumes_parts:i},e.entryId,e.objects,e.lang),consumes_parts:n?[]:i,phase_label:t?q(s):"",require_tag_scan:!!s?.require_tag_scan,restock_default:n?l?.restock_quantity??1:null,restock_unit_cost:n?l?.cost??null:null,currency_symbol:j({currency_symbol:e.currencySymbol}),consumes_info:i.map(p=>pt(p,e.entryId,e.objects,e.lang)),checklist_prefill:s?.checklist_progress||{},via_tag_scan:!!e.viaTagScan}}function bt(e,s,t){e.entryId=s.entry_id,e.taskId=s.task_id,e.taskName=s.task_name,e.lang=t,e.checklist=s.checklist??[],e.adaptiveEnabled=!!s.adaptive_enabled,e.requiredFields=s.required_completion_fields??[],e.taskType=s.task_type??"",e.readingUnit=s.reading_unit??"",e.readings=s.readings??[],e.readingHistory=s.reading_history??[],e.parts=s.parts??[],e.consumesParts=s.consumes_parts??[],e.phaseLabel=s.phase_label??"",e.requireTagScan=!!s.require_tag_scan,e.restockDefault=s.restock_default??null,e.restockUnitCost=s.restock_unit_cost??null,e.currencySymbol=j(s),e.consumesInfo=s.consumes_info??[],e.checklistPrefill=s.checklist_prefill??{},e.viaTagScan=!!s.via_tag_scan,e.open({viaTagScan:!!s.via_tag_scan})}function m(e){return e.toFixed(1)}function ve(e,s,t=4){if(!isFinite(e)||!isFinite(s))return{ticks:[],niceMin:0,niceMax:1};if(e===s){let h=Math.abs(e)*.1||1;e-=h,s+=h}let i=s-e,n=Math.pow(10,Math.floor(Math.log10(i/Math.max(1,t)))),r=n;for(let h of[1,2,5,10])if(r=n*h,i/r<=t+.5)break;let l=Math.floor(e/r)*r,c=Math.ceil(s/r)*r,p=[];for(let h=l;h<=c+r*1e-6;h+=r)p.push(Math.abs(h)<r*1e-9?0:h);return{ticks:p,niceMin:l,niceMax:c}}function be(e,s){let t=Math.abs(e),i=n=>({maximumFractionDigits:n});return t>=1e6?f(e/1e6,s,i(t>=1e7?0:1))+"M":t>=1e4?f(e/1e3,s,i(0))+"k":t>=1e3?f(e/1e3,s,i(1))+"k":t>=100?f(e,s,i(0)):t>=1?f(e,s,i(1)):t===0?"0":f(e,s,i(2))}function xe(e,s,t){let i=f(e,t,{maximumFractionDigits:Math.abs(e)>=100?0:1});return s?`${i} ${s}`:i}function $e(e,s,t){return K(new Date(e),s,t)}function ke(e,s){let t=new Date(e);return`${K(t,s)}, ${nt(t,s)}`}function we(e,s){return new Date(e).getFullYear()!==new Date(s).getFullYear()}function Ae(e,s,t){if(t<2||s<=e)return[e,s];let i=[];for(let n=0;n<t;n++)i.push(e+(s-e)*n/(t-1));return i}function xt(e,s){let t=e.interval_analysis,i=t?.weibull_beta,n=t?.weibull_eta;if(i==null||n==null||n<=0)return d;let r=e.interval_days??0,l=e.suggested_interval??r;return o`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${a("weibull_reliability_curve",s)}
        ${jt(i,s)}
      </div>
      ${zt(i,n,r,l,s)}
      ${qt(t,s)}
      ${t?.confidence_interval_low!=null?Nt(t,e,s):d}
    </div>
  `}function jt(e,s){let t,i,n;return e<.8?(t="early_failures",i="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",n="beta_early_failures"):e<=1.2?(t="random_failures",i="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",n="beta_random_failures"):e<=3.5?(t="wear_out",i="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",n="beta_wear_out"):(t="highly_predictable",i="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",n="beta_highly_predictable"),o`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${i}"></ha-svg-icon>
      ${a(n,s)} (\u03B2=${f(e,s,2)})
    </span>
  `}function zt(e,s,t,i,n){let b=Math.max(t,i,s,1)*1.3,L=50,T=[];for(let x=0;x<=L;x++){let k=x/L*b,St=1-Math.exp(-Math.pow(k/s,e)),Ht=32+k/b*260,Ct=136-St*128;T.push([Ht,Ct])}let N=T.map(([x,k])=>`${m(x)},${m(k)}`).join(" "),G="M32,136 "+T.map(([x,k])=>`L${m(x)},${m(k)}`).join(" ")+` L${m(T[L][0])},136 Z`,C=32+t/b*260,F=1-Math.exp(-Math.pow(t/s,e)),V=136-F*128,Dt=f((1-F)*100,n,0),X=32+i/b*260,Et=[0,.25,.5,.75,1];return o`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${a("chart_weibull",n)}">
        ${Et.map(x=>{let k=136-x*128;return O`
            <line x1="${32}" y1="${m(k)}" x2="${292}" y2="${m(k)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${x===.5?"4,3":d}" />
            <text x="${28}" y="${m(k+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${f(x*100,n,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(b/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(b)}</text>

        <path d="${G}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${N}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?O`
          <line x1="${m(C)}" y1="${8}" x2="${m(C)}" y2="${m(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${m(C)}" cy="${m(V)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${m(C+4)}" y="${m(V-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${Dt}%</text>
        `:d}

        ${i>0&&i!==t?O`
          <line x1="${m(X)}" y1="${8}" x2="${m(X)}" y2="${m(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:d}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${a("weibull_failure_probability",n)}</span>
      ${t>0?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${a("current_interval_marker",n)}</span>`:d}
      ${i>0&&i!==t?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${a("recommended_marker",n)}</span>`:d}
    </div>
  `}function qt(e,s){return o`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${a("characteristic_life",s)}</span>
        <span class="weibull-info-value">${Math.round(e.weibull_eta)} ${a("days",s)}</span>
      </div>
      ${e.weibull_r_squared!=null?o`
        <div class="weibull-info-item">
          <span>${a("weibull_r_squared",s)}</span>
          <span class="weibull-info-value">${f(e.weibull_r_squared,s,3)}</span>
        </div>
      `:d}
    </div>
  `}function Nt(e,s,t){let i=e.confidence_interval_low,n=e.confidence_interval_high,r=s.suggested_interval??s.interval_days??0,l=s.interval_days??0,c=Math.max(0,i-5),h=n+5-c,y=(i-c)/h*100,A=(n-i)/h*100,R=(r-c)/h*100,b=l>0?(l-c)/h*100:-1;return o`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${a("confidence_interval",t)}: ${r} ${a("days",t)} (${i}\u2013${n})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${m(y)}%;width:${m(A)}%"></div>
        ${b>=0?o`<div class="confidence-marker current" style="left:${m(b)}%"></div>`:d}
        <div class="confidence-marker recommended" style="left:${m(R)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${a("confidence_conservative",t)} (${i}${a("days",t).charAt(0)})</span>
        <span class="confidence-text high">${a("confidence_aggressive",t)} (${n}${a("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function $t(e,s,t){let i=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data",n=e.days_until_threshold!=null,r=e.environmental_factor!=null&&e.environmental_factor!==1;if(!i&&!n&&!r)return d;let l=e.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":e.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return o`
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
        ${i?o`
          <div class="prediction-item">
            <ha-svg-icon path="${l}"></ha-svg-icon>
            <span class="prediction-label">${a("degradation_trend",s)}</span>
            <span class="prediction-value ${e.degradation_trend}">${a("trend_"+e.degradation_trend,s)}</span>
            ${e.degradation_rate!=null?o`<span class="prediction-rate">${e.degradation_rate>0?"+":""}${f(e.degradation_rate,s,Math.abs(e.degradation_rate)>=10?0:1)} ${e.trigger_entity_info?.unit_of_measurement||""}/${a("day_short",s)}</span>`:d}
          </div>
        `:d}
        ${n?o`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${a("days_until_threshold",s)}</span>
            <span class="prediction-value prediction-days${e.days_until_threshold===0?" exceeded":e.sensor_prediction_urgency?" urgent":""}">${e.days_until_threshold===0?a("threshold_exceeded",s):"~"+Math.round(e.days_until_threshold)+" "+a("days",s)}</span>
            ${e.threshold_prediction_date?o`<span class="prediction-date">${z(e.threshold_prediction_date,s)}</span>`:d}
            ${e.threshold_prediction_confidence?o`<span class="confidence-dot ${e.threshold_prediction_confidence}"></span>`:d}
            ${(e.prediction_cycles??0)>0?o`<span class="prediction-cycles">${a("prediction_cycles",s)}: ${e.prediction_cycles}</span>`:d}
          </div>
        `:d}
        ${r&&t.environmental?o`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${a("environmental_adjustment",s)}</span>
            <span class="prediction-value">${f(e.environmental_factor,s,2)}x</span>
            ${e.environmental_entity?o`<span class="prediction-entity entity-link" @click=${c=>lt(c,e.environmental_entity)}>${e.environmental_entity}</span>`:d}
          </div>
        `:d}
      </div>
    </div>
  `}function kt(e,s,t,i){let n=Math.max(e||1,s);return o`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${a("current",i)}: ${e??"\u2014"} ${e!=null?a("days",i):""}
        </div>
        <div class="interval-visual current"
          style="width: ${e!=null?Math.min(e/n*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${a("recommended",i)}: ${s} ${a("days",i)}
          <span class="confidence-badge ${t}">${a(`confidence_${t}`,i)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(s/n*100,100)}%"></div>
      </div>
    </div>
  `}var wt=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function At(e,s,t){if(!t.seasonal||!e.seasonal_factor||e.seasonal_factor===1)return d;let i=wt.map(c=>a(c,s)),n=new Date().getMonth(),r=e.seasonal_factors||e.interval_analysis?.seasonal_factors||null,l=r&&r.length===12?r:i.map((c,p)=>{let h=e.seasonal_factor||1,y=Math.sin((p-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,h+y))});return o`
    <div class="seasonal-card-compact">
      <h4>${a("seasonal_awareness",s)}</h4>
      <div class="seasonal-mini-chart">
        ${l.map((c,p)=>{let h=c*40,y=c<.9?"low":c>1.1?"high":"normal";return o`
            <div class="seasonal-bar ${y} ${p===n?"current":""}"
                 style="height: ${h}px"
                 title="${i[p]}: ${f(c,s,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${a("shorter",s)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${a("normal",s)}</span>
        <span class="legend-item"><span class="dot high"></span> ${a("longer",s)}</span>
      </div>
    </div>
  `}function Lt(e,s){return Ft(e,s)}function Ft(e,s){let t=e.seasonal_factors??e.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return d;let i=e.interval_analysis?.seasonal_reason,n=new Date().getMonth(),r=300,l=100,c=8,h=l-c-4,y=Math.max(...t,1.5),A=r/12,R=A*.65,b=c+h-1/y*h;return o`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${a("seasonal_chart_title",s)}
        ${i?o`<span class="source-tag">${i==="learned"?a("seasonal_learned",s):a("seasonal_manual",s)}</span>`:d}
      </div>
      <svg viewBox="0 0 ${r} ${l}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${a("chart_seasonal",s)}">
        <line x1="0" y1="${m(b)}" x2="${r}" y2="${m(b)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((L,T)=>{let N=L/y*h,G=T*A+(A-R)/2,C=c+h-N,F=T===n,V=L<1?"var(--success-color, #4caf50)":L>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return O`
            <rect x="${m(G)}" y="${m(C)}"
              width="${m(R)}" height="${m(N)}"
              fill="${V}" opacity="${F?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${wt.map((L,T)=>o`<span class="seasonal-label ${T===n?"active-month":""}">${a(L,s)}</span>`)}
      </div>
    </div>
  `}var g=class extends S{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._featuresLoaded=!1;this._currencySymbol=""}get _lang(){return M(this.hass)}async openFor(t,i){this._entryId=t,this._taskId=i,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=ft(new Date),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){if(!this._featuresLoaded)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});t?.features&&(this._features={...this._features,...t.features}),this._currencySymbol=j(t?.budget),it(t?.budget),this._featuresLoaded=!0}catch{}}close(){this._open=!1,this._task=null,this._error=""}async _loadTask(){if(!(!this._entryId||!this._taskId))try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._objectName=t.object?.name||"";let i=(t.tasks||[]).find(n=>n.id===this._taskId);this._task=i??null}catch(t){this._error=$(t,this._lang)}}async _runWs(t){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(t),this._busy=!1,!0}catch(i){return this._error=$(i,this._lang),this._busy=!1,!1}}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-3VXQOGVU.js").then(async({openCompleteDialog:t})=>{let i=this._task,n=[];try{n=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}t(vt({entryId:this._entryId,taskId:this._taskId,taskName:i.name,task:i,objects:n,lang:this._lang,checklist:i.checklist||[],adaptiveEnabled:!!i.adaptive_config?.enabled,currencySymbol:this._currencySymbol}))&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-3VXQOGVU.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-3VXQOGVU.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let t=a("delete_task_confirm",this._lang)||`Delete "${this._task?.name}"?`;if(!window.confirm(t))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})&&(this._toast=a("suggestion_applied",this._lang),this._notifyChanged("apply_suggestion"),await this._loadTask(),setTimeout(()=>{this._toast=""},2500))}async _reanalyzeInterval(){if(!(!this._entryId||!this._taskId)){this._busy=!0,this._error="";try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});this._toast=t.recommended_interval?`${a("reanalyze_result",this._lang)}: ${rt(t.recommended_interval,"days",this._lang)} (${t.data_points} pts)`:a("reanalyze_insufficient_data",this._lang),await this._loadTask(),setTimeout(()=>{this._toast=""},3500)}catch(t){this._error=$(t,this._lang)}finally{this._busy=!1}}}_onEditHistoryEntry(t){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-3VXQOGVU.js").then(({openHistoryEditDialog:i})=>{i({entry_id:this._entryId,task_id:this._taskId,original_timestamp:t.timestamp,type:t.type,timestamp:t.timestamp,notes:t.notes??null,cost:t.cost??null,duration:t.duration??null,completed_by:t.completed_by??null,used_parts:t.used_parts??null,photo_doc_ids:J(t),reading_value:t.reading_value??null,reading_values:Y(t),readings:this._task?.readings??[],task_type:this._task?.type??null,reading_unit:this._task?.reading_unit??null})})}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return d;let i=this._lang;return o`
      <div class="recommendation-card">
        <h4>${a("suggested_interval",i)}</h4>
        ${kt(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",i)}
        <div class="recommendation-actions">
          <button class="btn primary"
            @click=${this._applySuggestion} ?disabled=${this._busy}>
            <ha-icon icon="mdi:check"></ha-icon>
            ${a("apply_suggestion",i)}
          </button>
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${a("reanalyze",i)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(t){let i=this._lang,n=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,r=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,l=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,c=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!n&&!r&&!l&&!c?o`<div class="adaptive-empty">
        ${a("adaptive_no_data",i)}
      </div>`:o`
      <div class="adaptive-stack">
        ${this._toast?o`<div class="toast">${this._toast}</div>`:d}
        ${n?this._renderRecommendation(t):d}
        ${r?$t(t,i,this._features):d}
        ${l?xt(t,i):d}
        ${c?o`
          ${At(t,i,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?Lt(t,i):d}
        `:d}
      </div>
    `}_renderHistoryReadings(t,i,n){let r=Y(t),l=c=>f(c,n,{maximumFractionDigits:3});if(r.length>0)return o`<div class="history-readings">
        ${r.map(c=>{let p=_t(i,t,c.id);return o`<span class="history-reading"><span class="history-reading-name">${c.name}</span>
            <span class="history-reading-value">${l(c.value)}${c.unit?` ${c.unit}`:""}${p==null?"":` (${p>=0?"+":""}${l(p)})`}</span></span>`})}
      </div>`;if(t.reading_value!=null){let c=this._task?.reading_unit?` ${this._task.reading_unit}`:"";return o`<div class="history-readings"><span class="history-reading">
        <span class="history-reading-name">${a("reading_label",n)}</span>
        <span class="history-reading-value">${l(t.reading_value)}${c}</span></span></div>`}return d}_renderDetails(t){let i=this._lang,n=t.history||[],r=n.filter(p=>p.type==="completed"),l=r.reduce((p,h)=>p+(typeof h.cost=="number"?h.cost:0),0),c=(()=>{let p=r.map(h=>typeof h.duration=="number"?h.duration:null).filter(h=>h!=null);return p.length?Math.round(p.reduce((h,y)=>h+y,0)/p.length):null})();return o`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${a("times_performed",i)}</span>
            <span class="stat-value">${r.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${a("total_cost",i)}</span>
            <span class="stat-value">${Z(l,this._currencySymbol,i)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${a("avg_duration",i)}</span>
            <span class="stat-value">${c!=null?`${c}m`:"\u2014"}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${a("history",i)}</strong>
          <span class="history-count">${n.length}</span>
        </div>
        ${n.length===0?o`<div class="history-empty">${a("history_empty",i)}</div>`:o`
              <div class="history-list">
                ${[...n].reverse().slice(0,20).map(p=>{let h=["completed","reset","skipped"].includes(p.type);return o`
                    <div class="history-entry">
                      <div class="history-line">
                        <span class="history-type type-${p.type}">${a(p.type,i)}</span>
                        <span class="history-date">${at(p.timestamp,i)}</span>
                        ${h?o`<button class="history-edit"
                                   title="${a("history_edit_button",i)}"
                                   @click=${()=>this._onEditHistoryEntry(p)}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                            </button>`:d}
                      </div>
                      ${p.notes?o`<div class="history-notes">${p.notes}</div>`:d}
                      ${this._renderHistoryReadings(p,n,i)}
                      ${(()=>{let y=J(p);return y.length?o`<div class="history-photos">
                              ${y.map(A=>o`<maintenance-history-photo .hass=${this.hass} .docId=${A}></maintenance-history-photo>`)}
                            </div>`:d})()}
                      ${p.cost!=null||p.duration!=null?o`<div class="history-meta">
                            ${p.cost!=null?o`<span>💰 ${Z(p.cost,this._currencySymbol,i)}</span>`:d}
                            ${p.duration!=null?o`<span>⏱️ ${p.duration}m</span>`:d}
                          </div>`:d}
                    </div>
                  `})}
                ${n.length>20?o`<div class="history-more">… +${n.length-20} ${a("older_entries",i)}</div>`:d}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return d;let t=this._lang,i=this._task,n=this.hass?.user?.is_admin??!0;return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${i?o`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${W[i.status]||"#ccc"}"></span>
                  <span class="task-name">${i.name}</span>
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-3VXQOGVU.js").then(({openObjectQuickActions:r})=>{r(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${i.next_due?o`<span><strong>${a("next_due",t)}:</strong> ${z(i.next_due,t)}</span>`:d}
                  ${i.last_performed?o`<span><strong>${a("last_performed",t)}:</strong> ${z(i.last_performed,t)}</span>`:d}
                  ${i.schedule?.kind&&!["manual","one_time"].includes(i.schedule.kind)||i.interval_days!=null?o`<span><strong>${a("interval",t)}:</strong> ${ot(i,t)}</span>`:d}
                  ${q(i)?o`<span><strong>${a("phase_current",t)}:</strong> ${q(i)}</span>`:d}
                </div>
              </div>

              ${this._error?o`<div class="error">${this._error}</div>`:d}

              ${this._showSkip?o`
                    <div class="inline-form">
                      <label>${a("skip_reason",t)}</label>
                      <input type="text" .value=${this._skipReason}
                        @input=${r=>{this._skipReason=r.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${a("cancel",t)}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${a("skip",t)}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?o`
                    <div class="inline-form">
                      <label>${a("reset_to_date",t)}</label>
                      <ms-date-field
                        kind="date"
                        .hass=${this.hass}
                        .lang=${t}
                        .value=${this._resetDate}
                        @value-changed=${r=>{this._resetDate=r.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${a("cancel",t)}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${a("reset",t)}
                        </button>
                      </div>
                    </div>
                  `:o`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${this._onComplete} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${a("complete",t)}
                      </ha-button>
                      ${i.allow_skip!==!1?o`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${a("skip",t)}
                            </ha-button>
                          `:d}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${a("reset",t)}
                      </ha-button>
                    </div>
                    ${n?o`
                          <div class="actions secondary-row">
                            <ha-button size="small" appearance="outlined" variant="neutral" @click=${this._onEdit} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                              ${a("edit",t)}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="neutral" @click=${this._onQr} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                              ${a("qr_code",t)}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="neutral"
                              @click=${i.archived?this._onUnarchive:this._onArchive}
                              .disabled=${this._busy}>
                              <ha-icon slot="start" icon="${i.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                              ${i.archived?a("unarchive",t):a("archive",t)}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="danger" class="danger" @click=${this._onDelete} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                              ${a("delete",t)}
                            </ha-button>
                          </div>
                        `:d}
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?a("hide_details",t):a("show_details",t)}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?o`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?a("hide_stats",t):a("show_stats",t)}
                          </button>`:d}
                    </div>
                    ${this._showDetails?this._renderDetails(i):d}
                    ${this._showAdaptive?this._renderAdaptive(i):d}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${a("open_in_panel",t)}
                      </button>
                    </div>
                  `}
            `:o`<div class="loading">${a("loading",t)}</div>`}
      </div>
    `}};g.styles=[dt,E`
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
    /* #161: readings + photos on the entry (panel-timeline parity) */
    .history-readings { display: flex; flex-wrap: wrap; gap: 2px 16px; margin-top: 4px; font-size: 12px; }
    .history-reading { display: inline-flex; gap: 6px; }
    .history-reading-name { color: var(--secondary-text-color); }
    .history-reading-value { font-variant-numeric: tabular-nums; }
    .history-photos { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
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
  `],u([I({attribute:!1})],g.prototype,"hass",2),u([_()],g.prototype,"_open",2),u([_()],g.prototype,"_entryId",2),u([_()],g.prototype,"_taskId",2),u([_()],g.prototype,"_task",2),u([_()],g.prototype,"_objectName",2),u([_()],g.prototype,"_busy",2),u([_()],g.prototype,"_error",2),u([_()],g.prototype,"_showSkip",2),u([_()],g.prototype,"_showReset",2),u([_()],g.prototype,"_showDetails",2),u([_()],g.prototype,"_showAdaptive",2),u([_()],g.prototype,"_skipReason",2),u([_()],g.prototype,"_resetDate",2),u([_()],g.prototype,"_features",2),u([_()],g.prototype,"_toast",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",g);function Tt(e){return!!e&&/^https?:\/\//i.test(e)}function It(e){return e?customElements.get("ha-markdown")?o`<ha-markdown class="notes-md" .content=${e} breaks></ha-markdown>`:o`${e}`:d}var w=class extends S{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error=""}get _lang(){return M(this.hass)}async openFor(t){this._entryId=t,this._error="",this._open=!0,await this._load()}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._data=t}catch(t){this._error=$(t,this._lang)}}_onEditObject(){!this._entryId||!this._data||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-3VXQOGVU.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-3VXQOGVU.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data)return;let t=a("delete_object_confirm",this._lang)||`Delete "${this._data.object.name}" and all its tasks?`;if(window.confirm(t)){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(i){this._error=$(i,this._lang)}finally{this._busy=!1}}}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t){let i=a("confirm_archive_object",this._lang);if(!window.confirm(i))return}this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(i){this._error=$(i,this._lang)}finally{this._busy=!1}}_onTaskClick(t){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-3VXQOGVU.js").then(({openTaskQuickActions:i})=>{i(this._entryId,t)})}render(){if(!this._open)return d;let t=this._lang,i=this._data,n=i?.object,r=i?.tasks||[],l=this.hass?.user?.is_admin??!0;return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${i&&n?o`
              <div class="header">
                <div class="title">${n.name}</div>
                ${this._renderMetaRow(n)}
              </div>

              ${this._error?o`<div class="error">${this._error}</div>`:d}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${a("tasks",t)}</strong>
                  <span class="count">${r.length}</span>
                </div>
                ${r.length===0?o`<div class="empty">${a("no_tasks",t)}</div>`:o`
                      <div class="task-list">
                        ${r.map(c=>o`
                          <div class="task-row" @click=${()=>this._onTaskClick(c.id)}>
                            <span class="status-dot" style="background: ${W[c.status]||"#ccc"}"></span>
                            <span class="task-name">${c.name}</span>
                            <span class="task-status">${a(c.status||"ok",t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${n.notes?o`
                    <div class="notes-section">
                      <strong>${a("object_notes_label",t)}</strong>
                      <div class="notes-body">${It(n.notes)}</div>
                    </div>
                  `:d}

              ${l?o`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${a("add_task",t)}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${a("edit",t)}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${n.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${n.archived?a("unarchive_object",t):a("archive_object",t)}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${a("delete",t)}
                      </button>
                    </div>
                  `:d}
            `:o`<div class="loading">${a("loading",t)}</div>`}
      </div>
    `}_renderMetaRow(t){let i=this._lang,n=[];return t.area_id&&n.push([a("area",i),t.area_id]),t.manufacturer&&n.push([a("manufacturer",i),t.manufacturer]),t.model&&n.push([a("model",i),t.model]),t.serial_number&&n.push([a("serial_number_label",i),t.serial_number]),t.installation_date&&n.push([a("installed",i),t.installation_date]),t.warranty_expiry&&n.push([a("warranty",i),t.warranty_expiry]),t.documentation_url&&n.push([a("documentation_url_label",i),t.documentation_url]),n.length===0?d:o`
      <div class="meta">
        ${n.map(([r,l])=>o`
            <div class="meta-item">
              <span class="meta-label">${r}</span>
              <span class="meta-value">${Tt(l)?o`<a href="${l}" target="_blank" rel="noopener noreferrer">${l}</a>`:l}</span>
            </div>
          `)}
      </div>
    `}};w.styles=E`
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
  `,u([I({attribute:!1})],w.prototype,"hass",2),u([_()],w.prototype,"_open",2),u([_()],w.prototype,"_entryId",2),u([_()],w.prototype,"_data",2),u([_()],w.prototype,"_busy",2),u([_()],w.prototype,"_error",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",w);var Mt="maintenance-object-dialog",Pt="maintenance-task-dialog",Vt="maintenance-history-edit-dialog",Wt="maintenance-complete-dialog",Bt="maintenance-qr-dialog",Ut="maintenance-task-quick-actions-dialog",Gt="maintenance-object-quick-actions-dialog";function U(){return document.querySelector("home-assistant")?.hass}function Zt(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function P(e){let s=Zt(),t=s.querySelector(e)??document.body.querySelector(e);return t?t.parentNode!==s&&s.appendChild(t):(t=document.createElement(e),s.appendChild(t)),t}function D(e){let s=U();if(!s)return!1;e.hass=s;let t=M(s);return tt(t)||et(t).then(()=>{e.requestUpdate?.()}),st(s.locale,s.config?.country),!0}function Ai(e){return B(e).then(s=>s.rowActionStyle)}function Li(){yt()}function Ti(){let e=P(Mt);return D(e)?(e.openCreate(),!0):!1}function Ii(e,s){let t=P(Mt);return D(t)?(t.openEdit(e,s),!0):!1}function Mi(e="",s){let t=P(Pt);if(!D(t))return!1;let i=U();return i?((async()=>{let n=await B(i),r=t;r.checklistsEnabled=n.features.checklists,r.scheduleTimeEnabled=n.features.schedule_time,r.completionActionsEnabled=n.features.completion_actions,r.defaultWarningDays=n.defaultWarningDays,r.openCreate(e,s)})(),!0):!1}function Pi(e,s){let t=P(Pt);if(!D(t))return!1;let i=U();return i?((async()=>{try{let[n,r]=await Promise.all([i.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e}),B(i)]),l=(n.tasks||[]).find(p=>p.id===s);if(!l){console.warn(`openEditTaskDialog: task ${s} not found in entry ${e}`);return}let c=t;c.checklistsEnabled=r.features.checklists,c.scheduleTimeEnabled=r.features.schedule_time,c.completionActionsEnabled=r.features.completion_actions,c.defaultWarningDays=r.defaultWarningDays,await c.openEdit(e,l)}catch(n){console.warn("openEditTaskDialog: failed to load task/features",n)}})(),!0):!1}function Di(e){let s=P(Vt);return D(s)?(s.openEdit(e),!0):!1}function Ei(e){let s=P(Wt);return D(s)?(bt(s,e,M(U())),!0):!1}function Si(e){let s=P(Bt);return D(s)?(s.openForTask(e.entry_id,e.task_id,e.object_name,e.task_name),!0):!1}function Hi(e,s){let t=P(Ut);return D(t)?(t.openFor(e,s),!0):!1}function Ci(e){let s=P(Gt);return D(s)?(s.openFor(e),!0):!1}export{Tt as a,It as b,Ot as c,Rt as d,Q as e,vt as f,bt as g,m as h,ve as i,be as j,xe as k,$e as l,ke as m,we as n,Ae as o,xt as p,$t as q,kt as r,At as s,Lt as t,Ai as u,Li as v,Ti as w,Ii as x,Mi as y,Pi as z,Di as A,Ei as B,Si as C,Hi as D,Ci as E};
