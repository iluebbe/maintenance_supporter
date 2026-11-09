/*! maintenance_supporter frontend 2.120.0 */
import{b as be,c as B}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-FZBAJK7Q.js";import{b as $e,c as xe,d as Ee,e as we}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-V676DNRW.js";import{f as me}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-VSVLI3HH.js";import{a as fe,c as ye}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LTYRNF5T.js";import{a as ee,b as U}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-A6DSLZGX.js";import{a as Z}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-USO2S64E.js";import{a as S}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-AAV4PYCP.js";import{a as R,b as Y,c as ge}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-CNO6Y325.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-P7FE3DGH.js";import{a as K,d as ce,e as _e,j as pe,k as ue}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-N4K7RQ5B.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-MYV7PCVV.js";import{a as he}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-QCCIWHIG.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-HEGLFC3K.js";import{a as x,b}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-EAZSCT6Y.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-KZBTLQ2G.js";import{a as $}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-THXDFMUN.js";import{d as C,e as ve,f as N,g as O,h as H,i as J,j as X}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-U6FY77DM.js";import{a as F}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-D77BOXRJ.js";import{a as j}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-P3U35WX7.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-3MRKFZSU.js";import{b as w,c as d}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BVOMQN6J.js";import{Q as ae,S as P,X as L,a as l,b as D,e as r,ea as G,fa as oe,h as c,k as re,la as le,ma as de,y as ne,z as i}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-VGLEFN6D.js";var te=["sensor","binary_sensor","number","input_number","input_boolean","counter","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock","plant","input_select","select","input_datetime","date","datetime","timer","update"],Te=["sensor"];var Fe={cleaning:"mdi:broom",inspection:"mdi:magnify",replacement:"mdi:swap-horizontal",calibration:"mdi:tune",service:"mdi:wrench",reading:"mdi:counter",custom:"mdi:wrench-clock"},Ne="mdi:wrench-clock",ie=g=>g&&Fe[g]||Ne;var ke=D`
  ha-dialog.beta-dialog {
    --mdc-dialog-min-width: min(1100px, calc(100vw - 32px));
    --mdc-dialog-max-width: min(1100px, calc(100vw - 32px));
    --ha-dialog-width-md: min(1100px, calc(100vw - 32px));
    --ha-dialog-width-lg: min(1100px, calc(100vw - 32px));
  }
  .beta-content {
    min-width: 0;
  }
  .rules-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
    column-gap: 16px;
    align-items: start;
  }
  .rules-layout > * {
    grid-column: 1;
    min-width: 0;
  }
  /* The rows' spacing is a margin, not a row-gap: the sidebar spans 60 grid
     rows, and every empty one kept its 8 px gap. That was 470 px of nothing
     under the rows, and the dialog's body scrolled beside the sidebar's own
     scrollbar. */
  .rules-layout > :not(.rules-sidebar) {
    margin-bottom: 8px;
  }
  .rules-layout > .rules-sidebar {
    grid-column: 2;
    grid-row: 1 / span 60;
    position: sticky;
    top: 0;
  }
  @media (max-width: 870px) {
    .rules-layout {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      row-gap: 8px;
    }
    .rules-layout > :not(.rules-sidebar) {
      margin-bottom: 0;
    }
    /* Below its row it scrolls with the rows: stuck to the top, it covered
       the rows under it (tablet portrait, phone held sideways). */
    .rules-layout > .rules-sidebar {
      position: static;
    }
    .rules-layout > .rules-sidebar:not(.open) {
      display: none;
    }
  }
  .rules-group-title {
    margin: 12px 0 0;
    font-size: 18px;
    font-weight: 400;
    line-height: 26px;
    color: var(--primary-text-color);
  }
  .rule-row {
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: 48px;
    border: 1px solid var(--divider-color);
    border-radius: 12px;
    background: var(--card-background-color, #fff);
    box-sizing: border-box;
  }
  .rule-row.selected {
    border: 2px solid var(--primary-color);
  }
  .rule-main {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 8px 6px 14px;
    border: 0;
    background: none;
    color: var(--primary-text-color);
    font: inherit;
    text-align: start;
    cursor: pointer;
    border-radius: 12px;
  }
  .rule-main:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }
  .rule-main > ha-icon {
    flex: none;
    color: var(--secondary-text-color);
  }
  .rule-text {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 8px;
    min-width: 0;
    font-size: 14px;
    line-height: 20px;
  }
  .rule-sentence {
    overflow-wrap: anywhere;
  }
  .rule-chip {
    display: inline-flex;
    align-items: center;
    height: 26px;
    padding: 0 10px;
    border-radius: 8px;
    background: var(--secondary-background-color, #e6e6e6);
    color: var(--primary-text-color);
    font-size: 13px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .rule-badge {
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
  }
  .rule-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 2px 10px;
    width: 100%;
  }
  .rule-remove {
    flex: none;
    --ha-icon-button-size: 40px;
    --mdc-icon-button-size: 40px;
    color: var(--secondary-text-color);
  }
  .rule-add {
    justify-self: start;
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding: 0 16px 0 10px;
    border: 0;
    border-radius: 9999px;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
  .rule-add:focus-visible {
    outline: 2px solid var(--primary-text-color);
    outline-offset: 2px;
  }
  /* The head stays put and only the body scrolls: a sticky head covered
     the first controls whenever one was scrolled into view. */
  .rules-sidebar {
    border: 2px solid var(--primary-color);
    border-radius: 16px;
    background: var(--card-background-color, #fff);
    padding: 4px 0 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    max-height: 70vh;
    overflow: hidden;
  }
  .sidebar-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 4px 14px 14px;
  }
  /* In the scrolling column nothing may shrink: the tabs (overflow hidden,
     so no content minimum) were squeezed to nothing under a long list. */
  .sidebar-body > * {
    flex-shrink: 0;
  }
  @media (max-width: 870px) {
    .rules-sidebar {
      max-height: none;
    }
  }
  .rules-sidebar:not(.open) {
    border-style: dashed;
    border-color: var(--divider-color);
  }
  .rules-sidebar .section-title {
    display: none;
  }
  .rules-sidebar .form-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .sidebar-head {
    flex: none;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 14px 0 6px;
    border-bottom: 1px solid var(--divider-color);
  }
  .sidebar-title {
    flex: 1 1 auto;
    font-size: 18px;
    font-weight: 500;
    line-height: 24px;
  }
  .sidebar-hint {
    padding: 16px 18px;
    color: var(--secondary-text-color);
    font-size: 14px;
  }
  .add-tabs {
    display: flex;
    height: 32px;
    border-radius: 9999px;
    overflow: hidden;
    background: var(--secondary-background-color, #e6e6e6);
  }
  .add-tabs button {
    flex: 1 1 0;
    border: 0;
    background: transparent;
    color: var(--secondary-text-color);
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
  .add-tabs button[aria-selected="true"] {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  .add-group {
    margin-top: 4px;
    font-size: 13px;
    font-weight: 500;
    color: var(--secondary-text-color);
  }
  .add-choice {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 44px;
    padding: 6px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 12px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 14px;
    text-align: start;
    cursor: pointer;
  }
  .add-choice:hover {
    border-color: var(--primary-color);
  }
  .add-choice > ha-icon {
    flex: none;
    color: var(--secondary-text-color);
  }
  .add-choice-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .add-choice-note {
    font-size: 12px;
    color: var(--secondary-text-color);
  }
  .device-entity {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px 0;
    border-top: 1px solid var(--divider-color);
  }
  .device-entity-name {
    font-size: 14px;
    font-weight: 500;
  }
  .device-entity-choices {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .device-entity-choices .add-choice {
    width: auto;
    min-height: 36px;
    border-radius: 9999px;
  }
  .chooser {
    display: flex;
    flex-direction: column;
  }
  .chooser-item {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 60px;
    padding: 8px 12px;
    border: 0;
    border-bottom: 1px solid var(--divider-color);
    background: none;
    color: var(--primary-text-color);
    font: inherit;
    text-align: start;
    cursor: pointer;
  }
  .chooser-item:last-child {
    border-bottom: 0;
  }
  .chooser-item:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }
  .chooser-item > ha-icon {
    flex: none;
    color: var(--secondary-text-color);
  }
  .chooser-text {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .chooser-title {
    font-size: 14px;
    line-height: 20px;
  }
  .chooser-desc {
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
  }
  .chooser-search {
    width: 100%;
    box-sizing: border-box;
    padding: 8px 12px;
    margin-bottom: 8px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 14px;
  }
  .chooser-group {
    padding: 12px 12px 4px;
    font-size: 12px;
    font-weight: 500;
    color: var(--secondary-text-color);
  }
  .chooser-empty {
    padding: 16px 12px;
    color: var(--secondary-text-color);
  }
`;var He="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z",Me="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",De="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",Se=["cleaning","inspection","replacement","calibration","service","reading","custom"],je=["time_based","weekdays","nth_weekday","day_of_month","calendar","sensor_based","one_time","manual"],V=["weekdays","nth_weekday","day_of_month","calendar"],Ie=["time_based","one_time",...V],Ae=["threshold","counter","state_change","runtime","due_date"],W=(g,v)=>i(g==="due_date"?"trigger_type_due_date":g,v),Ue=[...Ae,"compound"],T={alpha:"0.3",min:"7",max:"365"},I=X;function z(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",daysBefore:"0",carry:{}}}var Be=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states","trigger_days_before"]);function qe(g){return{type:g.type||"threshold",attribute:g.attribute||"",above:g.trigger_above?.toString()??"",below:g.trigger_below?.toString()??"",equals:g.trigger_equals?.toString()??"",notEquals:g.trigger_not_equals?.toString()??"",forMinutes:g.trigger_for_minutes?.toString()??"0",targetValue:g.trigger_target_value?.toString()??"",deltaMode:g.trigger_delta_mode||!1,fromState:g.trigger_from_state||"",toState:g.trigger_to_state||"",targetChanges:g.trigger_target_changes?.toString()??"",runtimeHours:g.trigger_runtime_hours?.toString()??"",onStates:(g.trigger_on_states||[]).join(", "),daysBefore:g.trigger_days_before?.toString()??"0"}}function Pe(g,v){v.attribute&&(g.attribute=v.attribute);let e=parseInt(v.forMinutes,10);if(v.type==="threshold"){let t=parseFloat(v.above);isNaN(t)||(g.trigger_above=t);let s=parseFloat(v.below);isNaN(s)||(g.trigger_below=s);let n=parseFloat(v.equals);isNaN(n)||(g.trigger_equals=n);let a=parseFloat(v.notEquals);isNaN(a)||(g.trigger_not_equals=a),isNaN(e)||(g.trigger_for_minutes=e)}else if(v.type==="counter"){let t=parseFloat(v.targetValue);isNaN(t)||(g.trigger_target_value=t),g.trigger_delta_mode=v.deltaMode}else if(v.type==="state_change"){v.fromState&&(g.trigger_from_state=v.fromState),v.toState&&(g.trigger_to_state=v.toState);let t=parseInt(v.targetChanges,10);isNaN(t)||(g.trigger_target_changes=t),isNaN(e)||(g.trigger_for_minutes=e)}else if(v.type==="runtime"){let t=parseFloat(v.runtimeHours);isNaN(t)||(g.trigger_runtime_hours=t);let s=(v.onStates||"").split(",").map(n=>n.trim()).filter(Boolean);s.length>0&&(g.trigger_on_states=s)}else if(v.type==="due_date"){let t=parseInt(v.daysBefore,10);g.trigger_days_before=isNaN(t)?0:t}}function We(g){return{entityIds:Y(g).join(", "),...qe(g),carry:Object.fromEntries(Object.entries(g).filter(([e])=>!Be.has(e)&&!e.startsWith("_")))}}function ze(g){let v=g.entityIds.split(",").map(t=>t.trim()).filter(Boolean);if(v.length===0)return null;let e={...g.carry||{},entity_id:v[0],entity_ids:v,type:g.type};return Pe(e,g),e}function Ve(g){return Array.from({length:7},(v,e)=>G(e,g,"short"))}function Ce(g){return Array.from({length:12},(v,e)=>oe(e,g,"short"))}function Qe(g){let v=Array.isArray(g)?g.filter(e=>e!=null&&e!=="").join(", "):g!==null&&typeof g=="object"||g==null?"":String(g);return v.length>40?`${v.slice(0,39)}\u2026`:v}var o=class o extends re{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.adaptiveFeature=!1;this.seasonalFeature=!1;this.environmentalFeature=!1;this.defaultWarningDays=7;this.mirrorTodoDefault=[];this.betaEditor=!1;this._ruleSel=null;this._addTab="type";this._betaStep="form";this._chooserFilter="";this._templateChoices=null;this._copyChoices=null;this._objectDevice=null;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._warning="";this._entryId="";this._taskId=null;this._series=[];this._seriesIndex=0;this._isFleetTask=!1;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._calMonths=[];this._hadCalMonths=!1;this._calendarEntity="";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._notifyIcon="";this._priority="normal";this._labels="";this._detailsOpen=!1;this._mirrorTodoEntities=[];this._mirrorTodoMode="default";this._completeWhenEntity="";this._completeWhenState="";this._completeWhenAnyTime=!1;this._completeWhenFor="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._holdUntilDone=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerDaysBefore="0";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._triggerDetailAttribute="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._notifyEnabled=!0;this._readingUnit="";this._readings=[];this._consumesParts={};this._consumesQtyText={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._loadedLastPerformed="";this._loadedResponsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._scheduleTimeOn=!1;this._actionService="";this._actionTargetEntity="";this._actionTargetStored=null;this._actionTargetInitial="";this._actionSkipAuto=!1;this._actionPresent=!1;this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._quickOn=!1;this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=T.alpha;this._adaptiveMin=T.min;this._adaptiveMax=T.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._adaptiveWasEnabled=!1;this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set;this._attrSeq=0}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return ne(this.hass)}async openCreate(e,t){this._series=[],this._entryId=e,this._taskId=null,this._isFleetTask=!1,this._error="",this._warning="";let s=(t||[]).filter(n=>!n.object.archived&&!n.object.archived_at);!e&&s.length>0?(this._objectChoices=s.map(n=>({entry_id:n.entry_id,name:n.object.name})).sort((n,a)=>n.name.localeCompare(a.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),this._betaStep=this.betaEditor?"choose":"form",this._ruleSel="task",this._addTab="type",this._chooserFilter="",await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(e,t){this._series=[],await this._edit(e,t)}async openEditSeries(e){e.length!==0&&(this._series=e,await this._editSeriesItem(0))}async _editSeriesItem(e){let t=this._series[e];this._seriesIndex=e,await this._edit(t.entryId,t.task),await this.updateComplete,this.shadowRoot?.querySelector(".dialog-title")?.scrollIntoView({block:"start"})}_skipSeriesItem(){this._editSeriesItem(this._seriesIndex+1)}async _edit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._warning="",this._betaStep="form",this._ruleSel=null,this._addTab="type",this._objectChoices=[],this._isFleetTask=t.battery_fleet_task===!0,this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let s=t.schedule;this._weekdays=s?.kind==="weekdays"?[...s.weekdays??[]]:[],this._nth=s?.kind==="nth_weekday"?String(s.nth??1):"1",this._nthWeekday=s?.kind==="nth_weekday"?String(s.weekday??5):"5",this._domDay=s?.kind==="day_of_month"&&(s.day??1)>=1?String(s.day??1):"1",this._domLastDay=s?.kind==="day_of_month"&&s.day===-1,this._domBusiness=s?.kind==="day_of_month"&&s.business===!0,this._calMonths=(s?.kind==="day_of_month"||s?.kind==="nth_weekday")&&Array.isArray(s.months)?[...s.months]:[],this._hadCalMonths=this._calMonths.length>0,this._calendarEntity=s?.kind==="calendar"&&s.entity_id||"",this._calOffset=s?.offset?String(s.offset):"0",this._seasonMonths=Array.isArray(s?.season_months)?[...s.season_months]:[];let n=s?.ends;n&&typeof n.count=="number"?(this._endsMode="count",this._endsCount=String(n.count),this._endsUntil=""):n&&typeof n.until=="string"?(this._endsMode="until",this._endsUntil=n.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=t.warning_days.toString(),this._earliestCompletionDays=t.earliest_completion_days!=null?String(t.earliest_completion_days):"",this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._notifyIcon=t.notify_icon||"",this._priority=t.priority||"normal",this._labels=(t.labels||[]).join(", "),this._mirrorTodoEntities=[...t.mirror_todo_entities||[]],this._mirrorTodoMode=this._mirrorTodoEntities.length?"own":t.mirror_todo_use_default===!1?"none":"default",this._completeWhenEntity=t.complete_when?.entity_id||"",this._completeWhenState=t.complete_when?.to_state||"",this._completeWhenAnyTime=!!t.complete_when?.any_time,this._completeWhenFor=t.complete_when?.for_minutes?String(t.complete_when.for_minutes):"",this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._loadedLastPerformed=this._lastPerformed,this._nfcTagId=t.nfc_tag_id||"",this._requireTagScan=!!t.require_tag_scan,this._allowSkip=t.allow_skip!==!1,this._notifyEnabled=t.notify_enabled!==!1,this._readingUnit=t.reading_unit||"",this._readings=(t.readings||[]).map(p=>({...p})),this._consumesParts=Object.fromEntries((t.consumes_parts||[]).map(p=>[K(p),{...p}])),this._consumesQtyText={},this._responsibleUserId=t.responsible_user_id||null,this._loadedResponsibleUserId=this._responsibleUserId,this._assigneePool=[...t.assignee_pool||[]],this._rotationStrategy=t.rotation_strategy||"",this._checklistText=(t.checklist||[]).join(`
`),this._phaseDefs=Object.entries(t.phases||{}).map(([p,m])=>{let{name:f,checklist:u,consumes_parts:y,required_completion_fields:E,...A}=m,k=m.consumes_parts||[],q=k.findIndex(M=>!M.entry_id),Q=q>=0?k[q]:void 0;return{id:p,name:m.name||p,checklistText:(m.checklist||[]).join(`
`),partId:Q?.part_id||"",partQty:Q?.quantity!=null?String(Q.quantity):"",reqOverride:m.required_completion_fields!==void 0,reqFields:[...m.required_completion_fields||[]],extraParts:k.filter((M,Re)=>Re!==q).map(M=>({...M})),carry:A}}),this._phaseSeq=[...t.phase_sequence||[]],this._requiredCompletion=[...t.required_completion_fields||[]],this._scheduleTime=t.schedule_time||"",this._scheduleTimeOn=!!t.schedule_time;let a=t.on_complete_action;if(a&&a.service){this._actionService=a.service;let p=a.target?.entity_id;this._actionTargetEntity=Array.isArray(p)?p[0]||"":p||"",this._actionTargetStored=a.target&&typeof a.target=="object"?JSON.parse(JSON.stringify(a.target)):null,this._actionTargetInitial=this._actionTargetEntity,this._actionData=a.data&&typeof a.data=="object"?{...a.data}:{},this._actionDataJsonFallback="",this._actionSkipAuto=a.skip_auto===!0,this._actionPresent=!0}else this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1;let h=t.quick_complete_defaults;this._quickOn=he(t),this._qcNotes=h?.notes||"",this._qcCost=h?.cost!=null?String(h.cost):"",this._qcDuration=h?.duration!=null?String(h.duration):"",this._qcFeedback=h?.feedback||"";let _=t.adaptive_config||{};if(this._environmentalEntity=_.environmental_entity||"",this._environmentalAttribute=_.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!_.enabled,this._adaptiveAlpha=_.ewa_alpha?.toString()??T.alpha,this._adaptiveMin=_.min_interval_days?.toString()??T.min,this._adaptiveMax=_.max_interval_days?.toString()??T.max,this._adaptiveSeasonal=_.seasonal_enabled!==!1,this._adaptivePrediction=_.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=this._adaptiveEnabled,t.trigger_config){let p=t.trigger_config;this._triggerEntityId=ge(p)||"",this._triggerEntityIds=Y(p),this._triggerEntityLogic=p.entity_logic||"any",this._setTypeFields(qe(p)),this._triggerCombinator=p.trigger_combinator==="all"?"all":"any",this._triggerBaselineValue=p.trigger_baseline_value?.toString()||"",this._liveBaselineValue=t.trigger_baseline_value??null,this._autoCompleteOnRecovery=p.auto_complete_on_recovery||!1,this._holdUntilDone=p.trigger_hold_until_done===!0,this._triggerRuntimeMaxSession=p.trigger_runtime_max_session_seconds?.toString()||"",this._triggerDetailAttribute=p.detail_attribute||"",p.type==="compound"?(this._compoundLogic=p.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(p.conditions||[]).map(We)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),this._detailsOpen=this._priority!=="normal"||!!this._labels.trim()||!!this._documentationUrl.trim()||!!this._customIcon,await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._detailsOpen=!1,this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._calMonths=[],this._hadCalMonths=!1,this._calendarEntity="",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._notifyIcon="",this._priority="normal",this._labels="",this._mirrorTodoEntities=[],this._mirrorTodoMode="default",this._completeWhenEntity="",this._completeWhenState="",this._completeWhenAnyTime=!1,this._completeWhenFor="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._notifyEnabled=!0,this._readingUnit="",this._readings=[],this._consumesParts={},this._consumesQtyText={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._scheduleTimeOn=!1,this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=T.alpha,this._adaptiveMin=T.min,this._adaptiveMax=T.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=!1,this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1,this._actionTesting=!1,this._actionTestResult="",this._actionTestError="",this._quickOn=!1,this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_typeFields(){return{type:this._triggerType,attribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,equals:this._triggerEquals,notEquals:this._triggerNotEquals,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,onStates:this._triggerOnStates,daysBefore:this._triggerDaysBefore}}_setTypeFields(e){this._triggerType=e.type,this._triggerAttribute=e.attribute,this._triggerAbove=e.above,this._triggerBelow=e.below,this._triggerEquals=e.equals,this._triggerNotEquals=e.notEquals,this._triggerForMinutes=e.forMinutes,this._triggerTargetValue=e.targetValue,this._triggerDeltaMode=e.deltaMode,this._triggerFromState=e.fromState,this._triggerToState=e.toState,this._triggerTargetChanges=e.targetChanges,this._triggerRuntimeHours=e.runtimeHours,this._triggerOnStates=e.onStates,this._triggerDaysBefore=e.daysBefore}_resetTriggerFields(){++this._attrSeq,this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._setTypeFields(z()),this._triggerCombinator="any",this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._holdUntilDone=!1,this._triggerRuntimeMaxSession="",this._triggerDetailAttribute="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new me(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}_toggleAssignee(e){this._assigneePool=this._assigneePool.includes(e)?this._assigneePool.filter(t=>t!==e):[...this._assigneePool,e]}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError=i("action_test_bad_format",this._lang),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,s]=e.split(".");if(!this.hass?.services?.[t]?.[s]){this._actionTestResult="error",this._actionTestError=i("action_test_unknown_service",this._lang).replace("{service}",e),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let n=this._actionTargetEntity.trim();if(n){let a=n.split(".")[0];if(a!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=i("action_test_domain_mismatch",this._lang).replace("{service}",e).replace("{domain}",t).replace("{entity}",n).replace("{entity_domain}",a).replace("{suggestion}",`${a}.${s}`),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[n]){this._actionTestResult="error",this._actionTestError=i("action_test_entity_missing",this._lang).replace("{entity}",n),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,s]=e.split("."),n=this.hass?.services?.[t]?.[s]?.fields;return!n||Object.keys(n).length===0?null:Object.entries(n).map(([a,h])=>({name:a,required:!!h.required,selector:h.selector||{text:{}}}))}_actionTargetExtended(){let e=this._actionTargetStored;return e?Object.entries(e).some(([t,s])=>t==="entity_id"?Array.isArray(s)&&s.length>1:Array.isArray(s)?s.length>0:!!s):!1}_actionTargetSummary(){let e=this._actionTargetStored||{},t=n=>(Array.isArray(n)?n:[n]).filter(a=>typeof a=="string"&&!!a),s=this.hass;return[...t(e.entity_id).map(n=>R(this.hass,n)),...t(e.device_id).map(n=>s.devices?.[n]?.name_by_user||s.devices?.[n]?.name||n),...t(e.area_id).map(n=>s.areas?.[n]?.name||n),...t(e.floor_id).map(n=>s.floors?.[n]?.name||n),...t(e.label_id)].join(", ")}_renderQuickComplete(e){let t={notes:!!this._qcNotes.trim(),cost:!isNaN(parseFloat(this._qcCost)),duration:Z(this._qcDuration)!==null,photo:!1,user:!0},s=this._requiredCompletion.filter(a=>!t[a]),n=!!this._checklistText.trim()||this._readings.length>0;return r`
      ${$({cls:"req-option quick-complete-switch",checked:this._quickOn,onChange:a=>this._quickOn=a.target.checked},r`<span>${i("quick_complete_label",e)}</span>`)}
      ${this._quickOn?r`
            <div class="field-help">${i("quick_complete_help",e)}</div>
            ${s.length?r`<div class="field-help quick-complete-note">${i("quick_complete_needs_dialog",e).replace("{fields}",s.map(a=>i(U[a],e)).join(", "))}</div>`:c}
            ${this._requireTagScan?r`<div class="field-help quick-complete-note">${i("quick_complete_tag_hint",e)}</div>`:c}
            ${n?r`<div class="field-help">${i("quick_complete_not_asked",e)}</div>`:c}
            ${S({cls:"ca-section quick-complete-values",open:Object.values(t).slice(0,3).some(Boolean)||!!this._qcFeedback,header:i("quick_complete_values",e)},r`
              <p class="field-help">${i("quick_complete_values_help",e)}</p>
              <ms-textfield
                label="${i("quick_complete_defaults_notes",e)}"
                .value=${this._qcNotes}
                @input=${a=>{this._qcNotes=a.target.value}}
              ></ms-textfield>
              <div class="qc-cost">
                <span class="qc-cost-label">${i("quick_complete_defaults_cost",e)}</span>
                <ms-cost-input .lang=${e} .value=${this._qcCost}
                  @value-changed=${a=>{this._qcCost=a.detail.value}}></ms-cost-input>
              </div>
              <ms-textfield
                label="${i("quick_complete_defaults_duration",e)}"
                type="number" min="0" step="1"
                .value=${this._qcDuration}
                @input=${a=>{this._qcDuration=a.target.value}}
              ></ms-textfield>
              ${b({label:i("was_maintenance_needed",e),cls:"qc-feedback",value:this._qcFeedback,onChange:a=>{this._qcFeedback=a.target.value}},r`
                <option value="">${i("quick_complete_defaults_feedback_none",e)}</option>
                <option value="needed">${i("quick_complete_defaults_feedback_needed",e)}</option>
                <option value="not_needed">${i("quick_complete_defaults_feedback_not_needed",e)}</option>
                <option value="not_sure">${i("feedback_not_sure",e)}</option>
              `)}
            `)}
          `:c}
    `}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled&&!this._actionPresent)return c;let t=this._serviceSchema();return r`
      ${S({cls:"ca-section",header:i("on_complete_action_title",e)},r`
        <p class="field-help">${i("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${s=>{this._actionService=s.detail.value||"";let n=this._serviceSchema();if(n){let a=new Set(n.map(h=>h.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([h])=>a.has(h)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>i("on_complete_action_target",e)}
          @value-changed=${s=>{let n=s.detail.value;this._actionTargetEntity=n.target_entity||""}}
        ></ha-form>
        ${this._actionTargetExtended()&&this._actionTargetEntity.trim()===this._actionTargetInitial?r`<p class="field-help ca-target-more">${i("on_complete_action_target_more",e).replace("{targets}",this._actionTargetSummary())}</p>`:c}
        <p class="field-help ca-domain-hint">
          ${i("on_complete_action_target_hint",e)}
        </p>
        ${$({cls:"ca-skip-auto",checked:this._actionSkipAuto,onChange:s=>{this._actionSkipAuto=s.target.checked}},r`<span>${i("on_complete_action_skip_auto",e)}</span>`)}
        ${t?r`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${t}
                .data=${this._actionData}
                @value-changed=${s=>{this._actionData={...s.detail.value}}}
              ></ha-form>
            `:r`
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
          ${this._actionTestResult==="ok"?r`<span class="ca-test-ok">${i("on_complete_action_test_success",e)}</span>`:c}
          ${this._actionTestResult==="error"?r`<div class="ca-test-error-block">
                <span class="ca-test-error">${i("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?r`<div class="ca-test-error-detail">${this._actionTestError}</div>`:c}
              </div>`:c}
        </div>
      `)}

    `}_knownObjects(e){return this.objects?.some(t=>t.entry_id===e)?this.objects:void 0}async _loadParts(){this.parts=[];let e=this._entryId;if(!e)return;let t=this._knownObjects(e)?.find(s=>s.entry_id===e);if(t){this.parts=t.parts||[],this._partsLoadFailed=!1;return}try{let s=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e});if(e!==this._entryId)return;this.parts=s.parts||[],this._partsLoadFailed=!1}catch{if(e!==this._entryId)return;this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){this._foreignOwners=[];let e=this._entryId;if(e)try{let t=this._knownObjects(e)??(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"})).objects;if(e!==this._entryId)return;this._foreignOwners=(t||[]).filter(s=>s.entry_id!==e&&(s.parts||[]).length>0).map(s=>({entry_id:s.entry_id,name:s.object?.name||s.entry_id,parts:s.parts||[]})).sort((s,n)=>s.name.localeCompare(n.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(e){!e||!this.hass||this._conditionAttrOptions[e]||this._conditionAttrPending.has(e)||(this._conditionAttrPending.add(e),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e}).then(t=>{let s=t;this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:s.suggested_attributes||[],available:s.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(e){let t=++this._attrSeq;if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let s=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});if(t!==this._attrSeq)return;this._entityDomain=s.domain||"",this._suggestedAttributes=s.suggested_attributes||[],this._availableAttributes=s.available_attributes||[]}catch{if(t!==this._attrSeq)return;this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(e=>!!e.entry_id)}_renderConsumesRow(e,t){let s=K({part_id:e.id,entry_id:t}),n=this._consumesParts[s],a=t?{part_id:e.id,quantity:1,entry_id:t}:{part_id:e.id,quantity:1};return r`
      <div class="consumes-row">
        ${$({cls:"consumes-check",checked:n!==void 0,onChange:h=>{let _={...this._consumesParts};if(h.target.checked)_[s]=_[s]||a;else{delete _[s];let p={...this._consumesQtyText};delete p[s],this._consumesQtyText=p}this._consumesParts=_}},r`<span>${e.name}${e.unit?` (${e.unit})`:""}</span>`)}
        ${n!==void 0?r`<input
              class="consumes-qty"
              aria-label=${`${e.name}: ${i("quantity",this._lang)}`}
              type="number"
              min=${I[0]}
              max=${I[1]}
              step="0.01"
              .value=${this._consumesQtyText[s]??String(n.quantity)}
              @input=${h=>{let _=h.target.value;this._consumesQtyText={...this._consumesQtyText,[s]:_};let p=parseFloat(_.replace(",","."));Number.isFinite(p)&&p>=I[0]&&(this._consumesParts={...this._consumesParts,[s]:{...a,quantity:p}})}}
            />`:c}
      </div>
    `}_applyConsumesQtyText(){let e={...this._consumesParts};for(let t of Object.keys(e)){let s=this._consumesQtyText[t];if(s===void 0)continue;let n=parseFloat(s.replace(",","."));if(!Number.isFinite(n)||n<I[0]||n>I[1]){let a=h=>P(h,this._lang,{maximumFractionDigits:2});return this._error=i("settings_value_out_of_range",this._lang).replace("{min}",a(I[0])).replace("{max}",a(I[1])),!1}e[t]={...e[t],quantity:n}}return this._consumesParts=e,!0}_toggleRequired(e,t){let s=new Set(this._requiredCompletion);t?s.add(e):s.delete(e),this._requiredCompletion=[...s]}_patchReading(e,t){this._readings=this._readings.map(s=>s.id===e?{...s,...t}:s)}_renderReadingsEditor(e){let t=pe(this._readings);return r`
      <div class="readings-editor">
        <div class="field-label">${i("readings_section",e)}</div>
        <div class="field-help">${i("readings_hint",e)}</div>
        ${this._readings.map(s=>r`
          ${t.has(s.id)?r`<div class="field-help reading-dup">${i("reading_duplicate_name",e)}</div>`:c}
          <div class="reading-row">
            <ms-textfield
              class="reading-name"
              label="${i("reading_name_label",e)}"
              .value=${s.name}
              @input=${n=>this._patchReading(s.id,{name:n.target.value})}
            ></ms-textfield>
            <ms-textfield
              class="reading-unit"
              label="${i("reading_unit_short",e)}"
              .value=${s.unit||""}
              @input=${n=>this._patchReading(s.id,{unit:n.target.value})}
            ></ms-textfield>
            <ha-icon-button class="phase-remove reading-remove" .label=${i("remove",e)} @click=${()=>this._readings=this._readings.filter(n=>n.id!==s.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
        `)}
        ${this._readings.length<ce?r`
          <ha-button appearance="plain" class="reading-add"
            @click=${()=>this._readings=[...this._readings,{id:_e(),name:"",unit:this._readings.length?this._readings[this._readings.length-1].unit:this._readingUnit}]}>
            <ha-icon icon="mdi:plus"></ha-icon> ${i("reading_add",e)}
          </ha-button>`:c}
      </div>
    `}_phaseSlug(e){let t=e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",s=t,n=2;for(;this._phaseDefs.some(a=>a.id===s);)s=`${t}-${n++}`;return s}_addPhaseDef(){let e=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:e,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(e){this._phaseDefs=this._phaseDefs.filter(t=>t.id!==e),this._phaseSeq=this._phaseSeq.filter(t=>t!==e)}_patchPhaseDef(e,t){this._phaseDefs=this._phaseDefs.map(s=>s.id===e?{...s,...t}:s)}_renderPhasesEditor(e){let t=s=>this._phaseDefs.find(n=>n.id===s)?.name||s;return r`
      ${S({cls:"phases-section",open:this._phaseDefs.length>0,header:i("phases_section",e)},r`
      <div class="field-help">${i("phases_hint",e)}</div>
      ${this._phaseDefs.map(s=>r`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${i("phase_name",e)}"
              .value=${s.name}
              @input=${n=>this._patchPhaseDef(s.id,{name:n.target.value})}
            ></ms-textfield>
            ${this.parts.length?r`
              ${b({label:i("spare_part",e),cls:"phase-part",value:s.partId,onChange:n=>{let a=n.target.value;this._patchPhaseDef(s.id,s.partQty?{partId:a}:{partId:a,partQty:"1"})}},r`
                <option value="">—</option>
                ${this.parts.map(n=>r`<option value=${n.id} ?selected=${n.id===s.partId}>${n.name}</option>`)}
              `)}
              ${s.partId?r`
                <!-- The typed text as-is: a "|| '1'" here rewrote a cleared
                     field to 1 and the next digit gave "13" (bug audit
                     2026-09-26 #2); an empty field saves as 1. -->
                <input class="phase-qty" aria-label=${i("quantity",e)} type="number" min=${X[0]} step="0.01" placeholder="1" .value=${s.partQty}
                  @input=${n=>this._patchPhaseDef(s.id,{partQty:n.target.value})} />
              `:c}
            `:c}
            <ha-icon-button class="phase-remove" .label=${i("remove",e)} @click=${()=>this._removePhaseDef(s.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
          ${this.checklistsEnabled?r`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${i("checklist_placeholder",e)}"
              .value=${s.checklistText}
              @input=${n=>this._patchPhaseDef(s.id,{checklistText:n.target.value})}
            ></textarea>
          `:c}
          ${$({cls:"req-option phase-req-toggle",checked:s.reqOverride,onChange:n=>this._patchPhaseDef(s.id,{reqOverride:n.target.checked})},r`<span>${i("phase_require_override",e)}</span>`)}
          ${s.reqOverride?r`
            <div class="required-completion phase-req-fields">
              ${ee.map(n=>r`
                ${$({cls:"req-option",checked:s.reqFields.includes(n),onChange:a=>{let h=a.target.checked,_=new Set(s.reqFields);h?_.add(n):_.delete(n),this._patchPhaseDef(s.id,{reqFields:[..._]})}},r`<span>${i(U[n],e)}</span>`)}
              `)}
            </div>
          `:c}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${i("phase_add",e)}
      </ha-button>
      ${this._phaseDefs.some(s=>s.name.trim())?r`
        <div class="phase-seq-label">${i("phase_sequence_label",e)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((s,n)=>r`
            <span class="phase-chip">
              ${n+1}. ${t(s)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((a,h)=>h!==n)}}>✕</button>
            </span>
          `)}
          ${b({label:i("phase_sequence_add_step",e),cls:"phase-seq-add",value:"",onChange:s=>{let n=s.target.value;n&&(this._phaseSeq=[...this._phaseSeq,n]),s.target.value=""}},r`
            <option value="">+ ${i("phase_sequence_add_step",e)}</option>
            ${this._phaseDefs.filter(s=>s.name.trim()).map(s=>r`<option value=${s.id}>${s.name}</option>`)}
          `)}
        </div>
      `:c}
      `)}
    `}async _save(){if(this._loading||!this._name.trim()||this._missingDueDate())return;if(this._adaptiveSnapshot()!==this._adaptiveInitial){let t=parseInt(this._adaptiveMin,10),s=parseInt(this._adaptiveMax,10);if(!isNaN(t)&&!isNaN(s)&&t>s){this._error=`${i("adaptive_min_interval",this._lang)} > ${i("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=i("trigger_hint_overlap",this._lang);return}if(this._scheduleType==="calendar"&&!this._calendarEntity.trim().startsWith("calendar.")){this._error=i("calendar_entity_required",this._lang);return}if(!this._applyConsumesQtyText())return;if(this._completeWhenEntity&&parseInt(this._completeWhenFor,10)>C[1]){this._error=i("settings_value_out_of_range",this._lang).replace("{min}","1").replace("{max}",P(C[1],this._lang));return}this._loading=!0,this._error="";let e;try{let t=await j(this,()=>this.hass.connection.sendMessagePromise(this._savePayload()),{fallbackKey:"save_error",onError:h=>{this._error=h}});if(t===void 0)return;let s=this._taskId||t?.task_id,n=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;this._warning="";let a=h=>{this._warning=i("subsave_warning",this._lang).replace("{detail}",h)};if(s&&this._scheduleType==="sensor_based"&&n&&await j(this,{type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:s,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null},{onError:a})!==void 0&&(this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute),s&&this._adaptiveSnapshot()!==this._adaptiveInitial){let h=parseFloat(this._adaptiveAlpha),_=parseInt(this._adaptiveMin,10),p=parseInt(this._adaptiveMax,10);await j(this,{type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:s,enabled:this._adaptiveEnabled,...h>=H[0]&&h<=H[1]?{ewa_alpha:h}:{},...!isNaN(_)&&_>=1?{min_interval_days:_}:{},...!isNaN(p)&&p>=1?{max_interval_days:p}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction},{onError:a})!==void 0&&(this._adaptiveInitial=this._adaptiveSnapshot())}this._warning?s&&(this._taskId=s):this._seriesIndex+1<this._series.length?e=this._seriesIndex+1:(this._open=!1,this._series=[]),this.dispatchEvent(new CustomEvent("task-saved"))}finally{this._loading=!1}e!==void 0&&await this._editSeriesItem(e)}_missingDueDate(){return this._scheduleType==="one_time"&&!this._dueDate}_savePayload(){let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},t=this._earliestCompletionDays.trim();e.earliest_completion_days=t===""?null:Math.max(0,parseInt(t,10)||0),this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):V.includes(this._scheduleType)?(e.schedule={...this._buildSchedule(),...this._recurrenceExtras()},e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(e.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.notify_icon=this._notifyIcon.trim()||null,e.priority=this._priority,e.labels=this._labels.split(",").map(a=>a.trim()).filter(Boolean);let s=this.mirrorTodoDefault.length&&this._mirrorTodoMode!=="own"?[]:B(this.hass,this._mirrorTodoEntities);e.mirror_todo_entities=s,e.mirror_todo_use_default=this.mirrorTodoDefault.length?this._mirrorTodoMode==="default":this._mirrorTodoMode!=="none",e.enabled=this._enabled,(!this._taskId||this._lastPerformed!==this._loadedLastPerformed)&&(e.last_performed=this._lastPerformed||null),e.nfc_tag_id=this._nfcTagId||null,e.require_tag_scan=this._requireTagScan,e.allow_skip=this._allowSkip;let n=parseInt(this._completeWhenFor,10);e.complete_when=this._completeWhenEntity&&this._completeWhenState.trim()?{entity_id:this._completeWhenEntity,to_state:this._completeWhenState.trim(),...this._completeWhenAnyTime?{any_time:!0}:{},...n>0?{for_minutes:n}:{}}:null,e.notify_enabled=this._notifyEnabled,e.reading_unit=this._readingUnit.trim()||null,e.readings=ue(this._readings);{let a={};for(let _ of this._phaseDefs){if(!_.name.trim())continue;let p={..._.carry,name:_.name.trim()},m=_.checklistText.split(`
`).map(u=>u.trim()).filter(Boolean);m.length&&(p.checklist=m);let f=[];if(_.partId){let u=parseFloat(_.partQty);f.push({part_id:_.partId,quantity:Number.isFinite(u)&&u>0?u:1})}for(let u of _.extraParts)f.push(u.entry_id?{part_id:u.part_id,quantity:u.quantity,entry_id:u.entry_id}:{part_id:u.part_id,quantity:u.quantity});f.length&&(p.consumes_parts=f),_.reqOverride&&(p.required_completion_fields=[..._.reqFields]),a[_.id]=p}let h=this._phaseSeq.filter(_=>_ in a);e.phases=Object.keys(a).length&&h.length?a:null,e.phase_sequence=e.phases?h:null}if((this.parts.length||this._foreignOwners.length)&&(e.consumes_parts=Object.values(this._consumesParts).map(a=>a.entry_id?{part_id:a.part_id,quantity:a.quantity,entry_id:a.entry_id}:{part_id:a.part_id,quantity:a.quantity})),(!this._taskId||this._responsibleUserId!==this._loadedResponsibleUserId)&&(e.responsible_user_id=this._responsibleUserId),e.assignee_pool=this._assigneePool,e.required_completion_fields=this._requiredCompletion,e.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let a=this._compoundConditions.map(ze).filter(h=>h!==null);if(a.length>0){let h={type:"compound",compound_logic:this._compoundLogic,conditions:a};this._autoCompleteOnRecovery&&(h.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(h.trigger_combinator="all"),this._triggerDetailAttribute&&(h.detail_attribute=this._triggerDetailAttribute),e.trigger_config=h}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let a=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],h={entity_id:a[0],entity_ids:a,type:this._triggerType};if(Pe(h,this._typeFields()),this._holdUntilDone&&this._endsByItself()?h.trigger_hold_until_done=!0:this._autoCompleteOnRecovery&&(h.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(h.trigger_combinator="all"),this._triggerDetailAttribute&&(h.detail_attribute=this._triggerDetailAttribute),a.length>1&&(h.entity_logic=this._triggerEntityLogic),this._triggerType==="counter"&&this._triggerDeltaMode&&this._triggerBaselineValue){let _=parseFloat(this._triggerBaselineValue);!isNaN(_)&&_>=0&&(h.trigger_baseline_value=_)}else if(this._triggerType==="runtime"&&this._triggerRuntimeMaxSession){let _=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(_)&&_>0&&(h.trigger_runtime_max_session_seconds=_)}e.trigger_config=h}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&Ie.includes(this._scheduleType)){let a=this._scheduleTimeOn?this._scheduleTime.trim():"";e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(a)?a:null}if(this.checklistsEnabled){let a=this._checklistText.split(`
`).map(h=>h.trim()).filter(Boolean).slice(0,100);e.checklist=a.length?a:null}if(this.completionActionsEnabled||this._actionPresent){let a=this._actionService.trim();if(a&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(a)){let h={service:a},_=this._actionTargetEntity.trim();this._actionTargetStored&&_===this._actionTargetInitial?h.target=JSON.parse(JSON.stringify(this._actionTargetStored)):_&&(h.target={entity_id:_});let p=this._buildActionData();Object.keys(p).length>0&&(h.data=p),this._actionSkipAuto&&(h.skip_auto=!0),e.on_complete_action=h}else e.on_complete_action=null}{let a={};this._qcNotes.trim()&&(a.notes=this._qcNotes.trim());let h=parseFloat(this._qcCost);isNaN(h)||(a.cost=h);let _=Z(this._qcDuration);_!==null&&(a.duration=_),this._qcFeedback&&(a.feedback=this._qcFeedback),e.quick_complete_defaults=this._quickOn?a:null}return e}_close(){this._open=!1,this._series=[],this._warning="",this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return c;let e=this._lang,t=this._triggerType==="compound";return r`
      <div class="select-row">
        ${x()?c:r`<label>${i("trigger_type",e)}</label>`}
        ${b({label:i("trigger_type",e),value:this._triggerType,onChange:s=>{this._triggerType=s.target.value,this._seedUpdateRule()}},r`
          ${Ue.map(s=>r`<option value=${s} ?selected=${s===this._triggerType}>${W(s,e)}</option>`)}
        `)}
      </div>
      ${t?this._renderCompoundEditor():r`
        ${this._entityPickerFallback?r`
          <ms-textfield
            label="${i("entity_id",e)} (${i("comma_separated",e)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${s=>{let a=s.target.value.split(",").map(h=>h.trim()).filter(Boolean);this._triggerEntityId=a[0]||"",this._triggerEntityIds=a,this._seedUpdateRule(),a[0]&&this._fetchEntityAttributes(a[0])}}
          ></ms-textfield>
        `:r`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:te}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>i("entity_id",e)}
          @value-changed=${s=>{let n=(s.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=n[0]||"",this._triggerEntityIds=n,this._seedUpdateRule(),n[0]?this._fetchEntityAttributes(n[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?r`
          <div class="select-row">
            ${x()?c:r`<label>${i("entity_logic",e)}</label>`}
            ${b({label:i("entity_logic",e),value:this._triggerEntityLogic,onChange:s=>this._triggerEntityLogic=s.target.value},r`
              <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${i("entity_logic_any",e)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${i("entity_logic_all",e)}</option>
            `)}
          </div>
        `:c}
        ${this._renderAttributeSelect({label:i("attribute_optional",e),value:this._triggerAttribute,suggested:this._suggestedAttributes,available:this._availableAttributes,onSelect:s=>this._triggerAttribute=s})}
        ${this._renderTriggerTypeFields()}
        ${this._renderTriggerLiveHint()}
      `}
      ${this._renderDetailAttributeSelect(e)}
      ${this._endsByItself()?this._renderTriggerEnd(e):r`
        ${$({checked:this._autoCompleteOnRecovery,onChange:s=>this._autoCompleteOnRecovery=s.target.checked},r`${i("auto_complete_on_recovery",e)}`)}
        <div class="field-help">${i("auto_complete_on_recovery_help",e)}</div>
      `}
      <ms-textfield
        label="${i("safety_interval",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${s=>this._intervalDays=s.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():c}
      ${this._intervalDays?r`
            <div class="select-row">
              ${x()?c:r`<label>${i("trigger_combinator",e)}</label>`}
              ${b({label:i("trigger_combinator",e),onChange:s=>this._triggerCombinator=s.target.value},r`
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${i("trigger_combinator_any",e)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${i("trigger_combinator_all",e)}</option>
              `)}
            </div>
          `:c}
    `}_patchCondition(e,t){this._compoundConditions=this._compoundConditions.map((s,n)=>n===e?{...s,...t}:s)}_addCondition(){this._compoundConditions=[...this._compoundConditions,z()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((t,s)=>s!==e),this.betaEditor&&this._compoundConditions.length===1&&this._flattenCompound()}_flattenCompound(){let[e]=this._compoundConditions;if(!e)return;let t=e.entityIds.split(",").map(h=>h.trim()).filter(Boolean),{entityIds:s,carry:n,...a}=e;this._compoundConditions=[],this._setTypeFields(a),this._triggerEntityId=t[0]||"",this._triggerEntityIds=t,t[0]&&this._fetchEntityAttributes(t[0])}_renderCompoundEditor(){let e=this._lang;return r`
      <div class="select-row">
        ${x()?c:r`<label>${i("compound_logic",e)}</label>`}
        ${b({label:i("compound_logic",e),value:this._compoundLogic,onChange:t=>this._compoundLogic=t.target.value},r`
          <option value="AND" ?selected=${this._compoundLogic==="AND"}>${i("compound_logic_and",e)}</option>
          <option value="OR" ?selected=${this._compoundLogic==="OR"}>${i("compound_logic_or",e)}</option>
        `)}
      </div>
      <div class="field-help">${i("compound_help",e)}</div>
      ${this._compoundConditions.length===0?r`<div class="field-help">${i("compound_no_conditions",e)}</div>`:this._compoundConditions.map((t,s)=>this._renderCondition(t,s))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${i("compound_add_condition",e)}
      </button>
    `}_renderCondition(e,t){let s=this._lang,n=t+1;return r`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${i("compound_condition",s)} ${n}</span>
          <button
            type="button"
            class="icon-btn"
            title="${i("compound_remove_condition",s)}"
            @click=${()=>this._removeCondition(t)}
          >✕</button>
        </div>
        ${this._entityPickerFallback?r`
          <ms-textfield
            label="${i("entity_id",s)} (${i("comma_separated",s)})"
            .value=${e.entityIds}
            @input=${a=>this._patchCondition(t,{entityIds:a.target.value})}
          ></ms-textfield>
        `:r`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:te}}}]}
          .data=${{condition_entities:e.entityIds.split(",").map(a=>a.trim()).filter(Boolean)}}
          .computeLabel=${()=>i("entity_id",s)}
          @value-changed=${a=>{let h=(a.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(t,{entityIds:h.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(e,t)}
        <div class="select-row">
          ${x()?c:r`<label>${i("trigger_type",s)}</label>`}
          ${b({label:i("trigger_type",s),value:e.type,onChange:a=>this._patchCondition(t,{type:a.target.value})},r`
            ${Ae.map(a=>r`<option value=${a} ?selected=${a===e.type}>${W(a,s)}</option>`)}
          `)}
        </div>
        ${this._renderConditionTypeFields(e,t)}
      </div>
    `}_isStateLatch(){return this._triggerType==="state_change"&&(this._triggerTargetChanges===""||Number(this._triggerTargetChanges)===1)&&!!(this._triggerFromState.trim()||this._triggerToState.trim())}_endsByItself(){return this._isStateLatch()||this._triggerType==="threshold"||this._triggerType==="due_date"}_renderTriggerEnd(e){let t=this._holdUntilDone?"hold":this._autoCompleteOnRecovery?"done":"ok",s={ok:"trigger_end_ok",done:"trigger_end_done",hold:"trigger_end_hold"},n=_=>{this._autoCompleteOnRecovery=_==="done",this._holdUntilDone=_==="hold"},a=this._isStateLatch(),h=i(a?"trigger_end":this._triggerType==="due_date"?"trigger_end_date":"trigger_end_value",e);return r`
      <div class="trigger-end" role="radiogroup" aria-label=${h}>
        <div class="field-label">${h}</div>
        ${Object.keys(s).map(_=>r`
          <label class="trigger-end-option">
            <input type="radio" name="trigger-end" value=${_} .checked=${t===_} @change=${()=>n(_)} />
            ${i(s[_],e)}
          </label>
        `)}
        ${t==="done"?r`<div class="field-help">${i("auto_complete_on_recovery_help",e)}</div>`:c}
        ${t==="hold"?r`<div class="field-help">${i(a?"trigger_end_hold_help":"trigger_end_hold_help_level",e)}</div>`:c}
      </div>
    `}_renderCompleteWhen(e){return r`
      <div class="field complete-when-field">
        ${this._entityPickerFallback?r`
          <ms-textfield
            label="${i("complete_when",e)}"
            placeholder="binary_sensor.washer_door"
            .value=${this._completeWhenEntity}
            @input=${t=>this._completeWhenEntity=t.target.value.trim()}
          ></ms-textfield>
        `:r`
          <ha-form
            class="entity-picker-form"
            .hass=${this.hass}
            .schema=${[{name:"complete_when",selector:{entity:{}}}]}
            .data=${{complete_when:this._completeWhenEntity}}
            .computeLabel=${()=>i("complete_when",e)}
            @value-changed=${t=>{let s=(t.detail.value.complete_when||"").trim();s!==this._completeWhenEntity&&(this._completeWhenState=""),this._completeWhenEntity=s}}
          ></ha-form>`}
        ${this._completeWhenEntity?this._renderStateField({label:i("complete_when_state",e),value:this._completeWhenState,entityId:this._completeWhenEntity,onInput:t=>this._completeWhenState=t}):c}
        ${this._completeWhenEntity?r`
          <ms-textfield
            class="complete-when-for"
            label="${i("for_at_least_minutes",e)}"
            type="number"
            min=${C[0]}
            max=${C[1]}
            .value=${this._completeWhenFor}
            @input=${t=>this._completeWhenFor=t.target.value}
          ></ms-textfield>
          ${$({cls:"req-option complete-when-any-time",checked:this._completeWhenAnyTime,onChange:t=>this._completeWhenAnyTime=t.target.checked},r`<span>${i("complete_when_any_time",e)}</span>`)}
        `:c}
        <div class="field-help">${i("complete_when_help",e)}</div>
      </div>
    `}_renderStateField(e){return this._entityPickerFallback||!e.entityId?r`
        <ms-textfield
          label=${e.label}
          .value=${e.value}
          @input=${t=>e.onInput(t.target.value)}
        ></ms-textfield>
      `:r`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId}}}]}
        .data=${{s:e.value}}
        .computeLabel=${()=>e.label}
        @value-changed=${t=>e.onInput((t.detail.value.s||"").trim())}
      ></ha-form>
    `}_renderOnStatesField(e){let t=this._lang;return this._entityPickerFallback||!e.entityId?r`
        <ms-textfield
          label="${i("runtime_on_states",t)}"
          placeholder="on"
          .value=${e.value}
          @input=${s=>e.onInput(s.target.value)}
        ></ms-textfield>
      `:r`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId,multiple:!0}}}]}
        .data=${{s:(e.value||"").split(",").map(s=>s.trim()).filter(Boolean)}}
        .computeLabel=${()=>i("runtime_on_states",t)}
        @value-changed=${s=>e.onInput((s.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(e){return this._scheduleType==="one_time"||this._scheduleType==="manual"?c:!this.adaptiveFeature&&!this._adaptiveWasEnabled?c:r`
      ${S({cls:"adaptive-section",open:this._adaptiveEnabled,header:i("adaptive_section_title",e)},r`
        ${$({checked:this._adaptiveEnabled,onChange:t=>this._adaptiveEnabled=t.target.checked},r`${i("adaptive_enabled",e)}`)}
        ${this._adaptiveEnabled?r`
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
            min=${H[0]}
            max=${H[1]}
            step="0.1"
            .value=${this._adaptiveAlpha}
            @input=${t=>this._adaptiveAlpha=t.target.value}
          ></ms-textfield>
          ${this.seasonalFeature?r`${$({checked:this._adaptiveSeasonal,onChange:t=>this._adaptiveSeasonal=t.target.checked},r`${i("adaptive_seasonal_enabled",e)}`)}`:c}
          ${$({checked:this._adaptivePrediction,onChange:t=>this._adaptivePrediction=t.target.checked},r`${i("adaptive_prediction_enabled",e)}`)}
        `:c}
      `)}
    `}_renderAttributeSelect(e){let t=this._lang;return e.available.length>0?r`
        <div class="select-row">
          ${x()?c:r`<label>${e.label}</label>`}
          ${b({label:e.label,value:e.value,onChange:s=>e.onSelect(s.target.value)},r`
            <option value="" ?selected=${!e.value}>${i("use_entity_state",t)}</option>
            ${e.suggested.map(s=>r`<option value=${s} ?selected=${s===e.value}>${s} ★</option>`)}
            ${e.available.filter(s=>!e.suggested.includes(s.name)).map(s=>r`<option value=${s.name} ?selected=${s.name===e.value}>${s.name}${s.numeric?"":" (non-numeric)"}</option>`)}
          `)}
        </div>
      `:r`
      <ms-textfield
        label="${e.label}"
        .value=${e.value}
        @input=${s=>e.onSelect(s.target.value.trim())}
      ></ms-textfield>
    `}_renderDetailAttributeSelect(e){let t=this._triggerType==="compound"?this._compoundConditions.flatMap(p=>p.entityIds.split(",").map(m=>m.trim()).filter(Boolean)):(this._triggerEntityIds.length?this._triggerEntityIds:[this._triggerEntityId]).filter(Boolean);if(!t.length)return c;let s=this.hass?.states??{},n=new Map;for(let p of t){this._fetchConditionAttributes(p);for(let m of this._conditionAttrOptions[p]?.available??[])n.has(m.name)||n.set(m.name,Qe(s[p]?.attributes?.[m.name]))}let a=this._triggerDetailAttribute;a&&!n.has(a)&&n.set(a,"");let h=i("trigger_detail_attribute",e),_=n.size?r`
        <div class="select-row">
          ${x()?c:r`<label>${h}</label>`}
          ${b({label:h,cls:"detail-attribute-select",value:a,onChange:p=>this._triggerDetailAttribute=p.target.value},r`
            <option value="" ?selected=${!a}>${i("trigger_detail_none",e)}</option>
            ${[...n.entries()].sort(([p],[m])=>p.localeCompare(m)).map(([p,m])=>r`<option value=${p} ?selected=${p===a}>${m?`${p}: ${m}`:p}</option>`)}
          `)}
        </div>`:r`
        <ms-textfield class="detail-attribute-input" label=${h} .value=${a}
          @input=${p=>this._triggerDetailAttribute=p.target.value.trim()}></ms-textfield>`;return r`${_}<div class="field-help">${i("trigger_detail_attribute_help",e)}</div>`}_renderEnvironmentalAttribute(e){this._fetchConditionAttributes(this._environmentalEntity);let t=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:i("environmental_attribute_optional",e),value:this._environmentalAttribute,suggested:t?.suggested??[],available:t?.available??[],onSelect:s=>this._environmentalAttribute=s})}_renderConditionAttribute(e,t){let s=e.entityIds.split(",")[0]?.trim()||"";s&&this._fetchConditionAttributes(s);let n=s?this._conditionAttrOptions[s]:void 0;return this._renderAttributeSelect({label:i("attribute_optional",this._lang),value:e.attribute,suggested:n?.suggested??[],available:n?.available??[],onSelect:a=>this._patchCondition(t,{attribute:a})})}_renderConditionTypeFields(e,t){let s=this._lang;if(e.type==="threshold")return r`
        <ms-textfield label="${i("trigger_above",s)}" type="number" .value=${e.above}
          @input=${n=>this._patchCondition(t,{above:n.target.value})}></ms-textfield>
        <ms-textfield label="${i("trigger_below",s)}" type="number" .value=${e.below}
          @input=${n=>this._patchCondition(t,{below:n.target.value})}></ms-textfield>
        <ms-textfield label="${i("trigger_equals",s)}" type="number" .value=${e.equals}
          @input=${n=>this._patchCondition(t,{equals:n.target.value})}></ms-textfield>
        <ms-textfield label="${i("trigger_not_equals",s)}" type="number" .value=${e.notEquals}
          @input=${n=>this._patchCondition(t,{notEquals:n.target.value})}></ms-textfield>
        <ms-textfield label="${i("for_minutes",s)}" type="number" .value=${e.forMinutes}
          @input=${n=>this._patchCondition(t,{forMinutes:n.target.value})}></ms-textfield>
      `;if(e.type==="counter")return r`
        <ms-textfield label="${i("target_value",s)}" type="number" .value=${e.targetValue}
          @input=${n=>this._patchCondition(t,{targetValue:n.target.value})}></ms-textfield>
        ${$({checked:e.deltaMode,onChange:n=>this._patchCondition(t,{deltaMode:n.target.checked})},r`${i("delta_mode",s)}`)}
      `;if(e.type==="state_change"){let n=e.entityIds.split(",")[0]?.trim()||"";return r`
        ${this._renderStateField({label:i("from_state_optional",s),value:e.fromState,entityId:n,onInput:a=>this._patchCondition(t,{fromState:a})})}
        ${this._renderStateField({label:i("to_state_optional",s),value:e.toState,entityId:n,onInput:a=>this._patchCondition(t,{toState:a})})}
        <ms-textfield label="${i("target_changes",s)}" type="number" .value=${e.targetChanges}
          @input=${a=>this._patchCondition(t,{targetChanges:a.target.value})}></ms-textfield>
        <ms-textfield label="${i("for_minutes",s)}" type="number" .value=${e.forMinutes}
          @input=${a=>this._patchCondition(t,{forMinutes:a.target.value})}></ms-textfield>
      `}if(e.type==="runtime"){let n=e.entityIds.split(",")[0]?.trim()||"";return r`
        <ms-textfield label="${i("runtime_hours",s)}" type="number" .value=${e.runtimeHours}
          @input=${a=>this._patchCondition(t,{runtimeHours:a.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:e.onStates,entityId:n,onInput:a=>this._patchCondition(t,{onStates:a})})}
      `}return e.type==="due_date"?r`
        <ms-textfield label="${i("days_before",s)}" type="number" step="1"
          min=${N[0]} max=${N[1]} .value=${e.daysBefore}
          @input=${n=>this._patchCondition(t,{daysBefore:n.target.value})}></ms-textfield>
      `:c}_renderUnitSelect(){let e=this._lang;return r`
      <div class="select-row">
        ${x()?c:r`<label>${i("interval_unit",e)}</label>`}
        ${b({label:i("interval_unit",e),value:this._intervalUnit,onChange:t=>this._intervalUnit=t.target.value},r`
          ${["days","weeks","months","years"].map(t=>r`<option value=${t} ?selected=${t===this._intervalUnit}>${i("unit_"+t,e)}</option>`)}
        `)}
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(this._scheduleType==="calendar"&&!this._calendarEntity.trim())return null;if(V.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let e=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!e||e<=0?null:{kind:"interval",every:e,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(e){super.updated?.(e),this._scheduleEntityPickerProbe();for(let t of e.keys())if(o._PREVIEW_RELEVANT.has(String(t))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let e=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),t=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!e||!t){this._pickerProbeStrikes=0;return}let s=(_,p,m=0)=>{if(!(!_||m>10)){(_.tagName?.toLowerCase()??"")==="ha-entity-picker"&&p.push(_);for(let f of[_.shadowRoot,_])if(f)for(let u of Array.from(f.children??[]))s(u,p,m+1)}},n=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],a=[];for(let _ of n)s(_,a);let h=a.length===0||a.some(_=>_.offsetHeight===0);if(e.offsetHeight===0||h){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let e=this._open?this._previewScheduleDict():null;if(!e){++this._previewSeq,this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let t=++this._previewSeq;try{let s=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:e,...this._lastPerformed?{last_performed:this._lastPerformed}:{},...this._taskId?{entry_id:this._entryId,task_id:this._taskId}:{}});if(t!==this._previewSeq)return;this._schedulePreview=s.occurrences||[],this._schedulePreviewEnded=!!s.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return c;let e=this._lang,t=this.scheduleTimeEnabled&&this._scheduleTimeOn&&this._scheduleTime?` ${this._scheduleTime}`:"",s=this._schedulePreview.map((a,h)=>{let _=new Date(`${a}T12:00:00`).getDay();return`${G(_===0?6:_-1,e,"short")} ${L(a,e)}${h===0?t:""}`}).join(" \xB7 "),n=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?r`<div class="field-help">${i("schedule_preview_ontime",e)}</div>`:c;return r`
      <div class="trigger-live-hint schedule-preview">
        ${i("schedule_preview_title",e)}: ${s}${this._schedulePreviewEnded?r` <span class="field-help">${i("schedule_preview_ends",e)}</span>`:c}
        ${n}
      </div>
    `}_buildSchedule(){let e=n=>{let a=parseInt(this._calOffset,10)||0;return a&&(n.offset=Math.max(-O,Math.min(a,O))),n},t=n=>((this._calMonths.length||this._hadCalMonths)&&(n.months=[...this._calMonths].sort((a,h)=>a-h)),e(n));if(this._scheduleType==="weekdays")return e({kind:"weekdays",weekdays:[...this._weekdays].sort((n,a)=>n-a)});if(this._scheduleType==="nth_weekday")return t({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});if(this._scheduleType==="calendar")return e({kind:"calendar",entity_id:this._calendarEntity.trim()});let s={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(s.business=!0),t(s)}_recurrenceExtras(){let e={};if(this._seasonMonths.length&&(e.season_months=[...this._seasonMonths].sort((t,s)=>t-s)),this._endsMode==="count"){let t=parseInt(this._endsCount,10);t>=1&&(e.ends={count:t})}else this._endsMode==="until"&&this._endsUntil&&(e.ends={until:this._endsUntil});return e}_toggleCalMonth(e){this._calMonths=this._calMonths.includes(e)?this._calMonths.filter(t=>t!==e):[...this._calMonths,e]}_renderCalMonths(){let e=this._lang;return r`
      <label class="field-label">${i("recurrence_months_label",e)}</label>
      <div class="field-help">${i("recurrence_months_hint",e)}</div>
      <div class="weekday-chips season-chips cal-month-chips">
        ${Ce(e).map((t,s)=>r`
          <button
            type="button"
            class="season-chip ${this._calMonths.includes(s+1)?"selected":""}"
            @click=${()=>this._toggleCalMonth(s+1)}
          >${t}</button>`)}
      </div>`}_toggleSeasonMonth(e){this._seasonMonths=this._seasonMonths.includes(e)?this._seasonMonths.filter(t=>t!==e):[...this._seasonMonths,e]}_renderRecurrenceExtras(){let e=this._lang;if(!(this._scheduleType==="time_based"||V.includes(this._scheduleType)))return c;let s=Ce(e);return r`
      <label class="field-label">${i("season_window_label",e)}</label>
      <div class="field-help">${i("season_window_hint",e)}</div>
      <div class="weekday-chips season-chips">
        ${s.map((n,a)=>r`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(a+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(a+1)}
          >${n}</button>`)}
      </div>

      <label class="field-label">${i("series_end_label",e)}</label>
      <div class="select-row">
        ${b({label:i("series_end_label",e),value:this._endsMode,onChange:n=>this._endsMode=n.target.value},r`
          <option value="never" ?selected=${this._endsMode==="never"}>${i("series_end_never",e)}</option>
          <option value="count" ?selected=${this._endsMode==="count"}>${i("series_end_after_count",e)}</option>
          <option value="until" ?selected=${this._endsMode==="until"}>${i("series_end_until",e)}</option>
        `)}
      </div>
      ${this._endsMode==="count"?r`
        <!-- max: MAX_SERIES_COUNT (const.py), what the history can count. -->
        <ms-textfield
          label="${i("series_end_count_label",e)}"
          type="number" min="1" max="500"
          .value=${this._endsCount}
          @input=${n=>this._endsCount=n.target.value}
        ></ms-textfield>`:c}
      ${this._endsMode==="until"?r`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${e}
          label="${i("series_end_until_label",e)}"
          .value=${this._endsUntil}
          @value-changed=${n=>this._endsUntil=n.detail.value}
        ></ms-date-field>`:c}
    `}_renderCalendarFields(){let e=this._lang,t=Ve(e);if(this._scheduleType==="weekdays")return r`
        <label class="field-label">${i("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${t.map((s,n)=>r`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(n)?"selected":""}"
              @click=${()=>this._toggleWeekday(n)}
            >${s}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let s=[["1",i("ord_1",e)],["2",i("ord_2",e)],["3",i("ord_3",e)],["4",i("ord_4",e)],["5",i("ord_5",e)],["-1",i("ord_last",e)]];return r`
        <div class="select-row">
          ${x()?c:r`<label>${i("recurrence_occurrence",e)}</label>`}
          ${b({label:i("recurrence_occurrence",e),value:this._nth,onChange:n=>this._nth=n.target.value},r`
            ${s.map(([n,a])=>r`<option value=${n} ?selected=${n===this._nth}>${a}</option>`)}
          `)}
        </div>
        <div class="select-row">
          ${x()?c:r`<label>${i("recurrence_weekday",e)}</label>`}
          ${b({label:i("recurrence_weekday",e),value:this._nthWeekday,onChange:n=>this._nthWeekday=n.target.value},r`
            ${t.map((n,a)=>r`<option value=${String(a)} ?selected=${String(a)===this._nthWeekday}>${n}</option>`)}
          `)}
        </div>
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`}return this._scheduleType==="calendar"?r`
        ${this._entityPickerFallback?r`
          <ms-textfield
            label="${i("calendar_entity_label",e)}"
            helper="${i("calendar_entity_hint",e)}"
            .value=${this._calendarEntity}
            @input=${s=>this._calendarEntity=s.target.value.trim()}
          ></ms-textfield>
        `:r`
          <ha-form
            class="entity-picker-form calendar-entity-form"
            .hass=${this.hass}
            .schema=${[{name:"calendar_entity",selector:{entity:{domain:"calendar"}}}]}
            .data=${{calendar_entity:this._calendarEntity}}
            .computeLabel=${()=>i("calendar_entity_label",e)}
            .computeHelper=${()=>i("calendar_entity_hint",e)}
            @value-changed=${s=>{this._calendarEntity=(s.detail.value.calendar_entity||"").trim()}}
          ></ha-form>`}
        ${this._renderCalOffsetField()}`:this._scheduleType==="day_of_month"?r`
        ${this._domLastDay?c:r`
          <ms-textfield
            label="${i("recurrence_day",e)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${s=>this._domDay=s.target.value}
          ></ms-textfield>`}
        ${$({cls:"checkbox-row",checked:this._domLastDay,onChange:s=>this._domLastDay=s.target.checked},r`<span>${i("recurrence_last_day",e)}</span>`)}
        ${$({cls:"checkbox-row",checked:this._domBusiness,onChange:s=>this._domBusiness=s.target.checked},r`<span>${i("recurrence_business_day",e)}</span>`)}
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`:c}_renderCalOffsetField(){let e=this._lang;return r`
      <ms-textfield
        label="${i("recurrence_offset",e)}"
        helper="${i("recurrence_offset_help",e)}"
        type="number"
        min=${-O}
        max=${O}
        .value=${this._calOffset}
        @input=${t=>this._calOffset=t.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let e=parseFloat(this._triggerAbove),t=parseFloat(this._triggerBelow);return!isNaN(e)&&!isNaN(t)&&t>e}_renderTriggerLiveHint(){if(this._triggerType==="compound")return c;let e=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?r`<div class="trigger-live-hint warn">${i("trigger_hint_overlap",this._lang)}</div>`:c,t=this._triggerEntityId||this._triggerEntityIds[0];if(!t||!this.hass?.states)return e;let s=this.hass.states[t];if(!s)return e;let n=this._lang,a=s.attributes?.unit_of_measurement,h=typeof a=="string"&&a?` ${a}`:"",_=this._triggerAttribute?s.attributes?.[this._triggerAttribute]:s.state,p=typeof _=="number"?_:parseFloat(String(_)),m=_!=="unknown"&&_!=="unavailable"&&_!=null&&!isNaN(p),f=y=>P(y,n,{maximumFractionDigits:1}),u=[];if(this._triggerType==="threshold"){let y=parseFloat(this._triggerAbove),E=parseFloat(this._triggerBelow),A=parseFloat(this._triggerEquals),k=parseFloat(this._triggerNotEquals);if([y,E,A,k].every(q=>isNaN(q)))return c;m&&u.push(i("trigger_hint_now",n).replace("{value}",f(p)+h)),isNaN(y)||u.push(i("trigger_hint_above",n).replace("{target}",f(y)+h)),isNaN(E)||u.push(i("trigger_hint_below",n).replace("{target}",f(E)+h)),isNaN(A)||u.push(i("trigger_hint_equals",n).replace("{target}",f(A)+h)),isNaN(k)||u.push(i("trigger_hint_not_equals",n).replace("{target}",f(k)+h))}else if(this._triggerType==="counter"){let y=parseFloat(this._triggerTargetValue);if(isNaN(y))return c;this._triggerDeltaMode?this._taskId?u.push(i("trigger_hint_counter_delta_edit",n).replace("{target}",f(y)+h)):m?u.push(i("trigger_hint_counter_delta",n).replace("{value}",f(p)+h).replace("{due}",f(p+y)+h).replace("{target}",f(y)+h)):u.push(i("trigger_hint_counter_delta_edit",n).replace("{target}",f(y)+h)):(m&&u.push(i("trigger_hint_now",n).replace("{value}",f(p)+h)),u.push(i("trigger_hint_counter_abs",n).replace("{target}",f(y)+h)))}else if(this._triggerType==="runtime"){let y=parseFloat(this._triggerRuntimeHours);if(isNaN(y))return c;u.push(i("trigger_hint_runtime",n).replace("{hours}",f(y))),u.push(i("trigger_hint_state_now",n).replace("{value}",String(s.state)))}else if(this._triggerType==="state_change"){let y=parseInt(this._triggerTargetChanges,10)||1,E=this._triggerToState.trim();u.push((E?i("trigger_hint_state_change_to",n).replace("{state}",E):i("trigger_hint_state_change",n)).replace("{count}",String(y))),u.push(i("trigger_hint_state_now",n).replace("{value}",String(s.state)))}else if(this._triggerType==="due_date"){let y=parseInt(this._triggerDaysBefore,10)||0;u.push(y===0?i("trigger_hint_due_date_same_day",n):ae("trigger_hint_due_date","trigger_hint_due_date_one",y,n,"days"));let E=_==null?"":String(_);E&&!isNaN(Date.parse(E))&&u.push(i("trigger_hint_due_date_now",n).replace("{date}",L(E,n)))}return u.length?r`<div class="trigger-live-hint">${u.join(" ")}</div>${e}`:e}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?r`
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
      `:this._triggerType==="counter"?r`
        <ms-textfield
          label="${i("target_value",e)}"
          type="number"
          step="any"
          .value=${this._triggerTargetValue}
          @input=${t=>this._triggerTargetValue=t.target.value}
        ></ms-textfield>
        ${$({checked:this._triggerDeltaMode,onChange:t=>this._triggerDeltaMode=t.target.checked},r`${i("delta_mode",e)}`)}
        ${this._triggerDeltaMode?r`
              <ms-textfield
                label="${i("baseline_start_value",e)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${t=>this._triggerBaselineValue=t.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?i("baseline_start_help_edit",e):i("baseline_start_help",e)}
                ${this._taskId&&this._liveBaselineValue!=null?r`<div class="baseline-effective">
                      ${i("baseline_current_effective",e).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:c}
              </div>
            `:c}
      `:this._triggerType==="state_change"?r`
        ${this._renderStateField({label:i("from_state_optional",e),value:this._triggerFromState,entityId:this._triggerEntityId,onInput:t=>this._triggerFromState=t})}
        <div class="field-help">${i("state_value_help",e)}</div>
        ${this._renderStateField({label:i("to_state_optional",e),value:this._triggerToState,entityId:this._triggerEntityId,onInput:t=>this._triggerToState=t})}
        <ms-textfield
          label="${i("target_changes",e)}"
          type="number"
          min=${ve[0]}
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ms-textfield>
        <div class="field-help">${i("target_changes_help",e)}</div>
        ${(this._triggerTargetChanges||"1")==="1"&&(this._triggerFromState||this._triggerToState)?r`<div class="field-help">${i("state_latch_help",e)}</div>`:c}
        <ms-textfield
          label="${i("for_at_least_minutes",e)}"
          type="number"
          min=${C[0]}
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
        <div class="field-help">${i("for_minutes_state_help",e)}</div>
      `:this._triggerType==="runtime"?r`
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
      `:this._triggerType==="due_date"?r`
        <ms-textfield
          label="${i("days_before",e)}"
          type="number"
          step="1"
          min=${N[0]}
          max=${N[1]}
          .value=${this._triggerDaysBefore}
          @input=${t=>this._triggerDaysBefore=t.target.value}
        ></ms-textfield>
        <div class="field-help">${i("days_before_help",e)}</div>
      `:c}_section(e,t,s){return r`<section class="form-section ${e}">
      <h3 class="section-title">${t}</h3>
      ${s}
    </section>`}_renderIdentity(e){return r`
          ${this._taskId===null&&this._objectChoices.length>0?r`
            <div class="select-row">
              ${x()?c:r`<label>${i("object",e)}</label>`}
              ${b({label:i("object",e),value:this._entryId,onChange:t=>{this._entryId=t.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}},r`
                ${this._objectChoices.map(t=>r`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
              `)}
            </div>
          `:c}
          <ms-textfield
            label="${i("task_name",e)}"
            required
            .value=${this._name}
            @input=${t=>this._name=t.target.value}
          ></ms-textfield>
          <div class="select-row">
            ${x()?c:r`<label>${i("maintenance_type",e)}</label>`}
            ${b({label:i("maintenance_type",e),value:this._type,onChange:t=>this._type=t.target.value},r`
              ${Se.map(t=>r`<option value=${t} ?selected=${t===this._type}>${i(t,e)}</option>`)}
            `)}
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
          ${$({cls:"toggle-row",checked:this._enabled,onChange:t=>this._enabled=t.target.checked},r`${i("task_enabled",e)}`)}
    `}_renderDetails(e){return r`
      ${S({cls:"details-section",open:this._detailsOpen,header:i("task_section_details",e)},r`
        <div class="select-row">
          ${x()?c:r`<label>${i("priority",e)}</label>`}
          ${b({label:i("priority",e),value:this._priority,onChange:t=>this._priority=t.target.value},r`
            ${fe.map(t=>r`<option value=${t} ?selected=${t===this._priority}>${i("priority_"+t,e)}</option>`)}
          `)}
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
      `)}
    `}_renderScheduleSection(e){return this._section("schedule-section",i("task_section_schedule",e),r`
          <div class="select-row">
            ${x()?c:r`<label>${i("schedule_type",e)}</label>`}
            ${b({label:i("schedule_type",e),value:this._scheduleType,onChange:t=>this._scheduleType=t.target.value},r`
              ${je.map(t=>r`<option value=${t} ?selected=${t===this._scheduleType}>${i(t,e)}</option>`)}
            `)}
          </div>
          ${this._scheduleType==="time_based"?r`
                <ms-textfield
                  label="${i("interval_value",e)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${t=>this._intervalDays=t.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  ${x()?c:r`<label>${i("interval_anchor",e)}</label>`}
                  ${b({label:i("interval_anchor",e),value:this._intervalAnchor,onChange:t=>this._intervalAnchor=t.target.value},r`
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${i("anchor_completion",e)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${i("anchor_planned",e)}</option>
                  `)}
                  <div class="field-help anchor-help">${i("interval_anchor_hint",e)}</div>
                </div>
              `:c}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?r`
                <ms-date-field
                  kind="date"
                  .hass=${this.hass}
                  .lang=${e}
                  label="${i("due_date",e)}"
                  .value=${this._dueDate}
                  @value-changed=${t=>this._dueDate=t.detail.value}
                ></ms-date-field>
              `:c}
          ${this.scheduleTimeEnabled&&Ie.includes(this._scheduleType)?r`
            ${$({cls:"checkbox-row schedule-time-toggle",checked:this._scheduleTimeOn,onChange:t=>this._scheduleTimeOn=t.target.checked},r`<span>${i("schedule_time_toggle",e)}</span>`)}
            ${this._scheduleTimeOn?r`
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
            min=${J[0]}
            max=${J[1]}
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
    `)}_renderTriggerSection(e){return this._scheduleType!=="sensor_based"?c:this._section("trigger-section",i("task_section_trigger",e),r`
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"&&(this.environmentalFeature||this._environmentalInitial)?r`
            ${this._entityPickerFallback?r`
              <ms-textfield
                label="${i("environmental_entity_optional",e)}"
                helper="${i("environmental_entity_helper",e)}"
                .value=${this._environmentalEntity}
                @input=${t=>this._environmentalEntity=t.target.value.trim()}
              ></ms-textfield>
            `:r`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:Te}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>i("environmental_entity_optional",e)}
              .computeHelper=${()=>i("environmental_entity_helper",e)}
              @value-changed=${t=>{this._environmentalEntity=(t.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(e):c}
          `:c}
    `)}_renderCompletionSection(e){return this._section("completion-section",i("task_section_completion",e),r`
          ${this._type==="reading"?r`
                <ms-textfield
                  label="${i("reading_unit_label",e)}"
                  .value=${this._readingUnit}
                  @input=${t=>this._readingUnit=t.target.value}
                ></ms-textfield>
                <div class="field-help">${i("reading_unit_help",e)}</div>
                ${this._renderReadingsEditor(e)}
              `:c}
          ${this.checklistsEnabled?r`
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
          ${this._partsLoadFailed?r`<div class="field-help parts-load-failed">${i("parts_load_failed",e)}</div>`:c}
          ${this._isFleetTask?r`<div class="field-help parts-fleet-hint">${i("task_parts_fleet_hint",e)}</div>`:this.parts.length||this._foreignOwners.length?r`
                <div class="field">
                  <label>${i("consumes_parts_label",e)}</label>
                  ${this.parts.map(t=>this._renderConsumesRow(t))}
                  ${this._foreignOwners.length?r`
                        ${S({cls:"shared-pools",open:this._hasForeignPick,header:i("shared_parts_other_objects",e)},r`
                          <div class="field-help">${i("shared_parts_help",e)}</div>
                          ${this._foreignOwners.map(t=>r`
                              <div class="shared-pool-owner">${t.name}</div>
                              ${t.parts.map(s=>this._renderConsumesRow(s,t.entry_id))}
                            `)}
                        `)}
                      `:c}
                </div>
              `:c}
          <div class="field-label">${i("require_on_completion",e)}</div>
          <div class="required-completion">
            ${ee.map(t=>r`
              ${$({cls:"req-option",checked:this._requiredCompletion.includes(t),onChange:s=>this._toggleRequired(t,s.target.checked)},r`<span>${i(U[t],e)}</span>`)}
            `)}
          </div>
          ${this._availableTags.length>0?r`
              <div class="select-row">
                ${x()?c:r`<label>${i("nfc_tag_id_optional",e)}</label>`}
                ${b({label:i("nfc_tag_id_optional",e),value:this._nfcTagId,onChange:t=>this._nfcTagId=t.target.value},r`
                  <option value="" ?selected=${!this._nfcTagId}>${i("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(t=>r`<option value=${t.id} ?selected=${t.id===this._nfcTagId}>${t.name}</option>`)}
                `)}
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${i("nfc_tags_refresh",e)}">↻</button>
              </div>
            `:r`
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
          ${$({cls:"req-option",checked:this._requireTagScan,onChange:t=>this._requireTagScan=t.target.checked},r`<span>${i("require_tag_scan",e)}</span>`)}
          ${this._requireTagScan?r`<div class="field-help">${i("require_tag_scan_help",e)}</div>`:c}
          ${$({cls:"req-option",checked:!this._allowSkip,onChange:t=>this._allowSkip=!t.target.checked},r`<span>${i("disallow_skip",e)}</span>`)}
          ${this._allowSkip?c:r`<div class="field-help">${i("disallow_skip_help",e)}</div>`}
          ${this._renderQuickComplete(e)}
          ${this._renderCompleteWhen(e)}
          ${this._renderPhasesEditor(e)}
          ${this._renderCompletionActionsSection(e)}
    `)}_renderPeopleSection(e){return this._section("people-section",i("task_section_people",e),r`
          <div class="select-row">
            ${x()?c:r`<label>${i("responsible_user",e)}</label>`}
            ${b({label:i("responsible_user",e),value:this._responsibleUserId||"",onChange:t=>{let s=t.target.value;this._responsibleUserId=s||null}},r`
              <option value="" ?selected=${!this._responsibleUserId}>${i("no_user_assigned",e)}</option>
              ${this._availableUsers.map(t=>r`<option value=${t.id} ?selected=${t.id===this._responsibleUserId}>${t.name}</option>`)}
            `)}
          </div>
          ${this._availableUsers.length>=2?r`
            <div class="field">
              <label>${i("task_shared_with",e)}</label>
              <div class="field-help">${i("task_shared_with_help",e)}</div>
              ${this._responsibleUserId&&this._assigneePool.length>0&&!(this._assigneePool.length>=2&&this._rotationStrategy)?r`<div class="field-help shared-responsible-wins">${i("task_shared_responsible_wins",e)}</div>`:c}
              <div class="assignee-pool">
                ${this._availableUsers.map(t=>r`
                  ${$({cls:"pool-item",checked:this._assigneePool.includes(t.id),onChange:()=>this._toggleAssignee(t.id)},r`<span>${t.name}</span>`)}`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?r`
              <div class="select-row">
                ${x()?c:r`<label>${i("rotation_strategy",e)}</label>`}
                ${b({label:i("rotation_strategy",e),value:this._rotationStrategy,onChange:t=>this._rotationStrategy=t.target.value},r`
                  <option value="" ?selected=${!this._rotationStrategy}>${i("rotation_none",e)}</option>
                  ${ye.map(t=>r`<option value=${t} ?selected=${t===this._rotationStrategy}>${i("rotation_"+t,e)}</option>`)}
                `)}
              </div>`:c}
          `:c}
    `)}_renderNotificationsSection(e){return this._section("notifications-section",i("task_section_notifications",e),r`
          ${$({cls:"req-option",checked:!this._notifyEnabled,onChange:t=>this._notifyEnabled=!t.target.checked},r`<span>${i("no_notifications",e)}</span>`)}
          ${this._notifyEnabled?c:r`<div class="field-help">${i("no_notifications_help",e)}</div>`}
          <ha-icon-picker
            class="notify-icon-picker"
            .hass=${this.hass}
            label="${i("notify_icon",e)}"
            .value=${this._notifyIcon}
            @value-changed=${t=>this._notifyIcon=t.detail.value||""}
          ></ha-icon-picker>
          <div class="field-help notify-icon-help">
            <ha-icon icon=${this._notifyIcon.trim()||ie(this._type)}></ha-icon>
            ${i("notify_icon_hint",e).replace("{default}",ie(this._type))}
          </div>
          ${this._renderMirrorTodo(e)}
    `)}_renderMirrorTodo(e){let t=this.mirrorTodoDefault;if(!t.length)return r`
          <div class="field mirror-todo-field">
            ${this._renderMirrorTodoPicker(e)}
            <div class="field-help">${i("task_mirror_todo_hint",e)}</div>
          </div>`;let s=t.map(a=>R(this.hass,a)).join(", "),n={default:i("task_mirror_todo_default",e).replace("{lists}",s),own:i("task_mirror_todo_own",e),none:i("task_mirror_todo_none",e)};return r`
          <div class="field mirror-todo-field">
            <div class="mirror-todo-choice" role="radiogroup" aria-label=${i("task_mirror_todo",e)}>
              <div class="field-label">${i("task_mirror_todo",e)}</div>
              ${Object.keys(n).map(a=>r`
                <label class="mirror-todo-option">
                  <input type="radio" name="mirror-todo" value=${a} .checked=${this._mirrorTodoMode===a}
                    @change=${()=>this._mirrorTodoMode=a} />
                  ${n[a]}
                </label>
              `)}
            </div>
            ${this._mirrorTodoMode==="own"?this._renderMirrorTodoPicker(e):c}
            ${this._mirrorTodoMode!=="none"?r`<div class="field-help">${i("task_mirror_todo_hint",e)}</div>`:c}
          </div>`}_renderMirrorTodoPicker(e){return r`
            ${this._entityPickerFallback?r`
              <ms-textfield
                label="${i("task_mirror_todo",e)}"
                placeholder="todo.family, todo.kids"
                .value=${this._mirrorTodoEntities.join(", ")}
                @input=${t=>{this._mirrorTodoEntities=B(this.hass,t.target.value.split(",").map(s=>s.trim()))}}
              ></ms-textfield>
            `:r`
              <ha-form
                class="entity-picker-form"
                .hass=${this.hass}
                .schema=${[{name:"mirror_todo_entities",selector:{entity:{multiple:!0,domain:["todo"],exclude_entities:be(this.hass)}}}]}
                .data=${{mirror_todo_entities:this._mirrorTodoEntities}}
                .computeLabel=${()=>i("task_mirror_todo",e)}
                @value-changed=${t=>{this._mirrorTodoEntities=B(this.hass,t.detail.value.mirror_todo_entities||[])}}
              ></ha-form>`}
            <div class="field-help mirror-todo-max">${i("task_mirror_todo_max",e).replace("{max}",String(5))}</div>`}_ruleDraft(){let e=this._triggerEntityIds.length?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[];return{name:this._name,enabled:this._enabled,typeLabel:i(this._type,this._lang),scheduleType:this._scheduleType,intervalDays:this._intervalDays,intervalUnit:this._intervalUnit,intervalAnchor:this._intervalAnchor,dueDate:this._dueDate,weekdays:this._weekdays,nth:this._nth,nthWeekday:this._nthWeekday,domDay:this._domDay,domLastDay:this._domLastDay,calendarEntity:this._calendarEntity?R(this.hass,this._calendarEntity):"",warningDays:this._warningDays,triggerType:this._triggerType,triggerEntityIds:e,triggerAttribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,daysBefore:this._triggerDaysBefore,triggerCombinator:this._triggerCombinator,entityLogic:this._triggerEntityLogic,compoundLogic:this._compoundLogic,compoundCount:this._compoundConditions.length,compoundEntityIds:this._compoundConditions.flatMap(t=>t.entityIds.split(",").map(s=>s.trim()).filter(Boolean)),completeWhenEntity:this._completeWhenEntity,completeWhenState:this._completeWhenState,completeWhenFor:this._completeWhenFor,completeWhenAnyTime:this._completeWhenAnyTime,quickOn:this._quickOn,requiredCount:this._requiredCompletion.length,allowSkip:this._allowSkip,requireTagScan:this._requireTagScan,checklistCount:this.checklistsEnabled?this._checklistText.split(`
`).filter(t=>t.trim()).length:0,partsCount:Object.keys(this._consumesParts).length,responsibleUserId:this._responsibleUserId,pool:this._assigneePool,rotation:this._rotationStrategy,notifyEnabled:this._notifyEnabled,mirrorLists:this._mirrorListsShown()}}_mirrorListsShown(){return this.mirrorTodoDefault.length?this._mirrorTodoMode==="default"?this.mirrorTodoDefault:this._mirrorTodoMode==="own"?this._mirrorTodoEntities:[]:this._mirrorTodoMode==="none"?[]:this._mirrorTodoEntities}_userName(e){return this._availableUsers.find(t=>t.id===e)?.name??e}_sidebarTitle(e,t){switch(e){case"task":return i("task_section_details",t);case"schedule":return i("task_section_schedule",t);case"trigger":return i("task_section_trigger",t);case"completion":return i("task_section_completion",t);case"people":return i("task_section_people",t);case"notifications":return i("task_section_notifications",t);default:return i("beta_rules_add_rule",t)}}_selectRule(e){this._ruleSel=this._ruleSel===e?null:e,e==="add"&&this._loadObjectDevice()}_removeRule(e){e==="trigger"?(this._resetTriggerFields(),this._scheduleType=parseInt(this._intervalDays,10)>0?"time_based":"manual"):e==="schedule"&&(this._scheduleType==="sensor_based"?this._intervalDays="":this._scheduleType="manual"),this._ruleSel===e&&(this._ruleSel=null)}_combineTrigger(e,t=""){if(this._triggerType!=="compound"){let s=this._triggerEntityIds.length?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[];this._compoundConditions=[{entityIds:s.join(", "),...this._typeFields(),carry:{}}],this._compoundLogic="OR",this._triggerType="compound",this._triggerEntityId="",this._triggerEntityIds=[]}this._compoundConditions=[...this._compoundConditions,{...z(),type:e,entityIds:t}]}_setSensorRule(e,t=""){this._scheduleType!=="time_based"&&this._scheduleType!=="sensor_based"&&(this._intervalDays=""),this._scheduleType="sensor_based",this._resetTriggerFields(),this._triggerType=e,e==="compound"&&(this._compoundConditions=[z()]),t&&(this._triggerEntityId=t,this._triggerEntityIds=[t],this._seedUpdateRule(),this._fetchEntityAttributes(t))}_seedUpdateRule(){this._triggerType!=="state_change"||this._triggerEntityIds.length!==1||!this._triggerEntityId.startsWith("update.")||this._triggerFromState.trim()||this._triggerToState.trim()||(this._triggerFromState="off",this._triggerToState="on",this._autoCompleteOnRecovery=!0,this._holdUntilDone=!1)}_applyChoice(e){if(e.kind==="schedule"){if(e.effect==="safety"){parseInt(this._intervalDays,10)>0||(this._intervalDays="30"),this._ruleSel="trigger";return}this._scheduleType==="sensor_based"&&this._resetTriggerFields(),e.value==="time_based"&&!(parseInt(this._intervalDays,10)>0)&&(this._intervalDays="30"),this._scheduleType=e.value,this._ruleSel="schedule";return}let t=e.value;e.effect==="combine"?this._combineTrigger(t):this._setSensorRule(t),this._ruleSel="trigger"}_applySuggestion(e){if(e.target==="done_when"){e.entityId!==this._completeWhenEntity&&(this._completeWhenState=""),this._completeWhenEntity=e.entityId,this._ruleSel="completion";return}let t=e.triggerType??"threshold";this._scheduleType==="sensor_based"&&(this._triggerType==="compound"||!!this._triggerEntityId)?this._combineTrigger(t,e.entityId):this._setSensorRule(t,e.entityId),this._ruleSel="trigger"}async _loadObjectDevice(){let e=this._entryId;if(!e||this._objectDevice?.entryId===e)return;let t=null,s=null;try{let a=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}))?.objects??[]).find(h=>h.entry_id===e);t=a?.object.ha_device_id??null,s=a?.object.area_id??null}catch{}this._entryId===e&&(this._objectDevice={entryId:e,deviceId:t,areaId:s})}async _loadTemplateChoices(){if(this._templateChoices===null)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/templates",language:this._lang});this._templateChoices=(e?.templates??[]).filter(t=>!t.disabled).flatMap(t=>(t.tasks??[]).map(s=>({...s,template:t.name})))}catch{this._templateChoices=[]}}async _loadCopyChoices(){if(this._copyChoices===null)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._copyChoices=(e?.objects??[]).flatMap(t=>(t.tasks??[]).filter(s=>!s.battery_fleet_task&&!s.part_ref).map(s=>({entryId:t.entry_id,objectName:t.object.name,task:s})))}catch{this._copyChoices=[]}}_applyTemplateTask(e){this._name=e.name,this._type=Se.includes(e.type)?e.type:"custom";let t=e.interval_days&&e.interval_days>0?String(e.interval_days):"";e.schedule_type==="sensor_based"?(this._scheduleType="sensor_based",this._intervalDays=t):e.schedule_type==="manual"||!t?this._scheduleType="manual":(this._scheduleType="time_based",this._intervalDays=t,this._intervalUnit="days"),e.warning_days!==null&&e.warning_days!==void 0&&(this._warningDays=String(e.warning_days)),this._betaStep="form",this._ruleSel=this._scheduleType==="sensor_based"?"add":"schedule",this._ruleSel==="add"&&(this._addTab="device",this._loadObjectDevice())}async _applyCopy(e){let t=this._entryId,s=this._objectChoices;await this._edit(e.entryId,e.task),this._taskId=null,this._entryId=t,this._objectChoices=s,this._series=[],this._isFleetTask=!1,this._lastPerformed="",this._nfcTagId="",this._consumesParts={},this._consumesQtyText={},this._phaseDefs=this._phaseDefs.map(n=>({...n,partId:"",partQty:"",extraParts:[]})),await Promise.all([this._loadParts(),this._loadForeignPools()]),this._betaStep="form",this._ruleSel="task"}_choiceNote(e,t){return e.effect==="replace"?i("beta_rules_replaces",t):e.effect==="combine"?i("beta_rules_combines",t):e.effect==="safety"?i("beta_rules_adds_safety",t):""}_renderAddPicker(e){let t=r`
      <div class="add-tabs" role="tablist" aria-label=${i("beta_rules_add_rule",e)}>
        <button type="button" role="tab" class="add-tab-type" aria-selected=${this._addTab==="type"?"true":"false"}
          @click=${()=>{this._addTab="type"}}>${i("beta_rules_by_type",e)}</button>
        <button type="button" role="tab" class="add-tab-device" aria-selected=${this._addTab==="device"?"true":"false"}
          @click=${()=>{this._addTab="device",this._loadObjectDevice()}}>${i("beta_rules_by_device",e)}</button>
      </div>`;if(this._addTab==="type"){let m=xe({scheduleType:this._scheduleType,intervalDays:this._intervalDays,triggerType:this._triggerType}),f=u=>{let y=this._choiceNote(u,e);return r`
          <button type="button" class="add-choice" data-kind=${u.kind} data-value=${u.value} @click=${()=>this._applyChoice(u)}>
            <ha-icon icon=${u.icon}></ha-icon>
            <span class="add-choice-text">
              <span>${u.kind==="trigger"?W(u.value,e):i(u.value,e)}</span>
              ${y?r`<span class="add-choice-note">${y}</span>`:c}
            </span>
          </button>`};return r`${t}
        <div class="add-group">${i("task_section_schedule",e)}</div>
        ${m.filter(u=>u.kind==="schedule").map(f)}
        <div class="add-group">${i("task_section_trigger",e)}</div>
        ${m.filter(u=>u.kind==="trigger").map(f)}`}let s=this._objectDevice;if(s===null||s.entryId!==this._entryId)return r`${t}<div class="field-help">…</div>`;if(!s.deviceId&&!s.areaId)return r`${t}<div class="field-help beta-no-device">${i("beta_rules_no_device",e)}</div>`;let n=we(this.hass,{deviceId:s.deviceId,areaId:s.areaId,ownPlatform:"maintenance_supporter"});if(!n.length)return r`${t}<div class="field-help beta-no-device">${i(s.deviceId?"beta_rules_no_device_entities":"beta_rules_no_area_entities",e)}</div>`;let a=s.areaId||(s.deviceId?this.hass.devices?.[s.deviceId]?.area_id:null)||"",h=this.hass.areas?.[a]?.name||a,_=n.some(m=>m.group==="device"),p=(m,f)=>{if(f>0&&n[f-1].group===m.group)return c;let u=m.group==="device"?i("beta_rules_group_device",e):i(_?"beta_rules_group_area_more":"beta_rules_group_area",e).replace("{area}",h);return r`<div class="add-group device-group" data-group=${m.group}>${u}</div>`};return r`${t}
      ${n.map((m,f)=>r`${p(m,f)}
        <div class="device-entity" data-entity=${m.entityId} data-group=${m.group}>
          <div class="device-entity-name">${m.name}</div>
          <div class="device-entity-choices">
            ${Ee(m).map(u=>r`
              <button type="button" class="add-choice" data-target=${u.target} data-type=${u.triggerType??""} @click=${()=>this._applySuggestion(u)}>
                <ha-icon icon=${u.icon}></ha-icon>
                <span>${u.target==="done_when"?i("beta_rules_done_when_suggest",e):W(u.triggerType??"",e)}</span>
              </button>`)}
          </div>
        </div>`)}`}_renderSidebarBody(e,t){switch(e){case"task":return this._renderIdentity(t);case"schedule":return this._renderScheduleSection(t);case"trigger":return this._renderTriggerSection(t);case"completion":return this._renderCompletionSection(t);case"people":return this._renderPeopleSection(t);case"notifications":return this._renderNotificationsSection(t);default:return this._renderAddPicker(t)}}_renderRules(e){let t=$e(this._ruleDraft(),{lang:e,entityName:m=>R(this.hass,m),userName:m=>this._userName(m)}),s=new Map(t.map(m=>[m.id,m])),n=[{title:i("task_section_details",e),ids:["task"]},{title:i("task_section_schedule",e),ids:["schedule","trigger"],add:!0},{title:i("task_section_completion",e),ids:["completion"]},{title:i("task_section_people",e),ids:["people"]},{title:i("task_section_notifications",e),ids:["notifications"]}],a=0,h=1,_=[];for(let m of n){a+=2,_.push(r`<h3 class="rules-group-title" style="order:${a}">${m.title}</h3>`);for(let f of m.ids){let u=s.get(f);if(!u)continue;a+=2,this._ruleSel===f&&(h=a+1);let y=this._ruleSel===f;_.push(r`
          <div class="rule-row ${y?"selected":""}" data-row=${u.id} style="order:${a}">
            <button type="button" class="rule-main" aria-expanded=${y?"true":"false"} @click=${()=>this._selectRule(u.id)}>
              <ha-icon icon=${u.icon}></ha-icon>
              <span class="rule-text">
                <span class="rule-sentence">${u.text}</span>
                ${u.chips.map(E=>r`<span class="rule-chip">${E}</span>`)}
                ${u.badges.length?r`<span class="rule-badges">${u.badges.map(E=>r`<span class="rule-badge">${E}</span>`)}</span>`:c}
              </span>
            </button>
            ${u.removable?r`
              <ha-icon-button class="rule-remove" .path=${He} .label=${i("remove",e)} title=${i("remove",e)}
                @click=${()=>this._removeRule(u.id)}></ha-icon-button>`:c}
          </div>`)}m.add&&(a+=2,this._ruleSel==="add"&&(h=a+1),_.push(r`
          <button type="button" class="rule-add" style="order:${a}" aria-expanded=${this._ruleSel==="add"?"true":"false"}
            @click=${()=>this._selectRule("add")}>
            <ha-icon icon="mdi:plus"></ha-icon>${i("beta_rules_add_rule",e)}
          </button>`))}let p=this._ruleSel;return r`
      <div class="rules-layout">
        ${_}
        <aside class="rules-sidebar ${p?"open":""}" style="order:${h}" aria-label=${p?this._sidebarTitle(p,e):i("beta_rules_select_hint",e)}>
          ${p?r`
                <div class="sidebar-head">
                  <ha-icon-button .path=${Me} .label=${i("close",e)} @click=${()=>{this._ruleSel=null}}></ha-icon-button>
                  <span class="sidebar-title">${this._sidebarTitle(p,e)}</span>
                </div>
                <div class="sidebar-body">${this._renderSidebarBody(p,e)}</div>`:r`<div class="sidebar-hint">${i("beta_rules_select_hint",e)}</div>`}
        </aside>
      </div>`}_renderObjectChoice(e){return this._taskId!==null||this._objectChoices.length===0?c:r`
      <div class="select-row">
        ${x()?c:r`<label>${i("object",e)}</label>`}
        ${b({label:i("object",e),value:this._entryId,onChange:t=>{this._entryId=t.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}},r`
          ${this._objectChoices.map(t=>r`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
        `)}
      </div>`}_renderChooser(e){let t=(s,n,a,h,_)=>r`
      <button type="button" class="chooser-item ${s}" @click=${_}>
        <ha-icon icon=${n}></ha-icon>
        <span class="chooser-text">
          <span class="chooser-title">${a}</span>
          <span class="chooser-desc">${h}</span>
        </span>
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </button>`;return r`
      ${this._renderObjectChoice(e)}
      <div class="chooser">
        ${t("chooser-scratch","mdi:pencil",i("beta_new_scratch",e),i("beta_new_scratch_desc",e),()=>{this._betaStep="form",this._ruleSel="task"})}
        ${t("chooser-sensor","mdi:auto-fix",i("beta_new_from_sensor",e),i("beta_new_from_sensor_desc",e),()=>{this._betaStep="form",this._ruleSel="add",this._addTab="device",this._loadObjectDevice()})}
        ${t("chooser-template","mdi:text-box-outline",i("templates_from",e),i("beta_new_from_template_desc",e),()=>{this._betaStep="template",this._chooserFilter="",this._loadTemplateChoices()})}
        ${t("chooser-copy","mdi:content-copy",i("beta_new_copy",e),i("beta_new_copy_desc",e),()=>{this._betaStep="copy",this._chooserFilter="",this._loadCopyChoices()})}
      </div>`}_renderSearch(e){return r`<input type="search" class="chooser-search" aria-label=${i("beta_new_search",e)} placeholder=${i("beta_new_search",e)}
      .value=${this._chooserFilter} @input=${t=>{this._chooserFilter=t.target.value}} />`}_renderTemplatePick(e){if(this._templateChoices===null)return r`<div class="chooser-empty">…</div>`;let t=this._chooserFilter.trim().toLowerCase(),s=this._templateChoices.filter(n=>!t||`${n.name} ${n.template}`.toLowerCase().includes(t)).slice(0,200);return r`
      ${this._renderSearch(e)}
      <div class="chooser">
        ${s.length?s.map(n=>r`
          <button type="button" class="chooser-item template-task" @click=${()=>this._applyTemplateTask(n)}>
            <ha-icon icon=${n.schedule_type==="sensor_based"?"mdi:gauge":"mdi:calendar-sync"}></ha-icon>
            <span class="chooser-text">
              <span class="chooser-title">${n.name}</span>
              <span class="chooser-desc">${n.template}${n.interval_days?r` · ${P(n.interval_days,e)} ${i("unit_days",e)}`:c}</span>
            </span>
          </button>`):r`<div class="chooser-empty">—</div>`}
      </div>`}_renderCopyPick(e){if(this._copyChoices===null)return r`<div class="chooser-empty">…</div>`;let t=this._chooserFilter.trim().toLowerCase(),s=this._copyChoices.filter(n=>!t||`${n.task.name} ${n.objectName}`.toLowerCase().includes(t)).slice(0,200);return r`
      ${this._renderSearch(e)}
      <div class="chooser">
        ${s.length?s.map(n=>r`
          <button type="button" class="chooser-item copy-task" @click=${()=>{this._applyCopy(n)}}>
            <ha-icon icon="mdi:content-copy"></ha-icon>
            <span class="chooser-text">
              <span class="chooser-title">${n.task.name}</span>
              <span class="chooser-desc">${n.objectName}</span>
            </span>
          </button>`):r`<div class="chooser-empty">—</div>`}
      </div>`}_renderBeta(e,t,s){let n=this._betaStep;return r`
      <ha-dialog open class="beta-dialog" .headerTitle=${t}
        .headerSubtitle=${this._series.length>1?i("task_series_position",e).replace("{n}",String(this._seriesIndex+1)).replace("{total}",String(this._series.length)):void 0}
        @closed=${this._close}>
        <!-- HA's header (2026): the title beside the close button; on a
             step under the start screen HA's back arrow takes its place. -->
        ${n==="template"||n==="copy"?r`<ha-icon-button slot="headerNavigationIcon" class="beta-back" .path=${De} .label=${i("back",e)}
              @click=${()=>{this._betaStep="choose"}}></ha-icon-button>`:c}
        <div class="content beta-content">
          ${this._error?F("error",this._error):c}
          ${this._warning?F("warning",this._warning):c}
          ${n==="choose"?this._renderChooser(e):n==="template"?this._renderTemplatePick(e):n==="copy"?this._renderCopyPick(e):this._renderRules(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${i("cancel",e)}</ha-button>
          ${n==="form"&&s?r`<ha-button appearance="plain" class="series-skip" .disabled=${this._loading} @click=${this._skipSeriesItem}>
                ${i("task_series_skip",e)}
              </ha-button>`:c}
          ${n==="form"?r`<ha-button @click=${this._save} .disabled=${this._loading||!this._name.trim()||this._missingDueDate()}>
                ${this._loading?i("saving",e):i(s?"task_series_save_next":"save",e)}
              </ha-button>`:c}
        </div>
      </ha-dialog>
    `}render(){if(!this._open)return r``;let e=this._lang,t=this._taskId?i("edit_task",e):i("new_task",e),s=this._seriesIndex+1<this._series.length;return this.betaEditor?this._renderBeta(e,t,s):r`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">
          ${t}
          ${this._series.length>1?r`<span class="series-position">${i("task_series_position",e).replace("{n}",String(this._seriesIndex+1)).replace("{total}",String(this._series.length))}</span>`:c}
        </div>
        <div class="content">
          ${this._error?F("error",this._error):c}
          ${this._warning?F("warning",this._warning):c}
          ${this._renderIdentity(e)}
          ${this._renderScheduleSection(e)}
          ${this._renderTriggerSection(e)}
          ${this._renderCompletionSection(e)}
          ${this._renderPeopleSection(e)}
          ${this._renderNotificationsSection(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${i("cancel",e)}</ha-button>
          ${s?r`<ha-button appearance="plain" class="series-skip" .disabled=${this._loading} @click=${this._skipSeriesItem}>
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
    `}};o._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_calMonths","_calendarEntity","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),o.styles=[le,de,ke,D`
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
      border-radius: var(--ms-radius-6, 6px);
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
    /* A phone, and a phone held sideways: 70 % of 390 px plus the title and
       the buttons was taller than the screen, so Save sat below its edge
       with nothing to scroll (2026-10-31). The dialog scrolls as a whole. */
    @media (max-width: 600px), (max-height: 500px) {
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
      border-radius: var(--ms-radius-6, 6px);
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
  `],l([w({attribute:!1})],o.prototype,"hass",2),l([w({type:Boolean,attribute:"checklists-enabled"})],o.prototype,"checklistsEnabled",2),l([w({type:Boolean,attribute:"schedule-time-enabled"})],o.prototype,"scheduleTimeEnabled",2),l([w({type:Boolean,attribute:"completion-actions-enabled"})],o.prototype,"completionActionsEnabled",2),l([w({type:Boolean,attribute:"adaptive-feature"})],o.prototype,"adaptiveFeature",2),l([w({type:Boolean,attribute:"seasonal-feature"})],o.prototype,"seasonalFeature",2),l([w({type:Boolean,attribute:"environmental-feature"})],o.prototype,"environmentalFeature",2),l([w({type:Number,attribute:"default-warning-days"})],o.prototype,"defaultWarningDays",2),l([w({attribute:!1})],o.prototype,"mirrorTodoDefault",2),l([w({type:Boolean,attribute:"beta-editor"})],o.prototype,"betaEditor",2),l([d()],o.prototype,"_ruleSel",2),l([d()],o.prototype,"_addTab",2),l([d()],o.prototype,"_betaStep",2),l([d()],o.prototype,"_chooserFilter",2),l([d()],o.prototype,"_templateChoices",2),l([d()],o.prototype,"_copyChoices",2),l([d()],o.prototype,"_objectDevice",2),l([d()],o.prototype,"parts",2),l([d()],o.prototype,"_foreignOwners",2),l([d()],o.prototype,"_open",2),l([d()],o.prototype,"_entityPickerFallback",2),l([d()],o.prototype,"_loading",2),l([d()],o.prototype,"_error",2),l([d()],o.prototype,"_warning",2),l([d()],o.prototype,"_entryId",2),l([d()],o.prototype,"_taskId",2),l([d()],o.prototype,"_series",2),l([d()],o.prototype,"_seriesIndex",2),l([d()],o.prototype,"_isFleetTask",2),l([d()],o.prototype,"_objectChoices",2),l([d()],o.prototype,"_name",2),l([d()],o.prototype,"_type",2),l([d()],o.prototype,"_scheduleType",2),l([d()],o.prototype,"_intervalDays",2),l([d()],o.prototype,"_intervalUnit",2),l([d()],o.prototype,"_dueDate",2),l([d()],o.prototype,"_warningDays",2),l([d()],o.prototype,"_earliestCompletionDays",2),l([d()],o.prototype,"_intervalAnchor",2),l([d()],o.prototype,"_weekdays",2),l([d()],o.prototype,"_nth",2),l([d()],o.prototype,"_nthWeekday",2),l([d()],o.prototype,"_domDay",2),l([d()],o.prototype,"_domLastDay",2),l([d()],o.prototype,"_domBusiness",2),l([d()],o.prototype,"_calOffset",2),l([d()],o.prototype,"_calMonths",2),l([d()],o.prototype,"_calendarEntity",2),l([d()],o.prototype,"_seasonMonths",2),l([d()],o.prototype,"_endsMode",2),l([d()],o.prototype,"_endsCount",2),l([d()],o.prototype,"_endsUntil",2),l([d()],o.prototype,"_schedulePreview",2),l([d()],o.prototype,"_schedulePreviewEnded",2),l([d()],o.prototype,"_notes",2),l([d()],o.prototype,"_documentationUrl",2),l([d()],o.prototype,"_customIcon",2),l([d()],o.prototype,"_notifyIcon",2),l([d()],o.prototype,"_priority",2),l([d()],o.prototype,"_labels",2),l([d()],o.prototype,"_detailsOpen",2),l([d()],o.prototype,"_mirrorTodoEntities",2),l([d()],o.prototype,"_mirrorTodoMode",2),l([d()],o.prototype,"_completeWhenEntity",2),l([d()],o.prototype,"_completeWhenState",2),l([d()],o.prototype,"_completeWhenAnyTime",2),l([d()],o.prototype,"_completeWhenFor",2),l([d()],o.prototype,"_enabled",2),l([d()],o.prototype,"_triggerEntityId",2),l([d()],o.prototype,"_triggerEntityIds",2),l([d()],o.prototype,"_triggerEntityLogic",2),l([d()],o.prototype,"_triggerAttribute",2),l([d()],o.prototype,"_triggerType",2),l([d()],o.prototype,"_triggerAbove",2),l([d()],o.prototype,"_triggerBelow",2),l([d()],o.prototype,"_triggerEquals",2),l([d()],o.prototype,"_triggerNotEquals",2),l([d()],o.prototype,"_triggerForMinutes",2),l([d()],o.prototype,"_triggerCombinator",2),l([d()],o.prototype,"_triggerTargetValue",2),l([d()],o.prototype,"_triggerDeltaMode",2),l([d()],o.prototype,"_triggerBaselineValue",2),l([d()],o.prototype,"_liveBaselineValue",2),l([d()],o.prototype,"_autoCompleteOnRecovery",2),l([d()],o.prototype,"_holdUntilDone",2),l([d()],o.prototype,"_triggerFromState",2),l([d()],o.prototype,"_triggerToState",2),l([d()],o.prototype,"_triggerTargetChanges",2),l([d()],o.prototype,"_triggerRuntimeHours",2),l([d()],o.prototype,"_triggerDaysBefore",2),l([d()],o.prototype,"_triggerRuntimeMaxSession",2),l([d()],o.prototype,"_triggerOnStates",2),l([d()],o.prototype,"_triggerDetailAttribute",2),l([d()],o.prototype,"_compoundLogic",2),l([d()],o.prototype,"_compoundConditions",2),l([d()],o.prototype,"_suggestedAttributes",2),l([d()],o.prototype,"_availableAttributes",2),l([d()],o.prototype,"_entityDomain",2),l([d()],o.prototype,"_lastPerformed",2),l([d()],o.prototype,"_nfcTagId",2),l([d()],o.prototype,"_requireTagScan",2),l([d()],o.prototype,"_allowSkip",2),l([d()],o.prototype,"_notifyEnabled",2),l([d()],o.prototype,"_readingUnit",2),l([d()],o.prototype,"_readings",2),l([d()],o.prototype,"_consumesParts",2),l([d()],o.prototype,"_consumesQtyText",2),l([d()],o.prototype,"_partsLoadFailed",2),l([d()],o.prototype,"_availableTags",2),l([d()],o.prototype,"_responsibleUserId",2),l([d()],o.prototype,"_assigneePool",2),l([d()],o.prototype,"_rotationStrategy",2),l([d()],o.prototype,"_availableUsers",2),l([d()],o.prototype,"_checklistText",2),l([d()],o.prototype,"_phaseDefs",2),l([d()],o.prototype,"_phaseSeq",2),l([d()],o.prototype,"_requiredCompletion",2),l([d()],o.prototype,"_scheduleTime",2),l([d()],o.prototype,"_scheduleTimeOn",2),l([d()],o.prototype,"_actionService",2),l([d()],o.prototype,"_actionTargetEntity",2),l([d()],o.prototype,"_actionSkipAuto",2),l([d()],o.prototype,"_actionPresent",2),l([d()],o.prototype,"_actionData",2),l([d()],o.prototype,"_actionDataJsonFallback",2),l([d()],o.prototype,"_actionTesting",2),l([d()],o.prototype,"_actionTestResult",2),l([d()],o.prototype,"_actionTestError",2),l([d()],o.prototype,"_quickOn",2),l([d()],o.prototype,"_qcNotes",2),l([d()],o.prototype,"_qcCost",2),l([d()],o.prototype,"_qcDuration",2),l([d()],o.prototype,"_qcFeedback",2),l([d()],o.prototype,"_environmentalEntity",2),l([d()],o.prototype,"_environmentalAttribute",2),l([d()],o.prototype,"_adaptiveEnabled",2),l([d()],o.prototype,"_adaptiveAlpha",2),l([d()],o.prototype,"_adaptiveMin",2),l([d()],o.prototype,"_adaptiveMax",2),l([d()],o.prototype,"_adaptiveSeasonal",2),l([d()],o.prototype,"_adaptivePrediction",2),l([d()],o.prototype,"_conditionAttrOptions",2);var se=o;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",se);export{se as MaintenanceTaskDialog,Pe as applyTypeFields,qe as typeFieldsFromConfig};
