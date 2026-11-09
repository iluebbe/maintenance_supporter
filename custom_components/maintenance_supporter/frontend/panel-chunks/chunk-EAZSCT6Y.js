/*! maintenance_supporter frontend 2.120.0 */
import{a as n,b,c as v,f as m,i as f,m as $}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-KZBTLQ2G.js";import{d as g}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-3MRKFZSU.js";import{b as d,c as u}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BVOMQN6J.js";import{a,b as p,e as o,g as c,h as s,k as h}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-VGLEFN6D.js";var _=b(class extends v{constructor(e){if(super(e),e.type!==n.PROPERTY&&e.type!==n.ATTRIBUTE&&e.type!==n.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!m(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[l]){if(l===c||l===s)return l;let t=e.element,i=e.name;if(e.type===n.PROPERTY){if(l===t[i])return c}else if(e.type===n.BOOLEAN_ATTRIBUTE){if(!!l===t.hasAttribute(i))return c}else if(e.type===n.ATTRIBUTE&&t.getAttribute(i)===l+"")return c;return f(e),l}});var T="__ms_empty__",E=e=>e===""?T:e,r=class extends h{constructor(){super(...arguments);this.label="";this.value=void 0;this.disabled=!1;this.helper="";this._options=[];this._selected="";this._observer=null}connectedCallback(){super.connectedCallback(),this._read(),this._observer=new MutationObserver(()=>this._read()),this._observer.observe(this,{childList:!0,subtree:!0,characterData:!0,attributes:!0})}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect(),this._observer=null}_read(){let t=[...this.querySelectorAll("option")];this._options=t.map(i=>({value:E(i.value),label:(i.textContent??"").replace(/\s+/g," ").trim()})),this._selected=t.find(i=>i.hasAttribute("selected")||i.selected)?.value??t[0]?.value??""}_picked(t){t.stopPropagation(),this.value=t.detail.value===T?"":t.detail.value,this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}render(){return o`
      <ha-select
        .label=${this.label}
        .helper=${this.helper}
        .options=${this._options}
        .value=${E(this.value??this._selected)}
        .disabled=${this.disabled}
        @selected=${this._picked}
      ></ha-select>`}};r.styles=p`
    :host { display: block; }
    ha-select { display: block; width: 100%; }
  `,a([d()],r.prototype,"label",2),a([d()],r.prototype,"value",2),a([d({type:Boolean})],r.prototype,"disabled",2),a([d()],r.prototype,"helper",2),a([u()],r.prototype,"_options",2),a([u()],r.prototype,"_selected",2);customElements.get("ms-ha-select")||customElements.define("ms-ha-select",r);function y(){return g("ha-select")}function N(e,l){if(y())return o`<ms-ha-select class=${e.cls??s} .label=${e.label??""} .value=${e.value} .disabled=${!!e.disabled}
      @change=${e.onChange}>${l}</ms-ha-select>`;if(e.value===void 0)return o`<select class=${e.cls??s} id=${e.id??s} aria-label=${e.label??s} ?disabled=${!!e.disabled}
      @change=${e.onChange}>${l}</select>`;let t=e.value;return o`<select class=${e.cls??s} id=${e.id??s} aria-label=${e.label??s} ?disabled=${!!e.disabled}
    .value=${e.live?_(t):t} @change=${e.onChange}
    ${$(i=>{i instanceof HTMLSelectElement&&queueMicrotask(()=>{i.value!==t&&(i.value=t)})})}>${l}</select>`}export{y as a,N as b};
/*! Bundled license information:

lit-html/directives/live.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
