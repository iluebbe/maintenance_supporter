/** <maintenance-areas-view> (#191) — the areas page, a sibling of All
 * objects / All parts: one row per Home Assistant area that holds objects
 * (plus a "No area" bucket), with counts, this year's and all-time cost and
 * the last completion. Text filter, sortable columns (remembered per
 * browser); a row opens the area (`open-area`).
 *
 * Renders into LIGHT DOM like <maintenance-task-detail-view>: it lives in
 * the panel's shadow root, so the panel's table / filter-bar styles apply
 * and the narrow rules (`:host([narrow])`) follow the panel.
 *
 * Costs come from the task histories: the list payload carries a window of
 * each; the few tasks whose window is not their whole history are fetched
 * in full (helpers/full-history) and the figures settle once they land.
 */

import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t, ensureLocale, langOf, formatCost, formatDate, formatNumber } from "../styles";
import { FullHistoryLoader } from "../helpers/full-history";
import {
  filterAreas,
  nextAreaSort,
  parseAreaSort,
  sortAreas,
  summarizeAreas,
  type AreaSort,
  type AreaSortKey,
  type AreaSummary,
} from "../helpers/area-history";
import { LS_KEYS, lsGet, lsSet } from "../helpers/storage-keys";
import type { HomeAssistant, MaintenanceObjectResponse } from "../types";

/** The table's columns: sort key, header label key, numeric alignment. */
const COLUMNS: ReadonlyArray<{ key: AreaSortKey; label: string; num: boolean }> = [
  { key: "name", label: "area", num: false },
  { key: "objects", label: "objects", num: true },
  { key: "tasks", label: "tasks", num: true },
  { key: "overdue", label: "overdue", num: true },
  { key: "due_soon", label: "due_soon", num: true },
  { key: "cost_year", label: "area_cost_year", num: true },
  { key: "cost_total", label: "total_cost", num: true },
  { key: "last", label: "last_performed", num: false },
];

