/*! maintenance_supporter frontend 2.58.0 */
import"/maintenance_supporter_panelfiles/panel-chunks/chunk-7UOPU2CL.js";import{a as N,b as H}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6HOHOTKU.js";import{a as x}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6LSK7BBU.js";import{a as P}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-F567KB5W.js";import{a as L}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-2TYYX7JG.js";import{a,b as T,c as l,f as p,g as k,i as $,j as o,n as s,o as C,s as A,v as E}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-5LZFNUMR.js";var w=["sensor","binary_sensor","number","input_number","input_boolean","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock"],F=["sensor"],R=["temperature","humidity","pressure"];var M=["cleaning","inspection","replacement","calibration","service","reading","custom"],q=["low","normal","high"],U=["time_based","weekdays","nth_weekday","day_of_month","sensor_based","one_time","manual"],I=["weekdays","nth_weekday","day_of_month"],O=["threshold","counter","state_change","runtime"],j=[...O,"compound"],y={alpha:"0.3",min:"7",max:"365"};function B(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",carry:{}}}var V=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states"]);function D(u){return{entityIds:(u.entity_ids||(u.entity_id?[u.entity_id]:[])).join(", "),type:u.type||"threshold",attribute:u.attribute||"",above:u.trigger_above?.toString()??"",below:u.trigger_below?.toString()??"",forMinutes:u.trigger_for_minutes?.toString()??"0",targetValue:u.trigger_target_value?.toString()??"",deltaMode:u.trigger_delta_mode||!1,fromState:u.trigger_from_state||"",toState:u.trigger_to_state||"",targetChanges:u.trigger_target_changes?.toString()??"",runtimeHours:u.trigger_runtime_hours?.toString()??"",onStates:(u.trigger_on_states||[]).join(", "),carry:Object.fromEntries(Object.entries(u).filter(([t])=>!V.has(t)&&!t.startsWith("_")))}}function z(u){let b=u.entityIds.split(",").map(i=>i.trim()).filter(Boolean);if(b.length===0)return null;let t={...u.carry||{},entity_id:b[0],entity_ids:b,type:u.type};if(u.attribute&&(t.attribute=u.attribute),u.type==="threshold"){let i=parseFloat(u.above);isNaN(i)||(t.trigger_above=i);let e=parseFloat(u.below);isNaN(e)||(t.trigger_below=e);let r=parseInt(u.forMinutes,10);isNaN(r)||(t.trigger_for_minutes=r)}else if(u.type==="counter"){let i=parseFloat(u.targetValue);isNaN(i)||(t.trigger_target_value=i),t.trigger_delta_mode=u.deltaMode}else if(u.type==="state_change"){u.fromState&&(t.trigger_from_state=u.fromState),u.toState&&(t.trigger_to_state=u.toState);let i=parseInt(u.targetChanges,10);isNaN(i)||(t.trigger_target_changes=i)}else if(u.type==="runtime"){let i=parseFloat(u.runtimeHours);isNaN(i)||(t.trigger_runtime_hours=i);let e=(u.onStates||"").split(",").map(r=>r.trim()).filter(Boolean);e.length>0&&(t.trigger_on_states=e)}return t}function W(u){return Array.from({length:7},(b,t)=>E(t,u,"short"))}function K(u){let b=new Intl.DateTimeFormat(u||"en",{month:"short"});return Array.from({length:12},(t,i)=>b.format(new Date(2021,i,1)))}var n=class n extends k{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.defaultWarningDays=7;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._entryId="";this._taskId=null;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._priority="normal";this._labels="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerForMinutes="0";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerOnStates="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._readingUnit="";this._consumesParts={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._requiredCompletion=[];this._scheduleTime="";this._actionService="";this._actionTargetEntity="";this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=y.alpha;this._adaptiveMin=y.min;this._adaptiveMax=y.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return C(this.hass)}async openCreate(t,i){this._entryId=t,this._taskId=null,this._error="",!t&&i&&i.length>0?(this._objectChoices=i.map(e=>({entry_id:e.entry_id,name:e.object.name})).sort((e,r)=>e.name.localeCompare(r.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(t,i){this._entryId=t,this._taskId=i.id,this._error="",this._name=i.name,this._type=i.type,this._scheduleType=i.schedule_type,this._intervalDays=i.interval_days!=null?String(i.interval_days):"",this._intervalUnit=i.interval_unit||"days",this._dueDate=i.due_date||"";let e=i.schedule;this._weekdays=e?.kind==="weekdays"?[...e.weekdays??[]]:[],this._nth=e?.kind==="nth_weekday"?String(e.nth??1):"1",this._nthWeekday=e?.kind==="nth_weekday"?String(e.weekday??5):"5",this._domDay=e?.kind==="day_of_month"&&(e.day??1)>=1?String(e.day??1):"1",this._domLastDay=e?.kind==="day_of_month"&&e.day===-1,this._domBusiness=e?.kind==="day_of_month"&&e.business===!0,this._calOffset=e?.offset?String(e.offset):"0",this._seasonMonths=Array.isArray(e?.season_months)?[...e.season_months]:[];let r=e?.ends;r&&typeof r.count=="number"?(this._endsMode="count",this._endsCount=String(r.count),this._endsUntil=""):r&&typeof r.until=="string"?(this._endsMode="until",this._endsUntil=r.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=i.warning_days.toString(),this._earliestCompletionDays=i.earliest_completion_days!=null?String(i.earliest_completion_days):"",this._intervalAnchor=i.interval_anchor||"completion",this._notes=i.notes||"",this._documentationUrl=i.documentation_url||"",this._customIcon=i.custom_icon||"",this._priority=i.priority||"normal",this._labels=(i.labels||[]).join(", "),this._enabled=i.enabled!==!1,this._lastPerformed=i.last_performed||"",this._nfcTagId=i.nfc_tag_id||"",this._readingUnit=i.reading_unit||"",this._consumesParts=Object.fromEntries((i.consumes_parts||[]).map(h=>[x(h),{...h}])),this._responsibleUserId=i.responsible_user_id||null,this._assigneePool=[...i.assignee_pool||[]],this._rotationStrategy=i.rotation_strategy||"",this._checklistText=(i.checklist||[]).join(`
`),this._requiredCompletion=[...i.required_completion_fields||[]],this._scheduleTime=i.schedule_time||"";let d=i.on_complete_action;if(d&&d.service){this._actionService=d.service;let h=d.target?.entity_id;this._actionTargetEntity=Array.isArray(h)?h[0]||"":h||"",this._actionData=d.data&&typeof d.data=="object"?{...d.data}:{},this._actionDataJsonFallback=""}else this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="";let c=i.quick_complete_defaults;this._qcNotes=c?.notes||"",this._qcCost=c?.cost!=null?String(c.cost):"",this._qcDuration=c?.duration!=null?String(c.duration):"",this._qcFeedback=c?.feedback||"";let _=i.adaptive_config||{};if(this._environmentalEntity=_.environmental_entity||"",this._environmentalAttribute=_.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!_.enabled,this._adaptiveAlpha=_.ewa_alpha?.toString()??y.alpha,this._adaptiveMin=_.min_interval_days?.toString()??y.min,this._adaptiveMax=_.max_interval_days?.toString()??y.max,this._adaptiveSeasonal=_.seasonal_enabled!==!1,this._adaptivePrediction=_.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),i.trigger_config){let h=i.trigger_config;this._triggerEntityId=h.entity_id||h.entity_ids&&h.entity_ids[0]||"",this._triggerEntityIds=h.entity_ids||(h.entity_id?[h.entity_id]:[]),this._triggerEntityLogic=h.entity_logic||"any",this._triggerAttribute=h.attribute||"",this._triggerType=h.type||"threshold",this._triggerAbove=h.trigger_above?.toString()||"",this._triggerBelow=h.trigger_below?.toString()||"",this._triggerForMinutes=h.trigger_for_minutes?.toString()||"0",this._triggerTargetValue=h.trigger_target_value?.toString()||"",this._triggerDeltaMode=h.trigger_delta_mode||!1,this._triggerBaselineValue=h.trigger_baseline_value?.toString()||"",this._liveBaselineValue=i.trigger_baseline_value??null,this._autoCompleteOnRecovery=h.auto_complete_on_recovery||!1,this._triggerFromState=h.trigger_from_state||"",this._triggerToState=h.trigger_to_state||"",this._triggerTargetChanges=h.trigger_target_changes?.toString()||"",this._triggerRuntimeHours=h.trigger_runtime_hours?.toString()||"",this._triggerOnStates=(h.trigger_on_states||[]).join(", "),h.type==="compound"?(this._compoundLogic=h.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(h.conditions||[]).map(D)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._priority="normal",this._labels="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._readingUnit="",this._consumesParts={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._requiredCompletion=[],this._scheduleTime="",this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=y.alpha,this._adaptiveMin=y.min,this._adaptiveMax=y.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="",this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._triggerAttribute="",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerForMinutes="0",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges="",this._triggerRuntimeHours="",this._triggerOnStates="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new L(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(t){console.error("Failed to load users:",t),this._availableUsers=[]}}_toggleAssignee(t){this._assigneePool=this._assigneePool.includes(t)?this._assigneePool.filter(i=>i!==t):[...this._assigneePool,t]}async _testAction(){let t=this._actionService.trim();if(!t||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(t)){this._actionTestResult="error",this._actionTestError="Invalid service format (expected 'domain.service')",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[i,e]=t.split(".");if(!this.hass?.services?.[i]?.[e]){this._actionTestResult="error",this._actionTestError=`Service "${t}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let r=this._actionTargetEntity.trim();if(r){let d=r.split(".")[0];if(d!==i&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(i)){this._actionTestResult="error",this._actionTestError=`Service "${t}" only works on ${i}.* entities; entity "${r}" is in ${d}.* \u2014 pick a service that matches the entity domain (e.g. ${d}.${e})`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[r]){this._actionTestResult="error",this._actionTestError=`Target entity "${r}" not found in Home Assistant \u2014 the entity may have been renamed or its integration removed.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let t=JSON.parse(this._actionDataJsonFallback);if(t&&typeof t=="object"&&!Array.isArray(t))return t}catch{}return{...this._actionData}}_serviceSchema(){let t=this._actionService.trim();if(!t||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(t))return null;let[i,e]=t.split("."),r=this.hass?.services?.[i]?.[e]?.fields;return!r||Object.keys(r).length===0?null:Object.entries(r).map(([d,c])=>({name:d,required:!!c.required,selector:c.selector||{text:{}}}))}_renderCompletionActionsSection(t){if(!this.completionActionsEnabled)return p;let i=this._serviceSchema();return l`
      <details class="ca-section">
        <summary>${s("on_complete_action_title",t)}</summary>
        <p class="field-help">${s("on_complete_action_desc",t)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${e=>{this._actionService=e.detail.value||"";let r=this._serviceSchema();if(r){let d=new Set(r.map(c=>c.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([c])=>d.has(c)))}}}
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
          ${this._actionTestResult==="ok"?l`<span class="ca-test-ok">${s("on_complete_action_test_success",t)}</span>`:p}
          ${this._actionTestResult==="error"?l`<div class="ca-test-error-block">
                <span class="ca-test-error">${s("on_complete_action_test_failed",t)}</span>
                ${this._actionTestError?l`<div class="ca-test-error-detail">${this._actionTestError}</div>`:p}
              </div>`:p}
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
    `}async _loadParts(){if(this.parts=[],!!this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this.parts=t.parts||[],this._partsLoadFailed=!1}catch{this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){if(this._foreignOwners=[],!!this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._foreignOwners=(t.objects||[]).filter(i=>i.entry_id!==this._entryId&&(i.parts||[]).length>0).map(i=>({entry_id:i.entry_id,name:i.object?.name||i.entry_id,parts:i.parts||[]})).sort((i,e)=>i.name.localeCompare(e.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=t.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(t){!t||!this.hass||this._conditionAttrOptions[t]||this._conditionAttrPending.has(t)||(this._conditionAttrPending.add(t),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:t}).then(i=>{let e=i;this._conditionAttrOptions={...this._conditionAttrOptions,[t]:{suggested:e.suggested_attributes||[],available:e.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[t]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(t){if(!t||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:t});this._entityDomain=i.domain||"",this._suggestedAttributes=i.suggested_attributes||[],this._availableAttributes=i.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(t=>!!t.entry_id)}_renderConsumesRow(t,i){let e=x({part_id:t.id,entry_id:i}),r=this._consumesParts[e],d=i?{part_id:t.id,quantity:1,entry_id:i}:{part_id:t.id,quantity:1};return l`
      <div class="consumes-row">
        <label class="consumes-check">
          <input
            type="checkbox"
            .checked=${r!==void 0}
            @change=${c=>{let _={...this._consumesParts};c.target.checked?_[e]=_[e]||d:delete _[e],this._consumesParts=_}}
          />
          <span>${t.name}${t.unit?` (${t.unit})`:""}</span>
        </label>
        ${r!==void 0?l`<input
              class="consumes-qty"
              type="number"
              min="0.01"
              max="999"
              step="0.01"
              .value=${String(r.quantity)}
              @input=${c=>{let _=parseFloat(c.target.value);this._consumesParts={...this._consumesParts,[e]:{...d,quantity:Number.isFinite(_)&&_>=.01?_:1}}}}
            />`:p}
      </div>
    `}_toggleRequired(t,i){let e=new Set(this._requiredCompletion);i?e.add(t):e.delete(t),this._requiredCompletion=[...e]}async _save(){if(!this._loading&&this._name.trim()){if(this._adaptiveSnapshot()!==this._adaptiveInitial){let t=parseInt(this._adaptiveMin,10),i=parseInt(this._adaptiveMax,10);if(!isNaN(t)&&!isNaN(i)&&t>i){this._error=`${s("adaptive_min_interval",this._lang)} > ${s("adaptive_max_interval",this._lang)}`;return}}this._loading=!0,this._error="";try{let t={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},i=this._earliestCompletionDays.trim();if(t.earliest_completion_days=i===""?null:Math.max(0,parseInt(i,10)||0),this._taskId&&(t.task_id=this._taskId),this._scheduleType==="one_time"?(t.due_date=this._dueDate||null,t.interval_days=null):I.includes(this._scheduleType)?(t.schedule={...this._buildSchedule(),...this._recurrenceExtras()},t.interval_days=null,this._taskId&&(t.due_date=null)):(this._taskId&&(t.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(t.interval_days=parseInt(this._intervalDays,10),t.interval_unit=this._intervalUnit,t.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(t.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(t.interval_days=null,t.interval_anchor="completion")),t.notes=this._notes||null,t.documentation_url=this._documentationUrl||null,t.custom_icon=this._customIcon||null,t.priority=this._priority,t.labels=this._labels.split(",").map(c=>c.trim()).filter(Boolean),t.enabled=this._enabled,t.last_performed=this._lastPerformed||null,t.nfc_tag_id=this._nfcTagId||null,t.reading_unit=this._readingUnit.trim()||null,(this.parts.length||this._foreignOwners.length)&&(t.consumes_parts=Object.values(this._consumesParts).map(c=>c.entry_id?{part_id:c.part_id,quantity:c.quantity,entry_id:c.entry_id}:{part_id:c.part_id,quantity:c.quantity})),t.responsible_user_id=this._responsibleUserId,t.assignee_pool=this._assigneePool,t.required_completion_fields=this._requiredCompletion,t.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let c=this._compoundConditions.map(z).filter(_=>_!==null);if(c.length>0){let _={type:"compound",compound_logic:this._compoundLogic,conditions:c};this._autoCompleteOnRecovery&&(_.auto_complete_on_recovery=!0),t.trigger_config=_}else this._taskId&&(t.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let c=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],_={entity_id:c[0],entity_ids:c,type:this._triggerType};if(this._triggerAttribute&&(_.attribute=this._triggerAttribute),this._autoCompleteOnRecovery&&(_.auto_complete_on_recovery=!0),c.length>1&&(_.entity_logic=this._triggerEntityLogic),this._triggerType==="threshold"){if(this._triggerAbove){let h=parseFloat(this._triggerAbove);isNaN(h)||(_.trigger_above=h)}if(this._triggerBelow){let h=parseFloat(this._triggerBelow);isNaN(h)||(_.trigger_below=h)}if(this._triggerForMinutes){let h=parseInt(this._triggerForMinutes,10);isNaN(h)||(_.trigger_for_minutes=h)}}else if(this._triggerType==="counter"){if(this._triggerTargetValue){let h=parseFloat(this._triggerTargetValue);isNaN(h)||(_.trigger_target_value=h)}if(_.trigger_delta_mode=this._triggerDeltaMode,this._triggerDeltaMode&&this._triggerBaselineValue){let h=parseFloat(this._triggerBaselineValue);!isNaN(h)&&h>=0&&(_.trigger_baseline_value=h)}}else if(this._triggerType==="state_change"){if(this._triggerFromState&&(_.trigger_from_state=this._triggerFromState),this._triggerToState&&(_.trigger_to_state=this._triggerToState),this._triggerTargetChanges){let h=parseInt(this._triggerTargetChanges,10);isNaN(h)||(_.trigger_target_changes=h)}}else if(this._triggerType==="runtime"){if(this._triggerRuntimeHours){let m=parseFloat(this._triggerRuntimeHours);isNaN(m)||(_.trigger_runtime_hours=m)}let h=this._triggerOnStates.split(",").map(m=>m.trim()).filter(Boolean);h.length>0&&(_.trigger_on_states=h)}t.trigger_config=_}else this._taskId&&(t.trigger_config=null);if(this.scheduleTimeEnabled&&this._scheduleType==="time_based"){let c=this._scheduleTime.trim();t.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(c)?c:null}if(this.checklistsEnabled){let c=this._checklistText.split(`
`).map(_=>_.trim()).filter(Boolean).slice(0,100);t.checklist=c.length?c:null}if(this.completionActionsEnabled){let c=this._actionService.trim();if(c&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(c)){let v={service:c},g=this._actionTargetEntity.trim();g&&(v.target={entity_id:g});let f=this._buildActionData();Object.keys(f).length>0&&(v.data=f),t.on_complete_action=v}else t.on_complete_action=null;let _={};this._qcNotes.trim()&&(_.notes=this._qcNotes.trim());let h=parseFloat(this._qcCost);!isNaN(h)&&h>=0&&(_.cost=h);let m=parseInt(this._qcDuration,10);!isNaN(m)&&m>=0&&(_.duration=m),this._qcFeedback&&(_.feedback=this._qcFeedback),t.quick_complete_defaults=Object.keys(_).length?_:null}let e=await this.hass.connection.sendMessagePromise(t),r=this._taskId||e?.task_id,d=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;if(r&&this._scheduleType==="sensor_based"&&d)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:r,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null}),this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute}catch{}if(r&&this._adaptiveSnapshot()!==this._adaptiveInitial){let c=parseFloat(this._adaptiveAlpha),_=parseInt(this._adaptiveMin,10),h=parseInt(this._adaptiveMax,10);try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:r,enabled:this._adaptiveEnabled,...c>=.1&&c<=.9?{ewa_alpha:c}:{},...!isNaN(_)&&_>=1?{min_interval_days:_}:{},...!isNaN(h)&&h>=1?{max_interval_days:h}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction}),this._adaptiveInitial=this._adaptiveSnapshot()}catch{}}this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}catch(t){this._error=P(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1,this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return p;let t=this._lang,i=this._triggerType==="compound";return l`
      <h3>${s("trigger_configuration",t)}</h3>
      <div class="select-row">
        <label>${s("trigger_type",t)}</label>
        <select
          .value=${this._triggerType}
          @change=${e=>this._triggerType=e.target.value}
        >
          ${j.map(e=>l`<option value=${e} ?selected=${e===this._triggerType}>${s(e,t)}</option>`)}
        </select>
      </div>
      ${i?this._renderCompoundEditor():l`
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${s("entity_id",t)} (${s("comma_separated",t)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${e=>{let d=e.target.value.split(",").map(c=>c.trim()).filter(Boolean);this._triggerEntityId=d[0]||"",this._triggerEntityIds=d,d[0]&&this._fetchEntityAttributes(d[0])}}
          ></ms-textfield>
        `:l`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:w}}}]}
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
        `:p}
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
      ${this._intervalDays?this._renderUnitSelect():p}
    `}_patchCondition(t,i){this._compoundConditions=this._compoundConditions.map((e,r)=>r===t?{...e,...i}:e)}_addCondition(){this._compoundConditions=[...this._compoundConditions,B()]}_removeCondition(t){this._compoundConditions=this._compoundConditions.filter((i,e)=>e!==t)}_renderCompoundEditor(){let t=this._lang;return l`
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
            @input=${d=>this._patchCondition(i,{entityIds:d.target.value})}
          ></ms-textfield>
        `:l`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:w}}}]}
          .data=${{condition_entities:t.entityIds.split(",").map(d=>d.trim()).filter(Boolean)}}
          .computeLabel=${()=>s("entity_id",e)}
          @value-changed=${d=>{let c=(d.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(i,{entityIds:c.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(t,i)}
        <div class="select-row">
          <label>${s("trigger_type",e)}</label>
          <select
            .value=${t.type}
            @change=${d=>this._patchCondition(i,{type:d.target.value})}
          >
            ${O.map(d=>l`<option value=${d} ?selected=${d===t.type}>${s(d,e)}</option>`)}
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
    `}_renderAdaptiveSection(t){return this._scheduleType==="one_time"||this._scheduleType==="manual"?p:l`
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
        `:p}
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
    `}_renderEnvironmentalAttribute(t){this._fetchConditionAttributes(this._environmentalEntity);let i=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:s("environmental_attribute_optional",t),value:this._environmentalAttribute,suggested:i?.suggested??[],available:i?.available??[],onSelect:e=>this._environmentalAttribute=e})}_renderConditionAttribute(t,i){let e=t.entityIds.split(",")[0]?.trim()||"";e&&this._fetchConditionAttributes(e);let r=e?this._conditionAttrOptions[e]:void 0;return this._renderAttributeSelect({label:s("attribute_optional",this._lang),value:t.attribute,suggested:r?.suggested??[],available:r?.available??[],onSelect:d=>this._patchCondition(i,{attribute:d})})}_renderConditionTypeFields(t,i){let e=this._lang;if(t.type==="threshold")return l`
        <ms-textfield label="${s("trigger_above",e)}" type="number" .value=${t.above}
          @input=${r=>this._patchCondition(i,{above:r.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_below",e)}" type="number" .value=${t.below}
          @input=${r=>this._patchCondition(i,{below:r.target.value})}></ms-textfield>
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
        ${this._renderStateField({label:s("from_state_optional",e),value:t.fromState,entityId:r,onInput:d=>this._patchCondition(i,{fromState:d})})}
        ${this._renderStateField({label:s("to_state_optional",e),value:t.toState,entityId:r,onInput:d=>this._patchCondition(i,{toState:d})})}
        <ms-textfield label="${s("target_changes",e)}" type="number" .value=${t.targetChanges}
          @input=${d=>this._patchCondition(i,{targetChanges:d.target.value})}></ms-textfield>
      `}if(t.type==="runtime"){let r=t.entityIds.split(",")[0]?.trim()||"";return l`
        <ms-textfield label="${s("runtime_hours",e)}" type="number" .value=${t.runtimeHours}
          @input=${d=>this._patchCondition(i,{runtimeHours:d.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:t.onStates,entityId:r,onInput:d=>this._patchCondition(i,{onStates:d})})}
      `}return p}_renderUnitSelect(){let t=this._lang;return l`
      <div class="select-row">
        <label>${s("interval_unit",t)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${i=>this._intervalUnit=i.target.value}
        >
          ${["days","weeks","months","years"].map(i=>l`<option value=${i} ?selected=${i===this._intervalUnit}>${s("unit_"+i,t)}</option>`)}
        </select>
      </div>`}_toggleWeekday(t){this._weekdays=this._weekdays.includes(t)?this._weekdays.filter(i=>i!==t):[...this._weekdays,t]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(I.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let t=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!t||t<=0?null:{kind:"interval",every:t,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(t){super.updated?.(t),this._scheduleEntityPickerProbe();for(let i of t.keys())if(n._PREVIEW_RELEVANT.has(String(i))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let t=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),i=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!t||!i){this._pickerProbeStrikes=0;return}let e=(_,h,m=0)=>{if(!(!_||m>10)){(_.tagName?.toLowerCase()??"")==="ha-entity-picker"&&h.push(_);for(let v of[_.shadowRoot,_])if(v)for(let g of Array.from(v.children??[]))e(g,h,m+1)}},r=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],d=[];for(let _ of r)e(_,d);let c=d.length===0||d.some(_=>_.offsetHeight===0);if(t.offsetHeight===0||c){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let t=this._open?this._previewScheduleDict():null;if(!t){this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let i=++this._previewSeq;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:t,...this._lastPerformed?{last_performed:this._lastPerformed}:{}});if(i!==this._previewSeq)return;this._schedulePreview=e.occurrences||[],this._schedulePreviewEnded=!!e.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return p;let t=this._lang,i=this.scheduleTimeEnabled&&this._scheduleTime?` ${this._scheduleTime}`:"",e=this._schedulePreview.map((d,c)=>{let _=new Date(`${d}T12:00:00`).getDay();return`${E(_===0?6:_-1,t,"short")} ${A(d,t)}${c===0?i:""}`}).join(" \xB7 "),r=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?l`<div class="field-help">${s("schedule_preview_ontime",t)}</div>`:p;return l`
      <div class="trigger-live-hint schedule-preview">
        ${s("schedule_preview_title",t)}: ${e}${this._schedulePreviewEnded?l` <span class="field-help">${s("schedule_preview_ends",t)}</span>`:p}
        ${r}
      </div>
    `}_buildSchedule(){let t=e=>{let r=parseInt(this._calOffset,10)||0;return r&&(e.offset=Math.max(-15,Math.min(r,15))),e};if(this._scheduleType==="weekdays")return t({kind:"weekdays",weekdays:[...this._weekdays].sort((e,r)=>e-r)});if(this._scheduleType==="nth_weekday")return t({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});let i={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(i.business=!0),t(i)}_recurrenceExtras(){let t={};if(this._seasonMonths.length&&(t.season_months=[...this._seasonMonths].sort((i,e)=>i-e)),this._endsMode==="count"){let i=parseInt(this._endsCount,10);i>=1&&(t.ends={count:i})}else this._endsMode==="until"&&this._endsUntil&&(t.ends={until:this._endsUntil});return t}_toggleSeasonMonth(t){this._seasonMonths=this._seasonMonths.includes(t)?this._seasonMonths.filter(i=>i!==t):[...this._seasonMonths,t]}_renderRecurrenceExtras(){let t=this._lang;if(!(this._scheduleType==="time_based"||I.includes(this._scheduleType)))return p;let e=K(t);return l`
      <label class="field-label">${s("season_window_label",t)}</label>
      <div class="field-help">${s("season_window_hint",t)}</div>
      <div class="weekday-chips season-chips">
        ${e.map((r,d)=>l`
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
      ${this._endsMode==="count"?l`
        <ms-textfield
          label="${s("series_end_count_label",t)}"
          type="number" min="1"
          .value=${this._endsCount}
          @input=${r=>this._endsCount=r.target.value}
        ></ms-textfield>`:p}
      ${this._endsMode==="until"?l`
        <ms-textfield
          label="${s("series_end_until_label",t)}"
          type="date"
          .value=${this._endsUntil}
          @input=${r=>this._endsUntil=r.target.value}
        ></ms-textfield>`:p}
    `}_renderCalendarFields(){let t=this._lang,i=W(t);if(this._scheduleType==="weekdays")return l`
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
            ${e.map(([r,d])=>l`<option value=${r} ?selected=${r===this._nth}>${d}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${s("recurrence_weekday",t)}</label>
          <select .value=${this._nthWeekday} @change=${r=>this._nthWeekday=r.target.value}>
            ${i.map((r,d)=>l`<option value=${String(d)} ?selected=${String(d)===this._nthWeekday}>${r}</option>`)}
          </select>
        </div>
        ${this._renderCalOffsetField()}`}return this._scheduleType==="day_of_month"?l`
        ${this._domLastDay?p:l`
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
        ${this._renderCalOffsetField()}`:p}_renderCalOffsetField(){let t=this._lang;return l`
      <ms-textfield
        label="${s("recurrence_offset",t)}"
        helper="${s("recurrence_offset_help",t)}"
        type="number"
        min="-15"
        max="15"
        .value=${this._calOffset}
        @input=${i=>this._calOffset=i.target.value}
      ></ms-textfield>`}_renderTriggerLiveHint(){if(this._triggerType==="compound")return p;let t=this._triggerEntityId||this._triggerEntityIds[0];if(!t||!this.hass?.states)return p;let i=this.hass.states[t];if(!i)return p;let e=this._lang,r=i.attributes?.unit_of_measurement,d=typeof r=="string"&&r?` ${r}`:"",c=this._triggerAttribute?i.attributes?.[this._triggerAttribute]:i.state,_=typeof c=="number"?c:parseFloat(String(c)),h=c!=="unknown"&&c!=="unavailable"&&c!=null&&!isNaN(_),m=g=>Number.isInteger(g)?String(g):String(Math.round(g*10)/10),v=[];if(this._triggerType==="threshold"){let g=parseFloat(this._triggerAbove),f=parseFloat(this._triggerBelow);if(isNaN(g)&&isNaN(f))return p;h&&v.push(s("trigger_hint_now",e).replace("{value}",m(_)+d)),isNaN(g)||v.push(s("trigger_hint_above",e).replace("{target}",m(g)+d)),isNaN(f)||v.push(s("trigger_hint_below",e).replace("{target}",m(f)+d))}else if(this._triggerType==="counter"){let g=parseFloat(this._triggerTargetValue);if(isNaN(g))return p;this._triggerDeltaMode?this._taskId?v.push(s("trigger_hint_counter_delta_edit",e).replace("{target}",m(g)+d)):h?v.push(s("trigger_hint_counter_delta",e).replace("{value}",m(_)+d).replace("{due}",m(_+g)+d).replace("{target}",m(g)+d)):v.push(s("trigger_hint_counter_delta_edit",e).replace("{target}",m(g)+d)):(h&&v.push(s("trigger_hint_now",e).replace("{value}",m(_)+d)),v.push(s("trigger_hint_counter_abs",e).replace("{target}",m(g)+d)))}else if(this._triggerType==="runtime"){let g=parseFloat(this._triggerRuntimeHours);if(isNaN(g))return p;v.push(s("trigger_hint_runtime",e).replace("{hours}",m(g))),v.push(s("trigger_hint_state_now",e).replace("{value}",String(i.state)))}else if(this._triggerType==="state_change"){let g=parseInt(this._triggerTargetChanges,10)||1,f=this._triggerToState.trim();v.push((f?s("trigger_hint_state_change_to",e).replace("{state}",f):s("trigger_hint_state_change",e)).replace("{count}",String(g))),v.push(s("trigger_hint_state_now",e).replace("{value}",String(i.state)))}return v.length?l`<div class="trigger-live-hint">${v.join(" ")}</div>`:p}_renderTriggerTypeFields(){let t=this._lang;return this._triggerType==="threshold"?l`
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
                    </div>`:p}
              </div>
            `:p}
      `:this._triggerType==="state_change"?l`
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
      `:this._triggerType==="runtime"?l`
        <ms-textfield
          label="${s("runtime_hours",t)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${i=>this._triggerRuntimeHours=i.target.value}
        ></ms-textfield>
        ${this._renderOnStatesField({value:this._triggerOnStates,entityId:this._triggerEntityId,onInput:i=>this._triggerOnStates=i})}
        <div class="field-help">${s("runtime_on_states_help",t)}</div>
      `:p}render(){if(!this._open)return l``;let t=this._lang,i=this._taskId?s("edit_task",t):s("new_task",t);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:p}
          ${this._objectChoices.length>0?l`
            <div class="select-row">
              <label>${s("object",t)}</label>
              <select
                .value=${this._entryId}
                @change=${e=>{this._entryId=e.target.value,this._consumesParts={},this._loadParts(),this._loadForeignPools()}}
              >
                ${this._objectChoices.map(e=>l`<option value=${e.entry_id} ?selected=${e.entry_id===this._entryId}>${e.name}</option>`)}
              </select>
            </div>
          `:p}
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
              ${M.map(e=>l`<option value=${e} ?selected=${e===this._type}>${s(e,t)}</option>`)}
            </select>
          </div>
          ${this._type==="reading"?l`
                <ms-textfield
                  label="${s("reading_unit_label",t)}"
                  .value=${this._readingUnit}
                  @input=${e=>this._readingUnit=e.target.value}
                ></ms-textfield>
                <div class="field-help">${s("reading_unit_help",t)}</div>
              `:p}
          ${this._partsLoadFailed?l`<div class="field-help parts-load-failed">${s("parts_load_failed",t)}</div>`:p}
          ${this.parts.length||this._foreignOwners.length?l`
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
                      `:p}
                </div>
              `:p}
          <div class="select-row">
            <label>${s("priority",t)}</label>
            <select
              .value=${this._priority}
              @change=${e=>this._priority=e.target.value}
            >
              ${q.map(e=>l`<option value=${e} ?selected=${e===this._priority}>${s("priority_"+e,t)}</option>`)}
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
              ${U.map(e=>l`<option value=${e} ?selected=${e===this._scheduleType}>${s(e,t)}</option>`)}
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
                ${this.scheduleTimeEnabled?l`
                  <ms-textfield
                    label="${s("schedule_time_optional",t)}"
                    type="time"
                    .value=${this._scheduleTime}
                    helper="${s("schedule_time_help",t)}"
                    @input=${e=>this._scheduleTime=e.target.value}
                  ></ms-textfield>
                `:p}
              `:p}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?l`
                <ms-textfield
                  label="${s("due_date",t)}"
                  type="date"
                  .value=${this._dueDate}
                  @input=${e=>this._dueDate=e.target.value}
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
          `:p}
          <h3>${s("require_on_completion",t)}</h3>
          <div class="required-completion">
            ${N.map(e=>l`
              <label class="req-option">
                <input
                  type="checkbox"
                  .checked=${this._requiredCompletion.includes(e)}
                  @change=${r=>this._toggleRequired(e,r.target.checked)}
                />
                <span>${s(H[e],t)}</span>
              </label>
            `)}
          </div>
          <ms-textfield
            label="${s("last_performed_optional",t)}"
            type="date"
            .value=${this._lastPerformed}
            @input=${e=>this._lastPerformed=e.target.value}
          ></ms-textfield>
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
              </div>`:p}
          `:p}
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"?l`
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
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:F,device_class:R}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>s("environmental_entity_optional",t)}
              .computeHelper=${()=>s("environmental_entity_helper",t)}
              @value-changed=${e=>{this._environmentalEntity=(e.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(t):p}
          `:p}
          ${this._renderAdaptiveSection(t)}
          <ms-textfield
            label="${s("notes_optional",t)}"
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
    `}};n._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),n.styles=T`
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
  `,a([$({attribute:!1})],n.prototype,"hass",2),a([$({type:Boolean,attribute:"checklists-enabled"})],n.prototype,"checklistsEnabled",2),a([$({type:Boolean,attribute:"schedule-time-enabled"})],n.prototype,"scheduleTimeEnabled",2),a([$({type:Boolean,attribute:"completion-actions-enabled"})],n.prototype,"completionActionsEnabled",2),a([$({type:Number,attribute:"default-warning-days"})],n.prototype,"defaultWarningDays",2),a([o()],n.prototype,"parts",2),a([o()],n.prototype,"_foreignOwners",2),a([o()],n.prototype,"_open",2),a([o()],n.prototype,"_entityPickerFallback",2),a([o()],n.prototype,"_loading",2),a([o()],n.prototype,"_error",2),a([o()],n.prototype,"_entryId",2),a([o()],n.prototype,"_taskId",2),a([o()],n.prototype,"_objectChoices",2),a([o()],n.prototype,"_name",2),a([o()],n.prototype,"_type",2),a([o()],n.prototype,"_scheduleType",2),a([o()],n.prototype,"_intervalDays",2),a([o()],n.prototype,"_intervalUnit",2),a([o()],n.prototype,"_dueDate",2),a([o()],n.prototype,"_warningDays",2),a([o()],n.prototype,"_earliestCompletionDays",2),a([o()],n.prototype,"_intervalAnchor",2),a([o()],n.prototype,"_weekdays",2),a([o()],n.prototype,"_nth",2),a([o()],n.prototype,"_nthWeekday",2),a([o()],n.prototype,"_domDay",2),a([o()],n.prototype,"_domLastDay",2),a([o()],n.prototype,"_domBusiness",2),a([o()],n.prototype,"_calOffset",2),a([o()],n.prototype,"_seasonMonths",2),a([o()],n.prototype,"_endsMode",2),a([o()],n.prototype,"_endsCount",2),a([o()],n.prototype,"_endsUntil",2),a([o()],n.prototype,"_schedulePreview",2),a([o()],n.prototype,"_schedulePreviewEnded",2),a([o()],n.prototype,"_notes",2),a([o()],n.prototype,"_documentationUrl",2),a([o()],n.prototype,"_customIcon",2),a([o()],n.prototype,"_priority",2),a([o()],n.prototype,"_labels",2),a([o()],n.prototype,"_enabled",2),a([o()],n.prototype,"_triggerEntityId",2),a([o()],n.prototype,"_triggerEntityIds",2),a([o()],n.prototype,"_triggerEntityLogic",2),a([o()],n.prototype,"_triggerAttribute",2),a([o()],n.prototype,"_triggerType",2),a([o()],n.prototype,"_triggerAbove",2),a([o()],n.prototype,"_triggerBelow",2),a([o()],n.prototype,"_triggerForMinutes",2),a([o()],n.prototype,"_triggerTargetValue",2),a([o()],n.prototype,"_triggerDeltaMode",2),a([o()],n.prototype,"_triggerBaselineValue",2),a([o()],n.prototype,"_liveBaselineValue",2),a([o()],n.prototype,"_autoCompleteOnRecovery",2),a([o()],n.prototype,"_triggerFromState",2),a([o()],n.prototype,"_triggerToState",2),a([o()],n.prototype,"_triggerTargetChanges",2),a([o()],n.prototype,"_triggerRuntimeHours",2),a([o()],n.prototype,"_triggerOnStates",2),a([o()],n.prototype,"_compoundLogic",2),a([o()],n.prototype,"_compoundConditions",2),a([o()],n.prototype,"_suggestedAttributes",2),a([o()],n.prototype,"_availableAttributes",2),a([o()],n.prototype,"_entityDomain",2),a([o()],n.prototype,"_lastPerformed",2),a([o()],n.prototype,"_nfcTagId",2),a([o()],n.prototype,"_readingUnit",2),a([o()],n.prototype,"_consumesParts",2),a([o()],n.prototype,"_partsLoadFailed",2),a([o()],n.prototype,"_availableTags",2),a([o()],n.prototype,"_responsibleUserId",2),a([o()],n.prototype,"_assigneePool",2),a([o()],n.prototype,"_rotationStrategy",2),a([o()],n.prototype,"_availableUsers",2),a([o()],n.prototype,"_checklistText",2),a([o()],n.prototype,"_requiredCompletion",2),a([o()],n.prototype,"_scheduleTime",2),a([o()],n.prototype,"_actionService",2),a([o()],n.prototype,"_actionTargetEntity",2),a([o()],n.prototype,"_actionData",2),a([o()],n.prototype,"_actionDataJsonFallback",2),a([o()],n.prototype,"_actionTesting",2),a([o()],n.prototype,"_actionTestResult",2),a([o()],n.prototype,"_actionTestError",2),a([o()],n.prototype,"_qcNotes",2),a([o()],n.prototype,"_qcCost",2),a([o()],n.prototype,"_qcDuration",2),a([o()],n.prototype,"_qcFeedback",2),a([o()],n.prototype,"_environmentalEntity",2),a([o()],n.prototype,"_environmentalAttribute",2),a([o()],n.prototype,"_adaptiveEnabled",2),a([o()],n.prototype,"_adaptiveAlpha",2),a([o()],n.prototype,"_adaptiveMin",2),a([o()],n.prototype,"_adaptiveMax",2),a([o()],n.prototype,"_adaptiveSeasonal",2),a([o()],n.prototype,"_adaptivePrediction",2),a([o()],n.prototype,"_conditionAttrOptions",2);var S=n;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",S);export{S as MaintenanceTaskDialog};
