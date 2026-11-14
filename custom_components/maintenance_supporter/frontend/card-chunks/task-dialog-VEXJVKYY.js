/*! maintenance_supporter frontend 2.121.0 */
import{a as He,c as Me}from"/maintenance_supporter_cardfiles/card-chunks/chunk-WRZKFOFB.js";import{a as Ce,b as Ae,f as qe}from"/maintenance_supporter_cardfiles/card-chunks/chunk-UX7KMIG4.js";import{a as H,b as Ie,c as se,d as Se,e as ke}from"/maintenance_supporter_cardfiles/card-chunks/chunk-A4ERLYN4.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-TNNDI7Y6.js";import{a as le,b as Q}from"/maintenance_supporter_cardfiles/card-chunks/chunk-LJDOAC3A.js";import{a as Re,b as Ne,g as Pe,h as Fe,i as re}from"/maintenance_supporter_cardfiles/card-chunks/chunk-E5MLVT4N.js";import{a as x,b}from"/maintenance_supporter_cardfiles/card-chunks/chunk-QRYYJHCZ.js";import{a as oe}from"/maintenance_supporter_cardfiles/card-chunks/chunk-FQDZJXMK.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-4OGUYIMV.js";import{a as k}from"/maintenance_supporter_cardfiles/card-chunks/chunk-MQFJPGCQ.js";import{a as $}from"/maintenance_supporter_cardfiles/card-chunks/chunk-5RJSJQBX.js";import{b as G,c as K,d as Oe,e as M,f as D,g as j,h as ne,i as ae}from"/maintenance_supporter_cardfiles/card-chunks/chunk-ZFF2BTRF.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-Y6UJU4DI.js";import{a as we}from"/maintenance_supporter_cardfiles/card-chunks/chunk-W5RH6LVB.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-ZPSYSN2J.js";import{a as U}from"/maintenance_supporter_cardfiles/card-chunks/chunk-2VWI4DYT.js";import{a as V}from"/maintenance_supporter_cardfiles/card-chunks/chunk-CAKUGV4A.js";import{a as S,b as c}from"/maintenance_supporter_cardfiles/card-chunks/chunk-E4ABH5J2.js";import{N as be,O as P,P as z,Q as w,R as $e,S as L,X as F,a as d,b as B,e as n,ea as q,fa as xe,h as p,ia as O,j as fe,la as Ee,ma as Te,w as ye,x as s}from"/maintenance_supporter_cardfiles/card-chunks/chunk-WAUYZK63.js";var de=["sensor","binary_sensor","number","input_number","input_boolean","counter","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock","plant","input_select","select","input_datetime","date","datetime","timer","update"],De=["sensor"];var st={cleaning:"mdi:broom",inspection:"mdi:magnify",replacement:"mdi:swap-horizontal",calibration:"mdi:tune",service:"mdi:wrench",reading:"mdi:counter",custom:"mdi:wrench-clock"},rt="mdi:wrench-clock",ce=a=>a&&st[a]||rt;var he={due_soon:["task","object","days","due"],overdue:["task","object","days","due"],triggered:["task","object","detail"],completed:["task","object","reason","person"]},Y=Object.keys(he),nt=120,at=500;function je(a,u){return Array.from(a).slice(0,u).join("")}function _e(a){let u={};for(let e of Y){let t=a?.[e];if(!t||typeof t!="object")continue;let i={},r=typeof t.title=="string"?t.title:"",o=typeof t.message=="string"?t.message:"",h=je(r.split(/\s+/).filter(Boolean).join(" "),nt).trim(),_=je(o.replace(/\r\n/g,`
`).trim(),at).trim();h&&(i.title=h),_&&(i.message=_),(i.title||i.message)&&(u[e]=i)}return Object.keys(u).length?u:null}function pe(a){let u=_e(a);return u?Y.filter(e=>u[e]):[]}function Ue(){return{type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",daysBefore:"0"}}function ue(a){return{type:a.type||"threshold",attribute:a.attribute||"",above:a.trigger_above?.toString()??"",below:a.trigger_below?.toString()??"",equals:a.trigger_equals?.toString()??"",notEquals:a.trigger_not_equals?.toString()??"",forMinutes:a.trigger_for_minutes?.toString()??"0",targetValue:a.trigger_target_value?.toString()??"",deltaMode:a.trigger_delta_mode||!1,fromState:a.trigger_from_state||"",toState:a.trigger_to_state||"",targetChanges:a.trigger_target_changes?.toString()??"",runtimeHours:a.trigger_runtime_hours?.toString()??"",onStates:(a.trigger_on_states||[]).join(", "),daysBefore:a.trigger_days_before?.toString()??"0"}}function J(a,u){u.attribute&&(a.attribute=u.attribute);let e=parseInt(u.forMinutes,10);if(u.type==="threshold"){let t=parseFloat(u.above);isNaN(t)||(a.trigger_above=t);let i=parseFloat(u.below);isNaN(i)||(a.trigger_below=i);let r=parseFloat(u.equals);isNaN(r)||(a.trigger_equals=r);let o=parseFloat(u.notEquals);isNaN(o)||(a.trigger_not_equals=o),isNaN(e)||(a.trigger_for_minutes=e)}else if(u.type==="counter"){let t=parseFloat(u.targetValue);isNaN(t)||(a.trigger_target_value=t),a.trigger_delta_mode=u.deltaMode}else if(u.type==="state_change"){u.fromState&&(a.trigger_from_state=u.fromState),u.toState&&(a.trigger_to_state=u.toState);let t=parseInt(u.targetChanges,10);isNaN(t)||(a.trigger_target_changes=t),isNaN(e)||(a.trigger_for_minutes=e)}else if(u.type==="runtime"){let t=parseFloat(u.runtimeHours);isNaN(t)||(a.trigger_runtime_hours=t);let i=(u.onStates||"").split(",").map(r=>r.trim()).filter(Boolean);i.length>0&&(a.trigger_on_states=i)}else if(u.type==="due_date"){let t=parseInt(u.daysBefore,10);a.trigger_days_before=isNaN(t)?0:t}}function We(a){let u={type:a.type};return J(u,a),u}function Be(a,u){return a?.entities?.[u]?.platform==="maintenance_supporter"}function ze(a){return Object.keys(a?.entities||{}).filter(u=>u.startsWith("todo.")&&Be(a,u))}function X(a,u){return[...new Set(u.filter(e=>e&&!Be(a,e)))].slice(0,5)}function ot(a,u=[]){let e=(a.mirror_todo_entities??[]).filter(t=>typeof t=="string"&&!!t);return e.length?e:a.mirror_todo_use_default===!1||!Array.isArray(u)?[]:[...u]}function Le(a,u,e,t){let i=e.length&&u!=="own"?[]:X(a,t),r=e.length?u==="default":u!=="none";return{entities:i,useDefault:r,lists:ot({mirror_todo_entities:i,mirror_todo_use_default:r},e)}}var lt=["weekdays","nth_weekday","day_of_month","calendar"],dt=["time_based",...lt,"one_time"],ct=["threshold","counter","state_change","runtime","due_date","compound"],ht={time_based:"mdi:calendar-sync",weekdays:"mdi:calendar-week",nth_weekday:"mdi:calendar-today",day_of_month:"mdi:calendar-month",calendar:"mdi:calendar-star",one_time:"mdi:calendar-check",manual:"mdi:gesture-tap",sensor_based:"mdi:calendar-sync"},ge={threshold:"mdi:gauge",counter:"mdi:counter",state_change:"mdi:state-machine",runtime:"mdi:timer-outline",due_date:"mdi:calendar-alert",compound:"mdi:set-center"};function Ve(a){return ht[a]??"mdi:calendar"}var _t={days:"day",weeks:"week",months:"month",years:"year"};function pt(a,u,e){return P(a,_t[u]??"day",e)}function E(a,u){return Object.entries(u).reduce((e,[t,i])=>e.split(`{${t}}`).join(i),a)}function ut(a,u){let e=u,t={offset:parseInt(a.calOffset??"0",10)||0,months:a.calMonths},i=()=>{let r=parseInt(a.intervalDays,10);return Number.isFinite(r)&&r>0?pt(r,a.intervalUnit,e):null};switch(a.scheduleType){case"time_based":{let r=i();return r?E(s("beta_rules_every",e),{interval:r}):s("beta_rules_manual",e)}case"one_time":return a.dueDate?E(s("beta_rules_once_on",e),{date:F(a.dueDate,e)}):s("beta_rules_no_date",e);case"manual":return s("beta_rules_manual",e);case"weekdays":{let r=[...a.weekdays].sort((o,h)=>o-h).map(o=>q(o,e,"short"));return`${s("recurrence_on_days",e)}: ${r.length?r.join(", "):"\u2014"}${O(t,e,!1)}`}case"nth_weekday":{let r=a.nth==="-1"?s("ord_last",e):s(`ord_${a.nth}`,e);return`${s("nth_weekday",e)}: ${r} ${q(parseInt(a.nthWeekday,10)||0,e,"long")}${O(t,e)}`}case"day_of_month":{let r=a.domLastDay?s(a.domBusiness?"last_business_day_month":"recurrence_last_day",e):a.domDay;return`${s("day_of_month",e)}: ${r}${O(t,e)}`}case"calendar":return`${s("calendar_entity_label",e)}: ${a.calendarEntity||"\u2014"}${O(t,e,!1)}`;case"sensor_based":{let r=i();return r?E(s(a.triggerCombinator==="all"?"beta_rules_safety_all":"beta_rules_safety_any",e),{interval:r}):s("beta_rules_sensor_only",e)}default:return s(a.scheduleType,e)}}function gt(a,u){let e=[];a.scheduleType==="time_based"&&parseInt(a.intervalDays,10)>0&&e.push(s(a.intervalAnchor==="planned"?"anchor_planned":"anchor_completion",u));let t=parseInt(a.warningDays,10);return a.scheduleType!=="manual"&&Number.isFinite(t)&&t>0&&e.push(E(s("beta_rules_due_soon",u),{interval:P(t,"day",u)})),e}function mt(a,u){let e=u;if(a.trigger.type==="compound"){let t=a.compoundLogic==="OR"?"beta_rules_any_of":"beta_rules_all_of";return E(s(t,e),{n:w(a.compoundCount,e)})}return a.triggerEntityIds.length?vt(We(a.trigger),a.triggerUnit,e):s("beta_rules_pick_entity",e)}function vt(a,u,e){let t=e,i=_=>L(w(_,t),u,t),r=[],o=a.type||"threshold";switch(o){case"threshold":a.trigger_above!=null&&r.push(E(s("beta_rules_above",t),{value:i(a.trigger_above)})),a.trigger_below!=null&&r.push(E(s("beta_rules_below",t),{value:i(a.trigger_below)})),a.trigger_equals!=null&&r.push(`= ${typeof a.trigger_equals=="number"?i(a.trigger_equals):a.trigger_equals}`),a.trigger_not_equals!=null&&r.push(`\u2260 ${typeof a.trigger_not_equals=="number"?i(a.trigger_not_equals):a.trigger_not_equals}`),r.length||r.push(s("threshold",t));break;case"counter":r.push(E(s(a.trigger_delta_mode?"beta_rules_counter_delta":"beta_rules_counter_reaches",t),{value:a.trigger_target_value!=null?i(a.trigger_target_value):"\u2014"}));break;case"state_change":{let _=(a.trigger_from_state??"").trim(),g=(a.trigger_to_state??"").trim();_&&r.push(E(s("beta_rules_changes_from",t),{state:_})),g&&r.push(E(s("beta_rules_changes_to",t),{state:g})),!_&&!g&&r.push(s("beta_rules_changes",t)),a.trigger_target_changes&&a.trigger_target_changes>1&&r.push(E(s("beta_rules_times",t),{n:w(a.trigger_target_changes,t)}));break}case"runtime":r.push(E(s("beta_rules_runs_for",t),{duration:a.trigger_runtime_hours!=null?P(a.trigger_runtime_hours,"hour",t):"\u2014"}));break;case"due_date":r.push(a.trigger_days_before&&a.trigger_days_before>0?E(s("beta_rules_date_before",t),{interval:P(a.trigger_days_before,"day",t)}):s("beta_rules_date_on",t));break}(o==="threshold"||o==="state_change")&&a.trigger_for_minutes&&a.trigger_for_minutes>0&&r.push(E(s("beta_rules_for",t),{duration:z(a.trigger_for_minutes,t)}));let h=r.join(" \xB7 ");return a.attribute?`${h} (${a.attribute})`:h}function ft(a,u){let e=u.lang,t=[],i;if(a.completeWhenEntity&&a.completeWhenState.trim()){let o=u.entityName(a.completeWhenEntity);t.push(o),i=E(s("complete_when_badge",e),{entity:o,state:a.completeWhenState.trim()});let h=parseInt(a.completeWhenFor,10);Number.isFinite(h)&&h>0&&(i+=` \xB7 ${E(s("complete_when_badge_for",e),{minutes:w(h,e)})}`),a.completeWhenAnyTime&&(i+=` \xB7 ${s("complete_when_badge_any_time",e)}`)}else i=s("beta_rules_by_hand",e);let r=[];return a.quickOn&&r.push(s("quick_complete_label",e)),a.requiredCount>0&&r.push(`${s("require_on_completion",e)}: ${w(a.requiredCount,e)}`),a.checklistCount>0&&r.push(`${s("checklist",e)}: ${w(a.checklistCount,e)}`),a.partsCount>0&&r.push(`${s("consumes_parts_label",e)}: ${w(a.partsCount,e)}`),a.requireTagScan&&r.push(s("require_tag_scan",e)),a.allowSkip||r.push(s("disallow_skip",e)),{text:i,chips:t,badges:r}}function Ge(a,u){let e=u.lang,t=[];t.push({id:"task",icon:"mdi:clipboard-text-outline",text:a.name.trim()||s("beta_rules_name_missing",e),chips:[],badges:[a.typeLabel,...a.enabled?[]:[s("disabled",e)]],removable:!1});let i=a.scheduleType==="sensor_based";if(t.push({id:"schedule",icon:Ve(a.scheduleType),text:ut(a,e),chips:[],badges:gt(a,e),removable:i?parseInt(a.intervalDays,10)>0:a.scheduleType!=="manual"}),i){let _=a.trigger.type==="compound",g=_?a.compoundEntityIds:a.triggerEntityIds;t.push({id:"trigger",icon:ge[a.trigger.type]??"mdi:gauge",text:mt(a,e),chips:[...new Set(g)].map(v=>u.entityName(v)),badges:!_&&a.triggerEntityIds.length>1?[s(a.entityLogic==="all"?"entity_logic_all":"entity_logic_any",e)]:[],removable:!0})}let r=ft(a,u);t.push({id:"completion",icon:"mdi:check-circle-outline",text:r.text,chips:r.chips,badges:r.badges,removable:!1});let o=a.pool.length>=2&&a.rotation?[s(`rotation_${a.rotation}`,e)]:[],h;return a.responsibleUserId?h=`${s("responsible_user",e)}: ${u.userName(a.responsibleUserId)}`:a.pool.length?h=`${s("task_shared_with",e)}: ${a.pool.map(_=>u.userName(_)).join(", ")}`:h=s("beta_rules_nobody",e),t.push({id:"people",icon:"mdi:account-multiple",text:h,chips:[],badges:o,removable:!1}),t.push({id:"notifications",icon:a.notifyEnabled?"mdi:bell-ring-outline":"mdi:bell-off-outline",text:a.notifyEnabled?s("beta_rules_reminders_on",e):s("no_notifications",e),chips:a.mirrorLists.map(_=>u.entityName(_)),badges:a.notifyEnabled&&a.ownTexts?[s("notify_texts_badge",e)]:[],removable:!1}),t}function Ke(a){let u=a.scheduleType==="sensor_based",e=parseInt(a.intervalDays,10)>0,t=[];for(let i of dt){if(i===a.scheduleType)continue;let r;if(u)if(i==="time_based"){if(e)continue;r="safety"}else r="replace";else r=a.scheduleType==="manual"?"set":"replace";t.push({kind:"schedule",value:i,icon:Ve(i),effect:r})}for(let i of ct){if(u&&i==="compound")continue;let r;u?r="combine":r=a.scheduleType==="time_based"||a.scheduleType==="manual"?"set":"replace",t.push({kind:"trigger",value:i,icon:ge[i],effect:r})}return t}var yt=new Set(["binary_sensor","input_boolean","switch","fan","light","lock","cover","valve","siren"]),bt=new Set(["switch","fan","light","valve","input_boolean"]),$t=new Set(["running","power","plug","heat","cold","moving","vibration"]),xt=new Set(["door","opening","window","garage_door","lock","running","moving","vibration","occupancy","presence"]),Et=new Set(["total","total_increasing"]),Tt=new Set(["select","input_select","vacuum","lawn_mower","climate","water_heater","media_player","alarm_control_panel","event"]);function me(a){let u={entityId:a.entityId,name:a.name},e=i=>({...u,target:"trigger",triggerType:i,icon:ge[i]}),t={...u,target:"done_when",icon:"mdi:check-circle-outline"};if(a.domain==="sensor")return a.deviceClass==="timestamp"||a.deviceClass==="date"?[e("due_date")]:a.numeric?Et.has(a.stateClass??"")?[e("counter"),e("threshold")]:a.deviceClass==="duration"?[e("threshold"),e("counter")]:[e("threshold")]:[e("state_change"),t];if(a.domain==="counter")return[e("counter")];if(a.domain==="update")return[e("state_change")];if(a.domain==="number"||a.domain==="input_number")return[e("threshold")];if(yt.has(a.domain)){let i=[];return xt.has(a.deviceClass??"")&&i.push(t),i.push(e("state_change")),(bt.has(a.domain)||$t.has(a.deviceClass??""))&&i.push(e("runtime")),i.includes(t)||i.push(t),i}return Tt.has(a.domain)?[e("state_change"),t]:[]}function Qe(a,u){let e=a.devices??{},t=u.areaId||(u.deviceId?e[u.deviceId]?.area_id:null)||null,i=h=>h.area_id||(h.device_id?e[h.device_id]?.area_id:null)||null,r=[];for(let[h,_]of Object.entries(a.entities??{})){if(_.platform===u.ownPlatform||_.hidden)continue;let g;if(u.deviceId&&_.device_id===u.deviceId)g="device";else if(t&&i(_)===t)g="area";else continue;let v=a.states?.[h];if(!v)continue;let f=v.attributes??{};r.push({entityId:h,name:typeof f.friendly_name=="string"?f.friendly_name:h,domain:h.split(".")[0],deviceClass:typeof f.device_class=="string"?f.device_class:void 0,stateClass:typeof f.state_class=="string"?f.state_class:void 0,numeric:v.state!==""&&Number.isFinite(Number(v.state))||typeof f.unit_of_measurement=="string",group:g,secondary:!!_.entity_category})}let o=h=>h.group==="device"?0:1;return r.sort((h,_)=>o(h)-o(_)||Number(h.secondary)-Number(_.secondary)||h.name.localeCompare(_.name)),r.map(({secondary:h,..._})=>_).filter(h=>me(h).length>0)}var Ye=B`
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
`;var It="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z",St="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",kt="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",Je=["cleaning","inspection","replacement","calibration","service","reading","custom"],Ct=["time_based","weekdays","nth_weekday","day_of_month","calendar","sensor_based","one_time","manual"],te=["weekdays","nth_weekday","day_of_month","calendar"],Xe=["time_based","one_time",...te],et=["threshold","counter","state_change","runtime","due_date"],Z=(a,u)=>s(a==="due_date"?"trigger_type_due_date":a,u),At=[...et,"compound"],I={alpha:"0.3",min:"7",max:"365"};function tt(...a){return JSON.stringify(a)}var qt=tt(!1,I.alpha,I.min,I.max,!0,!0),A=ae;function ee(){return{entityIds:"",...Ue(),carry:{}}}var Rt=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states","trigger_days_before"]);function Nt(a){return{entityIds:se(a).join(", "),...ue(a),carry:Object.fromEntries(Object.entries(a).filter(([e])=>!Rt.has(e)&&!e.startsWith("_")))}}function Pt(a){let u=a.entityIds.split(",").map(t=>t.trim()).filter(Boolean);if(u.length===0)return null;let e={...a.carry||{},entity_id:u[0],entity_ids:u,type:a.type};return J(e,a),e}function Ft(a){return Array.from({length:7},(u,e)=>q(e,a,"short"))}function Ze(a){return Array.from({length:12},(u,e)=>xe(e,a,"short"))}function Ot(a){let u=Array.isArray(a)?a.filter(e=>e!=null&&e!=="").join(", "):a!==null&&typeof a=="object"||a==null?"":String(a);return $e(u)}var l=class l extends fe{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.adaptiveFeature=!1;this.seasonalFeature=!1;this.environmentalFeature=!1;this.defaultWarningDays=7;this.mirrorTodoDefault=[];this.betaEditor=!1;this._ruleSel=null;this._addTab="type";this._betaStep="form";this._chooserFilter="";this._templateChoices=null;this._copyChoices=null;this._objectDevice=null;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._warning="";this._entryId="";this._taskId=null;this._series=[];this._seriesIndex=0;this._isFleetTask=!1;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._calMonths=[];this._hadCalMonths=!1;this._calendarEntity="";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._notifyIcon="";this._notifyTexts={};this._notifyTextsOpen=!1;this._priority="normal";this._labels="";this._detailsOpen=!1;this._mirrorTodoEntities=[];this._mirrorTodoMode="default";this._completeWhenEntity="";this._completeWhenState="";this._completeWhenAnyTime=!1;this._completeWhenFor="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._holdUntilDone=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerDaysBefore="0";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._triggerDetailAttribute="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._notifyEnabled=!0;this._readingUnit="";this._readings=[];this._consumesParts={};this._consumesQtyText={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._loadedLastPerformed="";this._loadedResponsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._scheduleTimeOn=!1;this._actionService="";this._actionTargetEntity="";this._actionTargetStored=null;this._actionTargetInitial="";this._actionSkipAuto=!1;this._actionPresent=!1;this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._quickOn=!1;this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._qcValuesOpen=!1;this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=I.alpha;this._adaptiveMin=I.min;this._adaptiveMax=I.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._adaptiveWasEnabled=!1;this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set;this._attrSeq=0}_adaptiveSnapshot(){return tt(this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction)}get _lang(){return ye(this.hass)}async openCreate(e,t){this._series=[],this._entryId=e,this._taskId=null,this._isFleetTask=!1,this._error="",this._warning="";let i=(t||[]).filter(r=>!r.object.archived&&!r.object.archived_at);!e&&i.length>0?(this._objectChoices=i.map(r=>({entry_id:r.entry_id,name:r.object.name})).sort((r,o)=>r.name.localeCompare(o.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),this._betaStep=this.betaEditor?"choose":"form",this._ruleSel="task",this._addTab="type",this._chooserFilter="",await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(e,t){this._series=[],await this._edit(e,t)}async openEditSeries(e){e.length!==0&&(this._series=e,await this._editSeriesItem(0))}async _editSeriesItem(e){let t=this._series[e];this._seriesIndex=e,await this._edit(t.entryId,t.task),await this.updateComplete,this.shadowRoot?.querySelector(".dialog-title")?.scrollIntoView({block:"start"})}_skipSeriesItem(){this._editSeriesItem(this._seriesIndex+1)}async _edit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._warning="",this._betaStep="form",this._ruleSel=null,this._addTab="type",this._objectChoices=[],this._isFleetTask=t.battery_fleet_task===!0,this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let i=t.schedule;this._weekdays=i?.kind==="weekdays"?[...i.weekdays??[]]:[],this._nth=i?.kind==="nth_weekday"?String(i.nth??1):"1",this._nthWeekday=i?.kind==="nth_weekday"?String(i.weekday??5):"5",this._domDay=i?.kind==="day_of_month"&&(i.day??1)>=1?String(i.day??1):"1",this._domLastDay=i?.kind==="day_of_month"&&i.day===-1,this._domBusiness=i?.kind==="day_of_month"&&i.business===!0,this._calMonths=(i?.kind==="day_of_month"||i?.kind==="nth_weekday")&&Array.isArray(i.months)?[...i.months]:[],this._hadCalMonths=this._calMonths.length>0,this._calendarEntity=i?.kind==="calendar"&&i.entity_id||"",this._calOffset=i?.offset?String(i.offset):"0",this._seasonMonths=Array.isArray(i?.season_months)?[...i.season_months]:[];let r=i?.ends;r&&typeof r.count=="number"?(this._endsMode="count",this._endsCount=String(r.count),this._endsUntil=""):r&&typeof r.until=="string"?(this._endsMode="until",this._endsUntil=r.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=t.warning_days.toString(),this._earliestCompletionDays=t.earliest_completion_days!=null?String(t.earliest_completion_days):"",this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._notifyIcon=t.notify_icon||"",this._notifyTexts=Object.fromEntries(Object.entries(t.notification_texts??{}).map(([g,v])=>[g,{...v}])),this._notifyTextsOpen=pe(this._notifyTexts).length>0,this._priority=t.priority||"normal",this._labels=(t.labels||[]).join(", "),this._mirrorTodoEntities=[...t.mirror_todo_entities||[]],this._mirrorTodoMode=this._mirrorTodoEntities.length?"own":t.mirror_todo_use_default===!1?"none":"default",this._completeWhenEntity=t.complete_when?.entity_id||"",this._completeWhenState=t.complete_when?.to_state||"",this._completeWhenAnyTime=!!t.complete_when?.any_time,this._completeWhenFor=t.complete_when?.for_minutes?String(t.complete_when.for_minutes):"",this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._loadedLastPerformed=this._lastPerformed,this._nfcTagId=t.nfc_tag_id||"",this._requireTagScan=!!t.require_tag_scan,this._allowSkip=t.allow_skip!==!1,this._notifyEnabled=t.notify_enabled!==!1,this._readingUnit=t.reading_unit||"",this._readings=(t.readings||[]).map(g=>({...g})),this._consumesParts=Object.fromEntries((t.consumes_parts||[]).map(g=>[re(g),{...g}])),this._consumesQtyText={},this._responsibleUserId=t.responsible_user_id||null,this._loadedResponsibleUserId=this._responsibleUserId,this._assigneePool=[...t.assignee_pool||[]],this._rotationStrategy=t.rotation_strategy||"",this._checklistText=(t.checklist||[]).join(`
`),this._phaseDefs=Object.entries(t.phases||{}).map(([g,v])=>{let{name:f,checklist:m,consumes_parts:y,required_completion_fields:T,...R}=v,C=v.consumes_parts||[],N=C.findIndex(W=>!W.entry_id),ie=N>=0?C[N]:void 0;return{id:g,name:v.name||g,checklistText:(v.checklist||[]).join(`
`),partId:ie?.part_id||"",partQty:ie?.quantity!=null?String(ie.quantity):"",reqOverride:v.required_completion_fields!==void 0,reqFields:[...v.required_completion_fields||[]],extraParts:C.filter((W,it)=>it!==N).map(W=>({...W})),carry:R}}),this._phaseSeq=[...t.phase_sequence||[]],this._requiredCompletion=[...t.required_completion_fields||[]],this._scheduleTime=t.schedule_time||"",this._scheduleTimeOn=!!t.schedule_time;let o=t.on_complete_action;if(o&&o.service){this._actionService=o.service;let g=o.target?.entity_id;this._actionTargetEntity=Array.isArray(g)?g[0]||"":g||"",this._actionTargetStored=o.target&&typeof o.target=="object"?JSON.parse(JSON.stringify(o.target)):null,this._actionTargetInitial=this._actionTargetEntity,this._actionData=o.data&&typeof o.data=="object"?{...o.data}:{},this._actionDataJsonFallback="",this._actionSkipAuto=o.skip_auto===!0,this._actionPresent=!0}else this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1;let h=t.quick_complete_defaults;this._quickOn=we(t),this._qcNotes=h?.notes||"",this._qcCost=h?.cost!=null?String(h.cost):"",this._qcDuration=h?.duration!=null?String(h.duration):"",this._qcFeedback=h?.feedback||"",this._qcValuesOpen=this._qcPrefilled();let _=t.adaptive_config||{};if(this._environmentalEntity=_.environmental_entity||"",this._environmentalAttribute=_.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!_.enabled,this._adaptiveAlpha=_.ewa_alpha?.toString()??I.alpha,this._adaptiveMin=_.min_interval_days?.toString()??I.min,this._adaptiveMax=_.max_interval_days?.toString()??I.max,this._adaptiveSeasonal=_.seasonal_enabled!==!1,this._adaptivePrediction=_.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=this._adaptiveEnabled,t.trigger_config){let g=t.trigger_config;this._triggerEntityId=Se(g)||"",this._triggerEntityIds=se(g),this._triggerEntityLogic=g.entity_logic||"any",this._setTypeFields(ue(g)),this._triggerCombinator=g.trigger_combinator==="all"?"all":"any",this._triggerBaselineValue=g.trigger_baseline_value?.toString()||"",this._liveBaselineValue=t.trigger_baseline_value??null,this._autoCompleteOnRecovery=g.auto_complete_on_recovery||!1,this._holdUntilDone=g.trigger_hold_until_done===!0,this._triggerRuntimeMaxSession=g.trigger_runtime_max_session_seconds?.toString()||"",this._triggerDetailAttribute=g.detail_attribute||"",g.type==="compound"?(this._compoundLogic=Ie(g),this._compoundConditions=(g.conditions||[]).map(Nt)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),this._detailsOpen=this._priority!=="normal"||!!this._labels.trim()||!!this._documentationUrl.trim()||!!this._customIcon,await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._detailsOpen=!1,this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._calMonths=[],this._hadCalMonths=!1,this._calendarEntity="",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._notifyIcon="",this._notifyTexts={},this._notifyTextsOpen=!1,this._priority="normal",this._labels="",this._mirrorTodoEntities=[],this._mirrorTodoMode="default",this._completeWhenEntity="",this._completeWhenState="",this._completeWhenAnyTime=!1,this._completeWhenFor="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._notifyEnabled=!0,this._readingUnit="",this._readings=[],this._consumesParts={},this._consumesQtyText={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._scheduleTimeOn=!1,this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=I.alpha,this._adaptiveMin=I.min,this._adaptiveMax=I.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=!1,this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1,this._actionTesting=!1,this._actionTestResult="",this._actionTestError="",this._quickOn=!1,this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._qcValuesOpen=!1,this._resetTriggerFields()}_typeFields(){return{type:this._triggerType,attribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,equals:this._triggerEquals,notEquals:this._triggerNotEquals,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,onStates:this._triggerOnStates,daysBefore:this._triggerDaysBefore}}_setTypeFields(e){this._triggerType=e.type,this._triggerAttribute=e.attribute,this._triggerAbove=e.above,this._triggerBelow=e.below,this._triggerEquals=e.equals,this._triggerNotEquals=e.notEquals,this._triggerForMinutes=e.forMinutes,this._triggerTargetValue=e.targetValue,this._triggerDeltaMode=e.deltaMode,this._triggerFromState=e.fromState,this._triggerToState=e.toState,this._triggerTargetChanges=e.targetChanges,this._triggerRuntimeHours=e.runtimeHours,this._triggerOnStates=e.onStates,this._triggerDaysBefore=e.daysBefore}_resetTriggerFields(){++this._attrSeq,this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._setTypeFields(ee()),this._triggerCombinator="any",this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._holdUntilDone=!1,this._triggerRuntimeMaxSession="",this._triggerDetailAttribute="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new qe(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}_toggleAssignee(e){this._assigneePool=this._assigneePool.includes(e)?this._assigneePool.filter(t=>t!==e):[...this._assigneePool,e]}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError=s("action_test_bad_format",this._lang),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,i]=e.split(".");if(!this.hass?.services?.[t]?.[i]){this._actionTestResult="error",this._actionTestError=s("action_test_unknown_service",this._lang).replace("{service}",e),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let r=this._actionTargetEntity.trim();if(r){let o=r.split(".")[0];if(o!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=s("action_test_domain_mismatch",this._lang).replace("{service}",e).replace("{domain}",t).replace("{entity}",r).replace("{entity_domain}",o).replace("{suggestion}",`${o}.${i}`),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[r]){this._actionTestResult="error",this._actionTestError=s("action_test_entity_missing",this._lang).replace("{entity}",r),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,i]=e.split("."),r=this.hass?.services?.[t]?.[i]?.fields;return!r||Object.keys(r).length===0?null:Object.entries(r).map(([o,h])=>({name:o,required:!!h.required,selector:h.selector||{text:{}}}))}_actionTargetExtended(){let e=this._actionTargetStored;return e?Object.entries(e).some(([t,i])=>t==="entity_id"?Array.isArray(i)&&i.length>1:Array.isArray(i)?i.length>0:!!i):!1}_actionTargetSummary(){let e=this._actionTargetStored||{},t=r=>(Array.isArray(r)?r:[r]).filter(o=>typeof o=="string"&&!!o),i=this.hass;return[...t(e.entity_id).map(r=>H(this.hass,r)),...t(e.device_id).map(r=>i.devices?.[r]?.name_by_user||i.devices?.[r]?.name||r),...t(e.area_id).map(r=>i.areas?.[r]?.name||r),...t(e.floor_id).map(r=>i.floors?.[r]?.name||r),...t(e.label_id)].join(", ")}_qcPrefill(){return{notes:!!this._qcNotes.trim(),cost:!isNaN(parseFloat(this._qcCost)),duration:oe(this._qcDuration)!==null,photo:!1,user:!0}}_qcPrefilled(){let e=this._qcPrefill();return e.notes||e.cost||e.duration||!!this._qcFeedback}_renderQuickComplete(e){let t=this._qcPrefill(),i=this._requiredCompletion.filter(o=>!t[o]),r=!!this._checklistText.trim()||this._readings.length>0;return n`
      ${$({cls:"req-option quick-complete-switch",checked:this._quickOn,onChange:o=>this._quickOn=o.target.checked},n`<span>${s("quick_complete_label",e)}</span>`)}
      ${this._quickOn?n`
            <div class="field-help">${s("quick_complete_help",e)}</div>
            ${i.length?n`<div class="field-help quick-complete-note">${s("quick_complete_needs_dialog",e).replace("{fields}",i.map(o=>s(Q[o],e)).join(", "))}</div>`:p}
            ${this._requireTagScan?n`<div class="field-help quick-complete-note">${s("quick_complete_tag_hint",e)}</div>`:p}
            ${r?n`<div class="field-help">${s("quick_complete_not_asked",e)}</div>`:p}
            ${k({cls:"ca-section quick-complete-values",open:this._qcValuesOpen,header:s("quick_complete_values",e)},n`
              <p class="field-help">${s("quick_complete_values_help",e)}</p>
              <ms-textfield
                label="${s("quick_complete_defaults_notes",e)}"
                .value=${this._qcNotes}
                @input=${o=>{this._qcNotes=o.target.value}}
              ></ms-textfield>
              <div class="qc-cost">
                <span class="qc-cost-label">${s("quick_complete_defaults_cost",e)}</span>
                <ms-cost-input .lang=${e} .value=${this._qcCost}
                  @value-changed=${o=>{this._qcCost=o.detail.value}}></ms-cost-input>
              </div>
              <ms-textfield
                label="${s("quick_complete_defaults_duration",e)}"
                type="number" min="0" step="1"
                .value=${this._qcDuration}
                @input=${o=>{this._qcDuration=o.target.value}}
              ></ms-textfield>
              ${b({label:s("was_maintenance_needed",e),cls:"qc-feedback",value:this._qcFeedback,onChange:o=>{this._qcFeedback=o.target.value}},n`
                <option value="">${s("quick_complete_defaults_feedback_none",e)}</option>
                <option value="needed">${s("quick_complete_defaults_feedback_needed",e)}</option>
                <option value="not_needed">${s("quick_complete_defaults_feedback_not_needed",e)}</option>
                <option value="not_sure">${s("feedback_not_sure",e)}</option>
              `)}
            `)}
          `:p}
    `}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled&&!this._actionPresent)return p;let t=this._serviceSchema();return n`
      ${k({cls:"ca-section",header:s("on_complete_action_title",e)},n`
        <p class="field-help">${s("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${i=>{this._actionService=i.detail.value||"";let r=this._serviceSchema();if(r){let o=new Set(r.map(h=>h.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([h])=>o.has(h)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>s("on_complete_action_target",e)}
          @value-changed=${i=>{let r=i.detail.value;this._actionTargetEntity=r.target_entity||""}}
        ></ha-form>
        ${this._actionTargetExtended()&&this._actionTargetEntity.trim()===this._actionTargetInitial?n`<p class="field-help ca-target-more">${s("on_complete_action_target_more",e).replace("{targets}",this._actionTargetSummary())}</p>`:p}
        <p class="field-help ca-domain-hint">
          ${s("on_complete_action_target_hint",e)}
        </p>
        ${$({cls:"ca-skip-auto",checked:this._actionSkipAuto,onChange:i=>{this._actionSkipAuto=i.target.checked}},n`<span>${s("on_complete_action_skip_auto",e)}</span>`)}
        ${t?n`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${t}
                .data=${this._actionData}
                @value-changed=${i=>{this._actionData={...i.detail.value}}}
              ></ha-form>
            `:n`
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
          ${this._actionTestResult==="ok"?n`<span class="ca-test-ok">${s("on_complete_action_test_success",e)}</span>`:p}
          ${this._actionTestResult==="error"?n`<div class="ca-test-error-block">
                <span class="ca-test-error">${s("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?n`<div class="ca-test-error-detail">${this._actionTestError}</div>`:p}
              </div>`:p}
        </div>
      `)}

    `}_knownObjects(e){return this.objects?.some(t=>t.entry_id===e)?this.objects:void 0}async _loadParts(){this.parts=[];let e=this._entryId;if(!e)return;let t=this._knownObjects(e)?.find(i=>i.entry_id===e);if(t){this.parts=t.parts||[],this._partsLoadFailed=!1;return}try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e});if(e!==this._entryId)return;this.parts=i.parts||[],this._partsLoadFailed=!1}catch{if(e!==this._entryId)return;this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){this._foreignOwners=[];let e=this._entryId;if(e)try{let t=this._knownObjects(e)??(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"})).objects;if(e!==this._entryId)return;this._foreignOwners=(t||[]).filter(i=>i.entry_id!==e&&(i.parts||[]).length>0).map(i=>({entry_id:i.entry_id,name:i.object?.name||i.entry_id,parts:i.parts||[]})).sort((i,r)=>i.name.localeCompare(r.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(e){!e||!this.hass||this._conditionAttrOptions[e]||this._conditionAttrPending.has(e)||(this._conditionAttrPending.add(e),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e}).then(t=>{let i=t;this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:i.suggested_attributes||[],available:i.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(e){let t=++this._attrSeq;if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});if(t!==this._attrSeq)return;this._entityDomain=i.domain||"",this._suggestedAttributes=i.suggested_attributes||[],this._availableAttributes=i.available_attributes||[]}catch{if(t!==this._attrSeq)return;this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(e=>!!e.entry_id)}_renderConsumesRow(e,t){let i=re({part_id:e.id,entry_id:t}),r=this._consumesParts[i],o=t?{part_id:e.id,quantity:1,entry_id:t}:{part_id:e.id,quantity:1};return n`
      <div class="consumes-row">
        ${$({cls:"consumes-check",checked:r!==void 0,onChange:h=>{let _={...this._consumesParts};if(h.target.checked)_[i]=_[i]||o;else{delete _[i];let g={...this._consumesQtyText};delete g[i],this._consumesQtyText=g}this._consumesParts=_}},n`<span>${e.name}${e.unit?` (${e.unit})`:""}</span>`)}
        ${r!==void 0?n`<input
              class="consumes-qty"
              aria-label=${`${e.name}: ${s("quantity",this._lang)}`}
              type="number"
              min=${A[0]}
              max=${A[1]}
              step="0.01"
              .value=${this._consumesQtyText[i]??String(r.quantity)}
              @input=${h=>{let _=h.target.value;this._consumesQtyText={...this._consumesQtyText,[i]:_};let g=parseFloat(_.replace(",","."));Number.isFinite(g)&&g>=A[0]&&(this._consumesParts={...this._consumesParts,[i]:{...o,quantity:g}})}}
            />`:p}
      </div>
    `}_applyConsumesQtyText(){let e={...this._consumesParts};for(let t of Object.keys(e)){let i=this._consumesQtyText[t];if(i===void 0)continue;let r=parseFloat(i.replace(",","."));if(!Number.isFinite(r)||r<A[0]||r>A[1]){let o=h=>w(h,this._lang,{maximumFractionDigits:2});return this._error=s("settings_value_out_of_range",this._lang).replace("{min}",o(A[0])).replace("{max}",o(A[1])),!1}e[t]={...e[t],quantity:r}}return this._consumesParts=e,!0}_toggleRequired(e,t){let i=new Set(this._requiredCompletion);t?i.add(e):i.delete(e),this._requiredCompletion=[...i]}_patchReading(e,t){this._readings=this._readings.map(i=>i.id===e?{...i,...t}:i)}_renderReadingsEditor(e){let t=Pe(this._readings);return n`
      <div class="readings-editor">
        <div class="field-label">${s("readings_section",e)}</div>
        <div class="field-help">${s("readings_hint",e)}</div>
        ${this._readings.map(i=>n`
          ${t.has(i.id)?n`<div class="field-help reading-dup">${s("reading_duplicate_name",e)}</div>`:p}
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
            <ha-icon-button class="phase-remove reading-remove" .label=${s("remove",e)} @click=${()=>this._readings=this._readings.filter(r=>r.id!==i.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
        `)}
        ${this._readings.length<Re?n`
          <ha-button appearance="plain" class="reading-add"
            @click=${()=>this._readings=[...this._readings,{id:Ne(),name:"",unit:this._readings.length?this._readings[this._readings.length-1].unit:this._readingUnit}]}>
            <ha-icon icon="mdi:plus"></ha-icon> ${s("reading_add",e)}
          </ha-button>`:p}
      </div>
    `}_phaseSlug(e){let t=e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",i=t,r=2;for(;this._phaseDefs.some(o=>o.id===i);)i=`${t}-${r++}`;return i}_addPhaseDef(){let e=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:e,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(e){this._phaseDefs=this._phaseDefs.filter(t=>t.id!==e),this._phaseSeq=this._phaseSeq.filter(t=>t!==e)}_patchPhaseDef(e,t){this._phaseDefs=this._phaseDefs.map(i=>i.id===e?{...i,...t}:i)}_renderPhasesEditor(e){let t=i=>this._phaseDefs.find(r=>r.id===i)?.name||i;return n`
      ${k({cls:"phases-section",open:this._phaseDefs.length>0,header:s("phases_section",e)},n`
      <div class="field-help">${s("phases_hint",e)}</div>
      ${this._phaseDefs.map(i=>n`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${s("phase_name",e)}"
              .value=${i.name}
              @input=${r=>this._patchPhaseDef(i.id,{name:r.target.value})}
            ></ms-textfield>
            ${this.parts.length?n`
              ${b({label:s("spare_part",e),cls:"phase-part",value:i.partId,onChange:r=>{let o=r.target.value;this._patchPhaseDef(i.id,i.partQty?{partId:o}:{partId:o,partQty:"1"})}},n`
                <option value="">—</option>
                ${this.parts.map(r=>n`<option value=${r.id} ?selected=${r.id===i.partId}>${r.name}</option>`)}
              `)}
              ${i.partId?n`
                <!-- The typed text as-is: a "|| '1'" here rewrote a cleared
                     field to 1 and the next digit gave "13" (bug audit
                     2026-09-26 #2); an empty field saves as 1. -->
                <input class="phase-qty" aria-label=${s("quantity",e)} type="number" min=${ae[0]} step="0.01" placeholder="1" .value=${i.partQty}
                  @input=${r=>this._patchPhaseDef(i.id,{partQty:r.target.value})} />
              `:p}
            `:p}
            <ha-icon-button class="phase-remove" .label=${s("remove",e)} @click=${()=>this._removePhaseDef(i.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
          ${this.checklistsEnabled?n`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${s("checklist_placeholder",e)}"
              .value=${i.checklistText}
              @input=${r=>this._patchPhaseDef(i.id,{checklistText:r.target.value})}
            ></textarea>
          `:p}
          ${$({cls:"req-option phase-req-toggle",checked:i.reqOverride,onChange:r=>this._patchPhaseDef(i.id,{reqOverride:r.target.checked})},n`<span>${s("phase_require_override",e)}</span>`)}
          ${i.reqOverride?n`
            <div class="required-completion phase-req-fields">
              ${le.map(r=>n`
                ${$({cls:"req-option",checked:i.reqFields.includes(r),onChange:o=>{let h=o.target.checked,_=new Set(i.reqFields);h?_.add(r):_.delete(r),this._patchPhaseDef(i.id,{reqFields:[..._]})}},n`<span>${s(Q[r],e)}</span>`)}
              `)}
            </div>
          `:p}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${s("phase_add",e)}
      </ha-button>
      ${this._phaseDefs.some(i=>i.name.trim())?n`
        <div class="phase-seq-label">${s("phase_sequence_label",e)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((i,r)=>n`
            <span class="phase-chip">
              ${r+1}. ${t(i)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((o,h)=>h!==r)}}>✕</button>
            </span>
          `)}
          ${b({label:s("phase_sequence_add_step",e),cls:"phase-seq-add",value:"",onChange:i=>{let r=i.target.value;r&&(this._phaseSeq=[...this._phaseSeq,r]),i.target.value=""}},n`
            <option value="">+ ${s("phase_sequence_add_step",e)}</option>
            ${this._phaseDefs.filter(i=>i.name.trim()).map(i=>n`<option value=${i.id}>${i.name}</option>`)}
          `)}
        </div>
      `:p}
      `)}
    `}async _save(){if(this._loading||this._incomplete())return;if(this._adaptiveSnapshot()!==this._adaptiveInitial){let t=parseInt(this._adaptiveMin,10),i=parseInt(this._adaptiveMax,10);if(!isNaN(t)&&!isNaN(i)&&t>i){this._error=`${s("adaptive_min_interval",this._lang)} > ${s("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=s("trigger_hint_overlap",this._lang);return}if(this._scheduleType==="calendar"&&!this._calendarEntity.trim().startsWith("calendar.")){this._error=s("calendar_entity_required",this._lang);return}if(!this._applyConsumesQtyText())return;if(this._completeWhenEntity&&parseInt(this._completeWhenFor,10)>K[1]){this._error=s("settings_value_out_of_range",this._lang).replace("{min}","1").replace("{max}",w(K[1],this._lang));return}this._loading=!0,this._error="";let e;try{let t=await V(this,()=>this.hass.connection.sendMessagePromise(this._savePayload()),{fallbackKey:"save_error",onError:h=>{this._error=h}});if(t===void 0)return;let i=this._taskId||t?.task_id,r=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;this._warning="";let o=h=>{this._warning=s("subsave_warning",this._lang).replace("{detail}",h)};if(i&&this._scheduleType==="sensor_based"&&r&&await V(this,{type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:i,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null},{onError:o})!==void 0&&(this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute),i&&this._adaptiveSnapshot()!==this._adaptiveInitial){let h=parseFloat(this._adaptiveAlpha),_=parseInt(this._adaptiveMin,10),g=parseInt(this._adaptiveMax,10);await V(this,{type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:i,enabled:this._adaptiveEnabled,...h>=j[0]&&h<=j[1]?{ewa_alpha:h}:{},...!isNaN(_)&&_>=1?{min_interval_days:_}:{},...!isNaN(g)&&g>=1?{max_interval_days:g}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction},{onError:o})!==void 0&&(this._adaptiveInitial=this._adaptiveSnapshot())}this._warning?i&&(this._taskId=i):this._seriesIndex+1<this._series.length?e=this._seriesIndex+1:(this._open=!1,this._series=[]),this.dispatchEvent(new CustomEvent("task-saved"))}finally{this._loading=!1}e!==void 0&&await this._editSeriesItem(e)}_missingDueDate(){return this._scheduleType==="one_time"&&!this._dueDate}_missingInterval(){return this._scheduleType==="time_based"&&!(parseInt(this._intervalDays,10)>0)}_incomplete(){return!this._name.trim()||this._missingDueDate()||this._missingInterval()}_setScheduleType(e){e==="time_based"&&!(parseInt(this._intervalDays,10)>0)&&(this._intervalDays="30"),this._scheduleType=e}_savePayload(){let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},t=this._earliestCompletionDays.trim();e.earliest_completion_days=t===""?null:Math.max(0,parseInt(t,10)||0),this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):te.includes(this._scheduleType)?(e.schedule={...this._buildSchedule(),...this._recurrenceExtras()},e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(e.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.notify_icon=this._notifyIcon.trim()||null,e.notification_texts=_e(this._notifyTexts),e.priority=this._priority,e.labels=this._labels.split(",").map(o=>o.trim()).filter(Boolean);let i=this._mirrorChoice();e.mirror_todo_entities=i.entities,e.mirror_todo_use_default=i.useDefault,e.enabled=this._enabled,(!this._taskId||this._lastPerformed!==this._loadedLastPerformed)&&(e.last_performed=this._lastPerformed||null),e.nfc_tag_id=this._nfcTagId||null,e.require_tag_scan=this._requireTagScan,e.allow_skip=this._allowSkip;let r=parseInt(this._completeWhenFor,10);e.complete_when=this._completeWhenEntity&&this._completeWhenState.trim()?{entity_id:this._completeWhenEntity,to_state:this._completeWhenState.trim(),...this._completeWhenAnyTime?{any_time:!0}:{},...r>0?{for_minutes:r}:{}}:null,e.notify_enabled=this._notifyEnabled,e.reading_unit=this._readingUnit.trim()||null,e.readings=Fe(this._readings);{let o={};for(let _ of this._phaseDefs){if(!_.name.trim())continue;let g={..._.carry,name:_.name.trim()},v=_.checklistText.split(`
`).map(m=>m.trim()).filter(Boolean);v.length&&(g.checklist=v);let f=[];if(_.partId){let m=parseFloat(_.partQty);f.push({part_id:_.partId,quantity:Number.isFinite(m)&&m>0?m:1})}for(let m of _.extraParts)f.push(m.entry_id?{part_id:m.part_id,quantity:m.quantity,entry_id:m.entry_id}:{part_id:m.part_id,quantity:m.quantity});f.length&&(g.consumes_parts=f),_.reqOverride&&(g.required_completion_fields=[..._.reqFields]),o[_.id]=g}let h=this._phaseSeq.filter(_=>_ in o);e.phases=Object.keys(o).length&&h.length?o:null,e.phase_sequence=e.phases?h:null}if((this.parts.length||this._foreignOwners.length)&&(e.consumes_parts=Object.values(this._consumesParts).map(o=>o.entry_id?{part_id:o.part_id,quantity:o.quantity,entry_id:o.entry_id}:{part_id:o.part_id,quantity:o.quantity})),(!this._taskId||this._responsibleUserId!==this._loadedResponsibleUserId)&&(e.responsible_user_id=this._responsibleUserId),e.assignee_pool=this._assigneePool,e.required_completion_fields=this._requiredCompletion,e.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let o=this._compoundConditions.map(Pt).filter(h=>h!==null);if(o.length>0){let h={type:"compound",compound_logic:this._compoundLogic,conditions:o};this._autoCompleteOnRecovery&&(h.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(h.trigger_combinator="all"),this._triggerDetailAttribute&&(h.detail_attribute=this._triggerDetailAttribute),e.trigger_config=h}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let o=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],h={entity_id:o[0],entity_ids:o,type:this._triggerType};J(h,this._typeFields()),this._holdUntilDone&&this._endsByItself()?h.trigger_hold_until_done=!0:this._autoCompleteOnRecovery&&(h.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(h.trigger_combinator="all"),this._triggerDetailAttribute&&(h.detail_attribute=this._triggerDetailAttribute),Object.assign(h,this._ownRuleFields(o)),e.trigger_config=h}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&Xe.includes(this._scheduleType)){let o=this._scheduleTimeOn?this._scheduleTime.trim():"";e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(o)?o:null}if(this.checklistsEnabled){let o=this._checklistText.split(`
`).map(h=>h.trim()).filter(Boolean).slice(0,100);e.checklist=o.length?o:null}if(this.completionActionsEnabled||this._actionPresent){let o=this._actionService.trim();if(o&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(o)){let h={service:o},_=this._actionTargetEntity.trim();this._actionTargetStored&&_===this._actionTargetInitial?h.target=JSON.parse(JSON.stringify(this._actionTargetStored)):_&&(h.target={entity_id:_});let g=this._buildActionData();Object.keys(g).length>0&&(h.data=g),this._actionSkipAuto&&(h.skip_auto=!0),e.on_complete_action=h}else e.on_complete_action=null}{let o={};this._qcNotes.trim()&&(o.notes=this._qcNotes.trim());let h=parseFloat(this._qcCost);isNaN(h)||(o.cost=h);let _=oe(this._qcDuration);_!==null&&(o.duration=_),this._qcFeedback&&(o.feedback=this._qcFeedback),e.quick_complete_defaults=this._quickOn?o:null}return e}_close(){this._open=!1,this._series=[],this._warning="",this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return p;let e=this._lang,t=this._triggerType==="compound";return n`
      <div class="select-row">
        ${x()?p:n`<label>${s("trigger_type",e)}</label>`}
        ${b({label:s("trigger_type",e),value:this._triggerType,onChange:i=>{this._triggerType=i.target.value,this._seedUpdateRule()}},n`
          ${At.map(i=>n`<option value=${i} ?selected=${i===this._triggerType}>${Z(i,e)}</option>`)}
        `)}
      </div>
      ${t?this._renderCompoundEditor():n`
        ${this._entityPickerFallback?n`
          <ms-textfield
            label="${s("entity_id",e)} (${s("comma_separated",e)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${i=>{let o=i.target.value.split(",").map(h=>h.trim()).filter(Boolean);this._triggerEntityId=o[0]||"",this._triggerEntityIds=o,this._seedUpdateRule(),o[0]&&this._fetchEntityAttributes(o[0])}}
          ></ms-textfield>
        `:n`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:de}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>s("entity_id",e)}
          @value-changed=${i=>{let r=(i.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=r[0]||"",this._triggerEntityIds=r,this._seedUpdateRule(),r[0]?this._fetchEntityAttributes(r[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?n`
          <div class="select-row">
            ${x()?p:n`<label>${s("entity_logic",e)}</label>`}
            ${b({label:s("entity_logic",e),value:this._triggerEntityLogic,onChange:i=>this._triggerEntityLogic=i.target.value},n`
              <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${s("entity_logic_any",e)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${s("entity_logic_all",e)}</option>
            `)}
          </div>
        `:p}
        ${this._renderAttributeSelect({label:s("attribute_optional",e),value:this._triggerAttribute,suggested:this._suggestedAttributes,available:this._availableAttributes,onSelect:i=>this._triggerAttribute=i})}
        ${this._renderTriggerTypeFields()}
        ${this._renderTriggerLiveHint()}
      `}
      ${this._renderDetailAttributeSelect(e)}
      ${this._endsByItself()?this._renderTriggerEnd(e):n`
        ${$({checked:this._autoCompleteOnRecovery,onChange:i=>this._autoCompleteOnRecovery=i.target.checked},n`${s("auto_complete_on_recovery",e)}`)}
        <div class="field-help">${s("auto_complete_on_recovery_help",e)}</div>
      `}
      <ms-textfield
        label="${s("safety_interval",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${i=>this._intervalDays=i.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():p}
      ${this._intervalDays?n`
            <div class="select-row">
              ${x()?p:n`<label>${s("trigger_combinator",e)}</label>`}
              ${b({label:s("trigger_combinator",e),onChange:i=>this._triggerCombinator=i.target.value},n`
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${s("trigger_combinator_any",e)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${s("trigger_combinator_all",e)}</option>
              `)}
            </div>
          `:p}
    `}_patchCondition(e,t){this._compoundConditions=this._compoundConditions.map((i,r)=>r===e?{...i,...t}:i)}_addCondition(){this._compoundConditions=[...this._compoundConditions,ee()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((t,i)=>i!==e),this.betaEditor&&this._compoundConditions.length===1&&this._flattenCompound()}_flattenCompound(){let[e]=this._compoundConditions;if(!e)return;let t=e.entityIds.split(",").map(h=>h.trim()).filter(Boolean),{entityIds:i,carry:r,...o}=e;this._compoundConditions=[],this._setTypeFields(o),this._triggerEntityId=t[0]||"",this._triggerEntityIds=t,this._triggerEntityLogic=r.entity_logic==="all"?"all":"any",this._triggerBaselineValue=r.trigger_baseline_value?.toString()||"",this._triggerRuntimeMaxSession=r.trigger_runtime_max_session_seconds?.toString()||"",t[0]&&this._fetchEntityAttributes(t[0])}_ownRuleFields(e){let t={};if(e.length>1&&(t.entity_logic=this._triggerEntityLogic),this._triggerType==="counter"&&this._triggerDeltaMode&&this._triggerBaselineValue){let i=parseFloat(this._triggerBaselineValue);!isNaN(i)&&i>=0&&(t.trigger_baseline_value=i)}else if(this._triggerType==="runtime"&&this._triggerRuntimeMaxSession){let i=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(i)&&i>0&&(t.trigger_runtime_max_session_seconds=i)}return t}_renderCompoundEditor(){let e=this._lang;return n`
      <div class="select-row">
        ${x()?p:n`<label>${s("compound_logic",e)}</label>`}
        ${b({label:s("compound_logic",e),value:this._compoundLogic,onChange:t=>this._compoundLogic=t.target.value},n`
          <option value="AND" ?selected=${this._compoundLogic==="AND"}>${s("compound_logic_and",e)}</option>
          <option value="OR" ?selected=${this._compoundLogic==="OR"}>${s("compound_logic_or",e)}</option>
        `)}
      </div>
      <div class="field-help">${s("compound_help",e)}</div>
      ${this._compoundConditions.length===0?n`<div class="field-help">${s("compound_no_conditions",e)}</div>`:this._compoundConditions.map((t,i)=>this._renderCondition(t,i))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${s("compound_add_condition",e)}
      </button>
    `}_renderCondition(e,t){let i=this._lang,r=t+1;return n`
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
        ${this._entityPickerFallback?n`
          <ms-textfield
            label="${s("entity_id",i)} (${s("comma_separated",i)})"
            .value=${e.entityIds}
            @input=${o=>this._patchCondition(t,{entityIds:o.target.value})}
          ></ms-textfield>
        `:n`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:de}}}]}
          .data=${{condition_entities:e.entityIds.split(",").map(o=>o.trim()).filter(Boolean)}}
          .computeLabel=${()=>s("entity_id",i)}
          @value-changed=${o=>{let h=(o.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(t,{entityIds:h.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(e,t)}
        <div class="select-row">
          ${x()?p:n`<label>${s("trigger_type",i)}</label>`}
          ${b({label:s("trigger_type",i),value:e.type,onChange:o=>this._patchCondition(t,{type:o.target.value})},n`
            ${et.map(o=>n`<option value=${o} ?selected=${o===e.type}>${Z(o,i)}</option>`)}
          `)}
        </div>
        ${this._renderConditionTypeFields(e,t)}
      </div>
    `}_endShape(){return{type:this._triggerType,trigger_target_changes:this._triggerTargetChanges===""?void 0:Number(this._triggerTargetChanges),trigger_from_state:this._triggerFromState.trim(),trigger_to_state:this._triggerToState.trim()}}_isStateLatch(){return Ce(this._endShape())}_endsByItself(){return Ae(this._endShape())}_renderTriggerEnd(e){let t=this._holdUntilDone?"hold":this._autoCompleteOnRecovery?"done":"ok",i={ok:"trigger_end_ok",done:"trigger_end_done",hold:"trigger_end_hold"},r=_=>{this._autoCompleteOnRecovery=_==="done",this._holdUntilDone=_==="hold"},o=this._isStateLatch(),h=s(o?"trigger_end":this._triggerType==="due_date"?"trigger_end_date":"trigger_end_value",e);return n`
      <div class="trigger-end" role="radiogroup" aria-label=${h}>
        <div class="field-label">${h}</div>
        ${Object.keys(i).map(_=>n`
          <label class="trigger-end-option">
            <input type="radio" name="trigger-end" value=${_} .checked=${t===_} @change=${()=>r(_)} />
            ${s(i[_],e)}
          </label>
        `)}
        ${t==="done"?n`<div class="field-help">${s("auto_complete_on_recovery_help",e)}</div>`:p}
        ${t==="hold"?n`<div class="field-help">${s(o?"trigger_end_hold_help":"trigger_end_hold_help_level",e)}</div>`:p}
      </div>
    `}_renderCompleteWhen(e){return n`
      <div class="field complete-when-field">
        ${this._entityPickerFallback?n`
          <ms-textfield
            label="${s("complete_when",e)}"
            placeholder="binary_sensor.washer_door"
            .value=${this._completeWhenEntity}
            @input=${t=>this._completeWhenEntity=t.target.value.trim()}
          ></ms-textfield>
        `:n`
          <ha-form
            class="entity-picker-form"
            .hass=${this.hass}
            .schema=${[{name:"complete_when",selector:{entity:{}}}]}
            .data=${{complete_when:this._completeWhenEntity}}
            .computeLabel=${()=>s("complete_when",e)}
            @value-changed=${t=>{let i=(t.detail.value.complete_when||"").trim();i!==this._completeWhenEntity&&(this._completeWhenState=""),this._completeWhenEntity=i}}
          ></ha-form>`}
        ${this._completeWhenEntity?this._renderStateField({label:s("complete_when_state",e),value:this._completeWhenState,entityId:this._completeWhenEntity,onInput:t=>this._completeWhenState=t}):p}
        ${this._completeWhenEntity?n`
          <ms-textfield
            class="complete-when-for"
            label="${s("for_at_least_minutes",e)}"
            type="number"
            min="0"
            max=${K[1]}
            .value=${this._completeWhenFor}
            @input=${t=>this._completeWhenFor=t.target.value}
          ></ms-textfield>
          ${$({cls:"req-option complete-when-any-time",checked:this._completeWhenAnyTime,onChange:t=>this._completeWhenAnyTime=t.target.checked},n`<span>${s("complete_when_any_time",e)}</span>`)}
        `:p}
        <div class="field-help">${s("complete_when_help",e)}</div>
      </div>
    `}_renderStateField(e){return this._entityPickerFallback||!e.entityId?n`
        <ms-textfield
          label=${e.label}
          .value=${e.value}
          @input=${t=>e.onInput(t.target.value)}
        ></ms-textfield>
      `:n`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId}}}]}
        .data=${{s:e.value}}
        .computeLabel=${()=>e.label}
        @value-changed=${t=>e.onInput((t.detail.value.s||"").trim())}
      ></ha-form>
    `}_renderOnStatesField(e){let t=this._lang;return this._entityPickerFallback||!e.entityId?n`
        <ms-textfield
          label="${s("runtime_on_states",t)}"
          placeholder="on"
          .value=${e.value}
          @input=${i=>e.onInput(i.target.value)}
        ></ms-textfield>
      `:n`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId,multiple:!0}}}]}
        .data=${{s:(e.value||"").split(",").map(i=>i.trim()).filter(Boolean)}}
        .computeLabel=${()=>s("runtime_on_states",t)}
        @value-changed=${i=>e.onInput((i.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(e){return this._scheduleType==="one_time"||this._scheduleType==="manual"?p:!this.adaptiveFeature&&!this._adaptiveWasEnabled?p:n`
      ${k({cls:"adaptive-section",open:this._adaptiveEnabled,header:s("adaptive_section_title",e)},n`
        ${$({checked:this._adaptiveEnabled,onChange:t=>this._adaptiveEnabled=t.target.checked},n`${s("adaptive_enabled",e)}`)}
        ${this._adaptiveEnabled?n`
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
            min=${j[0]}
            max=${j[1]}
            step="0.1"
            .value=${this._adaptiveAlpha}
            @input=${t=>this._adaptiveAlpha=t.target.value}
          ></ms-textfield>
          ${this.seasonalFeature?n`${$({checked:this._adaptiveSeasonal,onChange:t=>this._adaptiveSeasonal=t.target.checked},n`${s("adaptive_seasonal_enabled",e)}`)}`:p}
          ${$({checked:this._adaptivePrediction,onChange:t=>this._adaptivePrediction=t.target.checked},n`${s("adaptive_prediction_enabled",e)}`)}
        `:p}
      `)}
    `}_renderAttributeSelect(e){let t=this._lang;return e.available.length>0?n`
        <div class="select-row">
          ${x()?p:n`<label>${e.label}</label>`}
          ${b({label:e.label,value:e.value,onChange:i=>e.onSelect(i.target.value)},n`
            <option value="" ?selected=${!e.value}>${s("use_entity_state",t)}</option>
            ${e.suggested.map(i=>n`<option value=${i} ?selected=${i===e.value}>${i} ★</option>`)}
            ${e.available.filter(i=>!e.suggested.includes(i.name)).map(i=>n`<option value=${i.name} ?selected=${i.name===e.value}>${i.name}${i.numeric?"":" (non-numeric)"}</option>`)}
          `)}
        </div>
      `:n`
      <ms-textfield
        label="${e.label}"
        .value=${e.value}
        @input=${i=>e.onSelect(i.target.value.trim())}
      ></ms-textfield>
    `}_renderDetailAttributeSelect(e){let t=this._triggerType==="compound"?this._compoundConditions.flatMap(g=>g.entityIds.split(",").map(v=>v.trim()).filter(Boolean)):(this._triggerEntityIds.length?this._triggerEntityIds:[this._triggerEntityId]).filter(Boolean);if(!t.length)return p;let i=this.hass?.states??{},r=new Map;for(let g of t){this._fetchConditionAttributes(g);for(let v of this._conditionAttrOptions[g]?.available??[])r.has(v.name)||r.set(v.name,Ot(i[g]?.attributes?.[v.name]))}let o=this._triggerDetailAttribute;o&&!r.has(o)&&r.set(o,"");let h=s("trigger_detail_attribute",e),_=r.size?n`
        <div class="select-row">
          ${x()?p:n`<label>${h}</label>`}
          ${b({label:h,cls:"detail-attribute-select",value:o,onChange:g=>this._triggerDetailAttribute=g.target.value},n`
            <option value="" ?selected=${!o}>${s("trigger_detail_none",e)}</option>
            ${[...r.entries()].sort(([g],[v])=>g.localeCompare(v)).map(([g,v])=>n`<option value=${g} ?selected=${g===o}>${v?`${g}: ${v}`:g}</option>`)}
          `)}
        </div>`:n`
        <ms-textfield class="detail-attribute-input" label=${h} .value=${o}
          @input=${g=>this._triggerDetailAttribute=g.target.value.trim()}></ms-textfield>`;return n`${_}<div class="field-help">${s("trigger_detail_attribute_help",e)}</div>`}_renderEnvironmentalAttribute(e){this._fetchConditionAttributes(this._environmentalEntity);let t=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:s("environmental_attribute_optional",e),value:this._environmentalAttribute,suggested:t?.suggested??[],available:t?.available??[],onSelect:i=>this._environmentalAttribute=i})}_renderConditionAttribute(e,t){let i=e.entityIds.split(",")[0]?.trim()||"";i&&this._fetchConditionAttributes(i);let r=i?this._conditionAttrOptions[i]:void 0;return this._renderAttributeSelect({label:s("attribute_optional",this._lang),value:e.attribute,suggested:r?.suggested??[],available:r?.available??[],onSelect:o=>this._patchCondition(t,{attribute:o})})}_renderConditionTypeFields(e,t){let i=this._lang;if(e.type==="threshold")return n`
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
      `;if(e.type==="counter")return n`
        <ms-textfield label="${s("target_value",i)}" type="number" .value=${e.targetValue}
          @input=${r=>this._patchCondition(t,{targetValue:r.target.value})}></ms-textfield>
        ${$({checked:e.deltaMode,onChange:r=>this._patchCondition(t,{deltaMode:r.target.checked})},n`${s("delta_mode",i)}`)}
      `;if(e.type==="state_change"){let r=e.entityIds.split(",")[0]?.trim()||"";return n`
        ${this._renderStateField({label:s("from_state_optional",i),value:e.fromState,entityId:r,onInput:o=>this._patchCondition(t,{fromState:o})})}
        ${this._renderStateField({label:s("to_state_optional",i),value:e.toState,entityId:r,onInput:o=>this._patchCondition(t,{toState:o})})}
        <ms-textfield label="${s("target_changes",i)}" type="number" .value=${e.targetChanges}
          @input=${o=>this._patchCondition(t,{targetChanges:o.target.value})}></ms-textfield>
        <ms-textfield label="${s("for_minutes",i)}" type="number" .value=${e.forMinutes}
          @input=${o=>this._patchCondition(t,{forMinutes:o.target.value})}></ms-textfield>
      `}if(e.type==="runtime"){let r=e.entityIds.split(",")[0]?.trim()||"";return n`
        <ms-textfield label="${s("runtime_hours",i)}" type="number" .value=${e.runtimeHours}
          @input=${o=>this._patchCondition(t,{runtimeHours:o.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:e.onStates,entityId:r,onInput:o=>this._patchCondition(t,{onStates:o})})}
      `}return e.type==="due_date"?n`
        <ms-textfield label="${s("days_before",i)}" type="number" step="1"
          min=${M[0]} max=${M[1]} .value=${e.daysBefore}
          @input=${r=>this._patchCondition(t,{daysBefore:r.target.value})}></ms-textfield>
      `:p}_renderUnitSelect(){let e=this._lang;return n`
      <div class="select-row">
        ${x()?p:n`<label>${s("interval_unit",e)}</label>`}
        ${b({label:s("interval_unit",e),value:this._intervalUnit,onChange:t=>this._intervalUnit=t.target.value},n`
          ${["days","weeks","months","years"].map(t=>n`<option value=${t} ?selected=${t===this._intervalUnit}>${s("unit_"+t,e)}</option>`)}
        `)}
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(this._scheduleType==="calendar"&&!this._calendarEntity.trim())return null;if(te.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let e=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!e||e<=0?null:{kind:"interval",every:e,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(e){super.updated?.(e),this._scheduleEntityPickerProbe();for(let t of e.keys())if(l._PREVIEW_RELEVANT.has(String(t))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let e=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),t=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!e||!t){this._pickerProbeStrikes=0;return}let i=(_,g,v=0)=>{if(!(!_||v>10)){(_.tagName?.toLowerCase()??"")==="ha-entity-picker"&&g.push(_);for(let f of[_.shadowRoot,_])if(f)for(let m of Array.from(f.children??[]))i(m,g,v+1)}},r=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],o=[];for(let _ of r)i(_,o);let h=o.length===0||o.some(_=>_.offsetHeight===0);if(e.offsetHeight===0||h){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let e=this._open?this._previewScheduleDict():null;if(!e){++this._previewSeq,this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let t=++this._previewSeq;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:e,...this._lastPerformed?{last_performed:this._lastPerformed}:{},...this._taskId?{entry_id:this._entryId,task_id:this._taskId}:{}});if(t!==this._previewSeq)return;this._schedulePreview=i.occurrences||[],this._schedulePreviewEnded=!!i.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return p;let e=this._lang,t=this.scheduleTimeEnabled&&this._scheduleTimeOn&&this._scheduleTime?` ${this._scheduleTime}`:"",i=this._schedulePreview.map((o,h)=>{let _=new Date(`${o}T12:00:00`).getDay();return`${q(_===0?6:_-1,e,"short")} ${F(o,e)}${h===0?t:""}`}).join(" \xB7 "),r=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?n`<div class="field-help">${s("schedule_preview_ontime",e)}</div>`:p;return n`
      <div class="trigger-live-hint schedule-preview">
        ${s("schedule_preview_title",e)}: ${i}${this._schedulePreviewEnded?n` <span class="field-help">${s("schedule_preview_ends",e)}</span>`:p}
        ${r}
      </div>
    `}_buildSchedule(){let e=r=>{let o=parseInt(this._calOffset,10)||0;return o&&(r.offset=Math.max(-D,Math.min(o,D))),r},t=r=>((this._calMonths.length||this._hadCalMonths)&&(r.months=[...this._calMonths].sort((o,h)=>o-h)),e(r));if(this._scheduleType==="weekdays")return e({kind:"weekdays",weekdays:[...this._weekdays].sort((r,o)=>r-o)});if(this._scheduleType==="nth_weekday")return t({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});if(this._scheduleType==="calendar")return e({kind:"calendar",entity_id:this._calendarEntity.trim()});let i={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(i.business=!0),t(i)}_recurrenceExtras(){let e={};if(this._seasonMonths.length&&(e.season_months=[...this._seasonMonths].sort((t,i)=>t-i)),this._endsMode==="count"){let t=parseInt(this._endsCount,10);t>=1&&(e.ends={count:t})}else this._endsMode==="until"&&this._endsUntil&&(e.ends={until:this._endsUntil});return e}_toggleCalMonth(e){this._calMonths=this._calMonths.includes(e)?this._calMonths.filter(t=>t!==e):[...this._calMonths,e]}_renderCalMonths(){let e=this._lang;return n`
      <label class="field-label">${s("recurrence_months_label",e)}</label>
      <div class="field-help">${s("recurrence_months_hint",e)}</div>
      <div class="weekday-chips season-chips cal-month-chips">
        ${Ze(e).map((t,i)=>n`
          <button
            type="button"
            class="season-chip ${this._calMonths.includes(i+1)?"selected":""}"
            @click=${()=>this._toggleCalMonth(i+1)}
          >${t}</button>`)}
      </div>`}_toggleSeasonMonth(e){this._seasonMonths=this._seasonMonths.includes(e)?this._seasonMonths.filter(t=>t!==e):[...this._seasonMonths,e]}_renderRecurrenceExtras(){let e=this._lang;if(!(this._scheduleType==="time_based"||te.includes(this._scheduleType)))return p;let i=Ze(e);return n`
      <label class="field-label">${s("season_window_label",e)}</label>
      <div class="field-help">${s("season_window_hint",e)}</div>
      <div class="weekday-chips season-chips">
        ${i.map((r,o)=>n`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(o+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(o+1)}
          >${r}</button>`)}
      </div>

      <label class="field-label">${s("series_end_label",e)}</label>
      <div class="select-row">
        ${b({label:s("series_end_label",e),value:this._endsMode,onChange:r=>this._endsMode=r.target.value},n`
          <option value="never" ?selected=${this._endsMode==="never"}>${s("series_end_never",e)}</option>
          <option value="count" ?selected=${this._endsMode==="count"}>${s("series_end_after_count",e)}</option>
          <option value="until" ?selected=${this._endsMode==="until"}>${s("series_end_until",e)}</option>
        `)}
      </div>
      ${this._endsMode==="count"?n`
        <!-- max: MAX_SERIES_COUNT (const.py), what the history can count. -->
        <ms-textfield
          label="${s("series_end_count_label",e)}"
          type="number" min="1" max="500"
          .value=${this._endsCount}
          @input=${r=>this._endsCount=r.target.value}
        ></ms-textfield>`:p}
      ${this._endsMode==="until"?n`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${e}
          label="${s("series_end_until_label",e)}"
          .value=${this._endsUntil}
          @value-changed=${r=>this._endsUntil=r.detail.value}
        ></ms-date-field>`:p}
    `}_renderCalendarFields(){let e=this._lang,t=Ft(e);if(this._scheduleType==="weekdays")return n`
        <label class="field-label">${s("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${t.map((i,r)=>n`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(r)?"selected":""}"
              @click=${()=>this._toggleWeekday(r)}
            >${i}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let i=[["1",s("ord_1",e)],["2",s("ord_2",e)],["3",s("ord_3",e)],["4",s("ord_4",e)],["5",s("ord_5",e)],["-1",s("ord_last",e)]];return n`
        <div class="select-row">
          ${x()?p:n`<label>${s("recurrence_occurrence",e)}</label>`}
          ${b({label:s("recurrence_occurrence",e),value:this._nth,onChange:r=>this._nth=r.target.value},n`
            ${i.map(([r,o])=>n`<option value=${r} ?selected=${r===this._nth}>${o}</option>`)}
          `)}
        </div>
        <div class="select-row">
          ${x()?p:n`<label>${s("recurrence_weekday",e)}</label>`}
          ${b({label:s("recurrence_weekday",e),value:this._nthWeekday,onChange:r=>this._nthWeekday=r.target.value},n`
            ${t.map((r,o)=>n`<option value=${String(o)} ?selected=${String(o)===this._nthWeekday}>${r}</option>`)}
          `)}
        </div>
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`}return this._scheduleType==="calendar"?n`
        ${this._entityPickerFallback?n`
          <ms-textfield
            label="${s("calendar_entity_label",e)}"
            helper="${s("calendar_entity_hint",e)}"
            .value=${this._calendarEntity}
            @input=${i=>this._calendarEntity=i.target.value.trim()}
          ></ms-textfield>
        `:n`
          <ha-form
            class="entity-picker-form calendar-entity-form"
            .hass=${this.hass}
            .schema=${[{name:"calendar_entity",selector:{entity:{domain:"calendar"}}}]}
            .data=${{calendar_entity:this._calendarEntity}}
            .computeLabel=${()=>s("calendar_entity_label",e)}
            .computeHelper=${()=>s("calendar_entity_hint",e)}
            @value-changed=${i=>{this._calendarEntity=(i.detail.value.calendar_entity||"").trim()}}
          ></ha-form>`}
        ${this._renderCalOffsetField()}`:this._scheduleType==="day_of_month"?n`
        ${this._domLastDay?p:n`
          <ms-textfield
            label="${s("recurrence_day",e)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${i=>this._domDay=i.target.value}
          ></ms-textfield>`}
        ${$({cls:"checkbox-row",checked:this._domLastDay,onChange:i=>this._domLastDay=i.target.checked},n`<span>${s("recurrence_last_day",e)}</span>`)}
        ${$({cls:"checkbox-row",checked:this._domBusiness,onChange:i=>this._domBusiness=i.target.checked},n`<span>${s("recurrence_business_day",e)}</span>`)}
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`:p}_renderCalOffsetField(){let e=this._lang;return n`
      <ms-textfield
        label="${s("recurrence_offset",e)}"
        helper="${s("recurrence_offset_help",e)}"
        type="number"
        min=${-D}
        max=${D}
        .value=${this._calOffset}
        @input=${t=>this._calOffset=t.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let e=parseFloat(this._triggerAbove),t=parseFloat(this._triggerBelow);return!isNaN(e)&&!isNaN(t)&&t>e}_renderTriggerLiveHint(){if(this._triggerType==="compound")return p;let e=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?n`<div class="trigger-live-hint warn">${s("trigger_hint_overlap",this._lang)}</div>`:p,t=this._triggerEntityId||this._triggerEntityIds[0];if(!t||!this.hass?.states)return e;let i=this.hass.states[t];if(!i)return e;let r=this._lang,o=i.attributes?.unit_of_measurement,h=this._triggerAttribute?i.attributes?.[this._triggerAttribute]:i.state,_=typeof h=="number"?h:parseFloat(String(h)),g=h!=="unknown"&&h!=="unavailable"&&h!=null&&!isNaN(_),v=y=>w(y,r,{maximumFractionDigits:1}),f=y=>L(v(y),typeof o=="string"?o:"",r),m=[];if(this._triggerType==="threshold"){let y=parseFloat(this._triggerAbove),T=parseFloat(this._triggerBelow),R=parseFloat(this._triggerEquals),C=parseFloat(this._triggerNotEquals);if([y,T,R,C].every(N=>isNaN(N)))return p;g&&m.push(s("trigger_hint_now",r).replace("{value}",f(_))),isNaN(y)||m.push(s("trigger_hint_above",r).replace("{target}",f(y))),isNaN(T)||m.push(s("trigger_hint_below",r).replace("{target}",f(T))),isNaN(R)||m.push(s("trigger_hint_equals",r).replace("{target}",f(R))),isNaN(C)||m.push(s("trigger_hint_not_equals",r).replace("{target}",f(C)))}else if(this._triggerType==="counter"){let y=parseFloat(this._triggerTargetValue);if(isNaN(y))return p;this._triggerDeltaMode?this._taskId?m.push(s("trigger_hint_counter_delta_edit",r).replace("{target}",f(y))):g?m.push(s("trigger_hint_counter_delta",r).replace("{value}",f(_)).replace("{due}",f(_+y)).replace("{target}",f(y))):m.push(s("trigger_hint_counter_delta_edit",r).replace("{target}",f(y))):(g&&m.push(s("trigger_hint_now",r).replace("{value}",f(_))),m.push(s("trigger_hint_counter_abs",r).replace("{target}",f(y))))}else if(this._triggerType==="runtime"){let y=parseFloat(this._triggerRuntimeHours);if(isNaN(y))return p;m.push(s("trigger_hint_runtime",r).replace("{hours}",v(y))),m.push(s("trigger_hint_state_now",r).replace("{value}",String(i.state)))}else if(this._triggerType==="state_change"){let y=parseInt(this._triggerTargetChanges,10)||1,T=this._triggerToState.trim();m.push((T?s("trigger_hint_state_change_to",r).replace("{state}",T):s("trigger_hint_state_change",r)).replace("{count}",String(y))),m.push(s("trigger_hint_state_now",r).replace("{value}",String(i.state)))}else if(this._triggerType==="due_date"){let y=parseInt(this._triggerDaysBefore,10)||0;m.push(y===0?s("trigger_hint_due_date_same_day",r):be("trigger_hint_due_date","trigger_hint_due_date_one",y,r,"days"));let T=h==null?"":String(h);T&&!isNaN(Date.parse(T))&&m.push(s("trigger_hint_due_date_now",r).replace("{date}",F(T,r)))}return m.length?n`<div class="trigger-live-hint">${m.join(" ")}</div>${e}`:e}_holdReadable(e){let t=parseInt(this._triggerForMinutes,10);return!Number.isFinite(t)||t<120?p:n`<div class="field-help hold-readable">= ${z(t,e)}</div>`}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?n`
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
          min=${G[0]}
          max=${G[1]}
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
        ${this._holdReadable(e)}
      `:this._triggerType==="counter"?n`
        <ms-textfield
          label="${s("target_value",e)}"
          type="number"
          step="any"
          .value=${this._triggerTargetValue}
          @input=${t=>this._triggerTargetValue=t.target.value}
        ></ms-textfield>
        ${$({checked:this._triggerDeltaMode,onChange:t=>this._triggerDeltaMode=t.target.checked},n`${s("delta_mode",e)}`)}
        ${this._triggerDeltaMode?n`
              <ms-textfield
                label="${s("baseline_start_value",e)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${t=>this._triggerBaselineValue=t.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?s("baseline_start_help_edit",e):s("baseline_start_help",e)}
                ${this._taskId&&this._liveBaselineValue!=null?n`<div class="baseline-effective">
                      ${s("baseline_current_effective",e).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:p}
              </div>
            `:p}
      `:this._triggerType==="state_change"?n`
        ${this._renderStateField({label:s("from_state_optional",e),value:this._triggerFromState,entityId:this._triggerEntityId,onInput:t=>this._triggerFromState=t})}
        <div class="field-help">${s("state_value_help",e)}</div>
        ${this._renderStateField({label:s("to_state_optional",e),value:this._triggerToState,entityId:this._triggerEntityId,onInput:t=>this._triggerToState=t})}
        <ms-textfield
          label="${s("target_changes",e)}"
          type="number"
          min=${Oe[0]}
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ms-textfield>
        <div class="field-help">${s("target_changes_help",e)}</div>
        ${(this._triggerTargetChanges||"1")==="1"&&(this._triggerFromState||this._triggerToState)?n`<div class="field-help">${s("state_latch_help",e)}</div>`:p}
        <ms-textfield
          label="${s("for_at_least_minutes",e)}"
          type="number"
          min=${G[0]}
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
        ${this._holdReadable(e)}
        <div class="field-help">${s("for_minutes_state_help",e)}</div>
      `:this._triggerType==="runtime"?n`
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
      `:this._triggerType==="due_date"?n`
        <ms-textfield
          label="${s("days_before",e)}"
          type="number"
          step="1"
          min=${M[0]}
          max=${M[1]}
          .value=${this._triggerDaysBefore}
          @input=${t=>this._triggerDaysBefore=t.target.value}
        ></ms-textfield>
        <div class="field-help">${s("days_before_help",e)}</div>
      `:p}_section(e,t,i){return n`<section class="form-section ${e}">
      <h3 class="section-title">${t}</h3>
      ${i}
    </section>`}_renderIdentity(e){return n`
          ${this._taskId===null&&this._objectChoices.length>0?n`
            <div class="select-row">
              ${x()?p:n`<label>${s("object",e)}</label>`}
              ${b({label:s("object",e),value:this._entryId,onChange:t=>{this._entryId=t.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}},n`
                ${this._objectChoices.map(t=>n`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
              `)}
            </div>
          `:p}
          <ms-textfield
            label="${s("task_name",e)}"
            required
            .value=${this._name}
            @input=${t=>this._name=t.target.value}
          ></ms-textfield>
          <div class="select-row">
            ${x()?p:n`<label>${s("maintenance_type",e)}</label>`}
            ${b({label:s("maintenance_type",e),value:this._type,onChange:t=>this._type=t.target.value},n`
              ${Je.map(t=>n`<option value=${t} ?selected=${t===this._type}>${s(t,e)}</option>`)}
            `)}
          </div>
          <ms-textfield
            label="${s("notes_optional",e)}"
            multiline
            .rows=${3}
            .helper=${s("notes_markdown_hint",e)}
            .value=${this._notes}
            @input=${t=>this._notes=t.target.value}
          ></ms-textfield>
          ${this._renderDetails(e)}
          ${$({cls:"toggle-row",checked:this._enabled,onChange:t=>this._enabled=t.target.checked},n`${s("task_enabled",e)}`)}
    `}_renderDetails(e){return n`
      ${k({cls:"details-section",open:this._detailsOpen,header:s("task_section_details",e)},n`
        <div class="select-row">
          ${x()?p:n`<label>${s("priority",e)}</label>`}
          ${b({label:s("priority",e),value:this._priority,onChange:t=>this._priority=t.target.value},n`
            ${He.map(t=>n`<option value=${t} ?selected=${t===this._priority}>${s("priority_"+t,e)}</option>`)}
          `)}
        </div>
        <ms-textfield
          label="${s("labels",e)}"
          placeholder="${s("labels_placeholder",e)}"
          helper="${s("labels_help",e)}"
          .value=${this._labels}
          @input=${t=>this._labels=t.target.value}
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
      `)}
    `}_renderScheduleSection(e){return this._section("schedule-section",s("task_section_schedule",e),n`
          <div class="select-row">
            ${x()?p:n`<label>${s("schedule_type",e)}</label>`}
            ${b({label:s("schedule_type",e),value:this._scheduleType,onChange:t=>this._setScheduleType(t.target.value)},n`
              ${Ct.map(t=>n`<option value=${t} ?selected=${t===this._scheduleType}>${s(t,e)}</option>`)}
            `)}
          </div>
          ${this._scheduleType==="time_based"?n`
                <ms-textfield
                  label="${s("interval_value",e)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${t=>this._intervalDays=t.target.value}
                ></ms-textfield>
                ${this._missingInterval()?n`<div class="field-help interval-required">${s("interval_required",e)}</div>`:p}
                ${this._renderUnitSelect()}
                <div class="select-row">
                  ${x()?p:n`<label>${s("interval_anchor",e)}</label>`}
                  ${b({label:s("interval_anchor",e),value:this._intervalAnchor,onChange:t=>this._intervalAnchor=t.target.value},n`
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${s("anchor_completion",e)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${s("anchor_planned",e)}</option>
                  `)}
                  <div class="field-help anchor-help">${s("interval_anchor_hint",e)}</div>
                </div>
              `:p}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?n`
                <ms-date-field
                  kind="date"
                  .hass=${this.hass}
                  .lang=${e}
                  label="${s("due_date",e)}"
                  .value=${this._dueDate}
                  @value-changed=${t=>this._dueDate=t.detail.value}
                ></ms-date-field>
              `:p}
          ${this.scheduleTimeEnabled&&Xe.includes(this._scheduleType)?n`
            ${$({cls:"checkbox-row schedule-time-toggle",checked:this._scheduleTimeOn,onChange:t=>this._scheduleTimeOn=t.target.checked},n`<span>${s("schedule_time_toggle",e)}</span>`)}
            ${this._scheduleTimeOn?n`
              <ms-date-field
                kind="time"
                .hass=${this.hass}
                .lang=${e}
                .value=${this._scheduleTime}
                helper="${s("schedule_time_help",e)}"
                @value-changed=${t=>this._scheduleTime=t.detail.value}
              ></ms-date-field>
            `:p}
          `:p}
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
            min=${ne[0]}
            max=${ne[1]}
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
          ${this._renderAdaptiveSection(e)}
    `)}_renderTriggerSection(e){return this._scheduleType!=="sensor_based"?p:this._section("trigger-section",s("task_section_trigger",e),n`
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"&&(this.environmentalFeature||this._environmentalInitial)?n`
            ${this._entityPickerFallback?n`
              <ms-textfield
                label="${s("environmental_entity_optional",e)}"
                helper="${s("environmental_entity_helper",e)}"
                .value=${this._environmentalEntity}
                @input=${t=>this._environmentalEntity=t.target.value.trim()}
              ></ms-textfield>
            `:n`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:De}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>s("environmental_entity_optional",e)}
              .computeHelper=${()=>s("environmental_entity_helper",e)}
              @value-changed=${t=>{this._environmentalEntity=(t.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(e):p}
          `:p}
    `)}_renderCompletionSection(e){return this._section("completion-section",s("task_section_completion",e),n`
          ${this._type==="reading"?n`
                <ms-textfield
                  label="${s("reading_unit_label",e)}"
                  .value=${this._readingUnit}
                  @input=${t=>this._readingUnit=t.target.value}
                ></ms-textfield>
                <div class="field-help">${s("reading_unit_help",e)}</div>
                ${this._renderReadingsEditor(e)}
              `:p}
          ${this.checklistsEnabled?n`
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
          `:p}
          ${this._partsLoadFailed?n`<div class="field-help parts-load-failed">${s("parts_load_failed",e)}</div>`:p}
          ${this._isFleetTask?n`<div class="field-help parts-fleet-hint">${s("task_parts_fleet_hint",e)}</div>`:this.parts.length||this._foreignOwners.length?n`
                <div class="field">
                  <label>${s("consumes_parts_label",e)}</label>
                  ${this.parts.map(t=>this._renderConsumesRow(t))}
                  ${this._foreignOwners.length?n`
                        ${k({cls:"shared-pools",open:this._hasForeignPick,header:s("shared_parts_other_objects",e)},n`
                          <div class="field-help">${s("shared_parts_help",e)}</div>
                          ${this._foreignOwners.map(t=>n`
                              <div class="shared-pool-owner">${t.name}</div>
                              ${t.parts.map(i=>this._renderConsumesRow(i,t.entry_id))}
                            `)}
                        `)}
                      `:p}
                </div>
              `:p}
          <div class="field-label">${s("require_on_completion",e)}</div>
          <div class="required-completion">
            ${le.map(t=>n`
              ${$({cls:"req-option",checked:this._requiredCompletion.includes(t),onChange:i=>this._toggleRequired(t,i.target.checked)},n`<span>${s(Q[t],e)}</span>`)}
            `)}
          </div>
          ${this._availableTags.length>0?n`
              <div class="select-row">
                ${x()?p:n`<label>${s("nfc_tag_id_optional",e)}</label>`}
                ${b({label:s("nfc_tag_id_optional",e),value:this._nfcTagId,onChange:t=>this._nfcTagId=t.target.value},n`
                  <option value="" ?selected=${!this._nfcTagId}>${s("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(t=>n`<option value=${t.id} ?selected=${t.id===this._nfcTagId}>${t.name}</option>`)}
                `)}
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${s("nfc_tags_refresh",e)}">↻</button>
              </div>
            `:n`
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
          ${$({cls:"req-option",checked:this._requireTagScan,onChange:t=>this._requireTagScan=t.target.checked},n`<span>${s("require_tag_scan",e)}</span>`)}
          ${this._requireTagScan?n`<div class="field-help">${s("require_tag_scan_help",e)}</div>`:p}
          ${$({cls:"req-option",checked:!this._allowSkip,onChange:t=>this._allowSkip=!t.target.checked},n`<span>${s("disallow_skip",e)}</span>`)}
          ${this._allowSkip?p:n`<div class="field-help">${s("disallow_skip_help",e)}</div>`}
          ${this._renderQuickComplete(e)}
          ${this._renderCompleteWhen(e)}
          ${this._renderPhasesEditor(e)}
          ${this._renderCompletionActionsSection(e)}
    `)}_renderPeopleSection(e){return this._section("people-section",s("task_section_people",e),n`
          <div class="select-row">
            ${x()?p:n`<label>${s("responsible_user",e)}</label>`}
            ${b({label:s("responsible_user",e),value:this._responsibleUserId||"",onChange:t=>{let i=t.target.value;this._responsibleUserId=i||null}},n`
              <option value="" ?selected=${!this._responsibleUserId}>${s("no_user_assigned",e)}</option>
              ${this._availableUsers.map(t=>n`<option value=${t.id} ?selected=${t.id===this._responsibleUserId}>${t.name}</option>`)}
            `)}
          </div>
          ${this._availableUsers.length>=2?n`
            <div class="field">
              <label>${s("task_shared_with",e)}</label>
              <div class="field-help">${s("task_shared_with_help",e)}</div>
              ${this._responsibleUserId&&this._assigneePool.length>0&&!(this._assigneePool.length>=2&&this._rotationStrategy)?n`<div class="field-help shared-responsible-wins">${s("task_shared_responsible_wins",e)}</div>`:p}
              <div class="assignee-pool">
                ${this._availableUsers.map(t=>n`
                  ${$({cls:"pool-item",checked:this._assigneePool.includes(t.id),onChange:()=>this._toggleAssignee(t.id)},n`<span>${t.name}</span>`)}`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?n`
              <div class="select-row">
                ${x()?p:n`<label>${s("rotation_strategy",e)}</label>`}
                ${b({label:s("rotation_strategy",e),value:this._rotationStrategy,onChange:t=>this._rotationStrategy=t.target.value},n`
                  <option value="" ?selected=${!this._rotationStrategy}>${s("rotation_none",e)}</option>
                  ${Me.map(t=>n`<option value=${t} ?selected=${t===this._rotationStrategy}>${s("rotation_"+t,e)}</option>`)}
                `)}
              </div>`:p}
          `:p}
    `)}_renderNotificationsSection(e){return this._section("notifications-section",s("task_section_notifications",e),n`
          ${$({cls:"req-option",checked:!this._notifyEnabled,onChange:t=>this._notifyEnabled=!t.target.checked},n`<span>${s("no_notifications",e)}</span>`)}
          ${this._notifyEnabled?p:n`<div class="field-help">${s("no_notifications_help",e)}</div>`}
          <ha-icon-picker
            class="notify-icon-picker"
            .hass=${this.hass}
            label="${s("notify_icon",e)}"
            .value=${this._notifyIcon}
            @value-changed=${t=>this._notifyIcon=t.detail.value||""}
          ></ha-icon-picker>
          <div class="field-help notify-icon-help">
            <ha-icon icon=${this._notifyIcon.trim()||ce(this._type)}></ha-icon>
            ${s("notify_icon_hint",e).replace("{default}",ce(this._type))}
          </div>
          ${this._renderNotifyTexts(e)}
          ${this._renderMirrorTodo(e)}
    `)}_renderNotifyTexts(e){let t=Y.filter(i=>i!=="triggered"||this._scheduleType==="sensor_based"||!!this._notifyTexts.triggered);return k({cls:"notify-texts",open:this._notifyTextsOpen,header:s("notify_texts",e)},n`
      <p class="field-help">${s("notify_texts_hint",e)}</p>
      ${t.map(i=>n`
        <div class="notify-text" data-kind=${i}>
          <div class="notify-text-kind">${s(i,e)}</div>
          <ms-textfield class="notify-text-title" label=${s("notify_texts_title",e)} .value=${this._notifyTexts[i]?.title??""}
            @input=${r=>this._setNotifyText(i,"title",r.target.value)}></ms-textfield>
          <ms-textfield class="notify-text-message" label=${s("notify_texts_message",e)} multiline .rows=${2} .value=${this._notifyTexts[i]?.message??""}
            @input=${r=>this._setNotifyText(i,"message",r.target.value)}></ms-textfield>
          <div class="field-help">${s("notify_texts_placeholders",e).replace("{list}",he[i].map(r=>`{${r}}`).join(" "))}${i==="triggered"?` ${s("notify_texts_detail_hint",e)}`:i==="completed"?` ${s("notify_texts_completed_hint",e)}`:""}</div>
        </div>`)}
    `)}_setNotifyText(e,t,i){this._notifyTexts={...this._notifyTexts,[e]:{...this._notifyTexts[e],[t]:i}}}_renderMirrorTodo(e){let t=this.mirrorTodoDefault;if(!t.length)return n`
          <div class="field mirror-todo-field">
            ${this._renderMirrorTodoPicker(e)}
            <div class="field-help">${s("task_mirror_todo_hint",e)}</div>
          </div>`;let i=t.map(o=>H(this.hass,o)).join(", "),r={default:s("task_mirror_todo_default",e).replace("{lists}",i),own:s("task_mirror_todo_own",e),none:s("task_mirror_todo_none",e)};return n`
          <div class="field mirror-todo-field">
            <div class="mirror-todo-choice" role="radiogroup" aria-label=${s("task_mirror_todo",e)}>
              <div class="field-label">${s("task_mirror_todo",e)}</div>
              ${Object.keys(r).map(o=>n`
                <label class="mirror-todo-option">
                  <input type="radio" name="mirror-todo" value=${o} .checked=${this._mirrorTodoMode===o}
                    @change=${()=>this._mirrorTodoMode=o} />
                  ${r[o]}
                </label>
              `)}
            </div>
            ${this._mirrorTodoMode==="own"?this._renderMirrorTodoPicker(e):p}
            ${this._mirrorTodoMode!=="none"?n`<div class="field-help">${s("task_mirror_todo_hint",e)}</div>`:p}
          </div>`}_renderMirrorTodoPicker(e){return n`
            ${this._entityPickerFallback?n`
              <ms-textfield
                label="${s("task_mirror_todo",e)}"
                placeholder="todo.family, todo.kids"
                .value=${this._mirrorTodoEntities.join(", ")}
                @input=${t=>{this._mirrorTodoEntities=X(this.hass,t.target.value.split(",").map(i=>i.trim()))}}
              ></ms-textfield>
            `:n`
              <ha-form
                class="entity-picker-form"
                .hass=${this.hass}
                .schema=${[{name:"mirror_todo_entities",selector:{entity:{multiple:!0,domain:["todo"],exclude_entities:ze(this.hass)}}}]}
                .data=${{mirror_todo_entities:this._mirrorTodoEntities}}
                .computeLabel=${()=>s("task_mirror_todo",e)}
                @value-changed=${t=>{this._mirrorTodoEntities=X(this.hass,t.detail.value.mirror_todo_entities||[])}}
              ></ha-form>`}
            <div class="field-help mirror-todo-max">${s("task_mirror_todo_max",e).replace("{max}",String(5))}</div>`}_ruleDraft(){let e=this._triggerEntityIds.length?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[];return{name:this._name,enabled:this._enabled,typeLabel:s(this._type,this._lang),scheduleType:this._scheduleType,intervalDays:this._intervalDays,intervalUnit:this._intervalUnit,intervalAnchor:this._intervalAnchor,dueDate:this._dueDate,weekdays:this._weekdays,nth:this._nth,nthWeekday:this._nthWeekday,domDay:this._domDay,domLastDay:this._domLastDay,domBusiness:this._domBusiness,calOffset:this._calOffset,calMonths:this._calMonths,calendarEntity:this._calendarEntity?H(this.hass,this._calendarEntity):"",warningDays:this._warningDays,trigger:this._typeFields(),triggerEntityIds:e,triggerUnit:ke(this.hass,{trigger_config:{type:this._triggerType,entity_id:e[0]}}),triggerCombinator:this._triggerCombinator,entityLogic:this._triggerEntityLogic,compoundLogic:this._compoundLogic,compoundCount:this._compoundConditions.length,compoundEntityIds:this._compoundConditions.flatMap(t=>t.entityIds.split(",").map(i=>i.trim()).filter(Boolean)),completeWhenEntity:this._completeWhenEntity,completeWhenState:this._completeWhenState,completeWhenFor:this._completeWhenFor,completeWhenAnyTime:this._completeWhenAnyTime,quickOn:this._quickOn,requiredCount:this._requiredCompletion.length,allowSkip:this._allowSkip,requireTagScan:this._requireTagScan,checklistCount:this.checklistsEnabled?this._checklistText.split(`
`).filter(t=>t.trim()).length:0,partsCount:Object.keys(this._consumesParts).length,responsibleUserId:this._responsibleUserId,pool:this._assigneePool,rotation:this._rotationStrategy,notifyEnabled:this._notifyEnabled,ownTexts:pe(this._notifyTexts).length>0,mirrorLists:this._mirrorChoice().lists}}_mirrorChoice(){return Le(this.hass,this._mirrorTodoMode,this.mirrorTodoDefault,this._mirrorTodoEntities)}_userName(e){return this._availableUsers.find(t=>t.id===e)?.name??e}_sidebarTitle(e,t){switch(e){case"task":return s("task_section_details",t);case"schedule":return s("task_section_schedule",t);case"trigger":return s("task_section_trigger",t);case"completion":return s("task_section_completion",t);case"people":return s("task_section_people",t);case"notifications":return s("task_section_notifications",t);default:return s("beta_rules_add_rule",t)}}_selectRule(e){this._ruleSel=this._ruleSel===e?null:e,e==="add"&&this._loadObjectDevice()}_removeRule(e){e==="trigger"?(this._resetTriggerFields(),this._scheduleType=parseInt(this._intervalDays,10)>0?"time_based":"manual"):e==="schedule"&&(this._scheduleType==="sensor_based"?this._intervalDays="":this._scheduleType="manual"),this._ruleSel===e&&(this._ruleSel=null)}_combineTrigger(e,t=""){if(this._triggerType!=="compound"){let i=this._triggerEntityIds.length?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[];this._compoundConditions=[{entityIds:i.join(", "),...this._typeFields(),carry:this._ownRuleFields(i)}],this._compoundLogic="OR",this._triggerType="compound",this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._holdUntilDone=!1,this._triggerBaselineValue="",this._triggerRuntimeMaxSession=""}this._compoundConditions=[...this._compoundConditions,{...ee(),type:e,entityIds:t}]}_setSensorRule(e,t=""){this._scheduleType!=="time_based"&&this._scheduleType!=="sensor_based"&&(this._intervalDays=""),this._scheduleType="sensor_based",this._resetTriggerFields(),this._triggerType=e,e==="compound"&&(this._compoundConditions=[ee()]),t&&(this._triggerEntityId=t,this._triggerEntityIds=[t],this._seedUpdateRule(),this._fetchEntityAttributes(t))}_seedUpdateRule(){this._triggerType!=="state_change"||this._triggerEntityIds.length!==1||!this._triggerEntityId.startsWith("update.")||this._triggerFromState.trim()||this._triggerToState.trim()||(this._triggerFromState="off",this._triggerToState="on",this._autoCompleteOnRecovery=!0,this._holdUntilDone=!1)}_applyChoice(e){if(e.kind==="schedule"){if(e.effect==="safety"){parseInt(this._intervalDays,10)>0||(this._intervalDays="30"),this._ruleSel="trigger";return}this._scheduleType==="sensor_based"&&this._resetTriggerFields(),this._setScheduleType(e.value),this._ruleSel="schedule";return}let t=e.value;e.effect==="combine"?this._combineTrigger(t):this._setSensorRule(t),this._ruleSel="trigger"}_applySuggestion(e){if(e.target==="done_when"){e.entityId!==this._completeWhenEntity&&(this._completeWhenState=""),this._completeWhenEntity=e.entityId,this._ruleSel="completion";return}let t=e.triggerType??"threshold";this._scheduleType==="sensor_based"&&(this._triggerType==="compound"||!!this._triggerEntityId)?this._combineTrigger(t,e.entityId):this._setSensorRule(t,e.entityId),this._ruleSel="trigger"}async _loadObjectDevice(){let e=this._entryId;if(!e||this._objectDevice?.entryId===e)return;let t=null,i=null;try{let o=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}))?.objects??[]).find(h=>h.entry_id===e);t=o?.object.ha_device_id??null,i=o?.object.area_id??null}catch{}this._entryId===e&&(this._objectDevice={entryId:e,deviceId:t,areaId:i})}async _loadTemplateChoices(){if(this._templateChoices===null)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/templates",language:this._lang});this._templateChoices=(e?.templates??[]).filter(t=>!t.disabled).flatMap(t=>(t.tasks??[]).map(i=>({...i,template:t.name})))}catch{this._templateChoices=[]}}async _loadCopyChoices(){if(this._copyChoices===null)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._copyChoices=(e?.objects??[]).flatMap(t=>(t.tasks??[]).filter(i=>!i.battery_fleet_task&&!i.part_ref).map(i=>({entryId:t.entry_id,objectName:t.object.name,task:i})))}catch{this._copyChoices=[]}}_applyTemplateTask(e){this._name=e.name,this._type=Je.includes(e.type)?e.type:"custom";let t=e.interval_days&&e.interval_days>0?String(e.interval_days):"";e.schedule_type==="sensor_based"?(this._scheduleType="sensor_based",this._intervalDays=t):e.schedule_type==="manual"||!t?this._scheduleType="manual":(this._scheduleType="time_based",this._intervalDays=t,this._intervalUnit="days"),e.warning_days!==null&&e.warning_days!==void 0&&(this._warningDays=String(e.warning_days)),this._betaStep="form",this._ruleSel=this._scheduleType==="sensor_based"?"add":"schedule",this._ruleSel==="add"&&(this._addTab="device",this._loadObjectDevice())}async _applyCopy(e){let t=this._entryId,i=this._objectChoices;await this._edit(e.entryId,e.task),this._taskId=null,this._entryId=t,this._objectChoices=i,this._series=[],this._isFleetTask=!1,this._lastPerformed="",this._nfcTagId="",this._consumesParts={},this._consumesQtyText={},this._phaseDefs=this._phaseDefs.map(r=>({...r,partId:"",partQty:"",extraParts:[]})),this._adaptiveInitial=qt,this._environmentalInitial="",this._environmentalAttributeInitial="",await Promise.all([this._loadParts(),this._loadForeignPools()]),this._betaStep="form",this._ruleSel="task"}_choiceNote(e,t){return e.effect==="replace"?s("beta_rules_replaces",t):e.effect==="combine"?s("beta_rules_combines",t):e.effect==="safety"?s("beta_rules_adds_safety",t):""}_renderAddPicker(e){let t=n`
      <div class="add-tabs" role="tablist" aria-label=${s("beta_rules_add_rule",e)}>
        <button type="button" role="tab" class="add-tab-type" aria-selected=${this._addTab==="type"?"true":"false"}
          @click=${()=>{this._addTab="type"}}>${s("beta_rules_by_type",e)}</button>
        <button type="button" role="tab" class="add-tab-device" aria-selected=${this._addTab==="device"?"true":"false"}
          @click=${()=>{this._addTab="device",this._loadObjectDevice()}}>${s("beta_rules_by_device",e)}</button>
      </div>`;if(this._addTab==="type"){let v=Ke({scheduleType:this._scheduleType,intervalDays:this._intervalDays,triggerType:this._triggerType}),f=m=>{let y=this._choiceNote(m,e);return n`
          <button type="button" class="add-choice" data-kind=${m.kind} data-value=${m.value} @click=${()=>this._applyChoice(m)}>
            <ha-icon icon=${m.icon}></ha-icon>
            <span class="add-choice-text">
              <span>${m.kind==="trigger"?Z(m.value,e):s(m.value,e)}</span>
              ${y?n`<span class="add-choice-note">${y}</span>`:p}
            </span>
          </button>`};return n`${t}
        <div class="add-group">${s("task_section_schedule",e)}</div>
        ${v.filter(m=>m.kind==="schedule").map(f)}
        <div class="add-group">${s("task_section_trigger",e)}</div>
        ${v.filter(m=>m.kind==="trigger").map(f)}`}let i=this._objectDevice;if(i===null||i.entryId!==this._entryId)return n`${t}<div class="field-help">…</div>`;if(!i.deviceId&&!i.areaId)return n`${t}<div class="field-help beta-no-device">${s("beta_rules_no_device",e)}</div>`;let r=Qe(this.hass,{deviceId:i.deviceId,areaId:i.areaId,ownPlatform:"maintenance_supporter"});if(!r.length)return n`${t}<div class="field-help beta-no-device">${s(i.deviceId?"beta_rules_no_device_entities":"beta_rules_no_area_entities",e)}</div>`;let o=i.areaId||(i.deviceId?this.hass.devices?.[i.deviceId]?.area_id:null)||"",h=this.hass.areas?.[o]?.name||o,_=r.some(v=>v.group==="device"),g=(v,f)=>{if(f>0&&r[f-1].group===v.group)return p;let m=v.group==="device"?s("beta_rules_group_device",e):s(_?"beta_rules_group_area_more":"beta_rules_group_area",e).replace("{area}",h);return n`<div class="add-group device-group" data-group=${v.group}>${m}</div>`};return n`${t}
      ${r.map((v,f)=>n`${g(v,f)}
        <div class="device-entity" data-entity=${v.entityId} data-group=${v.group}>
          <div class="device-entity-name">${v.name}</div>
          <div class="device-entity-choices">
            ${me(v).map(m=>n`
              <button type="button" class="add-choice" data-target=${m.target} data-type=${m.triggerType??""} @click=${()=>this._applySuggestion(m)}>
                <ha-icon icon=${m.icon}></ha-icon>
                <span>${m.target==="done_when"?s("beta_rules_done_when_suggest",e):Z(m.triggerType??"",e)}</span>
              </button>`)}
          </div>
        </div>`)}`}_renderSidebarBody(e,t){switch(e){case"task":return this._renderIdentity(t);case"schedule":return this._renderScheduleSection(t);case"trigger":return this._renderTriggerSection(t);case"completion":return this._renderCompletionSection(t);case"people":return this._renderPeopleSection(t);case"notifications":return this._renderNotificationsSection(t);default:return this._renderAddPicker(t)}}_renderRules(e){let t=Ge(this._ruleDraft(),{lang:e,entityName:v=>H(this.hass,v),userName:v=>this._userName(v)}),i=new Map(t.map(v=>[v.id,v])),r=[{title:s("task_section_details",e),ids:["task"]},{title:s("task_section_schedule",e),ids:["schedule","trigger"],add:!0},{title:s("task_section_completion",e),ids:["completion"]},{title:s("task_section_people",e),ids:["people"]},{title:s("task_section_notifications",e),ids:["notifications"]}],o=0,h=1,_=[];for(let v of r){o+=2,_.push(n`<h3 class="rules-group-title" style="order:${o}">${v.title}</h3>`);for(let f of v.ids){let m=i.get(f);if(!m)continue;o+=2,this._ruleSel===f&&(h=o+1);let y=this._ruleSel===f;_.push(n`
          <div class="rule-row ${y?"selected":""}" data-row=${m.id} style="order:${o}">
            <button type="button" class="rule-main" aria-expanded=${y?"true":"false"} @click=${()=>this._selectRule(m.id)}>
              <ha-icon icon=${m.icon}></ha-icon>
              <span class="rule-text">
                <span class="rule-sentence">${m.text}</span>
                ${m.chips.map(T=>n`<span class="rule-chip">${T}</span>`)}
                ${m.badges.length?n`<span class="rule-badges">${m.badges.map(T=>n`<span class="rule-badge">${T}</span>`)}</span>`:p}
              </span>
            </button>
            ${m.removable?n`
              <ha-icon-button class="rule-remove" .path=${It} .label=${s("remove",e)} title=${s("remove",e)}
                @click=${()=>this._removeRule(m.id)}></ha-icon-button>`:p}
          </div>`)}v.add&&(o+=2,this._ruleSel==="add"&&(h=o+1),_.push(n`
          <button type="button" class="rule-add" style="order:${o}" aria-expanded=${this._ruleSel==="add"?"true":"false"}
            @click=${()=>this._selectRule("add")}>
            <ha-icon icon="mdi:plus"></ha-icon>${s("beta_rules_add_rule",e)}
          </button>`))}let g=this._ruleSel;return n`
      <div class="rules-layout">
        ${_}
        <aside class="rules-sidebar ${g?"open":""}" style="order:${h}" aria-label=${g?this._sidebarTitle(g,e):s("beta_rules_select_hint",e)}>
          ${g?n`
                <div class="sidebar-head">
                  <ha-icon-button .path=${St} .label=${s("close",e)} @click=${()=>{this._ruleSel=null}}></ha-icon-button>
                  <span class="sidebar-title">${this._sidebarTitle(g,e)}</span>
                </div>
                <div class="sidebar-body">${this._renderSidebarBody(g,e)}</div>`:n`<div class="sidebar-hint">${s("beta_rules_select_hint",e)}</div>`}
        </aside>
      </div>`}_renderObjectChoice(e){return this._taskId!==null||this._objectChoices.length===0?p:n`
      <div class="select-row">
        ${x()?p:n`<label>${s("object",e)}</label>`}
        ${b({label:s("object",e),value:this._entryId,onChange:t=>{this._entryId=t.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}},n`
          ${this._objectChoices.map(t=>n`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
        `)}
      </div>`}_renderChooser(e){let t=(i,r,o,h,_)=>n`
      <button type="button" class="chooser-item ${i}" @click=${_}>
        <ha-icon icon=${r}></ha-icon>
        <span class="chooser-text">
          <span class="chooser-title">${o}</span>
          <span class="chooser-desc">${h}</span>
        </span>
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </button>`;return n`
      ${this._renderObjectChoice(e)}
      <div class="chooser">
        ${t("chooser-scratch","mdi:pencil",s("beta_new_scratch",e),s("beta_new_scratch_desc",e),()=>{this._betaStep="form",this._ruleSel="task"})}
        ${t("chooser-sensor","mdi:auto-fix",s("beta_new_from_sensor",e),s("beta_new_from_sensor_desc",e),()=>{this._betaStep="form",this._ruleSel="add",this._addTab="device",this._loadObjectDevice()})}
        ${t("chooser-template","mdi:text-box-outline",s("templates_from",e),s("beta_new_from_template_desc",e),()=>{this._betaStep="template",this._chooserFilter="",this._loadTemplateChoices()})}
        ${t("chooser-copy","mdi:content-copy",s("beta_new_copy",e),s("beta_new_copy_desc",e),()=>{this._betaStep="copy",this._chooserFilter="",this._loadCopyChoices()})}
      </div>`}_renderSearch(e){return n`<input type="search" class="chooser-search" aria-label=${s("beta_new_search",e)} placeholder=${s("beta_new_search",e)}
      .value=${this._chooserFilter} @input=${t=>{this._chooserFilter=t.target.value}} />`}_renderTemplatePick(e){if(this._templateChoices===null)return n`<div class="chooser-empty">…</div>`;let t=this._chooserFilter.trim().toLowerCase(),i=this._templateChoices.filter(r=>!t||`${r.name} ${r.template}`.toLowerCase().includes(t)).slice(0,200);return n`
      ${this._renderSearch(e)}
      <div class="chooser">
        ${i.length?i.map(r=>n`
          <button type="button" class="chooser-item template-task" @click=${()=>this._applyTemplateTask(r)}>
            <ha-icon icon=${r.schedule_type==="sensor_based"?"mdi:gauge":"mdi:calendar-sync"}></ha-icon>
            <span class="chooser-text">
              <span class="chooser-title">${r.name}</span>
              <span class="chooser-desc">${r.template}${r.interval_days?n` · ${w(r.interval_days,e)} ${s("unit_days",e)}`:p}</span>
            </span>
          </button>`):n`<div class="chooser-empty">—</div>`}
      </div>`}_renderCopyPick(e){if(this._copyChoices===null)return n`<div class="chooser-empty">…</div>`;let t=this._chooserFilter.trim().toLowerCase(),i=this._copyChoices.filter(r=>!t||`${r.task.name} ${r.objectName}`.toLowerCase().includes(t)).slice(0,200);return n`
      ${this._renderSearch(e)}
      <div class="chooser">
        ${i.length?i.map(r=>n`
          <button type="button" class="chooser-item copy-task" @click=${()=>{this._applyCopy(r)}}>
            <ha-icon icon="mdi:content-copy"></ha-icon>
            <span class="chooser-text">
              <span class="chooser-title">${r.task.name}</span>
              <span class="chooser-desc">${r.objectName}</span>
            </span>
          </button>`):n`<div class="chooser-empty">—</div>`}
      </div>`}_renderBeta(e,t,i){let r=this._betaStep;return n`
      <ha-dialog open class="beta-dialog" .headerTitle=${t}
        .headerSubtitle=${this._series.length>1?s("task_series_position",e).replace("{n}",String(this._seriesIndex+1)).replace("{total}",String(this._series.length)):void 0}
        @closed=${this._close}>
        <!-- HA's header (2026): the title beside the close button; on a
             step under the start screen HA's back arrow takes its place. -->
        ${r==="template"||r==="copy"?n`<ha-icon-button slot="headerNavigationIcon" class="beta-back" .path=${kt} .label=${s("back",e)}
              @click=${()=>{this._betaStep="choose"}}></ha-icon-button>`:p}
        <div class="content beta-content">
          ${this._error?U("error",this._error):p}
          ${this._warning?U("warning",this._warning):p}
          ${r==="choose"?this._renderChooser(e):r==="template"?this._renderTemplatePick(e):r==="copy"?this._renderCopyPick(e):this._renderRules(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${s("cancel",e)}</ha-button>
          ${r==="form"&&i?n`<ha-button appearance="plain" class="series-skip" .disabled=${this._loading} @click=${this._skipSeriesItem}>
                ${s("task_series_skip",e)}
              </ha-button>`:p}
          ${r==="form"?n`<ha-button @click=${this._save} .disabled=${this._loading||this._incomplete()}>
                ${this._loading?s("saving",e):s(i?"task_series_save_next":"save",e)}
              </ha-button>`:p}
        </div>
      </ha-dialog>
    `}render(){if(!this._open)return n``;let e=this._lang,t=this._taskId?s("edit_task",e):s("new_task",e),i=this._seriesIndex+1<this._series.length;return this.betaEditor?this._renderBeta(e,t,i):n`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">
          ${t}
          ${this._series.length>1?n`<span class="series-position">${s("task_series_position",e).replace("{n}",String(this._seriesIndex+1)).replace("{total}",String(this._series.length))}</span>`:p}
        </div>
        <div class="content">
          ${this._error?U("error",this._error):p}
          ${this._warning?U("warning",this._warning):p}
          ${this._renderIdentity(e)}
          ${this._renderScheduleSection(e)}
          ${this._renderTriggerSection(e)}
          ${this._renderCompletionSection(e)}
          ${this._renderPeopleSection(e)}
          ${this._renderNotificationsSection(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${s("cancel",e)}</ha-button>
          ${i?n`<ha-button appearance="plain" class="series-skip" .disabled=${this._loading} @click=${this._skipSeriesItem}>
                ${s("task_series_skip",e)}
              </ha-button>`:p}
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||this._incomplete()}
          >
            ${this._loading?s("saving",e):s(i?"task_series_save_next":"save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};l._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_calMonths","_calendarEntity","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),l.styles=[Ee,Te,Ye,B`
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
    /* #252: one block per kind of notification. */
    .notify-text {
      margin: 12px 0;
    }
    .notify-text-kind {
      font-weight: 500;
      margin-bottom: 4px;
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
  `],d([S({attribute:!1})],l.prototype,"hass",2),d([S({type:Boolean,attribute:"checklists-enabled"})],l.prototype,"checklistsEnabled",2),d([S({type:Boolean,attribute:"schedule-time-enabled"})],l.prototype,"scheduleTimeEnabled",2),d([S({type:Boolean,attribute:"completion-actions-enabled"})],l.prototype,"completionActionsEnabled",2),d([S({type:Boolean,attribute:"adaptive-feature"})],l.prototype,"adaptiveFeature",2),d([S({type:Boolean,attribute:"seasonal-feature"})],l.prototype,"seasonalFeature",2),d([S({type:Boolean,attribute:"environmental-feature"})],l.prototype,"environmentalFeature",2),d([S({type:Number,attribute:"default-warning-days"})],l.prototype,"defaultWarningDays",2),d([S({attribute:!1})],l.prototype,"mirrorTodoDefault",2),d([S({type:Boolean,attribute:"beta-editor"})],l.prototype,"betaEditor",2),d([c()],l.prototype,"_ruleSel",2),d([c()],l.prototype,"_addTab",2),d([c()],l.prototype,"_betaStep",2),d([c()],l.prototype,"_chooserFilter",2),d([c()],l.prototype,"_templateChoices",2),d([c()],l.prototype,"_copyChoices",2),d([c()],l.prototype,"_objectDevice",2),d([c()],l.prototype,"parts",2),d([c()],l.prototype,"_foreignOwners",2),d([c()],l.prototype,"_open",2),d([c()],l.prototype,"_entityPickerFallback",2),d([c()],l.prototype,"_loading",2),d([c()],l.prototype,"_error",2),d([c()],l.prototype,"_warning",2),d([c()],l.prototype,"_entryId",2),d([c()],l.prototype,"_taskId",2),d([c()],l.prototype,"_series",2),d([c()],l.prototype,"_seriesIndex",2),d([c()],l.prototype,"_isFleetTask",2),d([c()],l.prototype,"_objectChoices",2),d([c()],l.prototype,"_name",2),d([c()],l.prototype,"_type",2),d([c()],l.prototype,"_scheduleType",2),d([c()],l.prototype,"_intervalDays",2),d([c()],l.prototype,"_intervalUnit",2),d([c()],l.prototype,"_dueDate",2),d([c()],l.prototype,"_warningDays",2),d([c()],l.prototype,"_earliestCompletionDays",2),d([c()],l.prototype,"_intervalAnchor",2),d([c()],l.prototype,"_weekdays",2),d([c()],l.prototype,"_nth",2),d([c()],l.prototype,"_nthWeekday",2),d([c()],l.prototype,"_domDay",2),d([c()],l.prototype,"_domLastDay",2),d([c()],l.prototype,"_domBusiness",2),d([c()],l.prototype,"_calOffset",2),d([c()],l.prototype,"_calMonths",2),d([c()],l.prototype,"_calendarEntity",2),d([c()],l.prototype,"_seasonMonths",2),d([c()],l.prototype,"_endsMode",2),d([c()],l.prototype,"_endsCount",2),d([c()],l.prototype,"_endsUntil",2),d([c()],l.prototype,"_schedulePreview",2),d([c()],l.prototype,"_schedulePreviewEnded",2),d([c()],l.prototype,"_notes",2),d([c()],l.prototype,"_documentationUrl",2),d([c()],l.prototype,"_customIcon",2),d([c()],l.prototype,"_notifyIcon",2),d([c()],l.prototype,"_notifyTexts",2),d([c()],l.prototype,"_notifyTextsOpen",2),d([c()],l.prototype,"_priority",2),d([c()],l.prototype,"_labels",2),d([c()],l.prototype,"_detailsOpen",2),d([c()],l.prototype,"_mirrorTodoEntities",2),d([c()],l.prototype,"_mirrorTodoMode",2),d([c()],l.prototype,"_completeWhenEntity",2),d([c()],l.prototype,"_completeWhenState",2),d([c()],l.prototype,"_completeWhenAnyTime",2),d([c()],l.prototype,"_completeWhenFor",2),d([c()],l.prototype,"_enabled",2),d([c()],l.prototype,"_triggerEntityId",2),d([c()],l.prototype,"_triggerEntityIds",2),d([c()],l.prototype,"_triggerEntityLogic",2),d([c()],l.prototype,"_triggerAttribute",2),d([c()],l.prototype,"_triggerType",2),d([c()],l.prototype,"_triggerAbove",2),d([c()],l.prototype,"_triggerBelow",2),d([c()],l.prototype,"_triggerEquals",2),d([c()],l.prototype,"_triggerNotEquals",2),d([c()],l.prototype,"_triggerForMinutes",2),d([c()],l.prototype,"_triggerCombinator",2),d([c()],l.prototype,"_triggerTargetValue",2),d([c()],l.prototype,"_triggerDeltaMode",2),d([c()],l.prototype,"_triggerBaselineValue",2),d([c()],l.prototype,"_liveBaselineValue",2),d([c()],l.prototype,"_autoCompleteOnRecovery",2),d([c()],l.prototype,"_holdUntilDone",2),d([c()],l.prototype,"_triggerFromState",2),d([c()],l.prototype,"_triggerToState",2),d([c()],l.prototype,"_triggerTargetChanges",2),d([c()],l.prototype,"_triggerRuntimeHours",2),d([c()],l.prototype,"_triggerDaysBefore",2),d([c()],l.prototype,"_triggerRuntimeMaxSession",2),d([c()],l.prototype,"_triggerOnStates",2),d([c()],l.prototype,"_triggerDetailAttribute",2),d([c()],l.prototype,"_compoundLogic",2),d([c()],l.prototype,"_compoundConditions",2),d([c()],l.prototype,"_suggestedAttributes",2),d([c()],l.prototype,"_availableAttributes",2),d([c()],l.prototype,"_entityDomain",2),d([c()],l.prototype,"_lastPerformed",2),d([c()],l.prototype,"_nfcTagId",2),d([c()],l.prototype,"_requireTagScan",2),d([c()],l.prototype,"_allowSkip",2),d([c()],l.prototype,"_notifyEnabled",2),d([c()],l.prototype,"_readingUnit",2),d([c()],l.prototype,"_readings",2),d([c()],l.prototype,"_consumesParts",2),d([c()],l.prototype,"_consumesQtyText",2),d([c()],l.prototype,"_partsLoadFailed",2),d([c()],l.prototype,"_availableTags",2),d([c()],l.prototype,"_responsibleUserId",2),d([c()],l.prototype,"_assigneePool",2),d([c()],l.prototype,"_rotationStrategy",2),d([c()],l.prototype,"_availableUsers",2),d([c()],l.prototype,"_checklistText",2),d([c()],l.prototype,"_phaseDefs",2),d([c()],l.prototype,"_phaseSeq",2),d([c()],l.prototype,"_requiredCompletion",2),d([c()],l.prototype,"_scheduleTime",2),d([c()],l.prototype,"_scheduleTimeOn",2),d([c()],l.prototype,"_actionService",2),d([c()],l.prototype,"_actionTargetEntity",2),d([c()],l.prototype,"_actionSkipAuto",2),d([c()],l.prototype,"_actionPresent",2),d([c()],l.prototype,"_actionData",2),d([c()],l.prototype,"_actionDataJsonFallback",2),d([c()],l.prototype,"_actionTesting",2),d([c()],l.prototype,"_actionTestResult",2),d([c()],l.prototype,"_actionTestError",2),d([c()],l.prototype,"_quickOn",2),d([c()],l.prototype,"_qcNotes",2),d([c()],l.prototype,"_qcCost",2),d([c()],l.prototype,"_qcDuration",2),d([c()],l.prototype,"_qcFeedback",2),d([c()],l.prototype,"_qcValuesOpen",2),d([c()],l.prototype,"_environmentalEntity",2),d([c()],l.prototype,"_environmentalAttribute",2),d([c()],l.prototype,"_adaptiveEnabled",2),d([c()],l.prototype,"_adaptiveAlpha",2),d([c()],l.prototype,"_adaptiveMin",2),d([c()],l.prototype,"_adaptiveMax",2),d([c()],l.prototype,"_adaptiveSeasonal",2),d([c()],l.prototype,"_adaptivePrediction",2),d([c()],l.prototype,"_conditionAttrOptions",2);var ve=l;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",ve);export{ve as MaintenanceTaskDialog,J as applyTypeFields,ue as typeFieldsFromConfig};
