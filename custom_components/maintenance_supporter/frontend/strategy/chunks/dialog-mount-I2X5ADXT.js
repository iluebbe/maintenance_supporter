/*! maintenance_supporter frontend 2.85.0 */
import{a as ke,b as we,c as Ee,d as Ie,e as Se,f as Te,g as Ae,h as Ce,i as Pe}from"./chunk-VKJWEIZ5.js";import"./chunk-Y6ZR5CLQ.js";import{A as Ue,B as T,a as w,b as a,c as Z,d as p,e as E,f as v,g as c,h as te,i as s,k as P,l as Le,m as Re,n as qe,o as He,p as A,q as J,r as G,s as Ne,t as Me,u as ne,v as he,w as Oe,x as De,y as Fe,z as je}from"./chunk-XHGRRS4A.js";import{a as l,b as re,c as xe}from"./chunk-6OLEWH2E.js";var C=class extends E{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1;this.multiline=!1;this.rows=3}_onInput(e){let i=e.target.value;this.value=i,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:i}}))}render(){return a`
      <label class="field">
        ${this.label?a`<span class="label">${this.label}${this.required?a`<span class="req">*</span>`:p}</span>`:p}
        ${this.multiline?a`
        <textarea
          .value=${this.value??""}
          rows=${this.rows}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          @input=${this._onInput}
          @change=${this._onInput}
        ></textarea>`:a`
        <input
          .value=${this.value??""}
          .type=${this.type}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          step=${this.step??p}
          min=${this.min??p}
          max=${this.max??p}
          pattern=${this.pattern??p}
          @input=${this._onInput}
          @change=${this._onInput}
        />`}
        ${this.helper?a`<span class="helper">${this.helper}</span>`:p}
      </label>
    `}};C.styles=w`
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
  `,l([v()],C.prototype,"label",2),l([v()],C.prototype,"value",2),l([v()],C.prototype,"placeholder",2),l([v()],C.prototype,"type",2),l([v({type:Boolean})],C.prototype,"required",2),l([v({type:Boolean})],C.prototype,"disabled",2),l([v()],C.prototype,"step",2),l([v()],C.prototype,"min",2),l([v()],C.prototype,"max",2),l([v()],C.prototype,"pattern",2),l([v()],C.prototype,"helper",2),l([v({type:Boolean})],C.prototype,"multiline",2),l([v({type:Number})],C.prototype,"rows",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",C);var I=class extends E{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._entryId=null}get _lang(){return P(this.hass)}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId="",this._error="",this._open=!0}openEdit(e,i){this._entryId=e,this._name=i.name||"",this._manufacturer=i.manufacturer||"",this._model=i.model||"",this._serialNumber=i.serial_number||"",this._areaId=i.area_id||"",this._installationDate=i.installation_date||"",this._warrantyExpiry=i.warranty_expiry||"",this._documentationUrl=i.documentation_url||"",this._notes=i.notes||"",this._haDeviceId=i.ha_device_id||"",this._parentEntryId=i.parent_entry_id||"",this._error="",this._open=!0}async _save(){if(!this._loading&&this._name.trim()){this._loading=!0,this._error="";try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}catch(e){this._error=T(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_parentChoices(){return(this.objects||[]).filter(e=>e.entry_id!==this._entryId)}_close(){this._open=!1}render(){if(!this._open)return a``;let e=this._lang,i=this._entryId?s("edit_object",e):s("new_object",e);return a`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i}</div>
        <div class="content">
          ${this._error?a`<div class="error">${this._error}</div>`:p}
          <ms-textfield
            label="${s("name",e)}"
            required
            .value=${this._name}
            @input=${t=>this._name=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("manufacturer_optional",e)}"
            .value=${this._manufacturer}
            @input=${t=>this._manufacturer=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("model_optional",e)}"
            .value=${this._model}
            @input=${t=>this._model=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("serial_number_optional",e)}"
            .value=${this._serialNumber}
            @input=${t=>this._serialNumber=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("documentation_url_optional",e)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${t=>this._documentationUrl=t.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${s("area_id_optional",e)}"
            .value=${this._areaId}
            @value-changed=${t=>this._areaId=t.detail.value||""}
          ></ha-area-picker>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${s("installation_date_optional",e)}"
            .value=${this._installationDate}
            @value-changed=${t=>this._installationDate=t.detail.value}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${s("warranty_expiry_optional",e)}"
            .value=${this._warrantyExpiry}
            @value-changed=${t=>this._warrantyExpiry=t.detail.value}
          ></ms-date-field>
          <ha-form
            .hass=${this.hass}
            .data=${{device:this._haDeviceId||void 0}}
            .schema=${[{name:"device",selector:{device:{}}}]}
            .computeLabel=${()=>s("link_device_optional",e)}
            @value-changed=${t=>this._haDeviceId=t.detail.value?.device||""}
          ></ha-form>
          ${this._parentChoices().length?a`<label class="textarea-field">
                <span class="textarea-label">${s("parent_object_optional",e)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${t=>this._parentEntryId=t.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${s("parent_none",e)}
                  </option>
                  ${this._parentChoices().map(t=>a`<option
                      value=${t.entry_id}
                      ?selected=${this._parentEntryId===t.entry_id}
                    >${t.object.name}</option>`)}
                </select>
              </label>`:p}
          <label class="textarea-field">
            <span class="textarea-label">${s("object_notes_optional",e)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${t=>this._notes=t.target.value}
            ></textarea>
            <span class="md-hint">${s("notes_markdown_hint",e)}</span>
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
    `}};I.styles=w`
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
  `,l([v({attribute:!1})],I.prototype,"hass",2),l([v({attribute:!1})],I.prototype,"objects",2),l([c()],I.prototype,"_open",2),l([c()],I.prototype,"_loading",2),l([c()],I.prototype,"_error",2),l([c()],I.prototype,"_name",2),l([c()],I.prototype,"_manufacturer",2),l([c()],I.prototype,"_model",2),l([c()],I.prototype,"_serialNumber",2),l([c()],I.prototype,"_areaId",2),l([c()],I.prototype,"_installationDate",2),l([c()],I.prototype,"_warrantyExpiry",2),l([c()],I.prototype,"_documentationUrl",2),l([c()],I.prototype,"_notes",2),l([c()],I.prototype,"_haDeviceId",2),l([c()],I.prototype,"_parentEntryId",2),l([c()],I.prototype,"_entryId",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",I);var ze=["#c62828","#ad1457","#6a1b9a","#4527a0","#283593","#1565c0","#00838f","#2e7d32","#558b2f","#ef6c00","#6d4c41","#546e7a"];function Ct(r){let o=(r||"").split(/\s+/).filter(Boolean);return o.length===0?"?":o.length===1?o[0][0].toUpperCase():(o[0][0]+o[o.length-1][0]).toUpperCase()}function Pt(r){let o=0;for(let e of r)o=o*31+e.charCodeAt(0)>>>0;return ze[o%ze.length]}function Ve(r){return r?{id:r.id,name:r.name,initials:r.initials||Ct(r.name),color:r.color||Pt(r.id)}:null}var ae=class{constructor(o){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=o}updateHass(o){this.hass=o}async getUsers(o=!1){let e=Date.now();if(!o&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=i.users,this.cacheTimestamp=e,this.usersCache}catch(i){return console.error("Failed to fetch users:",i),this.usersCache||[]}}async assignUser(o,e,i){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:o,task_id:e,user_id:i})}async getTasksByUser(o){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:o})).tasks}getUserName(o){return!o||!this.usersCache?null:this.usersCache.find(i=>i.id===o)?.name||null}getPerson(o){return Ve(this.getUser(o))}getUser(o){return!o||!this.usersCache?null:this.usersCache.find(e=>e.id===o)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(o){return o?o===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}};function D(r){return`${r.entry_id??""}\0${r.part_id}`}function Be(r,o,e,i){let t=!!r.entry_id&&r.entry_id!==o,n=t?r.entry_id:o,d=e.find(g=>g.entry_id===n),_=(d?.parts||[]).find(g=>g.id===r.part_id)||null,u=t&&d?.object?.name||"",h=_?.name||s("shared_part_unknown",i);return{part:_,foreign:t,ownerName:u,label:u?`${h} (${u})`:h}}function We(r,o,e,i){let{part:t,label:n}=Be(r,o,e,i),d=t&&t.stock!==null&&t.stock!==void 0?` (${t.stock}${t.unit?" "+t.unit:""})`:"",_=t?.storage_location?` \u2014 ${t.storage_location}`:"";return`${r.quantity}\xD7 ${n}${d}${_}`}function Ke(r,o,e,i){let n=(e.find(_=>_.entry_id===o)?.parts||[]).map(_=>({..._})),d=new Set(n.map(_=>D({part_id:_.id})));for(let _ of r?.consumes_parts||[]){if(!_.entry_id||_.entry_id===o)continue;let u=D(_);if(d.has(u))continue;d.add(u);let{part:h,ownerName:g}=Be(_,o,e,i);n.push({id:_.part_id,name:h?.name||s("shared_part_unknown",i),unit:h?.unit,stock:h?.stock??null,storage_location:h?.storage_location,entry_id:_.entry_id,owner_name:g})}return n}var ue=["sensor","binary_sensor","number","input_number","input_boolean","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock"],Ye=["sensor"],Ge=["temperature","humidity","pressure"];async function _e(r,o,e={}){e.busy?.(!0);try{return await r.hass.connection.sendMessagePromise(o)}catch(i){let t=P(r.hass);e.onError?.(T(i,t,e.fallbackKey?s(e.fallbackKey,t):void 0));return}finally{e.busy?.(!1)}}var me=["notes","cost","duration","photo","user"],ie={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"};var Rt=["cleaning","inspection","replacement","calibration","service","reading","custom"],qt=["low","normal","high"],Ht=["time_based","weekdays","nth_weekday","day_of_month","sensor_based","one_time","manual"],oe=["weekdays","nth_weekday","day_of_month"],Qe=["time_based","one_time",...oe],Ze=["threshold","counter","state_change","runtime"],Nt=[...Ze,"compound"],U={alpha:"0.3",min:"7",max:"365"};function Mt(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",carry:{}}}var Ot=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states"]);function Dt(r){return{entityIds:(r.entity_ids||(r.entity_id?[r.entity_id]:[])).join(", "),type:r.type||"threshold",attribute:r.attribute||"",above:r.trigger_above?.toString()??"",below:r.trigger_below?.toString()??"",equals:r.trigger_equals?.toString()??"",notEquals:r.trigger_not_equals?.toString()??"",forMinutes:r.trigger_for_minutes?.toString()??"0",targetValue:r.trigger_target_value?.toString()??"",deltaMode:r.trigger_delta_mode||!1,fromState:r.trigger_from_state||"",toState:r.trigger_to_state||"",targetChanges:r.trigger_target_changes?.toString()??"",runtimeHours:r.trigger_runtime_hours?.toString()??"",onStates:(r.trigger_on_states||[]).join(", "),carry:Object.fromEntries(Object.entries(r).filter(([e])=>!Ot.has(e)&&!e.startsWith("_")))}}function Ft(r){let o=r.entityIds.split(",").map(i=>i.trim()).filter(Boolean);if(o.length===0)return null;let e={...r.carry||{},entity_id:o[0],entity_ids:o,type:r.type};if(r.attribute&&(e.attribute=r.attribute),r.type==="threshold"){let i=parseFloat(r.above);isNaN(i)||(e.trigger_above=i);let t=parseFloat(r.below);isNaN(t)||(e.trigger_below=t);let n=parseFloat(r.equals);isNaN(n)||(e.trigger_equals=n);let d=parseFloat(r.notEquals);isNaN(d)||(e.trigger_not_equals=d);let _=parseInt(r.forMinutes,10);isNaN(_)||(e.trigger_for_minutes=_)}else if(r.type==="counter"){let i=parseFloat(r.targetValue);isNaN(i)||(e.trigger_target_value=i),e.trigger_delta_mode=r.deltaMode}else if(r.type==="state_change"){r.fromState&&(e.trigger_from_state=r.fromState),r.toState&&(e.trigger_to_state=r.toState);let i=parseInt(r.targetChanges,10);isNaN(i)||(e.trigger_target_changes=i)}else if(r.type==="runtime"){let i=parseFloat(r.runtimeHours);isNaN(i)||(e.trigger_runtime_hours=i);let t=(r.onStates||"").split(",").map(n=>n.trim()).filter(Boolean);t.length>0&&(e.trigger_on_states=t)}return e}function jt(r){return Array.from({length:7},(o,e)=>he(e,r,"short"))}function Ut(r){return Array.from({length:12},(o,e)=>Oe(e,r,"short"))}var m=class m extends E{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.defaultWarningDays=7;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._warning="";this._entryId="";this._taskId=null;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._priority="normal";this._labels="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._notifyEnabled=!0;this._readingUnit="";this._readings=[];this._consumesParts={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._scheduleTimeOn=!1;this._actionService="";this._actionTargetEntity="";this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=U.alpha;this._adaptiveMin=U.min;this._adaptiveMax=U.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return P(this.hass)}async openCreate(e,i){this._entryId=e,this._taskId=null,this._error="",this._warning="",!e&&i&&i.length>0?(this._objectChoices=i.map(t=>({entry_id:t.entry_id,name:t.object.name})).sort((t,n)=>t.name.localeCompare(n.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(e,i){this._entryId=e,this._taskId=i.id,this._error="",this._warning="",this._objectChoices=[],this._name=i.name,this._type=i.type,this._scheduleType=i.schedule_type,this._intervalDays=i.interval_days!=null?String(i.interval_days):"",this._intervalUnit=i.interval_unit||"days",this._dueDate=i.due_date||"";let t=i.schedule;this._weekdays=t?.kind==="weekdays"?[...t.weekdays??[]]:[],this._nth=t?.kind==="nth_weekday"?String(t.nth??1):"1",this._nthWeekday=t?.kind==="nth_weekday"?String(t.weekday??5):"5",this._domDay=t?.kind==="day_of_month"&&(t.day??1)>=1?String(t.day??1):"1",this._domLastDay=t?.kind==="day_of_month"&&t.day===-1,this._domBusiness=t?.kind==="day_of_month"&&t.business===!0,this._calOffset=t?.offset?String(t.offset):"0",this._seasonMonths=Array.isArray(t?.season_months)?[...t.season_months]:[];let n=t?.ends;n&&typeof n.count=="number"?(this._endsMode="count",this._endsCount=String(n.count),this._endsUntil=""):n&&typeof n.until=="string"?(this._endsMode="until",this._endsUntil=n.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=i.warning_days.toString(),this._earliestCompletionDays=i.earliest_completion_days!=null?String(i.earliest_completion_days):"",this._intervalAnchor=i.interval_anchor||"completion",this._notes=i.notes||"",this._documentationUrl=i.documentation_url||"",this._customIcon=i.custom_icon||"",this._priority=i.priority||"normal",this._labels=(i.labels||[]).join(", "),this._enabled=i.enabled!==!1,this._lastPerformed=i.last_performed||"",this._nfcTagId=i.nfc_tag_id||"",this._requireTagScan=!!i.require_tag_scan,this._allowSkip=i.allow_skip!==!1,this._notifyEnabled=i.notify_enabled!==!1,this._readingUnit=i.reading_unit||"",this._readings=(i.readings||[]).map(h=>({...h})),this._consumesParts=Object.fromEntries((i.consumes_parts||[]).map(h=>[D(h),{...h}])),this._responsibleUserId=i.responsible_user_id||null,this._assigneePool=[...i.assignee_pool||[]],this._rotationStrategy=i.rotation_strategy||"",this._checklistText=(i.checklist||[]).join(`
`),this._phaseDefs=Object.entries(i.phases||{}).map(([h,g])=>{let{name:f,checklist:x,consumes_parts:y,required_completion_fields:$,...H}=g,B=g.consumes_parts||[],Y=B.findIndex(j=>!j.entry_id),M=Y>=0?B[Y]:void 0;return{id:h,name:g.name||h,checklistText:(g.checklist||[]).join(`
`),partId:M?.part_id||"",partQty:M?.quantity!=null?String(M.quantity):"",reqOverride:g.required_completion_fields!==void 0,reqFields:[...g.required_completion_fields||[]],extraParts:B.filter((j,Q)=>Q!==Y).map(j=>({...j})),carry:H}}),this._phaseSeq=[...i.phase_sequence||[]],this._requiredCompletion=[...i.required_completion_fields||[]],this._scheduleTime=i.schedule_time||"",this._scheduleTimeOn=!!i.schedule_time;let d=i.on_complete_action;if(d&&d.service){this._actionService=d.service;let h=d.target?.entity_id;this._actionTargetEntity=Array.isArray(h)?h[0]||"":h||"",this._actionData=d.data&&typeof d.data=="object"?{...d.data}:{},this._actionDataJsonFallback=""}else this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="";let _=i.quick_complete_defaults;this._qcNotes=_?.notes||"",this._qcCost=_?.cost!=null?String(_.cost):"",this._qcDuration=_?.duration!=null?String(_.duration):"",this._qcFeedback=_?.feedback||"";let u=i.adaptive_config||{};if(this._environmentalEntity=u.environmental_entity||"",this._environmentalAttribute=u.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!u.enabled,this._adaptiveAlpha=u.ewa_alpha?.toString()??U.alpha,this._adaptiveMin=u.min_interval_days?.toString()??U.min,this._adaptiveMax=u.max_interval_days?.toString()??U.max,this._adaptiveSeasonal=u.seasonal_enabled!==!1,this._adaptivePrediction=u.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),i.trigger_config){let h=i.trigger_config;this._triggerEntityId=h.entity_id||h.entity_ids&&h.entity_ids[0]||"",this._triggerEntityIds=h.entity_ids||(h.entity_id?[h.entity_id]:[]),this._triggerEntityLogic=h.entity_logic||"any",this._triggerAttribute=h.attribute||"",this._triggerType=h.type||"threshold",this._triggerAbove=h.trigger_above?.toString()||"",this._triggerBelow=h.trigger_below?.toString()||"",this._triggerEquals=h.trigger_equals?.toString()||"",this._triggerNotEquals=h.trigger_not_equals?.toString()||"",this._triggerForMinutes=h.trigger_for_minutes?.toString()||"0",this._triggerCombinator=h.trigger_combinator==="all"?"all":"any",this._triggerTargetValue=h.trigger_target_value?.toString()||"",this._triggerDeltaMode=h.trigger_delta_mode||!1,this._triggerBaselineValue=h.trigger_baseline_value?.toString()||"",this._liveBaselineValue=i.trigger_baseline_value??null,this._autoCompleteOnRecovery=h.auto_complete_on_recovery||!1,this._triggerFromState=h.trigger_from_state||"",this._triggerToState=h.trigger_to_state||"",this._triggerTargetChanges=h.trigger_target_changes?.toString()||"",this._triggerRuntimeHours=h.trigger_runtime_hours?.toString()||"",this._triggerRuntimeMaxSession=h.trigger_runtime_max_session_seconds?.toString()||"",this._triggerOnStates=(h.trigger_on_states||[]).join(", "),h.type==="compound"?(this._compoundLogic=h.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(h.conditions||[]).map(Dt)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._priority="normal",this._labels="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._readingUnit="",this._readings=[],this._consumesParts={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._scheduleTimeOn=!1,this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=U.alpha,this._adaptiveMin=U.min,this._adaptiveMax=U.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="",this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._triggerAttribute="",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerEquals="",this._triggerNotEquals="",this._triggerForMinutes="0",this._triggerCombinator="any",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges="",this._triggerRuntimeHours="",this._triggerRuntimeMaxSession="",this._triggerOnStates="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new ae(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}_toggleAssignee(e){this._assigneePool=this._assigneePool.includes(e)?this._assigneePool.filter(i=>i!==e):[...this._assigneePool,e]}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError="Invalid service format (expected 'domain.service')",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[i,t]=e.split(".");if(!this.hass?.services?.[i]?.[t]){this._actionTestResult="error",this._actionTestError=`Service "${e}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let n=this._actionTargetEntity.trim();if(n){let d=n.split(".")[0];if(d!==i&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(i)){this._actionTestResult="error",this._actionTestError=`Service "${e}" only works on ${i}.* entities; entity "${n}" is in ${d}.* \u2014 pick a service that matches the entity domain (e.g. ${d}.${t})`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[n]){this._actionTestResult="error",this._actionTestError=`Target entity "${n}" not found in Home Assistant \u2014 the entity may have been renamed or its integration removed.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[i,t]=e.split("."),n=this.hass?.services?.[i]?.[t]?.fields;return!n||Object.keys(n).length===0?null:Object.entries(n).map(([d,_])=>({name:d,required:!!_.required,selector:_.selector||{text:{}}}))}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled)return p;let i=this._serviceSchema();return a`
      <details class="ca-section">
        <summary>${s("on_complete_action_title",e)}</summary>
        <p class="field-help">${s("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${t=>{this._actionService=t.detail.value||"";let n=this._serviceSchema();if(n){let d=new Set(n.map(_=>_.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([_])=>d.has(_)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>s("on_complete_action_target",e)}
          @value-changed=${t=>{let n=t.detail.value;this._actionTargetEntity=n.target_entity||""}}
        ></ha-form>
        <p class="field-help ca-domain-hint">
          ${s("on_complete_action_target_hint",e)}
        </p>
        ${i?a`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${i}
                .data=${this._actionData}
                @value-changed=${t=>{this._actionData={...t.detail.value}}}
              ></ha-form>
            `:a`
              <ms-textfield
                label="${s("on_complete_action_data",e)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${t=>{this._actionDataJsonFallback=t.target.value}}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting||!this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting?"\u2026":s("on_complete_action_test",e)}
          </button>
          ${this._actionTestResult==="ok"?a`<span class="ca-test-ok">${s("on_complete_action_test_success",e)}</span>`:p}
          ${this._actionTestResult==="error"?a`<div class="ca-test-error-block">
                <span class="ca-test-error">${s("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?a`<div class="ca-test-error-detail">${this._actionTestError}</div>`:p}
              </div>`:p}
        </div>
      </details>

      <details class="ca-section">
        <summary>${s("quick_complete_defaults_title",e)}</summary>
        <p class="field-help">${s("quick_complete_defaults_desc",e)}</p>
        <ms-textfield
          label="${s("quick_complete_defaults_notes",e)}"
          .value=${this._qcNotes}
          @input=${t=>{this._qcNotes=t.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${s("quick_complete_defaults_cost",e)}"
          type="number" min="0" step="0.01"
          .value=${this._qcCost}
          @input=${t=>{this._qcCost=t.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${s("quick_complete_defaults_duration",e)}"
          type="number" min="0" step="1"
          .value=${this._qcDuration}
          @input=${t=>{this._qcDuration=t.target.value}}
        ></ms-textfield>
        <select class="qc-feedback"
          .value=${this._qcFeedback}
          @change=${t=>{this._qcFeedback=t.target.value}}>
          <option value="">${s("quick_complete_defaults_feedback_none",e)}</option>
          <option value="needed">${s("quick_complete_defaults_feedback_needed",e)}</option>
          <option value="not_needed">${s("quick_complete_defaults_feedback_not_needed",e)}</option>
        </select>
      </details>
    `}async _loadParts(){if(this.parts=[],!!this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this.parts=e.parts||[],this._partsLoadFailed=!1}catch{this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){if(this._foreignOwners=[],!!this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._foreignOwners=(e.objects||[]).filter(i=>i.entry_id!==this._entryId&&(i.parts||[]).length>0).map(i=>({entry_id:i.entry_id,name:i.object?.name||i.entry_id,parts:i.parts||[]})).sort((i,t)=>i.name.localeCompare(t.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(e){!e||!this.hass||this._conditionAttrOptions[e]||this._conditionAttrPending.has(e)||(this._conditionAttrPending.add(e),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e}).then(i=>{let t=i;this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:t.suggested_attributes||[],available:t.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(e){if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});this._entityDomain=i.domain||"",this._suggestedAttributes=i.suggested_attributes||[],this._availableAttributes=i.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(e=>!!e.entry_id)}_renderConsumesRow(e,i){let t=D({part_id:e.id,entry_id:i}),n=this._consumesParts[t],d=i?{part_id:e.id,quantity:1,entry_id:i}:{part_id:e.id,quantity:1};return a`
      <div class="consumes-row">
        <label class="consumes-check">
          <input
            type="checkbox"
            .checked=${n!==void 0}
            @change=${_=>{let u={...this._consumesParts};_.target.checked?u[t]=u[t]||d:delete u[t],this._consumesParts=u}}
          />
          <span>${e.name}${e.unit?` (${e.unit})`:""}</span>
        </label>
        ${n!==void 0?a`<input
              class="consumes-qty"
              type="number"
              min="0.01"
              max="999"
              step="0.01"
              .value=${String(n.quantity)}
              @input=${_=>{let u=parseFloat(_.target.value);this._consumesParts={...this._consumesParts,[t]:{...d,quantity:Number.isFinite(u)&&u>=.01?u:1}}}}
            />`:p}
      </div>
    `}_toggleRequired(e,i){let t=new Set(this._requiredCompletion);i?t.add(e):t.delete(e),this._requiredCompletion=[...t]}_patchReading(e,i){this._readings=this._readings.map(t=>t.id===e?{...t,...i}:t)}_renderReadingsEditor(e){let i=Ae(this._readings);return a`
      <div class="readings-editor">
        <div class="field-label">${s("readings_section",e)}</div>
        <div class="field-help">${s("readings_hint",e)}</div>
        ${this._readings.map(t=>a`
          ${i.has(t.id)?a`<div class="field-help reading-dup">${s("reading_duplicate_name",e)}</div>`:p}
          <div class="reading-row">
            <ms-textfield
              class="reading-name"
              label="${s("reading_name_label",e)}"
              .value=${t.name}
              @input=${n=>this._patchReading(t.id,{name:n.target.value})}
            ></ms-textfield>
            <ms-textfield
              class="reading-unit"
              label="${s("reading_unit_short",e)}"
              .value=${t.unit||""}
              @input=${n=>this._patchReading(t.id,{unit:n.target.value})}
            ></ms-textfield>
            <mwc-icon-button class="phase-remove reading-remove" @click=${()=>this._readings=this._readings.filter(n=>n.id!==t.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </mwc-icon-button>
          </div>
        `)}
        ${this._readings.length<20?a`
          <ha-button appearance="plain" class="reading-add"
            @click=${()=>this._readings=[...this._readings,{id:we(),name:"",unit:this._readings.length?this._readings[this._readings.length-1].unit:this._readingUnit}]}>
            <ha-icon icon="mdi:plus"></ha-icon> ${s("reading_add",e)}
          </ha-button>`:p}
      </div>
    `}_phaseSlug(e){let i=e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",t=i,n=2;for(;this._phaseDefs.some(d=>d.id===t);)t=`${i}-${n++}`;return t}_addPhaseDef(){let e=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:e,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(e){this._phaseDefs=this._phaseDefs.filter(i=>i.id!==e),this._phaseSeq=this._phaseSeq.filter(i=>i!==e)}_patchPhaseDef(e,i){this._phaseDefs=this._phaseDefs.map(t=>t.id===e?{...t,...i}:t)}_renderPhasesEditor(e){let i=t=>this._phaseDefs.find(n=>n.id===t)?.name||t;return a`
      <h3>${s("phases_section",e)}</h3>
      <div class="field-help">${s("phases_hint",e)}</div>
      ${this._phaseDefs.map(t=>a`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${s("phase_name",e)}"
              .value=${t.name}
              @input=${n=>this._patchPhaseDef(t.id,{name:n.target.value})}
            ></ms-textfield>
            ${this.parts.length?a`
              <select
                class="phase-part"
                .value=${t.partId}
                @change=${n=>this._patchPhaseDef(t.id,{partId:n.target.value})}
              >
                <option value="">—</option>
                ${this.parts.map(n=>a`<option value=${n.id} ?selected=${n.id===t.partId}>${n.name}</option>`)}
              </select>
              ${t.partId?a`
                <input class="phase-qty" type="number" min="0.01" step="0.01" .value=${t.partQty||"1"}
                  @input=${n=>this._patchPhaseDef(t.id,{partQty:n.target.value})} />
              `:p}
            `:p}
            <mwc-icon-button class="phase-remove" @click=${()=>this._removePhaseDef(t.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </mwc-icon-button>
          </div>
          ${this.checklistsEnabled?a`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${s("checklist_placeholder",e)}"
              .value=${t.checklistText}
              @input=${n=>this._patchPhaseDef(t.id,{checklistText:n.target.value})}
            ></textarea>
          `:p}
          <label class="req-option phase-req-toggle">
            <input
              type="checkbox"
              .checked=${t.reqOverride}
              @change=${n=>this._patchPhaseDef(t.id,{reqOverride:n.target.checked})}
            />
            <span>${s("phase_require_override",e)}</span>
          </label>
          ${t.reqOverride?a`
            <div class="required-completion phase-req-fields">
              ${me.map(n=>a`
                <label class="req-option">
                  <input
                    type="checkbox"
                    .checked=${t.reqFields.includes(n)}
                    @change=${d=>{let _=d.target.checked,u=new Set(t.reqFields);_?u.add(n):u.delete(n),this._patchPhaseDef(t.id,{reqFields:[...u]})}}
                  />
                  <span>${s(ie[n],e)}</span>
                </label>
              `)}
            </div>
          `:p}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${s("phase_add",e)}
      </ha-button>
      ${this._phaseDefs.some(t=>t.name.trim())?a`
        <div class="phase-seq-label">${s("phase_sequence_label",e)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((t,n)=>a`
            <span class="phase-chip">
              ${n+1}. ${i(t)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((d,_)=>_!==n)}}>✕</button>
            </span>
          `)}
          <select
            class="phase-seq-add"
            .value=${""}
            @change=${t=>{let n=t.target.value;n&&(this._phaseSeq=[...this._phaseSeq,n]),t.target.value=""}}
          >
            <option value="">+ ${s("phase_sequence_add_step",e)}</option>
            ${this._phaseDefs.filter(t=>t.name.trim()).map(t=>a`<option value=${t.id}>${t.name}</option>`)}
          </select>
        </div>
      `:p}
    `}async _save(){if(!this._loading&&this._name.trim()){if(this._adaptiveSnapshot()!==this._adaptiveInitial){let e=parseInt(this._adaptiveMin,10),i=parseInt(this._adaptiveMax,10);if(!isNaN(e)&&!isNaN(i)&&e>i){this._error=`${s("adaptive_min_interval",this._lang)} > ${s("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=s("trigger_hint_overlap",this._lang);return}this._loading=!0,this._error="";try{let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},i=this._earliestCompletionDays.trim();e.earliest_completion_days=i===""?null:Math.max(0,parseInt(i,10)||0),this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):oe.includes(this._scheduleType)?(e.schedule={...this._buildSchedule(),...this._recurrenceExtras()},e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(e.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.priority=this._priority,e.labels=this._labels.split(",").map(u=>u.trim()).filter(Boolean),e.enabled=this._enabled,e.last_performed=this._lastPerformed||null,e.nfc_tag_id=this._nfcTagId||null,e.require_tag_scan=this._requireTagScan,e.allow_skip=this._allowSkip,e.notify_enabled=this._notifyEnabled,e.reading_unit=this._readingUnit.trim()||null,e.readings=Ce(this._readings);{let u={};for(let g of this._phaseDefs){if(!g.name.trim())continue;let f={...g.carry,name:g.name.trim()},x=g.checklistText.split(`
`).map($=>$.trim()).filter(Boolean);x.length&&(f.checklist=x);let y=[];if(g.partId){let $=parseFloat(g.partQty);y.push({part_id:g.partId,quantity:Number.isFinite($)&&$>0?$:1})}for(let $ of g.extraParts)y.push($.entry_id?{part_id:$.part_id,quantity:$.quantity,entry_id:$.entry_id}:{part_id:$.part_id,quantity:$.quantity});y.length&&(f.consumes_parts=y),g.reqOverride&&(f.required_completion_fields=[...g.reqFields]),u[g.id]=f}let h=this._phaseSeq.filter(g=>g in u);e.phases=Object.keys(u).length&&h.length?u:null,e.phase_sequence=e.phases?h:null}if((this.parts.length||this._foreignOwners.length)&&(e.consumes_parts=Object.values(this._consumesParts).map(u=>u.entry_id?{part_id:u.part_id,quantity:u.quantity,entry_id:u.entry_id}:{part_id:u.part_id,quantity:u.quantity})),e.responsible_user_id=this._responsibleUserId,e.assignee_pool=this._assigneePool,e.required_completion_fields=this._requiredCompletion,e.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let u=this._compoundConditions.map(Ft).filter(h=>h!==null);if(u.length>0){let h={type:"compound",compound_logic:this._compoundLogic,conditions:u};this._autoCompleteOnRecovery&&(h.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(h.trigger_combinator="all"),e.trigger_config=h}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let u=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],h={entity_id:u[0],entity_ids:u,type:this._triggerType};if(this._triggerAttribute&&(h.attribute=this._triggerAttribute),this._autoCompleteOnRecovery&&(h.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(h.trigger_combinator="all"),u.length>1&&(h.entity_logic=this._triggerEntityLogic),this._triggerType==="threshold"){if(this._triggerAbove){let g=parseFloat(this._triggerAbove);isNaN(g)||(h.trigger_above=g)}if(this._triggerBelow){let g=parseFloat(this._triggerBelow);isNaN(g)||(h.trigger_below=g)}if(this._triggerEquals){let g=parseFloat(this._triggerEquals);isNaN(g)||(h.trigger_equals=g)}if(this._triggerNotEquals){let g=parseFloat(this._triggerNotEquals);isNaN(g)||(h.trigger_not_equals=g)}if(this._triggerForMinutes){let g=parseInt(this._triggerForMinutes,10);isNaN(g)||(h.trigger_for_minutes=g)}}else if(this._triggerType==="counter"){if(this._triggerTargetValue){let g=parseFloat(this._triggerTargetValue);isNaN(g)||(h.trigger_target_value=g)}if(h.trigger_delta_mode=this._triggerDeltaMode,this._triggerDeltaMode&&this._triggerBaselineValue){let g=parseFloat(this._triggerBaselineValue);!isNaN(g)&&g>=0&&(h.trigger_baseline_value=g)}}else if(this._triggerType==="state_change"){if(this._triggerFromState&&(h.trigger_from_state=this._triggerFromState),this._triggerToState&&(h.trigger_to_state=this._triggerToState),this._triggerTargetChanges){let g=parseInt(this._triggerTargetChanges,10);isNaN(g)||(h.trigger_target_changes=g)}if(this._triggerForMinutes){let g=parseInt(this._triggerForMinutes,10);isNaN(g)||(h.trigger_for_minutes=g)}}else if(this._triggerType==="runtime"){if(this._triggerRuntimeHours){let f=parseFloat(this._triggerRuntimeHours);isNaN(f)||(h.trigger_runtime_hours=f)}if(this._triggerRuntimeMaxSession){let f=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(f)&&f>0&&(h.trigger_runtime_max_session_seconds=f)}let g=this._triggerOnStates.split(",").map(f=>f.trim()).filter(Boolean);g.length>0&&(h.trigger_on_states=g)}e.trigger_config=h}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&Qe.includes(this._scheduleType)){let u=this._scheduleTimeOn?this._scheduleTime.trim():"";e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(u)?u:null}if(this.checklistsEnabled){let u=this._checklistText.split(`
`).map(h=>h.trim()).filter(Boolean).slice(0,100);e.checklist=u.length?u:null}if(this.completionActionsEnabled){let u=this._actionService.trim();if(u&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(u)){let x={service:u},y=this._actionTargetEntity.trim();y&&(x.target={entity_id:y});let $=this._buildActionData();Object.keys($).length>0&&(x.data=$),e.on_complete_action=x}else e.on_complete_action=null;let h={};this._qcNotes.trim()&&(h.notes=this._qcNotes.trim());let g=parseFloat(this._qcCost);!isNaN(g)&&g>=0&&(h.cost=g);let f=parseInt(this._qcDuration,10);!isNaN(f)&&f>=0&&(h.duration=f),this._qcFeedback&&(h.feedback=this._qcFeedback),e.quick_complete_defaults=Object.keys(h).length?h:null}let t=await this.hass.connection.sendMessagePromise(e),n=this._taskId||t?.task_id,d=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;this._warning="";let _=u=>{this._warning=s("subsave_warning",this._lang).replace("{detail}",u)};if(n&&this._scheduleType==="sensor_based"&&d&&await _e(this,{type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:n,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null},{onError:_})!==void 0&&(this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute),n&&this._adaptiveSnapshot()!==this._adaptiveInitial){let u=parseFloat(this._adaptiveAlpha),h=parseInt(this._adaptiveMin,10),g=parseInt(this._adaptiveMax,10);await _e(this,{type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:n,enabled:this._adaptiveEnabled,...u>=.1&&u<=.9?{ewa_alpha:u}:{},...!isNaN(h)&&h>=1?{min_interval_days:h}:{},...!isNaN(g)&&g>=1?{max_interval_days:g}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction},{onError:_})!==void 0&&(this._adaptiveInitial=this._adaptiveSnapshot())}this._warning?n&&(this._taskId=n):this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}catch(e){this._error=T(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1,this._warning="",this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return p;let e=this._lang,i=this._triggerType==="compound";return a`
      <h3>${s("trigger_configuration",e)}</h3>
      <div class="select-row">
        <label>${s("trigger_type",e)}</label>
        <select
          .value=${this._triggerType}
          @change=${t=>this._triggerType=t.target.value}
        >
          ${Nt.map(t=>a`<option value=${t} ?selected=${t===this._triggerType}>${s(t,e)}</option>`)}
        </select>
      </div>
      ${i?this._renderCompoundEditor():a`
        ${this._entityPickerFallback?a`
          <ms-textfield
            label="${s("entity_id",e)} (${s("comma_separated",e)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${t=>{let d=t.target.value.split(",").map(_=>_.trim()).filter(Boolean);this._triggerEntityId=d[0]||"",this._triggerEntityIds=d,d[0]&&this._fetchEntityAttributes(d[0])}}
          ></ms-textfield>
        `:a`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:ue}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>s("entity_id",e)}
          @value-changed=${t=>{let n=(t.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=n[0]||"",this._triggerEntityIds=n,n[0]?this._fetchEntityAttributes(n[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?a`
          <div class="select-row">
            <label>${s("entity_logic",e)}</label>
            <select
              .value=${this._triggerEntityLogic}
              @change=${t=>this._triggerEntityLogic=t.target.value}
            >
              <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${s("entity_logic_any",e)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${s("entity_logic_all",e)}</option>
            </select>
          </div>
        `:p}
        ${this._renderAttributeSelect({label:s("attribute_optional",e),value:this._triggerAttribute,suggested:this._suggestedAttributes,available:this._availableAttributes,onSelect:t=>this._triggerAttribute=t})}
        ${this._renderTriggerTypeFields()}
        ${this._renderTriggerLiveHint()}
      `}
      <label>
        <input
          type="checkbox"
          .checked=${this._autoCompleteOnRecovery}
          @change=${t=>this._autoCompleteOnRecovery=t.target.checked}
        />
        ${s("auto_complete_on_recovery",e)}
      </label>
      <div class="field-help">${s("auto_complete_on_recovery_help",e)}</div>
      <ms-textfield
        label="${s("safety_interval",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${t=>this._intervalDays=t.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():p}
      ${this._intervalDays?a`
            <div class="select-row">
              <label>${s("trigger_combinator",e)}</label>
              <select
                @change=${t=>this._triggerCombinator=t.target.value}
              >
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${s("trigger_combinator_any",e)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${s("trigger_combinator_all",e)}</option>
              </select>
            </div>
          `:p}
    `}_patchCondition(e,i){this._compoundConditions=this._compoundConditions.map((t,n)=>n===e?{...t,...i}:t)}_addCondition(){this._compoundConditions=[...this._compoundConditions,Mt()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((i,t)=>t!==e)}_renderCompoundEditor(){let e=this._lang;return a`
      <div class="select-row">
        <label>${s("compound_logic",e)}</label>
        <select
          .value=${this._compoundLogic}
          @change=${i=>this._compoundLogic=i.target.value}
        >
          <option value="AND" ?selected=${this._compoundLogic==="AND"}>${s("compound_logic_and",e)}</option>
          <option value="OR" ?selected=${this._compoundLogic==="OR"}>${s("compound_logic_or",e)}</option>
        </select>
      </div>
      <div class="field-help">${s("compound_help",e)}</div>
      ${this._compoundConditions.length===0?a`<div class="field-help">${s("compound_no_conditions",e)}</div>`:this._compoundConditions.map((i,t)=>this._renderCondition(i,t))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${s("compound_add_condition",e)}
      </button>
    `}_renderCondition(e,i){let t=this._lang,n=i+1;return a`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${s("compound_condition",t)} ${n}</span>
          <button
            type="button"
            class="icon-btn"
            title="${s("compound_remove_condition",t)}"
            @click=${()=>this._removeCondition(i)}
          >✕</button>
        </div>
        ${this._entityPickerFallback?a`
          <ms-textfield
            label="${s("entity_id",t)} (${s("comma_separated",t)})"
            .value=${e.entityIds}
            @input=${d=>this._patchCondition(i,{entityIds:d.target.value})}
          ></ms-textfield>
        `:a`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:ue}}}]}
          .data=${{condition_entities:e.entityIds.split(",").map(d=>d.trim()).filter(Boolean)}}
          .computeLabel=${()=>s("entity_id",t)}
          @value-changed=${d=>{let _=(d.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(i,{entityIds:_.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(e,i)}
        <div class="select-row">
          <label>${s("trigger_type",t)}</label>
          <select
            .value=${e.type}
            @change=${d=>this._patchCondition(i,{type:d.target.value})}
          >
            ${Ze.map(d=>a`<option value=${d} ?selected=${d===e.type}>${s(d,t)}</option>`)}
          </select>
        </div>
        ${this._renderConditionTypeFields(e,i)}
      </div>
    `}_renderStateField(e){return this._entityPickerFallback||!e.entityId?a`
        <ms-textfield
          label=${e.label}
          .value=${e.value}
          @input=${i=>e.onInput(i.target.value)}
        ></ms-textfield>
      `:a`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId}}}]}
        .data=${{s:e.value}}
        .computeLabel=${()=>e.label}
        @value-changed=${i=>e.onInput((i.detail.value.s||"").trim())}
      ></ha-form>
    `}_renderOnStatesField(e){let i=this._lang;return this._entityPickerFallback||!e.entityId?a`
        <ms-textfield
          label="${s("runtime_on_states",i)}"
          placeholder="on"
          .value=${e.value}
          @input=${t=>e.onInput(t.target.value)}
        ></ms-textfield>
      `:a`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId,multiple:!0}}}]}
        .data=${{s:(e.value||"").split(",").map(t=>t.trim()).filter(Boolean)}}
        .computeLabel=${()=>s("runtime_on_states",i)}
        @value-changed=${t=>e.onInput((t.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(e){return this._scheduleType==="one_time"||this._scheduleType==="manual"?p:a`
      <details class="adaptive-section" ?open=${this._adaptiveEnabled}>
        <summary>${s("adaptive_section_title",e)}</summary>
        <label>
          <input
            type="checkbox"
            .checked=${this._adaptiveEnabled}
            @change=${i=>this._adaptiveEnabled=i.target.checked}
          />
          ${s("adaptive_enabled",e)}
        </label>
        ${this._adaptiveEnabled?a`
          <ms-textfield
            label="${s("adaptive_min_interval",e)}"
            type="number"
            min="1"
            .value=${this._adaptiveMin}
            @input=${i=>this._adaptiveMin=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("adaptive_max_interval",e)}"
            type="number"
            min="1"
            .value=${this._adaptiveMax}
            @input=${i=>this._adaptiveMax=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("adaptive_ewa_alpha",e)}"
            type="number"
            min="0.1"
            max="0.9"
            step="0.1"
            .value=${this._adaptiveAlpha}
            @input=${i=>this._adaptiveAlpha=i.target.value}
          ></ms-textfield>
          <label>
            <input
              type="checkbox"
              .checked=${this._adaptiveSeasonal}
              @change=${i=>this._adaptiveSeasonal=i.target.checked}
            />
            ${s("adaptive_seasonal_enabled",e)}
          </label>
          <label>
            <input
              type="checkbox"
              .checked=${this._adaptivePrediction}
              @change=${i=>this._adaptivePrediction=i.target.checked}
            />
            ${s("adaptive_prediction_enabled",e)}
          </label>
        `:p}
      </details>
    `}_renderAttributeSelect(e){let i=this._lang;return e.available.length>0?a`
        <div class="select-row">
          <label>${e.label}</label>
          <select
            .value=${e.value}
            @change=${t=>e.onSelect(t.target.value)}
          >
            <option value="" ?selected=${!e.value}>${s("use_entity_state",i)}</option>
            ${e.suggested.map(t=>a`<option value=${t} ?selected=${t===e.value}>${t} ★</option>`)}
            ${e.available.filter(t=>!e.suggested.includes(t.name)).map(t=>a`<option value=${t.name} ?selected=${t.name===e.value}>${t.name}${t.numeric?"":" (non-numeric)"}</option>`)}
          </select>
        </div>
      `:a`
      <ms-textfield
        label="${e.label}"
        .value=${e.value}
        @input=${t=>e.onSelect(t.target.value.trim())}
      ></ms-textfield>
    `}_renderEnvironmentalAttribute(e){this._fetchConditionAttributes(this._environmentalEntity);let i=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:s("environmental_attribute_optional",e),value:this._environmentalAttribute,suggested:i?.suggested??[],available:i?.available??[],onSelect:t=>this._environmentalAttribute=t})}_renderConditionAttribute(e,i){let t=e.entityIds.split(",")[0]?.trim()||"";t&&this._fetchConditionAttributes(t);let n=t?this._conditionAttrOptions[t]:void 0;return this._renderAttributeSelect({label:s("attribute_optional",this._lang),value:e.attribute,suggested:n?.suggested??[],available:n?.available??[],onSelect:d=>this._patchCondition(i,{attribute:d})})}_renderConditionTypeFields(e,i){let t=this._lang;if(e.type==="threshold")return a`
        <ms-textfield label="${s("trigger_above",t)}" type="number" .value=${e.above}
          @input=${n=>this._patchCondition(i,{above:n.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_below",t)}" type="number" .value=${e.below}
          @input=${n=>this._patchCondition(i,{below:n.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_equals",t)}" type="number" .value=${e.equals}
          @input=${n=>this._patchCondition(i,{equals:n.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_not_equals",t)}" type="number" .value=${e.notEquals}
          @input=${n=>this._patchCondition(i,{notEquals:n.target.value})}></ms-textfield>
        <ms-textfield label="${s("for_minutes",t)}" type="number" .value=${e.forMinutes}
          @input=${n=>this._patchCondition(i,{forMinutes:n.target.value})}></ms-textfield>
      `;if(e.type==="counter")return a`
        <ms-textfield label="${s("target_value",t)}" type="number" .value=${e.targetValue}
          @input=${n=>this._patchCondition(i,{targetValue:n.target.value})}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${e.deltaMode}
            @change=${n=>this._patchCondition(i,{deltaMode:n.target.checked})} />
          ${s("delta_mode",t)}
        </label>
      `;if(e.type==="state_change"){let n=e.entityIds.split(",")[0]?.trim()||"";return a`
        ${this._renderStateField({label:s("from_state_optional",t),value:e.fromState,entityId:n,onInput:d=>this._patchCondition(i,{fromState:d})})}
        ${this._renderStateField({label:s("to_state_optional",t),value:e.toState,entityId:n,onInput:d=>this._patchCondition(i,{toState:d})})}
        <ms-textfield label="${s("target_changes",t)}" type="number" .value=${e.targetChanges}
          @input=${d=>this._patchCondition(i,{targetChanges:d.target.value})}></ms-textfield>
      `}if(e.type==="runtime"){let n=e.entityIds.split(",")[0]?.trim()||"";return a`
        <ms-textfield label="${s("runtime_hours",t)}" type="number" .value=${e.runtimeHours}
          @input=${d=>this._patchCondition(i,{runtimeHours:d.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:e.onStates,entityId:n,onInput:d=>this._patchCondition(i,{onStates:d})})}
      `}return p}_renderUnitSelect(){let e=this._lang;return a`
      <div class="select-row">
        <label>${s("interval_unit",e)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${i=>this._intervalUnit=i.target.value}
        >
          ${["days","weeks","months","years"].map(i=>a`<option value=${i} ?selected=${i===this._intervalUnit}>${s("unit_"+i,e)}</option>`)}
        </select>
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(i=>i!==e):[...this._weekdays,e]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(oe.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let e=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!e||e<=0?null:{kind:"interval",every:e,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(e){super.updated?.(e),this._scheduleEntityPickerProbe();for(let i of e.keys())if(m._PREVIEW_RELEVANT.has(String(i))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let e=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),i=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!e||!i){this._pickerProbeStrikes=0;return}let t=(u,h,g=0)=>{if(!(!u||g>10)){(u.tagName?.toLowerCase()??"")==="ha-entity-picker"&&h.push(u);for(let f of[u.shadowRoot,u])if(f)for(let x of Array.from(f.children??[]))t(x,h,g+1)}},n=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],d=[];for(let u of n)t(u,d);let _=d.length===0||d.some(u=>u.offsetHeight===0);if(e.offsetHeight===0||_){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let e=this._open?this._previewScheduleDict():null;if(!e){this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let i=++this._previewSeq;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:e,...this._lastPerformed?{last_performed:this._lastPerformed}:{}});if(i!==this._previewSeq)return;this._schedulePreview=t.occurrences||[],this._schedulePreviewEnded=!!t.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return p;let e=this._lang,i=this.scheduleTimeEnabled&&this._scheduleTimeOn&&this._scheduleTime?` ${this._scheduleTime}`:"",t=this._schedulePreview.map((d,_)=>{let u=new Date(`${d}T12:00:00`).getDay();return`${he(u===0?6:u-1,e,"short")} ${G(d,e)}${_===0?i:""}`}).join(" \xB7 "),n=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?a`<div class="field-help">${s("schedule_preview_ontime",e)}</div>`:p;return a`
      <div class="trigger-live-hint schedule-preview">
        ${s("schedule_preview_title",e)}: ${t}${this._schedulePreviewEnded?a` <span class="field-help">${s("schedule_preview_ends",e)}</span>`:p}
        ${n}
      </div>
    `}_buildSchedule(){let e=t=>{let n=parseInt(this._calOffset,10)||0;return n&&(t.offset=Math.max(-15,Math.min(n,15))),t};if(this._scheduleType==="weekdays")return e({kind:"weekdays",weekdays:[...this._weekdays].sort((t,n)=>t-n)});if(this._scheduleType==="nth_weekday")return e({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});let i={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(i.business=!0),e(i)}_recurrenceExtras(){let e={};if(this._seasonMonths.length&&(e.season_months=[...this._seasonMonths].sort((i,t)=>i-t)),this._endsMode==="count"){let i=parseInt(this._endsCount,10);i>=1&&(e.ends={count:i})}else this._endsMode==="until"&&this._endsUntil&&(e.ends={until:this._endsUntil});return e}_toggleSeasonMonth(e){this._seasonMonths=this._seasonMonths.includes(e)?this._seasonMonths.filter(i=>i!==e):[...this._seasonMonths,e]}_renderRecurrenceExtras(){let e=this._lang;if(!(this._scheduleType==="time_based"||oe.includes(this._scheduleType)))return p;let t=Ut(e);return a`
      <label class="field-label">${s("season_window_label",e)}</label>
      <div class="field-help">${s("season_window_hint",e)}</div>
      <div class="weekday-chips season-chips">
        ${t.map((n,d)=>a`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(d+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(d+1)}
          >${n}</button>`)}
      </div>

      <label class="field-label">${s("series_end_label",e)}</label>
      <div class="select-row">
        <select .value=${this._endsMode}
          @change=${n=>this._endsMode=n.target.value}>
          <option value="never" ?selected=${this._endsMode==="never"}>${s("series_end_never",e)}</option>
          <option value="count" ?selected=${this._endsMode==="count"}>${s("series_end_after_count",e)}</option>
          <option value="until" ?selected=${this._endsMode==="until"}>${s("series_end_until",e)}</option>
        </select>
      </div>
      ${this._endsMode==="count"?a`
        <ms-textfield
          label="${s("series_end_count_label",e)}"
          type="number" min="1"
          .value=${this._endsCount}
          @input=${n=>this._endsCount=n.target.value}
        ></ms-textfield>`:p}
      ${this._endsMode==="until"?a`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${e}
          label="${s("series_end_until_label",e)}"
          .value=${this._endsUntil}
          @value-changed=${n=>this._endsUntil=n.detail.value}
        ></ms-date-field>`:p}
    `}_renderCalendarFields(){let e=this._lang,i=jt(e);if(this._scheduleType==="weekdays")return a`
        <label class="field-label">${s("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${i.map((t,n)=>a`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(n)?"selected":""}"
              @click=${()=>this._toggleWeekday(n)}
            >${t}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let t=[["1",s("ord_1",e)],["2",s("ord_2",e)],["3",s("ord_3",e)],["4",s("ord_4",e)],["5",s("ord_5",e)],["-1",s("ord_last",e)]];return a`
        <div class="select-row">
          <label>${s("recurrence_occurrence",e)}</label>
          <select .value=${this._nth} @change=${n=>this._nth=n.target.value}>
            ${t.map(([n,d])=>a`<option value=${n} ?selected=${n===this._nth}>${d}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${s("recurrence_weekday",e)}</label>
          <select .value=${this._nthWeekday} @change=${n=>this._nthWeekday=n.target.value}>
            ${i.map((n,d)=>a`<option value=${String(d)} ?selected=${String(d)===this._nthWeekday}>${n}</option>`)}
          </select>
        </div>
        ${this._renderCalOffsetField()}`}return this._scheduleType==="day_of_month"?a`
        ${this._domLastDay?p:a`
          <ms-textfield
            label="${s("recurrence_day",e)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${t=>this._domDay=t.target.value}
          ></ms-textfield>`}
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domLastDay}
            @change=${t=>this._domLastDay=t.target.checked} />
          <span>${s("recurrence_last_day",e)}</span>
        </label>
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domBusiness}
            @change=${t=>this._domBusiness=t.target.checked} />
          <span>${s("recurrence_business_day",e)}</span>
        </label>
        ${this._renderCalOffsetField()}`:p}_renderCalOffsetField(){let e=this._lang;return a`
      <ms-textfield
        label="${s("recurrence_offset",e)}"
        helper="${s("recurrence_offset_help",e)}"
        type="number"
        min="-15"
        max="15"
        .value=${this._calOffset}
        @input=${i=>this._calOffset=i.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let e=parseFloat(this._triggerAbove),i=parseFloat(this._triggerBelow);return!isNaN(e)&&!isNaN(i)&&i>e}_renderTriggerLiveHint(){if(this._triggerType==="compound")return p;let e=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?a`<div class="trigger-live-hint warn">${s("trigger_hint_overlap",this._lang)}</div>`:p,i=this._triggerEntityId||this._triggerEntityIds[0];if(!i||!this.hass?.states)return e;let t=this.hass.states[i];if(!t)return e;let n=this._lang,d=t.attributes?.unit_of_measurement,_=typeof d=="string"&&d?` ${d}`:"",u=this._triggerAttribute?t.attributes?.[this._triggerAttribute]:t.state,h=typeof u=="number"?u:parseFloat(String(u)),g=u!=="unknown"&&u!=="unavailable"&&u!=null&&!isNaN(h),f=y=>A(y,n,{maximumFractionDigits:1}),x=[];if(this._triggerType==="threshold"){let y=parseFloat(this._triggerAbove),$=parseFloat(this._triggerBelow);if(isNaN(y)&&isNaN($))return p;g&&x.push(s("trigger_hint_now",n).replace("{value}",f(h)+_)),isNaN(y)||x.push(s("trigger_hint_above",n).replace("{target}",f(y)+_)),isNaN($)||x.push(s("trigger_hint_below",n).replace("{target}",f($)+_))}else if(this._triggerType==="counter"){let y=parseFloat(this._triggerTargetValue);if(isNaN(y))return p;this._triggerDeltaMode?this._taskId?x.push(s("trigger_hint_counter_delta_edit",n).replace("{target}",f(y)+_)):g?x.push(s("trigger_hint_counter_delta",n).replace("{value}",f(h)+_).replace("{due}",f(h+y)+_).replace("{target}",f(y)+_)):x.push(s("trigger_hint_counter_delta_edit",n).replace("{target}",f(y)+_)):(g&&x.push(s("trigger_hint_now",n).replace("{value}",f(h)+_)),x.push(s("trigger_hint_counter_abs",n).replace("{target}",f(y)+_)))}else if(this._triggerType==="runtime"){let y=parseFloat(this._triggerRuntimeHours);if(isNaN(y))return p;x.push(s("trigger_hint_runtime",n).replace("{hours}",f(y))),x.push(s("trigger_hint_state_now",n).replace("{value}",String(t.state)))}else if(this._triggerType==="state_change"){let y=parseInt(this._triggerTargetChanges,10)||1,$=this._triggerToState.trim();x.push(($?s("trigger_hint_state_change_to",n).replace("{state}",$):s("trigger_hint_state_change",n)).replace("{count}",String(y))),x.push(s("trigger_hint_state_now",n).replace("{value}",String(t.state)))}return x.length?a`<div class="trigger-live-hint">${x.join(" ")}</div>${e}`:e}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?a`
        <ms-textfield
          label="${s("trigger_above",e)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${i=>this._triggerAbove=i.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("trigger_below",e)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${i=>this._triggerBelow=i.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("trigger_equals",e)}"
          type="number"
          step="any"
          .value=${this._triggerEquals}
          @input=${i=>this._triggerEquals=i.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("trigger_not_equals",e)}"
          type="number"
          step="any"
          .value=${this._triggerNotEquals}
          @input=${i=>this._triggerNotEquals=i.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("for_at_least_minutes",e)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${i=>this._triggerForMinutes=i.target.value}
        ></ms-textfield>
      `:this._triggerType==="counter"?a`
        <ms-textfield
          label="${s("target_value",e)}"
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
          ${s("delta_mode",e)}
        </label>
        ${this._triggerDeltaMode?a`
              <ms-textfield
                label="${s("baseline_start_value",e)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${i=>this._triggerBaselineValue=i.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?s("baseline_start_help_edit",e):s("baseline_start_help",e)}
                ${this._taskId&&this._liveBaselineValue!=null?a`<div class="baseline-effective">
                      ${s("baseline_current_effective",e).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:p}
              </div>
            `:p}
      `:this._triggerType==="state_change"?a`
        ${this._renderStateField({label:s("from_state_optional",e),value:this._triggerFromState,entityId:this._triggerEntityId,onInput:i=>this._triggerFromState=i})}
        <div class="field-help">${s("state_value_help",e)}</div>
        ${this._renderStateField({label:s("to_state_optional",e),value:this._triggerToState,entityId:this._triggerEntityId,onInput:i=>this._triggerToState=i})}
        <ms-textfield
          label="${s("target_changes",e)}"
          type="number"
          min="1"
          .value=${this._triggerTargetChanges}
          @input=${i=>this._triggerTargetChanges=i.target.value}
        ></ms-textfield>
        <div class="field-help">${s("target_changes_help",e)}</div>
        ${(this._triggerTargetChanges||"1")==="1"&&(this._triggerFromState||this._triggerToState)?a`<div class="field-help">${s("state_latch_help",e)}</div>`:p}
        <ms-textfield
          label="${s("for_at_least_minutes",e)}"
          type="number"
          min="0"
          .value=${this._triggerForMinutes}
          @input=${i=>this._triggerForMinutes=i.target.value}
        ></ms-textfield>
        <div class="field-help">${s("for_minutes_state_help",e)}</div>
      `:this._triggerType==="runtime"?a`
        <ms-textfield
          label="${s("runtime_hours",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${i=>this._triggerRuntimeHours=i.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("runtime_max_session",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeMaxSession}
          @input=${i=>this._triggerRuntimeMaxSession=i.target.value}
        ></ms-textfield>
        <div class="field-help">${s("runtime_max_session_help",e)}</div>
        ${this._renderOnStatesField({value:this._triggerOnStates,entityId:this._triggerEntityId,onInput:i=>this._triggerOnStates=i})}
        <div class="field-help">${s("runtime_on_states_help",e)}</div>
      `:p}render(){if(!this._open)return a``;let e=this._lang,i=this._taskId?s("edit_task",e):s("new_task",e);return a`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i}</div>
        <div class="content">
          ${this._error?a`<div class="error">${this._error}</div>`:p}
          ${this._warning?a`<div class="error warning">${this._warning}</div>`:p}
          ${this._taskId===null&&this._objectChoices.length>0?a`
            <div class="select-row">
              <label>${s("object",e)}</label>
              <select
                .value=${this._entryId}
                @change=${t=>{this._entryId=t.target.value,this._consumesParts={},this._loadParts(),this._loadForeignPools()}}
              >
                ${this._objectChoices.map(t=>a`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
              </select>
            </div>
          `:p}
          <ms-textfield
            label="${s("task_name",e)}"
            required
            .value=${this._name}
            @input=${t=>this._name=t.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${s("maintenance_type",e)}</label>
            <select
              .value=${this._type}
              @change=${t=>this._type=t.target.value}
            >
              ${Rt.map(t=>a`<option value=${t} ?selected=${t===this._type}>${s(t,e)}</option>`)}
            </select>
          </div>
          ${this._type==="reading"?a`
                <ms-textfield
                  label="${s("reading_unit_label",e)}"
                  .value=${this._readingUnit}
                  @input=${t=>this._readingUnit=t.target.value}
                ></ms-textfield>
                <div class="field-help">${s("reading_unit_help",e)}</div>
                ${this._renderReadingsEditor(e)}
              `:p}
          ${this._partsLoadFailed?a`<div class="field-help parts-load-failed">${s("parts_load_failed",e)}</div>`:p}
          ${this.parts.length||this._foreignOwners.length?a`
                <div class="field">
                  <label>${s("consumes_parts_label",e)}</label>
                  ${this.parts.map(t=>this._renderConsumesRow(t))}
                  ${this._foreignOwners.length?a`
                        <details class="shared-pools" ?open=${this._hasForeignPick}>
                          <summary>${s("shared_parts_other_objects",e)}</summary>
                          <div class="field-help">${s("shared_parts_help",e)}</div>
                          ${this._foreignOwners.map(t=>a`
                              <div class="shared-pool-owner">${t.name}</div>
                              ${t.parts.map(n=>this._renderConsumesRow(n,t.entry_id))}
                            `)}
                        </details>
                      `:p}
                </div>
              `:p}
          <div class="select-row">
            <label>${s("priority",e)}</label>
            <select
              .value=${this._priority}
              @change=${t=>this._priority=t.target.value}
            >
              ${qt.map(t=>a`<option value=${t} ?selected=${t===this._priority}>${s("priority_"+t,e)}</option>`)}
            </select>
          </div>
          <div class="field">
            <label>${s("labels",e)}</label>
            <input
              type="text"
              .value=${this._labels}
              placeholder="${s("labels_placeholder",e)}"
              @input=${t=>this._labels=t.target.value}
            />
            <div class="field-help">${s("labels_help",e)}</div>
          </div>
          <div class="select-row">
            <label>${s("schedule_type",e)}</label>
            <select
              .value=${this._scheduleType}
              @change=${t=>this._scheduleType=t.target.value}
            >
              ${Ht.map(t=>a`<option value=${t} ?selected=${t===this._scheduleType}>${s(t,e)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?a`
                <ms-textfield
                  label="${s("interval_value",e)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${t=>this._intervalDays=t.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  <label>${s("interval_anchor",e)}</label>
                  <select
                    .value=${this._intervalAnchor}
                    @change=${t=>this._intervalAnchor=t.target.value}
                  >
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${s("anchor_completion",e)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${s("anchor_planned",e)}</option>
                  </select>
                </div>
              `:p}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?a`
                <ms-date-field
                  kind="date"
                  .hass=${this.hass}
                  .lang=${e}
                  label="${s("due_date",e)}"
                  .value=${this._dueDate}
                  @value-changed=${t=>this._dueDate=t.detail.value}
                ></ms-date-field>
              `:p}
          ${this.scheduleTimeEnabled&&Qe.includes(this._scheduleType)?a`
            <label class="checkbox-row schedule-time-toggle">
              <input type="checkbox" .checked=${this._scheduleTimeOn}
                @change=${t=>this._scheduleTimeOn=t.target.checked} />
              <span>${s("schedule_time_toggle",e)}</span>
            </label>
            ${this._scheduleTimeOn?a`
              <ms-date-field
                kind="time"
                .hass=${this.hass}
                .lang=${e}
                .value=${this._scheduleTime}
                helper="${s("schedule_time_help",e)}"
                @value-changed=${t=>this._scheduleTime=t.detail.value}
              ></ms-date-field>
            `:p}
          `:p}
          ${this._renderRecurrenceExtras()}
          ${this._renderSchedulePreview()}
          <ms-textfield
            label="${s("warning_days",e)}"
            type="number"
            min="0"
            max="365"
            .value=${this._warningDays}
            @input=${t=>this._warningDays=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("earliest_completion_days",e)}"
            helper="${s("earliest_completion_days_help",e)}"
            type="number"
            .value=${this._earliestCompletionDays}
            @input=${t=>this._earliestCompletionDays=t.target.value}
          ></ms-textfield>
          ${this.checklistsEnabled?a`
            <h3>${s("checklist_steps_optional",e)}</h3>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${s("checklist_placeholder",e)}"
              .value=${this._checklistText}
              @input=${t=>this._checklistText=t.target.value}
            ></textarea>
            <div class="field-help">${s("checklist_help",e)}</div>
          `:p}
          ${this._renderPhasesEditor(e)}
          <h3>${s("require_on_completion",e)}</h3>
          <div class="required-completion">
            ${me.map(t=>a`
              <label class="req-option">
                <input
                  type="checkbox"
                  .checked=${this._requiredCompletion.includes(t)}
                  @change=${n=>this._toggleRequired(t,n.target.checked)}
                />
                <span>${s(ie[t],e)}</span>
              </label>
            `)}
          </div>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${s("last_performed_optional",e)}"
            .value=${this._lastPerformed}
            @value-changed=${t=>this._lastPerformed=t.detail.value}
          ></ms-date-field>
          <div class="select-row">
            <label>${s("responsible_user",e)}</label>
            <select
              .value=${this._responsibleUserId||""}
              @change=${t=>{let n=t.target.value;this._responsibleUserId=n||null}}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${s("no_user_assigned",e)}</option>
              ${this._availableUsers.map(t=>a`<option value=${t.id} ?selected=${t.id===this._responsibleUserId}>${t.name}</option>`)}
            </select>
          </div>
          ${this._availableUsers.length>=2?a`
            <div class="field">
              <label>${s("shared_with",e)}</label>
              <div class="field-help">${s("shared_with_help",e)}</div>
              <div class="assignee-pool">
                ${this._availableUsers.map(t=>a`
                  <label class="pool-item">
                    <input type="checkbox"
                      .checked=${this._assigneePool.includes(t.id)}
                      @change=${()=>this._toggleAssignee(t.id)} />
                    <span>${t.name}</span>
                  </label>`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?a`
              <div class="select-row">
                <label>${s("rotation_strategy",e)}</label>
                <select
                  .value=${this._rotationStrategy}
                  @change=${t=>this._rotationStrategy=t.target.value}
                >
                  <option value="" ?selected=${!this._rotationStrategy}>${s("rotation_none",e)}</option>
                  ${["round_robin","least_completed","random"].map(t=>a`<option value=${t} ?selected=${t===this._rotationStrategy}>${s("rotation_"+t,e)}</option>`)}
                </select>
              </div>`:p}
          `:p}
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"?a`
            ${this._entityPickerFallback?a`
              <ms-textfield
                label="${s("environmental_entity_optional",e)}"
                helper="${s("environmental_entity_helper",e)}"
                .value=${this._environmentalEntity}
                @input=${t=>this._environmentalEntity=t.target.value.trim()}
              ></ms-textfield>
            `:a`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:Ye,device_class:Ge}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>s("environmental_entity_optional",e)}
              .computeHelper=${()=>s("environmental_entity_helper",e)}
              @value-changed=${t=>{this._environmentalEntity=(t.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(e):p}
          `:p}
          ${this._renderAdaptiveSection(e)}
          <ms-textfield
            label="${s("notes_optional",e)}"
            multiline
            .rows=${3}
            .helper=${s("notes_markdown_hint",e)}
            .value=${this._notes}
            @input=${t=>this._notes=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("documentation_url_optional",e)}"
            .value=${this._documentationUrl}
            @input=${t=>this._documentationUrl=t.target.value}
          ></ms-textfield>
          <ha-icon-picker
            .hass=${this.hass}
            label="${s("custom_icon_optional",e)}"
            .value=${this._customIcon}
            @value-changed=${t=>this._customIcon=t.detail.value||""}
          ></ha-icon-picker>
          ${this._availableTags.length>0?a`
              <div class="select-row">
                <label>${s("nfc_tag_id_optional",e)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${t=>this._nfcTagId=t.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${s("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(t=>a`<option value=${t.id} ?selected=${t.id===this._nfcTagId}>${t.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${s("nfc_tags_refresh",e)}">↻</button>
              </div>
            `:a`
              <ms-textfield
                label="${s("nfc_tag_id_optional",e)}"
                .value=${this._nfcTagId}
                @input=${t=>this._nfcTagId=t.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${s("nfc_tags_empty_help",e)}
                <a href="/config/tags">${s("nfc_tags_open_settings",e)}</a>
                ·
                <button type="button" class="link-button" @click=${this._loadTags}>
                  ${s("nfc_tags_refresh",e)}
                </button>
              </div>
            `}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${this._requireTagScan}
              @change=${t=>this._requireTagScan=t.target.checked}
            />
            <span>${s("require_tag_scan",e)}</span>
          </label>
          ${this._requireTagScan?a`<div class="field-help">${s("require_tag_scan_help",e)}</div>`:p}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._allowSkip}
              @change=${t=>this._allowSkip=!t.target.checked}
            />
            <span>${s("disallow_skip",e)}</span>
          </label>
          ${this._allowSkip?p:a`<div class="field-help">${s("disallow_skip_help",e)}</div>`}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._notifyEnabled}
              @change=${t=>this._notifyEnabled=!t.target.checked}
            />
            <span>${s("no_notifications",e)}</span>
          </label>
          ${this._notifyEnabled?p:a`<div class="field-help">${s("no_notifications_help",e)}</div>`}
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${t=>this._enabled=t.target.checked}
            />
            ${s("task_enabled",e)}
          </label>
          ${this._renderCompletionActionsSection(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${s("cancel",e)}</ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?s("saving",e):s("save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};m._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),m.styles=w`
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
  `,l([v({attribute:!1})],m.prototype,"hass",2),l([v({type:Boolean,attribute:"checklists-enabled"})],m.prototype,"checklistsEnabled",2),l([v({type:Boolean,attribute:"schedule-time-enabled"})],m.prototype,"scheduleTimeEnabled",2),l([v({type:Boolean,attribute:"completion-actions-enabled"})],m.prototype,"completionActionsEnabled",2),l([v({type:Number,attribute:"default-warning-days"})],m.prototype,"defaultWarningDays",2),l([c()],m.prototype,"parts",2),l([c()],m.prototype,"_foreignOwners",2),l([c()],m.prototype,"_open",2),l([c()],m.prototype,"_entityPickerFallback",2),l([c()],m.prototype,"_loading",2),l([c()],m.prototype,"_error",2),l([c()],m.prototype,"_warning",2),l([c()],m.prototype,"_entryId",2),l([c()],m.prototype,"_taskId",2),l([c()],m.prototype,"_objectChoices",2),l([c()],m.prototype,"_name",2),l([c()],m.prototype,"_type",2),l([c()],m.prototype,"_scheduleType",2),l([c()],m.prototype,"_intervalDays",2),l([c()],m.prototype,"_intervalUnit",2),l([c()],m.prototype,"_dueDate",2),l([c()],m.prototype,"_warningDays",2),l([c()],m.prototype,"_earliestCompletionDays",2),l([c()],m.prototype,"_intervalAnchor",2),l([c()],m.prototype,"_weekdays",2),l([c()],m.prototype,"_nth",2),l([c()],m.prototype,"_nthWeekday",2),l([c()],m.prototype,"_domDay",2),l([c()],m.prototype,"_domLastDay",2),l([c()],m.prototype,"_domBusiness",2),l([c()],m.prototype,"_calOffset",2),l([c()],m.prototype,"_seasonMonths",2),l([c()],m.prototype,"_endsMode",2),l([c()],m.prototype,"_endsCount",2),l([c()],m.prototype,"_endsUntil",2),l([c()],m.prototype,"_schedulePreview",2),l([c()],m.prototype,"_schedulePreviewEnded",2),l([c()],m.prototype,"_notes",2),l([c()],m.prototype,"_documentationUrl",2),l([c()],m.prototype,"_customIcon",2),l([c()],m.prototype,"_priority",2),l([c()],m.prototype,"_labels",2),l([c()],m.prototype,"_enabled",2),l([c()],m.prototype,"_triggerEntityId",2),l([c()],m.prototype,"_triggerEntityIds",2),l([c()],m.prototype,"_triggerEntityLogic",2),l([c()],m.prototype,"_triggerAttribute",2),l([c()],m.prototype,"_triggerType",2),l([c()],m.prototype,"_triggerAbove",2),l([c()],m.prototype,"_triggerBelow",2),l([c()],m.prototype,"_triggerEquals",2),l([c()],m.prototype,"_triggerNotEquals",2),l([c()],m.prototype,"_triggerForMinutes",2),l([c()],m.prototype,"_triggerCombinator",2),l([c()],m.prototype,"_triggerTargetValue",2),l([c()],m.prototype,"_triggerDeltaMode",2),l([c()],m.prototype,"_triggerBaselineValue",2),l([c()],m.prototype,"_liveBaselineValue",2),l([c()],m.prototype,"_autoCompleteOnRecovery",2),l([c()],m.prototype,"_triggerFromState",2),l([c()],m.prototype,"_triggerToState",2),l([c()],m.prototype,"_triggerTargetChanges",2),l([c()],m.prototype,"_triggerRuntimeHours",2),l([c()],m.prototype,"_triggerRuntimeMaxSession",2),l([c()],m.prototype,"_triggerOnStates",2),l([c()],m.prototype,"_compoundLogic",2),l([c()],m.prototype,"_compoundConditions",2),l([c()],m.prototype,"_suggestedAttributes",2),l([c()],m.prototype,"_availableAttributes",2),l([c()],m.prototype,"_entityDomain",2),l([c()],m.prototype,"_lastPerformed",2),l([c()],m.prototype,"_nfcTagId",2),l([c()],m.prototype,"_requireTagScan",2),l([c()],m.prototype,"_allowSkip",2),l([c()],m.prototype,"_notifyEnabled",2),l([c()],m.prototype,"_readingUnit",2),l([c()],m.prototype,"_readings",2),l([c()],m.prototype,"_consumesParts",2),l([c()],m.prototype,"_partsLoadFailed",2),l([c()],m.prototype,"_availableTags",2),l([c()],m.prototype,"_responsibleUserId",2),l([c()],m.prototype,"_assigneePool",2),l([c()],m.prototype,"_rotationStrategy",2),l([c()],m.prototype,"_availableUsers",2),l([c()],m.prototype,"_checklistText",2),l([c()],m.prototype,"_phaseDefs",2),l([c()],m.prototype,"_phaseSeq",2),l([c()],m.prototype,"_requiredCompletion",2),l([c()],m.prototype,"_scheduleTime",2),l([c()],m.prototype,"_scheduleTimeOn",2),l([c()],m.prototype,"_actionService",2),l([c()],m.prototype,"_actionTargetEntity",2),l([c()],m.prototype,"_actionData",2),l([c()],m.prototype,"_actionDataJsonFallback",2),l([c()],m.prototype,"_actionTesting",2),l([c()],m.prototype,"_actionTestResult",2),l([c()],m.prototype,"_actionTestError",2),l([c()],m.prototype,"_qcNotes",2),l([c()],m.prototype,"_qcCost",2),l([c()],m.prototype,"_qcDuration",2),l([c()],m.prototype,"_qcFeedback",2),l([c()],m.prototype,"_environmentalEntity",2),l([c()],m.prototype,"_environmentalAttribute",2),l([c()],m.prototype,"_adaptiveEnabled",2),l([c()],m.prototype,"_adaptiveAlpha",2),l([c()],m.prototype,"_adaptiveMin",2),l([c()],m.prototype,"_adaptiveMax",2),l([c()],m.prototype,"_adaptiveSeasonal",2),l([c()],m.prototype,"_adaptivePrediction",2),l([c()],m.prototype,"_conditionAttrOptions",2);var ge=m;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",ge);async function zt(r,o,e,i){let t=new FormData;t.append("entry_id",o);for(let _ of i)t.append("tags",_);t.append("file",e,e.name);let n=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${r.auth?.data?.access_token??""}`},body:t});if(n.status===413)throw new Error("doc_too_large");if(!n.ok)throw new Error("doc_upload_failed");let d=await n.json();if(!d.id)throw new Error("doc_upload_failed");return{id:d.id,deduped:!!d.deduped,duplicate_in_object:d.duplicate_in_object??null}}async function Xe(r,o,e){return(await zt(r,o,e,["photo"])).id}async function ve(r,o){await Promise.all(o.map(e=>r.connection.sendMessagePromise({type:"maintenance_supporter/documents/delete",doc_id:e}).catch(()=>{})))}var X=class{constructor(o,e){this.host=o;this.opts=e;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this.max=e.max??10,o.addController(this)}hostConnected(){}get ids(){return this.photos.map(o=>o.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(o){return this.errorKey?s(this.errorKey,o).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(o=[]){this._revokeAll(),this.photos=o.map(e=>({id:e,preview:""})),this.uploadedIds=[],this.uploading=!1,this.errorKey="",this.host.requestUpdate()}async addFiles(o){if(o.length===0)return;let e=o.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let i of e){let t=await Xe(this.opts.hass(),this.opts.entryId(),i);this.uploadedIds=[...this.uploadedIds,t],this.photos=[...this.photos,{id:t,preview:URL.createObjectURL(i)}],this.host.requestUpdate()}o.length>e.length&&(this.errorKey="photos_limit")}catch(i){this.errorKey=i instanceof Error&&i.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{this.uploading=!1,this.host.requestUpdate()}}remove(o){let e=this.photos.find(i=>i.id===o);e?.preview&&URL.revokeObjectURL(e.preview),this.photos=this.photos.filter(i=>i.id!==o),this.uploadedIds.includes(o)&&(this.uploadedIds=this.uploadedIds.filter(i=>i!==o),ve(this.opts.hass(),[o])),this.host.requestUpdate()}discardOrphans(){if(this.uploadedIds.length===0)return;let o=this.uploadedIds;this.uploadedIds=[],ve(this.opts.hass(),o)}markAttached(){this.uploadedIds=[]}_revokeAll(){for(let o of this.photos)o.preview&&URL.revokeObjectURL(o.preview)}};function le(){if(window.externalApp!==void 0)return!0;let o=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(o)&&/Android/.test(o)}var fe={printOptions:"msp-print-options",batteryRosterOpen:"msp-bf-roster-open",docSort:"msp-doc-sort",cameraDevice:"msp-camera-device",overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort"};function et(r){try{return localStorage.getItem(r)}catch{return null}}function tt(r,o){try{localStorage.setItem(r,o)}catch{}}function it(){if(!le())return!1;let r=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!r&&typeof r.getUserMedia=="function"}var Vt=1920,Bt=.88,W=class extends E{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._devices=[];this._stream=null}async open(){if(this._open)return;let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||typeof e.getUserMedia!="function"){this._unavailable("no_media_devices");return}let i=et(fe.cameraDevice),t=!1;if(i)try{this._stream=await e.getUserMedia({video:{deviceId:{exact:i}},audio:!1}),t=!0}catch{}if(!t){try{this._stream=await e.getUserMedia({video:{facingMode:{ideal:"environment"},advanced:[{zoom:1}]},audio:!1})}catch(d){this._unavailable(d instanceof Error?d.name||d.message:String(d));return}await this._preferMainBackCamera(e)}await this._applyZoomOne(),await this._listDevices(e),this._open=!0,await this.updateComplete;let n=this._video;if(n&&this._stream){n.srcObject=this._stream;try{await n.play()}catch{}}}async _preferMainBackCamera(e){if(typeof e.enumerateDevices!="function")return;let i=[];try{i=await e.enumerateDevices()}catch{return}let t=u=>{let h=/camera2?\s*(\d+)/i.exec(u.label);return h?Number(h[1]):Number.MAX_SAFE_INTEGER},n=i.filter(u=>u.kind==="videoinput"&&u.deviceId&&/back|rear|environment|rück|hinten/i.test(u.label)).sort((u,h)=>t(u)-t(h)),_=this._stream?.getVideoTracks()[0]?.getSettings().deviceId;if(n.length>1&&n[0].deviceId!==_)try{let u=await e.getUserMedia({video:{deviceId:{exact:n[0].deviceId}},audio:!1});for(let h of this._stream?.getTracks()??[])h.stop();this._stream=u}catch{}}async _applyZoomOne(){let e=this._stream?.getVideoTracks()[0],i=e&&typeof e.getCapabilities=="function"?e.getCapabilities():void 0;if(i?.zoom&&typeof i.zoom.min=="number"&&i.zoom.min<1&&(i.zoom.max??1)>=1)try{await e.applyConstraints({advanced:[{zoom:1}]})}catch{}}async _listDevices(e){if(typeof e.enumerateDevices=="function")try{this._devices=(await e.enumerateDevices()).filter(i=>i.kind==="videoinput"&&!!i.deviceId)}catch{this._devices=[]}}get _currentDeviceId(){return this._stream?.getVideoTracks()[0]?.getSettings().deviceId}async _switchCamera(){let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||this._devices.length<2||this._busy)return;let i=this._devices.map(d=>d.deviceId),t=i.indexOf(this._currentDeviceId??""),n=i[(t+1)%i.length];this._busy=!0;try{let d=await e.getUserMedia({video:{deviceId:{exact:n}},audio:!1});for(let u of this._stream?.getTracks()??[])u.stop();this._stream=d,await this._applyZoomOne(),tt(fe.cameraDevice,n);let _=this._video;if(_){_.srcObject=d;try{await _.play()}catch{}}}catch{}finally{this._busy=!1}}close(){this._stopStream(),this._open=!1,this._busy=!1}disconnectedCallback(){super.disconnectedCallback(),this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let i of this._stream?.getTracks()??[])i.stop();this._stream=null;let e=this._video;e&&(e.srcObject=null)}_unavailable(e){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:e},bubbles:!0,composed:!0}))}async _shoot(){let e=this._video;if(!(!e||this._busy)){this._busy=!0;try{let i=e.videoWidth||640,t=e.videoHeight||480,n=Math.min(1,Vt/Math.max(i,t)),d=document.createElement("canvas");d.width=Math.round(i*n),d.height=Math.round(t*n);let _=d.getContext("2d");if(!_)throw new Error("no_canvas");_.drawImage(e,0,0,d.width,d.height);let u=await new Promise(f=>d.toBlob(f,"image/jpeg",Bt));if(!u)throw new Error("no_blob");let h=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),g=new File([u],`photo-${h}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:g},bubbles:!0,composed:!0}))}catch(i){this._unavailable(i instanceof Error?i.message:String(i))}finally{this._busy=!1}}}render(){if(!this._open)return p;let e=this.lang;return a`
      <div class="overlay" role="dialog" aria-modal="true" aria-label=${s("doc_camera",e)}>
        <video autoplay playsinline muted></video>
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${s("cancel",e)}</button>
          ${this._devices.length>1?a`<button type="button" class="switch" ?disabled=${this._busy} title=${s("camera_switch_lens",e)} aria-label=${s("camera_switch_lens",e)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
              </button>`:p}
          <button type="button" class="shoot" ?disabled=${this._busy} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${s("camera_capture_shoot",e)}</span>
          </button>
        </div>
      </div>
    `}};W.styles=w`
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
  `,l([v({type:String})],W.prototype,"lang",2),l([c()],W.prototype,"_open",2),l([c()],W.prototype,"_busy",2),l([c()],W.prototype,"_devices",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",W);var de=w`
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
`,R=class extends E{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=le();this._inAppCamera=it()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(e){e.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:e},bubbles:!0,composed:!0}))}_onInput(e){let i=e.target,t=Array.from(i.files??[]);i.value="",this._emit(t)}_onCameraClick(e){!this._inAppCamera||this._locked||(e.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),!this._locked&&e.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return p;let e=this.lang,i=this._locked?"disabled":"",t=this.busy?s("uploading",e):s("doc_camera",e),n=s(this._singlePick?"choose_photo":"choose_photos",e);return a`
      <div class="photo-pickers">
        ${this.showCamera?a`<label class="photo-pick photo-pick-camera ${i}" role="button" tabindex="0"
              aria-label=${t} title=${this.compact?t:p}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?p:a`<span>${t}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
        ${this.showGallery?a`<label class="photo-pick photo-pick-gallery ${i}" role="button" tabindex="0"
              aria-label=${n} title=${this.compact?n:p}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?p:a`<span>${n}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
      </div>
      ${this.showGallery&&this._singlePick?a`<div class="photo-android-hint">${s("photos_android_hint",e)}</div>`:p}
      ${this.showCamera&&this._inAppCamera?a`<ms-camera-capture .lang=${e}
            @photo-captured=${d=>this._emit([d.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:p}
    `}};l([v({type:String})],R.prototype,"lang",2),l([v({type:Boolean})],R.prototype,"disabled",2),l([v({type:Boolean})],R.prototype,"busy",2),l([v({type:String})],R.prototype,"accept",2),l([v({type:Boolean})],R.prototype,"showCamera",2),l([v({type:Boolean})],R.prototype,"showGallery",2),l([v({type:Boolean})],R.prototype,"compact",2),l([v({type:Number})],R.prototype,"remaining",2),l([c()],R.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",R);var b=class extends E{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.currencySymbol="";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new X(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this.checklistPrefill={}}open(e={}){this._open||(this._open=!0,this.viaTagScan=!!e.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((i,t)=>[String(t),!!this.checklistPrefill[i]]).filter(([,i])=>i)),this._feedback="needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(i=>[D(i),{...i}])))}_toggleCheck(e){let i=String(e);this._checklistState={...this._checklistState,[i]:!this._checklistState[i]}}_setFeedback(e){this._feedback=e}async _complete(){this._loading=!0,this._error="",this._photos.clearError();try{let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(e.notes=this._notes),this._cost){let i=parseFloat(this._cost);!isNaN(i)&&i>=0&&(e.cost=i)}if(this._duration){let i=parseInt(this._duration,10);!isNaN(i)&&i>=0&&(e.duration=i)}if(this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photos.photos.length>0&&(e.photo_doc_ids=this._photos.ids),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(new Date(this._completedAt).getTime()>Date.now()){this._error=s("completed_at_future_error",this.lang),this._loading=!1;return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let i={};for(let t of this.readings){let n=(this._readingValues[t.id]??"").trim();if(n==="")continue;let d=parseFloat(n.replace(",","."));isNaN(d)||(i[t.id]=d)}Object.keys(i).length>0&&(e.reading_values=i)}else if(this._readingValue!==""){let i=parseFloat(this._readingValue);isNaN(i)||(e.reading_value=i)}if(this.restockDefault!==null&&this._restockQty!==""){let i=parseFloat(this._restockQty);!isNaN(i)&&i>=1&&(e.restock_quantity=i)}this.parts.length>0&&(e.used_parts=Object.values(this._usedParts).filter(i=>Number.isFinite(i.quantity)&&i.quantity>0).map(i=>i.entry_id?{part_id:i.part_id,quantity:i.quantity,entry_id:i.entry_id}:{part_id:i.part_id,quantity:i.quantity})),await this.hass.connection.sendMessagePromise(e),this._photos.markAttached(),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(e){this._error=T(e,this.lang,s("save_error",this.lang))}finally{this._loading=!1}}_renderReadingField(e,i){let t=this._completedAt?new Date(this._completedAt).getTime():NaN,n=Se(this.readingHistory,e.id,isNaN(t)?void 0:t),d=e.unit||this.readingUnit,_=(this._readingValues[e.id]??"").trim(),u=_===""?NaN:parseFloat(_.replace(",",".")),h=n!==void 0&&!isNaN(u)&&u<n.value,g=n!==void 0?A(n.value,i,{maximumFractionDigits:3}):"";return a`
      <label class="field reading-field">
        <span class="field-label">${e.name}${d?` (${d})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${n!==void 0?s("reading_last",i).replace("{value}",g):""}
          .value=${this._readingValues[e.id]??""}
          @input=${f=>{this._readingValues={...this._readingValues,[e.id]:f.target.value}}} />
        ${h?a`<span class="reading-warn">${s("reading_below_last",i).replace("{value}",g)}</span>`:p}
      </label>`}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(i=>!e[i])}_req(e){return this.requiredFields.includes(e)?a`<span class="req-mark" aria-hidden="true">*</span>`:p}_partsCostSuggestion(){if(this.restockDefault!==null){let t=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(t)||t<=0?null:Math.round(this.restockUnitCost*t*100)/100}if(!this.parts.length)return null;let e=0,i=!1;for(let t of Object.values(this._usedParts)){let n=this.parts.find(d=>D({part_id:d.id,entry_id:d.entry_id})===D(t));n?.cost!=null&&(e+=n.cost*(t.quantity||1),i=!0)}return i?Math.round(e*100)/100:null}_renderCostSuggestion(e){if(this._cost.trim()!=="")return p;let i=this._partsCostSuggestion();if(i==null||i<=0)return p;let t=J(i,this.currencySymbol,e);return a`<button
      type="button"
      class="cost-suggestion"
      @click=${()=>this._cost=String(Math.round(i*100)/100)}
    >${s("cost_from_parts",e).replace("{amount}",t)}</button>`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){let e=new Date,i=t=>String(t).padStart(2,"0");this._completedAt=`${e.getFullYear()}-${i(e.getMonth()+1)}-${i(e.getDate())}T${i(e.getHours())}:${i(e.getMinutes())}:00`}render(){if(!this._open)return a``;let e=this.lang||this.hass?.language||"en",i=this._error||this._photos.errorText(e);return a`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${s("complete_title",e)}${this.taskName}</div>
        ${this.phaseLabel?a`<div class="phase-line">${s("phase_current",e)}: ${this.phaseLabel}</div>`:p}
        ${this.requireTagScan&&!this.viaTagScan?a`<div class="scan-required-note">${s("require_tag_scan_hint",e)}</div>`:p}
        <div class="content">
          ${i?a`<div class="error">${i}</div>`:p}
          ${this.checklist.length>0?a`
            <div class="checklist-section">
              <label class="checklist-label">${s("checklist",e)}</label>
              ${this.checklist.map((t,n)=>a`
                <label class="checklist-item" @click=${()=>this._toggleCheck(n)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(n)]} />
                  <span>${t}</span>
                </label>
              `)}
            </div>
          `:p}
          ${this.readings.length>0?a`<div class="readings-block">
                <span class="field-label">${s("readings_section",e)}</span>
                ${this.readings.map(t=>this._renderReadingField(t,e))}
              </div>`:this.taskType==="reading"?a`
              <label class="field">
                <span class="field-label">${s("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${t=>this._readingValue=t.target.value} />
              </label>`:p}
          ${this.parts.length?a`<div class="used-parts">
                <span class="field-label">${s("complete_parts_used",e)}</span>
                ${this.parts.map(t=>{let n=D({part_id:t.id,entry_id:t.entry_id}),d=this._usedParts[n],_=d!==void 0,u=t.entry_id?{part_id:t.id,quantity:1,entry_id:t.entry_id}:{part_id:t.id,quantity:1};return a`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${_}
                        @change=${h=>{let g={...this._usedParts};h.target.checked?g[n]=g[n]||u:delete g[n],this._usedParts=g}} />
                      <span
                        >${t.name}${t.owner_name?a`<span class="used-part-owner"> (${t.owner_name})</span>`:p}${t.stock!==null&&t.stock!==void 0?` (${t.stock}${t.unit?" "+t.unit:""})`:""}</span
                      >
                    </label>
                    ${_?a`<input class="used-part-qty" type="number" min="0.01" max="999" step="0.01"
                          .value=${String(d.quantity)}
                          @input=${h=>{let g=parseFloat(h.target.value);this._usedParts={...this._usedParts,[n]:{...u,quantity:Number.isFinite(g)&&g>=.01?g:1}}}} />`:p}
                  </div>`})}
              </div>`:this.consumesInfo.length?a`<div class="consumes-hint">
                  ${this.consumesInfo.map(t=>a`<div>${t}</div>`)}
                </div>`:p}
          ${this.restockDefault!==null?a`
              <label class="field">
                <span class="field-label">${s("restock_quantity_label",e)}</span>
                <input type="number" step="0.01" min="0.01" class="field-input"
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
            <span class="field-label">${s("notes_optional",e)}${this._req("notes")}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${t=>this._notes=t.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${s("cost_optional",e)}${this._req("cost")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${t=>this._cost=t.target.value} />
            ${this._renderCostSuggestion(e)}
          </label>
          <label class="field">
            <span class="field-label">${s("duration_minutes",e)}${this._req("duration")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._duration}
              @input=${t=>this._duration=t.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${s("completed_at_optional",e)}</span>
            ${this._completedAt?a`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${e}
                  .value=${this._completedAt}
                  @value-changed=${t=>this._completedAt=t.detail.value}
                ></ms-date-field>`:a`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${s("completed_at_pick",e)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${s("completion_photos_optional",e)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?a`<div class="photo-strip">
                  ${this._photos.photos.map(t=>a`
                    <div class="photo-preview">
                      <img src=${t.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(t.id)}
                        title="${s("remove",e)}">✕</button>
                    </div>`)}
                </div>`:p}
            ${this._photos.full?a`<div class="photo-limit">${s("photos_limit",e).replace("{max}",String(this._photos.max))}</div>`:a`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${t=>this._photos.addFiles(t.detail.files)}
                ></ms-photo-picker>`}
          </div>
          ${this.adaptiveEnabled?a`
            <div class="feedback-section">
              <label class="feedback-label">${s("was_maintenance_needed",e)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${s("feedback_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${s("feedback_not_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${s("feedback_not_sure",e)}</button>
              </div>
            </div>
          `:p}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._missingRequired.length>0}
            title=${this._missingRequired.length?this._missingRequired.map(t=>s("err_required",e).replace("{field}",s(ie[t]??t,e))).join(" \xB7 "):""}
          >
            ${this._loading?s("completing",e):s("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};b.styles=[je,de,w`
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
  `],l([v({attribute:!1})],b.prototype,"hass",2),l([v()],b.prototype,"entryId",2),l([v()],b.prototype,"taskId",2),l([v()],b.prototype,"taskName",2),l([v()],b.prototype,"lang",2),l([v({type:Array})],b.prototype,"checklist",2),l([v({type:Boolean})],b.prototype,"adaptiveEnabled",2),l([v()],b.prototype,"taskType",2),l([v()],b.prototype,"readingUnit",2),l([v({attribute:!1})],b.prototype,"readings",2),l([v({attribute:!1})],b.prototype,"readingHistory",2),l([v({attribute:!1})],b.prototype,"restockDefault",2),l([v({attribute:!1})],b.prototype,"restockUnitCost",2),l([v()],b.prototype,"currencySymbol",2),l([v({attribute:!1})],b.prototype,"parts",2),l([v({attribute:!1})],b.prototype,"consumesParts",2),l([v({type:Array})],b.prototype,"consumesInfo",2),l([v({type:Array})],b.prototype,"requiredFields",2),l([v()],b.prototype,"phaseLabel",2),l([v({type:Boolean})],b.prototype,"requireTagScan",2),l([v({type:Boolean})],b.prototype,"viaTagScan",2),l([c()],b.prototype,"_open",2),l([c()],b.prototype,"_notes",2),l([c()],b.prototype,"_cost",2),l([c()],b.prototype,"_duration",2),l([c()],b.prototype,"_loading",2),l([c()],b.prototype,"_error",2),l([c()],b.prototype,"_checklistState",2),l([c()],b.prototype,"_feedback",2),l([c()],b.prototype,"_readingValue",2),l([c()],b.prototype,"_readingValues",2),l([c()],b.prototype,"_restockQty",2),l([c()],b.prototype,"_completedAt",2),l([c()],b.prototype,"_usedParts",2),l([v({attribute:!1})],b.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",b);function st(r,o,e){let i=new Blob([r],{type:e}),t=URL.createObjectURL(i),n=document.createElement("a");n.href=t,n.download=o,n.target="_blank",n.rel="noopener",n.style.display="none",document.body.appendChild(n),n.dispatchEvent(new MouseEvent("click")),document.body.removeChild(n),setTimeout(()=>URL.revokeObjectURL(t),6e4)}async function Wt(r,o,e=300){return(await r.connection.sendMessagePromise({type:"auth/sign_path",path:o,expires:e})).path}async function rt(r,o,e=300){return Wt(r,`/api/maintenance_supporter/document/${o}`,e)}var K=class extends E{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await rt(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?p:this._url?a`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:a`<div class="ph"></div>`}};K.styles=w`
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
  `,l([v({attribute:!1})],K.prototype,"hass",2),l([v()],K.prototype,"docId",2),l([c()],K.prototype,"_url",2),l([c()],K.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",K);var L=class extends E{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._photos=new X(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return P(this.hass)}openEdit(e){this._draft={...e},this._originalSnapshot={...e},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(e.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(e),this._loadPartOptions()}_seedReadings(e){let i=[],t=new Set;for(let d of e.readings??[])t.has(d.id)||(t.add(d.id),i.push({id:d.id,name:d.name,unit:d.unit??null}));for(let d of e.reading_values??[])t.has(d.id)||(t.add(d.id),i.push({id:d.id,name:d.name,unit:d.unit??null}));this._readingRows=i;let n={};for(let d of e.reading_values??[])n[d.id]=String(d.value);this._readingText=n,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let e={};for(let i of this._readingRows){let t=(this._readingText[i.id]??"").trim();if(t==="")continue;let n=parseFloat(t.replace(",","."));isNaN(n)||(e[i.id]=n)}return e}async _loadPartOptions(){let e=this._draft;if(e)try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"}),t=[];for(let d of i.parts||[]){let _=d.entry_id===e.entry_id,u=d.consumers.some(h=>h.entry_id===e.entry_id&&h.task_id===e.task_id);!_&&!u||t.push({part_id:d.part_id,name:d.name,entry_id:d.entry_id,foreign:!_,object_name:d.object_name})}for(let d of e.used_parts||[]){let _=d.entry_id||e.entry_id;t.some(u=>u.part_id===d.part_id&&u.entry_id===_)||t.push({part_id:d.part_id,name:d.name||d.part_id,entry_id:_,foreign:_!==e.entry_id,object_name:null})}let n={};for(let d of e.used_parts||[])n[`${d.entry_id||e.entry_id}:${d.part_id}`]=d.quantity??1;this._partOptions=t,this._partQty=n,this._partQtyOriginal=this._partSelectionKey()}catch{this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,e])=>e>0).sort(([e],[i])=>e.localeCompare(i)))}close(){this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(e,i){this._draft&&(this._draft={...this._draft,[e]:i})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let e=this._lang;if(window.confirm(s("history_delete_confirm",e))){this._saving=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/history/delete",entry_id:this._draft.entry_id,task_id:this._draft.task_id,timestamp:this._originalSnapshot.original_timestamp}),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close()}catch(i){this._error=T(i,e)}finally{this._saving=!1}}}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="",this._photos.clearError();try{let e={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(e.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(e.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(e.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(e.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(e.completed_by=this._draft.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(e.used_parts=(this._partOptions||[]).filter(t=>(this._partQty[`${t.entry_id}:${t.part_id}`]||0)>0).map(t=>({part_id:t.part_id,quantity:this._partQty[`${t.entry_id}:${t.part_id}`],...t.foreign?{entry_id:t.entry_id}:{}}))),this._draft.reading_value!==this._originalSnapshot.reading_value&&(e.reading_value=this._draft.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let t=this._readingNumbers(),n={};for(let d of this._readingRows)n[d.id]=t[d.id]??null;e.reading_values=n}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(e.photo_doc_ids=this._photos.ids),Object.keys(e).filter(t=>!["type","entry_id","task_id","original_timestamp"].includes(t)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(e),this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=T(e,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return p;let e=this._lang,i=this._draft,t=this._error||this._photos.errorText(e);return a`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${s("history_edit_title",e)}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${s(i.type,e)||i.type}</span>
        </div>
        <ms-date-field
          kind="datetime"
          required
          .hass=${this.hass}
          .lang=${e}
          .label=${s("history_edit_timestamp",e)}
          .value=${i.timestamp.slice(0,19)}
          @value-changed=${n=>{let d=n.detail.value;d&&this._set("timestamp",d)}}
        ></ms-date-field>
        <label>
          <span>${s("notes_label",e)}</span>
          <textarea
            rows="3"
            @input=${n=>{let d=n.target.value;this._set("notes",d||null)}}
            .value=${i.notes??""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${s("cost",e)}</span>
            <input type="number" min="0" step="0.01"
              .value=${i.cost!=null?String(i.cost):""}
              @input=${n=>{let d=n.target.value;this._set("cost",d?Number(d):null)}} />
          </label>
          <label>
            <span>${s("duration",e)}</span>
            <input type="number" min="0"
              .value=${i.duration!=null?String(i.duration):""}
              @input=${n=>{let d=n.target.value;this._set("duration",d?Number(d):null)}} />
          </label>
        </div>
        ${this._renderReadings(i,e)}
        ${this._partOptions&&this._partOptions.length>0?a`
          <div class="parts-block">
            <span class="parts-title">${s("complete_parts_used",e)}</span>
            ${this._partOptions.map(n=>{let d=`${n.entry_id}:${n.part_id}`,_=this._partQty[d]||0;return a`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${_>0}
                    @change=${u=>{let h=u.target.checked;this._partQty={...this._partQty,[d]:h?1:0}}} />
                  <span class="part-label">${n.name}${n.foreign&&n.object_name?` (${n.object_name})`:""}</span>
                  ${_>0?a`
                    <input class="part-qty" type="number" min="0.01" max="999" step="0.01"
                      .value=${String(_)}
                      @input=${u=>{let h=parseFloat(u.target.value);!isNaN(h)&&h>0&&(this._partQty={...this._partQty,[d]:h})}} />
                  `:p}
                </label>
              `})}
          </div>
        `:p}
        <div class="photos-block">
          <span class="parts-title">${s("completion_photos",e)}</span>
          ${this._photos.photos.length>0?a`
            <div class="photo-strip">
              ${this._photos.photos.map(n=>a`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${n.id}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${s("remove",e)}
                    @click=${()=>this._photos.remove(n.id)}>✕</button>
                </div>`)}
            </div>`:p}
          ${this._photos.full?a`<span class="photos-hint">${s("photos_limit",e).replace("{max}",String(this._photos.max))}</span>`:a`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${n=>this._photos.addFiles(n.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${s("history_edit_photos_hint",e)}</span>
        </div>
        ${t?a`<div class="error">${t}</div>`:p}
        <div class="actions">
          <button class="delete-entry" @click=${this._delete} ?disabled=${this._saving} title=${s("history_delete_entry",e)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon> ${s("history_delete_entry",e)}
          </button>
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${s("cancel",e)}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?s("saving",e):s("save",e)}
          </button>
        </div>
      </div>
    `}_renderReadings(e,i){return this._readingRows.length>0?a`
        <div class="readings-block">
          <span class="parts-title">${s("readings_section",i)}</span>
          ${this._readingRows.map(t=>a`
            <label class="reading-row-edit">
              <span class="reading-row-name">${t.name}${t.unit?` (${t.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[t.id]??""}
                @input=${n=>{this._readingText={...this._readingText,[t.id]:n.target.value}}} />
            </label>
          `)}
        </div>`:e.reading_value==null&&e.task_type!=="reading"?p:a`
      <label>
        <span>${s("reading_value_label",i)}${e.reading_unit?` (${e.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${e.reading_value!=null?String(e.reading_value):""}
          @input=${t=>{let n=t.target.value,d=n===""?NaN:Number(n);this._set("reading_value",isNaN(d)?null:d)}} />
      </label>`}};L.styles=[de,w`
    :host { display: contents; }
    .backdrop {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 100;
    }
    .dialog {
      position: fixed; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: 95vw; max-width: 480px;
      background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
      color: var(--primary-text-color);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      padding: 20px;
      display: flex; flex-direction: column; gap: 12px;
      z-index: 101;
      max-height: 90vh; overflow: auto;
    }
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
  `],l([v({attribute:!1})],L.prototype,"hass",2),l([c()],L.prototype,"_open",2),l([c()],L.prototype,"_saving",2),l([c()],L.prototype,"_error",2),l([c()],L.prototype,"_draft",2),l([c()],L.prototype,"_partOptions",2),l([c()],L.prototype,"_partQty",2),l([c()],L.prototype,"_readingRows",2),l([c()],L.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",L);function ee(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function nt(r){return!r.startsWith("data:image/svg+xml,")&&!r.startsWith("data:image/png;base64,")?"":ee(r)}function Kt(r){return r.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var q=class extends E{constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(e,i){this._entryId=e,this._taskId=null,this._objectName=i,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}openForTask(e,i,t,n){this._entryId=e,this._taskId=i,this._objectName=t,this._taskName=n,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null;try{let i={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(i.task_id=this._taskId);let t=[this.hass.connection.sendMessagePromise({...i,action:"view"})];this._taskId&&t.push(this.hass.connection.sendMessagePromise({...i,action:"complete"}));let n=await Promise.all(t);if(e!==this._generateSeq)return;this._viewResult=n[0],n.length>1&&(this._completeResult=n[1])}catch(i){if(e!==this._generateSeq)return;let t=i?.code,n=i?.message;this._error=t==="no_url"||typeof n=="string"&&n.includes("No Home Assistant URL")?s("qr_error_no_url",this.lang):s("qr_error",this.lang)}finally{e===this._generateSeq&&(this._loading=!1)}}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,i=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,t=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),n=window.open("","_blank","width=600,height=500");if(!n)return;let d=this.lang||"en",_=ee(i),u=ee(t),h=!!this._completeResult,g=ee(s("qr_action_view",d)),f=ee(s("qr_action_complete",d));n.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${_}</title>
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
  .qr-col img{width:${h?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${_}</h2>
${u?`<div class="sub">${u}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${nt(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${g}</div>
  </div>
  ${h?`<div class="qr-col">
    <img src="${nt(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${f}</div>
  </div>`:""}
</div>
<div class="url">${ee(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),n.document.close()}_downloadSvg(e,i){let t=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),n=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;st(t,`qr-${Kt(n)}-${i}.svg`,"image/svg+xml")}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._error="",this._loading=!1}render(){if(!this._open)return a``;let e=this.lang||this.hass?.language||"en",i=this._taskName?`${s("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${s("qr_code",e)}: ${this._objectName}`,t=!!this._viewResult;return a`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i}</div>
        <div class="content">
          ${this._loading?a`<div class="loading">${s("qr_generating",e)}</div>`:this._error?a`<div class="error">${this._error}</div>`:t?a`
                    <div class="qr-pair">
                      <div class="qr-item">
                        <img
                          class="qr-image ${this._completeResult?"small":""}"
                          src="${this._viewResult.svg_data_uri}"
                          alt="QR Info"
                        />
                        <div class="qr-item-label">${s("qr_action_view",e)}</div>
                        <button class="dl-btn"
                          @click=${()=>this._downloadSvg(this._viewResult,"info")}>
                          <ha-icon icon="mdi:download"></ha-icon>
                          ${s("qr_download",e)}
                        </button>
                      </div>
                      ${this._completeResult?a`
                            <div class="qr-item">
                              <img
                                class="qr-image small"
                                src="${this._completeResult.svg_data_uri}"
                                alt="QR Complete"
                              />
                              <div class="qr-item-label">${s("qr_action_complete",e)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._completeResult,"complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${s("qr_download",e)}
                              </button>
                            </div>
                          `:p}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  `:p}
          <div class="action-row">
            <label>${s("qr_url_mode",e)}</label>
            <div class="action-toggle">
              <button class="toggle-btn ${this._urlMode==="companion"?"active":""}"
                @click=${()=>this._setUrlMode("companion")}>${s("qr_mode_companion",e)}</button>
              <button class="toggle-btn ${this._urlMode==="local"?"active":""}"
                @click=${()=>this._setUrlMode("local")}>${s("qr_mode_local",e)}</button>
              <button class="toggle-btn ${this._urlMode==="server"?"active":""}"
                @click=${()=>this._setUrlMode("server")}>${s("qr_mode_server",e)}</button>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._print}
            .disabled=${!t}
          >
            ${s("qr_print",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};q.styles=w`
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
  `,l([v({attribute:!1})],q.prototype,"hass",2),l([v()],q.prototype,"lang",2),l([c()],q.prototype,"_open",2),l([c()],q.prototype,"_loading",2),l([c()],q.prototype,"_error",2),l([c()],q.prototype,"_viewResult",2),l([c()],q.prototype,"_completeResult",2),l([c()],q.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",q);function at(r){let o=r.getFullYear(),e=String(r.getMonth()+1).padStart(2,"0"),i=String(r.getDate()).padStart(2,"0");return`${o}-${e}-${i}`}function Yt(r,o){if(o<=0)return 0;let e=typeof r=="number"&&Number.isFinite(r)?Math.trunc(r):0;return e<0?0:e%o}function Gt(r){return!!(r?.phases&&r.phase_sequence&&r.phase_sequence.length>0)}function ye(r){if(!r||!Gt(r))return null;let o=r.phase_sequence,e=Yt(r.phase_cursor,o.length),i=o[e],t=r.phases?.[i];return t?{id:i,name:t.name,index:e,count:o.length,notes:t.notes,checklist:t.checklist!==void 0?t.checklist:r.checklist??[],consumesParts:t.consumes_parts!==void 0?t.consumes_parts:r.consumes_parts??[],requiredFields:t.required_completion_fields!==void 0?t.required_completion_fields:r.required_completion_fields??[]}:null}function se(r){let o=ye(r);return o?`${o.index+1}/${o.count} \xB7 ${o.name}`:""}function ot(r){let o=r.task??null,e=o?ye(o):null,i=e?e.consumesParts:o?.consumes_parts||[],t=!!o?.part_ref,n=r.objects.find(u=>u.entry_id===r.entryId)?.parts||[],d=t?n.find(u=>u.id===o.part_ref.part_id):void 0,_=r.checklistsEnabled??!0;return{entry_id:r.entryId,task_id:r.taskId,task_name:r.taskName,checklist:e?_?e.checklist:[]:r.checklist??[],adaptive_enabled:!!r.adaptiveEnabled,required_completion_fields:e?e.requiredFields:o?.required_completion_fields||[],task_type:o?.type||"",reading_unit:o?.reading_unit||"",readings:o?.readings||[],reading_history:Ie(o?.history),parts:t?[]:Ke({consumes_parts:i},r.entryId,r.objects,r.lang),consumes_parts:t?[]:i,phase_label:e?se(o):"",require_tag_scan:!!o?.require_tag_scan,restock_default:t?d?.restock_quantity??1:null,restock_unit_cost:t?d?.cost??null:null,currency_symbol:te({currency_symbol:r.currencySymbol}),consumes_info:i.map(u=>We(u,r.entryId,r.objects,r.lang)),checklist_prefill:o?.checklist_progress||{},via_tag_scan:!!r.viaTagScan}}function lt(r,o,e){r.entryId=o.entry_id,r.taskId=o.task_id,r.taskName=o.task_name,r.lang=e,r.checklist=o.checklist??[],r.adaptiveEnabled=!!o.adaptive_enabled,r.requiredFields=o.required_completion_fields??[],r.taskType=o.task_type??"",r.readingUnit=o.reading_unit??"",r.readings=o.readings??[],r.readingHistory=o.reading_history??[],r.parts=o.parts??[],r.consumesParts=o.consumes_parts??[],r.phaseLabel=o.phase_label??"",r.requireTagScan=!!o.require_tag_scan,r.restockDefault=o.restock_default??null,r.restockUnitCost=o.restock_unit_cost??null,r.currencySymbol=te(o),r.consumesInfo=o.consumes_info??[],r.checklistPrefill=o.checklist_prefill??{},r.viaTagScan=!!o.via_tag_scan,r.open({viaTagScan:!!o.via_tag_scan})}var dt=r=>typeof r=="number"&&Number.isInteger(r)&&r>0;function Qt(r){return r&&dt(r.ref_no)?String(r.ref_no):null}function ct(r,o){let e=Qt(r);return e&&o&&dt(o.ref_no)?`${e}.${o.ref_no}`:null}function pt(r,o){return r?a`<span class="ref-chip" title=${o??""}>#${r}</span>`:p}var Zt=["completed","reset","skipped"];function Jt(r,o){return r.taskRef&&o.ref_no?`${r.taskRef}-${o.ref_no}`:null}function Xt(r,o){let e=ke(o);return e.length>0?a`<div class="history-photos">
        ${e.map(i=>a`<maintenance-history-photo .hass=${r} .docId=${i}></maintenance-history-photo>`)}
      </div>`:p}function ei(r,o){let e=o.lang,i=d=>A(d,e,{maximumFractionDigits:3}),t=d=>d==null?"":` (${d>=0?"+":""}${i(d)})`,n=Ee(r);return n.length>0?a`<div class="history-readings">
      ${n.map(d=>a`<span class="history-reading">
        <span class="history-reading-name">${d.name}</span>
        <span class="history-reading-value">${i(d.value)}${d.unit?` ${d.unit}`:""}${t(o.readingSlotDelta?.(r,d.id))}</span>
      </span>`)}
    </div>`:r.reading_value!=null?a`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${s("reading_label",e)}</span>
      <span class="history-reading-value">${i(r.reading_value)}${o.readingUnit?` ${o.readingUnit}`:""}${t(o.readingDelta?.(r))}</span>
    </span></div>`:p}function ht(r,o,e={}){let i=o.lang,{compact:t=!1,showRef:n=!0,showBadges:d=!0,showEdit:_=!0}=e,u=_&&Zt.includes(r.type);return a`
    <div class="history-entry${t?" compact":""}">
      ${t?p:a`<div class="history-icon ${r.type}">
            <ha-icon .icon=${xe[r.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        <div class="history-row">
          <strong>${s(r.type,i)}</strong>
          ${n?pt(Jt(o,r),s("ref_number",i)):p}
          ${d&&r.phase_id?a`<span class="history-phase-badge">${o.phaseNames?.[r.phase_id]||r.phase_id}</span>`:p}
          ${d&&r.auto?a`<span class="history-auto-badge">${s("history_auto",i)}</span>`:p}
          ${u?a`<button class="history-edit-btn"
                     title=${s("history_edit_button",i)}
                     @click=${()=>o.openEdit(r)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:p}
        </div>
        <div class="history-date">${Ne(r.timestamp,i)}</div>
        ${r.notes?a`<div>${r.notes}</div>`:p}
        ${Xt(o.hass,r)}
        ${ei(r,o)}
        ${r.cost!=null||r.duration!=null||r.trigger_value!=null?a`<div class="history-details">
              ${r.cost!=null?a`<span>${s("cost",i)}: ${J(r.cost,o.currencySymbol,i)}</span>`:p}
              ${r.duration!=null?a`<span>${s("duration",i)}: ${ne(r.duration,i)}</span>`:p}
              ${r.trigger_value!=null?a`<span>${s("trigger_val",i)}: ${r.trigger_value}</span>`:p}
            </div>`:p}
      </div>
    </div>
  `}function k(r){return r.toFixed(1)}function ut(r,o){let e=r.interval_analysis,i=e?.weibull_beta,t=e?.weibull_eta;if(i==null||t==null||t<=0)return p;let n=r.interval_days??0,d=r.suggested_interval??n;return a`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${s("weibull_reliability_curve",o)}
        ${ti(i,o)}
      </div>
      ${ii(i,t,n,d,o)}
      ${si(e,o)}
      ${e?.confidence_interval_low!=null?ri(e,r,o):p}
    </div>
  `}function ti(r,o){let e,i,t;return r<.8?(e="early_failures",i="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",t="beta_early_failures"):r<=1.2?(e="random_failures",i="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",t="beta_random_failures"):r<=3.5?(e="wear_out",i="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",t="beta_wear_out"):(e="highly_predictable",i="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",t="beta_highly_predictable"),a`
    <span class="beta-badge ${e}">
      <ha-svg-icon path="${i}"></ha-svg-icon>
      ${s(t,o)} (\u03B2=${A(r,o,2)})
    </span>
  `}function ii(r,o,e,i,t){let y=Math.max(e,i,o,1)*1.3,$=50,H=[];for(let N=0;N<=$;N++){let O=N/$*y,St=1-Math.exp(-Math.pow(O/o,r)),Tt=32+O/y*260,At=136-St*128;H.push([Tt,At])}let B=H.map(([N,O])=>`${k(N)},${k(O)}`).join(" "),Y="M32,136 "+H.map(([N,O])=>`L${k(N)},${k(O)}`).join(" ")+` L${k(H[$][0])},136 Z`,M=32+e/y*260,j=1-Math.exp(-Math.pow(e/o,r)),Q=136-j*128,Et=A((1-j)*100,t,0),$e=32+i/y*260,It=[0,.25,.5,.75,1];return a`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_weibull",t)}">
        ${It.map(N=>{let O=136-N*128;return Z`
            <line x1="${32}" y1="${k(O)}" x2="${292}" y2="${k(O)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${N===.5?"4,3":p}" />
            <text x="${28}" y="${k(O+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${A(N*100,t,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(y/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(y)}</text>

        <path d="${Y}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${B}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${e>0?Z`
          <line x1="${k(M)}" y1="${8}" x2="${k(M)}" y2="${k(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${k(M)}" cy="${k(Q)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${k(M+4)}" y="${k(Q-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${Et}%</text>
        `:p}

        ${i>0&&i!==e?Z`
          <line x1="${k($e)}" y1="${8}" x2="${k($e)}" y2="${k(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:p}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${s("weibull_failure_probability",t)}</span>
      ${e>0?a`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${s("current_interval_marker",t)}</span>`:p}
      ${i>0&&i!==e?a`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${s("recommended_marker",t)}</span>`:p}
    </div>
  `}function si(r,o){return a`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${s("characteristic_life",o)}</span>
        <span class="weibull-info-value">${Math.round(r.weibull_eta)} ${s("days",o)}</span>
      </div>
      ${r.weibull_r_squared!=null?a`
        <div class="weibull-info-item">
          <span>${s("weibull_r_squared",o)}</span>
          <span class="weibull-info-value">${A(r.weibull_r_squared,o,3)}</span>
        </div>
      `:p}
    </div>
  `}function ri(r,o,e){let i=r.confidence_interval_low,t=r.confidence_interval_high,n=o.suggested_interval??o.interval_days??0,d=o.interval_days??0,_=Math.max(0,i-5),h=t+5-_,g=(i-_)/h*100,f=(t-i)/h*100,x=(n-_)/h*100,y=d>0?(d-_)/h*100:-1;return a`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${s("confidence_interval",e)}: ${n} ${s("days",e)} (${i}\u2013${t})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${k(g)}%;width:${k(f)}%"></div>
        ${y>=0?a`<div class="confidence-marker current" style="left:${k(y)}%"></div>`:p}
        <div class="confidence-marker recommended" style="left:${k(x)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${s("confidence_conservative",e)} (${i}${s("days",e).charAt(0)})</span>
        <span class="confidence-text high">${s("confidence_aggressive",e)} (${t}${s("days",e).charAt(0)})</span>
      </div>
    </div>
  `}function _t(r,o,e){let i=r.degradation_trend!=null&&r.degradation_trend!=="insufficient_data",t=r.days_until_threshold!=null,n=r.environmental_factor!=null&&r.environmental_factor!==1;if(!i&&!t&&!n)return p;let d=r.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":r.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return a`
    <div class="prediction-section">
      ${r.sensor_prediction_urgency?a`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${s("sensor_prediction_urgency",o).replace("{days}",String(Math.round(r.days_until_threshold||0)))}
        </div>
      `:p}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${s("sensor_prediction",o)}
      </div>
      <div class="prediction-grid">
        ${i?a`
          <div class="prediction-item">
            <ha-svg-icon path="${d}"></ha-svg-icon>
            <span class="prediction-label">${s("degradation_trend",o)}</span>
            <span class="prediction-value ${r.degradation_trend}">${s("trend_"+r.degradation_trend,o)}</span>
            ${r.degradation_rate!=null?a`<span class="prediction-rate">${r.degradation_rate>0?"+":""}${A(r.degradation_rate,o,Math.abs(r.degradation_rate)>=10?0:1)} ${r.trigger_entity_info?.unit_of_measurement||""}/${s("day_short",o)}</span>`:p}
          </div>
        `:p}
        ${t?a`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${s("days_until_threshold",o)}</span>
            <span class="prediction-value prediction-days${r.days_until_threshold===0?" exceeded":r.sensor_prediction_urgency?" urgent":""}">${r.days_until_threshold===0?s("threshold_exceeded",o):"~"+Math.round(r.days_until_threshold)+" "+s("days",o)}</span>
            ${r.threshold_prediction_date?a`<span class="prediction-date">${G(r.threshold_prediction_date,o)}</span>`:p}
            ${r.threshold_prediction_confidence?a`<span class="confidence-dot ${r.threshold_prediction_confidence}"></span>`:p}
            ${(r.prediction_cycles??0)>0?a`<span class="prediction-cycles">${s("prediction_cycles",o)}: ${r.prediction_cycles}</span>`:p}
          </div>
        `:p}
        ${n&&e.environmental?a`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${s("environmental_adjustment",o)}</span>
            <span class="prediction-value">${A(r.environmental_factor,o,2)}x</span>
            ${r.environmental_entity?a`<span class="prediction-entity entity-link" @click=${_=>Fe(_,r.environmental_entity)}>${r.environmental_entity}</span>`:p}
          </div>
        `:p}
      </div>
    </div>
  `}function mt(r,o,e,i){let t=Math.max(r||1,o);return a`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${s("current",i)}: ${r??"\u2014"} ${r!=null?s("days",i):""}
        </div>
        <div class="interval-visual current"
          style="width: ${r!=null?Math.min(r/t*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${s("recommended",i)}: ${o} ${s("days",i)}
          <span class="confidence-badge ${e}">${s(`confidence_${e}`,i)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(o/t*100,100)}%"></div>
      </div>
    </div>
  `}var gt=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function vt(r,o,e){if(!e.seasonal||!r.seasonal_factor||r.seasonal_factor===1)return p;let i=gt.map(_=>s(_,o)),t=new Date().getMonth(),n=r.seasonal_factors||r.interval_analysis?.seasonal_factors||null,d=n&&n.length===12?n:i.map((_,u)=>{let h=r.seasonal_factor||1,g=Math.sin((u-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,h+g))});return a`
    <div class="seasonal-card-compact">
      <h4>${s("seasonal_awareness",o)}</h4>
      <div class="seasonal-mini-chart">
        ${d.map((_,u)=>{let h=_*40,g=_<.9?"low":_>1.1?"high":"normal";return a`
            <div class="seasonal-bar ${g} ${u===t?"current":""}"
                 style="height: ${h}px"
                 title="${i[u]}: ${A(_,o,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${s("shorter",o)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${s("normal",o)}</span>
        <span class="legend-item"><span class="dot high"></span> ${s("longer",o)}</span>
      </div>
    </div>
  `}function ft(r,o){return ni(r,o)}function ni(r,o){let e=r.seasonal_factors??r.interval_analysis?.seasonal_factors;if(!e||e.length!==12)return p;let i=r.interval_analysis?.seasonal_reason,t=new Date().getMonth(),n=300,d=100,_=8,h=d-_-4,g=Math.max(...e,1.5),f=n/12,x=f*.65,y=_+h-1/g*h;return a`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${s("seasonal_chart_title",o)}
        ${i?a`<span class="source-tag">${i==="learned"?s("seasonal_learned",o):s("seasonal_manual",o)}</span>`:p}
      </div>
      <svg viewBox="0 0 ${n} ${d}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_seasonal",o)}">
        <line x1="0" y1="${k(y)}" x2="${n}" y2="${k(y)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${e.map(($,H)=>{let B=$/g*h,Y=H*f+(f-x)/2,M=_+h-B,j=H===t,Q=$<1?"var(--success-color, #4caf50)":$>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return Z`
            <rect x="${k(Y)}" y="${k(M)}"
              width="${k(x)}" height="${k(B)}"
              fill="${Q}" opacity="${j?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${gt.map(($,H)=>a`<span class="seasonal-label ${H===t?"active-month":""}">${s($,o)}</span>`)}
      </div>
    </div>
  `}var S=class extends E{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._featuresLoaded=!1;this._currencySymbol=""}get _lang(){return P(this.hass)}async openFor(e,i){this._entryId=e,this._taskId=i,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=at(new Date),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){if(!this._featuresLoaded)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});e?.features&&(this._features={...this._features,...e.features}),this._currencySymbol=te(e?.budget),qe(e?.budget),this._featuresLoaded=!0}catch{}}close(){this._open=!1,this._task=null,this._error=""}async _loadTask(){if(!(!this._entryId||!this._taskId))try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._objectName=e.object?.name||"";let i=(e.tasks||[]).find(t=>t.id===this._taskId);this._task=i??null,this._taskRef=ct(e.object,i)}catch(e){this._error=T(e,this._lang)}}async _runWs(e){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(e),this._busy=!1,!0}catch(i){return this._error=T(i,this._lang),this._busy=!1,!1}}_notifyChanged(e){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:e},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||import("./dialog-mount-I2X5ADXT.js").then(async({openCompleteDialog:e})=>{let i=this._task,t=[];try{t=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}e(ot({entryId:this._entryId,taskId:this._taskId,taskName:i.name,task:i,objects:t,lang:this._lang,checklist:i.checklist||[],adaptiveEnabled:!!i.adaptive_config?.enabled,currencySymbol:this._currencySymbol}))&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||import("./dialog-mount-I2X5ADXT.js").then(({openEditTaskDialog:e})=>{e(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("./dialog-mount-I2X5ADXT.js").then(({openQrDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let e=s("delete_task_confirm",this._lang)||`Delete "${this._task?.name}"?`;if(!window.confirm(e))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let e=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})&&(this._toast=s("suggestion_applied",this._lang),this._notifyChanged("apply_suggestion"),await this._loadTask(),setTimeout(()=>{this._toast=""},2500))}async _reanalyzeInterval(){if(!(!this._entryId||!this._taskId)){this._busy=!0,this._error="";try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});this._toast=e.recommended_interval?`${s("reanalyze_result",this._lang)}: ${Me(e.recommended_interval,"days",this._lang)} (${e.data_points} pts)`:s("reanalyze_insufficient_data",this._lang),await this._loadTask(),setTimeout(()=>{this._toast=""},3500)}catch(e){this._error=T(e,this._lang)}finally{this._busy=!1}}}_onEditHistoryEntry(e){if(!this._entryId||!this._taskId)return;let i=Pe(this._entryId,this._taskId,e,this._task);import("./dialog-mount-I2X5ADXT.js").then(({openHistoryEditDialog:t})=>t(i))}_renderRecommendation(e){if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return p;let i=this._lang;return a`
      <div class="recommendation-card">
        <h4>${s("suggested_interval",i)}</h4>
        ${mt(e.interval_days,e.suggested_interval,e.interval_confidence||"medium",i)}
        <div class="recommendation-actions">
          <button class="btn primary"
            @click=${this._applySuggestion} ?disabled=${this._busy}>
            <ha-icon icon="mdi:check"></ha-icon>
            ${s("apply_suggestion",i)}
          </button>
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${s("reanalyze",i)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(e){let i=this._lang,t=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,n=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data"||e.days_until_threshold!=null||e.environmental_factor!=null&&e.environmental_factor!==1,d=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,_=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1;return!t&&!n&&!d&&!_?a`<div class="adaptive-empty">
        ${s("adaptive_no_data",i)}
      </div>`:a`
      <div class="adaptive-stack">
        ${this._toast?a`<div class="toast">${this._toast}</div>`:p}
        ${t?this._renderRecommendation(e):p}
        ${n?_t(e,i,this._features):p}
        ${d?ut(e,i):p}
        ${_?a`
          ${vt(e,i,this._features)}
          ${e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12?ft(e,i):p}
        `:p}
      </div>
    `}_renderDetails(e){let i=this._lang,t=e.history||[],n=t.filter(u=>u.type==="completed"),d=n.reduce((u,h)=>u+(typeof h.cost=="number"?h.cost:0),0),_=(()=>{let u=n.map(h=>typeof h.duration=="number"?h.duration:null).filter(h=>h!=null);return u.length?Math.round(u.reduce((h,g)=>h+g,0)/u.length):null})();return a`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${s("times_performed",i)}</span>
            <span class="stat-value">${n.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("total_cost",i)}</span>
            <span class="stat-value">${J(d,this._currencySymbol,i)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("avg_duration",i)}</span>
            <span class="stat-value">${ne(_,i)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${s("history",i)}</strong>
          <span class="history-count">${t.length}</span>
        </div>
        ${t.length===0?a`<div class="history-empty">${s("history_empty",i)}</div>`:a`
              <div class="history-list">
                ${[...t].reverse().slice(0,20).map(u=>ht(u,{lang:i,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:h=>this._onEditHistoryEntry(h),readingUnit:e.reading_unit,readingSlotDelta:(h,g)=>Te(t,h,g),taskRef:this._taskRef},{compact:!0}))}
                ${t.length>20?a`<div class="history-more">… +${t.length-20} ${s("older_entries",i)}</div>`:p}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return p;let e=this._lang,i=this._task,t=this.hass?.user?.is_admin??!0;return a`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${i?a`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${re[i.status]||"#ccc"}"></span>
                  <span class="task-name">${i.name}</span>
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("./dialog-mount-I2X5ADXT.js").then(({openObjectQuickActions:n})=>{n(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${i.next_due?a`<span><strong>${s("next_due",e)}:</strong> ${G(i.next_due,e)}</span>`:p}
                  ${i.last_performed?a`<span><strong>${s("last_performed",e)}:</strong> ${G(i.last_performed,e)}</span>`:p}
                  ${i.schedule?.kind&&!["manual","one_time"].includes(i.schedule.kind)||i.interval_days!=null?a`<span><strong>${s("interval",e)}:</strong> ${De(i,e)}</span>`:p}
                  ${se(i)?a`<span><strong>${s("phase_current",e)}:</strong> ${se(i)}</span>`:p}
                </div>
              </div>

              ${this._error?a`<div class="error">${this._error}</div>`:p}

              ${this._showSkip?a`
                    <div class="inline-form">
                      <label>${s("skip_reason",e)}</label>
                      <input type="text" .value=${this._skipReason}
                        @input=${n=>{this._skipReason=n.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${s("cancel",e)}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${s("skip",e)}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?a`
                    <div class="inline-form">
                      <label>${s("reset_to_date",e)}</label>
                      <ms-date-field
                        kind="date"
                        .hass=${this.hass}
                        .lang=${e}
                        .value=${this._resetDate}
                        @value-changed=${n=>{this._resetDate=n.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${s("cancel",e)}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${s("reset",e)}
                        </button>
                      </div>
                    </div>
                  `:a`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${this._onComplete} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${s("complete",e)}
                      </ha-button>
                      ${i.allow_skip!==!1?a`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${s("skip",e)}
                            </ha-button>
                          `:p}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${s("reset",e)}
                      </ha-button>
                    </div>
                    ${t?a`
                          <div class="actions secondary-row">
                            <ha-button size="small" appearance="outlined" variant="neutral" @click=${this._onEdit} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                              ${s("edit",e)}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="neutral" @click=${this._onQr} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                              ${s("qr_code",e)}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="neutral"
                              @click=${i.archived?this._onUnarchive:this._onArchive}
                              .disabled=${this._busy}>
                              <ha-icon slot="start" icon="${i.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                              ${i.archived?s("unarchive",e):s("archive",e)}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="danger" class="danger" @click=${this._onDelete} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                              ${s("delete",e)}
                            </ha-button>
                          </div>
                        `:p}
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?s("hide_details",e):s("show_details",e)}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?a`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?s("hide_stats",e):s("show_stats",e)}
                          </button>`:p}
                    </div>
                    ${this._showDetails?this._renderDetails(i):p}
                    ${this._showAdaptive?this._renderAdaptive(i):p}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${s("open_in_panel",e)}
                      </button>
                    </div>
                  `}
            `:a`<div class="loading">${s("loading",e)}</div>`}
      </div>
    `}};S.styles=[Ue,w`
    :host { display: contents; }
    .backdrop {
      position: fixed; inset: 0; z-index: 100;
      background: rgba(0,0,0,0.5);
    }
    .dialog {
      position: fixed; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: 95vw; max-width: 460px;
      max-height: 92vh; overflow: auto;
      background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
      color: var(--primary-text-color);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      padding: 20px;
      display: flex; flex-direction: column; gap: 14px;
      z-index: 101;
    }
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
  `],l([v({attribute:!1})],S.prototype,"hass",2),l([c()],S.prototype,"_open",2),l([c()],S.prototype,"_entryId",2),l([c()],S.prototype,"_taskId",2),l([c()],S.prototype,"_task",2),l([c()],S.prototype,"_objectName",2),l([c()],S.prototype,"_taskRef",2),l([c()],S.prototype,"_busy",2),l([c()],S.prototype,"_error",2),l([c()],S.prototype,"_showSkip",2),l([c()],S.prototype,"_showReset",2),l([c()],S.prototype,"_showDetails",2),l([c()],S.prototype,"_showAdaptive",2),l([c()],S.prototype,"_skipReason",2),l([c()],S.prototype,"_resetDate",2),l([c()],S.prototype,"_features",2),l([c()],S.prototype,"_toast",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",S);function yt(r){return!!r&&/^https?:\/\//i.test(r)}function bt(r){return r?customElements.get("ha-markdown")?a`<ha-markdown class="notes-md" .content=${r} breaks></ha-markdown>`:a`${r}`:p}var F=class extends E{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error=""}get _lang(){return P(this.hass)}async openFor(e){this._entryId=e,this._error="",this._open=!0,await this._load()}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._data=e}catch(e){this._error=T(e,this._lang)}}_onEditObject(){!this._entryId||!this._data||import("./dialog-mount-I2X5ADXT.js").then(({openEditObjectDialog:e})=>{e(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("./dialog-mount-I2X5ADXT.js").then(({openCreateTaskDialog:e})=>{e(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data)return;let e=s("delete_object_confirm",this._lang)||`Delete "${this._data.object.name}" and all its tasks?`;if(window.confirm(e)){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(i){this._error=T(i,this._lang)}finally{this._busy=!1}}}async _onArchiveObject(){if(!this._entryId||!this._data)return;let e=!!this._data.object.archived;if(!e){let i=s("confirm_archive_object",this._lang);if(!window.confirm(i))return}this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(i){this._error=T(i,this._lang)}finally{this._busy=!1}}_onTaskClick(e){this._entryId&&import("./dialog-mount-I2X5ADXT.js").then(({openTaskQuickActions:i})=>{i(this._entryId,e)})}render(){if(!this._open)return p;let e=this._lang,i=this._data,t=i?.object,n=i?.tasks||[],d=this.hass?.user?.is_admin??!0;return a`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${i&&t?a`
              <div class="header">
                <div class="title">${t.name}</div>
                ${this._renderMetaRow(t)}
              </div>

              ${this._error?a`<div class="error">${this._error}</div>`:p}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${s("tasks",e)}</strong>
                  <span class="count">${n.length}</span>
                </div>
                ${n.length===0?a`<div class="empty">${s("no_tasks",e)}</div>`:a`
                      <div class="task-list">
                        ${n.map(_=>a`
                          <div class="task-row" @click=${()=>this._onTaskClick(_.id)}>
                            <span class="status-dot" style="background: ${re[_.status]||"#ccc"}"></span>
                            <span class="task-name">${_.name}</span>
                            <span class="task-status">${s(_.status||"ok",e)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${t.notes?a`
                    <div class="notes-section">
                      <strong>${s("object_notes_label",e)}</strong>
                      <div class="notes-body">${bt(t.notes)}</div>
                    </div>
                  `:p}

              ${d?a`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${s("add_task",e)}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${s("edit",e)}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${t.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${t.archived?s("unarchive_object",e):s("archive_object",e)}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${s("delete",e)}
                      </button>
                    </div>
                  `:p}
            `:a`<div class="loading">${s("loading",e)}</div>`}
      </div>
    `}_renderMetaRow(e){let i=this._lang,t=[];return e.area_id&&t.push([s("area",i),e.area_id]),e.manufacturer&&t.push([s("manufacturer",i),e.manufacturer]),e.model&&t.push([s("model",i),e.model]),e.serial_number&&t.push([s("serial_number_label",i),e.serial_number]),e.installation_date&&t.push([s("installed",i),e.installation_date]),e.warranty_expiry&&t.push([s("warranty",i),e.warranty_expiry]),e.documentation_url&&t.push([s("documentation_url_label",i),e.documentation_url]),t.length===0?p:a`
      <div class="meta">
        ${t.map(([n,d])=>a`
            <div class="meta-item">
              <span class="meta-label">${n}</span>
              <span class="meta-value">${yt(d)?a`<a href="${d}" target="_blank" rel="noopener noreferrer">${d}</a>`:d}</span>
            </div>
          `)}
      </div>
    `}};F.styles=w`
    :host { display: contents; }
    .backdrop {
      position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.5);
    }
    .dialog {
      position: fixed; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: 95vw; max-width: 480px;
      max-height: 92vh; overflow: auto;
      background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
      color: var(--primary-text-color);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      padding: 20px; z-index: 101;
      display: flex; flex-direction: column; gap: 14px;
    }
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
  `,l([v({attribute:!1})],F.prototype,"hass",2),l([c()],F.prototype,"_open",2),l([c()],F.prototype,"_entryId",2),l([c()],F.prototype,"_data",2),l([c()],F.prototype,"_busy",2),l([c()],F.prototype,"_error",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",F);var be={features:{adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1},defaultWarningDays:7,rowActionStyle:"buttons_compact"};function $t(){let r=window;return r.__msSettingsCache??={promise:null}}function ce(r){let o=$t();if(o.promise)return o.promise;let e=r.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(i=>({features:i.features??be.features,defaultWarningDays:i.general?.default_warning_days??7,rowActionStyle:i.general?.row_action_style??be.rowActionStyle})).catch(()=>(o.promise===e&&(o.promise=null),be));return o.promise=e,e}function xt(){$t().promise=null}var kt="maintenance-object-dialog",wt="maintenance-task-dialog",ai="maintenance-history-edit-dialog",oi="maintenance-complete-dialog",li="maintenance-qr-dialog",di="maintenance-task-quick-actions-dialog",ci="maintenance-object-quick-actions-dialog";function pe(){return document.querySelector("home-assistant")?.hass}function pi(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function z(r){let o=pi(),e=o.querySelector(r)??document.body.querySelector(r);return e?e.parentNode!==o&&o.appendChild(e):(e=document.createElement(r),o.appendChild(e)),e}function V(r){let o=pe();if(!o)return!1;r.hass=o;let e=P(o);return Le(e)||Re(e).then(()=>{r.requestUpdate?.()}),He(o.locale,o.config?.country),!0}function Cn(r){return ce(r).then(o=>o.rowActionStyle)}function Pn(){xt()}function Ln(){let r=z(kt);return V(r)?(r.openCreate(),!0):!1}function Rn(r,o){let e=z(kt);return V(e)?(e.openEdit(r,o),!0):!1}function qn(r="",o){let e=z(wt);if(!V(e))return!1;let i=pe();return i?((async()=>{let t=await ce(i),n=e;n.checklistsEnabled=t.features.checklists,n.scheduleTimeEnabled=t.features.schedule_time,n.completionActionsEnabled=t.features.completion_actions,n.defaultWarningDays=t.defaultWarningDays,n.openCreate(r,o)})(),!0):!1}function Hn(r,o){let e=z(wt);if(!V(e))return!1;let i=pe();return i?((async()=>{try{let[t,n]=await Promise.all([i.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:r}),ce(i)]),d=(t.tasks||[]).find(u=>u.id===o);if(!d){console.warn(`openEditTaskDialog: task ${o} not found in entry ${r}`);return}let _=e;_.checklistsEnabled=n.features.checklists,_.scheduleTimeEnabled=n.features.schedule_time,_.completionActionsEnabled=n.features.completion_actions,_.defaultWarningDays=n.defaultWarningDays,await _.openEdit(r,d)}catch(t){console.warn("openEditTaskDialog: failed to load task/features",t)}})(),!0):!1}function Nn(r){let o=z(ai);return V(o)?(o.openEdit(r),!0):!1}function Mn(r){let o=z(oi);return V(o)?(lt(o,r,P(pe())),!0):!1}function On(r){let o=z(li);return V(o)?(o.openForTask(r.entry_id,r.task_id,r.object_name,r.task_name),!0):!1}function Dn(r,o){let e=z(di);return V(e)?(e.openFor(r,o),!0):!1}function Fn(r){let o=z(ci);return V(o)?(o.openFor(r),!0):!1}export{Pn as __resetSettingsCacheForTests,Cn as getRowActionStyle,Mn as openCompleteDialog,Ln as openCreateObjectDialog,qn as openCreateTaskDialog,Rn as openEditObjectDialog,Hn as openEditTaskDialog,Nn as openHistoryEditDialog,Fn as openObjectQuickActions,On as openQrDialog,Dn as openTaskQuickActions};
