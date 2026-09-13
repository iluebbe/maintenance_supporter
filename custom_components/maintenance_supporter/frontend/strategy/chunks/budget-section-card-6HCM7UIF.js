/*! maintenance_supporter frontend 2.86.0 */
import{a as x,b as $}from"./chunk-OHWLUNI2.js";import{B as p,a as h,b as l,d as b,e as y,f as m,g as o,h as g,i as a,j as v,k as _,n as f,q as d}from"./chunk-IGS6MDB4.js";import{a as n}from"./chunk-VMGD53HU.js";var E=80,e=class extends y{constructor(){super(...arguments);this._config={type:""};this._status=null;this._busy=!1;this._error="";this._localMonthly="";this._localYearly="";this._dirty=!1;this._loaded=!1}setConfig(t){this._config=t}getCardSize(){return 2}get _lang(){return _(this.hass)}get _isAdmin(){return this.hass?.user?.is_admin??!0}updated(t){super.updated(t),v(this,t),t.has("hass")&&this.hass&&!this._loaded&&(this._loaded=!0,this._load())}async _load(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"});this._status=t,f(t),this._localMonthly=t.monthly_budget?String(t.monthly_budget):"",this._localYearly=t.yearly_budget?String(t.yearly_budget):"",this._dirty=!1}catch(t){this._error=p(t,this._lang)}}async _save(){if(this._isAdmin){this._busy=!0,this._error="";try{let t=this._localMonthly.trim()===""?0:parseFloat(this._localMonthly),r=this._localYearly.trim()===""?0:parseFloat(this._localYearly),i={};!isNaN(t)&&t>=0&&(i.budget_monthly=t),!isNaN(r)&&r>=0&&(i.budget_yearly=r),await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/global/update",settings:i}),await this._load()}catch(t){this._error=p(t,this._lang)}finally{this._busy=!1}}}_onDeepLink(){history.pushState(null,"","/maintenance-supporter?ms_action=open_budget"),window.dispatchEvent(new CustomEvent("location-changed"))}render(){let t=this._lang,r=this._status;if(!r)return l`<ha-card><div class="loading">${a("loading",t)}</div></ha-card>`;let i=g(r),k=r.alert_threshold_pct??E,w=[{label:a("budget_monthly",t),spent:r.monthly_spent||0,budget:r.monthly_budget||0},{label:a("budget_yearly",t),spent:r.yearly_spent||0,budget:r.yearly_budget||0}];return l`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">
              <span class="emoji">💰</span>
              <span>${this._config.title||a("settings_budget",t)}</span>
            </div>
            <span class="currency">${i}</span>
          </div>

          ${this._error?l`<div class="error">${this._error}</div>`:b}

          ${w.map(s=>{if(!(s.budget>0))return l`
                <div class="track spent-only">
                  <div class="track-label-row">
                    <label>${s.label}</label>
                    <span class="track-numbers ok">${d(s.spent,i,t)}</span>
                  </div>
                </div>
              `;let c=Math.min(100,Math.max(0,s.spent/s.budget*100)),u=c>=100?"danger":c>=k?"warning":"ok";return l`
              <div class="track">
                <div class="track-label-row">
                  <label>${s.label}</label>
                  <span class="track-numbers ${u}">
                    ${d(s.spent,void 0,t)} / ${d(s.budget,i,t)}
                  </span>
                </div>
                <div class="bar"><div class="bar-fill ${u}" style="width:${c}%"></div></div>
              </div>
            `})}

          ${this._isAdmin?l`
                <div class="inputs-row">
                  <div class="input-field">
                    <label>${a("budget_monthly_set",t)}</label>
                    <div class="input-wrap">
                      <input type="number" min="0" step="1"
                        .value=${this._localMonthly}
                        ?disabled=${this._busy}
                        @input=${s=>{this._localMonthly=s.target.value,this._dirty=!0}} />
                      <span class="input-suffix">${i}</span>
                    </div>
                  </div>
                  <div class="input-field">
                    <label>${a("budget_yearly_set",t)}</label>
                    <div class="input-wrap">
                      <input type="number" min="0" step="1"
                        .value=${this._localYearly}
                        ?disabled=${this._busy}
                        @input=${s=>{this._localYearly=s.target.value,this._dirty=!0}} />
                      <span class="input-suffix">${i}</span>
                    </div>
                  </div>
                </div>
                <div class="actions">
                  <button class="btn ${this._dirty?"primary":"muted"}"
                    @click=${this._save}
                    ?disabled=${this._busy||!this._dirty}>
                    <ha-icon icon="${this._dirty?"mdi:content-save":"mdi:check"}"></ha-icon>
                    ${this._dirty?a("save",t):a("saved",t)}
                  </button>
                  <button class="btn link" @click=${this._onDeepLink}>
                    ${a("budget_advanced",t)}
                  </button>
                </div>
              `:l`
                <button class="btn link" @click=${this._onDeepLink}>
                  ${a("budget_open_panel",t)}
                </button>
              `}
        </div>
      </ha-card>
    `}};e.styles=[$,h`
    .currency {
      font-size: 14px; font-weight: 600;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      padding: 2px 10px; border-radius: 999px;
    }
    .track { display: flex; flex-direction: column; gap: 4px; }
    .track-label-row {
      display: flex; align-items: center; justify-content: space-between;
    }
    .track-label-row label {
      font-size: 12px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .track-numbers { font-size: 13px; font-weight: 600; }
    .track-numbers.ok { color: var(--primary-text-color); }
    .track-numbers.warning { color: #ff9800; }
    .track-numbers.danger { color: var(--error-color, #f44336); }
    .bar {
      height: 6px; background: var(--secondary-background-color);
      border-radius: 3px; overflow: hidden;
    }
    .bar-fill { height: 100%; transition: width 0.3s; border-radius: 3px; }
    .bar-fill.ok { background: var(--primary-color); }
    .bar-fill.warning { background: #ff9800; }
    .bar-fill.danger { background: var(--error-color, #f44336); }
    .inputs-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
      padding-top: 4px; border-top: 1px solid var(--divider-color);
    }
    .input-field { display: flex; flex-direction: column; gap: 4px; }
    .input-field label {
      font-size: 11px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.3px;
    }
    .input-wrap { position: relative; display: flex; align-items: center; }
    .input-wrap input {
      flex: 1; padding: 6px 32px 6px 8px; font-size: 13px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color); border-radius: 6px;
      font-family: inherit;
    }
    .input-suffix {
      position: absolute; right: 8px;
      color: var(--secondary-text-color); font-size: 13px;
      pointer-events: none;
    }
    .actions { display: flex; gap: 8px; align-items: center; }
  `],n([m({attribute:!1})],e.prototype,"hass",2),n([o()],e.prototype,"_config",2),n([o()],e.prototype,"_status",2),n([o()],e.prototype,"_busy",2),n([o()],e.prototype,"_error",2),n([o()],e.prototype,"_localMonthly",2),n([o()],e.prototype,"_localYearly",2),n([o()],e.prototype,"_dirty",2);customElements.get("maintenance-budget-section-card")||customElements.define("maintenance-budget-section-card",e);x({type:"maintenance-budget-section-card",name:"Maintenance Supporter \u2014 Budget",description:"Inline monthly + yearly budget editor",preview:!1});export{e as MaintenanceBudgetSectionCard};
