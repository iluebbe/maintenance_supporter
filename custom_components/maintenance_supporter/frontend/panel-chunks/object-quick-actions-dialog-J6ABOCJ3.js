/*! maintenance_supporter frontend 2.121.0 */
import{a as F}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-HR5RCJLB.js";import{a as x}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-WO36MG4A.js";import{g as T}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-KJ7SS7FT.js";import{a as y,b as g,q as $,s as I,t as E,v,w as P,x as C}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-FWSPRG2X.js";import{a as S,b as z,f as j}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6OV5SW7D.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-KHX23RKC.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-EOQRMKO2.js";import{a as q,b as L,c as O,d as W}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-RQVZLRLW.js";import{b as m}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-73ZJRN3Q.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-UVXC4Q6A.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-3AB2SQS5.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-5QFBI2I6.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-74HJ66BE.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-DUP67HYE.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-NJ7WNURY.js";import{a as _}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-FMUBH3VL.js";import{a as u}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6F6M6DVU.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-X2OEUN4V.js";import{b as k,c as p}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LCH6QYSS.js";import{_ as h,a as l,b as f,e as a,h as c,k as b,y as w,z as r}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-74ISRDIW.js";var i=class extends b{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=S;this._loadSeq=0}get _lang(){return w(this.hass)}async openFor(t){t!==this._entryId&&(this._data=null),this._entryId=t,this._error="",this._open=!0,await Promise.all([this._load(),j(this.hass).then(e=>{this._access=e.access})])}close(){this._loadSeq++,this._open=!1,this._data=null,this._error=""}async _load(){let t=this._entryId;if(!t)return;let e=++this._loadSeq,s="",o=await u(this,{type:"maintenance_supporter/object",entry_id:t},{onError:d=>{s=d}});e===this._loadSeq&&(o===void 0?this._error=s:this._data=o)}_runWs(t){return this._error="",u(this,t,{busy:e=>{this._busy=e},onError:e=>{this._error=e}})}_onEditObject(){!this._entryId||!this._data||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-3VHN3WQX.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-3VHN3WQX.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await m(this.hass,{title:r("delete",this._lang),message:await F(this.hass,this._entryId,this._lang),confirmText:r("delete",this._lang),danger:!0}))return;let e=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:e})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:e},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t&&!await m(this.hass,{title:r("archive_object",this._lang),message:r("confirm_archive_object",this._lang),confirmText:r("archive_object",this._lang)}))return;let e=this._entryId;await this._runWs({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:e})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:e},bubbles:!0,composed:!0})),this.close())}_onTaskClick(t){this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-3VHN3WQX.js").then(({openTaskQuickActions:e})=>{e(this._entryId,t)})}render(){if(!this._open)return c;let t=this._lang,e=this._data,s=e?.object,o=e?.tasks||[],d=z(this.hass?.user,this._access);return O(()=>this.close(),a`
        ${e&&s?a`
              <div class="header">
                ${L()?c:a`<div class="title">${s.name}</div>`}
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
                        ${o.map(n=>a`
                          <div class="task-row" role="button" tabindex="0" @click=${()=>this._onTaskClick(n.id)} @keydown=${x}>
                            <span class="status-dot" style="background: ${C(n)}"></span>
                            <span class="task-name">${E(n.name,n.next_event_titles,I(n,t))}</span>
                            <span class="task-status ${v(n)}">${P(v(n),t)}</span>
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

              ${d?a`
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
    `,{title:s?.name})}updated(t){t.has("_open")&&this._open&&W(this.shadowRoot)}_renderMetaRow(t){let e=this._lang,s=[];return t.area_id&&s.push([r("area",e),T(t.area_id,this.hass?.areas,r("no_area",e))]),t.manufacturer&&s.push([r("manufacturer",e),t.manufacturer]),t.model&&s.push([r("model",e),t.model]),t.serial_number&&s.push([r("serial_number_label",e),t.serial_number]),t.installation_date&&s.push([r("installed",e),h(t.installation_date,e)]),t.warranty_expiry&&s.push([r("warranty",e),h(t.warranty_expiry,e)]),t.documentation_url&&s.push([r("documentation_url_label",e),t.documentation_url,y(t.documentation_url)]),s.length===0?c:a`
      <div class="meta">
        ${s.map(([o,d,n])=>a`
            <div class="meta-item">
              <span class="meta-label">${o}</span>
              <span class="meta-value">${n||g(d)?a`<a href="${d}" target="_blank" rel="noopener noreferrer">${d}</a>`:d}</span>
            </div>
          `)}
      </div>
    `}};i.styles=[q,f`
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
  `],l([k({attribute:!1})],i.prototype,"hass",2),l([p()],i.prototype,"_open",2),l([p()],i.prototype,"_entryId",2),l([p()],i.prototype,"_data",2),l([p()],i.prototype,"_busy",2),l([p()],i.prototype,"_error",2),l([p()],i.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",i);export{i as MaintenanceObjectQuickActionsDialog};
