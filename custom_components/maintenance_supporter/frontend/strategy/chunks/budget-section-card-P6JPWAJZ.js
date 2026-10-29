/*! maintenance_supporter frontend 2.112.0 */
import{a as $,b as k}from"./chunk-LITW32RW.js";import{E as c,a as v,b as o,d as y,f as g,g as _,h as l,i as f,j as x,k as w,p}from"./chunk-CQYEKWEN.js";import{a as n,j as m,k as a}from"./chunk-WZRULV5L.js";function E(u,b,t){let e=Math.min(100,Math.max(0,u/b*100)),i=t??80;return{pct:e,level:e>=100?"danger":e>=i?"warning":"ok"}}var s=class extends g{constructor(){super(...arguments);this._config={type:""};this._status=null;this._busy=!1;this._error="";this._localMonthly="";this._localYearly="";this._dirty=!1;this._loaded=!1}setConfig(t){this._config=t}getCardSize(){return 2}get _lang(){return m(this.hass)}get _isAdmin(){return this.hass?.user?.is_admin??!0}updated(t){super.updated(t),x(this,t),t.has("hass")&&this.hass&&!this._loaded&&(this._loaded=!0,this._load())}async _load(){let t=await c(this,{type:"maintenance_supporter/budget_status"},{onError:e=>{this._error=e}});t&&(this._status=t,w(t),this._localMonthly=t.monthly_budget?String(t.monthly_budget):"",this._localYearly=t.yearly_budget?String(t.yearly_budget):"",this._dirty=!1)}async _save(){if(!this._isAdmin)return;this._error="";let t=this._localMonthly.trim()===""?0:parseFloat(this._localMonthly),e=this._localYearly.trim()===""?0:parseFloat(this._localYearly),i={};!isNaN(t)&&t>=0&&(i.budget_monthly=t),!isNaN(e)&&e>=0&&(i.budget_yearly=e),await c(this,{type:"maintenance_supporter/global/update",settings:i},{busy:d=>{this._busy=d},reload:()=>this._load(),onError:d=>{this._error=d}})}_onDeepLink(){history.pushState(null,"","/maintenance-supporter?ms_action=open_budget"),window.dispatchEvent(new CustomEvent("location-changed"))}render(){let t=this._lang,e=this._status;if(!e)return o`<ha-card><div class="loading">${a("loading",t)}</div></ha-card>`;let i=f(e),d=[{label:a("budget_monthly",t),spent:e.monthly_spent||0,budget:e.monthly_budget||0},{label:a("budget_yearly",t),spent:e.yearly_spent||0,budget:e.yearly_budget||0}];return o`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">
              <span class="emoji">💰</span>
              <span>${this._config.title||a("settings_budget",t)}</span>
            </div>
            <span class="currency">${i}</span>
          </div>

          ${this._error?o`<div class="error">${this._error}</div>`:y}

          ${d.map(r=>{if(!(r.budget>0))return o`
                <div class="track spent-only">
                  <div class="track-label-row">
                    <label>${r.label}</label>
                    <span class="track-numbers ok">${p(r.spent,i,t)}</span>
                  </div>
                </div>
              `;let{pct:L,level:h}=E(r.spent,r.budget,e.alert_threshold_pct);return o`
              <div class="track">
                <div class="track-label-row">
                  <label>${r.label}</label>
                  <span class="track-numbers ${h}">
                    ${p(r.spent,void 0,t)} / ${p(r.budget,i,t)}
                  </span>
                </div>
                <div class="bar"><div class="bar-fill ${h}" style="width:${L}%"></div></div>
              </div>
            `})}

          ${this._isAdmin?o`
                <div class="inputs-row">
                  <div class="input-field">
                    <label>${a("budget_monthly_set",t)}</label>
                    <div class="input-wrap">
                      <input type="number" min="0" step="1"
                        .value=${this._localMonthly}
                        ?disabled=${this._busy}
                        @input=${r=>{this._localMonthly=r.target.value,this._dirty=!0}} />
                      <span class="input-suffix">${i}</span>
                    </div>
                  </div>
                  <div class="input-field">
                    <label>${a("budget_yearly_set",t)}</label>
                    <div class="input-wrap">
                      <input type="number" min="0" step="1"
                        .value=${this._localYearly}
                        ?disabled=${this._busy}
                        @input=${r=>{this._localYearly=r.target.value,this._dirty=!0}} />
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
              `:o`
                <button class="btn link" @click=${this._onDeepLink}>
                  ${a("budget_open_panel",t)}
                </button>
              `}
        </div>
      </ha-card>
    `}};s.styles=[k,v`
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
    .track-numbers.warning { color: var(--warning-color, #ff9800); }
    .track-numbers.danger { color: var(--error-color, #f44336); }
    .bar {
      height: 6px; background: var(--secondary-background-color);
      border-radius: 3px; overflow: hidden;
    }
    .bar-fill { height: 100%; transition: width 0.3s; border-radius: 3px; }
    .bar-fill.ok { background: var(--primary-color); }
    .bar-fill.warning { background: var(--warning-color, #ff9800); }
    .bar-fill.danger { background: var(--error-color, #f44336); }
    /* minmax(0, …): a bare 1fr never shrinks below the number inputs'
       natural width — the row was 420 px wide on a phone (2026-09-27). */
    .inputs-row {
      display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;
      padding-top: 4px; border-top: 1px solid var(--divider-color);
    }
    .input-field { display: flex; flex-direction: column; gap: 4px; }
    .input-field label {
      font-size: 11px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.3px;
    }
    .input-wrap { position: relative; display: flex; align-items: center; }
    .input-wrap input {
      flex: 1; min-width: 0; width: 100%; box-sizing: border-box; padding: 6px 32px 6px 8px; font-size: 13px;
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
  `],n([_({attribute:!1})],s.prototype,"hass",2),n([l()],s.prototype,"_config",2),n([l()],s.prototype,"_status",2),n([l()],s.prototype,"_busy",2),n([l()],s.prototype,"_error",2),n([l()],s.prototype,"_localMonthly",2),n([l()],s.prototype,"_localYearly",2),n([l()],s.prototype,"_dirty",2);customElements.get("maintenance-budget-section-card")||customElements.define("maintenance-budget-section-card",s);$({type:"maintenance-budget-section-card",name:"Maintenance Supporter \u2014 Budget",description:"Edit the monthly and yearly budget right on the dashboard.",preview:!1});export{s as MaintenanceBudgetSectionCard};