export class MaintenanceAreasView extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public objects: MaintenanceObjectResponse[] = [];
  /** The panel's shared show-archived toggle (All objects convention). */
  @property({ type: Boolean }) public showArchived = false;
  @property() public currencySymbol = "";

  @state() private _query = "";
  @state() private _sort: AreaSort = parseAreaSort(lsGet(LS_KEYS.areaSort));

  private readonly _histories = new FullHistoryLoader(this);
  private _localeReady = false;
  private _memo: { deps: unknown[]; rows: AreaSummary[] } | null = null;

  protected createRenderRoot(): HTMLElement {
    return this;
  }

  private get _lang(): string {
    return langOf(this.hass);
  }

  protected willUpdate(changed: Map<string, unknown>): void {
    super.willUpdate(changed);
    // Only when the data changes — hass is re-assigned on every state
    // change in HA, and the signatures are not free on a big install. In
    // willUpdate, so the "Loading…" state lands in this very render.
    if (changed.has("objects") || changed.has("showArchived") || (changed.has("hass") && changed.get("hass") === undefined)) {
      const refs = this.objects
        .filter((o) => this.showArchived || !o.object.archived)
        .flatMap((o) => o.tasks.map((task) => ({ entryId: o.entry_id, task })));
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

  /** The summaries, recomputed only when their inputs change. */
  private _rows(year: number): AreaSummary[] {
    const L = this._lang;
    const deps: unknown[] = [this.objects, this.showArchived, this._histories.version, this.hass?.areas, L, year];
    if (this._memo && this._memo.deps.every((d, i) => d === deps[i])) return this._memo.rows;
    const rows = summarizeAreas(this.objects, {
      showArchived: this.showArchived,
      areas: this.hass?.areas,
      noAreaLabel: t("no_area", L),
      year,
      historyOf: (entryId, task) => this._histories.historyOf(entryId, task),
    });
    this._memo = { deps, rows };
    return rows;
  }

  private _setSort(key: AreaSortKey): void {
    this._sort = nextAreaSort(this._sort, key);
    lsSet(LS_KEYS.areaSort, `${this._sort.key}:${this._sort.dir}`);
  }

  private _open(areaKey: string): void {
    this.dispatchEvent(new CustomEvent("open-area", { detail: { areaKey }, bubbles: true, composed: true }));
  }

  private _toggleArchived(): void {
    this.dispatchEvent(new CustomEvent("archived-toggle", { bubbles: true, composed: true }));
  }

  private _headerLabel(label: string, year: number, L: string): string {
    return label === "area_cost_year" ? t("area_cost_year", L).replace("{year}", String(year)) : t(label, L);
  }

  protected render(): unknown {
    if (!this.hass) return nothing;
    const L = this._lang;
    const year = new Date().getFullYear();
    const cur = this.currencySymbol;
    const all = this._rows(year);
    const rows = sortAreas(filterAreas(all, this._query), this._sort);
    const archivedCount = this.objects.filter((o) => o.object.archived).length;
    const num = (n: number) => formatNumber(n, L);

    return html`
      <div class="filter-bar area-filter-bar">
        <input
          type="search"
          class="search-input"
          aria-label=${t("areas_filter", L)}
          placeholder=${t("areas_filter", L)}
          .value=${this._query}
          @input=${(e: Event) => { this._query = (e.target as HTMLInputElement).value; }}
        />
        ${this._histories.loading ? html`<span class="area-loading">${t("loading", L)}</span>` : nothing}
        ${archivedCount > 0
          ? html`<ha-button class="archived-toggle ${this.showArchived ? "active" : ""}" @click=${() => this._toggleArchived()}>
              <ha-icon icon="mdi:archive-outline"></ha-icon>
              ${this.showArchived ? t("hide_archived", L) : `${t("show_archived", L)} (${archivedCount})`}
            </ha-button>`
          : nothing}
      </div>
      ${all.length === 0
        ? html`<div class="empty-state">${t("no_objects", L)}</div>`
        : rows.length === 0
        ? html`<div class="empty-state">${t("areas_filter_none", L)}</div>`
        : html`
          <div class="objects-table-wrap">
            <table class="objects-table areas-table">
              <thead>
                <tr>
                  ${COLUMNS.map((c) => {
                    const active = this._sort.key === c.key;
                    return html`<th class=${c.num ? "num" : ""}
                      aria-sort=${active ? (this._sort.dir === "asc" ? "ascending" : "descending") : "none"}>
                      <button class="area-sort ${active ? "active" : ""}" title=${t("sort_label", L)} @click=${() => this._setSort(c.key)}>
                        ${this._headerLabel(c.label, year, L)}
                        ${active
                          ? html`<ha-icon icon=${this._sort.dir === "asc" ? "mdi:arrow-up" : "mdi:arrow-down"}></ha-icon>`
                          : nothing}
                      </button>
                    </th>`;
                  })}
                </tr>
              </thead>
              <tbody>
                ${rows.map((r) => html`
                  <tr class="objects-table-row" tabindex="0"
                    @click=${() => this._open(r.key)}
                    @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") this._open(r.key); }}>
                    <td>
                      <ha-icon class="area-row-icon" .icon=${r.icon}></ha-icon>
                      <span class="objects-table-name">${r.name}</span>
                    </td>
                    <td class="num">${num(r.objects)}</td>
                    <td class="num">${num(r.tasks)}</td>
                    <td class="num">${r.overdue ? html`<span class="area-count overdue">${num(r.overdue)}</span>` : num(0)}</td>
                    <td class="num">${r.dueSoon ? html`<span class="area-count due-soon">${num(r.dueSoon)}</span>` : num(0)}</td>
                    <td class="num">${formatCost(r.costYear, cur, L)}</td>
                    <td class="num">${formatCost(r.costTotal, cur, L)}</td>
                    <td>${r.lastCompletion ? formatDate(r.lastCompletion, L) : "—"}</td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `}
    `;
  }
}

if (!customElements.get("maintenance-areas-view")) {
  customElements.define("maintenance-areas-view", MaintenanceAreasView);
}
