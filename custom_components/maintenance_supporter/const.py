"""Constants for the Maintenance Supporter integration."""

from __future__ import annotations

from enum import StrEnum

from homeassistant.const import Platform

DOMAIN = "maintenance_supporter"
PLATFORMS: list[Platform] = [Platform.SENSOR, Platform.CALENDAR]

# --- Unique IDs ---
GLOBAL_UNIQUE_ID = "maintenance_supporter_global"

# --- Defaults ---
DEFAULT_WARNING_DAYS = 7
DEFAULT_INTERVAL_DAYS = 30
DEFAULT_UPDATE_INTERVAL_MINUTES = 5
DEFAULT_MAX_HISTORY_ENTRIES = 50
DEFAULT_SNOOZE_DURATION_HOURS = 4
DEFAULT_MAX_NOTIFICATIONS_PER_DAY = 0  # 0 = unlimited

# --- Adaptive Scheduling Defaults ---
DEFAULT_ADAPTIVE_EWA_ALPHA = 0.3
DEFAULT_ADAPTIVE_MIN_INTERVAL = 7
DEFAULT_ADAPTIVE_MAX_INTERVAL = 365
DEFAULT_ADAPTIVE_MIN_COMPLETIONS = 3  # Before showing suggestions
DEFAULT_ADAPTIVE_WEIBULL_MIN = 5  # Before fitting Weibull
DEFAULT_ADAPTIVE_RELIABILITY_TARGET = 0.9  # 90% for Weibull

# --- Seasonal Scheduling Defaults ---
DEFAULT_SEASONAL_MIN_DATA = 6  # Min intervals across all months before seasonal adjustment
DEFAULT_SEASONAL_FACTOR_MIN = 0.3  # Floor: never less than 30% of base interval
DEFAULT_SEASONAL_FACTOR_MAX = 3.0  # Ceiling: never more than 300% of base interval

# --- Hemisphere-aware Season Mapping ---
NORTHERN_SEASONS: dict[str, list[int]] = {
    "spring": [3, 4, 5],
    "summer": [6, 7, 8],
    "fall": [9, 10, 11],
    "winter": [12, 1, 2],
}
SOUTHERN_SEASONS: dict[str, list[int]] = {
    "spring": [9, 10, 11],
    "summer": [12, 1, 2],
    "fall": [3, 4, 5],
    "winter": [6, 7, 8],
}

# --- Config Keys: Global ---
CONF_DEFAULT_WARNING_DAYS = "default_warning_days"
CONF_NOTIFICATIONS_ENABLED = "notifications_enabled"
CONF_NOTIFY_SERVICE = "notify_service"
CONF_PANEL_ENABLED = "panel_enabled"

# --- Config Keys: Notification Per-Status ---
CONF_NOTIFY_DUE_SOON_ENABLED = "notify_due_soon_enabled"
CONF_NOTIFY_DUE_SOON_INTERVAL = "notify_due_soon_interval_hours"
CONF_NOTIFY_OVERDUE_ENABLED = "notify_overdue_enabled"
CONF_NOTIFY_OVERDUE_INTERVAL = "notify_overdue_interval_hours"
CONF_NOTIFY_TRIGGERED_ENABLED = "notify_triggered_enabled"
CONF_NOTIFY_TRIGGERED_INTERVAL = "notify_triggered_interval_hours"

# --- Config Keys: Notification Quiet Hours ---
CONF_QUIET_HOURS_ENABLED = "quiet_hours_enabled"
CONF_QUIET_HOURS_START = "quiet_hours_start"
CONF_QUIET_HOURS_END = "quiet_hours_end"

# --- Config Keys: Notification Limits ---
CONF_MAX_NOTIFICATIONS_PER_DAY = "max_notifications_per_day"

# --- Config Keys: Notification Bundling ---
CONF_NOTIFICATION_BUNDLING_ENABLED = "notification_bundling_enabled"
CONF_NOTIFICATION_BUNDLE_THRESHOLD = "notification_bundle_threshold"

