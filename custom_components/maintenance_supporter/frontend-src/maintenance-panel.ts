/** Maintenance Supporter Sidebar Panel. */

import { LitElement, html, css, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { sharedStyles, STATUS_COLORS, STATUS_ICONS, t, formatDate, formatDateTime, formatDueDays } from "./styles";
import type {
  HomeAssistant,
  MaintenanceObjectResponse,
  MaintenanceTask,
  MaintenanceGroup,
  StatisticsResponse,
  BudgetStatus,
  AdvancedFeatures,
  TaskRow,
  HistoryEntry,
  TriggerEntityInfo,
  TriggerConfig,
  StatisticsPoint,
  HAUser,
} from "./types";
import { StatisticsService } from "./statistics-service";
import { UserService } from "./user-service";
import "./components/object-dialog";
import type { MaintenanceObjectDialog } from "./components/object-dialog";
import "./components/task-dialog";
import type { MaintenanceTaskDialog } from "./components/task-dialog";
import { MaintenanceCompleteDialog } from "./components/complete-dialog";
import "./components/qr-dialog";
import type { MaintenanceQrDialog } from "./components/qr-dialog";

type View = "overview" | "object" | "task";

// Chart dimension constants
const MINI_SPARKLINE_W = 60;
const MINI_SPARKLINE_H = 20;
const DETAIL_SPARKLINE_W = 300;
const DETAIL_SPARKLINE_H = 140;
const COST_CHART_W = 300;
const COST_CHART_H = 200; // Increased from 120px for better readability
const MAX_MINI_POINTS = 30;
const MAX_HOVER_TARGETS = 27;

@customElement("maintenance-supporter-panel")
export class MaintenanceSupporterPanel extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Boolean }) public narrow = false;
  @property({ attribute: false }) public panel: Record<string, unknown> = {};

  @state() private _objects: MaintenanceObjectResponse[] = [];
  @state() private _stats: StatisticsResponse | null = null;
  @state() private _view: View = "overview";
  @state() private _selectedEntryId: string | null = null;
  @state() private _selectedTaskId: string | null = null;
  @state() private _filterStatus = "";
  @state() private _filterUser: string | null = null;
  @state() private _unsub: (() => void) | null = null;
  @state() private _sparklineTooltip: { x: number; y: number; text: string } | null = null;
  @state() private _historyFilter: string | null = null;
  @state() private _budget: BudgetStatus | null = null;
  @state() private _groups: Record<string, MaintenanceGroup> = {};
  @state() private _detailStatsData: Map<string, StatisticsPoint[]> = new Map();
  @state() private _miniStatsData: Map<string, StatisticsPoint[]> = new Map();
  @state() private _features: AdvancedFeatures = { adaptive: false, predictions: false, seasonal: false, environmental: false, budget: false, groups: false, checklists: false };

  // Dashboard redesign state
  @state() private _activeTab: "overview" | "analysis" | "history" = "overview";
  @state() private _costDurationToggle: "cost" | "duration" | "both" = "both";
  @state() private _historyTimeRange: 3 | 6 | 12 | 0 = 12; // months, 0 = all
  @state() private _historySearch = "";

  private _statsService: StatisticsService | null = null;
  private _userService: UserService | null = null;

  private get _lang(): string {
    return this.hass?.language || "de";
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._loadData();
    this._subscribe();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._unsub) {
      this._unsub();
      this._unsub = null;
    }
    this._statsService?.clearCache();
    this._statsService = null;
  }

  updated(changedProps: Map<string, unknown>): void {
    super.updated(changedProps);
    if (changedProps.has("hass") && this.hass) {
      if (!this._statsService) {
        this._statsService = new StatisticsService(this.hass);
        // Fetch mini stats now that service is ready
        this._fetchMiniStatsForOverview();
      } else {
        this._statsService.updateHass(this.hass);
      }

      // Initialize user service
      if (!this._userService) {
        this._userService = new UserService(this.hass);
        // Pre-load users for badges
        this._userService.getUsers();
      }
    }
  }

  private async _loadData(): Promise<void> {
    const [objResult, statsResult, budgetResult, groupsResult, settingsResult] = await Promise.all([
      this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/objects" }),
      this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/statistics" }),
      this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/budget_status" }).catch(() => null),
      this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/groups" }).catch(() => null),
      this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/settings" }).catch(() => null),
    ]);
    this._objects = (objResult as { objects: MaintenanceObjectResponse[] }).objects;
    this._stats = statsResult as StatisticsResponse;
    if (budgetResult) this._budget = budgetResult as BudgetStatus;
    if (groupsResult) this._groups = (groupsResult as { groups: Record<string, MaintenanceGroup> }).groups || {};
    if (settingsResult) this._features = (settingsResult as { features: AdvancedFeatures }).features;

    // Fetch mini-sparkline data for overview (non-blocking)
    this._fetchMiniStatsForOverview();

    // Handle deep-link URL parameters (from QR code scan)
    this._handleDeepLink();
  }

  private _deepLinkHandled = false;

  private _handleDeepLink(): void {
    if (this._deepLinkHandled) return;
    const params = new URLSearchParams(window.location.search);
    const entryId = params.get("entry_id");
    if (!entryId) return;
    this._deepLinkHandled = true;

    const taskId = params.get("task_id");
    const action = params.get("action");

    // Clean URL to prevent re-trigger on refresh
    const cleanUrl = window.location.pathname + window.location.hash;
    history.replaceState(null, "", cleanUrl);

    // Navigate to the right view
    if (taskId) {
      this._showTask(entryId, taskId);
      if (action === "complete") {
        // Wait a tick for view to render, then open complete dialog
        requestAnimationFrame(() => {
          const obj = this._getObject(entryId);
          const task = obj?.tasks.find((t) => t.id === taskId);
          if (task) {
            this._openCompleteDialog(entryId, taskId, task.name, this._features.checklists ? task.checklist : undefined, this._features.adaptive && !!task.adaptive_config?.enabled);
          }
        });
      }
    } else {
      this._showObject(entryId);
    }
  }

  private _isCounterEntity(tc: TriggerConfig | null | undefined): boolean {
    if (!tc) return false;
    const type = tc.type || "threshold";
    return type === "counter" || type === "state_change";
  }

  private async _fetchDetailStats(entityId: string, isCounter: boolean): Promise<void> {
    if (!this._statsService) return;
    const points = await this._statsService.getDetailStats(entityId, isCounter);
    const updated = new Map(this._detailStatsData);
    updated.set(entityId, points);
    this._detailStatsData = updated;
  }

  private async _fetchMiniStatsForOverview(): Promise<void> {
    if (!this._statsService) return;
    const updated = new Map(this._miniStatsData);
    const promises: Promise<void>[] = [];

    for (const obj of this._objects) {
      for (const task of obj.tasks) {
        const entityId = task.trigger_config?.entity_id;
        if (!entityId) continue;
        const isCounter = this._isCounterEntity(task.trigger_config);
        promises.push(
          this._statsService!.getMiniStats(entityId, isCounter).then((points) => {
            updated.set(entityId, points);
          })
        );
      }
    }

    if (promises.length > 0) {
      await Promise.all(promises);
      this._miniStatsData = updated;
    }
  }

  private async _subscribe(): Promise<void> {
    try {
      this._unsub = await this.hass.connection.subscribeMessage(
        (msg: unknown) => {
          const data = msg as { objects: MaintenanceObjectResponse[] };
          this._objects = data.objects;
        },
        { type: "maintenance_supporter/subscribe" }
      );
    } catch {
      // Subscription failed; fall back to polling
    }
  }

  // --- Data accessors ---

  private get _taskRows(): TaskRow[] {
    const rows: TaskRow[] = [];
    for (const obj of this._objects) {
      for (const task of obj.tasks) {
        if (this._filterStatus && task.status !== this._filterStatus) continue;

        // User filter
        if (this._filterUser) {
          const userId = this._filterUser === "current_user"
            ? this._userService?.getCurrentUserId()
            : this._filterUser;
          if (task.responsible_user_id !== userId) continue;
        }

        rows.push({
          entry_id: obj.entry_id,
          task_id: task.id,
          object_name: obj.object.name,
          task_name: task.name,
          type: task.type,
          schedule_type: task.schedule_type,
          status: task.status,
          days_until_due: task.days_until_due ?? null,
          next_due: task.next_due ?? null,
          trigger_active: task.trigger_active,
          trigger_current_value: task.trigger_current_value ?? null,
          trigger_current_delta: task.trigger_current_delta ?? null,
          trigger_config: task.trigger_config ?? null,
          trigger_entity_info: task.trigger_entity_info ?? null,
          times_performed: task.times_performed,
          total_cost: task.total_cost,
          interval_days: task.interval_days ?? null,
          history: task.history || [],
        });
      }
    }
    const order: Record<string, number> = { overdue: 0, triggered: 1, due_soon: 2, ok: 3 };
    rows.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
    return rows;
  }

  private _getObject(entryId: string): MaintenanceObjectResponse | undefined {
    return this._objects.find((o) => o.entry_id === entryId);
  }

  private _getTask(entryId: string, taskId: string): MaintenanceTask | undefined {
    const obj = this._getObject(entryId);
    return obj?.tasks.find((t) => t.id === taskId);
  }

  // --- Navigation ---

  private _showOverview(): void {
    this._view = "overview";
    this._selectedEntryId = null;
    this._selectedTaskId = null;
  }

  private _showObject(entryId: string): void {
    this._view = "object";
    this._selectedEntryId = entryId;
    this._selectedTaskId = null;
  }

  private _showTask(entryId: string, taskId: string): void {
    this._view = "task";
    this._selectedEntryId = entryId;
    this._selectedTaskId = taskId;
    this._historyFilter = null;

    // Lazy-load statistics for the task's trigger entity
    const task = this._getTask(entryId, taskId);
    if (task?.trigger_config?.entity_id) {
      const entityId = task.trigger_config.entity_id;
      const isCounter = this._isCounterEntity(task.trigger_config);
      this._fetchDetailStats(entityId, isCounter);
    }
  }

  // --- Actions ---

  private async _deleteObject(entryId: string): Promise<void> {
    if (!confirm(t("confirm_delete_object", this._lang))) return;
    await this.hass.connection.sendMessagePromise({
      type: "maintenance_supporter/object/delete",
      entry_id: entryId,
    });
    this._showOverview();
    await this._loadData();
  }

  private async _deleteTask(entryId: string, taskId: string): Promise<void> {
    if (!confirm(t("confirm_delete_task", this._lang))) return;
    await this.hass.connection.sendMessagePromise({
      type: "maintenance_supporter/task/delete",
      entry_id: entryId,
      task_id: taskId,
    });
    this._showObject(entryId);
    await this._loadData();
  }

  private async _skipTask(entryId: string, taskId: string): Promise<void> {
    await this.hass.connection.sendMessagePromise({
      type: "maintenance_supporter/task/skip",
      entry_id: entryId,
      task_id: taskId,
    });
    await this._loadData();
  }

  private async _resetTask(entryId: string, taskId: string): Promise<void> {
    await this.hass.connection.sendMessagePromise({
      type: "maintenance_supporter/task/reset",
      entry_id: entryId,
      task_id: taskId,
    });
    await this._loadData();
  }

  private async _applySuggestion(entryId: string, taskId: string, interval: number): Promise<void> {
    await this.hass.connection.sendMessagePromise({
      type: "maintenance_supporter/task/apply_suggestion",
      entry_id: entryId,
      task_id: taskId,
      interval: interval,
    });
    await this._loadData();
  }

  private _dismissSuggestion(): void {
    // Just reload to clear the badge for this session
    // (suggestion will reappear on next data refresh if still valid)
    this._loadData();
  }

  private _openCompleteDialog(entryId: string, taskId: string, taskName: string, checklist?: string[], adaptiveEnabled?: boolean): void {
    const dlg = this.shadowRoot!.querySelector<MaintenanceCompleteDialog>("maintenance-complete-dialog");
    if (!dlg) return;
    dlg.entryId = entryId;
    dlg.taskId = taskId;
    dlg.taskName = taskName;
    dlg.lang = this._lang;
    dlg.checklist = checklist || [];
    dlg.adaptiveEnabled = !!adaptiveEnabled;
    dlg.open();
  }

  private _openQrForObject(entryId: string, objectName: string): void {
    const dlg = this.shadowRoot!.querySelector<MaintenanceQrDialog>("maintenance-qr-dialog");
    dlg?.openForObject(entryId, objectName);
  }

  private _openQrForTask(entryId: string, taskId: string, objectName: string, taskName: string): void {
    const dlg = this.shadowRoot!.querySelector<MaintenanceQrDialog>("maintenance-qr-dialog");
    dlg?.openForTask(entryId, taskId, objectName, taskName);
  }

  private async _exportCsv(): Promise<void> {
    const result = await this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/csv/export" }) as { csv: string };
    const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "maintenance_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  private _triggerImportCsv(): void {
    const input = this.shadowRoot!.querySelector("input[type=file]") as HTMLInputElement;
    if (input) { input.value = ""; input.click(); }
  }

  private async _handleCsvFile(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = await this.hass.connection.sendMessagePromise({
      type: "maintenance_supporter/csv/import",
      csv_content: text,
    }) as { created: number; total: number };
    await this._loadData();
    alert(`Imported ${result.created} of ${result.total} objects.`);
  }

  private _onDialogEvent = async (): Promise<void> => {
    await this._loadData();
  };

  // --- Render ---

  render() {
    return html`
      <div class="panel">
        ${this._renderHeader()}
        <div class="content">
          ${this._view === "overview"
            ? this._renderOverview()
            : this._view === "object"
            ? this._renderObjectDetail()
            : this._renderTaskDetail()}
        </div>
      </div>
      <maintenance-object-dialog
        .hass=${this.hass}
        @object-saved=${this._onDialogEvent}
      ></maintenance-object-dialog>
      <maintenance-task-dialog
        .hass=${this.hass}
        @task-saved=${this._onDialogEvent}
      ></maintenance-task-dialog>
      <maintenance-complete-dialog
        .hass=${this.hass}
        @task-completed=${this._onDialogEvent}
      ></maintenance-complete-dialog>
      <maintenance-qr-dialog
        .hass=${this.hass}
        .lang=${this._lang}
      ></maintenance-qr-dialog>
    `;
  }

  private _renderHeader() {
    const crumbs: { label: string; action?: () => void }[] = [
      { label: t("maintenance", this._lang), action: () => this._showOverview() },
    ];
    if (this._view === "object" && this._selectedEntryId) {
      const obj = this._getObject(this._selectedEntryId);
      crumbs.push({ label: obj?.object.name || "Object" });
    }
    if (this._view === "task" && this._selectedEntryId && this._selectedTaskId) {
      const obj = this._getObject(this._selectedEntryId);
      crumbs.push({
        label: obj?.object.name || "Object",
        action: () => this._showObject(this._selectedEntryId!),
      });
      const task = this._getTask(this._selectedEntryId, this._selectedTaskId);
      crumbs.push({ label: task?.name || "Task" });
    }

    return html`
      <div class="header">
        <div class="breadcrumbs">
          ${crumbs.map(
            (c, i) => html`
              ${i > 0 ? html`<span class="sep">/</span>` : nothing}
              ${c.action
                ? html`<a @click=${c.action}>${c.label}</a>`
                : html`<span class="current">${c.label}</span>`}
            `
          )}
        </div>
      </div>
    `;
  }

  private _renderOverview() {
    const s = this._stats;
    const rows = this._taskRows;
    const L = this._lang;

    return html`
      ${s
        ? html`
            <div class="stats-bar">
              <div class="stat-item">
                <span class="stat-value">${s.total_objects}</span>
                <span class="stat-label">${t("objects", L)}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">${s.total_tasks}</span>
                <span class="stat-label">${t("tasks", L)}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" style="color: var(--error-color)">${s.overdue}</span>
                <span class="stat-label">${t("overdue", L)}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" style="color: var(--warning-color)">${s.due_soon}</span>
                <span class="stat-label">${t("due_soon", L)}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" style="color: #ff5722">${s.triggered}</span>
                <span class="stat-label">${t("triggered", L)}</span>
              </div>
            </div>
          `
        : nothing}

      ${this._features.budget ? this._renderBudgetBar() : nothing}

      <div class="filter-bar">
        <select
          @change=${(e: Event) => (this._filterStatus = (e.target as HTMLSelectElement).value)}
        >
          <option value="">${t("all", L)}</option>
          <option value="overdue">${t("overdue", L)}</option>
          <option value="due_soon">${t("due_soon", L)}</option>
          <option value="triggered">${t("triggered", L)}</option>
          <option value="ok">${t("ok", L)}</option>
        </select>
        <select
          .value=${this._filterUser || ""}
          @change=${(e: Event) => {
            const val = (e.target as HTMLSelectElement).value;
            this._filterUser = val || null;
          }}
        >
          <option value="">${t("all_users", L)}</option>
          <option value="current_user">${t("my_tasks", L)}</option>
        </select>
        <ha-button
          @click=${() => this.shadowRoot!.querySelector<MaintenanceObjectDialog>("maintenance-object-dialog")?.openCreate()}
        >
          ${t("new_object", L)}
        </ha-button>
        <ha-button @click=${this._exportCsv}>${t("export_csv", L)}</ha-button>
        <ha-button @click=${this._triggerImportCsv}>${t("import_csv", L)}</ha-button>
        <input type="file" accept=".csv" style="display:none" @change=${this._handleCsvFile} />
      </div>

      ${rows.length === 0
        ? html`
            <div class="empty-state">
              <ha-svg-icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></ha-svg-icon>
              <p>${t("no_tasks", L)}</p>
            </div>
          `
        : html`
            <div class="task-table">
              ${rows.map((row) => this._renderOverviewRow(row))}
            </div>
          `}

      ${this._features.groups ? this._renderGroupsSection() : nothing}
    `;
  }

  private _renderGroupsSection() {
    const entries = Object.entries(this._groups);
    if (entries.length === 0) return nothing;
    const L = this._lang;

    return html`
      <div class="groups-section">
        <h3>${t("groups", L)}</h3>
        <div class="groups-grid">
          ${entries.map(([_gid, group]) => {
            const taskNames = group.task_refs.map((ref) => {
              const task = this._getTask(ref.entry_id, ref.task_id);
              return task?.name || ref.task_id;
            });
            return html`
              <div class="group-card">
                <div class="group-card-name">${group.name}</div>
                ${group.description ? html`<div class="group-card-desc">${group.description}</div>` : nothing}
                <div class="group-card-tasks">
                  ${taskNames.length > 0
                    ? taskNames.map((n) => html`<span class="group-task-chip">${n}</span>`)
                    : html`<span style="font-size:12px;color:var(--secondary-text-color)">${t("no_tasks_short", L)}</span>`}
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _renderBudgetBar() {
    const b = this._budget;
    if (!b) return nothing;
    const L = this._lang;
    const bars: { label: string; spent: number; budget: number }[] = [];
    if (b.monthly_budget > 0) bars.push({ label: t("budget_monthly", L), spent: b.monthly_spent, budget: b.monthly_budget });
    if (b.yearly_budget > 0) bars.push({ label: t("budget_yearly", L), spent: b.yearly_spent, budget: b.yearly_budget });
    if (bars.length === 0) return nothing;

    return html`
      <div class="budget-bars">
        ${bars.map((bar) => {
          const pct = Math.min(100, Math.max(0, (bar.spent / bar.budget) * 100));
          const color = pct >= 100 ? "var(--error-color, #f44336)" : pct >= b.alert_threshold_pct ? "var(--warning-color, #ff9800)" : "var(--success-color, #4caf50)";
          return html`
            <div class="budget-item">
              <div class="budget-label">
                <span>${bar.label}</span>
                <span>${bar.spent.toFixed(2)} / ${bar.budget.toFixed(2)}</span>
              </div>
              <div class="budget-bar">
                <div class="budget-bar-fill" style="width:${pct}%; background:${color}"></div>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  private _renderOverviewRow(row: TaskRow) {
    const L = this._lang;
    // Compute days progress bar
    const hasDaysBar = row.schedule_type === "time_based" && row.interval_days && row.interval_days > 0;
    let pct = 0;
    let barColor = STATUS_COLORS.ok;
    let daysOverflow = false;
    if (hasDaysBar && row.days_until_due !== null) {
      const rawPct = ((row.interval_days! - row.days_until_due) / row.interval_days!) * 100;
      pct = Math.max(0, Math.min(100, rawPct));
      daysOverflow = rawPct > 100;
      if (row.status === "overdue") barColor = STATUS_COLORS.overdue;
      else if (row.status === "due_soon") barColor = STATUS_COLORS.due_soon;
    }

    return html`
      <div class="task-row">
        <span class="status-badge ${row.status}">${t(row.status, L)}</span>
        <span class="cell object-name" @click=${(e: Event) => { e.stopPropagation(); this._showObject(row.entry_id); }}>${row.object_name}</span>
        <span class="cell task-name" @click=${() => this._showTask(row.entry_id, row.task_id)}>${row.task_name}</span>
        <span class="cell type">${t(row.type, L)}</span>
        <span class="due-cell" @click=${() => this._showTask(row.entry_id, row.task_id)}>
          <span class="due-text">${formatDueDays(row.days_until_due, L)}</span>
          ${hasDaysBar
            ? html`<div class="days-bar"><div class="days-bar-fill${daysOverflow ? " overflow" : ""}" style="width:${pct}%;background:${barColor}"></div></div>`
            : nothing}
          ${row.trigger_config
            ? this._renderTriggerProgress(row)
            : !hasDaysBar && row.trigger_active
            ? html`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`
            : nothing}
          ${this._renderMiniSparkline(row)}
        </span>
        <span class="row-actions">
          <mwc-icon-button class="btn-complete" title="${t("complete", L)}" @click=${(e: Event) => { e.stopPropagation(); this._openCompleteDialog(row.entry_id, row.task_id, row.task_name); }}>
            <ha-icon icon="mdi:check"></ha-icon>
          </mwc-icon-button>
          <mwc-icon-button class="btn-skip" title="${t("skip", L)}" @click=${(e: Event) => { e.stopPropagation(); this._skipTask(row.entry_id, row.task_id); }}>
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </mwc-icon-button>
        </span>
      </div>
    `;
  }

  /**
   * Render a compact trigger progress bar for overview rows.
   * Works for threshold (value vs limit), counter (value/delta vs target), state_change (count vs target).
   */
  private _renderTriggerProgress(row: TaskRow | MaintenanceTask) {
    const tc = row.trigger_config ?? null;
    if (!tc) return nothing;

    const triggerType = tc.type || "threshold";
    const unit = row.trigger_entity_info?.unit_of_measurement ?? "";

    let pct = 0;
    let label = "";

    if (triggerType === "threshold") {
      const val = row.trigger_current_value ?? null;
      if (val == null) return nothing;
      const above = tc.trigger_above;
      const below = tc.trigger_below;
      if (above != null) {
        // Progress toward upper limit
        const low = below ?? 0;
        const range = above - low || 1;
        pct = Math.min(100, Math.max(0, ((val - low) / range) * 100));
        label = `${val.toFixed(1)} / ${above} ${unit}`;
      } else if (below != null) {
        // Progress toward lower limit (inverted: lower is worse)
        const entityMax = row.trigger_entity_info?.max;
        const high = entityMax ?? ((val * 2) || 100);
        const range = high - below || 1;
        pct = Math.min(100, Math.max(0, ((high - val) / range) * 100));
        label = `${val.toFixed(1)} / ${below} ${unit}`;
      } else {
        return nothing;
      }
    } else if (triggerType === "counter") {
      const target = tc.trigger_target_value || 1;
      // Use delta if available, otherwise current value
      const delta = row.trigger_current_delta ?? null;
      const val = delta ?? (row.trigger_current_value ?? null);
      if (val == null) return nothing;
      pct = Math.min(100, Math.max(0, (val / target) * 100));
      label = `${val.toFixed(1)} / ${target} ${unit}`;
    } else if (triggerType === "state_change") {
      const target = tc.trigger_target_changes || 1;
      const val = row.trigger_current_value ?? null;
      if (val == null) return nothing;
      pct = Math.min(100, Math.max(0, (val / target) * 100));
      label = `${Math.round(val)} / ${target}`;
    } else if (triggerType === "runtime") {
      const target = tc.trigger_runtime_hours || 100;
      const val = row.trigger_current_value ?? null;
      if (val == null) return nothing;
      pct = Math.min(100, Math.max(0, (val / target) * 100));
      label = `${val.toFixed(1)}h / ${target}h`;
    } else {
      return nothing;
    }

    const triggerOverflow = pct >= 100;
    const barColor = pct > 90 ? "var(--error-color, #f44336)"
                   : pct > 70 ? "var(--warning-color, #ff9800)"
                   : "var(--primary-color)";

    return html`
      <div class="trigger-progress">
        <div class="trigger-progress-bar">
          <div class="trigger-progress-fill${triggerOverflow ? " overflow" : ""}" style="width:${pct}%;background:${barColor}"></div>
        </div>
        <span class="trigger-progress-label">${label}</span>
      </div>
    `;
  }

  /**
   * Render a mini sparkline for overview rows (tiny trend line).
   */
  private _renderMiniSparkline(row: TaskRow) {
    if (!row.trigger_config?.entity_id) return nothing;
    const entityId = row.trigger_config.entity_id;

    // PRIMARY: HA recorder statistics (daily, last 14 days)
    const statsPoints = this._miniStatsData.get(entityId) || [];

    let points: { ts: number; val: number }[] = [];

    if (statsPoints.length >= 2) {
      points = statsPoints.map((p) => ({ ts: p.ts, val: p.val }));
    } else {
      // FALLBACK: original behavior from task history
      if (!row.history) return nothing;
      for (const h of row.history) {
        if (h.trigger_value != null) {
          points.push({ ts: new Date(h.timestamp).getTime(), val: h.trigger_value });
        }
      }
    }

    if (row.trigger_current_value != null) {
      points.push({ ts: Date.now(), val: row.trigger_current_value });
    }
    if (points.length < 2) return nothing;
    points.sort((a, b) => a.ts - b.ts);

    const W = MINI_SPARKLINE_W, H = MINI_SPARKLINE_H;
    const vals = points.map((p) => p.val);
    let minV = Math.min(...vals), maxV = Math.max(...vals);
    const range = maxV - minV || 1;
    minV -= range * 0.1; maxV += range * 0.1;
    const tsMin = points[0].ts, tsMax = points[points.length - 1].ts;
    const tsR = tsMax - tsMin || 1;

    const toX = (ts: number) => ((ts - tsMin) / tsR) * W;
    const toY = (v: number) => 2 + (1 - (v - minV) / (maxV - minV)) * (H - 4);

    // Downsample for tiny SVG
    let renderPoints = points;
    if (renderPoints.length > MAX_MINI_POINTS) {
      const step = Math.ceil(renderPoints.length / MAX_MINI_POINTS);
      renderPoints = renderPoints.filter((_, i) => i % step === 0 || i === renderPoints.length - 1);
    }

    const pts = renderPoints.map((p) => `${toX(p.ts).toFixed(1)},${toY(p.val).toFixed(1)}`).join(" ");

    return html`
      <svg class="mini-sparkline" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${t("chart_mini_sparkline", this._lang)}">
        <polyline points="${pts}" fill="none" stroke="var(--primary-color)" stroke-width="1.5" stroke-linejoin="round" />
      </svg>
    `;
  }

  /**
   * Render a detailed days progress bar for the task detail view.
   */
  private _renderDaysProgress(task: MaintenanceTask) {
    const L = this._lang;
    if (task.days_until_due == null || !task.interval_days || task.interval_days <= 0) return nothing;

    const elapsed = task.interval_days - task.days_until_due;
    const rawPct = (elapsed / task.interval_days) * 100;
    const pct = Math.max(0, Math.min(100, rawPct));
    const daysOverflow = rawPct > 100;

    let barColor = "var(--success-color, #4caf50)";
    if (task.status === "overdue") barColor = "var(--error-color, #f44336)";
    else if (task.status === "due_soon") barColor = "var(--warning-color, #ff9800)";

    return html`
      <div class="days-progress">
        <div class="days-progress-labels">
          <span>${task.last_performed ? `${t("last_performed", L)}: ${formatDate(task.last_performed, L)}` : ""}</span>
          <span>${task.next_due ? `${t("next_due", L)}: ${formatDate(task.next_due, L)}` : ""}</span>
        </div>
        <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100" aria-label="${t("days_progress", L)}">
          <div class="days-progress-fill${daysOverflow ? " overflow" : ""}" style="width:${pct}%;background:${barColor}"></div>
        </div>
        <div class="days-progress-text">${formatDueDays(task.days_until_due, L)}</div>
      </div>
    `;
  }

  private _renderObjectDetail() {
    if (!this._selectedEntryId) return nothing;
    const obj = this._getObject(this._selectedEntryId);
    if (!obj) return html`<p>Object not found.</p>`;
    const o = obj.object;
    const L = this._lang;

    return html`
      <div class="detail-section">
        <div class="detail-header">
          <h2>${o.name}</h2>
          <div class="action-buttons">
            <ha-button appearance="plain" @click=${() => {
              const dlg = this.shadowRoot!.querySelector<MaintenanceObjectDialog>("maintenance-object-dialog");
              dlg?.openEdit(obj.entry_id, o);
            }}>${t("edit", L)}</ha-button>
            <ha-button appearance="filled" @click=${() => {
              const dlg = this.shadowRoot!.querySelector<MaintenanceTaskDialog>("maintenance-task-dialog");
              dlg?.openCreate(obj.entry_id);
            }}>${t("add_task", L)}</ha-button>
            <ha-button variant="danger" appearance="plain" @click=${() => this._deleteObject(obj.entry_id)}>${t("delete", L)}</ha-button>
            <ha-button appearance="plain" @click=${() => this._openQrForObject(obj.entry_id, o.name)}><ha-icon icon="mdi:qrcode"></ha-icon> ${t("qr_code", L)}</ha-button>
          </div>
        </div>
        ${o.manufacturer || o.model
          ? html`<p class="meta">${[o.manufacturer, o.model].filter(Boolean).join(" ")}</p>`
          : nothing}
        ${o.installation_date ? html`<p class="meta">${t("installed", L)}: ${formatDate(o.installation_date, L)}</p>` : nothing}

        <h3>${t("tasks", L)} (${obj.tasks.length})</h3>
        ${obj.tasks.length === 0
          ? html`<p class="empty">${t("no_tasks_short", L)}</p>`
          : obj.tasks.map((task) => html`
              <div class="task-row">
                <span class="status-badge ${task.status}">${t(task.status, L)}</span>
                <span class="cell task-name" @click=${() => this._showTask(obj.entry_id, task.id)}>${task.name}</span>
                ${this._renderUserBadge(task)}
                <span class="cell type">${t(task.type, L)}</span>
                <span class="due-cell" @click=${() => this._showTask(obj.entry_id, task.id)}>
                  <span class="due-text">${formatDueDays(task.days_until_due, L)}</span>
                </span>
                <span class="row-actions">
                  <mwc-icon-button class="btn-complete" title="${t("complete", L)}" @click=${(e: Event) => { e.stopPropagation(); this._openCompleteDialog(obj.entry_id, task.id, task.name); }}>
                    <ha-icon icon="mdi:check"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button class="btn-skip" title="${t("skip", L)}" @click=${(e: Event) => { e.stopPropagation(); this._skipTask(obj.entry_id, task.id); }}>
                    <ha-icon icon="mdi:skip-next"></ha-icon>
                  </mwc-icon-button>
                </span>
              </div>
            `)}
      </div>
    `;
  }

  /**
   * Render compact task header with status chip and action buttons.
   */
  private _renderTaskHeader(task: MaintenanceTask) {
    const L = this._lang;
    const obj = this._getObject(this._selectedEntryId!);
    const objName = obj?.object.name || "";

    // Determine status chip
    let statusClass = "ok";
    let statusText = "OK";
    if (task.days_until_due !== null && task.days_until_due !== undefined) {
      if (task.days_until_due < 0) {
        statusClass = "overdue";
        statusText = t("overdue", L);
      } else if (task.days_until_due <= task.warning_days) {
        statusClass = "warning";
        statusText = t("due_soon", L);
      }
    }

    return html`
      <div class="task-header">
        <div class="task-header-title">
          <span class="task-name-breadcrumb" @click=${() => this._view = "task"}>${task.name}</span>
          <span class="breadcrumb-separator">·</span>
          <span class="object-name-breadcrumb" @click=${() => this._showObject(this._selectedEntryId!)}>${objName}</span>
          <span class="status-chip ${statusClass}">${statusText}</span>
          ${this._renderUserBadge(task)}
        </div>
        <div class="task-header-actions">
          <ha-button appearance="filled" @click=${() => this._openCompleteDialog(this._selectedEntryId!, this._selectedTaskId!, task.name, this._features.checklists ? task.checklist : undefined, this._features.adaptive && !!task.adaptive_config?.enabled)}>${t("complete", L)}</ha-button>
          <ha-button appearance="plain" @click=${() => this._skipTask(this._selectedEntryId!, this._selectedTaskId!)}>${t("skip", L)}</ha-button>
          <ha-button appearance="plain" class="more-menu-btn">
            ⋯
            <div class="dropdown-menu">
              <div class="menu-item" @click=${() => {
                const dlg = this.shadowRoot!.querySelector<MaintenanceTaskDialog>("maintenance-task-dialog");
                dlg?.openEdit(this._selectedEntryId!, task);
              }}>${t("edit", L)}</div>
              <div class="menu-item" @click=${() => this._resetTask(this._selectedEntryId!, this._selectedTaskId!)}>${t("reset", L)}</div>
              <div class="menu-item" @click=${() => {
                const objData = this._getObject(this._selectedEntryId!)?.object;
                this._openQrForTask(this._selectedEntryId!, this._selectedTaskId!, objData?.name || "", task.name);
              }}><ha-icon icon="mdi:qrcode"></ha-icon> ${t("qr_code", L)}</div>
              <div class="menu-item danger" @click=${() => this._deleteTask(this._selectedEntryId!, this._selectedTaskId!)}>${t("delete", L)}</div>
            </div>
          </ha-button>
        </div>
      </div>
    `;
  }

  /**
   * Render user badge for a task (if responsible user is assigned).
   */
  private _renderUserBadge(task: MaintenanceTask) {
    if (!task.responsible_user_id || !this._userService) {
      return nothing;
    }

    const userName = this._userService.getUserName(task.responsible_user_id);
    if (!userName) return nothing;

    return html`
      <span class="user-badge">
        <ha-icon icon="mdi:account"></ha-icon>
        ${userName}
      </span>
    `;
  }

  /**
   * Render tab bar for navigation.
   */
  private _renderTabBar() {
    const L = this._lang;
    return html`
      <div class="tab-bar">
        <div class="tab ${this._activeTab === "overview" ? "active" : ""}" @click=${() => this._activeTab = "overview"}>
          ${t("overview", L)}
        </div>
        <div class="tab ${this._activeTab === "analysis" ? "active" : ""}" @click=${() => this._activeTab = "analysis"}>
          ${t("analysis", L)}
        </div>
        <div class="tab ${this._activeTab === "history" ? "active" : ""}" @click=${() => this._activeTab = "history"}>
          ${t("history", L)}
        </div>
      </div>
    `;
  }

  /**
   * Render tab content based on active tab.
   */
  private _renderTabContent(task: MaintenanceTask) {
    switch (this._activeTab) {
      case "overview":
        return this._renderOverviewTab(task);
      case "analysis":
        return this._renderAnalysisTab(task);
      case "history":
        return this._renderHistoryTab(task);
      default:
        return nothing;
    }
  }

  /**
   * Render Overview Tab content.
   */
  private _renderOverviewTab(task: MaintenanceTask) {
    const L = this._lang;

    // Check if we have left column content
    const hasRecommendation = this._features.adaptive && task.suggested_interval && task.suggested_interval !== task.interval_days;
    const hasSeasonal = this._features.seasonal && task.seasonal_factor && task.seasonal_factor !== 1.0;
    const hasLeftColumn = hasRecommendation || hasSeasonal;

    return html`
      <div class="tab-content overview-tab">
        ${this._renderKPIBar(task)}
        <div class="two-column-layout ${hasLeftColumn ? '' : 'single-column'}">
          ${hasLeftColumn ? html`
            <div class="left-column">
              ${this._renderRecommendationCard(task)}
              ${this._renderSeasonalCardCompact(task)}
            </div>
          ` : nothing}
          <div class="right-column">
            ${this._renderCostDurationCard(task)}
          </div>
        </div>
        ${this._renderRecentActivities(task)}
      </div>
    `;
  }

  /**
   * Render Analysis Tab content.
   */
  private _renderAnalysisTab(task: MaintenanceTask) {
    const L = this._lang;
    const hasAnyAdvanced = this._features.adaptive || this._features.seasonal;

    if (!hasAnyAdvanced) {
      return html`
        <div class="tab-content analysis-tab">
          <div class="analysis-empty-state">
            <ha-icon icon="mdi:chart-line" class="empty-icon"></ha-icon>
            <p class="empty">${t("no_advanced_features", L)}</p>
            <p class="empty-hint">${t("no_advanced_features_hint", L)}</p>
          </div>
        </div>
      `;
    }

    // Check if the sub-renderers would actually produce content
    const hasWeibullData = this._features.adaptive
      && task.interval_analysis?.weibull_beta != null
      && task.interval_analysis?.weibull_eta != null;
    const hasSeasonalData = this._features.seasonal
      && (task.seasonal_factors?.length === 12
        || task.interval_analysis?.seasonal_factors?.length === 12);
    const hasAnyData = hasWeibullData || hasSeasonalData;

    if (!hasAnyData) {
      const isManual = task.schedule_type === "manual";
      const dataPoints = task.interval_analysis?.data_points ?? 0;
      const pct = Math.min(100, Math.max(0, (dataPoints / 5) * 100));
      return html`
        <div class="tab-content analysis-tab">
          <div class="analysis-empty-state">
            <ha-icon icon="mdi:chart-line" class="empty-icon"></ha-icon>
            <p class="empty">${t("analysis_not_enough_data", L)}</p>
            <p class="empty-hint">
              ${isManual
                ? t("analysis_manual_task_hint", L)
                : t("analysis_not_enough_data_hint", L)}
            </p>
            ${!isManual && dataPoints > 0 ? html`
              <div class="analysis-progress">
                <div class="analysis-progress-bar" style="width:${pct}%"></div>
              </div>
              <p class="empty-hint">${dataPoints} / 5 ${t("completions", L)}</p>
            ` : nothing}
          </div>
        </div>
      `;
    }

    return html`
      <div class="tab-content analysis-tab">
        ${this._features.adaptive ? this._renderWeibullCardExpanded(task) : nothing}
        ${this._features.seasonal ? this._renderSeasonalCardExpanded(task) : nothing}
      </div>
    `;
  }

  /**
   * Render History Tab content.
   */
  private _renderHistoryTab(task: MaintenanceTask) {
    const L = this._lang;
    return html`
      <div class="tab-content history-tab">
        ${this._renderHistoryFilters(task)}
        ${this._renderHistoryList(task)}
      </div>
    `;
  }

  /**
   * Render KPI bar with 7 cards.
   */
  private _renderKPIBar(task: MaintenanceTask) {
    const L = this._lang;
    const avgCost = task.times_performed > 0 ? task.total_cost / task.times_performed : 0;
    const daysClass = task.days_until_due !== null && task.days_until_due !== undefined
      ? (task.days_until_due < 0 ? "overdue" : (task.days_until_due <= task.warning_days ? "warning" : ""))
      : "";

    return html`
      <div class="kpi-bar">
        <div class="kpi-card">
          <div class="kpi-label">${t("next_due", L)}</div>
          <div class="kpi-value">${task.next_due ? formatDate(task.next_due, L) : "—"}</div>
        </div>
        <div class="kpi-card ${daysClass}">
          <div class="kpi-label">${t("days_until_due", L)}</div>
          <div class="kpi-value-large">${task.days_until_due !== null && task.days_until_due !== undefined ? task.days_until_due : "—"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${t("interval", L)}</div>
          <div class="kpi-value">${task.interval_days} ${t("days", L)}</div>
          ${this._features.adaptive && task.suggested_interval && task.suggested_interval !== task.interval_days ? html`
            <div class="kpi-subtext">${t("recommended", L)}: ${task.suggested_interval}${task.interval_analysis?.confidence_interval_low != null ? ` (${task.interval_analysis.confidence_interval_low}–${task.interval_analysis.confidence_interval_high})` : ""}</div>
          ` : nothing}
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${t("warning", L)}</div>
          <div class="kpi-value">${task.warning_days} ${t("days", L)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${t("last_performed", L)}</div>
          <div class="kpi-value">${task.last_performed ? formatDate(task.last_performed, L) : "—"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${t("avg_cost", L)}</div>
          <div class="kpi-value">${avgCost.toFixed(0)} €</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${t("avg_duration", L)}</div>
          <div class="kpi-value">${task.average_duration ? task.average_duration.toFixed(0) : "—"} min</div>
        </div>
      </div>
    `;
  }

  /**
   * Placeholder methods for components to be implemented.
   */
  private _renderRecommendationCard(task: MaintenanceTask) {
    const L = this._lang;

    // Only show if adaptive is enabled and there's a suggestion
    if (!this._features.adaptive || !task.suggested_interval || task.suggested_interval === task.interval_days) {
      return nothing;
    }

    const current = task.interval_days;
    const suggested = task.suggested_interval;
    const confidence = task.interval_confidence || "medium";

    return html`
      <div class="recommendation-card">
        <h4>${t("suggested_interval", L)}</h4>
        <div class="interval-comparison">
          <div class="interval-bar">
            <div class="interval-label">${t("current", L) || "Aktuell"}: ${current} ${t("days", L)}</div>
            <div class="interval-visual current" style="width: ${Math.min(current / suggested * 100, 100)}%"></div>
          </div>
          <div class="interval-bar">
            <div class="interval-label">${t("recommended", L)}: ${suggested} ${t("days", L)}
              <span class="confidence-badge ${confidence}">${t(`confidence_${confidence}`, L)}</span>
            </div>
            <div class="interval-visual suggested" style="width: 100%"></div>
          </div>
        </div>
        <div class="recommendation-actions">
          <ha-button appearance="filled" @click=${() => this._applySuggestion(this._selectedEntryId!, this._selectedTaskId!, suggested)}>
            ${t("apply_suggestion", L)}
          </ha-button>
          <ha-button appearance="plain" @click=${() => this._dismissSuggestion()}>
            ${t("dismiss_suggestion", L)}
          </ha-button>
        </div>
      </div>
    `;
  }

  private _renderSeasonalCardCompact(task: MaintenanceTask) {
    const L = this._lang;

    // Only show if seasonal is enabled and data exists
    if (!this._features.seasonal || !task.seasonal_factor || task.seasonal_factor === 1.0) {
      return nothing;
    }

    const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    const currentMonth = new Date().getMonth();

    // Generate mock seasonal data (in real implementation, this would come from task data)
    const seasonalData = months.map((_, i) => {
      const base = task.seasonal_factor || 1.0;
      const variation = Math.sin((i - 6) * Math.PI / 6) * 0.3;
      return Math.max(0.7, Math.min(1.3, base + variation));
    });

    return html`
      <div class="seasonal-card-compact">
        <h4>${t("seasonal_awareness", L)}</h4>
        <div class="seasonal-mini-chart">
          ${seasonalData.map((factor, i) => {
            const height = factor * 40;
            const colorClass = factor < 0.9 ? 'low' : factor > 1.1 ? 'high' : 'normal';
            const isCurrentMonth = i === currentMonth;
            return html`
              <div class="seasonal-bar ${colorClass} ${isCurrentMonth ? 'current' : ''}"
                   style="height: ${height}px"
                   title="${months[i]}: ${factor.toFixed(2)}x">
              </div>
            `;
          })}
        </div>
        <div class="seasonal-legend">
          <span class="legend-item"><span class="dot low"></span> ${t("shorter", L) || "Kürzer"}</span>
          <span class="legend-item"><span class="dot normal"></span> ${t("normal", L) || "Normal"}</span>
          <span class="legend-item"><span class="dot high"></span> ${t("longer", L) || "Länger"}</span>
        </div>
      </div>
    `;
  }

  private _renderCostDurationCard(task: MaintenanceTask) {
    const L = this._lang;

    return html`
      <div class="cost-duration-card">
        <div class="card-header">
          <h3>${t("cost_duration_chart", L)}</h3>
          <div class="toggle-buttons">
            <button
              class="toggle-btn ${this._costDurationToggle === 'cost' ? 'active' : ''}"
              @click=${() => this._costDurationToggle = 'cost'}>
              ${t("cost", L)}
            </button>
            <button
              class="toggle-btn ${this._costDurationToggle === 'both' ? 'active' : ''}"
              @click=${() => this._costDurationToggle = 'both'}>
              ${t("both", L)}
            </button>
            <button
              class="toggle-btn ${this._costDurationToggle === 'duration' ? 'active' : ''}"
              @click=${() => this._costDurationToggle = 'duration'}>
              ${t("duration", L)}
            </button>
          </div>
        </div>
        ${this._renderHistoryChart(task)}
      </div>
    `;
  }

  private _renderRecentActivities(task: MaintenanceTask) {
    const L = this._lang;
    const recent = task.history.slice(0, 3);

    if (recent.length === 0) {
      return nothing;
    }

    const getIcon = (type: string) => {
      switch (type) {
        case "completed": return "✓";
        case "triggered": return "⊗";
        case "skipped": return "↷";
        case "reset": return "↺";
        default: return "·";
      }
    };

    return html`
      <div class="recent-activities">
        <h3>${t("recent_activities", L)}</h3>
        ${recent.map(entry => html`
          <div class="activity-item">
            <span class="activity-icon">${getIcon(entry.type)}</span>
            <span class="activity-date">${formatDateTime(entry.timestamp, L)}</span>
            <span class="activity-note">${entry.notes || "—"}</span>
            ${entry.cost ? html`<span class="activity-badge">${entry.cost.toFixed(0)}€</span>` : nothing}
            ${entry.duration ? html`<span class="activity-badge">${entry.duration}min</span>` : nothing}
          </div>
        `)}
        <div class="activity-show-all">
          <ha-button appearance="plain" @click=${() => this._activeTab = "history"}>${t("show_all", L)} →</ha-button>
        </div>
      </div>
    `;
  }

  private _renderWeibullCardExpanded(task: MaintenanceTask) {
    // Use existing Weibull section
    return this._renderWeibullSection(task);
  }

  private _renderSeasonalCardExpanded(task: MaintenanceTask) {
    // Use existing seasonal chart
    return this._renderSeasonalChart(task);
  }

  private _renderHistoryFilters(task: MaintenanceTask) {
    const L = this._lang;
    return html`
      <div class="history-filters-new">
        <div class="filter-chips">
          ${(["completed", "skipped", "reset", "triggered"] as const).map((type) => {
            const count = task.history.filter((h) => h.type === type).length;
            if (count === 0) return nothing;
            return html`
              <span class="filter-chip ${this._historyFilter === type ? "active" : ""}"
                @click=${() => { this._historyFilter = this._historyFilter === type ? null : type; }}>
                ${t(type, L)} (${count})
              </span>
            `;
          })}
          ${this._historyFilter ? html`<span class="filter-chip clear" @click=${() => { this._historyFilter = null; }}>${t("show_all", L)}</span>` : nothing}
        </div>
        <div class="filter-controls">
          <input type="text" class="search-input" placeholder="${t("search_notes", L)}..." .value=${this._historySearch} @input=${(e: Event) => this._historySearch = (e.target as HTMLInputElement).value} />
        </div>
      </div>
    `;
  }

  private _renderHistoryList(task: MaintenanceTask) {
    const L = this._lang;
    let filtered = this._historyFilter
      ? task.history.filter((h) => h.type === this._historyFilter)
      : task.history;

    // Apply search filter
    if (this._historySearch) {
      const search = this._historySearch.toLowerCase();
      filtered = filtered.filter(h => h.notes?.toLowerCase().includes(search));
    }

    if (filtered.length === 0) {
      return html`<p class="empty">${t("no_history", L)}</p>`;
    }

    return html`
      <div class="history-timeline">
        ${[...filtered].reverse().map((entry: HistoryEntry) => this._renderHistoryEntry(entry))}
      </div>
    `;
  }

  private _renderTaskDetail() {
    if (!this._selectedEntryId || !this._selectedTaskId) return nothing;
    const task = this._getTask(this._selectedEntryId, this._selectedTaskId);
    if (!task) return html`<p>Task not found.</p>`;
    const L = this._lang;

    return html`
      <div class="detail-section">
        ${this._renderTaskHeader(task)}
        ${this._renderTabBar()}
        ${this._renderTabContent(task)}
      </div>
    `;
  }

  /**
   * Render a cost/duration bar+line chart from completed history entries.
   */
  private _renderHistoryChart(task: MaintenanceTask) {
    const entries = task.history
      .filter((h) => h.type === "completed" && (h.cost != null || h.duration != null))
      .map((h) => ({ ts: new Date(h.timestamp).getTime(), cost: h.cost ?? 0, duration: h.duration ?? 0 }))
      .sort((a, b) => a.ts - b.ts);

    if (entries.length < 2) return nothing;

    const hasCost = entries.some((e) => e.cost > 0);
    const hasDuration = entries.some((e) => e.duration > 0);
    if (!hasCost && !hasDuration) return nothing;

    const W = COST_CHART_W, H = COST_CHART_H;
    const PAD_L = hasCost ? 32 : 8;
    const PAD_R = hasDuration ? 32 : 8;
    const PAD_T = 8, PAD_B = 20;
    const chartW = W - PAD_L - PAD_R;
    const chartH = H - PAD_T - PAD_B;

    const maxCost = Math.max(...entries.map((e) => e.cost)) || 1;
    const maxDur = Math.max(...entries.map((e) => e.duration)) || 1;
    const barW = Math.min(20, (chartW / entries.length) * 0.6);
    const gap = chartW / entries.length;

    const barX = (i: number) => PAD_L + gap * i + gap / 2;
    const costY = (v: number) => PAD_T + chartH - (v / maxCost) * chartH;
    const durY = (v: number) => PAD_T + chartH - (v / maxDur) * chartH;

    return html`
      <div class="sparkline-container">
        <svg class="history-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${t("chart_history", this._lang)}">
          <!-- Cost bars -->
          ${hasCost ? entries.map((e, i) => svg`
            <rect x="${(barX(i) - barW / 2).toFixed(1)}" y="${costY(e.cost).toFixed(1)}" width="${barW.toFixed(1)}" height="${(PAD_T + chartH - costY(e.cost)).toFixed(1)}"
              fill="var(--primary-color)" opacity="0.6" rx="2" />
          `) : nothing}
          <!-- Duration line -->
          ${hasDuration ? svg`
            <polyline points="${entries.map((e, i) => `${barX(i).toFixed(1)},${durY(e.duration).toFixed(1)}`).join(" ")}"
              fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
            ${entries.map((e, i) => svg`
              <circle cx="${barX(i).toFixed(1)}" cy="${durY(e.duration).toFixed(1)}" r="3" fill="var(--accent-color, #ff9800)" />
            `)}
          ` : nothing}
          <!-- X-axis labels -->
          <text x="${PAD_L}" y="${H - 2}" text-anchor="start" fill="var(--secondary-text-color)" font-size="7">${new Date(entries[0].ts).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</text>
          <text x="${W - PAD_R}" y="${H - 2}" text-anchor="end" fill="var(--secondary-text-color)" font-size="7">${new Date(entries[entries.length - 1].ts).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</text>
          <!-- Y-axis labels -->
          ${hasCost ? svg`
            <text x="${PAD_L - 3}" y="${PAD_T + 4}" text-anchor="end" fill="var(--primary-color)" font-size="7">${maxCost.toFixed(0)}\u20AC</text>
            <text x="${PAD_L - 3}" y="${PAD_T + chartH + 3}" text-anchor="end" fill="var(--primary-color)" font-size="7">0\u20AC</text>
          ` : nothing}
          ${hasDuration ? svg`
            <text x="${W - PAD_R + 3}" y="${PAD_T + 4}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="7">${maxDur.toFixed(0)}m</text>
            <text x="${W - PAD_R + 3}" y="${PAD_T + chartH + 3}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="7">0m</text>
          ` : nothing}
        </svg>
      </div>
      <div class="chart-legend">
        ${hasCost ? html`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${t("cost", this._lang)}</span>` : nothing}
        ${hasDuration ? html`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${t("duration", this._lang)}</span>` : nothing}
      </div>
    `;
  }

  /**
   * Render a 12-bar seasonal factors chart (SVG).
   * Each bar = one month, height proportional to the seasonal factor.
   * Current month is highlighted. Green below 1.0, orange above 1.0.
   */
  private _renderSeasonalChart(task: MaintenanceTask) {
    const factors = task.seasonal_factors
      ?? task.interval_analysis?.seasonal_factors;
    if (!factors || factors.length !== 12) return nothing;

    const L = this._lang;
    const reason = task.interval_analysis?.seasonal_reason;
    const monthKeys = [
      "month_jan", "month_feb", "month_mar", "month_apr",
      "month_may", "month_jun", "month_jul", "month_aug",
      "month_sep", "month_oct", "month_nov", "month_dec",
    ];

    const currentMonth = new Date().getMonth(); // 0-indexed
    const W = 300, H = 100;
    const PAD_T = 8, PAD_B = 4;
    const chartH = H - PAD_T - PAD_B;
    const maxFactor = Math.max(...factors, 1.5);
    const barW = W / 12;
    const barInner = barW * 0.65;
    const baselineY = PAD_T + chartH - (1.0 / maxFactor) * chartH;

    return html`
      <div class="seasonal-chart">
        <div class="seasonal-chart-title">
          <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
          ${t("seasonal_chart_title", L)}
          ${reason ? html`<span class="source-tag">${reason === "learned" ? t("seasonal_learned", L) : t("seasonal_manual", L)}</span>` : nothing}
        </div>
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${t("chart_seasonal", L)}">
          <!-- Baseline at 1.0 -->
          <line x1="0" y1="${baselineY.toFixed(1)}" x2="${W}" y2="${baselineY.toFixed(1)}"
            stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
          <!-- Bars -->
          ${factors.map((f, i) => {
            const barH = (f / maxFactor) * chartH;
            const x = i * barW + (barW - barInner) / 2;
            const y = PAD_T + chartH - barH;
            const isCurrent = i === currentMonth;
            const color = f < 1.0
              ? "var(--success-color, #4caf50)"
              : f > 1.0
                ? "var(--warning-color, #ff9800)"
                : "var(--secondary-text-color)";
            return svg`
              <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}"
                width="${barInner.toFixed(1)}" height="${barH.toFixed(1)}"
                fill="${color}" opacity="${isCurrent ? 1 : 0.5}" rx="2" />
            `;
          })}
        </svg>
        <div class="seasonal-labels">
          ${monthKeys.map((key, i) =>
            html`<span class="seasonal-label ${i === currentMonth ? "active-month" : ""}">${t(key, L)}</span>`
          )}
        </div>
      </div>
    `;
  }

  /* ─── Weibull Reliability Section (Phase 4) ─── */

  private _renderWeibullSection(task: MaintenanceTask) {
    const analysis = task.interval_analysis;
    const beta = analysis?.weibull_beta;
    const eta = analysis?.weibull_eta;
    if (beta == null || eta == null) return nothing;

    const L = this._lang;
    const rSquared = analysis?.weibull_r_squared;
    const currentInterval = task.interval_days ?? 0;
    const rec = task.suggested_interval ?? currentInterval;

    return html`
      <div class="weibull-section">
        <div class="weibull-title">
          <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
          ${t("weibull_reliability_curve", L)}
          ${this._renderBetaBadge(beta, L)}
        </div>
        ${this._renderWeibullChart(beta, eta, currentInterval, rec)}
        ${this._renderWeibullInfo(analysis!, L)}
        ${analysis?.confidence_interval_low != null ? this._renderConfidenceInterval(analysis!, task, L) : nothing}
      </div>
    `;
  }

  private _renderBetaBadge(beta: number, lang: string) {
    let cls: string;
    let icon: string;
    let key: string;
    if (beta < 0.8) {
      cls = "early_failures";
      icon = "M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"; // alert
      key = "beta_early_failures";
    } else if (beta <= 1.2) {
      cls = "random_failures";
      icon = "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z"; // info
      key = "beta_random_failures";
    } else if (beta <= 3.5) {
      cls = "wear_out";
      icon = "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z"; // pie
      key = "beta_wear_out";
    } else {
      cls = "highly_predictable";
      icon = "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"; // check-circle
      key = "beta_highly_predictable";
    }
    return html`
      <span class="beta-badge ${cls}">
        <ha-svg-icon path="${icon}"></ha-svg-icon>
        ${t(key, lang)} (β=${beta.toFixed(2)})
      </span>
    `;
  }

  private _renderWeibullChart(beta: number, eta: number, currentInterval: number, recommended: number) {
    const W = 300, H = 160;
    const PAD_L = 32, PAD_R = 8, PAD_T = 8, PAD_B = 24;
    const chartW = W - PAD_L - PAD_R;
    const chartH = H - PAD_T - PAD_B;

    // Determine x-axis range
    const maxT = Math.max(currentInterval, recommended, eta) * 1.3;
    const N = 50; // number of curve points

    // Compute CDF points: F(t) = 1 - exp(-(t/eta)^beta)
    const points: Array<[number, number]> = [];
    for (let i = 0; i <= N; i++) {
      const t_val = (i / N) * maxT;
      const cdf = 1.0 - Math.exp(-Math.pow(t_val / eta, beta));
      const x = PAD_L + (t_val / maxT) * chartW;
      const y = PAD_T + chartH - cdf * chartH;
      points.push([x, y]);
    }

    const polyline = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const areaPath = `M${PAD_L},${PAD_T + chartH} ` +
      points.map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`).join(" ") +
      ` L${points[N][0].toFixed(1)},${PAD_T + chartH} Z`;

    // Current interval marker
    const curX = PAD_L + (currentInterval / maxT) * chartW;
    const curCdf = 1.0 - Math.exp(-Math.pow(currentInterval / eta, beta));
    const curY = PAD_T + chartH - curCdf * chartH;
    const reliability = ((1.0 - curCdf) * 100).toFixed(0);

    // Recommended marker
    const recX = PAD_L + (recommended / maxT) * chartW;

    // Y-axis labels and gridlines
    const yTicks = [0, 0.25, 0.5, 0.75, 1.0];

    return html`
      <div class="weibull-chart">
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${t("chart_weibull", this._lang)}">
          <!-- Grid lines -->
          ${yTicks.map(tick => {
            const y = PAD_T + chartH - tick * chartH;
            return svg`
              <line x1="${PAD_L}" y1="${y.toFixed(1)}" x2="${W - PAD_R}" y2="${y.toFixed(1)}"
                stroke="var(--divider-color)" stroke-width="0.5" ${tick === 0.5 ? 'stroke-dasharray="4,3"' : ""} />
              <text x="${PAD_L - 4}" y="${(y + 3).toFixed(1)}" fill="var(--secondary-text-color)"
                font-size="8" text-anchor="end">${(tick * 100).toFixed(0)}%</text>
            `;
          })}

          <!-- X-axis labels -->
          <text x="${PAD_L}" y="${H - 4}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
          <text x="${(PAD_L + W - PAD_R) / 2}" y="${H - 4}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(maxT / 2)}</text>
          <text x="${W - PAD_R}" y="${H - 4}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(maxT)}</text>

          <!-- Filled area under CDF curve -->
          <path d="${areaPath}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />

          <!-- CDF Curve -->
          <polyline points="${polyline}" fill="none"
            stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

          <!-- Current interval marker -->
          ${currentInterval > 0 ? svg`
            <line x1="${curX.toFixed(1)}" y1="${PAD_T}" x2="${curX.toFixed(1)}" y2="${(PAD_T + chartH).toFixed(1)}"
              stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
            <circle cx="${curX.toFixed(1)}" cy="${curY.toFixed(1)}" r="3"
              fill="var(--primary-color, #03a9f4)" />
            <text x="${(curX + 4).toFixed(1)}" y="${(curY - 6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
              font-size="9" font-weight="600">R=${reliability}%</text>
          ` : nothing}

          <!-- Recommended marker -->
          ${recommended > 0 && recommended !== currentInterval ? svg`
            <line x1="${recX.toFixed(1)}" y1="${PAD_T}" x2="${recX.toFixed(1)}" y2="${(PAD_T + chartH).toFixed(1)}"
              stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
          ` : nothing}

          <!-- Axes -->
          <line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${PAD_T + chartH}"
            stroke="var(--secondary-text-color)" stroke-width="1" />
          <line x1="${PAD_L}" y1="${PAD_T + chartH}" x2="${W - PAD_R}" y2="${PAD_T + chartH}"
            stroke="var(--secondary-text-color)" stroke-width="1" />
        </svg>
      </div>
      <div class="chart-legend">
        <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${t("weibull_failure_probability", this._lang)}</span>
        ${currentInterval > 0 ? html`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${t("current_interval_marker", this._lang)}</span>` : nothing}
        ${recommended > 0 && recommended !== currentInterval ? html`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${t("recommended_marker", this._lang)}</span>` : nothing}
      </div>
    `;
  }

  private _renderWeibullInfo(analysis: NonNullable<MaintenanceTask["interval_analysis"]>, lang: string) {
    return html`
      <div class="weibull-info-row">
        <div class="weibull-info-item">
          <span>${t("characteristic_life", lang)}</span>
          <span class="weibull-info-value">${Math.round(analysis.weibull_eta!)} ${t("days", lang)}</span>
        </div>
        ${analysis.weibull_r_squared != null ? html`
          <div class="weibull-info-item">
            <span>${t("weibull_r_squared", lang)}</span>
            <span class="weibull-info-value">${analysis.weibull_r_squared!.toFixed(3)}</span>
          </div>
        ` : nothing}
      </div>
    `;
  }

  private _renderConfidenceInterval(analysis: NonNullable<MaintenanceTask["interval_analysis"]>, task: MaintenanceTask, lang: string) {
    const low = analysis.confidence_interval_low!;
    const high = analysis.confidence_interval_high!;
    const rec = task.suggested_interval ?? task.interval_days ?? 0;
    const current = task.interval_days ?? 0;

    // Bar range
    const barMin = Math.max(0, low - 5);
    const barMax = high + 5;
    const range = barMax - barMin;

    const fillLeft = ((low - barMin) / range) * 100;
    const fillWidth = ((high - low) / range) * 100;
    const recPos = ((rec - barMin) / range) * 100;
    const curPos = current > 0 ? ((current - barMin) / range) * 100 : -1;

    return html`
      <div class="confidence-range">
        <div class="confidence-range-title">
          ${t("confidence_interval", lang)}: ${rec} ${t("days", lang)} (${low}–${high})
        </div>
        <div class="confidence-bar">
          <div class="confidence-fill" style="left:${fillLeft.toFixed(1)}%;width:${fillWidth.toFixed(1)}%"></div>
          ${curPos >= 0 ? html`<div class="confidence-marker current" style="left:${curPos.toFixed(1)}%"></div>` : nothing}
          <div class="confidence-marker recommended" style="left:${recPos.toFixed(1)}%"></div>
        </div>
        <div class="confidence-labels">
          <span class="confidence-text low">${t("confidence_conservative", lang)} (${low}${t("days", lang).charAt(0)})</span>
          <span class="confidence-text high">${t("confidence_aggressive", lang)} (${high}${t("days", lang).charAt(0)})</span>
        </div>
      </div>
    `;
  }

  private _renderPredictionSection(task: MaintenanceTask) {
    // Only show for sensor_based tasks with degradation data
    const hasDegradation = task.degradation_trend != null && task.degradation_trend !== "insufficient_data";
    const hasThreshold = task.days_until_threshold != null;
    const hasEnv = task.environmental_factor != null && task.environmental_factor !== 1.0;
    if (!hasDegradation && !hasThreshold && !hasEnv) return nothing;

    const L = this._lang;
    const trendIcon = task.degradation_trend === "rising"
      ? "M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"
      : task.degradation_trend === "falling"
        ? "M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z"
        : "M22,12L18,8V11H3V13H18V16L22,12Z";

    return html`
      <div class="prediction-section">
        ${task.sensor_prediction_urgency ? html`
          <div class="prediction-urgency-banner">
            <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
            ${t("sensor_prediction_urgency", L).replace("{days}", String(Math.round(task.days_until_threshold || 0)))}
          </div>
        ` : nothing}
        <div class="prediction-title">
          <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
          ${t("sensor_prediction", L)}
        </div>
        <div class="prediction-grid">
          ${hasDegradation ? html`
            <div class="prediction-item">
              <ha-svg-icon path="${trendIcon}"></ha-svg-icon>
              <span class="prediction-label">${t("degradation_trend", L)}</span>
              <span class="prediction-value ${task.degradation_trend}">${t("trend_" + task.degradation_trend, L)}</span>
              ${task.degradation_rate != null ? html`<span class="prediction-rate">${task.degradation_rate > 0 ? "+" : ""}${Math.abs(task.degradation_rate) >= 10 ? Math.round(task.degradation_rate).toLocaleString() : task.degradation_rate.toFixed(1)} ${task.trigger_entity_info?.unit_of_measurement || ""}/${t("day_short", L)}</span>` : nothing}
            </div>
          ` : nothing}
          ${hasThreshold ? html`
            <div class="prediction-item">
              <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
              <span class="prediction-label">${t("days_until_threshold", L)}</span>
              <span class="prediction-value prediction-days${task.days_until_threshold === 0 ? " exceeded" : task.sensor_prediction_urgency ? " urgent" : ""}">${task.days_until_threshold === 0 ? t("threshold_exceeded", L) : "~" + Math.round(task.days_until_threshold!) + " " + t("days", L)}</span>
              ${task.threshold_prediction_date ? html`<span class="prediction-date">${formatDate(task.threshold_prediction_date, L)}</span>` : nothing}
              ${task.threshold_prediction_confidence ? html`<span class="confidence-dot ${task.threshold_prediction_confidence}"></span>` : nothing}
            </div>
          ` : nothing}
          ${hasEnv && this._features.environmental ? html`
            <div class="prediction-item">
              <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
              <span class="prediction-label">${t("environmental_adjustment", L)}</span>
              <span class="prediction-value">${task.environmental_factor!.toFixed(2)}x</span>
              ${task.environmental_entity ? html`<span class="prediction-entity">${task.environmental_entity}</span>` : nothing}
            </div>
          ` : nothing}
        </div>
      </div>
    `;
  }

  private _renderTriggerSection(task: MaintenanceTask) {
    const tc = task.trigger_config;
    if (!tc) return nothing;
    const L = this._lang;
    const info = task.trigger_entity_info;
    const friendlyName = info?.friendly_name || tc.entity_id || "—";
    const entityId = tc.entity_id || "";
    const unit = info?.unit_of_measurement || "";
    const currentVal = task.trigger_current_value;
    const triggerType = tc.type || "threshold";

    return html`
      <h3>${t("trigger", L)}</h3>
      <div class="trigger-card">
        <div class="trigger-header">
          <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
          <div>
            <div class="trigger-entity-name">${friendlyName}</div>
            <div class="trigger-entity-id">${entityId}${tc.attribute ? ` → ${tc.attribute}` : ""}</div>
          </div>
          <span class="status-badge ${task.trigger_active ? "triggered" : "ok"}" style="margin-left: auto;">
            ${task.trigger_active ? t("triggered", L) : t("ok", L)}
          </span>
        </div>

        ${currentVal !== null && currentVal !== undefined
          ? html`
              <div class="trigger-value-row">
                <span class="trigger-current ${task.trigger_active ? "active" : ""}">${typeof currentVal === "number" ? currentVal.toFixed(1) : currentVal}</span>
                ${unit ? html`<span class="trigger-unit">${unit}</span>` : nothing}
              </div>
            `
          : nothing}

        <div class="trigger-limits">
          ${triggerType === "threshold" ? html`
            ${tc.trigger_above != null ? html`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t("threshold_above", L)}: ${tc.trigger_above} ${unit}</span>` : nothing}
            ${tc.trigger_below != null ? html`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t("threshold_below", L)}: ${tc.trigger_below} ${unit}</span>` : nothing}
            ${tc.trigger_for_minutes ? html`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${t("for_minutes", L)}: ${tc.trigger_for_minutes}</span>` : nothing}
          ` : nothing}
          ${triggerType === "counter" ? html`
            ${tc.trigger_target_value != null ? html`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t("target_value", L)}: ${tc.trigger_target_value} ${unit}</span>` : nothing}
          ` : nothing}
          ${triggerType === "state_change" ? html`
            ${tc.trigger_target_changes != null ? html`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t("target_changes", L)}: ${tc.trigger_target_changes}</span>` : nothing}
          ` : nothing}
          ${triggerType === "runtime" ? html`
            ${tc.trigger_runtime_hours != null ? html`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t("runtime_hours", L)}: ${tc.trigger_runtime_hours}h</span>` : nothing}
          ` : nothing}
          ${info?.min != null ? html`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${t("min", L)}: ${info.min} ${unit}</span>` : nothing}
          ${info?.max != null ? html`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${t("max", L)}: ${info.max} ${unit}</span>` : nothing}
        </div>

        ${this._renderSparkline(task, unit)}
      </div>
    `;
  }

  /**
   * Render a sparkline SVG from HA recorder statistics (primary) or task history (fallback).
   */
  private _renderSparkline(task: MaintenanceTask, unit: string) {
    const tc = task.trigger_config;
    if (!tc) return nothing;
    const triggerType = tc.type || "threshold";
    const isDelta = triggerType === "counter" && tc.trigger_delta_mode;
    const isCounter = this._isCounterEntity(tc);
    const entityId = tc.entity_id || "";

    // PRIMARY: HA recorder statistics
    const statsPoints = this._detailStatsData.get(entityId) || [];
    const points: { ts: number; val: number; min?: number; max?: number }[] = [];
    let hasMinMax = false;

    if (statsPoints.length >= 2) {
      for (const sp of statsPoints) {
        let val = sp.val;
        if (isDelta && task.trigger_baseline_value != null) {
          val -= task.trigger_baseline_value;
        }
        const pt: { ts: number; val: number; min?: number; max?: number } = { ts: sp.ts, val };
        if (!isCounter && sp.min != null && sp.max != null) {
          pt.min = isDelta && task.trigger_baseline_value != null ? sp.min - task.trigger_baseline_value : sp.min;
          pt.max = isDelta && task.trigger_baseline_value != null ? sp.max - task.trigger_baseline_value : sp.max;
          hasMinMax = true;
        }
        points.push(pt);
      }
    } else {
      // FALLBACK: original task.history trigger_value entries
      for (const h of task.history) {
        if (h.trigger_value != null) {
          points.push({ ts: new Date(h.timestamp).getTime(), val: h.trigger_value });
        }
      }
    }

    // Always append current value as last point
    if (task.trigger_current_value != null) {
      let curVal = task.trigger_current_value;
      if (isDelta && task.trigger_baseline_value != null) {
        curVal -= task.trigger_baseline_value;
      }
      points.push({ ts: Date.now(), val: curVal });
    }

    // Show loading state if we have a trigger entity but no stats yet and service exists
    if (points.length < 2 && entityId && this._statsService && !this._detailStatsData.has(entityId)) {
      return html`<div class="sparkline-container" aria-live="polite" style="display:flex;align-items:center;justify-content:center;height:140px;color:var(--secondary-text-color);font-size:12px;">
        <ha-icon icon="mdi:chart-line" style="--mdc-icon-size:16px;margin-right:8px;"></ha-icon>
        ${t("loading_chart", this._lang)}
      </div>`;
    }

    if (points.length < 2) return nothing;

    // Sort by timestamp
    points.sort((a, b) => a.ts - b.ts);

    const W = DETAIL_SPARKLINE_W;
    const H = DETAIL_SPARKLINE_H;
    const PAD_L = 30;
    const PAD_R = 2;
    const PAD_T = 8;
    const PAD_B = 16;

    const vals = points.map((p) => p.val);
    let minVal = Math.min(...vals);
    let maxVal = Math.max(...vals);

    // Expand range to include min/max bands
    if (hasMinMax) {
      for (const p of points) {
        if (p.min != null) minVal = Math.min(minVal, p.min);
        if (p.max != null) maxVal = Math.max(maxVal, p.max);
      }
    }

    // Include thresholds/targets in range so lines are visible
    if (tc.trigger_above != null) {
      maxVal = Math.max(maxVal, tc.trigger_above);
      minVal = Math.min(minVal, tc.trigger_above);
    }
    if (tc.trigger_below != null) {
      minVal = Math.min(minVal, tc.trigger_below);
      maxVal = Math.max(maxVal, tc.trigger_below);
    }
    // For counter types: compute effective baseline (value at last maintenance)
    // and absolute target line position
    let counterEffectiveBaseline: number | null = null;
    let counterAbsoluteTarget: number | null = null;
    if (triggerType === "counter" && tc.trigger_target_value != null) {
      // 1) Use backend baseline if available
      if (task.trigger_baseline_value != null) {
        counterEffectiveBaseline = task.trigger_baseline_value;
      } else if (points.length > 0) {
        // 2) Find value at time of last maintenance event
        const lastMaint = [...task.history]
          .filter((h) => h.type === "completed" || h.type === "reset")
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
        if (lastMaint) {
          const maintTs = new Date(lastMaint.timestamp).getTime();
          // Find closest stats point to maintenance timestamp
          let closest = points[0];
          let closestDist = Math.abs(points[0].ts - maintTs);
          for (const p of points) {
            const dist = Math.abs(p.ts - maintTs);
            if (dist < closestDist) {
              closest = p;
              closestDist = dist;
            }
          }
          counterEffectiveBaseline = closest.val;
        } else {
          // 3) No maintenance history: use first point in chart
          counterEffectiveBaseline = points[0].val;
        }
      }
      if (counterEffectiveBaseline != null) {
        counterAbsoluteTarget = counterEffectiveBaseline + tc.trigger_target_value;
        maxVal = Math.max(maxVal, counterAbsoluteTarget);
        minVal = Math.min(minVal, counterEffectiveBaseline);
      } else {
        maxVal = Math.max(maxVal, tc.trigger_target_value);
        minVal = Math.min(minVal, 0);
      }
    }
    // Only force 0 into range if delta values are actually plotted
    if (isDelta && task.trigger_baseline_value != null) {
      minVal = Math.min(minVal, 0);
    }

    // Add 10% padding
    const range = maxVal - minVal || 1;
    minVal -= range * 0.1;
    maxVal += range * 0.1;

    const tsMin = points[0].ts;
    const tsMax = points[points.length - 1].ts;
    const tsRange = tsMax - tsMin || 1;

    const toX = (ts: number) => PAD_L + ((ts - tsMin) / tsRange) * (W - PAD_L - PAD_R);
    const toY = (v: number) => PAD_T + (1 - (v - minVal) / (maxVal - minVal)) * (H - PAD_T - PAD_B);

    // Build polyline path
    const linePoints = points.map((p) => `${toX(p.ts).toFixed(1)},${toY(p.val).toFixed(1)}`).join(" ");
    // Area fill path
    const areaPath =
      `M${toX(points[0].ts).toFixed(1)},${H - PAD_B} ` +
      points.map((p) => `L${toX(p.ts).toFixed(1)},${toY(p.val).toFixed(1)}`).join(" ") +
      ` L${toX(points[points.length - 1].ts).toFixed(1)},${H - PAD_B} Z`;

    // Min/max band path (for mean-type entities with min/max data)
    let minMaxBandPath = "";
    if (hasMinMax) {
      const ptsWithMM = points.filter((p) => p.min != null && p.max != null);
      if (ptsWithMM.length >= 2) {
        const upperPath = ptsWithMM.map((p) => `${toX(p.ts).toFixed(1)},${toY(p.max!).toFixed(1)}`);
        const lowerPath = [...ptsWithMM].reverse().map((p) => `${toX(p.ts).toFixed(1)},${toY(p.min!).toFixed(1)}`);
        minMaxBandPath = `M${upperPath[0]} ` + upperPath.slice(1).map((pt) => `L${pt}`).join(" ") +
          ` L${lowerPath[0]} ` + lowerPath.slice(1).map((pt) => `L${pt}`).join(" ") + " Z";
      }
    }

    // Current dot
    const lastP = points[points.length - 1];
    const dotCx = toX(lastP.ts);
    const dotCy = toY(lastP.val);

    // Y-axis labels
    const fmtY = (v: number) => Math.abs(v) >= 10000 ? (v / 1000).toFixed(0) + "k" : v >= 1000 ? (v / 1000).toFixed(1) + "k" : v.toFixed(v < 10 ? 1 : 0);
    const yMaxLabel = fmtY(maxVal);
    const yMinLabel = fmtY(minVal);

    // Maintenance event markers (completed/skipped/reset within time range)
    const eventMarkers = task.history
      .filter((h) => ["completed", "skipped", "reset"].includes(h.type))
      .map((h) => ({ ts: new Date(h.timestamp).getTime(), type: h.type }))
      .filter((e) => e.ts >= tsMin && e.ts <= tsMax);

    // Downsample hover targets: max ~27 interactive circles (one per ~10px width)
    const maxHoverTargets = MAX_HOVER_TARGETS;
    let hoverPoints = points;
    if (points.length > maxHoverTargets) {
      const step = (points.length - 1) / (maxHoverTargets - 1);
      hoverPoints = [];
      for (let i = 0; i < maxHoverTargets; i++) {
        hoverPoints.push(points[Math.round(i * step)]);
      }
    }

    return html`
      <div class="sparkline-container">
        <svg class="sparkline-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${t("chart_sparkline", this._lang)}">
          <!-- Y-axis labels -->
          <text x="${PAD_L - 3}" y="${PAD_T + 3}" text-anchor="end" fill="var(--secondary-text-color)" font-size="8">${yMaxLabel}</text>
          <text x="${PAD_L - 3}" y="${H - PAD_B + 3}" text-anchor="end" fill="var(--secondary-text-color)" font-size="8">${yMinLabel}</text>
          <!-- X-axis labels -->
          <text x="${PAD_L}" y="${H - 1}" text-anchor="start" fill="var(--secondary-text-color)" font-size="7">${new Date(tsMin).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</text>
          <text x="${W - PAD_R}" y="${H - 1}" text-anchor="end" fill="var(--secondary-text-color)" font-size="7">${new Date(tsMax).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</text>
          <!-- Min/max band (mean-type entities) -->
          ${minMaxBandPath ? svg`<path d="${minMaxBandPath}" fill="var(--primary-color)" opacity="0.08" />` : nothing}
          <!-- Area fill -->
          <path d="${areaPath}" fill="var(--primary-color)" opacity="0.15" />
          <!-- Line -->
          <polyline points="${linePoints}" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linejoin="round" />
          <!-- Prediction projection line (Phase 3) -->
          ${task.degradation_rate != null && task.degradation_trend !== "stable" && task.degradation_trend !== "insufficient_data" && points.length >= 2 ? (() => {
            const lastP = points[points.length - 1];
            const projDays = 30;
            const projTs = lastP.ts + projDays * 86400000;
            const projVal = lastP.val + task.degradation_rate! * projDays;
            const clampedTs = Math.min(projTs, tsMax + (tsMax - tsMin) * 0.3);
            const clampedVal = Math.max(minVal, Math.min(maxVal, projVal));
            const px1 = toX(lastP.ts), py1 = toY(lastP.val);
            const px2 = toX(clampedTs), py2 = toY(clampedVal);
            return svg`<line x1="${px1.toFixed(1)}" y1="${py1.toFixed(1)}" x2="${px2.toFixed(1)}" y2="${py2.toFixed(1)}" stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.7" />`;
          })() : nothing}
          <!-- Threshold lines (for threshold type) -->
          ${triggerType === "threshold" && tc.trigger_above != null
            ? svg`<line x1="${PAD_L}" y1="${toY(tc.trigger_above).toFixed(1)}" x2="${W}" y2="${toY(tc.trigger_above).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                  <text x="${W - 2}" y="${toY(tc.trigger_above) - 3}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">▲ ${tc.trigger_above}</text>`
            : nothing}
          ${triggerType === "threshold" && tc.trigger_below != null
            ? svg`<line x1="${PAD_L}" y1="${toY(tc.trigger_below).toFixed(1)}" x2="${W}" y2="${toY(tc.trigger_below).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                  <text x="${W - 2}" y="${toY(tc.trigger_below) + 11}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">▼ ${tc.trigger_below}</text>`
            : nothing}
          <!-- Target line (for counter type) -->
          ${triggerType === "counter" && counterAbsoluteTarget != null
            ? svg`<line x1="${PAD_L}" y1="${toY(counterAbsoluteTarget).toFixed(1)}" x2="${W}" y2="${toY(counterAbsoluteTarget).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                  <text x="${W - 2}" y="${toY(counterAbsoluteTarget) - 3}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">${t("target_value", this._lang)}: +${tc.trigger_target_value}</text>`
            : nothing}
          <!-- Baseline line (for counter — value at last maintenance) -->
          ${triggerType === "counter" && counterEffectiveBaseline != null
            ? svg`<line x1="${PAD_L}" y1="${toY(counterEffectiveBaseline).toFixed(1)}" x2="${W}" y2="${toY(counterEffectiveBaseline).toFixed(1)}" stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.5" />
                  <text x="${PAD_L + 2}" y="${toY(counterEffectiveBaseline) + 11}" text-anchor="start" fill="var(--secondary-text-color)" font-size="8">${t("baseline", this._lang)}</text>`
            : nothing}
          <!-- Current dot -->
          <circle cx="${dotCx.toFixed(1)}" cy="${dotCy.toFixed(1)}" r="3.5" fill="var(--primary-color)" />
          <!-- Event markers -->
          ${eventMarkers.map((e) => {
            const ex = toX(e.ts);
            const color = e.type === "completed" ? "var(--success-color, #4caf50)"
                        : e.type === "skipped" ? "var(--warning-color, #ff9800)"
                        : "var(--info-color, #2196f3)";
            return svg`
              <line x1="${ex.toFixed(1)}" y1="${PAD_T}" x2="${ex.toFixed(1)}" y2="${H - PAD_B}" stroke="${color}" stroke-width="1" stroke-dasharray="3,3" opacity="0.5" />
              <circle cx="${ex.toFixed(1)}" cy="${PAD_T + 2}" r="5" fill="${color}" opacity="0.8" />
              <text x="${ex.toFixed(1)}" y="${PAD_T + 6}" text-anchor="middle" fill="white" font-size="7" font-weight="bold">${e.type === "completed" ? "\u2713" : e.type === "skipped" ? "\u23ED" : "\u21BA"}</text>
            `;
          })}
          <!-- Hover hit targets (downsampled for performance) -->
          ${hoverPoints.map((p) => {
            const cx = toX(p.ts);
            const cy = toY(p.val);
            const dateStr = new Date(p.ts).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
            let valStr = `${p.val.toFixed(1)} ${unit}`;
            if (hasMinMax && p.min != null && p.max != null) {
              valStr += ` (${p.min.toFixed(1)}–${p.max.toFixed(1)})`;
            }
            return svg`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="8" fill="transparent" tabindex="0"
              @mouseenter=${(ev: MouseEvent) => this._showSparklineTooltip(ev, `${dateStr}\n${valStr}`)}
              @focus=${(ev: FocusEvent) => this._showSparklineTooltip(ev, `${dateStr}\n${valStr}`)}
              @mouseleave=${() => { this._sparklineTooltip = null; }}
              @blur=${() => { this._sparklineTooltip = null; }} />`;
          })}
        </svg>
        ${this._sparklineTooltip ? html`
          <div class="sparkline-tooltip" role="tooltip" aria-live="assertive" style="left:${this._sparklineTooltip.x}px;top:${this._sparklineTooltip.y}px">
            ${this._sparklineTooltip.text.split("\n").map((line) => html`<div>${line}</div>`)}
          </div>
        ` : nothing}
      </div>
    `;
  }

  private _showSparklineTooltip(e: MouseEvent | FocusEvent, text: string) {
    const el = e.currentTarget as SVGElement;
    const container = el.closest(".sparkline-container");
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const circle = (el as Element).getBoundingClientRect();
    this._sparklineTooltip = {
      x: circle.left - rect.left + circle.width / 2,
      y: circle.top - rect.top - 8,
      text,
    };
  }

  private _renderHistoryEntry(entry: HistoryEntry) {
    const L = this._lang;
    return html`
      <div class="history-entry">
        <div class="history-icon ${entry.type}">
          <ha-icon .icon=${STATUS_ICONS[entry.type] || "mdi:circle"}></ha-icon>
        </div>
        <div class="history-content">
          <div><strong>${t(entry.type, L)}</strong></div>
          <div class="history-date">${formatDateTime(entry.timestamp, L)}</div>
          ${entry.notes ? html`<div>${entry.notes}</div>` : nothing}
          <div class="history-details">
            ${entry.cost != null ? html`<span>${t("cost", L)}: ${entry.cost.toFixed(2)} €</span>` : nothing}
            ${entry.duration != null ? html`<span>${t("duration", L)}: ${entry.duration} min</span>` : nothing}
            ${entry.trigger_value != null ? html`<span>${t("trigger_val", L)}: ${entry.trigger_value}</span>` : nothing}
          </div>
        </div>
      </div>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        height: 100%;
        background: var(--primary-background-color);
      }

      .panel {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .header {
        background: var(--app-header-background-color, var(--primary-color));
        color: var(--app-header-text-color, white);
        padding: 12px 16px;
        font-size: 16px;
      }

      .breadcrumbs { display: flex; align-items: center; gap: 4px; }
      .breadcrumbs a { color: inherit; opacity: 0.8; cursor: pointer; text-decoration: none; }
      .breadcrumbs a:hover { opacity: 1; text-decoration: underline; }
      .breadcrumbs .sep { opacity: 0.5; margin: 0 4px; }
      .breadcrumbs .current { font-weight: 500; }

      .content { flex: 1; overflow-y: auto; padding: 0 16px 16px; }

      .filter-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        gap: 8px;
      }

      .filter-bar select {
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
      }

      .task-table { display: flex; flex-direction: column; }

      .task-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-bottom: 1px solid var(--divider-color);
        cursor: pointer;
        transition: background 0.15s;
      }

      .task-row:hover {
        background: var(--table-row-alternative-background-color, rgba(0, 0, 0, 0.04));
      }

      .cell { font-size: 14px; }
      .cell.object-name { color: var(--primary-color); cursor: pointer; min-width: 100px; }
      .cell.task-name { flex: 1; font-weight: 500; }
      .cell.type { min-width: 80px; color: var(--secondary-text-color); }

      .detail-section { padding: 16px 0; }

      .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }
      .detail-header h2 { margin: 0; font-size: 22px; }
      h3 { margin: 16px 0 8px; font-size: 16px; font-weight: 500; }
      .meta { color: var(--secondary-text-color); margin: 4px 0; }
      .empty { color: var(--secondary-text-color); font-style: italic; }
      .analysis-empty-state { text-align: center; padding: 24px 16px; }
      .analysis-empty-state .empty { font-size: 15px; margin-bottom: 8px; }
      .analysis-empty-state .empty-icon {
        --mdc-icon-size: 48px;
        color: var(--secondary-text-color);
        opacity: 0.4;
        display: block;
        margin: 0 auto 12px;
      }
      .empty-hint { color: var(--secondary-text-color); font-size: 13px; margin: 4px 0; }
      .analysis-progress {
        width: 120px; margin: 12px auto 4px; height: 6px;
        background: var(--divider-color, #e0e0e0); border-radius: 3px; overflow: hidden;
      }
      .analysis-progress-bar {
        height: 100%; background: var(--primary-color); border-radius: 3px;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 8px;
      }

      .info-item {
        display: flex;
        flex-direction: column;
        padding: 8px;
        background: var(--card-background-color, #fff);
        border-radius: 8px;
      }

      .info-item .label {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-bottom: 2px;
      }

      /* Dashboard redesign styles */

      .task-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: var(--card-background-color, #fff);
        border-radius: 8px;
        margin-bottom: 16px;
        gap: 12px;
        flex-wrap: wrap;
      }

      .task-header-title {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
      }

      .task-name-breadcrumb,
      .object-name-breadcrumb {
        cursor: pointer;
        color: var(--primary-text-color);
        text-decoration: none;
      }

      .task-name-breadcrumb:hover,
      .object-name-breadcrumb:hover {
        text-decoration: underline;
      }

      .breadcrumb-separator {
        color: var(--secondary-text-color);
        margin: 0 4px;
      }

      .status-chip {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
      }

      .status-chip.ok {
        background: #4caf50;
        color: white;
      }

      .status-chip.warning {
        background: #ff9800;
        color: white;
      }

      .status-chip.overdue {
        background: #f44336;
        color: white;
      }

      .user-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        margin-left: 8px;
        background: var(--primary-color);
        color: var(--text-primary-color);
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
      }

      .user-badge ha-icon {
        --mdc-icon-size: 14px;
      }

      .task-header-actions {
        display: flex;
        gap: 8px;
      }

      .more-menu-btn {
        position: relative;
      }

      .dropdown-menu {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        background: var(--card-background-color, #fff);
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        z-index: 100;
        min-width: 160px;
      }

      .more-menu-btn:hover .dropdown-menu {
        display: block;
      }

      .menu-item {
        padding: 10px 16px;
        cursor: pointer;
        border-bottom: 1px solid var(--divider-color);
      }

      .menu-item:last-child {
        border-bottom: none;
      }

      .menu-item:hover {
        background: var(--table-row-alternative-background-color, rgba(0, 0, 0, 0.04));
      }

      .menu-item.danger {
        color: #f44336;
      }

      .tab-bar {
        display: flex;
        gap: 4px;
        border-bottom: 2px solid var(--divider-color);
        margin-bottom: 16px;
      }

      .tab {
        padding: 12px 24px;
        cursor: pointer;
        font-weight: 500;
        color: var(--secondary-text-color);
        border-bottom: 2px solid transparent;
        margin-bottom: -2px;
        transition: all 0.2s;
      }

      .tab:hover {
        color: var(--primary-text-color);
      }

      .tab.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
      }

      .tab-content {
        padding: 16px 0;
      }

      .kpi-bar {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 12px;
        margin-bottom: 24px;
      }

      .kpi-card {
        background: var(--card-background-color, #fff);
        border-radius: 8px;
        padding: 16px 12px;
        text-align: center;
        border: 1px solid var(--divider-color);
      }

      .kpi-card.warning {
        border-color: #ff9800;
        background: rgba(255, 152, 0, 0.1);
      }

      .kpi-card.overdue {
        border-color: #f44336;
        background: rgba(244, 67, 54, 0.1);
      }

      .kpi-label {
        font-size: 11px;
        color: var(--secondary-text-color);
        margin-bottom: 6px;
        text-transform: uppercase;
        font-weight: 500;
      }

      .kpi-value {
        font-size: 16px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .kpi-value-large {
        font-size: 22px;
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .kpi-subtext {
        font-size: 10px;
        color: var(--secondary-text-color);
        margin-top: 4px;
      }

      .two-column-layout {
        display: grid;
        grid-template-columns: 40% 60%;
        gap: 16px;
        margin-bottom: 24px;
      }

      .two-column-layout.single-column {
        grid-template-columns: 1fr;
      }

      .left-column,
      .right-column {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .recent-activities {
        background: var(--card-background-color, #fff);
        border-radius: 8px;
        padding: 16px;
        border: 1px solid var(--divider-color);
      }

      .recent-activities h3 {
        margin: 0 0 12px 0;
      }

      .activity-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 0;
        border-bottom: 1px solid var(--divider-color);
      }

      .activity-item:last-of-type {
        border-bottom: none;
      }

      .activity-icon {
        font-size: 18px;
        width: 24px;
        text-align: center;
      }

      .activity-date {
        font-size: 12px;
        color: var(--secondary-text-color);
        min-width: 120px;
      }

      .activity-note {
        flex: 1;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .activity-badge {
        font-size: 12px;
        padding: 2px 8px;
        background: var(--primary-color);
        color: white;
        border-radius: 12px;
      }

      .activity-show-all {
        margin-top: 12px;
        text-align: center;
      }

      .history-filters-new {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }

      .filter-chips {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .filter-controls {
        display: flex;
        gap: 8px;
      }

      .search-input {
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        font-size: 14px;
        min-width: 200px;
      }

      .search-input:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      /* Recommendation Card */
      .recommendation-card {
        background: var(--card-background-color, #fff);
        border-radius: 8px;
        padding: 16px;
        border: 1px solid var(--divider-color);
      }

      .recommendation-card h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
      }

      .interval-comparison {
        margin-bottom: 16px;
      }

      .interval-bar {
        margin-bottom: 12px;
      }

      .interval-label {
        font-size: 12px;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .interval-visual {
        height: 24px;
        border-radius: 4px;
        transition: width 0.3s;
      }

      .interval-visual.current {
        background: var(--secondary-text-color);
        opacity: 0.5;
      }

      .interval-visual.suggested {
        background: var(--primary-color);
      }

      .confidence-badge {
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 3px;
        background: var(--divider-color);
      }

      .confidence-badge.high {
        background: #4caf50;
        color: white;
      }

      .confidence-badge.medium {
        background: #ff9800;
        color: white;
      }

      .confidence-badge.low {
        background: var(--secondary-text-color);
        color: white;
      }

      .recommendation-actions {
        display: flex;
        gap: 8px;
      }

      /* Seasonal Card Compact */
      .seasonal-card-compact {
        background: var(--card-background-color, #fff);
        border-radius: 8px;
        padding: 16px;
        border: 1px solid var(--divider-color);
      }

      .seasonal-card-compact h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
      }

      .seasonal-mini-chart {
        display: flex;
        align-items: flex-end;
        gap: 4px;
        height: 60px;
        margin-bottom: 12px;
      }

      .seasonal-bar {
        flex: 1;
        border-radius: 2px 2px 0 0;
        transition: all 0.2s;
        cursor: pointer;
      }

      .seasonal-bar.low {
        background: #2196f3;
      }

      .seasonal-bar.normal {
        background: var(--secondary-text-color);
        opacity: 0.5;
      }

      .seasonal-bar.high {
        background: #ff9800;
      }

      .seasonal-bar.current {
        border: 2px solid var(--primary-color);
        box-sizing: border-box;
      }

      .seasonal-legend {
        display: flex;
        gap: 12px;
        font-size: 11px;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .legend-item .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }

      .legend-item .dot.low {
        background: #2196f3;
      }

      .legend-item .dot.normal {
        background: var(--secondary-text-color);
        opacity: 0.5;
      }

      .legend-item .dot.high {
        background: #ff9800;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .kpi-bar {
          grid-template-columns: repeat(2, 1fr);
        }

        .two-column-layout {
          grid-template-columns: 1fr;
        }

        .task-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .task-header-actions {
          width: 100%;
          justify-content: flex-start;
        }
      }

      /* Cost/Duration Card with Toggle */
      .cost-duration-card {
        background: var(--card-background-color, #fff);
        border-radius: 8px;
        padding: 16px;
        border: 1px solid var(--divider-color);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .card-header h3 {
        margin: 0;
        font-size: 16px;
      }

      .toggle-buttons {
        display: flex;
        gap: 4px;
        background: var(--divider-color);
        border-radius: 4px;
        padding: 2px;
      }

      .toggle-btn {
        padding: 6px 12px;
        border: none;
        background: transparent;
        color: var(--primary-text-color);
        cursor: pointer;
        border-radius: 3px;
        font-size: 13px;
        transition: all 0.2s;
      }

      .toggle-btn:hover {
        background: rgba(0, 0, 0, 0.05);
      }

      .toggle-btn.active {
        background: var(--primary-color);
        color: white;
      }

      /* ha-button handles variant="danger" natively */
    `,
  ];
}
