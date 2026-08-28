/*! maintenance_supporter frontend 2.66.0 */
import{a as t,b as a,c as i,f as l,g as p,k as r}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-5KIW2T3H.js";var e=class extends p{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1}_onInput(n){let o=n.target.value;this.value=o,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:o}}))}render(){return i`
      <label class="field">
        ${this.label?i`<span class="label">${this.label}${this.required?i`<span class="req">*</span>`:l}</span>`:l}
        <input
          .value=${this.value??""}
          .type=${this.type}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          step=${this.step??l}
          min=${this.min??l}
          max=${this.max??l}
          pattern=${this.pattern??l}
          @input=${this._onInput}
          @change=${this._onInput}
        />
        ${this.helper?i`<span class="helper">${this.helper}</span>`:l}
      </label>
    `}};e.styles=a`
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
    .helper {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
  `,t([r()],e.prototype,"label",2),t([r()],e.prototype,"value",2),t([r()],e.prototype,"placeholder",2),t([r()],e.prototype,"type",2),t([r({type:Boolean})],e.prototype,"required",2),t([r({type:Boolean})],e.prototype,"disabled",2),t([r()],e.prototype,"step",2),t([r()],e.prototype,"min",2),t([r()],e.prototype,"max",2),t([r()],e.prototype,"pattern",2),t([r()],e.prototype,"helper",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",e);
