/*! maintenance_supporter frontend 2.120.0 */
import{b as j}from"/maintenance_supporter_cardfiles/card-chunks/chunk-SBFM4ZR6.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-D5QGR7V4.js";import{a as x,b as d}from"/maintenance_supporter_cardfiles/card-chunks/chunk-R4OGP3RP.js";import{a as r,b as u,e as o,h,j as w,n as $,w as y,x as i}from"/maintenance_supporter_cardfiles/card-chunks/chunk-2JUL7K7P.js";var n=class extends w{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"};this._objects=[];this._loadingObjects=!0;this._loadError=!1;this._views=[];this._objectsLoaded=!1;this._applySimplePreset=()=>{let t={...this._config,compact:!0,action_style:"icons",show_actions:!0,show_create:!1,show_assignee:!0,show_documents:!1};this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t}}))};this._onEntitiesChanged=t=>{this._valueChanged("entity_ids",t.detail.value||[])}}get _lang(){return y(this.hass)}setConfig(t){this._config={...t}}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._objectsLoaded&&(this._objectsLoaded=!0,this._loadObjects())}async _loadObjects(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._objects=t.objects||[],this._loadError=!1}catch{this._objects=[],this._loadError=!0}this._loadingObjects=!1;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"});this._views=t.views||[]}catch{this._views=[]}}_valueChanged(t,l){let s={...this._config,[t]:l};(Array.isArray(l)&&l.length===0||l===""||l===void 0||l===null)&&delete s[t],this._config=s,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s}}))}_toggleStatus(t,l){let s=new Set(this._config.filter_status||[]);l?s.add(t):s.delete(t),this._valueChanged("filter_status",[...s])}_toggleObject(t,l,s){let c=new Set(this._config.filter_objects||[]);c.delete(l),s?c.add(t):c.delete(t),this._valueChanged("filter_objects",[...c])}_dropStale(t,l){this._valueChanged(t,(this._config[t]||[]).filter(s=>s!==l))}_toggleLabel(t,l){let s=new Set(this._config.filter_labels||[]);l?s.add(t):s.delete(t),this._valueChanged("filter_labels",[...s])}_toggleArea(t,l){let s=new Set(this._config.filter_areas||[]);l?s.add(t):s.delete(t),this._valueChanged("filter_areas",[...s])}_togglePriority(t,l){let s=new Set(this._config.filter_priority||[]);l?s.add(t):s.delete(t),this._valueChanged("filter_priority",[...s])}_staleRow(t,l){return o`
      <label class="object-row stale">
        <input type="checkbox" .checked=${!0} @change=${()=>this._dropStale(t,l)} />
        <span>${l}</span>
      </label>
    `}render(){let t=this._lang,l=new Set(this._config.filter_status||[]),s=new Set(this._config.filter_objects||[]),c=[...this._objects].map(e=>({entryId:e.entry_id,name:e.object.name,checked:s.has(e.entry_id)||s.has(e.object.name)})).sort((e,a)=>e.name.localeCompare(a.name)),k=new Set(this._objects.flatMap(e=>[e.entry_id,e.object.name])),f=[...s].filter(e=>!k.has(e)),v=new Set(this._config.filter_areas||[]),E=[...new Set(this._objects.map(e=>e.object.area_id).filter(e=>!!e).concat([...v]))],C=e=>this.hass?.areas?.[e]?.name||e,g=E.map(e=>({id:e,name:C(e)})).sort((e,a)=>e.name.localeCompare(a.name)),b=new Set(this._config.filter_labels||[]),L=new Set(this._config.filter_priority||[]),p=[...new Set(this._objects.flatMap(e=>e.tasks.flatMap(a=>a.labels||[])))].sort((e,a)=>e.localeCompare(a)),m=[...b].filter(e=>!p.includes(e)),_=[];for(let e of this._objects)for(let a of e.tasks)a.sensor_entity_id&&_.push(a.sensor_entity_id),a.binary_sensor_entity_id&&_.push(a.binary_sensor_entity_id);return o`
      <div class="editor">
        <ms-textfield
          class="card-title"
          label="${i("card_title",t)}"
          .value=${this._config.title||""}
          @input=${e=>this._valueChanged("title",e.target.value)}
        ></ms-textfield>

        <!-- #234: a starting point for a kitchen tablet; every option stays its own -->
        <div class="field simple-preset">
          <button type="button" class="preset-btn" @click=${this._applySimplePreset}>${i("card_simple_preset",t)}</button>
          <div class="field-help">${i("card_simple_preset_help",t)}</div>
        </div>

        <!-- Status filter (chip row) -->
        <div class="field">
          <div class="field-label">${i("card_filter_status",t)}</div>
          <div class="chip-row">
            ${$.map(e=>o`
              <label class="chip ${l.has(e)?"active":""}">
                <input type="checkbox"
                  .checked=${l.has(e)}
                  @change=${a=>this._toggleStatus(e,a.target.checked)} />
                ${i(e,t)}
              </label>
            `)}
          </div>
          <div class="field-help">${i("card_filter_status_help",t)}</div>
        </div>

        <!-- Object filter (multi-checkbox) -->
        <div class="field">
          <div class="field-label">${i("card_filter_objects",t)}</div>
          ${this._loadingObjects?o`<div class="field-help">${i("card_loading_objects",t)}</div>`:this._loadError?o`<div class="field-help error-text">${i("card_load_error",t)}</div>`:c.length===0&&f.length===0?o`<div class="field-help">${i("no_objects",t)}</div>`:o`
                <div class="object-list">
                  ${c.map(e=>o`
                    <label class="object-row">
                      <input type="checkbox"
                        .checked=${e.checked}
                        @change=${a=>this._toggleObject(e.entryId,e.name,a.target.checked)} />
                      <span>${e.name}</span>
                    </label>
                  `)}
                  ${f.map(e=>this._staleRow("filter_objects",e))}
                </div>
                <div class="field-help">${i("card_filter_objects_help",t)}</div>
              `}
        </div>
        <!-- Area filter (C8): selects whole objects by the room they sit in.
             Hidden while no object has an area — the section would be an
             empty box otherwise. -->
        ${g.length?o`
        <div class="field">
          <div class="field-label">${i("card_filter_areas",t)}</div>
          <div class="object-list">
            ${g.map(e=>o`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${v.has(e.id)}
                  @change=${a=>this._toggleArea(e.id,a.target.checked)} />
                <span>${e.name}</span>
              </label>
            `)}
          </div>
          <div class="field-help">${i("card_filter_areas_help",t)}</div>
        </div>`:h}
        ${p.length||m.length?o`
        <div class="field">
          <div class="field-label">${i("labels",t)}</div>
          <div class="object-list">
            ${p.map(e=>o`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${b.has(e)}
                  @change=${a=>this._toggleLabel(e,a.target.checked)} />
                <span>${e}</span>
              </label>
            `)}
            ${m.map(e=>this._staleRow("filter_labels",e))}
          </div>
        </div>`:h}
        <div class="field">
          <div class="field-label">${i("priority",t)}</div>
          <div class="object-list">
            ${j.map(e=>o`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${L.has(e)}
                  @change=${a=>this._togglePriority(e,a.target.checked)} />
                <span>${i(`priority_${e}`,t)}</span>
              </label>
            `)}
          </div>
          <div class="field-help">${i("card_filter_priority_help",t)}</div>
        </div>

        <!-- Entity-id filter (HA-native pattern). Limited to our integration's
             sensor + binary_sensor entities via includeEntities so the picker
             stays usable on installs with thousands of entities. -->
        <div class="field">
          <div class="field-label">${i("card_filter_entities",t)}</div>
          <ha-entities-picker
            .hass=${this.hass}
            .value=${this._config.entity_ids||[]}
            .includeDomains=${["sensor","binary_sensor"]}
            .includeEntities=${_}
            @value-changed=${this._onEntitiesChanged}
          ></ha-entities-picker>
          <div class="field-help">${i("card_filter_entities_help",t)}</div>
        </div>

        <!-- Saved-view scope (v2.26): applies the view's status/user/label
             filters on top of everything above. Hidden while no views exist —
             views are created in the panel toolbar, not here. -->
        ${this._views.length>0?o`
              <div class="field">
                <div class="field-label">${i("card_saved_view",t)}</div>
                <select
                  class="view-select"
                  .value=${this._config.view_id||""}
                  @change=${e=>this._valueChanged("view_id",e.target.value)}
                >
                  <option value="" ?selected=${!this._config.view_id}>
                    ${i("card_saved_view_none",t)}
                  </option>
                  ${this._views.map(e=>o`<option value=${e.id} ?selected=${this._config.view_id===e.id}>
                      ${e.name}
                    </option>`)}
                </select>
                <div class="field-help">${i("card_saved_view_help",t)}</div>
              </div>
            `:h}

        <ha-formfield label="${i("card_show_header",t)}">
          <ha-switch
            .checked=${this._config.show_header!==!1}
            @change=${e=>this._valueChanged("show_header",e.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${i("card_show_actions",t)}">
          <ha-switch
            .checked=${this._config.show_actions!==!1}
            @change=${e=>this._valueChanged("show_actions",e.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${i("card_show_create",t)}">
          <ha-switch
            class="show-create"
            .checked=${this._config.show_create??this._config.show_actions!==!1}
            @change=${e=>this._valueChanged("show_create",e.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <label class="editor-select">
          <span>${i("card_action_style",t)}</span>
          <select
            .value=${this._config.action_style??""}
            @change=${e=>{let a=e.target.value;this._valueChanged("action_style",a===""?void 0:a)}}
          >
            <option value="" ?selected=${!this._config.action_style}>${i("row_actions_follow",t)}</option>
            <option value="buttons" ?selected=${this._config.action_style==="buttons"}>${i("row_actions_buttons",t)}</option>
            <option value="icons" ?selected=${this._config.action_style==="icons"}>${i("row_actions_icons",t)}</option>
          </select>
        </label>

        <ha-formfield label="${i("responsible_user",t)}">
          <ha-switch
            .checked=${this._config.show_assignee!==!1}
            @change=${e=>this._valueChanged("show_assignee",e.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${i("documents",t)}">
          <ha-switch
            .checked=${this._config.show_documents!==!1}
            @change=${e=>this._valueChanged("show_documents",e.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${i("card_compact",t)}">
          <ha-switch
            .checked=${this._config.compact||!1}
            @change=${e=>this._valueChanged("compact",e.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ms-textfield
          class="card-max-items"
          label="${i("card_max_items",t)}"
          type="number"
          .value=${String(this._config.max_items||0)}
          @input=${e=>this._valueChanged("max_items",parseInt(e.target.value,10)||0)}
        ></ms-textfield>
        ${h}
      </div>
    `}};n.styles=u`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
    ha-textfield, ms-textfield { display: block; }
    .simple-preset { gap: 4px; }
    .preset-btn {
      align-self: flex-start;
      padding: 6px 12px;
      border: 1px solid var(--primary-color);
      border-radius: 18px;
      background: none;
      color: var(--primary-color);
      font: inherit;
      cursor: pointer;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .field-label {
      font-size: 13px;
      color: var(--secondary-text-color);
      font-weight: 500;
    }
    .field-help {
      font-size: 12px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
    .field-help.error-text {
      color: var(--error-color, #f44336);
      font-style: normal;
    }
    .chip-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 14px;
      cursor: pointer;
      font-size: 13px;
      user-select: none;
      transition: background 0.15s, border-color 0.15s;
    }
    .chip:hover {
      background: var(--secondary-background-color);
    }
    .chip.active {
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-color: var(--primary-color);
    }
    .chip input {
      display: none;
    }
    .object-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 4px 12px;
      padding: 6px 0;
    }
    .object-row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 3px 0;
      font-size: 13px;
      cursor: pointer;
    }
    .object-row input { cursor: pointer; }
    .object-row.stale span { text-decoration: line-through; opacity: 0.7; }
    .view-select {
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
      max-width: 320px;
    }
  `,r([x({attribute:!1})],n.prototype,"hass",2),r([d()],n.prototype,"_config",2),r([d()],n.prototype,"_objects",2),r([d()],n.prototype,"_loadingObjects",2),r([d()],n.prototype,"_loadError",2),r([d()],n.prototype,"_views",2);customElements.get("maintenance-supporter-card-editor")||customElements.define("maintenance-supporter-card-editor",n);export{n as MaintenanceSupporterCardEditor};
