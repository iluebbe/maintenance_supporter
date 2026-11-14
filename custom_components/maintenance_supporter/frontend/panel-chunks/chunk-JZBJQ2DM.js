/*! maintenance_supporter frontend 2.121.0 */
import{d as M,e as I}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-2MPVRJTJ.js";import{a as k,b as $,c as E}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-KUPOTAU7.js";import{a as T}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-JN6DSOGJ.js";import{a as C,b as S}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-3AB2SQS5.js";import{b as _,c as g}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LCH6QYSS.js";import{a as o,b as y,e as u,h as p,k as w,z as l}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-74ISRDIW.js";function x(){if(window.externalApp!==void 0)return!0;let r=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(r)&&/Android/.test(r)}function U(){if(!x())return!1;let h=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!h&&typeof h.getUserMedia=="function"}var j=1920,z=.88,K={retryMs:500,windowMs:5e3},P=new Set(["NotReadableError","AbortError","TrackStartError"]),A=80,F=/back|rear|environment|rück|hinten/i,L=/front|user|selfie|vorne/i;function D(h){let r=/camera2?\s*(\d+)/i.exec(h);return r?Number(r[1]):Number.MAX_SAFE_INTEGER}function O(h,r){if(r){let t=h.find(i=>i.label===r);if(t)return t}return h.filter(t=>t.label&&F.test(t.label)).sort((t,i)=>D(t.label)-D(i.label))[0]??null}var R=h=>h?.name||"Error",B=h=>h?.message||"",f=class extends w{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._switching=!1;this._devices=[];this._deviceIndex=-1;this._switchFailed=!1;this._copied=!1;this.timing={...K};this._facing="environment";this._stream=null;this._opening=!1;this._gen=0;this._refused=new Set;this._log=[];this._t0=0;this._lastError=""}async open(){if(this._open||this._opening)return;this._opening=!0;let e=++this._gen;try{await this._acquireAndShow(e)}finally{this._opening=!1}}_live(e){return e===this._gen&&this.isConnected}async _acquireAndShow(e){let t=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!t||typeof t.getUserMedia!="function"){this._unavailable("no_media_devices");return}this._log=[],this._t0=Date.now(),this._lastError="",this._refused.clear(),this._switchFailed=!1,this._copied=!1,this._note(navigator.userAgent);let i=$(k.cameraLabel),s=await this._enumerate(t);if(!this._live(e))return;let a=O(s,i),n="refused";if(a&&(n=await this._openPatiently(t,e,this._byDevice(a))),n==="cancelled")return;if(n!=="ok"){if(n=await this._openPatiently(t,e,{video:{facingMode:{ideal:"environment"}},what:"facing environment"}),n==="cancelled")return;if(n!=="ok"){this._unavailable(this._lastError||"camera_unavailable");return}if(s=await this._enumerate(t),!this._live(e)){this._stopStream();return}}if(this._devices=s,this._deviceIndex=this._indexOfCurrent(),this._facing=this._currentFacing(),this._open=!0,await this.updateComplete,!this._live(e)){this._stopStream(),this._open=!1;return}await this._attach();let c=a?null:O(s,i),v=this._deviceIndex>=0?s[this._deviceIndex]:void 0;if(!c||c.deviceId===v?.deviceId)return;let d=await this._replace(t,e,[this._byDevice(c)],this._restoreCandidates(v));if(d!=="cancelled"){if(d==="lost"){this._unavailable("camera_lost");return}this._settle(d)}}async _openPatiently(e,t,i){let s=Date.now();for(;;){let a;try{a=await e.getUserMedia({video:i.video,audio:!1})}catch(n){let c=R(n),v=B(n);if(this._lastError=c,this._note(`${i.what} \u2192 ${c}${v&&v!==c?`: ${v}`:""}`),!this._live(t))return"cancelled";if(!P.has(c))return"refused";if(Date.now()-s+this.timing.retryMs>this.timing.windowMs)return"busy";if(await new Promise(d=>setTimeout(d,this.timing.retryMs)),!this._live(t))return"cancelled";continue}if(!this._live(t)){for(let n of a.getTracks())n.stop();return"cancelled"}return this._stream=a,this._note(`${i.what} \u2192 ok (${this._describeTrack()})`),"ok"}}async _replace(e,t,i,s){this._switching=!0,this._stopStream();try{for(let a of i){let n=await this._openPatiently(e,t,a);if(n==="ok")return a;if(n==="cancelled")return n;if(n==="busy"){a.deviceId&&this._refused.add(a.deviceId);break}}for(let a of s){let n=await this._openPatiently(e,t,a);if(n==="ok")return"restored";if(n==="cancelled")return n}return"lost"}finally{this._switching=!1}}_settle(e){if(e==="restored"){this._switchFailed=!0;let i=this._indexOfCurrent();return i>=0&&(this._deviceIndex=i),this._attach(),!1}this._switchFailed=!1;let t=e.deviceId?this._devices.findIndex(i=>i.deviceId===e.deviceId):-1;return this._deviceIndex=t>=0?t:this._indexOfCurrent(),this._facing=this._currentFacing(),this._attach(),!0}_byDevice(e){return{video:{deviceId:{exact:e.deviceId}},what:e.label||"camera (no label)",deviceId:e.deviceId}}_restoreCandidates(e,t){let i=[],s=e?.deviceId||t;return s&&i.push({video:{deviceId:{exact:s}},what:`${e?.label||"previous camera"} (back again)`,deviceId:s}),i.push({video:{facingMode:{ideal:this._facing}},what:`facing ${this._facing} (back again)`}),i}async _attach(){let e=this._video;if(!(!e||!this._stream)){e.srcObject=this._stream;try{await e.play()}catch{}}}async _enumerate(e){if(typeof e.enumerateDevices!="function")return[];try{let t=(await e.enumerateDevices()).filter(i=>i.kind==="videoinput"&&!!i.deviceId);return this._note(`cameras: ${t.map(i=>i.label||"(no label)").join(" | ")||"none listed"}`),t}catch(t){return this._note(`enumerateDevices \u2192 ${R(t)}`),[]}}_indexOfCurrent(){let e=this._stream?.getVideoTracks()[0];if(!e)return-1;let t=e.getSettings().deviceId,i=t?this._devices.findIndex(s=>s.deviceId===t):-1;return i>=0?i:e.label?this._devices.findIndex(s=>s.label===e.label):-1}_currentFacing(){let e=this._stream?.getVideoTracks()[0],t=e?.getSettings().facingMode;if(t==="user"||t==="environment")return t;let i=(this._deviceIndex>=0?this._devices[this._deviceIndex]?.label:"")||e?.label||"";return L.test(i)?"user":F.test(i)?"environment":this._facing}_describeTrack(){let e=this._stream?.getVideoTracks()[0];if(!e)return"no track";let t=e.getSettings(),i=t.width&&t.height?`${t.width}\xD7${t.height}`:"size ?";return[e.label||"no label",i,t.facingMode].filter(Boolean).join(", ")}_note(e){this._log.push(`+${Date.now()-this._t0} ms ${e}`),this._log.length>A&&this._log.splice(1,this._log.length-A)}async _switchCamera(){let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||this._devices.length<2||this._busy||this._switching)return;let t=this._gen,i=this._deviceIndex,s=i>=0?this._devices[i]:void 0,a=this._stream?.getVideoTracks()[0]?.getSettings().deviceId||s?.deviceId,n=this._facing==="user"?"environment":"user",c=this._nextCameras(i,a);!c.length&&this._refused.size&&(this._refused.clear(),c=this._nextCameras(i,a)),this._note(`switch from ${s?.label||"unknown camera"}`);let v=[...c.map(d=>this._byDevice(this._devices[d])),{video:{facingMode:{exact:n}},what:`facing ${n} (exact)`},{video:{facingMode:{ideal:n}},what:`facing ${n}`}];this._busy=!0,this._switchFailed=!1,this._copied=!1;try{let d=await this._replace(e,t,v,this._restoreCandidates(s,a));if(d==="cancelled")return;if(d==="lost"){this._unavailable("camera_lost");return}if(d!=="restored"&&!d.deviceId){if(this._isCamera(a,this._facing)){this._switchFailed=!0,await this._attach();return}this._facing=n}if(this._settle(d)&&d!=="restored"&&d.deviceId){let b=this._devices[this._deviceIndex]?.label??"";b&&E(k.cameraLabel,L.test(b)?"":b)}}finally{this._busy=!1}}_nextCameras(e,t){let i=this._devices.length,s=[];for(let a=1;a<=(e<0?i:i-1);a++){let n=(e+a)%i,c=this._devices[n].deviceId;c===t||this._refused.has(c)||s.push(n)}return s}_isCamera(e,t){let i=this._stream?.getVideoTracks()[0]?.getSettings();return e&&i?.deviceId?i.deviceId===e:!!i?.facingMode&&i.facingMode===t}close(){this._gen++,this._stopStream(),this._open=!1,this._busy=!1,this._switching=!1}disconnectedCallback(){super.disconnectedCallback(),this._gen++,this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let t of this._stream?.getTracks()??[])t.stop();this._stream=null;let e=this._video;e&&(e.srcObject=null)}_unavailable(e){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:e},bubbles:!0,composed:!0}))}async _copyLog(){let e=this._log.join(`
`),t=!1;try{navigator.clipboard?.writeText&&(await navigator.clipboard.writeText(e),t=!0)}catch{}if(!t){let i=this.shadowRoot?.querySelector(".details textarea");if(i){i.focus(),i.select();try{t=document.execCommand("copy")}catch{t=!1}}}this._copied=t}async _shoot(){let e=this._video;if(!(!e||this._busy||this._switching)){this._busy=!0;try{let t=e.videoWidth||640,i=e.videoHeight||480,s=Math.min(1,j/Math.max(t,i)),a=document.createElement("canvas");a.width=Math.round(t*s),a.height=Math.round(i*s);let n=a.getContext("2d");if(!n)throw new Error("no_canvas");n.drawImage(e,0,0,a.width,a.height);let c=await new Promise(b=>a.toBlob(b,"image/jpeg",z));if(!c)throw new Error("no_blob");let v=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),d=new File([c],`photo-${v}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:d},bubbles:!0,composed:!0}))}catch(t){this._unavailable(t instanceof Error?t.message:String(t))}finally{this._busy=!1}}}render(){if(!this._open)return p;let e=this.lang,t=this._busy||this._switching;return u`
      <div class="overlay top-layer" popover="manual" ${C} role="dialog" aria-modal="true" aria-label=${l("doc_camera",e)}>
        <video autoplay playsinline muted></video>
        ${this._switching?u`<div class="switching" role="status">${l("camera_switching",e)}</div>`:p}
        ${this._switchFailed?u`<div class="switch-note" role="status">
              <div>${l("camera_not_answered",e)}</div>
              ${T({cls:"details",header:l("camera_diagnostics",e)},u`
                <textarea readonly rows="6" .value=${this._log.join(`
`)}></textarea>
                <button type="button" class="copy" @click=${this._copyLog}>${l(this._copied?"camera_copied":"camera_copy",e)}</button>
              `)}
            </div>`:p}
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${l("cancel",e)}</button>
          ${this._devices.length>1?u`<button type="button" class="switch" ?disabled=${t} title=${l("camera_switch_lens",e)} aria-label=${l("camera_switch_lens",e)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
                <span class="switch-pos">${this._deviceIndex>=0?`${this._deviceIndex+1}/${this._devices.length}`:`?/${this._devices.length}`}</span>
              </button>`:p}
          <button type="button" class="shoot" ?disabled=${t} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${l("camera_capture_shoot",e)}</span>
          </button>
        </div>
      </div>
    `}};f.styles=[S,y`
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
      border: 1px solid rgba(255, 255, 255, 0.3); border-radius: var(--ms-radius-6, 6px); padding: 6px; resize: vertical;
    }
    .copy { background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.6); padding: 6px 14px; font-size: 13px; }
    .shoot { background: var(--primary-color, #03a9f4); color: #fff; border: none; font-weight: 600; }
    .shoot[disabled] { opacity: 0.6; cursor: default; }
    .shoot ha-icon { --mdc-icon-size: 22px; }
  `],o([_({type:String})],f.prototype,"lang",2),o([g()],f.prototype,"_open",2),o([g()],f.prototype,"_busy",2),o([g()],f.prototype,"_switching",2),o([g()],f.prototype,"_devices",2),o([g()],f.prototype,"_deviceIndex",2),o([g()],f.prototype,"_switchFailed",2),o([g()],f.prototype,"_copied",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",f);var oe=y`
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
`,m=class extends w{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=x();this._inAppCamera=U()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(e){e.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target,i=Array.from(t.files??[]);t.value="",this._emit(i)}_onCameraClick(e){!this._inAppCamera||this._locked||(e.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),!this._locked&&e.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return p;let e=this.lang,t=this._locked?"disabled":"",i=this.busy?l("uploading",e):l("doc_camera",e),s=l(this._singlePick?"choose_photo":"choose_photos",e);return u`
      <div class="photo-pickers">
        ${this.showCamera?u`<label class="photo-pick photo-pick-camera ${t}" role="button" tabindex="0"
              aria-label=${i} title=${this.compact?i:p}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?p:u`<span>${i}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
        ${this.showGallery?u`<label class="photo-pick photo-pick-gallery ${t}" role="button" tabindex="0"
              aria-label=${s} title=${this.compact?s:p}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?p:u`<span>${s}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
      </div>
      ${this.showGallery&&this._singlePick?u`<div class="photo-android-hint">${l("photos_android_hint",e)}</div>`:p}
      ${this.showCamera&&this._inAppCamera?u`<ms-camera-capture .lang=${e}
            @photo-captured=${a=>this._emit([a.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:p}
    `}};o([_({type:String})],m.prototype,"lang",2),o([_({type:Boolean})],m.prototype,"disabled",2),o([_({type:Boolean})],m.prototype,"busy",2),o([_({type:String})],m.prototype,"accept",2),o([_({type:Boolean})],m.prototype,"showCamera",2),o([_({type:Boolean})],m.prototype,"showGallery",2),o([_({type:Boolean})],m.prototype,"compact",2),o([_({type:Number})],m.prototype,"remaining",2),o([g()],m.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",m);var H=class{constructor(r,e){this.host=r;this.opts=e;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this._session=0;this._uploadEntry=new Map;this.max=e.max??10,r.addController(this)}hostConnected(){}get ids(){return this.photos.map(r=>r.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(r){return this.errorKey?l(this.errorKey,r).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(r=[]){this._endSession(),this._revokeAll(),this.photos=r.map(e=>({id:e,preview:""})),this.uploadedIds=[],this._uploadEntry.clear(),this.errorKey="",this.host.requestUpdate()}async addFiles(r){if(r.length===0)return;let e=this._session,t=this.opts.hass(),i=this.opts.entryId(),s=r.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let a of s){let n=await M(t,i,a);if(e!==this._session){I(t,i,[n]);return}this.uploadedIds=[...this.uploadedIds,n],this._uploadEntry.set(n,i),this.photos=[...this.photos,{id:n,preview:URL.createObjectURL(a)}],this.host.requestUpdate()}r.length>s.length&&(this.errorKey="photos_limit")}catch(a){if(e!==this._session)return;this.errorKey=a instanceof Error&&a.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{e===this._session&&(this.uploading=!1,this.host.requestUpdate())}}remove(r){let e=this.photos.find(t=>t.id===r);e?.preview&&URL.revokeObjectURL(e.preview),this.photos=this.photos.filter(t=>t.id!==r),this.uploadedIds.includes(r)&&(this.uploadedIds=this.uploadedIds.filter(t=>t!==r),this._discard([r])),this.host.requestUpdate()}discardOrphans(){if(this._endSession(),this.uploadedIds.length===0)return;let r=this.uploadedIds;this.uploadedIds=[],this._discard(r)}markAttached(){this._endSession(),this.uploadedIds=[],this._uploadEntry.clear()}_endSession(){this._session++,this.uploading=!1}_discard(r){let e=new Map;for(let i of r){let s=this._uploadEntry.get(i)??this.opts.entryId();this._uploadEntry.delete(i),e.set(s,[...e.get(s)??[],i])}let t=this.opts.hass();for(let[i,s]of e)I(t,i,s)}_revokeAll(){for(let r of this.photos)r.preview&&URL.revokeObjectURL(r.preview)}};export{x as a,oe as b,H as c};
