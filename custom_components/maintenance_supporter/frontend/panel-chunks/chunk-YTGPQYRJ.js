/*! maintenance_supporter frontend 2.118.0 */
import{d as p}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ENASQ47N.js";import{a as t,b as s,c as r,f as a,i as n,n as i}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-3VTQLIPE.js";var e=class extends n{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1;this.multiline=!1;this.rows=3}_onInput(l){let o=l.target.value;this.value=o,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:o}}))}_onHaInput(l){l.stopPropagation(),this.value=l.target.value??"",this.dispatchEvent(new CustomEvent(l.type==="change"?"change":"input",{bubbles:!0,composed:!0,detail:{value:this.value}}))}render(){return!this.multiline&&p("ha-input")?r`
        <ha-input class="ha-field"
          .label=${this.label}
          .value=${this.value??""}
          .type=${this.type}
          .placeholder=${this.placeholder}
          .hint=${this.helper??""}
          .required=${this.required}
          .disabled=${this.disabled}
          .min=${this.min}
          .max=${this.max}
          .step=${this.step}
          .pattern=${this.pattern}
          @input=${this._onHaInput}
          @change=${this._onHaInput}
        ></ha-input>`:r`
      <label class="field">
        ${this.label?r`<span class="label">${this.label}${this.required?r`<span class="req">*</span>`:a}</span>`:a}
        ${this.multiline?r`
        <textarea
          .value=${this.value??""}
          rows=${this.rows}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          @input=${this._onInput}
          @change=${this._onInput}
        ></textarea>`:r`
        <input
          .value=${this.value??""}
          .type=${this.type}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          step=${this.step??a}
          min=${this.min??a}
          max=${this.max??a}
          pattern=${this.pattern??a}
          @input=${this._onInput}
          @change=${this._onInput}
        />`}
        ${this.helper?r`<span class="helper">${this.helper}</span>`:a}
      </label>
    `}};e.styles=s`
    :host { display: block; }
    .ha-field { display: block; width: 100%; }
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
      border-radius: var(--ms-radius-6, 6px);
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
      border-radius: var(--ms-radius-6, 6px);
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
      outline: none;
      resize: vertical;
    }
    textarea:focus { border-color: var(--primary-color); }
    textarea:disabled { opacity: 0.5; cursor: not-allowed; }
    /* The dialogs' .field-help: one help-text style (#216). */
    .helper {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
  `,t([i()],e.prototype,"label",2),t([i()],e.prototype,"value",2),t([i()],e.prototype,"placeholder",2),t([i()],e.prototype,"type",2),t([i({type:Boolean})],e.prototype,"required",2),t([i({type:Boolean})],e.prototype,"disabled",2),t([i()],e.prototype,"step",2),t([i()],e.prototype,"min",2),t([i()],e.prototype,"max",2),t([i()],e.prototype,"pattern",2),t([i()],e.prototype,"helper",2),t([i({type:Boolean})],e.prototype,"multiline",2),t([i({type:Number})],e.prototype,"rows",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",e);
