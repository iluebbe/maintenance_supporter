/*! maintenance_supporter frontend 2.95.0 */
import{a as Vt,b as Wt,c as Gt,d as Qt,e as Kt,f as Yt,g as Jt,h as Zt,i as Xt}from"./chunk-4JW6SHXP.js";import"./chunk-XL3B46LD.js";import{a as $t,b as nt,c as K,d as pe}from"./chunk-S7LOMKNL.js";import{c as de,d as ce,e as ut,f as _t,g as Ct,h as Q,i as rt,j as Z}from"./chunk-FXW2MH2V.js";import{a as k,b as l,c as it,d as h,e as w,f,g as c,h as ht,j as R,k as te,l as ee,m as E,n as st,o as yt,p as z,q as ie,r as se,s as bt,t as At,u as re,v as ne,w as ae,x as oe,y as le,z as C}from"./chunk-44FU3FPX.js";import{a as d,b as Ut,d as vt,g as s,h as zt,i as Bt}from"./chunk-3MSNNIFG.js";var A=class extends w{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1;this.multiline=!1;this.rows=3}_onInput(t){let i=t.target.value;this.value=i,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:i}}))}render(){return l`
      <label class="field">
        ${this.label?l`<span class="label">${this.label}${this.required?l`<span class="req">*</span>`:h}</span>`:h}
        ${this.multiline?l`
        <textarea
          .value=${this.value??""}
          rows=${this.rows}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          @input=${this._onInput}
          @change=${this._onInput}
        ></textarea>`:l`
        <input
          .value=${this.value??""}
          .type=${this.type}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          step=${this.step??h}
          min=${this.min??h}
          max=${this.max??h}
          pattern=${this.pattern??h}
          @input=${this._onInput}
          @change=${this._onInput}
        />`}
        ${this.helper?l`<span class="helper">${this.helper}</span>`:h}
      </label>
    `}};A.styles=k`
    :host { display: block; }
    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .label {
      font-size: 12px;
      color: var(--secondary-text-color, #888);
      font-weight: 500;
    }
    .req { color: var(--error-color, #f44336); margin-left: 2px; }
    input {
      padding: 8px 10px;
      font-size: 14px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
      border-radius: 6px;
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
      outline: none;
    }
    input:focus {
      border-color: var(--primary-color);
    }
    input:disabled { opacity: 0.5; cursor: not-allowed; }
    textarea {
      padding: 8px 10px;
      font-size: 14px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
      border-radius: 6px;
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
      outline: none;
      resize: vertical;
    }
    textarea:focus { border-color: var(--primary-color); }
    textarea:disabled { opacity: 0.5; cursor: not-allowed; }
    .helper {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
  `,d([f()],A.prototype,"label",2),d([f()],A.prototype,"value",2),d([f()],A.prototype,"placeholder",2),d([f()],A.prototype,"type",2),d([f({type:Boolean})],A.prototype,"required",2),d([f({type:Boolean})],A.prototype,"disabled",2),d([f()],A.prototype,"step",2),d([f()],A.prototype,"min",2),d([f()],A.prototype,"max",2),d([f()],A.prototype,"pattern",2),d([f()],A.prototype,"helper",2),d([f({type:Boolean})],A.prototype,"multiline",2),d([f({type:Number})],A.prototype,"rows",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",A);var I=class extends w{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._entryId=null}get _lang(){return R(this.hass)}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId="",this._error="",this._open=!0}openEdit(t,i){this._entryId=t,this._name=i.name||"",this._manufacturer=i.manufacturer||"",this._model=i.model||"",this._serialNumber=i.serial_number||"",this._areaId=i.area_id||"",this._installationDate=i.installation_date||"",this._warrantyExpiry=i.warranty_expiry||"",this._documentationUrl=i.documentation_url||"",this._notes=i.notes||"",this._haDeviceId=i.ha_device_id||"",this._parentEntryId=i.parent_entry_id||"",this._error="",this._open=!0}async _save(){if(this._loading||!this._name.trim())return;this._error="";let t={name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null};await C(this,this._entryId?{type:"maintenance_supporter/object/update",entry_id:this._entryId,...t}:{type:"maintenance_supporter/object/create",...t},{busy:e=>{this._loading=e},fallbackKey:"save_error",onError:e=>{this._error=e}})!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-saved")))}_parentChoices(){return(this.objects||[]).filter(t=>t.entry_id!==this._entryId)}_close(){this._open=!1}render(){if(!this._open)return l``;let t=this._lang,i=this._entryId?s("edit_object",t):s("new_object",t);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:h}
          <ms-textfield
            label="${s("name",t)}"
            required
            .value=${this._name}
            @input=${e=>this._name=e.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("manufacturer_optional",t)}"
            .value=${this._manufacturer}
            @input=${e=>this._manufacturer=e.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("model_optional",t)}"
            .value=${this._model}
            @input=${e=>this._model=e.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("serial_number_optional",t)}"
            .value=${this._serialNumber}
            @input=${e=>this._serialNumber=e.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("documentation_url_optional",t)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${e=>this._documentationUrl=e.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${s("area_id_optional",t)}"
            .value=${this._areaId}
            @value-changed=${e=>this._areaId=e.detail.value||""}
          ></ha-area-picker>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${t}
            label="${s("installation_date_optional",t)}"
            .value=${this._installationDate}
            @value-changed=${e=>this._installationDate=e.detail.value}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${t}
            label="${s("warranty_expiry_optional",t)}"
            .value=${this._warrantyExpiry}
            @value-changed=${e=>this._warrantyExpiry=e.detail.value}
          ></ms-date-field>
          <ha-form
            .hass=${this.hass}
            .data=${{device:this._haDeviceId||void 0}}
            .schema=${[{name:"device",selector:{device:{}}}]}
            .computeLabel=${()=>s("link_device_optional",t)}
            @value-changed=${e=>this._haDeviceId=e.detail.value?.device||""}
          ></ha-form>
          ${this._parentChoices().length?l`<label class="textarea-field">
                <span class="textarea-label">${s("parent_object_optional",t)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${e=>this._parentEntryId=e.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${s("parent_none",t)}
                  </option>
                  ${this._parentChoices().map(e=>l`<option
                      value=${e.entry_id}
                      ?selected=${this._parentEntryId===e.entry_id}
                    >${e.object.name}</option>`)}
                </select>
              </label>`:h}
          <label class="textarea-field">
            <span class="textarea-label">${s("object_notes_optional",t)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${e=>this._notes=e.target.value}
            ></textarea>
            <span class="md-hint">${s("notes_markdown_hint",t)}</span>
          </label>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",this._lang)}
          </ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?s("saving",this._lang):s("save",this._lang)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};I.styles=k`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
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
    ms-textfield {
      display: block;
    }
    .textarea-field {
      display: flex; flex-direction: column; gap: 4px;
    }
    .textarea-label {
      font-size: 12px; color: var(--secondary-text-color, #888); font-weight: 500;
    }
    .textarea-field textarea {
      padding: 8px 10px; font-size: 14px; font-family: inherit;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color); border-radius: 6px;
      resize: vertical;
    }
    .textarea-field textarea:focus {
      outline: none; border-color: var(--primary-color);
    }
    .md-hint {
      font-size: 11px; color: var(--secondary-text-color); font-style: italic;
    }
    .parent-select {
      padding: 8px 10px; font-size: 14px; font-family: inherit;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color); border-radius: 6px;
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
  `,d([f({attribute:!1})],I.prototype,"hass",2),d([f({attribute:!1})],I.prototype,"objects",2),d([c()],I.prototype,"_open",2),d([c()],I.prototype,"_loading",2),d([c()],I.prototype,"_error",2),d([c()],I.prototype,"_name",2),d([c()],I.prototype,"_manufacturer",2),d([c()],I.prototype,"_model",2),d([c()],I.prototype,"_serialNumber",2),d([c()],I.prototype,"_areaId",2),d([c()],I.prototype,"_installationDate",2),d([c()],I.prototype,"_warrantyExpiry",2),d([c()],I.prototype,"_documentationUrl",2),d([c()],I.prototype,"_notes",2),d([c()],I.prototype,"_haDeviceId",2),d([c()],I.prototype,"_parentEntryId",2),d([c()],I.prototype,"_entryId",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",I);var he=["#c62828","#ad1457","#6a1b9a","#4527a0","#283593","#1565c0","#00838f","#2e7d32","#558b2f","#ef6c00","#6d4c41","#546e7a"];function di(n){let a=(n||"").split(/\s+/).filter(Boolean);return a.length===0?"?":a.length===1?a[0][0].toUpperCase():(a[0][0]+a[a.length-1][0]).toUpperCase()}function ci(n){let a=0;for(let t of n)a=a*31+t.charCodeAt(0)>>>0;return he[a%he.length]}function ue(n){return n?{id:n.id,name:n.name,initials:n.initials||di(n.name),color:n.color||ci(n.id)}:null}var xt=class{constructor(a){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=a}updateHass(a){this.hass=a}async getUsers(a=!1){let t=Date.now();if(!a&&this.usersCache&&t-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=i.users,this.cacheTimestamp=t,this.usersCache}catch(i){return console.error("Failed to fetch users:",i),this.usersCache||[]}}async assignUser(a,t,i){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:a,task_id:t,user_id:i})}async getTasksByUser(a){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:a})).tasks}getUserName(a){return!a||!this.usersCache?null:this.usersCache.find(i=>i.id===a)?.name||null}getPerson(a){return ue(this.getUser(a))}getUser(a){return!a||!this.usersCache?null:this.usersCache.find(t=>t.id===a)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(a){return a?a===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}};function j(n){return`${n.entry_id??""}\0${n.part_id}`}function _e(n,a,t,i){let e=!!n.entry_id&&n.entry_id!==a,r=e?n.entry_id:a,o=t.find(g=>g.entry_id===r),p=(o?.parts||[]).find(g=>g.id===n.part_id)||null,u=e&&o?.object?.name||"",m=p?.name||s("shared_part_unknown",i);return{part:p,foreign:e,ownerName:u,label:u?`${m} (${u})`:m}}function me(n,a,t,i){let{part:e,label:r}=_e(n,a,t,i),o=e&&e.stock!==null&&e.stock!==void 0?` (${yt(e.stock,e.unit,i)})`:"",p=e?.storage_location?` \u2014 ${e.storage_location}`:"";return`${E(n.quantity,i)}\xD7 ${r}${o}${p}`}function ge(n,a,t,i){let r=(t.find(p=>p.entry_id===a)?.parts||[]).map(p=>({...p})),o=new Set(r.map(p=>j({part_id:p.id})));for(let p of n?.consumes_parts||[]){if(!p.entry_id||p.entry_id===a)continue;let u=j(p);if(o.has(u))continue;o.add(u);let{part:m,ownerName:g}=_e(p,a,t,i);r.push({id:p.part_id,name:m?.name||s("shared_part_unknown",i),unit:m?.unit,stock:m?.stock??null,storage_location:m?.storage_location,entry_id:p.entry_id,owner_name:g})}return r}var Rt=["sensor","binary_sensor","number","input_number","input_boolean","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock"],fe=["sensor"],ve=["temperature","humidity","pressure"];function at(n){let a=(n??"").trim();if(a==="")return null;let t=Number(a.replace(",","."));return!Number.isFinite(t)||t<0?null:Math.round(t)}var Pt=["notes","cost","duration","photo","user"],mt={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"};var pi={cleaning:"mdi:broom",inspection:"mdi:magnify",replacement:"mdi:swap-horizontal",calibration:"mdi:tune",service:"mdi:wrench",reading:"mdi:counter",custom:"mdi:wrench-clock"},hi="mdi:wrench-clock",Lt=n=>n&&pi[n]||hi;var _i=["cleaning","inspection","replacement","calibration","service","reading","custom"],mi=["low","normal","high"],gi=["time_based","weekdays","nth_weekday","day_of_month","calendar","sensor_based","one_time","manual"],kt=["weekdays","nth_weekday","day_of_month","calendar"],ye=["time_based","one_time",...kt],$e=["threshold","counter","state_change","runtime"],fi=[...$e,"compound"],B={alpha:"0.3",min:"7",max:"365"},X=Q;function be(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",carry:{}}}var vi=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states"]);function xe(n){return{type:n.type||"threshold",attribute:n.attribute||"",above:n.trigger_above?.toString()??"",below:n.trigger_below?.toString()??"",equals:n.trigger_equals?.toString()??"",notEquals:n.trigger_not_equals?.toString()??"",forMinutes:n.trigger_for_minutes?.toString()??"0",targetValue:n.trigger_target_value?.toString()??"",deltaMode:n.trigger_delta_mode||!1,fromState:n.trigger_from_state||"",toState:n.trigger_to_state||"",targetChanges:n.trigger_target_changes?.toString()??"",runtimeHours:n.trigger_runtime_hours?.toString()??"",onStates:(n.trigger_on_states||[]).join(", ")}}function ke(n,a){a.attribute&&(n.attribute=a.attribute);let t=parseInt(a.forMinutes,10);if(a.type==="threshold"){let i=parseFloat(a.above);isNaN(i)||(n.trigger_above=i);let e=parseFloat(a.below);isNaN(e)||(n.trigger_below=e);let r=parseFloat(a.equals);isNaN(r)||(n.trigger_equals=r);let o=parseFloat(a.notEquals);isNaN(o)||(n.trigger_not_equals=o),isNaN(t)||(n.trigger_for_minutes=t)}else if(a.type==="counter"){let i=parseFloat(a.targetValue);isNaN(i)||(n.trigger_target_value=i),n.trigger_delta_mode=a.deltaMode}else if(a.type==="state_change"){a.fromState&&(n.trigger_from_state=a.fromState),a.toState&&(n.trigger_to_state=a.toState);let i=parseInt(a.targetChanges,10);isNaN(i)||(n.trigger_target_changes=i),isNaN(t)||(n.trigger_for_minutes=t)}else if(a.type==="runtime"){let i=parseFloat(a.runtimeHours);isNaN(i)||(n.trigger_runtime_hours=i);let e=(a.onStates||"").split(",").map(r=>r.trim()).filter(Boolean);e.length>0&&(n.trigger_on_states=e)}}function yi(n){return{entityIds:(n.entity_ids||(n.entity_id?[n.entity_id]:[])).join(", "),...xe(n),carry:Object.fromEntries(Object.entries(n).filter(([t])=>!vi.has(t)&&!t.startsWith("_")))}}function bi(n){let a=n.entityIds.split(",").map(i=>i.trim()).filter(Boolean);if(a.length===0)return null;let t={...n.carry||{},entity_id:a[0],entity_ids:a,type:n.type};return ke(t,n),t}function $i(n){return Array.from({length:7},(a,t)=>At(t,n,"short"))}function xi(n){return Array.from({length:12},(a,t)=>re(t,n,"short"))}var _=class _ extends w{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.adaptiveFeature=!1;this.seasonalFeature=!1;this.environmentalFeature=!1;this.defaultWarningDays=7;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._warning="";this._entryId="";this._taskId=null;this._isFleetTask=!1;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._calendarEntity="";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._notifyIcon="";this._priority="normal";this._labels="";this._mirrorTodoEntities=[];this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._notifyEnabled=!0;this._readingUnit="";this._readings=[];this._consumesParts={};this._consumesQtyText={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._loadedLastPerformed="";this._loadedResponsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._scheduleTimeOn=!1;this._actionService="";this._actionTargetEntity="";this._actionTargetStored=null;this._actionTargetInitial="";this._actionSkipAuto=!1;this._actionPresent=!1;this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=B.alpha;this._adaptiveMin=B.min;this._adaptiveMax=B.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._adaptiveWasEnabled=!1;this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return R(this.hass)}async openCreate(t,i){this._entryId=t,this._taskId=null,this._isFleetTask=!1,this._error="",this._warning="",!t&&i&&i.length>0?(this._objectChoices=i.map(e=>({entry_id:e.entry_id,name:e.object.name})).sort((e,r)=>e.name.localeCompare(r.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(t,i){this._entryId=t,this._taskId=i.id,this._error="",this._warning="",this._objectChoices=[],this._isFleetTask=i.battery_fleet_task===!0,this._name=i.name,this._type=i.type,this._scheduleType=i.schedule_type,this._intervalDays=i.interval_days!=null?String(i.interval_days):"",this._intervalUnit=i.interval_unit||"days",this._dueDate=i.due_date||"";let e=i.schedule;this._weekdays=e?.kind==="weekdays"?[...e.weekdays??[]]:[],this._nth=e?.kind==="nth_weekday"?String(e.nth??1):"1",this._nthWeekday=e?.kind==="nth_weekday"?String(e.weekday??5):"5",this._domDay=e?.kind==="day_of_month"&&(e.day??1)>=1?String(e.day??1):"1",this._domLastDay=e?.kind==="day_of_month"&&e.day===-1,this._domBusiness=e?.kind==="day_of_month"&&e.business===!0,this._calendarEntity=e?.kind==="calendar"&&e.entity_id||"",this._calOffset=e?.offset?String(e.offset):"0",this._seasonMonths=Array.isArray(e?.season_months)?[...e.season_months]:[];let r=e?.ends;r&&typeof r.count=="number"?(this._endsMode="count",this._endsCount=String(r.count),this._endsUntil=""):r&&typeof r.until=="string"?(this._endsMode="until",this._endsUntil=r.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=i.warning_days.toString(),this._earliestCompletionDays=i.earliest_completion_days!=null?String(i.earliest_completion_days):"",this._intervalAnchor=i.interval_anchor||"completion",this._notes=i.notes||"",this._documentationUrl=i.documentation_url||"",this._customIcon=i.custom_icon||"",this._notifyIcon=i.notify_icon||"",this._priority=i.priority||"normal",this._labels=(i.labels||[]).join(", "),this._mirrorTodoEntities=[...i.mirror_todo_entities||[]],this._enabled=i.enabled!==!1,this._lastPerformed=i.last_performed||"",this._loadedLastPerformed=this._lastPerformed,this._nfcTagId=i.nfc_tag_id||"",this._requireTagScan=!!i.require_tag_scan,this._allowSkip=i.allow_skip!==!1,this._notifyEnabled=i.notify_enabled!==!1,this._readingUnit=i.reading_unit||"",this._readings=(i.readings||[]).map(m=>({...m})),this._consumesParts=Object.fromEntries((i.consumes_parts||[]).map(m=>[j(m),{...m}])),this._consumesQtyText={},this._responsibleUserId=i.responsible_user_id||null,this._loadedResponsibleUserId=this._responsibleUserId,this._assigneePool=[...i.assignee_pool||[]],this._rotationStrategy=i.rotation_strategy||"",this._checklistText=(i.checklist||[]).join(`
`),this._phaseDefs=Object.entries(i.phases||{}).map(([m,g])=>{let{name:v,checklist:x,consumes_parts:b,required_completion_fields:S,...N}=g,G=g.consumes_parts||[],J=G.findIndex(U=>!U.entry_id),F=J>=0?G[J]:void 0;return{id:m,name:g.name||m,checklistText:(g.checklist||[]).join(`
`),partId:F?.part_id||"",partQty:F?.quantity!=null?String(F.quantity):"",reqOverride:g.required_completion_fields!==void 0,reqFields:[...g.required_completion_fields||[]],extraParts:G.filter((U,et)=>et!==J).map(U=>({...U})),carry:N}}),this._phaseSeq=[...i.phase_sequence||[]],this._requiredCompletion=[...i.required_completion_fields||[]],this._scheduleTime=i.schedule_time||"",this._scheduleTimeOn=!!i.schedule_time;let o=i.on_complete_action;if(o&&o.service){this._actionService=o.service;let m=o.target?.entity_id;this._actionTargetEntity=Array.isArray(m)?m[0]||"":m||"",this._actionTargetStored=o.target&&typeof o.target=="object"?JSON.parse(JSON.stringify(o.target)):null,this._actionTargetInitial=this._actionTargetEntity,this._actionData=o.data&&typeof o.data=="object"?{...o.data}:{},this._actionDataJsonFallback="",this._actionSkipAuto=o.skip_auto===!0,this._actionPresent=!0}else this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1;let p=i.quick_complete_defaults;this._qcNotes=p?.notes||"",this._qcCost=p?.cost!=null?String(p.cost):"",this._qcDuration=p?.duration!=null?String(p.duration):"",this._qcFeedback=p?.feedback||"";let u=i.adaptive_config||{};if(this._environmentalEntity=u.environmental_entity||"",this._environmentalAttribute=u.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!u.enabled,this._adaptiveAlpha=u.ewa_alpha?.toString()??B.alpha,this._adaptiveMin=u.min_interval_days?.toString()??B.min,this._adaptiveMax=u.max_interval_days?.toString()??B.max,this._adaptiveSeasonal=u.seasonal_enabled!==!1,this._adaptivePrediction=u.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=this._adaptiveEnabled,i.trigger_config){let m=i.trigger_config;this._triggerEntityId=m.entity_id||m.entity_ids&&m.entity_ids[0]||"",this._triggerEntityIds=m.entity_ids||(m.entity_id?[m.entity_id]:[]),this._triggerEntityLogic=m.entity_logic||"any",this._setTypeFields(xe(m)),this._triggerCombinator=m.trigger_combinator==="all"?"all":"any",this._triggerBaselineValue=m.trigger_baseline_value?.toString()||"",this._liveBaselineValue=i.trigger_baseline_value??null,this._autoCompleteOnRecovery=m.auto_complete_on_recovery||!1,this._triggerRuntimeMaxSession=m.trigger_runtime_max_session_seconds?.toString()||"",m.type==="compound"?(this._compoundLogic=m.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(m.conditions||[]).map(yi)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._notifyIcon="",this._priority="normal",this._labels="",this._mirrorTodoEntities=[],this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._readingUnit="",this._readings=[],this._consumesParts={},this._consumesQtyText={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._scheduleTimeOn=!1,this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=B.alpha,this._adaptiveMin=B.min,this._adaptiveMax=B.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=!1,this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1,this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_typeFields(){return{type:this._triggerType,attribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,equals:this._triggerEquals,notEquals:this._triggerNotEquals,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,onStates:this._triggerOnStates}}_setTypeFields(t){this._triggerType=t.type,this._triggerAttribute=t.attribute,this._triggerAbove=t.above,this._triggerBelow=t.below,this._triggerEquals=t.equals,this._triggerNotEquals=t.notEquals,this._triggerForMinutes=t.forMinutes,this._triggerTargetValue=t.targetValue,this._triggerDeltaMode=t.deltaMode,this._triggerFromState=t.fromState,this._triggerToState=t.toState,this._triggerTargetChanges=t.targetChanges,this._triggerRuntimeHours=t.runtimeHours,this._triggerOnStates=t.onStates}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._setTypeFields(be()),this._triggerCombinator="any",this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._triggerRuntimeMaxSession="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new xt(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(t){console.error("Failed to load users:",t),this._availableUsers=[]}}_toggleAssignee(t){this._assigneePool=this._assigneePool.includes(t)?this._assigneePool.filter(i=>i!==t):[...this._assigneePool,t]}async _testAction(){let t=this._actionService.trim();if(!t||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(t)){this._actionTestResult="error",this._actionTestError="Invalid service format (expected 'domain.service')",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[i,e]=t.split(".");if(!this.hass?.services?.[i]?.[e]){this._actionTestResult="error",this._actionTestError=`Service "${t}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let r=this._actionTargetEntity.trim();if(r){let o=r.split(".")[0];if(o!==i&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(i)){this._actionTestResult="error",this._actionTestError=`Service "${t}" only works on ${i}.* entities; entity "${r}" is in ${o}.* \u2014 pick a service that matches the entity domain (e.g. ${o}.${e})`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[r]){this._actionTestResult="error",this._actionTestError=`Target entity "${r}" not found in Home Assistant \u2014 the entity may have been renamed or its integration removed.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let t=JSON.parse(this._actionDataJsonFallback);if(t&&typeof t=="object"&&!Array.isArray(t))return t}catch{}return{...this._actionData}}_serviceSchema(){let t=this._actionService.trim();if(!t||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(t))return null;let[i,e]=t.split("."),r=this.hass?.services?.[i]?.[e]?.fields;return!r||Object.keys(r).length===0?null:Object.entries(r).map(([o,p])=>({name:o,required:!!p.required,selector:p.selector||{text:{}}}))}_actionTargetExtended(){let t=this._actionTargetStored;return t?Object.entries(t).some(([i,e])=>i==="entity_id"?Array.isArray(e)&&e.length>1:Array.isArray(e)?e.length>0:!!e):!1}_actionTargetSummary(){let t=this._actionTargetStored||{},i=r=>(Array.isArray(r)?r:[r]).filter(o=>typeof o=="string"&&!!o),e=this.hass;return[...i(t.entity_id).map(r=>e.states?.[r]?.attributes?.friendly_name||r),...i(t.device_id).map(r=>e.devices?.[r]?.name_by_user||e.devices?.[r]?.name||r),...i(t.area_id).map(r=>e.areas?.[r]?.name||r),...i(t.floor_id).map(r=>e.floors?.[r]?.name||r),...i(t.label_id)].join(", ")}_renderCompletionActionsSection(t){if(!this.completionActionsEnabled&&!this._actionPresent)return h;let i=this._serviceSchema();return l`
      <details class="ca-section">
        <summary>${s("on_complete_action_title",t)}</summary>
        <p class="field-help">${s("on_complete_action_desc",t)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${e=>{this._actionService=e.detail.value||"";let r=this._serviceSchema();if(r){let o=new Set(r.map(p=>p.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([p])=>o.has(p)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>s("on_complete_action_target",t)}
          @value-changed=${e=>{let r=e.detail.value;this._actionTargetEntity=r.target_entity||""}}
        ></ha-form>
        ${this._actionTargetExtended()&&this._actionTargetEntity.trim()===this._actionTargetInitial?l`<p class="field-help ca-target-more">${s("on_complete_action_target_more",t).replace("{targets}",this._actionTargetSummary())}</p>`:h}
        <p class="field-help ca-domain-hint">
          ${s("on_complete_action_target_hint",t)}
        </p>
        <label class="ca-skip-auto">
          <input type="checkbox" .checked=${this._actionSkipAuto}
            @change=${e=>{this._actionSkipAuto=e.target.checked}} />
          <span>${s("on_complete_action_skip_auto",t)}</span>
        </label>
        ${i?l`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${i}
                .data=${this._actionData}
                @value-changed=${e=>{this._actionData={...e.detail.value}}}
              ></ha-form>
            `:l`
              <ms-textfield
                label="${s("on_complete_action_data",t)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${e=>{this._actionDataJsonFallback=e.target.value}}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting||!this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting?"\u2026":s("on_complete_action_test",t)}
          </button>
          ${this._actionTestResult==="ok"?l`<span class="ca-test-ok">${s("on_complete_action_test_success",t)}</span>`:h}
          ${this._actionTestResult==="error"?l`<div class="ca-test-error-block">
                <span class="ca-test-error">${s("on_complete_action_test_failed",t)}</span>
                ${this._actionTestError?l`<div class="ca-test-error-detail">${this._actionTestError}</div>`:h}
              </div>`:h}
        </div>
      </details>

      ${this.completionActionsEnabled?l`<details class="ca-section">
        <summary>${s("quick_complete_defaults_title",t)}</summary>
        <p class="field-help">${s("quick_complete_defaults_desc",t)}</p>
        <ms-textfield
          label="${s("quick_complete_defaults_notes",t)}"
          .value=${this._qcNotes}
          @input=${e=>{this._qcNotes=e.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${s("quick_complete_defaults_cost",t)}"
          type="number" min="0" step="0.01"
          .value=${this._qcCost}
          @input=${e=>{this._qcCost=e.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${s("quick_complete_defaults_duration",t)}"
          type="number" min="0" step="1"
          .value=${this._qcDuration}
          @input=${e=>{this._qcDuration=e.target.value}}
        ></ms-textfield>
        <select class="qc-feedback"
          .value=${this._qcFeedback}
          @change=${e=>{this._qcFeedback=e.target.value}}>
          <option value="">${s("quick_complete_defaults_feedback_none",t)}</option>
          <option value="needed">${s("quick_complete_defaults_feedback_needed",t)}</option>
          <option value="not_needed">${s("quick_complete_defaults_feedback_not_needed",t)}</option>
        </select>
      </details>`:h}
    `}async _loadParts(){if(this.parts=[],!!this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this.parts=t.parts||[],this._partsLoadFailed=!1}catch{this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){if(this._foreignOwners=[],!!this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._foreignOwners=(t.objects||[]).filter(i=>i.entry_id!==this._entryId&&(i.parts||[]).length>0).map(i=>({entry_id:i.entry_id,name:i.object?.name||i.entry_id,parts:i.parts||[]})).sort((i,e)=>i.name.localeCompare(e.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=t.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(t){!t||!this.hass||this._conditionAttrOptions[t]||this._conditionAttrPending.has(t)||(this._conditionAttrPending.add(t),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:t}).then(i=>{let e=i;this._conditionAttrOptions={...this._conditionAttrOptions,[t]:{suggested:e.suggested_attributes||[],available:e.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[t]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(t){if(!t||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:t});this._entityDomain=i.domain||"",this._suggestedAttributes=i.suggested_attributes||[],this._availableAttributes=i.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(t=>!!t.entry_id)}_renderConsumesRow(t,i){let e=j({part_id:t.id,entry_id:i}),r=this._consumesParts[e],o=i?{part_id:t.id,quantity:1,entry_id:i}:{part_id:t.id,quantity:1};return l`
      <div class="consumes-row">
        <label class="consumes-check">
          <input
            type="checkbox"
            .checked=${r!==void 0}
            @change=${p=>{let u={...this._consumesParts};if(p.target.checked)u[e]=u[e]||o;else{delete u[e];let m={...this._consumesQtyText};delete m[e],this._consumesQtyText=m}this._consumesParts=u}}
          />
          <span>${t.name}${t.unit?` (${t.unit})`:""}</span>
        </label>
        ${r!==void 0?l`<input
              class="consumes-qty"
              type="number"
              min=${X[0]}
              max=${X[1]}
              step="0.01"
              .value=${this._consumesQtyText[e]??String(r.quantity)}
              @input=${p=>{let u=p.target.value;this._consumesQtyText={...this._consumesQtyText,[e]:u};let m=parseFloat(u.replace(",","."));Number.isFinite(m)&&m>=X[0]&&(this._consumesParts={...this._consumesParts,[e]:{...o,quantity:m}})}}
            />`:h}
      </div>
    `}_applyConsumesQtyText(){let t={...this._consumesParts};for(let i of Object.keys(t)){let e=this._consumesQtyText[i];if(e===void 0)continue;let r=parseFloat(e.replace(",","."));if(!Number.isFinite(r)||r<X[0]||r>X[1]){let o=p=>E(p,this._lang,{maximumFractionDigits:2});return this._error=s("settings_value_out_of_range",this._lang).replace("{min}",o(X[0])).replace("{max}",o(X[1])),!1}t[i]={...t[i],quantity:r}}return this._consumesParts=t,!0}_toggleRequired(t,i){let e=new Set(this._requiredCompletion);i?e.add(t):e.delete(t),this._requiredCompletion=[...e]}_patchReading(t,i){this._readings=this._readings.map(e=>e.id===t?{...e,...i}:e)}_renderReadingsEditor(t){let i=Jt(this._readings);return l`
      <div class="readings-editor">
        <div class="field-label">${s("readings_section",t)}</div>
        <div class="field-help">${s("readings_hint",t)}</div>
        ${this._readings.map(e=>l`
          ${i.has(e.id)?l`<div class="field-help reading-dup">${s("reading_duplicate_name",t)}</div>`:h}
          <div class="reading-row">
            <ms-textfield
              class="reading-name"
              label="${s("reading_name_label",t)}"
              .value=${e.name}
              @input=${r=>this._patchReading(e.id,{name:r.target.value})}
            ></ms-textfield>
            <ms-textfield
              class="reading-unit"
              label="${s("reading_unit_short",t)}"
              .value=${e.unit||""}
              @input=${r=>this._patchReading(e.id,{unit:r.target.value})}
            ></ms-textfield>
            <mwc-icon-button class="phase-remove reading-remove" @click=${()=>this._readings=this._readings.filter(r=>r.id!==e.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </mwc-icon-button>
          </div>
        `)}
        ${this._readings.length<20?l`
          <ha-button appearance="plain" class="reading-add"
            @click=${()=>this._readings=[...this._readings,{id:Wt(),name:"",unit:this._readings.length?this._readings[this._readings.length-1].unit:this._readingUnit}]}>
            <ha-icon icon="mdi:plus"></ha-icon> ${s("reading_add",t)}
          </ha-button>`:h}
      </div>
    `}_phaseSlug(t){let i=t.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",e=i,r=2;for(;this._phaseDefs.some(o=>o.id===e);)e=`${i}-${r++}`;return e}_addPhaseDef(){let t=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:t,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(t){this._phaseDefs=this._phaseDefs.filter(i=>i.id!==t),this._phaseSeq=this._phaseSeq.filter(i=>i!==t)}_patchPhaseDef(t,i){this._phaseDefs=this._phaseDefs.map(e=>e.id===t?{...e,...i}:e)}_renderPhasesEditor(t){let i=e=>this._phaseDefs.find(r=>r.id===e)?.name||e;return l`
      <h3>${s("phases_section",t)}</h3>
      <div class="field-help">${s("phases_hint",t)}</div>
      ${this._phaseDefs.map(e=>l`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${s("phase_name",t)}"
              .value=${e.name}
              @input=${r=>this._patchPhaseDef(e.id,{name:r.target.value})}
            ></ms-textfield>
            ${this.parts.length?l`
              <select
                class="phase-part"
                .value=${e.partId}
                @change=${r=>{let o=r.target.value;this._patchPhaseDef(e.id,e.partQty?{partId:o}:{partId:o,partQty:"1"})}}
              >
                <option value="">—</option>
                ${this.parts.map(r=>l`<option value=${r.id} ?selected=${r.id===e.partId}>${r.name}</option>`)}
              </select>
              ${e.partId?l`
                <!-- The typed text as-is: a "|| '1'" here rewrote a cleared
                     field to 1 and the next digit gave "13" (bug audit
                     2026-09-26 #2); an empty field saves as 1. -->
                <input class="phase-qty" type="number" min=${Q[0]} step="0.01" placeholder="1" .value=${e.partQty}
                  @input=${r=>this._patchPhaseDef(e.id,{partQty:r.target.value})} />
              `:h}
            `:h}
            <mwc-icon-button class="phase-remove" @click=${()=>this._removePhaseDef(e.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </mwc-icon-button>
          </div>
          ${this.checklistsEnabled?l`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${s("checklist_placeholder",t)}"
              .value=${e.checklistText}
              @input=${r=>this._patchPhaseDef(e.id,{checklistText:r.target.value})}
            ></textarea>
          `:h}
          <label class="req-option phase-req-toggle">
            <input
              type="checkbox"
              .checked=${e.reqOverride}
              @change=${r=>this._patchPhaseDef(e.id,{reqOverride:r.target.checked})}
            />
            <span>${s("phase_require_override",t)}</span>
          </label>
          ${e.reqOverride?l`
            <div class="required-completion phase-req-fields">
              ${Pt.map(r=>l`
                <label class="req-option">
                  <input
                    type="checkbox"
                    .checked=${e.reqFields.includes(r)}
                    @change=${o=>{let p=o.target.checked,u=new Set(e.reqFields);p?u.add(r):u.delete(r),this._patchPhaseDef(e.id,{reqFields:[...u]})}}
                  />
                  <span>${s(mt[r],t)}</span>
                </label>
              `)}
            </div>
          `:h}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${s("phase_add",t)}
      </ha-button>
      ${this._phaseDefs.some(e=>e.name.trim())?l`
        <div class="phase-seq-label">${s("phase_sequence_label",t)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((e,r)=>l`
            <span class="phase-chip">
              ${r+1}. ${i(e)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((o,p)=>p!==r)}}>✕</button>
            </span>
          `)}
          <select
            class="phase-seq-add"
            .value=${""}
            @change=${e=>{let r=e.target.value;r&&(this._phaseSeq=[...this._phaseSeq,r]),e.target.value=""}}
          >
            <option value="">+ ${s("phase_sequence_add_step",t)}</option>
            ${this._phaseDefs.filter(e=>e.name.trim()).map(e=>l`<option value=${e.id}>${e.name}</option>`)}
          </select>
        </div>
      `:h}
    `}async _save(){if(!this._loading&&this._name.trim()){if(this._adaptiveSnapshot()!==this._adaptiveInitial){let t=parseInt(this._adaptiveMin,10),i=parseInt(this._adaptiveMax,10);if(!isNaN(t)&&!isNaN(i)&&t>i){this._error=`${s("adaptive_min_interval",this._lang)} > ${s("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=s("trigger_hint_overlap",this._lang);return}if(this._scheduleType==="calendar"&&!this._calendarEntity.trim().startsWith("calendar.")){this._error=s("calendar_entity_required",this._lang);return}if(this._applyConsumesQtyText()){this._loading=!0,this._error="";try{let t=await C(this,()=>this.hass.connection.sendMessagePromise(this._savePayload()),{fallbackKey:"save_error",onError:o=>{this._error=o}});if(t===void 0)return;let i=this._taskId||t?.task_id,e=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;this._warning="";let r=o=>{this._warning=s("subsave_warning",this._lang).replace("{detail}",o)};if(i&&this._scheduleType==="sensor_based"&&e&&await C(this,{type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:i,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null},{onError:r})!==void 0&&(this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute),i&&this._adaptiveSnapshot()!==this._adaptiveInitial){let o=parseFloat(this._adaptiveAlpha),p=parseInt(this._adaptiveMin,10),u=parseInt(this._adaptiveMax,10);await C(this,{type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:i,enabled:this._adaptiveEnabled,...o>=_t[0]&&o<=_t[1]?{ewa_alpha:o}:{},...!isNaN(p)&&p>=1?{min_interval_days:p}:{},...!isNaN(u)&&u>=1?{max_interval_days:u}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction},{onError:r})!==void 0&&(this._adaptiveInitial=this._adaptiveSnapshot())}this._warning?i&&(this._taskId=i):this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}finally{this._loading=!1}}}}_savePayload(){let t={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},i=this._earliestCompletionDays.trim();t.earliest_completion_days=i===""?null:Math.max(0,parseInt(i,10)||0),this._taskId&&(t.task_id=this._taskId),this._scheduleType==="one_time"?(t.due_date=this._dueDate||null,t.interval_days=null):kt.includes(this._scheduleType)?(t.schedule={...this._buildSchedule(),...this._recurrenceExtras()},t.interval_days=null,this._taskId&&(t.due_date=null)):(this._taskId&&(t.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(t.interval_days=parseInt(this._intervalDays,10),t.interval_unit=this._intervalUnit,t.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(t.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(t.interval_days=null,t.interval_anchor="completion")),t.notes=this._notes||null,t.documentation_url=this._documentationUrl||null,t.custom_icon=this._customIcon||null,t.notify_icon=this._notifyIcon.trim()||null,t.priority=this._priority,t.labels=this._labels.split(",").map(e=>e.trim()).filter(Boolean),t.mirror_todo_entities=this._mirrorTodoEntities.filter(Boolean),t.enabled=this._enabled,(!this._taskId||this._lastPerformed!==this._loadedLastPerformed)&&(t.last_performed=this._lastPerformed||null),t.nfc_tag_id=this._nfcTagId||null,t.require_tag_scan=this._requireTagScan,t.allow_skip=this._allowSkip,t.notify_enabled=this._notifyEnabled,t.reading_unit=this._readingUnit.trim()||null,t.readings=Zt(this._readings);{let e={};for(let o of this._phaseDefs){if(!o.name.trim())continue;let p={...o.carry,name:o.name.trim()},u=o.checklistText.split(`
`).map(g=>g.trim()).filter(Boolean);u.length&&(p.checklist=u);let m=[];if(o.partId){let g=parseFloat(o.partQty);m.push({part_id:o.partId,quantity:Number.isFinite(g)&&g>0?g:1})}for(let g of o.extraParts)m.push(g.entry_id?{part_id:g.part_id,quantity:g.quantity,entry_id:g.entry_id}:{part_id:g.part_id,quantity:g.quantity});m.length&&(p.consumes_parts=m),o.reqOverride&&(p.required_completion_fields=[...o.reqFields]),e[o.id]=p}let r=this._phaseSeq.filter(o=>o in e);t.phases=Object.keys(e).length&&r.length?e:null,t.phase_sequence=t.phases?r:null}if((this.parts.length||this._foreignOwners.length)&&(t.consumes_parts=Object.values(this._consumesParts).map(e=>e.entry_id?{part_id:e.part_id,quantity:e.quantity,entry_id:e.entry_id}:{part_id:e.part_id,quantity:e.quantity})),(!this._taskId||this._responsibleUserId!==this._loadedResponsibleUserId)&&(t.responsible_user_id=this._responsibleUserId),t.assignee_pool=this._assigneePool,t.required_completion_fields=this._requiredCompletion,t.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let e=this._compoundConditions.map(bi).filter(r=>r!==null);if(e.length>0){let r={type:"compound",compound_logic:this._compoundLogic,conditions:e};this._autoCompleteOnRecovery&&(r.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(r.trigger_combinator="all"),t.trigger_config=r}else this._taskId&&(t.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let e=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],r={entity_id:e[0],entity_ids:e,type:this._triggerType};if(ke(r,this._typeFields()),this._autoCompleteOnRecovery&&(r.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(r.trigger_combinator="all"),e.length>1&&(r.entity_logic=this._triggerEntityLogic),this._triggerType==="counter"&&this._triggerDeltaMode&&this._triggerBaselineValue){let o=parseFloat(this._triggerBaselineValue);!isNaN(o)&&o>=0&&(r.trigger_baseline_value=o)}else if(this._triggerType==="runtime"&&this._triggerRuntimeMaxSession){let o=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(o)&&o>0&&(r.trigger_runtime_max_session_seconds=o)}t.trigger_config=r}else this._taskId&&(t.trigger_config=null);if(this.scheduleTimeEnabled&&ye.includes(this._scheduleType)){let e=this._scheduleTimeOn?this._scheduleTime.trim():"";t.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(e)?e:null}if(this.checklistsEnabled){let e=this._checklistText.split(`
`).map(r=>r.trim()).filter(Boolean).slice(0,100);t.checklist=e.length?e:null}if(this.completionActionsEnabled||this._actionPresent){let e=this._actionService.trim();if(e&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){let r={service:e},o=this._actionTargetEntity.trim();this._actionTargetStored&&o===this._actionTargetInitial?r.target=JSON.parse(JSON.stringify(this._actionTargetStored)):o&&(r.target={entity_id:o});let p=this._buildActionData();Object.keys(p).length>0&&(r.data=p),this._actionSkipAuto&&(r.skip_auto=!0),t.on_complete_action=r}else t.on_complete_action=null}if(this.completionActionsEnabled){let e={};this._qcNotes.trim()&&(e.notes=this._qcNotes.trim());let r=parseFloat(this._qcCost);!isNaN(r)&&r>=0&&(e.cost=r);let o=at(this._qcDuration);o!==null&&(e.duration=o),this._qcFeedback&&(e.feedback=this._qcFeedback),t.quick_complete_defaults=Object.keys(e).length?e:null}return t}_close(){this._open=!1,this._warning="",this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return h;let t=this._lang,i=this._triggerType==="compound";return l`
      <h3>${s("trigger_configuration",t)}</h3>
      <div class="select-row">
        <label>${s("trigger_type",t)}</label>
        <select
          .value=${this._triggerType}
          @change=${e=>this._triggerType=e.target.value}
        >
          ${fi.map(e=>l`<option value=${e} ?selected=${e===this._triggerType}>${s(e,t)}</option>`)}
        </select>
      </div>
      ${i?this._renderCompoundEditor():l`
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${s("entity_id",t)} (${s("comma_separated",t)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${e=>{let o=e.target.value.split(",").map(p=>p.trim()).filter(Boolean);this._triggerEntityId=o[0]||"",this._triggerEntityIds=o,o[0]&&this._fetchEntityAttributes(o[0])}}
          ></ms-textfield>
        `:l`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:Rt}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>s("entity_id",t)}
          @value-changed=${e=>{let r=(e.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=r[0]||"",this._triggerEntityIds=r,r[0]?this._fetchEntityAttributes(r[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?l`
          <div class="select-row">
            <label>${s("entity_logic",t)}</label>
            <select
              .value=${this._triggerEntityLogic}
              @change=${e=>this._triggerEntityLogic=e.target.value}
            >
              <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${s("entity_logic_any",t)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${s("entity_logic_all",t)}</option>
            </select>
          </div>
        `:h}
        ${this._renderAttributeSelect({label:s("attribute_optional",t),value:this._triggerAttribute,suggested:this._suggestedAttributes,available:this._availableAttributes,onSelect:e=>this._triggerAttribute=e})}
        ${this._renderTriggerTypeFields()}
        ${this._renderTriggerLiveHint()}
      `}
      <label>
        <input
          type="checkbox"
          .checked=${this._autoCompleteOnRecovery}
          @change=${e=>this._autoCompleteOnRecovery=e.target.checked}
        />
        ${s("auto_complete_on_recovery",t)}
      </label>
      <div class="field-help">${s("auto_complete_on_recovery_help",t)}</div>
      <ms-textfield
        label="${s("safety_interval",t)}"
        type="number"
        .value=${this._intervalDays}
        @input=${e=>this._intervalDays=e.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():h}
      ${this._intervalDays?l`
            <div class="select-row">
              <label>${s("trigger_combinator",t)}</label>
              <select
                @change=${e=>this._triggerCombinator=e.target.value}
              >
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${s("trigger_combinator_any",t)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${s("trigger_combinator_all",t)}</option>
              </select>
            </div>
          `:h}
    `}_patchCondition(t,i){this._compoundConditions=this._compoundConditions.map((e,r)=>r===t?{...e,...i}:e)}_addCondition(){this._compoundConditions=[...this._compoundConditions,be()]}_removeCondition(t){this._compoundConditions=this._compoundConditions.filter((i,e)=>e!==t)}_renderCompoundEditor(){let t=this._lang;return l`
      <div class="select-row">
        <label>${s("compound_logic",t)}</label>
        <select
          .value=${this._compoundLogic}
          @change=${i=>this._compoundLogic=i.target.value}
        >
          <option value="AND" ?selected=${this._compoundLogic==="AND"}>${s("compound_logic_and",t)}</option>
          <option value="OR" ?selected=${this._compoundLogic==="OR"}>${s("compound_logic_or",t)}</option>
        </select>
      </div>
      <div class="field-help">${s("compound_help",t)}</div>
      ${this._compoundConditions.length===0?l`<div class="field-help">${s("compound_no_conditions",t)}</div>`:this._compoundConditions.map((i,e)=>this._renderCondition(i,e))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${s("compound_add_condition",t)}
      </button>
    `}_renderCondition(t,i){let e=this._lang,r=i+1;return l`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${s("compound_condition",e)} ${r}</span>
          <button
            type="button"
            class="icon-btn"
            title="${s("compound_remove_condition",e)}"
            @click=${()=>this._removeCondition(i)}
          >✕</button>
        </div>
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${s("entity_id",e)} (${s("comma_separated",e)})"
            .value=${t.entityIds}
            @input=${o=>this._patchCondition(i,{entityIds:o.target.value})}
          ></ms-textfield>
        `:l`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:Rt}}}]}
          .data=${{condition_entities:t.entityIds.split(",").map(o=>o.trim()).filter(Boolean)}}
          .computeLabel=${()=>s("entity_id",e)}
          @value-changed=${o=>{let p=(o.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(i,{entityIds:p.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(t,i)}
        <div class="select-row">
          <label>${s("trigger_type",e)}</label>
          <select
            .value=${t.type}
            @change=${o=>this._patchCondition(i,{type:o.target.value})}
          >
            ${$e.map(o=>l`<option value=${o} ?selected=${o===t.type}>${s(o,e)}</option>`)}
          </select>
        </div>
        ${this._renderConditionTypeFields(t,i)}
      </div>
    `}_renderStateField(t){return this._entityPickerFallback||!t.entityId?l`
        <ms-textfield
          label=${t.label}
          .value=${t.value}
          @input=${i=>t.onInput(i.target.value)}
        ></ms-textfield>
      `:l`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:t.entityId}}}]}
        .data=${{s:t.value}}
        .computeLabel=${()=>t.label}
        @value-changed=${i=>t.onInput((i.detail.value.s||"").trim())}
      ></ha-form>
    `}_renderOnStatesField(t){let i=this._lang;return this._entityPickerFallback||!t.entityId?l`
        <ms-textfield
          label="${s("runtime_on_states",i)}"
          placeholder="on"
          .value=${t.value}
          @input=${e=>t.onInput(e.target.value)}
        ></ms-textfield>
      `:l`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:t.entityId,multiple:!0}}}]}
        .data=${{s:(t.value||"").split(",").map(e=>e.trim()).filter(Boolean)}}
        .computeLabel=${()=>s("runtime_on_states",i)}
        @value-changed=${e=>t.onInput((e.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(t){return this._scheduleType==="one_time"||this._scheduleType==="manual"?h:!this.adaptiveFeature&&!this._adaptiveWasEnabled?h:l`
      <details class="adaptive-section" ?open=${this._adaptiveEnabled}>
        <summary>${s("adaptive_section_title",t)}</summary>
        <label>
          <input
            type="checkbox"
            .checked=${this._adaptiveEnabled}
            @change=${i=>this._adaptiveEnabled=i.target.checked}
          />
          ${s("adaptive_enabled",t)}
        </label>
        ${this._adaptiveEnabled?l`
          <ms-textfield
            label="${s("adaptive_min_interval",t)}"
            type="number"
            min="1"
            .value=${this._adaptiveMin}
            @input=${i=>this._adaptiveMin=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("adaptive_max_interval",t)}"
            type="number"
            min="1"
            .value=${this._adaptiveMax}
            @input=${i=>this._adaptiveMax=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("adaptive_ewa_alpha",t)}"
            type="number"
            min=${_t[0]}
            max=${_t[1]}
            step="0.1"
            .value=${this._adaptiveAlpha}
            @input=${i=>this._adaptiveAlpha=i.target.value}
          ></ms-textfield>
          ${this.seasonalFeature?l`<label>
            <input
              type="checkbox"
              .checked=${this._adaptiveSeasonal}
              @change=${i=>this._adaptiveSeasonal=i.target.checked}
            />
            ${s("adaptive_seasonal_enabled",t)}
          </label>`:h}
          <label>
            <input
              type="checkbox"
              .checked=${this._adaptivePrediction}
              @change=${i=>this._adaptivePrediction=i.target.checked}
            />
            ${s("adaptive_prediction_enabled",t)}
          </label>
        `:h}
      </details>
    `}_renderAttributeSelect(t){let i=this._lang;return t.available.length>0?l`
        <div class="select-row">
          <label>${t.label}</label>
          <select
            .value=${t.value}
            @change=${e=>t.onSelect(e.target.value)}
          >
            <option value="" ?selected=${!t.value}>${s("use_entity_state",i)}</option>
            ${t.suggested.map(e=>l`<option value=${e} ?selected=${e===t.value}>${e} ★</option>`)}
            ${t.available.filter(e=>!t.suggested.includes(e.name)).map(e=>l`<option value=${e.name} ?selected=${e.name===t.value}>${e.name}${e.numeric?"":" (non-numeric)"}</option>`)}
          </select>
        </div>
      `:l`
      <ms-textfield
        label="${t.label}"
        .value=${t.value}
        @input=${e=>t.onSelect(e.target.value.trim())}
      ></ms-textfield>
    `}_renderEnvironmentalAttribute(t){this._fetchConditionAttributes(this._environmentalEntity);let i=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:s("environmental_attribute_optional",t),value:this._environmentalAttribute,suggested:i?.suggested??[],available:i?.available??[],onSelect:e=>this._environmentalAttribute=e})}_renderConditionAttribute(t,i){let e=t.entityIds.split(",")[0]?.trim()||"";e&&this._fetchConditionAttributes(e);let r=e?this._conditionAttrOptions[e]:void 0;return this._renderAttributeSelect({label:s("attribute_optional",this._lang),value:t.attribute,suggested:r?.suggested??[],available:r?.available??[],onSelect:o=>this._patchCondition(i,{attribute:o})})}_renderConditionTypeFields(t,i){let e=this._lang;if(t.type==="threshold")return l`
        <ms-textfield label="${s("trigger_above",e)}" type="number" .value=${t.above}
          @input=${r=>this._patchCondition(i,{above:r.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_below",e)}" type="number" .value=${t.below}
          @input=${r=>this._patchCondition(i,{below:r.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_equals",e)}" type="number" .value=${t.equals}
          @input=${r=>this._patchCondition(i,{equals:r.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_not_equals",e)}" type="number" .value=${t.notEquals}
          @input=${r=>this._patchCondition(i,{notEquals:r.target.value})}></ms-textfield>
        <ms-textfield label="${s("for_minutes",e)}" type="number" .value=${t.forMinutes}
          @input=${r=>this._patchCondition(i,{forMinutes:r.target.value})}></ms-textfield>
      `;if(t.type==="counter")return l`
        <ms-textfield label="${s("target_value",e)}" type="number" .value=${t.targetValue}
          @input=${r=>this._patchCondition(i,{targetValue:r.target.value})}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${t.deltaMode}
            @change=${r=>this._patchCondition(i,{deltaMode:r.target.checked})} />
          ${s("delta_mode",e)}
        </label>
      `;if(t.type==="state_change"){let r=t.entityIds.split(",")[0]?.trim()||"";return l`
        ${this._renderStateField({label:s("from_state_optional",e),value:t.fromState,entityId:r,onInput:o=>this._patchCondition(i,{fromState:o})})}
        ${this._renderStateField({label:s("to_state_optional",e),value:t.toState,entityId:r,onInput:o=>this._patchCondition(i,{toState:o})})}
        <ms-textfield label="${s("target_changes",e)}" type="number" .value=${t.targetChanges}
          @input=${o=>this._patchCondition(i,{targetChanges:o.target.value})}></ms-textfield>
        <ms-textfield label="${s("for_minutes",e)}" type="number" .value=${t.forMinutes}
          @input=${o=>this._patchCondition(i,{forMinutes:o.target.value})}></ms-textfield>
      `}if(t.type==="runtime"){let r=t.entityIds.split(",")[0]?.trim()||"";return l`
        <ms-textfield label="${s("runtime_hours",e)}" type="number" .value=${t.runtimeHours}
          @input=${o=>this._patchCondition(i,{runtimeHours:o.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:t.onStates,entityId:r,onInput:o=>this._patchCondition(i,{onStates:o})})}
      `}return h}_renderUnitSelect(){let t=this._lang;return l`
      <div class="select-row">
        <label>${s("interval_unit",t)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${i=>this._intervalUnit=i.target.value}
        >
          ${["days","weeks","months","years"].map(i=>l`<option value=${i} ?selected=${i===this._intervalUnit}>${s("unit_"+i,t)}</option>`)}
        </select>
      </div>`}_toggleWeekday(t){this._weekdays=this._weekdays.includes(t)?this._weekdays.filter(i=>i!==t):[...this._weekdays,t]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(this._scheduleType==="calendar"&&!this._calendarEntity.trim())return null;if(kt.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let t=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!t||t<=0?null:{kind:"interval",every:t,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(t){super.updated?.(t),this._scheduleEntityPickerProbe();for(let i of t.keys())if(_._PREVIEW_RELEVANT.has(String(i))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let t=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),i=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!t||!i){this._pickerProbeStrikes=0;return}let e=(u,m,g=0)=>{if(!(!u||g>10)){(u.tagName?.toLowerCase()??"")==="ha-entity-picker"&&m.push(u);for(let v of[u.shadowRoot,u])if(v)for(let x of Array.from(v.children??[]))e(x,m,g+1)}},r=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],o=[];for(let u of r)e(u,o);let p=o.length===0||o.some(u=>u.offsetHeight===0);if(t.offsetHeight===0||p){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let t=this._open?this._previewScheduleDict():null;if(!t){this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let i=++this._previewSeq;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:t,...this._lastPerformed?{last_performed:this._lastPerformed}:{}});if(i!==this._previewSeq)return;this._schedulePreview=e.occurrences||[],this._schedulePreviewEnded=!!e.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return h;let t=this._lang,i=this.scheduleTimeEnabled&&this._scheduleTimeOn&&this._scheduleTime?` ${this._scheduleTime}`:"",e=this._schedulePreview.map((o,p)=>{let u=new Date(`${o}T12:00:00`).getDay();return`${At(u===0?6:u-1,t,"short")} ${z(o,t)}${p===0?i:""}`}).join(" \xB7 "),r=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?l`<div class="field-help">${s("schedule_preview_ontime",t)}</div>`:h;return l`
      <div class="trigger-live-hint schedule-preview">
        ${s("schedule_preview_title",t)}: ${e}${this._schedulePreviewEnded?l` <span class="field-help">${s("schedule_preview_ends",t)}</span>`:h}
        ${r}
      </div>
    `}_buildSchedule(){let t=e=>{let r=parseInt(this._calOffset,10)||0;return r&&(e.offset=Math.max(-ut,Math.min(r,ut))),e};if(this._scheduleType==="weekdays")return t({kind:"weekdays",weekdays:[...this._weekdays].sort((e,r)=>e-r)});if(this._scheduleType==="nth_weekday")return t({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});if(this._scheduleType==="calendar")return t({kind:"calendar",entity_id:this._calendarEntity.trim()});let i={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(i.business=!0),t(i)}_recurrenceExtras(){let t={};if(this._seasonMonths.length&&(t.season_months=[...this._seasonMonths].sort((i,e)=>i-e)),this._endsMode==="count"){let i=parseInt(this._endsCount,10);i>=1&&(t.ends={count:i})}else this._endsMode==="until"&&this._endsUntil&&(t.ends={until:this._endsUntil});return t}_toggleSeasonMonth(t){this._seasonMonths=this._seasonMonths.includes(t)?this._seasonMonths.filter(i=>i!==t):[...this._seasonMonths,t]}_renderRecurrenceExtras(){let t=this._lang;if(!(this._scheduleType==="time_based"||kt.includes(this._scheduleType)))return h;let e=xi(t);return l`
      <label class="field-label">${s("season_window_label",t)}</label>
      <div class="field-help">${s("season_window_hint",t)}</div>
      <div class="weekday-chips season-chips">
        ${e.map((r,o)=>l`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(o+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(o+1)}
          >${r}</button>`)}
      </div>

      <label class="field-label">${s("series_end_label",t)}</label>
      <div class="select-row">
        <select .value=${this._endsMode}
          @change=${r=>this._endsMode=r.target.value}>
          <option value="never" ?selected=${this._endsMode==="never"}>${s("series_end_never",t)}</option>
          <option value="count" ?selected=${this._endsMode==="count"}>${s("series_end_after_count",t)}</option>
          <option value="until" ?selected=${this._endsMode==="until"}>${s("series_end_until",t)}</option>
        </select>
      </div>
      ${this._endsMode==="count"?l`
        <ms-textfield
          label="${s("series_end_count_label",t)}"
          type="number" min="1"
          .value=${this._endsCount}
          @input=${r=>this._endsCount=r.target.value}
        ></ms-textfield>`:h}
      ${this._endsMode==="until"?l`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${t}
          label="${s("series_end_until_label",t)}"
          .value=${this._endsUntil}
          @value-changed=${r=>this._endsUntil=r.detail.value}
        ></ms-date-field>`:h}
    `}_renderCalendarFields(){let t=this._lang,i=$i(t);if(this._scheduleType==="weekdays")return l`
        <label class="field-label">${s("recurrence_on_days",t)}</label>
        <div class="weekday-chips">
          ${i.map((e,r)=>l`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(r)?"selected":""}"
              @click=${()=>this._toggleWeekday(r)}
            >${e}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let e=[["1",s("ord_1",t)],["2",s("ord_2",t)],["3",s("ord_3",t)],["4",s("ord_4",t)],["5",s("ord_5",t)],["-1",s("ord_last",t)]];return l`
        <div class="select-row">
          <label>${s("recurrence_occurrence",t)}</label>
          <select .value=${this._nth} @change=${r=>this._nth=r.target.value}>
            ${e.map(([r,o])=>l`<option value=${r} ?selected=${r===this._nth}>${o}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${s("recurrence_weekday",t)}</label>
          <select .value=${this._nthWeekday} @change=${r=>this._nthWeekday=r.target.value}>
            ${i.map((r,o)=>l`<option value=${String(o)} ?selected=${String(o)===this._nthWeekday}>${r}</option>`)}
          </select>
        </div>
        ${this._renderCalOffsetField()}`}return this._scheduleType==="calendar"?l`
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${s("calendar_entity_label",t)}"
            helper="${s("calendar_entity_hint",t)}"
            .value=${this._calendarEntity}
            @input=${e=>this._calendarEntity=e.target.value.trim()}
          ></ms-textfield>
        `:l`
          <ha-form
            class="entity-picker-form calendar-entity-form"
            .hass=${this.hass}
            .schema=${[{name:"calendar_entity",selector:{entity:{domain:"calendar"}}}]}
            .data=${{calendar_entity:this._calendarEntity}}
            .computeLabel=${()=>s("calendar_entity_label",t)}
            .computeHelper=${()=>s("calendar_entity_hint",t)}
            @value-changed=${e=>{this._calendarEntity=(e.detail.value.calendar_entity||"").trim()}}
          ></ha-form>`}
        ${this._renderCalOffsetField()}`:this._scheduleType==="day_of_month"?l`
        ${this._domLastDay?h:l`
          <ms-textfield
            label="${s("recurrence_day",t)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${e=>this._domDay=e.target.value}
          ></ms-textfield>`}
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domLastDay}
            @change=${e=>this._domLastDay=e.target.checked} />
          <span>${s("recurrence_last_day",t)}</span>
        </label>
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domBusiness}
            @change=${e=>this._domBusiness=e.target.checked} />
          <span>${s("recurrence_business_day",t)}</span>
        </label>
        ${this._renderCalOffsetField()}`:h}_renderCalOffsetField(){let t=this._lang;return l`
      <ms-textfield
        label="${s("recurrence_offset",t)}"
        helper="${s("recurrence_offset_help",t)}"
        type="number"
        min=${-ut}
        max=${ut}
        .value=${this._calOffset}
        @input=${i=>this._calOffset=i.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let t=parseFloat(this._triggerAbove),i=parseFloat(this._triggerBelow);return!isNaN(t)&&!isNaN(i)&&i>t}_renderTriggerLiveHint(){if(this._triggerType==="compound")return h;let t=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?l`<div class="trigger-live-hint warn">${s("trigger_hint_overlap",this._lang)}</div>`:h,i=this._triggerEntityId||this._triggerEntityIds[0];if(!i||!this.hass?.states)return t;let e=this.hass.states[i];if(!e)return t;let r=this._lang,o=e.attributes?.unit_of_measurement,p=typeof o=="string"&&o?` ${o}`:"",u=this._triggerAttribute?e.attributes?.[this._triggerAttribute]:e.state,m=typeof u=="number"?u:parseFloat(String(u)),g=u!=="unknown"&&u!=="unavailable"&&u!=null&&!isNaN(m),v=b=>E(b,r,{maximumFractionDigits:1}),x=[];if(this._triggerType==="threshold"){let b=parseFloat(this._triggerAbove),S=parseFloat(this._triggerBelow);if(isNaN(b)&&isNaN(S))return h;g&&x.push(s("trigger_hint_now",r).replace("{value}",v(m)+p)),isNaN(b)||x.push(s("trigger_hint_above",r).replace("{target}",v(b)+p)),isNaN(S)||x.push(s("trigger_hint_below",r).replace("{target}",v(S)+p))}else if(this._triggerType==="counter"){let b=parseFloat(this._triggerTargetValue);if(isNaN(b))return h;this._triggerDeltaMode?this._taskId?x.push(s("trigger_hint_counter_delta_edit",r).replace("{target}",v(b)+p)):g?x.push(s("trigger_hint_counter_delta",r).replace("{value}",v(m)+p).replace("{due}",v(m+b)+p).replace("{target}",v(b)+p)):x.push(s("trigger_hint_counter_delta_edit",r).replace("{target}",v(b)+p)):(g&&x.push(s("trigger_hint_now",r).replace("{value}",v(m)+p)),x.push(s("trigger_hint_counter_abs",r).replace("{target}",v(b)+p)))}else if(this._triggerType==="runtime"){let b=parseFloat(this._triggerRuntimeHours);if(isNaN(b))return h;x.push(s("trigger_hint_runtime",r).replace("{hours}",v(b))),x.push(s("trigger_hint_state_now",r).replace("{value}",String(e.state)))}else if(this._triggerType==="state_change"){let b=parseInt(this._triggerTargetChanges,10)||1,S=this._triggerToState.trim();x.push((S?s("trigger_hint_state_change_to",r).replace("{state}",S):s("trigger_hint_state_change",r)).replace("{count}",String(b))),x.push(s("trigger_hint_state_now",r).replace("{value}",String(e.state)))}return x.length?l`<div class="trigger-live-hint">${x.join(" ")}</div>${t}`:t}_renderTriggerTypeFields(){let t=this._lang;return this._triggerType==="threshold"?l`
        <ms-textfield
          label="${s("trigger_above",t)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${i=>this._triggerAbove=i.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("trigger_below",t)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${i=>this._triggerBelow=i.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("trigger_equals",t)}"
          type="number"
          step="any"
          .value=${this._triggerEquals}
          @input=${i=>this._triggerEquals=i.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("trigger_not_equals",t)}"
          type="number"
          step="any"
          .value=${this._triggerNotEquals}
          @input=${i=>this._triggerNotEquals=i.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("for_at_least_minutes",t)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${i=>this._triggerForMinutes=i.target.value}
        ></ms-textfield>
      `:this._triggerType==="counter"?l`
        <ms-textfield
          label="${s("target_value",t)}"
          type="number"
          step="any"
          .value=${this._triggerTargetValue}
          @input=${i=>this._triggerTargetValue=i.target.value}
        ></ms-textfield>
        <label>
          <input
            type="checkbox"
            .checked=${this._triggerDeltaMode}
            @change=${i=>this._triggerDeltaMode=i.target.checked}
          />
          ${s("delta_mode",t)}
        </label>
        ${this._triggerDeltaMode?l`
              <ms-textfield
                label="${s("baseline_start_value",t)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${i=>this._triggerBaselineValue=i.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?s("baseline_start_help_edit",t):s("baseline_start_help",t)}
                ${this._taskId&&this._liveBaselineValue!=null?l`<div class="baseline-effective">
                      ${s("baseline_current_effective",t).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:h}
              </div>
            `:h}
      `:this._triggerType==="state_change"?l`
        ${this._renderStateField({label:s("from_state_optional",t),value:this._triggerFromState,entityId:this._triggerEntityId,onInput:i=>this._triggerFromState=i})}
        <div class="field-help">${s("state_value_help",t)}</div>
        ${this._renderStateField({label:s("to_state_optional",t),value:this._triggerToState,entityId:this._triggerEntityId,onInput:i=>this._triggerToState=i})}
        <ms-textfield
          label="${s("target_changes",t)}"
          type="number"
          min=${ce[0]}
          .value=${this._triggerTargetChanges}
          @input=${i=>this._triggerTargetChanges=i.target.value}
        ></ms-textfield>
        <div class="field-help">${s("target_changes_help",t)}</div>
        ${(this._triggerTargetChanges||"1")==="1"&&(this._triggerFromState||this._triggerToState)?l`<div class="field-help">${s("state_latch_help",t)}</div>`:h}
        <ms-textfield
          label="${s("for_at_least_minutes",t)}"
          type="number"
          min=${de[0]}
          .value=${this._triggerForMinutes}
          @input=${i=>this._triggerForMinutes=i.target.value}
        ></ms-textfield>
        <div class="field-help">${s("for_minutes_state_help",t)}</div>
      `:this._triggerType==="runtime"?l`
        <ms-textfield
          label="${s("runtime_hours",t)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${i=>this._triggerRuntimeHours=i.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("runtime_max_session",t)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeMaxSession}
          @input=${i=>this._triggerRuntimeMaxSession=i.target.value}
        ></ms-textfield>
        <div class="field-help">${s("runtime_max_session_help",t)}</div>
        ${this._renderOnStatesField({value:this._triggerOnStates,entityId:this._triggerEntityId,onInput:i=>this._triggerOnStates=i})}
        <div class="field-help">${s("runtime_on_states_help",t)}</div>
      `:h}render(){if(!this._open)return l``;let t=this._lang,i=this._taskId?s("edit_task",t):s("new_task",t);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:h}
          ${this._warning?l`<div class="error warning">${this._warning}</div>`:h}
          ${this._taskId===null&&this._objectChoices.length>0?l`
            <div class="select-row">
              <label>${s("object",t)}</label>
              <select
                .value=${this._entryId}
                @change=${e=>{this._entryId=e.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}}
              >
                ${this._objectChoices.map(e=>l`<option value=${e.entry_id} ?selected=${e.entry_id===this._entryId}>${e.name}</option>`)}
              </select>
            </div>
          `:h}
          <ms-textfield
            label="${s("task_name",t)}"
            required
            .value=${this._name}
            @input=${e=>this._name=e.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${s("maintenance_type",t)}</label>
            <select
              .value=${this._type}
              @change=${e=>this._type=e.target.value}
            >
              ${_i.map(e=>l`<option value=${e} ?selected=${e===this._type}>${s(e,t)}</option>`)}
            </select>
          </div>
          ${this._type==="reading"?l`
                <ms-textfield
                  label="${s("reading_unit_label",t)}"
                  .value=${this._readingUnit}
                  @input=${e=>this._readingUnit=e.target.value}
                ></ms-textfield>
                <div class="field-help">${s("reading_unit_help",t)}</div>
                ${this._renderReadingsEditor(t)}
              `:h}
          ${this._partsLoadFailed?l`<div class="field-help parts-load-failed">${s("parts_load_failed",t)}</div>`:h}
          ${this._isFleetTask?l`<div class="field-help parts-fleet-hint">${s("task_parts_fleet_hint",t)}</div>`:this.parts.length||this._foreignOwners.length?l`
                <div class="field">
                  <label>${s("consumes_parts_label",t)}</label>
                  ${this.parts.map(e=>this._renderConsumesRow(e))}
                  ${this._foreignOwners.length?l`
                        <details class="shared-pools" ?open=${this._hasForeignPick}>
                          <summary>${s("shared_parts_other_objects",t)}</summary>
                          <div class="field-help">${s("shared_parts_help",t)}</div>
                          ${this._foreignOwners.map(e=>l`
                              <div class="shared-pool-owner">${e.name}</div>
                              ${e.parts.map(r=>this._renderConsumesRow(r,e.entry_id))}
                            `)}
                        </details>
                      `:h}
                </div>
              `:h}
          <div class="select-row">
            <label>${s("priority",t)}</label>
            <select
              .value=${this._priority}
              @change=${e=>this._priority=e.target.value}
            >
              ${mi.map(e=>l`<option value=${e} ?selected=${e===this._priority}>${s("priority_"+e,t)}</option>`)}
            </select>
          </div>
          <div class="field">
            <label>${s("labels",t)}</label>
            <input
              type="text"
              .value=${this._labels}
              placeholder="${s("labels_placeholder",t)}"
              @input=${e=>this._labels=e.target.value}
            />
            <div class="field-help">${s("labels_help",t)}</div>
          </div>
          <div class="field mirror-todo-field">
            ${this._entityPickerFallback?l`
              <ms-textfield
                label="${s("task_mirror_todo",t)}"
                placeholder="todo.family, todo.kids"
                .value=${this._mirrorTodoEntities.join(", ")}
                @input=${e=>{this._mirrorTodoEntities=e.target.value.split(",").map(r=>r.trim()).filter(Boolean)}}
              ></ms-textfield>
            `:l`
              <ha-form
                class="entity-picker-form"
                .hass=${this.hass}
                .schema=${[{name:"mirror_todo_entities",selector:{entity:{multiple:!0,domain:["todo"]}}}]}
                .data=${{mirror_todo_entities:this._mirrorTodoEntities}}
                .computeLabel=${()=>s("task_mirror_todo",t)}
                @value-changed=${e=>{let r=(e.detail.value.mirror_todo_entities||[]).filter(Boolean);this._mirrorTodoEntities=r}}
              ></ha-form>`}
            <div class="field-help">${s("task_mirror_todo_hint",t)}</div>
          </div>
          <div class="select-row">
            <label>${s("schedule_type",t)}</label>
            <select
              .value=${this._scheduleType}
              @change=${e=>this._scheduleType=e.target.value}
            >
              ${gi.map(e=>l`<option value=${e} ?selected=${e===this._scheduleType}>${s(e,t)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?l`
                <ms-textfield
                  label="${s("interval_value",t)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${e=>this._intervalDays=e.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  <label>${s("interval_anchor",t)}</label>
                  <select
                    .value=${this._intervalAnchor}
                    @change=${e=>this._intervalAnchor=e.target.value}
                  >
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${s("anchor_completion",t)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${s("anchor_planned",t)}</option>
                  </select>
                </div>
              `:h}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?l`
                <ms-date-field
                  kind="date"
                  .hass=${this.hass}
                  .lang=${t}
                  label="${s("due_date",t)}"
                  .value=${this._dueDate}
                  @value-changed=${e=>this._dueDate=e.detail.value}
                ></ms-date-field>
              `:h}
          ${this.scheduleTimeEnabled&&ye.includes(this._scheduleType)?l`
            <label class="checkbox-row schedule-time-toggle">
              <input type="checkbox" .checked=${this._scheduleTimeOn}
                @change=${e=>this._scheduleTimeOn=e.target.checked} />
              <span>${s("schedule_time_toggle",t)}</span>
            </label>
            ${this._scheduleTimeOn?l`
              <ms-date-field
                kind="time"
                .hass=${this.hass}
                .lang=${t}
                .value=${this._scheduleTime}
                helper="${s("schedule_time_help",t)}"
                @value-changed=${e=>this._scheduleTime=e.detail.value}
              ></ms-date-field>
            `:h}
          `:h}
          ${this._renderRecurrenceExtras()}
          ${this._renderSchedulePreview()}
          <ms-textfield
            label="${s("warning_days",t)}"
            type="number"
            min=${Ct[0]}
            max=${Ct[1]}
            .value=${this._warningDays}
            @input=${e=>this._warningDays=e.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("earliest_completion_days",t)}"
            helper="${s("earliest_completion_days_help",t)}"
            type="number"
            .value=${this._earliestCompletionDays}
            @input=${e=>this._earliestCompletionDays=e.target.value}
          ></ms-textfield>
          ${this.checklistsEnabled?l`
            <h3>${s("checklist_steps_optional",t)}</h3>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${s("checklist_placeholder",t)}"
              .value=${this._checklistText}
              @input=${e=>this._checklistText=e.target.value}
            ></textarea>
            <div class="field-help">${s("checklist_help",t)}</div>
          `:h}
          ${this._renderPhasesEditor(t)}
          <h3>${s("require_on_completion",t)}</h3>
          <div class="required-completion">
            ${Pt.map(e=>l`
              <label class="req-option">
                <input
                  type="checkbox"
                  .checked=${this._requiredCompletion.includes(e)}
                  @change=${r=>this._toggleRequired(e,r.target.checked)}
                />
                <span>${s(mt[e],t)}</span>
              </label>
            `)}
          </div>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${t}
            label="${s("last_performed_optional",t)}"
            .value=${this._lastPerformed}
            @value-changed=${e=>this._lastPerformed=e.detail.value}
          ></ms-date-field>
          <div class="select-row">
            <label>${s("responsible_user",t)}</label>
            <select
              .value=${this._responsibleUserId||""}
              @change=${e=>{let r=e.target.value;this._responsibleUserId=r||null}}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${s("no_user_assigned",t)}</option>
              ${this._availableUsers.map(e=>l`<option value=${e.id} ?selected=${e.id===this._responsibleUserId}>${e.name}</option>`)}
            </select>
          </div>
          ${this._availableUsers.length>=2?l`
            <div class="field">
              <label>${s("shared_with",t)}</label>
              <div class="field-help">${s("shared_with_help",t)}</div>
              <div class="assignee-pool">
                ${this._availableUsers.map(e=>l`
                  <label class="pool-item">
                    <input type="checkbox"
                      .checked=${this._assigneePool.includes(e.id)}
                      @change=${()=>this._toggleAssignee(e.id)} />
                    <span>${e.name}</span>
                  </label>`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?l`
              <div class="select-row">
                <label>${s("rotation_strategy",t)}</label>
                <select
                  .value=${this._rotationStrategy}
                  @change=${e=>this._rotationStrategy=e.target.value}
                >
                  <option value="" ?selected=${!this._rotationStrategy}>${s("rotation_none",t)}</option>
                  ${["round_robin","least_completed","random"].map(e=>l`<option value=${e} ?selected=${e===this._rotationStrategy}>${s("rotation_"+e,t)}</option>`)}
                </select>
              </div>`:h}
          `:h}
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"&&(this.environmentalFeature||this._environmentalInitial)?l`
            ${this._entityPickerFallback?l`
              <ms-textfield
                label="${s("environmental_entity_optional",t)}"
                helper="${s("environmental_entity_helper",t)}"
                .value=${this._environmentalEntity}
                @input=${e=>this._environmentalEntity=e.target.value.trim()}
              ></ms-textfield>
            `:l`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:fe,device_class:ve}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>s("environmental_entity_optional",t)}
              .computeHelper=${()=>s("environmental_entity_helper",t)}
              @value-changed=${e=>{this._environmentalEntity=(e.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(t):h}
          `:h}
          ${this._renderAdaptiveSection(t)}
          <ms-textfield
            label="${s("notes_optional",t)}"
            multiline
            .rows=${3}
            .helper=${s("notes_markdown_hint",t)}
            .value=${this._notes}
            @input=${e=>this._notes=e.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("documentation_url_optional",t)}"
            .value=${this._documentationUrl}
            @input=${e=>this._documentationUrl=e.target.value}
          ></ms-textfield>
          <ha-icon-picker
            .hass=${this.hass}
            label="${s("custom_icon_optional",t)}"
            .value=${this._customIcon}
            @value-changed=${e=>this._customIcon=e.detail.value||""}
          ></ha-icon-picker>
          <ha-icon-picker
            class="notify-icon-picker"
            .hass=${this.hass}
            label="${s("notify_icon",t)}"
            .value=${this._notifyIcon}
            @value-changed=${e=>this._notifyIcon=e.detail.value||""}
          ></ha-icon-picker>
          <div class="field-help notify-icon-help">
            <ha-icon icon=${this._notifyIcon.trim()||Lt(this._type)}></ha-icon>
            ${s("notify_icon_hint",t).replace("{default}",Lt(this._type))}
          </div>
          ${this._availableTags.length>0?l`
              <div class="select-row">
                <label>${s("nfc_tag_id_optional",t)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${e=>this._nfcTagId=e.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${s("no_nfc_tag",t)}</option>
                  ${this._availableTags.map(e=>l`<option value=${e.id} ?selected=${e.id===this._nfcTagId}>${e.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${s("nfc_tags_refresh",t)}">↻</button>
              </div>
            `:l`
              <ms-textfield
                label="${s("nfc_tag_id_optional",t)}"
                .value=${this._nfcTagId}
                @input=${e=>this._nfcTagId=e.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${s("nfc_tags_empty_help",t)}
                <a href="/config/tags">${s("nfc_tags_open_settings",t)}</a>
                ·
                <button type="button" class="link-button" @click=${this._loadTags}>
                  ${s("nfc_tags_refresh",t)}
                </button>
              </div>
            `}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${this._requireTagScan}
              @change=${e=>this._requireTagScan=e.target.checked}
            />
            <span>${s("require_tag_scan",t)}</span>
          </label>
          ${this._requireTagScan?l`<div class="field-help">${s("require_tag_scan_help",t)}</div>`:h}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._allowSkip}
              @change=${e=>this._allowSkip=!e.target.checked}
            />
            <span>${s("disallow_skip",t)}</span>
          </label>
          ${this._allowSkip?h:l`<div class="field-help">${s("disallow_skip_help",t)}</div>`}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._notifyEnabled}
              @change=${e=>this._notifyEnabled=!e.target.checked}
            />
            <span>${s("no_notifications",t)}</span>
          </label>
          ${this._notifyEnabled?h:l`<div class="field-help">${s("no_notifications_help",t)}</div>`}
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${e=>this._enabled=e.target.checked}
            />
            ${s("task_enabled",t)}
          </label>
          ${this._renderCompletionActionsSection(t)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${s("cancel",t)}</ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?s("saving",t):s("save",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};_._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_calendarEntity","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),_.styles=k`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    /* #129: entity/state pickers in the trigger form (ha-form + selector) */
    .entity-picker-form,
    .state-picker-form {
      display: block;
      margin: 8px 0;
    }
    /* v1.3.0: completion-action sections (.adaptive-section shares the shell
       but keeps its own class — tests count .ca-section elements) */
    .ca-section,
    .adaptive-section {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 8px 12px;
      margin-top: 8px;
    }
    .ca-section > summary,
    .adaptive-section > summary {
      cursor: pointer;
      font-weight: 500;
    }
    .adaptive-section ms-textfield {
      width: 100%;
      margin-top: 8px;
      display: block;
    }
    .adaptive-section label {
      display: block;
      margin-top: 8px;
    }
    .ca-section ms-textfield,
    .ca-section ha-entity-picker,
    .ca-section ha-service-picker,
    .ca-section ha-form,
    .ca-section .qc-feedback {
      width: 100%;
      margin-top: 8px;
      display: block;
    }
    .ca-section .qc-feedback {
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .ca-test-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
    }
    .ca-test-ok { color: var(--success-color, #4caf50); font-size: 13px; }
    .ca-test-error { color: var(--error-color, #f44336); font-size: 13px; font-weight: 500; }
    .ca-test-error-block { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
    .ca-test-error-detail {
      font-size: 12px;
      color: var(--secondary-text-color);
      background: rgba(244, 67, 54, 0.08);
      padding: 6px 8px; border-radius: 4px;
      line-height: 1.4;
      word-break: break-word;
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 350px;
      max-height: 70vh;
      overflow-y: auto;
    }
    @media (max-width: 600px) {
      .content {
        min-width: 0;
        max-height: none;
      }
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    ms-textfield {
      display: block;
    }
    .field-label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .checklist-textarea {
      width: 100%;
      min-height: 88px;
      padding: 8px;
      font-family: inherit;
      font-size: 14px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      resize: vertical;
      box-sizing: border-box;
    }
    .consumes-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 2px 0;
    }
    .phase-def {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 8px;
      margin: 6px 0;
    }
    .phase-def-head {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .phase-def-head ms-textfield {
      flex: 1;
      min-width: 0;
    }
    .phase-part {
      max-width: 160px;
      padding: 6px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .phase-qty {
      width: 64px;
      padding: 6px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .phase-checklist {
      min-height: 56px;
      margin-top: 6px;
    }
    .phase-req-toggle {
      margin-top: 6px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .phase-req-fields {
      margin: 2px 0 0 22px;
      font-size: 13px;
    }
    .phase-remove {
      --mdc-icon-button-size: 36px;
      color: var(--secondary-text-color);
    }
    /* #161 phase 2: reading slots — name wide, unit narrow, trash. */
    .readings-editor { margin-top: 14px; }
    .reading-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 4px 0;
    }
    .reading-row .reading-name { flex: 2; min-width: 0; }
    .reading-row .reading-unit { flex: 1; min-width: 0; max-width: 140px; }
    .reading-dup { color: var(--warning-color, #ff9800); margin-top: 6px; }
    .phase-seq-label {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 8px;
    }
    .phase-seq {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      padding: 4px 0;
    }
    .phase-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 12px;
      background: var(--secondary-background-color);
      font-size: 13px;
    }
    .phase-chip-x {
      border: none;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      padding: 0 2px;
      font-size: 12px;
    }
    .phase-seq-add {
      padding: 4px 8px;
      border: 1px dashed var(--divider-color);
      border-radius: 12px;
      background: transparent;
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .consumes-check {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1;
    }
    .consumes-qty {
      width: 64px;
      padding: 4px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    /* #111: other objects' pools sit behind a disclosure so the object's OWN
       parts stay the primary list; each group is headed by the owning object's
       name, so which pool a checkbox means is never a guess. */
    .shared-pools {
      margin-top: 6px;
    }
    .shared-pools > summary {
      cursor: pointer;
      padding: 2px 0;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .shared-pool-owner {
      margin-top: 6px;
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .field-help {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .baseline-effective {
      margin-top: 2px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    /* Live computed trigger hint — reads the bound sensor and explains what
       happens next. Info-accented so it reads as guidance, not an error. */
    .trigger-live-hint {
      font-size: 12px;
      color: var(--secondary-text-color);
      border-left: 3px solid var(--info-color, #2196f3);
      background: rgba(33, 150, 243, 0.08);
      border-radius: 0 6px 6px 0;
      padding: 6px 10px;
      margin: 4px 0;
    }
    .trigger-live-hint.warn {
      color: var(--primary-text-color);
      border-left-color: var(--warning-color, #ff9800);
      background: rgba(255, 152, 0, 0.1);
    }
    .field-help a,
    .link-button {
      background: none;
      border: 0;
      padding: 0;
      color: var(--primary-color);
      cursor: pointer;
      font: inherit;
      text-decoration: underline;
    }
    .field-help a:hover,
    .link-button:hover {
      text-decoration: none;
    }
    /* Smaller refresh icon-button when shown next to the dropdown. */
    .select-row .link-button {
      margin-left: 8px;
      text-decoration: none;
      font-size: 16px;
    }
    .select-row .link-button:hover {
      color: var(--primary-color);
      opacity: 0.7;
    }
    h3 {
      margin: 8px 0 0;
      font-size: 14px;
      color: var(--primary-color);
    }
    .select-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .assignee-pool {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 14px;
      margin-top: 4px;
    }
    .checkbox-row {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      cursor: pointer;
      margin: 2px 0;
    }
    .checkbox-row input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    .schedule-time-toggle {
      display: flex;
      margin: 8px 0 4px;
    }
    .pool-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      cursor: pointer;
    }
    .pool-item input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    .select-row label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .select-row select {
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
    }
    .field-label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .weekday-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .weekday-chip {
      padding: 6px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 16px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 13px;
      cursor: pointer;
    }
    .weekday-chip.selected {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
    .season-chip {
      padding: 6px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 16px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 13px;
      cursor: pointer;
    }
    .season-chip.selected {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
    .error.warning { color: var(--warning-color, #ff9800); }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .toggle-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      cursor: pointer;
    }
  `,d([f({attribute:!1})],_.prototype,"hass",2),d([f({type:Boolean,attribute:"checklists-enabled"})],_.prototype,"checklistsEnabled",2),d([f({type:Boolean,attribute:"schedule-time-enabled"})],_.prototype,"scheduleTimeEnabled",2),d([f({type:Boolean,attribute:"completion-actions-enabled"})],_.prototype,"completionActionsEnabled",2),d([f({type:Boolean,attribute:"adaptive-feature"})],_.prototype,"adaptiveFeature",2),d([f({type:Boolean,attribute:"seasonal-feature"})],_.prototype,"seasonalFeature",2),d([f({type:Boolean,attribute:"environmental-feature"})],_.prototype,"environmentalFeature",2),d([f({type:Number,attribute:"default-warning-days"})],_.prototype,"defaultWarningDays",2),d([c()],_.prototype,"parts",2),d([c()],_.prototype,"_foreignOwners",2),d([c()],_.prototype,"_open",2),d([c()],_.prototype,"_entityPickerFallback",2),d([c()],_.prototype,"_loading",2),d([c()],_.prototype,"_error",2),d([c()],_.prototype,"_warning",2),d([c()],_.prototype,"_entryId",2),d([c()],_.prototype,"_taskId",2),d([c()],_.prototype,"_isFleetTask",2),d([c()],_.prototype,"_objectChoices",2),d([c()],_.prototype,"_name",2),d([c()],_.prototype,"_type",2),d([c()],_.prototype,"_scheduleType",2),d([c()],_.prototype,"_intervalDays",2),d([c()],_.prototype,"_intervalUnit",2),d([c()],_.prototype,"_dueDate",2),d([c()],_.prototype,"_warningDays",2),d([c()],_.prototype,"_earliestCompletionDays",2),d([c()],_.prototype,"_intervalAnchor",2),d([c()],_.prototype,"_weekdays",2),d([c()],_.prototype,"_nth",2),d([c()],_.prototype,"_nthWeekday",2),d([c()],_.prototype,"_domDay",2),d([c()],_.prototype,"_domLastDay",2),d([c()],_.prototype,"_domBusiness",2),d([c()],_.prototype,"_calOffset",2),d([c()],_.prototype,"_calendarEntity",2),d([c()],_.prototype,"_seasonMonths",2),d([c()],_.prototype,"_endsMode",2),d([c()],_.prototype,"_endsCount",2),d([c()],_.prototype,"_endsUntil",2),d([c()],_.prototype,"_schedulePreview",2),d([c()],_.prototype,"_schedulePreviewEnded",2),d([c()],_.prototype,"_notes",2),d([c()],_.prototype,"_documentationUrl",2),d([c()],_.prototype,"_customIcon",2),d([c()],_.prototype,"_notifyIcon",2),d([c()],_.prototype,"_priority",2),d([c()],_.prototype,"_labels",2),d([c()],_.prototype,"_mirrorTodoEntities",2),d([c()],_.prototype,"_enabled",2),d([c()],_.prototype,"_triggerEntityId",2),d([c()],_.prototype,"_triggerEntityIds",2),d([c()],_.prototype,"_triggerEntityLogic",2),d([c()],_.prototype,"_triggerAttribute",2),d([c()],_.prototype,"_triggerType",2),d([c()],_.prototype,"_triggerAbove",2),d([c()],_.prototype,"_triggerBelow",2),d([c()],_.prototype,"_triggerEquals",2),d([c()],_.prototype,"_triggerNotEquals",2),d([c()],_.prototype,"_triggerForMinutes",2),d([c()],_.prototype,"_triggerCombinator",2),d([c()],_.prototype,"_triggerTargetValue",2),d([c()],_.prototype,"_triggerDeltaMode",2),d([c()],_.prototype,"_triggerBaselineValue",2),d([c()],_.prototype,"_liveBaselineValue",2),d([c()],_.prototype,"_autoCompleteOnRecovery",2),d([c()],_.prototype,"_triggerFromState",2),d([c()],_.prototype,"_triggerToState",2),d([c()],_.prototype,"_triggerTargetChanges",2),d([c()],_.prototype,"_triggerRuntimeHours",2),d([c()],_.prototype,"_triggerRuntimeMaxSession",2),d([c()],_.prototype,"_triggerOnStates",2),d([c()],_.prototype,"_compoundLogic",2),d([c()],_.prototype,"_compoundConditions",2),d([c()],_.prototype,"_suggestedAttributes",2),d([c()],_.prototype,"_availableAttributes",2),d([c()],_.prototype,"_entityDomain",2),d([c()],_.prototype,"_lastPerformed",2),d([c()],_.prototype,"_nfcTagId",2),d([c()],_.prototype,"_requireTagScan",2),d([c()],_.prototype,"_allowSkip",2),d([c()],_.prototype,"_notifyEnabled",2),d([c()],_.prototype,"_readingUnit",2),d([c()],_.prototype,"_readings",2),d([c()],_.prototype,"_consumesParts",2),d([c()],_.prototype,"_consumesQtyText",2),d([c()],_.prototype,"_partsLoadFailed",2),d([c()],_.prototype,"_availableTags",2),d([c()],_.prototype,"_responsibleUserId",2),d([c()],_.prototype,"_assigneePool",2),d([c()],_.prototype,"_rotationStrategy",2),d([c()],_.prototype,"_availableUsers",2),d([c()],_.prototype,"_checklistText",2),d([c()],_.prototype,"_phaseDefs",2),d([c()],_.prototype,"_phaseSeq",2),d([c()],_.prototype,"_requiredCompletion",2),d([c()],_.prototype,"_scheduleTime",2),d([c()],_.prototype,"_scheduleTimeOn",2),d([c()],_.prototype,"_actionService",2),d([c()],_.prototype,"_actionTargetEntity",2),d([c()],_.prototype,"_actionSkipAuto",2),d([c()],_.prototype,"_actionPresent",2),d([c()],_.prototype,"_actionData",2),d([c()],_.prototype,"_actionDataJsonFallback",2),d([c()],_.prototype,"_actionTesting",2),d([c()],_.prototype,"_actionTestResult",2),d([c()],_.prototype,"_actionTestError",2),d([c()],_.prototype,"_qcNotes",2),d([c()],_.prototype,"_qcCost",2),d([c()],_.prototype,"_qcDuration",2),d([c()],_.prototype,"_qcFeedback",2),d([c()],_.prototype,"_environmentalEntity",2),d([c()],_.prototype,"_environmentalAttribute",2),d([c()],_.prototype,"_adaptiveEnabled",2),d([c()],_.prototype,"_adaptiveAlpha",2),d([c()],_.prototype,"_adaptiveMin",2),d([c()],_.prototype,"_adaptiveMax",2),d([c()],_.prototype,"_adaptiveSeasonal",2),d([c()],_.prototype,"_adaptivePrediction",2),d([c()],_.prototype,"_conditionAttrOptions",2);var qt=_;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",qt);function Ht(n){let a=n.getFullYear(),t=String(n.getMonth()+1).padStart(2,"0"),i=String(n.getDate()).padStart(2,"0");return`${a}-${t}-${i}`}function we(n){let a=String(n.getHours()).padStart(2,"0"),t=String(n.getMinutes()).padStart(2,"0");return`${Ht(n)}T${a}:${t}:00`}async function ki(n,a,t){let i=n.auth;if(i?.expired&&i.refreshAccessToken)try{await i.refreshAccessToken()}catch{}return fetch(a,{...t,headers:{...t.headers??{},Authorization:`Bearer ${i?.data?.access_token??""}`}})}var Gs=500*1024*1024;async function wi(n,a,t,i="doc_too_large"){let e=await ki(n,a,{method:"POST",body:t});if(e.status===413)throw new Error(i);if(!e.ok)throw new Error("doc_upload_failed");return await e.json()}async function Ei(n,a,t,i){let e=new FormData;e.append("entry_id",a);for(let o of i)e.append("tags",o);e.append("file",t,t.name);let r=await wi(n,"/api/maintenance_supporter/document/upload",e);if(!r.id)throw new Error("doc_upload_failed");return{id:r.id,deduped:!!r.deduped,duplicate_in_object:r.duplicate_in_object??null}}async function Te(n,a,t){return(await Ei(n,a,t,["photo"])).id}async function Nt(n,a,t){await Promise.all(t.map(i=>n.connection.sendMessagePromise({type:"maintenance_supporter/documents/discard_upload",entry_id:a,doc_id:i}).catch(()=>{})))}var ot=class{constructor(a,t){this.host=a;this.opts=t;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this._session=0;this._uploadEntry=new Map;this.max=t.max??10,a.addController(this)}hostConnected(){}get ids(){return this.photos.map(a=>a.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(a){return this.errorKey?s(this.errorKey,a).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(a=[]){this._endSession(),this._revokeAll(),this.photos=a.map(t=>({id:t,preview:""})),this.uploadedIds=[],this._uploadEntry.clear(),this.errorKey="",this.host.requestUpdate()}async addFiles(a){if(a.length===0)return;let t=this._session,i=this.opts.hass(),e=this.opts.entryId(),r=a.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let o of r){let p=await Te(i,e,o);if(t!==this._session){Nt(i,e,[p]);return}this.uploadedIds=[...this.uploadedIds,p],this._uploadEntry.set(p,e),this.photos=[...this.photos,{id:p,preview:URL.createObjectURL(o)}],this.host.requestUpdate()}a.length>r.length&&(this.errorKey="photos_limit")}catch(o){if(t!==this._session)return;this.errorKey=o instanceof Error&&o.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{t===this._session&&(this.uploading=!1,this.host.requestUpdate())}}remove(a){let t=this.photos.find(i=>i.id===a);t?.preview&&URL.revokeObjectURL(t.preview),this.photos=this.photos.filter(i=>i.id!==a),this.uploadedIds.includes(a)&&(this.uploadedIds=this.uploadedIds.filter(i=>i!==a),this._discard([a])),this.host.requestUpdate()}discardOrphans(){if(this._endSession(),this.uploadedIds.length===0)return;let a=this.uploadedIds;this.uploadedIds=[],this._discard(a)}markAttached(){this._endSession(),this.uploadedIds=[],this._uploadEntry.clear()}_endSession(){this._session++,this.uploading=!1}_discard(a){let t=new Map;for(let e of a){let r=this._uploadEntry.get(e)??this.opts.entryId();this._uploadEntry.delete(e),t.set(r,[...t.get(r)??[],e])}let i=this.opts.hass();for(let[e,r]of t)Nt(i,e,r)}_revokeAll(){for(let a of this.photos)a.preview&&URL.revokeObjectURL(a.preview)}};function wt(){if(window.externalApp!==void 0)return!0;let a=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(a)&&/Android/.test(a)}var Ot={objectSections:"msp-object-sections",printOptions:"msp-print-options",batteryRosterOpen:"msp-bf-roster-open",docSort:"msp-doc-sort",cameraLabel:"msp-camera-label",overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort",areaSort:"msp-area-sort"};function Ie(n){try{return localStorage.getItem(n)}catch{return null}}function Se(n,a){try{localStorage.setItem(n,a)}catch{}}function qe(){if(!wt())return!1;let n=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!n&&typeof n.getUserMedia=="function"}var Ti=1920,Ii=.88,Si={retryMs:500,windowMs:5e3},Ai=new Set(["NotReadableError","AbortError","TrackStartError"]),Ae=80,He=/back|rear|environment|rück|hinten/i,Ce=/front|user|selfie|vorne/i;function Re(n){let a=/camera2?\s*(\d+)/i.exec(n);return a?Number(a[1]):Number.MAX_SAFE_INTEGER}function Pe(n,a){if(a){let i=n.find(e=>e.label===a);if(i)return i}return n.filter(i=>i.label&&He.test(i.label)).sort((i,e)=>Re(i.label)-Re(e.label))[0]??null}var Le=n=>n?.name||"Error",Ci=n=>n?.message||"",q=class extends w{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._switching=!1;this._devices=[];this._deviceIndex=-1;this._switchFailed=!1;this._copied=!1;this.timing={...Si};this._facing="environment";this._stream=null;this._opening=!1;this._gen=0;this._refused=new Set;this._log=[];this._t0=0;this._lastError=""}async open(){if(this._open||this._opening)return;this._opening=!0;let t=++this._gen;try{await this._acquireAndShow(t)}finally{this._opening=!1}}_live(t){return t===this._gen&&this.isConnected}async _acquireAndShow(t){let i=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!i||typeof i.getUserMedia!="function"){this._unavailable("no_media_devices");return}this._log=[],this._t0=Date.now(),this._lastError="",this._refused.clear(),this._switchFailed=!1,this._copied=!1,this._note(navigator.userAgent);let e=Ie(Ot.cameraLabel),r=await this._enumerate(i);if(!this._live(t))return;let o=Pe(r,e),p="refused";if(o&&(p=await this._openPatiently(i,t,this._byDevice(o))),p==="cancelled")return;if(p!=="ok"){if(p=await this._openPatiently(i,t,{video:{facingMode:{ideal:"environment"}},what:"facing environment"}),p==="cancelled")return;if(p!=="ok"){this._unavailable(this._lastError||"camera_unavailable");return}if(r=await this._enumerate(i),!this._live(t)){this._stopStream();return}}if(this._devices=r,this._deviceIndex=this._indexOfCurrent(),this._facing=this._currentFacing(),this._open=!0,await this.updateComplete,!this._live(t)){this._stopStream(),this._open=!1;return}await this._attach();let u=o?null:Pe(r,e),m=this._deviceIndex>=0?r[this._deviceIndex]:void 0;if(!u||u.deviceId===m?.deviceId)return;let g=await this._replace(i,t,[this._byDevice(u)],this._restoreCandidates(m));if(g!=="cancelled"){if(g==="lost"){this._unavailable("camera_lost");return}this._settle(g)}}async _openPatiently(t,i,e){let r=Date.now();for(;;){let o;try{o=await t.getUserMedia({video:e.video,audio:!1})}catch(p){let u=Le(p),m=Ci(p);if(this._lastError=u,this._note(`${e.what} \u2192 ${u}${m&&m!==u?`: ${m}`:""}`),!this._live(i))return"cancelled";if(!Ai.has(u))return"refused";if(Date.now()-r+this.timing.retryMs>this.timing.windowMs)return"busy";if(await new Promise(g=>setTimeout(g,this.timing.retryMs)),!this._live(i))return"cancelled";continue}if(!this._live(i)){for(let p of o.getTracks())p.stop();return"cancelled"}return this._stream=o,this._note(`${e.what} \u2192 ok (${this._describeTrack()})`),"ok"}}async _replace(t,i,e,r){this._switching=!0,this._stopStream();try{for(let o of e){let p=await this._openPatiently(t,i,o);if(p==="ok")return o;if(p==="cancelled")return p;if(p==="busy"){o.deviceId&&this._refused.add(o.deviceId);break}}for(let o of r){let p=await this._openPatiently(t,i,o);if(p==="ok")return"restored";if(p==="cancelled")return p}return"lost"}finally{this._switching=!1}}_settle(t){if(t==="restored"){this._switchFailed=!0;let e=this._indexOfCurrent();return e>=0&&(this._deviceIndex=e),this._attach(),!1}this._switchFailed=!1;let i=t.deviceId?this._devices.findIndex(e=>e.deviceId===t.deviceId):-1;return this._deviceIndex=i>=0?i:this._indexOfCurrent(),this._facing=this._currentFacing(),this._attach(),!0}_byDevice(t){return{video:{deviceId:{exact:t.deviceId}},what:t.label||"camera (no label)",deviceId:t.deviceId}}_restoreCandidates(t,i){let e=[],r=t?.deviceId||i;return r&&e.push({video:{deviceId:{exact:r}},what:`${t?.label||"previous camera"} (back again)`,deviceId:r}),e.push({video:{facingMode:{ideal:this._facing}},what:`facing ${this._facing} (back again)`}),e}async _attach(){let t=this._video;if(!(!t||!this._stream)){t.srcObject=this._stream;try{await t.play()}catch{}}}async _enumerate(t){if(typeof t.enumerateDevices!="function")return[];try{let i=(await t.enumerateDevices()).filter(e=>e.kind==="videoinput"&&!!e.deviceId);return this._note(`cameras: ${i.map(e=>e.label||"(no label)").join(" | ")||"none listed"}`),i}catch(i){return this._note(`enumerateDevices \u2192 ${Le(i)}`),[]}}_indexOfCurrent(){let t=this._stream?.getVideoTracks()[0];if(!t)return-1;let i=t.getSettings().deviceId,e=i?this._devices.findIndex(r=>r.deviceId===i):-1;return e>=0?e:t.label?this._devices.findIndex(r=>r.label===t.label):-1}_currentFacing(){let t=this._stream?.getVideoTracks()[0],i=t?.getSettings().facingMode;if(i==="user"||i==="environment")return i;let e=(this._deviceIndex>=0?this._devices[this._deviceIndex]?.label:"")||t?.label||"";return Ce.test(e)?"user":He.test(e)?"environment":this._facing}_describeTrack(){let t=this._stream?.getVideoTracks()[0];if(!t)return"no track";let i=t.getSettings(),e=i.width&&i.height?`${i.width}\xD7${i.height}`:"size ?";return[t.label||"no label",e,i.facingMode].filter(Boolean).join(", ")}_note(t){this._log.push(`+${Date.now()-this._t0} ms ${t}`),this._log.length>Ae&&this._log.splice(1,this._log.length-Ae)}async _switchCamera(){let t=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!t||this._devices.length<2||this._busy||this._switching)return;let i=this._gen,e=this._deviceIndex,r=e>=0?this._devices[e]:void 0,o=this._stream?.getVideoTracks()[0]?.getSettings().deviceId||r?.deviceId,p=this._facing==="user"?"environment":"user",u=this._nextCameras(e,o);!u.length&&this._refused.size&&(this._refused.clear(),u=this._nextCameras(e,o)),this._note(`switch from ${r?.label||"unknown camera"}`);let m=[...u.map(g=>this._byDevice(this._devices[g])),{video:{facingMode:{exact:p}},what:`facing ${p} (exact)`},{video:{facingMode:{ideal:p}},what:`facing ${p}`}];this._busy=!0,this._switchFailed=!1,this._copied=!1;try{let g=await this._replace(t,i,m,this._restoreCandidates(r,o));if(g==="cancelled")return;if(g==="lost"){this._unavailable("camera_lost");return}if(g!=="restored"&&!g.deviceId){if(this._isCamera(o,this._facing)){this._switchFailed=!0,await this._attach();return}this._facing=p}if(this._settle(g)&&g!=="restored"&&g.deviceId){let v=this._devices[this._deviceIndex]?.label??"";v&&Se(Ot.cameraLabel,Ce.test(v)?"":v)}}finally{this._busy=!1}}_nextCameras(t,i){let e=this._devices.length,r=[];for(let o=1;o<=(t<0?e:e-1);o++){let p=(t+o)%e,u=this._devices[p].deviceId;u===i||this._refused.has(u)||r.push(p)}return r}_isCamera(t,i){let e=this._stream?.getVideoTracks()[0]?.getSettings();return t&&e?.deviceId?e.deviceId===t:!!e?.facingMode&&e.facingMode===i}close(){this._gen++,this._stopStream(),this._open=!1,this._busy=!1,this._switching=!1}disconnectedCallback(){super.disconnectedCallback(),this._gen++,this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let i of this._stream?.getTracks()??[])i.stop();this._stream=null;let t=this._video;t&&(t.srcObject=null)}_unavailable(t){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:t},bubbles:!0,composed:!0}))}async _copyLog(){let t=this._log.join(`
`),i=!1;try{navigator.clipboard?.writeText&&(await navigator.clipboard.writeText(t),i=!0)}catch{}if(!i){let e=this.shadowRoot?.querySelector(".details textarea");if(e){e.focus(),e.select();try{i=document.execCommand("copy")}catch{i=!1}}}this._copied=i}async _shoot(){let t=this._video;if(!(!t||this._busy||this._switching)){this._busy=!0;try{let i=t.videoWidth||640,e=t.videoHeight||480,r=Math.min(1,Ti/Math.max(i,e)),o=document.createElement("canvas");o.width=Math.round(i*r),o.height=Math.round(e*r);let p=o.getContext("2d");if(!p)throw new Error("no_canvas");p.drawImage(t,0,0,o.width,o.height);let u=await new Promise(v=>o.toBlob(v,"image/jpeg",Ii));if(!u)throw new Error("no_blob");let m=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),g=new File([u],`photo-${m}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:g},bubbles:!0,composed:!0}))}catch(i){this._unavailable(i instanceof Error?i.message:String(i))}finally{this._busy=!1}}}render(){if(!this._open)return h;let t=this.lang,i=this._busy||this._switching;return l`
      <div class="overlay" role="dialog" aria-modal="true" aria-label=${s("doc_camera",t)}>
        <video autoplay playsinline muted></video>
        ${this._switching?l`<div class="switching" role="status">${s("camera_switching",t)}</div>`:h}
        ${this._switchFailed?l`<div class="switch-note" role="status">
              <div>${s("camera_not_answered",t)}</div>
              <details class="details">
                <summary>${s("camera_diagnostics",t)}</summary>
                <textarea readonly rows="6" .value=${this._log.join(`
`)}></textarea>
                <button type="button" class="copy" @click=${this._copyLog}>${s(this._copied?"camera_copied":"camera_copy",t)}</button>
              </details>
            </div>`:h}
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${s("cancel",t)}</button>
          ${this._devices.length>1?l`<button type="button" class="switch" ?disabled=${i} title=${s("camera_switch_lens",t)} aria-label=${s("camera_switch_lens",t)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
                <span class="switch-pos">${this._deviceIndex>=0?`${this._deviceIndex+1}/${this._devices.length}`:`?/${this._devices.length}`}</span>
              </button>`:h}
          <button type="button" class="shoot" ?disabled=${i} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${s("camera_capture_shoot",t)}</span>
          </button>
        </div>
      </div>
    `}};q.styles=k`
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
  `,d([f({type:String})],q.prototype,"lang",2),d([c()],q.prototype,"_open",2),d([c()],q.prototype,"_busy",2),d([c()],q.prototype,"_switching",2),d([c()],q.prototype,"_devices",2),d([c()],q.prototype,"_deviceIndex",2),d([c()],q.prototype,"_switchFailed",2),d([c()],q.prototype,"_copied",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",q);var Et=k`
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
`,H=class extends w{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=wt();this._inAppCamera=qe()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(t){t.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:t},bubbles:!0,composed:!0}))}_onInput(t){let i=t.target,e=Array.from(i.files??[]);i.value="",this._emit(e)}_onCameraClick(t){!this._inAppCamera||this._locked||(t.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(t){t.key!=="Enter"&&t.key!==" "||(t.preventDefault(),!this._locked&&t.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return h;let t=this.lang,i=this._locked?"disabled":"",e=this.busy?s("uploading",t):s("doc_camera",t),r=s(this._singlePick?"choose_photo":"choose_photos",t);return l`
      <div class="photo-pickers">
        ${this.showCamera?l`<label class="photo-pick photo-pick-camera ${i}" role="button" tabindex="0"
              aria-label=${e} title=${this.compact?e:h}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?h:l`<span>${e}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:h}
        ${this.showGallery?l`<label class="photo-pick photo-pick-gallery ${i}" role="button" tabindex="0"
              aria-label=${r} title=${this.compact?r:h}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?h:l`<span>${r}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:h}
      </div>
      ${this.showGallery&&this._singlePick?l`<div class="photo-android-hint">${s("photos_android_hint",t)}</div>`:h}
      ${this.showCamera&&this._inAppCamera?l`<ms-camera-capture .lang=${t}
            @photo-captured=${o=>this._emit([o.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:h}
    `}};d([f({type:String})],H.prototype,"lang",2),d([f({type:Boolean})],H.prototype,"disabled",2),d([f({type:Boolean})],H.prototype,"busy",2),d([f({type:String})],H.prototype,"accept",2),d([f({type:Boolean})],H.prototype,"showCamera",2),d([f({type:Boolean})],H.prototype,"showGallery",2),d([f({type:Boolean})],H.prototype,"compact",2),d([f({type:Number})],H.prototype,"remaining",2),d([c()],H.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",H);var lt=Q,y=class extends w{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.currencySymbol="";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new ot(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this._usedQtyText={};this.checklistPrefill={}}open(t={}){this._open||(this._open=!0,this.viaTagScan=!!t.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((i,e)=>[String(e),!!this.checklistPrefill[i]]).filter(([,i])=>i)),this._feedback="needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(i=>[j(i),{...i}])),this._usedQtyText={})}_rangeError(t,i){let e=this.lang;return s("settings_value_out_of_range",e).replace("{min}",E(t,e,{maximumFractionDigits:2})).replace("{max}",E(i,e,{maximumFractionDigits:2}))}_toggleCheck(t){let i=String(t);this._checklistState={...this._checklistState,[i]:!this._checklistState[i]}}_setFeedback(t){this._feedback=t}async _complete(){if(this._loading||this._photos.uploading)return;this._error="",this._photos.clearError();let t={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(t.notes=this._notes),this._cost){let r=parseFloat(this._cost);!isNaN(r)&&r>=0&&(t.cost=r)}let i=at(this._duration);if(i!==null&&(t.duration=i),this.checklist.length>0&&(t.checklist_state=this._checklistState),this.adaptiveEnabled&&(t.feedback=this._feedback),this._photos.photos.length>0&&(t.photo_doc_ids=this._photos.ids),this.viaTagScan&&(t.via_tag_scan=!0),this._completedAt){if(new Date(this._completedAt).getTime()>Date.now()){this._error=s("completed_at_future_error",this.lang);return}t.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let r={};for(let o of this.readings){let p=(this._readingValues[o.id]??"").trim();if(p==="")continue;let u=parseFloat(p.replace(",","."));isNaN(u)||(r[o.id]=u)}Object.keys(r).length>0&&(t.reading_values=r)}else if(this._readingValue!==""){let r=parseFloat(this._readingValue);isNaN(r)||(t.reading_value=r)}if(this.restockDefault!==null&&this._restockQty.trim()!==""){let r=parseFloat(this._restockQty.replace(",","."));if(!Number.isFinite(r)||r<rt[0]||r>rt[1]){this._error=this._rangeError(...rt);return}t.restock_quantity=r}if(this.parts.length>0){let r=[];for(let[o,p]of Object.entries(this._usedParts)){let u=this._usedQtyText[o],m=u===void 0?p.quantity:parseFloat(u.replace(",","."));if(!Number.isFinite(m)||m<lt[0]||m>lt[1]){this._error=this._rangeError(...lt);return}r.push({...p,quantity:m})}t.used_parts=r.map(o=>o.entry_id?{part_id:o.part_id,quantity:o.quantity,entry_id:o.entry_id}:{part_id:o.part_id,quantity:o.quantity})}await C(this,t,{busy:r=>{this._loading=r},lang:this.lang,fallbackKey:"save_error",onError:r=>{this._error=r}})!==void 0&&(this._photos.markAttached(),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed")))}_renderReadingField(t,i){let e=this._completedAt?new Date(this._completedAt).getTime():NaN,r=Kt(this.readingHistory,t.id,isNaN(e)?void 0:e),o=t.unit||this.readingUnit,p=(this._readingValues[t.id]??"").trim(),u=p===""?NaN:parseFloat(p.replace(",",".")),m=r!==void 0&&!isNaN(u)&&u<r.value,g=r!==void 0?E(r.value,i,{maximumFractionDigits:3}):"";return l`
      <label class="field reading-field">
        <span class="field-label">${t.name}${o?` (${o})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${r!==void 0?s("reading_last",i).replace("{value}",g):""}
          .value=${this._readingValues[t.id]??""}
          @input=${v=>{this._readingValues={...this._readingValues,[t.id]:v.target.value}}} />
        ${m?l`<span class="reading-warn">${s("reading_below_last",i).replace("{value}",g)}</span>`:h}
      </label>`}get _missingRequired(){let t={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(i=>!t[i])}_req(t){return this.requiredFields.includes(t)?l`<span class="req-mark" aria-hidden="true">*</span>`:h}_partsCostSuggestion(){if(this.restockDefault!==null){let e=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(e)||e<=0?null:Math.round(this.restockUnitCost*e*100)/100}if(!this.parts.length)return null;let t=0,i=!1;for(let e of Object.values(this._usedParts)){let r=this.parts.find(o=>j({part_id:o.id,entry_id:o.entry_id})===j(e));r?.cost!=null&&(t+=r.cost*(e.quantity||1),i=!0)}return i?Math.round(t*100)/100:null}_renderCostSuggestion(t){if(this._cost.trim()!=="")return h;let i=this._partsCostSuggestion();if(i==null||i<=0)return h;let e=st(i,this.currencySymbol,t);return l`<button
      type="button"
      class="cost-suggestion"
      @click=${()=>this._cost=String(Math.round(i*100)/100)}
    >${s("cost_from_parts",t).replace("{amount}",e)}</button>`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){this._completedAt=we(new Date)}render(){if(!this._open)return l``;let t=this.lang||this.hass?.language||"en",i=this._error||this._photos.errorText(t);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${s("complete_title",t)}${this.taskName}</div>
        ${this.phaseLabel?l`<div class="phase-line">${s("phase_current",t)}: ${this.phaseLabel}</div>`:h}
        ${this.requireTagScan&&!this.viaTagScan?l`<div class="scan-required-note">${s("require_tag_scan_hint",t)}</div>`:h}
        <div class="content">
          ${i?l`<div class="error">${i}</div>`:h}
          ${this.checklist.length>0?l`
            <div class="checklist-section">
              <label class="checklist-label">${s("checklist",t)}</label>
              ${this.checklist.map((e,r)=>l`
                <label class="checklist-item" @click=${()=>this._toggleCheck(r)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(r)]} />
                  <span>${e}</span>
                </label>
              `)}
            </div>
          `:h}
          ${this.readings.length>0?l`<div class="readings-block">
                <span class="field-label">${s("readings_section",t)}</span>
                ${this.readings.map(e=>this._renderReadingField(e,t))}
              </div>`:this.taskType==="reading"?l`
              <label class="field">
                <span class="field-label">${s("reading_value_label",t)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${e=>this._readingValue=e.target.value} />
              </label>`:h}
          ${this.parts.length?l`<div class="used-parts">
                <span class="field-label">${s("complete_parts_used",t)}</span>
                ${this.parts.map(e=>{let r=j({part_id:e.id,entry_id:e.entry_id}),o=this._usedParts[r],p=o!==void 0,u=e.entry_id?{part_id:e.id,quantity:1,entry_id:e.entry_id}:{part_id:e.id,quantity:1};return l`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${p}
                        @change=${m=>{let g={...this._usedParts};if(m.target.checked)g[r]=g[r]||u;else{delete g[r];let v={...this._usedQtyText};delete v[r],this._usedQtyText=v}this._usedParts=g}} />
                      <span
                        >${e.name}${e.owner_name?l`<span class="used-part-owner"> (${e.owner_name})</span>`:h}${e.stock!==null&&e.stock!==void 0?` (${yt(e.stock,e.unit,t)})`:""}</span
                      >
                    </label>
                    ${p?l`<input class="used-part-qty" type="number" min=${lt[0]} max=${lt[1]} step="0.01"
                          .value=${this._usedQtyText[r]??String(o.quantity)}
                          @input=${m=>{let g=m.target.value;this._usedQtyText={...this._usedQtyText,[r]:g};let v=parseFloat(g.replace(",","."));Number.isFinite(v)&&v>=lt[0]&&(this._usedParts={...this._usedParts,[r]:{...u,quantity:v}})}} />`:h}
                  </div>`})}
              </div>`:this.consumesInfo.length?l`<div class="consumes-hint">
                  ${this.consumesInfo.map(e=>l`<div>${e}</div>`)}
                </div>`:h}
          ${this.restockDefault!==null?l`
              <label class="field">
                <span class="field-label">${s("restock_quantity_label",t)}</span>
                <input type="number" step="0.01" min=${rt[0]} max=${rt[1]} class="field-input"
                  .value=${this._restockQty}
                  @input=${e=>this._restockQty=e.target.value} />
              </label>`:h}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${s("notes_optional",t)}${this._req("notes")}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${e=>this._notes=e.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${s("cost_optional",t)}${this._req("cost")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${e=>this._cost=e.target.value} />
            ${this._renderCostSuggestion(t)}
          </label>
          <label class="field">
            <span class="field-label">${s("duration_minutes",t)}${this._req("duration")}</span>
            <input type="number" step="1" min="0" inputmode="numeric" class="field-input"
              .value=${this._duration}
              @input=${e=>this._duration=e.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${s("completed_at_optional",t)}</span>
            ${this._completedAt?l`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${t}
                  .value=${this._completedAt}
                  @value-changed=${e=>this._completedAt=e.detail.value}
                ></ms-date-field>`:l`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${s("completed_at_pick",t)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${s("completion_photos_optional",t)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?l`<div class="photo-strip">
                  ${this._photos.photos.map(e=>l`
                    <div class="photo-preview">
                      <img src=${e.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(e.id)}
                        title="${s("remove",t)}">✕</button>
                    </div>`)}
                </div>`:h}
            ${this._photos.full?l`<div class="photo-limit">${s("photos_limit",t).replace("{max}",String(this._photos.max))}</div>`:l`<ms-photo-picker .lang=${t} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${e=>this._photos.addFiles(e.detail.files)}
                ></ms-photo-picker>`}
          </div>
          ${this.adaptiveEnabled?l`
            <div class="feedback-section">
              <label class="feedback-label">${s("was_maintenance_needed",t)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${s("feedback_needed",t)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${s("feedback_not_needed",t)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${s("feedback_not_sure",t)}</button>
              </div>
            </div>
          `:h}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",t)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._photos.uploading||this._missingRequired.length>0}
            title=${this._photos.uploading?s("uploading",t):this._missingRequired.length?this._missingRequired.map(e=>s("err_required",t).replace("{field}",s(mt[e]??e,t))).join(" \xB7 "):""}
          >
            ${this._loading?s("completing",t):s("complete",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};y.styles=[oe,Et,k`
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
  `],d([f({attribute:!1})],y.prototype,"hass",2),d([f()],y.prototype,"entryId",2),d([f()],y.prototype,"taskId",2),d([f()],y.prototype,"taskName",2),d([f()],y.prototype,"lang",2),d([f({type:Array})],y.prototype,"checklist",2),d([f({type:Boolean})],y.prototype,"adaptiveEnabled",2),d([f()],y.prototype,"taskType",2),d([f()],y.prototype,"readingUnit",2),d([f({attribute:!1})],y.prototype,"readings",2),d([f({attribute:!1})],y.prototype,"readingHistory",2),d([f({attribute:!1})],y.prototype,"restockDefault",2),d([f({attribute:!1})],y.prototype,"restockUnitCost",2),d([f()],y.prototype,"currencySymbol",2),d([f({attribute:!1})],y.prototype,"parts",2),d([f({attribute:!1})],y.prototype,"consumesParts",2),d([f({type:Array})],y.prototype,"consumesInfo",2),d([f({type:Array})],y.prototype,"requiredFields",2),d([f()],y.prototype,"phaseLabel",2),d([f({type:Boolean})],y.prototype,"requireTagScan",2),d([f({type:Boolean})],y.prototype,"viaTagScan",2),d([c()],y.prototype,"_open",2),d([c()],y.prototype,"_notes",2),d([c()],y.prototype,"_cost",2),d([c()],y.prototype,"_duration",2),d([c()],y.prototype,"_loading",2),d([c()],y.prototype,"_error",2),d([c()],y.prototype,"_checklistState",2),d([c()],y.prototype,"_feedback",2),d([c()],y.prototype,"_readingValue",2),d([c()],y.prototype,"_readingValues",2),d([c()],y.prototype,"_restockQty",2),d([c()],y.prototype,"_completedAt",2),d([c()],y.prototype,"_usedParts",2),d([c()],y.prototype,"_usedQtyText",2),d([f({attribute:!1})],y.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",y);var dt=k`
  .backdrop {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,0.5);
  }
  .dialog {
    position: fixed; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 95vw; max-width: var(--ms-modal-max-width, 480px);
    max-height: var(--ms-modal-max-height, 92vh); overflow: auto;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    color: var(--primary-text-color);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    padding: 20px;
    display: flex; flex-direction: column; gap: var(--ms-modal-gap, 14px);
    z-index: 101;
  }
  /* Focused programmatically on open (so Escape works at once) — no ring. */
  .dialog:focus { outline: none; }
`;function Ri(n,a){n.key!=="Escape"||n.defaultPrevented||n.composedPath().some(t=>t instanceof Element&&t.localName==="ms-camera-capture")||(n.preventDefault(),n.stopPropagation(),a())}function ct(n,a){return l`
    <div class="backdrop" @click=${n}></div>
    <div class="dialog" role="dialog" aria-modal="true" tabindex="-1"
      @keydown=${t=>Ri(t,n)}>${a}</div>
  `}function pt(n){n?.querySelector(".dialog")?.focus({preventScroll:!0})}function Ne(n,a,t){let i=new Blob([n],{type:t}),e=URL.createObjectURL(i),r=document.createElement("a");r.href=e,r.download=a,r.target="_blank",r.rel="noopener",r.style.display="none",document.body.appendChild(r),r.dispatchEvent(new MouseEvent("click")),document.body.removeChild(r),setTimeout(()=>URL.revokeObjectURL(e),6e4)}async function Pi(n,a,t=300){return(await n.connection.sendMessagePromise({type:"auth/sign_path",path:a,expires:t})).path}async function Oe(n,a,t=300){return Pi(n,`/api/maintenance_supporter/document/${a}`,t)}var Y=class extends w{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await Oe(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?h:this._url?l`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:l`<div class="ph"></div>`}};Y.styles=k`
    .wrap { display: inline-block; margin-top: 4px; }
    /* #161: uniform 96px tiles — several photos sit in a strip, so a
       tiny or portrait shot must not collapse its slot. */
    img {
      width: 96px;
      height: 96px;
      object-fit: cover;
      border-radius: 6px;
      display: block;
      border: 1px solid var(--divider-color);
      box-sizing: border-box;
    }
    .ph {
      width: 96px;
      height: 96px;
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      margin-top: 4px;
    }
  `,d([f({attribute:!1})],Y.prototype,"hass",2),d([f()],Y.prototype,"docId",2),d([c()],Y.prototype,"_url",2),d([c()],Y.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",Y);var P=class extends w{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._openGen=0;this._photos=new ot(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return R(this.hass)}openEdit(t){this._openGen++,this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(t.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(t),this._loadPartOptions()}_seedReadings(t){let i=[],e=new Set;for(let o of t.readings??[])e.has(o.id)||(e.add(o.id),i.push({id:o.id,name:o.name,unit:o.unit??null}));for(let o of t.reading_values??[])e.has(o.id)||(e.add(o.id),i.push({id:o.id,name:o.name,unit:o.unit??null}));this._readingRows=i;let r={};for(let o of t.reading_values??[])r[o.id]=String(o.value);this._readingText=r,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let t={};for(let i of this._readingRows){let e=(this._readingText[i.id]??"").trim();if(e==="")continue;let r=parseFloat(e.replace(",","."));isNaN(r)||(t[i.id]=r)}return t}async _loadPartOptions(){let t=this._draft;if(!t)return;let i=this._openGen;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});if(i!==this._openGen)return;let r=[];for(let p of e.parts||[]){let u=p.entry_id===t.entry_id,m=p.consumers.some(g=>g.entry_id===t.entry_id&&g.task_id===t.task_id);!u&&!m||r.push({part_id:p.part_id,name:p.name,entry_id:p.entry_id,foreign:!u,object_name:p.object_name})}for(let p of t.used_parts||[]){let u=p.entry_id||t.entry_id;r.some(m=>m.part_id===p.part_id&&m.entry_id===u)||r.push({part_id:p.part_id,name:p.name||p.part_id,entry_id:u,foreign:u!==t.entry_id,object_name:null})}let o={};for(let p of t.used_parts||[])o[`${p.entry_id||t.entry_id}:${p.part_id}`]=p.quantity??1;this._partOptions=r,this._partQty=o,this._partQtyOriginal=this._partSelectionKey()}catch{if(i!==this._openGen)return;this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,t])=>t>0).sort(([t],[i])=>t.localeCompare(i)))}close(){this._openGen++,this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(t,i){this._draft&&(this._draft={...this._draft,[t]:i})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let t=this._lang;if(!await Z(this.hass,{title:s("history_delete_entry",t),message:s("history_delete_confirm",t),confirmText:s("delete",t),danger:!0})||!this._draft||!this._originalSnapshot)return;let e=this._draft;this._error="",await this._runWs({type:"maintenance_supporter/task/history/delete",entry_id:e.entry_id,task_id:e.task_id,timestamp:this._originalSnapshot.original_timestamp})!==void 0&&(this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:e.entry_id,task_id:e.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close())}_runWs(t){return C(this,t,{busy:i=>{this._saving=i},onError:i=>{this._error=i}})}async _save(){if(!this._draft||!this._originalSnapshot||this._saving||this._photos.uploading)return;this._error="",this._photos.clearError();let t=this._draft,i=this._originalSnapshot,e={type:"maintenance_supporter/task/history/update",entry_id:t.entry_id,task_id:t.task_id,original_timestamp:i.original_timestamp};if(t.timestamp!==i.timestamp&&(e.timestamp=t.timestamp),t.notes!==i.notes&&(e.notes=t.notes),t.cost!==i.cost&&(e.cost=t.cost),t.duration!==i.duration&&(e.duration=t.duration),t.completed_by!==i.completed_by&&(e.completed_by=t.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(e.used_parts=(this._partOptions||[]).filter(o=>(this._partQty[`${o.entry_id}:${o.part_id}`]||0)>0).map(o=>({part_id:o.part_id,quantity:this._partQty[`${o.entry_id}:${o.part_id}`],...o.foreign?{entry_id:o.entry_id}:{}}))),t.reading_value!==i.reading_value&&(e.reading_value=t.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let o=this._readingNumbers(),p={};for(let u of this._readingRows)p[u.id]=o[u.id]??null;e.reading_values=p}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(e.photo_doc_ids=this._photos.ids),Object.keys(e).filter(o=>!["type","entry_id","task_id","original_timestamp"].includes(o)).length===0){this.close();return}await this._runWs(e)!==void 0&&(this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:t.entry_id,task_id:t.task_id,new_timestamp:t.timestamp},bubbles:!0,composed:!0})),this.close())}render(){if(!this._open||!this._draft)return h;let t=this._lang,i=this._draft,e=this._error||this._photos.errorText(t);return ct(()=>this.close(),l`
        <h2>${s("history_edit_title",t)}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${s(i.type,t)||i.type}</span>
        </div>
        <ms-date-field
          kind="datetime"
          required
          .hass=${this.hass}
          .lang=${t}
          .label=${s("history_edit_timestamp",t)}
          .value=${i.timestamp.slice(0,19)}
          @value-changed=${r=>{let o=r.detail.value;o&&this._set("timestamp",o)}}
        ></ms-date-field>
        <label>
          <span>${s("notes_label",t)}</span>
          <textarea
            rows="3"
            @input=${r=>{let o=r.target.value;this._set("notes",o||null)}}
            .value=${i.notes??""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${s("cost",t)}</span>
            <input type="number" min="0" step="0.01"
              .value=${i.cost!=null?String(i.cost):""}
              @input=${r=>{let o=r.target.value;this._set("cost",o?Number(o):null)}} />
          </label>
          <label>
            <span>${s("duration",t)}</span>
            <input type="number" min="0" step="1" inputmode="numeric"
              .value=${i.duration!=null?String(i.duration):""}
              @input=${r=>{this._set("duration",at(r.target.value))}} />
          </label>
        </div>
        ${this._renderReadings(i,t)}
        ${this._partOptions&&this._partOptions.length>0?l`
          <div class="parts-block">
            <span class="parts-title">${s("complete_parts_used",t)}</span>
            ${this._partOptions.map(r=>{let o=`${r.entry_id}:${r.part_id}`,p=this._partQty[o]||0;return l`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${p>0}
                    @change=${u=>{let m=u.target.checked;this._partQty={...this._partQty,[o]:m?1:0}}} />
                  <span class="part-label">${r.name}${r.foreign&&r.object_name?` (${r.object_name})`:""}</span>
                  ${p>0?l`
                    <input class="part-qty" type="number" min=${Q[0]} max=${Q[1]} step="0.01"
                      .value=${String(p)}
                      @input=${u=>{let m=parseFloat(u.target.value);!isNaN(m)&&m>0&&(this._partQty={...this._partQty,[o]:m})}} />
                  `:h}
                </label>
              `})}
          </div>
        `:h}
        <div class="photos-block">
          <span class="parts-title">${s("completion_photos",t)}</span>
          ${this._photos.photos.length>0?l`
            <div class="photo-strip">
              ${this._photos.photos.map(r=>l`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${r.id}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${s("remove",t)}
                    @click=${()=>this._photos.remove(r.id)}>✕</button>
                </div>`)}
            </div>`:h}
          ${this._photos.full?l`<span class="photos-hint">${s("photos_limit",t).replace("{max}",String(this._photos.max))}</span>`:l`<ms-photo-picker .lang=${t} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${r=>this._photos.addFiles(r.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${s("history_edit_photos_hint",t)}</span>
        </div>
        ${e?l`<div class="error">${e}</div>`:h}
        <div class="actions">
          <button class="delete-entry" @click=${this._delete} ?disabled=${this._saving} title=${s("history_delete_entry",t)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon> ${s("history_delete_entry",t)}
          </button>
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${s("cancel",t)}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving||this._photos.uploading}
            title=${this._photos.uploading?s("uploading",t):""}>
            ${this._saving?s("saving",t):s("save",t)}
          </button>
        </div>
    `)}updated(t){t.has("_open")&&this._open&&pt(this.shadowRoot)}_renderReadings(t,i){return this._readingRows.length>0?l`
        <div class="readings-block">
          <span class="parts-title">${s("readings_section",i)}</span>
          ${this._readingRows.map(e=>l`
            <label class="reading-row-edit">
              <span class="reading-row-name">${e.name}${e.unit?` (${e.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[e.id]??""}
                @input=${r=>{this._readingText={...this._readingText,[e.id]:r.target.value}}} />
            </label>
          `)}
        </div>`:t.reading_value==null&&t.task_type!=="reading"?h:l`
      <label>
        <span>${s("reading_value_label",i)}${t.reading_unit?` (${t.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${t.reading_value!=null?String(t.reading_value):""}
          @input=${e=>{let r=e.target.value,o=r===""?NaN:Number(r);this._set("reading_value",isNaN(o)?null:o)}} />
      </label>`}};P.styles=[Et,dt,k`
    :host { display: contents; --ms-modal-max-height: 90vh; --ms-modal-gap: 12px; }
    h2 { margin: 0; font-size: 18px; }
    .entry-type {
      display: flex; align-items: center; gap: 6px;
      color: var(--secondary-text-color); font-size: 13px;
    }
    label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
    label span { color: var(--secondary-text-color); }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    input, textarea {
      padding: 8px; font-size: 14px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px;
      width: 100%; box-sizing: border-box;
      font-family: inherit;
    }
    .delete-entry { margin-right: auto; color: var(--error-color, #d32f2f); background: transparent; border: 1px solid var(--error-color, #d32f2f); border-radius: 6px; padding: 6px 10px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
    .delete-entry ha-icon { --mdc-icon-size: 18px; }
    .actions {
      display: flex; gap: 8px; justify-content: flex-end;
      margin-top: 8px;
    }
    button {
      padding: 8px 16px; font-size: 14px;
      border-radius: 6px; cursor: pointer;
      border: none; font-weight: 500;
    }
    button.cancel {
      background: transparent;
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
    }
    button.save {
      background: var(--primary-color);
      color: var(--text-primary-color, white);
    }
    button[disabled] { opacity: 0.5; cursor: wait; }
    .error {
      color: var(--error-color, #d32f2f);
      font-size: 13px; padding: 8px;
      background: rgba(211,47,47,0.1);
      border-radius: 6px;
    }
    /* #130: parts on the entry */
    .parts-block {
      display: flex; flex-direction: column; gap: 6px;
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px; padding: 8px;
    }
    .parts-title { color: var(--secondary-text-color); font-size: 13px; }
    .part-row-edit {
      display: flex; flex-direction: row; align-items: center; gap: 8px;
      font-size: 14px;
    }
    .part-row-edit input[type="checkbox"] { width: auto; }
    .part-label { flex: 1; color: var(--primary-text-color); }
    .part-qty { width: 76px; }
    /* #161 phase 2: readings on the entry */
    .readings-block {
      display: flex; flex-direction: column; gap: 6px;
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px; padding: 8px;
    }
    .reading-row-edit {
      display: flex; flex-direction: row; align-items: center; gap: 8px;
      font-size: 14px;
    }
    .reading-row-name { flex: 1; color: var(--primary-text-color); min-width: 0; }
    .reading-row-input { width: 140px; font-variant-numeric: tabular-nums; }
    /* #161: photos on the entry */
    .photos-block {
      display: flex; flex-direction: column; gap: 6px;
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px; padding: 8px;
    }
    .photo-strip { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 6px; }
    .photo-tile { position: relative; width: fit-content; }
    .photo-remove {
      position: absolute; top: -4px; right: -8px;
      width: 22px; height: 22px; border-radius: 50%; border: none;
      background: var(--error-color, #db4437); color: #fff;
      cursor: pointer; font-size: 11px; line-height: 1; padding: 0;
    }
    /* the camera / gallery pickers come from photoPickerStyles (ms-photo-picker) */
    .photos-hint { font-size: 12px; color: var(--secondary-text-color); }
  `],d([f({attribute:!1})],P.prototype,"hass",2),d([c()],P.prototype,"_open",2),d([c()],P.prototype,"_saving",2),d([c()],P.prototype,"_error",2),d([c()],P.prototype,"_draft",2),d([c()],P.prototype,"_partOptions",2),d([c()],P.prototype,"_partQty",2),d([c()],P.prototype,"_readingRows",2),d([c()],P.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",P);function tt(n){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Mt(n){return!n.startsWith("data:image/svg+xml,")&&!n.startsWith("data:image/png;base64,")?"":tt(n)}function Li(n){return n.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var L=class extends w{constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._quickResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(t,i){this._entryId=t,this._taskId=null,this._objectName=i,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}openForTask(t,i,e,r){this._entryId=t,this._taskId=i,this._objectName=e,this._taskName=r,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}async _generate(){let t=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null;try{let i={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(i.task_id=this._taskId);let e=[this.hass.connection.sendMessagePromise({...i,action:"view"})];this._taskId&&(e.push(this.hass.connection.sendMessagePromise({...i,action:"complete"})),await this._hasQuickCompleteDefaults()&&e.push(this.hass.connection.sendMessagePromise({...i,action:"quick_complete"})));let r=await Promise.all(e);if(t!==this._generateSeq)return;this._viewResult=r[0],r.length>1&&(this._completeResult=r[1]),r.length>2&&(this._quickResult=r[2])}catch(i){if(t!==this._generateSeq)return;let e=i?.code,r=i?.message;this._error=e==="no_url"||typeof r=="string"&&r.includes("No Home Assistant URL")?s("qr_error_no_url",this.lang):s("qr_error",this.lang)}finally{t===this._generateSeq&&(this._loading=!1)}}async _hasQuickCompleteDefaults(){try{let i=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId})).tasks||[]).find(e=>e.id===this._taskId);return!!i?.quick_complete_defaults&&Object.keys(i.quick_complete_defaults).length>0}catch{return!1}}_setUrlMode(t){this._urlMode!==t&&(this._urlMode=t,this._generate())}_print(){if(!this._viewResult)return;let t=this._viewResult,i=t.label.task_name?`${t.label.object_name} \u2014 ${t.label.task_name}`:t.label.object_name,e=[t.label.manufacturer,t.label.model].filter(Boolean).join(" "),r=window.open("","_blank","width=600,height=500");if(!r)return;let o=this.lang||"en",p=tt(i),u=tt(e),m=!!this._completeResult,g=!!this._quickResult,v=tt(s("qr_action_view",o)),x=tt(s("qr_action_complete",o)),b=tt(s("qr_action_quick_complete",o));r.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${p}</title>
<style>
  /* Printable sheet \u2014 must not inherit the phone's dark theme. The QR images
     carry their own white quiet zone and stay scannable either way, but the
     labels below are explicit dark greys and would vanish on a WebView's dark
     canvas. Same reasoning as helpers/report.ts. */
  :root{color-scheme:light}
  body{font-family:sans-serif;text-align:center;padding:20px;background:#fff;color:#1a1a1a}
  h2{margin:0 0 4px}
  .sub{color:#666;font-size:14px;margin-bottom:16px}
  .qr-row{display:flex;justify-content:center;gap:24px;margin:12px 0}
  .qr-col{display:flex;flex-direction:column;align-items:center;gap:6px}
  .qr-col img{width:${g?"170px":m?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${p}</h2>
${u?`<div class="sub">${u}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${Mt(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${v}</div>
  </div>
  ${m?`<div class="qr-col">
    <img src="${Mt(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${x}</div>
  </div>`:""}
  ${g?`<div class="qr-col">
    <img src="${Mt(this._quickResult.svg_data_uri)}" alt="QR Quick-complete" />
    <div class="qr-label">${b}</div>
  </div>`:""}
</div>
<div class="url">${tt(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),r.document.close()}_downloadSvg(t,i){let e=decodeURIComponent(t.svg_data_uri.replace("data:image/svg+xml,","")),r=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;Ne(e,`qr-${Li(r)}-${i}.svg`,"image/svg+xml")}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._quickResult=null,this._error="",this._loading=!1}render(){if(!this._open)return l``;let t=this.lang||this.hass?.language||"en",i=this._taskName?`${s("qr_code",t)}: ${this._objectName} \u2014 ${this._taskName}`:`${s("qr_code",t)}: ${this._objectName}`,e=!!this._viewResult;return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i}</div>
        <div class="content">
          ${this._loading?l`<div class="loading">${s("qr_generating",t)}</div>`:this._error?l`<div class="error">${this._error}</div>`:e?l`
                    <div class="qr-pair">
                      <div class="qr-item">
                        <img
                          class="qr-image ${this._completeResult?"small":""}"
                          src="${this._viewResult.svg_data_uri}"
                          alt="QR Info"
                        />
                        <div class="qr-item-label">${s("qr_action_view",t)}</div>
                        <button class="dl-btn"
                          @click=${()=>this._downloadSvg(this._viewResult,"info")}>
                          <ha-icon icon="mdi:download"></ha-icon>
                          ${s("qr_download",t)}
                        </button>
                      </div>
                      ${this._completeResult?l`
                            <div class="qr-item">
                              <img
                                class="qr-image small"
                                src="${this._completeResult.svg_data_uri}"
                                alt="QR Complete"
                              />
                              <div class="qr-item-label">${s("qr_action_complete",t)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._completeResult,"complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${s("qr_download",t)}
                              </button>
                            </div>
                          `:h}
                      ${this._quickResult?l`
                            <div class="qr-item quick">
                              <img
                                class="qr-image small"
                                src="${this._quickResult.svg_data_uri}"
                                alt="QR Quick-complete"
                              />
                              <div class="qr-item-label">${s("qr_action_quick_complete",t)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._quickResult,"quick-complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${s("qr_download",t)}
                              </button>
                            </div>
                          `:h}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  `:h}
          <div class="action-row">
            <label>${s("qr_url_mode",t)}</label>
            <div class="action-toggle">
              <button class="toggle-btn ${this._urlMode==="companion"?"active":""}"
                @click=${()=>this._setUrlMode("companion")}>${s("qr_mode_companion",t)}</button>
              <button class="toggle-btn ${this._urlMode==="local"?"active":""}"
                @click=${()=>this._setUrlMode("local")}>${s("qr_mode_local",t)}</button>
              <button class="toggle-btn ${this._urlMode==="server"?"active":""}"
                @click=${()=>this._setUrlMode("server")}>${s("qr_mode_server",t)}</button>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",t)}
          </ha-button>
          <ha-button
            @click=${this._print}
            .disabled=${!e}
          >
            ${s("qr_print",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};L.styles=k`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      min-width: 300px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    .qr-pair {
      display: flex;
      flex-wrap: wrap; /* three codes (quick-complete, #192) wrap on a phone */
      gap: 20px;
      justify-content: center;
      width: 100%;
    }
    .qr-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .qr-image {
      width: 240px;
      height: 240px;
      image-rendering: pixelated;
    }
    .qr-image.small {
      width: 180px;
      height: 180px;
    }
    .qr-item-label {
      max-width: 180px;
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
      text-align: center;
    }
    .dl-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: 1px solid var(--divider-color, #e0e0e0);
      cursor: pointer;
      font-size: 13px;
      color: var(--primary-text-color);
      padding: 6px 14px;
      border-radius: 18px;
      transition: background 0.2s, border-color 0.2s;
    }
    .dl-btn:hover {
      background: var(--secondary-background-color, #f5f5f5);
      border-color: var(--primary-color);
    }
    .dl-btn ha-icon {
      --mdc-icon-size: 18px;
    }
    .url-display {
      font-size: 11px;
      color: var(--secondary-text-color);
      word-break: break-all;
      text-align: center;
      max-width: 400px;
    }
    .loading {
      padding: 40px 0;
      color: var(--secondary-text-color);
    }
    .error {
      padding: 20px 0;
      color: var(--error-color, #f44336);
    }
    .action-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }
    .action-row label {
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .action-toggle {
      display: flex;
      gap: 4px;
      background: var(--divider-color, #e0e0e0);
      border-radius: 6px;
      padding: 3px;
    }
    .toggle-btn {
      flex: 1;
      padding: 8px 12px;
      border: none;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      border-radius: 4px;
      font-size: 13px;
      transition: all 0.2s;
      line-height: 1.3;
    }
    .toggle-btn:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    .toggle-btn.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    }
  `,d([f({attribute:!1})],L.prototype,"hass",2),d([f()],L.prototype,"lang",2),d([c()],L.prototype,"_open",2),d([c()],L.prototype,"_loading",2),d([c()],L.prototype,"_error",2),d([c()],L.prototype,"_viewResult",2),d([c()],L.prototype,"_completeResult",2),d([c()],L.prototype,"_quickResult",2),d([c()],L.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",L);function qi(n,a){if(a<=0)return 0;let t=typeof n=="number"&&Number.isFinite(n)?Math.trunc(n):0;return t<0?0:t%a}function Hi(n){return!!(n?.phases&&n.phase_sequence&&n.phase_sequence.length>0)}function Ft(n){if(!n||!Hi(n))return null;let a=n.phase_sequence,t=qi(n.phase_cursor,a.length),i=a[t],e=n.phases?.[i];return e?{id:i,name:e.name,index:t,count:a.length,notes:e.notes,checklist:e.checklist!==void 0?e.checklist:n.checklist??[],consumesParts:e.consumes_parts!==void 0?e.consumes_parts:n.consumes_parts??[],requiredFields:e.required_completion_fields!==void 0?e.required_completion_fields:n.required_completion_fields??[]}:null}function gt(n){let a=Ft(n);return a?`${a.index+1}/${a.count} \xB7 ${a.name}`:""}function Ni(n,a){return typeof n=="number"&&Number.isFinite(n)&&n>=.01?n:a}function Me(n){let a=n.task??null,t=a?Ft(a):null,i=t?t.consumesParts:a?.consumes_parts||[],e=!!a?.part_ref,r=n.objects.find(g=>g.entry_id===n.entryId)?.parts||[],o=e?r.find(g=>g.id===a.part_ref.part_id):void 0,p=n.features?n.features.checklists:n.checklistsEnabled??!0,u=n.features?n.features.checklists?n.checklist??a?.checklist??[]:[]:n.checklist??[],m=n.features?n.features.adaptive&&(n.adaptiveEnabled??!!a?.adaptive_config?.enabled):!!n.adaptiveEnabled;return{entry_id:n.entryId,task_id:n.taskId,task_name:n.taskName,checklist:t?p?t.checklist:[]:u,adaptive_enabled:m,required_completion_fields:t?t.requiredFields:a?.required_completion_fields||[],task_type:a?.type||"",reading_unit:a?.reading_unit||"",readings:a?.readings||[],reading_history:Qt(a?.history),parts:e?[]:ge({consumes_parts:i},n.entryId,n.objects,n.lang),consumes_parts:e?[]:i,phase_label:t?gt(a):"",require_tag_scan:!!a?.require_tag_scan,restock_default:e?Ni(o?.restock_quantity,1):null,restock_unit_cost:e?o?.cost??null:null,currency_symbol:ht({currency_symbol:n.currencySymbol}),consumes_info:i.map(g=>me(g,n.entryId,n.objects,n.lang)),checklist_prefill:a?.checklist_progress||{},via_tag_scan:!!n.viaTagScan}}function Fe(n,a,t){n.entryId=a.entry_id,n.taskId=a.task_id,n.taskName=a.task_name,n.lang=t,n.checklist=a.checklist??[],n.adaptiveEnabled=!!a.adaptive_enabled,n.requiredFields=a.required_completion_fields??[],n.taskType=a.task_type??"",n.readingUnit=a.reading_unit??"",n.readings=a.readings??[],n.readingHistory=a.reading_history??[],n.parts=a.parts??[],n.consumesParts=a.consumes_parts??[],n.phaseLabel=a.phase_label??"",n.requireTagScan=!!a.require_tag_scan,n.restockDefault=a.restock_default??null,n.restockUnitCost=a.restock_unit_cost??null,n.currencySymbol=ht(a),n.consumesInfo=a.consumes_info??[],n.checklistPrefill=a.checklist_prefill??{},n.viaTagScan=!!a.via_tag_scan,n.open({viaTagScan:!!a.via_tag_scan})}var De=n=>typeof n=="number"&&Number.isInteger(n)&&n>0;function Oi(n){return n&&De(n.ref_no)?String(n.ref_no):null}function je(n,a){let t=Oi(n);return t&&a&&De(a.ref_no)?`${t}.${a.ref_no}`:null}function Ue(n,a){return n?l`<span class="ref-chip" title=${a??""}>#${n}</span>`:h}var Mi={"Completed from dashboard button":"hist_note_button","Completed from the To-do list":"hist_note_todo","Completed by voice":"hist_note_voice","Completed from the notification":"hist_note_notification","Completed via NFC tag":"hist_note_nfc","Completed from the shopping list":"hist_note_shopping_list","Completed from a mirrored to-do list":"hist_note_todo_mirror","Skipped from notification":"hist_note_skipped_notification","Skipped from dashboard button":"hist_note_skipped_button","Sensor trigger activated":"hist_note_sensor_triggered","Initial value set during task creation":"hist_note_initial"},Fi=[[/^Auto-completed: sensor recovered \((.+)\)$/,"hist_note_auto_recovered",n=>({value:n[1]})],[/^Reset to (\d{4}-\d{2}-\d{2})$/,"hist_note_reset",(n,a)=>({date:z(n[1],a)})],[/^Trigger entity replaced: (.+) → (.+)$/,"hist_note_trigger_replaced",n=>({old:n[1],new:n[2]})],[/^Sensor trigger removed \(entity was: (.+)\)\. Schedule converted to (\w+)\.$/,"hist_note_trigger_removed",(n,a)=>({entity:n[1],schedule:s(n[2],a)})],[/^Entity (.+) removed from compound trigger; (\d+) conditions remain\.$/,"hist_note_compound_removed",n=>({entity:n[1],count:n[2]})]];function ze(n,a){if(!n)return"";let t=Mi[n.trim()];if(t)return s(t,a);for(let[i,e,r]of Fi){let o=n.trim().match(i);if(o){let p=r(o,a);return s(e,a).replace(/\{(\w+)\}/g,(u,m)=>p[m]??u)}}return n}var Di=["completed","reset","skipped"];function Be(n){let a=t=>{let i=t.timestamp??"",e=Date.parse(i.length===10?`${i}T00:00:00`:i);return Number.isNaN(e)?-1/0:e};return(n??[]).map((t,i)=>({entry:t,index:i,at:a(t)})).sort((t,i)=>i.at-t.at||i.index-t.index).map(t=>t.entry)}function ji(n,a){return n.taskRef&&a.ref_no?`${n.taskRef}-${a.ref_no}`:null}function Ui(n,a){let t=Vt(a);return t.length>0?l`<div class="history-photos">
        ${t.map(i=>l`<maintenance-history-photo .hass=${n} .docId=${i}></maintenance-history-photo>`)}
      </div>`:h}function zi(n,a){let t=a.lang,i=o=>E(o,t,{maximumFractionDigits:3}),e=o=>o==null?"":` (${o>=0?"+":""}${i(o)})`,r=Gt(n);return r.length>0?l`<div class="history-readings">
      ${r.map(o=>l`<span class="history-reading">
        <span class="history-reading-name">${o.name}</span>
        <span class="history-reading-value">${i(o.value)}${o.unit?` ${o.unit}`:""}${e(a.readingSlotDelta?.(n,o.id))}</span>
      </span>`)}
    </div>`:n.reading_value!=null?l`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${s("reading_label",t)}</span>
      <span class="history-reading-value">${i(n.reading_value)}${a.readingUnit?` ${a.readingUnit}`:""}${e(a.readingDelta?.(n))}</span>
    </span></div>`:h}function Ve(n,a,t={}){let i=a.lang,{compact:e=!1,showRef:r=!0,showBadges:o=!0,showEdit:p=!0}=t,u=a.openEdit,m=p&&!!u&&Di.includes(n.type);return l`
    <div class="history-entry${e?" compact":""}">
      ${e?h:l`<div class="history-icon ${n.type}">
            <ha-icon .icon=${vt[n.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        <div class="history-row">
          <strong>${s(n.type,i)}</strong>
          ${r?Ue(ji(a,n),s("ref_number",i)):h}
          ${o&&n.phase_id?l`<span class="history-phase-badge">${a.phaseNames?.[n.phase_id]||n.phase_id}</span>`:h}
          ${o&&n.auto?l`<span class="history-auto-badge">${s("history_auto",i)}</span>`:h}
          ${m?l`<button class="history-edit-btn"
                     title=${s("history_edit_button",i)}
                     @click=${()=>u(n)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:h}
        </div>
        <div class="history-date">${ie(n.timestamp,i)}</div>
        ${n.notes?l`<div>${ze(n.notes,i)}</div>`:h}
        ${Ui(a.hass,n)}
        ${zi(n,a)}
        ${n.cost!=null||n.duration!=null||n.trigger_value!=null?l`<div class="history-details">
              ${n.cost!=null?l`<span>${s("cost",i)}: ${st(n.cost,a.currencySymbol,i)}</span>`:h}
              ${n.duration!=null?l`<span>${s("duration",i)}: ${bt(n.duration,i)}</span>`:h}
              ${n.trigger_value!=null?l`<span>${s("trigger_val",i)}: ${n.trigger_value}</span>`:h}
            </div>`:h}
      </div>
    </div>
  `}var Bi="var(--maint-done-color, #78909c)";function ft(n){return n.archived?"archived":n.is_done?"done":n.status||"ok"}function Dt(n,a){return s(n==="done"?"completed":n,a)}function Tt(n){let a=ft(n);return a==="done"?Bi:Ut[a]||"var(--disabled-color, #9e9e9e)"}function Vi(n){return vt[n==="done"?"completed":n]||"mdi:circle-medium"}function We(n,a,t="pill"){let i=ft(n),e=Dt(i,a);return t==="chip"?l`<span class="status-chip ${i}">${e}</span>`:l`<span class="status-badge ${i}" role="img" title="${e}" aria-label="${e}"><ha-icon icon="${Vi(i)}"></ha-icon><span class="status-label">${e}</span></span>`}var It=class{constructor(){this._handle=null}schedule(a,t=4e3){this.clear(),this._handle=setTimeout(()=>{this._handle=null,a()},t)}clear(){this._handle!==null&&(clearTimeout(this._handle),this._handle=null)}get pending(){return this._handle!==null}};function $(n){return n.toFixed(1)}function Ge(n,a){let t=n.interval_analysis,i=t?.weibull_beta,e=t?.weibull_eta;if(i==null||e==null||e<=0)return h;let r=n.interval_days??0,o=n.suggested_interval??r;return l`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${s("weibull_reliability_curve",a)}
        ${Wi(i,a)}
      </div>
      ${Gi(i,e,r,o,a)}
      ${Qi(t,a)}
      ${t?.confidence_interval_low!=null?Ki(t,n,a):h}
    </div>
  `}function Wi(n,a){let t,i,e;return n<.8?(t="early_failures",i="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",e="beta_early_failures"):n<=1.2?(t="random_failures",i="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",e="beta_random_failures"):n<=3.5?(t="wear_out",i="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",e="beta_wear_out"):(t="highly_predictable",i="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",e="beta_highly_predictable"),l`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${i}"></ha-svg-icon>
      ${s(e,a)} (\u03B2=${E(n,a,2)})
    </span>
  `}function Gi(n,a,t,i,e){let b=Math.max(t,i,a,1)*1.3,S=50,N=[];for(let O=0;O<=S;O++){let D=O/S*b,ai=1-Math.exp(-Math.pow(D/a,n)),oi=32+D/b*260,li=136-ai*128;N.push([oi,li])}let G=N.map(([O,D])=>`${$(O)},${$(D)}`).join(" "),J="M32,136 "+N.map(([O,D])=>`L${$(O)},${$(D)}`).join(" ")+` L${$(N[S][0])},136 Z`,F=32+t/b*260,U=1-Math.exp(-Math.pow(t/a,n)),et=136-U*128,ri=E((1-U)*100,e,0),jt=32+i/b*260,ni=[0,.25,.5,.75,1];return l`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_weibull",e)}">
        ${ni.map(O=>{let D=136-O*128;return it`
            <line x1="${32}" y1="${$(D)}" x2="${292}" y2="${$(D)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${O===.5?"4,3":h}" />
            <text x="${28}" y="${$(D+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${E(O*100,e,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(b/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(b)}</text>

        <path d="${J}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${G}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?it`
          <line x1="${$(F)}" y1="${8}" x2="${$(F)}" y2="${$(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${$(F)}" cy="${$(et)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${$(F+4)}" y="${$(et-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${ri}%</text>
        `:h}

        ${i>0&&i!==t?it`
          <line x1="${$(jt)}" y1="${8}" x2="${$(jt)}" y2="${$(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:h}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${s("weibull_failure_probability",e)}</span>
      ${t>0?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${s("current_interval_marker",e)}</span>`:h}
      ${i>0&&i!==t?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${s("recommended_marker",e)}</span>`:h}
    </div>
  `}function Qi(n,a){return l`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${s("characteristic_life",a)}</span>
        <span class="weibull-info-value">${Math.round(n.weibull_eta)} ${s("days",a)}</span>
      </div>
      ${n.weibull_r_squared!=null?l`
        <div class="weibull-info-item">
          <span>${s("weibull_r_squared",a)}</span>
          <span class="weibull-info-value">${E(n.weibull_r_squared,a,3)}</span>
        </div>
      `:h}
    </div>
  `}function Ki(n,a,t){let i=n.confidence_interval_low,e=n.confidence_interval_high,r=a.suggested_interval??a.interval_days??0,o=a.interval_days??0,p=Math.max(0,i-5),m=e+5-p,g=(i-p)/m*100,v=(e-i)/m*100,x=(r-p)/m*100,b=o>0?(o-p)/m*100:-1;return l`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${s("confidence_interval",t)}: ${r} ${s("days",t)} (${i}\u2013${e})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${$(g)}%;width:${$(v)}%"></div>
        ${b>=0?l`<div class="confidence-marker current" style="left:${$(b)}%"></div>`:h}
        <div class="confidence-marker recommended" style="left:${$(x)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${s("confidence_conservative",t)} (${i}${s("days",t).charAt(0)})</span>
        <span class="confidence-text high">${s("confidence_aggressive",t)} (${e}${s("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function Qe(n,a,t){let i=n.degradation_trend!=null&&n.degradation_trend!=="insufficient_data",e=n.days_until_threshold!=null,r=n.environmental_factor!=null&&n.environmental_factor!==1;if(!i&&!e&&!r)return h;let o=n.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":n.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return l`
    <div class="prediction-section">
      ${n.sensor_prediction_urgency?l`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${s("sensor_prediction_urgency",a).replace("{days}",String(Math.round(n.days_until_threshold||0)))}
        </div>
      `:h}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${s("sensor_prediction",a)}
      </div>
      <div class="prediction-grid">
        ${i?l`
          <div class="prediction-item">
            <ha-svg-icon path="${o}"></ha-svg-icon>
            <span class="prediction-label">${s("degradation_trend",a)}</span>
            <span class="prediction-value ${n.degradation_trend}">${s("trend_"+n.degradation_trend,a)}</span>
            ${n.degradation_rate!=null?l`<span class="prediction-rate">${n.degradation_rate>0?"+":""}${E(n.degradation_rate,a,Math.abs(n.degradation_rate)>=10?0:1)} ${n.trigger_entity_info?.unit_of_measurement||""}/${s("day_short",a)}</span>`:h}
          </div>
        `:h}
        ${e?l`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${s("days_until_threshold",a)}</span>
            <span class="prediction-value prediction-days${n.days_until_threshold===0?" exceeded":n.sensor_prediction_urgency?" urgent":""}">${n.days_until_threshold===0?s("threshold_exceeded",a):"~"+Math.round(n.days_until_threshold)+" "+s("days",a)}</span>
            ${n.threshold_prediction_date?l`<span class="prediction-date">${z(n.threshold_prediction_date,a)}</span>`:h}
            ${n.threshold_prediction_confidence?l`<span class="confidence-dot ${n.threshold_prediction_confidence}"></span>`:h}
            ${(n.prediction_cycles??0)>0?l`<span class="prediction-cycles">${s("prediction_cycles",a)}: ${n.prediction_cycles}</span>`:h}
          </div>
        `:h}
        ${r&&t.environmental?l`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${s("environmental_adjustment",a)}</span>
            <span class="prediction-value">${E(n.environmental_factor,a,2)}x</span>
            ${n.environmental_entity?l`<span class="prediction-entity entity-link" @click=${p=>ae(p,n.environmental_entity)}>${n.environmental_entity}</span>`:h}
          </div>
        `:h}
      </div>
    </div>
  `}function Ke(n,a,t,i){let e=Math.max(n||1,a);return l`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${s("current",i)}: ${n??"\u2014"} ${n!=null?s("days",i):""}
        </div>
        <div class="interval-visual current"
          style="width: ${n!=null?Math.min(n/e*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${s("recommended",i)}: ${a} ${s("days",i)}
          <span class="confidence-badge ${t}">${s(`confidence_${t}`,i)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(a/e*100,100)}%"></div>
      </div>
    </div>
  `}var Ye=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function Je(n,a,t){if(!t.seasonal||!n.seasonal_factor||n.seasonal_factor===1)return h;let i=Ye.map(p=>s(p,a)),e=new Date().getMonth(),r=n.seasonal_factors||n.interval_analysis?.seasonal_factors||null,o=r&&r.length===12?r:i.map((p,u)=>{let m=n.seasonal_factor||1,g=Math.sin((u-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,m+g))});return l`
    <div class="seasonal-card-compact">
      <h4>${s("seasonal_awareness",a)}</h4>
      <div class="seasonal-mini-chart">
        ${o.map((p,u)=>{let m=p*40,g=p<.9?"low":p>1.1?"high":"normal";return l`
            <div class="seasonal-bar ${g} ${u===e?"current":""}"
                 style="height: ${m}px"
                 title="${i[u]}: ${E(p,a,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${s("shorter",a)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${s("normal",a)}</span>
        <span class="legend-item"><span class="dot high"></span> ${s("longer",a)}</span>
      </div>
    </div>
  `}function Ze(n,a){return Yi(n,a)}function Yi(n,a){let t=n.seasonal_factors??n.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return h;let i=n.interval_analysis?.seasonal_reason,e=new Date().getMonth(),r=300,o=100,p=8,m=o-p-4,g=Math.max(...t,1.5),v=r/12,x=v*.65,b=p+m-1/g*m;return l`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${s("seasonal_chart_title",a)}
        ${i?l`<span class="source-tag">${i==="learned"?s("seasonal_learned",a):s("seasonal_manual",a)}</span>`:h}
      </div>
      <svg viewBox="0 0 ${r} ${o}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_seasonal",a)}">
        <line x1="0" y1="${$(b)}" x2="${r}" y2="${$(b)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((S,N)=>{let G=S/g*m,J=N*v+(v-x)/2,F=p+m-G,U=N===e,et=S<1?"var(--success-color, #4caf50)":S>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return it`
            <rect x="${$(J)}" y="${$(F)}"
              width="${$(x)}" height="${$(G)}"
              fill="${et}" opacity="${U?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${Ye.map((S,N)=>l`<span class="seasonal-label ${N===e?"active-month":""}">${s(S,a)}</span>`)}
      </div>
    </div>
  `}var T=class extends w{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._toastTimer=new It;this._access=$t;this._currencySymbol="";this._loadSeq=0}get _lang(){return R(this.hass)}async openFor(t,i){(t!==this._entryId||i!==this._taskId)&&(this._task=null),this._entryId=t,this._taskId=i,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=Ht(new Date),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let t=await K(this.hass);this._features={...this._features,...t.features},this._access=t.access,this._currencySymbol=ht(t.budget??void 0),te(t.budget??void 0)}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(t,i){this._toast=t,this._toastTimer.schedule(()=>{this._toast=""},i)}async _loadTask(){let t=this._entryId,i=this._taskId;if(!t||!i)return;let e=++this._loadSeq,r="",o=await C(this,{type:"maintenance_supporter/object",entry_id:t},{onError:u=>{r=u}});if(e!==this._loadSeq)return;if(o===void 0){this._error=r;return}this._objectName=o?.object?.name||"";let p=(o?.tasks||[]).find(u=>u.id===i);this._task=p??null,this._taskRef=je(o?.object,p),p||(this._error=s("ws_err_not_found",this._lang))}_runWs(t){return this._error="",C(this,t,{busy:i=>{this._busy=i},onError:i=>{this._error=i}})}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||import("./dialog-mount-ATBKNLQV.js").then(async({openCompleteDialog:t})=>{let i=this._task,e=[];try{e=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}t(Me({entryId:this._entryId,taskId:this._taskId,taskName:i.name,task:i,objects:e,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol}))&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})!==void 0&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})!==void 0&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||import("./dialog-mount-ATBKNLQV.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("./dialog-mount-ATBKNLQV.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId||!await Z(this.hass,{title:s("delete",this._lang),message:s("delete_task_confirm",this._lang),confirmText:s("delete",this._lang),danger:!0}))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})!==void 0&&(this._showToast(s("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!this._entryId||!this._taskId)return;let t=await this._runWs({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});t!==void 0&&(this._showToast(t?.recommended_interval?`${s("reanalyze_result",this._lang)}: ${se(t.recommended_interval,"days",this._lang)} (${t.data_points} pts)`:s("reanalyze_insufficient_data",this._lang)),await this._loadTask())}_onEditHistoryEntry(t){if(!this._entryId||!this._taskId)return;let i=Xt(this._entryId,this._taskId,t,this._task);import("./dialog-mount-ATBKNLQV.js").then(({openHistoryEditDialog:e})=>e(i))}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return h;let i=this._lang;return l`
      <div class="recommendation-card">
        <h4>${s("suggested_interval",i)}</h4>
        ${Ke(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",i)}
        <div class="recommendation-actions">
          ${nt(this.hass?.user,this._access)?l`<button class="btn primary qa-apply-suggestion"
                @click=${this._applySuggestion} ?disabled=${this._busy}>
                <ha-icon icon="mdi:check"></ha-icon>
                ${s("apply_suggestion",i)}
              </button>`:h}
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${s("reanalyze",i)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(t){let i=this._lang,e=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,r=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,o=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,p=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!e&&!r&&!o&&!p?l`<div class="adaptive-empty">
        ${s("adaptive_no_data",i)}
      </div>`:l`
      <div class="adaptive-stack">
        ${this._toast?l`<div class="toast">${this._toast}</div>`:h}
        ${e?this._renderRecommendation(t):h}
        ${r?Qe(t,i,this._features):h}
        ${o?Ge(t,i):h}
        ${p?l`
          ${Je(t,i,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?Ze(t,i):h}
        `:h}
      </div>
    `}_renderDetails(t){let i=this._lang,e=t.history||[],r=t.history_count??e.length,o=Be(e).slice(0,20);return l`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${s("times_performed",i)}</span>
            <span class="stat-value">${t.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("total_cost",i)}</span>
            <span class="stat-value">${st(t.total_cost??0,this._currencySymbol,i)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("avg_duration",i)}</span>
            <span class="stat-value">${bt(t.average_duration!=null?Math.round(t.average_duration):null,i)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${s("history",i)}</strong>
          <span class="history-count">${r}</span>
        </div>
        ${e.length===0?l`<div class="history-empty">${s("history_empty",i)}</div>`:l`
              <div class="history-list">
                ${o.map(p=>Ve(p,{lang:i,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:nt(this.hass?.user,this._access)?u=>this._onEditHistoryEntry(u):void 0,readingUnit:t.reading_unit,readingSlotDelta:(u,m)=>Yt(e,u,m),taskRef:this._taskRef},{compact:!0}))}
                ${r>o.length?l`<div class="history-more">… +${r-o.length} ${s("older_entries",i)}</div>`:h}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return h;let t=this._lang,i=this._task,e=nt(this.hass?.user,this._access);return ct(()=>this.close(),l`
        ${i?l`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${Tt(i)}"></span>
                  <span class="task-name">${i.name}</span>
                  ${We(i,t)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("./dialog-mount-ATBKNLQV.js").then(({openObjectQuickActions:r})=>{r(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${i.next_due?l`<span><strong>${s("next_due",t)}:</strong> ${z(i.next_due,t)}</span>`:h}
                  ${i.last_performed?l`<span><strong>${s("last_performed",t)}:</strong> ${z(i.last_performed,t)}</span>`:h}
                  ${i.schedule?.kind&&!["manual","one_time"].includes(i.schedule.kind)||i.interval_days!=null?l`<span><strong>${s("interval",t)}:</strong> ${ne(i,t)}</span>`:h}
                  ${gt(i)?l`<span><strong>${s("phase_current",t)}:</strong> ${gt(i)}</span>`:h}
                </div>
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:h}

              ${this._showSkip?l`
                    <div class="inline-form">
                      <label>${s("skip_reason",t)}</label>
                      <input type="text" .value=${this._skipReason}
                        @input=${r=>{this._skipReason=r.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${s("cancel",t)}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${s("skip",t)}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?l`
                    <div class="inline-form">
                      <label>${s("reset_to_date",t)}</label>
                      <ms-date-field
                        kind="date"
                        .hass=${this.hass}
                        .lang=${t}
                        .value=${this._resetDate}
                        @value-changed=${r=>{this._resetDate=r.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${s("cancel",t)}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${s("reset",t)}
                        </button>
                      </div>
                    </div>
                  `:l`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${this._onComplete} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${s("complete",t)}
                      </ha-button>
                      ${i.allow_skip!==!1?l`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${s("skip",t)}
                            </ha-button>
                          `:h}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${s("reset",t)}
                      </ha-button>
                    </div>
                    <!-- QR is read tier (the panel offers it to operators too);
                         Edit / Archive / Delete follow canWrite() — the panel's
                         operator delegation, not is_admin alone. -->
                    <div class="actions secondary-row">
                      ${e?l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-edit" @click=${this._onEdit} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                            ${s("edit",t)}
                          </ha-button>`:h}
                      <ha-button size="small" appearance="outlined" variant="neutral" class="qa-qr" @click=${this._onQr} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                        ${s("qr_code",t)}
                      </ha-button>
                      ${e?l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-archive"
                            @click=${i.archived?this._onUnarchive:this._onArchive}
                            .disabled=${this._busy}>
                            <ha-icon slot="start" icon="${i.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                            ${i.archived?s("unarchive",t):s("archive",t)}
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="danger" class="danger qa-delete" @click=${this._onDelete} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                            ${s("delete",t)}
                          </ha-button>`:h}
                    </div>
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?s("hide_details",t):s("show_details",t)}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?l`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?s("hide_stats",t):s("show_stats",t)}
                          </button>`:h}
                    </div>
                    ${this._showDetails?this._renderDetails(i):h}
                    ${this._showAdaptive?this._renderAdaptive(i):h}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${s("open_in_panel",t)}
                      </button>
                    </div>
                  `}
            `:this._error?l`<div class="error">${this._error}</div>`:l`<div class="loading">${s("loading",t)}</div>`}
    `)}updated(t){t.has("_open")&&this._open&&pt(this.shadowRoot)}};T.styles=[le,dt,k`
    :host { display: contents; --ms-modal-max-width: 460px; }
    .header { display: flex; flex-direction: column; gap: 6px; }
    .title { display: flex; align-items: center; gap: 10px; }
    .status-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
    .task-name { font-size: 18px; font-weight: 600; }
    .object { font-size: 13px; color: var(--secondary-text-color); }
    .link-inline {
      background: transparent; border: none; padding: 0; cursor: pointer;
      color: var(--primary-color); font-size: inherit; font-family: inherit;
    }
    .link-inline:hover { text-decoration: underline; }
    .quick-info {
      display: flex; flex-wrap: wrap; gap: 12px;
      font-size: 12px; color: var(--secondary-text-color);
      padding-top: 4px; border-top: 1px solid var(--divider-color);
    }
    .quick-info strong { color: var(--primary-text-color); font-weight: 500; }
    .actions { display: flex; gap: 8px; }
    .actions.primary-row { gap: 6px; }
    .actions.primary-row .btn { flex: 1; }
    .actions.primary-row ha-button { flex: 1; }
    /* Edit + QR are admin-tools — left-align as a group; Delete is destructive
       so it gets pushed to the far right with margin-left:auto for visual
       separation. Earlier this row was flex-end which left a strange empty
       gap on the left (user feedback). */
    .actions.secondary-row {
      padding-top: 8px; border-top: 1px solid var(--divider-color);
      justify-content: flex-start;
    }
    .actions.secondary-row .btn.danger,
    .actions.secondary-row ha-button.danger {
      margin-left: auto;
    }
    .actions.secondary-row ha-button { --ha-button-font-size: 13px; }
    .btn {
      padding: 8px 12px; font-size: 14px;
      border-radius: 6px; cursor: pointer;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color);
      font-weight: 500;
      display: inline-flex; align-items: center; gap: 6px;
      transition: background 0.12s;
    }
    .btn:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .btn[disabled] { opacity: 0.5; cursor: wait; }
    .btn.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, white);
      border-color: var(--primary-color);
    }
    .btn.cancel { background: transparent; }
    .btn.ghost { padding: 6px 10px; font-size: 13px; }
    .btn.danger { color: var(--error-color); }
    .btn ha-icon { --mdc-icon-size: 18px; }
    .inline-form { display: flex; flex-direction: column; gap: 8px; }
    .inline-form label { font-size: 13px; color: var(--secondary-text-color); }
    .inline-form input {
      padding: 8px; font-size: 14px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px;
    }
    .inline-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .footer { display: flex; justify-content: center; padding-top: 4px; }
    .link {
      background: transparent; border: none; cursor: pointer;
      color: var(--primary-color); font-size: 13px;
      display: inline-flex; align-items: center; gap: 4px;
    }
    .link:hover { text-decoration: underline; }
    .link ha-icon { --mdc-icon-size: 14px; }
    .loading { padding: 24px; text-align: center; color: var(--secondary-text-color); }
    .error {
      padding: 8px; border-radius: 6px;
      background: rgba(211,47,47,0.1);
      color: var(--error-color, #d32f2f); font-size: 13px;
    }

    /* Details (expandable Show details section) */
    .details-toggle { display: flex; justify-content: center; margin-top: 4px; }
    .details {
      display: flex; flex-direction: column; gap: 12px;
      border-top: 1px solid var(--divider-color);
      padding-top: 12px;
    }
    .stats-grid {
      display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;
    }
    .stat {
      display: flex; flex-direction: column; gap: 2px;
      background: var(--secondary-background-color, rgba(255,255,255,0.04));
      padding: 8px; border-radius: 6px;
      align-items: center;
    }
    .stat-label { font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { font-size: 16px; font-weight: 600; }
    .history-header {
      display: flex; align-items: baseline; gap: 8px;
      font-size: 14px;
    }
    .history-count {
      font-size: 12px; color: var(--secondary-text-color);
      background: var(--secondary-background-color); padding: 2px 8px; border-radius: 999px;
    }
    .history-empty { color: var(--secondary-text-color); font-style: italic; font-size: 13px; }
    /* The rows themselves are the shared renderer's (.history-entry.compact
       + the history-* classes from sharedStyles); only the list chrome is
       local. */
    .history-list { display: flex; flex-direction: column; max-height: 280px; overflow: auto; }
    .history-list .history-entry {
      padding: 6px 8px; border-radius: 6px; border-bottom: none; margin-bottom: 6px;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
    }
    .history-list .history-date { font-size: 11px; }
    .history-list .history-details { font-size: 11px; }
    .history-more { padding: 8px; text-align: center; font-size: 12px; color: var(--secondary-text-color); font-style: italic; }

    /* Adaptive section — wraps the panel renderers (which assume sharedStyles
       are present) and adds dialog-specific layout. */
    .adaptive-stack {
      display: flex; flex-direction: column; gap: 12px;
      border-top: 1px solid var(--divider-color);
      padding-top: 12px;
    }
    .adaptive-empty {
      padding: 16px; text-align: center;
      color: var(--secondary-text-color);
      font-style: italic; font-size: 13px;
      border-top: 1px solid var(--divider-color);
    }
    .toast {
      padding: 8px 12px; border-radius: 6px;
      background: rgba(76, 175, 80, 0.15);
      color: #4caf50; font-size: 13px; font-weight: 500;
    }
    /* The panel's recommendation-card uses ha-button. We use plain <button>
       in this dialog's button styles. Re-style the action row to match. */
    .recommendation-actions {
      display: flex; gap: 8px; margin-top: 8px;
    }
    /* Constrain SVG charts so they fit the dialog width even on mobile. */
    .weibull-section, .seasonal-card-compact { max-width: 100%; }
    .weibull-chart svg { max-width: 100%; height: auto; }
    .details-toggle { gap: 12px; flex-wrap: wrap; }
  `],d([f({attribute:!1})],T.prototype,"hass",2),d([c()],T.prototype,"_open",2),d([c()],T.prototype,"_entryId",2),d([c()],T.prototype,"_taskId",2),d([c()],T.prototype,"_task",2),d([c()],T.prototype,"_objectName",2),d([c()],T.prototype,"_taskRef",2),d([c()],T.prototype,"_busy",2),d([c()],T.prototype,"_error",2),d([c()],T.prototype,"_showSkip",2),d([c()],T.prototype,"_showReset",2),d([c()],T.prototype,"_showDetails",2),d([c()],T.prototype,"_showAdaptive",2),d([c()],T.prototype,"_skipReason",2),d([c()],T.prototype,"_resetDate",2),d([c()],T.prototype,"_features",2),d([c()],T.prototype,"_toast",2),d([c()],T.prototype,"_access",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",T);function Xe(n){return!!n&&/^https?:\/\//i.test(n)}function ti(n){return n?customElements.get("ha-markdown")?l`<ha-markdown class="notes-md" .content=${n} breaks></ha-markdown>`:l`${n}`:h}var M=class extends w{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=$t}get _lang(){return R(this.hass)}async openFor(t){this._entryId=t,this._error="",this._open=!0,await Promise.all([this._load(),K(this.hass).then(i=>{this._access=i.access})])}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(!this._entryId)return;let t=await C(this,{type:"maintenance_supporter/object",entry_id:this._entryId},{onError:i=>{this._error=i}});t!==void 0&&(this._data=t)}_runWs(t){return this._error="",C(this,t,{busy:i=>{this._busy=i},onError:i=>{this._error=i}})}_onEditObject(){!this._entryId||!this._data||import("./dialog-mount-ATBKNLQV.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("./dialog-mount-ATBKNLQV.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await Z(this.hass,{title:s("delete",this._lang),message:s("delete_object_confirm",this._lang),confirmText:s("delete",this._lang),danger:!0}))return;let i=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:i})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:i},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t&&!await Z(this.hass,{title:s("archive_object",this._lang),message:s("confirm_archive_object",this._lang),confirmText:s("archive_object",this._lang)}))return;let i=this._entryId;await this._runWs({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:i})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:i},bubbles:!0,composed:!0})),this.close())}_onTaskClick(t){this._entryId&&import("./dialog-mount-ATBKNLQV.js").then(({openTaskQuickActions:i})=>{i(this._entryId,t)})}render(){if(!this._open)return h;let t=this._lang,i=this._data,e=i?.object,r=i?.tasks||[],o=nt(this.hass?.user,this._access);return ct(()=>this.close(),l`
        ${i&&e?l`
              <div class="header">
                <div class="title">${e.name}</div>
                ${this._renderMetaRow(e)}
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:h}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${s("tasks",t)}</strong>
                  <span class="count">${r.length}</span>
                </div>
                ${r.length===0?l`<div class="empty">${s("no_tasks",t)}</div>`:l`
                      <div class="task-list">
                        ${r.map(p=>l`
                          <div class="task-row" @click=${()=>this._onTaskClick(p.id)}>
                            <span class="status-dot" style="background: ${Tt(p)}"></span>
                            <span class="task-name">${p.name}</span>
                            <span class="task-status ${ft(p)}">${Dt(ft(p),t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${e.notes?l`
                    <div class="notes-section">
                      <strong>${s("object_notes_label",t)}</strong>
                      <div class="notes-body">${ti(e.notes)}</div>
                    </div>
                  `:h}

              ${o?l`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${s("add_task",t)}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${s("edit",t)}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${e.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${e.archived?s("unarchive_object",t):s("archive_object",t)}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${s("delete",t)}
                      </button>
                    </div>
                  `:h}
            `:l`<div class="loading">${s("loading",t)}</div>`}
    `)}updated(t){t.has("_open")&&this._open&&pt(this.shadowRoot)}_renderMetaRow(t){let i=this._lang,e=[];return t.area_id&&e.push([s("area",i),t.area_id]),t.manufacturer&&e.push([s("manufacturer",i),t.manufacturer]),t.model&&e.push([s("model",i),t.model]),t.serial_number&&e.push([s("serial_number_label",i),t.serial_number]),t.installation_date&&e.push([s("installed",i),t.installation_date]),t.warranty_expiry&&e.push([s("warranty",i),t.warranty_expiry]),t.documentation_url&&e.push([s("documentation_url_label",i),t.documentation_url]),e.length===0?h:l`
      <div class="meta">
        ${e.map(([r,o])=>l`
            <div class="meta-item">
              <span class="meta-label">${r}</span>
              <span class="meta-value">${Xe(o)?l`<a href="${o}" target="_blank" rel="noopener noreferrer">${o}</a>`:o}</span>
            </div>
          `)}
      </div>
    `}};M.styles=[dt,k`
    :host { display: contents; }
    .header { display: flex; flex-direction: column; gap: 6px; }
    .title { font-size: 20px; font-weight: 600; }
    .meta { display: flex; flex-direction: column; gap: 4px; padding-top: 4px; border-top: 1px solid var(--divider-color); }
    .meta-item { display: flex; gap: 8px; font-size: 12px; }
    .meta-label { color: var(--secondary-text-color); min-width: 100px; }
    .meta-value { color: var(--primary-text-color); flex: 1; word-break: break-word; }
    .meta-value a { color: var(--primary-color); }
    .tasks-section, .notes-section { display: flex; flex-direction: column; gap: 6px; }
    .section-header { display: flex; align-items: baseline; gap: 8px; }
    .count {
      font-size: 11px; color: var(--secondary-text-color);
      background: var(--secondary-background-color); padding: 2px 8px; border-radius: 999px;
    }
    .empty { color: var(--secondary-text-color); font-style: italic; font-size: 13px; padding: 8px 0; }
    .task-list { display: flex; flex-direction: column; gap: 4px; max-height: 200px; overflow: auto; }
    .task-row {
      display: flex; align-items: center; gap: 10px;
      padding: 8px; border-radius: 6px; cursor: pointer;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
      transition: background 0.12s;
    }
    .task-row:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .task-name { flex: 1; font-size: 14px; }
    .task-status { font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; }
    .notes-body { white-space: pre-wrap; font-size: 13px; padding: 8px; background: var(--secondary-background-color); border-radius: 6px; }
    .notes-body ha-markdown { white-space: normal; }
    .actions { display: flex; gap: 8px; padding-top: 8px; border-top: 1px solid var(--divider-color); }
    .actions .btn { flex: 1; }
    .btn {
      padding: 8px; font-size: 13px; border-radius: 6px; cursor: pointer;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color); font-weight: 500;
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    }
    .btn:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .btn[disabled] { opacity: 0.5; cursor: wait; }
    .btn.primary { background: var(--primary-color); color: var(--text-primary-color, white); border-color: var(--primary-color); }
    .btn.danger { color: var(--error-color); }
    .btn ha-icon { --mdc-icon-size: 16px; }
    .loading { padding: 24px; text-align: center; color: var(--secondary-text-color); }
    .error { padding: 8px; border-radius: 6px; background: rgba(211,47,47,0.1); color: var(--error-color); font-size: 13px; }
  `],d([f({attribute:!1})],M.prototype,"hass",2),d([c()],M.prototype,"_open",2),d([c()],M.prototype,"_entryId",2),d([c()],M.prototype,"_data",2),d([c()],M.prototype,"_busy",2),d([c()],M.prototype,"_error",2),d([c()],M.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",M);var ei="maintenance-object-dialog",ii="maintenance-task-dialog",Ji="maintenance-history-edit-dialog",Zi="maintenance-complete-dialog",Xi="maintenance-qr-dialog",ts="maintenance-task-quick-actions-dialog",es="maintenance-object-quick-actions-dialog";function St(){return document.querySelector("home-assistant")?.hass}function is(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function V(n){let a=is(),t=a.querySelector(n)??document.body.querySelector(n);return t?t.parentNode!==a&&a.appendChild(t):(t=document.createElement(n),a.appendChild(t)),t}function W(n){let a=St();if(!a)return!1;n.hass=a;let t=R(a);return zt(t)||Bt(t).then(()=>{n.requestUpdate?.()}),ee(a.locale,a.config?.country),!0}function Za(n){return K(n).then(a=>a.rowActionStyle)}function Xa(){pe()}function to(){let n=V(ei);return W(n)?(n.openCreate(),!0):!1}function eo(n,a){let t=V(ei);return W(t)?(t.openEdit(n,a),!0):!1}function io(n="",a){let t=V(ii);if(!W(t))return!1;let i=St();return i?((async()=>{let e=await K(i),r=t;si(r,e),r.openCreate(n,a)})(),!0):!1}function si(n,a){n.checklistsEnabled=a.features.checklists,n.scheduleTimeEnabled=a.features.schedule_time,n.completionActionsEnabled=a.features.completion_actions,n.adaptiveFeature=a.features.adaptive,n.seasonalFeature=a.features.seasonal,n.environmentalFeature=a.features.environmental,n.defaultWarningDays=a.defaultWarningDays}function so(n,a){let t=V(ii);if(!W(t))return!1;let i=St();return i?((async()=>{try{let[e,r]=await Promise.all([i.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:n}),K(i)]),o=(e.tasks||[]).find(u=>u.id===a);if(!o){console.warn(`openEditTaskDialog: task ${a} not found in entry ${n}`);return}let p=t;si(p,r),await p.openEdit(n,o)}catch(e){console.warn("openEditTaskDialog: failed to load task/features",e)}})(),!0):!1}function ro(n){let a=V(Ji);return W(a)?(a.openEdit(n),!0):!1}function no(n){let a=V(Zi);return W(a)?(Fe(a,n,R(St())),!0):!1}function ao(n){let a=V(Xi);return W(a)?(a.openForTask(n.entry_id,n.task_id,n.object_name,n.task_name),!0):!1}function oo(n,a){let t=V(ts);return W(t)?(t.openFor(n,a),!0):!1}function lo(n){let a=V(es);return W(a)?(a.openFor(n),!0):!1}export{Xa as __resetSettingsCacheForTests,Za as getRowActionStyle,no as openCompleteDialog,to as openCreateObjectDialog,io as openCreateTaskDialog,eo as openEditObjectDialog,so as openEditTaskDialog,ro as openHistoryEditDialog,lo as openObjectQuickActions,ao as openQrDialog,oo as openTaskQuickActions};
