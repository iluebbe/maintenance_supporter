/*! maintenance_supporter frontend 2.112.0 */
import{a as x,b as E}from"./chunk-ESIMJGQG.js";import"./chunk-XXQZN3HX.js";import{b as p,k}from"./chunk-LAQ74VAY.js";import{E as _,a as g,b as n,d as u,f as y,g as $,h as r,j as w}from"./chunk-3O5NSVDX.js";import{a as s,j as f,k as a,m,r as b}from"./chunk-WZRULV5L.js";function A(c,h=b()){if(c.is_active)return"active";if(!c.enabled)return"inactive";let t=c.window_end?c.window_end.slice(0,10):"";return t&&t<h?"ended":"scheduled"}var B={active:"vacation_status_active",scheduled:"vacation_status_scheduled",ended:"vacation_status_ended",inactive:"vacation_status_inactive"},i=class extends y{constructor(){super(...arguments);this._config={type:""};this._state=null;this._busy=!1;this._error="";this._localStart="";this._localEnd="";this._localBuffer="3";this._dirty=!1;this._loaded=!1}setConfig(t){this._config=t}getCardSize(){return 2}get _lang(){return f(this.hass)}get _isAdmin(){return this.hass?.user?.is_admin??!0}updated(t){super.updated(t),w(this,t),t.has("hass")&&this.hass&&!this._loaded&&(this._loaded=!0,this._load(),m(this._lang).then(()=>this.requestUpdate()))}async _load(){let t=await _(this,{type:"maintenance_supporter/vacation/state"},{onError:e=>{this._error=e}});t&&(this._state=t,this._localStart=t.start||"",this._localEnd=t.end||"",this._localBuffer=String(t.buffer_days??3),this._dirty=!1)}_act(t){return this._error="",_(this,t,{busy:e=>{this._busy=e},onError:e=>{this._error=e}})}async _toggleEnabled(t){let e=await this._act({type:"maintenance_supporter/vacation/update",enabled:t});e&&(this._state=e)}async _save(){if(!this._isAdmin)return;let[t,e]=p,o=Number(this._localBuffer);if(this._localBuffer.trim()===""||!Number.isInteger(o)||o<t||o>e){this._error=a("settings_value_out_of_range",this._lang).replace("{min}",String(t)).replace("{max}",String(e));return}let l=await this._act({type:"maintenance_supporter/vacation/update",start:this._localStart||null,end:this._localEnd||null,buffer_days:o});l&&(this._state=l,this._dirty=!1)}async _endNow(){if(!this._isAdmin||!await k(this.hass,{title:a("vacation_end_now",this._lang),message:a("vacation_end_now_confirm",this._lang),confirmText:a("vacation_end_now",this._lang)}))return;let e=await this._act({type:"maintenance_supporter/vacation/end_now"});e&&(this._state=e,this._localStart=e.start||"",this._localEnd=e.end||"")}_onDeepLink(){history.pushState(null,"","/maintenance-supporter?ms_action=open_vacation"),window.dispatchEvent(new CustomEvent("location-changed"))}render(){let t=this._lang,e=this._state;if(!e)return n`<ha-card><div class="loading">${a("loading",t)}</div></ha-card>`;let o=e.exempt_task_ids?.length??0,l=A(e),L=l==="active",v=e.enabled===!0,P=a(B[l],t),S=l==="ended"?"inactive":l;return n`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">
              <span class="emoji">🏖️</span>
              <span>${this._config.title||a("vacation_mode",t)}</span>
            </div>
            <span class="status-pill ${S}">${P}</span>
          </div>

          ${this._error?n`<div class="error">${this._error}</div>`:u}

          ${this._isAdmin?n`
                <div class="row toggle-row">
                  <label>${a("enable",t)}</label>
                  <ha-switch
                    .checked=${v}
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
                  ${L?n`<button class="btn"
                        @click=${this._endNow}
                        ?disabled=${this._busy}>
                        ${a("vacation_end_now",t)}
                      </button>`:u}
                  ${o>0?n`<button class="btn link"
                        @click=${this._onDeepLink}>
                        ${o} ${a("vacation_exempt_count",t)}…
                      </button>`:n`<button class="btn link"
                        @click=${this._onDeepLink}>
                        ${a("vacation_advanced",t)}
                      </button>`}
                </div>
              `:n`
                <div class="readonly">
                  ${v&&e.start&&e.end?n`<div>${e.start} → ${e.end}</div>`:u}
                  <button class="btn link" @click=${this._onDeepLink}>
                    ${a("vacation_open_panel",t)}
                  </button>
                </div>
              `}
        </div>
      </ha-card>
    `}};i.styles=[E,g`
    .status-pill {
      font-size: 11px; font-weight: 600;
      padding: 3px 8px; border-radius: 999px;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .status-pill.active {
      background: rgba(76, 175, 80, 0.15);
      color: var(--success-color, #4caf50);
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
  `],s([$({attribute:!1})],i.prototype,"hass",2),s([r()],i.prototype,"_config",2),s([r()],i.prototype,"_state",2),s([r()],i.prototype,"_busy",2),s([r()],i.prototype,"_error",2),s([r()],i.prototype,"_localStart",2),s([r()],i.prototype,"_localEnd",2),s([r()],i.prototype,"_localBuffer",2),s([r()],i.prototype,"_dirty",2);customElements.get("maintenance-vacation-section-card")||customElements.define("maintenance-vacation-section-card",i);x({type:"maintenance-vacation-section-card",name:"Maintenance Supporter \u2014 Vacation",description:"Switch vacation mode on or off and set its dates right on the dashboard.",preview:!1});export{i as MaintenanceVacationSectionCard};
