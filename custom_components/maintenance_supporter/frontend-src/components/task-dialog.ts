/** Dialog for creating/editing a maintenance task. */

import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, MaintenanceTask, TriggerConfig, HAUser } from "../types";
import { t } from "../styles";
import { UserService } from "../user-service";

const MAINTENANCE_TYPE_KEYS = ["cleaning", "inspection", "replacement", "calibration", "service", "custom"];
const SCHEDULE_TYPE_KEYS = ["time_based", "sensor_based", "manual"];
const TRIGGER_TYPE_KEYS = ["threshold", "counter", "state_change"];

@customElement("maintenance-task-dialog")
export class MaintenanceTaskDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _open = false;
  @state() private _loading = false;
  @state() private _entryId = "";
  @state() private _taskId: string | null = null; // null = create

  // Task fields
  @state() private _name = "";
  @state() private _type = "custom";
  @state() private _scheduleType = "time_based";
  @state() private _intervalDays = "30";
  @state() private _warningDays = "7";
  @state() private _notes = "";
  @state() private _documentationUrl = "";

  // Trigger fields
  @state() private _triggerEntityId = "";
  @state() private _triggerAttribute = "";
  @state() private _triggerType = "threshold";
  @state() private _triggerAbove = "";
  @state() private _triggerBelow = "";
  @state() private _triggerForMinutes = "0";
  @state() private _triggerTargetValue = "";
  @state() private _triggerDeltaMode = false;
  @state() private _triggerFromState = "";
  @state() private _triggerToState = "";
  @state() private _triggerTargetChanges = "";

  // User assignment
  @state() private _responsibleUserId: string | null = null;
  @state() private _availableUsers: HAUser[] = [];
  private _userService: UserService | null = null;

  private get _lang(): string {
    return this.hass?.language ?? navigator.language.split("-")[0] ?? "en";
  }

  public async openCreate(entryId: string): Promise<void> {
    this._entryId = entryId;
    this._taskId = null;
    this._resetFields();
    await this._loadUsers();
    this._open = true;
  }

  public async openEdit(entryId: string, task: MaintenanceTask): Promise<void> {
    this._entryId = entryId;
    this._taskId = task.id;
    this._name = task.name;
    this._type = task.type;
    this._scheduleType = task.schedule_type;
    this._intervalDays = task.interval_days?.toString() || "30";
    this._warningDays = task.warning_days.toString();
    this._notes = task.notes || "";
    this._documentationUrl = task.documentation_url || "";
    this._responsibleUserId = task.responsible_user_id || null;

    if (task.trigger_config) {
      const tc = task.trigger_config;
      this._triggerEntityId = tc.entity_id || "";
      this._triggerAttribute = tc.attribute || "";
      this._triggerType = tc.type || "threshold";
      this._triggerAbove = tc.trigger_above?.toString() || "";
      this._triggerBelow = tc.trigger_below?.toString() || "";
      this._triggerForMinutes = tc.trigger_for_minutes?.toString() || "0";
      this._triggerTargetValue = tc.trigger_target_value?.toString() || "";
      this._triggerDeltaMode = tc.trigger_delta_mode || false;
      this._triggerFromState = tc.trigger_from_state || "";
      this._triggerToState = tc.trigger_to_state || "";
      this._triggerTargetChanges = tc.trigger_target_changes?.toString() || "";
    } else {
      this._resetTriggerFields();
    }

    await this._loadUsers();
    this._open = true;
  }

  private _resetFields(): void {
    this._name = "";
    this._type = "custom";
    this._scheduleType = "time_based";
    this._intervalDays = "30";
    this._warningDays = "7";
    this._notes = "";
    this._documentationUrl = "";
    this._responsibleUserId = null;
    this._resetTriggerFields();
  }

  private _resetTriggerFields(): void {
    this._triggerEntityId = "";
    this._triggerAttribute = "";
    this._triggerType = "threshold";
    this._triggerAbove = "";
    this._triggerBelow = "";
    this._triggerForMinutes = "0";
    this._triggerTargetValue = "";
    this._triggerDeltaMode = false;
    this._triggerFromState = "";
    this._triggerToState = "";
    this._triggerTargetChanges = "";
  }

  private async _loadUsers(): Promise<void> {
    if (!this._userService) {
      this._userService = new UserService(this.hass);
    }
    try {
      this._availableUsers = await this._userService.getUsers();
    } catch (error) {
      console.error("Failed to load users:", error);
      this._availableUsers = [];
    }
  }

  private async _save(): Promise<void> {
    if (!this._name.trim()) return;
    this._loading = true;
    try {
      const data: Record<string, unknown> = {
        type: this._taskId
          ? "maintenance_supporter/task/update"
          : "maintenance_supporter/task/create",
        entry_id: this._entryId,
        name: this._name,
        task_type: this._type,
        schedule_type: this._scheduleType,
        warning_days: parseInt(this._warningDays, 10) || 7,
      };

      if (this._taskId) data.task_id = this._taskId;

      if (this._scheduleType !== "manual" && this._intervalDays) {
        data.interval_days = parseInt(this._intervalDays, 10);
      }

      if (this._notes) data.notes = this._notes;
      if (this._documentationUrl) data.documentation_url = this._documentationUrl;
      if (this._responsibleUserId) data.responsible_user_id = this._responsibleUserId;

      if (this._scheduleType === "sensor_based" && this._triggerEntityId) {
        const triggerConfig: TriggerConfig = {
          entity_id: this._triggerEntityId,
          type: this._triggerType,
        };
        if (this._triggerAttribute) triggerConfig.attribute = this._triggerAttribute;

        if (this._triggerType === "threshold") {
          if (this._triggerAbove) triggerConfig.trigger_above = parseFloat(this._triggerAbove);
          if (this._triggerBelow) triggerConfig.trigger_below = parseFloat(this._triggerBelow);
          if (this._triggerForMinutes) triggerConfig.trigger_for_minutes = parseInt(this._triggerForMinutes, 10);
        } else if (this._triggerType === "counter") {
          if (this._triggerTargetValue) triggerConfig.trigger_target_value = parseFloat(this._triggerTargetValue);
          triggerConfig.trigger_delta_mode = this._triggerDeltaMode;
        } else if (this._triggerType === "state_change") {
          if (this._triggerFromState) triggerConfig.trigger_from_state = this._triggerFromState;
          if (this._triggerToState) triggerConfig.trigger_to_state = this._triggerToState;
          if (this._triggerTargetChanges) triggerConfig.trigger_target_changes = parseInt(this._triggerTargetChanges, 10);
        }

        data.trigger_config = triggerConfig;
      }

      await this.hass.connection.sendMessagePromise(data);
      this._open = false;
      this.dispatchEvent(new CustomEvent("task-saved"));
    } finally {
      this._loading = false;
    }
  }

  private _close(): void {
    this._open = false;
  }

  private _renderTriggerFields() {
    if (this._scheduleType !== "sensor_based") return nothing;
    const L = this._lang;

    return html`
      <h3>${t("trigger_configuration", L)}</h3>
      <ha-textfield
        label="${t("entity_id", L)}"
        .value=${this._triggerEntityId}
        @input=${(e: Event) => (this._triggerEntityId = (e.target as HTMLInputElement).value)}
      ></ha-textfield>
      <ha-textfield
        label="${t("attribute_optional", L)}"
        .value=${this._triggerAttribute}
        @input=${(e: Event) => (this._triggerAttribute = (e.target as HTMLInputElement).value)}
      ></ha-textfield>
      <div class="select-row">
        <label>${t("trigger_type", L)}</label>
        <select
          .value=${this._triggerType}
          @change=${(e: Event) => (this._triggerType = (e.target as HTMLSelectElement).value)}
        >
          ${TRIGGER_TYPE_KEYS.map(
            (key) => html`<option value=${key}>${t(key, L)}</option>`
          )}
        </select>
      </div>
      ${this._renderTriggerTypeFields()}
      <ha-textfield
        label="${t("safety_interval_days", L)}"
        type="number"
        .value=${this._intervalDays}
        @input=${(e: Event) => (this._intervalDays = (e.target as HTMLInputElement).value)}
      ></ha-textfield>
    `;
  }

  private _renderTriggerTypeFields() {
    const L = this._lang;
    if (this._triggerType === "threshold") {
      return html`
        <ha-textfield
          label="${t("trigger_above", L)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${(e: Event) => (this._triggerAbove = (e.target as HTMLInputElement).value)}
        ></ha-textfield>
        <ha-textfield
          label="${t("trigger_below", L)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${(e: Event) => (this._triggerBelow = (e.target as HTMLInputElement).value)}
        ></ha-textfield>
        <ha-textfield
          label="${t("for_at_least_minutes", L)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${(e: Event) => (this._triggerForMinutes = (e.target as HTMLInputElement).value)}
        ></ha-textfield>
      `;
    }
    if (this._triggerType === "counter") {
      return html`
        <ha-textfield
          label="${t("target_value", L)}"
          type="number"
          step="any"
          .value=${this._triggerTargetValue}
          @input=${(e: Event) => (this._triggerTargetValue = (e.target as HTMLInputElement).value)}
        ></ha-textfield>
        <label>
          <input
            type="checkbox"
            .checked=${this._triggerDeltaMode}
            @change=${(e: Event) => (this._triggerDeltaMode = (e.target as HTMLInputElement).checked)}
          />
          ${t("delta_mode", L)}
        </label>
      `;
    }
    if (this._triggerType === "state_change") {
      return html`
        <ha-textfield
          label="${t("from_state_optional", L)}"
          .value=${this._triggerFromState}
          @input=${(e: Event) => (this._triggerFromState = (e.target as HTMLInputElement).value)}
        ></ha-textfield>
        <ha-textfield
          label="${t("to_state_optional", L)}"
          .value=${this._triggerToState}
          @input=${(e: Event) => (this._triggerToState = (e.target as HTMLInputElement).value)}
        ></ha-textfield>
        <ha-textfield
          label="${t("target_changes", L)}"
          type="number"
          .value=${this._triggerTargetChanges}
          @input=${(e: Event) => (this._triggerTargetChanges = (e.target as HTMLInputElement).value)}
        ></ha-textfield>
      `;
    }
    return nothing;
  }

  render() {
    if (!this._open) return html``;
    const L = this._lang;
    const title = this._taskId ? t("edit_task", L) : t("new_task", L);
    return html`
      <ha-dialog open @closed=${this._close} .heading=${title}>
        <div class="content">
          <ha-textfield
            label="${t("task_name", L)}"
            required
            .value=${this._name}
            @input=${(e: Event) => (this._name = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
          <div class="select-row">
            <label>${t("maintenance_type", L)}</label>
            <select
              .value=${this._type}
              @change=${(e: Event) => (this._type = (e.target as HTMLSelectElement).value)}
            >
              ${MAINTENANCE_TYPE_KEYS.map(
                (key) => html`<option value=${key}>${t(key, L)}</option>`
              )}
            </select>
          </div>
          <div class="select-row">
            <label>${t("schedule_type", L)}</label>
            <select
              .value=${this._scheduleType}
              @change=${(e: Event) => (this._scheduleType = (e.target as HTMLSelectElement).value)}
            >
              ${SCHEDULE_TYPE_KEYS.map(
                (key) => html`<option value=${key}>${t(key, L)}</option>`
              )}
            </select>
          </div>
          ${this._scheduleType === "time_based"
            ? html`
                <ha-textfield
                  label="${t("interval_days", L)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${(e: Event) => (this._intervalDays = (e.target as HTMLInputElement).value)}
                ></ha-textfield>
              `
            : nothing}
          <ha-textfield
            label="${t("warning_days", L)}"
            type="number"
            .value=${this._warningDays}
            @input=${(e: Event) => (this._warningDays = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
          <div class="select-row">
            <label>${t("responsible_user", L)}</label>
            <select
              .value=${this._responsibleUserId || ""}
              @change=${(e: Event) => {
                const val = (e.target as HTMLSelectElement).value;
                this._responsibleUserId = val || null;
              }}
            >
              <option value="">${t("no_user_assigned", L)}</option>
              ${this._availableUsers.map(
                (user) => html`<option value=${user.id}>${user.name}</option>`
              )}
            </select>
          </div>
          ${this._renderTriggerFields()}
          <ha-textfield
            label="${t("notes_optional", L)}"
            .value=${this._notes}
            @input=${(e: Event) => (this._notes = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
          <ha-textfield
            label="${t("documentation_url_optional", L)}"
            .value=${this._documentationUrl}
            @input=${(e: Event) => (this._documentationUrl = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
        </div>
        <ha-button slot="secondaryAction" appearance="plain" @click=${this._close}>${t("cancel", L)}</ha-button>
        <ha-button
          slot="primaryAction"
          @click=${this._save}
          .disabled=${this._loading || !this._name.trim()}
        >
          ${this._loading ? t("saving", L) : t("save", L)}
        </ha-button>
      </ha-dialog>
    `;
  }

  static styles = css`
    .content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 350px;
      max-height: 70vh;
      overflow-y: auto;
    }
    ha-textfield {
      display: block;
    }
    h3 {
      margin: 8px 0 0;
      font-size: 14px;
      color: var(--primary-color);
    }
    .select-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .select-row label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .select-row select {
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
    }
  `;
}
