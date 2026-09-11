/*! maintenance_supporter frontend 2.83.0 */
import{a,b as y,c as s,f as l,h as g,l as o,m as f,q as d,z as m}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-WQO7M6UD.js";function $(n){let t=m("2001-02-03",n).match(/\d+/g)||[],e=v=>t.findIndex(_=>Number(_)===v),h=e(2001),c=e(2),u=e(3);return h===0?"YMD":c>=0&&u>=0&&c<u?"MDY":"DMY"}function p(n,i,t){if(n<1e3||n>9999||i<1||i>12||t<1||t>31)return null;let e=new Date(n,i-1,t);return e.getFullYear()!==n||e.getMonth()!==i-1||e.getDate()!==t?null:`${n}-${String(i).padStart(2,"0")}-${String(t).padStart(2,"0")}`}function b(n,i){let t=n.trim(),e;if(e=t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))return p(+e[1],+e[2],+e[3]);if(e=t.match(/^(\d{4})$/))return p(+e[1],1,1);if(e=t.match(/^(\d{1,2})[./](\d{4})$/))return p(+e[2],+e[1],1);if(e=t.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/))return p(+e[3],+e[2],+e[1]);if(e=t.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)){let h=+e[1],c=+e[2],u=+e[3];return $(i)==="MDY"?p(u,h,c):p(u,c,h)}return null}function x(n,i){if(i)switch(n){case"date":return i.split("T")[0];case"time":return i.length===5?`${i}:00`:i;case"datetime":{let[t,e="00:00:00"]=i.split("T");return`${t} ${e.length===5?`${e}:00`:e}`}}}function k(n,i){if(typeof i!="string"||!i)return"";switch(n){case"date":return i.slice(0,10);case"time":return i.slice(0,5);case"datetime":{let[t,e="00:00:00"]=i.split(" ");return`${t}T${e.length===5?`${e}:00`:e}`}}}var r=class extends g{constructor(){super(...arguments);this.kind="date";this.label="";this.value="";this.clearable=!1;this.disabled=!1;this.required=!1;this.lang="en";this._typing=!1;this._typed="";this._typedInvalid=!1}_startTyping(){this._typed=this.value,this._typedInvalid=!1,this._typing=!0,this.updateComplete.then(()=>this.shadowRoot?.querySelector("input.typed")?.focus())}_commitTyped(){if(!this._typed.trim()){this._typing=!1;return}let t=b(this._typed,this.lang);if(!t){this._typedInvalid=!0;return}this._typing=!1,this._typedInvalid=!1,this._emit(t)}_onTypedKey(t){t.key==="Enter"?(t.preventDefault(),this._commitTyped()):t.key==="Escape"&&(t.preventDefault(),this._typing=!1,this._typedInvalid=!1)}_selector(){switch(this.kind){case"date":return{date:{}};case"time":return{time:{no_second:!0}};case"datetime":return{datetime:{}}}}_onSelectorChange(t){t.stopPropagation(),this._emit(k(this.kind,t.detail?.value))}_clear(){this._emit("")}_emit(t){t!==this.value&&(this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:t}})))}render(){return s`
      <div class="field">
        ${this.label?s`<span class="label">${this.label}${this.required?s`<span class="req">*</span>`:l}</span>`:l}
        <div class="row">
          ${this._typing?s`<input class="typed" type="text" inputmode="numeric" autocomplete="off"
                .value=${this._typed}
                placeholder=${m("1978-03-15",this.lang)}
                aria-invalid=${this._typedInvalid?"true":"false"}
                @input=${t=>{this._typed=t.target.value,this._typedInvalid=!1}}
                @keydown=${this._onTypedKey}
                @blur=${this._commitTyped} />`:s`<ha-selector
                .hass=${this.hass}
                .selector=${this._selector()}
                .value=${x(this.kind,this.value)}
                .required=${this.required}
                .disabled=${this.disabled}
                @value-changed=${this._onSelectorChange}
              ></ha-selector>`}
          ${this.kind==="date"&&!this.disabled&&!this._typing?s`<button type="button" class="type-toggle" title=${d("date_type_toggle",this.lang)} aria-label=${d("date_type_toggle",this.lang)} @click=${this._startTyping}>
                <ha-icon icon="mdi:keyboard-outline"></ha-icon>
              </button>`:l}
          ${this.clearable&&this.value&&!this.disabled&&!this._typing?s`<button type="button" class="clear" title=${d("clear",this.lang)} aria-label=${d("clear",this.lang)} @click=${this._clear}>
                <ha-icon icon="mdi:close"></ha-icon>
              </button>`:l}
        </div>
        ${this._typedInvalid?s`<span class="helper invalid">${d("date_type_invalid",this.lang)}</span>`:this.helper?s`<span class="helper">${this.helper}</span>`:l}
      </div>
    `}};r.styles=y`
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
    .clear, .type-toggle {
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
    .clear:hover, .type-toggle:hover { background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08); }
    .clear:focus-visible, .type-toggle:focus-visible { outline: 2px solid var(--primary-color); }
    .helper {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
    .helper.invalid { color: var(--error-color, #f44336); font-style: normal; }
    input.typed {
      flex: 1;
      min-width: 0;
      height: 40px;
      box-sizing: border-box;
      padding: 0 12px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font: inherit;
    }
    input.typed[aria-invalid="true"] { border-color: var(--error-color, #f44336); }
    input.typed:focus { outline: 2px solid var(--primary-color); outline-offset: -1px; }
  `,a([o({attribute:!1})],r.prototype,"hass",2),a([o()],r.prototype,"kind",2),a([o()],r.prototype,"label",2),a([o()],r.prototype,"value",2),a([o()],r.prototype,"helper",2),a([o({type:Boolean})],r.prototype,"clearable",2),a([o({type:Boolean})],r.prototype,"disabled",2),a([o({type:Boolean})],r.prototype,"required",2),a([o()],r.prototype,"lang",2),a([f()],r.prototype,"_typing",2),a([f()],r.prototype,"_typed",2),a([f()],r.prototype,"_typedInvalid",2);customElements.get("ms-date-field")||customElements.define("ms-date-field",r);
