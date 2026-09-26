/*! maintenance_supporter frontend 2.92.0 */
import{d as F,e as E}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-RPKRRGNH.js";import{a as x,g as L,l as z}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LRA24W74.js";import{a as R}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-WUNURNPY.js";import{M as q,a as s,b as y,c as o,f as p,h as k,l,m,q as r,x as T,y as A}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-QW6QOGEY.js";var $=class{constructor(d,e){this.host=d;this.opts=e;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this.max=e.max??10,d.addController(this)}hostConnected(){}get ids(){return this.photos.map(d=>d.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(d){return this.errorKey?r(this.errorKey,d).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(d=[]){this._revokeAll(),this.photos=d.map(e=>({id:e,preview:""})),this.uploadedIds=[],this.uploading=!1,this.errorKey="",this.host.requestUpdate()}async addFiles(d){if(d.length===0)return;let e=d.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let t of e){let i=await F(this.opts.hass(),this.opts.entryId(),t);this.uploadedIds=[...this.uploadedIds,i],this.photos=[...this.photos,{id:i,preview:URL.createObjectURL(t)}],this.host.requestUpdate()}d.length>e.length&&(this.errorKey="photos_limit")}catch(t){this.errorKey=t instanceof Error&&t.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{this.uploading=!1,this.host.requestUpdate()}}remove(d){let e=this.photos.find(t=>t.id===d);e?.preview&&URL.revokeObjectURL(e.preview),this.photos=this.photos.filter(t=>t.id!==d),this.uploadedIds.includes(d)&&(this.uploadedIds=this.uploadedIds.filter(t=>t!==d),E(this.opts.hass(),[d])),this.host.requestUpdate()}discardOrphans(){if(this.uploadedIds.length===0)return;let d=this.uploadedIds;this.uploadedIds=[],E(this.opts.hass(),d)}markAttached(){this.uploadedIds=[]}_revokeAll(){for(let d of this.photos)d.preview&&URL.revokeObjectURL(d.preview)}};function w(){if(window.externalApp!==void 0)return!0;let d=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(d)&&/Android/.test(d)}var I={objectSections:"msp-object-sections",printOptions:"msp-print-options",batteryRosterOpen:"msp-bf-roster-open",docSort:"msp-doc-sort",cameraDevice:"msp-camera-device",overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort"};function N(g){try{return localStorage.getItem(g)}catch{return null}}function P(g,d){try{localStorage.setItem(g,d)}catch{}}function C(){if(!w())return!1;let g=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!g&&typeof g.getUserMedia=="function"}var U=1920,j=.88,b=class extends k{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._devices=[];this._deviceIndex=-1;this._switchFailed=!1;this._facing="environment";this._stream=null}async open(){if(this._open)return;let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||typeof e.getUserMedia!="function"){this._unavailable("no_media_devices");return}let t=N(I.cameraDevice),i=!1;if(t)try{this._stream=await e.getUserMedia({video:{deviceId:{exact:t}},audio:!1}),i=!0}catch{}if(!i){try{this._stream=await e.getUserMedia({video:{facingMode:{ideal:"environment"},zoom:1,advanced:[{zoom:1}]},audio:!1})}catch(c){this._unavailable(c instanceof Error?c.name||c.message:String(c));return}if(await this._preferMainBackCamera(e),!this._stream)return}await this._applyZoomOne(),await this._listDevices(e),this._deviceIndex=this._indexOfCurrent(t&&i?t:null),this._switchFailed=!1,this._facing=this._stream?.getVideoTracks()[0]?.getSettings().facingMode??"environment",this._open=!0,await this.updateComplete;let a=this._video;if(a&&this._stream){a.srcObject=this._stream;try{await a.play()}catch{}}}async _preferMainBackCamera(e){if(typeof e.enumerateDevices!="function")return;let t=[];try{t=await e.enumerateDevices()}catch{return}let i=u=>{let h=/camera2?\s*(\d+)/i.exec(u.label);return h?Number(h[1]):Number.MAX_SAFE_INTEGER},a=t.filter(u=>u.kind==="videoinput"&&u.deviceId&&/back|rear|environment|rück|hinten/i.test(u.label)).sort((u,h)=>i(u)-i(h)),v=this._stream?.getVideoTracks()[0]?.getSettings().deviceId;if(a.length>1&&a[0].deviceId!==v){let u=v?[{deviceId:{exact:v}}]:[];u.push({facingMode:{ideal:"environment"}}),await this._swapCamera(e,[{deviceId:{exact:a[0].deviceId}}],u)===null&&this._unavailable("camera_lost")}}async _swapCamera(e,t,i){this._stopTracks();for(let[a,c]of t.entries())try{return this._stream=await e.getUserMedia({video:c,audio:!1}),a}catch{}for(let a of i)try{return this._stream=await e.getUserMedia({video:a,audio:!1}),-1}catch{}return null}async _attach(){let e=this._video;if(!(!e||!this._stream)){e.srcObject=this._stream;try{await e.play()}catch{}}}async _applyZoomOne(){let e=this._stream?.getVideoTracks()[0],t=e&&typeof e.getCapabilities=="function"?e.getCapabilities():void 0;if(!(!t?.zoom||typeof t.zoom.min!="number"||t.zoom.min>=1||(t.zoom.max??1)<1))for(let i of[{zoom:1},{advanced:[{zoom:1}]}])try{await e.applyConstraints(i);return}catch{}}_indexOfCurrent(e){let t=this._devices.map(a=>a.deviceId),i=this._currentDeviceId;for(let a of[e,i])if(a){let c=t.indexOf(a);if(c>=0)return c}return-1}async _listDevices(e){if(typeof e.enumerateDevices=="function")try{this._devices=(await e.enumerateDevices()).filter(t=>t.kind==="videoinput"&&!!t.deviceId)}catch{this._devices=[]}}get _currentDeviceId(){return this._stream?.getVideoTracks()[0]?.getSettings().deviceId}async _switchCamera(){let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||this._devices.length<2||this._busy)return;let t=this._devices.map(h=>h.deviceId),i=this._currentDeviceId||(this._deviceIndex>=0?t[this._deviceIndex]:void 0),a=this._facing==="user"?"environment":"user",c=[];for(let h=1;h<t.length;h++){let f=(this._deviceIndex+h)%t.length;t[f]===i&&this._deviceIndex<0||c.push(f)}let v=[...c.map(h=>({deviceId:{exact:t[h]}})),{facingMode:{exact:a}},{facingMode:{ideal:a}}],u=i?[{deviceId:{exact:i}}]:[];u.push({facingMode:{ideal:this._facing}}),this._busy=!0;try{let h=await this._swapCamera(e,v,u);if(h===null){this._unavailable("camera_lost");return}h>=0&&h<c.length?(this._deviceIndex=c[h],this._switchFailed=!1,P(I.cameraDevice,t[c[h]])):h>=c.length&&!this._isCamera(i,this._facing)?(this._facing=a,this._deviceIndex=this._indexOfCurrent(null),this._switchFailed=!1):this._switchFailed=!0,await this._applyZoomOne(),await this._attach()}finally{this._busy=!1}}_isCamera(e,t){let i=this._stream?.getVideoTracks()[0]?.getSettings();return e&&i?.deviceId?i.deviceId===e:!!i?.facingMode&&i.facingMode===t}close(){this._stopStream(),this._open=!1,this._busy=!1}disconnectedCallback(){super.disconnectedCallback(),this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){this._stopTracks();let e=this._video;e&&(e.srcObject=null)}_stopTracks(){for(let e of this._stream?.getTracks()??[])e.stop();this._stream=null}_unavailable(e){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:e},bubbles:!0,composed:!0}))}async _shoot(){let e=this._video;if(!(!e||this._busy)){this._busy=!0;try{let t=e.videoWidth||640,i=e.videoHeight||480,a=Math.min(1,U/Math.max(t,i)),c=document.createElement("canvas");c.width=Math.round(t*a),c.height=Math.round(i*a);let v=c.getContext("2d");if(!v)throw new Error("no_canvas");v.drawImage(e,0,0,c.width,c.height);let u=await new Promise(S=>c.toBlob(S,"image/jpeg",j));if(!u)throw new Error("no_blob");let h=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),f=new File([u],`photo-${h}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:f},bubbles:!0,composed:!0}))}catch(t){this._unavailable(t instanceof Error?t.message:String(t))}finally{this._busy=!1}}}render(){if(!this._open)return p;let e=this.lang;return o`
      <div class="overlay" role="dialog" aria-modal="true" aria-label=${r("doc_camera",e)}>
        <video autoplay playsinline muted></video>
        ${this._switchFailed?o`<div class="switch-note" role="status">${r("camera_switch_failed",e)}</div>`:p}
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${r("cancel",e)}</button>
          ${this._devices.length>1?o`<button type="button" class="switch" ?disabled=${this._busy} title=${r("camera_switch_lens",e)} aria-label=${r("camera_switch_lens",e)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
                <span class="switch-pos">${this._deviceIndex>=0?`${this._deviceIndex+1}/${this._devices.length}`:`?/${this._devices.length}`}</span>
              </button>`:p}
          <button type="button" class="shoot" ?disabled=${this._busy} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${r("camera_capture_shoot",e)}</span>
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
    .switch-pos { font-size: 12px; opacity: 0.85; }
    .switch-note { position: absolute; left: 12px; right: 12px; bottom: 84px; text-align: center; color: #fff; font-size: 13px; text-shadow: 0 1px 2px #000; }
    .shoot { background: var(--primary-color, #03a9f4); color: #fff; border: none; font-weight: 600; }
    .shoot[disabled] { opacity: 0.6; cursor: default; }
    .shoot ha-icon { --mdc-icon-size: 22px; }
  `,s([l({type:String})],b.prototype,"lang",2),s([m()],b.prototype,"_open",2),s([m()],b.prototype,"_busy",2),s([m()],b.prototype,"_devices",2),s([m()],b.prototype,"_deviceIndex",2),s([m()],b.prototype,"_switchFailed",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",b);var H=y`
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
`,_=class extends k{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=w();this._inAppCamera=C()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(e){e.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target,i=Array.from(t.files??[]);t.value="",this._emit(i)}_onCameraClick(e){!this._inAppCamera||this._locked||(e.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),!this._locked&&e.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return p;let e=this.lang,t=this._locked?"disabled":"",i=this.busy?r("uploading",e):r("doc_camera",e),a=r(this._singlePick?"choose_photo":"choose_photos",e);return o`
      <div class="photo-pickers">
        ${this.showCamera?o`<label class="photo-pick photo-pick-camera ${t}" role="button" tabindex="0"
              aria-label=${i} title=${this.compact?i:p}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?p:o`<span>${i}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
        ${this.showGallery?o`<label class="photo-pick photo-pick-gallery ${t}" role="button" tabindex="0"
              aria-label=${a} title=${this.compact?a:p}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?p:o`<span>${a}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
      </div>
      ${this.showGallery&&this._singlePick?o`<div class="photo-android-hint">${r("photos_android_hint",e)}</div>`:p}
      ${this.showCamera&&this._inAppCamera?o`<ms-camera-capture .lang=${e}
            @photo-captured=${c=>this._emit([c.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:p}
    `}};s([l({type:String})],_.prototype,"lang",2),s([l({type:Boolean})],_.prototype,"disabled",2),s([l({type:Boolean})],_.prototype,"busy",2),s([l({type:String})],_.prototype,"accept",2),s([l({type:Boolean})],_.prototype,"showCamera",2),s([l({type:Boolean})],_.prototype,"showGallery",2),s([l({type:Boolean})],_.prototype,"compact",2),s([l({type:Number})],_.prototype,"remaining",2),s([m()],_.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",_);var n=class extends k{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.currencySymbol="";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new $(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this.checklistPrefill={}}open(e={}){this._open||(this._open=!0,this.viaTagScan=!!e.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((t,i)=>[String(i),!!this.checklistPrefill[t]]).filter(([,t])=>t)),this._feedback="needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(t=>[x(t),{...t}])))}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _complete(){this._loading=!0,this._error="",this._photos.clearError();try{let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(e.notes=this._notes),this._cost){let t=parseFloat(this._cost);!isNaN(t)&&t>=0&&(e.cost=t)}if(this._duration){let t=parseInt(this._duration,10);!isNaN(t)&&t>=0&&(e.duration=t)}if(this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photos.photos.length>0&&(e.photo_doc_ids=this._photos.ids),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(new Date(this._completedAt).getTime()>Date.now()){this._error=r("completed_at_future_error",this.lang),this._loading=!1;return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let t={};for(let i of this.readings){let a=(this._readingValues[i.id]??"").trim();if(a==="")continue;let c=parseFloat(a.replace(",","."));isNaN(c)||(t[i.id]=c)}Object.keys(t).length>0&&(e.reading_values=t)}else if(this._readingValue!==""){let t=parseFloat(this._readingValue);isNaN(t)||(e.reading_value=t)}if(this.restockDefault!==null&&this._restockQty!==""){let t=parseFloat(this._restockQty);!isNaN(t)&&t>=1&&(e.restock_quantity=t)}this.parts.length>0&&(e.used_parts=Object.values(this._usedParts).filter(t=>Number.isFinite(t.quantity)&&t.quantity>0).map(t=>t.entry_id?{part_id:t.part_id,quantity:t.quantity,entry_id:t.entry_id}:{part_id:t.part_id,quantity:t.quantity})),await this.hass.connection.sendMessagePromise(e),this._photos.markAttached(),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(e){this._error=R(e,this.lang,r("save_error",this.lang))}finally{this._loading=!1}}_renderReadingField(e,t){let i=this._completedAt?new Date(this._completedAt).getTime():NaN,a=L(this.readingHistory,e.id,isNaN(i)?void 0:i),c=e.unit||this.readingUnit,v=(this._readingValues[e.id]??"").trim(),u=v===""?NaN:parseFloat(v.replace(",",".")),h=a!==void 0&&!isNaN(u)&&u<a.value,f=a!==void 0?T(a.value,t,{maximumFractionDigits:3}):"";return o`
      <label class="field reading-field">
        <span class="field-label">${e.name}${c?` (${c})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${a!==void 0?r("reading_last",t).replace("{value}",f):""}
          .value=${this._readingValues[e.id]??""}
          @input=${S=>{this._readingValues={...this._readingValues,[e.id]:S.target.value}}} />
        ${h?o`<span class="reading-warn">${r("reading_below_last",t).replace("{value}",f)}</span>`:p}
      </label>`}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(t=>!e[t])}_req(e){return this.requiredFields.includes(e)?o`<span class="req-mark" aria-hidden="true">*</span>`:p}_partsCostSuggestion(){if(this.restockDefault!==null){let i=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(i)||i<=0?null:Math.round(this.restockUnitCost*i*100)/100}if(!this.parts.length)return null;let e=0,t=!1;for(let i of Object.values(this._usedParts)){let a=this.parts.find(c=>x({part_id:c.id,entry_id:c.entry_id})===x(i));a?.cost!=null&&(e+=a.cost*(i.quantity||1),t=!0)}return t?Math.round(e*100)/100:null}_renderCostSuggestion(e){if(this._cost.trim()!=="")return p;let t=this._partsCostSuggestion();if(t==null||t<=0)return p;let i=A(t,this.currencySymbol,e);return o`<button
      type="button"
      class="cost-suggestion"
      @click=${()=>this._cost=String(Math.round(t*100)/100)}
    >${r("cost_from_parts",e).replace("{amount}",i)}</button>`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){let e=new Date,t=i=>String(i).padStart(2,"0");this._completedAt=`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}T${t(e.getHours())}:${t(e.getMinutes())}:00`}render(){if(!this._open)return o``;let e=this.lang||this.hass?.language||"en",t=this._error||this._photos.errorText(e);return o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${r("complete_title",e)}${this.taskName}</div>
        ${this.phaseLabel?o`<div class="phase-line">${r("phase_current",e)}: ${this.phaseLabel}</div>`:p}
        ${this.requireTagScan&&!this.viaTagScan?o`<div class="scan-required-note">${r("require_tag_scan_hint",e)}</div>`:p}
        <div class="content">
          ${t?o`<div class="error">${t}</div>`:p}
          ${this.checklist.length>0?o`
            <div class="checklist-section">
              <label class="checklist-label">${r("checklist",e)}</label>
              ${this.checklist.map((i,a)=>o`
                <label class="checklist-item" @click=${()=>this._toggleCheck(a)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(a)]} />
                  <span>${i}</span>
                </label>
              `)}
            </div>
          `:p}
          ${this.readings.length>0?o`<div class="readings-block">
                <span class="field-label">${r("readings_section",e)}</span>
                ${this.readings.map(i=>this._renderReadingField(i,e))}
              </div>`:this.taskType==="reading"?o`
              <label class="field">
                <span class="field-label">${r("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${i=>this._readingValue=i.target.value} />
              </label>`:p}
          ${this.parts.length?o`<div class="used-parts">
                <span class="field-label">${r("complete_parts_used",e)}</span>
                ${this.parts.map(i=>{let a=x({part_id:i.id,entry_id:i.entry_id}),c=this._usedParts[a],v=c!==void 0,u=i.entry_id?{part_id:i.id,quantity:1,entry_id:i.entry_id}:{part_id:i.id,quantity:1};return o`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${v}
                        @change=${h=>{let f={...this._usedParts};h.target.checked?f[a]=f[a]||u:delete f[a],this._usedParts=f}} />
                      <span
                        >${i.name}${i.owner_name?o`<span class="used-part-owner"> (${i.owner_name})</span>`:p}${i.stock!==null&&i.stock!==void 0?` (${i.stock}${i.unit?" "+i.unit:""})`:""}</span
                      >
                    </label>
                    ${v?o`<input class="used-part-qty" type="number" min="0.01" max="999" step="0.01"
                          .value=${String(c.quantity)}
                          @input=${h=>{let f=parseFloat(h.target.value);this._usedParts={...this._usedParts,[a]:{...u,quantity:Number.isFinite(f)&&f>=.01?f:1}}}} />`:p}
                  </div>`})}
              </div>`:this.consumesInfo.length?o`<div class="consumes-hint">
                  ${this.consumesInfo.map(i=>o`<div>${i}</div>`)}
                </div>`:p}
          ${this.restockDefault!==null?o`
              <label class="field">
                <span class="field-label">${r("restock_quantity_label",e)}</span>
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
            <span class="field-label">${r("notes_optional",e)}${this._req("notes")}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${i=>this._notes=i.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${r("cost_optional",e)}${this._req("cost")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${i=>this._cost=i.target.value} />
            ${this._renderCostSuggestion(e)}
          </label>
          <label class="field">
            <span class="field-label">${r("duration_minutes",e)}${this._req("duration")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._duration}
              @input=${i=>this._duration=i.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${r("completed_at_optional",e)}</span>
            ${this._completedAt?o`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${e}
                  .value=${this._completedAt}
                  @value-changed=${i=>this._completedAt=i.detail.value}
                ></ms-date-field>`:o`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${r("completed_at_pick",e)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${r("completion_photos_optional",e)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?o`<div class="photo-strip">
                  ${this._photos.photos.map(i=>o`
                    <div class="photo-preview">
                      <img src=${i.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(i.id)}
                        title="${r("remove",e)}">✕</button>
                    </div>`)}
                </div>`:p}
            ${this._photos.full?o`<div class="photo-limit">${r("photos_limit",e).replace("{max}",String(this._photos.max))}</div>`:o`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${i=>this._photos.addFiles(i.detail.files)}
                ></ms-photo-picker>`}
          </div>
          ${this.adaptiveEnabled?o`
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
          `:p}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${r("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._missingRequired.length>0}
            title=${this._missingRequired.length?this._missingRequired.map(i=>r("err_required",e).replace("{field}",r(z[i]??i,e))).join(" \xB7 "):""}
          >
            ${this._loading?r("completing",e):r("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};n.styles=[q,H,y`
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
  `],s([l({attribute:!1})],n.prototype,"hass",2),s([l()],n.prototype,"entryId",2),s([l()],n.prototype,"taskId",2),s([l()],n.prototype,"taskName",2),s([l()],n.prototype,"lang",2),s([l({type:Array})],n.prototype,"checklist",2),s([l({type:Boolean})],n.prototype,"adaptiveEnabled",2),s([l()],n.prototype,"taskType",2),s([l()],n.prototype,"readingUnit",2),s([l({attribute:!1})],n.prototype,"readings",2),s([l({attribute:!1})],n.prototype,"readingHistory",2),s([l({attribute:!1})],n.prototype,"restockDefault",2),s([l({attribute:!1})],n.prototype,"restockUnitCost",2),s([l()],n.prototype,"currencySymbol",2),s([l({attribute:!1})],n.prototype,"parts",2),s([l({attribute:!1})],n.prototype,"consumesParts",2),s([l({type:Array})],n.prototype,"consumesInfo",2),s([l({type:Array})],n.prototype,"requiredFields",2),s([l()],n.prototype,"phaseLabel",2),s([l({type:Boolean})],n.prototype,"requireTagScan",2),s([l({type:Boolean})],n.prototype,"viaTagScan",2),s([m()],n.prototype,"_open",2),s([m()],n.prototype,"_notes",2),s([m()],n.prototype,"_cost",2),s([m()],n.prototype,"_duration",2),s([m()],n.prototype,"_loading",2),s([m()],n.prototype,"_error",2),s([m()],n.prototype,"_checklistState",2),s([m()],n.prototype,"_feedback",2),s([m()],n.prototype,"_readingValue",2),s([m()],n.prototype,"_readingValues",2),s([m()],n.prototype,"_restockQty",2),s([m()],n.prototype,"_completedAt",2),s([m()],n.prototype,"_usedParts",2),s([l({attribute:!1})],n.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",n);export{I as a,N as b,P as c,w as d,H as e,$ as f,n as g};
