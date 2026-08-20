/** Battery-fleet detail section, rendered inside the single "Replace low
 *  batteries" task's overview tab (task.battery_fleet_task). Self-contained:
 *  fetches the live aggregate over Battery Notes and offers the mark-replaced
 *  action — the fleet's one surface, instead of 30-70 per-battery tasks. */

import { css, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { t, ensureLocale, langOf } from "../styles";
import { LS_KEYS, lsGet, lsSet } from "../helpers/storage-keys";
import { describeWsError } from "../ws-errors";
import type { HomeAssistant } from "../types";

interface BatteryRow {
  entity_id: string;
  device_name: string;
  battery_type: string;
  quantity: number;
  level: number | null;
  days_until: number | null;
  available?: boolean;
  /** Where the ~date comes from: "trend" (discharge regression) or "typical"
   *  (type-lifetime table). */
  predicted_source?: "trend" | "typical";
  prediction_confidence?: "medium" | "high" | null;
  /** Charged, never bought — the row never feeds the shopping groupings and
   *  a ~date only appears when the discharge trend earned one. */
  rechargeable?: boolean;
  /** This battery's own low threshold (Battery Notes' configured value or
   *  the fleet floor, whichever is higher) — the level bar colors against
   *  it, not against a fixed 20 %. */
  low_threshold?: number;
  /** B1: the predicted date has passed while the battery still reports
   *  healthy. Never escalates to low/task — the row just shows the
   *  discrepancy (usual cause: an unrecorded swap). */
  forecast_overdue?: boolean;
}
interface RosterRow extends BatteryRow {
  status: "low" | "soon" | "ok";
}
/** 30 d downsampled level history per battery, for the roster sparklines.
 *  threshold = the same low threshold the trend forecast regresses toward,
 *  so the dotted projection ends exactly where the ~date comes from.
 *  jump = an upward step that looks like a swap nobody recorded in Battery
 *  Notes (the forecast still anchors on the dead battery's date) — with the
 *  device to call `battery_notes.set_battery_replaced` on. */
type HistorySeries = Record<
  string,
  {
    points: [number, number][];
    threshold: number;
    jump?: { at: number; from: number; to: number; device_id: string };
  }
>;
interface Overview {
  available: boolean;
  configured: boolean;
  task_ok?: boolean;
  total: number;
  low: BatteryRow[];
  soon: BatteryRow[];
  // Every tracked battery, whatever its state. Optional so an older backend
  // simply renders no roster instead of throwing.
  all?: RosterRow[];
  needs_now: Record<string, number>;
  needs_soon: Record<string, number>;
  types: string[];
  excluded?: { entity_id: string; device_name: string }[];
  // #135 follow-up: fleet-wide "track self-charging devices" opt-in.
  track_self_charging?: boolean;
}

export class MaintenanceBatteryFleetSection extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _ov: Overview | null = null;
  @state() private _loading = false;
  @state() private _marking = false;
  @state() private _error = "";
  @state() private _history: HistorySeries | null = null;
  // Urgency by default (issue #123: "soon sat in the middle of the list");
  // the choice is remembered per browser.
  @state() private _rosterSort: "name" | "urgency" = MaintenanceBatteryFleetSection._storedSort();
  @state() private _typeFilter: string | null = null;
  @state() private _recorded: string[] = [];
  private _historyRequested = false;
  private _localeReady = false;

  private get _lang(): string {
    return langOf(this.hass);
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.hass) this._load();
  }

  updated(changed: Map<string, unknown>): void {
    if (changed.has("hass") && this.hass && !this._localeReady) {
      this._localeReady = true;
      ensureLocale(this._lang).then(() => this.requestUpdate());
      if (this._ov === null && !this._loading) this._load();
    }
  }

  private async _load(): Promise<void> {
    this._loading = true;
    this._error = "";
    try {
      this._ov = await this.hass.connection.sendMessagePromise<Overview>({
        type: "maintenance_supporter/battery_fleet/overview",
      });
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._loading = false;
    }
  }

  private _markAll = async (): Promise<void> => {
    await this._mark(undefined);
  };

  // Re-runs the idempotent setup, which restores the fleet task's trigger
  // when a user edit wiped it (issue #106) or recreates a deleted task.
  private _repair = async (): Promise<void> => {
    if (this._marking) return;
    this._marking = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/battery_fleet/setup",
        language: this._lang,
      });
      await this._load();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._marking = false;
    }
  };

  private async _mark(entityIds: string[] | undefined): Promise<void> {
    if (this._marking) return;
    this._marking = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/battery_fleet/mark_replaced",
        ...(entityIds ? { entity_ids: entityIds } : {}),
      });
      await this._load();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._marking = false;
    }
  }

  // Manual exclude/include (#107): a rechargeable device the heuristics
  // missed (or any battery the user never wants tracked) leaves the fleet;
  // the restore list below the section brings it back.
  private async _setExcluded(entityId: string, excluded: boolean): Promise<void> {
    if (this._marking) return;
    this._marking = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/battery_fleet/set_excluded",
        entity_id: entityId,
        excluded,
      });
      await this._load();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._marking = false;
    }
  }

  // #135: manually ADD a battery the discovery heuristics missed. The
  // include bypasses the name/% heuristic and the self-charging filter
  // server-side; picking an entity acts immediately (no extra button).
  private async _addBattery(e: CustomEvent<{ value?: string }>): Promise<void> {
    const entityId = e.detail?.value;
    if (!entityId || this._marking) return;
    this._marking = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/battery_fleet/set_included",
        entity_id: entityId,
        included: true,
      });
      await this._load();
    } catch (e2) {
      this._error = describeWsError(e2, this._lang);
    } finally {
      this._marking = false;
    }
  }

  // #135 follow-up: fleet-wide opt-in that keeps self-charging devices
  // (phones, vacuums, smart rings) in the roster as rechargeables.
  private async _setTrackSelf(e: Event): Promise<void> {
    const enabled = (e.target as HTMLInputElement).checked;
    if (this._marking) return;
    this._marking = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/battery_fleet/set_track_self_charging",
        enabled,
      });
      await this._load();
    } catch (e2) {
      this._error = describeWsError(e2, this._lang);
    } finally {
      this._marking = false;
    }
  }

  /** Lazy: the recorder-backed history is fetched once, when the roster is
   *  first expanded — most panel visits never open it. */
  private _loadHistory = async (e: Event): Promise<void> => {
    if (!(e.target as HTMLDetailsElement).open || this._historyRequested) return;
    this._historyRequested = true;
    try {
      const res = await this.hass.connection.sendMessagePromise<{ series: HistorySeries }>({
        type: "maintenance_supporter/battery_fleet/overview_history",
      });
      this._history = res.series;
    } catch {
      this._history = null; // sparklines are an enhancement — rows render without them
    }
  };

  /** Inline-SVG sparkline: 30 d level line, a faint threshold line, and —
   *  where the ~date comes from the discharge trend — a dotted projection
   *  from the last reading down to the threshold, so the date is visible
   *  instead of merely stated. */
  private _sparkline(b: RosterRow) {
    const h = this._history?.[b.entity_id];
    if (!h || h.points.length < 2) return nothing;
    const W = 110, H = 24, P = 2;
    const t0 = h.points[0][0];
    const tLast = h.points[h.points.length - 1][0];
    const nowSec = Date.now() / 1000;
    const projEnd =
      b.status !== "low" && b.predicted_source === "trend" && b.days_until != null
        ? nowSec + b.days_until * 86400
        : null;
    const tMax = Math.max(tLast, projEnd ?? tLast);
    const x = (t: number) => (tMax === t0 ? P : P + ((t - t0) / (tMax - t0)) * (W - 2 * P));
    const y = (v: number) => P + (1 - Math.min(100, Math.max(0, v)) / 100) * (H - 2 * P);
    const line = h.points.map(([t, v]) => `${x(t).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    const vLast = h.points[h.points.length - 1][1];
    const yTh = y(h.threshold).toFixed(1);
    return html`<svg
      class="bf-spark"
      viewBox="0 0 ${W} ${H}"
      role="img"
      aria-label=${t("battery_fleet_sparkline_hint", this._lang)}
    >
      <title>${t("battery_fleet_sparkline_hint", this._lang)}</title>
      <line class="bf-spark-th" x1="0" y1=${yTh} x2=${W} y2=${yTh}></line>
      <polyline class="bf-spark-line" points=${line}></polyline>
      ${projEnd !== null
        ? html`<line
            class="bf-spark-proj"
            x1=${x(tLast).toFixed(1)}
            y1=${y(vLast).toFixed(1)}
            x2=${x(projEnd).toFixed(1)}
            y2=${yTh}
          ></line>`
        : nothing}
    </svg>`;
  }

  private static _storedSort(): "name" | "urgency" {
    return lsGet(LS_KEYS.batteryRosterSort) === "name" ? "name" : "urgency";
  }

  private _setSort(mode: "name" | "urgency"): void {
    this._rosterSort = mode;
    // Storage may be unavailable — the toggle still works for this visit.
    lsSet(LS_KEYS.batteryRosterSort, mode);
  }

  /** Urgency (the default, issue #123): low rows first — emptiest first —
   *  then the soonest forecast, dateless rows last. Name mode keeps the
   *  alphabetical lookup list. */
  private _sortedRoster(rows: RosterRow[]): RosterRow[] {
    const filtered = this._typeFilter === null ? rows : rows.filter((r) => r.battery_type === this._typeFilter);
    if (this._rosterSort === "name") return filtered;
    // Low rows rank far below everything and among themselves by LEVEL
    // ascending (a 6 % battery before an 18 % one); the rest by days-until.
    const rank = (r: RosterRow) => (r.status === "low" ? -1000 + (r.level ?? 101) / 101 : (r.days_until ?? Infinity));
    return [...filtered].sort(
      (a, b) => rank(a) - rank(b) || a.device_name.localeCompare(b.device_name),
    );
  }

  /** The forecast as a date a person can plan with, not a day count.
   *  `days_until` comes from last-replaced + typical lifetime, so it is an
   *  estimate — the tilde in the template says so. Negative values (past the
   *  typical lifetime but not reported low yet) render as past dates, which
   *  is honest: the battery is living on borrowed time. */
  private _predictedDate(daysUntil: number): string {
    return this._fmtDate(Date.now() + daysUntil * 864e5);
  }

  private _fmtDate(epochMs: number): string {
    return new Intl.DateTimeFormat(this._lang, { day: "numeric", month: "numeric", year: "numeric" }).format(new Date(epochMs));
  }

  /** The grouped shopping quantities as CLICKABLE chips: a type filters the
   *  roster to the devices that need it — "which devices need those 4× AAA?"
   *  without scanning. Clicking the active chip clears the filter. */
  private _shoppingLine(needs: Record<string, number>) {
    return Object.entries(needs).map(
      ([type, qty]) => html`<button
        class="bf-type-chip ${this._typeFilter === type ? "bf-type-chip-active" : ""}"
        title=${t("battery_fleet_filter_type", this._lang)}
        @click=${() => this._toggleTypeFilter(type)}
      >
        ${qty}× ${type}
      </button>`,
    );
  }

  private _toggleTypeFilter(type: string): void {
    this._typeFilter = this._typeFilter === type ? null : type;
    if (this._typeFilter !== null) {
      const details = this.shadowRoot?.querySelector<HTMLDetailsElement>("details.bf-roster");
      if (details && !details.open) details.open = true; // fires toggle → history loads
    }
  }

  /** One-click fix for a detected-but-unrecorded swap: record the DETECTED
   *  jump time in Battery Notes, so the forecast re-anchors on the real
   *  replacement instead of the dead battery's date. */
  private async _recordJump(entityId: string, jump: { at: number; device_id: string }): Promise<void> {
    if (this._marking) return;
    this._marking = true;
    this._error = "";
    try {
      await this.hass.callService("battery_notes", "set_battery_replaced", {
        device_id: jump.device_id,
        datetime_replaced: new Date(jump.at * 1000).toISOString(),
      });
      this._recorded = [...this._recorded, entityId];
      await this._load();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._marking = false;
    }
  }

  /** Purely visual level bar next to the number — scannable at a glance.
   *  Colored against the battery's OWN low threshold: red at/below it,
   *  amber inside a 20-point approach band, green above. */
  private _levelBar(b: BatteryRow) {
    const level = b.level;
    if (level == null) return nothing;
    const t = b.low_threshold ?? 20;
    const cls = level <= t ? "bad" : level <= t + 20 ? "warn" : "good";
    return html`<span class="bf-bar" aria-hidden="true"
      ><span class="bf-bar-fill bf-bar-${cls}" style="width: ${Math.min(100, Math.max(0, level))}%"></span
    ></span>`;
  }

  render() {
    const L = this._lang;
    if (this._loading && this._ov === null) return html`<div class="bf-card"><div class="bf-loading">…</div></div>`;
    const ov = this._ov;
    if (!ov) {
      return this._error ? html`<div class="bf-card"><div class="bf-error">${this._error}</div></div>` : nothing;
    }
    const lowCount = ov.low.length;
    return html`
      <div class="bf-card">
        <div class="bf-head">
          <ha-icon icon="mdi:battery-alert"></ha-icon>
          <span class="bf-title">${t("battery_fleet_title", L)}</span>
          <span class="bf-count ${lowCount ? "bad" : "ok"}">${lowCount}</span>
        </div>
        ${this._error ? html`<div class="bf-error">${this._error}</div>` : nothing}

        ${ov.configured && ov.task_ok === false
          ? html`
              <div class="bf-repair">
                <span>${t("battery_fleet_trigger_lost", L)}</span>
                <ha-button .disabled=${this._marking} @click=${this._repair}>
                  ${t("battery_fleet_repair", L)}
                </ha-button>
              </div>
            `
          : nothing}

        ${lowCount === 0
          ? html`<div class="bf-empty">${t("battery_fleet_none_low", L)}</div>`
          : html`
              <div class="bf-shopping">
                <span class="bf-label">${t("battery_fleet_buy_now", L)}</span>
                <span class="bf-list">${this._shoppingLine(ov.needs_now)}</span>
              </div>
              <div class="bf-rows">
                ${ov.low.map(
                  (b) => html`
                    <div class="bf-row">
                      <span class="bf-dev">${b.device_name}</span>
                      ${b.available === false
                        ? html`<span class="bf-offline">${t("battery_fleet_offline", L)}</span>`
                        : nothing}
                      <span class="bf-type">${b.quantity}× ${b.battery_type}</span>
                      ${b.rechargeable
                        ? html`<span class="bf-recharge" title=${t("battery_fleet_rechargeable", L)}
                            ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
                          ></span>`
                        : nothing}
                      ${this._levelBar(b)}
                      ${b.level != null ? html`<span class="bf-level">${b.level}%</span>` : nothing}
                      <button
                        class="bf-mark"
                        title=${b.rechargeable ? t("battery_fleet_mark_recharged", L) : t("battery_fleet_mark_one", L)}
                        .disabled=${this._marking}
                        @click=${() => this._mark([b.entity_id])}
                      >
                        <ha-icon icon="mdi:battery-sync"></ha-icon>
                      </button>
                      <button
                        class="bf-mark bf-exclude"
                        title=${t("battery_fleet_exclude", L)}
                        .disabled=${this._marking}
                        @click=${() => this._setExcluded(b.entity_id, true)}
                      >
                        <ha-icon icon="mdi:eye-off-outline"></ha-icon>
                      </button>
                    </div>
                  `,
                )}
              </div>
              <div class="bf-actions">
                <ha-button .disabled=${this._marking} @click=${this._markAll}>
                  <ha-icon icon="mdi:battery-sync"></ha-icon> ${t("battery_fleet_mark_all", L)}
                </ha-button>
              </div>
            `}

        ${ov.soon.length
          ? html`
              <div class="bf-soon">
                <span class="bf-label">${t("battery_fleet_soon", L)}</span>
                <span class="bf-list">${this._shoppingLine(ov.needs_soon)}</span>
                <div class="bf-soon-hint">${t("battery_fleet_soon_hint", L)}</div>
              </div>
            `
          : nothing}
        ${ov.all?.length
          ? html`
              <details class="bf-roster" @toggle=${this._loadHistory}>
                <summary>${t("battery_fleet_all", L)} (${ov.all.length})</summary>
                <div class="bf-roster-tools">
                  <button
                    class="bf-sort ${this._rosterSort === "urgency" ? "bf-sort-active" : ""}"
                    @click=${() => this._setSort("urgency")}
                  >
                    ${t("battery_fleet_sort_urgency", L)}
                  </button>
                  <button
                    class="bf-sort ${this._rosterSort === "name" ? "bf-sort-active" : ""}"
                    @click=${() => this._setSort("name")}
                  >
                    ${t("battery_fleet_sort_name", L)}
                  </button>
                </div>
                <div class="bf-rows">
                  ${this._sortedRoster(ov.all).map(
                    (b) => html`
                      <div class="bf-row">
                        <span class="bf-dev">${b.device_name}</span>
                        <span class="bf-status bf-${b.status}">${t("battery_fleet_status_" + b.status, L)}</span>
                        <span class="bf-type">${b.quantity}× ${b.battery_type}</span>
                        ${b.rechargeable
                          ? html`<span class="bf-recharge" title=${t("battery_fleet_rechargeable", L)}
                              ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
                            ></span>`
                          : nothing}
                        ${this._sparkline(b)}
                        ${this._levelBar(b)}
                        ${b.level != null ? html`<span class="bf-level">${b.level}%</span>` : nothing}
                        ${(() => {
                          const jump = this._history?.[b.entity_id]?.jump;
                          if (!jump || this._recorded.includes(b.entity_id)) return nothing;
                          return html`<button
                            class="bf-mark bf-jump"
                            title=${t("battery_fleet_record_replacement", L).replace("{date}", this._fmtDate(jump.at * 1000))}
                            .disabled=${this._marking}
                            @click=${() => this._recordJump(b.entity_id, jump)}
                          >
                            <ha-icon icon="mdi:calendar-sync"></ha-icon>
                          </button>`;
                        })()}
                        ${b.days_until != null
                          ? html`<span
                              class="bf-predicted ${b.predicted_source === "trend" ? "bf-trend" : ""} ${b.forecast_overdue ? "bf-overdue" : ""}"
                              title=${b.forecast_overdue
                                ? t("battery_fleet_forecast_overdue", L)
                                : b.predicted_source === "trend"
                                  ? t("battery_fleet_predicted_trend", L)
                                      .replace("{date}", this._predictedDate(b.days_until))
                                      .replace("{confidence}", t("cal_confidence_" + (b.prediction_confidence || "medium"), L))
                                  : t("battery_fleet_predicted_on", L).replace("{date}", this._predictedDate(b.days_until))}
                              >${b.forecast_overdue ? html`<ha-icon icon="mdi:calendar-alert"></ha-icon>` : nothing}~${this._predictedDate(b.days_until)}</span
                            >`
                          : nothing}
                        <button
                          class="bf-mark bf-exclude"
                          title=${t("battery_fleet_exclude", L)}
                          .disabled=${this._marking}
                          @click=${() => this._setExcluded(b.entity_id, true)}
                        >
                          <ha-icon icon="mdi:eye-off-outline"></ha-icon>
                        </button>
                      </div>
                    `,
                  )}
                </div>
                <div class="bf-roster-hint">${t("battery_fleet_all_hint", L)}</div>
                <div class="bf-add">
                  <span class="bf-label">${t("battery_fleet_add", L)}</span>
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{ entity: { domain: ["sensor", "binary_sensor"] } }}
                    .value=${""}
                    @value-changed=${this._addBattery}
                  ></ha-selector>
                  <div class="bf-roster-hint">${t("battery_fleet_add_hint", L)}</div>
                </div>
                <label class="bf-track-self">
                  <input
                    type="checkbox"
                    .checked=${!!ov.track_self_charging}
                    .disabled=${this._marking}
                    @change=${this._setTrackSelf}
                  />
                  ${t("battery_fleet_track_self", L)}
                </label>
                <div class="bf-roster-hint">${t("battery_fleet_track_self_hint", L)}</div>
              </details>
            `
          : nothing}
        ${ov.excluded?.length
          ? html`
              <div class="bf-excluded">
                <span class="bf-label">${t("battery_fleet_excluded", L)}</span>
                ${ov.excluded.map(
                  (x) => html`
                    <span class="bf-excluded-chip">
                      ${x.device_name}
                      <button
                        class="bf-mark"
                        title=${t("battery_fleet_include", L)}
                        .disabled=${this._marking}
                        @click=${() => this._setExcluded(x.entity_id, false)}
                      >
                        <ha-icon icon="mdi:eye-outline"></ha-icon>
                      </button>
                    </span>
                  `,
                )}
              </div>
            `
          : nothing}
        <div class="bf-total">${t("battery_fleet_total", L).replace("{n}", String(ov.total))}</div>
      </div>
    `;
  }

  static styles = css`
    .bf-card {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 14px 16px;
      margin: 12px 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .bf-head {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
    .bf-title {
      flex: 1;
    }
    .bf-count {
      font-size: 13px;
      padding: 1px 9px;
      border-radius: 10px;
    }
    .bf-count.bad {
      background: var(--error-color, #f44336);
      color: #fff;
    }
    .bf-count.ok {
      background: var(--success-color, #4caf50);
      color: #fff;
    }
    .bf-error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .bf-repair {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 8px 10px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--warning-color, #ff9800) 12%, transparent);
      font-size: 13px;
    }
    .bf-empty {
      color: var(--secondary-text-color);
      font-size: 14px;
    }
    .bf-shopping,
    .bf-soon {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 8px;
    }
    .bf-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--secondary-text-color);
    }
    .bf-list {
      font-weight: 500;
    }
    .bf-rows {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .bf-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .bf-dev {
      flex: 1;
      min-width: 0;
    }
    .bf-type {
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .bf-recharge {
      color: var(--secondary-text-color);
      display: inline-flex;
      cursor: help;
    }
    .bf-recharge ha-icon {
      --mdc-icon-size: 16px;
    }
    .bf-spark {
      width: 110px;
      height: 24px;
      flex: 0 0 auto;
      cursor: help;
    }
    /* On phones the row cannot fit name + chips + curve + bar + date: the
     * decorations yield (the percentage still carries the number). */
    @media (max-width: 640px) {
      .bf-spark,
      .bf-bar {
        display: none;
      }
    }
    .bf-spark-line {
      fill: none;
      stroke: var(--primary-color);
      stroke-width: 1.5;
      stroke-linejoin: round;
    }
    .bf-spark-proj {
      stroke: var(--primary-color);
      stroke-width: 1.2;
      stroke-dasharray: 2 3;
      opacity: 0.7;
    }
    .bf-spark-th {
      stroke: var(--error-color, #f44336);
      stroke-width: 1;
      opacity: 0.35;
    }
    .bf-type-chip {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 1px 8px;
      margin: 0 4px 2px 0;
      font-size: 13px;
      color: inherit;
      cursor: pointer;
    }
    .bf-type-chip-active {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .bf-bar {
      width: 30px;
      height: 6px;
      border-radius: 3px;
      background: var(--divider-color);
      overflow: hidden;
      flex: 0 0 auto;
    }
    .bf-bar-fill {
      display: block;
      height: 100%;
      border-radius: 3px;
    }
    .bf-bar-good {
      background: var(--success-color, #4caf50);
    }
    .bf-bar-warn {
      background: var(--warning-color, #ff9800);
    }
    .bf-bar-bad {
      background: var(--error-color, #f44336);
    }
    .bf-jump ha-icon {
      color: var(--warning-color, #ff9800);
    }
    .bf-roster-tools {
      display: flex;
      gap: 6px;
      margin: 8px 0 2px;
    }
    .bf-sort {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      padding: 2px 10px;
      font-size: 12px;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .bf-sort-active {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .bf-level {
      font-size: 12px;
      color: var(--error-color, #f44336);
    }
    .bf-mark {
      background: transparent;
      border: none;
      color: var(--primary-color);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: inline-flex;
    }
    .bf-mark:hover {
      background: var(--secondary-background-color);
    }
    .bf-actions {
      display: flex;
      justify-content: flex-end;
    }
    .bf-soon {
      border-top: 1px solid var(--divider-color);
      padding-top: 8px;
    }
    .bf-soon-hint {
      width: 100%;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    /* The roster is a lookup list, not the headline — collapsed by default so
       the section still opens on what actually needs doing. */
    .bf-roster > summary {
      cursor: pointer;
      font-size: 13px;
      color: var(--secondary-text-color);
      padding: 2px 0;
    }
    .bf-roster-hint {
      font-size: 12px;
      color: var(--secondary-text-color);
      padding-top: 6px;
    }
    .bf-status {
      font-size: 11px;
      padding: 1px 7px;
      border-radius: 9px;
      white-space: nowrap;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      color: var(--secondary-text-color);
    }
    .bf-status.bf-low {
      background: var(--error-color, #f44336);
      color: #fff;
    }
    .bf-status.bf-soon {
      background: var(--warning-color, #ff9800);
      color: #fff;
    }
    .bf-predicted {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    /* Trend-based dates (discharge regression) get a dotted underline — the
       tooltip carries source + confidence. */
    .bf-predicted.bf-trend {
      text-decoration: underline dotted;
      text-underline-offset: 2px;
    }
    /* B1: passed prediction on a still-healthy battery — warn-tinted with a
       calendar-alert icon; the tooltip explains (record the swap / forecast
       was off). Deliberately NOT red: this is a discrepancy, not an alarm. */
    .bf-predicted.bf-overdue {
      color: var(--warning-color, #ff9800);
    }
    .bf-predicted.bf-overdue ha-icon {
      --mdc-icon-size: 14px;
      margin-right: 2px;
    }
    .bf-total {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .bf-exclude {
      color: var(--secondary-text-color);
    }
    .bf-excluded {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      border-top: 1px solid var(--divider-color);
      padding-top: 8px;
    }
    .bf-excluded-chip {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 12px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 10px;
      padding: 1px 4px 1px 10px;
    }
    .bf-track-self {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      font-size: 13px;
      cursor: pointer;
    }
    .bf-track-self input {
      accent-color: var(--primary-color);
      margin: 0;
    }
  `;
}

if (!customElements.get("maintenance-battery-fleet-section")) {
  customElements.define("maintenance-battery-fleet-section", MaintenanceBatteryFleetSection);
}
