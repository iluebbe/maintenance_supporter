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
 *   type: custom:maintenance-supporter-calendar
 *   title: My maintenance calendar  # optional
 *   window_days: 30                  # 7 | 14 | 30 | 365 — default 30
 *   show_window_chips: true          # default true; hide for embedded use
 *   show_user_filter: true           # default true
 *   user_filter: ""                  # "" | "current_user" | "<uuid>"
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import {
  buildCalendarBuckets,
  isoDateLocal,
  type CalendarEvent,
} from "./helpers/calendar-bucket";
import { calendarStyles } from "./calendar-styles";
import { sharedStyles, t } from "./styles";
import type {
  HomeAssistant,
  MaintenanceObjectResponse,
  StatisticsResponse,
} from "./types";

type WindowDays = 7 | 14 | 30 | 365;

interface CalendarCardConfig {
  type: string;
  title?: string;
  window_days?: WindowDays;
  show_window_chips?: boolean;
  show_user_filter?: boolean;
  user_filter?: string;
}

export class MaintenanceCalendarCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config: CalendarCardConfig = {
    type: "custom:maintenance-supporter-calendar",
  };
  @state() private _objects: MaintenanceObjectResponse[] = [];
  @state() private _stats: StatisticsResponse | null = null;
  @state() private _windowDays: WindowDays = 30;
  @state() private _userFilter = "";
  @state() private _unsub: (() => void) | null = null;

  private _dataLoaded = false;
  private _lastConnection: unknown = null;

  static getConfigElement() {
    return document.createElement("maintenance-supporter-calendar-card-editor");
  }

  static getStubConfig() {
    // Opinionated default: 30-day rolling window, both controls visible.
    return {
      type: "custom:maintenance-supporter-calendar",
      window_days: 30,
      show_window_chips: true,
      show_user_filter: true,
    };
  }

  setConfig(config: CalendarCardConfig): void {
    this._config = { ...config };
    if (config.window_days && [7, 14, 30, 365].includes(config.window_days)) {
      this._windowDays = config.window_days as WindowDays;
    }
    if (typeof config.user_filter === "string") {
      this._userFilter = config.user_filter;
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
      this._unsub = await this.hass.connection.subscribeMessage(
        (msg: unknown) => {
          const data = msg as { objects: MaintenanceObjectResponse[] };
          this._objects = data.objects;
        },
        { type: "maintenance_supporter/subscribe" },
      );
    } catch {
      // Subscription failed
    }
  }

  private _onEventClick(ev: CalendarEvent): void {
    // Dispatch ll-custom — strategy bundle catches it and either opens the
    // task dialog in-place or deep-links the panel.
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const buckets = buildCalendarBuckets(
      this._objects,
      today,
      this._windowDays,
      userFilter,
    );

    const todayIso = isoDateLocal(today);
    const hideEmptyDays = this._windowDays === 365;
    const visibleBuckets = hideEmptyDays
      ? buckets.filter((b) => b.events.length > 0)
      : buckets;

    const renderEvent = (ev: CalendarEvent) => {
      const statusClass = `cal-status-${ev.status}`;
      const projClass = ev.projected ? "cal-event-projected" : "";
      const overdueLabel = ev.status === "overdue" && ev.days_until_due != null
        ? ` (${Math.abs(ev.days_until_due)}d ${t("overdue", L).toLowerCase()})`
        : "";
      const recurEvery = ev.projected && ev.interval_days
        ? html`<span class="cal-event-recur">${t("cal_every_n_days", L).replace("{n}", String(ev.interval_days))}</span>`
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
      const currencySymbol = this._stats?.budget?.currency_symbol || "€";
      return html`
        <div class="cal-event ${projClass}"
          @click=${() => this._onEventClick(ev)}>
          ${sourceIcon}
          <span class="cal-status-pill ${statusClass}">${t(ev.status, L)}</span>
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
                      <div class="cal-window-chips">
                        ${[7, 14, 30, 365].map((w) => html`
                          <button class="cal-window-chip ${this._windowDays === w ? "active" : ""}"
                            @click=${() => { this._windowDays = w as WindowDays; }}>
                            ${t(`cal_window_${w}`, L)}
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

if (!customElements.get("maintenance-supporter-calendar-card")) {
  customElements.define(
    "maintenance-supporter-calendar-card",
    MaintenanceCalendarCard,
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
const alreadyRegistered = w.customCards.some(
  (c) => c.type === "maintenance-supporter-calendar",
);
if (!alreadyRegistered) {
  w.customCards.push({
    type: "maintenance-supporter-calendar",
    name: "Maintenance Supporter — Calendar",
    description:
      "Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",
    preview: true,
  });
}

export {};
