/** <maintenance-task-trace> — the task detail's Trace tab (the new look):
 *  one due cycle at a time, like a HA automation trace is one run, with its
 *  result on top (how it ended, how long after it was due, the reminders
 *  and snoozes it took). Each step is one line, its node on the rail at the
 *  left (green: done, dashed: a change that did not count), the time since
 *  the step before under its time. A click opens the step's details under
 *  it: the exact time, what it came to, how long a status lasted, and for
 *  a history step what the history knows (notes, photos, readings, costs,
 *  who did it). Arrows step through the cycles, newest first. Reads
 *  `maintenance_supporter/task/trace` (the journal and the full history)
 *  when the tab opens. */

import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { formatDateTime, formatNumber, langOf, sharedStyles, t, withUnit } from "../styles";
import type { HistoryEntry, HomeAssistant, MaintenanceTask } from "../types";
import {
  activityRows,
  buildCycles,
  changeDetails,
  completedByDetail,
  cycleResult,
  detailEntry,
  spanText,
  type ActivityRow,
  type ChangeContext,
  type TraceCycle,
  type TraceDetail,
  type TraceEvent,
  type TraceItem,
} from "../helpers/task-trace";
import { downloadTextFile } from "../helpers/download";
import { haToday } from "../helpers/ha-time";
import { entityName, isStateRule, ruleSensors, triggerUnit } from "../helpers/trigger-entities";
import { renderHistoryEntry } from "../renderers/history";

const OLDER_PATH = "M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z";
const NEWER_PATH = "M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z";
const DOWNLOAD_PATH = "M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z";

/** The window the activity around a step covers (HA's trace shows its
 *  logbook for the run): an hour before it, a quarter after. */
const ACTIVITY_BEFORE_MS = 60 * 60_000;
const ACTIVITY_AFTER_MS = 15 * 60_000;

type TraceAnswer = { enabled?: boolean; events?: TraceEvent[]; history?: HistoryEntry[] };
type ActivityState = "loading" | "failed" | ActivityRow[];

/** A gap under a minute is the same moment; it gets no "later". */
const GAP_MIN_MS = 60_000;

