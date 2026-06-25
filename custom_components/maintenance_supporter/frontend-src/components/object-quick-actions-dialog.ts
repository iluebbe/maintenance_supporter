/** v2.3.0 Phase 3 — Object Quick-Actions Dialog.
 *
 *  In-place dialog for object-level actions: Edit settings / Add task /
 *  Delete object, plus a read-only display of all metadata + a compact
 *  task-list for the object. Mirrors what the panel's object-detail page
 *  offers, accessible without panel-roundtrip.
 *
 *  Mounted via dialog-mount.openObjectQuickActions(entryId).
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t, STATUS_COLORS } from "../styles";
import { describeWsError } from "../ws-errors";
import type { HomeAssistant, MaintenanceObject, MaintenanceTask } from "../types";

interface ObjectFull {
  entry_id: string;
  object: MaintenanceObject;
  tasks: MaintenanceTask[];
}

export class MaintenanceObjectQuickActionsDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _open = false;
  @state() private _entryId: string | null = null;
  @state() private _data: ObjectFull | null = null;
  @state() private _busy = false;
  @state() private _error = "";

  private get _lang(): string {
    return this.hass?.language || "en";
  }

  public async openFor(entryId: string): Promise<void> {
    this._entryId = entryId;
    this._error = "";
    this._open = true;
    await this._load();
  }

  public close(): void {
    this._open = false;
    this._data = null;
    this._error = "";
  }

  private async _load(): Promise<void> {
    if (!this._entryId) return;
    try {
      const r = await this.hass.connection.sendMessagePromise<ObjectFull>({
        type: "maintenance_supporter/object",
        entry_id: this._entryId,
      });
      this._data = r;
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    }
  }

  private _onEditObject(): void {
    if (!this._entryId || !this._data) return;
    import("../dialog-mount").then(({ openEditObjectDialog }) => {
      openEditObjectDialog(this._entryId!, this._data!.object);
      this.close();
    });
  }

  private _onAddTask(): void {
    if (!this._entryId) return;
    import("../dialog-mount").then(({ openCreateTaskDialog }) => {
      openCreateTaskDialog();
      this.close();
    });
  }

  private async _onDelete(): Promise<void> {
    if (!this._entryId || !this._data) return;
    const confirmText = t("delete_object_confirm", this._lang)
      || `Delete "${this._data.object.name}" and all its tasks?`;
    if (!window.confirm(confirmText)) return;
    this._busy = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/object/delete",
        entry_id: this._entryId,
      });
      this.dispatchEvent(
        new CustomEvent("object-deleted", {
          detail: { entry_id: this._entryId },
          bubbles: true, composed: true,
        }),
      );
      this.close();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._busy = false;
    }
  }

  private async _onArchiveObject(): Promise<void> {
    if (!this._entryId || !this._data) return;
    const archived = !!this._data.object.archived;
    if (!archived) {
      const confirmText = t("confirm_archive_object", this._lang)
        || "Archive this object and its tasks?";
      if (!window.confirm(confirmText)) return;
    }
    this._busy = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: archived
          ? "maintenance_supporter/object/unarchive"
          : "maintenance_supporter/object/archive",
        entry_id: this._entryId,
      });
      this.dispatchEvent(
        new CustomEvent("object-changed", {
          detail: { entry_id: this._entryId },
          bubbles: true, composed: true,
        }),
      );
      this.close();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._busy = false;
    }
  }

  private _onTaskClick(taskId: string): void {
    if (!this._entryId) return;
    // Open the task quick-actions for this task — reuses existing dialog
    import("../dialog-mount").then(({ openTaskQuickActions }) => {
      openTaskQuickActions(this._entryId!, taskId);
      // Keep this dialog open so user lands back on object after closing task dialog
    });
  }

  render() {
    if (!this._open) return nothing;
    const L = this._lang;
    const data = this._data;
    const obj = data?.object;
    const tasks = data?.tasks || [];
    const isAdmin = (this.hass?.user?.is_admin ?? true) as boolean;

    return html`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${data && obj
          ? html`
              <div class="header">
                <div class="title">${obj.name}</div>
                ${this._renderMetaRow(obj)}
              </div>

              ${this._error ? html`<div class="error">${this._error}</div>` : nothing}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${t("tasks", L) || "Tasks"}</strong>
                  <span class="count">${tasks.length}</span>
                </div>
                ${tasks.length === 0
                  ? html`<div class="empty">${t("no_tasks", L) || "No tasks yet."}</div>`
                  : html`
                      <div class="task-list">
                        ${tasks.map((task) => html`
                          <div class="task-row" @click=${() => this._onTaskClick(task.id)}>
                            <span class="status-dot" style="background: ${STATUS_COLORS[task.status] || "#ccc"}"></span>
                            <span class="task-name">${task.name}</span>
                            <span class="task-status">${t(task.status || "ok", L)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${obj.notes
                ? html`
                    <div class="notes-section">
                      <strong>${t("object_notes_label", L)}</strong>
                      <div class="notes-body">${obj.notes}</div>
                    </div>
                  `
                : nothing}

              ${isAdmin
                ? html`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${t("add_task", L) || "Add task"}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${t("edit", L) || "Edit"}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${obj.archived ? 'mdi:archive-arrow-up-outline' : 'mdi:archive-outline'}"></ha-icon>
                        ${obj.archived ? (t("unarchive", L) || "Unarchive") : (t("archive", L) || "Archive")}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${t("delete", L) || "Delete"}
                      </button>
                    </div>
                  `
                : nothing}
            `
          : html`<div class="loading">${t("loading", L) || "Loading…"}</div>`}
      </div>
    `;
  }

  private _renderMetaRow(obj: MaintenanceObject) {
    const L = this._lang;
    const items: Array<[string, string]> = [];
    if (obj.area_id) items.push([t("area", L), obj.area_id]);
    if (obj.manufacturer) items.push([t("manufacturer", L), obj.manufacturer]);
    if (obj.model) items.push([t("model", L), obj.model]);
    if (obj.serial_number) items.push([t("serial_number_label", L), obj.serial_number]);
    if (obj.installation_date) items.push([t("installed", L), obj.installation_date]);
    if (obj.warranty_expiry) items.push([t("warranty", L), obj.warranty_expiry]);
    if (obj.documentation_url) items.push([t("documentation_url_label", L), obj.documentation_url]);

    if (items.length === 0) return nothing;
    return html`
      <div class="meta">
        ${items.map(
          ([label, value]) => html`
            <div class="meta-item">
              <span class="meta-label">${label}</span>
              <span class="meta-value">${
                // Only render http(s) values as links (never javascript:/data:);
                // value-based so it works in every UI language, not just English.
                /^https?:\/\//i.test(value)
                  ? html`<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`
                  : value
              }</span>
            </div>
          `,
        )}
      </div>
    `;
  }

  static styles = css`
    :host { display: contents; }
    .backdrop {
      position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.5);
    }
    .dialog {
      position: fixed; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: 95vw; max-width: 480px;
      max-height: 92vh; overflow: auto;
      background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
      color: var(--primary-text-color);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      padding: 20px; z-index: 101;
      display: flex; flex-direction: column; gap: 14px;
    }
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
      padding: 8px; border-radius: 6px; cursor: pointer;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
      transition: background 0.12s;
    }
    .task-row:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .task-name { flex: 1; font-size: 14px; }
    .task-status { font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; }
    .notes-body { white-space: pre-wrap; font-size: 13px; padding: 8px; background: var(--secondary-background-color); border-radius: 6px; }
    .actions { display: flex; gap: 8px; padding-top: 8px; border-top: 1px solid var(--divider-color); }
    .actions .btn { flex: 1; }
    .btn {
      padding: 8px; font-size: 13px; border-radius: 6px; cursor: pointer;
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
    .error { padding: 8px; border-radius: 6px; background: rgba(211,47,47,0.1); color: var(--error-color); font-size: 13px; }
  `;
}

if (!customElements.get("maintenance-object-quick-actions-dialog")) {
  customElements.define(
    "maintenance-object-quick-actions-dialog",
    MaintenanceObjectQuickActionsDialog,
  );
}
