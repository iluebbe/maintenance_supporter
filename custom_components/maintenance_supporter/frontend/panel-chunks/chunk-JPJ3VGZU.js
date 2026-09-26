/*! maintenance_supporter frontend 2.92.0 */
import{d as P,e as A}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-RPKRRGNH.js";import{a as w,g as F,k as N,m as O}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-DDPAXPRO.js";import{a as z}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-PJQDDU52.js";import{M as R,a as r,b as x,c as n,f as p,h as k,l,m,q as a,x as S,y as L}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LTBDMOCY.js";var T=class{constructor(d,e){this.host=d;this.opts=e;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this.max=e.max??10,d.addController(this)}hostConnected(){}get ids(){return this.photos.map(d=>d.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(d){return this.errorKey?a(this.errorKey,d).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(d=[]){this._revokeAll(),this.photos=d.map(e=>({id:e,preview:""})),this.uploadedIds=[],this.uploading=!1,this.errorKey="",this.host.requestUpdate()}async addFiles(d){if(d.length===0)return;let e=d.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let i of e){let t=await P(this.opts.hass(),this.opts.entryId(),i);this.uploadedIds=[...this.uploadedIds,t],this.photos=[...this.photos,{id:t,preview:URL.createObjectURL(i)}],this.host.requestUpdate()}d.length>e.length&&(this.errorKey="photos_limit")}catch(i){this.errorKey=i instanceof Error&&i.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{this.uploading=!1,this.host.requestUpdate()}}remove(d){let e=this.photos.find(i=>i.id===d);e?.preview&&URL.revokeObjectURL(e.preview),this.photos=this.photos.filter(i=>i.id!==d),this.uploadedIds.includes(d)&&(this.uploadedIds=this.uploadedIds.filter(i=>i!==d),A(this.opts.hass(),[d])),this.host.requestUpdate()}discardOrphans(){if(this.uploadedIds.length===0)return;let d=this.uploadedIds;this.uploadedIds=[],A(this.opts.hass(),d)}markAttached(){this.uploadedIds=[]}_revokeAll(){for(let d of this.photos)d.preview&&URL.revokeObjectURL(d.preview)}};function I(){if(window.externalApp!==void 0)return!0;let d=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(d)&&/Android/.test(d)}var q={objectSections:"msp-object-sections",printOptions:"msp-print-options",batteryRosterOpen:"msp-bf-roster-open",docSort:"msp-doc-sort",cameraDevice:"msp-camera-device",overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort"};function U(g){try{return localStorage.getItem(g)}catch{return null}}function C(g,d){try{localStorage.setItem(g,d)}catch{}}function H(){if(!I())return!1;let g=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!g&&typeof g.getUserMedia=="function"}var Q=1920,M=.88,y=class extends k{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._devices=[];this._deviceIndex=-1;this._switchFailed=!1;this._facing="environment";this._stream=null;this._opening=!1}async open(){if(!(this._open||this._opening)){this._opening=!0;try{await this._acquireAndShow()}finally{this._opening=!1}}}async _acquireAndShow(){let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||typeof e.getUserMedia!="function"){this._unavailable("no_media_devices");return}let i=U(q.cameraDevice),t=!1;if(i)try{this._stream=await e.getUserMedia({video:{deviceId:{exact:i}},audio:!1}),t=!0}catch{}if(!t){try{this._stream=await e.getUserMedia({video:{facingMode:{ideal:"environment"},zoom:1,advanced:[{zoom:1}]},audio:!1})}catch(o){this._unavailable(o instanceof Error?o.name||o.message:String(o));return}if(await this._preferMainBackCamera(e),!this._stream)return}await this._applyZoomOne(),await this._listDevices(e),this._deviceIndex=this._indexOfCurrent(i&&t?i:null),this._switchFailed=!1,this._facing=this._stream?.getVideoTracks()[0]?.getSettings().facingMode??"environment",this._open=!0,await this.updateComplete;let s=this._video;if(s&&this._stream){s.srcObject=this._stream;try{await s.play()}catch{}}}async _preferMainBackCamera(e){if(typeof e.enumerateDevices!="function")return;let i=[];try{i=await e.enumerateDevices()}catch{return}let t=u=>{let h=/camera2?\s*(\d+)/i.exec(u.label);return h?Number(h[1]):Number.MAX_SAFE_INTEGER},s=i.filter(u=>u.kind==="videoinput"&&u.deviceId&&/back|rear|environment|rück|hinten/i.test(u.label)).sort((u,h)=>t(u)-t(h)),f=this._stream?.getVideoTracks()[0]?.getSettings().deviceId;if(s.length>1&&s[0].deviceId!==f){let u=f?[{deviceId:{exact:f}}]:[];u.push({facingMode:{ideal:"environment"}}),await this._swapCamera(e,[{deviceId:{exact:s[0].deviceId}}],u)===null&&this._unavailable("camera_lost")}}async _swapCamera(e,i,t){this._stopTracks();for(let[s,o]of i.entries())try{return this._stream=await e.getUserMedia({video:o,audio:!1}),s}catch{}for(let s of t)try{return this._stream=await e.getUserMedia({video:s,audio:!1}),-1}catch{}return null}async _attach(){let e=this._video;if(!(!e||!this._stream)){e.srcObject=this._stream;try{await e.play()}catch{}}}async _applyZoomOne(){let e=this._stream?.getVideoTracks()[0],i=e&&typeof e.getCapabilities=="function"?e.getCapabilities():void 0;if(!(!i?.zoom||typeof i.zoom.min!="number"||i.zoom.min>=1||(i.zoom.max??1)<1))for(let t of[{zoom:1},{advanced:[{zoom:1}]}])try{await e.applyConstraints(t);return}catch{}}_indexOfCurrent(e){let i=this._devices.map(s=>s.deviceId),t=this._currentDeviceId;for(let s of[e,t])if(s){let o=i.indexOf(s);if(o>=0)return o}return-1}async _listDevices(e){if(typeof e.enumerateDevices=="function")try{this._devices=(await e.enumerateDevices()).filter(i=>i.kind==="videoinput"&&!!i.deviceId)}catch{this._devices=[]}}get _currentDeviceId(){return this._stream?.getVideoTracks()[0]?.getSettings().deviceId}async _switchCamera(){let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||this._devices.length<2||this._busy)return;let i=this._devices.map(h=>h.deviceId),t=this._currentDeviceId||(this._deviceIndex>=0?i[this._deviceIndex]:void 0),s=this._facing==="user"?"environment":"user",o=[];for(let h=1;h<i.length;h++){let _=(this._deviceIndex+h)%i.length;i[_]===t&&this._deviceIndex<0||o.push(_)}let f=[...o.map(h=>({deviceId:{exact:i[h]}})),{facingMode:{exact:s}},{facingMode:{ideal:s}}],u=t?[{deviceId:{exact:t}}]:[];u.push({facingMode:{ideal:this._facing}}),this._busy=!0;try{let h=await this._swapCamera(e,f,u);if(h===null){this._unavailable("camera_lost");return}h>=0&&h<o.length?(this._deviceIndex=o[h],this._switchFailed=!1,C(q.cameraDevice,i[o[h]])):h>=o.length&&!this._isCamera(t,this._facing)?(this._facing=s,this._deviceIndex=this._indexOfCurrent(null),this._switchFailed=!1):this._switchFailed=!0,await this._applyZoomOne(),await this._attach()}finally{this._busy=!1}}_isCamera(e,i){let t=this._stream?.getVideoTracks()[0]?.getSettings();return e&&t?.deviceId?t.deviceId===e:!!t?.facingMode&&t.facingMode===i}close(){this._stopStream(),this._open=!1,this._busy=!1}disconnectedCallback(){super.disconnectedCallback(),this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){this._stopTracks();let e=this._video;e&&(e.srcObject=null)}_stopTracks(){for(let e of this._stream?.getTracks()??[])e.stop();this._stream=null}_unavailable(e){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:e},bubbles:!0,composed:!0}))}async _shoot(){let e=this._video;if(!(!e||this._busy)){this._busy=!0;try{let i=e.videoWidth||640,t=e.videoHeight||480,s=Math.min(1,Q/Math.max(i,t)),o=document.createElement("canvas");o.width=Math.round(i*s),o.height=Math.round(t*s);let f=o.getContext("2d");if(!f)throw new Error("no_canvas");f.drawImage(e,0,0,o.width,o.height);let u=await new Promise(b=>o.toBlob(b,"image/jpeg",M));if(!u)throw new Error("no_blob");let h=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),_=new File([u],`photo-${h}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:_},bubbles:!0,composed:!0}))}catch(i){this._unavailable(i instanceof Error?i.message:String(i))}finally{this._busy=!1}}}render(){if(!this._open)return p;let e=this.lang;return n`
      <div class="overlay" role="dialog" aria-modal="true" aria-label=${a("doc_camera",e)}>
        <video autoplay playsinline muted></video>
        ${this._switchFailed?n`<div class="switch-note" role="status">${a("camera_switch_failed",e)}</div>`:p}
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${a("cancel",e)}</button>
          ${this._devices.length>1?n`<button type="button" class="switch" ?disabled=${this._busy} title=${a("camera_switch_lens",e)} aria-label=${a("camera_switch_lens",e)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
                <span class="switch-pos">${this._deviceIndex>=0?`${this._deviceIndex+1}/${this._devices.length}`:`?/${this._devices.length}`}</span>
              </button>`:p}
          <button type="button" class="shoot" ?disabled=${this._busy} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${a("camera_capture_shoot",e)}</span>
          </button>
        </div>
      </div>
    `}};y.styles=x`
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
  `,r([l({type:String})],y.prototype,"lang",2),r([m()],y.prototype,"_open",2),r([m()],y.prototype,"_busy",2),r([m()],y.prototype,"_devices",2),r([m()],y.prototype,"_deviceIndex",2),r([m()],y.prototype,"_switchFailed",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",y);var j=x`
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
`,v=class extends k{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=I();this._inAppCamera=H()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(e){e.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:e},bubbles:!0,composed:!0}))}_onInput(e){let i=e.target,t=Array.from(i.files??[]);i.value="",this._emit(t)}_onCameraClick(e){!this._inAppCamera||this._locked||(e.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),!this._locked&&e.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return p;let e=this.lang,i=this._locked?"disabled":"",t=this.busy?a("uploading",e):a("doc_camera",e),s=a(this._singlePick?"choose_photo":"choose_photos",e);return n`
      <div class="photo-pickers">
        ${this.showCamera?n`<label class="photo-pick photo-pick-camera ${i}" role="button" tabindex="0"
              aria-label=${t} title=${this.compact?t:p}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?p:n`<span>${t}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
        ${this.showGallery?n`<label class="photo-pick photo-pick-gallery ${i}" role="button" tabindex="0"
              aria-label=${s} title=${this.compact?s:p}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?p:n`<span>${s}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
      </div>
      ${this.showGallery&&this._singlePick?n`<div class="photo-android-hint">${a("photos_android_hint",e)}</div>`:p}
      ${this.showCamera&&this._inAppCamera?n`<ms-camera-capture .lang=${e}
            @photo-captured=${o=>this._emit([o.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:p}
    `}};r([l({type:String})],v.prototype,"lang",2),r([l({type:Boolean})],v.prototype,"disabled",2),r([l({type:Boolean})],v.prototype,"busy",2),r([l({type:String})],v.prototype,"accept",2),r([l({type:Boolean})],v.prototype,"showCamera",2),r([l({type:Boolean})],v.prototype,"showGallery",2),r([l({type:Boolean})],v.prototype,"compact",2),r([l({type:Number})],v.prototype,"remaining",2),r([m()],v.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",v);var $=[.01,999],E=[.01,9999],c=class extends k{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.currencySymbol="";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new T(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this._usedQtyText={};this.checklistPrefill={}}open(e={}){this._open||(this._open=!0,this.viaTagScan=!!e.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((i,t)=>[String(t),!!this.checklistPrefill[i]]).filter(([,i])=>i)),this._feedback="needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(i=>[w(i),{...i}])),this._usedQtyText={})}_rangeError(e,i){let t=this.lang;return a("settings_value_out_of_range",t).replace("{min}",S(e,t,{maximumFractionDigits:2})).replace("{max}",S(i,t,{maximumFractionDigits:2}))}_toggleCheck(e){let i=String(e);this._checklistState={...this._checklistState,[i]:!this._checklistState[i]}}_setFeedback(e){this._feedback=e}async _complete(){this._loading=!0,this._error="",this._photos.clearError();try{let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(e.notes=this._notes),this._cost){let t=parseFloat(this._cost);!isNaN(t)&&t>=0&&(e.cost=t)}let i=N(this._duration);if(i!==null&&(e.duration=i),this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photos.photos.length>0&&(e.photo_doc_ids=this._photos.ids),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(new Date(this._completedAt).getTime()>Date.now()){this._error=a("completed_at_future_error",this.lang),this._loading=!1;return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let t={};for(let s of this.readings){let o=(this._readingValues[s.id]??"").trim();if(o==="")continue;let f=parseFloat(o.replace(",","."));isNaN(f)||(t[s.id]=f)}Object.keys(t).length>0&&(e.reading_values=t)}else if(this._readingValue!==""){let t=parseFloat(this._readingValue);isNaN(t)||(e.reading_value=t)}if(this.restockDefault!==null&&this._restockQty.trim()!==""){let t=parseFloat(this._restockQty.replace(",","."));if(!Number.isFinite(t)||t<E[0]||t>E[1]){this._error=this._rangeError(...E),this._loading=!1;return}e.restock_quantity=t}if(this.parts.length>0){let t=[];for(let[s,o]of Object.entries(this._usedParts)){let f=this._usedQtyText[s],u=f===void 0?o.quantity:parseFloat(f.replace(",","."));if(!Number.isFinite(u)||u<$[0]||u>$[1]){this._error=this._rangeError(...$),this._loading=!1;return}t.push({...o,quantity:u})}e.used_parts=t.map(s=>s.entry_id?{part_id:s.part_id,quantity:s.quantity,entry_id:s.entry_id}:{part_id:s.part_id,quantity:s.quantity})}await this.hass.connection.sendMessagePromise(e),this._photos.markAttached(),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(e){this._error=z(e,this.lang,a("save_error",this.lang))}finally{this._loading=!1}}_renderReadingField(e,i){let t=this._completedAt?new Date(this._completedAt).getTime():NaN,s=F(this.readingHistory,e.id,isNaN(t)?void 0:t),o=e.unit||this.readingUnit,f=(this._readingValues[e.id]??"").trim(),u=f===""?NaN:parseFloat(f.replace(",",".")),h=s!==void 0&&!isNaN(u)&&u<s.value,_=s!==void 0?S(s.value,i,{maximumFractionDigits:3}):"";return n`
      <label class="field reading-field">
        <span class="field-label">${e.name}${o?` (${o})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${s!==void 0?a("reading_last",i).replace("{value}",_):""}
          .value=${this._readingValues[e.id]??""}
          @input=${b=>{this._readingValues={...this._readingValues,[e.id]:b.target.value}}} />
        ${h?n`<span class="reading-warn">${a("reading_below_last",i).replace("{value}",_)}</span>`:p}
      </label>`}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(i=>!e[i])}_req(e){return this.requiredFields.includes(e)?n`<span class="req-mark" aria-hidden="true">*</span>`:p}_partsCostSuggestion(){if(this.restockDefault!==null){let t=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(t)||t<=0?null:Math.round(this.restockUnitCost*t*100)/100}if(!this.parts.length)return null;let e=0,i=!1;for(let t of Object.values(this._usedParts)){let s=this.parts.find(o=>w({part_id:o.id,entry_id:o.entry_id})===w(t));s?.cost!=null&&(e+=s.cost*(t.quantity||1),i=!0)}return i?Math.round(e*100)/100:null}_renderCostSuggestion(e){if(this._cost.trim()!=="")return p;let i=this._partsCostSuggestion();if(i==null||i<=0)return p;let t=L(i,this.currencySymbol,e);return n`<button
      type="button"
      class="cost-suggestion"
      @click=${()=>this._cost=String(Math.round(i*100)/100)}
    >${a("cost_from_parts",e).replace("{amount}",t)}</button>`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){let e=new Date,i=t=>String(t).padStart(2,"0");this._completedAt=`${e.getFullYear()}-${i(e.getMonth()+1)}-${i(e.getDate())}T${i(e.getHours())}:${i(e.getMinutes())}:00`}render(){if(!this._open)return n``;let e=this.lang||this.hass?.language||"en",i=this._error||this._photos.errorText(e);return n`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${a("complete_title",e)}${this.taskName}</div>
        ${this.phaseLabel?n`<div class="phase-line">${a("phase_current",e)}: ${this.phaseLabel}</div>`:p}
        ${this.requireTagScan&&!this.viaTagScan?n`<div class="scan-required-note">${a("require_tag_scan_hint",e)}</div>`:p}
        <div class="content">
          ${i?n`<div class="error">${i}</div>`:p}
          ${this.checklist.length>0?n`
            <div class="checklist-section">
              <label class="checklist-label">${a("checklist",e)}</label>
              ${this.checklist.map((t,s)=>n`
                <label class="checklist-item" @click=${()=>this._toggleCheck(s)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(s)]} />
                  <span>${t}</span>
                </label>
              `)}
            </div>
          `:p}
          ${this.readings.length>0?n`<div class="readings-block">
                <span class="field-label">${a("readings_section",e)}</span>
                ${this.readings.map(t=>this._renderReadingField(t,e))}
              </div>`:this.taskType==="reading"?n`
              <label class="field">
                <span class="field-label">${a("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${t=>this._readingValue=t.target.value} />
              </label>`:p}
          ${this.parts.length?n`<div class="used-parts">
                <span class="field-label">${a("complete_parts_used",e)}</span>
                ${this.parts.map(t=>{let s=w({part_id:t.id,entry_id:t.entry_id}),o=this._usedParts[s],f=o!==void 0,u=t.entry_id?{part_id:t.id,quantity:1,entry_id:t.entry_id}:{part_id:t.id,quantity:1};return n`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${f}
                        @change=${h=>{let _={...this._usedParts};if(h.target.checked)_[s]=_[s]||u;else{delete _[s];let b={...this._usedQtyText};delete b[s],this._usedQtyText=b}this._usedParts=_}} />
                      <span
                        >${t.name}${t.owner_name?n`<span class="used-part-owner"> (${t.owner_name})</span>`:p}${t.stock!==null&&t.stock!==void 0?` (${t.stock}${t.unit?" "+t.unit:""})`:""}</span
                      >
                    </label>
                    ${f?n`<input class="used-part-qty" type="number" min=${$[0]} max=${$[1]} step="0.01"
                          .value=${this._usedQtyText[s]??String(o.quantity)}
                          @input=${h=>{let _=h.target.value;this._usedQtyText={...this._usedQtyText,[s]:_};let b=parseFloat(_.replace(",","."));Number.isFinite(b)&&b>=$[0]&&(this._usedParts={...this._usedParts,[s]:{...u,quantity:b}})}} />`:p}
                  </div>`})}
              </div>`:this.consumesInfo.length?n`<div class="consumes-hint">
                  ${this.consumesInfo.map(t=>n`<div>${t}</div>`)}
                </div>`:p}
          ${this.restockDefault!==null?n`
              <label class="field">
                <span class="field-label">${a("restock_quantity_label",e)}</span>
                <input type="number" step="0.01" min=${E[0]} max=${E[1]} class="field-input"
                  .value=${this._restockQty}
                  @input=${t=>this._restockQty=t.target.value} />
              </label>`:p}
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
            <input type="number" step="1" min="0" inputmode="numeric" class="field-input"
              .value=${this._duration}
              @input=${t=>this._duration=t.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${a("completed_at_optional",e)}</span>
            ${this._completedAt?n`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${e}
                  .value=${this._completedAt}
                  @value-changed=${t=>this._completedAt=t.detail.value}
                ></ms-date-field>`:n`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${a("completed_at_pick",e)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${a("completion_photos_optional",e)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?n`<div class="photo-strip">
                  ${this._photos.photos.map(t=>n`
                    <div class="photo-preview">
                      <img src=${t.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(t.id)}
                        title="${a("remove",e)}">✕</button>
                    </div>`)}
                </div>`:p}
            ${this._photos.full?n`<div class="photo-limit">${a("photos_limit",e).replace("{max}",String(this._photos.max))}</div>`:n`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${t=>this._photos.addFiles(t.detail.files)}
                ></ms-photo-picker>`}
          </div>
          ${this.adaptiveEnabled?n`
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
          `:p}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${a("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._missingRequired.length>0}
            title=${this._missingRequired.length?this._missingRequired.map(t=>a("err_required",e).replace("{field}",a(O[t]??t,e))).join(" \xB7 "):""}
          >
            ${this._loading?a("completing",e):a("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};c.styles=[R,j,x`
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
  `],r([l({attribute:!1})],c.prototype,"hass",2),r([l()],c.prototype,"entryId",2),r([l()],c.prototype,"taskId",2),r([l()],c.prototype,"taskName",2),r([l()],c.prototype,"lang",2),r([l({type:Array})],c.prototype,"checklist",2),r([l({type:Boolean})],c.prototype,"adaptiveEnabled",2),r([l()],c.prototype,"taskType",2),r([l()],c.prototype,"readingUnit",2),r([l({attribute:!1})],c.prototype,"readings",2),r([l({attribute:!1})],c.prototype,"readingHistory",2),r([l({attribute:!1})],c.prototype,"restockDefault",2),r([l({attribute:!1})],c.prototype,"restockUnitCost",2),r([l()],c.prototype,"currencySymbol",2),r([l({attribute:!1})],c.prototype,"parts",2),r([l({attribute:!1})],c.prototype,"consumesParts",2),r([l({type:Array})],c.prototype,"consumesInfo",2),r([l({type:Array})],c.prototype,"requiredFields",2),r([l()],c.prototype,"phaseLabel",2),r([l({type:Boolean})],c.prototype,"requireTagScan",2),r([l({type:Boolean})],c.prototype,"viaTagScan",2),r([m()],c.prototype,"_open",2),r([m()],c.prototype,"_notes",2),r([m()],c.prototype,"_cost",2),r([m()],c.prototype,"_duration",2),r([m()],c.prototype,"_loading",2),r([m()],c.prototype,"_error",2),r([m()],c.prototype,"_checklistState",2),r([m()],c.prototype,"_feedback",2),r([m()],c.prototype,"_readingValue",2),r([m()],c.prototype,"_readingValues",2),r([m()],c.prototype,"_restockQty",2),r([m()],c.prototype,"_completedAt",2),r([m()],c.prototype,"_usedParts",2),r([m()],c.prototype,"_usedQtyText",2),r([l({attribute:!1})],c.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",c);export{q as a,U as b,C as c,I as d,j as e,T as f,c as g};
