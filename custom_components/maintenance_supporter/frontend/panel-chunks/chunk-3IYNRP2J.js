/*! maintenance_supporter frontend 2.97.1 */
import{d as M,e as R}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-QEKEY7ZD.js";import{a as L,b as z,c as O}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-EPK25IMX.js";import{c as U}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-SQZSAJJG.js";import{a as I,h as H,l as V,n as B}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-JOWEQYBZ.js";import{j as Q,k as w}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-GSRF4WCQ.js";import{a as j}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-SZUQQHGZ.js";import{$ as C,A,K as E,L as q,M as F,Q as N,a,b as x,c as l,f,h as k,l as h,m as _,s as o,z as P}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-CMVELGDC.js";var T=class{constructor(p,e){this.host=p;this.opts=e;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this._session=0;this._uploadEntry=new Map;this.max=e.max??10,p.addController(this)}hostConnected(){}get ids(){return this.photos.map(p=>p.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(p){return this.errorKey?o(this.errorKey,p).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(p=[]){this._endSession(),this._revokeAll(),this.photos=p.map(e=>({id:e,preview:""})),this.uploadedIds=[],this._uploadEntry.clear(),this.errorKey="",this.host.requestUpdate()}async addFiles(p){if(p.length===0)return;let e=this._session,i=this.opts.hass(),t=this.opts.entryId(),r=p.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let n of r){let s=await M(i,t,n);if(e!==this._session){R(i,t,[s]);return}this.uploadedIds=[...this.uploadedIds,s],this._uploadEntry.set(s,t),this.photos=[...this.photos,{id:s,preview:URL.createObjectURL(n)}],this.host.requestUpdate()}p.length>r.length&&(this.errorKey="photos_limit")}catch(n){if(e!==this._session)return;this.errorKey=n instanceof Error&&n.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{e===this._session&&(this.uploading=!1,this.host.requestUpdate())}}remove(p){let e=this.photos.find(i=>i.id===p);e?.preview&&URL.revokeObjectURL(e.preview),this.photos=this.photos.filter(i=>i.id!==p),this.uploadedIds.includes(p)&&(this.uploadedIds=this.uploadedIds.filter(i=>i!==p),this._discard([p])),this.host.requestUpdate()}discardOrphans(){if(this._endSession(),this.uploadedIds.length===0)return;let p=this.uploadedIds;this.uploadedIds=[],this._discard(p)}markAttached(){this._endSession(),this.uploadedIds=[],this._uploadEntry.clear()}_endSession(){this._session++,this.uploading=!1}_discard(p){let e=new Map;for(let t of p){let r=this._uploadEntry.get(t)??this.opts.entryId();this._uploadEntry.delete(t),e.set(r,[...e.get(r)??[],t])}let i=this.opts.hass();for(let[t,r]of e)R(i,t,r)}_revokeAll(){for(let p of this.photos)p.preview&&URL.revokeObjectURL(p.preview)}};function S(){if(window.externalApp!==void 0)return!0;let p=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(p)&&/Android/.test(p)}function W(){if(!S())return!1;let g=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!g&&typeof g.getUserMedia=="function"}var te=1920,ie=.88,se={retryMs:500,windowMs:5e3},re=new Set(["NotReadableError","AbortError","TrackStartError"]),K=80,J=/back|rear|environment|rück|hinten/i,G=/front|user|selfie|vorne/i;function Y(g){let p=/camera2?\s*(\d+)/i.exec(g);return p?Number(p[1]):Number.MAX_SAFE_INTEGER}function D(g,p){if(p){let i=g.find(t=>t.label===p);if(i)return i}return g.filter(i=>i.label&&J.test(i.label)).sort((i,t)=>Y(i.label)-Y(t.label))[0]??null}var X=g=>g?.name||"Error",ae=g=>g?.message||"",b=class extends k{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._switching=!1;this._devices=[];this._deviceIndex=-1;this._switchFailed=!1;this._copied=!1;this.timing={...se};this._facing="environment";this._stream=null;this._opening=!1;this._gen=0;this._refused=new Set;this._log=[];this._t0=0;this._lastError=""}async open(){if(this._open||this._opening)return;this._opening=!0;let e=++this._gen;try{await this._acquireAndShow(e)}finally{this._opening=!1}}_live(e){return e===this._gen&&this.isConnected}async _acquireAndShow(e){let i=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!i||typeof i.getUserMedia!="function"){this._unavailable("no_media_devices");return}this._log=[],this._t0=Date.now(),this._lastError="",this._refused.clear(),this._switchFailed=!1,this._copied=!1,this._note(navigator.userAgent);let t=z(L.cameraLabel),r=await this._enumerate(i);if(!this._live(e))return;let n=D(r,t),s="refused";if(n&&(s=await this._openPatiently(i,e,this._byDevice(n))),s==="cancelled")return;if(s!=="ok"){if(s=await this._openPatiently(i,e,{video:{facingMode:{ideal:"environment"}},what:"facing environment"}),s==="cancelled")return;if(s!=="ok"){this._unavailable(this._lastError||"camera_unavailable");return}if(r=await this._enumerate(i),!this._live(e)){this._stopStream();return}}if(this._devices=r,this._deviceIndex=this._indexOfCurrent(),this._facing=this._currentFacing(),this._open=!0,await this.updateComplete,!this._live(e)){this._stopStream(),this._open=!1;return}await this._attach();let d=n?null:D(r,t),m=this._deviceIndex>=0?r[this._deviceIndex]:void 0;if(!d||d.deviceId===m?.deviceId)return;let u=await this._replace(i,e,[this._byDevice(d)],this._restoreCandidates(m));if(u!=="cancelled"){if(u==="lost"){this._unavailable("camera_lost");return}this._settle(u)}}async _openPatiently(e,i,t){let r=Date.now();for(;;){let n;try{n=await e.getUserMedia({video:t.video,audio:!1})}catch(s){let d=X(s),m=ae(s);if(this._lastError=d,this._note(`${t.what} \u2192 ${d}${m&&m!==d?`: ${m}`:""}`),!this._live(i))return"cancelled";if(!re.has(d))return"refused";if(Date.now()-r+this.timing.retryMs>this.timing.windowMs)return"busy";if(await new Promise(u=>setTimeout(u,this.timing.retryMs)),!this._live(i))return"cancelled";continue}if(!this._live(i)){for(let s of n.getTracks())s.stop();return"cancelled"}return this._stream=n,this._note(`${t.what} \u2192 ok (${this._describeTrack()})`),"ok"}}async _replace(e,i,t,r){this._switching=!0,this._stopStream();try{for(let n of t){let s=await this._openPatiently(e,i,n);if(s==="ok")return n;if(s==="cancelled")return s;if(s==="busy"){n.deviceId&&this._refused.add(n.deviceId);break}}for(let n of r){let s=await this._openPatiently(e,i,n);if(s==="ok")return"restored";if(s==="cancelled")return s}return"lost"}finally{this._switching=!1}}_settle(e){if(e==="restored"){this._switchFailed=!0;let t=this._indexOfCurrent();return t>=0&&(this._deviceIndex=t),this._attach(),!1}this._switchFailed=!1;let i=e.deviceId?this._devices.findIndex(t=>t.deviceId===e.deviceId):-1;return this._deviceIndex=i>=0?i:this._indexOfCurrent(),this._facing=this._currentFacing(),this._attach(),!0}_byDevice(e){return{video:{deviceId:{exact:e.deviceId}},what:e.label||"camera (no label)",deviceId:e.deviceId}}_restoreCandidates(e,i){let t=[],r=e?.deviceId||i;return r&&t.push({video:{deviceId:{exact:r}},what:`${e?.label||"previous camera"} (back again)`,deviceId:r}),t.push({video:{facingMode:{ideal:this._facing}},what:`facing ${this._facing} (back again)`}),t}async _attach(){let e=this._video;if(!(!e||!this._stream)){e.srcObject=this._stream;try{await e.play()}catch{}}}async _enumerate(e){if(typeof e.enumerateDevices!="function")return[];try{let i=(await e.enumerateDevices()).filter(t=>t.kind==="videoinput"&&!!t.deviceId);return this._note(`cameras: ${i.map(t=>t.label||"(no label)").join(" | ")||"none listed"}`),i}catch(i){return this._note(`enumerateDevices \u2192 ${X(i)}`),[]}}_indexOfCurrent(){let e=this._stream?.getVideoTracks()[0];if(!e)return-1;let i=e.getSettings().deviceId,t=i?this._devices.findIndex(r=>r.deviceId===i):-1;return t>=0?t:e.label?this._devices.findIndex(r=>r.label===e.label):-1}_currentFacing(){let e=this._stream?.getVideoTracks()[0],i=e?.getSettings().facingMode;if(i==="user"||i==="environment")return i;let t=(this._deviceIndex>=0?this._devices[this._deviceIndex]?.label:"")||e?.label||"";return G.test(t)?"user":J.test(t)?"environment":this._facing}_describeTrack(){let e=this._stream?.getVideoTracks()[0];if(!e)return"no track";let i=e.getSettings(),t=i.width&&i.height?`${i.width}\xD7${i.height}`:"size ?";return[e.label||"no label",t,i.facingMode].filter(Boolean).join(", ")}_note(e){this._log.push(`+${Date.now()-this._t0} ms ${e}`),this._log.length>K&&this._log.splice(1,this._log.length-K)}async _switchCamera(){let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||this._devices.length<2||this._busy||this._switching)return;let i=this._gen,t=this._deviceIndex,r=t>=0?this._devices[t]:void 0,n=this._stream?.getVideoTracks()[0]?.getSettings().deviceId||r?.deviceId,s=this._facing==="user"?"environment":"user",d=this._nextCameras(t,n);!d.length&&this._refused.size&&(this._refused.clear(),d=this._nextCameras(t,n)),this._note(`switch from ${r?.label||"unknown camera"}`);let m=[...d.map(u=>this._byDevice(this._devices[u])),{video:{facingMode:{exact:s}},what:`facing ${s} (exact)`},{video:{facingMode:{ideal:s}},what:`facing ${s}`}];this._busy=!0,this._switchFailed=!1,this._copied=!1;try{let u=await this._replace(e,i,m,this._restoreCandidates(r,n));if(u==="cancelled")return;if(u==="lost"){this._unavailable("camera_lost");return}if(u!=="restored"&&!u.deviceId){if(this._isCamera(n,this._facing)){this._switchFailed=!0,await this._attach();return}this._facing=s}if(this._settle(u)&&u!=="restored"&&u.deviceId){let v=this._devices[this._deviceIndex]?.label??"";v&&O(L.cameraLabel,G.test(v)?"":v)}}finally{this._busy=!1}}_nextCameras(e,i){let t=this._devices.length,r=[];for(let n=1;n<=(e<0?t:t-1);n++){let s=(e+n)%t,d=this._devices[s].deviceId;d===i||this._refused.has(d)||r.push(s)}return r}_isCamera(e,i){let t=this._stream?.getVideoTracks()[0]?.getSettings();return e&&t?.deviceId?t.deviceId===e:!!t?.facingMode&&t.facingMode===i}close(){this._gen++,this._stopStream(),this._open=!1,this._busy=!1,this._switching=!1}disconnectedCallback(){super.disconnectedCallback(),this._gen++,this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let i of this._stream?.getTracks()??[])i.stop();this._stream=null;let e=this._video;e&&(e.srcObject=null)}_unavailable(e){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:e},bubbles:!0,composed:!0}))}async _copyLog(){let e=this._log.join(`
`),i=!1;try{navigator.clipboard?.writeText&&(await navigator.clipboard.writeText(e),i=!0)}catch{}if(!i){let t=this.shadowRoot?.querySelector(".details textarea");if(t){t.focus(),t.select();try{i=document.execCommand("copy")}catch{i=!1}}}this._copied=i}async _shoot(){let e=this._video;if(!(!e||this._busy||this._switching)){this._busy=!0;try{let i=e.videoWidth||640,t=e.videoHeight||480,r=Math.min(1,te/Math.max(i,t)),n=document.createElement("canvas");n.width=Math.round(i*r),n.height=Math.round(t*r);let s=n.getContext("2d");if(!s)throw new Error("no_canvas");s.drawImage(e,0,0,n.width,n.height);let d=await new Promise(v=>n.toBlob(v,"image/jpeg",ie));if(!d)throw new Error("no_blob");let m=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),u=new File([d],`photo-${m}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:u},bubbles:!0,composed:!0}))}catch(i){this._unavailable(i instanceof Error?i.message:String(i))}finally{this._busy=!1}}}render(){if(!this._open)return f;let e=this.lang,i=this._busy||this._switching;return l`
      <div class="overlay" role="dialog" aria-modal="true" aria-label=${o("doc_camera",e)}>
        <video autoplay playsinline muted></video>
        ${this._switching?l`<div class="switching" role="status">${o("camera_switching",e)}</div>`:f}
        ${this._switchFailed?l`<div class="switch-note" role="status">
              <div>${o("camera_not_answered",e)}</div>
              <details class="details">
                <summary>${o("camera_diagnostics",e)}</summary>
                <textarea readonly rows="6" .value=${this._log.join(`
`)}></textarea>
                <button type="button" class="copy" @click=${this._copyLog}>${o(this._copied?"camera_copied":"camera_copy",e)}</button>
              </details>
            </div>`:f}
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${o("cancel",e)}</button>
          ${this._devices.length>1?l`<button type="button" class="switch" ?disabled=${i} title=${o("camera_switch_lens",e)} aria-label=${o("camera_switch_lens",e)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
                <span class="switch-pos">${this._deviceIndex>=0?`${this._deviceIndex+1}/${this._devices.length}`:`?/${this._devices.length}`}</span>
              </button>`:f}
          <button type="button" class="shoot" ?disabled=${i} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${o("camera_capture_shoot",e)}</span>
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
  `,a([h({type:String})],b.prototype,"lang",2),a([_()],b.prototype,"_open",2),a([_()],b.prototype,"_busy",2),a([_()],b.prototype,"_switching",2),a([_()],b.prototype,"_devices",2),a([_()],b.prototype,"_deviceIndex",2),a([_()],b.prototype,"_switchFailed",2),a([_()],b.prototype,"_copied",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",b);var Z=x`
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
`,y=class extends k{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=S();this._inAppCamera=W()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(e){e.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:e},bubbles:!0,composed:!0}))}_onInput(e){let i=e.target,t=Array.from(i.files??[]);i.value="",this._emit(t)}_onCameraClick(e){!this._inAppCamera||this._locked||(e.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),!this._locked&&e.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return f;let e=this.lang,i=this._locked?"disabled":"",t=this.busy?o("uploading",e):o("doc_camera",e),r=o(this._singlePick?"choose_photo":"choose_photos",e);return l`
      <div class="photo-pickers">
        ${this.showCamera?l`<label class="photo-pick photo-pick-camera ${i}" role="button" tabindex="0"
              aria-label=${t} title=${this.compact?t:f}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?f:l`<span>${t}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:f}
        ${this.showGallery?l`<label class="photo-pick photo-pick-gallery ${i}" role="button" tabindex="0"
              aria-label=${r} title=${this.compact?r:f}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?f:l`<span>${r}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:f}
      </div>
      ${this.showGallery&&this._singlePick?l`<div class="photo-android-hint">${o("photos_android_hint",e)}</div>`:f}
      ${this.showCamera&&this._inAppCamera?l`<ms-camera-capture .lang=${e}
            @photo-captured=${n=>this._emit([n.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:f}
    `}};a([h({type:String})],y.prototype,"lang",2),a([h({type:Boolean})],y.prototype,"disabled",2),a([h({type:Boolean})],y.prototype,"busy",2),a([h({type:String})],y.prototype,"accept",2),a([h({type:Boolean})],y.prototype,"showCamera",2),a([h({type:Boolean})],y.prototype,"showGallery",2),a([h({type:Boolean})],y.prototype,"compact",2),a([h({type:Number})],y.prototype,"remaining",2),a([_()],y.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",y);var $=Q,c=class extends k{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.restockPackage="";this.currencySymbol="";this.partsCostMode="purchase";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new T(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this._usedQtyText={};this.checklistPrefill={}}open(e={}){this._open||(this._open=!0,this.viaTagScan=!!e.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((i,t)=>[String(t),!!this.checklistPrefill[i]]).filter(([,i])=>i)),this._feedback="needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(i=>[I(i),{...i}])),this._usedQtyText={})}_rangeError(e,i){let t=this.lang;return o("settings_value_out_of_range",t).replace("{min}",E(e,t,{maximumFractionDigits:2})).replace("{max}",E(i,t,{maximumFractionDigits:2}))}_toggleCheck(e){let i=String(e);this._checklistState={...this._checklistState,[i]:!this._checklistState[i]}}_setFeedback(e){this._feedback=e}async _complete(){if(this._loading||this._photos.uploading)return;this._error="",this._photos.clearError();let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId},i=this._notes.trim();if(i&&(e.notes=i),this._cost){let s=parseFloat(this._cost);isNaN(s)||(e.cost=s)}let t=V(this._duration);if(t!==null&&(e.duration=t),this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photos.photos.length>0&&(e.photo_doc_ids=this._photos.ids),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(A(this._completedAt)>Date.now()){this._error=o("completed_at_future_error",this.lang);return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let s={};for(let d of this.readings){let m=(this._readingValues[d.id]??"").trim();if(m==="")continue;let u=parseFloat(m.replace(",","."));isNaN(u)||(s[d.id]=u)}Object.keys(s).length>0&&(e.reading_values=s)}else if(this._readingValue!==""){let s=parseFloat(this._readingValue);isNaN(s)||(e.reading_value=s)}if(this.restockDefault!==null&&this._restockQty.trim()!==""){let s=parseFloat(this._restockQty.replace(",","."));if(!Number.isFinite(s)||s<w[0]||s>w[1]){this._error=this._rangeError(...w);return}e.restock_quantity=s}if(this.parts.length>0){let s=[];for(let[d,m]of Object.entries(this._usedParts)){let u=this._usedQtyText[d],v=u===void 0?m.quantity:parseFloat(u.replace(",","."));if(!Number.isFinite(v)||v<$[0]||v>$[1]){this._error=this._rangeError(...$);return}s.push({...m,quantity:v})}e.used_parts=s.map(d=>d.entry_id?{part_id:d.part_id,quantity:d.quantity,entry_id:d.entry_id}:{part_id:d.part_id,quantity:d.quantity})}let r=await j(this,e,{busy:s=>{this._loading=s},lang:this.lang,fallbackKey:"save_error",onError:s=>{this._error=s}});if(r===void 0)return;this._photos.markAttached(),this._open=!1;let n={entryId:this.entryId,taskId:this.taskId,taskName:this.taskName,undo:r?.undo===!0};this.dispatchEvent(new CustomEvent("task-completed",{detail:n}))}_renderReadingField(e,i){let t=this._completedAt?A(this._completedAt):NaN,r=H(this.readingHistory,e.id,isNaN(t)?void 0:t),n=e.unit||this.readingUnit,s=(this._readingValues[e.id]??"").trim(),d=s===""?NaN:parseFloat(s.replace(",",".")),m=r!==void 0&&!isNaN(d)&&d<r.value,u=r!==void 0?E(r.value,i,{maximumFractionDigits:3}):"";return l`
      <label class="field reading-field">
        <span class="field-label">${e.name}${n?` (${n})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${r!==void 0?o("reading_last",i).replace("{value}",u):""}
          .value=${this._readingValues[e.id]??""}
          @input=${v=>{this._readingValues={...this._readingValues,[e.id]:v.target.value}}} />
        ${m?l`<span class="reading-warn">${o("reading_below_last",i).replace("{value}",u)}</span>`:f}
      </label>`}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(i=>!e[i])}_demands(e){return this.requiredFields.includes(e)}_req(e){return this._demands(e)?l`<span class="req-mark" aria-hidden="true">*</span>`:f}_purchaseSuggestion(){if(this.restockDefault===null)return null;let e=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(e)||e<=0?null:Math.round(this.restockUnitCost*e*100)/100}_partsValue(){if(this.restockDefault!==null||!this.parts.length)return null;let e=0,i=!1;for(let t of Object.values(this._usedParts)){let r=this.parts.find(s=>I({part_id:s.id,entry_id:s.entry_id})===I(t)),n=U(r);n!==null&&(e+=n*(t.quantity||1),i=!0)}return i?Math.round(e*100)/100:null}_renderCostSuggestion(e){let i=this._purchaseSuggestion();if(this.restockDefault!==null){let s=this.partsCostMode==="use"?l`<div class="cost-note">${o("cost_purchase_use_hint",e)}</div>`:f;if(this._cost.trim()!==""||i==null||i<=0)return s;let d=q(i,this.currencySymbol,e);return l`<button
          type="button"
          class="cost-suggestion"
          @click=${()=>this._cost=String(Math.round(i*100)/100)}
        >${o("cost_from_parts",e).replace("{amount}",d)}</button>${s}`}let t=this._partsValue();if(t==null||t<=0)return f;let r=q(t,this.currencySymbol,e),n=this.partsCostMode==="use"?"cost_parts_booked":"cost_parts_info";return l`<div class="cost-note">${o(n,e).replace("{amount}",r)}</div>`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){this._completedAt=`${P()}:00`}render(){if(!this._open)return l``;let e=this.lang||this.hass?.language||"en",i=this._error||this._photos.errorText(e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${o("complete_title",e)}${this.taskName}</div>
        ${this.phaseLabel?l`<div class="phase-line">${o("phase_current",e)}: ${this.phaseLabel}</div>`:f}
        ${this.requireTagScan&&!this.viaTagScan?l`<div class="scan-required-note">${o("require_tag_scan_hint",e)}</div>`:f}
        <div class="content">
          ${i?l`<div class="error">${i}</div>`:f}
          ${this.checklist.length>0?l`
            <div class="checklist-section">
              <label class="checklist-label">${o("checklist",e)}</label>
              ${this.checklist.map((t,r)=>l`
                <label class="checklist-item" @click=${()=>this._toggleCheck(r)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(r)]} />
                  <span>${t}</span>
                </label>
              `)}
            </div>
          `:f}
          ${this.readings.length>0?l`<div class="readings-block">
                <span class="field-label">${o("readings_section",e)}</span>
                ${this.readings.map(t=>this._renderReadingField(t,e))}
              </div>`:this.taskType==="reading"?l`
              <label class="field">
                <span class="field-label">${o("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${t=>this._readingValue=t.target.value} />
              </label>`:f}
          ${this.parts.length?l`<div class="used-parts">
                <span class="field-label">${o("complete_parts_used",e)}</span>
                ${this.parts.map(t=>{let r=I({part_id:t.id,entry_id:t.entry_id}),n=this._usedParts[r],s=n!==void 0,d=t.entry_id?{part_id:t.id,quantity:1,entry_id:t.entry_id}:{part_id:t.id,quantity:1};return l`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${s}
                        @change=${m=>{let u={...this._usedParts};if(m.target.checked)u[r]=u[r]||d;else{delete u[r];let v={...this._usedQtyText};delete v[r],this._usedQtyText=v}this._usedParts=u}} />
                      <span
                        >${t.name}${t.owner_name?l`<span class="used-part-owner"> (${t.owner_name})</span>`:f}${t.stock!==null&&t.stock!==void 0?` (${F(t.stock,t.unit,e)})`:""}</span
                      >
                    </label>
                    ${s?l`<input class="used-part-qty" type="number" min=${$[0]} max=${$[1]} step="0.01"
                          .value=${this._usedQtyText[r]??String(n.quantity)}
                          @input=${m=>{let u=m.target.value;this._usedQtyText={...this._usedQtyText,[r]:u};let v=parseFloat(u.replace(",","."));Number.isFinite(v)&&v>=$[0]&&(this._usedParts={...this._usedParts,[r]:{...d,quantity:v}})}} />`:f}
                  </div>`})}
              </div>`:this.consumesInfo.length?l`<div class="consumes-hint">
                  ${this.consumesInfo.map(t=>l`<div>${t}</div>`)}
                </div>`:f}
          ${this.restockDefault!==null?l`
              <label class="field">
                <span class="field-label">${o("restock_quantity_label",e)}${this.restockPackage?` (\xD7 ${this.restockPackage})`:""}</span>
                <input type="number" step="0.01" min=${w[0]} max=${w[1]} class="field-input"
                  .value=${this._restockQty}
                  @input=${t=>this._restockQty=t.target.value} />
              </label>`:f}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${this._demands("notes")?o("notes_label",e):o("notes_optional",e)}${this._req("notes")}</span>
            <!-- Several lines (#202): what was done, one line each. The
                 history and the printouts keep the line breaks; they show
                 notes as plain text, so no Markdown hint here. -->
            <textarea class="field-input notes-input" rows="3"
              .value=${this._notes}
              @input=${t=>this._notes=t.target.value}></textarea>
          </label>
          <div class="field">
            <span class="field-label">${this._demands("cost")?o("cost",e):o("cost_optional",e)}${this._req("cost")}</span>
            <ms-cost-input .lang=${e} .value=${this._cost}
              @value-changed=${t=>this._cost=t.detail.value}></ms-cost-input>
            ${this._renderCostSuggestion(e)}
          </div>
          <label class="field">
            <span class="field-label">${this._demands("duration")?o("quick_complete_defaults_duration",e):o("duration_minutes",e)}${this._req("duration")}</span>
            <input type="number" step="1" min="0" inputmode="numeric" class="field-input"
              .value=${this._duration}
              @input=${t=>this._duration=t.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${o("completed_at_optional",e)}</span>
            ${this._completedAt?l`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${e}
                  .value=${this._completedAt}
                  .helper=${N(e)}
                  @value-changed=${t=>this._completedAt=t.detail.value}
                ></ms-date-field>`:l`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${o("completed_at_pick",e)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${this._demands("photo")?o("completion_photos",e):o("completion_photos_optional",e)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?l`<div class="photo-strip">
                  ${this._photos.photos.map(t=>l`
                    <div class="photo-preview">
                      <img src=${t.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(t.id)}
                        title="${o("remove",e)}">✕</button>
                    </div>`)}
                </div>`:f}
            ${this._photos.full?l`<div class="photo-limit">${o("photos_limit",e).replace("{max}",String(this._photos.max))}</div>`:l`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${t=>this._photos.addFiles(t.detail.files)}
                ></ms-photo-picker>`}
          </div>
          ${this.adaptiveEnabled?l`
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
          `:f}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${o("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._photos.uploading||this._missingRequired.length>0}
            title=${this._photos.uploading?o("uploading",e):this._missingRequired.length?this._missingRequired.map(t=>o("err_required",e).replace("{field}",o(B[t]??t,e))).join(" \xB7 "):""}
          >
            ${this._loading?o("completing",e):o("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};c.styles=[C,Z,x`
    .req-mark {
      color: var(--error-color, #f44336);
      margin-left: 2px;
      font-weight: 600;
    }
    .notes-input { resize: vertical; line-height: 1.4; }
    /* #104: one-click cost suggestion from parts — quiet link-style chip. */
    .cost-note {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 4px;
      line-height: 1.4;
    }
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
  `],a([h({attribute:!1})],c.prototype,"hass",2),a([h()],c.prototype,"entryId",2),a([h()],c.prototype,"taskId",2),a([h()],c.prototype,"taskName",2),a([h()],c.prototype,"lang",2),a([h({type:Array})],c.prototype,"checklist",2),a([h({type:Boolean})],c.prototype,"adaptiveEnabled",2),a([h()],c.prototype,"taskType",2),a([h()],c.prototype,"readingUnit",2),a([h({attribute:!1})],c.prototype,"readings",2),a([h({attribute:!1})],c.prototype,"readingHistory",2),a([h({attribute:!1})],c.prototype,"restockDefault",2),a([h({attribute:!1})],c.prototype,"restockUnitCost",2),a([h({attribute:!1})],c.prototype,"restockPackage",2),a([h()],c.prototype,"currencySymbol",2),a([h({attribute:!1})],c.prototype,"partsCostMode",2),a([h({attribute:!1})],c.prototype,"parts",2),a([h({attribute:!1})],c.prototype,"consumesParts",2),a([h({type:Array})],c.prototype,"consumesInfo",2),a([h({type:Array})],c.prototype,"requiredFields",2),a([h()],c.prototype,"phaseLabel",2),a([h({type:Boolean})],c.prototype,"requireTagScan",2),a([h({type:Boolean})],c.prototype,"viaTagScan",2),a([_()],c.prototype,"_open",2),a([_()],c.prototype,"_notes",2),a([_()],c.prototype,"_cost",2),a([_()],c.prototype,"_duration",2),a([_()],c.prototype,"_loading",2),a([_()],c.prototype,"_error",2),a([_()],c.prototype,"_checklistState",2),a([_()],c.prototype,"_feedback",2),a([_()],c.prototype,"_readingValue",2),a([_()],c.prototype,"_readingValues",2),a([_()],c.prototype,"_restockQty",2),a([_()],c.prototype,"_completedAt",2),a([_()],c.prototype,"_usedParts",2),a([_()],c.prototype,"_usedQtyText",2),a([h({attribute:!1})],c.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",c);export{S as a,Z as b,T as c,c as d};
