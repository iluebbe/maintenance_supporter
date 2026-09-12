/*! maintenance_supporter frontend 2.83.0 */
import{a as pt,b as $t,c as ht,d as xt,e as kt,f as wt,g as Et,h as It}from"./chunk-HCTB4FTI.js";import"./chunk-LGCDCJW5.js";import{A,a as k,b as a,c as J,d as h,e as w,f as g,g as c,h as tt,i as s,k as P,l as St,m as Tt,n as At,o as Ct,p as T,q as et,r as G,s as Pt,t as Lt,u as ut,v as qt,w as Rt,x as Ht,y as Nt,z as Mt}from"./chunk-OXDZFC6Q.js";import{a as l,b as rt}from"./chunk-LRS2DZQN.js";var C=class extends w{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1;this.multiline=!1;this.rows=3}_onInput(t){let i=t.target.value;this.value=i,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:i}}))}render(){return a`
      <label class="field">
        ${this.label?a`<span class="label">${this.label}${this.required?a`<span class="req">*</span>`:h}</span>`:h}
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
          step=${this.step??h}
          min=${this.min??h}
          max=${this.max??h}
          pattern=${this.pattern??h}
          @input=${this._onInput}
          @change=${this._onInput}
        />`}
        ${this.helper?a`<span class="helper">${this.helper}</span>`:h}
      </label>
    `}};C.styles=k`
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
  `,l([g()],C.prototype,"label",2),l([g()],C.prototype,"value",2),l([g()],C.prototype,"placeholder",2),l([g()],C.prototype,"type",2),l([g({type:Boolean})],C.prototype,"required",2),l([g({type:Boolean})],C.prototype,"disabled",2),l([g()],C.prototype,"step",2),l([g()],C.prototype,"min",2),l([g()],C.prototype,"max",2),l([g()],C.prototype,"pattern",2),l([g()],C.prototype,"helper",2),l([g({type:Boolean})],C.prototype,"multiline",2),l([g({type:Number})],C.prototype,"rows",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",C);var E=class extends w{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._entryId=null}get _lang(){return P(this.hass)}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId="",this._error="",this._open=!0}openEdit(t,i){this._entryId=t,this._name=i.name||"",this._manufacturer=i.manufacturer||"",this._model=i.model||"",this._serialNumber=i.serial_number||"",this._areaId=i.area_id||"",this._installationDate=i.installation_date||"",this._warrantyExpiry=i.warranty_expiry||"",this._documentationUrl=i.documentation_url||"",this._notes=i.notes||"",this._haDeviceId=i.ha_device_id||"",this._parentEntryId=i.parent_entry_id||"",this._error="",this._open=!0}async _save(){if(!this._loading&&this._name.trim()){this._loading=!0,this._error="";try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}catch(t){this._error=A(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_parentChoices(){return(this.objects||[]).filter(t=>t.entry_id!==this._entryId)}_close(){this._open=!1}render(){if(!this._open)return a``;let t=this._lang,i=this._entryId?s("edit_object",t):s("new_object",t);return a`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i}</div>
        <div class="content">
          ${this._error?a`<div class="error">${this._error}</div>`:h}
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
          ${this._parentChoices().length?a`<label class="textarea-field">
                <span class="textarea-label">${s("parent_object_optional",t)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${e=>this._parentEntryId=e.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${s("parent_none",t)}
                  </option>
                  ${this._parentChoices().map(e=>a`<option
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
    `}};E.styles=k`
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
  `,l([g({attribute:!1})],E.prototype,"hass",2),l([g({attribute:!1})],E.prototype,"objects",2),l([c()],E.prototype,"_open",2),l([c()],E.prototype,"_loading",2),l([c()],E.prototype,"_error",2),l([c()],E.prototype,"_name",2),l([c()],E.prototype,"_manufacturer",2),l([c()],E.prototype,"_model",2),l([c()],E.prototype,"_serialNumber",2),l([c()],E.prototype,"_areaId",2),l([c()],E.prototype,"_installationDate",2),l([c()],E.prototype,"_warrantyExpiry",2),l([c()],E.prototype,"_documentationUrl",2),l([c()],E.prototype,"_notes",2),l([c()],E.prototype,"_haDeviceId",2),l([c()],E.prototype,"_parentEntryId",2),l([c()],E.prototype,"_entryId",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",E);var Ot=["#c62828","#ad1457","#6a1b9a","#4527a0","#283593","#1565c0","#00838f","#2e7d32","#558b2f","#ef6c00","#6d4c41","#546e7a"];function be(n){let o=(n||"").split(/\s+/).filter(Boolean);return o.length===0?"?":o.length===1?o[0][0].toUpperCase():(o[0][0]+o[o.length-1][0]).toUpperCase()}function ye(n){let o=0;for(let t of n)o=o*31+t.charCodeAt(0)>>>0;return Ot[o%Ot.length]}function Ft(n){return n?{id:n.id,name:n.name,initials:n.initials||be(n.name),color:n.color||ye(n.id)}:null}var nt=class{constructor(o){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=o}updateHass(o){this.hass=o}async getUsers(o=!1){let t=Date.now();if(!o&&this.usersCache&&t-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=i.users,this.cacheTimestamp=t,this.usersCache}catch(i){return console.error("Failed to fetch users:",i),this.usersCache||[]}}async assignUser(o,t,i){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:o,task_id:t,user_id:i})}async getTasksByUser(o){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:o})).tasks}getUserName(o){return!o||!this.usersCache?null:this.usersCache.find(i=>i.id===o)?.name||null}getPerson(o){return Ft(this.getUser(o))}getUser(o){return!o||!this.usersCache?null:this.usersCache.find(t=>t.id===o)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(o){return o?o===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}};function F(n){return`${n.entry_id??""}\0${n.part_id}`}function Dt(n,o,t,i){let e=!!n.entry_id&&n.entry_id!==o,r=e?n.entry_id:o,d=t.find(v=>v.entry_id===r),p=(d?.parts||[]).find(v=>v.id===n.part_id)||null,_=e&&d?.object?.name||"",u=p?.name||s("shared_part_unknown",i);return{part:p,foreign:e,ownerName:_,label:_?`${u} (${_})`:u}}function jt(n,o,t,i){let{part:e,label:r}=Dt(n,o,t,i),d=e&&e.stock!==null&&e.stock!==void 0?` (${e.stock}${e.unit?" "+e.unit:""})`:"",p=e?.storage_location?` \u2014 ${e.storage_location}`:"";return`${n.quantity}\xD7 ${r}${d}${p}`}function zt(n,o,t,i){let r=(t.find(p=>p.entry_id===o)?.parts||[]).map(p=>({...p})),d=new Set(r.map(p=>F({part_id:p.id})));for(let p of n?.consumes_parts||[]){if(!p.entry_id||p.entry_id===o)continue;let _=F(p);if(d.has(_))continue;d.add(_);let{part:u,ownerName:v}=Dt(p,o,t,i);r.push({id:p.part_id,name:u?.name||s("shared_part_unknown",i),unit:u?.unit,stock:u?.stock??null,storage_location:u?.storage_location,entry_id:p.entry_id,owner_name:v})}return r}var _t=["sensor","binary_sensor","number","input_number","input_boolean","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock"],Ut=["sensor"],Vt=["temperature","humidity","pressure"];var mt=["notes","cost","duration","photo","user"],it={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"};var xe=["cleaning","inspection","replacement","calibration","service","reading","custom"],ke=["low","normal","high"],we=["time_based","weekdays","nth_weekday","day_of_month","sensor_based","one_time","manual"],at=["weekdays","nth_weekday","day_of_month"],Bt=["time_based","one_time",...at],Wt=["threshold","counter","state_change","runtime"],Ee=[...Wt,"compound"],z={alpha:"0.3",min:"7",max:"365"};function Ie(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",carry:{}}}var Se=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states"]);function Te(n){return{entityIds:(n.entity_ids||(n.entity_id?[n.entity_id]:[])).join(", "),type:n.type||"threshold",attribute:n.attribute||"",above:n.trigger_above?.toString()??"",below:n.trigger_below?.toString()??"",equals:n.trigger_equals?.toString()??"",notEquals:n.trigger_not_equals?.toString()??"",forMinutes:n.trigger_for_minutes?.toString()??"0",targetValue:n.trigger_target_value?.toString()??"",deltaMode:n.trigger_delta_mode||!1,fromState:n.trigger_from_state||"",toState:n.trigger_to_state||"",targetChanges:n.trigger_target_changes?.toString()??"",runtimeHours:n.trigger_runtime_hours?.toString()??"",onStates:(n.trigger_on_states||[]).join(", "),carry:Object.fromEntries(Object.entries(n).filter(([t])=>!Se.has(t)&&!t.startsWith("_")))}}function Ae(n){let o=n.entityIds.split(",").map(i=>i.trim()).filter(Boolean);if(o.length===0)return null;let t={...n.carry||{},entity_id:o[0],entity_ids:o,type:n.type};if(n.attribute&&(t.attribute=n.attribute),n.type==="threshold"){let i=parseFloat(n.above);isNaN(i)||(t.trigger_above=i);let e=parseFloat(n.below);isNaN(e)||(t.trigger_below=e);let r=parseFloat(n.equals);isNaN(r)||(t.trigger_equals=r);let d=parseFloat(n.notEquals);isNaN(d)||(t.trigger_not_equals=d);let p=parseInt(n.forMinutes,10);isNaN(p)||(t.trigger_for_minutes=p)}else if(n.type==="counter"){let i=parseFloat(n.targetValue);isNaN(i)||(t.trigger_target_value=i),t.trigger_delta_mode=n.deltaMode}else if(n.type==="state_change"){n.fromState&&(t.trigger_from_state=n.fromState),n.toState&&(t.trigger_to_state=n.toState);let i=parseInt(n.targetChanges,10);isNaN(i)||(t.trigger_target_changes=i)}else if(n.type==="runtime"){let i=parseFloat(n.runtimeHours);isNaN(i)||(t.trigger_runtime_hours=i);let e=(n.onStates||"").split(",").map(r=>r.trim()).filter(Boolean);e.length>0&&(t.trigger_on_states=e)}return t}function Ce(n){return Array.from({length:7},(o,t)=>ut(t,n,"short"))}function Pe(n){return Array.from({length:12},(o,t)=>qt(t,n,"short"))}var m=class m extends w{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.defaultWarningDays=7;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._entryId="";this._taskId=null;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._priority="normal";this._labels="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._notifyEnabled=!0;this._readingUnit="";this._readings=[];this._consumesParts={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._scheduleTimeOn=!1;this._actionService="";this._actionTargetEntity="";this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=z.alpha;this._adaptiveMin=z.min;this._adaptiveMax=z.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return P(this.hass)}async openCreate(t,i){this._entryId=t,this._taskId=null,this._error="",!t&&i&&i.length>0?(this._objectChoices=i.map(e=>({entry_id:e.entry_id,name:e.object.name})).sort((e,r)=>e.name.localeCompare(r.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(t,i){this._entryId=t,this._taskId=i.id,this._error="",this._objectChoices=[],this._name=i.name,this._type=i.type,this._scheduleType=i.schedule_type,this._intervalDays=i.interval_days!=null?String(i.interval_days):"",this._intervalUnit=i.interval_unit||"days",this._dueDate=i.due_date||"";let e=i.schedule;this._weekdays=e?.kind==="weekdays"?[...e.weekdays??[]]:[],this._nth=e?.kind==="nth_weekday"?String(e.nth??1):"1",this._nthWeekday=e?.kind==="nth_weekday"?String(e.weekday??5):"5",this._domDay=e?.kind==="day_of_month"&&(e.day??1)>=1?String(e.day??1):"1",this._domLastDay=e?.kind==="day_of_month"&&e.day===-1,this._domBusiness=e?.kind==="day_of_month"&&e.business===!0,this._calOffset=e?.offset?String(e.offset):"0",this._seasonMonths=Array.isArray(e?.season_months)?[...e.season_months]:[];let r=e?.ends;r&&typeof r.count=="number"?(this._endsMode="count",this._endsCount=String(r.count),this._endsUntil=""):r&&typeof r.until=="string"?(this._endsMode="until",this._endsUntil=r.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=i.warning_days.toString(),this._earliestCompletionDays=i.earliest_completion_days!=null?String(i.earliest_completion_days):"",this._intervalAnchor=i.interval_anchor||"completion",this._notes=i.notes||"",this._documentationUrl=i.documentation_url||"",this._customIcon=i.custom_icon||"",this._priority=i.priority||"normal",this._labels=(i.labels||[]).join(", "),this._enabled=i.enabled!==!1,this._lastPerformed=i.last_performed||"",this._nfcTagId=i.nfc_tag_id||"",this._requireTagScan=!!i.require_tag_scan,this._allowSkip=i.allow_skip!==!1,this._notifyEnabled=i.notify_enabled!==!1,this._readingUnit=i.reading_unit||"",this._readings=(i.readings||[]).map(u=>({...u})),this._consumesParts=Object.fromEntries((i.consumes_parts||[]).map(u=>[F(u),{...u}])),this._responsibleUserId=i.responsible_user_id||null,this._assigneePool=[...i.assignee_pool||[]],this._rotationStrategy=i.rotation_strategy||"",this._checklistText=(i.checklist||[]).join(`
`),this._phaseDefs=Object.entries(i.phases||{}).map(([u,v])=>{let{name:y,checklist:$,consumes_parts:f,required_completion_fields:S,...H}=v,B=v.consumes_parts||[],K=B.findIndex(j=>!j.entry_id),M=K>=0?B[K]:void 0;return{id:u,name:v.name||u,checklistText:(v.checklist||[]).join(`
`),partId:M?.part_id||"",partQty:M?.quantity!=null?String(M.quantity):"",reqOverride:v.required_completion_fields!==void 0,reqFields:[...v.required_completion_fields||[]],extraParts:B.filter((j,Q)=>Q!==K).map(j=>({...j})),carry:H}}),this._phaseSeq=[...i.phase_sequence||[]],this._requiredCompletion=[...i.required_completion_fields||[]],this._scheduleTime=i.schedule_time||"",this._scheduleTimeOn=!!i.schedule_time;let d=i.on_complete_action;if(d&&d.service){this._actionService=d.service;let u=d.target?.entity_id;this._actionTargetEntity=Array.isArray(u)?u[0]||"":u||"",this._actionData=d.data&&typeof d.data=="object"?{...d.data}:{},this._actionDataJsonFallback=""}else this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="";let p=i.quick_complete_defaults;this._qcNotes=p?.notes||"",this._qcCost=p?.cost!=null?String(p.cost):"",this._qcDuration=p?.duration!=null?String(p.duration):"",this._qcFeedback=p?.feedback||"";let _=i.adaptive_config||{};if(this._environmentalEntity=_.environmental_entity||"",this._environmentalAttribute=_.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!_.enabled,this._adaptiveAlpha=_.ewa_alpha?.toString()??z.alpha,this._adaptiveMin=_.min_interval_days?.toString()??z.min,this._adaptiveMax=_.max_interval_days?.toString()??z.max,this._adaptiveSeasonal=_.seasonal_enabled!==!1,this._adaptivePrediction=_.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),i.trigger_config){let u=i.trigger_config;this._triggerEntityId=u.entity_id||u.entity_ids&&u.entity_ids[0]||"",this._triggerEntityIds=u.entity_ids||(u.entity_id?[u.entity_id]:[]),this._triggerEntityLogic=u.entity_logic||"any",this._triggerAttribute=u.attribute||"",this._triggerType=u.type||"threshold",this._triggerAbove=u.trigger_above?.toString()||"",this._triggerBelow=u.trigger_below?.toString()||"",this._triggerEquals=u.trigger_equals?.toString()||"",this._triggerNotEquals=u.trigger_not_equals?.toString()||"",this._triggerForMinutes=u.trigger_for_minutes?.toString()||"0",this._triggerCombinator=u.trigger_combinator==="all"?"all":"any",this._triggerTargetValue=u.trigger_target_value?.toString()||"",this._triggerDeltaMode=u.trigger_delta_mode||!1,this._triggerBaselineValue=u.trigger_baseline_value?.toString()||"",this._liveBaselineValue=i.trigger_baseline_value??null,this._autoCompleteOnRecovery=u.auto_complete_on_recovery||!1,this._triggerFromState=u.trigger_from_state||"",this._triggerToState=u.trigger_to_state||"",this._triggerTargetChanges=u.trigger_target_changes?.toString()||"",this._triggerRuntimeHours=u.trigger_runtime_hours?.toString()||"",this._triggerRuntimeMaxSession=u.trigger_runtime_max_session_seconds?.toString()||"",this._triggerOnStates=(u.trigger_on_states||[]).join(", "),u.type==="compound"?(this._compoundLogic=u.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(u.conditions||[]).map(Te)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._priority="normal",this._labels="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._readingUnit="",this._readings=[],this._consumesParts={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._scheduleTimeOn=!1,this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=z.alpha,this._adaptiveMin=z.min,this._adaptiveMax=z.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="",this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._triggerAttribute="",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerEquals="",this._triggerNotEquals="",this._triggerForMinutes="0",this._triggerCombinator="any",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges="",this._triggerRuntimeHours="",this._triggerRuntimeMaxSession="",this._triggerOnStates="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new nt(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(t){console.error("Failed to load users:",t),this._availableUsers=[]}}_toggleAssignee(t){this._assigneePool=this._assigneePool.includes(t)?this._assigneePool.filter(i=>i!==t):[...this._assigneePool,t]}async _testAction(){let t=this._actionService.trim();if(!t||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(t)){this._actionTestResult="error",this._actionTestError="Invalid service format (expected 'domain.service')",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[i,e]=t.split(".");if(!this.hass?.services?.[i]?.[e]){this._actionTestResult="error",this._actionTestError=`Service "${t}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let r=this._actionTargetEntity.trim();if(r){let d=r.split(".")[0];if(d!==i&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(i)){this._actionTestResult="error",this._actionTestError=`Service "${t}" only works on ${i}.* entities; entity "${r}" is in ${d}.* \u2014 pick a service that matches the entity domain (e.g. ${d}.${e})`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[r]){this._actionTestResult="error",this._actionTestError=`Target entity "${r}" not found in Home Assistant \u2014 the entity may have been renamed or its integration removed.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let t=JSON.parse(this._actionDataJsonFallback);if(t&&typeof t=="object"&&!Array.isArray(t))return t}catch{}return{...this._actionData}}_serviceSchema(){let t=this._actionService.trim();if(!t||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(t))return null;let[i,e]=t.split("."),r=this.hass?.services?.[i]?.[e]?.fields;return!r||Object.keys(r).length===0?null:Object.entries(r).map(([d,p])=>({name:d,required:!!p.required,selector:p.selector||{text:{}}}))}_renderCompletionActionsSection(t){if(!this.completionActionsEnabled)return h;let i=this._serviceSchema();return a`
      <details class="ca-section">
        <summary>${s("on_complete_action_title",t)}</summary>
        <p class="field-help">${s("on_complete_action_desc",t)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${e=>{this._actionService=e.detail.value||"";let r=this._serviceSchema();if(r){let d=new Set(r.map(p=>p.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([p])=>d.has(p)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>s("on_complete_action_target",t)}
          @value-changed=${e=>{let r=e.detail.value;this._actionTargetEntity=r.target_entity||""}}
        ></ha-form>
        <p class="field-help ca-domain-hint">
          ${s("on_complete_action_target_hint",t)}
        </p>
        ${i?a`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${i}
                .data=${this._actionData}
                @value-changed=${e=>{this._actionData={...e.detail.value}}}
              ></ha-form>
            `:a`
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
          ${this._actionTestResult==="ok"?a`<span class="ca-test-ok">${s("on_complete_action_test_success",t)}</span>`:h}
          ${this._actionTestResult==="error"?a`<div class="ca-test-error-block">
                <span class="ca-test-error">${s("on_complete_action_test_failed",t)}</span>
                ${this._actionTestError?a`<div class="ca-test-error-detail">${this._actionTestError}</div>`:h}
              </div>`:h}
        </div>
      </details>

      <details class="ca-section">
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
      </details>
    `}async _loadParts(){if(this.parts=[],!!this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this.parts=t.parts||[],this._partsLoadFailed=!1}catch{this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){if(this._foreignOwners=[],!!this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._foreignOwners=(t.objects||[]).filter(i=>i.entry_id!==this._entryId&&(i.parts||[]).length>0).map(i=>({entry_id:i.entry_id,name:i.object?.name||i.entry_id,parts:i.parts||[]})).sort((i,e)=>i.name.localeCompare(e.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=t.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(t){!t||!this.hass||this._conditionAttrOptions[t]||this._conditionAttrPending.has(t)||(this._conditionAttrPending.add(t),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:t}).then(i=>{let e=i;this._conditionAttrOptions={...this._conditionAttrOptions,[t]:{suggested:e.suggested_attributes||[],available:e.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[t]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(t){if(!t||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:t});this._entityDomain=i.domain||"",this._suggestedAttributes=i.suggested_attributes||[],this._availableAttributes=i.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(t=>!!t.entry_id)}_renderConsumesRow(t,i){let e=F({part_id:t.id,entry_id:i}),r=this._consumesParts[e],d=i?{part_id:t.id,quantity:1,entry_id:i}:{part_id:t.id,quantity:1};return a`
      <div class="consumes-row">
        <label class="consumes-check">
          <input
            type="checkbox"
            .checked=${r!==void 0}
            @change=${p=>{let _={...this._consumesParts};p.target.checked?_[e]=_[e]||d:delete _[e],this._consumesParts=_}}
          />
          <span>${t.name}${t.unit?` (${t.unit})`:""}</span>
        </label>
        ${r!==void 0?a`<input
              class="consumes-qty"
              type="number"
              min="0.01"
              max="999"
              step="0.01"
              .value=${String(r.quantity)}
              @input=${p=>{let _=parseFloat(p.target.value);this._consumesParts={...this._consumesParts,[e]:{...d,quantity:Number.isFinite(_)&&_>=.01?_:1}}}}
            />`:h}
      </div>
    `}_toggleRequired(t,i){let e=new Set(this._requiredCompletion);i?e.add(t):e.delete(t),this._requiredCompletion=[...e]}_patchReading(t,i){this._readings=this._readings.map(e=>e.id===t?{...e,...i}:e)}_renderReadingsEditor(t){let i=Et(this._readings);return a`
      <div class="readings-editor">
        <div class="field-label">${s("readings_section",t)}</div>
        <div class="field-help">${s("readings_hint",t)}</div>
        ${this._readings.map(e=>a`
          ${i.has(e.id)?a`<div class="field-help reading-dup">${s("reading_duplicate_name",t)}</div>`:h}
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
        ${this._readings.length<20?a`
          <ha-button appearance="plain" class="reading-add"
            @click=${()=>this._readings=[...this._readings,{id:$t(),name:"",unit:this._readings.length?this._readings[this._readings.length-1].unit:this._readingUnit}]}>
            <ha-icon icon="mdi:plus"></ha-icon> ${s("reading_add",t)}
          </ha-button>`:h}
      </div>
    `}_phaseSlug(t){let i=t.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",e=i,r=2;for(;this._phaseDefs.some(d=>d.id===e);)e=`${i}-${r++}`;return e}_addPhaseDef(){let t=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:t,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(t){this._phaseDefs=this._phaseDefs.filter(i=>i.id!==t),this._phaseSeq=this._phaseSeq.filter(i=>i!==t)}_patchPhaseDef(t,i){this._phaseDefs=this._phaseDefs.map(e=>e.id===t?{...e,...i}:e)}_renderPhasesEditor(t){let i=e=>this._phaseDefs.find(r=>r.id===e)?.name||e;return a`
      <h3>${s("phases_section",t)}</h3>
      <div class="field-help">${s("phases_hint",t)}</div>
      ${this._phaseDefs.map(e=>a`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${s("phase_name",t)}"
              .value=${e.name}
              @input=${r=>this._patchPhaseDef(e.id,{name:r.target.value})}
            ></ms-textfield>
            ${this.parts.length?a`
              <select
                class="phase-part"
                .value=${e.partId}
                @change=${r=>this._patchPhaseDef(e.id,{partId:r.target.value})}
              >
                <option value="">—</option>
                ${this.parts.map(r=>a`<option value=${r.id} ?selected=${r.id===e.partId}>${r.name}</option>`)}
              </select>
              ${e.partId?a`
                <input class="phase-qty" type="number" min="0.01" step="0.01" .value=${e.partQty||"1"}
                  @input=${r=>this._patchPhaseDef(e.id,{partQty:r.target.value})} />
              `:h}
            `:h}
            <mwc-icon-button class="phase-remove" @click=${()=>this._removePhaseDef(e.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </mwc-icon-button>
          </div>
          ${this.checklistsEnabled?a`
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
          ${e.reqOverride?a`
            <div class="required-completion phase-req-fields">
              ${mt.map(r=>a`
                <label class="req-option">
                  <input
                    type="checkbox"
                    .checked=${e.reqFields.includes(r)}
                    @change=${d=>{let p=d.target.checked,_=new Set(e.reqFields);p?_.add(r):_.delete(r),this._patchPhaseDef(e.id,{reqFields:[..._]})}}
                  />
                  <span>${s(it[r],t)}</span>
                </label>
              `)}
            </div>
          `:h}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${s("phase_add",t)}
      </ha-button>
      ${this._phaseDefs.some(e=>e.name.trim())?a`
        <div class="phase-seq-label">${s("phase_sequence_label",t)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((e,r)=>a`
            <span class="phase-chip">
              ${r+1}. ${i(e)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((d,p)=>p!==r)}}>✕</button>
            </span>
          `)}
          <select
            class="phase-seq-add"
            .value=${""}
            @change=${e=>{let r=e.target.value;r&&(this._phaseSeq=[...this._phaseSeq,r]),e.target.value=""}}
          >
            <option value="">+ ${s("phase_sequence_add_step",t)}</option>
            ${this._phaseDefs.filter(e=>e.name.trim()).map(e=>a`<option value=${e.id}>${e.name}</option>`)}
          </select>
        </div>
      `:h}
    `}async _save(){if(!this._loading&&this._name.trim()){if(this._adaptiveSnapshot()!==this._adaptiveInitial){let t=parseInt(this._adaptiveMin,10),i=parseInt(this._adaptiveMax,10);if(!isNaN(t)&&!isNaN(i)&&t>i){this._error=`${s("adaptive_min_interval",this._lang)} > ${s("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=s("trigger_hint_overlap",this._lang);return}this._loading=!0,this._error="";try{let t={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},i=this._earliestCompletionDays.trim();t.earliest_completion_days=i===""?null:Math.max(0,parseInt(i,10)||0),this._taskId&&(t.task_id=this._taskId),this._scheduleType==="one_time"?(t.due_date=this._dueDate||null,t.interval_days=null):at.includes(this._scheduleType)?(t.schedule={...this._buildSchedule(),...this._recurrenceExtras()},t.interval_days=null,this._taskId&&(t.due_date=null)):(this._taskId&&(t.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(t.interval_days=parseInt(this._intervalDays,10),t.interval_unit=this._intervalUnit,t.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(t.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(t.interval_days=null,t.interval_anchor="completion")),t.notes=this._notes||null,t.documentation_url=this._documentationUrl||null,t.custom_icon=this._customIcon||null,t.priority=this._priority,t.labels=this._labels.split(",").map(p=>p.trim()).filter(Boolean),t.enabled=this._enabled,t.last_performed=this._lastPerformed||null,t.nfc_tag_id=this._nfcTagId||null,t.require_tag_scan=this._requireTagScan,t.allow_skip=this._allowSkip,t.notify_enabled=this._notifyEnabled,t.reading_unit=this._readingUnit.trim()||null,t.readings=It(this._readings);{let p={};for(let u of this._phaseDefs){if(!u.name.trim())continue;let v={...u.carry,name:u.name.trim()},y=u.checklistText.split(`
`).map(f=>f.trim()).filter(Boolean);y.length&&(v.checklist=y);let $=[];if(u.partId){let f=parseFloat(u.partQty);$.push({part_id:u.partId,quantity:Number.isFinite(f)&&f>0?f:1})}for(let f of u.extraParts)$.push(f.entry_id?{part_id:f.part_id,quantity:f.quantity,entry_id:f.entry_id}:{part_id:f.part_id,quantity:f.quantity});$.length&&(v.consumes_parts=$),u.reqOverride&&(v.required_completion_fields=[...u.reqFields]),p[u.id]=v}let _=this._phaseSeq.filter(u=>u in p);t.phases=Object.keys(p).length&&_.length?p:null,t.phase_sequence=t.phases?_:null}if((this.parts.length||this._foreignOwners.length)&&(t.consumes_parts=Object.values(this._consumesParts).map(p=>p.entry_id?{part_id:p.part_id,quantity:p.quantity,entry_id:p.entry_id}:{part_id:p.part_id,quantity:p.quantity})),t.responsible_user_id=this._responsibleUserId,t.assignee_pool=this._assigneePool,t.required_completion_fields=this._requiredCompletion,t.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let p=this._compoundConditions.map(Ae).filter(_=>_!==null);if(p.length>0){let _={type:"compound",compound_logic:this._compoundLogic,conditions:p};this._autoCompleteOnRecovery&&(_.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(_.trigger_combinator="all"),t.trigger_config=_}else this._taskId&&(t.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let p=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],_={entity_id:p[0],entity_ids:p,type:this._triggerType};if(this._triggerAttribute&&(_.attribute=this._triggerAttribute),this._autoCompleteOnRecovery&&(_.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(_.trigger_combinator="all"),p.length>1&&(_.entity_logic=this._triggerEntityLogic),this._triggerType==="threshold"){if(this._triggerAbove){let u=parseFloat(this._triggerAbove);isNaN(u)||(_.trigger_above=u)}if(this._triggerBelow){let u=parseFloat(this._triggerBelow);isNaN(u)||(_.trigger_below=u)}if(this._triggerEquals){let u=parseFloat(this._triggerEquals);isNaN(u)||(_.trigger_equals=u)}if(this._triggerNotEquals){let u=parseFloat(this._triggerNotEquals);isNaN(u)||(_.trigger_not_equals=u)}if(this._triggerForMinutes){let u=parseInt(this._triggerForMinutes,10);isNaN(u)||(_.trigger_for_minutes=u)}}else if(this._triggerType==="counter"){if(this._triggerTargetValue){let u=parseFloat(this._triggerTargetValue);isNaN(u)||(_.trigger_target_value=u)}if(_.trigger_delta_mode=this._triggerDeltaMode,this._triggerDeltaMode&&this._triggerBaselineValue){let u=parseFloat(this._triggerBaselineValue);!isNaN(u)&&u>=0&&(_.trigger_baseline_value=u)}}else if(this._triggerType==="state_change"){if(this._triggerFromState&&(_.trigger_from_state=this._triggerFromState),this._triggerToState&&(_.trigger_to_state=this._triggerToState),this._triggerTargetChanges){let u=parseInt(this._triggerTargetChanges,10);isNaN(u)||(_.trigger_target_changes=u)}if(this._triggerForMinutes){let u=parseInt(this._triggerForMinutes,10);isNaN(u)||(_.trigger_for_minutes=u)}}else if(this._triggerType==="runtime"){if(this._triggerRuntimeHours){let v=parseFloat(this._triggerRuntimeHours);isNaN(v)||(_.trigger_runtime_hours=v)}if(this._triggerRuntimeMaxSession){let v=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(v)&&v>0&&(_.trigger_runtime_max_session_seconds=v)}let u=this._triggerOnStates.split(",").map(v=>v.trim()).filter(Boolean);u.length>0&&(_.trigger_on_states=u)}t.trigger_config=_}else this._taskId&&(t.trigger_config=null);if(this.scheduleTimeEnabled&&Bt.includes(this._scheduleType)){let p=this._scheduleTimeOn?this._scheduleTime.trim():"";t.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(p)?p:null}if(this.checklistsEnabled){let p=this._checklistText.split(`
`).map(_=>_.trim()).filter(Boolean).slice(0,100);t.checklist=p.length?p:null}if(this.completionActionsEnabled){let p=this._actionService.trim();if(p&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(p)){let y={service:p},$=this._actionTargetEntity.trim();$&&(y.target={entity_id:$});let f=this._buildActionData();Object.keys(f).length>0&&(y.data=f),t.on_complete_action=y}else t.on_complete_action=null;let _={};this._qcNotes.trim()&&(_.notes=this._qcNotes.trim());let u=parseFloat(this._qcCost);!isNaN(u)&&u>=0&&(_.cost=u);let v=parseInt(this._qcDuration,10);!isNaN(v)&&v>=0&&(_.duration=v),this._qcFeedback&&(_.feedback=this._qcFeedback),t.quick_complete_defaults=Object.keys(_).length?_:null}let e=await this.hass.connection.sendMessagePromise(t),r=this._taskId||e?.task_id,d=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;if(r&&this._scheduleType==="sensor_based"&&d)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:r,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null}),this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute}catch{}if(r&&this._adaptiveSnapshot()!==this._adaptiveInitial){let p=parseFloat(this._adaptiveAlpha),_=parseInt(this._adaptiveMin,10),u=parseInt(this._adaptiveMax,10);try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:r,enabled:this._adaptiveEnabled,...p>=.1&&p<=.9?{ewa_alpha:p}:{},...!isNaN(_)&&_>=1?{min_interval_days:_}:{},...!isNaN(u)&&u>=1?{max_interval_days:u}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction}),this._adaptiveInitial=this._adaptiveSnapshot()}catch{}}this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}catch(t){this._error=A(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1,this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return h;let t=this._lang,i=this._triggerType==="compound";return a`
      <h3>${s("trigger_configuration",t)}</h3>
      <div class="select-row">
        <label>${s("trigger_type",t)}</label>
        <select
          .value=${this._triggerType}
          @change=${e=>this._triggerType=e.target.value}
        >
          ${Ee.map(e=>a`<option value=${e} ?selected=${e===this._triggerType}>${s(e,t)}</option>`)}
        </select>
      </div>
      ${i?this._renderCompoundEditor():a`
        ${this._entityPickerFallback?a`
          <ms-textfield
            label="${s("entity_id",t)} (${s("comma_separated",t)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${e=>{let d=e.target.value.split(",").map(p=>p.trim()).filter(Boolean);this._triggerEntityId=d[0]||"",this._triggerEntityIds=d,d[0]&&this._fetchEntityAttributes(d[0])}}
          ></ms-textfield>
        `:a`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:_t}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>s("entity_id",t)}
          @value-changed=${e=>{let r=(e.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=r[0]||"",this._triggerEntityIds=r,r[0]?this._fetchEntityAttributes(r[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?a`
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
      ${this._intervalDays?a`
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
    `}_patchCondition(t,i){this._compoundConditions=this._compoundConditions.map((e,r)=>r===t?{...e,...i}:e)}_addCondition(){this._compoundConditions=[...this._compoundConditions,Ie()]}_removeCondition(t){this._compoundConditions=this._compoundConditions.filter((i,e)=>e!==t)}_renderCompoundEditor(){let t=this._lang;return a`
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
      ${this._compoundConditions.length===0?a`<div class="field-help">${s("compound_no_conditions",t)}</div>`:this._compoundConditions.map((i,e)=>this._renderCondition(i,e))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${s("compound_add_condition",t)}
      </button>
    `}_renderCondition(t,i){let e=this._lang,r=i+1;return a`
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
        ${this._entityPickerFallback?a`
          <ms-textfield
            label="${s("entity_id",e)} (${s("comma_separated",e)})"
            .value=${t.entityIds}
            @input=${d=>this._patchCondition(i,{entityIds:d.target.value})}
          ></ms-textfield>
        `:a`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:_t}}}]}
          .data=${{condition_entities:t.entityIds.split(",").map(d=>d.trim()).filter(Boolean)}}
          .computeLabel=${()=>s("entity_id",e)}
          @value-changed=${d=>{let p=(d.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(i,{entityIds:p.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(t,i)}
        <div class="select-row">
          <label>${s("trigger_type",e)}</label>
          <select
            .value=${t.type}
            @change=${d=>this._patchCondition(i,{type:d.target.value})}
          >
            ${Wt.map(d=>a`<option value=${d} ?selected=${d===t.type}>${s(d,e)}</option>`)}
          </select>
        </div>
        ${this._renderConditionTypeFields(t,i)}
      </div>
    `}_renderStateField(t){return this._entityPickerFallback||!t.entityId?a`
        <ms-textfield
          label=${t.label}
          .value=${t.value}
          @input=${i=>t.onInput(i.target.value)}
        ></ms-textfield>
      `:a`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:t.entityId}}}]}
        .data=${{s:t.value}}
        .computeLabel=${()=>t.label}
        @value-changed=${i=>t.onInput((i.detail.value.s||"").trim())}
      ></ha-form>
    `}_renderOnStatesField(t){let i=this._lang;return this._entityPickerFallback||!t.entityId?a`
        <ms-textfield
          label="${s("runtime_on_states",i)}"
          placeholder="on"
          .value=${t.value}
          @input=${e=>t.onInput(e.target.value)}
        ></ms-textfield>
      `:a`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:t.entityId,multiple:!0}}}]}
        .data=${{s:(t.value||"").split(",").map(e=>e.trim()).filter(Boolean)}}
        .computeLabel=${()=>s("runtime_on_states",i)}
        @value-changed=${e=>t.onInput((e.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(t){return this._scheduleType==="one_time"||this._scheduleType==="manual"?h:a`
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
        ${this._adaptiveEnabled?a`
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
            ${s("adaptive_seasonal_enabled",t)}
          </label>
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
    `}_renderAttributeSelect(t){let i=this._lang;return t.available.length>0?a`
        <div class="select-row">
          <label>${t.label}</label>
          <select
            .value=${t.value}
            @change=${e=>t.onSelect(e.target.value)}
          >
            <option value="" ?selected=${!t.value}>${s("use_entity_state",i)}</option>
            ${t.suggested.map(e=>a`<option value=${e} ?selected=${e===t.value}>${e} ★</option>`)}
            ${t.available.filter(e=>!t.suggested.includes(e.name)).map(e=>a`<option value=${e.name} ?selected=${e.name===t.value}>${e.name}${e.numeric?"":" (non-numeric)"}</option>`)}
          </select>
        </div>
      `:a`
      <ms-textfield
        label="${t.label}"
        .value=${t.value}
        @input=${e=>t.onSelect(e.target.value.trim())}
      ></ms-textfield>
    `}_renderEnvironmentalAttribute(t){this._fetchConditionAttributes(this._environmentalEntity);let i=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:s("environmental_attribute_optional",t),value:this._environmentalAttribute,suggested:i?.suggested??[],available:i?.available??[],onSelect:e=>this._environmentalAttribute=e})}_renderConditionAttribute(t,i){let e=t.entityIds.split(",")[0]?.trim()||"";e&&this._fetchConditionAttributes(e);let r=e?this._conditionAttrOptions[e]:void 0;return this._renderAttributeSelect({label:s("attribute_optional",this._lang),value:t.attribute,suggested:r?.suggested??[],available:r?.available??[],onSelect:d=>this._patchCondition(i,{attribute:d})})}_renderConditionTypeFields(t,i){let e=this._lang;if(t.type==="threshold")return a`
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
      `;if(t.type==="counter")return a`
        <ms-textfield label="${s("target_value",e)}" type="number" .value=${t.targetValue}
          @input=${r=>this._patchCondition(i,{targetValue:r.target.value})}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${t.deltaMode}
            @change=${r=>this._patchCondition(i,{deltaMode:r.target.checked})} />
          ${s("delta_mode",e)}
        </label>
      `;if(t.type==="state_change"){let r=t.entityIds.split(",")[0]?.trim()||"";return a`
        ${this._renderStateField({label:s("from_state_optional",e),value:t.fromState,entityId:r,onInput:d=>this._patchCondition(i,{fromState:d})})}
        ${this._renderStateField({label:s("to_state_optional",e),value:t.toState,entityId:r,onInput:d=>this._patchCondition(i,{toState:d})})}
        <ms-textfield label="${s("target_changes",e)}" type="number" .value=${t.targetChanges}
          @input=${d=>this._patchCondition(i,{targetChanges:d.target.value})}></ms-textfield>
      `}if(t.type==="runtime"){let r=t.entityIds.split(",")[0]?.trim()||"";return a`
        <ms-textfield label="${s("runtime_hours",e)}" type="number" .value=${t.runtimeHours}
          @input=${d=>this._patchCondition(i,{runtimeHours:d.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:t.onStates,entityId:r,onInput:d=>this._patchCondition(i,{onStates:d})})}
      `}return h}_renderUnitSelect(){let t=this._lang;return a`
      <div class="select-row">
        <label>${s("interval_unit",t)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${i=>this._intervalUnit=i.target.value}
        >
          ${["days","weeks","months","years"].map(i=>a`<option value=${i} ?selected=${i===this._intervalUnit}>${s("unit_"+i,t)}</option>`)}
        </select>
      </div>`}_toggleWeekday(t){this._weekdays=this._weekdays.includes(t)?this._weekdays.filter(i=>i!==t):[...this._weekdays,t]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(at.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let t=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!t||t<=0?null:{kind:"interval",every:t,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(t){super.updated?.(t),this._scheduleEntityPickerProbe();for(let i of t.keys())if(m._PREVIEW_RELEVANT.has(String(i))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let t=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),i=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!t||!i){this._pickerProbeStrikes=0;return}let e=(_,u,v=0)=>{if(!(!_||v>10)){(_.tagName?.toLowerCase()??"")==="ha-entity-picker"&&u.push(_);for(let y of[_.shadowRoot,_])if(y)for(let $ of Array.from(y.children??[]))e($,u,v+1)}},r=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],d=[];for(let _ of r)e(_,d);let p=d.length===0||d.some(_=>_.offsetHeight===0);if(t.offsetHeight===0||p){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let t=this._open?this._previewScheduleDict():null;if(!t){this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let i=++this._previewSeq;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:t,...this._lastPerformed?{last_performed:this._lastPerformed}:{}});if(i!==this._previewSeq)return;this._schedulePreview=e.occurrences||[],this._schedulePreviewEnded=!!e.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return h;let t=this._lang,i=this.scheduleTimeEnabled&&this._scheduleTimeOn&&this._scheduleTime?` ${this._scheduleTime}`:"",e=this._schedulePreview.map((d,p)=>{let _=new Date(`${d}T12:00:00`).getDay();return`${ut(_===0?6:_-1,t,"short")} ${G(d,t)}${p===0?i:""}`}).join(" \xB7 "),r=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?a`<div class="field-help">${s("schedule_preview_ontime",t)}</div>`:h;return a`
      <div class="trigger-live-hint schedule-preview">
        ${s("schedule_preview_title",t)}: ${e}${this._schedulePreviewEnded?a` <span class="field-help">${s("schedule_preview_ends",t)}</span>`:h}
        ${r}
      </div>
    `}_buildSchedule(){let t=e=>{let r=parseInt(this._calOffset,10)||0;return r&&(e.offset=Math.max(-15,Math.min(r,15))),e};if(this._scheduleType==="weekdays")return t({kind:"weekdays",weekdays:[...this._weekdays].sort((e,r)=>e-r)});if(this._scheduleType==="nth_weekday")return t({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});let i={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(i.business=!0),t(i)}_recurrenceExtras(){let t={};if(this._seasonMonths.length&&(t.season_months=[...this._seasonMonths].sort((i,e)=>i-e)),this._endsMode==="count"){let i=parseInt(this._endsCount,10);i>=1&&(t.ends={count:i})}else this._endsMode==="until"&&this._endsUntil&&(t.ends={until:this._endsUntil});return t}_toggleSeasonMonth(t){this._seasonMonths=this._seasonMonths.includes(t)?this._seasonMonths.filter(i=>i!==t):[...this._seasonMonths,t]}_renderRecurrenceExtras(){let t=this._lang;if(!(this._scheduleType==="time_based"||at.includes(this._scheduleType)))return h;let e=Pe(t);return a`
      <label class="field-label">${s("season_window_label",t)}</label>
      <div class="field-help">${s("season_window_hint",t)}</div>
      <div class="weekday-chips season-chips">
        ${e.map((r,d)=>a`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(d+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(d+1)}
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
      ${this._endsMode==="count"?a`
        <ms-textfield
          label="${s("series_end_count_label",t)}"
          type="number" min="1"
          .value=${this._endsCount}
          @input=${r=>this._endsCount=r.target.value}
        ></ms-textfield>`:h}
      ${this._endsMode==="until"?a`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${t}
          label="${s("series_end_until_label",t)}"
          .value=${this._endsUntil}
          @value-changed=${r=>this._endsUntil=r.detail.value}
        ></ms-date-field>`:h}
    `}_renderCalendarFields(){let t=this._lang,i=Ce(t);if(this._scheduleType==="weekdays")return a`
        <label class="field-label">${s("recurrence_on_days",t)}</label>
        <div class="weekday-chips">
          ${i.map((e,r)=>a`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(r)?"selected":""}"
              @click=${()=>this._toggleWeekday(r)}
            >${e}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let e=[["1",s("ord_1",t)],["2",s("ord_2",t)],["3",s("ord_3",t)],["4",s("ord_4",t)],["5",s("ord_5",t)],["-1",s("ord_last",t)]];return a`
        <div class="select-row">
          <label>${s("recurrence_occurrence",t)}</label>
          <select .value=${this._nth} @change=${r=>this._nth=r.target.value}>
            ${e.map(([r,d])=>a`<option value=${r} ?selected=${r===this._nth}>${d}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${s("recurrence_weekday",t)}</label>
          <select .value=${this._nthWeekday} @change=${r=>this._nthWeekday=r.target.value}>
            ${i.map((r,d)=>a`<option value=${String(d)} ?selected=${String(d)===this._nthWeekday}>${r}</option>`)}
          </select>
        </div>
        ${this._renderCalOffsetField()}`}return this._scheduleType==="day_of_month"?a`
        ${this._domLastDay?h:a`
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
        ${this._renderCalOffsetField()}`:h}_renderCalOffsetField(){let t=this._lang;return a`
      <ms-textfield
        label="${s("recurrence_offset",t)}"
        helper="${s("recurrence_offset_help",t)}"
        type="number"
        min="-15"
        max="15"
        .value=${this._calOffset}
        @input=${i=>this._calOffset=i.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let t=parseFloat(this._triggerAbove),i=parseFloat(this._triggerBelow);return!isNaN(t)&&!isNaN(i)&&i>t}_renderTriggerLiveHint(){if(this._triggerType==="compound")return h;let t=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?a`<div class="trigger-live-hint warn">${s("trigger_hint_overlap",this._lang)}</div>`:h,i=this._triggerEntityId||this._triggerEntityIds[0];if(!i||!this.hass?.states)return t;let e=this.hass.states[i];if(!e)return t;let r=this._lang,d=e.attributes?.unit_of_measurement,p=typeof d=="string"&&d?` ${d}`:"",_=this._triggerAttribute?e.attributes?.[this._triggerAttribute]:e.state,u=typeof _=="number"?_:parseFloat(String(_)),v=_!=="unknown"&&_!=="unavailable"&&_!=null&&!isNaN(u),y=f=>T(f,r,{maximumFractionDigits:1}),$=[];if(this._triggerType==="threshold"){let f=parseFloat(this._triggerAbove),S=parseFloat(this._triggerBelow);if(isNaN(f)&&isNaN(S))return h;v&&$.push(s("trigger_hint_now",r).replace("{value}",y(u)+p)),isNaN(f)||$.push(s("trigger_hint_above",r).replace("{target}",y(f)+p)),isNaN(S)||$.push(s("trigger_hint_below",r).replace("{target}",y(S)+p))}else if(this._triggerType==="counter"){let f=parseFloat(this._triggerTargetValue);if(isNaN(f))return h;this._triggerDeltaMode?this._taskId?$.push(s("trigger_hint_counter_delta_edit",r).replace("{target}",y(f)+p)):v?$.push(s("trigger_hint_counter_delta",r).replace("{value}",y(u)+p).replace("{due}",y(u+f)+p).replace("{target}",y(f)+p)):$.push(s("trigger_hint_counter_delta_edit",r).replace("{target}",y(f)+p)):(v&&$.push(s("trigger_hint_now",r).replace("{value}",y(u)+p)),$.push(s("trigger_hint_counter_abs",r).replace("{target}",y(f)+p)))}else if(this._triggerType==="runtime"){let f=parseFloat(this._triggerRuntimeHours);if(isNaN(f))return h;$.push(s("trigger_hint_runtime",r).replace("{hours}",y(f))),$.push(s("trigger_hint_state_now",r).replace("{value}",String(e.state)))}else if(this._triggerType==="state_change"){let f=parseInt(this._triggerTargetChanges,10)||1,S=this._triggerToState.trim();$.push((S?s("trigger_hint_state_change_to",r).replace("{state}",S):s("trigger_hint_state_change",r)).replace("{count}",String(f))),$.push(s("trigger_hint_state_now",r).replace("{value}",String(e.state)))}return $.length?a`<div class="trigger-live-hint">${$.join(" ")}</div>${t}`:t}_renderTriggerTypeFields(){let t=this._lang;return this._triggerType==="threshold"?a`
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
      `:this._triggerType==="counter"?a`
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
        ${this._triggerDeltaMode?a`
              <ms-textfield
                label="${s("baseline_start_value",t)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${i=>this._triggerBaselineValue=i.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?s("baseline_start_help_edit",t):s("baseline_start_help",t)}
                ${this._taskId&&this._liveBaselineValue!=null?a`<div class="baseline-effective">
                      ${s("baseline_current_effective",t).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:h}
              </div>
            `:h}
      `:this._triggerType==="state_change"?a`
        ${this._renderStateField({label:s("from_state_optional",t),value:this._triggerFromState,entityId:this._triggerEntityId,onInput:i=>this._triggerFromState=i})}
        <div class="field-help">${s("state_value_help",t)}</div>
        ${this._renderStateField({label:s("to_state_optional",t),value:this._triggerToState,entityId:this._triggerEntityId,onInput:i=>this._triggerToState=i})}
        <ms-textfield
          label="${s("target_changes",t)}"
          type="number"
          min="1"
          .value=${this._triggerTargetChanges}
          @input=${i=>this._triggerTargetChanges=i.target.value}
        ></ms-textfield>
        <div class="field-help">${s("target_changes_help",t)}</div>
        ${(this._triggerTargetChanges||"1")==="1"&&(this._triggerFromState||this._triggerToState)?a`<div class="field-help">${s("state_latch_help",t)}</div>`:h}
        <ms-textfield
          label="${s("for_at_least_minutes",t)}"
          type="number"
          min="0"
          .value=${this._triggerForMinutes}
          @input=${i=>this._triggerForMinutes=i.target.value}
        ></ms-textfield>
        <div class="field-help">${s("for_minutes_state_help",t)}</div>
      `:this._triggerType==="runtime"?a`
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
      `:h}render(){if(!this._open)return a``;let t=this._lang,i=this._taskId?s("edit_task",t):s("new_task",t);return a`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i}</div>
        <div class="content">
          ${this._error?a`<div class="error">${this._error}</div>`:h}
          ${this._taskId===null&&this._objectChoices.length>0?a`
            <div class="select-row">
              <label>${s("object",t)}</label>
              <select
                .value=${this._entryId}
                @change=${e=>{this._entryId=e.target.value,this._consumesParts={},this._loadParts(),this._loadForeignPools()}}
              >
                ${this._objectChoices.map(e=>a`<option value=${e.entry_id} ?selected=${e.entry_id===this._entryId}>${e.name}</option>`)}
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
              ${xe.map(e=>a`<option value=${e} ?selected=${e===this._type}>${s(e,t)}</option>`)}
            </select>
          </div>
          ${this._type==="reading"?a`
                <ms-textfield
                  label="${s("reading_unit_label",t)}"
                  .value=${this._readingUnit}
                  @input=${e=>this._readingUnit=e.target.value}
                ></ms-textfield>
                <div class="field-help">${s("reading_unit_help",t)}</div>
                ${this._renderReadingsEditor(t)}
              `:h}
          ${this._partsLoadFailed?a`<div class="field-help parts-load-failed">${s("parts_load_failed",t)}</div>`:h}
          ${this.parts.length||this._foreignOwners.length?a`
                <div class="field">
                  <label>${s("consumes_parts_label",t)}</label>
                  ${this.parts.map(e=>this._renderConsumesRow(e))}
                  ${this._foreignOwners.length?a`
                        <details class="shared-pools" ?open=${this._hasForeignPick}>
                          <summary>${s("shared_parts_other_objects",t)}</summary>
                          <div class="field-help">${s("shared_parts_help",t)}</div>
                          ${this._foreignOwners.map(e=>a`
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
              ${ke.map(e=>a`<option value=${e} ?selected=${e===this._priority}>${s("priority_"+e,t)}</option>`)}
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
          <div class="select-row">
            <label>${s("schedule_type",t)}</label>
            <select
              .value=${this._scheduleType}
              @change=${e=>this._scheduleType=e.target.value}
            >
              ${we.map(e=>a`<option value=${e} ?selected=${e===this._scheduleType}>${s(e,t)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?a`
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
          ${this._scheduleType==="one_time"?a`
                <ms-date-field
                  kind="date"
                  .hass=${this.hass}
                  .lang=${t}
                  label="${s("due_date",t)}"
                  .value=${this._dueDate}
                  @value-changed=${e=>this._dueDate=e.detail.value}
                ></ms-date-field>
              `:h}
          ${this.scheduleTimeEnabled&&Bt.includes(this._scheduleType)?a`
            <label class="checkbox-row schedule-time-toggle">
              <input type="checkbox" .checked=${this._scheduleTimeOn}
                @change=${e=>this._scheduleTimeOn=e.target.checked} />
              <span>${s("schedule_time_toggle",t)}</span>
            </label>
            ${this._scheduleTimeOn?a`
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
            min="0"
            max="365"
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
          ${this.checklistsEnabled?a`
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
            ${mt.map(e=>a`
              <label class="req-option">
                <input
                  type="checkbox"
                  .checked=${this._requiredCompletion.includes(e)}
                  @change=${r=>this._toggleRequired(e,r.target.checked)}
                />
                <span>${s(it[e],t)}</span>
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
              ${this._availableUsers.map(e=>a`<option value=${e.id} ?selected=${e.id===this._responsibleUserId}>${e.name}</option>`)}
            </select>
          </div>
          ${this._availableUsers.length>=2?a`
            <div class="field">
              <label>${s("shared_with",t)}</label>
              <div class="field-help">${s("shared_with_help",t)}</div>
              <div class="assignee-pool">
                ${this._availableUsers.map(e=>a`
                  <label class="pool-item">
                    <input type="checkbox"
                      .checked=${this._assigneePool.includes(e.id)}
                      @change=${()=>this._toggleAssignee(e.id)} />
                    <span>${e.name}</span>
                  </label>`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?a`
              <div class="select-row">
                <label>${s("rotation_strategy",t)}</label>
                <select
                  .value=${this._rotationStrategy}
                  @change=${e=>this._rotationStrategy=e.target.value}
                >
                  <option value="" ?selected=${!this._rotationStrategy}>${s("rotation_none",t)}</option>
                  ${["round_robin","least_completed","random"].map(e=>a`<option value=${e} ?selected=${e===this._rotationStrategy}>${s("rotation_"+e,t)}</option>`)}
                </select>
              </div>`:h}
          `:h}
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"?a`
            ${this._entityPickerFallback?a`
              <ms-textfield
                label="${s("environmental_entity_optional",t)}"
                helper="${s("environmental_entity_helper",t)}"
                .value=${this._environmentalEntity}
                @input=${e=>this._environmentalEntity=e.target.value.trim()}
              ></ms-textfield>
            `:a`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:Ut,device_class:Vt}}}]}
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
          ${this._availableTags.length>0?a`
              <div class="select-row">
                <label>${s("nfc_tag_id_optional",t)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${e=>this._nfcTagId=e.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${s("no_nfc_tag",t)}</option>
                  ${this._availableTags.map(e=>a`<option value=${e.id} ?selected=${e.id===this._nfcTagId}>${e.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${s("nfc_tags_refresh",t)}">↻</button>
              </div>
            `:a`
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
          ${this._requireTagScan?a`<div class="field-help">${s("require_tag_scan_help",t)}</div>`:h}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._allowSkip}
              @change=${e=>this._allowSkip=!e.target.checked}
            />
            <span>${s("disallow_skip",t)}</span>
          </label>
          ${this._allowSkip?h:a`<div class="field-help">${s("disallow_skip_help",t)}</div>`}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._notifyEnabled}
              @change=${e=>this._notifyEnabled=!e.target.checked}
            />
            <span>${s("no_notifications",t)}</span>
          </label>
          ${this._notifyEnabled?h:a`<div class="field-help">${s("no_notifications_help",t)}</div>`}
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
    `}};m._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),m.styles=k`
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
  `,l([g({attribute:!1})],m.prototype,"hass",2),l([g({type:Boolean,attribute:"checklists-enabled"})],m.prototype,"checklistsEnabled",2),l([g({type:Boolean,attribute:"schedule-time-enabled"})],m.prototype,"scheduleTimeEnabled",2),l([g({type:Boolean,attribute:"completion-actions-enabled"})],m.prototype,"completionActionsEnabled",2),l([g({type:Number,attribute:"default-warning-days"})],m.prototype,"defaultWarningDays",2),l([c()],m.prototype,"parts",2),l([c()],m.prototype,"_foreignOwners",2),l([c()],m.prototype,"_open",2),l([c()],m.prototype,"_entityPickerFallback",2),l([c()],m.prototype,"_loading",2),l([c()],m.prototype,"_error",2),l([c()],m.prototype,"_entryId",2),l([c()],m.prototype,"_taskId",2),l([c()],m.prototype,"_objectChoices",2),l([c()],m.prototype,"_name",2),l([c()],m.prototype,"_type",2),l([c()],m.prototype,"_scheduleType",2),l([c()],m.prototype,"_intervalDays",2),l([c()],m.prototype,"_intervalUnit",2),l([c()],m.prototype,"_dueDate",2),l([c()],m.prototype,"_warningDays",2),l([c()],m.prototype,"_earliestCompletionDays",2),l([c()],m.prototype,"_intervalAnchor",2),l([c()],m.prototype,"_weekdays",2),l([c()],m.prototype,"_nth",2),l([c()],m.prototype,"_nthWeekday",2),l([c()],m.prototype,"_domDay",2),l([c()],m.prototype,"_domLastDay",2),l([c()],m.prototype,"_domBusiness",2),l([c()],m.prototype,"_calOffset",2),l([c()],m.prototype,"_seasonMonths",2),l([c()],m.prototype,"_endsMode",2),l([c()],m.prototype,"_endsCount",2),l([c()],m.prototype,"_endsUntil",2),l([c()],m.prototype,"_schedulePreview",2),l([c()],m.prototype,"_schedulePreviewEnded",2),l([c()],m.prototype,"_notes",2),l([c()],m.prototype,"_documentationUrl",2),l([c()],m.prototype,"_customIcon",2),l([c()],m.prototype,"_priority",2),l([c()],m.prototype,"_labels",2),l([c()],m.prototype,"_enabled",2),l([c()],m.prototype,"_triggerEntityId",2),l([c()],m.prototype,"_triggerEntityIds",2),l([c()],m.prototype,"_triggerEntityLogic",2),l([c()],m.prototype,"_triggerAttribute",2),l([c()],m.prototype,"_triggerType",2),l([c()],m.prototype,"_triggerAbove",2),l([c()],m.prototype,"_triggerBelow",2),l([c()],m.prototype,"_triggerEquals",2),l([c()],m.prototype,"_triggerNotEquals",2),l([c()],m.prototype,"_triggerForMinutes",2),l([c()],m.prototype,"_triggerCombinator",2),l([c()],m.prototype,"_triggerTargetValue",2),l([c()],m.prototype,"_triggerDeltaMode",2),l([c()],m.prototype,"_triggerBaselineValue",2),l([c()],m.prototype,"_liveBaselineValue",2),l([c()],m.prototype,"_autoCompleteOnRecovery",2),l([c()],m.prototype,"_triggerFromState",2),l([c()],m.prototype,"_triggerToState",2),l([c()],m.prototype,"_triggerTargetChanges",2),l([c()],m.prototype,"_triggerRuntimeHours",2),l([c()],m.prototype,"_triggerRuntimeMaxSession",2),l([c()],m.prototype,"_triggerOnStates",2),l([c()],m.prototype,"_compoundLogic",2),l([c()],m.prototype,"_compoundConditions",2),l([c()],m.prototype,"_suggestedAttributes",2),l([c()],m.prototype,"_availableAttributes",2),l([c()],m.prototype,"_entityDomain",2),l([c()],m.prototype,"_lastPerformed",2),l([c()],m.prototype,"_nfcTagId",2),l([c()],m.prototype,"_requireTagScan",2),l([c()],m.prototype,"_allowSkip",2),l([c()],m.prototype,"_notifyEnabled",2),l([c()],m.prototype,"_readingUnit",2),l([c()],m.prototype,"_readings",2),l([c()],m.prototype,"_consumesParts",2),l([c()],m.prototype,"_partsLoadFailed",2),l([c()],m.prototype,"_availableTags",2),l([c()],m.prototype,"_responsibleUserId",2),l([c()],m.prototype,"_assigneePool",2),l([c()],m.prototype,"_rotationStrategy",2),l([c()],m.prototype,"_availableUsers",2),l([c()],m.prototype,"_checklistText",2),l([c()],m.prototype,"_phaseDefs",2),l([c()],m.prototype,"_phaseSeq",2),l([c()],m.prototype,"_requiredCompletion",2),l([c()],m.prototype,"_scheduleTime",2),l([c()],m.prototype,"_scheduleTimeOn",2),l([c()],m.prototype,"_actionService",2),l([c()],m.prototype,"_actionTargetEntity",2),l([c()],m.prototype,"_actionData",2),l([c()],m.prototype,"_actionDataJsonFallback",2),l([c()],m.prototype,"_actionTesting",2),l([c()],m.prototype,"_actionTestResult",2),l([c()],m.prototype,"_actionTestError",2),l([c()],m.prototype,"_qcNotes",2),l([c()],m.prototype,"_qcCost",2),l([c()],m.prototype,"_qcDuration",2),l([c()],m.prototype,"_qcFeedback",2),l([c()],m.prototype,"_environmentalEntity",2),l([c()],m.prototype,"_environmentalAttribute",2),l([c()],m.prototype,"_adaptiveEnabled",2),l([c()],m.prototype,"_adaptiveAlpha",2),l([c()],m.prototype,"_adaptiveMin",2),l([c()],m.prototype,"_adaptiveMax",2),l([c()],m.prototype,"_adaptiveSeasonal",2),l([c()],m.prototype,"_adaptivePrediction",2),l([c()],m.prototype,"_conditionAttrOptions",2);var gt=m;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",gt);async function Le(n,o,t,i){let e=new FormData;e.append("entry_id",o);for(let p of i)e.append("tags",p);e.append("file",t,t.name);let r=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${n.auth?.data?.access_token??""}`},body:e});if(r.status===413)throw new Error("doc_too_large");if(!r.ok)throw new Error("doc_upload_failed");let d=await r.json();if(!d.id)throw new Error("doc_upload_failed");return{id:d.id,deduped:!!d.deduped,duplicate_in_object:d.duplicate_in_object??null}}async function Gt(n,o,t){return(await Le(n,o,t,["photo"])).id}async function vt(n,o){await Promise.all(o.map(t=>n.connection.sendMessagePromise({type:"maintenance_supporter/documents/delete",doc_id:t}).catch(()=>{})))}var Z=class{constructor(o,t){this.host=o;this.opts=t;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this.max=t.max??10,o.addController(this)}hostConnected(){}get ids(){return this.photos.map(o=>o.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(o){return this.errorKey?s(this.errorKey,o).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(o=[]){this._revokeAll(),this.photos=o.map(t=>({id:t,preview:""})),this.uploadedIds=[],this.uploading=!1,this.errorKey="",this.host.requestUpdate()}async addFiles(o){if(o.length===0)return;let t=o.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let i of t){let e=await Gt(this.opts.hass(),this.opts.entryId(),i);this.uploadedIds=[...this.uploadedIds,e],this.photos=[...this.photos,{id:e,preview:URL.createObjectURL(i)}],this.host.requestUpdate()}o.length>t.length&&(this.errorKey="photos_limit")}catch(i){this.errorKey=i instanceof Error&&i.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{this.uploading=!1,this.host.requestUpdate()}}remove(o){let t=this.photos.find(i=>i.id===o);t?.preview&&URL.revokeObjectURL(t.preview),this.photos=this.photos.filter(i=>i.id!==o),this.uploadedIds.includes(o)&&(this.uploadedIds=this.uploadedIds.filter(i=>i!==o),vt(this.opts.hass(),[o])),this.host.requestUpdate()}discardOrphans(){if(this.uploadedIds.length===0)return;let o=this.uploadedIds;this.uploadedIds=[],vt(this.opts.hass(),o)}markAttached(){this.uploadedIds=[]}_revokeAll(){for(let o of this.photos)o.preview&&URL.revokeObjectURL(o.preview)}};function ot(){if(window.externalApp!==void 0)return!0;let o=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(o)&&/Android/.test(o)}function Yt(){if(!ot())return!1;let n=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!n&&typeof n.getUserMedia=="function"}var qe=1920,Re=.88,Y=class extends w{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._stream=null}async open(){if(this._open)return;let t=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!t||typeof t.getUserMedia!="function"){this._unavailable("no_media_devices");return}try{this._stream=await t.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:!1})}catch(e){this._unavailable(e instanceof Error?e.name||e.message:String(e));return}this._open=!0,await this.updateComplete;let i=this._video;if(i&&this._stream){i.srcObject=this._stream;try{await i.play()}catch{}}}close(){this._stopStream(),this._open=!1,this._busy=!1}disconnectedCallback(){super.disconnectedCallback(),this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let i of this._stream?.getTracks()??[])i.stop();this._stream=null;let t=this._video;t&&(t.srcObject=null)}_unavailable(t){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:t},bubbles:!0,composed:!0}))}async _shoot(){let t=this._video;if(!(!t||this._busy)){this._busy=!0;try{let i=t.videoWidth||640,e=t.videoHeight||480,r=Math.min(1,qe/Math.max(i,e)),d=document.createElement("canvas");d.width=Math.round(i*r),d.height=Math.round(e*r);let p=d.getContext("2d");if(!p)throw new Error("no_canvas");p.drawImage(t,0,0,d.width,d.height);let _=await new Promise(y=>d.toBlob(y,"image/jpeg",Re));if(!_)throw new Error("no_blob");let u=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),v=new File([_],`photo-${u}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:v},bubbles:!0,composed:!0}))}catch(i){this._unavailable(i instanceof Error?i.message:String(i))}finally{this._busy=!1}}}render(){if(!this._open)return h;let t=this.lang;return a`
      <div class="overlay" role="dialog" aria-modal="true" aria-label=${s("doc_camera",t)}>
        <video autoplay playsinline muted></video>
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${s("cancel",t)}</button>
          <button type="button" class="shoot" ?disabled=${this._busy} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${s("camera_capture_shoot",t)}</span>
          </button>
        </div>
      </div>
    `}};Y.styles=k`
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
    .shoot { background: var(--primary-color, #03a9f4); color: #fff; border: none; font-weight: 600; }
    .shoot[disabled] { opacity: 0.6; cursor: default; }
    .shoot ha-icon { --mdc-icon-size: 22px; }
  `,l([g({type:String})],Y.prototype,"lang",2),l([c()],Y.prototype,"_open",2),l([c()],Y.prototype,"_busy",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",Y);var lt=k`
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
`,q=class extends w{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=ot();this._inAppCamera=Yt()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(t){t.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:t},bubbles:!0,composed:!0}))}_onInput(t){let i=t.target,e=Array.from(i.files??[]);i.value="",this._emit(e)}_onCameraClick(t){!this._inAppCamera||this._locked||(t.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(t){t.key!=="Enter"&&t.key!==" "||(t.preventDefault(),!this._locked&&t.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return h;let t=this.lang,i=this._locked?"disabled":"",e=this.busy?s("uploading",t):s("doc_camera",t),r=s(this._singlePick?"choose_photo":"choose_photos",t);return a`
      <div class="photo-pickers">
        ${this.showCamera?a`<label class="photo-pick photo-pick-camera ${i}" role="button" tabindex="0"
              aria-label=${e} title=${this.compact?e:h}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?h:a`<span>${e}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:h}
        ${this.showGallery?a`<label class="photo-pick photo-pick-gallery ${i}" role="button" tabindex="0"
              aria-label=${r} title=${this.compact?r:h}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?h:a`<span>${r}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:h}
      </div>
      ${this.showGallery&&this._singlePick?a`<div class="photo-android-hint">${s("photos_android_hint",t)}</div>`:h}
      ${this.showCamera&&this._inAppCamera?a`<ms-camera-capture .lang=${t}
            @photo-captured=${d=>this._emit([d.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:h}
    `}};l([g({type:String})],q.prototype,"lang",2),l([g({type:Boolean})],q.prototype,"disabled",2),l([g({type:Boolean})],q.prototype,"busy",2),l([g({type:String})],q.prototype,"accept",2),l([g({type:Boolean})],q.prototype,"showCamera",2),l([g({type:Boolean})],q.prototype,"showGallery",2),l([g({type:Boolean})],q.prototype,"compact",2),l([g({type:Number})],q.prototype,"remaining",2),l([c()],q.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",q);var b=class extends w{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.currencySymbol="";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new Z(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this.checklistPrefill={}}open(t={}){this._open||(this._open=!0,this.viaTagScan=!!t.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((i,e)=>[String(e),!!this.checklistPrefill[i]]).filter(([,i])=>i)),this._feedback="needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(i=>[F(i),{...i}])))}_toggleCheck(t){let i=String(t);this._checklistState={...this._checklistState,[i]:!this._checklistState[i]}}_setFeedback(t){this._feedback=t}async _complete(){this._loading=!0,this._error="",this._photos.clearError();try{let t={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(t.notes=this._notes),this._cost){let i=parseFloat(this._cost);!isNaN(i)&&i>=0&&(t.cost=i)}if(this._duration){let i=parseInt(this._duration,10);!isNaN(i)&&i>=0&&(t.duration=i)}if(this.checklist.length>0&&(t.checklist_state=this._checklistState),this.adaptiveEnabled&&(t.feedback=this._feedback),this._photos.photos.length>0&&(t.photo_doc_ids=this._photos.ids),this.viaTagScan&&(t.via_tag_scan=!0),this._completedAt){if(new Date(this._completedAt).getTime()>Date.now()){this._error=s("completed_at_future_error",this.lang),this._loading=!1;return}t.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let i={};for(let e of this.readings){let r=(this._readingValues[e.id]??"").trim();if(r==="")continue;let d=parseFloat(r.replace(",","."));isNaN(d)||(i[e.id]=d)}Object.keys(i).length>0&&(t.reading_values=i)}else if(this._readingValue!==""){let i=parseFloat(this._readingValue);isNaN(i)||(t.reading_value=i)}if(this.restockDefault!==null&&this._restockQty!==""){let i=parseFloat(this._restockQty);!isNaN(i)&&i>=1&&(t.restock_quantity=i)}this.parts.length>0&&(t.used_parts=Object.values(this._usedParts).filter(i=>Number.isFinite(i.quantity)&&i.quantity>0).map(i=>i.entry_id?{part_id:i.part_id,quantity:i.quantity,entry_id:i.entry_id}:{part_id:i.part_id,quantity:i.quantity})),await this.hass.connection.sendMessagePromise(t),this._photos.markAttached(),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(t){this._error=A(t,this.lang,s("save_error",this.lang))}finally{this._loading=!1}}_renderReadingField(t,i){let e=this._completedAt?new Date(this._completedAt).getTime():NaN,r=kt(this.readingHistory,t.id,isNaN(e)?void 0:e),d=t.unit||this.readingUnit,p=(this._readingValues[t.id]??"").trim(),_=p===""?NaN:parseFloat(p.replace(",",".")),u=r!==void 0&&!isNaN(_)&&_<r.value,v=r!==void 0?T(r.value,i,{maximumFractionDigits:3}):"";return a`
      <label class="field reading-field">
        <span class="field-label">${t.name}${d?` (${d})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${r!==void 0?s("reading_last",i).replace("{value}",v):""}
          .value=${this._readingValues[t.id]??""}
          @input=${y=>{this._readingValues={...this._readingValues,[t.id]:y.target.value}}} />
        ${u?a`<span class="reading-warn">${s("reading_below_last",i).replace("{value}",v)}</span>`:h}
      </label>`}get _missingRequired(){let t={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(i=>!t[i])}_req(t){return this.requiredFields.includes(t)?a`<span class="req-mark" aria-hidden="true">*</span>`:h}_partsCostSuggestion(){if(this.restockDefault!==null){let e=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(e)||e<=0?null:Math.round(this.restockUnitCost*e*100)/100}if(!this.parts.length)return null;let t=0,i=!1;for(let e of Object.values(this._usedParts)){let r=this.parts.find(d=>F({part_id:d.id,entry_id:d.entry_id})===F(e));r?.cost!=null&&(t+=r.cost*(e.quantity||1),i=!0)}return i?Math.round(t*100)/100:null}_renderCostSuggestion(t){if(this._cost.trim()!=="")return h;let i=this._partsCostSuggestion();if(i==null||i<=0)return h;let e=et(i,this.currencySymbol,t);return a`<button
      type="button"
      class="cost-suggestion"
      @click=${()=>this._cost=String(Math.round(i*100)/100)}
    >${s("cost_from_parts",t).replace("{amount}",e)}</button>`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){let t=new Date,i=e=>String(e).padStart(2,"0");this._completedAt=`${t.getFullYear()}-${i(t.getMonth()+1)}-${i(t.getDate())}T${i(t.getHours())}:${i(t.getMinutes())}:00`}render(){if(!this._open)return a``;let t=this.lang||this.hass?.language||"en",i=this._error||this._photos.errorText(t);return a`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${s("complete_title",t)}${this.taskName}</div>
        ${this.phaseLabel?a`<div class="phase-line">${s("phase_current",t)}: ${this.phaseLabel}</div>`:h}
        ${this.requireTagScan&&!this.viaTagScan?a`<div class="scan-required-note">${s("require_tag_scan_hint",t)}</div>`:h}
        <div class="content">
          ${i?a`<div class="error">${i}</div>`:h}
          ${this.checklist.length>0?a`
            <div class="checklist-section">
              <label class="checklist-label">${s("checklist",t)}</label>
              ${this.checklist.map((e,r)=>a`
                <label class="checklist-item" @click=${()=>this._toggleCheck(r)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(r)]} />
                  <span>${e}</span>
                </label>
              `)}
            </div>
          `:h}
          ${this.readings.length>0?a`<div class="readings-block">
                <span class="field-label">${s("readings_section",t)}</span>
                ${this.readings.map(e=>this._renderReadingField(e,t))}
              </div>`:this.taskType==="reading"?a`
              <label class="field">
                <span class="field-label">${s("reading_value_label",t)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${e=>this._readingValue=e.target.value} />
              </label>`:h}
          ${this.parts.length?a`<div class="used-parts">
                <span class="field-label">${s("complete_parts_used",t)}</span>
                ${this.parts.map(e=>{let r=F({part_id:e.id,entry_id:e.entry_id}),d=this._usedParts[r],p=d!==void 0,_=e.entry_id?{part_id:e.id,quantity:1,entry_id:e.entry_id}:{part_id:e.id,quantity:1};return a`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${p}
                        @change=${u=>{let v={...this._usedParts};u.target.checked?v[r]=v[r]||_:delete v[r],this._usedParts=v}} />
                      <span
                        >${e.name}${e.owner_name?a`<span class="used-part-owner"> (${e.owner_name})</span>`:h}${e.stock!==null&&e.stock!==void 0?` (${e.stock}${e.unit?" "+e.unit:""})`:""}</span
                      >
                    </label>
                    ${p?a`<input class="used-part-qty" type="number" min="0.01" max="999" step="0.01"
                          .value=${String(d.quantity)}
                          @input=${u=>{let v=parseFloat(u.target.value);this._usedParts={...this._usedParts,[r]:{..._,quantity:Number.isFinite(v)&&v>=.01?v:1}}}} />`:h}
                  </div>`})}
              </div>`:this.consumesInfo.length?a`<div class="consumes-hint">
                  ${this.consumesInfo.map(e=>a`<div>${e}</div>`)}
                </div>`:h}
          ${this.restockDefault!==null?a`
              <label class="field">
                <span class="field-label">${s("restock_quantity_label",t)}</span>
                <input type="number" step="0.01" min="0.01" class="field-input"
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
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._duration}
              @input=${e=>this._duration=e.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${s("completed_at_optional",t)}</span>
            ${this._completedAt?a`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${t}
                  .value=${this._completedAt}
                  @value-changed=${e=>this._completedAt=e.detail.value}
                ></ms-date-field>`:a`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${s("completed_at_pick",t)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${s("completion_photos_optional",t)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?a`<div class="photo-strip">
                  ${this._photos.photos.map(e=>a`
                    <div class="photo-preview">
                      <img src=${e.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(e.id)}
                        title="${s("remove",t)}">✕</button>
                    </div>`)}
                </div>`:h}
            ${this._photos.full?a`<div class="photo-limit">${s("photos_limit",t).replace("{max}",String(this._photos.max))}</div>`:a`<ms-photo-picker .lang=${t} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${e=>this._photos.addFiles(e.detail.files)}
                ></ms-photo-picker>`}
          </div>
          ${this.adaptiveEnabled?a`
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
            .disabled=${this._loading||this._missingRequired.length>0}
            title=${this._missingRequired.length?this._missingRequired.map(e=>s("err_required",t).replace("{field}",s(it[e]??e,t))).join(" \xB7 "):""}
          >
            ${this._loading?s("completing",t):s("complete",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};b.styles=[Nt,lt,k`
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
  `],l([g({attribute:!1})],b.prototype,"hass",2),l([g()],b.prototype,"entryId",2),l([g()],b.prototype,"taskId",2),l([g()],b.prototype,"taskName",2),l([g()],b.prototype,"lang",2),l([g({type:Array})],b.prototype,"checklist",2),l([g({type:Boolean})],b.prototype,"adaptiveEnabled",2),l([g()],b.prototype,"taskType",2),l([g()],b.prototype,"readingUnit",2),l([g({attribute:!1})],b.prototype,"readings",2),l([g({attribute:!1})],b.prototype,"readingHistory",2),l([g({attribute:!1})],b.prototype,"restockDefault",2),l([g({attribute:!1})],b.prototype,"restockUnitCost",2),l([g()],b.prototype,"currencySymbol",2),l([g({attribute:!1})],b.prototype,"parts",2),l([g({attribute:!1})],b.prototype,"consumesParts",2),l([g({type:Array})],b.prototype,"consumesInfo",2),l([g({type:Array})],b.prototype,"requiredFields",2),l([g()],b.prototype,"phaseLabel",2),l([g({type:Boolean})],b.prototype,"requireTagScan",2),l([g({type:Boolean})],b.prototype,"viaTagScan",2),l([c()],b.prototype,"_open",2),l([c()],b.prototype,"_notes",2),l([c()],b.prototype,"_cost",2),l([c()],b.prototype,"_duration",2),l([c()],b.prototype,"_loading",2),l([c()],b.prototype,"_error",2),l([c()],b.prototype,"_checklistState",2),l([c()],b.prototype,"_feedback",2),l([c()],b.prototype,"_readingValue",2),l([c()],b.prototype,"_readingValues",2),l([c()],b.prototype,"_restockQty",2),l([c()],b.prototype,"_completedAt",2),l([c()],b.prototype,"_usedParts",2),l([g({attribute:!1})],b.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",b);function Qt(n,o,t){let i=new Blob([n],{type:t}),e=URL.createObjectURL(i),r=document.createElement("a");r.href=e,r.download=o,r.target="_blank",r.rel="noopener",r.style.display="none",document.body.appendChild(r),r.dispatchEvent(new MouseEvent("click")),document.body.removeChild(r),setTimeout(()=>URL.revokeObjectURL(e),6e4)}async function He(n,o,t=300){return(await n.connection.sendMessagePromise({type:"auth/sign_path",path:o,expires:t})).path}async function Jt(n,o,t=300){return He(n,`/api/maintenance_supporter/document/${o}`,t)}var W=class extends w{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await Jt(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?h:this._url?a`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:a`<div class="ph"></div>`}};W.styles=k`
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
  `,l([g({attribute:!1})],W.prototype,"hass",2),l([g()],W.prototype,"docId",2),l([c()],W.prototype,"_url",2),l([c()],W.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",W);var L=class extends w{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._photos=new Z(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return P(this.hass)}openEdit(t){this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(t.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(t),this._loadPartOptions()}_seedReadings(t){let i=[],e=new Set;for(let d of t.readings??[])e.has(d.id)||(e.add(d.id),i.push({id:d.id,name:d.name,unit:d.unit??null}));for(let d of t.reading_values??[])e.has(d.id)||(e.add(d.id),i.push({id:d.id,name:d.name,unit:d.unit??null}));this._readingRows=i;let r={};for(let d of t.reading_values??[])r[d.id]=String(d.value);this._readingText=r,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let t={};for(let i of this._readingRows){let e=(this._readingText[i.id]??"").trim();if(e==="")continue;let r=parseFloat(e.replace(",","."));isNaN(r)||(t[i.id]=r)}return t}async _loadPartOptions(){let t=this._draft;if(t)try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"}),e=[];for(let d of i.parts||[]){let p=d.entry_id===t.entry_id,_=d.consumers.some(u=>u.entry_id===t.entry_id&&u.task_id===t.task_id);!p&&!_||e.push({part_id:d.part_id,name:d.name,entry_id:d.entry_id,foreign:!p,object_name:d.object_name})}for(let d of t.used_parts||[]){let p=d.entry_id||t.entry_id;e.some(_=>_.part_id===d.part_id&&_.entry_id===p)||e.push({part_id:d.part_id,name:d.name||d.part_id,entry_id:p,foreign:p!==t.entry_id,object_name:null})}let r={};for(let d of t.used_parts||[])r[`${d.entry_id||t.entry_id}:${d.part_id}`]=d.quantity??1;this._partOptions=e,this._partQty=r,this._partQtyOriginal=this._partSelectionKey()}catch{this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,t])=>t>0).sort(([t],[i])=>t.localeCompare(i)))}close(){this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(t,i){this._draft&&(this._draft={...this._draft,[t]:i})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let t=this._lang;if(window.confirm(s("history_delete_confirm",t))){this._saving=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/history/delete",entry_id:this._draft.entry_id,task_id:this._draft.task_id,timestamp:this._originalSnapshot.original_timestamp}),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close()}catch(i){this._error=A(i,t)}finally{this._saving=!1}}}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="",this._photos.clearError();try{let t={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(t.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(t.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(t.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(t.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(t.completed_by=this._draft.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(t.used_parts=(this._partOptions||[]).filter(e=>(this._partQty[`${e.entry_id}:${e.part_id}`]||0)>0).map(e=>({part_id:e.part_id,quantity:this._partQty[`${e.entry_id}:${e.part_id}`],...e.foreign?{entry_id:e.entry_id}:{}}))),this._draft.reading_value!==this._originalSnapshot.reading_value&&(t.reading_value=this._draft.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let e=this._readingNumbers(),r={};for(let d of this._readingRows)r[d.id]=e[d.id]??null;t.reading_values=r}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(t.photo_doc_ids=this._photos.ids),Object.keys(t).filter(e=>!["type","entry_id","task_id","original_timestamp"].includes(e)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(t),this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=A(t,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return h;let t=this._lang,i=this._draft,e=this._error||this._photos.errorText(t);return a`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
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
          @value-changed=${r=>{let d=r.detail.value;d&&this._set("timestamp",d)}}
        ></ms-date-field>
        <label>
          <span>${s("notes_label",t)}</span>
          <textarea
            rows="3"
            @input=${r=>{let d=r.target.value;this._set("notes",d||null)}}
            .value=${i.notes??""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${s("cost",t)}</span>
            <input type="number" min="0" step="0.01"
              .value=${i.cost!=null?String(i.cost):""}
              @input=${r=>{let d=r.target.value;this._set("cost",d?Number(d):null)}} />
          </label>
          <label>
            <span>${s("duration",t)}</span>
            <input type="number" min="0"
              .value=${i.duration!=null?String(i.duration):""}
              @input=${r=>{let d=r.target.value;this._set("duration",d?Number(d):null)}} />
          </label>
        </div>
        ${this._renderReadings(i,t)}
        ${this._partOptions&&this._partOptions.length>0?a`
          <div class="parts-block">
            <span class="parts-title">${s("complete_parts_used",t)}</span>
            ${this._partOptions.map(r=>{let d=`${r.entry_id}:${r.part_id}`,p=this._partQty[d]||0;return a`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${p>0}
                    @change=${_=>{let u=_.target.checked;this._partQty={...this._partQty,[d]:u?1:0}}} />
                  <span class="part-label">${r.name}${r.foreign&&r.object_name?` (${r.object_name})`:""}</span>
                  ${p>0?a`
                    <input class="part-qty" type="number" min="0.01" max="999" step="0.01"
                      .value=${String(p)}
                      @input=${_=>{let u=parseFloat(_.target.value);!isNaN(u)&&u>0&&(this._partQty={...this._partQty,[d]:u})}} />
                  `:h}
                </label>
              `})}
          </div>
        `:h}
        <div class="photos-block">
          <span class="parts-title">${s("completion_photos",t)}</span>
          ${this._photos.photos.length>0?a`
            <div class="photo-strip">
              ${this._photos.photos.map(r=>a`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${r.id}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${s("remove",t)}
                    @click=${()=>this._photos.remove(r.id)}>✕</button>
                </div>`)}
            </div>`:h}
          ${this._photos.full?a`<span class="photos-hint">${s("photos_limit",t).replace("{max}",String(this._photos.max))}</span>`:a`<ms-photo-picker .lang=${t} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${r=>this._photos.addFiles(r.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${s("history_edit_photos_hint",t)}</span>
        </div>
        ${e?a`<div class="error">${e}</div>`:h}
        <div class="actions">
          <button class="delete-entry" @click=${this._delete} ?disabled=${this._saving} title=${s("history_delete_entry",t)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon> ${s("history_delete_entry",t)}
          </button>
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${s("cancel",t)}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?s("saving",t):s("save",t)}
          </button>
        </div>
      </div>
    `}_renderReadings(t,i){return this._readingRows.length>0?a`
        <div class="readings-block">
          <span class="parts-title">${s("readings_section",i)}</span>
          ${this._readingRows.map(e=>a`
            <label class="reading-row-edit">
              <span class="reading-row-name">${e.name}${e.unit?` (${e.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[e.id]??""}
                @input=${r=>{this._readingText={...this._readingText,[e.id]:r.target.value}}} />
            </label>
          `)}
        </div>`:t.reading_value==null&&t.task_type!=="reading"?h:a`
      <label>
        <span>${s("reading_value_label",i)}${t.reading_unit?` (${t.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${t.reading_value!=null?String(t.reading_value):""}
          @input=${e=>{let r=e.target.value,d=r===""?NaN:Number(r);this._set("reading_value",isNaN(d)?null:d)}} />
      </label>`}};L.styles=[lt,k`
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
  `],l([g({attribute:!1})],L.prototype,"hass",2),l([c()],L.prototype,"_open",2),l([c()],L.prototype,"_saving",2),l([c()],L.prototype,"_error",2),l([c()],L.prototype,"_draft",2),l([c()],L.prototype,"_partOptions",2),l([c()],L.prototype,"_partQty",2),l([c()],L.prototype,"_readingRows",2),l([c()],L.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",L);function X(n){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Zt(n){return!n.startsWith("data:image/svg+xml,")&&!n.startsWith("data:image/png;base64,")?"":X(n)}function Ne(n){return n.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var R=class extends w{constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(t,i){this._entryId=t,this._taskId=null,this._objectName=i,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}openForTask(t,i,e,r){this._entryId=t,this._taskId=i,this._objectName=e,this._taskName=r,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}async _generate(){let t=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null;try{let i={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(i.task_id=this._taskId);let e=[this.hass.connection.sendMessagePromise({...i,action:"view"})];this._taskId&&e.push(this.hass.connection.sendMessagePromise({...i,action:"complete"}));let r=await Promise.all(e);if(t!==this._generateSeq)return;this._viewResult=r[0],r.length>1&&(this._completeResult=r[1])}catch(i){if(t!==this._generateSeq)return;let e=i?.code,r=i?.message;this._error=e==="no_url"||typeof r=="string"&&r.includes("No Home Assistant URL")?s("qr_error_no_url",this.lang):s("qr_error",this.lang)}finally{t===this._generateSeq&&(this._loading=!1)}}_setUrlMode(t){this._urlMode!==t&&(this._urlMode=t,this._generate())}_print(){if(!this._viewResult)return;let t=this._viewResult,i=t.label.task_name?`${t.label.object_name} \u2014 ${t.label.task_name}`:t.label.object_name,e=[t.label.manufacturer,t.label.model].filter(Boolean).join(" "),r=window.open("","_blank","width=600,height=500");if(!r)return;let d=this.lang||"en",p=X(i),_=X(e),u=!!this._completeResult,v=X(s("qr_action_view",d)),y=X(s("qr_action_complete",d));r.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
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
  .qr-col img{width:${u?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${p}</h2>
${_?`<div class="sub">${_}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${Zt(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${v}</div>
  </div>
  ${u?`<div class="qr-col">
    <img src="${Zt(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${y}</div>
  </div>`:""}
</div>
<div class="url">${X(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),r.document.close()}_downloadSvg(t,i){let e=decodeURIComponent(t.svg_data_uri.replace("data:image/svg+xml,","")),r=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;Qt(e,`qr-${Ne(r)}-${i}.svg`,"image/svg+xml")}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._error="",this._loading=!1}render(){if(!this._open)return a``;let t=this.lang||this.hass?.language||"en",i=this._taskName?`${s("qr_code",t)}: ${this._objectName} \u2014 ${this._taskName}`:`${s("qr_code",t)}: ${this._objectName}`,e=!!this._viewResult;return a`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i}</div>
        <div class="content">
          ${this._loading?a`<div class="loading">${s("qr_generating",t)}</div>`:this._error?a`<div class="error">${this._error}</div>`:e?a`
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
                      ${this._completeResult?a`
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
    `}};R.styles=k`
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
  `,l([g({attribute:!1})],R.prototype,"hass",2),l([g()],R.prototype,"lang",2),l([c()],R.prototype,"_open",2),l([c()],R.prototype,"_loading",2),l([c()],R.prototype,"_error",2),l([c()],R.prototype,"_viewResult",2),l([c()],R.prototype,"_completeResult",2),l([c()],R.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",R);function Xt(n){let o=n.getFullYear(),t=String(n.getMonth()+1).padStart(2,"0"),i=String(n.getDate()).padStart(2,"0");return`${o}-${t}-${i}`}function Me(n,o){if(o<=0)return 0;let t=typeof n=="number"&&Number.isFinite(n)?Math.trunc(n):0;return t<0?0:t%o}function Oe(n){return!!(n?.phases&&n.phase_sequence&&n.phase_sequence.length>0)}function ft(n){if(!n||!Oe(n))return null;let o=n.phase_sequence,t=Me(n.phase_cursor,o.length),i=o[t],e=n.phases?.[i];return e?{id:i,name:e.name,index:t,count:o.length,notes:e.notes,checklist:e.checklist!==void 0?e.checklist:n.checklist??[],consumesParts:e.consumes_parts!==void 0?e.consumes_parts:n.consumes_parts??[],requiredFields:e.required_completion_fields!==void 0?e.required_completion_fields:n.required_completion_fields??[]}:null}function st(n){let o=ft(n);return o?`${o.index+1}/${o.count} \xB7 ${o.name}`:""}function te(n){let o=n.task??null,t=o?ft(o):null,i=t?t.consumesParts:o?.consumes_parts||[],e=!!o?.part_ref,r=n.objects.find(_=>_.entry_id===n.entryId)?.parts||[],d=e?r.find(_=>_.id===o.part_ref.part_id):void 0,p=n.checklistsEnabled??!0;return{entry_id:n.entryId,task_id:n.taskId,task_name:n.taskName,checklist:t?p?t.checklist:[]:n.checklist??[],adaptive_enabled:!!n.adaptiveEnabled,required_completion_fields:t?t.requiredFields:o?.required_completion_fields||[],task_type:o?.type||"",reading_unit:o?.reading_unit||"",readings:o?.readings||[],reading_history:xt(o?.history),parts:e?[]:zt({consumes_parts:i},n.entryId,n.objects,n.lang),consumes_parts:e?[]:i,phase_label:t?st(o):"",require_tag_scan:!!o?.require_tag_scan,restock_default:e?d?.restock_quantity??1:null,restock_unit_cost:e?d?.cost??null:null,currency_symbol:tt({currency_symbol:n.currencySymbol}),consumes_info:i.map(_=>jt(_,n.entryId,n.objects,n.lang)),checklist_prefill:o?.checklist_progress||{},via_tag_scan:!!n.viaTagScan}}function ee(n,o,t){n.entryId=o.entry_id,n.taskId=o.task_id,n.taskName=o.task_name,n.lang=t,n.checklist=o.checklist??[],n.adaptiveEnabled=!!o.adaptive_enabled,n.requiredFields=o.required_completion_fields??[],n.taskType=o.task_type??"",n.readingUnit=o.reading_unit??"",n.readings=o.readings??[],n.readingHistory=o.reading_history??[],n.parts=o.parts??[],n.consumesParts=o.consumes_parts??[],n.phaseLabel=o.phase_label??"",n.requireTagScan=!!o.require_tag_scan,n.restockDefault=o.restock_default??null,n.restockUnitCost=o.restock_unit_cost??null,n.currencySymbol=tt(o),n.consumesInfo=o.consumes_info??[],n.checklistPrefill=o.checklist_prefill??{},n.viaTagScan=!!o.via_tag_scan,n.open({viaTagScan:!!o.via_tag_scan})}function x(n){return n.toFixed(1)}function ie(n,o){let t=n.interval_analysis,i=t?.weibull_beta,e=t?.weibull_eta;if(i==null||e==null||e<=0)return h;let r=n.interval_days??0,d=n.suggested_interval??r;return a`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${s("weibull_reliability_curve",o)}
        ${Fe(i,o)}
      </div>
      ${De(i,e,r,d,o)}
      ${je(t,o)}
      ${t?.confidence_interval_low!=null?ze(t,n,o):h}
    </div>
  `}function Fe(n,o){let t,i,e;return n<.8?(t="early_failures",i="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",e="beta_early_failures"):n<=1.2?(t="random_failures",i="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",e="beta_random_failures"):n<=3.5?(t="wear_out",i="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",e="beta_wear_out"):(t="highly_predictable",i="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",e="beta_highly_predictable"),a`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${i}"></ha-svg-icon>
      ${s(e,o)} (\u03B2=${T(n,o,2)})
    </span>
  `}function De(n,o,t,i,e){let f=Math.max(t,i,o,1)*1.3,S=50,H=[];for(let N=0;N<=S;N++){let O=N/S*f,ge=1-Math.exp(-Math.pow(O/o,n)),ve=32+O/f*260,fe=136-ge*128;H.push([ve,fe])}let B=H.map(([N,O])=>`${x(N)},${x(O)}`).join(" "),K="M32,136 "+H.map(([N,O])=>`L${x(N)},${x(O)}`).join(" ")+` L${x(H[S][0])},136 Z`,M=32+t/f*260,j=1-Math.exp(-Math.pow(t/o,n)),Q=136-j*128,_e=T((1-j)*100,e,0),yt=32+i/f*260,me=[0,.25,.5,.75,1];return a`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_weibull",e)}">
        ${me.map(N=>{let O=136-N*128;return J`
            <line x1="${32}" y1="${x(O)}" x2="${292}" y2="${x(O)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${N===.5?"4,3":h}" />
            <text x="${28}" y="${x(O+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${T(N*100,e,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(f/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(f)}</text>

        <path d="${K}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${B}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?J`
          <line x1="${x(M)}" y1="${8}" x2="${x(M)}" y2="${x(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${x(M)}" cy="${x(Q)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${x(M+4)}" y="${x(Q-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${_e}%</text>
        `:h}

        ${i>0&&i!==t?J`
          <line x1="${x(yt)}" y1="${8}" x2="${x(yt)}" y2="${x(136)}"
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
      ${t>0?a`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${s("current_interval_marker",e)}</span>`:h}
      ${i>0&&i!==t?a`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${s("recommended_marker",e)}</span>`:h}
    </div>
  `}function je(n,o){return a`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${s("characteristic_life",o)}</span>
        <span class="weibull-info-value">${Math.round(n.weibull_eta)} ${s("days",o)}</span>
      </div>
      ${n.weibull_r_squared!=null?a`
        <div class="weibull-info-item">
          <span>${s("weibull_r_squared",o)}</span>
          <span class="weibull-info-value">${T(n.weibull_r_squared,o,3)}</span>
        </div>
      `:h}
    </div>
  `}function ze(n,o,t){let i=n.confidence_interval_low,e=n.confidence_interval_high,r=o.suggested_interval??o.interval_days??0,d=o.interval_days??0,p=Math.max(0,i-5),u=e+5-p,v=(i-p)/u*100,y=(e-i)/u*100,$=(r-p)/u*100,f=d>0?(d-p)/u*100:-1;return a`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${s("confidence_interval",t)}: ${r} ${s("days",t)} (${i}\u2013${e})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${x(v)}%;width:${x(y)}%"></div>
        ${f>=0?a`<div class="confidence-marker current" style="left:${x(f)}%"></div>`:h}
        <div class="confidence-marker recommended" style="left:${x($)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${s("confidence_conservative",t)} (${i}${s("days",t).charAt(0)})</span>
        <span class="confidence-text high">${s("confidence_aggressive",t)} (${e}${s("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function se(n,o,t){let i=n.degradation_trend!=null&&n.degradation_trend!=="insufficient_data",e=n.days_until_threshold!=null,r=n.environmental_factor!=null&&n.environmental_factor!==1;if(!i&&!e&&!r)return h;let d=n.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":n.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return a`
    <div class="prediction-section">
      ${n.sensor_prediction_urgency?a`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${s("sensor_prediction_urgency",o).replace("{days}",String(Math.round(n.days_until_threshold||0)))}
        </div>
      `:h}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${s("sensor_prediction",o)}
      </div>
      <div class="prediction-grid">
        ${i?a`
          <div class="prediction-item">
            <ha-svg-icon path="${d}"></ha-svg-icon>
            <span class="prediction-label">${s("degradation_trend",o)}</span>
            <span class="prediction-value ${n.degradation_trend}">${s("trend_"+n.degradation_trend,o)}</span>
            ${n.degradation_rate!=null?a`<span class="prediction-rate">${n.degradation_rate>0?"+":""}${T(n.degradation_rate,o,Math.abs(n.degradation_rate)>=10?0:1)} ${n.trigger_entity_info?.unit_of_measurement||""}/${s("day_short",o)}</span>`:h}
          </div>
        `:h}
        ${e?a`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${s("days_until_threshold",o)}</span>
            <span class="prediction-value prediction-days${n.days_until_threshold===0?" exceeded":n.sensor_prediction_urgency?" urgent":""}">${n.days_until_threshold===0?s("threshold_exceeded",o):"~"+Math.round(n.days_until_threshold)+" "+s("days",o)}</span>
            ${n.threshold_prediction_date?a`<span class="prediction-date">${G(n.threshold_prediction_date,o)}</span>`:h}
            ${n.threshold_prediction_confidence?a`<span class="confidence-dot ${n.threshold_prediction_confidence}"></span>`:h}
            ${(n.prediction_cycles??0)>0?a`<span class="prediction-cycles">${s("prediction_cycles",o)}: ${n.prediction_cycles}</span>`:h}
          </div>
        `:h}
        ${r&&t.environmental?a`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${s("environmental_adjustment",o)}</span>
            <span class="prediction-value">${T(n.environmental_factor,o,2)}x</span>
            ${n.environmental_entity?a`<span class="prediction-entity entity-link" @click=${p=>Ht(p,n.environmental_entity)}>${n.environmental_entity}</span>`:h}
          </div>
        `:h}
      </div>
    </div>
  `}function re(n,o,t,i){let e=Math.max(n||1,o);return a`
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
          ${s("recommended",i)}: ${o} ${s("days",i)}
          <span class="confidence-badge ${t}">${s(`confidence_${t}`,i)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(o/e*100,100)}%"></div>
      </div>
    </div>
  `}var ne=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function ae(n,o,t){if(!t.seasonal||!n.seasonal_factor||n.seasonal_factor===1)return h;let i=ne.map(p=>s(p,o)),e=new Date().getMonth(),r=n.seasonal_factors||n.interval_analysis?.seasonal_factors||null,d=r&&r.length===12?r:i.map((p,_)=>{let u=n.seasonal_factor||1,v=Math.sin((_-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,u+v))});return a`
    <div class="seasonal-card-compact">
      <h4>${s("seasonal_awareness",o)}</h4>
      <div class="seasonal-mini-chart">
        ${d.map((p,_)=>{let u=p*40,v=p<.9?"low":p>1.1?"high":"normal";return a`
            <div class="seasonal-bar ${v} ${_===e?"current":""}"
                 style="height: ${u}px"
                 title="${i[_]}: ${T(p,o,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${s("shorter",o)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${s("normal",o)}</span>
        <span class="legend-item"><span class="dot high"></span> ${s("longer",o)}</span>
      </div>
    </div>
  `}function oe(n,o){return Ue(n,o)}function Ue(n,o){let t=n.seasonal_factors??n.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return h;let i=n.interval_analysis?.seasonal_reason,e=new Date().getMonth(),r=300,d=100,p=8,u=d-p-4,v=Math.max(...t,1.5),y=r/12,$=y*.65,f=p+u-1/v*u;return a`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${s("seasonal_chart_title",o)}
        ${i?a`<span class="source-tag">${i==="learned"?s("seasonal_learned",o):s("seasonal_manual",o)}</span>`:h}
      </div>
      <svg viewBox="0 0 ${r} ${d}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_seasonal",o)}">
        <line x1="0" y1="${x(f)}" x2="${r}" y2="${x(f)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((S,H)=>{let B=S/v*u,K=H*y+(y-$)/2,M=p+u-B,j=H===e,Q=S<1?"var(--success-color, #4caf50)":S>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return J`
            <rect x="${x(K)}" y="${x(M)}"
              width="${x($)}" height="${x(B)}"
              fill="${Q}" opacity="${j?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${ne.map((S,H)=>a`<span class="seasonal-label ${H===e?"active-month":""}">${s(S,o)}</span>`)}
      </div>
    </div>
  `}var I=class extends w{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._featuresLoaded=!1;this._currencySymbol=""}get _lang(){return P(this.hass)}async openFor(t,i){this._entryId=t,this._taskId=i,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=Xt(new Date),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){if(!this._featuresLoaded)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});t?.features&&(this._features={...this._features,...t.features}),this._currencySymbol=tt(t?.budget),At(t?.budget),this._featuresLoaded=!0}catch{}}close(){this._open=!1,this._task=null,this._error=""}async _loadTask(){if(!(!this._entryId||!this._taskId))try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._objectName=t.object?.name||"";let i=(t.tasks||[]).find(e=>e.id===this._taskId);this._task=i??null}catch(t){this._error=A(t,this._lang)}}async _runWs(t){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(t),this._busy=!1,!0}catch(i){return this._error=A(i,this._lang),this._busy=!1,!1}}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||import("./dialog-mount-BISVEM2S.js").then(async({openCompleteDialog:t})=>{let i=this._task,e=[];try{e=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}t(te({entryId:this._entryId,taskId:this._taskId,taskName:i.name,task:i,objects:e,lang:this._lang,checklist:i.checklist||[],adaptiveEnabled:!!i.adaptive_config?.enabled,currencySymbol:this._currencySymbol}))&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||import("./dialog-mount-BISVEM2S.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("./dialog-mount-BISVEM2S.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let t=s("delete_task_confirm",this._lang)||`Delete "${this._task?.name}"?`;if(!window.confirm(t))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})&&(this._toast=s("suggestion_applied",this._lang),this._notifyChanged("apply_suggestion"),await this._loadTask(),setTimeout(()=>{this._toast=""},2500))}async _reanalyzeInterval(){if(!(!this._entryId||!this._taskId)){this._busy=!0,this._error="";try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});this._toast=t.recommended_interval?`${s("reanalyze_result",this._lang)}: ${Lt(t.recommended_interval,"days",this._lang)} (${t.data_points} pts)`:s("reanalyze_insufficient_data",this._lang),await this._loadTask(),setTimeout(()=>{this._toast=""},3500)}catch(t){this._error=A(t,this._lang)}finally{this._busy=!1}}}_onEditHistoryEntry(t){!this._entryId||!this._taskId||import("./dialog-mount-BISVEM2S.js").then(({openHistoryEditDialog:i})=>{i({entry_id:this._entryId,task_id:this._taskId,original_timestamp:t.timestamp,type:t.type,timestamp:t.timestamp,notes:t.notes??null,cost:t.cost??null,duration:t.duration??null,completed_by:t.completed_by??null,used_parts:t.used_parts??null,photo_doc_ids:pt(t),reading_value:t.reading_value??null,reading_values:ht(t),readings:this._task?.readings??[],task_type:this._task?.type??null,reading_unit:this._task?.reading_unit??null})})}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return h;let i=this._lang;return a`
      <div class="recommendation-card">
        <h4>${s("suggested_interval",i)}</h4>
        ${re(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",i)}
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
    `}_renderAdaptive(t){let i=this._lang,e=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,r=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,d=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,p=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!e&&!r&&!d&&!p?a`<div class="adaptive-empty">
        ${s("adaptive_no_data",i)}
      </div>`:a`
      <div class="adaptive-stack">
        ${this._toast?a`<div class="toast">${this._toast}</div>`:h}
        ${e?this._renderRecommendation(t):h}
        ${r?se(t,i,this._features):h}
        ${d?ie(t,i):h}
        ${p?a`
          ${ae(t,i,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?oe(t,i):h}
        `:h}
      </div>
    `}_renderHistoryReadings(t,i,e){let r=ht(t),d=p=>T(p,e,{maximumFractionDigits:3});if(r.length>0)return a`<div class="history-readings">
        ${r.map(p=>{let _=wt(i,t,p.id);return a`<span class="history-reading"><span class="history-reading-name">${p.name}</span>
            <span class="history-reading-value">${d(p.value)}${p.unit?` ${p.unit}`:""}${_==null?"":` (${_>=0?"+":""}${d(_)})`}</span></span>`})}
      </div>`;if(t.reading_value!=null){let p=this._task?.reading_unit?` ${this._task.reading_unit}`:"";return a`<div class="history-readings"><span class="history-reading">
        <span class="history-reading-name">${s("reading_label",e)}</span>
        <span class="history-reading-value">${d(t.reading_value)}${p}</span></span></div>`}return h}_renderDetails(t){let i=this._lang,e=t.history||[],r=e.filter(_=>_.type==="completed"),d=r.reduce((_,u)=>_+(typeof u.cost=="number"?u.cost:0),0),p=(()=>{let _=r.map(u=>typeof u.duration=="number"?u.duration:null).filter(u=>u!=null);return _.length?Math.round(_.reduce((u,v)=>u+v,0)/_.length):null})();return a`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${s("times_performed",i)}</span>
            <span class="stat-value">${r.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("total_cost",i)}</span>
            <span class="stat-value">${et(d,this._currencySymbol,i)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("avg_duration",i)}</span>
            <span class="stat-value">${p!=null?`${p}m`:"\u2014"}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${s("history",i)}</strong>
          <span class="history-count">${e.length}</span>
        </div>
        ${e.length===0?a`<div class="history-empty">${s("history_empty",i)}</div>`:a`
              <div class="history-list">
                ${[...e].reverse().slice(0,20).map(_=>{let u=["completed","reset","skipped"].includes(_.type);return a`
                    <div class="history-entry">
                      <div class="history-line">
                        <span class="history-type type-${_.type}">${s(_.type,i)}</span>
                        <span class="history-date">${Pt(_.timestamp,i)}</span>
                        ${u?a`<button class="history-edit"
                                   title="${s("history_edit_button",i)}"
                                   @click=${()=>this._onEditHistoryEntry(_)}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                            </button>`:h}
                      </div>
                      ${_.notes?a`<div class="history-notes">${_.notes}</div>`:h}
                      ${this._renderHistoryReadings(_,e,i)}
                      ${(()=>{let v=pt(_);return v.length?a`<div class="history-photos">
                              ${v.map(y=>a`<maintenance-history-photo .hass=${this.hass} .docId=${y}></maintenance-history-photo>`)}
                            </div>`:h})()}
                      ${_.cost!=null||_.duration!=null?a`<div class="history-meta">
                            ${_.cost!=null?a`<span>💰 ${et(_.cost,this._currencySymbol,i)}</span>`:h}
                            ${_.duration!=null?a`<span>⏱️ ${_.duration}m</span>`:h}
                          </div>`:h}
                    </div>
                  `})}
                ${e.length>20?a`<div class="history-more">… +${e.length-20} ${s("older_entries",i)}</div>`:h}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return h;let t=this._lang,i=this._task,e=this.hass?.user?.is_admin??!0;return a`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${i?a`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${rt[i.status]||"#ccc"}"></span>
                  <span class="task-name">${i.name}</span>
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("./dialog-mount-BISVEM2S.js").then(({openObjectQuickActions:r})=>{r(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${i.next_due?a`<span><strong>${s("next_due",t)}:</strong> ${G(i.next_due,t)}</span>`:h}
                  ${i.last_performed?a`<span><strong>${s("last_performed",t)}:</strong> ${G(i.last_performed,t)}</span>`:h}
                  ${i.schedule?.kind&&!["manual","one_time"].includes(i.schedule.kind)||i.interval_days!=null?a`<span><strong>${s("interval",t)}:</strong> ${Rt(i,t)}</span>`:h}
                  ${st(i)?a`<span><strong>${s("phase_current",t)}:</strong> ${st(i)}</span>`:h}
                </div>
              </div>

              ${this._error?a`<div class="error">${this._error}</div>`:h}

              ${this._showSkip?a`
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
                  `:this._showReset?a`
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
                  `:a`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${this._onComplete} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${s("complete",t)}
                      </ha-button>
                      ${i.allow_skip!==!1?a`
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
                    ${e?a`
                          <div class="actions secondary-row">
                            <ha-button size="small" appearance="outlined" variant="neutral" @click=${this._onEdit} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                              ${s("edit",t)}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="neutral" @click=${this._onQr} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                              ${s("qr_code",t)}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="neutral"
                              @click=${i.archived?this._onUnarchive:this._onArchive}
                              .disabled=${this._busy}>
                              <ha-icon slot="start" icon="${i.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                              ${i.archived?s("unarchive",t):s("archive",t)}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="danger" class="danger" @click=${this._onDelete} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                              ${s("delete",t)}
                            </ha-button>
                          </div>
                        `:h}
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?s("hide_details",t):s("show_details",t)}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?a`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
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
            `:a`<div class="loading">${s("loading",t)}</div>`}
      </div>
    `}};I.styles=[Mt,k`
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
    .history-list { display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow: auto; }
    .history-entry {
      padding: 6px 8px; border-radius: 6px;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
      font-size: 13px;
    }
    .history-line {
      display: flex; align-items: center; gap: 8px;
      justify-content: space-between;
    }
    .history-type {
      font-weight: 600; font-size: 11px;
      padding: 2px 6px; border-radius: 4px;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .type-completed { background: rgba(46,125,50,0.2); color: #66bb6a; }
    .type-skipped { background: rgba(158,158,158,0.2); color: var(--secondary-text-color); }
    .type-reset { background: rgba(33,150,243,0.2); color: #64b5f6; }
    .type-triggered { background: rgba(255,87,34,0.2); color: #ff8a65; }
    .history-date { font-size: 11px; color: var(--secondary-text-color); flex: 1; text-align: right; }
    .history-edit {
      background: transparent; border: none; cursor: pointer;
      padding: 4px; border-radius: 4px;
      color: var(--secondary-text-color);
    }
    .history-edit:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); color: var(--primary-color); }
    .history-edit ha-icon { --mdc-icon-size: 14px; }
    .history-notes { margin-top: 4px; color: var(--primary-text-color); }
    .history-meta { display: flex; gap: 12px; margin-top: 4px; color: var(--secondary-text-color); font-size: 11px; }
    /* #161: readings + photos on the entry (panel-timeline parity) */
    .history-readings { display: flex; flex-wrap: wrap; gap: 2px 16px; margin-top: 4px; font-size: 12px; }
    .history-reading { display: inline-flex; gap: 6px; }
    .history-reading-name { color: var(--secondary-text-color); }
    .history-reading-value { font-variant-numeric: tabular-nums; }
    .history-photos { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
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
  `],l([g({attribute:!1})],I.prototype,"hass",2),l([c()],I.prototype,"_open",2),l([c()],I.prototype,"_entryId",2),l([c()],I.prototype,"_taskId",2),l([c()],I.prototype,"_task",2),l([c()],I.prototype,"_objectName",2),l([c()],I.prototype,"_busy",2),l([c()],I.prototype,"_error",2),l([c()],I.prototype,"_showSkip",2),l([c()],I.prototype,"_showReset",2),l([c()],I.prototype,"_showDetails",2),l([c()],I.prototype,"_showAdaptive",2),l([c()],I.prototype,"_skipReason",2),l([c()],I.prototype,"_resetDate",2),l([c()],I.prototype,"_features",2),l([c()],I.prototype,"_toast",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",I);function le(n){return!!n&&/^https?:\/\//i.test(n)}function de(n){return n?customElements.get("ha-markdown")?a`<ha-markdown class="notes-md" .content=${n} breaks></ha-markdown>`:a`${n}`:h}var D=class extends w{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error=""}get _lang(){return P(this.hass)}async openFor(t){this._entryId=t,this._error="",this._open=!0,await this._load()}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._data=t}catch(t){this._error=A(t,this._lang)}}_onEditObject(){!this._entryId||!this._data||import("./dialog-mount-BISVEM2S.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("./dialog-mount-BISVEM2S.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data)return;let t=s("delete_object_confirm",this._lang)||`Delete "${this._data.object.name}" and all its tasks?`;if(window.confirm(t)){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(i){this._error=A(i,this._lang)}finally{this._busy=!1}}}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t){let i=s("confirm_archive_object",this._lang);if(!window.confirm(i))return}this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(i){this._error=A(i,this._lang)}finally{this._busy=!1}}_onTaskClick(t){this._entryId&&import("./dialog-mount-BISVEM2S.js").then(({openTaskQuickActions:i})=>{i(this._entryId,t)})}render(){if(!this._open)return h;let t=this._lang,i=this._data,e=i?.object,r=i?.tasks||[],d=this.hass?.user?.is_admin??!0;return a`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${i&&e?a`
              <div class="header">
                <div class="title">${e.name}</div>
                ${this._renderMetaRow(e)}
              </div>

              ${this._error?a`<div class="error">${this._error}</div>`:h}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${s("tasks",t)}</strong>
                  <span class="count">${r.length}</span>
                </div>
                ${r.length===0?a`<div class="empty">${s("no_tasks",t)}</div>`:a`
                      <div class="task-list">
                        ${r.map(p=>a`
                          <div class="task-row" @click=${()=>this._onTaskClick(p.id)}>
                            <span class="status-dot" style="background: ${rt[p.status]||"#ccc"}"></span>
                            <span class="task-name">${p.name}</span>
                            <span class="task-status">${s(p.status||"ok",t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${e.notes?a`
                    <div class="notes-section">
                      <strong>${s("object_notes_label",t)}</strong>
                      <div class="notes-body">${de(e.notes)}</div>
                    </div>
                  `:h}

              ${d?a`
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
            `:a`<div class="loading">${s("loading",t)}</div>`}
      </div>
    `}_renderMetaRow(t){let i=this._lang,e=[];return t.area_id&&e.push([s("area",i),t.area_id]),t.manufacturer&&e.push([s("manufacturer",i),t.manufacturer]),t.model&&e.push([s("model",i),t.model]),t.serial_number&&e.push([s("serial_number_label",i),t.serial_number]),t.installation_date&&e.push([s("installed",i),t.installation_date]),t.warranty_expiry&&e.push([s("warranty",i),t.warranty_expiry]),t.documentation_url&&e.push([s("documentation_url_label",i),t.documentation_url]),e.length===0?h:a`
      <div class="meta">
        ${e.map(([r,d])=>a`
            <div class="meta-item">
              <span class="meta-label">${r}</span>
              <span class="meta-value">${le(d)?a`<a href="${d}" target="_blank" rel="noopener noreferrer">${d}</a>`:d}</span>
            </div>
          `)}
      </div>
    `}};D.styles=k`
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
  `,l([g({attribute:!1})],D.prototype,"hass",2),l([c()],D.prototype,"_open",2),l([c()],D.prototype,"_entryId",2),l([c()],D.prototype,"_data",2),l([c()],D.prototype,"_busy",2),l([c()],D.prototype,"_error",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",D);var bt={features:{adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1},defaultWarningDays:7,rowActionStyle:"buttons_compact"};function ce(){let n=window;return n.__msSettingsCache??={promise:null}}function dt(n){let o=ce();if(o.promise)return o.promise;let t=n.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(i=>({features:i.features??bt.features,defaultWarningDays:i.general?.default_warning_days??7,rowActionStyle:i.general?.row_action_style??bt.rowActionStyle})).catch(()=>(o.promise===t&&(o.promise=null),bt));return o.promise=t,t}function pe(){ce().promise=null}var he="maintenance-object-dialog",ue="maintenance-task-dialog",Ve="maintenance-history-edit-dialog",Be="maintenance-complete-dialog",We="maintenance-qr-dialog",Ke="maintenance-task-quick-actions-dialog",Ge="maintenance-object-quick-actions-dialog";function ct(){return document.querySelector("home-assistant")?.hass}function Ye(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function U(n){let o=Ye(),t=o.querySelector(n)??document.body.querySelector(n);return t?t.parentNode!==o&&o.appendChild(t):(t=document.createElement(n),o.appendChild(t)),t}function V(n){let o=ct();if(!o)return!1;n.hass=o;let t=P(o);return St(t)||Tt(t).then(()=>{n.requestUpdate?.()}),Ct(o.locale,o.config?.country),!0}function Gr(n){return dt(n).then(o=>o.rowActionStyle)}function Yr(){pe()}function Qr(){let n=U(he);return V(n)?(n.openCreate(),!0):!1}function Jr(n,o){let t=U(he);return V(t)?(t.openEdit(n,o),!0):!1}function Zr(n="",o){let t=U(ue);if(!V(t))return!1;let i=ct();return i?((async()=>{let e=await dt(i),r=t;r.checklistsEnabled=e.features.checklists,r.scheduleTimeEnabled=e.features.schedule_time,r.completionActionsEnabled=e.features.completion_actions,r.defaultWarningDays=e.defaultWarningDays,r.openCreate(n,o)})(),!0):!1}function Xr(n,o){let t=U(ue);if(!V(t))return!1;let i=ct();return i?((async()=>{try{let[e,r]=await Promise.all([i.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:n}),dt(i)]),d=(e.tasks||[]).find(_=>_.id===o);if(!d){console.warn(`openEditTaskDialog: task ${o} not found in entry ${n}`);return}let p=t;p.checklistsEnabled=r.features.checklists,p.scheduleTimeEnabled=r.features.schedule_time,p.completionActionsEnabled=r.features.completion_actions,p.defaultWarningDays=r.defaultWarningDays,await p.openEdit(n,d)}catch(e){console.warn("openEditTaskDialog: failed to load task/features",e)}})(),!0):!1}function tn(n){let o=U(Ve);return V(o)?(o.openEdit(n),!0):!1}function en(n){let o=U(Be);return V(o)?(ee(o,n,P(ct())),!0):!1}function sn(n){let o=U(We);return V(o)?(o.openForTask(n.entry_id,n.task_id,n.object_name,n.task_name),!0):!1}function rn(n,o){let t=U(Ke);return V(t)?(t.openFor(n,o),!0):!1}function nn(n){let o=U(Ge);return V(o)?(o.openFor(n),!0):!1}export{Yr as __resetSettingsCacheForTests,Gr as getRowActionStyle,en as openCompleteDialog,Qr as openCreateObjectDialog,Zr as openCreateTaskDialog,Jr as openEditObjectDialog,Xr as openEditTaskDialog,tn as openHistoryEditDialog,nn as openObjectQuickActions,sn as openQrDialog,rn as openTaskQuickActions};
