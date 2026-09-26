/*! maintenance_supporter frontend 2.92.0 */
import{a as g,b as y}from"./chunk-Z7ZSI7FL.js";import"./chunk-MDWLWBAI.js";import{B as o,a as h,b as r,d as c,e as _,f as v,g as n,i as e,j as f,k as m,m as b}from"./chunk-FJI2EZKD.js";import{a as i}from"./chunk-5WR6EMQC.js";var s=class extends _{constructor(){super(...arguments);this._config={type:""};this._state=null;this._busy=!1;this._error="";this._localStart="";this._localEnd="";this._localBuffer=7;this._dirty=!1;this._loaded=!1}setConfig(t){this._config=t}getCardSize(){return 2}get _lang(){return m(this.hass)}get _isAdmin(){return this.hass?.user?.is_admin??!0}updated(t){super.updated(t),f(this,t),t.has("hass")&&this.hass&&!this._loaded&&(this._loaded=!0,this._load(),b(this._lang).then(()=>this.requestUpdate()))}async _load(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/state"});this._state=t,this._localStart=t.start||"",this._localEnd=t.end||"",this._localBuffer=t.buffer_days??7,this._dirty=!1}catch(t){this._error=o(t,this._lang)}}async _toggleEnabled(t){this._busy=!0,this._error="";try{let a=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/update",enabled:t});this._state=a}catch(a){this._error=o(a,this._lang)}finally{this._busy=!1}}async _save(){if(this._isAdmin){this._busy=!0,this._error="";try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/update",start:this._localStart||null,end:this._localEnd||null,buffer_days:this._localBuffer});this._state=t,this._dirty=!1}catch(t){this._error=o(t,this._lang)}finally{this._busy=!1}}}async _endNow(){if(this._isAdmin&&window.confirm(e("vacation_end_now_confirm",this._lang))){this._busy=!0;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/end_now"});this._state=t,this._localStart=t.start||"",this._localEnd=t.end||""}catch(t){this._error=o(t,this._lang)}finally{this._busy=!1}}}_onDeepLink(){history.pushState(null,"","/maintenance-supporter?ms_action=open_vacation"),window.dispatchEvent(new CustomEvent("location-changed"))}render(){let t=this._lang,a=this._state;if(!a)return r`<ha-card><div class="loading">${e("loading",t)}</div></ha-card>`;let p=a.is_active===!0,d=a.enabled===!0,u=a.exempt_task_ids?.length??0,$=p?e("vacation_status_active",t):d?e("vacation_status_scheduled",t):e("vacation_status_inactive",t),x=p?"active":d?"scheduled":"inactive";return r`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">
              <span class="emoji">🏖️</span>
              <span>${this._config.title||e("vacation_mode",t)}</span>
            </div>
            <span class="status-pill ${x}">${$}</span>
          </div>

          ${this._error?r`<div class="error">${this._error}</div>`:c}

          ${this._isAdmin?r`
                <div class="row toggle-row">
                  <label>${e("enable",t)}</label>
                  <ha-switch
                    .checked=${d}
                    .disabled=${this._busy}
                    @change=${l=>this._toggleEnabled(l.target.checked)}
                  ></ha-switch>
                </div>

                <div class="dates-row">
                  <div class="date-field">
                    <label>${e("vacation_start",t)}</label>
                    <ms-date-field
                      kind="date"
                      clearable
                      .hass=${this.hass}
                      .lang=${t}
                      .value=${this._localStart}
                      .disabled=${this._busy}
                      @value-changed=${l=>{this._localStart=l.detail.value,this._dirty=!0}}
                    ></ms-date-field>
                  </div>
                  <div class="date-field">
                    <label>${e("vacation_end",t)}</label>
                    <ms-date-field
                      kind="date"
                      clearable
                      .hass=${this.hass}
                      .lang=${t}
                      .value=${this._localEnd}
                      .disabled=${this._busy}
                      @value-changed=${l=>{this._localEnd=l.detail.value,this._dirty=!0}}
                    ></ms-date-field>
                  </div>
                  <div class="date-field buffer">
                    <label>${e("vacation_buffer",t)}</label>
                    <input type="number" min="0" max="14"
                      .value=${String(this._localBuffer)}
                      ?disabled=${this._busy}
                      @input=${l=>{this._localBuffer=parseInt(l.target.value,10)||0,this._dirty=!0}} />
                  </div>
                </div>

                <div class="actions">
                  <button class="btn ${this._dirty?"primary":"muted"}"
                    @click=${this._save}
                    ?disabled=${this._busy||!this._dirty}>
                    <ha-icon icon="${this._dirty?"mdi:content-save":"mdi:check"}"></ha-icon>
                    ${this._dirty?e("save",t):e("saved",t)}
                  </button>
                  ${p?r`<button class="btn"
                        @click=${this._endNow}
                        ?disabled=${this._busy}>
                        ${e("vacation_end_now",t)}
                      </button>`:c}
                  ${u>0?r`<button class="btn link"
                        @click=${this._onDeepLink}>
                        ${u} ${e("vacation_exempt_count",t)}…
                      </button>`:r`<button class="btn link"
                        @click=${this._onDeepLink}>
                        ${e("vacation_advanced",t)}
                      </button>`}
                </div>
              `:r`
                <div class="readonly">
                  ${d&&a.start&&a.end?r`<div>${a.start} → ${a.end}</div>`:c}
                  <button class="btn link" @click=${this._onDeepLink}>
                    ${e("vacation_open_panel",t)}
                  </button>
                </div>
              `}
        </div>
      </ha-card>
    `}};s.styles=[y,h`
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
  `],i([v({attribute:!1})],s.prototype,"hass",2),i([n()],s.prototype,"_config",2),i([n()],s.prototype,"_state",2),i([n()],s.prototype,"_busy",2),i([n()],s.prototype,"_error",2),i([n()],s.prototype,"_localStart",2),i([n()],s.prototype,"_localEnd",2),i([n()],s.prototype,"_localBuffer",2),i([n()],s.prototype,"_dirty",2);customElements.get("maintenance-vacation-section-card")||customElements.define("maintenance-vacation-section-card",s);g({type:"maintenance-vacation-section-card",name:"Maintenance Supporter \u2014 Vacation",description:"Inline vacation mode toggle + dates",preview:!1});export{s as MaintenanceVacationSectionCard};
