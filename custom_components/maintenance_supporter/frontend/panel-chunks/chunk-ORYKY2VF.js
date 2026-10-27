/*! maintenance_supporter frontend 2.111.0 */
import{a as le,c as de}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-MSZ535UK.js";import{a as U,d as te,e as ie,j as se,k as re,l as j,m as L,n as P}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-HQZAC22F.js";import{a as ee}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ONTTMC2O.js";import{f as ne}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BK5NTWV5.js";import{d as ae,e as oe,f as k,g as I,h as q,i as D,j as B}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-VWNNSHNQ.js";import{a as A}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-CN7O3LN2.js";import{$ as J,N as Y,O,T as H,_ as M,a as l,b as G,c as a,f as c,fa as X,ga as Z,h as Q,m as $,n as d,v as K,w as i}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-T6Y2H22O.js";var W=["sensor","binary_sensor","number","input_number","input_boolean","counter","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock","plant","input_select","select","input_datetime","date","datetime","timer","update"],he=["sensor"];var be={cleaning:"mdi:broom",inspection:"mdi:magnify",replacement:"mdi:swap-horizontal",calibration:"mdi:tune",service:"mdi:wrench",reading:"mdi:counter",custom:"mdi:wrench-clock"},$e="mdi:wrench-clock",z=_=>_&&be[_]||$e;function N(_){return _?Array.isArray(_.entity_ids)&&_.entity_ids.length>0?[..._.entity_ids]:_.entity_id?[_.entity_id]:[]:[]}function _e(_){if(!(!_||_.type==="compound"))return N(_)[0]}function Pe(_){if(!_)return!1;let g=_.type||"threshold";return g==="counter"||g==="state_change"}function Ne(_,g){return`${_}:${g?"counter":"level"}`}var Ee=["cleaning","inspection","replacement","calibration","service","reading","custom"],xe=["time_based","weekdays","nth_weekday","day_of_month","calendar","sensor_based","one_time","manual"],F=["weekdays","nth_weekday","day_of_month","calendar"],ce=["time_based","one_time",...F],me=["threshold","counter","state_change","runtime","due_date"],pe=(_,g)=>i(_==="due_date"?"trigger_type_due_date":_,g),Te=[...me,"compound"],E={alpha:"0.3",min:"7",max:"365"},T=B;function ue(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",daysBefore:"0",carry:{}}}var we=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states","trigger_days_before"]);function ve(_){return{type:_.type||"threshold",attribute:_.attribute||"",above:_.trigger_above?.toString()??"",below:_.trigger_below?.toString()??"",equals:_.trigger_equals?.toString()??"",notEquals:_.trigger_not_equals?.toString()??"",forMinutes:_.trigger_for_minutes?.toString()??"0",targetValue:_.trigger_target_value?.toString()??"",deltaMode:_.trigger_delta_mode||!1,fromState:_.trigger_from_state||"",toState:_.trigger_to_state||"",targetChanges:_.trigger_target_changes?.toString()??"",runtimeHours:_.trigger_runtime_hours?.toString()??"",onStates:(_.trigger_on_states||[]).join(", "),daysBefore:_.trigger_days_before?.toString()??"0"}}function fe(_,g){g.attribute&&(_.attribute=g.attribute);let e=parseInt(g.forMinutes,10);if(g.type==="threshold"){let t=parseFloat(g.above);isNaN(t)||(_.trigger_above=t);let s=parseFloat(g.below);isNaN(s)||(_.trigger_below=s);let r=parseFloat(g.equals);isNaN(r)||(_.trigger_equals=r);let n=parseFloat(g.notEquals);isNaN(n)||(_.trigger_not_equals=n),isNaN(e)||(_.trigger_for_minutes=e)}else if(g.type==="counter"){let t=parseFloat(g.targetValue);isNaN(t)||(_.trigger_target_value=t),_.trigger_delta_mode=g.deltaMode}else if(g.type==="state_change"){g.fromState&&(_.trigger_from_state=g.fromState),g.toState&&(_.trigger_to_state=g.toState);let t=parseInt(g.targetChanges,10);isNaN(t)||(_.trigger_target_changes=t),isNaN(e)||(_.trigger_for_minutes=e)}else if(g.type==="runtime"){let t=parseFloat(g.runtimeHours);isNaN(t)||(_.trigger_runtime_hours=t);let s=(g.onStates||"").split(",").map(r=>r.trim()).filter(Boolean);s.length>0&&(_.trigger_on_states=s)}else if(g.type==="due_date"){let t=parseInt(g.daysBefore,10);_.trigger_days_before=isNaN(t)?0:t}}function Se(_){return{entityIds:N(_).join(", "),...ve(_),carry:Object.fromEntries(Object.entries(_).filter(([e])=>!we.has(e)&&!e.startsWith("_")))}}function ke(_){let g=_.entityIds.split(",").map(t=>t.trim()).filter(Boolean);if(g.length===0)return null;let e={..._.carry||{},entity_id:g[0],entity_ids:g,type:_.type};return fe(e,_),e}function Ie(_){return Array.from({length:7},(g,e)=>M(e,_,"short"))}function ge(_){return Array.from({length:12},(g,e)=>J(e,_,"short"))}function qe(_){let g=Array.isArray(_)?_.filter(e=>e!=null&&e!=="").join(", "):_!==null&&typeof _=="object"||_==null?"":String(_);return g.length>40?`${g.slice(0,39)}\u2026`:g}var o=class o extends Q{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.adaptiveFeature=!1;this.seasonalFeature=!1;this.environmentalFeature=!1;this.defaultWarningDays=7;this.mirrorTodoDefault=[];this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._warning="";this._entryId="";this._taskId=null;this._series=[];this._seriesIndex=0;this._isFleetTask=!1;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._calMonths=[];this._hadCalMonths=!1;this._calendarEntity="";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._notifyIcon="";this._priority="normal";this._labels="";this._detailsOpen=!1;this._mirrorTodoEntities=[];this._mirrorTodoMode="default";this._completeWhenEntity="";this._completeWhenState="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._holdUntilDone=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerDaysBefore="0";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._triggerDetailAttribute="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._notifyEnabled=!0;this._readingUnit="";this._readings=[];this._consumesParts={};this._consumesQtyText={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._loadedLastPerformed="";this._loadedResponsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._scheduleTimeOn=!1;this._actionService="";this._actionTargetEntity="";this._actionTargetStored=null;this._actionTargetInitial="";this._actionSkipAuto=!1;this._actionPresent=!1;this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._quickOn=!1;this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=E.alpha;this._adaptiveMin=E.min;this._adaptiveMax=E.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._adaptiveWasEnabled=!1;this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set;this._attrSeq=0}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return K(this.hass)}async openCreate(e,t){this._series=[],this._entryId=e,this._taskId=null,this._isFleetTask=!1,this._error="",this._warning="";let s=(t||[]).filter(r=>!r.object.archived&&!r.object.archived_at);!e&&s.length>0?(this._objectChoices=s.map(r=>({entry_id:r.entry_id,name:r.object.name})).sort((r,n)=>r.name.localeCompare(n.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(e,t){this._series=[],await this._edit(e,t)}async openEditSeries(e){e.length!==0&&(this._series=e,await this._editSeriesItem(0))}async _editSeriesItem(e){let t=this._series[e];this._seriesIndex=e,await this._edit(t.entryId,t.task),await this.updateComplete,this.shadowRoot?.querySelector(".dialog-title")?.scrollIntoView({block:"start"})}_skipSeriesItem(){this._editSeriesItem(this._seriesIndex+1)}async _edit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._warning="",this._objectChoices=[],this._isFleetTask=t.battery_fleet_task===!0,this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let s=t.schedule;this._weekdays=s?.kind==="weekdays"?[...s.weekdays??[]]:[],this._nth=s?.kind==="nth_weekday"?String(s.nth??1):"1",this._nthWeekday=s?.kind==="nth_weekday"?String(s.weekday??5):"5",this._domDay=s?.kind==="day_of_month"&&(s.day??1)>=1?String(s.day??1):"1",this._domLastDay=s?.kind==="day_of_month"&&s.day===-1,this._domBusiness=s?.kind==="day_of_month"&&s.business===!0,this._calMonths=(s?.kind==="day_of_month"||s?.kind==="nth_weekday")&&Array.isArray(s.months)?[...s.months]:[],this._hadCalMonths=this._calMonths.length>0,this._calendarEntity=s?.kind==="calendar"&&s.entity_id||"",this._calOffset=s?.offset?String(s.offset):"0",this._seasonMonths=Array.isArray(s?.season_months)?[...s.season_months]:[];let r=s?.ends;r&&typeof r.count=="number"?(this._endsMode="count",this._endsCount=String(r.count),this._endsUntil=""):r&&typeof r.until=="string"?(this._endsMode="until",this._endsUntil=r.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=t.warning_days.toString(),this._earliestCompletionDays=t.earliest_completion_days!=null?String(t.earliest_completion_days):"",this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._notifyIcon=t.notify_icon||"",this._priority=t.priority||"normal",this._labels=(t.labels||[]).join(", "),this._mirrorTodoEntities=[...t.mirror_todo_entities||[]],this._mirrorTodoMode=this._mirrorTodoEntities.length?"own":t.mirror_todo_use_default===!1?"none":"default",this._completeWhenEntity=t.complete_when?.entity_id||"",this._completeWhenState=t.complete_when?.to_state||"",this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._loadedLastPerformed=this._lastPerformed,this._nfcTagId=t.nfc_tag_id||"",this._requireTagScan=!!t.require_tag_scan,this._allowSkip=t.allow_skip!==!1,this._notifyEnabled=t.notify_enabled!==!1,this._readingUnit=t.reading_unit||"",this._readings=(t.readings||[]).map(p=>({...p})),this._consumesParts=Object.fromEntries((t.consumes_parts||[]).map(p=>[U(p),{...p}])),this._consumesQtyText={},this._responsibleUserId=t.responsible_user_id||null,this._loadedResponsibleUserId=this._responsibleUserId,this._assigneePool=[...t.assignee_pool||[]],this._rotationStrategy=t.rotation_strategy||"",this._checklistText=(t.checklist||[]).join(`
`),this._phaseDefs=Object.entries(t.phases||{}).map(([p,m])=>{let{name:v,checklist:f,consumes_parts:y,required_completion_fields:b,...w}=m,x=m.consumes_parts||[],S=x.findIndex(C=>!C.entry_id),R=S>=0?x[S]:void 0;return{id:p,name:m.name||p,checklistText:(m.checklist||[]).join(`
`),partId:R?.part_id||"",partQty:R?.quantity!=null?String(R.quantity):"",reqOverride:m.required_completion_fields!==void 0,reqFields:[...m.required_completion_fields||[]],extraParts:x.filter((C,ye)=>ye!==S).map(C=>({...C})),carry:w}}),this._phaseSeq=[...t.phase_sequence||[]],this._requiredCompletion=[...t.required_completion_fields||[]],this._scheduleTime=t.schedule_time||"",this._scheduleTimeOn=!!t.schedule_time;let n=t.on_complete_action;if(n&&n.service){this._actionService=n.service;let p=n.target?.entity_id;this._actionTargetEntity=Array.isArray(p)?p[0]||"":p||"",this._actionTargetStored=n.target&&typeof n.target=="object"?JSON.parse(JSON.stringify(n.target)):null,this._actionTargetInitial=this._actionTargetEntity,this._actionData=n.data&&typeof n.data=="object"?{...n.data}:{},this._actionDataJsonFallback="",this._actionSkipAuto=n.skip_auto===!0,this._actionPresent=!0}else this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1;let h=t.quick_complete_defaults;this._quickOn=ee(t),this._qcNotes=h?.notes||"",this._qcCost=h?.cost!=null?String(h.cost):"",this._qcDuration=h?.duration!=null?String(h.duration):"",this._qcFeedback=h?.feedback||"";let u=t.adaptive_config||{};if(this._environmentalEntity=u.environmental_entity||"",this._environmentalAttribute=u.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!u.enabled,this._adaptiveAlpha=u.ewa_alpha?.toString()??E.alpha,this._adaptiveMin=u.min_interval_days?.toString()??E.min,this._adaptiveMax=u.max_interval_days?.toString()??E.max,this._adaptiveSeasonal=u.seasonal_enabled!==!1,this._adaptivePrediction=u.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=this._adaptiveEnabled,t.trigger_config){let p=t.trigger_config;this._triggerEntityId=_e(p)||"",this._triggerEntityIds=N(p),this._triggerEntityLogic=p.entity_logic||"any",this._setTypeFields(ve(p)),this._triggerCombinator=p.trigger_combinator==="all"?"all":"any",this._triggerBaselineValue=p.trigger_baseline_value?.toString()||"",this._liveBaselineValue=t.trigger_baseline_value??null,this._autoCompleteOnRecovery=p.auto_complete_on_recovery||!1,this._holdUntilDone=p.trigger_hold_until_done===!0,this._triggerRuntimeMaxSession=p.trigger_runtime_max_session_seconds?.toString()||"",this._triggerDetailAttribute=p.detail_attribute||"",p.type==="compound"?(this._compoundLogic=p.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(p.conditions||[]).map(Se)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),this._detailsOpen=this._priority!=="normal"||!!this._labels.trim()||!!this._documentationUrl.trim()||!!this._customIcon,await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._detailsOpen=!1,this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._calMonths=[],this._hadCalMonths=!1,this._calendarEntity="",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._notifyIcon="",this._priority="normal",this._labels="",this._mirrorTodoEntities=[],this._mirrorTodoMode="default",this._completeWhenEntity="",this._completeWhenState="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._notifyEnabled=!0,this._readingUnit="",this._readings=[],this._consumesParts={},this._consumesQtyText={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._scheduleTimeOn=!1,this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=E.alpha,this._adaptiveMin=E.min,this._adaptiveMax=E.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=!1,this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1,this._actionTesting=!1,this._actionTestResult="",this._actionTestError="",this._quickOn=!1,this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_typeFields(){return{type:this._triggerType,attribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,equals:this._triggerEquals,notEquals:this._triggerNotEquals,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,onStates:this._triggerOnStates,daysBefore:this._triggerDaysBefore}}_setTypeFields(e){this._triggerType=e.type,this._triggerAttribute=e.attribute,this._triggerAbove=e.above,this._triggerBelow=e.below,this._triggerEquals=e.equals,this._triggerNotEquals=e.notEquals,this._triggerForMinutes=e.forMinutes,this._triggerTargetValue=e.targetValue,this._triggerDeltaMode=e.deltaMode,this._triggerFromState=e.fromState,this._triggerToState=e.toState,this._triggerTargetChanges=e.targetChanges,this._triggerRuntimeHours=e.runtimeHours,this._triggerOnStates=e.onStates,this._triggerDaysBefore=e.daysBefore}_resetTriggerFields(){++this._attrSeq,this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._setTypeFields(ue()),this._triggerCombinator="any",this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._holdUntilDone=!1,this._triggerRuntimeMaxSession="",this._triggerDetailAttribute="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new ne(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}_toggleAssignee(e){this._assigneePool=this._assigneePool.includes(e)?this._assigneePool.filter(t=>t!==e):[...this._assigneePool,e]}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError=i("action_test_bad_format",this._lang),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,s]=e.split(".");if(!this.hass?.services?.[t]?.[s]){this._actionTestResult="error",this._actionTestError=i("action_test_unknown_service",this._lang).replace("{service}",e),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let r=this._actionTargetEntity.trim();if(r){let n=r.split(".")[0];if(n!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=i("action_test_domain_mismatch",this._lang).replace("{service}",e).replace("{domain}",t).replace("{entity}",r).replace("{entity_domain}",n).replace("{suggestion}",`${n}.${s}`),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[r]){this._actionTestResult="error",this._actionTestError=i("action_test_entity_missing",this._lang).replace("{entity}",r),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,s]=e.split("."),r=this.hass?.services?.[t]?.[s]?.fields;return!r||Object.keys(r).length===0?null:Object.entries(r).map(([n,h])=>({name:n,required:!!h.required,selector:h.selector||{text:{}}}))}_actionTargetExtended(){let e=this._actionTargetStored;return e?Object.entries(e).some(([t,s])=>t==="entity_id"?Array.isArray(s)&&s.length>1:Array.isArray(s)?s.length>0:!!s):!1}_actionTargetSummary(){let e=this._actionTargetStored||{},t=r=>(Array.isArray(r)?r:[r]).filter(n=>typeof n=="string"&&!!n),s=this.hass;return[...t(e.entity_id).map(r=>s.states?.[r]?.attributes?.friendly_name||r),...t(e.device_id).map(r=>s.devices?.[r]?.name_by_user||s.devices?.[r]?.name||r),...t(e.area_id).map(r=>s.areas?.[r]?.name||r),...t(e.floor_id).map(r=>s.floors?.[r]?.name||r),...t(e.label_id)].join(", ")}_renderQuickComplete(e){let t={notes:!!this._qcNotes.trim(),cost:!isNaN(parseFloat(this._qcCost)),duration:j(this._qcDuration)!==null,photo:!1,user:!0},s=this._requiredCompletion.filter(n=>!t[n]),r=!!this._checklistText.trim()||this._readings.length>0;return a`
      <label class="req-option quick-complete-switch">
        <input type="checkbox" .checked=${this._quickOn}
          @change=${n=>this._quickOn=n.target.checked} />
        <span>${i("quick_complete_label",e)}</span>
      </label>
      ${this._quickOn?a`
            <div class="field-help">${i("quick_complete_help",e)}</div>
            ${s.length?a`<div class="field-help quick-complete-note">${i("quick_complete_needs_dialog",e).replace("{fields}",s.map(n=>i(P[n],e)).join(", "))}</div>`:c}
            ${this._requireTagScan?a`<div class="field-help quick-complete-note">${i("quick_complete_tag_hint",e)}</div>`:c}
            ${r?a`<div class="field-help">${i("quick_complete_not_asked",e)}</div>`:c}
            <details class="ca-section quick-complete-values" ?open=${Object.values(t).slice(0,3).some(Boolean)||!!this._qcFeedback}>
              <summary>${i("quick_complete_values",e)}</summary>
              <p class="field-help">${i("quick_complete_values_help",e)}</p>
              <ms-textfield
                label="${i("quick_complete_defaults_notes",e)}"
                .value=${this._qcNotes}
                @input=${n=>{this._qcNotes=n.target.value}}
              ></ms-textfield>
              <div class="qc-cost">
                <span class="qc-cost-label">${i("quick_complete_defaults_cost",e)}</span>
                <ms-cost-input .lang=${e} .value=${this._qcCost}
                  @value-changed=${n=>{this._qcCost=n.detail.value}}></ms-cost-input>
              </div>
              <ms-textfield
                label="${i("quick_complete_defaults_duration",e)}"
                type="number" min="0" step="1"
                .value=${this._qcDuration}
                @input=${n=>{this._qcDuration=n.target.value}}
              ></ms-textfield>
              <select class="qc-feedback" aria-label=${i("was_maintenance_needed",e)}
                .value=${this._qcFeedback}
                @change=${n=>{this._qcFeedback=n.target.value}}>
                <option value="">${i("quick_complete_defaults_feedback_none",e)}</option>
                <option value="needed">${i("quick_complete_defaults_feedback_needed",e)}</option>
                <option value="not_needed">${i("quick_complete_defaults_feedback_not_needed",e)}</option>
                <option value="not_sure">${i("feedback_not_sure",e)}</option>
              </select>
            </details>
          `:c}
    `}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled&&!this._actionPresent)return c;let t=this._serviceSchema();return a`
      <details class="ca-section">
        <summary>${i("on_complete_action_title",e)}</summary>
        <p class="field-help">${i("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${s=>{this._actionService=s.detail.value||"";let r=this._serviceSchema();if(r){let n=new Set(r.map(h=>h.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([h])=>n.has(h)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>i("on_complete_action_target",e)}
          @value-changed=${s=>{let r=s.detail.value;this._actionTargetEntity=r.target_entity||""}}
        ></ha-form>
        ${this._actionTargetExtended()&&this._actionTargetEntity.trim()===this._actionTargetInitial?a`<p class="field-help ca-target-more">${i("on_complete_action_target_more",e).replace("{targets}",this._actionTargetSummary())}</p>`:c}
        <p class="field-help ca-domain-hint">
          ${i("on_complete_action_target_hint",e)}
        </p>
        <label class="ca-skip-auto">
          <input type="checkbox" .checked=${this._actionSkipAuto}
            @change=${s=>{this._actionSkipAuto=s.target.checked}} />
          <span>${i("on_complete_action_skip_auto",e)}</span>
        </label>
        ${t?a`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${t}
                .data=${this._actionData}
                @value-changed=${s=>{this._actionData={...s.detail.value}}}
              ></ha-form>
            `:a`
              <ms-textfield
                label="${i("on_complete_action_data",e)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${s=>{this._actionDataJsonFallback=s.target.value}}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting||!this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting?"\u2026":i("on_complete_action_test",e)}
          </button>
          ${this._actionTestResult==="ok"?a`<span class="ca-test-ok">${i("on_complete_action_test_success",e)}</span>`:c}
          ${this._actionTestResult==="error"?a`<div class="ca-test-error-block">
                <span class="ca-test-error">${i("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?a`<div class="ca-test-error-detail">${this._actionTestError}</div>`:c}
              </div>`:c}
        </div>
      </details>

    `}async _loadParts(){this.parts=[];let e=this._entryId;if(e)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e});if(e!==this._entryId)return;this.parts=t.parts||[],this._partsLoadFailed=!1}catch{if(e!==this._entryId)return;this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){this._foreignOwners=[];let e=this._entryId;if(e)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});if(e!==this._entryId)return;this._foreignOwners=(t.objects||[]).filter(s=>s.entry_id!==e&&(s.parts||[]).length>0).map(s=>({entry_id:s.entry_id,name:s.object?.name||s.entry_id,parts:s.parts||[]})).sort((s,r)=>s.name.localeCompare(r.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(e){!e||!this.hass||this._conditionAttrOptions[e]||this._conditionAttrPending.has(e)||(this._conditionAttrPending.add(e),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e}).then(t=>{let s=t;this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:s.suggested_attributes||[],available:s.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(e){let t=++this._attrSeq;if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let s=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});if(t!==this._attrSeq)return;this._entityDomain=s.domain||"",this._suggestedAttributes=s.suggested_attributes||[],this._availableAttributes=s.available_attributes||[]}catch{if(t!==this._attrSeq)return;this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(e=>!!e.entry_id)}_renderConsumesRow(e,t){let s=U({part_id:e.id,entry_id:t}),r=this._consumesParts[s],n=t?{part_id:e.id,quantity:1,entry_id:t}:{part_id:e.id,quantity:1};return a`
      <div class="consumes-row">
        <label class="consumes-check">
          <input
            type="checkbox"
            .checked=${r!==void 0}
            @change=${h=>{let u={...this._consumesParts};if(h.target.checked)u[s]=u[s]||n;else{delete u[s];let p={...this._consumesQtyText};delete p[s],this._consumesQtyText=p}this._consumesParts=u}}
          />
          <span>${e.name}${e.unit?` (${e.unit})`:""}</span>
        </label>
        ${r!==void 0?a`<input
              class="consumes-qty"
              aria-label=${`${e.name}: ${i("quantity",this._lang)}`}
              type="number"
              min=${T[0]}
              max=${T[1]}
              step="0.01"
              .value=${this._consumesQtyText[s]??String(r.quantity)}
              @input=${h=>{let u=h.target.value;this._consumesQtyText={...this._consumesQtyText,[s]:u};let p=parseFloat(u.replace(",","."));Number.isFinite(p)&&p>=T[0]&&(this._consumesParts={...this._consumesParts,[s]:{...n,quantity:p}})}}
            />`:c}
      </div>
    `}_applyConsumesQtyText(){let e={...this._consumesParts};for(let t of Object.keys(e)){let s=this._consumesQtyText[t];if(s===void 0)continue;let r=parseFloat(s.replace(",","."));if(!Number.isFinite(r)||r<T[0]||r>T[1]){let n=h=>O(h,this._lang,{maximumFractionDigits:2});return this._error=i("settings_value_out_of_range",this._lang).replace("{min}",n(T[0])).replace("{max}",n(T[1])),!1}e[t]={...e[t],quantity:r}}return this._consumesParts=e,!0}_toggleRequired(e,t){let s=new Set(this._requiredCompletion);t?s.add(e):s.delete(e),this._requiredCompletion=[...s]}_patchReading(e,t){this._readings=this._readings.map(s=>s.id===e?{...s,...t}:s)}_renderReadingsEditor(e){let t=se(this._readings);return a`
      <div class="readings-editor">
        <div class="field-label">${i("readings_section",e)}</div>
        <div class="field-help">${i("readings_hint",e)}</div>
        ${this._readings.map(s=>a`
          ${t.has(s.id)?a`<div class="field-help reading-dup">${i("reading_duplicate_name",e)}</div>`:c}
          <div class="reading-row">
            <ms-textfield
              class="reading-name"
              label="${i("reading_name_label",e)}"
              .value=${s.name}
              @input=${r=>this._patchReading(s.id,{name:r.target.value})}
            ></ms-textfield>
            <ms-textfield
              class="reading-unit"
              label="${i("reading_unit_short",e)}"
              .value=${s.unit||""}
              @input=${r=>this._patchReading(s.id,{unit:r.target.value})}
            ></ms-textfield>
            <ha-icon-button class="phase-remove reading-remove" .label=${i("remove",e)} @click=${()=>this._readings=this._readings.filter(r=>r.id!==s.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
        `)}
        ${this._readings.length<te?a`
          <ha-button appearance="plain" class="reading-add"
            @click=${()=>this._readings=[...this._readings,{id:ie(),name:"",unit:this._readings.length?this._readings[this._readings.length-1].unit:this._readingUnit}]}>
            <ha-icon icon="mdi:plus"></ha-icon> ${i("reading_add",e)}
          </ha-button>`:c}
      </div>
    `}_phaseSlug(e){let t=e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",s=t,r=2;for(;this._phaseDefs.some(n=>n.id===s);)s=`${t}-${r++}`;return s}_addPhaseDef(){let e=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:e,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(e){this._phaseDefs=this._phaseDefs.filter(t=>t.id!==e),this._phaseSeq=this._phaseSeq.filter(t=>t!==e)}_patchPhaseDef(e,t){this._phaseDefs=this._phaseDefs.map(s=>s.id===e?{...s,...t}:s)}_renderPhasesEditor(e){let t=s=>this._phaseDefs.find(r=>r.id===s)?.name||s;return a`
      <details class="phases-section" ?open=${this._phaseDefs.length>0}>
      <summary>${i("phases_section",e)}</summary>
      <div class="field-help">${i("phases_hint",e)}</div>
      ${this._phaseDefs.map(s=>a`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${i("phase_name",e)}"
              .value=${s.name}
              @input=${r=>this._patchPhaseDef(s.id,{name:r.target.value})}
            ></ms-textfield>
            ${this.parts.length?a`
              <select
                class="phase-part"
                aria-label=${i("spare_part",e)}
                .value=${s.partId}
                @change=${r=>{let n=r.target.value;this._patchPhaseDef(s.id,s.partQty?{partId:n}:{partId:n,partQty:"1"})}}
              >
                <option value="">—</option>
                ${this.parts.map(r=>a`<option value=${r.id} ?selected=${r.id===s.partId}>${r.name}</option>`)}
              </select>
              ${s.partId?a`
                <!-- The typed text as-is: a "|| '1'" here rewrote a cleared
                     field to 1 and the next digit gave "13" (bug audit
                     2026-09-26 #2); an empty field saves as 1. -->
                <input class="phase-qty" aria-label=${i("quantity",e)} type="number" min=${B[0]} step="0.01" placeholder="1" .value=${s.partQty}
                  @input=${r=>this._patchPhaseDef(s.id,{partQty:r.target.value})} />
              `:c}
            `:c}
            <ha-icon-button class="phase-remove" .label=${i("remove",e)} @click=${()=>this._removePhaseDef(s.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
          ${this.checklistsEnabled?a`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${i("checklist_placeholder",e)}"
              .value=${s.checklistText}
              @input=${r=>this._patchPhaseDef(s.id,{checklistText:r.target.value})}
            ></textarea>
          `:c}
          <label class="req-option phase-req-toggle">
            <input
              type="checkbox"
              .checked=${s.reqOverride}
              @change=${r=>this._patchPhaseDef(s.id,{reqOverride:r.target.checked})}
            />
            <span>${i("phase_require_override",e)}</span>
          </label>
          ${s.reqOverride?a`
            <div class="required-completion phase-req-fields">
              ${L.map(r=>a`
                <label class="req-option">
                  <input
                    type="checkbox"
                    .checked=${s.reqFields.includes(r)}
                    @change=${n=>{let h=n.target.checked,u=new Set(s.reqFields);h?u.add(r):u.delete(r),this._patchPhaseDef(s.id,{reqFields:[...u]})}}
                  />
                  <span>${i(P[r],e)}</span>
                </label>
              `)}
            </div>
          `:c}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${i("phase_add",e)}
      </ha-button>
      ${this._phaseDefs.some(s=>s.name.trim())?a`
        <div class="phase-seq-label">${i("phase_sequence_label",e)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((s,r)=>a`
            <span class="phase-chip">
              ${r+1}. ${t(s)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((n,h)=>h!==r)}}>✕</button>
            </span>
          `)}
          <select
            class="phase-seq-add"
            aria-label=${i("phase_sequence_add_step",e)}
            .value=${""}
            @change=${s=>{let r=s.target.value;r&&(this._phaseSeq=[...this._phaseSeq,r]),s.target.value=""}}
          >
            <option value="">+ ${i("phase_sequence_add_step",e)}</option>
            ${this._phaseDefs.filter(s=>s.name.trim()).map(s=>a`<option value=${s.id}>${s.name}</option>`)}
          </select>
        </div>
      `:c}
      </details>
    `}async _save(){if(this._loading||!this._name.trim()||this._missingDueDate())return;if(this._adaptiveSnapshot()!==this._adaptiveInitial){let t=parseInt(this._adaptiveMin,10),s=parseInt(this._adaptiveMax,10);if(!isNaN(t)&&!isNaN(s)&&t>s){this._error=`${i("adaptive_min_interval",this._lang)} > ${i("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=i("trigger_hint_overlap",this._lang);return}if(this._scheduleType==="calendar"&&!this._calendarEntity.trim().startsWith("calendar.")){this._error=i("calendar_entity_required",this._lang);return}if(!this._applyConsumesQtyText())return;this._loading=!0,this._error="";let e;try{let t=await A(this,()=>this.hass.connection.sendMessagePromise(this._savePayload()),{fallbackKey:"save_error",onError:h=>{this._error=h}});if(t===void 0)return;let s=this._taskId||t?.task_id,r=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;this._warning="";let n=h=>{this._warning=i("subsave_warning",this._lang).replace("{detail}",h)};if(s&&this._scheduleType==="sensor_based"&&r&&await A(this,{type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:s,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null},{onError:n})!==void 0&&(this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute),s&&this._adaptiveSnapshot()!==this._adaptiveInitial){let h=parseFloat(this._adaptiveAlpha),u=parseInt(this._adaptiveMin,10),p=parseInt(this._adaptiveMax,10);await A(this,{type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:s,enabled:this._adaptiveEnabled,...h>=q[0]&&h<=q[1]?{ewa_alpha:h}:{},...!isNaN(u)&&u>=1?{min_interval_days:u}:{},...!isNaN(p)&&p>=1?{max_interval_days:p}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction},{onError:n})!==void 0&&(this._adaptiveInitial=this._adaptiveSnapshot())}this._warning?s&&(this._taskId=s):this._seriesIndex+1<this._series.length?e=this._seriesIndex+1:(this._open=!1,this._series=[]),this.dispatchEvent(new CustomEvent("task-saved"))}finally{this._loading=!1}e!==void 0&&await this._editSeriesItem(e)}_missingDueDate(){return this._scheduleType==="one_time"&&!this._dueDate}_savePayload(){let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},t=this._earliestCompletionDays.trim();e.earliest_completion_days=t===""?null:Math.max(0,parseInt(t,10)||0),this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):F.includes(this._scheduleType)?(e.schedule={...this._buildSchedule(),...this._recurrenceExtras()},e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(e.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.notify_icon=this._notifyIcon.trim()||null,e.priority=this._priority,e.labels=this._labels.split(",").map(r=>r.trim()).filter(Boolean);let s=this.mirrorTodoDefault.length&&this._mirrorTodoMode!=="own"?[]:this._mirrorTodoEntities.filter(Boolean);e.mirror_todo_entities=s,e.mirror_todo_use_default=this.mirrorTodoDefault.length?this._mirrorTodoMode==="default":this._mirrorTodoMode!=="none",e.enabled=this._enabled,(!this._taskId||this._lastPerformed!==this._loadedLastPerformed)&&(e.last_performed=this._lastPerformed||null),e.nfc_tag_id=this._nfcTagId||null,e.require_tag_scan=this._requireTagScan,e.allow_skip=this._allowSkip,e.complete_when=this._completeWhenEntity&&this._completeWhenState.trim()?{entity_id:this._completeWhenEntity,to_state:this._completeWhenState.trim()}:null,e.notify_enabled=this._notifyEnabled,e.reading_unit=this._readingUnit.trim()||null,e.readings=re(this._readings);{let r={};for(let h of this._phaseDefs){if(!h.name.trim())continue;let u={...h.carry,name:h.name.trim()},p=h.checklistText.split(`
`).map(v=>v.trim()).filter(Boolean);p.length&&(u.checklist=p);let m=[];if(h.partId){let v=parseFloat(h.partQty);m.push({part_id:h.partId,quantity:Number.isFinite(v)&&v>0?v:1})}for(let v of h.extraParts)m.push(v.entry_id?{part_id:v.part_id,quantity:v.quantity,entry_id:v.entry_id}:{part_id:v.part_id,quantity:v.quantity});m.length&&(u.consumes_parts=m),h.reqOverride&&(u.required_completion_fields=[...h.reqFields]),r[h.id]=u}let n=this._phaseSeq.filter(h=>h in r);e.phases=Object.keys(r).length&&n.length?r:null,e.phase_sequence=e.phases?n:null}if((this.parts.length||this._foreignOwners.length)&&(e.consumes_parts=Object.values(this._consumesParts).map(r=>r.entry_id?{part_id:r.part_id,quantity:r.quantity,entry_id:r.entry_id}:{part_id:r.part_id,quantity:r.quantity})),(!this._taskId||this._responsibleUserId!==this._loadedResponsibleUserId)&&(e.responsible_user_id=this._responsibleUserId),e.assignee_pool=this._assigneePool,e.required_completion_fields=this._requiredCompletion,e.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let r=this._compoundConditions.map(ke).filter(n=>n!==null);if(r.length>0){let n={type:"compound",compound_logic:this._compoundLogic,conditions:r};this._autoCompleteOnRecovery&&(n.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(n.trigger_combinator="all"),this._triggerDetailAttribute&&(n.detail_attribute=this._triggerDetailAttribute),e.trigger_config=n}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let r=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],n={entity_id:r[0],entity_ids:r,type:this._triggerType};if(fe(n,this._typeFields()),this._holdUntilDone&&this._isStateLatch()?n.trigger_hold_until_done=!0:this._autoCompleteOnRecovery&&(n.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(n.trigger_combinator="all"),this._triggerDetailAttribute&&(n.detail_attribute=this._triggerDetailAttribute),r.length>1&&(n.entity_logic=this._triggerEntityLogic),this._triggerType==="counter"&&this._triggerDeltaMode&&this._triggerBaselineValue){let h=parseFloat(this._triggerBaselineValue);!isNaN(h)&&h>=0&&(n.trigger_baseline_value=h)}else if(this._triggerType==="runtime"&&this._triggerRuntimeMaxSession){let h=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(h)&&h>0&&(n.trigger_runtime_max_session_seconds=h)}e.trigger_config=n}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&ce.includes(this._scheduleType)){let r=this._scheduleTimeOn?this._scheduleTime.trim():"";e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(r)?r:null}if(this.checklistsEnabled){let r=this._checklistText.split(`
`).map(n=>n.trim()).filter(Boolean).slice(0,100);e.checklist=r.length?r:null}if(this.completionActionsEnabled||this._actionPresent){let r=this._actionService.trim();if(r&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(r)){let n={service:r},h=this._actionTargetEntity.trim();this._actionTargetStored&&h===this._actionTargetInitial?n.target=JSON.parse(JSON.stringify(this._actionTargetStored)):h&&(n.target={entity_id:h});let u=this._buildActionData();Object.keys(u).length>0&&(n.data=u),this._actionSkipAuto&&(n.skip_auto=!0),e.on_complete_action=n}else e.on_complete_action=null}{let r={};this._qcNotes.trim()&&(r.notes=this._qcNotes.trim());let n=parseFloat(this._qcCost);isNaN(n)||(r.cost=n);let h=j(this._qcDuration);h!==null&&(r.duration=h),this._qcFeedback&&(r.feedback=this._qcFeedback),e.quick_complete_defaults=this._quickOn?r:null}return e}_close(){this._open=!1,this._series=[],this._warning="",this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return c;let e=this._lang,t=this._triggerType==="compound";return a`
      <div class="select-row">
        <label>${i("trigger_type",e)}</label>
        <select aria-label=${i("trigger_type",e)}
          .value=${this._triggerType}
          @change=${s=>this._triggerType=s.target.value}
        >
          ${Te.map(s=>a`<option value=${s} ?selected=${s===this._triggerType}>${pe(s,e)}</option>`)}
        </select>
      </div>
      ${t?this._renderCompoundEditor():a`
        ${this._entityPickerFallback?a`
          <ms-textfield
            label="${i("entity_id",e)} (${i("comma_separated",e)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${s=>{let n=s.target.value.split(",").map(h=>h.trim()).filter(Boolean);this._triggerEntityId=n[0]||"",this._triggerEntityIds=n,n[0]&&this._fetchEntityAttributes(n[0])}}
          ></ms-textfield>
        `:a`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:W}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>i("entity_id",e)}
          @value-changed=${s=>{let r=(s.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=r[0]||"",this._triggerEntityIds=r,r[0]?this._fetchEntityAttributes(r[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?a`
          <div class="select-row">
            <label>${i("entity_logic",e)}</label>
            <select aria-label=${i("entity_logic",e)}
              .value=${this._triggerEntityLogic}
              @change=${s=>this._triggerEntityLogic=s.target.value}
            >
              <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${i("entity_logic_any",e)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${i("entity_logic_all",e)}</option>
            </select>
          </div>
        `:c}
        ${this._renderAttributeSelect({label:i("attribute_optional",e),value:this._triggerAttribute,suggested:this._suggestedAttributes,available:this._availableAttributes,onSelect:s=>this._triggerAttribute=s})}
        ${this._renderTriggerTypeFields()}
        ${this._renderTriggerLiveHint()}
      `}
      ${this._renderDetailAttributeSelect(e)}
      ${this._isStateLatch()?this._renderTriggerEnd(e):a`
        <label>
          <input
            type="checkbox"
            .checked=${this._autoCompleteOnRecovery}
            @change=${s=>this._autoCompleteOnRecovery=s.target.checked}
          />
          ${i("auto_complete_on_recovery",e)}
        </label>
        <div class="field-help">${i("auto_complete_on_recovery_help",e)}</div>
      `}
      <ms-textfield
        label="${i("safety_interval",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${s=>this._intervalDays=s.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():c}
      ${this._intervalDays?a`
            <div class="select-row">
              <label>${i("trigger_combinator",e)}</label>
              <select aria-label=${i("trigger_combinator",e)}
                @change=${s=>this._triggerCombinator=s.target.value}
              >
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${i("trigger_combinator_any",e)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${i("trigger_combinator_all",e)}</option>
              </select>
            </div>
          `:c}
    `}_patchCondition(e,t){this._compoundConditions=this._compoundConditions.map((s,r)=>r===e?{...s,...t}:s)}_addCondition(){this._compoundConditions=[...this._compoundConditions,ue()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((t,s)=>s!==e)}_renderCompoundEditor(){let e=this._lang;return a`
      <div class="select-row">
        <label>${i("compound_logic",e)}</label>
        <select aria-label=${i("compound_logic",e)}
          .value=${this._compoundLogic}
          @change=${t=>this._compoundLogic=t.target.value}
        >
          <option value="AND" ?selected=${this._compoundLogic==="AND"}>${i("compound_logic_and",e)}</option>
          <option value="OR" ?selected=${this._compoundLogic==="OR"}>${i("compound_logic_or",e)}</option>
        </select>
      </div>
      <div class="field-help">${i("compound_help",e)}</div>
      ${this._compoundConditions.length===0?a`<div class="field-help">${i("compound_no_conditions",e)}</div>`:this._compoundConditions.map((t,s)=>this._renderCondition(t,s))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${i("compound_add_condition",e)}
      </button>
    `}_renderCondition(e,t){let s=this._lang,r=t+1;return a`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${i("compound_condition",s)} ${r}</span>
          <button
            type="button"
            class="icon-btn"
            title="${i("compound_remove_condition",s)}"
            @click=${()=>this._removeCondition(t)}
          >✕</button>
        </div>
        ${this._entityPickerFallback?a`
          <ms-textfield
            label="${i("entity_id",s)} (${i("comma_separated",s)})"
            .value=${e.entityIds}
            @input=${n=>this._patchCondition(t,{entityIds:n.target.value})}
          ></ms-textfield>
        `:a`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:W}}}]}
          .data=${{condition_entities:e.entityIds.split(",").map(n=>n.trim()).filter(Boolean)}}
          .computeLabel=${()=>i("entity_id",s)}
          @value-changed=${n=>{let h=(n.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(t,{entityIds:h.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(e,t)}
        <div class="select-row">
          <label>${i("trigger_type",s)}</label>
          <select aria-label=${i("trigger_type",s)}
            .value=${e.type}
            @change=${n=>this._patchCondition(t,{type:n.target.value})}
          >
            ${me.map(n=>a`<option value=${n} ?selected=${n===e.type}>${pe(n,s)}</option>`)}
          </select>
        </div>
        ${this._renderConditionTypeFields(e,t)}
      </div>
    `}_isStateLatch(){return this._triggerType==="state_change"&&(this._triggerTargetChanges===""||Number(this._triggerTargetChanges)===1)&&!!(this._triggerFromState.trim()||this._triggerToState.trim())}_renderTriggerEnd(e){let t=this._holdUntilDone?"hold":this._autoCompleteOnRecovery?"done":"ok",s={ok:"trigger_end_ok",done:"trigger_end_done",hold:"trigger_end_hold"},r=n=>{this._autoCompleteOnRecovery=n==="done",this._holdUntilDone=n==="hold"};return a`
      <div class="trigger-end" role="radiogroup" aria-label=${i("trigger_end",e)}>
        <div class="field-label">${i("trigger_end",e)}</div>
        ${Object.keys(s).map(n=>a`
          <label class="trigger-end-option">
            <input type="radio" name="trigger-end" value=${n} .checked=${t===n} @change=${()=>r(n)} />
            ${i(s[n],e)}
          </label>
        `)}
        ${t==="done"?a`<div class="field-help">${i("auto_complete_on_recovery_help",e)}</div>`:c}
        ${t==="hold"?a`<div class="field-help">${i("trigger_end_hold_help",e)}</div>`:c}
      </div>
    `}_renderCompleteWhen(e){return a`
      <div class="field complete-when-field">
        ${this._entityPickerFallback?a`
          <ms-textfield
            label="${i("complete_when",e)}"
            placeholder="binary_sensor.washer_door"
            .value=${this._completeWhenEntity}
            @input=${t=>this._completeWhenEntity=t.target.value.trim()}
          ></ms-textfield>
        `:a`
          <ha-form
            class="entity-picker-form"
            .hass=${this.hass}
            .schema=${[{name:"complete_when",selector:{entity:{}}}]}
            .data=${{complete_when:this._completeWhenEntity}}
            .computeLabel=${()=>i("complete_when",e)}
            @value-changed=${t=>{let s=(t.detail.value.complete_when||"").trim();s!==this._completeWhenEntity&&(this._completeWhenState=""),this._completeWhenEntity=s}}
          ></ha-form>`}
        ${this._completeWhenEntity?this._renderStateField({label:i("complete_when_state",e),value:this._completeWhenState,entityId:this._completeWhenEntity,onInput:t=>this._completeWhenState=t}):c}
        <div class="field-help">${i("complete_when_help",e)}</div>
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
          label="${i("runtime_on_states",t)}"
          placeholder="on"
          .value=${e.value}
          @input=${s=>e.onInput(s.target.value)}
        ></ms-textfield>
      `:a`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId,multiple:!0}}}]}
        .data=${{s:(e.value||"").split(",").map(s=>s.trim()).filter(Boolean)}}
        .computeLabel=${()=>i("runtime_on_states",t)}
        @value-changed=${s=>e.onInput((s.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(e){return this._scheduleType==="one_time"||this._scheduleType==="manual"?c:!this.adaptiveFeature&&!this._adaptiveWasEnabled?c:a`
      <details class="adaptive-section" ?open=${this._adaptiveEnabled}>
        <summary>${i("adaptive_section_title",e)}</summary>
        <label>
          <input
            type="checkbox"
            .checked=${this._adaptiveEnabled}
            @change=${t=>this._adaptiveEnabled=t.target.checked}
          />
          ${i("adaptive_enabled",e)}
        </label>
        ${this._adaptiveEnabled?a`
          <ms-textfield
            label="${i("adaptive_min_interval",e)}"
            type="number"
            min="1"
            .value=${this._adaptiveMin}
            @input=${t=>this._adaptiveMin=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("adaptive_max_interval",e)}"
            type="number"
            min="1"
            .value=${this._adaptiveMax}
            @input=${t=>this._adaptiveMax=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("adaptive_ewa_alpha",e)}"
            type="number"
            min=${q[0]}
            max=${q[1]}
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
            ${i("adaptive_seasonal_enabled",e)}
          </label>`:c}
          <label>
            <input
              type="checkbox"
              .checked=${this._adaptivePrediction}
              @change=${t=>this._adaptivePrediction=t.target.checked}
            />
            ${i("adaptive_prediction_enabled",e)}
          </label>
        `:c}
      </details>
    `}_renderAttributeSelect(e){let t=this._lang;return e.available.length>0?a`
        <div class="select-row">
          <label>${e.label}</label>
          <select aria-label=${e.label}
            .value=${e.value}
            @change=${s=>e.onSelect(s.target.value)}
          >
            <option value="" ?selected=${!e.value}>${i("use_entity_state",t)}</option>
            ${e.suggested.map(s=>a`<option value=${s} ?selected=${s===e.value}>${s} ★</option>`)}
            ${e.available.filter(s=>!e.suggested.includes(s.name)).map(s=>a`<option value=${s.name} ?selected=${s.name===e.value}>${s.name}${s.numeric?"":" (non-numeric)"}</option>`)}
          </select>
        </div>
      `:a`
      <ms-textfield
        label="${e.label}"
        .value=${e.value}
        @input=${s=>e.onSelect(s.target.value.trim())}
      ></ms-textfield>
    `}_renderDetailAttributeSelect(e){let t=this._triggerType==="compound"?this._compoundConditions.flatMap(p=>p.entityIds.split(",").map(m=>m.trim()).filter(Boolean)):(this._triggerEntityIds.length?this._triggerEntityIds:[this._triggerEntityId]).filter(Boolean);if(!t.length)return c;let s=this.hass?.states??{},r=new Map;for(let p of t){this._fetchConditionAttributes(p);for(let m of this._conditionAttrOptions[p]?.available??[])r.has(m.name)||r.set(m.name,qe(s[p]?.attributes?.[m.name]))}let n=this._triggerDetailAttribute;n&&!r.has(n)&&r.set(n,"");let h=i("trigger_detail_attribute",e),u=r.size?a`
        <div class="select-row">
          <label>${h}</label>
          <select class="detail-attribute-select" aria-label=${h} .value=${n}
            @change=${p=>this._triggerDetailAttribute=p.target.value}>
            <option value="" ?selected=${!n}>${i("trigger_detail_none",e)}</option>
            ${[...r.entries()].sort(([p],[m])=>p.localeCompare(m)).map(([p,m])=>a`<option value=${p} ?selected=${p===n}>${m?`${p}: ${m}`:p}</option>`)}
          </select>
        </div>`:a`
        <ms-textfield class="detail-attribute-input" label=${h} .value=${n}
          @input=${p=>this._triggerDetailAttribute=p.target.value.trim()}></ms-textfield>`;return a`${u}<div class="field-help">${i("trigger_detail_attribute_help",e)}</div>`}_renderEnvironmentalAttribute(e){this._fetchConditionAttributes(this._environmentalEntity);let t=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:i("environmental_attribute_optional",e),value:this._environmentalAttribute,suggested:t?.suggested??[],available:t?.available??[],onSelect:s=>this._environmentalAttribute=s})}_renderConditionAttribute(e,t){let s=e.entityIds.split(",")[0]?.trim()||"";s&&this._fetchConditionAttributes(s);let r=s?this._conditionAttrOptions[s]:void 0;return this._renderAttributeSelect({label:i("attribute_optional",this._lang),value:e.attribute,suggested:r?.suggested??[],available:r?.available??[],onSelect:n=>this._patchCondition(t,{attribute:n})})}_renderConditionTypeFields(e,t){let s=this._lang;if(e.type==="threshold")return a`
        <ms-textfield label="${i("trigger_above",s)}" type="number" .value=${e.above}
          @input=${r=>this._patchCondition(t,{above:r.target.value})}></ms-textfield>
        <ms-textfield label="${i("trigger_below",s)}" type="number" .value=${e.below}
          @input=${r=>this._patchCondition(t,{below:r.target.value})}></ms-textfield>
        <ms-textfield label="${i("trigger_equals",s)}" type="number" .value=${e.equals}
          @input=${r=>this._patchCondition(t,{equals:r.target.value})}></ms-textfield>
        <ms-textfield label="${i("trigger_not_equals",s)}" type="number" .value=${e.notEquals}
          @input=${r=>this._patchCondition(t,{notEquals:r.target.value})}></ms-textfield>
        <ms-textfield label="${i("for_minutes",s)}" type="number" .value=${e.forMinutes}
          @input=${r=>this._patchCondition(t,{forMinutes:r.target.value})}></ms-textfield>
      `;if(e.type==="counter")return a`
        <ms-textfield label="${i("target_value",s)}" type="number" .value=${e.targetValue}
          @input=${r=>this._patchCondition(t,{targetValue:r.target.value})}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${e.deltaMode}
            @change=${r=>this._patchCondition(t,{deltaMode:r.target.checked})} />
          ${i("delta_mode",s)}
        </label>
      `;if(e.type==="state_change"){let r=e.entityIds.split(",")[0]?.trim()||"";return a`
        ${this._renderStateField({label:i("from_state_optional",s),value:e.fromState,entityId:r,onInput:n=>this._patchCondition(t,{fromState:n})})}
        ${this._renderStateField({label:i("to_state_optional",s),value:e.toState,entityId:r,onInput:n=>this._patchCondition(t,{toState:n})})}
        <ms-textfield label="${i("target_changes",s)}" type="number" .value=${e.targetChanges}
          @input=${n=>this._patchCondition(t,{targetChanges:n.target.value})}></ms-textfield>
        <ms-textfield label="${i("for_minutes",s)}" type="number" .value=${e.forMinutes}
          @input=${n=>this._patchCondition(t,{forMinutes:n.target.value})}></ms-textfield>
      `}if(e.type==="runtime"){let r=e.entityIds.split(",")[0]?.trim()||"";return a`
        <ms-textfield label="${i("runtime_hours",s)}" type="number" .value=${e.runtimeHours}
          @input=${n=>this._patchCondition(t,{runtimeHours:n.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:e.onStates,entityId:r,onInput:n=>this._patchCondition(t,{onStates:n})})}
      `}return e.type==="due_date"?a`
        <ms-textfield label="${i("days_before",s)}" type="number" step="1"
          min=${k[0]} max=${k[1]} .value=${e.daysBefore}
          @input=${r=>this._patchCondition(t,{daysBefore:r.target.value})}></ms-textfield>
      `:c}_renderUnitSelect(){let e=this._lang;return a`
      <div class="select-row">
        <label>${i("interval_unit",e)}</label>
        <select aria-label=${i("interval_unit",e)}
          .value=${this._intervalUnit}
          @change=${t=>this._intervalUnit=t.target.value}
        >
          ${["days","weeks","months","years"].map(t=>a`<option value=${t} ?selected=${t===this._intervalUnit}>${i("unit_"+t,e)}</option>`)}
        </select>
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(this._scheduleType==="calendar"&&!this._calendarEntity.trim())return null;if(F.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let e=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!e||e<=0?null:{kind:"interval",every:e,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(e){super.updated?.(e),this._scheduleEntityPickerProbe();for(let t of e.keys())if(o._PREVIEW_RELEVANT.has(String(t))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let e=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),t=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!e||!t){this._pickerProbeStrikes=0;return}let s=(u,p,m=0)=>{if(!(!u||m>10)){(u.tagName?.toLowerCase()??"")==="ha-entity-picker"&&p.push(u);for(let v of[u.shadowRoot,u])if(v)for(let f of Array.from(v.children??[]))s(f,p,m+1)}},r=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],n=[];for(let u of r)s(u,n);let h=n.length===0||n.some(u=>u.offsetHeight===0);if(e.offsetHeight===0||h){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let e=this._open?this._previewScheduleDict():null;if(!e){++this._previewSeq,this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let t=++this._previewSeq;try{let s=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:e,...this._lastPerformed?{last_performed:this._lastPerformed}:{},...this._taskId?{entry_id:this._entryId,task_id:this._taskId}:{}});if(t!==this._previewSeq)return;this._schedulePreview=s.occurrences||[],this._schedulePreviewEnded=!!s.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return c;let e=this._lang,t=this.scheduleTimeEnabled&&this._scheduleTimeOn&&this._scheduleTime?` ${this._scheduleTime}`:"",s=this._schedulePreview.map((n,h)=>{let u=new Date(`${n}T12:00:00`).getDay();return`${M(u===0?6:u-1,e,"short")} ${H(n,e)}${h===0?t:""}`}).join(" \xB7 "),r=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?a`<div class="field-help">${i("schedule_preview_ontime",e)}</div>`:c;return a`
      <div class="trigger-live-hint schedule-preview">
        ${i("schedule_preview_title",e)}: ${s}${this._schedulePreviewEnded?a` <span class="field-help">${i("schedule_preview_ends",e)}</span>`:c}
        ${r}
      </div>
    `}_buildSchedule(){let e=r=>{let n=parseInt(this._calOffset,10)||0;return n&&(r.offset=Math.max(-I,Math.min(n,I))),r},t=r=>((this._calMonths.length||this._hadCalMonths)&&(r.months=[...this._calMonths].sort((n,h)=>n-h)),e(r));if(this._scheduleType==="weekdays")return e({kind:"weekdays",weekdays:[...this._weekdays].sort((r,n)=>r-n)});if(this._scheduleType==="nth_weekday")return t({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});if(this._scheduleType==="calendar")return e({kind:"calendar",entity_id:this._calendarEntity.trim()});let s={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(s.business=!0),t(s)}_recurrenceExtras(){let e={};if(this._seasonMonths.length&&(e.season_months=[...this._seasonMonths].sort((t,s)=>t-s)),this._endsMode==="count"){let t=parseInt(this._endsCount,10);t>=1&&(e.ends={count:t})}else this._endsMode==="until"&&this._endsUntil&&(e.ends={until:this._endsUntil});return e}_toggleCalMonth(e){this._calMonths=this._calMonths.includes(e)?this._calMonths.filter(t=>t!==e):[...this._calMonths,e]}_renderCalMonths(){let e=this._lang;return a`
      <label class="field-label">${i("recurrence_months_label",e)}</label>
      <div class="field-help">${i("recurrence_months_hint",e)}</div>
      <div class="weekday-chips season-chips cal-month-chips">
        ${ge(e).map((t,s)=>a`
          <button
            type="button"
            class="season-chip ${this._calMonths.includes(s+1)?"selected":""}"
            @click=${()=>this._toggleCalMonth(s+1)}
          >${t}</button>`)}
      </div>`}_toggleSeasonMonth(e){this._seasonMonths=this._seasonMonths.includes(e)?this._seasonMonths.filter(t=>t!==e):[...this._seasonMonths,e]}_renderRecurrenceExtras(){let e=this._lang;if(!(this._scheduleType==="time_based"||F.includes(this._scheduleType)))return c;let s=ge(e);return a`
      <label class="field-label">${i("season_window_label",e)}</label>
      <div class="field-help">${i("season_window_hint",e)}</div>
      <div class="weekday-chips season-chips">
        ${s.map((r,n)=>a`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(n+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(n+1)}
          >${r}</button>`)}
      </div>

      <label class="field-label">${i("series_end_label",e)}</label>
      <div class="select-row">
        <select aria-label=${i("series_end_label",e)} .value=${this._endsMode}
          @change=${r=>this._endsMode=r.target.value}>
          <option value="never" ?selected=${this._endsMode==="never"}>${i("series_end_never",e)}</option>
          <option value="count" ?selected=${this._endsMode==="count"}>${i("series_end_after_count",e)}</option>
          <option value="until" ?selected=${this._endsMode==="until"}>${i("series_end_until",e)}</option>
        </select>
      </div>
      ${this._endsMode==="count"?a`
        <!-- max: MAX_SERIES_COUNT (const.py), what the history can count. -->
        <ms-textfield
          label="${i("series_end_count_label",e)}"
          type="number" min="1" max="500"
          .value=${this._endsCount}
          @input=${r=>this._endsCount=r.target.value}
        ></ms-textfield>`:c}
      ${this._endsMode==="until"?a`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${e}
          label="${i("series_end_until_label",e)}"
          .value=${this._endsUntil}
          @value-changed=${r=>this._endsUntil=r.detail.value}
        ></ms-date-field>`:c}
    `}_renderCalendarFields(){let e=this._lang,t=Ie(e);if(this._scheduleType==="weekdays")return a`
        <label class="field-label">${i("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${t.map((s,r)=>a`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(r)?"selected":""}"
              @click=${()=>this._toggleWeekday(r)}
            >${s}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let s=[["1",i("ord_1",e)],["2",i("ord_2",e)],["3",i("ord_3",e)],["4",i("ord_4",e)],["5",i("ord_5",e)],["-1",i("ord_last",e)]];return a`
        <div class="select-row">
          <label>${i("recurrence_occurrence",e)}</label>
          <select aria-label=${i("recurrence_occurrence",e)} .value=${this._nth} @change=${r=>this._nth=r.target.value}>
            ${s.map(([r,n])=>a`<option value=${r} ?selected=${r===this._nth}>${n}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${i("recurrence_weekday",e)}</label>
          <select aria-label=${i("recurrence_weekday",e)} .value=${this._nthWeekday} @change=${r=>this._nthWeekday=r.target.value}>
            ${t.map((r,n)=>a`<option value=${String(n)} ?selected=${String(n)===this._nthWeekday}>${r}</option>`)}
          </select>
        </div>
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`}return this._scheduleType==="calendar"?a`
        ${this._entityPickerFallback?a`
          <ms-textfield
            label="${i("calendar_entity_label",e)}"
            helper="${i("calendar_entity_hint",e)}"
            .value=${this._calendarEntity}
            @input=${s=>this._calendarEntity=s.target.value.trim()}
          ></ms-textfield>
        `:a`
          <ha-form
            class="entity-picker-form calendar-entity-form"
            .hass=${this.hass}
            .schema=${[{name:"calendar_entity",selector:{entity:{domain:"calendar"}}}]}
            .data=${{calendar_entity:this._calendarEntity}}
            .computeLabel=${()=>i("calendar_entity_label",e)}
            .computeHelper=${()=>i("calendar_entity_hint",e)}
            @value-changed=${s=>{this._calendarEntity=(s.detail.value.calendar_entity||"").trim()}}
          ></ha-form>`}
        ${this._renderCalOffsetField()}`:this._scheduleType==="day_of_month"?a`
        ${this._domLastDay?c:a`
          <ms-textfield
            label="${i("recurrence_day",e)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${s=>this._domDay=s.target.value}
          ></ms-textfield>`}
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domLastDay}
            @change=${s=>this._domLastDay=s.target.checked} />
          <span>${i("recurrence_last_day",e)}</span>
        </label>
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domBusiness}
            @change=${s=>this._domBusiness=s.target.checked} />
          <span>${i("recurrence_business_day",e)}</span>
        </label>
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`:c}_renderCalOffsetField(){let e=this._lang;return a`
      <ms-textfield
        label="${i("recurrence_offset",e)}"
        helper="${i("recurrence_offset_help",e)}"
        type="number"
        min=${-I}
        max=${I}
        .value=${this._calOffset}
        @input=${t=>this._calOffset=t.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let e=parseFloat(this._triggerAbove),t=parseFloat(this._triggerBelow);return!isNaN(e)&&!isNaN(t)&&t>e}_renderTriggerLiveHint(){if(this._triggerType==="compound")return c;let e=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?a`<div class="trigger-live-hint warn">${i("trigger_hint_overlap",this._lang)}</div>`:c,t=this._triggerEntityId||this._triggerEntityIds[0];if(!t||!this.hass?.states)return e;let s=this.hass.states[t];if(!s)return e;let r=this._lang,n=s.attributes?.unit_of_measurement,h=typeof n=="string"&&n?` ${n}`:"",u=this._triggerAttribute?s.attributes?.[this._triggerAttribute]:s.state,p=typeof u=="number"?u:parseFloat(String(u)),m=u!=="unknown"&&u!=="unavailable"&&u!=null&&!isNaN(p),v=y=>O(y,r,{maximumFractionDigits:1}),f=[];if(this._triggerType==="threshold"){let y=parseFloat(this._triggerAbove),b=parseFloat(this._triggerBelow),w=parseFloat(this._triggerEquals),x=parseFloat(this._triggerNotEquals);if([y,b,w,x].every(S=>isNaN(S)))return c;m&&f.push(i("trigger_hint_now",r).replace("{value}",v(p)+h)),isNaN(y)||f.push(i("trigger_hint_above",r).replace("{target}",v(y)+h)),isNaN(b)||f.push(i("trigger_hint_below",r).replace("{target}",v(b)+h)),isNaN(w)||f.push(i("trigger_hint_equals",r).replace("{target}",v(w)+h)),isNaN(x)||f.push(i("trigger_hint_not_equals",r).replace("{target}",v(x)+h))}else if(this._triggerType==="counter"){let y=parseFloat(this._triggerTargetValue);if(isNaN(y))return c;this._triggerDeltaMode?this._taskId?f.push(i("trigger_hint_counter_delta_edit",r).replace("{target}",v(y)+h)):m?f.push(i("trigger_hint_counter_delta",r).replace("{value}",v(p)+h).replace("{due}",v(p+y)+h).replace("{target}",v(y)+h)):f.push(i("trigger_hint_counter_delta_edit",r).replace("{target}",v(y)+h)):(m&&f.push(i("trigger_hint_now",r).replace("{value}",v(p)+h)),f.push(i("trigger_hint_counter_abs",r).replace("{target}",v(y)+h)))}else if(this._triggerType==="runtime"){let y=parseFloat(this._triggerRuntimeHours);if(isNaN(y))return c;f.push(i("trigger_hint_runtime",r).replace("{hours}",v(y))),f.push(i("trigger_hint_state_now",r).replace("{value}",String(s.state)))}else if(this._triggerType==="state_change"){let y=parseInt(this._triggerTargetChanges,10)||1,b=this._triggerToState.trim();f.push((b?i("trigger_hint_state_change_to",r).replace("{state}",b):i("trigger_hint_state_change",r)).replace("{count}",String(y))),f.push(i("trigger_hint_state_now",r).replace("{value}",String(s.state)))}else if(this._triggerType==="due_date"){let y=parseInt(this._triggerDaysBefore,10)||0;f.push(y===0?i("trigger_hint_due_date_same_day",r):Y("trigger_hint_due_date","trigger_hint_due_date_one",y,r,"days"));let b=u==null?"":String(u);b&&!isNaN(Date.parse(b))&&f.push(i("trigger_hint_due_date_now",r).replace("{date}",H(b,r)))}return f.length?a`<div class="trigger-live-hint">${f.join(" ")}</div>${e}`:e}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?a`
        <ms-textfield
          label="${i("trigger_above",e)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${t=>this._triggerAbove=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${i("trigger_below",e)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${t=>this._triggerBelow=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${i("trigger_equals",e)}"
          type="number"
          step="any"
          .value=${this._triggerEquals}
          @input=${t=>this._triggerEquals=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${i("trigger_not_equals",e)}"
          type="number"
          step="any"
          .value=${this._triggerNotEquals}
          @input=${t=>this._triggerNotEquals=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${i("for_at_least_minutes",e)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
      `:this._triggerType==="counter"?a`
        <ms-textfield
          label="${i("target_value",e)}"
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
          ${i("delta_mode",e)}
        </label>
        ${this._triggerDeltaMode?a`
              <ms-textfield
                label="${i("baseline_start_value",e)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${t=>this._triggerBaselineValue=t.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?i("baseline_start_help_edit",e):i("baseline_start_help",e)}
                ${this._taskId&&this._liveBaselineValue!=null?a`<div class="baseline-effective">
                      ${i("baseline_current_effective",e).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:c}
              </div>
            `:c}
      `:this._triggerType==="state_change"?a`
        ${this._renderStateField({label:i("from_state_optional",e),value:this._triggerFromState,entityId:this._triggerEntityId,onInput:t=>this._triggerFromState=t})}
        <div class="field-help">${i("state_value_help",e)}</div>
        ${this._renderStateField({label:i("to_state_optional",e),value:this._triggerToState,entityId:this._triggerEntityId,onInput:t=>this._triggerToState=t})}
        <ms-textfield
          label="${i("target_changes",e)}"
          type="number"
          min=${oe[0]}
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ms-textfield>
        <div class="field-help">${i("target_changes_help",e)}</div>
        ${(this._triggerTargetChanges||"1")==="1"&&(this._triggerFromState||this._triggerToState)?a`<div class="field-help">${i("state_latch_help",e)}</div>`:c}
        <ms-textfield
          label="${i("for_at_least_minutes",e)}"
          type="number"
          min=${ae[0]}
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
        <div class="field-help">${i("for_minutes_state_help",e)}</div>
      `:this._triggerType==="runtime"?a`
        <ms-textfield
          label="${i("runtime_hours",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${t=>this._triggerRuntimeHours=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${i("runtime_max_session",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeMaxSession}
          @input=${t=>this._triggerRuntimeMaxSession=t.target.value}
        ></ms-textfield>
        <div class="field-help">${i("runtime_max_session_help",e)}</div>
        ${this._renderOnStatesField({value:this._triggerOnStates,entityId:this._triggerEntityId,onInput:t=>this._triggerOnStates=t})}
        <div class="field-help">${i("runtime_on_states_help",e)}</div>
      `:this._triggerType==="due_date"?a`
        <ms-textfield
          label="${i("days_before",e)}"
          type="number"
          step="1"
          min=${k[0]}
          max=${k[1]}
          .value=${this._triggerDaysBefore}
          @input=${t=>this._triggerDaysBefore=t.target.value}
        ></ms-textfield>
        <div class="field-help">${i("days_before_help",e)}</div>
      `:c}_section(e,t,s){return a`<section class="form-section ${e}">
      <h3 class="section-title">${t}</h3>
      ${s}
    </section>`}_renderIdentity(e){return a`
          ${this._taskId===null&&this._objectChoices.length>0?a`
            <div class="select-row">
              <label>${i("object",e)}</label>
              <select aria-label=${i("object",e)}
                .value=${this._entryId}
                @change=${t=>{this._entryId=t.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}}
              >
                ${this._objectChoices.map(t=>a`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
              </select>
            </div>
          `:c}
          <ms-textfield
            label="${i("task_name",e)}"
            required
            .value=${this._name}
            @input=${t=>this._name=t.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${i("maintenance_type",e)}</label>
            <select aria-label=${i("maintenance_type",e)}
              .value=${this._type}
              @change=${t=>this._type=t.target.value}
            >
              ${Ee.map(t=>a`<option value=${t} ?selected=${t===this._type}>${i(t,e)}</option>`)}
            </select>
          </div>
          <ms-textfield
            label="${i("notes_optional",e)}"
            multiline
            .rows=${3}
            .helper=${i("notes_markdown_hint",e)}
            .value=${this._notes}
            @input=${t=>this._notes=t.target.value}
          ></ms-textfield>
          ${this._renderDetails(e)}
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${t=>this._enabled=t.target.checked}
            />
            ${i("task_enabled",e)}
          </label>
    `}_renderDetails(e){return a`
      <details class="details-section" ?open=${this._detailsOpen}>
        <summary>${i("task_section_details",e)}</summary>
        <div class="select-row">
          <label>${i("priority",e)}</label>
          <select aria-label=${i("priority",e)}
            .value=${this._priority}
            @change=${t=>this._priority=t.target.value}
          >
            ${le.map(t=>a`<option value=${t} ?selected=${t===this._priority}>${i("priority_"+t,e)}</option>`)}
          </select>
        </div>
        <ms-textfield
          label="${i("labels",e)}"
          placeholder="${i("labels_placeholder",e)}"
          helper="${i("labels_help",e)}"
          .value=${this._labels}
          @input=${t=>this._labels=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${i("documentation_url_optional",e)}"
          .value=${this._documentationUrl}
          @input=${t=>this._documentationUrl=t.target.value}
        ></ms-textfield>
        <ha-icon-picker
          .hass=${this.hass}
          label="${i("custom_icon_optional",e)}"
          .value=${this._customIcon}
          @value-changed=${t=>this._customIcon=t.detail.value||""}
        ></ha-icon-picker>
      </details>
    `}_renderScheduleSection(e){return this._section("schedule-section",i("task_section_schedule",e),a`
          <div class="select-row">
            <label>${i("schedule_type",e)}</label>
            <select aria-label=${i("schedule_type",e)}
              .value=${this._scheduleType}
              @change=${t=>this._scheduleType=t.target.value}
            >
              ${xe.map(t=>a`<option value=${t} ?selected=${t===this._scheduleType}>${i(t,e)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?a`
                <ms-textfield
                  label="${i("interval_value",e)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${t=>this._intervalDays=t.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  <label>${i("interval_anchor",e)}</label>
                  <select aria-label=${i("interval_anchor",e)}
                    .value=${this._intervalAnchor}
                    @change=${t=>this._intervalAnchor=t.target.value}
                  >
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${i("anchor_completion",e)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${i("anchor_planned",e)}</option>
                  </select>
                  <div class="field-help anchor-help">${i("interval_anchor_hint",e)}</div>
                </div>
              `:c}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?a`
                <ms-date-field
                  kind="date"
                  .hass=${this.hass}
                  .lang=${e}
                  label="${i("due_date",e)}"
                  .value=${this._dueDate}
                  @value-changed=${t=>this._dueDate=t.detail.value}
                ></ms-date-field>
              `:c}
          ${this.scheduleTimeEnabled&&ce.includes(this._scheduleType)?a`
            <label class="checkbox-row schedule-time-toggle">
              <input type="checkbox" .checked=${this._scheduleTimeOn}
                @change=${t=>this._scheduleTimeOn=t.target.checked} />
              <span>${i("schedule_time_toggle",e)}</span>
            </label>
            ${this._scheduleTimeOn?a`
              <ms-date-field
                kind="time"
                .hass=${this.hass}
                .lang=${e}
                .value=${this._scheduleTime}
                helper="${i("schedule_time_help",e)}"
                @value-changed=${t=>this._scheduleTime=t.detail.value}
              ></ms-date-field>
            `:c}
          `:c}
          ${this._renderRecurrenceExtras()}
          ${this._renderSchedulePreview()}
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${i("last_performed_optional",e)}"
            .value=${this._lastPerformed}
            @value-changed=${t=>this._lastPerformed=t.detail.value}
          ></ms-date-field>
          <ms-textfield
            label="${i("warning_days",e)}"
            type="number"
            min=${D[0]}
            max=${D[1]}
            .value=${this._warningDays}
            @input=${t=>this._warningDays=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("earliest_completion_days",e)}"
            helper="${i("earliest_completion_days_help",e)}"
            type="number"
            .value=${this._earliestCompletionDays}
            @input=${t=>this._earliestCompletionDays=t.target.value}
          ></ms-textfield>
          ${this._renderAdaptiveSection(e)}
    `)}_renderTriggerSection(e){return this._scheduleType!=="sensor_based"?c:this._section("trigger-section",i("task_section_trigger",e),a`
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"&&(this.environmentalFeature||this._environmentalInitial)?a`
            ${this._entityPickerFallback?a`
              <ms-textfield
                label="${i("environmental_entity_optional",e)}"
                helper="${i("environmental_entity_helper",e)}"
                .value=${this._environmentalEntity}
                @input=${t=>this._environmentalEntity=t.target.value.trim()}
              ></ms-textfield>
            `:a`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:he}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>i("environmental_entity_optional",e)}
              .computeHelper=${()=>i("environmental_entity_helper",e)}
              @value-changed=${t=>{this._environmentalEntity=(t.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(e):c}
          `:c}
    `)}_renderCompletionSection(e){return this._section("completion-section",i("task_section_completion",e),a`
          ${this._type==="reading"?a`
                <ms-textfield
                  label="${i("reading_unit_label",e)}"
                  .value=${this._readingUnit}
                  @input=${t=>this._readingUnit=t.target.value}
                ></ms-textfield>
                <div class="field-help">${i("reading_unit_help",e)}</div>
                ${this._renderReadingsEditor(e)}
              `:c}
          ${this.checklistsEnabled?a`
            <label class="field-label" for="checklist-textarea">${i("checklist_steps_optional",e)}</label>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${i("checklist_placeholder",e)}"
              .value=${this._checklistText}
              @input=${t=>this._checklistText=t.target.value}
            ></textarea>
            <div class="field-help">${i("checklist_help",e)}</div>
          `:c}
          ${this._partsLoadFailed?a`<div class="field-help parts-load-failed">${i("parts_load_failed",e)}</div>`:c}
          ${this._isFleetTask?a`<div class="field-help parts-fleet-hint">${i("task_parts_fleet_hint",e)}</div>`:this.parts.length||this._foreignOwners.length?a`
                <div class="field">
                  <label>${i("consumes_parts_label",e)}</label>
                  ${this.parts.map(t=>this._renderConsumesRow(t))}
                  ${this._foreignOwners.length?a`
                        <details class="shared-pools" ?open=${this._hasForeignPick}>
                          <summary>${i("shared_parts_other_objects",e)}</summary>
                          <div class="field-help">${i("shared_parts_help",e)}</div>
                          ${this._foreignOwners.map(t=>a`
                              <div class="shared-pool-owner">${t.name}</div>
                              ${t.parts.map(s=>this._renderConsumesRow(s,t.entry_id))}
                            `)}
                        </details>
                      `:c}
                </div>
              `:c}
          <div class="field-label">${i("require_on_completion",e)}</div>
          <div class="required-completion">
            ${L.map(t=>a`
              <label class="req-option">
                <input
                  type="checkbox"
                  .checked=${this._requiredCompletion.includes(t)}
                  @change=${s=>this._toggleRequired(t,s.target.checked)}
                />
                <span>${i(P[t],e)}</span>
              </label>
            `)}
          </div>
          ${this._availableTags.length>0?a`
              <div class="select-row">
                <label>${i("nfc_tag_id_optional",e)}</label>
                <select aria-label=${i("nfc_tag_id_optional",e)}
                  .value=${this._nfcTagId}
                  @change=${t=>this._nfcTagId=t.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${i("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(t=>a`<option value=${t.id} ?selected=${t.id===this._nfcTagId}>${t.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${i("nfc_tags_refresh",e)}">↻</button>
              </div>
            `:a`
              <ms-textfield
                label="${i("nfc_tag_id_optional",e)}"
                .value=${this._nfcTagId}
                @input=${t=>this._nfcTagId=t.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${i("nfc_tags_empty_help",e)}
                <a href="/config/tags">${i("nfc_tags_open_settings",e)}</a>
                ·
                <button type="button" class="link-button" @click=${this._loadTags}>
                  ${i("nfc_tags_refresh",e)}
                </button>
              </div>
            `}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${this._requireTagScan}
              @change=${t=>this._requireTagScan=t.target.checked}
            />
            <span>${i("require_tag_scan",e)}</span>
          </label>
          ${this._requireTagScan?a`<div class="field-help">${i("require_tag_scan_help",e)}</div>`:c}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._allowSkip}
              @change=${t=>this._allowSkip=!t.target.checked}
            />
            <span>${i("disallow_skip",e)}</span>
          </label>
          ${this._allowSkip?c:a`<div class="field-help">${i("disallow_skip_help",e)}</div>`}
          ${this._renderQuickComplete(e)}
          ${this._renderCompleteWhen(e)}
          ${this._renderPhasesEditor(e)}
          ${this._renderCompletionActionsSection(e)}
    `)}_renderPeopleSection(e){return this._section("people-section",i("task_section_people",e),a`
          <div class="select-row">
            <label>${i("responsible_user",e)}</label>
            <select aria-label=${i("responsible_user",e)}
              .value=${this._responsibleUserId||""}
              @change=${t=>{let s=t.target.value;this._responsibleUserId=s||null}}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${i("no_user_assigned",e)}</option>
              ${this._availableUsers.map(t=>a`<option value=${t.id} ?selected=${t.id===this._responsibleUserId}>${t.name}</option>`)}
            </select>
          </div>
          ${this._availableUsers.length>=2?a`
            <div class="field">
              <label>${i("task_shared_with",e)}</label>
              <div class="field-help">${i("task_shared_with_help",e)}</div>
              ${this._responsibleUserId&&this._assigneePool.length>0&&!(this._assigneePool.length>=2&&this._rotationStrategy)?a`<div class="field-help shared-responsible-wins">${i("task_shared_responsible_wins",e)}</div>`:c}
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
                <label>${i("rotation_strategy",e)}</label>
                <select aria-label=${i("rotation_strategy",e)}
                  .value=${this._rotationStrategy}
                  @change=${t=>this._rotationStrategy=t.target.value}
                >
                  <option value="" ?selected=${!this._rotationStrategy}>${i("rotation_none",e)}</option>
                  ${de.map(t=>a`<option value=${t} ?selected=${t===this._rotationStrategy}>${i("rotation_"+t,e)}</option>`)}
                </select>
              </div>`:c}
          `:c}
    `)}_renderNotificationsSection(e){return this._section("notifications-section",i("task_section_notifications",e),a`
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._notifyEnabled}
              @change=${t=>this._notifyEnabled=!t.target.checked}
            />
            <span>${i("no_notifications",e)}</span>
          </label>
          ${this._notifyEnabled?c:a`<div class="field-help">${i("no_notifications_help",e)}</div>`}
          <ha-icon-picker
            class="notify-icon-picker"
            .hass=${this.hass}
            label="${i("notify_icon",e)}"
            .value=${this._notifyIcon}
            @value-changed=${t=>this._notifyIcon=t.detail.value||""}
          ></ha-icon-picker>
          <div class="field-help notify-icon-help">
            <ha-icon icon=${this._notifyIcon.trim()||z(this._type)}></ha-icon>
            ${i("notify_icon_hint",e).replace("{default}",z(this._type))}
          </div>
          ${this._renderMirrorTodo(e)}
    `)}_renderMirrorTodo(e){let t=this.mirrorTodoDefault;if(!t.length)return a`
          <div class="field mirror-todo-field">
            ${this._renderMirrorTodoPicker(e)}
            <div class="field-help">${i("task_mirror_todo_hint",e)}</div>
          </div>`;let s=t.map(n=>String(this.hass?.states?.[n]?.attributes?.friendly_name??n)).join(", "),r={default:i("task_mirror_todo_default",e).replace("{lists}",s),own:i("task_mirror_todo_own",e),none:i("task_mirror_todo_none",e)};return a`
          <div class="field mirror-todo-field">
            <div class="mirror-todo-choice" role="radiogroup" aria-label=${i("task_mirror_todo",e)}>
              <div class="field-label">${i("task_mirror_todo",e)}</div>
              ${Object.keys(r).map(n=>a`
                <label class="mirror-todo-option">
                  <input type="radio" name="mirror-todo" value=${n} .checked=${this._mirrorTodoMode===n}
                    @change=${()=>this._mirrorTodoMode=n} />
                  ${r[n]}
                </label>
              `)}
            </div>
            ${this._mirrorTodoMode==="own"?this._renderMirrorTodoPicker(e):c}
            ${this._mirrorTodoMode!=="none"?a`<div class="field-help">${i("task_mirror_todo_hint",e)}</div>`:c}
          </div>`}_renderMirrorTodoPicker(e){return a`
            ${this._entityPickerFallback?a`
              <ms-textfield
                label="${i("task_mirror_todo",e)}"
                placeholder="todo.family, todo.kids"
                .value=${this._mirrorTodoEntities.join(", ")}
                @input=${t=>{this._mirrorTodoEntities=t.target.value.split(",").map(s=>s.trim()).filter(Boolean)}}
              ></ms-textfield>
            `:a`
              <ha-form
                class="entity-picker-form"
                .hass=${this.hass}
                .schema=${[{name:"mirror_todo_entities",selector:{entity:{multiple:!0,domain:["todo"]}}}]}
                .data=${{mirror_todo_entities:this._mirrorTodoEntities}}
                .computeLabel=${()=>i("task_mirror_todo",e)}
                @value-changed=${t=>{let s=(t.detail.value.mirror_todo_entities||[]).filter(Boolean);this._mirrorTodoEntities=s}}
              ></ha-form>`}`}render(){if(!this._open)return a``;let e=this._lang,t=this._taskId?i("edit_task",e):i("new_task",e),s=this._seriesIndex+1<this._series.length;return a`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">
          ${t}
          ${this._series.length>1?a`<span class="series-position">${i("task_series_position",e).replace("{n}",String(this._seriesIndex+1)).replace("{total}",String(this._series.length))}</span>`:c}
        </div>
        <div class="content">
          ${this._error?a`<div class="error">${this._error}</div>`:c}
          ${this._warning?a`<div class="error warning">${this._warning}</div>`:c}
          ${this._renderIdentity(e)}
          ${this._renderScheduleSection(e)}
          ${this._renderTriggerSection(e)}
          ${this._renderCompletionSection(e)}
          ${this._renderPeopleSection(e)}
          ${this._renderNotificationsSection(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${i("cancel",e)}</ha-button>
          ${s?a`<ha-button appearance="plain" class="series-skip" .disabled=${this._loading} @click=${this._skipSeriesItem}>
                ${i("task_series_skip",e)}
              </ha-button>`:c}
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()||this._missingDueDate()}
          >
            ${this._loading?i("saving",e):i(s?"task_series_save_next":"save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};o._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_calMonths","_calendarEntity","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),o.styles=[X,Z,G`
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
    /* D#229: one option per line — three sentences flowed into each other. */
    .trigger-end,
    .mirror-todo-choice {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin: 8px 0;
    }
    .trigger-end-option,
    .mirror-todo-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    /* v1.3.0: completion-action sections (.adaptive-section shares the shell
       but keeps its own class — tests count .ca-section elements) */
    .ca-section,
    .adaptive-section,
    .phases-section,
    .details-section {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 8px 12px;
      margin-top: 8px;
    }
    .ca-section > summary,
    .adaptive-section > summary,
    .phases-section > summary,
    .details-section > summary {
      cursor: pointer;
      font-weight: 500;
    }
    .phases-section,
    .details-section {
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
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    /* #233: what a one-tap completion cannot answer */
    .quick-complete-note {
      color: var(--warning-color, #ff9800);
    }
    /* #232: a responsible person outranks the people it is shared with */
    .shared-responsible-wins {
      color: var(--warning-color, #ff9800);
    }
    /* #235: "2 of 5" while a series of tasks is edited */
    .series-position {
      margin-inline-start: 8px;
      font-size: 14px;
      font-weight: 400;
      color: var(--secondary-text-color);
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
  `],l([$({attribute:!1})],o.prototype,"hass",2),l([$({type:Boolean,attribute:"checklists-enabled"})],o.prototype,"checklistsEnabled",2),l([$({type:Boolean,attribute:"schedule-time-enabled"})],o.prototype,"scheduleTimeEnabled",2),l([$({type:Boolean,attribute:"completion-actions-enabled"})],o.prototype,"completionActionsEnabled",2),l([$({type:Boolean,attribute:"adaptive-feature"})],o.prototype,"adaptiveFeature",2),l([$({type:Boolean,attribute:"seasonal-feature"})],o.prototype,"seasonalFeature",2),l([$({type:Boolean,attribute:"environmental-feature"})],o.prototype,"environmentalFeature",2),l([$({type:Number,attribute:"default-warning-days"})],o.prototype,"defaultWarningDays",2),l([$({attribute:!1})],o.prototype,"mirrorTodoDefault",2),l([d()],o.prototype,"parts",2),l([d()],o.prototype,"_foreignOwners",2),l([d()],o.prototype,"_open",2),l([d()],o.prototype,"_entityPickerFallback",2),l([d()],o.prototype,"_loading",2),l([d()],o.prototype,"_error",2),l([d()],o.prototype,"_warning",2),l([d()],o.prototype,"_entryId",2),l([d()],o.prototype,"_taskId",2),l([d()],o.prototype,"_series",2),l([d()],o.prototype,"_seriesIndex",2),l([d()],o.prototype,"_isFleetTask",2),l([d()],o.prototype,"_objectChoices",2),l([d()],o.prototype,"_name",2),l([d()],o.prototype,"_type",2),l([d()],o.prototype,"_scheduleType",2),l([d()],o.prototype,"_intervalDays",2),l([d()],o.prototype,"_intervalUnit",2),l([d()],o.prototype,"_dueDate",2),l([d()],o.prototype,"_warningDays",2),l([d()],o.prototype,"_earliestCompletionDays",2),l([d()],o.prototype,"_intervalAnchor",2),l([d()],o.prototype,"_weekdays",2),l([d()],o.prototype,"_nth",2),l([d()],o.prototype,"_nthWeekday",2),l([d()],o.prototype,"_domDay",2),l([d()],o.prototype,"_domLastDay",2),l([d()],o.prototype,"_domBusiness",2),l([d()],o.prototype,"_calOffset",2),l([d()],o.prototype,"_calMonths",2),l([d()],o.prototype,"_calendarEntity",2),l([d()],o.prototype,"_seasonMonths",2),l([d()],o.prototype,"_endsMode",2),l([d()],o.prototype,"_endsCount",2),l([d()],o.prototype,"_endsUntil",2),l([d()],o.prototype,"_schedulePreview",2),l([d()],o.prototype,"_schedulePreviewEnded",2),l([d()],o.prototype,"_notes",2),l([d()],o.prototype,"_documentationUrl",2),l([d()],o.prototype,"_customIcon",2),l([d()],o.prototype,"_notifyIcon",2),l([d()],o.prototype,"_priority",2),l([d()],o.prototype,"_labels",2),l([d()],o.prototype,"_detailsOpen",2),l([d()],o.prototype,"_mirrorTodoEntities",2),l([d()],o.prototype,"_mirrorTodoMode",2),l([d()],o.prototype,"_completeWhenEntity",2),l([d()],o.prototype,"_completeWhenState",2),l([d()],o.prototype,"_enabled",2),l([d()],o.prototype,"_triggerEntityId",2),l([d()],o.prototype,"_triggerEntityIds",2),l([d()],o.prototype,"_triggerEntityLogic",2),l([d()],o.prototype,"_triggerAttribute",2),l([d()],o.prototype,"_triggerType",2),l([d()],o.prototype,"_triggerAbove",2),l([d()],o.prototype,"_triggerBelow",2),l([d()],o.prototype,"_triggerEquals",2),l([d()],o.prototype,"_triggerNotEquals",2),l([d()],o.prototype,"_triggerForMinutes",2),l([d()],o.prototype,"_triggerCombinator",2),l([d()],o.prototype,"_triggerTargetValue",2),l([d()],o.prototype,"_triggerDeltaMode",2),l([d()],o.prototype,"_triggerBaselineValue",2),l([d()],o.prototype,"_liveBaselineValue",2),l([d()],o.prototype,"_autoCompleteOnRecovery",2),l([d()],o.prototype,"_holdUntilDone",2),l([d()],o.prototype,"_triggerFromState",2),l([d()],o.prototype,"_triggerToState",2),l([d()],o.prototype,"_triggerTargetChanges",2),l([d()],o.prototype,"_triggerRuntimeHours",2),l([d()],o.prototype,"_triggerDaysBefore",2),l([d()],o.prototype,"_triggerRuntimeMaxSession",2),l([d()],o.prototype,"_triggerOnStates",2),l([d()],o.prototype,"_triggerDetailAttribute",2),l([d()],o.prototype,"_compoundLogic",2),l([d()],o.prototype,"_compoundConditions",2),l([d()],o.prototype,"_suggestedAttributes",2),l([d()],o.prototype,"_availableAttributes",2),l([d()],o.prototype,"_entityDomain",2),l([d()],o.prototype,"_lastPerformed",2),l([d()],o.prototype,"_nfcTagId",2),l([d()],o.prototype,"_requireTagScan",2),l([d()],o.prototype,"_allowSkip",2),l([d()],o.prototype,"_notifyEnabled",2),l([d()],o.prototype,"_readingUnit",2),l([d()],o.prototype,"_readings",2),l([d()],o.prototype,"_consumesParts",2),l([d()],o.prototype,"_consumesQtyText",2),l([d()],o.prototype,"_partsLoadFailed",2),l([d()],o.prototype,"_availableTags",2),l([d()],o.prototype,"_responsibleUserId",2),l([d()],o.prototype,"_assigneePool",2),l([d()],o.prototype,"_rotationStrategy",2),l([d()],o.prototype,"_availableUsers",2),l([d()],o.prototype,"_checklistText",2),l([d()],o.prototype,"_phaseDefs",2),l([d()],o.prototype,"_phaseSeq",2),l([d()],o.prototype,"_requiredCompletion",2),l([d()],o.prototype,"_scheduleTime",2),l([d()],o.prototype,"_scheduleTimeOn",2),l([d()],o.prototype,"_actionService",2),l([d()],o.prototype,"_actionTargetEntity",2),l([d()],o.prototype,"_actionSkipAuto",2),l([d()],o.prototype,"_actionPresent",2),l([d()],o.prototype,"_actionData",2),l([d()],o.prototype,"_actionDataJsonFallback",2),l([d()],o.prototype,"_actionTesting",2),l([d()],o.prototype,"_actionTestResult",2),l([d()],o.prototype,"_actionTestError",2),l([d()],o.prototype,"_quickOn",2),l([d()],o.prototype,"_qcNotes",2),l([d()],o.prototype,"_qcCost",2),l([d()],o.prototype,"_qcDuration",2),l([d()],o.prototype,"_qcFeedback",2),l([d()],o.prototype,"_environmentalEntity",2),l([d()],o.prototype,"_environmentalAttribute",2),l([d()],o.prototype,"_adaptiveEnabled",2),l([d()],o.prototype,"_adaptiveAlpha",2),l([d()],o.prototype,"_adaptiveMin",2),l([d()],o.prototype,"_adaptiveMax",2),l([d()],o.prototype,"_adaptiveSeasonal",2),l([d()],o.prototype,"_adaptivePrediction",2),l([d()],o.prototype,"_conditionAttrOptions",2);var V=o;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",V);export{N as a,_e as b,Pe as c,Ne as d,ve as e,fe as f,V as g};
