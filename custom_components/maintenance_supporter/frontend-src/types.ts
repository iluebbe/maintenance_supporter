/** TypeScript interfaces for the Maintenance Supporter frontend. */

export interface MaintenanceObject {
  id: string;
  name: string;
  area_id?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  serial_number?: string | null;
  installation_date?: string | null;
  /** (#67): warranty expiry date (ISO YYYY-MM-DD) for asset tracking */
  warranty_expiry?: string | null;
  // 2.19: attach to an existing HA device / nest under another object
  ha_device_id?: string | null;
  parent_entry_id?: string | null;
  /** v1.4.0 (#43): optional link to PDF manual / vendor page for the object */
  documentation_url?: string | null;
  /** v1.4.10 (#46): free-form notes — part numbers, procedures, etc. */
  notes?: string | null;
  /** v2.10.0 archive: archived (retire-but-retain) state; archived = archived_at != null. */
  archived?: boolean;
  archived_at?: string | null;
  /** v2.20 (N3) seasonal pause: paused = paused_at != null; paused_until is
   *  the optional auto-resume date. */
  paused?: boolean;
  paused_at?: string | null;
  paused_until?: string | null;
  /** v2.20 (N1) replace-flow lineage (both directions). */
  predecessor_entry_id?: string | null;
  replaced_by_entry_id?: string | null;
  /** (roadmap P2) number of attached documents (files + web-links); drives the
   *  objects-table paperclip badge. Computed server-side, not persisted. */
  document_count?: number;
  /** Attached documents tagged as manuals — the fallback for the "manual"
   *  column/header when documentation_url is unset. Computed server-side. */
  manual_docs?: ManualDocRef[];
  /** Battery-fleet markers (v2.53 field audit): true on THE fleet object;
   *  excluded = entity_ids manually excluded from the fleet roster. */
  battery_fleet?: boolean;
  battery_fleet_excluded?: string[];
}

/** Slim reference to a manual-tagged document (subset of MaintenanceDocument). */
export interface ManualDocRef {
  id: string;
  title: string;
  kind: string; // "file" | "weblink"
  url?: string | null;
}

export interface TriggerConfig {
  entity_id?: string;
  entity_ids?: string[];
  entity_logic?: "any" | "all";
  attribute?: string | null;
  type?: string; // "threshold" | "counter" | "state_change" | "runtime"
  trigger_above?: number | null;
  trigger_below?: number | null;
  trigger_equals?: number | null;
  trigger_not_equals?: number | null;
  /** "any" (default) = trigger or safety interval, whichever first; "all" = both required. */
  trigger_combinator?: string;
  trigger_for_minutes?: number;
  trigger_target_value?: number;
  trigger_delta_mode?: boolean;
  trigger_baseline_value?: number | null;
  trigger_from_state?: string | null;
  trigger_to_state?: string | null;
  trigger_target_changes?: number;
  trigger_runtime_hours?: number;
  /** #149: a single session books at most this many seconds. */
  trigger_runtime_max_session_seconds?: number;
  /** States (or attribute values) that count as "running" — default ["on"]. */
  trigger_on_states?: string[];
  compound_logic?: "AND" | "OR";
  conditions?: Array<TriggerConfig>;
  /** Record a completion when the trigger clears itself (#53). */
  auto_complete_on_recovery?: boolean;
}

export interface TriggerEntityInfo {
  entity_id: string;
  friendly_name: string;
  unit_of_measurement?: string | null;
  min?: number | null;
  max?: number | null;
  step?: number | null;
}

/** #161 phase 2: one named reading a `reading` task records per completion. */
export interface ReadingSlot {
  id: string;
  name: string;
  unit?: string | null;
}

/** #161 phase 2: a slot's value on a completion — name/unit are a snapshot
 *  taken at completion time, `id` is what deltas match on. */
export interface ReadingValue {
  id: string;
  name: string;
  unit?: string | null;
  value: number;
}

