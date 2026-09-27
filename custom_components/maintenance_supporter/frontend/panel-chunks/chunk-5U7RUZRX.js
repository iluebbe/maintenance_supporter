/*! maintenance_supporter frontend 2.92.0 */
import{b as Tt,h as At,m as tt,n as q,o as M,p as Rt,q as Dt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-U3HDW4GU.js";import{e as Pt,f as Mt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-Y37XUUT4.js";import{a as X}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-CBIAKB2A.js";import{b as Et,c as Lt,e as Q,f as Ht,h as St,k as It}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-DDPAXPRO.js";import{a as T}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-PJQDDU52.js";import{A as V,B as vt,D as bt,E as J,J as rt,K as xt,L as $t,M as kt,O as wt,a as p,b as L,c as o,d as z,f as c,h as H,l as k,m as h,n as ht,o as Z,p as F,q as r,s as w,t as _t,u as mt,v as ft,w as gt,x as y,y as Y,z as yt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LTBDMOCY.js";var v=class extends H{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._options=null;this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel="",this._inputType="",this._options=null,this._inputValue="",this._open=!0,new Promise(i=>{this._resolve=i,this._promptResolve=null})}prompt(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel=t.inputLabel||"",this._inputType=t.inputType||"text",this._options=t.options&&t.options.length?t.options:null,this._inputValue=t.inputValue||"",this._open=!0,new Promise(i=>{this._promptResolve=i,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return c;let t=w(this.hass);return o`
      <ha-dialog open @closed=${this._cancel}>
        <div class="dialog-title">${this._title}</div>
        <div class="content">
          ${this._message}
          ${this._inputLabel?o`
            <!-- Native <input> rather than <ha-textfield>: HA loads
                 ha-textfield lazily for its own panels, so inside this custom
                 panel it can be unregistered and render with zero height —
                 the prompt then shows no field at all (caught live testing
                 the pause/replace prompts; same fix as complete-dialog). -->
            <label class="field">
              <span class="field-label">${this._inputLabel}</span>
              ${this._options?o`<select class="field-input field-select"
                    @change=${i=>this._inputValue=i.target.value}>
                    ${this._options.map(i=>o`<option value=${i.value} ?selected=${i.value===this._inputValue}>${i.label}</option>`)}
                  </select>`:o`<input class="field-input"
                    type="${this._inputType||"text"}"
                    .value=${this._inputValue}
                    @input=${i=>this._inputValue=i.target.value} />`}
            </label>
          `:c}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._cancel}>
            ${r("cancel",t)}
          </ha-button>
          <ha-button
            class="${this._danger?"danger":""}"
            @click=${this._confirmAction}
          >
            ${this._confirmText}
          </ha-button>
        </div>
      </ha-dialog>
    `}};v.styles=[kt,L`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    /* shared native-field scaffold from nativeFieldStyles; the prompt input
       follows the message text, hence the extra top margin here */
    .field { margin-top: 12px; }
    .content {
      padding: 8px 0;
      min-width: 280px;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    ha-textfield {
      display: block;
    }
    ha-button.danger {
      --mdc-theme-primary: var(--error-color, #f44336);
    }
  `],p([k({attribute:!1})],v.prototype,"hass",2),p([h()],v.prototype,"_open",2),p([h()],v.prototype,"_title",2),p([h()],v.prototype,"_message",2),p([h()],v.prototype,"_confirmText",2),p([h()],v.prototype,"_danger",2),p([h()],v.prototype,"_inputLabel",2),p([h()],v.prototype,"_inputType",2),p([h()],v.prototype,"_options",2),p([h()],v.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",v);var Ct="maintenance-confirm-dialog",Ot="data-ms-lovelace-confirm";function ue(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function O(e,n){let t=ue(),i=t.querySelector(`${Ct}[${Ot}]`);return i||(i=document.createElement(Ct),i.setAttribute(Ot,""),t.appendChild(i)),i.hass=e,i.confirm(n)}var D=class extends H{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await Tt(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?c:this._url?o`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:o`<div class="ph"></div>`}};D.styles=L`
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
  `,p([k({attribute:!1})],D.prototype,"hass",2),p([k()],D.prototype,"docId",2),p([h()],D.prototype,"_url",2),p([h()],D.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",D);var b=class extends H{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._openGen=0;this._photos=new Mt(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return w(this.hass)}openEdit(t){this._openGen++,this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(t.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(t),this._loadPartOptions()}_seedReadings(t){let i=[],s=new Set;for(let l of t.readings??[])s.has(l.id)||(s.add(l.id),i.push({id:l.id,name:l.name,unit:l.unit??null}));for(let l of t.reading_values??[])s.has(l.id)||(s.add(l.id),i.push({id:l.id,name:l.name,unit:l.unit??null}));this._readingRows=i;let a={};for(let l of t.reading_values??[])a[l.id]=String(l.value);this._readingText=a,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let t={};for(let i of this._readingRows){let s=(this._readingText[i.id]??"").trim();if(s==="")continue;let a=parseFloat(s.replace(",","."));isNaN(a)||(t[i.id]=a)}return t}async _loadPartOptions(){let t=this._draft;if(!t)return;let i=this._openGen;try{let s=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});if(i!==this._openGen)return;let a=[];for(let d of s.parts||[]){let _=d.entry_id===t.entry_id,u=d.consumers.some(f=>f.entry_id===t.entry_id&&f.task_id===t.task_id);!_&&!u||a.push({part_id:d.part_id,name:d.name,entry_id:d.entry_id,foreign:!_,object_name:d.object_name})}for(let d of t.used_parts||[]){let _=d.entry_id||t.entry_id;a.some(u=>u.part_id===d.part_id&&u.entry_id===_)||a.push({part_id:d.part_id,name:d.name||d.part_id,entry_id:_,foreign:_!==t.entry_id,object_name:null})}let l={};for(let d of t.used_parts||[])l[`${d.entry_id||t.entry_id}:${d.part_id}`]=d.quantity??1;this._partOptions=a,this._partQty=l,this._partQtyOriginal=this._partSelectionKey()}catch{if(i!==this._openGen)return;this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,t])=>t>0).sort(([t],[i])=>t.localeCompare(i)))}close(){this._openGen++,this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(t,i){this._draft&&(this._draft={...this._draft,[t]:i})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let t=this._lang;if(!(!await O(this.hass,{title:r("history_delete_entry",t),message:r("history_delete_confirm",t),confirmText:r("delete",t),danger:!0})||!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/history/delete",entry_id:this._draft.entry_id,task_id:this._draft.task_id,timestamp:this._originalSnapshot.original_timestamp}),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close()}catch(s){this._error=T(s,t)}finally{this._saving=!1}}}async _save(){if(!(!this._draft||!this._originalSnapshot)&&!(this._saving||this._photos.uploading)){this._saving=!0,this._error="",this._photos.clearError();try{let t={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(t.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(t.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(t.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(t.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(t.completed_by=this._draft.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(t.used_parts=(this._partOptions||[]).filter(s=>(this._partQty[`${s.entry_id}:${s.part_id}`]||0)>0).map(s=>({part_id:s.part_id,quantity:this._partQty[`${s.entry_id}:${s.part_id}`],...s.foreign?{entry_id:s.entry_id}:{}}))),this._draft.reading_value!==this._originalSnapshot.reading_value&&(t.reading_value=this._draft.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let s=this._readingNumbers(),a={};for(let l of this._readingRows)a[l.id]=s[l.id]??null;t.reading_values=a}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(t.photo_doc_ids=this._photos.ids),Object.keys(t).filter(s=>!["type","entry_id","task_id","original_timestamp"].includes(s)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(t),this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=T(t,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return c;let t=this._lang,i=this._draft,s=this._error||this._photos.errorText(t);return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${r("history_edit_title",t)}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${r(i.type,t)||i.type}</span>
        </div>
        <ms-date-field
          kind="datetime"
          required
          .hass=${this.hass}
          .lang=${t}
          .label=${r("history_edit_timestamp",t)}
          .value=${i.timestamp.slice(0,19)}
          @value-changed=${a=>{let l=a.detail.value;l&&this._set("timestamp",l)}}
        ></ms-date-field>
        <label>
          <span>${r("notes_label",t)}</span>
          <textarea
            rows="3"
            @input=${a=>{let l=a.target.value;this._set("notes",l||null)}}
            .value=${i.notes??""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${r("cost",t)}</span>
            <input type="number" min="0" step="0.01"
              .value=${i.cost!=null?String(i.cost):""}
              @input=${a=>{let l=a.target.value;this._set("cost",l?Number(l):null)}} />
          </label>
          <label>
            <span>${r("duration",t)}</span>
            <input type="number" min="0" step="1" inputmode="numeric"
              .value=${i.duration!=null?String(i.duration):""}
              @input=${a=>{this._set("duration",It(a.target.value))}} />
          </label>
        </div>
        ${this._renderReadings(i,t)}
        ${this._partOptions&&this._partOptions.length>0?o`
          <div class="parts-block">
            <span class="parts-title">${r("complete_parts_used",t)}</span>
            ${this._partOptions.map(a=>{let l=`${a.entry_id}:${a.part_id}`,d=this._partQty[l]||0;return o`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${d>0}
                    @change=${_=>{let u=_.target.checked;this._partQty={...this._partQty,[l]:u?1:0}}} />
                  <span class="part-label">${a.name}${a.foreign&&a.object_name?` (${a.object_name})`:""}</span>
                  ${d>0?o`
                    <input class="part-qty" type="number" min="0.01" max="999" step="0.01"
                      .value=${String(d)}
                      @input=${_=>{let u=parseFloat(_.target.value);!isNaN(u)&&u>0&&(this._partQty={...this._partQty,[l]:u})}} />
                  `:c}
                </label>
              `})}
          </div>
        `:c}
        <div class="photos-block">
          <span class="parts-title">${r("completion_photos",t)}</span>
          ${this._photos.photos.length>0?o`
            <div class="photo-strip">
              ${this._photos.photos.map(a=>o`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${a.id}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${r("remove",t)}
                    @click=${()=>this._photos.remove(a.id)}>✕</button>
                </div>`)}
            </div>`:c}
          ${this._photos.full?o`<span class="photos-hint">${r("photos_limit",t).replace("{max}",String(this._photos.max))}</span>`:o`<ms-photo-picker .lang=${t} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${a=>this._photos.addFiles(a.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${r("history_edit_photos_hint",t)}</span>
        </div>
        ${s?o`<div class="error">${s}</div>`:c}
        <div class="actions">
          <button class="delete-entry" @click=${this._delete} ?disabled=${this._saving} title=${r("history_delete_entry",t)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon> ${r("history_delete_entry",t)}
          </button>
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${r("cancel",t)}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving||this._photos.uploading}
            title=${this._photos.uploading?r("uploading",t):""}>
            ${this._saving?r("saving",t):r("save",t)}
          </button>
        </div>
      </div>
    `}_renderReadings(t,i){return this._readingRows.length>0?o`
        <div class="readings-block">
          <span class="parts-title">${r("readings_section",i)}</span>
          ${this._readingRows.map(s=>o`
            <label class="reading-row-edit">
              <span class="reading-row-name">${s.name}${s.unit?` (${s.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[s.id]??""}
                @input=${a=>{this._readingText={...this._readingText,[s.id]:a.target.value}}} />
            </label>
          `)}
        </div>`:t.reading_value==null&&t.task_type!=="reading"?c:o`
      <label>
        <span>${r("reading_value_label",i)}${t.reading_unit?` (${t.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${t.reading_value!=null?String(t.reading_value):""}
          @input=${s=>{let a=s.target.value,l=a===""?NaN:Number(a);this._set("reading_value",isNaN(l)?null:l)}} />
      </label>`}};b.styles=[Pt,L`
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
  `],p([k({attribute:!1})],b.prototype,"hass",2),p([h()],b.prototype,"_open",2),p([h()],b.prototype,"_saving",2),p([h()],b.prototype,"_error",2),p([h()],b.prototype,"_draft",2),p([h()],b.prototype,"_partOptions",2),p([h()],b.prototype,"_partQty",2),p([h()],b.prototype,"_readingRows",2),p([h()],b.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",b);function he(e,n){if(n<=0)return 0;let t=typeof e=="number"&&Number.isFinite(e)?Math.trunc(e):0;return t<0?0:t%n}function _e(e){return!!(e?.phases&&e.phase_sequence&&e.phase_sequence.length>0)}function at(e){if(!e||!_e(e))return null;let n=e.phase_sequence,t=he(e.phase_cursor,n.length),i=n[t],s=e.phases?.[i];return s?{id:i,name:s.name,index:t,count:n.length,notes:s.notes,checklist:s.checklist!==void 0?s.checklist:e.checklist??[],consumesParts:s.consumes_parts!==void 0?s.consumes_parts:e.consumes_parts??[],requiredFields:s.required_completion_fields!==void 0?s.required_completion_fields:e.required_completion_fields??[]}:null}function W(e){let n=at(e);return n?`${n.index+1}/${n.count} \xB7 ${n.name}`:""}function me(e,n){return typeof e=="number"&&Number.isFinite(e)&&e>=.01?e:n}function jt(e){let n=e.task??null,t=n?at(n):null,i=t?t.consumesParts:n?.consumes_parts||[],s=!!n?.part_ref,a=e.objects.find(f=>f.entry_id===e.entryId)?.parts||[],l=s?a.find(f=>f.id===n.part_ref.part_id):void 0,d=e.features?e.features.checklists:e.checklistsEnabled??!0,_=e.features?e.features.checklists?e.checklist??n?.checklist??[]:[]:e.checklist??[],u=e.features?e.features.adaptive&&(e.adaptiveEnabled??!!n?.adaptive_config?.enabled):!!e.adaptiveEnabled;return{entry_id:e.entryId,task_id:e.taskId,task_name:e.taskName,checklist:t?d?t.checklist:[]:_,adaptive_enabled:u,required_completion_fields:t?t.requiredFields:n?.required_completion_fields||[],task_type:n?.type||"",reading_unit:n?.reading_unit||"",readings:n?.readings||[],reading_history:Ht(n?.history),parts:s?[]:Lt({consumes_parts:i},e.entryId,e.objects,e.lang),consumes_parts:s?[]:i,phase_label:t?W(n):"",require_tag_scan:!!n?.require_tag_scan,restock_default:s?me(l?.restock_quantity,1):null,restock_unit_cost:s?l?.cost??null:null,currency_symbol:F({currency_symbol:e.currencySymbol}),consumes_info:i.map(f=>Et(f,e.entryId,e.objects,e.lang)),checklist_prefill:n?.checklist_progress||{},via_tag_scan:!!e.viaTagScan}}function zt(e,n,t){e.entryId=n.entry_id,e.taskId=n.task_id,e.taskName=n.task_name,e.lang=t,e.checklist=n.checklist??[],e.adaptiveEnabled=!!n.adaptive_enabled,e.requiredFields=n.required_completion_fields??[],e.taskType=n.task_type??"",e.readingUnit=n.reading_unit??"",e.readings=n.readings??[],e.readingHistory=n.reading_history??[],e.parts=n.parts??[],e.consumesParts=n.consumes_parts??[],e.phaseLabel=n.phase_label??"",e.requireTagScan=!!n.require_tag_scan,e.restockDefault=n.restock_default??null,e.restockUnitCost=n.restock_unit_cost??null,e.currencySymbol=F(n),e.consumesInfo=n.consumes_info??[],e.checklistPrefill=n.checklist_prefill??{},e.viaTagScan=!!n.via_tag_scan,e.open({viaTagScan:!!n.via_tag_scan})}function ot(e,n,t,i){let s=t,a=_=>typeof _=="string"?_:null,l=_=>typeof _=="number"?_:null,d=a(s.timestamp)??"";return{entry_id:e,task_id:n,original_timestamp:d,type:a(s.type)||"completed",timestamp:d,notes:a(s.notes),cost:l(s.cost),duration:l(s.duration),completed_by:a(s.completed_by),used_parts:Array.isArray(s.used_parts)?s.used_parts:null,photo_doc_ids:X(s),reading_value:l(s.reading_value),reading_values:Q(s),readings:i?.readings??[],task_type:i?.type??null,reading_unit:i?.reading_unit??null}}async function wi(e,n,t,i){let a=(await e.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:n})).tasks?.find(d=>d.id===t);if(!a)return null;let l=a.history?.find(d=>d.timestamp===i);return l||(l=(await e.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:n,task_id:t})).history?.find(_=>_.timestamp===i)),l?ot(n,t,l,a):null}var qt=e=>typeof e=="number"&&Number.isInteger(e)&&e>0;function fe(e){return e&&qt(e.ref_no)?String(e.ref_no):null}function Nt(e,n){let t=fe(e);return t&&n&&qt(n.ref_no)?`${t}.${n.ref_no}`:null}function Ei(e){let n=/^(\d+)(?:\.(\d+)(?:-(\d+))?)?$/.exec(e.trim());return n?{object:Number(n[1]),task:n[2]?Number(n[2]):null,entry:n[3]?Number(n[3]):null}:null}function Ft(e,n){return e?o`<span class="ref-chip" title=${n??""}>#${e}</span>`:c}var ge={\u00DF:"s","\u1E9E":"s",\u00E6:"a",\u0153:"o",\u00F8:"o",\u0111:"d",\u00F0:"d",\u00FE:"t",\u0142:"l",\u0131:"i"},Ut=10,ye=7,lt=4,Vt=2,ve=5,Gt=3,be=/[a-z0-9]+/g;function et(e){let n="";for(let t of e.toLowerCase()){if(t.charCodeAt(0)<128&&t.length===1){n+=t;continue}let i=ge[t];if(i){n+=i;continue}let s=t.normalize("NFKD")[0]||t;n+=s.charCodeAt(0)<128?s:t}return n}function Bt(e){return et(e).match(be)||[]}function xe(e){return et(e).replace(/[^a-z0-9]+/g,"")}function $e(e){return e.replace(/ue/g,"u").replace(/oe/g,"o").replace(/ae/g,"a").replace(/ss/g,"s")}function ke(e){let n=[];for(let t of Bt(e)){let i=[t],s=$e(t);s&&s!==t&&i.push(s),n.push(i)}return n}function Wt(e,n){if(e===n)return!0;let t=e.length,i=n.length;if(Math.abs(t-i)>1)return!1;if(t===i){let u=[];for(let f=0;f<t;f++)e[f]!==n[f]&&u.push(f);if(u.length===1)return!0;if(u.length===2&&u[1]===u[0]+1){let f=u[0];return e[f]===n[f+1]&&e[f+1]===n[f]}return!1}let[s,a]=t>i?[e,n]:[n,e],l=0,d=0,_=!1;for(;l<s.length&&d<a.length;)if(s[l]===a[d])l++,d++;else{if(_)return!1;_=!0,l++}return!0}function we(e,n){let t=0;for(let i of e)if(i){if(n===i)return Ut;if(n.startsWith(i)){t=Math.max(t,ye);continue}if(i.length>=Gt&&n.includes(i)){t=Math.max(t,lt);continue}i.length>=ve&&t<Vt&&(Wt(i,n)||n.length>i.length&&Wt(i,n.slice(0,i.length)))&&(t=Vt)}return t}function Te(e,n){let t=0;for(let i of Bt(n))if(t=Math.max(t,we(e,i)),t===Ut)return t;if(t<lt){let i=xe(n);for(let s of e)if(s.length>=Gt&&i.includes(s))return lt}return t}function Kt(e,n){if(!e)return!1;let t=ke(n);if(!t.length){let i=et(n.trim());return i.length>0&&et(e).includes(i)}return Ae(t,[{text:e,weight:1}])>0}function Ae(e,n){if(!e.length)return 0;let t=n.filter(s=>s.text),i=0;for(let s of e){let a=0;for(let l of t){let d=Te(s,l.text)*l.weight;d>a&&(a=d)}if(a===0)return 0;i+=a}return i}var Ee=["completed","reset","skipped"];function ct(e){let n=t=>{let i=t.timestamp??"",s=Date.parse(i.length===10?`${i}T00:00:00`:i);return Number.isNaN(s)?-1/0:s};return(e??[]).map((t,i)=>({entry:t,index:i,at:n(t)})).sort((t,i)=>i.at-t.at||i.index-t.index).map(t=>t.entry)}var Le=["completed","skipped","missed","reset","triggered","trigger_replaced","trigger_removed"];function Oi(e,n){let t=n.lang;return o`
    <div class="history-filters-new">
      <div class="filter-chips">
        ${Le.map(i=>{let s=e.history.filter(a=>a.type===i).length;return s===0?c:o`
            <span class="filter-chip ${n.filter===i?"active":""}"
              @click=${()=>n.setFilter(n.filter===i?null:i)}>
              ${r(i,t)} (${s})
            </span>
          `})}
        ${n.filter?o`<span class="filter-chip clear" @click=${()=>n.setFilter(null)}>${r("show_all",t)}</span>`:c}
      </div>
      <div class="filter-controls">
        <input type="text" class="search-input" placeholder="${r("search_notes",t)}..." .value=${n.search} @input=${i=>n.setSearch(i.target.value)} />
      </div>
    </div>
  `}function ji(e,n){let t=n.lang,i=n.filter?e.history.filter(s=>s.type===n.filter):e.history;if(n.search){let s=n.search.toLowerCase();i=i.filter(a=>Kt(a.notes,n.search)||(Zt(n,a)??"").toLowerCase().endsWith(s))}return i.length===0?o`<p class="empty">${r("no_history",t)}</p>`:o`
    <div class="history-timeline">
      ${ct(i).map(s=>dt(s,n))}
    </div>
  `}function Zt(e,n){return e.taskRef&&n.ref_no?`${e.taskRef}-${n.ref_no}`:null}function He(e,n){let t=X(n);return t.length>0?o`<div class="history-photos">
        ${t.map(i=>o`<maintenance-history-photo .hass=${e} .docId=${i}></maintenance-history-photo>`)}
      </div>`:c}function Se(e,n){let t=n.lang,i=l=>y(l,t,{maximumFractionDigits:3}),s=l=>l==null?"":` (${l>=0?"+":""}${i(l)})`,a=Q(e);return a.length>0?o`<div class="history-readings">
      ${a.map(l=>o`<span class="history-reading">
        <span class="history-reading-name">${l.name}</span>
        <span class="history-reading-value">${i(l.value)}${l.unit?` ${l.unit}`:""}${s(n.readingSlotDelta?.(e,l.id))}</span>
      </span>`)}
    </div>`:e.reading_value!=null?o`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${r("reading_label",t)}</span>
      <span class="history-reading-value">${i(e.reading_value)}${n.readingUnit?` ${n.readingUnit}`:""}${s(n.readingDelta?.(e))}</span>
    </span></div>`:c}function dt(e,n,t={}){let i=n.lang,{compact:s=!1,showRef:a=!0,showBadges:l=!0,showEdit:d=!0}=t,_=n.openEdit,u=d&&!!_&&Ee.includes(e.type);return o`
    <div class="history-entry${s?" compact":""}">
      ${s?c:o`<div class="history-icon ${e.type}">
            <ha-icon .icon=${Z[e.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        <div class="history-row">
          <strong>${r(e.type,i)}</strong>
          ${a?Ft(Zt(n,e),r("ref_number",i)):c}
          ${l&&e.phase_id?o`<span class="history-phase-badge">${n.phaseNames?.[e.phase_id]||e.phase_id}</span>`:c}
          ${l&&e.auto?o`<span class="history-auto-badge">${r("history_auto",i)}</span>`:c}
          ${u?o`<button class="history-edit-btn"
                     title=${r("history_edit_button",i)}
                     @click=${()=>_(e)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:c}
        </div>
        <div class="history-date">${vt(e.timestamp,i)}</div>
        ${e.notes?o`<div>${e.notes}</div>`:c}
        ${He(n.hass,e)}
        ${Se(e,n)}
        ${e.cost!=null||e.duration!=null||e.trigger_value!=null?o`<div class="history-details">
              ${e.cost!=null?o`<span>${r("cost",i)}: ${Y(e.cost,n.currencySymbol,i)}</span>`:c}
              ${e.duration!=null?o`<span>${r("duration",i)}: ${J(e.duration,i)}</span>`:c}
              ${e.trigger_value!=null?o`<span>${r("trigger_val",i)}: ${e.trigger_value}</span>`:c}
            </div>`:c}
      </div>
    </div>
  `}var Pe="var(--maint-done-color, #78909c)";function U(e){return e.archived?"archived":e.is_done?"done":e.status||"ok"}function pt(e,n){return r(e==="done"?"completed":e,n)}function it(e){let n=U(e);return n==="done"?Pe:ht[n]||"var(--disabled-color, #9e9e9e)"}function Re(e){return Z[e==="done"?"completed":e]||"mdi:circle-medium"}function Yt(e,n,t="pill"){let i=U(e),s=pt(i,n);return t==="chip"?o`<span class="status-chip ${i}">${s}</span>`:o`<span class="status-badge ${i}" role="img" title="${s}" aria-label="${s}"><ha-icon icon="${Re(i)}"></ha-icon><span class="status-label">${s}</span></span>`}function m(e){return e.toFixed(1)}function Ui(e,n,t=4){if(!isFinite(e)||!isFinite(n))return{ticks:[],niceMin:0,niceMax:1};if(e===n){let u=Math.abs(e)*.1||1;e-=u,n+=u}let i=n-e,s=Math.pow(10,Math.floor(Math.log10(i/Math.max(1,t)))),a=s;for(let u of[1,2,5,10])if(a=s*u,i/a<=t+.5)break;let l=Math.floor(e/a)*a,d=Math.ceil(n/a)*a,_=[];for(let u=l;u<=d+a*1e-6;u+=a)_.push(Math.abs(u)<a*1e-9?0:u);return{ticks:_,niceMin:l,niceMax:d}}function Gi(e,n){let t=Math.abs(e),i=s=>({maximumFractionDigits:s});return t>=1e6?y(e/1e6,n,i(t>=1e7?0:1))+"M":t>=1e4?y(e/1e3,n,i(0))+"k":t>=1e3?y(e/1e3,n,i(1))+"k":t>=100?y(e,n,i(0)):t>=1?y(e,n,i(1)):t===0?"0":y(e,n,i(2))}function Bi(e,n,t){let i=y(e,t,{maximumFractionDigits:Math.abs(e)>=100?0:1});return n?`${i} ${n}`:i}function Ki(e,n,t){return rt(new Date(e),n,t)}function Zi(e,n){let t=new Date(e);return`${rt(t,n)}, ${yt(t,n)}`}function Yi(e,n){return new Date(e).getFullYear()!==new Date(n).getFullYear()}function Ji(e,n,t){if(t<2||n<=e)return[e,n];let i=[];for(let s=0;s<t;s++)i.push(e+(n-e)*s/(t-1));return i}function Jt(e,n){let t=e.interval_analysis,i=t?.weibull_beta,s=t?.weibull_eta;if(i==null||s==null||s<=0)return c;let a=e.interval_days??0,l=e.suggested_interval??a;return o`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${r("weibull_reliability_curve",n)}
        ${Ie(i,n)}
      </div>
      ${Me(i,s,a,l,n)}
      ${De(t,n)}
      ${t?.confidence_interval_low!=null?Ce(t,e,n):c}
    </div>
  `}function Ie(e,n){let t,i,s;return e<.8?(t="early_failures",i="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",s="beta_early_failures"):e<=1.2?(t="random_failures",i="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",s="beta_random_failures"):e<=3.5?(t="wear_out",i="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",s="beta_wear_out"):(t="highly_predictable",i="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",s="beta_highly_predictable"),o`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${i}"></ha-svg-icon>
      ${r(s,n)} (\u03B2=${y(e,n,2)})
    </span>
  `}function Me(e,n,t,i,s){let x=Math.max(t,i,n,1)*1.3,S=50,P=[];for(let $=0;$<=S;$++){let E=$/S*x,ce=1-Math.exp(-Math.pow(E/n,e)),de=32+E/x*260,pe=136-ce*128;P.push([de,pe])}let G=P.map(([$,E])=>`${m($)},${m(E)}`).join(" "),st="M32,136 "+P.map(([$,E])=>`L${m($)},${m(E)}`).join(" ")+` L${m(P[S][0])},136 Z`,j=32+t/x*260,B=1-Math.exp(-Math.pow(t/n,e)),K=136-B*128,oe=y((1-B)*100,s,0),ut=32+i/x*260,le=[0,.25,.5,.75,1];return o`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${r("chart_weibull",s)}">
        ${le.map($=>{let E=136-$*128;return z`
            <line x1="${32}" y1="${m(E)}" x2="${292}" y2="${m(E)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${$===.5?"4,3":c}" />
            <text x="${28}" y="${m(E+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${y($*100,s,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(x/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(x)}</text>

        <path d="${st}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${G}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?z`
          <line x1="${m(j)}" y1="${8}" x2="${m(j)}" y2="${m(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${m(j)}" cy="${m(K)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${m(j+4)}" y="${m(K-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${oe}%</text>
        `:c}

        ${i>0&&i!==t?z`
          <line x1="${m(ut)}" y1="${8}" x2="${m(ut)}" y2="${m(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:c}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${r("weibull_failure_probability",s)}</span>
      ${t>0?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${r("current_interval_marker",s)}</span>`:c}
      ${i>0&&i!==t?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${r("recommended_marker",s)}</span>`:c}
    </div>
  `}function De(e,n){return o`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${r("characteristic_life",n)}</span>
        <span class="weibull-info-value">${Math.round(e.weibull_eta)} ${r("days",n)}</span>
      </div>
      ${e.weibull_r_squared!=null?o`
        <div class="weibull-info-item">
          <span>${r("weibull_r_squared",n)}</span>
          <span class="weibull-info-value">${y(e.weibull_r_squared,n,3)}</span>
        </div>
      `:c}
    </div>
  `}function Ce(e,n,t){let i=e.confidence_interval_low,s=e.confidence_interval_high,a=n.suggested_interval??n.interval_days??0,l=n.interval_days??0,d=Math.max(0,i-5),u=s+5-d,f=(i-d)/u*100,C=(s-i)/u*100,N=(a-d)/u*100,x=l>0?(l-d)/u*100:-1;return o`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${r("confidence_interval",t)}: ${a} ${r("days",t)} (${i}\u2013${s})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${m(f)}%;width:${m(C)}%"></div>
        ${x>=0?o`<div class="confidence-marker current" style="left:${m(x)}%"></div>`:c}
        <div class="confidence-marker recommended" style="left:${m(N)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${r("confidence_conservative",t)} (${i}${r("days",t).charAt(0)})</span>
        <span class="confidence-text high">${r("confidence_aggressive",t)} (${s}${r("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function Qt(e,n,t){let i=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data",s=e.days_until_threshold!=null,a=e.environmental_factor!=null&&e.environmental_factor!==1;if(!i&&!s&&!a)return c;let l=e.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":e.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return o`
    <div class="prediction-section">
      ${e.sensor_prediction_urgency?o`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${r("sensor_prediction_urgency",n).replace("{days}",String(Math.round(e.days_until_threshold||0)))}
        </div>
      `:c}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${r("sensor_prediction",n)}
      </div>
      <div class="prediction-grid">
        ${i?o`
          <div class="prediction-item">
            <ha-svg-icon path="${l}"></ha-svg-icon>
            <span class="prediction-label">${r("degradation_trend",n)}</span>
            <span class="prediction-value ${e.degradation_trend}">${r("trend_"+e.degradation_trend,n)}</span>
            ${e.degradation_rate!=null?o`<span class="prediction-rate">${e.degradation_rate>0?"+":""}${y(e.degradation_rate,n,Math.abs(e.degradation_rate)>=10?0:1)} ${e.trigger_entity_info?.unit_of_measurement||""}/${r("day_short",n)}</span>`:c}
          </div>
        `:c}
        ${s?o`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${r("days_until_threshold",n)}</span>
            <span class="prediction-value prediction-days${e.days_until_threshold===0?" exceeded":e.sensor_prediction_urgency?" urgent":""}">${e.days_until_threshold===0?r("threshold_exceeded",n):"~"+Math.round(e.days_until_threshold)+" "+r("days",n)}</span>
            ${e.threshold_prediction_date?o`<span class="prediction-date">${V(e.threshold_prediction_date,n)}</span>`:c}
            ${e.threshold_prediction_confidence?o`<span class="confidence-dot ${e.threshold_prediction_confidence}"></span>`:c}
            ${(e.prediction_cycles??0)>0?o`<span class="prediction-cycles">${r("prediction_cycles",n)}: ${e.prediction_cycles}</span>`:c}
          </div>
        `:c}
        ${a&&t.environmental?o`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${r("environmental_adjustment",n)}</span>
            <span class="prediction-value">${y(e.environmental_factor,n,2)}x</span>
            ${e.environmental_entity?o`<span class="prediction-entity entity-link" @click=${d=>$t(d,e.environmental_entity)}>${e.environmental_entity}</span>`:c}
          </div>
        `:c}
      </div>
    </div>
  `}function Xt(e,n,t,i){let s=Math.max(e||1,n);return o`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${r("current",i)}: ${e??"\u2014"} ${e!=null?r("days",i):""}
        </div>
        <div class="interval-visual current"
          style="width: ${e!=null?Math.min(e/s*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${r("recommended",i)}: ${n} ${r("days",i)}
          <span class="confidence-badge ${t}">${r(`confidence_${t}`,i)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(n/s*100,100)}%"></div>
      </div>
    </div>
  `}var te=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function ee(e,n,t){if(!t.seasonal||!e.seasonal_factor||e.seasonal_factor===1)return c;let i=te.map(d=>r(d,n)),s=new Date().getMonth(),a=e.seasonal_factors||e.interval_analysis?.seasonal_factors||null,l=a&&a.length===12?a:i.map((d,_)=>{let u=e.seasonal_factor||1,f=Math.sin((_-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,u+f))});return o`
    <div class="seasonal-card-compact">
      <h4>${r("seasonal_awareness",n)}</h4>
      <div class="seasonal-mini-chart">
        ${l.map((d,_)=>{let u=d*40,f=d<.9?"low":d>1.1?"high":"normal";return o`
            <div class="seasonal-bar ${f} ${_===s?"current":""}"
                 style="height: ${u}px"
                 title="${i[_]}: ${y(d,n,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${r("shorter",n)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${r("normal",n)}</span>
        <span class="legend-item"><span class="dot high"></span> ${r("longer",n)}</span>
      </div>
    </div>
  `}function ie(e,n){return Oe(e,n)}function Oe(e,n){let t=e.seasonal_factors??e.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return c;let i=e.interval_analysis?.seasonal_reason,s=new Date().getMonth(),a=300,l=100,d=8,u=l-d-4,f=Math.max(...t,1.5),C=a/12,N=C*.65,x=d+u-1/f*u;return o`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${r("seasonal_chart_title",n)}
        ${i?o`<span class="source-tag">${i==="learned"?r("seasonal_learned",n):r("seasonal_manual",n)}</span>`:c}
      </div>
      <svg viewBox="0 0 ${a} ${l}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${r("chart_seasonal",n)}">
        <line x1="0" y1="${m(x)}" x2="${a}" y2="${m(x)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((S,P)=>{let G=S/f*u,st=P*C+(C-N)/2,j=d+u-G,B=P===s,K=S<1?"var(--success-color, #4caf50)":S>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return z`
            <rect x="${m(st)}" y="${m(j)}"
              width="${m(N)}" height="${m(G)}"
              fill="${K}" opacity="${B?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${te.map((S,P)=>o`<span class="seasonal-label ${P===s?"active-month":""}">${r(S,n)}</span>`)}
      </div>
    </div>
  `}var g=class extends H{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._toastTimer=new Dt;this._access=tt;this._currencySymbol="";this._loadSeq=0}get _lang(){return w(this.hass)}async openFor(t,i){(t!==this._entryId||i!==this._taskId)&&(this._task=null),this._entryId=t,this._taskId=i,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=At(new Date),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let t=await M(this.hass);this._features={...this._features,...t.features},this._access=t.access,this._currencySymbol=F(t.budget??void 0),ft(t.budget??void 0)}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(t,i){this._toast=t,this._toastTimer.schedule(()=>{this._toast=""},i)}async _loadTask(){let t=this._entryId,i=this._taskId;if(!t||!i)return;let s=++this._loadSeq;try{let a=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:t});if(s!==this._loadSeq)return;this._objectName=a.object?.name||"";let l=(a.tasks||[]).find(d=>d.id===i);this._task=l??null,this._taskRef=Nt(a.object,l),l||(this._error=r("ws_err_not_found",this._lang))}catch(a){if(s!==this._loadSeq)return;this._error=T(a,this._lang)}}async _runWs(t){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(t),this._busy=!1,!0}catch(i){return this._error=T(i,this._lang),this._busy=!1,!1}}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-V77A2R7C.js").then(async({openCompleteDialog:t})=>{let i=this._task,s=[];try{s=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}t(jt({entryId:this._entryId,taskId:this._taskId,taskName:i.name,task:i,objects:s,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol}))&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-V77A2R7C.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-V77A2R7C.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId||!await O(this.hass,{title:r("delete",this._lang),message:r("delete_task_confirm",this._lang),confirmText:r("delete",this._lang),danger:!0}))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})&&(this._showToast(r("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!(!this._entryId||!this._taskId)){this._busy=!0,this._error="";try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});this._showToast(t.recommended_interval?`${r("reanalyze_result",this._lang)}: ${bt(t.recommended_interval,"days",this._lang)} (${t.data_points} pts)`:r("reanalyze_insufficient_data",this._lang)),await this._loadTask()}catch(t){this._error=T(t,this._lang)}finally{this._busy=!1}}}_onEditHistoryEntry(t){if(!this._entryId||!this._taskId)return;let i=ot(this._entryId,this._taskId,t,this._task);import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-V77A2R7C.js").then(({openHistoryEditDialog:s})=>s(i))}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return c;let i=this._lang;return o`
      <div class="recommendation-card">
        <h4>${r("suggested_interval",i)}</h4>
        ${Xt(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",i)}
        <div class="recommendation-actions">
          ${q(this.hass?.user,this._access)?o`<button class="btn primary qa-apply-suggestion"
                @click=${this._applySuggestion} ?disabled=${this._busy}>
                <ha-icon icon="mdi:check"></ha-icon>
                ${r("apply_suggestion",i)}
              </button>`:c}
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${r("reanalyze",i)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(t){let i=this._lang,s=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,a=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,l=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,d=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!s&&!a&&!l&&!d?o`<div class="adaptive-empty">
        ${r("adaptive_no_data",i)}
      </div>`:o`
      <div class="adaptive-stack">
        ${this._toast?o`<div class="toast">${this._toast}</div>`:c}
        ${s?this._renderRecommendation(t):c}
        ${a?Qt(t,i,this._features):c}
        ${l?Jt(t,i):c}
        ${d?o`
          ${ee(t,i,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?ie(t,i):c}
        `:c}
      </div>
    `}_renderDetails(t){let i=this._lang,s=t.history||[],a=t.history_count??s.length,l=ct(s).slice(0,20);return o`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${r("times_performed",i)}</span>
            <span class="stat-value">${t.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${r("total_cost",i)}</span>
            <span class="stat-value">${Y(t.total_cost??0,this._currencySymbol,i)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${r("avg_duration",i)}</span>
            <span class="stat-value">${J(t.average_duration!=null?Math.round(t.average_duration):null,i)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${r("history",i)}</strong>
          <span class="history-count">${a}</span>
        </div>
        ${s.length===0?o`<div class="history-empty">${r("history_empty",i)}</div>`:o`
              <div class="history-list">
                ${l.map(d=>dt(d,{lang:i,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:q(this.hass?.user,this._access)?_=>this._onEditHistoryEntry(_):void 0,readingUnit:t.reading_unit,readingSlotDelta:(_,u)=>St(s,_,u),taskRef:this._taskRef},{compact:!0}))}
                ${a>l.length?o`<div class="history-more">… +${a-l.length} ${r("older_entries",i)}</div>`:c}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return c;let t=this._lang,i=this._task,s=q(this.hass?.user,this._access);return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${i?o`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${it(i)}"></span>
                  <span class="task-name">${i.name}</span>
                  ${Yt(i,t)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-V77A2R7C.js").then(({openObjectQuickActions:a})=>{a(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${i.next_due?o`<span><strong>${r("next_due",t)}:</strong> ${V(i.next_due,t)}</span>`:c}
                  ${i.last_performed?o`<span><strong>${r("last_performed",t)}:</strong> ${V(i.last_performed,t)}</span>`:c}
                  ${i.schedule?.kind&&!["manual","one_time"].includes(i.schedule.kind)||i.interval_days!=null?o`<span><strong>${r("interval",t)}:</strong> ${xt(i,t)}</span>`:c}
                  ${W(i)?o`<span><strong>${r("phase_current",t)}:</strong> ${W(i)}</span>`:c}
                </div>
              </div>

              ${this._error?o`<div class="error">${this._error}</div>`:c}

              ${this._showSkip?o`
                    <div class="inline-form">
                      <label>${r("skip_reason",t)}</label>
                      <input type="text" .value=${this._skipReason}
                        @input=${a=>{this._skipReason=a.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${r("cancel",t)}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${r("skip",t)}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?o`
                    <div class="inline-form">
                      <label>${r("reset_to_date",t)}</label>
                      <ms-date-field
                        kind="date"
                        .hass=${this.hass}
                        .lang=${t}
                        .value=${this._resetDate}
                        @value-changed=${a=>{this._resetDate=a.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${r("cancel",t)}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${r("reset",t)}
                        </button>
                      </div>
                    </div>
                  `:o`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${this._onComplete} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${r("complete",t)}
                      </ha-button>
                      ${i.allow_skip!==!1?o`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${r("skip",t)}
                            </ha-button>
                          `:c}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${r("reset",t)}
                      </ha-button>
                    </div>
                    <!-- QR is read tier (the panel offers it to operators too);
                         Edit / Archive / Delete follow canWrite() — the panel's
                         operator delegation, not is_admin alone. -->
                    <div class="actions secondary-row">
                      ${s?o`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-edit" @click=${this._onEdit} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                            ${r("edit",t)}
                          </ha-button>`:c}
                      <ha-button size="small" appearance="outlined" variant="neutral" class="qa-qr" @click=${this._onQr} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                        ${r("qr_code",t)}
                      </ha-button>
                      ${s?o`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-archive"
                            @click=${i.archived?this._onUnarchive:this._onArchive}
                            .disabled=${this._busy}>
                            <ha-icon slot="start" icon="${i.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                            ${i.archived?r("unarchive",t):r("archive",t)}
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="danger" class="danger qa-delete" @click=${this._onDelete} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                            ${r("delete",t)}
                          </ha-button>`:c}
                    </div>
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?r("hide_details",t):r("show_details",t)}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?o`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?r("hide_stats",t):r("show_stats",t)}
                          </button>`:c}
                    </div>
                    ${this._showDetails?this._renderDetails(i):c}
                    ${this._showAdaptive?this._renderAdaptive(i):c}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${r("open_in_panel",t)}
                      </button>
                    </div>
                  `}
            `:this._error?o`<div class="error">${this._error}</div>`:o`<div class="loading">${r("loading",t)}</div>`}
      </div>
    `}};g.styles=[wt,L`
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
  `],p([k({attribute:!1})],g.prototype,"hass",2),p([h()],g.prototype,"_open",2),p([h()],g.prototype,"_entryId",2),p([h()],g.prototype,"_taskId",2),p([h()],g.prototype,"_task",2),p([h()],g.prototype,"_objectName",2),p([h()],g.prototype,"_taskRef",2),p([h()],g.prototype,"_busy",2),p([h()],g.prototype,"_error",2),p([h()],g.prototype,"_showSkip",2),p([h()],g.prototype,"_showReset",2),p([h()],g.prototype,"_showDetails",2),p([h()],g.prototype,"_showAdaptive",2),p([h()],g.prototype,"_skipReason",2),p([h()],g.prototype,"_resetDate",2),p([h()],g.prototype,"_features",2),p([h()],g.prototype,"_toast",2),p([h()],g.prototype,"_access",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",g);function ne(e){return!!e&&/^https?:\/\//i.test(e)}function se(e){return e?customElements.get("ha-markdown")?o`<ha-markdown class="notes-md" .content=${e} breaks></ha-markdown>`:o`${e}`:c}var A=class extends H{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=tt}get _lang(){return w(this.hass)}async openFor(t){this._entryId=t,this._error="",this._open=!0,await Promise.all([this._load(),M(this.hass).then(i=>{this._access=i.access})])}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._data=t}catch(t){this._error=T(t,this._lang)}}_onEditObject(){!this._entryId||!this._data||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-V77A2R7C.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-V77A2R7C.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!(!this._entryId||!this._data||!await O(this.hass,{title:r("delete",this._lang),message:r("delete_object_confirm",this._lang),confirmText:r("delete",this._lang),danger:!0}))){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(i){this._error=T(i,this._lang)}finally{this._busy=!1}}}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!(!t&&!await O(this.hass,{title:r("archive_object",this._lang),message:r("confirm_archive_object",this._lang),confirmText:r("archive_object",this._lang)}))){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(i){this._error=T(i,this._lang)}finally{this._busy=!1}}}_onTaskClick(t){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-V77A2R7C.js").then(({openTaskQuickActions:i})=>{i(this._entryId,t)})}render(){if(!this._open)return c;let t=this._lang,i=this._data,s=i?.object,a=i?.tasks||[],l=q(this.hass?.user,this._access);return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${i&&s?o`
              <div class="header">
                <div class="title">${s.name}</div>
                ${this._renderMetaRow(s)}
              </div>

              ${this._error?o`<div class="error">${this._error}</div>`:c}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${r("tasks",t)}</strong>
                  <span class="count">${a.length}</span>
                </div>
                ${a.length===0?o`<div class="empty">${r("no_tasks",t)}</div>`:o`
                      <div class="task-list">
                        ${a.map(d=>o`
                          <div class="task-row" @click=${()=>this._onTaskClick(d.id)}>
                            <span class="status-dot" style="background: ${it(d)}"></span>
                            <span class="task-name">${d.name}</span>
                            <span class="task-status ${U(d)}">${pt(U(d),t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${s.notes?o`
                    <div class="notes-section">
                      <strong>${r("object_notes_label",t)}</strong>
                      <div class="notes-body">${se(s.notes)}</div>
                    </div>
                  `:c}

              ${l?o`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${r("add_task",t)}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${r("edit",t)}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${s.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${s.archived?r("unarchive_object",t):r("archive_object",t)}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${r("delete",t)}
                      </button>
                    </div>
                  `:c}
            `:o`<div class="loading">${r("loading",t)}</div>`}
      </div>
    `}_renderMetaRow(t){let i=this._lang,s=[];return t.area_id&&s.push([r("area",i),t.area_id]),t.manufacturer&&s.push([r("manufacturer",i),t.manufacturer]),t.model&&s.push([r("model",i),t.model]),t.serial_number&&s.push([r("serial_number_label",i),t.serial_number]),t.installation_date&&s.push([r("installed",i),t.installation_date]),t.warranty_expiry&&s.push([r("warranty",i),t.warranty_expiry]),t.documentation_url&&s.push([r("documentation_url_label",i),t.documentation_url]),s.length===0?c:o`
      <div class="meta">
        ${s.map(([a,l])=>o`
            <div class="meta-item">
              <span class="meta-label">${a}</span>
              <span class="meta-value">${ne(l)?o`<a href="${l}" target="_blank" rel="noopener noreferrer">${l}</a>`:l}</span>
            </div>
          `)}
      </div>
    `}};A.styles=L`
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
  `,p([k({attribute:!1})],A.prototype,"hass",2),p([h()],A.prototype,"_open",2),p([h()],A.prototype,"_entryId",2),p([h()],A.prototype,"_data",2),p([h()],A.prototype,"_busy",2),p([h()],A.prototype,"_error",2),p([h()],A.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",A);var re="maintenance-object-dialog",ae="maintenance-task-dialog",je="maintenance-history-edit-dialog",ze="maintenance-complete-dialog",qe="maintenance-qr-dialog",Ne="maintenance-task-quick-actions-dialog",Fe="maintenance-object-quick-actions-dialog";function nt(){return document.querySelector("home-assistant")?.hass}function Ve(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function R(e){let n=Ve(),t=n.querySelector(e)??document.body.querySelector(e);return t?t.parentNode!==n&&n.appendChild(t):(t=document.createElement(e),n.appendChild(t)),t}function I(e){let n=nt();if(!n)return!1;e.hass=n;let t=w(n);return _t(t)||mt(t).then(()=>{e.requestUpdate?.()}),gt(n.locale,n.config?.country),!0}function ls(e){return M(e).then(n=>n.rowActionStyle)}function cs(){Rt()}function ds(){let e=R(re);return I(e)?(e.openCreate(),!0):!1}function ps(e,n){let t=R(re);return I(t)?(t.openEdit(e,n),!0):!1}function us(e="",n){let t=R(ae);if(!I(t))return!1;let i=nt();return i?((async()=>{let s=await M(i),a=t;a.checklistsEnabled=s.features.checklists,a.scheduleTimeEnabled=s.features.schedule_time,a.completionActionsEnabled=s.features.completion_actions,a.defaultWarningDays=s.defaultWarningDays,a.openCreate(e,n)})(),!0):!1}function hs(e,n){let t=R(ae);if(!I(t))return!1;let i=nt();return i?((async()=>{try{let[s,a]=await Promise.all([i.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e}),M(i)]),l=(s.tasks||[]).find(_=>_.id===n);if(!l){console.warn(`openEditTaskDialog: task ${n} not found in entry ${e}`);return}let d=t;d.checklistsEnabled=a.features.checklists,d.scheduleTimeEnabled=a.features.schedule_time,d.completionActionsEnabled=a.features.completion_actions,d.defaultWarningDays=a.defaultWarningDays,await d.openEdit(e,l)}catch(s){console.warn("openEditTaskDialog: failed to load task/features",s)}})(),!0):!1}function _s(e){let n=R(je);return I(n)?(n.openEdit(e),!0):!1}function ms(e){let n=R(ze);return I(n)?(zt(n,e,w(nt())),!0):!1}function fs(e){let n=R(qe);return I(n)?(n.openForTask(e.entry_id,e.task_id,e.object_name,e.task_name),!0):!1}function gs(e,n){let t=R(Ne);return I(t)?(t.openFor(e,n),!0):!1}function ys(e){let n=R(Fe);return I(n)?(n.openFor(e),!0):!1}export{ne as a,ke as b,Ae as c,fe as d,Nt as e,Ei as f,Ft as g,se as h,he as i,_e as j,at as k,jt as l,zt as m,m as n,Ui as o,Gi as p,Bi as q,Ki as r,Zi as s,Yi as t,Ji as u,ot as v,wi as w,ct as x,Oi as y,ji as z,dt as A,Yt as B,Jt as C,Qt as D,Xt as E,ee as F,ie as G,ls as H,cs as I,ds as J,ps as K,us as L,hs as M,_s as N,ms as O,fs as P,gs as Q,ys as R};
