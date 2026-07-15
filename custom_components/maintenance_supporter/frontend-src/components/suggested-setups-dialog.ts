/** Dialog for integration-aware suggested setups (verified entity signatures).
 *
 * Lists devices of catalogued integrations (Roborock, Xiaomi Miio, Dreame,
 * IPP/Brother printers, …) whose consumable entities can back maintenance
 * tasks, and adopts the selected ones: the object is bound to the device and
 * every task arrives with its sensor threshold trigger PRE-WIRED (below N
 * hours left / below N % remaining, auto-resolving on replacement). The wiring
 * comes from the server-side source-verified catalog — never from this client.
 */

import { css, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { t, ensureLocale } from "../styles";
import { describeWsError } from "../ws-errors";
import type { HomeAssistant } from "../types";

interface SetupTask {
  task_name: string;
  entity_ids: string[];
  trigger_below: number;
  direction: string;
}

interface SuggestedSetup {
  device_id: string;
  device_name: string;
  area_name: string;
  integration: string;
  integration_name: string;
  suggested_entry_id: string | null;
  suggested_object_name: string;
  tasks: SetupTask[];
}

interface AdoptResponse {
  tasks_created: number;
  objects_created: number;
  total: number;
  errors?: unknown[];
}

export class MaintenanceSuggestedSetupsDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _open = false;
  @state() private _loading = false;
  @state() private _adopting = false;
  @state() private _error = "";
  @state() private _setups: SuggestedSetup[] = [];
  @state() private _selected: Set<string> = new Set();

  private _localeReady = false;

  private get _lang(): string {
    return this.hass?.language || "en";
  }

  updated(changed: Map<string, unknown>): void {
    if (changed.has("hass") && this.hass && !this._localeReady) {
      this._localeReady = true;
      ensureLocale(this._lang).then(() => this.requestUpdate());
    }
  }

  public async open(): Promise<void> {
    this._open = true;
    this._loading = true;
    this._error = "";
    this._setups = [];
    this._selected = new Set();
    try {
      const resp = await this.hass.connection.sendMessagePromise<{ setups: SuggestedSetup[] }>({
        type: "maintenance_supporter/integration_setups/discover",
      });
      this._setups = resp.setups || [];
      this._selected = new Set(this._setups.map((s) => s.device_id));
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._loading = false;
    }
  }

  private _close(): void {
    this._open = false;
  }

  private _toggle = (deviceId: string): void => {
    const next = new Set(this._selected);
    if (next.has(deviceId)) next.delete(deviceId);
    else next.add(deviceId);
    this._selected = next;
  };

  private _adopt = async (): Promise<void> => {
    if (this._selected.size === 0 || this._adopting) return;
    this._adopting = true;
    this._error = "";
    try {
      const result = await this.hass.connection.sendMessagePromise<AdoptResponse>({
        type: "maintenance_supporter/integration_setups/adopt",
        selections: [...this._selected].map((device_id) => ({ device_id })),
      });
      this.dispatchEvent(
        new CustomEvent("integration-setups-adopted", {
          bubbles: true,
          composed: true,
          detail: result,
        }),
      );
      this._open = false;
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._adopting = false;
    }
  };

  render() {
    if (!this._open) return html``;
    const L = this._lang;

    return html`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${(e: Event) => e.stopPropagation()}>
          <div class="title">${t("setups_title", L)}</div>
          <div class="hint">${t("setups_hint", L)}</div>
          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}

          ${this._loading
            ? html`<div class="loading">…</div>`
            : this._setups.length === 0
              ? html`<div class="empty">${t("setups_none", L)}</div>`
              : html`
                  <div class="list">
                    ${this._setups.map((s) => {
                      const checked = this._selected.has(s.device_id);
                      const sub = [s.integration_name, s.area_name].filter(Boolean).join(" · ");
                      return html`
                        <label class="row">
                          <input
                            type="checkbox"
                            .checked=${checked}
                            @change=${() => this._toggle(s.device_id)}
                          />
                          <div class="row-main">
                            <div class="row-top">
                              <span class="row-name">${s.device_name}</span>
                            </div>
                            <div class="row-sub">${sub}</div>
                            <div class="row-target">
                              → ${s.suggested_object_name}${s.suggested_entry_id
                                ? nothing
                                : html` <span class="new-tag">${t("adopt_problem_new_object", L)}</span>`}
                            </div>
                            <div class="row-tasks">
                              ${s.tasks.map(
                                (task) => html`<span class="chip" title=${task.entity_ids.join(", ")}>
                                  <ha-icon icon="mdi:link-variant"></ha-icon>${task.task_name}
                                </span>`,
                              )}
                            </div>
                          </div>
                        </label>
                      `;
                    })}
                  </div>
                `}

          <div class="actions">
            <ha-button appearance="plain" @click=${this._close}>
              ${t("cancel", L)}
            </ha-button>
            <ha-button
              @click=${this._adopt}
              .disabled=${this._selected.size === 0 || this._adopting}
            >
              ${t("setups_adopt", L)}
            </ha-button>
          </div>
        </div>
      </div>
    `;
  }

  static styles = css`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .card {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 360px;
      max-width: 560px;
      width: 90vw;
      max-height: 80vh;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
    .title { font-size: 18px; font-weight: 500; }
    .hint { color: var(--secondary-text-color); font-size: 13px; }
    .error { color: var(--error-color, #f44336); font-size: 13px; }
    .loading, .empty { color: var(--secondary-text-color); font-size: 14px; padding: 12px 0; }
    .list { display: flex; flex-direction: column; gap: 6px; overflow-y: auto; max-height: 50vh; }
    .row {
      display: flex; align-items: flex-start; gap: 10px; padding: 8px;
      border: 1px solid var(--divider-color); border-radius: 6px; cursor: pointer;
    }
    .row input { margin-top: 2px; cursor: pointer; }
    .row-main { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1; }
    .row-name { font-weight: 500; font-size: 13px; }
    .row-sub, .row-target { color: var(--secondary-text-color); font-size: 12px; }
    .new-tag { font-style: italic; }
    .row-tasks { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px; }
    .chip {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; padding: 2px 8px; border-radius: 10px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color); white-space: nowrap;
    }
    .chip ha-icon { --mdc-icon-size: 12px; color: var(--primary-color); }
    .actions { display: flex; justify-content: flex-end; gap: 8px; padding-top: 8px; }
  `;
}

if (!customElements.get("maintenance-suggested-setups-dialog")) {
  customElements.define(
    "maintenance-suggested-setups-dialog",
    MaintenanceSuggestedSetupsDialog,
  );
}