# --- Config Keys: Notification Actions ---
CONF_ACTION_COMPLETE_ENABLED = "action_complete_enabled"
CONF_ACTION_SKIP_ENABLED = "action_skip_enabled"
CONF_ACTION_SNOOZE_ENABLED = "action_snooze_enabled"
CONF_SNOOZE_DURATION_HOURS = "snooze_duration_hours"

# --- Panel ---
PANEL_NAME = "maintenance-supporter"
PANEL_TITLE = "Maintenance"
PANEL_ICON = "mdi:wrench-clock"
PANEL_URL = "/maintenance_supporter_panel"
CARD_URL = "/maintenance_supporter_card"

# --- Config Keys: Object ---
CONF_OBJECT = "object"
CONF_OBJECT_NAME = "name"
CONF_OBJECT_AREA = "area_id"
CONF_OBJECT_MANUFACTURER = "manufacturer"
CONF_OBJECT_MODEL = "model"
CONF_OBJECT_INSTALLATION_DATE = "installation_date"

# --- Config Keys: Task ---
CONF_TASKS = "tasks"
CONF_TASK_NAME = "name"
CONF_TASK_TYPE = "type"
CONF_TASK_ENABLED = "enabled"
CONF_TASK_INTERVAL_DAYS = "interval_days"
CONF_TASK_WARNING_DAYS = "warning_days"
CONF_TASK_LAST_PERFORMED = "last_performed"
CONF_TASK_SCHEDULE_TYPE = "schedule_type"
CONF_TASK_NOTES = "notes"
CONF_TASK_DOCUMENTATION_URL = "documentation_url"

# --- Config Keys: Trigger ---
CONF_TRIGGER_CONFIG = "trigger_config"
CONF_TRIGGER_TYPE = "trigger_type"
CONF_TRIGGER_ENTITY = "trigger_entity"
CONF_TRIGGER_ATTRIBUTE = "trigger_attribute"
CONF_TRIGGER_ABOVE = "trigger_above"
CONF_TRIGGER_BELOW = "trigger_below"
CONF_TRIGGER_FOR_MINUTES = "trigger_for_minutes"
CONF_TRIGGER_TARGET_VALUE = "trigger_target_value"
CONF_TRIGGER_DELTA_MODE = "trigger_delta_mode"
CONF_TRIGGER_BASELINE_VALUE = "trigger_baseline_value"
CONF_TRIGGER_FROM_STATE = "trigger_from_state"
CONF_TRIGGER_TO_STATE = "trigger_to_state"
CONF_TRIGGER_TARGET_CHANGES = "trigger_target_changes"

# --- Config Keys: Adaptive Scheduling ---
CONF_ADAPTIVE_CONFIG = "adaptive_config"
CONF_ADAPTIVE_ENABLED = "adaptive_enabled"
CONF_ADAPTIVE_EWA_ALPHA = "ewa_alpha"
CONF_ADAPTIVE_MIN_INTERVAL = "min_interval_days"
CONF_ADAPTIVE_MAX_INTERVAL = "max_interval_days"

# --- Config Keys: Seasonal Scheduling ---
CONF_SEASONAL_ENABLED = "seasonal_enabled"
CONF_SEASONAL_OVERRIDES = "seasonal_overrides"
CONF_SEASONAL_HEMISPHERE = "seasonal_hemisphere"

# --- Sensor Prediction Defaults (Phase 3) ---
DEFAULT_DEGRADATION_LOOKBACK_DAYS = 30  # Days of recorder data for slope computation
DEFAULT_DEGRADATION_MIN_POINTS = 10  # Min hourly data points to compute regression
DEFAULT_DEGRADATION_SIGNIFICANCE = 0.05  # Min |slope|/mean ratio for rising/falling

