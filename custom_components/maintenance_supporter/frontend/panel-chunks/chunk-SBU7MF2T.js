/*! maintenance_supporter frontend 2.93.0 */
import{c as P,l as O,m as A}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-UGFRK4FW.js";import{a as E,g as N,k as H,m as U}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-DCQQMZZE.js";import{i as z,j as w}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-HXR6GTWM.js";import{a as C}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-MTFWRBIR.js";import{A as R,B as q,P as F,a,b as x,c,f as h,h as k,l as p,m as _,s as n,z as I}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-MVDHTFJE.js";var S=class{constructor(d,e){this.host=d;this.opts=e;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this._session=0;this._uploadEntry=new Map;this.max=e.max??10,d.addController(this)}hostConnected(){}get ids(){return this.photos.map(d=>d.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(d){return this.errorKey?n(this.errorKey,d).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(d=[]){this._endSession(),this._revokeAll(),this.photos=d.map(e=>({id:e,preview:""})),this.uploadedIds=[],this._uploadEntry.clear(),this.errorKey="",this.host.requestUpdate()}async addFiles(d){if(d.length===0)return;let e=this._session,i=this.opts.hass(),t=this.opts.entryId(),s=d.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let r of s){let o=await O(i,t,r);if(e!==this._session){A(i,t,[o]);return}this.uploadedIds=[...this.uploadedIds,o],this._uploadEntry.set(o,t),this.photos=[...this.photos,{id:o,preview:URL.createObjectURL(r)}],this.host.requestUpdate()}d.length>s.length&&(this.errorKey="photos_limit")}catch(r){if(e!==this._session)return;this.errorKey=r instanceof Error&&r.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{e===this._session&&(this.uploading=!1,this.host.requestUpdate())}}remove(d){let e=this.photos.find(i=>i.id===d);e?.preview&&URL.revokeObjectURL(e.preview),this.photos=this.photos.filter(i=>i.id!==d),this.uploadedIds.includes(d)&&(this.uploadedIds=this.uploadedIds.filter(i=>i!==d),this._discard([d])),this.host.requestUpdate()}discardOrphans(){if(this._endSession(),this.uploadedIds.length===0)return;let d=this.uploadedIds;this.uploadedIds=[],this._discard(d)}markAttached(){this._endSession(),this.uploadedIds=[],this._uploadEntry.clear()}_endSession(){this._session++,this.uploading=!1}_discard(d){let e=new Map;for(let t of d){let s=this._uploadEntry.get(t)??this.opts.entryId();this._uploadEntry.delete(t),e.set(s,[...e.get(s)??[],t])}let i=this.opts.hass();for(let[t,s]of e)A(i,t,s)}_revokeAll(){for(let d of this.photos)d.preview&&URL.revokeObjectURL(d.preview)}};function T(){if(window.externalApp!==void 0)return!0;let d=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(d)&&/Android/.test(d)}var L={objectSections:"msp-object-sections",printOptions:"msp-print-options",batteryRosterOpen:"msp-bf-roster-open",docSort:"msp-doc-sort",cameraLabel:"msp-camera-label",overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort"};function j(g){try{return localStorage.getItem(g)}catch{return null}}function Q(g,d){try{localStorage.setItem(g,d)}catch{}}function Y(){if(!T())return!1;let g=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!g&&typeof g.getUserMedia=="function"}var J=1920,Z=.88,ee={retryMs:500,windowMs:5e3},te=new Set(["NotReadableError","AbortError","TrackStartError"]),V=80,D=/back|rear|environment|rück|hinten/i,B=/front|user|selfie|vorne/i;function K(g){let d=/camera2?\s*(\d+)/i.exec(g);return d?Number(d[1]):Number.MAX_SAFE_INTEGER}function M(g,d){if(d){let i=g.find(t=>t.label===d);if(i)return i}return g.filter(i=>i.label&&D.test(i.label)).sort((i,t)=>K(i.label)-K(t.label))[0]??null}var G=g=>g?.name||"Error",ie=g=>g?.message||"",b=class extends k{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._switching=!1;this._devices=[];this._deviceIndex=-1;this._switchFailed=!1;this._copied=!1;this.timing={...ee};this._facing="environment";this._stream=null;this._opening=!1;this._gen=0;this._refused=new Set;this._log=[];this._t0=0;this._lastError=""}async open(){if(this._open||this._opening)return;this._opening=!0;let e=++this._gen;try{await this._acquireAndShow(e)}finally{this._opening=!1}}_live(e){return e===this._gen&&this.isConnected}async _acquireAndShow(e){let i=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!i||typeof i.getUserMedia!="function"){this._unavailable("no_media_devices");return}this._log=[],this._t0=Date.now(),this._lastError="",this._refused.clear(),this._switchFailed=!1,this._copied=!1,this._note(navigator.userAgent);let t=j(L.cameraLabel),s=await this._enumerate(i);if(!this._live(e))return;let r=M(s,t),o="refused";if(r&&(o=await this._openPatiently(i,e,this._byDevice(r))),o==="cancelled")return;if(o!=="ok"){if(o=await this._openPatiently(i,e,{video:{facingMode:{ideal:"environment"}},what:"facing environment"}),o==="cancelled")return;if(o!=="ok"){this._unavailable(this._lastError||"camera_unavailable");return}if(s=await this._enumerate(i),!this._live(e)){this._stopStream();return}}if(this._devices=s,this._deviceIndex=this._indexOfCurrent(),this._facing=this._currentFacing(),this._open=!0,await this.updateComplete,!this._live(e)){this._stopStream(),this._open=!1;return}await this._attach();let u=r?null:M(s,t),m=this._deviceIndex>=0?s[this._deviceIndex]:void 0;if(!u||u.deviceId===m?.deviceId)return;let f=await this._replace(i,e,[this._byDevice(u)],this._restoreCandidates(m));if(f!=="cancelled"){if(f==="lost"){this._unavailable("camera_lost");return}this._settle(f)}}async _openPatiently(e,i,t){let s=Date.now();for(;;){let r;try{r=await e.getUserMedia({video:t.video,audio:!1})}catch(o){let u=G(o),m=ie(o);if(this._lastError=u,this._note(`${t.what} \u2192 ${u}${m&&m!==u?`: ${m}`:""}`),!this._live(i))return"cancelled";if(!te.has(u))return"refused";if(Date.now()-s+this.timing.retryMs>this.timing.windowMs)return"busy";if(await new Promise(f=>setTimeout(f,this.timing.retryMs)),!this._live(i))return"cancelled";continue}if(!this._live(i)){for(let o of r.getTracks())o.stop();return"cancelled"}return this._stream=r,this._note(`${t.what} \u2192 ok (${this._describeTrack()})`),"ok"}}async _replace(e,i,t,s){this._switching=!0,this._stopStream();try{for(let r of t){let o=await this._openPatiently(e,i,r);if(o==="ok")return r;if(o==="cancelled")return o;if(o==="busy"){r.deviceId&&this._refused.add(r.deviceId);break}}for(let r of s){let o=await this._openPatiently(e,i,r);if(o==="ok")return"restored";if(o==="cancelled")return o}return"lost"}finally{this._switching=!1}}_settle(e){if(e==="restored"){this._switchFailed=!0;let t=this._indexOfCurrent();return t>=0&&(this._deviceIndex=t),this._attach(),!1}this._switchFailed=!1;let i=e.deviceId?this._devices.findIndex(t=>t.deviceId===e.deviceId):-1;return this._deviceIndex=i>=0?i:this._indexOfCurrent(),this._facing=this._currentFacing(),this._attach(),!0}_byDevice(e){return{video:{deviceId:{exact:e.deviceId}},what:e.label||"camera (no label)",deviceId:e.deviceId}}_restoreCandidates(e,i){let t=[],s=e?.deviceId||i;return s&&t.push({video:{deviceId:{exact:s}},what:`${e?.label||"previous camera"} (back again)`,deviceId:s}),t.push({video:{facingMode:{ideal:this._facing}},what:`facing ${this._facing} (back again)`}),t}async _attach(){let e=this._video;if(!(!e||!this._stream)){e.srcObject=this._stream;try{await e.play()}catch{}}}async _enumerate(e){if(typeof e.enumerateDevices!="function")return[];try{let i=(await e.enumerateDevices()).filter(t=>t.kind==="videoinput"&&!!t.deviceId);return this._note(`cameras: ${i.map(t=>t.label||"(no label)").join(" | ")||"none listed"}`),i}catch(i){return this._note(`enumerateDevices \u2192 ${G(i)}`),[]}}_indexOfCurrent(){let e=this._stream?.getVideoTracks()[0];if(!e)return-1;let i=e.getSettings().deviceId,t=i?this._devices.findIndex(s=>s.deviceId===i):-1;return t>=0?t:e.label?this._devices.findIndex(s=>s.label===e.label):-1}_currentFacing(){let e=this._stream?.getVideoTracks()[0],i=e?.getSettings().facingMode;if(i==="user"||i==="environment")return i;let t=(this._deviceIndex>=0?this._devices[this._deviceIndex]?.label:"")||e?.label||"";return B.test(t)?"user":D.test(t)?"environment":this._facing}_describeTrack(){let e=this._stream?.getVideoTracks()[0];if(!e)return"no track";let i=e.getSettings(),t=i.width&&i.height?`${i.width}\xD7${i.height}`:"size ?";return[e.label||"no label",t,i.facingMode].filter(Boolean).join(", ")}_note(e){this._log.push(`+${Date.now()-this._t0} ms ${e}`),this._log.length>V&&this._log.splice(1,this._log.length-V)}async _switchCamera(){let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||this._devices.length<2||this._busy||this._switching)return;let i=this._gen,t=this._deviceIndex,s=t>=0?this._devices[t]:void 0,r=this._stream?.getVideoTracks()[0]?.getSettings().deviceId||s?.deviceId,o=this._facing==="user"?"environment":"user",u=this._nextCameras(t,r);!u.length&&this._refused.size&&(this._refused.clear(),u=this._nextCameras(t,r)),this._note(`switch from ${s?.label||"unknown camera"}`);let m=[...u.map(f=>this._byDevice(this._devices[f])),{video:{facingMode:{exact:o}},what:`facing ${o} (exact)`},{video:{facingMode:{ideal:o}},what:`facing ${o}`}];this._busy=!0,this._switchFailed=!1,this._copied=!1;try{let f=await this._replace(e,i,m,this._restoreCandidates(s,r));if(f==="cancelled")return;if(f==="lost"){this._unavailable("camera_lost");return}if(f!=="restored"&&!f.deviceId){if(this._isCamera(r,this._facing)){this._switchFailed=!0,await this._attach();return}this._facing=o}if(this._settle(f)&&f!=="restored"&&f.deviceId){let v=this._devices[this._deviceIndex]?.label??"";v&&Q(L.cameraLabel,B.test(v)?"":v)}}finally{this._busy=!1}}_nextCameras(e,i){let t=this._devices.length,s=[];for(let r=1;r<=(e<0?t:t-1);r++){let o=(e+r)%t,u=this._devices[o].deviceId;u===i||this._refused.has(u)||s.push(o)}return s}_isCamera(e,i){let t=this._stream?.getVideoTracks()[0]?.getSettings();return e&&t?.deviceId?t.deviceId===e:!!t?.facingMode&&t.facingMode===i}close(){this._gen++,this._stopStream(),this._open=!1,this._busy=!1,this._switching=!1}disconnectedCallback(){super.disconnectedCallback(),this._gen++,this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let i of this._stream?.getTracks()??[])i.stop();this._stream=null;let e=this._video;e&&(e.srcObject=null)}_unavailable(e){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:e},bubbles:!0,composed:!0}))}async _copyLog(){let e=this._log.join(`
`),i=!1;try{navigator.clipboard?.writeText&&(await navigator.clipboard.writeText(e),i=!0)}catch{}if(!i){let t=this.shadowRoot?.querySelector(".details textarea");if(t){t.focus(),t.select();try{i=document.execCommand("copy")}catch{i=!1}}}this._copied=i}async _shoot(){let e=this._video;if(!(!e||this._busy||this._switching)){this._busy=!0;try{let i=e.videoWidth||640,t=e.videoHeight||480,s=Math.min(1,J/Math.max(i,t)),r=document.createElement("canvas");r.width=Math.round(i*s),r.height=Math.round(t*s);let o=r.getContext("2d");if(!o)throw new Error("no_canvas");o.drawImage(e,0,0,r.width,r.height);let u=await new Promise(v=>r.toBlob(v,"image/jpeg",Z));if(!u)throw new Error("no_blob");let m=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),f=new File([u],`photo-${m}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:f},bubbles:!0,composed:!0}))}catch(i){this._unavailable(i instanceof Error?i.message:String(i))}finally{this._busy=!1}}}render(){if(!this._open)return h;let e=this.lang,i=this._busy||this._switching;return c`
      <div class="overlay" role="dialog" aria-modal="true" aria-label=${n("doc_camera",e)}>
        <video autoplay playsinline muted></video>
        ${this._switching?c`<div class="switching" role="status">${n("camera_switching",e)}</div>`:h}
        ${this._switchFailed?c`<div class="switch-note" role="status">
              <div>${n("camera_not_answered",e)}</div>
              <details class="details">
                <summary>${n("camera_diagnostics",e)}</summary>
                <textarea readonly rows="6" .value=${this._log.join(`
`)}></textarea>
                <button type="button" class="copy" @click=${this._copyLog}>${n(this._copied?"camera_copied":"camera_copy",e)}</button>
              </details>
            </div>`:h}
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${n("cancel",e)}</button>
          ${this._devices.length>1?c`<button type="button" class="switch" ?disabled=${i} title=${n("camera_switch_lens",e)} aria-label=${n("camera_switch_lens",e)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
                <span class="switch-pos">${this._deviceIndex>=0?`${this._deviceIndex+1}/${this._devices.length}`:`?/${this._devices.length}`}</span>
              </button>`:h}
          <button type="button" class="shoot" ?disabled=${i} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${n("camera_capture_shoot",e)}</span>
          </button>
        </div>
      </div>
    `}};b.styles=x`
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
    .switch[disabled] { opacity: 0.5; cursor: default; }
    .switch ha-icon { --mdc-icon-size: 22px; }
    .switch-pos { font-size: 12px; opacity: 0.85; }
    .switching {
      position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%);
      padding: 8px 16px; border-radius: 16px; background: rgba(0, 0, 0, 0.6); font-size: 14px;
    }
    .switch-note {
      position: absolute; left: 12px; right: 12px; bottom: 84px; max-height: 60%; overflow: auto;
      text-align: center; color: #fff; font-size: 13px; text-shadow: 0 1px 2px #000;
    }
    .details { margin-top: 6px; text-align: start; text-shadow: none; }
    .details summary { cursor: pointer; text-align: center; opacity: 0.85; }
    .details textarea {
      display: block; box-sizing: border-box; width: 100%; margin: 6px 0;
      font: 11px/1.35 monospace; color: #fff; background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 6px; padding: 6px; resize: vertical;
    }
    .copy { background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.6); padding: 6px 14px; font-size: 13px; }
    .shoot { background: var(--primary-color, #03a9f4); color: #fff; border: none; font-weight: 600; }
    .shoot[disabled] { opacity: 0.6; cursor: default; }
    .shoot ha-icon { --mdc-icon-size: 22px; }
  `,a([p({type:String})],b.prototype,"lang",2),a([_()],b.prototype,"_open",2),a([_()],b.prototype,"_busy",2),a([_()],b.prototype,"_switching",2),a([_()],b.prototype,"_devices",2),a([_()],b.prototype,"_deviceIndex",2),a([_()],b.prototype,"_switchFailed",2),a([_()],b.prototype,"_copied",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",b);var X=x`
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
`,y=class extends k{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=T();this._inAppCamera=Y()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(e){e.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:e},bubbles:!0,composed:!0}))}_onInput(e){let i=e.target,t=Array.from(i.files??[]);i.value="",this._emit(t)}_onCameraClick(e){!this._inAppCamera||this._locked||(e.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),!this._locked&&e.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return h;let e=this.lang,i=this._locked?"disabled":"",t=this.busy?n("uploading",e):n("doc_camera",e),s=n(this._singlePick?"choose_photo":"choose_photos",e);return c`
      <div class="photo-pickers">
        ${this.showCamera?c`<label class="photo-pick photo-pick-camera ${i}" role="button" tabindex="0"
              aria-label=${t} title=${this.compact?t:h}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?h:c`<span>${t}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:h}
        ${this.showGallery?c`<label class="photo-pick photo-pick-gallery ${i}" role="button" tabindex="0"
              aria-label=${s} title=${this.compact?s:h}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?h:c`<span>${s}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:h}
      </div>
      ${this.showGallery&&this._singlePick?c`<div class="photo-android-hint">${n("photos_android_hint",e)}</div>`:h}
      ${this.showCamera&&this._inAppCamera?c`<ms-camera-capture .lang=${e}
            @photo-captured=${r=>this._emit([r.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:h}
    `}};a([p({type:String})],y.prototype,"lang",2),a([p({type:Boolean})],y.prototype,"disabled",2),a([p({type:Boolean})],y.prototype,"busy",2),a([p({type:String})],y.prototype,"accept",2),a([p({type:Boolean})],y.prototype,"showCamera",2),a([p({type:Boolean})],y.prototype,"showGallery",2),a([p({type:Boolean})],y.prototype,"compact",2),a([p({type:Number})],y.prototype,"remaining",2),a([_()],y.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",y);var $=z,l=class extends k{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.currencySymbol="";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new S(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this._usedQtyText={};this.checklistPrefill={}}open(e={}){this._open||(this._open=!0,this.viaTagScan=!!e.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((i,t)=>[String(t),!!this.checklistPrefill[i]]).filter(([,i])=>i)),this._feedback="needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(i=>[E(i),{...i}])),this._usedQtyText={})}_rangeError(e,i){let t=this.lang;return n("settings_value_out_of_range",t).replace("{min}",I(e,t,{maximumFractionDigits:2})).replace("{max}",I(i,t,{maximumFractionDigits:2}))}_toggleCheck(e){let i=String(e);this._checklistState={...this._checklistState,[i]:!this._checklistState[i]}}_setFeedback(e){this._feedback=e}async _complete(){if(this._loading||this._photos.uploading)return;this._error="",this._photos.clearError();let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(e.notes=this._notes),this._cost){let s=parseFloat(this._cost);!isNaN(s)&&s>=0&&(e.cost=s)}let i=H(this._duration);if(i!==null&&(e.duration=i),this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photos.photos.length>0&&(e.photo_doc_ids=this._photos.ids),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(new Date(this._completedAt).getTime()>Date.now()){this._error=n("completed_at_future_error",this.lang);return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let s={};for(let r of this.readings){let o=(this._readingValues[r.id]??"").trim();if(o==="")continue;let u=parseFloat(o.replace(",","."));isNaN(u)||(s[r.id]=u)}Object.keys(s).length>0&&(e.reading_values=s)}else if(this._readingValue!==""){let s=parseFloat(this._readingValue);isNaN(s)||(e.reading_value=s)}if(this.restockDefault!==null&&this._restockQty.trim()!==""){let s=parseFloat(this._restockQty.replace(",","."));if(!Number.isFinite(s)||s<w[0]||s>w[1]){this._error=this._rangeError(...w);return}e.restock_quantity=s}if(this.parts.length>0){let s=[];for(let[r,o]of Object.entries(this._usedParts)){let u=this._usedQtyText[r],m=u===void 0?o.quantity:parseFloat(u.replace(",","."));if(!Number.isFinite(m)||m<$[0]||m>$[1]){this._error=this._rangeError(...$);return}s.push({...o,quantity:m})}e.used_parts=s.map(r=>r.entry_id?{part_id:r.part_id,quantity:r.quantity,entry_id:r.entry_id}:{part_id:r.part_id,quantity:r.quantity})}await C(this,e,{busy:s=>{this._loading=s},lang:this.lang,fallbackKey:"save_error",onError:s=>{this._error=s}})!==void 0&&(this._photos.markAttached(),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed")))}_renderReadingField(e,i){let t=this._completedAt?new Date(this._completedAt).getTime():NaN,s=N(this.readingHistory,e.id,isNaN(t)?void 0:t),r=e.unit||this.readingUnit,o=(this._readingValues[e.id]??"").trim(),u=o===""?NaN:parseFloat(o.replace(",",".")),m=s!==void 0&&!isNaN(u)&&u<s.value,f=s!==void 0?I(s.value,i,{maximumFractionDigits:3}):"";return c`
      <label class="field reading-field">
        <span class="field-label">${e.name}${r?` (${r})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${s!==void 0?n("reading_last",i).replace("{value}",f):""}
          .value=${this._readingValues[e.id]??""}
          @input=${v=>{this._readingValues={...this._readingValues,[e.id]:v.target.value}}} />
        ${m?c`<span class="reading-warn">${n("reading_below_last",i).replace("{value}",f)}</span>`:h}
      </label>`}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(i=>!e[i])}_req(e){return this.requiredFields.includes(e)?c`<span class="req-mark" aria-hidden="true">*</span>`:h}_partsCostSuggestion(){if(this.restockDefault!==null){let t=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(t)||t<=0?null:Math.round(this.restockUnitCost*t*100)/100}if(!this.parts.length)return null;let e=0,i=!1;for(let t of Object.values(this._usedParts)){let s=this.parts.find(r=>E({part_id:r.id,entry_id:r.entry_id})===E(t));s?.cost!=null&&(e+=s.cost*(t.quantity||1),i=!0)}return i?Math.round(e*100)/100:null}_renderCostSuggestion(e){if(this._cost.trim()!=="")return h;let i=this._partsCostSuggestion();if(i==null||i<=0)return h;let t=R(i,this.currencySymbol,e);return c`<button
      type="button"
      class="cost-suggestion"
      @click=${()=>this._cost=String(Math.round(i*100)/100)}
    >${n("cost_from_parts",e).replace("{amount}",t)}</button>`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){this._completedAt=P(new Date)}render(){if(!this._open)return c``;let e=this.lang||this.hass?.language||"en",i=this._error||this._photos.errorText(e);return c`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${n("complete_title",e)}${this.taskName}</div>
        ${this.phaseLabel?c`<div class="phase-line">${n("phase_current",e)}: ${this.phaseLabel}</div>`:h}
        ${this.requireTagScan&&!this.viaTagScan?c`<div class="scan-required-note">${n("require_tag_scan_hint",e)}</div>`:h}
        <div class="content">
          ${i?c`<div class="error">${i}</div>`:h}
          ${this.checklist.length>0?c`
            <div class="checklist-section">
              <label class="checklist-label">${n("checklist",e)}</label>
              ${this.checklist.map((t,s)=>c`
                <label class="checklist-item" @click=${()=>this._toggleCheck(s)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(s)]} />
                  <span>${t}</span>
                </label>
              `)}
            </div>
          `:h}
          ${this.readings.length>0?c`<div class="readings-block">
                <span class="field-label">${n("readings_section",e)}</span>
                ${this.readings.map(t=>this._renderReadingField(t,e))}
              </div>`:this.taskType==="reading"?c`
              <label class="field">
                <span class="field-label">${n("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${t=>this._readingValue=t.target.value} />
              </label>`:h}
          ${this.parts.length?c`<div class="used-parts">
                <span class="field-label">${n("complete_parts_used",e)}</span>
                ${this.parts.map(t=>{let s=E({part_id:t.id,entry_id:t.entry_id}),r=this._usedParts[s],o=r!==void 0,u=t.entry_id?{part_id:t.id,quantity:1,entry_id:t.entry_id}:{part_id:t.id,quantity:1};return c`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${o}
                        @change=${m=>{let f={...this._usedParts};if(m.target.checked)f[s]=f[s]||u;else{delete f[s];let v={...this._usedQtyText};delete v[s],this._usedQtyText=v}this._usedParts=f}} />
                      <span
                        >${t.name}${t.owner_name?c`<span class="used-part-owner"> (${t.owner_name})</span>`:h}${t.stock!==null&&t.stock!==void 0?` (${q(t.stock,t.unit,e)})`:""}</span
                      >
                    </label>
                    ${o?c`<input class="used-part-qty" type="number" min=${$[0]} max=${$[1]} step="0.01"
                          .value=${this._usedQtyText[s]??String(r.quantity)}
                          @input=${m=>{let f=m.target.value;this._usedQtyText={...this._usedQtyText,[s]:f};let v=parseFloat(f.replace(",","."));Number.isFinite(v)&&v>=$[0]&&(this._usedParts={...this._usedParts,[s]:{...u,quantity:v}})}} />`:h}
                  </div>`})}
              </div>`:this.consumesInfo.length?c`<div class="consumes-hint">
                  ${this.consumesInfo.map(t=>c`<div>${t}</div>`)}
                </div>`:h}
          ${this.restockDefault!==null?c`
              <label class="field">
                <span class="field-label">${n("restock_quantity_label",e)}</span>
                <input type="number" step="0.01" min=${w[0]} max=${w[1]} class="field-input"
                  .value=${this._restockQty}
                  @input=${t=>this._restockQty=t.target.value} />
              </label>`:h}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${n("notes_optional",e)}${this._req("notes")}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${t=>this._notes=t.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${n("cost_optional",e)}${this._req("cost")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${t=>this._cost=t.target.value} />
            ${this._renderCostSuggestion(e)}
          </label>
          <label class="field">
            <span class="field-label">${n("duration_minutes",e)}${this._req("duration")}</span>
            <input type="number" step="1" min="0" inputmode="numeric" class="field-input"
              .value=${this._duration}
              @input=${t=>this._duration=t.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${n("completed_at_optional",e)}</span>
            ${this._completedAt?c`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${e}
                  .value=${this._completedAt}
                  @value-changed=${t=>this._completedAt=t.detail.value}
                ></ms-date-field>`:c`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${n("completed_at_pick",e)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${n("completion_photos_optional",e)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?c`<div class="photo-strip">
                  ${this._photos.photos.map(t=>c`
                    <div class="photo-preview">
                      <img src=${t.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(t.id)}
                        title="${n("remove",e)}">✕</button>
                    </div>`)}
                </div>`:h}
            ${this._photos.full?c`<div class="photo-limit">${n("photos_limit",e).replace("{max}",String(this._photos.max))}</div>`:c`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${t=>this._photos.addFiles(t.detail.files)}
                ></ms-photo-picker>`}
          </div>
          ${this.adaptiveEnabled?c`
            <div class="feedback-section">
              <label class="feedback-label">${n("was_maintenance_needed",e)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${n("feedback_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${n("feedback_not_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${n("feedback_not_sure",e)}</button>
              </div>
            </div>
          `:h}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${n("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._photos.uploading||this._missingRequired.length>0}
            title=${this._photos.uploading?n("uploading",e):this._missingRequired.length?this._missingRequired.map(t=>n("err_required",e).replace("{field}",n(U[t]??t,e))).join(" \xB7 "):""}
          >
            ${this._loading?n("completing",e):n("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};l.styles=[F,X,x`
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
  `],a([p({attribute:!1})],l.prototype,"hass",2),a([p()],l.prototype,"entryId",2),a([p()],l.prototype,"taskId",2),a([p()],l.prototype,"taskName",2),a([p()],l.prototype,"lang",2),a([p({type:Array})],l.prototype,"checklist",2),a([p({type:Boolean})],l.prototype,"adaptiveEnabled",2),a([p()],l.prototype,"taskType",2),a([p()],l.prototype,"readingUnit",2),a([p({attribute:!1})],l.prototype,"readings",2),a([p({attribute:!1})],l.prototype,"readingHistory",2),a([p({attribute:!1})],l.prototype,"restockDefault",2),a([p({attribute:!1})],l.prototype,"restockUnitCost",2),a([p()],l.prototype,"currencySymbol",2),a([p({attribute:!1})],l.prototype,"parts",2),a([p({attribute:!1})],l.prototype,"consumesParts",2),a([p({type:Array})],l.prototype,"consumesInfo",2),a([p({type:Array})],l.prototype,"requiredFields",2),a([p()],l.prototype,"phaseLabel",2),a([p({type:Boolean})],l.prototype,"requireTagScan",2),a([p({type:Boolean})],l.prototype,"viaTagScan",2),a([_()],l.prototype,"_open",2),a([_()],l.prototype,"_notes",2),a([_()],l.prototype,"_cost",2),a([_()],l.prototype,"_duration",2),a([_()],l.prototype,"_loading",2),a([_()],l.prototype,"_error",2),a([_()],l.prototype,"_checklistState",2),a([_()],l.prototype,"_feedback",2),a([_()],l.prototype,"_readingValue",2),a([_()],l.prototype,"_readingValues",2),a([_()],l.prototype,"_restockQty",2),a([_()],l.prototype,"_completedAt",2),a([_()],l.prototype,"_usedParts",2),a([_()],l.prototype,"_usedQtyText",2),a([p({attribute:!1})],l.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",l);export{L as a,j as b,Q as c,T as d,X as e,S as f,l as g};
