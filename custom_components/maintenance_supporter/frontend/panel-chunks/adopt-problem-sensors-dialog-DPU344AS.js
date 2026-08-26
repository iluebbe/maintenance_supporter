/*! maintenance_supporter frontend 2.65.0 */
import{a as f}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-IAYX7ZWS.js";import{a as p}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-3N7IE74O.js";import{a as o,b as _,c as i,f as l,g as h,k as g,l as n,p as t,r as u,t as v}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-MA6JEPZG.js";var r=class extends h{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._adopting=!1;this._error="";this._sensors=[];this._selected=new Set;this._users=[];this._responsible="";this._forMinutes="0";this._localeReady=!1;this._userService=null;this._toggle=s=>{let a=new Set(this._selected);a.has(s)?a.delete(s):a.add(s),this._selected=a};this._toggleAll=()=>{this._selected.size===this._sensors.length?this._selected=new Set:this._selected=new Set(this._sensors.map(s=>s.entity_id))};this._adopt=async()=>{if(!(this._selected.size===0||this._adopting)){this._adopting=!0,this._error="";try{let s=this._sensors.filter(e=>this._selected.has(e.entity_id)).map(e=>({entity_id:e.entity_id,name:e.name,entry_id:e.suggested_entry_id??void 0,object_name:e.suggested_object_name,device_id:e.device_id??void 0,part_id:e.suggested_part_id??void 0,responsible_user_id:this._responsible||void 0,for_minutes:parseInt(this._forMinutes,10)>0?parseInt(this._forMinutes,10):void 0})),a=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/problem_sensors/adopt",selections:s});this.dispatchEvent(new CustomEvent("problem-sensors-adopted",{bubbles:!0,composed:!0,detail:a})),this._open=!1}catch(s){this._error=p(s,this._lang)}finally{this._adopting=!1}}}}get _lang(){return u(this.hass)}updated(s){s.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,v(this._lang).then(()=>this.requestUpdate()))}async open(){this._open=!0,this._loading=!0,this._error="",this._sensors=[],this._selected=new Set,this._responsible="",this._forMinutes="0";try{this._userService?this._userService.updateHass(this.hass):this._userService=new f(this.hass);let[s,a]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/problem_sensors/discover"}),this._userService.getUsers().catch(()=>[])]);this._sensors=s.sensors||[],this._selected=new Set(this._sensors.map(e=>e.entity_id)),this._users=a}catch(s){this._error=p(s,this._lang)}finally{this._loading=!1}}_close(){this._open=!1}render(){if(!this._open)return i``;let s=this._lang,a=this._sensors.length>0&&this._selected.size===this._sensors.length;return i`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${e=>e.stopPropagation()}>
          <div class="title">${t("adopt_problem_title",s)}</div>
          <div class="hint">${t("adopt_problem_hint",s)}</div>
          ${this._error?i`<div class="error">${this._error}</div>`:l}

          ${this._loading?i`<div class="loading">…</div>`:this._sensors.length===0?i`<div class="empty">${t("adopt_problem_none",s)}</div>`:i`
                  <label class="select-all">
                    <input
                      type="checkbox"
                      .checked=${a}
                      @change=${this._toggleAll}
                    />
                    <span>${t("selected",s)}: ${this._selected.size} / ${this._sensors.length}</span>
                  </label>
                  <div class="list">
                    ${this._sensors.map(e=>{let m=this._selected.has(e.entity_id),d=e.state==="on",c=[e.device_name,e.area_name].filter(Boolean).join(" \xB7 ");return i`
                        <label class="row">
                          <input
                            type="checkbox"
                            .checked=${m}
                            @change=${()=>this._toggle(e.entity_id)}
                          />
                          <div class="row-main">
                            <div class="row-top">
                              <span class="row-name">${e.name}</span>
                              <span class="chip ${d?"chip-active":"chip-ok"}">
                                ${d?t("adopt_problem_active",s):t("adopt_problem_ok",s)}
                              </span>
                            </div>
                            ${c?i`<div class="row-sub">${c}</div>`:l}
                            <div class="row-target">
                              → ${e.suggested_object_name}${e.suggested_entry_id?l:i` <span class="new-tag">${t("adopt_problem_new_object",s)}</span>`}
                            </div>
                            ${e.suggested_part_name?i`<div class="row-part">
                                  <ha-icon icon="mdi:package-variant-closed"></ha-icon>
                                  ${t("adopt_problem_part",s).replace("{name}",e.suggested_part_name)}
                                </div>`:l}
                          </div>
                        </label>
                      `})}
                  </div>
                `}

          ${!this._loading&&this._sensors.length>0?i`
                <label class="responsible">
                  <span>${t("for_at_least_minutes",s)}</span>
                  <input
                    class="for-input"
                    type="number"
                    min="0"
                    max="1440"
                    .value=${this._forMinutes}
                    @input=${e=>this._forMinutes=e.target.value}
                  />
                </label>
                <div class="for-hint">${t("adopt_for_minutes_hint",s)}</div>
              `:l}

          ${!this._loading&&this._sensors.length>0&&this._users.length>0?i`
                <label class="responsible">
                  <span>${t("adopt_problem_responsible",s)}</span>
                  <select
                    .value=${this._responsible}
                    @change=${e=>{this._responsible=e.target.value}}
                  >
                    <option value="" ?selected=${!this._responsible}>${t("no_user_assigned",s)}</option>
                    ${this._users.map(e=>i`<option value=${e.id} ?selected=${e.id===this._responsible}>${e.name}</option>`)}
                  </select>
                </label>
              `:l}

          <div class="actions">
            <ha-button appearance="plain" @click=${this._close}>
              ${t("cancel",s)}
            </ha-button>
            <ha-button
              @click=${this._adopt}
              .disabled=${this._selected.size===0||this._adopting}
            >
              ${t("adopt_problem_adopt",s)}
            </ha-button>
          </div>
        </div>
      </div>
    `}};r.styles=_`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .card {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: min(360px, calc(100vw - 24px));
      max-width: 560px;
      width: 90vw;
      max-height: 80vh;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
    .title {
      font-size: 18px;
      font-weight: 500;
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .loading,
    .empty {
      color: var(--secondary-text-color);
      font-size: 14px;
      padding: 12px 0;
    }
    .select-all {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .select-all input {
      cursor: pointer;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      overflow-y: auto;
      max-height: 50vh;
    }
    .row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      cursor: pointer;
    }
    .row input {
      margin-top: 2px;
      cursor: pointer;
    }
    .row-main {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      flex: 1;
    }
    .row-top {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .row-name {
      font-weight: 500;
      font-size: 13px;
    }
    .row-sub {
      color: var(--secondary-text-color);
      font-size: 12px;
    }
    .row-target {
      color: var(--secondary-text-color);
      font-size: 12px;
    }
    .row-part {
      color: var(--secondary-text-color);
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .row-part ha-icon {
      --mdc-icon-size: 14px;
    }
    .new-tag {
      font-style: italic;
    }
    .chip {
      font-size: 11px;
      padding: 1px 8px;
      border-radius: 10px;
      white-space: nowrap;
    }
    .chip-active {
      background: var(--error-color, #f44336);
      color: #fff;
    }
    .chip-ok {
      background: var(--divider-color);
      color: var(--secondary-text-color);
    }
    .responsible {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--secondary-text-color);
      flex-wrap: wrap;
    }
    .for-input {
      width: 70px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      padding: 4px 6px;
    }
    .for-hint {
      font-size: 11px;
      color: var(--secondary-text-color);
      margin: -4px 0 2px;
    }
    .responsible select {
      flex: 1;
      min-width: 140px;
      padding: 4px 6px;
      border-radius: 4px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 8px;
    }
  `,o([g({attribute:!1})],r.prototype,"hass",2),o([n()],r.prototype,"_open",2),o([n()],r.prototype,"_loading",2),o([n()],r.prototype,"_adopting",2),o([n()],r.prototype,"_error",2),o([n()],r.prototype,"_sensors",2),o([n()],r.prototype,"_selected",2),o([n()],r.prototype,"_users",2),o([n()],r.prototype,"_responsible",2),o([n()],r.prototype,"_forMinutes",2);customElements.get("maintenance-adopt-problem-sensors-dialog")||customElements.define("maintenance-adopt-problem-sensors-dialog",r);export{r as MaintenanceAdoptProblemSensorsDialog};
