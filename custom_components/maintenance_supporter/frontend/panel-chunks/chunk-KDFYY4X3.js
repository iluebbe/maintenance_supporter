/*! maintenance_supporter frontend 2.117.0 */
import{a as pe,b as Q,c as mt,d as V,h as L,i as he,j as fe}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-VPNN3SP4.js";import{a as xt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-G6XAILXY.js";import{b as te}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-QG47BDDX.js";import{b as bt,i as de,z as ue}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-4VVXCYUX.js";import{b as ce,c as _e}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-UCO4UTWG.js";import{b as le,h as ht}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-TMONILC5.js";import{b as ie,c as re,f as ut,g as ae,i as oe,l as me}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-5NKC6VSZ.js";import{a as pt,b as ee,c as ne}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-34BXBLTY.js";import{c as ct}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-QH4BCVIF.js";import{k as kt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-DT46EPSM.js";import{a as U,b as B,c as G,d as K}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6W2EY7XF.js";import{j as se}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-GKV7QHMT.js";import{a as O}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-KS2VC4OW.js";import{a as R}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ITRBG52Q.js";import{$ as W,A as qt,B as jt,D as rt,E as N,F as at,H as ot,J as Nt,M as Y,O as Ft,P as Wt,Q as Vt,S as g,T as Ut,U as F,V as Bt,W as J,X as I,Y as lt,Z as Gt,_ as Kt,a as h,aa as Zt,b as H,c as l,ca as Yt,d as j,da as dt,f as c,h as P,ia as $t,ja as Jt,ka as Qt,m as A,n as m,o as It,oa as Xt,p as Rt,q as Ot,v as zt,w as it,y as T,z as r}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YL2MHJNE.js";var z=class extends P{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await te(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?c:this._url?l`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:l`<div class="ph"></div>`}};z.styles=H`
    .wrap { display: inline-block; margin-top: 4px; }
    /* #161: uniform 96px tiles — several photos sit in a strip, so a
       tiny or portrait shot must not collapse its slot. */
    img {
      width: 96px;
      height: 96px;
      object-fit: cover;
      border-radius: var(--ms-radius-6, 6px);
      display: block;
      border: 1px solid var(--divider-color);
      box-sizing: border-box;
    }
    .ph {
      width: 96px;
      height: 96px;
      border-radius: var(--ms-radius-6, 6px);
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      margin-top: 4px;
    }
  `,h([A({attribute:!1})],z.prototype,"hass",2),h([A()],z.prototype,"docId",2),h([m()],z.prototype,"_url",2),h([m()],z.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",z);var $=class extends P{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._openGen=0;this._photos=new _e(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return T(this.hass)}openEdit(t){this._openGen++,this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(t.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(t),this._loadPartOptions()}_seedReadings(t){let s=[],i=new Set;for(let a of t.readings??[])i.has(a.id)||(i.add(a.id),s.push({id:a.id,name:a.name,unit:a.unit??null}));for(let a of t.reading_values??[])i.has(a.id)||(i.add(a.id),s.push({id:a.id,name:a.name,unit:a.unit??null}));this._readingRows=s;let o={};for(let a of t.reading_values??[])o[a.id]=String(a.value);this._readingText=o,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let t={};for(let s of this._readingRows){let i=(this._readingText[s.id]??"").trim();if(i==="")continue;let o=parseFloat(i.replace(",","."));isNaN(o)||(t[s.id]=o)}return t}async _loadPartOptions(){let t=this._draft;if(!t)return;let s=this._openGen;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});if(s!==this._openGen)return;let o=[];for(let d of i.parts||[]){let p=d.entry_id===t.entry_id,u=d.consumers.some(y=>y.entry_id===t.entry_id&&y.task_id===t.task_id);!p&&!u||o.push({part_id:d.part_id,name:d.name,entry_id:d.entry_id,foreign:!p,object_name:d.object_name})}for(let d of t.used_parts||[]){let p=d.entry_id||t.entry_id;o.some(u=>u.part_id===d.part_id&&u.entry_id===p)||o.push({part_id:d.part_id,name:d.name||d.part_id,entry_id:p,foreign:p!==t.entry_id,object_name:null})}let a={};for(let d of t.used_parts||[])a[`${d.entry_id||t.entry_id}:${d.part_id}`]=d.quantity??1;this._partOptions=o,this._partQty=a,this._partQtyOriginal=this._partSelectionKey()}catch{if(s!==this._openGen)return;this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,t])=>t>0).sort(([t],[s])=>t.localeCompare(s)))}close(){this._openGen++,this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(t,s){this._draft&&(this._draft={...this._draft,[t]:s})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let t=this._lang,i=(this._originalSnapshot.used_parts||[]).filter(p=>p.quantity>0).map(p=>`${g(p.quantity,t)}\xD7 ${p.name||p.part_id}`).join(", ");if(!await Q(this.hass,{title:r("history_delete_entry",t),message:i?`${r("history_delete_confirm_entry",t)} ${r("history_delete_returns_parts",t).replace("{parts}",i)}`:r("history_delete_confirm_entry",t),confirmText:r("delete",t),danger:!0})||!this._draft||!this._originalSnapshot)return;let a=this._draft;this._error="",await this._runWs({type:"maintenance_supporter/task/history/delete",entry_id:a.entry_id,task_id:a.task_id,timestamp:this._originalSnapshot.original_timestamp})!==void 0&&(this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:a.entry_id,task_id:a.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close())}_runWs(t){return R(this,t,{busy:s=>{this._saving=s},onError:s=>{this._error=s}})}async _save(){if(!this._draft||!this._originalSnapshot||this._saving||this._photos.uploading)return;this._error="",this._photos.clearError();let t=this._draft,s=this._originalSnapshot,i={type:"maintenance_supporter/task/history/update",entry_id:t.entry_id,task_id:t.task_id,original_timestamp:s.original_timestamp};if(t.timestamp!==s.timestamp&&(i.timestamp=t.timestamp),t.notes!==s.notes&&(i.notes=t.notes),t.cost!==s.cost&&(i.cost=t.cost),t.duration!==s.duration&&(i.duration=t.duration),t.completed_by!==s.completed_by&&(i.completed_by=t.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(i.used_parts=(this._partOptions||[]).filter(a=>(this._partQty[`${a.entry_id}:${a.part_id}`]||0)>0).map(a=>({part_id:a.part_id,quantity:this._partQty[`${a.entry_id}:${a.part_id}`],...a.foreign?{entry_id:a.entry_id}:{}}))),t.reading_value!==s.reading_value&&(i.reading_value=t.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let a=this._readingNumbers(),d={};for(let p of this._readingRows)d[p.id]=a[p.id]??null;i.reading_values=d}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(i.photo_doc_ids=this._photos.ids),Object.keys(i).filter(a=>!["type","entry_id","task_id","original_timestamp"].includes(a)).length===0){this.close();return}await this._runWs(i)!==void 0&&(this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:t.entry_id,task_id:t.task_id,new_timestamp:t.timestamp},bubbles:!0,composed:!0})),this.close())}render(){if(!this._open||!this._draft)return c;let t=this._lang,s=this._draft,i=this._error||this._photos.errorText(t);return G(()=>this.close(),l`
        ${B()?c:l`<h2>${r("history_edit_title",t)}</h2>`}
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${r(s.type,t)||s.type}</span>
        </div>
        <ms-date-field
          kind="datetime"
          required
          .hass=${this.hass}
          .lang=${t}
          .label=${r("history_edit_timestamp",t)}
          .helper=${Gt(t)}
          .value=${Nt(s.timestamp)}
          @value-changed=${o=>{let a=o.detail.value;a&&this._set("timestamp",a)}}
        ></ms-date-field>
        <label>
          <span>${r("notes_label",t)}</span>
          <textarea
            rows="3"
            @input=${o=>{let a=o.target.value;this._set("notes",a||null)}}
            .value=${s.notes??""}></textarea>
        </label>
        <div class="row">
          <div class="cost-field">
            <span>${r("cost",t)}</span>
            <ms-cost-input .lang=${t} .value=${s.cost!=null?String(s.cost):""}
              @value-changed=${o=>{let a=o.detail.value;this._set("cost",a?Number(a):null)}}></ms-cost-input>
          </div>
          <label>
            <span>${r("duration",t)}</span>
            <input type="number" min="0" step="1" inputmode="numeric"
              .value=${s.duration!=null?String(s.duration):""}
              @input=${o=>{this._set("duration",me(o.target.value))}} />
          </label>
        </div>
        ${this._renderReadings(s,t)}
        ${this._partOptions&&this._partOptions.length>0?l`
          <div class="parts-block">
            <span class="parts-title">${r("complete_parts_used",t)}</span>
            ${this._partOptions.map(o=>{let a=`${o.entry_id}:${o.part_id}`,d=this._partQty[a]||0;return l`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${d>0}
                    @change=${p=>{let u=p.target.checked;this._partQty={...this._partQty,[a]:u?1:0}}} />
                  <span class="part-label">${o.name}${o.foreign&&o.object_name?` (${o.object_name})`:""}</span>
                  ${d>0?l`
                    <input class="part-qty" type="number" min=${kt[0]} max=${kt[1]} step="0.01"
                      .value=${String(d)}
                      @input=${p=>{let u=parseFloat(p.target.value);!isNaN(u)&&u>0&&(this._partQty={...this._partQty,[a]:u})}} />
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
        ${i?O("error",i):c}
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
    `,{title:r("history_edit_title",t)})}updated(t){t.has("_open")&&this._open&&K(this.shadowRoot)}_renderReadings(t,s){return this._readingRows.length>0?l`
        <div class="readings-block">
          <span class="parts-title">${r("readings_section",s)}</span>
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
        <span>${r("reading_value_label",s)}${t.reading_unit?` (${t.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${t.reading_value!=null?String(t.reading_value):""}
          @input=${i=>{let o=i.target.value,a=o===""?NaN:Number(o);this._set("reading_value",isNaN(a)?null:a)}} />
      </label>`}};$.styles=[ce,U,H`
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
  `],h([A({attribute:!1})],$.prototype,"hass",2),h([m()],$.prototype,"_open",2),h([m()],$.prototype,"_saving",2),h([m()],$.prototype,"_error",2),h([m()],$.prototype,"_draft",2),h([m()],$.prototype,"_partOptions",2),h([m()],$.prototype,"_partQty",2),h([m()],$.prototype,"_readingRows",2),h([m()],$.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",$);function ge(e,n,t=new Date){let s=e?.hours,i=ot(e?.snoozed_until);if(typeof s!="number"||!Number.isFinite(i))return r("snoozed",n);let o=rt(),d=N(i,o)===N(t,o)?J(new Date(i),n):lt(e.snoozed_until,n);return Vt("snoozed_for","snoozed_for_one",s,n,"hours").replace("{until}",d)}function Ue(e,n){if(n<=0)return 0;let t=typeof e=="number"&&Number.isFinite(e)?Math.trunc(e):0;return t<0?0:t%n}function Be(e){return!!(e?.phases&&e.phase_sequence&&e.phase_sequence.length>0)}function wt(e){if(!e||!Be(e))return null;let n=e.phase_sequence,t=Ue(e.phase_cursor,n.length),s=n[t],i=e.phases?.[s];return i?{id:s,name:i.name,index:t,count:n.length,notes:i.notes,checklist:i.checklist!==void 0?i.checklist:e.checklist??[],consumesParts:i.consumes_parts!==void 0?i.consumes_parts:e.consumes_parts??[],requiredFields:i.required_completion_fields!==void 0?i.required_completion_fields:e.required_completion_fields??[]}:null}function X(e){let n=wt(e);return n?`${n.index+1}/${n.count} \xB7 ${n.name}`:""}function Ge(e,n){return typeof e=="number"&&Number.isFinite(e)&&e>=.01?e:n}function ye(e){let n=e.task??null,t=n?wt(n):null,s=t?t.consumesParts:n?.consumes_parts||[],i=!!n?.part_ref,o=e.objects.find(v=>v.entry_id===e.entryId),a=o?.parts||[],d=i?a.find(v=>v.id===n.part_ref.part_id):void 0,p=e.features?e.features.checklists:e.checklistsEnabled??!0,u=e.features?e.features.checklists?e.checklist??n?.checklist??[]:[]:e.checklist??[],y=e.features?e.features.adaptive&&(e.adaptiveEnabled??!!n?.adaptive_config?.enabled):!!e.adaptiveEnabled;return{entry_id:e.entryId,task_id:e.taskId,task_name:e.taskName,checklist:t?p?t.checklist:[]:u,adaptive_enabled:y,required_completion_fields:t?t.requiredFields:n?.required_completion_fields||[],task_type:n?.type||"",reading_unit:n?.reading_unit||"",readings:n?.readings||[],reading_history:ae(n?.history),parts:i?[]:re({consumes_parts:s},e.entryId,e.objects,e.lang),consumes_parts:i?[]:s,phase_label:t?X(n):"",require_tag_scan:!!n?.require_tag_scan,restock_default:i?Ge(d?.restock_quantity,1):null,restock_unit_cost:i?d?.cost??null:null,restock_package:i&&d?.package_size?Bt(d.package_size,d.unit,e.lang):"",currency_symbol:Y({currency_symbol:e.currencySymbol}),consumes_info:s.map(v=>ie(v,e.entryId,e.objects,e.lang)),checklist_prefill:n?.checklist_progress||{},via_tag_scan:!!e.viaTagScan,parts_cost_mode:i?le(d,e.partsCostMode??"purchase",!!o?.object.battery_fleet):e.partsCostMode??"purchase",prefill:ee(n)}}function ve(e,n,t){e.entryId=n.entry_id,e.taskId=n.task_id,e.taskName=n.task_name,e.lang=t,e.checklist=n.checklist??[],e.adaptiveEnabled=!!n.adaptive_enabled,e.requiredFields=n.required_completion_fields??[],e.taskType=n.task_type??"",e.readingUnit=n.reading_unit??"",e.readings=n.readings??[],e.readingHistory=n.reading_history??[],e.parts=n.parts??[],e.consumesParts=n.consumes_parts??[],e.phaseLabel=n.phase_label??"",e.requireTagScan=!!n.require_tag_scan,e.restockDefault=n.restock_default??null,e.restockUnitCost=n.restock_unit_cost??null,e.restockPackage=n.restock_package??"",e.currencySymbol=Y(n),e.consumesInfo=n.consumes_info??[],e.checklistPrefill=n.checklist_prefill??{},e.viaTagScan=!!n.via_tag_scan,e.partsCostMode=n.parts_cost_mode??"purchase",e.prefill=n.prefill??null,e.open({viaTagScan:!!n.via_tag_scan})}var Ke=new Set(["about","blob","data","file","filesystem","javascript","livescript","ms-appinstaller","ms-cxh","ms-cxh-full","ms-msdt","ms-officecmd","search","search-ms","view-source","vbscript"]);function Tt(e){return e.replace(/[\t\n\r]/g,"").replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g,"")}function Et(e){let n=/^([a-z][a-z0-9+.-]+):/i.exec(Tt(e||""));return n?n[1].toLowerCase():null}function _t(e){let n=Et(e);return n!==null&&!Ke.has(n)}function be(e){return!!e&&/^https?:\/\//i.test(e)}function gt(e){if(!e)return c;if(customElements.get("ha-markdown")){let{content:n,links:t}=Je(e);return l`<ha-markdown
      class="notes-md"
      .content=${n}
      breaks
      ${se(s=>Qe(s,t))}
    ></ha-markdown>`}return l`${e}`}function os(e){return e?e.replace(/!\[([^\]]*)\]\([^)]*\)/g,"$1").replace(/\[([^\]]+)\]\([^)]*\)/g,"$1").replace(/<((?:https?|mailto):[^>\s]+)>/g,"$1").split(/\r?\n/).filter(t=>!/^\s*(```|~~~)/.test(t)&&!/^\s*([-*_])(\s*\1){2,}\s*$/.test(t)).map(t=>t.replace(/^\s*(?:#{1,6}\s+|>\s?|[-*+]\s+(?:\[[ xX]\]\s+)?|\d+[.)]\s+)/,"")).join(" ").replace(/(\*\*|__)(.+?)\1/g,"$2").replace(/~~(.+?)~~/g,"$1").replace(/`([^`]+)`/g,"$1").replace(/(^|[^\w*])\*(?!\s)([^*]*?\S)\*(?!\w)/g,"$1$2").replace(/(^|[^\w])_(?!\s)([^_]*?\S)_(?!\w)/g,"$1$2").replace(/\s+/g," ").trim():""}var St="https://app-link.invalid/",Ze=new Set(["http","https","mailto","tel","ftp"]),Ye=/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/,ft="[a-zA-Z][a-zA-Z0-9+.-]+:";function Je(e){let n=[],t=o=>{let a=Et(o);return!a||Ze.has(a)||!_t(o)?null:(n.push(Tt(o)),`${St}${n.length-1}`)},s=o=>o.replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)<(${ft}[^>\\n]*)>`,"g"),(a,d,p,u)=>{let y=d?null:t(u);return y?`${p}${y}`:a}).replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)(${ft}[^\\s)]*)`,"g"),(a,d,p,u)=>{let y=d?null:t(u);return y?`${p}${y}`:a}).replace(new RegExp(`(^|[^(])<(${ft}[^\\s<>]*)>`,"gm"),(a,d,p)=>{let u=t(p);return u?`${d}[${p.replace(/([\\[\]])/g,"\\$1")}](${u})`:a}).replace(new RegExp(`^( {0,3}\\[[^\\]\\n]+\\]:[ \\t]*)<?(${ft}[^\\s>]*)>?`,"gm"),(a,d,p)=>{let u=t(p);return u?`${d}${u}`:a});return{content:e.split(Ye).map((o,a)=>a%2?o:s(o)).join(""),links:n}}function Ct(e,n){for(let t of e.querySelectorAll(`a[href^="${St}"]`)){let s=n[Number(t.getAttribute("href").slice(St.length))];s&&t.setAttribute("href",s)}}var $e=new WeakMap;function Qe(e,n){if(!e)return;let t=$e.get(e);if(!t&&n.length===0)return;if(t){t.links=n,e.shadowRoot&&Ct(e.shadowRoot,n);return}let s={links:n};$e.set(e,s),(async()=>{await e.updateComplete;let i=e.shadowRoot;i&&(new MutationObserver(()=>Ct(i,s.links)).observe(i,{childList:!0,subtree:!0}),Ct(i,s.links))})()}function At(e,n,t,s){let i=t,o=p=>typeof p=="string"?p:null,a=p=>typeof p=="number"?p:null,d=o(i.timestamp)??"";return{entry_id:e,task_id:n,original_timestamp:d,type:o(i.type)||"completed",timestamp:d,notes:o(i.notes),cost:a(i.cost),duration:a(i.duration),completed_by:o(i.completed_by),used_parts:Array.isArray(i.used_parts)?i.used_parts:null,photo_doc_ids:ht(i),reading_value:a(i.reading_value),reading_values:ut(i),readings:s?.readings??[],task_type:s?.type??null,reading_unit:s?.reading_unit??null}}async function us(e,n,t,s){let o=(await e.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:n})).tasks?.find(d=>d.id===t);if(!o)return null;let a=o.history?.find(d=>d.timestamp===s);return a||(a=(await ue(e,n,t))?.find(p=>p.timestamp===s)),a?At(n,t,a,o):null}var xe=e=>typeof e=="number"&&Number.isInteger(e)&&e>0;function Xe(e){return e&&xe(e.ref_no)?String(e.ref_no):null}function ke(e,n){let t=Xe(e);return t&&n&&xe(n.ref_no)?`${t}.${n.ref_no}`:null}function _s(e){let n=/^(\d+)(?:\.(\d+)(?:-(\d+))?)?$/.exec(e.trim());return n?{object:Number(n[1]),task:n[2]?Number(n[2]):null,entry:n[3]?Number(n[3]):null}:null}function we(e,n){return e?l`<span class="ref-chip" title=${n??""}>#${e}</span>`:c}function Lt(e){let n=t=>{let s=ot(t.timestamp);return Number.isNaN(s)?-1/0:s};return(e??[]).map((t,s)=>({entry:t,index:s,at:n(t)})).sort((t,s)=>s.at-t.at||s.index-t.index).map(t=>t.entry)}var tn=["completed","skipped","missed","reset","triggered","trigger_replaced","trigger_removed"];function Cs(e,n){let t=n.lang;return l`
    <div class="history-filters-new">
      <div class="filter-chips">
        ${tn.map(s=>{let i=e.history.filter(o=>o.type===s).length;return i===0?c:l`
            <span class="filter-chip ${n.filter===s?"active":""}"
              @click=${()=>n.setFilter(n.filter===s?null:s)}>
              ${r(s,t)} (${i})
            </span>
          `})}
        ${n.filter?l`<span class="filter-chip clear" @click=${()=>n.setFilter(null)}>${r("show_all",t)}</span>`:c}
      </div>
      <div class="filter-controls">
        <input type="text" class="search-input" placeholder="${r("search_notes",t)}..." .value=${n.search} @input=${s=>n.setSearch(s.target.value)} />
      </div>
    </div>
  `}function Ss(e,n){let t=n.lang,s=n.filter?e.history.filter(i=>i.type===n.filter):e.history;if(n.search){let i=n.search.toLowerCase();s=s.filter(o=>bt(o.notes,n.search)||bt(xt(o.notes,t),n.search)||(Te(n,o)??"").toLowerCase().endsWith(i))}return s.length===0?l`<p class="empty">${r("no_history",t)}</p>`:l`
    <div class="history-timeline">
      ${Lt(s).map(i=>Dt(i,n))}
    </div>
  `}function Te(e,n){return e.taskRef&&n.ref_no?`${e.taskRef}-${n.ref_no}`:null}function en(e,n){let t=ht(n);return t.length>0?l`<div class="history-photos">
        ${t.map(s=>l`<maintenance-history-photo .hass=${e} .docId=${s}></maintenance-history-photo>`)}
      </div>`:c}function nn(e,n){let t=n.lang,s=a=>g(a,t,{maximumFractionDigits:3}),i=a=>a==null?"":` (${a>=0?"+":""}${s(a)})`,o=ut(e);return o.length>0?l`<div class="history-readings">
      ${o.map(a=>l`<span class="history-reading">
        <span class="history-reading-name">${a.name}</span>
        <span class="history-reading-value">${s(a.value)}${a.unit?` ${a.unit}`:""}${i(n.readingSlotDelta?.(e,a.id))}</span>
      </span>`)}
    </div>`:e.reading_value!=null?l`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${r("reading_label",t)}</span>
      <span class="history-reading-value">${s(e.reading_value)}${n.readingUnit?` ${n.readingUnit}`:""}${i(n.readingDelta?.(e))}</span>
    </span></div>`:c}function Dt(e,n,t={}){let s=n.lang,{compact:i=!1,showRef:o=!0,showBadges:a=!0,showEdit:d=!0,showHead:p=!0}=t,u=n.openEdit,y=d&&!!u&&Rt.includes(e.type),v=typeof e.parts_cost=="number"?e.parts_cost:null,E=e.cost_basis==="use",b=E&&!!e.purchase;return l`
    <div class="history-entry${i?" compact":""}">
      ${i?c:l`<div class="history-icon ${e.type}" style="background: ${Ot(e.type)}">
            <ha-icon .icon=${it[e.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        ${p?l`<div class="history-row">
          <strong>${r(e.type,s)}</strong>
          ${o?we(Te(n,e),r("ref_number",s)):c}
          ${a&&e.phase_id?l`<span class="history-phase-badge">${n.phaseNames?.[e.phase_id]||e.phase_id}</span>`:c}
          ${a&&e.auto?l`<span class="history-auto-badge">${r("history_auto",s)}</span>`:c}
          ${y?l`<button class="history-edit-btn"
                     title=${r("history_edit_button",s)}
                     @click=${()=>u(e)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:c}
        </div>
        <div class="history-date">${lt(e.timestamp,s)}</div>`:c}
        ${e.notes?l`<div class="history-notes">${xt(e.notes,s)}</div>`:c}
        ${en(n.hass,e)}
        ${nn(e,n)}
        ${e.cost!=null||e.duration!=null||e.trigger_value!=null||v!=null?l`<div class="history-details">
              ${e.cost!=null?b?l`<span>${r("history_purchase_stock",s).replace("{amount}",F(e.cost,n.currencySymbol,s))}</span>`:e.cost<0?l`<span class="history-credit">${Ut(e.cost,n.currencySymbol,s)}</span>`:l`<span>${r("cost",s)}: ${F(e.cost,n.currencySymbol,s)}</span>`:c}
              ${v!=null?l`<span title=${r(E?"history_parts_counted_hint":"history_parts_info_hint",s)}>${r(E?"history_parts_counted":"history_parts_info",s).replace("{amount}",F(v,n.currencySymbol,s))}</span>`:c}
              ${e.duration!=null?l`<span>${r("duration",s)}: ${dt(e.duration,s)}</span>`:c}
              ${e.trigger_value!=null?l`<span>${r("trigger_val",s)}: ${e.trigger_value}${n.triggerUnit?` ${n.triggerUnit}`:""}</span>`:c}
            </div>`:c}
      </div>
    </div>
  `}var sn="var(--maint-done-color, #78909c)",rn="var(--secondary-text-color, #727272)";function tt(e){if(e.archived)return"archived";if(e.is_done)return"done";let n=e.status||"ok";return n==="ok"&&e.schedule_type==="manual"&&e.days_until_due==null?"no_due":n}var an={done:"completed",no_due:"no_due_date"};function Mt(e,n){return r(an[e]??e,n)}function yt(e){let n=tt(e);return n==="done"?sn:n==="no_due"?rn:It[n]||"var(--disabled-color, #9e9e9e)"}function on(e){return e==="no_due"?"mdi:calendar-blank-outline":it[e==="done"?"completed":e]||"mdi:circle-medium"}function Ee(e,n,t="pill"){let s=tt(e),i=Mt(s,n);return t==="chip"?l`<span class="status-chip ${s}">${i}</span>`:l`<span class="status-badge ${s}" role="img" title="${i}" aria-label="${i}"><ha-icon icon="${on(s)}"></ha-icon><span class="status-label">${i}</span></span>`}async function Ce(e,n,t){if(!e)return null;let s={title:r("delete",t),confirmText:r("delete",t),danger:!0};if(!n?.part_ref)return await e.confirm({...s,message:r("delete_task_confirm",t)})?{}:null;let i=await e.confirmWithCheck({...s,message:r("delete_buy_task_confirm",t),check:r("delete_buy_task_off",t)});return i.confirmed?i.checked?{disable_auto_buy_task:!0}:{}:null}function _(e){return e.toFixed(1)}function zs(e,n,t=4){if(!isFinite(e)||!isFinite(n))return{ticks:[],niceMin:0,niceMax:1};if(e===n){let u=Math.abs(e)*.1||1;e-=u,n+=u}let s=n-e,i=Math.pow(10,Math.floor(Math.log10(s/Math.max(1,t)))),o=i;for(let u of[1,2,5,10])if(o=i*u,s/o<=t+.5)break;let a=Math.floor(e/o)*o,d=Math.ceil(n/o)*o,p=[];for(let u=a;u<=d+o*1e-6;u+=o)p.push(Math.abs(u)<o*1e-9?0:u);return{ticks:p,niceMin:a,niceMax:d}}function ln(e,n){let t=Math.abs(e),s=i=>({maximumFractionDigits:i});return t>=1e6?g(e/1e6,n,s(t>=1e7?0:1))+"M":t>=1e4?g(e/1e3,n,s(0))+"k":t>=1e3?g(e/1e3,n,s(1))+"k":t>=100?g(e,n,s(0)):t>=1?g(e,n,s(1)):t===0?"0":g(e,n,s(2))}function qs(e,n,t){let s=Math.abs(e),i=g(e,t,{maximumFractionDigits:s>=100?0:s>=1||s===0?1:2});return n?`${i} ${n}`:i}function js(e,n,t){if(Math.abs(e)>=1e3||!(n>0))return ln(e,t);let s=Math.max(0,Math.min(4,-Math.floor(Math.log10(n)+1e-9)));return g(e,t,{maximumFractionDigits:s})}function Ns(e,n,t,s){return s-t<2*864e5?J(new Date(e),n):dn(e,n,cn(t,s))}function dn(e,n,t){return $t(new Date(e),n,t)}function Fs(e,n){let t=new Date(e);return`${$t(t,n)}, ${J(t,n)}`}function cn(e,n){if(!Number.isFinite(e)||!Number.isFinite(n))return!1;let t=rt();return N(e,t).slice(0,4)!==N(n,t).slice(0,4)}function Ws(e,n,t){if(t<2||n<=e)return[e,n];let s=[];for(let i=0;i<t;i++)s.push(e+(n-e)*i/(t-1));return s}function Se(e,n){let t=e.interval_analysis,s=t?.weibull_beta,i=t?.weibull_eta;if(s==null||i==null||i<=0)return c;let o=e.interval_days??0,a=e.suggested_interval??o;return l`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${r("weibull_reliability_curve",n)}
        ${pn(s,n)}
      </div>
      ${un(s,i,o,a,n)}
      ${hn(t,n)}
      ${t?.confidence_interval_low!=null?mn(t,e,n):c}
    </div>
  `}function pn(e,n){let t,s,i;return e<.8?(t="early_failures",s="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):e<=1.2?(t="random_failures",s="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):e<=3.5?(t="wear_out",s="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(t="highly_predictable",s="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),l`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${s}"></ha-svg-icon>
      ${r(i,n)} (\u03B2=${g(e,n,2)})
    </span>
  `}function un(e,n,t,s,i){let b=Math.max(t,s,n,1)*1.3,C=50,S=[];for(let x=0;x<=C;x++){let w=x/C*b,Fe=1-Math.exp(-Math.pow(w/n,e)),We=32+w/b*260,Ve=136-Fe*128;S.push([We,Ve])}let et=S.map(([x,w])=>`${_(x)},${_(w)}`).join(" "),vt="M32,136 "+S.map(([x,w])=>`L${_(x)},${_(w)}`).join(" ")+` L${_(S[C][0])},136 Z`,q=32+t/b*260,nt=1-Math.exp(-Math.pow(t/n,e)),st=136-nt*128,je=g((1-nt)*100,i,0),Pt=32+s/b*260,Ne=[0,.25,.5,.75,1];return l`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${r("chart_weibull",i)}">
        ${Ne.map(x=>{let w=136-x*128;return j`
            <line x1="${32}" y1="${_(w)}" x2="${292}" y2="${_(w)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${x===.5?"4,3":c}" />
            <text x="${28}" y="${_(w+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${g(x*100,i,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(b/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(b)}</text>

        <path d="${vt}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${et}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?j`
          <line x1="${_(q)}" y1="${8}" x2="${_(q)}" y2="${_(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${_(q)}" cy="${_(st)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${_(q+4)}" y="${_(st-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${je}%</text>
        `:c}

        ${s>0&&s!==t?j`
          <line x1="${_(Pt)}" y1="${8}" x2="${_(Pt)}" y2="${_(136)}"
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
      ${s>0&&s!==t?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${r("recommended_marker",i)}</span>`:c}
    </div>
  `}function hn(e,n){return l`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${r("characteristic_life",n)}</span>
        <span class="weibull-info-value">${W(Math.round(e.weibull_eta),n)}</span>
      </div>
      ${e.weibull_r_squared!=null?l`
        <div class="weibull-info-item">
          <span>${r("weibull_r_squared",n)}</span>
          <span class="weibull-info-value">${g(e.weibull_r_squared,n,3)}</span>
        </div>
      `:c}
    </div>
  `}function mn(e,n,t){let s=e.confidence_interval_low,i=e.confidence_interval_high,o=n.suggested_interval??n.interval_days??0,a=n.interval_days??0,d=Math.max(0,s-5),u=i+5-d,y=(s-d)/u*100,v=(i-s)/u*100,E=(o-d)/u*100,b=a>0?(a-d)/u*100:-1;return l`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${r("confidence_interval",t)}: ${W(o,t)} (${s}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${_(y)}%;width:${_(v)}%"></div>
        ${b>=0?l`<div class="confidence-marker current" style="left:${_(b)}%"></div>`:c}
        <div class="confidence-marker recommended" style="left:${_(E)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${r("confidence_conservative",t)} (${s}${r("days",t).charAt(0)})</span>
        <span class="confidence-text high">${r("confidence_aggressive",t)} (${i}${r("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function Ht(e){return Math.max(1,Math.round(e||0))}var _n={one:"sensor_prediction_urgency_one",few:"sensor_prediction_urgency_few",other:"sensor_prediction_urgency"};function Ae(e,n,t){let s=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data",i=e.days_until_threshold!=null,o=e.environmental_factor!=null&&e.environmental_factor!==1;if(!s&&!i&&!o)return c;let a=e.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":e.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return l`
    <div class="prediction-section">
      ${e.sensor_prediction_urgency?l`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${r(Zt(Ht(e.days_until_threshold),n,_n),n).replace("{days}",String(Ht(e.days_until_threshold)))}
        </div>
      `:c}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${r("sensor_prediction",n)}
      </div>
      <div class="prediction-grid">
        ${s?l`
          <div class="prediction-item">
            <ha-svg-icon path="${a}"></ha-svg-icon>
            <span class="prediction-label">${r("degradation_trend",n)}</span>
            <span class="prediction-value ${e.degradation_trend}">${r("trend_"+e.degradation_trend,n)}</span>
            ${e.degradation_rate!=null?l`<span class="prediction-rate">${e.degradation_rate>0?"+":""}${g(e.degradation_rate,n,Math.abs(e.degradation_rate)>=10?0:1)} ${e.trigger_entity_info?.unit_of_measurement||""}/${r("day_short",n)}</span>`:c}
          </div>
        `:c}
        ${i?l`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${r("days_until_threshold",n)}</span>
            <span class="prediction-value prediction-days${e.days_until_threshold===0?" exceeded":e.sensor_prediction_urgency?" urgent":""}">${e.days_until_threshold===0?r("threshold_exceeded",n):"~"+Kt(Ht(e.days_until_threshold),n)}</span>
            ${e.threshold_prediction_date?l`<span class="prediction-date">${I(e.threshold_prediction_date,n)}</span>`:c}
            ${e.threshold_prediction_confidence?l`<span class="confidence-dot ${e.threshold_prediction_confidence}"></span>`:c}
            ${(e.prediction_cycles??0)>0?l`<span class="prediction-cycles">${r("prediction_cycles",n)}: ${e.prediction_cycles}</span>`:c}
          </div>
        `:c}
        ${o&&t.environmental?l`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${r("environmental_adjustment",n)}</span>
            <span class="prediction-value">${g(e.environmental_factor,n,2)}x</span>
            ${e.environmental_entity?l`<span class="prediction-entity entity-link" @click=${d=>Qt(d,e.environmental_entity)}>${e.environmental_entity}</span>`:c}
          </div>
        `:c}
      </div>
    </div>
  `}function Le(e,n,t,s){let i=Math.max(e||1,n);return l`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${r("current",s)}: ${e!=null?W(e,s):"\u2014"}
        </div>
        <div class="interval-visual current"
          style="width: ${e!=null?Math.min(e/i*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${r("recommended",s)}: ${W(n,s)}
          <span class="confidence-badge ${t}">${r(`confidence_${t}`,s)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(n/i*100,100)}%"></div>
      </div>
    </div>
  `}var De=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function Me(){return Number(at().slice(5,7))-1}function He(e,n,t){if(!t.seasonal||!e.seasonal_factor||e.seasonal_factor===1)return c;let s=De.map(d=>r(d,n)),i=Me(),o=e.seasonal_factors||e.interval_analysis?.seasonal_factors||null,a=o&&o.length===12?o:s.map((d,p)=>{let u=e.seasonal_factor||1,y=Math.sin((p-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,u+y))});return l`
    <div class="seasonal-card-compact">
      <h4>${r("seasonal_awareness",n)}</h4>
      <div class="seasonal-mini-chart">
        ${a.map((d,p)=>{let u=d*40,y=d<.9?"low":d>1.1?"high":"normal";return l`
            <div class="seasonal-bar ${y} ${p===i?"current":""}"
                 style="height: ${u}px"
                 title="${s[p]}: ${g(d,n,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${r("shorter",n)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${r("normal",n)}</span>
        <span class="legend-item"><span class="dot high"></span> ${r("longer",n)}</span>
      </div>
    </div>
  `}function Pe(e,n){return fn(e,n)}function fn(e,n){let t=e.seasonal_factors??e.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return c;let s=e.interval_analysis?.seasonal_reason,i=Me(),o=300,a=100,d=8,u=a-d-4,y=Math.max(...t,1.5),v=o/12,E=v*.65,b=d+u-1/y*u;return l`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${r("seasonal_chart_title",n)}
        ${s?l`<span class="source-tag">${s==="learned"?r("seasonal_learned",n):r("seasonal_manual",n)}</span>`:c}
      </div>
      <svg viewBox="0 0 ${o} ${a}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${r("chart_seasonal",n)}">
        <line x1="0" y1="${_(b)}" x2="${o}" y2="${_(b)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((C,S)=>{let et=C/y*u,vt=S*v+(v-E)/2,q=d+u-et,nt=S===i,st=C<1?"var(--success-color, #4caf50)":C>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return j`
            <rect x="${_(vt)}" y="${_(q)}"
              width="${_(E)}" height="${_(et)}"
              fill="${st}" opacity="${nt?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${De.map((C,S)=>l`<span class="seasonal-label ${S===i?"active-month":""}">${r(C,n)}</span>`)}
      </div>
    </div>
  `}var f=class extends P{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showPostpone=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._postponeDate="";this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1,beta_editor:!1};this._toast="";this._toastTimer=new fe;this._access=mt;this._currencySymbol="";this._partsCostMode="purchase";this._loadSeq=0}get _lang(){return T(this.hass)}async openFor(t,s){(t!==this._entryId||s!==this._taskId)&&(this._task=null),this._entryId=t,this._taskId=s,this._error="",this._showSkip=!1,this._showReset=!1,this._showPostpone=!1,this._showAdaptive=!1,this._skipReason="",this._postponeDate="",this._resetDate=at(),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let t=await L(this.hass);this._features={...this._features,...t.features},this._access=t.access,this._currencySymbol=Y(t.budget??void 0),Ft(t.budget??void 0),this._partsCostMode=t.partsCostMode}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(t,s){this._toast=t,this._toastTimer.schedule(()=>{this._toast=""},s)}async _loadTask(){let t=this._entryId,s=this._taskId;if(!t||!s)return;let i=++this._loadSeq,o="",a=await R(this,{type:"maintenance_supporter/object",entry_id:t},{onError:p=>{o=p}});if(i!==this._loadSeq)return;if(a===void 0){this._error=o;return}this._objectName=a?.object?.name||"";let d=(a?.tasks||[]).find(p=>p.id===s);this._task=d??null,this._taskRef=ke(a?.object,d),d||(this._error=r("ws_err_not_found",this._lang))}_runWs(t){return this._error="",R(this,t,{busy:s=>{this._busy=s},onError:s=>{this._error=s}})}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(t=!1){if(!(!this._entryId||!this._taskId||!this._task)){if(!t&&pt(this._task)){this._onQuickComplete();return}import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-RGOSJUXR.js").then(async({openCompleteDialog:s})=>{let i=this._task,o=[];try{o=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}s(ye({entryId:this._entryId,taskId:this._taskId,taskName:i.name,task:i,objects:o,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol,partsCostMode:this._partsCostMode}))&&(this._notifyChanged("complete"),this.close())})}}async _onQuickComplete(){let t=this._entryId,s=this._task;this._busy=!0;try{let i=await ne(this.hass,t,s.id,this._lang);if(i.result==="dialog"){this._onComplete(!0);return}if(i.result==="failed"){this._error=i.message;return}if(i.result==="already"){this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:i.message},bubbles:!0,composed:!0})),this.close();return}this._notifyChanged("complete"),i.undo&&ct(this,this.hass,{entryId:t,taskId:s.id,taskName:s.name},this._lang,()=>{}),this.close()}finally{this._busy=!1}}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})!==void 0&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})!==void 0&&(this._notifyChanged("reset"),this.close())}async _onPostponeConfirm(){if(!this._entryId||!this._taskId||!this._postponeDate)return;await this._runWs({type:"maintenance_supporter/task/postpone",entry_id:this._entryId,task_id:this._taskId,until:this._postponeDate})!==void 0&&(this._notifyChanged("postpone"),this.close())}async _onSnooze(){if(!this._entryId||!this._taskId)return;let t=await this._runWs({type:"maintenance_supporter/task/snooze",entry_id:this._entryId,task_id:this._taskId});t!==void 0&&(this._notifyChanged("snooze"),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:ge(t,this._lang)},bubbles:!0,composed:!0})),this.close())}_onEdit(){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-RGOSJUXR.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-RGOSJUXR.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let t=await Ce(pe(this.hass),this._task,this._lang);if(!t)return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId,...t})!==void 0&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})!==void 0&&(this._showToast(r("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!this._entryId||!this._taskId)return;let t=await this._runWs({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});t!==void 0&&(this._showToast(t?.recommended_interval?`${r("reanalyze_result",this._lang)}: ${Yt(t.recommended_interval,"days",this._lang)} (${t.data_points} ${r("data_points",this._lang)})`:r("reanalyze_insufficient_data",this._lang)),await this._loadTask())}_onEditHistoryEntry(t){if(!this._entryId||!this._taskId)return;let s=At(this._entryId,this._taskId,t,this._task);import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-RGOSJUXR.js").then(({openHistoryEditDialog:i})=>i(s))}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return c;let s=this._lang;return l`
      <div class="recommendation-card">
        <h4>${r("suggested_interval",s)}</h4>
        ${Le(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",s)}
        <div class="recommendation-actions">
          ${V(this.hass?.user,this._access)?l`<button class="btn primary qa-apply-suggestion"
                @click=${this._applySuggestion} ?disabled=${this._busy}>
                <ha-icon icon="mdi:check"></ha-icon>
                ${r("apply_suggestion",s)}
              </button>`:c}
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${r("reanalyze",s)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(t){let s=this._lang,i=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,o=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,a=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,d=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!i&&!o&&!a&&!d?l`<div class="adaptive-empty">
        ${r("adaptive_no_data",s)}
      </div>`:l`
      <div class="adaptive-stack">
        ${this._toast?l`<div class="toast">${this._toast}</div>`:c}
        ${i?this._renderRecommendation(t):c}
        ${o?Ae(t,s,this._features):c}
        ${a?Se(t,s):c}
        ${d?l`
          ${He(t,s,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?Pe(t,s):c}
        `:c}
      </div>
    `}_renderDetails(t){let s=this._lang,i=t.history||[],o=t.history_count??i.length,a=Lt(i).slice(0,20);return l`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${r("times_performed",s)}</span>
            <span class="stat-value">${t.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${r("total_cost",s)}</span>
            <span class="stat-value">${F(t.total_cost??0,this._currencySymbol,s)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${r("avg_duration",s)}</span>
            <span class="stat-value">${dt(t.average_duration!=null?Math.round(t.average_duration):null,s)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${r("history",s)}</strong>
          <span class="history-count">${o}</span>
        </div>
        ${i.length===0?l`<div class="history-empty">${r("history_empty",s)}</div>`:l`
              <div class="history-list">
                ${a.map(d=>Dt(d,{lang:s,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:V(this.hass?.user,this._access)?p=>this._onEditHistoryEntry(p):void 0,readingUnit:t.reading_unit,readingSlotDelta:(p,u)=>oe(i,p,u),taskRef:this._taskRef},{compact:!0}))}
                ${o>a.length?l`<div class="history-more">… +${o-a.length} ${r("older_entries",s)}</div>`:c}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return c;let t=this._lang,s=this._task,i=V(this.hass?.user,this._access),o=!!s&&zt(s);return G(()=>this.close(),l`
        ${s?l`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${yt(s)}"></span>
                  ${B()?c:l`<span class="task-name">${s.name}</span>`}
                  ${Ee(s,t)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-RGOSJUXR.js").then(({openObjectQuickActions:a})=>{a(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${s.next_due?l`<span><strong>${r("next_due",t)}:</strong> ${I(s.next_due,t)}</span>`:c}
                  ${s.last_performed?l`<span><strong>${r("last_performed",t)}:</strong> ${I(s.last_performed,t)}</span>`:c}
                  ${s.schedule?.kind&&!["manual","one_time"].includes(s.schedule.kind)||s.interval_days!=null?l`<span><strong>${r("interval",t)}:</strong> ${Jt(s,t)}</span>`:c}
                  ${X(s)?l`<span><strong>${r("phase_current",t)}:</strong> ${X(s)}</span>`:c}
                </div>
                ${s.notes?l`<div class="notes-body">${gt(s.notes)}</div>`:c}
              </div>

              ${this._error?O("error",this._error):c}

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
                      <ha-button appearance="accent" variant="success" @click=${()=>this._onComplete()} .disabled=${this._busy}
                        title=${pt(s)?r("qr_action_quick_complete",t):r("complete",t)}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${r("complete",t)}
                      </ha-button>
                      ${pt(s)?l`<ha-button appearance="outlined" variant="success" class="qa-complete-details" @click=${()=>this._onComplete(!0)} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:text-box-edit-outline"></ha-icon>
                            ${r("complete_with_details",t)}
                          </ha-button>`:c}
                      ${s.allow_skip!==!1?l`
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
                            @click=${s.archived?this._onUnarchive:this._onArchive}
                            .disabled=${this._busy}>
                            <ha-icon slot="start" icon="${s.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                            ${s.archived?r("unarchive",t):r("archive",t)}
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
                    ${this._showDetails?this._renderDetails(s):c}
                    ${this._showAdaptive?this._renderAdaptive(s):c}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${r("open_in_panel",t)}
                      </button>
                    </div>
                  `}
            `:this._error?O("error",this._error):l`<div class="loading">${r("loading",t)}</div>`}
    `,{title:s?.name})}updated(t){t.has("_open")&&this._open&&K(this.shadowRoot)}};f.styles=[Xt,U,H`
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
      border-radius: var(--ms-radius-6, 6px); cursor: pointer;
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
      margin-top: 8px; padding: 8px; border-radius: var(--ms-radius-6, 6px);
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
      padding: 8px; border-radius: var(--ms-radius-6, 6px);
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
      padding: 8px; border-radius: var(--ms-radius-6, 6px);
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
      padding: 6px 8px; border-radius: var(--ms-radius-6, 6px); border-bottom: none; margin-bottom: 6px;
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
      padding: 8px 12px; border-radius: var(--ms-radius-6, 6px);
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
  `],h([A({attribute:!1})],f.prototype,"hass",2),h([m()],f.prototype,"_open",2),h([m()],f.prototype,"_entryId",2),h([m()],f.prototype,"_taskId",2),h([m()],f.prototype,"_task",2),h([m()],f.prototype,"_objectName",2),h([m()],f.prototype,"_taskRef",2),h([m()],f.prototype,"_busy",2),h([m()],f.prototype,"_error",2),h([m()],f.prototype,"_showSkip",2),h([m()],f.prototype,"_showReset",2),h([m()],f.prototype,"_showPostpone",2),h([m()],f.prototype,"_showDetails",2),h([m()],f.prototype,"_showAdaptive",2),h([m()],f.prototype,"_skipReason",2),h([m()],f.prototype,"_resetDate",2),h([m()],f.prototype,"_postponeDate",2),h([m()],f.prototype,"_features",2),h([m()],f.prototype,"_toast",2),h([m()],f.prototype,"_access",2),h([m()],f.prototype,"_partsCostMode",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",f);function Ie(e){if(e.key!=="Enter"&&e.key!==" ")return;let t=e.target?.closest?.('[role="menuitem"], [role="button"]');!t||t.getAttribute("aria-disabled")==="true"||(e.preventDefault(),t.click())}var k=class extends P{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=mt;this._loadSeq=0}get _lang(){return T(this.hass)}async openFor(t){t!==this._entryId&&(this._data=null),this._entryId=t,this._error="",this._open=!0,await Promise.all([this._load(),L(this.hass).then(s=>{this._access=s.access})])}close(){this._loadSeq++,this._open=!1,this._data=null,this._error=""}async _load(){let t=this._entryId;if(!t)return;let s=++this._loadSeq,i="",o=await R(this,{type:"maintenance_supporter/object",entry_id:t},{onError:a=>{i=a}});s===this._loadSeq&&(o===void 0?this._error=i:this._data=o)}_runWs(t){return this._error="",R(this,t,{busy:s=>{this._busy=s},onError:s=>{this._error=s}})}_onEditObject(){!this._entryId||!this._data||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-RGOSJUXR.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-RGOSJUXR.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await Q(this.hass,{title:r("delete",this._lang),message:r("delete_object_confirm",this._lang),confirmText:r("delete",this._lang),danger:!0}))return;let s=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:s})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:s},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t&&!await Q(this.hass,{title:r("archive_object",this._lang),message:r("confirm_archive_object",this._lang),confirmText:r("archive_object",this._lang)}))return;let s=this._entryId;await this._runWs({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:s})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:s},bubbles:!0,composed:!0})),this.close())}_onTaskClick(t){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-RGOSJUXR.js").then(({openTaskQuickActions:s})=>{s(this._entryId,t)})}render(){if(!this._open)return c;let t=this._lang,s=this._data,i=s?.object,o=s?.tasks||[],a=V(this.hass?.user,this._access);return G(()=>this.close(),l`
        ${s&&i?l`
              <div class="header">
                ${B()?c:l`<div class="title">${i.name}</div>`}
                ${this._renderMetaRow(i)}
              </div>

              ${this._error?O("error",this._error):c}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${r("tasks",t)}</strong>
                  <span class="count">${o.length}</span>
                </div>
                ${o.length===0?l`<div class="empty">${r("no_tasks",t)}</div>`:l`
                      <div class="task-list">
                        ${o.map(d=>l`
                          <div class="task-row" role="button" tabindex="0" @click=${()=>this._onTaskClick(d.id)} @keydown=${Ie}>
                            <span class="status-dot" style="background: ${yt(d)}"></span>
                            <span class="task-name">${d.name}</span>
                            <span class="task-status ${tt(d)}">${Mt(tt(d),t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${i.notes?l`
                    <div class="notes-section">
                      <strong>${r("object_notes_label",t)}</strong>
                      <div class="notes-body">${gt(i.notes)}</div>
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
            `:this._error?O("error",this._error):l`<div class="loading">${r("loading",t)}</div>`}
    `,{title:i?.name})}updated(t){t.has("_open")&&this._open&&K(this.shadowRoot)}_renderMetaRow(t){let s=this._lang,i=[];return t.area_id&&i.push([r("area",s),de(t.area_id,this.hass?.areas,r("no_area",s))]),t.manufacturer&&i.push([r("manufacturer",s),t.manufacturer]),t.model&&i.push([r("model",s),t.model]),t.serial_number&&i.push([r("serial_number_label",s),t.serial_number]),t.installation_date&&i.push([r("installed",s),I(t.installation_date,s)]),t.warranty_expiry&&i.push([r("warranty",s),I(t.warranty_expiry,s)]),t.documentation_url&&i.push([r("documentation_url_label",s),t.documentation_url,_t(t.documentation_url)]),i.length===0?c:l`
      <div class="meta">
        ${i.map(([o,a,d])=>l`
            <div class="meta-item">
              <span class="meta-label">${o}</span>
              <span class="meta-value">${d||be(a)?l`<a href="${a}" target="_blank" rel="noopener noreferrer">${a}</a>`:a}</span>
            </div>
          `)}
      </div>
    `}};k.styles=[U,H`
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
      padding: 8px; border-radius: var(--ms-radius-6, 6px); cursor: pointer;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
      transition: background 0.12s;
    }
    .task-row:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .task-row:focus-visible { outline: 2px solid var(--primary-color); outline-offset: -2px; }
    .status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .task-name { flex: 1; font-size: 14px; }
    .task-status { font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; }
    .notes-body { white-space: pre-wrap; font-size: 13px; padding: 8px; background: var(--secondary-background-color); border-radius: var(--ms-radius-6, 6px); }
    .notes-body ha-markdown { white-space: normal; }
    .actions { display: flex; gap: 8px; padding-top: 8px; border-top: 1px solid var(--divider-color); }
    .actions .btn { flex: 1; }
    .btn {
      padding: 8px; font-size: 13px; border-radius: var(--ms-radius-6, 6px); cursor: pointer;
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
    .error { padding: 8px; border-radius: var(--ms-radius-6, 6px); background: rgba(211,47,47,0.1); color: var(--error-color); font-size: 13px; }
  `],h([A({attribute:!1})],k.prototype,"hass",2),h([m()],k.prototype,"_open",2),h([m()],k.prototype,"_entryId",2),h([m()],k.prototype,"_data",2),h([m()],k.prototype,"_busy",2),h([m()],k.prototype,"_error",2),h([m()],k.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",k);var Re="maintenance-object-dialog",Oe="maintenance-task-dialog",gn="maintenance-history-edit-dialog",yn="maintenance-complete-dialog",vn="maintenance-qr-dialog",bn="maintenance-task-quick-actions-dialog",$n="maintenance-object-quick-actions-dialog";function Z(){return document.querySelector("home-assistant")?.hass}function xn(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function D(e){let n=xn(),t=n.querySelector(e)??document.body.querySelector(e);return t?t.parentNode!==n&&n.appendChild(t):(t=document.createElement(e),n.appendChild(t)),t}function M(e){let n=Z();if(!n)return!1;e.hass=n;let t=T(n);return qt(t)||jt(t).then(()=>{e.requestUpdate?.()}),Wt(n.locale,n.config?.country,n.config?.time_zone),!0}function ur(e){return L(e).then(n=>n.rowActionStyle)}function hr(){he()}function mr(){let e=D(Re);return M(e)?(e.openCreate(),ze(e),!0):!1}async function ze(e){let n=Z();n&&(e.placesEnabled=(await L(n)).features.places)}function _r(e,n){let t=D(Re);return M(t)?(t.openEdit(e,n),ze(t),!0):!1}function fr(e="",n){let t=D(Oe);if(!M(t))return!1;let s=Z();return s?((async()=>{let i=await L(s),o=t;qe(o,i),o.openCreate(e,n)})(),!0):!1}function qe(e,n){e.checklistsEnabled=n.features.checklists,e.scheduleTimeEnabled=n.features.schedule_time,e.completionActionsEnabled=n.features.completion_actions,e.adaptiveFeature=n.features.adaptive,e.seasonalFeature=n.features.seasonal,e.environmentalFeature=n.features.environmental,e.defaultWarningDays=n.defaultWarningDays,e.mirrorTodoDefault=n.mirrorTodoDefault,e.betaEditor=n.features.beta_editor}function gr(e,n){let t=D(Oe);if(!M(t))return!1;let s=Z();return s?((async()=>{try{let[i,o]=await Promise.all([s.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e}),L(s)]),a=(i.tasks||[]).find(p=>p.id===n);if(!a){console.warn(`openEditTaskDialog: task ${n} not found in entry ${e}`);return}let d=t;qe(d,o),await d.openEdit(e,a)}catch(i){console.warn("openEditTaskDialog: failed to load task/features",i)}})(),!0):!1}function yr(e){let n=D(gn);return M(n)?(n.openEdit(e),!0):!1}function vr(e){let n=D(yn);if(!M(n))return!1;let t=n;return t.__msUndoWired||(t.__msUndoWired=!0,n.addEventListener("task-completed",s=>{let i=s.detail,o=Z();i?.undo&&o&&ct(n,o,i,T(o),()=>{})})),ve(n,e,T(Z())),!0}function br(e){let n=D(vn);return M(n)?(n.openForTask(e.entry_id,e.task_id,e.object_name,e.task_name),!0):!1}function $r(e,n){let t=D(bn);return M(t)?(t.openFor(e,n),!0):!1}function xr(e){let n=D($n);return M(n)?(n.openFor(e),!0):!1}export{_t as a,be as b,Xe as c,ke as d,_s as e,we as f,Ce as g,gt as h,os as i,Ue as j,Be as k,wt as l,ye as m,ve as n,Ie as o,_ as p,zs as q,ln as r,qs as s,js as t,Ns as u,dn as v,Fs as w,cn as x,Ws as y,At as z,us as A,ge as B,Lt as C,Cs as D,Ss as E,Dt as F,tt as G,Mt as H,Ee as I,Se as J,Ae as K,Le as L,He as M,Pe as N,ur as O,hr as P,mr as Q,_r as R,fr as S,gr as T,yr as U,vr as V,br as W,$r as X,xr as Y};