export interface HistoryEntry {
  timestamp: string;
  type: string; // "completed" | "skipped" | "reset" | "triggered"
  notes?: string | null;
  cost?: number | null;
  duration?: number | null;
  trigger_value?: number | null;
  checklist_state?: Record<string, boolean> | null;
  feedback?: string | null;
  completed_by?: string | null;
  /** Pre-#161 single completion photo — read for old entries, never written. */
  photo_doc_id?: string | null;
  /** #161: every photo attached to this completion (see helpers/history-photos). */
  photo_doc_ids?: string[] | null;
  /** v2.20 (#83): recorded value for `reading`-type tasks. */
  reading_value?: number | null;
  /** #161 phase 2: per-slot snapshot of a task with reading slots. */
  reading_values?: ReadingValue[] | null;
  /** #99/#130: the completion's part consumption (entry_id set for pooled). */
  used_parts?: Array<{ part_id: string; name?: string; quantity: number; entry_id?: string }> | null;
  /** v2.37: completion recorded by the system itself (trigger recovered),
   *  not performed by a user in the UI. */
  auto?: boolean;
  /** #139: which cycle phase this LATEST completion recorded (backfills
   *  carry none — they never advanced the cursor). */
  phase_id?: string | null;
}

export interface AdaptiveConfig {
  enabled: boolean;
  ewa_alpha?: number;
  min_interval_days?: number;
  max_interval_days?: number;
  smoothed_interval?: number;
  feedback_count?: number;
  confidence?: string;
  weibull_beta?: number | null;
  weibull_eta?: number | null;
  current_recommendation?: number | null;
  recommendation_reason?: string | null;
  last_analysis_date?: string | null;
  seasonal_enabled?: boolean;
  seasonal_overrides?: Record<number, number> | null;
  // Sensor prediction (Phase 3)
  sensor_prediction_enabled?: boolean;
  environmental_entity?: string | null;
  environmental_attribute?: string | null;
}

export interface IntervalAnalysis {
  average_actual?: number | null;
  ewa_prediction?: number | null;
  weibull_beta?: number | null;
  weibull_eta?: number | null;
  weibull_r_squared?: number | null;
  data_points?: number;
  reason?: string | null;
  seasonal_factor?: number | null;
  seasonal_factors?: number[] | null;
  seasonal_reason?: string | null; // "learned" | "manual"
  confidence_interval_low?: number | null;
  confidence_interval_high?: number | null;
}

/** Nested recurrence object (schedule-model v2). The flat fields above remain
 *  for the interval/one_time kinds; the calendar kinds (weekdays / nth_weekday /
 *  day_of_month) can only be expressed here. weekday: 0=Mon … 6=Sun. */
export interface TaskSchedule {
  kind: string; // interval | weekdays | nth_weekday | day_of_month | one_time | manual
  every?: number | null;
  unit?: string;
  anchor?: string;
  due_date?: string | null;
  weekdays?: number[];
  nth?: number;       // 1..5, or -1 = last
  weekday?: number;
  day?: number;       // 1..31, or -1 = last day of the month (#83)
  months?: number[];
  /** (#83) day_of_month only: roll a weekend date back to Friday. */
  business?: boolean;
  /** (#83) shift the computed occurrence by ±N days (clamped ±15). */
  offset?: number;
  /** Seasonal active window — months (1..12) the task may be due in. */
  season_months?: number[];
  /** Finite-series end condition: after N completions and/or past a date. */
  ends?: { count?: number; until?: string };
}

