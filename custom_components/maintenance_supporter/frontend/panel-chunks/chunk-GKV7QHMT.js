/*! maintenance_supporter frontend 2.117.0 */
import{f as _,g as v}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YL2MHJNE.js";var f={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},A=t=>(...i)=>({_$litDirective$:t,values:i}),a=class{constructor(i){}get _$AU(){return this._$AM._$AU}_$AT(i,e,s){this._$Ct=i,this._$AM=e,this._$Ci=s}_$AS(i,e){return this.update(i,e)}update(i,e){return this.render(...e)}};var{I:y}=v,u=t=>t;var T=t=>t.strings===void 0,m=()=>document.createComment(""),N=(t,i,e)=>{let s=t._$AA.parentNode,o=i===void 0?t._$AB:i._$AA;if(e===void 0){let r=s.insertBefore(m(),o),h=s.insertBefore(m(),o);e=new y(r,h,t,t.options)}else{let r=e._$AB.nextSibling,h=e._$AM,p=h!==t;if(p){let n;e._$AQ?.(t),e._$AM=t,e._$AP!==void 0&&(n=t._$AU)!==h._$AU&&e._$AP(n)}if(r!==o||p){let n=e._$AA;for(;n!==r;){let g=u(n).nextSibling;u(s).insertBefore(n,o),n=g}}}return e},R=(t,i,e=t)=>(t._$AI(i,e),t),M={},H=(t,i=M)=>t._$AH=i,B=t=>t._$AH,I=t=>{t._$AR(),t._$AA.remove()};var c=(t,i)=>{let e=t._$AN;if(e===void 0)return!1;for(let s of e)s._$AO?.(i,!1),c(s,i);return!0},l=t=>{let i,e;do{if((i=t._$AM)===void 0)break;e=i._$AN,e.delete(t),t=i}while(e?.size===0)},C=t=>{for(let i;i=t._$AM;t=i){let e=i._$AN;if(e===void 0)i._$AN=e=new Set;else if(e.has(t))break;e.add(t),x(i)}};function G(t){this._$AN!==void 0?(l(this),this._$AM=t,C(this)):this._$AM=t}function P(t,i=!1,e=0){let s=this._$AH,o=this._$AN;if(o!==void 0&&o.size!==0)if(i)if(Array.isArray(s))for(let r=e;r<s.length;r++)c(s[r],!1),l(s[r]);else s!=null&&(c(s,!1),l(s));else c(this,t)}var x=t=>{t.type==f.CHILD&&(t._$AP??=P,t._$AQ??=G)},$=class extends a{constructor(){super(...arguments),this._$AN=void 0}_$AT(i,e,s){super._$AT(i,e,s),C(this),this.isConnected=i._$AU}_$AO(i,e=!0){i!==this.isConnected&&(this.isConnected=i,i?this.reconnected?.():this.disconnected?.()),e&&(c(this,i),l(this))}setValue(i){if(T(this._$Ct))this._$Ct._$AI(i,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=i,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};var d=new WeakMap,j=A(class extends ${render(t){return _}update(t,[i]){let e=i!==this.G;return e&&this.G!==void 0&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=i,this.ht=t.options?.host,this.rt(this.ct=t.element)),_}rt(t){if(this.isConnected||(t=void 0),typeof this.G=="function"){let i=this.ht??globalThis,e=d.get(i);e===void 0&&(e=new WeakMap,d.set(i,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,t),t!==void 0&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return typeof this.G=="function"?d.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});export{f as a,A as b,a as c,T as d,N as e,R as f,H as g,B as h,I as i,j};
/*! Bundled license information:

lit-html/directive.js:
lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
lit-html/directives/ref.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
