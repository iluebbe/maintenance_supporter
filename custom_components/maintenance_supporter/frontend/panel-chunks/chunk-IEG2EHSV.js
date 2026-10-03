/*! maintenance_supporter frontend 2.97.1 */
import{d as H,e as L}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-QEKEY7ZD.js";import{a as q,b as F,c as N}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-EPK25IMX.js";import{c as C,g as z}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-5SGCD2J3.js";import{a as E,g as O,k as Q,m as V}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-2CZ4LD2Q.js";import{j,k as w}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-GSRF4WCQ.js";import{a as U}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-GVLO7RZ4.js";import{B as I,C as A,D as R,R as P,a as o,b as x,c,f,h as k,l as p,m as _,s as n}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YJXVPPWG.js";var S=class{constructor(d,e){this.host=d;this.opts=e;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this._session=0;this._uploadEntry=new Map;this.max=e.max??10,d.addController(this)}hostConnected(){}get ids(){return this.photos.map(d=>d.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(d){return this.errorKey?n(this.errorKey,d).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(d=[]){this._endSession(),this._revokeAll(),this.photos=d.map(e=>({id:e,preview:""})),this.uploadedIds=[],this._uploadEntry.clear(),this.errorKey="",this.host.requestUpdate()}async addFiles(d){if(d.length===0)return;let e=this._session,i=this.opts.hass(),t=this.opts.entryId(),r=d.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let s of r){let a=await H(i,t,s);if(e!==this._session){L(i,t,[a]);return}this.uploadedIds=[...this.uploadedIds,a],this._uploadEntry.set(a,t),this.photos=[...this.photos,{id:a,preview:URL.createObjectURL(s)}],this.host.requestUpdate()}d.length>r.length&&(this.errorKey="photos_limit")}catch(s){if(e!==this._session)return;this.errorKey=s instanceof Error&&s.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{e===this._session&&(this.uploading=!1,this.host.requestUpdate())}}remove(d){let e=this.photos.find(i=>i.id===d);e?.preview&&URL.revokeObjectURL(e.preview),this.photos=this.photos.filter(i=>i.id!==d),this.uploadedIds.includes(d)&&(this.uploadedIds=this.uploadedIds.filter(i=>i!==d),this._discard([d])),this.host.requestUpdate()}discardOrphans(){if(this._endSession(),this.uploadedIds.length===0)return;let d=this.uploadedIds;this.uploadedIds=[],this._discard(d)}markAttached(){this._endSession(),this.uploadedIds=[],this._uploadEntry.clear()}_endSession(){this._session++,this.uploading=!1}_discard(d){let e=new Map;for(let t of d){let r=this._uploadEntry.get(t)??this.opts.entryId();this._uploadEntry.delete(t),e.set(r,[...e.get(r)??[],t])}let i=this.opts.hass();for(let[t,r]of e)L(i,t,r)}_revokeAll(){for(let d of this.photos)d.preview&&URL.revokeObjectURL(d.preview)}};function T(){if(window.externalApp!==void 0)return!0;let d=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(d)&&/Android/.test(d)}function D(){if(!T())return!1;let v=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!v&&typeof v.getUserMedia=="function"}var Z=1920,ee=.88,te={retryMs:500,windowMs:5e3},ie=new Set(["NotReadableError","AbortError","TrackStartError"]),M=80,X=/back|rear|environment|rück|hinten/i,B=/front|user|selfie|vorne/i;function K(v){let d=/camera2?\s*(\d+)/i.exec(v);return d?Number(d[1]):Number.MAX_SAFE_INTEGER}function G(v,d){if(d){let i=v.find(t=>t.label===d);if(i)return i}return v.filter(i=>i.label&&X.test(i.label)).sort((i,t)=>K(i.label)-K(t.label))[0]??null}var Y=v=>v?.name||"Error",se=v=>v?.message||"",b=class extends k{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._switching=!1;this._devices=[];this._deviceIndex=-1;this._switchFailed=!1;this._copied=!1;this.timing={...te};this._facing="environment";this._stream=null;this._opening=!1;this._gen=0;this._refused=new Set;this._log=[];this._t0=0;this._lastError=""}async open(){if(this._open||this._opening)return;this._opening=!0;let e=++this._gen;try{await this._acquireAndShow(e)}finally{this._opening=!1}}_live(e){return e===this._gen&&this.isConnected}async _acquireAndShow(e){let i=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!i||typeof i.getUserMedia!="function"){this._unavailable("no_media_devices");return}this._log=[],this._t0=Date.now(),this._lastError="",this._refused.clear(),this._switchFailed=!1,this._copied=!1,this._note(navigator.userAgent);let t=F(q.cameraLabel),r=await this._enumerate(i);if(!this._live(e))return;let s=G(r,t),a="refused";if(s&&(a=await this._openPatiently(i,e,this._byDevice(s))),a==="cancelled")return;if(a!=="ok"){if(a=await this._openPatiently(i,e,{video:{facingMode:{ideal:"environment"}},what:"facing environment"}),a==="cancelled")return;if(a!=="ok"){this._unavailable(this._lastError||"camera_unavailable");return}if(r=await this._enumerate(i),!this._live(e)){this._stopStream();return}}if(this._devices=r,this._deviceIndex=this._indexOfCurrent(),this._facing=this._currentFacing(),this._open=!0,await this.updateComplete,!this._live(e)){this._stopStream(),this._open=!1;return}await this._attach();let u=s?null:G(r,t),m=this._deviceIndex>=0?r[this._deviceIndex]:void 0;if(!u||u.deviceId===m?.deviceId)return;let h=await this._replace(i,e,[this._byDevice(u)],this._restoreCandidates(m));if(h!=="cancelled"){if(h==="lost"){this._unavailable("camera_lost");return}this._settle(h)}}async _openPatiently(e,i,t){let r=Date.now();for(;;){let s;try{s=await e.getUserMedia({video:t.video,audio:!1})}catch(a){let u=Y(a),m=se(a);if(this._lastError=u,this._note(`${t.what} \u2192 ${u}${m&&m!==u?`: ${m}`:""}`),!this._live(i))return"cancelled";if(!ie.has(u))return"refused";if(Date.now()-r+this.timing.retryMs>this.timing.windowMs)return"busy";if(await new Promise(h=>setTimeout(h,this.timing.retryMs)),!this._live(i))return"cancelled";continue}if(!this._live(i)){for(let a of s.getTracks())a.stop();return"cancelled"}return this._stream=s,this._note(`${t.what} \u2192 ok (${this._describeTrack()})`),"ok"}}async _replace(e,i,t,r){this._switching=!0,this._stopStream();try{for(let s of t){let a=await this._openPatiently(e,i,s);if(a==="ok")return s;if(a==="cancelled")return a;if(a==="busy"){s.deviceId&&this._refused.add(s.deviceId);break}}for(let s of r){let a=await this._openPatiently(e,i,s);if(a==="ok")return"restored";if(a==="cancelled")return a}return"lost"}finally{this._switching=!1}}_settle(e){if(e==="restored"){this._switchFailed=!0;let t=this._indexOfCurrent();return t>=0&&(this._deviceIndex=t),this._attach(),!1}this._switchFailed=!1;let i=e.deviceId?this._devices.findIndex(t=>t.deviceId===e.deviceId):-1;return this._deviceIndex=i>=0?i:this._indexOfCurrent(),this._facing=this._currentFacing(),this._attach(),!0}_byDevice(e){return{video:{deviceId:{exact:e.deviceId}},what:e.label||"camera (no label)",deviceId:e.deviceId}}_restoreCandidates(e,i){let t=[],r=e?.deviceId||i;return r&&t.push({video:{deviceId:{exact:r}},what:`${e?.label||"previous camera"} (back again)`,deviceId:r}),t.push({video:{facingMode:{ideal:this._facing}},what:`facing ${this._facing} (back again)`}),t}async _attach(){let e=this._video;if(!(!e||!this._stream)){e.srcObject=this._stream;try{await e.play()}catch{}}}async _enumerate(e){if(typeof e.enumerateDevices!="function")return[];try{let i=(await e.enumerateDevices()).filter(t=>t.kind==="videoinput"&&!!t.deviceId);return this._note(`cameras: ${i.map(t=>t.label||"(no label)").join(" | ")||"none listed"}`),i}catch(i){return this._note(`enumerateDevices \u2192 ${Y(i)}`),[]}}_indexOfCurrent(){let e=this._stream?.getVideoTracks()[0];if(!e)return-1;let i=e.getSettings().deviceId,t=i?this._devices.findIndex(r=>r.deviceId===i):-1;return t>=0?t:e.label?this._devices.findIndex(r=>r.label===e.label):-1}_currentFacing(){let e=this._stream?.getVideoTracks()[0],i=e?.getSettings().facingMode;if(i==="user"||i==="environment")return i;let t=(this._deviceIndex>=0?this._devices[this._deviceIndex]?.label:"")||e?.label||"";return B.test(t)?"user":X.test(t)?"environment":this._facing}_describeTrack(){let e=this._stream?.getVideoTracks()[0];if(!e)return"no track";let i=e.getSettings(),t=i.width&&i.height?`${i.width}\xD7${i.height}`:"size ?";return[e.label||"no label",t,i.facingMode].filter(Boolean).join(", ")}_note(e){this._log.push(`+${Date.now()-this._t0} ms ${e}`),this._log.length>M&&this._log.splice(1,this._log.length-M)}async _switchCamera(){let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||this._devices.length<2||this._busy||this._switching)return;let i=this._gen,t=this._deviceIndex,r=t>=0?this._devices[t]:void 0,s=this._stream?.getVideoTracks()[0]?.getSettings().deviceId||r?.deviceId,a=this._facing==="user"?"environment":"user",u=this._nextCameras(t,s);!u.length&&this._refused.size&&(this._refused.clear(),u=this._nextCameras(t,s)),this._note(`switch from ${r?.label||"unknown camera"}`);let m=[...u.map(h=>this._byDevice(this._devices[h])),{video:{facingMode:{exact:a}},what:`facing ${a} (exact)`},{video:{facingMode:{ideal:a}},what:`facing ${a}`}];this._busy=!0,this._switchFailed=!1,this._copied=!1;try{let h=await this._replace(e,i,m,this._restoreCandidates(r,s));if(h==="cancelled")return;if(h==="lost"){this._unavailable("camera_lost");return}if(h!=="restored"&&!h.deviceId){if(this._isCamera(s,this._facing)){this._switchFailed=!0,await this._attach();return}this._facing=a}if(this._settle(h)&&h!=="restored"&&h.deviceId){let g=this._devices[this._deviceIndex]?.label??"";g&&N(q.cameraLabel,B.test(g)?"":g)}}finally{this._busy=!1}}_nextCameras(e,i){let t=this._devices.length,r=[];for(let s=1;s<=(e<0?t:t-1);s++){let a=(e+s)%t,u=this._devices[a].deviceId;u===i||this._refused.has(u)||r.push(a)}return r}_isCamera(e,i){let t=this._stream?.getVideoTracks()[0]?.getSettings();return e&&t?.deviceId?t.deviceId===e:!!t?.facingMode&&t.facingMode===i}close(){this._gen++,this._stopStream(),this._open=!1,this._busy=!1,this._switching=!1}disconnectedCallback(){super.disconnectedCallback(),this._gen++,this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let i of this._stream?.getTracks()??[])i.stop();this._stream=null;let e=this._video;e&&(e.srcObject=null)}_unavailable(e){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:e},bubbles:!0,composed:!0}))}async _copyLog(){let e=this._log.join(`
`),i=!1;try{navigator.clipboard?.writeText&&(await navigator.clipboard.writeText(e),i=!0)}catch{}if(!i){let t=this.shadowRoot?.querySelector(".details textarea");if(t){t.focus(),t.select();try{i=document.execCommand("copy")}catch{i=!1}}}this._copied=i}async _shoot(){let e=this._video;if(!(!e||this._busy||this._switching)){this._busy=!0;try{let i=e.videoWidth||640,t=e.videoHeight||480,r=Math.min(1,Z/Math.max(i,t)),s=document.createElement("canvas");s.width=Math.round(i*r),s.height=Math.round(t*r);let a=s.getContext("2d");if(!a)throw new Error("no_canvas");a.drawImage(e,0,0,s.width,s.height);let u=await new Promise(g=>s.toBlob(g,"image/jpeg",ee));if(!u)throw new Error("no_blob");let m=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),h=new File([u],`photo-${m}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:h},bubbles:!0,composed:!0}))}catch(i){this._unavailable(i instanceof Error?i.message:String(i))}finally{this._busy=!1}}}render(){if(!this._open)return f;let e=this.lang,i=this._busy||this._switching;return c`
      <div class="overlay" role="dialog" aria-modal="true" aria-label=${n("doc_camera",e)}>
        <video autoplay playsinline muted></video>
        ${this._switching?c`<div class="switching" role="status">${n("camera_switching",e)}</div>`:f}
        ${this._switchFailed?c`<div class="switch-note" role="status">
              <div>${n("camera_not_answered",e)}</div>
              <details class="details">
                <summary>${n("camera_diagnostics",e)}</summary>
                <textarea readonly rows="6" .value=${this._log.join(`
`)}></textarea>
                <button type="button" class="copy" @click=${this._copyLog}>${n(this._copied?"camera_copied":"camera_copy",e)}</button>
              </details>
            </div>`:f}
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${n("cancel",e)}</button>
          ${this._devices.length>1?c`<button type="button" class="switch" ?disabled=${i} title=${n("camera_switch_lens",e)} aria-label=${n("camera_switch_lens",e)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
                <span class="switch-pos">${this._deviceIndex>=0?`${this._deviceIndex+1}/${this._devices.length}`:`?/${this._devices.length}`}</span>
              </button>`:f}
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
  `,o([p({type:String})],b.prototype,"lang",2),o([_()],b.prototype,"_open",2),o([_()],b.prototype,"_busy",2),o([_()],b.prototype,"_switching",2),o([_()],b.prototype,"_devices",2),o([_()],b.prototype,"_deviceIndex",2),o([_()],b.prototype,"_switchFailed",2),o([_()],b.prototype,"_copied",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",b);var W=x`
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
`,y=class extends k{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=T();this._inAppCamera=D()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(e){e.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:e},bubbles:!0,composed:!0}))}_onInput(e){let i=e.target,t=Array.from(i.files??[]);i.value="",this._emit(t)}_onCameraClick(e){!this._inAppCamera||this._locked||(e.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),!this._locked&&e.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return f;let e=this.lang,i=this._locked?"disabled":"",t=this.busy?n("uploading",e):n("doc_camera",e),r=n(this._singlePick?"choose_photo":"choose_photos",e);return c`
      <div class="photo-pickers">
        ${this.showCamera?c`<label class="photo-pick photo-pick-camera ${i}" role="button" tabindex="0"
              aria-label=${t} title=${this.compact?t:f}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?f:c`<span>${t}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:f}
        ${this.showGallery?c`<label class="photo-pick photo-pick-gallery ${i}" role="button" tabindex="0"
              aria-label=${r} title=${this.compact?r:f}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?f:c`<span>${r}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:f}
      </div>
      ${this.showGallery&&this._singlePick?c`<div class="photo-android-hint">${n("photos_android_hint",e)}</div>`:f}
      ${this.showCamera&&this._inAppCamera?c`<ms-camera-capture .lang=${e}
            @photo-captured=${s=>this._emit([s.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:f}
    `}};o([p({type:String})],y.prototype,"lang",2),o([p({type:Boolean})],y.prototype,"disabled",2),o([p({type:Boolean})],y.prototype,"busy",2),o([p({type:String})],y.prototype,"accept",2),o([p({type:Boolean})],y.prototype,"showCamera",2),o([p({type:Boolean})],y.prototype,"showGallery",2),o([p({type:Boolean})],y.prototype,"compact",2),o([p({type:Number})],y.prototype,"remaining",2),o([_()],y.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",y);var $=j,l=class extends k{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.restockPackage="";this.currencySymbol="";this.partsCostMode="purchase";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new S(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this._usedQtyText={};this.checklistPrefill={}}open(e={}){this._open||(this._open=!0,this.viaTagScan=!!e.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((i,t)=>[String(t),!!this.checklistPrefill[i]]).filter(([,i])=>i)),this._feedback="needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(i=>[E(i),{...i}])),this._usedQtyText={})}_rangeError(e,i){let t=this.lang;return n("settings_value_out_of_range",t).replace("{min}",I(e,t,{maximumFractionDigits:2})).replace("{max}",I(i,t,{maximumFractionDigits:2}))}_toggleCheck(e){let i=String(e);this._checklistState={...this._checklistState,[i]:!this._checklistState[i]}}_setFeedback(e){this._feedback=e}async _complete(){if(this._loading||this._photos.uploading)return;this._error="",this._photos.clearError();let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId},i=this._notes.trim();if(i&&(e.notes=i),this._cost){let s=parseFloat(this._cost);isNaN(s)||(e.cost=s)}let t=Q(this._duration);if(t!==null&&(e.duration=t),this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photos.photos.length>0&&(e.photo_doc_ids=this._photos.ids),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(new Date(this._completedAt).getTime()>Date.now()){this._error=n("completed_at_future_error",this.lang);return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let s={};for(let a of this.readings){let u=(this._readingValues[a.id]??"").trim();if(u==="")continue;let m=parseFloat(u.replace(",","."));isNaN(m)||(s[a.id]=m)}Object.keys(s).length>0&&(e.reading_values=s)}else if(this._readingValue!==""){let s=parseFloat(this._readingValue);isNaN(s)||(e.reading_value=s)}if(this.restockDefault!==null&&this._restockQty.trim()!==""){let s=parseFloat(this._restockQty.replace(",","."));if(!Number.isFinite(s)||s<w[0]||s>w[1]){this._error=this._rangeError(...w);return}e.restock_quantity=s}if(this.parts.length>0){let s=[];for(let[a,u]of Object.entries(this._usedParts)){let m=this._usedQtyText[a],h=m===void 0?u.quantity:parseFloat(m.replace(",","."));if(!Number.isFinite(h)||h<$[0]||h>$[1]){this._error=this._rangeError(...$);return}s.push({...u,quantity:h})}e.used_parts=s.map(a=>a.entry_id?{part_id:a.part_id,quantity:a.quantity,entry_id:a.entry_id}:{part_id:a.part_id,quantity:a.quantity})}await U(this,e,{busy:s=>{this._loading=s},lang:this.lang,fallbackKey:"save_error",onError:s=>{this._error=s}})!==void 0&&(this._photos.markAttached(),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed")))}_renderReadingField(e,i){let t=this._completedAt?new Date(this._completedAt).getTime():NaN,r=O(this.readingHistory,e.id,isNaN(t)?void 0:t),s=e.unit||this.readingUnit,a=(this._readingValues[e.id]??"").trim(),u=a===""?NaN:parseFloat(a.replace(",",".")),m=r!==void 0&&!isNaN(u)&&u<r.value,h=r!==void 0?I(r.value,i,{maximumFractionDigits:3}):"";return c`
      <label class="field reading-field">
        <span class="field-label">${e.name}${s?` (${s})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${r!==void 0?n("reading_last",i).replace("{value}",h):""}
          .value=${this._readingValues[e.id]??""}
          @input=${g=>{this._readingValues={...this._readingValues,[e.id]:g.target.value}}} />
        ${m?c`<span class="reading-warn">${n("reading_below_last",i).replace("{value}",h)}</span>`:f}
      </label>`}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(i=>!e[i])}_demands(e){return this.requiredFields.includes(e)}_req(e){return this._demands(e)?c`<span class="req-mark" aria-hidden="true">*</span>`:f}_purchaseSuggestion(){if(this.restockDefault===null)return null;let e=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(e)||e<=0?null:Math.round(this.restockUnitCost*e*100)/100}_partsValue(){if(this.restockDefault!==null||!this.parts.length)return null;let e=0,i=!1;for(let t of Object.values(this._usedParts)){let r=this.parts.find(a=>E({part_id:a.id,entry_id:a.entry_id})===E(t)),s=C(r);s!==null&&(e+=s*(t.quantity||1),i=!0)}return i?Math.round(e*100)/100:null}_renderCostSuggestion(e){let i=this._purchaseSuggestion();if(this.restockDefault!==null){let a=this.partsCostMode==="use"?c`<div class="cost-note">${n("cost_purchase_use_hint",e)}</div>`:f;if(this._cost.trim()!==""||i==null||i<=0)return a;let u=A(i,this.currencySymbol,e);return c`<button
          type="button"
          class="cost-suggestion"
          @click=${()=>this._cost=String(Math.round(i*100)/100)}
        >${n("cost_from_parts",e).replace("{amount}",u)}</button>${a}`}let t=this._partsValue();if(t==null||t<=0)return f;let r=A(t,this.currencySymbol,e),s=this.partsCostMode==="use"?"cost_parts_booked":"cost_parts_info";return c`<div class="cost-note">${n(s,e).replace("{amount}",r)}</div>`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){this._completedAt=z(new Date)}render(){if(!this._open)return c``;let e=this.lang||this.hass?.language||"en",i=this._error||this._photos.errorText(e);return c`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${n("complete_title",e)}${this.taskName}</div>
        ${this.phaseLabel?c`<div class="phase-line">${n("phase_current",e)}: ${this.phaseLabel}</div>`:f}
        ${this.requireTagScan&&!this.viaTagScan?c`<div class="scan-required-note">${n("require_tag_scan_hint",e)}</div>`:f}
        <div class="content">
          ${i?c`<div class="error">${i}</div>`:f}
          ${this.checklist.length>0?c`
            <div class="checklist-section">
              <label class="checklist-label">${n("checklist",e)}</label>
              ${this.checklist.map((t,r)=>c`
                <label class="checklist-item" @click=${()=>this._toggleCheck(r)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(r)]} />
                  <span>${t}</span>
                </label>
              `)}
            </div>
          `:f}
          ${this.readings.length>0?c`<div class="readings-block">
                <span class="field-label">${n("readings_section",e)}</span>
                ${this.readings.map(t=>this._renderReadingField(t,e))}
              </div>`:this.taskType==="reading"?c`
              <label class="field">
                <span class="field-label">${n("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${t=>this._readingValue=t.target.value} />
              </label>`:f}
          ${this.parts.length?c`<div class="used-parts">
                <span class="field-label">${n("complete_parts_used",e)}</span>
                ${this.parts.map(t=>{let r=E({part_id:t.id,entry_id:t.entry_id}),s=this._usedParts[r],a=s!==void 0,u=t.entry_id?{part_id:t.id,quantity:1,entry_id:t.entry_id}:{part_id:t.id,quantity:1};return c`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${a}
                        @change=${m=>{let h={...this._usedParts};if(m.target.checked)h[r]=h[r]||u;else{delete h[r];let g={...this._usedQtyText};delete g[r],this._usedQtyText=g}this._usedParts=h}} />
                      <span
                        >${t.name}${t.owner_name?c`<span class="used-part-owner"> (${t.owner_name})</span>`:f}${t.stock!==null&&t.stock!==void 0?` (${R(t.stock,t.unit,e)})`:""}</span
                      >
                    </label>
                    ${a?c`<input class="used-part-qty" type="number" min=${$[0]} max=${$[1]} step="0.01"
                          .value=${this._usedQtyText[r]??String(s.quantity)}
                          @input=${m=>{let h=m.target.value;this._usedQtyText={...this._usedQtyText,[r]:h};let g=parseFloat(h.replace(",","."));Number.isFinite(g)&&g>=$[0]&&(this._usedParts={...this._usedParts,[r]:{...u,quantity:g}})}} />`:f}
                  </div>`})}
              </div>`:this.consumesInfo.length?c`<div class="consumes-hint">
                  ${this.consumesInfo.map(t=>c`<div>${t}</div>`)}
                </div>`:f}
          ${this.restockDefault!==null?c`
              <label class="field">
                <span class="field-label">${n("restock_quantity_label",e)}${this.restockPackage?` (\xD7 ${this.restockPackage})`:""}</span>
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
            <span class="field-label">${this._demands("notes")?n("notes_label",e):n("notes_optional",e)}${this._req("notes")}</span>
            <!-- Several lines (#202): what was done, one line each. The
                 history and the printouts keep the line breaks; they show
                 notes as plain text, so no Markdown hint here. -->
            <textarea class="field-input notes-input" rows="3"
              .value=${this._notes}
              @input=${t=>this._notes=t.target.value}></textarea>
          </label>
          <div class="field">
            <span class="field-label">${this._demands("cost")?n("cost",e):n("cost_optional",e)}${this._req("cost")}</span>
            <ms-cost-input .lang=${e} .value=${this._cost}
              @value-changed=${t=>this._cost=t.detail.value}></ms-cost-input>
            ${this._renderCostSuggestion(e)}
          </div>
          <label class="field">
            <span class="field-label">${this._demands("duration")?n("quick_complete_defaults_duration",e):n("duration_minutes",e)}${this._req("duration")}</span>
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
            <span class="field-label">${this._demands("photo")?n("completion_photos",e):n("completion_photos_optional",e)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?c`<div class="photo-strip">
                  ${this._photos.photos.map(t=>c`
                    <div class="photo-preview">
                      <img src=${t.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(t.id)}
                        title="${n("remove",e)}">✕</button>
                    </div>`)}
                </div>`:f}
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
          `:f}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${n("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._photos.uploading||this._missingRequired.length>0}
            title=${this._photos.uploading?n("uploading",e):this._missingRequired.length?this._missingRequired.map(t=>n("err_required",e).replace("{field}",n(V[t]??t,e))).join(" \xB7 "):""}
          >
            ${this._loading?n("completing",e):n("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};l.styles=[P,W,x`
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
  `],o([p({attribute:!1})],l.prototype,"hass",2),o([p()],l.prototype,"entryId",2),o([p()],l.prototype,"taskId",2),o([p()],l.prototype,"taskName",2),o([p()],l.prototype,"lang",2),o([p({type:Array})],l.prototype,"checklist",2),o([p({type:Boolean})],l.prototype,"adaptiveEnabled",2),o([p()],l.prototype,"taskType",2),o([p()],l.prototype,"readingUnit",2),o([p({attribute:!1})],l.prototype,"readings",2),o([p({attribute:!1})],l.prototype,"readingHistory",2),o([p({attribute:!1})],l.prototype,"restockDefault",2),o([p({attribute:!1})],l.prototype,"restockUnitCost",2),o([p({attribute:!1})],l.prototype,"restockPackage",2),o([p()],l.prototype,"currencySymbol",2),o([p({attribute:!1})],l.prototype,"partsCostMode",2),o([p({attribute:!1})],l.prototype,"parts",2),o([p({attribute:!1})],l.prototype,"consumesParts",2),o([p({type:Array})],l.prototype,"consumesInfo",2),o([p({type:Array})],l.prototype,"requiredFields",2),o([p()],l.prototype,"phaseLabel",2),o([p({type:Boolean})],l.prototype,"requireTagScan",2),o([p({type:Boolean})],l.prototype,"viaTagScan",2),o([_()],l.prototype,"_open",2),o([_()],l.prototype,"_notes",2),o([_()],l.prototype,"_cost",2),o([_()],l.prototype,"_duration",2),o([_()],l.prototype,"_loading",2),o([_()],l.prototype,"_error",2),o([_()],l.prototype,"_checklistState",2),o([_()],l.prototype,"_feedback",2),o([_()],l.prototype,"_readingValue",2),o([_()],l.prototype,"_readingValues",2),o([_()],l.prototype,"_restockQty",2),o([_()],l.prototype,"_completedAt",2),o([_()],l.prototype,"_usedParts",2),o([_()],l.prototype,"_usedQtyText",2),o([p({attribute:!1})],l.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",l);export{T as a,W as b,S as c,l as d};
