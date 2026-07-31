/** Maintenance Supporter — Calendar Card.
 *
 * Standalone Lovelace card extracted from the panel's Calendar tab (v1.5.0+).
 * All the visuals: 7/14/30/365 day window chips, per-event source icons
 * (clock vs trending-up), prediction-confidence pill, projected recurrences
 * at 55% opacity, today-pill highlight, empty-day collapsing in the year view.
 *
 * Click on an event fires an ``ll-custom`` event with payload
 * ``{type: "maintenance-supporter:open-task", entry_id, task_id}``. The
 * dashboard-strategy bundle's document-level handler picks that up and
 * either opens the task dialog in-place (preferred) or deep-links into the
 * panel as a fallback.
 *
 * Card config:
 *
 *   type: custom:maintenance-supporter-calendar-card
 *   title: My maintenance calendar  # optional
 *   window_days: 30                  # 7 | 14 | 30 | 365 — default 30
 *   show_window_chips: true          # default true; hide for embedded use
 *   show_user_filter: true           # default true
 *   user_filter: ""                  # "" | "current_user" | "<uuid>"
 *   show_object_filter: true         # default true; dropdown appears with 2+ objects
 *   object_filter: ""                # "" | "<entry_id>" | "<object name>" — or a LIST of
 *                                    # them to restrict the card to several objects; the
 *                                    # dropdown then narrows within that set (Discussion #83)
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import {
  buildCalendarBuckets,
  buildPastBuckets,
  isoDateLocal,
  type CalendarEvent,
} from "./helpers/calendar-bucket";
import { calendarStyles } from "./calendar-styles";
import { sharedStyles, DEFAULT_CURRENCY_SYMBOL, t, ensureLocale, isLocaleLoaded, setDateTimePrefs, formatDueDays } from "./styles";
import type {
  HomeAssistant,
  MaintenanceObjectResponse,
  StatisticsResponse,
} from "./types";

type WindowDays = 7 | 14 | 30 | 365;
type PastDays = 30 | 90;

interface CalendarCardConfig {
  type: string;
  title?: string;
  window_days?: WindowDays;
  show_window_chips?: boolean;
  show_user_filter?: boolean;
  user_filter?: string;
  /** Discussion #83 — in-card object dropdown + optional preselect. */
  show_object_filter?: boolean;
  object_filter?: string | string[];
  /** v2.2.0 — when set, the card renders past N days from history instead
   *  of forward N days from next_due. Mutually exclusive with window_days. */
  past_days?: PastDays;
}

