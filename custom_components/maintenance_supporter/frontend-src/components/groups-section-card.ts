/** v2.4.0 — Interactive Groups Section Card.
 *
 *  Replaces the read-only markdown groups card. Lets the admin add / rename /
 *  delete groups inline. Task assignment lives in the panel (it needs the
 *  full task picker), so each group has a "Manage tasks" link that deep-links
 *  there.
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t } from "../styles";
import { describeWsError } from "../ws-errors";
import { sectionCardSharedStyles } from "./section-card-shared-styles";
import type { HomeAssistant } from "../types";

interface GroupEntry {
  name?: string;
  description?: string;
  task_refs?: { entry_id: string; task_id: string }[];
}

interface GroupsResp {
  groups?: Record<string, GroupEntry>;
}

interface CardConfig { type: string; title?: string; }

export class MaintenanceGroupsSectionCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config: CardConfig = { type: "" };
  @state() private _groups: Record<string, GroupEntry> = {};
  @state() private _loaded = false;
  @state() private _busy = false;
  @state() private _error = "";
  @state() private _newName = "";
  @state() private _editingId: string | null = null;
  @state() private _editingName = "";

  private _hasInitiallyLoaded = false;

  setConfig(config: CardConfig): void {
    this._config = config;
  }

  getCardSize(): number {
    return 2;
  }

  private get _lang(): string {
    return this.hass?.language || "en";
  }

  private get _isAdmin(): boolean {
    return (this.hass?.user?.is_admin ?? true) as boolean;
  }

  updated(changedProps: Map<string, unknown>): void {
    super.updated(changedProps);
    if (changedProps.has("hass") && this.hass && !this._hasInitiallyLoaded) {
      this._hasInitiallyLoaded = true;
      void this._load();
    }
  }

  private async _load(): Promise<void> {
    try {
      const r = await this.hass.connection.sendMessagePromise<GroupsResp>({
        type: "maintenance_supporter/groups",
      });
      this._groups = r.groups || {};
      this._loaded = true;
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    }
  }

  private async _addGroup(): Promise<void> {
    if (!this._isAdmin) return;
    const name = this._newName.trim();
    if (!name) return;
    this._busy = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/group/create",
        name,
      });
      this._newName = "";
      await this._load();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._busy = false;
    }
  }

  private _startEdit(id: string): void {
    this._editingId = id;
    this._editingName = this._groups[id]?.name || "";
  }

  private async _saveEdit(): Promise<void> {
    if (!this._isAdmin || !this._editingId) return;
    const name = this._editingName.trim();
    if (!name) return;
    this._busy = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/group/update",
        group_id: this._editingId,
        name,
      });
      this._editingId = null;
      this._editingName = "";
      await this._load();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._busy = false;
    }
  }

  private async _deleteGroup(id: string, name: string): Promise<void> {
    if (!this._isAdmin) return;
    const confirmText = (t("group_delete_confirm", this._lang)
      || "Delete group \"{name}\"?").replace("{name}", name);
    if (!window.confirm(confirmText)) return;
    this._busy = true;
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/group/delete",
        group_id: id,
      });
      await this._load();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._busy = false;
    }
  }

  private _onDeepLink(): void {
    const path = "/maintenance-supporter?ms_action=open_groups";
    history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed"));
  }

  private _onKeyDown(e: KeyboardEvent, action: () => void): void {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    } else if (e.key === "Escape") {
      e.preventDefault();
      this._editingId = null;
      this._editingName = "";
    }
  }

  render() {
    const L = this._lang;
    if (!this._loaded) {
      return html`<ha-card><div class="loading">${t("loading", L) || "Loading…"}</div></ha-card>`;
    }
    const ids = Object.keys(this._groups);

    return html`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">
              <span class="emoji">🏷️</span>
              <span>${this._config.title || (t("groups", L) || "Groups")}</span>
              <span class="count">${ids.length}</span>
            </div>
          </div>

          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}

          ${ids.length === 0
            ? html`<div class="empty">${t("groups_empty", L) || "No groups yet."}</div>`
            : html`
                <div class="group-list">
                  ${ids.map((id) => {
                    const g = this._groups[id];
                    const taskCount = g.task_refs?.length ?? 0;
                    const isEditing = this._editingId === id;
                    return html`
                      <div class="group-row">
                        ${isEditing
                          ? html`
                              <input class="edit-input" type="text"
                                .value=${this._editingName}
                                ?disabled=${this._busy}
                                @input=${(e: Event) => {
                                  this._editingName = (e.target as HTMLInputElement).value;
                                }}
                                @keydown=${(e: KeyboardEvent) => this._onKeyDown(e, this._saveEdit.bind(this))} />
                              <button class="btn small primary"
                                @click=${this._saveEdit}
                                ?disabled=${this._busy || !this._editingName.trim()}>
                                ${t("save", L) || "Save"}
                              </button>
                              <button class="btn small"
                                @click=${() => { this._editingId = null; }}>
                                ${t("cancel", L) || "Cancel"}
                              </button>
                            `
                          : html`
                              <span class="group-name">${g.name || "Unnamed"}</span>
                              <span class="task-count">${taskCount}</span>
                              ${this._isAdmin
                                ? html`
                                    <button class="icon-btn"
                                      title="${t("edit", L) || "Edit"}"
                                      @click=${() => this._startEdit(id)}
                                      ?disabled=${this._busy}>
                                      <ha-icon icon="mdi:pencil"></ha-icon>
                                    </button>
                                    <button class="icon-btn danger"
                                      title="${t("delete", L) || "Delete"}"
                                      @click=${() => this._deleteGroup(id, g.name || "Unnamed")}
                                      ?disabled=${this._busy}>
                                      <ha-icon icon="mdi:delete"></ha-icon>
                                    </button>
                                  `
                                : nothing}
                            `}
                      </div>
                    `;
                  })}
                </div>
              `}

          ${this._isAdmin
            ? html`
                <div class="add-row">
                  <input type="text"
                    placeholder="${t("group_new_placeholder", L) || "Add group…"}"
                    .value=${this._newName}
                    ?disabled=${this._busy}
                    @input=${(e: Event) => {
                      this._newName = (e.target as HTMLInputElement).value;
                    }}
                    @keydown=${(e: KeyboardEvent) => this._onKeyDown(e, this._addGroup.bind(this))} />
                  <button class="btn primary"
                    @click=${this._addGroup}
                    ?disabled=${this._busy || !this._newName.trim()}>
                    <ha-icon icon="mdi:plus"></ha-icon>
                    ${t("add", L) || "Add"}
                  </button>
                </div>
                <button class="btn link" @click=${this._onDeepLink}>
                  ${t("groups_manage_tasks", L) || "Manage task assignments…"}
                </button>
              `
            : html`
                <button class="btn link" @click=${this._onDeepLink}>
                  ${t("groups_open_panel", L) || "Open in panel"}
                </button>
              `}
        </div>
      </ha-card>
    `;
  }

  static styles = [sectionCardSharedStyles, css`
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
  `];
}

if (!customElements.get("maintenance-groups-section-card")) {
  customElements.define(
    "maintenance-groups-section-card",
    MaintenanceGroupsSectionCard,
  );
}

(window as { customCards?: unknown[] }).customCards =
  (window as { customCards?: unknown[] }).customCards || [];
((window as { customCards?: unknown[] }).customCards!).push({
  type: "maintenance-groups-section-card",
  name: "Maintenance Supporter — Groups",
  description: "Inline group CRUD",
  preview: false,
});
