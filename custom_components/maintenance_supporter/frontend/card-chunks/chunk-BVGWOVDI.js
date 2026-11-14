/*! maintenance_supporter frontend 2.121.0 */
import{a as A,b as T}from"/maintenance_supporter_cardfiles/card-chunks/chunk-TLYMTC27.js";import{a as k,b as $,c as E}from"/maintenance_supporter_cardfiles/card-chunks/chunk-5H55EFWU.js";import{a as C}from"/maintenance_supporter_cardfiles/card-chunks/chunk-MQFJPGCQ.js";import{a as _,b as g}from"/maintenance_supporter_cardfiles/card-chunks/chunk-E4ABH5J2.js";import{a as c,b as y,e as u,h,j as w,x as p}from"/maintenance_supporter_cardfiles/card-chunks/chunk-WAUYZK63.js";async function j(r,o,e){let t=r.auth;if(t?.expired&&t.refreshAccessToken)try{await t.refreshAccessToken()}catch{}return fetch(o,{...e,headers:{...e.headers??{},Authorization:`Bearer ${t?.data?.access_token??""}`}})}var z=100*1024*1024,Y=500*1024*1024;async function B(r,o,e,t="doc_too_large",i=[]){let s=await j(r,o,{method:"POST",body:e});if(s.status===413)throw new Error(t);if(!s.ok){let n=await s.json().catch(()=>null);throw typeof n?.code=="string"&&i.includes(n.code)?new Error(n.code):new Error("doc_upload_failed")}return await s.json()}async function K(r,o,e,t,i){if(e.size>z)throw new Error("doc_too_large");let s=new FormData;s.append("entry_id",o);for(let a of t)s.append("tags",a);i&&s.append("purpose",i),s.append("file",e,e.name);let n=await B(r,"/api/maintenance_supporter/document/upload",s);if(!n.id)throw new Error("doc_upload_failed");return{id:n.id,deduped:!!n.deduped,duplicate_in_object:n.duplicate_in_object??null}}async function M(r,o,e){return(await K(r,o,e,["photo"],"completion")).id}async function I(r,o,e){await Promise.all(e.map(t=>r.connection.sendMessagePromise({type:"maintenance_supporter/documents/discard_upload",entry_id:o,doc_id:t}).catch(()=>{})))}var D=class{constructor(o,e){this.host=o;this.opts=e;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this._session=0;this._uploadEntry=new Map;this.max=e.max??10,o.addController(this)}hostConnected(){}get ids(){return this.photos.map(o=>o.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(o){return this.errorKey?p(this.errorKey,o).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(o=[]){this._endSession(),this._revokeAll(),this.photos=o.map(e=>({id:e,preview:""})),this.uploadedIds=[],this._uploadEntry.clear(),this.errorKey="",this.host.requestUpdate()}async addFiles(o){if(o.length===0)return;let e=this._session,t=this.opts.hass(),i=this.opts.entryId(),s=o.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let n of s){let a=await M(t,i,n);if(e!==this._session){I(t,i,[a]);return}this.uploadedIds=[...this.uploadedIds,a],this._uploadEntry.set(a,i),this.photos=[...this.photos,{id:a,preview:URL.createObjectURL(n)}],this.host.requestUpdate()}o.length>s.length&&(this.errorKey="photos_limit")}catch(n){if(e!==this._session)return;this.errorKey=n instanceof Error&&n.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{e===this._session&&(this.uploading=!1,this.host.requestUpdate())}}remove(o){let e=this.photos.find(t=>t.id===o);e?.preview&&URL.revokeObjectURL(e.preview),this.photos=this.photos.filter(t=>t.id!==o),this.uploadedIds.includes(o)&&(this.uploadedIds=this.uploadedIds.filter(t=>t!==o),this._discard([o])),this.host.requestUpdate()}discardOrphans(){if(this._endSession(),this.uploadedIds.length===0)return;let o=this.uploadedIds;this.uploadedIds=[],this._discard(o)}markAttached(){this._endSession(),this.uploadedIds=[],this._uploadEntry.clear()}_endSession(){this._session++,this.uploading=!1}_discard(o){let e=new Map;for(let i of o){let s=this._uploadEntry.get(i)??this.opts.entryId();this._uploadEntry.delete(i),e.set(s,[...e.get(s)??[],i])}let t=this.opts.hass();for(let[i,s]of e)I(t,i,s)}_revokeAll(){for(let o of this.photos)o.preview&&URL.revokeObjectURL(o.preview)}};function x(){if(window.externalApp!==void 0)return!0;let o=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(o)&&/Android/.test(o)}function H(){if(!x())return!1;let r=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!r&&typeof r.getUserMedia=="function"}var N=1920,q=.88,G={retryMs:500,windowMs:5e3},V=new Set(["NotReadableError","AbortError","TrackStartError"]),L=80,F=/back|rear|environment|rück|hinten/i,O=/front|user|selfie|vorne/i;function P(r){let o=/camera2?\s*(\d+)/i.exec(r);return o?Number(o[1]):Number.MAX_SAFE_INTEGER}function R(r,o){if(o){let t=r.find(i=>i.label===o);if(t)return t}return r.filter(t=>t.label&&F.test(t.label)).sort((t,i)=>P(t.label)-P(i.label))[0]??null}var U=r=>r?.name||"Error",X=r=>r?.message||"",m=class extends w{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._switching=!1;this._devices=[];this._deviceIndex=-1;this._switchFailed=!1;this._copied=!1;this.timing={...G};this._facing="environment";this._stream=null;this._opening=!1;this._gen=0;this._refused=new Set;this._log=[];this._t0=0;this._lastError=""}async open(){if(this._open||this._opening)return;this._opening=!0;let e=++this._gen;try{await this._acquireAndShow(e)}finally{this._opening=!1}}_live(e){return e===this._gen&&this.isConnected}async _acquireAndShow(e){let t=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!t||typeof t.getUserMedia!="function"){this._unavailable("no_media_devices");return}this._log=[],this._t0=Date.now(),this._lastError="",this._refused.clear(),this._switchFailed=!1,this._copied=!1,this._note(navigator.userAgent);let i=$(k.cameraLabel),s=await this._enumerate(t);if(!this._live(e))return;let n=R(s,i),a="refused";if(n&&(a=await this._openPatiently(t,e,this._byDevice(n))),a==="cancelled")return;if(a!=="ok"){if(a=await this._openPatiently(t,e,{video:{facingMode:{ideal:"environment"}},what:"facing environment"}),a==="cancelled")return;if(a!=="ok"){this._unavailable(this._lastError||"camera_unavailable");return}if(s=await this._enumerate(t),!this._live(e)){this._stopStream();return}}if(this._devices=s,this._deviceIndex=this._indexOfCurrent(),this._facing=this._currentFacing(),this._open=!0,await this.updateComplete,!this._live(e)){this._stopStream(),this._open=!1;return}await this._attach();let d=n?null:R(s,i),v=this._deviceIndex>=0?s[this._deviceIndex]:void 0;if(!d||d.deviceId===v?.deviceId)return;let l=await this._replace(t,e,[this._byDevice(d)],this._restoreCandidates(v));if(l!=="cancelled"){if(l==="lost"){this._unavailable("camera_lost");return}this._settle(l)}}async _openPatiently(e,t,i){let s=Date.now();for(;;){let n;try{n=await e.getUserMedia({video:i.video,audio:!1})}catch(a){let d=U(a),v=X(a);if(this._lastError=d,this._note(`${i.what} \u2192 ${d}${v&&v!==d?`: ${v}`:""}`),!this._live(t))return"cancelled";if(!V.has(d))return"refused";if(Date.now()-s+this.timing.retryMs>this.timing.windowMs)return"busy";if(await new Promise(l=>setTimeout(l,this.timing.retryMs)),!this._live(t))return"cancelled";continue}if(!this._live(t)){for(let a of n.getTracks())a.stop();return"cancelled"}return this._stream=n,this._note(`${i.what} \u2192 ok (${this._describeTrack()})`),"ok"}}async _replace(e,t,i,s){this._switching=!0,this._stopStream();try{for(let n of i){let a=await this._openPatiently(e,t,n);if(a==="ok")return n;if(a==="cancelled")return a;if(a==="busy"){n.deviceId&&this._refused.add(n.deviceId);break}}for(let n of s){let a=await this._openPatiently(e,t,n);if(a==="ok")return"restored";if(a==="cancelled")return a}return"lost"}finally{this._switching=!1}}_settle(e){if(e==="restored"){this._switchFailed=!0;let i=this._indexOfCurrent();return i>=0&&(this._deviceIndex=i),this._attach(),!1}this._switchFailed=!1;let t=e.deviceId?this._devices.findIndex(i=>i.deviceId===e.deviceId):-1;return this._deviceIndex=t>=0?t:this._indexOfCurrent(),this._facing=this._currentFacing(),this._attach(),!0}_byDevice(e){return{video:{deviceId:{exact:e.deviceId}},what:e.label||"camera (no label)",deviceId:e.deviceId}}_restoreCandidates(e,t){let i=[],s=e?.deviceId||t;return s&&i.push({video:{deviceId:{exact:s}},what:`${e?.label||"previous camera"} (back again)`,deviceId:s}),i.push({video:{facingMode:{ideal:this._facing}},what:`facing ${this._facing} (back again)`}),i}async _attach(){let e=this._video;if(!(!e||!this._stream)){e.srcObject=this._stream;try{await e.play()}catch{}}}async _enumerate(e){if(typeof e.enumerateDevices!="function")return[];try{let t=(await e.enumerateDevices()).filter(i=>i.kind==="videoinput"&&!!i.deviceId);return this._note(`cameras: ${t.map(i=>i.label||"(no label)").join(" | ")||"none listed"}`),t}catch(t){return this._note(`enumerateDevices \u2192 ${U(t)}`),[]}}_indexOfCurrent(){let e=this._stream?.getVideoTracks()[0];if(!e)return-1;let t=e.getSettings().deviceId,i=t?this._devices.findIndex(s=>s.deviceId===t):-1;return i>=0?i:e.label?this._devices.findIndex(s=>s.label===e.label):-1}_currentFacing(){let e=this._stream?.getVideoTracks()[0],t=e?.getSettings().facingMode;if(t==="user"||t==="environment")return t;let i=(this._deviceIndex>=0?this._devices[this._deviceIndex]?.label:"")||e?.label||"";return O.test(i)?"user":F.test(i)?"environment":this._facing}_describeTrack(){let e=this._stream?.getVideoTracks()[0];if(!e)return"no track";let t=e.getSettings(),i=t.width&&t.height?`${t.width}\xD7${t.height}`:"size ?";return[e.label||"no label",i,t.facingMode].filter(Boolean).join(", ")}_note(e){this._log.push(`+${Date.now()-this._t0} ms ${e}`),this._log.length>L&&this._log.splice(1,this._log.length-L)}async _switchCamera(){let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||this._devices.length<2||this._busy||this._switching)return;let t=this._gen,i=this._deviceIndex,s=i>=0?this._devices[i]:void 0,n=this._stream?.getVideoTracks()[0]?.getSettings().deviceId||s?.deviceId,a=this._facing==="user"?"environment":"user",d=this._nextCameras(i,n);!d.length&&this._refused.size&&(this._refused.clear(),d=this._nextCameras(i,n)),this._note(`switch from ${s?.label||"unknown camera"}`);let v=[...d.map(l=>this._byDevice(this._devices[l])),{video:{facingMode:{exact:a}},what:`facing ${a} (exact)`},{video:{facingMode:{ideal:a}},what:`facing ${a}`}];this._busy=!0,this._switchFailed=!1,this._copied=!1;try{let l=await this._replace(e,t,v,this._restoreCandidates(s,n));if(l==="cancelled")return;if(l==="lost"){this._unavailable("camera_lost");return}if(l!=="restored"&&!l.deviceId){if(this._isCamera(n,this._facing)){this._switchFailed=!0,await this._attach();return}this._facing=a}if(this._settle(l)&&l!=="restored"&&l.deviceId){let b=this._devices[this._deviceIndex]?.label??"";b&&E(k.cameraLabel,O.test(b)?"":b)}}finally{this._busy=!1}}_nextCameras(e,t){let i=this._devices.length,s=[];for(let n=1;n<=(e<0?i:i-1);n++){let a=(e+n)%i,d=this._devices[a].deviceId;d===t||this._refused.has(d)||s.push(a)}return s}_isCamera(e,t){let i=this._stream?.getVideoTracks()[0]?.getSettings();return e&&i?.deviceId?i.deviceId===e:!!i?.facingMode&&i.facingMode===t}close(){this._gen++,this._stopStream(),this._open=!1,this._busy=!1,this._switching=!1}disconnectedCallback(){super.disconnectedCallback(),this._gen++,this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let t of this._stream?.getTracks()??[])t.stop();this._stream=null;let e=this._video;e&&(e.srcObject=null)}_unavailable(e){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:e},bubbles:!0,composed:!0}))}async _copyLog(){let e=this._log.join(`
`),t=!1;try{navigator.clipboard?.writeText&&(await navigator.clipboard.writeText(e),t=!0)}catch{}if(!t){let i=this.shadowRoot?.querySelector(".details textarea");if(i){i.focus(),i.select();try{t=document.execCommand("copy")}catch{t=!1}}}this._copied=t}async _shoot(){let e=this._video;if(!(!e||this._busy||this._switching)){this._busy=!0;try{let t=e.videoWidth||640,i=e.videoHeight||480,s=Math.min(1,N/Math.max(t,i)),n=document.createElement("canvas");n.width=Math.round(t*s),n.height=Math.round(i*s);let a=n.getContext("2d");if(!a)throw new Error("no_canvas");a.drawImage(e,0,0,n.width,n.height);let d=await new Promise(b=>n.toBlob(b,"image/jpeg",q));if(!d)throw new Error("no_blob");let v=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),l=new File([d],`photo-${v}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:l},bubbles:!0,composed:!0}))}catch(t){this._unavailable(t instanceof Error?t.message:String(t))}finally{this._busy=!1}}}render(){if(!this._open)return h;let e=this.lang,t=this._busy||this._switching;return u`
      <div class="overlay top-layer" popover="manual" ${A} role="dialog" aria-modal="true" aria-label=${p("doc_camera",e)}>
        <video autoplay playsinline muted></video>
        ${this._switching?u`<div class="switching" role="status">${p("camera_switching",e)}</div>`:h}
        ${this._switchFailed?u`<div class="switch-note" role="status">
              <div>${p("camera_not_answered",e)}</div>
              ${C({cls:"details",header:p("camera_diagnostics",e)},u`
                <textarea readonly rows="6" .value=${this._log.join(`
`)}></textarea>
                <button type="button" class="copy" @click=${this._copyLog}>${p(this._copied?"camera_copied":"camera_copy",e)}</button>
              `)}
            </div>`:h}
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${p("cancel",e)}</button>
          ${this._devices.length>1?u`<button type="button" class="switch" ?disabled=${t} title=${p("camera_switch_lens",e)} aria-label=${p("camera_switch_lens",e)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
                <span class="switch-pos">${this._deviceIndex>=0?`${this._deviceIndex+1}/${this._devices.length}`:`?/${this._devices.length}`}</span>
              </button>`:h}
          <button type="button" class="shoot" ?disabled=${t} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${p("camera_capture_shoot",e)}</span>
          </button>
        </div>
      </div>
    `}};m.styles=[T,y`
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
  `],c([_({type:String})],m.prototype,"lang",2),c([g()],m.prototype,"_open",2),c([g()],m.prototype,"_busy",2),c([g()],m.prototype,"_switching",2),c([g()],m.prototype,"_devices",2),c([g()],m.prototype,"_deviceIndex",2),c([g()],m.prototype,"_switchFailed",2),c([g()],m.prototype,"_copied",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",m);var ve=y`
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
`,f=class extends w{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=x();this._inAppCamera=H()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(e){e.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target,i=Array.from(t.files??[]);t.value="",this._emit(i)}_onCameraClick(e){!this._inAppCamera||this._locked||(e.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),!this._locked&&e.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return h;let e=this.lang,t=this._locked?"disabled":"",i=this.busy?p("uploading",e):p("doc_camera",e),s=p(this._singlePick?"choose_photo":"choose_photos",e);return u`
      <div class="photo-pickers">
        ${this.showCamera?u`<label class="photo-pick photo-pick-camera ${t}" role="button" tabindex="0"
              aria-label=${i} title=${this.compact?i:h}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?h:u`<span>${i}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:h}
        ${this.showGallery?u`<label class="photo-pick photo-pick-gallery ${t}" role="button" tabindex="0"
              aria-label=${s} title=${this.compact?s:h}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?h:u`<span>${s}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:h}
      </div>
      ${this.showGallery&&this._singlePick?u`<div class="photo-android-hint">${p("photos_android_hint",e)}</div>`:h}
      ${this.showCamera&&this._inAppCamera?u`<ms-camera-capture .lang=${e}
            @photo-captured=${n=>this._emit([n.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:h}
    `}};c([_({type:String})],f.prototype,"lang",2),c([_({type:Boolean})],f.prototype,"disabled",2),c([_({type:Boolean})],f.prototype,"busy",2),c([_({type:String})],f.prototype,"accept",2),c([_({type:Boolean})],f.prototype,"showCamera",2),c([_({type:Boolean})],f.prototype,"showGallery",2),c([_({type:Boolean})],f.prototype,"compact",2),c([_({type:Number})],f.prototype,"remaining",2),c([g()],f.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",f);export{D as a,ve as b};
