/*! maintenance_supporter frontend 2.119.0 */
import{a as m2,b as Y,c as v2,e as n1,f as G,j as b,k as x2}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-7YCXBEC7.js";import{a as c1}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-TEFSP4ED.js";import{b as V2}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-RCWBWZBC.js";import{b as u1,i as A2,z as l2}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6ZZAPEXI.js";import{d as d2,e as p2}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6ITCU3EE.js";import{b as n2,c as s2}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-I4COVMXV.js";import{b as a2,h as p1}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-FZDD2TTP.js";import{b as e2,c as t2,f as d1,g as i2,i as o2,l as Z2}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-5T3S4STG.js";import{a as A1,b as L2,c as M2}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-O2TITNSP.js";import{c as a1}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-22HREMWC.js";import{k as h1}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ZCPDAFMC.js";import{a as Q,b as U,c as z,d as q}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BZ4PN27M.js";import{m as r2}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-OWE53YIN.js";import{a as R}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-NN6CK3TX.js";import{a as F}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-EYZY6SRU.js";import{$ as j1,A as r,B as I1,C as W1,E as r1,F as I,G as e1,I as t1,K as N1,N as j,P as G1,Q as Q1,R as U1,T as l,U as z1,V as W,W as q1,X,Y as T,Z as i1,_ as K1,a as p,aa as N,b as P,ba as X1,c as i,d as $,da as Y1,ea as o1,f as a,i as B,ja as S1,ka as J1,la as C2,n as y,o as n,p as R1,pa as H2,q as D1,r as E1,w as $1,x as M1,z as f}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6NL3YWME.js";var D=class extends B{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await V2(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?a:this._url?i`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:i`<div class="ph"></div>`}};D.styles=P`
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
  `,p([y({attribute:!1})],D.prototype,"hass",2),p([y()],D.prototype,"docId",2),p([n()],D.prototype,"_url",2),p([n()],D.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",D);var S=class extends B{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._openGen=0;this._photos=new s2(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return f(this.hass)}openEdit(C){this._openGen++,this._draft={...C},this._originalSnapshot={...C},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(C.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(C),this._loadPartOptions()}_seedReadings(C){let L=[],M=new Set;for(let e of C.readings??[])M.has(e.id)||(M.add(e.id),L.push({id:e.id,name:e.name,unit:e.unit??null}));for(let e of C.reading_values??[])M.has(e.id)||(M.add(e.id),L.push({id:e.id,name:e.name,unit:e.unit??null}));this._readingRows=L;let t={};for(let e of C.reading_values??[])t[e.id]=String(e.value);this._readingText=t,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let C={};for(let L of this._readingRows){let M=(this._readingText[L.id]??"").trim();if(M==="")continue;let t=parseFloat(M.replace(",","."));isNaN(t)||(C[L.id]=t)}return C}async _loadPartOptions(){let C=this._draft;if(!C)return;let L=this._openGen;try{let M=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});if(L!==this._openGen)return;let t=[];for(let o of M.parts||[]){let A=o.entry_id===C.entry_id,d=o.consumers.some(x=>x.entry_id===C.entry_id&&x.task_id===C.task_id);!A&&!d||t.push({part_id:o.part_id,name:o.name,entry_id:o.entry_id,foreign:!A,object_name:o.object_name})}for(let o of C.used_parts||[]){let A=o.entry_id||C.entry_id;t.some(d=>d.part_id===o.part_id&&d.entry_id===A)||t.push({part_id:o.part_id,name:o.name||o.part_id,entry_id:A,foreign:A!==C.entry_id,object_name:null})}let e={};for(let o of C.used_parts||[])e[`${o.entry_id||C.entry_id}:${o.part_id}`]=o.quantity??1;this._partOptions=t,this._partQty=e,this._partQtyOriginal=this._partSelectionKey()}catch{if(L!==this._openGen)return;this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,C])=>C>0).sort(([C],[L])=>C.localeCompare(L)))}close(){this._openGen++,this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(C,L){this._draft&&(this._draft={...this._draft,[C]:L})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let C=this._lang,M=(this._originalSnapshot.used_parts||[]).filter(A=>A.quantity>0).map(A=>`${l(A.quantity,C)}\xD7 ${A.name||A.part_id}`).join(", ");if(!await Y(this.hass,{title:r("history_delete_entry",C),message:M?`${r("history_delete_confirm_entry",C)} ${r("history_delete_returns_parts",C).replace("{parts}",M)}`:r("history_delete_confirm_entry",C),confirmText:r("delete",C),danger:!0})||!this._draft||!this._originalSnapshot)return;let e=this._draft;this._error="",await this._runWs({type:"maintenance_supporter/task/history/delete",entry_id:e.entry_id,task_id:e.task_id,timestamp:this._originalSnapshot.original_timestamp})!==void 0&&(this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:e.entry_id,task_id:e.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close())}_runWs(C){return F(this,C,{busy:L=>{this._saving=L},onError:L=>{this._error=L}})}async _save(){if(!this._draft||!this._originalSnapshot||this._saving||this._photos.uploading)return;this._error="",this._photos.clearError();let C=this._draft,L=this._originalSnapshot,M={type:"maintenance_supporter/task/history/update",entry_id:C.entry_id,task_id:C.task_id,original_timestamp:L.original_timestamp};if(C.timestamp!==L.timestamp&&(M.timestamp=C.timestamp),C.notes!==L.notes&&(M.notes=C.notes),C.cost!==L.cost&&(M.cost=C.cost),C.duration!==L.duration&&(M.duration=C.duration),C.completed_by!==L.completed_by&&(M.completed_by=C.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(M.used_parts=(this._partOptions||[]).filter(e=>(this._partQty[`${e.entry_id}:${e.part_id}`]||0)>0).map(e=>({part_id:e.part_id,quantity:this._partQty[`${e.entry_id}:${e.part_id}`],...e.foreign?{entry_id:e.entry_id}:{}}))),C.reading_value!==L.reading_value&&(M.reading_value=C.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let e=this._readingNumbers(),o={};for(let A of this._readingRows)o[A.id]=e[A.id]??null;M.reading_values=o}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(M.photo_doc_ids=this._photos.ids),Object.keys(M).filter(e=>!["type","entry_id","task_id","original_timestamp"].includes(e)).length===0){this.close();return}await this._runWs(M)!==void 0&&(this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:C.entry_id,task_id:C.task_id,new_timestamp:C.timestamp},bubbles:!0,composed:!0})),this.close())}render(){if(!this._open||!this._draft)return a;let C=this._lang,L=this._draft,M=this._error||this._photos.errorText(C);return z(()=>this.close(),i`
        ${U()?a:i`<h2>${r("history_edit_title",C)}</h2>`}
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${r(L.type,C)||L.type}</span>
        </div>
        <ms-date-field
          kind="datetime"
          required
          .hass=${this.hass}
          .lang=${C}
          .label=${r("history_edit_timestamp",C)}
          .helper=${K1(C)}
          .value=${N1(L.timestamp)}
          @value-changed=${t=>{let e=t.detail.value;e&&this._set("timestamp",e)}}
        ></ms-date-field>
        <label>
          <span>${r("notes_label",C)}</span>
          <textarea
            rows="3"
            @input=${t=>{let e=t.target.value;this._set("notes",e||null)}}
            .value=${L.notes??""}></textarea>
        </label>
        <div class="row">
          <div class="cost-field">
            <span>${r("cost",C)}</span>
            <ms-cost-input .lang=${C} .value=${L.cost!=null?String(L.cost):""}
              @value-changed=${t=>{let e=t.detail.value;this._set("cost",e?Number(e):null)}}></ms-cost-input>
          </div>
          <label>
            <span>${r("duration",C)}</span>
            <input type="number" min="0" step="1" inputmode="numeric"
              .value=${L.duration!=null?String(L.duration):""}
              @input=${t=>{this._set("duration",Z2(t.target.value))}} />
          </label>
        </div>
        ${this._renderReadings(L,C)}
        ${this._partOptions&&this._partOptions.length>0?i`
          <div class="parts-block">
            <span class="parts-title">${r("complete_parts_used",C)}</span>
            ${this._partOptions.map(t=>{let e=`${t.entry_id}:${t.part_id}`,o=this._partQty[e]||0;return i`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${o>0}
                    @change=${A=>{let d=A.target.checked;this._partQty={...this._partQty,[e]:d?1:0}}} />
                  <span class="part-label">${t.name}${t.foreign&&t.object_name?` (${t.object_name})`:""}</span>
                  ${o>0?i`
                    <input class="part-qty" type="number" min=${h1[0]} max=${h1[1]} step="0.01"
                      .value=${String(o)}
                      @input=${A=>{let d=parseFloat(A.target.value);!isNaN(d)&&d>0&&(this._partQty={...this._partQty,[e]:d})}} />
                  `:a}
                </label>
              `})}
          </div>
        `:a}
        <div class="photos-block">
          <span class="parts-title">${r("completion_photos",C)}</span>
          ${this._photos.photos.length>0?i`
            <div class="photo-strip">
              ${this._photos.photos.map(t=>i`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${t.id}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${r("remove",C)}
                    @click=${()=>this._photos.remove(t.id)}>✕</button>
                </div>`)}
            </div>`:a}
          ${this._photos.full?i`<span class="photos-hint">${r("photos_limit",C).replace("{max}",String(this._photos.max))}</span>`:i`<ms-photo-picker .lang=${C} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${t=>this._photos.addFiles(t.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${r("history_edit_photos_hint",C)}</span>
        </div>
        ${M?R("error",M):a}
        <div class="actions">
          <button class="delete-entry" @click=${this._delete} ?disabled=${this._saving} title=${r("history_delete_entry",C)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon> ${r("history_delete_entry",C)}
          </button>
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${r("cancel",C)}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving||this._photos.uploading}
            title=${this._photos.uploading?r("uploading",C):""}>
            ${this._saving?r("saving",C):r("save",C)}
          </button>
        </div>
    `,{title:r("history_edit_title",C)})}updated(C){C.has("_open")&&this._open&&q(this.shadowRoot)}_renderReadings(C,L){return this._readingRows.length>0?i`
        <div class="readings-block">
          <span class="parts-title">${r("readings_section",L)}</span>
          ${this._readingRows.map(M=>i`
            <label class="reading-row-edit">
              <span class="reading-row-name">${M.name}${M.unit?` (${M.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[M.id]??""}
                @input=${t=>{this._readingText={...this._readingText,[M.id]:t.target.value}}} />
            </label>
          `)}
        </div>`:C.reading_value==null&&C.task_type!=="reading"?a:i`
      <label>
        <span>${r("reading_value_label",L)}${C.reading_unit?` (${C.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${C.reading_value!=null?String(C.reading_value):""}
          @input=${M=>{let t=M.target.value,e=t===""?NaN:Number(t);this._set("reading_value",isNaN(e)?null:e)}} />
      </label>`}};S.styles=[n2,Q,P`
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
  `],p([y({attribute:!1})],S.prototype,"hass",2),p([n()],S.prototype,"_open",2),p([n()],S.prototype,"_saving",2),p([n()],S.prototype,"_error",2),p([n()],S.prototype,"_draft",2),p([n()],S.prototype,"_partOptions",2),p([n()],S.prototype,"_partQty",2),p([n()],S.prototype,"_readingRows",2),p([n()],S.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",S);function u2(H,V,C=new Date){let L=H?.hours,M=t1(H?.snoozed_until);if(typeof L!="number"||!Number.isFinite(M))return r("snoozed",V);let t=r1(),o=I(M,t)===I(C,t)?X(new Date(M),V):i1(H.snoozed_until,V);return U1("snoozed_for","snoozed_for_one",L,V,"hours").replace("{until}",o)}function L5(H,V){if(V<=0)return 0;let C=typeof H=="number"&&Number.isFinite(H)?Math.trunc(H):0;return C<0?0:C%V}function M5(H){return!!(H?.phases&&H.phase_sequence&&H.phase_sequence.length>0)}function O1(H){if(!H||!M5(H))return null;let V=H.phase_sequence,C=L5(H.phase_cursor,V.length),L=V[C],M=H.phases?.[L];return M?{id:L,name:M.name,index:C,count:V.length,notes:M.notes,checklist:M.checklist!==void 0?M.checklist:H.checklist??[],consumesParts:M.consumes_parts!==void 0?M.consumes_parts:H.consumes_parts??[],requiredFields:M.required_completion_fields!==void 0?M.required_completion_fields:H.required_completion_fields??[]}:null}function J(H){let V=O1(H);return V?`${V.index+1}/${V.count} \xB7 ${V.name}`:""}function r5(H,V){return typeof H=="number"&&Number.isFinite(H)&&H>=.01?H:V}function S2(H){let V=H.task??null,C=V?O1(V):null,L=C?C.consumesParts:V?.consumes_parts||[],M=!!V?.part_ref,t=H.objects.find(Z=>Z.entry_id===H.entryId),e=t?.parts||[],o=M?e.find(Z=>Z.id===V.part_ref.part_id):void 0,A=H.features?H.features.checklists:H.checklistsEnabled??!0,d=H.features?H.features.checklists?H.checklist??V?.checklist??[]:[]:H.checklist??[],x=H.features?H.features.adaptive&&(H.adaptiveEnabled??!!V?.adaptive_config?.enabled):!!H.adaptiveEnabled;return{entry_id:H.entryId,task_id:H.taskId,task_name:H.taskName,checklist:C?A?C.checklist:[]:d,adaptive_enabled:x,required_completion_fields:C?C.requiredFields:V?.required_completion_fields||[],task_type:V?.type||"",reading_unit:V?.reading_unit||"",readings:V?.readings||[],reading_history:i2(V?.history),parts:M?[]:t2({consumes_parts:L},H.entryId,H.objects,H.lang),consumes_parts:M?[]:L,phase_label:C?J(V):"",require_tag_scan:!!V?.require_tag_scan,restock_default:M?r5(o?.restock_quantity,1):null,restock_unit_cost:M?o?.cost??null:null,restock_package:M&&o?.package_size?q1(o.package_size,o.unit,H.lang):"",currency_symbol:j({currency_symbol:H.currencySymbol}),consumes_info:L.map(Z=>e2(Z,H.entryId,H.objects,H.lang)),checklist_prefill:V?.checklist_progress||{},via_tag_scan:!!H.viaTagScan,parts_cost_mode:M?a2(o,H.partsCostMode??"purchase",!!t?.object.battery_fleet):H.partsCostMode??"purchase",prefill:L2(V)}}function c2(H,V,C){H.entryId=V.entry_id,H.taskId=V.task_id,H.taskName=V.task_name,H.lang=C,H.checklist=V.checklist??[],H.adaptiveEnabled=!!V.adaptive_enabled,H.requiredFields=V.required_completion_fields??[],H.taskType=V.task_type??"",H.readingUnit=V.reading_unit??"",H.readings=V.readings??[],H.readingHistory=V.reading_history??[],H.parts=V.parts??[],H.consumesParts=V.consumes_parts??[],H.phaseLabel=V.phase_label??"",H.requireTagScan=!!V.require_tag_scan,H.restockDefault=V.restock_default??null,H.restockUnitCost=V.restock_unit_cost??null,H.restockPackage=V.restock_package??"",H.currencySymbol=j(V),H.consumesInfo=V.consumes_info??[],H.checklistPrefill=V.checklist_prefill??{},H.viaTagScan=!!V.via_tag_scan,H.partsCostMode=V.parts_cost_mode??"purchase",H.prefill=V.prefill??null,H.open({viaTagScan:!!V.via_tag_scan})}var e5=new Set(["about","blob","data","file","filesystem","javascript","livescript","ms-appinstaller","ms-cxh","ms-cxh-full","ms-msdt","ms-officecmd","search","search-ms","view-source","vbscript"]);function f1(H){return H.replace(/[\t\n\r]/g,"").replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g,"")}function g1(H){let V=/^([a-z][a-z0-9+.-]+):/i.exec(f1(H||""));return V?V[1].toLowerCase():null}function m1(H){let V=g1(H);return V!==null&&!e5.has(V)}function h2(H){return!!H&&/^https?:\/\//i.test(H)}function v1(H){if(!H)return a;if(customElements.get("ha-markdown")){let{content:V,links:C}=o5(H);return i`<ha-markdown
      class="notes-md"
      .content=${V}
      breaks
      ${r2(L=>a5(L,C))}
    ></ha-markdown>`}return i`${H}`}function s3(H){return H?H.replace(/!\[([^\]]*)\]\([^)]*\)/g,"$1").replace(/\[([^\]]+)\]\([^)]*\)/g,"$1").replace(/<((?:https?|mailto):[^>\s]+)>/g,"$1").split(/\r?\n/).filter(C=>!/^\s*(```|~~~)/.test(C)&&!/^\s*([-*_])(\s*\1){2,}\s*$/.test(C)).map(C=>C.replace(/^\s*(?:#{1,6}\s+|>\s?|[-*+]\s+(?:\[[ xX]\]\s+)?|\d+[.)]\s+)/,"")).join(" ").replace(/(\*\*|__)(.+?)\1/g,"$2").replace(/~~(.+?)~~/g,"$1").replace(/`([^`]+)`/g,"$1").replace(/(^|[^\w*])\*(?!\s)([^*]*?\S)\*(?!\w)/g,"$1$2").replace(/(^|[^\w])_(?!\s)([^_]*?\S)_(?!\w)/g,"$1$2").replace(/\s+/g," ").trim():""}var y1="https://app-link.invalid/",t5=new Set(["http","https","mailto","tel","ftp"]),i5=/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/,l1="[a-zA-Z][a-zA-Z0-9+.-]+:";function o5(H){let V=[],C=t=>{let e=g1(t);return!e||t5.has(e)||!m1(t)?null:(V.push(f1(t)),`${y1}${V.length-1}`)},L=t=>t.replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)<(${l1}[^>\\n]*)>`,"g"),(e,o,A,d)=>{let x=o?null:C(d);return x?`${A}${x}`:e}).replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)(${l1}[^\\s)]*)`,"g"),(e,o,A,d)=>{let x=o?null:C(d);return x?`${A}${x}`:e}).replace(new RegExp(`(^|[^(])<(${l1}[^\\s<>]*)>`,"gm"),(e,o,A)=>{let d=C(A);return d?`${o}[${A.replace(/([\\[\]])/g,"\\$1")}](${d})`:e}).replace(new RegExp(`^( {0,3}\\[[^\\]\\n]+\\]:[ \\t]*)<?(${l1}[^\\s>]*)>?`,"gm"),(e,o,A)=>{let d=C(A);return d?`${o}${d}`:e});return{content:H.split(i5).map((t,e)=>e%2?t:L(t)).join(""),links:V}}function k1(H,V){for(let C of H.querySelectorAll(`a[href^="${y1}"]`)){let L=V[Number(C.getAttribute("href").slice(y1.length))];L&&C.setAttribute("href",L)}}var O2=new WeakMap;function a5(H,V){if(!H)return;let C=O2.get(H);if(!C&&V.length===0)return;if(C){C.links=V,H.shadowRoot&&k1(H.shadowRoot,V);return}let L={links:V};O2.set(H,L),(async()=>{await H.updateComplete;let M=H.shadowRoot;M&&(new MutationObserver(()=>k1(M,L.links)).observe(M,{childList:!0,subtree:!0}),k1(M,L.links))})()}function b1(H,V,C,L){let M=C,t=A=>typeof A=="string"?A:null,e=A=>typeof A=="number"?A:null,o=t(M.timestamp)??"";return{entry_id:H,task_id:V,original_timestamp:o,type:t(M.type)||"completed",timestamp:o,notes:t(M.notes),cost:e(M.cost),duration:e(M.duration),completed_by:t(M.completed_by),used_parts:Array.isArray(M.used_parts)?M.used_parts:null,photo_doc_ids:p1(M),reading_value:e(M.reading_value),reading_values:d1(M),readings:L?.readings??[],task_type:L?.type??null,reading_unit:L?.reading_unit??null}}async function O3(H,V,C,L){let t=(await H.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:V})).tasks?.find(o=>o.id===C);if(!t)return null;let e=t.history?.find(o=>o.timestamp===L);return e||(e=(await l2(H,V,C))?.find(A=>A.timestamp===L)),e?b1(V,C,e,t):null}var f2=H=>typeof H=="number"&&Number.isInteger(H)&&H>0;function A5(H){return H&&f2(H.ref_no)?String(H.ref_no):null}function g2(H,V){let C=A5(H);return C&&V&&f2(V.ref_no)?`${C}.${V.ref_no}`:null}function k3(H){let V=/^(\d+)(?:\.(\d+)(?:-(\d+))?)?$/.exec(H.trim());return V?{object:Number(V[1]),task:V[2]?Number(V[2]):null,entry:V[3]?Number(V[3]):null}:null}function k2(H,V){return H?i`<span class="ref-chip" title=${V??""}>#${H}</span>`:a}function x1(H){return typeof H=="string"?H.trim():""}function y2(H,V,C={}){let L=H.trigger_change;if(L&&typeof L=="object"){let M=x1(L.latest),t=x1(L.installed);if(M&&t&&M!==t)return r("trigger_update_available",V).split("{latest}").join(M).split("{installed}").join(t);let e=x1(L.to),o=x1(L.from);if(e)return`${r("trigger_val",V)}: ${o?`${o} \u2192 `:""}${e}`}return C.stateRule||typeof H.trigger_value!="number"||!Number.isFinite(H.trigger_value)?"":`${r("trigger_val",V)}: ${l(H.trigger_value,V,{maximumFractionDigits:3})}${C.unit?` ${C.unit}`:""}`}function _1(H){let V=C=>{let L=t1(C.timestamp);return Number.isNaN(L)?-1/0:L};return(H??[]).map((C,L)=>({entry:C,index:L,at:V(C)})).sort((C,L)=>L.at-C.at||L.index-C.index).map(C=>C.entry)}var d5=["completed","skipped","missed","reset","triggered","trigger_replaced","trigger_removed","updated"];function N3(H,V){let C=V.lang;return i`
    <div class="history-filters-new">
      <div class="filter-chips">
        ${d5.map(L=>{let M=H.history.filter(t=>t.type===L).length;return M===0?a:i`
            <span class="filter-chip ${V.filter===L?"active":""}"
              @click=${()=>V.setFilter(V.filter===L?null:L)}>
              ${r(L,C)} (${M})
            </span>
          `})}
        ${V.filter?i`<span class="filter-chip clear" @click=${()=>V.setFilter(null)}>${r("show_all",C)}</span>`:a}
      </div>
      <div class="filter-controls">
        <input type="text" class="search-input" placeholder="${r("search_notes",C)}..." .value=${V.search} @input=${L=>V.setSearch(L.target.value)} />
      </div>
    </div>
  `}function G3(H,V){let C=V.lang,L=V.filter?H.history.filter(M=>M.type===V.filter):H.history;if(V.search){let M=V.search.toLowerCase();L=L.filter(t=>u1(t.notes,V.search)||u1(c1(t.notes,C),V.search)||(b2(V,t)??"").toLowerCase().endsWith(M))}return L.length===0?i`<p class="empty">${r("no_history",C)}</p>`:i`
    <div class="history-timeline">
      ${_1(L).map(M=>w1(M,V))}
    </div>
  `}function b2(H,V){return H.taskRef&&V.ref_no?`${H.taskRef}-${V.ref_no}`:null}function p5(H,V){let C=p1(V);return C.length>0?i`<div class="history-photos">
        ${C.map(L=>i`<maintenance-history-photo .hass=${H} .docId=${L}></maintenance-history-photo>`)}
      </div>`:a}function n5(H,V){let C=V.lang,L=e=>l(e,C,{maximumFractionDigits:3}),M=e=>e==null?"":` (${e>=0?"+":""}${L(e)})`,t=d1(H);return t.length>0?i`<div class="history-readings">
      ${t.map(e=>i`<span class="history-reading">
        <span class="history-reading-name">${e.name}</span>
        <span class="history-reading-value">${L(e.value)}${e.unit?` ${e.unit}`:""}${M(V.readingSlotDelta?.(H,e.id))}</span>
      </span>`)}
    </div>`:H.reading_value!=null?i`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${r("reading_label",C)}</span>
      <span class="history-reading-value">${L(H.reading_value)}${V.readingUnit?` ${V.readingUnit}`:""}${M(V.readingDelta?.(H))}</span>
    </span></div>`:a}function w1(H,V,C={}){let L=V.lang,{compact:M=!1,showRef:t=!0,showBadges:e=!0,showEdit:o=!0,showHead:A=!0}=C,d=V.openEdit,x=o&&!!d&&D1.includes(H.type),Z=typeof H.parts_cost=="number"?H.parts_cost:null,g=H.cost_basis==="use",s=g&&!!H.purchase,u=y2(H,L,{unit:V.triggerUnit,stateRule:V.stateRule});return i`
    <div class="history-entry${M?" compact":""}">
      ${M?a:i`<div class="history-icon ${H.type}" style="background: ${E1(H.type)}">
            <ha-icon .icon=${M1[H.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        ${A?i`<div class="history-row">
          <strong>${r(H.type,L)}</strong>
          ${t?k2(b2(V,H),r("ref_number",L)):a}
          ${e&&H.phase_id?i`<span class="history-phase-badge">${V.phaseNames?.[H.phase_id]||H.phase_id}</span>`:a}
          ${e&&H.auto?i`<span class="history-auto-badge">${r("history_auto",L)}</span>`:a}
          ${x?i`<button class="history-edit-btn"
                     title=${r("history_edit_button",L)}
                     @click=${()=>d(H)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:a}
        </div>
        <div class="history-date">${i1(H.timestamp,L)}</div>`:a}
        ${H.notes?i`<div class="history-notes">${c1(H.notes,L)}</div>`:a}
        ${p5(V.hass,H)}
        ${n5(H,V)}
        ${H.cost!=null||H.duration!=null||u||Z!=null?i`<div class="history-details">
              ${H.cost!=null?s?i`<span>${r("history_purchase_stock",L).replace("{amount}",W(H.cost,V.currencySymbol,L))}</span>`:H.cost<0?i`<span class="history-credit">${z1(H.cost,V.currencySymbol,L)}</span>`:i`<span>${r("cost",L)}: ${W(H.cost,V.currencySymbol,L)}</span>`:a}
              ${Z!=null?i`<span title=${r(g?"history_parts_counted_hint":"history_parts_info_hint",L)}>${r(g?"history_parts_counted":"history_parts_info",L).replace("{amount}",W(Z,V.currencySymbol,L))}</span>`:a}
              ${H.duration!=null?i`<span>${r("duration",L)}: ${o1(H.duration,L)}</span>`:a}
              ${u?i`<span>${u}</span>`:a}
            </div>`:a}
      </div>
    </div>
  `}var U3="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z";var _2="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";var w2="M13 13H11V7H13M11 15H13V17H11M15.73 3H8.27L3 8.27V15.73L8.27 21H15.73L21 15.73V8.27L15.73 3Z";var P2="M20 21H4V10H6V19H18V10H20V21M3 3H21V9H3V3M9.5 11H14.5C14.78 11 15 11.22 15 11.5V13H9V11.5C9 11.22 9.22 11 9.5 11M5 5V7H19V5H5Z";var B2="M23 7V13H21V7M21 15H23V17H21M12 2A2 2 0 0 0 10 4A2 2 0 0 0 10 4.29C7.12 5.14 5 7.82 5 11V17L3 19V20H21V19L19 17V11C19 7.82 16.88 5.14 14 4.29A2 2 0 0 0 14 4A2 2 0 0 0 12 2M10 21A2 2 0 0 0 12 23A2 2 0 0 0 14 21Z";var T2="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.11 3.9 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.9 20.11 3 19 3M19 19H5V9H19V19M19 7H5V5H19V7Z";var z3="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z";var F2="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z";var q3="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";var K3="M16.59,5.59L18,7L12,13L6,7L7.41,5.59L12,10.17L16.59,5.59M16.59,11.59L18,13L12,19L6,13L7.41,11.59L12,16.17L16.59,11.59Z";var j3="M7.41,18.41L6,17L12,11L18,17L16.59,18.41L12,13.83L7.41,18.41M7.41,12.41L6,11L12,5L18,11L16.59,12.41L12,7.83L7.41,12.41Z";var P1="M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z";var X3="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z";var Y3="M20,18H4V8H20M20,6H12L10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6Z";var J3="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z";var C0="M18,6H13A2,2 0 0,0 11,8V10.28C10.41,10.62 10,11.26 10,12A2,2 0 0,0 12,14C13.11,14 14,13.1 14,12C14,11.26 13.6,10.62 13,10.28V8H16V16H8V8H10V6H8L6,6V18H18M20,20H4V4H20M20,2H4A2,2 0 0,0 2,4V20A2,2 0 0,0 4,22H20C21.11,22 22,21.1 22,20V4C22,2.89 21.11,2 20,2Z";var R2="M13,16V8H15V16H13M9,16V8H11V16H9M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z";var H0="M3,11H5V13H3V11M11,5H13V9H11V5M9,11H13V15H11V13H9V11M15,11H17V13H19V11H21V13H19V15H21V19H19V21H17V19H13V21H11V17H15V15H17V13H15V11M19,19V15H17V19H19M15,3H21V9H15V3M17,5V7H19V5H17M3,3H9V9H3V3M5,5V7H7V5H5M3,15H9V21H3V15M5,17V19H7V17H5Z";var V0="M16,18H18V6H16M6,18L14.5,12L6,6V18Z";var L0="M21.41 11.58L12.41 2.58A2 2 0 0 0 11 2H4A2 2 0 0 0 2 4V11A2 2 0 0 0 2.59 12.42L11.59 21.42A2 2 0 0 0 13 22A2 2 0 0 0 14.41 21.41L21.41 14.41A2 2 0 0 0 22 13A2 2 0 0 0 21.41 11.58M13 20L4 11V4H11L20 13M6.5 5A1.5 1.5 0 1 1 5 6.5A1.5 1.5 0 0 1 6.5 5Z";var m5="var(--maint-done-color, #78909c)",l5="var(--secondary-text-color, #727272)";function C1(H){if(H.archived)return"archived";if(H.is_done)return"done";let V=H.status||"ok";return V==="ok"&&H.schedule_type==="manual"&&H.days_until_due==null?"no_due":V}var v5={done:"completed",no_due:"no_due_date"};function B1(H,V){return r(v5[H]??H,V)}function Z1(H){let V=C1(H);return V==="done"?m5:V==="no_due"?l5:R1[V]||"var(--disabled-color, #9e9e9e)"}function x5(H){return H==="no_due"?"mdi:calendar-blank-outline":M1[H==="done"?"completed":H]||"mdi:circle-medium"}var Z5={"mdi:check-circle":F2,"mdi:alert-circle":_2,"mdi:alert-octagon":w2,"mdi:bell-alert":B2,"mdi:archive-outline":P2,"mdi:pause-circle-outline":R2,"mdi:calendar-blank-outline":T2,"mdi:circle-medium":P1};function s5(H){return Z5[x5(H)]??P1}function D2(H,V,C="pill"){let L=C1(H),M=B1(L,V);return C==="chip"?i`<span class="status-chip ${L}">${M}</span>`:i`<span class="status-badge ${L}" role="img" title="${M}" aria-label="${M}"><ha-svg-icon .path=${s5(L)}></ha-svg-icon><span class="status-label">${M}</span></span>`}async function E2(H,V,C){if(!H)return null;let L={title:r("delete",C),confirmText:r("delete",C),danger:!0};if(!V?.part_ref)return await H.confirm({...L,message:r("delete_task_confirm",C)})?{}:null;let M=await H.confirmWithCheck({...L,message:r("delete_buy_task_confirm",C),check:r("delete_buy_task_off",C)});return M.confirmed?M.checked?{disable_auto_buy_task:!0}:{}:null}function m(H){return H.toFixed(1)}function n0(H,V,C=4){if(!isFinite(H)||!isFinite(V))return{ticks:[],niceMin:0,niceMax:1};if(H===V){let d=Math.abs(H)*.1||1;H-=d,V+=d}let L=V-H,M=Math.pow(10,Math.floor(Math.log10(L/Math.max(1,C)))),t=M;for(let d of[1,2,5,10])if(t=M*d,L/t<=C+.5)break;let e=Math.floor(H/t)*t,o=Math.ceil(V/t)*t,A=[];for(let d=e;d<=o+t*1e-6;d+=t)A.push(Math.abs(d)<t*1e-9?0:d);return{ticks:A,niceMin:e,niceMax:o}}function u5(H,V){let C=Math.abs(H),L=M=>({maximumFractionDigits:M});return C>=1e6?l(H/1e6,V,L(C>=1e7?0:1))+"M":C>=1e4?l(H/1e3,V,L(0))+"k":C>=1e3?l(H/1e3,V,L(1))+"k":C>=100?l(H,V,L(0)):C>=1?l(H,V,L(1)):C===0?"0":l(H,V,L(2))}function m0(H,V,C){let L=Math.abs(H),M=l(H,C,{maximumFractionDigits:L>=100?0:L>=1||L===0?1:2});return V?`${M} ${V}`:M}function l0(H,V,C){if(Math.abs(H)>=1e3||!(V>0))return u5(H,C);let L=Math.max(0,Math.min(4,-Math.floor(Math.log10(V)+1e-9)));return l(H,C,{maximumFractionDigits:L})}function v0(H,V,C,L){return L-C<2*864e5?X(new Date(H),V):S5(H,V,c5(C,L))}function S5(H,V,C){return S1(new Date(H),V,C)}function x0(H,V){let C=new Date(H);return`${S1(C,V)}, ${X(C,V)}`}function c5(H,V){if(!Number.isFinite(H)||!Number.isFinite(V))return!1;let C=r1();return I(H,C).slice(0,4)!==I(V,C).slice(0,4)}function Z0(H,V,C){if(C<2||V<=H)return[H,V];let L=[];for(let M=0;M<C;M++)L.push(H+(V-H)*M/(C-1));return L}function $2(H,V){let C=H.interval_analysis,L=C?.weibull_beta,M=C?.weibull_eta;if(L==null||M==null||M<=0)return a;let t=H.interval_days??0,e=H.suggested_interval??t;return i`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${r("weibull_reliability_curve",V)}
        ${h5(L,V)}
      </div>
      ${O5(L,M,t,e,V)}
      ${f5(C,V)}
      ${C?.confidence_interval_low!=null?g5(C,H,V):a}
    </div>
  `}function h5(H,V){let C,L,M;return H<.8?(C="early_failures",L="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",M="beta_early_failures"):H<=1.2?(C="random_failures",L="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",M="beta_random_failures"):H<=3.5?(C="wear_out",L="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",M="beta_wear_out"):(C="highly_predictable",L="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",M="beta_highly_predictable"),i`
    <span class="beta-badge ${C}">
      <ha-svg-icon path="${L}"></ha-svg-icon>
      ${r(M,V)} (\u03B2=${l(H,V,2)})
    </span>
  `}function O5(H,V,C,L,M){let s=Math.max(C,L,V,1)*1.3,u=50,k=[];for(let c=0;c<=u;c++){let O=c/u*s,C5=1-Math.exp(-Math.pow(O/V,H)),H5=32+O/s*260,V5=136-C5*128;k.push([H5,V5])}let H1=k.map(([c,O])=>`${m(c)},${m(O)}`).join(" "),s1="M32,136 "+k.map(([c,O])=>`L${m(c)},${m(O)}`).join(" ")+` L${m(k[u][0])},136 Z`,E=32+C/s*260,V1=1-Math.exp(-Math.pow(C/V,H)),L1=136-V1*128,Y2=l((1-V1)*100,M,0),F1=32+L/s*260,J2=[0,.25,.5,.75,1];return i`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${r("chart_weibull",M)}">
        ${J2.map(c=>{let O=136-c*128;return $`
            <line x1="${32}" y1="${m(O)}" x2="${292}" y2="${m(O)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${c===.5?"4,3":a}" />
            <text x="${28}" y="${m(O+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${l(c*100,M,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(s/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(s)}</text>

        <path d="${s1}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${H1}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${C>0?$`
          <line x1="${m(E)}" y1="${8}" x2="${m(E)}" y2="${m(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${m(E)}" cy="${m(L1)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${m(E+4)}" y="${m(L1-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${Y2}%</text>
        `:a}

        ${L>0&&L!==C?$`
          <line x1="${m(F1)}" y1="${8}" x2="${m(F1)}" y2="${m(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:a}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${r("weibull_failure_probability",M)}</span>
      ${C>0?i`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${r("current_interval_marker",M)}</span>`:a}
      ${L>0&&L!==C?i`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${r("recommended_marker",M)}</span>`:a}
    </div>
  `}function f5(H,V){return i`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${r("characteristic_life",V)}</span>
        <span class="weibull-info-value">${N(Math.round(H.weibull_eta),V)}</span>
      </div>
      ${H.weibull_r_squared!=null?i`
        <div class="weibull-info-item">
          <span>${r("weibull_r_squared",V)}</span>
          <span class="weibull-info-value">${l(H.weibull_r_squared,V,3)}</span>
        </div>
      `:a}
    </div>
  `}function g5(H,V,C){let L=H.confidence_interval_low,M=H.confidence_interval_high,t=V.suggested_interval??V.interval_days??0,e=V.interval_days??0,o=Math.max(0,L-5),d=M+5-o,x=(L-o)/d*100,Z=(M-L)/d*100,g=(t-o)/d*100,s=e>0?(e-o)/d*100:-1;return i`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${r("confidence_interval",C)}: ${N(t,C)} (${L}\u2013${M})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${m(x)}%;width:${m(Z)}%"></div>
        ${s>=0?i`<div class="confidence-marker current" style="left:${m(s)}%"></div>`:a}
        <div class="confidence-marker recommended" style="left:${m(g)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${r("confidence_conservative",C)} (${L}${r("days",C).charAt(0)})</span>
        <span class="confidence-text high">${r("confidence_aggressive",C)} (${M}${r("days",C).charAt(0)})</span>
      </div>
    </div>
  `}function T1(H){return Math.max(1,Math.round(H||0))}var k5={one:"sensor_prediction_urgency_one",few:"sensor_prediction_urgency_few",other:"sensor_prediction_urgency"};function I2(H,V,C){let L=H.degradation_trend!=null&&H.degradation_trend!=="insufficient_data",M=H.days_until_threshold!=null,t=H.environmental_factor!=null&&H.environmental_factor!==1;if(!L&&!M&&!t)return a;let e=H.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":H.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return i`
    <div class="prediction-section">
      ${H.sensor_prediction_urgency?i`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${r(X1(T1(H.days_until_threshold),V,k5),V).replace("{days}",String(T1(H.days_until_threshold)))}
        </div>
      `:a}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${r("sensor_prediction",V)}
      </div>
      <div class="prediction-grid">
        ${L?i`
          <div class="prediction-item">
            <ha-svg-icon path="${e}"></ha-svg-icon>
            <span class="prediction-label">${r("degradation_trend",V)}</span>
            <span class="prediction-value ${H.degradation_trend}">${r("trend_"+H.degradation_trend,V)}</span>
            ${H.degradation_rate!=null?i`<span class="prediction-rate">${H.degradation_rate>0?"+":""}${l(H.degradation_rate,V,Math.abs(H.degradation_rate)>=10?0:1)} ${H.trigger_entity_info?.unit_of_measurement||""}/${r("day_short",V)}</span>`:a}
          </div>
        `:a}
        ${M?i`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${r("days_until_threshold",V)}</span>
            <span class="prediction-value prediction-days${H.days_until_threshold===0?" exceeded":H.sensor_prediction_urgency?" urgent":""}">${H.days_until_threshold===0?r("threshold_exceeded",V):"~"+j1(T1(H.days_until_threshold),V)}</span>
            ${H.threshold_prediction_date?i`<span class="prediction-date">${T(H.threshold_prediction_date,V)}</span>`:a}
            ${H.threshold_prediction_confidence?i`<span class="confidence-dot ${H.threshold_prediction_confidence}"></span>`:a}
            ${(H.prediction_cycles??0)>0?i`<span class="prediction-cycles">${r("prediction_cycles",V)}: ${H.prediction_cycles}</span>`:a}
          </div>
        `:a}
        ${t&&C.environmental?i`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${r("environmental_adjustment",V)}</span>
            <span class="prediction-value">${l(H.environmental_factor,V,2)}x</span>
            ${H.environmental_entity?i`<span class="prediction-entity entity-link" @click=${o=>C2(o,H.environmental_entity)}>${H.environmental_entity}</span>`:a}
          </div>
        `:a}
      </div>
    </div>
  `}function W2(H,V,C,L){let M=Math.max(H||1,V);return i`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${r("current",L)}: ${H!=null?N(H,L):"\u2014"}
        </div>
        <div class="interval-visual current"
          style="width: ${H!=null?Math.min(H/M*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${r("recommended",L)}: ${N(V,L)}
          <span class="confidence-badge ${C}">${r(`confidence_${C}`,L)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(V/M*100,100)}%"></div>
      </div>
    </div>
  `}var N2=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function G2(){return Number(e1().slice(5,7))-1}function Q2(H,V,C){if(!C.seasonal||!H.seasonal_factor||H.seasonal_factor===1)return a;let L=N2.map(o=>r(o,V)),M=G2(),t=H.seasonal_factors||H.interval_analysis?.seasonal_factors||null,e=t&&t.length===12?t:L.map((o,A)=>{let d=H.seasonal_factor||1,x=Math.sin((A-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,d+x))});return i`
    <div class="seasonal-card-compact">
      <h4>${r("seasonal_awareness",V)}</h4>
      <div class="seasonal-mini-chart">
        ${e.map((o,A)=>{let d=o*40,x=o<.9?"low":o>1.1?"high":"normal";return i`
            <div class="seasonal-bar ${x} ${A===M?"current":""}"
                 style="height: ${d}px"
                 title="${L[A]}: ${l(o,V,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${r("shorter",V)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${r("normal",V)}</span>
        <span class="legend-item"><span class="dot high"></span> ${r("longer",V)}</span>
      </div>
    </div>
  `}function U2(H,V){return y5(H,V)}function y5(H,V){let C=H.seasonal_factors??H.interval_analysis?.seasonal_factors;if(!C||C.length!==12)return a;let L=H.interval_analysis?.seasonal_reason,M=G2(),t=300,e=100,o=8,d=e-o-4,x=Math.max(...C,1.5),Z=t/12,g=Z*.65,s=o+d-1/x*d;return i`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${r("seasonal_chart_title",V)}
        ${L?i`<span class="source-tag">${L==="learned"?r("seasonal_learned",V):r("seasonal_manual",V)}</span>`:a}
      </div>
      <svg viewBox="0 0 ${t} ${e}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${r("chart_seasonal",V)}">
        <line x1="0" y1="${m(s)}" x2="${t}" y2="${m(s)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${C.map((u,k)=>{let H1=u/x*d,s1=k*Z+(Z-g)/2,E=o+d-H1,V1=k===M,L1=u<1?"var(--success-color, #4caf50)":u>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return $`
            <rect x="${m(s1)}" y="${m(E)}"
              width="${m(g)}" height="${m(H1)}"
              fill="${L1}" opacity="${V1?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${N2.map((u,k)=>i`<span class="seasonal-label ${k===M?"active-month":""}">${r(u,V)}</span>`)}
      </div>
    </div>
  `}var v=class extends B{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showPostpone=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._postponeDate="";this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1,beta_editor:!1};this._toast="";this._toastTimer=new v2;this._access=n1;this._currencySymbol="";this._partsCostMode="purchase";this._loadSeq=0}get _lang(){return f(this.hass)}async openFor(C,L){(C!==this._entryId||L!==this._taskId)&&(this._task=null),this._entryId=C,this._taskId=L,this._error="",this._showSkip=!1,this._showReset=!1,this._showPostpone=!1,this._showAdaptive=!1,this._skipReason="",this._postponeDate="",this._resetDate=e1(),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let C=await b(this.hass);this._features={...this._features,...C.features},this._access=C.access,this._currencySymbol=j(C.budget??void 0),G1(C.budget??void 0),this._partsCostMode=C.partsCostMode}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(C,L){this._toast=C,this._toastTimer.schedule(()=>{this._toast=""},L)}async _loadTask(){let C=this._entryId,L=this._taskId;if(!C||!L)return;let M=++this._loadSeq,t="",e=await F(this,{type:"maintenance_supporter/object",entry_id:C},{onError:A=>{t=A}});if(M!==this._loadSeq)return;if(e===void 0){this._error=t;return}this._objectName=e?.object?.name||"";let o=(e?.tasks||[]).find(A=>A.id===L);this._task=o??null,this._taskRef=g2(e?.object,o),o||(this._error=r("ws_err_not_found",this._lang))}_runWs(C){return this._error="",F(this,C,{busy:L=>{this._busy=L},onError:L=>{this._error=L}})}_notifyChanged(C){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:C},bubbles:!0,composed:!0}))}_onComplete(C=!1){if(!(!this._entryId||!this._taskId||!this._task)){if(!C&&A1(this._task)){this._onQuickComplete();return}import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-5DRKREXK.js").then(async({openCompleteDialog:L})=>{let M=this._task,t=[];try{t=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}L(S2({entryId:this._entryId,taskId:this._taskId,taskName:M.name,task:M,objects:t,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol,partsCostMode:this._partsCostMode}))&&(this._notifyChanged("complete"),this.close())})}}async _onQuickComplete(){let C=this._entryId,L=this._task;this._busy=!0;try{let M=await M2(this.hass,C,L.id,this._lang);if(M.result==="dialog"){this._onComplete(!0);return}if(M.result==="failed"){this._error=M.message;return}if(M.result==="already"){this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:M.message},bubbles:!0,composed:!0})),this.close();return}this._notifyChanged("complete"),M.undo&&a1(this,this.hass,{entryId:C,taskId:L.id,taskName:L.name},this._lang,()=>{}),this.close()}finally{this._busy=!1}}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})!==void 0&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})!==void 0&&(this._notifyChanged("reset"),this.close())}async _onPostponeConfirm(){if(!this._entryId||!this._taskId||!this._postponeDate)return;await this._runWs({type:"maintenance_supporter/task/postpone",entry_id:this._entryId,task_id:this._taskId,until:this._postponeDate})!==void 0&&(this._notifyChanged("postpone"),this.close())}async _onSnooze(){if(!this._entryId||!this._taskId)return;let C=await this._runWs({type:"maintenance_supporter/task/snooze",entry_id:this._entryId,task_id:this._taskId});C!==void 0&&(this._notifyChanged("snooze"),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:u2(C,this._lang)},bubbles:!0,composed:!0})),this.close())}_onEdit(){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-5DRKREXK.js").then(({openEditTaskDialog:C})=>{C(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-5DRKREXK.js").then(({openQrDialog:C})=>{C({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let C=await E2(m2(this.hass),this._task,this._lang);if(!C)return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId,...C})!==void 0&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let C=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",C),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})!==void 0&&(this._showToast(r("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!this._entryId||!this._taskId)return;let C=await this._runWs({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});C!==void 0&&(this._showToast(C?.recommended_interval?`${r("reanalyze_result",this._lang)}: ${Y1(C.recommended_interval,"days",this._lang)} (${C.data_points} ${r("data_points",this._lang)})`:r("reanalyze_insufficient_data",this._lang)),await this._loadTask())}_onEditHistoryEntry(C){if(!this._entryId||!this._taskId)return;let L=b1(this._entryId,this._taskId,C,this._task);import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-5DRKREXK.js").then(({openHistoryEditDialog:M})=>M(L))}_renderRecommendation(C){if(!this._features.adaptive||!C.suggested_interval||C.suggested_interval===C.interval_days)return a;let L=this._lang;return i`
      <div class="recommendation-card">
        <h4>${r("suggested_interval",L)}</h4>
        ${W2(C.interval_days,C.suggested_interval,C.interval_confidence||"medium",L)}
        <div class="recommendation-actions">
          ${G(this.hass?.user,this._access)?i`<button class="btn primary qa-apply-suggestion"
                @click=${this._applySuggestion} ?disabled=${this._busy}>
                <ha-icon icon="mdi:check"></ha-icon>
                ${r("apply_suggestion",L)}
              </button>`:a}
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${r("reanalyze",L)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(C){let L=this._lang,M=this._features.adaptive&&C.suggested_interval&&C.suggested_interval!==C.interval_days,t=C.degradation_trend!=null&&C.degradation_trend!=="insufficient_data"||C.days_until_threshold!=null||C.environmental_factor!=null&&C.environmental_factor!==1,e=this._features.adaptive&&C.interval_analysis?.weibull_beta!=null&&C.interval_analysis?.weibull_eta!=null,o=this._features.seasonal&&C.seasonal_factor&&C.seasonal_factor!==1;return!M&&!t&&!e&&!o?i`<div class="adaptive-empty">
        ${r("adaptive_no_data",L)}
      </div>`:i`
      <div class="adaptive-stack">
        ${this._toast?i`<div class="toast">${this._toast}</div>`:a}
        ${M?this._renderRecommendation(C):a}
        ${t?I2(C,L,this._features):a}
        ${e?$2(C,L):a}
        ${o?i`
          ${Q2(C,L,this._features)}
          ${C.seasonal_factors?.length===12||C.interval_analysis?.seasonal_factors?.length===12?U2(C,L):a}
        `:a}
      </div>
    `}_renderDetails(C){let L=this._lang,M=C.history||[],t=C.history_count??M.length,e=_1(M).slice(0,20);return i`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${r("times_performed",L)}</span>
            <span class="stat-value">${C.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${r("total_cost",L)}</span>
            <span class="stat-value">${W(C.total_cost??0,this._currencySymbol,L)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${r("avg_duration",L)}</span>
            <span class="stat-value">${o1(C.average_duration!=null?Math.round(C.average_duration):null,L)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${r("history",L)}</strong>
          <span class="history-count">${t}</span>
        </div>
        ${M.length===0?i`<div class="history-empty">${r("history_empty",L)}</div>`:i`
              <div class="history-list">
                ${e.map(o=>w1(o,{lang:L,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:G(this.hass?.user,this._access)?A=>this._onEditHistoryEntry(A):void 0,readingUnit:C.reading_unit,readingSlotDelta:(A,d)=>o2(M,A,d),taskRef:this._taskRef,triggerUnit:d2(this.hass,C)||null,stateRule:p2(C)},{compact:!0}))}
                ${t>e.length?i`<div class="history-more">… +${t-e.length} ${r("older_entries",L)}</div>`:a}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return a;let C=this._lang,L=this._task,M=G(this.hass?.user,this._access),t=!!L&&$1(L);return z(()=>this.close(),i`
        ${L?i`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${Z1(L)}"></span>
                  ${U()?a:i`<span class="task-name">${L.name}</span>`}
                  ${D2(L,C)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-5DRKREXK.js").then(({openObjectQuickActions:e})=>{e(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${L.next_due?i`<span><strong>${r("next_due",C)}:</strong> ${T(L.next_due,C)}</span>`:a}
                  ${L.last_performed?i`<span><strong>${r("last_performed",C)}:</strong> ${T(L.last_performed,C)}</span>`:a}
                  ${L.schedule?.kind&&!["manual","one_time"].includes(L.schedule.kind)||L.interval_days!=null?i`<span><strong>${r("interval",C)}:</strong> ${J1(L,C)}</span>`:a}
                  ${J(L)?i`<span><strong>${r("phase_current",C)}:</strong> ${J(L)}</span>`:a}
                </div>
                ${L.notes?i`<div class="notes-body">${v1(L.notes)}</div>`:a}
              </div>

              ${this._error?R("error",this._error):a}

              ${this._showSkip?i`
                    <div class="inline-form">
                      <ms-textfield label=${r("skip_reason",C)} .value=${this._skipReason}
                        @input=${e=>{this._skipReason=e.target.value}}></ms-textfield>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${r("cancel",C)}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${r("skip",C)}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?i`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${r("reset_to_date",C)}
                        .hass=${this.hass}
                        .lang=${C}
                        .value=${this._resetDate}
                        @value-changed=${e=>{this._resetDate=e.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${r("cancel",C)}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${r("reset",C)}
                        </button>
                      </div>
                    </div>
                  `:this._showPostpone?i`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${r("postpone_date_prompt",C)}
                        .hass=${this.hass}
                        .lang=${C}
                        .value=${this._postponeDate}
                        @value-changed=${e=>{this._postponeDate=e.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showPostpone=!1}} ?disabled=${this._busy}>
                          ${r("cancel",C)}
                        </button>
                        <button class="btn primary qa-postpone-confirm" @click=${this._onPostponeConfirm}
                          ?disabled=${this._busy||!this._postponeDate}>
                          ${r("postpone",C)}
                        </button>
                      </div>
                    </div>
                  `:i`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${()=>this._onComplete()} .disabled=${this._busy}
                        title=${A1(L)?r("qr_action_quick_complete",C):r("complete",C)}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${r("complete",C)}
                      </ha-button>
                      ${A1(L)?i`<ha-button appearance="outlined" variant="success" class="qa-complete-details" @click=${()=>this._onComplete(!0)} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:text-box-edit-outline"></ha-icon>
                            ${r("complete_with_details",C)}
                          </ha-button>`:a}
                      ${L.allow_skip!==!1?i`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${r("skip",C)}
                            </ha-button>
                          `:a}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${r("reset",C)}
                      </ha-button>
                    </div>
                    <!-- QR is read tier (the panel offers it to operators too);
                         Edit / Archive / Delete follow canWrite() — the panel's
                         operator delegation, not is_admin alone. -->
                    <div class="actions secondary-row">
                      ${M?i`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-edit" @click=${this._onEdit} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                            ${r("edit",C)}
                          </ha-button>`:a}
                      <ha-button size="small" appearance="outlined" variant="neutral" class="qa-qr" @click=${this._onQr} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                        ${r("qr_code",C)}
                      </ha-button>
                      ${t?a:i`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-postpone"
                            @click=${()=>{this._showPostpone=!0}} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:calendar-arrow-right"></ha-icon>
                            ${r("postpone",C)}…
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="neutral" class="qa-snooze" @click=${this._onSnooze} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:bell-sleep-outline"></ha-icon>
                            ${r("snooze",C)}
                          </ha-button>`}
                      ${M?i`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-archive"
                            @click=${L.archived?this._onUnarchive:this._onArchive}
                            .disabled=${this._busy}>
                            <ha-icon slot="start" icon="${L.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                            ${L.archived?r("unarchive",C):r("archive",C)}
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="danger" class="danger qa-delete" @click=${this._onDelete} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                            ${r("delete",C)}
                          </ha-button>`:a}
                    </div>
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?r("hide_details",C):r("show_details",C)}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?i`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?r("hide_stats",C):r("show_stats",C)}
                          </button>`:a}
                    </div>
                    ${this._showDetails?this._renderDetails(L):a}
                    ${this._showAdaptive?this._renderAdaptive(L):a}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${r("open_in_panel",C)}
                      </button>
                    </div>
                  `}
            `:this._error?R("error",this._error):i`<div class="loading">${r("loading",C)}</div>`}
    `,{title:L?.name})}updated(C){C.has("_open")&&this._open&&q(this.shadowRoot)}};v.styles=[H2,Q,P`
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
  `],p([y({attribute:!1})],v.prototype,"hass",2),p([n()],v.prototype,"_open",2),p([n()],v.prototype,"_entryId",2),p([n()],v.prototype,"_taskId",2),p([n()],v.prototype,"_task",2),p([n()],v.prototype,"_objectName",2),p([n()],v.prototype,"_taskRef",2),p([n()],v.prototype,"_busy",2),p([n()],v.prototype,"_error",2),p([n()],v.prototype,"_showSkip",2),p([n()],v.prototype,"_showReset",2),p([n()],v.prototype,"_showPostpone",2),p([n()],v.prototype,"_showDetails",2),p([n()],v.prototype,"_showAdaptive",2),p([n()],v.prototype,"_skipReason",2),p([n()],v.prototype,"_resetDate",2),p([n()],v.prototype,"_postponeDate",2),p([n()],v.prototype,"_features",2),p([n()],v.prototype,"_toast",2),p([n()],v.prototype,"_access",2),p([n()],v.prototype,"_partsCostMode",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",v);function z2(H){if(H.key!=="Enter"&&H.key!==" ")return;let C=H.target?.closest?.('[role="menuitem"], [role="button"]');!C||C.getAttribute("aria-disabled")==="true"||(H.preventDefault(),C.click())}var h=class extends B{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=n1;this._loadSeq=0}get _lang(){return f(this.hass)}async openFor(C){C!==this._entryId&&(this._data=null),this._entryId=C,this._error="",this._open=!0,await Promise.all([this._load(),b(this.hass).then(L=>{this._access=L.access})])}close(){this._loadSeq++,this._open=!1,this._data=null,this._error=""}async _load(){let C=this._entryId;if(!C)return;let L=++this._loadSeq,M="",t=await F(this,{type:"maintenance_supporter/object",entry_id:C},{onError:e=>{M=e}});L===this._loadSeq&&(t===void 0?this._error=M:this._data=t)}_runWs(C){return this._error="",F(this,C,{busy:L=>{this._busy=L},onError:L=>{this._error=L}})}_onEditObject(){!this._entryId||!this._data||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-5DRKREXK.js").then(({openEditObjectDialog:C})=>{C(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-5DRKREXK.js").then(({openCreateTaskDialog:C})=>{C(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await Y(this.hass,{title:r("delete",this._lang),message:r("delete_object_confirm",this._lang),confirmText:r("delete",this._lang),danger:!0}))return;let L=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:L})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:L},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let C=!!this._data.object.archived;if(!C&&!await Y(this.hass,{title:r("archive_object",this._lang),message:r("confirm_archive_object",this._lang),confirmText:r("archive_object",this._lang)}))return;let L=this._entryId;await this._runWs({type:C?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:L})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:L},bubbles:!0,composed:!0})),this.close())}_onTaskClick(C){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-5DRKREXK.js").then(({openTaskQuickActions:L})=>{L(this._entryId,C)})}render(){if(!this._open)return a;let C=this._lang,L=this._data,M=L?.object,t=L?.tasks||[],e=G(this.hass?.user,this._access);return z(()=>this.close(),i`
        ${L&&M?i`
              <div class="header">
                ${U()?a:i`<div class="title">${M.name}</div>`}
                ${this._renderMetaRow(M)}
              </div>

              ${this._error?R("error",this._error):a}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${r("tasks",C)}</strong>
                  <span class="count">${t.length}</span>
                </div>
                ${t.length===0?i`<div class="empty">${r("no_tasks",C)}</div>`:i`
                      <div class="task-list">
                        ${t.map(o=>i`
                          <div class="task-row" role="button" tabindex="0" @click=${()=>this._onTaskClick(o.id)} @keydown=${z2}>
                            <span class="status-dot" style="background: ${Z1(o)}"></span>
                            <span class="task-name">${o.name}</span>
                            <span class="task-status ${C1(o)}">${B1(C1(o),C)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${M.notes?i`
                    <div class="notes-section">
                      <strong>${r("object_notes_label",C)}</strong>
                      <div class="notes-body">${v1(M.notes)}</div>
                    </div>
                  `:a}

              ${e?i`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${r("add_task",C)}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${r("edit",C)}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${M.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${M.archived?r("unarchive_object",C):r("archive_object",C)}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${r("delete",C)}
                      </button>
                    </div>
                  `:a}
            `:this._error?R("error",this._error):i`<div class="loading">${r("loading",C)}</div>`}
    `,{title:M?.name})}updated(C){C.has("_open")&&this._open&&q(this.shadowRoot)}_renderMetaRow(C){let L=this._lang,M=[];return C.area_id&&M.push([r("area",L),A2(C.area_id,this.hass?.areas,r("no_area",L))]),C.manufacturer&&M.push([r("manufacturer",L),C.manufacturer]),C.model&&M.push([r("model",L),C.model]),C.serial_number&&M.push([r("serial_number_label",L),C.serial_number]),C.installation_date&&M.push([r("installed",L),T(C.installation_date,L)]),C.warranty_expiry&&M.push([r("warranty",L),T(C.warranty_expiry,L)]),C.documentation_url&&M.push([r("documentation_url_label",L),C.documentation_url,m1(C.documentation_url)]),M.length===0?a:i`
      <div class="meta">
        ${M.map(([t,e,o])=>i`
            <div class="meta-item">
              <span class="meta-label">${t}</span>
              <span class="meta-value">${o||h2(e)?i`<a href="${e}" target="_blank" rel="noopener noreferrer">${e}</a>`:e}</span>
            </div>
          `)}
      </div>
    `}};h.styles=[Q,P`
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
  `],p([y({attribute:!1})],h.prototype,"hass",2),p([n()],h.prototype,"_open",2),p([n()],h.prototype,"_entryId",2),p([n()],h.prototype,"_data",2),p([n()],h.prototype,"_busy",2),p([n()],h.prototype,"_error",2),p([n()],h.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",h);var q2="maintenance-object-dialog",K2="maintenance-task-dialog",b5="maintenance-history-edit-dialog",_5="maintenance-complete-dialog",w5="maintenance-qr-dialog",P5="maintenance-task-quick-actions-dialog",B5="maintenance-object-quick-actions-dialog";function K(){return document.querySelector("home-assistant")?.hass}function T5(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function _(H){let V=T5(),C=V.querySelector(H)??document.body.querySelector(H);return C?C.parentNode!==V&&V.appendChild(C):(C=document.createElement(H),V.appendChild(C)),C}function w(H){let V=K();if(!V)return!1;H.hass=V;let C=f(V);return I1(C)||W1(C).then(()=>{H.requestUpdate?.()}),Q1(V.locale,V.config?.country,V.config?.time_zone),!0}function N7(H){return b(H).then(V=>V.rowActionStyle)}function G7(){x2()}function Q7(){let H=_(q2);return w(H)?(H.openCreate(),j2(H),!0):!1}async function j2(H){let V=K();V&&(H.placesEnabled=(await b(V)).features.places)}function U7(H,V){let C=_(q2);return w(C)?(C.openEdit(H,V),j2(C),!0):!1}function z7(H="",V){let C=_(K2);if(!w(C))return!1;let L=K();return L?((async()=>{let M=await b(L),t=C;X2(t,M),t.openCreate(H,V)})(),!0):!1}function X2(H,V){H.checklistsEnabled=V.features.checklists,H.scheduleTimeEnabled=V.features.schedule_time,H.completionActionsEnabled=V.features.completion_actions,H.adaptiveFeature=V.features.adaptive,H.seasonalFeature=V.features.seasonal,H.environmentalFeature=V.features.environmental,H.defaultWarningDays=V.defaultWarningDays,H.mirrorTodoDefault=V.mirrorTodoDefault,H.betaEditor=V.features.beta_editor}function q7(H,V){let C=_(K2);if(!w(C))return!1;let L=K();return L?((async()=>{try{let[M,t]=await Promise.all([L.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:H}),b(L)]),e=(M.tasks||[]).find(A=>A.id===V);if(!e){console.warn(`openEditTaskDialog: task ${V} not found in entry ${H}`);return}let o=C;X2(o,t),await o.openEdit(H,e)}catch(M){console.warn("openEditTaskDialog: failed to load task/features",M)}})(),!0):!1}function K7(H){let V=_(b5);return w(V)?(V.openEdit(H),!0):!1}function j7(H){let V=_(_5);if(!w(V))return!1;let C=V;return C.__msUndoWired||(C.__msUndoWired=!0,V.addEventListener("task-completed",L=>{let M=L.detail,t=K();M?.undo&&t&&a1(V,t,M,f(t),()=>{})})),c2(V,H,f(K())),!0}function X7(H){let V=_(w5);return w(V)?(V.openForTask(H.entry_id,H.task_id,H.object_name,H.task_name),!0):!1}function Y7(H,V){let C=_(P5);return w(C)?(C.openFor(H,V),!0):!1}function J7(H){let V=_(B5);return w(V)?(V.openFor(H),!0):!1}export{m1 as a,h2 as b,A5 as c,g2 as d,k3 as e,k2 as f,U3 as g,z3 as h,q3 as i,K3 as j,j3 as k,P1 as l,X3 as m,Y3 as n,J3 as o,C0 as p,H0 as q,V0 as r,L0 as s,E2 as t,v1 as u,s3 as v,L5 as w,M5 as x,O1 as y,S2 as z,c2 as A,z2 as B,m as C,n0 as D,u5 as E,m0 as F,l0 as G,v0 as H,S5 as I,x0 as J,c5 as K,Z0 as L,b1 as M,O3 as N,u2 as O,y2 as P,_1 as Q,N3 as R,G3 as S,w1 as T,C1 as U,B1 as V,D2 as W,$2 as X,I2 as Y,W2 as Z,Q2 as _,U2 as $,N7 as aa,G7 as ba,Q7 as ca,U7 as da,z7 as ea,q7 as fa,K7 as ga,j7 as ha,X7 as ia,Y7 as ja,J7 as ka};
