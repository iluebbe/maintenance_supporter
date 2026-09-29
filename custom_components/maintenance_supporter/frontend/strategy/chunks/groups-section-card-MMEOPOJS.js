/*! maintenance_supporter frontend 2.95.0 */
import{a as v,b as y}from"./chunk-NDCHROCV.js";import{a as f,b as x,c as k}from"./chunk-L6WEXF3F.js";import{j as b}from"./chunk-WG2FYYZA.js";import{a as h,b as a,d as c,e as g,f as _,g as o,j as m,z as l}from"./chunk-7GMAKRRU.js";import{a as n,g as i,i as u}from"./chunk-3MSNNIFG.js";var e=class extends g{constructor(){super(...arguments);this._config={type:""};this._groups={};this._loaded=!1;this._busy=!1;this._error="";this._newName="";this._editingId=null;this._editingName="";this._access=f;this._hasInitiallyLoaded=!1}setConfig(t){this._config=t}getCardSize(){return 2}get _lang(){return m(this.hass)}get _canWrite(){return x(this.hass?.user,this._access)}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._hasInitiallyLoaded&&(this._hasInitiallyLoaded=!0,this._load(),k(this.hass).then(r=>{this._access=r.access}),u(this._lang).then(()=>this.requestUpdate()))}async _load(){let t=await l(this,{type:"maintenance_supporter/groups"},{onError:r=>{this._error=r}});t!==void 0&&(this._groups=t?.groups||{},this._loaded=!0)}async _act(t,r){this._error="",await l(this,t,{busy:s=>{this._busy=s},reload:async()=>{r?.(),await this._load()},onError:s=>{this._error=s}})}async _addGroup(){if(!this._canWrite)return;let t=this._newName.trim();t&&await this._act({type:"maintenance_supporter/group/create",name:t},()=>{this._newName=""})}_startEdit(t){this._editingId=t,this._editingName=this._groups[t]?.name||""}async _saveEdit(){if(!this._canWrite||!this._editingId)return;let t=this._editingName.trim();t&&await this._act({type:"maintenance_supporter/group/update",group_id:this._editingId,name:t},()=>{this._editingId=null,this._editingName=""})}async _deleteGroup(t,r){!this._canWrite||!await b(this.hass,{title:i("delete",this._lang),message:i("delete_group_confirm",this._lang).replace("{name}",r),confirmText:i("delete",this._lang),danger:!0})||await this._act({type:"maintenance_supporter/group/delete",group_id:t})}_onDeepLink(){history.pushState(null,"","/maintenance-supporter?ms_action=open_groups"),window.dispatchEvent(new CustomEvent("location-changed"))}_onKeyDown(t,r){t.key==="Enter"?(t.preventDefault(),r()):t.key==="Escape"&&(t.preventDefault(),this._editingId=null,this._editingName="")}render(){let t=this._lang;if(!this._loaded)return a`<ha-card><div class="loading">${i("loading",t)}</div></ha-card>`;let r=Object.keys(this._groups);return a`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">
              <span class="emoji">🏷️</span>
              <span>${this._config.title||i("groups",t)}</span>
              <span class="count">${r.length}</span>
            </div>
          </div>

          ${this._error?a`<div class="error">${this._error}</div>`:c}

          ${r.length===0?a`<div class="empty">${i("groups_empty",t)}</div>`:a`
                <div class="group-list">
                  ${r.map(s=>{let d=this._groups[s],$=d.task_refs?.length??0,w=this._editingId===s;return a`
                      <div class="group-row">
                        ${w?a`
                              <input class="edit-input" type="text"
                                .value=${this._editingName}
                                ?disabled=${this._busy}
                                @input=${p=>{this._editingName=p.target.value}}
                                @keydown=${p=>this._onKeyDown(p,this._saveEdit.bind(this))} />
                              <button class="btn small primary"
                                @click=${this._saveEdit}
                                ?disabled=${this._busy||!this._editingName.trim()}>
                                ${i("save",t)}
                              </button>
                              <button class="btn small"
                                @click=${()=>{this._editingId=null}}>
                                ${i("cancel",t)}
                              </button>
                            `:a`
                              <span class="group-name">${d.name||"Unnamed"}</span>
                              <span class="task-count">${$}</span>
                              ${this._canWrite?a`
                                    <button class="icon-btn"
                                      title="${i("edit",t)}"
                                      @click=${()=>this._startEdit(s)}
                                      ?disabled=${this._busy}>
                                      <ha-icon icon="mdi:pencil"></ha-icon>
                                    </button>
                                    <button class="icon-btn danger"
                                      title="${i("delete",t)}"
                                      @click=${()=>this._deleteGroup(s,d.name||"Unnamed")}
                                      ?disabled=${this._busy}>
                                      <ha-icon icon="mdi:delete"></ha-icon>
                                    </button>
                                  `:c}
                            `}
                      </div>
                    `})}
                </div>
              `}

          ${this._canWrite?a`
                <div class="add-row">
                  <input type="text"
                    placeholder="${i("group_new_placeholder",t)}"
                    .value=${this._newName}
                    ?disabled=${this._busy}
                    @input=${s=>{this._newName=s.target.value}}
                    @keydown=${s=>this._onKeyDown(s,this._addGroup.bind(this))} />
                  <button class="btn primary"
                    @click=${this._addGroup}
                    ?disabled=${this._busy||!this._newName.trim()}>
                    <ha-icon icon="mdi:plus"></ha-icon>
                    ${i("add",t)}
                  </button>
                </div>
                <button class="btn link" @click=${this._onDeepLink}>
                  ${i("groups_manage_tasks",t)}
                </button>
              `:a`
                <button class="btn link" @click=${this._onDeepLink}>
                  ${i("groups_open_panel",t)}
                </button>
              `}
        </div>
      </ha-card>
    `}};e.styles=[y,h`
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
  `],n([_({attribute:!1})],e.prototype,"hass",2),n([o()],e.prototype,"_config",2),n([o()],e.prototype,"_groups",2),n([o()],e.prototype,"_loaded",2),n([o()],e.prototype,"_busy",2),n([o()],e.prototype,"_error",2),n([o()],e.prototype,"_newName",2),n([o()],e.prototype,"_editingId",2),n([o()],e.prototype,"_editingName",2),n([o()],e.prototype,"_access",2);customElements.get("maintenance-groups-section-card")||customElements.define("maintenance-groups-section-card",e);v({type:"maintenance-groups-section-card",name:"Maintenance Supporter \u2014 Groups",description:"Create, rename and delete task groups right on the dashboard.",preview:!1});export{e as MaintenanceGroupsSectionCard};
