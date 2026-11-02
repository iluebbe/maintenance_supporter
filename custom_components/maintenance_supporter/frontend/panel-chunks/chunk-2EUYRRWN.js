/*! maintenance_supporter frontend 2.117.0 */
import{a as o,b as m,c as b,d as h,g as v,j as y}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-GKV7QHMT.js";import{d as _}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-K7VUGLO5.js";import{a as l,b as f,c as a,e as u,f as r,h as g,m as d,n as c}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YL2MHJNE.js";function R(e,t){let n=e?.states?.[t]?.attributes?.friendly_name;return typeof n=="string"&&n?n:t}function p(e){return e?Array.isArray(e.entity_ids)&&e.entity_ids.length>0?[...e.entity_ids]:e.entity_id?[e.entity_id]:[]:[]}function C(e){if(!(!e||e.type==="compound"))return p(e)[0]}function A(e,t){let n=C(t?.trigger_config),i=n?e?.states?.[n]?.attributes?.unit_of_measurement:void 0;return(typeof i=="string"?i:void 0)??t?.trigger_entity_info?.unit_of_measurement??""}function w(e){return e.type==="compound"?(e.conditions||[]).flatMap(t=>p(t).map(n=>({entityId:n,cond:t}))):p(e).map(t=>({entityId:t,cond:e}))}function k(e){if(!e)return!1;let t=e.type||"threshold";return t==="counter"||t==="state_change"}function I(e,t){return`${e}:${t?"counter":"level"}`}var T=m(class extends b{constructor(e){if(super(e),e.type!==o.PROPERTY&&e.type!==o.ATTRIBUTE&&e.type!==o.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!h(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===u||t===r)return t;let n=e.element,i=e.name;if(e.type===o.PROPERTY){if(t===n[i])return u}else if(e.type===o.BOOLEAN_ATTRIBUTE){if(!!t===n.hasAttribute(i))return u}else if(e.type===o.ATTRIBUTE&&n.getAttribute(i)===t+"")return u;return v(e),t}});var x="__ms_empty__",$=e=>e===""?x:e,s=class extends g{constructor(){super(...arguments);this.label="";this.value=void 0;this.disabled=!1;this.helper="";this._options=[];this._selected="";this._observer=null}connectedCallback(){super.connectedCallback(),this._read(),this._observer=new MutationObserver(()=>this._read()),this._observer.observe(this,{childList:!0,subtree:!0,characterData:!0,attributes:!0})}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect(),this._observer=null}_read(){let n=[...this.querySelectorAll("option")];this._options=n.map(i=>({value:$(i.value),label:(i.textContent??"").replace(/\s+/g," ").trim()})),this._selected=n.find(i=>i.hasAttribute("selected")||i.selected)?.value??n[0]?.value??""}_picked(n){n.stopPropagation(),this.value=n.detail.value===x?"":n.detail.value,this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}render(){return a`
      <ha-select
        .label=${this.label}
        .helper=${this.helper}
        .options=${this._options}
        .value=${$(this.value??this._selected)}
        .disabled=${this.disabled}
        @selected=${this._picked}
      ></ha-select>`}};s.styles=f`
    :host { display: block; }
    ha-select { display: block; width: 100%; }
  `,l([d()],s.prototype,"label",2),l([d()],s.prototype,"value",2),l([d({type:Boolean})],s.prototype,"disabled",2),l([d()],s.prototype,"helper",2),l([c()],s.prototype,"_options",2),l([c()],s.prototype,"_selected",2);customElements.get("ms-ha-select")||customElements.define("ms-ha-select",s);function O(){return _("ha-select")}function z(e,t){if(O())return a`<ms-ha-select class=${e.cls??r} .label=${e.label??""} .value=${e.value} .disabled=${!!e.disabled}
      @change=${e.onChange}>${t}</ms-ha-select>`;if(e.value===void 0)return a`<select class=${e.cls??r} id=${e.id??r} aria-label=${e.label??r} ?disabled=${!!e.disabled}
      @change=${e.onChange}>${t}</select>`;let n=e.value;return a`<select class=${e.cls??r} id=${e.id??r} aria-label=${e.label??r} ?disabled=${!!e.disabled}
    .value=${e.live?T(n):n} @change=${e.onChange}
    ${y(i=>{i instanceof HTMLSelectElement&&queueMicrotask(()=>{i.value!==n&&(i.value=n)})})}>${t}</select>`}function E(e,t){return e?.entities?.[t]?.platform==="maintenance_supporter"}function J(e){return Object.keys(e?.entities||{}).filter(t=>t.startsWith("todo.")&&E(e,t))}function Q(e,t){return[...new Set(t.filter(n=>n&&!E(e,n)))].slice(0,5)}export{R as a,p as b,C as c,A as d,w as e,k as f,I as g,O as h,z as i,E as j,J as k,Q as l};
/*! Bundled license information:

lit-html/directives/live.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
