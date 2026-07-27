/** Maintenance Supporter Sidebar Panel. */

import { LitElement, html, nothing } from "lit";
import { isSafeHttpUrl } from "./helpers/url";
import { isStaleBundle } from "./helpers/bundle-version";
import { customElement, property, state } from "lit/decorators.js";
import { sharedStyles, STATUS_COLORS, STATUS_ICONS, DEFAULT_CURRENCY_SYMBOL, t, ensureLocale, isLocaleLoaded, formatDate, formatDueDays, formatInterval, formatRecurrence, setDateTimePrefs } from "./styles";
import { LS_KEYS } from "./helpers/storage-keys";
import { daysProgress } from "./helpers/interval";
import { buildObjectReportHtml, type ReportLabels } from "./helpers/report";
import { warrantyStatus } from "./helpers/warranty";
import { OBJECT_COLUMNS, DEFAULT_OBJECTS_TABLE_COLUMNS, sanitizeColumns } from "./helpers/object-columns";
import { downloadTextFile } from "./helpers/download";
import { buildTaskWorksheetHtml, type WorksheetExcerpt, type WorksheetLabels } from "./helpers/worksheet";
import { describeWsError } from "./ws-errors";
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
  SavedView,
  SavedViewFilters,
} from "./types";
import { StatisticsService } from "./statistics-service";
import { UserService } from "./user-service";
import "./components/object-dialog";
import type { MaintenanceObjectDialog } from "./components/object-dialog";
import "./components/documents-section";
import "./components/parts-section";
import "./components/task-documents";
import "./components/task-dialog";
import type { MaintenanceTaskDialog } from "./components/task-dialog";
import "./components/complete-dialog";
import type { MaintenanceCompleteDialog } from "./components/complete-dialog";
import "./components/qr-dialog";
import type { MaintenanceQrDialog } from "./components/qr-dialog";
import "./components/adopt-problem-sensors-dialog";
import type { MaintenanceAdoptProblemSensorsDialog } from "./components/adopt-problem-sensors-dialog";
import "./components/suggested-setups-dialog";
import "./components/battery-fleet-section";
import type { MaintenanceSuggestedSetupsDialog } from "./components/suggested-setups-dialog";
// v2.0.0: panel uses the extracted Calendar Card instead of its own
// _renderCalendar() method — single source of truth for the calendar view.
import "./maintenance-calendar-card";
// v2.2.0: in-place edit dialog for past history entries
import "./components/history-edit-dialog";
import type {
  MaintenanceHistoryEditDialog,
  HistoryEntryDraft,
} from "./components/history-edit-dialog";
import "./components/confirm-dialog";
import type { MaintenanceConfirmDialog } from "./components/confirm-dialog";
import "./components/settings-view";
import "./components/storage-section-card";
import "./components/seasonal-overrides-dialog";
import type { SeasonalOverridesDialog } from "./components/seasonal-overrides-dialog";
import "./components/group-dialog";
import type { MaintenanceGroupDialog } from "./components/group-dialog";
import "./components/saved-views-dialog";
import type { MaintenanceSavedViewsDialog } from "./components/saved-views-dialog";
import { type SparklineContext } from "./renderers/sparkline";
import { buildCalendarBuckets, isoDateLocal, type CalendarEvent } from "./helpers/calendar-bucket";
import { renderTriggerProgress, renderMiniSparkline } from "./renderers/progress";
import { type HistoryContext } from "./renderers/history";
import { renderUserBadge, type TaskDetailContext } from "./renderers/task-detail";
// The task-detail sub-view as a web component (light-DOM, panel styles apply).
// Side-effect import: type-only imports get tree-shaken and the element
// would never register.
import "./components/task-detail-view";
import { computeWindow, VIRTUAL_MIN_ROWS } from "./helpers/virtual-window";

type View = "overview" | "object" | "task" | "all_objects";
type SortMode = "due_date" | "object" | "type" | "task_name" | "area" | "assigned_user" | "group";
type ObjectSortMode = "alphabetical" | "due_soonest" | "task_count";
type GroupByMode = "none" | "area" | "group" | "user";

