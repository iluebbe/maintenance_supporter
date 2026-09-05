/*! maintenance_supporter frontend 2.74.0 */
import{a as d,b as a,d as l,e as p,f as s,i as c}from"./chunk-2LELQZCV.js";import{a as r}from"./chunk-3YPUSKYO.js";function h(o,e){if(e)switch(o){case"date":return e.split("T")[0];case"time":return e.length===5?`${e}:00`:e;case"datetime":{let[i,n="00:00:00"]=e.split("T");return`${i} ${n.length===5?`${n}:00`:n}`}}}function u(o,e){if(typeof e!="string"||!e)return"";switch(o){case"date":return e.slice(0,10);case"time":return e.slice(0,5);case"datetime":{let[i,n="00:00:00"]=e.split(" ");return`${i}T${n.length===5?`${n}:00`:n}`}}}var t=class extends p{constructor(){super(...arguments);this.kind="date";this.label="";this.value="";this.clearable=!1;this.disabled=!1;this.required=!1;this.lang="en"}_selector(){switch(this.kind){case"date":return{date:{}};case"time":return{time:{no_second:!0}};case"datetime":return{datetime:{}}}}_onSelectorChange(i){i.stopPropagation(),this._emit(u(this.kind,i.detail?.value))}_clear(){this._emit("")}_emit(i){i!==this.value&&(this.value=i,this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:i}})))}render(){return a`
      <div class="field">
        ${this.label?a`<span class="label">${this.label}${this.required?a`<span class="req">*</span>`:l}</span>`:l}
        <div class="row">
          <ha-selector
            .hass=${this.hass}
            .selector=${this._selector()}
            .value=${h(this.kind,this.value)}
            .required=${this.required}
            .disabled=${this.disabled}
            @value-changed=${this._onSelectorChange}
          ></ha-selector>
          ${this.clearable&&this.value&&!this.disabled?a`<button type="button" class="clear" title=${c("clear",this.lang)} aria-label=${c("clear",this.lang)} @click=${this._clear}>
                <ha-icon icon="mdi:close"></ha-icon>
              </button>`:l}
        </div>
        ${this.helper?a`<span class="helper">${this.helper}</span>`:l}
      </div>
    `}};t.styles=d`
    :host { display: block; }
    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .label {
      font-size: 12px;
      color: var(--secondary-text-color, #888);
      font-weight: 500;
    }
    .req { color: var(--error-color, #f44336); margin-left: 2px; }
    .row {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    ha-selector {
      flex: 1;
      min-width: 0;
    }
    .clear {
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      --mdc-icon-size: 20px;
    }
    .clear:hover { background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08); }
    .clear:focus-visible { outline: 2px solid var(--primary-color); }
    .helper {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
  `,r([s({attribute:!1})],t.prototype,"hass",2),r([s()],t.prototype,"kind",2),r([s()],t.prototype,"label",2),r([s()],t.prototype,"value",2),r([s()],t.prototype,"helper",2),r([s({type:Boolean})],t.prototype,"clearable",2),r([s({type:Boolean})],t.prototype,"disabled",2),r([s({type:Boolean})],t.prototype,"required",2),r([s()],t.prototype,"lang",2);customElements.get("ms-date-field")||customElements.define("ms-date-field",t);
