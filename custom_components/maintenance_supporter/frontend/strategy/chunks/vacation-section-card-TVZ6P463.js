/*! maintenance_supporter frontend 2.95.0 */
import{a as y,b as x}from"./chunk-43LPKNXK.js";import"./chunk-GXPMOPVC.js";import{b as p,k as $}from"./chunk-5R4AX6ZU.js";import{A as u,a as v,b as r,d as c,e as f,f as m,g as n,i as b,j as g}from"./chunk-HKPRCYXF.js";import{a as s,g as a,i as h}from"./chunk-3MSNNIFG.js";var i=class extends f{constructor(){super(...arguments);this._config={type:""};this._state=null;this._busy=!1;this._error="";this._localStart="";this._localEnd="";this._localBuffer="3";this._dirty=!1;this._loaded=!1}setConfig(t){this._config=t}getCardSize(){return 2}get _lang(){return g(this.hass)}get _isAdmin(){return this.hass?.user?.is_admin??!0}updated(t){super.updated(t),b(this,t),t.has("hass")&&this.hass&&!this._loaded&&(this._loaded=!0,this._load(),h(this._lang).then(()=>this.requestUpdate()))}async _load(){let t=await u(this,{type:"maintenance_supporter/vacation/state"},{onError:e=>{this._error=e}});t&&(this._state=t,this._localStart=t.start||"",this._localEnd=t.end||"",this._localBuffer=String(t.buffer_days??3),this._dirty=!1)}_act(t){return this._error="",u(this,t,{busy:e=>{this._busy=e},onError:e=>{this._error=e}})}async _toggleEnabled(t){let e=await this._act({type:"maintenance_supporter/vacation/update",enabled:t});e&&(this._state=e)}async _save(){if(!this._isAdmin)return;let[t,e]=p,o=Number(this._localBuffer);if(this._localBuffer.trim()===""||!Number.isInteger(o)||o<t||o>e){this._error=a("settings_value_out_of_range",this._lang).replace("{min}",String(t)).replace("{max}",String(e));return}let l=await this._act({type:"maintenance_supporter/vacation/update",start:this._localStart||null,end:this._localEnd||null,buffer_days:o});l&&(this._state=l,this._dirty=!1)}async _endNow(){if(!this._isAdmin||!await $(this.hass,{title:a("vacation_end_now",this._lang),message:a("vacation_end_now_confirm",this._lang),confirmText:a("vacation_end_now",this._lang)}))return;let e=await this._act({type:"maintenance_supporter/vacation/end_now"});e&&(this._state=e,this._localStart=e.start||"",this._localEnd=e.end||"")}_onDeepLink(){history.pushState(null,"","/maintenance-supporter?ms_action=open_vacation"),window.dispatchEvent(new CustomEvent("location-changed"))}render(){let t=this._lang,e=this._state;if(!e)return r`<ha-card><div class="loading">${a("loading",t)}</div></ha-card>`;let o=e.is_active===!0,l=e.enabled===!0,_=e.exempt_task_ids?.length??0,w=o?a("vacation_status_active",t):l?a("vacation_status_scheduled",t):a("vacation_status_inactive",t),k=o?"active":l?"scheduled":"inactive";return r`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">
              <span class="emoji">🏖️</span>
              <span>${this._config.title||a("vacation_mode",t)}</span>
            </div>
            <span class="status-pill ${k}">${w}</span>
          </div>

          ${this._error?r`<div class="error">${this._error}</div>`:c}

          ${this._isAdmin?r`
                <div class="row toggle-row">
                  <label>${a("enable",t)}</label>
                  <ha-switch
                    .checked=${l}
                    .disabled=${this._busy}
                    @change=${d=>this._toggleEnabled(d.target.checked)}
                  ></ha-switch>
                </div>

                <div class="dates-row">
                  <div class="date-field">
                    <label>${a("vacation_start",t)}</label>
                    <ms-date-field
                      kind="date"
                      clearable
                      .hass=${this.hass}
                      .lang=${t}
                      .value=${this._localStart}
                      .disabled=${this._busy}
                      @value-changed=${d=>{this._localStart=d.detail.value,this._dirty=!0}}
                    ></ms-date-field>
                  </div>
                  <div class="date-field">
                    <label>${a("vacation_end",t)}</label>
                    <ms-date-field
                      kind="date"
                      clearable
                      .hass=${this.hass}
                      .lang=${t}
                      .value=${this._localEnd}
                      .disabled=${this._busy}
                      @value-changed=${d=>{this._localEnd=d.detail.value,this._dirty=!0}}
                    ></ms-date-field>
                  </div>
                  <div class="date-field buffer">
                    <label>${a("vacation_buffer",t)}</label>
                    <input type="number" min=${p[0]} max=${p[1]}
                      .value=${this._localBuffer}
                      ?disabled=${this._busy}
                      @input=${d=>{this._localBuffer=d.target.value,this._dirty=!0}} />
                  </div>
                </div>

                <div class="actions">
                  <button class="btn ${this._dirty?"primary":"muted"}"
                    @click=${this._save}
                    ?disabled=${this._busy||!this._dirty}>
                    <ha-icon icon="${this._dirty?"mdi:content-save":"mdi:check"}"></ha-icon>
                    ${this._dirty?a("save",t):a("saved",t)}
                  </button>
                  ${o?r`<button class="btn"
                        @click=${this._endNow}
                        ?disabled=${this._busy}>
                        ${a("vacation_end_now",t)}
                      </button>`:c}
                  ${_>0?r`<button class="btn link"
                        @click=${this._onDeepLink}>
                        ${_} ${a("vacation_exempt_count",t)}…
                      </button>`:r`<button class="btn link"
                        @click=${this._onDeepLink}>
                        ${a("vacation_advanced",t)}
                      </button>`}
                </div>
              `:r`
                <div class="readonly">
                  ${l&&e.start&&e.end?r`<div>${e.start} → ${e.end}</div>`:c}
                  <button class="btn link" @click=${this._onDeepLink}>
                    ${a("vacation_open_panel",t)}
                  </button>
                </div>
              `}
        </div>
      </ha-card>
    `}};i.styles=[x,v`
    .status-pill {
      font-size: 11px; font-weight: 600;
      padding: 3px 8px; border-radius: 999px;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .status-pill.active {
      background: rgba(76, 175, 80, 0.15);
      color: #4caf50;
    }
    .status-pill.scheduled {
      background: rgba(255, 152, 0, 0.15);
      color: #ff9800;
    }
    .status-pill.inactive {
      background: rgba(158, 158, 158, 0.15);
      color: var(--secondary-text-color);
    }
    .row.toggle-row {
      display: flex; align-items: center; justify-content: space-between;
    }
    .row.toggle-row label {
      font-size: 14px; color: var(--primary-text-color);
    }
    .dates-row {
      display: grid; grid-template-columns: 1fr 1fr 100px; gap: 10px;
    }
    .date-field.buffer label { white-space: nowrap; }
    .date-field { display: flex; flex-direction: column; gap: 4px; }
    .date-field label {
      font-size: 11px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.3px;
    }
    .date-field input {
      padding: 6px 8px; font-size: 13px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color); border-radius: 6px;
      font-family: inherit;
    }
    .date-field input:disabled { opacity: 0.5; cursor: not-allowed; }
    .actions {
      display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
    }
    .readonly { display: flex; flex-direction: column; gap: 8px; }
  `],s([m({attribute:!1})],i.prototype,"hass",2),s([n()],i.prototype,"_config",2),s([n()],i.prototype,"_state",2),s([n()],i.prototype,"_busy",2),s([n()],i.prototype,"_error",2),s([n()],i.prototype,"_localStart",2),s([n()],i.prototype,"_localEnd",2),s([n()],i.prototype,"_localBuffer",2),s([n()],i.prototype,"_dirty",2);customElements.get("maintenance-vacation-section-card")||customElements.define("maintenance-vacation-section-card",i);y({type:"maintenance-vacation-section-card",name:"Maintenance Supporter \u2014 Vacation",description:"Switch vacation mode on or off and set its dates right on the dashboard.",preview:!1});export{i as MaintenanceVacationSectionCard};
