/*! maintenance_supporter frontend 2.83.0 */
import{a as b,g as T,l as q}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-EMS4JLRI.js";import{a as I}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-R3JXXBCT.js";import{L as A,a as s,b as y,c as r,f as c,h as x,l as d,m as p,q as o,x as P,y as S}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-H6BM4UNQ.js";function $(){if(window.externalApp!==void 0)return!0;let u=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(u)&&/Android/.test(u)}function H(h){if(!h)return[];let u=[],e=h.photo_doc_id;typeof e=="string"&&u.push(e);let t=h.photo_doc_ids;Array.isArray(t)&&u.push(...t);let i=[];for(let n of u){if(typeof n!="string")continue;let l=n.trim();if(!(!l||i.includes(l))&&(i.push(l),i.length>=10))break}return i}async function L(h,u,e){let t=new FormData;t.append("entry_id",u),t.append("tags","photo"),t.append("file",e,e.name);let i=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${h.auth?.data?.access_token??""}`},body:t});if(i.status===413)throw new Error("doc_too_large");if(!i.ok)throw new Error("doc_upload_failed");let n=await i.json();if(!n.id)throw new Error("doc_upload_failed");return n.id}async function E(h,u){await Promise.all(u.map(e=>h.connection.sendMessagePromise({type:"maintenance_supporter/documents/delete",doc_id:e}).catch(()=>{})))}function N(){if(!$())return!1;let h=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!h&&typeof h.getUserMedia=="function"}var F=1920,R=.88,g=class extends x{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._stream=null}async open(){if(this._open)return;let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||typeof e.getUserMedia!="function"){this._unavailable("no_media_devices");return}try{this._stream=await e.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:!1})}catch(i){this._unavailable(i instanceof Error?i.name||i.message:String(i));return}this._open=!0,await this.updateComplete;let t=this._video;if(t&&this._stream){t.srcObject=this._stream;try{await t.play()}catch{}}}close(){this._stopStream(),this._open=!1,this._busy=!1}disconnectedCallback(){super.disconnectedCallback(),this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let t of this._stream?.getTracks()??[])t.stop();this._stream=null;let e=this._video;e&&(e.srcObject=null)}_unavailable(e){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:e},bubbles:!0,composed:!0}))}async _shoot(){let e=this._video;if(!(!e||this._busy)){this._busy=!0;try{let t=e.videoWidth||640,i=e.videoHeight||480,n=Math.min(1,F/Math.max(t,i)),l=document.createElement("canvas");l.width=Math.round(t*n),l.height=Math.round(i*n);let m=l.getContext("2d");if(!m)throw new Error("no_canvas");m.drawImage(e,0,0,l.width,l.height);let _=await new Promise(w=>l.toBlob(w,"image/jpeg",R));if(!_)throw new Error("no_blob");let f=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),k=new File([_],`photo-${f}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:k},bubbles:!0,composed:!0}))}catch(t){this._unavailable(t instanceof Error?t.message:String(t))}finally{this._busy=!1}}}render(){if(!this._open)return c;let e=this.lang;return r`
      <div class="overlay" role="dialog" aria-modal="true" aria-label=${o("doc_camera",e)}>
        <video autoplay playsinline muted></video>
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${o("cancel",e)}</button>
          <button type="button" class="shoot" ?disabled=${this._busy} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${o("camera_capture_shoot",e)}</span>
          </button>
        </div>
      </div>
    `}};g.styles=y`
    :host { display: contents; }
    .overlay {
      position: fixed; inset: 0; z-index: 10000;
      background: #000; color: #fff;
      display: flex; flex-direction: column;
    }
    video { flex: 1; min-height: 0; width: 100%; object-fit: contain; background: #000; }
    .bar {
      display: flex; justify-content: space-between; align-items: center; gap: 16px;
      padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
      background: rgba(0, 0, 0, 0.8);
    }
    button {
      font: inherit; border-radius: 24px; padding: 10px 18px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 8px;
    }
    .cancel { background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.6); }
    .shoot { background: var(--primary-color, #03a9f4); color: #fff; border: none; font-weight: 600; }
    .shoot[disabled] { opacity: 0.6; cursor: default; }
    .shoot ha-icon { --mdc-icon-size: 22px; }
  `,s([d({type:String})],g.prototype,"lang",2),s([p()],g.prototype,"_open",2),s([p()],g.prototype,"_busy",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",g);var a=class extends x{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.currencySymbol="";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=[];this._uploadedIds=[];this._photoUploading=!1;this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this.checklistPrefill={};this._singlePick=$();this._inAppCamera=N()}open(e={}){this._open||(this._open=!0,this.viaTagScan=!!e.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((t,i)=>[String(i),!!this.checklistPrefill[t]]).filter(([,t])=>t)),this._feedback="needed",this._photos.forEach(t=>URL.revokeObjectURL(t.preview)),this._photos=[],this._uploadedIds=[],this._photoUploading=!1,this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(t=>[b(t),{...t}])))}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}_onCameraClick(e){!this._inAppCamera||this._photoUploading||(e.preventDefault(),this.shadowRoot?.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.shadowRoot?.querySelector(".photo-pick-camera input")?.click()}async _onPhotoInput(e){let t=e.target,i=Array.from(t.files??[]);t.value="",await this._addPhotoFiles(i)}async _addPhotoFiles(e){if(e.length===0)return;let t=10-this._photos.length,i=e.slice(0,Math.max(t,0));this._photoUploading=!0,this._error="";try{for(let n of i){let l=await L(this.hass,this.entryId,n);this._uploadedIds=[...this._uploadedIds,l],this._photos=[...this._photos,{id:l,preview:URL.createObjectURL(n)}]}e.length>i.length&&(this._error=o("photos_limit",this.lang).replace("{max}",String(10)))}catch(n){let l=n instanceof Error&&n.message==="doc_too_large"?"doc_too_large":"doc_upload_failed";this._error=o(l,this.lang)}finally{this._photoUploading=!1}}_removePhoto(e){let t=this._photos.find(i=>i.id===e);t&&URL.revokeObjectURL(t.preview),this._photos=this._photos.filter(i=>i.id!==e),this._uploadedIds.includes(e)&&(this._uploadedIds=this._uploadedIds.filter(i=>i!==e),E(this.hass,[e]))}async _complete(){this._loading=!0,this._error="";try{let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(e.notes=this._notes),this._cost){let t=parseFloat(this._cost);!isNaN(t)&&t>=0&&(e.cost=t)}if(this._duration){let t=parseInt(this._duration,10);!isNaN(t)&&t>=0&&(e.duration=t)}if(this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photos.length>0&&(e.photo_doc_ids=this._photos.map(t=>t.id)),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(new Date(this._completedAt).getTime()>Date.now()){this._error=o("completed_at_future_error",this.lang),this._loading=!1;return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let t={};for(let i of this.readings){let n=(this._readingValues[i.id]??"").trim();if(n==="")continue;let l=parseFloat(n.replace(",","."));isNaN(l)||(t[i.id]=l)}Object.keys(t).length>0&&(e.reading_values=t)}else if(this._readingValue!==""){let t=parseFloat(this._readingValue);isNaN(t)||(e.reading_value=t)}if(this.restockDefault!==null&&this._restockQty!==""){let t=parseFloat(this._restockQty);!isNaN(t)&&t>=1&&(e.restock_quantity=t)}this.parts.length>0&&(e.used_parts=Object.values(this._usedParts).filter(t=>Number.isFinite(t.quantity)&&t.quantity>0).map(t=>t.entry_id?{part_id:t.part_id,quantity:t.quantity,entry_id:t.entry_id}:{part_id:t.part_id,quantity:t.quantity})),await this.hass.connection.sendMessagePromise(e),this._uploadedIds=[],this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(e){this._error=I(e,this.lang,o("save_error",this.lang))}finally{this._loading=!1}}_renderReadingField(e,t){let i=this._completedAt?new Date(this._completedAt).getTime():NaN,n=T(this.readingHistory,e.id,isNaN(i)?void 0:i),l=e.unit||this.readingUnit,m=(this._readingValues[e.id]??"").trim(),_=m===""?NaN:parseFloat(m.replace(",",".")),f=n!==void 0&&!isNaN(_)&&_<n.value,k=n!==void 0?P(n.value,t,{maximumFractionDigits:3}):"";return r`
      <label class="field reading-field">
        <span class="field-label">${e.name}${l?` (${l})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${n!==void 0?o("reading_last",t).replace("{value}",k):""}
          .value=${this._readingValues[e.id]??""}
          @input=${w=>{this._readingValues={...this._readingValues,[e.id]:w.target.value}}} />
        ${f?r`<span class="reading-warn">${o("reading_below_last",t).replace("{value}",k)}</span>`:c}
      </label>`}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(t=>!e[t])}_req(e){return this.requiredFields.includes(e)?r`<span class="req-mark" aria-hidden="true">*</span>`:c}_partsCostSuggestion(){if(this.restockDefault!==null){let i=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(i)||i<=0?null:Math.round(this.restockUnitCost*i*100)/100}if(!this.parts.length)return null;let e=0,t=!1;for(let i of Object.values(this._usedParts)){let n=this.parts.find(l=>b({part_id:l.id,entry_id:l.entry_id})===b(i));n?.cost!=null&&(e+=n.cost*(i.quantity||1),t=!0)}return t?Math.round(e*100)/100:null}_renderCostSuggestion(e){if(this._cost.trim()!=="")return c;let t=this._partsCostSuggestion();if(t==null||t<=0)return c;let i=S(t,this.currencySymbol,e);return r`<button
      type="button"
      class="cost-suggestion"
      @click=${()=>this._cost=String(Math.round(t*100)/100)}
    >${o("cost_from_parts",e).replace("{amount}",i)}</button>`}_close(){if(this._open=!1,this._uploadedIds.length>0){let e=this._uploadedIds;this._uploadedIds=[],E(this.hass,e)}}_pickCompletedAt(){let e=new Date,t=i=>String(i).padStart(2,"0");this._completedAt=`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}T${t(e.getHours())}:${t(e.getMinutes())}:00`}render(){if(!this._open)return r``;let e=this.lang||this.hass?.language||"en";return r`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${o("complete_title",e)}${this.taskName}</div>
        ${this.phaseLabel?r`<div class="phase-line">${o("phase_current",e)}: ${this.phaseLabel}</div>`:c}
        ${this.requireTagScan&&!this.viaTagScan?r`<div class="scan-required-note">${o("require_tag_scan_hint",e)}</div>`:c}
        <div class="content">
          ${this._error?r`<div class="error">${this._error}</div>`:c}
          ${this.checklist.length>0?r`
            <div class="checklist-section">
              <label class="checklist-label">${o("checklist",e)}</label>
              ${this.checklist.map((t,i)=>r`
                <label class="checklist-item" @click=${()=>this._toggleCheck(i)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(i)]} />
                  <span>${t}</span>
                </label>
              `)}
            </div>
          `:c}
          ${this.readings.length>0?r`<div class="readings-block">
                <span class="field-label">${o("readings_section",e)}</span>
                ${this.readings.map(t=>this._renderReadingField(t,e))}
              </div>`:this.taskType==="reading"?r`
              <label class="field">
                <span class="field-label">${o("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${t=>this._readingValue=t.target.value} />
              </label>`:c}
          ${this.parts.length?r`<div class="used-parts">
                <span class="field-label">${o("complete_parts_used",e)}</span>
                ${this.parts.map(t=>{let i=b({part_id:t.id,entry_id:t.entry_id}),n=this._usedParts[i],l=n!==void 0,m=t.entry_id?{part_id:t.id,quantity:1,entry_id:t.entry_id}:{part_id:t.id,quantity:1};return r`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${l}
                        @change=${_=>{let f={...this._usedParts};_.target.checked?f[i]=f[i]||m:delete f[i],this._usedParts=f}} />
                      <span
                        >${t.name}${t.owner_name?r`<span class="used-part-owner"> (${t.owner_name})</span>`:c}${t.stock!==null&&t.stock!==void 0?` (${t.stock}${t.unit?" "+t.unit:""})`:""}</span
                      >
                    </label>
                    ${l?r`<input class="used-part-qty" type="number" min="0.01" max="999" step="0.01"
                          .value=${String(n.quantity)}
                          @input=${_=>{let f=parseFloat(_.target.value);this._usedParts={...this._usedParts,[i]:{...m,quantity:Number.isFinite(f)&&f>=.01?f:1}}}} />`:c}
                  </div>`})}
              </div>`:this.consumesInfo.length?r`<div class="consumes-hint">
                  ${this.consumesInfo.map(t=>r`<div>${t}</div>`)}
                </div>`:c}
          ${this.restockDefault!==null?r`
              <label class="field">
                <span class="field-label">${o("restock_quantity_label",e)}</span>
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
            <span class="field-label">${o("notes_optional",e)}${this._req("notes")}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${t=>this._notes=t.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${o("cost_optional",e)}${this._req("cost")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${t=>this._cost=t.target.value} />
            ${this._renderCostSuggestion(e)}
          </label>
          <label class="field">
            <span class="field-label">${o("duration_minutes",e)}${this._req("duration")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._duration}
              @input=${t=>this._duration=t.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${o("completed_at_optional",e)}</span>
            ${this._completedAt?r`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${e}
                  .value=${this._completedAt}
                  @value-changed=${t=>this._completedAt=t.detail.value}
                ></ms-date-field>`:r`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${o("completed_at_pick",e)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${o("completion_photos_optional",e)}${this._req("photo")}</span>
            ${this._photos.length>0?r`<div class="photo-strip">
                  ${this._photos.map(t=>r`
                    <div class="photo-preview">
                      <img src=${t.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._removePhoto(t.id)}
                        title="${o("remove",e)}">✕</button>
                    </div>`)}
                </div>`:c}
            ${this._photos.length<10?r`<div class="photo-pickers">
                  <label class="photo-pick photo-pick-camera" @click=${this._onCameraClick}>
                    <ha-icon icon="mdi:camera"></ha-icon>
                    <span>${this._photoUploading?o("uploading",e):o("doc_camera",e)}</span>
                    <input type="file" accept="image/*" capture="environment"
                      ?disabled=${this._photoUploading}
                      @change=${this._onPhotoInput} />
                  </label>
                  <label class="photo-pick photo-pick-gallery">
                    <ha-icon icon="mdi:image-multiple"></ha-icon>
                    <span>${o(this._singlePick?"choose_photo":"choose_photos",e)}</span>
                    <input type="file" accept="image/*" ?multiple=${!this._singlePick}
                      ?disabled=${this._photoUploading}
                      @change=${this._onPhotoInput} />
                  </label>
                </div>
                ${this._singlePick?r`<div class="photo-limit photo-android-hint">${o("photos_android_hint",e)}</div>`:c}
                ${this._inAppCamera?r`<ms-camera-capture .lang=${e}
                  @photo-captured=${t=>this._addPhotoFiles([t.detail.file])}
                  @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:c}`:r`<div class="photo-limit">${o("photos_limit",e).replace("{max}",String(10))}</div>`}
          </div>
          ${this.adaptiveEnabled?r`
            <div class="feedback-section">
              <label class="feedback-label">${o("was_maintenance_needed",e)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${o("feedback_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${o("feedback_not_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${o("feedback_not_sure",e)}</button>
              </div>
            </div>
          `:c}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${o("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._missingRequired.length>0}
            title=${this._missingRequired.length?this._missingRequired.map(t=>o("err_required",e).replace("{field}",o(q[t]??t,e))).join(" \xB7 "):""}
          >
            ${this._loading?o("completing",e):o("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};a.styles=[A,y`
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
    .photo-android-hint { margin-top: 4px; }
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
  `],s([d({attribute:!1})],a.prototype,"hass",2),s([d()],a.prototype,"entryId",2),s([d()],a.prototype,"taskId",2),s([d()],a.prototype,"taskName",2),s([d()],a.prototype,"lang",2),s([d({type:Array})],a.prototype,"checklist",2),s([d({type:Boolean})],a.prototype,"adaptiveEnabled",2),s([d()],a.prototype,"taskType",2),s([d()],a.prototype,"readingUnit",2),s([d({attribute:!1})],a.prototype,"readings",2),s([d({attribute:!1})],a.prototype,"readingHistory",2),s([d({attribute:!1})],a.prototype,"restockDefault",2),s([d({attribute:!1})],a.prototype,"restockUnitCost",2),s([d()],a.prototype,"currencySymbol",2),s([d({attribute:!1})],a.prototype,"parts",2),s([d({attribute:!1})],a.prototype,"consumesParts",2),s([d({type:Array})],a.prototype,"consumesInfo",2),s([d({type:Array})],a.prototype,"requiredFields",2),s([d()],a.prototype,"phaseLabel",2),s([d({type:Boolean})],a.prototype,"requireTagScan",2),s([d({type:Boolean})],a.prototype,"viaTagScan",2),s([p()],a.prototype,"_open",2),s([p()],a.prototype,"_notes",2),s([p()],a.prototype,"_cost",2),s([p()],a.prototype,"_duration",2),s([p()],a.prototype,"_loading",2),s([p()],a.prototype,"_error",2),s([p()],a.prototype,"_checklistState",2),s([p()],a.prototype,"_feedback",2),s([p()],a.prototype,"_photos",2),s([p()],a.prototype,"_photoUploading",2),s([p()],a.prototype,"_readingValue",2),s([p()],a.prototype,"_readingValues",2),s([p()],a.prototype,"_restockQty",2),s([p()],a.prototype,"_completedAt",2),s([p()],a.prototype,"_usedParts",2),s([d({attribute:!1})],a.prototype,"checklistPrefill",2),s([p()],a.prototype,"_inAppCamera",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",a);export{N as a,H as b,L as c,E as d,a as e};
