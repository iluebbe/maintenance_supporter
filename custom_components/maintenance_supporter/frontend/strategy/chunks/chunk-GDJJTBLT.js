/*! maintenance_supporter frontend 2.97.1 */
import{a as u,b as s,d as r,e as _,f as m,g as o,j as d,y as c}from"./chunk-XR5IXJXS.js";import{a as i,g as p}from"./chunk-G7Y44K4C.js";var g={default_warning_days:[0,365],default_consumable_threshold:[1,90],battery_low_percent:[1,90],battery_recovered_percent:[20,100],archive_oneoff_days:[0,3650],delete_archived_oneoff_days:[0,3650],notify_due_soon_interval_hours:[0,720],notify_overdue_interval_hours:[0,720],notify_triggered_interval_hours:[0,720],max_notifications_per_day:[0,1e3],notification_bundle_threshold:[2,20],snooze_duration_hours:[1,168],warranty_reminder_days:[1,365],budget_alert_threshold:[10,100],currency_decimals:[0,3]};var b=[0,14],x=[0,1440],y=[1,1e4],R=[0,365],A=15,E=[.1,.9],T=[0,365],$=[.01,1e4],G=[.01,1e5];var n=class extends _{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._options=null;this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(e){return this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel="",this._inputType="",this._options=null,this._inputValue="",this._open=!0,new Promise(t=>{this._resolve=t,this._promptResolve=null})}prompt(e){return this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel=e.inputLabel||"",this._inputType=e.inputType||"text",this._options=e.options&&e.options.length?e.options:null,this._inputValue=e.inputValue||"",this._open=!0,new Promise(t=>{this._promptResolve=t,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return r;let e=d(this.hass);return s`
      <ha-dialog open @closed=${this._cancel}>
        <div class="dialog-title">${this._title}</div>
        <div class="content">
          ${this._message}
          ${this._inputLabel?s`
            <!-- Native <input> rather than <ha-textfield>: HA loads
                 ha-textfield lazily for its own panels, so inside this custom
                 panel it can be unregistered and render with zero height —
                 the prompt then shows no field at all (caught live testing
                 the pause/replace prompts; same fix as complete-dialog). -->
            <label class="field">
              <span class="field-label">${this._inputLabel}</span>
              ${this._options?s`<select class="field-input field-select"
                    @change=${t=>this._inputValue=t.target.value}>
                    ${this._options.map(t=>s`<option value=${t.value} ?selected=${t.value===this._inputValue}>${t.label}</option>`)}
                  </select>`:s`<input class="field-input"
                    type="${this._inputType||"text"}"
                    .value=${this._inputValue}
                    @input=${t=>this._inputValue=t.target.value} />`}
            </label>
          `:r}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._cancel}>
            ${p("cancel",e)}
          </ha-button>
          <ha-button
            class="${this._danger?"danger":""}"
            @click=${this._confirmAction}
          >
            ${this._confirmText}
          </ha-button>
        </div>
      </ha-dialog>
    `}};n.styles=[c,u`
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
  `],i([m({attribute:!1})],n.prototype,"hass",2),i([o()],n.prototype,"_open",2),i([o()],n.prototype,"_title",2),i([o()],n.prototype,"_message",2),i([o()],n.prototype,"_confirmText",2),i([o()],n.prototype,"_danger",2),i([o()],n.prototype,"_inputLabel",2),i([o()],n.prototype,"_inputType",2),i([o()],n.prototype,"_options",2),i([o()],n.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",n);var h="maintenance-confirm-dialog",f="data-ms-lovelace-confirm";function v(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function V(l,a){let e=v(),t=e.querySelector(`${h}[${f}]`);return t||(t=document.createElement(h),t.setAttribute(f,""),e.appendChild(t)),t.hass=l,t.confirm(a)}export{g as a,b,x as c,y as d,R as e,A as f,E as g,T as h,$ as i,G as j,V as k};
