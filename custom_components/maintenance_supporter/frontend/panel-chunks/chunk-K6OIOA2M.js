/*! maintenance_supporter frontend 2.93.0 */
import{a as x,g as q,l as O}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-5JYARIYQ.js";import{a as L}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-RT77EXA5.js";import{M as P,a,b as y,c,f as p,h as k,l,m,q as o,x as T,y as A}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-OAD5LJII.js";function B(f){if(!f)return[];let n=[],e=f.photo_doc_id;typeof e=="string"&&n.push(e);let t=f.photo_doc_ids;Array.isArray(t)&&n.push(...t);let i=[];for(let s of n){if(typeof s!="string")continue;let r=s.trim();if(!(!r||i.includes(r))&&(i.push(r),i.length>=10))break}return i}async function U(f,n,e,t){let i=new FormData;i.append("entry_id",n);for(let _ of t)i.append("tags",_);i.append("file",e,e.name);let s=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${f.auth?.data?.access_token??""}`},body:i});if(s.status===413)throw new Error("doc_too_large");if(!s.ok)throw new Error("doc_upload_failed");let r=await s.json();if(!r.id)throw new Error("doc_upload_failed");return{id:r.id,deduped:!!r.deduped,duplicate_in_object:r.duplicate_in_object??null}}async function H(f,n,e){return(await U(f,n,e,["photo"])).id}async function S(f,n){await Promise.all(n.map(e=>f.connection.sendMessagePromise({type:"maintenance_supporter/documents/delete",doc_id:e}).catch(()=>{})))}var w=class{constructor(n,e){this.host=n;this.opts=e;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this.max=e.max??10,n.addController(this)}hostConnected(){}get ids(){return this.photos.map(n=>n.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(n){return this.errorKey?o(this.errorKey,n).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(n=[]){this._revokeAll(),this.photos=n.map(e=>({id:e,preview:""})),this.uploadedIds=[],this.uploading=!1,this.errorKey="",this.host.requestUpdate()}async addFiles(n){if(n.length===0)return;let e=n.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let t of e){let i=await H(this.opts.hass(),this.opts.entryId(),t);this.uploadedIds=[...this.uploadedIds,i],this.photos=[...this.photos,{id:i,preview:URL.createObjectURL(t)}],this.host.requestUpdate()}n.length>e.length&&(this.errorKey="photos_limit")}catch(t){this.errorKey=t instanceof Error&&t.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{this.uploading=!1,this.host.requestUpdate()}}remove(n){let e=this.photos.find(t=>t.id===n);e?.preview&&URL.revokeObjectURL(e.preview),this.photos=this.photos.filter(t=>t.id!==n),this.uploadedIds.includes(n)&&(this.uploadedIds=this.uploadedIds.filter(t=>t!==n),S(this.opts.hass(),[n])),this.host.requestUpdate()}discardOrphans(){if(this.uploadedIds.length===0)return;let n=this.uploadedIds;this.uploadedIds=[],S(this.opts.hass(),n)}markAttached(){this.uploadedIds=[]}_revokeAll(){for(let n of this.photos)n.preview&&URL.revokeObjectURL(n.preview)}};function $(){if(window.externalApp!==void 0)return!0;let n=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(n)&&/Android/.test(n)}var I={objectSections:"msp-object-sections",printOptions:"msp-print-options",batteryRosterOpen:"msp-bf-roster-open",docSort:"msp-doc-sort",cameraDevice:"msp-camera-device",overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort"};function R(f){try{return localStorage.getItem(f)}catch{return null}}function N(f,n){try{localStorage.setItem(f,n)}catch{}}function z(){if(!$())return!1;let f=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!f&&typeof f.getUserMedia=="function"}var j=1920,M=.88,b=class extends k{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._devices=[];this._deviceIndex=-1;this._switchFailed=!1;this._facing="environment";this._stream=null}async open(){if(this._open)return;let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||typeof e.getUserMedia!="function"){this._unavailable("no_media_devices");return}let t=R(I.cameraDevice),i=!1;if(t)try{this._stream=await e.getUserMedia({video:{deviceId:{exact:t}},audio:!1}),i=!0}catch{}if(!i){try{this._stream=await e.getUserMedia({video:{facingMode:{ideal:"environment"},zoom:1,advanced:[{zoom:1}]},audio:!1})}catch(r){this._unavailable(r instanceof Error?r.name||r.message:String(r));return}if(await this._preferMainBackCamera(e),!this._stream)return}await this._applyZoomOne(),await this._listDevices(e),this._deviceIndex=this._indexOfCurrent(t&&i?t:null),this._switchFailed=!1,this._facing=this._stream?.getVideoTracks()[0]?.getSettings().facingMode??"environment",this._open=!0,await this.updateComplete;let s=this._video;if(s&&this._stream){s.srcObject=this._stream;try{await s.play()}catch{}}}async _preferMainBackCamera(e){if(typeof e.enumerateDevices!="function")return;let t=[];try{t=await e.enumerateDevices()}catch{return}let i=u=>{let h=/camera2?\s*(\d+)/i.exec(u.label);return h?Number(h[1]):Number.MAX_SAFE_INTEGER},s=t.filter(u=>u.kind==="videoinput"&&u.deviceId&&/back|rear|environment|rück|hinten/i.test(u.label)).sort((u,h)=>i(u)-i(h)),_=this._stream?.getVideoTracks()[0]?.getSettings().deviceId;if(s.length>1&&s[0].deviceId!==_){let u=_?[{deviceId:{exact:_}}]:[];u.push({facingMode:{ideal:"environment"}}),await this._swapCamera(e,[{deviceId:{exact:s[0].deviceId}}],u)===null&&this._unavailable("camera_lost")}}async _swapCamera(e,t,i){this._stopTracks();for(let[s,r]of t.entries())try{return this._stream=await e.getUserMedia({video:r,audio:!1}),s}catch{}for(let s of i)try{return this._stream=await e.getUserMedia({video:s,audio:!1}),-1}catch{}return null}async _attach(){let e=this._video;if(!(!e||!this._stream)){e.srcObject=this._stream;try{await e.play()}catch{}}}async _applyZoomOne(){let e=this._stream?.getVideoTracks()[0],t=e&&typeof e.getCapabilities=="function"?e.getCapabilities():void 0;if(!(!t?.zoom||typeof t.zoom.min!="number"||t.zoom.min>=1||(t.zoom.max??1)<1))for(let i of[{zoom:1},{advanced:[{zoom:1}]}])try{await e.applyConstraints(i);return}catch{}}_indexOfCurrent(e){let t=this._devices.map(s=>s.deviceId),i=this._currentDeviceId;for(let s of[e,i])if(s){let r=t.indexOf(s);if(r>=0)return r}return-1}async _listDevices(e){if(typeof e.enumerateDevices=="function")try{this._devices=(await e.enumerateDevices()).filter(t=>t.kind==="videoinput"&&!!t.deviceId)}catch{this._devices=[]}}get _currentDeviceId(){return this._stream?.getVideoTracks()[0]?.getSettings().deviceId}async _switchCamera(){let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||this._devices.length<2||this._busy)return;let t=this._devices.map(h=>h.deviceId),i=this._currentDeviceId||(this._deviceIndex>=0?t[this._deviceIndex]:void 0),s=this._facing==="user"?"environment":"user",r=[];for(let h=1;h<t.length;h++){let g=(this._deviceIndex+h)%t.length;t[g]===i&&this._deviceIndex<0||r.push(g)}let _=[...r.map(h=>({deviceId:{exact:t[h]}})),{facingMode:{exact:s}},{facingMode:{ideal:s}}],u=i?[{deviceId:{exact:i}}]:[];u.push({facingMode:{ideal:this._facing}}),this._busy=!0;try{let h=await this._swapCamera(e,_,u);if(h===null){this._unavailable("camera_lost");return}h>=0&&h<r.length?(this._deviceIndex=r[h],this._switchFailed=!1,N(I.cameraDevice,t[r[h]])):h>=r.length&&!this._isCamera(i,this._facing)?(this._facing=s,this._deviceIndex=this._indexOfCurrent(null),this._switchFailed=!1):this._switchFailed=!0,await this._applyZoomOne(),await this._attach()}finally{this._busy=!1}}_isCamera(e,t){let i=this._stream?.getVideoTracks()[0]?.getSettings();return e&&i?.deviceId?i.deviceId===e:!!i?.facingMode&&i.facingMode===t}close(){this._stopStream(),this._open=!1,this._busy=!1}disconnectedCallback(){super.disconnectedCallback(),this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){this._stopTracks();let e=this._video;e&&(e.srcObject=null)}_stopTracks(){for(let e of this._stream?.getTracks()??[])e.stop();this._stream=null}_unavailable(e){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:e},bubbles:!0,composed:!0}))}async _shoot(){let e=this._video;if(!(!e||this._busy)){this._busy=!0;try{let t=e.videoWidth||640,i=e.videoHeight||480,s=Math.min(1,j/Math.max(t,i)),r=document.createElement("canvas");r.width=Math.round(t*s),r.height=Math.round(i*s);let _=r.getContext("2d");if(!_)throw new Error("no_canvas");_.drawImage(e,0,0,r.width,r.height);let u=await new Promise(E=>r.toBlob(E,"image/jpeg",M));if(!u)throw new Error("no_blob");let h=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),g=new File([u],`photo-${h}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:g},bubbles:!0,composed:!0}))}catch(t){this._unavailable(t instanceof Error?t.message:String(t))}finally{this._busy=!1}}}render(){if(!this._open)return p;let e=this.lang;return c`
      <div class="overlay" role="dialog" aria-modal="true" aria-label=${o("doc_camera",e)}>
        <video autoplay playsinline muted></video>
        ${this._switchFailed?c`<div class="switch-note" role="status">${o("camera_switch_failed",e)}</div>`:p}
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${o("cancel",e)}</button>
          ${this._devices.length>1?c`<button type="button" class="switch" ?disabled=${this._busy} title=${o("camera_switch_lens",e)} aria-label=${o("camera_switch_lens",e)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
                <span class="switch-pos">${this._deviceIndex>=0?`${this._deviceIndex+1}/${this._devices.length}`:`?/${this._devices.length}`}</span>
              </button>`:p}
          <button type="button" class="shoot" ?disabled=${this._busy} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${o("camera_capture_shoot",e)}</span>
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
  `,a([l({type:String})],b.prototype,"lang",2),a([m()],b.prototype,"_open",2),a([m()],b.prototype,"_busy",2),a([m()],b.prototype,"_devices",2),a([m()],b.prototype,"_deviceIndex",2),a([m()],b.prototype,"_switchFailed",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",b);var C=y`
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
`,v=class extends k{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=$();this._inAppCamera=z()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(e){e.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target,i=Array.from(t.files??[]);t.value="",this._emit(i)}_onCameraClick(e){!this._inAppCamera||this._locked||(e.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),!this._locked&&e.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return p;let e=this.lang,t=this._locked?"disabled":"",i=this.busy?o("uploading",e):o("doc_camera",e),s=o(this._singlePick?"choose_photo":"choose_photos",e);return c`
      <div class="photo-pickers">
        ${this.showCamera?c`<label class="photo-pick photo-pick-camera ${t}" role="button" tabindex="0"
              aria-label=${i} title=${this.compact?i:p}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?p:c`<span>${i}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
        ${this.showGallery?c`<label class="photo-pick photo-pick-gallery ${t}" role="button" tabindex="0"
              aria-label=${s} title=${this.compact?s:p}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?p:c`<span>${s}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
      </div>
      ${this.showGallery&&this._singlePick?c`<div class="photo-android-hint">${o("photos_android_hint",e)}</div>`:p}
      ${this.showCamera&&this._inAppCamera?c`<ms-camera-capture .lang=${e}
            @photo-captured=${r=>this._emit([r.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:p}
    `}};a([l({type:String})],v.prototype,"lang",2),a([l({type:Boolean})],v.prototype,"disabled",2),a([l({type:Boolean})],v.prototype,"busy",2),a([l({type:String})],v.prototype,"accept",2),a([l({type:Boolean})],v.prototype,"showCamera",2),a([l({type:Boolean})],v.prototype,"showGallery",2),a([l({type:Boolean})],v.prototype,"compact",2),a([l({type:Number})],v.prototype,"remaining",2),a([m()],v.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",v);var d=class extends k{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.currencySymbol="";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new w(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this.checklistPrefill={}}open(e={}){this._open||(this._open=!0,this.viaTagScan=!!e.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((t,i)=>[String(i),!!this.checklistPrefill[t]]).filter(([,t])=>t)),this._feedback="needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(t=>[x(t),{...t}])))}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _complete(){this._loading=!0,this._error="",this._photos.clearError();try{let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(e.notes=this._notes),this._cost){let t=parseFloat(this._cost);!isNaN(t)&&t>=0&&(e.cost=t)}if(this._duration){let t=parseInt(this._duration,10);!isNaN(t)&&t>=0&&(e.duration=t)}if(this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photos.photos.length>0&&(e.photo_doc_ids=this._photos.ids),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(new Date(this._completedAt).getTime()>Date.now()){this._error=o("completed_at_future_error",this.lang),this._loading=!1;return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let t={};for(let i of this.readings){let s=(this._readingValues[i.id]??"").trim();if(s==="")continue;let r=parseFloat(s.replace(",","."));isNaN(r)||(t[i.id]=r)}Object.keys(t).length>0&&(e.reading_values=t)}else if(this._readingValue!==""){let t=parseFloat(this._readingValue);isNaN(t)||(e.reading_value=t)}if(this.restockDefault!==null&&this._restockQty!==""){let t=parseFloat(this._restockQty);!isNaN(t)&&t>=1&&(e.restock_quantity=t)}this.parts.length>0&&(e.used_parts=Object.values(this._usedParts).filter(t=>Number.isFinite(t.quantity)&&t.quantity>0).map(t=>t.entry_id?{part_id:t.part_id,quantity:t.quantity,entry_id:t.entry_id}:{part_id:t.part_id,quantity:t.quantity})),await this.hass.connection.sendMessagePromise(e),this._photos.markAttached(),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(e){this._error=L(e,this.lang,o("save_error",this.lang))}finally{this._loading=!1}}_renderReadingField(e,t){let i=this._completedAt?new Date(this._completedAt).getTime():NaN,s=q(this.readingHistory,e.id,isNaN(i)?void 0:i),r=e.unit||this.readingUnit,_=(this._readingValues[e.id]??"").trim(),u=_===""?NaN:parseFloat(_.replace(",",".")),h=s!==void 0&&!isNaN(u)&&u<s.value,g=s!==void 0?T(s.value,t,{maximumFractionDigits:3}):"";return c`
      <label class="field reading-field">
        <span class="field-label">${e.name}${r?` (${r})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${s!==void 0?o("reading_last",t).replace("{value}",g):""}
          .value=${this._readingValues[e.id]??""}
          @input=${E=>{this._readingValues={...this._readingValues,[e.id]:E.target.value}}} />
        ${h?c`<span class="reading-warn">${o("reading_below_last",t).replace("{value}",g)}</span>`:p}
      </label>`}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(t=>!e[t])}_req(e){return this.requiredFields.includes(e)?c`<span class="req-mark" aria-hidden="true">*</span>`:p}_partsCostSuggestion(){if(this.restockDefault!==null){let i=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(i)||i<=0?null:Math.round(this.restockUnitCost*i*100)/100}if(!this.parts.length)return null;let e=0,t=!1;for(let i of Object.values(this._usedParts)){let s=this.parts.find(r=>x({part_id:r.id,entry_id:r.entry_id})===x(i));s?.cost!=null&&(e+=s.cost*(i.quantity||1),t=!0)}return t?Math.round(e*100)/100:null}_renderCostSuggestion(e){if(this._cost.trim()!=="")return p;let t=this._partsCostSuggestion();if(t==null||t<=0)return p;let i=A(t,this.currencySymbol,e);return c`<button
      type="button"
      class="cost-suggestion"
      @click=${()=>this._cost=String(Math.round(t*100)/100)}
    >${o("cost_from_parts",e).replace("{amount}",i)}</button>`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){let e=new Date,t=i=>String(i).padStart(2,"0");this._completedAt=`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}T${t(e.getHours())}:${t(e.getMinutes())}:00`}render(){if(!this._open)return c``;let e=this.lang||this.hass?.language||"en",t=this._error||this._photos.errorText(e);return c`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${o("complete_title",e)}${this.taskName}</div>
        ${this.phaseLabel?c`<div class="phase-line">${o("phase_current",e)}: ${this.phaseLabel}</div>`:p}
        ${this.requireTagScan&&!this.viaTagScan?c`<div class="scan-required-note">${o("require_tag_scan_hint",e)}</div>`:p}
        <div class="content">
          ${t?c`<div class="error">${t}</div>`:p}
          ${this.checklist.length>0?c`
            <div class="checklist-section">
              <label class="checklist-label">${o("checklist",e)}</label>
              ${this.checklist.map((i,s)=>c`
                <label class="checklist-item" @click=${()=>this._toggleCheck(s)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(s)]} />
                  <span>${i}</span>
                </label>
              `)}
            </div>
          `:p}
          ${this.readings.length>0?c`<div class="readings-block">
                <span class="field-label">${o("readings_section",e)}</span>
                ${this.readings.map(i=>this._renderReadingField(i,e))}
              </div>`:this.taskType==="reading"?c`
              <label class="field">
                <span class="field-label">${o("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${i=>this._readingValue=i.target.value} />
              </label>`:p}
          ${this.parts.length?c`<div class="used-parts">
                <span class="field-label">${o("complete_parts_used",e)}</span>
                ${this.parts.map(i=>{let s=x({part_id:i.id,entry_id:i.entry_id}),r=this._usedParts[s],_=r!==void 0,u=i.entry_id?{part_id:i.id,quantity:1,entry_id:i.entry_id}:{part_id:i.id,quantity:1};return c`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${_}
                        @change=${h=>{let g={...this._usedParts};h.target.checked?g[s]=g[s]||u:delete g[s],this._usedParts=g}} />
                      <span
                        >${i.name}${i.owner_name?c`<span class="used-part-owner"> (${i.owner_name})</span>`:p}${i.stock!==null&&i.stock!==void 0?` (${i.stock}${i.unit?" "+i.unit:""})`:""}</span
                      >
                    </label>
                    ${_?c`<input class="used-part-qty" type="number" min="0.01" max="999" step="0.01"
                          .value=${String(r.quantity)}
                          @input=${h=>{let g=parseFloat(h.target.value);this._usedParts={...this._usedParts,[s]:{...u,quantity:Number.isFinite(g)&&g>=.01?g:1}}}} />`:p}
                  </div>`})}
              </div>`:this.consumesInfo.length?c`<div class="consumes-hint">
                  ${this.consumesInfo.map(i=>c`<div>${i}</div>`)}
                </div>`:p}
          ${this.restockDefault!==null?c`
              <label class="field">
                <span class="field-label">${o("restock_quantity_label",e)}</span>
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
            <span class="field-label">${o("notes_optional",e)}${this._req("notes")}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${i=>this._notes=i.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${o("cost_optional",e)}${this._req("cost")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${i=>this._cost=i.target.value} />
            ${this._renderCostSuggestion(e)}
          </label>
          <label class="field">
            <span class="field-label">${o("duration_minutes",e)}${this._req("duration")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._duration}
              @input=${i=>this._duration=i.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${o("completed_at_optional",e)}</span>
            ${this._completedAt?c`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${e}
                  .value=${this._completedAt}
                  @value-changed=${i=>this._completedAt=i.detail.value}
                ></ms-date-field>`:c`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${o("completed_at_pick",e)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${o("completion_photos_optional",e)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?c`<div class="photo-strip">
                  ${this._photos.photos.map(i=>c`
                    <div class="photo-preview">
                      <img src=${i.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(i.id)}
                        title="${o("remove",e)}">✕</button>
                    </div>`)}
                </div>`:p}
            ${this._photos.full?c`<div class="photo-limit">${o("photos_limit",e).replace("{max}",String(this._photos.max))}</div>`:c`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${i=>this._photos.addFiles(i.detail.files)}
                ></ms-photo-picker>`}
          </div>
          ${this.adaptiveEnabled?c`
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
          `:p}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${o("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._missingRequired.length>0}
            title=${this._missingRequired.length?this._missingRequired.map(i=>o("err_required",e).replace("{field}",o(O[i]??i,e))).join(" \xB7 "):""}
          >
            ${this._loading?o("completing",e):o("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};d.styles=[P,C,y`
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
  `],a([l({attribute:!1})],d.prototype,"hass",2),a([l()],d.prototype,"entryId",2),a([l()],d.prototype,"taskId",2),a([l()],d.prototype,"taskName",2),a([l()],d.prototype,"lang",2),a([l({type:Array})],d.prototype,"checklist",2),a([l({type:Boolean})],d.prototype,"adaptiveEnabled",2),a([l()],d.prototype,"taskType",2),a([l()],d.prototype,"readingUnit",2),a([l({attribute:!1})],d.prototype,"readings",2),a([l({attribute:!1})],d.prototype,"readingHistory",2),a([l({attribute:!1})],d.prototype,"restockDefault",2),a([l({attribute:!1})],d.prototype,"restockUnitCost",2),a([l()],d.prototype,"currencySymbol",2),a([l({attribute:!1})],d.prototype,"parts",2),a([l({attribute:!1})],d.prototype,"consumesParts",2),a([l({type:Array})],d.prototype,"consumesInfo",2),a([l({type:Array})],d.prototype,"requiredFields",2),a([l()],d.prototype,"phaseLabel",2),a([l({type:Boolean})],d.prototype,"requireTagScan",2),a([l({type:Boolean})],d.prototype,"viaTagScan",2),a([m()],d.prototype,"_open",2),a([m()],d.prototype,"_notes",2),a([m()],d.prototype,"_cost",2),a([m()],d.prototype,"_duration",2),a([m()],d.prototype,"_loading",2),a([m()],d.prototype,"_error",2),a([m()],d.prototype,"_checklistState",2),a([m()],d.prototype,"_feedback",2),a([m()],d.prototype,"_readingValue",2),a([m()],d.prototype,"_readingValues",2),a([m()],d.prototype,"_restockQty",2),a([m()],d.prototype,"_completedAt",2),a([m()],d.prototype,"_usedParts",2),a([l({attribute:!1})],d.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",d);export{I as a,R as b,N as c,$ as d,B as e,U as f,C as g,w as h,d as i};
