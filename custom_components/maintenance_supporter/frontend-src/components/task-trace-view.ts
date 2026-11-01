/** <maintenance-task-trace> — the task detail's Trace tab (the new look):
 *  one due cycle at a time, like a HA automation trace is one run. The
 *  steps as a graph on the left (green: done, dashed: a change that did not
 *  count) and as a timeline on the right; arrows step through the cycles,
 *  newest first. Reads `maintenance_supporter/task/trace` (the journal and
 *  the full history) when the tab opens. */

import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { formatDateTime, langOf, t } from "../styles";
import type { HistoryEntry, HomeAssistant } from "../types";
import { buildCycles, type TraceCycle, type TraceEvent } from "../helpers/task-trace";

const OLDER_PATH = "M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z";
const NEWER_PATH = "M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z";

export class MaintenanceTaskTrace extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public entryId = "";
  @property({ attribute: false }) public taskId = "";
  @state() private _enabled = true;
  @state() private _cycles: TraceCycle[] | null = null;
  /** Index into _cycles; -1 = the newest. */
  @state() private _index = -1;
  @state() private _sel = -1;
  @state() private _failed = false;
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
    try {
      const res = await this.hass.connection.sendMessagePromise<{ enabled?: boolean; events?: TraceEvent[]; history?: HistoryEntry[] }>({
        type: "maintenance_supporter/task/trace",
        entry_id: this.entryId,
        task_id: this.taskId,
      });
      this._enabled = res?.enabled !== false;
      this._cycles = buildCycles(res?.events ?? [], res?.history ?? [], langOf(this.hass));
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
      </div>
      ${!cycle || !cycle.items.length
        ? html`<div class="trace-note">${t("beta_trace_empty", L)}</div>`
        : html`
          <div class="trace-body">
            <div class="trace-graph" role="list" aria-label=${t("beta_trace", L)}>
              ${cycle.items.map((it, i) => html`
                ${i > 0 ? html`<span class="trace-line ${it.tone}"></span>` : nothing}
                <button type="button" role="listitem" class="trace-node ${it.tone} ${this._sel === i ? "selected" : ""}"
                  title=${it.text} aria-label=${it.text} @click=${() => { this._sel = i; }}>
                  <ha-icon icon=${it.icon}></ha-icon>
                </button>`)}
            </div>
            <ol class="trace-timeline">
              ${cycle.items.map((it, i) => html`
                <li class="trace-step ${it.tone} ${this._sel === i ? "selected" : ""}" @click=${() => { this._sel = i; }}>
                  <span class="trace-time">${formatDateTime(it.at, L)}</span>
                  <span class="trace-dot ${it.tone}"></span>
                  <span class="trace-text">${it.text}</span>
                </li>`)}
            </ol>
          </div>`}
    `;
  }

  static styles = css`
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
    .trace-body {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      flex-wrap: wrap;
    }
    .trace-graph {
      flex: 0 0 64px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4px 0;
    }
    .trace-node {
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      border: 2px solid var(--divider-color);
      border-radius: var(--ms-radius-10, 10px);
      background: var(--card-background-color, #fff);
      color: var(--secondary-text-color);
      cursor: pointer;
      padding: 0;
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
    .trace-node.selected {
      outline: 3px solid var(--primary-color);
      outline-offset: 2px;
    }
    .trace-line {
      width: 2px;
      height: 16px;
      background: var(--success-color, #00883c);
    }
    .trace-line.skipped {
      background: none;
      border-left: 2px dashed var(--divider-color);
      width: 0;
    }
    .trace-timeline {
      flex: 1 1 320px;
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
    }
    .trace-step {
      display: grid;
      grid-template-columns: minmax(96px, auto) 20px minmax(0, 1fr);
      gap: 10px;
      align-items: start;
      padding: 6px 8px;
      border-radius: 8px;
      cursor: pointer;
    }
    .trace-step.selected {
      background: var(--secondary-background-color, #eff9fe);
    }
    .trace-time {
      font-size: 12px;
      line-height: 20px;
      color: var(--secondary-text-color);
    }
    .trace-dot {
      width: 12px;
      height: 12px;
      margin-top: 4px;
      border-radius: 50%;
      border: 2px solid var(--primary-color);
      box-sizing: border-box;
    }
    .trace-dot.done {
      background: var(--success-color, #00883c);
      border-color: var(--success-color, #00883c);
    }
    .trace-dot.skipped {
      border-style: dashed;
      border-color: var(--secondary-text-color);
    }
    .trace-dot.info {
      border-color: var(--secondary-text-color);
    }
    .trace-text {
      font-size: 14px;
      line-height: 20px;
      overflow-wrap: anywhere;
    }
    .trace-step.skipped .trace-text {
      color: var(--secondary-text-color);
    }
  `;
}

if (!customElements.get("maintenance-task-trace")) {
  customElements.define("maintenance-task-trace", MaintenanceTaskTrace);
}
