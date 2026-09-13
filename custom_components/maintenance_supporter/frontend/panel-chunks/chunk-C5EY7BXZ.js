/*! maintenance_supporter frontend 2.83.0 */
import{a as x,g as P,l as L}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-HMUUFTFZ.js";import{a as q}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ZBU3AZEL.js";import{M as I,a as s,b as y,c as n,f as p,h as k,l as d,m as h,q as o,x as A,y as T}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-QXU4J3YG.js";function j(u){if(!u)return[];let a=[],t=u.photo_doc_id;typeof t=="string"&&a.push(t);let e=u.photo_doc_ids;Array.isArray(e)&&a.push(...e);let i=[];for(let l of a){if(typeof l!="string")continue;let c=l.trim();if(!(!c||i.includes(c))&&(i.push(c),i.length>=10))break}return i}async function F(u,a,t,e){let i=new FormData;i.append("entry_id",a);for(let g of e)i.append("tags",g);i.append("file",t,t.name);let l=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${u.auth?.data?.access_token??""}`},body:i});if(l.status===413)throw new Error("doc_too_large");if(!l.ok)throw new Error("doc_upload_failed");let c=await l.json();if(!c.id)throw new Error("doc_upload_failed");return{id:c.id,deduped:!!c.deduped,duplicate_in_object:c.duplicate_in_object??null}}async function R(u,a,t){return(await F(u,a,t,["photo"])).id}async function S(u,a){await Promise.all(a.map(t=>u.connection.sendMessagePromise({type:"maintenance_supporter/documents/delete",doc_id:t}).catch(()=>{})))}var $=class{constructor(a,t){this.host=a;this.opts=t;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this.max=t.max??10,a.addController(this)}hostConnected(){}get ids(){return this.photos.map(a=>a.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(a){return this.errorKey?o(this.errorKey,a).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(a=[]){this._revokeAll(),this.photos=a.map(t=>({id:t,preview:""})),this.uploadedIds=[],this.uploading=!1,this.errorKey="",this.host.requestUpdate()}async addFiles(a){if(a.length===0)return;let t=a.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let e of t){let i=await R(this.opts.hass(),this.opts.entryId(),e);this.uploadedIds=[...this.uploadedIds,i],this.photos=[...this.photos,{id:i,preview:URL.createObjectURL(e)}],this.host.requestUpdate()}a.length>t.length&&(this.errorKey="photos_limit")}catch(e){this.errorKey=e instanceof Error&&e.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{this.uploading=!1,this.host.requestUpdate()}}remove(a){let t=this.photos.find(e=>e.id===a);t?.preview&&URL.revokeObjectURL(t.preview),this.photos=this.photos.filter(e=>e.id!==a),this.uploadedIds.includes(a)&&(this.uploadedIds=this.uploadedIds.filter(e=>e!==a),S(this.opts.hass(),[a])),this.host.requestUpdate()}discardOrphans(){if(this.uploadedIds.length===0)return;let a=this.uploadedIds;this.uploadedIds=[],S(this.opts.hass(),a)}markAttached(){this.uploadedIds=[]}_revokeAll(){for(let a of this.photos)a.preview&&URL.revokeObjectURL(a.preview)}};function w(){if(window.externalApp!==void 0)return!0;let a=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(a)&&/Android/.test(a)}function N(){if(!w())return!1;let u=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!u&&typeof u.getUserMedia=="function"}var U=1920,z=.88,v=class extends k{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._stream=null}async open(){if(this._open)return;let t=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!t||typeof t.getUserMedia!="function"){this._unavailable("no_media_devices");return}try{this._stream=await t.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:!1})}catch(i){this._unavailable(i instanceof Error?i.name||i.message:String(i));return}this._open=!0,await this.updateComplete;let e=this._video;if(e&&this._stream){e.srcObject=this._stream;try{await e.play()}catch{}}}close(){this._stopStream(),this._open=!1,this._busy=!1}disconnectedCallback(){super.disconnectedCallback(),this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let e of this._stream?.getTracks()??[])e.stop();this._stream=null;let t=this._video;t&&(t.srcObject=null)}_unavailable(t){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:t},bubbles:!0,composed:!0}))}async _shoot(){let t=this._video;if(!(!t||this._busy)){this._busy=!0;try{let e=t.videoWidth||640,i=t.videoHeight||480,l=Math.min(1,U/Math.max(e,i)),c=document.createElement("canvas");c.width=Math.round(e*l),c.height=Math.round(i*l);let g=c.getContext("2d");if(!g)throw new Error("no_canvas");g.drawImage(t,0,0,c.width,c.height);let _=await new Promise(E=>c.toBlob(E,"image/jpeg",z));if(!_)throw new Error("no_blob");let b=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),m=new File([_],`photo-${b}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:m},bubbles:!0,composed:!0}))}catch(e){this._unavailable(e instanceof Error?e.message:String(e))}finally{this._busy=!1}}}render(){if(!this._open)return p;let t=this.lang;return n`
      <div class="overlay" role="dialog" aria-modal="true" aria-label=${o("doc_camera",t)}>
        <video autoplay playsinline muted></video>
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${o("cancel",t)}</button>
          <button type="button" class="shoot" ?disabled=${this._busy} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${o("camera_capture_shoot",t)}</span>
          </button>
        </div>
      </div>
    `}};v.styles=y`
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
  `,s([d({type:String})],v.prototype,"lang",2),s([h()],v.prototype,"_open",2),s([h()],v.prototype,"_busy",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",v);var O=y`
  ms-photo-picker { display: contents; }
  .photo-pickers {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .photo-pick {
    display: inline-flex;
    flex-direction: row;
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
  .photo-pick:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  .photo-pick.disabled { opacity: 0.6; cursor: default; }
  .photo-pick input[type="file"] { display: none; }
  .photo-android-hint {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-top: 4px;
  }
`,f=class extends k{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=w();this._inAppCamera=N()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(t){t.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:t},bubbles:!0,composed:!0}))}_onInput(t){let e=t.target,i=Array.from(e.files??[]);e.value="",this._emit(i)}_onCameraClick(t){!this._inAppCamera||this._locked||(t.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(t){t.key!=="Enter"&&t.key!==" "||(t.preventDefault(),!this._locked&&t.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return p;let t=this.lang,e=this._locked?"disabled":"",i=this.busy?o("uploading",t):o("doc_camera",t),l=o(this._singlePick?"choose_photo":"choose_photos",t);return n`
      <div class="photo-pickers">
        ${this.showCamera?n`<label class="photo-pick photo-pick-camera ${e}" role="button" tabindex="0"
              aria-label=${i} title=${this.compact?i:p}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?p:n`<span>${i}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
        ${this.showGallery?n`<label class="photo-pick photo-pick-gallery ${e}" role="button" tabindex="0"
              aria-label=${l} title=${this.compact?l:p}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?p:n`<span>${l}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
      </div>
      ${this.showGallery&&this._singlePick?n`<div class="photo-android-hint">${o("photos_android_hint",t)}</div>`:p}
      ${this.showCamera&&this._inAppCamera?n`<ms-camera-capture .lang=${t}
            @photo-captured=${c=>this._emit([c.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:p}
    `}};s([d({type:String})],f.prototype,"lang",2),s([d({type:Boolean})],f.prototype,"disabled",2),s([d({type:Boolean})],f.prototype,"busy",2),s([d({type:String})],f.prototype,"accept",2),s([d({type:Boolean})],f.prototype,"showCamera",2),s([d({type:Boolean})],f.prototype,"showGallery",2),s([d({type:Boolean})],f.prototype,"compact",2),s([d({type:Number})],f.prototype,"remaining",2),s([h()],f.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",f);var r=class extends k{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.currencySymbol="";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new $(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this.checklistPrefill={}}open(t={}){this._open||(this._open=!0,this.viaTagScan=!!t.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((e,i)=>[String(i),!!this.checklistPrefill[e]]).filter(([,e])=>e)),this._feedback="needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(e=>[x(e),{...e}])))}_toggleCheck(t){let e=String(t);this._checklistState={...this._checklistState,[e]:!this._checklistState[e]}}_setFeedback(t){this._feedback=t}async _complete(){this._loading=!0,this._error="",this._photos.clearError();try{let t={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(t.notes=this._notes),this._cost){let e=parseFloat(this._cost);!isNaN(e)&&e>=0&&(t.cost=e)}if(this._duration){let e=parseInt(this._duration,10);!isNaN(e)&&e>=0&&(t.duration=e)}if(this.checklist.length>0&&(t.checklist_state=this._checklistState),this.adaptiveEnabled&&(t.feedback=this._feedback),this._photos.photos.length>0&&(t.photo_doc_ids=this._photos.ids),this.viaTagScan&&(t.via_tag_scan=!0),this._completedAt){if(new Date(this._completedAt).getTime()>Date.now()){this._error=o("completed_at_future_error",this.lang),this._loading=!1;return}t.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let e={};for(let i of this.readings){let l=(this._readingValues[i.id]??"").trim();if(l==="")continue;let c=parseFloat(l.replace(",","."));isNaN(c)||(e[i.id]=c)}Object.keys(e).length>0&&(t.reading_values=e)}else if(this._readingValue!==""){let e=parseFloat(this._readingValue);isNaN(e)||(t.reading_value=e)}if(this.restockDefault!==null&&this._restockQty!==""){let e=parseFloat(this._restockQty);!isNaN(e)&&e>=1&&(t.restock_quantity=e)}this.parts.length>0&&(t.used_parts=Object.values(this._usedParts).filter(e=>Number.isFinite(e.quantity)&&e.quantity>0).map(e=>e.entry_id?{part_id:e.part_id,quantity:e.quantity,entry_id:e.entry_id}:{part_id:e.part_id,quantity:e.quantity})),await this.hass.connection.sendMessagePromise(t),this._photos.markAttached(),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(t){this._error=q(t,this.lang,o("save_error",this.lang))}finally{this._loading=!1}}_renderReadingField(t,e){let i=this._completedAt?new Date(this._completedAt).getTime():NaN,l=P(this.readingHistory,t.id,isNaN(i)?void 0:i),c=t.unit||this.readingUnit,g=(this._readingValues[t.id]??"").trim(),_=g===""?NaN:parseFloat(g.replace(",",".")),b=l!==void 0&&!isNaN(_)&&_<l.value,m=l!==void 0?A(l.value,e,{maximumFractionDigits:3}):"";return n`
      <label class="field reading-field">
        <span class="field-label">${t.name}${c?` (${c})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${l!==void 0?o("reading_last",e).replace("{value}",m):""}
          .value=${this._readingValues[t.id]??""}
          @input=${E=>{this._readingValues={...this._readingValues,[t.id]:E.target.value}}} />
        ${b?n`<span class="reading-warn">${o("reading_below_last",e).replace("{value}",m)}</span>`:p}
      </label>`}get _missingRequired(){let t={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(e=>!t[e])}_req(t){return this.requiredFields.includes(t)?n`<span class="req-mark" aria-hidden="true">*</span>`:p}_partsCostSuggestion(){if(this.restockDefault!==null){let i=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(i)||i<=0?null:Math.round(this.restockUnitCost*i*100)/100}if(!this.parts.length)return null;let t=0,e=!1;for(let i of Object.values(this._usedParts)){let l=this.parts.find(c=>x({part_id:c.id,entry_id:c.entry_id})===x(i));l?.cost!=null&&(t+=l.cost*(i.quantity||1),e=!0)}return e?Math.round(t*100)/100:null}_renderCostSuggestion(t){if(this._cost.trim()!=="")return p;let e=this._partsCostSuggestion();if(e==null||e<=0)return p;let i=T(e,this.currencySymbol,t);return n`<button
      type="button"
      class="cost-suggestion"
      @click=${()=>this._cost=String(Math.round(e*100)/100)}
    >${o("cost_from_parts",t).replace("{amount}",i)}</button>`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){let t=new Date,e=i=>String(i).padStart(2,"0");this._completedAt=`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}T${e(t.getHours())}:${e(t.getMinutes())}:00`}render(){if(!this._open)return n``;let t=this.lang||this.hass?.language||"en",e=this._error||this._photos.errorText(t);return n`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${o("complete_title",t)}${this.taskName}</div>
        ${this.phaseLabel?n`<div class="phase-line">${o("phase_current",t)}: ${this.phaseLabel}</div>`:p}
        ${this.requireTagScan&&!this.viaTagScan?n`<div class="scan-required-note">${o("require_tag_scan_hint",t)}</div>`:p}
        <div class="content">
          ${e?n`<div class="error">${e}</div>`:p}
          ${this.checklist.length>0?n`
            <div class="checklist-section">
              <label class="checklist-label">${o("checklist",t)}</label>
              ${this.checklist.map((i,l)=>n`
                <label class="checklist-item" @click=${()=>this._toggleCheck(l)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(l)]} />
                  <span>${i}</span>
                </label>
              `)}
            </div>
          `:p}
          ${this.readings.length>0?n`<div class="readings-block">
                <span class="field-label">${o("readings_section",t)}</span>
                ${this.readings.map(i=>this._renderReadingField(i,t))}
              </div>`:this.taskType==="reading"?n`
              <label class="field">
                <span class="field-label">${o("reading_value_label",t)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${i=>this._readingValue=i.target.value} />
              </label>`:p}
          ${this.parts.length?n`<div class="used-parts">
                <span class="field-label">${o("complete_parts_used",t)}</span>
                ${this.parts.map(i=>{let l=x({part_id:i.id,entry_id:i.entry_id}),c=this._usedParts[l],g=c!==void 0,_=i.entry_id?{part_id:i.id,quantity:1,entry_id:i.entry_id}:{part_id:i.id,quantity:1};return n`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${g}
                        @change=${b=>{let m={...this._usedParts};b.target.checked?m[l]=m[l]||_:delete m[l],this._usedParts=m}} />
                      <span
                        >${i.name}${i.owner_name?n`<span class="used-part-owner"> (${i.owner_name})</span>`:p}${i.stock!==null&&i.stock!==void 0?` (${i.stock}${i.unit?" "+i.unit:""})`:""}</span
                      >
                    </label>
                    ${g?n`<input class="used-part-qty" type="number" min="0.01" max="999" step="0.01"
                          .value=${String(c.quantity)}
                          @input=${b=>{let m=parseFloat(b.target.value);this._usedParts={...this._usedParts,[l]:{..._,quantity:Number.isFinite(m)&&m>=.01?m:1}}}} />`:p}
                  </div>`})}
              </div>`:this.consumesInfo.length?n`<div class="consumes-hint">
                  ${this.consumesInfo.map(i=>n`<div>${i}</div>`)}
                </div>`:p}
          ${this.restockDefault!==null?n`
              <label class="field">
                <span class="field-label">${o("restock_quantity_label",t)}</span>
                <input type="number" step="0.01" min="0.01" class="field-input"
                  .value=${this._restockQty}
                  @input=${i=>this._restockQty=i.target.value} />
              </label>`:p}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${o("notes_optional",t)}${this._req("notes")}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${i=>this._notes=i.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${o("cost_optional",t)}${this._req("cost")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${i=>this._cost=i.target.value} />
            ${this._renderCostSuggestion(t)}
          </label>
          <label class="field">
            <span class="field-label">${o("duration_minutes",t)}${this._req("duration")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._duration}
              @input=${i=>this._duration=i.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${o("completed_at_optional",t)}</span>
            ${this._completedAt?n`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${t}
                  .value=${this._completedAt}
                  @value-changed=${i=>this._completedAt=i.detail.value}
                ></ms-date-field>`:n`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${o("completed_at_pick",t)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${o("completion_photos_optional",t)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?n`<div class="photo-strip">
                  ${this._photos.photos.map(i=>n`
                    <div class="photo-preview">
                      <img src=${i.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(i.id)}
                        title="${o("remove",t)}">✕</button>
                    </div>`)}
                </div>`:p}
            ${this._photos.full?n`<div class="photo-limit">${o("photos_limit",t).replace("{max}",String(this._photos.max))}</div>`:n`<ms-photo-picker .lang=${t} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${i=>this._photos.addFiles(i.detail.files)}
                ></ms-photo-picker>`}
          </div>
          ${this.adaptiveEnabled?n`
            <div class="feedback-section">
              <label class="feedback-label">${o("was_maintenance_needed",t)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${o("feedback_needed",t)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${o("feedback_not_needed",t)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${o("feedback_not_sure",t)}</button>
              </div>
            </div>
          `:p}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${o("cancel",t)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._missingRequired.length>0}
            title=${this._missingRequired.length?this._missingRequired.map(i=>o("err_required",t).replace("{field}",o(L[i]??i,t))).join(" \xB7 "):""}
          >
            ${this._loading?o("completing",t):o("complete",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};r.styles=[I,O,y`
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
    /* .photo-pick / .photo-pickers / .photo-android-hint come from photoPickerStyles */
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
    /* #161: several photos per completion — tiles wrap into a strip,
       the two pickers (camera / gallery) sit underneath while there is
       room left under the cap. */
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
  `],s([d({attribute:!1})],r.prototype,"hass",2),s([d()],r.prototype,"entryId",2),s([d()],r.prototype,"taskId",2),s([d()],r.prototype,"taskName",2),s([d()],r.prototype,"lang",2),s([d({type:Array})],r.prototype,"checklist",2),s([d({type:Boolean})],r.prototype,"adaptiveEnabled",2),s([d()],r.prototype,"taskType",2),s([d()],r.prototype,"readingUnit",2),s([d({attribute:!1})],r.prototype,"readings",2),s([d({attribute:!1})],r.prototype,"readingHistory",2),s([d({attribute:!1})],r.prototype,"restockDefault",2),s([d({attribute:!1})],r.prototype,"restockUnitCost",2),s([d()],r.prototype,"currencySymbol",2),s([d({attribute:!1})],r.prototype,"parts",2),s([d({attribute:!1})],r.prototype,"consumesParts",2),s([d({type:Array})],r.prototype,"consumesInfo",2),s([d({type:Array})],r.prototype,"requiredFields",2),s([d()],r.prototype,"phaseLabel",2),s([d({type:Boolean})],r.prototype,"requireTagScan",2),s([d({type:Boolean})],r.prototype,"viaTagScan",2),s([h()],r.prototype,"_open",2),s([h()],r.prototype,"_notes",2),s([h()],r.prototype,"_cost",2),s([h()],r.prototype,"_duration",2),s([h()],r.prototype,"_loading",2),s([h()],r.prototype,"_error",2),s([h()],r.prototype,"_checklistState",2),s([h()],r.prototype,"_feedback",2),s([h()],r.prototype,"_readingValue",2),s([h()],r.prototype,"_readingValues",2),s([h()],r.prototype,"_restockQty",2),s([h()],r.prototype,"_completedAt",2),s([h()],r.prototype,"_usedParts",2),s([d({attribute:!1})],r.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",r);export{w as a,j as b,F as c,O as d,$ as e,r as f};
