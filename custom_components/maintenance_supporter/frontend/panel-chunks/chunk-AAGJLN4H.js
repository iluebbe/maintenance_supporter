/*! maintenance_supporter frontend 2.115.0 */
import{a as c}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-EWHS2RUN.js";import{a as _}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ZG22S5RE.js";import{g as l}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-DQ4IGWWK.js";var r={operatorWriteEnabled:!1,operatorIds:[]};function A(e,t=r){return e?e.is_admin?!0:t.operatorWriteEnabled&&t.operatorIds.includes(e.id):!1}var m=["buttons_compact","buttons","icons"];function f(e){let[t,s]=_.default_warning_days,n=e?.general?.default_warning_days,a=e?.general?.row_action_style;return{features:{...i.features,...e?.features??{}},defaultWarningDays:typeof n=="number"&&Number.isFinite(n)&&n>=t&&n<=s?n:i.defaultWarningDays,rowActionStyle:m.includes(a??"")?a:i.rowActionStyle,access:{operatorWriteEnabled:e?.operator_write_enabled===!0,operatorIds:Array.isArray(e?.admin_panel_user_ids)?e.admin_panel_user_ids.filter(o=>typeof o=="string"):[]},budget:e?.budget??null,rowActionNoticePending:e?.general?.row_action_notice_pending===!0,refsInLists:e?.general?.ref_numbers_in_lists===!0,objectsTableColumns:Array.isArray(e?.objects_table_columns)?e.objects_table_columns:void 0,partsCostMode:c(e?.budget?.parts_cost_mode),mirrorTodoDefault:Array.isArray(e?.general?.mirror_todo_default_entities)?e.general.mirror_todo_default_entities.filter(o=>typeof o=="string"&&o!==""):[]}}var i={features:{adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1},defaultWarningDays:7,rowActionStyle:"buttons_compact",access:r,budget:null,rowActionNoticePending:!1,refsInLists:!1,objectsTableColumns:void 0,partsCostMode:"purchase",mirrorTodoDefault:[]};function u(){let e=window;return e.__msSettingsCache??={promise:null}}function S(e){let t=u();if(t.promise)return t.promise;let s=e.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(n=>f(n)).catch(()=>(t.promise===s&&(t.promise=null),i));return t.promise=s,s}function $(){u().promise=null}var d=class{constructor(){this._handle=null}schedule(t,s=4e3){this.clear(),this._handle=setTimeout(()=>{this._handle=null,t()},s)}clear(){this._handle!==null&&(clearTimeout(this._handle),this._handle=null)}get pending(){return this._handle!==null}};var{I:E}=l;var M=e=>e.strings===void 0;var g={},I=(e,t=g)=>e._$AH=t;var x={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},N=e=>(...t)=>({_$litDirective$:e,values:t}),p=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,s,n){this._$Ct=t,this._$AM=s,this._$Ci=n}_$AS(t,s){return this.update(t,s)}update(t,s){return this.render(...s)}};export{M as a,I as b,x as c,N as d,p as e,r as f,A as g,m as h,f as i,S as j,$ as k,d as l};
/*! Bundled license information:

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
