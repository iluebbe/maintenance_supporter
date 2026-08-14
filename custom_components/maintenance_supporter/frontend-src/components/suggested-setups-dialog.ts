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

import { t, ensureLocale, langOf } from "../styles";
import { describeWsError } from "../ws-errors";
import type { HomeAssistant } from "../types";

interface SetupTask {
  task_name: string;
  task_name_localized?: string;
  entity_ids: string[];
  threshold: number;
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
  // #102: optional counting start values, keyed "deviceId taskName".
  // Only usage_delta duties render the input; raw strings until adopt.
  @state() private _baselines: Map<string, string> = new Map();
  // #105: adopt target per device — entry_id of an existing object, or ""
  // for the default (the suggested bound object, else a new object).
  @state() private _targets: Map<string, string> = new Map();
  @state() private _objects: Array<{ entry_id: string; name: string }> = [];

  private _localeReady = false;

  private get _lang(): string {
    return langOf(this.hass);
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
      this._baselines = new Map();
      this._targets = new Map();
      try {
        const objs = await this.hass.connection.sendMessagePromise<{
          objects: Array<{ entry_id: string; object: { name: string } }>;
        }>({ type: "maintenance_supporter/objects" });
        this._objects = (objs.objects || [])
          .map((o) => ({ entry_id: o.entry_id, name: o.object?.name || o.entry_id }))
          .sort((a, b) => a.name.localeCompare(b.name));
      } catch {
        this._objects = []; // picker degrades to the default target only
      }
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
        selections: [...this._selected].map((device_id) => {
          const sel: { device_id: string; entry_id?: string; baselines?: Record<string, number> } = {
            device_id,
          };
          const target = this._targets.get(device_id);
          if (target) sel.entry_id = target;
          const setup = this._setups.find((s) => s.device_id === device_id);
          for (const task of setup?.tasks ?? []) {
            const raw = this._baselines.get(`${device_id} ${task.task_name}`);
            const b = raw ? parseFloat(raw) : NaN;
            if (!isNaN(b) && b >= 0) (sel.baselines ??= {})[task.task_name] = b;
          }
          return sel;
        }),
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
                            <div class="row-target" @click=${(e: Event) => e.preventDefault()}>
                              →
                              ${checked && this._objects.length > 0
                                ? html`
                                    <select
                                      class="target-select"
                                      @change=${(e: Event) => {
                                        const next = new Map(this._targets);
                                        const v = (e.target as HTMLSelectElement).value;
                                        if (v) next.set(s.device_id, v);
                                        else next.delete(s.device_id);
                                        this._targets = next;
                                      }}
                                    >
                                      <option value="" ?selected=${!this._targets.get(s.device_id)}>
                                        ${s.suggested_entry_id
                                          ? s.suggested_object_name
                                          : t("setups_target_new", L).replace("{name}", s.suggested_object_name)}
                                      </option>
                                      ${this._objects
                                        .filter((o) => o.entry_id !== s.suggested_entry_id)
                                        .map(
                                          (o) => html`<option
                                            value=${o.entry_id}
                                            ?selected=${this._targets.get(s.device_id) === o.entry_id}
                                          >
                                            ${o.name}
                                          </option>`,
                                        )}
                                    </select>
                                  `
                                : html`${s.suggested_object_name}${s.suggested_entry_id
                                    ? nothing
                                    : html` <span class="new-tag">${t("adopt_problem_new_object", L)}</span>`}`}
                            </div>
                            <div class="row-tasks">
                              ${s.tasks.map(
                                (task) => html`<span class="chip" title=${task.entity_ids.join(", ")}>
                                  <ha-icon icon="mdi:link-variant"></ha-icon>${task.task_name_localized ||
                                  task.task_name}
                                </span>`,
                              )}
                            </div>
                            ${checked
                              ? s.tasks
                                  .filter((task) => task.direction === "usage_delta")
                                  .map((task) => {
                                    const key = `${s.device_id} ${task.task_name}`;
                                    return html`
                                      <div class="baseline-field" @click=${(e: Event) => e.preventDefault()}>
                                        <span class="baseline-label"
                                          >${task.task_name_localized || task.task_name} —
                                          ${t("setups_baseline_hint", L)}</span
                                        >
                                        <input
                                          type="number"
                                          step="any"
                                          min="0"
                                          .value=${this._baselines.get(key) ?? ""}
                                          @click=${(e: Event) => e.preventDefault()}
                                          @input=${(e: Event) => {
                                            const next = new Map(this._baselines);
                                            next.set(key, (e.target as HTMLInputElement).value);
                                            this._baselines = next;
                                          }}
                                        />
                                      </div>
                                    `;
                                  })
                              : nothing}
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
      min-width: min(360px, calc(100vw - 24px));
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
    .target-select {
      font-size: 12px; padding: 2px 4px; max-width: 100%;
      border: 1px solid var(--divider-color); border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .baseline-field {
      display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
      margin-top: 4px; font-size: 12px; color: var(--secondary-text-color);
    }
    .baseline-field input {
      width: 110px; padding: 3px 6px; font-size: 12px;
      border: 1px solid var(--divider-color); border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .actions { display: flex; justify-content: flex-end; gap: 8px; padding-top: 8px; }
  `;
}

if (!customElements.get("maintenance-suggested-setups-dialog")) {
  customElements.define(
    "maintenance-suggested-setups-dialog",
    MaintenanceSuggestedSetupsDialog,
  );
}
