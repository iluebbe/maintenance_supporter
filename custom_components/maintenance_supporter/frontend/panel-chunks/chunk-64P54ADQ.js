/*! maintenance_supporter frontend 2.109.0 */
import{a as l}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-S6Z4ON5Z.js";import{a as c}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-WOCYHFWF.js";import{g as a}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-4NUKLODY.js";var i={operatorWriteEnabled:!1,operatorIds:[]};function b(e,t=i){return e?e.is_admin?!0:t.operatorWriteEnabled&&t.operatorIds.includes(e.id):!1}var m=["buttons_compact","buttons","icons"];function f(e){let[t,s]=c.default_warning_days,n=e?.general?.default_warning_days,r=e?.general?.row_action_style;return{features:{...o.features,...e?.features??{}},defaultWarningDays:typeof n=="number"&&Number.isFinite(n)&&n>=t&&n<=s?n:o.defaultWarningDays,rowActionStyle:m.includes(r??"")?r:o.rowActionStyle,access:{operatorWriteEnabled:e?.operator_write_enabled===!0,operatorIds:Array.isArray(e?.admin_panel_user_ids)?e.admin_panel_user_ids.filter(p=>typeof p=="string"):[]},budget:e?.budget??null,rowActionNoticePending:e?.general?.row_action_notice_pending===!0,refsInLists:e?.general?.ref_numbers_in_lists===!0,objectsTableColumns:Array.isArray(e?.objects_table_columns)?e.objects_table_columns:void 0,partsCostMode:l(e?.budget?.parts_cost_mode)}}var o={features:{adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1},defaultWarningDays:7,rowActionStyle:"buttons_compact",access:i,budget:null,rowActionNoticePending:!1,refsInLists:!1,objectsTableColumns:void 0,partsCostMode:"purchase"};function u(){let e=window;return e.__msSettingsCache??={promise:null}}function S(e){let t=u();if(t.promise)return t.promise;let s=e.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(n=>f(n)).catch(()=>(t.promise===s&&(t.promise=null),o));return t.promise=s,s}function $(){u().promise=null}var _=class{constructor(){this._handle=null}schedule(t,s=4e3){this.clear(),this._handle=setTimeout(()=>{this._handle=null,t()},s)}clear(){this._handle!==null&&(clearTimeout(this._handle),this._handle=null)}get pending(){return this._handle!==null}};var{I:E}=a;var M=e=>e.strings===void 0;var g={},x=(e,t=g)=>e._$AH=t;var P={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},N=e=>(...t)=>({_$litDirective$:e,values:t}),d=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,s,n){this._$Ct=t,this._$AM=s,this._$Ci=n}_$AS(t,s){return this.update(t,s)}update(t,s){return this.render(...s)}};export{M as a,x as b,P as c,N as d,d as e,i as f,b as g,m as h,f as i,S as j,$ as k,_ as l};
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
