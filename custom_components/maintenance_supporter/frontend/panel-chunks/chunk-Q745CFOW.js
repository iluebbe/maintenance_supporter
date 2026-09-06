/*! maintenance_supporter frontend 2.76.0 */
import{a as b,g as E,l as I}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-RRHOSWGJ.js";import{a as S}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-N3OZNN4T.js";import{K as P,a as r,b as y,c as o,f as c,h as x,l as n,m as p,q as a,w as $,x as w}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-I6XHJXEZ.js";function A(_){if(!_)return[];let g=[],e=_.photo_doc_id;typeof e=="string"&&g.push(e);let t=_.photo_doc_ids;Array.isArray(t)&&g.push(...t);let i=[];for(let l of g){if(typeof l!="string")continue;let d=l.trim();if(!(!d||i.includes(d))&&(i.push(d),i.length>=10))break}return i}async function q(_,g,e){let t=new FormData;t.append("entry_id",g),t.append("tags","photo"),t.append("file",e,e.name);let i=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${_.auth?.data?.access_token??""}`},body:t});if(i.status===413)throw new Error("doc_too_large");if(!i.ok)throw new Error("doc_upload_failed");let l=await i.json();if(!l.id)throw new Error("doc_upload_failed");return l.id}async function v(_,g){await Promise.all(g.map(e=>_.connection.sendMessagePromise({type:"maintenance_supporter/documents/delete",doc_id:e}).catch(()=>{})))}var s=class extends x{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.currencySymbol="";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=[];this._uploadedIds=[];this._photoUploading=!1;this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this.checklistPrefill={}}open(e={}){this._open||(this._open=!0,this.viaTagScan=!!e.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((t,i)=>[String(i),!!this.checklistPrefill[t]]).filter(([,t])=>t)),this._feedback="needed",this._photos.forEach(t=>URL.revokeObjectURL(t.preview)),this._photos=[],this._uploadedIds=[],this._photoUploading=!1,this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(t=>[b(t),{...t}])))}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _onPhotoInput(e){let t=e.target,i=Array.from(t.files??[]);if(t.value="",i.length===0)return;let l=10-this._photos.length,d=i.slice(0,Math.max(l,0));this._photoUploading=!0,this._error="";try{for(let h of d){let u=await q(this.hass,this.entryId,h);this._uploadedIds=[...this._uploadedIds,u],this._photos=[...this._photos,{id:u,preview:URL.createObjectURL(h)}]}i.length>d.length&&(this._error=a("photos_limit",this.lang).replace("{max}",String(10)))}catch(h){let u=h instanceof Error&&h.message==="doc_too_large"?"doc_too_large":"doc_upload_failed";this._error=a(u,this.lang)}finally{this._photoUploading=!1}}_removePhoto(e){let t=this._photos.find(i=>i.id===e);t&&URL.revokeObjectURL(t.preview),this._photos=this._photos.filter(i=>i.id!==e),this._uploadedIds.includes(e)&&(this._uploadedIds=this._uploadedIds.filter(i=>i!==e),v(this.hass,[e]))}async _complete(){this._loading=!0,this._error="";try{let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(e.notes=this._notes),this._cost){let t=parseFloat(this._cost);!isNaN(t)&&t>=0&&(e.cost=t)}if(this._duration){let t=parseInt(this._duration,10);!isNaN(t)&&t>=0&&(e.duration=t)}if(this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photos.length>0&&(e.photo_doc_ids=this._photos.map(t=>t.id)),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(new Date(this._completedAt).getTime()>Date.now()){this._error=a("completed_at_future_error",this.lang),this._loading=!1;return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let t={};for(let i of this.readings){let l=(this._readingValues[i.id]??"").trim();if(l==="")continue;let d=parseFloat(l.replace(",","."));isNaN(d)||(t[i.id]=d)}Object.keys(t).length>0&&(e.reading_values=t)}else if(this._readingValue!==""){let t=parseFloat(this._readingValue);isNaN(t)||(e.reading_value=t)}if(this.restockDefault!==null&&this._restockQty!==""){let t=parseFloat(this._restockQty);!isNaN(t)&&t>=1&&(e.restock_quantity=t)}this.parts.length>0&&(e.used_parts=Object.values(this._usedParts).filter(t=>Number.isFinite(t.quantity)&&t.quantity>0).map(t=>t.entry_id?{part_id:t.part_id,quantity:t.quantity,entry_id:t.entry_id}:{part_id:t.part_id,quantity:t.quantity})),await this.hass.connection.sendMessagePromise(e),this._uploadedIds=[],this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(e){this._error=S(e,this.lang,a("save_error",this.lang))}finally{this._loading=!1}}_renderReadingField(e,t){let i=this._completedAt?new Date(this._completedAt).getTime():NaN,l=E(this.readingHistory,e.id,isNaN(i)?void 0:i),d=e.unit||this.readingUnit,h=(this._readingValues[e.id]??"").trim(),u=h===""?NaN:parseFloat(h.replace(",",".")),f=l!==void 0&&!isNaN(u)&&u<l.value,k=l!==void 0?$(l.value,t,{maximumFractionDigits:3}):"";return o`
      <label class="field reading-field">
        <span class="field-label">${e.name}${d?` (${d})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${l!==void 0?a("reading_last",t).replace("{value}",k):""}
          .value=${this._readingValues[e.id]??""}
          @input=${T=>{this._readingValues={...this._readingValues,[e.id]:T.target.value}}} />
        ${f?o`<span class="reading-warn">${a("reading_below_last",t).replace("{value}",k)}</span>`:c}
      </label>`}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(t=>!e[t])}_req(e){return this.requiredFields.includes(e)?o`<span class="req-mark" aria-hidden="true">*</span>`:c}_partsCostSuggestion(){if(this.restockDefault!==null){let i=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(i)||i<=0?null:Math.round(this.restockUnitCost*i*100)/100}if(!this.parts.length)return null;let e=0,t=!1;for(let i of Object.values(this._usedParts)){let l=this.parts.find(d=>b({part_id:d.id,entry_id:d.entry_id})===b(i));l?.cost!=null&&(e+=l.cost*(i.quantity||1),t=!0)}return t?Math.round(e*100)/100:null}_renderCostSuggestion(e){if(this._cost.trim()!=="")return c;let t=this._partsCostSuggestion();if(t==null||t<=0)return c;let i=w(t,this.currencySymbol,e);return o`<button
      type="button"
      class="cost-suggestion"
      @click=${()=>this._cost=String(Math.round(t*100)/100)}
    >${a("cost_from_parts",e).replace("{amount}",i)}</button>`}_close(){if(this._open=!1,this._uploadedIds.length>0){let e=this._uploadedIds;this._uploadedIds=[],v(this.hass,e)}}_pickCompletedAt(){let e=new Date,t=i=>String(i).padStart(2,"0");this._completedAt=`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}T${t(e.getHours())}:${t(e.getMinutes())}:00`}render(){if(!this._open)return o``;let e=this.lang||this.hass?.language||"en";return o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${a("complete_title",e)}${this.taskName}</div>
        ${this.phaseLabel?o`<div class="phase-line">${a("phase_current",e)}: ${this.phaseLabel}</div>`:c}
        ${this.requireTagScan&&!this.viaTagScan?o`<div class="scan-required-note">${a("require_tag_scan_hint",e)}</div>`:c}
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:c}
          ${this.checklist.length>0?o`
            <div class="checklist-section">
              <label class="checklist-label">${a("checklist",e)}</label>
              ${this.checklist.map((t,i)=>o`
                <label class="checklist-item" @click=${()=>this._toggleCheck(i)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(i)]} />
                  <span>${t}</span>
                </label>
              `)}
            </div>
          `:c}
          ${this.readings.length>0?o`<div class="readings-block">
                <span class="field-label">${a("readings_section",e)}</span>
                ${this.readings.map(t=>this._renderReadingField(t,e))}
              </div>`:this.taskType==="reading"?o`
              <label class="field">
                <span class="field-label">${a("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${t=>this._readingValue=t.target.value} />
              </label>`:c}
          ${this.parts.length?o`<div class="used-parts">
                <span class="field-label">${a("complete_parts_used",e)}</span>
                ${this.parts.map(t=>{let i=b({part_id:t.id,entry_id:t.entry_id}),l=this._usedParts[i],d=l!==void 0,h=t.entry_id?{part_id:t.id,quantity:1,entry_id:t.entry_id}:{part_id:t.id,quantity:1};return o`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${d}
                        @change=${u=>{let f={...this._usedParts};u.target.checked?f[i]=f[i]||h:delete f[i],this._usedParts=f}} />
                      <span
                        >${t.name}${t.owner_name?o`<span class="used-part-owner"> (${t.owner_name})</span>`:c}${t.stock!==null&&t.stock!==void 0?` (${t.stock}${t.unit?" "+t.unit:""})`:""}</span
                      >
                    </label>
                    ${d?o`<input class="used-part-qty" type="number" min="0.01" max="999" step="0.01"
                          .value=${String(l.quantity)}
                          @input=${u=>{let f=parseFloat(u.target.value);this._usedParts={...this._usedParts,[i]:{...h,quantity:Number.isFinite(f)&&f>=.01?f:1}}}} />`:c}
                  </div>`})}
              </div>`:this.consumesInfo.length?o`<div class="consumes-hint">
                  ${this.consumesInfo.map(t=>o`<div>${t}</div>`)}
                </div>`:c}
          ${this.restockDefault!==null?o`
              <label class="field">
                <span class="field-label">${a("restock_quantity_label",e)}</span>
                <input type="number" step="0.01" min="0.01" class="field-input"
                  .value=${this._restockQty}
                  @input=${t=>this._restockQty=t.target.value} />
              </label>`:c}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${a("notes_optional",e)}${this._req("notes")}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${t=>this._notes=t.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${a("cost_optional",e)}${this._req("cost")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${t=>this._cost=t.target.value} />
            ${this._renderCostSuggestion(e)}
          </label>
          <label class="field">
            <span class="field-label">${a("duration_minutes",e)}${this._req("duration")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._duration}
              @input=${t=>this._duration=t.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${a("completed_at_optional",e)}</span>
            ${this._completedAt?o`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${e}
                  .value=${this._completedAt}
                  @value-changed=${t=>this._completedAt=t.detail.value}
                ></ms-date-field>`:o`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${a("completed_at_pick",e)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${a("completion_photos_optional",e)}${this._req("photo")}</span>
            ${this._photos.length>0?o`<div class="photo-strip">
                  ${this._photos.map(t=>o`
                    <div class="photo-preview">
                      <img src=${t.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._removePhoto(t.id)}
                        title="${a("remove",e)}">✕</button>
                    </div>`)}
                </div>`:c}
            ${this._photos.length<10?o`<div class="photo-pickers">
                  <label class="photo-pick photo-pick-camera">
                    <ha-icon icon="mdi:camera"></ha-icon>
                    <span>${this._photoUploading?a("uploading",e):a("doc_camera",e)}</span>
                    <input type="file" accept="image/*" capture="environment"
                      ?disabled=${this._photoUploading}
                      @change=${this._onPhotoInput} />
                  </label>
                  <label class="photo-pick photo-pick-gallery">
                    <ha-icon icon="mdi:image-multiple"></ha-icon>
                    <span>${a("choose_photos",e)}</span>
                    <input type="file" accept="image/*" multiple
                      ?disabled=${this._photoUploading}
                      @change=${this._onPhotoInput} />
                  </label>
                </div>`:o`<div class="photo-limit">${a("photos_limit",e).replace("{max}",String(10))}</div>`}
          </div>
          ${this.adaptiveEnabled?o`
            <div class="feedback-section">
              <label class="feedback-label">${a("was_maintenance_needed",e)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${a("feedback_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${a("feedback_not_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${a("feedback_not_sure",e)}</button>
              </div>
            </div>
          `:c}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${a("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._missingRequired.length>0}
            title=${this._missingRequired.length?this._missingRequired.map(t=>a("err_required",e).replace("{field}",a(I[t]??t,e))).join(" \xB7 "):""}
          >
            ${this._loading?a("completing",e):a("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};s.styles=[P,y`
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
    .scan-required-note {
      margin: -4px 0 12px;
      padding: 8px 10px;
      border-radius: 6px;
      background: rgba(255, 152, 0, 0.12);
      color: var(--primary-text-color);
      font-size: 13px;
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
    /* #161 phase 2: the per-slot reading fields */
    .readings-block { display: flex; flex-direction: column; gap: 8px; }
    .readings-block > .field-label { margin-bottom: -4px; }
    .reading-warn {
      font-size: 12px;
      color: var(--warning-color, #ff9800);
    }
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
    /* #163: the backdate moment starts EMPTY (= now); the button seeds the
       HA date+time picker with the current minute instead of the picker's
       own 00:00 default, so a backdated completion never lands at midnight
       by accident. */
    .backdate-pick {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px dashed var(--divider-color);
      border-radius: 8px;
      background: transparent;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      color: var(--secondary-text-color);
      width: fit-content;
      --mdc-icon-size: 18px;
    }
    .backdate-pick:hover { border-color: var(--primary-color); }
    .photo-pick input[type="file"] { display: none; }
    /* #161: several photos per completion — tiles wrap into a strip,
       the two pickers (camera / gallery) sit underneath while there is
       room left under the cap. */
    .photo-pickers {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .photo-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin: 8px 0; /* room for the remove badges above the tiles */
    }
    .photo-limit {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .photo-preview {
      position: relative;
      width: fit-content;
    }
    /* Uniform tiles: a tiny or portrait shot must not collapse the strip. */
    .photo-preview img {
      width: 96px;
      height: 96px;
      object-fit: cover;
      border-radius: 8px;
      display: block;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
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
  `],r([n({attribute:!1})],s.prototype,"hass",2),r([n()],s.prototype,"entryId",2),r([n()],s.prototype,"taskId",2),r([n()],s.prototype,"taskName",2),r([n()],s.prototype,"lang",2),r([n({type:Array})],s.prototype,"checklist",2),r([n({type:Boolean})],s.prototype,"adaptiveEnabled",2),r([n()],s.prototype,"taskType",2),r([n()],s.prototype,"readingUnit",2),r([n({attribute:!1})],s.prototype,"readings",2),r([n({attribute:!1})],s.prototype,"readingHistory",2),r([n({attribute:!1})],s.prototype,"restockDefault",2),r([n({attribute:!1})],s.prototype,"restockUnitCost",2),r([n()],s.prototype,"currencySymbol",2),r([n({attribute:!1})],s.prototype,"parts",2),r([n({attribute:!1})],s.prototype,"consumesParts",2),r([n({type:Array})],s.prototype,"consumesInfo",2),r([n({type:Array})],s.prototype,"requiredFields",2),r([n()],s.prototype,"phaseLabel",2),r([n({type:Boolean})],s.prototype,"requireTagScan",2),r([n({type:Boolean})],s.prototype,"viaTagScan",2),r([p()],s.prototype,"_open",2),r([p()],s.prototype,"_notes",2),r([p()],s.prototype,"_cost",2),r([p()],s.prototype,"_duration",2),r([p()],s.prototype,"_loading",2),r([p()],s.prototype,"_error",2),r([p()],s.prototype,"_checklistState",2),r([p()],s.prototype,"_feedback",2),r([p()],s.prototype,"_photos",2),r([p()],s.prototype,"_photoUploading",2),r([p()],s.prototype,"_readingValue",2),r([p()],s.prototype,"_readingValues",2),r([p()],s.prototype,"_restockQty",2),r([p()],s.prototype,"_completedAt",2),r([p()],s.prototype,"_usedParts",2),r([n({attribute:!1})],s.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",s);export{A as a,q as b,v as c,s as d};
