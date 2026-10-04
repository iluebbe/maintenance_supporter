/*! maintenance_supporter frontend 2.98.0 */
import{e as y}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-FFPNBBZ6.js";import{d as m}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-QFIANZWP.js";import{a as h}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-MN2RZ73S.js";import{H as b,a as o,b as u,c as n,f as l,h as v,l as g,m as d,s as r,u as f}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-27MZ7YLE.js";var a=class extends v{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._adopting=!1;this._error="";this._sensors=[];this._selected=new Set;this._objectNames={};this._objects=[];this._covered={};this._users=[];this._responsible="";this._forMinutes="0";this._localeReady=!1;this._userService=null;this._toggle=t=>{let i=new Set(this._selected);i.has(t)?i.delete(t):i.add(t),this._selected=i};this._toggleAll=()=>{this._selected.size===this._sensors.length?this._selected=new Set:this._selected=new Set(this._sensors.map(t=>t.entity_id))};this._adopt=async()=>{if(this._selected.size===0||this._adopting)return;this._error="";let t=this._sensors.filter(e=>this._selected.has(e.entity_id)).map(e=>({entity_id:e.entity_id,name:e.name,entry_id:this._existingEntryFor(e)??void 0,object_name:this._effectiveName(e),device_id:e.device_id??void 0,part_id:e.suggested_part_id??void 0,responsible_user_id:this._responsible||void 0,for_minutes:parseInt(this._forMinutes,10)>0?parseInt(this._forMinutes,10):void 0})),i=await h(this,{type:"maintenance_supporter/problem_sensors/adopt",selections:t},{busy:e=>{this._adopting=e},onError:e=>{this._error=e}});i!==void 0&&(this.dispatchEvent(new CustomEvent("problem-sensors-adopted",{bubbles:!0,composed:!0,detail:i})),this._open=!1)}}get _lang(){return b(this.hass)}updated(t){t.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,f(this._lang).then(()=>this.requestUpdate()))}async open(){this._open=!0,this._loading=!0,this._error="",this._sensors=[],this._selected=new Set,this._objectNames={},this._responsible="",this._forMinutes="0",this._userService?this._userService.updateHass(this.hass):this._userService=new y(this.hass);let[t,i,e]=await Promise.all([h(this,{type:"maintenance_supporter/problem_sensors/discover"},{onError:s=>{this._error=s}}),this._userService.getUsers().catch(()=>[]),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}).catch(()=>({objects:[]}))]);this._loading=!1,t!==void 0&&(this._objects=(e?.objects||[]).filter(s=>!s.object.archived_at).map(s=>({entry_id:s.entry_id,name:s.object.name,tasks:(s.tasks||[]).length})),this._sensors=t?.sensors||[],this._covered=Object.fromEntries(this._sensors.map(s=>[s.entity_id,s.covered_by??null])),this._selected=new Set(this._sensors.filter(s=>!s.covered_by).map(s=>s.entity_id)),this._users=i)}_defaultName(t){return t.suggested_entry_id?t.suggested_object_name:t.candidate?.name??t.suggested_object_name}_effectiveName(t){return(this._objectNames[t.entity_id]??"").trim()||this._defaultName(t)}_existingEntryFor(t){let i=this._effectiveName(t),e=t.suggested_entry_id||t.target_entry_id||null;if(i===this._defaultName(t)&&e)return e;let s=this._objects.find(c=>c.name.trim().toLowerCase()===i.toLowerCase());return s?s.entry_id:null}_schedulePreview(){clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._preview()},350)}async _preview(){let t=this._sensors.map(e=>({entity_id:e.entity_id,name:e.name,entry_id:this._existingEntryFor(e)})),i=await h(this,{type:"maintenance_supporter/problem_sensors/preview",selections:t},{onError:()=>{}});i?.covered&&(this._covered={...this._covered,...i.covered})}_summary(t){let i=new Map;for(let e of this._sensors){if(!this._selected.has(e.entity_id))continue;let s=this._existingEntryFor(e),c=this._effectiveName(e),_=s??`new:${c.toLowerCase()}`,p=i.get(_)??{name:c,entry:s,adding:0};p.adding+=1,i.set(_,p)}return i.size===0?l:n`
      <div class="summary">
        <div class="summary-title">${r("adopt_summary_title",t)}</div>
        ${[...i.values()].map(e=>{if(!e.entry)return n`<div class="summary-line new">
              ${r("setups_new_object_count",t).replace("{name}",e.name).replace("{count}",String(e.adding))}
            </div>`;let s=this._objects.find(c=>c.entry_id===e.entry)?.tasks??0;return n`<div class="summary-line">
            ${r("adopt_summary_existing",t).replace("{name}",e.name).replace("{before}",String(s)).replace("{after}",String(s+e.adding))}
          </div>`})}
      </div>
    `}_close(){clearTimeout(this._previewTimer),this._open=!1}_targetLabel(t,i){if(t.candidate&&this._existingEntryFor(t)===t.candidate.entry_id){let e=t.candidate.reasons.map(s=>r(`setups_reason_${s}`,i)).join(", ");return r("setups_target_match",i).replace("{name}",t.candidate.name).replace("{reasons}",e)}return this._effectiveName(t)}render(){if(!this._open)return n``;let t=this._lang,i=this._sensors.length>0&&this._selected.size===this._sensors.length;return n`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${e=>e.stopPropagation()}>
          <div class="title">${r("adopt_problem_title",t)}</div>
          <div class="hint">${r("adopt_problem_hint",t)}</div>
          ${this._error?n`<div class="error">${this._error}</div>`:l}

          ${this._loading?n`<div class="loading">…</div>`:this._sensors.length===0?n`<div class="empty">${r("adopt_problem_none",t)}</div>`:n`
                  <label class="select-all">
                    <input
                      type="checkbox"
                      .checked=${i}
                      @change=${this._toggleAll}
                    />
                    <span>${r("selected",t)}: ${this._selected.size} / ${this._sensors.length}</span>
                  </label>
                  <div class="row-sub adopt-object-hint">${r("adopt_object_hint",t)}</div>
                  <datalist id="adopt-object-names">
                    ${this._objects.map(e=>n`<option value=${e.name}></option>`)}
                  </datalist>
                  <div class="list">
                    ${this._sensors.map(e=>{let s=this._selected.has(e.entity_id),c=e.state==="on",_=[e.device_name,e.area_name].filter(Boolean).join(" \xB7 ");return n`
                        <label class="row">
                          <input
                            type="checkbox"
                            .checked=${s}
                            @change=${()=>this._toggle(e.entity_id)}
                          />
                          <div class="row-main">
                            <div class="row-top">
                              <span class="row-name">${e.name}</span>
                              <span class="chip ${c?"chip-active":"chip-ok"}">
                                ${c?r("adopt_problem_active",t):r("adopt_problem_ok",t)}
                              </span>
                            </div>
                            ${_?n`<div class="row-sub">${_}</div>`:l}
                            ${s?n`<div class="row-object" @click=${p=>p.stopPropagation()}>
                                  <input
                                    class="adopt-object"
                                    list="adopt-object-names"
                                    aria-label=${r("object",t)}
                                    placeholder=${this._defaultName(e)}
                                    .value=${this._objectNames[e.entity_id]??this._defaultName(e)}
                                    @input=${p=>{this._objectNames={...this._objectNames,[e.entity_id]:p.target.value},this._schedulePreview()}}
                                  />
                                </div>`:l}
                            <div class="row-target">
                              → ${this._targetLabel(e,t)}${this._existingEntryFor(e)?l:n` <span class="new-tag">${r("adopt_problem_new_object",t)}</span>`}
                            </div>
                            ${this._covered[e.entity_id]?n`<div class="maybe">
                                  ${r("setups_maybe_covered",t).replace("{name}",this._covered[e.entity_id].name)}
                                </div>`:l}
                            ${e.suggested_part_name?n`<div class="row-part">
                                  <ha-icon icon="mdi:package-variant-closed"></ha-icon>
                                  ${r("adopt_problem_part",t).replace("{name}",e.suggested_part_name)}
                                </div>`:l}
                          </div>
                        </label>
                      `})}
                  </div>
                `}

          ${!this._loading&&this._sensors.length>0?this._summary(t):l}

          ${!this._loading&&this._sensors.length>0?n`
                <label class="responsible">
                  <span>${r("for_at_least_minutes",t)}</span>
                  <input
                    class="for-input"
                    type="number"
                    min=${m[0]}
                    max=${m[1]}
                    .value=${this._forMinutes}
                    @input=${e=>this._forMinutes=e.target.value}
                  />
                </label>
                <div class="for-hint">${r("adopt_for_minutes_hint",t)}</div>
              `:l}

          ${!this._loading&&this._sensors.length>0&&this._users.length>0?n`
                <label class="responsible">
                  <span>${r("adopt_problem_responsible",t)}</span>
                  <select
                    .value=${this._responsible}
                    @change=${e=>{this._responsible=e.target.value}}
                  >
                    <option value="" ?selected=${!this._responsible}>${r("no_user_assigned",t)}</option>
                    ${this._users.map(e=>n`<option value=${e.id} ?selected=${e.id===this._responsible}>${e.name}</option>`)}
                  </select>
                </label>
              `:l}

          <div class="actions">
            <ha-button appearance="plain" @click=${this._close}>
              ${r("cancel",t)}
            </ha-button>
            <ha-button
              @click=${this._adopt}
              .disabled=${this._selected.size===0||this._adopting}
            >
              ${r("adopt_problem_adopt",t)}
            </ha-button>
          </div>
        </div>
      </div>
    `}};a.styles=u`
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
    .maybe {
      font-size: 11px;
      color: var(--warning-color, #ff9800);
    }
    .summary {
      font-size: 12px;
      border-top: 1px dashed var(--divider-color);
      padding-top: 6px;
    }
    .summary-title {
      font-weight: 500;
      margin-bottom: 2px;
    }
    .summary-line {
      color: var(--primary-color);
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
  `,o([g({attribute:!1})],a.prototype,"hass",2),o([d()],a.prototype,"_open",2),o([d()],a.prototype,"_loading",2),o([d()],a.prototype,"_adopting",2),o([d()],a.prototype,"_error",2),o([d()],a.prototype,"_sensors",2),o([d()],a.prototype,"_selected",2),o([d()],a.prototype,"_objectNames",2),o([d()],a.prototype,"_objects",2),o([d()],a.prototype,"_covered",2),o([d()],a.prototype,"_users",2),o([d()],a.prototype,"_responsible",2),o([d()],a.prototype,"_forMinutes",2);customElements.get("maintenance-adopt-problem-sensors-dialog")||customElements.define("maintenance-adopt-problem-sensors-dialog",a);export{a as MaintenanceAdoptProblemSensorsDialog};
