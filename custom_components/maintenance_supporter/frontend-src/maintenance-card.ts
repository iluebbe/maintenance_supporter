/** Maintenance Supporter Lovelace Card. */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { sharedStyles, STATUS_COLORS, t, ensureLocale, isLocaleLoaded } from "./styles";
import type {
  HomeAssistant,
  MaintenanceObjectResponse,
  MaintenanceTask,
  StatisticsResponse,
  CardConfig,
  SavedView,
  SavedViewFilters,
} from "./types";
import "./maintenance-card-editor";
import "./components/complete-dialog";
import {
  openCreateObjectDialog,
  openCreateTaskDialog,
  openTaskQuickActions,
} from "./dialog-mount";

interface FlatTask {
  entry_id: string;
  object_name: string;
  task: MaintenanceTask;
}

export class MaintenanceSupporterCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config: CardConfig = { type: "custom:maintenance-supporter-card" };
  @state() private _objects: MaintenanceObjectResponse[] = [];
  @state() private _stats: StatisticsResponse | null = null;
  @state() private _unsub: (() => void) | null = null;
  @state() private _viewFilters: SavedViewFilters | null = null;

  private get _lang(): string {
    return this.hass?.language || "en";
  }

  static getConfigElement() {
    return document.createElement("maintenance-supporter-card-editor");
  }

  static getStubConfig() {
    // Opinionated default: when a user picks "Maintenance Supporter" from the
    // card picker, show only the actionable tasks (overdue + triggered + due
    // soon, max 10) — not the full task list which is overwhelming on first
    // add. The user can broaden the filter via the editor afterwards.
    return {
      type: "custom:maintenance-supporter-card",
      show_header: true,
      show_actions: true,
      filter_status: ["overdue", "triggered", "due_soon"],
      max_items: 10,
    };
  }

  setConfig(config: CardConfig): void {
    const viewChanged = config.view_id !== this._config.view_id;
    this._config = config;
    // Config can change after the initial load (editor preview) — re-resolve
    // the referenced view then; the initial resolve happens in _loadData.
    if (viewChanged && this._dataLoaded && this.hass) {
      this._loadViewFilters();
    }
  }

  getCardSize(): number {
    return 3;
  }

  private _dataLoaded = false;
  private _lastConnection: unknown = null;

  connectedCallback(): void {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._unsub) {
      this._unsub();
      this._unsub = null;
    }
    this._dataLoaded = false;
    this._lastConnection = null;
  }

  updated(changedProps: Map<string, unknown>): void {
    super.updated(changedProps);
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
        this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/objects" }),
        this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/statistics" }),
      ]);
      this._objects = (objResult as { objects: MaintenanceObjectResponse[] }).objects;
      this._stats = statsResult as StatisticsResponse;
    } catch {
      // WS not available yet
    }
    await this._loadViewFilters();
  }

  /** Resolve the configured saved view's filters (best-effort). A missing or
   *  deleted view degrades to "no view filter" — same fallback semantics as
   *  the backend's notification routing, never an inexplicably empty card. */
  private async _loadViewFilters(): Promise<void> {
    if (!this._config.view_id) {
      this._viewFilters = null;
      return;
    }
    try {
      const res = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/views/list",
      }) as { views: SavedView[] };
      const view = (res.views || []).find((v) => v.id === this._config.view_id);
      this._viewFilters = view ? view.filters : null;
    } catch {
      this._viewFilters = null;
    }
  }

  private async _subscribe(): Promise<void> {
    try {
      const unsub = await this.hass.connection.subscribeMessage(
        (msg: unknown) => {
          const data = msg as { objects: MaintenanceObjectResponse[] };
          this._objects = data.objects;
        },
        { type: "maintenance_supporter/subscribe" }
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

  private get _flatTasks(): FlatTask[] {
    const tasks: FlatTask[] = [];
    const {
      filter_status,
      filter_objects,
      entity_ids,
      filter_due_min_days,
      filter_due_max_days,
      max_items,
    } = this._config;
    const entityFilter = entity_ids?.length ? new Set(entity_ids) : null;
    const hasDueRange =
      filter_due_min_days !== undefined || filter_due_max_days !== undefined;
    // Saved-view scope: unlike the panel (where applying a view REPLACES the
    // filter state), the card ANDs the view's task-selecting filters with its
    // own config — the card's filters are static YAML, not transient UI state.
    // The view's `current_user` sentinel resolves against the logged-in user
    // here (client-side), which the backend notification routing cannot do.
    const vf = this._viewFilters;
    const viewUser =
      vf?.user_id === "current_user" ? (this.hass.user?.id ?? null) : (vf?.user_id ?? null);

    for (const obj of this._objects) {
      if (filter_objects?.length && !filter_objects.includes(obj.object.name)) continue;
      for (const task of obj.tasks) {
        // Completed one-time tasks ("done") are hidden from the active list.
        if (task.is_done) continue;
        // v2.10.0: archived tasks (and tasks of an archived object) are inert —
        // never shown on the Lovelace card.
        if (task.archived || obj.object.archived) continue;
        if (filter_status?.length && !filter_status.includes(task.status)) continue;
        // entity_ids: HA-native filter — match the task's sensor or
        // binary_sensor entity_id. Both fields come pre-resolved from the
        // backend WS response (see _build_task_summary in websocket/__init__.py).
        if (entityFilter) {
          const matches = (task.sensor_entity_id && entityFilter.has(task.sensor_entity_id))
            || (task.binary_sensor_entity_id && entityFilter.has(task.binary_sensor_entity_id));
          if (!matches) continue;
        }
        // due-days range — used by group_by=due_date strategy buckets.
        // Tasks without a numeric days_until_due are excluded from any
        // ranged view; they show up in unfiltered or status-only views.
        if (hasDueRange) {
          const days = task.days_until_due;
          if (days === null || days === undefined) continue;
          if (filter_due_min_days !== undefined && days < filter_due_min_days) continue;
          if (filter_due_max_days !== undefined && days > filter_due_max_days) continue;
        }
        if (vf) {
          if (vf.status && task.status !== vf.status) continue;
          if (vf.label && !(task.labels || []).includes(vf.label)) continue;
          if (viewUser && task.responsible_user_id !== viewUser) continue;
        }
        tasks.push({ entry_id: obj.entry_id, object_name: obj.object.name, task });
      }
    }

    const order: Record<string, number> = { overdue: 0, triggered: 1, due_soon: 2, ok: 3 };
    tasks.sort((a, b) => {
      const byStatus = (order[a.task.status] ?? 9) - (order[b.task.status] ?? 9);
      if (byStatus !== 0) return byStatus;
      // Within a status, soonest-due first; tasks without a due date go last.
      return (a.task.days_until_due ?? Infinity) - (b.task.days_until_due ?? Infinity);
    });

    if (max_items && max_items > 0) {
      return tasks.slice(0, max_items);
    }
    return tasks;
  }

  private _onCompleted = async (): Promise<void> => {
    await this._loadData();
  };

  /** Open the per-task quick-actions dialog (Complete / Skip / Reset / Edit /
   *  QR / Delete) — full per-task panel parity. Mounted on document.body via
   *  the shared dialog-mount helper, so the card works on any dashboard
   *  without depending on the strategy bundle's ll-custom handler. */
  private _openTaskDetail(entryId: string, taskId: string): void {
    openTaskQuickActions(entryId, taskId);
  }

  render() {
    const L = this._lang;
    const title = this._config.title || t("maintenance", L);
    const showHeader = this._config.show_header !== false;
    const showActions = this._config.show_actions !== false;
    const compact = this._config.compact || false;
    const tasks = this._flatTasks;
    const s = this._stats;

    return html`
      <ha-card>
        <div class="card-header">
          <h1>${title}</h1>
          <div class="header-right">
            ${showHeader && s
              ? html`
                  <div class="header-stats">
                    ${s.overdue > 0 ? html`<span class="badge overdue">${s.overdue}</span>` : nothing}
                    ${s.due_soon > 0 ? html`<span class="badge due_soon">${s.due_soon}</span>` : nothing}
                    ${s.triggered > 0 ? html`<span class="badge triggered">${s.triggered}</span>` : nothing}
                  </div>
                `
              : nothing}
            ${showActions
              ? html`
                  <mwc-icon-button
                    class="hdr-add"
                    title="${t("new_object", L)}"
                    @click=${() => openCreateObjectDialog()}
                  >
                    <ha-icon icon="mdi:plus-box"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button
                    class="hdr-add"
                    title="${t("add_task", L)}"
                    @click=${() => openCreateTaskDialog()}
                  >
                    <ha-icon icon="mdi:playlist-plus"></ha-icon>
                  </mwc-icon-button>
                `
              : nothing}
          </div>
        </div>
        ${tasks.length === 0
          ? this._objects.some((o) => o.tasks.length > 0)
            ? html`<div class="empty-card">
                <!-- (#86) tasks exist but none match the filter (default:
                     actionable-only) — "all caught up", NOT "no tasks yet". -->
                <div class="all-caught-up">✓ ${t("card_all_caught_up", L)}</div>
              </div>`
            : html`<div class="empty-card">
                <div>${t("card_no_tasks_title", L)}</div>
                <a class="empty-link" href="/maintenance-supporter">${t("card_no_tasks_cta", L)}</a>
              </div>`
          : html`
              <div class="task-list ${compact ? "compact" : ""}">
                ${tasks.map(
                  ({ entry_id, object_name, task }) => html`
                    <div class="task-item clickable"
                         @click=${() => this._openTaskDetail(entry_id, task.id)}
                         title="${t("open_task", L) || "Open task"}">
                      <div class="status-dot" style="background: ${STATUS_COLORS[task.status] || "#ccc"}"></div>
                      <div class="task-info">
                        <div class="task-name">
                          ${task.name}
                          ${(task as any).due_override
                            ? html`<ha-icon
                                class="postponed-icon"
                                icon="mdi:calendar-clock"
                                title="${t("postponed", L) || "Postponed"}"
                              ></ha-icon>`
                            : nothing}
                        </div>
                        ${!compact ? html`<div class="task-meta">${object_name} · ${t(task.type, L)}</div>` : nothing}
                      </div>
                      <div class="task-due">
                        ${task.days_until_due !== null && task.days_until_due !== undefined
                          ? task.days_until_due < 0
                            ? html`<span class="overdue-text">${Math.abs(task.days_until_due)}${L.startsWith("de") ? "T" : "d"}</span>`
                            : task.days_until_due === 0
                            ? t("today", L)
                            : `${task.days_until_due}${L.startsWith("de") ? "T" : "d"}`
                          : task.trigger_active
                          ? "⚡"
                          : "—"}
                      </div>
                      ${showActions
                        ? html`
                            <mwc-icon-button
                              class="complete-btn"
                              title="${t("complete", L)}"
                              @click=${(e: Event) => {
                                // Stop the row's open-task handler from also firing
                                e.stopPropagation();
                                const dlg = this.shadowRoot!.querySelector("maintenance-complete-dialog") as any;
                                dlg.entryId = entry_id;
                                dlg.taskId = task.id;
                                dlg.taskName = task.name;
                                dlg.checklist = task.checklist || [];
                                dlg.adaptiveEnabled = !!task.adaptive_config?.enabled;
                                dlg.taskType = task.type || "";
                                dlg.readingUnit = (task as any).reading_unit || "";
                                dlg.lang = L;
                                dlg.open();
                              }}
                            >
                              <ha-icon icon="mdi:check"></ha-icon>
                            </mwc-icon-button>
                          `
                        : nothing}
                    </div>
                  `
                )}
              </div>
            `}
      </ha-card>
      <maintenance-complete-dialog
        .hass=${this.hass}
        @task-completed=${this._onCompleted}
      ></maintenance-complete-dialog>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      ha-card { overflow: hidden; }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 16px 8px;
      }

      .card-header h1 { margin: 0; font-size: 18px; font-weight: 500; }
      .header-right { display: flex; align-items: center; gap: 6px; }
      .header-stats { display: flex; gap: 6px; }
      .hdr-add {
        --mdc-icon-button-size: 32px;
        --mdc-icon-size: 20px;
        color: var(--primary-color);
      }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 22px;
        height: 22px;
        border-radius: 11px;
        font-size: 12px;
        font-weight: 600;
        color: white;
        padding: 0 6px;
      }

      .badge.overdue { background: var(--error-color, #f44336); }
      .badge.due_soon { background: var(--warning-color, #ff9800); }
      .badge.triggered { background: #ff5722; }

      .empty-card {
        padding: 24px 16px;
        text-align: center;
        color: var(--secondary-text-color);
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
      }
      .empty-link {
        color: var(--primary-color);
        text-decoration: none;
        font-size: 13px;
      }
      .empty-link:hover { text-decoration: underline; }
      .all-caught-up { color: var(--success-color, #4caf50); font-weight: 500; }
      .task-list { padding: 0 16px 16px; }

      .task-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      .task-item:last-child { border-bottom: none; }
      .task-list.compact .task-item { padding: 4px 0; }
      /* Row click opens the task editor (in-place via the strategy bundle's
         ll-custom handler). Hover state hints that the row is interactive. */
      .task-item.clickable { cursor: pointer; transition: background 0.12s; }
      .task-item.clickable:hover {
        background: var(--state-icon-color, rgba(255,255,255,0.04));
      }

      .status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
      .task-info { flex: 1; min-width: 0; }
      .task-name { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .postponed-icon { --mdc-icon-size: 14px; color: var(--secondary-text-color); vertical-align: text-bottom; margin-inline-start: 4px; }
      .task-meta { font-size: 12px; color: var(--secondary-text-color); }

      .task-due { font-size: 13px; color: var(--secondary-text-color); min-width: 40px; text-align: right; }
      .overdue-text { color: var(--error-color); font-weight: 500; }

      .complete-btn {
        --mdc-icon-button-size: 32px;
        --mdc-icon-size: 18px;
        color: var(--primary-color);
      }
    `,
  ];
}

// Module-bottom registration so esbuild's tree-shaker doesn't drop the
// element class when the only reference is the @customElement decorator
// (which triggered this exact bug for the dialog components — issue #32:
// "card not showing in the card selector, busy spinner only").
if (!customElements.get("maintenance-supporter-card")) {
  customElements.define("maintenance-supporter-card", MaintenanceSupporterCard);
}

// Register as custom card so the Lovelace card picker lists it.
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "maintenance-supporter-card",
  name: "Maintenance Supporter",
  description: "Overview of your maintenance tasks with quick actions.",
  preview: true,
});