export interface MaintenanceTask {
  id: string;
  name: string;
  type: string; // "cleaning" | "inspection" | "replacement" | "calibration" | "service" | "reading" | "custom"
  enabled: boolean;
  /** #150: false = the skip lock — Skip hidden everywhere, server refuses. */
  allow_skip?: boolean;
  schedule_type: string; // "time_based" | "sensor_based" | "one_time" | "manual" | calendar kind
  interval_days?: number | null;
  interval_unit?: string; // "days" | "weeks" | "months" | "years"
  due_date?: string | null; // one-time task due date (ISO)
  interval_anchor?: "completion" | "planned";
  schedule?: TaskSchedule; // nested recurrence (calendar kinds read this)
  schedule_time?: string | null;  // "HH:MM" or null/undefined = midnight
  warning_days: number;
  last_performed?: string | null;
  notes?: string | null;
  documentation_url?: string | null;
  checklist?: string[];
  /** #73: in-cycle ticks ({item text: bool}); persists server-side, resets on
   *  complete/skip. */
  checklist_progress?: Record<string, boolean>;
  labels?: string[];
  assignee_pool?: string[];
  rotation_strategy?: string | null;
  /** Details this task demands on completion (v2.44): notes/cost/duration/photo/user. */
  required_completion_fields?: string[];
  earliest_completion_days?: number | null;
  // v1.3.0: completion-action + quick-complete (gated by completion_actions feature)
  on_complete_action?: {
    service: string;                          // "domain.service"
    target?: { entity_id?: string | string[]; device_id?: string | string[]; area_id?: string | string[] };
    data?: Record<string, unknown>;
  } | null;
  quick_complete_defaults?: {
    notes?: string;
    cost?: number;
    duration?: number;
    feedback?: "needed" | "not_needed";
  } | null;
  trigger_config?: TriggerConfig | null;
  trigger_entity_info?: TriggerEntityInfo | null;
  trigger_entity_infos?: TriggerEntityInfo[] | null;
  /** Battery Fleet: the single aggregate task renders the battery section. */
  battery_fleet_task?: boolean;
  /** LIST payloads carry only the most recent window (payload diet) — the
   *  task detail fetches the full record via `task/history`. */
  history: HistoryEntry[];
  /** Total entries that exist, including those beyond the list window. */
  history_count?: number;
  // Computed
  status: string; // "ok" | "due_soon" | "overdue" | "triggered" | "archived"
  /** True for a one-time task that has been completed (done; never re-arms). */
  is_done?: boolean;
  /** v2.10.0 archive: archived = archived_at != null; reason is manual|auto|object. */
  archived?: boolean;
  archived_at?: string | null;
  archived_reason?: string | null;
  days_until_due?: number | null;
  next_due?: string | null;
  /** Per-occurrence postpone: the ISO date the current cycle was deferred to. */
  due_override?: string | null;
  trigger_active: boolean;
  trigger_current_value?: number | null;
  trigger_current_delta?: number | null;
  trigger_baseline_value?: number | null;
  trigger_entity_state?: string;
  times_performed: number;
  total_cost: number;
  average_duration?: number | null;
  // Adaptive scheduling
  adaptive_config?: AdaptiveConfig | null;
  suggested_interval?: number | null;
  interval_confidence?: string | null;
  interval_analysis?: IntervalAnalysis | null;
  // Seasonal scheduling (top-level convenience)
  seasonal_factor?: number | null;
  seasonal_factors?: number[] | null;
  // Sensor-driven predictions (Phase 3)
  degradation_rate?: number | null;
  degradation_trend?: string | null; // "rising" | "falling" | "stable" | "insufficient_data"
  degradation_r_squared?: number | null;
  /** How many prior service cycles the degradation rate learned from
   *  (sawtooth sensors); 0 = current window only. */
  prediction_cycles?: number;
  days_until_threshold?: number | null;
  threshold_prediction_date?: string | null;
  threshold_prediction_confidence?: string | null; // "low" | "medium" | "high"
  environmental_factor?: number | null;
  environmental_entity?: string | null;
  environmental_correlation?: number | null;
  sensor_prediction_urgency?: boolean;
  // User assignment
  responsible_user_id?: string | null;
  custom_icon?: string | null;
  nfc_tag_id?: string | null;
  /** Proof of presence: completion only via NFC/QR scan on the thing. */
  require_tag_scan?: boolean;
  /** Number of documents linked to this task (paperclip badge on the row). */
  document_count?: number;
  /** v2.20 (#83): display unit for `reading`-type tasks ("kWh", "m³", ...). */
  reading_unit?: string | null;
  /** #161 phase 2: reading slots ([] = single value with reading_unit). */
  readings?: ReadingSlot[] | null;
  priority?: string | null;
  entity_slug?: string | null;
  // Auto-derived sensor + binary_sensor entity_ids (since 1.0.45)
  sensor_entity_id?: string | null;
  binary_sensor_entity_id?: string | null;
  /** Spare parts consumed by completing this task. */
  consumes_parts?: TaskPartLink[] | null;
  /** Present on an auto-created "buy" reminder: the owning part. */
  part_ref?: { part_id: string } | null;
  /** Task phases (#139): cyclic content rotation on one shared cadence. */
  phases?: Record<string, TaskPhaseDef> | null;
  phase_sequence?: string[] | null;
  phase_cursor?: number;
  /** Backend-resolved phase currently due (null for phase-less tasks). */
  current_phase?: { id: string; name: string; index: number; count: number } | null;
}

/** One phase definition (#139). A set field OVERRIDES the task-level field
 *  for completions performed while this phase is due; unset falls through. */
export interface TaskPhaseDef {
  name: string;
  notes?: string;
  checklist?: string[];
  consumes_parts?: TaskPartLink[];
  required_completion_fields?: string[];
}

/** One entry of a task's `consumes_parts`.
 *
 *  `entry_id` ABSENT = the part belongs to the task's own object. That is what
 *  every link written before #111 looks like and what is still written for own
 *  parts — nothing emits an entry_id for them. PRESENT = the task draws on a
 *  stock pool owned by that other object (three vacuums, one box of dust bags),
 *  and completing the task decrements the other object's stock.
 */
