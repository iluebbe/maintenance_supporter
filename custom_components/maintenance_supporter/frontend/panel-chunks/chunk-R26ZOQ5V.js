/*! maintenance_supporter frontend 2.96.0 */
import{a as rt,b as F,e as C,f as zt,g as Nt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-3DX24CU6.js";import{a as ut}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-RJY4VEHX.js";import{b as Ht}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-3VJOJBZ5.js";import{b as ct}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-4OFQFCKD.js";import{b as Ot,c as qt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BA7DXCPM.js";import{f as Rt,l as st}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BYGTDXRD.js";import{b as It,c as Mt,e as nt,f as Ct,h as Dt,k as jt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-MHBW3M6D.js";import{j as ht}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-WJT4RRLS.js";import{a as M}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BFBOHWBW.js";import{A as wt,B as y,C as N,D as Tt,E as tt,F as B,G as et,I as At,J as it,O as pt,P as Et,Q as Lt,R as St,T as Pt,a as p,b as $,c as a,d as q,f as d,h as S,l as T,m as u,n as bt,q as X,s as r,t as xt,u as $t,w as U,y as A,z as kt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-N6F5RX6S.js";var V=$`
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
`;function he(e,n){e.key!=="Escape"||e.defaultPrevented||e.composedPath().some(t=>t instanceof Element&&t.localName==="ms-camera-capture")||(e.preventDefault(),e.stopPropagation(),n())}function W(e,n){return a`
    <div class="backdrop" @click=${e}></div>
    <div class="dialog" role="dialog" aria-modal="true" tabindex="-1"
      @keydown=${t=>he(t,e)}>${n}</div>
  `}function G(e){e?.querySelector(".dialog")?.focus({preventScroll:!0})}var v=class extends S{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._options=null;this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel="",this._inputType="",this._options=null,this._inputValue="",this._open=!0,new Promise(i=>{this._resolve=i,this._promptResolve=null})}prompt(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel=t.inputLabel||"",this._inputType=t.inputType||"text",this._options=t.options&&t.options.length?t.options:null,this._inputValue=t.inputValue||"",this._open=!0,new Promise(i=>{this._promptResolve=i,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return d;let t=A(this.hass);return a`
      <ha-dialog open @closed=${this._cancel}>
        <div class="dialog-title">${this._title}</div>
        <div class="content">
          ${this._message}
          ${this._inputLabel?a`
            <!-- Native <input> rather than <ha-textfield>: HA loads
                 ha-textfield lazily for its own panels, so inside this custom
                 panel it can be unregistered and render with zero height —
                 the prompt then shows no field at all (caught live testing
                 the pause/replace prompts; same fix as complete-dialog). -->
            <label class="field">
              <span class="field-label">${this._inputLabel}</span>
              ${this._options?a`<select class="field-input field-select"
                    @change=${i=>this._inputValue=i.target.value}>
                    ${this._options.map(i=>a`<option value=${i.value} ?selected=${i.value===this._inputValue}>${i.label}</option>`)}
                  </select>`:a`<input class="field-input"
                    type="${this._inputType||"text"}"
                    .value=${this._inputValue}
                    @input=${i=>this._inputValue=i.target.value} />`}
            </label>
          `:d}
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
  `],p([T({attribute:!1})],v.prototype,"hass",2),p([u()],v.prototype,"_open",2),p([u()],v.prototype,"_title",2),p([u()],v.prototype,"_message",2),p([u()],v.prototype,"_confirmText",2),p([u()],v.prototype,"_danger",2),p([u()],v.prototype,"_inputLabel",2),p([u()],v.prototype,"_inputType",2),p([u()],v.prototype,"_options",2),p([u()],v.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",v);var Ft="maintenance-confirm-dialog",Vt="data-ms-lovelace-confirm";function me(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function z(e,n){let t=me(),i=t.querySelector(`${Ft}[${Vt}]`);return i||(i=document.createElement(Ft),i.setAttribute(Vt,""),t.appendChild(i)),i.hass=e,i.confirm(n)}var D=class extends S{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await Ht(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?d:this._url?a`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:a`<div class="ph"></div>`}};D.styles=$`
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
  `,p([T({attribute:!1})],D.prototype,"hass",2),p([T()],D.prototype,"docId",2),p([u()],D.prototype,"_url",2),p([u()],D.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",D);var b=class extends S{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._openGen=0;this._photos=new qt(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return A(this.hass)}openEdit(t){this._openGen++,this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(t.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(t),this._loadPartOptions()}_seedReadings(t){let i=[],s=new Set;for(let o of t.readings??[])s.has(o.id)||(s.add(o.id),i.push({id:o.id,name:o.name,unit:o.unit??null}));for(let o of t.reading_values??[])s.has(o.id)||(s.add(o.id),i.push({id:o.id,name:o.name,unit:o.unit??null}));this._readingRows=i;let l={};for(let o of t.reading_values??[])l[o.id]=String(o.value);this._readingText=l,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let t={};for(let i of this._readingRows){let s=(this._readingText[i.id]??"").trim();if(s==="")continue;let l=parseFloat(s.replace(",","."));isNaN(l)||(t[i.id]=l)}return t}async _loadPartOptions(){let t=this._draft;if(!t)return;let i=this._openGen;try{let s=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});if(i!==this._openGen)return;let l=[];for(let c of s.parts||[]){let h=c.entry_id===t.entry_id,m=c.consumers.some(g=>g.entry_id===t.entry_id&&g.task_id===t.task_id);!h&&!m||l.push({part_id:c.part_id,name:c.name,entry_id:c.entry_id,foreign:!h,object_name:c.object_name})}for(let c of t.used_parts||[]){let h=c.entry_id||t.entry_id;l.some(m=>m.part_id===c.part_id&&m.entry_id===h)||l.push({part_id:c.part_id,name:c.name||c.part_id,entry_id:h,foreign:h!==t.entry_id,object_name:null})}let o={};for(let c of t.used_parts||[])o[`${c.entry_id||t.entry_id}:${c.part_id}`]=c.quantity??1;this._partOptions=l,this._partQty=o,this._partQtyOriginal=this._partSelectionKey()}catch{if(i!==this._openGen)return;this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,t])=>t>0).sort(([t],[i])=>t.localeCompare(i)))}close(){this._openGen++,this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(t,i){this._draft&&(this._draft={...this._draft,[t]:i})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let t=this._lang;if(!await z(this.hass,{title:r("history_delete_entry",t),message:r("history_delete_confirm",t),confirmText:r("delete",t),danger:!0})||!this._draft||!this._originalSnapshot)return;let s=this._draft;this._error="",await this._runWs({type:"maintenance_supporter/task/history/delete",entry_id:s.entry_id,task_id:s.task_id,timestamp:this._originalSnapshot.original_timestamp})!==void 0&&(this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:s.entry_id,task_id:s.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close())}_runWs(t){return M(this,t,{busy:i=>{this._saving=i},onError:i=>{this._error=i}})}async _save(){if(!this._draft||!this._originalSnapshot||this._saving||this._photos.uploading)return;this._error="",this._photos.clearError();let t=this._draft,i=this._originalSnapshot,s={type:"maintenance_supporter/task/history/update",entry_id:t.entry_id,task_id:t.task_id,original_timestamp:i.original_timestamp};if(t.timestamp!==i.timestamp&&(s.timestamp=t.timestamp),t.notes!==i.notes&&(s.notes=t.notes),t.cost!==i.cost&&(s.cost=t.cost),t.duration!==i.duration&&(s.duration=t.duration),t.completed_by!==i.completed_by&&(s.completed_by=t.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(s.used_parts=(this._partOptions||[]).filter(o=>(this._partQty[`${o.entry_id}:${o.part_id}`]||0)>0).map(o=>({part_id:o.part_id,quantity:this._partQty[`${o.entry_id}:${o.part_id}`],...o.foreign?{entry_id:o.entry_id}:{}}))),t.reading_value!==i.reading_value&&(s.reading_value=t.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let o=this._readingNumbers(),c={};for(let h of this._readingRows)c[h.id]=o[h.id]??null;s.reading_values=c}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(s.photo_doc_ids=this._photos.ids),Object.keys(s).filter(o=>!["type","entry_id","task_id","original_timestamp"].includes(o)).length===0){this.close();return}await this._runWs(s)!==void 0&&(this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:t.entry_id,task_id:t.task_id,new_timestamp:t.timestamp},bubbles:!0,composed:!0})),this.close())}render(){if(!this._open||!this._draft)return d;let t=this._lang,i=this._draft,s=this._error||this._photos.errorText(t);return W(()=>this.close(),a`
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
          @value-changed=${l=>{let o=l.detail.value;o&&this._set("timestamp",o)}}
        ></ms-date-field>
        <label>
          <span>${r("notes_label",t)}</span>
          <textarea
            rows="3"
            @input=${l=>{let o=l.target.value;this._set("notes",o||null)}}
            .value=${i.notes??""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${r("cost",t)}</span>
            <input type="number" min="0" step="0.01"
              .value=${i.cost!=null?String(i.cost):""}
              @input=${l=>{let o=l.target.value;this._set("cost",o?Number(o):null)}} />
          </label>
          <label>
            <span>${r("duration",t)}</span>
            <input type="number" min="0" step="1" inputmode="numeric"
              .value=${i.duration!=null?String(i.duration):""}
              @input=${l=>{this._set("duration",jt(l.target.value))}} />
          </label>
        </div>
        ${this._renderReadings(i,t)}
        ${this._partOptions&&this._partOptions.length>0?a`
          <div class="parts-block">
            <span class="parts-title">${r("complete_parts_used",t)}</span>
            ${this._partOptions.map(l=>{let o=`${l.entry_id}:${l.part_id}`,c=this._partQty[o]||0;return a`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${c>0}
                    @change=${h=>{let m=h.target.checked;this._partQty={...this._partQty,[o]:m?1:0}}} />
                  <span class="part-label">${l.name}${l.foreign&&l.object_name?` (${l.object_name})`:""}</span>
                  ${c>0?a`
                    <input class="part-qty" type="number" min=${ht[0]} max=${ht[1]} step="0.01"
                      .value=${String(c)}
                      @input=${h=>{let m=parseFloat(h.target.value);!isNaN(m)&&m>0&&(this._partQty={...this._partQty,[o]:m})}} />
                  `:d}
                </label>
              `})}
          </div>
        `:d}
        <div class="photos-block">
          <span class="parts-title">${r("completion_photos",t)}</span>
          ${this._photos.photos.length>0?a`
            <div class="photo-strip">
              ${this._photos.photos.map(l=>a`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${l.id}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${r("remove",t)}
                    @click=${()=>this._photos.remove(l.id)}>✕</button>
                </div>`)}
            </div>`:d}
          ${this._photos.full?a`<span class="photos-hint">${r("photos_limit",t).replace("{max}",String(this._photos.max))}</span>`:a`<ms-photo-picker .lang=${t} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${l=>this._photos.addFiles(l.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${r("history_edit_photos_hint",t)}</span>
        </div>
        ${s?a`<div class="error">${s}</div>`:d}
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
    `)}updated(t){t.has("_open")&&this._open&&G(this.shadowRoot)}_renderReadings(t,i){return this._readingRows.length>0?a`
        <div class="readings-block">
          <span class="parts-title">${r("readings_section",i)}</span>
          ${this._readingRows.map(s=>a`
            <label class="reading-row-edit">
              <span class="reading-row-name">${s.name}${s.unit?` (${s.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[s.id]??""}
                @input=${l=>{this._readingText={...this._readingText,[s.id]:l.target.value}}} />
            </label>
          `)}
        </div>`:t.reading_value==null&&t.task_type!=="reading"?d:a`
      <label>
        <span>${r("reading_value_label",i)}${t.reading_unit?` (${t.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${t.reading_value!=null?String(t.reading_value):""}
          @input=${s=>{let l=s.target.value,o=l===""?NaN:Number(l);this._set("reading_value",isNaN(o)?null:o)}} />
      </label>`}};b.styles=[Ot,V,$`
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
  `],p([T({attribute:!1})],b.prototype,"hass",2),p([u()],b.prototype,"_open",2),p([u()],b.prototype,"_saving",2),p([u()],b.prototype,"_error",2),p([u()],b.prototype,"_draft",2),p([u()],b.prototype,"_partOptions",2),p([u()],b.prototype,"_partQty",2),p([u()],b.prototype,"_readingRows",2),p([u()],b.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",b);function Wt(e,n,t=new Date){let i=e?.hours,s=e?.snoozed_until?new Date(e.snoozed_until):null;if(typeof i!="number"||!s||isNaN(s.getTime()))return r("snoozed",n);let o=s.toDateString()===t.toDateString()?tt(s,n):et(e.snoozed_until,n);return(i===1?r("snoozed_for_one",n):r("snoozed_for",n).replace("{hours}",y(i,n))).replace("{until}",o)}function _e(e,n){if(n<=0)return 0;let t=typeof e=="number"&&Number.isFinite(e)?Math.trunc(e):0;return t<0?0:t%n}function fe(e){return!!(e?.phases&&e.phase_sequence&&e.phase_sequence.length>0)}function mt(e){if(!e||!fe(e))return null;let n=e.phase_sequence,t=_e(e.phase_cursor,n.length),i=n[t],s=e.phases?.[i];return s?{id:i,name:s.name,index:t,count:n.length,notes:s.notes,checklist:s.checklist!==void 0?s.checklist:e.checklist??[],consumesParts:s.consumes_parts!==void 0?s.consumes_parts:e.consumes_parts??[],requiredFields:s.required_completion_fields!==void 0?s.required_completion_fields:e.required_completion_fields??[]}:null}function K(e){let n=mt(e);return n?`${n.index+1}/${n.count} \xB7 ${n.name}`:""}function ge(e,n){return typeof e=="number"&&Number.isFinite(e)&&e>=.01?e:n}function Gt(e){let n=e.task??null,t=n?mt(n):null,i=t?t.consumesParts:n?.consumes_parts||[],s=!!n?.part_ref,l=e.objects.find(g=>g.entry_id===e.entryId)?.parts||[],o=s?l.find(g=>g.id===n.part_ref.part_id):void 0,c=e.features?e.features.checklists:e.checklistsEnabled??!0,h=e.features?e.features.checklists?e.checklist??n?.checklist??[]:[]:e.checklist??[],m=e.features?e.features.adaptive&&(e.adaptiveEnabled??!!n?.adaptive_config?.enabled):!!e.adaptiveEnabled;return{entry_id:e.entryId,task_id:e.taskId,task_name:e.taskName,checklist:t?c?t.checklist:[]:h,adaptive_enabled:m,required_completion_fields:t?t.requiredFields:n?.required_completion_fields||[],task_type:n?.type||"",reading_unit:n?.reading_unit||"",readings:n?.readings||[],reading_history:Ct(n?.history),parts:s?[]:Mt({consumes_parts:i},e.entryId,e.objects,e.lang),consumes_parts:s?[]:i,phase_label:t?K(n):"",require_tag_scan:!!n?.require_tag_scan,restock_default:s?ge(o?.restock_quantity,1):null,restock_unit_cost:s?o?.cost??null:null,restock_package:s&&o?.package_size?Tt(o.package_size,o.unit,e.lang):"",currency_symbol:U({currency_symbol:e.currencySymbol}),consumes_info:i.map(g=>It(g,e.entryId,e.objects,e.lang)),checklist_prefill:n?.checklist_progress||{},via_tag_scan:!!e.viaTagScan,parts_cost_mode:e.partsCostMode??"purchase"}}function Ut(e,n,t){e.entryId=n.entry_id,e.taskId=n.task_id,e.taskName=n.task_name,e.lang=t,e.checklist=n.checklist??[],e.adaptiveEnabled=!!n.adaptive_enabled,e.requiredFields=n.required_completion_fields??[],e.taskType=n.task_type??"",e.readingUnit=n.reading_unit??"",e.readings=n.readings??[],e.readingHistory=n.reading_history??[],e.parts=n.parts??[],e.consumesParts=n.consumes_parts??[],e.phaseLabel=n.phase_label??"",e.requireTagScan=!!n.require_tag_scan,e.restockDefault=n.restock_default??null,e.restockUnitCost=n.restock_unit_cost??null,e.restockPackage=n.restock_package??"",e.currencySymbol=U(n),e.consumesInfo=n.consumes_info??[],e.checklistPrefill=n.checklist_prefill??{},e.viaTagScan=!!n.via_tag_scan,e.partsCostMode=n.parts_cost_mode??"purchase",e.open({viaTagScan:!!n.via_tag_scan})}function at(e){return e?customElements.get("ha-markdown")?a`<ha-markdown class="notes-md" .content=${e} breaks></ha-markdown>`:a`${e}`:d}function _t(e,n,t,i){let s=t,l=h=>typeof h=="string"?h:null,o=h=>typeof h=="number"?h:null,c=l(s.timestamp)??"";return{entry_id:e,task_id:n,original_timestamp:c,type:l(s.type)||"completed",timestamp:c,notes:l(s.notes),cost:o(s.cost),duration:o(s.duration),completed_by:l(s.completed_by),used_parts:Array.isArray(s.used_parts)?s.used_parts:null,photo_doc_ids:st(s),reading_value:o(s.reading_value),reading_values:nt(s),readings:i?.readings??[],task_type:i?.type??null,reading_unit:i?.reading_unit??null}}async function wi(e,n,t,i){let l=(await e.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:n})).tasks?.find(c=>c.id===t);if(!l)return null;let o=l.history?.find(c=>c.timestamp===i);return o||(o=(await e.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:n,task_id:t})).history?.find(h=>h.timestamp===i)),o?_t(n,t,o,l):null}var Bt=e=>typeof e=="number"&&Number.isInteger(e)&&e>0;function ye(e){return e&&Bt(e.ref_no)?String(e.ref_no):null}function Kt(e,n){let t=ye(e);return t&&n&&Bt(n.ref_no)?`${t}.${n.ref_no}`:null}function Ei(e){let n=/^(\d+)(?:\.(\d+)(?:-(\d+))?)?$/.exec(e.trim());return n?{object:Number(n[1]),task:n[2]?Number(n[2]):null,entry:n[3]?Number(n[3]):null}:null}function Yt(e,n){return e?a`<span class="ref-chip" title=${n??""}>#${e}</span>`:d}var ve=["completed","reset","skipped"];function ft(e){let n=t=>{let i=t.timestamp??"",s=Date.parse(i.length===10?`${i}T00:00:00`:i);return Number.isNaN(s)?-1/0:s};return(e??[]).map((t,i)=>({entry:t,index:i,at:n(t)})).sort((t,i)=>i.at-t.at||i.index-t.index).map(t=>t.entry)}var be=["completed","skipped","missed","reset","triggered","trigger_replaced","trigger_removed"];function Oi(e,n){let t=n.lang;return a`
    <div class="history-filters-new">
      <div class="filter-chips">
        ${be.map(i=>{let s=e.history.filter(l=>l.type===i).length;return s===0?d:a`
            <span class="filter-chip ${n.filter===i?"active":""}"
              @click=${()=>n.setFilter(n.filter===i?null:i)}>
              ${r(i,t)} (${s})
            </span>
          `})}
        ${n.filter?a`<span class="filter-chip clear" @click=${()=>n.setFilter(null)}>${r("show_all",t)}</span>`:d}
      </div>
      <div class="filter-controls">
        <input type="text" class="search-input" placeholder="${r("search_notes",t)}..." .value=${n.search} @input=${i=>n.setSearch(i.target.value)} />
      </div>
    </div>
  `}function zi(e,n){let t=n.lang,i=n.filter?e.history.filter(s=>s.type===n.filter):e.history;if(n.search){let s=n.search.toLowerCase();i=i.filter(l=>ct(l.notes,n.search)||ct(ut(l.notes,t),n.search)||(Zt(n,l)??"").toLowerCase().endsWith(s))}return i.length===0?a`<p class="empty">${r("no_history",t)}</p>`:a`
    <div class="history-timeline">
      ${ft(i).map(s=>gt(s,n))}
    </div>
  `}function Zt(e,n){return e.taskRef&&n.ref_no?`${e.taskRef}-${n.ref_no}`:null}function xe(e,n){let t=st(n);return t.length>0?a`<div class="history-photos">
        ${t.map(i=>a`<maintenance-history-photo .hass=${e} .docId=${i}></maintenance-history-photo>`)}
      </div>`:d}function $e(e,n){let t=n.lang,i=o=>y(o,t,{maximumFractionDigits:3}),s=o=>o==null?"":` (${o>=0?"+":""}${i(o)})`,l=nt(e);return l.length>0?a`<div class="history-readings">
      ${l.map(o=>a`<span class="history-reading">
        <span class="history-reading-name">${o.name}</span>
        <span class="history-reading-value">${i(o.value)}${o.unit?` ${o.unit}`:""}${s(n.readingSlotDelta?.(e,o.id))}</span>
      </span>`)}
    </div>`:e.reading_value!=null?a`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${r("reading_label",t)}</span>
      <span class="history-reading-value">${i(e.reading_value)}${n.readingUnit?` ${n.readingUnit}`:""}${s(n.readingDelta?.(e))}</span>
    </span></div>`:d}function gt(e,n,t={}){let i=n.lang,{compact:s=!1,showRef:l=!0,showBadges:o=!0,showEdit:c=!0}=t,h=n.openEdit,m=c&&!!h&&ve.includes(e.type),g=typeof e.parts_cost=="number"?e.parts_cost:null,k=e.cost_basis==="use",O=k&&!!e.purchase;return a`
    <div class="history-entry${s?" compact":""}">
      ${s?d:a`<div class="history-icon ${e.type}">
            <ha-icon .icon=${X[e.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        <div class="history-row">
          <strong>${r(e.type,i)}</strong>
          ${l?Yt(Zt(n,e),r("ref_number",i)):d}
          ${o&&e.phase_id?a`<span class="history-phase-badge">${n.phaseNames?.[e.phase_id]||e.phase_id}</span>`:d}
          ${o&&e.auto?a`<span class="history-auto-badge">${r("history_auto",i)}</span>`:d}
          ${m?a`<button class="history-edit-btn"
                     title=${r("history_edit_button",i)}
                     @click=${()=>h(e)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:d}
        </div>
        <div class="history-date">${et(e.timestamp,i)}</div>
        ${e.notes?a`<div>${ut(e.notes,i)}</div>`:d}
        ${xe(n.hass,e)}
        ${$e(e,n)}
        ${e.cost!=null||e.duration!=null||e.trigger_value!=null||g!=null?a`<div class="history-details">
              ${e.cost!=null?O?a`<span>${r("history_purchase_stock",i).replace("{amount}",N(e.cost,n.currencySymbol,i))}</span>`:a`<span>${r("cost",i)}: ${N(e.cost,n.currencySymbol,i)}</span>`:d}
              ${g!=null?a`<span title=${r(k?"history_parts_counted_hint":"history_parts_info_hint",i)}>${r(k?"history_parts_counted":"history_parts_info",i).replace("{amount}",N(g,n.currencySymbol,i))}</span>`:d}
              ${e.duration!=null?a`<span>${r("duration",i)}: ${it(e.duration,i)}</span>`:d}
              ${e.trigger_value!=null?a`<span>${r("trigger_val",i)}: ${e.trigger_value}</span>`:d}
            </div>`:d}
      </div>
    </div>
  `}var ke="var(--maint-done-color, #78909c)";function Y(e){return e.archived?"archived":e.is_done?"done":e.status||"ok"}function yt(e,n){return r(e==="done"?"completed":e,n)}function ot(e){let n=Y(e);return n==="done"?ke:bt[n]||"var(--disabled-color, #9e9e9e)"}function we(e){return X[e==="done"?"completed":e]||"mdi:circle-medium"}function Jt(e,n,t="pill"){let i=Y(e),s=yt(i,n);return t==="chip"?a`<span class="status-chip ${i}">${s}</span>`:a`<span class="status-badge ${i}" role="img" title="${s}" aria-label="${s}"><ha-icon icon="${we(i)}"></ha-icon><span class="status-label">${s}</span></span>`}function _(e){return e.toFixed(1)}function Gi(e,n,t=4){if(!isFinite(e)||!isFinite(n))return{ticks:[],niceMin:0,niceMax:1};if(e===n){let m=Math.abs(e)*.1||1;e-=m,n+=m}let i=n-e,s=Math.pow(10,Math.floor(Math.log10(i/Math.max(1,t)))),l=s;for(let m of[1,2,5,10])if(l=s*m,i/l<=t+.5)break;let o=Math.floor(e/l)*l,c=Math.ceil(n/l)*l,h=[];for(let m=o;m<=c+l*1e-6;m+=l)h.push(Math.abs(m)<l*1e-9?0:m);return{ticks:h,niceMin:o,niceMax:c}}function Ui(e,n){let t=Math.abs(e),i=s=>({maximumFractionDigits:s});return t>=1e6?y(e/1e6,n,i(t>=1e7?0:1))+"M":t>=1e4?y(e/1e3,n,i(0))+"k":t>=1e3?y(e/1e3,n,i(1))+"k":t>=100?y(e,n,i(0)):t>=1?y(e,n,i(1)):t===0?"0":y(e,n,i(2))}function Bi(e,n,t){let i=y(e,t,{maximumFractionDigits:Math.abs(e)>=100?0:1});return n?`${i} ${n}`:i}function Ki(e,n,t){return pt(new Date(e),n,t)}function Yi(e,n){let t=new Date(e);return`${pt(t,n)}, ${tt(t,n)}`}function Zi(e,n){return new Date(e).getFullYear()!==new Date(n).getFullYear()}function Ji(e,n,t){if(t<2||n<=e)return[e,n];let i=[];for(let s=0;s<t;s++)i.push(e+(n-e)*s/(t-1));return i}function Qt(e,n){let t=e.interval_analysis,i=t?.weibull_beta,s=t?.weibull_eta;if(i==null||s==null||s<=0)return d;let l=e.interval_days??0,o=e.suggested_interval??l;return a`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${r("weibull_reliability_curve",n)}
        ${Te(i,n)}
      </div>
      ${Ae(i,s,l,o,n)}
      ${Ee(t,n)}
      ${t?.confidence_interval_low!=null?Le(t,e,n):d}
    </div>
  `}function Te(e,n){let t,i,s;return e<.8?(t="early_failures",i="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",s="beta_early_failures"):e<=1.2?(t="random_failures",i="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",s="beta_random_failures"):e<=3.5?(t="wear_out",i="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",s="beta_wear_out"):(t="highly_predictable",i="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",s="beta_highly_predictable"),a`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${i}"></ha-svg-icon>
      ${r(s,n)} (\u03B2=${y(e,n,2)})
    </span>
  `}function Ae(e,n,t,i,s){let x=Math.max(t,i,n,1)*1.3,P=50,H=[];for(let w=0;w<=P;w++){let L=w/P*x,ce=1-Math.exp(-Math.pow(L/n,e)),pe=32+L/x*260,ue=136-ce*128;H.push([pe,ue])}let Z=H.map(([w,L])=>`${_(w)},${_(L)}`).join(" "),dt="M32,136 "+H.map(([w,L])=>`L${_(w)},${_(L)}`).join(" ")+` L${_(H[P][0])},136 Z`,j=32+t/x*260,J=1-Math.exp(-Math.pow(t/n,e)),Q=136-J*128,le=y((1-J)*100,s,0),vt=32+i/x*260,de=[0,.25,.5,.75,1];return a`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${r("chart_weibull",s)}">
        ${de.map(w=>{let L=136-w*128;return q`
            <line x1="${32}" y1="${_(L)}" x2="${292}" y2="${_(L)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${w===.5?"4,3":d}" />
            <text x="${28}" y="${_(L+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${y(w*100,s,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(x/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(x)}</text>

        <path d="${dt}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${Z}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?q`
          <line x1="${_(j)}" y1="${8}" x2="${_(j)}" y2="${_(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${_(j)}" cy="${_(Q)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${_(j+4)}" y="${_(Q-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${le}%</text>
        `:d}

        ${i>0&&i!==t?q`
          <line x1="${_(vt)}" y1="${8}" x2="${_(vt)}" y2="${_(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:d}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${r("weibull_failure_probability",s)}</span>
      ${t>0?a`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${r("current_interval_marker",s)}</span>`:d}
      ${i>0&&i!==t?a`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${r("recommended_marker",s)}</span>`:d}
    </div>
  `}function Ee(e,n){return a`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${r("characteristic_life",n)}</span>
        <span class="weibull-info-value">${Math.round(e.weibull_eta)} ${r("days",n)}</span>
      </div>
      ${e.weibull_r_squared!=null?a`
        <div class="weibull-info-item">
          <span>${r("weibull_r_squared",n)}</span>
          <span class="weibull-info-value">${y(e.weibull_r_squared,n,3)}</span>
        </div>
      `:d}
    </div>
  `}function Le(e,n,t){let i=e.confidence_interval_low,s=e.confidence_interval_high,l=n.suggested_interval??n.interval_days??0,o=n.interval_days??0,c=Math.max(0,i-5),m=s+5-c,g=(i-c)/m*100,k=(s-i)/m*100,O=(l-c)/m*100,x=o>0?(o-c)/m*100:-1;return a`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${r("confidence_interval",t)}: ${l} ${r("days",t)} (${i}\u2013${s})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${_(g)}%;width:${_(k)}%"></div>
        ${x>=0?a`<div class="confidence-marker current" style="left:${_(x)}%"></div>`:d}
        <div class="confidence-marker recommended" style="left:${_(O)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${r("confidence_conservative",t)} (${i}${r("days",t).charAt(0)})</span>
        <span class="confidence-text high">${r("confidence_aggressive",t)} (${s}${r("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function Xt(e,n,t){let i=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data",s=e.days_until_threshold!=null,l=e.environmental_factor!=null&&e.environmental_factor!==1;if(!i&&!s&&!l)return d;let o=e.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":e.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return a`
    <div class="prediction-section">
      ${e.sensor_prediction_urgency?a`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${r("sensor_prediction_urgency",n).replace("{days}",String(Math.round(e.days_until_threshold||0)))}
        </div>
      `:d}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${r("sensor_prediction",n)}
      </div>
      <div class="prediction-grid">
        ${i?a`
          <div class="prediction-item">
            <ha-svg-icon path="${o}"></ha-svg-icon>
            <span class="prediction-label">${r("degradation_trend",n)}</span>
            <span class="prediction-value ${e.degradation_trend}">${r("trend_"+e.degradation_trend,n)}</span>
            ${e.degradation_rate!=null?a`<span class="prediction-rate">${e.degradation_rate>0?"+":""}${y(e.degradation_rate,n,Math.abs(e.degradation_rate)>=10?0:1)} ${e.trigger_entity_info?.unit_of_measurement||""}/${r("day_short",n)}</span>`:d}
          </div>
        `:d}
        ${s?a`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${r("days_until_threshold",n)}</span>
            <span class="prediction-value prediction-days${e.days_until_threshold===0?" exceeded":e.sensor_prediction_urgency?" urgent":""}">${e.days_until_threshold===0?r("threshold_exceeded",n):"~"+Math.round(e.days_until_threshold)+" "+r("days",n)}</span>
            ${e.threshold_prediction_date?a`<span class="prediction-date">${B(e.threshold_prediction_date,n)}</span>`:d}
            ${e.threshold_prediction_confidence?a`<span class="confidence-dot ${e.threshold_prediction_confidence}"></span>`:d}
            ${(e.prediction_cycles??0)>0?a`<span class="prediction-cycles">${r("prediction_cycles",n)}: ${e.prediction_cycles}</span>`:d}
          </div>
        `:d}
        ${l&&t.environmental?a`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${r("environmental_adjustment",n)}</span>
            <span class="prediction-value">${y(e.environmental_factor,n,2)}x</span>
            ${e.environmental_entity?a`<span class="prediction-entity entity-link" @click=${c=>Lt(c,e.environmental_entity)}>${e.environmental_entity}</span>`:d}
          </div>
        `:d}
      </div>
    </div>
  `}function te(e,n,t,i){let s=Math.max(e||1,n);return a`
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
  `}var ee=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function ie(e,n,t){if(!t.seasonal||!e.seasonal_factor||e.seasonal_factor===1)return d;let i=ee.map(c=>r(c,n)),s=new Date().getMonth(),l=e.seasonal_factors||e.interval_analysis?.seasonal_factors||null,o=l&&l.length===12?l:i.map((c,h)=>{let m=e.seasonal_factor||1,g=Math.sin((h-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,m+g))});return a`
    <div class="seasonal-card-compact">
      <h4>${r("seasonal_awareness",n)}</h4>
      <div class="seasonal-mini-chart">
        ${o.map((c,h)=>{let m=c*40,g=c<.9?"low":c>1.1?"high":"normal";return a`
            <div class="seasonal-bar ${g} ${h===s?"current":""}"
                 style="height: ${m}px"
                 title="${i[h]}: ${y(c,n,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${r("shorter",n)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${r("normal",n)}</span>
        <span class="legend-item"><span class="dot high"></span> ${r("longer",n)}</span>
      </div>
    </div>
  `}function ne(e,n){return Se(e,n)}function Se(e,n){let t=e.seasonal_factors??e.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return d;let i=e.interval_analysis?.seasonal_reason,s=new Date().getMonth(),l=300,o=100,c=8,m=o-c-4,g=Math.max(...t,1.5),k=l/12,O=k*.65,x=c+m-1/g*m;return a`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${r("seasonal_chart_title",n)}
        ${i?a`<span class="source-tag">${i==="learned"?r("seasonal_learned",n):r("seasonal_manual",n)}</span>`:d}
      </div>
      <svg viewBox="0 0 ${l} ${o}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${r("chart_seasonal",n)}">
        <line x1="0" y1="${_(x)}" x2="${l}" y2="${_(x)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((P,H)=>{let Z=P/g*m,dt=H*k+(k-O)/2,j=c+m-Z,J=H===s,Q=P<1?"var(--success-color, #4caf50)":P>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return q`
            <rect x="${_(dt)}" y="${_(j)}"
              width="${_(O)}" height="${_(Z)}"
              fill="${Q}" opacity="${J?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${ee.map((P,H)=>a`<span class="seasonal-label ${H===s?"active-month":""}">${r(P,n)}</span>`)}
      </div>
    </div>
  `}var f=class extends S{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showPostpone=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._postponeDate="";this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._toastTimer=new Nt;this._access=rt;this._currencySymbol="";this._partsCostMode="purchase";this._loadSeq=0}get _lang(){return A(this.hass)}async openFor(t,i){(t!==this._entryId||i!==this._taskId)&&(this._task=null),this._entryId=t,this._taskId=i,this._error="",this._showSkip=!1,this._showReset=!1,this._showPostpone=!1,this._showAdaptive=!1,this._skipReason="",this._postponeDate="",this._resetDate=Rt(new Date),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let t=await C(this.hass);this._features={...this._features,...t.features},this._access=t.access,this._currencySymbol=U(t.budget??void 0),kt(t.budget??void 0),this._partsCostMode=t.partsCostMode}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(t,i){this._toast=t,this._toastTimer.schedule(()=>{this._toast=""},i)}async _loadTask(){let t=this._entryId,i=this._taskId;if(!t||!i)return;let s=++this._loadSeq,l="",o=await M(this,{type:"maintenance_supporter/object",entry_id:t},{onError:h=>{l=h}});if(s!==this._loadSeq)return;if(o===void 0){this._error=l;return}this._objectName=o?.object?.name||"";let c=(o?.tasks||[]).find(h=>h.id===i);this._task=c??null,this._taskRef=Kt(o?.object,c),c||(this._error=r("ws_err_not_found",this._lang))}_runWs(t){return this._error="",M(this,t,{busy:i=>{this._busy=i},onError:i=>{this._error=i}})}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-FGPZ3MEC.js").then(async({openCompleteDialog:t})=>{let i=this._task,s=[];try{s=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}t(Gt({entryId:this._entryId,taskId:this._taskId,taskName:i.name,task:i,objects:s,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol,partsCostMode:this._partsCostMode}))&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})!==void 0&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})!==void 0&&(this._notifyChanged("reset"),this.close())}async _onPostponeConfirm(){if(!this._entryId||!this._taskId||!this._postponeDate)return;await this._runWs({type:"maintenance_supporter/task/postpone",entry_id:this._entryId,task_id:this._taskId,until:this._postponeDate})!==void 0&&(this._notifyChanged("postpone"),this.close())}async _onSnooze(){if(!this._entryId||!this._taskId)return;let t=await this._runWs({type:"maintenance_supporter/task/snooze",entry_id:this._entryId,task_id:this._taskId});t!==void 0&&(this._notifyChanged("snooze"),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:Wt(t,this._lang)},bubbles:!0,composed:!0})),this.close())}_onEdit(){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-FGPZ3MEC.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-FGPZ3MEC.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId||!await z(this.hass,{title:r("delete",this._lang),message:r("delete_task_confirm",this._lang),confirmText:r("delete",this._lang),danger:!0}))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})!==void 0&&(this._showToast(r("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!this._entryId||!this._taskId)return;let t=await this._runWs({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});t!==void 0&&(this._showToast(t?.recommended_interval?`${r("reanalyze_result",this._lang)}: ${At(t.recommended_interval,"days",this._lang)} (${t.data_points} ${r("data_points",this._lang)})`:r("reanalyze_insufficient_data",this._lang)),await this._loadTask())}_onEditHistoryEntry(t){if(!this._entryId||!this._taskId)return;let i=_t(this._entryId,this._taskId,t,this._task);import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-FGPZ3MEC.js").then(({openHistoryEditDialog:s})=>s(i))}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return d;let i=this._lang;return a`
      <div class="recommendation-card">
        <h4>${r("suggested_interval",i)}</h4>
        ${te(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",i)}
        <div class="recommendation-actions">
          ${F(this.hass?.user,this._access)?a`<button class="btn primary qa-apply-suggestion"
                @click=${this._applySuggestion} ?disabled=${this._busy}>
                <ha-icon icon="mdi:check"></ha-icon>
                ${r("apply_suggestion",i)}
              </button>`:d}
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${r("reanalyze",i)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(t){let i=this._lang,s=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,l=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,o=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,c=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!s&&!l&&!o&&!c?a`<div class="adaptive-empty">
        ${r("adaptive_no_data",i)}
      </div>`:a`
      <div class="adaptive-stack">
        ${this._toast?a`<div class="toast">${this._toast}</div>`:d}
        ${s?this._renderRecommendation(t):d}
        ${l?Xt(t,i,this._features):d}
        ${o?Qt(t,i):d}
        ${c?a`
          ${ie(t,i,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?ne(t,i):d}
        `:d}
      </div>
    `}_renderDetails(t){let i=this._lang,s=t.history||[],l=t.history_count??s.length,o=ft(s).slice(0,20);return a`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${r("times_performed",i)}</span>
            <span class="stat-value">${t.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${r("total_cost",i)}</span>
            <span class="stat-value">${N(t.total_cost??0,this._currencySymbol,i)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${r("avg_duration",i)}</span>
            <span class="stat-value">${it(t.average_duration!=null?Math.round(t.average_duration):null,i)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${r("history",i)}</strong>
          <span class="history-count">${l}</span>
        </div>
        ${s.length===0?a`<div class="history-empty">${r("history_empty",i)}</div>`:a`
              <div class="history-list">
                ${o.map(c=>gt(c,{lang:i,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:F(this.hass?.user,this._access)?h=>this._onEditHistoryEntry(h):void 0,readingUnit:t.reading_unit,readingSlotDelta:(h,m)=>Dt(s,h,m),taskRef:this._taskRef},{compact:!0}))}
                ${l>o.length?a`<div class="history-more">… +${l-o.length} ${r("older_entries",i)}</div>`:d}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return d;let t=this._lang,i=this._task,s=F(this.hass?.user,this._access),l=!!i&&(!!i.archived||i.enabled===!1||i.status==="paused");return W(()=>this.close(),a`
        ${i?a`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${ot(i)}"></span>
                  <span class="task-name">${i.name}</span>
                  ${Jt(i,t)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-FGPZ3MEC.js").then(({openObjectQuickActions:o})=>{o(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${i.next_due?a`<span><strong>${r("next_due",t)}:</strong> ${B(i.next_due,t)}</span>`:d}
                  ${i.last_performed?a`<span><strong>${r("last_performed",t)}:</strong> ${B(i.last_performed,t)}</span>`:d}
                  ${i.schedule?.kind&&!["manual","one_time"].includes(i.schedule.kind)||i.interval_days!=null?a`<span><strong>${r("interval",t)}:</strong> ${Et(i,t)}</span>`:d}
                  ${K(i)?a`<span><strong>${r("phase_current",t)}:</strong> ${K(i)}</span>`:d}
                </div>
                ${i.notes?a`<div class="notes-body">${at(i.notes)}</div>`:d}
              </div>

              ${this._error?a`<div class="error">${this._error}</div>`:d}

              ${this._showSkip?a`
                    <div class="inline-form">
                      <label>${r("skip_reason",t)}</label>
                      <input type="text" .value=${this._skipReason}
                        @input=${o=>{this._skipReason=o.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${r("cancel",t)}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${r("skip",t)}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?a`
                    <div class="inline-form">
                      <label>${r("reset_to_date",t)}</label>
                      <ms-date-field
                        kind="date"
                        .hass=${this.hass}
                        .lang=${t}
                        .value=${this._resetDate}
                        @value-changed=${o=>{this._resetDate=o.detail.value}}
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
                  `:this._showPostpone?a`
                    <div class="inline-form">
                      <label>${r("postpone_date_prompt",t)}</label>
                      <ms-date-field
                        kind="date"
                        .hass=${this.hass}
                        .lang=${t}
                        .value=${this._postponeDate}
                        @value-changed=${o=>{this._postponeDate=o.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showPostpone=!1}} ?disabled=${this._busy}>
                          ${r("cancel",t)}
                        </button>
                        <button class="btn primary qa-postpone-confirm" @click=${this._onPostponeConfirm}
                          ?disabled=${this._busy||!this._postponeDate}>
                          ${r("postpone",t)}
                        </button>
                      </div>
                    </div>
                  `:a`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${this._onComplete} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${r("complete",t)}
                      </ha-button>
                      ${i.allow_skip!==!1?a`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${r("skip",t)}
                            </ha-button>
                          `:d}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${r("reset",t)}
                      </ha-button>
                    </div>
                    <!-- QR is read tier (the panel offers it to operators too);
                         Edit / Archive / Delete follow canWrite() — the panel's
                         operator delegation, not is_admin alone. -->
                    <div class="actions secondary-row">
                      ${s?a`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-edit" @click=${this._onEdit} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                            ${r("edit",t)}
                          </ha-button>`:d}
                      <ha-button size="small" appearance="outlined" variant="neutral" class="qa-qr" @click=${this._onQr} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                        ${r("qr_code",t)}
                      </ha-button>
                      ${l?d:a`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-postpone"
                            @click=${()=>{this._showPostpone=!0}} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:calendar-arrow-right"></ha-icon>
                            ${r("postpone",t)}…
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="neutral" class="qa-snooze" @click=${this._onSnooze} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:bell-sleep-outline"></ha-icon>
                            ${r("snooze",t)}
                          </ha-button>`}
                      ${s?a`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-archive"
                            @click=${i.archived?this._onUnarchive:this._onArchive}
                            .disabled=${this._busy}>
                            <ha-icon slot="start" icon="${i.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                            ${i.archived?r("unarchive",t):r("archive",t)}
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="danger" class="danger qa-delete" @click=${this._onDelete} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                            ${r("delete",t)}
                          </ha-button>`:d}
                    </div>
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?r("hide_details",t):r("show_details",t)}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?a`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?r("hide_stats",t):r("show_stats",t)}
                          </button>`:d}
                    </div>
                    ${this._showDetails?this._renderDetails(i):d}
                    ${this._showAdaptive?this._renderAdaptive(i):d}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${r("open_in_panel",t)}
                      </button>
                    </div>
                  `}
            `:this._error?a`<div class="error">${this._error}</div>`:a`<div class="loading">${r("loading",t)}</div>`}
    `)}updated(t){t.has("_open")&&this._open&&G(this.shadowRoot)}};f.styles=[Pt,V,$`
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
    .notes-body {
      margin-top: 8px; padding: 8px; border-radius: 6px;
      background: var(--secondary-background-color);
      font-size: 13px; white-space: pre-wrap; word-break: break-word;
    }
    .notes-body ha-markdown { white-space: normal; }
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
  `],p([T({attribute:!1})],f.prototype,"hass",2),p([u()],f.prototype,"_open",2),p([u()],f.prototype,"_entryId",2),p([u()],f.prototype,"_taskId",2),p([u()],f.prototype,"_task",2),p([u()],f.prototype,"_objectName",2),p([u()],f.prototype,"_taskRef",2),p([u()],f.prototype,"_busy",2),p([u()],f.prototype,"_error",2),p([u()],f.prototype,"_showSkip",2),p([u()],f.prototype,"_showReset",2),p([u()],f.prototype,"_showPostpone",2),p([u()],f.prototype,"_showDetails",2),p([u()],f.prototype,"_showAdaptive",2),p([u()],f.prototype,"_skipReason",2),p([u()],f.prototype,"_resetDate",2),p([u()],f.prototype,"_postponeDate",2),p([u()],f.prototype,"_features",2),p([u()],f.prototype,"_toast",2),p([u()],f.prototype,"_access",2),p([u()],f.prototype,"_partsCostMode",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",f);function se(e){return!!e&&/^https?:\/\//i.test(e)}var E=class extends S{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=rt}get _lang(){return A(this.hass)}async openFor(t){this._entryId=t,this._error="",this._open=!0,await Promise.all([this._load(),C(this.hass).then(i=>{this._access=i.access})])}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(!this._entryId)return;let t=await M(this,{type:"maintenance_supporter/object",entry_id:this._entryId},{onError:i=>{this._error=i}});t!==void 0&&(this._data=t)}_runWs(t){return this._error="",M(this,t,{busy:i=>{this._busy=i},onError:i=>{this._error=i}})}_onEditObject(){!this._entryId||!this._data||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-FGPZ3MEC.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-FGPZ3MEC.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await z(this.hass,{title:r("delete",this._lang),message:r("delete_object_confirm",this._lang),confirmText:r("delete",this._lang),danger:!0}))return;let i=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:i})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:i},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t&&!await z(this.hass,{title:r("archive_object",this._lang),message:r("confirm_archive_object",this._lang),confirmText:r("archive_object",this._lang)}))return;let i=this._entryId;await this._runWs({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:i})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:i},bubbles:!0,composed:!0})),this.close())}_onTaskClick(t){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-FGPZ3MEC.js").then(({openTaskQuickActions:i})=>{i(this._entryId,t)})}render(){if(!this._open)return d;let t=this._lang,i=this._data,s=i?.object,l=i?.tasks||[],o=F(this.hass?.user,this._access);return W(()=>this.close(),a`
        ${i&&s?a`
              <div class="header">
                <div class="title">${s.name}</div>
                ${this._renderMetaRow(s)}
              </div>

              ${this._error?a`<div class="error">${this._error}</div>`:d}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${r("tasks",t)}</strong>
                  <span class="count">${l.length}</span>
                </div>
                ${l.length===0?a`<div class="empty">${r("no_tasks",t)}</div>`:a`
                      <div class="task-list">
                        ${l.map(c=>a`
                          <div class="task-row" @click=${()=>this._onTaskClick(c.id)}>
                            <span class="status-dot" style="background: ${ot(c)}"></span>
                            <span class="task-name">${c.name}</span>
                            <span class="task-status ${Y(c)}">${yt(Y(c),t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${s.notes?a`
                    <div class="notes-section">
                      <strong>${r("object_notes_label",t)}</strong>
                      <div class="notes-body">${at(s.notes)}</div>
                    </div>
                  `:d}

              ${o?a`
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
                  `:d}
            `:a`<div class="loading">${r("loading",t)}</div>`}
    `)}updated(t){t.has("_open")&&this._open&&G(this.shadowRoot)}_renderMetaRow(t){let i=this._lang,s=[];return t.area_id&&s.push([r("area",i),t.area_id]),t.manufacturer&&s.push([r("manufacturer",i),t.manufacturer]),t.model&&s.push([r("model",i),t.model]),t.serial_number&&s.push([r("serial_number_label",i),t.serial_number]),t.installation_date&&s.push([r("installed",i),t.installation_date]),t.warranty_expiry&&s.push([r("warranty",i),t.warranty_expiry]),t.documentation_url&&s.push([r("documentation_url_label",i),t.documentation_url]),s.length===0?d:a`
      <div class="meta">
        ${s.map(([l,o])=>a`
            <div class="meta-item">
              <span class="meta-label">${l}</span>
              <span class="meta-value">${se(o)?a`<a href="${o}" target="_blank" rel="noopener noreferrer">${o}</a>`:o}</span>
            </div>
          `)}
      </div>
    `}};E.styles=[V,$`
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
  `],p([T({attribute:!1})],E.prototype,"hass",2),p([u()],E.prototype,"_open",2),p([u()],E.prototype,"_entryId",2),p([u()],E.prototype,"_data",2),p([u()],E.prototype,"_busy",2),p([u()],E.prototype,"_error",2),p([u()],E.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",E);var re="maintenance-object-dialog",ae="maintenance-task-dialog",Pe="maintenance-history-edit-dialog",He="maintenance-complete-dialog",Re="maintenance-qr-dialog",Ie="maintenance-task-quick-actions-dialog",Me="maintenance-object-quick-actions-dialog";function lt(){return document.querySelector("home-assistant")?.hass}function Ce(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function R(e){let n=Ce(),t=n.querySelector(e)??document.body.querySelector(e);return t?t.parentNode!==n&&n.appendChild(t):(t=document.createElement(e),n.appendChild(t)),t}function I(e){let n=lt();if(!n)return!1;e.hass=n;let t=A(n);return xt(t)||$t(t).then(()=>{e.requestUpdate?.()}),wt(n.locale,n.config?.country),!0}function cs(e){return C(e).then(n=>n.rowActionStyle)}function ps(){zt()}function us(){let e=R(re);return I(e)?(e.openCreate(),!0):!1}function hs(e,n){let t=R(re);return I(t)?(t.openEdit(e,n),!0):!1}function ms(e="",n){let t=R(ae);if(!I(t))return!1;let i=lt();return i?((async()=>{let s=await C(i),l=t;oe(l,s),l.openCreate(e,n)})(),!0):!1}function oe(e,n){e.checklistsEnabled=n.features.checklists,e.scheduleTimeEnabled=n.features.schedule_time,e.completionActionsEnabled=n.features.completion_actions,e.adaptiveFeature=n.features.adaptive,e.seasonalFeature=n.features.seasonal,e.environmentalFeature=n.features.environmental,e.defaultWarningDays=n.defaultWarningDays}function _s(e,n){let t=R(ae);if(!I(t))return!1;let i=lt();return i?((async()=>{try{let[s,l]=await Promise.all([i.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e}),C(i)]),o=(s.tasks||[]).find(h=>h.id===n);if(!o){console.warn(`openEditTaskDialog: task ${n} not found in entry ${e}`);return}let c=t;oe(c,l),await c.openEdit(e,o)}catch(s){console.warn("openEditTaskDialog: failed to load task/features",s)}})(),!0):!1}function fs(e){let n=R(Pe);return I(n)?(n.openEdit(e),!0):!1}function gs(e){let n=R(He);return I(n)?(Ut(n,e,A(lt())),!0):!1}function ys(e){let n=R(Re);return I(n)?(n.openForTask(e.entry_id,e.task_id,e.object_name,e.task_name),!0):!1}function vs(e,n){let t=R(Ie);return I(t)?(t.openFor(e,n),!0):!1}function bs(e){let n=R(Me);return I(n)?(n.openFor(e),!0):!1}export{se as a,ye as b,Kt as c,Ei as d,Yt as e,at as f,_e as g,fe as h,mt as i,Gt as j,Ut as k,_ as l,Gi as m,Ui as n,Bi as o,Ki as p,Yi as q,Zi as r,Ji as s,_t as t,wi as u,Wt as v,ft as w,Oi as x,zi as y,gt as z,Jt as A,Qt as B,Xt as C,te as D,ie as E,ne as F,cs as G,ps as H,us as I,hs as J,ms as K,_s as L,fs as M,gs as N,ys as O,vs as P,bs as Q};
