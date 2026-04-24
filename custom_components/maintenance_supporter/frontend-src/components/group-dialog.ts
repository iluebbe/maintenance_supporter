/** Dialog for creating/editing a maintenance group. */

import { css, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { t } from "../styles";
import { describeWsError } from "../ws-errors";
import type {
  GroupTaskRef,
  HomeAssistant,
  MaintenanceGroup,
  MaintenanceObjectResponse,
} from "../types";

export class MaintenanceGroupDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public objects: MaintenanceObjectResponse[] = [];

  @state() private _open = false;
  @state() private _loading = false;
  @state() private _error = "";
  @state() private _groupId: string | null = null; // null = create
  @state() private _name = "";
  @state() private _description = "";
  @state() private _selected: Set<string> = new Set(); // "entry_id:task_id"

  private get _lang(): string {
    return this.hass?.language ?? navigator.language.split("-")[0] ?? "en";
  }

  public openCreate(): void {
    this._reset();
    this._open = true;
  }

  public openEdit(groupId: string, group: MaintenanceGroup): void {
    this._reset();
    this._groupId = groupId;
    this._name = group.name;
    this._description = group.description || "";
    this._selected = new Set(group.task_refs.map((r) => `${r.entry_id}:${r.task_id}`));
    this._open = true;
  }

  private _reset(): void {
    this._groupId = null;
    this._name = "";
    this._description = "";
    this._selected = new Set();
    this._error = "";
  }

  private _close(): void {
    this._open = false;
  }

  private _toggleTask = (entryId: string, taskId: string): void => {
    const key = `${entryId}:${taskId}`;
    const next = new Set(this._selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this._selected = next;
  };

  private _buildTaskRefs(): GroupTaskRef[] {
    return [...this._selected].map((k) => {
      const [entry_id, task_id] = k.split(":", 2);
      return { entry_id, task_id };
    });
  }

  private _save = async (): Promise<void> => {
    const name = this._name.trim();
    if (!name) {
      this._error = t("group_name_required", this._lang);
      return;
    }
    this._loading = true;
    this._error = "";
    try {
      const task_refs = this._buildTaskRefs();
      if (this._groupId) {
        await this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/group/update",
          group_id: this._groupId,
          name,
          description: this._description,
          task_refs,
        });
      } else {
        await this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/group/create",
          name,
          description: this._description,
          task_refs,
        });
      }
      this._open = false;
      this.dispatchEvent(new CustomEvent("group-saved"));
    } catch (e) {
      this._error = describeWsError(e, this._lang, t("save_error", this._lang));
    } finally {
      this._loading = false;
    }
  };

  render() {
    if (!this._open) return html``;
    const L = this._lang;
    const title = this._groupId ? t("edit_group", L) : t("new_group", L);

    return html`
      <ha-dialog open @closed=${this._close} heading="${title}">
        <div class="content">
          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
          <ha-textfield
            label="${t("name", L)}"
            required
            .value=${this._name}
            @input=${(e: Event) => (this._name = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
          <ha-textfield
            label="${t("description_optional", L)}"
            .value=${this._description}
            @input=${(e: Event) => (this._description = (e.target as HTMLInputElement).value)}
          ></ha-textfield>

          <div class="section-title">${t("group_select_tasks", L)}</div>
          ${this.objects.length === 0
            ? html`<div class="hint">${t("no_objects", L)}</div>`
            : html`
              <div class="objects">
                ${[...this.objects]
                  .sort((a, b) => a.object.name.localeCompare(b.object.name))
                  .map((obj) => html`
                  <div class="object-block">
                    <div class="object-name">${obj.object.name}</div>
                    ${obj.tasks.length === 0
                      ? html`<div class="hint small">${t("no_tasks_short", L)}</div>`
                      : [...obj.tasks]
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((task) => {
                        const key = `${obj.entry_id}:${task.id}`;
                        const checked = this._selected.has(key);
                        return html`
                          <label class="task-row">
                            <input type="checkbox"
                              .checked=${checked}
                              @change=${() => this._toggleTask(obj.entry_id, task.id)} />
                            <span>${task.name}</span>
                          </label>
                        `;
                      })}
                  </div>
                `)}
              </div>
            `}
          <div class="selected-count">
            ${t("selected", L)}: ${this._selected.size}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${t("cancel", L)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading || !this._name.trim()}>
            ${this._loading ? t("saving", L) : t("save", L)}
          </ha-button>
        </div>
      </ha-dialog>
    `;
  }

  static styles = css`
    .content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 360px;
      max-width: 520px;
      max-height: 60vh;
      overflow-y: auto;
    }
    @media (max-width: 600px) {
      .content {
        min-width: 0;
        max-width: none;
        max-height: none;
      }
    }
    ha-textfield { display: block; }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 500;
      margin-top: 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--divider-color);
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .hint.small { font-size: 12px; padding-left: 12px; }
    .objects { display: flex; flex-direction: column; gap: 8px; }
    .object-block {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 8px;
    }
    .object-name {
      font-weight: 500;
      font-size: 13px;
      margin-bottom: 4px;
    }
    .task-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 3px 0;
      font-size: 13px;
      cursor: pointer;
    }
    .task-row input { cursor: pointer; }
    .selected-count {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
  `;
}

if (!customElements.get("maintenance-group-dialog")) {
  customElements.define("maintenance-group-dialog", MaintenanceGroupDialog);
}
