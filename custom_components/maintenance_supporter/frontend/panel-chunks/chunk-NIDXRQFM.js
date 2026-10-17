/*! maintenance_supporter frontend 2.104.0 */
import{a as oe,c as le}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-QYJOKDN4.js";import{a as M,d as Z,e as ee,j as te,k as ie,l as ae,m as D,n as B}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-EWVL4BYO.js";import{e as se}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-I7UHLCG4.js";import{d as re,e as ne,f as I,g as k,h as C,i as L,j as U}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-23N6DDJE.js";import{a as q}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-Y7WDREAR.js";import{$ as Y,N as K,O as N,T as H,_ as O,a as l,b as G,c as a,f as _,fa as J,ga as X,h as W,m as $,n as d,v as Q,w as s}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-MRDZSC4Y.js";var j=["sensor","binary_sensor","number","input_number","input_boolean","counter","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock","plant","input_select","select","input_datetime","date","datetime","timer","update"],de=["sensor"];var ye={cleaning:"mdi:broom",inspection:"mdi:magnify",replacement:"mdi:swap-horizontal",calibration:"mdi:tune",service:"mdi:wrench",reading:"mdi:counter",custom:"mdi:wrench-clock"},be="mdi:wrench-clock",z=h=>h&&ye[h]||be;function P(h){return h?Array.isArray(h.entity_ids)&&h.entity_ids.length>0?[...h.entity_ids]:h.entity_id?[h.entity_id]:[]:[]}function he(h){if(!(!h||h.type==="compound"))return P(h)[0]}function Ae(h){if(!h)return!1;let g=h.type||"threshold";return g==="counter"||g==="state_change"}function qe(h,g){return`${h}:${g?"counter":"level"}`}var $e=["cleaning","inspection","replacement","calibration","service","reading","custom"],Ee=["time_based","weekdays","nth_weekday","day_of_month","calendar","sensor_based","one_time","manual"],F=["weekdays","nth_weekday","day_of_month","calendar"],_e=["time_based","one_time",...F],ge=["threshold","counter","state_change","runtime","due_date"],ce=(h,g)=>s(h==="due_date"?"trigger_type_due_date":h,g),xe=[...ge,"compound"],E={alpha:"0.3",min:"7",max:"365"},T=U;function pe(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",daysBefore:"0",carry:{}}}var Te=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states","trigger_days_before"]);function me(h){return{type:h.type||"threshold",attribute:h.attribute||"",above:h.trigger_above?.toString()??"",below:h.trigger_below?.toString()??"",equals:h.trigger_equals?.toString()??"",notEquals:h.trigger_not_equals?.toString()??"",forMinutes:h.trigger_for_minutes?.toString()??"0",targetValue:h.trigger_target_value?.toString()??"",deltaMode:h.trigger_delta_mode||!1,fromState:h.trigger_from_state||"",toState:h.trigger_to_state||"",targetChanges:h.trigger_target_changes?.toString()??"",runtimeHours:h.trigger_runtime_hours?.toString()??"",onStates:(h.trigger_on_states||[]).join(", "),daysBefore:h.trigger_days_before?.toString()??"0"}}function ve(h,g){g.attribute&&(h.attribute=g.attribute);let e=parseInt(g.forMinutes,10);if(g.type==="threshold"){let t=parseFloat(g.above);isNaN(t)||(h.trigger_above=t);let i=parseFloat(g.below);isNaN(i)||(h.trigger_below=i);let r=parseFloat(g.equals);isNaN(r)||(h.trigger_equals=r);let n=parseFloat(g.notEquals);isNaN(n)||(h.trigger_not_equals=n),isNaN(e)||(h.trigger_for_minutes=e)}else if(g.type==="counter"){let t=parseFloat(g.targetValue);isNaN(t)||(h.trigger_target_value=t),h.trigger_delta_mode=g.deltaMode}else if(g.type==="state_change"){g.fromState&&(h.trigger_from_state=g.fromState),g.toState&&(h.trigger_to_state=g.toState);let t=parseInt(g.targetChanges,10);isNaN(t)||(h.trigger_target_changes=t),isNaN(e)||(h.trigger_for_minutes=e)}else if(g.type==="runtime"){let t=parseFloat(g.runtimeHours);isNaN(t)||(h.trigger_runtime_hours=t);let i=(g.onStates||"").split(",").map(r=>r.trim()).filter(Boolean);i.length>0&&(h.trigger_on_states=i)}else if(g.type==="due_date"){let t=parseInt(g.daysBefore,10);h.trigger_days_before=isNaN(t)?0:t}}function we(h){return{entityIds:P(h).join(", "),...me(h),carry:Object.fromEntries(Object.entries(h).filter(([e])=>!Te.has(e)&&!e.startsWith("_")))}}function Se(h){let g=h.entityIds.split(",").map(t=>t.trim()).filter(Boolean);if(g.length===0)return null;let e={...h.carry||{},entity_id:g[0],entity_ids:g,type:h.type};return ve(e,h),e}function Ie(h){return Array.from({length:7},(g,e)=>O(e,h,"short"))}function ue(h){return Array.from({length:12},(g,e)=>Y(e,h,"short"))}var o=class o extends W{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.adaptiveFeature=!1;this.seasonalFeature=!1;this.environmentalFeature=!1;this.defaultWarningDays=7;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._warning="";this._entryId="";this._taskId=null;this._isFleetTask=!1;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._calMonths=[];this._hadCalMonths=!1;this._calendarEntity="";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._notifyIcon="";this._priority="normal";this._labels="";this._mirrorTodoEntities=[];this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerDaysBefore="0";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._notifyEnabled=!0;this._readingUnit="";this._readings=[];this._consumesParts={};this._consumesQtyText={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._loadedLastPerformed="";this._loadedResponsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._scheduleTimeOn=!1;this._actionService="";this._actionTargetEntity="";this._actionTargetStored=null;this._actionTargetInitial="";this._actionSkipAuto=!1;this._actionPresent=!1;this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=E.alpha;this._adaptiveMin=E.min;this._adaptiveMax=E.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._adaptiveWasEnabled=!1;this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return Q(this.hass)}async openCreate(e,t){this._entryId=e,this._taskId=null,this._isFleetTask=!1,this._error="",this._warning="";let i=(t||[]).filter(r=>!r.object.archived&&!r.object.archived_at);!e&&i.length>0?(this._objectChoices=i.map(r=>({entry_id:r.entry_id,name:r.object.name})).sort((r,n)=>r.name.localeCompare(n.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._warning="",this._objectChoices=[],this._isFleetTask=t.battery_fleet_task===!0,this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let i=t.schedule;this._weekdays=i?.kind==="weekdays"?[...i.weekdays??[]]:[],this._nth=i?.kind==="nth_weekday"?String(i.nth??1):"1",this._nthWeekday=i?.kind==="nth_weekday"?String(i.weekday??5):"5",this._domDay=i?.kind==="day_of_month"&&(i.day??1)>=1?String(i.day??1):"1",this._domLastDay=i?.kind==="day_of_month"&&i.day===-1,this._domBusiness=i?.kind==="day_of_month"&&i.business===!0,this._calMonths=(i?.kind==="day_of_month"||i?.kind==="nth_weekday")&&Array.isArray(i.months)?[...i.months]:[],this._hadCalMonths=this._calMonths.length>0,this._calendarEntity=i?.kind==="calendar"&&i.entity_id||"",this._calOffset=i?.offset?String(i.offset):"0",this._seasonMonths=Array.isArray(i?.season_months)?[...i.season_months]:[];let r=i?.ends;r&&typeof r.count=="number"?(this._endsMode="count",this._endsCount=String(r.count),this._endsUntil=""):r&&typeof r.until=="string"?(this._endsMode="until",this._endsUntil=r.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=t.warning_days.toString(),this._earliestCompletionDays=t.earliest_completion_days!=null?String(t.earliest_completion_days):"",this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._notifyIcon=t.notify_icon||"",this._priority=t.priority||"normal",this._labels=(t.labels||[]).join(", "),this._mirrorTodoEntities=[...t.mirror_todo_entities||[]],this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._loadedLastPerformed=this._lastPerformed,this._nfcTagId=t.nfc_tag_id||"",this._requireTagScan=!!t.require_tag_scan,this._allowSkip=t.allow_skip!==!1,this._notifyEnabled=t.notify_enabled!==!1,this._readingUnit=t.reading_unit||"",this._readings=(t.readings||[]).map(u=>({...u})),this._consumesParts=Object.fromEntries((t.consumes_parts||[]).map(u=>[M(u),{...u}])),this._consumesQtyText={},this._responsibleUserId=t.responsible_user_id||null,this._loadedResponsibleUserId=this._responsibleUserId,this._assigneePool=[...t.assignee_pool||[]],this._rotationStrategy=t.rotation_strategy||"",this._checklistText=(t.checklist||[]).join(`
`),this._phaseDefs=Object.entries(t.phases||{}).map(([u,m])=>{let{name:y,checklist:v,consumes_parts:f,required_completion_fields:b,...w}=m,x=m.consumes_parts||[],S=x.findIndex(A=>!A.entry_id),R=S>=0?x[S]:void 0;return{id:u,name:m.name||u,checklistText:(m.checklist||[]).join(`
`),partId:R?.part_id||"",partQty:R?.quantity!=null?String(R.quantity):"",reqOverride:m.required_completion_fields!==void 0,reqFields:[...m.required_completion_fields||[]],extraParts:x.filter((A,fe)=>fe!==S).map(A=>({...A})),carry:w}}),this._phaseSeq=[...t.phase_sequence||[]],this._requiredCompletion=[...t.required_completion_fields||[]],this._scheduleTime=t.schedule_time||"",this._scheduleTimeOn=!!t.schedule_time;let n=t.on_complete_action;if(n&&n.service){this._actionService=n.service;let u=n.target?.entity_id;this._actionTargetEntity=Array.isArray(u)?u[0]||"":u||"",this._actionTargetStored=n.target&&typeof n.target=="object"?JSON.parse(JSON.stringify(n.target)):null,this._actionTargetInitial=this._actionTargetEntity,this._actionData=n.data&&typeof n.data=="object"?{...n.data}:{},this._actionDataJsonFallback="",this._actionSkipAuto=n.skip_auto===!0,this._actionPresent=!0}else this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1;let c=t.quick_complete_defaults;this._qcNotes=c?.notes||"",this._qcCost=c?.cost!=null?String(c.cost):"",this._qcDuration=c?.duration!=null?String(c.duration):"",this._qcFeedback=c?.feedback||"";let p=t.adaptive_config||{};if(this._environmentalEntity=p.environmental_entity||"",this._environmentalAttribute=p.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!p.enabled,this._adaptiveAlpha=p.ewa_alpha?.toString()??E.alpha,this._adaptiveMin=p.min_interval_days?.toString()??E.min,this._adaptiveMax=p.max_interval_days?.toString()??E.max,this._adaptiveSeasonal=p.seasonal_enabled!==!1,this._adaptivePrediction=p.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=this._adaptiveEnabled,t.trigger_config){let u=t.trigger_config;this._triggerEntityId=he(u)||"",this._triggerEntityIds=P(u),this._triggerEntityLogic=u.entity_logic||"any",this._setTypeFields(me(u)),this._triggerCombinator=u.trigger_combinator==="all"?"all":"any",this._triggerBaselineValue=u.trigger_baseline_value?.toString()||"",this._liveBaselineValue=t.trigger_baseline_value??null,this._autoCompleteOnRecovery=u.auto_complete_on_recovery||!1,this._triggerRuntimeMaxSession=u.trigger_runtime_max_session_seconds?.toString()||"",u.type==="compound"?(this._compoundLogic=u.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(u.conditions||[]).map(we)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._calMonths=[],this._hadCalMonths=!1,this._calendarEntity="",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._notifyIcon="",this._priority="normal",this._labels="",this._mirrorTodoEntities=[],this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._notifyEnabled=!0,this._readingUnit="",this._readings=[],this._consumesParts={},this._consumesQtyText={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._scheduleTimeOn=!1,this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=E.alpha,this._adaptiveMin=E.min,this._adaptiveMax=E.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=!1,this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1,this._actionTesting=!1,this._actionTestResult="",this._actionTestError="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_typeFields(){return{type:this._triggerType,attribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,equals:this._triggerEquals,notEquals:this._triggerNotEquals,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,onStates:this._triggerOnStates,daysBefore:this._triggerDaysBefore}}_setTypeFields(e){this._triggerType=e.type,this._triggerAttribute=e.attribute,this._triggerAbove=e.above,this._triggerBelow=e.below,this._triggerEquals=e.equals,this._triggerNotEquals=e.notEquals,this._triggerForMinutes=e.forMinutes,this._triggerTargetValue=e.targetValue,this._triggerDeltaMode=e.deltaMode,this._triggerFromState=e.fromState,this._triggerToState=e.toState,this._triggerTargetChanges=e.targetChanges,this._triggerRuntimeHours=e.runtimeHours,this._triggerOnStates=e.onStates,this._triggerDaysBefore=e.daysBefore}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._setTypeFields(pe()),this._triggerCombinator="any",this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._triggerRuntimeMaxSession="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new se(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}_toggleAssignee(e){this._assigneePool=this._assigneePool.includes(e)?this._assigneePool.filter(t=>t!==e):[...this._assigneePool,e]}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError=s("action_test_bad_format",this._lang),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,i]=e.split(".");if(!this.hass?.services?.[t]?.[i]){this._actionTestResult="error",this._actionTestError=s("action_test_unknown_service",this._lang).replace("{service}",e),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let r=this._actionTargetEntity.trim();if(r){let n=r.split(".")[0];if(n!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=s("action_test_domain_mismatch",this._lang).replace("{service}",e).replace("{domain}",t).replace("{entity}",r).replace("{entity_domain}",n).replace("{suggestion}",`${n}.${i}`),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[r]){this._actionTestResult="error",this._actionTestError=s("action_test_entity_missing",this._lang).replace("{entity}",r),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,i]=e.split("."),r=this.hass?.services?.[t]?.[i]?.fields;return!r||Object.keys(r).length===0?null:Object.entries(r).map(([n,c])=>({name:n,required:!!c.required,selector:c.selector||{text:{}}}))}_actionTargetExtended(){let e=this._actionTargetStored;return e?Object.entries(e).some(([t,i])=>t==="entity_id"?Array.isArray(i)&&i.length>1:Array.isArray(i)?i.length>0:!!i):!1}_actionTargetSummary(){let e=this._actionTargetStored||{},t=r=>(Array.isArray(r)?r:[r]).filter(n=>typeof n=="string"&&!!n),i=this.hass;return[...t(e.entity_id).map(r=>i.states?.[r]?.attributes?.friendly_name||r),...t(e.device_id).map(r=>i.devices?.[r]?.name_by_user||i.devices?.[r]?.name||r),...t(e.area_id).map(r=>i.areas?.[r]?.name||r),...t(e.floor_id).map(r=>i.floors?.[r]?.name||r),...t(e.label_id)].join(", ")}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled&&!this._actionPresent)return _;let t=this._serviceSchema();return a`
      <details class="ca-section">
        <summary>${s("on_complete_action_title",e)}</summary>
        <p class="field-help">${s("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${i=>{this._actionService=i.detail.value||"";let r=this._serviceSchema();if(r){let n=new Set(r.map(c=>c.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([c])=>n.has(c)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>s("on_complete_action_target",e)}
          @value-changed=${i=>{let r=i.detail.value;this._actionTargetEntity=r.target_entity||""}}
        ></ha-form>
        ${this._actionTargetExtended()&&this._actionTargetEntity.trim()===this._actionTargetInitial?a`<p class="field-help ca-target-more">${s("on_complete_action_target_more",e).replace("{targets}",this._actionTargetSummary())}</p>`:_}
        <p class="field-help ca-domain-hint">
          ${s("on_complete_action_target_hint",e)}
        </p>
        <label class="ca-skip-auto">
          <input type="checkbox" .checked=${this._actionSkipAuto}
            @change=${i=>{this._actionSkipAuto=i.target.checked}} />
          <span>${s("on_complete_action_skip_auto",e)}</span>
        </label>
        ${t?a`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${t}
                .data=${this._actionData}
                @value-changed=${i=>{this._actionData={...i.detail.value}}}
              ></ha-form>
            `:a`
              <ms-textfield
                label="${s("on_complete_action_data",e)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${i=>{this._actionDataJsonFallback=i.target.value}}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting||!this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting?"\u2026":s("on_complete_action_test",e)}
          </button>
          ${this._actionTestResult==="ok"?a`<span class="ca-test-ok">${s("on_complete_action_test_success",e)}</span>`:_}
          ${this._actionTestResult==="error"?a`<div class="ca-test-error-block">
                <span class="ca-test-error">${s("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?a`<div class="ca-test-error-detail">${this._actionTestError}</div>`:_}
              </div>`:_}
        </div>
      </details>

      ${this.completionActionsEnabled?a`<details class="ca-section">
        <summary>${s("quick_complete_defaults_title",e)}</summary>
        <p class="field-help">${s("quick_complete_defaults_desc",e)}</p>
        <ms-textfield
          label="${s("quick_complete_defaults_notes",e)}"
          .value=${this._qcNotes}
          @input=${i=>{this._qcNotes=i.target.value}}
        ></ms-textfield>
        <div class="qc-cost">
          <span class="qc-cost-label">${s("quick_complete_defaults_cost",e)}</span>
          <ms-cost-input .lang=${e} .value=${this._qcCost}
            @value-changed=${i=>{this._qcCost=i.detail.value}}></ms-cost-input>
        </div>
        <ms-textfield
          label="${s("quick_complete_defaults_duration",e)}"
          type="number" min="0" step="1"
          .value=${this._qcDuration}
          @input=${i=>{this._qcDuration=i.target.value}}
        ></ms-textfield>
        <select class="qc-feedback"
          .value=${this._qcFeedback}
          @change=${i=>{this._qcFeedback=i.target.value}}>
          <option value="">${s("quick_complete_defaults_feedback_none",e)}</option>
          <option value="needed">${s("quick_complete_defaults_feedback_needed",e)}</option>
          <option value="not_needed">${s("quick_complete_defaults_feedback_not_needed",e)}</option>
          <option value="not_sure">${s("feedback_not_sure",e)}</option>
        </select>
      </details>`:_}
    `}async _loadParts(){if(this.parts=[],!!this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this.parts=e.parts||[],this._partsLoadFailed=!1}catch{this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){if(this._foreignOwners=[],!!this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._foreignOwners=(e.objects||[]).filter(t=>t.entry_id!==this._entryId&&(t.parts||[]).length>0).map(t=>({entry_id:t.entry_id,name:t.object?.name||t.entry_id,parts:t.parts||[]})).sort((t,i)=>t.name.localeCompare(i.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(e){!e||!this.hass||this._conditionAttrOptions[e]||this._conditionAttrPending.has(e)||(this._conditionAttrPending.add(e),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e}).then(t=>{let i=t;this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:i.suggested_attributes||[],available:i.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(e){if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});this._entityDomain=t.domain||"",this._suggestedAttributes=t.suggested_attributes||[],this._availableAttributes=t.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(e=>!!e.entry_id)}_renderConsumesRow(e,t){let i=M({part_id:e.id,entry_id:t}),r=this._consumesParts[i],n=t?{part_id:e.id,quantity:1,entry_id:t}:{part_id:e.id,quantity:1};return a`
      <div class="consumes-row">
        <label class="consumes-check">
          <input
            type="checkbox"
            .checked=${r!==void 0}
            @change=${c=>{let p={...this._consumesParts};if(c.target.checked)p[i]=p[i]||n;else{delete p[i];let u={...this._consumesQtyText};delete u[i],this._consumesQtyText=u}this._consumesParts=p}}
          />
          <span>${e.name}${e.unit?` (${e.unit})`:""}</span>
        </label>
        ${r!==void 0?a`<input
              class="consumes-qty"
              type="number"
              min=${T[0]}
              max=${T[1]}
              step="0.01"
              .value=${this._consumesQtyText[i]??String(r.quantity)}
              @input=${c=>{let p=c.target.value;this._consumesQtyText={...this._consumesQtyText,[i]:p};let u=parseFloat(p.replace(",","."));Number.isFinite(u)&&u>=T[0]&&(this._consumesParts={...this._consumesParts,[i]:{...n,quantity:u}})}}
            />`:_}
      </div>
    `}_applyConsumesQtyText(){let e={...this._consumesParts};for(let t of Object.keys(e)){let i=this._consumesQtyText[t];if(i===void 0)continue;let r=parseFloat(i.replace(",","."));if(!Number.isFinite(r)||r<T[0]||r>T[1]){let n=c=>N(c,this._lang,{maximumFractionDigits:2});return this._error=s("settings_value_out_of_range",this._lang).replace("{min}",n(T[0])).replace("{max}",n(T[1])),!1}e[t]={...e[t],quantity:r}}return this._consumesParts=e,!0}_toggleRequired(e,t){let i=new Set(this._requiredCompletion);t?i.add(e):i.delete(e),this._requiredCompletion=[...i]}_patchReading(e,t){this._readings=this._readings.map(i=>i.id===e?{...i,...t}:i)}_renderReadingsEditor(e){let t=te(this._readings);return a`
      <div class="readings-editor">
        <div class="field-label">${s("readings_section",e)}</div>
        <div class="field-help">${s("readings_hint",e)}</div>
        ${this._readings.map(i=>a`
          ${t.has(i.id)?a`<div class="field-help reading-dup">${s("reading_duplicate_name",e)}</div>`:_}
          <div class="reading-row">
            <ms-textfield
              class="reading-name"
              label="${s("reading_name_label",e)}"
              .value=${i.name}
              @input=${r=>this._patchReading(i.id,{name:r.target.value})}
            ></ms-textfield>
            <ms-textfield
              class="reading-unit"
              label="${s("reading_unit_short",e)}"
              .value=${i.unit||""}
              @input=${r=>this._patchReading(i.id,{unit:r.target.value})}
            ></ms-textfield>
            <ha-icon-button class="phase-remove reading-remove" @click=${()=>this._readings=this._readings.filter(r=>r.id!==i.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
        `)}
        ${this._readings.length<Z?a`
          <ha-button appearance="plain" class="reading-add"
            @click=${()=>this._readings=[...this._readings,{id:ee(),name:"",unit:this._readings.length?this._readings[this._readings.length-1].unit:this._readingUnit}]}>
            <ha-icon icon="mdi:plus"></ha-icon> ${s("reading_add",e)}
          </ha-button>`:_}
      </div>
    `}_phaseSlug(e){let t=e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",i=t,r=2;for(;this._phaseDefs.some(n=>n.id===i);)i=`${t}-${r++}`;return i}_addPhaseDef(){let e=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:e,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(e){this._phaseDefs=this._phaseDefs.filter(t=>t.id!==e),this._phaseSeq=this._phaseSeq.filter(t=>t!==e)}_patchPhaseDef(e,t){this._phaseDefs=this._phaseDefs.map(i=>i.id===e?{...i,...t}:i)}_renderPhasesEditor(e){let t=i=>this._phaseDefs.find(r=>r.id===i)?.name||i;return a`
      <details class="phases-section" ?open=${this._phaseDefs.length>0}>
      <summary>${s("phases_section",e)}</summary>
      <div class="field-help">${s("phases_hint",e)}</div>
      ${this._phaseDefs.map(i=>a`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${s("phase_name",e)}"
              .value=${i.name}
              @input=${r=>this._patchPhaseDef(i.id,{name:r.target.value})}
            ></ms-textfield>
            ${this.parts.length?a`
              <select
                class="phase-part"
                .value=${i.partId}
                @change=${r=>{let n=r.target.value;this._patchPhaseDef(i.id,i.partQty?{partId:n}:{partId:n,partQty:"1"})}}
              >
                <option value="">—</option>
                ${this.parts.map(r=>a`<option value=${r.id} ?selected=${r.id===i.partId}>${r.name}</option>`)}
              </select>
              ${i.partId?a`
                <!-- The typed text as-is: a "|| '1'" here rewrote a cleared
                     field to 1 and the next digit gave "13" (bug audit
                     2026-09-26 #2); an empty field saves as 1. -->
                <input class="phase-qty" type="number" min=${U[0]} step="0.01" placeholder="1" .value=${i.partQty}
                  @input=${r=>this._patchPhaseDef(i.id,{partQty:r.target.value})} />
              `:_}
            `:_}
            <ha-icon-button class="phase-remove" @click=${()=>this._removePhaseDef(i.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
          ${this.checklistsEnabled?a`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${s("checklist_placeholder",e)}"
              .value=${i.checklistText}
              @input=${r=>this._patchPhaseDef(i.id,{checklistText:r.target.value})}
            ></textarea>
          `:_}
          <label class="req-option phase-req-toggle">
            <input
              type="checkbox"
              .checked=${i.reqOverride}
              @change=${r=>this._patchPhaseDef(i.id,{reqOverride:r.target.checked})}
            />
            <span>${s("phase_require_override",e)}</span>
          </label>
          ${i.reqOverride?a`
            <div class="required-completion phase-req-fields">
              ${D.map(r=>a`
                <label class="req-option">
                  <input
                    type="checkbox"
                    .checked=${i.reqFields.includes(r)}
                    @change=${n=>{let c=n.target.checked,p=new Set(i.reqFields);c?p.add(r):p.delete(r),this._patchPhaseDef(i.id,{reqFields:[...p]})}}
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
      ${this._phaseDefs.some(i=>i.name.trim())?a`
        <div class="phase-seq-label">${s("phase_sequence_label",e)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((i,r)=>a`
            <span class="phase-chip">
              ${r+1}. ${t(i)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((n,c)=>c!==r)}}>✕</button>
            </span>
          `)}
          <select
            class="phase-seq-add"
            .value=${""}
            @change=${i=>{let r=i.target.value;r&&(this._phaseSeq=[...this._phaseSeq,r]),i.target.value=""}}
          >
            <option value="">+ ${s("phase_sequence_add_step",e)}</option>
            ${this._phaseDefs.filter(i=>i.name.trim()).map(i=>a`<option value=${i.id}>${i.name}</option>`)}
          </select>
        </div>
      `:_}
      </details>
    `}async _save(){if(!this._loading&&!(!this._name.trim()||this._missingDueDate())){if(this._adaptiveSnapshot()!==this._adaptiveInitial){let e=parseInt(this._adaptiveMin,10),t=parseInt(this._adaptiveMax,10);if(!isNaN(e)&&!isNaN(t)&&e>t){this._error=`${s("adaptive_min_interval",this._lang)} > ${s("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=s("trigger_hint_overlap",this._lang);return}if(this._scheduleType==="calendar"&&!this._calendarEntity.trim().startsWith("calendar.")){this._error=s("calendar_entity_required",this._lang);return}if(this._applyConsumesQtyText()){this._loading=!0,this._error="";try{let e=await q(this,()=>this.hass.connection.sendMessagePromise(this._savePayload()),{fallbackKey:"save_error",onError:n=>{this._error=n}});if(e===void 0)return;let t=this._taskId||e?.task_id,i=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;this._warning="";let r=n=>{this._warning=s("subsave_warning",this._lang).replace("{detail}",n)};if(t&&this._scheduleType==="sensor_based"&&i&&await q(this,{type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:t,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null},{onError:r})!==void 0&&(this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute),t&&this._adaptiveSnapshot()!==this._adaptiveInitial){let n=parseFloat(this._adaptiveAlpha),c=parseInt(this._adaptiveMin,10),p=parseInt(this._adaptiveMax,10);await q(this,{type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:t,enabled:this._adaptiveEnabled,...n>=C[0]&&n<=C[1]?{ewa_alpha:n}:{},...!isNaN(c)&&c>=1?{min_interval_days:c}:{},...!isNaN(p)&&p>=1?{max_interval_days:p}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction},{onError:r})!==void 0&&(this._adaptiveInitial=this._adaptiveSnapshot())}this._warning?t&&(this._taskId=t):this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}finally{this._loading=!1}}}}_missingDueDate(){return this._scheduleType==="one_time"&&!this._dueDate}_savePayload(){let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},t=this._earliestCompletionDays.trim();e.earliest_completion_days=t===""?null:Math.max(0,parseInt(t,10)||0),this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):F.includes(this._scheduleType)?(e.schedule={...this._buildSchedule(),...this._recurrenceExtras()},e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(e.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.notify_icon=this._notifyIcon.trim()||null,e.priority=this._priority,e.labels=this._labels.split(",").map(i=>i.trim()).filter(Boolean),e.mirror_todo_entities=this._mirrorTodoEntities.filter(Boolean),e.enabled=this._enabled,(!this._taskId||this._lastPerformed!==this._loadedLastPerformed)&&(e.last_performed=this._lastPerformed||null),e.nfc_tag_id=this._nfcTagId||null,e.require_tag_scan=this._requireTagScan,e.allow_skip=this._allowSkip,e.notify_enabled=this._notifyEnabled,e.reading_unit=this._readingUnit.trim()||null,e.readings=ie(this._readings);{let i={};for(let n of this._phaseDefs){if(!n.name.trim())continue;let c={...n.carry,name:n.name.trim()},p=n.checklistText.split(`
`).map(m=>m.trim()).filter(Boolean);p.length&&(c.checklist=p);let u=[];if(n.partId){let m=parseFloat(n.partQty);u.push({part_id:n.partId,quantity:Number.isFinite(m)&&m>0?m:1})}for(let m of n.extraParts)u.push(m.entry_id?{part_id:m.part_id,quantity:m.quantity,entry_id:m.entry_id}:{part_id:m.part_id,quantity:m.quantity});u.length&&(c.consumes_parts=u),n.reqOverride&&(c.required_completion_fields=[...n.reqFields]),i[n.id]=c}let r=this._phaseSeq.filter(n=>n in i);e.phases=Object.keys(i).length&&r.length?i:null,e.phase_sequence=e.phases?r:null}if((this.parts.length||this._foreignOwners.length)&&(e.consumes_parts=Object.values(this._consumesParts).map(i=>i.entry_id?{part_id:i.part_id,quantity:i.quantity,entry_id:i.entry_id}:{part_id:i.part_id,quantity:i.quantity})),(!this._taskId||this._responsibleUserId!==this._loadedResponsibleUserId)&&(e.responsible_user_id=this._responsibleUserId),e.assignee_pool=this._assigneePool,e.required_completion_fields=this._requiredCompletion,e.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let i=this._compoundConditions.map(Se).filter(r=>r!==null);if(i.length>0){let r={type:"compound",compound_logic:this._compoundLogic,conditions:i};this._autoCompleteOnRecovery&&(r.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(r.trigger_combinator="all"),e.trigger_config=r}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let i=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],r={entity_id:i[0],entity_ids:i,type:this._triggerType};if(ve(r,this._typeFields()),this._autoCompleteOnRecovery&&(r.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(r.trigger_combinator="all"),i.length>1&&(r.entity_logic=this._triggerEntityLogic),this._triggerType==="counter"&&this._triggerDeltaMode&&this._triggerBaselineValue){let n=parseFloat(this._triggerBaselineValue);!isNaN(n)&&n>=0&&(r.trigger_baseline_value=n)}else if(this._triggerType==="runtime"&&this._triggerRuntimeMaxSession){let n=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(n)&&n>0&&(r.trigger_runtime_max_session_seconds=n)}e.trigger_config=r}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&_e.includes(this._scheduleType)){let i=this._scheduleTimeOn?this._scheduleTime.trim():"";e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(i)?i:null}if(this.checklistsEnabled){let i=this._checklistText.split(`
`).map(r=>r.trim()).filter(Boolean).slice(0,100);e.checklist=i.length?i:null}if(this.completionActionsEnabled||this._actionPresent){let i=this._actionService.trim();if(i&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(i)){let r={service:i},n=this._actionTargetEntity.trim();this._actionTargetStored&&n===this._actionTargetInitial?r.target=JSON.parse(JSON.stringify(this._actionTargetStored)):n&&(r.target={entity_id:n});let c=this._buildActionData();Object.keys(c).length>0&&(r.data=c),this._actionSkipAuto&&(r.skip_auto=!0),e.on_complete_action=r}else e.on_complete_action=null}if(this.completionActionsEnabled){let i={};this._qcNotes.trim()&&(i.notes=this._qcNotes.trim());let r=parseFloat(this._qcCost);isNaN(r)||(i.cost=r);let n=ae(this._qcDuration);n!==null&&(i.duration=n),this._qcFeedback&&(i.feedback=this._qcFeedback),e.quick_complete_defaults=Object.keys(i).length?i:null}return e}_close(){this._open=!1,this._warning="",this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return _;let e=this._lang,t=this._triggerType==="compound";return a`
      <div class="select-row">
        <label>${s("trigger_type",e)}</label>
        <select
          .value=${this._triggerType}
          @change=${i=>this._triggerType=i.target.value}
        >
          ${xe.map(i=>a`<option value=${i} ?selected=${i===this._triggerType}>${ce(i,e)}</option>`)}
        </select>
      </div>
      ${t?this._renderCompoundEditor():a`
        ${this._entityPickerFallback?a`
          <ms-textfield
            label="${s("entity_id",e)} (${s("comma_separated",e)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${i=>{let n=i.target.value.split(",").map(c=>c.trim()).filter(Boolean);this._triggerEntityId=n[0]||"",this._triggerEntityIds=n,n[0]&&this._fetchEntityAttributes(n[0])}}
          ></ms-textfield>
        `:a`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:j}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>s("entity_id",e)}
          @value-changed=${i=>{let r=(i.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=r[0]||"",this._triggerEntityIds=r,r[0]?this._fetchEntityAttributes(r[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?a`
          <div class="select-row">
            <label>${s("entity_logic",e)}</label>
            <select
              .value=${this._triggerEntityLogic}
              @change=${i=>this._triggerEntityLogic=i.target.value}
            >
              <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${s("entity_logic_any",e)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${s("entity_logic_all",e)}</option>
            </select>
          </div>
        `:_}
        ${this._renderAttributeSelect({label:s("attribute_optional",e),value:this._triggerAttribute,suggested:this._suggestedAttributes,available:this._availableAttributes,onSelect:i=>this._triggerAttribute=i})}
        ${this._renderTriggerTypeFields()}
        ${this._renderTriggerLiveHint()}
      `}
      <label>
        <input
          type="checkbox"
          .checked=${this._autoCompleteOnRecovery}
          @change=${i=>this._autoCompleteOnRecovery=i.target.checked}
        />
        ${s("auto_complete_on_recovery",e)}
      </label>
      <div class="field-help">${s("auto_complete_on_recovery_help",e)}</div>
      <ms-textfield
        label="${s("safety_interval",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${i=>this._intervalDays=i.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():_}
      ${this._intervalDays?a`
            <div class="select-row">
              <label>${s("trigger_combinator",e)}</label>
              <select
                @change=${i=>this._triggerCombinator=i.target.value}
              >
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${s("trigger_combinator_any",e)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${s("trigger_combinator_all",e)}</option>
              </select>
            </div>
          `:_}
    `}_patchCondition(e,t){this._compoundConditions=this._compoundConditions.map((i,r)=>r===e?{...i,...t}:i)}_addCondition(){this._compoundConditions=[...this._compoundConditions,pe()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((t,i)=>i!==e)}_renderCompoundEditor(){let e=this._lang;return a`
      <div class="select-row">
        <label>${s("compound_logic",e)}</label>
        <select
          .value=${this._compoundLogic}
          @change=${t=>this._compoundLogic=t.target.value}
        >
          <option value="AND" ?selected=${this._compoundLogic==="AND"}>${s("compound_logic_and",e)}</option>
          <option value="OR" ?selected=${this._compoundLogic==="OR"}>${s("compound_logic_or",e)}</option>
        </select>
      </div>
      <div class="field-help">${s("compound_help",e)}</div>
      ${this._compoundConditions.length===0?a`<div class="field-help">${s("compound_no_conditions",e)}</div>`:this._compoundConditions.map((t,i)=>this._renderCondition(t,i))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${s("compound_add_condition",e)}
      </button>
    `}_renderCondition(e,t){let i=this._lang,r=t+1;return a`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${s("compound_condition",i)} ${r}</span>
          <button
            type="button"
            class="icon-btn"
            title="${s("compound_remove_condition",i)}"
            @click=${()=>this._removeCondition(t)}
          >✕</button>
        </div>
        ${this._entityPickerFallback?a`
          <ms-textfield
            label="${s("entity_id",i)} (${s("comma_separated",i)})"
            .value=${e.entityIds}
            @input=${n=>this._patchCondition(t,{entityIds:n.target.value})}
          ></ms-textfield>
        `:a`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:j}}}]}
          .data=${{condition_entities:e.entityIds.split(",").map(n=>n.trim()).filter(Boolean)}}
          .computeLabel=${()=>s("entity_id",i)}
          @value-changed=${n=>{let c=(n.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(t,{entityIds:c.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(e,t)}
        <div class="select-row">
          <label>${s("trigger_type",i)}</label>
          <select
            .value=${e.type}
            @change=${n=>this._patchCondition(t,{type:n.target.value})}
          >
            ${ge.map(n=>a`<option value=${n} ?selected=${n===e.type}>${ce(n,i)}</option>`)}
          </select>
        </div>
        ${this._renderConditionTypeFields(e,t)}
      </div>
    `}_renderStateField(e){return this._entityPickerFallback||!e.entityId?a`
        <ms-textfield
          label=${e.label}
          .value=${e.value}
          @input=${t=>e.onInput(t.target.value)}
        ></ms-textfield>
      `:a`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId}}}]}
        .data=${{s:e.value}}
        .computeLabel=${()=>e.label}
        @value-changed=${t=>e.onInput((t.detail.value.s||"").trim())}
      ></ha-form>
    `}_renderOnStatesField(e){let t=this._lang;return this._entityPickerFallback||!e.entityId?a`
        <ms-textfield
          label="${s("runtime_on_states",t)}"
          placeholder="on"
          .value=${e.value}
          @input=${i=>e.onInput(i.target.value)}
        ></ms-textfield>
      `:a`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId,multiple:!0}}}]}
        .data=${{s:(e.value||"").split(",").map(i=>i.trim()).filter(Boolean)}}
        .computeLabel=${()=>s("runtime_on_states",t)}
        @value-changed=${i=>e.onInput((i.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(e){return this._scheduleType==="one_time"||this._scheduleType==="manual"?_:!this.adaptiveFeature&&!this._adaptiveWasEnabled?_:a`
      <details class="adaptive-section" ?open=${this._adaptiveEnabled}>
        <summary>${s("adaptive_section_title",e)}</summary>
        <label>
          <input
            type="checkbox"
            .checked=${this._adaptiveEnabled}
            @change=${t=>this._adaptiveEnabled=t.target.checked}
          />
          ${s("adaptive_enabled",e)}
        </label>
        ${this._adaptiveEnabled?a`
          <ms-textfield
            label="${s("adaptive_min_interval",e)}"
            type="number"
            min="1"
            .value=${this._adaptiveMin}
            @input=${t=>this._adaptiveMin=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("adaptive_max_interval",e)}"
            type="number"
            min="1"
            .value=${this._adaptiveMax}
            @input=${t=>this._adaptiveMax=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("adaptive_ewa_alpha",e)}"
            type="number"
            min=${C[0]}
            max=${C[1]}
            step="0.1"
            .value=${this._adaptiveAlpha}
            @input=${t=>this._adaptiveAlpha=t.target.value}
          ></ms-textfield>
          ${this.seasonalFeature?a`<label>
            <input
              type="checkbox"
              .checked=${this._adaptiveSeasonal}
              @change=${t=>this._adaptiveSeasonal=t.target.checked}
            />
            ${s("adaptive_seasonal_enabled",e)}
          </label>`:_}
          <label>
            <input
              type="checkbox"
              .checked=${this._adaptivePrediction}
              @change=${t=>this._adaptivePrediction=t.target.checked}
            />
            ${s("adaptive_prediction_enabled",e)}
          </label>
        `:_}
      </details>
    `}_renderAttributeSelect(e){let t=this._lang;return e.available.length>0?a`
        <div class="select-row">
          <label>${e.label}</label>
          <select
            .value=${e.value}
            @change=${i=>e.onSelect(i.target.value)}
          >
            <option value="" ?selected=${!e.value}>${s("use_entity_state",t)}</option>
            ${e.suggested.map(i=>a`<option value=${i} ?selected=${i===e.value}>${i} ★</option>`)}
            ${e.available.filter(i=>!e.suggested.includes(i.name)).map(i=>a`<option value=${i.name} ?selected=${i.name===e.value}>${i.name}${i.numeric?"":" (non-numeric)"}</option>`)}
          </select>
        </div>
      `:a`
      <ms-textfield
        label="${e.label}"
        .value=${e.value}
        @input=${i=>e.onSelect(i.target.value.trim())}
      ></ms-textfield>
    `}_renderEnvironmentalAttribute(e){this._fetchConditionAttributes(this._environmentalEntity);let t=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:s("environmental_attribute_optional",e),value:this._environmentalAttribute,suggested:t?.suggested??[],available:t?.available??[],onSelect:i=>this._environmentalAttribute=i})}_renderConditionAttribute(e,t){let i=e.entityIds.split(",")[0]?.trim()||"";i&&this._fetchConditionAttributes(i);let r=i?this._conditionAttrOptions[i]:void 0;return this._renderAttributeSelect({label:s("attribute_optional",this._lang),value:e.attribute,suggested:r?.suggested??[],available:r?.available??[],onSelect:n=>this._patchCondition(t,{attribute:n})})}_renderConditionTypeFields(e,t){let i=this._lang;if(e.type==="threshold")return a`
        <ms-textfield label="${s("trigger_above",i)}" type="number" .value=${e.above}
          @input=${r=>this._patchCondition(t,{above:r.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_below",i)}" type="number" .value=${e.below}
          @input=${r=>this._patchCondition(t,{below:r.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_equals",i)}" type="number" .value=${e.equals}
          @input=${r=>this._patchCondition(t,{equals:r.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_not_equals",i)}" type="number" .value=${e.notEquals}
          @input=${r=>this._patchCondition(t,{notEquals:r.target.value})}></ms-textfield>
        <ms-textfield label="${s("for_minutes",i)}" type="number" .value=${e.forMinutes}
          @input=${r=>this._patchCondition(t,{forMinutes:r.target.value})}></ms-textfield>
      `;if(e.type==="counter")return a`
        <ms-textfield label="${s("target_value",i)}" type="number" .value=${e.targetValue}
          @input=${r=>this._patchCondition(t,{targetValue:r.target.value})}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${e.deltaMode}
            @change=${r=>this._patchCondition(t,{deltaMode:r.target.checked})} />
          ${s("delta_mode",i)}
        </label>
      `;if(e.type==="state_change"){let r=e.entityIds.split(",")[0]?.trim()||"";return a`
        ${this._renderStateField({label:s("from_state_optional",i),value:e.fromState,entityId:r,onInput:n=>this._patchCondition(t,{fromState:n})})}
        ${this._renderStateField({label:s("to_state_optional",i),value:e.toState,entityId:r,onInput:n=>this._patchCondition(t,{toState:n})})}
        <ms-textfield label="${s("target_changes",i)}" type="number" .value=${e.targetChanges}
          @input=${n=>this._patchCondition(t,{targetChanges:n.target.value})}></ms-textfield>
        <ms-textfield label="${s("for_minutes",i)}" type="number" .value=${e.forMinutes}
          @input=${n=>this._patchCondition(t,{forMinutes:n.target.value})}></ms-textfield>
      `}if(e.type==="runtime"){let r=e.entityIds.split(",")[0]?.trim()||"";return a`
        <ms-textfield label="${s("runtime_hours",i)}" type="number" .value=${e.runtimeHours}
          @input=${n=>this._patchCondition(t,{runtimeHours:n.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:e.onStates,entityId:r,onInput:n=>this._patchCondition(t,{onStates:n})})}
      `}return e.type==="due_date"?a`
        <ms-textfield label="${s("days_before",i)}" type="number" step="1"
          min=${I[0]} max=${I[1]} .value=${e.daysBefore}
          @input=${r=>this._patchCondition(t,{daysBefore:r.target.value})}></ms-textfield>
      `:_}_renderUnitSelect(){let e=this._lang;return a`
      <div class="select-row">
        <label>${s("interval_unit",e)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${t=>this._intervalUnit=t.target.value}
        >
          ${["days","weeks","months","years"].map(t=>a`<option value=${t} ?selected=${t===this._intervalUnit}>${s("unit_"+t,e)}</option>`)}
        </select>
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(this._scheduleType==="calendar"&&!this._calendarEntity.trim())return null;if(F.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let e=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!e||e<=0?null:{kind:"interval",every:e,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(e){super.updated?.(e),this._scheduleEntityPickerProbe();for(let t of e.keys())if(o._PREVIEW_RELEVANT.has(String(t))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let e=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),t=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!e||!t){this._pickerProbeStrikes=0;return}let i=(p,u,m=0)=>{if(!(!p||m>10)){(p.tagName?.toLowerCase()??"")==="ha-entity-picker"&&u.push(p);for(let y of[p.shadowRoot,p])if(y)for(let v of Array.from(y.children??[]))i(v,u,m+1)}},r=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],n=[];for(let p of r)i(p,n);let c=n.length===0||n.some(p=>p.offsetHeight===0);if(e.offsetHeight===0||c){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let e=this._open?this._previewScheduleDict():null;if(!e){this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let t=++this._previewSeq;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:e,...this._lastPerformed?{last_performed:this._lastPerformed}:{}});if(t!==this._previewSeq)return;this._schedulePreview=i.occurrences||[],this._schedulePreviewEnded=!!i.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return _;let e=this._lang,t=this.scheduleTimeEnabled&&this._scheduleTimeOn&&this._scheduleTime?` ${this._scheduleTime}`:"",i=this._schedulePreview.map((n,c)=>{let p=new Date(`${n}T12:00:00`).getDay();return`${O(p===0?6:p-1,e,"short")} ${H(n,e)}${c===0?t:""}`}).join(" \xB7 "),r=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?a`<div class="field-help">${s("schedule_preview_ontime",e)}</div>`:_;return a`
      <div class="trigger-live-hint schedule-preview">
        ${s("schedule_preview_title",e)}: ${i}${this._schedulePreviewEnded?a` <span class="field-help">${s("schedule_preview_ends",e)}</span>`:_}
        ${r}
      </div>
    `}_buildSchedule(){let e=r=>{let n=parseInt(this._calOffset,10)||0;return n&&(r.offset=Math.max(-k,Math.min(n,k))),r},t=r=>((this._calMonths.length||this._hadCalMonths)&&(r.months=[...this._calMonths].sort((n,c)=>n-c)),e(r));if(this._scheduleType==="weekdays")return e({kind:"weekdays",weekdays:[...this._weekdays].sort((r,n)=>r-n)});if(this._scheduleType==="nth_weekday")return t({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});if(this._scheduleType==="calendar")return e({kind:"calendar",entity_id:this._calendarEntity.trim()});let i={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(i.business=!0),t(i)}_recurrenceExtras(){let e={};if(this._seasonMonths.length&&(e.season_months=[...this._seasonMonths].sort((t,i)=>t-i)),this._endsMode==="count"){let t=parseInt(this._endsCount,10);t>=1&&(e.ends={count:t})}else this._endsMode==="until"&&this._endsUntil&&(e.ends={until:this._endsUntil});return e}_toggleCalMonth(e){this._calMonths=this._calMonths.includes(e)?this._calMonths.filter(t=>t!==e):[...this._calMonths,e]}_renderCalMonths(){let e=this._lang;return a`
      <label class="field-label">${s("recurrence_months_label",e)}</label>
      <div class="field-help">${s("recurrence_months_hint",e)}</div>
      <div class="weekday-chips season-chips cal-month-chips">
        ${ue(e).map((t,i)=>a`
          <button
            type="button"
            class="season-chip ${this._calMonths.includes(i+1)?"selected":""}"
            @click=${()=>this._toggleCalMonth(i+1)}
          >${t}</button>`)}
      </div>`}_toggleSeasonMonth(e){this._seasonMonths=this._seasonMonths.includes(e)?this._seasonMonths.filter(t=>t!==e):[...this._seasonMonths,e]}_renderRecurrenceExtras(){let e=this._lang;if(!(this._scheduleType==="time_based"||F.includes(this._scheduleType)))return _;let i=ue(e);return a`
      <label class="field-label">${s("season_window_label",e)}</label>
      <div class="field-help">${s("season_window_hint",e)}</div>
      <div class="weekday-chips season-chips">
        ${i.map((r,n)=>a`
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
      ${this._endsMode==="count"?a`
        <ms-textfield
          label="${s("series_end_count_label",e)}"
          type="number" min="1"
          .value=${this._endsCount}
          @input=${r=>this._endsCount=r.target.value}
        ></ms-textfield>`:_}
      ${this._endsMode==="until"?a`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${e}
          label="${s("series_end_until_label",e)}"
          .value=${this._endsUntil}
          @value-changed=${r=>this._endsUntil=r.detail.value}
        ></ms-date-field>`:_}
    `}_renderCalendarFields(){let e=this._lang,t=Ie(e);if(this._scheduleType==="weekdays")return a`
        <label class="field-label">${s("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${t.map((i,r)=>a`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(r)?"selected":""}"
              @click=${()=>this._toggleWeekday(r)}
            >${i}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let i=[["1",s("ord_1",e)],["2",s("ord_2",e)],["3",s("ord_3",e)],["4",s("ord_4",e)],["5",s("ord_5",e)],["-1",s("ord_last",e)]];return a`
        <div class="select-row">
          <label>${s("recurrence_occurrence",e)}</label>
          <select .value=${this._nth} @change=${r=>this._nth=r.target.value}>
            ${i.map(([r,n])=>a`<option value=${r} ?selected=${r===this._nth}>${n}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${s("recurrence_weekday",e)}</label>
          <select .value=${this._nthWeekday} @change=${r=>this._nthWeekday=r.target.value}>
            ${t.map((r,n)=>a`<option value=${String(n)} ?selected=${String(n)===this._nthWeekday}>${r}</option>`)}
          </select>
        </div>
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`}return this._scheduleType==="calendar"?a`
        ${this._entityPickerFallback?a`
          <ms-textfield
            label="${s("calendar_entity_label",e)}"
            helper="${s("calendar_entity_hint",e)}"
            .value=${this._calendarEntity}
            @input=${i=>this._calendarEntity=i.target.value.trim()}
          ></ms-textfield>
        `:a`
          <ha-form
            class="entity-picker-form calendar-entity-form"
            .hass=${this.hass}
            .schema=${[{name:"calendar_entity",selector:{entity:{domain:"calendar"}}}]}
            .data=${{calendar_entity:this._calendarEntity}}
            .computeLabel=${()=>s("calendar_entity_label",e)}
            .computeHelper=${()=>s("calendar_entity_hint",e)}
            @value-changed=${i=>{this._calendarEntity=(i.detail.value.calendar_entity||"").trim()}}
          ></ha-form>`}
        ${this._renderCalOffsetField()}`:this._scheduleType==="day_of_month"?a`
        ${this._domLastDay?_:a`
          <ms-textfield
            label="${s("recurrence_day",e)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${i=>this._domDay=i.target.value}
          ></ms-textfield>`}
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domLastDay}
            @change=${i=>this._domLastDay=i.target.checked} />
          <span>${s("recurrence_last_day",e)}</span>
        </label>
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domBusiness}
            @change=${i=>this._domBusiness=i.target.checked} />
          <span>${s("recurrence_business_day",e)}</span>
        </label>
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`:_}_renderCalOffsetField(){let e=this._lang;return a`
      <ms-textfield
        label="${s("recurrence_offset",e)}"
        helper="${s("recurrence_offset_help",e)}"
        type="number"
        min=${-k}
        max=${k}
        .value=${this._calOffset}
        @input=${t=>this._calOffset=t.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let e=parseFloat(this._triggerAbove),t=parseFloat(this._triggerBelow);return!isNaN(e)&&!isNaN(t)&&t>e}_renderTriggerLiveHint(){if(this._triggerType==="compound")return _;let e=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?a`<div class="trigger-live-hint warn">${s("trigger_hint_overlap",this._lang)}</div>`:_,t=this._triggerEntityId||this._triggerEntityIds[0];if(!t||!this.hass?.states)return e;let i=this.hass.states[t];if(!i)return e;let r=this._lang,n=i.attributes?.unit_of_measurement,c=typeof n=="string"&&n?` ${n}`:"",p=this._triggerAttribute?i.attributes?.[this._triggerAttribute]:i.state,u=typeof p=="number"?p:parseFloat(String(p)),m=p!=="unknown"&&p!=="unavailable"&&p!=null&&!isNaN(u),y=f=>N(f,r,{maximumFractionDigits:1}),v=[];if(this._triggerType==="threshold"){let f=parseFloat(this._triggerAbove),b=parseFloat(this._triggerBelow),w=parseFloat(this._triggerEquals),x=parseFloat(this._triggerNotEquals);if([f,b,w,x].every(S=>isNaN(S)))return _;m&&v.push(s("trigger_hint_now",r).replace("{value}",y(u)+c)),isNaN(f)||v.push(s("trigger_hint_above",r).replace("{target}",y(f)+c)),isNaN(b)||v.push(s("trigger_hint_below",r).replace("{target}",y(b)+c)),isNaN(w)||v.push(s("trigger_hint_equals",r).replace("{target}",y(w)+c)),isNaN(x)||v.push(s("trigger_hint_not_equals",r).replace("{target}",y(x)+c))}else if(this._triggerType==="counter"){let f=parseFloat(this._triggerTargetValue);if(isNaN(f))return _;this._triggerDeltaMode?this._taskId?v.push(s("trigger_hint_counter_delta_edit",r).replace("{target}",y(f)+c)):m?v.push(s("trigger_hint_counter_delta",r).replace("{value}",y(u)+c).replace("{due}",y(u+f)+c).replace("{target}",y(f)+c)):v.push(s("trigger_hint_counter_delta_edit",r).replace("{target}",y(f)+c)):(m&&v.push(s("trigger_hint_now",r).replace("{value}",y(u)+c)),v.push(s("trigger_hint_counter_abs",r).replace("{target}",y(f)+c)))}else if(this._triggerType==="runtime"){let f=parseFloat(this._triggerRuntimeHours);if(isNaN(f))return _;v.push(s("trigger_hint_runtime",r).replace("{hours}",y(f))),v.push(s("trigger_hint_state_now",r).replace("{value}",String(i.state)))}else if(this._triggerType==="state_change"){let f=parseInt(this._triggerTargetChanges,10)||1,b=this._triggerToState.trim();v.push((b?s("trigger_hint_state_change_to",r).replace("{state}",b):s("trigger_hint_state_change",r)).replace("{count}",String(f))),v.push(s("trigger_hint_state_now",r).replace("{value}",String(i.state)))}else if(this._triggerType==="due_date"){let f=parseInt(this._triggerDaysBefore,10)||0;v.push(f===0?s("trigger_hint_due_date_same_day",r):K("trigger_hint_due_date","trigger_hint_due_date_one",f,r,"days"));let b=p==null?"":String(p);b&&!isNaN(Date.parse(b))&&v.push(s("trigger_hint_due_date_now",r).replace("{date}",H(b,r)))}return v.length?a`<div class="trigger-live-hint">${v.join(" ")}</div>${e}`:e}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?a`
        <ms-textfield
          label="${s("trigger_above",e)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${t=>this._triggerAbove=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("trigger_below",e)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${t=>this._triggerBelow=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("trigger_equals",e)}"
          type="number"
          step="any"
          .value=${this._triggerEquals}
          @input=${t=>this._triggerEquals=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("trigger_not_equals",e)}"
          type="number"
          step="any"
          .value=${this._triggerNotEquals}
          @input=${t=>this._triggerNotEquals=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("for_at_least_minutes",e)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
      `:this._triggerType==="counter"?a`
        <ms-textfield
          label="${s("target_value",e)}"
          type="number"
          step="any"
          .value=${this._triggerTargetValue}
          @input=${t=>this._triggerTargetValue=t.target.value}
        ></ms-textfield>
        <label>
          <input
            type="checkbox"
            .checked=${this._triggerDeltaMode}
            @change=${t=>this._triggerDeltaMode=t.target.checked}
          />
          ${s("delta_mode",e)}
        </label>
        ${this._triggerDeltaMode?a`
              <ms-textfield
                label="${s("baseline_start_value",e)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${t=>this._triggerBaselineValue=t.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?s("baseline_start_help_edit",e):s("baseline_start_help",e)}
                ${this._taskId&&this._liveBaselineValue!=null?a`<div class="baseline-effective">
                      ${s("baseline_current_effective",e).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:_}
              </div>
            `:_}
      `:this._triggerType==="state_change"?a`
        ${this._renderStateField({label:s("from_state_optional",e),value:this._triggerFromState,entityId:this._triggerEntityId,onInput:t=>this._triggerFromState=t})}
        <div class="field-help">${s("state_value_help",e)}</div>
        ${this._renderStateField({label:s("to_state_optional",e),value:this._triggerToState,entityId:this._triggerEntityId,onInput:t=>this._triggerToState=t})}
        <ms-textfield
          label="${s("target_changes",e)}"
          type="number"
          min=${ne[0]}
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ms-textfield>
        <div class="field-help">${s("target_changes_help",e)}</div>
        ${(this._triggerTargetChanges||"1")==="1"&&(this._triggerFromState||this._triggerToState)?a`<div class="field-help">${s("state_latch_help",e)}</div>`:_}
        <ms-textfield
          label="${s("for_at_least_minutes",e)}"
          type="number"
          min=${re[0]}
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
        <div class="field-help">${s("for_minutes_state_help",e)}</div>
      `:this._triggerType==="runtime"?a`
        <ms-textfield
          label="${s("runtime_hours",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${t=>this._triggerRuntimeHours=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("runtime_max_session",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeMaxSession}
          @input=${t=>this._triggerRuntimeMaxSession=t.target.value}
        ></ms-textfield>
        <div class="field-help">${s("runtime_max_session_help",e)}</div>
        ${this._renderOnStatesField({value:this._triggerOnStates,entityId:this._triggerEntityId,onInput:t=>this._triggerOnStates=t})}
        <div class="field-help">${s("runtime_on_states_help",e)}</div>
      `:this._triggerType==="due_date"?a`
        <ms-textfield
          label="${s("days_before",e)}"
          type="number"
          step="1"
          min=${I[0]}
          max=${I[1]}
          .value=${this._triggerDaysBefore}
          @input=${t=>this._triggerDaysBefore=t.target.value}
        ></ms-textfield>
        <div class="field-help">${s("days_before_help",e)}</div>
      `:_}_section(e,t,i){return a`<section class="form-section ${e}">
      <h3 class="section-title">${t}</h3>
      ${i}
    </section>`}_renderIdentity(e){return a`
          ${this._taskId===null&&this._objectChoices.length>0?a`
            <div class="select-row">
              <label>${s("object",e)}</label>
              <select
                .value=${this._entryId}
                @change=${t=>{this._entryId=t.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}}
              >
                ${this._objectChoices.map(t=>a`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
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
              ${$e.map(t=>a`<option value=${t} ?selected=${t===this._type}>${s(t,e)}</option>`)}
            </select>
          </div>
          <div class="select-row">
            <label>${s("priority",e)}</label>
            <select
              .value=${this._priority}
              @change=${t=>this._priority=t.target.value}
            >
              ${oe.map(t=>a`<option value=${t} ?selected=${t===this._priority}>${s("priority_"+t,e)}</option>`)}
            </select>
          </div>
    `}_renderScheduleSection(e){return this._section("schedule-section",s("task_section_schedule",e),a`
          <div class="select-row">
            <label>${s("schedule_type",e)}</label>
            <select
              .value=${this._scheduleType}
              @change=${t=>this._scheduleType=t.target.value}
            >
              ${Ee.map(t=>a`<option value=${t} ?selected=${t===this._scheduleType}>${s(t,e)}</option>`)}
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
                  <div class="field-help anchor-help">${s("interval_anchor_hint",e)}</div>
                </div>
              `:_}
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
              `:_}
          ${this.scheduleTimeEnabled&&_e.includes(this._scheduleType)?a`
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
            `:_}
          `:_}
          ${this._renderRecurrenceExtras()}
          ${this._renderSchedulePreview()}
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${s("last_performed_optional",e)}"
            .value=${this._lastPerformed}
            @value-changed=${t=>this._lastPerformed=t.detail.value}
          ></ms-date-field>
          <ms-textfield
            label="${s("warning_days",e)}"
            type="number"
            min=${L[0]}
            max=${L[1]}
            .value=${this._warningDays}
            @input=${t=>this._warningDays=t.target.value}
          ></ms-textfield>
          ${this._renderAdaptiveSection(e)}
    `)}_renderTriggerSection(e){return this._scheduleType!=="sensor_based"?_:this._section("trigger-section",s("task_section_trigger",e),a`
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"&&(this.environmentalFeature||this._environmentalInitial)?a`
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
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:de}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>s("environmental_entity_optional",e)}
              .computeHelper=${()=>s("environmental_entity_helper",e)}
              @value-changed=${t=>{this._environmentalEntity=(t.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(e):_}
          `:_}
    `)}_renderCompletionSection(e){return this._section("completion-section",s("task_section_completion",e),a`
          ${this._type==="reading"?a`
                <ms-textfield
                  label="${s("reading_unit_label",e)}"
                  .value=${this._readingUnit}
                  @input=${t=>this._readingUnit=t.target.value}
                ></ms-textfield>
                <div class="field-help">${s("reading_unit_help",e)}</div>
                ${this._renderReadingsEditor(e)}
              `:_}
          ${this.checklistsEnabled?a`
            <label class="field-label" for="checklist-textarea">${s("checklist_steps_optional",e)}</label>
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
          ${this._partsLoadFailed?a`<div class="field-help parts-load-failed">${s("parts_load_failed",e)}</div>`:_}
          ${this._isFleetTask?a`<div class="field-help parts-fleet-hint">${s("task_parts_fleet_hint",e)}</div>`:this.parts.length||this._foreignOwners.length?a`
                <div class="field">
                  <label>${s("consumes_parts_label",e)}</label>
                  ${this.parts.map(t=>this._renderConsumesRow(t))}
                  ${this._foreignOwners.length?a`
                        <details class="shared-pools" ?open=${this._hasForeignPick}>
                          <summary>${s("shared_parts_other_objects",e)}</summary>
                          <div class="field-help">${s("shared_parts_help",e)}</div>
                          ${this._foreignOwners.map(t=>a`
                              <div class="shared-pool-owner">${t.name}</div>
                              ${t.parts.map(i=>this._renderConsumesRow(i,t.entry_id))}
                            `)}
                        </details>
                      `:_}
                </div>
              `:_}
          <div class="field-label">${s("require_on_completion",e)}</div>
          <div class="required-completion">
            ${D.map(t=>a`
              <label class="req-option">
                <input
                  type="checkbox"
                  .checked=${this._requiredCompletion.includes(t)}
                  @change=${i=>this._toggleRequired(t,i.target.checked)}
                />
                <span>${s(B[t],e)}</span>
              </label>
            `)}
          </div>
          <ms-textfield
            label="${s("earliest_completion_days",e)}"
            helper="${s("earliest_completion_days_help",e)}"
            type="number"
            .value=${this._earliestCompletionDays}
            @input=${t=>this._earliestCompletionDays=t.target.value}
          ></ms-textfield>
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
          ${this._requireTagScan?a`<div class="field-help">${s("require_tag_scan_help",e)}</div>`:_}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._allowSkip}
              @change=${t=>this._allowSkip=!t.target.checked}
            />
            <span>${s("disallow_skip",e)}</span>
          </label>
          ${this._allowSkip?_:a`<div class="field-help">${s("disallow_skip_help",e)}</div>`}
          ${this._renderPhasesEditor(e)}
          ${this._renderCompletionActionsSection(e)}
    `)}_renderPeopleSection(e){return this._section("people-section",s("task_section_people",e),a`
          <div class="select-row">
            <label>${s("responsible_user",e)}</label>
            <select
              .value=${this._responsibleUserId||""}
              @change=${t=>{let i=t.target.value;this._responsibleUserId=i||null}}
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
                  ${le.map(t=>a`<option value=${t} ?selected=${t===this._rotationStrategy}>${s("rotation_"+t,e)}</option>`)}
                </select>
              </div>`:_}
          `:_}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._notifyEnabled}
              @change=${t=>this._notifyEnabled=!t.target.checked}
            />
            <span>${s("no_notifications",e)}</span>
          </label>
          ${this._notifyEnabled?_:a`<div class="field-help">${s("no_notifications_help",e)}</div>`}
          <ha-icon-picker
            class="notify-icon-picker"
            .hass=${this.hass}
            label="${s("notify_icon",e)}"
            .value=${this._notifyIcon}
            @value-changed=${t=>this._notifyIcon=t.detail.value||""}
          ></ha-icon-picker>
          <div class="field-help notify-icon-help">
            <ha-icon icon=${this._notifyIcon.trim()||z(this._type)}></ha-icon>
            ${s("notify_icon_hint",e).replace("{default}",z(this._type))}
          </div>
          <div class="field mirror-todo-field">
            ${this._entityPickerFallback?a`
              <ms-textfield
                label="${s("task_mirror_todo",e)}"
                placeholder="todo.family, todo.kids"
                .value=${this._mirrorTodoEntities.join(", ")}
                @input=${t=>{this._mirrorTodoEntities=t.target.value.split(",").map(i=>i.trim()).filter(Boolean)}}
              ></ms-textfield>
            `:a`
              <ha-form
                class="entity-picker-form"
                .hass=${this.hass}
                .schema=${[{name:"mirror_todo_entities",selector:{entity:{multiple:!0,domain:["todo"]}}}]}
                .data=${{mirror_todo_entities:this._mirrorTodoEntities}}
                .computeLabel=${()=>s("task_mirror_todo",e)}
                @value-changed=${t=>{let i=(t.detail.value.mirror_todo_entities||[]).filter(Boolean);this._mirrorTodoEntities=i}}
              ></ha-form>`}
            <div class="field-help">${s("task_mirror_todo_hint",e)}</div>
          </div>
    `)}_renderDetailsSection(e){return this._section("details-section",s("task_section_details",e),a`
          <ms-textfield
            label="${s("labels",e)}"
            placeholder="${s("labels_placeholder",e)}"
            helper="${s("labels_help",e)}"
            .value=${this._labels}
            @input=${t=>this._labels=t.target.value}
          ></ms-textfield>
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
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${t=>this._enabled=t.target.checked}
            />
            ${s("task_enabled",e)}
          </label>
    `)}render(){if(!this._open)return a``;let e=this._lang,t=this._taskId?s("edit_task",e):s("new_task",e);return a`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?a`<div class="error">${this._error}</div>`:_}
          ${this._warning?a`<div class="error warning">${this._warning}</div>`:_}
          ${this._renderIdentity(e)}
          ${this._renderScheduleSection(e)}
          ${this._renderTriggerSection(e)}
          ${this._renderCompletionSection(e)}
          ${this._renderPeopleSection(e)}
          ${this._renderDetailsSection(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${s("cancel",e)}</ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()||this._missingDueDate()}
          >
            ${this._loading?s("saving",e):s("save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};o._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_calMonths","_calendarEntity","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),o.styles=[J,X,G`
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
    .adaptive-section,
    .phases-section {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 8px 12px;
      margin-top: 8px;
    }
    .ca-section > summary,
    .adaptive-section > summary,
    .phases-section > summary {
      cursor: pointer;
      font-weight: 500;
    }
    .phases-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
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
    /* On a phone the name gets its own line: beside a part and its
     * quantity it was squeezed to nothing (audit 2026-10-17). */
    @media (max-width: 600px) {
      .phase-def-head {
        flex-wrap: wrap;
      }
      .phase-def-head ms-textfield {
        flex-basis: 100%;
      }
      .phase-part {
        flex: 1 1 0;
        min-width: 0;
        max-width: none;
      }
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
    .assignee-pool {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 14px;
      margin-top: 4px;
    }
    .schedule-time-toggle {
      display: flex;
      margin: 8px 0 4px;
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
    .required-completion {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 16px;
    }
  `],l([$({attribute:!1})],o.prototype,"hass",2),l([$({type:Boolean,attribute:"checklists-enabled"})],o.prototype,"checklistsEnabled",2),l([$({type:Boolean,attribute:"schedule-time-enabled"})],o.prototype,"scheduleTimeEnabled",2),l([$({type:Boolean,attribute:"completion-actions-enabled"})],o.prototype,"completionActionsEnabled",2),l([$({type:Boolean,attribute:"adaptive-feature"})],o.prototype,"adaptiveFeature",2),l([$({type:Boolean,attribute:"seasonal-feature"})],o.prototype,"seasonalFeature",2),l([$({type:Boolean,attribute:"environmental-feature"})],o.prototype,"environmentalFeature",2),l([$({type:Number,attribute:"default-warning-days"})],o.prototype,"defaultWarningDays",2),l([d()],o.prototype,"parts",2),l([d()],o.prototype,"_foreignOwners",2),l([d()],o.prototype,"_open",2),l([d()],o.prototype,"_entityPickerFallback",2),l([d()],o.prototype,"_loading",2),l([d()],o.prototype,"_error",2),l([d()],o.prototype,"_warning",2),l([d()],o.prototype,"_entryId",2),l([d()],o.prototype,"_taskId",2),l([d()],o.prototype,"_isFleetTask",2),l([d()],o.prototype,"_objectChoices",2),l([d()],o.prototype,"_name",2),l([d()],o.prototype,"_type",2),l([d()],o.prototype,"_scheduleType",2),l([d()],o.prototype,"_intervalDays",2),l([d()],o.prototype,"_intervalUnit",2),l([d()],o.prototype,"_dueDate",2),l([d()],o.prototype,"_warningDays",2),l([d()],o.prototype,"_earliestCompletionDays",2),l([d()],o.prototype,"_intervalAnchor",2),l([d()],o.prototype,"_weekdays",2),l([d()],o.prototype,"_nth",2),l([d()],o.prototype,"_nthWeekday",2),l([d()],o.prototype,"_domDay",2),l([d()],o.prototype,"_domLastDay",2),l([d()],o.prototype,"_domBusiness",2),l([d()],o.prototype,"_calOffset",2),l([d()],o.prototype,"_calMonths",2),l([d()],o.prototype,"_calendarEntity",2),l([d()],o.prototype,"_seasonMonths",2),l([d()],o.prototype,"_endsMode",2),l([d()],o.prototype,"_endsCount",2),l([d()],o.prototype,"_endsUntil",2),l([d()],o.prototype,"_schedulePreview",2),l([d()],o.prototype,"_schedulePreviewEnded",2),l([d()],o.prototype,"_notes",2),l([d()],o.prototype,"_documentationUrl",2),l([d()],o.prototype,"_customIcon",2),l([d()],o.prototype,"_notifyIcon",2),l([d()],o.prototype,"_priority",2),l([d()],o.prototype,"_labels",2),l([d()],o.prototype,"_mirrorTodoEntities",2),l([d()],o.prototype,"_enabled",2),l([d()],o.prototype,"_triggerEntityId",2),l([d()],o.prototype,"_triggerEntityIds",2),l([d()],o.prototype,"_triggerEntityLogic",2),l([d()],o.prototype,"_triggerAttribute",2),l([d()],o.prototype,"_triggerType",2),l([d()],o.prototype,"_triggerAbove",2),l([d()],o.prototype,"_triggerBelow",2),l([d()],o.prototype,"_triggerEquals",2),l([d()],o.prototype,"_triggerNotEquals",2),l([d()],o.prototype,"_triggerForMinutes",2),l([d()],o.prototype,"_triggerCombinator",2),l([d()],o.prototype,"_triggerTargetValue",2),l([d()],o.prototype,"_triggerDeltaMode",2),l([d()],o.prototype,"_triggerBaselineValue",2),l([d()],o.prototype,"_liveBaselineValue",2),l([d()],o.prototype,"_autoCompleteOnRecovery",2),l([d()],o.prototype,"_triggerFromState",2),l([d()],o.prototype,"_triggerToState",2),l([d()],o.prototype,"_triggerTargetChanges",2),l([d()],o.prototype,"_triggerRuntimeHours",2),l([d()],o.prototype,"_triggerDaysBefore",2),l([d()],o.prototype,"_triggerRuntimeMaxSession",2),l([d()],o.prototype,"_triggerOnStates",2),l([d()],o.prototype,"_compoundLogic",2),l([d()],o.prototype,"_compoundConditions",2),l([d()],o.prototype,"_suggestedAttributes",2),l([d()],o.prototype,"_availableAttributes",2),l([d()],o.prototype,"_entityDomain",2),l([d()],o.prototype,"_lastPerformed",2),l([d()],o.prototype,"_nfcTagId",2),l([d()],o.prototype,"_requireTagScan",2),l([d()],o.prototype,"_allowSkip",2),l([d()],o.prototype,"_notifyEnabled",2),l([d()],o.prototype,"_readingUnit",2),l([d()],o.prototype,"_readings",2),l([d()],o.prototype,"_consumesParts",2),l([d()],o.prototype,"_consumesQtyText",2),l([d()],o.prototype,"_partsLoadFailed",2),l([d()],o.prototype,"_availableTags",2),l([d()],o.prototype,"_responsibleUserId",2),l([d()],o.prototype,"_assigneePool",2),l([d()],o.prototype,"_rotationStrategy",2),l([d()],o.prototype,"_availableUsers",2),l([d()],o.prototype,"_checklistText",2),l([d()],o.prototype,"_phaseDefs",2),l([d()],o.prototype,"_phaseSeq",2),l([d()],o.prototype,"_requiredCompletion",2),l([d()],o.prototype,"_scheduleTime",2),l([d()],o.prototype,"_scheduleTimeOn",2),l([d()],o.prototype,"_actionService",2),l([d()],o.prototype,"_actionTargetEntity",2),l([d()],o.prototype,"_actionSkipAuto",2),l([d()],o.prototype,"_actionPresent",2),l([d()],o.prototype,"_actionData",2),l([d()],o.prototype,"_actionDataJsonFallback",2),l([d()],o.prototype,"_actionTesting",2),l([d()],o.prototype,"_actionTestResult",2),l([d()],o.prototype,"_actionTestError",2),l([d()],o.prototype,"_qcNotes",2),l([d()],o.prototype,"_qcCost",2),l([d()],o.prototype,"_qcDuration",2),l([d()],o.prototype,"_qcFeedback",2),l([d()],o.prototype,"_environmentalEntity",2),l([d()],o.prototype,"_environmentalAttribute",2),l([d()],o.prototype,"_adaptiveEnabled",2),l([d()],o.prototype,"_adaptiveAlpha",2),l([d()],o.prototype,"_adaptiveMin",2),l([d()],o.prototype,"_adaptiveMax",2),l([d()],o.prototype,"_adaptiveSeasonal",2),l([d()],o.prototype,"_adaptivePrediction",2),l([d()],o.prototype,"_conditionAttrOptions",2);var V=o;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",V);export{P as a,he as b,Ae as c,qe as d,me as e,ve as f,V as g};
