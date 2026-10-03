/** <maintenance-area-view> (#191) — one Home Assistant area across all its
 * objects: the object lifecycle history (#138) and the object's cost
 * figures, lifted one level up. Date range (default: the last twelve
 * months; one chip per calendar year for the annual overview), object and
 * task filters; key figures, cost over time, cost per object, the merged
 * history of every object, and a printable area report (PDF).
 *
 * LIGHT DOM like <maintenance-task-detail-view>: the panel's kpi / table /
 * filter styles apply and follow the panel's narrow layout. Events:
 * `open-object` {entryId}, `open-task` {entryId, taskId}.
 */

import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import {
  t,
  ensureLocale,
  langOf,
  formatCost,
  formatDate,
  formatDateTime,
  formatDuration,
  formatNumber,
  monthName,
  STATUS_COLORS,
  STATUS_ICONS,
} from "../styles";
import { FullHistoryLoader } from "../helpers/full-history";
import {
  areaDisplayName,
  areaIcon,
  areaTotals,
  calendarYear,
  costBuckets,
  costByObject,
  filterAreaHistory,
  historyYears,
  lastTwelveMonths,
  mergeAreaHistory,
  objectsInArea,
  type AreaHistoryEntry,
  type CostBucket,
} from "../helpers/area-history";
import { buildAreaRecordHtml, type AreaRecordLabels } from "../helpers/area-record";
import { haToday, stampDate } from "../helpers/ha-time";
import { historyNoteText } from "../helpers/history-note";
import { openHtmlInNewTab, preopenTab } from "../helpers/document-url";
import "./ms-date-field";
import type { HomeAssistant, MaintenanceObjectResponse } from "../types";

/** Rows of the merged history shown before "Show all". */
const HISTORY_PAGE = 25;
/** Year chips offered besides "last 12 months" / "all time". */
const MAX_YEAR_CHIPS = 5;

/** Entry-type marker colours — the status palette's meaning, not new hues. */
const TYPE_COLORS: Record<string, string> = {
  completed: STATUS_COLORS.ok,
  missed: STATUS_COLORS.overdue,
  reset: STATUS_COLORS.paused,
  skipped: "var(--secondary-text-color)",
};

