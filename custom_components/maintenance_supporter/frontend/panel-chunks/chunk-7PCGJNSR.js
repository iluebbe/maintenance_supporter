/*! maintenance_supporter frontend 2.65.0 */
import{a as _,e as k}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-UBKG7VLY.js";import{a as g}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-Z6JBBYEY.js";import{B as m,a as s,b,c as a,f as d,g as v,k as n,l,p as r}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-O6LFYSTY.js";var i=class extends v{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.restockDefault=null;this.restockUnitCost=null;this.currencySymbol="";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photoDocId="";this._photoPreview="";this._photoUploading=!1;this._readingValue="";this._restockQty="";this._completedAt="";this._usedParts={};this.checklistPrefill={}}open(){this._open||(this._open=!0,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((e,t)=>[String(t),!!this.checklistPrefill[e]]).filter(([,e])=>e)),this._feedback="needed",this._photoDocId="",this._photoPreview="",this._photoUploading=!1,this._readingValue="",this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(e=>[_(e),{...e}])))}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _onPhotoInput(e){let t=e.target,o=t.files?.[0];if(t.value="",!!o){this._photoUploading=!0,this._error="";try{let c=new FormData;c.append("entry_id",this.entryId),c.append("tags","photo"),c.append("file",o,o.name);let p=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${this.hass.auth?.data?.access_token??""}`},body:c});if(!p.ok){this._error=p.status===413?r("doc_too_large",this.lang):r("doc_upload_failed",this.lang);return}let u=await p.json();u.id&&(this._photoDocId=u.id,this._photoPreview=URL.createObjectURL(o))}catch{this._error=r("doc_upload_failed",this.lang)}finally{this._photoUploading=!1}}}_removePhoto(){this._photoPreview&&URL.revokeObjectURL(this._photoPreview),this._photoDocId="",this._photoPreview=""}async _complete(){this._loading=!0,this._error="";try{let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(e.notes=this._notes),this._cost){let t=parseFloat(this._cost);!isNaN(t)&&t>=0&&(e.cost=t)}if(this._duration){let t=parseInt(this._duration,10);!isNaN(t)&&t>=0&&(e.duration=t)}if(this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photoDocId&&(e.photo_doc_id=this._photoDocId),this._completedAt){if(new Date(this._completedAt).getTime()>Date.now()){this._error=r("completed_at_future_error",this.lang),this._loading=!1;return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this._readingValue!==""){let t=parseFloat(this._readingValue);isNaN(t)||(e.reading_value=t)}if(this.restockDefault!==null&&this._restockQty!==""){let t=parseFloat(this._restockQty);!isNaN(t)&&t>=1&&(e.restock_quantity=t)}this.parts.length>0&&(e.used_parts=Object.values(this._usedParts).filter(t=>Number.isFinite(t.quantity)&&t.quantity>0).map(t=>t.entry_id?{part_id:t.part_id,quantity:t.quantity,entry_id:t.entry_id}:{part_id:t.part_id,quantity:t.quantity})),await this.hass.connection.sendMessagePromise(e),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(e){this._error=g(e,this.lang,r("save_error",this.lang))}finally{this._loading=!1}}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photoDocId!=="",user:!!this.hass?.user};return this.requiredFields.filter(t=>!e[t])}_req(e){return this.requiredFields.includes(e)?a`<span class="req-mark" aria-hidden="true">*</span>`:d}_partsCostSuggestion(){if(this.restockDefault!==null){let o=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(o)||o<=0?null:Math.round(this.restockUnitCost*o*100)/100}if(!this.parts.length)return null;let e=0,t=!1;for(let o of Object.values(this._usedParts)){let c=this.parts.find(p=>_({part_id:p.id,entry_id:p.entry_id})===_(o));c?.cost!=null&&(e+=c.cost*(o.quantity||1),t=!0)}return t?Math.round(e*100)/100:null}_renderCostSuggestion(e){if(this._cost.trim()!=="")return d;let t=this._partsCostSuggestion();if(t==null||t<=0)return d;let o=`${t.toFixed(2)}${this.currencySymbol?` ${this.currencySymbol}`:""}`;return a`<button
      type="button"
      class="cost-suggestion"
      @click=${()=>this._cost=t.toFixed(2)}
    >${r("cost_from_parts",e).replace("{amount}",o)}</button>`}_close(){this._open=!1}render(){if(!this._open)return a``;let e=this.lang||this.hass?.language||"en";return a`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${r("complete_title",e)}${this.taskName}</div>
        ${this.phaseLabel?a`<div class="phase-line">${r("phase_current",e)}: ${this.phaseLabel}</div>`:d}
        <div class="content">
          ${this._error?a`<div class="error">${this._error}</div>`:d}
          ${this.checklist.length>0?a`
            <div class="checklist-section">
              <label class="checklist-label">${r("checklist",e)}</label>
              ${this.checklist.map((t,o)=>a`
                <label class="checklist-item" @click=${()=>this._toggleCheck(o)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(o)]} />
                  <span>${t}</span>
                </label>
              `)}
            </div>
          `:d}
          ${this.taskType==="reading"?a`
              <label class="field">
                <span class="field-label">${r("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${t=>this._readingValue=t.target.value} />
              </label>`:d}
          ${this.parts.length?a`<div class="used-parts">
                <span class="field-label">${r("complete_parts_used",e)}</span>
                ${this.parts.map(t=>{let o=_({part_id:t.id,entry_id:t.entry_id}),c=this._usedParts[o],p=c!==void 0,u=t.entry_id?{part_id:t.id,quantity:1,entry_id:t.entry_id}:{part_id:t.id,quantity:1};return a`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${p}
                        @change=${f=>{let h={...this._usedParts};f.target.checked?h[o]=h[o]||u:delete h[o],this._usedParts=h}} />
                      <span
                        >${t.name}${t.owner_name?a`<span class="used-part-owner"> (${t.owner_name})</span>`:d}${t.stock!==null&&t.stock!==void 0?` (${t.stock}${t.unit?" "+t.unit:""})`:""}</span
                      >
                    </label>
                    ${p?a`<input class="used-part-qty" type="number" min="0.01" max="999" step="0.01"
                          .value=${String(c.quantity)}
                          @input=${f=>{let h=parseFloat(f.target.value);this._usedParts={...this._usedParts,[o]:{...u,quantity:Number.isFinite(h)&&h>=.01?h:1}}}} />`:d}
                  </div>`})}
              </div>`:this.consumesInfo.length?a`<div class="consumes-hint">
                  ${this.consumesInfo.map(t=>a`<div>${t}</div>`)}
                </div>`:d}
          ${this.restockDefault!==null?a`
              <label class="field">
                <span class="field-label">${r("restock_quantity_label",e)}</span>
                <input type="number" step="0.01" min="0.01" class="field-input"
                  .value=${this._restockQty}
                  @input=${t=>this._restockQty=t.target.value} />
              </label>`:d}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${r("notes_optional",e)}${this._req("notes")}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${t=>this._notes=t.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${r("cost_optional",e)}${this._req("cost")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${t=>this._cost=t.target.value} />
            ${this._renderCostSuggestion(e)}
          </label>
          <label class="field">
            <span class="field-label">${r("duration_minutes",e)}${this._req("duration")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._duration}
              @input=${t=>this._duration=t.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${r("completed_at_optional",e)}</span>
            <input type="datetime-local" class="field-input"
              max=${new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,16)}
              .value=${this._completedAt}
              @change=${t=>this._completedAt=t.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${r("completion_photo_optional",e)}${this._req("photo")}</span>
            ${this._photoPreview?a`
                <div class="photo-preview">
                  <img src=${this._photoPreview} alt="" />
                  <button type="button" class="photo-remove" @click=${this._removePhoto}
                    title="${r("remove",e)}">✕</button>
                </div>`:a`
                <label class="photo-pick">
                  <ha-icon icon="mdi:camera"></ha-icon>
                  <span>${this._photoUploading?r("uploading",e):r("add_photo",e)}</span>
                  <input type="file" accept="image/*" capture="environment"
                    ?disabled=${this._photoUploading}
                    @change=${this._onPhotoInput} />
                </label>`}
          </div>
          ${this.adaptiveEnabled?a`
            <div class="feedback-section">
              <label class="feedback-label">${r("was_maintenance_needed",e)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${r("feedback_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${r("feedback_not_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${r("feedback_not_sure",e)}</button>
              </div>
            </div>
          `:d}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${r("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._missingRequired.length>0}
            title=${this._missingRequired.length?this._missingRequired.map(t=>r("err_required",e).replace("{field}",r(k[t]??t,e))).join(" \xB7 "):""}
          >
            ${this._loading?r("completing",e):r("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};i.styles=[m,b`
    .req-mark {
      color: var(--error-color, #f44336);
      margin-left: 2px;
      font-weight: 600;
    }
    /* #104: one-click cost suggestion from parts — quiet link-style chip. */
    .cost-suggestion {
      align-self: flex-start;
      margin-top: 4px;
      padding: 0;
      border: none;
      background: none;
      color: var(--primary-color);
      font-size: 12.5px;
      cursor: pointer;
      text-decoration: underline dotted;
      text-underline-offset: 2px;
    }
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    .phase-line {
      margin-top: -8px;
      padding-bottom: 12px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    .consumes-hint {
      font-size: 13px;
      color: var(--secondary-text-color);
      border-left: 3px solid var(--primary-color);
      padding: 4px 8px;
      margin: 4px 0 8px;
    }
    /* #99: editable per-completion parts selection */
    .used-parts { margin: 4px 0 8px; display: flex; flex-direction: column; gap: 4px; }
    .used-part-row { display: flex; align-items: center; gap: 8px; }
    .used-part-check {
      display: flex; align-items: center; gap: 6px; flex: 1;
      font-size: 13px; cursor: pointer;
    }
    .used-part-check input { cursor: pointer; }
    /* #111: whose stock this row draws on. Muted but never omitted — an
       unlabelled foreign pool is indistinguishable from an own part. */
    .used-part-owner { color: var(--secondary-text-color); }
    .used-part-qty {
      width: 76px; padding: 4px 6px; border-radius: 4px; font: inherit; font-size: 13px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    /* .field/.field-label/.field-input come from nativeFieldStyles */
    .photo-pick {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px dashed var(--divider-color);
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      color: var(--secondary-text-color);
      width: fit-content;
    }
    .photo-pick:hover { border-color: var(--primary-color); }
    .photo-pick input[type="file"] { display: none; }
    .photo-preview {
      position: relative;
      width: fit-content;
    }
    .photo-preview img {
      max-width: 160px;
      max-height: 160px;
      border-radius: 8px;
      display: block;
    }
    .photo-remove {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: none;
      background: var(--error-color, #db4437);
      color: #fff;
      cursor: pointer;
      font-size: 12px;
      line-height: 1;
    }
    .checklist-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color);
      margin-bottom: 4px;
    }
    .checklist-label {
      font-weight: 500;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .checklist-item {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 4px 0;
      font-size: 14px;
    }
    .checklist-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
    .feedback-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
      border-top: 1px solid var(--divider-color);
    }
    .feedback-label {
      font-weight: 500;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .feedback-buttons {
      display: flex;
      gap: 8px;
    }
    .feedback-btn {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 13px;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s;
    }
    .feedback-btn:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .feedback-btn.selected {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color);
    }
  `],s([n({attribute:!1})],i.prototype,"hass",2),s([n()],i.prototype,"entryId",2),s([n()],i.prototype,"taskId",2),s([n()],i.prototype,"taskName",2),s([n()],i.prototype,"lang",2),s([n({type:Array})],i.prototype,"checklist",2),s([n({type:Boolean})],i.prototype,"adaptiveEnabled",2),s([n()],i.prototype,"taskType",2),s([n()],i.prototype,"readingUnit",2),s([n({attribute:!1})],i.prototype,"restockDefault",2),s([n({attribute:!1})],i.prototype,"restockUnitCost",2),s([n()],i.prototype,"currencySymbol",2),s([n({attribute:!1})],i.prototype,"parts",2),s([n({attribute:!1})],i.prototype,"consumesParts",2),s([n({type:Array})],i.prototype,"consumesInfo",2),s([n({type:Array})],i.prototype,"requiredFields",2),s([n()],i.prototype,"phaseLabel",2),s([l()],i.prototype,"_open",2),s([l()],i.prototype,"_notes",2),s([l()],i.prototype,"_cost",2),s([l()],i.prototype,"_duration",2),s([l()],i.prototype,"_loading",2),s([l()],i.prototype,"_error",2),s([l()],i.prototype,"_checklistState",2),s([l()],i.prototype,"_feedback",2),s([l()],i.prototype,"_photoDocId",2),s([l()],i.prototype,"_photoPreview",2),s([l()],i.prototype,"_photoUploading",2),s([l()],i.prototype,"_readingValue",2),s([l()],i.prototype,"_restockQty",2),s([l()],i.prototype,"_completedAt",2),s([l()],i.prototype,"_usedParts",2),s([n({attribute:!1})],i.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",i);export{i as a};
