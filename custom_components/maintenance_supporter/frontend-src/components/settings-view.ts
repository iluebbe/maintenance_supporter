/** Settings view component for the Maintenance Supporter panel. */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { HomeAssistant, AdvancedFeatures, BudgetStatus, HAUser } from "../types";
import { t } from "../styles";
import { UserService } from "../user-service";

/* Settings response shape from WS maintenance_supporter/settings */
interface SettingsResponse {
  features: AdvancedFeatures;
  admin_panel_user_ids?: string[];
  general: {
    default_warning_days: number;
    notifications_enabled: boolean;
    notify_service: string;
    panel_enabled: boolean;
  };
  notifications: {
    due_soon_enabled: boolean;
    due_soon_interval_hours: number;
    overdue_enabled: boolean;
    overdue_interval_hours: number;
    triggered_enabled: boolean;
    triggered_interval_hours: number;
    quiet_hours_enabled: boolean;
    quiet_hours_start: string;
    quiet_hours_end: string;
    max_per_day: number;
    bundling_enabled: boolean;
    bundle_threshold: number;
  };
  actions: {
    complete_enabled: boolean;
    skip_enabled: boolean;
    snooze_enabled: boolean;
    snooze_duration_hours: number;
  };
  budget: {
    monthly: number;
    yearly: number;
    alerts_enabled: boolean;
    alert_threshold_pct: number;
    currency: string;
    currency_symbol: string;
  };
  vacation: {
    enabled: boolean;
    start: string | null;
    end: string | null;
    buffer_days: number;
    exempt_task_ids: string[];
    is_active: boolean;
    window_end: string | null;
  };
}

interface VacationPreviewRow {
  task_id: string;
  entry_id: string;
  object_name: string;
  task_name: string;
  kind: "time_based" | "sensor_based";
  confidence: "deterministic" | "estimated" | "unpredictable";
  events: Array<{ date: string; status: "due_soon" | "overdue" | "triggered_est" }>;
  will_suppress: boolean;
}

const CURRENCIES = [
  "EUR", "USD", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY", "INR", "BRL",
];

