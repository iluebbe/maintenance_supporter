/*! maintenance_supporter frontend 2.97.1 */
import{a as dt,b as V,e as M,f as Vt,g as Ut}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-MZYTETHB.js";import{a as ft}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LIF4COAB.js";import{b as Ot}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-Z5US4BJZ.js";import{b as mt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-O7BSORZB.js";import{b as Ft,c as Gt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-3IYNRP2J.js";import{a as lt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-SQZSAJJG.js";import{b as zt,c as jt,f as ot,g as qt,i as Nt,l as Wt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-JOWEQYBZ.js";import{j as gt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-GSRF4WCQ.js";import{a as C}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-SZUQQHGZ.js";import{$ as Mt,A as st,C as Et,F as B,H as A,I as Lt,J as St,K as g,L as z,M as Pt,N as nt,O as K,P as rt,Q as Ht,S as Rt,T as at,Y as _t,Z as It,_ as Ct,a as p,b as $,ba as Dt,c as o,d as N,f as d,h as S,l as T,m as h,n as wt,q as tt,s as r,t as Tt,u as At,w as et,x as F,y as it}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-CMVELGDC.js";var W=$`
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
`;function ve(e,s){e.key!=="Escape"||e.defaultPrevented||e.composedPath().some(t=>t instanceof Element&&t.localName==="ms-camera-capture")||(e.preventDefault(),e.stopPropagation(),s())}function G(e,s){return o`
    <div class="backdrop" @click=${e}></div>
    <div class="dialog" role="dialog" aria-modal="true" tabindex="-1"
      @keydown=${t=>ve(t,e)}>${s}</div>
  `}function U(e){e?.querySelector(".dialog")?.focus({preventScroll:!0})}var v=class extends S{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._options=null;this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel="",this._inputType="",this._options=null,this._inputValue="",this._open=!0,new Promise(i=>{this._resolve=i,this._promptResolve=null})}prompt(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel=t.inputLabel||"",this._inputType=t.inputType||"text",this._options=t.options&&t.options.length?t.options:null,this._inputValue=t.inputValue||"",this._open=!0,new Promise(i=>{this._promptResolve=i,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return d;let t=A(this.hass);return o`
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
    `}};v.styles=[Mt,$`
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
  `],p([T({attribute:!1})],v.prototype,"hass",2),p([h()],v.prototype,"_open",2),p([h()],v.prototype,"_title",2),p([h()],v.prototype,"_message",2),p([h()],v.prototype,"_confirmText",2),p([h()],v.prototype,"_danger",2),p([h()],v.prototype,"_inputLabel",2),p([h()],v.prototype,"_inputType",2),p([h()],v.prototype,"_options",2),p([h()],v.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",v);var Bt="maintenance-confirm-dialog",Kt="data-ms-lovelace-confirm";function be(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function j(e,s){let t=be(),i=t.querySelector(`${Bt}[${Kt}]`);return i||(i=document.createElement(Bt),i.setAttribute(Kt,""),t.appendChild(i)),i.hass=e,i.confirm(s)}var D=class extends S{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await Ot(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?d:this._url?o`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:o`<div class="ph"></div>`}};D.styles=$`
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
  `,p([T({attribute:!1})],D.prototype,"hass",2),p([T()],D.prototype,"docId",2),p([h()],D.prototype,"_url",2),p([h()],D.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",D);var b=class extends S{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._openGen=0;this._photos=new Gt(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return A(this.hass)}openEdit(t){this._openGen++,this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(t.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(t),this._loadPartOptions()}_seedReadings(t){let i=[],n=new Set;for(let a of t.readings??[])n.has(a.id)||(n.add(a.id),i.push({id:a.id,name:a.name,unit:a.unit??null}));for(let a of t.reading_values??[])n.has(a.id)||(n.add(a.id),i.push({id:a.id,name:a.name,unit:a.unit??null}));this._readingRows=i;let l={};for(let a of t.reading_values??[])l[a.id]=String(a.value);this._readingText=l,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let t={};for(let i of this._readingRows){let n=(this._readingText[i.id]??"").trim();if(n==="")continue;let l=parseFloat(n.replace(",","."));isNaN(l)||(t[i.id]=l)}return t}async _loadPartOptions(){let t=this._draft;if(!t)return;let i=this._openGen;try{let n=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});if(i!==this._openGen)return;let l=[];for(let c of n.parts||[]){let u=c.entry_id===t.entry_id,m=c.consumers.some(y=>y.entry_id===t.entry_id&&y.task_id===t.task_id);!u&&!m||l.push({part_id:c.part_id,name:c.name,entry_id:c.entry_id,foreign:!u,object_name:c.object_name})}for(let c of t.used_parts||[]){let u=c.entry_id||t.entry_id;l.some(m=>m.part_id===c.part_id&&m.entry_id===u)||l.push({part_id:c.part_id,name:c.name||c.part_id,entry_id:u,foreign:u!==t.entry_id,object_name:null})}let a={};for(let c of t.used_parts||[])a[`${c.entry_id||t.entry_id}:${c.part_id}`]=c.quantity??1;this._partOptions=l,this._partQty=a,this._partQtyOriginal=this._partSelectionKey()}catch{if(i!==this._openGen)return;this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,t])=>t>0).sort(([t],[i])=>t.localeCompare(i)))}close(){this._openGen++,this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(t,i){this._draft&&(this._draft={...this._draft,[t]:i})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let t=this._lang,n=(this._originalSnapshot.used_parts||[]).filter(u=>u.quantity>0).map(u=>`${g(u.quantity,t)}\xD7 ${u.name||u.part_id}`).join(", ");if(!await j(this.hass,{title:r("history_delete_entry",t),message:n?`${r("history_delete_confirm_entry",t)} ${r("history_delete_returns_parts",t).replace("{parts}",n)}`:r("history_delete_confirm_entry",t),confirmText:r("delete",t),danger:!0})||!this._draft||!this._originalSnapshot)return;let a=this._draft;this._error="",await this._runWs({type:"maintenance_supporter/task/history/delete",entry_id:a.entry_id,task_id:a.task_id,timestamp:this._originalSnapshot.original_timestamp})!==void 0&&(this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:a.entry_id,task_id:a.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close())}_runWs(t){return C(this,t,{busy:i=>{this._saving=i},onError:i=>{this._error=i}})}async _save(){if(!this._draft||!this._originalSnapshot||this._saving||this._photos.uploading)return;this._error="",this._photos.clearError();let t=this._draft,i=this._originalSnapshot,n={type:"maintenance_supporter/task/history/update",entry_id:t.entry_id,task_id:t.task_id,original_timestamp:i.original_timestamp};if(t.timestamp!==i.timestamp&&(n.timestamp=t.timestamp),t.notes!==i.notes&&(n.notes=t.notes),t.cost!==i.cost&&(n.cost=t.cost),t.duration!==i.duration&&(n.duration=t.duration),t.completed_by!==i.completed_by&&(n.completed_by=t.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(n.used_parts=(this._partOptions||[]).filter(a=>(this._partQty[`${a.entry_id}:${a.part_id}`]||0)>0).map(a=>({part_id:a.part_id,quantity:this._partQty[`${a.entry_id}:${a.part_id}`],...a.foreign?{entry_id:a.entry_id}:{}}))),t.reading_value!==i.reading_value&&(n.reading_value=t.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let a=this._readingNumbers(),c={};for(let u of this._readingRows)c[u.id]=a[u.id]??null;n.reading_values=c}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(n.photo_doc_ids=this._photos.ids),Object.keys(n).filter(a=>!["type","entry_id","task_id","original_timestamp"].includes(a)).length===0){this.close();return}await this._runWs(n)!==void 0&&(this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:t.entry_id,task_id:t.task_id,new_timestamp:t.timestamp},bubbles:!0,composed:!0})),this.close())}render(){if(!this._open||!this._draft)return d;let t=this._lang,i=this._draft,n=this._error||this._photos.errorText(t);return G(()=>this.close(),o`
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
          .helper=${Ht(t)}
          .value=${Et(i.timestamp)}
          @value-changed=${l=>{let a=l.detail.value;a&&this._set("timestamp",a)}}
        ></ms-date-field>
        <label>
          <span>${r("notes_label",t)}</span>
          <textarea
            rows="3"
            @input=${l=>{let a=l.target.value;this._set("notes",a||null)}}
            .value=${i.notes??""}></textarea>
        </label>
        <div class="row">
          <div class="cost-field">
            <span>${r("cost",t)}</span>
            <ms-cost-input .lang=${t} .value=${i.cost!=null?String(i.cost):""}
              @value-changed=${l=>{let a=l.detail.value;this._set("cost",a?Number(a):null)}}></ms-cost-input>
          </div>
          <label>
            <span>${r("duration",t)}</span>
            <input type="number" min="0" step="1" inputmode="numeric"
              .value=${i.duration!=null?String(i.duration):""}
              @input=${l=>{this._set("duration",Wt(l.target.value))}} />
          </label>
        </div>
        ${this._renderReadings(i,t)}
        ${this._partOptions&&this._partOptions.length>0?o`
          <div class="parts-block">
            <span class="parts-title">${r("complete_parts_used",t)}</span>
            ${this._partOptions.map(l=>{let a=`${l.entry_id}:${l.part_id}`,c=this._partQty[a]||0;return o`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${c>0}
                    @change=${u=>{let m=u.target.checked;this._partQty={...this._partQty,[a]:m?1:0}}} />
                  <span class="part-label">${l.name}${l.foreign&&l.object_name?` (${l.object_name})`:""}</span>
                  ${c>0?o`
                    <input class="part-qty" type="number" min=${gt[0]} max=${gt[1]} step="0.01"
                      .value=${String(c)}
                      @input=${u=>{let m=parseFloat(u.target.value);!isNaN(m)&&m>0&&(this._partQty={...this._partQty,[a]:m})}} />
                  `:d}
                </label>
              `})}
          </div>
        `:d}
        <div class="photos-block">
          <span class="parts-title">${r("completion_photos",t)}</span>
          ${this._photos.photos.length>0?o`
            <div class="photo-strip">
              ${this._photos.photos.map(l=>o`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${l.id}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${r("remove",t)}
                    @click=${()=>this._photos.remove(l.id)}>✕</button>
                </div>`)}
            </div>`:d}
          ${this._photos.full?o`<span class="photos-hint">${r("photos_limit",t).replace("{max}",String(this._photos.max))}</span>`:o`<ms-photo-picker .lang=${t} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${l=>this._photos.addFiles(l.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${r("history_edit_photos_hint",t)}</span>
        </div>
        ${n?o`<div class="error">${n}</div>`:d}
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
    `)}updated(t){t.has("_open")&&this._open&&U(this.shadowRoot)}_renderReadings(t,i){return this._readingRows.length>0?o`
        <div class="readings-block">
          <span class="parts-title">${r("readings_section",i)}</span>
          ${this._readingRows.map(n=>o`
            <label class="reading-row-edit">
              <span class="reading-row-name">${n.name}${n.unit?` (${n.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[n.id]??""}
                @input=${l=>{this._readingText={...this._readingText,[n.id]:l.target.value}}} />
            </label>
          `)}
        </div>`:t.reading_value==null&&t.task_type!=="reading"?d:o`
      <label>
        <span>${r("reading_value_label",i)}${t.reading_unit?` (${t.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${t.reading_value!=null?String(t.reading_value):""}
          @input=${n=>{let l=n.target.value,a=l===""?NaN:Number(l);this._set("reading_value",isNaN(a)?null:a)}} />
      </label>`}};b.styles=[Ft,W,$`
    :host { display: contents; --ms-modal-max-height: 90vh; --ms-modal-gap: 12px; }
    h2 { margin: 0; font-size: 18px; }
    .entry-type {
      display: flex; align-items: center; gap: 6px;
      color: var(--secondary-text-color); font-size: 13px;
    }
    label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
    label span { color: var(--secondary-text-color); }
    .cost-field { display: flex; flex-direction: column; gap: 4px; font-size: 13px; min-width: 0; }
    .cost-field > span { color: var(--secondary-text-color); }
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
  `],p([T({attribute:!1})],b.prototype,"hass",2),p([h()],b.prototype,"_open",2),p([h()],b.prototype,"_saving",2),p([h()],b.prototype,"_error",2),p([h()],b.prototype,"_draft",2),p([h()],b.prototype,"_partOptions",2),p([h()],b.prototype,"_partQty",2),p([h()],b.prototype,"_readingRows",2),p([h()],b.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",b);function Zt(e,s,t=new Date){let i=e?.hours,n=st(e?.snoozed_until);if(typeof i!="number"||!Number.isFinite(n))return r("snoozed",s);let l=et(),c=F(n,l)===F(t,l)?nt(new Date(n),s):rt(e.snoozed_until,s);return(i===1?r("snoozed_for_one",s):r("snoozed_for",s).replace("{hours}",g(i,s))).replace("{until}",c)}function xe(e,s){if(s<=0)return 0;let t=typeof e=="number"&&Number.isFinite(e)?Math.trunc(e):0;return t<0?0:t%s}function $e(e){return!!(e?.phases&&e.phase_sequence&&e.phase_sequence.length>0)}function yt(e){if(!e||!$e(e))return null;let s=e.phase_sequence,t=xe(e.phase_cursor,s.length),i=s[t],n=e.phases?.[i];return n?{id:i,name:n.name,index:t,count:s.length,notes:n.notes,checklist:n.checklist!==void 0?n.checklist:e.checklist??[],consumesParts:n.consumes_parts!==void 0?n.consumes_parts:e.consumes_parts??[],requiredFields:n.required_completion_fields!==void 0?n.required_completion_fields:e.required_completion_fields??[]}:null}function Z(e){let s=yt(e);return s?`${s.index+1}/${s.count} \xB7 ${s.name}`:""}function ke(e,s){return typeof e=="number"&&Number.isFinite(e)&&e>=.01?e:s}function Yt(e){let s=e.task??null,t=s?yt(s):null,i=t?t.consumesParts:s?.consumes_parts||[],n=!!s?.part_ref,l=e.objects.find(y=>y.entry_id===e.entryId)?.parts||[],a=n?l.find(y=>y.id===s.part_ref.part_id):void 0,c=e.features?e.features.checklists:e.checklistsEnabled??!0,u=e.features?e.features.checklists?e.checklist??s?.checklist??[]:[]:e.checklist??[],m=e.features?e.features.adaptive&&(e.adaptiveEnabled??!!s?.adaptive_config?.enabled):!!e.adaptiveEnabled;return{entry_id:e.entryId,task_id:e.taskId,task_name:e.taskName,checklist:t?c?t.checklist:[]:u,adaptive_enabled:m,required_completion_fields:t?t.requiredFields:s?.required_completion_fields||[],task_type:s?.type||"",reading_unit:s?.reading_unit||"",readings:s?.readings||[],reading_history:qt(s?.history),parts:n?[]:jt({consumes_parts:i},e.entryId,e.objects,e.lang),consumes_parts:n?[]:i,phase_label:t?Z(s):"",require_tag_scan:!!s?.require_tag_scan,restock_default:n?ke(a?.restock_quantity,1):null,restock_unit_cost:n?a?.cost??null:null,restock_package:n&&a?.package_size?Pt(a.package_size,a.unit,e.lang):"",currency_symbol:B({currency_symbol:e.currencySymbol}),consumes_info:i.map(y=>zt(y,e.entryId,e.objects,e.lang)),checklist_prefill:s?.checklist_progress||{},via_tag_scan:!!e.viaTagScan,parts_cost_mode:e.partsCostMode??"purchase"}}function Jt(e,s,t){e.entryId=s.entry_id,e.taskId=s.task_id,e.taskName=s.task_name,e.lang=t,e.checklist=s.checklist??[],e.adaptiveEnabled=!!s.adaptive_enabled,e.requiredFields=s.required_completion_fields??[],e.taskType=s.task_type??"",e.readingUnit=s.reading_unit??"",e.readings=s.readings??[],e.readingHistory=s.reading_history??[],e.parts=s.parts??[],e.consumesParts=s.consumes_parts??[],e.phaseLabel=s.phase_label??"",e.requireTagScan=!!s.require_tag_scan,e.restockDefault=s.restock_default??null,e.restockUnitCost=s.restock_unit_cost??null,e.restockPackage=s.restock_package??"",e.currencySymbol=B(s),e.consumesInfo=s.consumes_info??[],e.checklistPrefill=s.checklist_prefill??{},e.viaTagScan=!!s.via_tag_scan,e.partsCostMode=s.parts_cost_mode??"purchase",e.open({viaTagScan:!!s.via_tag_scan})}function ct(e){return e?customElements.get("ha-markdown")?o`<ha-markdown class="notes-md" .content=${e} breaks></ha-markdown>`:o`${e}`:d}function vt(e,s,t,i){let n=t,l=u=>typeof u=="string"?u:null,a=u=>typeof u=="number"?u:null,c=l(n.timestamp)??"";return{entry_id:e,task_id:s,original_timestamp:c,type:l(n.type)||"completed",timestamp:c,notes:l(n.notes),cost:a(n.cost),duration:a(n.duration),completed_by:l(n.completed_by),used_parts:Array.isArray(n.used_parts)?n.used_parts:null,photo_doc_ids:lt(n),reading_value:a(n.reading_value),reading_values:ot(n),readings:i?.readings??[],task_type:i?.type??null,reading_unit:i?.reading_unit??null}}async function Ri(e,s,t,i){let l=(await e.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:s})).tasks?.find(c=>c.id===t);if(!l)return null;let a=l.history?.find(c=>c.timestamp===i);return a||(a=(await e.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:s,task_id:t})).history?.find(u=>u.timestamp===i)),a?vt(s,t,a,l):null}var Qt=e=>typeof e=="number"&&Number.isInteger(e)&&e>0;function we(e){return e&&Qt(e.ref_no)?String(e.ref_no):null}function Xt(e,s){let t=we(e);return t&&s&&Qt(s.ref_no)?`${t}.${s.ref_no}`:null}function Mi(e){let s=/^(\d+)(?:\.(\d+)(?:-(\d+))?)?$/.exec(e.trim());return s?{object:Number(s[1]),task:s[2]?Number(s[2]):null,entry:s[3]?Number(s[3]):null}:null}function te(e,s){return e?o`<span class="ref-chip" title=${s??""}>#${e}</span>`:d}var Te=["completed","reset","skipped"];function bt(e){let s=t=>{let i=st(t.timestamp);return Number.isNaN(i)?-1/0:i};return(e??[]).map((t,i)=>({entry:t,index:i,at:s(t)})).sort((t,i)=>i.at-t.at||i.index-t.index).map(t=>t.entry)}var Ae=["completed","skipped","missed","reset","triggered","trigger_replaced","trigger_removed"];function Ui(e,s){let t=s.lang;return o`
    <div class="history-filters-new">
      <div class="filter-chips">
        ${Ae.map(i=>{let n=e.history.filter(l=>l.type===i).length;return n===0?d:o`
            <span class="filter-chip ${s.filter===i?"active":""}"
              @click=${()=>s.setFilter(s.filter===i?null:i)}>
              ${r(i,t)} (${n})
            </span>
          `})}
        ${s.filter?o`<span class="filter-chip clear" @click=${()=>s.setFilter(null)}>${r("show_all",t)}</span>`:d}
      </div>
      <div class="filter-controls">
        <input type="text" class="search-input" placeholder="${r("search_notes",t)}..." .value=${s.search} @input=${i=>s.setSearch(i.target.value)} />
      </div>
    </div>
  `}function Bi(e,s){let t=s.lang,i=s.filter?e.history.filter(n=>n.type===s.filter):e.history;if(s.search){let n=s.search.toLowerCase();i=i.filter(l=>mt(l.notes,s.search)||mt(ft(l.notes,t),s.search)||(ee(s,l)??"").toLowerCase().endsWith(n))}return i.length===0?o`<p class="empty">${r("no_history",t)}</p>`:o`
    <div class="history-timeline">
      ${bt(i).map(n=>xt(n,s))}
    </div>
  `}function ee(e,s){return e.taskRef&&s.ref_no?`${e.taskRef}-${s.ref_no}`:null}function Ee(e,s){let t=lt(s);return t.length>0?o`<div class="history-photos">
        ${t.map(i=>o`<maintenance-history-photo .hass=${e} .docId=${i}></maintenance-history-photo>`)}
      </div>`:d}function Le(e,s){let t=s.lang,i=a=>g(a,t,{maximumFractionDigits:3}),n=a=>a==null?"":` (${a>=0?"+":""}${i(a)})`,l=ot(e);return l.length>0?o`<div class="history-readings">
      ${l.map(a=>o`<span class="history-reading">
        <span class="history-reading-name">${a.name}</span>
        <span class="history-reading-value">${i(a.value)}${a.unit?` ${a.unit}`:""}${n(s.readingSlotDelta?.(e,a.id))}</span>
      </span>`)}
    </div>`:e.reading_value!=null?o`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${r("reading_label",t)}</span>
      <span class="history-reading-value">${i(e.reading_value)}${s.readingUnit?` ${s.readingUnit}`:""}${n(s.readingDelta?.(e))}</span>
    </span></div>`:d}function xt(e,s,t={}){let i=s.lang,{compact:n=!1,showRef:l=!0,showBadges:a=!0,showEdit:c=!0}=t,u=s.openEdit,m=c&&!!u&&Te.includes(e.type),y=typeof e.parts_cost=="number"?e.parts_cost:null,k=e.cost_basis==="use",O=k&&!!e.purchase;return o`
    <div class="history-entry${n?" compact":""}">
      ${n?d:o`<div class="history-icon ${e.type}">
            <ha-icon .icon=${tt[e.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        <div class="history-row">
          <strong>${r(e.type,i)}</strong>
          ${l?te(ee(s,e),r("ref_number",i)):d}
          ${a&&e.phase_id?o`<span class="history-phase-badge">${s.phaseNames?.[e.phase_id]||e.phase_id}</span>`:d}
          ${a&&e.auto?o`<span class="history-auto-badge">${r("history_auto",i)}</span>`:d}
          ${m?o`<button class="history-edit-btn"
                     title=${r("history_edit_button",i)}
                     @click=${()=>u(e)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:d}
        </div>
        <div class="history-date">${rt(e.timestamp,i)}</div>
        ${e.notes?o`<div class="history-notes">${ft(e.notes,i)}</div>`:d}
        ${Ee(s.hass,e)}
        ${Le(e,s)}
        ${e.cost!=null||e.duration!=null||e.trigger_value!=null||y!=null?o`<div class="history-details">
              ${e.cost!=null?O?o`<span>${r("history_purchase_stock",i).replace("{amount}",z(e.cost,s.currencySymbol,i))}</span>`:e.cost<0?o`<span class="history-credit">${r("cost_kind_credit",i)}: ${z(-e.cost,s.currencySymbol,i)}</span>`:o`<span>${r("cost",i)}: ${z(e.cost,s.currencySymbol,i)}</span>`:d}
              ${y!=null?o`<span title=${r(k?"history_parts_counted_hint":"history_parts_info_hint",i)}>${r(k?"history_parts_counted":"history_parts_info",i).replace("{amount}",z(y,s.currencySymbol,i))}</span>`:d}
              ${e.duration!=null?o`<span>${r("duration",i)}: ${at(e.duration,i)}</span>`:d}
              ${e.trigger_value!=null?o`<span>${r("trigger_val",i)}: ${e.trigger_value}</span>`:d}
            </div>`:d}
      </div>
    </div>
  `}var Se="var(--maint-done-color, #78909c)";function Y(e){return e.archived?"archived":e.is_done?"done":e.status||"ok"}function $t(e,s){return r(e==="done"?"completed":e,s)}function pt(e){let s=Y(e);return s==="done"?Se:wt[s]||"var(--disabled-color, #9e9e9e)"}function Pe(e){return tt[e==="done"?"completed":e]||"mdi:circle-medium"}function ie(e,s,t="pill"){let i=Y(e),n=$t(i,s);return t==="chip"?o`<span class="status-chip ${i}">${n}</span>`:o`<span class="status-badge ${i}" role="img" title="${n}" aria-label="${n}"><ha-icon icon="${Pe(i)}"></ha-icon><span class="status-label">${n}</span></span>`}function _(e){return e.toFixed(1)}function es(e,s,t=4){if(!isFinite(e)||!isFinite(s))return{ticks:[],niceMin:0,niceMax:1};if(e===s){let m=Math.abs(e)*.1||1;e-=m,s+=m}let i=s-e,n=Math.pow(10,Math.floor(Math.log10(i/Math.max(1,t)))),l=n;for(let m of[1,2,5,10])if(l=n*m,i/l<=t+.5)break;let a=Math.floor(e/l)*l,c=Math.ceil(s/l)*l,u=[];for(let m=a;m<=c+l*1e-6;m+=l)u.push(Math.abs(m)<l*1e-9?0:m);return{ticks:u,niceMin:a,niceMax:c}}function is(e,s){let t=Math.abs(e),i=n=>({maximumFractionDigits:n});return t>=1e6?g(e/1e6,s,i(t>=1e7?0:1))+"M":t>=1e4?g(e/1e3,s,i(0))+"k":t>=1e3?g(e/1e3,s,i(1))+"k":t>=100?g(e,s,i(0)):t>=1?g(e,s,i(1)):t===0?"0":g(e,s,i(2))}function ss(e,s,t){let i=g(e,t,{maximumFractionDigits:Math.abs(e)>=100?0:1});return s?`${i} ${s}`:i}function ns(e,s,t){return _t(new Date(e),s,t)}function rs(e,s){let t=new Date(e);return`${_t(t,s)}, ${nt(t,s)}`}function as(e,s){if(!Number.isFinite(e)||!Number.isFinite(s))return!1;let t=et();return F(e,t).slice(0,4)!==F(s,t).slice(0,4)}function os(e,s,t){if(t<2||s<=e)return[e,s];let i=[];for(let n=0;n<t;n++)i.push(e+(s-e)*n/(t-1));return i}function se(e,s){let t=e.interval_analysis,i=t?.weibull_beta,n=t?.weibull_eta;if(i==null||n==null||n<=0)return d;let l=e.interval_days??0,a=e.suggested_interval??l;return o`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${r("weibull_reliability_curve",s)}
        ${He(i,s)}
      </div>
      ${Re(i,n,l,a,s)}
      ${Ie(t,s)}
      ${t?.confidence_interval_low!=null?Ce(t,e,s):d}
    </div>
  `}function He(e,s){let t,i,n;return e<.8?(t="early_failures",i="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",n="beta_early_failures"):e<=1.2?(t="random_failures",i="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",n="beta_random_failures"):e<=3.5?(t="wear_out",i="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",n="beta_wear_out"):(t="highly_predictable",i="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",n="beta_highly_predictable"),o`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${i}"></ha-svg-icon>
      ${r(n,s)} (\u03B2=${g(e,s,2)})
    </span>
  `}function Re(e,s,t,i,n){let x=Math.max(t,i,s,1)*1.3,P=50,H=[];for(let w=0;w<=P;w++){let L=w/P*x,fe=1-Math.exp(-Math.pow(L/s,e)),ge=32+L/x*260,ye=136-fe*128;H.push([ge,ye])}let J=H.map(([w,L])=>`${_(w)},${_(L)}`).join(" "),ht="M32,136 "+H.map(([w,L])=>`L${_(w)},${_(L)}`).join(" ")+` L${_(H[P][0])},136 Z`,q=32+t/x*260,Q=1-Math.exp(-Math.pow(t/s,e)),X=136-Q*128,me=g((1-Q)*100,n,0),kt=32+i/x*260,_e=[0,.25,.5,.75,1];return o`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${r("chart_weibull",n)}">
        ${_e.map(w=>{let L=136-w*128;return N`
            <line x1="${32}" y1="${_(L)}" x2="${292}" y2="${_(L)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${w===.5?"4,3":d}" />
            <text x="${28}" y="${_(L+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${g(w*100,n,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(x/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(x)}</text>

        <path d="${ht}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${J}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?N`
          <line x1="${_(q)}" y1="${8}" x2="${_(q)}" y2="${_(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${_(q)}" cy="${_(X)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${_(q+4)}" y="${_(X-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${me}%</text>
        `:d}

        ${i>0&&i!==t?N`
          <line x1="${_(kt)}" y1="${8}" x2="${_(kt)}" y2="${_(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:d}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${r("weibull_failure_probability",n)}</span>
      ${t>0?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${r("current_interval_marker",n)}</span>`:d}
      ${i>0&&i!==t?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${r("recommended_marker",n)}</span>`:d}
    </div>
  `}function Ie(e,s){return o`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${r("characteristic_life",s)}</span>
        <span class="weibull-info-value">${Math.round(e.weibull_eta)} ${r("days",s)}</span>
      </div>
      ${e.weibull_r_squared!=null?o`
        <div class="weibull-info-item">
          <span>${r("weibull_r_squared",s)}</span>
          <span class="weibull-info-value">${g(e.weibull_r_squared,s,3)}</span>
        </div>
      `:d}
    </div>
  `}function Ce(e,s,t){let i=e.confidence_interval_low,n=e.confidence_interval_high,l=s.suggested_interval??s.interval_days??0,a=s.interval_days??0,c=Math.max(0,i-5),m=n+5-c,y=(i-c)/m*100,k=(n-i)/m*100,O=(l-c)/m*100,x=a>0?(a-c)/m*100:-1;return o`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${r("confidence_interval",t)}: ${l} ${r("days",t)} (${i}\u2013${n})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${_(y)}%;width:${_(k)}%"></div>
        ${x>=0?o`<div class="confidence-marker current" style="left:${_(x)}%"></div>`:d}
        <div class="confidence-marker recommended" style="left:${_(O)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${r("confidence_conservative",t)} (${i}${r("days",t).charAt(0)})</span>
        <span class="confidence-text high">${r("confidence_aggressive",t)} (${n}${r("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function ne(e,s,t){let i=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data",n=e.days_until_threshold!=null,l=e.environmental_factor!=null&&e.environmental_factor!==1;if(!i&&!n&&!l)return d;let a=e.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":e.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return o`
    <div class="prediction-section">
      ${e.sensor_prediction_urgency?o`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${r("sensor_prediction_urgency",s).replace("{days}",String(Math.round(e.days_until_threshold||0)))}
        </div>
      `:d}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${r("sensor_prediction",s)}
      </div>
      <div class="prediction-grid">
        ${i?o`
          <div class="prediction-item">
            <ha-svg-icon path="${a}"></ha-svg-icon>
            <span class="prediction-label">${r("degradation_trend",s)}</span>
            <span class="prediction-value ${e.degradation_trend}">${r("trend_"+e.degradation_trend,s)}</span>
            ${e.degradation_rate!=null?o`<span class="prediction-rate">${e.degradation_rate>0?"+":""}${g(e.degradation_rate,s,Math.abs(e.degradation_rate)>=10?0:1)} ${e.trigger_entity_info?.unit_of_measurement||""}/${r("day_short",s)}</span>`:d}
          </div>
        `:d}
        ${n?o`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${r("days_until_threshold",s)}</span>
            <span class="prediction-value prediction-days${e.days_until_threshold===0?" exceeded":e.sensor_prediction_urgency?" urgent":""}">${e.days_until_threshold===0?r("threshold_exceeded",s):"~"+Math.round(e.days_until_threshold)+" "+r("days",s)}</span>
            ${e.threshold_prediction_date?o`<span class="prediction-date">${K(e.threshold_prediction_date,s)}</span>`:d}
            ${e.threshold_prediction_confidence?o`<span class="confidence-dot ${e.threshold_prediction_confidence}"></span>`:d}
            ${(e.prediction_cycles??0)>0?o`<span class="prediction-cycles">${r("prediction_cycles",s)}: ${e.prediction_cycles}</span>`:d}
          </div>
        `:d}
        ${l&&t.environmental?o`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${r("environmental_adjustment",s)}</span>
            <span class="prediction-value">${g(e.environmental_factor,s,2)}x</span>
            ${e.environmental_entity?o`<span class="prediction-entity entity-link" @click=${c=>Ct(c,e.environmental_entity)}>${e.environmental_entity}</span>`:d}
          </div>
        `:d}
      </div>
    </div>
  `}function re(e,s,t,i){let n=Math.max(e||1,s);return o`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${r("current",i)}: ${e??"\u2014"} ${e!=null?r("days",i):""}
        </div>
        <div class="interval-visual current"
          style="width: ${e!=null?Math.min(e/n*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${r("recommended",i)}: ${s} ${r("days",i)}
          <span class="confidence-badge ${t}">${r(`confidence_${t}`,i)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(s/n*100,100)}%"></div>
      </div>
    </div>
  `}var ae=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function oe(){return Number(it().slice(5,7))-1}function le(e,s,t){if(!t.seasonal||!e.seasonal_factor||e.seasonal_factor===1)return d;let i=ae.map(c=>r(c,s)),n=oe(),l=e.seasonal_factors||e.interval_analysis?.seasonal_factors||null,a=l&&l.length===12?l:i.map((c,u)=>{let m=e.seasonal_factor||1,y=Math.sin((u-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,m+y))});return o`
    <div class="seasonal-card-compact">
      <h4>${r("seasonal_awareness",s)}</h4>
      <div class="seasonal-mini-chart">
        ${a.map((c,u)=>{let m=c*40,y=c<.9?"low":c>1.1?"high":"normal";return o`
            <div class="seasonal-bar ${y} ${u===n?"current":""}"
                 style="height: ${m}px"
                 title="${i[u]}: ${g(c,s,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${r("shorter",s)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${r("normal",s)}</span>
        <span class="legend-item"><span class="dot high"></span> ${r("longer",s)}</span>
      </div>
    </div>
  `}function de(e,s){return Me(e,s)}function Me(e,s){let t=e.seasonal_factors??e.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return d;let i=e.interval_analysis?.seasonal_reason,n=oe(),l=300,a=100,c=8,m=a-c-4,y=Math.max(...t,1.5),k=l/12,O=k*.65,x=c+m-1/y*m;return o`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${r("seasonal_chart_title",s)}
        ${i?o`<span class="source-tag">${i==="learned"?r("seasonal_learned",s):r("seasonal_manual",s)}</span>`:d}
      </div>
      <svg viewBox="0 0 ${l} ${a}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${r("chart_seasonal",s)}">
        <line x1="0" y1="${_(x)}" x2="${l}" y2="${_(x)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((P,H)=>{let J=P/y*m,ht=H*k+(k-O)/2,q=c+m-J,Q=H===n,X=P<1?"var(--success-color, #4caf50)":P>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return N`
            <rect x="${_(ht)}" y="${_(q)}"
              width="${_(O)}" height="${_(J)}"
              fill="${X}" opacity="${Q?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${ae.map((P,H)=>o`<span class="seasonal-label ${H===n?"active-month":""}">${r(P,s)}</span>`)}
      </div>
    </div>
  `}var f=class extends S{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showPostpone=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._postponeDate="";this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._toastTimer=new Ut;this._access=dt;this._currencySymbol="";this._partsCostMode="purchase";this._loadSeq=0}get _lang(){return A(this.hass)}async openFor(t,i){(t!==this._entryId||i!==this._taskId)&&(this._task=null),this._entryId=t,this._taskId=i,this._error="",this._showSkip=!1,this._showReset=!1,this._showPostpone=!1,this._showAdaptive=!1,this._skipReason="",this._postponeDate="",this._resetDate=it(),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let t=await M(this.hass);this._features={...this._features,...t.features},this._access=t.access,this._currencySymbol=B(t.budget??void 0),Lt(t.budget??void 0),this._partsCostMode=t.partsCostMode}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(t,i){this._toast=t,this._toastTimer.schedule(()=>{this._toast=""},i)}async _loadTask(){let t=this._entryId,i=this._taskId;if(!t||!i)return;let n=++this._loadSeq,l="",a=await C(this,{type:"maintenance_supporter/object",entry_id:t},{onError:u=>{l=u}});if(n!==this._loadSeq)return;if(a===void 0){this._error=l;return}this._objectName=a?.object?.name||"";let c=(a?.tasks||[]).find(u=>u.id===i);this._task=c??null,this._taskRef=Xt(a?.object,c),c||(this._error=r("ws_err_not_found",this._lang))}_runWs(t){return this._error="",C(this,t,{busy:i=>{this._busy=i},onError:i=>{this._error=i}})}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-MWBCBCP7.js").then(async({openCompleteDialog:t})=>{let i=this._task,n=[];try{n=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}t(Yt({entryId:this._entryId,taskId:this._taskId,taskName:i.name,task:i,objects:n,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol,partsCostMode:this._partsCostMode}))&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})!==void 0&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})!==void 0&&(this._notifyChanged("reset"),this.close())}async _onPostponeConfirm(){if(!this._entryId||!this._taskId||!this._postponeDate)return;await this._runWs({type:"maintenance_supporter/task/postpone",entry_id:this._entryId,task_id:this._taskId,until:this._postponeDate})!==void 0&&(this._notifyChanged("postpone"),this.close())}async _onSnooze(){if(!this._entryId||!this._taskId)return;let t=await this._runWs({type:"maintenance_supporter/task/snooze",entry_id:this._entryId,task_id:this._taskId});t!==void 0&&(this._notifyChanged("snooze"),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:Zt(t,this._lang)},bubbles:!0,composed:!0})),this.close())}_onEdit(){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-MWBCBCP7.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-MWBCBCP7.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId||!await j(this.hass,{title:r("delete",this._lang),message:r("delete_task_confirm",this._lang),confirmText:r("delete",this._lang),danger:!0}))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})!==void 0&&(this._showToast(r("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!this._entryId||!this._taskId)return;let t=await this._runWs({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});t!==void 0&&(this._showToast(t?.recommended_interval?`${r("reanalyze_result",this._lang)}: ${Rt(t.recommended_interval,"days",this._lang)} (${t.data_points} ${r("data_points",this._lang)})`:r("reanalyze_insufficient_data",this._lang)),await this._loadTask())}_onEditHistoryEntry(t){if(!this._entryId||!this._taskId)return;let i=vt(this._entryId,this._taskId,t,this._task);import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-MWBCBCP7.js").then(({openHistoryEditDialog:n})=>n(i))}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return d;let i=this._lang;return o`
      <div class="recommendation-card">
        <h4>${r("suggested_interval",i)}</h4>
        ${re(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",i)}
        <div class="recommendation-actions">
          ${V(this.hass?.user,this._access)?o`<button class="btn primary qa-apply-suggestion"
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
    `}_renderAdaptive(t){let i=this._lang,n=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,l=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,a=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,c=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!n&&!l&&!a&&!c?o`<div class="adaptive-empty">
        ${r("adaptive_no_data",i)}
      </div>`:o`
      <div class="adaptive-stack">
        ${this._toast?o`<div class="toast">${this._toast}</div>`:d}
        ${n?this._renderRecommendation(t):d}
        ${l?ne(t,i,this._features):d}
        ${a?se(t,i):d}
        ${c?o`
          ${le(t,i,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?de(t,i):d}
        `:d}
      </div>
    `}_renderDetails(t){let i=this._lang,n=t.history||[],l=t.history_count??n.length,a=bt(n).slice(0,20);return o`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${r("times_performed",i)}</span>
            <span class="stat-value">${t.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${r("total_cost",i)}</span>
            <span class="stat-value">${z(t.total_cost??0,this._currencySymbol,i)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${r("avg_duration",i)}</span>
            <span class="stat-value">${at(t.average_duration!=null?Math.round(t.average_duration):null,i)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${r("history",i)}</strong>
          <span class="history-count">${l}</span>
        </div>
        ${n.length===0?o`<div class="history-empty">${r("history_empty",i)}</div>`:o`
              <div class="history-list">
                ${a.map(c=>xt(c,{lang:i,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:V(this.hass?.user,this._access)?u=>this._onEditHistoryEntry(u):void 0,readingUnit:t.reading_unit,readingSlotDelta:(u,m)=>Nt(n,u,m),taskRef:this._taskRef},{compact:!0}))}
                ${l>a.length?o`<div class="history-more">… +${l-a.length} ${r("older_entries",i)}</div>`:d}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return d;let t=this._lang,i=this._task,n=V(this.hass?.user,this._access),l=!!i&&(!!i.archived||i.enabled===!1||i.status==="paused");return G(()=>this.close(),o`
        ${i?o`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${pt(i)}"></span>
                  <span class="task-name">${i.name}</span>
                  ${ie(i,t)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-MWBCBCP7.js").then(({openObjectQuickActions:a})=>{a(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${i.next_due?o`<span><strong>${r("next_due",t)}:</strong> ${K(i.next_due,t)}</span>`:d}
                  ${i.last_performed?o`<span><strong>${r("last_performed",t)}:</strong> ${K(i.last_performed,t)}</span>`:d}
                  ${i.schedule?.kind&&!["manual","one_time"].includes(i.schedule.kind)||i.interval_days!=null?o`<span><strong>${r("interval",t)}:</strong> ${It(i,t)}</span>`:d}
                  ${Z(i)?o`<span><strong>${r("phase_current",t)}:</strong> ${Z(i)}</span>`:d}
                </div>
                ${i.notes?o`<div class="notes-body">${ct(i.notes)}</div>`:d}
              </div>

              ${this._error?o`<div class="error">${this._error}</div>`:d}

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
                  `:this._showPostpone?o`
                    <div class="inline-form">
                      <label>${r("postpone_date_prompt",t)}</label>
                      <ms-date-field
                        kind="date"
                        .hass=${this.hass}
                        .lang=${t}
                        .value=${this._postponeDate}
                        @value-changed=${a=>{this._postponeDate=a.detail.value}}
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
                      ${n?o`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-edit" @click=${this._onEdit} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                            ${r("edit",t)}
                          </ha-button>`:d}
                      <ha-button size="small" appearance="outlined" variant="neutral" class="qa-qr" @click=${this._onQr} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                        ${r("qr_code",t)}
                      </ha-button>
                      ${l?d:o`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-postpone"
                            @click=${()=>{this._showPostpone=!0}} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:calendar-arrow-right"></ha-icon>
                            ${r("postpone",t)}…
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="neutral" class="qa-snooze" @click=${this._onSnooze} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:bell-sleep-outline"></ha-icon>
                            ${r("snooze",t)}
                          </ha-button>`}
                      ${n?o`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-archive"
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
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?o`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
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
            `:this._error?o`<div class="error">${this._error}</div>`:o`<div class="loading">${r("loading",t)}</div>`}
    `)}updated(t){t.has("_open")&&this._open&&U(this.shadowRoot)}};f.styles=[Dt,W,$`
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
  `],p([T({attribute:!1})],f.prototype,"hass",2),p([h()],f.prototype,"_open",2),p([h()],f.prototype,"_entryId",2),p([h()],f.prototype,"_taskId",2),p([h()],f.prototype,"_task",2),p([h()],f.prototype,"_objectName",2),p([h()],f.prototype,"_taskRef",2),p([h()],f.prototype,"_busy",2),p([h()],f.prototype,"_error",2),p([h()],f.prototype,"_showSkip",2),p([h()],f.prototype,"_showReset",2),p([h()],f.prototype,"_showPostpone",2),p([h()],f.prototype,"_showDetails",2),p([h()],f.prototype,"_showAdaptive",2),p([h()],f.prototype,"_skipReason",2),p([h()],f.prototype,"_resetDate",2),p([h()],f.prototype,"_postponeDate",2),p([h()],f.prototype,"_features",2),p([h()],f.prototype,"_toast",2),p([h()],f.prototype,"_access",2),p([h()],f.prototype,"_partsCostMode",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",f);function ce(e){return!!e&&/^https?:\/\//i.test(e)}var E=class extends S{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=dt}get _lang(){return A(this.hass)}async openFor(t){this._entryId=t,this._error="",this._open=!0,await Promise.all([this._load(),M(this.hass).then(i=>{this._access=i.access})])}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(!this._entryId)return;let t=await C(this,{type:"maintenance_supporter/object",entry_id:this._entryId},{onError:i=>{this._error=i}});t!==void 0&&(this._data=t)}_runWs(t){return this._error="",C(this,t,{busy:i=>{this._busy=i},onError:i=>{this._error=i}})}_onEditObject(){!this._entryId||!this._data||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-MWBCBCP7.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-MWBCBCP7.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await j(this.hass,{title:r("delete",this._lang),message:r("delete_object_confirm",this._lang),confirmText:r("delete",this._lang),danger:!0}))return;let i=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:i})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:i},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t&&!await j(this.hass,{title:r("archive_object",this._lang),message:r("confirm_archive_object",this._lang),confirmText:r("archive_object",this._lang)}))return;let i=this._entryId;await this._runWs({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:i})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:i},bubbles:!0,composed:!0})),this.close())}_onTaskClick(t){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-MWBCBCP7.js").then(({openTaskQuickActions:i})=>{i(this._entryId,t)})}render(){if(!this._open)return d;let t=this._lang,i=this._data,n=i?.object,l=i?.tasks||[],a=V(this.hass?.user,this._access);return G(()=>this.close(),o`
        ${i&&n?o`
              <div class="header">
                <div class="title">${n.name}</div>
                ${this._renderMetaRow(n)}
              </div>

              ${this._error?o`<div class="error">${this._error}</div>`:d}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${r("tasks",t)}</strong>
                  <span class="count">${l.length}</span>
                </div>
                ${l.length===0?o`<div class="empty">${r("no_tasks",t)}</div>`:o`
                      <div class="task-list">
                        ${l.map(c=>o`
                          <div class="task-row" @click=${()=>this._onTaskClick(c.id)}>
                            <span class="status-dot" style="background: ${pt(c)}"></span>
                            <span class="task-name">${c.name}</span>
                            <span class="task-status ${Y(c)}">${$t(Y(c),t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${n.notes?o`
                    <div class="notes-section">
                      <strong>${r("object_notes_label",t)}</strong>
                      <div class="notes-body">${ct(n.notes)}</div>
                    </div>
                  `:d}

              ${a?o`
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
                        <ha-icon icon="${n.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${n.archived?r("unarchive_object",t):r("archive_object",t)}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${r("delete",t)}
                      </button>
                    </div>
                  `:d}
            `:o`<div class="loading">${r("loading",t)}</div>`}
    `)}updated(t){t.has("_open")&&this._open&&U(this.shadowRoot)}_renderMetaRow(t){let i=this._lang,n=[];return t.area_id&&n.push([r("area",i),t.area_id]),t.manufacturer&&n.push([r("manufacturer",i),t.manufacturer]),t.model&&n.push([r("model",i),t.model]),t.serial_number&&n.push([r("serial_number_label",i),t.serial_number]),t.installation_date&&n.push([r("installed",i),t.installation_date]),t.warranty_expiry&&n.push([r("warranty",i),t.warranty_expiry]),t.documentation_url&&n.push([r("documentation_url_label",i),t.documentation_url]),n.length===0?d:o`
      <div class="meta">
        ${n.map(([l,a])=>o`
            <div class="meta-item">
              <span class="meta-label">${l}</span>
              <span class="meta-value">${ce(a)?o`<a href="${a}" target="_blank" rel="noopener noreferrer">${a}</a>`:a}</span>
            </div>
          `)}
      </div>
    `}};E.styles=[W,$`
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
  `],p([T({attribute:!1})],E.prototype,"hass",2),p([h()],E.prototype,"_open",2),p([h()],E.prototype,"_entryId",2),p([h()],E.prototype,"_data",2),p([h()],E.prototype,"_busy",2),p([h()],E.prototype,"_error",2),p([h()],E.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",E);var pe="maintenance-object-dialog",ue="maintenance-task-dialog",De="maintenance-history-edit-dialog",Oe="maintenance-complete-dialog",ze="maintenance-qr-dialog",je="maintenance-task-quick-actions-dialog",qe="maintenance-object-quick-actions-dialog";function ut(){return document.querySelector("home-assistant")?.hass}function Ne(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function R(e){let s=Ne(),t=s.querySelector(e)??document.body.querySelector(e);return t?t.parentNode!==s&&s.appendChild(t):(t=document.createElement(e),s.appendChild(t)),t}function I(e){let s=ut();if(!s)return!1;e.hass=s;let t=A(s);return Tt(t)||At(t).then(()=>{e.requestUpdate?.()}),St(s.locale,s.config?.country,s.config?.time_zone),!0}function xn(e){return M(e).then(s=>s.rowActionStyle)}function $n(){Vt()}function kn(){let e=R(pe);return I(e)?(e.openCreate(),!0):!1}function wn(e,s){let t=R(pe);return I(t)?(t.openEdit(e,s),!0):!1}function Tn(e="",s){let t=R(ue);if(!I(t))return!1;let i=ut();return i?((async()=>{let n=await M(i),l=t;he(l,n),l.openCreate(e,s)})(),!0):!1}function he(e,s){e.checklistsEnabled=s.features.checklists,e.scheduleTimeEnabled=s.features.schedule_time,e.completionActionsEnabled=s.features.completion_actions,e.adaptiveFeature=s.features.adaptive,e.seasonalFeature=s.features.seasonal,e.environmentalFeature=s.features.environmental,e.defaultWarningDays=s.defaultWarningDays}function An(e,s){let t=R(ue);if(!I(t))return!1;let i=ut();return i?((async()=>{try{let[n,l]=await Promise.all([i.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e}),M(i)]),a=(n.tasks||[]).find(u=>u.id===s);if(!a){console.warn(`openEditTaskDialog: task ${s} not found in entry ${e}`);return}let c=t;he(c,l),await c.openEdit(e,a)}catch(n){console.warn("openEditTaskDialog: failed to load task/features",n)}})(),!0):!1}function En(e){let s=R(De);return I(s)?(s.openEdit(e),!0):!1}function Ln(e){let s=R(Oe);return I(s)?(Jt(s,e,A(ut())),!0):!1}function Sn(e){let s=R(ze);return I(s)?(s.openForTask(e.entry_id,e.task_id,e.object_name,e.task_name),!0):!1}function Pn(e,s){let t=R(je);return I(t)?(t.openFor(e,s),!0):!1}function Hn(e){let s=R(qe);return I(s)?(s.openFor(e),!0):!1}export{ce as a,we as b,Xt as c,Mi as d,te as e,ct as f,xe as g,$e as h,yt as i,Yt as j,Jt as k,_ as l,es as m,is as n,ss as o,ns as p,rs as q,as as r,os as s,vt as t,Ri as u,Zt as v,bt as w,Ui as x,Bi as y,xt as z,ie as A,se as B,ne as C,re as D,le as E,de as F,xn as G,$n as H,kn as I,wn as J,Tn as K,An as L,En as M,Ln as N,Sn as O,Pn as P,Hn as Q};
