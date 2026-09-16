/*! maintenance_supporter frontend 2.88.0 */
import{b as ft,g as $t,j as Y,k as wt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6RV6BU2W.js";import{e as Z,g as xt,h as kt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YIWDUG36.js";import{b as gt,c as yt,e as G,f as vt,h as bt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-O5PU7PEF.js";import{a as $}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-IWWLTDMV.js";import{A as z,B as pt,D as ut,E as B,J as X,K as ht,L as _t,O as mt,a as h,b as M,c as l,d as C,f as d,h as D,l as L,m as _,n as W,o as st,p as j,q as s,s as T,t as at,u as ot,v as lt,w as dt,x as y,y as U,z as ct}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-WH2PUYFW.js";var P=class extends D{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await ft(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?d:this._url?l`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:l`<div class="ph"></div>`}};P.styles=M`
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
  `,h([L({attribute:!1})],P.prototype,"hass",2),h([L()],P.prototype,"docId",2),h([_()],P.prototype,"_url",2),h([_()],P.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",P);var v=class extends D{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._photos=new kt(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return T(this.hass)}openEdit(t){this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(t.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(t),this._loadPartOptions()}_seedReadings(t){let n=[],r=new Set;for(let o of t.readings??[])r.has(o.id)||(r.add(o.id),n.push({id:o.id,name:o.name,unit:o.unit??null}));for(let o of t.reading_values??[])r.has(o.id)||(r.add(o.id),n.push({id:o.id,name:o.name,unit:o.unit??null}));this._readingRows=n;let a={};for(let o of t.reading_values??[])a[o.id]=String(o.value);this._readingText=a,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let t={};for(let n of this._readingRows){let r=(this._readingText[n.id]??"").trim();if(r==="")continue;let a=parseFloat(r.replace(",","."));isNaN(a)||(t[n.id]=a)}return t}async _loadPartOptions(){let t=this._draft;if(t)try{let n=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"}),r=[];for(let o of n.parts||[]){let c=o.entry_id===t.entry_id,u=o.consumers.some(p=>p.entry_id===t.entry_id&&p.task_id===t.task_id);!c&&!u||r.push({part_id:o.part_id,name:o.name,entry_id:o.entry_id,foreign:!c,object_name:o.object_name})}for(let o of t.used_parts||[]){let c=o.entry_id||t.entry_id;r.some(u=>u.part_id===o.part_id&&u.entry_id===c)||r.push({part_id:o.part_id,name:o.name||o.part_id,entry_id:c,foreign:c!==t.entry_id,object_name:null})}let a={};for(let o of t.used_parts||[])a[`${o.entry_id||t.entry_id}:${o.part_id}`]=o.quantity??1;this._partOptions=r,this._partQty=a,this._partQtyOriginal=this._partSelectionKey()}catch{this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,t])=>t>0).sort(([t],[n])=>t.localeCompare(n)))}close(){this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(t,n){this._draft&&(this._draft={...this._draft,[t]:n})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let t=this._lang;if(window.confirm(s("history_delete_confirm",t))){this._saving=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/history/delete",entry_id:this._draft.entry_id,task_id:this._draft.task_id,timestamp:this._originalSnapshot.original_timestamp}),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close()}catch(n){this._error=$(n,t)}finally{this._saving=!1}}}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="",this._photos.clearError();try{let t={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(t.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(t.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(t.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(t.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(t.completed_by=this._draft.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(t.used_parts=(this._partOptions||[]).filter(r=>(this._partQty[`${r.entry_id}:${r.part_id}`]||0)>0).map(r=>({part_id:r.part_id,quantity:this._partQty[`${r.entry_id}:${r.part_id}`],...r.foreign?{entry_id:r.entry_id}:{}}))),this._draft.reading_value!==this._originalSnapshot.reading_value&&(t.reading_value=this._draft.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let r=this._readingNumbers(),a={};for(let o of this._readingRows)a[o.id]=r[o.id]??null;t.reading_values=a}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(t.photo_doc_ids=this._photos.ids),Object.keys(t).filter(r=>!["type","entry_id","task_id","original_timestamp"].includes(r)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(t),this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=$(t,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return d;let t=this._lang,n=this._draft,r=this._error||this._photos.errorText(t);return l`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${s("history_edit_title",t)}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${s(n.type,t)||n.type}</span>
        </div>
        <ms-date-field
          kind="datetime"
          required
          .hass=${this.hass}
          .lang=${t}
          .label=${s("history_edit_timestamp",t)}
          .value=${n.timestamp.slice(0,19)}
          @value-changed=${a=>{let o=a.detail.value;o&&this._set("timestamp",o)}}
        ></ms-date-field>
        <label>
          <span>${s("notes_label",t)}</span>
          <textarea
            rows="3"
            @input=${a=>{let o=a.target.value;this._set("notes",o||null)}}
            .value=${n.notes??""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${s("cost",t)}</span>
            <input type="number" min="0" step="0.01"
              .value=${n.cost!=null?String(n.cost):""}
              @input=${a=>{let o=a.target.value;this._set("cost",o?Number(o):null)}} />
          </label>
          <label>
            <span>${s("duration",t)}</span>
            <input type="number" min="0"
              .value=${n.duration!=null?String(n.duration):""}
              @input=${a=>{let o=a.target.value;this._set("duration",o?Number(o):null)}} />
          </label>
        </div>
        ${this._renderReadings(n,t)}
        ${this._partOptions&&this._partOptions.length>0?l`
          <div class="parts-block">
            <span class="parts-title">${s("complete_parts_used",t)}</span>
            ${this._partOptions.map(a=>{let o=`${a.entry_id}:${a.part_id}`,c=this._partQty[o]||0;return l`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${c>0}
                    @change=${u=>{let p=u.target.checked;this._partQty={...this._partQty,[o]:p?1:0}}} />
                  <span class="part-label">${a.name}${a.foreign&&a.object_name?` (${a.object_name})`:""}</span>
                  ${c>0?l`
                    <input class="part-qty" type="number" min="0.01" max="999" step="0.01"
                      .value=${String(c)}
                      @input=${u=>{let p=parseFloat(u.target.value);!isNaN(p)&&p>0&&(this._partQty={...this._partQty,[o]:p})}} />
                  `:d}
                </label>
              `})}
          </div>
        `:d}
        <div class="photos-block">
          <span class="parts-title">${s("completion_photos",t)}</span>
          ${this._photos.photos.length>0?l`
            <div class="photo-strip">
              ${this._photos.photos.map(a=>l`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${a.id}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${s("remove",t)}
                    @click=${()=>this._photos.remove(a.id)}>✕</button>
                </div>`)}
            </div>`:d}
          ${this._photos.full?l`<span class="photos-hint">${s("photos_limit",t).replace("{max}",String(this._photos.max))}</span>`:l`<ms-photo-picker .lang=${t} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${a=>this._photos.addFiles(a.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${s("history_edit_photos_hint",t)}</span>
        </div>
        ${r?l`<div class="error">${r}</div>`:d}
        <div class="actions">
          <button class="delete-entry" @click=${this._delete} ?disabled=${this._saving} title=${s("history_delete_entry",t)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon> ${s("history_delete_entry",t)}
          </button>
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${s("cancel",t)}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?s("saving",t):s("save",t)}
          </button>
        </div>
      </div>
    `}_renderReadings(t,n){return this._readingRows.length>0?l`
        <div class="readings-block">
          <span class="parts-title">${s("readings_section",n)}</span>
          ${this._readingRows.map(r=>l`
            <label class="reading-row-edit">
              <span class="reading-row-name">${r.name}${r.unit?` (${r.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[r.id]??""}
                @input=${a=>{this._readingText={...this._readingText,[r.id]:a.target.value}}} />
            </label>
          `)}
        </div>`:t.reading_value==null&&t.task_type!=="reading"?d:l`
      <label>
        <span>${s("reading_value_label",n)}${t.reading_unit?` (${t.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${t.reading_value!=null?String(t.reading_value):""}
          @input=${r=>{let a=r.target.value,o=a===""?NaN:Number(a);this._set("reading_value",isNaN(o)?null:o)}} />
      </label>`}};v.styles=[xt,M`
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
  `],h([L({attribute:!1})],v.prototype,"hass",2),h([_()],v.prototype,"_open",2),h([_()],v.prototype,"_saving",2),h([_()],v.prototype,"_error",2),h([_()],v.prototype,"_draft",2),h([_()],v.prototype,"_partOptions",2),h([_()],v.prototype,"_partQty",2),h([_()],v.prototype,"_readingRows",2),h([_()],v.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",v);function Qt(e,i){if(i<=0)return 0;let t=typeof e=="number"&&Number.isFinite(e)?Math.trunc(e):0;return t<0?0:t%i}function Xt(e){return!!(e?.phases&&e.phase_sequence&&e.phase_sequence.length>0)}function tt(e){if(!e||!Xt(e))return null;let i=e.phase_sequence,t=Qt(e.phase_cursor,i.length),n=i[t],r=e.phases?.[n];return r?{id:n,name:r.name,index:t,count:i.length,notes:r.notes,checklist:r.checklist!==void 0?r.checklist:e.checklist??[],consumesParts:r.consumes_parts!==void 0?r.consumes_parts:e.consumes_parts??[],requiredFields:r.required_completion_fields!==void 0?r.required_completion_fields:e.required_completion_fields??[]}:null}function N(e){let i=tt(e);return i?`${i.index+1}/${i.count} \xB7 ${i.name}`:""}function At(e){let i=e.task??null,t=i?tt(i):null,n=t?t.consumesParts:i?.consumes_parts||[],r=!!i?.part_ref,a=e.objects.find(u=>u.entry_id===e.entryId)?.parts||[],o=r?a.find(u=>u.id===i.part_ref.part_id):void 0,c=e.checklistsEnabled??!0;return{entry_id:e.entryId,task_id:e.taskId,task_name:e.taskName,checklist:t?c?t.checklist:[]:e.checklist??[],adaptive_enabled:!!e.adaptiveEnabled,required_completion_fields:t?t.requiredFields:i?.required_completion_fields||[],task_type:i?.type||"",reading_unit:i?.reading_unit||"",readings:i?.readings||[],reading_history:vt(i?.history),parts:r?[]:yt({consumes_parts:n},e.entryId,e.objects,e.lang),consumes_parts:r?[]:n,phase_label:t?N(i):"",require_tag_scan:!!i?.require_tag_scan,restock_default:r?o?.restock_quantity??1:null,restock_unit_cost:r?o?.cost??null:null,currency_symbol:j({currency_symbol:e.currencySymbol}),consumes_info:n.map(u=>gt(u,e.entryId,e.objects,e.lang)),checklist_prefill:i?.checklist_progress||{},via_tag_scan:!!e.viaTagScan}}function Et(e,i,t){e.entryId=i.entry_id,e.taskId=i.task_id,e.taskName=i.task_name,e.lang=t,e.checklist=i.checklist??[],e.adaptiveEnabled=!!i.adaptive_enabled,e.requiredFields=i.required_completion_fields??[],e.taskType=i.task_type??"",e.readingUnit=i.reading_unit??"",e.readings=i.readings??[],e.readingHistory=i.reading_history??[],e.parts=i.parts??[],e.consumesParts=i.consumes_parts??[],e.phaseLabel=i.phase_label??"",e.requireTagScan=!!i.require_tag_scan,e.restockDefault=i.restock_default??null,e.restockUnitCost=i.restock_unit_cost??null,e.currencySymbol=j(i),e.consumesInfo=i.consumes_info??[],e.checklistPrefill=i.checklist_prefill??{},e.viaTagScan=!!i.via_tag_scan,e.open({viaTagScan:!!i.via_tag_scan})}function et(e,i,t,n){let r=t,a=u=>typeof u=="string"?u:null,o=u=>typeof u=="number"?u:null,c=a(r.timestamp)??"";return{entry_id:e,task_id:i,original_timestamp:c,type:a(r.type)||"completed",timestamp:c,notes:a(r.notes),cost:o(r.cost),duration:o(r.duration),completed_by:a(r.completed_by),used_parts:Array.isArray(r.used_parts)?r.used_parts:null,photo_doc_ids:Z(r),reading_value:o(r.reading_value),reading_values:G(r),readings:n?.readings??[],task_type:n?.type??null,reading_unit:n?.reading_unit??null}}async function Je(e,i,t,n){let a=(await e.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:i})).tasks?.find(c=>c.id===t),o=a?.history?.find(c=>c.timestamp===n);return!a||!o?null:et(i,t,o,a)}var Lt=e=>typeof e=="number"&&Number.isInteger(e)&&e>0;function te(e){return e&&Lt(e.ref_no)?String(e.ref_no):null}function Tt(e,i){let t=te(e);return t&&i&&Lt(i.ref_no)?`${t}.${i.ref_no}`:null}function ti(e){let i=/^(\d+)(?:\.(\d+)(?:-(\d+))?)?$/.exec(e.trim());return i?{object:Number(i[1]),task:i[2]?Number(i[2]):null,entry:i[3]?Number(i[3]):null}:null}function Ht(e,i){return e?l`<span class="ref-chip" title=${i??""}>#${e}</span>`:d}var ee={\u00DF:"s","\u1E9E":"s",\u00E6:"a",\u0153:"o",\u00F8:"o",\u0111:"d",\u00F0:"d",\u00FE:"t",\u0142:"l",\u0131:"i"},Dt=10,ie=7,it=4,It=2,ne=5,Pt=3,re=/[a-z0-9]+/g;function K(e){let i="";for(let t of e.toLowerCase()){if(t.charCodeAt(0)<128&&t.length===1){i+=t;continue}let n=ee[t];if(n){i+=n;continue}let r=t.normalize("NFKD")[0]||t;i+=r.charCodeAt(0)<128?r:t}return i}function St(e){return K(e).match(re)||[]}function se(e){return K(e).replace(/[^a-z0-9]+/g,"")}function ae(e){return e.replace(/ue/g,"u").replace(/oe/g,"o").replace(/ae/g,"a").replace(/ss/g,"s")}function oe(e){let i=[];for(let t of St(e)){let n=[t],r=ae(t);r&&r!==t&&n.push(r),i.push(n)}return i}function Mt(e,i){if(e===i)return!0;let t=e.length,n=i.length;if(Math.abs(t-n)>1)return!1;if(t===n){let p=[];for(let f=0;f<t;f++)e[f]!==i[f]&&p.push(f);if(p.length===1)return!0;if(p.length===2&&p[1]===p[0]+1){let f=p[0];return e[f]===i[f+1]&&e[f+1]===i[f]}return!1}let[r,a]=t>n?[e,i]:[i,e],o=0,c=0,u=!1;for(;o<r.length&&c<a.length;)if(r[o]===a[c])o++,c++;else{if(u)return!1;u=!0,o++}return!0}function le(e,i){let t=0;for(let n of e)if(n){if(i===n)return Dt;if(i.startsWith(n)){t=Math.max(t,ie);continue}if(n.length>=Pt&&i.includes(n)){t=Math.max(t,it);continue}n.length>=ne&&t<It&&(Mt(n,i)||i.length>n.length&&Mt(n,i.slice(0,n.length)))&&(t=It)}return t}function de(e,i){let t=0;for(let n of St(i))if(t=Math.max(t,le(e,n)),t===Dt)return t;if(t<it){let n=se(i);for(let r of e)if(r.length>=Pt&&n.includes(r))return it}return t}function Rt(e,i){if(!e)return!1;let t=oe(i);if(!t.length){let n=K(i.trim());return n.length>0&&K(e).includes(n)}return ce(t,[{text:e,weight:1}])>0}function ce(e,i){if(!e.length)return 0;let t=i.filter(r=>r.text),n=0;for(let r of e){let a=0;for(let o of t){let c=de(r,o.text)*o.weight;c>a&&(a=c)}if(a===0)return 0;n+=a}return n}var pe=["completed","reset","skipped"],ue=["completed","skipped","missed","reset","triggered","trigger_replaced","trigger_removed"];function ci(e,i){let t=i.lang;return l`
    <div class="history-filters-new">
      <div class="filter-chips">
        ${ue.map(n=>{let r=e.history.filter(a=>a.type===n).length;return r===0?d:l`
            <span class="filter-chip ${i.filter===n?"active":""}"
              @click=${()=>i.setFilter(i.filter===n?null:n)}>
              ${s(n,t)} (${r})
            </span>
          `})}
        ${i.filter?l`<span class="filter-chip clear" @click=${()=>i.setFilter(null)}>${s("show_all",t)}</span>`:d}
      </div>
      <div class="filter-controls">
        <input type="text" class="search-input" placeholder="${s("search_notes",t)}..." .value=${i.search} @input=${n=>i.setSearch(n.target.value)} />
      </div>
    </div>
  `}function pi(e,i){let t=i.lang,n=i.filter?e.history.filter(r=>r.type===i.filter):e.history;if(i.search){let r=i.search.toLowerCase();n=n.filter(a=>Rt(a.notes,i.search)||(Ct(i,a)??"").toLowerCase().endsWith(r))}return n.length===0?l`<p class="empty">${s("no_history",t)}</p>`:l`
    <div class="history-timeline">
      ${[...n].reverse().map(r=>nt(r,i))}
    </div>
  `}function Ct(e,i){return e.taskRef&&i.ref_no?`${e.taskRef}-${i.ref_no}`:null}function he(e,i){let t=Z(i);return t.length>0?l`<div class="history-photos">
        ${t.map(n=>l`<maintenance-history-photo .hass=${e} .docId=${n}></maintenance-history-photo>`)}
      </div>`:d}function _e(e,i){let t=i.lang,n=o=>y(o,t,{maximumFractionDigits:3}),r=o=>o==null?"":` (${o>=0?"+":""}${n(o)})`,a=G(e);return a.length>0?l`<div class="history-readings">
      ${a.map(o=>l`<span class="history-reading">
        <span class="history-reading-name">${o.name}</span>
        <span class="history-reading-value">${n(o.value)}${o.unit?` ${o.unit}`:""}${r(i.readingSlotDelta?.(e,o.id))}</span>
      </span>`)}
    </div>`:e.reading_value!=null?l`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${s("reading_label",t)}</span>
      <span class="history-reading-value">${n(e.reading_value)}${i.readingUnit?` ${i.readingUnit}`:""}${r(i.readingDelta?.(e))}</span>
    </span></div>`:d}function nt(e,i,t={}){let n=i.lang,{compact:r=!1,showRef:a=!0,showBadges:o=!0,showEdit:c=!0}=t,u=c&&pe.includes(e.type);return l`
    <div class="history-entry${r?" compact":""}">
      ${r?d:l`<div class="history-icon ${e.type}">
            <ha-icon .icon=${st[e.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        <div class="history-row">
          <strong>${s(e.type,n)}</strong>
          ${a?Ht(Ct(i,e),s("ref_number",n)):d}
          ${o&&e.phase_id?l`<span class="history-phase-badge">${i.phaseNames?.[e.phase_id]||e.phase_id}</span>`:d}
          ${o&&e.auto?l`<span class="history-auto-badge">${s("history_auto",n)}</span>`:d}
          ${u?l`<button class="history-edit-btn"
                     title=${s("history_edit_button",n)}
                     @click=${()=>i.openEdit(e)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:d}
        </div>
        <div class="history-date">${pt(e.timestamp,n)}</div>
        ${e.notes?l`<div>${e.notes}</div>`:d}
        ${he(i.hass,e)}
        ${_e(e,i)}
        ${e.cost!=null||e.duration!=null||e.trigger_value!=null?l`<div class="history-details">
              ${e.cost!=null?l`<span>${s("cost",n)}: ${U(e.cost,i.currencySymbol,n)}</span>`:d}
              ${e.duration!=null?l`<span>${s("duration",n)}: ${B(e.duration,n)}</span>`:d}
              ${e.trigger_value!=null?l`<span>${s("trigger_val",n)}: ${e.trigger_value}</span>`:d}
            </div>`:d}
      </div>
    </div>
  `}function m(e){return e.toFixed(1)}function _i(e,i,t=4){if(!isFinite(e)||!isFinite(i))return{ticks:[],niceMin:0,niceMax:1};if(e===i){let p=Math.abs(e)*.1||1;e-=p,i+=p}let n=i-e,r=Math.pow(10,Math.floor(Math.log10(n/Math.max(1,t)))),a=r;for(let p of[1,2,5,10])if(a=r*p,n/a<=t+.5)break;let o=Math.floor(e/a)*a,c=Math.ceil(i/a)*a,u=[];for(let p=o;p<=c+a*1e-6;p+=a)u.push(Math.abs(p)<a*1e-9?0:p);return{ticks:u,niceMin:o,niceMax:c}}function mi(e,i){let t=Math.abs(e),n=r=>({maximumFractionDigits:r});return t>=1e6?y(e/1e6,i,n(t>=1e7?0:1))+"M":t>=1e4?y(e/1e3,i,n(0))+"k":t>=1e3?y(e/1e3,i,n(1))+"k":t>=100?y(e,i,n(0)):t>=1?y(e,i,n(1)):t===0?"0":y(e,i,n(2))}function fi(e,i,t){let n=y(e,t,{maximumFractionDigits:Math.abs(e)>=100?0:1});return i?`${n} ${i}`:n}function gi(e,i,t){return X(new Date(e),i,t)}function yi(e,i){let t=new Date(e);return`${X(t,i)}, ${ct(t,i)}`}function vi(e,i){return new Date(e).getFullYear()!==new Date(i).getFullYear()}function bi(e,i,t){if(t<2||i<=e)return[e,i];let n=[];for(let r=0;r<t;r++)n.push(e+(i-e)*r/(t-1));return n}function Ot(e,i){let t=e.interval_analysis,n=t?.weibull_beta,r=t?.weibull_eta;if(n==null||r==null||r<=0)return d;let a=e.interval_days??0,o=e.suggested_interval??a;return l`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${s("weibull_reliability_curve",i)}
        ${me(n,i)}
      </div>
      ${fe(n,r,a,o,i)}
      ${ge(t,i)}
      ${t?.confidence_interval_low!=null?ye(t,e,i):d}
    </div>
  `}function me(e,i){let t,n,r;return e<.8?(t="early_failures",n="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",r="beta_early_failures"):e<=1.2?(t="random_failures",n="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",r="beta_random_failures"):e<=3.5?(t="wear_out",n="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",r="beta_wear_out"):(t="highly_predictable",n="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",r="beta_highly_predictable"),l`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${n}"></ha-svg-icon>
      ${s(r,i)} (\u03B2=${y(e,i,2)})
    </span>
  `}function fe(e,i,t,n,r){let b=Math.max(t,n,i,1)*1.3,A=50,E=[];for(let x=0;x<=A;x++){let k=x/A*b,Yt=1-Math.exp(-Math.pow(k/i,e)),Kt=32+k/b*260,Jt=136-Yt*128;E.push([Kt,Jt])}let q=E.map(([x,k])=>`${m(x)},${m(k)}`).join(" "),Q="M32,136 "+E.map(([x,k])=>`L${m(x)},${m(k)}`).join(" ")+` L${m(E[A][0])},136 Z`,R=32+t/b*260,F=1-Math.exp(-Math.pow(t/i,e)),V=136-F*128,Gt=y((1-F)*100,r,0),rt=32+n/b*260,Zt=[0,.25,.5,.75,1];return l`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_weibull",r)}">
        ${Zt.map(x=>{let k=136-x*128;return C`
            <line x1="${32}" y1="${m(k)}" x2="${292}" y2="${m(k)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${x===.5?"4,3":d}" />
            <text x="${28}" y="${m(k+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${y(x*100,r,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(b/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(b)}</text>

        <path d="${Q}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${q}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?C`
          <line x1="${m(R)}" y1="${8}" x2="${m(R)}" y2="${m(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${m(R)}" cy="${m(V)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${m(R+4)}" y="${m(V-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${Gt}%</text>
        `:d}

        ${n>0&&n!==t?C`
          <line x1="${m(rt)}" y1="${8}" x2="${m(rt)}" y2="${m(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:d}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${s("weibull_failure_probability",r)}</span>
      ${t>0?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${s("current_interval_marker",r)}</span>`:d}
      ${n>0&&n!==t?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${s("recommended_marker",r)}</span>`:d}
    </div>
  `}function ge(e,i){return l`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${s("characteristic_life",i)}</span>
        <span class="weibull-info-value">${Math.round(e.weibull_eta)} ${s("days",i)}</span>
      </div>
      ${e.weibull_r_squared!=null?l`
        <div class="weibull-info-item">
          <span>${s("weibull_r_squared",i)}</span>
          <span class="weibull-info-value">${y(e.weibull_r_squared,i,3)}</span>
        </div>
      `:d}
    </div>
  `}function ye(e,i,t){let n=e.confidence_interval_low,r=e.confidence_interval_high,a=i.suggested_interval??i.interval_days??0,o=i.interval_days??0,c=Math.max(0,n-5),p=r+5-c,f=(n-c)/p*100,S=(r-n)/p*100,O=(a-c)/p*100,b=o>0?(o-c)/p*100:-1;return l`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${s("confidence_interval",t)}: ${a} ${s("days",t)} (${n}\u2013${r})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${m(f)}%;width:${m(S)}%"></div>
        ${b>=0?l`<div class="confidence-marker current" style="left:${m(b)}%"></div>`:d}
        <div class="confidence-marker recommended" style="left:${m(O)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${s("confidence_conservative",t)} (${n}${s("days",t).charAt(0)})</span>
        <span class="confidence-text high">${s("confidence_aggressive",t)} (${r}${s("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function jt(e,i,t){let n=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data",r=e.days_until_threshold!=null,a=e.environmental_factor!=null&&e.environmental_factor!==1;if(!n&&!r&&!a)return d;let o=e.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":e.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return l`
    <div class="prediction-section">
      ${e.sensor_prediction_urgency?l`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${s("sensor_prediction_urgency",i).replace("{days}",String(Math.round(e.days_until_threshold||0)))}
        </div>
      `:d}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${s("sensor_prediction",i)}
      </div>
      <div class="prediction-grid">
        ${n?l`
          <div class="prediction-item">
            <ha-svg-icon path="${o}"></ha-svg-icon>
            <span class="prediction-label">${s("degradation_trend",i)}</span>
            <span class="prediction-value ${e.degradation_trend}">${s("trend_"+e.degradation_trend,i)}</span>
            ${e.degradation_rate!=null?l`<span class="prediction-rate">${e.degradation_rate>0?"+":""}${y(e.degradation_rate,i,Math.abs(e.degradation_rate)>=10?0:1)} ${e.trigger_entity_info?.unit_of_measurement||""}/${s("day_short",i)}</span>`:d}
          </div>
        `:d}
        ${r?l`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${s("days_until_threshold",i)}</span>
            <span class="prediction-value prediction-days${e.days_until_threshold===0?" exceeded":e.sensor_prediction_urgency?" urgent":""}">${e.days_until_threshold===0?s("threshold_exceeded",i):"~"+Math.round(e.days_until_threshold)+" "+s("days",i)}</span>
            ${e.threshold_prediction_date?l`<span class="prediction-date">${z(e.threshold_prediction_date,i)}</span>`:d}
            ${e.threshold_prediction_confidence?l`<span class="confidence-dot ${e.threshold_prediction_confidence}"></span>`:d}
            ${(e.prediction_cycles??0)>0?l`<span class="prediction-cycles">${s("prediction_cycles",i)}: ${e.prediction_cycles}</span>`:d}
          </div>
        `:d}
        ${a&&t.environmental?l`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${s("environmental_adjustment",i)}</span>
            <span class="prediction-value">${y(e.environmental_factor,i,2)}x</span>
            ${e.environmental_entity?l`<span class="prediction-entity entity-link" @click=${c=>_t(c,e.environmental_entity)}>${e.environmental_entity}</span>`:d}
          </div>
        `:d}
      </div>
    </div>
  `}function zt(e,i,t,n){let r=Math.max(e||1,i);return l`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${s("current",n)}: ${e??"\u2014"} ${e!=null?s("days",n):""}
        </div>
        <div class="interval-visual current"
          style="width: ${e!=null?Math.min(e/r*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${s("recommended",n)}: ${i} ${s("days",n)}
          <span class="confidence-badge ${t}">${s(`confidence_${t}`,n)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(i/r*100,100)}%"></div>
      </div>
    </div>
  `}var Nt=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function qt(e,i,t){if(!t.seasonal||!e.seasonal_factor||e.seasonal_factor===1)return d;let n=Nt.map(c=>s(c,i)),r=new Date().getMonth(),a=e.seasonal_factors||e.interval_analysis?.seasonal_factors||null,o=a&&a.length===12?a:n.map((c,u)=>{let p=e.seasonal_factor||1,f=Math.sin((u-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,p+f))});return l`
    <div class="seasonal-card-compact">
      <h4>${s("seasonal_awareness",i)}</h4>
      <div class="seasonal-mini-chart">
        ${o.map((c,u)=>{let p=c*40,f=c<.9?"low":c>1.1?"high":"normal";return l`
            <div class="seasonal-bar ${f} ${u===r?"current":""}"
                 style="height: ${p}px"
                 title="${n[u]}: ${y(c,i,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${s("shorter",i)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${s("normal",i)}</span>
        <span class="legend-item"><span class="dot high"></span> ${s("longer",i)}</span>
      </div>
    </div>
  `}function Ft(e,i){return ve(e,i)}function ve(e,i){let t=e.seasonal_factors??e.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return d;let n=e.interval_analysis?.seasonal_reason,r=new Date().getMonth(),a=300,o=100,c=8,p=o-c-4,f=Math.max(...t,1.5),S=a/12,O=S*.65,b=c+p-1/f*p;return l`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${s("seasonal_chart_title",i)}
        ${n?l`<span class="source-tag">${n==="learned"?s("seasonal_learned",i):s("seasonal_manual",i)}</span>`:d}
      </div>
      <svg viewBox="0 0 ${a} ${o}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_seasonal",i)}">
        <line x1="0" y1="${m(b)}" x2="${a}" y2="${m(b)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((A,E)=>{let q=A/f*p,Q=E*S+(S-O)/2,R=c+p-q,F=E===r,V=A<1?"var(--success-color, #4caf50)":A>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return C`
            <rect x="${m(Q)}" y="${m(R)}"
              width="${m(O)}" height="${m(q)}"
              fill="${V}" opacity="${F?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${Nt.map((A,E)=>l`<span class="seasonal-label ${E===r?"active-month":""}">${s(A,i)}</span>`)}
      </div>
    </div>
  `}var g=class extends D{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._featuresLoaded=!1;this._currencySymbol=""}get _lang(){return T(this.hass)}async openFor(t,n){this._entryId=t,this._taskId=n,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=$t(new Date),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){if(!this._featuresLoaded)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});t?.features&&(this._features={...this._features,...t.features}),this._currencySymbol=j(t?.budget),lt(t?.budget),this._featuresLoaded=!0}catch{}}close(){this._open=!1,this._task=null,this._error=""}async _loadTask(){if(!(!this._entryId||!this._taskId))try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._objectName=t.object?.name||"";let n=(t.tasks||[]).find(r=>r.id===this._taskId);this._task=n??null,this._taskRef=Tt(t.object,n)}catch(t){this._error=$(t,this._lang)}}async _runWs(t){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(t),this._busy=!1,!0}catch(n){return this._error=$(n,this._lang),this._busy=!1,!1}}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-VTDE3ORD.js").then(async({openCompleteDialog:t})=>{let n=this._task,r=[];try{r=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}t(At({entryId:this._entryId,taskId:this._taskId,taskName:n.name,task:n,objects:r,lang:this._lang,checklist:n.checklist||[],adaptiveEnabled:!!n.adaptive_config?.enabled,currencySymbol:this._currencySymbol}))&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-VTDE3ORD.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-VTDE3ORD.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let t=s("delete_task_confirm",this._lang)||`Delete "${this._task?.name}"?`;if(!window.confirm(t))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})&&(this._toast=s("suggestion_applied",this._lang),this._notifyChanged("apply_suggestion"),await this._loadTask(),setTimeout(()=>{this._toast=""},2500))}async _reanalyzeInterval(){if(!(!this._entryId||!this._taskId)){this._busy=!0,this._error="";try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});this._toast=t.recommended_interval?`${s("reanalyze_result",this._lang)}: ${ut(t.recommended_interval,"days",this._lang)} (${t.data_points} pts)`:s("reanalyze_insufficient_data",this._lang),await this._loadTask(),setTimeout(()=>{this._toast=""},3500)}catch(t){this._error=$(t,this._lang)}finally{this._busy=!1}}}_onEditHistoryEntry(t){if(!this._entryId||!this._taskId)return;let n=et(this._entryId,this._taskId,t,this._task);import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-VTDE3ORD.js").then(({openHistoryEditDialog:r})=>r(n))}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return d;let n=this._lang;return l`
      <div class="recommendation-card">
        <h4>${s("suggested_interval",n)}</h4>
        ${zt(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",n)}
        <div class="recommendation-actions">
          <button class="btn primary"
            @click=${this._applySuggestion} ?disabled=${this._busy}>
            <ha-icon icon="mdi:check"></ha-icon>
            ${s("apply_suggestion",n)}
          </button>
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${s("reanalyze",n)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(t){let n=this._lang,r=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,a=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,o=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,c=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!r&&!a&&!o&&!c?l`<div class="adaptive-empty">
        ${s("adaptive_no_data",n)}
      </div>`:l`
      <div class="adaptive-stack">
        ${this._toast?l`<div class="toast">${this._toast}</div>`:d}
        ${r?this._renderRecommendation(t):d}
        ${a?jt(t,n,this._features):d}
        ${o?Ot(t,n):d}
        ${c?l`
          ${qt(t,n,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?Ft(t,n):d}
        `:d}
      </div>
    `}_renderDetails(t){let n=this._lang,r=t.history||[],a=r.filter(u=>u.type==="completed"),o=a.reduce((u,p)=>u+(typeof p.cost=="number"?p.cost:0),0),c=(()=>{let u=a.map(p=>typeof p.duration=="number"?p.duration:null).filter(p=>p!=null);return u.length?Math.round(u.reduce((p,f)=>p+f,0)/u.length):null})();return l`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${s("times_performed",n)}</span>
            <span class="stat-value">${a.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("total_cost",n)}</span>
            <span class="stat-value">${U(o,this._currencySymbol,n)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("avg_duration",n)}</span>
            <span class="stat-value">${B(c,n)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${s("history",n)}</strong>
          <span class="history-count">${r.length}</span>
        </div>
        ${r.length===0?l`<div class="history-empty">${s("history_empty",n)}</div>`:l`
              <div class="history-list">
                ${[...r].reverse().slice(0,20).map(u=>nt(u,{lang:n,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:p=>this._onEditHistoryEntry(p),readingUnit:t.reading_unit,readingSlotDelta:(p,f)=>bt(r,p,f),taskRef:this._taskRef},{compact:!0}))}
                ${r.length>20?l`<div class="history-more">… +${r.length-20} ${s("older_entries",n)}</div>`:d}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return d;let t=this._lang,n=this._task,r=this.hass?.user?.is_admin??!0;return l`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${n?l`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${W[n.status]||"#ccc"}"></span>
                  <span class="task-name">${n.name}</span>
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-VTDE3ORD.js").then(({openObjectQuickActions:a})=>{a(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${n.next_due?l`<span><strong>${s("next_due",t)}:</strong> ${z(n.next_due,t)}</span>`:d}
                  ${n.last_performed?l`<span><strong>${s("last_performed",t)}:</strong> ${z(n.last_performed,t)}</span>`:d}
                  ${n.schedule?.kind&&!["manual","one_time"].includes(n.schedule.kind)||n.interval_days!=null?l`<span><strong>${s("interval",t)}:</strong> ${ht(n,t)}</span>`:d}
                  ${N(n)?l`<span><strong>${s("phase_current",t)}:</strong> ${N(n)}</span>`:d}
                </div>
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:d}

              ${this._showSkip?l`
                    <div class="inline-form">
                      <label>${s("skip_reason",t)}</label>
                      <input type="text" .value=${this._skipReason}
                        @input=${a=>{this._skipReason=a.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${s("cancel",t)}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${s("skip",t)}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?l`
                    <div class="inline-form">
                      <label>${s("reset_to_date",t)}</label>
                      <ms-date-field
                        kind="date"
                        .hass=${this.hass}
                        .lang=${t}
                        .value=${this._resetDate}
                        @value-changed=${a=>{this._resetDate=a.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${s("cancel",t)}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${s("reset",t)}
                        </button>
                      </div>
                    </div>
                  `:l`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${this._onComplete} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${s("complete",t)}
                      </ha-button>
                      ${n.allow_skip!==!1?l`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${s("skip",t)}
                            </ha-button>
                          `:d}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${s("reset",t)}
                      </ha-button>
                    </div>
                    ${r?l`
                          <div class="actions secondary-row">
                            <ha-button size="small" appearance="outlined" variant="neutral" @click=${this._onEdit} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                              ${s("edit",t)}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="neutral" @click=${this._onQr} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                              ${s("qr_code",t)}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="neutral"
                              @click=${n.archived?this._onUnarchive:this._onArchive}
                              .disabled=${this._busy}>
                              <ha-icon slot="start" icon="${n.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                              ${n.archived?s("unarchive",t):s("archive",t)}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="danger" class="danger" @click=${this._onDelete} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                              ${s("delete",t)}
                            </ha-button>
                          </div>
                        `:d}
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?s("hide_details",t):s("show_details",t)}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?l`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?s("hide_stats",t):s("show_stats",t)}
                          </button>`:d}
                    </div>
                    ${this._showDetails?this._renderDetails(n):d}
                    ${this._showAdaptive?this._renderAdaptive(n):d}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${s("open_in_panel",t)}
                      </button>
                    </div>
                  `}
            `:l`<div class="loading">${s("loading",t)}</div>`}
      </div>
    `}};g.styles=[mt,M`
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
    /* The rows themselves are the shared renderer's (.history-entry.compact
       + the history-* classes from sharedStyles); only the list chrome is
       local. */
    .history-list { display: flex; flex-direction: column; max-height: 280px; overflow: auto; }
    .history-list .history-entry {
      padding: 6px 8px; border-radius: 6px; border-bottom: none; margin-bottom: 6px;
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
  `],h([L({attribute:!1})],g.prototype,"hass",2),h([_()],g.prototype,"_open",2),h([_()],g.prototype,"_entryId",2),h([_()],g.prototype,"_taskId",2),h([_()],g.prototype,"_task",2),h([_()],g.prototype,"_objectName",2),h([_()],g.prototype,"_taskRef",2),h([_()],g.prototype,"_busy",2),h([_()],g.prototype,"_error",2),h([_()],g.prototype,"_showSkip",2),h([_()],g.prototype,"_showReset",2),h([_()],g.prototype,"_showDetails",2),h([_()],g.prototype,"_showAdaptive",2),h([_()],g.prototype,"_skipReason",2),h([_()],g.prototype,"_resetDate",2),h([_()],g.prototype,"_features",2),h([_()],g.prototype,"_toast",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",g);function Vt(e){return!!e&&/^https?:\/\//i.test(e)}function Wt(e){return e?customElements.get("ha-markdown")?l`<ha-markdown class="notes-md" .content=${e} breaks></ha-markdown>`:l`${e}`:d}var w=class extends D{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error=""}get _lang(){return T(this.hass)}async openFor(t){this._entryId=t,this._error="",this._open=!0,await this._load()}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._data=t}catch(t){this._error=$(t,this._lang)}}_onEditObject(){!this._entryId||!this._data||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-VTDE3ORD.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-VTDE3ORD.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data)return;let t=s("delete_object_confirm",this._lang)||`Delete "${this._data.object.name}" and all its tasks?`;if(window.confirm(t)){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(n){this._error=$(n,this._lang)}finally{this._busy=!1}}}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t){let n=s("confirm_archive_object",this._lang);if(!window.confirm(n))return}this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(n){this._error=$(n,this._lang)}finally{this._busy=!1}}_onTaskClick(t){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-VTDE3ORD.js").then(({openTaskQuickActions:n})=>{n(this._entryId,t)})}render(){if(!this._open)return d;let t=this._lang,n=this._data,r=n?.object,a=n?.tasks||[],o=this.hass?.user?.is_admin??!0;return l`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${n&&r?l`
              <div class="header">
                <div class="title">${r.name}</div>
                ${this._renderMetaRow(r)}
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:d}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${s("tasks",t)}</strong>
                  <span class="count">${a.length}</span>
                </div>
                ${a.length===0?l`<div class="empty">${s("no_tasks",t)}</div>`:l`
                      <div class="task-list">
                        ${a.map(c=>l`
                          <div class="task-row" @click=${()=>this._onTaskClick(c.id)}>
                            <span class="status-dot" style="background: ${W[c.status]||"#ccc"}"></span>
                            <span class="task-name">${c.name}</span>
                            <span class="task-status">${s(c.status||"ok",t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${r.notes?l`
                    <div class="notes-section">
                      <strong>${s("object_notes_label",t)}</strong>
                      <div class="notes-body">${Wt(r.notes)}</div>
                    </div>
                  `:d}

              ${o?l`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${s("add_task",t)}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${s("edit",t)}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${r.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${r.archived?s("unarchive_object",t):s("archive_object",t)}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${s("delete",t)}
                      </button>
                    </div>
                  `:d}
            `:l`<div class="loading">${s("loading",t)}</div>`}
      </div>
    `}_renderMetaRow(t){let n=this._lang,r=[];return t.area_id&&r.push([s("area",n),t.area_id]),t.manufacturer&&r.push([s("manufacturer",n),t.manufacturer]),t.model&&r.push([s("model",n),t.model]),t.serial_number&&r.push([s("serial_number_label",n),t.serial_number]),t.installation_date&&r.push([s("installed",n),t.installation_date]),t.warranty_expiry&&r.push([s("warranty",n),t.warranty_expiry]),t.documentation_url&&r.push([s("documentation_url_label",n),t.documentation_url]),r.length===0?d:l`
      <div class="meta">
        ${r.map(([a,o])=>l`
            <div class="meta-item">
              <span class="meta-label">${a}</span>
              <span class="meta-value">${Vt(o)?l`<a href="${o}" target="_blank" rel="noopener noreferrer">${o}</a>`:o}</span>
            </div>
          `)}
      </div>
    `}};w.styles=M`
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
  `,h([L({attribute:!1})],w.prototype,"hass",2),h([_()],w.prototype,"_open",2),h([_()],w.prototype,"_entryId",2),h([_()],w.prototype,"_data",2),h([_()],w.prototype,"_busy",2),h([_()],w.prototype,"_error",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",w);var Ut="maintenance-object-dialog",Bt="maintenance-task-dialog",be="maintenance-history-edit-dialog",xe="maintenance-complete-dialog",$e="maintenance-qr-dialog",ke="maintenance-task-quick-actions-dialog",we="maintenance-object-quick-actions-dialog";function J(){return document.querySelector("home-assistant")?.hass}function Ae(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function H(e){let i=Ae(),t=i.querySelector(e)??document.body.querySelector(e);return t?t.parentNode!==i&&i.appendChild(t):(t=document.createElement(e),i.appendChild(t)),t}function I(e){let i=J();if(!i)return!1;e.hass=i;let t=T(i);return at(t)||ot(t).then(()=>{e.requestUpdate?.()}),dt(i.locale,i.config?.country),!0}function $n(e){return Y(e).then(i=>i.rowActionStyle)}function kn(){wt()}function wn(){let e=H(Ut);return I(e)?(e.openCreate(),!0):!1}function An(e,i){let t=H(Ut);return I(t)?(t.openEdit(e,i),!0):!1}function En(e="",i){let t=H(Bt);if(!I(t))return!1;let n=J();return n?((async()=>{let r=await Y(n),a=t;a.checklistsEnabled=r.features.checklists,a.scheduleTimeEnabled=r.features.schedule_time,a.completionActionsEnabled=r.features.completion_actions,a.defaultWarningDays=r.defaultWarningDays,a.openCreate(e,i)})(),!0):!1}function Ln(e,i){let t=H(Bt);if(!I(t))return!1;let n=J();return n?((async()=>{try{let[r,a]=await Promise.all([n.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e}),Y(n)]),o=(r.tasks||[]).find(u=>u.id===i);if(!o){console.warn(`openEditTaskDialog: task ${i} not found in entry ${e}`);return}let c=t;c.checklistsEnabled=a.features.checklists,c.scheduleTimeEnabled=a.features.schedule_time,c.completionActionsEnabled=a.features.completion_actions,c.defaultWarningDays=a.defaultWarningDays,await c.openEdit(e,o)}catch(r){console.warn("openEditTaskDialog: failed to load task/features",r)}})(),!0):!1}function Tn(e){let i=H(be);return I(i)?(i.openEdit(e),!0):!1}function Hn(e){let i=H(xe);return I(i)?(Et(i,e,T(J())),!0):!1}function In(e){let i=H($e);return I(i)?(i.openForTask(e.entry_id,e.task_id,e.object_name,e.task_name),!0):!1}function Mn(e,i){let t=H(ke);return I(t)?(t.openFor(e,i),!0):!1}function Dn(e){let i=H(we);return I(i)?(i.openFor(e),!0):!1}export{Vt as a,oe as b,ce as c,te as d,Tt as e,ti as f,Ht as g,Wt as h,Qt as i,Xt as j,tt as k,At as l,Et as m,m as n,_i as o,mi as p,fi as q,gi as r,yi as s,vi as t,bi as u,et as v,Je as w,ci as x,pi as y,nt as z,Ot as A,jt as B,zt as C,qt as D,Ft as E,$n as F,kn as G,wn as H,An as I,En as J,Ln as K,Tn as L,Hn as M,In as N,Mn as O,Dn as P};
