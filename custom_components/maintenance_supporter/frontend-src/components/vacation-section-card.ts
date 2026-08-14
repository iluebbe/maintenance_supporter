/** v2.4.0 — Interactive Vacation Section Card.
 *
 *  Replaces the read-only markdown card from Phase 5. Lets the user toggle
 *  vacation mode + edit start/end/buffer inline, without leaving Lovelace.
 *
 *  Used as a section-strategy card (HA 2026.5+ sections) AND as a stand-alone
 *  card the user can drop onto any dashboard.
 *
 *  Permissions: only admins see edit affordances; non-admins get a read-only
 *  view with a deep-link to the panel (vacation config is admin-only at the
 *  WS layer too).
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t, ensureLocale, langOf } from "../styles";
import { describeWsError } from "../ws-errors";
import { sectionCardSharedStyles } from "./section-card-shared-styles";
import type { HomeAssistant } from "../types";

interface VacationState {
  enabled?: boolean;
  is_active?: boolean;
  start?: string | null;
  end?: string | null;
  buffer_days?: number;
  window_end?: string | null;
  exempt_task_ids?: string[];
}

interface CardConfig {
  type: string;
  title?: string;
}

export class MaintenanceVacationSectionCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config: CardConfig = { type: "" };
  @state() private _state: VacationState | null = null;
  @state() private _busy = false;
  @state() private _error = "";
  @state() private _localStart = "";
  @state() private _localEnd = "";
  @state() private _localBuffer = 7;
  @state() private _dirty = false;

  private _loaded = false;

  setConfig(config: CardConfig): void {
    this._config = config;
  }

  getCardSize(): number {
    return 2;
  }

  private get _lang(): string {
    return langOf(this.hass);
  }

  private get _isAdmin(): boolean {
    return (this.hass?.user?.is_admin ?? true) as boolean;
  }

  updated(changedProps: Map<string, unknown>): void {
    super.updated(changedProps);
    if (changedProps.has("hass") && this.hass && !this._loaded) {
      this._loaded = true;
      void this._load();
      void ensureLocale(this._lang).then(() => this.requestUpdate());
    }
  }

  private async _load(): Promise<void> {
    try {
      const r = await this.hass.connection.sendMessagePromise<VacationState>({
        type: "maintenance_supporter/vacation/state",
      });
      this._state = r;
      this._localStart = r.start || "";
      this._localEnd = r.end || "";
      this._localBuffer = r.buffer_days ?? 7;
      this._dirty = false;
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    }
  }

  private async _toggleEnabled(on: boolean): Promise<void> {
    this._busy = true;
    this._error = "";
    try {
      const r = await this.hass.connection.sendMessagePromise<VacationState>({
        type: "maintenance_supporter/vacation/update",
        enabled: on,
      });
      this._state = r;
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._busy = false;
    }
  }

  private async _save(): Promise<void> {
    if (!this._isAdmin) return;
    this._busy = true;
    this._error = "";
    try {
      const r = await this.hass.connection.sendMessagePromise<VacationState>({
        type: "maintenance_supporter/vacation/update",
        start: this._localStart || null,
        end: this._localEnd || null,
        buffer_days: this._localBuffer,
      });
      this._state = r;
      this._dirty = false;
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._busy = false;
    }
  }

  private async _endNow(): Promise<void> {
    if (!this._isAdmin) return;
    if (!window.confirm(t("vacation_end_now_confirm", this._lang)
        || "End vacation immediately?")) return;
    this._busy = true;
    try {
      const r = await this.hass.connection.sendMessagePromise<VacationState>({
        type: "maintenance_supporter/vacation/end_now",
      });
      this._state = r;
      this._localStart = r.start || "";
      this._localEnd = r.end || "";
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._busy = false;
    }
  }

  private _onDeepLink(): void {
    const path = "/maintenance-supporter?ms_action=open_vacation";
    history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed"));
  }

  render() {
    const L = this._lang;
    const s = this._state;
    if (!s) {
      return html`<ha-card><div class="loading">${t("loading", L) || "Loading…"}</div></ha-card>`;
    }
    const active = s.is_active === true;
    const enabled = s.enabled === true;
    const exemptCount = s.exempt_task_ids?.length ?? 0;
    const statusLabel = active
      ? (t("vacation_status_active", L) || "Active now")
      : enabled
        ? (t("vacation_status_scheduled", L) || "Scheduled")
        : (t("vacation_status_inactive", L) || "Inactive");
    const statusClass = active ? "active" : enabled ? "scheduled" : "inactive";

    return html`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">
              <span class="emoji">🏖️</span>
              <span>${this._config.title || (t("vacation_mode", L) || "Vacation mode")}</span>
            </div>
            <span class="status-pill ${statusClass}">${statusLabel}</span>
          </div>

          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}

          ${this._isAdmin
            ? html`
                <div class="row toggle-row">
                  <label>${t("enable", L) || "Enable"}</label>
                  <ha-switch
                    .checked=${enabled}
                    .disabled=${this._busy}
                    @change=${(e: Event) =>
                      this._toggleEnabled((e.target as HTMLInputElement).checked)}
                  ></ha-switch>
                </div>

                <div class="dates-row">
                  <div class="date-field">
                    <label>${t("vacation_start", L) || "Start"}</label>
                    <input type="date" .value=${this._localStart}
                      ?disabled=${this._busy}
                      @input=${(e: Event) => {
                        this._localStart = (e.target as HTMLInputElement).value;
                        this._dirty = true;
                      }} />
                  </div>
                  <div class="date-field">
                    <label>${t("vacation_end", L) || "End"}</label>
                    <input type="date" .value=${this._localEnd}
                      ?disabled=${this._busy}
                      @input=${(e: Event) => {
                        this._localEnd = (e.target as HTMLInputElement).value;
                        this._dirty = true;
                      }} />
                  </div>
                  <div class="date-field buffer">
                    <label>${t("vacation_buffer", L) || "Buffer days"}</label>
                    <input type="number" min="0" max="14"
                      .value=${String(this._localBuffer)}
                      ?disabled=${this._busy}
                      @input=${(e: Event) => {
                        this._localBuffer = parseInt(
                          (e.target as HTMLInputElement).value, 10) || 0;
                        this._dirty = true;
                      }} />
                  </div>
                </div>

                <div class="actions">
                  <button class="btn ${this._dirty ? "primary" : "muted"}"
                    @click=${this._save}
                    ?disabled=${this._busy || !this._dirty}>
                    <ha-icon icon="${this._dirty ? "mdi:content-save" : "mdi:check"}"></ha-icon>
                    ${this._dirty
                      ? (t("save", L) || "Save")
                      : (t("saved", L) || "Saved")}
                  </button>
                  ${active
                    ? html`<button class="btn"
                        @click=${this._endNow}
                        ?disabled=${this._busy}>
                        ${t("vacation_end_now", L) || "End now"}
                      </button>`
                    : nothing}
                  ${exemptCount > 0
                    ? html`<button class="btn link"
                        @click=${this._onDeepLink}>
                        ${exemptCount} ${t("vacation_exempt_count", L) || "exempt"}…
                      </button>`
                    : html`<button class="btn link"
                        @click=${this._onDeepLink}>
                        ${t("vacation_advanced", L) || "Advanced…"}
                      </button>`}
                </div>
              `
            : html`
                <div class="readonly">
                  ${enabled && s.start && s.end
                    ? html`<div>${s.start} → ${s.end}</div>`
                    : nothing}
                  <button class="btn link" @click=${this._onDeepLink}>
                    ${t("vacation_open_panel", L) || "Open in panel"}
                  </button>
                </div>
              `}
        </div>
      </ha-card>
    `;
  }

  static styles = [sectionCardSharedStyles, css`
    .status-pill {
      font-size: 11px; font-weight: 600;
      padding: 3px 8px; border-radius: 999px;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .status-pill.active {
      background: rgba(76, 175, 80, 0.15);
      color: #4caf50;
    }
    .status-pill.scheduled {
      background: rgba(255, 152, 0, 0.15);
      color: #ff9800;
    }
    .status-pill.inactive {
      background: rgba(158, 158, 158, 0.15);
      color: var(--secondary-text-color);
    }
    .row.toggle-row {
      display: flex; align-items: center; justify-content: space-between;
    }
    .row.toggle-row label {
      font-size: 14px; color: var(--primary-text-color);
    }
    .dates-row {
      display: grid; grid-template-columns: 1fr 1fr 100px; gap: 10px;
    }
    .date-field.buffer label { white-space: nowrap; }
    .date-field { display: flex; flex-direction: column; gap: 4px; }
    .date-field label {
      font-size: 11px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.3px;
    }
    .date-field input {
      padding: 6px 8px; font-size: 13px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color); border-radius: 6px;
      font-family: inherit;
    }
    .date-field input:disabled { opacity: 0.5; cursor: not-allowed; }
    .actions {
      display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
    }
    .readonly { display: flex; flex-direction: column; gap: 8px; }
  `];
}

if (!customElements.get("maintenance-vacation-section-card")) {
  customElements.define(
    "maintenance-vacation-section-card",
    MaintenanceVacationSectionCard,
  );
}

(window as { customCards?: unknown[] }).customCards =
  (window as { customCards?: unknown[] }).customCards || [];
((window as { customCards?: unknown[] }).customCards!).push({
  type: "maintenance-vacation-section-card",
  name: "Maintenance Supporter — Vacation",
  description: "Inline vacation mode toggle + dates",
  preview: false,
});
