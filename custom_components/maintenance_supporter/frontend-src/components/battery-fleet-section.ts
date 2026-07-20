/** Battery-fleet detail section, rendered inside the single "Replace low
 *  batteries" task's overview tab (task.battery_fleet_task). Self-contained:
 *  fetches the live aggregate over Battery Notes and offers the mark-replaced
 *  action — the fleet's one surface, instead of 30-70 per-battery tasks. */

import { css, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { t, ensureLocale } from "../styles";
import { describeWsError } from "../ws-errors";
import type { HomeAssistant } from "../types";

interface BatteryRow {
  entity_id: string;
  device_name: string;
  battery_type: string;
  quantity: number;
  level: number | null;
  days_until: number | null;
  available?: boolean;
}
interface Overview {
  available: boolean;
  configured: boolean;
  task_ok?: boolean;
  total: number;
  low: BatteryRow[];
  soon: BatteryRow[];
  needs_now: Record<string, number>;
  needs_soon: Record<string, number>;
  types: string[];
}

export class MaintenanceBatteryFleetSection extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _ov: Overview | null = null;
  @state() private _loading = false;
  @state() private _marking = false;
  @state() private _error = "";
  private _localeReady = false;

  private get _lang(): string {
    return this.hass?.language || "en";
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.hass) this._load();
  }

  updated(changed: Map<string, unknown>): void {
    if (changed.has("hass") && this.hass && !this._localeReady) {
      this._localeReady = true;
      ensureLocale(this._lang).then(() => this.requestUpdate());
      if (this._ov === null && !this._loading) this._load();
    }
  }

  private async _load(): Promise<void> {
    this._loading = true;
    this._error = "";
    try {
      this._ov = await this.hass.connection.sendMessagePromise<Overview>({
        type: "maintenance_supporter/battery_fleet/overview",
      });
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._loading = false;
    }
  }

  private _markAll = async (): Promise<void> => {
    await this._mark(undefined);
  };

  // Re-runs the idempotent setup, which restores the fleet task's trigger
  // when a user edit wiped it (issue #106) or recreates a deleted task.
  private _repair = async (): Promise<void> => {
    if (this._marking) return;
    this._marking = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/battery_fleet/setup",
      });
      await this._load();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._marking = false;
    }
  };

  private async _mark(entityIds: string[] | undefined): Promise<void> {
    if (this._marking) return;
    this._marking = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/battery_fleet/mark_replaced",
        ...(entityIds ? { entity_ids: entityIds } : {}),
      });
      await this._load();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._marking = false;
    }
  }

  private _shoppingLine(needs: Record<string, number>): string {
    return Object.entries(needs)
      .map(([type, qty]) => `${qty}× ${type}`)
      .join(" · ");
  }

  render() {
    const L = this._lang;
    if (this._loading && this._ov === null) return html`<div class="bf-card"><div class="bf-loading">…</div></div>`;
    const ov = this._ov;
    if (!ov) {
      return this._error ? html`<div class="bf-card"><div class="bf-error">${this._error}</div></div>` : nothing;
    }
    const lowCount = ov.low.length;
    return html`
      <div class="bf-card">
        <div class="bf-head">
          <ha-icon icon="mdi:battery-alert"></ha-icon>
          <span class="bf-title">${t("battery_fleet_title", L)}</span>
          <span class="bf-count ${lowCount ? "bad" : "ok"}">${lowCount}</span>
        </div>
        ${this._error ? html`<div class="bf-error">${this._error}</div>` : nothing}

        ${ov.configured && ov.task_ok === false
          ? html`
              <div class="bf-repair">
                <span>${t("battery_fleet_trigger_lost", L)}</span>
                <ha-button .disabled=${this._marking} @click=${this._repair}>
                  ${t("battery_fleet_repair", L)}
                </ha-button>
              </div>
            `
          : nothing}

        ${lowCount === 0
          ? html`<div class="bf-empty">${t("battery_fleet_none_low", L)}</div>`
          : html`
              <div class="bf-shopping">
                <span class="bf-label">${t("battery_fleet_buy_now", L)}</span>
                <span class="bf-list">${this._shoppingLine(ov.needs_now)}</span>
              </div>
              <div class="bf-rows">
                ${ov.low.map(
                  (b) => html`
                    <div class="bf-row">
                      <span class="bf-dev">${b.device_name}</span>
                      ${b.available === false
                        ? html`<span class="bf-offline">${t("battery_fleet_offline", L)}</span>`
                        : nothing}
                      <span class="bf-type">${b.quantity}× ${b.battery_type}</span>
                      ${b.level != null ? html`<span class="bf-level">${b.level}%</span>` : nothing}
                      <button
                        class="bf-mark"
                        title=${t("battery_fleet_mark_one", L)}
                        .disabled=${this._marking}
                        @click=${() => this._mark([b.entity_id])}
                      >
                        <ha-icon icon="mdi:battery-sync"></ha-icon>
                      </button>
                    </div>
                  `,
                )}
              </div>
              <div class="bf-actions">
                <ha-button .disabled=${this._marking} @click=${this._markAll}>
                  <ha-icon icon="mdi:battery-sync"></ha-icon> ${t("battery_fleet_mark_all", L)}
                </ha-button>
              </div>
            `}

        ${ov.soon.length
          ? html`
              <div class="bf-soon">
                <span class="bf-label">${t("battery_fleet_soon", L)}</span>
                <span class="bf-list">${this._shoppingLine(ov.needs_soon)}</span>
                <div class="bf-soon-hint">${t("battery_fleet_soon_hint", L)}</div>
              </div>
            `
          : nothing}
        <div class="bf-total">${t("battery_fleet_total", L).replace("{n}", String(ov.total))}</div>
      </div>
    `;
  }

  static styles = css`
    .bf-card {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 14px 16px;
      margin: 12px 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .bf-head {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
    .bf-title {
      flex: 1;
    }
    .bf-count {
      font-size: 13px;
      padding: 1px 9px;
      border-radius: 10px;
    }
    .bf-count.bad {
      background: var(--error-color, #f44336);
      color: #fff;
    }
    .bf-count.ok {
      background: var(--success-color, #4caf50);
      color: #fff;
    }
    .bf-error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .bf-repair {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 8px 10px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--warning-color, #ff9800) 12%, transparent);
      font-size: 13px;
    }
    .bf-empty {
      color: var(--secondary-text-color);
      font-size: 14px;
    }
    .bf-shopping,
    .bf-soon {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 8px;
    }
    .bf-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--secondary-text-color);
    }
    .bf-list {
      font-weight: 500;
    }
    .bf-rows {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .bf-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .bf-dev {
      flex: 1;
      min-width: 0;
    }
    .bf-type {
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .bf-level {
      font-size: 12px;
      color: var(--error-color, #f44336);
    }
    .bf-mark {
      background: transparent;
      border: none;
      color: var(--primary-color);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: inline-flex;
    }
    .bf-mark:hover {
      background: var(--secondary-background-color);
    }
    .bf-actions {
      display: flex;
      justify-content: flex-end;
    }
    .bf-soon {
      border-top: 1px solid var(--divider-color);
      padding-top: 8px;
    }
    .bf-soon-hint {
      width: 100%;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .bf-total {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
  `;
}

if (!customElements.get("maintenance-battery-fleet-section")) {
  customElements.define("maintenance-battery-fleet-section", MaintenanceBatteryFleetSection);
}
