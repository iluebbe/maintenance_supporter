/*! maintenance_supporter frontend 2.120.0 */
import{h as a,i as A}from"/maintenance_supporter_cardfiles/card-chunks/chunk-2JUL7K7P.js";var{I:g}=A;var d=e=>e.strings===void 0;var f={},y=(e,t=f)=>e._$AH=t;var p={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},l=e=>(...t)=>({_$litDirective$:e,values:t}),n=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,i,s){this._$Ct=t,this._$AM=i,this._$Ci=s}_$AS(t,i){return this.update(t,i)}update(t,i){return this.render(...i)}};var r=(e,t)=>{let i=e._$AN;if(i===void 0)return!1;for(let s of i)s._$AO?.(t,!1),r(s,t);return!0},c=e=>{let t,i;do{if((t=e._$AM)===void 0)break;i=t._$AN,i.delete(e),e=t}while(i?.size===0)},v=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),T(t)}};function u(e){this._$AN!==void 0?(c(this),this._$AM=e,v(this)):this._$AM=e}function m(e,t=!1,i=0){let s=this._$AH,_=this._$AN;if(_!==void 0&&_.size!==0)if(t)if(Array.isArray(s))for(let o=i;o<s.length;o++)r(s[o],!1),c(s[o]);else s!=null&&(r(s,!1),c(s));else r(this,e)}var T=e=>{e.type==p.CHILD&&(e._$AP??=m,e._$AQ??=u)},h=class extends n{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,s){super._$AT(t,i,s),v(this),this.isConnected=t._$AU}_$AO(t,i=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),i&&(r(this,t),c(this))}setValue(t){if(d(this._$Ct))this._$Ct._$AI(t,this);else{let i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}};var $=new WeakMap,B=l(class extends h{render(e){return a}update(e,[t]){let i=t!==this.G;return i&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),a}rt(e){if(this.G!==void 0)if(this.isConnected||(e=void 0),typeof this.G=="function"){let t=this.ht??globalThis,i=$.get(t);i===void 0&&(i=new WeakMap,$.set(t,i)),i.get(this.G)!==void 0&&this.G.call(this.ht,void 0),i.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G=="function"?$.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});export{p as a,l as b,n as c,d,y as e,B as f};
/*! Bundled license information:

lit-html/directive-helpers.js:
lit-html/directives/ref.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive.js:
lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
