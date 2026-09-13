/*! maintenance_supporter frontend 2.85.0 */
import{a as x,g as q,l as O}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-PEWGOUF2.js";import{a as L}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-N4F5ZG4J.js";import{M as P,a as s,b as y,c,f as p,h as k,l as d,m,q as a,x as T,y as A}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BOWIGTO2.js";function V(h){if(!h)return[];let r=[],t=h.photo_doc_id;typeof t=="string"&&r.push(t);let e=h.photo_doc_ids;Array.isArray(e)&&r.push(...e);let i=[];for(let o of r){if(typeof o!="string")continue;let n=o.trim();if(!(!n||i.includes(n))&&(i.push(n),i.length>=10))break}return i}async function j(h,r,t,e){let i=new FormData;i.append("entry_id",r);for(let f of e)i.append("tags",f);i.append("file",t,t.name);let o=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${h.auth?.data?.access_token??""}`},body:i});if(o.status===413)throw new Error("doc_too_large");if(!o.ok)throw new Error("doc_upload_failed");let n=await o.json();if(!n.id)throw new Error("doc_upload_failed");return{id:n.id,deduped:!!n.deduped,duplicate_in_object:n.duplicate_in_object??null}}async function R(h,r,t){return(await j(h,r,t,["photo"])).id}async function S(h,r){await Promise.all(r.map(t=>h.connection.sendMessagePromise({type:"maintenance_supporter/documents/delete",doc_id:t}).catch(()=>{})))}var $=class{constructor(r,t){this.host=r;this.opts=t;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this.max=t.max??10,r.addController(this)}hostConnected(){}get ids(){return this.photos.map(r=>r.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(r){return this.errorKey?a(this.errorKey,r).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(r=[]){this._revokeAll(),this.photos=r.map(t=>({id:t,preview:""})),this.uploadedIds=[],this.uploading=!1,this.errorKey="",this.host.requestUpdate()}async addFiles(r){if(r.length===0)return;let t=r.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let e of t){let i=await R(this.opts.hass(),this.opts.entryId(),e);this.uploadedIds=[...this.uploadedIds,i],this.photos=[...this.photos,{id:i,preview:URL.createObjectURL(e)}],this.host.requestUpdate()}r.length>t.length&&(this.errorKey="photos_limit")}catch(e){this.errorKey=e instanceof Error&&e.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{this.uploading=!1,this.host.requestUpdate()}}remove(r){let t=this.photos.find(e=>e.id===r);t?.preview&&URL.revokeObjectURL(t.preview),this.photos=this.photos.filter(e=>e.id!==r),this.uploadedIds.includes(r)&&(this.uploadedIds=this.uploadedIds.filter(e=>e!==r),S(this.opts.hass(),[r])),this.host.requestUpdate()}discardOrphans(){if(this.uploadedIds.length===0)return;let r=this.uploadedIds;this.uploadedIds=[],S(this.opts.hass(),r)}markAttached(){this.uploadedIds=[]}_revokeAll(){for(let r of this.photos)r.preview&&URL.revokeObjectURL(r.preview)}};function w(){if(window.externalApp!==void 0)return!0;let r=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(r)&&/Android/.test(r)}var I={printOptions:"msp-print-options",batteryRosterOpen:"msp-bf-roster-open",docSort:"msp-doc-sort",cameraDevice:"msp-camera-device",overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort"};function N(h){try{return localStorage.getItem(h)}catch{return null}}function U(h,r){try{localStorage.setItem(h,r)}catch{}}function F(){if(!w())return!1;let h=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!h&&typeof h.getUserMedia=="function"}var C=1920,B=.88,b=class extends k{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._devices=[];this._stream=null}async open(){if(this._open)return;let t=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!t||typeof t.getUserMedia!="function"){this._unavailable("no_media_devices");return}let e=N(I.cameraDevice),i=!1;if(e)try{this._stream=await t.getUserMedia({video:{deviceId:{exact:e}},audio:!1}),i=!0}catch{}if(!i){try{this._stream=await t.getUserMedia({video:{facingMode:{ideal:"environment"},advanced:[{zoom:1}]},audio:!1})}catch(n){this._unavailable(n instanceof Error?n.name||n.message:String(n));return}await this._preferMainBackCamera(t)}await this._applyZoomOne(),await this._listDevices(t),this._open=!0,await this.updateComplete;let o=this._video;if(o&&this._stream){o.srcObject=this._stream;try{await o.play()}catch{}}}async _preferMainBackCamera(t){if(typeof t.enumerateDevices!="function")return;let e=[];try{e=await t.enumerateDevices()}catch{return}let i=u=>{let _=/camera2?\s*(\d+)/i.exec(u.label);return _?Number(_[1]):Number.MAX_SAFE_INTEGER},o=e.filter(u=>u.kind==="videoinput"&&u.deviceId&&/back|rear|environment|rück|hinten/i.test(u.label)).sort((u,_)=>i(u)-i(_)),f=this._stream?.getVideoTracks()[0]?.getSettings().deviceId;if(o.length>1&&o[0].deviceId!==f)try{let u=await t.getUserMedia({video:{deviceId:{exact:o[0].deviceId}},audio:!1});for(let _ of this._stream?.getTracks()??[])_.stop();this._stream=u}catch{}}async _applyZoomOne(){let t=this._stream?.getVideoTracks()[0],e=t&&typeof t.getCapabilities=="function"?t.getCapabilities():void 0;if(e?.zoom&&typeof e.zoom.min=="number"&&e.zoom.min<1&&(e.zoom.max??1)>=1)try{await t.applyConstraints({advanced:[{zoom:1}]})}catch{}}async _listDevices(t){if(typeof t.enumerateDevices=="function")try{this._devices=(await t.enumerateDevices()).filter(e=>e.kind==="videoinput"&&!!e.deviceId)}catch{this._devices=[]}}get _currentDeviceId(){return this._stream?.getVideoTracks()[0]?.getSettings().deviceId}async _switchCamera(){let t=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!t||this._devices.length<2||this._busy)return;let e=this._devices.map(n=>n.deviceId),i=e.indexOf(this._currentDeviceId??""),o=e[(i+1)%e.length];this._busy=!0;try{let n=await t.getUserMedia({video:{deviceId:{exact:o}},audio:!1});for(let u of this._stream?.getTracks()??[])u.stop();this._stream=n,await this._applyZoomOne(),U(I.cameraDevice,o);let f=this._video;if(f){f.srcObject=n;try{await f.play()}catch{}}}catch{}finally{this._busy=!1}}close(){this._stopStream(),this._open=!1,this._busy=!1}disconnectedCallback(){super.disconnectedCallback(),this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let e of this._stream?.getTracks()??[])e.stop();this._stream=null;let t=this._video;t&&(t.srcObject=null)}_unavailable(t){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:t},bubbles:!0,composed:!0}))}async _shoot(){let t=this._video;if(!(!t||this._busy)){this._busy=!0;try{let e=t.videoWidth||640,i=t.videoHeight||480,o=Math.min(1,C/Math.max(e,i)),n=document.createElement("canvas");n.width=Math.round(e*o),n.height=Math.round(i*o);let f=n.getContext("2d");if(!f)throw new Error("no_canvas");f.drawImage(t,0,0,n.width,n.height);let u=await new Promise(E=>n.toBlob(E,"image/jpeg",B));if(!u)throw new Error("no_blob");let _=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),g=new File([u],`photo-${_}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:g},bubbles:!0,composed:!0}))}catch(e){this._unavailable(e instanceof Error?e.message:String(e))}finally{this._busy=!1}}}render(){if(!this._open)return p;let t=this.lang;return c`
      <div class="overlay" role="dialog" aria-modal="true" aria-label=${a("doc_camera",t)}>
        <video autoplay playsinline muted></video>
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${a("cancel",t)}</button>
          ${this._devices.length>1?c`<button type="button" class="switch" ?disabled=${this._busy} title=${a("camera_switch_lens",t)} aria-label=${a("camera_switch_lens",t)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
              </button>`:p}
          <button type="button" class="shoot" ?disabled=${this._busy} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${a("camera_capture_shoot",t)}</span>
          </button>
        </div>
      </div>
    `}};b.styles=y`
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
    .switch { background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.6); padding: 10px 12px; }
    .switch ha-icon { --mdc-icon-size: 22px; }
    .shoot { background: var(--primary-color, #03a9f4); color: #fff; border: none; font-weight: 600; }
    .shoot[disabled] { opacity: 0.6; cursor: default; }
    .shoot ha-icon { --mdc-icon-size: 22px; }
  `,s([d({type:String})],b.prototype,"lang",2),s([m()],b.prototype,"_open",2),s([m()],b.prototype,"_busy",2),s([m()],b.prototype,"_devices",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",b);var z=y`
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
`,v=class extends k{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=w();this._inAppCamera=F()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(t){t.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:t},bubbles:!0,composed:!0}))}_onInput(t){let e=t.target,i=Array.from(e.files??[]);e.value="",this._emit(i)}_onCameraClick(t){!this._inAppCamera||this._locked||(t.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(t){t.key!=="Enter"&&t.key!==" "||(t.preventDefault(),!this._locked&&t.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return p;let t=this.lang,e=this._locked?"disabled":"",i=this.busy?a("uploading",t):a("doc_camera",t),o=a(this._singlePick?"choose_photo":"choose_photos",t);return c`
      <div class="photo-pickers">
        ${this.showCamera?c`<label class="photo-pick photo-pick-camera ${e}" role="button" tabindex="0"
              aria-label=${i} title=${this.compact?i:p}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?p:c`<span>${i}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
        ${this.showGallery?c`<label class="photo-pick photo-pick-gallery ${e}" role="button" tabindex="0"
              aria-label=${o} title=${this.compact?o:p}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?p:c`<span>${o}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
      </div>
      ${this.showGallery&&this._singlePick?c`<div class="photo-android-hint">${a("photos_android_hint",t)}</div>`:p}
      ${this.showCamera&&this._inAppCamera?c`<ms-camera-capture .lang=${t}
            @photo-captured=${n=>this._emit([n.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:p}
    `}};s([d({type:String})],v.prototype,"lang",2),s([d({type:Boolean})],v.prototype,"disabled",2),s([d({type:Boolean})],v.prototype,"busy",2),s([d({type:String})],v.prototype,"accept",2),s([d({type:Boolean})],v.prototype,"showCamera",2),s([d({type:Boolean})],v.prototype,"showGallery",2),s([d({type:Boolean})],v.prototype,"compact",2),s([d({type:Number})],v.prototype,"remaining",2),s([m()],v.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",v);var l=class extends k{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.currencySymbol="";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new $(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this.checklistPrefill={}}open(t={}){this._open||(this._open=!0,this.viaTagScan=!!t.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((e,i)=>[String(i),!!this.checklistPrefill[e]]).filter(([,e])=>e)),this._feedback="needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(e=>[x(e),{...e}])))}_toggleCheck(t){let e=String(t);this._checklistState={...this._checklistState,[e]:!this._checklistState[e]}}_setFeedback(t){this._feedback=t}async _complete(){this._loading=!0,this._error="",this._photos.clearError();try{let t={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(t.notes=this._notes),this._cost){let e=parseFloat(this._cost);!isNaN(e)&&e>=0&&(t.cost=e)}if(this._duration){let e=parseInt(this._duration,10);!isNaN(e)&&e>=0&&(t.duration=e)}if(this.checklist.length>0&&(t.checklist_state=this._checklistState),this.adaptiveEnabled&&(t.feedback=this._feedback),this._photos.photos.length>0&&(t.photo_doc_ids=this._photos.ids),this.viaTagScan&&(t.via_tag_scan=!0),this._completedAt){if(new Date(this._completedAt).getTime()>Date.now()){this._error=a("completed_at_future_error",this.lang),this._loading=!1;return}t.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let e={};for(let i of this.readings){let o=(this._readingValues[i.id]??"").trim();if(o==="")continue;let n=parseFloat(o.replace(",","."));isNaN(n)||(e[i.id]=n)}Object.keys(e).length>0&&(t.reading_values=e)}else if(this._readingValue!==""){let e=parseFloat(this._readingValue);isNaN(e)||(t.reading_value=e)}if(this.restockDefault!==null&&this._restockQty!==""){let e=parseFloat(this._restockQty);!isNaN(e)&&e>=1&&(t.restock_quantity=e)}this.parts.length>0&&(t.used_parts=Object.values(this._usedParts).filter(e=>Number.isFinite(e.quantity)&&e.quantity>0).map(e=>e.entry_id?{part_id:e.part_id,quantity:e.quantity,entry_id:e.entry_id}:{part_id:e.part_id,quantity:e.quantity})),await this.hass.connection.sendMessagePromise(t),this._photos.markAttached(),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(t){this._error=L(t,this.lang,a("save_error",this.lang))}finally{this._loading=!1}}_renderReadingField(t,e){let i=this._completedAt?new Date(this._completedAt).getTime():NaN,o=q(this.readingHistory,t.id,isNaN(i)?void 0:i),n=t.unit||this.readingUnit,f=(this._readingValues[t.id]??"").trim(),u=f===""?NaN:parseFloat(f.replace(",",".")),_=o!==void 0&&!isNaN(u)&&u<o.value,g=o!==void 0?T(o.value,e,{maximumFractionDigits:3}):"";return c`
      <label class="field reading-field">
        <span class="field-label">${t.name}${n?` (${n})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${o!==void 0?a("reading_last",e).replace("{value}",g):""}
          .value=${this._readingValues[t.id]??""}
          @input=${E=>{this._readingValues={...this._readingValues,[t.id]:E.target.value}}} />
        ${_?c`<span class="reading-warn">${a("reading_below_last",e).replace("{value}",g)}</span>`:p}
      </label>`}get _missingRequired(){let t={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(e=>!t[e])}_req(t){return this.requiredFields.includes(t)?c`<span class="req-mark" aria-hidden="true">*</span>`:p}_partsCostSuggestion(){if(this.restockDefault!==null){let i=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(i)||i<=0?null:Math.round(this.restockUnitCost*i*100)/100}if(!this.parts.length)return null;let t=0,e=!1;for(let i of Object.values(this._usedParts)){let o=this.parts.find(n=>x({part_id:n.id,entry_id:n.entry_id})===x(i));o?.cost!=null&&(t+=o.cost*(i.quantity||1),e=!0)}return e?Math.round(t*100)/100:null}_renderCostSuggestion(t){if(this._cost.trim()!=="")return p;let e=this._partsCostSuggestion();if(e==null||e<=0)return p;let i=A(e,this.currencySymbol,t);return c`<button
      type="button"
      class="cost-suggestion"
      @click=${()=>this._cost=String(Math.round(e*100)/100)}
    >${a("cost_from_parts",t).replace("{amount}",i)}</button>`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){let t=new Date,e=i=>String(i).padStart(2,"0");this._completedAt=`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}T${e(t.getHours())}:${e(t.getMinutes())}:00`}render(){if(!this._open)return c``;let t=this.lang||this.hass?.language||"en",e=this._error||this._photos.errorText(t);return c`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${a("complete_title",t)}${this.taskName}</div>
        ${this.phaseLabel?c`<div class="phase-line">${a("phase_current",t)}: ${this.phaseLabel}</div>`:p}
        ${this.requireTagScan&&!this.viaTagScan?c`<div class="scan-required-note">${a("require_tag_scan_hint",t)}</div>`:p}
        <div class="content">
          ${e?c`<div class="error">${e}</div>`:p}
          ${this.checklist.length>0?c`
            <div class="checklist-section">
              <label class="checklist-label">${a("checklist",t)}</label>
              ${this.checklist.map((i,o)=>c`
                <label class="checklist-item" @click=${()=>this._toggleCheck(o)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(o)]} />
                  <span>${i}</span>
                </label>
              `)}
            </div>
          `:p}
          ${this.readings.length>0?c`<div class="readings-block">
                <span class="field-label">${a("readings_section",t)}</span>
                ${this.readings.map(i=>this._renderReadingField(i,t))}
              </div>`:this.taskType==="reading"?c`
              <label class="field">
                <span class="field-label">${a("reading_value_label",t)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${i=>this._readingValue=i.target.value} />
              </label>`:p}
          ${this.parts.length?c`<div class="used-parts">
                <span class="field-label">${a("complete_parts_used",t)}</span>
                ${this.parts.map(i=>{let o=x({part_id:i.id,entry_id:i.entry_id}),n=this._usedParts[o],f=n!==void 0,u=i.entry_id?{part_id:i.id,quantity:1,entry_id:i.entry_id}:{part_id:i.id,quantity:1};return c`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${f}
                        @change=${_=>{let g={...this._usedParts};_.target.checked?g[o]=g[o]||u:delete g[o],this._usedParts=g}} />
                      <span
                        >${i.name}${i.owner_name?c`<span class="used-part-owner"> (${i.owner_name})</span>`:p}${i.stock!==null&&i.stock!==void 0?` (${i.stock}${i.unit?" "+i.unit:""})`:""}</span
                      >
                    </label>
                    ${f?c`<input class="used-part-qty" type="number" min="0.01" max="999" step="0.01"
                          .value=${String(n.quantity)}
                          @input=${_=>{let g=parseFloat(_.target.value);this._usedParts={...this._usedParts,[o]:{...u,quantity:Number.isFinite(g)&&g>=.01?g:1}}}} />`:p}
                  </div>`})}
              </div>`:this.consumesInfo.length?c`<div class="consumes-hint">
                  ${this.consumesInfo.map(i=>c`<div>${i}</div>`)}
                </div>`:p}
          ${this.restockDefault!==null?c`
              <label class="field">
                <span class="field-label">${a("restock_quantity_label",t)}</span>
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
            <span class="field-label">${a("notes_optional",t)}${this._req("notes")}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${i=>this._notes=i.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${a("cost_optional",t)}${this._req("cost")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${i=>this._cost=i.target.value} />
            ${this._renderCostSuggestion(t)}
          </label>
          <label class="field">
            <span class="field-label">${a("duration_minutes",t)}${this._req("duration")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._duration}
              @input=${i=>this._duration=i.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${a("completed_at_optional",t)}</span>
            ${this._completedAt?c`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${t}
                  .value=${this._completedAt}
                  @value-changed=${i=>this._completedAt=i.detail.value}
                ></ms-date-field>`:c`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${a("completed_at_pick",t)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${a("completion_photos_optional",t)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?c`<div class="photo-strip">
                  ${this._photos.photos.map(i=>c`
                    <div class="photo-preview">
                      <img src=${i.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(i.id)}
                        title="${a("remove",t)}">✕</button>
                    </div>`)}
                </div>`:p}
            ${this._photos.full?c`<div class="photo-limit">${a("photos_limit",t).replace("{max}",String(this._photos.max))}</div>`:c`<ms-photo-picker .lang=${t} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${i=>this._photos.addFiles(i.detail.files)}
                ></ms-photo-picker>`}
          </div>
          ${this.adaptiveEnabled?c`
            <div class="feedback-section">
              <label class="feedback-label">${a("was_maintenance_needed",t)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${a("feedback_needed",t)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${a("feedback_not_needed",t)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${a("feedback_not_sure",t)}</button>
              </div>
            </div>
          `:p}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${a("cancel",t)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._missingRequired.length>0}
            title=${this._missingRequired.length?this._missingRequired.map(i=>a("err_required",t).replace("{field}",a(O[i]??i,t))).join(" \xB7 "):""}
          >
            ${this._loading?a("completing",t):a("complete",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};l.styles=[P,z,y`
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
  `],s([d({attribute:!1})],l.prototype,"hass",2),s([d()],l.prototype,"entryId",2),s([d()],l.prototype,"taskId",2),s([d()],l.prototype,"taskName",2),s([d()],l.prototype,"lang",2),s([d({type:Array})],l.prototype,"checklist",2),s([d({type:Boolean})],l.prototype,"adaptiveEnabled",2),s([d()],l.prototype,"taskType",2),s([d()],l.prototype,"readingUnit",2),s([d({attribute:!1})],l.prototype,"readings",2),s([d({attribute:!1})],l.prototype,"readingHistory",2),s([d({attribute:!1})],l.prototype,"restockDefault",2),s([d({attribute:!1})],l.prototype,"restockUnitCost",2),s([d()],l.prototype,"currencySymbol",2),s([d({attribute:!1})],l.prototype,"parts",2),s([d({attribute:!1})],l.prototype,"consumesParts",2),s([d({type:Array})],l.prototype,"consumesInfo",2),s([d({type:Array})],l.prototype,"requiredFields",2),s([d()],l.prototype,"phaseLabel",2),s([d({type:Boolean})],l.prototype,"requireTagScan",2),s([d({type:Boolean})],l.prototype,"viaTagScan",2),s([m()],l.prototype,"_open",2),s([m()],l.prototype,"_notes",2),s([m()],l.prototype,"_cost",2),s([m()],l.prototype,"_duration",2),s([m()],l.prototype,"_loading",2),s([m()],l.prototype,"_error",2),s([m()],l.prototype,"_checklistState",2),s([m()],l.prototype,"_feedback",2),s([m()],l.prototype,"_readingValue",2),s([m()],l.prototype,"_readingValues",2),s([m()],l.prototype,"_restockQty",2),s([m()],l.prototype,"_completedAt",2),s([m()],l.prototype,"_usedParts",2),s([d({attribute:!1})],l.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",l);export{I as a,N as b,U as c,w as d,V as e,j as f,z as g,$ as h,l as i};
