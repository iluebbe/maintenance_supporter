/*! maintenance_supporter frontend 2.93.0 */
import{a as v}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-FS3NVYBG.js";import{a as d,b as m,c as r,f as g,h as f,l as x,m as c,s as o,u as b,w as y}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-DMDFQ7RZ.js";var p="__new__",n=class extends f{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._adopting=!1;this._error="";this._setups=[];this._selected=new Set;this._baselines=new Map;this._targets=new Map;this._tasks=new Map;this._objects=[];this._localeReady=!1;this._toggle=t=>{let e=new Set(this._selected);e.has(t)?e.delete(t):e.add(t),this._selected=e};this._adopt=async()=>{if(this._adopting)return;this._error="";let t=[...this._selected].map(s=>{let a=[...this._tasks.get(s)??[]],l={device_id:s,task_names:a},i=this._targets.get(s);i&&i!==p&&(l.entry_id=i);for(let _ of a){let h=this._baselines.get(`${s} ${_}`),u=h?parseFloat(h):NaN;!isNaN(u)&&u>=0&&((l.baselines??={})[_]=u)}return l}).filter(s=>s.task_names.length>0);if(t.length===0)return;let e=await v(this,{type:"maintenance_supporter/integration_setups/adopt",selections:t},{busy:s=>{this._adopting=s},onError:s=>{this._error=s}});e!==void 0&&(this.dispatchEvent(new CustomEvent("integration-setups-adopted",{bubbles:!0,composed:!0,detail:e})),this._open=!1)}}get _lang(){return b(this.hass)}updated(t){t.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,y(this._lang).then(()=>this.requestUpdate()))}_defaultTicks(t){return new Set(t.tasks.filter(e=>!e.covered_by).map(e=>e.task_name))}async open(){this._open=!0,this._loading=!0,this._error="",this._setups=[],this._selected=new Set;let t=await v(this,{type:"maintenance_supporter/integration_setups/discover"},{onError:e=>{this._error=e}});if(t!==void 0){this._setups=t?.setups||[],this._selected=new Set(this._setups.map(e=>e.device_id)),this._baselines=new Map,this._targets=new Map(this._setups.map(e=>[e.device_id,e.target_entry_id||p])),this._tasks=new Map(this._setups.map(e=>[e.device_id,this._defaultTicks(e)]));try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._objects=(e.objects||[]).filter(s=>!s.object?.archived_at).map(s=>({entry_id:s.entry_id,name:s.object?.name||s.entry_id})).sort((s,a)=>s.name.localeCompare(a.name))}catch{this._objects=[]}}this._loading=!1}_close(){this._open=!1}_toggleTask(t,e){let s=new Set(this._tasks.get(t)??[]);s.has(e)?s.delete(e):s.add(e),this._tasks=new Map(this._tasks).set(t,s)}async _retarget(t,e){this._targets=new Map(this._targets).set(t.device_id,e);let s=await v(this,{type:"maintenance_supporter/integration_setups/preview",device_id:t.device_id,entry_id:e===p?null:e},{onError:a=>{this._error=a}});!s||!Array.isArray(s.tasks)||(this._setups=this._setups.map(a=>a.device_id===t.device_id?{...a,...s}:a),this._tasks=new Map(this._tasks).set(t.device_id,this._defaultTicks(s)))}get _anythingTicked(){return[...this._selected].some(t=>(this._tasks.get(t)?.size??0)>0)}_targetOptions(t,e){let s=this._targets.get(t.device_id)??p,a=[];if(t.suggested_entry_id)a.push({value:t.suggested_entry_id,label:t.suggested_object_name});else{if(t.candidate){let i=t.candidate.reasons.map(_=>o(`setups_reason_${_}`,e)).join(", ");a.push({value:t.candidate.entry_id,label:o("setups_target_match",e).replace("{name}",t.candidate.name).replace("{reasons}",i)})}a.push({value:p,label:o("setups_target_new",e).replace("{name}",t.device_name)})}let l=new Set(a.map(i=>i.value));for(let i of this._objects)l.has(i.entry_id)||a.push({value:i.entry_id,label:i.name});return r`
      <select
        class="target-select"
        @click=${i=>i.stopPropagation()}
        @change=${i=>{this._retarget(t,i.target.value)}}
      >
        ${a.map(i=>r`<option value=${i.value} ?selected=${i.value===s}>${i.label}</option>`)}
      </select>
    `}_beforeAfter(t,e){let s=this._tasks.get(t.device_id)?.size??0;if((this._targets.get(t.device_id)??p)===p)return o("setups_new_object_count",e).replace("{name}",t.device_name).replace("{count}",String(s));let l=t.target_task_count??0;return o("setups_before_after",e).replace("{before}",String(l)).replace("{after}",String(l+s))}render(){if(!this._open)return r``;let t=this._lang;return r`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${e=>e.stopPropagation()}>
          <div class="title">${o("setups_title",t)}</div>
          <div class="hint">${o("setups_hint",t)}</div>
          ${this._error?r`<div class="error">${this._error}</div>`:g}

          ${this._loading?r`<div class="loading">…</div>`:this._setups.length===0?r`<div class="empty">${o("setups_none",t)}</div>`:r`
                  <div class="list">
                    ${this._setups.map(e=>{let s=this._selected.has(e.device_id),a=[e.integration_name,e.area_name].filter(Boolean).join(" \xB7 "),l=this._tasks.get(e.device_id)??new Set;return r`
                        <div class="row ${s?"":"off"}" data-device=${e.device_id}>
                          <input
                            type="checkbox"
                            class="device-check"
                            .checked=${s}
                            @change=${()=>this._toggle(e.device_id)}
                          />
                          <div class="row-main">
                            <div class="row-top">
                              <span class="row-name">${e.device_name}</span>
                            </div>
                            <div class="row-sub">${a}</div>
                            <div class="row-target">→ ${this._targetOptions(e,t)}</div>
                            ${s?r`
                                  <div class="task-list">
                                    ${e.tasks.map(i=>r`
                                        <label class="task" title=${i.entity_ids.join(", ")}>
                                          <input
                                            type="checkbox"
                                            class="task-check"
                                            .checked=${l.has(i.task_name)}
                                            @change=${()=>this._toggleTask(e.device_id,i.task_name)}
                                          />
                                          <span class="task-text">
                                            <span>${i.task_name_localized||i.task_name}</span>
                                            ${i.covered_by?r`<span class="maybe">${o("setups_maybe_covered",t).replace("{name}",i.covered_by.name)}</span>`:g}
                                          </span>
                                        </label>
                                        ${i.direction==="usage_delta"&&l.has(i.task_name)?r`
                                              <div class="baseline-field">
                                                <span class="baseline-label">${o("setups_baseline_hint",t)}</span>
                                                <input
                                                  type="number"
                                                  step="any"
                                                  min="0"
                                                  .value=${this._baselines.get(`${e.device_id} ${i.task_name}`)??""}
                                                  @input=${_=>{let h=new Map(this._baselines);h.set(`${e.device_id} ${i.task_name}`,_.target.value),this._baselines=h}}
                                                />
                                              </div>
                                            `:g}
                                      `)}
                                    ${e.already?.length?r`<div class="already">
                                          ${o("setups_already",t).replace("{names}",e.already.map(i=>i.existing_name).join(", "))}
                                        </div>`:g}
                                  </div>
                                  <div class="before-after">${this._beforeAfter(e,t)}</div>
                                `:g}
                          </div>
                        </div>
                      `})}
                  </div>
                `}

          <div class="actions">
            <ha-button appearance="plain" @click=${this._close}>
              ${o("cancel",t)}
            </ha-button>
            <ha-button @click=${this._adopt} .disabled=${!this._anythingTicked||this._adopting}>
              ${o("setups_adopt",t)}
            </ha-button>
          </div>
        </div>
      </div>
    `}};n.styles=m`
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
    .list { display: flex; flex-direction: column; gap: 6px; overflow-y: auto; max-height: 55vh; }
    .row {
      display: flex; align-items: flex-start; gap: 10px; padding: 8px;
      border: 1px solid var(--divider-color); border-radius: 6px;
    }
    .row.off .row-main { opacity: 0.6; }
    .row input { margin-top: 2px; cursor: pointer; }
    .row-main { display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1; }
    .row-name { font-weight: 500; font-size: 13px; }
    .row-sub, .row-target { color: var(--secondary-text-color); font-size: 12px; }
    .row-target { display: flex; align-items: center; gap: 6px; min-width: 0; }
    .target-select {
      font-size: 12px; padding: 2px 4px; min-width: 0; max-width: 100%; flex: 1 1 auto;
      border: 1px solid var(--divider-color); border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .task-list { display: flex; flex-direction: column; gap: 2px; margin-top: 2px; }
    .task { display: flex; align-items: flex-start; gap: 6px; font-size: 13px; cursor: pointer; }
    .task-text { display: flex; flex-direction: column; min-width: 0; }
    .maybe { font-size: 11px; color: var(--warning-color, #ff9800); }
    .already { font-size: 11px; color: var(--secondary-text-color); margin-top: 2px; }
    .before-after {
      font-size: 12px; font-weight: 500; color: var(--primary-color);
      border-top: 1px dashed var(--divider-color); padding-top: 4px; margin-top: 2px;
    }
    .baseline-field {
      display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
      margin: 0 0 2px 24px; font-size: 12px; color: var(--secondary-text-color);
    }
    .baseline-field input {
      width: 110px; padding: 3px 6px; font-size: 12px;
      border: 1px solid var(--divider-color); border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .actions { display: flex; justify-content: flex-end; gap: 8px; padding-top: 8px; }
  `,d([x({attribute:!1})],n.prototype,"hass",2),d([c()],n.prototype,"_open",2),d([c()],n.prototype,"_loading",2),d([c()],n.prototype,"_adopting",2),d([c()],n.prototype,"_error",2),d([c()],n.prototype,"_setups",2),d([c()],n.prototype,"_selected",2),d([c()],n.prototype,"_baselines",2),d([c()],n.prototype,"_targets",2),d([c()],n.prototype,"_tasks",2),d([c()],n.prototype,"_objects",2);customElements.get("maintenance-suggested-setups-dialog")||customElements.define("maintenance-suggested-setups-dialog",n);export{n as MaintenanceSuggestedSetupsDialog};
