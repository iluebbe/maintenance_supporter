/*! maintenance_supporter frontend 2.116.0 */
import{a,b as m,c as g,d as b,g as h,j as y}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-7UMMN4NW.js";import{d as v}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-NHZEKRKY.js";import{a as l,b as p,c as o,e as u,f as r,h as f,m as d,n as c}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YI3BZIUB.js";function A(e,t){let n=e?.states?.[t]?.attributes?.friendly_name;return typeof n=="string"&&n?n:t}function x(e){return e?Array.isArray(e.entity_ids)&&e.entity_ids.length>0?[...e.entity_ids]:e.entity_id?[e.entity_id]:[]:[]}function C(e){if(!(!e||e.type==="compound"))return x(e)[0]}function R(e){if(!e)return!1;let t=e.type||"threshold";return t==="counter"||t==="state_change"}function k(e,t){return`${e}:${t?"counter":"level"}`}var _=m(class extends g{constructor(e){if(super(e),e.type!==a.PROPERTY&&e.type!==a.ATTRIBUTE&&e.type!==a.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!b(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===u||t===r)return t;let n=e.element,i=e.name;if(e.type===a.PROPERTY){if(t===n[i])return u}else if(e.type===a.BOOLEAN_ATTRIBUTE){if(!!t===n.hasAttribute(i))return u}else if(e.type===a.ATTRIBUTE&&n.getAttribute(i)===t+"")return u;return h(e),t}});var $="__ms_empty__",T=e=>e===""?$:e,s=class extends f{constructor(){super(...arguments);this.label="";this.value=void 0;this.disabled=!1;this.helper="";this._options=[];this._selected="";this._observer=null}connectedCallback(){super.connectedCallback(),this._read(),this._observer=new MutationObserver(()=>this._read()),this._observer.observe(this,{childList:!0,subtree:!0,characterData:!0,attributes:!0})}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect(),this._observer=null}_read(){let n=[...this.querySelectorAll("option")];this._options=n.map(i=>({value:T(i.value),label:(i.textContent??"").replace(/\s+/g," ").trim()})),this._selected=n.find(i=>i.hasAttribute("selected")||i.selected)?.value??n[0]?.value??""}_picked(n){n.stopPropagation(),this.value=n.detail.value===$?"":n.detail.value,this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}render(){return o`
      <ha-select
        .label=${this.label}
        .helper=${this.helper}
        .options=${this._options}
        .value=${T(this.value??this._selected)}
        .disabled=${this.disabled}
        @selected=${this._picked}
      ></ha-select>`}};s.styles=p`
    :host { display: block; }
    ha-select { display: block; width: 100%; }
  `,l([d()],s.prototype,"label",2),l([d()],s.prototype,"value",2),l([d({type:Boolean})],s.prototype,"disabled",2),l([d()],s.prototype,"helper",2),l([c()],s.prototype,"_options",2),l([c()],s.prototype,"_selected",2);customElements.get("ms-ha-select")||customElements.define("ms-ha-select",s);function O(){return v("ha-select")}function M(e,t){if(O())return o`<ms-ha-select class=${e.cls??r} .label=${e.label??""} .value=${e.value} .disabled=${!!e.disabled}
      @change=${e.onChange}>${t}</ms-ha-select>`;if(e.value===void 0)return o`<select class=${e.cls??r} id=${e.id??r} aria-label=${e.label??r} ?disabled=${!!e.disabled}
      @change=${e.onChange}>${t}</select>`;let n=e.value;return o`<select class=${e.cls??r} id=${e.id??r} aria-label=${e.label??r} ?disabled=${!!e.disabled}
    .value=${e.live?_(n):n} @change=${e.onChange}
    ${y(i=>{i instanceof HTMLSelectElement&&queueMicrotask(()=>{i.value!==n&&(i.value=n)})})}>${t}</select>`}function E(e,t){return e?.entities?.[t]?.platform==="maintenance_supporter"}function z(e){return Object.keys(e?.entities||{}).filter(t=>t.startsWith("todo.")&&E(e,t))}function G(e,t){return[...new Set(t.filter(n=>n&&!E(e,n)))].slice(0,5)}export{A as a,x as b,C as c,R as d,k as e,O as f,M as g,E as h,z as i,G as j};
/*! Bundled license information:

lit-html/directives/live.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
