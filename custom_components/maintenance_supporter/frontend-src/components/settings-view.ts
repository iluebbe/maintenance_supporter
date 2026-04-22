/** Settings view component for the Maintenance Supporter panel. */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
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
    } catch {
      /* ignore */
    }
    this._loading = false;
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
  `;
}

customElements.define("maintenance-settings-view", MaintenanceSettingsView);
