/** Object lifecycle history section (#138) — the object detail's cross-task
 * "service booklet": every lifecycle entry of every task, merged and sorted
 * chronologically, with date-range + task filters and a printable service
 * record (blob tab → print / save as PDF).
 *
 * The objects list response carries only each task's recent history window,
 * so on first use the section fetches every task's FULL history in parallel
 * (`maintenance_supporter/task/history`) and merges from that.
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t, ensureLocale, langOf, formatDate, formatDateTime } from "../styles";
import {
  filterObjectHistory,
  mergeObjectHistory,
  objectHistoryTotals,
  type ObjectHistoryEntry,
} from "../helpers/object-history";
import { buildServiceRecordHtml, type ServiceRecordLabels } from "../helpers/service-record";
import { openHtmlInNewTab } from "../helpers/document-url";
import "./ms-date-field";
import type { HistoryEntry, HomeAssistant, MaintenanceObject, MaintenanceTask } from "../types";

/** Mirrors the backend's per-task history retention cap — a full history of
 * exactly this length has probably been trimmed, which the record must say. */
const HISTORY_RETENTION_CAP = 500;

export class MaintenanceObjectHistorySection extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() public entryId = "";
  @property({ attribute: false }) public object: MaintenanceObject | null = null;
  @property({ attribute: false }) public tasks: MaintenanceTask[] = [];
  @property() public currencySymbol = "€";
  /** Resolves a user id to a display name; null hides the credit line — a
   *  raw UUID on a printed service record is noise, not information. */
  @property({ attribute: false }) public userName: (id: string) => string | null = () => null;

  @state() private _full: Record<string, HistoryEntry[]> = {};
  @state() private _loading = false;
  @state() private _filterTask = "";
  @state() private _from = "";
  @state() private _to = "";
  @state() private _expanded = false;

  private _loadedFor: string | null = null;
  private _localeReady = false;

  private get _lang(): string {
    return langOf(this.hass);
  }

  updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    if (!this._localeReady && this.hass) {
      this._localeReady = true;
      void ensureLocale(this._lang).then(() => this.requestUpdate());
    }
    if (this.entryId && this._loadedFor !== this.entryId) {
      this._loadedFor = this.entryId;
      this._full = {};
      this._filterTask = "";
      this._from = "";
      this._to = "";
      void this._loadFullHistories();
    }
  }

  /** Fetch every task's full history in parallel; tasks whose fetch fails
   *  keep their (windowed) list-response history — degraded, never empty. */
  private async _loadFullHistories(): Promise<void> {
    const entryId = this.entryId;
    const tasks = this.tasks;
    if (!tasks.length) return;
    this._loading = true;
    const results = await Promise.all(
      tasks.map(async (task) => {
        try {
          const res = (await this.hass.connection.sendMessagePromise({
            type: "maintenance_supporter/task/history",
            entry_id: entryId,
            task_id: task.id,
          })) as { history?: HistoryEntry[] };
          return [task.id, res.history ?? []] as const;
        } catch {
          return [task.id, task.history ?? []] as const;
        }
      }),
    );
    if (this.entryId !== entryId) return; // navigated away meanwhile
    this._full = Object.fromEntries(results);
    this._loading = false;
  }

  private get _entries(): ObjectHistoryEntry[] {
    return mergeObjectHistory(
      this.tasks.map((task) => ({
        id: task.id,
        name: task.name,
        history: this._full[task.id] ?? task.history ?? [],
      })),
    );
  }

  private get _capped(): boolean {
    return Object.values(this._full).some((h) => h.length >= HISTORY_RETENTION_CAP);
  }

  private _openTask(taskId: string): void {
    this.dispatchEvent(new CustomEvent("open-task", { detail: { taskId }, bubbles: true, composed: true }));
  }

  private _print(filtered: ReadonlyArray<ObjectHistoryEntry>): void {
    const L = this._lang;
    const o = this.object;
    if (!o) return;
    const labels: ServiceRecordLabels = {
      title: t("service_record_title", L),
      generated: t("report_generated", L),
      manufacturer: t("manufacturer", L),
      model: t("model", L),
      serial: t("serial_number_label", L),
      installed: t("installed", L),
      colDate: t("date", L),
      colTask: t("task_name", L),
      colCost: t("cost", L),
      colDuration: t("duration", L),
      colNotes: t("notes_label", L),
      completedBy: t("completed_by", L),
      totalLabel: t("report_total_cost", L),
      entriesLabel: (n) => `${n} ${t("service_record_entries", L)}`,
      capNote: t("object_history_cap_note", L),
      none: "—",
    };
    const printable = filtered.map((e) => ({
      ...e,
      completedBy: e.completedBy ? this.userName(e.completedBy) : null,
    }));
    const htmlDoc = buildServiceRecordHtml(
      o,
      printable,
      labels,
      (iso) => (iso ? formatDate(iso, L) : ""),
      (minutes) => `${minutes} min`,
      this.currencySymbol,
      new Date().toISOString(),
      { capped: this._capped },
    );
    openHtmlInNewTab(htmlDoc);
  }

  render() {
    const L = this._lang;
    const all = this._entries;
    if (!all.length && !this._loading) return nothing;
    const filtered = filterObjectHistory(all, {
      taskId: this._filterTask || null,
      from: this._from || null,
      to: this._to || null,
    });
    const { completed, totalCost } = objectHistoryTotals(filtered);
    const shown = this._expanded ? filtered : filtered.slice(0, 15);

    return html`
      <div class="section">
        <h3>
          ${t("object_history_section", L)}
          <span class="count">${filtered.length}</span>
          ${this._loading ? html`<span class="loading-hint">${t("loading", L)}</span>` : nothing}
          <ha-button appearance="plain" class="print-btn" @click=${() => this._print(filtered)}>
            <ha-icon icon="mdi:printer-outline"></ha-icon>
            ${t("service_record_print", L)}
          </ha-button>
        </h3>

        <div class="filters">
          <select .value=${this._filterTask} @change=${(e: Event) => { this._filterTask = (e.target as HTMLSelectElement).value; }}>
            <option value="">${t("object_history_all_tasks", L)}</option>
            ${this.tasks.map((task) => html`<option value=${task.id} ?selected=${task.id === this._filterTask}>${task.name}</option>`)}
          </select>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${L}
            .label=${t("date_from", L)}
            .value=${this._from}
            @value-changed=${(e: CustomEvent) => { this._from = e.detail.value as string; }}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${L}
            .label=${t("date_to", L)}
            .value=${this._to}
            @value-changed=${(e: CustomEvent) => { this._to = e.detail.value as string; }}
          ></ms-date-field>
        </div>

        ${filtered.length === 0
          ? html`<p class="empty">${t("object_history_empty", L)}</p>`
          : html`
              <div class="rows">
                ${shown.map((e) => html`
                  <div class="row">
                    <span class="date" title=${formatDateTime(e.timestamp, L)}>${formatDate(e.timestamp, L)}</span>
                    <span class="type type-${e.type}">${t(e.type, L)}</span>
                    <button class="task-link" @click=${() => this._openTask(e.taskId)}>${e.taskName}${e.phaseName ? ` · ${e.phaseName}` : ""}</button>
                    <span class="facts">
                      ${e.cost != null ? html`<span>${e.cost.toFixed(2)} ${this.currencySymbol}</span>` : nothing}
                      ${e.duration != null ? html`<span>${e.duration} min</span>` : nothing}
                    </span>
                    ${e.notes ? html`<span class="notes" title=${e.notes}>${e.notes}</span>` : nothing}
                  </div>
                `)}
              </div>
              ${filtered.length > shown.length
                ? html`<ha-button appearance="plain" class="more" @click=${() => { this._expanded = true; }}>
                    ${t("show_all", L)} (${filtered.length})
                  </ha-button>`
                : nothing}
              <div class="totals">
                ${completed} ${t("service_record_entries", L)} · ${t("report_total_cost", L)}:
                <strong>${totalCost.toFixed(2)} ${this.currencySymbol}</strong>
              </div>
              ${this._capped
                ? html`<p class="cap-note">${t("object_history_cap_note", L)}</p>`
                : nothing}
            `}
      </div>
    `;
  }

  static styles = css`
    .section { margin-top: 28px; }
    h3 { display: flex; align-items: center; gap: 8px; margin: 0 0 10px; }
    .count {
      font-size: 12px; color: var(--secondary-text-color);
      background: var(--secondary-background-color); padding: 2px 8px; border-radius: 999px;
    }
    .loading-hint { font-size: 12px; color: var(--secondary-text-color); font-weight: 400; }
    .print-btn { margin-left: auto; }
    .print-btn ha-icon { --mdc-icon-size: 16px; margin-right: 4px; }
    .filters {
      display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
      margin-bottom: 10px; font-size: 13px; color: var(--secondary-text-color);
    }
    .filters select, .filters input {
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
      border-radius: 6px; padding: 5px 8px; font: inherit;
    }
    .filters label { display: inline-flex; align-items: center; gap: 6px; }
    .rows { display: flex; flex-direction: column; }
    .row {
      display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;
      padding: 6px 4px; border-bottom: 1px solid var(--divider-color);
      font-size: 13px;
    }
    .date { color: var(--secondary-text-color); min-width: 84px; white-space: nowrap; }
    .type {
      font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
      padding: 1px 6px; border-radius: 4px; white-space: nowrap;
    }
    .type-completed { background: color-mix(in srgb, var(--success-color, #43a047) 18%, transparent); color: var(--success-color, #43a047); }
    .type-skipped { background: color-mix(in srgb, var(--secondary-text-color) 15%, transparent); color: var(--secondary-text-color); }
    .type-missed { background: color-mix(in srgb, var(--error-color, #db4437) 15%, transparent); color: var(--error-color, #db4437); }
    .type-reset { background: color-mix(in srgb, var(--info-color, #039be5) 15%, transparent); color: var(--info-color, #039be5); }
    .task-link {
      background: none; border: none; padding: 0; cursor: pointer;
      color: var(--primary-text-color); font: inherit; font-weight: 500;
    }
    .task-link:hover { color: var(--primary-color); text-decoration: underline; }
    .facts { display: inline-flex; gap: 10px; color: var(--secondary-text-color); white-space: nowrap; }
    .notes {
      flex: 1 1 100%; color: var(--secondary-text-color);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      padding-left: 94px;
    }
    .more { margin-top: 6px; }
    .totals {
      margin-top: 10px; font-size: 13px; color: var(--secondary-text-color);
      display: flex; justify-content: flex-end; gap: 6px;
    }
    .totals strong { color: var(--primary-text-color); }
    .cap-note { margin: 8px 0 0; font-size: 11px; color: var(--secondary-text-color); }
    .empty { color: var(--secondary-text-color); font-style: italic; font-size: 13px; }
    @media (max-width: 640px) {
      .notes { padding-left: 0; }
    }
  `;
}

if (!customElements.get("maintenance-object-history-section")) {
  customElements.define("maintenance-object-history-section", MaintenanceObjectHistorySection);
}
