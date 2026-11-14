/*! maintenance_supporter frontend 2.121.0 */
import{Q as d,b as p,c as m,d as l}from"./chunk-SMVUWZLJ.js";var h={attribute:!0,type:String,converter:p,reflect:!1,hasChanged:m},y=(t=h,e,o)=>{let{kind:a,metadata:i}=o,n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),a==="setter"&&((t=Object.create(t)).wrapped=!0),n.set(o.name,t),a==="accessor"){let{name:s}=o;return{set(r){let u=e.get.call(this);e.set.call(this,r),this.requestUpdate(s,u,t,!0,r)},init(r){return r!==void 0&&this.C(s,void 0,t,r),r}}}if(a==="setter"){let{name:s}=o;return function(r){let u=this[s];e.call(this,r),this.requestUpdate(s,u,t,!0,r)}}throw Error("Unsupported decorator location: "+a)};function f(t){return(e,o)=>typeof o=="object"?y(t,e,o):((a,i,n)=>{let s=i.hasOwnProperty(n);return i.constructor.createProperty(n,a),s?Object.getOwnPropertyDescriptor(i,n):void 0})(t,e,o)}function q(t){return f({...t,state:!0,attribute:!1})}function L(t,e){return d("ha-alert")?l`<ha-alert alert-type=${t} class="notice notice-${t}">${e}</ha-alert>`:l`<div class=${t==="warning"?"error warning":"error"}>${e}</div>`}export{f as a,q as b,L as c};
/*! Bundled license information:

@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
