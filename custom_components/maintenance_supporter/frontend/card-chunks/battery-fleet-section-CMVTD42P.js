/*! maintenance_supporter frontend 2.120.0 */
import{a as f}from"/maintenance_supporter_cardfiles/card-chunks/chunk-HFQXNDTQ.js";import{a as W,b as N,d as A}from"/maintenance_supporter_cardfiles/card-chunks/chunk-3UYHOFVB.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-NKW4AASI.js";import{a as _,b as T,c as E}from"/maintenance_supporter_cardfiles/card-chunks/chunk-W3WKIN5S.js";import{a as F}from"/maintenance_supporter_cardfiles/card-chunks/chunk-25SA3FSQ.js";import{a as g}from"/maintenance_supporter_cardfiles/card-chunks/chunk-HQ6KDNQY.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-OVK3PTDC.js";import{a as $}from"/maintenance_supporter_cardfiles/card-chunks/chunk-H442OBGV.js";import{a as R,b as d}from"/maintenance_supporter_cardfiles/card-chunks/chunk-R4OGP3RP.js";import{D as C,I as q,K as H,P as m,U as k,a as c,b as O,e as a,h as o,j as S,w as I,x as r,z as P}from"/maintenance_supporter_cardfiles/card-chunks/chunk-2JUL7K7P.js";function B(Q,z,e){return r(`part_waiting_${Q}`,e).replace("{count}",m(z,e))}var J={entity:{domain:["sensor","binary_sensor"]}},n=class n extends S{constructor(){super(...arguments);this.flat=!1;this._ov=null;this._loading=!1;this._marking=!1;this._choosing=null;this._error="";this._disposeFor=null;this._disposeQty="1";this._history=null;this._rosterSort=n._storedSort();this._typeFilter=null;this._recorded=[];this._access=W;this._historyRequested=!1;this._localeReady=!1;this._markAll=async()=>{await this._mark(void 0)};this._repair=async()=>{await this._act({type:"maintenance_supporter/battery_fleet/setup",language:this._lang})};this._loadHistory=async e=>{if(E(_.batteryRosterOpen,e?"1":"0"),!(!e||this._historyRequested)){this._historyRequested=!0;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview_history"});this._history=t.series}catch{this._history=null}}}}get _lang(){return I(this.hass)}get _canWrite(){return N(this.hass?.user,this._access)}connectedCallback(){super.connectedCallback(),this.hass&&this._load()}updated(e){H(this,e),e.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,P(this._lang).then(()=>this.requestUpdate()),A(this.hass).then(t=>{this._access=t.access}),this._ov===null&&!this._loading&&this._load())}async _load(){this._error="";let e=await $(this,{type:"maintenance_supporter/battery_fleet/overview"},{busy:t=>{this._loading=t},onError:t=>{this._error=t}});e!==void 0&&(this._ov=e)}async _act(e,t){return this._marking?!1:(this._error="",await $(this,e,{busy:i=>{this._marking=i},reload:async()=>{t?.(),await this._load()},onError:i=>{this._error=i}})!==void 0)}async _dispose(e,t){let s=parseFloat(this._disposeQty);!Number.isFinite(s)||s<=0||await this._act({type:"maintenance_supporter/part/dispose",entry_id:e,part_id:t,quantity:s})&&(this._disposeFor=null)}_renderDispose(e,t,s){return this._disposeFor!==t.part_id?a`<button class="bf-charged bf-dispose" title=${r("part_dispose_hint",s)} .disabled=${this._marking}
        @click=${()=>{this._disposeFor=t.part_id,this._disposeQty="1"}}><ha-icon icon="mdi:trash-can-outline"></ha-icon>${r("part_dispose",s)}</button>`:a`<input
        class="bf-dispose-qty"
        type="number"
        min="1"
        max=${String(t.restoring)}
        .value=${this._disposeQty}
        aria-label=${r("part_dispose_how_many",s)}
        title=${r("part_dispose_how_many",s)}
        @input=${i=>this._disposeQty=i.target.value}
        @keydown=${i=>{i.key==="Enter"&&this._dispose(e,t.part_id),i.key==="Escape"&&(this._disposeFor=null)}}
      /><button class="bf-charged bf-dispose confirm" title=${r("part_dispose_hint",s)} .disabled=${this._marking}
        @click=${()=>this._dispose(e,t.part_id)}><ha-icon icon="mdi:check"></ha-icon>${r("part_dispose",s)}</button
      ><button class="bf-charged bf-dispose" title=${r("cancel",s)} @click=${()=>this._disposeFor=null}
        ><ha-icon icon="mdi:close"></ha-icon
      ></button>`}_markOne(e,t){if(e.cell_choices&&e.cell_choices.length>1){this._choosing={entityId:e.entity_id,list:t,selected:e.cells_installed||e.cell_choices[0].type};return}this._mark([e.entity_id])}async _confirmCells(){let e=this._choosing;e&&(this._choosing=null,await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",entity_ids:[e.entityId],cells:{[e.entityId]:e.selected}}))}_renderCellChooser(e,t,s){let i=this._choosing;return!i||i.entityId!==e.entity_id||i.list!==t||!e.cell_choices?o:a`
      <div class="bf-cells" role="group" aria-label=${r("battery_fleet_cells_question",s)}>
        <div class="bf-cells-q">${r("battery_fleet_cells_question",s)}</div>
        ${e.cell_choices.map(l=>a`
          <label class="bf-cell-choice">
            <input type="radio" name=${`cells-${e.entity_id}`} .checked=${i.selected===l.type}
              @change=${()=>{this._choosing={...i,selected:l.type}}} />
            <span>${l.name}</span>
            ${l.rechargeable?a`<span class="bf-cell-tag">${r("battery_fleet_cells_rechargeable",s)}</span>`:o}
          </label>`)}
        <div class="bf-cells-actions">
          <button class="bf-cells-cancel" @click=${()=>{this._choosing=null}}>${r("cancel",s)}</button>
          <button class="bf-cells-ok" .disabled=${this._marking} @click=${()=>this._confirmCells()}>
            ${r("battery_fleet_mark_one",s)}
          </button>
        </div>
      </div>
    `}async _mark(e){await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",...e?{entity_ids:e}:{}})}async _setExcluded(e,t){await this._act({type:"maintenance_supporter/battery_fleet/set_excluded",entity_id:e,excluded:t})}async _addBattery(e){let t=e.detail?.value;t&&await this._act({type:"maintenance_supporter/battery_fleet/set_included",entity_id:t,included:!0})}async _setTrackSelf(e){await this._setFleetOption("set_track_self_charging",e.target)}async _setDueWithoutSensor(e){await this._setFleetOption("set_due_without_sensor",e.target)}async _setAskCells(e){await this._setFleetOption("set_ask_cells",e.target)}async _setFleetOption(e,t){let s=t.checked;await this._act({type:`maintenance_supporter/battery_fleet/${e}`,enabled:s})||(t.checked=!s)}_rosterOpen(){return T(_.batteryRosterOpen)!=="0"}_predictedTitle(e,t){if(e.forecast_overdue)return r("battery_fleet_forecast_overdue",t);let s=this._predictedDate(this._forecastDays(e)??0);if(e.predicted_source==="trend")return r("battery_fleet_predicted_trend",t).replace("{date}",s).replace("{confidence}",r("cal_confidence_"+(e.prediction_confidence||"medium"),t));if(e.lifetime_months!=null&&e.lifetime_source){let i=r("lifetime_source_"+e.lifetime_source,t).replace("{n}",String(e.lifetime_samples??0));return r("battery_fleet_predicted_typical",t).replace("{date}",s).replace("{months}",String(e.lifetime_months)).replace("{type}",e.battery_type).replace("{source}",i)}return r("battery_fleet_predicted_on",t).replace("{date}",s)}_sparkline(e){let t=this._history?.[e.entity_id];if(!t||t.points.length<2)return o;let s=110,i=24,l=2,h=t.points[0][0],p=t.points[t.points.length-1][0],y=Date.now()/1e3,u=e.status!=="low"&&e.predicted_source==="trend"&&e.days_until!=null?y+e.days_until*86400:null,j=Math.max(p,u??p),v=b=>j===h?l:l+(b-h)/(j-h)*(s-2*l),x=b=>l+(1-Math.min(100,Math.max(0,b))/100)*(i-2*l),K=t.points.map(([b,G])=>`${f(v(b))},${f(x(G))}`).join(" "),Y=t.points[t.points.length-1][1],w=f(x(t.threshold));return a`<svg
      class="bf-spark"
      viewBox="0 0 ${s} ${i}"
      role="img"
      aria-label=${r("battery_fleet_sparkline_hint",this._lang)}
    >
      <title>${r("battery_fleet_sparkline_hint",this._lang)}</title>
      <line class="bf-spark-th" x1="0" y1=${w} x2=${s} y2=${w}></line>
      <polyline class="bf-spark-line" points=${K}></polyline>
      ${u!==null?a`<line
            class="bf-spark-proj"
            x1=${f(v(p))}
            y1=${f(x(Y))}
            x2=${f(v(u))}
            y2=${w}
          ></line>`:o}
    </svg>`}static _storedSort(){return T(_.batteryRosterSort)==="name"?"name":"urgency"}_setSort(e){this._rosterSort=e,E(_.batteryRosterSort,e)}_sortedRoster(e){let t=this._typeFilter===null?e:e.filter(i=>i.battery_type===this._typeFilter);if(this._rosterSort==="name")return t;let s=i=>i.status==="low"?-1e3+(i.level??101)/101:i.days_until??1/0;return[...t].sort((i,l)=>s(i)-s(l)||i.device_name.localeCompare(l.device_name))}_predictedDate(e){return k(q(C(),e),this._lang)}_forecastDays(e){return e.forecast_days!==void 0?e.forecast_days:e.days_until}_fmtDate(e){return Number.isFinite(e)?k(new Date(e).toISOString(),this._lang):"\u2014"}_shoppingLine(e){return Object.entries(e).map(([t,s])=>a`<button
        class="bf-type-chip ${this._typeFilter===t?"bf-type-chip-active":""}"
        title=${r("battery_fleet_filter_type",this._lang)}
        @click=${()=>this._toggleTypeFilter(t)}
      >
        ${s}× ${t}
      </button>`)}_toggleTypeFilter(e){if(this._typeFilter=this._typeFilter===e?null:e,this._typeFilter!==null){let t=this.shadowRoot?.querySelector(".bf-roster");t instanceof HTMLDetailsElement?t.open||(t.open=!0):t&&!t.expanded&&(t.expanded=!0,this._loadHistory(!0))}}async _recordJump(e,t){await this._act({type:"maintenance_supporter/battery_fleet/record_replacement",entity_id:e,replaced_at:new Date(t.at*1e3).toISOString()},()=>{this._recorded=[...this._recorded,e]})}_levelTone(e,t){let s=t.low_threshold??20;return e<=s?"bad":e<=s+20?"warn":"good"}_levelBar(e){let t=e.level;return t==null?o:a`<span class="bf-bar" aria-hidden="true"
      ><span class="bf-bar-fill bf-bar-${this._levelTone(t,e)}" style="width: ${Math.min(100,Math.max(0,t))}%"></span
    ></span>`}_jumpButton(e,t){let s=this._history?.[e.entity_id]?.jump;return!s||this._recorded.includes(e.entity_id)?o:a`<button
      class="bf-mark bf-jump"
      title=${r("battery_fleet_record_replacement",t).replace("{date}",this._fmtDate(s.at*1e3))}
      .disabled=${this._marking}
      @click=${()=>this._recordJump(e.entity_id,s)}
    >
      <ha-icon icon="mdi:calendar-sync"></ha-icon>
    </button>`}_renderRow(e,t,s){let i=e.available===!1?a`<span class="bf-offline">${r("battery_fleet_offline",t)}</span>`:e.no_sensor?a`<span class="bf-offline bf-nosensor">${r("battery_fleet_no_sensor",t)}</span>`:o,l=`${e.quantity}\xD7 ${e.battery_type}`,h=a`<span class="bf-type" title=${l}>${l}</span>`,p=this._canWrite,y=p&&(s.mark==="always"||e.no_sensor||e.can_mark_replaced),u=this._forecastDays(e);return a`
      <div class="bf-row">
        <span class="bf-dev">${e.device_name}</span>
        ${s.status?a`<span class="bf-status bf-${e.status}"
                >${e.no_sensor&&e.status==="low"?r("battery_fleet_status_due",t):r("battery_fleet_status_"+e.status,t)}</span
              >${h}${i}`:a`${i}${h}`}
        ${s.recharge&&e.rechargeable?a`<span class="bf-recharge" title=${r("battery_fleet_rechargeable",t)}
              ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
            ></span>`:o}
        ${s.sparkline?this._sparkline(e):o}
        ${this._levelBar(e)}
        ${e.level!=null?a`<span class="bf-level bf-level-${this._levelTone(e.level,e)}">${e.level}%</span>`:o}
        ${y?a`<button
              class="bf-mark${s.mark==="replaced"?" bf-replaced":""}"
              title=${e.rechargeable?r("battery_fleet_mark_recharged",t):r("battery_fleet_mark_one",t)}
              .disabled=${this._marking}
              @click=${()=>this._markOne(e,s.list)}
            >
              <ha-icon icon="mdi:battery-sync"></ha-icon>
            </button>`:o}
        ${s.jump&&p?this._jumpButton(e,t):o}
        ${s.predicted&&u!=null?a`<span
              class="bf-predicted ${e.predicted_source==="trend"?"bf-trend":""} ${e.forecast_overdue?"bf-overdue":""} ${e.forecast_overdue&&e.status==="ok"?"bf-quiet":""}"
              title=${this._predictedTitle(e,t)}
              >${e.forecast_overdue?a`<ha-icon icon="mdi:calendar-alert"></ha-icon>`:o}~${this._predictedDate(u)}</span
            >`:o}
        ${s.exclude&&p?a`<button
              class="bf-mark bf-exclude"
              title=${r("battery_fleet_exclude",t)}
              .disabled=${this._marking}
              @click=${()=>this._setExcluded(e.entity_id,!0)}
            >
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>
            </button>`:o}
      </div>
      ${this._renderCellChooser(e,s.list,t)}
    `}render(){let e=this._lang;if(this._loading&&this._ov===null)return a`<div class="bf-card"><div class="bf-loading">…</div></div>`;let t=this._ov;if(!t)return this._error?a`<div class="bf-card"><div class="bf-error">${this._error}</div></div>`:o;let s=t.low.length;return a`
      <div class="bf-card">
        <div class="bf-head">
          <ha-icon icon="mdi:battery-alert"></ha-icon>
          <span class="bf-title">${r("battery_fleet_title",e)}</span>
          <span class="bf-count ${s?"bad":"ok"}">${s}</span>
        </div>
        ${this._error?a`<div class="bf-error">${this._error}</div>`:o}

        ${t.configured&&t.task_ok===!1?a`
              <div class="bf-repair">
                <span>${r("battery_fleet_trigger_lost",e)}</span>
                ${this._canWrite?a`<ha-button .disabled=${this._marking} @click=${this._repair}>
                      ${r("battery_fleet_repair",e)}
                    </ha-button>`:o}
              </div>
            `:o}

        ${s===0?a`<div class="bf-empty">${r("battery_fleet_none_low",e)}</div>`:a`
              <div class="bf-shopping">
                <span class="bf-label">${r("battery_fleet_buy_now",e)}</span>
                <span class="bf-list">${this._shoppingLine(t.needs_now)}</span>
              </div>
              <div class="bf-rows">
                ${t.low.map(i=>this._renderRow(i,e,{list:"low",recharge:!0,mark:"always",exclude:!0}))}
              </div>
              ${this._canWrite?a`<div class="bf-actions">
                    <ha-button .disabled=${this._marking} @click=${this._markAll}>
                      <ha-icon icon="mdi:battery-sync"></ha-icon> ${r("battery_fleet_mark_all",e)}
                    </ha-button>
                  </div>`:o}
            `}

        ${t.charging?.length?a`
              <div class="bf-charging">
                <span class="bf-label">${r("battery_fleet_charging",e)}</span>
                ${t.charging.map(i=>a`<span class="bf-charge-item">
                    <span class="bf-charge-name">${i.name}</span>
                    <span>${r("battery_fleet_ready",e).replace("{count}",m(i.stock,e))}</span>
                    ${i.restoring>0?a`<span class="bf-charge-waiting">${B(i.reuse,i.restoring,e)}</span>
                          ${this._canWrite?a`<button
                                class="bf-charged"
                                title=${r("part_ready_again_hint",e)}
                                .disabled=${this._marking}
                                @click=${()=>this._act({type:"maintenance_supporter/part/ready_again",entry_id:t.entry_id,part_id:i.part_id})}
                              ><ha-icon icon="mdi:battery-charging-100"></ha-icon>${r(`part_reuse_${i.reuse}`,e)}</button>
                              ${this._renderDispose(t.entry_id,i,e)}`:o}`:o}
                  </span>`)}
              </div>
            `:o}
        ${t.soon.length?a`
              <div class="bf-soon">
                <span class="bf-label">${r("battery_fleet_soon",e)}</span>
                <span class="bf-list">${this._shoppingLine(t.needs_soon)}</span>
                <div class="bf-soon-hint">${r("battery_fleet_soon_hint",e)}</div>
              </div>
              <div class="bf-rows bf-soon-rows">
                ${t.soon.map(i=>this._renderRow(i,e,{list:"soon",mark:"replaced",predicted:!0}))}
              </div>
            `:o}
        ${t.all?.length?a`
              ${F({cls:"bf-roster",open:this._rosterOpen(),onToggle:this._loadHistory,header:a`${r("battery_fleet_all",e)} (${t.all.length})`},a`
                <div class="bf-roster-tools">
                  <button
                    class="bf-sort ${this._rosterSort==="urgency"?"bf-sort-active":""}"
                    @click=${()=>this._setSort("urgency")}
                  >
                    ${r("battery_fleet_sort_urgency",e)}
                  </button>
                  <button
                    class="bf-sort ${this._rosterSort==="name"?"bf-sort-active":""}"
                    @click=${()=>this._setSort("name")}
                  >
                    ${r("battery_fleet_sort_name",e)}
                  </button>
                </div>
                <div class="bf-rows">
                  ${this._sortedRoster(t.all).map(i=>this._renderRow(i,e,{list:"roster",status:!0,recharge:!0,sparkline:!0,mark:"replaced",jump:!0,predicted:!0,exclude:!0}))}
                </div>
                <div class="bf-roster-hint">${r("battery_fleet_all_hint",e)}</div>
                ${this._canWrite?this._renderRosterSettings(t,e):o}
              `)}
            `:o}
        ${this._renderExcluded(t,e)}
        <div class="bf-total">${r("battery_fleet_total",e).replace("{n}",String(t.total))}</div>
      </div>
    `}_renderRosterSettings(e,t){return a`
                <div class="bf-add">
                  <span class="bf-label">${r("battery_fleet_add",t)}</span>
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${J}
                    .value=${""}
                    @value-changed=${this._addBattery}
                  ></ha-selector>
                  <div class="bf-roster-hint">${r("battery_fleet_add_hint",t)}</div>
                </div>
                ${g({cls:"bf-track-self",checked:!!e.track_self_charging,disabled:this._marking,onChange:this._setTrackSelf},a`${r("battery_fleet_track_self",t)}`)}
                <div class="bf-roster-hint">${r("battery_fleet_track_self_hint",t)}</div>
                ${g({cls:"bf-track-self bf-due-nosensor",checked:e.due_without_sensor!==!1,disabled:this._marking,onChange:this._setDueWithoutSensor},a`${r("battery_fleet_due_without_sensor",t)}`)}
                <div class="bf-roster-hint">${r("battery_fleet_due_without_sensor_hint",t)}</div>
                ${g({cls:"bf-track-self bf-ask-cells",checked:!!e.ask_cells,disabled:this._marking,onChange:this._setAskCells},a`${r("battery_fleet_ask_cells",t)}`)}
                <div class="bf-roster-hint">${r("battery_fleet_ask_cells_hint",t)}</div>
    `}_renderExcluded(e,t){return a`
        ${e.excluded?.length?a`
              <div class="bf-excluded">
                <span class="bf-label">${r("battery_fleet_excluded",t)}</span>
                ${e.excluded.map(s=>a`
                    <span class="bf-excluded-chip">
                      ${s.device_name}
                      ${this._canWrite?a`<button
                            class="bf-mark"
                            title=${r("battery_fleet_include",t)}
                            .disabled=${this._marking}
                            @click=${()=>this._setExcluded(s.entity_id,!1)}
                          >
                            <ha-icon icon="mdi:eye-outline"></ha-icon>
                          </button>`:o}
                    </span>
                  `)}
              </div>
            `:o}
    `}};n.styles=O`
    /* The query container of the row layout (see "In a narrow list" below):
     * the list's own width, not the screen's. */
    .bf-card {
      container: bf-fleet / inline-size;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color);
      border-radius: var(--ms-radius-10, 10px);
      padding: 14px 16px;
      margin: 12px 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    :host([flat]) .bf-card {
      background: transparent;
      border: none;
      border-radius: 0;
      margin: 0;
      padding: 0;
    }
    .bf-head {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
    .bf-title {
      flex: 1;
    }
    .bf-count {
      font-size: 13px;
      padding: 1px 9px;
      border-radius: var(--ms-radius-10, 10px);
    }
    .bf-count.bad {
      background: var(--error-color, #f44336);
      color: #fff;
    }
    .bf-count.ok {
      background: var(--success-color, #4caf50);
      color: #fff;
    }
    .bf-error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .bf-repair {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 8px 10px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--warning-color, #ff9800) 12%, transparent);
      font-size: 13px;
    }
    .bf-empty {
      color: var(--secondary-text-color);
      font-size: 14px;
    }
    .bf-shopping,
    .bf-soon {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 8px;
    }
    .bf-charging {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
    }
    .bf-charge-item {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      padding: 2px 8px;
      border-radius: 12px;
      background: var(--secondary-background-color, #eee);
      font-size: 13px;
    }
    .bf-charge-name {
      font-weight: 500;
    }
    .bf-charge-waiting {
      color: var(--warning-color, #f57c00);
    }
    .bf-charged {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font: inherit;
      font-size: 12px;
      min-height: 28px;
      padding: 2px 10px;
      border-radius: 14px;
      border: 1px solid var(--primary-color);
      background: transparent;
      color: var(--primary-color);
      cursor: pointer;
    }
    .bf-charged ha-icon {
      --mdc-icon-size: 16px;
    }
    .bf-dispose {
      border-color: var(--divider-color, #ccc);
      color: var(--secondary-text-color);
    }
    .bf-dispose.confirm {
      border-color: var(--error-color, #db4437);
      color: var(--error-color, #db4437);
    }
    .bf-dispose-qty {
      width: 56px;
      padding: 4px;
      font: inherit;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .bf-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--secondary-text-color);
    }
    .bf-list {
      font-weight: 500;
    }
    /* Cross-row column alignment (same subgrid pattern as the task table,
     * issue 66): the LIST owns one column template, every row spans it via
     * subgrid, and each element is PINNED to its column below - so an
     * optional element (sparkline, percentage, forecast date) leaves its
     * column empty instead of letting the rest of the row drift. max-content
     * columns collapse to 0 when a whole list never fills them (the low list
     * has no status chip, no sparkline, no date). */
    .bf-rows {
      display: grid;
      /* The right-hand columns (percentage, action, date, eye) have a
       * minimum width, so they line up across the three lists ("Buy now",
       * "Needed soon", the roster) although each list is a grid of its own
       * and fills different columns - only the roster has the eye, and its
       * dates used to end 32 px left of the soon list's. */
      grid-template-columns:
        minmax(0, 1fr) repeat(5, max-content)
        minmax(40px, max-content) minmax(32px, max-content) minmax(92px, max-content) minmax(32px, max-content);
      column-gap: 8px;
    }
    .bf-row {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: 1 / -1;
      align-items: center;
      padding: 6px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    /* Column pinning: 1 name, 2 status/offline chip, 3 type, 4 charging
     * icon, 5 sparkline, 6 level bar, 7 percentage, 8 row action
     * (mark-one / record-swap), 9 forecast date, 10 exclude eye. */
    .bf-dev {
      grid-column: 1;
      min-width: 0;
    }
    .bf-offline,
    .bf-status {
      grid-column: 2;
      justify-self: end;
    }
    .bf-type {
      grid-column: 3;
    }
    .bf-recharge {
      grid-column: 4;
    }
    .bf-spark {
      grid-column: 5;
    }
    .bf-bar {
      grid-column: 6;
    }
    /* D#162: the roster's "No sensor" / offline chip takes the level bar's
     * slot (such a row has no bar); column 2 stays the status chip's. */
    .bf-status + .bf-type + .bf-offline {
      grid-column: 6;
      justify-self: start;
      white-space: nowrap;
    }
    .bf-level {
      grid-column: 7;
      justify-self: end;
    }
    /* Every row action, the Replaced one included, sits in column 8. The
     * Replaced action used to take the empty percentage slot on sensorless
     * rows (D#162, while nothing else filled column 8) and column 8 on rows
     * with a percentage (since 2.79), so it jumped 40 px between
     * neighbouring rows (prod report 2026-10-13). Rows with a percentage
     * fill column 8 anyway, so one column for all costs no width. The
     * narrow layout below gives Replaced a slot of its own. */
    .bf-row .bf-mark {
      grid-column: 8;
    }
    .bf-predicted {
      grid-column: 9;
      justify-self: end;
    }
    .bf-row .bf-mark.bf-exclude {
      grid-column: 10;
    }
    .bf-offline {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-style: italic;
    }
    /* Every row shares the list's columns, so ONE long type ("1× BATTERY
     * PACK") widened the type column of all of them (D#162): it stops at
     * 12em and ends in an ellipsis, the full text is the tooltip. */
    .bf-type {
      color: var(--secondary-text-color);
      font-size: 13px;
      max-width: 12em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .bf-recharge {
      color: var(--secondary-text-color);
      display: inline-flex;
      cursor: help;
    }
    .bf-recharge ha-icon {
      --mdc-icon-size: 16px;
    }
    .bf-spark {
      width: 110px;
      height: 24px;
      flex: 0 0 auto;
      cursor: help;
    }
    /* In a narrow list the row cannot fit name + chips + curve + bar + date
     * in ONE line: the decorations yield (the percentage still carries the
     * number) and the row wraps to two lines - the name spans the full
     * width, the status chip moves under it (left, into the name column)
     * and the rest keeps its pinned subgrid column, so type / percentage /
     * date / eye stay aligned across rows. Without this the fixed
     * max-content columns overflowed 400 px and the chips overlapped the
     * wrapped names.
     *
     * The LIST's width decides, not the screen's (D#162): the Lovelace card
     * sits in a dashboard column of 400-500 px on a wide screen, kept the
     * one-line layout there and cut off the badge, the date and the hide
     * button. 680 px of list is where the one-line rows stop fitting;
     * desktop task pages (700 px and more) keep them. */
    @container bf-fleet (max-width: 680px) {
      .bf-spark,
      .bf-bar {
        display: none;
      }
      /* No fixed gaps: a column a phone leaves empty (status chip moved,
       * curve and bar hidden) cost its 8 px gap all the same, and together
       * with one long type the rows ran 25 px past a 402 px phone. Each
       * occupied column brings its own 6 px instead, and the type column
       * may shrink - its text ends in an ellipsis. */
      .bf-rows {
        column-gap: 0;
        grid-template-columns: minmax(0, 1fr) max-content minmax(0, max-content) repeat(7, max-content);
      }
      .bf-row > :not(.bf-dev) {
        margin-inline-start: 6px;
      }
      .bf-row {
        row-gap: 2px;
      }
      .bf-dev {
        grid-column: 1 / 9;
        grid-row: 1;
      }
      .bf-offline,
      .bf-status {
        /* Line 1, RIGHT - over the date+eye columns, which are wide enough
         * for any chip. Pinning the chip into the 1fr rest column instead
         * overlapped the type text (the rest column shrinks below chip
         * width, and a span onto an fr track never grows fixed tracks). */
        grid-column: 9 / 11;
        grid-row: 1;
        justify-self: end;
      }
      /* The column shrinks, the ellipsis comes from the base rule (a cap in
       * vw measured the screen, not the list). */
      .bf-type {
        grid-row: 2;
      }
      .bf-recharge,
      .bf-level,
      .bf-predicted,
      .bf-row .bf-mark {
        grid-row: 2;
      }
      /* Phone (D#162, maisun): the percentage belongs to the name line - it
       * is what you scan for - and the Replaced action to line 2 with type
       * and date. A row WITH a percentage therefore lifts it to line 1 (the
       * name yields column 8; in the "Needed soon" list, which has no status
       * chip, it takes the chip's place at the right edge) and the action
       * takes the percentage's slot on line 2 - the same slot a sensorless
       * row uses, so every row's action lines up. Before, the action shared
       * the slot with the percentage and painted over it. */
      .bf-row .bf-level {
        grid-row: 1;
        grid-column: 8;
        justify-self: end;
      }
      .bf-soon-rows .bf-row .bf-level {
        grid-column: 9 / 11;
      }
      .bf-row:has(.bf-level) .bf-dev {
        grid-column: 1 / 8;
      }
      .bf-soon-rows .bf-row:has(.bf-level) .bf-dev {
        grid-column: 1 / 9;
      }
      .bf-row .bf-mark.bf-replaced {
        grid-row: 2;
        grid-column: 7;
        justify-self: end;
      }
      /* The roster's "No sensor" chip would widen the shared bar track
       * for EVERY row (subgrid) - on phones the missing percentage and
       * the "Due" status already tell the story, so it yields like the
       * bar and the sparkline do. */
      .bf-status + .bf-type + .bf-offline {
        display: none;
      }
    }
    .bf-spark-line {
      fill: none;
      stroke: var(--primary-color);
      stroke-width: 1.5;
      stroke-linejoin: round;
    }
    .bf-spark-proj {
      stroke: var(--primary-color);
      stroke-width: 1.2;
      stroke-dasharray: 2 3;
      opacity: 0.7;
    }
    .bf-spark-th {
      stroke: var(--error-color, #f44336);
      stroke-width: 1;
      opacity: 0.35;
    }
    .bf-type-chip {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: var(--ms-radius-10, 10px);
      padding: 1px 8px;
      margin: 0 4px 2px 0;
      font-size: 13px;
      color: inherit;
      cursor: pointer;
    }
    .bf-type-chip-active {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .bf-bar {
      width: 30px;
      height: 6px;
      border-radius: 3px;
      background: var(--divider-color);
      overflow: hidden;
      flex: 0 0 auto;
    }
    .bf-bar-fill {
      display: block;
      height: 100%;
      border-radius: 3px;
    }
    .bf-bar-good {
      background: var(--success-color, #4caf50);
    }
    .bf-bar-warn {
      background: var(--warning-color, #ff9800);
    }
    .bf-bar-bad {
      background: var(--error-color, #f44336);
    }
    .bf-jump ha-icon {
      color: var(--warning-color, #ff9800);
    }
    .bf-roster-tools {
      display: flex;
      gap: 6px;
      margin: 8px 0 2px;
    }
    .bf-sort {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      padding: 2px 10px;
      font-size: 12px;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .bf-sort-active {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    /* The number takes the bar's colour. It was red on every row, from the
     * days it only showed in the low list; the soon list and the roster
     * show it too, and a full battery read as an alarm there (prod report
     * 2026-10-13). A healthy level is plain text. */
    .bf-level {
      font-size: 12px;
    }
    .bf-level-bad {
      color: var(--error-color, #f44336);
    }
    .bf-level-warn {
      color: var(--warning-color, #ff9800);
    }
    .bf-mark {
      background: transparent;
      border: none;
      color: var(--primary-color);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: inline-flex;
    }
    .bf-mark:hover {
      background: var(--secondary-background-color);
    }
    .bf-actions {
      display: flex;
      justify-content: flex-end;
    }
    .bf-soon {
      border-top: 1px solid var(--divider-color);
      padding-top: 8px;
    }
    .bf-soon-hint {
      width: 100%;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    /* The roster is a lookup list, not the headline — collapsed by default so
       the section still opens on what actually needs doing. */
    .bf-roster > summary {
      cursor: pointer;
      font-size: 13px;
      color: var(--secondary-text-color);
      padding: 2px 0;
    }
    /* D#213: which cells went in — under the battery's row, across the
     * list's grid (in one column it squeezed into the name's). */
    .bf-cells {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin: 4px 0 8px;
      padding: 8px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }
    .bf-cells-q { font-size: 12px; font-weight: 500; color: var(--secondary-text-color); }
    .bf-cell-choice { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; }
    .bf-cell-choice input { width: 16px; height: 16px; margin: 0; }
    .bf-cell-tag {
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 8px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
    }
    .bf-cells-actions { display: flex; justify-content: flex-end; gap: 8px; }
    .bf-cells-actions button {
      padding: 6px 12px;
      border-radius: var(--ms-radius-6, 6px);
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
      cursor: pointer;
    }
    .bf-cells-actions .bf-cells-ok {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .bf-roster-hint {
      font-size: 12px;
      color: var(--secondary-text-color);
      padding-top: 6px;
    }
    .bf-status {
      font-size: 11px;
      padding: 1px 7px;
      border-radius: 9px;
      white-space: nowrap;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      color: var(--secondary-text-color);
    }
    .bf-status.bf-low {
      background: var(--error-color, #f44336);
      color: #fff;
    }
    .bf-status.bf-soon {
      background: var(--warning-color, #ff9800);
      color: #fff;
    }
    .bf-predicted {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    /* Trend-based dates (discharge regression) get a dotted underline — the
       tooltip carries source + confidence. */
    .bf-predicted.bf-trend {
      text-decoration: underline dotted;
      text-underline-offset: 2px;
    }
    /* B1: passed prediction on a still-healthy battery — warn-tinted with a
       calendar-alert icon; the tooltip explains (record the swap / forecast
       was off). Deliberately NOT red: this is a discrepancy, not an alarm. */
    .bf-predicted.bf-overdue {
      color: var(--warning-color, #ff9800);
    }
    /* #223: the level reads healthy, so the passed type lifetime is only a
       hint — the row is OK. */
    .bf-predicted.bf-overdue.bf-quiet {
      color: var(--secondary-text-color);
    }
    .bf-predicted.bf-overdue ha-icon {
      --mdc-icon-size: 14px;
      margin-right: 2px;
    }
    .bf-total {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .bf-exclude {
      color: var(--secondary-text-color);
    }
    .bf-excluded {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      border-top: 1px solid var(--divider-color);
      padding-top: 8px;
    }
    .bf-excluded-chip {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 12px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: var(--ms-radius-10, 10px);
      padding: 1px 4px 1px 10px;
    }
    .bf-track-self {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      font-size: 13px;
      cursor: pointer;
    }
    .bf-track-self input {
      accent-color: var(--primary-color);
      margin: 0;
    }
  `,c([R({attribute:!1})],n.prototype,"hass",2),c([R({type:Boolean})],n.prototype,"flat",2),c([d()],n.prototype,"_ov",2),c([d()],n.prototype,"_loading",2),c([d()],n.prototype,"_marking",2),c([d()],n.prototype,"_choosing",2),c([d()],n.prototype,"_error",2),c([d()],n.prototype,"_disposeFor",2),c([d()],n.prototype,"_disposeQty",2),c([d()],n.prototype,"_history",2),c([d()],n.prototype,"_rosterSort",2),c([d()],n.prototype,"_typeFilter",2),c([d()],n.prototype,"_recorded",2),c([d()],n.prototype,"_access",2);var D=n;customElements.get("maintenance-battery-fleet-section")||customElements.define("maintenance-battery-fleet-section",D);export{D as MaintenanceBatteryFleetSection};
