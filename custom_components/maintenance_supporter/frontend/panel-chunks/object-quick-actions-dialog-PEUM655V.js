/*! maintenance_supporter frontend 2.121.1 */
import{a as P}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-UMPDXHYC.js";import{a as x}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-XZAMRESM.js";import{g as S}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-Y6DH4VQX.js";import{a as y,b as g,q as $,s as I,t as E,v,w as O,x as W}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-OJW2CST7.js";import{a as C,b as R,f as L}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-CBPQHZD5.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-52G7I6IF.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-POIFT5A5.js";import{a as T,b as z,c as j,d as q}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-TGVTO2JK.js";import{b as _}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-X3UK5DQL.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-Z4QCPX2S.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-37MYP3YH.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-XQJBDO5M.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-WR4O4EKR.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-VW4VWVWN.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-L3IE4KTC.js";import{a as m}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-4D2JGHTK.js";import{a as u}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-RMN2QACO.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-ZKPSYYW3.js";import{b as k,c as p}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LC4JDSO2.js";import{_ as h,a as c,b as f,e as a,h as l,k as b,y as w,z as s}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-NGUHQRPO.js";var i=class extends b{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=C;this._stackRoot=null;this._onStackedChange=t=>{if(!this._open||!this._entryId)return;let e=t.detail,r=e?.entry_id??e?.entryId;(r===void 0||r===this._entryId)&&this._load()};this._loadSeq=0}get _lang(){return w(this.hass)}connectedCallback(){super.connectedCallback(),this._stackRoot=this.getRootNode(),this._stackRoot.addEventListener("task-action-fired",this._onStackedChange),this._stackRoot.addEventListener("task-completed",this._onStackedChange,!0),this._stackRoot.addEventListener("task-saved",this._onStackedChange,!0)}disconnectedCallback(){super.disconnectedCallback(),this._stackRoot?.removeEventListener("task-action-fired",this._onStackedChange),this._stackRoot?.removeEventListener("task-completed",this._onStackedChange,!0),this._stackRoot?.removeEventListener("task-saved",this._onStackedChange,!0),this._stackRoot=null}async openFor(t){t!==this._entryId&&(this._data=null),this._entryId=t,this._error="",this._open=!0,await Promise.all([this._load(),L(this.hass).then(e=>{this._access=e.access})])}close(){this._loadSeq++,this._open=!1,this._data=null,this._error=""}async _load(){let t=this._entryId;if(!t)return;let e=++this._loadSeq,r="",o=await u(this,{type:"maintenance_supporter/object",entry_id:t},{onError:d=>{r=d}});e===this._loadSeq&&(o===void 0?this._error=r:this._data=o)}_runWs(t){return this._error="",u(this,t,{busy:e=>{this._busy=e},onError:e=>{this._error=e}})}_onEditObject(){!this._entryId||!this._data||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-IXMQXLYD.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-IXMQXLYD.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await _(this.hass,{title:s("delete",this._lang),message:await P(this.hass,this._entryId,this._lang),confirmText:s("delete",this._lang),danger:!0}))return;let e=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:e})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:e},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t&&!await _(this.hass,{title:s("archive_object",this._lang),message:s("confirm_archive_object",this._lang),confirmText:s("archive_object",this._lang)}))return;let e=this._entryId;await this._runWs({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:e})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:e},bubbles:!0,composed:!0})),this.close())}_onTaskClick(t){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-IXMQXLYD.js").then(({openTaskQuickActions:e})=>{e(this._entryId,t)})}render(){if(!this._open)return l;let t=this._lang,e=this._data,r=e?.object,o=e?.tasks||[],d=R(this.hass?.user,this._access);return j(()=>this.close(),a`
        ${e&&r?a`
              <div class="header">
                ${z()?l:a`<div class="title">${r.name}</div>`}
                ${this._renderMetaRow(r)}
              </div>

              ${this._error?m("error",this._error):l}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${s("tasks",t)}</strong>
                  <span class="count">${o.length}</span>
                </div>
                ${o.length===0?a`<div class="empty">${s("no_tasks",t)}</div>`:a`
                      <div class="task-list">
                        ${o.map(n=>a`
                          <div class="task-row" role="button" tabindex="0" @click=${()=>this._onTaskClick(n.id)} @keydown=${x}>
                            <span class="status-dot" style="background: ${W(n)}"></span>
                            <span class="task-name">${E(n.name,n.next_event_titles,I(n,t))}</span>
                            <span class="task-status ${v(n)}">${O(v(n),t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${r.notes?a`
                    <div class="notes-section">
                      <strong>${s("object_notes_label",t)}</strong>
                      <div class="notes-body">${$(r.notes)}</div>
                    </div>
                  `:l}

              ${d?a`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${s("add_task",t)}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${s("edit",t)}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${r.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${r.archived?s("unarchive_object",t):s("archive_object",t)}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${s("delete",t)}
                      </button>
                    </div>
                  `:l}
            `:this._error?m("error",this._error):a`<div class="loading">${s("loading",t)}</div>`}
    `,{title:r?.name})}updated(t){t.has("_open")&&this._open&&q(this.shadowRoot)}_renderMetaRow(t){let e=this._lang,r=[];return t.area_id&&r.push([s("area",e),S(t.area_id,this.hass?.areas,s("no_area",e))]),t.manufacturer&&r.push([s("manufacturer",e),t.manufacturer]),t.model&&r.push([s("model",e),t.model]),t.serial_number&&r.push([s("serial_number_label",e),t.serial_number]),t.installation_date&&r.push([s("installed",e),h(t.installation_date,e)]),t.warranty_expiry&&r.push([s("warranty",e),h(t.warranty_expiry,e)]),t.documentation_url&&r.push([s("documentation_url_label",e),t.documentation_url,y(t.documentation_url)]),r.length===0?l:a`
      <div class="meta">
        ${r.map(([o,d,n])=>a`
            <div class="meta-item">
              <span class="meta-label">${o}</span>
              <span class="meta-value">${n||g(d)?a`<a href="${d}" target="_blank" rel="noopener noreferrer">${d}</a>`:d}</span>
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
    .event-titles { color: var(--secondary-text-color); font-weight: 400; }
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
  `],c([k({attribute:!1})],i.prototype,"hass",2),c([p()],i.prototype,"_open",2),c([p()],i.prototype,"_entryId",2),c([p()],i.prototype,"_data",2),c([p()],i.prototype,"_busy",2),c([p()],i.prototype,"_error",2),c([p()],i.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",i);export{i as MaintenanceObjectQuickActionsDialog};
