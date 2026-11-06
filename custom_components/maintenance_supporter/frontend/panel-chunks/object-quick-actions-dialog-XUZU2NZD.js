/*! maintenance_supporter frontend 2.120.0 */
import{a as I}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-EEGA75TN.js";import{f as w}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YRGMD7NJ.js";import{a as y,b as x,p as $,r as v,s as W,t as O}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-W3NIGATG.js";import{a as E,b as S,f as z}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-Z3DP2Q3F.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-S3FVZEJZ.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-XIXSWHLU.js";import{a as T,b as j,c as q,d as L}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-IWZ3SGGN.js";import{b as m}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-CYQK5MF3.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-O3YXUQZP.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-DZC4FQKV.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-M6QGV47U.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-34JKKTKV.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-AZWAFZD2.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-U6FY77DM.js";import{a as _}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6EN6VJFV.js";import{a as u}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-UTFMCS7T.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-YIE7X74W.js";import{b as g,c as p}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-MO7B25OR.js";import{X as h,a as d,b as f,e as a,h as c,k as b,y as k,z as r}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-J3TUPMVF.js";var i=class extends b{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=E;this._loadSeq=0}get _lang(){return k(this.hass)}async openFor(t){t!==this._entryId&&(this._data=null),this._entryId=t,this._error="",this._open=!0,await Promise.all([this._load(),z(this.hass).then(e=>{this._access=e.access})])}close(){this._loadSeq++,this._open=!1,this._data=null,this._error=""}async _load(){let t=this._entryId;if(!t)return;let e=++this._loadSeq,s="",o=await u(this,{type:"maintenance_supporter/object",entry_id:t},{onError:n=>{s=n}});e===this._loadSeq&&(o===void 0?this._error=s:this._data=o)}_runWs(t){return this._error="",u(this,t,{busy:e=>{this._busy=e},onError:e=>{this._error=e}})}_onEditObject(){!this._entryId||!this._data||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-ATLN5OM4.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-ATLN5OM4.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await m(this.hass,{title:r("delete",this._lang),message:r("delete_object_confirm",this._lang),confirmText:r("delete",this._lang),danger:!0}))return;let e=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:e})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:e},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t&&!await m(this.hass,{title:r("archive_object",this._lang),message:r("confirm_archive_object",this._lang),confirmText:r("archive_object",this._lang)}))return;let e=this._entryId;await this._runWs({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:e})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:e},bubbles:!0,composed:!0})),this.close())}_onTaskClick(t){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-ATLN5OM4.js").then(({openTaskQuickActions:e})=>{e(this._entryId,t)})}render(){if(!this._open)return c;let t=this._lang,e=this._data,s=e?.object,o=e?.tasks||[],n=S(this.hass?.user,this._access);return q(()=>this.close(),a`
        ${e&&s?a`
              <div class="header">
                ${j()?c:a`<div class="title">${s.name}</div>`}
                ${this._renderMetaRow(s)}
              </div>

              ${this._error?_("error",this._error):c}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${r("tasks",t)}</strong>
                  <span class="count">${o.length}</span>
                </div>
                ${o.length===0?a`<div class="empty">${r("no_tasks",t)}</div>`:a`
                      <div class="task-list">
                        ${o.map(l=>a`
                          <div class="task-row" role="button" tabindex="0" @click=${()=>this._onTaskClick(l.id)} @keydown=${I}>
                            <span class="status-dot" style="background: ${O(l)}"></span>
                            <span class="task-name">${l.name}</span>
                            <span class="task-status ${v(l)}">${W(v(l),t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${s.notes?a`
                    <div class="notes-section">
                      <strong>${r("object_notes_label",t)}</strong>
                      <div class="notes-body">${$(s.notes)}</div>
                    </div>
                  `:c}

              ${n?a`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${r("add_task",t)}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${r("edit",t)}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${s.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${s.archived?r("unarchive_object",t):r("archive_object",t)}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${r("delete",t)}
                      </button>
                    </div>
                  `:c}
            `:this._error?_("error",this._error):a`<div class="loading">${r("loading",t)}</div>`}
    `,{title:s?.name})}updated(t){t.has("_open")&&this._open&&L(this.shadowRoot)}_renderMetaRow(t){let e=this._lang,s=[];return t.area_id&&s.push([r("area",e),w(t.area_id,this.hass?.areas,r("no_area",e))]),t.manufacturer&&s.push([r("manufacturer",e),t.manufacturer]),t.model&&s.push([r("model",e),t.model]),t.serial_number&&s.push([r("serial_number_label",e),t.serial_number]),t.installation_date&&s.push([r("installed",e),h(t.installation_date,e)]),t.warranty_expiry&&s.push([r("warranty",e),h(t.warranty_expiry,e)]),t.documentation_url&&s.push([r("documentation_url_label",e),t.documentation_url,y(t.documentation_url)]),s.length===0?c:a`
      <div class="meta">
        ${s.map(([o,n,l])=>a`
            <div class="meta-item">
              <span class="meta-label">${o}</span>
              <span class="meta-value">${l||x(n)?a`<a href="${n}" target="_blank" rel="noopener noreferrer">${n}</a>`:n}</span>
            </div>
          `)}
      </div>
    `}};i.styles=[T,f`
    :host { display: contents; }
    .header { display: flex; flex-direction: column; gap: 6px; }
    .title { font-size: 20px; font-weight: 600; }
    .meta { display: flex; flex-direction: column; gap: 4px; padding-top: 4px; border-top: 1px solid var(--divider-color); }
    .meta-item { display: flex; gap: 8px; font-size: 12px; }
    .meta-label { color: var(--secondary-text-color); min-width: 100px; }
    .meta-value { color: var(--primary-text-color); flex: 1; word-break: break-word; }
    .meta-value a { color: var(--primary-color); }
    .tasks-section, .notes-section { display: flex; flex-direction: column; gap: 6px; }
    .section-header { display: flex; align-items: baseline; gap: 8px; }
    .count {
      font-size: 11px; color: var(--secondary-text-color);
      background: var(--secondary-background-color); padding: 2px 8px; border-radius: 999px;
    }
    .empty { color: var(--secondary-text-color); font-style: italic; font-size: 13px; padding: 8px 0; }
    .task-list { display: flex; flex-direction: column; gap: 4px; max-height: 200px; overflow: auto; }
    .task-row {
      display: flex; align-items: center; gap: 10px;
      padding: 8px; border-radius: var(--ms-radius-6, 6px); cursor: pointer;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
      transition: background 0.12s;
    }
    .task-row:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .task-row:focus-visible { outline: 2px solid var(--primary-color); outline-offset: -2px; }
    .status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .task-name { flex: 1; font-size: 14px; }
    .task-status { font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; }
    .notes-body { white-space: pre-wrap; font-size: 13px; padding: 8px; background: var(--secondary-background-color); border-radius: var(--ms-radius-6, 6px); }
    .notes-body ha-markdown { white-space: normal; }
    .actions { display: flex; gap: 8px; padding-top: 8px; border-top: 1px solid var(--divider-color); }
    .actions .btn { flex: 1; }
    .btn {
      padding: 8px; font-size: 13px; border-radius: var(--ms-radius-6, 6px); cursor: pointer;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color); font-weight: 500;
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    }
    .btn:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .btn[disabled] { opacity: 0.5; cursor: wait; }
    .btn.primary { background: var(--primary-color); color: var(--text-primary-color, white); border-color: var(--primary-color); }
    .btn.danger { color: var(--error-color); }
    .btn ha-icon { --mdc-icon-size: 16px; }
    .loading { padding: 24px; text-align: center; color: var(--secondary-text-color); }
    .error { padding: 8px; border-radius: var(--ms-radius-6, 6px); background: rgba(211,47,47,0.1); color: var(--error-color); font-size: 13px; }
  `],d([g({attribute:!1})],i.prototype,"hass",2),d([p()],i.prototype,"_open",2),d([p()],i.prototype,"_entryId",2),d([p()],i.prototype,"_data",2),d([p()],i.prototype,"_busy",2),d([p()],i.prototype,"_error",2),d([p()],i.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",i);export{i as MaintenanceObjectQuickActionsDialog};