export interface TaskPartLink {
  part_id: string;
  quantity: number;
  entry_id?: string;
}

/** A spare part / consumable on an object (full definition + derived state). */
export interface MaintenancePart {
  id: string;
  name: string;
  mpn?: string;
  gtin?: string | null;
  vendor?: string;
  storage_location?: string;
  product_url?: string;
  notes?: string;
  unit?: string;
  cost?: number | null;
  reorder_threshold?: number | null;
  restock_quantity?: number | null;
  auto_buy_task?: boolean;
  doc_id?: string | null;
  /** Tracked on-hand count; null = catalog-only (not tracked). */
  stock?: number | null;
  /** Derived: tracked stock at/below the reorder threshold. */
  is_low?: boolean;
  /** Derived: product_url or the configured shopping-search link. */
  shopping_url?: string;
}

export interface MaintenanceObjectResponse {
  entry_id: string;
  object: MaintenanceObject;
  tasks: MaintenanceTask[];
  parts?: MaintenancePart[];
}

export interface StatisticsResponse {
  total_objects: number;
  total_tasks: number;
  overdue: number;
  due_soon: number;
  triggered: number;
  total_cost: number;
  budget?: { currency_symbol?: string } | null;
}

/** A saved filter view: the panel task-list's filter/sort/group state, named
 * and shared across users. Mirrors helpers/saved_views.py. */
export interface SavedViewFilters {
  status: string;
  user_id: string | null;
  /** Only tasks carrying this label (v2.26); null = no label filter. */
  label?: string | null;
  /** Only tasks of this priority (#134): low|normal|high; "" = no filter. */
  priority?: string;
  archived: boolean;
  sort_mode: string;
  group_by: string;
}

export interface SavedView {
  id: string;
  name: string;
  filters: SavedViewFilters;
}

export interface CardConfig {
  type: string;
  title?: string;
  /** #145: how the row's Complete action looks. Omit to follow the global
   *  "Task row actions" setting (buttons unless the household chose icons). */
  action_style?: "icons" | "buttons";
  show_header?: boolean;
  max_items?: number;
  filter_status?: string[];
  filter_objects?: string[];
  // HA-native entity_ids: pattern (since 1.0.45). When set, only tasks whose
  // sensor or binary_sensor entity_id matches one of these are shown. Combines
  // additively with filter_status / filter_objects.
  entity_ids?: string[];
  // Range filter on task.days_until_due (since 1.7.0). Inclusive on both
  // ends. Used by the dashboard strategy's group_by=due_date buckets:
  //   Today:      min=0, max=0
  //   This Week:  min=1, max=7
  //   This Month: min=8, max=30
  //   Later:      min=31
  //   Overdue:    max=-1
  // Tasks with null/undefined days_until_due (e.g. sensor-triggered without
  // a computed next_due) are excluded when either bound is set.
  filter_due_min_days?: number;
  filter_due_max_days?: number;
  compact?: boolean;
  show_actions?: boolean;
  // Whose turn is it (v2.43): show the task's responsible user on each row.
  // Defaults to ON — with rotations the row is the only place a household
  // sees who is up next. Rows without an assignee simply render nothing.
  show_assignee?: boolean;
  // Labels to limit the card to (v2.44). A task passes when it carries at
  // least one of them — same OR semantics as filter_status / filter_objects.
  filter_labels?: string[];
  // Priorities to limit the card to (#134): low|normal|high. Same OR
  // semantics; a task without an explicit priority counts as "normal".
  filter_priority?: string[];
  // HA area ids to limit the card to (C8). A task passes when its parent
  // OBJECT sits in one of these areas — same OR semantics as filter_objects,
  // and ANDed with every other filter. Objects without an area never match a
  // non-empty list. Empty / unset = no area filtering.
  filter_areas?: string[];
  // Show the task's linked documents (and its documentation link) as chips
  // on the row, so the manual is one tap away. Defaults to ON; rows without
  // a document render nothing extra.
  show_documents?: boolean;
  // Saved-view scope (v2.26): apply a saved view's task-selecting filters
  // (status / user / label) ON TOP of the card's own filters. The view's
  // sort/group dimensions are panel display state and are not applied here.
  // A deleted view id degrades to "no view filter" instead of an empty card.
  view_id?: string;
}

export interface GroupTaskRef {
  entry_id: string;
  task_id: string;
}

export interface MaintenanceGroup {
  name: string;
  description: string;
  task_refs: GroupTaskRef[];
}

