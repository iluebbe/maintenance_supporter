/*! maintenance_supporter frontend 2.57.0 */
import{a as w,b as r,c as z,d as p,e as E,f as g,g as l,i as s,j as it,k as st,l as N,m as rt,n as nt,o as Z,p as at,q as ot,r as lt,s as dt,t as I}from"./chunk-CWQRMTXS.js";import{a as n,b as B}from"./chunk-HQWGP2HE.js";var T=class extends E{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1}_onInput(t){let e=t.target.value;this.value=e,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:e}}))}render(){return r`
      <label class="field">
        ${this.label?r`<span class="label">${this.label}${this.required?r`<span class="req">*</span>`:p}</span>`:p}
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
        />
        ${this.helper?r`<span class="helper">${this.helper}</span>`:p}
      </label>
    `}};T.styles=w`
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
    .helper {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
  `,n([g()],T.prototype,"label",2),n([g()],T.prototype,"value",2),n([g()],T.prototype,"placeholder",2),n([g()],T.prototype,"type",2),n([g({type:Boolean})],T.prototype,"required",2),n([g({type:Boolean})],T.prototype,"disabled",2),n([g()],T.prototype,"step",2),n([g()],T.prototype,"min",2),n([g()],T.prototype,"max",2),n([g()],T.prototype,"pattern",2),n([g()],T.prototype,"helper",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",T);var x=class extends E{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._entryId=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId="",this._error="",this._open=!0}openEdit(t,e){this._entryId=t,this._name=e.name||"",this._manufacturer=e.manufacturer||"",this._model=e.model||"",this._serialNumber=e.serial_number||"",this._areaId=e.area_id||"",this._installationDate=e.installation_date||"",this._warrantyExpiry=e.warranty_expiry||"",this._documentationUrl=e.documentation_url||"",this._notes=e.notes||"",this._haDeviceId=e.ha_device_id||"",this._parentEntryId=e.parent_entry_id||"",this._error="",this._open=!0}async _save(){if(!this._loading&&this._name.trim()){this._loading=!0,this._error="";try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}catch(t){this._error=I(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_parentChoices(){return(this.objects||[]).filter(t=>t.entry_id!==this._entryId)}_close(){this._open=!1}render(){if(!this._open)return r``;let t=this._lang,e=this._entryId?s("edit_object",t):s("new_object",t);return r`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${e}</div>
        <div class="content">
          ${this._error?r`<div class="error">${this._error}</div>`:p}
          <ms-textfield
            label="${s("name",t)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("manufacturer_optional",t)}"
            .value=${this._manufacturer}
            @input=${i=>this._manufacturer=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("model_optional",t)}"
            .value=${this._model}
            @input=${i=>this._model=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("serial_number_optional",t)}"
            .value=${this._serialNumber}
            @input=${i=>this._serialNumber=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("documentation_url_optional",t)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${i=>this._documentationUrl=i.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${s("area_id_optional",t)}"
            .value=${this._areaId}
            @value-changed=${i=>this._areaId=i.detail.value||""}
          ></ha-area-picker>
          <ms-textfield
            label="${s("installation_date_optional",t)}"
            type="date"
            .value=${this._installationDate}
            @input=${i=>this._installationDate=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("warranty_expiry_optional",t)}"
            type="date"
            .value=${this._warrantyExpiry}
            @input=${i=>this._warrantyExpiry=i.target.value}
          ></ms-textfield>
          <ha-form
            .hass=${this.hass}
            .data=${{device:this._haDeviceId||void 0}}
            .schema=${[{name:"device",selector:{device:{}}}]}
            .computeLabel=${()=>s("link_device_optional",t)}
            @value-changed=${i=>this._haDeviceId=i.detail.value?.device||""}
          ></ha-form>
          ${this._parentChoices().length?r`<label class="textarea-field">
                <span class="textarea-label">${s("parent_object_optional",t)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${i=>this._parentEntryId=i.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${s("parent_none",t)}
                  </option>
                  ${this._parentChoices().map(i=>r`<option
                      value=${i.entry_id}
                      ?selected=${this._parentEntryId===i.entry_id}
                    >${i.object.name}</option>`)}
                </select>
              </label>`:p}
          <label class="textarea-field">
            <span class="textarea-label">${s("object_notes_optional",t)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${i=>this._notes=i.target.value}
            ></textarea>
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
    `}};x.styles=w`
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
  `,n([g({attribute:!1})],x.prototype,"hass",2),n([g({attribute:!1})],x.prototype,"objects",2),n([l()],x.prototype,"_open",2),n([l()],x.prototype,"_loading",2),n([l()],x.prototype,"_error",2),n([l()],x.prototype,"_name",2),n([l()],x.prototype,"_manufacturer",2),n([l()],x.prototype,"_model",2),n([l()],x.prototype,"_serialNumber",2),n([l()],x.prototype,"_areaId",2),n([l()],x.prototype,"_installationDate",2),n([l()],x.prototype,"_warrantyExpiry",2),n([l()],x.prototype,"_documentationUrl",2),n([l()],x.prototype,"_notes",2),n([l()],x.prototype,"_haDeviceId",2),n([l()],x.prototype,"_parentEntryId",2),n([l()],x.prototype,"_entryId",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",x);var W=class{constructor(h){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=h}updateHass(h){this.hass=h}async getUsers(h=!1){let t=Date.now();if(!h&&this.usersCache&&t-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=e.users,this.cacheTimestamp=t,this.usersCache}catch(e){return console.error("Failed to fetch users:",e),this.usersCache||[]}}async assignUser(h,t,e){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:h,task_id:t,user_id:e})}async getTasksByUser(h){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:h})).tasks}getUserName(h){return!h||!this.usersCache?null:this.usersCache.find(e=>e.id===h)?.name||null}getUser(h){return!h||!this.usersCache?null:this.usersCache.find(t=>t.id===h)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(h){return h?h===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}};function M(o){return`${o.entry_id??""}\0${o.part_id}`}var J=["sensor","binary_sensor","number","input_number","input_boolean","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock"],ct=["sensor"],pt=["temperature","humidity","pressure"];var ht=["notes","cost","duration","photo","user"],K={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"};var Pt=["cleaning","inspection","replacement","calibration","service","reading","custom"],Ct=["low","normal","high"],Ht=["time_based","weekdays","nth_weekday","day_of_month","sensor_based","one_time","manual"],X=["weekdays","nth_weekday","day_of_month"],_t=["threshold","counter","state_change","runtime"],Rt=[..._t,"compound"];function qt(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",carry:{}}}var Ft=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states"]);function Mt(o){return{entityIds:(o.entity_ids||(o.entity_id?[o.entity_id]:[])).join(", "),type:o.type||"threshold",attribute:o.attribute||"",above:o.trigger_above?.toString()??"",below:o.trigger_below?.toString()??"",forMinutes:o.trigger_for_minutes?.toString()??"0",targetValue:o.trigger_target_value?.toString()??"",deltaMode:o.trigger_delta_mode||!1,fromState:o.trigger_from_state||"",toState:o.trigger_to_state||"",targetChanges:o.trigger_target_changes?.toString()??"",runtimeHours:o.trigger_runtime_hours?.toString()??"",onStates:(o.trigger_on_states||[]).join(", "),carry:Object.fromEntries(Object.entries(o).filter(([t])=>!Ft.has(t)&&!t.startsWith("_")))}}function Nt(o){let h=o.entityIds.split(",").map(e=>e.trim()).filter(Boolean);if(h.length===0)return null;let t={...o.carry||{},entity_id:h[0],entity_ids:h,type:o.type};if(o.attribute&&(t.attribute=o.attribute),o.type==="threshold"){let e=parseFloat(o.above);isNaN(e)||(t.trigger_above=e);let i=parseFloat(o.below);isNaN(i)||(t.trigger_below=i);let a=parseInt(o.forMinutes,10);isNaN(a)||(t.trigger_for_minutes=a)}else if(o.type==="counter"){let e=parseFloat(o.targetValue);isNaN(e)||(t.trigger_target_value=e),t.trigger_delta_mode=o.deltaMode}else if(o.type==="state_change"){o.fromState&&(t.trigger_from_state=o.fromState),o.toState&&(t.trigger_to_state=o.toState);let e=parseInt(o.targetChanges,10);isNaN(e)||(t.trigger_target_changes=e)}else if(o.type==="runtime"){let e=parseFloat(o.runtimeHours);isNaN(e)||(t.trigger_runtime_hours=e);let i=(o.onStates||"").split(",").map(a=>a.trim()).filter(Boolean);i.length>0&&(t.trigger_on_states=i)}return t}function Ot(o){return Array.from({length:7},(h,t)=>Z(t,o,"short"))}function zt(o){let h=new Intl.DateTimeFormat(o||"en",{month:"short"});return Array.from({length:12},(t,e)=>h.format(new Date(2021,e,1)))}var m=class m extends E{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.defaultWarningDays=7;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._entryId="";this._taskId=null;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._priority="normal";this._labels="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerForMinutes="0";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerOnStates="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._readingUnit="";this._consumesParts={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._requiredCompletion=[];this._scheduleTime="";this._actionService="";this._actionTargetEntity="";this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha="0.3";this._adaptiveMin="7";this._adaptiveMax="365";this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}async openCreate(t,e){this._entryId=t,this._taskId=null,this._error="",!t&&e&&e.length>0?(this._objectChoices=e.map(i=>({entry_id:i.entry_id,name:i.object.name})).sort((i,a)=>i.name.localeCompare(a.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(t,e){this._entryId=t,this._taskId=e.id,this._error="",this._name=e.name,this._type=e.type,this._scheduleType=e.schedule_type,this._intervalDays=e.interval_days!=null?String(e.interval_days):"",this._intervalUnit=e.interval_unit||"days",this._dueDate=e.due_date||"";let i=e.schedule;this._weekdays=i?.kind==="weekdays"?[...i.weekdays??[]]:[],this._nth=i?.kind==="nth_weekday"?String(i.nth??1):"1",this._nthWeekday=i?.kind==="nth_weekday"?String(i.weekday??5):"5",this._domDay=i?.kind==="day_of_month"&&(i.day??1)>=1?String(i.day??1):"1",this._domLastDay=i?.kind==="day_of_month"&&i.day===-1,this._domBusiness=i?.kind==="day_of_month"&&i.business===!0,this._calOffset=i?.offset?String(i.offset):"0",this._seasonMonths=Array.isArray(i?.season_months)?[...i.season_months]:[];let a=i?.ends;a&&typeof a.count=="number"?(this._endsMode="count",this._endsCount=String(a.count),this._endsUntil=""):a&&typeof a.until=="string"?(this._endsMode="until",this._endsUntil=a.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=e.warning_days.toString(),this._earliestCompletionDays=e.earliest_completion_days!=null?String(e.earliest_completion_days):"",this._intervalAnchor=e.interval_anchor||"completion",this._notes=e.notes||"",this._documentationUrl=e.documentation_url||"",this._customIcon=e.custom_icon||"",this._priority=e.priority||"normal",this._labels=(e.labels||[]).join(", "),this._enabled=e.enabled!==!1,this._lastPerformed=e.last_performed||"",this._nfcTagId=e.nfc_tag_id||"",this._readingUnit=e.reading_unit||"",this._consumesParts=Object.fromEntries((e.consumes_parts||[]).map(u=>[M(u),{...u}])),this._responsibleUserId=e.responsible_user_id||null,this._assigneePool=[...e.assignee_pool||[]],this._rotationStrategy=e.rotation_strategy||"",this._checklistText=(e.checklist||[]).join(`
`),this._requiredCompletion=[...e.required_completion_fields||[]],this._scheduleTime=e.schedule_time||"";let d=e.on_complete_action;if(d&&d.service){this._actionService=d.service;let u=d.target?.entity_id;this._actionTargetEntity=Array.isArray(u)?u[0]||"":u||"",this._actionData=d.data&&typeof d.data=="object"?{...d.data}:{},this._actionDataJsonFallback=""}else this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="";let c=e.quick_complete_defaults;this._qcNotes=c?.notes||"",this._qcCost=c?.cost!=null?String(c.cost):"",this._qcDuration=c?.duration!=null?String(c.duration):"",this._qcFeedback=c?.feedback||"";let _=e.adaptive_config||{};if(this._environmentalEntity=_.environmental_entity||"",this._environmentalAttribute=_.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!_.enabled,this._adaptiveAlpha=(_.ewa_alpha??.3).toString(),this._adaptiveMin=(_.min_interval_days??7).toString(),this._adaptiveMax=(_.max_interval_days??365).toString(),this._adaptiveSeasonal=_.seasonal_enabled!==!1,this._adaptivePrediction=_.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),e.trigger_config){let u=e.trigger_config;this._triggerEntityId=u.entity_id||u.entity_ids&&u.entity_ids[0]||"",this._triggerEntityIds=u.entity_ids||(u.entity_id?[u.entity_id]:[]),this._triggerEntityLogic=u.entity_logic||"any",this._triggerAttribute=u.attribute||"",this._triggerType=u.type||"threshold",this._triggerAbove=u.trigger_above?.toString()||"",this._triggerBelow=u.trigger_below?.toString()||"",this._triggerForMinutes=u.trigger_for_minutes?.toString()||"0",this._triggerTargetValue=u.trigger_target_value?.toString()||"",this._triggerDeltaMode=u.trigger_delta_mode||!1,this._triggerBaselineValue=u.trigger_baseline_value?.toString()||"",this._liveBaselineValue=e.trigger_baseline_value??null,this._autoCompleteOnRecovery=u.auto_complete_on_recovery||!1,this._triggerFromState=u.trigger_from_state||"",this._triggerToState=u.trigger_to_state||"",this._triggerTargetChanges=u.trigger_target_changes?.toString()||"",this._triggerRuntimeHours=u.trigger_runtime_hours?.toString()||"",this._triggerOnStates=(u.trigger_on_states||[]).join(", "),u.type==="compound"?(this._compoundLogic=u.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(u.conditions||[]).map(Mt)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._priority="normal",this._labels="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._readingUnit="",this._consumesParts={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._requiredCompletion=[],this._scheduleTime="",this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha="0.3",this._adaptiveMin="7",this._adaptiveMax="365",this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="",this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._triggerAttribute="",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerForMinutes="0",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges="",this._triggerRuntimeHours="",this._triggerOnStates="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new W(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(t){console.error("Failed to load users:",t),this._availableUsers=[]}}_toggleAssignee(t){this._assigneePool=this._assigneePool.includes(t)?this._assigneePool.filter(e=>e!==t):[...this._assigneePool,t]}async _testAction(){let t=this._actionService.trim();if(!t||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(t)){this._actionTestResult="error",this._actionTestError="Invalid service format (expected 'domain.service')",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[e,i]=t.split(".");if(!this.hass?.services?.[e]?.[i]){this._actionTestResult="error",this._actionTestError=`Service "${t}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let a=this._actionTargetEntity.trim();if(a){let d=a.split(".")[0];if(d!==e&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(e)){this._actionTestResult="error",this._actionTestError=`Service "${t}" only works on ${e}.* entities; entity "${a}" is in ${d}.* \u2014 pick a service that matches the entity domain (e.g. ${d}.${i})`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[a]){this._actionTestResult="error",this._actionTestError=`Target entity "${a}" not found in Home Assistant \u2014 the entity may have been renamed or its integration removed.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let t=JSON.parse(this._actionDataJsonFallback);if(t&&typeof t=="object"&&!Array.isArray(t))return t}catch{}return{...this._actionData}}_serviceSchema(){let t=this._actionService.trim();if(!t||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(t))return null;let[e,i]=t.split("."),a=this.hass?.services?.[e]?.[i]?.fields;return!a||Object.keys(a).length===0?null:Object.entries(a).map(([d,c])=>({name:d,required:!!c.required,selector:c.selector||{text:{}}}))}_renderCompletionActionsSection(t){if(!this.completionActionsEnabled)return p;let e=this._serviceSchema();return r`
      <details class="ca-section">
        <summary>${s("on_complete_action_title",t)}</summary>
        <p class="field-help">${s("on_complete_action_desc",t)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${i=>{this._actionService=i.detail.value||"";let a=this._serviceSchema();if(a){let d=new Set(a.map(c=>c.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([c])=>d.has(c)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>s("on_complete_action_target",t)}
          @value-changed=${i=>{let a=i.detail.value;this._actionTargetEntity=a.target_entity||""}}
        ></ha-form>
        <p class="field-help ca-domain-hint">
          ${s("on_complete_action_target_hint",t)}
        </p>
        ${e?r`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${e}
                .data=${this._actionData}
                @value-changed=${i=>{this._actionData={...i.detail.value}}}
              ></ha-form>
            `:r`
              <ms-textfield
                label="${s("on_complete_action_data",t)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${i=>{this._actionDataJsonFallback=i.target.value}}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting||!this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting?"\u2026":s("on_complete_action_test",t)}
          </button>
          ${this._actionTestResult==="ok"?r`<span class="ca-test-ok">${s("on_complete_action_test_success",t)}</span>`:p}
          ${this._actionTestResult==="error"?r`<div class="ca-test-error-block">
                <span class="ca-test-error">${s("on_complete_action_test_failed",t)}</span>
                ${this._actionTestError?r`<div class="ca-test-error-detail">${this._actionTestError}</div>`:p}
              </div>`:p}
        </div>
      </details>

      <details class="ca-section">
        <summary>${s("quick_complete_defaults_title",t)}</summary>
        <p class="field-help">${s("quick_complete_defaults_desc",t)}</p>
        <ms-textfield
          label="${s("quick_complete_defaults_notes",t)}"
          .value=${this._qcNotes}
          @input=${i=>{this._qcNotes=i.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${s("quick_complete_defaults_cost",t)}"
          type="number" min="0" step="0.01"
          .value=${this._qcCost}
          @input=${i=>{this._qcCost=i.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${s("quick_complete_defaults_duration",t)}"
          type="number" min="0" step="1"
          .value=${this._qcDuration}
          @input=${i=>{this._qcDuration=i.target.value}}
        ></ms-textfield>
        <select class="qc-feedback"
          .value=${this._qcFeedback}
          @change=${i=>{this._qcFeedback=i.target.value}}>
          <option value="">${s("quick_complete_defaults_feedback_none",t)}</option>
          <option value="needed">${s("quick_complete_defaults_feedback_needed",t)}</option>
          <option value="not_needed">${s("quick_complete_defaults_feedback_not_needed",t)}</option>
        </select>
      </details>
    `}async _loadParts(){if(this.parts=[],!!this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this.parts=t.parts||[],this._partsLoadFailed=!1}catch{this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){if(this._foreignOwners=[],!!this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._foreignOwners=(t.objects||[]).filter(e=>e.entry_id!==this._entryId&&(e.parts||[]).length>0).map(e=>({entry_id:e.entry_id,name:e.object?.name||e.entry_id,parts:e.parts||[]})).sort((e,i)=>e.name.localeCompare(i.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=t.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(t){!t||!this.hass||this._conditionAttrOptions[t]||this._conditionAttrPending.has(t)||(this._conditionAttrPending.add(t),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:t}).then(e=>{let i=e;this._conditionAttrOptions={...this._conditionAttrOptions,[t]:{suggested:i.suggested_attributes||[],available:i.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[t]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(t){if(!t||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:t});this._entityDomain=e.domain||"",this._suggestedAttributes=e.suggested_attributes||[],this._availableAttributes=e.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(t=>!!t.entry_id)}_renderConsumesRow(t,e){let i=M({part_id:t.id,entry_id:e}),a=this._consumesParts[i],d=e?{part_id:t.id,quantity:1,entry_id:e}:{part_id:t.id,quantity:1};return r`
      <div class="consumes-row">
        <label class="consumes-check">
          <input
            type="checkbox"
            .checked=${a!==void 0}
            @change=${c=>{let _={...this._consumesParts};c.target.checked?_[i]=_[i]||d:delete _[i],this._consumesParts=_}}
          />
          <span>${t.name}${t.unit?` (${t.unit})`:""}</span>
        </label>
        ${a!==void 0?r`<input
              class="consumes-qty"
              type="number"
              min="0.01"
              max="999"
              step="0.01"
              .value=${String(a.quantity)}
              @input=${c=>{let _=parseFloat(c.target.value);this._consumesParts={...this._consumesParts,[i]:{...d,quantity:Number.isFinite(_)&&_>=.01?_:1}}}}
            />`:p}
      </div>
    `}_toggleRequired(t,e){let i=new Set(this._requiredCompletion);e?i.add(t):i.delete(t),this._requiredCompletion=[...i]}async _save(){if(!this._loading&&this._name.trim()){if(this._adaptiveSnapshot()!==this._adaptiveInitial){let t=parseInt(this._adaptiveMin,10),e=parseInt(this._adaptiveMax,10);if(!isNaN(t)&&!isNaN(e)&&t>e){this._error=`${s("adaptive_min_interval",this._lang)} > ${s("adaptive_max_interval",this._lang)}`;return}}this._loading=!0,this._error="";try{let t={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},e=this._earliestCompletionDays.trim();if(t.earliest_completion_days=e===""?null:Math.max(0,parseInt(e,10)||0),this._taskId&&(t.task_id=this._taskId),this._scheduleType==="one_time"?(t.due_date=this._dueDate||null,t.interval_days=null):X.includes(this._scheduleType)?(t.schedule={...this._buildSchedule(),...this._recurrenceExtras()},t.interval_days=null,this._taskId&&(t.due_date=null)):(this._taskId&&(t.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(t.interval_days=parseInt(this._intervalDays,10),t.interval_unit=this._intervalUnit,t.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(t.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(t.interval_days=null,t.interval_anchor="completion")),t.notes=this._notes||null,t.documentation_url=this._documentationUrl||null,t.custom_icon=this._customIcon||null,t.priority=this._priority,t.labels=this._labels.split(",").map(c=>c.trim()).filter(Boolean),t.enabled=this._enabled,t.last_performed=this._lastPerformed||null,t.nfc_tag_id=this._nfcTagId||null,t.reading_unit=this._readingUnit.trim()||null,(this.parts.length||this._foreignOwners.length)&&(t.consumes_parts=Object.values(this._consumesParts).map(c=>c.entry_id?{part_id:c.part_id,quantity:c.quantity,entry_id:c.entry_id}:{part_id:c.part_id,quantity:c.quantity})),t.responsible_user_id=this._responsibleUserId,t.assignee_pool=this._assigneePool,t.required_completion_fields=this._requiredCompletion,t.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let c=this._compoundConditions.map(Nt).filter(_=>_!==null);if(c.length>0){let _={type:"compound",compound_logic:this._compoundLogic,conditions:c};this._autoCompleteOnRecovery&&(_.auto_complete_on_recovery=!0),t.trigger_config=_}else this._taskId&&(t.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let c=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],_={entity_id:c[0],entity_ids:c,type:this._triggerType};if(this._triggerAttribute&&(_.attribute=this._triggerAttribute),this._autoCompleteOnRecovery&&(_.auto_complete_on_recovery=!0),c.length>1&&(_.entity_logic=this._triggerEntityLogic),this._triggerType==="threshold"){if(this._triggerAbove){let u=parseFloat(this._triggerAbove);isNaN(u)||(_.trigger_above=u)}if(this._triggerBelow){let u=parseFloat(this._triggerBelow);isNaN(u)||(_.trigger_below=u)}if(this._triggerForMinutes){let u=parseInt(this._triggerForMinutes,10);isNaN(u)||(_.trigger_for_minutes=u)}}else if(this._triggerType==="counter"){if(this._triggerTargetValue){let u=parseFloat(this._triggerTargetValue);isNaN(u)||(_.trigger_target_value=u)}if(_.trigger_delta_mode=this._triggerDeltaMode,this._triggerDeltaMode&&this._triggerBaselineValue){let u=parseFloat(this._triggerBaselineValue);!isNaN(u)&&u>=0&&(_.trigger_baseline_value=u)}}else if(this._triggerType==="state_change"){if(this._triggerFromState&&(_.trigger_from_state=this._triggerFromState),this._triggerToState&&(_.trigger_to_state=this._triggerToState),this._triggerTargetChanges){let u=parseInt(this._triggerTargetChanges,10);isNaN(u)||(_.trigger_target_changes=u)}}else if(this._triggerType==="runtime"){if(this._triggerRuntimeHours){let v=parseFloat(this._triggerRuntimeHours);isNaN(v)||(_.trigger_runtime_hours=v)}let u=this._triggerOnStates.split(",").map(v=>v.trim()).filter(Boolean);u.length>0&&(_.trigger_on_states=u)}t.trigger_config=_}else this._taskId&&(t.trigger_config=null);if(this.scheduleTimeEnabled&&this._scheduleType==="time_based"){let c=this._scheduleTime.trim();t.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(c)?c:null}if(this.checklistsEnabled){let c=this._checklistText.split(`
`).map(_=>_.trim()).filter(Boolean).slice(0,100);t.checklist=c.length?c:null}if(this.completionActionsEnabled){let c=this._actionService.trim();if(c&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(c)){let b={service:c},y=this._actionTargetEntity.trim();y&&(b.target={entity_id:y});let $=this._buildActionData();Object.keys($).length>0&&(b.data=$),t.on_complete_action=b}else t.on_complete_action=null;let _={};this._qcNotes.trim()&&(_.notes=this._qcNotes.trim());let u=parseFloat(this._qcCost);!isNaN(u)&&u>=0&&(_.cost=u);let v=parseInt(this._qcDuration,10);!isNaN(v)&&v>=0&&(_.duration=v),this._qcFeedback&&(_.feedback=this._qcFeedback),t.quick_complete_defaults=Object.keys(_).length?_:null}let i=await this.hass.connection.sendMessagePromise(t),a=this._taskId||i?.task_id,d=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;if(a&&this._scheduleType==="sensor_based"&&d)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:a,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null}),this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute}catch{}if(a&&this._adaptiveSnapshot()!==this._adaptiveInitial){let c=parseFloat(this._adaptiveAlpha),_=parseInt(this._adaptiveMin,10),u=parseInt(this._adaptiveMax,10);try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:a,enabled:this._adaptiveEnabled,...c>=.1&&c<=.9?{ewa_alpha:c}:{},...!isNaN(_)&&_>=1?{min_interval_days:_}:{},...!isNaN(u)&&u>=1?{max_interval_days:u}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction}),this._adaptiveInitial=this._adaptiveSnapshot()}catch{}}this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}catch(t){this._error=I(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1,this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return p;let t=this._lang,e=this._triggerType==="compound";return r`
      <h3>${s("trigger_configuration",t)}</h3>
      <div class="select-row">
        <label>${s("trigger_type",t)}</label>
        <select
          .value=${this._triggerType}
          @change=${i=>this._triggerType=i.target.value}
        >
          ${Rt.map(i=>r`<option value=${i} ?selected=${i===this._triggerType}>${s(i,t)}</option>`)}
        </select>
      </div>
      ${e?this._renderCompoundEditor():r`
        ${this._entityPickerFallback?r`
          <ms-textfield
            label="${s("entity_id",t)} (${s("comma_separated",t)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${i=>{let d=i.target.value.split(",").map(c=>c.trim()).filter(Boolean);this._triggerEntityId=d[0]||"",this._triggerEntityIds=d,d[0]&&this._fetchEntityAttributes(d[0])}}
          ></ms-textfield>
        `:r`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:J}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>s("entity_id",t)}
          @value-changed=${i=>{let a=(i.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=a[0]||"",this._triggerEntityIds=a,a[0]?this._fetchEntityAttributes(a[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?r`
          <div class="select-row">
            <label>${s("entity_logic",t)}</label>
            <select
              .value=${this._triggerEntityLogic}
              @change=${i=>this._triggerEntityLogic=i.target.value}
            >
              <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${s("entity_logic_any",t)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${s("entity_logic_all",t)}</option>
            </select>
          </div>
        `:p}
        ${this._availableAttributes.length>0?r`
            <div class="select-row">
              <label>${s("attribute_optional",t)}</label>
              <select
                .value=${this._triggerAttribute}
                @change=${i=>this._triggerAttribute=i.target.value}
              >
                <option value="" ?selected=${!this._triggerAttribute}>${s("use_entity_state",t)}</option>
                ${this._suggestedAttributes.map(i=>r`<option value=${i} ?selected=${i===this._triggerAttribute}>${i} ★</option>`)}
                ${this._availableAttributes.filter(i=>!this._suggestedAttributes.includes(i.name)).map(i=>r`<option value=${i.name} ?selected=${i.name===this._triggerAttribute}>${i.name}${i.numeric?"":" (non-numeric)"}</option>`)}
              </select>
            </div>
          `:r`
            <ms-textfield
              label="${s("attribute_optional",t)}"
              .value=${this._triggerAttribute}
              @input=${i=>this._triggerAttribute=i.target.value}
            ></ms-textfield>
          `}
        ${this._renderTriggerTypeFields()}
        ${this._renderTriggerLiveHint()}
      `}
      <label>
        <input
          type="checkbox"
          .checked=${this._autoCompleteOnRecovery}
          @change=${i=>this._autoCompleteOnRecovery=i.target.checked}
        />
        ${s("auto_complete_on_recovery",t)}
      </label>
      <div class="field-help">${s("auto_complete_on_recovery_help",t)}</div>
      <ms-textfield
        label="${s("safety_interval",t)}"
        type="number"
        .value=${this._intervalDays}
        @input=${i=>this._intervalDays=i.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():p}
    `}_patchCondition(t,e){this._compoundConditions=this._compoundConditions.map((i,a)=>a===t?{...i,...e}:i)}_addCondition(){this._compoundConditions=[...this._compoundConditions,qt()]}_removeCondition(t){this._compoundConditions=this._compoundConditions.filter((e,i)=>i!==t)}_renderCompoundEditor(){let t=this._lang;return r`
      <div class="select-row">
        <label>${s("compound_logic",t)}</label>
        <select
          .value=${this._compoundLogic}
          @change=${e=>this._compoundLogic=e.target.value}
        >
          <option value="AND" ?selected=${this._compoundLogic==="AND"}>${s("compound_logic_and",t)}</option>
          <option value="OR" ?selected=${this._compoundLogic==="OR"}>${s("compound_logic_or",t)}</option>
        </select>
      </div>
      <div class="field-help">${s("compound_help",t)}</div>
      ${this._compoundConditions.length===0?r`<div class="field-help">${s("compound_no_conditions",t)}</div>`:this._compoundConditions.map((e,i)=>this._renderCondition(e,i))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${s("compound_add_condition",t)}
      </button>
    `}_renderCondition(t,e){let i=this._lang,a=e+1;return r`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${s("compound_condition",i)} ${a}</span>
          <button
            type="button"
            class="icon-btn"
            title="${s("compound_remove_condition",i)}"
            @click=${()=>this._removeCondition(e)}
          >✕</button>
        </div>
        ${this._entityPickerFallback?r`
          <ms-textfield
            label="${s("entity_id",i)} (${s("comma_separated",i)})"
            .value=${t.entityIds}
            @input=${d=>this._patchCondition(e,{entityIds:d.target.value})}
          ></ms-textfield>
        `:r`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:J}}}]}
          .data=${{condition_entities:t.entityIds.split(",").map(d=>d.trim()).filter(Boolean)}}
          .computeLabel=${()=>s("entity_id",i)}
          @value-changed=${d=>{let c=(d.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(e,{entityIds:c.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(t,e)}
        <div class="select-row">
          <label>${s("trigger_type",i)}</label>
          <select
            .value=${t.type}
            @change=${d=>this._patchCondition(e,{type:d.target.value})}
          >
            ${_t.map(d=>r`<option value=${d} ?selected=${d===t.type}>${s(d,i)}</option>`)}
          </select>
        </div>
        ${this._renderConditionTypeFields(t,e)}
      </div>
    `}_renderStateField(t){return this._entityPickerFallback||!t.entityId?r`
        <ms-textfield
          label=${t.label}
          .value=${t.value}
          @input=${e=>t.onInput(e.target.value)}
        ></ms-textfield>
      `:r`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:t.entityId}}}]}
        .data=${{s:t.value}}
        .computeLabel=${()=>t.label}
        @value-changed=${e=>t.onInput((e.detail.value.s||"").trim())}
      ></ha-form>
    `}_renderOnStatesField(t){let e=this._lang;return this._entityPickerFallback||!t.entityId?r`
        <ms-textfield
          label="${s("runtime_on_states",e)}"
          placeholder="on"
          .value=${t.value}
          @input=${i=>t.onInput(i.target.value)}
        ></ms-textfield>
      `:r`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:t.entityId,multiple:!0}}}]}
        .data=${{s:(t.value||"").split(",").map(i=>i.trim()).filter(Boolean)}}
        .computeLabel=${()=>s("runtime_on_states",e)}
        @value-changed=${i=>t.onInput((i.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(t){return this._scheduleType==="one_time"||this._scheduleType==="manual"?p:r`
      <details class="adaptive-section" ?open=${this._adaptiveEnabled}>
        <summary>${s("adaptive_section_title",t)}</summary>
        <label>
          <input
            type="checkbox"
            .checked=${this._adaptiveEnabled}
            @change=${e=>this._adaptiveEnabled=e.target.checked}
          />
          ${s("adaptive_enabled",t)}
        </label>
        ${this._adaptiveEnabled?r`
          <ms-textfield
            label="${s("adaptive_min_interval",t)}"
            type="number"
            min="1"
            .value=${this._adaptiveMin}
            @input=${e=>this._adaptiveMin=e.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("adaptive_max_interval",t)}"
            type="number"
            min="1"
            .value=${this._adaptiveMax}
            @input=${e=>this._adaptiveMax=e.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("adaptive_ewa_alpha",t)}"
            type="number"
            min="0.1"
            max="0.9"
            step="0.1"
            .value=${this._adaptiveAlpha}
            @input=${e=>this._adaptiveAlpha=e.target.value}
          ></ms-textfield>
          <label>
            <input
              type="checkbox"
              .checked=${this._adaptiveSeasonal}
              @change=${e=>this._adaptiveSeasonal=e.target.checked}
            />
            ${s("adaptive_seasonal_enabled",t)}
          </label>
          <label>
            <input
              type="checkbox"
              .checked=${this._adaptivePrediction}
              @change=${e=>this._adaptivePrediction=e.target.checked}
            />
            ${s("adaptive_prediction_enabled",t)}
          </label>
        `:p}
      </details>
    `}_renderEnvironmentalAttribute(t){this._fetchConditionAttributes(this._environmentalEntity);let e=this._conditionAttrOptions[this._environmentalEntity];return e&&e.available.length>0?r`
        <div class="select-row">
          <label>${s("environmental_attribute_optional",t)}</label>
          <select
            .value=${this._environmentalAttribute}
            @change=${i=>this._environmentalAttribute=i.target.value}
          >
            <option value="" ?selected=${!this._environmentalAttribute}>${s("use_entity_state",t)}</option>
            ${e.suggested.map(i=>r`<option value=${i} ?selected=${i===this._environmentalAttribute}>${i} ★</option>`)}
            ${e.available.filter(i=>!e.suggested.includes(i.name)).map(i=>r`<option value=${i.name} ?selected=${i.name===this._environmentalAttribute}>${i.name}${i.numeric?"":" (non-numeric)"}</option>`)}
          </select>
        </div>
      `:r`
      <ms-textfield
        label="${s("environmental_attribute_optional",t)}"
        .value=${this._environmentalAttribute}
        @input=${i=>this._environmentalAttribute=i.target.value.trim()}
      ></ms-textfield>
    `}_renderConditionAttribute(t,e){let i=this._lang,a=t.entityIds.split(",")[0]?.trim()||"";a&&this._fetchConditionAttributes(a);let d=a?this._conditionAttrOptions[a]:void 0;return d&&d.available.length>0?r`
        <div class="select-row">
          <label>${s("attribute_optional",i)}</label>
          <select
            .value=${t.attribute}
            @change=${c=>this._patchCondition(e,{attribute:c.target.value})}
          >
            <option value="" ?selected=${!t.attribute}>${s("use_entity_state",i)}</option>
            ${d.suggested.map(c=>r`<option value=${c} ?selected=${c===t.attribute}>${c} ★</option>`)}
            ${d.available.filter(c=>!d.suggested.includes(c.name)).map(c=>r`<option value=${c.name} ?selected=${c.name===t.attribute}>${c.name}${c.numeric?"":" (non-numeric)"}</option>`)}
          </select>
        </div>
      `:r`
      <ms-textfield
        label="${s("attribute_optional",i)}"
        .value=${t.attribute}
        @input=${c=>this._patchCondition(e,{attribute:c.target.value.trim()})}
      ></ms-textfield>
    `}_renderConditionTypeFields(t,e){let i=this._lang;if(t.type==="threshold")return r`
        <ms-textfield label="${s("trigger_above",i)}" type="number" .value=${t.above}
          @input=${a=>this._patchCondition(e,{above:a.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_below",i)}" type="number" .value=${t.below}
          @input=${a=>this._patchCondition(e,{below:a.target.value})}></ms-textfield>
        <ms-textfield label="${s("for_minutes",i)}" type="number" .value=${t.forMinutes}
          @input=${a=>this._patchCondition(e,{forMinutes:a.target.value})}></ms-textfield>
      `;if(t.type==="counter")return r`
        <ms-textfield label="${s("target_value",i)}" type="number" .value=${t.targetValue}
          @input=${a=>this._patchCondition(e,{targetValue:a.target.value})}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${t.deltaMode}
            @change=${a=>this._patchCondition(e,{deltaMode:a.target.checked})} />
          ${s("delta_mode",i)}
        </label>
      `;if(t.type==="state_change"){let a=t.entityIds.split(",")[0]?.trim()||"";return r`
        ${this._renderStateField({label:s("from_state_optional",i),value:t.fromState,entityId:a,onInput:d=>this._patchCondition(e,{fromState:d})})}
        ${this._renderStateField({label:s("to_state_optional",i),value:t.toState,entityId:a,onInput:d=>this._patchCondition(e,{toState:d})})}
        <ms-textfield label="${s("target_changes",i)}" type="number" .value=${t.targetChanges}
          @input=${d=>this._patchCondition(e,{targetChanges:d.target.value})}></ms-textfield>
      `}if(t.type==="runtime"){let a=t.entityIds.split(",")[0]?.trim()||"";return r`
        <ms-textfield label="${s("runtime_hours",i)}" type="number" .value=${t.runtimeHours}
          @input=${d=>this._patchCondition(e,{runtimeHours:d.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:t.onStates,entityId:a,onInput:d=>this._patchCondition(e,{onStates:d})})}
      `}return p}_renderUnitSelect(){let t=this._lang;return r`
      <div class="select-row">
        <label>${s("interval_unit",t)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${e=>this._intervalUnit=e.target.value}
        >
          ${["days","weeks","months","years"].map(e=>r`<option value=${e} ?selected=${e===this._intervalUnit}>${s("unit_"+e,t)}</option>`)}
        </select>
      </div>`}_toggleWeekday(t){this._weekdays=this._weekdays.includes(t)?this._weekdays.filter(e=>e!==t):[...this._weekdays,t]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(X.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let t=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!t||t<=0?null:{kind:"interval",every:t,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(t){super.updated?.(t),this._scheduleEntityPickerProbe();for(let e of t.keys())if(m._PREVIEW_RELEVANT.has(String(e))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let t=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),e=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!t||!e){this._pickerProbeStrikes=0;return}let i=(_,u,v=0)=>{if(!(!_||v>10)){(_.tagName?.toLowerCase()??"")==="ha-entity-picker"&&u.push(_);for(let b of[_.shadowRoot,_])if(b)for(let y of Array.from(b.children??[]))i(y,u,v+1)}},a=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],d=[];for(let _ of a)i(_,d);let c=d.length===0||d.some(_=>_.offsetHeight===0);if(t.offsetHeight===0||c){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let t=this._open?this._previewScheduleDict():null;if(!t){this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let e=++this._previewSeq;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:t,...this._lastPerformed?{last_performed:this._lastPerformed}:{}});if(e!==this._previewSeq)return;this._schedulePreview=i.occurrences||[],this._schedulePreviewEnded=!!i.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return p;let t=this._lang,e=this.scheduleTimeEnabled&&this._scheduleTime?` ${this._scheduleTime}`:"",i=this._schedulePreview.map((d,c)=>{let _=new Date(`${d}T12:00:00`).getDay();return`${Z(_===0?6:_-1,t,"short")} ${N(d,t)}${c===0?e:""}`}).join(" \xB7 "),a=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?r`<div class="field-help">${s("schedule_preview_ontime",t)}</div>`:p;return r`
      <div class="trigger-live-hint schedule-preview">
        ${s("schedule_preview_title",t)}: ${i}${this._schedulePreviewEnded?r` <span class="field-help">${s("schedule_preview_ends",t)}</span>`:p}
        ${a}
      </div>
    `}_buildSchedule(){let t=i=>{let a=parseInt(this._calOffset,10)||0;return a&&(i.offset=Math.max(-15,Math.min(a,15))),i};if(this._scheduleType==="weekdays")return t({kind:"weekdays",weekdays:[...this._weekdays].sort((i,a)=>i-a)});if(this._scheduleType==="nth_weekday")return t({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});let e={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(e.business=!0),t(e)}_recurrenceExtras(){let t={};if(this._seasonMonths.length&&(t.season_months=[...this._seasonMonths].sort((e,i)=>e-i)),this._endsMode==="count"){let e=parseInt(this._endsCount,10);e>=1&&(t.ends={count:e})}else this._endsMode==="until"&&this._endsUntil&&(t.ends={until:this._endsUntil});return t}_toggleSeasonMonth(t){this._seasonMonths=this._seasonMonths.includes(t)?this._seasonMonths.filter(e=>e!==t):[...this._seasonMonths,t]}_renderRecurrenceExtras(){let t=this._lang;if(!(this._scheduleType==="time_based"||X.includes(this._scheduleType)))return p;let i=zt(t);return r`
      <label class="field-label">${s("season_window_label",t)}</label>
      <div class="field-help">${s("season_window_hint",t)}</div>
      <div class="weekday-chips season-chips">
        ${i.map((a,d)=>r`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(d+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(d+1)}
          >${a}</button>`)}
      </div>

      <label class="field-label">${s("series_end_label",t)}</label>
      <div class="select-row">
        <select .value=${this._endsMode}
          @change=${a=>this._endsMode=a.target.value}>
          <option value="never" ?selected=${this._endsMode==="never"}>${s("series_end_never",t)}</option>
          <option value="count" ?selected=${this._endsMode==="count"}>${s("series_end_after_count",t)}</option>
          <option value="until" ?selected=${this._endsMode==="until"}>${s("series_end_until",t)}</option>
        </select>
      </div>
      ${this._endsMode==="count"?r`
        <ms-textfield
          label="${s("series_end_count_label",t)}"
          type="number" min="1"
          .value=${this._endsCount}
          @input=${a=>this._endsCount=a.target.value}
        ></ms-textfield>`:p}
      ${this._endsMode==="until"?r`
        <ms-textfield
          label="${s("series_end_until_label",t)}"
          type="date"
          .value=${this._endsUntil}
          @input=${a=>this._endsUntil=a.target.value}
        ></ms-textfield>`:p}
    `}_renderCalendarFields(){let t=this._lang,e=Ot(t);if(this._scheduleType==="weekdays")return r`
        <label class="field-label">${s("recurrence_on_days",t)}</label>
        <div class="weekday-chips">
          ${e.map((i,a)=>r`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(a)?"selected":""}"
              @click=${()=>this._toggleWeekday(a)}
            >${i}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let i=[["1",s("ord_1",t)],["2",s("ord_2",t)],["3",s("ord_3",t)],["4",s("ord_4",t)],["5",s("ord_5",t)],["-1",s("ord_last",t)]];return r`
        <div class="select-row">
          <label>${s("recurrence_occurrence",t)}</label>
          <select .value=${this._nth} @change=${a=>this._nth=a.target.value}>
            ${i.map(([a,d])=>r`<option value=${a} ?selected=${a===this._nth}>${d}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${s("recurrence_weekday",t)}</label>
          <select .value=${this._nthWeekday} @change=${a=>this._nthWeekday=a.target.value}>
            ${e.map((a,d)=>r`<option value=${String(d)} ?selected=${String(d)===this._nthWeekday}>${a}</option>`)}
          </select>
        </div>
        ${this._renderCalOffsetField()}`}return this._scheduleType==="day_of_month"?r`
        ${this._domLastDay?p:r`
          <ms-textfield
            label="${s("recurrence_day",t)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${i=>this._domDay=i.target.value}
          ></ms-textfield>`}
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domLastDay}
            @change=${i=>this._domLastDay=i.target.checked} />
          <span>${s("recurrence_last_day",t)}</span>
        </label>
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domBusiness}
            @change=${i=>this._domBusiness=i.target.checked} />
          <span>${s("recurrence_business_day",t)}</span>
        </label>
        ${this._renderCalOffsetField()}`:p}_renderCalOffsetField(){let t=this._lang;return r`
      <ms-textfield
        label="${s("recurrence_offset",t)}"
        helper="${s("recurrence_offset_help",t)}"
        type="number"
        min="-15"
        max="15"
        .value=${this._calOffset}
        @input=${e=>this._calOffset=e.target.value}
      ></ms-textfield>`}_renderTriggerLiveHint(){if(this._triggerType==="compound")return p;let t=this._triggerEntityId||this._triggerEntityIds[0];if(!t||!this.hass?.states)return p;let e=this.hass.states[t];if(!e)return p;let i=this._lang,a=e.attributes?.unit_of_measurement,d=typeof a=="string"&&a?` ${a}`:"",c=this._triggerAttribute?e.attributes?.[this._triggerAttribute]:e.state,_=typeof c=="number"?c:parseFloat(String(c)),u=c!=="unknown"&&c!=="unavailable"&&c!=null&&!isNaN(_),v=y=>Number.isInteger(y)?String(y):String(Math.round(y*10)/10),b=[];if(this._triggerType==="threshold"){let y=parseFloat(this._triggerAbove),$=parseFloat(this._triggerBelow);if(isNaN(y)&&isNaN($))return p;u&&b.push(s("trigger_hint_now",i).replace("{value}",v(_)+d)),isNaN(y)||b.push(s("trigger_hint_above",i).replace("{target}",v(y)+d)),isNaN($)||b.push(s("trigger_hint_below",i).replace("{target}",v($)+d))}else if(this._triggerType==="counter"){let y=parseFloat(this._triggerTargetValue);if(isNaN(y))return p;this._triggerDeltaMode?this._taskId?b.push(s("trigger_hint_counter_delta_edit",i).replace("{target}",v(y)+d)):u?b.push(s("trigger_hint_counter_delta",i).replace("{value}",v(_)+d).replace("{due}",v(_+y)+d).replace("{target}",v(y)+d)):b.push(s("trigger_hint_counter_delta_edit",i).replace("{target}",v(y)+d)):(u&&b.push(s("trigger_hint_now",i).replace("{value}",v(_)+d)),b.push(s("trigger_hint_counter_abs",i).replace("{target}",v(y)+d)))}else if(this._triggerType==="runtime"){let y=parseFloat(this._triggerRuntimeHours);if(isNaN(y))return p;b.push(s("trigger_hint_runtime",i).replace("{hours}",v(y))),b.push(s("trigger_hint_state_now",i).replace("{value}",String(e.state)))}else if(this._triggerType==="state_change"){let y=parseInt(this._triggerTargetChanges,10)||1,$=this._triggerToState.trim();b.push(($?s("trigger_hint_state_change_to",i).replace("{state}",$):s("trigger_hint_state_change",i)).replace("{count}",String(y))),b.push(s("trigger_hint_state_now",i).replace("{value}",String(e.state)))}return b.length?r`<div class="trigger-live-hint">${b.join(" ")}</div>`:p}_renderTriggerTypeFields(){let t=this._lang;return this._triggerType==="threshold"?r`
        <ms-textfield
          label="${s("trigger_above",t)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${e=>this._triggerAbove=e.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("trigger_below",t)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${e=>this._triggerBelow=e.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("for_at_least_minutes",t)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${e=>this._triggerForMinutes=e.target.value}
        ></ms-textfield>
      `:this._triggerType==="counter"?r`
        <ms-textfield
          label="${s("target_value",t)}"
          type="number"
          step="any"
          .value=${this._triggerTargetValue}
          @input=${e=>this._triggerTargetValue=e.target.value}
        ></ms-textfield>
        <label>
          <input
            type="checkbox"
            .checked=${this._triggerDeltaMode}
            @change=${e=>this._triggerDeltaMode=e.target.checked}
          />
          ${s("delta_mode",t)}
        </label>
        ${this._triggerDeltaMode?r`
              <ms-textfield
                label="${s("baseline_start_value",t)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${e=>this._triggerBaselineValue=e.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?s("baseline_start_help_edit",t):s("baseline_start_help",t)}
                ${this._taskId&&this._liveBaselineValue!=null?r`<div class="baseline-effective">
                      ${s("baseline_current_effective",t).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:p}
              </div>
            `:p}
      `:this._triggerType==="state_change"?r`
        ${this._renderStateField({label:s("from_state_optional",t),value:this._triggerFromState,entityId:this._triggerEntityId,onInput:e=>this._triggerFromState=e})}
        <div class="field-help">${s("state_value_help",t)}</div>
        ${this._renderStateField({label:s("to_state_optional",t),value:this._triggerToState,entityId:this._triggerEntityId,onInput:e=>this._triggerToState=e})}
        <ms-textfield
          label="${s("target_changes",t)}"
          type="number"
          min="1"
          .value=${this._triggerTargetChanges}
          @input=${e=>this._triggerTargetChanges=e.target.value}
        ></ms-textfield>
        <div class="field-help">${s("target_changes_help",t)}</div>
      `:this._triggerType==="runtime"?r`
        <ms-textfield
          label="${s("runtime_hours",t)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${e=>this._triggerRuntimeHours=e.target.value}
        ></ms-textfield>
        ${this._renderOnStatesField({value:this._triggerOnStates,entityId:this._triggerEntityId,onInput:e=>this._triggerOnStates=e})}
        <div class="field-help">${s("runtime_on_states_help",t)}</div>
      `:p}render(){if(!this._open)return r``;let t=this._lang,e=this._taskId?s("edit_task",t):s("new_task",t);return r`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${e}</div>
        <div class="content">
          ${this._error?r`<div class="error">${this._error}</div>`:p}
          ${this._objectChoices.length>0?r`
            <div class="select-row">
              <label>${s("object",t)}</label>
              <select
                .value=${this._entryId}
                @change=${i=>{this._entryId=i.target.value,this._consumesParts={},this._loadParts(),this._loadForeignPools()}}
              >
                ${this._objectChoices.map(i=>r`<option value=${i.entry_id} ?selected=${i.entry_id===this._entryId}>${i.name}</option>`)}
              </select>
            </div>
          `:p}
          <ms-textfield
            label="${s("task_name",t)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${s("maintenance_type",t)}</label>
            <select
              .value=${this._type}
              @change=${i=>this._type=i.target.value}
            >
              ${Pt.map(i=>r`<option value=${i} ?selected=${i===this._type}>${s(i,t)}</option>`)}
            </select>
          </div>
          ${this._type==="reading"?r`
                <ms-textfield
                  label="${s("reading_unit_label",t)}"
                  .value=${this._readingUnit}
                  @input=${i=>this._readingUnit=i.target.value}
                ></ms-textfield>
                <div class="field-help">${s("reading_unit_help",t)}</div>
              `:p}
          ${this._partsLoadFailed?r`<div class="field-help parts-load-failed">${s("parts_load_failed",t)}</div>`:p}
          ${this.parts.length||this._foreignOwners.length?r`
                <div class="field">
                  <label>${s("consumes_parts_label",t)}</label>
                  ${this.parts.map(i=>this._renderConsumesRow(i))}
                  ${this._foreignOwners.length?r`
                        <details class="shared-pools" ?open=${this._hasForeignPick}>
                          <summary>${s("shared_parts_other_objects",t)}</summary>
                          <div class="field-help">${s("shared_parts_help",t)}</div>
                          ${this._foreignOwners.map(i=>r`
                              <div class="shared-pool-owner">${i.name}</div>
                              ${i.parts.map(a=>this._renderConsumesRow(a,i.entry_id))}
                            `)}
                        </details>
                      `:p}
                </div>
              `:p}
          <div class="select-row">
            <label>${s("priority",t)}</label>
            <select
              .value=${this._priority}
              @change=${i=>this._priority=i.target.value}
            >
              ${Ct.map(i=>r`<option value=${i} ?selected=${i===this._priority}>${s("priority_"+i,t)}</option>`)}
            </select>
          </div>
          <div class="field">
            <label>${s("labels",t)}</label>
            <input
              type="text"
              .value=${this._labels}
              placeholder="${s("labels_placeholder",t)}"
              @input=${i=>this._labels=i.target.value}
            />
            <div class="field-help">${s("labels_help",t)}</div>
          </div>
          <div class="select-row">
            <label>${s("schedule_type",t)}</label>
            <select
              .value=${this._scheduleType}
              @change=${i=>this._scheduleType=i.target.value}
            >
              ${Ht.map(i=>r`<option value=${i} ?selected=${i===this._scheduleType}>${s(i,t)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?r`
                <ms-textfield
                  label="${s("interval_value",t)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${i=>this._intervalDays=i.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  <label>${s("interval_anchor",t)}</label>
                  <select
                    .value=${this._intervalAnchor}
                    @change=${i=>this._intervalAnchor=i.target.value}
                  >
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${s("anchor_completion",t)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${s("anchor_planned",t)}</option>
                  </select>
                </div>
                ${this.scheduleTimeEnabled?r`
                  <ms-textfield
                    label="${s("schedule_time_optional",t)}"
                    type="time"
                    .value=${this._scheduleTime}
                    helper="${s("schedule_time_help",t)}"
                    @input=${i=>this._scheduleTime=i.target.value}
                  ></ms-textfield>
                `:p}
              `:p}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?r`
                <ms-textfield
                  label="${s("due_date",t)}"
                  type="date"
                  .value=${this._dueDate}
                  @input=${i=>this._dueDate=i.target.value}
                ></ms-textfield>
              `:p}
          ${this._renderRecurrenceExtras()}
          ${this._renderSchedulePreview()}
          <ms-textfield
            label="${s("warning_days",t)}"
            type="number"
            min="0"
            max="365"
            .value=${this._warningDays}
            @input=${i=>this._warningDays=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("earliest_completion_days",t)}"
            helper="${s("earliest_completion_days_help",t)}"
            type="number"
            .value=${this._earliestCompletionDays}
            @input=${i=>this._earliestCompletionDays=i.target.value}
          ></ms-textfield>
          ${this.checklistsEnabled?r`
            <h3>${s("checklist_steps_optional",t)}</h3>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${s("checklist_placeholder",t)}"
              .value=${this._checklistText}
              @input=${i=>this._checklistText=i.target.value}
            ></textarea>
            <div class="field-help">${s("checklist_help",t)}</div>
          `:p}
          <h3>${s("require_on_completion",t)}</h3>
          <div class="required-completion">
            ${ht.map(i=>r`
              <label class="req-option">
                <input
                  type="checkbox"
                  .checked=${this._requiredCompletion.includes(i)}
                  @change=${a=>this._toggleRequired(i,a.target.checked)}
                />
                <span>${s(K[i],t)}</span>
              </label>
            `)}
          </div>
          <ms-textfield
            label="${s("last_performed_optional",t)}"
            type="date"
            .value=${this._lastPerformed}
            @input=${i=>this._lastPerformed=i.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${s("responsible_user",t)}</label>
            <select
              .value=${this._responsibleUserId||""}
              @change=${i=>{let a=i.target.value;this._responsibleUserId=a||null}}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${s("no_user_assigned",t)}</option>
              ${this._availableUsers.map(i=>r`<option value=${i.id} ?selected=${i.id===this._responsibleUserId}>${i.name}</option>`)}
            </select>
          </div>
          ${this._availableUsers.length>=2?r`
            <div class="field">
              <label>${s("shared_with",t)}</label>
              <div class="field-help">${s("shared_with_help",t)}</div>
              <div class="assignee-pool">
                ${this._availableUsers.map(i=>r`
                  <label class="pool-item">
                    <input type="checkbox"
                      .checked=${this._assigneePool.includes(i.id)}
                      @change=${()=>this._toggleAssignee(i.id)} />
                    <span>${i.name}</span>
                  </label>`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?r`
              <div class="select-row">
                <label>${s("rotation_strategy",t)}</label>
                <select
                  .value=${this._rotationStrategy}
                  @change=${i=>this._rotationStrategy=i.target.value}
                >
                  <option value="" ?selected=${!this._rotationStrategy}>${s("rotation_none",t)}</option>
                  ${["round_robin","least_completed","random"].map(i=>r`<option value=${i} ?selected=${i===this._rotationStrategy}>${s("rotation_"+i,t)}</option>`)}
                </select>
              </div>`:p}
          `:p}
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"?r`
            ${this._entityPickerFallback?r`
              <ms-textfield
                label="${s("environmental_entity_optional",t)}"
                helper="${s("environmental_entity_helper",t)}"
                .value=${this._environmentalEntity}
                @input=${i=>this._environmentalEntity=i.target.value.trim()}
              ></ms-textfield>
            `:r`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:ct,device_class:pt}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>s("environmental_entity_optional",t)}
              .computeHelper=${()=>s("environmental_entity_helper",t)}
              @value-changed=${i=>{this._environmentalEntity=(i.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(t):p}
          `:p}
          ${this._renderAdaptiveSection(t)}
          <ms-textfield
            label="${s("notes_optional",t)}"
            .value=${this._notes}
            @input=${i=>this._notes=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("documentation_url_optional",t)}"
            .value=${this._documentationUrl}
            @input=${i=>this._documentationUrl=i.target.value}
          ></ms-textfield>
          <ha-icon-picker
            .hass=${this.hass}
            label="${s("custom_icon_optional",t)}"
            .value=${this._customIcon}
            @value-changed=${i=>this._customIcon=i.detail.value||""}
          ></ha-icon-picker>
          ${this._availableTags.length>0?r`
              <div class="select-row">
                <label>${s("nfc_tag_id_optional",t)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${i=>this._nfcTagId=i.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${s("no_nfc_tag",t)}</option>
                  ${this._availableTags.map(i=>r`<option value=${i.id} ?selected=${i.id===this._nfcTagId}>${i.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${s("nfc_tags_refresh",t)}">↻</button>
              </div>
            `:r`
              <ms-textfield
                label="${s("nfc_tag_id_optional",t)}"
                .value=${this._nfcTagId}
                @input=${i=>this._nfcTagId=i.target.value}
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
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${i=>this._enabled=i.target.checked}
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
  `,n([g({attribute:!1})],m.prototype,"hass",2),n([g({type:Boolean,attribute:"checklists-enabled"})],m.prototype,"checklistsEnabled",2),n([g({type:Boolean,attribute:"schedule-time-enabled"})],m.prototype,"scheduleTimeEnabled",2),n([g({type:Boolean,attribute:"completion-actions-enabled"})],m.prototype,"completionActionsEnabled",2),n([g({type:Number,attribute:"default-warning-days"})],m.prototype,"defaultWarningDays",2),n([l()],m.prototype,"parts",2),n([l()],m.prototype,"_foreignOwners",2),n([l()],m.prototype,"_open",2),n([l()],m.prototype,"_entityPickerFallback",2),n([l()],m.prototype,"_loading",2),n([l()],m.prototype,"_error",2),n([l()],m.prototype,"_entryId",2),n([l()],m.prototype,"_taskId",2),n([l()],m.prototype,"_objectChoices",2),n([l()],m.prototype,"_name",2),n([l()],m.prototype,"_type",2),n([l()],m.prototype,"_scheduleType",2),n([l()],m.prototype,"_intervalDays",2),n([l()],m.prototype,"_intervalUnit",2),n([l()],m.prototype,"_dueDate",2),n([l()],m.prototype,"_warningDays",2),n([l()],m.prototype,"_earliestCompletionDays",2),n([l()],m.prototype,"_intervalAnchor",2),n([l()],m.prototype,"_weekdays",2),n([l()],m.prototype,"_nth",2),n([l()],m.prototype,"_nthWeekday",2),n([l()],m.prototype,"_domDay",2),n([l()],m.prototype,"_domLastDay",2),n([l()],m.prototype,"_domBusiness",2),n([l()],m.prototype,"_calOffset",2),n([l()],m.prototype,"_seasonMonths",2),n([l()],m.prototype,"_endsMode",2),n([l()],m.prototype,"_endsCount",2),n([l()],m.prototype,"_endsUntil",2),n([l()],m.prototype,"_schedulePreview",2),n([l()],m.prototype,"_schedulePreviewEnded",2),n([l()],m.prototype,"_notes",2),n([l()],m.prototype,"_documentationUrl",2),n([l()],m.prototype,"_customIcon",2),n([l()],m.prototype,"_priority",2),n([l()],m.prototype,"_labels",2),n([l()],m.prototype,"_enabled",2),n([l()],m.prototype,"_triggerEntityId",2),n([l()],m.prototype,"_triggerEntityIds",2),n([l()],m.prototype,"_triggerEntityLogic",2),n([l()],m.prototype,"_triggerAttribute",2),n([l()],m.prototype,"_triggerType",2),n([l()],m.prototype,"_triggerAbove",2),n([l()],m.prototype,"_triggerBelow",2),n([l()],m.prototype,"_triggerForMinutes",2),n([l()],m.prototype,"_triggerTargetValue",2),n([l()],m.prototype,"_triggerDeltaMode",2),n([l()],m.prototype,"_triggerBaselineValue",2),n([l()],m.prototype,"_liveBaselineValue",2),n([l()],m.prototype,"_autoCompleteOnRecovery",2),n([l()],m.prototype,"_triggerFromState",2),n([l()],m.prototype,"_triggerToState",2),n([l()],m.prototype,"_triggerTargetChanges",2),n([l()],m.prototype,"_triggerRuntimeHours",2),n([l()],m.prototype,"_triggerOnStates",2),n([l()],m.prototype,"_compoundLogic",2),n([l()],m.prototype,"_compoundConditions",2),n([l()],m.prototype,"_suggestedAttributes",2),n([l()],m.prototype,"_availableAttributes",2),n([l()],m.prototype,"_entityDomain",2),n([l()],m.prototype,"_lastPerformed",2),n([l()],m.prototype,"_nfcTagId",2),n([l()],m.prototype,"_readingUnit",2),n([l()],m.prototype,"_consumesParts",2),n([l()],m.prototype,"_partsLoadFailed",2),n([l()],m.prototype,"_availableTags",2),n([l()],m.prototype,"_responsibleUserId",2),n([l()],m.prototype,"_assigneePool",2),n([l()],m.prototype,"_rotationStrategy",2),n([l()],m.prototype,"_availableUsers",2),n([l()],m.prototype,"_checklistText",2),n([l()],m.prototype,"_requiredCompletion",2),n([l()],m.prototype,"_scheduleTime",2),n([l()],m.prototype,"_actionService",2),n([l()],m.prototype,"_actionTargetEntity",2),n([l()],m.prototype,"_actionData",2),n([l()],m.prototype,"_actionDataJsonFallback",2),n([l()],m.prototype,"_actionTesting",2),n([l()],m.prototype,"_actionTestResult",2),n([l()],m.prototype,"_actionTestError",2),n([l()],m.prototype,"_qcNotes",2),n([l()],m.prototype,"_qcCost",2),n([l()],m.prototype,"_qcDuration",2),n([l()],m.prototype,"_qcFeedback",2),n([l()],m.prototype,"_environmentalEntity",2),n([l()],m.prototype,"_environmentalAttribute",2),n([l()],m.prototype,"_adaptiveEnabled",2),n([l()],m.prototype,"_adaptiveAlpha",2),n([l()],m.prototype,"_adaptiveMin",2),n([l()],m.prototype,"_adaptiveMax",2),n([l()],m.prototype,"_adaptiveSeasonal",2),n([l()],m.prototype,"_adaptivePrediction",2),n([l()],m.prototype,"_conditionAttrOptions",2);var tt=m;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",tt);var f=class extends E{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.restockDefault=null;this.restockUnitCost=null;this.currencySymbol="";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photoDocId="";this._photoPreview="";this._photoUploading=!1;this._readingValue="";this._restockQty="";this._usedParts={};this.checklistPrefill={}}open(){this._open||(this._open=!0,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((t,e)=>[String(e),!!this.checklistPrefill[t]]).filter(([,t])=>t)),this._feedback="needed",this._photoDocId="",this._photoPreview="",this._photoUploading=!1,this._readingValue="",this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._usedParts=Object.fromEntries(this.consumesParts.map(t=>[M(t),{...t}])))}_toggleCheck(t){let e=String(t);this._checklistState={...this._checklistState,[e]:!this._checklistState[e]}}_setFeedback(t){this._feedback=t}async _onPhotoInput(t){let e=t.target,i=e.files?.[0];if(e.value="",!!i){this._photoUploading=!0,this._error="";try{let a=new FormData;a.append("entry_id",this.entryId),a.append("tags","photo"),a.append("file",i,i.name);let d=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${this.hass.auth?.data?.access_token??""}`},body:a});if(!d.ok){this._error=d.status===413?s("doc_too_large",this.lang):s("doc_upload_failed",this.lang);return}let c=await d.json();c.id&&(this._photoDocId=c.id,this._photoPreview=URL.createObjectURL(i))}catch{this._error=s("doc_upload_failed",this.lang)}finally{this._photoUploading=!1}}}_removePhoto(){this._photoPreview&&URL.revokeObjectURL(this._photoPreview),this._photoDocId="",this._photoPreview=""}async _complete(){this._loading=!0,this._error="";try{let t={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(t.notes=this._notes),this._cost){let e=parseFloat(this._cost);!isNaN(e)&&e>=0&&(t.cost=e)}if(this._duration){let e=parseInt(this._duration,10);!isNaN(e)&&e>=0&&(t.duration=e)}if(this.checklist.length>0&&(t.checklist_state=this._checklistState),this.adaptiveEnabled&&(t.feedback=this._feedback),this._photoDocId&&(t.photo_doc_id=this._photoDocId),this._readingValue!==""){let e=parseFloat(this._readingValue);isNaN(e)||(t.reading_value=e)}if(this.restockDefault!==null&&this._restockQty!==""){let e=parseFloat(this._restockQty);!isNaN(e)&&e>=1&&(t.restock_quantity=e)}this.parts.length>0&&(t.used_parts=Object.values(this._usedParts).filter(e=>Number.isFinite(e.quantity)&&e.quantity>0).map(e=>e.entry_id?{part_id:e.part_id,quantity:e.quantity,entry_id:e.entry_id}:{part_id:e.part_id,quantity:e.quantity})),await this.hass.connection.sendMessagePromise(t),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(t){this._error=I(t,this.lang,s("save_error",this.lang))}finally{this._loading=!1}}get _missingRequired(){let t={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photoDocId!=="",user:!!this.hass?.user};return this.requiredFields.filter(e=>!t[e])}_req(t){return this.requiredFields.includes(t)?r`<span class="req-mark" aria-hidden="true">*</span>`:p}_partsCostSuggestion(){if(this.restockDefault!==null){let i=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(i)||i<=0?null:Math.round(this.restockUnitCost*i*100)/100}if(!this.parts.length)return null;let t=0,e=!1;for(let i of Object.values(this._usedParts)){let a=this.parts.find(d=>M({part_id:d.id,entry_id:d.entry_id})===M(i));a?.cost!=null&&(t+=a.cost*(i.quantity||1),e=!0)}return e?Math.round(t*100)/100:null}_renderCostSuggestion(t){if(this._cost.trim()!=="")return p;let e=this._partsCostSuggestion();if(e==null||e<=0)return p;let i=`${e.toFixed(2)}${this.currencySymbol?` ${this.currencySymbol}`:""}`;return r`<button
      type="button"
      class="cost-suggestion"
      @click=${()=>this._cost=e.toFixed(2)}
    >${s("cost_from_parts",t).replace("{amount}",i)}</button>`}_close(){this._open=!1}render(){if(!this._open)return r``;let t=this.lang||this.hass?.language||"en";return r`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${s("complete_title",t)}${this.taskName}</div>
        <div class="content">
          ${this._error?r`<div class="error">${this._error}</div>`:p}
          ${this.checklist.length>0?r`
            <div class="checklist-section">
              <label class="checklist-label">${s("checklist",t)}</label>
              ${this.checklist.map((e,i)=>r`
                <label class="checklist-item" @click=${()=>this._toggleCheck(i)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(i)]} />
                  <span>${e}</span>
                </label>
              `)}
            </div>
          `:p}
          ${this.taskType==="reading"?r`
              <label class="field">
                <span class="field-label">${s("reading_value_label",t)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${e=>this._readingValue=e.target.value} />
              </label>`:p}
          ${this.parts.length?r`<div class="used-parts">
                <span class="field-label">${s("complete_parts_used",t)}</span>
                ${this.parts.map(e=>{let i=M({part_id:e.id,entry_id:e.entry_id}),a=this._usedParts[i],d=a!==void 0,c=e.entry_id?{part_id:e.id,quantity:1,entry_id:e.entry_id}:{part_id:e.id,quantity:1};return r`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${d}
                        @change=${_=>{let u={...this._usedParts};_.target.checked?u[i]=u[i]||c:delete u[i],this._usedParts=u}} />
                      <span
                        >${e.name}${e.owner_name?r`<span class="used-part-owner"> (${e.owner_name})</span>`:p}${e.stock!==null&&e.stock!==void 0?` (${e.stock}${e.unit?" "+e.unit:""})`:""}</span
                      >
                    </label>
                    ${d?r`<input class="used-part-qty" type="number" min="0.01" max="999" step="0.01"
                          .value=${String(a.quantity)}
                          @input=${_=>{let u=parseFloat(_.target.value);this._usedParts={...this._usedParts,[i]:{...c,quantity:Number.isFinite(u)&&u>=.01?u:1}}}} />`:p}
                  </div>`})}
              </div>`:this.consumesInfo.length?r`<div class="consumes-hint">
                  ${this.consumesInfo.map(e=>r`<div>${e}</div>`)}
                </div>`:p}
          ${this.restockDefault!==null?r`
              <label class="field">
                <span class="field-label">${s("restock_quantity_label",t)}</span>
                <input type="number" step="0.01" min="0.01" class="field-input"
                  .value=${this._restockQty}
                  @input=${e=>this._restockQty=e.target.value} />
              </label>`:p}
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
            <span class="field-label">${s("completion_photo_optional",t)}${this._req("photo")}</span>
            ${this._photoPreview?r`
                <div class="photo-preview">
                  <img src=${this._photoPreview} alt="" />
                  <button type="button" class="photo-remove" @click=${this._removePhoto}
                    title="${s("remove",t)}">✕</button>
                </div>`:r`
                <label class="photo-pick">
                  <ha-icon icon="mdi:camera"></ha-icon>
                  <span>${this._photoUploading?s("uploading",t):s("add_photo",t)}</span>
                  <input type="file" accept="image/*" capture="environment"
                    ?disabled=${this._photoUploading}
                    @change=${this._onPhotoInput} />
                </label>`}
          </div>
          ${this.adaptiveEnabled?r`
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
          `:p}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",t)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._missingRequired.length>0}
            title=${this._missingRequired.length?this._missingRequired.map(e=>s("err_required",t).replace("{field}",s(K[e]??e,t))).join(" \xB7 "):""}
          >
            ${this._loading?s("completing",t):s("complete",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};f.styles=[lt,w`
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
    .photo-pick {
      display: inline-flex;
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
    .photo-pick input[type="file"] { display: none; }
    .photo-preview {
      position: relative;
      width: fit-content;
    }
    .photo-preview img {
      max-width: 160px;
      max-height: 160px;
      border-radius: 8px;
      display: block;
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
  `],n([g({attribute:!1})],f.prototype,"hass",2),n([g()],f.prototype,"entryId",2),n([g()],f.prototype,"taskId",2),n([g()],f.prototype,"taskName",2),n([g()],f.prototype,"lang",2),n([g({type:Array})],f.prototype,"checklist",2),n([g({type:Boolean})],f.prototype,"adaptiveEnabled",2),n([g()],f.prototype,"taskType",2),n([g()],f.prototype,"readingUnit",2),n([g({attribute:!1})],f.prototype,"restockDefault",2),n([g({attribute:!1})],f.prototype,"restockUnitCost",2),n([g()],f.prototype,"currencySymbol",2),n([g({attribute:!1})],f.prototype,"parts",2),n([g({attribute:!1})],f.prototype,"consumesParts",2),n([g({type:Array})],f.prototype,"consumesInfo",2),n([g({type:Array})],f.prototype,"requiredFields",2),n([l()],f.prototype,"_open",2),n([l()],f.prototype,"_notes",2),n([l()],f.prototype,"_cost",2),n([l()],f.prototype,"_duration",2),n([l()],f.prototype,"_loading",2),n([l()],f.prototype,"_error",2),n([l()],f.prototype,"_checklistState",2),n([l()],f.prototype,"_feedback",2),n([l()],f.prototype,"_photoDocId",2),n([l()],f.prototype,"_photoPreview",2),n([l()],f.prototype,"_photoUploading",2),n([l()],f.prototype,"_readingValue",2),n([l()],f.prototype,"_restockQty",2),n([l()],f.prototype,"_usedParts",2),n([g({attribute:!1})],f.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",f);var S=class extends E{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal=""}get _lang(){return this.hass?.language||"en"}openEdit(t){this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._loadPartOptions()}async _loadPartOptions(){let t=this._draft;if(t)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"}),i=[];for(let d of e.parts||[]){let c=d.entry_id===t.entry_id,_=d.consumers.some(u=>u.entry_id===t.entry_id&&u.task_id===t.task_id);!c&&!_||i.push({part_id:d.part_id,name:d.name,entry_id:d.entry_id,foreign:!c,object_name:d.object_name})}for(let d of t.used_parts||[]){let c=d.entry_id||t.entry_id;i.some(_=>_.part_id===d.part_id&&_.entry_id===c)||i.push({part_id:d.part_id,name:d.name||d.part_id,entry_id:c,foreign:c!==t.entry_id,object_name:null})}let a={};for(let d of t.used_parts||[])a[`${d.entry_id||t.entry_id}:${d.part_id}`]=d.quantity??1;this._partOptions=i,this._partQty=a,this._partQtyOriginal=this._partSelectionKey()}catch{this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,t])=>t>0).sort(([t],[e])=>t.localeCompare(e)))}close(){this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null}_set(t,e){this._draft&&(this._draft={...this._draft,[t]:e})}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="";try{let t={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(t.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(t.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(t.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(t.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(t.completed_by=this._draft.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(t.used_parts=(this._partOptions||[]).filter(i=>(this._partQty[`${i.entry_id}:${i.part_id}`]||0)>0).map(i=>({part_id:i.part_id,quantity:this._partQty[`${i.entry_id}:${i.part_id}`],...i.foreign?{entry_id:i.entry_id}:{}}))),Object.keys(t).filter(i=>!["type","entry_id","task_id","original_timestamp"].includes(i)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(t),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=I(t,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return p;let t=this._lang,e=this._draft;return r`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${s("history_edit_title",t)||"Edit history entry"}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${s(e.type,t)||e.type}</span>
        </div>
        <label>
          <span>${s("history_edit_timestamp",t)||"Timestamp"}</span>
          <input type="datetime-local"
            .value=${e.timestamp.length>=16?e.timestamp.slice(0,16):e.timestamp}
            @change=${i=>{let a=i.target.value;this._set("timestamp",a.length===16?`${a}:00`:a)}} />
        </label>
        <label>
          <span>${s("notes_label",t)}</span>
          <textarea
            rows="3"
            @input=${i=>{let a=i.target.value;this._set("notes",a||null)}}
            .value=${e.notes??""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${s("cost",t)||"Cost"}</span>
            <input type="number" min="0" step="0.01"
              .value=${e.cost!=null?String(e.cost):""}
              @input=${i=>{let a=i.target.value;this._set("cost",a?Number(a):null)}} />
          </label>
          <label>
            <span>${s("duration",t)||"Duration (min)"}</span>
            <input type="number" min="0"
              .value=${e.duration!=null?String(e.duration):""}
              @input=${i=>{let a=i.target.value;this._set("duration",a?Number(a):null)}} />
          </label>
        </div>
        ${this._partOptions&&this._partOptions.length>0?r`
          <div class="parts-block">
            <span class="parts-title">${s("complete_parts_used",t)}</span>
            ${this._partOptions.map(i=>{let a=`${i.entry_id}:${i.part_id}`,d=this._partQty[a]||0;return r`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${d>0}
                    @change=${c=>{let _=c.target.checked;this._partQty={...this._partQty,[a]:_?1:0}}} />
                  <span class="part-label">${i.name}${i.foreign&&i.object_name?` (${i.object_name})`:""}</span>
                  ${d>0?r`
                    <input class="part-qty" type="number" min="0.01" max="999" step="0.01"
                      .value=${String(d)}
                      @input=${c=>{let _=parseFloat(c.target.value);!isNaN(_)&&_>0&&(this._partQty={...this._partQty,[a]:_})}} />
                  `:p}
                </label>
              `})}
          </div>
        `:p}
        ${this._error?r`<div class="error">${this._error}</div>`:p}
        <div class="actions">
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${s("cancel",t)||"Cancel"}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?s("saving",t)||"Saving\u2026":s("save",t)||"Save"}
          </button>
        </div>
      </div>
    `}};S.styles=w`
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
  `,n([g({attribute:!1})],S.prototype,"hass",2),n([l()],S.prototype,"_open",2),n([l()],S.prototype,"_saving",2),n([l()],S.prototype,"_error",2),n([l()],S.prototype,"_draft",2),n([l()],S.prototype,"_partOptions",2),n([l()],S.prototype,"_partQty",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",S);function U(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ut(o){return!o.startsWith("data:image/svg+xml,")&&!o.startsWith("data:image/png;base64,")?"":U(o)}function Ut(o){return o.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var A=class extends E{constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(t,e){this._entryId=t,this._taskId=null,this._objectName=e,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}openForTask(t,e,i,a){this._entryId=t,this._taskId=e,this._objectName=i,this._taskName=a,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}async _generate(){let t=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null;try{let e={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(e.task_id=this._taskId);let i=[this.hass.connection.sendMessagePromise({...e,action:"view"})];this._taskId&&i.push(this.hass.connection.sendMessagePromise({...e,action:"complete"}));let a=await Promise.all(i);if(t!==this._generateSeq)return;this._viewResult=a[0],a.length>1&&(this._completeResult=a[1])}catch(e){if(t!==this._generateSeq)return;let i=e?.code,a=e?.message;this._error=i==="no_url"||typeof a=="string"&&a.includes("No Home Assistant URL")?s("qr_error_no_url",this.lang):s("qr_error",this.lang)}finally{t===this._generateSeq&&(this._loading=!1)}}_setUrlMode(t){this._urlMode!==t&&(this._urlMode=t,this._generate())}_print(){if(!this._viewResult)return;let t=this._viewResult,e=t.label.task_name?`${t.label.object_name} \u2014 ${t.label.task_name}`:t.label.object_name,i=[t.label.manufacturer,t.label.model].filter(Boolean).join(" "),a=window.open("","_blank","width=600,height=500");if(!a)return;let d=this.lang||"en",c=U(e),_=U(i),u=!!this._completeResult,v=U(s("qr_action_view",d)),b=U(s("qr_action_complete",d));a.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${c}</title>
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
<h2>${c}</h2>
${_?`<div class="sub">${_}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${ut(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${v}</div>
  </div>
  ${u?`<div class="qr-col">
    <img src="${ut(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${b}</div>
  </div>`:""}
</div>
<div class="url">${U(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),a.document.close()}_downloadSvg(t,e){let i=decodeURIComponent(t.svg_data_uri.replace("data:image/svg+xml,","")),a=new Blob([i],{type:"image/svg+xml"}),d=URL.createObjectURL(a),c=document.createElement("a");c.href=d;let _=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;c.download=`qr-${Ut(_)}-${e}.svg`,c.click(),URL.revokeObjectURL(d)}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._error="",this._loading=!1}render(){if(!this._open)return r``;let t=this.lang||this.hass?.language||"en",e=this._taskName?`${s("qr_code",t)}: ${this._objectName} \u2014 ${this._taskName}`:`${s("qr_code",t)}: ${this._objectName}`,i=!!this._viewResult;return r`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${e}</div>
        <div class="content">
          ${this._loading?r`<div class="loading">${s("qr_generating",t)}</div>`:this._error?r`<div class="error">${this._error}</div>`:i?r`
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
                      ${this._completeResult?r`
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
                          `:p}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  `:p}
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
            .disabled=${!i}
          >
            ${s("qr_print",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};A.styles=w`
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
  `,n([g({attribute:!1})],A.prototype,"hass",2),n([g()],A.prototype,"lang",2),n([l()],A.prototype,"_open",2),n([l()],A.prototype,"_loading",2),n([l()],A.prototype,"_error",2),n([l()],A.prototype,"_viewResult",2),n([l()],A.prototype,"_completeResult",2),n([l()],A.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",A);function mt(o,h){let t=o.interval_analysis,e=t?.weibull_beta,i=t?.weibull_eta;if(e==null||i==null||i<=0)return p;let a=o.interval_days??0,d=o.suggested_interval??a;return r`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${s("weibull_reliability_curve",h)}
        ${jt(e,h)}
      </div>
      ${Dt(e,i,a,d,h)}
      ${Vt(t,h)}
      ${t?.confidence_interval_low!=null?Bt(t,o,h):p}
    </div>
  `}function jt(o,h){let t,e,i;return o<.8?(t="early_failures",e="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):o<=1.2?(t="random_failures",e="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):o<=3.5?(t="wear_out",e="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(t="highly_predictable",e="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),r`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${e}"></ha-svg-icon>
      ${s(i,h)} (\u03B2=${o.toFixed(2)})
    </span>
  `}function Dt(o,h,t,e,i){let $=Math.max(t,e,h,1)*1.3,H=50,R=[];for(let L=0;L<=H;L++){let P=L/H*$,At=1-Math.exp(-Math.pow(P/h,o)),Lt=32+P/$*260,St=136-At*128;R.push([Lt,St])}let j=R.map(([L,P])=>`${L.toFixed(1)},${P.toFixed(1)}`).join(" "),Q="M32,136 "+R.map(([L,P])=>`L${L.toFixed(1)},${P.toFixed(1)}`).join(" ")+` L${R[H][0].toFixed(1)},136 Z`,O=32+t/$*260,D=1-Math.exp(-Math.pow(t/h,o)),V=136-D*128,It=((1-D)*100).toFixed(0),et=32+e/$*260,Tt=[0,.25,.5,.75,1];return r`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_weibull",i)}">
        ${Tt.map(L=>{let P=136-L*128;return z`
            <line x1="${32}" y1="${P.toFixed(1)}" x2="${292}" y2="${P.toFixed(1)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${L===.5?"4,3":p}" />
            <text x="${28}" y="${(P+3).toFixed(1)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${(L*100).toFixed(0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round($/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round($)}</text>

        <path d="${Q}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${j}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?z`
          <line x1="${O.toFixed(1)}" y1="${8}" x2="${O.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${O.toFixed(1)}" cy="${V.toFixed(1)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${(O+4).toFixed(1)}" y="${(V-6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${It}%</text>
        `:p}

        ${e>0&&e!==t?z`
          <line x1="${et.toFixed(1)}" y1="${8}" x2="${et.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:p}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${s("weibull_failure_probability",i)}</span>
      ${t>0?r`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${s("current_interval_marker",i)}</span>`:p}
      ${e>0&&e!==t?r`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${s("recommended_marker",i)}</span>`:p}
    </div>
  `}function Vt(o,h){return r`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${s("characteristic_life",h)}</span>
        <span class="weibull-info-value">${Math.round(o.weibull_eta)} ${s("days",h)}</span>
      </div>
      ${o.weibull_r_squared!=null?r`
        <div class="weibull-info-item">
          <span>${s("weibull_r_squared",h)}</span>
          <span class="weibull-info-value">${o.weibull_r_squared.toFixed(3)}</span>
        </div>
      `:p}
    </div>
  `}function Bt(o,h,t){let e=o.confidence_interval_low,i=o.confidence_interval_high,a=h.suggested_interval??h.interval_days??0,d=h.interval_days??0,c=Math.max(0,e-5),u=i+5-c,v=(e-c)/u*100,b=(i-e)/u*100,y=(a-c)/u*100,$=d>0?(d-c)/u*100:-1;return r`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${s("confidence_interval",t)}: ${a} ${s("days",t)} (${e}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${v.toFixed(1)}%;width:${b.toFixed(1)}%"></div>
        ${$>=0?r`<div class="confidence-marker current" style="left:${$.toFixed(1)}%"></div>`:p}
        <div class="confidence-marker recommended" style="left:${y.toFixed(1)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${s("confidence_conservative",t)} (${e}${s("days",t).charAt(0)})</span>
        <span class="confidence-text high">${s("confidence_aggressive",t)} (${i}${s("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function gt(o,h,t){let e=o.degradation_trend!=null&&o.degradation_trend!=="insufficient_data",i=o.days_until_threshold!=null,a=o.environmental_factor!=null&&o.environmental_factor!==1;if(!e&&!i&&!a)return p;let d=o.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":o.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return r`
    <div class="prediction-section">
      ${o.sensor_prediction_urgency?r`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${s("sensor_prediction_urgency",h).replace("{days}",String(Math.round(o.days_until_threshold||0)))}
        </div>
      `:p}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${s("sensor_prediction",h)}
      </div>
      <div class="prediction-grid">
        ${e?r`
          <div class="prediction-item">
            <ha-svg-icon path="${d}"></ha-svg-icon>
            <span class="prediction-label">${s("degradation_trend",h)}</span>
            <span class="prediction-value ${o.degradation_trend}">${s("trend_"+o.degradation_trend,h)}</span>
            ${o.degradation_rate!=null?r`<span class="prediction-rate">${o.degradation_rate>0?"+":""}${Math.abs(o.degradation_rate)>=10?Math.round(o.degradation_rate).toLocaleString():o.degradation_rate.toFixed(1)} ${o.trigger_entity_info?.unit_of_measurement||""}/${s("day_short",h)}</span>`:p}
          </div>
        `:p}
        ${i?r`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${s("days_until_threshold",h)}</span>
            <span class="prediction-value prediction-days${o.days_until_threshold===0?" exceeded":o.sensor_prediction_urgency?" urgent":""}">${o.days_until_threshold===0?s("threshold_exceeded",h):"~"+Math.round(o.days_until_threshold)+" "+s("days",h)}</span>
            ${o.threshold_prediction_date?r`<span class="prediction-date">${N(o.threshold_prediction_date,h)}</span>`:p}
            ${o.threshold_prediction_confidence?r`<span class="confidence-dot ${o.threshold_prediction_confidence}"></span>`:p}
          </div>
        `:p}
        ${a&&t.environmental?r`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${s("environmental_adjustment",h)}</span>
            <span class="prediction-value">${o.environmental_factor.toFixed(2)}x</span>
            ${o.environmental_entity?r`<span class="prediction-entity entity-link" @click=${c=>ot(c,o.environmental_entity)}>${o.environmental_entity}</span>`:p}
          </div>
        `:p}
      </div>
    </div>
  `}function vt(o,h,t,e){let i=Math.max(o||1,h);return r`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${s("current",e)}: ${o??"\u2014"} ${o!=null?s("days",e):""}
        </div>
        <div class="interval-visual current"
          style="width: ${o!=null?Math.min(o/i*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${s("recommended",e)}: ${h} ${s("days",e)}
          <span class="confidence-badge ${t}">${s(`confidence_${t}`,e)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(h/i*100,100)}%"></div>
      </div>
    </div>
  `}var ft=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function bt(o,h,t){if(!t.seasonal||!o.seasonal_factor||o.seasonal_factor===1)return p;let e=ft.map(c=>s(c,h)),i=new Date().getMonth(),a=o.seasonal_factors||o.interval_analysis?.seasonal_factors||null,d=a&&a.length===12?a:e.map((c,_)=>{let u=o.seasonal_factor||1,v=Math.sin((_-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,u+v))});return r`
    <div class="seasonal-card-compact">
      <h4>${s("seasonal_awareness",h)}</h4>
      <div class="seasonal-mini-chart">
        ${d.map((c,_)=>{let u=c*40,v=c<.9?"low":c>1.1?"high":"normal";return r`
            <div class="seasonal-bar ${v} ${_===i?"current":""}"
                 style="height: ${u}px"
                 title="${e[_]}: ${c.toFixed(2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${s("shorter",h)||"K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${s("normal",h)||"Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${s("longer",h)||"L\xE4nger"}</span>
      </div>
    </div>
  `}function yt(o,h){return Wt(o,h)}function Wt(o,h){let t=o.seasonal_factors??o.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return p;let e=o.interval_analysis?.seasonal_reason,i=new Date().getMonth(),a=300,d=100,c=8,u=d-c-4,v=Math.max(...t,1.5),b=a/12,y=b*.65,$=c+u-1/v*u;return r`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${s("seasonal_chart_title",h)}
        ${e?r`<span class="source-tag">${e==="learned"?s("seasonal_learned",h):s("seasonal_manual",h)}</span>`:p}
      </div>
      <svg viewBox="0 0 ${a} ${d}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_seasonal",h)}">
        <line x1="0" y1="${$.toFixed(1)}" x2="${a}" y2="${$.toFixed(1)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((H,R)=>{let j=H/v*u,Q=R*b+(b-y)/2,O=c+u-j,D=R===i,V=H<1?"var(--success-color, #4caf50)":H>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return z`
            <rect x="${Q.toFixed(1)}" y="${O.toFixed(1)}"
              width="${y.toFixed(1)}" height="${j.toFixed(1)}"
              fill="${V}" opacity="${D?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${ft.map((H,R)=>r`<span class="seasonal-label ${R===i?"active-month":""}">${s(H,h)}</span>`)}
      </div>
    </div>
  `}var k=class extends E{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._featuresLoaded=!1}get _lang(){return this.hass?.language||"en"}async openFor(t,e){this._entryId=t,this._taskId=e,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=new Date().toISOString().slice(0,10),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){if(!this._featuresLoaded)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});t?.features&&(this._features={...this._features,...t.features}),this._featuresLoaded=!0}catch{}}close(){this._open=!1,this._task=null,this._error=""}async _loadTask(){if(!(!this._entryId||!this._taskId))try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._objectName=t.object?.name||"";let e=(t.tasks||[]).find(i=>i.id===this._taskId);this._task=e??null}catch(t){this._error=I(t,this._lang)}}async _runWs(t){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(t),this._busy=!1,!0}catch(e){return this._error=I(e,this._lang),this._busy=!1,!1}}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||import("./dialog-mount-NTYI3TJN.js").then(({openCompleteDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,checklist:this._task.checklist||[],adaptive_enabled:!!this._task.adaptive_config?.enabled})&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||import("./dialog-mount-NTYI3TJN.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("./dialog-mount-NTYI3TJN.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let t=s("delete_task_confirm",this._lang)||`Delete "${this._task?.name}"?`;if(!window.confirm(t))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})&&(this._toast=s("suggestion_applied",this._lang)||"Applied",this._notifyChanged("apply_suggestion"),await this._loadTask(),setTimeout(()=>{this._toast=""},2500))}async _reanalyzeInterval(){if(!(!this._entryId||!this._taskId)){this._busy=!0,this._error="";try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});this._toast=t.recommended_interval?`${s("reanalyze_result",this._lang)||"Recomputed"}: ${nt(t.recommended_interval,"days",this._lang)} (${t.data_points} pts)`:s("reanalyze_insufficient_data",this._lang)||"Not enough data",await this._loadTask(),setTimeout(()=>{this._toast=""},3500)}catch(t){this._error=I(t,this._lang)}finally{this._busy=!1}}}_onEditHistoryEntry(t){!this._entryId||!this._taskId||import("./dialog-mount-NTYI3TJN.js").then(({openHistoryEditDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,original_timestamp:t.timestamp,type:t.type,timestamp:t.timestamp,notes:t.notes??null,cost:t.cost??null,duration:t.duration??null,completed_by:t.completed_by??null,used_parts:t.used_parts??null})})}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return p;let e=this._lang;return r`
      <div class="recommendation-card">
        <h4>${s("suggested_interval",e)}</h4>
        ${vt(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",e)}
        <div class="recommendation-actions">
          <button class="btn primary"
            @click=${this._applySuggestion} ?disabled=${this._busy}>
            <ha-icon icon="mdi:check"></ha-icon>
            ${s("apply_suggestion",e)}
          </button>
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${s("reanalyze",e)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(t){let e=this._lang,i=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,a=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,d=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,c=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!i&&!a&&!d&&!c?r`<div class="adaptive-empty">
        ${s("adaptive_no_data",e)||"Not enough completion history yet for adaptive analysis."}
      </div>`:r`
      <div class="adaptive-stack">
        ${this._toast?r`<div class="toast">${this._toast}</div>`:p}
        ${i?this._renderRecommendation(t):p}
        ${a?gt(t,e,this._features):p}
        ${d?mt(t,e):p}
        ${c?r`
          ${bt(t,e,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?yt(t,e):p}
        `:p}
      </div>
    `}_renderDetails(t){let e=this._lang,i=t.history||[],a=i.filter(_=>_.type==="completed"),d=a.reduce((_,u)=>_+(typeof u.cost=="number"?u.cost:0),0),c=(()=>{let _=a.map(u=>typeof u.duration=="number"?u.duration:null).filter(u=>u!=null);return _.length?Math.round(_.reduce((u,v)=>u+v,0)/_.length):null})();return r`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${s("times_performed",e)||"Performed"}</span>
            <span class="stat-value">${a.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("total_cost",e)||"Total cost"}</span>
            <span class="stat-value">${d.toFixed(2)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("avg_duration",e)||"Avg duration"}</span>
            <span class="stat-value">${c!=null?`${c}m`:"\u2014"}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${s("history",e)||"History"}</strong>
          <span class="history-count">${i.length}</span>
        </div>
        ${i.length===0?r`<div class="history-empty">${s("history_empty",e)||"No history yet."}</div>`:r`
              <div class="history-list">
                ${[...i].reverse().slice(0,20).map(_=>{let u=["completed","reset","skipped"].includes(_.type);return r`
                    <div class="history-entry">
                      <div class="history-line">
                        <span class="history-type type-${_.type}">${s(_.type,e)}</span>
                        <span class="history-date">${rt(_.timestamp,e)}</span>
                        ${u?r`<button class="history-edit"
                                   title="${s("history_edit_button",e)||"Edit"}"
                                   @click=${()=>this._onEditHistoryEntry(_)}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                            </button>`:p}
                      </div>
                      ${_.notes?r`<div class="history-notes">${_.notes}</div>`:p}
                      ${_.cost!=null||_.duration!=null?r`<div class="history-meta">
                            ${_.cost!=null?r`<span>💰 ${_.cost.toFixed(2)}</span>`:p}
                            ${_.duration!=null?r`<span>⏱️ ${_.duration}m</span>`:p}
                          </div>`:p}
                    </div>
                  `})}
                ${i.length>20?r`<div class="history-more">… +${i.length-20} ${s("older_entries",e)||"older"}</div>`:p}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return p;let t=this._lang,e=this._task,i=this.hass?.user?.is_admin??!0;return r`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${e?r`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${B[e.status]||"#ccc"}"></span>
                  <span class="task-name">${e.name}</span>
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("./dialog-mount-NTYI3TJN.js").then(({openObjectQuickActions:a})=>{a(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${e.next_due?r`<span><strong>${s("next_due",t)||"Next due"}:</strong> ${N(e.next_due,t)}</span>`:p}
                  ${e.last_performed?r`<span><strong>${s("last_performed",t)||"Last"}:</strong> ${N(e.last_performed,t)}</span>`:p}
                  ${e.schedule?.kind&&!["manual","one_time"].includes(e.schedule.kind)||e.interval_days!=null?r`<span><strong>${s("interval",t)||"Interval"}:</strong> ${at(e,t)}</span>`:p}
                </div>
              </div>

              ${this._error?r`<div class="error">${this._error}</div>`:p}

              ${this._showSkip?r`
                    <div class="inline-form">
                      <label>${s("skip_reason",t)||"Skip reason (optional)"}</label>
                      <input type="text" .value=${this._skipReason}
                        @input=${a=>{this._skipReason=a.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${s("cancel",t)||"Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${s("skip",t)||"Skip"}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?r`
                    <div class="inline-form">
                      <label>${s("reset_to_date",t)||"Reset last_performed to"}</label>
                      <input type="date" .value=${this._resetDate}
                        @input=${a=>{this._resetDate=a.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${s("cancel",t)||"Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${s("reset",t)||"Reset"}
                        </button>
                      </div>
                    </div>
                  `:r`
                    <div class="actions primary-row">
                      <button class="btn primary" @click=${this._onComplete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:check"></ha-icon>
                        ${s("complete",t)||"Complete"}
                      </button>
                      <button class="btn" @click=${()=>{this._showSkip=!0}} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:skip-next"></ha-icon>
                        ${s("skip",t)||"Skip"}
                      </button>
                      <button class="btn" @click=${()=>{this._showReset=!0}} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:restart"></ha-icon>
                        ${s("reset",t)||"Reset"}
                      </button>
                    </div>
                    ${i?r`
                          <div class="actions secondary-row">
                            <button class="btn ghost" @click=${this._onEdit} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                              ${s("edit",t)||"Edit"}
                            </button>
                            <button class="btn ghost" @click=${this._onQr} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:qrcode"></ha-icon>
                              ${s("qr_code",t)||"QR"}
                            </button>
                            <button class="btn ghost"
                              @click=${e.archived?this._onUnarchive:this._onArchive}
                              ?disabled=${this._busy}>
                              <ha-icon icon="${e.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                              ${e.archived?s("unarchive",t)||"Unarchive":s("archive",t)||"Archive"}
                            </button>
                            <button class="btn ghost danger" @click=${this._onDelete} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:delete"></ha-icon>
                              ${s("delete",t)||"Delete"}
                            </button>
                          </div>
                        `:p}
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?s("hide_details",t)||"Hide details":s("show_details",t)||"Show history + stats"}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?r`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?s("hide_stats",t)||"Hide stats":s("show_stats",t)||"Show stats + graphs"}
                          </button>`:p}
                    </div>
                    ${this._showDetails?this._renderDetails(e):p}
                    ${this._showAdaptive?this._renderAdaptive(e):p}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${s("open_in_panel",t)||"Open in Maintenance panel"}
                      </button>
                    </div>
                  `}
            `:r`<div class="loading">${s("loading",t)||"Loading\u2026"}</div>`}
      </div>
    `}};k.styles=[dt,w`
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
    /* Edit + QR are admin-tools — left-align as a group; Delete is destructive
       so it gets pushed to the far right with margin-left:auto for visual
       separation. Earlier this row was flex-end which left a strange empty
       gap on the left (user feedback). */
    .actions.secondary-row {
      padding-top: 8px; border-top: 1px solid var(--divider-color);
      justify-content: flex-start;
    }
    .actions.secondary-row .btn.danger {
      margin-left: auto;
    }
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
  `],n([g({attribute:!1})],k.prototype,"hass",2),n([l()],k.prototype,"_open",2),n([l()],k.prototype,"_entryId",2),n([l()],k.prototype,"_taskId",2),n([l()],k.prototype,"_task",2),n([l()],k.prototype,"_objectName",2),n([l()],k.prototype,"_busy",2),n([l()],k.prototype,"_error",2),n([l()],k.prototype,"_showSkip",2),n([l()],k.prototype,"_showReset",2),n([l()],k.prototype,"_showDetails",2),n([l()],k.prototype,"_showAdaptive",2),n([l()],k.prototype,"_skipReason",2),n([l()],k.prototype,"_resetDate",2),n([l()],k.prototype,"_features",2),n([l()],k.prototype,"_toast",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",k);function $t(o){return!!o&&/^https?:\/\//i.test(o)}var C=class extends E{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error=""}get _lang(){return this.hass?.language||"en"}async openFor(t){this._entryId=t,this._error="",this._open=!0,await this._load()}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._data=t}catch(t){this._error=I(t,this._lang)}}_onEditObject(){!this._entryId||!this._data||import("./dialog-mount-NTYI3TJN.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("./dialog-mount-NTYI3TJN.js").then(({openCreateTaskDialog:t})=>{t(),this.close()})}async _onDelete(){if(!this._entryId||!this._data)return;let t=s("delete_object_confirm",this._lang)||`Delete "${this._data.object.name}" and all its tasks?`;if(window.confirm(t)){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=I(e,this._lang)}finally{this._busy=!1}}}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t){let e=s("confirm_archive_object",this._lang)||"Archive this object and its tasks?";if(!window.confirm(e))return}this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=I(e,this._lang)}finally{this._busy=!1}}_onTaskClick(t){this._entryId&&import("./dialog-mount-NTYI3TJN.js").then(({openTaskQuickActions:e})=>{e(this._entryId,t)})}render(){if(!this._open)return p;let t=this._lang,e=this._data,i=e?.object,a=e?.tasks||[],d=this.hass?.user?.is_admin??!0;return r`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${e&&i?r`
              <div class="header">
                <div class="title">${i.name}</div>
                ${this._renderMetaRow(i)}
              </div>

              ${this._error?r`<div class="error">${this._error}</div>`:p}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${s("tasks",t)||"Tasks"}</strong>
                  <span class="count">${a.length}</span>
                </div>
                ${a.length===0?r`<div class="empty">${s("no_tasks",t)||"No tasks yet."}</div>`:r`
                      <div class="task-list">
                        ${a.map(c=>r`
                          <div class="task-row" @click=${()=>this._onTaskClick(c.id)}>
                            <span class="status-dot" style="background: ${B[c.status]||"#ccc"}"></span>
                            <span class="task-name">${c.name}</span>
                            <span class="task-status">${s(c.status||"ok",t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${i.notes?r`
                    <div class="notes-section">
                      <strong>${s("object_notes_label",t)}</strong>
                      <div class="notes-body">${i.notes}</div>
                    </div>
                  `:p}

              ${d?r`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${s("add_task",t)||"Add task"}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${s("edit",t)||"Edit"}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${i.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${i.archived?s("unarchive_object",t)||"Unarchive object":s("archive_object",t)||"Archive object"}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${s("delete",t)||"Delete"}
                      </button>
                    </div>
                  `:p}
            `:r`<div class="loading">${s("loading",t)||"Loading\u2026"}</div>`}
      </div>
    `}_renderMetaRow(t){let e=this._lang,i=[];return t.area_id&&i.push([s("area",e),t.area_id]),t.manufacturer&&i.push([s("manufacturer",e),t.manufacturer]),t.model&&i.push([s("model",e),t.model]),t.serial_number&&i.push([s("serial_number_label",e),t.serial_number]),t.installation_date&&i.push([s("installed",e),t.installation_date]),t.warranty_expiry&&i.push([s("warranty",e),t.warranty_expiry]),t.documentation_url&&i.push([s("documentation_url_label",e),t.documentation_url]),i.length===0?p:r`
      <div class="meta">
        ${i.map(([a,d])=>r`
            <div class="meta-item">
              <span class="meta-label">${a}</span>
              <span class="meta-value">${$t(d)?r`<a href="${d}" target="_blank" rel="noopener noreferrer">${d}</a>`:d}</span>
            </div>
          `)}
      </div>
    `}};C.styles=w`
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
  `,n([g({attribute:!1})],C.prototype,"hass",2),n([l()],C.prototype,"_open",2),n([l()],C.prototype,"_entryId",2),n([l()],C.prototype,"_data",2),n([l()],C.prototype,"_busy",2),n([l()],C.prototype,"_error",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",C);var kt="maintenance-object-dialog",wt="maintenance-task-dialog",Kt="maintenance-history-edit-dialog",Gt="maintenance-complete-dialog",Yt="maintenance-qr-dialog",Qt="maintenance-task-quick-actions-dialog",Zt="maintenance-object-quick-actions-dialog";function Y(){return document.querySelector("home-assistant")?.hass}function Jt(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function q(o){let h=Jt(),t=h.querySelector(o)??document.body.querySelector(o);return t?t.parentNode!==h&&h.appendChild(t):(t=document.createElement(o),h.appendChild(t)),t}function F(o){let h=Y();if(!h)return!1;o.hass=h;let t=h.language||"en";return it(t)||st(t).then(()=>{o.requestUpdate?.()}),!0}var xt={features:{adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1},defaultWarningDays:7},G=null;function Et(o){return G||(G=o.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(h=>({features:h.features??xt.features,defaultWarningDays:h.general?.default_warning_days??7})).catch(()=>xt),G)}function Li(){let o=q(kt);return F(o)?(o.openCreate(),!0):!1}function Si(o,h){let t=q(kt);return F(t)?(t.openEdit(o,h),!0):!1}function Pi(){let o=q(wt);if(!F(o))return!1;let h=Y();return h?((async()=>{let t=await Et(h),e=o;e.checklistsEnabled=t.features.checklists,e.scheduleTimeEnabled=t.features.schedule_time,e.completionActionsEnabled=t.features.completion_actions,e.defaultWarningDays=t.defaultWarningDays,e.openCreate()})(),!0):!1}function Ci(o,h){let t=q(wt);if(!F(t))return!1;let e=Y();return e?((async()=>{try{let[i,a]=await Promise.all([e.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:o}),Et(e)]),d=(i.tasks||[]).find(_=>_.id===h);if(!d){console.warn(`openEditTaskDialog: task ${h} not found in entry ${o}`);return}let c=t;c.checklistsEnabled=a.features.checklists,c.scheduleTimeEnabled=a.features.schedule_time,c.completionActionsEnabled=a.features.completion_actions,c.defaultWarningDays=a.defaultWarningDays,await c.openEdit(o,d)}catch(i){console.warn("openEditTaskDialog: failed to load task/features",i)}})(),!0):!1}function Hi(o){let h=q(Kt);return F(h)?(h.openEdit(o),!0):!1}function Ri(o){let h=q(Gt);return F(h)?(h.entryId=o.entry_id,h.taskId=o.task_id,h.taskName=o.task_name,h.checklist=o.checklist??[],h.adaptiveEnabled=!!o.adaptive_enabled,h.requiredFields=o.required_completion_fields??[],h.lang=Y()?.language||"en",h.open(),!0):!1}function qi(o){let h=q(Yt);return F(h)?(h.openForTask(o.entry_id,o.task_id,o.object_name,o.task_name),!0):!1}function Fi(o,h){let t=q(Qt);return F(t)?(t.openFor(o,h),!0):!1}function Mi(o){let h=q(Zt);return F(h)?(h.openFor(o),!0):!1}export{Ri as openCompleteDialog,Li as openCreateObjectDialog,Pi as openCreateTaskDialog,Si as openEditObjectDialog,Ci as openEditTaskDialog,Hi as openHistoryEditDialog,Mi as openObjectQuickActions,qi as openQrDialog,Fi as openTaskQuickActions};
