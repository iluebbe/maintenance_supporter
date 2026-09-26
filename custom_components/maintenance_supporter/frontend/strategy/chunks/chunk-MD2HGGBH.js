/*! maintenance_supporter frontend 2.92.0 */
import{a as p,b as n,d as o,e as u,f as h,g as l,i as m,k as c,z as d}from"./chunk-GGBBPELB.js";import{a as s}from"./chunk-5WR6EMQC.js";var i=class extends u{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._options=null;this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel="",this._inputType="",this._options=null,this._inputValue="",this._open=!0,new Promise(e=>{this._resolve=e,this._promptResolve=null})}prompt(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel=t.inputLabel||"",this._inputType=t.inputType||"text",this._options=t.options&&t.options.length?t.options:null,this._inputValue=t.inputValue||"",this._open=!0,new Promise(e=>{this._promptResolve=e,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return o;let t=c(this.hass);return n`
      <ha-dialog open @closed=${this._cancel}>
        <div class="dialog-title">${this._title}</div>
        <div class="content">
          ${this._message}
          ${this._inputLabel?n`
            <!-- Native <input> rather than <ha-textfield>: HA loads
                 ha-textfield lazily for its own panels, so inside this custom
                 panel it can be unregistered and render with zero height —
                 the prompt then shows no field at all (caught live testing
                 the pause/replace prompts; same fix as complete-dialog). -->
            <label class="field">
              <span class="field-label">${this._inputLabel}</span>
              ${this._options?n`<select class="field-input field-select"
                    @change=${e=>this._inputValue=e.target.value}>
                    ${this._options.map(e=>n`<option value=${e.value} ?selected=${e.value===this._inputValue}>${e.label}</option>`)}
                  </select>`:n`<input class="field-input"
                    type="${this._inputType||"text"}"
                    .value=${this._inputValue}
                    @input=${e=>this._inputValue=e.target.value} />`}
            </label>
          `:o}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._cancel}>
            ${m("cancel",t)}
          </ha-button>
          <ha-button
            class="${this._danger?"danger":""}"
            @click=${this._confirmAction}
          >
            ${this._confirmText}
          </ha-button>
        </div>
      </ha-dialog>
    `}};i.styles=[d,p`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    /* shared native-field scaffold from nativeFieldStyles; the prompt input
       follows the message text, hence the extra top margin here */
    .field { margin-top: 12px; }
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
  `],s([h({attribute:!1})],i.prototype,"hass",2),s([l()],i.prototype,"_open",2),s([l()],i.prototype,"_title",2),s([l()],i.prototype,"_message",2),s([l()],i.prototype,"_confirmText",2),s([l()],i.prototype,"_danger",2),s([l()],i.prototype,"_inputLabel",2),s([l()],i.prototype,"_inputType",2),s([l()],i.prototype,"_options",2),s([l()],i.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",i);var f="maintenance-confirm-dialog",_="data-ms-lovelace-confirm";function v(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function R(a,r){let t=v(),e=t.querySelector(`${f}[${_}]`);return e||(e=document.createElement(f),e.setAttribute(_,""),t.appendChild(e)),e.hass=a,e.confirm(r)}export{R as a};
