/*! maintenance_supporter frontend 2.63.1 */
import{a as g}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LS7YQ43S.js";import{a as l,b as m,c as i,f as h,g as v,k as u,l as d,p,r as f,t as x}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-PFF7S5UN.js";var a=class extends v{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._adopting=!1;this._error="";this._setups=[];this._selected=new Set;this._baselines=new Map;this._targets=new Map;this._objects=[];this._localeReady=!1;this._toggle=t=>{let e=new Set(this._selected);e.has(t)?e.delete(t):e.add(t),this._selected=e};this._adopt=async()=>{if(!(this._selected.size===0||this._adopting)){this._adopting=!0,this._error="";try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/adopt",selections:[...this._selected].map(e=>{let r={device_id:e},c=this._targets.get(e);c&&(r.entry_id=c);let s=this._setups.find(n=>n.device_id===e);for(let n of s?.tasks??[]){let o=this._baselines.get(`${e} ${n.task_name}`),_=o?parseFloat(o):NaN;!isNaN(_)&&_>=0&&((r.baselines??={})[n.task_name]=_)}return r})});this.dispatchEvent(new CustomEvent("integration-setups-adopted",{bubbles:!0,composed:!0,detail:t})),this._open=!1}catch(t){this._error=g(t,this._lang)}finally{this._adopting=!1}}}}get _lang(){return f(this.hass)}updated(t){t.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,x(this._lang).then(()=>this.requestUpdate()))}async open(){this._open=!0,this._loading=!0,this._error="",this._setups=[],this._selected=new Set;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/discover"});this._setups=t.setups||[],this._selected=new Set(this._setups.map(e=>e.device_id)),this._baselines=new Map,this._targets=new Map;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._objects=(e.objects||[]).map(r=>({entry_id:r.entry_id,name:r.object?.name||r.entry_id})).sort((r,c)=>r.name.localeCompare(c.name))}catch{this._objects=[]}}catch(t){this._error=g(t,this._lang)}finally{this._loading=!1}}_close(){this._open=!1}render(){if(!this._open)return i``;let t=this._lang;return i`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${e=>e.stopPropagation()}>
          <div class="title">${p("setups_title",t)}</div>
          <div class="hint">${p("setups_hint",t)}</div>
          ${this._error?i`<div class="error">${this._error}</div>`:h}

          ${this._loading?i`<div class="loading">…</div>`:this._setups.length===0?i`<div class="empty">${p("setups_none",t)}</div>`:i`
                  <div class="list">
                    ${this._setups.map(e=>{let r=this._selected.has(e.device_id),c=[e.integration_name,e.area_name].filter(Boolean).join(" \xB7 ");return i`
                        <label class="row">
                          <input
                            type="checkbox"
                            .checked=${r}
                            @change=${()=>this._toggle(e.device_id)}
                          />
                          <div class="row-main">
                            <div class="row-top">
                              <span class="row-name">${e.device_name}</span>
                            </div>
                            <div class="row-sub">${c}</div>
                            <div class="row-target" @click=${s=>s.preventDefault()}>
                              →
                              ${r&&this._objects.length>0?i`
                                    <select
                                      class="target-select"
                                      @change=${s=>{let n=new Map(this._targets),o=s.target.value;o?n.set(e.device_id,o):n.delete(e.device_id),this._targets=n}}
                                    >
                                      <option value="" ?selected=${!this._targets.get(e.device_id)}>
                                        ${e.suggested_entry_id?e.suggested_object_name:p("setups_target_new",t).replace("{name}",e.suggested_object_name)}
                                      </option>
                                      ${this._objects.filter(s=>s.entry_id!==e.suggested_entry_id).map(s=>i`<option
                                            value=${s.entry_id}
                                            ?selected=${this._targets.get(e.device_id)===s.entry_id}
                                          >
                                            ${s.name}
                                          </option>`)}
                                    </select>
                                  `:i`${e.suggested_object_name}${e.suggested_entry_id?h:i` <span class="new-tag">${p("adopt_problem_new_object",t)}</span>`}`}
                            </div>
                            <div class="row-tasks">
                              ${e.tasks.map(s=>i`<span class="chip" title=${s.entity_ids.join(", ")}>
                                  <ha-icon icon="mdi:link-variant"></ha-icon>${s.task_name_localized||s.task_name}
                                </span>`)}
                            </div>
                            ${r?e.tasks.filter(s=>s.direction==="usage_delta").map(s=>{let n=`${e.device_id} ${s.task_name}`;return i`
                                      <div class="baseline-field" @click=${o=>o.preventDefault()}>
                                        <span class="baseline-label"
                                          >${s.task_name_localized||s.task_name} —
                                          ${p("setups_baseline_hint",t)}</span
                                        >
                                        <input
                                          type="number"
                                          step="any"
                                          min="0"
                                          .value=${this._baselines.get(n)??""}
                                          @click=${o=>o.preventDefault()}
                                          @input=${o=>{let _=new Map(this._baselines);_.set(n,o.target.value),this._baselines=_}}
                                        />
                                      </div>
                                    `}):h}
                          </div>
                        </label>
                      `})}
                  </div>
                `}

          <div class="actions">
            <ha-button appearance="plain" @click=${this._close}>
              ${p("cancel",t)}
            </ha-button>
            <ha-button
              @click=${this._adopt}
              .disabled=${this._selected.size===0||this._adopting}
            >
              ${p("setups_adopt",t)}
            </ha-button>
          </div>
        </div>
      </div>
    `}};a.styles=m`
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
    .title { font-size: 18px; font-weight: 500; }
    .hint { color: var(--secondary-text-color); font-size: 13px; }
    .error { color: var(--error-color, #f44336); font-size: 13px; }
    .loading, .empty { color: var(--secondary-text-color); font-size: 14px; padding: 12px 0; }
    .list { display: flex; flex-direction: column; gap: 6px; overflow-y: auto; max-height: 50vh; }
    .row {
      display: flex; align-items: flex-start; gap: 10px; padding: 8px;
      border: 1px solid var(--divider-color); border-radius: 6px; cursor: pointer;
    }
    .row input { margin-top: 2px; cursor: pointer; }
    .row-main { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1; }
    .row-name { font-weight: 500; font-size: 13px; }
    .row-sub, .row-target { color: var(--secondary-text-color); font-size: 12px; }
    .new-tag { font-style: italic; }
    .row-tasks { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px; }
    .chip {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; padding: 2px 8px; border-radius: 10px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color); white-space: nowrap;
    }
    .chip ha-icon { --mdc-icon-size: 12px; color: var(--primary-color); }
    .target-select {
      font-size: 12px; padding: 2px 4px; max-width: 100%;
      border: 1px solid var(--divider-color); border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .baseline-field {
      display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
      margin-top: 4px; font-size: 12px; color: var(--secondary-text-color);
    }
    .baseline-field input {
      width: 110px; padding: 3px 6px; font-size: 12px;
      border: 1px solid var(--divider-color); border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .actions { display: flex; justify-content: flex-end; gap: 8px; padding-top: 8px; }
  `,l([u({attribute:!1})],a.prototype,"hass",2),l([d()],a.prototype,"_open",2),l([d()],a.prototype,"_loading",2),l([d()],a.prototype,"_adopting",2),l([d()],a.prototype,"_error",2),l([d()],a.prototype,"_setups",2),l([d()],a.prototype,"_selected",2),l([d()],a.prototype,"_baselines",2),l([d()],a.prototype,"_targets",2),l([d()],a.prototype,"_objects",2);customElements.get("maintenance-suggested-setups-dialog")||customElements.define("maintenance-suggested-setups-dialog",a);export{a as MaintenanceSuggestedSetupsDialog};
