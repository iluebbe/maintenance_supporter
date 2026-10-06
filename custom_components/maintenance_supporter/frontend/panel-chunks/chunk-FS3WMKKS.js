/*! maintenance_supporter frontend 2.99.0 */
import{a as H,d as K,e as Y,j as J,k as X,l as ie,m as U,n as B}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-U765ZP6U.js";import{e as Z}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ZLMPP5Y2.js";import{d as ee,e as te,f as T,g as w,h as I,i as O,j as M}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-RHKFQ4Q2.js";import{a as k}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-Z23VO7TM.js";import{H as W,K as N,O as R,V as F,W as Q,a as o,b as V,c as l,f as _,h as G,l as $,m as d,s}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LR7NBHRI.js";var D=["sensor","binary_sensor","number","input_number","input_boolean","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock","plant"],se=["sensor"],re=["temperature","humidity","pressure"];var ue={cleaning:"mdi:broom",inspection:"mdi:magnify",replacement:"mdi:swap-horizontal",calibration:"mdi:tune",service:"mdi:wrench",reading:"mdi:counter",custom:"mdi:wrench-clock"},ge="mdi:wrench-clock",j=h=>h&&ue[h]||ge;function C(h){return h?Array.isArray(h.entity_ids)&&h.entity_ids.length>0?[...h.entity_ids]:h.entity_id?[h.entity_id]:[]:[]}function ne(h){if(!(!h||h.type==="compound"))return C(h)[0]}var me=["cleaning","inspection","replacement","calibration","service","reading","custom"],ve=["low","normal","high"],fe=["time_based","weekdays","nth_weekday","day_of_month","calendar","sensor_based","one_time","manual"],A=["weekdays","nth_weekday","day_of_month","calendar"],ae=["time_based","one_time",...A],de=["threshold","counter","state_change","runtime","due_date"],oe=(h,g)=>s(h==="due_date"?"trigger_type_due_date":h,g),ye=[...de,"compound"],E={alpha:"0.3",min:"7",max:"365"},x=M;function le(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",daysBefore:"0",carry:{}}}var be=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states","trigger_days_before"]);function he(h){return{type:h.type||"threshold",attribute:h.attribute||"",above:h.trigger_above?.toString()??"",below:h.trigger_below?.toString()??"",equals:h.trigger_equals?.toString()??"",notEquals:h.trigger_not_equals?.toString()??"",forMinutes:h.trigger_for_minutes?.toString()??"0",targetValue:h.trigger_target_value?.toString()??"",deltaMode:h.trigger_delta_mode||!1,fromState:h.trigger_from_state||"",toState:h.trigger_to_state||"",targetChanges:h.trigger_target_changes?.toString()??"",runtimeHours:h.trigger_runtime_hours?.toString()??"",onStates:(h.trigger_on_states||[]).join(", "),daysBefore:h.trigger_days_before?.toString()??"0"}}function _e(h,g){g.attribute&&(h.attribute=g.attribute);let e=parseInt(g.forMinutes,10);if(g.type==="threshold"){let i=parseFloat(g.above);isNaN(i)||(h.trigger_above=i);let t=parseFloat(g.below);isNaN(t)||(h.trigger_below=t);let r=parseFloat(g.equals);isNaN(r)||(h.trigger_equals=r);let n=parseFloat(g.notEquals);isNaN(n)||(h.trigger_not_equals=n),isNaN(e)||(h.trigger_for_minutes=e)}else if(g.type==="counter"){let i=parseFloat(g.targetValue);isNaN(i)||(h.trigger_target_value=i),h.trigger_delta_mode=g.deltaMode}else if(g.type==="state_change"){g.fromState&&(h.trigger_from_state=g.fromState),g.toState&&(h.trigger_to_state=g.toState);let i=parseInt(g.targetChanges,10);isNaN(i)||(h.trigger_target_changes=i),isNaN(e)||(h.trigger_for_minutes=e)}else if(g.type==="runtime"){let i=parseFloat(g.runtimeHours);isNaN(i)||(h.trigger_runtime_hours=i);let t=(g.onStates||"").split(",").map(r=>r.trim()).filter(Boolean);t.length>0&&(h.trigger_on_states=t)}else if(g.type==="due_date"){let i=parseInt(g.daysBefore,10);h.trigger_days_before=isNaN(i)?0:i}}function $e(h){return{entityIds:C(h).join(", "),...he(h),carry:Object.fromEntries(Object.entries(h).filter(([e])=>!be.has(e)&&!e.startsWith("_")))}}function Ee(h){let g=h.entityIds.split(",").map(i=>i.trim()).filter(Boolean);if(g.length===0)return null;let e={...h.carry||{},entity_id:g[0],entity_ids:g,type:h.type};return _e(e,h),e}function xe(h){return Array.from({length:7},(g,e)=>F(e,h,"short"))}function Te(h){return Array.from({length:12},(g,e)=>Q(e,h,"short"))}var a=class a extends G{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.adaptiveFeature=!1;this.seasonalFeature=!1;this.environmentalFeature=!1;this.defaultWarningDays=7;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._warning="";this._entryId="";this._taskId=null;this._isFleetTask=!1;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._calendarEntity="";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._notifyIcon="";this._priority="normal";this._labels="";this._mirrorTodoEntities=[];this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerDaysBefore="0";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._notifyEnabled=!0;this._readingUnit="";this._readings=[];this._consumesParts={};this._consumesQtyText={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._loadedLastPerformed="";this._loadedResponsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._scheduleTimeOn=!1;this._actionService="";this._actionTargetEntity="";this._actionTargetStored=null;this._actionTargetInitial="";this._actionSkipAuto=!1;this._actionPresent=!1;this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=E.alpha;this._adaptiveMin=E.min;this._adaptiveMax=E.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._adaptiveWasEnabled=!1;this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return W(this.hass)}async openCreate(e,i){this._entryId=e,this._taskId=null,this._isFleetTask=!1,this._error="",this._warning="",!e&&i&&i.length>0?(this._objectChoices=i.map(t=>({entry_id:t.entry_id,name:t.object.name})).sort((t,r)=>t.name.localeCompare(r.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(e,i){this._entryId=e,this._taskId=i.id,this._error="",this._warning="",this._objectChoices=[],this._isFleetTask=i.battery_fleet_task===!0,this._name=i.name,this._type=i.type,this._scheduleType=i.schedule_type,this._intervalDays=i.interval_days!=null?String(i.interval_days):"",this._intervalUnit=i.interval_unit||"days",this._dueDate=i.due_date||"";let t=i.schedule;this._weekdays=t?.kind==="weekdays"?[...t.weekdays??[]]:[],this._nth=t?.kind==="nth_weekday"?String(t.nth??1):"1",this._nthWeekday=t?.kind==="nth_weekday"?String(t.weekday??5):"5",this._domDay=t?.kind==="day_of_month"&&(t.day??1)>=1?String(t.day??1):"1",this._domLastDay=t?.kind==="day_of_month"&&t.day===-1,this._domBusiness=t?.kind==="day_of_month"&&t.business===!0,this._calendarEntity=t?.kind==="calendar"&&t.entity_id||"",this._calOffset=t?.offset?String(t.offset):"0",this._seasonMonths=Array.isArray(t?.season_months)?[...t.season_months]:[];let r=t?.ends;r&&typeof r.count=="number"?(this._endsMode="count",this._endsCount=String(r.count),this._endsUntil=""):r&&typeof r.until=="string"?(this._endsMode="until",this._endsUntil=r.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=i.warning_days.toString(),this._earliestCompletionDays=i.earliest_completion_days!=null?String(i.earliest_completion_days):"",this._intervalAnchor=i.interval_anchor||"completion",this._notes=i.notes||"",this._documentationUrl=i.documentation_url||"",this._customIcon=i.custom_icon||"",this._notifyIcon=i.notify_icon||"",this._priority=i.priority||"normal",this._labels=(i.labels||[]).join(", "),this._mirrorTodoEntities=[...i.mirror_todo_entities||[]],this._enabled=i.enabled!==!1,this._lastPerformed=i.last_performed||"",this._loadedLastPerformed=this._lastPerformed,this._nfcTagId=i.nfc_tag_id||"",this._requireTagScan=!!i.require_tag_scan,this._allowSkip=i.allow_skip!==!1,this._notifyEnabled=i.notify_enabled!==!1,this._readingUnit=i.reading_unit||"",this._readings=(i.readings||[]).map(u=>({...u})),this._consumesParts=Object.fromEntries((i.consumes_parts||[]).map(u=>[H(u),{...u}])),this._consumesQtyText={},this._responsibleUserId=i.responsible_user_id||null,this._loadedResponsibleUserId=this._responsibleUserId,this._assigneePool=[...i.assignee_pool||[]],this._rotationStrategy=i.rotation_strategy||"",this._checklistText=(i.checklist||[]).join(`
`),this._phaseDefs=Object.entries(i.phases||{}).map(([u,m])=>{let{name:y,checklist:f,consumes_parts:v,required_completion_fields:b,...ce}=m,q=m.consumes_parts||[],P=q.findIndex(S=>!S.entry_id),L=P>=0?q[P]:void 0;return{id:u,name:m.name||u,checklistText:(m.checklist||[]).join(`
`),partId:L?.part_id||"",partQty:L?.quantity!=null?String(L.quantity):"",reqOverride:m.required_completion_fields!==void 0,reqFields:[...m.required_completion_fields||[]],extraParts:q.filter((S,pe)=>pe!==P).map(S=>({...S})),carry:ce}}),this._phaseSeq=[...i.phase_sequence||[]],this._requiredCompletion=[...i.required_completion_fields||[]],this._scheduleTime=i.schedule_time||"",this._scheduleTimeOn=!!i.schedule_time;let n=i.on_complete_action;if(n&&n.service){this._actionService=n.service;let u=n.target?.entity_id;this._actionTargetEntity=Array.isArray(u)?u[0]||"":u||"",this._actionTargetStored=n.target&&typeof n.target=="object"?JSON.parse(JSON.stringify(n.target)):null,this._actionTargetInitial=this._actionTargetEntity,this._actionData=n.data&&typeof n.data=="object"?{...n.data}:{},this._actionDataJsonFallback="",this._actionSkipAuto=n.skip_auto===!0,this._actionPresent=!0}else this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1;let c=i.quick_complete_defaults;this._qcNotes=c?.notes||"",this._qcCost=c?.cost!=null?String(c.cost):"",this._qcDuration=c?.duration!=null?String(c.duration):"",this._qcFeedback=c?.feedback||"";let p=i.adaptive_config||{};if(this._environmentalEntity=p.environmental_entity||"",this._environmentalAttribute=p.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!p.enabled,this._adaptiveAlpha=p.ewa_alpha?.toString()??E.alpha,this._adaptiveMin=p.min_interval_days?.toString()??E.min,this._adaptiveMax=p.max_interval_days?.toString()??E.max,this._adaptiveSeasonal=p.seasonal_enabled!==!1,this._adaptivePrediction=p.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=this._adaptiveEnabled,i.trigger_config){let u=i.trigger_config;this._triggerEntityId=ne(u)||"",this._triggerEntityIds=C(u),this._triggerEntityLogic=u.entity_logic||"any",this._setTypeFields(he(u)),this._triggerCombinator=u.trigger_combinator==="all"?"all":"any",this._triggerBaselineValue=u.trigger_baseline_value?.toString()||"",this._liveBaselineValue=i.trigger_baseline_value??null,this._autoCompleteOnRecovery=u.auto_complete_on_recovery||!1,this._triggerRuntimeMaxSession=u.trigger_runtime_max_session_seconds?.toString()||"",u.type==="compound"?(this._compoundLogic=u.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(u.conditions||[]).map($e)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._notifyIcon="",this._priority="normal",this._labels="",this._mirrorTodoEntities=[],this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._readingUnit="",this._readings=[],this._consumesParts={},this._consumesQtyText={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._scheduleTimeOn=!1,this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=E.alpha,this._adaptiveMin=E.min,this._adaptiveMax=E.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=!1,this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1,this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_typeFields(){return{type:this._triggerType,attribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,equals:this._triggerEquals,notEquals:this._triggerNotEquals,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,onStates:this._triggerOnStates,daysBefore:this._triggerDaysBefore}}_setTypeFields(e){this._triggerType=e.type,this._triggerAttribute=e.attribute,this._triggerAbove=e.above,this._triggerBelow=e.below,this._triggerEquals=e.equals,this._triggerNotEquals=e.notEquals,this._triggerForMinutes=e.forMinutes,this._triggerTargetValue=e.targetValue,this._triggerDeltaMode=e.deltaMode,this._triggerFromState=e.fromState,this._triggerToState=e.toState,this._triggerTargetChanges=e.targetChanges,this._triggerRuntimeHours=e.runtimeHours,this._triggerOnStates=e.onStates,this._triggerDaysBefore=e.daysBefore}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._setTypeFields(le()),this._triggerCombinator="any",this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._triggerRuntimeMaxSession="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new Z(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}_toggleAssignee(e){this._assigneePool=this._assigneePool.includes(e)?this._assigneePool.filter(i=>i!==e):[...this._assigneePool,e]}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError=s("action_test_bad_format",this._lang),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[i,t]=e.split(".");if(!this.hass?.services?.[i]?.[t]){this._actionTestResult="error",this._actionTestError=s("action_test_unknown_service",this._lang).replace("{service}",e),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let r=this._actionTargetEntity.trim();if(r){let n=r.split(".")[0];if(n!==i&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(i)){this._actionTestResult="error",this._actionTestError=s("action_test_domain_mismatch",this._lang).replace("{service}",e).replace("{domain}",i).replace("{entity}",r).replace("{entity_domain}",n).replace("{suggestion}",`${n}.${t}`),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[r]){this._actionTestResult="error",this._actionTestError=s("action_test_entity_missing",this._lang).replace("{entity}",r),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[i,t]=e.split("."),r=this.hass?.services?.[i]?.[t]?.fields;return!r||Object.keys(r).length===0?null:Object.entries(r).map(([n,c])=>({name:n,required:!!c.required,selector:c.selector||{text:{}}}))}_actionTargetExtended(){let e=this._actionTargetStored;return e?Object.entries(e).some(([i,t])=>i==="entity_id"?Array.isArray(t)&&t.length>1:Array.isArray(t)?t.length>0:!!t):!1}_actionTargetSummary(){let e=this._actionTargetStored||{},i=r=>(Array.isArray(r)?r:[r]).filter(n=>typeof n=="string"&&!!n),t=this.hass;return[...i(e.entity_id).map(r=>t.states?.[r]?.attributes?.friendly_name||r),...i(e.device_id).map(r=>t.devices?.[r]?.name_by_user||t.devices?.[r]?.name||r),...i(e.area_id).map(r=>t.areas?.[r]?.name||r),...i(e.floor_id).map(r=>t.floors?.[r]?.name||r),...i(e.label_id)].join(", ")}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled&&!this._actionPresent)return _;let i=this._serviceSchema();return l`
      <details class="ca-section">
        <summary>${s("on_complete_action_title",e)}</summary>
        <p class="field-help">${s("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${t=>{this._actionService=t.detail.value||"";let r=this._serviceSchema();if(r){let n=new Set(r.map(c=>c.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([c])=>n.has(c)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>s("on_complete_action_target",e)}
          @value-changed=${t=>{let r=t.detail.value;this._actionTargetEntity=r.target_entity||""}}
        ></ha-form>
        ${this._actionTargetExtended()&&this._actionTargetEntity.trim()===this._actionTargetInitial?l`<p class="field-help ca-target-more">${s("on_complete_action_target_more",e).replace("{targets}",this._actionTargetSummary())}</p>`:_}
        <p class="field-help ca-domain-hint">
          ${s("on_complete_action_target_hint",e)}
        </p>
        <label class="ca-skip-auto">
          <input type="checkbox" .checked=${this._actionSkipAuto}
            @change=${t=>{this._actionSkipAuto=t.target.checked}} />
          <span>${s("on_complete_action_skip_auto",e)}</span>
        </label>
        ${i?l`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${i}
                .data=${this._actionData}
                @value-changed=${t=>{this._actionData={...t.detail.value}}}
              ></ha-form>
            `:l`
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
          ${this._actionTestResult==="ok"?l`<span class="ca-test-ok">${s("on_complete_action_test_success",e)}</span>`:_}
          ${this._actionTestResult==="error"?l`<div class="ca-test-error-block">
                <span class="ca-test-error">${s("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?l`<div class="ca-test-error-detail">${this._actionTestError}</div>`:_}
              </div>`:_}
        </div>
      </details>

      ${this.completionActionsEnabled?l`<details class="ca-section">
        <summary>${s("quick_complete_defaults_title",e)}</summary>
        <p class="field-help">${s("quick_complete_defaults_desc",e)}</p>
        <ms-textfield
          label="${s("quick_complete_defaults_notes",e)}"
          .value=${this._qcNotes}
          @input=${t=>{this._qcNotes=t.target.value}}
        ></ms-textfield>
        <div class="qc-cost">
          <span class="qc-cost-label">${s("quick_complete_defaults_cost",e)}</span>
          <ms-cost-input .lang=${e} .value=${this._qcCost}
            @value-changed=${t=>{this._qcCost=t.detail.value}}></ms-cost-input>
        </div>
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
          <option value="not_sure">${s("feedback_not_sure",e)}</option>
        </select>
      </details>`:_}
    `}async _loadParts(){if(this.parts=[],!!this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this.parts=e.parts||[],this._partsLoadFailed=!1}catch{this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){if(this._foreignOwners=[],!!this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._foreignOwners=(e.objects||[]).filter(i=>i.entry_id!==this._entryId&&(i.parts||[]).length>0).map(i=>({entry_id:i.entry_id,name:i.object?.name||i.entry_id,parts:i.parts||[]})).sort((i,t)=>i.name.localeCompare(t.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(e){!e||!this.hass||this._conditionAttrOptions[e]||this._conditionAttrPending.has(e)||(this._conditionAttrPending.add(e),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e}).then(i=>{let t=i;this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:t.suggested_attributes||[],available:t.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(e){if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});this._entityDomain=i.domain||"",this._suggestedAttributes=i.suggested_attributes||[],this._availableAttributes=i.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(e=>!!e.entry_id)}_renderConsumesRow(e,i){let t=H({part_id:e.id,entry_id:i}),r=this._consumesParts[t],n=i?{part_id:e.id,quantity:1,entry_id:i}:{part_id:e.id,quantity:1};return l`
      <div class="consumes-row">
        <label class="consumes-check">
          <input
            type="checkbox"
            .checked=${r!==void 0}
            @change=${c=>{let p={...this._consumesParts};if(c.target.checked)p[t]=p[t]||n;else{delete p[t];let u={...this._consumesQtyText};delete u[t],this._consumesQtyText=u}this._consumesParts=p}}
          />
          <span>${e.name}${e.unit?` (${e.unit})`:""}</span>
        </label>
        ${r!==void 0?l`<input
              class="consumes-qty"
              type="number"
              min=${x[0]}
              max=${x[1]}
              step="0.01"
              .value=${this._consumesQtyText[t]??String(r.quantity)}
              @input=${c=>{let p=c.target.value;this._consumesQtyText={...this._consumesQtyText,[t]:p};let u=parseFloat(p.replace(",","."));Number.isFinite(u)&&u>=x[0]&&(this._consumesParts={...this._consumesParts,[t]:{...n,quantity:u}})}}
            />`:_}
      </div>
    `}_applyConsumesQtyText(){let e={...this._consumesParts};for(let i of Object.keys(e)){let t=this._consumesQtyText[i];if(t===void 0)continue;let r=parseFloat(t.replace(",","."));if(!Number.isFinite(r)||r<x[0]||r>x[1]){let n=c=>N(c,this._lang,{maximumFractionDigits:2});return this._error=s("settings_value_out_of_range",this._lang).replace("{min}",n(x[0])).replace("{max}",n(x[1])),!1}e[i]={...e[i],quantity:r}}return this._consumesParts=e,!0}_toggleRequired(e,i){let t=new Set(this._requiredCompletion);i?t.add(e):t.delete(e),this._requiredCompletion=[...t]}_patchReading(e,i){this._readings=this._readings.map(t=>t.id===e?{...t,...i}:t)}_renderReadingsEditor(e){let i=J(this._readings);return l`
      <div class="readings-editor">
        <div class="field-label">${s("readings_section",e)}</div>
        <div class="field-help">${s("readings_hint",e)}</div>
        ${this._readings.map(t=>l`
          ${i.has(t.id)?l`<div class="field-help reading-dup">${s("reading_duplicate_name",e)}</div>`:_}
          <div class="reading-row">
            <ms-textfield
              class="reading-name"
              label="${s("reading_name_label",e)}"
              .value=${t.name}
              @input=${r=>this._patchReading(t.id,{name:r.target.value})}
            ></ms-textfield>
            <ms-textfield
              class="reading-unit"
              label="${s("reading_unit_short",e)}"
              .value=${t.unit||""}
              @input=${r=>this._patchReading(t.id,{unit:r.target.value})}
            ></ms-textfield>
            <ha-icon-button class="phase-remove reading-remove" @click=${()=>this._readings=this._readings.filter(r=>r.id!==t.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
        `)}
        ${this._readings.length<K?l`
          <ha-button appearance="plain" class="reading-add"
            @click=${()=>this._readings=[...this._readings,{id:Y(),name:"",unit:this._readings.length?this._readings[this._readings.length-1].unit:this._readingUnit}]}>
            <ha-icon icon="mdi:plus"></ha-icon> ${s("reading_add",e)}
          </ha-button>`:_}
      </div>
    `}_phaseSlug(e){let i=e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",t=i,r=2;for(;this._phaseDefs.some(n=>n.id===t);)t=`${i}-${r++}`;return t}_addPhaseDef(){let e=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:e,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(e){this._phaseDefs=this._phaseDefs.filter(i=>i.id!==e),this._phaseSeq=this._phaseSeq.filter(i=>i!==e)}_patchPhaseDef(e,i){this._phaseDefs=this._phaseDefs.map(t=>t.id===e?{...t,...i}:t)}_renderPhasesEditor(e){let i=t=>this._phaseDefs.find(r=>r.id===t)?.name||t;return l`
      <h3>${s("phases_section",e)}</h3>
      <div class="field-help">${s("phases_hint",e)}</div>
      ${this._phaseDefs.map(t=>l`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${s("phase_name",e)}"
              .value=${t.name}
              @input=${r=>this._patchPhaseDef(t.id,{name:r.target.value})}
            ></ms-textfield>
            ${this.parts.length?l`
              <select
                class="phase-part"
                .value=${t.partId}
                @change=${r=>{let n=r.target.value;this._patchPhaseDef(t.id,t.partQty?{partId:n}:{partId:n,partQty:"1"})}}
              >
                <option value="">—</option>
                ${this.parts.map(r=>l`<option value=${r.id} ?selected=${r.id===t.partId}>${r.name}</option>`)}
              </select>
              ${t.partId?l`
                <!-- The typed text as-is: a "|| '1'" here rewrote a cleared
                     field to 1 and the next digit gave "13" (bug audit
                     2026-09-26 #2); an empty field saves as 1. -->
                <input class="phase-qty" type="number" min=${M[0]} step="0.01" placeholder="1" .value=${t.partQty}
                  @input=${r=>this._patchPhaseDef(t.id,{partQty:r.target.value})} />
              `:_}
            `:_}
            <ha-icon-button class="phase-remove" @click=${()=>this._removePhaseDef(t.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
          ${this.checklistsEnabled?l`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${s("checklist_placeholder",e)}"
              .value=${t.checklistText}
              @input=${r=>this._patchPhaseDef(t.id,{checklistText:r.target.value})}
            ></textarea>
          `:_}
          <label class="req-option phase-req-toggle">
            <input
              type="checkbox"
              .checked=${t.reqOverride}
              @change=${r=>this._patchPhaseDef(t.id,{reqOverride:r.target.checked})}
            />
            <span>${s("phase_require_override",e)}</span>
          </label>
          ${t.reqOverride?l`
            <div class="required-completion phase-req-fields">
              ${U.map(r=>l`
                <label class="req-option">
                  <input
                    type="checkbox"
                    .checked=${t.reqFields.includes(r)}
                    @change=${n=>{let c=n.target.checked,p=new Set(t.reqFields);c?p.add(r):p.delete(r),this._patchPhaseDef(t.id,{reqFields:[...p]})}}
                  />
                  <span>${s(B[r],e)}</span>
                </label>
              `)}
            </div>
          `:_}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${s("phase_add",e)}
      </ha-button>
      ${this._phaseDefs.some(t=>t.name.trim())?l`
        <div class="phase-seq-label">${s("phase_sequence_label",e)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((t,r)=>l`
            <span class="phase-chip">
              ${r+1}. ${i(t)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((n,c)=>c!==r)}}>✕</button>
            </span>
          `)}
          <select
            class="phase-seq-add"
            .value=${""}
            @change=${t=>{let r=t.target.value;r&&(this._phaseSeq=[...this._phaseSeq,r]),t.target.value=""}}
          >
            <option value="">+ ${s("phase_sequence_add_step",e)}</option>
            ${this._phaseDefs.filter(t=>t.name.trim()).map(t=>l`<option value=${t.id}>${t.name}</option>`)}
          </select>
        </div>
      `:_}
    `}async _save(){if(!this._loading&&this._name.trim()){if(this._adaptiveSnapshot()!==this._adaptiveInitial){let e=parseInt(this._adaptiveMin,10),i=parseInt(this._adaptiveMax,10);if(!isNaN(e)&&!isNaN(i)&&e>i){this._error=`${s("adaptive_min_interval",this._lang)} > ${s("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=s("trigger_hint_overlap",this._lang);return}if(this._scheduleType==="calendar"&&!this._calendarEntity.trim().startsWith("calendar.")){this._error=s("calendar_entity_required",this._lang);return}if(this._applyConsumesQtyText()){this._loading=!0,this._error="";try{let e=await k(this,()=>this.hass.connection.sendMessagePromise(this._savePayload()),{fallbackKey:"save_error",onError:n=>{this._error=n}});if(e===void 0)return;let i=this._taskId||e?.task_id,t=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;this._warning="";let r=n=>{this._warning=s("subsave_warning",this._lang).replace("{detail}",n)};if(i&&this._scheduleType==="sensor_based"&&t&&await k(this,{type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:i,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null},{onError:r})!==void 0&&(this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute),i&&this._adaptiveSnapshot()!==this._adaptiveInitial){let n=parseFloat(this._adaptiveAlpha),c=parseInt(this._adaptiveMin,10),p=parseInt(this._adaptiveMax,10);await k(this,{type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:i,enabled:this._adaptiveEnabled,...n>=I[0]&&n<=I[1]?{ewa_alpha:n}:{},...!isNaN(c)&&c>=1?{min_interval_days:c}:{},...!isNaN(p)&&p>=1?{max_interval_days:p}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction},{onError:r})!==void 0&&(this._adaptiveInitial=this._adaptiveSnapshot())}this._warning?i&&(this._taskId=i):this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}finally{this._loading=!1}}}}_savePayload(){let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},i=this._earliestCompletionDays.trim();e.earliest_completion_days=i===""?null:Math.max(0,parseInt(i,10)||0),this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):A.includes(this._scheduleType)?(e.schedule={...this._buildSchedule(),...this._recurrenceExtras()},e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(e.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.notify_icon=this._notifyIcon.trim()||null,e.priority=this._priority,e.labels=this._labels.split(",").map(t=>t.trim()).filter(Boolean),e.mirror_todo_entities=this._mirrorTodoEntities.filter(Boolean),e.enabled=this._enabled,(!this._taskId||this._lastPerformed!==this._loadedLastPerformed)&&(e.last_performed=this._lastPerformed||null),e.nfc_tag_id=this._nfcTagId||null,e.require_tag_scan=this._requireTagScan,e.allow_skip=this._allowSkip,e.notify_enabled=this._notifyEnabled,e.reading_unit=this._readingUnit.trim()||null,e.readings=X(this._readings);{let t={};for(let n of this._phaseDefs){if(!n.name.trim())continue;let c={...n.carry,name:n.name.trim()},p=n.checklistText.split(`
`).map(m=>m.trim()).filter(Boolean);p.length&&(c.checklist=p);let u=[];if(n.partId){let m=parseFloat(n.partQty);u.push({part_id:n.partId,quantity:Number.isFinite(m)&&m>0?m:1})}for(let m of n.extraParts)u.push(m.entry_id?{part_id:m.part_id,quantity:m.quantity,entry_id:m.entry_id}:{part_id:m.part_id,quantity:m.quantity});u.length&&(c.consumes_parts=u),n.reqOverride&&(c.required_completion_fields=[...n.reqFields]),t[n.id]=c}let r=this._phaseSeq.filter(n=>n in t);e.phases=Object.keys(t).length&&r.length?t:null,e.phase_sequence=e.phases?r:null}if((this.parts.length||this._foreignOwners.length)&&(e.consumes_parts=Object.values(this._consumesParts).map(t=>t.entry_id?{part_id:t.part_id,quantity:t.quantity,entry_id:t.entry_id}:{part_id:t.part_id,quantity:t.quantity})),(!this._taskId||this._responsibleUserId!==this._loadedResponsibleUserId)&&(e.responsible_user_id=this._responsibleUserId),e.assignee_pool=this._assigneePool,e.required_completion_fields=this._requiredCompletion,e.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let t=this._compoundConditions.map(Ee).filter(r=>r!==null);if(t.length>0){let r={type:"compound",compound_logic:this._compoundLogic,conditions:t};this._autoCompleteOnRecovery&&(r.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(r.trigger_combinator="all"),e.trigger_config=r}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let t=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],r={entity_id:t[0],entity_ids:t,type:this._triggerType};if(_e(r,this._typeFields()),this._autoCompleteOnRecovery&&(r.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(r.trigger_combinator="all"),t.length>1&&(r.entity_logic=this._triggerEntityLogic),this._triggerType==="counter"&&this._triggerDeltaMode&&this._triggerBaselineValue){let n=parseFloat(this._triggerBaselineValue);!isNaN(n)&&n>=0&&(r.trigger_baseline_value=n)}else if(this._triggerType==="runtime"&&this._triggerRuntimeMaxSession){let n=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(n)&&n>0&&(r.trigger_runtime_max_session_seconds=n)}e.trigger_config=r}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&ae.includes(this._scheduleType)){let t=this._scheduleTimeOn?this._scheduleTime.trim():"";e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(t)?t:null}if(this.checklistsEnabled){let t=this._checklistText.split(`
`).map(r=>r.trim()).filter(Boolean).slice(0,100);e.checklist=t.length?t:null}if(this.completionActionsEnabled||this._actionPresent){let t=this._actionService.trim();if(t&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(t)){let r={service:t},n=this._actionTargetEntity.trim();this._actionTargetStored&&n===this._actionTargetInitial?r.target=JSON.parse(JSON.stringify(this._actionTargetStored)):n&&(r.target={entity_id:n});let c=this._buildActionData();Object.keys(c).length>0&&(r.data=c),this._actionSkipAuto&&(r.skip_auto=!0),e.on_complete_action=r}else e.on_complete_action=null}if(this.completionActionsEnabled){let t={};this._qcNotes.trim()&&(t.notes=this._qcNotes.trim());let r=parseFloat(this._qcCost);isNaN(r)||(t.cost=r);let n=ie(this._qcDuration);n!==null&&(t.duration=n),this._qcFeedback&&(t.feedback=this._qcFeedback),e.quick_complete_defaults=Object.keys(t).length?t:null}return e}_close(){this._open=!1,this._warning="",this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return _;let e=this._lang,i=this._triggerType==="compound";return l`
      <h3>${s("trigger_configuration",e)}</h3>
      <div class="select-row">
        <label>${s("trigger_type",e)}</label>
        <select
          .value=${this._triggerType}
          @change=${t=>this._triggerType=t.target.value}
        >
          ${ye.map(t=>l`<option value=${t} ?selected=${t===this._triggerType}>${oe(t,e)}</option>`)}
        </select>
      </div>
      ${i?this._renderCompoundEditor():l`
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${s("entity_id",e)} (${s("comma_separated",e)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${t=>{let n=t.target.value.split(",").map(c=>c.trim()).filter(Boolean);this._triggerEntityId=n[0]||"",this._triggerEntityIds=n,n[0]&&this._fetchEntityAttributes(n[0])}}
          ></ms-textfield>
        `:l`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:D}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>s("entity_id",e)}
          @value-changed=${t=>{let r=(t.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=r[0]||"",this._triggerEntityIds=r,r[0]?this._fetchEntityAttributes(r[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?l`
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
        `:_}
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
      ${this._intervalDays?this._renderUnitSelect():_}
      ${this._intervalDays?l`
            <div class="select-row">
              <label>${s("trigger_combinator",e)}</label>
              <select
                @change=${t=>this._triggerCombinator=t.target.value}
              >
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${s("trigger_combinator_any",e)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${s("trigger_combinator_all",e)}</option>
              </select>
            </div>
          `:_}
    `}_patchCondition(e,i){this._compoundConditions=this._compoundConditions.map((t,r)=>r===e?{...t,...i}:t)}_addCondition(){this._compoundConditions=[...this._compoundConditions,le()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((i,t)=>t!==e)}_renderCompoundEditor(){let e=this._lang;return l`
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
      ${this._compoundConditions.length===0?l`<div class="field-help">${s("compound_no_conditions",e)}</div>`:this._compoundConditions.map((i,t)=>this._renderCondition(i,t))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${s("compound_add_condition",e)}
      </button>
    `}_renderCondition(e,i){let t=this._lang,r=i+1;return l`
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
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${s("entity_id",t)} (${s("comma_separated",t)})"
            .value=${e.entityIds}
            @input=${n=>this._patchCondition(i,{entityIds:n.target.value})}
          ></ms-textfield>
        `:l`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:D}}}]}
          .data=${{condition_entities:e.entityIds.split(",").map(n=>n.trim()).filter(Boolean)}}
          .computeLabel=${()=>s("entity_id",t)}
          @value-changed=${n=>{let c=(n.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(i,{entityIds:c.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(e,i)}
        <div class="select-row">
          <label>${s("trigger_type",t)}</label>
          <select
            .value=${e.type}
            @change=${n=>this._patchCondition(i,{type:n.target.value})}
          >
            ${de.map(n=>l`<option value=${n} ?selected=${n===e.type}>${oe(n,t)}</option>`)}
          </select>
        </div>
        ${this._renderConditionTypeFields(e,i)}
      </div>
    `}_renderStateField(e){return this._entityPickerFallback||!e.entityId?l`
        <ms-textfield
          label=${e.label}
          .value=${e.value}
          @input=${i=>e.onInput(i.target.value)}
        ></ms-textfield>
      `:l`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId}}}]}
        .data=${{s:e.value}}
        .computeLabel=${()=>e.label}
        @value-changed=${i=>e.onInput((i.detail.value.s||"").trim())}
      ></ha-form>
    `}_renderOnStatesField(e){let i=this._lang;return this._entityPickerFallback||!e.entityId?l`
        <ms-textfield
          label="${s("runtime_on_states",i)}"
          placeholder="on"
          .value=${e.value}
          @input=${t=>e.onInput(t.target.value)}
        ></ms-textfield>
      `:l`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId,multiple:!0}}}]}
        .data=${{s:(e.value||"").split(",").map(t=>t.trim()).filter(Boolean)}}
        .computeLabel=${()=>s("runtime_on_states",i)}
        @value-changed=${t=>e.onInput((t.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(e){return this._scheduleType==="one_time"||this._scheduleType==="manual"?_:!this.adaptiveFeature&&!this._adaptiveWasEnabled?_:l`
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
        ${this._adaptiveEnabled?l`
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
            min=${I[0]}
            max=${I[1]}
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
            ${s("adaptive_seasonal_enabled",e)}
          </label>`:_}
          <label>
            <input
              type="checkbox"
              .checked=${this._adaptivePrediction}
              @change=${i=>this._adaptivePrediction=i.target.checked}
            />
            ${s("adaptive_prediction_enabled",e)}
          </label>
        `:_}
      </details>
    `}_renderAttributeSelect(e){let i=this._lang;return e.available.length>0?l`
        <div class="select-row">
          <label>${e.label}</label>
          <select
            .value=${e.value}
            @change=${t=>e.onSelect(t.target.value)}
          >
            <option value="" ?selected=${!e.value}>${s("use_entity_state",i)}</option>
            ${e.suggested.map(t=>l`<option value=${t} ?selected=${t===e.value}>${t} ★</option>`)}
            ${e.available.filter(t=>!e.suggested.includes(t.name)).map(t=>l`<option value=${t.name} ?selected=${t.name===e.value}>${t.name}${t.numeric?"":" (non-numeric)"}</option>`)}
          </select>
        </div>
      `:l`
      <ms-textfield
        label="${e.label}"
        .value=${e.value}
        @input=${t=>e.onSelect(t.target.value.trim())}
      ></ms-textfield>
    `}_renderEnvironmentalAttribute(e){this._fetchConditionAttributes(this._environmentalEntity);let i=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:s("environmental_attribute_optional",e),value:this._environmentalAttribute,suggested:i?.suggested??[],available:i?.available??[],onSelect:t=>this._environmentalAttribute=t})}_renderConditionAttribute(e,i){let t=e.entityIds.split(",")[0]?.trim()||"";t&&this._fetchConditionAttributes(t);let r=t?this._conditionAttrOptions[t]:void 0;return this._renderAttributeSelect({label:s("attribute_optional",this._lang),value:e.attribute,suggested:r?.suggested??[],available:r?.available??[],onSelect:n=>this._patchCondition(i,{attribute:n})})}_renderConditionTypeFields(e,i){let t=this._lang;if(e.type==="threshold")return l`
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
      `;if(e.type==="counter")return l`
        <ms-textfield label="${s("target_value",t)}" type="number" .value=${e.targetValue}
          @input=${r=>this._patchCondition(i,{targetValue:r.target.value})}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${e.deltaMode}
            @change=${r=>this._patchCondition(i,{deltaMode:r.target.checked})} />
          ${s("delta_mode",t)}
        </label>
      `;if(e.type==="state_change"){let r=e.entityIds.split(",")[0]?.trim()||"";return l`
        ${this._renderStateField({label:s("from_state_optional",t),value:e.fromState,entityId:r,onInput:n=>this._patchCondition(i,{fromState:n})})}
        ${this._renderStateField({label:s("to_state_optional",t),value:e.toState,entityId:r,onInput:n=>this._patchCondition(i,{toState:n})})}
        <ms-textfield label="${s("target_changes",t)}" type="number" .value=${e.targetChanges}
          @input=${n=>this._patchCondition(i,{targetChanges:n.target.value})}></ms-textfield>
        <ms-textfield label="${s("for_minutes",t)}" type="number" .value=${e.forMinutes}
          @input=${n=>this._patchCondition(i,{forMinutes:n.target.value})}></ms-textfield>
      `}if(e.type==="runtime"){let r=e.entityIds.split(",")[0]?.trim()||"";return l`
        <ms-textfield label="${s("runtime_hours",t)}" type="number" .value=${e.runtimeHours}
          @input=${n=>this._patchCondition(i,{runtimeHours:n.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:e.onStates,entityId:r,onInput:n=>this._patchCondition(i,{onStates:n})})}
      `}return e.type==="due_date"?l`
        <ms-textfield label="${s("days_before",t)}" type="number" step="1"
          min=${T[0]} max=${T[1]} .value=${e.daysBefore}
          @input=${r=>this._patchCondition(i,{daysBefore:r.target.value})}></ms-textfield>
      `:_}_renderUnitSelect(){let e=this._lang;return l`
      <div class="select-row">
        <label>${s("interval_unit",e)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${i=>this._intervalUnit=i.target.value}
        >
          ${["days","weeks","months","years"].map(i=>l`<option value=${i} ?selected=${i===this._intervalUnit}>${s("unit_"+i,e)}</option>`)}
        </select>
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(i=>i!==e):[...this._weekdays,e]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(this._scheduleType==="calendar"&&!this._calendarEntity.trim())return null;if(A.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let e=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!e||e<=0?null:{kind:"interval",every:e,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(e){super.updated?.(e),this._scheduleEntityPickerProbe();for(let i of e.keys())if(a._PREVIEW_RELEVANT.has(String(i))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let e=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),i=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!e||!i){this._pickerProbeStrikes=0;return}let t=(p,u,m=0)=>{if(!(!p||m>10)){(p.tagName?.toLowerCase()??"")==="ha-entity-picker"&&u.push(p);for(let y of[p.shadowRoot,p])if(y)for(let f of Array.from(y.children??[]))t(f,u,m+1)}},r=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],n=[];for(let p of r)t(p,n);let c=n.length===0||n.some(p=>p.offsetHeight===0);if(e.offsetHeight===0||c){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let e=this._open?this._previewScheduleDict():null;if(!e){this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let i=++this._previewSeq;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:e,...this._lastPerformed?{last_performed:this._lastPerformed}:{}});if(i!==this._previewSeq)return;this._schedulePreview=t.occurrences||[],this._schedulePreviewEnded=!!t.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return _;let e=this._lang,i=this.scheduleTimeEnabled&&this._scheduleTimeOn&&this._scheduleTime?` ${this._scheduleTime}`:"",t=this._schedulePreview.map((n,c)=>{let p=new Date(`${n}T12:00:00`).getDay();return`${F(p===0?6:p-1,e,"short")} ${R(n,e)}${c===0?i:""}`}).join(" \xB7 "),r=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?l`<div class="field-help">${s("schedule_preview_ontime",e)}</div>`:_;return l`
      <div class="trigger-live-hint schedule-preview">
        ${s("schedule_preview_title",e)}: ${t}${this._schedulePreviewEnded?l` <span class="field-help">${s("schedule_preview_ends",e)}</span>`:_}
        ${r}
      </div>
    `}_buildSchedule(){let e=t=>{let r=parseInt(this._calOffset,10)||0;return r&&(t.offset=Math.max(-w,Math.min(r,w))),t};if(this._scheduleType==="weekdays")return e({kind:"weekdays",weekdays:[...this._weekdays].sort((t,r)=>t-r)});if(this._scheduleType==="nth_weekday")return e({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});if(this._scheduleType==="calendar")return e({kind:"calendar",entity_id:this._calendarEntity.trim()});let i={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(i.business=!0),e(i)}_recurrenceExtras(){let e={};if(this._seasonMonths.length&&(e.season_months=[...this._seasonMonths].sort((i,t)=>i-t)),this._endsMode==="count"){let i=parseInt(this._endsCount,10);i>=1&&(e.ends={count:i})}else this._endsMode==="until"&&this._endsUntil&&(e.ends={until:this._endsUntil});return e}_toggleSeasonMonth(e){this._seasonMonths=this._seasonMonths.includes(e)?this._seasonMonths.filter(i=>i!==e):[...this._seasonMonths,e]}_renderRecurrenceExtras(){let e=this._lang;if(!(this._scheduleType==="time_based"||A.includes(this._scheduleType)))return _;let t=Te(e);return l`
      <label class="field-label">${s("season_window_label",e)}</label>
      <div class="field-help">${s("season_window_hint",e)}</div>
      <div class="weekday-chips season-chips">
        ${t.map((r,n)=>l`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(n+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(n+1)}
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
      ${this._endsMode==="count"?l`
        <ms-textfield
          label="${s("series_end_count_label",e)}"
          type="number" min="1"
          .value=${this._endsCount}
          @input=${r=>this._endsCount=r.target.value}
        ></ms-textfield>`:_}
      ${this._endsMode==="until"?l`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${e}
          label="${s("series_end_until_label",e)}"
          .value=${this._endsUntil}
          @value-changed=${r=>this._endsUntil=r.detail.value}
        ></ms-date-field>`:_}
    `}_renderCalendarFields(){let e=this._lang,i=xe(e);if(this._scheduleType==="weekdays")return l`
        <label class="field-label">${s("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${i.map((t,r)=>l`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(r)?"selected":""}"
              @click=${()=>this._toggleWeekday(r)}
            >${t}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let t=[["1",s("ord_1",e)],["2",s("ord_2",e)],["3",s("ord_3",e)],["4",s("ord_4",e)],["5",s("ord_5",e)],["-1",s("ord_last",e)]];return l`
        <div class="select-row">
          <label>${s("recurrence_occurrence",e)}</label>
          <select .value=${this._nth} @change=${r=>this._nth=r.target.value}>
            ${t.map(([r,n])=>l`<option value=${r} ?selected=${r===this._nth}>${n}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${s("recurrence_weekday",e)}</label>
          <select .value=${this._nthWeekday} @change=${r=>this._nthWeekday=r.target.value}>
            ${i.map((r,n)=>l`<option value=${String(n)} ?selected=${String(n)===this._nthWeekday}>${r}</option>`)}
          </select>
        </div>
        ${this._renderCalOffsetField()}`}return this._scheduleType==="calendar"?l`
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${s("calendar_entity_label",e)}"
            helper="${s("calendar_entity_hint",e)}"
            .value=${this._calendarEntity}
            @input=${t=>this._calendarEntity=t.target.value.trim()}
          ></ms-textfield>
        `:l`
          <ha-form
            class="entity-picker-form calendar-entity-form"
            .hass=${this.hass}
            .schema=${[{name:"calendar_entity",selector:{entity:{domain:"calendar"}}}]}
            .data=${{calendar_entity:this._calendarEntity}}
            .computeLabel=${()=>s("calendar_entity_label",e)}
            .computeHelper=${()=>s("calendar_entity_hint",e)}
            @value-changed=${t=>{this._calendarEntity=(t.detail.value.calendar_entity||"").trim()}}
          ></ha-form>`}
        ${this._renderCalOffsetField()}`:this._scheduleType==="day_of_month"?l`
        ${this._domLastDay?_:l`
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
        ${this._renderCalOffsetField()}`:_}_renderCalOffsetField(){let e=this._lang;return l`
      <ms-textfield
        label="${s("recurrence_offset",e)}"
        helper="${s("recurrence_offset_help",e)}"
        type="number"
        min=${-w}
        max=${w}
        .value=${this._calOffset}
        @input=${i=>this._calOffset=i.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let e=parseFloat(this._triggerAbove),i=parseFloat(this._triggerBelow);return!isNaN(e)&&!isNaN(i)&&i>e}_renderTriggerLiveHint(){if(this._triggerType==="compound")return _;let e=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?l`<div class="trigger-live-hint warn">${s("trigger_hint_overlap",this._lang)}</div>`:_,i=this._triggerEntityId||this._triggerEntityIds[0];if(!i||!this.hass?.states)return e;let t=this.hass.states[i];if(!t)return e;let r=this._lang,n=t.attributes?.unit_of_measurement,c=typeof n=="string"&&n?` ${n}`:"",p=this._triggerAttribute?t.attributes?.[this._triggerAttribute]:t.state,u=typeof p=="number"?p:parseFloat(String(p)),m=p!=="unknown"&&p!=="unavailable"&&p!=null&&!isNaN(u),y=v=>N(v,r,{maximumFractionDigits:1}),f=[];if(this._triggerType==="threshold"){let v=parseFloat(this._triggerAbove),b=parseFloat(this._triggerBelow);if(isNaN(v)&&isNaN(b))return _;m&&f.push(s("trigger_hint_now",r).replace("{value}",y(u)+c)),isNaN(v)||f.push(s("trigger_hint_above",r).replace("{target}",y(v)+c)),isNaN(b)||f.push(s("trigger_hint_below",r).replace("{target}",y(b)+c))}else if(this._triggerType==="counter"){let v=parseFloat(this._triggerTargetValue);if(isNaN(v))return _;this._triggerDeltaMode?this._taskId?f.push(s("trigger_hint_counter_delta_edit",r).replace("{target}",y(v)+c)):m?f.push(s("trigger_hint_counter_delta",r).replace("{value}",y(u)+c).replace("{due}",y(u+v)+c).replace("{target}",y(v)+c)):f.push(s("trigger_hint_counter_delta_edit",r).replace("{target}",y(v)+c)):(m&&f.push(s("trigger_hint_now",r).replace("{value}",y(u)+c)),f.push(s("trigger_hint_counter_abs",r).replace("{target}",y(v)+c)))}else if(this._triggerType==="runtime"){let v=parseFloat(this._triggerRuntimeHours);if(isNaN(v))return _;f.push(s("trigger_hint_runtime",r).replace("{hours}",y(v))),f.push(s("trigger_hint_state_now",r).replace("{value}",String(t.state)))}else if(this._triggerType==="state_change"){let v=parseInt(this._triggerTargetChanges,10)||1,b=this._triggerToState.trim();f.push((b?s("trigger_hint_state_change_to",r).replace("{state}",b):s("trigger_hint_state_change",r)).replace("{count}",String(v))),f.push(s("trigger_hint_state_now",r).replace("{value}",String(t.state)))}else if(this._triggerType==="due_date"){let v=parseInt(this._triggerDaysBefore,10)||0;f.push(v===0?s("trigger_hint_due_date_same_day",r):v===1?s("trigger_hint_due_date_one",r):s("trigger_hint_due_date",r).replace("{days}",String(v)));let b=p==null?"":String(p);b&&!isNaN(Date.parse(b))&&f.push(s("trigger_hint_due_date_now",r).replace("{date}",R(b,r)))}return f.length?l`<div class="trigger-live-hint">${f.join(" ")}</div>${e}`:e}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?l`
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
      `:this._triggerType==="counter"?l`
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
        ${this._triggerDeltaMode?l`
              <ms-textfield
                label="${s("baseline_start_value",e)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${i=>this._triggerBaselineValue=i.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?s("baseline_start_help_edit",e):s("baseline_start_help",e)}
                ${this._taskId&&this._liveBaselineValue!=null?l`<div class="baseline-effective">
                      ${s("baseline_current_effective",e).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:_}
              </div>
            `:_}
      `:this._triggerType==="state_change"?l`
        ${this._renderStateField({label:s("from_state_optional",e),value:this._triggerFromState,entityId:this._triggerEntityId,onInput:i=>this._triggerFromState=i})}
        <div class="field-help">${s("state_value_help",e)}</div>
        ${this._renderStateField({label:s("to_state_optional",e),value:this._triggerToState,entityId:this._triggerEntityId,onInput:i=>this._triggerToState=i})}
        <ms-textfield
          label="${s("target_changes",e)}"
          type="number"
          min=${te[0]}
          .value=${this._triggerTargetChanges}
          @input=${i=>this._triggerTargetChanges=i.target.value}
        ></ms-textfield>
        <div class="field-help">${s("target_changes_help",e)}</div>
        ${(this._triggerTargetChanges||"1")==="1"&&(this._triggerFromState||this._triggerToState)?l`<div class="field-help">${s("state_latch_help",e)}</div>`:_}
        <ms-textfield
          label="${s("for_at_least_minutes",e)}"
          type="number"
          min=${ee[0]}
          .value=${this._triggerForMinutes}
          @input=${i=>this._triggerForMinutes=i.target.value}
        ></ms-textfield>
        <div class="field-help">${s("for_minutes_state_help",e)}</div>
      `:this._triggerType==="runtime"?l`
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
      `:this._triggerType==="due_date"?l`
        <ms-textfield
          label="${s("days_before",e)}"
          type="number"
          step="1"
          min=${T[0]}
          max=${T[1]}
          .value=${this._triggerDaysBefore}
          @input=${i=>this._triggerDaysBefore=i.target.value}
        ></ms-textfield>
        <div class="field-help">${s("days_before_help",e)}</div>
      `:_}render(){if(!this._open)return l``;let e=this._lang,i=this._taskId?s("edit_task",e):s("new_task",e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:_}
          ${this._warning?l`<div class="error warning">${this._warning}</div>`:_}
          ${this._taskId===null&&this._objectChoices.length>0?l`
            <div class="select-row">
              <label>${s("object",e)}</label>
              <select
                .value=${this._entryId}
                @change=${t=>{this._entryId=t.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}}
              >
                ${this._objectChoices.map(t=>l`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
              </select>
            </div>
          `:_}
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
              ${me.map(t=>l`<option value=${t} ?selected=${t===this._type}>${s(t,e)}</option>`)}
            </select>
          </div>
          ${this._type==="reading"?l`
                <ms-textfield
                  label="${s("reading_unit_label",e)}"
                  .value=${this._readingUnit}
                  @input=${t=>this._readingUnit=t.target.value}
                ></ms-textfield>
                <div class="field-help">${s("reading_unit_help",e)}</div>
                ${this._renderReadingsEditor(e)}
              `:_}
          ${this._partsLoadFailed?l`<div class="field-help parts-load-failed">${s("parts_load_failed",e)}</div>`:_}
          ${this._isFleetTask?l`<div class="field-help parts-fleet-hint">${s("task_parts_fleet_hint",e)}</div>`:this.parts.length||this._foreignOwners.length?l`
                <div class="field">
                  <label>${s("consumes_parts_label",e)}</label>
                  ${this.parts.map(t=>this._renderConsumesRow(t))}
                  ${this._foreignOwners.length?l`
                        <details class="shared-pools" ?open=${this._hasForeignPick}>
                          <summary>${s("shared_parts_other_objects",e)}</summary>
                          <div class="field-help">${s("shared_parts_help",e)}</div>
                          ${this._foreignOwners.map(t=>l`
                              <div class="shared-pool-owner">${t.name}</div>
                              ${t.parts.map(r=>this._renderConsumesRow(r,t.entry_id))}
                            `)}
                        </details>
                      `:_}
                </div>
              `:_}
          <div class="select-row">
            <label>${s("priority",e)}</label>
            <select
              .value=${this._priority}
              @change=${t=>this._priority=t.target.value}
            >
              ${ve.map(t=>l`<option value=${t} ?selected=${t===this._priority}>${s("priority_"+t,e)}</option>`)}
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
          <div class="field mirror-todo-field">
            ${this._entityPickerFallback?l`
              <ms-textfield
                label="${s("task_mirror_todo",e)}"
                placeholder="todo.family, todo.kids"
                .value=${this._mirrorTodoEntities.join(", ")}
                @input=${t=>{this._mirrorTodoEntities=t.target.value.split(",").map(r=>r.trim()).filter(Boolean)}}
              ></ms-textfield>
            `:l`
              <ha-form
                class="entity-picker-form"
                .hass=${this.hass}
                .schema=${[{name:"mirror_todo_entities",selector:{entity:{multiple:!0,domain:["todo"]}}}]}
                .data=${{mirror_todo_entities:this._mirrorTodoEntities}}
                .computeLabel=${()=>s("task_mirror_todo",e)}
                @value-changed=${t=>{let r=(t.detail.value.mirror_todo_entities||[]).filter(Boolean);this._mirrorTodoEntities=r}}
              ></ha-form>`}
            <div class="field-help">${s("task_mirror_todo_hint",e)}</div>
          </div>
          <div class="select-row">
            <label>${s("schedule_type",e)}</label>
            <select
              .value=${this._scheduleType}
              @change=${t=>this._scheduleType=t.target.value}
            >
              ${fe.map(t=>l`<option value=${t} ?selected=${t===this._scheduleType}>${s(t,e)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?l`
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
              `:_}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?l`
                <ms-date-field
                  kind="date"
                  .hass=${this.hass}
                  .lang=${e}
                  label="${s("due_date",e)}"
                  .value=${this._dueDate}
                  @value-changed=${t=>this._dueDate=t.detail.value}
                ></ms-date-field>
              `:_}
          ${this.scheduleTimeEnabled&&ae.includes(this._scheduleType)?l`
            <label class="checkbox-row schedule-time-toggle">
              <input type="checkbox" .checked=${this._scheduleTimeOn}
                @change=${t=>this._scheduleTimeOn=t.target.checked} />
              <span>${s("schedule_time_toggle",e)}</span>
            </label>
            ${this._scheduleTimeOn?l`
              <ms-date-field
                kind="time"
                .hass=${this.hass}
                .lang=${e}
                .value=${this._scheduleTime}
                helper="${s("schedule_time_help",e)}"
                @value-changed=${t=>this._scheduleTime=t.detail.value}
              ></ms-date-field>
            `:_}
          `:_}
          ${this._renderRecurrenceExtras()}
          ${this._renderSchedulePreview()}
          <ms-textfield
            label="${s("warning_days",e)}"
            type="number"
            min=${O[0]}
            max=${O[1]}
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
          ${this.checklistsEnabled?l`
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
          `:_}
          ${this._renderPhasesEditor(e)}
          <h3>${s("require_on_completion",e)}</h3>
          <div class="required-completion">
            ${U.map(t=>l`
              <label class="req-option">
                <input
                  type="checkbox"
                  .checked=${this._requiredCompletion.includes(t)}
                  @change=${r=>this._toggleRequired(t,r.target.checked)}
                />
                <span>${s(B[t],e)}</span>
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
              @change=${t=>{let r=t.target.value;this._responsibleUserId=r||null}}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${s("no_user_assigned",e)}</option>
              ${this._availableUsers.map(t=>l`<option value=${t.id} ?selected=${t.id===this._responsibleUserId}>${t.name}</option>`)}
            </select>
          </div>
          ${this._availableUsers.length>=2?l`
            <div class="field">
              <label>${s("shared_with",e)}</label>
              <div class="field-help">${s("shared_with_help",e)}</div>
              <div class="assignee-pool">
                ${this._availableUsers.map(t=>l`
                  <label class="pool-item">
                    <input type="checkbox"
                      .checked=${this._assigneePool.includes(t.id)}
                      @change=${()=>this._toggleAssignee(t.id)} />
                    <span>${t.name}</span>
                  </label>`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?l`
              <div class="select-row">
                <label>${s("rotation_strategy",e)}</label>
                <select
                  .value=${this._rotationStrategy}
                  @change=${t=>this._rotationStrategy=t.target.value}
                >
                  <option value="" ?selected=${!this._rotationStrategy}>${s("rotation_none",e)}</option>
                  ${["round_robin","least_completed","random"].map(t=>l`<option value=${t} ?selected=${t===this._rotationStrategy}>${s("rotation_"+t,e)}</option>`)}
                </select>
              </div>`:_}
          `:_}
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"&&(this.environmentalFeature||this._environmentalInitial)?l`
            ${this._entityPickerFallback?l`
              <ms-textfield
                label="${s("environmental_entity_optional",e)}"
                helper="${s("environmental_entity_helper",e)}"
                .value=${this._environmentalEntity}
                @input=${t=>this._environmentalEntity=t.target.value.trim()}
              ></ms-textfield>
            `:l`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:se,device_class:re}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>s("environmental_entity_optional",e)}
              .computeHelper=${()=>s("environmental_entity_helper",e)}
              @value-changed=${t=>{this._environmentalEntity=(t.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(e):_}
          `:_}
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
          <ha-icon-picker
            class="notify-icon-picker"
            .hass=${this.hass}
            label="${s("notify_icon",e)}"
            .value=${this._notifyIcon}
            @value-changed=${t=>this._notifyIcon=t.detail.value||""}
          ></ha-icon-picker>
          <div class="field-help notify-icon-help">
            <ha-icon icon=${this._notifyIcon.trim()||j(this._type)}></ha-icon>
            ${s("notify_icon_hint",e).replace("{default}",j(this._type))}
          </div>
          ${this._availableTags.length>0?l`
              <div class="select-row">
                <label>${s("nfc_tag_id_optional",e)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${t=>this._nfcTagId=t.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${s("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(t=>l`<option value=${t.id} ?selected=${t.id===this._nfcTagId}>${t.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${s("nfc_tags_refresh",e)}">↻</button>
              </div>
            `:l`
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
          ${this._requireTagScan?l`<div class="field-help">${s("require_tag_scan_help",e)}</div>`:_}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._allowSkip}
              @change=${t=>this._allowSkip=!t.target.checked}
            />
            <span>${s("disallow_skip",e)}</span>
          </label>
          ${this._allowSkip?_:l`<div class="field-help">${s("disallow_skip_help",e)}</div>`}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._notifyEnabled}
              @change=${t=>this._notifyEnabled=!t.target.checked}
            />
            <span>${s("no_notifications",e)}</span>
          </label>
          ${this._notifyEnabled?_:l`<div class="field-help">${s("no_notifications_help",e)}</div>`}
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
    `}};a._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_calendarEntity","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),a.styles=V`
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
      display: inline-flex;
      --ha-icon-button-size: 36px;
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
    .qc-cost { display: flex; flex-direction: column; gap: 4px; margin: 8px 0; }
    .qc-cost-label { font-size: 12px; color: var(--secondary-text-color); }
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
  `,o([$({attribute:!1})],a.prototype,"hass",2),o([$({type:Boolean,attribute:"checklists-enabled"})],a.prototype,"checklistsEnabled",2),o([$({type:Boolean,attribute:"schedule-time-enabled"})],a.prototype,"scheduleTimeEnabled",2),o([$({type:Boolean,attribute:"completion-actions-enabled"})],a.prototype,"completionActionsEnabled",2),o([$({type:Boolean,attribute:"adaptive-feature"})],a.prototype,"adaptiveFeature",2),o([$({type:Boolean,attribute:"seasonal-feature"})],a.prototype,"seasonalFeature",2),o([$({type:Boolean,attribute:"environmental-feature"})],a.prototype,"environmentalFeature",2),o([$({type:Number,attribute:"default-warning-days"})],a.prototype,"defaultWarningDays",2),o([d()],a.prototype,"parts",2),o([d()],a.prototype,"_foreignOwners",2),o([d()],a.prototype,"_open",2),o([d()],a.prototype,"_entityPickerFallback",2),o([d()],a.prototype,"_loading",2),o([d()],a.prototype,"_error",2),o([d()],a.prototype,"_warning",2),o([d()],a.prototype,"_entryId",2),o([d()],a.prototype,"_taskId",2),o([d()],a.prototype,"_isFleetTask",2),o([d()],a.prototype,"_objectChoices",2),o([d()],a.prototype,"_name",2),o([d()],a.prototype,"_type",2),o([d()],a.prototype,"_scheduleType",2),o([d()],a.prototype,"_intervalDays",2),o([d()],a.prototype,"_intervalUnit",2),o([d()],a.prototype,"_dueDate",2),o([d()],a.prototype,"_warningDays",2),o([d()],a.prototype,"_earliestCompletionDays",2),o([d()],a.prototype,"_intervalAnchor",2),o([d()],a.prototype,"_weekdays",2),o([d()],a.prototype,"_nth",2),o([d()],a.prototype,"_nthWeekday",2),o([d()],a.prototype,"_domDay",2),o([d()],a.prototype,"_domLastDay",2),o([d()],a.prototype,"_domBusiness",2),o([d()],a.prototype,"_calOffset",2),o([d()],a.prototype,"_calendarEntity",2),o([d()],a.prototype,"_seasonMonths",2),o([d()],a.prototype,"_endsMode",2),o([d()],a.prototype,"_endsCount",2),o([d()],a.prototype,"_endsUntil",2),o([d()],a.prototype,"_schedulePreview",2),o([d()],a.prototype,"_schedulePreviewEnded",2),o([d()],a.prototype,"_notes",2),o([d()],a.prototype,"_documentationUrl",2),o([d()],a.prototype,"_customIcon",2),o([d()],a.prototype,"_notifyIcon",2),o([d()],a.prototype,"_priority",2),o([d()],a.prototype,"_labels",2),o([d()],a.prototype,"_mirrorTodoEntities",2),o([d()],a.prototype,"_enabled",2),o([d()],a.prototype,"_triggerEntityId",2),o([d()],a.prototype,"_triggerEntityIds",2),o([d()],a.prototype,"_triggerEntityLogic",2),o([d()],a.prototype,"_triggerAttribute",2),o([d()],a.prototype,"_triggerType",2),o([d()],a.prototype,"_triggerAbove",2),o([d()],a.prototype,"_triggerBelow",2),o([d()],a.prototype,"_triggerEquals",2),o([d()],a.prototype,"_triggerNotEquals",2),o([d()],a.prototype,"_triggerForMinutes",2),o([d()],a.prototype,"_triggerCombinator",2),o([d()],a.prototype,"_triggerTargetValue",2),o([d()],a.prototype,"_triggerDeltaMode",2),o([d()],a.prototype,"_triggerBaselineValue",2),o([d()],a.prototype,"_liveBaselineValue",2),o([d()],a.prototype,"_autoCompleteOnRecovery",2),o([d()],a.prototype,"_triggerFromState",2),o([d()],a.prototype,"_triggerToState",2),o([d()],a.prototype,"_triggerTargetChanges",2),o([d()],a.prototype,"_triggerRuntimeHours",2),o([d()],a.prototype,"_triggerDaysBefore",2),o([d()],a.prototype,"_triggerRuntimeMaxSession",2),o([d()],a.prototype,"_triggerOnStates",2),o([d()],a.prototype,"_compoundLogic",2),o([d()],a.prototype,"_compoundConditions",2),o([d()],a.prototype,"_suggestedAttributes",2),o([d()],a.prototype,"_availableAttributes",2),o([d()],a.prototype,"_entityDomain",2),o([d()],a.prototype,"_lastPerformed",2),o([d()],a.prototype,"_nfcTagId",2),o([d()],a.prototype,"_requireTagScan",2),o([d()],a.prototype,"_allowSkip",2),o([d()],a.prototype,"_notifyEnabled",2),o([d()],a.prototype,"_readingUnit",2),o([d()],a.prototype,"_readings",2),o([d()],a.prototype,"_consumesParts",2),o([d()],a.prototype,"_consumesQtyText",2),o([d()],a.prototype,"_partsLoadFailed",2),o([d()],a.prototype,"_availableTags",2),o([d()],a.prototype,"_responsibleUserId",2),o([d()],a.prototype,"_assigneePool",2),o([d()],a.prototype,"_rotationStrategy",2),o([d()],a.prototype,"_availableUsers",2),o([d()],a.prototype,"_checklistText",2),o([d()],a.prototype,"_phaseDefs",2),o([d()],a.prototype,"_phaseSeq",2),o([d()],a.prototype,"_requiredCompletion",2),o([d()],a.prototype,"_scheduleTime",2),o([d()],a.prototype,"_scheduleTimeOn",2),o([d()],a.prototype,"_actionService",2),o([d()],a.prototype,"_actionTargetEntity",2),o([d()],a.prototype,"_actionSkipAuto",2),o([d()],a.prototype,"_actionPresent",2),o([d()],a.prototype,"_actionData",2),o([d()],a.prototype,"_actionDataJsonFallback",2),o([d()],a.prototype,"_actionTesting",2),o([d()],a.prototype,"_actionTestResult",2),o([d()],a.prototype,"_actionTestError",2),o([d()],a.prototype,"_qcNotes",2),o([d()],a.prototype,"_qcCost",2),o([d()],a.prototype,"_qcDuration",2),o([d()],a.prototype,"_qcFeedback",2),o([d()],a.prototype,"_environmentalEntity",2),o([d()],a.prototype,"_environmentalAttribute",2),o([d()],a.prototype,"_adaptiveEnabled",2),o([d()],a.prototype,"_adaptiveAlpha",2),o([d()],a.prototype,"_adaptiveMin",2),o([d()],a.prototype,"_adaptiveMax",2),o([d()],a.prototype,"_adaptiveSeasonal",2),o([d()],a.prototype,"_adaptivePrediction",2),o([d()],a.prototype,"_conditionAttrOptions",2);var z=a;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",z);export{C as a,ne as b,he as c,_e as d,z as e};
