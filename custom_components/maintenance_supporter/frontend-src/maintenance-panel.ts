/** Maintenance Supporter Sidebar Panel. */

import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { sharedStyles, STATUS_COLORS, STATUS_ICONS, t, formatDate, formatDateTime, formatDueDays } from "./styles";
import { panelStyles } from "./panel-styles";
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
  TriggerConfig,
  StatisticsPoint,
} from "./types";
import { StatisticsService } from "./statistics-service";
import { UserService } from "./user-service";
import "./components/object-dialog";
import type { MaintenanceObjectDialog } from "./components/object-dialog";
import "./components/task-dialog";
import type { MaintenanceTaskDialog } from "./components/task-dialog";
import "./components/complete-dialog";
import type { MaintenanceCompleteDialog } from "./components/complete-dialog";
import "./components/qr-dialog";
import type { MaintenanceQrDialog } from "./components/qr-dialog";
import "./components/confirm-dialog";
import type { MaintenanceConfirmDialog } from "./components/confirm-dialog";
import "./components/settings-view";
import "./components/seasonal-overrides-dialog";
import type { SeasonalOverridesDialog } from "./components/seasonal-overrides-dialog";
import "./components/group-dialog";
import type { MaintenanceGroupDialog } from "./components/group-dialog";
import { renderTriggerSection, type SparklineContext } from "./renderers/sparkline";
import { renderPredictionSection } from "./renderers/prediction";
import { renderWeibullSection } from "./renderers/weibull";
import { renderSeasonalCardCompact, renderSeasonalCardExpanded } from "./renderers/seasonal";
import { renderCostDurationCard } from "./renderers/charts";

type View = "overview" | "object" | "task" | "all_objects";
type SortMode = "due_date" | "object" | "type" | "task_name" | "area" | "assigned_user" | "group";
type ObjectSortMode = "alphabetical" | "due_soonest" | "task_count";
type GroupByMode = "none" | "area" | "group" | "user";

// Chart dimension constants for mini sparklines (overview)
const MINI_SPARKLINE_W = 60;
const MINI_SPARKLINE_H = 20;
const MAX_MINI_POINTS = 30;

