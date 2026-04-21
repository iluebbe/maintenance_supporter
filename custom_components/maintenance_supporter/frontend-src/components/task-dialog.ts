/** Dialog for creating/editing a maintenance task. */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, MaintenanceTask, TriggerConfig, HAUser } from "../types";
import { t } from "../styles";
import { UserService } from "../user-service";

import { describeWsError } from "../ws-errors";

const MAINTENANCE_TYPE_KEYS = ["cleaning", "inspection", "replacement", "calibration", "service", "custom"];
const SCHEDULE_TYPE_KEYS = ["time_based", "sensor_based", "manual"];
const TRIGGER_TYPE_KEYS = ["threshold", "counter", "state_change", "runtime"];

export class MaintenanceTaskDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Boolean, attribute: "checklists-enabled" }) public checklistsEnabled = false;
  @property({ type: Boolean, attribute: "schedule-time-enabled" }) public scheduleTimeEnabled = false;
  @state() private _open = false;
  @state() private _loading = false;
  @state() private _error = "";
  @state() private _entryId = "";
  @state() private _taskId: string | null = null; // null = create

  // Task fields
  @state() private _name = "";
  @state() private _type = "custom";
  @state() private _scheduleType = "time_based";
  @state() private _intervalDays = "30";
  @state() private _warningDays = "7";
  @state() private _intervalAnchor: "completion" | "planned" = "completion";
  @state() private _notes = "";
  @state() private _documentationUrl = "";
  @state() private _customIcon = "";
  @state() private _enabled = true;

  // Trigger fields
  @state() private _triggerEntityId = "";
  @state() private _triggerEntityIds: string[] = [];
  @state() private _triggerEntityLogic: "any" | "all" = "any";
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
  @state() private _triggerRuntimeHours = "";

  // Entity attribute introspection
  @state() private _suggestedAttributes: string[] = [];
  @state() private _availableAttributes: Array<{ name: string; value: unknown; numeric: boolean }> = [];
  @state() private _entityDomain = "";

  // NFC
  @state() private _lastPerformed = "";
  @state() private _nfcTagId = "";
  @state() private _availableTags: Array<{id: string; name: string}> = [];

  // User assignment
  @state() private _responsibleUserId: string | null = null;
  @state() private _availableUsers: HAUser[] = [];

  // Checklist (newline-separated steps, one per line)
  @state() private _checklistText = "";

  // Schedule time (HH:MM, advanced feature)
  @state() private _scheduleTime = "";

  // Environmental entity (adaptive_config)
  @state() private _environmentalEntity = "";
  @state() private _environmentalAttribute = "";
  private _environmentalInitial = ""; // for change detection on save
  private _environmentalAttributeInitial = "";
  private _userService: UserService | null = null;

  private get _lang(): string {
    return this.hass?.language ?? navigator.language.split("-")[0] ?? "en";
  }

  public async openCreate(entryId: string): Promise<void> {
    this._entryId = entryId;
    this._taskId = null;
    this._error = "";
    this._resetFields();
    await Promise.all([this._loadUsers(), this._loadTags()]);
    this._open = true;
  }

  public async openEdit(entryId: string, task: MaintenanceTask): Promise<void> {
    this._entryId = entryId;
    this._taskId = task.id;
    this._error = "";
    this._name = task.name;
    this._type = task.type;
    this._scheduleType = task.schedule_type;
    this._intervalDays = task.interval_days?.toString() || "30";
    this._warningDays = task.warning_days.toString();
    this._intervalAnchor = task.interval_anchor || "completion";
    this._notes = task.notes || "";
    this._documentationUrl = task.documentation_url || "";
    this._customIcon = task.custom_icon || "";
    this._enabled = task.enabled !== false;
    this._lastPerformed = task.last_performed || "";
    this._nfcTagId = task.nfc_tag_id || "";
    this._responsibleUserId = task.responsible_user_id || null;

    this._checklistText = (task.checklist || []).join("\n");
    this._scheduleTime = task.schedule_time || "";

    const ac = task.adaptive_config || {};
    this._environmentalEntity = (ac.environmental_entity as string) || "";
    this._environmentalAttribute = (ac.environmental_attribute as string) || "";
    this._environmentalInitial = this._environmentalEntity;
    this._environmentalAttributeInitial = this._environmentalAttribute;

    if (task.trigger_config) {
      const tc = task.trigger_config;
      this._triggerEntityId = tc.entity_id || "";
      this._triggerEntityIds = tc.entity_ids || (tc.entity_id ? [tc.entity_id] : []);
      this._triggerEntityLogic = tc.entity_logic || "any";
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
      this._triggerRuntimeHours = tc.trigger_runtime_hours?.toString() || "";
    } else {
      this._resetTriggerFields();
    }

    // Fetch entity attributes if trigger entity is set
    if (this._triggerEntityId) {
      this._fetchEntityAttributes(this._triggerEntityId);
    }

    await Promise.all([this._loadUsers(), this._loadTags()]);
    this._open = true;
  }

  private _resetFields(): void {
    this._name = "";
    this._type = "custom";
    this._scheduleType = "time_based";
    this._intervalDays = "30";
    this._warningDays = "7";
    this._intervalAnchor = "completion";
    this._notes = "";
    this._documentationUrl = "";
    this._customIcon = "";
    this._enabled = true;
    this._lastPerformed = "";
    this._nfcTagId = "";
    this._responsibleUserId = null;
    this._checklistText = "";
    this._scheduleTime = "";
    this._environmentalEntity = "";
    this._environmentalAttribute = "";
    this._environmentalInitial = "";
    this._environmentalAttributeInitial = "";
    this._resetTriggerFields();
  }

  private _resetTriggerFields(): void {
    this._triggerEntityId = "";
    this._triggerEntityIds = [];
    this._triggerEntityLogic = "any";
    this._triggerAttribute = "";
    this._suggestedAttributes = [];
    this._availableAttributes = [];
    this._entityDomain = "";
    this._triggerType = "threshold";
    this._triggerAbove = "";
    this._triggerBelow = "";
    this._triggerForMinutes = "0";
    this._triggerTargetValue = "";
    this._triggerDeltaMode = false;
    this._triggerFromState = "";
    this._triggerToState = "";
    this._triggerTargetChanges = "";
    this._triggerRuntimeHours = "";
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

  private async _loadTags(): Promise<void> {
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/tags/list",
      }) as { tags: Array<{id: string; name: string}> };
      this._availableTags = result.tags || [];
    } catch {
      this._availableTags = [];
    }
  }

  private async _fetchEntityAttributes(entityId: string): Promise<void> {
    if (!entityId || !this.hass) {
      this._suggestedAttributes = [];
      this._availableAttributes = [];
      this._entityDomain = "";
      return;
    }
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/entity/attributes",
        entity_id: entityId,
      }) as {
        domain: string;
        suggested_attributes: string[];
        available_attributes: Array<{ name: string; value: unknown; numeric: boolean }>;
      };
      this._entityDomain = result.domain || "";
      this._suggestedAttributes = result.suggested_attributes || [];
      this._availableAttributes = result.available_attributes || [];
    } catch {
      this._suggestedAttributes = [];
      this._availableAttributes = [];
      this._entityDomain = "";
    }
  }

  private async _save(): Promise<void> {
    if (!this._name.trim()) return;
    this._loading = true;
    this._error = "";
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

      if (this._scheduleType !== "manual") {
        if (this._intervalDays) {
          data.interval_days = parseInt(this._intervalDays, 10);
          data.interval_anchor = this._intervalAnchor;
        } else if (this._taskId) {
          data.interval_days = null;
          data.interval_anchor = "completion";
        }
      } else if (this._taskId) {
        data.interval_days = null;
        data.interval_anchor = "completion";
      }

      data.notes = this._notes || null;
      data.documentation_url = this._documentationUrl || null;
      data.custom_icon = this._customIcon || null;
      data.enabled = this._enabled;
      data.last_performed = this._lastPerformed || null;
      data.nfc_tag_id = this._nfcTagId || null;
      data.responsible_user_id = this._responsibleUserId;

      if (this._scheduleType === "sensor_based" && this._triggerEntityId) {
        const entityIds = this._triggerEntityIds.length > 0
          ? this._triggerEntityIds
          : [this._triggerEntityId];
        const triggerConfig: TriggerConfig = {
          entity_id: entityIds[0],
          entity_ids: entityIds,
          type: this._triggerType,
        };
        if (this._triggerAttribute) triggerConfig.attribute = this._triggerAttribute;

        // Multi-entity: store entity_logic for all trigger types
        if (entityIds.length > 1) {
          triggerConfig.entity_logic = this._triggerEntityLogic;
        }

        if (this._triggerType === "threshold") {
          if (this._triggerAbove) { const v = parseFloat(this._triggerAbove); if (!isNaN(v)) triggerConfig.trigger_above = v; }
          if (this._triggerBelow) { const v = parseFloat(this._triggerBelow); if (!isNaN(v)) triggerConfig.trigger_below = v; }
          if (this._triggerForMinutes) { const v = parseInt(this._triggerForMinutes, 10); if (!isNaN(v)) triggerConfig.trigger_for_minutes = v; }
        } else if (this._triggerType === "counter") {
          if (this._triggerTargetValue) { const v = parseFloat(this._triggerTargetValue); if (!isNaN(v)) triggerConfig.trigger_target_value = v; }
          triggerConfig.trigger_delta_mode = this._triggerDeltaMode;
        } else if (this._triggerType === "state_change") {
          if (this._triggerFromState) triggerConfig.trigger_from_state = this._triggerFromState;
          if (this._triggerToState) triggerConfig.trigger_to_state = this._triggerToState;
          if (this._triggerTargetChanges) { const v = parseInt(this._triggerTargetChanges, 10); if (!isNaN(v)) triggerConfig.trigger_target_changes = v; }
        } else if (this._triggerType === "runtime") {
          if (this._triggerRuntimeHours) { const v = parseFloat(this._triggerRuntimeHours); if (!isNaN(v)) triggerConfig.trigger_runtime_hours = v; }
        }

        data.trigger_config = triggerConfig;
      } else if (this._taskId) {
        data.trigger_config = null;
      }

      // Schedule time only sent when feature is enabled — empty string clears.
      if (this.scheduleTimeEnabled && this._scheduleType === "time_based") {
        const t = this._scheduleTime.trim();
        data.schedule_time = /^([01]\d|2[0-3]):[0-5]\d$/.test(t) ? t : null;
      }

      if (this.checklistsEnabled) {
        const items = this._checklistText
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
          .slice(0, 100);
        data.checklist = items.length ? items : null;
      }

      const result = await this.hass.connection.sendMessagePromise(data) as { task_id?: string };
      const savedTaskId = this._taskId || result?.task_id;

      // Environmental entity lives in adaptive_config (Store-managed),
      // so it has a dedicated endpoint. Only call it when something
      // actually changed, and only for sensor_based tasks.
      const envChanged =
        this._environmentalEntity !== this._environmentalInitial
        || this._environmentalAttribute !== this._environmentalAttributeInitial;
      if (
        savedTaskId
        && this._scheduleType === "sensor_based"
        && envChanged
      ) {
        try {
          await this.hass.connection.sendMessagePromise({
            type: "maintenance_supporter/task/set_environmental_entity",
            entry_id: this._entryId,
            task_id: savedTaskId,
            environmental_entity: this._environmentalEntity || null,
            environmental_attribute: this._environmentalAttribute || null,
          });
          this._environmentalInitial = this._environmentalEntity;
          this._environmentalAttributeInitial = this._environmentalAttribute;
        } catch {
          /* non-fatal — task itself saved */
        }
      }

      this._open = false;
      this.dispatchEvent(new CustomEvent("task-saved"));
    } catch (e) {
      this._error = describeWsError(e, this._lang, t("save_error", this._lang));
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
        label="${t("entity_id", L)} (${t("comma_separated", L)})"
        .value=${this._triggerEntityIds.length > 0 ? this._triggerEntityIds.join(", ") : this._triggerEntityId}
        @input=${(e: Event) => {
          const raw = (e.target as HTMLInputElement).value;
          const ids = raw.split(",").map((s: string) => s.trim()).filter(Boolean);
          this._triggerEntityId = ids[0] || "";
          this._triggerEntityIds = ids;
          if (ids[0]) this._fetchEntityAttributes(ids[0]);
        }}
      ></ha-textfield>
      ${this._triggerEntityIds.length > 1 ? html`
        <div class="select-row">
          <label>${t("entity_logic", L)}</label>
          <select
            .value=${this._triggerEntityLogic}
            @change=${(e: Event) => (this._triggerEntityLogic = (e.target as HTMLSelectElement).value as "any" | "all")}
          >
            <option value="any" ?selected=${this._triggerEntityLogic === "any"}>${t("entity_logic_any", L)}</option>
            <option value="all" ?selected=${this._triggerEntityLogic === "all"}>${t("entity_logic_all", L)}</option>
          </select>
        </div>
      ` : nothing}
      ${this._availableAttributes.length > 0
        ? html`
          <div class="select-row">
            <label>${t("attribute_optional", L)}</label>
            <select
              .value=${this._triggerAttribute}
              @change=${(e: Event) => (this._triggerAttribute = (e.target as HTMLSelectElement).value)}
            >
              <option value="" ?selected=${!this._triggerAttribute}>${t("use_entity_state", L)}</option>
              ${this._suggestedAttributes.map(
                (attr) => html`<option value=${attr} ?selected=${attr === this._triggerAttribute}>${attr} ★</option>`
              )}
              ${this._availableAttributes
                .filter((a) => !this._suggestedAttributes.includes(a.name))
                .map(
                  (a) => html`<option value=${a.name} ?selected=${a.name === this._triggerAttribute}>${a.name}${a.numeric ? "" : " (non-numeric)"}</option>`
                )}
            </select>
          </div>
        `
        : html`
          <ha-textfield
            label="${t("attribute_optional", L)}"
            .value=${this._triggerAttribute}
            @input=${(e: Event) => (this._triggerAttribute = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
        `
      }
      <div class="select-row">
        <label>${t("trigger_type", L)}</label>
        <select
          .value=${this._triggerType}
          @change=${(e: Event) => (this._triggerType = (e.target as HTMLSelectElement).value)}
        >
          ${TRIGGER_TYPE_KEYS.map(
            (key) => html`<option value=${key} ?selected=${key === this._triggerType}>${t(key, L)}</option>`
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
    if (this._triggerType === "runtime") {
      return html`
        <ha-textfield
          label="${t("runtime_hours", L)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${(e: Event) => (this._triggerRuntimeHours = (e.target as HTMLInputElement).value)}
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
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${title}</div>
        <div class="content">
          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
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
                (key) => html`<option value=${key} ?selected=${key === this._type}>${t(key, L)}</option>`
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
                (key) => html`<option value=${key} ?selected=${key === this._scheduleType}>${t(key, L)}</option>`
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
                <div class="select-row">
                  <label>${t("interval_anchor", L)}</label>
                  <select
                    .value=${this._intervalAnchor}
                    @change=${(e: Event) => (this._intervalAnchor = (e.target as HTMLSelectElement).value as "completion" | "planned")}
                  >
                    <option value="completion" ?selected=${this._intervalAnchor === "completion"}>${t("anchor_completion", L)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor === "planned"}>${t("anchor_planned", L)}</option>
                  </select>
                </div>
                ${this.scheduleTimeEnabled ? html`
                  <ha-textfield
                    label="${t("schedule_time_optional", L)}"
                    type="time"
                    .value=${this._scheduleTime}
                    helper="${t("schedule_time_help", L)}"
                    @input=${(e: Event) => (this._scheduleTime = (e.target as HTMLInputElement).value)}
                  ></ha-textfield>
                ` : nothing}
              `
            : nothing}
          <ha-textfield
            label="${t("warning_days", L)}"
            type="number"
            .value=${this._warningDays}
            @input=${(e: Event) => (this._warningDays = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
          ${this.checklistsEnabled ? html`
            <h3>${t("checklist_steps_optional", L)}</h3>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${t("checklist_placeholder", L)}"
              .value=${this._checklistText}
              @input=${(e: Event) => (this._checklistText = (e.target as HTMLTextAreaElement).value)}
            ></textarea>
            <div class="field-help">${t("checklist_help", L)}</div>
          ` : nothing}
          <ha-textfield
            label="${t("last_performed_optional", L)}"
            type="date"
            .value=${this._lastPerformed}
            @input=${(e: Event) => (this._lastPerformed = (e.target as HTMLInputElement).value)}
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
              <option value="" ?selected=${!this._responsibleUserId}>${t("no_user_assigned", L)}</option>
              ${this._availableUsers.map(
                (user) => html`<option value=${user.id} ?selected=${user.id === this._responsibleUserId}>${user.name}</option>`
              )}
            </select>
          </div>
          ${this._renderTriggerFields()}
          ${this._scheduleType === "sensor_based" ? html`
            <ha-textfield
              label="${t("environmental_entity_optional", L)}"
              helper="${t("environmental_entity_helper", L)}"
              .value=${this._environmentalEntity}
              @input=${(e: Event) => (this._environmentalEntity = (e.target as HTMLInputElement).value.trim())}
            ></ha-textfield>
            ${this._environmentalEntity ? html`
              <ha-textfield
                label="${t("environmental_attribute_optional", L)}"
                .value=${this._environmentalAttribute}
                @input=${(e: Event) => (this._environmentalAttribute = (e.target as HTMLInputElement).value.trim())}
              ></ha-textfield>
            ` : nothing}
          ` : nothing}
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
          <ha-icon-picker
            .hass=${this.hass}
            label="${t("custom_icon_optional", L)}"
            .value=${this._customIcon}
            @value-changed=${(e: CustomEvent) =>
              (this._customIcon = (e.detail.value as string) || "")}
          ></ha-icon-picker>
          ${this._availableTags.length > 0
            ? html`
              <div class="select-row">
                <label>${t("nfc_tag_id_optional", L)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${(e: Event) => (this._nfcTagId = (e.target as HTMLSelectElement).value)}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${t("no_nfc_tag", L)}</option>
                  ${this._availableTags.map(
                    (tag) => html`<option value=${tag.id} ?selected=${tag.id === this._nfcTagId}>${tag.name}</option>`
                  )}
                </select>
              </div>
            `
            : html`
              <ha-textfield
                label="${t("nfc_tag_id_optional", L)}"
                .value=${this._nfcTagId}
                @input=${(e: Event) => (this._nfcTagId = (e.target as HTMLInputElement).value)}
              ></ha-textfield>
            `
          }
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${(e: Event) => (this._enabled = (e.target as HTMLInputElement).checked)}
            />
            ${t("task_enabled", L)}
          </label>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${t("cancel", L)}</ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading || !this._name.trim()}
          >
            ${this._loading ? t("saving", L) : t("save", L)}
          </ha-button>
        </div>
      </ha-dialog>
    `;
  }

  static styles = css`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 350px;
      max-height: 70vh;
      overflow-y: auto;
    }
    @media (max-width: 600px) {
      .content {
        min-width: 0;
        max-height: none;
      }
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    ha-textfield {
      display: block;
    }
    .field-label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .checklist-textarea {
      width: 100%;
      min-height: 88px;
      padding: 8px;
      font-family: inherit;
      font-size: 14px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      resize: vertical;
      box-sizing: border-box;
    }
    .field-help {
      font-size: 12px;
      color: var(--secondary-text-color);
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
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .toggle-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      cursor: pointer;
    }
  `;
}

if (!customElements.get("maintenance-task-dialog")) {
  customElements.define("maintenance-task-dialog", MaintenanceTaskDialog);
}
