/*! maintenance_supporter frontend 2.92.0 */
import{e as f}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-U47UTLVV.js";import{a as p}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-OWHMFQU3.js";import{a,b as g,c as i,f as c,h as u,l as v,m as n,q as s,s as m,u as b}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-O2W6THMF.js";var r=class extends u{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._adopting=!1;this._error="";this._sensors=[];this._selected=new Set;this._objectNames={};this._objects=[];this._users=[];this._responsible="";this._forMinutes="0";this._localeReady=!1;this._userService=null;this._toggle=e=>{let o=new Set(this._selected);o.has(e)?o.delete(e):o.add(e),this._selected=o};this._toggleAll=()=>{this._selected.size===this._sensors.length?this._selected=new Set:this._selected=new Set(this._sensors.map(e=>e.entity_id))};this._adopt=async()=>{if(!(this._selected.size===0||this._adopting)){this._adopting=!0,this._error="";try{let e=this._sensors.filter(t=>this._selected.has(t.entity_id)).map(t=>({entity_id:t.entity_id,name:t.name,entry_id:this._existingEntryFor(t)??void 0,object_name:this._effectiveName(t),device_id:t.device_id??void 0,part_id:t.suggested_part_id??void 0,responsible_user_id:this._responsible||void 0,for_minutes:parseInt(this._forMinutes,10)>0?parseInt(this._forMinutes,10):void 0})),o=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/problem_sensors/adopt",selections:e});this.dispatchEvent(new CustomEvent("problem-sensors-adopted",{bubbles:!0,composed:!0,detail:o})),this._open=!1}catch(e){this._error=p(e,this._lang)}finally{this._adopting=!1}}}}get _lang(){return m(this.hass)}updated(e){e.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,b(this._lang).then(()=>this.requestUpdate()))}async open(){this._open=!0,this._loading=!0,this._error="",this._sensors=[],this._selected=new Set,this._objectNames={},this._responsible="",this._forMinutes="0";try{this._userService?this._userService.updateHass(this.hass):this._userService=new f(this.hass);let[e,o,t]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/problem_sensors/discover"}),this._userService.getUsers().catch(()=>[]),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}).catch(()=>({objects:[]}))]);this._objects=(t.objects||[]).filter(l=>!l.object.archived_at).map(l=>({entry_id:l.entry_id,name:l.object.name})),this._sensors=e.sensors||[],this._selected=new Set(this._sensors.map(l=>l.entity_id)),this._users=o}catch(e){this._error=p(e,this._lang)}finally{this._loading=!1}}_effectiveName(e){return(this._objectNames[e.entity_id]??"").trim()||e.suggested_object_name}_existingEntryFor(e){let o=this._effectiveName(e);if(o===e.suggested_object_name&&e.suggested_entry_id)return e.suggested_entry_id;let t=this._objects.find(l=>l.name.trim().toLowerCase()===o.toLowerCase());return t?t.entry_id:null}_close(){this._open=!1}render(){if(!this._open)return i``;let e=this._lang,o=this._sensors.length>0&&this._selected.size===this._sensors.length;return i`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${t=>t.stopPropagation()}>
          <div class="title">${s("adopt_problem_title",e)}</div>
          <div class="hint">${s("adopt_problem_hint",e)}</div>
          ${this._error?i`<div class="error">${this._error}</div>`:c}

          ${this._loading?i`<div class="loading">…</div>`:this._sensors.length===0?i`<div class="empty">${s("adopt_problem_none",e)}</div>`:i`
                  <label class="select-all">
                    <input
                      type="checkbox"
                      .checked=${o}
                      @change=${this._toggleAll}
                    />
                    <span>${s("selected",e)}: ${this._selected.size} / ${this._sensors.length}</span>
                  </label>
                  <div class="row-sub adopt-object-hint">${s("adopt_object_hint",e)}</div>
                  <datalist id="adopt-object-names">
                    ${this._objects.map(t=>i`<option value=${t.name}></option>`)}
                  </datalist>
                  <div class="list">
                    ${this._sensors.map(t=>{let l=this._selected.has(t.entity_id),_=t.state==="on",h=[t.device_name,t.area_name].filter(Boolean).join(" \xB7 ");return i`
                        <label class="row">
                          <input
                            type="checkbox"
                            .checked=${l}
                            @change=${()=>this._toggle(t.entity_id)}
                          />
                          <div class="row-main">
                            <div class="row-top">
                              <span class="row-name">${t.name}</span>
                              <span class="chip ${_?"chip-active":"chip-ok"}">
                                ${_?s("adopt_problem_active",e):s("adopt_problem_ok",e)}
                              </span>
                            </div>
                            ${h?i`<div class="row-sub">${h}</div>`:c}
                            ${l?i`<div class="row-object" @click=${d=>d.stopPropagation()}>
                                  <input
                                    class="adopt-object"
                                    list="adopt-object-names"
                                    aria-label=${s("object",e)}
                                    placeholder=${t.suggested_object_name}
                                    .value=${this._objectNames[t.entity_id]??t.suggested_object_name}
                                    @input=${d=>{this._objectNames={...this._objectNames,[t.entity_id]:d.target.value}}}
                                  />
                                </div>`:c}
                            <div class="row-target">
                              → ${this._effectiveName(t)}${this._existingEntryFor(t)?c:i` <span class="new-tag">${s("adopt_problem_new_object",e)}</span>`}
                            </div>
                            ${t.suggested_part_name?i`<div class="row-part">
                                  <ha-icon icon="mdi:package-variant-closed"></ha-icon>
                                  ${s("adopt_problem_part",e).replace("{name}",t.suggested_part_name)}
                                </div>`:c}
                          </div>
                        </label>
                      `})}
                  </div>
                `}

          ${!this._loading&&this._sensors.length>0?i`
                <label class="responsible">
                  <span>${s("for_at_least_minutes",e)}</span>
                  <input
                    class="for-input"
                    type="number"
                    min="0"
                    max="1440"
                    .value=${this._forMinutes}
                    @input=${t=>this._forMinutes=t.target.value}
                  />
                </label>
                <div class="for-hint">${s("adopt_for_minutes_hint",e)}</div>
              `:c}

          ${!this._loading&&this._sensors.length>0&&this._users.length>0?i`
                <label class="responsible">
                  <span>${s("adopt_problem_responsible",e)}</span>
                  <select
                    .value=${this._responsible}
                    @change=${t=>{this._responsible=t.target.value}}
                  >
                    <option value="" ?selected=${!this._responsible}>${s("no_user_assigned",e)}</option>
                    ${this._users.map(t=>i`<option value=${t.id} ?selected=${t.id===this._responsible}>${t.name}</option>`)}
                  </select>
                </label>
              `:c}

          <div class="actions">
            <ha-button appearance="plain" @click=${this._close}>
              ${s("cancel",e)}
            </ha-button>
            <ha-button
              @click=${this._adopt}
              .disabled=${this._selected.size===0||this._adopting}
            >
              ${s("adopt_problem_adopt",e)}
            </ha-button>
          </div>
        </div>
      </div>
    `}};r.styles=g`
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
    .row-object { margin-top: 6px; }
    .row-object input {
      width: 100%; box-sizing: border-box; padding: 6px 8px; font: inherit;
      border: 1px solid var(--divider-color); border-radius: 6px;
      background: var(--card-background-color); color: var(--primary-text-color);
    }
    .adopt-object-hint { margin: 0 0 8px; }
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
  `,a([v({attribute:!1})],r.prototype,"hass",2),a([n()],r.prototype,"_open",2),a([n()],r.prototype,"_loading",2),a([n()],r.prototype,"_adopting",2),a([n()],r.prototype,"_error",2),a([n()],r.prototype,"_sensors",2),a([n()],r.prototype,"_selected",2),a([n()],r.prototype,"_objectNames",2),a([n()],r.prototype,"_objects",2),a([n()],r.prototype,"_users",2),a([n()],r.prototype,"_responsible",2),a([n()],r.prototype,"_forMinutes",2);customElements.get("maintenance-adopt-problem-sensors-dialog")||customElements.define("maintenance-adopt-problem-sensors-dialog",r);export{r as MaintenanceAdoptProblemSensorsDialog};
