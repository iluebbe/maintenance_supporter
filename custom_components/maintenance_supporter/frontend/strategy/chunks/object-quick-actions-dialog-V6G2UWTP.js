/*! maintenance_supporter frontend 2.120.0 */
import{a as I,b as O,c as $,d as g,e as R,f as T}from"./chunk-ANO7B3BF.js";import{a as A,b as j,c as w}from"./chunk-BBGK7WDD.js";import"./chunk-ER2NEHFW.js";import{a as E,b as S,c as C,d as H}from"./chunk-QOUQUHZL.js";import{b as h}from"./chunk-RZ3EDWKM.js";import"./chunk-VRDFHDHG.js";import"./chunk-RYR2KGUZ.js";import"./chunk-5TGQNU77.js";import"./chunk-NDHZDYG6.js";import"./chunk-EBE3TCKA.js";import{a as x,b as m,c as b}from"./chunk-RYL74NSR.js";import{J as f,a as v,d as o,g as d,i as k,u as y}from"./chunk-GOJWZNSJ.js";import{a as c,k as _,l as r}from"./chunk-7ZPVRRJE.js";function N(i,p,t){return i&&p?.[i]?.name||t}function L(i){if(i.key!=="Enter"&&i.key!==" ")return;let t=i.target?.closest?.('[role="menuitem"], [role="button"]');!t||t.getAttribute("aria-disabled")==="true"||(i.preventDefault(),t.click())}var s=class extends k{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=A;this._loadSeq=0}get _lang(){return _(this.hass)}async openFor(t){t!==this._entryId&&(this._data=null),this._entryId=t,this._error="",this._open=!0,await Promise.all([this._load(),w(this.hass).then(e=>{this._access=e.access})])}close(){this._loadSeq++,this._open=!1,this._data=null,this._error=""}async _load(){let t=this._entryId;if(!t)return;let e=++this._loadSeq,n="",a=await f(this,{type:"maintenance_supporter/object",entry_id:t},{onError:l=>{n=l}});e===this._loadSeq&&(a===void 0?this._error=n:this._data=a)}_runWs(t){return this._error="",f(this,t,{busy:e=>{this._busy=e},onError:e=>{this._error=e}})}_onEditObject(){!this._entryId||!this._data||import("./dialog-mount-T2WO3PAU.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("./dialog-mount-T2WO3PAU.js").then(({openCreateTaskDialog:t})=>{t(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await h(this.hass,{title:r("delete",this._lang),message:r("delete_object_confirm",this._lang),confirmText:r("delete",this._lang),danger:!0}))return;let e=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:e})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:e},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t&&!await h(this.hass,{title:r("archive_object",this._lang),message:r("confirm_archive_object",this._lang),confirmText:r("archive_object",this._lang)}))return;let e=this._entryId;await this._runWs({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:e})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:e},bubbles:!0,composed:!0})),this.close())}_onTaskClick(t){this._entryId&&import("./dialog-mount-T2WO3PAU.js").then(({openTaskQuickActions:e})=>{e(this._entryId,t)})}render(){if(!this._open)return d;let t=this._lang,e=this._data,n=e?.object,a=e?.tasks||[],l=j(this.hass?.user,this._access);return C(()=>this.close(),o`
        ${e&&n?o`
              <div class="header">
                ${S()?d:o`<div class="title">${n.name}</div>`}
                ${this._renderMetaRow(n)}
              </div>

              ${this._error?b("error",this._error):d}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${r("tasks",t)}</strong>
                  <span class="count">${a.length}</span>
                </div>
                ${a.length===0?o`<div class="empty">${r("no_tasks",t)}</div>`:o`
                      <div class="task-list">
                        ${a.map(u=>o`
                          <div class="task-row" role="button" tabindex="0" @click=${()=>this._onTaskClick(u.id)} @keydown=${L}>
                            <span class="status-dot" style="background: ${T(u)}"></span>
                            <span class="task-name">${u.name}</span>
                            <span class="task-status ${g(u)}">${R(g(u),t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${n.notes?o`
                    <div class="notes-section">
                      <strong>${r("object_notes_label",t)}</strong>
                      <div class="notes-body">${$(n.notes)}</div>
                    </div>
                  `:d}

              ${l?o`
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
            `:this._error?b("error",this._error):o`<div class="loading">${r("loading",t)}</div>`}
    `,{title:n?.name})}updated(t){t.has("_open")&&this._open&&H(this.shadowRoot)}_renderMetaRow(t){let e=this._lang,n=[];return t.area_id&&n.push([r("area",e),N(t.area_id,this.hass?.areas,r("no_area",e))]),t.manufacturer&&n.push([r("manufacturer",e),t.manufacturer]),t.model&&n.push([r("model",e),t.model]),t.serial_number&&n.push([r("serial_number_label",e),t.serial_number]),t.installation_date&&n.push([r("installed",e),y(t.installation_date,e)]),t.warranty_expiry&&n.push([r("warranty",e),y(t.warranty_expiry,e)]),t.documentation_url&&n.push([r("documentation_url_label",e),t.documentation_url,I(t.documentation_url)]),n.length===0?d:o`
      <div class="meta">
        ${n.map(([a,l,u])=>o`
            <div class="meta-item">
              <span class="meta-label">${a}</span>
              <span class="meta-value">${u||O(l)?o`<a href="${l}" target="_blank" rel="noopener noreferrer">${l}</a>`:l}</span>
            </div>
          `)}
      </div>
    `}};s.styles=[E,v`
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
  `],c([x({attribute:!1})],s.prototype,"hass",2),c([m()],s.prototype,"_open",2),c([m()],s.prototype,"_entryId",2),c([m()],s.prototype,"_data",2),c([m()],s.prototype,"_busy",2),c([m()],s.prototype,"_error",2),c([m()],s.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",s);export{s as MaintenanceObjectQuickActionsDialog};
