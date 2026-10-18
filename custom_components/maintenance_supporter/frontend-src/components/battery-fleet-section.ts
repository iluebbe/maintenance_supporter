/** Battery-fleet detail section, rendered inside the single "Replace low
 *  batteries" task's overview tab (task.battery_fleet_task). Self-contained:
 *  fetches the live aggregate over Battery Notes and offers the mark-replaced
 *  action — the fleet's one surface, instead of 30-70 per-battery tasks. */

import { css, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { t, ensureLocale, langOf, formatDate, formatNumber, syncLocaleFromHass } from "../styles";
import { reuseWaitingText } from "../helpers/part-reuse";
import { LS_KEYS, lsGet, lsSet } from "../helpers/storage-keys";
import { runWs } from "../helpers/ws-run";
import { canWrite, NO_DELEGATION, type WriteAccess } from "../helpers/permissions";
import { fetchSettingsOnce } from "../helpers/settings-cache";
import { addDaysIso, haToday } from "../helpers/ha-time";
import { px } from "../renderers/chart-utils";
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
  /** The forecast in days, NOT clamped: negative once the date has passed.
   *  `days_until` holds at 0 for overdue rows (B1, sorting), so the ~date
   *  is drawn from this one. */
  forecast_days?: number | null;
  /** D#162: a Battery Notes note whose device has NO battery level at
   *  all — read from its type sensor. No level bar, never offline; the
   *  forecast is the whole signal and (option) a passed one is `low`. */
  no_sensor?: boolean;
  /** D#162 follow-up: the note has a replaced button → per-row Replaced action. */
  can_mark_replaced?: boolean;
  /** D#162 follow-up: which type lifetime the typical forecast used. */
  lifetime_months?: number | null;
  lifetime_source?: "override" | "learned_device" | "learned_model" | "table" | "default" | null;
  lifetime_samples?: number;
  /** ISO date the forecast anchors on (Battery Notes' last replaced). */
  last_replaced?: string | null;
  /** D#213 (ask-cells on): what may go in at Replaced — the note's type and
   *  every fleet part of the same size — and what it holds now. */
  cell_choices?: { type: string; name: string; rechargeable: boolean }[];
  cells_installed?: string;
}
interface RosterRow extends BatteryRow {
  status: "low" | "soon" | "ok";
}
/** What the shared row template takes: a low/soon row, or a roster row
 *  (which adds the status). */
type FleetRow = BatteryRow & { status?: RosterRow["status"] };
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
  /** The fleet object's entry (its parts are the battery types). */
  entry_id?: string | null;
  total: number;
  low: BatteryRow[];
  soon: BatteryRow[];
  // Every tracked battery, whatever its state. Optional so an older backend
  // simply renders no roster instead of throwing.
  all?: RosterRow[];
  needs_now: Record<string, number>;
  needs_soon: Record<string, number>;
  types: string[];
  // #208: the counted rechargeable spares — charged (stock) and waiting to
  // be charged (restoring). An older backend omits it.
  charging?: { part_id: string; name: string; reuse: string; stock: number; restoring: number }[];
  excluded?: { entity_id: string; device_name: string }[];
  // #135 follow-up: fleet-wide "track self-charging devices" opt-in.
  track_self_charging?: boolean;
  // D#162: a passed forecast on a sensorless note counts as due (default
  // on — an older backend omits the field, which renders as on too).
  due_without_sensor?: boolean;
  // D#213: Replaced asks which cells went in (opt-in).
  ask_cells?: boolean;
}