export class MaintenanceSettingsView extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public features!: AdvancedFeatures;
  @property({ attribute: false }) public budget: BudgetStatus | null = null;

  @state() private _settings: SettingsResponse | null = null;
  @state() private _loading = true;
  @state() private _importCsv = "";
  @state() private _importLoading = false;
  @state() private _includeHistory = true;
  @state() private _toast = "";
  @state() private _testingNotification = false;
  @state() private _users: HAUser[] = [];

  // Vacation mode section state (v1.2.0)
  @state() private _vacEnabled = false;
  @state() private _vacStart = "";
  @state() private _vacEnd = "";
  @state() private _vacBuffer = 3;
  @state() private _vacExempt = new Set<string>();
  @state() private _vacIsActive = false;
  @state() private _vacWindowEnd: string | null = null;
  @state() private _vacAllTasks: Array<{ entry_id: string; object_name: string; task_id: string; task_name: string }> = [];
  @state() private _vacPreview: VacationPreviewRow[] = [];
  @state() private _vacPreviewLoading = false;
  @state() private _vacSaving = false;

  // Print QR codes section state
  @state() private _qrObjects: Array<{ entry_id: string; name: string; task_count: number }> = [];
  @state() private _qrSelectedEntries = new Set<string>();
  @state() private _qrActions = new Set<string>(["view"]);
  @state() private _qrUrlMode: "server" | "local" | "companion" = "companion";
  @state() private _qrBatchLoading = false;
  @state() private _qrBatchResults: Array<{
    entry_id: string; task_id: string;
    object_name: string; task_name: string;
    action: string; svg: string;
  }> = [];
  @state() private _qrObjectsLoaded = false;

  private _loaded = false;
  private _userService: UserService | null = null;

  private get _lang(): string {
    return this.hass?.language || "en";
  }

  updated(changedProps: Map<string, unknown>): void {
    super.updated(changedProps);
    if (changedProps.has("hass") && this.hass && !this._loaded) {
      this._loaded = true;
      this._userService = new UserService(this.hass);
      this._loadSettings();
      this._loadUsers();
    } else if (changedProps.has("hass") && this.hass && this._userService) {
      this._userService.updateHass(this.hass);
    }
  }

  private async _loadUsers(): Promise<void> {
    if (!this._userService) return;
    try {
      this._users = await this._userService.getUsers();
    } catch {
      this._users = [];
    }
  }

  private async _loadSettings(): Promise<void> {
    this._loading = true;
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/settings",
      });
      this._settings = result as SettingsResponse;
      this._hydrateVacationFromSettings();
    } catch {
      /* ignore */
    }
    this._loading = false;
  }

  private _hydrateVacationFromSettings(): void {
    const v = this._settings?.vacation;
    if (!v) return;
    this._vacEnabled = v.enabled;
    this._vacStart = v.start || "";
    this._vacEnd = v.end || "";
    this._vacBuffer = v.buffer_days;
    this._vacExempt = new Set(v.exempt_task_ids || []);
    this._vacIsActive = v.is_active;
    this._vacWindowEnd = v.window_end;
  }

  private async _updateSetting(key: string, value: unknown): Promise<void> {
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/global/update",
        settings: { [key]: value },
      });
      this._settings = result as SettingsResponse;
      this._showToast(t("settings_saved", this._lang));
      this.dispatchEvent(new CustomEvent("settings-changed"));
    } catch {
      this._showToast(t("action_error", this._lang));
    }
  }

  private _sendTestNotification = async (): Promise<void> => {
    this._testingNotification = true;
    try {
      const res = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/global/test_notification",
      }) as { success: boolean; message?: string };
      const msg = res.message
        || (res.success ? t("test_notification_success", this._lang) : t("test_notification_failed", this._lang));
      this._showToast(msg);
    } catch {
      this._showToast(t("test_notification_failed", this._lang));
    } finally {
      this._testingNotification = false;
    }
  };

  private _showToast(msg: string): void {
    this._toast = msg;
    setTimeout(() => { this._toast = ""; }, 3000);
  }

  private _downloadFile(content: string, filename: string, mime: string): void {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // --- Render ---

  render() {
    const L = this._lang;
    if (this._loading || !this._settings) {
      return html`<div class="settings-loading">Loading…</div>`;
    }

    return html`
      ${this._renderFeatures(L)}
      ${this._renderPanelAccess(L)}
      ${this._renderGeneral(L)}
      ${this._settings.general.notifications_enabled ? this._renderNotifications(L) : nothing}
      ${this.features.budget ? this._renderBudget(L) : nothing}
      ${this._renderVacation(L)}
      ${this._renderPrintQr(L)}
      ${this._renderImportExport(L)}
      ${this._toast ? html`<div class="settings-toast">${this._toast}</div>` : nothing}
    `;
  }

  // --- Section: Panel Access (1.0.44+) ---

  private _renderPanelAccess(L: string) {
    const selected = new Set(this._settings!.admin_panel_user_ids || []);
    const nonAdmins = this._users.filter((u) => !u.is_admin);

    const toggle = (uid: string, on: boolean): void => {
      const next = new Set(selected);
      if (on) next.add(uid); else next.delete(uid);
      this._updateSetting("admin_panel_user_ids", [...next]);
    };

    return html`
      <div class="settings-section">
        <h3>${t("settings_panel_access", L)} ${selected.size > 0 ? html`<span class="section-badge">${selected.size}</span>` : nothing}</h3>
        <p class="section-desc">${t("settings_panel_access_desc", L)}</p>
        ${nonAdmins.length === 0
          ? html`<div class="setting-row hint">${t("no_non_admin_users", L)}</div>`
          : nonAdmins.map((u) => html`
            <label class="setting-row">
              <span>
                <span class="setting-label">${u.name || u.id.slice(0, 8)}</span>
                <span class="setting-desc">${u.is_owner ? t("owner_label", L) : ""}</span>
              </span>
              <input type="checkbox"
                .checked=${selected.has(u.id)}
                @change=${(e: Event) => toggle(u.id, (e.target as HTMLInputElement).checked)} />
            </label>
          `)}
      </div>
    `;
  }

  // --- Section: Features ---

  private _renderFeatures(L: string) {
    const f = this._settings!.features;
    const items: { key: keyof AdvancedFeatures; settingKey: string; label: string; desc: string }[] = [
      { key: "adaptive", settingKey: "advanced_adaptive_visible", label: t("feat_adaptive", L), desc: t("feat_adaptive_desc", L) },
      { key: "predictions", settingKey: "advanced_predictions_visible", label: t("feat_predictions", L), desc: t("feat_predictions_desc", L) },
      { key: "seasonal", settingKey: "advanced_seasonal_visible", label: t("feat_seasonal", L), desc: t("feat_seasonal_desc", L) },
      { key: "environmental", settingKey: "advanced_environmental_visible", label: t("feat_environmental", L), desc: t("feat_environmental_desc", L) },
      { key: "budget", settingKey: "advanced_budget_visible", label: t("feat_budget", L), desc: t("feat_budget_desc", L) },
      { key: "groups", settingKey: "advanced_groups_visible", label: t("feat_groups", L), desc: t("feat_groups_desc", L) },
      { key: "checklists", settingKey: "advanced_checklists_visible", label: t("feat_checklists", L), desc: t("feat_checklists_desc", L) },
      { key: "schedule_time", settingKey: "advanced_schedule_time_visible", label: t("feat_schedule_time", L), desc: t("feat_schedule_time_desc", L) },
      { key: "completion_actions", settingKey: "advanced_completion_actions_visible", label: t("feat_completion_actions", L), desc: t("feat_completion_actions_desc", L) },
    ];

    return html`
      <div class="settings-section">
        <h3>${t("settings_features", L)}</h3>
        <p class="section-desc">${t("settings_features_desc", L)}</p>
        ${items.map((item) => html`
          <label class="setting-row">
            <span>
              <span class="setting-label">${item.label}</span>
              <span class="setting-desc">${item.desc}</span>
            </span>
            <input type="checkbox" .checked=${f[item.key]}
              @change=${(e: Event) => this._updateSetting(item.settingKey, (e.target as HTMLInputElement).checked)} />
          </label>
        `)}
      </div>
    `;
  }

  // --- Section: General ---

  private _renderGeneral(L: string) {
    const g = this._settings!.general;
    return html`
      <div class="settings-section">
        <h3>${t("settings_general", L)}</h3>
        <label class="setting-row">
          <span class="setting-label">${t("settings_default_warning", L)}</span>
          <input type="number" min="1" max="365" .value=${String(g.default_warning_days)}
            @change=${(e: Event) => {
              const v = parseInt((e.target as HTMLInputElement).value, 10);
              if (v >= 1 && v <= 365) this._updateSetting("default_warning_days", v);
            }} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${t("settings_panel_enabled", L)}</span>
          <input type="checkbox" .checked=${g.panel_enabled}
            @change=${(e: Event) => this._updateSetting("panel_enabled", (e.target as HTMLInputElement).checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${t("settings_notifications", L)}</span>
          <input type="checkbox" .checked=${g.notifications_enabled}
            @change=${(e: Event) => this._updateSetting("notifications_enabled", (e.target as HTMLInputElement).checked)} />
        </label>
        ${g.notifications_enabled ? html`
          <label class="setting-row">
            <span class="setting-label">${t("settings_notify_service", L)}</span>
            <input type="text" .value=${g.notify_service}
              @change=${(e: Event) => this._updateSetting("notify_service", (e.target as HTMLInputElement).value.trim())} />
          </label>
          <div class="setting-row">
            <span class="setting-label">${t("test_notification", L)}</span>
            <button class="ha-button secondary"
              ?disabled=${!g.notify_service || this._testingNotification}
              @click=${this._sendTestNotification}>
              ${this._testingNotification ? t("testing", L) : t("send_test", L)}
            </button>
          </div>
        ` : nothing}
      </div>
    `;
  }

  // --- Section: Notifications ---

  private _renderNotifications(L: string) {
    const n = this._settings!.notifications;
    const a = this._settings!.actions;
    return html`
      <div class="settings-section">
        <h3>${t("settings_notifications", L)}</h3>

        <label class="setting-row">
          <span>
            <span class="setting-label">${t("settings_notify_due_soon", L)}</span>
          </span>
          <input type="checkbox" .checked=${n.due_soon_enabled}
            @change=${(e: Event) => this._updateSetting("notify_due_soon_enabled", (e.target as HTMLInputElement).checked)} />
        </label>
        ${n.due_soon_enabled ? html`
          <label class="setting-row sub-row">
            <span class="setting-desc">${t("settings_interval_hours", L)}</span>
            <input type="number" min="0" max="720" .value=${String(n.due_soon_interval_hours)}
              @change=${(e: Event) => this._updateSetting("notify_due_soon_interval_hours", parseInt((e.target as HTMLInputElement).value, 10) || 0)} />
          </label>
        ` : nothing}

        <label class="setting-row">
          <span>
            <span class="setting-label">${t("settings_notify_overdue", L)}</span>
          </span>
          <input type="checkbox" .checked=${n.overdue_enabled}
            @change=${(e: Event) => this._updateSetting("notify_overdue_enabled", (e.target as HTMLInputElement).checked)} />
        </label>
        ${n.overdue_enabled ? html`
          <label class="setting-row sub-row">
            <span class="setting-desc">${t("settings_interval_hours", L)}</span>
            <input type="number" min="0" max="720" .value=${String(n.overdue_interval_hours)}
              @change=${(e: Event) => this._updateSetting("notify_overdue_interval_hours", parseInt((e.target as HTMLInputElement).value, 10) || 0)} />
          </label>
        ` : nothing}

        <label class="setting-row">
          <span>
            <span class="setting-label">${t("settings_notify_triggered", L)}</span>
          </span>
          <input type="checkbox" .checked=${n.triggered_enabled}
            @change=${(e: Event) => this._updateSetting("notify_triggered_enabled", (e.target as HTMLInputElement).checked)} />
        </label>
        ${n.triggered_enabled ? html`
          <label class="setting-row sub-row">
            <span class="setting-desc">${t("settings_interval_hours", L)}</span>
            <input type="number" min="0" max="720" .value=${String(n.triggered_interval_hours)}
              @change=${(e: Event) => this._updateSetting("notify_triggered_interval_hours", parseInt((e.target as HTMLInputElement).value, 10) || 0)} />
          </label>
        ` : nothing}

        <label class="setting-row">
          <span class="setting-label">${t("settings_quiet_hours", L)}</span>
          <input type="checkbox" .checked=${n.quiet_hours_enabled}
            @change=${(e: Event) => this._updateSetting("quiet_hours_enabled", (e.target as HTMLInputElement).checked)} />
        </label>
        ${n.quiet_hours_enabled ? html`
          <div class="setting-row sub-row">
            <span class="setting-desc">${t("settings_quiet_start", L)}</span>
            <input type="time" .value=${n.quiet_hours_start}
              @change=${(e: Event) => this._updateSetting("quiet_hours_start", (e.target as HTMLInputElement).value)} />
          </div>
          <div class="setting-row sub-row">
            <span class="setting-desc">${t("settings_quiet_end", L)}</span>
            <input type="time" .value=${n.quiet_hours_end}
              @change=${(e: Event) => this._updateSetting("quiet_hours_end", (e.target as HTMLInputElement).value)} />
          </div>
        ` : nothing}

        <label class="setting-row">
          <span class="setting-label">${t("settings_max_per_day", L)}</span>
          <input type="number" min="0" max="100" .value=${String(n.max_per_day)}
            @change=${(e: Event) => this._updateSetting("max_notifications_per_day", parseInt((e.target as HTMLInputElement).value, 10) || 0)} />
        </label>

        <label class="setting-row">
          <span class="setting-label">${t("settings_bundling", L)}</span>
          <input type="checkbox" .checked=${n.bundling_enabled}
            @change=${(e: Event) => this._updateSetting("notification_bundling_enabled", (e.target as HTMLInputElement).checked)} />
        </label>
        ${n.bundling_enabled ? html`
          <label class="setting-row sub-row">
            <span class="setting-desc">${t("settings_bundle_threshold", L)}</span>
            <input type="number" min="2" max="20" .value=${String(n.bundle_threshold)}
              @change=${(e: Event) => this._updateSetting("notification_bundle_threshold", parseInt((e.target as HTMLInputElement).value, 10) || 2)} />
          </label>
        ` : nothing}

        <h4 style="margin: 16px 0 8px; font-size: 14px;">${t("settings_actions", L)}</h4>
        <label class="setting-row">
          <span class="setting-label">${t("settings_action_complete", L)}</span>
          <input type="checkbox" .checked=${a.complete_enabled}
            @change=${(e: Event) => this._updateSetting("action_complete_enabled", (e.target as HTMLInputElement).checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${t("settings_action_skip", L)}</span>
          <input type="checkbox" .checked=${a.skip_enabled}
            @change=${(e: Event) => this._updateSetting("action_skip_enabled", (e.target as HTMLInputElement).checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${t("settings_action_snooze", L)}</span>
          <input type="checkbox" .checked=${a.snooze_enabled}
            @change=${(e: Event) => this._updateSetting("action_snooze_enabled", (e.target as HTMLInputElement).checked)} />
        </label>
        ${a.snooze_enabled ? html`
          <label class="setting-row sub-row">
            <span class="setting-desc">${t("settings_snooze_hours", L)}</span>
            <input type="number" min="1" max="168" .value=${String(a.snooze_duration_hours)}
              @change=${(e: Event) => this._updateSetting("snooze_duration_hours", parseInt((e.target as HTMLInputElement).value, 10) || 4)} />
          </label>
        ` : nothing}
      </div>
    `;
  }

  // --- Section: Budget ---

  private _renderBudget(L: string) {
    const b = this._settings!.budget;
    return html`
      <div class="settings-section">
        <h3>${t("settings_budget", L)}</h3>
        <label class="setting-row">
          <span class="setting-label">${t("settings_currency", L)}</span>
          <select @change=${(e: Event) => this._updateSetting("budget_currency", (e.target as HTMLSelectElement).value)}>
            ${CURRENCIES.map((c) => html`<option value=${c} ?selected=${b.currency === c}>${c}</option>`)}
          </select>
        </label>
        <label class="setting-row">
          <span class="setting-label">${t("settings_budget_monthly", L)}</span>
          <input type="number" min="0" step="0.01" .value=${String(b.monthly)}
            @change=${(e: Event) => this._updateSetting("budget_monthly", parseFloat((e.target as HTMLInputElement).value) || 0)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${t("settings_budget_yearly", L)}</span>
          <input type="number" min="0" step="0.01" .value=${String(b.yearly)}
            @change=${(e: Event) => this._updateSetting("budget_yearly", parseFloat((e.target as HTMLInputElement).value) || 0)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${t("settings_budget_alerts", L)}</span>
          <input type="checkbox" .checked=${b.alerts_enabled}
            @change=${(e: Event) => this._updateSetting("budget_alerts_enabled", (e.target as HTMLInputElement).checked)} />
        </label>
        ${b.alerts_enabled ? html`
          <label class="setting-row sub-row">
            <span class="setting-desc">${t("settings_budget_threshold", L)}</span>
            <input type="number" min="1" max="100" .value=${String(b.alert_threshold_pct)}
              @change=${(e: Event) => this._updateSetting("budget_alert_threshold", parseInt((e.target as HTMLInputElement).value, 10) || 80)} />
          </label>
        ` : nothing}
      </div>
    `;
  }

  // --- Section: Import/Export ---

  // --- Section: Vacation mode (v1.2.0) ---

  private _renderVacation(L: string) {
    const isStale = this._vacEnabled && !this._vacIsActive && this._vacWindowEnd
      && new Date(this._vacWindowEnd) < new Date();
    const exemptCount = this._vacExempt.size;
    return html`
      <div class="settings-section vacation-section">
        <h3>
          ${t("vacation_title", L)}
          ${this._vacIsActive
            ? html`<span class="vac-badge active">${t("vacation_active", L)}</span>`
            : nothing}
          ${isStale
            ? html`<span class="vac-badge stale">${t("vacation_ended", L)}</span>`
            : nothing}
        </h3>
        <p class="section-desc">${t("vacation_desc", L)}</p>

        <label class="vac-toggle">
          <input type="checkbox" .checked=${this._vacEnabled}
            @change=${(e: Event) => this._toggleVacationEnabled((e.target as HTMLInputElement).checked)} />
          ${t("vacation_enable", L)}
        </label>

        <div class="vac-grid">
          <label class="vac-field">
            <span class="filter-label">${t("vacation_start", L)}</span>
            <input type="date" .value=${this._vacStart}
              @change=${(e: Event) => this._setVacationDate("start", (e.target as HTMLInputElement).value)} />
          </label>
          <label class="vac-field">
            <span class="filter-label">${t("vacation_end", L)}</span>
            <input type="date" .value=${this._vacEnd}
              @change=${(e: Event) => this._setVacationDate("end", (e.target as HTMLInputElement).value)} />
          </label>
          <label class="vac-field">
            <span class="filter-label">${t("vacation_buffer", L)}</span>
            <input type="number" min="0" max="14" .value=${String(this._vacBuffer)}
              @change=${(e: Event) => this._setVacationBuffer(parseInt((e.target as HTMLInputElement).value, 10) || 0)} />
          </label>
        </div>

        <details class="vac-exempt-panel">
          <summary>
            ${t("vacation_exempt_title", L)}
            ${exemptCount > 0 ? html`<span class="section-badge">${exemptCount}</span>` : nothing}
          </summary>
          <p class="section-desc">${t("vacation_exempt_desc", L)}</p>
          ${this._vacAllTasks.length === 0
            ? html`<button @click=${this._loadAllTasksForVacation}>${t("vacation_load_tasks", L)}</button>`
            : html`
              <div class="vac-task-list">
                ${this._renderVacationTaskList(L)}
              </div>
            `}
        </details>

        ${this._vacStart && this._vacEnd ? html`
          <div class="vac-preview-toolbar">
            <button @click=${this._loadVacationPreview} ?disabled=${this._vacPreviewLoading}>
              ${this._vacPreviewLoading ? "…" : t("vacation_preview_btn", L)}
            </button>
            ${this._vacPreview.length > 0
              ? html`<span class="vac-preview-count">${this._vacPreview.length} ${t("vacation_preview_affected", L)}</span>`
              : nothing}
          </div>
          ${this._vacPreview.length > 0 ? this._renderVacationPreview(L) : nothing}
        ` : nothing}

        ${this._vacIsActive || isStale
          ? html`<button class="vac-end-now" @click=${this._endVacationNow}>
              ${t("vacation_end_now", L)}
            </button>`
          : nothing}
      </div>
    `;
  }

  private _renderVacationTaskList(L: string) {
    // Group by object_name; within each object sort by task_name (alphabetical, #40-style)
    const byObj = new Map<string, typeof this._vacAllTasks>();
    for (const t of this._vacAllTasks) {
      const arr = byObj.get(t.object_name) || [];
      arr.push(t);
      byObj.set(t.object_name, arr);
    }
    const sortedObjs = [...byObj.entries()]
      .sort(([a], [b]) => a.localeCompare(b));

    return sortedObjs.map(([objName, tasks]) => html`
      <div class="vac-task-group">
        <div class="vac-task-group-name">${objName || t("no_objects", L)}</div>
        ${tasks
          .sort((a, b) => a.task_name.localeCompare(b.task_name))
          .map((task) => html`
            <label class="vac-task-row">
              <input type="checkbox"
                .checked=${this._vacExempt.has(task.task_id)}
                @change=${(e: Event) => this._toggleVacationExempt(task.task_id, (e.target as HTMLInputElement).checked)} />
              <span>${task.task_name}</span>
            </label>
          `)}
      </div>
    `);
  }

  private _renderVacationPreview(L: string) {
    return html`
      <div class="vac-preview-list">
        ${this._vacPreview.map((row) => {
          const eventLabel = row.events.map((e) => {
            const statusKey = `vacation_event_${e.status}`;
            return `${e.date} (${t(statusKey, L)})`;
          }).join(" · ");
          const isExempt = !row.will_suppress;
          return html`
            <div class="vac-preview-row ${isExempt ? "exempt" : ""}">
              <div class="vac-preview-info">
                <div class="vac-preview-name">
                  <strong>${row.object_name}</strong> · ${row.task_name}
                  ${row.kind === "sensor_based"
                    ? html`<span class="vac-preview-kind">${t("vacation_sensor_based", L)}</span>`
                    : nothing}
                </div>
                <div class="vac-preview-events">${eventLabel}</div>
              </div>
              <div class="vac-preview-actions">
                <button @click=${() => this._previewActionComplete(row)}>${t("qr_action_complete", L)}</button>
                ${row.kind === "time_based"
                  ? html`<button @click=${() => this._previewActionSkip(row)}>${t("qr_action_skip", L)}</button>`
                  : nothing}
                <button class=${isExempt ? "vac-notify-on" : ""}
                  @click=${() => this._toggleVacationExempt(row.task_id, !isExempt)}>
                  ${isExempt ? t("vacation_action_unsilence", L) : t("vacation_action_notify", L)}
                </button>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  // --- Vacation actions ---

  private async _loadAllTasksForVacation(): Promise<void> {
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/objects",
      }) as { objects: Array<{
        entry_id: string;
        object: { name: string };
        tasks: Array<{ id: string; name: string }>;
      }> };
      const flat: typeof this._vacAllTasks = [];
      for (const obj of result.objects || []) {
        for (const t of obj.tasks || []) {
          flat.push({
            entry_id: obj.entry_id,
            object_name: obj.object.name || "",
            task_id: t.id,
            task_name: t.name || "",
          });
        }
      }
      this._vacAllTasks = flat;
    } catch {
      this._showToast(t("action_error", this._lang));
    }
  }

  private async _saveVacation(patch: Record<string, unknown>): Promise<void> {
    if (this._vacSaving) return;
    this._vacSaving = true;
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/vacation/update",
        ...patch,
      }) as SettingsResponse["vacation"];
      // Server is the source of truth — re-hydrate from response.
      this._vacEnabled = result.enabled;
      this._vacStart = result.start || "";
      this._vacEnd = result.end || "";
      this._vacBuffer = result.buffer_days;
      this._vacExempt = new Set(result.exempt_task_ids || []);
      this._vacIsActive = result.is_active;
      this._vacWindowEnd = result.window_end;
      // Notify the panel (so the Vacation tab can appear/disappear)
      this.dispatchEvent(new CustomEvent("settings-changed"));
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message || t("action_error", this._lang);
      this._showToast(msg);
    } finally {
      this._vacSaving = false;
    }
  }

  private _toggleVacationEnabled(on: boolean): void {
    this._saveVacation({ enabled: on });
  }

  private _setVacationDate(which: "start" | "end", value: string): void {
    const patch: Record<string, unknown> = {};
    patch[which] = value || null;
    this._saveVacation(patch);
  }

  private _setVacationBuffer(value: number): void {
    if (value < 0 || value > 14) return;
    this._saveVacation({ buffer_days: value });
  }

  private _toggleVacationExempt(taskId: string, on: boolean): void {
    const next = new Set(this._vacExempt);
    if (on) next.add(taskId); else next.delete(taskId);
    this._saveVacation({ exempt_task_ids: [...next] });
  }

  private async _loadVacationPreview(): Promise<void> {
    this._vacPreviewLoading = true;
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/vacation/preview",
      }) as { rows: VacationPreviewRow[] };
      this._vacPreview = result.rows || [];
    } catch {
      this._showToast(t("action_error", this._lang));
    } finally {
      this._vacPreviewLoading = false;
    }
  }

  private async _previewActionComplete(row: VacationPreviewRow): Promise<void> {
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/task/complete",
        entry_id: row.entry_id,
        task_id: row.task_id,
      });
      this._showToast(t("vacation_marked_complete", this._lang));
      await this._loadVacationPreview();
    } catch {
      this._showToast(t("action_error", this._lang));
    }
  }

  private async _previewActionSkip(row: VacationPreviewRow): Promise<void> {
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/task/skip",
        entry_id: row.entry_id,
        task_id: row.task_id,
        reason: "Skipped before vacation",
      });
      this._showToast(t("vacation_marked_skip", this._lang));
      await this._loadVacationPreview();
    } catch {
      this._showToast(t("action_error", this._lang));
    }
  }

  private async _endVacationNow(): Promise<void> {
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/vacation/end_now",
      }) as SettingsResponse["vacation"];
      this._vacEnabled = result.enabled;
      this._vacEnd = result.end || "";
      this._vacIsActive = result.is_active;
      this._vacWindowEnd = result.window_end;
      this.dispatchEvent(new CustomEvent("settings-changed"));
      this._showToast(t("vacation_ended", this._lang));
    } catch {
      this._showToast(t("action_error", this._lang));
    }
  }

  // --- Section: Print QR codes (v1.1.0) ---

  private _renderPrintQr(L: string) {
    const selectedCount = this._qrSelectedEntries.size || this._qrObjects.length;
    const actionCount = this._qrActions.size;
    const estimatedQrs = selectedCount * actionCount;
    const overLimit = estimatedQrs > 200;

    return html`
      <div class="settings-section qr-print-section">
        <h3>${t("qr_print_title", L)}</h3>
        <p class="section-desc">${t("qr_print_desc", L)}</p>

        ${!this._qrObjectsLoaded
          ? html`<button @click=${this._loadQrObjects}>${t("qr_print_load", L)}</button>`
          : html`
            <details open class="qr-filter-panel">
              <summary>${t("qr_print_filter", L)}</summary>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${t("qr_print_objects", L)}</div>
                <div class="qr-object-list">
                  ${this._qrObjects.length === 0
                    ? html`<div class="hint">${t("no_objects", L)}</div>`
                    : this._qrObjects.map((obj) => html`
                      <label class="qr-object-row">
                        <input type="checkbox"
                          .checked=${this._qrSelectedEntries.size === 0 || this._qrSelectedEntries.has(obj.entry_id)}
                          @change=${(e: Event) => this._toggleQrObject(obj.entry_id, (e.target as HTMLInputElement).checked)} />
                        <span>${obj.name}</span>
                        <span class="qr-task-count">${obj.task_count}</span>
                      </label>
                    `)}
                </div>
              </div>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${t("qr_print_actions", L)}</div>
                <div class="qr-action-chips">
                  ${["view", "complete", "skip"].map((a) => html`
                    <label class="qr-action-chip ${this._qrActions.has(a) ? "active" : ""}">
                      <input type="checkbox"
                        .checked=${this._qrActions.has(a)}
                        @change=${(e: Event) => this._toggleQrAction(a, (e.target as HTMLInputElement).checked)} />
                      ${t("qr_action_" + a, L)}
                    </label>
                  `)}
                </div>
              </div>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${t("qr_print_url_mode", L)}</div>
                <select .value=${this._qrUrlMode}
                  @change=${(e: Event) => { this._qrUrlMode = (e.target as HTMLSelectElement).value as typeof this._qrUrlMode; }}>
                  <option value="companion">${t("qr_mode_companion", L)}</option>
                  <option value="local">${t("qr_mode_local", L)}</option>
                  <option value="server">${t("qr_mode_server", L)}</option>
                </select>
              </div>

              <div class="qr-filter-group qr-filter-actions">
                <div class="qr-estimate ${overLimit ? "error" : ""}">
                  ${t("qr_print_estimate", L)}: <strong>${estimatedQrs}</strong>
                  ${overLimit ? html` — ${t("qr_print_over_limit", L)}` : nothing}
                </div>
                <button
                  ?disabled=${this._qrBatchLoading || overLimit || actionCount === 0}
                  @click=${this._generateBatch}>
                  ${this._qrBatchLoading ? t("qr_print_generating", L) : t("qr_print_generate", L)}
                </button>
              </div>
            </details>

            ${this._qrBatchResults.length > 0
              ? html`
                <div class="qr-results-toolbar">
                  <span>${this._qrBatchResults.length} ${t("qr_print_ready", L)}</span>
                  <button @click=${this._printQrs}>${t("qr_print_print_button", L)}</button>
                </div>
                <div class="qr-print-grid">
                  ${this._qrBatchResults.map((q) => html`
                    <div class="qr-print-cell">
                      <div class="qr-svg">${unsafeHTML(q.svg)}</div>
                      <div class="qr-label">
                        <div class="qr-label-obj">${q.object_name}</div>
                        <div class="qr-label-task">${q.task_name}</div>
                        <div class="qr-label-action">${t("qr_action_" + q.action, L)}</div>
                      </div>
                    </div>
                  `)}
                </div>
              `
              : nothing}
          `}
      </div>
    `;
  }

  private async _loadQrObjects(): Promise<void> {
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/objects",
      }) as { objects: Array<{ entry_id: string; object: { name: string }; tasks: unknown[] }> };
      this._qrObjects = (result.objects || []).map((o) => ({
        entry_id: o.entry_id,
        name: o.object.name,
        task_count: (o.tasks || []).length,
      })).sort((a, b) => a.name.localeCompare(b.name));
      this._qrObjectsLoaded = true;
    } catch {
      this._showToast(t("action_error", this._lang));
    }
  }

  private _toggleQrObject(entryId: string, on: boolean): void {
    const next = new Set(this._qrSelectedEntries);
    // First toggle off "all implicit" by materialising the current all-selected state
    if (next.size === 0) {
      for (const o of this._qrObjects) next.add(o.entry_id);
    }
    if (on) next.add(entryId); else next.delete(entryId);
    // If user re-selects everything, collapse back to "empty = all"
    if (next.size === this._qrObjects.length) next.clear();
    this._qrSelectedEntries = next;
  }

  private _toggleQrAction(action: string, on: boolean): void {
    const next = new Set(this._qrActions);
    if (on) next.add(action); else next.delete(action);
    this._qrActions = next;
  }

  private async _generateBatch(): Promise<void> {
    this._qrBatchLoading = true;
    this._qrBatchResults = [];
    try {
      const msg: Record<string, unknown> = {
        type: "maintenance_supporter/qr/batch_generate",
        actions: [...this._qrActions],
        url_mode: this._qrUrlMode,
      };
      if (this._qrSelectedEntries.size > 0) {
        msg.entry_ids = [...this._qrSelectedEntries];
      }
      const result = await this.hass.connection.sendMessagePromise(msg) as {
        qrs: typeof this._qrBatchResults;
      };
      this._qrBatchResults = result.qrs || [];
      if (this._qrBatchResults.length === 0) {
        this._showToast(t("qr_print_empty", this._lang));
      }
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message || t("action_error", this._lang);
      this._showToast(msg);
    } finally {
      this._qrBatchLoading = false;
    }
  }

  private _printQrs(): void {
    // Ask the browser to open the print dialog. The @media print stylesheet
    // takes care of hiding the rest of the UI.
    window.print();
  }

  private _renderImportExport(L: string) {
    return html`
      <div class="settings-section">
        <h3>${t("settings_import_export", L)}</h3>
        <div class="settings-actions">
          <label class="export-history-toggle">
            <input type="checkbox" .checked=${this._includeHistory}
              @change=${(e: Event) => { this._includeHistory = (e.target as HTMLInputElement).checked; }} />
            ${t("settings_include_history", L)}
          </label>
        </div>
        <div class="settings-actions">
          <button @click=${this._exportJson}>${t("settings_export_json", L)}</button>
          <button @click=${this._exportCsv}>${t("settings_export_csv", L)}</button>
        </div>
        <div class="import-section">
          <textarea class="import-area" .value=${this._importCsv}
            placeholder=${t("settings_import_placeholder", L)}
            @input=${(e: Event) => { this._importCsv = (e.target as HTMLTextAreaElement).value; }}
          ></textarea>
          <div class="settings-actions">
            <button ?disabled=${!this._importCsv.trim() || this._importLoading}
              @click=${this._importCsvAction}>
              ${this._importLoading ? "…" : t("settings_import_btn", L)}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // --- Export / Import actions ---

  private async _exportJson(): Promise<void> {
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/export",
        format: "json",
        include_history: this._includeHistory,
      }) as { data: string };
      const ts = new Date().toISOString().slice(0, 10);
      this._downloadFile(result.data, `maintenance_export_${ts}.json`, "application/json");
      this._showToast(t("settings_export_success", this._lang));
    } catch {
      this._showToast(t("action_error", this._lang));
    }
  }

  private async _exportCsv(): Promise<void> {
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/csv/export",
      }) as { csv: string };
      const ts = new Date().toISOString().slice(0, 10);
      this._downloadFile(result.csv, `maintenance_export_${ts}.csv`, "text/csv");
      this._showToast(t("settings_export_success", this._lang));
    } catch {
      this._showToast(t("action_error", this._lang));
    }
  }

  private async _importCsvAction(): Promise<void> {
    const content = this._importCsv.trim();
    if (!content) return;
    this._importLoading = true;
    try {
      const isJson = content.startsWith("{") || content.startsWith("[");
      const result = await this.hass.connection.sendMessagePromise(
        isJson
          ? { type: "maintenance_supporter/json/import", json_content: content }
          : { type: "maintenance_supporter/csv/import", csv_content: content }
      ) as { created: number };
      const count = result.created ?? 0;
      this._showToast(t("settings_import_success", this._lang).replace("{count}", String(count)));
      this._importCsv = "";
      this.dispatchEvent(new CustomEvent("settings-changed"));
    } catch {
      this._showToast(t("action_error", this._lang));
    }
    this._importLoading = false;
  }

  // --- Styles ---

  static styles = css`
    :host { display: block; }

    .settings-loading {
      text-align: center;
      padding: 32px;
      color: var(--secondary-text-color);
    }

    .settings-section {
      margin-bottom: 24px;
      padding: 16px;
      background: var(--card-background-color, #fff);
      border-radius: 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
    }
    .settings-section h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
    }
    .section-desc {
      font-size: 13px;
      color: var(--secondary-text-color);
      margin: 0 0 16px 0;
    }

    .setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      cursor: pointer;
      gap: 12px;
    }
    .setting-row:last-child { border-bottom: none; }
    .setting-row.sub-row {
      padding-left: 16px;
    }

    .setting-label { font-size: 14px; display: block; }
    .setting-desc { font-size: 12px; color: var(--secondary-text-color); display: block; }

    .setting-row input[type="checkbox"] {
      width: 18px; height: 18px; flex-shrink: 0;
    }
    .setting-row input[type="number"],
    .setting-row input[type="text"],
    .setting-row input[type="time"] {
      width: 120px;
      padding: 6px 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
      flex-shrink: 0;
    }
    .setting-row input[type="number"] {
      text-align: right;
    }
    .setting-row select {
      padding: 6px 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
      flex-shrink: 0;
    }

    .settings-actions {
      display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px;
    }
    .settings-actions button {
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 14px;
    }
    .settings-actions button:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .settings-actions button[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .export-history-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      cursor: pointer;
    }
    .export-history-toggle input { width: 16px; height: 16px; }

    .import-section { margin-top: 16px; }

    .import-area {
      width: 100%;
      min-height: 120px;
      padding: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      resize: vertical;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      box-sizing: border-box;
    }

    .settings-toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-color, #03a9f4);
      color: #fff;
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,.3);
      animation: toast-in .3s ease;
    }
    @keyframes toast-in {
      from { opacity: 0; transform: translateX(-50%) translateY(16px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    /* ─── Vacation mode section (v1.2.0) ─── */

    .vacation-section h3 {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .vac-badge {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 10px;
    }
    .vac-badge.active {
      background: var(--success-color, #4caf50);
      color: #fff;
    }
    .vac-badge.stale {
      background: var(--warning-color, #ff9800);
      color: #fff;
    }
    .vac-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      margin: 8px 0 12px;
    }
    .vac-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 12px;
      margin-bottom: 12px;
    }
    .vac-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .vac-field input {
      padding: 6px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .vac-exempt-panel {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 10px;
      margin: 12px 0;
    }
    .vac-exempt-panel summary {
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-badge {
      background: var(--primary-color, #03a9f4);
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      padding: 1px 8px;
      border-radius: 10px;
    }
    .vac-task-list {
      max-height: 280px;
      overflow-y: auto;
      margin-top: 8px;
    }
    .vac-task-group {
      margin: 8px 0;
    }
    .vac-task-group-name {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--secondary-text-color);
      padding: 4px 0;
    }
    .vac-task-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      cursor: pointer;
      border-radius: 4px;
    }
    .vac-task-row:hover { background: var(--secondary-background-color, rgba(127,127,127,0.1)); }
    .vac-preview-toolbar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 12px 0 8px;
    }
    .vac-preview-count {
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .vac-preview-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .vac-preview-row {
      display: flex;
      gap: 12px;
      padding: 10px 12px;
      background: var(--secondary-background-color, rgba(127,127,127,0.08));
      border-radius: 6px;
      border-left: 3px solid var(--warning-color, #ff9800);
    }
    .vac-preview-row.exempt {
      border-left-color: var(--success-color, #4caf50);
    }
    .vac-preview-info { flex: 1; }
    .vac-preview-name { font-size: 14px; }
    .vac-preview-kind {
      font-size: 11px;
      color: var(--secondary-text-color);
      margin-left: 6px;
    }
    .vac-preview-events {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }
    .vac-preview-actions {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }
    .vac-preview-actions button {
      font-size: 12px;
      padding: 4px 10px;
    }
    .vac-notify-on { background: var(--success-color, #4caf50) !important; color: #fff; }
    .vac-end-now {
      margin-top: 12px;
      background: var(--error-color, #f44336);
      color: #fff;
    }

    /* ─── Print QR codes section (v1.1.0) ─── */

    .qr-filter-panel {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 12px;
      margin-top: 8px;
    }
    .qr-filter-panel > summary {
      cursor: pointer;
      font-weight: 500;
    }
    .qr-filter-group {
      margin-top: 12px;
    }
    .qr-filter-label {
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--secondary-text-color);
      margin-bottom: 4px;
    }
    .qr-object-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 4px 12px;
      max-height: 240px;
      overflow-y: auto;
    }
    .qr-object-row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 6px;
      cursor: pointer;
      border-radius: 4px;
    }
    .qr-object-row:hover { background: var(--secondary-background-color, rgba(127,127,127,0.1)); }
    .qr-object-row > span:nth-of-type(1) { flex: 1; }
    .qr-task-count {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-variant-numeric: tabular-nums;
    }

    .qr-action-chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .qr-action-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 14px;
      border: 1px solid var(--divider-color);
      cursor: pointer;
      user-select: none;
    }
    .qr-action-chip.active {
      background: var(--primary-color, #03a9f4);
      color: #fff;
      border-color: transparent;
    }
    .qr-action-chip input { accent-color: currentColor; }

    .qr-filter-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .qr-estimate { font-size: 13px; }
    .qr-estimate.error { color: var(--error-color, #f44336); }

    .qr-results-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      padding: 8px 12px;
      background: var(--secondary-background-color, rgba(127,127,127,0.1));
      border-radius: 6px;
    }

    .qr-print-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    .qr-print-cell {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      background: #fff;
      color: #000;
    }
    .qr-print-cell .qr-svg {
      width: 100%;
      max-width: 160px;
    }
    .qr-print-cell .qr-svg svg { width: 100%; height: auto; display: block; }
    .qr-label {
      margin-top: 6px;
      font-size: 11px;
      line-height: 1.3;
    }
    .qr-label-obj { font-weight: 600; }
    .qr-label-task { color: #444; }
    .qr-label-action {
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 10px;
      color: #777;
    }

    /* ─── Print stylesheet ─── */
    @media print {
      /* Strip everything except the QR grid itself */
      :host { color: #000; background: #fff; }
      .qr-print-section h3,
      .qr-print-section .section-desc,
      .qr-filter-panel,
      .qr-results-toolbar,
      .settings-section:not(.qr-print-section),
      .settings-toast {
        display: none !important;
      }
      .qr-print-section { padding: 0; margin: 0; }
      .qr-print-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 12mm 8mm;
        margin: 0;
      }
      .qr-print-cell {
        border: none;
        padding: 0;
        page-break-inside: avoid;
      }
      .qr-print-cell .qr-svg { max-width: 48mm; }
      .qr-label { font-size: 9pt; }
    }
  `;
}

customElements.define("maintenance-settings-view", MaintenanceSettingsView);
