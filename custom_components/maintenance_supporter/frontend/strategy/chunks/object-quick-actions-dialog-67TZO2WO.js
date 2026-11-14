/*! maintenance_supporter frontend 2.121.0 */
import{a as C,b as $,c as I,d as g,e as T,f as R,h as N,i as L}from"./chunk-QZVT77LC.js";import{a as A,b as j,c as w}from"./chunk-WTHSEWWI.js";import"./chunk-YQLPMYTE.js";import{a as E,b as H,c as S,d as O}from"./chunk-YFGWIN5E.js";import{b}from"./chunk-I3OAYAHA.js";import"./chunk-JB73LJGJ.js";import"./chunk-GI6GSVLO.js";import"./chunk-5SPOAKPN.js";import"./chunk-TPIKPZUE.js";import"./chunk-NW362N44.js";import{a as x,b as m,c as h}from"./chunk-EVV5PJWH.js";import{N as f,a as v,d as s,g as d,i as k,x as y}from"./chunk-SMVUWZLJ.js";import{a as u,k as _,l as r}from"./chunk-QS6QHURM.js";async function M(i,p,t){let e=r("delete_object_confirm",t);if(!p)return e;try{let o=(await i.connection.sendMessagePromise({type:"maintenance_supporter/object/delete_preview",entry_id:p}))?.parts_handover;if(!o||!o.parts?.length)return e;let l=r("delete_object_parts_move",t).replace("{parts}",o.parts.join(", ")).replace("{object}",o.new_owner);return`${e} ${l}`}catch{return e}}function B(i,p,t){return i&&p?.[i]?.name||t}function K(i){if(i.key!=="Enter"&&i.key!==" ")return;let t=i.target?.closest?.('[role="menuitem"], [role="button"]');!t||t.getAttribute("aria-disabled")==="true"||(i.preventDefault(),t.click())}var a=class extends k{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=A;this._loadSeq=0}get _lang(){return _(this.hass)}async openFor(t){t!==this._entryId&&(this._data=null),this._entryId=t,this._error="",this._open=!0,await Promise.all([this._load(),w(this.hass).then(e=>{this._access=e.access})])}close(){this._loadSeq++,this._open=!1,this._data=null,this._error=""}async _load(){let t=this._entryId;if(!t)return;let e=++this._loadSeq,n="",o=await f(this,{type:"maintenance_supporter/object",entry_id:t},{onError:l=>{n=l}});e===this._loadSeq&&(o===void 0?this._error=n:this._data=o)}_runWs(t){return this._error="",f(this,t,{busy:e=>{this._busy=e},onError:e=>{this._error=e}})}_onEditObject(){!this._entryId||!this._data||import("./dialog-mount-DNKMLF6U.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("./dialog-mount-DNKMLF6U.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await b(this.hass,{title:r("delete",this._lang),message:await M(this.hass,this._entryId,this._lang),confirmText:r("delete",this._lang),danger:!0}))return;let e=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:e})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:e},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t&&!await b(this.hass,{title:r("archive_object",this._lang),message:r("confirm_archive_object",this._lang),confirmText:r("archive_object",this._lang)}))return;let e=this._entryId;await this._runWs({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:e})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:e},bubbles:!0,composed:!0})),this.close())}_onTaskClick(t){this._entryId&&import("./dialog-mount-DNKMLF6U.js").then(({openTaskQuickActions:e})=>{e(this._entryId,t)})}render(){if(!this._open)return d;let t=this._lang,e=this._data,n=e?.object,o=e?.tasks||[],l=j(this.hass?.user,this._access);return S(()=>this.close(),s`
        ${e&&n?s`
              <div class="header">
                ${H()?d:s`<div class="title">${n.name}</div>`}
                ${this._renderMetaRow(n)}
              </div>

              ${this._error?h("error",this._error):d}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${r("tasks",t)}</strong>
                  <span class="count">${o.length}</span>
                </div>
                ${o.length===0?s`<div class="empty">${r("no_tasks",t)}</div>`:s`
                      <div class="task-list">
                        ${o.map(c=>s`
                          <div class="task-row" role="button" tabindex="0" @click=${()=>this._onTaskClick(c.id)} @keydown=${K}>
                            <span class="status-dot" style="background: ${R(c)}"></span>
                            <span class="task-name">${L(c.name,c.next_event_titles,N(c,t))}</span>
                            <span class="task-status ${g(c)}">${T(g(c),t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${n.notes?s`
                    <div class="notes-section">
                      <strong>${r("object_notes_label",t)}</strong>
                      <div class="notes-body">${I(n.notes)}</div>
                    </div>
                  `:d}

              ${l?s`
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
                        <ha-icon icon="${n.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${n.archived?r("unarchive_object",t):r("archive_object",t)}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${r("delete",t)}
                      </button>
                    </div>
                  `:d}
            `:this._error?h("error",this._error):s`<div class="loading">${r("loading",t)}</div>`}
    `,{title:n?.name})}updated(t){t.has("_open")&&this._open&&O(this.shadowRoot)}_renderMetaRow(t){let e=this._lang,n=[];return t.area_id&&n.push([r("area",e),B(t.area_id,this.hass?.areas,r("no_area",e))]),t.manufacturer&&n.push([r("manufacturer",e),t.manufacturer]),t.model&&n.push([r("model",e),t.model]),t.serial_number&&n.push([r("serial_number_label",e),t.serial_number]),t.installation_date&&n.push([r("installed",e),y(t.installation_date,e)]),t.warranty_expiry&&n.push([r("warranty",e),y(t.warranty_expiry,e)]),t.documentation_url&&n.push([r("documentation_url_label",e),t.documentation_url,C(t.documentation_url)]),n.length===0?d:s`
      <div class="meta">
        ${n.map(([o,l,c])=>s`
            <div class="meta-item">
              <span class="meta-label">${o}</span>
              <span class="meta-value">${c||$(l)?s`<a href="${l}" target="_blank" rel="noopener noreferrer">${l}</a>`:l}</span>
            </div>
          `)}
      </div>
    `}};a.styles=[E,v`
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
  `],u([x({attribute:!1})],a.prototype,"hass",2),u([m()],a.prototype,"_open",2),u([m()],a.prototype,"_entryId",2),u([m()],a.prototype,"_data",2),u([m()],a.prototype,"_busy",2),u([m()],a.prototype,"_error",2),u([m()],a.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",a);export{a as MaintenanceObjectQuickActionsDialog};
