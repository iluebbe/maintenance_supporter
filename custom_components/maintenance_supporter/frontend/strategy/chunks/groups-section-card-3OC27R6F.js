/*! maintenance_supporter frontend 2.44.1 */
import{a as m}from"./chunk-Q3BTBH54.js";import{a as u,b as s,d as l,e as h,f as g,g as o,i,k as _,t as p}from"./chunk-2OBAYYQP.js";import{a}from"./chunk-KRBXISES.js";var e=class extends h{constructor(){super(...arguments);this._config={type:""};this._groups={};this._loaded=!1;this._busy=!1;this._error="";this._newName="";this._editingId=null;this._editingName="";this._hasInitiallyLoaded=!1}setConfig(t){this._config=t}getCardSize(){return 2}get _lang(){return this.hass?.language||"en"}get _isAdmin(){return this.hass?.user?.is_admin??!0}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._hasInitiallyLoaded&&(this._hasInitiallyLoaded=!0,this._load(),_(this._lang).then(()=>this.requestUpdate()))}async _load(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"});this._groups=t.groups||{},this._loaded=!0}catch(t){this._error=p(t,this._lang)}}async _addGroup(){if(!this._isAdmin)return;let t=this._newName.trim();if(t){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/create",name:t}),this._newName="",await this._load()}catch(r){this._error=p(r,this._lang)}finally{this._busy=!1}}}_startEdit(t){this._editingId=t,this._editingName=this._groups[t]?.name||""}async _saveEdit(){if(!this._isAdmin||!this._editingId)return;let t=this._editingName.trim();if(t){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/update",group_id:this._editingId,name:t}),this._editingId=null,this._editingName="",await this._load()}catch(r){this._error=p(r,this._lang)}finally{this._busy=!1}}}async _deleteGroup(t,r){if(!this._isAdmin)return;let n=(i("group_delete_confirm",this._lang)||'Delete group "{name}"?').replace("{name}",r);if(window.confirm(n)){this._busy=!0;try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/delete",group_id:t}),await this._load()}catch(d){this._error=p(d,this._lang)}finally{this._busy=!1}}}_onDeepLink(){history.pushState(null,"","/maintenance-supporter?ms_action=open_groups"),window.dispatchEvent(new CustomEvent("location-changed"))}_onKeyDown(t,r){t.key==="Enter"?(t.preventDefault(),r()):t.key==="Escape"&&(t.preventDefault(),this._editingId=null,this._editingName="")}render(){let t=this._lang;if(!this._loaded)return s`<ha-card><div class="loading">${i("loading",t)||"Loading\u2026"}</div></ha-card>`;let r=Object.keys(this._groups);return s`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">
              <span class="emoji">🏷️</span>
              <span>${this._config.title||i("groups",t)||"Groups"}</span>
              <span class="count">${r.length}</span>
            </div>
          </div>

          ${this._error?s`<div class="error">${this._error}</div>`:l}

          ${r.length===0?s`<div class="empty">${i("groups_empty",t)||"No groups yet."}</div>`:s`
                <div class="group-list">
                  ${r.map(n=>{let d=this._groups[n],v=d.task_refs?.length??0,b=this._editingId===n;return s`
                      <div class="group-row">
                        ${b?s`
                              <input class="edit-input" type="text"
                                .value=${this._editingName}
                                ?disabled=${this._busy}
                                @input=${c=>{this._editingName=c.target.value}}
                                @keydown=${c=>this._onKeyDown(c,this._saveEdit.bind(this))} />
                              <button class="btn small primary"
                                @click=${this._saveEdit}
                                ?disabled=${this._busy||!this._editingName.trim()}>
                                ${i("save",t)||"Save"}
                              </button>
                              <button class="btn small"
                                @click=${()=>{this._editingId=null}}>
                                ${i("cancel",t)||"Cancel"}
                              </button>
                            `:s`
                              <span class="group-name">${d.name||"Unnamed"}</span>
                              <span class="task-count">${v}</span>
                              ${this._isAdmin?s`
                                    <button class="icon-btn"
                                      title="${i("edit",t)||"Edit"}"
                                      @click=${()=>this._startEdit(n)}
                                      ?disabled=${this._busy}>
                                      <ha-icon icon="mdi:pencil"></ha-icon>
                                    </button>
                                    <button class="icon-btn danger"
                                      title="${i("delete",t)||"Delete"}"
                                      @click=${()=>this._deleteGroup(n,d.name||"Unnamed")}
                                      ?disabled=${this._busy}>
                                      <ha-icon icon="mdi:delete"></ha-icon>
                                    </button>
                                  `:l}
                            `}
                      </div>
                    `})}
                </div>
              `}

          ${this._isAdmin?s`
                <div class="add-row">
                  <input type="text"
                    placeholder="${i("group_new_placeholder",t)||"Add group\u2026"}"
                    .value=${this._newName}
                    ?disabled=${this._busy}
                    @input=${n=>{this._newName=n.target.value}}
                    @keydown=${n=>this._onKeyDown(n,this._addGroup.bind(this))} />
                  <button class="btn primary"
                    @click=${this._addGroup}
                    ?disabled=${this._busy||!this._newName.trim()}>
                    <ha-icon icon="mdi:plus"></ha-icon>
                    ${i("add",t)||"Add"}
                  </button>
                </div>
                <button class="btn link" @click=${this._onDeepLink}>
                  ${i("groups_manage_tasks",t)||"Manage task assignments\u2026"}
                </button>
              `:s`
                <button class="btn link" @click=${this._onDeepLink}>
                  ${i("groups_open_panel",t)||"Open in panel"}
                </button>
              `}
        </div>
      </ha-card>
    `}};e.styles=[m,u`
    .count {
      font-size: 12px; color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      padding: 2px 8px; border-radius: 999px;
    }
    .empty {
      padding: 16px; text-align: center;
      color: var(--secondary-text-color); font-style: italic;
    }
    .group-list { display: flex; flex-direction: column; gap: 4px; }
    .group-row {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 8px; border-radius: 6px;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
    }
    .group-name { flex: 1; font-size: 14px; }
    .task-count {
      font-size: 11px; color: var(--secondary-text-color);
      background: var(--card-background-color, rgba(0,0,0,0.2));
      padding: 1px 8px; border-radius: 999px;
      font-weight: 500;
    }
    .edit-input {
      flex: 1; padding: 4px 8px; font-size: 14px;
      background: var(--card-background-color, #1c1c1c);
      color: var(--primary-text-color);
      border: 1px solid var(--primary-color); border-radius: 4px;
      font-family: inherit;
    }
    .icon-btn {
      background: transparent; border: none; cursor: pointer;
      color: var(--secondary-text-color); padding: 4px;
      border-radius: 4px;
    }
    .icon-btn:hover {
      background: var(--state-icon-color, rgba(255,255,255,0.06));
      color: var(--primary-text-color);
    }
    .icon-btn.danger:hover { color: var(--error-color); }
    .icon-btn ha-icon { --mdc-icon-size: 18px; }
    .add-row {
      display: flex; gap: 6px;
      padding-top: 8px; border-top: 1px solid var(--divider-color);
    }
    .add-row input {
      flex: 1; padding: 6px 8px; font-size: 13px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color); border-radius: 6px;
      font-family: inherit;
    }
    /* Card-specific overrides on the shared .btn */
    .btn.small { padding: 4px 8px; font-size: 12px; }
    .btn ha-icon { --mdc-icon-size: 16px; }
  `],a([g({attribute:!1})],e.prototype,"hass",2),a([o()],e.prototype,"_config",2),a([o()],e.prototype,"_groups",2),a([o()],e.prototype,"_loaded",2),a([o()],e.prototype,"_busy",2),a([o()],e.prototype,"_error",2),a([o()],e.prototype,"_newName",2),a([o()],e.prototype,"_editingId",2),a([o()],e.prototype,"_editingName",2);customElements.get("maintenance-groups-section-card")||customElements.define("maintenance-groups-section-card",e);window.customCards=window.customCards||[];window.customCards.push({type:"maintenance-groups-section-card",name:"Maintenance Supporter \u2014 Groups",description:"Inline group CRUD",preview:!1});export{e as MaintenanceGroupsSectionCard};
