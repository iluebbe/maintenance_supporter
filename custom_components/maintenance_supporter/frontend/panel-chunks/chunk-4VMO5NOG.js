/*! maintenance_supporter frontend 2.70.0 */
import{a as T,d as k,e as q}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-HFULJZQM.js";import{a as M}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-J4OBOTUE.js";import{a as R}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-OSFH63XQ.js";import{a,b as L,c as o,f as p,h as N,l as $,m as l,q as s,s as H,v as F,z as S}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LYOXRD4U.js";var C=["sensor","binary_sensor","number","input_number","input_boolean","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock"],O=["sensor"],U=["temperature","humidity","pressure"];var z=["cleaning","inspection","replacement","calibration","service","reading","custom"],V=["low","normal","high"],W=["time_based","weekdays","nth_weekday","day_of_month","sensor_based","one_time","manual"],A=["weekdays","nth_weekday","day_of_month"],D=["threshold","counter","state_change","runtime"],K=[...D,"compound"],y={alpha:"0.3",min:"7",max:"365"};function Y(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",carry:{}}}var J=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states"]);function G(u){return{entityIds:(u.entity_ids||(u.entity_id?[u.entity_id]:[])).join(", "),type:u.type||"threshold",attribute:u.attribute||"",above:u.trigger_above?.toString()??"",below:u.trigger_below?.toString()??"",equals:u.trigger_equals?.toString()??"",notEquals:u.trigger_not_equals?.toString()??"",forMinutes:u.trigger_for_minutes?.toString()??"0",targetValue:u.trigger_target_value?.toString()??"",deltaMode:u.trigger_delta_mode||!1,fromState:u.trigger_from_state||"",toState:u.trigger_to_state||"",targetChanges:u.trigger_target_changes?.toString()??"",runtimeHours:u.trigger_runtime_hours?.toString()??"",onStates:(u.trigger_on_states||[]).join(", "),carry:Object.fromEntries(Object.entries(u).filter(([e])=>!J.has(e)&&!e.startsWith("_")))}}function Q(u){let b=u.entityIds.split(",").map(i=>i.trim()).filter(Boolean);if(b.length===0)return null;let e={...u.carry||{},entity_id:b[0],entity_ids:b,type:u.type};if(u.attribute&&(e.attribute=u.attribute),u.type==="threshold"){let i=parseFloat(u.above);isNaN(i)||(e.trigger_above=i);let t=parseFloat(u.below);isNaN(t)||(e.trigger_below=t);let r=parseFloat(u.equals);isNaN(r)||(e.trigger_equals=r);let h=parseFloat(u.notEquals);isNaN(h)||(e.trigger_not_equals=h);let c=parseInt(u.forMinutes,10);isNaN(c)||(e.trigger_for_minutes=c)}else if(u.type==="counter"){let i=parseFloat(u.targetValue);isNaN(i)||(e.trigger_target_value=i),e.trigger_delta_mode=u.deltaMode}else if(u.type==="state_change"){u.fromState&&(e.trigger_from_state=u.fromState),u.toState&&(e.trigger_to_state=u.toState);let i=parseInt(u.targetChanges,10);isNaN(i)||(e.trigger_target_changes=i)}else if(u.type==="runtime"){let i=parseFloat(u.runtimeHours);isNaN(i)||(e.trigger_runtime_hours=i);let t=(u.onStates||"").split(",").map(r=>r.trim()).filter(Boolean);t.length>0&&(e.trigger_on_states=t)}return e}function X(u){return Array.from({length:7},(b,e)=>S(e,u,"short"))}function Z(u){let b=new Intl.DateTimeFormat(u||"en",{month:"short"});return Array.from({length:12},(e,i)=>b.format(new Date(2021,i,1)))}var n=class n extends N{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.defaultWarningDays=7;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._entryId="";this._taskId=null;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._priority="normal";this._labels="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._readingUnit="";this._consumesParts={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._actionService="";this._actionTargetEntity="";this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=y.alpha;this._adaptiveMin=y.min;this._adaptiveMax=y.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return H(this.hass)}async openCreate(e,i){this._entryId=e,this._taskId=null,this._error="",!e&&i&&i.length>0?(this._objectChoices=i.map(t=>({entry_id:t.entry_id,name:t.object.name})).sort((t,r)=>t.name.localeCompare(r.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(e,i){this._entryId=e,this._taskId=i.id,this._error="",this._objectChoices=[],this._name=i.name,this._type=i.type,this._scheduleType=i.schedule_type,this._intervalDays=i.interval_days!=null?String(i.interval_days):"",this._intervalUnit=i.interval_unit||"days",this._dueDate=i.due_date||"";let t=i.schedule;this._weekdays=t?.kind==="weekdays"?[...t.weekdays??[]]:[],this._nth=t?.kind==="nth_weekday"?String(t.nth??1):"1",this._nthWeekday=t?.kind==="nth_weekday"?String(t.weekday??5):"5",this._domDay=t?.kind==="day_of_month"&&(t.day??1)>=1?String(t.day??1):"1",this._domLastDay=t?.kind==="day_of_month"&&t.day===-1,this._domBusiness=t?.kind==="day_of_month"&&t.business===!0,this._calOffset=t?.offset?String(t.offset):"0",this._seasonMonths=Array.isArray(t?.season_months)?[...t.season_months]:[];let r=t?.ends;r&&typeof r.count=="number"?(this._endsMode="count",this._endsCount=String(r.count),this._endsUntil=""):r&&typeof r.until=="string"?(this._endsMode="until",this._endsUntil=r.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=i.warning_days.toString(),this._earliestCompletionDays=i.earliest_completion_days!=null?String(i.earliest_completion_days):"",this._intervalAnchor=i.interval_anchor||"completion",this._notes=i.notes||"",this._documentationUrl=i.documentation_url||"",this._customIcon=i.custom_icon||"",this._priority=i.priority||"normal",this._labels=(i.labels||[]).join(", "),this._enabled=i.enabled!==!1,this._lastPerformed=i.last_performed||"",this._nfcTagId=i.nfc_tag_id||"",this._requireTagScan=!!i.require_tag_scan,this._allowSkip=i.allow_skip!==!1,this._readingUnit=i.reading_unit||"",this._consumesParts=Object.fromEntries((i.consumes_parts||[]).map(d=>[T(d),{...d}])),this._responsibleUserId=i.responsible_user_id||null,this._assigneePool=[...i.assignee_pool||[]],this._rotationStrategy=i.rotation_strategy||"",this._checklistText=(i.checklist||[]).join(`
`),this._phaseDefs=Object.entries(i.phases||{}).map(([d,g])=>{let{name:v,checklist:m,consumes_parts:f,required_completion_fields:ee,...j}=g,x=g.consumes_parts||[],w=x.findIndex(E=>!E.entry_id),I=w>=0?x[w]:void 0;return{id:d,name:g.name||d,checklistText:(g.checklist||[]).join(`
`),partId:I?.part_id||"",partQty:I?.quantity!=null?String(I.quantity):"",reqOverride:g.required_completion_fields!==void 0,reqFields:[...g.required_completion_fields||[]],extraParts:x.filter((E,B)=>B!==w).map(E=>({...E})),carry:j}}),this._phaseSeq=[...i.phase_sequence||[]],this._requiredCompletion=[...i.required_completion_fields||[]],this._scheduleTime=i.schedule_time||"";let h=i.on_complete_action;if(h&&h.service){this._actionService=h.service;let d=h.target?.entity_id;this._actionTargetEntity=Array.isArray(d)?d[0]||"":d||"",this._actionData=h.data&&typeof h.data=="object"?{...h.data}:{},this._actionDataJsonFallback=""}else this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="";let c=i.quick_complete_defaults;this._qcNotes=c?.notes||"",this._qcCost=c?.cost!=null?String(c.cost):"",this._qcDuration=c?.duration!=null?String(c.duration):"",this._qcFeedback=c?.feedback||"";let _=i.adaptive_config||{};if(this._environmentalEntity=_.environmental_entity||"",this._environmentalAttribute=_.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!_.enabled,this._adaptiveAlpha=_.ewa_alpha?.toString()??y.alpha,this._adaptiveMin=_.min_interval_days?.toString()??y.min,this._adaptiveMax=_.max_interval_days?.toString()??y.max,this._adaptiveSeasonal=_.seasonal_enabled!==!1,this._adaptivePrediction=_.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),i.trigger_config){let d=i.trigger_config;this._triggerEntityId=d.entity_id||d.entity_ids&&d.entity_ids[0]||"",this._triggerEntityIds=d.entity_ids||(d.entity_id?[d.entity_id]:[]),this._triggerEntityLogic=d.entity_logic||"any",this._triggerAttribute=d.attribute||"",this._triggerType=d.type||"threshold",this._triggerAbove=d.trigger_above?.toString()||"",this._triggerBelow=d.trigger_below?.toString()||"",this._triggerEquals=d.trigger_equals?.toString()||"",this._triggerNotEquals=d.trigger_not_equals?.toString()||"",this._triggerForMinutes=d.trigger_for_minutes?.toString()||"0",this._triggerCombinator=d.trigger_combinator==="all"?"all":"any",this._triggerTargetValue=d.trigger_target_value?.toString()||"",this._triggerDeltaMode=d.trigger_delta_mode||!1,this._triggerBaselineValue=d.trigger_baseline_value?.toString()||"",this._liveBaselineValue=i.trigger_baseline_value??null,this._autoCompleteOnRecovery=d.auto_complete_on_recovery||!1,this._triggerFromState=d.trigger_from_state||"",this._triggerToState=d.trigger_to_state||"",this._triggerTargetChanges=d.trigger_target_changes?.toString()||"",this._triggerRuntimeHours=d.trigger_runtime_hours?.toString()||"",this._triggerRuntimeMaxSession=d.trigger_runtime_max_session_seconds?.toString()||"",this._triggerOnStates=(d.trigger_on_states||[]).join(", "),d.type==="compound"?(this._compoundLogic=d.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(d.conditions||[]).map(G)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._priority="normal",this._labels="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._readingUnit="",this._consumesParts={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=y.alpha,this._adaptiveMin=y.min,this._adaptiveMax=y.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="",this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._triggerAttribute="",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerEquals="",this._triggerNotEquals="",this._triggerForMinutes="0",this._triggerCombinator="any",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges="",this._triggerRuntimeHours="",this._triggerRuntimeMaxSession="",this._triggerOnStates="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new M(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}_toggleAssignee(e){this._assigneePool=this._assigneePool.includes(e)?this._assigneePool.filter(i=>i!==e):[...this._assigneePool,e]}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError="Invalid service format (expected 'domain.service')",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[i,t]=e.split(".");if(!this.hass?.services?.[i]?.[t]){this._actionTestResult="error",this._actionTestError=`Service "${e}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let r=this._actionTargetEntity.trim();if(r){let h=r.split(".")[0];if(h!==i&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(i)){this._actionTestResult="error",this._actionTestError=`Service "${e}" only works on ${i}.* entities; entity "${r}" is in ${h}.* \u2014 pick a service that matches the entity domain (e.g. ${h}.${t})`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[r]){this._actionTestResult="error",this._actionTestError=`Target entity "${r}" not found in Home Assistant \u2014 the entity may have been renamed or its integration removed.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[i,t]=e.split("."),r=this.hass?.services?.[i]?.[t]?.fields;return!r||Object.keys(r).length===0?null:Object.entries(r).map(([h,c])=>({name:h,required:!!c.required,selector:c.selector||{text:{}}}))}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled)return p;let i=this._serviceSchema();return o`
      <details class="ca-section">
        <summary>${s("on_complete_action_title",e)}</summary>
        <p class="field-help">${s("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${t=>{this._actionService=t.detail.value||"";let r=this._serviceSchema();if(r){let h=new Set(r.map(c=>c.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([c])=>h.has(c)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>s("on_complete_action_target",e)}
          @value-changed=${t=>{let r=t.detail.value;this._actionTargetEntity=r.target_entity||""}}
        ></ha-form>
        <p class="field-help ca-domain-hint">
          ${s("on_complete_action_target_hint",e)}
        </p>
        ${i?o`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${i}
                .data=${this._actionData}
                @value-changed=${t=>{this._actionData={...t.detail.value}}}
              ></ha-form>
            `:o`
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
          ${this._actionTestResult==="ok"?o`<span class="ca-test-ok">${s("on_complete_action_test_success",e)}</span>`:p}
          ${this._actionTestResult==="error"?o`<div class="ca-test-error-block">
                <span class="ca-test-error">${s("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?o`<div class="ca-test-error-detail">${this._actionTestError}</div>`:p}
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
    `}async _loadParts(){if(this.parts=[],!!this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this.parts=e.parts||[],this._partsLoadFailed=!1}catch{this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){if(this._foreignOwners=[],!!this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._foreignOwners=(e.objects||[]).filter(i=>i.entry_id!==this._entryId&&(i.parts||[]).length>0).map(i=>({entry_id:i.entry_id,name:i.object?.name||i.entry_id,parts:i.parts||[]})).sort((i,t)=>i.name.localeCompare(t.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(e){!e||!this.hass||this._conditionAttrOptions[e]||this._conditionAttrPending.has(e)||(this._conditionAttrPending.add(e),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e}).then(i=>{let t=i;this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:t.suggested_attributes||[],available:t.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(e){if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});this._entityDomain=i.domain||"",this._suggestedAttributes=i.suggested_attributes||[],this._availableAttributes=i.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(e=>!!e.entry_id)}_renderConsumesRow(e,i){let t=T({part_id:e.id,entry_id:i}),r=this._consumesParts[t],h=i?{part_id:e.id,quantity:1,entry_id:i}:{part_id:e.id,quantity:1};return o`
      <div class="consumes-row">
        <label class="consumes-check">
          <input
            type="checkbox"
            .checked=${r!==void 0}
            @change=${c=>{let _={...this._consumesParts};c.target.checked?_[t]=_[t]||h:delete _[t],this._consumesParts=_}}
          />
          <span>${e.name}${e.unit?` (${e.unit})`:""}</span>
        </label>
        ${r!==void 0?o`<input
              class="consumes-qty"
              type="number"
              min="0.01"
              max="999"
              step="0.01"
              .value=${String(r.quantity)}
              @input=${c=>{let _=parseFloat(c.target.value);this._consumesParts={...this._consumesParts,[t]:{...h,quantity:Number.isFinite(_)&&_>=.01?_:1}}}}
            />`:p}
      </div>
    `}_toggleRequired(e,i){let t=new Set(this._requiredCompletion);i?t.add(e):t.delete(e),this._requiredCompletion=[...t]}_phaseSlug(e){let i=e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",t=i,r=2;for(;this._phaseDefs.some(h=>h.id===t);)t=`${i}-${r++}`;return t}_addPhaseDef(){let e=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:e,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(e){this._phaseDefs=this._phaseDefs.filter(i=>i.id!==e),this._phaseSeq=this._phaseSeq.filter(i=>i!==e)}_patchPhaseDef(e,i){this._phaseDefs=this._phaseDefs.map(t=>t.id===e?{...t,...i}:t)}_renderPhasesEditor(e){let i=t=>this._phaseDefs.find(r=>r.id===t)?.name||t;return o`
      <h3>${s("phases_section",e)}</h3>
      <div class="field-help">${s("phases_hint",e)}</div>
      ${this._phaseDefs.map(t=>o`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${s("phase_name",e)}"
              .value=${t.name}
              @input=${r=>this._patchPhaseDef(t.id,{name:r.target.value})}
            ></ms-textfield>
            ${this.parts.length?o`
              <select
                class="phase-part"
                .value=${t.partId}
                @change=${r=>this._patchPhaseDef(t.id,{partId:r.target.value})}
              >
                <option value="">—</option>
                ${this.parts.map(r=>o`<option value=${r.id} ?selected=${r.id===t.partId}>${r.name}</option>`)}
              </select>
              ${t.partId?o`
                <input class="phase-qty" type="number" min="0.01" step="0.01" .value=${t.partQty||"1"}
                  @input=${r=>this._patchPhaseDef(t.id,{partQty:r.target.value})} />
              `:p}
            `:p}
            <mwc-icon-button class="phase-remove" @click=${()=>this._removePhaseDef(t.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </mwc-icon-button>
          </div>
          ${this.checklistsEnabled?o`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${s("checklist_placeholder",e)}"
              .value=${t.checklistText}
              @input=${r=>this._patchPhaseDef(t.id,{checklistText:r.target.value})}
            ></textarea>
          `:p}
          <label class="req-option phase-req-toggle">
            <input
              type="checkbox"
              .checked=${t.reqOverride}
              @change=${r=>this._patchPhaseDef(t.id,{reqOverride:r.target.checked})}
            />
            <span>${s("phase_require_override",e)}</span>
          </label>
          ${t.reqOverride?o`
            <div class="required-completion phase-req-fields">
              ${k.map(r=>o`
                <label class="req-option">
                  <input
                    type="checkbox"
                    .checked=${t.reqFields.includes(r)}
                    @change=${h=>{let c=h.target.checked,_=new Set(t.reqFields);c?_.add(r):_.delete(r),this._patchPhaseDef(t.id,{reqFields:[..._]})}}
                  />
                  <span>${s(q[r],e)}</span>
                </label>
              `)}
            </div>
          `:p}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${s("phase_add",e)}
      </ha-button>
      ${this._phaseDefs.some(t=>t.name.trim())?o`
        <div class="phase-seq-label">${s("phase_sequence_label",e)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((t,r)=>o`
            <span class="phase-chip">
              ${r+1}. ${i(t)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((h,c)=>c!==r)}}>✕</button>
            </span>
          `)}
          <select
            class="phase-seq-add"
            .value=${""}
            @change=${t=>{let r=t.target.value;r&&(this._phaseSeq=[...this._phaseSeq,r]),t.target.value=""}}
          >
            <option value="">+ ${s("phase_sequence_add_step",e)}</option>
            ${this._phaseDefs.filter(t=>t.name.trim()).map(t=>o`<option value=${t.id}>${t.name}</option>`)}
          </select>
        </div>
      `:p}
    `}async _save(){if(!this._loading&&this._name.trim()){if(this._adaptiveSnapshot()!==this._adaptiveInitial){let e=parseInt(this._adaptiveMin,10),i=parseInt(this._adaptiveMax,10);if(!isNaN(e)&&!isNaN(i)&&e>i){this._error=`${s("adaptive_min_interval",this._lang)} > ${s("adaptive_max_interval",this._lang)}`;return}}this._loading=!0,this._error="";try{let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},i=this._earliestCompletionDays.trim();e.earliest_completion_days=i===""?null:Math.max(0,parseInt(i,10)||0),this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):A.includes(this._scheduleType)?(e.schedule={...this._buildSchedule(),...this._recurrenceExtras()},e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(e.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.priority=this._priority,e.labels=this._labels.split(",").map(c=>c.trim()).filter(Boolean),e.enabled=this._enabled,e.last_performed=this._lastPerformed||null,e.nfc_tag_id=this._nfcTagId||null,e.require_tag_scan=this._requireTagScan,e.allow_skip=this._allowSkip,e.reading_unit=this._readingUnit.trim()||null;{let c={};for(let d of this._phaseDefs){if(!d.name.trim())continue;let g={...d.carry,name:d.name.trim()},v=d.checklistText.split(`
`).map(f=>f.trim()).filter(Boolean);v.length&&(g.checklist=v);let m=[];if(d.partId){let f=parseFloat(d.partQty);m.push({part_id:d.partId,quantity:Number.isFinite(f)&&f>0?f:1})}for(let f of d.extraParts)m.push(f.entry_id?{part_id:f.part_id,quantity:f.quantity,entry_id:f.entry_id}:{part_id:f.part_id,quantity:f.quantity});m.length&&(g.consumes_parts=m),d.reqOverride&&(g.required_completion_fields=[...d.reqFields]),c[d.id]=g}let _=this._phaseSeq.filter(d=>d in c);e.phases=Object.keys(c).length&&_.length?c:null,e.phase_sequence=e.phases?_:null}if((this.parts.length||this._foreignOwners.length)&&(e.consumes_parts=Object.values(this._consumesParts).map(c=>c.entry_id?{part_id:c.part_id,quantity:c.quantity,entry_id:c.entry_id}:{part_id:c.part_id,quantity:c.quantity})),e.responsible_user_id=this._responsibleUserId,e.assignee_pool=this._assigneePool,e.required_completion_fields=this._requiredCompletion,e.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let c=this._compoundConditions.map(Q).filter(_=>_!==null);if(c.length>0){let _={type:"compound",compound_logic:this._compoundLogic,conditions:c};this._autoCompleteOnRecovery&&(_.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(_.trigger_combinator="all"),e.trigger_config=_}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let c=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],_={entity_id:c[0],entity_ids:c,type:this._triggerType};if(this._triggerAttribute&&(_.attribute=this._triggerAttribute),this._autoCompleteOnRecovery&&(_.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(_.trigger_combinator="all"),c.length>1&&(_.entity_logic=this._triggerEntityLogic),this._triggerType==="threshold"){if(this._triggerAbove){let d=parseFloat(this._triggerAbove);isNaN(d)||(_.trigger_above=d)}if(this._triggerBelow){let d=parseFloat(this._triggerBelow);isNaN(d)||(_.trigger_below=d)}if(this._triggerEquals){let d=parseFloat(this._triggerEquals);isNaN(d)||(_.trigger_equals=d)}if(this._triggerNotEquals){let d=parseFloat(this._triggerNotEquals);isNaN(d)||(_.trigger_not_equals=d)}if(this._triggerForMinutes){let d=parseInt(this._triggerForMinutes,10);isNaN(d)||(_.trigger_for_minutes=d)}}else if(this._triggerType==="counter"){if(this._triggerTargetValue){let d=parseFloat(this._triggerTargetValue);isNaN(d)||(_.trigger_target_value=d)}if(_.trigger_delta_mode=this._triggerDeltaMode,this._triggerDeltaMode&&this._triggerBaselineValue){let d=parseFloat(this._triggerBaselineValue);!isNaN(d)&&d>=0&&(_.trigger_baseline_value=d)}}else if(this._triggerType==="state_change"){if(this._triggerFromState&&(_.trigger_from_state=this._triggerFromState),this._triggerToState&&(_.trigger_to_state=this._triggerToState),this._triggerTargetChanges){let d=parseInt(this._triggerTargetChanges,10);isNaN(d)||(_.trigger_target_changes=d)}if(this._triggerForMinutes){let d=parseInt(this._triggerForMinutes,10);isNaN(d)||(_.trigger_for_minutes=d)}}else if(this._triggerType==="runtime"){if(this._triggerRuntimeHours){let g=parseFloat(this._triggerRuntimeHours);isNaN(g)||(_.trigger_runtime_hours=g)}if(this._triggerRuntimeMaxSession){let g=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(g)&&g>0&&(_.trigger_runtime_max_session_seconds=g)}let d=this._triggerOnStates.split(",").map(g=>g.trim()).filter(Boolean);d.length>0&&(_.trigger_on_states=d)}e.trigger_config=_}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&this._scheduleType==="time_based"){let c=this._scheduleTime.trim();e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(c)?c:null}if(this.checklistsEnabled){let c=this._checklistText.split(`
`).map(_=>_.trim()).filter(Boolean).slice(0,100);e.checklist=c.length?c:null}if(this.completionActionsEnabled){let c=this._actionService.trim();if(c&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(c)){let v={service:c},m=this._actionTargetEntity.trim();m&&(v.target={entity_id:m});let f=this._buildActionData();Object.keys(f).length>0&&(v.data=f),e.on_complete_action=v}else e.on_complete_action=null;let _={};this._qcNotes.trim()&&(_.notes=this._qcNotes.trim());let d=parseFloat(this._qcCost);!isNaN(d)&&d>=0&&(_.cost=d);let g=parseInt(this._qcDuration,10);!isNaN(g)&&g>=0&&(_.duration=g),this._qcFeedback&&(_.feedback=this._qcFeedback),e.quick_complete_defaults=Object.keys(_).length?_:null}let t=await this.hass.connection.sendMessagePromise(e),r=this._taskId||t?.task_id,h=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;if(r&&this._scheduleType==="sensor_based"&&h)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:r,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null}),this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute}catch{}if(r&&this._adaptiveSnapshot()!==this._adaptiveInitial){let c=parseFloat(this._adaptiveAlpha),_=parseInt(this._adaptiveMin,10),d=parseInt(this._adaptiveMax,10);try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:r,enabled:this._adaptiveEnabled,...c>=.1&&c<=.9?{ewa_alpha:c}:{},...!isNaN(_)&&_>=1?{min_interval_days:_}:{},...!isNaN(d)&&d>=1?{max_interval_days:d}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction}),this._adaptiveInitial=this._adaptiveSnapshot()}catch{}}this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}catch(e){this._error=R(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1,this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return p;let e=this._lang,i=this._triggerType==="compound";return o`
      <h3>${s("trigger_configuration",e)}</h3>
      <div class="select-row">
        <label>${s("trigger_type",e)}</label>
        <select
          .value=${this._triggerType}
          @change=${t=>this._triggerType=t.target.value}
        >
          ${K.map(t=>o`<option value=${t} ?selected=${t===this._triggerType}>${s(t,e)}</option>`)}
        </select>
      </div>
      ${i?this._renderCompoundEditor():o`
        ${this._entityPickerFallback?o`
          <ms-textfield
            label="${s("entity_id",e)} (${s("comma_separated",e)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${t=>{let h=t.target.value.split(",").map(c=>c.trim()).filter(Boolean);this._triggerEntityId=h[0]||"",this._triggerEntityIds=h,h[0]&&this._fetchEntityAttributes(h[0])}}
          ></ms-textfield>
        `:o`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:C}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>s("entity_id",e)}
          @value-changed=${t=>{let r=(t.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=r[0]||"",this._triggerEntityIds=r,r[0]?this._fetchEntityAttributes(r[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?o`
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
      ${this._intervalDays?o`
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
    `}_patchCondition(e,i){this._compoundConditions=this._compoundConditions.map((t,r)=>r===e?{...t,...i}:t)}_addCondition(){this._compoundConditions=[...this._compoundConditions,Y()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((i,t)=>t!==e)}_renderCompoundEditor(){let e=this._lang;return o`
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
      ${this._compoundConditions.length===0?o`<div class="field-help">${s("compound_no_conditions",e)}</div>`:this._compoundConditions.map((i,t)=>this._renderCondition(i,t))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${s("compound_add_condition",e)}
      </button>
    `}_renderCondition(e,i){let t=this._lang,r=i+1;return o`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${s("compound_condition",t)} ${r}</span>
          <button
            type="button"
            class="icon-btn"
            title="${s("compound_remove_condition",t)}"
            @click=${()=>this._removeCondition(i)}
          >✕</button>
        </div>
        ${this._entityPickerFallback?o`
          <ms-textfield
            label="${s("entity_id",t)} (${s("comma_separated",t)})"
            .value=${e.entityIds}
            @input=${h=>this._patchCondition(i,{entityIds:h.target.value})}
          ></ms-textfield>
        `:o`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:C}}}]}
          .data=${{condition_entities:e.entityIds.split(",").map(h=>h.trim()).filter(Boolean)}}
          .computeLabel=${()=>s("entity_id",t)}
          @value-changed=${h=>{let c=(h.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(i,{entityIds:c.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(e,i)}
        <div class="select-row">
          <label>${s("trigger_type",t)}</label>
          <select
            .value=${e.type}
            @change=${h=>this._patchCondition(i,{type:h.target.value})}
          >
            ${D.map(h=>o`<option value=${h} ?selected=${h===e.type}>${s(h,t)}</option>`)}
          </select>
        </div>
        ${this._renderConditionTypeFields(e,i)}
      </div>
    `}_renderStateField(e){return this._entityPickerFallback||!e.entityId?o`
        <ms-textfield
          label=${e.label}
          .value=${e.value}
          @input=${i=>e.onInput(i.target.value)}
        ></ms-textfield>
      `:o`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId}}}]}
        .data=${{s:e.value}}
        .computeLabel=${()=>e.label}
        @value-changed=${i=>e.onInput((i.detail.value.s||"").trim())}
      ></ha-form>
    `}_renderOnStatesField(e){let i=this._lang;return this._entityPickerFallback||!e.entityId?o`
        <ms-textfield
          label="${s("runtime_on_states",i)}"
          placeholder="on"
          .value=${e.value}
          @input=${t=>e.onInput(t.target.value)}
        ></ms-textfield>
      `:o`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId,multiple:!0}}}]}
        .data=${{s:(e.value||"").split(",").map(t=>t.trim()).filter(Boolean)}}
        .computeLabel=${()=>s("runtime_on_states",i)}
        @value-changed=${t=>e.onInput((t.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(e){return this._scheduleType==="one_time"||this._scheduleType==="manual"?p:o`
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
        ${this._adaptiveEnabled?o`
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
    `}_renderAttributeSelect(e){let i=this._lang;return e.available.length>0?o`
        <div class="select-row">
          <label>${e.label}</label>
          <select
            .value=${e.value}
            @change=${t=>e.onSelect(t.target.value)}
          >
            <option value="" ?selected=${!e.value}>${s("use_entity_state",i)}</option>
            ${e.suggested.map(t=>o`<option value=${t} ?selected=${t===e.value}>${t} ★</option>`)}
            ${e.available.filter(t=>!e.suggested.includes(t.name)).map(t=>o`<option value=${t.name} ?selected=${t.name===e.value}>${t.name}${t.numeric?"":" (non-numeric)"}</option>`)}
          </select>
        </div>
      `:o`
      <ms-textfield
        label="${e.label}"
        .value=${e.value}
        @input=${t=>e.onSelect(t.target.value.trim())}
      ></ms-textfield>
    `}_renderEnvironmentalAttribute(e){this._fetchConditionAttributes(this._environmentalEntity);let i=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:s("environmental_attribute_optional",e),value:this._environmentalAttribute,suggested:i?.suggested??[],available:i?.available??[],onSelect:t=>this._environmentalAttribute=t})}_renderConditionAttribute(e,i){let t=e.entityIds.split(",")[0]?.trim()||"";t&&this._fetchConditionAttributes(t);let r=t?this._conditionAttrOptions[t]:void 0;return this._renderAttributeSelect({label:s("attribute_optional",this._lang),value:e.attribute,suggested:r?.suggested??[],available:r?.available??[],onSelect:h=>this._patchCondition(i,{attribute:h})})}_renderConditionTypeFields(e,i){let t=this._lang;if(e.type==="threshold")return o`
        <ms-textfield label="${s("trigger_above",t)}" type="number" .value=${e.above}
          @input=${r=>this._patchCondition(i,{above:r.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_below",t)}" type="number" .value=${e.below}
          @input=${r=>this._patchCondition(i,{below:r.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_equals",t)}" type="number" .value=${e.equals}
          @input=${r=>this._patchCondition(i,{equals:r.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_not_equals",t)}" type="number" .value=${e.notEquals}
          @input=${r=>this._patchCondition(i,{notEquals:r.target.value})}></ms-textfield>
        <ms-textfield label="${s("for_minutes",t)}" type="number" .value=${e.forMinutes}
          @input=${r=>this._patchCondition(i,{forMinutes:r.target.value})}></ms-textfield>
      `;if(e.type==="counter")return o`
        <ms-textfield label="${s("target_value",t)}" type="number" .value=${e.targetValue}
          @input=${r=>this._patchCondition(i,{targetValue:r.target.value})}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${e.deltaMode}
            @change=${r=>this._patchCondition(i,{deltaMode:r.target.checked})} />
          ${s("delta_mode",t)}
        </label>
      `;if(e.type==="state_change"){let r=e.entityIds.split(",")[0]?.trim()||"";return o`
        ${this._renderStateField({label:s("from_state_optional",t),value:e.fromState,entityId:r,onInput:h=>this._patchCondition(i,{fromState:h})})}
        ${this._renderStateField({label:s("to_state_optional",t),value:e.toState,entityId:r,onInput:h=>this._patchCondition(i,{toState:h})})}
        <ms-textfield label="${s("target_changes",t)}" type="number" .value=${e.targetChanges}
          @input=${h=>this._patchCondition(i,{targetChanges:h.target.value})}></ms-textfield>
      `}if(e.type==="runtime"){let r=e.entityIds.split(",")[0]?.trim()||"";return o`
        <ms-textfield label="${s("runtime_hours",t)}" type="number" .value=${e.runtimeHours}
          @input=${h=>this._patchCondition(i,{runtimeHours:h.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:e.onStates,entityId:r,onInput:h=>this._patchCondition(i,{onStates:h})})}
      `}return p}_renderUnitSelect(){let e=this._lang;return o`
      <div class="select-row">
        <label>${s("interval_unit",e)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${i=>this._intervalUnit=i.target.value}
        >
          ${["days","weeks","months","years"].map(i=>o`<option value=${i} ?selected=${i===this._intervalUnit}>${s("unit_"+i,e)}</option>`)}
        </select>
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(i=>i!==e):[...this._weekdays,e]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(A.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let e=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!e||e<=0?null:{kind:"interval",every:e,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(e){super.updated?.(e),this._scheduleEntityPickerProbe();for(let i of e.keys())if(n._PREVIEW_RELEVANT.has(String(i))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let e=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),i=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!e||!i){this._pickerProbeStrikes=0;return}let t=(_,d,g=0)=>{if(!(!_||g>10)){(_.tagName?.toLowerCase()??"")==="ha-entity-picker"&&d.push(_);for(let v of[_.shadowRoot,_])if(v)for(let m of Array.from(v.children??[]))t(m,d,g+1)}},r=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],h=[];for(let _ of r)t(_,h);let c=h.length===0||h.some(_=>_.offsetHeight===0);if(e.offsetHeight===0||c){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let e=this._open?this._previewScheduleDict():null;if(!e){this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let i=++this._previewSeq;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:e,...this._lastPerformed?{last_performed:this._lastPerformed}:{}});if(i!==this._previewSeq)return;this._schedulePreview=t.occurrences||[],this._schedulePreviewEnded=!!t.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return p;let e=this._lang,i=this.scheduleTimeEnabled&&this._scheduleTime?` ${this._scheduleTime}`:"",t=this._schedulePreview.map((h,c)=>{let _=new Date(`${h}T12:00:00`).getDay();return`${S(_===0?6:_-1,e,"short")} ${F(h,e)}${c===0?i:""}`}).join(" \xB7 "),r=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?o`<div class="field-help">${s("schedule_preview_ontime",e)}</div>`:p;return o`
      <div class="trigger-live-hint schedule-preview">
        ${s("schedule_preview_title",e)}: ${t}${this._schedulePreviewEnded?o` <span class="field-help">${s("schedule_preview_ends",e)}</span>`:p}
        ${r}
      </div>
    `}_buildSchedule(){let e=t=>{let r=parseInt(this._calOffset,10)||0;return r&&(t.offset=Math.max(-15,Math.min(r,15))),t};if(this._scheduleType==="weekdays")return e({kind:"weekdays",weekdays:[...this._weekdays].sort((t,r)=>t-r)});if(this._scheduleType==="nth_weekday")return e({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});let i={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(i.business=!0),e(i)}_recurrenceExtras(){let e={};if(this._seasonMonths.length&&(e.season_months=[...this._seasonMonths].sort((i,t)=>i-t)),this._endsMode==="count"){let i=parseInt(this._endsCount,10);i>=1&&(e.ends={count:i})}else this._endsMode==="until"&&this._endsUntil&&(e.ends={until:this._endsUntil});return e}_toggleSeasonMonth(e){this._seasonMonths=this._seasonMonths.includes(e)?this._seasonMonths.filter(i=>i!==e):[...this._seasonMonths,e]}_renderRecurrenceExtras(){let e=this._lang;if(!(this._scheduleType==="time_based"||A.includes(this._scheduleType)))return p;let t=Z(e);return o`
      <label class="field-label">${s("season_window_label",e)}</label>
      <div class="field-help">${s("season_window_hint",e)}</div>
      <div class="weekday-chips season-chips">
        ${t.map((r,h)=>o`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(h+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(h+1)}
          >${r}</button>`)}
      </div>

      <label class="field-label">${s("series_end_label",e)}</label>
      <div class="select-row">
        <select .value=${this._endsMode}
          @change=${r=>this._endsMode=r.target.value}>
          <option value="never" ?selected=${this._endsMode==="never"}>${s("series_end_never",e)}</option>
          <option value="count" ?selected=${this._endsMode==="count"}>${s("series_end_after_count",e)}</option>
          <option value="until" ?selected=${this._endsMode==="until"}>${s("series_end_until",e)}</option>
        </select>
      </div>
      ${this._endsMode==="count"?o`
        <ms-textfield
          label="${s("series_end_count_label",e)}"
          type="number" min="1"
          .value=${this._endsCount}
          @input=${r=>this._endsCount=r.target.value}
        ></ms-textfield>`:p}
      ${this._endsMode==="until"?o`
        <ms-textfield
          label="${s("series_end_until_label",e)}"
          type="date"
          .value=${this._endsUntil}
          @input=${r=>this._endsUntil=r.target.value}
        ></ms-textfield>`:p}
    `}_renderCalendarFields(){let e=this._lang,i=X(e);if(this._scheduleType==="weekdays")return o`
        <label class="field-label">${s("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${i.map((t,r)=>o`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(r)?"selected":""}"
              @click=${()=>this._toggleWeekday(r)}
            >${t}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let t=[["1",s("ord_1",e)],["2",s("ord_2",e)],["3",s("ord_3",e)],["4",s("ord_4",e)],["5",s("ord_5",e)],["-1",s("ord_last",e)]];return o`
        <div class="select-row">
          <label>${s("recurrence_occurrence",e)}</label>
          <select .value=${this._nth} @change=${r=>this._nth=r.target.value}>
            ${t.map(([r,h])=>o`<option value=${r} ?selected=${r===this._nth}>${h}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${s("recurrence_weekday",e)}</label>
          <select .value=${this._nthWeekday} @change=${r=>this._nthWeekday=r.target.value}>
            ${i.map((r,h)=>o`<option value=${String(h)} ?selected=${String(h)===this._nthWeekday}>${r}</option>`)}
          </select>
        </div>
        ${this._renderCalOffsetField()}`}return this._scheduleType==="day_of_month"?o`
        ${this._domLastDay?p:o`
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
        ${this._renderCalOffsetField()}`:p}_renderCalOffsetField(){let e=this._lang;return o`
      <ms-textfield
        label="${s("recurrence_offset",e)}"
        helper="${s("recurrence_offset_help",e)}"
        type="number"
        min="-15"
        max="15"
        .value=${this._calOffset}
        @input=${i=>this._calOffset=i.target.value}
      ></ms-textfield>`}_renderTriggerLiveHint(){if(this._triggerType==="compound")return p;let e=this._triggerEntityId||this._triggerEntityIds[0];if(!e||!this.hass?.states)return p;let i=this.hass.states[e];if(!i)return p;let t=this._lang,r=i.attributes?.unit_of_measurement,h=typeof r=="string"&&r?` ${r}`:"",c=this._triggerAttribute?i.attributes?.[this._triggerAttribute]:i.state,_=typeof c=="number"?c:parseFloat(String(c)),d=c!=="unknown"&&c!=="unavailable"&&c!=null&&!isNaN(_),g=m=>Number.isInteger(m)?String(m):String(Math.round(m*10)/10),v=[];if(this._triggerType==="threshold"){let m=parseFloat(this._triggerAbove),f=parseFloat(this._triggerBelow);if(isNaN(m)&&isNaN(f))return p;d&&v.push(s("trigger_hint_now",t).replace("{value}",g(_)+h)),isNaN(m)||v.push(s("trigger_hint_above",t).replace("{target}",g(m)+h)),isNaN(f)||v.push(s("trigger_hint_below",t).replace("{target}",g(f)+h))}else if(this._triggerType==="counter"){let m=parseFloat(this._triggerTargetValue);if(isNaN(m))return p;this._triggerDeltaMode?this._taskId?v.push(s("trigger_hint_counter_delta_edit",t).replace("{target}",g(m)+h)):d?v.push(s("trigger_hint_counter_delta",t).replace("{value}",g(_)+h).replace("{due}",g(_+m)+h).replace("{target}",g(m)+h)):v.push(s("trigger_hint_counter_delta_edit",t).replace("{target}",g(m)+h)):(d&&v.push(s("trigger_hint_now",t).replace("{value}",g(_)+h)),v.push(s("trigger_hint_counter_abs",t).replace("{target}",g(m)+h)))}else if(this._triggerType==="runtime"){let m=parseFloat(this._triggerRuntimeHours);if(isNaN(m))return p;v.push(s("trigger_hint_runtime",t).replace("{hours}",g(m))),v.push(s("trigger_hint_state_now",t).replace("{value}",String(i.state)))}else if(this._triggerType==="state_change"){let m=parseInt(this._triggerTargetChanges,10)||1,f=this._triggerToState.trim();v.push((f?s("trigger_hint_state_change_to",t).replace("{state}",f):s("trigger_hint_state_change",t)).replace("{count}",String(m))),v.push(s("trigger_hint_state_now",t).replace("{value}",String(i.state)))}return v.length?o`<div class="trigger-live-hint">${v.join(" ")}</div>`:p}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?o`
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
      `:this._triggerType==="counter"?o`
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
        ${this._triggerDeltaMode?o`
              <ms-textfield
                label="${s("baseline_start_value",e)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${i=>this._triggerBaselineValue=i.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?s("baseline_start_help_edit",e):s("baseline_start_help",e)}
                ${this._taskId&&this._liveBaselineValue!=null?o`<div class="baseline-effective">
                      ${s("baseline_current_effective",e).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:p}
              </div>
            `:p}
      `:this._triggerType==="state_change"?o`
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
        <ms-textfield
          label="${s("for_at_least_minutes",e)}"
          type="number"
          min="0"
          .value=${this._triggerForMinutes}
          @input=${i=>this._triggerForMinutes=i.target.value}
        ></ms-textfield>
        <div class="field-help">${s("for_minutes_state_help",e)}</div>
      `:this._triggerType==="runtime"?o`
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
      `:p}render(){if(!this._open)return o``;let e=this._lang,i=this._taskId?s("edit_task",e):s("new_task",e);return o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i}</div>
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:p}
          ${this._taskId===null&&this._objectChoices.length>0?o`
            <div class="select-row">
              <label>${s("object",e)}</label>
              <select
                .value=${this._entryId}
                @change=${t=>{this._entryId=t.target.value,this._consumesParts={},this._loadParts(),this._loadForeignPools()}}
              >
                ${this._objectChoices.map(t=>o`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
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
              ${z.map(t=>o`<option value=${t} ?selected=${t===this._type}>${s(t,e)}</option>`)}
            </select>
          </div>
          ${this._type==="reading"?o`
                <ms-textfield
                  label="${s("reading_unit_label",e)}"
                  .value=${this._readingUnit}
                  @input=${t=>this._readingUnit=t.target.value}
                ></ms-textfield>
                <div class="field-help">${s("reading_unit_help",e)}</div>
              `:p}
          ${this._partsLoadFailed?o`<div class="field-help parts-load-failed">${s("parts_load_failed",e)}</div>`:p}
          ${this.parts.length||this._foreignOwners.length?o`
                <div class="field">
                  <label>${s("consumes_parts_label",e)}</label>
                  ${this.parts.map(t=>this._renderConsumesRow(t))}
                  ${this._foreignOwners.length?o`
                        <details class="shared-pools" ?open=${this._hasForeignPick}>
                          <summary>${s("shared_parts_other_objects",e)}</summary>
                          <div class="field-help">${s("shared_parts_help",e)}</div>
                          ${this._foreignOwners.map(t=>o`
                              <div class="shared-pool-owner">${t.name}</div>
                              ${t.parts.map(r=>this._renderConsumesRow(r,t.entry_id))}
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
              ${V.map(t=>o`<option value=${t} ?selected=${t===this._priority}>${s("priority_"+t,e)}</option>`)}
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
              ${W.map(t=>o`<option value=${t} ?selected=${t===this._scheduleType}>${s(t,e)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?o`
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
                ${this.scheduleTimeEnabled?o`
                  <ms-textfield
                    label="${s("schedule_time_optional",e)}"
                    type="time"
                    .value=${this._scheduleTime}
                    helper="${s("schedule_time_help",e)}"
                    @input=${t=>this._scheduleTime=t.target.value}
                  ></ms-textfield>
                `:p}
              `:p}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?o`
                <ms-textfield
                  label="${s("due_date",e)}"
                  type="date"
                  .value=${this._dueDate}
                  @input=${t=>this._dueDate=t.target.value}
                ></ms-textfield>
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
          ${this.checklistsEnabled?o`
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
            ${k.map(t=>o`
              <label class="req-option">
                <input
                  type="checkbox"
                  .checked=${this._requiredCompletion.includes(t)}
                  @change=${r=>this._toggleRequired(t,r.target.checked)}
                />
                <span>${s(q[t],e)}</span>
              </label>
            `)}
          </div>
          <ms-textfield
            label="${s("last_performed_optional",e)}"
            type="date"
            .value=${this._lastPerformed}
            @input=${t=>this._lastPerformed=t.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${s("responsible_user",e)}</label>
            <select
              .value=${this._responsibleUserId||""}
              @change=${t=>{let r=t.target.value;this._responsibleUserId=r||null}}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${s("no_user_assigned",e)}</option>
              ${this._availableUsers.map(t=>o`<option value=${t.id} ?selected=${t.id===this._responsibleUserId}>${t.name}</option>`)}
            </select>
          </div>
          ${this._availableUsers.length>=2?o`
            <div class="field">
              <label>${s("shared_with",e)}</label>
              <div class="field-help">${s("shared_with_help",e)}</div>
              <div class="assignee-pool">
                ${this._availableUsers.map(t=>o`
                  <label class="pool-item">
                    <input type="checkbox"
                      .checked=${this._assigneePool.includes(t.id)}
                      @change=${()=>this._toggleAssignee(t.id)} />
                    <span>${t.name}</span>
                  </label>`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?o`
              <div class="select-row">
                <label>${s("rotation_strategy",e)}</label>
                <select
                  .value=${this._rotationStrategy}
                  @change=${t=>this._rotationStrategy=t.target.value}
                >
                  <option value="" ?selected=${!this._rotationStrategy}>${s("rotation_none",e)}</option>
                  ${["round_robin","least_completed","random"].map(t=>o`<option value=${t} ?selected=${t===this._rotationStrategy}>${s("rotation_"+t,e)}</option>`)}
                </select>
              </div>`:p}
          `:p}
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"?o`
            ${this._entityPickerFallback?o`
              <ms-textfield
                label="${s("environmental_entity_optional",e)}"
                helper="${s("environmental_entity_helper",e)}"
                .value=${this._environmentalEntity}
                @input=${t=>this._environmentalEntity=t.target.value.trim()}
              ></ms-textfield>
            `:o`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:O,device_class:U}}}]}
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
          ${this._availableTags.length>0?o`
              <div class="select-row">
                <label>${s("nfc_tag_id_optional",e)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${t=>this._nfcTagId=t.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${s("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(t=>o`<option value=${t.id} ?selected=${t.id===this._nfcTagId}>${t.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${s("nfc_tags_refresh",e)}">↻</button>
              </div>
            `:o`
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
          ${this._requireTagScan?o`<div class="field-help">${s("require_tag_scan_help",e)}</div>`:p}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._allowSkip}
              @change=${t=>this._allowSkip=!t.target.checked}
            />
            <span>${s("disallow_skip",e)}</span>
          </label>
          ${this._allowSkip?p:o`<div class="field-help">${s("disallow_skip_help",e)}</div>`}
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
    `}};n._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),n.styles=L`
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
  `,a([$({attribute:!1})],n.prototype,"hass",2),a([$({type:Boolean,attribute:"checklists-enabled"})],n.prototype,"checklistsEnabled",2),a([$({type:Boolean,attribute:"schedule-time-enabled"})],n.prototype,"scheduleTimeEnabled",2),a([$({type:Boolean,attribute:"completion-actions-enabled"})],n.prototype,"completionActionsEnabled",2),a([$({type:Number,attribute:"default-warning-days"})],n.prototype,"defaultWarningDays",2),a([l()],n.prototype,"parts",2),a([l()],n.prototype,"_foreignOwners",2),a([l()],n.prototype,"_open",2),a([l()],n.prototype,"_entityPickerFallback",2),a([l()],n.prototype,"_loading",2),a([l()],n.prototype,"_error",2),a([l()],n.prototype,"_entryId",2),a([l()],n.prototype,"_taskId",2),a([l()],n.prototype,"_objectChoices",2),a([l()],n.prototype,"_name",2),a([l()],n.prototype,"_type",2),a([l()],n.prototype,"_scheduleType",2),a([l()],n.prototype,"_intervalDays",2),a([l()],n.prototype,"_intervalUnit",2),a([l()],n.prototype,"_dueDate",2),a([l()],n.prototype,"_warningDays",2),a([l()],n.prototype,"_earliestCompletionDays",2),a([l()],n.prototype,"_intervalAnchor",2),a([l()],n.prototype,"_weekdays",2),a([l()],n.prototype,"_nth",2),a([l()],n.prototype,"_nthWeekday",2),a([l()],n.prototype,"_domDay",2),a([l()],n.prototype,"_domLastDay",2),a([l()],n.prototype,"_domBusiness",2),a([l()],n.prototype,"_calOffset",2),a([l()],n.prototype,"_seasonMonths",2),a([l()],n.prototype,"_endsMode",2),a([l()],n.prototype,"_endsCount",2),a([l()],n.prototype,"_endsUntil",2),a([l()],n.prototype,"_schedulePreview",2),a([l()],n.prototype,"_schedulePreviewEnded",2),a([l()],n.prototype,"_notes",2),a([l()],n.prototype,"_documentationUrl",2),a([l()],n.prototype,"_customIcon",2),a([l()],n.prototype,"_priority",2),a([l()],n.prototype,"_labels",2),a([l()],n.prototype,"_enabled",2),a([l()],n.prototype,"_triggerEntityId",2),a([l()],n.prototype,"_triggerEntityIds",2),a([l()],n.prototype,"_triggerEntityLogic",2),a([l()],n.prototype,"_triggerAttribute",2),a([l()],n.prototype,"_triggerType",2),a([l()],n.prototype,"_triggerAbove",2),a([l()],n.prototype,"_triggerBelow",2),a([l()],n.prototype,"_triggerEquals",2),a([l()],n.prototype,"_triggerNotEquals",2),a([l()],n.prototype,"_triggerForMinutes",2),a([l()],n.prototype,"_triggerCombinator",2),a([l()],n.prototype,"_triggerTargetValue",2),a([l()],n.prototype,"_triggerDeltaMode",2),a([l()],n.prototype,"_triggerBaselineValue",2),a([l()],n.prototype,"_liveBaselineValue",2),a([l()],n.prototype,"_autoCompleteOnRecovery",2),a([l()],n.prototype,"_triggerFromState",2),a([l()],n.prototype,"_triggerToState",2),a([l()],n.prototype,"_triggerTargetChanges",2),a([l()],n.prototype,"_triggerRuntimeHours",2),a([l()],n.prototype,"_triggerRuntimeMaxSession",2),a([l()],n.prototype,"_triggerOnStates",2),a([l()],n.prototype,"_compoundLogic",2),a([l()],n.prototype,"_compoundConditions",2),a([l()],n.prototype,"_suggestedAttributes",2),a([l()],n.prototype,"_availableAttributes",2),a([l()],n.prototype,"_entityDomain",2),a([l()],n.prototype,"_lastPerformed",2),a([l()],n.prototype,"_nfcTagId",2),a([l()],n.prototype,"_requireTagScan",2),a([l()],n.prototype,"_allowSkip",2),a([l()],n.prototype,"_readingUnit",2),a([l()],n.prototype,"_consumesParts",2),a([l()],n.prototype,"_partsLoadFailed",2),a([l()],n.prototype,"_availableTags",2),a([l()],n.prototype,"_responsibleUserId",2),a([l()],n.prototype,"_assigneePool",2),a([l()],n.prototype,"_rotationStrategy",2),a([l()],n.prototype,"_availableUsers",2),a([l()],n.prototype,"_checklistText",2),a([l()],n.prototype,"_phaseDefs",2),a([l()],n.prototype,"_phaseSeq",2),a([l()],n.prototype,"_requiredCompletion",2),a([l()],n.prototype,"_scheduleTime",2),a([l()],n.prototype,"_actionService",2),a([l()],n.prototype,"_actionTargetEntity",2),a([l()],n.prototype,"_actionData",2),a([l()],n.prototype,"_actionDataJsonFallback",2),a([l()],n.prototype,"_actionTesting",2),a([l()],n.prototype,"_actionTestResult",2),a([l()],n.prototype,"_actionTestError",2),a([l()],n.prototype,"_qcNotes",2),a([l()],n.prototype,"_qcCost",2),a([l()],n.prototype,"_qcDuration",2),a([l()],n.prototype,"_qcFeedback",2),a([l()],n.prototype,"_environmentalEntity",2),a([l()],n.prototype,"_environmentalAttribute",2),a([l()],n.prototype,"_adaptiveEnabled",2),a([l()],n.prototype,"_adaptiveAlpha",2),a([l()],n.prototype,"_adaptiveMin",2),a([l()],n.prototype,"_adaptiveMax",2),a([l()],n.prototype,"_adaptiveSeasonal",2),a([l()],n.prototype,"_adaptivePrediction",2),a([l()],n.prototype,"_conditionAttrOptions",2);var P=n;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",P);export{P as a};
