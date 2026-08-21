/** Dialog to discover HA "problem" sensors and adopt them as maintenance tasks.
 *
 * Lists binary/problem sensors that aren't already tracked, preselects them all,
 * and turns each into a maintenance task that triggers while the problem is
 * active and clears when it resolves. A selection either attaches to a suggested
 * existing object or spins up a fresh object bound to the sensor's device.
 */

import { css, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { t, ensureLocale, langOf } from "../styles";
import { describeWsError } from "../ws-errors";
import { UserService } from "../user-service";
import type { HAUser, HomeAssistant } from "../types";

interface ProblemSensor {
  entity_id: string;
  name: string;
  state: string;
  device_id: string | null;
  device_name: string | null;
  area_name: string | null;
  suggested_entry_id: string | null;
  suggested_object_name: string;
  suggested_part_id: string | null;
  suggested_part_name: string | null;
}

interface DiscoverResponse {
  sensors: ProblemSensor[];
}

interface AdoptResponse {
  tasks_created: number;
  objects_created: number;
  created: Array<{ entry_id: string; task_id: string; name: string }>;
  total: number;
  errors?: string[];
}

export class MaintenanceAdoptProblemSensorsDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _open = false;
  @state() private _loading = false;
  @state() private _adopting = false;
  @state() private _error = "";
  @state() private _sensors: ProblemSensor[] = [];
  @state() private _selected: Set<string> = new Set();
  @state() private _users: HAUser[] = [];
  @state() private _responsible = "";
  // #136: minutes the problem must persist before the created task triggers
  // (one field applied to every selection). "0" = react to the first flicker.
  @state() private _forMinutes = "0";

  private _localeReady = false;
  private _userService: UserService | null = null;

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
    this._sensors = [];
    this._selected = new Set();
    this._responsible = "";
    this._forMinutes = "0";
    try {
      if (!this._userService) this._userService = new UserService(this.hass);
      else this._userService.updateHass(this.hass);
      const [resp, users] = await Promise.all([
        this.hass.connection.sendMessagePromise<DiscoverResponse>({
          type: "maintenance_supporter/problem_sensors/discover",
        }),
        // Best-effort: adoption works fine without the user list.
        this._userService.getUsers().catch(() => [] as HAUser[]),
      ]);
      this._sensors = resp.sensors || [];
      this._selected = new Set(this._sensors.map((s) => s.entity_id));
      this._users = users;
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._loading = false;
    }
  }

  private _close(): void {
    this._open = false;
  }

  private _toggle = (entityId: string): void => {
    const next = new Set(this._selected);
    if (next.has(entityId)) next.delete(entityId);
    else next.add(entityId);
    this._selected = next;
  };

  private _toggleAll = (): void => {
    if (this._selected.size === this._sensors.length) {
      this._selected = new Set();
    } else {
      this._selected = new Set(this._sensors.map((s) => s.entity_id));
    }
  };

  private _adopt = async (): Promise<void> => {
    if (this._selected.size === 0 || this._adopting) return;
    this._adopting = true;
    this._error = "";
    try {
      const selections = this._sensors
        .filter((s) => this._selected.has(s.entity_id))
        .map((s) => ({
          entity_id: s.entity_id,
          name: s.name,
          entry_id: s.suggested_entry_id ?? undefined,
          object_name: s.suggested_object_name,
          device_id: s.device_id ?? undefined,
          part_id: s.suggested_part_id ?? undefined,
          responsible_user_id: this._responsible || undefined,
          for_minutes: parseInt(this._forMinutes, 10) > 0 ? parseInt(this._forMinutes, 10) : undefined,
        }));
      const result = await this.hass.connection.sendMessagePromise<AdoptResponse>({
        type: "maintenance_supporter/problem_sensors/adopt",
        selections,
      });
      this.dispatchEvent(
        new CustomEvent("problem-sensors-adopted", {
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
    const allSelected =
      this._sensors.length > 0 && this._selected.size === this._sensors.length;

    return html`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${(e: Event) => e.stopPropagation()}>
          <div class="title">${t("adopt_problem_title", L)}</div>
          <div class="hint">${t("adopt_problem_hint", L)}</div>
          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}

          ${this._loading
            ? html`<div class="loading">…</div>`
            : this._sensors.length === 0
              ? html`<div class="empty">${t("adopt_problem_none", L)}</div>`
              : html`
                  <label class="select-all">
                    <input
                      type="checkbox"
                      .checked=${allSelected}
                      @change=${this._toggleAll}
                    />
                    <span>${t("selected", L)}: ${this._selected.size} / ${this._sensors.length}</span>
                  </label>
                  <div class="list">
                    ${this._sensors.map((s) => {
                      const checked = this._selected.has(s.entity_id);
                      const active = s.state === "on";
                      const sub = [s.device_name, s.area_name]
                        .filter(Boolean)
                        .join(" · ");
                      return html`
                        <label class="row">
                          <input
                            type="checkbox"
                            .checked=${checked}
                            @change=${() => this._toggle(s.entity_id)}
                          />
                          <div class="row-main">
                            <div class="row-top">
                              <span class="row-name">${s.name}</span>
                              <span class="chip ${active ? "chip-active" : "chip-ok"}">
                                ${active
                                  ? t("adopt_problem_active", L)
                                  : t("adopt_problem_ok", L)}
                              </span>
                            </div>
                            ${sub ? html`<div class="row-sub">${sub}</div>` : nothing}
                            <div class="row-target">
                              → ${s.suggested_object_name}${s.suggested_entry_id
                                ? nothing
                                : html` <span class="new-tag">${t("adopt_problem_new_object", L)}</span>`}
                            </div>
                            ${s.suggested_part_name
                              ? html`<div class="row-part">
                                  <ha-icon icon="mdi:package-variant-closed"></ha-icon>
                                  ${t("adopt_problem_part", L).replace("{name}", s.suggested_part_name)}
                                </div>`
                              : nothing}
                          </div>
                        </label>
                      `;
                    })}
                  </div>
                `}

          ${!this._loading && this._sensors.length > 0
            ? html`
                <label class="responsible">
                  <span>${t("for_at_least_minutes", L)}</span>
                  <input
                    class="for-input"
                    type="number"
                    min="0"
                    max="1440"
                    .value=${this._forMinutes}
                    @input=${(e: Event) => (this._forMinutes = (e.target as HTMLInputElement).value)}
                  />
                </label>
                <div class="for-hint">${t("adopt_for_minutes_hint", L)}</div>
              `
            : nothing}

          ${!this._loading && this._sensors.length > 0 && this._users.length > 0
            ? html`
                <label class="responsible">
                  <span>${t("adopt_problem_responsible", L)}</span>
                  <select
                    .value=${this._responsible}
                    @change=${(e: Event) => {
                      this._responsible = (e.target as HTMLSelectElement).value;
                    }}
                  >
                    <option value="" ?selected=${!this._responsible}>${t("no_user_assigned", L)}</option>
                    ${this._users.map(
                      (u) => html`<option value=${u.id} ?selected=${u.id === this._responsible}>${u.name}</option>`,
                    )}
                  </select>
                </label>
              `
            : nothing}

          <div class="actions">
            <ha-button appearance="plain" @click=${this._close}>
              ${t("cancel", L)}
            </ha-button>
            <ha-button
              @click=${this._adopt}
              .disabled=${this._selected.size === 0 || this._adopting}
            >
              ${t("adopt_problem_adopt", L)}
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
    .title {
      font-size: 18px;
      font-weight: 500;
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .loading,
    .empty {
      color: var(--secondary-text-color);
      font-size: 14px;
      padding: 12px 0;
    }
    .select-all {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .select-all input {
      cursor: pointer;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      overflow-y: auto;
      max-height: 50vh;
    }
    .row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      cursor: pointer;
    }
    .row input {
      margin-top: 2px;
      cursor: pointer;
    }
    .row-main {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      flex: 1;
    }
    .row-top {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .row-name {
      font-weight: 500;
      font-size: 13px;
    }
    .row-sub {
      color: var(--secondary-text-color);
      font-size: 12px;
    }
    .row-target {
      color: var(--secondary-text-color);
      font-size: 12px;
    }
    .row-part {
      color: var(--secondary-text-color);
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .row-part ha-icon {
      --mdc-icon-size: 14px;
    }
    .new-tag {
      font-style: italic;
    }
    .chip {
      font-size: 11px;
      padding: 1px 8px;
      border-radius: 10px;
      white-space: nowrap;
    }
    .chip-active {
      background: var(--error-color, #f44336);
      color: #fff;
    }
    .chip-ok {
      background: var(--divider-color);
      color: var(--secondary-text-color);
    }
    .responsible {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--secondary-text-color);
      flex-wrap: wrap;
    }
    .for-input {
      width: 70px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      padding: 4px 6px;
    }
    .for-hint {
      font-size: 11px;
      color: var(--secondary-text-color);
      margin: -4px 0 2px;
    }
    .responsible select {
      flex: 1;
      min-width: 140px;
      padding: 4px 6px;
      border-radius: 4px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 8px;
    }
  `;
}

if (!customElements.get("maintenance-adopt-problem-sensors-dialog")) {
  customElements.define(
    "maintenance-adopt-problem-sensors-dialog",
    MaintenanceAdoptProblemSensorsDialog,
  );
}
