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
  /** v1.4.0 (#43): optional link to PDF manual / vendor page for the object */
  documentation_url?: string | null;
  /** v1.4.10 (#46): free-form notes — part numbers, procedures, etc. */
  notes?: string | null;
  /** v2.10.0 archive: archived (retire-but-retain) state; archived = archived_at != null. */
  archived?: boolean;
  archived_at?: string | null;
  /** (roadmap P2) number of attached documents (files + web-links); drives the
   *  objects-table paperclip badge. Computed server-side, not persisted. */
  document_count?: number;
}

export interface TriggerConfig {
  entity_id?: string;
  entity_ids?: string[];
  entity_logic?: "any" | "all";
  attribute?: string | null;
  type?: string; // "threshold" | "counter" | "state_change" | "runtime"
  trigger_above?: number | null;
  trigger_below?: number | null;
  trigger_for_minutes?: number;
  trigger_target_value?: number;
  trigger_delta_mode?: boolean;
  trigger_baseline_value?: number | null;
  trigger_from_state?: string | null;
  trigger_to_state?: string | null;
  trigger_target_changes?: number;
  trigger_runtime_hours?: number;
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
  photo_doc_id?: string | null;
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
  day?: number;       // 1..31
  months?: number[];
}

export interface MaintenanceTask {
  id: string;
  name: string;
  type: string; // "cleaning" | "inspection" | "replacement" | "calibration" | "service" | "reading" | "custom"
  enabled: boolean;
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
  labels?: string[];
  assignee_pool?: string[];
  rotation_strategy?: string | null;
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
  history: HistoryEntry[];
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
  priority?: string | null;
  entity_slug?: string | null;
  // Auto-derived sensor + binary_sensor entity_ids (since 1.0.45)
  sensor_entity_id?: string | null;
  binary_sensor_entity_id?: string | null;
}

export interface MaintenanceObjectResponse {
  entry_id: string;
  object: MaintenanceObject;
  tasks: MaintenanceTask[];
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

export interface CardConfig {
  type: string;
  title?: string;
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
  locale?: { language: string; number_format?: string };
  localize(key: string, ...args: unknown[]): string;
  user?: { id: string; name: string; is_admin: boolean; is_owner: boolean };
  /** Current access token — used for authenticated `fetch()` to our HTTP
   *  document views (a WebSocket frame can't carry a multipart file upload). */
  auth?: { data?: { access_token?: string } };
}

export interface HAUser {
  id: string;
  name: string;
  // Only returned to admin callers of users/list; absent for non-admins.
  is_admin?: boolean;
  is_owner?: boolean;
}
