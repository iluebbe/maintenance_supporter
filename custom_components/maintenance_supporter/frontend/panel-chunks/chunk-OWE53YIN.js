/*! maintenance_supporter frontend 2.119.0 */
import{f as _,g as v}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6NL3YWME.js";var f={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},A=t=>(...e)=>({_$litDirective$:t,values:e}),a=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,i,s){this._$Ct=e,this._$AM=i,this._$Ci=s}_$AS(e,i){return this.update(e,i)}update(e,i){return this.render(...i)}};var{I:y}=v,u=t=>t;var N=(t,e)=>e===void 0?t?._$litType$!==void 0:t?._$litType$===e,R=t=>t?._$litType$?.h!=null;var T=t=>t.strings===void 0,m=()=>document.createComment(""),H=(t,e,i)=>{let s=t._$AA.parentNode,o=e===void 0?t._$AB:e._$AA;if(i===void 0){let r=s.insertBefore(m(),o),h=s.insertBefore(m(),o);i=new y(r,h,t,t.options)}else{let r=i._$AB.nextSibling,h=i._$AM,p=h!==t;if(p){let n;i._$AQ?.(t),i._$AM=t,i._$AP!==void 0&&(n=t._$AU)!==h._$AU&&i._$AP(n)}if(r!==o||p){let n=i._$AA;for(;n!==r;){let g=u(n).nextSibling;u(s).insertBefore(n,o),n=g}}}return i},B=(t,e,i=t)=>(t._$AI(e,i),t),M={},I=(t,e=M)=>t._$AH=e,b=t=>t._$AH,L=t=>{t._$AR(),t._$AA.remove()},S=t=>{t._$AR()};var c=(t,e)=>{let i=t._$AN;if(i===void 0)return!1;for(let s of i)s._$AO?.(e,!1),c(s,e);return!0},l=t=>{let e,i;do{if((e=t._$AM)===void 0)break;i=e._$AN,i.delete(t),t=e}while(i?.size===0)},C=t=>{for(let e;e=t._$AM;t=e){let i=e._$AN;if(i===void 0)e._$AN=i=new Set;else if(i.has(t))break;i.add(t),x(e)}};function G(t){this._$AN!==void 0?(l(this),this._$AM=t,C(this)):this._$AM=t}function P(t,e=!1,i=0){let s=this._$AH,o=this._$AN;if(o!==void 0&&o.size!==0)if(e)if(Array.isArray(s))for(let r=i;r<s.length;r++)c(s[r],!1),l(s[r]);else s!=null&&(c(s,!1),l(s));else c(this,t)}var x=t=>{t.type==f.CHILD&&(t._$AP??=P,t._$AQ??=G)},$=class extends a{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,i,s){super._$AT(e,i,s),C(this),this.isConnected=e._$AU}_$AO(e,i=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),i&&(c(this,e),l(this))}setValue(e){if(T(this._$Ct))this._$Ct._$AI(e,this);else{let i=[...this._$Ct._$AH];i[this._$Ci]=e,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}};var d=new WeakMap,W=A(class extends ${render(t){return _}update(t,[e]){let i=e!==this.G;return i&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=e,this.ht=t.options?.host,this.rt(this.ct=t.element)),_}rt(t){if(this.G!==void 0)if(this.isConnected||(t=void 0),typeof this.G=="function"){let e=this.ht??globalThis,i=d.get(e);i===void 0&&(i=new WeakMap,d.set(e,i)),i.get(this.G)!==void 0&&this.G.call(this.ht,void 0),i.set(this.G,t),t!==void 0&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return typeof this.G=="function"?d.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});export{f as a,A as b,a as c,N as d,R as e,T as f,H as g,B as h,I as i,b as j,L as k,S as l,W as m};
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
