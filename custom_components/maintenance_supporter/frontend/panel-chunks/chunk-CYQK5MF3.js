/*! maintenance_supporter frontend 2.120.0 */
import{b as v}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-O3YXUQZP.js";import{a as g}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-AZWAFZD2.js";import{e as f,f as _}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YIE7X74W.js";import{b as h,c as o}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-MO7B25OR.js";import{a as s,b as p,e as l,h as a,k as c,la as d,y as u,z as m}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-J3TUPMVF.js";var t=class extends c{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._options=null;this._inputValue="";this._check="";this._checked=!0;this._resolve=null;this._promptResolve=null;this._checkResolve=null}_show(e){this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel=e.inputLabel||"",this._inputType=e.inputType||"",this._options=e.options&&e.options.length?e.options:null,this._inputValue=e.inputValue||"",this._check=e.check||"",this._checked=!0,this._resolve=null,this._promptResolve=null,this._checkResolve=null,this._open=!0}confirm(e){return this._show(e),new Promise(i=>this._resolve=i)}confirmWithCheck(e){return this._show(e),new Promise(i=>this._checkResolve=i)}prompt(e){return this._show(e),new Promise(i=>this._promptResolve=i)}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._checkResolve?.({confirmed:!1,checked:!1}),this._checkResolve=null,this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._checkResolve?.({confirmed:!0,checked:this._checked}),this._checkResolve=null,this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return a;let e=u(this.hass);return l`
      <ha-dialog open .headerTitle=${f(this._title)} @closed=${this._cancel}>
        ${_(this._title)}
        <div class="content">
          ${this._message}
          ${this._check?g({cls:"confirm-check",checked:this._checked,onChange:i=>this._checked=i.target.checked},this._check):a}
          ${this._inputLabel?l`
            <!-- Native <input> rather than <ha-textfield>: HA loads
                 ha-textfield lazily for its own panels, so inside this custom
                 panel it can be unregistered and render with zero height —
                 the prompt then shows no field at all (caught live testing
                 the pause/replace prompts; same fix as complete-dialog). -->
            <label class="field">
              <span class="field-label">${this._inputLabel}</span>
              ${this._options?l`${v({cls:"field-input field-select",onChange:i=>this._inputValue=i.target.value},l`
                    ${this._options.map(i=>l`<option value=${i.value} ?selected=${i.value===this._inputValue}>${i.label}</option>`)}
                  `)}`:l`<input class="field-input"
                    type="${this._inputType||"text"}"
                    .value=${this._inputValue}
                    @input=${i=>this._inputValue=i.target.value} />`}
            </label>
          `:a}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._cancel}>
            ${m("cancel",e)}
          </ha-button>
          <ha-button
            class="${this._danger?"danger":""}"
            variant=${this._danger?"danger":"brand"}
            @click=${this._confirmAction}
          >
            ${this._confirmText}
          </ha-button>
        </div>
      </ha-dialog>
    `}};t.styles=[d,p`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    /* shared native-field scaffold from nativeFieldStyles; the prompt input
       follows the message text, hence the extra top margin here */
    .field { margin-top: 12px; }
    .confirm-check { display: flex; align-items: center; gap: 8px; cursor: pointer; }
    .content {
      padding: 8px 0;
      min-width: 280px;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    ha-textfield {
      display: block;
    }
    ha-button.danger {
      --mdc-theme-primary: var(--error-color, #f44336);
    }
  `],s([h({attribute:!1})],t.prototype,"hass",2),s([o()],t.prototype,"_open",2),s([o()],t.prototype,"_title",2),s([o()],t.prototype,"_message",2),s([o()],t.prototype,"_confirmText",2),s([o()],t.prototype,"_danger",2),s([o()],t.prototype,"_inputLabel",2),s([o()],t.prototype,"_inputType",2),s([o()],t.prototype,"_options",2),s([o()],t.prototype,"_inputValue",2),s([o()],t.prototype,"_check",2),s([o()],t.prototype,"_checked",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",t);var k="maintenance-confirm-dialog",x="data-ms-lovelace-confirm";function b(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function R(r){let n=b(),e=n.querySelector(`${k}[${x}]`);return e||(e=document.createElement(k),e.setAttribute(x,""),n.appendChild(e)),e.hass=r,e}function V(r,n){return R(r).confirm(n)}export{R as a,V as b};