export interface BudgetStatus {
  monthly_budget: number;
  monthly_spent: number;
  yearly_budget: number;
  yearly_spent: number;
  alert_threshold_pct: number;
  currency_symbol: string;
}

export interface AdvancedFeatures {
  adaptive: boolean;
  predictions: boolean;
  seasonal: boolean;
  environmental: boolean;
  budget: boolean;
  groups: boolean;
  checklists: boolean;
  schedule_time: boolean;
  /** v1.3.0: gates per-task on_complete_action + quick_complete_defaults UI. */
  completion_actions: boolean;
}

/** A single point in a recorder statistics time series. */
export interface StatisticsPoint {
  ts: number;       // epoch ms
  val: number;      // mean (threshold) or state (counter)
  min?: number;
  max?: number;
}

/** Cached statistics result for a single entity. */
export interface EntityStatisticsCache {
  entityId: string;
  fetchedAt: number;
  period: "hour" | "day";
  points: StatisticsPoint[];
}

/** Shape of a single row from HA recorder/statistics_during_period response */
export interface HAStatisticsRow {
  start: number;    // epoch ms
  end: number;
  mean?: number | null;
  min?: number | null;
  max?: number | null;
  state?: number | null;
  sum?: number | null;
}

// Flatten task with parent object info for table display
export interface TaskRow {
  entry_id: string;
  task_id: string;
  object_name: string;
  task_name: string;
  type: string;
  schedule_type: string;
  status: string;
  days_until_due: number | null;
  next_due: string | null;
  trigger_active: boolean;
  trigger_current_value: number | null;
  trigger_current_delta: number | null;
  trigger_baseline_value?: number | null;
  trigger_config: TriggerConfig | null;
  trigger_entity_info: TriggerEntityInfo | null;
  times_performed: number;
  total_cost: number;
  interval_days: number | null;
  interval_unit?: string | null;
  interval_anchor: "completion" | "planned" | null;
  is_done: boolean;
  archived: boolean;
  history: HistoryEntry[];
  enabled: boolean;
  /** #150: false = skip locked for this task. */
  allow_skip: boolean;
  nfc_tag_id: string | null;
  priority: string;
  labels: string[];
  area_id: string | null;
  responsible_user_id: string | null;
  group_names: string[];
}

// HomeAssistant type (minimal for our needs)
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

export interface HomeAssistant {
  connection: {
    // Result defaults to `any` (home-assistant-js-websocket ergonomics):
    // call sites annotate `<T>` where the shape matters.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendMessagePromise<Result = any>(msg: Record<string, unknown>): Promise<Result>;
    subscribeMessage(
      callback: (msg: unknown) => void,
      subscribeMsg: Record<string, unknown>,
      options?: Record<string, unknown>
    ): Promise<() => void>;
  };
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>
  ): Promise<void>;
  states: Record<string, HassEntity>;
  areas?: Record<string, { area_id: string; name: string; icon?: string | null }>;
  /**
   * HA service registry, mirroring the structure exposed to the frontend.
   * Used by the task-dialog action section to drive ha-service-picker
   * (autocomplete) + ha-form (schema-driven data fields).
   */
  services?: Record<string, Record<string, {
    name?: string;
    description?: string;
    target?: Record<string, unknown>;
    fields?: Record<string, {
      name?: string;
      description?: string;
      required?: boolean;
      example?: unknown;
      default?: unknown;
      selector?: Record<string, unknown>;
    }>;
  }>>;
  language: string;
  // date_format/time_format are HA's per-user PROFILE settings ("language" |
  // "system" | "DMY" | "MDY" | "YMD" resp. "language" | "system" | "12" | "24")
  // — issue #97: dates must follow them, not just the UI language.
  locale?: { language: string; number_format?: string; date_format?: string; time_format?: string };
  /** Server config — country (#140) feeds the "language"-default date
   *  format ("en" + AU → en-AU → DD/MM/YYYY). */
  config?: { country?: string | null };
  localize(key: string, ...args: unknown[]): string;
  user?: { id: string; name: string; is_admin: boolean; is_owner: boolean };
  /** Current access token — used for authenticated `fetch()` to our HTTP
   *  document views (a WebSocket frame can't carry a multipart file upload). */
  auth?: { data?: { access_token?: string } };
}

export interface HAUser {
  id: string;
  name: string;
  /** #169 follow-up: avatar (override or derived), sent to every caller. */
  initials?: string;
  color?: string;
  // Only returned to admin callers of users/list; absent for non-admins.
  is_admin?: boolean;
  is_owner?: boolean;
}
