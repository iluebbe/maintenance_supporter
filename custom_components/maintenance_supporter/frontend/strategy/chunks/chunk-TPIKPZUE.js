/*! maintenance_supporter frontend 2.121.0 */
import{Q as p,d as r,g as n,h as A}from"./chunk-SMVUWZLJ.js";function y(t,e){if(p("ha-checkbox")){let i=r`<ha-checkbox .checked=${t.checked} .disabled=${!!t.disabled} @change=${t.onChange}>${e}</ha-checkbox>`;return t.cls?r`<span class=${t.cls}>${i}</span>`:i}let s=r`<input type="checkbox" class=${t.inputCls??n} .checked=${t.checked} ?disabled=${!!t.disabled} @change=${t.onChange} />`;return t.boxAfter?r`<label class=${t.cls??n}>${e}${s}</label>`:r`<label class=${t.cls??n}>${s}${e}</label>`}var{I:G}=A;var f=t=>t.strings===void 0;var m={},P=(t,e=m)=>t._$AH=e;var u={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},$=t=>(...e)=>({_$litDirective$:t,values:e}),a=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,s,i){this._$Ct=e,this._$AM=s,this._$Ci=i}_$AS(e,s){return this.update(e,s)}update(e,s){return this.render(...s)}};var o=(t,e)=>{let s=t._$AN;if(s===void 0)return!1;for(let i of s)i._$AO?.(e,!1),o(i,e);return!0},l=t=>{let e,s;do{if((e=t._$AM)===void 0)break;s=e._$AN,s.delete(t),t=e}while(s?.size===0)},v=t=>{for(let e;e=t._$AM;t=e){let s=e._$AN;if(s===void 0)e._$AN=s=new Set;else if(s.has(t))break;s.add(t),C(e)}};function T(t){this._$AN!==void 0?(l(this),this._$AM=t,v(this)):this._$AM=t}function g(t,e=!1,s=0){let i=this._$AH,_=this._$AN;if(_!==void 0&&_.size!==0)if(e)if(Array.isArray(i))for(let c=s;c<i.length;c++)o(i[c],!1),l(i[c]);else i!=null&&(o(i,!1),l(i));else o(this,t)}var C=t=>{t.type==u.CHILD&&(t._$AP??=g,t._$AQ??=T)},h=class extends a{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,s,i){super._$AT(e,s,i),v(this),this.isConnected=e._$AU}_$AO(e,s=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),s&&(o(this,e),l(this))}setValue(e){if(f(this._$Ct))this._$Ct._$AI(e,this);else{let s=[...this._$Ct._$AH];s[this._$Ci]=e,this._$Ct._$AI(s,this,0)}}disconnected(){}reconnected(){}};var d=new WeakMap,O=$(class extends h{render(t){return n}update(t,[e]){let s=e!==this.G;return s&&this.rt(void 0),(s||this.lt!==this.ct)&&(this.G=e,this.ht=t.options?.host,this.rt(this.ct=t.element)),n}rt(t){if(this.G!==void 0)if(this.isConnected||(t=void 0),typeof this.G=="function"){let e=this.ht??globalThis,s=d.get(e);s===void 0&&(s=new WeakMap,d.set(e,s)),s.get(this.G)!==void 0&&this.G.call(this.ht,void 0),s.set(this.G,t),t!==void 0&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return typeof this.G=="function"?d.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});export{u as a,$ as b,a as c,f as d,P as e,O as f,y as g};
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
