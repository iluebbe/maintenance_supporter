/*! maintenance_supporter frontend 2.64.0 */
import{a as w,b as a,c as z,d as _,e as E,f as v,g as l,i as s,j as S,k as at,l as ot,m as j,n as lt,o as dt,p as tt,q as ct,r as pt,s as ht,t as ut,u as I}from"./chunk-D2BCBEH6.js";import{a as o,b as K}from"./chunk-3FHCH2PB.js";var T=class extends E{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1}_onInput(t){let e=t.target.value;this.value=e,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:e}}))}render(){return a`
      <label class="field">
        ${this.label?a`<span class="label">${this.label}${this.required?a`<span class="req">*</span>`:_}</span>`:_}
        <input
          .value=${this.value??""}
          .type=${this.type}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          step=${this.step??_}
          min=${this.min??_}
          max=${this.max??_}
          pattern=${this.pattern??_}
          @input=${this._onInput}
          @change=${this._onInput}
        />
        ${this.helper?a`<span class="helper">${this.helper}</span>`:_}
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
  `,o([v()],T.prototype,"label",2),o([v()],T.prototype,"value",2),o([v()],T.prototype,"placeholder",2),o([v()],T.prototype,"type",2),o([v({type:Boolean})],T.prototype,"required",2),o([v({type:Boolean})],T.prototype,"disabled",2),o([v()],T.prototype,"step",2),o([v()],T.prototype,"min",2),o([v()],T.prototype,"max",2),o([v()],T.prototype,"pattern",2),o([v()],T.prototype,"helper",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",T);var x=class extends E{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._entryId=null}get _lang(){return S(this.hass)}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId="",this._error="",this._open=!0}openEdit(t,e){this._entryId=t,this._name=e.name||"",this._manufacturer=e.manufacturer||"",this._model=e.model||"",this._serialNumber=e.serial_number||"",this._areaId=e.area_id||"",this._installationDate=e.installation_date||"",this._warrantyExpiry=e.warranty_expiry||"",this._documentationUrl=e.documentation_url||"",this._notes=e.notes||"",this._haDeviceId=e.ha_device_id||"",this._parentEntryId=e.parent_entry_id||"",this._error="",this._open=!0}async _save(){if(!this._loading&&this._name.trim()){this._loading=!0,this._error="";try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}catch(t){this._error=I(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_parentChoices(){return(this.objects||[]).filter(t=>t.entry_id!==this._entryId)}_close(){this._open=!1}render(){if(!this._open)return a``;let t=this._lang,e=this._entryId?s("edit_object",t):s("new_object",t);return a`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${e}</div>
        <div class="content">
          ${this._error?a`<div class="error">${this._error}</div>`:_}
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
          ${this._parentChoices().length?a`<label class="textarea-field">
                <span class="textarea-label">${s("parent_object_optional",t)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${i=>this._parentEntryId=i.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${s("parent_none",t)}
                  </option>
                  ${this._parentChoices().map(i=>a`<option
                      value=${i.entry_id}
                      ?selected=${this._parentEntryId===i.entry_id}
                    >${i.object.name}</option>`)}
                </select>
              </label>`:_}
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
  `,o([v({attribute:!1})],x.prototype,"hass",2),o([v({attribute:!1})],x.prototype,"objects",2),o([l()],x.prototype,"_open",2),o([l()],x.prototype,"_loading",2),o([l()],x.prototype,"_error",2),o([l()],x.prototype,"_name",2),o([l()],x.prototype,"_manufacturer",2),o([l()],x.prototype,"_model",2),o([l()],x.prototype,"_serialNumber",2),o([l()],x.prototype,"_areaId",2),o([l()],x.prototype,"_installationDate",2),o([l()],x.prototype,"_warrantyExpiry",2),o([l()],x.prototype,"_documentationUrl",2),o([l()],x.prototype,"_notes",2),o([l()],x.prototype,"_haDeviceId",2),o([l()],x.prototype,"_parentEntryId",2),o([l()],x.prototype,"_entryId",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",x);var Q=class{constructor(c){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=c}updateHass(c){this.hass=c}async getUsers(c=!1){let t=Date.now();if(!c&&this.usersCache&&t-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=e.users,this.cacheTimestamp=t,this.usersCache}catch(e){return console.error("Failed to fetch users:",e),this.usersCache||[]}}async assignUser(c,t,e){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:c,task_id:t,user_id:e})}async getTasksByUser(c){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:c})).tasks}getUserName(c){return!c||!this.usersCache?null:this.usersCache.find(e=>e.id===c)?.name||null}getUser(c){return!c||!this.usersCache?null:this.usersCache.find(t=>t.id===c)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(c){return c?c===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}};function H(n){return`${n.entry_id??""}\0${n.part_id}`}function Ft(n,c,t,e){let i=!!n.entry_id&&n.entry_id!==c,r=i?n.entry_id:c,d=t.find(g=>g.entry_id===r),p=(d?.parts||[]).find(g=>g.id===n.part_id)||null,u=i&&d?.object?.name||"",h=p?.name||s("shared_part_unknown",e);return{part:p,foreign:i,ownerName:u,label:u?`${h} (${u})`:h}}function _t(n,c,t,e){let r=(t.find(p=>p.entry_id===c)?.parts||[]).map(p=>({...p})),d=new Set(r.map(p=>H({part_id:p.id})));for(let p of n?.consumes_parts||[]){if(!p.entry_id||p.entry_id===c)continue;let u=H(p);if(d.has(u))continue;d.add(u);let{part:h,ownerName:g}=Ft(p,c,t,e);r.push({id:p.part_id,name:h?.name||s("shared_part_unknown",e),unit:h?.unit,stock:h?.stock??null,storage_location:h?.storage_location,entry_id:p.entry_id,owner_name:g})}return r}var et=["sensor","binary_sensor","number","input_number","input_boolean","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock"],mt=["sensor"],gt=["temperature","humidity","pressure"];var vt=["notes","cost","duration","photo","user"],Y={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"};var Ot=["cleaning","inspection","replacement","calibration","service","reading","custom"],jt=["low","normal","high"],Dt=["time_based","weekdays","nth_weekday","day_of_month","sensor_based","one_time","manual"],it=["weekdays","nth_weekday","day_of_month"],ft=["threshold","counter","state_change","runtime"],zt=[...ft,"compound"],M={alpha:"0.3",min:"7",max:"365"};function Ut(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",carry:{}}}var Vt=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states"]);function Bt(n){return{entityIds:(n.entity_ids||(n.entity_id?[n.entity_id]:[])).join(", "),type:n.type||"threshold",attribute:n.attribute||"",above:n.trigger_above?.toString()??"",below:n.trigger_below?.toString()??"",equals:n.trigger_equals?.toString()??"",notEquals:n.trigger_not_equals?.toString()??"",forMinutes:n.trigger_for_minutes?.toString()??"0",targetValue:n.trigger_target_value?.toString()??"",deltaMode:n.trigger_delta_mode||!1,fromState:n.trigger_from_state||"",toState:n.trigger_to_state||"",targetChanges:n.trigger_target_changes?.toString()??"",runtimeHours:n.trigger_runtime_hours?.toString()??"",onStates:(n.trigger_on_states||[]).join(", "),carry:Object.fromEntries(Object.entries(n).filter(([t])=>!Vt.has(t)&&!t.startsWith("_")))}}function Wt(n){let c=n.entityIds.split(",").map(e=>e.trim()).filter(Boolean);if(c.length===0)return null;let t={...n.carry||{},entity_id:c[0],entity_ids:c,type:n.type};if(n.attribute&&(t.attribute=n.attribute),n.type==="threshold"){let e=parseFloat(n.above);isNaN(e)||(t.trigger_above=e);let i=parseFloat(n.below);isNaN(i)||(t.trigger_below=i);let r=parseFloat(n.equals);isNaN(r)||(t.trigger_equals=r);let d=parseFloat(n.notEquals);isNaN(d)||(t.trigger_not_equals=d);let p=parseInt(n.forMinutes,10);isNaN(p)||(t.trigger_for_minutes=p)}else if(n.type==="counter"){let e=parseFloat(n.targetValue);isNaN(e)||(t.trigger_target_value=e),t.trigger_delta_mode=n.deltaMode}else if(n.type==="state_change"){n.fromState&&(t.trigger_from_state=n.fromState),n.toState&&(t.trigger_to_state=n.toState);let e=parseInt(n.targetChanges,10);isNaN(e)||(t.trigger_target_changes=e)}else if(n.type==="runtime"){let e=parseFloat(n.runtimeHours);isNaN(e)||(t.trigger_runtime_hours=e);let i=(n.onStates||"").split(",").map(r=>r.trim()).filter(Boolean);i.length>0&&(t.trigger_on_states=i)}return t}function Kt(n){return Array.from({length:7},(c,t)=>tt(t,n,"short"))}function Qt(n){let c=new Intl.DateTimeFormat(n||"en",{month:"short"});return Array.from({length:12},(t,e)=>c.format(new Date(2021,e,1)))}var m=class m extends E{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.defaultWarningDays=7;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._entryId="";this._taskId=null;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._priority="normal";this._labels="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerOnStates="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._readingUnit="";this._consumesParts={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._actionService="";this._actionTargetEntity="";this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=M.alpha;this._adaptiveMin=M.min;this._adaptiveMax=M.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return S(this.hass)}async openCreate(t,e){this._entryId=t,this._taskId=null,this._error="",!t&&e&&e.length>0?(this._objectChoices=e.map(i=>({entry_id:i.entry_id,name:i.object.name})).sort((i,r)=>i.name.localeCompare(r.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(t,e){this._entryId=t,this._taskId=e.id,this._error="",this._name=e.name,this._type=e.type,this._scheduleType=e.schedule_type,this._intervalDays=e.interval_days!=null?String(e.interval_days):"",this._intervalUnit=e.interval_unit||"days",this._dueDate=e.due_date||"";let i=e.schedule;this._weekdays=i?.kind==="weekdays"?[...i.weekdays??[]]:[],this._nth=i?.kind==="nth_weekday"?String(i.nth??1):"1",this._nthWeekday=i?.kind==="nth_weekday"?String(i.weekday??5):"5",this._domDay=i?.kind==="day_of_month"&&(i.day??1)>=1?String(i.day??1):"1",this._domLastDay=i?.kind==="day_of_month"&&i.day===-1,this._domBusiness=i?.kind==="day_of_month"&&i.business===!0,this._calOffset=i?.offset?String(i.offset):"0",this._seasonMonths=Array.isArray(i?.season_months)?[...i.season_months]:[];let r=i?.ends;r&&typeof r.count=="number"?(this._endsMode="count",this._endsCount=String(r.count),this._endsUntil=""):r&&typeof r.until=="string"?(this._endsMode="until",this._endsUntil=r.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=e.warning_days.toString(),this._earliestCompletionDays=e.earliest_completion_days!=null?String(e.earliest_completion_days):"",this._intervalAnchor=e.interval_anchor||"completion",this._notes=e.notes||"",this._documentationUrl=e.documentation_url||"",this._customIcon=e.custom_icon||"",this._priority=e.priority||"normal",this._labels=(e.labels||[]).join(", "),this._enabled=e.enabled!==!1,this._lastPerformed=e.last_performed||"",this._nfcTagId=e.nfc_tag_id||"",this._readingUnit=e.reading_unit||"",this._consumesParts=Object.fromEntries((e.consumes_parts||[]).map(h=>[H(h),{...h}])),this._responsibleUserId=e.responsible_user_id||null,this._assigneePool=[...e.assignee_pool||[]],this._rotationStrategy=e.rotation_strategy||"",this._checklistText=(e.checklist||[]).join(`
`),this._phaseDefs=Object.entries(e.phases||{}).map(([h,g])=>{let{name:b,checklist:y,consumes_parts:$,...L}=g;return{id:h,name:g.name||h,checklistText:(g.checklist||[]).join(`
`),partId:g.consumes_parts?.[0]?.part_id||"",partQty:g.consumes_parts?.[0]?.quantity!=null?String(g.consumes_parts[0].quantity):"",extraParts:(g.consumes_parts||[]).slice(1),carry:L}}),this._phaseSeq=[...e.phase_sequence||[]],this._requiredCompletion=[...e.required_completion_fields||[]],this._scheduleTime=e.schedule_time||"";let d=e.on_complete_action;if(d&&d.service){this._actionService=d.service;let h=d.target?.entity_id;this._actionTargetEntity=Array.isArray(h)?h[0]||"":h||"",this._actionData=d.data&&typeof d.data=="object"?{...d.data}:{},this._actionDataJsonFallback=""}else this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="";let p=e.quick_complete_defaults;this._qcNotes=p?.notes||"",this._qcCost=p?.cost!=null?String(p.cost):"",this._qcDuration=p?.duration!=null?String(p.duration):"",this._qcFeedback=p?.feedback||"";let u=e.adaptive_config||{};if(this._environmentalEntity=u.environmental_entity||"",this._environmentalAttribute=u.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!u.enabled,this._adaptiveAlpha=u.ewa_alpha?.toString()??M.alpha,this._adaptiveMin=u.min_interval_days?.toString()??M.min,this._adaptiveMax=u.max_interval_days?.toString()??M.max,this._adaptiveSeasonal=u.seasonal_enabled!==!1,this._adaptivePrediction=u.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),e.trigger_config){let h=e.trigger_config;this._triggerEntityId=h.entity_id||h.entity_ids&&h.entity_ids[0]||"",this._triggerEntityIds=h.entity_ids||(h.entity_id?[h.entity_id]:[]),this._triggerEntityLogic=h.entity_logic||"any",this._triggerAttribute=h.attribute||"",this._triggerType=h.type||"threshold",this._triggerAbove=h.trigger_above?.toString()||"",this._triggerBelow=h.trigger_below?.toString()||"",this._triggerEquals=h.trigger_equals?.toString()||"",this._triggerNotEquals=h.trigger_not_equals?.toString()||"",this._triggerForMinutes=h.trigger_for_minutes?.toString()||"0",this._triggerCombinator=h.trigger_combinator==="all"?"all":"any",this._triggerTargetValue=h.trigger_target_value?.toString()||"",this._triggerDeltaMode=h.trigger_delta_mode||!1,this._triggerBaselineValue=h.trigger_baseline_value?.toString()||"",this._liveBaselineValue=e.trigger_baseline_value??null,this._autoCompleteOnRecovery=h.auto_complete_on_recovery||!1,this._triggerFromState=h.trigger_from_state||"",this._triggerToState=h.trigger_to_state||"",this._triggerTargetChanges=h.trigger_target_changes?.toString()||"",this._triggerRuntimeHours=h.trigger_runtime_hours?.toString()||"",this._triggerOnStates=(h.trigger_on_states||[]).join(", "),h.type==="compound"?(this._compoundLogic=h.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(h.conditions||[]).map(Bt)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._priority="normal",this._labels="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._readingUnit="",this._consumesParts={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=M.alpha,this._adaptiveMin=M.min,this._adaptiveMax=M.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="",this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._triggerAttribute="",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerEquals="",this._triggerNotEquals="",this._triggerForMinutes="0",this._triggerCombinator="any",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges="",this._triggerRuntimeHours="",this._triggerOnStates="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new Q(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(t){console.error("Failed to load users:",t),this._availableUsers=[]}}_toggleAssignee(t){this._assigneePool=this._assigneePool.includes(t)?this._assigneePool.filter(e=>e!==t):[...this._assigneePool,t]}async _testAction(){let t=this._actionService.trim();if(!t||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(t)){this._actionTestResult="error",this._actionTestError="Invalid service format (expected 'domain.service')",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[e,i]=t.split(".");if(!this.hass?.services?.[e]?.[i]){this._actionTestResult="error",this._actionTestError=`Service "${t}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let r=this._actionTargetEntity.trim();if(r){let d=r.split(".")[0];if(d!==e&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(e)){this._actionTestResult="error",this._actionTestError=`Service "${t}" only works on ${e}.* entities; entity "${r}" is in ${d}.* \u2014 pick a service that matches the entity domain (e.g. ${d}.${i})`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[r]){this._actionTestResult="error",this._actionTestError=`Target entity "${r}" not found in Home Assistant \u2014 the entity may have been renamed or its integration removed.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let t=JSON.parse(this._actionDataJsonFallback);if(t&&typeof t=="object"&&!Array.isArray(t))return t}catch{}return{...this._actionData}}_serviceSchema(){let t=this._actionService.trim();if(!t||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(t))return null;let[e,i]=t.split("."),r=this.hass?.services?.[e]?.[i]?.fields;return!r||Object.keys(r).length===0?null:Object.entries(r).map(([d,p])=>({name:d,required:!!p.required,selector:p.selector||{text:{}}}))}_renderCompletionActionsSection(t){if(!this.completionActionsEnabled)return _;let e=this._serviceSchema();return a`
      <details class="ca-section">
        <summary>${s("on_complete_action_title",t)}</summary>
        <p class="field-help">${s("on_complete_action_desc",t)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${i=>{this._actionService=i.detail.value||"";let r=this._serviceSchema();if(r){let d=new Set(r.map(p=>p.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([p])=>d.has(p)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>s("on_complete_action_target",t)}
          @value-changed=${i=>{let r=i.detail.value;this._actionTargetEntity=r.target_entity||""}}
        ></ha-form>
        <p class="field-help ca-domain-hint">
          ${s("on_complete_action_target_hint",t)}
        </p>
        ${e?a`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${e}
                .data=${this._actionData}
                @value-changed=${i=>{this._actionData={...i.detail.value}}}
              ></ha-form>
            `:a`
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
          ${this._actionTestResult==="ok"?a`<span class="ca-test-ok">${s("on_complete_action_test_success",t)}</span>`:_}
          ${this._actionTestResult==="error"?a`<div class="ca-test-error-block">
                <span class="ca-test-error">${s("on_complete_action_test_failed",t)}</span>
                ${this._actionTestError?a`<div class="ca-test-error-detail">${this._actionTestError}</div>`:_}
              </div>`:_}
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
    `}async _loadParts(){if(this.parts=[],!!this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this.parts=t.parts||[],this._partsLoadFailed=!1}catch{this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){if(this._foreignOwners=[],!!this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._foreignOwners=(t.objects||[]).filter(e=>e.entry_id!==this._entryId&&(e.parts||[]).length>0).map(e=>({entry_id:e.entry_id,name:e.object?.name||e.entry_id,parts:e.parts||[]})).sort((e,i)=>e.name.localeCompare(i.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=t.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(t){!t||!this.hass||this._conditionAttrOptions[t]||this._conditionAttrPending.has(t)||(this._conditionAttrPending.add(t),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:t}).then(e=>{let i=e;this._conditionAttrOptions={...this._conditionAttrOptions,[t]:{suggested:i.suggested_attributes||[],available:i.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[t]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(t){if(!t||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:t});this._entityDomain=e.domain||"",this._suggestedAttributes=e.suggested_attributes||[],this._availableAttributes=e.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(t=>!!t.entry_id)}_renderConsumesRow(t,e){let i=H({part_id:t.id,entry_id:e}),r=this._consumesParts[i],d=e?{part_id:t.id,quantity:1,entry_id:e}:{part_id:t.id,quantity:1};return a`
      <div class="consumes-row">
        <label class="consumes-check">
          <input
            type="checkbox"
            .checked=${r!==void 0}
            @change=${p=>{let u={...this._consumesParts};p.target.checked?u[i]=u[i]||d:delete u[i],this._consumesParts=u}}
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
              @input=${p=>{let u=parseFloat(p.target.value);this._consumesParts={...this._consumesParts,[i]:{...d,quantity:Number.isFinite(u)&&u>=.01?u:1}}}}
            />`:_}
      </div>
    `}_toggleRequired(t,e){let i=new Set(this._requiredCompletion);e?i.add(t):i.delete(t),this._requiredCompletion=[...i]}_phaseSlug(t){let e=t.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",i=e,r=2;for(;this._phaseDefs.some(d=>d.id===i);)i=`${e}-${r++}`;return i}_addPhaseDef(){let t=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:t,name:"",checklistText:"",partId:"",partQty:"",extraParts:[],carry:{}}]}_removePhaseDef(t){this._phaseDefs=this._phaseDefs.filter(e=>e.id!==t),this._phaseSeq=this._phaseSeq.filter(e=>e!==t)}_patchPhaseDef(t,e){this._phaseDefs=this._phaseDefs.map(i=>i.id===t?{...i,...e}:i)}_renderPhasesEditor(t){let e=i=>this._phaseDefs.find(r=>r.id===i)?.name||i;return a`
      <h3>${s("phases_section",t)}</h3>
      <div class="field-help">${s("phases_hint",t)}</div>
      ${this._phaseDefs.map(i=>a`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${s("phase_name",t)}"
              .value=${i.name}
              @input=${r=>this._patchPhaseDef(i.id,{name:r.target.value})}
            ></ms-textfield>
            ${this.parts.length?a`
              <select
                class="phase-part"
                .value=${i.partId}
                @change=${r=>this._patchPhaseDef(i.id,{partId:r.target.value})}
              >
                <option value="">—</option>
                ${this.parts.map(r=>a`<option value=${r.id} ?selected=${r.id===i.partId}>${r.name}</option>`)}
              </select>
              ${i.partId?a`
                <input class="phase-qty" type="number" min="0.01" step="0.01" .value=${i.partQty||"1"}
                  @input=${r=>this._patchPhaseDef(i.id,{partQty:r.target.value})} />
              `:_}
            `:_}
            <mwc-icon-button class="phase-remove" @click=${()=>this._removePhaseDef(i.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </mwc-icon-button>
          </div>
          ${this.checklistsEnabled?a`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${s("checklist_placeholder",t)}"
              .value=${i.checklistText}
              @input=${r=>this._patchPhaseDef(i.id,{checklistText:r.target.value})}
            ></textarea>
          `:_}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${s("phase_add",t)}
      </ha-button>
      ${this._phaseDefs.some(i=>i.name.trim())?a`
        <div class="phase-seq-label">${s("phase_sequence_label",t)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((i,r)=>a`
            <span class="phase-chip">
              ${r+1}. ${e(i)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((d,p)=>p!==r)}}>✕</button>
            </span>
          `)}
          <select
            class="phase-seq-add"
            .value=${""}
            @change=${i=>{let r=i.target.value;r&&(this._phaseSeq=[...this._phaseSeq,r]),i.target.value=""}}
          >
            <option value="">+ ${s("phase_sequence_add_step",t)}</option>
            ${this._phaseDefs.filter(i=>i.name.trim()).map(i=>a`<option value=${i.id}>${i.name}</option>`)}
          </select>
        </div>
      `:_}
    `}async _save(){if(!this._loading&&this._name.trim()){if(this._adaptiveSnapshot()!==this._adaptiveInitial){let t=parseInt(this._adaptiveMin,10),e=parseInt(this._adaptiveMax,10);if(!isNaN(t)&&!isNaN(e)&&t>e){this._error=`${s("adaptive_min_interval",this._lang)} > ${s("adaptive_max_interval",this._lang)}`;return}}this._loading=!0,this._error="";try{let t={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},e=this._earliestCompletionDays.trim();t.earliest_completion_days=e===""?null:Math.max(0,parseInt(e,10)||0),this._taskId&&(t.task_id=this._taskId),this._scheduleType==="one_time"?(t.due_date=this._dueDate||null,t.interval_days=null):it.includes(this._scheduleType)?(t.schedule={...this._buildSchedule(),...this._recurrenceExtras()},t.interval_days=null,this._taskId&&(t.due_date=null)):(this._taskId&&(t.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(t.interval_days=parseInt(this._intervalDays,10),t.interval_unit=this._intervalUnit,t.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(t.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(t.interval_days=null,t.interval_anchor="completion")),t.notes=this._notes||null,t.documentation_url=this._documentationUrl||null,t.custom_icon=this._customIcon||null,t.priority=this._priority,t.labels=this._labels.split(",").map(p=>p.trim()).filter(Boolean),t.enabled=this._enabled,t.last_performed=this._lastPerformed||null,t.nfc_tag_id=this._nfcTagId||null,t.reading_unit=this._readingUnit.trim()||null;{let p={};for(let h of this._phaseDefs){if(!h.name.trim())continue;let g={...h.carry,name:h.name.trim()},b=h.checklistText.split(`
`).map($=>$.trim()).filter(Boolean);b.length&&(g.checklist=b);let y=[];if(h.partId){let $=parseFloat(h.partQty);y.push({part_id:h.partId,quantity:Number.isFinite($)&&$>0?$:1})}y.push(...h.extraParts),y.length&&(g.consumes_parts=y),p[h.id]=g}let u=this._phaseSeq.filter(h=>h in p);t.phases=Object.keys(p).length&&u.length?p:null,t.phase_sequence=t.phases?u:null}if((this.parts.length||this._foreignOwners.length)&&(t.consumes_parts=Object.values(this._consumesParts).map(p=>p.entry_id?{part_id:p.part_id,quantity:p.quantity,entry_id:p.entry_id}:{part_id:p.part_id,quantity:p.quantity})),t.responsible_user_id=this._responsibleUserId,t.assignee_pool=this._assigneePool,t.required_completion_fields=this._requiredCompletion,t.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let p=this._compoundConditions.map(Wt).filter(u=>u!==null);if(p.length>0){let u={type:"compound",compound_logic:this._compoundLogic,conditions:p};this._autoCompleteOnRecovery&&(u.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(u.trigger_combinator="all"),t.trigger_config=u}else this._taskId&&(t.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let p=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],u={entity_id:p[0],entity_ids:p,type:this._triggerType};if(this._triggerAttribute&&(u.attribute=this._triggerAttribute),this._autoCompleteOnRecovery&&(u.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(u.trigger_combinator="all"),p.length>1&&(u.entity_logic=this._triggerEntityLogic),this._triggerType==="threshold"){if(this._triggerAbove){let h=parseFloat(this._triggerAbove);isNaN(h)||(u.trigger_above=h)}if(this._triggerBelow){let h=parseFloat(this._triggerBelow);isNaN(h)||(u.trigger_below=h)}if(this._triggerEquals){let h=parseFloat(this._triggerEquals);isNaN(h)||(u.trigger_equals=h)}if(this._triggerNotEquals){let h=parseFloat(this._triggerNotEquals);isNaN(h)||(u.trigger_not_equals=h)}if(this._triggerForMinutes){let h=parseInt(this._triggerForMinutes,10);isNaN(h)||(u.trigger_for_minutes=h)}}else if(this._triggerType==="counter"){if(this._triggerTargetValue){let h=parseFloat(this._triggerTargetValue);isNaN(h)||(u.trigger_target_value=h)}if(u.trigger_delta_mode=this._triggerDeltaMode,this._triggerDeltaMode&&this._triggerBaselineValue){let h=parseFloat(this._triggerBaselineValue);!isNaN(h)&&h>=0&&(u.trigger_baseline_value=h)}}else if(this._triggerType==="state_change"){if(this._triggerFromState&&(u.trigger_from_state=this._triggerFromState),this._triggerToState&&(u.trigger_to_state=this._triggerToState),this._triggerTargetChanges){let h=parseInt(this._triggerTargetChanges,10);isNaN(h)||(u.trigger_target_changes=h)}if(this._triggerForMinutes){let h=parseInt(this._triggerForMinutes,10);isNaN(h)||(u.trigger_for_minutes=h)}}else if(this._triggerType==="runtime"){if(this._triggerRuntimeHours){let g=parseFloat(this._triggerRuntimeHours);isNaN(g)||(u.trigger_runtime_hours=g)}let h=this._triggerOnStates.split(",").map(g=>g.trim()).filter(Boolean);h.length>0&&(u.trigger_on_states=h)}t.trigger_config=u}else this._taskId&&(t.trigger_config=null);if(this.scheduleTimeEnabled&&this._scheduleType==="time_based"){let p=this._scheduleTime.trim();t.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(p)?p:null}if(this.checklistsEnabled){let p=this._checklistText.split(`
`).map(u=>u.trim()).filter(Boolean).slice(0,100);t.checklist=p.length?p:null}if(this.completionActionsEnabled){let p=this._actionService.trim();if(p&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(p)){let b={service:p},y=this._actionTargetEntity.trim();y&&(b.target={entity_id:y});let $=this._buildActionData();Object.keys($).length>0&&(b.data=$),t.on_complete_action=b}else t.on_complete_action=null;let u={};this._qcNotes.trim()&&(u.notes=this._qcNotes.trim());let h=parseFloat(this._qcCost);!isNaN(h)&&h>=0&&(u.cost=h);let g=parseInt(this._qcDuration,10);!isNaN(g)&&g>=0&&(u.duration=g),this._qcFeedback&&(u.feedback=this._qcFeedback),t.quick_complete_defaults=Object.keys(u).length?u:null}let i=await this.hass.connection.sendMessagePromise(t),r=this._taskId||i?.task_id,d=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;if(r&&this._scheduleType==="sensor_based"&&d)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:r,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null}),this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute}catch{}if(r&&this._adaptiveSnapshot()!==this._adaptiveInitial){let p=parseFloat(this._adaptiveAlpha),u=parseInt(this._adaptiveMin,10),h=parseInt(this._adaptiveMax,10);try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:r,enabled:this._adaptiveEnabled,...p>=.1&&p<=.9?{ewa_alpha:p}:{},...!isNaN(u)&&u>=1?{min_interval_days:u}:{},...!isNaN(h)&&h>=1?{max_interval_days:h}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction}),this._adaptiveInitial=this._adaptiveSnapshot()}catch{}}this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}catch(t){this._error=I(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1,this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return _;let t=this._lang,e=this._triggerType==="compound";return a`
      <h3>${s("trigger_configuration",t)}</h3>
      <div class="select-row">
        <label>${s("trigger_type",t)}</label>
        <select
          .value=${this._triggerType}
          @change=${i=>this._triggerType=i.target.value}
        >
          ${zt.map(i=>a`<option value=${i} ?selected=${i===this._triggerType}>${s(i,t)}</option>`)}
        </select>
      </div>
      ${e?this._renderCompoundEditor():a`
        ${this._entityPickerFallback?a`
          <ms-textfield
            label="${s("entity_id",t)} (${s("comma_separated",t)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${i=>{let d=i.target.value.split(",").map(p=>p.trim()).filter(Boolean);this._triggerEntityId=d[0]||"",this._triggerEntityIds=d,d[0]&&this._fetchEntityAttributes(d[0])}}
          ></ms-textfield>
        `:a`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:et}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>s("entity_id",t)}
          @value-changed=${i=>{let r=(i.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=r[0]||"",this._triggerEntityIds=r,r[0]?this._fetchEntityAttributes(r[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?a`
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
        `:_}
        ${this._renderAttributeSelect({label:s("attribute_optional",t),value:this._triggerAttribute,suggested:this._suggestedAttributes,available:this._availableAttributes,onSelect:i=>this._triggerAttribute=i})}
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
      ${this._intervalDays?this._renderUnitSelect():_}
      ${this._intervalDays?a`
            <div class="select-row">
              <label>${s("trigger_combinator",t)}</label>
              <select
                @change=${i=>this._triggerCombinator=i.target.value}
              >
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${s("trigger_combinator_any",t)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${s("trigger_combinator_all",t)}</option>
              </select>
            </div>
          `:_}
    `}_patchCondition(t,e){this._compoundConditions=this._compoundConditions.map((i,r)=>r===t?{...i,...e}:i)}_addCondition(){this._compoundConditions=[...this._compoundConditions,Ut()]}_removeCondition(t){this._compoundConditions=this._compoundConditions.filter((e,i)=>i!==t)}_renderCompoundEditor(){let t=this._lang;return a`
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
      ${this._compoundConditions.length===0?a`<div class="field-help">${s("compound_no_conditions",t)}</div>`:this._compoundConditions.map((e,i)=>this._renderCondition(e,i))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${s("compound_add_condition",t)}
      </button>
    `}_renderCondition(t,e){let i=this._lang,r=e+1;return a`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${s("compound_condition",i)} ${r}</span>
          <button
            type="button"
            class="icon-btn"
            title="${s("compound_remove_condition",i)}"
            @click=${()=>this._removeCondition(e)}
          >✕</button>
        </div>
        ${this._entityPickerFallback?a`
          <ms-textfield
            label="${s("entity_id",i)} (${s("comma_separated",i)})"
            .value=${t.entityIds}
            @input=${d=>this._patchCondition(e,{entityIds:d.target.value})}
          ></ms-textfield>
        `:a`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:et}}}]}
          .data=${{condition_entities:t.entityIds.split(",").map(d=>d.trim()).filter(Boolean)}}
          .computeLabel=${()=>s("entity_id",i)}
          @value-changed=${d=>{let p=(d.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(e,{entityIds:p.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(t,e)}
        <div class="select-row">
          <label>${s("trigger_type",i)}</label>
          <select
            .value=${t.type}
            @change=${d=>this._patchCondition(e,{type:d.target.value})}
          >
            ${ft.map(d=>a`<option value=${d} ?selected=${d===t.type}>${s(d,i)}</option>`)}
          </select>
        </div>
        ${this._renderConditionTypeFields(t,e)}
      </div>
    `}_renderStateField(t){return this._entityPickerFallback||!t.entityId?a`
        <ms-textfield
          label=${t.label}
          .value=${t.value}
          @input=${e=>t.onInput(e.target.value)}
        ></ms-textfield>
      `:a`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:t.entityId}}}]}
        .data=${{s:t.value}}
        .computeLabel=${()=>t.label}
        @value-changed=${e=>t.onInput((e.detail.value.s||"").trim())}
      ></ha-form>
    `}_renderOnStatesField(t){let e=this._lang;return this._entityPickerFallback||!t.entityId?a`
        <ms-textfield
          label="${s("runtime_on_states",e)}"
          placeholder="on"
          .value=${t.value}
          @input=${i=>t.onInput(i.target.value)}
        ></ms-textfield>
      `:a`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:t.entityId,multiple:!0}}}]}
        .data=${{s:(t.value||"").split(",").map(i=>i.trim()).filter(Boolean)}}
        .computeLabel=${()=>s("runtime_on_states",e)}
        @value-changed=${i=>t.onInput((i.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(t){return this._scheduleType==="one_time"||this._scheduleType==="manual"?_:a`
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
        ${this._adaptiveEnabled?a`
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
        `:_}
      </details>
    `}_renderAttributeSelect(t){let e=this._lang;return t.available.length>0?a`
        <div class="select-row">
          <label>${t.label}</label>
          <select
            .value=${t.value}
            @change=${i=>t.onSelect(i.target.value)}
          >
            <option value="" ?selected=${!t.value}>${s("use_entity_state",e)}</option>
            ${t.suggested.map(i=>a`<option value=${i} ?selected=${i===t.value}>${i} ★</option>`)}
            ${t.available.filter(i=>!t.suggested.includes(i.name)).map(i=>a`<option value=${i.name} ?selected=${i.name===t.value}>${i.name}${i.numeric?"":" (non-numeric)"}</option>`)}
          </select>
        </div>
      `:a`
      <ms-textfield
        label="${t.label}"
        .value=${t.value}
        @input=${i=>t.onSelect(i.target.value.trim())}
      ></ms-textfield>
    `}_renderEnvironmentalAttribute(t){this._fetchConditionAttributes(this._environmentalEntity);let e=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:s("environmental_attribute_optional",t),value:this._environmentalAttribute,suggested:e?.suggested??[],available:e?.available??[],onSelect:i=>this._environmentalAttribute=i})}_renderConditionAttribute(t,e){let i=t.entityIds.split(",")[0]?.trim()||"";i&&this._fetchConditionAttributes(i);let r=i?this._conditionAttrOptions[i]:void 0;return this._renderAttributeSelect({label:s("attribute_optional",this._lang),value:t.attribute,suggested:r?.suggested??[],available:r?.available??[],onSelect:d=>this._patchCondition(e,{attribute:d})})}_renderConditionTypeFields(t,e){let i=this._lang;if(t.type==="threshold")return a`
        <ms-textfield label="${s("trigger_above",i)}" type="number" .value=${t.above}
          @input=${r=>this._patchCondition(e,{above:r.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_below",i)}" type="number" .value=${t.below}
          @input=${r=>this._patchCondition(e,{below:r.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_equals",i)}" type="number" .value=${t.equals}
          @input=${r=>this._patchCondition(e,{equals:r.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_not_equals",i)}" type="number" .value=${t.notEquals}
          @input=${r=>this._patchCondition(e,{notEquals:r.target.value})}></ms-textfield>
        <ms-textfield label="${s("for_minutes",i)}" type="number" .value=${t.forMinutes}
          @input=${r=>this._patchCondition(e,{forMinutes:r.target.value})}></ms-textfield>
      `;if(t.type==="counter")return a`
        <ms-textfield label="${s("target_value",i)}" type="number" .value=${t.targetValue}
          @input=${r=>this._patchCondition(e,{targetValue:r.target.value})}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${t.deltaMode}
            @change=${r=>this._patchCondition(e,{deltaMode:r.target.checked})} />
          ${s("delta_mode",i)}
        </label>
      `;if(t.type==="state_change"){let r=t.entityIds.split(",")[0]?.trim()||"";return a`
        ${this._renderStateField({label:s("from_state_optional",i),value:t.fromState,entityId:r,onInput:d=>this._patchCondition(e,{fromState:d})})}
        ${this._renderStateField({label:s("to_state_optional",i),value:t.toState,entityId:r,onInput:d=>this._patchCondition(e,{toState:d})})}
        <ms-textfield label="${s("target_changes",i)}" type="number" .value=${t.targetChanges}
          @input=${d=>this._patchCondition(e,{targetChanges:d.target.value})}></ms-textfield>
      `}if(t.type==="runtime"){let r=t.entityIds.split(",")[0]?.trim()||"";return a`
        <ms-textfield label="${s("runtime_hours",i)}" type="number" .value=${t.runtimeHours}
          @input=${d=>this._patchCondition(e,{runtimeHours:d.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:t.onStates,entityId:r,onInput:d=>this._patchCondition(e,{onStates:d})})}
      `}return _}_renderUnitSelect(){let t=this._lang;return a`
      <div class="select-row">
        <label>${s("interval_unit",t)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${e=>this._intervalUnit=e.target.value}
        >
          ${["days","weeks","months","years"].map(e=>a`<option value=${e} ?selected=${e===this._intervalUnit}>${s("unit_"+e,t)}</option>`)}
        </select>
      </div>`}_toggleWeekday(t){this._weekdays=this._weekdays.includes(t)?this._weekdays.filter(e=>e!==t):[...this._weekdays,t]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(it.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let t=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!t||t<=0?null:{kind:"interval",every:t,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(t){super.updated?.(t),this._scheduleEntityPickerProbe();for(let e of t.keys())if(m._PREVIEW_RELEVANT.has(String(e))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let t=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),e=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!t||!e){this._pickerProbeStrikes=0;return}let i=(u,h,g=0)=>{if(!(!u||g>10)){(u.tagName?.toLowerCase()??"")==="ha-entity-picker"&&h.push(u);for(let b of[u.shadowRoot,u])if(b)for(let y of Array.from(b.children??[]))i(y,h,g+1)}},r=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],d=[];for(let u of r)i(u,d);let p=d.length===0||d.some(u=>u.offsetHeight===0);if(t.offsetHeight===0||p){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let t=this._open?this._previewScheduleDict():null;if(!t){this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let e=++this._previewSeq;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:t,...this._lastPerformed?{last_performed:this._lastPerformed}:{}});if(e!==this._previewSeq)return;this._schedulePreview=i.occurrences||[],this._schedulePreviewEnded=!!i.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return _;let t=this._lang,e=this.scheduleTimeEnabled&&this._scheduleTime?` ${this._scheduleTime}`:"",i=this._schedulePreview.map((d,p)=>{let u=new Date(`${d}T12:00:00`).getDay();return`${tt(u===0?6:u-1,t,"short")} ${j(d,t)}${p===0?e:""}`}).join(" \xB7 "),r=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?a`<div class="field-help">${s("schedule_preview_ontime",t)}</div>`:_;return a`
      <div class="trigger-live-hint schedule-preview">
        ${s("schedule_preview_title",t)}: ${i}${this._schedulePreviewEnded?a` <span class="field-help">${s("schedule_preview_ends",t)}</span>`:_}
        ${r}
      </div>
    `}_buildSchedule(){let t=i=>{let r=parseInt(this._calOffset,10)||0;return r&&(i.offset=Math.max(-15,Math.min(r,15))),i};if(this._scheduleType==="weekdays")return t({kind:"weekdays",weekdays:[...this._weekdays].sort((i,r)=>i-r)});if(this._scheduleType==="nth_weekday")return t({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});let e={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(e.business=!0),t(e)}_recurrenceExtras(){let t={};if(this._seasonMonths.length&&(t.season_months=[...this._seasonMonths].sort((e,i)=>e-i)),this._endsMode==="count"){let e=parseInt(this._endsCount,10);e>=1&&(t.ends={count:e})}else this._endsMode==="until"&&this._endsUntil&&(t.ends={until:this._endsUntil});return t}_toggleSeasonMonth(t){this._seasonMonths=this._seasonMonths.includes(t)?this._seasonMonths.filter(e=>e!==t):[...this._seasonMonths,t]}_renderRecurrenceExtras(){let t=this._lang;if(!(this._scheduleType==="time_based"||it.includes(this._scheduleType)))return _;let i=Qt(t);return a`
      <label class="field-label">${s("season_window_label",t)}</label>
      <div class="field-help">${s("season_window_hint",t)}</div>
      <div class="weekday-chips season-chips">
        ${i.map((r,d)=>a`
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
        ></ms-textfield>`:_}
      ${this._endsMode==="until"?a`
        <ms-textfield
          label="${s("series_end_until_label",t)}"
          type="date"
          .value=${this._endsUntil}
          @input=${r=>this._endsUntil=r.target.value}
        ></ms-textfield>`:_}
    `}_renderCalendarFields(){let t=this._lang,e=Kt(t);if(this._scheduleType==="weekdays")return a`
        <label class="field-label">${s("recurrence_on_days",t)}</label>
        <div class="weekday-chips">
          ${e.map((i,r)=>a`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(r)?"selected":""}"
              @click=${()=>this._toggleWeekday(r)}
            >${i}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let i=[["1",s("ord_1",t)],["2",s("ord_2",t)],["3",s("ord_3",t)],["4",s("ord_4",t)],["5",s("ord_5",t)],["-1",s("ord_last",t)]];return a`
        <div class="select-row">
          <label>${s("recurrence_occurrence",t)}</label>
          <select .value=${this._nth} @change=${r=>this._nth=r.target.value}>
            ${i.map(([r,d])=>a`<option value=${r} ?selected=${r===this._nth}>${d}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${s("recurrence_weekday",t)}</label>
          <select .value=${this._nthWeekday} @change=${r=>this._nthWeekday=r.target.value}>
            ${e.map((r,d)=>a`<option value=${String(d)} ?selected=${String(d)===this._nthWeekday}>${r}</option>`)}
          </select>
        </div>
        ${this._renderCalOffsetField()}`}return this._scheduleType==="day_of_month"?a`
        ${this._domLastDay?_:a`
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
        ${this._renderCalOffsetField()}`:_}_renderCalOffsetField(){let t=this._lang;return a`
      <ms-textfield
        label="${s("recurrence_offset",t)}"
        helper="${s("recurrence_offset_help",t)}"
        type="number"
        min="-15"
        max="15"
        .value=${this._calOffset}
        @input=${e=>this._calOffset=e.target.value}
      ></ms-textfield>`}_renderTriggerLiveHint(){if(this._triggerType==="compound")return _;let t=this._triggerEntityId||this._triggerEntityIds[0];if(!t||!this.hass?.states)return _;let e=this.hass.states[t];if(!e)return _;let i=this._lang,r=e.attributes?.unit_of_measurement,d=typeof r=="string"&&r?` ${r}`:"",p=this._triggerAttribute?e.attributes?.[this._triggerAttribute]:e.state,u=typeof p=="number"?p:parseFloat(String(p)),h=p!=="unknown"&&p!=="unavailable"&&p!=null&&!isNaN(u),g=y=>Number.isInteger(y)?String(y):String(Math.round(y*10)/10),b=[];if(this._triggerType==="threshold"){let y=parseFloat(this._triggerAbove),$=parseFloat(this._triggerBelow);if(isNaN(y)&&isNaN($))return _;h&&b.push(s("trigger_hint_now",i).replace("{value}",g(u)+d)),isNaN(y)||b.push(s("trigger_hint_above",i).replace("{target}",g(y)+d)),isNaN($)||b.push(s("trigger_hint_below",i).replace("{target}",g($)+d))}else if(this._triggerType==="counter"){let y=parseFloat(this._triggerTargetValue);if(isNaN(y))return _;this._triggerDeltaMode?this._taskId?b.push(s("trigger_hint_counter_delta_edit",i).replace("{target}",g(y)+d)):h?b.push(s("trigger_hint_counter_delta",i).replace("{value}",g(u)+d).replace("{due}",g(u+y)+d).replace("{target}",g(y)+d)):b.push(s("trigger_hint_counter_delta_edit",i).replace("{target}",g(y)+d)):(h&&b.push(s("trigger_hint_now",i).replace("{value}",g(u)+d)),b.push(s("trigger_hint_counter_abs",i).replace("{target}",g(y)+d)))}else if(this._triggerType==="runtime"){let y=parseFloat(this._triggerRuntimeHours);if(isNaN(y))return _;b.push(s("trigger_hint_runtime",i).replace("{hours}",g(y))),b.push(s("trigger_hint_state_now",i).replace("{value}",String(e.state)))}else if(this._triggerType==="state_change"){let y=parseInt(this._triggerTargetChanges,10)||1,$=this._triggerToState.trim();b.push(($?s("trigger_hint_state_change_to",i).replace("{state}",$):s("trigger_hint_state_change",i)).replace("{count}",String(y))),b.push(s("trigger_hint_state_now",i).replace("{value}",String(e.state)))}return b.length?a`<div class="trigger-live-hint">${b.join(" ")}</div>`:_}_renderTriggerTypeFields(){let t=this._lang;return this._triggerType==="threshold"?a`
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
          label="${s("trigger_equals",t)}"
          type="number"
          step="any"
          .value=${this._triggerEquals}
          @input=${e=>this._triggerEquals=e.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("trigger_not_equals",t)}"
          type="number"
          step="any"
          .value=${this._triggerNotEquals}
          @input=${e=>this._triggerNotEquals=e.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("for_at_least_minutes",t)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${e=>this._triggerForMinutes=e.target.value}
        ></ms-textfield>
      `:this._triggerType==="counter"?a`
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
        ${this._triggerDeltaMode?a`
              <ms-textfield
                label="${s("baseline_start_value",t)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${e=>this._triggerBaselineValue=e.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?s("baseline_start_help_edit",t):s("baseline_start_help",t)}
                ${this._taskId&&this._liveBaselineValue!=null?a`<div class="baseline-effective">
                      ${s("baseline_current_effective",t).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:_}
              </div>
            `:_}
      `:this._triggerType==="state_change"?a`
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
        <ms-textfield
          label="${s("for_at_least_minutes",t)}"
          type="number"
          min="0"
          .value=${this._triggerForMinutes}
          @input=${e=>this._triggerForMinutes=e.target.value}
        ></ms-textfield>
        <div class="field-help">${s("for_minutes_state_help",t)}</div>
      `:this._triggerType==="runtime"?a`
        <ms-textfield
          label="${s("runtime_hours",t)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${e=>this._triggerRuntimeHours=e.target.value}
        ></ms-textfield>
        ${this._renderOnStatesField({value:this._triggerOnStates,entityId:this._triggerEntityId,onInput:e=>this._triggerOnStates=e})}
        <div class="field-help">${s("runtime_on_states_help",t)}</div>
      `:_}render(){if(!this._open)return a``;let t=this._lang,e=this._taskId?s("edit_task",t):s("new_task",t);return a`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${e}</div>
        <div class="content">
          ${this._error?a`<div class="error">${this._error}</div>`:_}
          ${this._objectChoices.length>0?a`
            <div class="select-row">
              <label>${s("object",t)}</label>
              <select
                .value=${this._entryId}
                @change=${i=>{this._entryId=i.target.value,this._consumesParts={},this._loadParts(),this._loadForeignPools()}}
              >
                ${this._objectChoices.map(i=>a`<option value=${i.entry_id} ?selected=${i.entry_id===this._entryId}>${i.name}</option>`)}
              </select>
            </div>
          `:_}
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
              ${Ot.map(i=>a`<option value=${i} ?selected=${i===this._type}>${s(i,t)}</option>`)}
            </select>
          </div>
          ${this._type==="reading"?a`
                <ms-textfield
                  label="${s("reading_unit_label",t)}"
                  .value=${this._readingUnit}
                  @input=${i=>this._readingUnit=i.target.value}
                ></ms-textfield>
                <div class="field-help">${s("reading_unit_help",t)}</div>
              `:_}
          ${this._partsLoadFailed?a`<div class="field-help parts-load-failed">${s("parts_load_failed",t)}</div>`:_}
          ${this.parts.length||this._foreignOwners.length?a`
                <div class="field">
                  <label>${s("consumes_parts_label",t)}</label>
                  ${this.parts.map(i=>this._renderConsumesRow(i))}
                  ${this._foreignOwners.length?a`
                        <details class="shared-pools" ?open=${this._hasForeignPick}>
                          <summary>${s("shared_parts_other_objects",t)}</summary>
                          <div class="field-help">${s("shared_parts_help",t)}</div>
                          ${this._foreignOwners.map(i=>a`
                              <div class="shared-pool-owner">${i.name}</div>
                              ${i.parts.map(r=>this._renderConsumesRow(r,i.entry_id))}
                            `)}
                        </details>
                      `:_}
                </div>
              `:_}
          <div class="select-row">
            <label>${s("priority",t)}</label>
            <select
              .value=${this._priority}
              @change=${i=>this._priority=i.target.value}
            >
              ${jt.map(i=>a`<option value=${i} ?selected=${i===this._priority}>${s("priority_"+i,t)}</option>`)}
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
              ${Dt.map(i=>a`<option value=${i} ?selected=${i===this._scheduleType}>${s(i,t)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?a`
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
                ${this.scheduleTimeEnabled?a`
                  <ms-textfield
                    label="${s("schedule_time_optional",t)}"
                    type="time"
                    .value=${this._scheduleTime}
                    helper="${s("schedule_time_help",t)}"
                    @input=${i=>this._scheduleTime=i.target.value}
                  ></ms-textfield>
                `:_}
              `:_}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?a`
                <ms-textfield
                  label="${s("due_date",t)}"
                  type="date"
                  .value=${this._dueDate}
                  @input=${i=>this._dueDate=i.target.value}
                ></ms-textfield>
              `:_}
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
          ${this.checklistsEnabled?a`
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
          `:_}
          ${this._renderPhasesEditor(t)}
          <h3>${s("require_on_completion",t)}</h3>
          <div class="required-completion">
            ${vt.map(i=>a`
              <label class="req-option">
                <input
                  type="checkbox"
                  .checked=${this._requiredCompletion.includes(i)}
                  @change=${r=>this._toggleRequired(i,r.target.checked)}
                />
                <span>${s(Y[i],t)}</span>
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
              @change=${i=>{let r=i.target.value;this._responsibleUserId=r||null}}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${s("no_user_assigned",t)}</option>
              ${this._availableUsers.map(i=>a`<option value=${i.id} ?selected=${i.id===this._responsibleUserId}>${i.name}</option>`)}
            </select>
          </div>
          ${this._availableUsers.length>=2?a`
            <div class="field">
              <label>${s("shared_with",t)}</label>
              <div class="field-help">${s("shared_with_help",t)}</div>
              <div class="assignee-pool">
                ${this._availableUsers.map(i=>a`
                  <label class="pool-item">
                    <input type="checkbox"
                      .checked=${this._assigneePool.includes(i.id)}
                      @change=${()=>this._toggleAssignee(i.id)} />
                    <span>${i.name}</span>
                  </label>`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?a`
              <div class="select-row">
                <label>${s("rotation_strategy",t)}</label>
                <select
                  .value=${this._rotationStrategy}
                  @change=${i=>this._rotationStrategy=i.target.value}
                >
                  <option value="" ?selected=${!this._rotationStrategy}>${s("rotation_none",t)}</option>
                  ${["round_robin","least_completed","random"].map(i=>a`<option value=${i} ?selected=${i===this._rotationStrategy}>${s("rotation_"+i,t)}</option>`)}
                </select>
              </div>`:_}
          `:_}
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"?a`
            ${this._entityPickerFallback?a`
              <ms-textfield
                label="${s("environmental_entity_optional",t)}"
                helper="${s("environmental_entity_helper",t)}"
                .value=${this._environmentalEntity}
                @input=${i=>this._environmentalEntity=i.target.value.trim()}
              ></ms-textfield>
            `:a`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:mt,device_class:gt}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>s("environmental_entity_optional",t)}
              .computeHelper=${()=>s("environmental_entity_helper",t)}
              @value-changed=${i=>{this._environmentalEntity=(i.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(t):_}
          `:_}
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
          ${this._availableTags.length>0?a`
              <div class="select-row">
                <label>${s("nfc_tag_id_optional",t)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${i=>this._nfcTagId=i.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${s("no_nfc_tag",t)}</option>
                  ${this._availableTags.map(i=>a`<option value=${i.id} ?selected=${i.id===this._nfcTagId}>${i.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${s("nfc_tags_refresh",t)}">↻</button>
              </div>
            `:a`
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
    .phase-remove {
      --mdc-icon-button-size: 36px;
      color: var(--secondary-text-color);
    }
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
  `,o([v({attribute:!1})],m.prototype,"hass",2),o([v({type:Boolean,attribute:"checklists-enabled"})],m.prototype,"checklistsEnabled",2),o([v({type:Boolean,attribute:"schedule-time-enabled"})],m.prototype,"scheduleTimeEnabled",2),o([v({type:Boolean,attribute:"completion-actions-enabled"})],m.prototype,"completionActionsEnabled",2),o([v({type:Number,attribute:"default-warning-days"})],m.prototype,"defaultWarningDays",2),o([l()],m.prototype,"parts",2),o([l()],m.prototype,"_foreignOwners",2),o([l()],m.prototype,"_open",2),o([l()],m.prototype,"_entityPickerFallback",2),o([l()],m.prototype,"_loading",2),o([l()],m.prototype,"_error",2),o([l()],m.prototype,"_entryId",2),o([l()],m.prototype,"_taskId",2),o([l()],m.prototype,"_objectChoices",2),o([l()],m.prototype,"_name",2),o([l()],m.prototype,"_type",2),o([l()],m.prototype,"_scheduleType",2),o([l()],m.prototype,"_intervalDays",2),o([l()],m.prototype,"_intervalUnit",2),o([l()],m.prototype,"_dueDate",2),o([l()],m.prototype,"_warningDays",2),o([l()],m.prototype,"_earliestCompletionDays",2),o([l()],m.prototype,"_intervalAnchor",2),o([l()],m.prototype,"_weekdays",2),o([l()],m.prototype,"_nth",2),o([l()],m.prototype,"_nthWeekday",2),o([l()],m.prototype,"_domDay",2),o([l()],m.prototype,"_domLastDay",2),o([l()],m.prototype,"_domBusiness",2),o([l()],m.prototype,"_calOffset",2),o([l()],m.prototype,"_seasonMonths",2),o([l()],m.prototype,"_endsMode",2),o([l()],m.prototype,"_endsCount",2),o([l()],m.prototype,"_endsUntil",2),o([l()],m.prototype,"_schedulePreview",2),o([l()],m.prototype,"_schedulePreviewEnded",2),o([l()],m.prototype,"_notes",2),o([l()],m.prototype,"_documentationUrl",2),o([l()],m.prototype,"_customIcon",2),o([l()],m.prototype,"_priority",2),o([l()],m.prototype,"_labels",2),o([l()],m.prototype,"_enabled",2),o([l()],m.prototype,"_triggerEntityId",2),o([l()],m.prototype,"_triggerEntityIds",2),o([l()],m.prototype,"_triggerEntityLogic",2),o([l()],m.prototype,"_triggerAttribute",2),o([l()],m.prototype,"_triggerType",2),o([l()],m.prototype,"_triggerAbove",2),o([l()],m.prototype,"_triggerBelow",2),o([l()],m.prototype,"_triggerEquals",2),o([l()],m.prototype,"_triggerNotEquals",2),o([l()],m.prototype,"_triggerForMinutes",2),o([l()],m.prototype,"_triggerCombinator",2),o([l()],m.prototype,"_triggerTargetValue",2),o([l()],m.prototype,"_triggerDeltaMode",2),o([l()],m.prototype,"_triggerBaselineValue",2),o([l()],m.prototype,"_liveBaselineValue",2),o([l()],m.prototype,"_autoCompleteOnRecovery",2),o([l()],m.prototype,"_triggerFromState",2),o([l()],m.prototype,"_triggerToState",2),o([l()],m.prototype,"_triggerTargetChanges",2),o([l()],m.prototype,"_triggerRuntimeHours",2),o([l()],m.prototype,"_triggerOnStates",2),o([l()],m.prototype,"_compoundLogic",2),o([l()],m.prototype,"_compoundConditions",2),o([l()],m.prototype,"_suggestedAttributes",2),o([l()],m.prototype,"_availableAttributes",2),o([l()],m.prototype,"_entityDomain",2),o([l()],m.prototype,"_lastPerformed",2),o([l()],m.prototype,"_nfcTagId",2),o([l()],m.prototype,"_readingUnit",2),o([l()],m.prototype,"_consumesParts",2),o([l()],m.prototype,"_partsLoadFailed",2),o([l()],m.prototype,"_availableTags",2),o([l()],m.prototype,"_responsibleUserId",2),o([l()],m.prototype,"_assigneePool",2),o([l()],m.prototype,"_rotationStrategy",2),o([l()],m.prototype,"_availableUsers",2),o([l()],m.prototype,"_checklistText",2),o([l()],m.prototype,"_phaseDefs",2),o([l()],m.prototype,"_phaseSeq",2),o([l()],m.prototype,"_requiredCompletion",2),o([l()],m.prototype,"_scheduleTime",2),o([l()],m.prototype,"_actionService",2),o([l()],m.prototype,"_actionTargetEntity",2),o([l()],m.prototype,"_actionData",2),o([l()],m.prototype,"_actionDataJsonFallback",2),o([l()],m.prototype,"_actionTesting",2),o([l()],m.prototype,"_actionTestResult",2),o([l()],m.prototype,"_actionTestError",2),o([l()],m.prototype,"_qcNotes",2),o([l()],m.prototype,"_qcCost",2),o([l()],m.prototype,"_qcDuration",2),o([l()],m.prototype,"_qcFeedback",2),o([l()],m.prototype,"_environmentalEntity",2),o([l()],m.prototype,"_environmentalAttribute",2),o([l()],m.prototype,"_adaptiveEnabled",2),o([l()],m.prototype,"_adaptiveAlpha",2),o([l()],m.prototype,"_adaptiveMin",2),o([l()],m.prototype,"_adaptiveMax",2),o([l()],m.prototype,"_adaptiveSeasonal",2),o([l()],m.prototype,"_adaptivePrediction",2),o([l()],m.prototype,"_conditionAttrOptions",2);var st=m;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",st);var f=class extends E{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.restockDefault=null;this.restockUnitCost=null;this.currencySymbol="";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photoDocId="";this._photoPreview="";this._photoUploading=!1;this._readingValue="";this._restockQty="";this._completedAt="";this._usedParts={};this.checklistPrefill={}}open(){this._open||(this._open=!0,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((t,e)=>[String(e),!!this.checklistPrefill[t]]).filter(([,t])=>t)),this._feedback="needed",this._photoDocId="",this._photoPreview="",this._photoUploading=!1,this._readingValue="",this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(t=>[H(t),{...t}])))}_toggleCheck(t){let e=String(t);this._checklistState={...this._checklistState,[e]:!this._checklistState[e]}}_setFeedback(t){this._feedback=t}async _onPhotoInput(t){let e=t.target,i=e.files?.[0];if(e.value="",!!i){this._photoUploading=!0,this._error="";try{let r=new FormData;r.append("entry_id",this.entryId),r.append("tags","photo"),r.append("file",i,i.name);let d=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${this.hass.auth?.data?.access_token??""}`},body:r});if(!d.ok){this._error=d.status===413?s("doc_too_large",this.lang):s("doc_upload_failed",this.lang);return}let p=await d.json();p.id&&(this._photoDocId=p.id,this._photoPreview=URL.createObjectURL(i))}catch{this._error=s("doc_upload_failed",this.lang)}finally{this._photoUploading=!1}}}_removePhoto(){this._photoPreview&&URL.revokeObjectURL(this._photoPreview),this._photoDocId="",this._photoPreview=""}async _complete(){this._loading=!0,this._error="";try{let t={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(t.notes=this._notes),this._cost){let e=parseFloat(this._cost);!isNaN(e)&&e>=0&&(t.cost=e)}if(this._duration){let e=parseInt(this._duration,10);!isNaN(e)&&e>=0&&(t.duration=e)}if(this.checklist.length>0&&(t.checklist_state=this._checklistState),this.adaptiveEnabled&&(t.feedback=this._feedback),this._photoDocId&&(t.photo_doc_id=this._photoDocId),this._completedAt){if(new Date(this._completedAt).getTime()>Date.now()){this._error=s("completed_at_future_error",this.lang),this._loading=!1;return}t.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this._readingValue!==""){let e=parseFloat(this._readingValue);isNaN(e)||(t.reading_value=e)}if(this.restockDefault!==null&&this._restockQty!==""){let e=parseFloat(this._restockQty);!isNaN(e)&&e>=1&&(t.restock_quantity=e)}this.parts.length>0&&(t.used_parts=Object.values(this._usedParts).filter(e=>Number.isFinite(e.quantity)&&e.quantity>0).map(e=>e.entry_id?{part_id:e.part_id,quantity:e.quantity,entry_id:e.entry_id}:{part_id:e.part_id,quantity:e.quantity})),await this.hass.connection.sendMessagePromise(t),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(t){this._error=I(t,this.lang,s("save_error",this.lang))}finally{this._loading=!1}}get _missingRequired(){let t={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photoDocId!=="",user:!!this.hass?.user};return this.requiredFields.filter(e=>!t[e])}_req(t){return this.requiredFields.includes(t)?a`<span class="req-mark" aria-hidden="true">*</span>`:_}_partsCostSuggestion(){if(this.restockDefault!==null){let i=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(i)||i<=0?null:Math.round(this.restockUnitCost*i*100)/100}if(!this.parts.length)return null;let t=0,e=!1;for(let i of Object.values(this._usedParts)){let r=this.parts.find(d=>H({part_id:d.id,entry_id:d.entry_id})===H(i));r?.cost!=null&&(t+=r.cost*(i.quantity||1),e=!0)}return e?Math.round(t*100)/100:null}_renderCostSuggestion(t){if(this._cost.trim()!=="")return _;let e=this._partsCostSuggestion();if(e==null||e<=0)return _;let i=`${e.toFixed(2)}${this.currencySymbol?` ${this.currencySymbol}`:""}`;return a`<button
      type="button"
      class="cost-suggestion"
      @click=${()=>this._cost=e.toFixed(2)}
    >${s("cost_from_parts",t).replace("{amount}",i)}</button>`}_close(){this._open=!1}render(){if(!this._open)return a``;let t=this.lang||this.hass?.language||"en";return a`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${s("complete_title",t)}${this.taskName}</div>
        ${this.phaseLabel?a`<div class="phase-line">${s("phase_current",t)}: ${this.phaseLabel}</div>`:_}
        <div class="content">
          ${this._error?a`<div class="error">${this._error}</div>`:_}
          ${this.checklist.length>0?a`
            <div class="checklist-section">
              <label class="checklist-label">${s("checklist",t)}</label>
              ${this.checklist.map((e,i)=>a`
                <label class="checklist-item" @click=${()=>this._toggleCheck(i)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(i)]} />
                  <span>${e}</span>
                </label>
              `)}
            </div>
          `:_}
          ${this.taskType==="reading"?a`
              <label class="field">
                <span class="field-label">${s("reading_value_label",t)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${e=>this._readingValue=e.target.value} />
              </label>`:_}
          ${this.parts.length?a`<div class="used-parts">
                <span class="field-label">${s("complete_parts_used",t)}</span>
                ${this.parts.map(e=>{let i=H({part_id:e.id,entry_id:e.entry_id}),r=this._usedParts[i],d=r!==void 0,p=e.entry_id?{part_id:e.id,quantity:1,entry_id:e.entry_id}:{part_id:e.id,quantity:1};return a`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${d}
                        @change=${u=>{let h={...this._usedParts};u.target.checked?h[i]=h[i]||p:delete h[i],this._usedParts=h}} />
                      <span
                        >${e.name}${e.owner_name?a`<span class="used-part-owner"> (${e.owner_name})</span>`:_}${e.stock!==null&&e.stock!==void 0?` (${e.stock}${e.unit?" "+e.unit:""})`:""}</span
                      >
                    </label>
                    ${d?a`<input class="used-part-qty" type="number" min="0.01" max="999" step="0.01"
                          .value=${String(r.quantity)}
                          @input=${u=>{let h=parseFloat(u.target.value);this._usedParts={...this._usedParts,[i]:{...p,quantity:Number.isFinite(h)&&h>=.01?h:1}}}} />`:_}
                  </div>`})}
              </div>`:this.consumesInfo.length?a`<div class="consumes-hint">
                  ${this.consumesInfo.map(e=>a`<div>${e}</div>`)}
                </div>`:_}
          ${this.restockDefault!==null?a`
              <label class="field">
                <span class="field-label">${s("restock_quantity_label",t)}</span>
                <input type="number" step="0.01" min="0.01" class="field-input"
                  .value=${this._restockQty}
                  @input=${e=>this._restockQty=e.target.value} />
              </label>`:_}
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
          <label class="field">
            <span class="field-label">${s("completed_at_optional",t)}</span>
            <input type="datetime-local" class="field-input"
              max=${new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,16)}
              .value=${this._completedAt}
              @change=${e=>this._completedAt=e.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${s("completion_photo_optional",t)}${this._req("photo")}</span>
            ${this._photoPreview?a`
                <div class="photo-preview">
                  <img src=${this._photoPreview} alt="" />
                  <button type="button" class="photo-remove" @click=${this._removePhoto}
                    title="${s("remove",t)}">✕</button>
                </div>`:a`
                <label class="photo-pick">
                  <ha-icon icon="mdi:camera"></ha-icon>
                  <span>${this._photoUploading?s("uploading",t):s("add_photo",t)}</span>
                  <input type="file" accept="image/*" capture="environment"
                    ?disabled=${this._photoUploading}
                    @change=${this._onPhotoInput} />
                </label>`}
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
          `:_}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",t)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._missingRequired.length>0}
            title=${this._missingRequired.length?this._missingRequired.map(e=>s("err_required",t).replace("{field}",s(Y[e]??e,t))).join(" \xB7 "):""}
          >
            ${this._loading?s("completing",t):s("complete",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};f.styles=[ht,w`
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
  `],o([v({attribute:!1})],f.prototype,"hass",2),o([v()],f.prototype,"entryId",2),o([v()],f.prototype,"taskId",2),o([v()],f.prototype,"taskName",2),o([v()],f.prototype,"lang",2),o([v({type:Array})],f.prototype,"checklist",2),o([v({type:Boolean})],f.prototype,"adaptiveEnabled",2),o([v()],f.prototype,"taskType",2),o([v()],f.prototype,"readingUnit",2),o([v({attribute:!1})],f.prototype,"restockDefault",2),o([v({attribute:!1})],f.prototype,"restockUnitCost",2),o([v()],f.prototype,"currencySymbol",2),o([v({attribute:!1})],f.prototype,"parts",2),o([v({attribute:!1})],f.prototype,"consumesParts",2),o([v({type:Array})],f.prototype,"consumesInfo",2),o([v({type:Array})],f.prototype,"requiredFields",2),o([v()],f.prototype,"phaseLabel",2),o([l()],f.prototype,"_open",2),o([l()],f.prototype,"_notes",2),o([l()],f.prototype,"_cost",2),o([l()],f.prototype,"_duration",2),o([l()],f.prototype,"_loading",2),o([l()],f.prototype,"_error",2),o([l()],f.prototype,"_checklistState",2),o([l()],f.prototype,"_feedback",2),o([l()],f.prototype,"_photoDocId",2),o([l()],f.prototype,"_photoPreview",2),o([l()],f.prototype,"_photoUploading",2),o([l()],f.prototype,"_readingValue",2),o([l()],f.prototype,"_restockQty",2),o([l()],f.prototype,"_completedAt",2),o([l()],f.prototype,"_usedParts",2),o([v({attribute:!1})],f.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",f);var C=class extends E{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal=""}get _lang(){return S(this.hass)}openEdit(t){this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._loadPartOptions()}async _loadPartOptions(){let t=this._draft;if(t)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"}),i=[];for(let d of e.parts||[]){let p=d.entry_id===t.entry_id,u=d.consumers.some(h=>h.entry_id===t.entry_id&&h.task_id===t.task_id);!p&&!u||i.push({part_id:d.part_id,name:d.name,entry_id:d.entry_id,foreign:!p,object_name:d.object_name})}for(let d of t.used_parts||[]){let p=d.entry_id||t.entry_id;i.some(u=>u.part_id===d.part_id&&u.entry_id===p)||i.push({part_id:d.part_id,name:d.name||d.part_id,entry_id:p,foreign:p!==t.entry_id,object_name:null})}let r={};for(let d of t.used_parts||[])r[`${d.entry_id||t.entry_id}:${d.part_id}`]=d.quantity??1;this._partOptions=i,this._partQty=r,this._partQtyOriginal=this._partSelectionKey()}catch{this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,t])=>t>0).sort(([t],[e])=>t.localeCompare(e)))}close(){this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null}_set(t,e){this._draft&&(this._draft={...this._draft,[t]:e})}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="";try{let t={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(t.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(t.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(t.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(t.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(t.completed_by=this._draft.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(t.used_parts=(this._partOptions||[]).filter(i=>(this._partQty[`${i.entry_id}:${i.part_id}`]||0)>0).map(i=>({part_id:i.part_id,quantity:this._partQty[`${i.entry_id}:${i.part_id}`],...i.foreign?{entry_id:i.entry_id}:{}}))),Object.keys(t).filter(i=>!["type","entry_id","task_id","original_timestamp"].includes(i)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(t),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=I(t,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return _;let t=this._lang,e=this._draft;return a`
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
            @change=${i=>{let r=i.target.value;this._set("timestamp",r.length===16?`${r}:00`:r)}} />
        </label>
        <label>
          <span>${s("notes_label",t)}</span>
          <textarea
            rows="3"
            @input=${i=>{let r=i.target.value;this._set("notes",r||null)}}
            .value=${e.notes??""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${s("cost",t)||"Cost"}</span>
            <input type="number" min="0" step="0.01"
              .value=${e.cost!=null?String(e.cost):""}
              @input=${i=>{let r=i.target.value;this._set("cost",r?Number(r):null)}} />
          </label>
          <label>
            <span>${s("duration",t)||"Duration (min)"}</span>
            <input type="number" min="0"
              .value=${e.duration!=null?String(e.duration):""}
              @input=${i=>{let r=i.target.value;this._set("duration",r?Number(r):null)}} />
          </label>
        </div>
        ${this._partOptions&&this._partOptions.length>0?a`
          <div class="parts-block">
            <span class="parts-title">${s("complete_parts_used",t)}</span>
            ${this._partOptions.map(i=>{let r=`${i.entry_id}:${i.part_id}`,d=this._partQty[r]||0;return a`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${d>0}
                    @change=${p=>{let u=p.target.checked;this._partQty={...this._partQty,[r]:u?1:0}}} />
                  <span class="part-label">${i.name}${i.foreign&&i.object_name?` (${i.object_name})`:""}</span>
                  ${d>0?a`
                    <input class="part-qty" type="number" min="0.01" max="999" step="0.01"
                      .value=${String(d)}
                      @input=${p=>{let u=parseFloat(p.target.value);!isNaN(u)&&u>0&&(this._partQty={...this._partQty,[r]:u})}} />
                  `:_}
                </label>
              `})}
          </div>
        `:_}
        ${this._error?a`<div class="error">${this._error}</div>`:_}
        <div class="actions">
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${s("cancel",t)||"Cancel"}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?s("saving",t)||"Saving\u2026":s("save",t)||"Save"}
          </button>
        </div>
      </div>
    `}};C.styles=w`
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
  `,o([v({attribute:!1})],C.prototype,"hass",2),o([l()],C.prototype,"_open",2),o([l()],C.prototype,"_saving",2),o([l()],C.prototype,"_error",2),o([l()],C.prototype,"_draft",2),o([l()],C.prototype,"_partOptions",2),o([l()],C.prototype,"_partQty",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",C);function yt(n,c,t){let e=new Blob([n],{type:t}),i=URL.createObjectURL(e),r=document.createElement("a");r.href=i,r.download=c,r.target="_blank",r.rel="noopener",r.style.display="none",document.body.appendChild(r),r.dispatchEvent(new MouseEvent("click")),document.body.removeChild(r),setTimeout(()=>URL.revokeObjectURL(i),6e4)}function U(n){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function bt(n){return!n.startsWith("data:image/svg+xml,")&&!n.startsWith("data:image/png;base64,")?"":U(n)}function Yt(n){return n.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var A=class extends E{constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(t,e){this._entryId=t,this._taskId=null,this._objectName=e,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}openForTask(t,e,i,r){this._entryId=t,this._taskId=e,this._objectName=i,this._taskName=r,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}async _generate(){let t=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null;try{let e={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(e.task_id=this._taskId);let i=[this.hass.connection.sendMessagePromise({...e,action:"view"})];this._taskId&&i.push(this.hass.connection.sendMessagePromise({...e,action:"complete"}));let r=await Promise.all(i);if(t!==this._generateSeq)return;this._viewResult=r[0],r.length>1&&(this._completeResult=r[1])}catch(e){if(t!==this._generateSeq)return;let i=e?.code,r=e?.message;this._error=i==="no_url"||typeof r=="string"&&r.includes("No Home Assistant URL")?s("qr_error_no_url",this.lang):s("qr_error",this.lang)}finally{t===this._generateSeq&&(this._loading=!1)}}_setUrlMode(t){this._urlMode!==t&&(this._urlMode=t,this._generate())}_print(){if(!this._viewResult)return;let t=this._viewResult,e=t.label.task_name?`${t.label.object_name} \u2014 ${t.label.task_name}`:t.label.object_name,i=[t.label.manufacturer,t.label.model].filter(Boolean).join(" "),r=window.open("","_blank","width=600,height=500");if(!r)return;let d=this.lang||"en",p=U(e),u=U(i),h=!!this._completeResult,g=U(s("qr_action_view",d)),b=U(s("qr_action_complete",d));r.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
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
  .qr-col img{width:${h?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${p}</h2>
${u?`<div class="sub">${u}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${bt(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${g}</div>
  </div>
  ${h?`<div class="qr-col">
    <img src="${bt(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${b}</div>
  </div>`:""}
</div>
<div class="url">${U(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),r.document.close()}_downloadSvg(t,e){let i=decodeURIComponent(t.svg_data_uri.replace("data:image/svg+xml,","")),r=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;yt(i,`qr-${Yt(r)}-${e}.svg`,"image/svg+xml")}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._error="",this._loading=!1}render(){if(!this._open)return a``;let t=this.lang||this.hass?.language||"en",e=this._taskName?`${s("qr_code",t)}: ${this._objectName} \u2014 ${this._taskName}`:`${s("qr_code",t)}: ${this._objectName}`,i=!!this._viewResult;return a`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${e}</div>
        <div class="content">
          ${this._loading?a`<div class="loading">${s("qr_generating",t)}</div>`:this._error?a`<div class="error">${this._error}</div>`:i?a`
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
                          `:_}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  `:_}
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
  `,o([v({attribute:!1})],A.prototype,"hass",2),o([v()],A.prototype,"lang",2),o([l()],A.prototype,"_open",2),o([l()],A.prototype,"_loading",2),o([l()],A.prototype,"_error",2),o([l()],A.prototype,"_viewResult",2),o([l()],A.prototype,"_completeResult",2),o([l()],A.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",A);function $t(n){let c=n.getFullYear(),t=String(n.getMonth()+1).padStart(2,"0"),e=String(n.getDate()).padStart(2,"0");return`${c}-${t}-${e}`}function Gt(n,c){if(c<=0)return 0;let t=typeof n=="number"&&Number.isFinite(n)?Math.trunc(n):0;return t<0?0:t%c}function Zt(n){return!!(n?.phases&&n.phase_sequence&&n.phase_sequence.length>0)}function rt(n){if(!n||!Zt(n))return null;let c=n.phase_sequence,t=Gt(n.phase_cursor,c.length),e=c[t],i=n.phases?.[e];return i?{id:e,name:i.name,index:t,count:c.length,notes:i.notes,checklist:i.checklist!==void 0?i.checklist:n.checklist??[],consumesParts:i.consumes_parts!==void 0?i.consumes_parts:n.consumes_parts??[],requiredFields:i.required_completion_fields!==void 0?i.required_completion_fields:n.required_completion_fields??[]}:null}function G(n){let c=rt(n);return c?`${c.index+1}/${c.count} \xB7 ${c.name}`:""}function xt(n,c){let t=n.interval_analysis,e=t?.weibull_beta,i=t?.weibull_eta;if(e==null||i==null||i<=0)return _;let r=n.interval_days??0,d=n.suggested_interval??r;return a`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${s("weibull_reliability_curve",c)}
        ${Jt(e,c)}
      </div>
      ${Xt(e,i,r,d,c)}
      ${te(t,c)}
      ${t?.confidence_interval_low!=null?ee(t,n,c):_}
    </div>
  `}function Jt(n,c){let t,e,i;return n<.8?(t="early_failures",e="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):n<=1.2?(t="random_failures",e="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):n<=3.5?(t="wear_out",e="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(t="highly_predictable",e="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),a`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${e}"></ha-svg-icon>
      ${s(i,c)} (\u03B2=${n.toFixed(2)})
    </span>
  `}function Xt(n,c,t,e,i){let $=Math.max(t,e,c,1)*1.3,L=50,N=[];for(let P=0;P<=L;P++){let q=P/L*$,Rt=1-Math.exp(-Math.pow(q/c,n)),Nt=32+q/$*260,Mt=136-Rt*128;N.push([Nt,Mt])}let V=N.map(([P,q])=>`${P.toFixed(1)},${q.toFixed(1)}`).join(" "),X="M32,136 "+N.map(([P,q])=>`L${P.toFixed(1)},${q.toFixed(1)}`).join(" ")+` L${N[L][0].toFixed(1)},136 Z`,D=32+t/$*260,B=1-Math.exp(-Math.pow(t/c,n)),W=136-B*128,qt=((1-B)*100).toFixed(0),nt=32+e/$*260,Ht=[0,.25,.5,.75,1];return a`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_weibull",i)}">
        ${Ht.map(P=>{let q=136-P*128;return z`
            <line x1="${32}" y1="${q.toFixed(1)}" x2="${292}" y2="${q.toFixed(1)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${P===.5?"4,3":_}" />
            <text x="${28}" y="${(q+3).toFixed(1)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${(P*100).toFixed(0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round($/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round($)}</text>

        <path d="${X}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${V}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?z`
          <line x1="${D.toFixed(1)}" y1="${8}" x2="${D.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${D.toFixed(1)}" cy="${W.toFixed(1)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${(D+4).toFixed(1)}" y="${(W-6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${qt}%</text>
        `:_}

        ${e>0&&e!==t?z`
          <line x1="${nt.toFixed(1)}" y1="${8}" x2="${nt.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:_}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${s("weibull_failure_probability",i)}</span>
      ${t>0?a`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${s("current_interval_marker",i)}</span>`:_}
      ${e>0&&e!==t?a`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${s("recommended_marker",i)}</span>`:_}
    </div>
  `}function te(n,c){return a`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${s("characteristic_life",c)}</span>
        <span class="weibull-info-value">${Math.round(n.weibull_eta)} ${s("days",c)}</span>
      </div>
      ${n.weibull_r_squared!=null?a`
        <div class="weibull-info-item">
          <span>${s("weibull_r_squared",c)}</span>
          <span class="weibull-info-value">${n.weibull_r_squared.toFixed(3)}</span>
        </div>
      `:_}
    </div>
  `}function ee(n,c,t){let e=n.confidence_interval_low,i=n.confidence_interval_high,r=c.suggested_interval??c.interval_days??0,d=c.interval_days??0,p=Math.max(0,e-5),h=i+5-p,g=(e-p)/h*100,b=(i-e)/h*100,y=(r-p)/h*100,$=d>0?(d-p)/h*100:-1;return a`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${s("confidence_interval",t)}: ${r} ${s("days",t)} (${e}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${g.toFixed(1)}%;width:${b.toFixed(1)}%"></div>
        ${$>=0?a`<div class="confidence-marker current" style="left:${$.toFixed(1)}%"></div>`:_}
        <div class="confidence-marker recommended" style="left:${y.toFixed(1)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${s("confidence_conservative",t)} (${e}${s("days",t).charAt(0)})</span>
        <span class="confidence-text high">${s("confidence_aggressive",t)} (${i}${s("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function kt(n,c,t){let e=n.degradation_trend!=null&&n.degradation_trend!=="insufficient_data",i=n.days_until_threshold!=null,r=n.environmental_factor!=null&&n.environmental_factor!==1;if(!e&&!i&&!r)return _;let d=n.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":n.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return a`
    <div class="prediction-section">
      ${n.sensor_prediction_urgency?a`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${s("sensor_prediction_urgency",c).replace("{days}",String(Math.round(n.days_until_threshold||0)))}
        </div>
      `:_}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${s("sensor_prediction",c)}
      </div>
      <div class="prediction-grid">
        ${e?a`
          <div class="prediction-item">
            <ha-svg-icon path="${d}"></ha-svg-icon>
            <span class="prediction-label">${s("degradation_trend",c)}</span>
            <span class="prediction-value ${n.degradation_trend}">${s("trend_"+n.degradation_trend,c)}</span>
            ${n.degradation_rate!=null?a`<span class="prediction-rate">${n.degradation_rate>0?"+":""}${Math.abs(n.degradation_rate)>=10?Math.round(n.degradation_rate).toLocaleString():n.degradation_rate.toFixed(1)} ${n.trigger_entity_info?.unit_of_measurement||""}/${s("day_short",c)}</span>`:_}
          </div>
        `:_}
        ${i?a`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${s("days_until_threshold",c)}</span>
            <span class="prediction-value prediction-days${n.days_until_threshold===0?" exceeded":n.sensor_prediction_urgency?" urgent":""}">${n.days_until_threshold===0?s("threshold_exceeded",c):"~"+Math.round(n.days_until_threshold)+" "+s("days",c)}</span>
            ${n.threshold_prediction_date?a`<span class="prediction-date">${j(n.threshold_prediction_date,c)}</span>`:_}
            ${n.threshold_prediction_confidence?a`<span class="confidence-dot ${n.threshold_prediction_confidence}"></span>`:_}
          </div>
        `:_}
        ${r&&t.environmental?a`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${s("environmental_adjustment",c)}</span>
            <span class="prediction-value">${n.environmental_factor.toFixed(2)}x</span>
            ${n.environmental_entity?a`<span class="prediction-entity entity-link" @click=${p=>pt(p,n.environmental_entity)}>${n.environmental_entity}</span>`:_}
          </div>
        `:_}
      </div>
    </div>
  `}function wt(n,c,t,e){let i=Math.max(n||1,c);return a`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${s("current",e)}: ${n??"\u2014"} ${n!=null?s("days",e):""}
        </div>
        <div class="interval-visual current"
          style="width: ${n!=null?Math.min(n/i*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${s("recommended",e)}: ${c} ${s("days",e)}
          <span class="confidence-badge ${t}">${s(`confidence_${t}`,e)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(c/i*100,100)}%"></div>
      </div>
    </div>
  `}var Et=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function It(n,c,t){if(!t.seasonal||!n.seasonal_factor||n.seasonal_factor===1)return _;let e=Et.map(p=>s(p,c)),i=new Date().getMonth(),r=n.seasonal_factors||n.interval_analysis?.seasonal_factors||null,d=r&&r.length===12?r:e.map((p,u)=>{let h=n.seasonal_factor||1,g=Math.sin((u-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,h+g))});return a`
    <div class="seasonal-card-compact">
      <h4>${s("seasonal_awareness",c)}</h4>
      <div class="seasonal-mini-chart">
        ${d.map((p,u)=>{let h=p*40,g=p<.9?"low":p>1.1?"high":"normal";return a`
            <div class="seasonal-bar ${g} ${u===i?"current":""}"
                 style="height: ${h}px"
                 title="${e[u]}: ${p.toFixed(2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${s("shorter",c)||"K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${s("normal",c)||"Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${s("longer",c)||"L\xE4nger"}</span>
      </div>
    </div>
  `}function Tt(n,c){return ie(n,c)}function ie(n,c){let t=n.seasonal_factors??n.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return _;let e=n.interval_analysis?.seasonal_reason,i=new Date().getMonth(),r=300,d=100,p=8,h=d-p-4,g=Math.max(...t,1.5),b=r/12,y=b*.65,$=p+h-1/g*h;return a`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${s("seasonal_chart_title",c)}
        ${e?a`<span class="source-tag">${e==="learned"?s("seasonal_learned",c):s("seasonal_manual",c)}</span>`:_}
      </div>
      <svg viewBox="0 0 ${r} ${d}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_seasonal",c)}">
        <line x1="0" y1="${$.toFixed(1)}" x2="${r}" y2="${$.toFixed(1)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((L,N)=>{let V=L/g*h,X=N*b+(b-y)/2,D=p+h-V,B=N===i,W=L<1?"var(--success-color, #4caf50)":L>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return z`
            <rect x="${X.toFixed(1)}" y="${D.toFixed(1)}"
              width="${y.toFixed(1)}" height="${V.toFixed(1)}"
              fill="${W}" opacity="${B?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${Et.map((L,N)=>a`<span class="seasonal-label ${N===i?"active-month":""}">${s(L,c)}</span>`)}
      </div>
    </div>
  `}var k=class extends E{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._featuresLoaded=!1}get _lang(){return S(this.hass)}async openFor(t,e){this._entryId=t,this._taskId=e,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=$t(new Date),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){if(!this._featuresLoaded)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});t?.features&&(this._features={...this._features,...t.features}),this._featuresLoaded=!0}catch{}}close(){this._open=!1,this._task=null,this._error=""}async _loadTask(){if(!(!this._entryId||!this._taskId))try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._objectName=t.object?.name||"";let e=(t.tasks||[]).find(i=>i.id===this._taskId);this._task=e??null}catch(t){this._error=I(t,this._lang)}}async _runWs(t){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(t),this._busy=!1,!0}catch(e){return this._error=I(e,this._lang),this._busy=!1,!1}}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||import("./dialog-mount-WNUFS37I.js").then(async({openCompleteDialog:t})=>{let e=this._task,i=!!e.part_ref,r=rt(e),d=r?r.consumesParts:e.consumes_parts||[],p=[];if(!i)try{let h=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0});p=_t({consumes_parts:d},this._entryId,h.objects||[],this._lang)}catch{}t({entry_id:this._entryId,task_id:this._taskId,task_name:e.name,checklist:r?r.checklist:e.checklist||[],adaptive_enabled:!!e.adaptive_config?.enabled,required_completion_fields:r?r.requiredFields:e.required_completion_fields||[],task_type:e.type||"",reading_unit:e.reading_unit||"",parts:p,consumes_parts:i?[]:d,phase_label:G(e)})&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||import("./dialog-mount-WNUFS37I.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("./dialog-mount-WNUFS37I.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let t=s("delete_task_confirm",this._lang)||`Delete "${this._task?.name}"?`;if(!window.confirm(t))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})&&(this._toast=s("suggestion_applied",this._lang)||"Applied",this._notifyChanged("apply_suggestion"),await this._loadTask(),setTimeout(()=>{this._toast=""},2500))}async _reanalyzeInterval(){if(!(!this._entryId||!this._taskId)){this._busy=!0,this._error="";try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});this._toast=t.recommended_interval?`${s("reanalyze_result",this._lang)||"Recomputed"}: ${dt(t.recommended_interval,"days",this._lang)} (${t.data_points} pts)`:s("reanalyze_insufficient_data",this._lang)||"Not enough data",await this._loadTask(),setTimeout(()=>{this._toast=""},3500)}catch(t){this._error=I(t,this._lang)}finally{this._busy=!1}}}_onEditHistoryEntry(t){!this._entryId||!this._taskId||import("./dialog-mount-WNUFS37I.js").then(({openHistoryEditDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,original_timestamp:t.timestamp,type:t.type,timestamp:t.timestamp,notes:t.notes??null,cost:t.cost??null,duration:t.duration??null,completed_by:t.completed_by??null,used_parts:t.used_parts??null})})}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return _;let e=this._lang;return a`
      <div class="recommendation-card">
        <h4>${s("suggested_interval",e)}</h4>
        ${wt(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",e)}
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
    `}_renderAdaptive(t){let e=this._lang,i=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,r=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,d=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,p=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!i&&!r&&!d&&!p?a`<div class="adaptive-empty">
        ${s("adaptive_no_data",e)||"Not enough completion history yet for adaptive analysis."}
      </div>`:a`
      <div class="adaptive-stack">
        ${this._toast?a`<div class="toast">${this._toast}</div>`:_}
        ${i?this._renderRecommendation(t):_}
        ${r?kt(t,e,this._features):_}
        ${d?xt(t,e):_}
        ${p?a`
          ${It(t,e,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?Tt(t,e):_}
        `:_}
      </div>
    `}_renderDetails(t){let e=this._lang,i=t.history||[],r=i.filter(u=>u.type==="completed"),d=r.reduce((u,h)=>u+(typeof h.cost=="number"?h.cost:0),0),p=(()=>{let u=r.map(h=>typeof h.duration=="number"?h.duration:null).filter(h=>h!=null);return u.length?Math.round(u.reduce((h,g)=>h+g,0)/u.length):null})();return a`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${s("times_performed",e)||"Performed"}</span>
            <span class="stat-value">${r.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("total_cost",e)||"Total cost"}</span>
            <span class="stat-value">${d.toFixed(2)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("avg_duration",e)||"Avg duration"}</span>
            <span class="stat-value">${p!=null?`${p}m`:"\u2014"}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${s("history",e)||"History"}</strong>
          <span class="history-count">${i.length}</span>
        </div>
        ${i.length===0?a`<div class="history-empty">${s("history_empty",e)||"No history yet."}</div>`:a`
              <div class="history-list">
                ${[...i].reverse().slice(0,20).map(u=>{let h=["completed","reset","skipped"].includes(u.type);return a`
                    <div class="history-entry">
                      <div class="history-line">
                        <span class="history-type type-${u.type}">${s(u.type,e)}</span>
                        <span class="history-date">${lt(u.timestamp,e)}</span>
                        ${h?a`<button class="history-edit"
                                   title="${s("history_edit_button",e)||"Edit"}"
                                   @click=${()=>this._onEditHistoryEntry(u)}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                            </button>`:_}
                      </div>
                      ${u.notes?a`<div class="history-notes">${u.notes}</div>`:_}
                      ${u.cost!=null||u.duration!=null?a`<div class="history-meta">
                            ${u.cost!=null?a`<span>💰 ${u.cost.toFixed(2)}</span>`:_}
                            ${u.duration!=null?a`<span>⏱️ ${u.duration}m</span>`:_}
                          </div>`:_}
                    </div>
                  `})}
                ${i.length>20?a`<div class="history-more">… +${i.length-20} ${s("older_entries",e)||"older"}</div>`:_}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return _;let t=this._lang,e=this._task,i=this.hass?.user?.is_admin??!0;return a`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${e?a`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${K[e.status]||"#ccc"}"></span>
                  <span class="task-name">${e.name}</span>
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("./dialog-mount-WNUFS37I.js").then(({openObjectQuickActions:r})=>{r(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${e.next_due?a`<span><strong>${s("next_due",t)||"Next due"}:</strong> ${j(e.next_due,t)}</span>`:_}
                  ${e.last_performed?a`<span><strong>${s("last_performed",t)||"Last"}:</strong> ${j(e.last_performed,t)}</span>`:_}
                  ${e.schedule?.kind&&!["manual","one_time"].includes(e.schedule.kind)||e.interval_days!=null?a`<span><strong>${s("interval",t)||"Interval"}:</strong> ${ct(e,t)}</span>`:_}
                  ${G(e)?a`<span><strong>${s("phase_current",t)}:</strong> ${G(e)}</span>`:_}
                </div>
              </div>

              ${this._error?a`<div class="error">${this._error}</div>`:_}

              ${this._showSkip?a`
                    <div class="inline-form">
                      <label>${s("skip_reason",t)||"Skip reason (optional)"}</label>
                      <input type="text" .value=${this._skipReason}
                        @input=${r=>{this._skipReason=r.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${s("cancel",t)||"Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${s("skip",t)||"Skip"}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?a`
                    <div class="inline-form">
                      <label>${s("reset_to_date",t)||"Reset last_performed to"}</label>
                      <input type="date" .value=${this._resetDate}
                        @input=${r=>{this._resetDate=r.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${s("cancel",t)||"Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${s("reset",t)||"Reset"}
                        </button>
                      </div>
                    </div>
                  `:a`
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
                    ${i?a`
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
                        `:_}
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?s("hide_details",t)||"Hide details":s("show_details",t)||"Show history + stats"}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?a`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?s("hide_stats",t)||"Hide stats":s("show_stats",t)||"Show stats + graphs"}
                          </button>`:_}
                    </div>
                    ${this._showDetails?this._renderDetails(e):_}
                    ${this._showAdaptive?this._renderAdaptive(e):_}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${s("open_in_panel",t)||"Open in Maintenance panel"}
                      </button>
                    </div>
                  `}
            `:a`<div class="loading">${s("loading",t)||"Loading\u2026"}</div>`}
      </div>
    `}};k.styles=[ut,w`
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
  `],o([v({attribute:!1})],k.prototype,"hass",2),o([l()],k.prototype,"_open",2),o([l()],k.prototype,"_entryId",2),o([l()],k.prototype,"_taskId",2),o([l()],k.prototype,"_task",2),o([l()],k.prototype,"_objectName",2),o([l()],k.prototype,"_busy",2),o([l()],k.prototype,"_error",2),o([l()],k.prototype,"_showSkip",2),o([l()],k.prototype,"_showReset",2),o([l()],k.prototype,"_showDetails",2),o([l()],k.prototype,"_showAdaptive",2),o([l()],k.prototype,"_skipReason",2),o([l()],k.prototype,"_resetDate",2),o([l()],k.prototype,"_features",2),o([l()],k.prototype,"_toast",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",k);function St(n){return!!n&&/^https?:\/\//i.test(n)}var R=class extends E{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error=""}get _lang(){return S(this.hass)}async openFor(t){this._entryId=t,this._error="",this._open=!0,await this._load()}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._data=t}catch(t){this._error=I(t,this._lang)}}_onEditObject(){!this._entryId||!this._data||import("./dialog-mount-WNUFS37I.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("./dialog-mount-WNUFS37I.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data)return;let t=s("delete_object_confirm",this._lang)||`Delete "${this._data.object.name}" and all its tasks?`;if(window.confirm(t)){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=I(e,this._lang)}finally{this._busy=!1}}}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t){let e=s("confirm_archive_object",this._lang)||"Archive this object and its tasks?";if(!window.confirm(e))return}this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=I(e,this._lang)}finally{this._busy=!1}}_onTaskClick(t){this._entryId&&import("./dialog-mount-WNUFS37I.js").then(({openTaskQuickActions:e})=>{e(this._entryId,t)})}render(){if(!this._open)return _;let t=this._lang,e=this._data,i=e?.object,r=e?.tasks||[],d=this.hass?.user?.is_admin??!0;return a`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${e&&i?a`
              <div class="header">
                <div class="title">${i.name}</div>
                ${this._renderMetaRow(i)}
              </div>

              ${this._error?a`<div class="error">${this._error}</div>`:_}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${s("tasks",t)||"Tasks"}</strong>
                  <span class="count">${r.length}</span>
                </div>
                ${r.length===0?a`<div class="empty">${s("no_tasks",t)||"No tasks yet."}</div>`:a`
                      <div class="task-list">
                        ${r.map(p=>a`
                          <div class="task-row" @click=${()=>this._onTaskClick(p.id)}>
                            <span class="status-dot" style="background: ${K[p.status]||"#ccc"}"></span>
                            <span class="task-name">${p.name}</span>
                            <span class="task-status">${s(p.status||"ok",t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${i.notes?a`
                    <div class="notes-section">
                      <strong>${s("object_notes_label",t)}</strong>
                      <div class="notes-body">${i.notes}</div>
                    </div>
                  `:_}

              ${d?a`
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
                  `:_}
            `:a`<div class="loading">${s("loading",t)||"Loading\u2026"}</div>`}
      </div>
    `}_renderMetaRow(t){let e=this._lang,i=[];return t.area_id&&i.push([s("area",e),t.area_id]),t.manufacturer&&i.push([s("manufacturer",e),t.manufacturer]),t.model&&i.push([s("model",e),t.model]),t.serial_number&&i.push([s("serial_number_label",e),t.serial_number]),t.installation_date&&i.push([s("installed",e),t.installation_date]),t.warranty_expiry&&i.push([s("warranty",e),t.warranty_expiry]),t.documentation_url&&i.push([s("documentation_url_label",e),t.documentation_url]),i.length===0?_:a`
      <div class="meta">
        ${i.map(([r,d])=>a`
            <div class="meta-item">
              <span class="meta-label">${r}</span>
              <span class="meta-value">${St(d)?a`<a href="${d}" target="_blank" rel="noopener noreferrer">${d}</a>`:d}</span>
            </div>
          `)}
      </div>
    `}};R.styles=w`
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
  `,o([v({attribute:!1})],R.prototype,"hass",2),o([l()],R.prototype,"_open",2),o([l()],R.prototype,"_entryId",2),o([l()],R.prototype,"_data",2),o([l()],R.prototype,"_busy",2),o([l()],R.prototype,"_error",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",R);var Lt="maintenance-object-dialog",Pt="maintenance-task-dialog",se="maintenance-history-edit-dialog",re="maintenance-complete-dialog",ne="maintenance-qr-dialog",ae="maintenance-task-quick-actions-dialog",oe="maintenance-object-quick-actions-dialog";function J(){return document.querySelector("home-assistant")?.hass}function le(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function F(n){let c=le(),t=c.querySelector(n)??document.body.querySelector(n);return t?t.parentNode!==c&&c.appendChild(t):(t=document.createElement(n),c.appendChild(t)),t}function O(n){let c=J();if(!c)return!1;n.hass=c;let t=S(c);return at(t)||ot(t).then(()=>{n.requestUpdate?.()}),!0}var At={features:{adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1},defaultWarningDays:7},Z=null;function Ct(n){return Z||(Z=n.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(c=>({features:c.features??At.features,defaultWarningDays:c.general?.default_warning_days??7})).catch(()=>At),Z)}function Yi(){let n=F(Lt);return O(n)?(n.openCreate(),!0):!1}function Gi(n,c){let t=F(Lt);return O(t)?(t.openEdit(n,c),!0):!1}function Zi(n="",c){let t=F(Pt);if(!O(t))return!1;let e=J();return e?((async()=>{let i=await Ct(e),r=t;r.checklistsEnabled=i.features.checklists,r.scheduleTimeEnabled=i.features.schedule_time,r.completionActionsEnabled=i.features.completion_actions,r.defaultWarningDays=i.defaultWarningDays,r.openCreate(n,c)})(),!0):!1}function Ji(n,c){let t=F(Pt);if(!O(t))return!1;let e=J();return e?((async()=>{try{let[i,r]=await Promise.all([e.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:n}),Ct(e)]),d=(i.tasks||[]).find(u=>u.id===c);if(!d){console.warn(`openEditTaskDialog: task ${c} not found in entry ${n}`);return}let p=t;p.checklistsEnabled=r.features.checklists,p.scheduleTimeEnabled=r.features.schedule_time,p.completionActionsEnabled=r.features.completion_actions,p.defaultWarningDays=r.defaultWarningDays,await p.openEdit(n,d)}catch(i){console.warn("openEditTaskDialog: failed to load task/features",i)}})(),!0):!1}function Xi(n){let c=F(se);return O(c)?(c.openEdit(n),!0):!1}function ts(n){let c=F(re);return O(c)?(c.entryId=n.entry_id,c.taskId=n.task_id,c.taskName=n.task_name,c.checklist=n.checklist??[],c.adaptiveEnabled=!!n.adaptive_enabled,c.requiredFields=n.required_completion_fields??[],c.taskType=n.task_type??"",c.readingUnit=n.reading_unit??"",c.parts=n.parts??[],c.consumesParts=n.consumes_parts??[],c.phaseLabel=n.phase_label??"",c.lang=J()?.language||"en",c.open(),!0):!1}function es(n){let c=F(ne);return O(c)?(c.openForTask(n.entry_id,n.task_id,n.object_name,n.task_name),!0):!1}function is(n,c){let t=F(ae);return O(t)?(t.openFor(n,c),!0):!1}function ss(n){let c=F(oe);return O(c)?(c.openFor(n),!0):!1}export{ts as openCompleteDialog,Yi as openCreateObjectDialog,Zi as openCreateTaskDialog,Gi as openEditObjectDialog,Ji as openEditTaskDialog,Xi as openHistoryEditDialog,ss as openObjectQuickActions,es as openQrDialog,is as openTaskQuickActions};