export class MaintenanceTaskTrace extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public entryId = "";
  @property({ attribute: false }) public taskId = "";
  /** The task, for its trigger sensor's unit. */
  @property({ attribute: false }) public task: MaintenanceTask | null = null;
  @property({ attribute: false }) public currencySymbol = "€";
  @property({ attribute: false }) public taskRef: string | null = null;
  /** Who completed: the panel's user service. */
  @property({ attribute: false }) public userName: (userId: string) => string | null = () => null;
  @state() private _enabled = true;
  @state() private _cycles: TraceCycle[] | null = null;
  /** Index into _cycles; -1 = the newest. */
  @state() private _index = -1;
  /** The step whose details are open; -1 = none. */
  @state() private _sel = -1;
  @state() private _failed = false;
  /** The answer as it came, for the download. */
  private _raw: TraceAnswer | null = null;
  /** The sensors' recorded states around an opened step, by cycle/step. */
  @state() private _activity = new Map<string, ActivityState>();
  private _loadedFor = "";

  protected updated(): void {
    const key = `${this.entryId}/${this.taskId}`;
    if (this.hass && this.entryId && this.taskId && key !== this._loadedFor) {
      this._loadedFor = key;
      void this._load();
    }
  }

  private async _load(): Promise<void> {
    this._cycles = null;
    this._failed = false;
    this._index = -1;
    this._sel = -1;
    this._raw = null;
    this._activity = new Map();
    try {
      const res = await this.hass.connection.sendMessagePromise<TraceAnswer>({
        type: "maintenance_supporter/task/trace",
        entry_id: this.entryId,
        task_id: this.taskId,
      });
      this._raw = res ?? {};
      this._enabled = res?.enabled !== false;
      this._cycles = buildCycles(res?.events ?? [], res?.history ?? [], langOf(this.hass), {
        triggerUnit: triggerUnit(this.hass, this.task) || undefined,
        stateRule: isStateRule(this.task),
        entityName: (id) => entityName(this.hass, id),
      });
    } catch {
      this._failed = true;
      this._cycles = [];
    }
  }

  private _current(): { cycle: TraceCycle | null; index: number } {
    const cycles = this._cycles ?? [];
    if (!cycles.length) return { cycle: null, index: -1 };
    const index = this._index < 0 || this._index >= cycles.length ? cycles.length - 1 : this._index;
    return { cycle: cycles[index], index };
  }

  private _step(delta: number): void {
    const { index } = this._current();
    const next = index + delta;
    if (this._cycles && next >= 0 && next < this._cycles.length) {
      this._index = next;
      this._sel = -1;
    }
  }

  protected render(): unknown {
    const L = langOf(this.hass);
    if (this._cycles === null) return html`<div class="trace-note">…</div>`;
    const { cycle, index } = this._current();
    const total = this._cycles.length;
    const label = cycle
      ? `${formatDateTime(cycle.start, L)} – ${cycle.closed ? formatDateTime(cycle.end, L) : t("beta_trace_current", L)}`
      : t("beta_trace_current", L);
    return html`
      ${!this._enabled ? html`<div class="trace-note trace-off">${t("beta_trace_off", L)}</div>` : nothing}
      ${this._failed ? html`<div class="trace-note">${t("beta_trace_load_failed", L)}</div>` : nothing}
      <div class="trace-cycles">
        <ha-icon-button class="trace-older" .path=${OLDER_PATH} .label=${t("beta_trace_older", L)} .disabled=${index <= 0}
          @click=${() => this._step(-1)}></ha-icon-button>
        <span class="trace-cycle-label">${label}</span>
        <ha-icon-button class="trace-newer" .path=${NEWER_PATH} .label=${t("beta_trace_newer", L)} .disabled=${index < 0 || index >= total - 1}
          @click=${() => this._step(1)}></ha-icon-button>
        <ha-icon-button class="trace-download" .path=${DOWNLOAD_PATH} .label=${t("beta_trace_download", L)} .disabled=${!this._raw}
          @click=${() => this._download()}></ha-icon-button>
      </div>
      ${!cycle || !cycle.items.length
        ? html`<div class="trace-note">${t("beta_trace_empty", L)}</div>`
        : html`
          ${this._renderResult(cycle, L)}
          <ol class="trace-steps" aria-label=${t("beta_trace", L)}>
            ${cycle.items.map((it, i) => this._renderStep(it, i, cycle.items[i + 1], `${index}:${i}`, L))}
          </ol>`}
    `;
  }

  /** The cycle's result line, HA's "Finished at …". */
  private _renderResult(cycle: TraceCycle, L: string) {
    const result = cycleResult(cycle, L);
    return html`
      <div class="trace-result ${result.tone}">
        <ha-icon icon=${result.icon}></ha-icon>
        <span class="trace-result-text">${result.text}</span>
        ${result.facts.map((f) => html`<span class="trace-fact">${f}</span>`)}
      </div>`;
  }

  private _renderStep(it: TraceItem, i: number, next: TraceItem | undefined, key: string, L: string) {
    const open = this._sel === i;
    const runs = it.repeats?.length ?? 0;
    const last = runs ? it.repeats![runs - 1] : it;
    const gap = it.gapMs != null && it.gapMs >= GAP_MIN_MS ? t("beta_trace_later", L).replace("{span}", spanText(it.gapMs, L)) : "";
    return html`
      <li class="trace-item ${it.tone} ${next?.tone === "skipped" ? "next-skipped" : ""}">
        <button type="button" class="trace-step ${it.tone} ${open ? "selected" : ""}" aria-expanded=${open ? "true" : "false"}
          @click=${() => this._toggle(it, i, key)}>
          <span class="trace-node ${it.tone}"><ha-icon icon=${it.icon}></ha-icon></span>
          <span class="trace-main">
            <span class="trace-time">
              ${formatDateTime(it.at, L)}${runs ? html` – ${formatDateTime(last.at, L)}` : nothing}
              ${gap ? html`<span class="trace-gap">${gap}</span>` : nothing}
            </span>
            <span class="trace-text">${runs ? it.foldText ?? it.text : it.text}${runs ? html` <span class="trace-count">×${runs}</span>` : nothing}</span>
          </span>
          <ha-icon class="trace-chevron" icon=${open ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
        </button>
        ${open ? this._renderDetails(it, key, L) : nothing}
      </li>`;
  }

  private _toggle(it: TraceItem, i: number, key: string): void {
    if (this._sel === i) {
      this._sel = -1;
      return;
    }
    this._sel = i;
    const ids = this._watched(it);
    if (ids.length && !this._activity.has(key)) void this._loadActivity(key, it, ids);
  }

  /** The sensors a step is about: the rule's for a firing or a change to or
   *  from Triggered, the Done-when entity for its changes. */
  private _watched(it: TraceItem): string[] {
    const task = this.task;
    if (it.watch === "rule" && task?.trigger_config) return [...new Set(ruleSensors(task.trigger_config).map((s) => s.entityId))];
    if (it.watch === "done_when" && task?.complete_when?.entity_id) return [task.complete_when.entity_id];
    return [];
  }

  /** What the recorder kept of those sensors around the step (HA's trace
   *  shows the related logbook; the logbook leaves numeric sensors out). */
  private async _loadActivity(key: string, it: TraceItem, ids: string[]): Promise<void> {
    this._activity = new Map(this._activity).set(key, "loading");
    const at = Date.parse((it.repeats ? it.repeats[it.repeats.length - 1] : it).at);
    let rows: ActivityState;
    try {
      const res = await this.hass.connection.sendMessagePromise<Parameters<typeof activityRows>[0]>({
        type: "history/history_during_period",
        start_time: new Date(at - ACTIVITY_BEFORE_MS).toISOString(),
        end_time: new Date(at + ACTIVITY_AFTER_MS).toISOString(),
        entity_ids: ids,
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      });
      rows = activityRows(res, at);
    } catch {
      rows = "failed";
    }
    this._activity = new Map(this._activity).set(key, rows);
  }

  /** The trace as a file, for a bug report: the answer as it came, with the
   *  task it belongs to (HA's "Download trace"). */
  private _download(): void {
    if (!this._raw) return;
    const { history: _history, ...task } = this.task ?? ({} as Partial<MaintenanceTask>);
    const name = (this.task?.name || this.taskId).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "task";
    const payload = { exported_at: new Date().toISOString(), entry_id: this.entryId, task_id: this.taskId, task, ...this._raw };
    downloadTextFile(JSON.stringify(payload, null, 2), `trace-${name}-${haToday()}.json`, "application/json");
  }

  private _changeContext(L: string): ChangeContext {
    return {
      lang: L,
      entityName: (id) => entityName(this.hass, id),
      userName: this.userName,
      unit: triggerUnit(this.hass, this.task) || undefined,
    };
  }

  private _renderActivity(key: string, L: string) {
    const state = this._activity.get(key);
    if (state === undefined) return nothing;
    return html`
      <div class="trace-activity">
        <div class="trace-activity-title">${t("beta_trace_activity", L)}</div>
        ${state === "loading"
          ? html`<div class="trace-activity-none">…</div>`
          : state === "failed" || !state.length
            ? html`<div class="trace-activity-none">${t("beta_trace_activity_none", L)}</div>`
            : html`<ol class="trace-repeats">
                ${state.map((r) => html`<li><span class="trace-time">${formatDateTime(new Date(r.at).toISOString(), L, true)}</span><span>${entityName(this.hass, r.entityId)}: ${this._stateText(r, L)}</span></li>`)}
              </ol>`}
      </div>`;
  }

  /** A recorded state as the sensor shows it: a number with its unit. */
  private _stateText(r: ActivityRow, L: string): string {
    const n = Number(r.state);
    if (r.state === "" || !Number.isFinite(n)) return r.state;
    const unit = this.hass?.states?.[r.entityId]?.attributes?.unit_of_measurement;
    return withUnit(formatNumber(n, L, { maximumFractionDigits: 3 }), typeof unit === "string" ? unit : "", L);
  }

  /** The step's details: HA's "step details" for a maintenance step. */
  private _renderDetails(it: TraceItem, key: string, L: string) {
    const rows: TraceDetail[] = [{ label: t("history_edit_timestamp", L), value: formatDateTime(it.at, L, true) }];
    if (!it.repeats) {
      rows.push(...it.details, ...changeDetails(it.changes, this._changeContext(L)));
      const by = it.history ? completedByDetail(it.history, this.userName, L) : null;
      if (by) rows.push(by);
    }
    return html`
      <div class="trace-details" role="region" aria-label=${t("task_section_details", L)}>
        <dl class="trace-facts">
          ${rows.map((r) => html`<dt>${r.label}</dt><dd>${r.value}</dd>`)}
        </dl>
        ${it.repeats
          ? html`<ol class="trace-repeats">
              ${it.repeats.map((r) => html`<li><span class="trace-time">${formatDateTime(r.at, L, true)}</span><span>${r.text}</span></li>`)}
            </ol>`
          : it.history
            ? renderHistoryEntry(detailEntry(it.history), {
                lang: L,
                hass: this.hass,
                currencySymbol: this.currencySymbol,
                taskRef: this.taskRef,
                triggerUnit: triggerUnit(this.hass, this.task) || null,
                stateRule: isStateRule(this.task),
              }, { compact: true, showEdit: false, showHead: false })
            : nothing}
        ${this._renderActivity(key, L)}
      </div>`;
  }

  static styles = [sharedStyles, css`
    :host {
      display: block;
      padding: 8px 0;
    }
    .trace-note {
      padding: 8px 12px;
      color: var(--secondary-text-color);
      font-size: 14px;
    }
    .trace-off {
      border: 1px dashed var(--divider-color);
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .trace-cycles {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 4px 0 12px;
    }
    .trace-cycle-label {
      flex: 0 1 520px;
      text-align: center;
      padding: 6px 16px;
      border-radius: 9999px;
      background: var(--secondary-background-color, #e6e6e6);
      font-size: 14px;
      font-weight: 500;
    }
    .trace-result {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px 10px;
      margin: 0 8px 12px;
      padding: 8px 12px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ms-radius-10, 10px);
      font-size: 14px;
    }
    .trace-result ha-icon {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
    }
    .trace-result.done ha-icon {
      color: var(--success-color, #00883c);
    }
    .trace-result-text {
      font-weight: 500;
    }
    .trace-fact {
      padding: 2px 10px;
      border-radius: 9999px;
      background: var(--secondary-background-color, #eff9fe);
      font-size: 12px;
      line-height: 20px;
    }
    .trace-steps {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    /* The rail: each step draws the line into its node (::before) and out
       of it (::after), so node and text share one line whatever its height,
       open details included. Node: 32 px at 6 px from the top, centred on
       24 px from the left. */
    .trace-item {
      position: relative;
    }
    .trace-item::before,
    .trace-item::after {
      content: "";
      position: absolute;
      left: 23px;
      border-left: 2px solid var(--success-color, #00883c);
    }
    .trace-item::before {
      top: 0;
      height: 6px;
    }
    .trace-item::after {
      top: 38px;
      bottom: 0;
    }
    .trace-item:first-child::before,
    .trace-item:last-child::after {
      display: none;
    }
    .trace-item.skipped::before,
    .trace-item.next-skipped::after {
      border-left: 2px dashed var(--divider-color);
    }
    .trace-step {
      display: grid;
      grid-template-columns: 32px minmax(0, 1fr) 20px;
      gap: 12px;
      align-items: start;
      width: 100%;
      padding: 6px 8px;
      border: none;
      border-radius: 8px;
      background: none;
      color: inherit;
      font: inherit;
      text-align: start;
      cursor: pointer;
    }
    .trace-step:hover,
    .trace-step.selected {
      background: var(--secondary-background-color, #eff9fe);
    }
    .trace-step:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .trace-node {
      width: 32px;
      height: 32px;
      box-sizing: border-box;
      display: grid;
      place-items: center;
      border: 2px solid var(--divider-color);
      border-radius: var(--ms-radius-10, 10px);
      background: var(--card-background-color, #fff);
      color: var(--secondary-text-color);
      --mdc-icon-size: 18px;
    }
    .trace-node.done {
      border-color: var(--success-color, #00883c);
      color: var(--success-color, #00883c);
    }
    .trace-node.status {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .trace-node.skipped {
      border-style: dashed;
    }
    .trace-step.selected .trace-node {
      outline: 3px solid var(--primary-color);
      outline-offset: 2px;
    }
    /* Time beside the text, under it when the line is narrow. */
    .trace-main {
      display: flex;
      flex-wrap: wrap;
      gap: 0 12px;
      padding-top: 6px;
      min-width: 0;
    }
    .trace-time {
      flex: 0 0 auto;
      min-width: 96px;
      font-size: 12px;
      line-height: 20px;
      color: var(--secondary-text-color);
    }
    .trace-gap {
      display: block;
      font-size: 11px;
      line-height: 16px;
    }
    .trace-text {
      flex: 1 1 220px;
      min-width: 0;
      font-size: 14px;
      line-height: 20px;
      overflow-wrap: anywhere;
    }
    .trace-step.skipped .trace-text {
      color: var(--secondary-text-color);
    }
    .trace-count {
      display: inline-block;
      padding: 0 6px;
      border-radius: 9999px;
      background: var(--secondary-background-color, #eff9fe);
      font-size: 12px;
      font-weight: 500;
    }
    .trace-chevron {
      margin-top: 6px;
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
    }
    .trace-details {
      margin: 2px 8px 8px 52px;
      padding: 8px 12px;
      border-radius: 8px;
      background: var(--secondary-background-color, #eff9fe);
      font-size: 13px;
    }
    .trace-facts {
      display: grid;
      grid-template-columns: max-content minmax(0, 1fr);
      gap: 4px 12px;
      margin: 0;
    }
    .trace-facts dt {
      color: var(--secondary-text-color);
    }
    .trace-facts dd {
      margin: 0;
      overflow-wrap: anywhere;
    }
    .trace-details .history-entry {
      border-bottom: none;
      padding-bottom: 0;
    }
    .trace-repeats {
      list-style: none;
      margin: 8px 0 0;
      padding: 0;
      display: grid;
      gap: 2px;
    }
    .trace-repeats li {
      display: flex;
      flex-wrap: wrap;
      gap: 0 12px;
    }
    .trace-repeats .trace-time {
      min-width: 140px;
    }
    .trace-activity {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid var(--divider-color);
    }
    .trace-activity-title {
      font-weight: 500;
    }
    .trace-activity-none {
      color: var(--secondary-text-color);
      margin-top: 4px;
    }
  `];
}

if (!customElements.get("maintenance-task-trace")) {
  customElements.define("maintenance-task-trace", MaintenanceTaskTrace);
}
