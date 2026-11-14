/*! maintenance_supporter frontend 2.121.0 */
import{a as k,b as $,c as w}from"./chunk-WTHSEWWI.js";import{a as m,b,c as f}from"./chunk-QJCBXT5X.js";import"./chunk-YQLPMYTE.js";import{b as y}from"./chunk-I3OAYAHA.js";import"./chunk-JB73LJGJ.js";import"./chunk-TPIKPZUE.js";import"./chunk-NW362N44.js";import{a as v,b as o,c as x}from"./chunk-EVV5PJWH.js";import{N as l,a as g,d as n,g as c,i as _}from"./chunk-SMVUWZLJ.js";import{a,k as u,l as e,n as h}from"./chunk-QS6QHURM.js";var i=class extends _{constructor(){super(...arguments);this._statesGate=new m(this);this._config={type:""};this._groups={};this._loaded=!1;this._busy=!1;this._error="";this._newName="";this._editingId=null;this._editingName="";this._access=k;this._hasInitiallyLoaded=!1}shouldUpdate(t){return!this._statesGate.hold(t)}willUpdate(t){super.willUpdate(t),this._statesGate.release(t)}setConfig(t){this._config=t}getCardSize(){return 2}get _lang(){return u(this.hass)}get _canWrite(){return $(this.hass?.user,this._access)}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._hasInitiallyLoaded&&(this._hasInitiallyLoaded=!0,this._load(),w(this.hass).then(r=>{this._access=r.access}),h(this._lang).then(()=>this.requestUpdate()))}async _load(){let t=await l(this,{type:"maintenance_supporter/groups"},{onError:r=>{this._error=r}});t!==void 0&&(this._groups=t?.groups||{},this._loaded=!0)}async _act(t,r){this._error="",await l(this,t,{busy:s=>{this._busy=s},reload:async()=>{r?.(),await this._load()},onError:s=>{this._error=s}})}async _addGroup(){if(!this._canWrite)return;let t=this._newName.trim();t&&await this._act({type:"maintenance_supporter/group/create",name:t},()=>{this._newName=""})}_startEdit(t){this._editingId=t,this._editingName=this._groups[t]?.name||""}async _saveEdit(){if(!this._canWrite||!this._editingId)return;let t=this._editingName.trim();t&&await this._act({type:"maintenance_supporter/group/update",group_id:this._editingId,name:t},()=>{this._editingId=null,this._editingName=""})}async _deleteGroup(t,r){!this._canWrite||!await y(this.hass,{title:e("delete",this._lang),message:e("delete_group_confirm",this._lang).replace("{name}",r),confirmText:e("delete",this._lang),danger:!0})||await this._act({type:"maintenance_supporter/group/delete",group_id:t})}_onDeepLink(){history.pushState(null,"","/maintenance-supporter?ms_action=open_groups"),window.dispatchEvent(new CustomEvent("location-changed"))}_onKeyDown(t,r){t.key==="Enter"?(t.preventDefault(),r()):t.key==="Escape"&&(t.preventDefault(),this._editingId=null,this._editingName="")}render(){let t=this._lang;if(!this._loaded)return n`<ha-card><div class="loading">${e("loading",t)}</div></ha-card>`;let r=Object.keys(this._groups);return n`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">
              <span class="emoji">🏷️</span>
              <span>${this._config.title||e("groups",t)}</span>
              <span class="count">${r.length}</span>
            </div>
          </div>

          ${this._error?x("error",this._error):c}

          ${r.length===0?n`<div class="empty">${e("groups_empty",t)}</div>`:n`
                <div class="group-list">
                  ${r.map(s=>{let d=this._groups[s],E=d.task_refs?.length??0,N=this._editingId===s;return n`
                      <div class="group-row">
                        ${N?n`
                              <input class="edit-input" type="text"
                                .value=${this._editingName}
                                ?disabled=${this._busy}
                                @input=${p=>{this._editingName=p.target.value}}
                                @keydown=${p=>this._onKeyDown(p,this._saveEdit.bind(this))} />
                              <button class="btn small primary"
                                @click=${this._saveEdit}
                                ?disabled=${this._busy||!this._editingName.trim()}>
                                ${e("save",t)}
                              </button>
                              <button class="btn small"
                                @click=${()=>{this._editingId=null}}>
                                ${e("cancel",t)}
                              </button>
                            `:n`
                              <span class="group-name">${d.name||"Unnamed"}</span>
                              <span class="task-count">${E}</span>
                              ${this._canWrite?n`
                                    <button class="icon-btn"
                                      title="${e("edit",t)}"
                                      @click=${()=>this._startEdit(s)}
                                      ?disabled=${this._busy}>
                                      <ha-icon icon="mdi:pencil"></ha-icon>
                                    </button>
                                    <button class="icon-btn danger"
                                      title="${e("delete",t)}"
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

          ${this._canWrite?n`
                <div class="add-row">
                  <input type="text"
                    placeholder="${e("group_new_placeholder",t)}"
                    .value=${this._newName}
                    ?disabled=${this._busy}
                    @input=${s=>{this._newName=s.target.value}}
                    @keydown=${s=>this._onKeyDown(s,this._addGroup.bind(this))} />
                  <button class="btn primary"
                    @click=${this._addGroup}
                    ?disabled=${this._busy||!this._newName.trim()}>
                    <ha-icon icon="mdi:plus"></ha-icon>
                    ${e("add",t)}
                  </button>
                </div>
                <button class="btn link" @click=${this._onDeepLink}>
                  ${e("groups_manage_tasks",t)}
                </button>
              `:n`
                <button class="btn link" @click=${this._onDeepLink}>
                  ${e("groups_open_panel",t)}
                </button>
              `}
        </div>
      </ha-card>
    `}};i.styles=[f,g`
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
      padding: 6px 8px; border-radius: var(--ms-radius-6, 6px);
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
      border: 1px solid var(--divider-color); border-radius: var(--ms-radius-6, 6px);
      font-family: inherit;
    }
    /* Card-specific overrides on the shared .btn */
    .btn.small { padding: 4px 8px; font-size: 12px; }
    .btn ha-icon { --mdc-icon-size: 16px; }
  `],a([v({attribute:!1})],i.prototype,"hass",2),a([o()],i.prototype,"_config",2),a([o()],i.prototype,"_groups",2),a([o()],i.prototype,"_loaded",2),a([o()],i.prototype,"_busy",2),a([o()],i.prototype,"_error",2),a([o()],i.prototype,"_newName",2),a([o()],i.prototype,"_editingId",2),a([o()],i.prototype,"_editingName",2),a([o()],i.prototype,"_access",2);customElements.get("maintenance-groups-section-card")||customElements.define("maintenance-groups-section-card",i);b({type:"maintenance-groups-section-card",name:"Maintenance Supporter \u2014 Groups",description:"Create, rename and delete task groups right on the dashboard.",preview:!1});export{i as MaintenanceGroupsSectionCard};