export class MaintenanceCalendarCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config: CalendarCardConfig = {
    type: "custom:maintenance-supporter-calendar-card",
  };
  @state() private _objects: MaintenanceObjectResponse[] = [];
  @state() private _stats: StatisticsResponse | null = null;
  @state() private _windowDays: WindowDays = 30;
  @state() private _pastDays: PastDays | 0 = 0; // 0 = forward mode
  @state() private _userFilter = "";
  @state() private _objectFilter = "";
  // 2+ configured object_filter values — restricts the card to this set.
  private _configuredObjects: string[] = [];
  @state() private _unsub: (() => void) | null = null;

  private _dataLoaded = false;
  private _lastConnection: unknown = null;

  static getConfigElement() {
    return document.createElement("maintenance-supporter-calendar-card-editor");
  }

  static getStubConfig() {
    // Opinionated default: 30-day rolling window, both controls visible.
    return {
      type: "custom:maintenance-supporter-calendar-card",
      window_days: 30,
      show_window_chips: true,
      show_user_filter: true,
    };
  }

  setConfig(config: CalendarCardConfig): void {
    this._config = { ...config };
    if (config.past_days && [30, 90].includes(config.past_days)) {
      this._pastDays = config.past_days as PastDays;
    } else if (config.window_days && [7, 14, 30, 365].includes(config.window_days)) {
      this._windowDays = config.window_days as WindowDays;
      this._pastDays = 0;
    }
    if (typeof config.user_filter === "string") {
      this._userFilter = config.user_filter;
    }
    if (typeof config.object_filter === "string") {
      this._objectFilter = config.object_filter;
      this._configuredObjects = [];
    } else if (Array.isArray(config.object_filter)) {
      const values = config.object_filter.filter((v): v is string => typeof v === "string" && v !== "");
      // One entry behaves exactly like the string form (pre-select, dropdown
      // over all objects); two or more RESTRICT the card to that set and the
      // dropdown narrows within it — the multi-object parity with the task
      // card's filter_objects that #83 asked for.
      this._objectFilter = values.length === 1 ? values[0] : "";
      this._configuredObjects = values.length > 1 ? values : [];
    }
  }

  getCardSize(): number {
    return 6;
  }

  private get _lang(): string {
    return this.hass?.language || "en";
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._unsub) {
      try { this._unsub(); } catch { /* ignore */ }
      this._unsub = null;
    }
    this._dataLoaded = false;
    this._lastConnection = null;
  }

  updated(changedProps: Map<string, unknown>): void {
    super.updated(changedProps);
    // Dates/times follow the HA profile format, not just the language (#97).
    if (changedProps.has("hass")) setDateTimePrefs(this.hass?.locale);
    const lang = this.hass?.language;
    if (lang && !isLocaleLoaded(lang)) {
      ensureLocale(lang).then(() => this.requestUpdate());
    }
    if (changedProps.has("hass") && this.hass) {
      if (!this._dataLoaded) {
        this._dataLoaded = true;
        this._lastConnection = this.hass.connection;
        this._loadData();
        this._subscribe();
      } else if (this.hass.connection !== this._lastConnection) {
        this._lastConnection = this.hass.connection;
        if (this._unsub) {
          try { this._unsub(); } catch { /* ignore */ }
          this._unsub = null;
        }
        this._subscribe();
        this._loadData();
      }
    }
  }

  private async _loadData(): Promise<void> {
    try {
      const [objResult, statsResult] = await Promise.all([
        this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/objects",
        }),
        this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/statistics",
        }),
      ]);
      this._objects = (objResult as { objects: MaintenanceObjectResponse[] }).objects;
      this._stats = statsResult as StatisticsResponse;
    } catch {
      // WS not available yet
    }
  }

  private async _subscribe(): Promise<void> {
    try {
      const unsub = await this.hass.connection.subscribeMessage(
        (msg: unknown) => {
          const data = msg as { objects: MaintenanceObjectResponse[] };
          this._objects = data.objects;
        },
        { type: "maintenance_supporter/subscribe" },
      );
      // Detached mid-subscribe → drop the orphaned subscription.
      if (!this.isConnected) {
        unsub();
        return;
      }
      this._unsub = unsub;
    } catch {
      // Subscription failed
    }
  }

  private _onEventClick(ev: CalendarEvent): void {
    // Past events carry a history_timestamp — those open the history-edit
    // dialog instead of the task editor. Future / next_due events open
    // the task editor as usual.
    if (ev.history_timestamp) {
      this.dispatchEvent(
        new CustomEvent("ll-custom", {
          detail: {
            type: "maintenance-supporter:edit-history",
            entry_id: ev.entry_id,
            task_id: ev.task_id,
            original_timestamp: ev.history_timestamp,
          },
          bubbles: true,
          composed: true,
        }),
      );
      return;
    }
    this.dispatchEvent(
      new CustomEvent("ll-custom", {
        detail: {
          type: "maintenance-supporter:open-task",
          entry_id: ev.entry_id,
          task_id: ev.task_id,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    if (!this.hass) return nothing;

    const L = this._lang;
    const showChips = this._config.show_window_chips !== false;
    const showUserFilter = this._config.show_user_filter !== false;
    const title = this._config.title;

    let userFilter: string | null = null;
    if (this._userFilter) {
      // No UserService here (lives in panel only) — current_user resolves
      // via hass.user when the user picks "my tasks".
      userFilter = this._userFilter === "current_user"
        ? (this.hass?.user?.id ?? null)
        : this._userFilter;
    }

    // Object filter (#83): the config value may be an entry_id or an object
    // NAME (friendlier in hand-written YAML) — resolve against the loaded
    // objects; an unknown value falls back to "all" instead of a blank card.
    const resolve = (value: string): string | null => {
      const needle = value.toLowerCase();
      const match = this._objects.find(
        (o) => o.entry_id === value || o.object.name.toLowerCase() === needle,
      );
      return match?.entry_id ?? null;
    };
    // A configured LIST restricts the card to that set; unknown names resolve
    // to nothing and an entirely-unresolved list falls back to all objects
    // rather than a blank card (same rule the single value always had).
    const configuredIds = new Set(
      this._configuredObjects.map(resolve).filter((id): id is string => id !== null),
    );
    const base = configuredIds.size
      ? this._objects.filter((o) => configuredIds.has(o.entry_id))
      : this._objects;
    const showObjectFilter = this._config.show_object_filter !== false && base.length > 1;
    const filterEntryId = this._objectFilter ? resolve(this._objectFilter) : null;
    const objects =
      filterEntryId && base.some((o) => o.entry_id === filterEntryId)
        ? base.filter((o) => o.entry_id === filterEntryId)
        : base;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = this._pastDays > 0;
    const buckets = isPast
      ? buildPastBuckets(objects, today, this._pastDays, userFilter)
      : buildCalendarBuckets(objects, today, this._windowDays, userFilter);

    const todayIso = isoDateLocal(today);
    // Year view AND past views collapse empty days — past windows can be
    // sparse (most days have no maintenance recorded), so listing "no events"
    // for 30 rows is noise.
    const hideEmptyDays = this._windowDays === 365 || isPast;
    const visibleBuckets = hideEmptyDays
      ? buckets.filter((b) => b.events.length > 0)
      : buckets;

    const renderEvent = (ev: CalendarEvent) => {
      const statusClass = `cal-status-${ev.status}`;
      const projClass = ev.projected ? "cal-event-projected" : "";
      const overdueLabel = ev.status === "overdue" && ev.days_until_due != null
        ? ` (${formatDueDays(ev.days_until_due, L)})`
        : "";
      const recurEvery = ev.projected && ev.interval_days
        ? html`<span class="cal-event-recur">${
            ev.interval_unit && ev.interval_unit !== "days"
              ? `${ev.interval_days} ${t("unit_" + ev.interval_unit, L)}`
              : t("cal_every_n_days", L).replace("{n}", String(ev.interval_days))
          }</span>`
        : nothing;
      const isSensor = ev.schedule_type === "sensor_based";
      const sourceIcon = isSensor
        ? html`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${t("cal_source_sensor", L)}" icon="mdi:trending-up"></ha-icon>`
        : html`<ha-icon class="cal-event-icon cal-source-time"
                title="${ev.adaptive_enabled ? t("cal_source_time_adaptive", L) : t("cal_source_time", L)}"
                icon="${ev.adaptive_enabled ? "mdi:clock-time-four-outline" : "mdi:clock-outline"}"></ha-icon>`;
      const predictionSubtitle = isSensor && ev.prediction_confidence
        && ev.status !== "triggered" && !ev.projected
        ? html`<span class="cal-event-prediction cal-conf-${ev.prediction_confidence}">
            ${t("cal_predicted", L)} · ${t(`cal_confidence_${ev.prediction_confidence}`, L)}
          </span>`
        : nothing;
      const currencySymbol = this._stats?.budget?.currency_symbol || DEFAULT_CURRENCY_SYMBOL;
      // Past mode: ev.history_type is the actual event ('completed', 'skipped',
      // 'reset', 'triggered', 'trigger_replaced'). Showing the derived status
      // ('OK' for a completion) was confusing — discussion #49 user-feedback:
      // *"im Panel sind die alten Auslösungen drin nicht die completion oder
      // skips"* — completion events looked like they hadn't happened because
      // the badge said "OK" (current task status) not "Completed" (the
      // actual past event). In past mode we now label with the event type.
      // Forward mode still uses the projected status (overdue/due_soon/etc).
      const badgeLabel = ev.history_type
        ? t(ev.history_type, L)
        : t(ev.status, L);
      return html`
        <div class="cal-event ${projClass}"
          @click=${() => this._onEventClick(ev)}>
          ${sourceIcon}
          <span class="cal-status-pill ${statusClass}">${badgeLabel}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${ev.object_name} · ${ev.task_name}${overdueLabel}</div>
            ${predictionSubtitle}
            ${recurEvery}
          </div>
          ${ev.avg_cost != null && ev.avg_cost > 0
            ? html`<span class="cal-event-cost">${ev.avg_cost.toFixed(0)} ${currencySymbol}</span>`
            : nothing}
        </div>
      `;
    };

    const renderDayRow = (bucket: { date: string; events: CalendarEvent[] }) => {
      const [y, m, d] = bucket.date.split("-").map(Number);
      const date = new Date(y, m - 1, d);
      const isToday = bucket.date === todayIso;
      const weekday = date.toLocaleDateString(L, { weekday: "short" });
      const monthLabel = date.toLocaleDateString(L, { month: "long" });
      return html`
        <div class="cal-day-row">
          <div class="cal-day-pill ${isToday ? "cal-today" : ""}">
            <span class="cal-pill-weekday">${weekday}</span>
            <span class="cal-pill-day">${date.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${monthLabel}</span>
              ${isToday ? html`<span class="cal-day-today-badge">${t("today", L)}</span>` : nothing}
            </div>
            ${bucket.events.length === 0
              ? html`<div class="cal-empty">${t("cal_no_events", L)}</div>`
              : bucket.events.map(renderEvent)}
          </div>
        </div>
      `;
    };

    return html`
      <ha-card .header=${title}>
        ${showChips || showUserFilter
          ? html`
              <div class="cal-controls">
                ${showChips
                  ? html`
                      <div class="cal-window-chips cal-past-chips" title="${t("cal_past_windows", L) || "Past windows"}">
                        ${[30, 90].map((p) => html`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays === p ? "active" : ""}"
                            @click=${() => {
                              this._pastDays = p as PastDays;
                            }}>
                            −${p}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${t("cal_forward_windows", L) || "Forward windows"}">
                        ${[7, 14, 30, 365].map((w) => html`
                          <button class="cal-window-chip ${this._pastDays === 0 && this._windowDays === w ? "active" : ""}"
                            @click=${() => {
                              this._windowDays = w as WindowDays;
                              this._pastDays = 0;
                            }}>
                            ${w === 365 ? "+1y" : `+${w}d`}
                          </button>
                        `)}
                      </div>
                    `
                  : nothing}
                ${showUserFilter
                  ? html`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${(e: Event) => {
                          this._userFilter = (e.target as HTMLSelectElement).value;
                        }}>
                        <option value="">${t("all_users", L)}</option>
                        <option value="current_user">${t("my_tasks", L)}</option>
                      </select>
                    `
                  : nothing}
                ${showObjectFilter
                  ? html`
                      <select class="cal-user-filter"
                        .value=${filterEntryId ?? ""}
                        @change=${(e: Event) => {
                          this._objectFilter = (e.target as HTMLSelectElement).value;
                        }}>
                        <option value="">${t("all_objects", L)}</option>
                        ${[...base]
                          .sort((a, b) => a.object.name.localeCompare(b.object.name))
                          .map(
                            (o) => html`<option value=${o.entry_id} ?selected=${o.entry_id === filterEntryId}>${o.object.name}</option>`,
                          )}
                      </select>
                    `
                  : nothing}
              </div>
            `
          : nothing}
        <div class="cal-rolling">
          ${visibleBuckets.length === 0 && hideEmptyDays
            ? html`<div class="cal-empty">${t("cal_no_events", L)}</div>`
            : visibleBuckets.map(renderDayRow)}
        </div>
      </ha-card>
    `;
  }

  static styles = [
    sharedStyles,
    calendarStyles,
    css`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `,
  ];
}

// ── Calendar Card Editor ────────────────────────────────────────────────────
//
// Visual config: pick window_days from a dropdown, toggle the in-card chips
// and user-filter on/off. Same pattern as MaintenanceSupporterCardEditor —
// LitElement with setConfig + dispatched config-changed.

const WINDOW_DAY_OPTIONS: Array<{ value: WindowDays; label: string }> = [
  { value: 7, label: "Week (7 days)" },
  { value: 14, label: "Fortnight (14 days)" },
  { value: 30, label: "Month (30 days, default)" },
  { value: 365, label: "Year (365 days, empty days collapsed)" },
];

class MaintenanceCalendarCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config: CalendarCardConfig = {
    type: "custom:maintenance-supporter-calendar-card",
  };

  setConfig(config: CalendarCardConfig): void {
    this._config = { ...config };
  }

  private _valueChanged(key: keyof CalendarCardConfig, value: unknown): void {
    const newConfig = { ...this._config, [key]: value } as CalendarCardConfig;
    // Drop default-equivalent values so saved YAML stays minimal
    if (key === "show_window_chips" && value === true) {
      delete (newConfig as unknown as Record<string, unknown>).show_window_chips;
    }
    if (key === "show_user_filter" && value === true) {
      delete (newConfig as unknown as Record<string, unknown>).show_user_filter;
    }
    if (key === "show_object_filter" && value === true) {
      delete (newConfig as unknown as Record<string, unknown>).show_object_filter;
    }
    if (key === "title" && (!value || (typeof value === "string" && value.trim() === ""))) {
      delete (newConfig as unknown as Record<string, unknown>).title;
    }
    if (key === "user_filter" && value === "") {
      delete (newConfig as unknown as Record<string, unknown>).user_filter;
    }
    this._config = newConfig;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    const currentWindow = this._config.window_days ?? 30;
    const showChips = this._config.show_window_chips !== false;
    const showUserFilter = this._config.show_user_filter !== false;
    const userFilter = this._config.user_filter ?? "";
    const title = this._config.title ?? "";
    return html`
      <div class="editor">
        <div class="row">
          <label for="title">Title (optional)</label>
          <input
            id="title"
            type="text"
            .value=${title}
            @input=${(e: Event) =>
              this._valueChanged("title", (e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="row">
          <label for="window">Default window</label>
          <select
            id="window"
            @change=${(e: Event) =>
              this._valueChanged(
                "window_days",
                Number((e.target as HTMLSelectElement).value) as WindowDays,
              )}
          >
            ${WINDOW_DAY_OPTIONS.map(
              (o) =>
                html`<option value="${o.value}" ?selected=${o.value === currentWindow}>${o.label}</option>`,
            )}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">Show window chips inside the card</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${showChips}
            @change=${(e: Event) =>
              this._valueChanged(
                "show_window_chips",
                (e.target as HTMLInputElement).checked,
              )}
          />
        </div>
        <div class="hint">
          Hide the chips when the card is embedded in a strategy view that
          already serves as the window selector.
        </div>
        <div class="row toggle">
          <label for="userf">Show user filter dropdown</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${showUserFilter}
            @change=${(e: Event) =>
              this._valueChanged(
                "show_user_filter",
                (e.target as HTMLInputElement).checked,
              )}
          />
        </div>
        <div class="row">
          <label for="userv">Default user filter</label>
          <select
            id="userv"
            @change=${(e: Event) =>
              this._valueChanged(
                "user_filter",
                (e.target as HTMLSelectElement).value,
              )}
          >
            <option value="" ?selected=${userFilter === ""}>All users</option>
            <option value="current_user" ?selected=${userFilter === "current_user"}>
              My tasks (current user)
            </option>
          </select>
        </div>
        <div class="row toggle">
          <label for="objf">Show object filter dropdown</label>
          <input
            id="objf"
            type="checkbox"
            .checked=${this._config.show_object_filter !== false}
            @change=${(e: Event) =>
              this._valueChanged(
                "show_object_filter",
                (e.target as HTMLInputElement).checked,
              )}
          />
        </div>
        <div class="hint">
          Pre-select one object via YAML: object_filter: "&lt;object name&gt;" — or a
          list of names to restrict the card to several objects.
        </div>
      </div>
    `;
  }

  static styles = css`
    :host { display: block; padding: 8px 0; }
    .editor { display: flex; flex-direction: column; gap: 12px; }
    .row { display: flex; flex-direction: column; gap: 4px; }
    .row.toggle {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    label { font-weight: 500; color: var(--primary-text-color); font-size: 14px; }
    input[type="text"], select {
      padding: 8px;
      font-size: 14px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color, black);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
    }
    .hint {
      margin-top: -4px;
      font-size: 12px;
      color: var(--secondary-text-color, #666);
    }
  `;
}

if (!customElements.get("maintenance-supporter-calendar-card")) {
  customElements.define(
    "maintenance-supporter-calendar-card",
    MaintenanceCalendarCard,
  );
}
if (!customElements.get("maintenance-supporter-calendar-card-editor")) {
  customElements.define(
    "maintenance-supporter-calendar-card-editor",
    MaintenanceCalendarCardEditor,
  );
}

// Register with HACS / customCards so the picker shows it
const w = window as unknown as {
  customCards?: Array<{
    type: string;
    name: string;
    description: string;
    preview?: boolean;
  }>;
};
w.customCards = w.customCards || [];
// HA's custom-card resolver maps ``custom:X`` → element tag ``X``. Our element
// is registered as ``maintenance-supporter-calendar-card``, so the customCards
// type MUST match that exact suffix or the card-picker entry resolves to a
// non-existent element and the strategy's calendar mode throws a config error.
const CALENDAR_CARD_TYPE = "maintenance-supporter-calendar-card";
const alreadyRegistered = w.customCards.some(
  (c) => c.type === CALENDAR_CARD_TYPE,
);
if (!alreadyRegistered) {
  w.customCards.push({
    type: CALENDAR_CARD_TYPE,
    name: "Maintenance Supporter — Calendar",
    description:
      "Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",
    preview: true,
  });
}

export {};
