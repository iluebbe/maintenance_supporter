/** v2.4.0 — Interactive Budget Section Card.
 *
 *  Replaces the read-only markdown budget card. Lets the admin set
 *  monthly_budget / yearly_budget inline. Read-only progress bars for
 *  current spending. Uses ``maintenance_supporter/global/update`` with
 *  the budget_monthly / budget_yearly settings keys.
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t, ensureLocale, DEFAULT_CURRENCY_SYMBOL, langOf } from "../styles";
import { registerCustomCard } from "../helpers/register-card";
import { describeWsError } from "../ws-errors";
import { sectionCardSharedStyles } from "./section-card-shared-styles";
import type { BudgetStatus, HomeAssistant } from "../types";

interface CardConfig { type: string; title?: string; }

/** Backend default for budget_alert_threshold (const.py / settings_registry).
 *  Only reached if an older core omits the field from budget_status. */
const DEFAULT_ALERT_THRESHOLD_PCT = 80;

export class MaintenanceBudgetSectionCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config: CardConfig = { type: "" };
  @state() private _status: BudgetStatus | null = null;
  @state() private _busy = false;
  @state() private _error = "";
  @state() private _localMonthly = "";
  @state() private _localYearly = "";
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
      const r = await this.hass.connection.sendMessagePromise<BudgetStatus>({
        type: "maintenance_supporter/budget_status",
      });
      this._status = r;
      this._localMonthly = r.monthly_budget ? String(r.monthly_budget) : "";
      this._localYearly = r.yearly_budget ? String(r.yearly_budget) : "";
      this._dirty = false;
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    }
  }

  private async _save(): Promise<void> {
    if (!this._isAdmin) return;
    this._busy = true;
    this._error = "";
    try {
      // An emptied field means "remove this budget" and must SEND 0 (the
      // backend's off-state) — omitting the key kept the old value, so a
      // budget could never be cleared from this card (bug audit 2026-08-22).
      const m = this._localMonthly.trim() === "" ? 0 : parseFloat(this._localMonthly);
      const y = this._localYearly.trim() === "" ? 0 : parseFloat(this._localYearly);
      const settings: Record<string, number> = {};
      if (!isNaN(m) && m >= 0) settings.budget_monthly = m;
      if (!isNaN(y) && y >= 0) settings.budget_yearly = y;
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/global/update",
        settings,
      });
      await this._load();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._busy = false;
    }
  }

  private _onDeepLink(): void {
    const path = "/maintenance-supporter?ms_action=open_budget";
    history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed"));
  }

  render() {
    const L = this._lang;
    const s = this._status;
    if (!s) {
      return html`<ha-card><div class="loading">${t("loading", L) || "Loading…"}</div></ha-card>`;
    }
    const sym = s.currency_symbol || DEFAULT_CURRENCY_SYMBOL;
    // The amber step is the CONFIGURED budget_alert_threshold, not a literal 80
    // — same rule the panel's budget bar uses (maintenance-panel._renderBudgetBar).
    const threshold = s.alert_threshold_pct ?? DEFAULT_ALERT_THRESHOLD_PCT;
    const tracks = [
      {
        label: t("budget_monthly", L) || "Monthly",
        spent: s.monthly_spent || 0,
        budget: s.monthly_budget || 0,
      },
      {
        label: t("budget_yearly", L) || "Yearly",
        spent: s.yearly_spent || 0,
        budget: s.yearly_budget || 0,
      },
    ];

    return html`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">
              <span class="emoji">💰</span>
              <span>${this._config.title || t("settings_budget", L) || "Budget"}</span>
            </div>
            <span class="currency">${sym}</span>
          </div>

          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}

          ${tracks.map((track) => {
            // #104: budget tracking without a maximum — a bar needs a
            // denominator, so show the plain spent total instead of "9 / 0 €"
            // over an always-empty bar. Mirrors the panel's spent-only lines.
            if (!(track.budget > 0)) {
              return html`
                <div class="track spent-only">
                  <div class="track-label-row">
                    <label>${track.label}</label>
                    <span class="track-numbers ok">${track.spent.toFixed(0)} ${sym}</span>
                  </div>
                </div>
              `;
            }
            const pct = Math.min(100, Math.max(0, (track.spent / track.budget) * 100));
            const warn = pct >= 100 ? "danger" : pct >= threshold ? "warning" : "ok";
            return html`
              <div class="track">
                <div class="track-label-row">
                  <label>${track.label}</label>
                  <span class="track-numbers ${warn}">
                    ${track.spent.toFixed(0)} / ${track.budget.toFixed(0)} ${sym}
                  </span>
                </div>
                <div class="bar"><div class="bar-fill ${warn}" style="width:${pct}%"></div></div>
              </div>
            `;
          })}

          ${this._isAdmin
            ? html`
                <div class="inputs-row">
                  <div class="input-field">
                    <label>${t("budget_monthly_set", L) || "Set monthly"}</label>
                    <div class="input-wrap">
                      <input type="number" min="0" step="1"
                        .value=${this._localMonthly}
                        ?disabled=${this._busy}
                        @input=${(e: Event) => {
                          this._localMonthly = (e.target as HTMLInputElement).value;
                          this._dirty = true;
                        }} />
                      <span class="input-suffix">${sym}</span>
                    </div>
                  </div>
                  <div class="input-field">
                    <label>${t("budget_yearly_set", L) || "Set yearly"}</label>
                    <div class="input-wrap">
                      <input type="number" min="0" step="1"
                        .value=${this._localYearly}
                        ?disabled=${this._busy}
                        @input=${(e: Event) => {
                          this._localYearly = (e.target as HTMLInputElement).value;
                          this._dirty = true;
                        }} />
                      <span class="input-suffix">${sym}</span>
                    </div>
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
                  <button class="btn link" @click=${this._onDeepLink}>
                    ${t("budget_advanced", L) || "Currency, alerts…"}
                  </button>
                </div>
              `
            : html`
                <button class="btn link" @click=${this._onDeepLink}>
                  ${t("budget_open_panel", L) || "Open in panel"}
                </button>
              `}
        </div>
      </ha-card>
    `;
  }

  static styles = [sectionCardSharedStyles, css`
    .currency {
      font-size: 14px; font-weight: 600;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      padding: 2px 10px; border-radius: 999px;
    }
    .track { display: flex; flex-direction: column; gap: 4px; }
    .track-label-row {
      display: flex; align-items: center; justify-content: space-between;
    }
    .track-label-row label {
      font-size: 12px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .track-numbers { font-size: 13px; font-weight: 600; }
    .track-numbers.ok { color: var(--primary-text-color); }
    .track-numbers.warning { color: #ff9800; }
    .track-numbers.danger { color: var(--error-color, #f44336); }
    .bar {
      height: 6px; background: var(--secondary-background-color);
      border-radius: 3px; overflow: hidden;
    }
    .bar-fill { height: 100%; transition: width 0.3s; border-radius: 3px; }
    .bar-fill.ok { background: var(--primary-color); }
    .bar-fill.warning { background: #ff9800; }
    .bar-fill.danger { background: var(--error-color, #f44336); }
    .inputs-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
      padding-top: 4px; border-top: 1px solid var(--divider-color);
    }
    .input-field { display: flex; flex-direction: column; gap: 4px; }
    .input-field label {
      font-size: 11px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.3px;
    }
    .input-wrap { position: relative; display: flex; align-items: center; }
    .input-wrap input {
      flex: 1; padding: 6px 32px 6px 8px; font-size: 13px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color); border-radius: 6px;
      font-family: inherit;
    }
    .input-suffix {
      position: absolute; right: 8px;
      color: var(--secondary-text-color); font-size: 13px;
      pointer-events: none;
    }
    .actions { display: flex; gap: 8px; align-items: center; }
  `];
}

if (!customElements.get("maintenance-budget-section-card")) {
  customElements.define(
    "maintenance-budget-section-card",
    MaintenanceBudgetSectionCard,
  );
}

registerCustomCard({
  type: "maintenance-budget-section-card",
  name: "Maintenance Supporter — Budget",
  description: "Inline monthly + yearly budget editor",
  preview: false,
});