# --- Environmental Adjustment Defaults (Phase 3) ---
DEFAULT_ENVIRONMENTAL_LOOKBACK_DAYS = 90  # Days of env data for correlation
DEFAULT_ENVIRONMENTAL_CORRELATION_MIN = 0.3  # Min |r| to apply adjustment
DEFAULT_ENVIRONMENTAL_FACTOR_MIN = 0.5  # Floor for env adjustment
DEFAULT_ENVIRONMENTAL_FACTOR_MAX = 2.0  # Ceiling for env adjustment
DEFAULT_ENVIRONMENTAL_MIN_COMPLETIONS = 3  # Min completions with env data

# --- Config Keys: Sensor Prediction (Phase 3) ---
CONF_SENSOR_PREDICTION_ENABLED = "sensor_prediction_enabled"
CONF_ENVIRONMENTAL_ENTITY = "environmental_entity"
CONF_ENVIRONMENTAL_ATTRIBUTE = "environmental_attribute"

# --- Budget ---
CONF_BUDGET_MONTHLY = "budget_monthly"
CONF_BUDGET_YEARLY = "budget_yearly"
CONF_BUDGET_ALERTS_ENABLED = "budget_alerts_enabled"
CONF_BUDGET_ALERT_THRESHOLD = "budget_alert_threshold"

# --- Groups ---
CONF_GROUPS = "groups"

# --- Checklist ---
CONF_CHECKLIST = "checklist"

# --- History ---
CONF_HISTORY = "history"

# --- Runtime keys (not persisted) ---
RUNTIME_TRIGGER_ACTIVE = "_trigger_active"
RUNTIME_TRIGGER_CURRENT_VALUE = "_trigger_current_value"
RUNTIME_TRIGGER_CHANGE_COUNT = "_trigger_change_count"
RUNTIME_TRIGGER_CURRENT_DELTA = "_trigger_current_delta"

# --- Event Types ---
EVENT_TRIGGER_ACTIVATED = f"{DOMAIN}_trigger_activated"
EVENT_TRIGGER_DEACTIVATED = f"{DOMAIN}_trigger_deactivated"

# --- Service Names ---
SERVICE_COMPLETE = "complete"
SERVICE_RESET = "reset"
SERVICE_SKIP = "skip"
SERVICE_EXPORT = "export_data"


class MaintenanceStatus(StrEnum):
    """Status of a maintenance task."""

    OK = "ok"
    DUE_SOON = "due_soon"
    OVERDUE = "overdue"
    TRIGGERED = "triggered"


class MaintenanceTypeEnum(StrEnum):
    """Type/category of maintenance."""

    CLEANING = "cleaning"
    INSPECTION = "inspection"
    REPLACEMENT = "replacement"
    CALIBRATION = "calibration"
    SERVICE = "service"
    CUSTOM = "custom"


class ScheduleType(StrEnum):
    """How a task is scheduled."""

    TIME_BASED = "time_based"
    SENSOR_BASED = "sensor_based"
    MANUAL = "manual"


class TriggerType(StrEnum):
    """Type of sensor trigger."""

    THRESHOLD = "threshold"
    COUNTER = "counter"
    STATE_CHANGE = "state_change"


class HistoryEntryType(StrEnum):
    """Type of history entry."""

    COMPLETED = "completed"
    SKIPPED = "skipped"
    RESET = "reset"
    TRIGGERED = "triggered"
    TRIGGER_REMOVED = "trigger_removed"


class MaintenanceFeedback(StrEnum):
    """Feedback from user about whether maintenance was needed."""

    NEEDED = "needed"
    NOT_NEEDED = "not_needed"
    NOT_SURE = "not_sure"


class TriggerEntityState(StrEnum):
    """State of a trigger entity from the integration's perspective."""

    AVAILABLE = "available"
    UNAVAILABLE = "unavailable"  # Entity exists but state is unavailable/unknown
    MISSING = "missing"  # Entity does not exist in state machine
    STARTUP = "startup"  # Grace period after HA start


# --- Trigger Entity Availability ---
STARTUP_GRACE_PERIOD_SECONDS = 300  # 5 minutes
MISSING_ENTITY_THRESHOLD_REFRESHES = 6  # ~30 min at 5-min intervals
