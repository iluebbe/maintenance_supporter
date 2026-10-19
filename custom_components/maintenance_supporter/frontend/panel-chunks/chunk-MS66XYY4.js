/*! maintenance_supporter frontend 2.106.0 */
import{a as Xt,c as te,d as $t,e as ee,f as pt,g as V,j as R,k as de,l as ue}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-43SFQEEV.js";import{a as xt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-3F2JC2H7.js";import{b as Qt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-CQYWUK7V.js";import{b as vt,i as ae,z as le}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-2DQEEIXJ.js";import{b as oe,c as pe}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-HJS44CMF.js";import{a as ct}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-FBEKILQG.js";import{b as se,c as ne,f as dt,g as ie,i as re,l as ce}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-AZ6OVCOD.js";import{j as kt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-QTLTEEZZ.js";import{a as G,b as U,c as B}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-NXPW7ONG.js";import{a as C}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-OWJDDELJ.js";import{A as it,B as F,C as rt,E as at,G as jt,J as Z,L as qt,M as Ft,N as Wt,O as y,P as Vt,Q as W,R as Gt,S as Y,T as D,U as ot,V as Ut,Y as Bt,Z as lt,a as u,b as L,c as l,ca as bt,d as q,da as Kt,ea as Zt,f as c,fa as Yt,h as S,ia as Jt,m as A,n as m,o as It,p as Dt,q as Ot,t as nt,v as x,w as r,x as zt,y as Nt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-3TLCD5OW.js";var v=class extends S{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._options=null;this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel="",this._inputType="",this._options=null,this._inputValue="",this._open=!0,new Promise(n=>{this._resolve=n,this._promptResolve=null})}prompt(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel=t.inputLabel||"",this._inputType=t.inputType||"text",this._options=t.options&&t.options.length?t.options:null,this._inputValue=t.inputValue||"",this._open=!0,new Promise(n=>{this._promptResolve=n,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return c;let t=x(this.hass);return l`
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
    `}};v.styles=[Yt,L`
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
  `],u([A({attribute:!1})],v.prototype,"hass",2),u([m()],v.prototype,"_open",2),u([m()],v.prototype,"_title",2),u([m()],v.prototype,"_message",2),u([m()],v.prototype,"_confirmText",2),u([m()],v.prototype,"_danger",2),u([m()],v.prototype,"_inputLabel",2),u([m()],v.prototype,"_inputType",2),u([m()],v.prototype,"_options",2),u([m()],v.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",v);var he="maintenance-confirm-dialog",me="data-ms-lovelace-confirm";function Ve(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function N(e,s){let t=Ve(),n=t.querySelector(`${he}[${me}]`);return n||(n=document.createElement(he),n.setAttribute(me,""),t.appendChild(n)),n.hass=e,n.confirm(s)}var O=class extends S{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await Qt(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?c:this._url?l`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:l`<div class="ph"></div>`}};O.styles=L`
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
  `,u([A({attribute:!1})],O.prototype,"hass",2),u([A()],O.prototype,"docId",2),u([m()],O.prototype,"_url",2),u([m()],O.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",O);var b=class extends S{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._openGen=0;this._photos=new pe(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return x(this.hass)}openEdit(t){this._openGen++,this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(t.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(t),this._loadPartOptions()}_seedReadings(t){let n=[],i=new Set;for(let a of t.readings??[])i.has(a.id)||(i.add(a.id),n.push({id:a.id,name:a.name,unit:a.unit??null}));for(let a of t.reading_values??[])i.has(a.id)||(i.add(a.id),n.push({id:a.id,name:a.name,unit:a.unit??null}));this._readingRows=n;let o={};for(let a of t.reading_values??[])o[a.id]=String(a.value);this._readingText=o,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let t={};for(let n of this._readingRows){let i=(this._readingText[n.id]??"").trim();if(i==="")continue;let o=parseFloat(i.replace(",","."));isNaN(o)||(t[n.id]=o)}return t}async _loadPartOptions(){let t=this._draft;if(!t)return;let n=this._openGen;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});if(n!==this._openGen)return;let o=[];for(let d of i.parts||[]){let p=d.entry_id===t.entry_id,h=d.consumers.some(f=>f.entry_id===t.entry_id&&f.task_id===t.task_id);!p&&!h||o.push({part_id:d.part_id,name:d.name,entry_id:d.entry_id,foreign:!p,object_name:d.object_name})}for(let d of t.used_parts||[]){let p=d.entry_id||t.entry_id;o.some(h=>h.part_id===d.part_id&&h.entry_id===p)||o.push({part_id:d.part_id,name:d.name||d.part_id,entry_id:p,foreign:p!==t.entry_id,object_name:null})}let a={};for(let d of t.used_parts||[])a[`${d.entry_id||t.entry_id}:${d.part_id}`]=d.quantity??1;this._partOptions=o,this._partQty=a,this._partQtyOriginal=this._partSelectionKey()}catch{if(n!==this._openGen)return;this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,t])=>t>0).sort(([t],[n])=>t.localeCompare(n)))}close(){this._openGen++,this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(t,n){this._draft&&(this._draft={...this._draft,[t]:n})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let t=this._lang,i=(this._originalSnapshot.used_parts||[]).filter(p=>p.quantity>0).map(p=>`${y(p.quantity,t)}\xD7 ${p.name||p.part_id}`).join(", ");if(!await N(this.hass,{title:r("history_delete_entry",t),message:i?`${r("history_delete_confirm_entry",t)} ${r("history_delete_returns_parts",t).replace("{parts}",i)}`:r("history_delete_confirm_entry",t),confirmText:r("delete",t),danger:!0})||!this._draft||!this._originalSnapshot)return;let a=this._draft;this._error="",await this._runWs({type:"maintenance_supporter/task/history/delete",entry_id:a.entry_id,task_id:a.task_id,timestamp:this._originalSnapshot.original_timestamp})!==void 0&&(this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:a.entry_id,task_id:a.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close())}_runWs(t){return C(this,t,{busy:n=>{this._saving=n},onError:n=>{this._error=n}})}async _save(){if(!this._draft||!this._originalSnapshot||this._saving||this._photos.uploading)return;this._error="",this._photos.clearError();let t=this._draft,n=this._originalSnapshot,i={type:"maintenance_supporter/task/history/update",entry_id:t.entry_id,task_id:t.task_id,original_timestamp:n.original_timestamp};if(t.timestamp!==n.timestamp&&(i.timestamp=t.timestamp),t.notes!==n.notes&&(i.notes=t.notes),t.cost!==n.cost&&(i.cost=t.cost),t.duration!==n.duration&&(i.duration=t.duration),t.completed_by!==n.completed_by&&(i.completed_by=t.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(i.used_parts=(this._partOptions||[]).filter(a=>(this._partQty[`${a.entry_id}:${a.part_id}`]||0)>0).map(a=>({part_id:a.part_id,quantity:this._partQty[`${a.entry_id}:${a.part_id}`],...a.foreign?{entry_id:a.entry_id}:{}}))),t.reading_value!==n.reading_value&&(i.reading_value=t.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let a=this._readingNumbers(),d={};for(let p of this._readingRows)d[p.id]=a[p.id]??null;i.reading_values=d}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(i.photo_doc_ids=this._photos.ids),Object.keys(i).filter(a=>!["type","entry_id","task_id","original_timestamp"].includes(a)).length===0){this.close();return}await this._runWs(i)!==void 0&&(this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:t.entry_id,task_id:t.task_id,new_timestamp:t.timestamp},bubbles:!0,composed:!0})),this.close())}render(){if(!this._open||!this._draft)return c;let t=this._lang,n=this._draft,i=this._error||this._photos.errorText(t);return U(()=>this.close(),l`
        <h2>${r("history_edit_title",t)}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${r(n.type,t)||n.type}</span>
        </div>
        <ms-date-field
          kind="datetime"
          required
          .hass=${this.hass}
          .lang=${t}
          .label=${r("history_edit_timestamp",t)}
          .helper=${Ut(t)}
          .value=${jt(n.timestamp)}
          @value-changed=${o=>{let a=o.detail.value;a&&this._set("timestamp",a)}}
        ></ms-date-field>
        <label>
          <span>${r("notes_label",t)}</span>
          <textarea
            rows="3"
            @input=${o=>{let a=o.target.value;this._set("notes",a||null)}}
            .value=${n.notes??""}></textarea>
        </label>
        <div class="row">
          <div class="cost-field">
            <span>${r("cost",t)}</span>
            <ms-cost-input .lang=${t} .value=${n.cost!=null?String(n.cost):""}
              @value-changed=${o=>{let a=o.detail.value;this._set("cost",a?Number(a):null)}}></ms-cost-input>
          </div>
          <label>
            <span>${r("duration",t)}</span>
            <input type="number" min="0" step="1" inputmode="numeric"
              .value=${n.duration!=null?String(n.duration):""}
              @input=${o=>{this._set("duration",ce(o.target.value))}} />
          </label>
        </div>
        ${this._renderReadings(n,t)}
        ${this._partOptions&&this._partOptions.length>0?l`
          <div class="parts-block">
            <span class="parts-title">${r("complete_parts_used",t)}</span>
            ${this._partOptions.map(o=>{let a=`${o.entry_id}:${o.part_id}`,d=this._partQty[a]||0;return l`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${d>0}
                    @change=${p=>{let h=p.target.checked;this._partQty={...this._partQty,[a]:h?1:0}}} />
                  <span class="part-label">${o.name}${o.foreign&&o.object_name?` (${o.object_name})`:""}</span>
                  ${d>0?l`
                    <input class="part-qty" type="number" min=${kt[0]} max=${kt[1]} step="0.01"
                      .value=${String(d)}
                      @input=${p=>{let h=parseFloat(p.target.value);!isNaN(h)&&h>0&&(this._partQty={...this._partQty,[a]:h})}} />
                  `:c}
                </label>
              `})}
          </div>
        `:c}
        <div class="photos-block">
          <span class="parts-title">${r("completion_photos",t)}</span>
          ${this._photos.photos.length>0?l`
            <div class="photo-strip">
              ${this._photos.photos.map(o=>l`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${o.id}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${r("remove",t)}
                    @click=${()=>this._photos.remove(o.id)}>✕</button>
                </div>`)}
            </div>`:c}
          ${this._photos.full?l`<span class="photos-hint">${r("photos_limit",t).replace("{max}",String(this._photos.max))}</span>`:l`<ms-photo-picker .lang=${t} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${o=>this._photos.addFiles(o.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${r("history_edit_photos_hint",t)}</span>
        </div>
        ${i?l`<div class="error">${i}</div>`:c}
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
    `)}updated(t){t.has("_open")&&this._open&&B(this.shadowRoot)}_renderReadings(t,n){return this._readingRows.length>0?l`
        <div class="readings-block">
          <span class="parts-title">${r("readings_section",n)}</span>
          ${this._readingRows.map(i=>l`
            <label class="reading-row-edit">
              <span class="reading-row-name">${i.name}${i.unit?` (${i.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[i.id]??""}
                @input=${o=>{this._readingText={...this._readingText,[i.id]:o.target.value}}} />
            </label>
          `)}
        </div>`:t.reading_value==null&&t.task_type!=="reading"?c:l`
      <label>
        <span>${r("reading_value_label",n)}${t.reading_unit?` (${t.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${t.reading_value!=null?String(t.reading_value):""}
          @input=${i=>{let o=i.target.value,a=o===""?NaN:Number(o);this._set("reading_value",isNaN(a)?null:a)}} />
      </label>`}};b.styles=[oe,G,L`
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
  `],u([A({attribute:!1})],b.prototype,"hass",2),u([m()],b.prototype,"_open",2),u([m()],b.prototype,"_saving",2),u([m()],b.prototype,"_error",2),u([m()],b.prototype,"_draft",2),u([m()],b.prototype,"_partOptions",2),u([m()],b.prototype,"_partQty",2),u([m()],b.prototype,"_readingRows",2),u([m()],b.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",b);function _e(e,s,t=new Date){let n=e?.hours,i=at(e?.snoozed_until);if(typeof n!="number"||!Number.isFinite(i))return r("snoozed",s);let o=it(),d=F(i,o)===F(t,o)?Y(new Date(i),s):ot(e.snoozed_until,s);return Wt("snoozed_for","snoozed_for_one",n,s,"hours").replace("{until}",d)}function Ge(e,s){if(s<=0)return 0;let t=typeof e=="number"&&Number.isFinite(e)?Math.trunc(e):0;return t<0?0:t%s}function Ue(e){return!!(e?.phases&&e.phase_sequence&&e.phase_sequence.length>0)}function wt(e){if(!e||!Ue(e))return null;let s=e.phase_sequence,t=Ge(e.phase_cursor,s.length),n=s[t],i=e.phases?.[n];return i?{id:n,name:i.name,index:t,count:s.length,notes:i.notes,checklist:i.checklist!==void 0?i.checklist:e.checklist??[],consumesParts:i.consumes_parts!==void 0?i.consumes_parts:e.consumes_parts??[],requiredFields:i.required_completion_fields!==void 0?i.required_completion_fields:e.required_completion_fields??[]}:null}function J(e){let s=wt(e);return s?`${s.index+1}/${s.count} \xB7 ${s.name}`:""}function Be(e,s){return typeof e=="number"&&Number.isFinite(e)&&e>=.01?e:s}function fe(e){let s=e.task??null,t=s?wt(s):null,n=t?t.consumesParts:s?.consumes_parts||[],i=!!s?.part_ref,o=e.objects.find(f=>f.entry_id===e.entryId)?.parts||[],a=i?o.find(f=>f.id===s.part_ref.part_id):void 0,d=e.features?e.features.checklists:e.checklistsEnabled??!0,p=e.features?e.features.checklists?e.checklist??s?.checklist??[]:[]:e.checklist??[],h=e.features?e.features.adaptive&&(e.adaptiveEnabled??!!s?.adaptive_config?.enabled):!!e.adaptiveEnabled;return{entry_id:e.entryId,task_id:e.taskId,task_name:e.taskName,checklist:t?d?t.checklist:[]:p,adaptive_enabled:h,required_completion_fields:t?t.requiredFields:s?.required_completion_fields||[],task_type:s?.type||"",reading_unit:s?.reading_unit||"",readings:s?.readings||[],reading_history:ie(s?.history),parts:i?[]:ne({consumes_parts:n},e.entryId,e.objects,e.lang),consumes_parts:i?[]:n,phase_label:t?J(s):"",require_tag_scan:!!s?.require_tag_scan,restock_default:i?Be(a?.restock_quantity,1):null,restock_unit_cost:i?a?.cost??null:null,restock_package:i&&a?.package_size?Gt(a.package_size,a.unit,e.lang):"",currency_symbol:Z({currency_symbol:e.currencySymbol}),consumes_info:n.map(f=>se(f,e.entryId,e.objects,e.lang)),checklist_prefill:s?.checklist_progress||{},via_tag_scan:!!e.viaTagScan,parts_cost_mode:e.partsCostMode??"purchase"}}function ge(e,s,t){e.entryId=s.entry_id,e.taskId=s.task_id,e.taskName=s.task_name,e.lang=t,e.checklist=s.checklist??[],e.adaptiveEnabled=!!s.adaptive_enabled,e.requiredFields=s.required_completion_fields??[],e.taskType=s.task_type??"",e.readingUnit=s.reading_unit??"",e.readings=s.readings??[],e.readingHistory=s.reading_history??[],e.parts=s.parts??[],e.consumesParts=s.consumes_parts??[],e.phaseLabel=s.phase_label??"",e.requireTagScan=!!s.require_tag_scan,e.restockDefault=s.restock_default??null,e.restockUnitCost=s.restock_unit_cost??null,e.restockPackage=s.restock_package??"",e.currencySymbol=Z(s),e.consumesInfo=s.consumes_info??[],e.checklistPrefill=s.checklist_prefill??{},e.viaTagScan=!!s.via_tag_scan,e.partsCostMode=s.parts_cost_mode??"purchase",e.open({viaTagScan:!!s.via_tag_scan})}var Q=(e,s)=>{let t=e._$AN;if(t===void 0)return!1;for(let n of t)n._$AO?.(s,!1),Q(n,s);return!0},ut=e=>{let s,t;do{if((s=e._$AM)===void 0)break;t=s._$AN,t.delete(e),e=s}while(t?.size===0)},ye=e=>{for(let s;s=e._$AM;e=s){let t=s._$AN;if(t===void 0)s._$AN=t=new Set;else if(t.has(e))break;t.add(e),Ye(s)}};function Ke(e){this._$AN!==void 0?(ut(this),this._$AM=e,ye(this)):this._$AM=e}function Ze(e,s=!1,t=0){let n=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(s)if(Array.isArray(n))for(let o=t;o<n.length;o++)Q(n[o],!1),ut(n[o]);else n!=null&&(Q(n,!1),ut(n));else Q(this,e)}var Ye=e=>{e.type==te.CHILD&&(e._$AP??=Ze,e._$AQ??=Ke)},ht=class extends ee{constructor(){super(...arguments),this._$AN=void 0}_$AT(s,t,n){super._$AT(s,t,n),ye(this),this.isConnected=s._$AU}_$AO(s,t=!0){s!==this.isConnected&&(this.isConnected=s,s?this.reconnected?.():this.disconnected?.()),t&&(Q(this,s),ut(this))}setValue(s){if(Xt(this._$Ct))this._$Ct._$AI(s,this);else{let t=[...this._$Ct._$AH];t[this._$Ci]=s,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}};var At=new WeakMap,ve=$t(class extends ht{render(e){return c}update(e,[s]){let t=s!==this.G;return t&&this.G!==void 0&&this.rt(void 0),(t||this.lt!==this.ct)&&(this.G=s,this.ht=e.options?.host,this.rt(this.ct=e.element)),c}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){let s=this.ht??globalThis,t=At.get(s);t===void 0&&(t=new WeakMap,At.set(s,t)),t.get(this.G)!==void 0&&this.G.call(this.ht,void 0),t.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G=="function"?At.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var Je=new Set(["about","blob","data","file","filesystem","javascript","livescript","ms-appinstaller","ms-cxh","ms-cxh-full","ms-msdt","ms-officecmd","search","search-ms","view-source","vbscript"]);function Tt(e){return e.replace(/[\t\n\r]/g,"").replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g,"")}function Et(e){let s=/^([a-z][a-z0-9+.-]+):/i.exec(Tt(e||""));return s?s[1].toLowerCase():null}function mt(e){let s=Et(e);return s!==null&&!Je.has(s)}function be(e){return!!e&&/^https?:\/\//i.test(e)}function ft(e){if(!e)return c;if(customElements.get("ha-markdown")){let{content:s,links:t}=ts(e);return l`<ha-markdown
      class="notes-md"
      .content=${s}
      breaks
      ${ve(n=>es(n,t))}
    ></ha-markdown>`}return l`${e}`}var St="https://app-link.invalid/",Qe=new Set(["http","https","mailto","tel","ftp"]),Xe=/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/,_t="[a-zA-Z][a-zA-Z0-9+.-]+:";function ts(e){let s=[],t=o=>{let a=Et(o);return!a||Qe.has(a)||!mt(o)?null:(s.push(Tt(o)),`${St}${s.length-1}`)},n=o=>o.replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)<(${_t}[^>\\n]*)>`,"g"),(a,d,p,h)=>{let f=d?null:t(h);return f?`${p}${f}`:a}).replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)(${_t}[^\\s)]*)`,"g"),(a,d,p,h)=>{let f=d?null:t(h);return f?`${p}${f}`:a}).replace(new RegExp(`(^|[^(])<(${_t}[^\\s<>]*)>`,"gm"),(a,d,p)=>{let h=t(p);return h?`${d}[${p.replace(/([\\[\]])/g,"\\$1")}](${h})`:a}).replace(new RegExp(`^( {0,3}\\[[^\\]\\n]+\\]:[ \\t]*)<?(${_t}[^\\s>]*)>?`,"gm"),(a,d,p)=>{let h=t(p);return h?`${d}${h}`:a});return{content:e.split(Xe).map((o,a)=>a%2?o:n(o)).join(""),links:s}}function Lt(e,s){for(let t of e.querySelectorAll(`a[href^="${St}"]`)){let n=s[Number(t.getAttribute("href").slice(St.length))];n&&t.setAttribute("href",n)}}var $e=new WeakMap;function es(e,s){if(!e)return;let t=$e.get(e);if(!t&&s.length===0)return;if(t){t.links=s,e.shadowRoot&&Lt(e.shadowRoot,s);return}let n={links:s};$e.set(e,n),(async()=>{await e.updateComplete;let i=e.shadowRoot;i&&(new MutationObserver(()=>Lt(i,n.links)).observe(i,{childList:!0,subtree:!0}),Lt(i,n.links))})()}function Ct(e,s,t,n){let i=t,o=p=>typeof p=="string"?p:null,a=p=>typeof p=="number"?p:null,d=o(i.timestamp)??"";return{entry_id:e,task_id:s,original_timestamp:d,type:o(i.type)||"completed",timestamp:d,notes:o(i.notes),cost:a(i.cost),duration:a(i.duration),completed_by:o(i.completed_by),used_parts:Array.isArray(i.used_parts)?i.used_parts:null,photo_doc_ids:ct(i),reading_value:a(i.reading_value),reading_values:dt(i),readings:n?.readings??[],task_type:n?.type??null,reading_unit:n?.reading_unit??null}}async function Cn(e,s,t,n){let o=(await e.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:s})).tasks?.find(d=>d.id===t);if(!o)return null;let a=o.history?.find(d=>d.timestamp===n);return a||(a=(await le(e,s,t))?.find(p=>p.timestamp===n)),a?Ct(s,t,a,o):null}var xe=e=>typeof e=="number"&&Number.isInteger(e)&&e>0;function ss(e){return e&&xe(e.ref_no)?String(e.ref_no):null}function ke(e,s){let t=ss(e);return t&&s&&xe(s.ref_no)?`${t}.${s.ref_no}`:null}function Rn(e){let s=/^(\d+)(?:\.(\d+)(?:-(\d+))?)?$/.exec(e.trim());return s?{object:Number(s[1]),task:s[2]?Number(s[2]):null,entry:s[3]?Number(s[3]):null}:null}function we(e,s){return e?l`<span class="ref-chip" title=${s??""}>#${e}</span>`:c}function Pt(e){let s=t=>{let n=at(t.timestamp);return Number.isNaN(n)?-1/0:n};return(e??[]).map((t,n)=>({entry:t,index:n,at:s(t)})).sort((t,n)=>n.at-t.at||n.index-t.index).map(t=>t.entry)}var ns=["completed","skipped","missed","reset","triggered","trigger_replaced","trigger_removed"];function Gn(e,s){let t=s.lang;return l`
    <div class="history-filters-new">
      <div class="filter-chips">
        ${ns.map(n=>{let i=e.history.filter(o=>o.type===n).length;return i===0?c:l`
            <span class="filter-chip ${s.filter===n?"active":""}"
              @click=${()=>s.setFilter(s.filter===n?null:n)}>
              ${r(n,t)} (${i})
            </span>
          `})}
        ${s.filter?l`<span class="filter-chip clear" @click=${()=>s.setFilter(null)}>${r("show_all",t)}</span>`:c}
      </div>
      <div class="filter-controls">
        <input type="text" class="search-input" placeholder="${r("search_notes",t)}..." .value=${s.search} @input=${n=>s.setSearch(n.target.value)} />
      </div>
    </div>
  `}function Un(e,s){let t=s.lang,n=s.filter?e.history.filter(i=>i.type===s.filter):e.history;if(s.search){let i=s.search.toLowerCase();n=n.filter(o=>vt(o.notes,s.search)||vt(xt(o.notes,t),s.search)||(Ae(s,o)??"").toLowerCase().endsWith(i))}return n.length===0?l`<p class="empty">${r("no_history",t)}</p>`:l`
    <div class="history-timeline">
      ${Pt(n).map(i=>Ht(i,s))}
    </div>
  `}function Ae(e,s){return e.taskRef&&s.ref_no?`${e.taskRef}-${s.ref_no}`:null}function is(e,s){let t=ct(s);return t.length>0?l`<div class="history-photos">
        ${t.map(n=>l`<maintenance-history-photo .hass=${e} .docId=${n}></maintenance-history-photo>`)}
      </div>`:c}function rs(e,s){let t=s.lang,n=a=>y(a,t,{maximumFractionDigits:3}),i=a=>a==null?"":` (${a>=0?"+":""}${n(a)})`,o=dt(e);return o.length>0?l`<div class="history-readings">
      ${o.map(a=>l`<span class="history-reading">
        <span class="history-reading-name">${a.name}</span>
        <span class="history-reading-value">${n(a.value)}${a.unit?` ${a.unit}`:""}${i(s.readingSlotDelta?.(e,a.id))}</span>
      </span>`)}
    </div>`:e.reading_value!=null?l`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${r("reading_label",t)}</span>
      <span class="history-reading-value">${n(e.reading_value)}${s.readingUnit?` ${s.readingUnit}`:""}${i(s.readingDelta?.(e))}</span>
    </span></div>`:c}function Ht(e,s,t={}){let n=s.lang,{compact:i=!1,showRef:o=!0,showBadges:a=!0,showEdit:d=!0}=t,p=s.openEdit,h=d&&!!p&&Dt.includes(e.type),f=typeof e.parts_cost=="number"?e.parts_cost:null,k=e.cost_basis==="use",z=k&&!!e.purchase;return l`
    <div class="history-entry${i?" compact":""}">
      ${i?c:l`<div class="history-icon ${e.type}" style="background: ${Ot(e.type)}">
            <ha-icon .icon=${nt[e.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        <div class="history-row">
          <strong>${r(e.type,n)}</strong>
          ${o?we(Ae(s,e),r("ref_number",n)):c}
          ${a&&e.phase_id?l`<span class="history-phase-badge">${s.phaseNames?.[e.phase_id]||e.phase_id}</span>`:c}
          ${a&&e.auto?l`<span class="history-auto-badge">${r("history_auto",n)}</span>`:c}
          ${h?l`<button class="history-edit-btn"
                     title=${r("history_edit_button",n)}
                     @click=${()=>p(e)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:c}
        </div>
        <div class="history-date">${ot(e.timestamp,n)}</div>
        ${e.notes?l`<div class="history-notes">${xt(e.notes,n)}</div>`:c}
        ${is(s.hass,e)}
        ${rs(e,s)}
        ${e.cost!=null||e.duration!=null||e.trigger_value!=null||f!=null?l`<div class="history-details">
              ${e.cost!=null?z?l`<span>${r("history_purchase_stock",n).replace("{amount}",W(e.cost,s.currencySymbol,n))}</span>`:e.cost<0?l`<span class="history-credit">${Vt(e.cost,s.currencySymbol,n)}</span>`:l`<span>${r("cost",n)}: ${W(e.cost,s.currencySymbol,n)}</span>`:c}
              ${f!=null?l`<span title=${r(k?"history_parts_counted_hint":"history_parts_info_hint",n)}>${r(k?"history_parts_counted":"history_parts_info",n).replace("{amount}",W(f,s.currencySymbol,n))}</span>`:c}
              ${e.duration!=null?l`<span>${r("duration",n)}: ${lt(e.duration,n)}</span>`:c}
              ${e.trigger_value!=null?l`<span>${r("trigger_val",n)}: ${e.trigger_value}</span>`:c}
            </div>`:c}
      </div>
    </div>
  `}var as="var(--maint-done-color, #78909c)",os="var(--secondary-text-color, #727272)";function X(e){if(e.archived)return"archived";if(e.is_done)return"done";let s=e.status||"ok";return s==="ok"&&e.schedule_type==="manual"&&e.days_until_due==null?"no_due":s}var ls={done:"completed",no_due:"no_due_date"};function Rt(e,s){return r(ls[e]??e,s)}function gt(e){let s=X(e);return s==="done"?as:s==="no_due"?os:It[s]||"var(--disabled-color, #9e9e9e)"}function ds(e){return e==="no_due"?"mdi:calendar-blank-outline":nt[e==="done"?"completed":e]||"mdi:circle-medium"}function Te(e,s,t="pill"){let n=X(e),i=Rt(n,s);return t==="chip"?l`<span class="status-chip ${n}">${i}</span>`:l`<span class="status-badge ${n}" role="img" title="${i}" aria-label="${i}"><ha-icon icon="${ds(n)}"></ha-icon><span class="status-label">${i}</span></span>`}function _(e){return e.toFixed(1)}function ti(e,s,t=4){if(!isFinite(e)||!isFinite(s))return{ticks:[],niceMin:0,niceMax:1};if(e===s){let h=Math.abs(e)*.1||1;e-=h,s+=h}let n=s-e,i=Math.pow(10,Math.floor(Math.log10(n/Math.max(1,t)))),o=i;for(let h of[1,2,5,10])if(o=i*h,n/o<=t+.5)break;let a=Math.floor(e/o)*o,d=Math.ceil(s/o)*o,p=[];for(let h=a;h<=d+o*1e-6;h+=o)p.push(Math.abs(h)<o*1e-9?0:h);return{ticks:p,niceMin:a,niceMax:d}}function cs(e,s){let t=Math.abs(e),n=i=>({maximumFractionDigits:i});return t>=1e6?y(e/1e6,s,n(t>=1e7?0:1))+"M":t>=1e4?y(e/1e3,s,n(0))+"k":t>=1e3?y(e/1e3,s,n(1))+"k":t>=100?y(e,s,n(0)):t>=1?y(e,s,n(1)):t===0?"0":y(e,s,n(2))}function ei(e,s,t){let n=Math.abs(e),i=y(e,t,{maximumFractionDigits:n>=100?0:n>=1||n===0?1:2});return s?`${i} ${s}`:i}function si(e,s,t){if(Math.abs(e)>=1e3||!(s>0))return cs(e,t);let n=Math.max(0,Math.min(4,-Math.floor(Math.log10(s)+1e-9)));return y(e,t,{maximumFractionDigits:n})}function ni(e,s,t,n){return n-t<2*864e5?Y(new Date(e),s):ps(e,s,us(t,n))}function ps(e,s,t){return bt(new Date(e),s,t)}function ii(e,s){let t=new Date(e);return`${bt(t,s)}, ${Y(t,s)}`}function us(e,s){if(!Number.isFinite(e)||!Number.isFinite(s))return!1;let t=it();return F(e,t).slice(0,4)!==F(s,t).slice(0,4)}function ri(e,s,t){if(t<2||s<=e)return[e,s];let n=[];for(let i=0;i<t;i++)n.push(e+(s-e)*i/(t-1));return n}function Ee(e,s){let t=e.interval_analysis,n=t?.weibull_beta,i=t?.weibull_eta;if(n==null||i==null||i<=0)return c;let o=e.interval_days??0,a=e.suggested_interval??o;return l`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${r("weibull_reliability_curve",s)}
        ${hs(n,s)}
      </div>
      ${ms(n,i,o,a,s)}
      ${_s(t,s)}
      ${t?.confidence_interval_low!=null?fs(t,e,s):c}
    </div>
  `}function hs(e,s){let t,n,i;return e<.8?(t="early_failures",n="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):e<=1.2?(t="random_failures",n="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):e<=3.5?(t="wear_out",n="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(t="highly_predictable",n="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),l`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${n}"></ha-svg-icon>
      ${r(i,s)} (\u03B2=${y(e,s,2)})
    </span>
  `}function ms(e,s,t,n,i){let $=Math.max(t,n,s,1)*1.3,P=50,H=[];for(let w=0;w<=P;w++){let E=w/P*$,qe=1-Math.exp(-Math.pow(E/s,e)),Fe=32+E/$*260,We=136-qe*128;H.push([Fe,We])}let tt=H.map(([w,E])=>`${_(w)},${_(E)}`).join(" "),yt="M32,136 "+H.map(([w,E])=>`L${_(w)},${_(E)}`).join(" ")+` L${_(H[P][0])},136 Z`,j=32+t/$*260,et=1-Math.exp(-Math.pow(t/s,e)),st=136-et*128,Ne=y((1-et)*100,i,0),Mt=32+n/$*260,je=[0,.25,.5,.75,1];return l`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${r("chart_weibull",i)}">
        ${je.map(w=>{let E=136-w*128;return q`
            <line x1="${32}" y1="${_(E)}" x2="${292}" y2="${_(E)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${w===.5?"4,3":c}" />
            <text x="${28}" y="${_(E+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${y(w*100,i,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round($/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round($)}</text>

        <path d="${yt}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${tt}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?q`
          <line x1="${_(j)}" y1="${8}" x2="${_(j)}" y2="${_(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${_(j)}" cy="${_(st)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${_(j+4)}" y="${_(st-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${Ne}%</text>
        `:c}

        ${n>0&&n!==t?q`
          <line x1="${_(Mt)}" y1="${8}" x2="${_(Mt)}" y2="${_(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:c}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${r("weibull_failure_probability",i)}</span>
      ${t>0?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${r("current_interval_marker",i)}</span>`:c}
      ${n>0&&n!==t?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${r("recommended_marker",i)}</span>`:c}
    </div>
  `}function _s(e,s){return l`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${r("characteristic_life",s)}</span>
        <span class="weibull-info-value">${Math.round(e.weibull_eta)} ${r("days",s)}</span>
      </div>
      ${e.weibull_r_squared!=null?l`
        <div class="weibull-info-item">
          <span>${r("weibull_r_squared",s)}</span>
          <span class="weibull-info-value">${y(e.weibull_r_squared,s,3)}</span>
        </div>
      `:c}
    </div>
  `}function fs(e,s,t){let n=e.confidence_interval_low,i=e.confidence_interval_high,o=s.suggested_interval??s.interval_days??0,a=s.interval_days??0,d=Math.max(0,n-5),h=i+5-d,f=(n-d)/h*100,k=(i-n)/h*100,z=(o-d)/h*100,$=a>0?(a-d)/h*100:-1;return l`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${r("confidence_interval",t)}: ${o} ${r("days",t)} (${n}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${_(f)}%;width:${_(k)}%"></div>
        ${$>=0?l`<div class="confidence-marker current" style="left:${_($)}%"></div>`:c}
        <div class="confidence-marker recommended" style="left:${_(z)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${r("confidence_conservative",t)} (${n}${r("days",t).charAt(0)})</span>
        <span class="confidence-text high">${r("confidence_aggressive",t)} (${i}${r("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function Le(e,s,t){let n=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data",i=e.days_until_threshold!=null,o=e.environmental_factor!=null&&e.environmental_factor!==1;if(!n&&!i&&!o)return c;let a=e.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":e.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return l`
    <div class="prediction-section">
      ${e.sensor_prediction_urgency?l`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${r("sensor_prediction_urgency",s).replace("{days}",String(Math.round(e.days_until_threshold||0)))}
        </div>
      `:c}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${r("sensor_prediction",s)}
      </div>
      <div class="prediction-grid">
        ${n?l`
          <div class="prediction-item">
            <ha-svg-icon path="${a}"></ha-svg-icon>
            <span class="prediction-label">${r("degradation_trend",s)}</span>
            <span class="prediction-value ${e.degradation_trend}">${r("trend_"+e.degradation_trend,s)}</span>
            ${e.degradation_rate!=null?l`<span class="prediction-rate">${e.degradation_rate>0?"+":""}${y(e.degradation_rate,s,Math.abs(e.degradation_rate)>=10?0:1)} ${e.trigger_entity_info?.unit_of_measurement||""}/${r("day_short",s)}</span>`:c}
          </div>
        `:c}
        ${i?l`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${r("days_until_threshold",s)}</span>
            <span class="prediction-value prediction-days${e.days_until_threshold===0?" exceeded":e.sensor_prediction_urgency?" urgent":""}">${e.days_until_threshold===0?r("threshold_exceeded",s):"~"+Math.round(e.days_until_threshold)+" "+r("days",s)}</span>
            ${e.threshold_prediction_date?l`<span class="prediction-date">${D(e.threshold_prediction_date,s)}</span>`:c}
            ${e.threshold_prediction_confidence?l`<span class="confidence-dot ${e.threshold_prediction_confidence}"></span>`:c}
            ${(e.prediction_cycles??0)>0?l`<span class="prediction-cycles">${r("prediction_cycles",s)}: ${e.prediction_cycles}</span>`:c}
          </div>
        `:c}
        ${o&&t.environmental?l`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${r("environmental_adjustment",s)}</span>
            <span class="prediction-value">${y(e.environmental_factor,s,2)}x</span>
            ${e.environmental_entity?l`<span class="prediction-entity entity-link" @click=${d=>Zt(d,e.environmental_entity)}>${e.environmental_entity}</span>`:c}
          </div>
        `:c}
      </div>
    </div>
  `}function Se(e,s,t,n){let i=Math.max(e||1,s);return l`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${r("current",n)}: ${e??"\u2014"} ${e!=null?r("days",n):""}
        </div>
        <div class="interval-visual current"
          style="width: ${e!=null?Math.min(e/i*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${r("recommended",n)}: ${s} ${r("days",n)}
          <span class="confidence-badge ${t}">${r(`confidence_${t}`,n)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(s/i*100,100)}%"></div>
      </div>
    </div>
  `}var Ce=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function Pe(){return Number(rt().slice(5,7))-1}function He(e,s,t){if(!t.seasonal||!e.seasonal_factor||e.seasonal_factor===1)return c;let n=Ce.map(d=>r(d,s)),i=Pe(),o=e.seasonal_factors||e.interval_analysis?.seasonal_factors||null,a=o&&o.length===12?o:n.map((d,p)=>{let h=e.seasonal_factor||1,f=Math.sin((p-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,h+f))});return l`
    <div class="seasonal-card-compact">
      <h4>${r("seasonal_awareness",s)}</h4>
      <div class="seasonal-mini-chart">
        ${a.map((d,p)=>{let h=d*40,f=d<.9?"low":d>1.1?"high":"normal";return l`
            <div class="seasonal-bar ${f} ${p===i?"current":""}"
                 style="height: ${h}px"
                 title="${n[p]}: ${y(d,s,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${r("shorter",s)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${r("normal",s)}</span>
        <span class="legend-item"><span class="dot high"></span> ${r("longer",s)}</span>
      </div>
    </div>
  `}function Re(e,s){return gs(e,s)}function gs(e,s){let t=e.seasonal_factors??e.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return c;let n=e.interval_analysis?.seasonal_reason,i=Pe(),o=300,a=100,d=8,h=a-d-4,f=Math.max(...t,1.5),k=o/12,z=k*.65,$=d+h-1/f*h;return l`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${r("seasonal_chart_title",s)}
        ${n?l`<span class="source-tag">${n==="learned"?r("seasonal_learned",s):r("seasonal_manual",s)}</span>`:c}
      </div>
      <svg viewBox="0 0 ${o} ${a}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${r("chart_seasonal",s)}">
        <line x1="0" y1="${_($)}" x2="${o}" y2="${_($)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((P,H)=>{let tt=P/f*h,yt=H*k+(k-z)/2,j=d+h-tt,et=H===i,st=P<1?"var(--success-color, #4caf50)":P>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return q`
            <rect x="${_(yt)}" y="${_(j)}"
              width="${_(z)}" height="${_(tt)}"
              fill="${st}" opacity="${et?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${Ce.map((P,H)=>l`<span class="seasonal-label ${H===i?"active-month":""}">${r(P,s)}</span>`)}
      </div>
    </div>
  `}var g=class extends S{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showPostpone=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._postponeDate="";this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1};this._toast="";this._toastTimer=new ue;this._access=pt;this._currencySymbol="";this._partsCostMode="purchase";this._loadSeq=0}get _lang(){return x(this.hass)}async openFor(t,n){(t!==this._entryId||n!==this._taskId)&&(this._task=null),this._entryId=t,this._taskId=n,this._error="",this._showSkip=!1,this._showReset=!1,this._showPostpone=!1,this._showAdaptive=!1,this._skipReason="",this._postponeDate="",this._resetDate=rt(),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let t=await R(this.hass);this._features={...this._features,...t.features},this._access=t.access,this._currencySymbol=Z(t.budget??void 0),qt(t.budget??void 0),this._partsCostMode=t.partsCostMode}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(t,n){this._toast=t,this._toastTimer.schedule(()=>{this._toast=""},n)}async _loadTask(){let t=this._entryId,n=this._taskId;if(!t||!n)return;let i=++this._loadSeq,o="",a=await C(this,{type:"maintenance_supporter/object",entry_id:t},{onError:p=>{o=p}});if(i!==this._loadSeq)return;if(a===void 0){this._error=o;return}this._objectName=a?.object?.name||"";let d=(a?.tasks||[]).find(p=>p.id===n);this._task=d??null,this._taskRef=ke(a?.object,d),d||(this._error=r("ws_err_not_found",this._lang))}_runWs(t){return this._error="",C(this,t,{busy:n=>{this._busy=n},onError:n=>{this._error=n}})}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-ZHGD53H2.js").then(async({openCompleteDialog:t})=>{let n=this._task,i=[];try{i=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}t(fe({entryId:this._entryId,taskId:this._taskId,taskName:n.name,task:n,objects:i,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol,partsCostMode:this._partsCostMode}))&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})!==void 0&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})!==void 0&&(this._notifyChanged("reset"),this.close())}async _onPostponeConfirm(){if(!this._entryId||!this._taskId||!this._postponeDate)return;await this._runWs({type:"maintenance_supporter/task/postpone",entry_id:this._entryId,task_id:this._taskId,until:this._postponeDate})!==void 0&&(this._notifyChanged("postpone"),this.close())}async _onSnooze(){if(!this._entryId||!this._taskId)return;let t=await this._runWs({type:"maintenance_supporter/task/snooze",entry_id:this._entryId,task_id:this._taskId});t!==void 0&&(this._notifyChanged("snooze"),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:_e(t,this._lang)},bubbles:!0,composed:!0})),this.close())}_onEdit(){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-ZHGD53H2.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-ZHGD53H2.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId||!await N(this.hass,{title:r("delete",this._lang),message:r("delete_task_confirm",this._lang),confirmText:r("delete",this._lang),danger:!0}))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})!==void 0&&(this._showToast(r("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!this._entryId||!this._taskId)return;let t=await this._runWs({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});t!==void 0&&(this._showToast(t?.recommended_interval?`${r("reanalyze_result",this._lang)}: ${Bt(t.recommended_interval,"days",this._lang)} (${t.data_points} ${r("data_points",this._lang)})`:r("reanalyze_insufficient_data",this._lang)),await this._loadTask())}_onEditHistoryEntry(t){if(!this._entryId||!this._taskId)return;let n=Ct(this._entryId,this._taskId,t,this._task);import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-ZHGD53H2.js").then(({openHistoryEditDialog:i})=>i(n))}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return c;let n=this._lang;return l`
      <div class="recommendation-card">
        <h4>${r("suggested_interval",n)}</h4>
        ${Se(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",n)}
        <div class="recommendation-actions">
          ${V(this.hass?.user,this._access)?l`<button class="btn primary qa-apply-suggestion"
                @click=${this._applySuggestion} ?disabled=${this._busy}>
                <ha-icon icon="mdi:check"></ha-icon>
                ${r("apply_suggestion",n)}
              </button>`:c}
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${r("reanalyze",n)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(t){let n=this._lang,i=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,o=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,a=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,d=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!i&&!o&&!a&&!d?l`<div class="adaptive-empty">
        ${r("adaptive_no_data",n)}
      </div>`:l`
      <div class="adaptive-stack">
        ${this._toast?l`<div class="toast">${this._toast}</div>`:c}
        ${i?this._renderRecommendation(t):c}
        ${o?Le(t,n,this._features):c}
        ${a?Ee(t,n):c}
        ${d?l`
          ${He(t,n,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?Re(t,n):c}
        `:c}
      </div>
    `}_renderDetails(t){let n=this._lang,i=t.history||[],o=t.history_count??i.length,a=Pt(i).slice(0,20);return l`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${r("times_performed",n)}</span>
            <span class="stat-value">${t.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${r("total_cost",n)}</span>
            <span class="stat-value">${W(t.total_cost??0,this._currencySymbol,n)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${r("avg_duration",n)}</span>
            <span class="stat-value">${lt(t.average_duration!=null?Math.round(t.average_duration):null,n)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${r("history",n)}</strong>
          <span class="history-count">${o}</span>
        </div>
        ${i.length===0?l`<div class="history-empty">${r("history_empty",n)}</div>`:l`
              <div class="history-list">
                ${a.map(d=>Ht(d,{lang:n,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:V(this.hass?.user,this._access)?p=>this._onEditHistoryEntry(p):void 0,readingUnit:t.reading_unit,readingSlotDelta:(p,h)=>re(i,p,h),taskRef:this._taskRef},{compact:!0}))}
                ${o>a.length?l`<div class="history-more">… +${o-a.length} ${r("older_entries",n)}</div>`:c}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return c;let t=this._lang,n=this._task,i=V(this.hass?.user,this._access),o=!!n&&(!!n.archived||n.enabled===!1||n.status==="paused");return U(()=>this.close(),l`
        ${n?l`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${gt(n)}"></span>
                  <span class="task-name">${n.name}</span>
                  ${Te(n,t)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-ZHGD53H2.js").then(({openObjectQuickActions:a})=>{a(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${n.next_due?l`<span><strong>${r("next_due",t)}:</strong> ${D(n.next_due,t)}</span>`:c}
                  ${n.last_performed?l`<span><strong>${r("last_performed",t)}:</strong> ${D(n.last_performed,t)}</span>`:c}
                  ${n.schedule?.kind&&!["manual","one_time"].includes(n.schedule.kind)||n.interval_days!=null?l`<span><strong>${r("interval",t)}:</strong> ${Kt(n,t)}</span>`:c}
                  ${J(n)?l`<span><strong>${r("phase_current",t)}:</strong> ${J(n)}</span>`:c}
                </div>
                ${n.notes?l`<div class="notes-body">${ft(n.notes)}</div>`:c}
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:c}

              ${this._showSkip?l`
                    <div class="inline-form">
                      <ms-textfield label=${r("skip_reason",t)} .value=${this._skipReason}
                        @input=${a=>{this._skipReason=a.target.value}}></ms-textfield>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${r("cancel",t)}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${r("skip",t)}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?l`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${r("reset_to_date",t)}
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
                  `:this._showPostpone?l`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${r("postpone_date_prompt",t)}
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
                  `:l`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${this._onComplete} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${r("complete",t)}
                      </ha-button>
                      ${n.allow_skip!==!1?l`
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
                      ${i?l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-edit" @click=${this._onEdit} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                            ${r("edit",t)}
                          </ha-button>`:c}
                      <ha-button size="small" appearance="outlined" variant="neutral" class="qa-qr" @click=${this._onQr} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                        ${r("qr_code",t)}
                      </ha-button>
                      ${o?c:l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-postpone"
                            @click=${()=>{this._showPostpone=!0}} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:calendar-arrow-right"></ha-icon>
                            ${r("postpone",t)}…
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="neutral" class="qa-snooze" @click=${this._onSnooze} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:bell-sleep-outline"></ha-icon>
                            ${r("snooze",t)}
                          </ha-button>`}
                      ${i?l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-archive"
                            @click=${n.archived?this._onUnarchive:this._onArchive}
                            .disabled=${this._busy}>
                            <ha-icon slot="start" icon="${n.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                            ${n.archived?r("unarchive",t):r("archive",t)}
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
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?l`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?r("hide_stats",t):r("show_stats",t)}
                          </button>`:c}
                    </div>
                    ${this._showDetails?this._renderDetails(n):c}
                    ${this._showAdaptive?this._renderAdaptive(n):c}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${r("open_in_panel",t)}
                      </button>
                    </div>
                  `}
            `:this._error?l`<div class="error">${this._error}</div>`:l`<div class="loading">${r("loading",t)}</div>`}
    `)}updated(t){t.has("_open")&&this._open&&B(this.shadowRoot)}};g.styles=[Jt,G,L`
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
      color: var(--success-color, #4caf50); font-size: 13px; font-weight: 500;
    }
    /* The panel's card look (panel-styles.ts is not in this shadow root, so
       the card and its heading rendered bare). */
    .recommendation-card {
      padding: 16px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }
    .recommendation-card h4 { margin: 0 0 12px; font-size: 14px; }
    /* The panel's recommendation-card uses ha-button. We use plain <button>
       in this dialog's button styles. Re-style the action row to match. */
    .recommendation-actions {
      display: flex; gap: 8px; margin-top: 8px;
    }
    /* Constrain SVG charts so they fit the dialog width even on mobile. */
    .weibull-section, .seasonal-card-compact { max-width: 100%; }
    .weibull-chart svg { max-width: 100%; height: auto; }
    .details-toggle { gap: 12px; flex-wrap: wrap; }
  `],u([A({attribute:!1})],g.prototype,"hass",2),u([m()],g.prototype,"_open",2),u([m()],g.prototype,"_entryId",2),u([m()],g.prototype,"_taskId",2),u([m()],g.prototype,"_task",2),u([m()],g.prototype,"_objectName",2),u([m()],g.prototype,"_taskRef",2),u([m()],g.prototype,"_busy",2),u([m()],g.prototype,"_error",2),u([m()],g.prototype,"_showSkip",2),u([m()],g.prototype,"_showReset",2),u([m()],g.prototype,"_showPostpone",2),u([m()],g.prototype,"_showDetails",2),u([m()],g.prototype,"_showAdaptive",2),u([m()],g.prototype,"_skipReason",2),u([m()],g.prototype,"_resetDate",2),u([m()],g.prototype,"_postponeDate",2),u([m()],g.prototype,"_features",2),u([m()],g.prototype,"_toast",2),u([m()],g.prototype,"_access",2),u([m()],g.prototype,"_partsCostMode",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",g);var T=class extends S{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=pt;this._loadSeq=0}get _lang(){return x(this.hass)}async openFor(t){t!==this._entryId&&(this._data=null),this._entryId=t,this._error="",this._open=!0,await Promise.all([this._load(),R(this.hass).then(n=>{this._access=n.access})])}close(){this._loadSeq++,this._open=!1,this._data=null,this._error=""}async _load(){let t=this._entryId;if(!t)return;let n=++this._loadSeq,i="",o=await C(this,{type:"maintenance_supporter/object",entry_id:t},{onError:a=>{i=a}});n===this._loadSeq&&(o===void 0?this._error=i:this._data=o)}_runWs(t){return this._error="",C(this,t,{busy:n=>{this._busy=n},onError:n=>{this._error=n}})}_onEditObject(){!this._entryId||!this._data||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-ZHGD53H2.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-ZHGD53H2.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await N(this.hass,{title:r("delete",this._lang),message:r("delete_object_confirm",this._lang),confirmText:r("delete",this._lang),danger:!0}))return;let n=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:n})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:n},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t&&!await N(this.hass,{title:r("archive_object",this._lang),message:r("confirm_archive_object",this._lang),confirmText:r("archive_object",this._lang)}))return;let n=this._entryId;await this._runWs({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:n})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:n},bubbles:!0,composed:!0})),this.close())}_onTaskClick(t){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-ZHGD53H2.js").then(({openTaskQuickActions:n})=>{n(this._entryId,t)})}render(){if(!this._open)return c;let t=this._lang,n=this._data,i=n?.object,o=n?.tasks||[],a=V(this.hass?.user,this._access);return U(()=>this.close(),l`
        ${n&&i?l`
              <div class="header">
                <div class="title">${i.name}</div>
                ${this._renderMetaRow(i)}
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:c}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${r("tasks",t)}</strong>
                  <span class="count">${o.length}</span>
                </div>
                ${o.length===0?l`<div class="empty">${r("no_tasks",t)}</div>`:l`
                      <div class="task-list">
                        ${o.map(d=>l`
                          <div class="task-row" @click=${()=>this._onTaskClick(d.id)}>
                            <span class="status-dot" style="background: ${gt(d)}"></span>
                            <span class="task-name">${d.name}</span>
                            <span class="task-status ${X(d)}">${Rt(X(d),t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${i.notes?l`
                    <div class="notes-section">
                      <strong>${r("object_notes_label",t)}</strong>
                      <div class="notes-body">${ft(i.notes)}</div>
                    </div>
                  `:c}

              ${a?l`
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
                        <ha-icon icon="${i.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${i.archived?r("unarchive_object",t):r("archive_object",t)}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${r("delete",t)}
                      </button>
                    </div>
                  `:c}
            `:this._error?l`<div class="error">${this._error}</div>`:l`<div class="loading">${r("loading",t)}</div>`}
    `)}updated(t){t.has("_open")&&this._open&&B(this.shadowRoot)}_renderMetaRow(t){let n=this._lang,i=[];return t.area_id&&i.push([r("area",n),ae(t.area_id,this.hass?.areas,r("no_area",n))]),t.manufacturer&&i.push([r("manufacturer",n),t.manufacturer]),t.model&&i.push([r("model",n),t.model]),t.serial_number&&i.push([r("serial_number_label",n),t.serial_number]),t.installation_date&&i.push([r("installed",n),D(t.installation_date,n)]),t.warranty_expiry&&i.push([r("warranty",n),D(t.warranty_expiry,n)]),t.documentation_url&&i.push([r("documentation_url_label",n),t.documentation_url,mt(t.documentation_url)]),i.length===0?c:l`
      <div class="meta">
        ${i.map(([o,a,d])=>l`
            <div class="meta-item">
              <span class="meta-label">${o}</span>
              <span class="meta-value">${d||be(a)?l`<a href="${a}" target="_blank" rel="noopener noreferrer">${a}</a>`:a}</span>
            </div>
          `)}
      </div>
    `}};T.styles=[G,L`
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
  `],u([A({attribute:!1})],T.prototype,"hass",2),u([m()],T.prototype,"_open",2),u([m()],T.prototype,"_entryId",2),u([m()],T.prototype,"_data",2),u([m()],T.prototype,"_busy",2),u([m()],T.prototype,"_error",2),u([m()],T.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",T);var ys={changed_since:"undo_changed",nothing_to_undo:"undo_nothing"};async function vs(e,s,t,n){let i="",o=await C({hass:e},{type:"maintenance_supporter/task/undo",entry_id:s,task_id:t},{lang:n,onError:(a,d)=>{let p=ys[d?.code??""];i=p?r(p,n):a}});return o===void 0?{ok:!1,message:i}:{ok:!0,message:r(o?.action_ran?"undo_done_action_ran":"undo_done",n)}}function Me(e,s,t,n,i){let o=(a,d)=>e.dispatchEvent(new CustomEvent("hass-notification",{detail:d?{message:a,action:d,duration:1e4}:{message:a},bubbles:!0,composed:!0}));o(r("task_completed_named",n).replace("{task}",t.taskName),{text:r("undo",n),action:()=>{vs(s,t.entryId,t.taskId,n).then(a=>{o(a.message),a.ok&&i()})}})}var Ie="maintenance-object-dialog",De="maintenance-task-dialog",bs="maintenance-history-edit-dialog",$s="maintenance-complete-dialog",xs="maintenance-qr-dialog",ks="maintenance-task-quick-actions-dialog",ws="maintenance-object-quick-actions-dialog";function K(){return document.querySelector("home-assistant")?.hass}function As(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function M(e){let s=As(),t=s.querySelector(e)??document.body.querySelector(e);return t?t.parentNode!==s&&s.appendChild(t):(t=document.createElement(e),s.appendChild(t)),t}function I(e){let s=K();if(!s)return!1;e.hass=s;let t=x(s);return zt(t)||Nt(t).then(()=>{e.requestUpdate?.()}),Ft(s.locale,s.config?.country,s.config?.time_zone),!0}function kr(e){return R(e).then(s=>s.rowActionStyle)}function wr(){de()}function Ar(){let e=M(Ie);return I(e)?(e.openCreate(),Oe(e),!0):!1}async function Oe(e){let s=K();s&&(e.placesEnabled=(await R(s)).features.places)}function Tr(e,s){let t=M(Ie);return I(t)?(t.openEdit(e,s),Oe(t),!0):!1}function Er(e="",s){let t=M(De);if(!I(t))return!1;let n=K();return n?((async()=>{let i=await R(n),o=t;ze(o,i),o.openCreate(e,s)})(),!0):!1}function ze(e,s){e.checklistsEnabled=s.features.checklists,e.scheduleTimeEnabled=s.features.schedule_time,e.completionActionsEnabled=s.features.completion_actions,e.adaptiveFeature=s.features.adaptive,e.seasonalFeature=s.features.seasonal,e.environmentalFeature=s.features.environmental,e.defaultWarningDays=s.defaultWarningDays}function Lr(e,s){let t=M(De);if(!I(t))return!1;let n=K();return n?((async()=>{try{let[i,o]=await Promise.all([n.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e}),R(n)]),a=(i.tasks||[]).find(p=>p.id===s);if(!a){console.warn(`openEditTaskDialog: task ${s} not found in entry ${e}`);return}let d=t;ze(d,o),await d.openEdit(e,a)}catch(i){console.warn("openEditTaskDialog: failed to load task/features",i)}})(),!0):!1}function Sr(e){let s=M(bs);return I(s)?(s.openEdit(e),!0):!1}function Cr(e){let s=M($s);if(!I(s))return!1;let t=s;return t.__msUndoWired||(t.__msUndoWired=!0,s.addEventListener("task-completed",n=>{let i=n.detail,o=K();i?.undo&&o&&Me(s,o,i,x(o),()=>{})})),ge(s,e,x(K())),!0}function Pr(e){let s=M(xs);return I(s)?(s.openForTask(e.entry_id,e.task_id,e.object_name,e.task_name),!0):!1}function Hr(e,s){let t=M(ks);return I(t)?(t.openFor(e,s),!0):!1}function Rr(e){let s=M(ws);return I(s)?(s.openFor(e),!0):!1}export{mt as a,be as b,ss as c,ke as d,Rn as e,we as f,ft as g,Ge as h,Ue as i,wt as j,fe as k,ge as l,vs as m,_ as n,ti as o,cs as p,ei as q,si as r,ni as s,ps as t,ii as u,us as v,ri as w,Ct as x,Cn as y,_e as z,Pt as A,Gn as B,Un as C,Ht as D,X as E,Rt as F,Te as G,Ee as H,Le as I,Se as J,He as K,Re as L,kr as M,wr as N,Ar as O,Tr as P,Er as Q,Lr as R,Sr as S,Cr as T,Pr as U,Hr as V,Rr as W};
/*! Bundled license information:

lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/ref.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
