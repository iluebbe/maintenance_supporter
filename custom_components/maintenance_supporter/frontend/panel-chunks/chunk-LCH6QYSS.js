/*! maintenance_supporter frontend 2.121.0 */
import{c as l,d as p}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-74ISRDIW.js";var h=t=>(r,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(t,r)}):customElements.define(t,r)};var m={attribute:!0,type:String,converter:l,reflect:!1,hasChanged:p},f=(t=m,r,e)=>{let{kind:a,metadata:i}=e,n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),a==="setter"&&((t=Object.create(t)).wrapped=!0),n.set(e.name,t),a==="accessor"){let{name:s}=e;return{set(o){let u=r.get.call(this);r.set.call(this,o),this.requestUpdate(s,u,t,!0,o)},init(o){return o!==void 0&&this.C(s,void 0,t,o),o}}}if(a==="setter"){let{name:s}=e;return function(o){let u=this[s];r.call(this,o),this.requestUpdate(s,u,t,!0,o)}}throw Error("Unsupported decorator location: "+a)};function d(t){return(r,e)=>typeof e=="object"?f(t,r,e):((a,i,n)=>{let s=i.hasOwnProperty(n);return i.constructor.createProperty(n,a),s?Object.getOwnPropertyDescriptor(i,n):void 0})(t,r,e)}function q(t){return d({...t,state:!0,attribute:!1})}export{h as a,d as b,q as c};
/*! Bundled license information:

@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
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
