/*! maintenance_supporter frontend 2.94.0 */
import{b as Ht,g as it,h as z,k as M,l as jt,m as zt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-P3JMRZOA.js";import{e as Ot,f as qt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-M4NLXHG2.js";import{b as Pt,h as nt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YDYHEVPN.js";import{b as It,c as Mt,e as et,f as Ct,h as Dt,k as Nt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-DFBDDN3E.js";import{i as dt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-63C4ZGBD.js";import{a as I}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-NICOFLCG.js";import{A as kt,B as y,C as X,E as wt,F as O,G as Tt,I as Et,J as tt,O as lt,P as At,Q as Lt,R as St,T as Rt,a as p,b as $,c as l,d as q,f as c,h as L,l as w,m,n as vt,q as Q,s,t as bt,u as xt,w as G,y as T,z as $t}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-TPDK7AUT.js";var F=$`
  .backdrop {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,0.5);
  }
  .dialog {
    position: fixed; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 95vw; max-width: var(--ms-modal-max-width, 480px);
    max-height: var(--ms-modal-max-height, 92vh); overflow: auto;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    color: var(--primary-text-color);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    padding: 20px;
    display: flex; flex-direction: column; gap: var(--ms-modal-gap, 14px);
    z-index: 101;
  }
  /* Focused programmatically on open (so Escape works at once) — no ring. */
  .dialog:focus { outline: none; }
`;function ge(e,i){e.key!=="Escape"||e.defaultPrevented||e.composedPath().some(t=>t instanceof Element&&t.localName==="ms-camera-capture")||(e.preventDefault(),e.stopPropagation(),i())}function W(e,i){return l`
    <div class="backdrop" @click=${e}></div>
    <div class="dialog" role="dialog" aria-modal="true" tabindex="-1"
      @keydown=${t=>ge(t,e)}>${i}</div>
  `}function V(e){e?.querySelector(".dialog")?.focus({preventScroll:!0})}var v=class extends L{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._options=null;this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel="",this._inputType="",this._options=null,this._inputValue="",this._open=!0,new Promise(n=>{this._resolve=n,this._promptResolve=null})}prompt(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel=t.inputLabel||"",this._inputType=t.inputType||"text",this._options=t.options&&t.options.length?t.options:null,this._inputValue=t.inputValue||"",this._open=!0,new Promise(n=>{this._promptResolve=n,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return c;let t=T(this.hass);return l`
      <ha-dialog open @closed=${this._cancel}>
        <div class="dialog-title">${this._title}</div>
        <div class="content">
          ${this._message}
          ${this._inputLabel?l`
            <!-- Native <input> rather than <ha-textfield>: HA loads
                 ha-textfield lazily for its own panels, so inside this custom
                 panel it can be unregistered and render with zero height —
                 the prompt then shows no field at all (caught live testing
                 the pause/replace prompts; same fix as complete-dialog). -->
            <label class="field">
              <span class="field-label">${this._inputLabel}</span>
              ${this._options?l`<select class="field-input field-select"
                    @change=${n=>this._inputValue=n.target.value}>
                    ${this._options.map(n=>l`<option value=${n.value} ?selected=${n.value===this._inputValue}>${n.label}</option>`)}
                  </select>`:l`<input class="field-input"
                    type="${this._inputType||"text"}"
                    .value=${this._inputValue}
                    @input=${n=>this._inputValue=n.target.value} />`}
            </label>
          `:c}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._cancel}>
            ${s("cancel",t)}
          </ha-button>
          <ha-button
            class="${this._danger?"danger":""}"
            @click=${this._confirmAction}
          >
            ${this._confirmText}
          </ha-button>
        </div>
      </ha-dialog>
    `}};v.styles=[St,$`
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
  `],p([w({attribute:!1})],v.prototype,"hass",2),p([m()],v.prototype,"_open",2),p([m()],v.prototype,"_title",2),p([m()],v.prototype,"_message",2),p([m()],v.prototype,"_confirmText",2),p([m()],v.prototype,"_danger",2),p([m()],v.prototype,"_inputLabel",2),p([m()],v.prototype,"_inputType",2),p([m()],v.prototype,"_options",2),p([m()],v.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",v);var Ft="maintenance-confirm-dialog",Wt="data-ms-lovelace-confirm";function ye(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function j(e,i){let t=ye(),n=t.querySelector(`${Ft}[${Wt}]`);return n||(n=document.createElement(Ft),n.setAttribute(Wt,""),t.appendChild(n)),n.hass=e,n.confirm(i)}var C=class extends L{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await Ht(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?c:this._url?l`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:l`<div class="ph"></div>`}};C.styles=$`
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
  `,p([w({attribute:!1})],C.prototype,"hass",2),p([w()],C.prototype,"docId",2),p([m()],C.prototype,"_url",2),p([m()],C.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",C);var b=class extends L{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._openGen=0;this._photos=new qt(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return T(this.hass)}openEdit(t){this._openGen++,this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(t.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(t),this._loadPartOptions()}_seedReadings(t){let n=[],r=new Set;for(let o of t.readings??[])r.has(o.id)||(r.add(o.id),n.push({id:o.id,name:o.name,unit:o.unit??null}));for(let o of t.reading_values??[])r.has(o.id)||(r.add(o.id),n.push({id:o.id,name:o.name,unit:o.unit??null}));this._readingRows=n;let a={};for(let o of t.reading_values??[])a[o.id]=String(o.value);this._readingText=a,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let t={};for(let n of this._readingRows){let r=(this._readingText[n.id]??"").trim();if(r==="")continue;let a=parseFloat(r.replace(",","."));isNaN(a)||(t[n.id]=a)}return t}async _loadPartOptions(){let t=this._draft;if(!t)return;let n=this._openGen;try{let r=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});if(n!==this._openGen)return;let a=[];for(let d of r.parts||[]){let u=d.entry_id===t.entry_id,h=d.consumers.some(f=>f.entry_id===t.entry_id&&f.task_id===t.task_id);!u&&!h||a.push({part_id:d.part_id,name:d.name,entry_id:d.entry_id,foreign:!u,object_name:d.object_name})}for(let d of t.used_parts||[]){let u=d.entry_id||t.entry_id;a.some(h=>h.part_id===d.part_id&&h.entry_id===u)||a.push({part_id:d.part_id,name:d.name||d.part_id,entry_id:u,foreign:u!==t.entry_id,object_name:null})}let o={};for(let d of t.used_parts||[])o[`${d.entry_id||t.entry_id}:${d.part_id}`]=d.quantity??1;this._partOptions=a,this._partQty=o,this._partQtyOriginal=this._partSelectionKey()}catch{if(n!==this._openGen)return;this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,t])=>t>0).sort(([t],[n])=>t.localeCompare(n)))}close(){this._openGen++,this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(t,n){this._draft&&(this._draft={...this._draft,[t]:n})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let t=this._lang;if(!await j(this.hass,{title:s("history_delete_entry",t),message:s("history_delete_confirm",t),confirmText:s("delete",t),danger:!0})||!this._draft||!this._originalSnapshot)return;let r=this._draft;this._error="",await this._runWs({type:"maintenance_supporter/task/history/delete",entry_id:r.entry_id,task_id:r.task_id,timestamp:this._originalSnapshot.original_timestamp})!==void 0&&(this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:r.entry_id,task_id:r.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close())}_runWs(t){return I(this,t,{busy:n=>{this._saving=n},onError:n=>{this._error=n}})}async _save(){if(!this._draft||!this._originalSnapshot||this._saving||this._photos.uploading)return;this._error="",this._photos.clearError();let t=this._draft,n=this._originalSnapshot,r={type:"maintenance_supporter/task/history/update",entry_id:t.entry_id,task_id:t.task_id,original_timestamp:n.original_timestamp};if(t.timestamp!==n.timestamp&&(r.timestamp=t.timestamp),t.notes!==n.notes&&(r.notes=t.notes),t.cost!==n.cost&&(r.cost=t.cost),t.duration!==n.duration&&(r.duration=t.duration),t.completed_by!==n.completed_by&&(r.completed_by=t.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(r.used_parts=(this._partOptions||[]).filter(o=>(this._partQty[`${o.entry_id}:${o.part_id}`]||0)>0).map(o=>({part_id:o.part_id,quantity:this._partQty[`${o.entry_id}:${o.part_id}`],...o.foreign?{entry_id:o.entry_id}:{}}))),t.reading_value!==n.reading_value&&(r.reading_value=t.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let o=this._readingNumbers(),d={};for(let u of this._readingRows)d[u.id]=o[u.id]??null;r.reading_values=d}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(r.photo_doc_ids=this._photos.ids),Object.keys(r).filter(o=>!["type","entry_id","task_id","original_timestamp"].includes(o)).length===0){this.close();return}await this._runWs(r)!==void 0&&(this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:t.entry_id,task_id:t.task_id,new_timestamp:t.timestamp},bubbles:!0,composed:!0})),this.close())}render(){if(!this._open||!this._draft)return c;let t=this._lang,n=this._draft,r=this._error||this._photos.errorText(t);return W(()=>this.close(),l`
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
            <input type="number" min="0" step="1" inputmode="numeric"
              .value=${n.duration!=null?String(n.duration):""}
              @input=${a=>{this._set("duration",Nt(a.target.value))}} />
          </label>
        </div>
        ${this._renderReadings(n,t)}
        ${this._partOptions&&this._partOptions.length>0?l`
          <div class="parts-block">
            <span class="parts-title">${s("complete_parts_used",t)}</span>
            ${this._partOptions.map(a=>{let o=`${a.entry_id}:${a.part_id}`,d=this._partQty[o]||0;return l`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${d>0}
                    @change=${u=>{let h=u.target.checked;this._partQty={...this._partQty,[o]:h?1:0}}} />
                  <span class="part-label">${a.name}${a.foreign&&a.object_name?` (${a.object_name})`:""}</span>
                  ${d>0?l`
                    <input class="part-qty" type="number" min=${dt[0]} max=${dt[1]} step="0.01"
                      .value=${String(d)}
                      @input=${u=>{let h=parseFloat(u.target.value);!isNaN(h)&&h>0&&(this._partQty={...this._partQty,[o]:h})}} />
                  `:c}
                </label>
              `})}
          </div>
        `:c}
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
            </div>`:c}
          ${this._photos.full?l`<span class="photos-hint">${s("photos_limit",t).replace("{max}",String(this._photos.max))}</span>`:l`<ms-photo-picker .lang=${t} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${a=>this._photos.addFiles(a.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${s("history_edit_photos_hint",t)}</span>
        </div>
        ${r?l`<div class="error">${r}</div>`:c}
        <div class="actions">
          <button class="delete-entry" @click=${this._delete} ?disabled=${this._saving} title=${s("history_delete_entry",t)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon> ${s("history_delete_entry",t)}
          </button>
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${s("cancel",t)}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving||this._photos.uploading}
            title=${this._photos.uploading?s("uploading",t):""}>
            ${this._saving?s("saving",t):s("save",t)}
          </button>
        </div>
    `)}updated(t){t.has("_open")&&this._open&&V(this.shadowRoot)}_renderReadings(t,n){return this._readingRows.length>0?l`
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
        </div>`:t.reading_value==null&&t.task_type!=="reading"?c:l`
      <label>
        <span>${s("reading_value_label",n)}${t.reading_unit?` (${t.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${t.reading_value!=null?String(t.reading_value):""}
          @input=${r=>{let a=r.target.value,o=a===""?NaN:Number(a);this._set("reading_value",isNaN(o)?null:o)}} />
      </label>`}};b.styles=[Ot,F,$`
    :host { display: contents; --ms-modal-max-height: 90vh; --ms-modal-gap: 12px; }
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
  `],p([w({attribute:!1})],b.prototype,"hass",2),p([m()],b.prototype,"_open",2),p([m()],b.prototype,"_saving",2),p([m()],b.prototype,"_error",2),p([m()],b.prototype,"_draft",2),p([m()],b.prototype,"_partOptions",2),p([m()],b.prototype,"_partQty",2),p([m()],b.prototype,"_readingRows",2),p([m()],b.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",b);function ve(e,i){if(i<=0)return 0;let t=typeof e=="number"&&Number.isFinite(e)?Math.trunc(e):0;return t<0?0:t%i}function be(e){return!!(e?.phases&&e.phase_sequence&&e.phase_sequence.length>0)}function ct(e){if(!e||!be(e))return null;let i=e.phase_sequence,t=ve(e.phase_cursor,i.length),n=i[t],r=e.phases?.[n];return r?{id:n,name:r.name,index:t,count:i.length,notes:r.notes,checklist:r.checklist!==void 0?r.checklist:e.checklist??[],consumesParts:r.consumes_parts!==void 0?r.consumes_parts:e.consumes_parts??[],requiredFields:r.required_completion_fields!==void 0?r.required_completion_fields:e.required_completion_fields??[]}:null}function B(e){let i=ct(e);return i?`${i.index+1}/${i.count} \xB7 ${i.name}`:""}function xe(e,i){return typeof e=="number"&&Number.isFinite(e)&&e>=.01?e:i}function Vt(e){let i=e.task??null,t=i?ct(i):null,n=t?t.consumesParts:i?.consumes_parts||[],r=!!i?.part_ref,a=e.objects.find(f=>f.entry_id===e.entryId)?.parts||[],o=r?a.find(f=>f.id===i.part_ref.part_id):void 0,d=e.features?e.features.checklists:e.checklistsEnabled??!0,u=e.features?e.features.checklists?e.checklist??i?.checklist??[]:[]:e.checklist??[],h=e.features?e.features.adaptive&&(e.adaptiveEnabled??!!i?.adaptive_config?.enabled):!!e.adaptiveEnabled;return{entry_id:e.entryId,task_id:e.taskId,task_name:e.taskName,checklist:t?d?t.checklist:[]:u,adaptive_enabled:h,required_completion_fields:t?t.requiredFields:i?.required_completion_fields||[],task_type:i?.type||"",reading_unit:i?.reading_unit||"",readings:i?.readings||[],reading_history:Ct(i?.history),parts:r?[]:Mt({consumes_parts:n},e.entryId,e.objects,e.lang),consumes_parts:r?[]:n,phase_label:t?B(i):"",require_tag_scan:!!i?.require_tag_scan,restock_default:r?xe(o?.restock_quantity,1):null,restock_unit_cost:r?o?.cost??null:null,currency_symbol:G({currency_symbol:e.currencySymbol}),consumes_info:n.map(f=>It(f,e.entryId,e.objects,e.lang)),checklist_prefill:i?.checklist_progress||{},via_tag_scan:!!e.viaTagScan}}function Ut(e,i,t){e.entryId=i.entry_id,e.taskId=i.task_id,e.taskName=i.task_name,e.lang=t,e.checklist=i.checklist??[],e.adaptiveEnabled=!!i.adaptive_enabled,e.requiredFields=i.required_completion_fields??[],e.taskType=i.task_type??"",e.readingUnit=i.reading_unit??"",e.readings=i.readings??[],e.readingHistory=i.reading_history??[],e.parts=i.parts??[],e.consumesParts=i.consumes_parts??[],e.phaseLabel=i.phase_label??"",e.requireTagScan=!!i.require_tag_scan,e.restockDefault=i.restock_default??null,e.restockUnitCost=i.restock_unit_cost??null,e.currencySymbol=G(i),e.consumesInfo=i.consumes_info??[],e.checklistPrefill=i.checklist_prefill??{},e.viaTagScan=!!i.via_tag_scan,e.open({viaTagScan:!!i.via_tag_scan})}function pt(e,i,t,n){let r=t,a=u=>typeof u=="string"?u:null,o=u=>typeof u=="number"?u:null,d=a(r.timestamp)??"";return{entry_id:e,task_id:i,original_timestamp:d,type:a(r.type)||"completed",timestamp:d,notes:a(r.notes),cost:o(r.cost),duration:o(r.duration),completed_by:a(r.completed_by),used_parts:Array.isArray(r.used_parts)?r.used_parts:null,photo_doc_ids:nt(r),reading_value:o(r.reading_value),reading_values:et(r),readings:n?.readings??[],task_type:n?.type??null,reading_unit:n?.reading_unit??null}}async function On(e,i,t,n){let a=(await e.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:i})).tasks?.find(d=>d.id===t);if(!a)return null;let o=a.history?.find(d=>d.timestamp===n);return o||(o=(await e.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:i,task_id:t})).history?.find(u=>u.timestamp===n)),o?pt(i,t,o,a):null}var Gt=e=>typeof e=="number"&&Number.isInteger(e)&&e>0;function $e(e){return e&&Gt(e.ref_no)?String(e.ref_no):null}function Bt(e,i){let t=$e(e);return t&&i&&Gt(i.ref_no)?`${t}.${i.ref_no}`:null}function qn(e){let i=/^(\d+)(?:\.(\d+)(?:-(\d+))?)?$/.exec(e.trim());return i?{object:Number(i[1]),task:i[2]?Number(i[2]):null,entry:i[3]?Number(i[3]):null}:null}function Kt(e,i){return e?l`<span class="ref-chip" title=${i??""}>#${e}</span>`:c}var ke={\u00DF:"s","\u1E9E":"s",\u00E6:"a",\u0153:"o",\u00F8:"o",\u0111:"d",\u00F0:"d",\u00FE:"t",\u0142:"l",\u0131:"i"},Jt=10,we=7,ut=4,Zt=2,Te=5,Qt=3,Ee=/[a-z0-9]+/g;function rt(e){let i="";for(let t of e.toLowerCase()){if(t.charCodeAt(0)<128&&t.length===1){i+=t;continue}let n=ke[t];if(n){i+=n;continue}let r=t.normalize("NFKD")[0]||t;i+=r.charCodeAt(0)<128?r:t}return i}function Xt(e){return rt(e).match(Ee)||[]}function Ae(e){return rt(e).replace(/[^a-z0-9]+/g,"")}function Le(e){return e.replace(/ue/g,"u").replace(/oe/g,"o").replace(/ae/g,"a").replace(/ss/g,"s")}function Se(e){let i=[];for(let t of Xt(e)){let n=[t],r=Le(t);r&&r!==t&&n.push(r),i.push(n)}return i}function Yt(e,i){if(e===i)return!0;let t=e.length,n=i.length;if(Math.abs(t-n)>1)return!1;if(t===n){let h=[];for(let f=0;f<t;f++)e[f]!==i[f]&&h.push(f);if(h.length===1)return!0;if(h.length===2&&h[1]===h[0]+1){let f=h[0];return e[f]===i[f+1]&&e[f+1]===i[f]}return!1}let[r,a]=t>n?[e,i]:[i,e],o=0,d=0,u=!1;for(;o<r.length&&d<a.length;)if(r[o]===a[d])o++,d++;else{if(u)return!1;u=!0,o++}return!0}function Re(e,i){let t=0;for(let n of e)if(n){if(i===n)return Jt;if(i.startsWith(n)){t=Math.max(t,we);continue}if(n.length>=Qt&&i.includes(n)){t=Math.max(t,ut);continue}n.length>=Te&&t<Zt&&(Yt(n,i)||i.length>n.length&&Yt(n,i.slice(0,n.length)))&&(t=Zt)}return t}function He(e,i){let t=0;for(let n of Xt(i))if(t=Math.max(t,Re(e,n)),t===Jt)return t;if(t<ut){let n=Ae(i);for(let r of e)if(r.length>=Qt&&n.includes(r))return ut}return t}function ht(e,i){if(!e)return!1;let t=Se(i);if(!t.length){let n=rt(i.trim());return n.length>0&&rt(e).includes(n)}return Pe(t,[{text:e,weight:1}])>0}function Pe(e,i){if(!e.length)return 0;let t=i.filter(r=>r.text),n=0;for(let r of e){let a=0;for(let o of t){let d=He(r,o.text)*o.weight;d>a&&(a=d)}if(a===0)return 0;n+=a}return n}var Ie={"Completed from dashboard button":"hist_note_button","Completed from the To-do list":"hist_note_todo","Completed by voice":"hist_note_voice","Completed from the notification":"hist_note_notification","Completed via NFC tag":"hist_note_nfc","Completed from the shopping list":"hist_note_shopping_list","Completed from a mirrored to-do list":"hist_note_todo_mirror","Skipped from notification":"hist_note_skipped_notification","Skipped from dashboard button":"hist_note_skipped_button","Sensor trigger activated":"hist_note_sensor_triggered","Initial value set during task creation":"hist_note_initial"},Me=[[/^Auto-completed: sensor recovered \((.+)\)$/,"hist_note_auto_recovered",e=>({value:e[1]})],[/^Reset to (\d{4}-\d{2}-\d{2})$/,"hist_note_reset",(e,i)=>({date:O(e[1],i)})],[/^Trigger entity replaced: (.+) → (.+)$/,"hist_note_trigger_replaced",e=>({old:e[1],new:e[2]})],[/^Sensor trigger removed \(entity was: (.+)\)\. Schedule converted to (\w+)\.$/,"hist_note_trigger_removed",(e,i)=>({entity:e[1],schedule:s(e[2],i)})],[/^Entity (.+) removed from compound trigger; (\d+) conditions remain\.$/,"hist_note_compound_removed",e=>({entity:e[1],count:e[2]})]];function mt(e,i){if(!e)return"";let t=Ie[e.trim()];if(t)return s(t,i);for(let[n,r,a]of Me){let o=e.trim().match(n);if(o){let d=a(o,i);return s(r,i).replace(/\{(\w+)\}/g,(u,h)=>d[h]??u)}}return e}var Ce=["completed","reset","skipped"];function _t(e){let i=t=>{let n=t.timestamp??"",r=Date.parse(n.length===10?`${n}T00:00:00`:n);return Number.isNaN(r)?-1/0:r};return(e??[]).map((t,n)=>({entry:t,index:n,at:i(t)})).sort((t,n)=>n.at-t.at||n.index-t.index).map(t=>t.entry)}var De=["completed","skipped","missed","reset","triggered","trigger_replaced","trigger_removed"];function Xn(e,i){let t=i.lang;return l`
    <div class="history-filters-new">
      <div class="filter-chips">
        ${De.map(n=>{let r=e.history.filter(a=>a.type===n).length;return r===0?c:l`
            <span class="filter-chip ${i.filter===n?"active":""}"
              @click=${()=>i.setFilter(i.filter===n?null:n)}>
              ${s(n,t)} (${r})
            </span>
          `})}
        ${i.filter?l`<span class="filter-chip clear" @click=${()=>i.setFilter(null)}>${s("show_all",t)}</span>`:c}
      </div>
      <div class="filter-controls">
        <input type="text" class="search-input" placeholder="${s("search_notes",t)}..." .value=${i.search} @input=${n=>i.setSearch(n.target.value)} />
      </div>
    </div>
  `}function ti(e,i){let t=i.lang,n=i.filter?e.history.filter(r=>r.type===i.filter):e.history;if(i.search){let r=i.search.toLowerCase();n=n.filter(a=>ht(a.notes,i.search)||ht(mt(a.notes,t),i.search)||(te(i,a)??"").toLowerCase().endsWith(r))}return n.length===0?l`<p class="empty">${s("no_history",t)}</p>`:l`
    <div class="history-timeline">
      ${_t(n).map(r=>ft(r,i))}
    </div>
  `}function te(e,i){return e.taskRef&&i.ref_no?`${e.taskRef}-${i.ref_no}`:null}function Oe(e,i){let t=nt(i);return t.length>0?l`<div class="history-photos">
        ${t.map(n=>l`<maintenance-history-photo .hass=${e} .docId=${n}></maintenance-history-photo>`)}
      </div>`:c}function je(e,i){let t=i.lang,n=o=>y(o,t,{maximumFractionDigits:3}),r=o=>o==null?"":` (${o>=0?"+":""}${n(o)})`,a=et(e);return a.length>0?l`<div class="history-readings">
      ${a.map(o=>l`<span class="history-reading">
        <span class="history-reading-name">${o.name}</span>
        <span class="history-reading-value">${n(o.value)}${o.unit?` ${o.unit}`:""}${r(i.readingSlotDelta?.(e,o.id))}</span>
      </span>`)}
    </div>`:e.reading_value!=null?l`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${s("reading_label",t)}</span>
      <span class="history-reading-value">${n(e.reading_value)}${i.readingUnit?` ${i.readingUnit}`:""}${r(i.readingDelta?.(e))}</span>
    </span></div>`:c}function ft(e,i,t={}){let n=i.lang,{compact:r=!1,showRef:a=!0,showBadges:o=!0,showEdit:d=!0}=t,u=i.openEdit,h=d&&!!u&&Ce.includes(e.type);return l`
    <div class="history-entry${r?" compact":""}">
      ${r?c:l`<div class="history-icon ${e.type}">
            <ha-icon .icon=${Q[e.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        <div class="history-row">
          <strong>${s(e.type,n)}</strong>
          ${a?Kt(te(i,e),s("ref_number",n)):c}
          ${o&&e.phase_id?l`<span class="history-phase-badge">${i.phaseNames?.[e.phase_id]||e.phase_id}</span>`:c}
          ${o&&e.auto?l`<span class="history-auto-badge">${s("history_auto",n)}</span>`:c}
          ${h?l`<button class="history-edit-btn"
                     title=${s("history_edit_button",n)}
                     @click=${()=>u(e)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:c}
        </div>
        <div class="history-date">${Tt(e.timestamp,n)}</div>
        ${e.notes?l`<div>${mt(e.notes,n)}</div>`:c}
        ${Oe(i.hass,e)}
        ${je(e,i)}
        ${e.cost!=null||e.duration!=null||e.trigger_value!=null?l`<div class="history-details">
              ${e.cost!=null?l`<span>${s("cost",n)}: ${X(e.cost,i.currencySymbol,n)}</span>`:c}
              ${e.duration!=null?l`<span>${s("duration",n)}: ${tt(e.duration,n)}</span>`:c}
              ${e.trigger_value!=null?l`<span>${s("trigger_val",n)}: ${e.trigger_value}</span>`:c}
            </div>`:c}
      </div>
    </div>
  `}var Ne="var(--maint-done-color, #78909c)";function K(e){return e.archived?"archived":e.is_done?"done":e.status||"ok"}function gt(e,i){return s(e==="done"?"completed":e,i)}function st(e){let i=K(e);return i==="done"?Ne:vt[i]||"var(--disabled-color, #9e9e9e)"}function qe(e){return Q[e==="done"?"completed":e]||"mdi:circle-medium"}function ee(e,i,t="pill"){let n=K(e),r=gt(n,i);return t==="chip"?l`<span class="status-chip ${n}">${r}</span>`:l`<span class="status-badge ${n}" role="img" title="${r}" aria-label="${r}"><ha-icon icon="${qe(n)}"></ha-icon><span class="status-label">${r}</span></span>`}function _(e){return e.toFixed(1)}function oi(e,i,t=4){if(!isFinite(e)||!isFinite(i))return{ticks:[],niceMin:0,niceMax:1};if(e===i){let h=Math.abs(e)*.1||1;e-=h,i+=h}let n=i-e,r=Math.pow(10,Math.floor(Math.log10(n/Math.max(1,t)))),a=r;for(let h of[1,2,5,10])if(a=r*h,n/a<=t+.5)break;let o=Math.floor(e/a)*a,d=Math.ceil(i/a)*a,u=[];for(let h=o;h<=d+a*1e-6;h+=a)u.push(Math.abs(h)<a*1e-9?0:h);return{ticks:u,niceMin:o,niceMax:d}}function li(e,i){let t=Math.abs(e),n=r=>({maximumFractionDigits:r});return t>=1e6?y(e/1e6,i,n(t>=1e7?0:1))+"M":t>=1e4?y(e/1e3,i,n(0))+"k":t>=1e3?y(e/1e3,i,n(1))+"k":t>=100?y(e,i,n(0)):t>=1?y(e,i,n(1)):t===0?"0":y(e,i,n(2))}function di(e,i,t){let n=y(e,t,{maximumFractionDigits:Math.abs(e)>=100?0:1});return i?`${n} ${i}`:n}function ci(e,i,t){return lt(new Date(e),i,t)}function pi(e,i){let t=new Date(e);return`${lt(t,i)}, ${wt(t,i)}`}function ui(e,i){return new Date(e).getFullYear()!==new Date(i).getFullYear()}function hi(e,i,t){if(t<2||i<=e)return[e,i];let n=[];for(let r=0;r<t;r++)n.push(e+(i-e)*r/(t-1));return n}function ne(e,i){let t=e.interval_analysis,n=t?.weibull_beta,r=t?.weibull_eta;if(n==null||r==null||r<=0)return c;let a=e.interval_days??0,o=e.suggested_interval??a;return l`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${s("weibull_reliability_curve",i)}
        ${ze(n,i)}
      </div>
      ${Fe(n,r,a,o,i)}
      ${We(t,i)}
      ${t?.confidence_interval_low!=null?Ve(t,e,i):c}
    </div>
  `}function ze(e,i){let t,n,r;return e<.8?(t="early_failures",n="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",r="beta_early_failures"):e<=1.2?(t="random_failures",n="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",r="beta_random_failures"):e<=3.5?(t="wear_out",n="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",r="beta_wear_out"):(t="highly_predictable",n="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",r="beta_highly_predictable"),l`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${n}"></ha-svg-icon>
      ${s(r,i)} (\u03B2=${y(e,i,2)})
    </span>
  `}function Fe(e,i,t,n,r){let x=Math.max(t,n,i,1)*1.3,S=50,R=[];for(let k=0;k<=S;k++){let A=k/S*x,me=1-Math.exp(-Math.pow(A/i,e)),_e=32+A/x*260,fe=136-me*128;R.push([_e,fe])}let Z=R.map(([k,A])=>`${_(k)},${_(A)}`).join(" "),ot="M32,136 "+R.map(([k,A])=>`L${_(k)},${_(A)}`).join(" ")+` L${_(R[S][0])},136 Z`,N=32+t/x*260,Y=1-Math.exp(-Math.pow(t/i,e)),J=136-Y*128,ue=y((1-Y)*100,r,0),yt=32+n/x*260,he=[0,.25,.5,.75,1];return l`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_weibull",r)}">
        ${he.map(k=>{let A=136-k*128;return q`
            <line x1="${32}" y1="${_(A)}" x2="${292}" y2="${_(A)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${k===.5?"4,3":c}" />
            <text x="${28}" y="${_(A+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${y(k*100,r,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(x/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(x)}</text>

        <path d="${ot}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${Z}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?q`
          <line x1="${_(N)}" y1="${8}" x2="${_(N)}" y2="${_(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${_(N)}" cy="${_(J)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${_(N+4)}" y="${_(J-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${ue}%</text>
        `:c}

        ${n>0&&n!==t?q`
          <line x1="${_(yt)}" y1="${8}" x2="${_(yt)}" y2="${_(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:c}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${s("weibull_failure_probability",r)}</span>
      ${t>0?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${s("current_interval_marker",r)}</span>`:c}
      ${n>0&&n!==t?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${s("recommended_marker",r)}</span>`:c}
    </div>
  `}function We(e,i){return l`
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
      `:c}
    </div>
  `}function Ve(e,i,t){let n=e.confidence_interval_low,r=e.confidence_interval_high,a=i.suggested_interval??i.interval_days??0,o=i.interval_days??0,d=Math.max(0,n-5),h=r+5-d,f=(n-d)/h*100,D=(r-n)/h*100,U=(a-d)/h*100,x=o>0?(o-d)/h*100:-1;return l`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${s("confidence_interval",t)}: ${a} ${s("days",t)} (${n}\u2013${r})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${_(f)}%;width:${_(D)}%"></div>
        ${x>=0?l`<div class="confidence-marker current" style="left:${_(x)}%"></div>`:c}
        <div class="confidence-marker recommended" style="left:${_(U)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${s("confidence_conservative",t)} (${n}${s("days",t).charAt(0)})</span>
        <span class="confidence-text high">${s("confidence_aggressive",t)} (${r}${s("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function ie(e,i,t){let n=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data",r=e.days_until_threshold!=null,a=e.environmental_factor!=null&&e.environmental_factor!==1;if(!n&&!r&&!a)return c;let o=e.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":e.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return l`
    <div class="prediction-section">
      ${e.sensor_prediction_urgency?l`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${s("sensor_prediction_urgency",i).replace("{days}",String(Math.round(e.days_until_threshold||0)))}
        </div>
      `:c}
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
            ${e.degradation_rate!=null?l`<span class="prediction-rate">${e.degradation_rate>0?"+":""}${y(e.degradation_rate,i,Math.abs(e.degradation_rate)>=10?0:1)} ${e.trigger_entity_info?.unit_of_measurement||""}/${s("day_short",i)}</span>`:c}
          </div>
        `:c}
        ${r?l`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${s("days_until_threshold",i)}</span>
            <span class="prediction-value prediction-days${e.days_until_threshold===0?" exceeded":e.sensor_prediction_urgency?" urgent":""}">${e.days_until_threshold===0?s("threshold_exceeded",i):"~"+Math.round(e.days_until_threshold)+" "+s("days",i)}</span>
            ${e.threshold_prediction_date?l`<span class="prediction-date">${O(e.threshold_prediction_date,i)}</span>`:c}
            ${e.threshold_prediction_confidence?l`<span class="confidence-dot ${e.threshold_prediction_confidence}"></span>`:c}
            ${(e.prediction_cycles??0)>0?l`<span class="prediction-cycles">${s("prediction_cycles",i)}: ${e.prediction_cycles}</span>`:c}
          </div>
        `:c}
        ${a&&t.environmental?l`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${s("environmental_adjustment",i)}</span>
            <span class="prediction-value">${y(e.environmental_factor,i,2)}x</span>
            ${e.environmental_entity?l`<span class="prediction-entity entity-link" @click=${d=>Lt(d,e.environmental_entity)}>${e.environmental_entity}</span>`:c}
          </div>
        `:c}
      </div>
    </div>
  `}function re(e,i,t,n){let r=Math.max(e||1,i);return l`
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
  `}var se=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function ae(e,i,t){if(!t.seasonal||!e.seasonal_factor||e.seasonal_factor===1)return c;let n=se.map(d=>s(d,i)),r=new Date().getMonth(),a=e.seasonal_factors||e.interval_analysis?.seasonal_factors||null,o=a&&a.length===12?a:n.map((d,u)=>{let h=e.seasonal_factor||1,f=Math.sin((u-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,h+f))});return l`
    <div class="seasonal-card-compact">
      <h4>${s("seasonal_awareness",i)}</h4>
      <div class="seasonal-mini-chart">
        ${o.map((d,u)=>{let h=d*40,f=d<.9?"low":d>1.1?"high":"normal";return l`
            <div class="seasonal-bar ${f} ${u===r?"current":""}"
                 style="height: ${h}px"
                 title="${n[u]}: ${y(d,i,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${s("shorter",i)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${s("normal",i)}</span>
        <span class="legend-item"><span class="dot high"></span> ${s("longer",i)}</span>
      </div>
    </div>
  `}function oe(e,i){return Ue(e,i)}function Ue(e,i){let t=e.seasonal_factors??e.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return c;let n=e.interval_analysis?.seasonal_reason,r=new Date().getMonth(),a=300,o=100,d=8,h=o-d-4,f=Math.max(...t,1.5),D=a/12,U=D*.65,x=d+h-1/f*h;return l`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${s("seasonal_chart_title",i)}
        ${n?l`<span class="source-tag">${n==="learned"?s("seasonal_learned",i):s("seasonal_manual",i)}</span>`:c}
      </div>
      <svg viewBox="0 0 ${a} ${o}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_seasonal",i)}">
        <line x1="0" y1="${_(x)}" x2="${a}" y2="${_(x)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((S,R)=>{let Z=S/f*h,ot=R*D+(D-U)/2,N=d+h-Z,Y=R===r,J=S<1?"var(--success-color, #4caf50)":S>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return q`
            <rect x="${_(ot)}" y="${_(N)}"
              width="${_(U)}" height="${_(Z)}"
              fill="${J}" opacity="${Y?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${se.map((S,R)=>l`<span class="seasonal-label ${R===r?"active-month":""}">${s(S,i)}</span>`)}
      </div>
    </div>
  `}var g=class extends L{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._toastTimer=new zt;this._access=it;this._currencySymbol="";this._loadSeq=0}get _lang(){return T(this.hass)}async openFor(t,n){(t!==this._entryId||n!==this._taskId)&&(this._task=null),this._entryId=t,this._taskId=n,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=Pt(new Date),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let t=await M(this.hass);this._features={...this._features,...t.features},this._access=t.access,this._currencySymbol=G(t.budget??void 0),$t(t.budget??void 0)}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(t,n){this._toast=t,this._toastTimer.schedule(()=>{this._toast=""},n)}async _loadTask(){let t=this._entryId,n=this._taskId;if(!t||!n)return;let r=++this._loadSeq,a="",o=await I(this,{type:"maintenance_supporter/object",entry_id:t},{onError:u=>{a=u}});if(r!==this._loadSeq)return;if(o===void 0){this._error=a;return}this._objectName=o?.object?.name||"";let d=(o?.tasks||[]).find(u=>u.id===n);this._task=d??null,this._taskRef=Bt(o?.object,d),d||(this._error=s("ws_err_not_found",this._lang))}_runWs(t){return this._error="",I(this,t,{busy:n=>{this._busy=n},onError:n=>{this._error=n}})}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-MV5TNUDV.js").then(async({openCompleteDialog:t})=>{let n=this._task,r=[];try{r=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}t(Vt({entryId:this._entryId,taskId:this._taskId,taskName:n.name,task:n,objects:r,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol}))&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})!==void 0&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})!==void 0&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-MV5TNUDV.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-MV5TNUDV.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId||!await j(this.hass,{title:s("delete",this._lang),message:s("delete_task_confirm",this._lang),confirmText:s("delete",this._lang),danger:!0}))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})!==void 0&&(this._showToast(s("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!this._entryId||!this._taskId)return;let t=await this._runWs({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});t!==void 0&&(this._showToast(t?.recommended_interval?`${s("reanalyze_result",this._lang)}: ${Et(t.recommended_interval,"days",this._lang)} (${t.data_points} pts)`:s("reanalyze_insufficient_data",this._lang)),await this._loadTask())}_onEditHistoryEntry(t){if(!this._entryId||!this._taskId)return;let n=pt(this._entryId,this._taskId,t,this._task);import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-MV5TNUDV.js").then(({openHistoryEditDialog:r})=>r(n))}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return c;let n=this._lang;return l`
      <div class="recommendation-card">
        <h4>${s("suggested_interval",n)}</h4>
        ${re(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",n)}
        <div class="recommendation-actions">
          ${z(this.hass?.user,this._access)?l`<button class="btn primary qa-apply-suggestion"
                @click=${this._applySuggestion} ?disabled=${this._busy}>
                <ha-icon icon="mdi:check"></ha-icon>
                ${s("apply_suggestion",n)}
              </button>`:c}
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${s("reanalyze",n)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(t){let n=this._lang,r=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,a=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,o=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,d=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!r&&!a&&!o&&!d?l`<div class="adaptive-empty">
        ${s("adaptive_no_data",n)}
      </div>`:l`
      <div class="adaptive-stack">
        ${this._toast?l`<div class="toast">${this._toast}</div>`:c}
        ${r?this._renderRecommendation(t):c}
        ${a?ie(t,n,this._features):c}
        ${o?ne(t,n):c}
        ${d?l`
          ${ae(t,n,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?oe(t,n):c}
        `:c}
      </div>
    `}_renderDetails(t){let n=this._lang,r=t.history||[],a=t.history_count??r.length,o=_t(r).slice(0,20);return l`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${s("times_performed",n)}</span>
            <span class="stat-value">${t.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("total_cost",n)}</span>
            <span class="stat-value">${X(t.total_cost??0,this._currencySymbol,n)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("avg_duration",n)}</span>
            <span class="stat-value">${tt(t.average_duration!=null?Math.round(t.average_duration):null,n)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${s("history",n)}</strong>
          <span class="history-count">${a}</span>
        </div>
        ${r.length===0?l`<div class="history-empty">${s("history_empty",n)}</div>`:l`
              <div class="history-list">
                ${o.map(d=>ft(d,{lang:n,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:z(this.hass?.user,this._access)?u=>this._onEditHistoryEntry(u):void 0,readingUnit:t.reading_unit,readingSlotDelta:(u,h)=>Dt(r,u,h),taskRef:this._taskRef},{compact:!0}))}
                ${a>o.length?l`<div class="history-more">… +${a-o.length} ${s("older_entries",n)}</div>`:c}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return c;let t=this._lang,n=this._task,r=z(this.hass?.user,this._access);return W(()=>this.close(),l`
        ${n?l`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${st(n)}"></span>
                  <span class="task-name">${n.name}</span>
                  ${ee(n,t)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-MV5TNUDV.js").then(({openObjectQuickActions:a})=>{a(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${n.next_due?l`<span><strong>${s("next_due",t)}:</strong> ${O(n.next_due,t)}</span>`:c}
                  ${n.last_performed?l`<span><strong>${s("last_performed",t)}:</strong> ${O(n.last_performed,t)}</span>`:c}
                  ${n.schedule?.kind&&!["manual","one_time"].includes(n.schedule.kind)||n.interval_days!=null?l`<span><strong>${s("interval",t)}:</strong> ${At(n,t)}</span>`:c}
                  ${B(n)?l`<span><strong>${s("phase_current",t)}:</strong> ${B(n)}</span>`:c}
                </div>
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:c}

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
                          `:c}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${s("reset",t)}
                      </ha-button>
                    </div>
                    <!-- QR is read tier (the panel offers it to operators too);
                         Edit / Archive / Delete follow canWrite() — the panel's
                         operator delegation, not is_admin alone. -->
                    <div class="actions secondary-row">
                      ${r?l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-edit" @click=${this._onEdit} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                            ${s("edit",t)}
                          </ha-button>`:c}
                      <ha-button size="small" appearance="outlined" variant="neutral" class="qa-qr" @click=${this._onQr} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                        ${s("qr_code",t)}
                      </ha-button>
                      ${r?l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-archive"
                            @click=${n.archived?this._onUnarchive:this._onArchive}
                            .disabled=${this._busy}>
                            <ha-icon slot="start" icon="${n.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                            ${n.archived?s("unarchive",t):s("archive",t)}
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="danger" class="danger qa-delete" @click=${this._onDelete} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                            ${s("delete",t)}
                          </ha-button>`:c}
                    </div>
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?s("hide_details",t):s("show_details",t)}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?l`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?s("hide_stats",t):s("show_stats",t)}
                          </button>`:c}
                    </div>
                    ${this._showDetails?this._renderDetails(n):c}
                    ${this._showAdaptive?this._renderAdaptive(n):c}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${s("open_in_panel",t)}
                      </button>
                    </div>
                  `}
            `:this._error?l`<div class="error">${this._error}</div>`:l`<div class="loading">${s("loading",t)}</div>`}
    `)}updated(t){t.has("_open")&&this._open&&V(this.shadowRoot)}};g.styles=[Rt,F,$`
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
  `],p([w({attribute:!1})],g.prototype,"hass",2),p([m()],g.prototype,"_open",2),p([m()],g.prototype,"_entryId",2),p([m()],g.prototype,"_taskId",2),p([m()],g.prototype,"_task",2),p([m()],g.prototype,"_objectName",2),p([m()],g.prototype,"_taskRef",2),p([m()],g.prototype,"_busy",2),p([m()],g.prototype,"_error",2),p([m()],g.prototype,"_showSkip",2),p([m()],g.prototype,"_showReset",2),p([m()],g.prototype,"_showDetails",2),p([m()],g.prototype,"_showAdaptive",2),p([m()],g.prototype,"_skipReason",2),p([m()],g.prototype,"_resetDate",2),p([m()],g.prototype,"_features",2),p([m()],g.prototype,"_toast",2),p([m()],g.prototype,"_access",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",g);function le(e){return!!e&&/^https?:\/\//i.test(e)}function de(e){return e?customElements.get("ha-markdown")?l`<ha-markdown class="notes-md" .content=${e} breaks></ha-markdown>`:l`${e}`:c}var E=class extends L{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=it}get _lang(){return T(this.hass)}async openFor(t){this._entryId=t,this._error="",this._open=!0,await Promise.all([this._load(),M(this.hass).then(n=>{this._access=n.access})])}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(!this._entryId)return;let t=await I(this,{type:"maintenance_supporter/object",entry_id:this._entryId},{onError:n=>{this._error=n}});t!==void 0&&(this._data=t)}_runWs(t){return this._error="",I(this,t,{busy:n=>{this._busy=n},onError:n=>{this._error=n}})}_onEditObject(){!this._entryId||!this._data||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-MV5TNUDV.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-MV5TNUDV.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await j(this.hass,{title:s("delete",this._lang),message:s("delete_object_confirm",this._lang),confirmText:s("delete",this._lang),danger:!0}))return;let n=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:n})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:n},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t&&!await j(this.hass,{title:s("archive_object",this._lang),message:s("confirm_archive_object",this._lang),confirmText:s("archive_object",this._lang)}))return;let n=this._entryId;await this._runWs({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:n})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:n},bubbles:!0,composed:!0})),this.close())}_onTaskClick(t){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-MV5TNUDV.js").then(({openTaskQuickActions:n})=>{n(this._entryId,t)})}render(){if(!this._open)return c;let t=this._lang,n=this._data,r=n?.object,a=n?.tasks||[],o=z(this.hass?.user,this._access);return W(()=>this.close(),l`
        ${n&&r?l`
              <div class="header">
                <div class="title">${r.name}</div>
                ${this._renderMetaRow(r)}
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:c}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${s("tasks",t)}</strong>
                  <span class="count">${a.length}</span>
                </div>
                ${a.length===0?l`<div class="empty">${s("no_tasks",t)}</div>`:l`
                      <div class="task-list">
                        ${a.map(d=>l`
                          <div class="task-row" @click=${()=>this._onTaskClick(d.id)}>
                            <span class="status-dot" style="background: ${st(d)}"></span>
                            <span class="task-name">${d.name}</span>
                            <span class="task-status ${K(d)}">${gt(K(d),t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${r.notes?l`
                    <div class="notes-section">
                      <strong>${s("object_notes_label",t)}</strong>
                      <div class="notes-body">${de(r.notes)}</div>
                    </div>
                  `:c}

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
                  `:c}
            `:l`<div class="loading">${s("loading",t)}</div>`}
    `)}updated(t){t.has("_open")&&this._open&&V(this.shadowRoot)}_renderMetaRow(t){let n=this._lang,r=[];return t.area_id&&r.push([s("area",n),t.area_id]),t.manufacturer&&r.push([s("manufacturer",n),t.manufacturer]),t.model&&r.push([s("model",n),t.model]),t.serial_number&&r.push([s("serial_number_label",n),t.serial_number]),t.installation_date&&r.push([s("installed",n),t.installation_date]),t.warranty_expiry&&r.push([s("warranty",n),t.warranty_expiry]),t.documentation_url&&r.push([s("documentation_url_label",n),t.documentation_url]),r.length===0?c:l`
      <div class="meta">
        ${r.map(([a,o])=>l`
            <div class="meta-item">
              <span class="meta-label">${a}</span>
              <span class="meta-value">${le(o)?l`<a href="${o}" target="_blank" rel="noopener noreferrer">${o}</a>`:o}</span>
            </div>
          `)}
      </div>
    `}};E.styles=[F,$`
    :host { display: contents; }
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
  `],p([w({attribute:!1})],E.prototype,"hass",2),p([m()],E.prototype,"_open",2),p([m()],E.prototype,"_entryId",2),p([m()],E.prototype,"_data",2),p([m()],E.prototype,"_busy",2),p([m()],E.prototype,"_error",2),p([m()],E.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",E);var ce="maintenance-object-dialog",pe="maintenance-task-dialog",Ge="maintenance-history-edit-dialog",Be="maintenance-complete-dialog",Ke="maintenance-qr-dialog",Ze="maintenance-task-quick-actions-dialog",Ye="maintenance-object-quick-actions-dialog";function at(){return document.querySelector("home-assistant")?.hass}function Je(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function H(e){let i=Je(),t=i.querySelector(e)??document.body.querySelector(e);return t?t.parentNode!==i&&i.appendChild(t):(t=document.createElement(e),i.appendChild(t)),t}function P(e){let i=at();if(!i)return!1;e.hass=i;let t=T(i);return bt(t)||xt(t).then(()=>{e.requestUpdate?.()}),kt(i.locale,i.config?.country),!0}function Tr(e){return M(e).then(i=>i.rowActionStyle)}function Er(){jt()}function Ar(){let e=H(ce);return P(e)?(e.openCreate(),!0):!1}function Lr(e,i){let t=H(ce);return P(t)?(t.openEdit(e,i),!0):!1}function Sr(e="",i){let t=H(pe);if(!P(t))return!1;let n=at();return n?((async()=>{let r=await M(n),a=t;a.checklistsEnabled=r.features.checklists,a.scheduleTimeEnabled=r.features.schedule_time,a.completionActionsEnabled=r.features.completion_actions,a.defaultWarningDays=r.defaultWarningDays,a.openCreate(e,i)})(),!0):!1}function Rr(e,i){let t=H(pe);if(!P(t))return!1;let n=at();return n?((async()=>{try{let[r,a]=await Promise.all([n.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e}),M(n)]),o=(r.tasks||[]).find(u=>u.id===i);if(!o){console.warn(`openEditTaskDialog: task ${i} not found in entry ${e}`);return}let d=t;d.checklistsEnabled=a.features.checklists,d.scheduleTimeEnabled=a.features.schedule_time,d.completionActionsEnabled=a.features.completion_actions,d.defaultWarningDays=a.defaultWarningDays,await d.openEdit(e,o)}catch(r){console.warn("openEditTaskDialog: failed to load task/features",r)}})(),!0):!1}function Hr(e){let i=H(Ge);return P(i)?(i.openEdit(e),!0):!1}function Pr(e){let i=H(Be);return P(i)?(Ut(i,e,T(at())),!0):!1}function Ir(e){let i=H(Ke);return P(i)?(i.openForTask(e.entry_id,e.task_id,e.object_name,e.task_name),!0):!1}function Mr(e,i){let t=H(Ze);return P(t)?(t.openFor(e,i),!0):!1}function Cr(e){let i=H(Ye);return P(i)?(i.openFor(e),!0):!1}export{le as a,Se as b,Pe as c,$e as d,Bt as e,qn as f,Kt as g,de as h,ve as i,be as j,ct as k,Vt as l,Ut as m,mt as n,_ as o,oi as p,li as q,di as r,ci as s,pi as t,ui as u,hi as v,pt as w,On as x,_t as y,Xn as z,ti as A,ft as B,ee as C,ne as D,ie as E,re as F,ae as G,oe as H,Tr as I,Er as J,Ar as K,Lr as L,Sr as M,Rr as N,Hr as O,Pr as P,Ir as Q,Mr as R,Cr as S};