export class MaintenanceBatteryFleetSection extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  /** Flat mode drops the section's own card chrome (border/background) —
   *  set by the Lovelace card wrapper, whose ha-card provides the chrome. */
  @property({ type: Boolean }) public flat = false;

  @state() private _ov: Overview | null = null;
  @state() private _loading = false;
  @state() private _marking = false;
  /** D#213: the battery whose Replaced waits for the cells that went in. */
  @state() private _choosing: { entityId: string; list: string; selected: string } | null = null;
  @state() private _error = "";
  /** #218: the cells whose dispose field is open, and how many. */
  @state() private _disposeFor: string | null = null;
  @state() private _disposeQty = "1";
  @state() private _history: HistorySeries | null = null;
  // Urgency by default (issue #123: "soon sat in the middle of the list");
  // the choice is remembered per browser.
  @state() private _rosterSort: "name" | "urgency" = MaintenanceBatteryFleetSection._storedSort();
  @state() private _typeFilter: string | null = null;
  @state() private _recorded: string[] = [];
  /** Every fleet action (mark replaced, record, exclude/include, add, the two
   *  options, repair) is WRITE tier on the server; the section offered them
   *  to every household member, who then got "not permitted" and a checkbox
   *  left flipped (audit 2026-09-29). Same rule as the panel and the other
   *  cards: helpers/permissions.canWrite. */
  @state() private _access: WriteAccess = NO_DELEGATION;
  private _historyRequested = false;
  private _localeReady = false;

  private get _lang(): string {
    return langOf(this.hass);
  }

  private get _canWrite(): boolean {
    return canWrite(this.hass?.user, this._access);
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.hass) this._load();
  }

  updated(changed: Map<string, unknown>): void {
    // #163: the forecast dates go through formatDate(), which reads the HA
    // profile date format from a window singleton — feed it here too, so a
    // stand-alone battery-fleet card (no panel / task card on the page to do
    // it) still renders DD/MM vs MM/DD the way the profile says.
    syncLocaleFromHass(this, changed);
    if (changed.has("hass") && this.hass && !this._localeReady) {
      this._localeReady = true;
      ensureLocale(this._lang).then(() => this.requestUpdate());
      void fetchSettingsOnce(this.hass).then((s) => { this._access = s.access; });
      if (this._ov === null && !this._loading) this._load();
    }
  }

  private async _load(): Promise<void> {
    this._error = "";
    const ov = await runWs<Overview>(this, { type: "maintenance_supporter/battery_fleet/overview" }, {
      busy: (b) => { this._loading = b; },
      onError: (m) => { this._error = m; },
    });
    if (ov !== undefined) this._ov = ov;
  }

  /** One fleet action — helpers/ws-run runWs behind the `_marking` guard,
   *  with the error line and the overview reload (`onDone` runs first). */
  /** True when the backend took it. */
  private async _act(payload: Record<string, unknown>, onDone?: () => void): Promise<boolean> {
    if (this._marking) return false;
    this._error = "";
    const res = await runWs(this, payload, {
      busy: (b) => { this._marking = b; },
      reload: async () => {
        onDone?.();
        await this._load();
      },
      onError: (m) => { this._error = m; },
    });
    return res !== undefined;
  }

  /** #218: dead cells leave the "to charge" pile without going back to
   *  the stock, so the shopping list sees they are gone. */
  private async _dispose(entryId: string | null | undefined, partId: string): Promise<void> {
    const qty = parseFloat(this._disposeQty);
    if (!Number.isFinite(qty) || qty <= 0) return;
    if (await this._act({ type: "maintenance_supporter/part/dispose", entry_id: entryId, part_id: partId, quantity: qty })) {
      this._disposeFor = null;
    }
  }

  private _renderDispose(entryId: string | null | undefined, c: { part_id: string; restoring: number }, L: string) {
    if (this._disposeFor !== c.part_id) {
      return html`<button class="bf-charged bf-dispose" title=${t("part_dispose_hint", L)} .disabled=${this._marking}
        @click=${() => {
          this._disposeFor = c.part_id;
          this._disposeQty = "1";
        }}><ha-icon icon="mdi:trash-can-outline"></ha-icon>${t("part_dispose", L)}</button>`;
    }
    return html`<input
        class="bf-dispose-qty"
        type="number"
        min="1"
        max=${String(c.restoring)}
        .value=${this._disposeQty}
        aria-label=${t("part_dispose_how_many", L)}
        title=${t("part_dispose_how_many", L)}
        @input=${(e: Event) => (this._disposeQty = (e.target as HTMLInputElement).value)}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === "Enter") void this._dispose(entryId, c.part_id);
          if (e.key === "Escape") this._disposeFor = null;
        }}
      /><button class="bf-charged bf-dispose confirm" title=${t("part_dispose_hint", L)} .disabled=${this._marking}
        @click=${() => this._dispose(entryId, c.part_id)}><ha-icon icon="mdi:check"></ha-icon>${t("part_dispose", L)}</button
      ><button class="bf-charged bf-dispose" title=${t("cancel", L)} @click=${() => (this._disposeFor = null)}
        ><ha-icon icon="mdi:close"></ha-icon
      ></button>`;
  }

  private _markAll = async (): Promise<void> => {
    await this._mark(undefined);
  };

  // Re-runs the idempotent setup, which restores the fleet task's trigger
  // when a user edit wiped it (issue #106) or recreates a deleted task.
  private _repair = async (): Promise<void> => {
    await this._act({ type: "maintenance_supporter/battery_fleet/setup", language: this._lang });
  };

  /** One battery's Replaced: asks which cells went in when the fleet is
   *  set to (D#213) and there is a choice, else books right away. */
  private _markOne(b: BatteryRow, list: string): void {
    if (b.cell_choices && b.cell_choices.length > 1) {
      this._choosing = { entityId: b.entity_id, list, selected: b.cells_installed || b.cell_choices[0].type };
      return;
    }
    void this._mark([b.entity_id]);
  }

  private async _confirmCells(): Promise<void> {
    const choice = this._choosing;
    if (!choice) return;
    this._choosing = null;
    await this._act({
      type: "maintenance_supporter/battery_fleet/mark_replaced",
      entity_ids: [choice.entityId],
      cells: { [choice.entityId]: choice.selected },
    });
  }

  private _renderCellChooser(b: BatteryRow, list: string, L: string) {
    const choice = this._choosing;
    if (!choice || choice.entityId !== b.entity_id || choice.list !== list || !b.cell_choices) return nothing;
    return html`
      <div class="bf-cells" role="group" aria-label=${t("battery_fleet_cells_question", L)}>
        <div class="bf-cells-q">${t("battery_fleet_cells_question", L)}</div>
        ${b.cell_choices.map((c) => html`
          <label class="bf-cell-choice">
            <input type="radio" name=${`cells-${b.entity_id}`} .checked=${choice.selected === c.type}
              @change=${() => { this._choosing = { ...choice, selected: c.type }; }} />
            <span>${c.name}</span>
            ${c.rechargeable ? html`<span class="bf-cell-tag">${t("battery_fleet_cells_rechargeable", L)}</span>` : nothing}
          </label>`)}
        <div class="bf-cells-actions">
          <button class="bf-cells-cancel" @click=${() => { this._choosing = null; }}>${t("cancel", L)}</button>
          <button class="bf-cells-ok" .disabled=${this._marking} @click=${() => this._confirmCells()}>
            ${t("battery_fleet_mark_one", L)}
          </button>
        </div>
      </div>
    `;
  }

  private async _mark(entityIds: string[] | undefined): Promise<void> {
    await this._act({
      type: "maintenance_supporter/battery_fleet/mark_replaced",
      ...(entityIds ? { entity_ids: entityIds } : {}),
    });
  }

  // Manual exclude/include (#107): a rechargeable device the heuristics
  // missed (or any battery the user never wants tracked) leaves the fleet;
  // the restore list below the section brings it back.
  private async _setExcluded(entityId: string, excluded: boolean): Promise<void> {
    await this._act({ type: "maintenance_supporter/battery_fleet/set_excluded", entity_id: entityId, excluded });
  }

  // #135: manually ADD a battery the discovery heuristics missed. The
  // include bypasses the name/% heuristic and the self-charging filter
  // server-side; picking an entity acts immediately (no extra button).
  private async _addBattery(e: CustomEvent<{ value?: string }>): Promise<void> {
    const entityId = e.detail?.value;
    if (!entityId) return;
    await this._act({ type: "maintenance_supporter/battery_fleet/set_included", entity_id: entityId, included: true });
  }

  // #135 follow-up: fleet-wide opt-in that keeps self-charging devices
  // (phones, vacuums, smart rings) in the roster as rechargeables.
  private async _setTrackSelf(e: Event): Promise<void> {
    await this._setFleetOption("set_track_self_charging", e.target as HTMLInputElement);
  }

  // D#162: fleet-wide option — a passed forecast on a sensorless note is
  // due (fires the task). Default on; only the opt-out is stored.
  private async _setDueWithoutSensor(e: Event): Promise<void> {
    await this._setFleetOption("set_due_without_sensor", e.target as HTMLInputElement);
  }

  // D#213: fleet-wide opt-in — Replaced asks which cells went in.
  private async _setAskCells(e: Event): Promise<void> {
    await this._setFleetOption("set_ask_cells", e.target as HTMLInputElement);
  }

  private async _setFleetOption(
    command: "set_track_self_charging" | "set_due_without_sensor" | "set_ask_cells",
    box: HTMLInputElement,
  ): Promise<void> {
    const enabled = box.checked;
    // Refused or failed: the box shows the fleet's setting again. Lit
    // writes `.checked` only when the bound value changes, so it stayed
    // flipped (audit 2026-10-17).
    if (!(await this._act({ type: `maintenance_supporter/battery_fleet/${command}`, enabled }))) box.checked = !enabled;
  }

  /** Lazy: the recorder-backed history is fetched once, when the roster is
   *  first expanded — most panel visits never open it. */
  /** D#162: the roster is open unless this browser collapsed it before. */
  private _rosterOpen(): boolean {
    return lsGet(LS_KEYS.batteryRosterOpen) !== "0";
  }

  /** The ~date tooltip: trend (with confidence) or the type lifetime with
   *  where it came from — "18 months typical for CR2032 (learned from 5
   *  replacements)" (D#162 follow-up). */
  private _predictedTitle(b: BatteryRow, L: string): string {
    if (b.forecast_overdue) return t("battery_fleet_forecast_overdue", L);
    const date = this._predictedDate(this._forecastDays(b) ?? 0);
    if (b.predicted_source === "trend") {
      return t("battery_fleet_predicted_trend", L)
        .replace("{date}", date)
        .replace("{confidence}", t("cal_confidence_" + (b.prediction_confidence || "medium"), L));
    }
    if (b.lifetime_months != null && b.lifetime_source) {
      const source = t("lifetime_source_" + b.lifetime_source, L).replace("{n}", String(b.lifetime_samples ?? 0));
      return t("battery_fleet_predicted_typical", L)
        .replace("{date}", date)
        .replace("{months}", String(b.lifetime_months))
        .replace("{type}", b.battery_type)
        .replace("{source}", source);
    }
    return t("battery_fleet_predicted_on", L).replace("{date}", date);
  }

  private _loadHistory = async (e: Event): Promise<void> => {
    const open = (e.target as HTMLDetailsElement).open;
    lsSet(LS_KEYS.batteryRosterOpen, open ? "1" : "0");
    if (!open || this._historyRequested) return;
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
  private _sparkline(b: FleetRow) {
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
    const line = h.points.map(([t, v]) => `${px(x(t))},${px(y(v))}`).join(" ");
    const vLast = h.points[h.points.length - 1][1];
    const yTh = px(y(h.threshold));
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
            x1=${px(x(tLast))}
            y1=${px(y(vLast))}
            x2=${px(x(projEnd))}
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
   *  is honest: the battery is living on borrowed time. The server counts
   *  the days from HA's today — so does the date (the browser's day plus
   *  N × 24 h was a day off on a device in another zone). */
  private _predictedDate(daysUntil: number): string {
    return formatDate(addDaysIso(haToday(), daysUntil), this._lang);
  }

  /** The days the ~date is drawn from: the unclamped forecast, so a passed
   *  one keeps its own date instead of reading "today" every day (prod
   *  report 2026-10-13). `days_until` only covers a server from before
   *  `forecast_days` (an update not yet restarted); it is the same number
   *  wherever the forecast has not passed. */
  private _forecastDays(b: BatteryRow): number | null {
    return b.forecast_days !== undefined ? b.forecast_days : b.days_until;
  }

  /** The calendar date of an epoch (a detected swap), in the HA profile
   *  date format and time zone (#163 — a direct Intl.DateTimeFormat call
   *  here ignored the profile and showed 9/2/2026 to a DD/MM/YYYY user). */
  private _fmtDate(epochMs: number): string {
    return Number.isFinite(epochMs) ? formatDate(new Date(epochMs).toISOString(), this._lang) : "—";
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
   *  replacement instead of the dead battery's date. Goes through the
   *  backend (#181) so the swap also consumes the type-part cells from
   *  stock, exactly like the Replaced action. */
  private async _recordJump(entityId: string, jump: { at: number; device_id: string }): Promise<void> {
    await this._act(
      {
        type: "maintenance_supporter/battery_fleet/record_replacement",
        entity_id: entityId,
        replaced_at: new Date(jump.at * 1000).toISOString(),
      },
      () => { this._recorded = [...this._recorded, entityId]; },
    );
  }

  /** How a level reads against the battery's OWN low threshold: "bad"
   *  at/below it, "warn" inside a 20-point approach band, "good" above.
   *  ONE judgement for the bar and the number beside it. */
  private _levelTone(level: number, b: BatteryRow): "bad" | "warn" | "good" {
    const t = b.low_threshold ?? 20;
    return level <= t ? "bad" : level <= t + 20 ? "warn" : "good";
  }

  /** Purely visual level bar next to the number — scannable at a glance. */
  private _levelBar(b: BatteryRow) {
    const level = b.level;
    if (level == null) return nothing;
    return html`<span class="bf-bar" aria-hidden="true"
      ><span class="bf-bar-fill bf-bar-${this._levelTone(level, b)}" style="width: ${Math.min(100, Math.max(0, level))}%"></span
    ></span>`;
  }

  /** The "record this replacement" chip: the level history shows an upward
   *  jump nobody recorded in Battery Notes (roster only). */
  private _jumpButton(b: BatteryRow, L: string) {
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
  }

  /** ONE row template for the three lists (low / needed soon / roster).
   *  They were hand-copied and had drifted: only the low list said
   *  "recharged" on a rechargeable's mark action and only it showed the
   *  offline hint (DRY audit 2026-09-12). `o` names the per-list extras.
   *
   *  DOM order is load-bearing for the grid CSS: `.bf-status + .bf-type +
   *  .bf-offline` (the roster's chip sits AFTER the type, the low/soon
   *  lists' BEFORE it) and the phone layout's column assignments — keep it. */
  private _renderRow(
    b: FleetRow,
    L: string,
    o: {
      /** Roster: status chip in column 2, the sensor chip after the type. */
      status?: boolean;
      /** Rechargeable badge (low list + roster). */
      recharge?: boolean;
      /** 30 d level sparkline (roster). */
      sparkline?: boolean;
      /** "always": every row gets the mark action (low list); "replaced":
       *  only a sensorless row or a note with a replaced button. */
      mark: "always" | "replaced";
      /** Which list the row is in (a low battery is in two). */
      list: "low" | "soon" | "roster";
      jump?: boolean;
      predicted?: boolean;
      exclude?: boolean;
    },
  ) {
    const chip =
      b.available === false
        ? html`<span class="bf-offline">${t("battery_fleet_offline", L)}</span>`
        : b.no_sensor
          ? html`<span class="bf-offline bf-nosensor">${t("battery_fleet_no_sensor", L)}</span>`
          : nothing;
    // The full type as a tooltip: a long one ends in an ellipsis (D#162).
    const typeText = `${b.quantity}× ${b.battery_type}`;
    const type = html`<span class="bf-type" title=${typeText}>${typeText}</span>`;
    const writer = this._canWrite;
    const showMark = writer && (o.mark === "always" || b.no_sensor || b.can_mark_replaced);
    const days = this._forecastDays(b);
    return html`
      <div class="bf-row">
        <span class="bf-dev">${b.device_name}</span>
        ${o.status
          ? html`<span class="bf-status bf-${b.status}"
                >${b.no_sensor && b.status === "low"
                  ? t("battery_fleet_status_due", L)
                  : t("battery_fleet_status_" + b.status, L)}</span
              >${type}${chip}`
          : html`${chip}${type}`}
        ${o.recharge && b.rechargeable
          ? html`<span class="bf-recharge" title=${t("battery_fleet_rechargeable", L)}
              ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
            ></span>`
          : nothing}
        ${o.sparkline ? this._sparkline(b) : nothing}
        ${this._levelBar(b)}
        ${b.level != null ? html`<span class="bf-level bf-level-${this._levelTone(b.level, b)}">${b.level}%</span>` : nothing}
        ${showMark
          ? html`<button
              class="bf-mark${o.mark === "replaced" ? " bf-replaced" : ""}"
              title=${b.rechargeable ? t("battery_fleet_mark_recharged", L) : t("battery_fleet_mark_one", L)}
              .disabled=${this._marking}
              @click=${() => this._markOne(b, o.list)}
            >
              <ha-icon icon="mdi:battery-sync"></ha-icon>
            </button>`
          : nothing}
        ${o.jump && writer ? this._jumpButton(b, L) : nothing}
        ${o.predicted && days != null
          ? html`<span
              class="bf-predicted ${b.predicted_source === "trend" ? "bf-trend" : ""} ${b.forecast_overdue ? "bf-overdue" : ""}"
              title=${this._predictedTitle(b, L)}
              >${b.forecast_overdue ? html`<ha-icon icon="mdi:calendar-alert"></ha-icon>` : nothing}~${this._predictedDate(days)}</span
            >`
          : nothing}
        ${o.exclude && writer
          ? html`<button
              class="bf-mark bf-exclude"
              title=${t("battery_fleet_exclude", L)}
              .disabled=${this._marking}
              @click=${() => this._setExcluded(b.entity_id, true)}
            >
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>
            </button>`
          : nothing}
      </div>
      ${this._renderCellChooser(b, o.list, L)}
    `;
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
                ${this._canWrite
                  ? html`<ha-button .disabled=${this._marking} @click=${this._repair}>
                      ${t("battery_fleet_repair", L)}
                    </ha-button>`
                  : nothing}
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
                ${ov.low.map((b) => this._renderRow(b, L, { list: "low", recharge: true, mark: "always", exclude: true }))}
              </div>
              ${this._canWrite
                ? html`<div class="bf-actions">
                    <ha-button .disabled=${this._marking} @click=${this._markAll}>
                      <ha-icon icon="mdi:battery-sync"></ha-icon> ${t("battery_fleet_mark_all", L)}
                    </ha-button>
                  </div>`
                : nothing}
            `}

        ${ov.charging?.length
          ? html`
              <div class="bf-charging">
                <span class="bf-label">${t("battery_fleet_charging", L)}</span>
                ${ov.charging.map(
                  (c) => html`<span class="bf-charge-item">
                    <span class="bf-charge-name">${c.name}</span>
                    <span>${t("battery_fleet_ready", L).replace("{count}", formatNumber(c.stock, L))}</span>
                    ${c.restoring > 0
                      ? html`<span class="bf-charge-waiting">${reuseWaitingText(c.reuse, c.restoring, L)}</span>
                          ${this._canWrite
                            ? html`<button
                                class="bf-charged"
                                title=${t("part_ready_again_hint", L)}
                                .disabled=${this._marking}
                                @click=${() => this._act({
                                  type: "maintenance_supporter/part/ready_again",
                                  entry_id: ov.entry_id,
                                  part_id: c.part_id,
                                })}
                              ><ha-icon icon="mdi:battery-charging-100"></ha-icon>${t(`part_reuse_${c.reuse}`, L)}</button>
                              ${this._renderDispose(ov.entry_id, c, L)}`
                            : nothing}`
                      : nothing}
                  </span>`,
                )}
              </div>
            `
          : nothing}
        ${ov.soon.length
          ? html`
              <div class="bf-soon">
                <span class="bf-label">${t("battery_fleet_soon", L)}</span>
                <span class="bf-list">${this._shoppingLine(ov.needs_soon)}</span>
                <div class="bf-soon-hint">${t("battery_fleet_soon_hint", L)}</div>
              </div>
              <div class="bf-rows bf-soon-rows">
                ${ov.soon.map((b) => this._renderRow(b, L, { list: "soon", mark: "replaced", predicted: true }))}
              </div>
            `
          : nothing}
        ${ov.all?.length
          ? html`
              <details class="bf-roster" ?open=${this._rosterOpen()} @toggle=${this._loadHistory}>
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
                  ${this._sortedRoster(ov.all).map((b) =>
                    this._renderRow(b, L, { list: "roster", status: true, recharge: true, sparkline: true, mark: "replaced", jump: true, predicted: true, exclude: true }),
                  )}
                </div>
                <div class="bf-roster-hint">${t("battery_fleet_all_hint", L)}</div>
                ${this._canWrite ? this._renderRosterSettings(ov, L) : nothing}
              </details>
            `
          : nothing}
        ${this._renderExcluded(ov, L)}
        <div class="bf-total">${t("battery_fleet_total", L).replace("{n}", String(ov.total))}</div>
      </div>
    `;
  }

  /** Add a battery + the two fleet options — write tier, so writers only. */
  private _renderRosterSettings(ov: Overview, L: string) {
    return html`
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
                <label class="bf-track-self bf-due-nosensor">
                  <input
                    type="checkbox"
                    .checked=${ov.due_without_sensor !== false}
                    .disabled=${this._marking}
                    @change=${this._setDueWithoutSensor}
                  />
                  ${t("battery_fleet_due_without_sensor", L)}
                </label>
                <div class="bf-roster-hint">${t("battery_fleet_due_without_sensor_hint", L)}</div>
                <label class="bf-track-self bf-ask-cells">
                  <input
                    type="checkbox"
                    .checked=${!!ov.ask_cells}
                    .disabled=${this._marking}
                    @change=${this._setAskCells}
                  />
                  ${t("battery_fleet_ask_cells", L)}
                </label>
                <div class="bf-roster-hint">${t("battery_fleet_ask_cells_hint", L)}</div>
    `;
  }

  /** Excluded devices stay listed for everyone; bringing one back is write tier. */
  private _renderExcluded(ov: Overview, L: string) {
    return html`
        ${ov.excluded?.length
          ? html`
              <div class="bf-excluded">
                <span class="bf-label">${t("battery_fleet_excluded", L)}</span>
                ${ov.excluded.map(
                  (x) => html`
                    <span class="bf-excluded-chip">
                      ${x.device_name}
                      ${this._canWrite
                        ? html`<button
                            class="bf-mark"
                            title=${t("battery_fleet_include", L)}
                            .disabled=${this._marking}
                            @click=${() => this._setExcluded(x.entity_id, false)}
                          >
                            <ha-icon icon="mdi:eye-outline"></ha-icon>
                          </button>`
                        : nothing}
                    </span>
                  `,
                )}
              </div>
            `
          : nothing}
    `;
  }

  static styles = css`
    /* The query container of the row layout (see "In a narrow list" below):
     * the list's own width, not the screen's. */
    .bf-card {
      container: bf-fleet / inline-size;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 14px 16px;
      margin: 12px 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    :host([flat]) .bf-card {
      background: transparent;
      border: none;
      border-radius: 0;
      margin: 0;
      padding: 0;
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
    .bf-charging {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
    }
    .bf-charge-item {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      padding: 2px 8px;
      border-radius: 12px;
      background: var(--secondary-background-color, #eee);
      font-size: 13px;
    }
    .bf-charge-name {
      font-weight: 500;
    }
    .bf-charge-waiting {
      color: var(--warning-color, #f57c00);
    }
    .bf-charged {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font: inherit;
      font-size: 12px;
      min-height: 28px;
      padding: 2px 10px;
      border-radius: 14px;
      border: 1px solid var(--primary-color);
      background: transparent;
      color: var(--primary-color);
      cursor: pointer;
    }
    .bf-charged ha-icon {
      --mdc-icon-size: 16px;
    }
    .bf-dispose {
      border-color: var(--divider-color, #ccc);
      color: var(--secondary-text-color);
    }
    .bf-dispose.confirm {
      border-color: var(--error-color, #db4437);
      color: var(--error-color, #db4437);
    }
    .bf-dispose-qty {
      width: 56px;
      padding: 4px;
      font: inherit;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
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
    /* Cross-row column alignment (same subgrid pattern as the task table,
     * issue 66): the LIST owns one column template, every row spans it via
     * subgrid, and each element is PINNED to its column below - so an
     * optional element (sparkline, percentage, forecast date) leaves its
     * column empty instead of letting the rest of the row drift. max-content
     * columns collapse to 0 when a whole list never fills them (the low list
     * has no status chip, no sparkline, no date). */
    .bf-rows {
      display: grid;
      /* The right-hand columns (percentage, action, date, eye) have a
       * minimum width, so they line up across the three lists ("Buy now",
       * "Needed soon", the roster) although each list is a grid of its own
       * and fills different columns - only the roster has the eye, and its
       * dates used to end 32 px left of the soon list's. */
      grid-template-columns:
        minmax(0, 1fr) repeat(5, max-content)
        minmax(40px, max-content) minmax(32px, max-content) minmax(92px, max-content) minmax(32px, max-content);
      column-gap: 8px;
    }
    .bf-row {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: 1 / -1;
      align-items: center;
      padding: 6px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    /* Column pinning: 1 name, 2 status/offline chip, 3 type, 4 charging
     * icon, 5 sparkline, 6 level bar, 7 percentage, 8 row action
     * (mark-one / record-swap), 9 forecast date, 10 exclude eye. */
    .bf-dev {
      grid-column: 1;
      min-width: 0;
    }
    .bf-offline,
    .bf-status {
      grid-column: 2;
      justify-self: end;
    }
    .bf-type {
      grid-column: 3;
    }
    .bf-recharge {
      grid-column: 4;
    }
    .bf-spark {
      grid-column: 5;
    }
    .bf-bar {
      grid-column: 6;
    }
    /* D#162: the roster's "No sensor" / offline chip takes the level bar's
     * slot (such a row has no bar); column 2 stays the status chip's. */
    .bf-status + .bf-type + .bf-offline {
      grid-column: 6;
      justify-self: start;
      white-space: nowrap;
    }
    .bf-level {
      grid-column: 7;
      justify-self: end;
    }
    /* Every row action, the Replaced one included, sits in column 8. The
     * Replaced action used to take the empty percentage slot on sensorless
     * rows (D#162, while nothing else filled column 8) and column 8 on rows
     * with a percentage (since 2.79), so it jumped 40 px between
     * neighbouring rows (prod report 2026-10-13). Rows with a percentage
     * fill column 8 anyway, so one column for all costs no width. The
     * narrow layout below gives Replaced a slot of its own. */
    .bf-row .bf-mark {
      grid-column: 8;
    }
    .bf-predicted {
      grid-column: 9;
      justify-self: end;
    }
    .bf-row .bf-mark.bf-exclude {
      grid-column: 10;
    }
    .bf-offline {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-style: italic;
    }
    /* Every row shares the list's columns, so ONE long type ("1× BATTERY
     * PACK") widened the type column of all of them (D#162): it stops at
     * 12em and ends in an ellipsis, the full text is the tooltip. */
    .bf-type {
      color: var(--secondary-text-color);
      font-size: 13px;
      max-width: 12em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
    /* In a narrow list the row cannot fit name + chips + curve + bar + date
     * in ONE line: the decorations yield (the percentage still carries the
     * number) and the row wraps to two lines - the name spans the full
     * width, the status chip moves under it (left, into the name column)
     * and the rest keeps its pinned subgrid column, so type / percentage /
     * date / eye stay aligned across rows. Without this the fixed
     * max-content columns overflowed 400 px and the chips overlapped the
     * wrapped names.
     *
     * The LIST's width decides, not the screen's (D#162): the Lovelace card
     * sits in a dashboard column of 400-500 px on a wide screen, kept the
     * one-line layout there and cut off the badge, the date and the hide
     * button. 680 px of list is where the one-line rows stop fitting;
     * desktop task pages (700 px and more) keep them. */
    @container bf-fleet (max-width: 680px) {
      .bf-spark,
      .bf-bar {
        display: none;
      }
      /* No fixed gaps: a column a phone leaves empty (status chip moved,
       * curve and bar hidden) cost its 8 px gap all the same, and together
       * with one long type the rows ran 25 px past a 402 px phone. Each
       * occupied column brings its own 6 px instead, and the type column
       * may shrink - its text ends in an ellipsis. */
      .bf-rows {
        column-gap: 0;
        grid-template-columns: minmax(0, 1fr) max-content minmax(0, max-content) repeat(7, max-content);
      }
      .bf-row > :not(.bf-dev) {
        margin-inline-start: 6px;
      }
      .bf-row {
        row-gap: 2px;
      }
      .bf-dev {
        grid-column: 1 / 9;
        grid-row: 1;
      }
      .bf-offline,
      .bf-status {
        /* Line 1, RIGHT - over the date+eye columns, which are wide enough
         * for any chip. Pinning the chip into the 1fr rest column instead
         * overlapped the type text (the rest column shrinks below chip
         * width, and a span onto an fr track never grows fixed tracks). */
        grid-column: 9 / 11;
        grid-row: 1;
        justify-self: end;
      }
      /* The column shrinks, the ellipsis comes from the base rule (a cap in
       * vw measured the screen, not the list). */
      .bf-type {
        grid-row: 2;
      }
      .bf-recharge,
      .bf-level,
      .bf-predicted,
      .bf-row .bf-mark {
        grid-row: 2;
      }
      /* Phone (D#162, maisun): the percentage belongs to the name line - it
       * is what you scan for - and the Replaced action to line 2 with type
       * and date. A row WITH a percentage therefore lifts it to line 1 (the
       * name yields column 8; in the "Needed soon" list, which has no status
       * chip, it takes the chip's place at the right edge) and the action
       * takes the percentage's slot on line 2 - the same slot a sensorless
       * row uses, so every row's action lines up. Before, the action shared
       * the slot with the percentage and painted over it. */
      .bf-row .bf-level {
        grid-row: 1;
        grid-column: 8;
        justify-self: end;
      }
      .bf-soon-rows .bf-row .bf-level {
        grid-column: 9 / 11;
      }
      .bf-row:has(.bf-level) .bf-dev {
        grid-column: 1 / 8;
      }
      .bf-soon-rows .bf-row:has(.bf-level) .bf-dev {
        grid-column: 1 / 9;
      }
      .bf-row .bf-mark.bf-replaced {
        grid-row: 2;
        grid-column: 7;
        justify-self: end;
      }
      /* The roster's "No sensor" chip would widen the shared bar track
       * for EVERY row (subgrid) - on phones the missing percentage and
       * the "Due" status already tell the story, so it yields like the
       * bar and the sparkline do. */
      .bf-status + .bf-type + .bf-offline {
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
    /* The number takes the bar's colour. It was red on every row, from the
     * days it only showed in the low list; the soon list and the roster
     * show it too, and a full battery read as an alarm there (prod report
     * 2026-10-13). A healthy level is plain text. */
    .bf-level {
      font-size: 12px;
    }
    .bf-level-bad {
      color: var(--error-color, #f44336);
    }
    .bf-level-warn {
      color: var(--warning-color, #ff9800);
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
    /* D#213: which cells went in — under the battery's row, across the
     * list's grid (in one column it squeezed into the name's). */
    .bf-cells {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin: 4px 0 8px;
      padding: 8px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }
    .bf-cells-q { font-size: 12px; font-weight: 500; color: var(--secondary-text-color); }
    .bf-cell-choice { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; }
    .bf-cell-choice input { width: 16px; height: 16px; margin: 0; }
    .bf-cell-tag {
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 8px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
    }
    .bf-cells-actions { display: flex; justify-content: flex-end; gap: 8px; }
    .bf-cells-actions button {
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
      cursor: pointer;
    }
    .bf-cells-actions .bf-cells-ok {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
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
