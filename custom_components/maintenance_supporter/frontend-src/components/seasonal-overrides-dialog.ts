/** Dialog for editing manual seasonal factor overrides (12 months). */

import { css, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { t } from "../styles";
import type { HomeAssistant } from "../types";

const MONTH_KEYS = [
  "month_jan", "month_feb", "month_mar", "month_apr",
  "month_may", "month_jun", "month_jul", "month_aug",
  "month_sep", "month_oct", "month_nov", "month_dec",
];

export class SeasonalOverridesDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _open = false;
  @state() private _loading = false;
  @state() private _error = "";
  @state() private _entryId = "";
  @state() private _taskId = "";
  @state() private _values: string[] = new Array(12).fill("");

  private get _lang(): string {
    return this.hass?.language ?? navigator.language.split("-")[0] ?? "en";
  }

  public open(entryId: string, taskId: string, currentOverrides: Record<number, number> | null | undefined): void {
    this._entryId = entryId;
    this._taskId = taskId;
    this._values = new Array(12).fill("");
    if (currentOverrides) {
      for (const [k, v] of Object.entries(currentOverrides)) {
        const m = parseInt(k, 10);
        if (m >= 1 && m <= 12 && typeof v === "number") {
          this._values[m - 1] = v.toString();
        }
      }
    }
    this._error = "";
    this._open = true;
  }

  private _close(): void {
    this._open = false;
  }

  private _buildOverrides(): Record<number, number> | null {
    const out: Record<number, number> = {};
    for (let i = 0; i < 12; i++) {
      const raw = this._values[i].trim();
      if (!raw) continue;
      const num = parseFloat(raw);
      if (Number.isNaN(num)) {
        this._error = `${t("month_" + ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][i], this._lang)}: ${t("seasonal_override_invalid", this._lang)}`;
        return null;
      }
      if (num < 0.1 || num > 5.0) {
        this._error = t("seasonal_override_range", this._lang);
        return null;
      }
      out[i + 1] = num;
    }
    return out;
  }

  private _save = async (): Promise<void> => {
    const overrides = this._buildOverrides();
    if (overrides === null) return;
    this._loading = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/task/seasonal_overrides",
        entry_id: this._entryId,
        task_id: this._taskId,
        overrides,
      });
      this._open = false;
      this.dispatchEvent(new CustomEvent("overrides-saved"));
    } catch (e) {
      this._error = (e as { message?: string })?.message || t("save_error", this._lang);
    } finally {
      this._loading = false;
    }
  };

  private _clearAll = async (): Promise<void> => {
    this._loading = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/task/seasonal_overrides",
        entry_id: this._entryId,
        task_id: this._taskId,
        overrides: {},
      });
      this._values = new Array(12).fill("");
      this._open = false;
      this.dispatchEvent(new CustomEvent("overrides-saved"));
    } catch (e) {
      this._error = (e as { message?: string })?.message || t("save_error", this._lang);
    } finally {
      this._loading = false;
    }
  };

  render() {
    if (!this._open) return html``;
    const L = this._lang;
    return html`
      <ha-dialog open @closed=${this._close} heading="${t("seasonal_overrides_title", L)}">
        <div class="content">
          <p class="hint">${t("seasonal_overrides_hint", L)}</p>
          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
          <div class="months">
            ${MONTH_KEYS.map((key, i) => html`
              <label class="month">
                <span class="mn">${t(key, L)}</span>
                <input type="number" step="0.1" min="0.1" max="5.0"
                  placeholder="1.0"
                  .value=${this._values[i]}
                  @input=${(e: Event) => {
                    const v = [...this._values];
                    v[i] = (e.target as HTMLInputElement).value;
                    this._values = v;
                  }} />
              </label>
            `)}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._clearAll} .disabled=${this._loading}>
            ${t("clear_all", L)}
          </ha-button>
          <div class="spacer"></div>
          <ha-button appearance="plain" @click=${this._close}>
            ${t("cancel", L)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading}>
            ${this._loading ? t("saving", L) : t("save", L)}
          </ha-button>
        </div>
      </ha-dialog>
    `;
  }

  static styles = css`
    .content {
      min-width: 320px;
      max-width: 480px;
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
      margin: 0 0 12px 0;
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
      margin-bottom: 8px;
    }
    .months {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .month {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .mn {
      min-width: 70px;
      font-size: 14px;
    }
    input[type="number"] {
      flex: 1;
      padding: 6px 8px;
      font-size: 14px;
      border-radius: 4px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .dialog-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 16px;
    }
    .spacer { flex: 1; }
  `;
}

if (!customElements.get("maintenance-seasonal-overrides-dialog")) {
  customElements.define("maintenance-seasonal-overrides-dialog", SeasonalOverridesDialog);
}