// Chart dimension constants for mini sparklines (overview)

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
  @state() private _filterLabel: string | null = null;
  // v2.24: shared saved filter views + the id of the one currently applied ("" =
  // none; cleared the moment the user hand-edits any filter control).
  @state() private _savedViews: SavedView[] = [];
  @state() private _activeViewId = "";
  @state() private _unsub: (() => void) | null = null;
  @state() private _chartRangeDays = (() => {
    try {
      const v = parseInt(localStorage.getItem(LS_KEYS.chartRange) || "", 10);
      return [7, 30, 90, 365].includes(v) ? v : 30;
    } catch {
      return 30;
    }
  })();
  @state() private _hideOutliers = (() => {
    try { return localStorage.getItem(LS_KEYS.chartHideOutliers) === "1"; } catch { return false; }
  })();
  @state() private _historyFilter: string | null = null;
  @state() private _budget: BudgetStatus | null = null;
  @state() private _groups: Record<string, MaintenanceGroup> = {};
  @state() private _detailStatsData: Map<string, StatisticsPoint[]> = new Map();
  @state() private _miniStatsData: Map<string, StatisticsPoint[]> = new Map();
  @state() private _features: AdvancedFeatures = { adaptive: false, predictions: false, seasonal: false, environmental: false, budget: false, groups: false, checklists: false, schedule_time: false, completion_actions: false };
  // HA user IDs (UUIDs) granted full panel access despite not being HA admins.
  @state() private _adminPanelUserIds: string[] = [];
  // v2.8.4: master switch — the allowlist only grants the full panel when this
  // is on (default off → every non-admin is read-only, admins unaffected).
  @state() private _operatorWriteEnabled = false;
  // Default warning_days from the global config entry — used as the initial
  // value in the task-create dialog so the Settings → General → "Default
  // warning days" choice actually flows through to new tasks.
  @state() private _defaultWarningDays = 7;
  @state() private _actionLoading = false;
  @state() private _moreMenuOpen = false;
  @state() private _objMenuOpen = false;
  @state() private _toastMessage = "";
  @state() private _toastUndo: (() => void) | null = null;
  @state() private _toastActionLabel = "";
  // Narrow-viewport disclosure (UX 2026-07): filters and create-actions are
  // occasional-use — collapsed behind two toggle buttons so the task list
  // starts above the fold on phones. Desktop renders them inline as before.
  @state() private _filtersOpen = false;
  @state() private _actionsMenuOpen = false;
  // Battery Fleet: offer one-click setup only when Battery Notes is present
  // and the fleet isn't set up yet.
  @state() private _batteryFleetSetupAvailable = false;
  @state() private _staleBundle = false;
  private _staleChecked = false;
  private _toastTimer: ReturnType<typeof setTimeout> | null = null;
  private _dismissedSuggestions = new Set<string>();

  // Dashboard redesign state
  @state() private _overviewTab: "today" | "dashboard" | "calendar" | "settings" = (() => {
    try {
      const v = localStorage.getItem(LS_KEYS.overviewTab);
      return v === "today" || v === "calendar" ? v : "dashboard";
    } catch { return "dashboard"; }
  })();
  @state() private _activeTab: "overview" | "history" = "overview";
  @state() private _costDurationToggle: "cost" | "duration" | "both" = "both";
  @state() private _historySearch = "";
  @state() private _sortMode: SortMode = "due_date";
  @state() private _objectSortMode: ObjectSortMode = "alphabetical";
  @state() private _groupByMode: GroupByMode = "none";
  // (#67): All-Objects view mode (cards|table) + the configurable table
  // columns sourced from the global setting (sanitised; defaults until loaded).
  @state() private _objectViewMode: "cards" | "table" = "cards";
  @state() private _objectsTableColumns: string[] = DEFAULT_OBJECTS_TABLE_COLUMNS;
  // v2.10.0: archived tasks/objects are hidden until this toggle is on.
  @state() private _showArchived = false;
  // v2.15.0: bulk selection on the dashboard task list (multi-select +
  // complete/archive). Keys are `${entry_id}:${task_id}`.
  @state() private _bulkMode = false;
  @state() private _bulkSelected = new Set<string>();
  // Virtualized dashboard task table (large installs): only rows in the
  // scroll window are in the DOM; spacers keep the scrollbar honest. The
  // window is recomputed from `.content` scroll/resize (rAF-throttled).
  @state() private _virtStart = 0;
  @state() private _virtEnd = 0; // 0 = uninitialized → initial slice
  private _virtRowHeight = 53;
  private _virtTotalRows = 0;
  private _virtScrollAttached = false;
  private _virtRaf = 0;
  // v2.15.0: collapsed analysis sections on the task-detail overview tab,
  // remembered per section across visits.
  @state() private _collapsedSections: Set<string> = (() => {
    try { return new Set(JSON.parse(localStorage.getItem(LS_KEYS.collapsedSections) || "[]")); }
    catch { return new Set(); }
  })();
  // v2.15.0: command palette ("/" since 2.18.1 — Ctrl+K clashed with HA's own
  // global search) — global fuzzy search over objects + tasks.
  @state() private _paletteOpen = false;
  @state() private _paletteQuery = "";
  @state() private _paletteActive = 0;
  // v2.15.0: template gallery (surfaces the config-flow object templates).
  @state() private _templateGalleryOpen = false;
  @state() private _templates: Array<{ id: string; name: string; category: string; tasks: unknown[]; disabled?: boolean }> = [];
  @state() private _templateCategories: Record<string, { icon?: string; [k: string]: unknown }> = {};
  @state() private _templateBusy = false;
  // v1.5.0: Calendar tab state
  // v2.0.0: window-days + user-filter state moved into the
  // <maintenance-supporter-calendar-card> custom element — the panel just
  // renders the card and intercepts its ll-custom open-task events.

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
   * Gating (full panel only when an exception applies):
   *   - admins (incl. the owner) always see the full panel
   *   - a non-admin sees the full panel only when operator-write delegation is
   *     enabled AND their ID is in the `admin_panel_user_ids` allowlist
   *   - everyone else sees operator mode (Complete / Skip only)
   *
   * Delegation defaults OFF, so out of the box every non-admin is read-only.
   * The switch + allowlist are managed by an admin under Settings → Panel
   * Access (either the panel's Settings tab or the HA config flow), and the
   * server mirrors this exact rule in helpers/permissions.user_may_write.
   */
  private get _isOperator(): boolean {
    const u = this.hass?.user;
    if (!u) return true; // pre-hass state: render safe default
    if (u.is_admin) return false;
    return !(this._operatorWriteEnabled && this._adminPanelUserIds.includes(u.id));
  }

  private _popstateHandler = (e: PopStateEvent) => this._onPopState(e);

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("popstate", this._popstateHandler);
    window.addEventListener("keydown", this._paletteKeydown);
    window.addEventListener("resize", this._onVirtualScroll, { passive: true });
    // localStorage.getItem can THROW (Safari private mode / locked-down policies
    // where storage access raises rather than returning null) — an unguarded
    // read here would abort connectedCallback and leave the panel blank. Every
    // other storage access in this file is wrapped; wrap these too.
    try {
      const saved = localStorage.getItem(LS_KEYS.taskSort);
      if (saved && ["due_date", "object", "type", "task_name", "area", "assigned_user", "group"].includes(saved)) {
        this._sortMode = saved as SortMode;
      }
      const savedObj = localStorage.getItem(LS_KEYS.objectSort);
      if (savedObj && ["alphabetical", "due_soonest", "task_count"].includes(savedObj)) {
        this._objectSortMode = savedObj as ObjectSortMode;
      }
      const savedGroup = localStorage.getItem(LS_KEYS.groupBy);
      if (savedGroup && ["none", "area", "group", "user"].includes(savedGroup)) {
        this._groupByMode = savedGroup as GroupByMode;
      }
      const savedView = localStorage.getItem(LS_KEYS.objectView);
      if (savedView === "cards" || savedView === "table") {
        this._objectViewMode = savedView;
      }
    } catch {
      // storage blocked — keep the defaults
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("popstate", this._popstateHandler);
    window.removeEventListener("keydown", this._paletteKeydown);
    window.removeEventListener("resize", this._onVirtualScroll);
    this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll", this._onVirtualScroll);
    this._virtScrollAttached = false;
    if (this._virtRaf) cancelAnimationFrame(this._virtRaf);
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
    // Dates/times follow the HA profile format, not just the language (#97).
    if (changedProps.has("hass")) setDateTimePrefs(this.hass?.locale);
    // Lazy-load the user's UI language (non-EN tables aren't bundled) and
    // re-render once it arrives. EN is bundled, so strings read in English
    // until then rather than as raw keys.
    const lang = this.hass?.language;
    if (lang && !isLocaleLoaded(lang)) {
      ensureLocale(lang).then(() => this.requestUpdate());
    }
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

    // Virtualized task table: attach the scroll listener once `.content`
    // exists (lit keeps the node stable across renders), then reconcile the
    // window with the just-rendered DOM (row-height probe + clamps). Only
    // sets state when the window actually moved, so this can't loop.
    const content = this.shadowRoot?.querySelector(".content");
    if (content && !this._virtScrollAttached) {
      content.addEventListener("scroll", this._onVirtualScroll, { passive: true });
      this._virtScrollAttached = true;
    }
    this._updateVirtualWindow();
  }

  /** rAF-throttled scroll/resize handler for the virtualized task table. */
  private _onVirtualScroll = (): void => {
    if (this._virtRaf) return;
    this._virtRaf = requestAnimationFrame(() => {
      this._virtRaf = 0;
      this._updateVirtualWindow();
    });
  };

  /** Recompute the rendered window of the virtualized task table from the
   *  live scroll position. No-op unless the virtual table is in the DOM. */
  private _updateVirtualWindow(): void {
    const content = this.shadowRoot?.querySelector<HTMLElement>(".content");
    const table = this.shadowRoot?.querySelector<HTMLElement>(".task-table.virtual");
    if (!content || !table) return;
    // Probe the real row height from a rendered row (uniform rows; the
    // hidden sizer row is height 0 and excluded).
    const probe = table.querySelector<HTMLElement>(".task-row:not(.virt-sizer)");
    if (probe && probe.offsetHeight > 20) this._virtRowHeight = probe.offsetHeight;
    const listTop =
      table.getBoundingClientRect().top - content.getBoundingClientRect().top + content.scrollTop;
    const w = computeWindow({
      scrollTop: content.scrollTop,
      viewportHeight: content.clientHeight,
      listTop,
      rowHeight: this._virtRowHeight,
      total: this._virtTotalRows,
    });
    if (w.start !== this._virtStart || w.end !== this._virtEnd) {
      this._virtStart = w.start;
      this._virtEnd = w.end;
    }
  }

  private async _loadData(): Promise<void> {
    const [objResult, statsResult, budgetResult, groupsResult, settingsResult, viewsResult] = await Promise.all([
      this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/objects" }).catch(() => null),
      this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/statistics" }).catch(() => null),
      this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/budget_status" }).catch(() => null),
      this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/groups" }).catch(() => null),
      this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/settings" }).catch(() => null),
      this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/views/list" }).catch(() => null),
    ]);
    if (viewsResult) this._savedViews = (viewsResult as { views: SavedView[] }).views || [];
    if (objResult) this._objects = (objResult as { objects: MaintenanceObjectResponse[] }).objects;
    // Battery Fleet availability (Battery Notes present + not yet set up).
    this.hass.connection
      .sendMessagePromise<{ available: boolean; configured: boolean }>({
        type: "maintenance_supporter/battery_fleet/overview",
      })
      .then((ov) => {
        this._batteryFleetSetupAvailable = !!ov.available && !ov.configured;
      })
      .catch(() => {
        this._batteryFleetSetupAvailable = false;
      });
    // Stale-bundle handshake (roadmap guard 2): compare the version esbuild
    // stamped into this bundle with the backend's — a mismatch means the
    // browser/service worker is still serving an OLD cached frontend, and no
    // amount of HA restarts fixes that. Checked once per panel lifetime.
    if (!this._staleChecked) {
      this._staleChecked = true;
      this.hass.connection
        .sendMessagePromise<{ version: string }>({ type: "maintenance_supporter/version" })
        .then((v) => {
          this._staleBundle = isStaleBundle(v?.version);
        })
        .catch(() => {
          /* backend too old to answer — no banner */
        });
    }
    if (statsResult) this._stats = statsResult as StatisticsResponse;
    if (budgetResult) this._budget = budgetResult as BudgetStatus;
    if (groupsResult) this._groups = (groupsResult as { groups: Record<string, MaintenanceGroup> }).groups || {};
    if (settingsResult) {
      const sr = settingsResult as {
        features: AdvancedFeatures;
        admin_panel_user_ids?: string[];
        operator_write_enabled?: boolean;
        general?: { default_warning_days?: number };
        objects_table_columns?: string[];
      };
      this._features = sr.features;
      this._adminPanelUserIds = sr.admin_panel_user_ids || [];
      this._operatorWriteEnabled = sr.operator_write_enabled ?? false;
      const dwd = sr.general?.default_warning_days;
      if (typeof dwd === "number" && dwd >= 0 && dwd <= 365) {
        this._defaultWarningDays = dwd;
      }
      this._objectsTableColumns = sanitizeColumns(sr.objects_table_columns);
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

    // v1.8.1: ms_action deep links from the dashboard strategy's fire-dom-event
    // Empty-state buttons. Cleared from the URL after one fire so refreshing
    // the page doesn't re-open it.
    //
    // v2.3.0 Phase 5/6: also handles open_vacation / open_budget / open_groups
    // / open_settings from the section strategies' status banners. Each
    // routes to the right tab + scroll target inside the Settings view.
    const msAction = params.get("ms_action");
    const cleanMsActionUrl = () => {
      const cleanUrl = window.location.pathname + window.location.hash;
      history.replaceState(history.state, "", cleanUrl);
    };
    if (msAction === "add_object") {
      this._deepLinkHandled = true;
      cleanMsActionUrl();
      requestAnimationFrame(() => {
        this.shadowRoot
          ?.querySelector<MaintenanceObjectDialog>("maintenance-object-dialog")
          ?.openCreate();
      });
      return;
    }
    if (msAction === "open_vacation"
        || msAction === "open_budget"
        || msAction === "open_groups"
        || msAction === "open_settings") {
      this._deepLinkHandled = true;
      cleanMsActionUrl();
      // Switch to the Settings tab — that's where Vacation/Budget/Groups live.
      this._overviewTab = "settings";
      // Hint the settings-view which sub-section to scroll to (its own
      // settings-view component reads this on attribute change).
      requestAnimationFrame(() => {
        const settingsView = this.shadowRoot?.querySelector(
          "maintenance-settings-view",
        ) as (HTMLElement & { scrollToSection?: (s: string) => void }) | null;
        const target = msAction.replace("open_", ""); // "vacation" / "budget" / "groups" / "settings"
        settingsView?.scrollToSection?.(target);
      });
      return;
    }

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
    const points = await this._statsService.getDetailStats(entityId, isCounter, this._chartRangeDays);
    const updated = new Map(this._detailStatsData);
    updated.set(entityId, points);
    this._detailStatsData = updated;
  }

  /** Chart range chips (7/30/90/365 d): persist the choice and refetch the
   *  open task's stats at the new window. */
  private _setChartRange(days: number): void {
    if (days === this._chartRangeDays) return;
    this._chartRangeDays = days;
    try { localStorage.setItem(LS_KEYS.chartRange, String(days)); } catch { /* private mode */ }
    const task = this._selectedEntryId && this._selectedTaskId
      ? this._getTask(this._selectedEntryId, this._selectedTaskId)
      : null;
    const entityId = task?.trigger_config?.entity_id;
    if (entityId) {
      // Drop the stale-range series so the chart shows its loading state.
      const updated = new Map(this._detailStatsData);
      updated.delete(entityId);
      this._detailStatsData = updated;
      void this._fetchDetailStats(entityId, this._isCounterEntity(task!.trigger_config));
    }
  }

  private _setHideOutliers(hide: boolean): void {
    if (hide === this._hideOutliers) return;
    // Outlier filtering is client-side on the already-fetched series, so just
    // flip the flag and let renderChart re-filter — no re-fetch needed.
    this._hideOutliers = hide;
    try { localStorage.setItem(LS_KEYS.chartHideOutliers, hide ? "1" : "0"); } catch { /* private mode */ }
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
      const unsub = await this.hass.connection.subscribeMessage(
        (msg: unknown) => {
          const data = msg as { objects: MaintenanceObjectResponse[] };
          this._objects = data.objects;
        },
        { type: "maintenance_supporter/subscribe" }
      );
      // If the element was detached while the subscribe was in flight, drop the
      // now-orphaned subscription instead of storing it on a dead component.
      if (!this.isConnected) {
        unsub();
        return;
      }
      this._unsub = unsub;
    } catch {
      // Subscription failed; fall back to polling
    }
  }

  // --- Data accessors ---

  private get _taskRows(): TaskRow[] {
    const rows: TaskRow[] = [];
    for (const obj of this._objects) {
      for (const task of obj.tasks) {
        // v2.10.0: archived tasks are hidden unless the toggle reveals them.
        if (!this._showArchived && task.archived) continue;
        if (this._filterStatus && task.status !== this._filterStatus) continue;

        // User filter
        if (this._filterUser) {
          const userId = this._filterUser === "current_user"
            ? this._userService?.getCurrentUserId()
            : this._filterUser;
          if (task.responsible_user_id !== userId) continue;
        }

        // Label filter (v2.26 — also captured by saved views)
        if (this._filterLabel && !(task.labels || []).includes(this._filterLabel)) continue;

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
          interval_unit: task.interval_unit ?? null,
          interval_anchor: task.interval_anchor ?? null,
          is_done: task.is_done ?? false,
          archived: task.archived ?? false,
          history: task.history || [],
          enabled: task.enabled,
          nfc_tag_id: task.nfc_tag_id ?? null,
          priority: task.priority ?? "normal",
          labels: task.labels ?? [],
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
    this._scrollContentToTop();
  }

  private _showAllObjects(): void {
    this._pushPanelState("all_objects");
    this._view = "all_objects";
    this._selectedEntryId = null;
    this._selectedTaskId = null;
    this._scrollContentToTop();
  }

  /** v2.1.0 (Discussion #49 — @byoung79): tap a KPI value to auto-filter
   *  the task list. Empty string clears the filter (used by "Tasks" KPI). */
  private _filterByStatus(status: string): void {
    this._filterStatus = status;
    this._activeViewId = "";
    // Make sure we're on the dashboard tab so the task list is actually
    // visible — pointless to filter on the calendar/settings tabs.
    if (this._overviewTab !== "dashboard") {
      this._overviewTab = "dashboard";
    }
    this._scrollContentToTop();
  }

  // ── v2.24: saved filter views ──────────────────────────────────────────────

  /** Distinct labels across all loaded tasks (for the label-filter dropdown). */
  private get _allLabels(): string[] {
    const seen = new Set<string>();
    for (const obj of this._objects) {
      for (const task of obj.tasks) {
        for (const lb of task.labels || []) seen.add(lb);
      }
    }
    return [...seen].sort((a, b) => a.localeCompare(b));
  }

  /** The panel's current task-list filter state, in the shape a view stores. */
  private get _currentFilters(): SavedViewFilters {
    return {
      status: this._filterStatus,
      user_id: this._filterUser,
      label: this._filterLabel,
      archived: this._showArchived,
      sort_mode: this._sortMode,
      group_by: this._groupByMode,
    };
  }

  /** Apply a saved view's filters to the live controls (or clear on ""). */
  private _applyView(viewId: string): void {
    this._activeViewId = viewId;
    if (!viewId) return;
    const view = this._savedViews.find((v) => v.id === viewId);
    if (!view) return;
    const f = view.filters;
    this._filterStatus = f.status || "";
    this._filterUser = f.user_id || null;
    this._filterLabel = f.label || null;
    this._showArchived = !!f.archived;
    // Validate against the current enums before assigning — a view saved by an
    // older/renamed build could carry a mode no longer valid, which would then
    // be persisted to localStorage and silently break sorting/grouping.
    if (["due_date", "object", "type", "task_name", "area", "assigned_user", "group"].includes(f.sort_mode)) {
      this._sortMode = f.sort_mode as SortMode;
    }
    if (["none", "area", "group", "user"].includes(f.group_by)) {
      this._groupByMode = f.group_by as GroupByMode;
    }
    // Persist sort/group like the manual controls do, so they stick after reload.
    try {
      localStorage.setItem(LS_KEYS.taskSort, this._sortMode);
      localStorage.setItem(LS_KEYS.groupBy, this._groupByMode);
    } catch {
      // ignore private-mode storage errors
    }
    if (this._overviewTab !== "dashboard") this._overviewTab = "dashboard";
  }

  private _openSavedViewsDialog(): void {
    this.shadowRoot!
      .querySelector<MaintenanceSavedViewsDialog>("maintenance-saved-views-dialog")
      ?.open(this._currentFilters, this._savedViews);
  }

  private _onSavedViewsChanged(e: CustomEvent<{ views: SavedView[] }>): void {
    this._savedViews = e.detail.views || [];
    // If the applied view was deleted, drop the stale selection.
    if (this._activeViewId && !this._savedViews.some((v) => v.id === this._activeViewId)) {
      this._activeViewId = "";
    }
  }

  /** Reset scroll on the panel's .content container. Used by every
   *  navigation action so the user always lands at the top of the new
   *  view, never at a stale scroll position from the previous view.
   *
   *  History: an earlier version targeted .tab-bar via scrollIntoView,
   *  which worked for the 4 filter KPIs (stay in overview, .tab-bar
   *  exists) but silently no-op'd for the Objects KPI (switches to the
   *  all_objects view where .tab-bar isn't rendered). Targeting .content
   *  directly works regardless of which view is now showing. Plus same
   *  helper is now called from every navigation entry-point so e.g.
   *  clicking on a deep object in a long list lands you at the top of
   *  the object-detail view, not partway through it. */
  private _scrollContentToTop(): void {
    requestAnimationFrame(() => {
      const content = this.shadowRoot?.querySelector(".content");
      if (content) content.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  private _showObject(entryId: string): void {
    this._pushPanelState("object", entryId);
    this._view = "object";
    this._selectedEntryId = entryId;
    this._selectedTaskId = null;
    this._scrollContentToTop();
  }

  private _showTask(entryId: string, taskId: string): void {
    this._pushPanelState("task", entryId, taskId);
    this._view = "task";
    this._selectedEntryId = entryId;
    this._selectedTaskId = taskId;
    this._activeTab = "overview";
    this._historyFilter = null;
    this._scrollContentToTop();

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
    this._toastUndo = null;
    this._toastActionLabel = "";
    this._toastMessage = msg;
    this._toastTimer = setTimeout(() => { this._toastMessage = ""; this._toastTimer = null; }, 4000);
  }

  /** A toast with an action button (label defaults to Undo). Used for
   *  reversible actions (archive) and follow-up shortcuts (configure the
   *  freshly adopted task). Longer-lived so the user has time to react; the
   *  callback dismisses it. */
  private _showActionToast(msg: string, label: string, action: () => void): void {
    this._showUndoToast(msg, action);
    this._toastActionLabel = label;
  }

  private _showUndoToast(msg: string, undo: () => void): void {
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastActionLabel = "";
    this._toastMessage = msg;
    this._toastUndo = undo;
    this._toastTimer = setTimeout(() => {
      this._toastMessage = ""; this._toastUndo = null; this._toastTimer = null;
    }, 7000);
  }

  private _runToastUndo(): void {
    const undo = this._toastUndo;
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastMessage = ""; this._toastUndo = null; this._toastTimer = null;
    undo?.();
  }

  // --- Command palette ("/") ---

  private _paletteKeydown = (e: KeyboardEvent): void => {
    // "/" opens the palette (GitHub/Discourse convention; Shift+7 on a German
    // layout still yields key === "/"). Deliberately NOT Ctrl/Cmd+K: that is
    // HA's own global-search hotkey, and this window-level preventDefault
    // would shadow it whenever the panel is open.
    if (
      e.key === "/"
      && !e.ctrlKey && !e.metaKey && !e.altKey
      && !this._paletteOpen
    ) {
      const target = e.composedPath()[0];
      const typing = target instanceof HTMLElement
        && (target.tagName === "INPUT" || target.tagName === "TEXTAREA"
          || target.tagName === "SELECT" || target.isContentEditable);
      if (typing) return;
      e.preventDefault();
      this._openPalette();
      return;
    }
    if (!this._paletteOpen) return;
    const results = this._paletteResults;
    if (e.key === "Escape") { e.preventDefault(); this._closePalette(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); this._paletteActive = Math.min(this._paletteActive + 1, results.length - 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); this._paletteActive = Math.max(this._paletteActive - 1, 0); }
    else if (e.key === "Enter") { e.preventDefault(); const r = results[this._paletteActive]; if (r) this._selectPaletteResult(r); }
  };

  private _openPalette(): void {
    this._paletteQuery = "";
    this._paletteActive = 0;
    this._paletteOpen = true;
    this.updateComplete.then(() => {
      this.shadowRoot?.querySelector<HTMLInputElement>(".palette-input")?.focus();
    });
  }

  private _closePalette(): void {
    this._paletteOpen = false;
    this._paletteQuery = "";
  }

  private get _paletteResults(): Array<{ kind: "object" | "task"; entryId: string; taskId?: string; label: string; sub: string }> {
    const q = this._paletteQuery.trim().toLowerCase();
    const out: Array<{ kind: "object" | "task"; entryId: string; taskId?: string; label: string; sub: string }> = [];
    for (const obj of this._objects) {
      const oname = obj.object.name || "";
      if (!q || oname.toLowerCase().includes(q)) {
        out.push({ kind: "object", entryId: obj.entry_id, label: oname, sub: t("object", this._lang) });
      }
      for (const task of obj.tasks) {
        if (task.archived) continue;
        const tname = task.name || "";
        const labelHit = (task.labels || []).some((lb) => lb.toLowerCase().includes(q));
        if (!q || tname.toLowerCase().includes(q) || oname.toLowerCase().includes(q) || labelHit) {
          const labelSub = (task.labels || []).length ? `  #${(task.labels || []).join(" #")}` : "";
          out.push({ kind: "task", entryId: obj.entry_id, taskId: task.id, label: tname, sub: oname + labelSub });
        }
      }
      if (out.length > 60) break; // cap the working set; sliced below
    }
    return out.slice(0, 40);
  }

  private _selectPaletteResult(r: { kind: "object" | "task"; entryId: string; taskId?: string }): void {
    this._closePalette();
    if (r.kind === "task" && r.taskId) this._showTask(r.entryId, r.taskId);
    else this._showObject(r.entryId);
  }

  private _renderPalette() {
    if (!this._paletteOpen) return nothing;
    const L = this._lang;
    const results = this._paletteResults;
    return html`
      <div class="palette-backdrop" @click=${() => this._closePalette()}>
        <div class="palette" @click=${(e: Event) => e.stopPropagation()}>
          <input
            class="palette-input"
            type="text"
            placeholder="${t("palette_placeholder", L)}"
            .value=${this._paletteQuery}
            @input=${(e: Event) => { this._paletteQuery = (e.target as HTMLInputElement).value; this._paletteActive = 0; }}
          />
          <div class="palette-results">
            ${results.length === 0
              ? html`<div class="palette-empty">${t("palette_no_results", L)}</div>`
              : results.map((r, i) => html`
                  <div class="palette-item ${i === this._paletteActive ? "active" : ""}"
                    @mouseenter=${() => { this._paletteActive = i; }}
                    @click=${() => this._selectPaletteResult(r)}>
                    <ha-icon icon="${r.kind === "task" ? "mdi:clipboard-check-outline" : "mdi:package-variant-closed"}"></ha-icon>
                    <span class="palette-label">${r.label}</span>
                    <span class="palette-sub">${r.sub}</span>
                  </div>
                `)}
          </div>
          <div class="palette-hint">${t("palette_hint", L)}</div>
        </div>
      </div>
    `;
  }

  // --- Adopt problem sensors ---

  private _openAdoptProblemSensors(): void {
    this.shadowRoot!
      .querySelector<MaintenanceAdoptProblemSensorsDialog>("maintenance-adopt-problem-sensors-dialog")
      ?.open();
  }

  private async _onProblemSensorsAdopted(e: CustomEvent): Promise<void> {
    const tasks = e.detail?.tasks_created ?? 0;
    const created = (e.detail?.created ?? []) as Array<{ entry_id: string; task_id: string; name: string }>;
    await this._loadData();
    const msg = t("adopt_problem_done", this._lang).replace("{tasks}", String(tasks));
    if (created.length > 0) {
      // Adopted tasks are fully configurable from day one (responsible user,
      // priority, documents) — surface that with a direct path to the first.
      this._showActionToast(msg, t("adopt_problem_configure", this._lang), () => {
        const ref = created[0];
        const obj = this._objects.find((o) => o.entry_id === ref.entry_id);
        const tk = obj?.tasks.find((task) => task.id === ref.task_id);
        if (obj && tk) {
          this.shadowRoot!.querySelector<MaintenanceTaskDialog>("maintenance-task-dialog")?.openEdit(ref.entry_id, tk);
        }
      });
    } else {
      this._showToast(msg);
    }
  }

  // --- Suggested setups (integration signatures, v2.28) ---

  private async _setupBatteryFleet(): Promise<void> {
    try {
      const res = await this.hass.connection.sendMessagePromise<{ entry_id: string; task_id?: string }>({
        type: "maintenance_supporter/battery_fleet/setup",
        language: this.hass.language || "en",
      });
      this._batteryFleetSetupAvailable = false;
      await this._loadData();
      // Jump to the fleet task so the user lands on its battery detail section.
      const obj = this._objects.find((o) => o.entry_id === res.entry_id);
      const tk = obj?.tasks.find((t2) => t2.id === res.task_id) || obj?.tasks[0];
      if (obj && tk) {
        this._showTask(obj.entry_id, tk.id);
      }
      this._showToast(t("battery_fleet_setup_done", this._lang));
    } catch (e) {
      this._showToast(describeWsError(e, this._lang));
    }
  }

  private _openSuggestedSetups(): void {
    this.shadowRoot!
      .querySelector<MaintenanceSuggestedSetupsDialog>("maintenance-suggested-setups-dialog")
      ?.open();
  }

  private _onSetupsAdopted(e: CustomEvent): void {
    const tasks = e.detail?.tasks_created ?? 0;
    this._showToast(t("setups_done", this._lang).replace("{tasks}", String(tasks)));
    this._loadData();
  }

  // --- Template gallery ---

  private async _openTemplateGallery(): Promise<void> {
    this._templateGalleryOpen = true;
    if (this._templates.length > 0) return;
    try {
      const res = await this.hass.connection.sendMessagePromise<{
        categories: Record<string, { icon?: string }>;
        templates: Array<{ id: string; name: string; category: string; tasks: unknown[]; disabled?: boolean }>;
      }>({ type: "maintenance_supporter/templates", language: this._lang });
      this._templateCategories = res.categories || {};
      // v2.21: admin-hidden templates stay out of the gallery.
      this._templates = (res.templates || []).filter((tpl) => !tpl.disabled);
    } catch {
      this._showToast(t("action_error", this._lang));
    }
  }

  private async _createFromTemplate(templateId: string): Promise<void> {
    this._templateBusy = true;
    try {
      const res = await this.hass.connection.sendMessagePromise<{ entry_id?: string }>({
        type: "maintenance_supporter/object/from_template",
        language: this._lang,
        template_id: templateId,
      });
      this._templateGalleryOpen = false;
      await this._loadData();
      this._showToast(t("template_created", this._lang));
      if (res?.entry_id) this._showObject(res.entry_id);
    } catch {
      this._showToast(t("action_error", this._lang));
    } finally {
      this._templateBusy = false;
    }
  }

  private _categoryName(catId: string): string {
    const cat = this._templateCategories[catId] as Record<string, string> | undefined;
    if (!cat) return catId;
    return cat[`name_${this._lang}`] || cat["name_en"] || catId;
  }

  private _renderTemplateGallery() {
    if (!this._templateGalleryOpen) return nothing;
    const L = this._lang;
    // Group templates by category, preserving category declaration order.
    const byCat = new Map<string, typeof this._templates>();
    for (const tpl of this._templates) {
      if (!byCat.has(tpl.category)) byCat.set(tpl.category, []);
      byCat.get(tpl.category)!.push(tpl);
    }
    return html`
      <div class="palette-backdrop" @click=${() => { this._templateGalleryOpen = false; }}>
        <div class="template-gallery" @click=${(e: Event) => e.stopPropagation()}>
          <div class="template-gallery-head">
            <span>${t("templates_title", L)}</span>
            <ha-icon-button .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
              @click=${() => { this._templateGalleryOpen = false; }}></ha-icon-button>
          </div>
          <div class="template-gallery-body">
            ${this._templates.length === 0
              ? html`<div class="palette-empty">${t("loading", L)}…</div>`
              : [...byCat.entries()].map(([catId, tpls]) => html`
                  <div class="template-cat">
                    <div class="template-cat-head">
                      <ha-icon icon="${(this._templateCategories[catId]?.icon as string) || "mdi:folder-outline"}"></ha-icon>
                      ${this._categoryName(catId)}
                    </div>
                    <div class="template-grid">
                      ${tpls.map((tpl) => html`
                        <button class="template-card" .disabled=${this._templateBusy}
                          @click=${() => this._createFromTemplate(tpl.id)}>
                          <span class="template-card-name">${tpl.name}</span>
                          <span class="template-card-count">${t("templates_task_count", L).replace("{n}", String(tpl.tasks.length))}</span>
                        </button>
                      `)}
                    </div>
                  </div>
                `)}
          </div>
        </div>
      </div>
    `;
  }

  // --- Bulk selection (dashboard task list) ---

  private _bulkKey(row: TaskRow): string {
    return `${row.entry_id}:${row.task_id}`;
  }

  private _toggleBulkMode(): void {
    this._bulkMode = !this._bulkMode;
    if (!this._bulkMode) this._bulkSelected = new Set();
  }

  private _toggleBulkRow(row: TaskRow): void {
    const key = this._bulkKey(row);
    const next = new Set(this._bulkSelected);
    if (next.has(key)) next.delete(key); else next.add(key);
    this._bulkSelected = next;
  }

  private _bulkSelectAll(rows: TaskRow[]): void {
    const keys = rows.map((r) => this._bulkKey(r));
    const allSelected = keys.every((k) => this._bulkSelected.has(k));
    this._bulkSelected = allSelected ? new Set() : new Set(keys);
  }

  /** Run one WS message per selected row (the endpoints are per-task); reports
   *  how many succeeded and refreshes once at the end. */
  private async _runBulk(
    rows: TaskRow[],
    build: (row: TaskRow) => Record<string, unknown>,
    doneMsg: (n: number) => string,
    undo?: () => void,
  ): Promise<void> {
    const selected = rows.filter((r) => this._bulkSelected.has(this._bulkKey(r)));
    if (selected.length === 0) return;
    this._actionLoading = true;
    let ok = 0;
    for (const row of selected) {
      try {
        await this.hass.connection.sendMessagePromise(build(row));
        ok++;
      } catch { /* keep going; report the successful count */ }
    }
    this._actionLoading = false;
    this._bulkSelected = new Set();
    this._bulkMode = false;
    await this._loadData();
    if (undo && ok > 0) this._showUndoToast(doneMsg(ok), undo);
    else this._showToast(doneMsg(ok));
  }

  private _bulkComplete(rows: TaskRow[]): void {
    void this._runBulk(
      rows,
      (row) => ({ type: "maintenance_supporter/task/complete", entry_id: row.entry_id, task_id: row.task_id }),
      (n) => t("bulk_completed", this._lang).replace("{n}", String(n)),
    );
  }

  private _bulkArchive(rows: TaskRow[]): void {
    // Capture the selection so the undo can unarchive exactly those.
    const keys = rows.filter((r) => this._bulkSelected.has(this._bulkKey(r)))
      .map((r) => ({ entry_id: r.entry_id, task_id: r.task_id }));
    void this._runBulk(
      rows,
      (row) => ({ type: "maintenance_supporter/task/archive", entry_id: row.entry_id, task_id: row.task_id }),
      (n) => t("bulk_archived", this._lang).replace("{n}", String(n)),
      async () => {
        for (const k of keys) {
          try {
            await this.hass.connection.sendMessagePromise({
              type: "maintenance_supporter/task/unarchive", entry_id: k.entry_id, task_id: k.task_id,
            });
          } catch { /* best effort */ }
        }
        await this._loadData();
      },
    );
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

  /** Open a printable maintenance report for the object in a new tab (the user
   *  prints / saves as PDF from there). Self-contained HTML, no dependency. */
  private _printObjectReport(entryId: string): void {
    const resp = this._getObject(entryId);
    if (!resp) return;
    const L = this._lang;
    const labels: ReportLabels = {
      title: t("report_title", L),
      generated: t("report_generated", L),
      manufacturer: t("manufacturer", L),
      model: t("model", L),
      serial: t("serial_number_label", L),
      installed: t("installed", L),
      warranty: t("warranty", L),
      area: t("area", L),
      notes: t("report_notes", L),
      tasksHeading: t("tasks", L),
      colTask: t("task_name", L),
      colType: t("report_col_type", L),
      colStatus: t("report_col_status", L),
      colSchedule: t("report_col_schedule", L),
      colLastDone: t("last_performed", L),
      colNextDue: t("next_due", L),
      colCost: t("cost", L),
      colTimes: t("report_times_done", L),
      totalCost: t("report_total_cost", L),
      scheduleLabel: (task) => formatRecurrence(task, L),
      none: "—",
      statusLabel: (s: string) => t(s, L),
      typeLabel: (ty: string) => t(ty, L),
    };
    const html = buildObjectReportHtml(
      resp.object, resp.tasks, labels,
      (iso) => (iso ? formatDate(iso, L) : ""),
      this._budget?.currency_symbol || DEFAULT_CURRENCY_SYMBOL,
      new Date().toISOString(),
    );
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  private async _duplicateObject(entryId: string): Promise<void> {
    this._actionLoading = true;
    try {
      const res = await this.hass.connection.sendMessagePromise<{ entry_id?: string }>({
        type: "maintenance_supporter/object/duplicate",
        entry_id: entryId,
      });
      await this._loadData();
      this._showToast(t("object_duplicated", this._lang));
      if (res?.entry_id) this._showObject(res.entry_id);
    } catch {
      this._showToast(t("action_error", this._lang));
    } finally {
      this._actionLoading = false;
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

  // v2.10.0: archive / unarchive a single task (reversible — no confirm).
  private async _duplicateTask(entryId: string, taskId: string): Promise<void> {
    this._moreMenuOpen = false;
    this._actionLoading = true;
    try {
      const res = await this.hass.connection.sendMessagePromise<{ task_id?: string }>({
        type: "maintenance_supporter/task/duplicate",
        entry_id: entryId,
        task_id: taskId,
      });
      await this._loadData();
      this._showToast(t("task_duplicated", this._lang));
      // Jump straight to the copy so the user can rename/adjust it.
      if (res?.task_id) this._showTask(entryId, res.task_id);
    } catch {
      this._showToast(t("action_error", this._lang));
    } finally {
      this._actionLoading = false;
    }
  }

  private async _toggleArchiveTask(entryId: string, taskId: string, archived: boolean): Promise<void> {
    this._actionLoading = true;
    try {
      await this.hass.connection.sendMessagePromise({
        type: archived
          ? "maintenance_supporter/task/unarchive"
          : "maintenance_supporter/task/archive",
        entry_id: entryId,
        task_id: taskId,
      });
      await this._loadData();
      // Just archived → offer a one-tap undo (unarchive) instead of a confirm.
      if (!archived) {
        this._showUndoToast(t("task_archived", this._lang),
          () => this._toggleArchiveTask(entryId, taskId, true));
      }
    } catch {
      this._showToast(t("action_error", this._lang));
    } finally {
      this._actionLoading = false;
    }
  }

  // v2.10.0: archive / unarchive an object. Archiving cascades to its tasks but
  // is fully reversible, so instead of a blocking confirm we run it immediately
  // and offer an Undo toast (v2.14.0).
  private async _toggleArchiveObject(entryId: string, archived: boolean): Promise<void> {
    try {
      await this.hass.connection.sendMessagePromise({
        type: archived
          ? "maintenance_supporter/object/unarchive"
          : "maintenance_supporter/object/archive",
        entry_id: entryId,
      });
      await this._loadData();
      if (!archived) {
        this._showUndoToast(t("object_archived", this._lang),
          () => this._toggleArchiveObject(entryId, true));
      }
    } catch {
      this._showToast(t("action_error", this._lang));
    }
  }

  // v2.20 (N3): seasonal pause / resume. Pausing asks for an optional
  // auto-resume date; resuming re-anchors recurring tasks to a fresh cycle.
  private async _togglePauseObject(entryId: string, paused: boolean): Promise<void> {
    if (!paused) {
      const dlg = this.shadowRoot!.querySelector<MaintenanceConfirmDialog>("maintenance-confirm-dialog");
      const result = await dlg?.prompt({
        title: t("pause_object", this._lang),
        message: t("pause_until_prompt", this._lang),
        confirmText: t("pause_object", this._lang),
        inputLabel: t("pause_until_label", this._lang),
        inputType: "date",
      });
      if (!result?.confirmed) return;
      try {
        const msg: Record<string, unknown> = {
          type: "maintenance_supporter/object/pause",
          entry_id: entryId,
        };
        if (result.value) msg.until = result.value;
        await this.hass.connection.sendMessagePromise(msg);
        await this._loadData();
        this._showUndoToast(t("object_paused", this._lang),
          () => this._togglePauseObject(entryId, true));
      } catch (e) {
        this._showToast(describeWsError(e, this._lang));
      }
      return;
    }
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/object/resume",
        entry_id: entryId,
      });
      await this._loadData();
      this._showToast(t("object_resumed", this._lang));
    } catch (e) {
      this._showToast(describeWsError(e, this._lang));
    }
  }

  // v2.20 (N1): replace a worn-out object with a successor — the old one is
  // archived in place (history/costs stay browsable), the new one starts as a
  // pre-filled fresh unit with tasks and documents carried over.
  private async _replaceObject(entryId: string, currentName: string): Promise<void> {
    const dlg = this.shadowRoot!.querySelector<MaintenanceConfirmDialog>("maintenance-confirm-dialog");
    const result = await dlg?.prompt({
      title: t("replace_object", this._lang),
      message: t("replace_object_prompt", this._lang),
      confirmText: t("replace_object", this._lang),
      inputLabel: t("replace_name_label", this._lang),
      inputType: "text",
      inputValue: currentName,
    });
    if (!result?.confirmed) return;
    this._actionLoading = true;
    try {
      const res = await this.hass.connection.sendMessagePromise<{ entry_id?: string }>({
        type: "maintenance_supporter/object/replace",
        entry_id: entryId,
        name: result.value || currentName,
      });
      await this._loadData();
      this._showToast(t("object_replaced", this._lang));
      if (res?.entry_id) this._showObject(res.entry_id);
    } catch (e) {
      this._showToast(describeWsError(e, this._lang));
    } finally {
      this._actionLoading = false;
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

  private async _postponeTask(entryId: string, taskId: string, until: string): Promise<void> {
    this._actionLoading = true;
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/task/postpone",
        entry_id: entryId,
        task_id: taskId,
        until,
      });
      this._showToast(t("postponed", this._lang));
      await this._loadData();
    } catch {
      this._showToast(t("action_error", this._lang));
    } finally {
      this._actionLoading = false;
    }
  }

  private async _promptPostponeTask(entryId: string, taskId: string): Promise<void> {
    const dlg = this.shadowRoot!.querySelector<MaintenanceConfirmDialog>("maintenance-confirm-dialog");
    if (!dlg) return;
    const result = await dlg.prompt({
      title: t("postpone", this._lang),
      message: t("postpone_date_prompt", this._lang),
      confirmText: t("postpone", this._lang),
      inputLabel: t("postpone_date_label", this._lang),
      inputType: "date",
    });
    if (!result.confirmed || !result.value) return;
    this._postponeTask(entryId, taskId, result.value);
  }

  private async _snoozeTask(entryId: string, taskId: string): Promise<void> {
    this._actionLoading = true;
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/task/snooze",
        entry_id: entryId,
        task_id: taskId,
      });
      this._showToast(t("snoozed", this._lang));
    } catch {
      this._showToast(t("action_error", this._lang));
    } finally {
      this._actionLoading = false;
    }
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

  // v2.21: printable one-pager for a task — details, checklist tick boxes,
  // QR pair, and (when a linked PDF manual has a page hint for this task) a
  // link to the server-cut manual excerpt. Opens in a new tab for printing.
  private async _printTaskWorksheet(entryId: string, taskId: string): Promise<void> {
    const obj = this._getObject(entryId);
    const task = obj?.tasks.find((tk) => tk.id === taskId);
    if (!obj || !task) return;
    this._actionLoading = true;
    try {
      const qrBase: Record<string, unknown> = {
        type: "maintenance_supporter/qr/generate",
        entry_id: entryId, task_id: taskId, url_mode: "server",
      };
      const [qrView, qrComplete] = await Promise.all([
        this.hass.connection.sendMessagePromise<{ svg_data_uri?: string }>({ ...qrBase, action: "view" }).catch(() => null),
        this.hass.connection.sendMessagePromise<{ svg_data_uri?: string }>({ ...qrBase, action: "complete" }).catch(() => null),
      ]);

      // Manual excerpt: first linked PDF with a page hint for this task.
      let excerpt: WorksheetExcerpt | null = null;
      try {
        const docs = await this.hass.connection.sendMessagePromise<{
          documents: Array<{ id: string; kind: string; mime?: string; title?: string;
            filename?: string; task_ids?: string[]; task_pages?: Record<string, number> }>;
        }>({ type: "maintenance_supporter/documents/list", entry_id: entryId });
        const manual = (docs.documents || []).find(
          (d) => d.kind === "file" && d.mime === "application/pdf"
            && (d.task_ids || []).includes(taskId) && d.task_pages?.[taskId],
        );
        if (manual) {
          const start = manual.task_pages![taskId];
          const count = 4;
          const signed = await this.hass.connection.sendMessagePromise<{ path: string }>({
            type: "auth/sign_path",
            path: `/api/maintenance_supporter/document/${manual.id}/excerpt?start=${start}&count=${count}`,
            expires: 3600,
          });
          excerpt = {
            title: manual.title || manual.filename || "Manual",
            startPage: start, endPage: start + count - 1,
            // Absolute URL: the sheet lives on a blob: page, where a
            // relative /api/... href cannot resolve (caught live).
            url: new URL(signed.path, window.location.origin).toString(),
            vendorBase: new URL("/maintenance_supporter_vendor", window.location.origin).toString(),
          };
        }
      } catch { /* worksheet works without the excerpt */ }

      const L = this._lang;
      const labels: WorksheetLabels = {
        title: t("worksheet", L),
        object: t("object", L),
        type: t("maintenance_type", L),
        interval: t("interval", L),
        nextDue: t("next_due", L),
        lastDone: t("last_performed", L),
        priority: t("priority", L),
        checklist: t("checklist", L),
        notes: t("notes_label", L),
        scanView: t("worksheet_scan_view", L),
        scanComplete: t("worksheet_scan_complete", L),
        manualExcerpt: t("worksheet_manual_excerpt", L),
        pages: t("worksheet_pages", L),
        printedOn: t("worksheet_printed", L),
        never: t("worksheet_never", L),
        typeLabel: (ty: string) => t(ty, L),
        statusLabel: (st: string) => t(st, L),
        parts: t("consumes_parts_label", L),
      };
      // Required parts as checkable lines: qty × name (stock unit) — location.
      const wsParts = obj.parts || [];
      const partsLines = (task.consumes_parts || [])
        .map((link) => {
          const pt = wsParts.find((x) => x.id === link.part_id);
          if (!pt) return "";
          const stock = pt.stock !== null && pt.stock !== undefined ? ` (${pt.stock}${pt.unit ? " " + pt.unit : ""})` : "";
          const loc = pt.storage_location ? ` — ${pt.storage_location}` : "";
          return `${link.quantity}× ${pt.name}${stock}${loc}`;
        })
        .filter(Boolean);
      const html = buildTaskWorksheetHtml(
        task, obj.object.name, labels,
        (iso) => formatDate(iso, L),
        (tk) => formatRecurrence(tk, L),
        qrView?.svg_data_uri || null,
        qrComplete?.svg_data_uri || null,
        excerpt,
        new Date().toISOString(),
        partsLines,
      );
      const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } finally {
      this._actionLoading = false;
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
    // v2.20 (#83): reading tasks get a value field — resolve type + unit here
    // so none of the many call sites need to thread them through.
    const tk = this._objects
      .find((o) => o.entry_id === entryId)
      ?.tasks.find((tsk) => tsk.id === taskId);
    dlg.taskType = tk?.type || "";
    dlg.readingUnit = tk?.reading_unit || "";
    dlg.requiredFields = tk?.required_completion_fields || [];
    // Spare parts: a buy task gets an editable restock-qty field; a consuming
    // task shows what it will decrement (incl. the storage location).
    const objParts = this._objects.find((o) => o.entry_id === entryId)?.parts || [];
    const partById = new Map(objParts.map((pt) => [pt.id, pt]));
    const refPart = tk?.part_ref ? partById.get(tk.part_ref.part_id) : undefined;
    dlg.restockDefault = tk?.part_ref ? (refPart?.restock_quantity ?? 1) : null;
    dlg.consumesInfo = (tk?.consumes_parts || [])
      .map((link) => {
        const pt = partById.get(link.part_id);
        if (!pt) return "";
        const loc = pt.storage_location ? ` — ${pt.storage_location}` : "";
        const stock = pt.stock !== null && pt.stock !== undefined ? ` (${pt.stock}${pt.unit ? " " + pt.unit : ""})` : "";
        return `${link.quantity}× ${pt.name}${stock}${loc}`;
      })
      .filter(Boolean);
    // #99: editable per-completion parts selection (not on buy tasks — those
    // RESTOCK via the qty field instead of consuming).
    dlg.parts = tk?.part_ref ? [] : objParts;
    dlg.consumesParts = tk?.part_ref ? [] : (tk?.consumes_parts || []);
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
        ${this._staleBundle
          ? html`
              <div class="update-banner" role="status">
                <ha-icon icon="mdi:update"></ha-icon>
                <span>${t("update_banner", this._lang)}</span>
                <ha-button appearance="plain" @click=${() => location.reload()}>
                  ${t("update_reload", this._lang)}
                </ha-button>
              </div>
            `
          : nothing}
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
        .objects=${this._objects}
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
      <maintenance-history-edit-dialog
        .hass=${this.hass}
        @history-entry-saved=${this._onHistoryEntrySaved}
      ></maintenance-history-edit-dialog>
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
      <maintenance-adopt-problem-sensors-dialog
        .hass=${this.hass}
        @problem-sensors-adopted=${(e: CustomEvent) => this._onProblemSensorsAdopted(e)}
      ></maintenance-adopt-problem-sensors-dialog>
      <maintenance-suggested-setups-dialog
        .hass=${this.hass}
        @integration-setups-adopted=${(e: CustomEvent) => this._onSetupsAdopted(e)}
      ></maintenance-suggested-setups-dialog>
      <maintenance-saved-views-dialog
        .hass=${this.hass}
        @saved-views-changed=${(e: CustomEvent<{ views: SavedView[] }>) => this._onSavedViewsChanged(e)}
      ></maintenance-saved-views-dialog>
      ${this._toastMessage ? html`<div class="toast">
        <span>${this._toastMessage}</span>
        ${this._toastUndo ? html`<button class="toast-undo" @click=${() => this._runToastUndo()}>${this._toastActionLabel || t("undo", this._lang)}</button>` : nothing}
      </div>` : nothing}
      ${this._renderPalette()}
      ${this._renderTemplateGallery()}
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
    const isAdmin = !!this.hass?.user?.is_admin;
    const s = this._stats;
    // Only true HA admins get the Settings tab: global config, feature toggles,
    // vacation and import live there and stay admin-only server-side. Operators
    // (incl. allowlisted ones with full content CRUD) and plain users can't open
    // it. The Calendar tab IS visible to everyone (read-only view).
    if (!isAdmin && this._overviewTab === "settings") {
      this._overviewTab = "dashboard";
    }
    return html`
      ${s
        ? html`
            <div class="stats-bar">
              <div class="stat-item clickable"
                   @click=${() => this._showAllObjects()}
                   title=${t("show_all_objects", L)}>
                <span class="stat-value">${s.total_objects}</span>
                <span class="stat-label">${t("objects", L)}</span>
              </div>
              <div class="stat-item clickable"
                   @click=${() => this._filterByStatus("")}
                   title=${t("show_all_tasks", L)}>
                <span class="stat-value">${s.total_tasks}</span>
                <span class="stat-label">${t("tasks", L)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus === "overdue" && this._overviewTab === "dashboard" ? "active" : ""}"
                   @click=${() => this._filterByStatus("overdue")}
                   title=${t("filter_to_overdue", L)}>
                <span class="stat-value" style="color: var(--error-color)">${s.overdue}</span>
                <span class="stat-label">${t("overdue", L)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus === "due_soon" && this._overviewTab === "dashboard" ? "active" : ""}"
                   @click=${() => this._filterByStatus("due_soon")}
                   title=${t("filter_to_due_soon", L)}>
                <span class="stat-value" style="color: var(--warning-color)">${s.due_soon}</span>
                <span class="stat-label">${t("due_soon", L)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus === "triggered" && this._overviewTab === "dashboard" ? "active" : ""}"
                   @click=${() => this._filterByStatus("triggered")}
                   title=${t("filter_to_triggered", L)}>
                <span class="stat-value" style="color: #ff5722">${s.triggered}</span>
                <span class="stat-label">${t("triggered", L)}</span>
              </div>
            </div>
          `
        : nothing}
      <div class="tab-bar">
        <div class="tab ${this._overviewTab === "today" ? "active" : ""}"
          @click=${() => this._setOverviewTab("today")}>
          ${t("tab_today", L)}
        </div>
        <div class="tab ${this._overviewTab === "dashboard" ? "active" : ""}"
          @click=${() => this._setOverviewTab("dashboard")}>
          ${t("dashboard", L)}
        </div>
        <div class="tab ${this._overviewTab === "calendar" ? "active" : ""}"
          @click=${() => this._setOverviewTab("calendar")}>
          ${t("tab_calendar", L)}
        </div>
        ${isAdmin ? html`
          <div class="tab ${this._overviewTab === "settings" ? "active" : ""}"
            @click=${() => this._setOverviewTab("settings")}>
            ${t("settings", L)}
          </div>
        ` : nothing}
      </div>
      ${this._overviewTab === "today"
        ? this._renderToday()
        : this._overviewTab === "dashboard"
        ? this._renderDashboard()
        : this._overviewTab === "calendar"
        ? html`
            <div @ll-custom=${this._onCalendarLlCustom}>
              <maintenance-supporter-calendar-card
                .hass=${this.hass}
              ></maintenance-supporter-calendar-card>
            </div>
          `
        : html`<maintenance-settings-view
            .hass=${this.hass}
            .features=${this._features}
            .budget=${this._budget}
            @settings-changed=${this._onSettingsChanged}
          ></maintenance-settings-view>`}
    `;
  }

  /** v2.0.0: intercept ll-custom open-task events from the embedded calendar
   *  card so we navigate within the panel (using _showTask) instead of
   *  letting the document-level dialog-mount handler open a duplicate
   *  dialog on top. The handler stops propagation so the document listener
   *  (registered by the dashboard-strategy bundle) doesn't also fire. */
  private _onCalendarLlCustom = (e: Event): void => {
    const detail = (e as CustomEvent<{ type?: string; entry_id?: string; task_id?: string }>).detail;
    if (
      detail?.type === "maintenance-supporter:open-task" &&
      detail.entry_id &&
      detail.task_id
    ) {
      e.stopPropagation();
      this._showTask(detail.entry_id, detail.task_id);
    }
  };

  // v2.0.0: _renderCalendar() removed — replaced by an embedded
  // <maintenance-supporter-calendar-card>. The card holds all the same
  // logic (window chips, source icons, prediction pills, projected events)
  // and is the single source of truth for calendar rendering across the
  // panel and stand-alone Lovelace use. Kept for reference: the old
  // implementation rendered ~120 lines of Lit template literals here,
  // duplicating what the card now does.

  /** Status badge with a shape icon so status isn't conveyed by colour alone
   *  (colour-blind accessibility) — icon + text + colour together. */
  private _statusBadge(archived: boolean, isDone: boolean, status: string) {
    const L = this._lang;
    const cls = archived ? "archived" : (isDone ? "done" : status);
    const iconKey = archived ? "archived" : (isDone ? "completed" : status);
    const label = archived ? t("archived", L) : (isDone ? t("completed", L) : t(status, L));
    return html`<span class="status-badge ${cls}"><ha-icon icon="${STATUS_ICONS[iconKey] || "mdi:circle-medium"}"></ha-icon>${label}</span>`;
  }

  private _setOverviewTab(tab: "today" | "dashboard" | "calendar" | "settings"): void {
    this._overviewTab = tab;
    try { localStorage.setItem(LS_KEYS.overviewTab, tab); } catch { /* private mode */ }
    this._scrollContentToTop();
  }

  /** Mobile-first focus list: what needs attention now, grouped by urgency. */
  private _renderToday() {
    const L = this._lang;
    const rows = this._taskRows; // already excludes archived + disabled
    const key = (r: TaskRow) => `${r.entry_id}:${r.task_id}`;
    const overdue = rows.filter((r) => r.status === "overdue" || r.trigger_active);
    const claimed = new Set(overdue.map(key));
    const dueToday = rows.filter((r) => !claimed.has(key(r)) && r.days_until_due === 0);
    dueToday.forEach((r) => claimed.add(key(r)));
    const thisWeek = rows.filter((r) => !claimed.has(key(r))
      && r.days_until_due != null && r.days_until_due > 0 && r.days_until_due <= 7);

    if (overdue.length + dueToday.length + thisWeek.length === 0) {
      return html`
        <div class="today-empty">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <p>${t("today_all_caught_up", L)}</p>
        </div>
      `;
    }
    return html`
      <div class="today-view">
        ${this._renderTodaySection("today_overdue", overdue, "overdue")}
        ${this._renderTodaySection("today_due_today", dueToday, "due_soon")}
        ${this._renderTodaySection("today_this_week", thisWeek, "")}
      </div>
    `;
  }

  private _renderTodaySection(titleKey: string, rows: TaskRow[], cls: string) {
    if (rows.length === 0) return nothing;
    const L = this._lang;
    return html`
      <div class="today-section">
        <div class="today-section-header ${cls}">
          <span>${t(titleKey, L)}</span><span class="today-badge">${rows.length}</span>
        </div>
        ${rows.map((row) => html`
          <div class="today-row" @click=${() => this._showTask(row.entry_id, row.task_id)}>
            <span class="today-dot ${row.trigger_active ? "triggered" : row.status}"></span>
            <div class="today-main">
              <div class="today-task">${row.task_name}</div>
              <div class="today-object">${row.object_name} · ${formatDueDays(row.days_until_due, L)}</div>
            </div>
            <mwc-icon-button class="btn-complete" title="${t("complete", L)}"
              @click=${(e: Event) => { e.stopPropagation(); this._openCompleteDialogForRow(row); }}>
              <ha-icon icon="mdi:check"></ha-icon>
            </mwc-icon-button>
          </div>
        `)}
      </div>
    `;
  }

  private _renderDashboard() {
    const s = this._stats;
    const rows = this._taskRows;
    const L = this._lang;
    const isOperator = this._isOperator;
    // v2.10.0: count archived tasks so the reveal toggle can show how many are
    // hidden (and hide itself entirely when there is nothing archived).
    const archivedCount = this._objects.reduce(
      (n, o) => n + o.tasks.filter((tk) => tk.archived).length, 0,
    );

    // Filters actively narrowing the list — shown on the collapsed toggle so
    // "why is my list short?" has a visible answer even with filters hidden.
    const activeFilterCount =
      (this._filterStatus ? 1 : 0) +
      (this._filterUser ? 1 : 0) +
      (this._filterLabel ? 1 : 0) +
      (this._activeViewId ? 1 : 0);

    return html`
      ${this._features.budget ? this._renderBudgetBar() : nothing}

      ${this.narrow ? html`
        <div class="mobile-controls">
          <ha-button
            class="mobile-toggle ${this._filtersOpen ? "active" : ""}"
            @click=${() => { this._filtersOpen = !this._filtersOpen; }}
          >
            <ha-icon icon="mdi:filter-variant"></ha-icon>
            ${t("filter_label", L)}${activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </ha-button>
          ${!isOperator ? html`
            <ha-button
              class="mobile-toggle ${this._actionsMenuOpen ? "active" : ""}"
              @click=${() => { this._actionsMenuOpen = !this._actionsMenuOpen; }}
            >
              <ha-icon icon="mdi:plus"></ha-icon>
              ${t("add", L)}
            </ha-button>
          ` : nothing}
        </div>
      ` : nothing}

      <div class="filter-bar ${this.narrow && !this._filtersOpen ? "collapsed" : ""}">
        <label class="filter-field">
          <span class="filter-label">${t("views_label", L)}</span>
          <select
            .value=${this._activeViewId}
            @change=${(e: Event) => this._applyView((e.target as HTMLSelectElement).value)}
          >
            <option value="">${t("views_none", L)}</option>
            ${this._savedViews.map(
              (v) => html`<option value=${v.id} ?selected=${this._activeViewId === v.id}>${v.name}</option>`,
            )}
          </select>
        </label>
        ${!isOperator ? html`
          <ha-icon-button
            class="views-save-btn"
            .path=${"M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"}
            .label=${t("views_manage", L)}
            title=${t("views_manage", L)}
            @click=${() => this._openSavedViewsDialog()}
          ></ha-icon-button>
        ` : nothing}
        <label class="filter-field">
          <span class="filter-label">${t("filter_label", L)}</span>
          <select
            .value=${this._filterStatus}
            @change=${(e: Event) => { this._filterStatus = (e.target as HTMLSelectElement).value; this._activeViewId = ""; }}
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
              this._activeViewId = "";
            }}
          >
            <option value="">${t("all_users", L)}</option>
            <option value="current_user">${t("my_tasks", L)}</option>
          </select>
        </label>
        ${this._allLabels.length > 0 ? html`
          <label class="filter-field">
            <span class="filter-label">${t("label_filter", L)}</span>
            <select
              .value=${this._filterLabel || ""}
              @change=${(e: Event) => {
                const val = (e.target as HTMLSelectElement).value;
                this._filterLabel = val || null;
                this._activeViewId = "";
              }}
            >
              <option value="">${t("all_labels", L)}</option>
              ${this._allLabels.map(
                (lb) => html`<option value=${lb} ?selected=${this._filterLabel === lb}>${lb}</option>`
              )}
            </select>
          </label>
        ` : nothing}
        <label class="filter-field">
          <span class="filter-label">${t("sort_label", L)}</span>
          <select
            .value=${this._sortMode}
            @change=${(e: Event) => {
              this._sortMode = (e.target as HTMLSelectElement).value as SortMode;
              this._activeViewId = "";
              try { localStorage.setItem(LS_KEYS.taskSort, this._sortMode); } catch { /* private mode */ }
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
              this._activeViewId = "";
              try { localStorage.setItem(LS_KEYS.groupBy, this._groupByMode); } catch { /* private mode */ }
            }}
          >
            <option value="none" ?selected=${this._groupByMode === "none"}>${t("groupby_none", L)}</option>
            <option value="area" ?selected=${this._groupByMode === "area"}>${t("groupby_area", L)}</option>
            ${this._features.groups ? html`<option value="group" ?selected=${this._groupByMode === "group"}>${t("groupby_group", L)}</option>` : nothing}
            <option value="user" ?selected=${this._groupByMode === "user"}>${t("groupby_user", L)}</option>
          </select>
        </label>
        ${archivedCount > 0 ? html`
          <ha-button
            class="archived-toggle ${this._showArchived ? "active" : ""}"
            @click=${() => { this._showArchived = !this._showArchived; this._activeViewId = ""; }}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived ? t("hide_archived", L) : `${t("show_archived", L)} (${archivedCount})`}
          </ha-button>
        ` : nothing}
        ${!isOperator && rows.length > 0 ? html`
          <ha-button
            class="bulk-toggle ${this._bulkMode ? "active" : ""}"
            @click=${() => this._toggleBulkMode()}
          >
            <ha-icon icon="mdi:checkbox-multiple-marked-outline"></ha-icon>
            ${this._bulkMode ? t("cancel", L) : t("bulk_select", L)}
          </ha-button>
        ` : nothing}
      </div>

      ${!isOperator ? html`
        <div
          class="actions-bar ${this.narrow && !this._actionsMenuOpen ? "collapsed" : ""}"
          @click=${() => { if (this.narrow) this._actionsMenuOpen = false; }}
        >
          <ha-button
            @click=${() => this.shadowRoot!.querySelector<MaintenanceTaskDialog>("maintenance-task-dialog")?.openCreate("", this._objects)}
          >
            ${t("new_task", L)}
          </ha-button>
          <ha-button
            @click=${() => this.shadowRoot!.querySelector<MaintenanceObjectDialog>("maintenance-object-dialog")?.openCreate()}
          >
            ${t("new_object", L)}
          </ha-button>
          <ha-button @click=${() => this._openTemplateGallery()}>
            <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon> ${t("templates_from", L)}
          </ha-button>
          <ha-button @click=${() => this._openAdoptProblemSensors()}>
            <ha-icon icon="mdi:alert-circle-check-outline"></ha-icon> ${t("adopt_problem_button", L)}
          </ha-button>
          <ha-button @click=${() => this._openSuggestedSetups()}>
            <ha-icon icon="mdi:auto-fix"></ha-icon> ${t("setups_button", L)}
          </ha-button>
          ${this._batteryFleetSetupAvailable ? html`
            <ha-button @click=${() => this._setupBatteryFleet()}>
              <ha-icon icon="mdi:battery-sync"></ha-icon> ${t("battery_fleet_setup_button", L)}
            </ha-button>
          ` : nothing}
        </div>
      ` : nothing}

      ${rows.length === 0
        ? html`
            <div class="empty-state">
              <ha-svg-icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></ha-svg-icon>
              <p>${t("no_tasks", L)}</p>
              ${!isOperator && this._objects.length === 0 ? html`
                <p class="empty-onboard-hint">${t("onboard_hint", L)}</p>
                <div class="empty-onboard-actions">
                  <ha-button appearance="filled" @click=${() => this._openTemplateGallery()}>
                    <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon> ${t("templates_from", L)}
                  </ha-button>
                  <ha-button appearance="plain" @click=${() => this.shadowRoot!.querySelector<MaintenanceObjectDialog>("maintenance-object-dialog")?.openCreate()}>
                    ${t("new_object", L)}
                  </ha-button>
                </div>
              ` : nothing}
            </div>
          `
        : html`
            ${this._bulkMode ? this._renderBulkBar(rows, L) : nothing}
            ${this._groupByMode === "none"
              ? this._renderTaskTable(rows)
              : this._renderGroupedTasks(rows, L)}
          `}

      ${this._features.groups && !isOperator ? this._renderGroupsSection() : nothing}
      ${!isOperator
        ? html`<maintenance-storage-section-card
            .hass=${this.hass}
            .objects=${this._objects}
            @open-object=${(e: CustomEvent<{ entry_id?: string }>) => {
              const eid = e.detail?.entry_id;
              if (eid) this._showObject(eid);
            }}
          ></maintenance-storage-section-card>`
        : nothing}
    `;
  }

  /** The flat dashboard task table. Below VIRTUAL_MIN_ROWS (or on narrow
   *  layouts, where rows aren't uniform-height) every row renders directly.
   *  Above it, only the scroll window is in the DOM: two grid-spanning
   *  spacers keep the scrollbar honest, and a hidden "sizer" row pins the
   *  content-sized badge column to the widest badge set across ALL rows so
   *  the shared subgrid tracks can't jitter as rows enter/leave the window. */
  private _renderTaskTable(rows: TaskRow[]) {
    const bulkCls = this._bulkMode ? " bulk" : "";
    this._virtTotalRows = rows.length;
    if (this.narrow || rows.length < VIRTUAL_MIN_ROWS) {
      return html`
        <div class="task-table${bulkCls}">
          ${rows.map((row) => this._renderOverviewRow(row))}
        </div>
      `;
    }
    const total = rows.length;
    const rh = this._virtRowHeight;
    let start = Math.max(0, Math.min(this._virtStart, total));
    let end = this._virtEnd > 0 ? Math.min(this._virtEnd, total) : Math.min(total, 40);
    if (end < start) { start = 0; end = Math.min(total, 40); }
    const padTop = start * rh;
    const padBottom = (total - end) * rh;
    return html`
      <div class="task-table${bulkCls} virtual">
        ${this._renderVirtSizerRow(rows)}
        ${padTop > 0 ? html`<div class="virt-spacer" style="height:${padTop}px"></div>` : nothing}
        ${rows.slice(start, end).map((row) => this._renderOverviewRow(row))}
        ${padBottom > 0 ? html`<div class="virt-spacer" style="height:${padBottom}px"></div>` : nothing}
      </div>
    `;
  }

  /** Invisible zero-height row whose badge cell carries the union of the
   *  widest badges across ALL rows. Because the subgrid's `auto` badge track
   *  sizes to the max over rendered rows, including this row makes the track
   *  width independent of which data rows happen to be in the window. */
  private _renderVirtSizerRow(rows: TaskRow[]) {
    const L = this._lang;
    let widest = "";
    let anyDisabled = false;
    let anyNfc = false;
    let anyPriority = false;
    for (const r of rows) {
      const label = r.archived ? t("archived", L) : (r.is_done ? t("completed", L) : t(r.status, L));
      if (label.length > widest.length) widest = label;
      if (!r.enabled) anyDisabled = true;
      if (r.nfc_tag_id) anyNfc = true;
      if (r.priority === "high" || r.priority === "low") anyPriority = true;
    }
    return html`
      <div class="task-row virt-sizer" aria-hidden="true">
        ${this._bulkMode ? html`<span></span>` : nothing}
        <span class="cell-badges">
          <span class="status-badge"><ha-icon icon="mdi:circle-medium"></ha-icon>${widest}</span>
          ${anyDisabled ? html`<span class="badge-disabled">${t("disabled", L)}</span>` : nothing}
          ${anyNfc ? html`<span class="nfc-badge"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>` : nothing}
          ${anyPriority ? html`<span class="priority-badge"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>` : nothing}
        </span>
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
    `;
  }

  private _renderBulkBar(rows: TaskRow[], L: string) {
    const n = this._bulkSelected.size;
    const allSelected = rows.length > 0 && rows.every((r) => this._bulkSelected.has(this._bulkKey(r)));
    return html`
      <div class="bulk-bar">
        <label class="bulk-selectall">
          <input type="checkbox" .checked=${allSelected} @change=${() => this._bulkSelectAll(rows)} />
          ${t("bulk_select_all", L)}
        </label>
        <span class="bulk-count">${t("bulk_n_selected", L).replace("{n}", String(n))}</span>
        <span class="bulk-actions">
          <ha-button appearance="filled" .disabled=${n === 0 || this._actionLoading}
            @click=${() => this._bulkComplete(rows)}>
            <ha-icon icon="mdi:check"></ha-icon> ${t("complete", L)}
          </ha-button>
          <ha-button appearance="plain" .disabled=${n === 0 || this._actionLoading}
            @click=${() => this._bulkArchive(rows)}>
            <ha-icon icon="mdi:archive-outline"></ha-icon> ${t("archive", L)}
          </ha-button>
        </span>
      </div>
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
          <div class="task-table${this._bulkMode ? " bulk" : ""}">
            ${taskRows.map((row) => this._renderOverviewRow(row))}
          </div>
        </details>
      `)}
    `;
  }

  // (#67) Localised warranty label, shared by the detail meta + table cell.
  private _warrantyLabel(ws: ReturnType<typeof warrantyStatus>, iso: string, L: string): string {
    if (ws.kind === "expired") return t("warranty_expired", L);
    if (ws.kind === "expiring") {
      return t("warranty_expires_in", L).replace("{days}", String(ws.days ?? 0));
    }
    return t("warranty_valid_until", L).replace("{date}", formatDate(iso, L));
  }

  // (#67) Warranty status as a coloured chip in the object detail meta.
  private _renderWarrantyMeta(iso: string, L: string) {
    const ws = warrantyStatus(iso);
    return html`<p class="meta">${t("warranty", L)}:
      <span class="warranty-chip warranty-${ws.kind}">${this._warrantyLabel(ws, iso, L)}</span></p>`;
  }

  private _renderAllObjects() {
    const L = this._lang;
    const isOperator = this._isOperator;
    // (#67) Table mode is desktop-only; narrow viewports always fall back to
    // cards (the table's many columns don't fit a phone).
    const tableMode = this._objectViewMode === "table" && !this.narrow;
    // v2.10.0: how many objects are archived (drives the reveal toggle below).
    const archivedObjCount = this._objects.filter((o) => o.object.archived).length;

    // Sort + group helpers
    const minDays = (obj: MaintenanceObjectResponse): number => {
      let m = Infinity;
      for (const t of obj.tasks) {
        const d = t.days_until_due;
        if (d !== null && d !== undefined && d < m) m = d;
      }
      return m;
    };
    const sorted = this._objects.filter((o) => this._showArchived || !o.object.archived);
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
            ${obj.object.paused
              ? html`<span class="paused-badge" title="${t("object_paused_badge", L)}${obj.object.paused_until ? ` — ${obj.object.paused_until}` : ""}">
                  <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
                </span>`
              : nothing}
            ${obj.object.document_count
              ? html`<span class="doc-badge" title="${obj.object.document_count} ${t("documents", L)}">
                  <ha-icon icon="mdi:paperclip"></ha-icon>${obj.object.document_count}
                </span>`
              : nothing}
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
              localStorage.setItem(LS_KEYS.objectSort, this._objectSortMode);
            }}
          >
            <option value="alphabetical" ?selected=${this._objectSortMode === "alphabetical"}>${t("sort_alphabetical", L)}</option>
            <option value="due_soonest" ?selected=${this._objectSortMode === "due_soonest"}>${t("sort_due_soonest", L)}</option>
            <option value="task_count" ?selected=${this._objectSortMode === "task_count"}>${t("sort_task_count", L)}</option>
          </select>
        </label>
        ${!this.narrow ? html`
          <div class="view-toggle" role="group" aria-label="${t("view_mode_label", L)}">
            <button
              class="view-toggle-btn${!tableMode ? ' active' : ''}"
              title="${t("view_cards", L)}"
              @click=${() => this._setObjectViewMode("cards")}
            ><ha-icon icon="mdi:view-grid-outline"></ha-icon></button>
            <button
              class="view-toggle-btn${tableMode ? ' active' : ''}"
              title="${t("view_table", L)}"
              @click=${() => this._setObjectViewMode("table")}
            ><ha-icon icon="mdi:table"></ha-icon></button>
          </div>
        ` : nothing}
        ${!tableMode ? html`
        <label class="filter-field">
          <span class="filter-label">${t("group_by_label", L)}</span>
          <select
            .value=${this._groupByMode}
            @change=${(e: Event) => {
              this._groupByMode = (e.target as HTMLSelectElement).value as GroupByMode;
              try { localStorage.setItem(LS_KEYS.groupBy, this._groupByMode); } catch { /* private mode */ }
            }}
          >
            <option value="none" ?selected=${this._groupByMode === "none"}>${t("groupby_none", L)}</option>
            <option value="area" ?selected=${this._groupByMode === "area"}>${t("groupby_area", L)}</option>
          </select>
        </label>
        ` : nothing}
        ${!isOperator ? html`
          <ha-button
            @click=${() => this.shadowRoot!.querySelector<MaintenanceObjectDialog>("maintenance-object-dialog")?.openCreate()}
          >
            ${t("new_object", L)}
          </ha-button>
        ` : nothing}
        <ha-button appearance="plain" @click=${() => this._exportObjectsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${t("settings_export_csv", L)}
        </ha-button>
        ${archivedObjCount > 0 ? html`
          <ha-button
            class="archived-toggle ${this._showArchived ? "active" : ""}"
            @click=${() => { this._showArchived = !this._showArchived; }}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived ? t("hide_archived", L) : `${t("show_archived", L)} (${archivedObjCount})`}
          </ha-button>
        ` : nothing}
      </div>
      ${tableMode
        ? this._renderObjectsTable(sorted)
        : this._groupByMode === "area"
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

  private _setObjectViewMode(mode: "cards" | "table"): void {
    this._objectViewMode = mode;
    localStorage.setItem(LS_KEYS.objectView, mode);
  }

  // (#67 / Phase 3) Download all objects as a one-row-per-object CSV.
  private async _exportObjectsCsv(): Promise<void> {
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/objects/csv",
      }) as { csv: string };
      const ts = new Date().toISOString().slice(0, 10);
      downloadTextFile(result.csv, `maintenance_objects_${ts}.csv`, "text/csv;charset=utf-8");
    } catch {
      this._showToast(t("action_error", this._lang));
    }
  }

  // (#67) Tabular All-Objects view honouring the configured columns. Desktop
  // only — the caller falls back to cards on narrow viewports.
  private _renderObjectsTable(objs: MaintenanceObjectResponse[]) {
    const L = this._lang;
    const cols = this._objectsTableColumns;
    return html`
      <div class="objects-table-wrap">
        <table class="objects-table">
          <thead>
            <tr>
              ${cols.map((key) => {
                const def = OBJECT_COLUMNS.find((c) => c.key === key);
                // The actions column header stays blank (icon-only cells).
                const label = def && def.key !== "actions" ? t(def.labelKey, L) : "";
                return html`<th class="oc-${key}">${label}</th>`;
              })}
            </tr>
          </thead>
          <tbody>
            ${objs.map((obj) => html`
              <tr class="objects-table-row" @click=${() => this._showObject(obj.entry_id)}>
                ${cols.map((key) => this._renderObjectCell(key, obj, L))}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `;
  }

  private _renderObjectCell(key: string, obj: MaintenanceObjectResponse, L: string) {
    const o = obj.object;
    switch (key) {
      case "name":
        return html`<td class="oc-name">
          <span class="objects-table-name">${o.name}</span>
          ${o.document_count
            ? html`<span class="doc-badge" title="${o.document_count} ${t("documents", L)}">
                <ha-icon icon="mdi:paperclip"></ha-icon>${o.document_count}
              </span>`
            : nothing}
        </td>`;
      case "manufacturer":
        return html`<td class="oc-manufacturer">${o.manufacturer || "—"}</td>`;
      case "model":
        return html`<td class="oc-model">${o.model || "—"}</td>`;
      case "serial_number":
        return html`<td class="oc-serial_number">${o.serial_number || "—"}</td>`;
      case "installation_date":
        return html`<td class="oc-installation_date">${o.installation_date ? formatDate(o.installation_date, L) : "—"}</td>`;
      case "warranty_expiry":
        return html`<td class="oc-warranty_expiry">${this._renderWarrantyCell(o.warranty_expiry, L)}</td>`;
      case "area_id": {
        const area = o.area_id ? (this.hass?.areas?.[o.area_id]?.name || o.area_id) : "—";
        return html`<td class="oc-area_id">${area}</td>`;
      }
      case "documentation_url":
        return html`<td class="oc-documentation_url">${
          isSafeHttpUrl(o.documentation_url)
            ? html`<a href=${o.documentation_url} target="_blank" rel="noopener noreferrer"
                @click=${(e: Event) => e.stopPropagation()}><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`
            : "—"
        }</td>`;
      case "notes":
        return html`<td class="oc-notes" title=${o.notes || ""}>${o.notes || "—"}</td>`;
      case "task_count":
        return html`<td class="oc-task_count">${obj.tasks.length}</td>`;
      case "actions":
        return html`<td class="oc-actions">
          <mwc-icon-button title="${t("qr_code", L)}" @click=${(e: Event) => { e.stopPropagation(); this._openQrForObject(obj.entry_id, o.name); }}>
            <ha-icon icon="mdi:qrcode"></ha-icon>
          </mwc-icon-button>
        </td>`;
      default:
        return html`<td></td>`;
    }
  }

  // Warranty chip for a table cell — like _renderWarrantyMeta but renders an
  // em-dash placeholder when the object has no warranty date.
  private _renderWarrantyCell(iso: string | null | undefined, L: string) {
    const ws = warrantyStatus(iso);
    if (ws.kind === "none") return html`<span class="warranty-none">—</span>`;
    return html`<span class="warranty-chip warranty-${ws.kind}">${this._warrantyLabel(ws, iso as string, L)}</span>`;
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
    const cs = b.currency_symbol || DEFAULT_CURRENCY_SYMBOL;
    const bars: { label: string; spent: number; budget: number }[] = [];
    if (b.monthly_budget > 0) bars.push({ label: t("budget_monthly", L), spent: b.monthly_spent, budget: b.monthly_budget });
    if (b.yearly_budget > 0) bars.push({ label: t("budget_yearly", L), spent: b.yearly_spent, budget: b.yearly_budget });
    // #104: budget tracking enabled WITHOUT a maximum — the spent totals were
    // invisible (a bar needs a denominator). Show plain spent lines instead,
    // so "what did I spend" always has a dashboard answer.
    const spentOnly: { label: string; spent: number }[] = [];
    if (!(b.monthly_budget > 0)) spentOnly.push({ label: t("budget_monthly", L), spent: b.monthly_spent || 0 });
    if (!(b.yearly_budget > 0)) spentOnly.push({ label: t("budget_yearly", L), spent: b.yearly_spent || 0 });

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
        ${spentOnly.map(
          (s) => html`
            <div class="budget-item budget-spent-only">
              <div class="budget-label">
                <span>${s.label}</span>
                <span>${s.spent.toFixed(2)} ${cs}</span>
              </div>
            </div>
          `,
        )}
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
      const p = daysProgress(row.interval_days, row.days_until_due, row.interval_unit);
      pct = p.pct;
      daysOverflow = p.overflow;
      if (row.status === "overdue") barColor = STATUS_COLORS.overdue;
      else if (row.status === "due_soon") barColor = STATUS_COLORS.due_soon;
    }

    const areaName = row.area_id ? this.hass?.areas?.[row.area_id]?.name : null;
    const userName = row.responsible_user_id ? this._userService?.getUserName(row.responsible_user_id) : null;
    const hasSub = row.group_names.length > 0 || areaName || userName;

    const bulkSelected = this._bulkMode && this._bulkSelected.has(this._bulkKey(row));
    return html`
      <div class="task-row${!row.enabled ? ' task-disabled' : ''}${bulkSelected ? ' bulk-selected' : ''}">
        ${this._bulkMode ? html`
          <label class="cell bulk-check" @click=${(e: Event) => e.stopPropagation()}>
            <input type="checkbox" .checked=${bulkSelected} @change=${() => this._toggleBulkRow(row)} />
          </label>
        ` : nothing}
        <span class="cell-badges">
          ${this._statusBadge(!!row.archived, row.is_done, row.status)}
          ${!row.enabled ? html`<span class="badge-disabled">${t("disabled", L)}</span>` : nothing}
          ${row.nfc_tag_id ? html`<span class="nfc-badge" title="${t("nfc_linked", L)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>` : nothing}
          ${row.priority === "high" ? html`<span class="priority-badge priority-high" title="${t("priority_high", L)}"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>` : nothing}
          ${row.priority === "low" ? html`<span class="priority-badge priority-low" title="${t("priority_low", L)}"><ha-icon icon="mdi:chevron-double-down"></ha-icon></span>` : nothing}
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
          ${(row.labels || []).map((label) => html`
            <span class="sub-chip label-chip" title="${t("labels", L)}">
              <ha-icon icon="mdi:tag-outline"></ha-icon>${label}
            </span>`)}
        </span>
        <span class="cell type">${t(row.type, L)}</span>
        <span class="due-cell" @click=${() => this._showTask(row.entry_id, row.task_id)}>
          <span class="due-text">${formatDueDays(row.days_until_due, L)}</span>
          ${hasDaysBar
            ? html`<div class="days-bar"><div class="days-bar-fill${daysOverflow ? " overflow" : ""}" style="width:${pct}%;background:${barColor}"></div></div>`
            : nothing}
          ${row.trigger_config
            ? renderTriggerProgress(row)
            : !hasDaysBar && row.trigger_active
            ? html`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`
            : nothing}
          ${renderMiniSparkline(row, this._miniStatsData, this._lang)}
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
  private _renderObjectDetail() {
    if (!this._selectedEntryId) return nothing;
    const obj = this._getObject(this._selectedEntryId);
    if (!obj) return html`<p>Object not found.</p>`;
    const o = obj.object;
    const L = this._lang;

    const isOperator = this._isOperator;

    // v2.10.0: archived tasks are hidden in the object detail too, unless the
    // shared show-archived toggle is on; a per-detail toggle reveals them when
    // this object has any (e.g. a task archived individually on an active object).
    const archivedInObj = obj.tasks.filter((tk) => tk.archived).length;
    const visibleTasks = obj.tasks.filter((tk) => this._showArchived || !tk.archived);

    return html`
      <div class="detail-section">
        <div class="detail-header">
          <h2>${o.name}</h2>
          <div class="action-buttons">
            ${!isOperator ? html`
              <ha-button appearance="filled" @click=${() => {
                const dlg = this.shadowRoot!.querySelector<MaintenanceTaskDialog>("maintenance-task-dialog");
                dlg?.openCreate(obj.entry_id);
              }}>${t("add_task", L)}</ha-button>
              <ha-button appearance="plain" @click=${() => {
                const dlg = this.shadowRoot!.querySelector<MaintenanceObjectDialog>("maintenance-object-dialog");
                dlg?.openEdit(obj.entry_id, o);
              }}>${t("edit", L)}</ha-button>
            ` : nothing}
            <div class="more-menu-wrapper">
              <ha-icon-button .disabled=${this._actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${() => this._toggleObjMenu()}></ha-icon-button>
              ${this._objMenuOpen ? html`
                <div class="popup-menu" @click=${(e: Event) => e.stopPropagation()}>
                  <div class="popup-menu-item" @click=${() => { this._closeObjMenu(); this._openQrForObject(obj.entry_id, o.name); }}>${t("qr_code", L)}</div>
                  <div class="popup-menu-item" @click=${() => { this._closeObjMenu(); this._printObjectReport(obj.entry_id); }}>${t("report_button", L)}</div>
                  ${!isOperator ? html`
                    <div class="popup-menu-item" @click=${() => { this._closeObjMenu(); this._duplicateObject(obj.entry_id); }}>${t("duplicate", L)}</div>
                    ${!o.archived ? html`
                      <div class="popup-menu-item" @click=${() => { this._closeObjMenu(); this._togglePauseObject(obj.entry_id, !!o.paused); }}>${o.paused ? t("resume_object", L) : t("pause_object", L)}</div>
                      <div class="popup-menu-item" @click=${() => { this._closeObjMenu(); this._replaceObject(obj.entry_id, o.name); }}>${t("replace_object", L)}</div>
                    ` : nothing}
                    <div class="popup-menu-item" @click=${() => { this._closeObjMenu(); this._toggleArchiveObject(obj.entry_id, !!o.archived); }}>${o.archived ? t("unarchive_object", L) : t("archive_object", L)}</div>
                    <div class="popup-menu-divider"></div>
                    <div class="popup-menu-item danger" @click=${() => { this._closeObjMenu(); this._deleteObject(obj.entry_id); }}>${t("delete", L)}</div>
                  ` : nothing}
                </div>
              ` : nothing}
            </div>
          </div>
        </div>
        ${o.paused
          ? html`<p class="meta paused-meta">
              <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
              ${t("object_paused_badge", L)}${o.paused_until
                ? html` — ${t("paused_until_label", L)} ${formatDate(o.paused_until, L)}`
                : nothing}
            </p>`
          : nothing}
        ${o.manufacturer || o.model
          ? html`<p class="meta">${[o.manufacturer, o.model].filter(Boolean).join(" ")}</p>`
          : nothing}
        ${o.serial_number ? html`<p class="meta">${t("serial_number_label", L)}: ${o.serial_number}</p>` : nothing}
        ${isSafeHttpUrl(o.documentation_url)
          ? html`<p class="meta">${t("documentation_url_label", L)}:
              <a href=${o.documentation_url} target="_blank" rel="noopener noreferrer">${o.documentation_url}</a>
            </p>`
          : nothing}
        ${o.installation_date ? html`<p class="meta">${t("installed", L)}: ${formatDate(o.installation_date, L)}</p>` : nothing}
        ${o.warranty_expiry ? this._renderWarrantyMeta(o.warranty_expiry, L) : nothing}
        ${o.notes
          ? html`<div class="object-notes">
              <div class="object-notes-label">${t("object_notes_label", L)}</div>
              <div class="object-notes-body">${o.notes}</div>
            </div>`
          : nothing}

        <h3>${t("tasks", L)} (${visibleTasks.length})${archivedInObj > 0 ? html`
          <ha-button
            class="archived-toggle ${this._showArchived ? "active" : ""}"
            appearance="plain"
            @click=${() => { this._showArchived = !this._showArchived; }}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived ? t("hide_archived", L) : `${t("show_archived", L)} (${archivedInObj})`}
          </ha-button>` : nothing}</h3>
        ${obj.tasks.length === 0
          ? html`<div class="empty-state-centered">
              <p class="empty">${t("no_tasks_yet", L)}</p>
              <ha-button appearance="filled" @click=${() => {
                const dlg = this.shadowRoot!.querySelector<MaintenanceTaskDialog>("maintenance-task-dialog");
                dlg?.openCreate(obj.entry_id);
              }}>${t("add_first_task", L)}</ha-button>
            </div>`
          : html`<div class="task-table">${[...visibleTasks].sort((a, b) => {
              const so: Record<string, number> = { overdue: 0, triggered: 1, due_soon: 2, ok: 3 };
              return (so[a.status] ?? 9) - (so[b.status] ?? 9) || (a.days_until_due ?? 99999) - (b.days_until_due ?? 99999);
            }).map((task) => html`
              <div class="task-row${!task.enabled ? ' task-disabled' : ''}">
                <span class="cell-badges">
                  ${this._statusBadge(!!task.archived, !!task.is_done, task.status)}
                  ${!task.enabled ? html`<span class="badge-disabled">${t("disabled", L)}</span>` : nothing}
                  ${task.nfc_tag_id ? html`<span class="nfc-badge" title="${t("nfc_linked", L)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>` : nothing}
                  ${task.document_count
                    ? html`<span class="doc-badge" title="${task.document_count} ${t("documents", L)}"><ha-icon icon="mdi:paperclip"></ha-icon>${task.document_count}</span>`
                    : nothing}
                </span>
                <span class="cell task-name" @click=${() => this._showTask(obj.entry_id, task.id)}>${task.name}</span>
                <span class="task-sub${task.responsible_user_id ? '' : ' task-sub-empty'}">${renderUserBadge(task, (id) => this._userService?.getUserName(id) ?? null)}</span>
                <span class="cell type">${t(task.type, L)}</span>
                <span class="due-cell" @click=${() => this._showTask(obj.entry_id, task.id)}>
                  <span class="due-text">${formatDueDays(task.days_until_due, L)}</span>
                  ${task.trigger_config
                    ? renderTriggerProgress(task)
                    : nothing}
                  ${renderMiniSparkline(task, this._miniStatsData, this._lang)}
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
            `)}</div>`}

        <maintenance-documents-section
          .hass=${this.hass}
          .entryId=${obj.entry_id}
          .canWrite=${!isOperator}
        ></maintenance-documents-section>

        <maintenance-parts-section
          .hass=${this.hass}
          .entryId=${obj.entry_id}
          .parts=${obj.parts || []}
          .canWrite=${!isOperator}
          @parts-changed=${() => this._loadData()}
        ></maintenance-parts-section>
      </div>
    `;
  }

  /**
   * Render compact task header with status chip and action buttons.
   */
  // Object-detail ⋮ menu — same click-away pattern as the task-detail menu.
  private _toggleObjMenu(): void {
    this._objMenuOpen = !this._objMenuOpen;
    if (this._objMenuOpen) {
      setTimeout(() => {
        const handler = () => { this._objMenuOpen = false; document.removeEventListener("click", handler); };
        document.addEventListener("click", handler);
      }, 0);
    }
  }

  private _closeObjMenu(): void {
    this._objMenuOpen = false;
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

  private get _sparklineCtx(): SparklineContext {
    return {
      lang: this._lang,
      detailStatsData: this._detailStatsData,
      hasStatsService: !!this._statsService,
      isCounterEntity: (tc) => this._isCounterEntity(tc),
      rangeDays: this._chartRangeDays,
      setRangeDays: (days) => this._setChartRange(days),
      hideOutliers: this._hideOutliers,
      setHideOutliers: (hide) => this._setHideOutliers(hide),
    };
  }

  private _toggleSection(key: string): void {
    const next = new Set(this._collapsedSections);
    if (next.has(key)) next.delete(key); else next.add(key);
    this._collapsedSections = next;
    try { localStorage.setItem(LS_KEYS.collapsedSections, JSON.stringify([...next])); } catch { /* private mode */ }
  }

  /** Build the context the history renderers need from panel state. */
  private _historyCtx(): HistoryContext {
    // v2.20 (#83): reading tasks show value + delta per entry. The delta is
    // against the chronologically PREVIOUS entry that carries a reading.
    const task = this._selectedEntryId && this._selectedTaskId
      ? this._getObject(this._selectedEntryId)?.tasks.find((tk) => tk.id === this._selectedTaskId)
      : undefined;
    const readings = (task?.history || [])
      .filter((h) => h.reading_value != null)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    return {
      lang: this._lang,
      hass: this.hass,
      filter: this._historyFilter,
      search: this._historySearch,
      currencySymbol: this._budget?.currency_symbol || DEFAULT_CURRENCY_SYMBOL,
      setFilter: (f) => { this._historyFilter = f; },
      setSearch: (s) => { this._historySearch = s; },
      openEdit: (entry) => this._openHistoryEdit(entry),
      readingUnit: task?.reading_unit ?? null,
      readingDelta: (entry) => {
        const idx = readings.findIndex((h) => h.timestamp === entry.timestamp);
        if (idx <= 0) return null;
        return (entry.reading_value as number) - (readings[idx - 1].reading_value as number);
      },
    };
  }

  /** Build the context the task-detail renderers need from panel state.
   *  Dialog-opening callbacks stay panel-side (the dialogs live in THIS
   *  shadow root), so the extracted module never touches a dialog itself. */
  private _taskDetailCtx(): TaskDetailContext {
    const entryId = this._selectedEntryId!;
    const taskId = this._selectedTaskId!;
    const obj = this._getObject(entryId);
    return {
      lang: this._lang,
      hass: this.hass,
      entryId,
      taskId,
      objectName: obj?.object.name || "",
      objectDocUrl: obj?.object?.documentation_url ?? null,
      isOperator: this._isOperator,
      actionLoading: this._actionLoading,
      moreMenuOpen: this._moreMenuOpen,
      activeTab: this._activeTab,
      features: this._features,
      currencySymbol: this._budget?.currency_symbol || DEFAULT_CURRENCY_SYMBOL,
      collapsedSections: this._collapsedSections,
      costDurationToggle: this._costDurationToggle,
      suggestionDismissed: this._dismissedSuggestions.has(`${entryId}_${taskId}`),
      sparkline: this._sparklineCtx,
      history: this._historyCtx(),
      getUserName: (id) => this._userService?.getUserName(id) ?? null,
      setActiveTab: (tab) => { this._activeTab = tab; },
      toggleSection: (key) => this._toggleSection(key),
      setCostDurationToggle: (v) => { this._costDurationToggle = v; },
      showTaskView: () => { this._view = "task"; },
      showObject: () => this._showObject(entryId),
      toggleMoreMenu: () => this._toggleMoreMenu(),
      closeMoreMenu: () => this._closeMoreMenu(),
      openEdit: (tk) => { this.shadowRoot!.querySelector<MaintenanceTaskDialog>("maintenance-task-dialog")?.openEdit(entryId, tk); },
      openComplete: (tk) => this._openCompleteDialog(entryId, taskId, tk.name, this._features.checklists ? tk.checklist : undefined, this._features.adaptive && !!tk.adaptive_config?.enabled),
      promptSkip: () => this._promptSkipTask(entryId, taskId),
      toggleArchive: (archived) => this._toggleArchiveTask(entryId, taskId, archived),
      openQr: (taskName) => this._openQrForTask(entryId, taskId, obj?.object.name || "", taskName),
      duplicateTask: () => this._duplicateTask(entryId, taskId),
      promptReset: () => this._promptResetTask(entryId, taskId),
      promptPostpone: () => this._promptPostponeTask(entryId, taskId),
      snoozeTask: () => this._snoozeTask(entryId, taskId),
      printWorksheet: () => this._printTaskWorksheet(entryId, taskId),
      deleteTask: () => this._deleteTask(entryId, taskId),
      applySuggestion: (interval) => this._applySuggestion(entryId, taskId, interval),
      reanalyze: () => this._reanalyzeInterval(entryId, taskId),
      dismissSuggestion: () => this._dismissSuggestion(entryId, taskId),
      openSeasonalOverrides: (tk) => this._openSeasonalOverrides(tk),
    };
  }

  private _renderTaskDetail() {
    if (!this._selectedEntryId || !this._selectedTaskId) return nothing;
    const task = this._getTask(this._selectedEntryId, this._selectedTaskId);
    if (!task) return html`<p>Task not found.</p>`;
    return html`<maintenance-task-detail-view
      .task=${task}
      .ctx=${this._taskDetailCtx()}
    ></maintenance-task-detail-view>`;
  }

  /** v2.2.0: open the in-place history-edit dialog for the given entry.
   *  After save, the dialog fires `history-entry-saved` which we listen
   *  for in the template to trigger a data refresh. */
  private _openHistoryEdit(entry: HistoryEntry): void {
    if (!this._selectedEntryId || !this._selectedTaskId) return;
    const draft: HistoryEntryDraft = {
      entry_id: this._selectedEntryId,
      task_id: this._selectedTaskId,
      original_timestamp: entry.timestamp,
      type: entry.type,
      timestamp: entry.timestamp,
      notes: entry.notes ?? null,
      cost: entry.cost ?? null,
      duration: entry.duration ?? null,
      completed_by: entry.completed_by ?? null,
    };
    this.shadowRoot
      ?.querySelector<MaintenanceHistoryEditDialog>("maintenance-history-edit-dialog")
      ?.openEdit(draft);
  }

  /** Triggered by the dialog after a successful WS save. Refresh the loaded
   *  data so the user sees the updated entry. */
  private _onHistoryEntrySaved = async (): Promise<void> => {
    await this._loadData();
  };

  static styles = [sharedStyles, panelStyles];
}
