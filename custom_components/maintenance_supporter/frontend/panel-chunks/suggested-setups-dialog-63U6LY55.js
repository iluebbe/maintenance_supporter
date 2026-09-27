/*! maintenance_supporter frontend 2.92.0 */
import{a as v}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-JXDMFEC7.js";import{a as o,b as m,c as r,f as h,h as u,l as f,m as d,s as p,u as x,w as b}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-CEOYGUGH.js";var a=class extends u{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._adopting=!1;this._error="";this._setups=[];this._selected=new Set;this._baselines=new Map;this._targets=new Map;this._objects=[];this._localeReady=!1;this._toggle=s=>{let e=new Set(this._selected);e.has(s)?e.delete(s):e.add(s),this._selected=e};this._adopt=async()=>{if(this._selected.size===0||this._adopting)return;this._error="";let s=[...this._selected].map(i=>{let c={device_id:i},t=this._targets.get(i);t&&(c.entry_id=t);let l=this._setups.find(n=>n.device_id===i);for(let n of l?.tasks??[]){let _=this._baselines.get(`${i} ${n.task_name}`),g=_?parseFloat(_):NaN;!isNaN(g)&&g>=0&&((c.baselines??={})[n.task_name]=g)}return c}),e=await v(this,{type:"maintenance_supporter/integration_setups/adopt",selections:s},{busy:i=>{this._adopting=i},onError:i=>{this._error=i}});e!==void 0&&(this.dispatchEvent(new CustomEvent("integration-setups-adopted",{bubbles:!0,composed:!0,detail:e})),this._open=!1)}}get _lang(){return x(this.hass)}updated(s){s.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,b(this._lang).then(()=>this.requestUpdate()))}async open(){this._open=!0,this._loading=!0,this._error="",this._setups=[],this._selected=new Set;let s=await v(this,{type:"maintenance_supporter/integration_setups/discover"},{onError:e=>{this._error=e}});if(s!==void 0){this._setups=s?.setups||[],this._selected=new Set(this._setups.map(e=>e.device_id)),this._baselines=new Map,this._targets=new Map;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._objects=(e.objects||[]).map(i=>({entry_id:i.entry_id,name:i.object?.name||i.entry_id})).sort((i,c)=>i.name.localeCompare(c.name))}catch{this._objects=[]}}this._loading=!1}_close(){this._open=!1}render(){if(!this._open)return r``;let s=this._lang;return r`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${e=>e.stopPropagation()}>
          <div class="title">${p("setups_title",s)}</div>
          <div class="hint">${p("setups_hint",s)}</div>
          ${this._error?r`<div class="error">${this._error}</div>`:h}

          ${this._loading?r`<div class="loading">…</div>`:this._setups.length===0?r`<div class="empty">${p("setups_none",s)}</div>`:r`
                  <div class="list">
                    ${this._setups.map(e=>{let i=this._selected.has(e.device_id),c=[e.integration_name,e.area_name].filter(Boolean).join(" \xB7 ");return r`
                        <label class="row">
                          <input
                            type="checkbox"
                            .checked=${i}
                            @change=${()=>this._toggle(e.device_id)}
                          />
                          <div class="row-main">
                            <div class="row-top">
                              <span class="row-name">${e.device_name}</span>
                            </div>
                            <div class="row-sub">${c}</div>
                            <div class="row-target" @click=${t=>t.preventDefault()}>
                              →
                              ${i&&this._objects.length>0?r`
                                    <select
                                      class="target-select"
                                      @change=${t=>{let l=new Map(this._targets),n=t.target.value;n?l.set(e.device_id,n):l.delete(e.device_id),this._targets=l}}
                                    >
                                      <option value="" ?selected=${!this._targets.get(e.device_id)}>
                                        ${e.suggested_entry_id?e.suggested_object_name:p("setups_target_new",s).replace("{name}",e.suggested_object_name)}
                                      </option>
                                      ${this._objects.filter(t=>t.entry_id!==e.suggested_entry_id).map(t=>r`<option
                                            value=${t.entry_id}
                                            ?selected=${this._targets.get(e.device_id)===t.entry_id}
                                          >
                                            ${t.name}
                                          </option>`)}
                                    </select>
                                  `:r`${e.suggested_object_name}${e.suggested_entry_id?h:r` <span class="new-tag">${p("adopt_problem_new_object",s)}</span>`}`}
                            </div>
                            <div class="row-tasks">
                              ${e.tasks.map(t=>r`<span class="chip" title=${t.entity_ids.join(", ")}>
                                  <ha-icon icon="mdi:link-variant"></ha-icon>${t.task_name_localized||t.task_name}
                                </span>`)}
                            </div>
                            ${i?e.tasks.filter(t=>t.direction==="usage_delta").map(t=>{let l=`${e.device_id} ${t.task_name}`;return r`
                                      <div class="baseline-field" @click=${n=>n.preventDefault()}>
                                        <span class="baseline-label"
                                          >${t.task_name_localized||t.task_name} —
                                          ${p("setups_baseline_hint",s)}</span
                                        >
                                        <input
                                          type="number"
                                          step="any"
                                          min="0"
                                          .value=${this._baselines.get(l)??""}
                                          @click=${n=>n.preventDefault()}
                                          @input=${n=>{let _=new Map(this._baselines);_.set(l,n.target.value),this._baselines=_}}
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
              ${p("cancel",s)}
            </ha-button>
            <ha-button
              @click=${this._adopt}
              .disabled=${this._selected.size===0||this._adopting}
            >
              ${p("setups_adopt",s)}
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
  `,o([f({attribute:!1})],a.prototype,"hass",2),o([d()],a.prototype,"_open",2),o([d()],a.prototype,"_loading",2),o([d()],a.prototype,"_adopting",2),o([d()],a.prototype,"_error",2),o([d()],a.prototype,"_setups",2),o([d()],a.prototype,"_selected",2),o([d()],a.prototype,"_baselines",2),o([d()],a.prototype,"_targets",2),o([d()],a.prototype,"_objects",2);customElements.get("maintenance-suggested-setups-dialog")||customElements.define("maintenance-suggested-setups-dialog",a);export{a as MaintenanceSuggestedSetupsDialog};
