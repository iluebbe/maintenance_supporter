/*! maintenance_supporter frontend 2.74.0 */
import{a as _t}from"./chunk-VTI4YTRV.js";import"./chunk-OWRLLHYV.js";import{a as E,b as n,c as G,d as _,e as I,f as g,g as d,i as s,k as C,l as mt,m as gt,n as vt,o as A,p as ft,q as Y,r as bt,s as yt,t as nt,u as $t,v as xt,w as kt,x as wt,y as Et,z as P}from"./chunk-XEXYPJCJ.js";import{a as o,b as et}from"./chunk-3YPUSKYO.js";var T=class extends I{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1;this.multiline=!1;this.rows=3}_onInput(t){let e=t.target.value;this.value=e,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:e}}))}render(){return n`
      <label class="field">
        ${this.label?n`<span class="label">${this.label}${this.required?n`<span class="req">*</span>`:_}</span>`:_}
        ${this.multiline?n`
        <textarea
          .value=${this.value??""}
          rows=${this.rows}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          @input=${this._onInput}
          @change=${this._onInput}
        ></textarea>`:n`
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
        />`}
        ${this.helper?n`<span class="helper">${this.helper}</span>`:_}
      </label>
    `}};T.styles=E`
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
  `,o([g()],T.prototype,"label",2),o([g()],T.prototype,"value",2),o([g()],T.prototype,"placeholder",2),o([g()],T.prototype,"type",2),o([g({type:Boolean})],T.prototype,"required",2),o([g({type:Boolean})],T.prototype,"disabled",2),o([g()],T.prototype,"step",2),o([g()],T.prototype,"min",2),o([g()],T.prototype,"max",2),o([g()],T.prototype,"pattern",2),o([g()],T.prototype,"helper",2),o([g({type:Boolean})],T.prototype,"multiline",2),o([g({type:Number})],T.prototype,"rows",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",T);var k=class extends I{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._entryId=null}get _lang(){return C(this.hass)}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId="",this._error="",this._open=!0}openEdit(t,e){this._entryId=t,this._name=e.name||"",this._manufacturer=e.manufacturer||"",this._model=e.model||"",this._serialNumber=e.serial_number||"",this._areaId=e.area_id||"",this._installationDate=e.installation_date||"",this._warrantyExpiry=e.warranty_expiry||"",this._documentationUrl=e.documentation_url||"",this._notes=e.notes||"",this._haDeviceId=e.ha_device_id||"",this._parentEntryId=e.parent_entry_id||"",this._error="",this._open=!0}async _save(){if(!this._loading&&this._name.trim()){this._loading=!0,this._error="";try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}catch(t){this._error=P(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_parentChoices(){return(this.objects||[]).filter(t=>t.entry_id!==this._entryId)}_close(){this._open=!1}render(){if(!this._open)return n``;let t=this._lang,e=this._entryId?s("edit_object",t):s("new_object",t);return n`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${e}</div>
        <div class="content">
          ${this._error?n`<div class="error">${this._error}</div>`:_}
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
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${t}
            label="${s("installation_date_optional",t)}"
            .value=${this._installationDate}
            @value-changed=${i=>this._installationDate=i.detail.value}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${t}
            label="${s("warranty_expiry_optional",t)}"
            .value=${this._warrantyExpiry}
            @value-changed=${i=>this._warrantyExpiry=i.detail.value}
          ></ms-date-field>
          <ha-form
            .hass=${this.hass}
            .data=${{device:this._haDeviceId||void 0}}
            .schema=${[{name:"device",selector:{device:{}}}]}
            .computeLabel=${()=>s("link_device_optional",t)}
            @value-changed=${i=>this._haDeviceId=i.detail.value?.device||""}
          ></ha-form>
          ${this._parentChoices().length?n`<label class="textarea-field">
                <span class="textarea-label">${s("parent_object_optional",t)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${i=>this._parentEntryId=i.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${s("parent_none",t)}
                  </option>
                  ${this._parentChoices().map(i=>n`<option
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
    `}};k.styles=E`
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
  `,o([g({attribute:!1})],k.prototype,"hass",2),o([g({attribute:!1})],k.prototype,"objects",2),o([d()],k.prototype,"_open",2),o([d()],k.prototype,"_loading",2),o([d()],k.prototype,"_error",2),o([d()],k.prototype,"_name",2),o([d()],k.prototype,"_manufacturer",2),o([d()],k.prototype,"_model",2),o([d()],k.prototype,"_serialNumber",2),o([d()],k.prototype,"_areaId",2),o([d()],k.prototype,"_installationDate",2),o([d()],k.prototype,"_warrantyExpiry",2),o([d()],k.prototype,"_documentationUrl",2),o([d()],k.prototype,"_notes",2),o([d()],k.prototype,"_haDeviceId",2),o([d()],k.prototype,"_parentEntryId",2),o([d()],k.prototype,"_entryId",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",k);var it=class{constructor(l){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=l}updateHass(l){this.hass=l}async getUsers(l=!1){let t=Date.now();if(!l&&this.usersCache&&t-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=e.users,this.cacheTimestamp=t,this.usersCache}catch(e){return console.error("Failed to fetch users:",e),this.usersCache||[]}}async assignUser(l,t,e){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:l,task_id:t,user_id:e})}async getTasksByUser(l){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:l})).tasks}getUserName(l){return!l||!this.usersCache?null:this.usersCache.find(e=>e.id===l)?.name||null}getUser(l){return!l||!this.usersCache?null:this.usersCache.find(t=>t.id===l)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(l){return l?l===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}};function O(r){return`${r.entry_id??""}\0${r.part_id}`}function It(r,l,t,e){let i=!!r.entry_id&&r.entry_id!==l,a=i?r.entry_id:l,u=t.find(v=>v.entry_id===a),c=(u?.parts||[]).find(v=>v.id===r.part_id)||null,p=i&&u?.object?.name||"",h=c?.name||s("shared_part_unknown",e);return{part:c,foreign:i,ownerName:p,label:p?`${h} (${p})`:h}}function St(r,l,t,e){let{part:i,label:a}=It(r,l,t,e),u=i&&i.stock!==null&&i.stock!==void 0?` (${i.stock}${i.unit?" "+i.unit:""})`:"",c=i?.storage_location?` \u2014 ${i.storage_location}`:"";return`${r.quantity}\xD7 ${a}${u}${c}`}function Tt(r,l,t,e){let a=(t.find(c=>c.entry_id===l)?.parts||[]).map(c=>({...c})),u=new Set(a.map(c=>O({part_id:c.id})));for(let c of r?.consumes_parts||[]){if(!c.entry_id||c.entry_id===l)continue;let p=O(c);if(u.has(p))continue;u.add(p);let{part:h,ownerName:v}=It(c,l,t,e);a.push({id:c.part_id,name:h?.name||s("shared_part_unknown",e),unit:h?.unit,stock:h?.stock??null,storage_location:h?.storage_location,entry_id:c.entry_id,owner_name:v})}return a}var ot=["sensor","binary_sensor","number","input_number","input_boolean","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock"],At=["sensor"],Pt=["temperature","humidity","pressure"];var lt=["notes","cost","duration","photo","user"],X={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"};var ee=["cleaning","inspection","replacement","calibration","service","reading","custom"],ie=["low","normal","high"],se=["time_based","weekdays","nth_weekday","day_of_month","sensor_based","one_time","manual"],dt=["weekdays","nth_weekday","day_of_month"],Lt=["threshold","counter","state_change","runtime"],re=[...Lt,"compound"],z={alpha:"0.3",min:"7",max:"365"};function ae(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",carry:{}}}var ne=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states"]);function oe(r){return{entityIds:(r.entity_ids||(r.entity_id?[r.entity_id]:[])).join(", "),type:r.type||"threshold",attribute:r.attribute||"",above:r.trigger_above?.toString()??"",below:r.trigger_below?.toString()??"",equals:r.trigger_equals?.toString()??"",notEquals:r.trigger_not_equals?.toString()??"",forMinutes:r.trigger_for_minutes?.toString()??"0",targetValue:r.trigger_target_value?.toString()??"",deltaMode:r.trigger_delta_mode||!1,fromState:r.trigger_from_state||"",toState:r.trigger_to_state||"",targetChanges:r.trigger_target_changes?.toString()??"",runtimeHours:r.trigger_runtime_hours?.toString()??"",onStates:(r.trigger_on_states||[]).join(", "),carry:Object.fromEntries(Object.entries(r).filter(([t])=>!ne.has(t)&&!t.startsWith("_")))}}function le(r){let l=r.entityIds.split(",").map(e=>e.trim()).filter(Boolean);if(l.length===0)return null;let t={...r.carry||{},entity_id:l[0],entity_ids:l,type:r.type};if(r.attribute&&(t.attribute=r.attribute),r.type==="threshold"){let e=parseFloat(r.above);isNaN(e)||(t.trigger_above=e);let i=parseFloat(r.below);isNaN(i)||(t.trigger_below=i);let a=parseFloat(r.equals);isNaN(a)||(t.trigger_equals=a);let u=parseFloat(r.notEquals);isNaN(u)||(t.trigger_not_equals=u);let c=parseInt(r.forMinutes,10);isNaN(c)||(t.trigger_for_minutes=c)}else if(r.type==="counter"){let e=parseFloat(r.targetValue);isNaN(e)||(t.trigger_target_value=e),t.trigger_delta_mode=r.deltaMode}else if(r.type==="state_change"){r.fromState&&(t.trigger_from_state=r.fromState),r.toState&&(t.trigger_to_state=r.toState);let e=parseInt(r.targetChanges,10);isNaN(e)||(t.trigger_target_changes=e)}else if(r.type==="runtime"){let e=parseFloat(r.runtimeHours);isNaN(e)||(t.trigger_runtime_hours=e);let i=(r.onStates||"").split(",").map(a=>a.trim()).filter(Boolean);i.length>0&&(t.trigger_on_states=i)}return t}function de(r){return Array.from({length:7},(l,t)=>nt(t,r,"short"))}function ce(r){return Array.from({length:12},(l,t)=>$t(t,r,"short"))}var m=class m extends I{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.defaultWarningDays=7;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._entryId="";this._taskId=null;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._priority="normal";this._labels="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._readingUnit="";this._consumesParts={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._actionService="";this._actionTargetEntity="";this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=z.alpha;this._adaptiveMin=z.min;this._adaptiveMax=z.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return C(this.hass)}async openCreate(t,e){this._entryId=t,this._taskId=null,this._error="",!t&&e&&e.length>0?(this._objectChoices=e.map(i=>({entry_id:i.entry_id,name:i.object.name})).sort((i,a)=>i.name.localeCompare(a.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(t,e){this._entryId=t,this._taskId=e.id,this._error="",this._objectChoices=[],this._name=e.name,this._type=e.type,this._scheduleType=e.schedule_type,this._intervalDays=e.interval_days!=null?String(e.interval_days):"",this._intervalUnit=e.interval_unit||"days",this._dueDate=e.due_date||"";let i=e.schedule;this._weekdays=i?.kind==="weekdays"?[...i.weekdays??[]]:[],this._nth=i?.kind==="nth_weekday"?String(i.nth??1):"1",this._nthWeekday=i?.kind==="nth_weekday"?String(i.weekday??5):"5",this._domDay=i?.kind==="day_of_month"&&(i.day??1)>=1?String(i.day??1):"1",this._domLastDay=i?.kind==="day_of_month"&&i.day===-1,this._domBusiness=i?.kind==="day_of_month"&&i.business===!0,this._calOffset=i?.offset?String(i.offset):"0",this._seasonMonths=Array.isArray(i?.season_months)?[...i.season_months]:[];let a=i?.ends;a&&typeof a.count=="number"?(this._endsMode="count",this._endsCount=String(a.count),this._endsUntil=""):a&&typeof a.until=="string"?(this._endsMode="until",this._endsUntil=a.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=e.warning_days.toString(),this._earliestCompletionDays=e.earliest_completion_days!=null?String(e.earliest_completion_days):"",this._intervalAnchor=e.interval_anchor||"completion",this._notes=e.notes||"",this._documentationUrl=e.documentation_url||"",this._customIcon=e.custom_icon||"",this._priority=e.priority||"normal",this._labels=(e.labels||[]).join(", "),this._enabled=e.enabled!==!1,this._lastPerformed=e.last_performed||"",this._nfcTagId=e.nfc_tag_id||"",this._requireTagScan=!!e.require_tag_scan,this._allowSkip=e.allow_skip!==!1,this._readingUnit=e.reading_unit||"",this._consumesParts=Object.fromEntries((e.consumes_parts||[]).map(h=>[O(h),{...h}])),this._responsibleUserId=e.responsible_user_id||null,this._assigneePool=[...e.assignee_pool||[]],this._rotationStrategy=e.rotation_strategy||"",this._checklistText=(e.checklist||[]).join(`
`),this._phaseDefs=Object.entries(e.phases||{}).map(([h,v])=>{let{name:y,checklist:$,consumes_parts:f,required_completion_fields:S,...H}=v,B=v.consumes_parts||[],K=B.findIndex(D=>!D.entry_id),N=K>=0?B[K]:void 0;return{id:h,name:v.name||h,checklistText:(v.checklist||[]).join(`
`),partId:N?.part_id||"",partQty:N?.quantity!=null?String(N.quantity):"",reqOverride:v.required_completion_fields!==void 0,reqFields:[...v.required_completion_fields||[]],extraParts:B.filter((D,Q)=>Q!==K).map(D=>({...D})),carry:H}}),this._phaseSeq=[...e.phase_sequence||[]],this._requiredCompletion=[...e.required_completion_fields||[]],this._scheduleTime=e.schedule_time||"";let u=e.on_complete_action;if(u&&u.service){this._actionService=u.service;let h=u.target?.entity_id;this._actionTargetEntity=Array.isArray(h)?h[0]||"":h||"",this._actionData=u.data&&typeof u.data=="object"?{...u.data}:{},this._actionDataJsonFallback=""}else this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="";let c=e.quick_complete_defaults;this._qcNotes=c?.notes||"",this._qcCost=c?.cost!=null?String(c.cost):"",this._qcDuration=c?.duration!=null?String(c.duration):"",this._qcFeedback=c?.feedback||"";let p=e.adaptive_config||{};if(this._environmentalEntity=p.environmental_entity||"",this._environmentalAttribute=p.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!p.enabled,this._adaptiveAlpha=p.ewa_alpha?.toString()??z.alpha,this._adaptiveMin=p.min_interval_days?.toString()??z.min,this._adaptiveMax=p.max_interval_days?.toString()??z.max,this._adaptiveSeasonal=p.seasonal_enabled!==!1,this._adaptivePrediction=p.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),e.trigger_config){let h=e.trigger_config;this._triggerEntityId=h.entity_id||h.entity_ids&&h.entity_ids[0]||"",this._triggerEntityIds=h.entity_ids||(h.entity_id?[h.entity_id]:[]),this._triggerEntityLogic=h.entity_logic||"any",this._triggerAttribute=h.attribute||"",this._triggerType=h.type||"threshold",this._triggerAbove=h.trigger_above?.toString()||"",this._triggerBelow=h.trigger_below?.toString()||"",this._triggerEquals=h.trigger_equals?.toString()||"",this._triggerNotEquals=h.trigger_not_equals?.toString()||"",this._triggerForMinutes=h.trigger_for_minutes?.toString()||"0",this._triggerCombinator=h.trigger_combinator==="all"?"all":"any",this._triggerTargetValue=h.trigger_target_value?.toString()||"",this._triggerDeltaMode=h.trigger_delta_mode||!1,this._triggerBaselineValue=h.trigger_baseline_value?.toString()||"",this._liveBaselineValue=e.trigger_baseline_value??null,this._autoCompleteOnRecovery=h.auto_complete_on_recovery||!1,this._triggerFromState=h.trigger_from_state||"",this._triggerToState=h.trigger_to_state||"",this._triggerTargetChanges=h.trigger_target_changes?.toString()||"",this._triggerRuntimeHours=h.trigger_runtime_hours?.toString()||"",this._triggerRuntimeMaxSession=h.trigger_runtime_max_session_seconds?.toString()||"",this._triggerOnStates=(h.trigger_on_states||[]).join(", "),h.type==="compound"?(this._compoundLogic=h.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(h.conditions||[]).map(oe)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._priority="normal",this._labels="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._readingUnit="",this._consumesParts={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=z.alpha,this._adaptiveMin=z.min,this._adaptiveMax=z.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="",this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._triggerAttribute="",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerEquals="",this._triggerNotEquals="",this._triggerForMinutes="0",this._triggerCombinator="any",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges="",this._triggerRuntimeHours="",this._triggerRuntimeMaxSession="",this._triggerOnStates="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new it(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(t){console.error("Failed to load users:",t),this._availableUsers=[]}}_toggleAssignee(t){this._assigneePool=this._assigneePool.includes(t)?this._assigneePool.filter(e=>e!==t):[...this._assigneePool,t]}async _testAction(){let t=this._actionService.trim();if(!t||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(t)){this._actionTestResult="error",this._actionTestError="Invalid service format (expected 'domain.service')",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[e,i]=t.split(".");if(!this.hass?.services?.[e]?.[i]){this._actionTestResult="error",this._actionTestError=`Service "${t}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let a=this._actionTargetEntity.trim();if(a){let u=a.split(".")[0];if(u!==e&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(e)){this._actionTestResult="error",this._actionTestError=`Service "${t}" only works on ${e}.* entities; entity "${a}" is in ${u}.* \u2014 pick a service that matches the entity domain (e.g. ${u}.${i})`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[a]){this._actionTestResult="error",this._actionTestError=`Target entity "${a}" not found in Home Assistant \u2014 the entity may have been renamed or its integration removed.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let t=JSON.parse(this._actionDataJsonFallback);if(t&&typeof t=="object"&&!Array.isArray(t))return t}catch{}return{...this._actionData}}_serviceSchema(){let t=this._actionService.trim();if(!t||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(t))return null;let[e,i]=t.split("."),a=this.hass?.services?.[e]?.[i]?.fields;return!a||Object.keys(a).length===0?null:Object.entries(a).map(([u,c])=>({name:u,required:!!c.required,selector:c.selector||{text:{}}}))}_renderCompletionActionsSection(t){if(!this.completionActionsEnabled)return _;let e=this._serviceSchema();return n`
      <details class="ca-section">
        <summary>${s("on_complete_action_title",t)}</summary>
        <p class="field-help">${s("on_complete_action_desc",t)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${i=>{this._actionService=i.detail.value||"";let a=this._serviceSchema();if(a){let u=new Set(a.map(c=>c.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([c])=>u.has(c)))}}}
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
        ${e?n`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${e}
                .data=${this._actionData}
                @value-changed=${i=>{this._actionData={...i.detail.value}}}
              ></ha-form>
            `:n`
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
          ${this._actionTestResult==="ok"?n`<span class="ca-test-ok">${s("on_complete_action_test_success",t)}</span>`:_}
          ${this._actionTestResult==="error"?n`<div class="ca-test-error-block">
                <span class="ca-test-error">${s("on_complete_action_test_failed",t)}</span>
                ${this._actionTestError?n`<div class="ca-test-error-detail">${this._actionTestError}</div>`:_}
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
    `}async _loadParts(){if(this.parts=[],!!this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this.parts=t.parts||[],this._partsLoadFailed=!1}catch{this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){if(this._foreignOwners=[],!!this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._foreignOwners=(t.objects||[]).filter(e=>e.entry_id!==this._entryId&&(e.parts||[]).length>0).map(e=>({entry_id:e.entry_id,name:e.object?.name||e.entry_id,parts:e.parts||[]})).sort((e,i)=>e.name.localeCompare(i.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=t.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(t){!t||!this.hass||this._conditionAttrOptions[t]||this._conditionAttrPending.has(t)||(this._conditionAttrPending.add(t),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:t}).then(e=>{let i=e;this._conditionAttrOptions={...this._conditionAttrOptions,[t]:{suggested:i.suggested_attributes||[],available:i.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[t]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(t){if(!t||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:t});this._entityDomain=e.domain||"",this._suggestedAttributes=e.suggested_attributes||[],this._availableAttributes=e.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(t=>!!t.entry_id)}_renderConsumesRow(t,e){let i=O({part_id:t.id,entry_id:e}),a=this._consumesParts[i],u=e?{part_id:t.id,quantity:1,entry_id:e}:{part_id:t.id,quantity:1};return n`
      <div class="consumes-row">
        <label class="consumes-check">
          <input
            type="checkbox"
            .checked=${a!==void 0}
            @change=${c=>{let p={...this._consumesParts};c.target.checked?p[i]=p[i]||u:delete p[i],this._consumesParts=p}}
          />
          <span>${t.name}${t.unit?` (${t.unit})`:""}</span>
        </label>
        ${a!==void 0?n`<input
              class="consumes-qty"
              type="number"
              min="0.01"
              max="999"
              step="0.01"
              .value=${String(a.quantity)}
              @input=${c=>{let p=parseFloat(c.target.value);this._consumesParts={...this._consumesParts,[i]:{...u,quantity:Number.isFinite(p)&&p>=.01?p:1}}}}
            />`:_}
      </div>
    `}_toggleRequired(t,e){let i=new Set(this._requiredCompletion);e?i.add(t):i.delete(t),this._requiredCompletion=[...i]}_phaseSlug(t){let e=t.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",i=e,a=2;for(;this._phaseDefs.some(u=>u.id===i);)i=`${e}-${a++}`;return i}_addPhaseDef(){let t=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:t,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(t){this._phaseDefs=this._phaseDefs.filter(e=>e.id!==t),this._phaseSeq=this._phaseSeq.filter(e=>e!==t)}_patchPhaseDef(t,e){this._phaseDefs=this._phaseDefs.map(i=>i.id===t?{...i,...e}:i)}_renderPhasesEditor(t){let e=i=>this._phaseDefs.find(a=>a.id===i)?.name||i;return n`
      <h3>${s("phases_section",t)}</h3>
      <div class="field-help">${s("phases_hint",t)}</div>
      ${this._phaseDefs.map(i=>n`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${s("phase_name",t)}"
              .value=${i.name}
              @input=${a=>this._patchPhaseDef(i.id,{name:a.target.value})}
            ></ms-textfield>
            ${this.parts.length?n`
              <select
                class="phase-part"
                .value=${i.partId}
                @change=${a=>this._patchPhaseDef(i.id,{partId:a.target.value})}
              >
                <option value="">—</option>
                ${this.parts.map(a=>n`<option value=${a.id} ?selected=${a.id===i.partId}>${a.name}</option>`)}
              </select>
              ${i.partId?n`
                <input class="phase-qty" type="number" min="0.01" step="0.01" .value=${i.partQty||"1"}
                  @input=${a=>this._patchPhaseDef(i.id,{partQty:a.target.value})} />
              `:_}
            `:_}
            <mwc-icon-button class="phase-remove" @click=${()=>this._removePhaseDef(i.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </mwc-icon-button>
          </div>
          ${this.checklistsEnabled?n`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${s("checklist_placeholder",t)}"
              .value=${i.checklistText}
              @input=${a=>this._patchPhaseDef(i.id,{checklistText:a.target.value})}
            ></textarea>
          `:_}
          <label class="req-option phase-req-toggle">
            <input
              type="checkbox"
              .checked=${i.reqOverride}
              @change=${a=>this._patchPhaseDef(i.id,{reqOverride:a.target.checked})}
            />
            <span>${s("phase_require_override",t)}</span>
          </label>
          ${i.reqOverride?n`
            <div class="required-completion phase-req-fields">
              ${lt.map(a=>n`
                <label class="req-option">
                  <input
                    type="checkbox"
                    .checked=${i.reqFields.includes(a)}
                    @change=${u=>{let c=u.target.checked,p=new Set(i.reqFields);c?p.add(a):p.delete(a),this._patchPhaseDef(i.id,{reqFields:[...p]})}}
                  />
                  <span>${s(X[a],t)}</span>
                </label>
              `)}
            </div>
          `:_}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${s("phase_add",t)}
      </ha-button>
      ${this._phaseDefs.some(i=>i.name.trim())?n`
        <div class="phase-seq-label">${s("phase_sequence_label",t)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((i,a)=>n`
            <span class="phase-chip">
              ${a+1}. ${e(i)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((u,c)=>c!==a)}}>✕</button>
            </span>
          `)}
          <select
            class="phase-seq-add"
            .value=${""}
            @change=${i=>{let a=i.target.value;a&&(this._phaseSeq=[...this._phaseSeq,a]),i.target.value=""}}
          >
            <option value="">+ ${s("phase_sequence_add_step",t)}</option>
            ${this._phaseDefs.filter(i=>i.name.trim()).map(i=>n`<option value=${i.id}>${i.name}</option>`)}
          </select>
        </div>
      `:_}
    `}async _save(){if(!this._loading&&this._name.trim()){if(this._adaptiveSnapshot()!==this._adaptiveInitial){let t=parseInt(this._adaptiveMin,10),e=parseInt(this._adaptiveMax,10);if(!isNaN(t)&&!isNaN(e)&&t>e){this._error=`${s("adaptive_min_interval",this._lang)} > ${s("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=s("trigger_hint_overlap",this._lang);return}this._loading=!0,this._error="";try{let t={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},e=this._earliestCompletionDays.trim();t.earliest_completion_days=e===""?null:Math.max(0,parseInt(e,10)||0),this._taskId&&(t.task_id=this._taskId),this._scheduleType==="one_time"?(t.due_date=this._dueDate||null,t.interval_days=null):dt.includes(this._scheduleType)?(t.schedule={...this._buildSchedule(),...this._recurrenceExtras()},t.interval_days=null,this._taskId&&(t.due_date=null)):(this._taskId&&(t.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(t.interval_days=parseInt(this._intervalDays,10),t.interval_unit=this._intervalUnit,t.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(t.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(t.interval_days=null,t.interval_anchor="completion")),t.notes=this._notes||null,t.documentation_url=this._documentationUrl||null,t.custom_icon=this._customIcon||null,t.priority=this._priority,t.labels=this._labels.split(",").map(c=>c.trim()).filter(Boolean),t.enabled=this._enabled,t.last_performed=this._lastPerformed||null,t.nfc_tag_id=this._nfcTagId||null,t.require_tag_scan=this._requireTagScan,t.allow_skip=this._allowSkip,t.reading_unit=this._readingUnit.trim()||null;{let c={};for(let h of this._phaseDefs){if(!h.name.trim())continue;let v={...h.carry,name:h.name.trim()},y=h.checklistText.split(`
`).map(f=>f.trim()).filter(Boolean);y.length&&(v.checklist=y);let $=[];if(h.partId){let f=parseFloat(h.partQty);$.push({part_id:h.partId,quantity:Number.isFinite(f)&&f>0?f:1})}for(let f of h.extraParts)$.push(f.entry_id?{part_id:f.part_id,quantity:f.quantity,entry_id:f.entry_id}:{part_id:f.part_id,quantity:f.quantity});$.length&&(v.consumes_parts=$),h.reqOverride&&(v.required_completion_fields=[...h.reqFields]),c[h.id]=v}let p=this._phaseSeq.filter(h=>h in c);t.phases=Object.keys(c).length&&p.length?c:null,t.phase_sequence=t.phases?p:null}if((this.parts.length||this._foreignOwners.length)&&(t.consumes_parts=Object.values(this._consumesParts).map(c=>c.entry_id?{part_id:c.part_id,quantity:c.quantity,entry_id:c.entry_id}:{part_id:c.part_id,quantity:c.quantity})),t.responsible_user_id=this._responsibleUserId,t.assignee_pool=this._assigneePool,t.required_completion_fields=this._requiredCompletion,t.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let c=this._compoundConditions.map(le).filter(p=>p!==null);if(c.length>0){let p={type:"compound",compound_logic:this._compoundLogic,conditions:c};this._autoCompleteOnRecovery&&(p.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(p.trigger_combinator="all"),t.trigger_config=p}else this._taskId&&(t.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let c=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],p={entity_id:c[0],entity_ids:c,type:this._triggerType};if(this._triggerAttribute&&(p.attribute=this._triggerAttribute),this._autoCompleteOnRecovery&&(p.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(p.trigger_combinator="all"),c.length>1&&(p.entity_logic=this._triggerEntityLogic),this._triggerType==="threshold"){if(this._triggerAbove){let h=parseFloat(this._triggerAbove);isNaN(h)||(p.trigger_above=h)}if(this._triggerBelow){let h=parseFloat(this._triggerBelow);isNaN(h)||(p.trigger_below=h)}if(this._triggerEquals){let h=parseFloat(this._triggerEquals);isNaN(h)||(p.trigger_equals=h)}if(this._triggerNotEquals){let h=parseFloat(this._triggerNotEquals);isNaN(h)||(p.trigger_not_equals=h)}if(this._triggerForMinutes){let h=parseInt(this._triggerForMinutes,10);isNaN(h)||(p.trigger_for_minutes=h)}}else if(this._triggerType==="counter"){if(this._triggerTargetValue){let h=parseFloat(this._triggerTargetValue);isNaN(h)||(p.trigger_target_value=h)}if(p.trigger_delta_mode=this._triggerDeltaMode,this._triggerDeltaMode&&this._triggerBaselineValue){let h=parseFloat(this._triggerBaselineValue);!isNaN(h)&&h>=0&&(p.trigger_baseline_value=h)}}else if(this._triggerType==="state_change"){if(this._triggerFromState&&(p.trigger_from_state=this._triggerFromState),this._triggerToState&&(p.trigger_to_state=this._triggerToState),this._triggerTargetChanges){let h=parseInt(this._triggerTargetChanges,10);isNaN(h)||(p.trigger_target_changes=h)}if(this._triggerForMinutes){let h=parseInt(this._triggerForMinutes,10);isNaN(h)||(p.trigger_for_minutes=h)}}else if(this._triggerType==="runtime"){if(this._triggerRuntimeHours){let v=parseFloat(this._triggerRuntimeHours);isNaN(v)||(p.trigger_runtime_hours=v)}if(this._triggerRuntimeMaxSession){let v=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(v)&&v>0&&(p.trigger_runtime_max_session_seconds=v)}let h=this._triggerOnStates.split(",").map(v=>v.trim()).filter(Boolean);h.length>0&&(p.trigger_on_states=h)}t.trigger_config=p}else this._taskId&&(t.trigger_config=null);if(this.scheduleTimeEnabled&&this._scheduleType==="time_based"){let c=this._scheduleTime.trim();t.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(c)?c:null}if(this.checklistsEnabled){let c=this._checklistText.split(`
`).map(p=>p.trim()).filter(Boolean).slice(0,100);t.checklist=c.length?c:null}if(this.completionActionsEnabled){let c=this._actionService.trim();if(c&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(c)){let y={service:c},$=this._actionTargetEntity.trim();$&&(y.target={entity_id:$});let f=this._buildActionData();Object.keys(f).length>0&&(y.data=f),t.on_complete_action=y}else t.on_complete_action=null;let p={};this._qcNotes.trim()&&(p.notes=this._qcNotes.trim());let h=parseFloat(this._qcCost);!isNaN(h)&&h>=0&&(p.cost=h);let v=parseInt(this._qcDuration,10);!isNaN(v)&&v>=0&&(p.duration=v),this._qcFeedback&&(p.feedback=this._qcFeedback),t.quick_complete_defaults=Object.keys(p).length?p:null}let i=await this.hass.connection.sendMessagePromise(t),a=this._taskId||i?.task_id,u=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;if(a&&this._scheduleType==="sensor_based"&&u)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:a,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null}),this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute}catch{}if(a&&this._adaptiveSnapshot()!==this._adaptiveInitial){let c=parseFloat(this._adaptiveAlpha),p=parseInt(this._adaptiveMin,10),h=parseInt(this._adaptiveMax,10);try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:a,enabled:this._adaptiveEnabled,...c>=.1&&c<=.9?{ewa_alpha:c}:{},...!isNaN(p)&&p>=1?{min_interval_days:p}:{},...!isNaN(h)&&h>=1?{max_interval_days:h}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction}),this._adaptiveInitial=this._adaptiveSnapshot()}catch{}}this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}catch(t){this._error=P(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1,this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return _;let t=this._lang,e=this._triggerType==="compound";return n`
      <h3>${s("trigger_configuration",t)}</h3>
      <div class="select-row">
        <label>${s("trigger_type",t)}</label>
        <select
          .value=${this._triggerType}
          @change=${i=>this._triggerType=i.target.value}
        >
          ${re.map(i=>n`<option value=${i} ?selected=${i===this._triggerType}>${s(i,t)}</option>`)}
        </select>
      </div>
      ${e?this._renderCompoundEditor():n`
        ${this._entityPickerFallback?n`
          <ms-textfield
            label="${s("entity_id",t)} (${s("comma_separated",t)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${i=>{let u=i.target.value.split(",").map(c=>c.trim()).filter(Boolean);this._triggerEntityId=u[0]||"",this._triggerEntityIds=u,u[0]&&this._fetchEntityAttributes(u[0])}}
          ></ms-textfield>
        `:n`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:ot}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>s("entity_id",t)}
          @value-changed=${i=>{let a=(i.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=a[0]||"",this._triggerEntityIds=a,a[0]?this._fetchEntityAttributes(a[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?n`
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
      ${this._intervalDays?n`
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
    `}_patchCondition(t,e){this._compoundConditions=this._compoundConditions.map((i,a)=>a===t?{...i,...e}:i)}_addCondition(){this._compoundConditions=[...this._compoundConditions,ae()]}_removeCondition(t){this._compoundConditions=this._compoundConditions.filter((e,i)=>i!==t)}_renderCompoundEditor(){let t=this._lang;return n`
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
      ${this._compoundConditions.length===0?n`<div class="field-help">${s("compound_no_conditions",t)}</div>`:this._compoundConditions.map((e,i)=>this._renderCondition(e,i))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${s("compound_add_condition",t)}
      </button>
    `}_renderCondition(t,e){let i=this._lang,a=e+1;return n`
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
        ${this._entityPickerFallback?n`
          <ms-textfield
            label="${s("entity_id",i)} (${s("comma_separated",i)})"
            .value=${t.entityIds}
            @input=${u=>this._patchCondition(e,{entityIds:u.target.value})}
          ></ms-textfield>
        `:n`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:ot}}}]}
          .data=${{condition_entities:t.entityIds.split(",").map(u=>u.trim()).filter(Boolean)}}
          .computeLabel=${()=>s("entity_id",i)}
          @value-changed=${u=>{let c=(u.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(e,{entityIds:c.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(t,e)}
        <div class="select-row">
          <label>${s("trigger_type",i)}</label>
          <select
            .value=${t.type}
            @change=${u=>this._patchCondition(e,{type:u.target.value})}
          >
            ${Lt.map(u=>n`<option value=${u} ?selected=${u===t.type}>${s(u,i)}</option>`)}
          </select>
        </div>
        ${this._renderConditionTypeFields(t,e)}
      </div>
    `}_renderStateField(t){return this._entityPickerFallback||!t.entityId?n`
        <ms-textfield
          label=${t.label}
          .value=${t.value}
          @input=${e=>t.onInput(e.target.value)}
        ></ms-textfield>
      `:n`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:t.entityId}}}]}
        .data=${{s:t.value}}
        .computeLabel=${()=>t.label}
        @value-changed=${e=>t.onInput((e.detail.value.s||"").trim())}
      ></ha-form>
    `}_renderOnStatesField(t){let e=this._lang;return this._entityPickerFallback||!t.entityId?n`
        <ms-textfield
          label="${s("runtime_on_states",e)}"
          placeholder="on"
          .value=${t.value}
          @input=${i=>t.onInput(i.target.value)}
        ></ms-textfield>
      `:n`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:t.entityId,multiple:!0}}}]}
        .data=${{s:(t.value||"").split(",").map(i=>i.trim()).filter(Boolean)}}
        .computeLabel=${()=>s("runtime_on_states",e)}
        @value-changed=${i=>t.onInput((i.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(t){return this._scheduleType==="one_time"||this._scheduleType==="manual"?_:n`
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
        ${this._adaptiveEnabled?n`
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
    `}_renderAttributeSelect(t){let e=this._lang;return t.available.length>0?n`
        <div class="select-row">
          <label>${t.label}</label>
          <select
            .value=${t.value}
            @change=${i=>t.onSelect(i.target.value)}
          >
            <option value="" ?selected=${!t.value}>${s("use_entity_state",e)}</option>
            ${t.suggested.map(i=>n`<option value=${i} ?selected=${i===t.value}>${i} ★</option>`)}
            ${t.available.filter(i=>!t.suggested.includes(i.name)).map(i=>n`<option value=${i.name} ?selected=${i.name===t.value}>${i.name}${i.numeric?"":" (non-numeric)"}</option>`)}
          </select>
        </div>
      `:n`
      <ms-textfield
        label="${t.label}"
        .value=${t.value}
        @input=${i=>t.onSelect(i.target.value.trim())}
      ></ms-textfield>
    `}_renderEnvironmentalAttribute(t){this._fetchConditionAttributes(this._environmentalEntity);let e=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:s("environmental_attribute_optional",t),value:this._environmentalAttribute,suggested:e?.suggested??[],available:e?.available??[],onSelect:i=>this._environmentalAttribute=i})}_renderConditionAttribute(t,e){let i=t.entityIds.split(",")[0]?.trim()||"";i&&this._fetchConditionAttributes(i);let a=i?this._conditionAttrOptions[i]:void 0;return this._renderAttributeSelect({label:s("attribute_optional",this._lang),value:t.attribute,suggested:a?.suggested??[],available:a?.available??[],onSelect:u=>this._patchCondition(e,{attribute:u})})}_renderConditionTypeFields(t,e){let i=this._lang;if(t.type==="threshold")return n`
        <ms-textfield label="${s("trigger_above",i)}" type="number" .value=${t.above}
          @input=${a=>this._patchCondition(e,{above:a.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_below",i)}" type="number" .value=${t.below}
          @input=${a=>this._patchCondition(e,{below:a.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_equals",i)}" type="number" .value=${t.equals}
          @input=${a=>this._patchCondition(e,{equals:a.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_not_equals",i)}" type="number" .value=${t.notEquals}
          @input=${a=>this._patchCondition(e,{notEquals:a.target.value})}></ms-textfield>
        <ms-textfield label="${s("for_minutes",i)}" type="number" .value=${t.forMinutes}
          @input=${a=>this._patchCondition(e,{forMinutes:a.target.value})}></ms-textfield>
      `;if(t.type==="counter")return n`
        <ms-textfield label="${s("target_value",i)}" type="number" .value=${t.targetValue}
          @input=${a=>this._patchCondition(e,{targetValue:a.target.value})}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${t.deltaMode}
            @change=${a=>this._patchCondition(e,{deltaMode:a.target.checked})} />
          ${s("delta_mode",i)}
        </label>
      `;if(t.type==="state_change"){let a=t.entityIds.split(",")[0]?.trim()||"";return n`
        ${this._renderStateField({label:s("from_state_optional",i),value:t.fromState,entityId:a,onInput:u=>this._patchCondition(e,{fromState:u})})}
        ${this._renderStateField({label:s("to_state_optional",i),value:t.toState,entityId:a,onInput:u=>this._patchCondition(e,{toState:u})})}
        <ms-textfield label="${s("target_changes",i)}" type="number" .value=${t.targetChanges}
          @input=${u=>this._patchCondition(e,{targetChanges:u.target.value})}></ms-textfield>
      `}if(t.type==="runtime"){let a=t.entityIds.split(",")[0]?.trim()||"";return n`
        <ms-textfield label="${s("runtime_hours",i)}" type="number" .value=${t.runtimeHours}
          @input=${u=>this._patchCondition(e,{runtimeHours:u.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:t.onStates,entityId:a,onInput:u=>this._patchCondition(e,{onStates:u})})}
      `}return _}_renderUnitSelect(){let t=this._lang;return n`
      <div class="select-row">
        <label>${s("interval_unit",t)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${e=>this._intervalUnit=e.target.value}
        >
          ${["days","weeks","months","years"].map(e=>n`<option value=${e} ?selected=${e===this._intervalUnit}>${s("unit_"+e,t)}</option>`)}
        </select>
      </div>`}_toggleWeekday(t){this._weekdays=this._weekdays.includes(t)?this._weekdays.filter(e=>e!==t):[...this._weekdays,t]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(dt.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let t=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!t||t<=0?null:{kind:"interval",every:t,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(t){super.updated?.(t),this._scheduleEntityPickerProbe();for(let e of t.keys())if(m._PREVIEW_RELEVANT.has(String(e))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let t=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),e=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!t||!e){this._pickerProbeStrikes=0;return}let i=(p,h,v=0)=>{if(!(!p||v>10)){(p.tagName?.toLowerCase()??"")==="ha-entity-picker"&&h.push(p);for(let y of[p.shadowRoot,p])if(y)for(let $ of Array.from(y.children??[]))i($,h,v+1)}},a=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],u=[];for(let p of a)i(p,u);let c=u.length===0||u.some(p=>p.offsetHeight===0);if(t.offsetHeight===0||c){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let t=this._open?this._previewScheduleDict():null;if(!t){this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let e=++this._previewSeq;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:t,...this._lastPerformed?{last_performed:this._lastPerformed}:{}});if(e!==this._previewSeq)return;this._schedulePreview=i.occurrences||[],this._schedulePreviewEnded=!!i.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return _;let t=this._lang,e=this.scheduleTimeEnabled&&this._scheduleTime?` ${this._scheduleTime}`:"",i=this._schedulePreview.map((u,c)=>{let p=new Date(`${u}T12:00:00`).getDay();return`${nt(p===0?6:p-1,t,"short")} ${Y(u,t)}${c===0?e:""}`}).join(" \xB7 "),a=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?n`<div class="field-help">${s("schedule_preview_ontime",t)}</div>`:_;return n`
      <div class="trigger-live-hint schedule-preview">
        ${s("schedule_preview_title",t)}: ${i}${this._schedulePreviewEnded?n` <span class="field-help">${s("schedule_preview_ends",t)}</span>`:_}
        ${a}
      </div>
    `}_buildSchedule(){let t=i=>{let a=parseInt(this._calOffset,10)||0;return a&&(i.offset=Math.max(-15,Math.min(a,15))),i};if(this._scheduleType==="weekdays")return t({kind:"weekdays",weekdays:[...this._weekdays].sort((i,a)=>i-a)});if(this._scheduleType==="nth_weekday")return t({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});let e={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(e.business=!0),t(e)}_recurrenceExtras(){let t={};if(this._seasonMonths.length&&(t.season_months=[...this._seasonMonths].sort((e,i)=>e-i)),this._endsMode==="count"){let e=parseInt(this._endsCount,10);e>=1&&(t.ends={count:e})}else this._endsMode==="until"&&this._endsUntil&&(t.ends={until:this._endsUntil});return t}_toggleSeasonMonth(t){this._seasonMonths=this._seasonMonths.includes(t)?this._seasonMonths.filter(e=>e!==t):[...this._seasonMonths,t]}_renderRecurrenceExtras(){let t=this._lang;if(!(this._scheduleType==="time_based"||dt.includes(this._scheduleType)))return _;let i=ce(t);return n`
      <label class="field-label">${s("season_window_label",t)}</label>
      <div class="field-help">${s("season_window_hint",t)}</div>
      <div class="weekday-chips season-chips">
        ${i.map((a,u)=>n`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(u+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(u+1)}
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
      ${this._endsMode==="count"?n`
        <ms-textfield
          label="${s("series_end_count_label",t)}"
          type="number" min="1"
          .value=${this._endsCount}
          @input=${a=>this._endsCount=a.target.value}
        ></ms-textfield>`:_}
      ${this._endsMode==="until"?n`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${t}
          label="${s("series_end_until_label",t)}"
          .value=${this._endsUntil}
          @value-changed=${a=>this._endsUntil=a.detail.value}
        ></ms-date-field>`:_}
    `}_renderCalendarFields(){let t=this._lang,e=de(t);if(this._scheduleType==="weekdays")return n`
        <label class="field-label">${s("recurrence_on_days",t)}</label>
        <div class="weekday-chips">
          ${e.map((i,a)=>n`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(a)?"selected":""}"
              @click=${()=>this._toggleWeekday(a)}
            >${i}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let i=[["1",s("ord_1",t)],["2",s("ord_2",t)],["3",s("ord_3",t)],["4",s("ord_4",t)],["5",s("ord_5",t)],["-1",s("ord_last",t)]];return n`
        <div class="select-row">
          <label>${s("recurrence_occurrence",t)}</label>
          <select .value=${this._nth} @change=${a=>this._nth=a.target.value}>
            ${i.map(([a,u])=>n`<option value=${a} ?selected=${a===this._nth}>${u}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${s("recurrence_weekday",t)}</label>
          <select .value=${this._nthWeekday} @change=${a=>this._nthWeekday=a.target.value}>
            ${e.map((a,u)=>n`<option value=${String(u)} ?selected=${String(u)===this._nthWeekday}>${a}</option>`)}
          </select>
        </div>
        ${this._renderCalOffsetField()}`}return this._scheduleType==="day_of_month"?n`
        ${this._domLastDay?_:n`
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
        ${this._renderCalOffsetField()}`:_}_renderCalOffsetField(){let t=this._lang;return n`
      <ms-textfield
        label="${s("recurrence_offset",t)}"
        helper="${s("recurrence_offset_help",t)}"
        type="number"
        min="-15"
        max="15"
        .value=${this._calOffset}
        @input=${e=>this._calOffset=e.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let t=parseFloat(this._triggerAbove),e=parseFloat(this._triggerBelow);return!isNaN(t)&&!isNaN(e)&&e>t}_renderTriggerLiveHint(){if(this._triggerType==="compound")return _;let t=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?n`<div class="trigger-live-hint warn">${s("trigger_hint_overlap",this._lang)}</div>`:_,e=this._triggerEntityId||this._triggerEntityIds[0];if(!e||!this.hass?.states)return t;let i=this.hass.states[e];if(!i)return t;let a=this._lang,u=i.attributes?.unit_of_measurement,c=typeof u=="string"&&u?` ${u}`:"",p=this._triggerAttribute?i.attributes?.[this._triggerAttribute]:i.state,h=typeof p=="number"?p:parseFloat(String(p)),v=p!=="unknown"&&p!=="unavailable"&&p!=null&&!isNaN(h),y=f=>A(f,a,{maximumFractionDigits:1}),$=[];if(this._triggerType==="threshold"){let f=parseFloat(this._triggerAbove),S=parseFloat(this._triggerBelow);if(isNaN(f)&&isNaN(S))return _;v&&$.push(s("trigger_hint_now",a).replace("{value}",y(h)+c)),isNaN(f)||$.push(s("trigger_hint_above",a).replace("{target}",y(f)+c)),isNaN(S)||$.push(s("trigger_hint_below",a).replace("{target}",y(S)+c))}else if(this._triggerType==="counter"){let f=parseFloat(this._triggerTargetValue);if(isNaN(f))return _;this._triggerDeltaMode?this._taskId?$.push(s("trigger_hint_counter_delta_edit",a).replace("{target}",y(f)+c)):v?$.push(s("trigger_hint_counter_delta",a).replace("{value}",y(h)+c).replace("{due}",y(h+f)+c).replace("{target}",y(f)+c)):$.push(s("trigger_hint_counter_delta_edit",a).replace("{target}",y(f)+c)):(v&&$.push(s("trigger_hint_now",a).replace("{value}",y(h)+c)),$.push(s("trigger_hint_counter_abs",a).replace("{target}",y(f)+c)))}else if(this._triggerType==="runtime"){let f=parseFloat(this._triggerRuntimeHours);if(isNaN(f))return _;$.push(s("trigger_hint_runtime",a).replace("{hours}",y(f))),$.push(s("trigger_hint_state_now",a).replace("{value}",String(i.state)))}else if(this._triggerType==="state_change"){let f=parseInt(this._triggerTargetChanges,10)||1,S=this._triggerToState.trim();$.push((S?s("trigger_hint_state_change_to",a).replace("{state}",S):s("trigger_hint_state_change",a)).replace("{count}",String(f))),$.push(s("trigger_hint_state_now",a).replace("{value}",String(i.state)))}return $.length?n`<div class="trigger-live-hint">${$.join(" ")}</div>${t}`:t}_renderTriggerTypeFields(){let t=this._lang;return this._triggerType==="threshold"?n`
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
      `:this._triggerType==="counter"?n`
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
        ${this._triggerDeltaMode?n`
              <ms-textfield
                label="${s("baseline_start_value",t)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${e=>this._triggerBaselineValue=e.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?s("baseline_start_help_edit",t):s("baseline_start_help",t)}
                ${this._taskId&&this._liveBaselineValue!=null?n`<div class="baseline-effective">
                      ${s("baseline_current_effective",t).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:_}
              </div>
            `:_}
      `:this._triggerType==="state_change"?n`
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
      `:this._triggerType==="runtime"?n`
        <ms-textfield
          label="${s("runtime_hours",t)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${e=>this._triggerRuntimeHours=e.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("runtime_max_session",t)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeMaxSession}
          @input=${e=>this._triggerRuntimeMaxSession=e.target.value}
        ></ms-textfield>
        <div class="field-help">${s("runtime_max_session_help",t)}</div>
        ${this._renderOnStatesField({value:this._triggerOnStates,entityId:this._triggerEntityId,onInput:e=>this._triggerOnStates=e})}
        <div class="field-help">${s("runtime_on_states_help",t)}</div>
      `:_}render(){if(!this._open)return n``;let t=this._lang,e=this._taskId?s("edit_task",t):s("new_task",t);return n`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${e}</div>
        <div class="content">
          ${this._error?n`<div class="error">${this._error}</div>`:_}
          ${this._taskId===null&&this._objectChoices.length>0?n`
            <div class="select-row">
              <label>${s("object",t)}</label>
              <select
                .value=${this._entryId}
                @change=${i=>{this._entryId=i.target.value,this._consumesParts={},this._loadParts(),this._loadForeignPools()}}
              >
                ${this._objectChoices.map(i=>n`<option value=${i.entry_id} ?selected=${i.entry_id===this._entryId}>${i.name}</option>`)}
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
              ${ee.map(i=>n`<option value=${i} ?selected=${i===this._type}>${s(i,t)}</option>`)}
            </select>
          </div>
          ${this._type==="reading"?n`
                <ms-textfield
                  label="${s("reading_unit_label",t)}"
                  .value=${this._readingUnit}
                  @input=${i=>this._readingUnit=i.target.value}
                ></ms-textfield>
                <div class="field-help">${s("reading_unit_help",t)}</div>
              `:_}
          ${this._partsLoadFailed?n`<div class="field-help parts-load-failed">${s("parts_load_failed",t)}</div>`:_}
          ${this.parts.length||this._foreignOwners.length?n`
                <div class="field">
                  <label>${s("consumes_parts_label",t)}</label>
                  ${this.parts.map(i=>this._renderConsumesRow(i))}
                  ${this._foreignOwners.length?n`
                        <details class="shared-pools" ?open=${this._hasForeignPick}>
                          <summary>${s("shared_parts_other_objects",t)}</summary>
                          <div class="field-help">${s("shared_parts_help",t)}</div>
                          ${this._foreignOwners.map(i=>n`
                              <div class="shared-pool-owner">${i.name}</div>
                              ${i.parts.map(a=>this._renderConsumesRow(a,i.entry_id))}
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
              ${ie.map(i=>n`<option value=${i} ?selected=${i===this._priority}>${s("priority_"+i,t)}</option>`)}
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
              ${se.map(i=>n`<option value=${i} ?selected=${i===this._scheduleType}>${s(i,t)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?n`
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
                ${this.scheduleTimeEnabled?n`
                  <ms-date-field
                    kind="time"
                    clearable
                    .hass=${this.hass}
                    .lang=${t}
                    label="${s("schedule_time_optional",t)}"
                    .value=${this._scheduleTime}
                    helper="${s("schedule_time_help",t)}"
                    @value-changed=${i=>this._scheduleTime=i.detail.value}
                  ></ms-date-field>
                `:_}
              `:_}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?n`
                <ms-date-field
                  kind="date"
                  .hass=${this.hass}
                  .lang=${t}
                  label="${s("due_date",t)}"
                  .value=${this._dueDate}
                  @value-changed=${i=>this._dueDate=i.detail.value}
                ></ms-date-field>
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
          ${this.checklistsEnabled?n`
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
            ${lt.map(i=>n`
              <label class="req-option">
                <input
                  type="checkbox"
                  .checked=${this._requiredCompletion.includes(i)}
                  @change=${a=>this._toggleRequired(i,a.target.checked)}
                />
                <span>${s(X[i],t)}</span>
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
            @value-changed=${i=>this._lastPerformed=i.detail.value}
          ></ms-date-field>
          <div class="select-row">
            <label>${s("responsible_user",t)}</label>
            <select
              .value=${this._responsibleUserId||""}
              @change=${i=>{let a=i.target.value;this._responsibleUserId=a||null}}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${s("no_user_assigned",t)}</option>
              ${this._availableUsers.map(i=>n`<option value=${i.id} ?selected=${i.id===this._responsibleUserId}>${i.name}</option>`)}
            </select>
          </div>
          ${this._availableUsers.length>=2?n`
            <div class="field">
              <label>${s("shared_with",t)}</label>
              <div class="field-help">${s("shared_with_help",t)}</div>
              <div class="assignee-pool">
                ${this._availableUsers.map(i=>n`
                  <label class="pool-item">
                    <input type="checkbox"
                      .checked=${this._assigneePool.includes(i.id)}
                      @change=${()=>this._toggleAssignee(i.id)} />
                    <span>${i.name}</span>
                  </label>`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?n`
              <div class="select-row">
                <label>${s("rotation_strategy",t)}</label>
                <select
                  .value=${this._rotationStrategy}
                  @change=${i=>this._rotationStrategy=i.target.value}
                >
                  <option value="" ?selected=${!this._rotationStrategy}>${s("rotation_none",t)}</option>
                  ${["round_robin","least_completed","random"].map(i=>n`<option value=${i} ?selected=${i===this._rotationStrategy}>${s("rotation_"+i,t)}</option>`)}
                </select>
              </div>`:_}
          `:_}
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"?n`
            ${this._entityPickerFallback?n`
              <ms-textfield
                label="${s("environmental_entity_optional",t)}"
                helper="${s("environmental_entity_helper",t)}"
                .value=${this._environmentalEntity}
                @input=${i=>this._environmentalEntity=i.target.value.trim()}
              ></ms-textfield>
            `:n`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:At,device_class:Pt}}}]}
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
            multiline
            .rows=${3}
            .helper=${s("notes_markdown_hint",t)}
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
          ${this._availableTags.length>0?n`
              <div class="select-row">
                <label>${s("nfc_tag_id_optional",t)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${i=>this._nfcTagId=i.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${s("no_nfc_tag",t)}</option>
                  ${this._availableTags.map(i=>n`<option value=${i.id} ?selected=${i.id===this._nfcTagId}>${i.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${s("nfc_tags_refresh",t)}">↻</button>
              </div>
            `:n`
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
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${this._requireTagScan}
              @change=${i=>this._requireTagScan=i.target.checked}
            />
            <span>${s("require_tag_scan",t)}</span>
          </label>
          ${this._requireTagScan?n`<div class="field-help">${s("require_tag_scan_help",t)}</div>`:_}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._allowSkip}
              @change=${i=>this._allowSkip=!i.target.checked}
            />
            <span>${s("disallow_skip",t)}</span>
          </label>
          ${this._allowSkip?_:n`<div class="field-help">${s("disallow_skip_help",t)}</div>`}
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
    `}};m._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),m.styles=E`
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
  `,o([g({attribute:!1})],m.prototype,"hass",2),o([g({type:Boolean,attribute:"checklists-enabled"})],m.prototype,"checklistsEnabled",2),o([g({type:Boolean,attribute:"schedule-time-enabled"})],m.prototype,"scheduleTimeEnabled",2),o([g({type:Boolean,attribute:"completion-actions-enabled"})],m.prototype,"completionActionsEnabled",2),o([g({type:Number,attribute:"default-warning-days"})],m.prototype,"defaultWarningDays",2),o([d()],m.prototype,"parts",2),o([d()],m.prototype,"_foreignOwners",2),o([d()],m.prototype,"_open",2),o([d()],m.prototype,"_entityPickerFallback",2),o([d()],m.prototype,"_loading",2),o([d()],m.prototype,"_error",2),o([d()],m.prototype,"_entryId",2),o([d()],m.prototype,"_taskId",2),o([d()],m.prototype,"_objectChoices",2),o([d()],m.prototype,"_name",2),o([d()],m.prototype,"_type",2),o([d()],m.prototype,"_scheduleType",2),o([d()],m.prototype,"_intervalDays",2),o([d()],m.prototype,"_intervalUnit",2),o([d()],m.prototype,"_dueDate",2),o([d()],m.prototype,"_warningDays",2),o([d()],m.prototype,"_earliestCompletionDays",2),o([d()],m.prototype,"_intervalAnchor",2),o([d()],m.prototype,"_weekdays",2),o([d()],m.prototype,"_nth",2),o([d()],m.prototype,"_nthWeekday",2),o([d()],m.prototype,"_domDay",2),o([d()],m.prototype,"_domLastDay",2),o([d()],m.prototype,"_domBusiness",2),o([d()],m.prototype,"_calOffset",2),o([d()],m.prototype,"_seasonMonths",2),o([d()],m.prototype,"_endsMode",2),o([d()],m.prototype,"_endsCount",2),o([d()],m.prototype,"_endsUntil",2),o([d()],m.prototype,"_schedulePreview",2),o([d()],m.prototype,"_schedulePreviewEnded",2),o([d()],m.prototype,"_notes",2),o([d()],m.prototype,"_documentationUrl",2),o([d()],m.prototype,"_customIcon",2),o([d()],m.prototype,"_priority",2),o([d()],m.prototype,"_labels",2),o([d()],m.prototype,"_enabled",2),o([d()],m.prototype,"_triggerEntityId",2),o([d()],m.prototype,"_triggerEntityIds",2),o([d()],m.prototype,"_triggerEntityLogic",2),o([d()],m.prototype,"_triggerAttribute",2),o([d()],m.prototype,"_triggerType",2),o([d()],m.prototype,"_triggerAbove",2),o([d()],m.prototype,"_triggerBelow",2),o([d()],m.prototype,"_triggerEquals",2),o([d()],m.prototype,"_triggerNotEquals",2),o([d()],m.prototype,"_triggerForMinutes",2),o([d()],m.prototype,"_triggerCombinator",2),o([d()],m.prototype,"_triggerTargetValue",2),o([d()],m.prototype,"_triggerDeltaMode",2),o([d()],m.prototype,"_triggerBaselineValue",2),o([d()],m.prototype,"_liveBaselineValue",2),o([d()],m.prototype,"_autoCompleteOnRecovery",2),o([d()],m.prototype,"_triggerFromState",2),o([d()],m.prototype,"_triggerToState",2),o([d()],m.prototype,"_triggerTargetChanges",2),o([d()],m.prototype,"_triggerRuntimeHours",2),o([d()],m.prototype,"_triggerRuntimeMaxSession",2),o([d()],m.prototype,"_triggerOnStates",2),o([d()],m.prototype,"_compoundLogic",2),o([d()],m.prototype,"_compoundConditions",2),o([d()],m.prototype,"_suggestedAttributes",2),o([d()],m.prototype,"_availableAttributes",2),o([d()],m.prototype,"_entityDomain",2),o([d()],m.prototype,"_lastPerformed",2),o([d()],m.prototype,"_nfcTagId",2),o([d()],m.prototype,"_requireTagScan",2),o([d()],m.prototype,"_allowSkip",2),o([d()],m.prototype,"_readingUnit",2),o([d()],m.prototype,"_consumesParts",2),o([d()],m.prototype,"_partsLoadFailed",2),o([d()],m.prototype,"_availableTags",2),o([d()],m.prototype,"_responsibleUserId",2),o([d()],m.prototype,"_assigneePool",2),o([d()],m.prototype,"_rotationStrategy",2),o([d()],m.prototype,"_availableUsers",2),o([d()],m.prototype,"_checklistText",2),o([d()],m.prototype,"_phaseDefs",2),o([d()],m.prototype,"_phaseSeq",2),o([d()],m.prototype,"_requiredCompletion",2),o([d()],m.prototype,"_scheduleTime",2),o([d()],m.prototype,"_actionService",2),o([d()],m.prototype,"_actionTargetEntity",2),o([d()],m.prototype,"_actionData",2),o([d()],m.prototype,"_actionDataJsonFallback",2),o([d()],m.prototype,"_actionTesting",2),o([d()],m.prototype,"_actionTestResult",2),o([d()],m.prototype,"_actionTestError",2),o([d()],m.prototype,"_qcNotes",2),o([d()],m.prototype,"_qcCost",2),o([d()],m.prototype,"_qcDuration",2),o([d()],m.prototype,"_qcFeedback",2),o([d()],m.prototype,"_environmentalEntity",2),o([d()],m.prototype,"_environmentalAttribute",2),o([d()],m.prototype,"_adaptiveEnabled",2),o([d()],m.prototype,"_adaptiveAlpha",2),o([d()],m.prototype,"_adaptiveMin",2),o([d()],m.prototype,"_adaptiveMax",2),o([d()],m.prototype,"_adaptiveSeasonal",2),o([d()],m.prototype,"_adaptivePrediction",2),o([d()],m.prototype,"_conditionAttrOptions",2);var ct=m;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",ct);async function st(r,l,t){let e=new FormData;e.append("entry_id",l),e.append("tags","photo"),e.append("file",t,t.name);let i=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${r.auth?.data?.access_token??""}`},body:e});if(i.status===413)throw new Error("doc_too_large");if(!i.ok)throw new Error("doc_upload_failed");let a=await i.json();if(!a.id)throw new Error("doc_upload_failed");return a.id}async function J(r,l){await Promise.all(l.map(t=>r.connection.sendMessagePromise({type:"maintenance_supporter/documents/delete",doc_id:t}).catch(()=>{})))}var b=class extends I{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.restockDefault=null;this.restockUnitCost=null;this.currencySymbol="";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=[];this._uploadedIds=[];this._photoUploading=!1;this._readingValue="";this._restockQty="";this._completedAt="";this._usedParts={};this.checklistPrefill={}}open(t={}){this._open||(this._open=!0,this.viaTagScan=!!t.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((e,i)=>[String(i),!!this.checklistPrefill[e]]).filter(([,e])=>e)),this._feedback="needed",this._photos.forEach(e=>URL.revokeObjectURL(e.preview)),this._photos=[],this._uploadedIds=[],this._photoUploading=!1,this._readingValue="",this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(e=>[O(e),{...e}])))}_toggleCheck(t){let e=String(t);this._checklistState={...this._checklistState,[e]:!this._checklistState[e]}}_setFeedback(t){this._feedback=t}async _onPhotoInput(t){let e=t.target,i=Array.from(e.files??[]);if(e.value="",i.length===0)return;let a=10-this._photos.length,u=i.slice(0,Math.max(a,0));this._photoUploading=!0,this._error="";try{for(let c of u){let p=await st(this.hass,this.entryId,c);this._uploadedIds=[...this._uploadedIds,p],this._photos=[...this._photos,{id:p,preview:URL.createObjectURL(c)}]}i.length>u.length&&(this._error=s("photos_limit",this.lang).replace("{max}",String(10)))}catch(c){let p=c instanceof Error&&c.message==="doc_too_large"?"doc_too_large":"doc_upload_failed";this._error=s(p,this.lang)}finally{this._photoUploading=!1}}_removePhoto(t){let e=this._photos.find(i=>i.id===t);e&&URL.revokeObjectURL(e.preview),this._photos=this._photos.filter(i=>i.id!==t),this._uploadedIds.includes(t)&&(this._uploadedIds=this._uploadedIds.filter(i=>i!==t),J(this.hass,[t]))}async _complete(){this._loading=!0,this._error="";try{let t={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(t.notes=this._notes),this._cost){let e=parseFloat(this._cost);!isNaN(e)&&e>=0&&(t.cost=e)}if(this._duration){let e=parseInt(this._duration,10);!isNaN(e)&&e>=0&&(t.duration=e)}if(this.checklist.length>0&&(t.checklist_state=this._checklistState),this.adaptiveEnabled&&(t.feedback=this._feedback),this._photos.length>0&&(t.photo_doc_ids=this._photos.map(e=>e.id)),this.viaTagScan&&(t.via_tag_scan=!0),this._completedAt){if(new Date(this._completedAt).getTime()>Date.now()){this._error=s("completed_at_future_error",this.lang),this._loading=!1;return}t.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this._readingValue!==""){let e=parseFloat(this._readingValue);isNaN(e)||(t.reading_value=e)}if(this.restockDefault!==null&&this._restockQty!==""){let e=parseFloat(this._restockQty);!isNaN(e)&&e>=1&&(t.restock_quantity=e)}this.parts.length>0&&(t.used_parts=Object.values(this._usedParts).filter(e=>Number.isFinite(e.quantity)&&e.quantity>0).map(e=>e.entry_id?{part_id:e.part_id,quantity:e.quantity,entry_id:e.entry_id}:{part_id:e.part_id,quantity:e.quantity})),await this.hass.connection.sendMessagePromise(t),this._uploadedIds=[],this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(t){this._error=P(t,this.lang,s("save_error",this.lang))}finally{this._loading=!1}}get _missingRequired(){let t={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(e=>!t[e])}_req(t){return this.requiredFields.includes(t)?n`<span class="req-mark" aria-hidden="true">*</span>`:_}_partsCostSuggestion(){if(this.restockDefault!==null){let i=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(i)||i<=0?null:Math.round(this.restockUnitCost*i*100)/100}if(!this.parts.length)return null;let t=0,e=!1;for(let i of Object.values(this._usedParts)){let a=this.parts.find(u=>O({part_id:u.id,entry_id:u.entry_id})===O(i));a?.cost!=null&&(t+=a.cost*(i.quantity||1),e=!0)}return e?Math.round(t*100)/100:null}_renderCostSuggestion(t){if(this._cost.trim()!=="")return _;let e=this._partsCostSuggestion();if(e==null||e<=0)return _;let i=ft(e,this.currencySymbol,t);return n`<button
      type="button"
      class="cost-suggestion"
      @click=${()=>this._cost=String(Math.round(e*100)/100)}
    >${s("cost_from_parts",t).replace("{amount}",i)}</button>`}_close(){if(this._open=!1,this._uploadedIds.length>0){let t=this._uploadedIds;this._uploadedIds=[],J(this.hass,t)}}_pickCompletedAt(){let t=new Date,e=i=>String(i).padStart(2,"0");this._completedAt=`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}T${e(t.getHours())}:${e(t.getMinutes())}:00`}render(){if(!this._open)return n``;let t=this.lang||this.hass?.language||"en";return n`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${s("complete_title",t)}${this.taskName}</div>
        ${this.phaseLabel?n`<div class="phase-line">${s("phase_current",t)}: ${this.phaseLabel}</div>`:_}
        ${this.requireTagScan&&!this.viaTagScan?n`<div class="scan-required-note">${s("require_tag_scan_hint",t)}</div>`:_}
        <div class="content">
          ${this._error?n`<div class="error">${this._error}</div>`:_}
          ${this.checklist.length>0?n`
            <div class="checklist-section">
              <label class="checklist-label">${s("checklist",t)}</label>
              ${this.checklist.map((e,i)=>n`
                <label class="checklist-item" @click=${()=>this._toggleCheck(i)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(i)]} />
                  <span>${e}</span>
                </label>
              `)}
            </div>
          `:_}
          ${this.taskType==="reading"?n`
              <label class="field">
                <span class="field-label">${s("reading_value_label",t)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${e=>this._readingValue=e.target.value} />
              </label>`:_}
          ${this.parts.length?n`<div class="used-parts">
                <span class="field-label">${s("complete_parts_used",t)}</span>
                ${this.parts.map(e=>{let i=O({part_id:e.id,entry_id:e.entry_id}),a=this._usedParts[i],u=a!==void 0,c=e.entry_id?{part_id:e.id,quantity:1,entry_id:e.entry_id}:{part_id:e.id,quantity:1};return n`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${u}
                        @change=${p=>{let h={...this._usedParts};p.target.checked?h[i]=h[i]||c:delete h[i],this._usedParts=h}} />
                      <span
                        >${e.name}${e.owner_name?n`<span class="used-part-owner"> (${e.owner_name})</span>`:_}${e.stock!==null&&e.stock!==void 0?` (${e.stock}${e.unit?" "+e.unit:""})`:""}</span
                      >
                    </label>
                    ${u?n`<input class="used-part-qty" type="number" min="0.01" max="999" step="0.01"
                          .value=${String(a.quantity)}
                          @input=${p=>{let h=parseFloat(p.target.value);this._usedParts={...this._usedParts,[i]:{...c,quantity:Number.isFinite(h)&&h>=.01?h:1}}}} />`:_}
                  </div>`})}
              </div>`:this.consumesInfo.length?n`<div class="consumes-hint">
                  ${this.consumesInfo.map(e=>n`<div>${e}</div>`)}
                </div>`:_}
          ${this.restockDefault!==null?n`
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
          <div class="field">
            <span class="field-label">${s("completed_at_optional",t)}</span>
            ${this._completedAt?n`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${t}
                  .value=${this._completedAt}
                  @value-changed=${e=>this._completedAt=e.detail.value}
                ></ms-date-field>`:n`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${s("completed_at_pick",t)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${s("completion_photos_optional",t)}${this._req("photo")}</span>
            ${this._photos.length>0?n`<div class="photo-strip">
                  ${this._photos.map(e=>n`
                    <div class="photo-preview">
                      <img src=${e.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._removePhoto(e.id)}
                        title="${s("remove",t)}">✕</button>
                    </div>`)}
                </div>`:_}
            ${this._photos.length<10?n`<div class="photo-pickers">
                  <label class="photo-pick photo-pick-camera">
                    <ha-icon icon="mdi:camera"></ha-icon>
                    <span>${this._photoUploading?s("uploading",t):s("doc_camera",t)}</span>
                    <input type="file" accept="image/*" capture="environment"
                      ?disabled=${this._photoUploading}
                      @change=${this._onPhotoInput} />
                  </label>
                  <label class="photo-pick photo-pick-gallery">
                    <ha-icon icon="mdi:image-multiple"></ha-icon>
                    <span>${s("choose_photos",t)}</span>
                    <input type="file" accept="image/*" multiple
                      ?disabled=${this._photoUploading}
                      @change=${this._onPhotoInput} />
                  </label>
                </div>`:n`<div class="photo-limit">${s("photos_limit",t).replace("{max}",String(10))}</div>`}
          </div>
          ${this.adaptiveEnabled?n`
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
            title=${this._missingRequired.length?this._missingRequired.map(e=>s("err_required",t).replace("{field}",s(X[e]??e,t))).join(" \xB7 "):""}
          >
            ${this._loading?s("completing",t):s("complete",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};b.styles=[wt,E`
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
    .photo-pick input[type="file"] { display: none; }
    /* #161: several photos per completion — tiles wrap into a strip,
       the two pickers (camera / gallery) sit underneath while there is
       room left under the cap. */
    .photo-pickers {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
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
  `],o([g({attribute:!1})],b.prototype,"hass",2),o([g()],b.prototype,"entryId",2),o([g()],b.prototype,"taskId",2),o([g()],b.prototype,"taskName",2),o([g()],b.prototype,"lang",2),o([g({type:Array})],b.prototype,"checklist",2),o([g({type:Boolean})],b.prototype,"adaptiveEnabled",2),o([g()],b.prototype,"taskType",2),o([g()],b.prototype,"readingUnit",2),o([g({attribute:!1})],b.prototype,"restockDefault",2),o([g({attribute:!1})],b.prototype,"restockUnitCost",2),o([g()],b.prototype,"currencySymbol",2),o([g({attribute:!1})],b.prototype,"parts",2),o([g({attribute:!1})],b.prototype,"consumesParts",2),o([g({type:Array})],b.prototype,"consumesInfo",2),o([g({type:Array})],b.prototype,"requiredFields",2),o([g()],b.prototype,"phaseLabel",2),o([g({type:Boolean})],b.prototype,"requireTagScan",2),o([g({type:Boolean})],b.prototype,"viaTagScan",2),o([d()],b.prototype,"_open",2),o([d()],b.prototype,"_notes",2),o([d()],b.prototype,"_cost",2),o([d()],b.prototype,"_duration",2),o([d()],b.prototype,"_loading",2),o([d()],b.prototype,"_error",2),o([d()],b.prototype,"_checklistState",2),o([d()],b.prototype,"_feedback",2),o([d()],b.prototype,"_photos",2),o([d()],b.prototype,"_photoUploading",2),o([d()],b.prototype,"_readingValue",2),o([d()],b.prototype,"_restockQty",2),o([d()],b.prototype,"_completedAt",2),o([d()],b.prototype,"_usedParts",2),o([g({attribute:!1})],b.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",b);function Ct(r,l,t){let e=new Blob([r],{type:t}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=l,a.target="_blank",a.rel="noopener",a.style.display="none",document.body.appendChild(a),a.dispatchEvent(new MouseEvent("click")),document.body.removeChild(a),setTimeout(()=>URL.revokeObjectURL(i),6e4)}async function pe(r,l,t=300){return(await r.connection.sendMessagePromise({type:"auth/sign_path",path:l,expires:t})).path}async function qt(r,l,t=300){return pe(r,`/api/maintenance_supporter/document/${l}`,t)}var W=class extends I{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await qt(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?_:this._url?n`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:n`<div class="ph"></div>`}};W.styles=E`
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
  `,o([g({attribute:!1})],W.prototype,"hass",2),o([g()],W.prototype,"docId",2),o([d()],W.prototype,"_url",2),o([d()],W.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",W);var L=class extends I{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._photos=[];this._photosOriginal="";this._uploadedIds=[];this._photoUploading=!1}get _lang(){return C(this.hass)}openEdit(t){this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos=[...t.photo_doc_ids??[]],this._photosOriginal=JSON.stringify(this._photos),this._uploadedIds=[],this._photoUploading=!1,this._loadPartOptions()}async _onPhotoInput(t){let e=t.target,i=Array.from(e.files??[]);e.value="";let a=this._draft;if(i.length===0||!a)return;let u=10-this._photos.length,c=i.slice(0,Math.max(u,0));this._photoUploading=!0,this._error="";try{for(let p of c){let h=await st(this.hass,a.entry_id,p);this._uploadedIds=[...this._uploadedIds,h],this._photos=[...this._photos,h]}i.length>c.length&&(this._error=s("photos_limit",this._lang).replace("{max}",String(10)))}catch(p){let h=p instanceof Error&&p.message==="doc_too_large"?"doc_too_large":"doc_upload_failed";this._error=s(h,this._lang)}finally{this._photoUploading=!1}}_removePhoto(t){this._photos=this._photos.filter(e=>e!==t),this._uploadedIds.includes(t)&&(this._uploadedIds=this._uploadedIds.filter(e=>e!==t),J(this.hass,[t]))}async _loadPartOptions(){let t=this._draft;if(t)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"}),i=[];for(let u of e.parts||[]){let c=u.entry_id===t.entry_id,p=u.consumers.some(h=>h.entry_id===t.entry_id&&h.task_id===t.task_id);!c&&!p||i.push({part_id:u.part_id,name:u.name,entry_id:u.entry_id,foreign:!c,object_name:u.object_name})}for(let u of t.used_parts||[]){let c=u.entry_id||t.entry_id;i.some(p=>p.part_id===u.part_id&&p.entry_id===c)||i.push({part_id:u.part_id,name:u.name||u.part_id,entry_id:c,foreign:c!==t.entry_id,object_name:null})}let a={};for(let u of t.used_parts||[])a[`${u.entry_id||t.entry_id}:${u.part_id}`]=u.quantity??1;this._partOptions=i,this._partQty=a,this._partQtyOriginal=this._partSelectionKey()}catch{this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,t])=>t>0).sort(([t],[e])=>t.localeCompare(e)))}close(){if(this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._uploadedIds.length>0){let t=this._uploadedIds;this._uploadedIds=[],J(this.hass,t)}}_set(t,e){this._draft&&(this._draft={...this._draft,[t]:e})}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="";try{let t={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(t.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(t.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(t.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(t.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(t.completed_by=this._draft.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(t.used_parts=(this._partOptions||[]).filter(i=>(this._partQty[`${i.entry_id}:${i.part_id}`]||0)>0).map(i=>({part_id:i.part_id,quantity:this._partQty[`${i.entry_id}:${i.part_id}`],...i.foreign?{entry_id:i.entry_id}:{}}))),JSON.stringify(this._photos)!==this._photosOriginal&&(t.photo_doc_ids=[...this._photos]),Object.keys(t).filter(i=>!["type","entry_id","task_id","original_timestamp"].includes(i)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(t),this._uploadedIds=[],this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=P(t,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return _;let t=this._lang,e=this._draft;return n`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${s("history_edit_title",t)||"Edit history entry"}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${s(e.type,t)||e.type}</span>
        </div>
        <ms-date-field
          kind="datetime"
          required
          .hass=${this.hass}
          .lang=${t}
          .label=${s("history_edit_timestamp",t)||"Timestamp"}
          .value=${e.timestamp.slice(0,19)}
          @value-changed=${i=>{let a=i.detail.value;a&&this._set("timestamp",a)}}
        ></ms-date-field>
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
        ${this._partOptions&&this._partOptions.length>0?n`
          <div class="parts-block">
            <span class="parts-title">${s("complete_parts_used",t)}</span>
            ${this._partOptions.map(i=>{let a=`${i.entry_id}:${i.part_id}`,u=this._partQty[a]||0;return n`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${u>0}
                    @change=${c=>{let p=c.target.checked;this._partQty={...this._partQty,[a]:p?1:0}}} />
                  <span class="part-label">${i.name}${i.foreign&&i.object_name?` (${i.object_name})`:""}</span>
                  ${u>0?n`
                    <input class="part-qty" type="number" min="0.01" max="999" step="0.01"
                      .value=${String(u)}
                      @input=${c=>{let p=parseFloat(c.target.value);!isNaN(p)&&p>0&&(this._partQty={...this._partQty,[a]:p})}} />
                  `:_}
                </label>
              `})}
          </div>
        `:_}
        <div class="photos-block">
          <span class="parts-title">${s("completion_photos",t)}</span>
          ${this._photos.length>0?n`
            <div class="photo-strip">
              ${this._photos.map(i=>n`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${i}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${s("remove",t)}
                    @click=${()=>this._removePhoto(i)}>✕</button>
                </div>`)}
            </div>`:_}
          ${this._photos.length<10?n`
            <label class="photo-add">
              <ha-icon icon="mdi:image-plus"></ha-icon>
              <span>${this._photoUploading?s("uploading",t):s("add_photos",t)}</span>
              <input type="file" accept="image/*" multiple
                ?disabled=${this._photoUploading}
                @change=${this._onPhotoInput} />
            </label>`:n`<span class="photos-hint">${s("photos_limit",t).replace("{max}",String(10))}</span>`}
          <span class="photos-hint">${s("history_edit_photos_hint",t)}</span>
        </div>
        ${this._error?n`<div class="error">${this._error}</div>`:_}
        <div class="actions">
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${s("cancel",t)||"Cancel"}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?s("saving",t)||"Saving\u2026":s("save",t)||"Save"}
          </button>
        </div>
      </div>
    `}};L.styles=E`
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
    .photo-add {
      display: inline-flex; flex-direction: row; align-items: center; gap: 8px;
      width: fit-content; padding: 6px 10px;
      border: 1px dashed var(--divider-color, #444); border-radius: 8px;
      cursor: pointer; font-size: 13px; color: var(--secondary-text-color);
      --mdc-icon-size: 18px;
    }
    .photo-add:hover { border-color: var(--primary-color); }
    .photo-add input[type="file"] { display: none; }
    .photos-hint { font-size: 12px; color: var(--secondary-text-color); }
  `,o([g({attribute:!1})],L.prototype,"hass",2),o([d()],L.prototype,"_open",2),o([d()],L.prototype,"_saving",2),o([d()],L.prototype,"_error",2),o([d()],L.prototype,"_draft",2),o([d()],L.prototype,"_partOptions",2),o([d()],L.prototype,"_partQty",2),o([d()],L.prototype,"_photos",2),o([d()],L.prototype,"_photoUploading",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",L);function Z(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ht(r){return!r.startsWith("data:image/svg+xml,")&&!r.startsWith("data:image/png;base64,")?"":Z(r)}function he(r){return r.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var q=class extends I{constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(t,e){this._entryId=t,this._taskId=null,this._objectName=e,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}openForTask(t,e,i,a){this._entryId=t,this._taskId=e,this._objectName=i,this._taskName=a,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}async _generate(){let t=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null;try{let e={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(e.task_id=this._taskId);let i=[this.hass.connection.sendMessagePromise({...e,action:"view"})];this._taskId&&i.push(this.hass.connection.sendMessagePromise({...e,action:"complete"}));let a=await Promise.all(i);if(t!==this._generateSeq)return;this._viewResult=a[0],a.length>1&&(this._completeResult=a[1])}catch(e){if(t!==this._generateSeq)return;let i=e?.code,a=e?.message;this._error=i==="no_url"||typeof a=="string"&&a.includes("No Home Assistant URL")?s("qr_error_no_url",this.lang):s("qr_error",this.lang)}finally{t===this._generateSeq&&(this._loading=!1)}}_setUrlMode(t){this._urlMode!==t&&(this._urlMode=t,this._generate())}_print(){if(!this._viewResult)return;let t=this._viewResult,e=t.label.task_name?`${t.label.object_name} \u2014 ${t.label.task_name}`:t.label.object_name,i=[t.label.manufacturer,t.label.model].filter(Boolean).join(" "),a=window.open("","_blank","width=600,height=500");if(!a)return;let u=this.lang||"en",c=Z(e),p=Z(i),h=!!this._completeResult,v=Z(s("qr_action_view",u)),y=Z(s("qr_action_complete",u));a.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
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
  .qr-col img{width:${h?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${c}</h2>
${p?`<div class="sub">${p}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${Ht(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${v}</div>
  </div>
  ${h?`<div class="qr-col">
    <img src="${Ht(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${y}</div>
  </div>`:""}
</div>
<div class="url">${Z(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),a.document.close()}_downloadSvg(t,e){let i=decodeURIComponent(t.svg_data_uri.replace("data:image/svg+xml,","")),a=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;Ct(i,`qr-${he(a)}-${e}.svg`,"image/svg+xml")}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._error="",this._loading=!1}render(){if(!this._open)return n``;let t=this.lang||this.hass?.language||"en",e=this._taskName?`${s("qr_code",t)}: ${this._objectName} \u2014 ${this._taskName}`:`${s("qr_code",t)}: ${this._objectName}`,i=!!this._viewResult;return n`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${e}</div>
        <div class="content">
          ${this._loading?n`<div class="loading">${s("qr_generating",t)}</div>`:this._error?n`<div class="error">${this._error}</div>`:i?n`
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
                      ${this._completeResult?n`
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
    `}};q.styles=E`
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
  `,o([g({attribute:!1})],q.prototype,"hass",2),o([g()],q.prototype,"lang",2),o([d()],q.prototype,"_open",2),o([d()],q.prototype,"_loading",2),o([d()],q.prototype,"_error",2),o([d()],q.prototype,"_viewResult",2),o([d()],q.prototype,"_completeResult",2),o([d()],q.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",q);function Rt(r){let l=r.getFullYear(),t=String(r.getMonth()+1).padStart(2,"0"),e=String(r.getDate()).padStart(2,"0");return`${l}-${t}-${e}`}function ue(r,l){if(l<=0)return 0;let t=typeof r=="number"&&Number.isFinite(r)?Math.trunc(r):0;return t<0?0:t%l}function _e(r){return!!(r?.phases&&r.phase_sequence&&r.phase_sequence.length>0)}function pt(r){if(!r||!_e(r))return null;let l=r.phase_sequence,t=ue(r.phase_cursor,l.length),e=l[t],i=r.phases?.[e];return i?{id:e,name:i.name,index:t,count:l.length,notes:i.notes,checklist:i.checklist!==void 0?i.checklist:r.checklist??[],consumesParts:i.consumes_parts!==void 0?i.consumes_parts:r.consumes_parts??[],requiredFields:i.required_completion_fields!==void 0?i.required_completion_fields:r.required_completion_fields??[]}:null}function tt(r){let l=pt(r);return l?`${l.index+1}/${l.count} \xB7 ${l.name}`:""}function Nt(r){let l=r.task??null,t=l?pt(l):null,e=t?t.consumesParts:l?.consumes_parts||[],i=!!l?.part_ref,a=r.objects.find(p=>p.entry_id===r.entryId)?.parts||[],u=i?a.find(p=>p.id===l.part_ref.part_id):void 0,c=r.checklistsEnabled??!0;return{entry_id:r.entryId,task_id:r.taskId,task_name:r.taskName,checklist:t?c?t.checklist:[]:r.checklist??[],adaptive_enabled:!!r.adaptiveEnabled,required_completion_fields:t?t.requiredFields:l?.required_completion_fields||[],task_type:l?.type||"",reading_unit:l?.reading_unit||"",parts:i?[]:Tt({consumes_parts:e},r.entryId,r.objects,r.lang),consumes_parts:i?[]:e,phase_label:t?tt(l):"",require_tag_scan:!!l?.require_tag_scan,restock_default:i?u?.restock_quantity??1:null,restock_unit_cost:i?u?.cost??null:null,currency_symbol:r.currencySymbol??"",consumes_info:e.map(p=>St(p,r.entryId,r.objects,r.lang)),checklist_prefill:l?.checklist_progress||{},via_tag_scan:!!r.viaTagScan}}function Mt(r,l,t){r.entryId=l.entry_id,r.taskId=l.task_id,r.taskName=l.task_name,r.lang=t,r.checklist=l.checklist??[],r.adaptiveEnabled=!!l.adaptive_enabled,r.requiredFields=l.required_completion_fields??[],r.taskType=l.task_type??"",r.readingUnit=l.reading_unit??"",r.parts=l.parts??[],r.consumesParts=l.consumes_parts??[],r.phaseLabel=l.phase_label??"",r.requireTagScan=!!l.require_tag_scan,r.restockDefault=l.restock_default??null,r.restockUnitCost=l.restock_unit_cost??null,r.currencySymbol=l.currency_symbol??"",r.consumesInfo=l.consumes_info??[],r.checklistPrefill=l.checklist_prefill??{},r.viaTagScan=!!l.via_tag_scan,r.open({viaTagScan:!!l.via_tag_scan})}function x(r){return r.toFixed(1)}function Ot(r,l){let t=r.interval_analysis,e=t?.weibull_beta,i=t?.weibull_eta;if(e==null||i==null||i<=0)return _;let a=r.interval_days??0,u=r.suggested_interval??a;return n`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${s("weibull_reliability_curve",l)}
        ${me(e,l)}
      </div>
      ${ge(e,i,a,u,l)}
      ${ve(t,l)}
      ${t?.confidence_interval_low!=null?fe(t,r,l):_}
    </div>
  `}function me(r,l){let t,e,i;return r<.8?(t="early_failures",e="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):r<=1.2?(t="random_failures",e="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):r<=3.5?(t="wear_out",e="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(t="highly_predictable",e="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),n`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${e}"></ha-svg-icon>
      ${s(i,l)} (\u03B2=${A(r,l,2)})
    </span>
  `}function ge(r,l,t,e,i){let f=Math.max(t,e,l,1)*1.3,S=50,H=[];for(let R=0;R<=S;R++){let M=R/S*f,Zt=1-Math.exp(-Math.pow(M/l,r)),Xt=32+M/f*260,te=136-Zt*128;H.push([Xt,te])}let B=H.map(([R,M])=>`${x(R)},${x(M)}`).join(" "),K="M32,136 "+H.map(([R,M])=>`L${x(R)},${x(M)}`).join(" ")+` L${x(H[S][0])},136 Z`,N=32+t/f*260,D=1-Math.exp(-Math.pow(t/l,r)),Q=136-D*128,Gt=A((1-D)*100,i,0),ut=32+e/f*260,Jt=[0,.25,.5,.75,1];return n`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_weibull",i)}">
        ${Jt.map(R=>{let M=136-R*128;return G`
            <line x1="${32}" y1="${x(M)}" x2="${292}" y2="${x(M)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${R===.5?"4,3":_}" />
            <text x="${28}" y="${x(M+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${A(R*100,i,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(f/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(f)}</text>

        <path d="${K}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${B}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?G`
          <line x1="${x(N)}" y1="${8}" x2="${x(N)}" y2="${x(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${x(N)}" cy="${x(Q)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${x(N+4)}" y="${x(Q-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${Gt}%</text>
        `:_}

        ${e>0&&e!==t?G`
          <line x1="${x(ut)}" y1="${8}" x2="${x(ut)}" y2="${x(136)}"
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
      ${t>0?n`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${s("current_interval_marker",i)}</span>`:_}
      ${e>0&&e!==t?n`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${s("recommended_marker",i)}</span>`:_}
    </div>
  `}function ve(r,l){return n`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${s("characteristic_life",l)}</span>
        <span class="weibull-info-value">${Math.round(r.weibull_eta)} ${s("days",l)}</span>
      </div>
      ${r.weibull_r_squared!=null?n`
        <div class="weibull-info-item">
          <span>${s("weibull_r_squared",l)}</span>
          <span class="weibull-info-value">${A(r.weibull_r_squared,l,3)}</span>
        </div>
      `:_}
    </div>
  `}function fe(r,l,t){let e=r.confidence_interval_low,i=r.confidence_interval_high,a=l.suggested_interval??l.interval_days??0,u=l.interval_days??0,c=Math.max(0,e-5),h=i+5-c,v=(e-c)/h*100,y=(i-e)/h*100,$=(a-c)/h*100,f=u>0?(u-c)/h*100:-1;return n`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${s("confidence_interval",t)}: ${a} ${s("days",t)} (${e}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${x(v)}%;width:${x(y)}%"></div>
        ${f>=0?n`<div class="confidence-marker current" style="left:${x(f)}%"></div>`:_}
        <div class="confidence-marker recommended" style="left:${x($)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${s("confidence_conservative",t)} (${e}${s("days",t).charAt(0)})</span>
        <span class="confidence-text high">${s("confidence_aggressive",t)} (${i}${s("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function Ft(r,l,t){let e=r.degradation_trend!=null&&r.degradation_trend!=="insufficient_data",i=r.days_until_threshold!=null,a=r.environmental_factor!=null&&r.environmental_factor!==1;if(!e&&!i&&!a)return _;let u=r.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":r.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return n`
    <div class="prediction-section">
      ${r.sensor_prediction_urgency?n`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${s("sensor_prediction_urgency",l).replace("{days}",String(Math.round(r.days_until_threshold||0)))}
        </div>
      `:_}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${s("sensor_prediction",l)}
      </div>
      <div class="prediction-grid">
        ${e?n`
          <div class="prediction-item">
            <ha-svg-icon path="${u}"></ha-svg-icon>
            <span class="prediction-label">${s("degradation_trend",l)}</span>
            <span class="prediction-value ${r.degradation_trend}">${s("trend_"+r.degradation_trend,l)}</span>
            ${r.degradation_rate!=null?n`<span class="prediction-rate">${r.degradation_rate>0?"+":""}${A(r.degradation_rate,l,Math.abs(r.degradation_rate)>=10?0:1)} ${r.trigger_entity_info?.unit_of_measurement||""}/${s("day_short",l)}</span>`:_}
          </div>
        `:_}
        ${i?n`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${s("days_until_threshold",l)}</span>
            <span class="prediction-value prediction-days${r.days_until_threshold===0?" exceeded":r.sensor_prediction_urgency?" urgent":""}">${r.days_until_threshold===0?s("threshold_exceeded",l):"~"+Math.round(r.days_until_threshold)+" "+s("days",l)}</span>
            ${r.threshold_prediction_date?n`<span class="prediction-date">${Y(r.threshold_prediction_date,l)}</span>`:_}
            ${r.threshold_prediction_confidence?n`<span class="confidence-dot ${r.threshold_prediction_confidence}"></span>`:_}
            ${(r.prediction_cycles??0)>0?n`<span class="prediction-cycles">${s("prediction_cycles",l)}: ${r.prediction_cycles}</span>`:_}
          </div>
        `:_}
        ${a&&t.environmental?n`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${s("environmental_adjustment",l)}</span>
            <span class="prediction-value">${A(r.environmental_factor,l,2)}x</span>
            ${r.environmental_entity?n`<span class="prediction-entity entity-link" @click=${c=>kt(c,r.environmental_entity)}>${r.environmental_entity}</span>`:_}
          </div>
        `:_}
      </div>
    </div>
  `}function jt(r,l,t,e){let i=Math.max(r||1,l);return n`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${s("current",e)}: ${r??"\u2014"} ${r!=null?s("days",e):""}
        </div>
        <div class="interval-visual current"
          style="width: ${r!=null?Math.min(r/i*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${s("recommended",e)}: ${l} ${s("days",e)}
          <span class="confidence-badge ${t}">${s(`confidence_${t}`,e)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(l/i*100,100)}%"></div>
      </div>
    </div>
  `}var Dt=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function zt(r,l,t){if(!t.seasonal||!r.seasonal_factor||r.seasonal_factor===1)return _;let e=Dt.map(c=>s(c,l)),i=new Date().getMonth(),a=r.seasonal_factors||r.interval_analysis?.seasonal_factors||null,u=a&&a.length===12?a:e.map((c,p)=>{let h=r.seasonal_factor||1,v=Math.sin((p-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,h+v))});return n`
    <div class="seasonal-card-compact">
      <h4>${s("seasonal_awareness",l)}</h4>
      <div class="seasonal-mini-chart">
        ${u.map((c,p)=>{let h=c*40,v=c<.9?"low":c>1.1?"high":"normal";return n`
            <div class="seasonal-bar ${v} ${p===i?"current":""}"
                 style="height: ${h}px"
                 title="${e[p]}: ${A(c,l,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${s("shorter",l)||"K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${s("normal",l)||"Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${s("longer",l)||"L\xE4nger"}</span>
      </div>
    </div>
  `}function Ut(r,l){return be(r,l)}function be(r,l){let t=r.seasonal_factors??r.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return _;let e=r.interval_analysis?.seasonal_reason,i=new Date().getMonth(),a=300,u=100,c=8,h=u-c-4,v=Math.max(...t,1.5),y=a/12,$=y*.65,f=c+h-1/v*h;return n`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${s("seasonal_chart_title",l)}
        ${e?n`<span class="source-tag">${e==="learned"?s("seasonal_learned",l):s("seasonal_manual",l)}</span>`:_}
      </div>
      <svg viewBox="0 0 ${a} ${u}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_seasonal",l)}">
        <line x1="0" y1="${x(f)}" x2="${a}" y2="${x(f)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((S,H)=>{let B=S/v*h,K=H*y+(y-$)/2,N=c+h-B,D=H===i,Q=S<1?"var(--success-color, #4caf50)":S>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return G`
            <rect x="${x(K)}" y="${x(N)}"
              width="${x($)}" height="${x(B)}"
              fill="${Q}" opacity="${D?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${Dt.map((S,H)=>n`<span class="seasonal-label ${H===i?"active-month":""}">${s(S,l)}</span>`)}
      </div>
    </div>
  `}var w=class extends I{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._featuresLoaded=!1;this._currencySymbol=""}get _lang(){return C(this.hass)}async openFor(t,e){this._entryId=t,this._taskId=e,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=Rt(new Date),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){if(!this._featuresLoaded)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});t?.features&&(this._features={...this._features,...t.features}),this._currencySymbol=t?.budget?.currency_symbol||"",this._featuresLoaded=!0}catch{}}close(){this._open=!1,this._task=null,this._error=""}async _loadTask(){if(!(!this._entryId||!this._taskId))try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._objectName=t.object?.name||"";let e=(t.tasks||[]).find(i=>i.id===this._taskId);this._task=e??null}catch(t){this._error=P(t,this._lang)}}async _runWs(t){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(t),this._busy=!1,!0}catch(e){return this._error=P(e,this._lang),this._busy=!1,!1}}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||import("./dialog-mount-XWHNUPON.js").then(async({openCompleteDialog:t})=>{let e=this._task,i=[];try{i=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}t(Nt({entryId:this._entryId,taskId:this._taskId,taskName:e.name,task:e,objects:i,lang:this._lang,checklist:e.checklist||[],adaptiveEnabled:!!e.adaptive_config?.enabled,currencySymbol:this._currencySymbol}))&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||import("./dialog-mount-XWHNUPON.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("./dialog-mount-XWHNUPON.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let t=s("delete_task_confirm",this._lang)||`Delete "${this._task?.name}"?`;if(!window.confirm(t))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})&&(this._toast=s("suggestion_applied",this._lang)||"Applied",this._notifyChanged("apply_suggestion"),await this._loadTask(),setTimeout(()=>{this._toast=""},2500))}async _reanalyzeInterval(){if(!(!this._entryId||!this._taskId)){this._busy=!0,this._error="";try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});this._toast=t.recommended_interval?`${s("reanalyze_result",this._lang)||"Recomputed"}: ${yt(t.recommended_interval,"days",this._lang)} (${t.data_points} pts)`:s("reanalyze_insufficient_data",this._lang)||"Not enough data",await this._loadTask(),setTimeout(()=>{this._toast=""},3500)}catch(t){this._error=P(t,this._lang)}finally{this._busy=!1}}}_onEditHistoryEntry(t){!this._entryId||!this._taskId||import("./dialog-mount-XWHNUPON.js").then(({openHistoryEditDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,original_timestamp:t.timestamp,type:t.type,timestamp:t.timestamp,notes:t.notes??null,cost:t.cost??null,duration:t.duration??null,completed_by:t.completed_by??null,used_parts:t.used_parts??null,photo_doc_ids:_t(t)})})}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return _;let e=this._lang;return n`
      <div class="recommendation-card">
        <h4>${s("suggested_interval",e)}</h4>
        ${jt(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",e)}
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
    `}_renderAdaptive(t){let e=this._lang,i=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,a=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,u=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,c=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!i&&!a&&!u&&!c?n`<div class="adaptive-empty">
        ${s("adaptive_no_data",e)||"Not enough completion history yet for adaptive analysis."}
      </div>`:n`
      <div class="adaptive-stack">
        ${this._toast?n`<div class="toast">${this._toast}</div>`:_}
        ${i?this._renderRecommendation(t):_}
        ${a?Ft(t,e,this._features):_}
        ${u?Ot(t,e):_}
        ${c?n`
          ${zt(t,e,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?Ut(t,e):_}
        `:_}
      </div>
    `}_renderDetails(t){let e=this._lang,i=t.history||[],a=i.filter(p=>p.type==="completed"),u=a.reduce((p,h)=>p+(typeof h.cost=="number"?h.cost:0),0),c=(()=>{let p=a.map(h=>typeof h.duration=="number"?h.duration:null).filter(h=>h!=null);return p.length?Math.round(p.reduce((h,v)=>h+v,0)/p.length):null})();return n`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${s("times_performed",e)||"Performed"}</span>
            <span class="stat-value">${a.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("total_cost",e)||"Total cost"}</span>
            <span class="stat-value">${A(u,e,2)}</span>
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
        ${i.length===0?n`<div class="history-empty">${s("history_empty",e)||"No history yet."}</div>`:n`
              <div class="history-list">
                ${[...i].reverse().slice(0,20).map(p=>{let h=["completed","reset","skipped"].includes(p.type);return n`
                    <div class="history-entry">
                      <div class="history-line">
                        <span class="history-type type-${p.type}">${s(p.type,e)}</span>
                        <span class="history-date">${bt(p.timestamp,e)}</span>
                        ${h?n`<button class="history-edit"
                                   title="${s("history_edit_button",e)||"Edit"}"
                                   @click=${()=>this._onEditHistoryEntry(p)}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                            </button>`:_}
                      </div>
                      ${p.notes?n`<div class="history-notes">${p.notes}</div>`:_}
                      ${p.cost!=null||p.duration!=null?n`<div class="history-meta">
                            ${p.cost!=null?n`<span>💰 ${A(p.cost,e,2)}</span>`:_}
                            ${p.duration!=null?n`<span>⏱️ ${p.duration}m</span>`:_}
                          </div>`:_}
                    </div>
                  `})}
                ${i.length>20?n`<div class="history-more">… +${i.length-20} ${s("older_entries",e)||"older"}</div>`:_}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return _;let t=this._lang,e=this._task,i=this.hass?.user?.is_admin??!0;return n`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${e?n`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${et[e.status]||"#ccc"}"></span>
                  <span class="task-name">${e.name}</span>
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("./dialog-mount-XWHNUPON.js").then(({openObjectQuickActions:a})=>{a(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${e.next_due?n`<span><strong>${s("next_due",t)||"Next due"}:</strong> ${Y(e.next_due,t)}</span>`:_}
                  ${e.last_performed?n`<span><strong>${s("last_performed",t)||"Last"}:</strong> ${Y(e.last_performed,t)}</span>`:_}
                  ${e.schedule?.kind&&!["manual","one_time"].includes(e.schedule.kind)||e.interval_days!=null?n`<span><strong>${s("interval",t)||"Interval"}:</strong> ${xt(e,t)}</span>`:_}
                  ${tt(e)?n`<span><strong>${s("phase_current",t)}:</strong> ${tt(e)}</span>`:_}
                </div>
              </div>

              ${this._error?n`<div class="error">${this._error}</div>`:_}

              ${this._showSkip?n`
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
                  `:this._showReset?n`
                    <div class="inline-form">
                      <label>${s("reset_to_date",t)||"Reset last_performed to"}</label>
                      <ms-date-field
                        kind="date"
                        .hass=${this.hass}
                        .lang=${t}
                        .value=${this._resetDate}
                        @value-changed=${a=>{this._resetDate=a.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${s("cancel",t)||"Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${s("reset",t)||"Reset"}
                        </button>
                      </div>
                    </div>
                  `:n`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${this._onComplete} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${s("complete",t)||"Complete"}
                      </ha-button>
                      ${e.allow_skip!==!1?n`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${s("skip",t)||"Skip"}
                            </ha-button>
                          `:_}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${s("reset",t)||"Reset"}
                      </ha-button>
                    </div>
                    ${i?n`
                          <div class="actions secondary-row">
                            <ha-button size="small" appearance="outlined" variant="neutral" @click=${this._onEdit} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                              ${s("edit",t)||"Edit"}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="neutral" @click=${this._onQr} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                              ${s("qr_code",t)||"QR"}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="neutral"
                              @click=${e.archived?this._onUnarchive:this._onArchive}
                              .disabled=${this._busy}>
                              <ha-icon slot="start" icon="${e.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                              ${e.archived?s("unarchive",t)||"Unarchive":s("archive",t)||"Archive"}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="danger" class="danger" @click=${this._onDelete} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                              ${s("delete",t)||"Delete"}
                            </ha-button>
                          </div>
                        `:_}
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?s("hide_details",t)||"Hide details":s("show_details",t)||"Show history + stats"}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?n`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
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
            `:n`<div class="loading">${s("loading",t)||"Loading\u2026"}</div>`}
      </div>
    `}};w.styles=[Et,E`
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
  `],o([g({attribute:!1})],w.prototype,"hass",2),o([d()],w.prototype,"_open",2),o([d()],w.prototype,"_entryId",2),o([d()],w.prototype,"_taskId",2),o([d()],w.prototype,"_task",2),o([d()],w.prototype,"_objectName",2),o([d()],w.prototype,"_busy",2),o([d()],w.prototype,"_error",2),o([d()],w.prototype,"_showSkip",2),o([d()],w.prototype,"_showReset",2),o([d()],w.prototype,"_showDetails",2),o([d()],w.prototype,"_showAdaptive",2),o([d()],w.prototype,"_skipReason",2),o([d()],w.prototype,"_resetDate",2),o([d()],w.prototype,"_features",2),o([d()],w.prototype,"_toast",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",w);function Vt(r){return!!r&&/^https?:\/\//i.test(r)}function Bt(r){return r?customElements.get("ha-markdown")?n`<ha-markdown class="notes-md" .content=${r} breaks></ha-markdown>`:n`${r}`:_}var j=class extends I{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error=""}get _lang(){return C(this.hass)}async openFor(t){this._entryId=t,this._error="",this._open=!0,await this._load()}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._data=t}catch(t){this._error=P(t,this._lang)}}_onEditObject(){!this._entryId||!this._data||import("./dialog-mount-XWHNUPON.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("./dialog-mount-XWHNUPON.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data)return;let t=s("delete_object_confirm",this._lang)||`Delete "${this._data.object.name}" and all its tasks?`;if(window.confirm(t)){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=P(e,this._lang)}finally{this._busy=!1}}}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t){let e=s("confirm_archive_object",this._lang)||"Archive this object and its tasks?";if(!window.confirm(e))return}this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=P(e,this._lang)}finally{this._busy=!1}}_onTaskClick(t){this._entryId&&import("./dialog-mount-XWHNUPON.js").then(({openTaskQuickActions:e})=>{e(this._entryId,t)})}render(){if(!this._open)return _;let t=this._lang,e=this._data,i=e?.object,a=e?.tasks||[],u=this.hass?.user?.is_admin??!0;return n`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${e&&i?n`
              <div class="header">
                <div class="title">${i.name}</div>
                ${this._renderMetaRow(i)}
              </div>

              ${this._error?n`<div class="error">${this._error}</div>`:_}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${s("tasks",t)||"Tasks"}</strong>
                  <span class="count">${a.length}</span>
                </div>
                ${a.length===0?n`<div class="empty">${s("no_tasks",t)||"No tasks yet."}</div>`:n`
                      <div class="task-list">
                        ${a.map(c=>n`
                          <div class="task-row" @click=${()=>this._onTaskClick(c.id)}>
                            <span class="status-dot" style="background: ${et[c.status]||"#ccc"}"></span>
                            <span class="task-name">${c.name}</span>
                            <span class="task-status">${s(c.status||"ok",t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${i.notes?n`
                    <div class="notes-section">
                      <strong>${s("object_notes_label",t)}</strong>
                      <div class="notes-body">${Bt(i.notes)}</div>
                    </div>
                  `:_}

              ${u?n`
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
            `:n`<div class="loading">${s("loading",t)||"Loading\u2026"}</div>`}
      </div>
    `}_renderMetaRow(t){let e=this._lang,i=[];return t.area_id&&i.push([s("area",e),t.area_id]),t.manufacturer&&i.push([s("manufacturer",e),t.manufacturer]),t.model&&i.push([s("model",e),t.model]),t.serial_number&&i.push([s("serial_number_label",e),t.serial_number]),t.installation_date&&i.push([s("installed",e),t.installation_date]),t.warranty_expiry&&i.push([s("warranty",e),t.warranty_expiry]),t.documentation_url&&i.push([s("documentation_url_label",e),t.documentation_url]),i.length===0?_:n`
      <div class="meta">
        ${i.map(([a,u])=>n`
            <div class="meta-item">
              <span class="meta-label">${a}</span>
              <span class="meta-value">${Vt(u)?n`<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`:u}</span>
            </div>
          `)}
      </div>
    `}};j.styles=E`
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
  `,o([g({attribute:!1})],j.prototype,"hass",2),o([d()],j.prototype,"_open",2),o([d()],j.prototype,"_entryId",2),o([d()],j.prototype,"_data",2),o([d()],j.prototype,"_busy",2),o([d()],j.prototype,"_error",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",j);var ht={features:{adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1},defaultWarningDays:7,rowActionStyle:"buttons_compact"};function Wt(){let r=window;return r.__msSettingsCache??={promise:null}}function rt(r){let l=Wt();if(l.promise)return l.promise;let t=r.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(e=>({features:e.features??ht.features,defaultWarningDays:e.general?.default_warning_days??7,rowActionStyle:e.general?.row_action_style??ht.rowActionStyle})).catch(()=>(l.promise===t&&(l.promise=null),ht));return l.promise=t,t}function Kt(){Wt().promise=null}var Yt="maintenance-object-dialog",Qt="maintenance-task-dialog",ye="maintenance-history-edit-dialog",$e="maintenance-complete-dialog",xe="maintenance-qr-dialog",ke="maintenance-task-quick-actions-dialog",we="maintenance-object-quick-actions-dialog";function at(){return document.querySelector("home-assistant")?.hass}function Ee(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function U(r){let l=Ee(),t=l.querySelector(r)??document.body.querySelector(r);return t?t.parentNode!==l&&l.appendChild(t):(t=document.createElement(r),l.appendChild(t)),t}function V(r){let l=at();if(!l)return!1;r.hass=l;let t=C(l);return mt(t)||gt(t).then(()=>{r.requestUpdate?.()}),vt(l.locale,l.config?.country),!0}function Ws(r){return rt(r).then(l=>l.rowActionStyle)}function Ks(){Kt()}function Ys(){let r=U(Yt);return V(r)?(r.openCreate(),!0):!1}function Qs(r,l){let t=U(Yt);return V(t)?(t.openEdit(r,l),!0):!1}function Gs(r="",l){let t=U(Qt);if(!V(t))return!1;let e=at();return e?((async()=>{let i=await rt(e),a=t;a.checklistsEnabled=i.features.checklists,a.scheduleTimeEnabled=i.features.schedule_time,a.completionActionsEnabled=i.features.completion_actions,a.defaultWarningDays=i.defaultWarningDays,a.openCreate(r,l)})(),!0):!1}function Js(r,l){let t=U(Qt);if(!V(t))return!1;let e=at();return e?((async()=>{try{let[i,a]=await Promise.all([e.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:r}),rt(e)]),u=(i.tasks||[]).find(p=>p.id===l);if(!u){console.warn(`openEditTaskDialog: task ${l} not found in entry ${r}`);return}let c=t;c.checklistsEnabled=a.features.checklists,c.scheduleTimeEnabled=a.features.schedule_time,c.completionActionsEnabled=a.features.completion_actions,c.defaultWarningDays=a.defaultWarningDays,await c.openEdit(r,u)}catch(i){console.warn("openEditTaskDialog: failed to load task/features",i)}})(),!0):!1}function Zs(r){let l=U(ye);return V(l)?(l.openEdit(r),!0):!1}function Xs(r){let l=U($e);return V(l)?(Mt(l,r,at()?.language||"en"),!0):!1}function tr(r){let l=U(xe);return V(l)?(l.openForTask(r.entry_id,r.task_id,r.object_name,r.task_name),!0):!1}function er(r,l){let t=U(ke);return V(t)?(t.openFor(r,l),!0):!1}function ir(r){let l=U(we);return V(l)?(l.openFor(r),!0):!1}export{Ks as __resetSettingsCacheForTests,Ws as getRowActionStyle,Xs as openCompleteDialog,Ys as openCreateObjectDialog,Gs as openCreateTaskDialog,Qs as openEditObjectDialog,Js as openEditTaskDialog,Zs as openHistoryEditDialog,ir as openObjectQuickActions,tr as openQrDialog,er as openTaskQuickActions};
