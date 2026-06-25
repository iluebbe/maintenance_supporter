import{a as f}from"./chunk-5VCBZ3JB.js";import{a as _,b as n,d as c,e as h,f as v,g as r,i as e,p as l}from"./chunk-GZS24CWM.js";import{a as i}from"./chunk-LO2NM3CE.js";var a=class extends h{constructor(){super(...arguments);this._config={type:""};this._state=null;this._busy=!1;this._error="";this._localStart="";this._localEnd="";this._localBuffer=7;this._dirty=!1;this._loaded=!1}setConfig(t){this._config=t}getCardSize(){return 2}get _lang(){return this.hass?.language||"en"}get _isAdmin(){return this.hass?.user?.is_admin??!0}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._loaded&&(this._loaded=!0,this._load())}async _load(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/state"});this._state=t,this._localStart=t.start||"",this._localEnd=t.end||"",this._localBuffer=t.buffer_days??7,this._dirty=!1}catch(t){this._error=l(t,this._lang)}}async _toggleEnabled(t){this._busy=!0,this._error="";try{let s=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/update",enabled:t});this._state=s}catch(s){this._error=l(s,this._lang)}finally{this._busy=!1}}async _save(){if(this._isAdmin){this._busy=!0,this._error="";try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/update",start:this._localStart||null,end:this._localEnd||null,buffer_days:this._localBuffer});this._state=t,this._dirty=!1}catch(t){this._error=l(t,this._lang)}finally{this._busy=!1}}}async _endNow(){if(this._isAdmin&&window.confirm(e("vacation_end_now_confirm",this._lang)||"End vacation immediately?")){this._busy=!0;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/end_now"});this._state=t,this._localStart=t.start||"",this._localEnd=t.end||""}catch(t){this._error=l(t,this._lang)}finally{this._busy=!1}}}_onDeepLink(){history.pushState(null,"","/maintenance-supporter?ms_action=open_vacation"),window.dispatchEvent(new CustomEvent("location-changed"))}render(){let t=this._lang,s=this._state;if(!s)return n`<ha-card><div class="loading">${e("loading",t)||"Loading\u2026"}</div></ha-card>`;let p=s.is_active===!0,d=s.enabled===!0,u=s.exempt_task_ids?.length??0,m=p?e("vacation_status_active",t)||"Active now":d?e("vacation_status_scheduled",t)||"Scheduled":e("vacation_status_inactive",t)||"Inactive",b=p?"active":d?"scheduled":"inactive";return n`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">
              <span class="emoji">🏖️</span>
              <span>${this._config.title||e("vacation_mode",t)||"Vacation mode"}</span>
            </div>
            <span class="status-pill ${b}">${m}</span>
          </div>

          ${this._error?n`<div class="error">${this._error}</div>`:c}

          ${this._isAdmin?n`
                <div class="row toggle-row">
                  <label>${e("enable",t)||"Enable"}</label>
                  <ha-switch
                    .checked=${d}
                    .disabled=${this._busy}
                    @change=${o=>this._toggleEnabled(o.target.checked)}
                  ></ha-switch>
                </div>

                <div class="dates-row">
                  <div class="date-field">
                    <label>${e("vacation_start",t)||"Start"}</label>
                    <input type="date" .value=${this._localStart}
                      ?disabled=${this._busy}
                      @input=${o=>{this._localStart=o.target.value,this._dirty=!0}} />
                  </div>
                  <div class="date-field">
                    <label>${e("vacation_end",t)||"End"}</label>
                    <input type="date" .value=${this._localEnd}
                      ?disabled=${this._busy}
                      @input=${o=>{this._localEnd=o.target.value,this._dirty=!0}} />
                  </div>
                  <div class="date-field buffer">
                    <label>${e("vacation_buffer",t)||"Buffer days"}</label>
                    <input type="number" min="0" max="14"
                      .value=${String(this._localBuffer)}
                      ?disabled=${this._busy}
                      @input=${o=>{this._localBuffer=parseInt(o.target.value,10)||0,this._dirty=!0}} />
                  </div>
                </div>

                <div class="actions">
                  <button class="btn ${this._dirty?"primary":"muted"}"
                    @click=${this._save}
                    ?disabled=${this._busy||!this._dirty}>
                    <ha-icon icon="${this._dirty?"mdi:content-save":"mdi:check"}"></ha-icon>
                    ${this._dirty?e("save",t)||"Save":e("saved",t)||"Saved"}
                  </button>
                  ${p?n`<button class="btn"
                        @click=${this._endNow}
                        ?disabled=${this._busy}>
                        ${e("vacation_end_now",t)||"End now"}
                      </button>`:c}
                  ${u>0?n`<button class="btn link"
                        @click=${this._onDeepLink}>
                        ${u} ${e("vacation_exempt_count",t)||"exempt"}…
                      </button>`:n`<button class="btn link"
                        @click=${this._onDeepLink}>
                        ${e("vacation_advanced",t)||"Advanced\u2026"}
                      </button>`}
                </div>
              `:n`
                <div class="readonly">
                  ${d&&s.start&&s.end?n`<div>${s.start} → ${s.end}</div>`:c}
                  <button class="btn link" @click=${this._onDeepLink}>
                    ${e("vacation_open_panel",t)||"Open in panel"}
                  </button>
                </div>
              `}
        </div>
      </ha-card>
    `}};a.styles=[f,_`
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
  `],i([v({attribute:!1})],a.prototype,"hass",2),i([r()],a.prototype,"_config",2),i([r()],a.prototype,"_state",2),i([r()],a.prototype,"_busy",2),i([r()],a.prototype,"_error",2),i([r()],a.prototype,"_localStart",2),i([r()],a.prototype,"_localEnd",2),i([r()],a.prototype,"_localBuffer",2),i([r()],a.prototype,"_dirty",2);customElements.get("maintenance-vacation-section-card")||customElements.define("maintenance-vacation-section-card",a);window.customCards=window.customCards||[];window.customCards.push({type:"maintenance-vacation-section-card",name:"Maintenance Supporter \u2014 Vacation",description:"Inline vacation mode toggle + dates",preview:!1});export{a as MaintenanceVacationSectionCard};
