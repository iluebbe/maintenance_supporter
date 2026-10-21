/*! maintenance_supporter frontend 2.108.0 */
import{e as b}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-657G73F6.js";import{d as h}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YO7W73ZC.js";import{a as x,b as w,c as $}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-UGMO3OQD.js";import{a as m}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-5KW5F2YV.js";import{a as l,b as u,c as n,f as p,h as g,m as v,n as d,v as f,w as i,y}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LCRSSRYT.js";var j=3,o=class extends g{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._adopting=!1;this._error="";this._sensors=[];this._selected=new Set;this._objectNames={};this._objects=[];this._covered={};this._users=[];this._responsible="";this._forMinutes="0";this._summaryOpen=!0;this._localeReady=!1;this._userService=null;this._toggle=e=>{let s=new Set(this._selected);s.has(e)?s.delete(e):s.add(e),this._selected=s};this._toggleAll=()=>{this._selected.size===this._sensors.length?this._selected=new Set:this._selected=new Set(this._sensors.map(e=>e.entity_id))};this._adopt=async()=>{if(this._selected.size===0||this._adopting)return;this._error="";let e=this._sensors.filter(t=>this._selected.has(t.entity_id)).map(t=>({entity_id:t.entity_id,name:t.name,entry_id:this._existingEntryFor(t)??void 0,object_name:this._effectiveName(t),device_id:t.device_id??void 0,part_id:t.suggested_part_id??void 0,responsible_user_id:this._responsible||void 0,for_minutes:parseInt(this._forMinutes,10)>0?parseInt(this._forMinutes,10):void 0})),s=await m(this,{type:"maintenance_supporter/problem_sensors/adopt",selections:e},{busy:t=>{this._adopting=t},onError:t=>{this._error=t}});s!==void 0&&(this.dispatchEvent(new CustomEvent("problem-sensors-adopted",{bubbles:!0,composed:!0,detail:s})),this._open=!1)}}get _lang(){return f(this.hass)}updated(e){e.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,y(this._lang).then(()=>this.requestUpdate())),e.has("_open")&&this._open&&$(this.shadowRoot)}async open(){this._open=!0,this._loading=!0,this._error="",this._sensors=[],this._selected=new Set,this._objectNames={},this._responsible="",this._forMinutes="0",this._userService?this._userService.updateHass(this.hass):this._userService=new b(this.hass);let[e,s,t]=await Promise.all([m(this,{type:"maintenance_supporter/problem_sensors/discover"},{onError:r=>{this._error=r}}),this._userService.getUsers().catch(()=>[]),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}).catch(()=>({objects:[]}))]);this._loading=!1,e!==void 0&&(this._objects=(t?.objects||[]).filter(r=>!r.object.archived_at).map(r=>({entry_id:r.entry_id,name:r.object.name,tasks:(r.tasks||[]).length})),this._sensors=e?.sensors||[],this._covered=Object.fromEntries(this._sensors.map(r=>[r.entity_id,r.covered_by??null])),this._selected=new Set(this._sensors.filter(r=>!r.covered_by).map(r=>r.entity_id)),this._users=s,this._summaryOpen=this._summaryGroups().length<=j)}_defaultName(e){return e.suggested_entry_id?e.suggested_object_name:e.candidate?.name??e.suggested_object_name}_effectiveName(e){return(this._objectNames[e.entity_id]??"").trim()||this._defaultName(e)}_existingEntryFor(e){let s=this._effectiveName(e),t=e.suggested_entry_id||e.target_entry_id||null;if(s===this._defaultName(e)&&t)return t;let r=this._objects.find(a=>a.name.trim().toLowerCase()===s.toLowerCase());return r?r.entry_id:null}_schedulePreview(){clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._preview()},350)}async _preview(){let e=this._sensors.map(t=>({entity_id:t.entity_id,name:t.name,entry_id:this._existingEntryFor(t)})),s=await m(this,{type:"maintenance_supporter/problem_sensors/preview",selections:e},{onError:()=>{}});s?.covered&&(this._covered={...this._covered,...s.covered})}_summaryGroups(){let e=new Map;for(let s of this._sensors){if(!this._selected.has(s.entity_id))continue;let t=this._existingEntryFor(s),r=this._effectiveName(s),a=t??`new:${r.toLowerCase()}`,c=e.get(a)??{name:r,entry:t,adding:0};c.adding+=1,e.set(a,c)}return[...e.values()]}_summary(e){let s=this._summaryGroups();if(s.length===0)return p;let t=s.filter(a=>!a.entry).length,r=i(t?"adopt_summary_totals_new":"adopt_summary_totals",e).replace("{tasks}",String(s.reduce((a,c)=>a+c.adding,0))).replace("{objects}",String(s.length)).replace("{new}",String(t));return n`
      <details
        class="summary"
        .open=${this._summaryOpen}
        @toggle=${a=>{this._summaryOpen=a.target.open}}
      >
        <summary>
          <span class="summary-title">${i("adopt_summary_title",e)}</span>
          <span class="summary-totals">${r}</span>
        </summary>
        ${s.map(a=>{if(!a.entry)return n`<div class="summary-line new">
              ${i("setups_new_object_count",e).replace("{name}",a.name).replace("{count}",String(a.adding))}
            </div>`;let c=this._objects.find(_=>_.entry_id===a.entry)?.tasks??0;return n`<div class="summary-line">
            ${i("adopt_summary_existing",e).replace("{name}",a.name).replace("{before}",String(c)).replace("{after}",String(c+a.adding))}
          </div>`})}
      </details>
    `}_close(){clearTimeout(this._previewTimer),this._open=!1}_targetLabel(e,s){if(e.candidate&&this._existingEntryFor(e)===e.candidate.entry_id){let t=e.candidate.reasons.map(r=>i(`setups_reason_${r}`,s)).join(", ");return i("setups_target_match",s).replace("{name}",e.candidate.name).replace("{reasons}",t)}return this._effectiveName(e)}render(){if(!this._open)return n``;let e=this._lang,s=this._sensors.length>0&&this._selected.size===this._sensors.length;return w(()=>this._close(),n`
        <div class="title">${i("adopt_problem_title",e)}</div>
        ${this._error?n`<div class="error">${this._error}</div>`:p}

        <div class="dialog-scroll">
          <div class="hint">${i("adopt_problem_hint",e)}</div>
          ${this._loading?n`<div class="loading">…</div>`:this._sensors.length===0?n`<div class="empty">${i("adopt_problem_none",e)}</div>`:n`
                  <label class="select-all">
                    <input
                      type="checkbox"
                      .checked=${s}
                      @change=${this._toggleAll}
                    />
                    <span>${i("selected",e)}: ${this._selected.size} / ${this._sensors.length}</span>
                  </label>
                  <div class="row-sub adopt-object-hint">${i("adopt_object_hint",e)}</div>
                  <datalist id="adopt-object-names">
                    ${this._objects.map(t=>n`<option value=${t.name}></option>`)}
                  </datalist>
                  <div class="list">
                    ${this._sensors.map(t=>{let r=this._selected.has(t.entity_id),a=t.state==="on",c=[t.device_name,t.area_name].filter(Boolean).join(" \xB7 ");return n`
                        <label class="row">
                          <input
                            type="checkbox"
                            .checked=${r}
                            @change=${()=>this._toggle(t.entity_id)}
                          />
                          <div class="row-main">
                            <div class="row-top">
                              <span class="row-name">${t.name}</span>
                              <span class="chip ${a?"chip-active":"chip-ok"}">
                                ${a?i("adopt_problem_active",e):i("adopt_problem_ok",e)}
                              </span>
                            </div>
                            ${c?n`<div class="row-sub">${c}</div>`:p}
                            ${r?n`<div class="row-object" @click=${_=>_.stopPropagation()}>
                                  <input
                                    class="adopt-object"
                                    list="adopt-object-names"
                                    aria-label=${i("object",e)}
                                    placeholder=${this._defaultName(t)}
                                    .value=${this._objectNames[t.entity_id]??this._defaultName(t)}
                                    @input=${_=>{this._objectNames={...this._objectNames,[t.entity_id]:_.target.value},this._schedulePreview()}}
                                  />
                                </div>`:p}
                            <div class="row-target">
                              → ${this._targetLabel(t,e)}${this._existingEntryFor(t)?p:n` <span class="new-tag">${i("adopt_problem_new_object",e)}</span>`}
                            </div>
                            ${this._covered[t.entity_id]?n`<div class="maybe">
                                  ${i("setups_maybe_covered",e).replace("{name}",this._covered[t.entity_id].name)}
                                </div>`:p}
                            ${t.suggested_part_name?n`<div class="row-part">
                                  <ha-icon icon="mdi:package-variant-closed"></ha-icon>
                                  ${i("adopt_problem_part",e).replace("{name}",t.suggested_part_name)}
                                </div>`:p}
                          </div>
                        </label>
                      `})}
                  </div>
                `}

          ${!this._loading&&this._sensors.length>0?this._summary(e):p}

          ${!this._loading&&this._sensors.length>0?n`
                <label class="responsible">
                  <span>${i("for_at_least_minutes",e)}</span>
                  <input
                    class="for-input"
                    type="number"
                    min=${h[0]}
                    max=${h[1]}
                    .value=${this._forMinutes}
                    @input=${t=>this._forMinutes=t.target.value}
                  />
                </label>
                <div class="for-hint">${i("adopt_for_minutes_hint",e)}</div>
              `:p}

          ${!this._loading&&this._sensors.length>0&&this._users.length>0?n`
                <label class="responsible">
                  <span>${i("adopt_problem_responsible",e)}</span>
                  <select
                    .value=${this._responsible}
                    @change=${t=>{this._responsible=t.target.value}}
                  >
                    <option value="" ?selected=${!this._responsible}>${i("no_user_assigned",e)}</option>
                    ${this._users.map(t=>n`<option value=${t.id} ?selected=${t.id===this._responsible}>${t.name}</option>`)}
                  </select>
                </label>
              `:p}
        </div>

        <div class="actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${i("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._adopt}
            .disabled=${this._selected.size===0||this._adopting}
          >
            ${i("adopt_problem_adopt",e)}
          </ha-button>
        </div>
    `)}};o.styles=[x,u`
    :host {
      --ms-modal-max-width: 560px;
      --ms-modal-max-height: 90dvh;
      --ms-modal-gap: 12px;
      --ms-modal-z: 1000;
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
    /* Stays at the top of the scrolling middle: the count while ticking.
       top: -1px + 1px more padding: on a 3x screen a fractional offset let a
       line of the text scrolled under it show above it. */
    .select-all {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--secondary-text-color);
      cursor: pointer;
      position: sticky;
      top: -1px;
      z-index: 1;
      padding: 5px 0 4px;
      background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    }
    .select-all input {
      cursor: pointer;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 6px;
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
    .summary > summary {
      cursor: pointer;
      margin-bottom: 2px;
    }
    .summary-title {
      font-weight: 500;
    }
    .summary-totals {
      color: var(--secondary-text-color);
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
  `],l([v({attribute:!1})],o.prototype,"hass",2),l([d()],o.prototype,"_open",2),l([d()],o.prototype,"_loading",2),l([d()],o.prototype,"_adopting",2),l([d()],o.prototype,"_error",2),l([d()],o.prototype,"_sensors",2),l([d()],o.prototype,"_selected",2),l([d()],o.prototype,"_objectNames",2),l([d()],o.prototype,"_objects",2),l([d()],o.prototype,"_covered",2),l([d()],o.prototype,"_users",2),l([d()],o.prototype,"_responsible",2),l([d()],o.prototype,"_forMinutes",2),l([d()],o.prototype,"_summaryOpen",2);customElements.get("maintenance-adopt-problem-sensors-dialog")||customElements.define("maintenance-adopt-problem-sensors-dialog",o);export{o as MaintenanceAdoptProblemSensorsDialog};
