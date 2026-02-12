/** TypeScript interfaces for the Maintenance Supporter frontend. */

export interface MaintenanceObject {
  id: string;
  name: string;
  area_id?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  installation_date?: string | null;
}

export interface TriggerConfig {
  entity_id?: string;
  attribute?: string | null;
  type?: string; // "threshold" | "counter" | "state_change"
  trigger_above?: number | null;
  trigger_below?: number | null;
  trigger_for_minutes?: number;
  trigger_target_value?: number;
  trigger_delta_mode?: boolean;
  trigger_baseline_value?: number | null;
  trigger_from_state?: string | null;
  trigger_to_state?: string | null;
  trigger_target_changes?: number;
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

export interface MaintenanceTask {
  id: string;
  name: string;
  type: string; // "cleaning" | "inspection" | "replacement" | "calibration" | "service" | "custom"
  enabled: boolean;
  schedule_type: string; // "time_based" | "sensor_based" | "manual"
  interval_days?: number | null;
  warning_days: number;
  last_performed?: string | null;
  notes?: string | null;
  documentation_url?: string | null;
  checklist?: string[];
  trigger_config?: TriggerConfig | null;
  trigger_entity_info?: TriggerEntityInfo | null;
  history: HistoryEntry[];
  // Computed
  status: string; // "ok" | "due_soon" | "overdue" | "triggered"
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
}

export interface CardConfig {
  type: string;
  title?: string;
  show_header?: boolean;
  max_items?: number;
  filter_status?: string[];
  filter_objects?: string[];
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
  history: HistoryEntry[];
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
    sendMessagePromise(msg: Record<string, unknown>): Promise<unknown>;
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
  language: string;
  locale?: { language: string; number_format?: string };
  localize(key: string, ...args: unknown[]): string;
}
