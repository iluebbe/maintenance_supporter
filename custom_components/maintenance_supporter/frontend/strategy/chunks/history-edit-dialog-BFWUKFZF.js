/*! maintenance_supporter frontend 2.120.0 */
import"./chunk-SGIRHVKD.js";import"./chunk-W22QAADS.js";import{a as N,b as T,c as Q,d as z}from"./chunk-QOUQUHZL.js";import{b as w}from"./chunk-RZ3EDWKM.js";import"./chunk-VRDFHDHG.js";import{a as R,b as E}from"./chunk-6RKFUQIB.js";import"./chunk-RYR2KGUZ.js";import"./chunk-5TGQNU77.js";import{a as O}from"./chunk-PDZUWD5G.js";import"./chunk-NDHZDYG6.js";import{i as u}from"./chunk-EBE3TCKA.js";import"./chunk-YCOTE6HY.js";import{a as b,b as c,c as S}from"./chunk-RYL74NSR.js";import{J as k,a as y,d as p,g as _,i as v,p as x,w as $}from"./chunk-GOJWZNSJ.js";import{a as h,k as g,l as n,v as f}from"./chunk-7ZPVRRJE.js";var l=class extends v{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._openGen=0;this._photos=new R(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return g(this.hass)}openEdit(t){this._openGen++,this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(t.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(t),this._loadPartOptions()}_seedReadings(t){let e=[],s=new Set;for(let i of t.readings??[])s.has(i.id)||(s.add(i.id),e.push({id:i.id,name:i.name,unit:i.unit??null}));for(let i of t.reading_values??[])s.has(i.id)||(s.add(i.id),e.push({id:i.id,name:i.name,unit:i.unit??null}));this._readingRows=e;let r={};for(let i of t.reading_values??[])r[i.id]=String(i.value);this._readingText=r,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let t={};for(let e of this._readingRows){let s=(this._readingText[e.id]??"").trim();if(s==="")continue;let r=parseFloat(s.replace(",","."));isNaN(r)||(t[e.id]=r)}return t}async _loadPartOptions(){let t=this._draft;if(!t)return;let e=this._openGen;try{let s=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});if(e!==this._openGen)return;let r=[];for(let a of s.parts||[]){let o=a.entry_id===t.entry_id,d=a.consumers.some(m=>m.entry_id===t.entry_id&&m.task_id===t.task_id);!o&&!d||r.push({part_id:a.part_id,name:a.name,entry_id:a.entry_id,foreign:!o,object_name:a.object_name})}for(let a of t.used_parts||[]){let o=a.entry_id||t.entry_id;r.some(d=>d.part_id===a.part_id&&d.entry_id===o)||r.push({part_id:a.part_id,name:a.name||a.part_id,entry_id:o,foreign:o!==t.entry_id,object_name:null})}let i={};for(let a of t.used_parts||[])i[`${a.entry_id||t.entry_id}:${a.part_id}`]=a.quantity??1;this._partOptions=r,this._partQty=i,this._partQtyOriginal=this._partSelectionKey()}catch{if(e!==this._openGen)return;this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,t])=>t>0).sort(([t],[e])=>t.localeCompare(e)))}close(){this._openGen++,this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(t,e){this._draft&&(this._draft={...this._draft,[t]:e})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let t=this._lang,s=(this._originalSnapshot.used_parts||[]).filter(o=>o.quantity>0).map(o=>`${x(o.quantity,t)}\xD7 ${o.name||o.part_id}`).join(", ");if(!await w(this.hass,{title:n("history_delete_entry",t),message:s?`${n("history_delete_confirm_entry",t)} ${n("history_delete_returns_parts",t).replace("{parts}",s)}`:n("history_delete_confirm_entry",t),confirmText:n("delete",t),danger:!0})||!this._draft||!this._originalSnapshot)return;let i=this._draft;this._error="",await this._runWs({type:"maintenance_supporter/task/history/delete",entry_id:i.entry_id,task_id:i.task_id,timestamp:this._originalSnapshot.original_timestamp})!==void 0&&(this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:i.entry_id,task_id:i.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close())}_runWs(t){return k(this,t,{busy:e=>{this._saving=e},onError:e=>{this._error=e}})}async _save(){if(!this._draft||!this._originalSnapshot||this._saving||this._photos.uploading)return;this._error="",this._photos.clearError();let t=this._draft,e=this._originalSnapshot,s={type:"maintenance_supporter/task/history/update",entry_id:t.entry_id,task_id:t.task_id,original_timestamp:e.original_timestamp};if(t.timestamp!==e.timestamp&&(s.timestamp=t.timestamp),t.notes!==e.notes&&(s.notes=t.notes),t.cost!==e.cost&&(s.cost=t.cost),t.duration!==e.duration&&(s.duration=t.duration),t.completed_by!==e.completed_by&&(s.completed_by=t.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(s.used_parts=(this._partOptions||[]).filter(i=>(this._partQty[`${i.entry_id}:${i.part_id}`]||0)>0).map(i=>({part_id:i.part_id,quantity:this._partQty[`${i.entry_id}:${i.part_id}`],...i.foreign?{entry_id:i.entry_id}:{}}))),t.reading_value!==e.reading_value&&(s.reading_value=t.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let i=this._readingNumbers(),a={};for(let o of this._readingRows)a[o.id]=i[o.id]??null;s.reading_values=a}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(s.photo_doc_ids=this._photos.ids),Object.keys(s).filter(i=>!["type","entry_id","task_id","original_timestamp"].includes(i)).length===0){this.close();return}await this._runWs(s)!==void 0&&(this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:t.entry_id,task_id:t.task_id,new_timestamp:t.timestamp},bubbles:!0,composed:!0})),this.close())}render(){if(!this._open||!this._draft)return _;let t=this._lang,e=this._draft,s=this._error||this._photos.errorText(t);return Q(()=>this.close(),p`
        ${T()?_:p`<h2>${n("history_edit_title",t)}</h2>`}
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${n(e.type,t)||e.type}</span>
        </div>
        <ms-date-field
          kind="datetime"
          required
          .hass=${this.hass}
          .lang=${t}
          .label=${n("history_edit_timestamp",t)}
          .helper=${$(t)}
          .value=${f(e.timestamp)}
          @value-changed=${r=>{let i=r.detail.value;i&&this._set("timestamp",i)}}
        ></ms-date-field>
        <label>
          <span>${n("notes_label",t)}</span>
          <textarea
            rows="3"
            @input=${r=>{let i=r.target.value;this._set("notes",i||null)}}
            .value=${e.notes??""}></textarea>
        </label>
        <div class="row">
          <div class="cost-field">
            <span>${n("cost",t)}</span>
            <ms-cost-input .lang=${t} .value=${e.cost!=null?String(e.cost):""}
              @value-changed=${r=>{let i=r.detail.value;this._set("cost",i?Number(i):null)}}></ms-cost-input>
          </div>
          <label>
            <span>${n("duration",t)}</span>
            <input type="number" min="0" step="1" inputmode="numeric"
              .value=${e.duration!=null?String(e.duration):""}
              @input=${r=>{this._set("duration",O(r.target.value))}} />
          </label>
        </div>
        ${this._renderReadings(e,t)}
        ${this._partOptions&&this._partOptions.length>0?p`
          <div class="parts-block">
            <span class="parts-title">${n("complete_parts_used",t)}</span>
            ${this._partOptions.map(r=>{let i=`${r.entry_id}:${r.part_id}`,a=this._partQty[i]||0;return p`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${a>0}
                    @change=${o=>{let d=o.target.checked;this._partQty={...this._partQty,[i]:d?1:0}}} />
                  <span class="part-label">${r.name}${r.foreign&&r.object_name?` (${r.object_name})`:""}</span>
                  ${a>0?p`
                    <input class="part-qty" type="number" min=${u[0]} max=${u[1]} step="0.01"
                      .value=${String(a)}
                      @input=${o=>{let d=parseFloat(o.target.value);!isNaN(d)&&d>0&&(this._partQty={...this._partQty,[i]:d})}} />
                  `:_}
                </label>
              `})}
          </div>
        `:_}
        <div class="photos-block">
          <span class="parts-title">${n("completion_photos",t)}</span>
          ${this._photos.photos.length>0?p`
            <div class="photo-strip">
              ${this._photos.photos.map(r=>p`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${r.id}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${n("remove",t)}
                    @click=${()=>this._photos.remove(r.id)}>✕</button>
                </div>`)}
            </div>`:_}
          ${this._photos.full?p`<span class="photos-hint">${n("photos_limit",t).replace("{max}",String(this._photos.max))}</span>`:p`<ms-photo-picker .lang=${t} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${r=>this._photos.addFiles(r.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${n("history_edit_photos_hint",t)}</span>
        </div>
        ${s?S("error",s):_}
        <div class="actions">
          <button class="delete-entry" @click=${this._delete} ?disabled=${this._saving} title=${n("history_delete_entry",t)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon> ${n("history_delete_entry",t)}
          </button>
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${n("cancel",t)}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving||this._photos.uploading}
            title=${this._photos.uploading?n("uploading",t):""}>
            ${this._saving?n("saving",t):n("save",t)}
          </button>
        </div>
    `,{title:n("history_edit_title",t)})}updated(t){t.has("_open")&&this._open&&z(this.shadowRoot)}_renderReadings(t,e){return this._readingRows.length>0?p`
        <div class="readings-block">
          <span class="parts-title">${n("readings_section",e)}</span>
          ${this._readingRows.map(s=>p`
            <label class="reading-row-edit">
              <span class="reading-row-name">${s.name}${s.unit?` (${s.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[s.id]??""}
                @input=${r=>{this._readingText={...this._readingText,[s.id]:r.target.value}}} />
            </label>
          `)}
        </div>`:t.reading_value==null&&t.task_type!=="reading"?_:p`
      <label>
        <span>${n("reading_value_label",e)}${t.reading_unit?` (${t.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${t.reading_value!=null?String(t.reading_value):""}
          @input=${s=>{let r=s.target.value,i=r===""?NaN:Number(r);this._set("reading_value",isNaN(i)?null:i)}} />
      </label>`}};l.styles=[E,N,y`
    :host { display: contents; --ms-modal-max-height: 90vh; --ms-modal-gap: 12px; }
    h2 { margin: 0; font-size: 18px; font-weight: 500; }
    .entry-type {
      display: flex; align-items: center; gap: 6px;
      color: var(--secondary-text-color); font-size: 13px;
    }
    /* #216 consistency pass: the field label of ms-textfield / ms-date-field
       (12 px, 500, secondary) — this dialog's were 13 px, normal weight. */
    label { display: flex; flex-direction: column; gap: 4px; font-size: 14px; }
    label:not([class]) > span,
    .cost-field > span { font-size: 12px; font-weight: 500; color: var(--secondary-text-color); }
    .cost-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    input, textarea {
      padding: 8px 10px; font-size: 14px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444);
      border-radius: var(--ms-radius-6, 6px);
      width: 100%; box-sizing: border-box;
      font-family: inherit;
    }
    .delete-entry { margin-right: auto; color: var(--error-color, #d32f2f); background: transparent; border: 1px solid var(--error-color, #d32f2f); border-radius: var(--ms-radius-6, 6px); padding: 6px 10px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
    .delete-entry ha-icon { --mdc-icon-size: 18px; }
    .actions {
      display: flex; gap: 8px; justify-content: flex-end;
      margin-top: 8px;
    }
    button {
      padding: 8px 16px; font-size: 14px;
      border-radius: var(--ms-radius-6, 6px); cursor: pointer;
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
      border-radius: var(--ms-radius-6, 6px);
    }
    /* #130: parts on the entry */
    .parts-block {
      display: flex; flex-direction: column; gap: 6px;
      border: 1px solid var(--divider-color, #444);
      border-radius: var(--ms-radius-6, 6px); padding: 8px;
    }
    .parts-title { color: var(--secondary-text-color); font-size: 12px; font-weight: 500; }
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
      border-radius: var(--ms-radius-6, 6px); padding: 8px;
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
      border-radius: var(--ms-radius-6, 6px); padding: 8px;
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
  `],h([b({attribute:!1})],l.prototype,"hass",2),h([c()],l.prototype,"_open",2),h([c()],l.prototype,"_saving",2),h([c()],l.prototype,"_error",2),h([c()],l.prototype,"_draft",2),h([c()],l.prototype,"_partOptions",2),h([c()],l.prototype,"_partQty",2),h([c()],l.prototype,"_readingRows",2),h([c()],l.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",l);export{l as MaintenanceHistoryEditDialog};
