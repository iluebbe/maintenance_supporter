/*! maintenance_supporter frontend 2.92.0 */
import{e as x}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LYCURR5I.js";import{d as _}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-23GTDW4E.js";import{a as p}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BXSCBTIJ.js";import{a as n,b as g,c as i,f as d,h as v,l as m,m as l,s,u as f,w as b}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-STJWLI3Q.js";var r=class extends v{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._adopting=!1;this._error="";this._sensors=[];this._selected=new Set;this._objectNames={};this._objects=[];this._users=[];this._responsible="";this._forMinutes="0";this._localeReady=!1;this._userService=null;this._toggle=t=>{let o=new Set(this._selected);o.has(t)?o.delete(t):o.add(t),this._selected=o};this._toggleAll=()=>{this._selected.size===this._sensors.length?this._selected=new Set:this._selected=new Set(this._sensors.map(t=>t.entity_id))};this._adopt=async()=>{if(this._selected.size===0||this._adopting)return;this._error="";let t=this._sensors.filter(e=>this._selected.has(e.entity_id)).map(e=>({entity_id:e.entity_id,name:e.name,entry_id:this._existingEntryFor(e)??void 0,object_name:this._effectiveName(e),device_id:e.device_id??void 0,part_id:e.suggested_part_id??void 0,responsible_user_id:this._responsible||void 0,for_minutes:parseInt(this._forMinutes,10)>0?parseInt(this._forMinutes,10):void 0})),o=await p(this,{type:"maintenance_supporter/problem_sensors/adopt",selections:t},{busy:e=>{this._adopting=e},onError:e=>{this._error=e}});o!==void 0&&(this.dispatchEvent(new CustomEvent("problem-sensors-adopted",{bubbles:!0,composed:!0,detail:o})),this._open=!1)}}get _lang(){return f(this.hass)}updated(t){t.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,b(this._lang).then(()=>this.requestUpdate()))}async open(){this._open=!0,this._loading=!0,this._error="",this._sensors=[],this._selected=new Set,this._objectNames={},this._responsible="",this._forMinutes="0",this._userService?this._userService.updateHass(this.hass):this._userService=new x(this.hass);let[t,o,e]=await Promise.all([p(this,{type:"maintenance_supporter/problem_sensors/discover"},{onError:a=>{this._error=a}}),this._userService.getUsers().catch(()=>[]),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}).catch(()=>({objects:[]}))]);this._loading=!1,t!==void 0&&(this._objects=(e?.objects||[]).filter(a=>!a.object.archived_at).map(a=>({entry_id:a.entry_id,name:a.object.name})),this._sensors=t?.sensors||[],this._selected=new Set(this._sensors.map(a=>a.entity_id)),this._users=o)}_effectiveName(t){return(this._objectNames[t.entity_id]??"").trim()||t.suggested_object_name}_existingEntryFor(t){let o=this._effectiveName(t);if(o===t.suggested_object_name&&t.suggested_entry_id)return t.suggested_entry_id;let e=this._objects.find(a=>a.name.trim().toLowerCase()===o.toLowerCase());return e?e.entry_id:null}_close(){this._open=!1}render(){if(!this._open)return i``;let t=this._lang,o=this._sensors.length>0&&this._selected.size===this._sensors.length;return i`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${e=>e.stopPropagation()}>
          <div class="title">${s("adopt_problem_title",t)}</div>
          <div class="hint">${s("adopt_problem_hint",t)}</div>
          ${this._error?i`<div class="error">${this._error}</div>`:d}

          ${this._loading?i`<div class="loading">…</div>`:this._sensors.length===0?i`<div class="empty">${s("adopt_problem_none",t)}</div>`:i`
                  <label class="select-all">
                    <input
                      type="checkbox"
                      .checked=${o}
                      @change=${this._toggleAll}
                    />
                    <span>${s("selected",t)}: ${this._selected.size} / ${this._sensors.length}</span>
                  </label>
                  <div class="row-sub adopt-object-hint">${s("adopt_object_hint",t)}</div>
                  <datalist id="adopt-object-names">
                    ${this._objects.map(e=>i`<option value=${e.name}></option>`)}
                  </datalist>
                  <div class="list">
                    ${this._sensors.map(e=>{let a=this._selected.has(e.entity_id),h=e.state==="on",u=[e.device_name,e.area_name].filter(Boolean).join(" \xB7 ");return i`
                        <label class="row">
                          <input
                            type="checkbox"
                            .checked=${a}
                            @change=${()=>this._toggle(e.entity_id)}
                          />
                          <div class="row-main">
                            <div class="row-top">
                              <span class="row-name">${e.name}</span>
                              <span class="chip ${h?"chip-active":"chip-ok"}">
                                ${h?s("adopt_problem_active",t):s("adopt_problem_ok",t)}
                              </span>
                            </div>
                            ${u?i`<div class="row-sub">${u}</div>`:d}
                            ${a?i`<div class="row-object" @click=${c=>c.stopPropagation()}>
                                  <input
                                    class="adopt-object"
                                    list="adopt-object-names"
                                    aria-label=${s("object",t)}
                                    placeholder=${e.suggested_object_name}
                                    .value=${this._objectNames[e.entity_id]??e.suggested_object_name}
                                    @input=${c=>{this._objectNames={...this._objectNames,[e.entity_id]:c.target.value}}}
                                  />
                                </div>`:d}
                            <div class="row-target">
                              → ${this._effectiveName(e)}${this._existingEntryFor(e)?d:i` <span class="new-tag">${s("adopt_problem_new_object",t)}</span>`}
                            </div>
                            ${e.suggested_part_name?i`<div class="row-part">
                                  <ha-icon icon="mdi:package-variant-closed"></ha-icon>
                                  ${s("adopt_problem_part",t).replace("{name}",e.suggested_part_name)}
                                </div>`:d}
                          </div>
                        </label>
                      `})}
                  </div>
                `}

          ${!this._loading&&this._sensors.length>0?i`
                <label class="responsible">
                  <span>${s("for_at_least_minutes",t)}</span>
                  <input
                    class="for-input"
                    type="number"
                    min=${_[0]}
                    max=${_[1]}
                    .value=${this._forMinutes}
                    @input=${e=>this._forMinutes=e.target.value}
                  />
                </label>
                <div class="for-hint">${s("adopt_for_minutes_hint",t)}</div>
              `:d}

          ${!this._loading&&this._sensors.length>0&&this._users.length>0?i`
                <label class="responsible">
                  <span>${s("adopt_problem_responsible",t)}</span>
                  <select
                    .value=${this._responsible}
                    @change=${e=>{this._responsible=e.target.value}}
                  >
                    <option value="" ?selected=${!this._responsible}>${s("no_user_assigned",t)}</option>
                    ${this._users.map(e=>i`<option value=${e.id} ?selected=${e.id===this._responsible}>${e.name}</option>`)}
                  </select>
                </label>
              `:d}

          <div class="actions">
            <ha-button appearance="plain" @click=${this._close}>
              ${s("cancel",t)}
            </ha-button>
            <ha-button
              @click=${this._adopt}
              .disabled=${this._selected.size===0||this._adopting}
            >
              ${s("adopt_problem_adopt",t)}
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
  `,n([m({attribute:!1})],r.prototype,"hass",2),n([l()],r.prototype,"_open",2),n([l()],r.prototype,"_loading",2),n([l()],r.prototype,"_adopting",2),n([l()],r.prototype,"_error",2),n([l()],r.prototype,"_sensors",2),n([l()],r.prototype,"_selected",2),n([l()],r.prototype,"_objectNames",2),n([l()],r.prototype,"_objects",2),n([l()],r.prototype,"_users",2),n([l()],r.prototype,"_responsible",2),n([l()],r.prototype,"_forMinutes",2);customElements.get("maintenance-adopt-problem-sensors-dialog")||customElements.define("maintenance-adopt-problem-sensors-dialog",r);export{r as MaintenanceAdoptProblemSensorsDialog};