export class MaintenanceAreaView extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  /** HA area id, or helpers/area-history NO_AREA for the "No area" bucket. */
  @property() public areaKey = "";
  @property({ attribute: false }) public objects: MaintenanceObjectResponse[] = [];
  @property({ type: Boolean }) public showArchived = false;
  @property() public currencySymbol = "";
  /** Resolves a user id to a display name; null leaves the credit out (a
   *  raw UUID on a printed report is noise). */
  @property({ attribute: false }) public userName: (id: string) => string | null = () => null;

  @state() private _from = "";
  @state() private _to = "";
  @state() private _entryFilter = "";
  @state() private _taskQuery = "";
  @state() private _expanded = false;
  @state() private _printing = false;

  private readonly _histories = new FullHistoryLoader(this);
  private _localeReady = false;
  private _filtersFor: string | null = null;
  private _memo: { deps: unknown[]; entries: AreaHistoryEntry[] } | null = null;

  protected createRenderRoot(): HTMLElement {
    return this;
  }

  private get _lang(): string {
    return langOf(this.hass);
  }

  protected willUpdate(changed: Map<string, unknown>): void {
    super.willUpdate(changed);
    // A different area starts over: default range, no object/task filter.
    if (changed.has("areaKey") && this._filtersFor !== this.areaKey) {
      this._filtersFor = this.areaKey;
      const range = lastTwelveMonths();
      this._from = range.from;
      this._to = range.to;
      this._entryFilter = "";
      this._taskQuery = "";
      this._expanded = false;
    }
    // Data changes only (hass is re-assigned on every HA state change); in
    // willUpdate, so the "Loading…" state lands in this very render.
    if (changed.has("objects") || changed.has("areaKey") || changed.has("showArchived") || (changed.has("hass") && changed.get("hass") === undefined)) {
      const refs = this._areaObjects().flatMap((o) => o.tasks.map((task) => ({ entryId: o.entry_id, task })));
      void this._histories.sync(this.hass, refs);
    }
  }

  protected updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    if (!this._localeReady && this.hass) {
      this._localeReady = true;
      void ensureLocale(this._lang).then(() => this.requestUpdate());
    }
  }

  private _areaObjects(): MaintenanceObjectResponse[] {
    return objectsInArea(this.objects, this.areaKey, this.showArchived).sort((a, b) => a.object.name.localeCompare(b.object.name));
  }

  /** Every entry of the area, recomputed only when its inputs change (the
   *  panel re-renders on every hass update). */
  private _entries(objects: MaintenanceObjectResponse[]): AreaHistoryEntry[] {
    const deps: unknown[] = [this.objects, this.areaKey, this.showArchived, this._histories.version];
    if (this._memo && this._memo.deps.every((d, i) => d === deps[i])) return this._memo.entries;
    const entries = mergeAreaHistory(objects, (entryId, task) => this._histories.historyOf(entryId, task));
    this._memo = { deps, entries };
    return entries;
  }

  /** Everything the page and the printed report show for the current
   *  filters — one derivation, so screen and paper cannot disagree. */
  private _figures() {
    const objects = this._areaObjects();
    const entries = this._entries(objects);
    const range = { from: this._from || null, to: this._to || null };
    const filtered = filterAreaHistory(entries, { ...range, entryId: this._entryFilter || null, taskQuery: this._taskQuery });
    const shownObjects = this._entryFilter ? objects.filter((o) => o.entry_id === this._entryFilter) : objects;
    return {
      objects,
      entries,
      filtered,
      totals: areaTotals(filtered),
      buckets: costBuckets(filtered, range),
      byObject: costByObject(filtered, shownObjects),
    };
  }

  private _setRange(range: { from: string; to: string }): void {
    this._from = range.from;
    this._to = range.to;
    this._expanded = false;
  }

  private _openObject(entryId: string): void {
    this.dispatchEvent(new CustomEvent("open-object", { detail: { entryId }, bubbles: true, composed: true }));
  }

  private _openTask(entryId: string, taskId: string): void {
    this.dispatchEvent(new CustomEvent("open-task", { detail: { entryId, taskId }, bubbles: true, composed: true }));
  }

  private _bucketLabel(b: CostBucket, style: "long" | "short"): string {
    return b.month == null ? String(b.year) : `${monthName(b.month, this._lang, style)} ${b.year}`;
  }

  private _countText(key: string, oneKey: string, n: number): string {
    const L = this._lang;
    return n === 1 ? t(oneKey, L) : t(key, L).replace("{n}", formatNumber(n, L));
  }

  /** The printable area report. The tab opens in the click's synchronous
   *  part (a window.open after an await is no gesture any more — popup
   *  blockers swallowed the booklet, bug audit 2026-09-26 #2); the report
   *  waits for the full histories so it never goes out with only the list
   *  window. */
  private async _print(): Promise<void> {
    if (this._printing) return;
    const tab = preopenTab();
    this._printing = true;
    try {
      await this._histories.settled();
    } finally {
      this._printing = false;
    }
    const L = this._lang;
    const cur = this.currencySymbol;
    const { filtered, totals, buckets, byObject } = this._figures();
    const labels: AreaRecordLabels = {
      title: t("area_report_title", L),
      generated: t("report_generated", L),
      period: t("area_report_period", L),
      completions: t("area_kpi_completions", L),
      totalCost: t("total_cost", L),
      avgCost: t("avg_cost", L),
      totalTime: t("area_kpi_total_time", L),
      costPerObject: t("area_cost_per_object", L),
      costPerBucket: buckets.unit === "month" ? t("area_cost_per_month", L) : t("area_cost_per_year", L),
      share: t("area_cost_share", L),
      historyHeading: t("area_history_section", L),
      colDate: t("date", L),
      colObject: t("object", L),
      colTask: t("task_name", L),
      colCost: t("cost", L),
      colDuration: t("duration", L),
      colNotes: t("notes_label", L),
      completedBy: t("completed_by", L),
      capNote: t("object_history_cap_note", L),
      none: "—",
    };
    const completed = filtered.filter((e) => e.type === "completed");
    const printable = filtered.map((e) => ({
      ...e,
      completedBy: e.completedBy ? this.userName(e.completedBy) : null,
      notes: e.notes ? historyNoteText(e.notes, L) : null,
    }));
    const doc = buildAreaRecordHtml(
      {
        areaName: areaDisplayName(this.areaKey, this.hass?.areas, t("no_area", L)),
        // An open range prints what it covered: the oldest completion shown
        // (filtered is newest first) up to today — HA calendar days, the
        // ones the totals are counted in.
        from: this._from || stampDate(completed[completed.length - 1]?.timestamp) || null,
        to: this._to || haToday(),
        totals,
        byObject,
        buckets,
        entries: printable,
        capped: this._histories.capped,
      },
      labels,
      {
        date: (iso) => formatDate(iso, L),
        cost: (amount) => formatCost(amount, cur, L),
        duration: (minutes) => formatDuration(minutes, L),
        bucket: (b) => this._bucketLabel(b, "long"),
        share: (fraction) => `${formatNumber(fraction * 100, L, 0)} %`,
        number: (n) => formatNumber(n, L),
      },
      new Date().toISOString(),
    );
    openHtmlInNewTab(doc, tab);
  }

  private _renderRangeChips(entries: AreaHistoryEntry[]) {
    const L = this._lang;
    const today = haToday();
    const twelve = lastTwelveMonths(today);
    const isRange = (r: { from: string; to: string }) => this._from === r.from && this._to === r.to;
    const years = historyYears(entries, Number(today.slice(0, 4))).slice(0, MAX_YEAR_CHIPS);
    return html`
      <div class="filter-chips area-range-chips">
        <button class="filter-chip ${isRange(twelve) ? "active" : ""}" @click=${() => this._setRange(lastTwelveMonths())}>
          ${t("area_range_12m", L)}
        </button>
        ${years.map((y) => html`
          <button class="filter-chip ${isRange(calendarYear(y)) ? "active" : ""}" @click=${() => this._setRange(calendarYear(y))}>${y}</button>
        `)}
        <button class="filter-chip ${!this._from && !this._to ? "active" : ""}" @click=${() => this._setRange({ from: "", to: "" })}>
          ${t("area_range_all", L)}
        </button>
      </div>
    `;
  }

  private _renderChart(buckets: CostBucket[]) {
    const L = this._lang;
    const cur = this.currencySymbol;
    const max = buckets.reduce((m, b) => Math.max(m, b.cost), 0);
    // A month whose credits (#200) outweigh its spending dips below a zero
    // line; without one the zero line is the baseline, as it always was.
    const min = buckets.reduce((m, b) => Math.min(m, b.cost), 0);
    if (max <= 0 && min >= 0) return html`<p class="area-empty">${t("area_no_costs", L)}</p>`;
    const pct = (v: number) => Math.round((v / (max - min)) * 1000) / 10;
    // At most ~12 axis labels, whatever the range — a phone has room for no
    // more; every bar keeps its own tooltip. A label spans the `every` bars
    // it stands for (flex-grow), so it never spills over its neighbours.
    const every = Math.max(1, Math.ceil(buckets.length / 12));
    const labelled = buckets.map((b, i) => ({ b, i })).filter(({ i }) => i % every === 0);
    return html`
      <div class="area-chart">
        <div class="area-chart-max">${formatCost(max, cur, L)}</div>
        <div class="area-chart-bars">
          ${min < 0 ? html`<div class="area-chart-zero" style="bottom: ${pct(-min)}%"></div>` : nothing}
          ${buckets.map((b) => {
            const tip = `${this._bucketLabel(b, "long")}: ${formatCost(b.cost, cur, L)} · ${t("area_kpi_completions", L)}: ${formatNumber(b.completions, L)}`;
            // An empty month is an empty slot, not a 1px stub on the baseline.
            // A bar stands on the zero line; a credit hangs from it.
            const lift = b.cost < 0 ? pct(b.cost - min) : pct(-min);
            return html`<div class="area-bar" title=${tip} aria-label=${tip}>
              ${b.cost !== 0
                ? html`<div class="area-bar-fill ${b.cost < 0 ? "credit" : ""}" style="height: ${pct(Math.abs(b.cost))}%${lift ? `; bottom: ${lift}%` : ""}"></div>`
                : nothing}
            </div>`;
          })}
        </div>
        ${min < 0 ? html`<div class="area-chart-min">${formatCost(min, cur, L)}</div>` : nothing}
        <div class="area-chart-axis ${every > 1 ? "grouped" : ""}">
          ${labelled.map(({ b, i }) => html`<span class="area-bar-label" style="flex-grow: ${Math.min(every, buckets.length - i)}">${b.month == null
            ? String(b.year)
            : html`${monthName(b.month, L, "short")}${b.month === 0 || i === 0 ? html`<br />${b.year}` : nothing}`}</span>`)}
        </div>
      </div>
    `;
  }

  protected render(): unknown {
    if (!this.hass || !this.areaKey) return nothing;
    const L = this._lang;
    const cur = this.currencySymbol;
    const { objects, entries, filtered, totals, buckets, byObject } = this._figures();
    const taskCount = objects.reduce((n, o) => n + o.tasks.filter((task) => this.showArchived || !task.archived).length, 0);
    const shown = this._expanded ? filtered : filtered.slice(0, HISTORY_PAGE);

    return html`
      <div class="detail-section area-view">
        <div class="detail-header">
          <h2 class="area-title">
            <ha-icon .icon=${areaIcon(this.areaKey, this.hass.areas)}></ha-icon>
            ${areaDisplayName(this.areaKey, this.hass.areas, t("no_area", L))}
          </h2>
          <div class="action-buttons">
            <ha-button appearance="plain" class="area-print" .disabled=${this._printing} @click=${() => this._print()}>
              <ha-icon icon="mdi:printer-outline"></ha-icon>
              ${this._printing ? t("loading", L) : t("area_report_print", L)}
            </ha-button>
          </div>
        </div>
        <p class="meta">
          ${this._countText("area_object_count", "area_object_count_one", objects.length)} ·
          ${this._countText("templates_task_count", "templates_task_count_one", taskCount)}
          ${this._histories.loading ? html` · <span class="area-loading">${t("loading", L)}</span>` : nothing}
        </p>

        ${this._renderRangeChips(entries)}
        <div class="filter-bar area-filters">
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
          <label class="filter-field">
            <span class="filter-label">${t("object", L)}</span>
            <select class="area-object-filter" .value=${this._entryFilter}
              @change=${(e: Event) => { this._entryFilter = (e.target as HTMLSelectElement).value; }}>
              <option value="" ?selected=${!this._entryFilter}>${t("all_objects", L)}</option>
              ${objects.map((o) => html`<option value=${o.entry_id} ?selected=${o.entry_id === this._entryFilter}>${o.object.name}</option>`)}
            </select>
          </label>
          <input
            type="search"
            class="search-input area-task-filter"
            aria-label=${t("area_task_filter", L)}
            placeholder=${t("area_task_filter", L)}
            .value=${this._taskQuery}
            @input=${(e: Event) => { this._taskQuery = (e.target as HTMLInputElement).value; }}
          />
        </div>

        <div class="kpi-bar area-kpis">
          <div class="kpi-card">
            <div class="kpi-label">${t("area_kpi_completions", L)}</div>
            <div class="kpi-value-large area-kpi-completions">${formatNumber(totals.completions, L)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">${t("total_cost", L)}</div>
            <div class="kpi-value-large area-kpi-cost">${formatCost(totals.totalCost, cur, L)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">${t("avg_cost", L)}</div>
            <div class="kpi-value-large">${totals.avgCost != null ? formatCost(totals.avgCost, cur, L) : "—"}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">${t("area_kpi_total_time", L)}</div>
            <div class="kpi-value-large">${totals.totalDuration ? formatDuration(totals.totalDuration, L) : "—"}</div>
          </div>
        </div>

        <h3>${buckets.unit === "month" ? t("area_cost_per_month", L) : t("area_cost_per_year", L)}</h3>
        ${this._renderChart(buckets.buckets)}

        <h3>${t("area_cost_per_object", L)}</h3>
        <div class="objects-table-wrap">
          <table class="objects-table area-object-table">
            <thead>
              <tr>
                <th>${t("object", L)}</th>
                <th class="num">${t("area_kpi_completions", L)}</th>
                <th class="num">${t("cost", L)}</th>
                <th class="num">${t("area_cost_share", L)}</th>
              </tr>
            </thead>
            <tbody>
              ${byObject.map((r) => html`
                <tr class="objects-table-row" @click=${() => this._openObject(r.entryId)}>
                  <td><span class="objects-table-name">${r.objectName}</span></td>
                  <td class="num">${formatNumber(r.completions, L)}</td>
                  <td class="num">${formatCost(r.cost, cur, L)}</td>
                  <td class="num">
                    <span class="area-share"><span class="area-share-fill" style="width: ${Math.round(r.share * 100)}%"></span></span>
                    ${formatNumber(r.share * 100, L, 0)} %
                  </td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>

        <h3>
          ${t("area_history_section", L)}
          <span class="area-count">${formatNumber(filtered.length, L)}</span>
        </h3>
        ${filtered.length === 0
          ? html`<p class="area-empty">${t("object_history_empty", L)}</p>`
          : html`
            <div class="objects-table-wrap">
              <table class="objects-table area-history-table">
                <thead>
                  <tr>
                    <th>${t("date", L)}</th>
                    <th></th>
                    <th>${t("object", L)}</th>
                    <th>${t("task_name", L)}</th>
                    <th class="num">${t("cost", L)}</th>
                    <th class="num">${t("duration", L)}</th>
                    <th>${t("notes_label", L)}</th>
                  </tr>
                </thead>
                <tbody>
                  ${shown.map((e) => {
                    const notes = e.notes ? historyNoteText(e.notes, L) : "";
                    return html`
                      <tr class="objects-table-row area-history-row" @click=${() => this._openTask(e.entryId, e.taskId)}>
                        <td title=${formatDateTime(e.timestamp, L)}>${formatDate(e.timestamp, L)}</td>
                        <td>
                          <span class="area-entry-type" style="color: ${TYPE_COLORS[e.type] ?? "inherit"}">
                            <ha-icon .icon=${STATUS_ICONS[e.type] || "mdi:circle"}></ha-icon>${t(e.type, L)}
                          </span>
                        </td>
                        <td>
                          <button class="area-object-link" @click=${(ev: Event) => { ev.stopPropagation(); this._openObject(e.entryId); }}>
                            ${e.objectName}
                          </button>
                        </td>
                        <td><button class="area-task-link">${e.taskName}${e.phaseName ? ` · ${e.phaseName}` : ""}</button></td>
                        <td class="num">${e.cost != null ? formatCost(e.cost, cur, L) : "—"}</td>
                        <td class="num">${e.duration != null ? formatDuration(e.duration, L) : "—"}</td>
                        <td class="oc-notes" title=${notes}>${notes || "—"}</td>
                      </tr>
                    `;
                  })}
                </tbody>
              </table>
            </div>
            ${filtered.length > shown.length
              ? html`<ha-button appearance="plain" class="area-more" @click=${() => { this._expanded = true; }}>
                  ${t("show_all", L)} (${formatNumber(filtered.length, L)})
                </ha-button>`
              : nothing}
          `}
        ${this._histories.capped ? html`<p class="area-cap-note">${t("object_history_cap_note", L)}</p>` : nothing}
      </div>
    `;
  }
}

if (!customElements.get("maintenance-area-view")) {
  customElements.define("maintenance-area-view", MaintenanceAreaView);
}
