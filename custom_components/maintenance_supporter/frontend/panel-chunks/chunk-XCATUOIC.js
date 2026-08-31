/*! maintenance_supporter frontend 2.70.0 */
import{a as r,b as l,c as i,f as o,h as n,l as t}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-OCUESYOZ.js";var e=class extends n{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1;this.multiline=!1;this.rows=3}_onInput(s){let a=s.target.value;this.value=a,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:a}}))}render(){return i`
      <label class="field">
        ${this.label?i`<span class="label">${this.label}${this.required?i`<span class="req">*</span>`:o}</span>`:o}
        ${this.multiline?i`
        <textarea
          .value=${this.value??""}
          rows=${this.rows}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          @input=${this._onInput}
          @change=${this._onInput}
        ></textarea>`:i`
        <input
          .value=${this.value??""}
          .type=${this.type}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          step=${this.step??o}
          min=${this.min??o}
          max=${this.max??o}
          pattern=${this.pattern??o}
          @input=${this._onInput}
          @change=${this._onInput}
        />`}
        ${this.helper?i`<span class="helper">${this.helper}</span>`:o}
      </label>
    `}};e.styles=l`
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
    input {
      padding: 8px 10px;
      font-size: 14px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
      border-radius: 6px;
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
      outline: none;
    }
    input:focus {
      border-color: var(--primary-color);
    }
    input:disabled { opacity: 0.5; cursor: not-allowed; }
    textarea {
      padding: 8px 10px;
      font-size: 14px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
      border-radius: 6px;
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
      outline: none;
      resize: vertical;
    }
    textarea:focus { border-color: var(--primary-color); }
    textarea:disabled { opacity: 0.5; cursor: not-allowed; }
    .helper {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
  `,r([t()],e.prototype,"label",2),r([t()],e.prototype,"value",2),r([t()],e.prototype,"placeholder",2),r([t()],e.prototype,"type",2),r([t({type:Boolean})],e.prototype,"required",2),r([t({type:Boolean})],e.prototype,"disabled",2),r([t()],e.prototype,"step",2),r([t()],e.prototype,"min",2),r([t()],e.prototype,"max",2),r([t()],e.prototype,"pattern",2),r([t()],e.prototype,"helper",2),r([t({type:Boolean})],e.prototype,"multiline",2),r([t({type:Number})],e.prototype,"rows",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",e);
