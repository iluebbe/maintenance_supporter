/** Dialog to discover HA "problem" sensors and adopt them as maintenance tasks.
 *
 * Lists binary/problem sensors that aren't already tracked, preselects them all,
 * and turns each into a maintenance task that triggers while the problem is
 * active and clears when it resolves. A selection either attaches to a suggested
 * existing object or spins up a fresh object bound to the sensor's device.
 *
 * 2.94 (duplicates from adopting in a real home): a sensor whose device no
 * object is linked to goes by default to the existing object that device most
 * likely is (and links it); a sensor that object probably already watches
 * under another name starts unticked with that task's name; a summary says
 * per object how many tasks it has before and after. Typing another object
 * asks the server again (problem_sensors/preview).
 *
 * #211 (54 problem sensors of 18 devices, on a phone): the summary grew a
 * line per object and squeezed the list, the only part that could shrink,
 * to nothing. The dialog now sits in the shared modal frame: the title and
 * the buttons stay, everything between them scrolls as one, and the summary
 * folds to its totals once it names more than three objects.
 */

import { css, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { t, ensureLocale, langOf } from "../styles";
import { runWs } from "../helpers/ws-run";
import { focusModalShell, modalShellStyles, renderModalShell } from "../helpers/modal-shell";
import { TRIGGER_FOR_MINUTES_RANGE } from "../helpers/setting-ranges";
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
  candidate?: { entry_id: string; name: string; reasons: string[] } | null;
  target_entry_id?: string | null;
  covered_by?: Covered;
}

type Covered = { task_id: string; name: string; reason: string } | null;

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

/** One object of the summary: the tasks it gains (entry null = a new object). */
interface SummaryGroup {
  name: string;
  entry: string | null;
  adding: number;
}

/** Up to this many objects the summary opens with its lines shown. */
const SUMMARY_LINES_OPEN = 3;

export class MaintenanceAdoptProblemSensorsDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _open = false;
  @state() private _loading = false;
  @state() private _adopting = false;
  @state() private _error = "";
  @state() private _sensors: ProblemSensor[] = [];
  @state() private _selected: Set<string> = new Set();
  /** #188: the object each selected sensor goes to — typed per row; the same
   *  name on several rows makes them ONE object, an existing object's name
   *  adds them to it. */
  @state() private _objectNames: Record<string, string> = {};
  @state() private _objects: Array<{ entry_id: string; name: string; tasks: number }> = [];
  /** 2.94: the task each sensor's target probably already has for it. */
  @state() private _covered: Record<string, Covered> = {};
  private _previewTimer: ReturnType<typeof setTimeout> | undefined;
  @state() private _users: HAUser[] = [];
  @state() private _responsible = "";
  // #136: minutes the problem must persist before the created task triggers
  // (one field applied to every selection). "0" = react to the first flicker.
  @state() private _forMinutes = "0";
  /** #211: the summary's lines shown; decided when the list arrives (folded
   *  beyond three objects), then the user's. */
  @state() private _summaryOpen = true;

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
    if (changed.has("_open") && this._open) focusModalShell(this.shadowRoot);
  }

  public async open(): Promise<void> {
    this._open = true;
    this._loading = true;
    this._error = "";
    this._sensors = [];
    this._selected = new Set();
    this._objectNames = {};
    this._responsible = "";
    this._forMinutes = "0";
    if (!this._userService) this._userService = new UserService(this.hass);
    else this._userService.updateHass(this.hass);
    const [resp, users, objs] = await Promise.all([
      runWs<DiscoverResponse>(this, { type: "maintenance_supporter/problem_sensors/discover" }, {
        onError: (m) => { this._error = m; },
      }),
      // Best-effort: adoption works fine without the user list.
      this._userService.getUsers().catch(() => [] as HAUser[]),
      // Best-effort too: the existing objects feed the name suggestions.
      this.hass.connection
        .sendMessagePromise<{
          objects: Array<{ entry_id: string; object: { name: string; archived_at?: string | null }; tasks?: unknown[] }>;
        }>({
          type: "maintenance_supporter/objects",
        })
        .catch(() => ({ objects: [] })),
    ]);
    this._loading = false;
    if (resp === undefined) return;
    this._objects = (objs?.objects || [])
      .filter((o) => !o.object.archived_at)
      .map((o) => ({ entry_id: o.entry_id, name: o.object.name, tasks: (o.tasks || []).length }));
    this._sensors = resp?.sensors || [];
    this._covered = Object.fromEntries(this._sensors.map((s) => [s.entity_id, s.covered_by ?? null]));
    // What the target probably already watches starts unticked.
    this._selected = new Set(this._sensors.filter((s) => !s.covered_by).map((s) => s.entity_id));
    this._users = users;
    this._summaryOpen = this._summaryGroups().length <= SUMMARY_LINES_OPEN;
  }

  /** The default object: the one linked to the device, else the one the
   *  device most likely is (2.94), else a new one named after the device. */
  private _defaultName(s: ProblemSensor): string {
    return s.suggested_entry_id ? s.suggested_object_name : (s.candidate?.name ?? s.suggested_object_name);
  }

  /** The object name a row will be adopted into (typed, else the default). */
  private _effectiveName(s: ProblemSensor): string {
    const typed = (this._objectNames[s.entity_id] ?? "").trim();
    return typed || this._defaultName(s);
  }

  /** An existing object the row lands in: the default's entry when the name
   *  is untouched, else an existing object with exactly that name. */
  private _existingEntryFor(s: ProblemSensor): string | null {
    const name = this._effectiveName(s);
    const defaultEntry = s.suggested_entry_id || s.target_entry_id || null;
    if (name === this._defaultName(s) && defaultEntry) return defaultEntry;
    const hit = this._objects.find((o) => o.name.trim().toLowerCase() === name.toLowerCase());
    return hit ? hit.entry_id : null;
  }

  /** Another object typed: the server judges the hints again (debounced). */
  private _schedulePreview(): void {
    clearTimeout(this._previewTimer);
    this._previewTimer = setTimeout(() => void this._preview(), 350);
  }

  private async _preview(): Promise<void> {
    const selections = this._sensors.map((s) => ({
      entity_id: s.entity_id,
      name: s.name,
      entry_id: this._existingEntryFor(s),
    }));
    const resp = await runWs<{ covered: Record<string, Covered> }>(
      this,
      { type: "maintenance_supporter/problem_sensors/preview", selections },
      { onError: () => {} },
    );
    if (resp?.covered) this._covered = { ...this._covered, ...resp.covered };
  }

  /** The objects the ticked rows go to, each with the tasks it gains. */
  private _summaryGroups(): SummaryGroup[] {
    const groups = new Map<string, SummaryGroup>();
    for (const s of this._sensors) {
      if (!this._selected.has(s.entity_id)) continue;
      const entry = this._existingEntryFor(s);
      const name = this._effectiveName(s);
      const key = entry ?? `new:${name.toLowerCase()}`;
      const g = groups.get(key) ?? { name, entry, adding: 0 };
      g.adding += 1;
      groups.set(key, g);
    }
    return [...groups.values()];
  }

  /** Per target object: tasks before → after (only ticked rows count), under
   *  a line with the totals that stays when the lines are folded (#211). */
  private _summary(L: string) {
    const groups = this._summaryGroups();
    if (groups.length === 0) return nothing;
    const created = groups.filter((g) => !g.entry).length;
    const totals = t(created ? "adopt_summary_totals_new" : "adopt_summary_totals", L)
      .replace("{tasks}", String(groups.reduce((n, g) => n + g.adding, 0)))
      .replace("{objects}", String(groups.length))
      .replace("{new}", String(created));
    return html`
      <details
        class="summary"
        .open=${this._summaryOpen}
        @toggle=${(e: Event) => { this._summaryOpen = (e.target as HTMLDetailsElement).open; }}
      >
        <summary>
          <span class="summary-title">${t("adopt_summary_title", L)}</span>
          <span class="summary-totals">${totals}</span>
        </summary>
        ${groups.map((g) => {
          if (!g.entry) {
            return html`<div class="summary-line new">
              ${t("setups_new_object_count", L).replace("{name}", g.name).replace("{count}", String(g.adding))}
            </div>`;
          }
          const before = this._objects.find((o) => o.entry_id === g.entry)?.tasks ?? 0;
          return html`<div class="summary-line">
            ${t("adopt_summary_existing", L)
              .replace("{name}", g.name)
              .replace("{before}", String(before))
              .replace("{after}", String(before + g.adding))}
          </div>`;
        })}
      </details>
    `;
  }

  private _close(): void {
    clearTimeout(this._previewTimer);
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
    this._error = "";
    const selections = this._sensors
      .filter((s) => this._selected.has(s.entity_id))
      .map((s) => ({
        entity_id: s.entity_id,
        name: s.name,
        entry_id: this._existingEntryFor(s) ?? undefined,
        object_name: this._effectiveName(s),
        device_id: s.device_id ?? undefined,
        part_id: s.suggested_part_id ?? undefined,
        responsible_user_id: this._responsible || undefined,
        for_minutes: parseInt(this._forMinutes, 10) > 0 ? parseInt(this._forMinutes, 10) : undefined,
      }));
    const result = await runWs<AdoptResponse>(
      this,
      { type: "maintenance_supporter/problem_sensors/adopt", selections },
      { busy: (b) => { this._adopting = b; }, onError: (m) => { this._error = m; } },
    );
    if (result === undefined) return;
    this.dispatchEvent(
      new CustomEvent("problem-sensors-adopted", {
        bubbles: true,
        composed: true,
        detail: result,
      }),
    );
    this._open = false;
  };

  /** The target line: the found object with why it was chosen, else the name. */
  private _targetLabel(s: ProblemSensor, L: string): string {
    if (s.candidate && this._existingEntryFor(s) === s.candidate.entry_id) {
      const reasons = s.candidate.reasons.map((r) => t(`setups_reason_${r}`, L)).join(", ");
      return t("setups_target_match", L).replace("{name}", s.candidate.name).replace("{reasons}", reasons);
    }
    return this._effectiveName(s);
  }

  render() {
    if (!this._open) return html``;
    const L = this._lang;
    const allSelected =
      this._sensors.length > 0 && this._selected.size === this._sensors.length;

    return renderModalShell(() => this._close(), html`
        <div class="title">${t("adopt_problem_title", L)}</div>
        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}

        <div class="dialog-scroll">
          <div class="hint">${t("adopt_problem_hint", L)}</div>
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
                  <div class="row-sub adopt-object-hint">${t("adopt_object_hint", L)}</div>
                  <datalist id="adopt-object-names">
                    ${this._objects.map((o) => html`<option value=${o.name}></option>`)}
                  </datalist>
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
                            ${checked
                              ? html`<div class="row-object" @click=${(e: Event) => e.stopPropagation()}>
                                  <input
                                    class="adopt-object"
                                    list="adopt-object-names"
                                    aria-label=${t("object", L)}
                                    placeholder=${this._defaultName(s)}
                                    .value=${this._objectNames[s.entity_id] ?? this._defaultName(s)}
                                    @input=${(e: Event) => {
                                      this._objectNames = { ...this._objectNames, [s.entity_id]: (e.target as HTMLInputElement).value };
                                      this._schedulePreview();
                                    }}
                                  />
                                </div>`
                              : nothing}
                            <div class="row-target">
                              → ${this._targetLabel(s, L)}${this._existingEntryFor(s)
                                ? nothing
                                : html` <span class="new-tag">${t("adopt_problem_new_object", L)}</span>`}
                            </div>
                            ${this._covered[s.entity_id]
                              ? html`<div class="maybe">
                                  ${t("setups_maybe_covered", L).replace("{name}", this._covered[s.entity_id]!.name)}
                                </div>`
                              : nothing}
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

          ${!this._loading && this._sensors.length > 0 ? this._summary(L) : nothing}

          ${!this._loading && this._sensors.length > 0
            ? html`
                <label class="responsible">
                  <span>${t("for_at_least_minutes", L)}</span>
                  <input
                    class="for-input"
                    type="number"
                    min=${TRIGGER_FOR_MINUTES_RANGE[0]}
                    max=${TRIGGER_FOR_MINUTES_RANGE[1]}
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
        </div>

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
    `);
  }

  static styles = [modalShellStyles, css`
    :host {
      --ms-modal-max-width: 560px;
      --ms-modal-max-height: 90dvh;
      --ms-modal-gap: 12px;
      --ms-modal-z: 1000;
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
    /* Stays at the top of the scrolling middle: the count while ticking.
       top: -1px + 1px more padding: on a 3x screen a fractional offset let a
       line of the text scrolled under it show above it. */
    .select-all {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--secondary-text-color);
      cursor: pointer;
      position: sticky;
      top: -1px;
      z-index: 1;
      padding: 5px 0 4px;
      background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    }
    .select-all input {
      cursor: pointer;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 6px;
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
    .row-object { margin-top: 6px; }
    .row-object input {
      width: 100%; box-sizing: border-box; padding: 6px 8px; font: inherit;
      border: 1px solid var(--divider-color); border-radius: 6px;
      background: var(--card-background-color); color: var(--primary-text-color);
    }
    .adopt-object-hint { margin: 0 0 8px; }
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
    .maybe {
      font-size: 11px;
      color: var(--warning-color, #ff9800);
    }
    .summary {
      font-size: 12px;
      border-top: 1px dashed var(--divider-color);
      padding-top: 6px;
    }
    .summary > summary {
      cursor: pointer;
      margin-bottom: 2px;
    }
    .summary-title {
      font-weight: 500;
    }
    .summary-totals {
      color: var(--secondary-text-color);
    }
    .summary-line {
      color: var(--primary-color);
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
  `];
}

if (!customElements.get("maintenance-adopt-problem-sensors-dialog")) {
  customElements.define(
    "maintenance-adopt-problem-sensors-dialog",
    MaintenanceAdoptProblemSensorsDialog,
  );
}
