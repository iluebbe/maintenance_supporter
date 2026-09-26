/*! maintenance_supporter frontend 2.92.0 */
import{a as v,b as y}from"./chunk-HP4IAW3J.js";import{a as f,b as x,c as $}from"./chunk-RTXGPOCF.js";import{a as b}from"./chunk-MD2HGGBH.js";import{B as c,a as h,b as r,d as l,e as u,f as g,g as n,i as e,k as _,m}from"./chunk-GGBBPELB.js";import{a}from"./chunk-5WR6EMQC.js";var i=class extends u{constructor(){super(...arguments);this._config={type:""};this._groups={};this._loaded=!1;this._busy=!1;this._error="";this._newName="";this._editingId=null;this._editingName="";this._access=f;this._hasInitiallyLoaded=!1}setConfig(t){this._config=t}getCardSize(){return 2}get _lang(){return _(this.hass)}get _canWrite(){return x(this.hass?.user,this._access)}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._hasInitiallyLoaded&&(this._hasInitiallyLoaded=!0,this._load(),$(this.hass).then(s=>{this._access=s.access}),m(this._lang).then(()=>this.requestUpdate()))}async _load(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"});this._groups=t.groups||{},this._loaded=!0}catch(t){this._error=c(t,this._lang)}}async _addGroup(){if(!this._canWrite)return;let t=this._newName.trim();if(t){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/create",name:t}),this._newName="",await this._load()}catch(s){this._error=c(s,this._lang)}finally{this._busy=!1}}}_startEdit(t){this._editingId=t,this._editingName=this._groups[t]?.name||""}async _saveEdit(){if(!this._canWrite||!this._editingId)return;let t=this._editingName.trim();if(t){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/update",group_id:this._editingId,name:t}),this._editingId=null,this._editingName="",await this._load()}catch(s){this._error=c(s,this._lang)}finally{this._busy=!1}}}async _deleteGroup(t,s){if(!(!this._canWrite||!await b(this.hass,{title:e("delete",this._lang),message:e("delete_group_confirm",this._lang).replace("{name}",s),confirmText:e("delete",this._lang),danger:!0}))){this._busy=!0;try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/delete",group_id:t}),await this._load()}catch(d){this._error=c(d,this._lang)}finally{this._busy=!1}}}_onDeepLink(){history.pushState(null,"","/maintenance-supporter?ms_action=open_groups"),window.dispatchEvent(new CustomEvent("location-changed"))}_onKeyDown(t,s){t.key==="Enter"?(t.preventDefault(),s()):t.key==="Escape"&&(t.preventDefault(),this._editingId=null,this._editingName="")}render(){let t=this._lang;if(!this._loaded)return r`<ha-card><div class="loading">${e("loading",t)}</div></ha-card>`;let s=Object.keys(this._groups);return r`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">
              <span class="emoji">🏷️</span>
              <span>${this._config.title||e("groups",t)}</span>
              <span class="count">${s.length}</span>
            </div>
          </div>

          ${this._error?r`<div class="error">${this._error}</div>`:l}

          ${s.length===0?r`<div class="empty">${e("groups_empty",t)}</div>`:r`
                <div class="group-list">
                  ${s.map(o=>{let d=this._groups[o],k=d.task_refs?.length??0,w=this._editingId===o;return r`
                      <div class="group-row">
                        ${w?r`
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
                            `:r`
                              <span class="group-name">${d.name||"Unnamed"}</span>
                              <span class="task-count">${k}</span>
                              ${this._canWrite?r`
                                    <button class="icon-btn"
                                      title="${e("edit",t)}"
                                      @click=${()=>this._startEdit(o)}
                                      ?disabled=${this._busy}>
                                      <ha-icon icon="mdi:pencil"></ha-icon>
                                    </button>
                                    <button class="icon-btn danger"
                                      title="${e("delete",t)}"
                                      @click=${()=>this._deleteGroup(o,d.name||"Unnamed")}
                                      ?disabled=${this._busy}>
                                      <ha-icon icon="mdi:delete"></ha-icon>
                                    </button>
                                  `:l}
                            `}
                      </div>
                    `})}
                </div>
              `}

          ${this._canWrite?r`
                <div class="add-row">
                  <input type="text"
                    placeholder="${e("group_new_placeholder",t)}"
                    .value=${this._newName}
                    ?disabled=${this._busy}
                    @input=${o=>{this._newName=o.target.value}}
                    @keydown=${o=>this._onKeyDown(o,this._addGroup.bind(this))} />
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
              `:r`
                <button class="btn link" @click=${this._onDeepLink}>
                  ${e("groups_open_panel",t)}
                </button>
              `}
        </div>
      </ha-card>
    `}};i.styles=[y,h`
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
  `],a([g({attribute:!1})],i.prototype,"hass",2),a([n()],i.prototype,"_config",2),a([n()],i.prototype,"_groups",2),a([n()],i.prototype,"_loaded",2),a([n()],i.prototype,"_busy",2),a([n()],i.prototype,"_error",2),a([n()],i.prototype,"_newName",2),a([n()],i.prototype,"_editingId",2),a([n()],i.prototype,"_editingName",2),a([n()],i.prototype,"_access",2);customElements.get("maintenance-groups-section-card")||customElements.define("maintenance-groups-section-card",i);v({type:"maintenance-groups-section-card",name:"Maintenance Supporter \u2014 Groups",description:"Inline group CRUD",preview:!1});export{i as MaintenanceGroupsSectionCard};
