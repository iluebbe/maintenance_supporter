/** Dialog for integration-aware suggested setups (verified entity signatures).
 *
 * Lists devices of catalogued integrations (Roborock, Xiaomi Miio, Dreame,
 * IPP/Brother printers, …) whose consumable entities can back maintenance
 * tasks, and adopts the selected ones: the object is bound to the device and
 * every task arrives with its sensor threshold trigger PRE-WIRED (below N
 * hours left / below N % remaining, auto-resolving on replacement). The wiring
 * comes from the server-side source-verified catalog — never from this client.
 *
 * 2.94 (duplicates in a real home: the washer and dryer adopted as NEW objects
 * next to the user's own, a second wallbox, lubrication tasks under other
 * names): the target defaults to the existing object the device most likely
 * is, every task has its own tick box, a task the target probably already has
 * under another name starts unticked with that name, tasks it has by name are
 * listed as already there, and a before/after line says what adopting does.
 * Picking another target asks the server again (integration_setups/preview).
 */

import { css, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { t, ensureLocale, langOf } from "../styles";
import { runWs } from "../helpers/ws-run";
import type { HomeAssistant } from "../types";

interface SetupTask {
  task_name: string;
  task_name_localized?: string;
  entity_ids: string[];
  threshold: number;
  direction: string;
  covered_by?: { task_id: string; name: string; reason: string } | null;
}

interface SuggestedSetup {
  device_id: string;
  device_name: string;
  area_name: string;
  integration: string;
  integration_name: string;
  suggested_entry_id: string | null;
  suggested_object_name: string;
  candidate?: { entry_id: string; name: string; reasons: string[] } | null;
  target_entry_id?: string | null;
  target_task_count?: number;
  tasks: SetupTask[];
  already?: Array<{ task_name: string; task_name_localized: string; existing_name: string }>;
}

interface AdoptResponse {
  tasks_created: number;
  objects_created: number;
  total: number;
  errors?: unknown[];
}

/** The target select's value for "a new object for this device". */
const NEW = "__new__";

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
  // Adopt target per device: an object's entry_id, or NEW.
  @state() private _targets: Map<string, string> = new Map();
  // Ticked tasks per device (task_name keys).
  @state() private _tasks: Map<string, Set<string>> = new Map();
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

  /** Ticked by default: everything the target does not probably have yet. */
  private _defaultTicks(setup: SuggestedSetup): Set<string> {
    return new Set(setup.tasks.filter((task) => !task.covered_by).map((task) => task.task_name));
  }

  public async open(): Promise<void> {
    this._open = true;
    this._loading = true;
    this._error = "";
    this._setups = [];
    this._selected = new Set();
    const resp = await runWs<{ setups: SuggestedSetup[] }>(
      this,
      { type: "maintenance_supporter/integration_setups/discover" },
      { onError: (m) => { this._error = m; } },
    );
    if (resp !== undefined) {
      this._setups = resp?.setups || [];
      this._selected = new Set(this._setups.map((s) => s.device_id));
      this._baselines = new Map();
      this._targets = new Map(this._setups.map((s) => [s.device_id, s.target_entry_id || NEW]));
      this._tasks = new Map(this._setups.map((s) => [s.device_id, this._defaultTicks(s)]));
      try {
        const objs = await this.hass.connection.sendMessagePromise<{
          objects: Array<{ entry_id: string; object: { name: string; archived_at?: string | null } }>;
        }>({ type: "maintenance_supporter/objects" });
        this._objects = (objs.objects || [])
          .filter((o) => !o.object?.archived_at)
          .map((o) => ({ entry_id: o.entry_id, name: o.object?.name || o.entry_id }))
          .sort((a, b) => a.name.localeCompare(b.name));
      } catch {
        this._objects = []; // picker degrades to the default target only
      }
    }
    this._loading = false;
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

  private _toggleTask(deviceId: string, taskName: string): void {
    const ticks = new Set(this._tasks.get(deviceId) ?? []);
    if (ticks.has(taskName)) ticks.delete(taskName);
    else ticks.add(taskName);
    this._tasks = new Map(this._tasks).set(deviceId, ticks);
  }

  /** Another target: the server judges the proposals against it again. */
  private async _retarget(setup: SuggestedSetup, value: string): Promise<void> {
    this._targets = new Map(this._targets).set(setup.device_id, value);
    const fresh = await runWs<SuggestedSetup>(
      this,
      {
        type: "maintenance_supporter/integration_setups/preview",
        device_id: setup.device_id,
        entry_id: value === NEW ? null : value,
      },
      { onError: (m) => { this._error = m; } },
    );
    // An empty answer (an older server without preview) keeps the old ticks.
    if (!fresh || !Array.isArray(fresh.tasks)) return;
    this._setups = this._setups.map((s) => (s.device_id === setup.device_id ? { ...s, ...fresh } : s));
    this._tasks = new Map(this._tasks).set(setup.device_id, this._defaultTicks(fresh));
  }

  private _adopt = async (): Promise<void> => {
    if (this._adopting) return;
    this._error = "";
    const selections = [...this._selected]
      .map((device_id) => {
        const ticks = [...(this._tasks.get(device_id) ?? [])];
        const sel: { device_id: string; entry_id?: string; task_names: string[]; baselines?: Record<string, number> } = {
          device_id,
          task_names: ticks,
        };
        const target = this._targets.get(device_id);
        if (target && target !== NEW) sel.entry_id = target;
        for (const name of ticks) {
          const raw = this._baselines.get(`${device_id} ${name}`);
          const b = raw ? parseFloat(raw) : NaN;
          if (!isNaN(b) && b >= 0) (sel.baselines ??= {})[name] = b;
        }
        return sel;
      })
      .filter((sel) => sel.task_names.length > 0);
    if (selections.length === 0) return;
    const result = await runWs<AdoptResponse>(
      this,
      { type: "maintenance_supporter/integration_setups/adopt", selections },
      { busy: (b) => { this._adopting = b; }, onError: (m) => { this._error = m; } },
    );
    if (result === undefined) return;
    this.dispatchEvent(
      new CustomEvent("integration-setups-adopted", {
        bubbles: true,
        composed: true,
        detail: result,
      }),
    );
    this._open = false;
  };

  private get _anythingTicked(): boolean {
    return [...this._selected].some((id) => (this._tasks.get(id)?.size ?? 0) > 0);
  }

  private _targetOptions(s: SuggestedSetup, L: string) {
    const current = this._targets.get(s.device_id) ?? NEW;
    const options: Array<{ value: string; label: string }> = [];
    if (s.suggested_entry_id) {
      options.push({ value: s.suggested_entry_id, label: s.suggested_object_name });
    } else {
      if (s.candidate) {
        const reasons = s.candidate.reasons.map((r) => t(`setups_reason_${r}`, L)).join(", ");
        options.push({
          value: s.candidate.entry_id,
          label: t("setups_target_match", L).replace("{name}", s.candidate.name).replace("{reasons}", reasons),
        });
      }
      options.push({ value: NEW, label: t("setups_target_new", L).replace("{name}", s.device_name) });
    }
    const listed = new Set(options.map((o) => o.value));
    for (const o of this._objects) if (!listed.has(o.entry_id)) options.push({ value: o.entry_id, label: o.name });
    return html`
      <select
        class="target-select"
        @click=${(e: Event) => e.stopPropagation()}
        @change=${(e: Event) => void this._retarget(s, (e.target as HTMLSelectElement).value)}
      >
        ${options.map((o) => html`<option value=${o.value} ?selected=${o.value === current}>${o.label}</option>`)}
      </select>
    `;
  }

  private _beforeAfter(s: SuggestedSetup, L: string): string {
    const ticked = this._tasks.get(s.device_id)?.size ?? 0;
    const target = this._targets.get(s.device_id) ?? NEW;
    if (target === NEW) {
      return t("setups_new_object_count", L).replace("{name}", s.device_name).replace("{count}", String(ticked));
    }
    const before = s.target_task_count ?? 0;
    return t("setups_before_after", L).replace("{before}", String(before)).replace("{after}", String(before + ticked));
  }

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
                      const ticks = this._tasks.get(s.device_id) ?? new Set<string>();
                      return html`
                        <div class="row ${checked ? "" : "off"}" data-device=${s.device_id}>
                          <input
                            type="checkbox"
                            class="device-check"
                            .checked=${checked}
                            @change=${() => this._toggle(s.device_id)}
                          />
                          <div class="row-main">
                            <div class="row-top">
                              <span class="row-name">${s.device_name}</span>
                            </div>
                            <div class="row-sub">${sub}</div>
                            <div class="row-target">→ ${this._targetOptions(s, L)}</div>
                            ${checked
                              ? html`
                                  <div class="task-list">
                                    ${s.tasks.map(
                                      (task) => html`
                                        <label class="task" title=${task.entity_ids.join(", ")}>
                                          <input
                                            type="checkbox"
                                            class="task-check"
                                            .checked=${ticks.has(task.task_name)}
                                            @change=${() => this._toggleTask(s.device_id, task.task_name)}
                                          />
                                          <span class="task-text">
                                            <span>${task.task_name_localized || task.task_name}</span>
                                            ${task.covered_by
                                              ? html`<span class="maybe">${t("setups_maybe_covered", L).replace("{name}", task.covered_by.name)}</span>`
                                              : nothing}
                                          </span>
                                        </label>
                                        ${task.direction === "usage_delta" && ticks.has(task.task_name)
                                          ? html`
                                              <div class="baseline-field">
                                                <span class="baseline-label">${t("setups_baseline_hint", L)}</span>
                                                <input
                                                  type="number"
                                                  step="any"
                                                  min="0"
                                                  .value=${this._baselines.get(`${s.device_id} ${task.task_name}`) ?? ""}
                                                  @input=${(e: Event) => {
                                                    const next = new Map(this._baselines);
                                                    next.set(`${s.device_id} ${task.task_name}`, (e.target as HTMLInputElement).value);
                                                    this._baselines = next;
                                                  }}
                                                />
                                              </div>
                                            `
                                          : nothing}
                                      `,
                                    )}
                                    ${s.already?.length
                                      ? html`<div class="already">
                                          ${t("setups_already", L).replace(
                                            "{names}",
                                            s.already.map((a) => a.existing_name).join(", "),
                                          )}
                                        </div>`
                                      : nothing}
                                  </div>
                                  <div class="before-after">${this._beforeAfter(s, L)}</div>
                                `
                              : nothing}
                          </div>
                        </div>
                      `;
                    })}
                  </div>
                `}

          <div class="actions">
            <ha-button appearance="plain" @click=${this._close}>
              ${t("cancel", L)}
            </ha-button>
            <ha-button @click=${this._adopt} .disabled=${!this._anythingTicked || this._adopting}>
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
    .list { display: flex; flex-direction: column; gap: 6px; overflow-y: auto; max-height: 55vh; }
    .row {
      display: flex; align-items: flex-start; gap: 10px; padding: 8px;
      border: 1px solid var(--divider-color); border-radius: 6px;
    }
    .row.off .row-main { opacity: 0.6; }
    .row input { margin-top: 2px; cursor: pointer; }
    .row-main { display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1; }
    .row-name { font-weight: 500; font-size: 13px; }
    .row-sub, .row-target { color: var(--secondary-text-color); font-size: 12px; }
    .row-target { display: flex; align-items: center; gap: 6px; min-width: 0; }
    .target-select {
      font-size: 12px; padding: 2px 4px; min-width: 0; max-width: 100%; flex: 1 1 auto;
      border: 1px solid var(--divider-color); border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .task-list { display: flex; flex-direction: column; gap: 2px; margin-top: 2px; }
    .task { display: flex; align-items: flex-start; gap: 6px; font-size: 13px; cursor: pointer; }
    .task-text { display: flex; flex-direction: column; min-width: 0; }
    .maybe { font-size: 11px; color: var(--warning-color, #ff9800); }
    .already { font-size: 11px; color: var(--secondary-text-color); margin-top: 2px; }
    .before-after {
      font-size: 12px; font-weight: 500; color: var(--primary-color);
      border-top: 1px dashed var(--divider-color); padding-top: 4px; margin-top: 2px;
    }
    .baseline-field {
      display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
      margin: 0 0 2px 24px; font-size: 12px; color: var(--secondary-text-color);
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