@customElement("maintenance-supporter-panel")
export class MaintenanceSupporterPanel extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Boolean, reflect: true }) public narrow = false;
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
  @state() private _features: AdvancedFeatures = { adaptive: false, predictions: false, seasonal: false, environmental: false, budget: false, groups: false, checklists: false, schedule_time: false, completion_actions: false };
  // HA user IDs (UUIDs) granted full panel access despite not being HA admins.
  @state() private _adminPanelUserIds: string[] = [];
  // Default warning_days from the global config entry — used as the initial
  // value in the task-create dialog so the Settings → General → "Default
  // warning days" choice actually flows through to new tasks.
  @state() private _defaultWarningDays = 7;
  @state() private _actionLoading = false;
  @state() private _moreMenuOpen = false;
  @state() private _toastMessage = "";
  private _toastTimer: ReturnType<typeof setTimeout> | null = null;
  private _dismissedSuggestions = new Set<string>();

  // Dashboard redesign state
  @state() private _overviewTab: "dashboard" | "settings" = "dashboard";
  @state() private _activeTab: "overview" | "history" = "overview";
  @state() private _costDurationToggle: "cost" | "duration" | "both" = "both";
  @state() private _historySearch = "";
  @state() private _sortMode: SortMode = "due_date";
  @state() private _objectSortMode: ObjectSortMode = "alphabetical";
  @state() private _groupByMode: GroupByMode = "none";

  private _statsService: StatisticsService | null = null;
  private _userService: UserService | null = null;
  private _dataLoaded = false;
  private _lastConnection: unknown = null;

  private get _lang(): string {
    return this.hass?.language || "en";
  }

  /**
   * Operator mode = read-only end-user mode (hides every create/edit/delete action).
   *
   * Gating (OR of exceptions flips to full panel):
   *   - admins (incl. the owner) always see the full panel
   *   - non-admin users whose ID is in the `admin_panel_user_ids` setting
   *     also see the full panel (per-user override)
   *   - everyone else sees operator mode (Complete / Skip only)
   *
   * The user list is managed by an admin under Settings → Panel Access
   * (either in the panel's Settings tab or HA Config Flow).
   */
  private get _isOperator(): boolean {
    const u = this.hass?.user;
    if (!u) return true; // pre-hass state: render safe default
    if (u.is_admin) return false;
    return !this._adminPanelUserIds.includes(u.id);
  }

  private _popstateHandler = (e: PopStateEvent) => this._onPopState(e);

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("popstate", this._popstateHandler);
    const saved = localStorage.getItem("maintenance_supporter_sort");
    if (saved && ["due_date", "object", "type", "task_name", "area", "assigned_user", "group"].includes(saved)) {
      this._sortMode = saved as SortMode;
    }
    const savedObj = localStorage.getItem("maintenance_supporter_object_sort");
    if (savedObj && ["alphabetical", "due_soonest", "task_count"].includes(savedObj)) {
      this._objectSortMode = savedObj as ObjectSortMode;
    }
    const savedGroup = localStorage.getItem("maintenance_supporter_groupby");
    if (savedGroup && ["none", "area", "group", "user"].includes(savedGroup)) {
      this._groupByMode = savedGroup as GroupByMode;
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("popstate", this._popstateHandler);
    if (this._unsub) {
      this._unsub();
      this._unsub = null;
    }
    this._dataLoaded = false;
    this._lastConnection = null;
    this._deepLinkHandled = false;
    this._statsService?.clearCache();
    this._statsService = null;
  }

  updated(changedProps: Map<string, unknown>): void {
    super.updated(changedProps);
    if (changedProps.has("hass") && this.hass) {
      if (!this._dataLoaded) {
        this._dataLoaded = true;
        this._lastConnection = this.hass.connection;
        // Seed initial history state so back button returns to overview
        history.replaceState({ msp_view: "overview", msp_entry: null, msp_task: null }, "");
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

      if (!this._statsService) {
        this._statsService = new StatisticsService(this.hass);
        this._fetchMiniStatsForOverview();
      } else {
        this._statsService.updateHass(this.hass);
      }

      if (!this._userService) {
        this._userService = new UserService(this.hass);
        this._userService.getUsers();
      } else {
        this._userService.updateHass(this.hass);
      }
    }
  }

  private async _loadData(): Promise<void> {
    const [objResult, statsResult, budgetResult, groupsResult, settingsResult] = await Promise.all([
      this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/objects" }).catch(() => null),
      this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/statistics" }).catch(() => null),
      this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/budget_status" }).catch(() => null),
      this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/groups" }).catch(() => null),
      this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/settings" }).catch(() => null),
    ]);
    if (objResult) this._objects = (objResult as { objects: MaintenanceObjectResponse[] }).objects;
    if (statsResult) this._stats = statsResult as StatisticsResponse;
    if (budgetResult) this._budget = budgetResult as BudgetStatus;
    if (groupsResult) this._groups = (groupsResult as { groups: Record<string, MaintenanceGroup> }).groups || {};
    if (settingsResult) {
      const sr = settingsResult as {
        features: AdvancedFeatures;
        admin_panel_user_ids?: string[];
        general?: { default_warning_days?: number };
      };
      this._features = sr.features;
      this._adminPanelUserIds = sr.admin_panel_user_ids || [];
      const dwd = sr.general?.default_warning_days;
      if (typeof dwd === "number" && dwd >= 0 && dwd <= 365) {
        this._defaultWarningDays = dwd;
      }
    }

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

    // Always clean URL params — they are consumed once
    const cleanUrl = window.location.pathname + window.location.hash;
    history.replaceState(history.state, "", cleanUrl);

    // Validate that the referenced object exists
    const obj = this._getObject(entryId);
    if (!obj) {
      this._showOverview();
      return;
    }

    // Navigate to the right view
    if (taskId) {
      const task = obj.tasks.find((t) => t.id === taskId);
      if (!task) {
        this._showObject(entryId);
        return;
      }
      this._showTask(entryId, taskId);
      if (action === "complete") {
        requestAnimationFrame(() => {
          this._openCompleteDialog(entryId, taskId, task.name, this._features.checklists ? task.checklist : undefined, this._features.adaptive && !!task.adaptive_config?.enabled);
        });
      } else if (action === "quick_complete") {
        // v1.3.0: silent complete using pre-configured defaults; falls back
        // to the normal dialog if the task has none.
        requestAnimationFrame(() => {
          this._handleQuickComplete(entryId, taskId, task);
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

    const entities: Array<{ entityId: string; isCounter: boolean }> = [];
    for (const obj of this._objects) {
      for (const task of obj.tasks) {
        const entityId = task.trigger_config?.entity_id;
        if (!entityId) continue;
        entities.push({ entityId, isCounter: this._isCounterEntity(task.trigger_config) });
      }
    }

    if (entities.length === 0) return;
    const batchResult = await this._statsService.getBatchMiniStats(entities);
    this._miniStatsData = new Map([...this._miniStatsData, ...batchResult]);
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

        // Collect groups that contain this task
        const groupNames: string[] = [];
        for (const group of Object.values(this._groups)) {
          if (group.task_refs?.some((r) => r.entry_id === obj.entry_id && r.task_id === task.id)) {
            groupNames.push(group.name);
          }
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
          interval_anchor: task.interval_anchor ?? null,
          history: task.history || [],
          enabled: task.enabled,
          nfc_tag_id: task.nfc_tag_id ?? null,
          area_id: obj.object.area_id ?? null,
          responsible_user_id: task.responsible_user_id ?? null,
          group_names: groupNames,
        });
      }
    }
    const statusOrder: Record<string, number> = { overdue: 0, triggered: 1, due_soon: 2, ok: 3 };
    const byStatus = (a: TaskRow, b: TaskRow) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9);
    const byDays = (a: TaskRow, b: TaskRow) => (a.days_until_due ?? 99999) - (b.days_until_due ?? 99999);
    const byDue = (a: TaskRow, b: TaskRow) => byStatus(a, b) || byDays(a, b);
    const areaName = (r: TaskRow) =>
      r.area_id ? this.hass?.areas?.[r.area_id]?.name || "" : "";
    const userName = (r: TaskRow) =>
      r.responsible_user_id ? this._userService?.getUserName(r.responsible_user_id) || "" : "";
    const groupName = (r: TaskRow) => r.group_names[0] || "";
    const sorts: Record<SortMode, (a: TaskRow, b: TaskRow) => number> = {
      due_date: byDue,
      object: (a, b) => a.object_name.localeCompare(b.object_name) || byDue(a, b),
      type: (a, b) => a.type.localeCompare(b.type) || byDue(a, b),
      task_name: (a, b) => a.task_name.localeCompare(b.task_name),
      area: (a, b) => {
        const an = areaName(a), bn = areaName(b);
        // Empty areas at end
        if (!an && bn) return 1;
        if (an && !bn) return -1;
        return an.localeCompare(bn) || byDue(a, b);
      },
      assigned_user: (a, b) => {
        const an = userName(a), bn = userName(b);
        if (!an && bn) return 1;
        if (an && !bn) return -1;
        return an.localeCompare(bn) || byDue(a, b);
      },
      group: (a, b) => {
        const an = groupName(a), bn = groupName(b);
        if (!an && bn) return 1;
        if (an && !bn) return -1;
        return an.localeCompare(bn) || byDue(a, b);
      },
    };
    rows.sort(sorts[this._sortMode]);
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

  /** Push a browser history entry so the back button navigates within the panel. */
  private _pushPanelState(view: View, entryId?: string | null, taskId?: string | null): void {
    const state = { msp_view: view, msp_entry: entryId || null, msp_task: taskId || null };
    history.pushState(state, "");
  }

  /** Handle browser back/forward button. */
  private _onPopState(e: PopStateEvent): void {
    const s = e.state as { msp_view?: View; msp_entry?: string; msp_task?: string } | null;
    if (!s?.msp_view) {
      // No panel state → we're leaving the panel, let HA handle it
      return;
    }
    // Restore view without pushing another history entry
    this._view = s.msp_view;
    this._selectedEntryId = s.msp_entry || null;
    this._selectedTaskId = s.msp_task || null;
    this._moreMenuOpen = false;
    if (s.msp_view === "task" && s.msp_entry && s.msp_task) {
      this._historyFilter = null;
      const task = this._getTask(s.msp_entry, s.msp_task);
      if (task?.trigger_config?.entity_id) {
        this._fetchDetailStats(task.trigger_config.entity_id, this._isCounterEntity(task.trigger_config));
      }
    }
  }

  private _showOverview(): void {
    this._pushPanelState("overview");
    this._view = "overview";
    this._selectedEntryId = null;
    this._selectedTaskId = null;
    this._moreMenuOpen = false;
  }

  private _showAllObjects(): void {
    this._pushPanelState("all_objects");
    this._view = "all_objects";
    this._selectedEntryId = null;
    this._selectedTaskId = null;
  }

  private _showObject(entryId: string): void {
    this._pushPanelState("object", entryId);
    this._view = "object";
    this._selectedEntryId = entryId;
    this._selectedTaskId = null;
  }

  private _showTask(entryId: string, taskId: string): void {
    this._pushPanelState("task", entryId, taskId);
    this._view = "task";
    this._selectedEntryId = entryId;
    this._selectedTaskId = taskId;
    this._activeTab = "overview";
    this._historyFilter = null;

    // Lazy-load statistics for the task's trigger entity
    const task = this._getTask(entryId, taskId);
    if (task?.trigger_config?.entity_id) {
      const entityId = task.trigger_config.entity_id;
      const isCounter = this._isCounterEntity(task.trigger_config);
      this._fetchDetailStats(entityId, isCounter);
    }
  }

  // --- Toast ---

  private _showToast(msg: string): void {
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastMessage = msg;
    this._toastTimer = setTimeout(() => { this._toastMessage = ""; this._toastTimer = null; }, 4000);
  }

  // --- Actions ---

  private async _deleteObject(entryId: string): Promise<void> {
    const dlg = this.shadowRoot!.querySelector<MaintenanceConfirmDialog>("maintenance-confirm-dialog");
    const ok = await dlg?.confirm({
      title: t("delete", this._lang),
      message: t("confirm_delete_object", this._lang),
      confirmText: t("delete", this._lang),
      danger: true,
    });
    if (!ok) return;
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/object/delete",
        entry_id: entryId,
      });
      this._showOverview();
      await this._loadData();
    } catch {
      this._showToast(t("action_error", this._lang));
    }
  }

  private async _deleteTask(entryId: string, taskId: string): Promise<void> {
    const dlg = this.shadowRoot!.querySelector<MaintenanceConfirmDialog>("maintenance-confirm-dialog");
    const ok = await dlg?.confirm({
      title: t("delete", this._lang),
      message: t("confirm_delete_task", this._lang),
      confirmText: t("delete", this._lang),
      danger: true,
    });
    if (!ok) return;
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/task/delete",
        entry_id: entryId,
        task_id: taskId,
      });
      this._showObject(entryId);
      await this._loadData();
    } catch {
      this._showToast(t("action_error", this._lang));
    }
  }

  private async _skipTask(entryId: string, taskId: string, reason?: string): Promise<void> {
    this._actionLoading = true;
    try {
      const msg: Record<string, unknown> = {
        type: "maintenance_supporter/task/skip",
        entry_id: entryId,
        task_id: taskId,
      };
      if (reason) msg.reason = reason;
      await this.hass.connection.sendMessagePromise(msg);
      await this._loadData();
    } catch {
      this._showToast(t("action_error", this._lang));
    } finally {
      this._actionLoading = false;
    }
  }

  private async _resetTask(entryId: string, taskId: string, resetDate?: string): Promise<void> {
    this._actionLoading = true;
    try {
      const msg: Record<string, unknown> = {
        type: "maintenance_supporter/task/reset",
        entry_id: entryId,
        task_id: taskId,
      };
      if (resetDate) msg.date = resetDate;
      await this.hass.connection.sendMessagePromise(msg);
      await this._loadData();
    } catch {
      this._showToast(t("action_error", this._lang));
    } finally {
      this._actionLoading = false;
    }
  }

  private async _applySuggestion(entryId: string, taskId: string, interval: number): Promise<void> {
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/task/apply_suggestion",
        entry_id: entryId,
        task_id: taskId,
        interval: interval,
      });
      await this._loadData();
    } catch {
      this._showToast(t("action_error", this._lang));
    }
  }

  private _openSeasonalOverrides(task: MaintenanceTask): void {
    const dlg = this.shadowRoot!.querySelector<SeasonalOverridesDialog>("maintenance-seasonal-overrides-dialog");
    if (!dlg || !this._selectedEntryId) return;
    const overrides = task.adaptive_config?.seasonal_overrides as Record<number, number> | null | undefined;
    dlg.open(this._selectedEntryId, task.id, overrides);
  }

  private async _reanalyzeInterval(entryId: string, taskId: string): Promise<void> {
    try {
      const res = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/task/analyze_interval",
        entry_id: entryId,
        task_id: taskId,
      }) as {
        recommended_interval: number | null;
        confidence: string;
        data_points: number;
        recommendation_reason: string | null;
      };
      if (res.recommended_interval) {
        this._showToast(
          `${t("reanalyze_result", this._lang)}: ${res.recommended_interval} ${t("days", this._lang)} ` +
          `(${t(`confidence_${res.confidence}`, this._lang)}, ${res.data_points} ${t("data_points", this._lang)})`,
        );
      } else {
        this._showToast(t("reanalyze_insufficient_data", this._lang));
      }
      await this._loadData();
    } catch {
      this._showToast(t("action_error", this._lang));
    }
  }

  private async _promptSkipTask(entryId: string, taskId: string): Promise<void> {
    const dlg = this.shadowRoot!.querySelector<MaintenanceConfirmDialog>("maintenance-confirm-dialog");
    if (!dlg) return;
    const result = await dlg.prompt({
      title: t("skip", this._lang),
      message: t("skip_reason_prompt", this._lang),
      confirmText: t("skip", this._lang),
      inputLabel: t("reason_optional", this._lang),
      inputType: "text",
    });
    if (!result.confirmed) return;
    this._skipTask(entryId, taskId, result.value || undefined);
  }

  private async _promptResetTask(entryId: string, taskId: string): Promise<void> {
    const dlg = this.shadowRoot!.querySelector<MaintenanceConfirmDialog>("maintenance-confirm-dialog");
    if (!dlg) return;
    const result = await dlg.prompt({
      title: t("reset", this._lang),
      message: t("reset_date_prompt", this._lang),
      confirmText: t("reset", this._lang),
      inputLabel: t("reset_date_optional", this._lang),
      inputType: "date",
    });
    if (!result.confirmed) return;
    this._resetTask(entryId, taskId, result.value || undefined);
  }

  private _dismissSuggestion(entryId?: string, taskId?: string): void {
    if (entryId && taskId) {
      this._dismissedSuggestions.add(`${entryId}_${taskId}`);
    }
    this.requestUpdate();
  }

  // v1.3.0: silent complete-via-QR. Tries the quick endpoint first; if the
  // task has no quick_complete_defaults configured, falls back to the
  // normal complete dialog so the user is never stuck after a scan.
  private async _handleQuickComplete(
    entryId: string, taskId: string, task: MaintenanceTask,
  ): Promise<void> {
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/task/quick_complete",
        entry_id: entryId, task_id: taskId,
      });
      this._showToast(t("quick_complete_success", this._lang));
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code || "";
      if (code === "no_defaults") {
        // No defaults set — open the dialog so the user can fill them in.
        this._openCompleteDialog(
          entryId, taskId, task.name,
          this._features.checklists ? task.checklist : undefined,
          this._features.adaptive && !!task.adaptive_config?.enabled,
        );
      } else {
        this._showToast(t("action_error", this._lang));
      }
    }
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

  private _onDialogEvent = async (): Promise<void> => {
    try { await this._loadData(); } catch { /* subscription will sync */ }
  };

  // --- Render ---

  render() {
    return html`
      <div class="panel">
        ${this.narrow || this._view !== "overview" ? this._renderHeader() : nothing}
        <div class="content">
          ${this._view === "overview"
            ? this._renderOverview()
            : this._view === "all_objects"
            ? this._renderAllObjects()
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
        .checklistsEnabled=${this._features.checklists}
        .scheduleTimeEnabled=${this._features.schedule_time}
        .completionActionsEnabled=${this._features.completion_actions}
        .defaultWarningDays=${this._defaultWarningDays}
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
      <maintenance-confirm-dialog
        .hass=${this.hass}
      ></maintenance-confirm-dialog>
      <maintenance-seasonal-overrides-dialog
        .hass=${this.hass}
        @overrides-saved=${this._onDialogEvent}
      ></maintenance-seasonal-overrides-dialog>
      <maintenance-group-dialog
        .hass=${this.hass}
        .objects=${this._objects}
        @group-saved=${this._onDialogEvent}
      ></maintenance-group-dialog>
      ${this._toastMessage ? html`<div class="toast">${this._toastMessage}</div>` : nothing}
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
        ${this.narrow ? html`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : nothing}
        ${this._view !== "overview"
          ? html`<ha-icon-button
              .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
              @click=${() => {
                if (this._view === "task") this._showObject(this._selectedEntryId!);
                else this._showOverview();
              }}
            ></ha-icon-button>`
          : nothing}
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
    const L = this._lang;
    const isOperator = this._isOperator;
    // Operator mode: hide the Settings tab so end-users can't toggle features
    if (isOperator && this._overviewTab === "settings") {
      this._overviewTab = "dashboard";
    }
    return html`
      ${!isOperator ? html`
        <div class="tab-bar">
          <div class="tab ${this._overviewTab === "dashboard" ? "active" : ""}"
            @click=${() => { this._overviewTab = "dashboard"; }}>
            ${t("dashboard", L)}
          </div>
          <div class="tab ${this._overviewTab === "settings" ? "active" : ""}"
            @click=${() => { this._overviewTab = "settings"; }}>
            ${t("settings", L)}
          </div>
        </div>
      ` : nothing}
      ${this._overviewTab === "dashboard"
        ? this._renderDashboard()
        : html`<maintenance-settings-view
            .hass=${this.hass}
            .features=${this._features}
            .budget=${this._budget}
            @settings-changed=${this._onSettingsChanged}
          ></maintenance-settings-view>`}
    `;
  }

  private _renderDashboard() {
    const s = this._stats;
    const rows = this._taskRows;
    const L = this._lang;
    const isOperator = this._isOperator;

    return html`
      ${s
        ? html`
            <div class="stats-bar">
              <div class="stat-item clickable" @click=${() => this._showAllObjects()}>
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
        <label class="filter-field">
          <span class="filter-label">${t("filter_label", L)}</span>
          <select
            @change=${(e: Event) => (this._filterStatus = (e.target as HTMLSelectElement).value)}
          >
            <option value="">${t("all", L)}</option>
            <option value="overdue">${t("overdue", L)}</option>
            <option value="due_soon">${t("due_soon", L)}</option>
            <option value="triggered">${t("triggered", L)}</option>
            <option value="ok">${t("ok", L)}</option>
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${t("user_label", L)}</span>
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
        </label>
        <label class="filter-field">
          <span class="filter-label">${t("sort_label", L)}</span>
          <select
            .value=${this._sortMode}
            @change=${(e: Event) => {
              this._sortMode = (e.target as HTMLSelectElement).value as SortMode;
              localStorage.setItem("maintenance_supporter_sort", this._sortMode);
            }}
          >
            <option value="due_date" ?selected=${this._sortMode === "due_date"}>${t("sort_due_date", L)}</option>
            <option value="object" ?selected=${this._sortMode === "object"}>${t("sort_object", L)}</option>
            <option value="type" ?selected=${this._sortMode === "type"}>${t("sort_type", L)}</option>
            <option value="task_name" ?selected=${this._sortMode === "task_name"}>${t("sort_task_name", L)}</option>
            <option value="area" ?selected=${this._sortMode === "area"}>${t("sort_area", L)}</option>
            <option value="assigned_user" ?selected=${this._sortMode === "assigned_user"}>${t("sort_assigned_user", L)}</option>
            <option value="group" ?selected=${this._sortMode === "group"}>${t("sort_group", L)}</option>
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${t("group_by_label", L)}</span>
          <select
            .value=${this._groupByMode}
            @change=${(e: Event) => {
              this._groupByMode = (e.target as HTMLSelectElement).value as GroupByMode;
              localStorage.setItem("maintenance_supporter_groupby", this._groupByMode);
            }}
          >
            <option value="none" ?selected=${this._groupByMode === "none"}>${t("groupby_none", L)}</option>
            <option value="area" ?selected=${this._groupByMode === "area"}>${t("groupby_area", L)}</option>
            ${this._features.groups ? html`<option value="group" ?selected=${this._groupByMode === "group"}>${t("groupby_group", L)}</option>` : nothing}
            <option value="user" ?selected=${this._groupByMode === "user"}>${t("groupby_user", L)}</option>
          </select>
        </label>
        ${!isOperator ? html`
          <ha-button
            @click=${() => this.shadowRoot!.querySelector<MaintenanceObjectDialog>("maintenance-object-dialog")?.openCreate()}
          >
            ${t("new_object", L)}
          </ha-button>
          <ha-button
            @click=${() => this.shadowRoot!.querySelector<MaintenanceTaskDialog>("maintenance-task-dialog")?.openCreate("", this._objects)}
          >
            ${t("new_task", L)}
          </ha-button>
        ` : nothing}
      </div>

      ${rows.length === 0
        ? html`
            <div class="empty-state">
              <ha-svg-icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></ha-svg-icon>
              <p>${t("no_tasks", L)}</p>
            </div>
          `
        : this._groupByMode === "none"
          ? html`
              <div class="task-table">
                ${rows.map((row) => this._renderOverviewRow(row))}
              </div>
            `
          : this._renderGroupedTasks(rows, L)}

      ${this._features.groups && !isOperator ? this._renderGroupsSection() : nothing}
    `;
  }

  private _renderGroupedTasks(rows: TaskRow[], L: string) {
    const groups = new Map<string, TaskRow[]>();
    const noneLabel = t("unassigned", L);
    for (const row of rows) {
      let keys: string[] = [];
      if (this._groupByMode === "area") {
        const a = row.area_id ? this.hass?.areas?.[row.area_id]?.name : null;
        keys = [a || noneLabel];
      } else if (this._groupByMode === "user") {
        const u = row.responsible_user_id ? this._userService?.getUserName(row.responsible_user_id) : null;
        keys = [u || noneLabel];
      } else if (this._groupByMode === "group") {
        keys = row.group_names.length > 0 ? row.group_names : [noneLabel];
      }
      for (const k of keys) {
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k)!.push(row);
      }
    }
    const sorted = [...groups.entries()].sort(([a], [b]) => {
      // Push "unassigned" / "no area" to bottom
      if (a === noneLabel && b !== noneLabel) return 1;
      if (b === noneLabel && a !== noneLabel) return -1;
      return a.localeCompare(b);
    });
    const icon = this._groupByMode === "area" ? "mdi:map-marker-outline"
      : this._groupByMode === "group" ? "mdi:folder-outline"
      : "mdi:account-outline";
    return html`
      ${sorted.map(([key, taskRows]) => html`
        <details class="group-section" open>
          <summary class="group-section-header">
            <ha-icon icon="${icon}"></ha-icon>
            <span>${key}</span>
            <span class="group-section-count">(${taskRows.length})</span>
          </summary>
          <div class="task-table">
            ${taskRows.map((row) => this._renderOverviewRow(row))}
          </div>
        </details>
      `)}
    `;
  }

  private _renderAllObjects() {
    const L = this._lang;
    const isOperator = this._isOperator;

    // Sort + group helpers
    const minDays = (obj: MaintenanceObjectResponse): number => {
      let m = Infinity;
      for (const t of obj.tasks) {
        const d = t.days_until_due;
        if (d !== null && d !== undefined && d < m) m = d;
      }
      return m;
    };
    const sorted = [...this._objects];
    if (this._objectSortMode === "alphabetical") {
      sorted.sort((a, b) => a.object.name.localeCompare(b.object.name));
    } else if (this._objectSortMode === "task_count") {
      sorted.sort((a, b) => b.tasks.length - a.tasks.length || a.object.name.localeCompare(b.object.name));
    } else {
      // due_soonest
      sorted.sort((a, b) => minDays(a) - minDays(b) || a.object.name.localeCompare(b.object.name));
    }

    // Group by area for objects view
    const groupedByArea = (): Map<string, MaintenanceObjectResponse[]> => {
      const map = new Map<string, MaintenanceObjectResponse[]>();
      for (const obj of sorted) {
        const areaId = obj.object.area_id;
        const key = areaId ? this.hass?.areas?.[areaId]?.name || t("unassigned", L) : t("no_area", L);
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(obj);
      }
      return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
    };

    const renderObject = (obj: MaintenanceObjectResponse) => {
      const overdue = obj.tasks.some(t => t.status === "overdue" || t.status === "triggered");
      return html`
        <div class="object-card${overdue ? ' object-card-overdue' : ''}" @click=${() => this._showObject(obj.entry_id)}>
          ${overdue ? html`<span class="overdue-dot" title="${t("has_overdue", L)}"></span>` : nothing}
          <div class="object-card-header">
            <span class="object-card-name">${obj.object.name}</span>
            <span class="object-card-count">${obj.tasks.length} ${t("tasks_lower", L)}</span>
          </div>
          ${obj.object.manufacturer || obj.object.model
            ? html`<div class="object-card-meta">${[obj.object.manufacturer, obj.object.model].filter(Boolean).join(" ")}</div>`
            : nothing}
          ${obj.tasks.length === 0
            ? html`<div class="object-card-empty">${t("no_tasks_yet", L)}</div>`
            : nothing}
        </div>
      `;
    };

    return html`
      <div class="breadcrumb">
        <ha-icon-button @click=${() => this._showOverview()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${t("all_objects", L)}</span>
      </div>
      <div class="filter-bar">
        <label class="filter-field">
          <span class="filter-label">${t("sort_label", L)}</span>
          <select
            .value=${this._objectSortMode}
            @change=${(e: Event) => {
              this._objectSortMode = (e.target as HTMLSelectElement).value as ObjectSortMode;
              localStorage.setItem("maintenance_supporter_object_sort", this._objectSortMode);
            }}
          >
            <option value="alphabetical" ?selected=${this._objectSortMode === "alphabetical"}>${t("sort_alphabetical", L)}</option>
            <option value="due_soonest" ?selected=${this._objectSortMode === "due_soonest"}>${t("sort_due_soonest", L)}</option>
            <option value="task_count" ?selected=${this._objectSortMode === "task_count"}>${t("sort_task_count", L)}</option>
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${t("group_by_label", L)}</span>
          <select
            .value=${this._groupByMode}
            @change=${(e: Event) => {
              this._groupByMode = (e.target as HTMLSelectElement).value as GroupByMode;
              localStorage.setItem("maintenance_supporter_groupby", this._groupByMode);
            }}
          >
            <option value="none" ?selected=${this._groupByMode === "none"}>${t("groupby_none", L)}</option>
            <option value="area" ?selected=${this._groupByMode === "area"}>${t("groupby_area", L)}</option>
          </select>
        </label>
        ${!isOperator ? html`
          <ha-button
            @click=${() => this.shadowRoot!.querySelector<MaintenanceObjectDialog>("maintenance-object-dialog")?.openCreate()}
          >
            ${t("new_object", L)}
          </ha-button>
        ` : nothing}
      </div>
      ${this._groupByMode === "area"
        ? html`
          ${[...groupedByArea().entries()].map(([area, objs]) => html`
            <details class="group-section" open>
              <summary class="group-section-header">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <span>${area}</span>
                <span class="group-section-count">(${objs.length})</span>
              </summary>
              <div class="objects-grid">${objs.map(renderObject)}</div>
            </details>
          `)}
        `
        : html`<div class="objects-grid">${sorted.map(renderObject)}</div>`}
    `;
  }

  private async _onSettingsChanged(): Promise<void> {
    await this._loadData();
  }

  private _renderGroupsSection() {
    if (!this._features.groups) return nothing;
    const entries = Object.entries(this._groups);
    const L = this._lang;

    return html`
      <div class="groups-section">
        <div class="groups-header">
          <h3>${t("groups", L)}</h3>
          <ha-button appearance="plain" @click=${() => this._openGroupCreate()}>
            ${t("new_group", L)}
          </ha-button>
        </div>
        ${entries.length === 0
          ? html`<div class="hint">${t("no_groups", L)}</div>`
          : html`
            <div class="groups-grid">
              ${entries.map(([gid, group]) => {
                const taskNames = group.task_refs
                  .map((ref) => this._getTask(ref.entry_id, ref.task_id)?.name)
                  .filter(Boolean);
                return html`
                  <div class="group-card">
                    <div class="group-card-head">
                      <div class="group-card-name">${group.name}</div>
                      <div class="group-card-actions">
                        <mwc-icon-button title="${t("edit", L)}" @click=${() => this._openGroupEdit(gid)}>
                          <ha-svg-icon path="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"></ha-svg-icon>
                        </mwc-icon-button>
                        <mwc-icon-button title="${t("delete", L)}" @click=${() => this._deleteGroup(gid, group.name)}>
                          <ha-svg-icon path="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z"></ha-svg-icon>
                        </mwc-icon-button>
                      </div>
                    </div>
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
          `}
      </div>
    `;
  }

  private _openGroupCreate(): void {
    this.shadowRoot!.querySelector<MaintenanceGroupDialog>("maintenance-group-dialog")?.openCreate();
  }

  private _openGroupEdit(groupId: string): void {
    const group = this._groups[groupId];
    if (!group) return;
    this.shadowRoot!.querySelector<MaintenanceGroupDialog>("maintenance-group-dialog")?.openEdit(groupId, group);
  }

  private async _deleteGroup(groupId: string, name: string): Promise<void> {
    const dlg = this.shadowRoot!.querySelector<MaintenanceConfirmDialog>("maintenance-confirm-dialog");
    const ok = dlg
      ? await dlg.confirm({
          title: t("delete_group", this._lang),
          message: t("delete_group_confirm", this._lang).replace("{name}", name),
          confirmText: t("delete", this._lang),
        })
      : confirm(`${t("delete_group_confirm", this._lang).replace("{name}", name)}`);
    if (!ok) return;
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/group/delete",
        group_id: groupId,
      });
      await this._loadData();
    } catch {
      this._showToast(t("action_error", this._lang));
    }
  }

  private _renderBudgetBar() {
    const b = this._budget;
    if (!b) return nothing;
    const L = this._lang;
    const cs = b.currency_symbol || "€";
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
                <span>${bar.spent.toFixed(2)} / ${bar.budget.toFixed(2)} ${cs}</span>
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

    const areaName = row.area_id ? this.hass?.areas?.[row.area_id]?.name : null;
    const userName = row.responsible_user_id ? this._userService?.getUserName(row.responsible_user_id) : null;
    const hasSub = row.group_names.length > 0 || areaName || userName;

    return html`
      <div class="task-row${!row.enabled ? ' task-disabled' : ''}">
        <span class="cell-badges">
          <span class="status-badge ${row.status}">${t(row.status, L)}</span>
          ${!row.enabled ? html`<span class="badge-disabled">${t("disabled", L)}</span>` : nothing}
          ${row.nfc_tag_id ? html`<span class="nfc-badge" title="${t("nfc_linked", L)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>` : nothing}
        </span>
        <span class="cell object-name" @click=${(e: Event) => { e.stopPropagation(); this._showObject(row.entry_id); }}>${row.object_name}</span>
        <span class="cell task-name" @click=${() => this._showTask(row.entry_id, row.task_id)}>${row.task_name}</span>
        <span class="task-sub${hasSub ? '' : ' task-sub-empty'}">
          ${row.group_names.length > 0 ? html`
            <span class="sub-chip" title="${t("groups", L)}">
              <ha-icon icon="mdi:folder-outline"></ha-icon>${row.group_names.join(", ")}
            </span>` : nothing}
          ${areaName ? html`
            <span class="sub-chip">
              <ha-icon icon="mdi:map-marker-outline"></ha-icon>${areaName}
            </span>` : nothing}
          ${userName ? html`
            <span class="sub-chip" title="${t("responsible_user", L)}">
              <ha-icon icon="mdi:account-outline"></ha-icon>${userName}
            </span>` : nothing}
        </span>
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
          <mwc-icon-button class="btn-complete" title="${t("complete", L)}" @click=${(e: Event) => { e.stopPropagation(); this._openCompleteDialogForRow(row); }}>
            <ha-icon icon="mdi:check"></ha-icon>
          </mwc-icon-button>
          <mwc-icon-button class="btn-skip" title="${t("skip", L)}" .disabled=${this._actionLoading} @click=${(e: Event) => { e.stopPropagation(); this._promptSkipTask(row.entry_id, row.task_id); }}>
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </mwc-icon-button>
        </span>
      </div>
    `;
  }

  private _openCompleteDialogForRow(row: TaskRow): void {
    const obj = this._objects.find(o => o.entry_id === row.entry_id);
    const task = obj?.tasks.find(t => t.id === row.task_id);
    this._openCompleteDialog(
      row.entry_id, row.task_id, row.task_name,
      this._features.checklists ? task?.checklist : undefined,
      this._features.adaptive && !!task?.adaptive_config?.enabled
    );
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
        // Use entity max, or 2x the threshold as a stable "safe" reference.
        // Using val*2 caused a dynamic ceiling that distorted the bar.
        const entityMax = row.trigger_entity_info?.max;
        const high = entityMax ?? ((below * 2) || 100);
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
    } else if (triggerType === "compound") {
      const logic = tc.compound_logic || (tc as any).operator || "AND";
      const condCount = tc.conditions?.length || 0;
      label = `${logic} (${condCount})`;
      pct = row.trigger_active ? 100 : 0;
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
  private _renderMiniSparkline(row: TaskRow | MaintenanceTask) {
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

    const isOperator = this._isOperator;

    return html`
      <div class="detail-section">
        <div class="detail-header">
          <h2>${o.name}</h2>
          <div class="action-buttons">
            ${!isOperator ? html`
              <ha-button appearance="plain" @click=${() => {
                const dlg = this.shadowRoot!.querySelector<MaintenanceObjectDialog>("maintenance-object-dialog");
                dlg?.openEdit(obj.entry_id, o);
              }}>${t("edit", L)}</ha-button>
              <ha-button appearance="filled" @click=${() => {
                const dlg = this.shadowRoot!.querySelector<MaintenanceTaskDialog>("maintenance-task-dialog");
                dlg?.openCreate(obj.entry_id);
              }}>${t("add_task", L)}</ha-button>
              <ha-button variant="danger" appearance="plain" @click=${() => this._deleteObject(obj.entry_id)}>${t("delete", L)}</ha-button>
            ` : nothing}
            <ha-button appearance="plain" @click=${() => this._openQrForObject(obj.entry_id, o.name)}><ha-icon icon="mdi:qrcode"></ha-icon> ${t("qr_code", L)}</ha-button>
          </div>
        </div>
        ${o.manufacturer || o.model
          ? html`<p class="meta">${[o.manufacturer, o.model].filter(Boolean).join(" ")}</p>`
          : nothing}
        ${o.serial_number ? html`<p class="meta">${t("serial_number_label", L)}: ${o.serial_number}</p>` : nothing}
        ${o.documentation_url && /^https?:\/\//i.test(o.documentation_url)
          ? html`<p class="meta">${t("documentation_url_label", L)}:
              <a href=${o.documentation_url} target="_blank" rel="noopener noreferrer">${o.documentation_url}</a>
            </p>`
          : nothing}
        ${o.installation_date ? html`<p class="meta">${t("installed", L)}: ${formatDate(o.installation_date, L)}</p>` : nothing}

        <h3>${t("tasks", L)} (${obj.tasks.length})</h3>
        ${obj.tasks.length === 0
          ? html`<div class="empty-state-centered">
              <p class="empty">${t("no_tasks_yet", L)}</p>
              <ha-button appearance="filled" @click=${() => {
                const dlg = this.shadowRoot!.querySelector<MaintenanceTaskDialog>("maintenance-task-dialog");
                dlg?.openCreate(obj.entry_id);
              }}>${t("add_first_task", L)}</ha-button>
            </div>`
          : [...obj.tasks].sort((a, b) => {
              const so: Record<string, number> = { overdue: 0, triggered: 1, due_soon: 2, ok: 3 };
              return (so[a.status] ?? 9) - (so[b.status] ?? 9) || (a.days_until_due ?? 99999) - (b.days_until_due ?? 99999);
            }).map((task) => html`
              <div class="task-row${!task.enabled ? ' task-disabled' : ''}">
                <span class="status-badge ${task.status}">${t(task.status, L)}</span>
                ${!task.enabled ? html`<span class="badge-disabled">${t("disabled", L)}</span>` : nothing}
                ${task.nfc_tag_id ? html`<span class="nfc-badge" title="${t("nfc_linked", L)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>` : nothing}
                <span class="cell task-name" @click=${() => this._showTask(obj.entry_id, task.id)}>${task.name}</span>
                ${this._renderUserBadge(task)}
                <span class="cell type">${t(task.type, L)}</span>
                <span class="due-cell" @click=${() => this._showTask(obj.entry_id, task.id)}>
                  <span class="due-text">${formatDueDays(task.days_until_due, L)}</span>
                  ${task.trigger_config
                    ? this._renderTriggerProgress(task)
                    : nothing}
                  ${this._renderMiniSparkline(task)}
                </span>
                <span class="row-actions">
                  <mwc-icon-button class="btn-complete" title="${t("complete", L)}" @click=${(e: Event) => { e.stopPropagation(); this._openCompleteDialog(obj.entry_id, task.id, task.name, this._features.checklists ? task.checklist : undefined, this._features.adaptive && !!task.adaptive_config?.enabled); }}>
                    <ha-icon icon="mdi:check"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button class="btn-skip" title="${t("skip", L)}" .disabled=${this._actionLoading} @click=${(e: Event) => { e.stopPropagation(); this._promptSkipTask(obj.entry_id, task.id); }}>
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
    const isOperator = this._isOperator;

    // Determine status chip — use the backend-computed status
    const statusClass = task.status === "due_soon" ? "warning" : (task.status || "ok");
    const statusText = t(task.status || "ok", L);

    return html`
      <div class="task-header">
        <div class="task-header-title">
          <span class="task-name-breadcrumb" @click=${() => this._view = "task"}>${task.name}</span>
          <span class="breadcrumb-separator">·</span>
          <span class="object-name-breadcrumb" @click=${() => this._showObject(this._selectedEntryId!)}>${objName}</span>
          <span class="status-chip ${statusClass}">${statusText}</span>
          ${this._renderUserBadge(task)}
          ${task.nfc_tag_id
            ? html`<span class="nfc-badge" title="${t("nfc_tag_id", L)}: ${task.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>`
            : !isOperator ? html`<span class="nfc-badge unlinked" title="${t("nfc_link_hint", L)}"
                @click=${() => { this.shadowRoot!.querySelector<MaintenanceTaskDialog>("maintenance-task-dialog")?.openEdit(this._selectedEntryId!, task); }}>
                <ha-icon icon="mdi:nfc-variant"></ha-icon>
              </span>` : nothing
          }
        </div>
        <div class="task-header-actions">
          <ha-button appearance="filled" @click=${() => this._openCompleteDialog(this._selectedEntryId!, this._selectedTaskId!, task.name, this._features.checklists ? task.checklist : undefined, this._features.adaptive && !!task.adaptive_config?.enabled)}>${t("complete", L)}</ha-button>
          <ha-button appearance="plain" .disabled=${this._actionLoading} @click=${() => this._promptSkipTask(this._selectedEntryId!, this._selectedTaskId!)}>${t("skip", L)}</ha-button>
          <ha-button appearance="plain" @click=${() => { const objData = this._getObject(this._selectedEntryId!)?.object; this._openQrForTask(this._selectedEntryId!, this._selectedTaskId!, objData?.name || "", task.name); }}><ha-icon icon="mdi:qrcode"></ha-icon> ${t("qr_code", L)}</ha-button>
          ${!isOperator ? html`
            <div class="more-menu-wrapper">
              <ha-icon-button .disabled=${this._actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${this._toggleMoreMenu}></ha-icon-button>
              ${this._moreMenuOpen ? html`
                <div class="popup-menu" @click=${(e: Event) => e.stopPropagation()}>
                  <div class="popup-menu-item" @click=${() => { this._closeMoreMenu(); this.shadowRoot!.querySelector<MaintenanceTaskDialog>("maintenance-task-dialog")?.openEdit(this._selectedEntryId!, task); }}>${t("edit", L)}</div>
                  <div class="popup-menu-item" @click=${() => { this._closeMoreMenu(); this._promptResetTask(this._selectedEntryId!, this._selectedTaskId!); }}>${t("reset", L)}</div>
                  <div class="popup-menu-divider"></div>
                  <div class="popup-menu-item danger" @click=${() => { this._closeMoreMenu(); this._deleteTask(this._selectedEntryId!, this._selectedTaskId!); }}>${t("delete", L)}</div>
                </div>
              ` : nothing}
            </div>
          ` : nothing}
        </div>
      </div>
    `;
  }

  private _toggleMoreMenu(): void {
    this._moreMenuOpen = !this._moreMenuOpen;
    if (this._moreMenuOpen) {
      // Close menu on next outside click
      const handler = () => { this._moreMenuOpen = false; document.removeEventListener("click", handler); };
      setTimeout(() => document.addEventListener("click", handler, { once: true }), 0);
    }
  }

  private _closeMoreMenu(): void {
    this._moreMenuOpen = false;
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
      case "history":
        return this._renderHistoryTab(task);
      default:
        return nothing;
    }
  }

  /**
   * Render Overview Tab content.
   */
  private get _sparklineCtx(): SparklineContext {
    return {
      lang: this._lang,
      detailStatsData: this._detailStatsData,
      hasStatsService: !!this._statsService,
      isCounterEntity: (tc) => this._isCounterEntity(tc),
      tooltip: this._sparklineTooltip,
      setTooltip: (t) => { this._sparklineTooltip = t; },
    };
  }

  private _renderOverviewTab(task: MaintenanceTask) {
    const L = this._lang;

    // Check if we have recommendation / seasonal content
    const hasRecommendation = this._features.adaptive && task.suggested_interval && task.suggested_interval !== task.interval_days;
    const hasSeasonal = this._features.seasonal && task.seasonal_factor && task.seasonal_factor !== 1.0;
    const hasLeftColumn = hasRecommendation || hasSeasonal;

    // Analysis content: Weibull/Seasonal expanded (only when data is available)
    const hasWeibullData = this._features.adaptive
      && task.interval_analysis?.weibull_beta != null
      && task.interval_analysis?.weibull_eta != null;
    const hasSeasonalData = this._features.seasonal
      && (task.seasonal_factors?.length === 12
        || task.interval_analysis?.seasonal_factors?.length === 12);

    return html`
      <div class="tab-content overview-tab">
        ${this._renderKPIBar(task)}
        ${this._renderTaskMeta(task)}
        ${this._renderDaysProgress(task)}
        ${renderTriggerSection(task, this._sparklineCtx)}
        ${renderPredictionSection(task, L, this._features)}
        <div class="two-column-layout ${hasLeftColumn ? '' : 'single-column'}">
          ${hasLeftColumn ? html`
            <div class="left-column">
              ${this._renderRecommendationCard(task)}
              ${renderSeasonalCardCompact(task, L, this._features)}
            </div>
          ` : nothing}
          <div class="right-column">
            ${renderCostDurationCard(task, L, this._costDurationToggle, (v) => { this._costDurationToggle = v; })}
          </div>
        </div>
        ${hasWeibullData ? renderWeibullSection(task, L) : nothing}
        ${hasSeasonalData ? html`
          ${renderSeasonalCardExpanded(task, L)}
          <div class="seasonal-actions">
            <ha-button appearance="plain" @click=${() => this._openSeasonalOverrides(task)}>
              ${t("edit_seasonal_overrides", L)}
            </ha-button>
          </div>
        ` : nothing}
        ${this._renderChecklistCard(task)}
        ${this._renderRecentActivities(task)}
      </div>
    `;
  }

  /**
   * Read-only preview of the configured checklist steps so users can see
   * the steps without having to open the Edit or Complete dialog. Only
   * rendered when the Checklists feature is enabled and steps are set.
   */
  private _renderChecklistCard(task: MaintenanceTask) {
    if (!this._features.checklists) return nothing;
    const items = task.checklist || [];
    if (items.length === 0) return nothing;
    const L = this._lang;
    return html`
      <div class="checklist-preview-card">
        <div class="checklist-preview-header">
          <ha-icon icon="mdi:format-list-checks"></ha-icon>
          <span>${t("checklist", L)} (${items.length})</span>
        </div>
        <ol class="checklist-preview-list">
          ${items.map((item) => html`<li>${item}</li>`)}
        </ol>
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
   * Render task notes and documentation URL if present.
   */
  private _renderTaskMeta(task: MaintenanceTask) {
    const safeUrl = task.documentation_url && /^https?:\/\//i.test(task.documentation_url)
      ? task.documentation_url : null;
    if (!task.notes && !safeUrl) return nothing;
    const L = this._lang;
    return html`
      <div class="task-meta-card">
        ${task.notes ? html`
          <div class="task-meta-row">
            <ha-icon icon="mdi:note-text-outline"></ha-icon>
            <span class="task-meta-notes">${task.notes}</span>
          </div>
        ` : nothing}
        ${safeUrl ? html`
          <div class="task-meta-row task-meta-link">
            <ha-icon icon="mdi:open-in-new"></ha-icon>
            <a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${t("documentation_label", L)}</a>
          </div>
        ` : nothing}
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
          ${this._features.schedule_time && task.schedule_time
            ? html`<div class="kpi-subtext">${t("at_time", L)} ${task.schedule_time}</div>`
            : nothing}
        </div>
        <div class="kpi-card ${daysClass}">
          <div class="kpi-label">${t("days_until_due", L)}</div>
          <div class="kpi-value-large">${task.days_until_due !== null && task.days_until_due !== undefined ? task.days_until_due : "—"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${t("interval", L)}</div>
          <div class="kpi-value">${task.interval_days != null ? `${task.interval_days} ${t("days", L)}` : "—"}</div>
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
          <div class="kpi-value">${avgCost.toFixed(0)} ${this._budget?.currency_symbol || "€"}</div>
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

    // Check if dismissed this session
    if (this._selectedEntryId && this._selectedTaskId &&
        this._dismissedSuggestions.has(`${this._selectedEntryId}_${this._selectedTaskId}`)) {
      return nothing;
    }

    const current = task.interval_days;
    const suggested = task.suggested_interval;
    const confidence = task.interval_confidence || "medium";
    const maxBar = Math.max(current || 1, suggested);

    return html`
      <div class="recommendation-card">
        <h4>${t("suggested_interval", L)}</h4>
        <div class="interval-comparison">
          <div class="interval-bar">
            <div class="interval-label">${t("current", L) || "Aktuell"}: ${current ?? "—"} ${current != null ? t("days", L) : ""}</div>
            <div class="interval-visual current" style="width: ${current != null ? Math.min((current / maxBar) * 100, 100) : 0}%"></div>
          </div>
          <div class="interval-bar">
            <div class="interval-label">${t("recommended", L)}: ${suggested} ${t("days", L)}
              <span class="confidence-badge ${confidence}">${t(`confidence_${confidence}`, L)}</span>
            </div>
            <div class="interval-visual suggested" style="width: ${Math.min((suggested / maxBar) * 100, 100)}%"></div>
          </div>
        </div>
        <div class="recommendation-actions">
          <ha-button appearance="filled" @click=${() => this._applySuggestion(this._selectedEntryId!, this._selectedTaskId!, suggested)}>
            ${t("apply_suggestion", L)}
          </ha-button>
          <ha-button appearance="plain" @click=${() => this._reanalyzeInterval(this._selectedEntryId!, this._selectedTaskId!)}>
            ${t("reanalyze", L)}
          </ha-button>
          <ha-button appearance="plain" @click=${() => this._dismissSuggestion(this._selectedEntryId!, this._selectedTaskId!)}>
            ${t("dismiss_suggestion", L)}
          </ha-button>
        </div>
      </div>
    `;
  }

  private _renderRecentActivities(task: MaintenanceTask) {
    const L = this._lang;
    const recent = task.history.slice(-3).reverse();

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
            ${entry.cost ? html`<span class="activity-badge">${entry.cost.toFixed(0)}${this._budget?.currency_symbol || "€"}</span>` : nothing}
            ${entry.duration ? html`<span class="activity-badge">${entry.duration}min</span>` : nothing}
          </div>
        `)}
        <div class="activity-show-all">
          <ha-button appearance="plain" @click=${() => this._activeTab = "history"}>${t("show_all", L)} →</ha-button>
        </div>
      </div>
    `;
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
            ${entry.cost != null ? html`<span>${t("cost", L)}: ${entry.cost.toFixed(2)} ${this._budget?.currency_symbol || "€"}</span>` : nothing}
            ${entry.duration != null ? html`<span>${t("duration", L)}: ${entry.duration} min</span>` : nothing}
            ${entry.trigger_value != null ? html`<span>${t("trigger_val", L)}: ${entry.trigger_value}</span>` : nothing}
          </div>
        </div>
      </div>
    `;
  }

  static styles = [sharedStyles, panelStyles];
}
