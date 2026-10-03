/*! maintenance_supporter frontend 2.97.1 */
import{a as g}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-GVLO7RZ4.js";import{a as d,b,c as n,f as p,h as x,l as y,m as l,s as r,u as w,y as k}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YJXVPPWG.js";var m=u=>`${u.entry_id}/${u.task_id}`,_="__new__",o=class extends x{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._adopting=!1;this._error="";this._setups=[];this._selected=new Set;this._baselines=new Map;this._targets=new Map;this._tasks=new Map;this._objects=[];this._offers=[];this._offerTicks=new Set;this._wiring=!1;this._localeReady=!1;this._wire=async()=>{if(this._wiring)return;let e=this._offers.filter(s=>this._offerTicks.has(m(s))).map(s=>({entry_id:s.entry_id,task_id:s.task_id}));if(e.length===0)return;this._error="";let t=await g(this,{type:"maintenance_supporter/integration_setups/wire_resets",items:e},{busy:s=>{this._wiring=s},onError:s=>{this._error=s}});t!==void 0&&(this.dispatchEvent(new CustomEvent("reset-counters-wired",{bubbles:!0,composed:!0,detail:t})),await this._loadOffers())};this._toggle=e=>{let t=new Set(this._selected);t.has(e)?t.delete(e):t.add(e),this._selected=t};this._adopt=async()=>{if(this._adopting)return;this._error="";let e=[...this._selected].map(s=>{let a=[...this._tasks.get(s)??[]],c={device_id:s,task_names:a},i=this._targets.get(s);i&&i!==_&&(c.entry_id=i);for(let f of a){let h=this._baselines.get(`${s} ${f}`),v=h?parseFloat(h):NaN;!isNaN(v)&&v>=0&&((c.baselines??={})[f]=v)}return c}).filter(s=>s.task_names.length>0);if(e.length===0)return;let t=await g(this,{type:"maintenance_supporter/integration_setups/adopt",selections:e},{busy:s=>{this._adopting=s},onError:s=>{this._error=s}});t!==void 0&&(this.dispatchEvent(new CustomEvent("integration-setups-adopted",{bubbles:!0,composed:!0,detail:t})),this._open=!1)}}get _lang(){return k(this.hass)}updated(e){e.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,w(this._lang).then(()=>this.requestUpdate()))}_defaultTicks(e){return new Set(e.tasks.filter(t=>!t.covered_by).map(t=>t.task_name))}async open(){this._open=!0,this._loading=!0,this._error="",this._setups=[],this._selected=new Set,this._offers=[],this._loadOffers();let e=await g(this,{type:"maintenance_supporter/integration_setups/discover"},{onError:t=>{this._error=t}});if(e!==void 0){this._setups=e?.setups||[],this._selected=new Set(this._setups.map(t=>t.device_id)),this._baselines=new Map,this._targets=new Map(this._setups.map(t=>[t.device_id,t.target_entry_id||_])),this._tasks=new Map(this._setups.map(t=>[t.device_id,this._defaultTicks(t)]));try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._objects=(t.objects||[]).filter(s=>!s.object?.archived_at).map(s=>({entry_id:s.entry_id,name:s.object?.name||s.entry_id})).sort((s,a)=>s.name.localeCompare(a.name))}catch{this._objects=[]}}this._loading=!1}_close(){this._open=!1}async _loadOffers(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/integration_setups/reset_offers"});this._offers=e.offers||[],this._offerTicks=new Set(this._offers.filter(t=>!t.renamed).map(m))}catch{this._offers=[]}}_toggleOffer(e){let t=new Set(this._offerTicks),s=m(e);t.has(s)?t.delete(s):t.add(s),this._offerTicks=t}_renderOffers(e){if(this._offers.length===0)return p;let t=this._offers.filter(s=>this._offerTicks.has(m(s))).length;return n`
      <div class="offers">
        <div class="offers-title">${r("reset_offers_title",e)}</div>
        <div class="hint">${r("reset_offers_hint",e)}</div>
        ${this._offers.map(s=>n`
            <label class="offer" data-task=${s.task_id}>
              <input type="checkbox" class="offer-check" .checked=${this._offerTicks.has(m(s))} @change=${()=>this._toggleOffer(s)} />
              <span class="task-text">
                <span>${s.task_name} · ${s.object_name}</span>
                ${s.renamed?n`<span class="offer-renamed">${r("reset_offers_renamed",e)}</span>`:p}
                <span class="offer-before">${r("reset_offers_before",e).replace("{integration}",s.integration_name)}</span>
                <span class="offer-after">
                  ${r("reset_offers_after",e).replace("{button}",s.button_name)}${s.button_disabled?` ${r("setups_reset_enable",e)}`:""}
                </span>
              </span>
            </label>
          `)}
        <div class="offers-actions">
          <ha-button @click=${this._wire} .disabled=${t===0||this._wiring}>${r("reset_offers_apply",e)}</ha-button>
        </div>
      </div>
    `}_toggleTask(e,t){let s=new Set(this._tasks.get(e)??[]);s.has(t)?s.delete(t):s.add(t),this._tasks=new Map(this._tasks).set(e,s)}async _retarget(e,t){this._targets=new Map(this._targets).set(e.device_id,t);let s=await g(this,{type:"maintenance_supporter/integration_setups/preview",device_id:e.device_id,entry_id:t===_?null:t},{onError:a=>{this._error=a}});!s||!Array.isArray(s.tasks)||(this._setups=this._setups.map(a=>a.device_id===e.device_id?{...a,...s}:a),this._tasks=new Map(this._tasks).set(e.device_id,this._defaultTicks(s)))}get _anythingTicked(){return[...this._selected].some(e=>(this._tasks.get(e)?.size??0)>0)}_targetOptions(e,t){let s=this._targets.get(e.device_id)??_,a=[];if(e.suggested_entry_id)a.push({value:e.suggested_entry_id,label:e.suggested_object_name});else{if(e.candidate){let i=e.candidate.reasons.map(f=>r(`setups_reason_${f}`,t)).join(", ");a.push({value:e.candidate.entry_id,label:r("setups_target_match",t).replace("{name}",e.candidate.name).replace("{reasons}",i)})}a.push({value:_,label:r("setups_target_new",t).replace("{name}",e.device_name)})}let c=new Set(a.map(i=>i.value));for(let i of this._objects)c.has(i.entry_id)||a.push({value:i.entry_id,label:i.name});return n`
      <select
        class="target-select"
        @click=${i=>i.stopPropagation()}
        @change=${i=>{this._retarget(e,i.target.value)}}
      >
        ${a.map(i=>n`<option value=${i.value} ?selected=${i.value===s}>${i.label}</option>`)}
      </select>
    `}_beforeAfter(e,t){let s=this._tasks.get(e.device_id)?.size??0;if((this._targets.get(e.device_id)??_)===_)return r("setups_new_object_count",t).replace("{name}",e.device_name).replace("{count}",String(s));let c=e.target_task_count??0;return r("setups_before_after",t).replace("{before}",String(c)).replace("{after}",String(c+s))}render(){if(!this._open)return n``;let e=this._lang;return n`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${t=>t.stopPropagation()}>
          <div class="title">${r("setups_title",e)}</div>
          <div class="hint">${r("setups_hint",e)}</div>
          ${this._error?n`<div class="error">${this._error}</div>`:p}

          ${this._renderOffers(e)}
          ${this._loading?n`<div class="loading">…</div>`:this._setups.length===0?this._offers.length===0?n`<div class="empty">${r("setups_none",e)}</div>`:p:n`
                  <div class="list">
                    ${this._setups.map(t=>{let s=this._selected.has(t.device_id),a=[t.integration_name,t.area_name].filter(Boolean).join(" \xB7 "),c=this._tasks.get(t.device_id)??new Set;return n`
                        <div class="row ${s?"":"off"}" data-device=${t.device_id}>
                          <input
                            type="checkbox"
                            class="device-check"
                            .checked=${s}
                            @change=${()=>this._toggle(t.device_id)}
                          />
                          <div class="row-main">
                            <div class="row-top">
                              <span class="row-name">${t.device_name}</span>
                            </div>
                            <div class="row-sub">${a}</div>
                            <div class="row-target">→ ${this._targetOptions(t,e)}</div>
                            ${s?n`
                                  <div class="task-list">
                                    ${t.tasks.map(i=>n`
                                        <label class="task" title=${i.entity_ids.join(", ")}>
                                          <input
                                            type="checkbox"
                                            class="task-check"
                                            .checked=${c.has(i.task_name)}
                                            @change=${()=>this._toggleTask(t.device_id,i.task_name)}
                                          />
                                          <span class="task-text">
                                            <span>${i.task_name_localized||i.task_name}</span>
                                            ${i.covered_by?n`<span class="maybe">${r("setups_maybe_covered",e).replace("{name}",i.covered_by.name)}</span>`:p}
                                            ${i.reset?n`<span class="reset">↻ ${r("setups_reset_line",e).replace("{button}",i.reset.name)}${i.reset.disabled?` ${r("setups_reset_enable",e)}`:""}</span>`:p}
                                          </span>
                                        </label>
                                        ${i.direction==="usage_delta"&&c.has(i.task_name)?n`
                                              <div class="baseline-field">
                                                <span class="baseline-label">${r("setups_baseline_hint",e)}</span>
                                                <input
                                                  type="number"
                                                  step="any"
                                                  min="0"
                                                  .value=${this._baselines.get(`${t.device_id} ${i.task_name}`)??""}
                                                  @input=${f=>{let h=new Map(this._baselines);h.set(`${t.device_id} ${i.task_name}`,f.target.value),this._baselines=h}}
                                                />
                                              </div>
                                            `:p}
                                      `)}
                                    ${t.already?.length?n`<div class="already">
                                          ${r("setups_already",e).replace("{names}",t.already.map(i=>i.existing_name).join(", "))}
                                        </div>`:p}
                                  </div>
                                  <div class="before-after">${this._beforeAfter(t,e)}</div>
                                `:p}
                          </div>
                        </div>
                      `})}
                  </div>
                `}

          <div class="actions">
            <ha-button appearance="plain" @click=${this._close}>
              ${r("cancel",e)}
            </ha-button>
            <ha-button @click=${this._adopt} .disabled=${!this._anythingTicked||this._adopting}>
              ${r("setups_adopt",e)}
            </ha-button>
          </div>
        </div>
      </div>
    `}};o.styles=b`
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
    .reset { font-size: 11px; color: var(--secondary-text-color); }
    .offers {
      display: flex; flex-direction: column; gap: 6px; padding: 8px;
      border: 1px solid var(--primary-color); border-radius: 6px;
      overflow-y: auto; max-height: 40vh; flex-shrink: 0;
    }
    .offers-title { font-weight: 500; font-size: 14px; }
    .offer { display: flex; align-items: flex-start; gap: 6px; font-size: 13px; cursor: pointer; }
    .offer-before { font-size: 11px; color: var(--secondary-text-color); }
    .offer-after { font-size: 11px; color: var(--primary-color); }
    .offer-renamed { font-size: 11px; color: var(--warning-color, #ff9800); }
    .offers-actions { display: flex; justify-content: flex-end; }
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
  `,d([y({attribute:!1})],o.prototype,"hass",2),d([l()],o.prototype,"_open",2),d([l()],o.prototype,"_loading",2),d([l()],o.prototype,"_adopting",2),d([l()],o.prototype,"_error",2),d([l()],o.prototype,"_setups",2),d([l()],o.prototype,"_selected",2),d([l()],o.prototype,"_baselines",2),d([l()],o.prototype,"_targets",2),d([l()],o.prototype,"_tasks",2),d([l()],o.prototype,"_objects",2),d([l()],o.prototype,"_offers",2),d([l()],o.prototype,"_offerTicks",2),d([l()],o.prototype,"_wiring",2);customElements.get("maintenance-suggested-setups-dialog")||customElements.define("maintenance-suggested-setups-dialog",o);export{o as MaintenanceSuggestedSetupsDialog};
