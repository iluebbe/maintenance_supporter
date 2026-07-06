"""Constants for the Maintenance Supporter integration."""

from __future__ import annotations

import re
from enum import StrEnum

from homeassistant.const import Platform

DOMAIN = "maintenance_supporter"


def slugify_object_name(name: str) -> str:
    """Convert an object name to a safe slug for use in unique IDs.

    Replaces any non-alphanumeric character with underscore, collapses
    consecutive underscores, and strips leading/trailing underscores.
    """
    return re.sub(r"_+", "_", re.sub(r"[^a-z0-9]", "_", name.lower())).strip("_")


PLATFORMS: list[Platform] = [
    Platform.SENSOR,
    Platform.BINARY_SENSOR,
    Platform.BUTTON,
    Platform.CALENDAR,
    Platform.TODO,
]

# --- Unique IDs ---
GLOBAL_UNIQUE_ID = "maintenance_supporter_global"

# --- Defaults ---
DEFAULT_WARNING_DAYS = 7
DEFAULT_INTERVAL_DAYS = 30
DEFAULT_UPDATE_INTERVAL_MINUTES = 5
DEFAULT_MAX_HISTORY_ENTRIES = 500
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
# v2.10.4 (#69 follow-up): the sidebar panel is the integration's hub — the
# auto-dashboard's "Open Maintenance panel" button, QR codes, and notifications
# all link to /maintenance-supporter. With the panel off those links 404, so it
# now defaults ON. An explicit opt-out (panel_enabled: false in options) is
# still honoured. Read this default everywhere instead of inlining the literal.
DEFAULT_PANEL_ENABLED = True
CONF_PANEL_TITLE = "panel_title"

# --- Config Keys: Advanced Feature Visibility ---
CONF_ADVANCED_ADAPTIVE = "advanced_adaptive_visible"
CONF_ADVANCED_PREDICTIONS = "advanced_predictions_visible"
CONF_ADVANCED_SEASONAL = "advanced_seasonal_visible"
CONF_ADVANCED_ENVIRONMENTAL = "advanced_environmental_visible"
CONF_ADVANCED_BUDGET = "advanced_budget_visible"
CONF_ADVANCED_GROUPS = "advanced_groups_visible"
CONF_ADVANCED_CHECKLISTS = "advanced_checklists_visible"
CONF_ADVANCED_SCHEDULE_TIME = "advanced_schedule_time_visible"
# v1.3.0: gates the per-task on_complete_action + quick_complete_defaults
# UI sections in the task dialog, plus the quick_complete chip in the
# Print-QR generator. Default OFF — beginners aren't overwhelmed; data
# still persists if a user toggles the flag off again.
CONF_ADVANCED_COMPLETION_ACTIONS = "advanced_completion_actions_visible"

# Panel-access overrides: HA user IDs who get the full admin panel despite
# not being HA admins. Empty list means only admins see the full panel.
# The allowlist grants create/edit/delete ONLY when CONF_OPERATOR_WRITE_ENABLED
# is also on; with it off (the default) listed users get read-only access.
CONF_ADMIN_PANEL_USER_IDS = "admin_panel_user_ids"

# v2.8.4: master switch for operator write delegation. Default OFF → only HA
# admins may create/edit/delete and the panel-access allowlist is read-only.
# When True, allowlisted non-admins additionally gain full content CRUD. Only
# admins can flip it (panel Settings tab / config-flow Panel Access step, both
# admin-gated), preserving the escalation boundary in helpers/permissions.py.
CONF_OPERATOR_WRITE_ENABLED = "operator_write_enabled"

# (#67): objects-table column configuration for the panel All-Objects view
# (table mode). Global setting holding the ordered list of object columns to
# show. Selectable from KNOWN_OBJECT_TABLE_COLUMNS only — known object fields,
# never arbitrary state attributes.
CONF_OBJECTS_TABLE_COLUMNS = "objects_table_columns"

# v2.21: template-gallery curation — ids of built-in templates the admin has
# hidden from the "From template" pickers (panel gallery + config flow). The
# templates stay functional (direct WS calls still work); they are only
# removed from the pickers so a growing catalog never clutters the UI.
CONF_DISABLED_TEMPLATE_IDS = "disabled_template_ids"

# Every column key the objects table can render. The Settings UI offers exactly
# these; the WS update handler drops anything outside this set.
KNOWN_OBJECT_TABLE_COLUMNS = [
    "name",
    "manufacturer",
    "model",
    "serial_number",
    "installation_date",
    "warranty_expiry",
    "area_id",
    "documentation_url",
    "notes",
    "task_count",
    "actions",
]

# Default column set + order when the user hasn't customised it. Mirrors the
# locked design: Name · Manufacturer · Model · Serial · Installed · Warranty ·
# Area · Tasks · link (documentation_url + notes are opt-in extras).
DEFAULT_OBJECTS_TABLE_COLUMNS = [
    "name",
    "manufacturer",
    "model",
    "serial_number",
    "installation_date",
    "warranty_expiry",
    "area_id",
    "task_count",
    "actions",
]

# --- Vacation mode (v1.2.0) ---
# When active, suppresses notifications for non-exempt tasks across the
# vacation window plus an N-day buffer (so a task that comes due the day
# of return doesn't immediately fire).
CONF_VACATION_ENABLED = "vacation_enabled"
CONF_VACATION_START = "vacation_start"  # ISO date "YYYY-MM-DD"
CONF_VACATION_END = "vacation_end"  # ISO date
CONF_VACATION_BUFFER_DAYS = "vacation_buffer_days"
CONF_VACATION_EXEMPT_TASK_IDS = "vacation_exempt_task_ids"
DEFAULT_VACATION_BUFFER_DAYS = 3

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

# Shared HH:MM or HH:MM:SS time pattern (0–23 h, 0–59 m/s) — the single source
# for validating quiet-hours times in BOTH the options flow and the WS handler.
TIME_HHMMSS_PATTERN = re.compile(r"^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$")

# --- Config Keys: Notification Limits ---
CONF_MAX_NOTIFICATIONS_PER_DAY = "max_notifications_per_day"

# --- Config Keys: Notification Bundling ---
CONF_NOTIFICATION_BUNDLING_ENABLED = "notification_bundling_enabled"
CONF_NOTIFICATION_BUNDLE_THRESHOLD = "notification_bundle_threshold"

# --- Config Keys: Notification Title (v1.4.0 #44) ---
# How to format the notification title.
#   "default"     — generic per-status title (e.g. "Maintenance overdue!"). Backwards-compatible.
#   "object_name" — use the object name as the title (helps when phone stacks notifications).
#   "task_name"   — use the task name as the title.
CONF_NOTIFICATION_TITLE_STYLE = "notification_title_style"
NOTIFICATION_TITLE_STYLES = ("default", "object_name", "task_name")

# --- Config Keys: Notification Actions ---
CONF_ACTION_COMPLETE_ENABLED = "action_complete_enabled"
CONF_ACTION_SKIP_ENABLED = "action_skip_enabled"
CONF_ACTION_SNOOZE_ENABLED = "action_snooze_enabled"
CONF_SNOOZE_DURATION_HOURS = "snooze_duration_hours"

# v2.15.0: opt-in weekly digest — a single Monday-morning summary notification.
CONF_WEEKLY_DIGEST_ENABLED = "weekly_digest_enabled"
CONF_WARRANTY_REMINDER_ENABLED = "warranty_reminder_enabled"
CONF_WARRANTY_REMINDER_DAYS = "warranty_reminder_days"
DEFAULT_WARRANTY_REMINDER_DAYS = 30
# Multiple lead-time reminders: list of days-before-due at which an extra
# reminder fires (e.g. [14, 3, 0]). Empty = feature off (single warning_days
# threshold behaviour unchanged). Checked by a daily tick, not the
# status-change path.
CONF_REMINDER_LEAD_DAYS = "reminder_lead_days"
MAX_REMINDER_LEADS = 10

# --- Panel ---
PANEL_NAME = "maintenance-supporter"
PANEL_TITLE = "Maintenance"
PANEL_ICON = "mdi:wrench-clock"
PANEL_URL = "/maintenance_supporter_panel"
CARD_URL = "/maintenance_supporter_card"
# v2.3.4 (issue #52): strategy is now a multi-file split bundle. The entry
# URL has to live UNDER a directory prefix so the entry's relative
# ./chunks/X.js dynamic imports resolve to /<prefix>/chunks/X.js. Pre-2.3.4
# users had a flat URL — old dashboards still load fine because the strategy
# is identified by ``custom:maintenance-supporter`` (a logical name resolved
# via window.customStrategies), not by URL.
STRATEGY_DIR_URL = "/maintenance_supporter_strategy"
STRATEGY_URL = f"{STRATEGY_DIR_URL}/maintenance-dashboard-strategy.js"
STRATEGY_CHUNKS_URL = f"{STRATEGY_DIR_URL}/chunks"
# v2.8.1 (strategy timeout fix): a tiny zero-import shim is what we register as
# the frontend extra-module-url. It defines the dashboard-strategy element
# synchronously (winning HA's 5 s whenDefined race under heavy plugin load) and
# lazy-imports the full STRATEGY_URL bundle on first use. The bundle's own
# relative ./chunks/* imports still resolve because it is served under
# STRATEGY_DIR_URL. The shim has no relative imports, so a flat URL is fine.
STRATEGY_SHIM_URL = "/maintenance_supporter_strategy_shim.js"
CALENDAR_CARD_URL = "/maintenance_supporter_calendar_card"
# Runtime-loaded UI translations (frontend/locales/<lang>.json), served as a
# directory so the panel/card fetch the active language on demand. Mirrors
# LOCALES_BASE in frontend-src/styles.ts: only EN is bundled into the JS (as the
# fallback); the other languages live here, so a translation edit needs no
# frontend bundle rebuild.
LOCALES_URL = "/maintenance_supporter_locales"

# --- Config Keys: Object ---
CONF_OBJECT = "object"
CONF_OBJECT_NAME = "name"
CONF_OBJECT_AREA = "area_id"
CONF_OBJECT_MANUFACTURER = "manufacturer"
CONF_OBJECT_MODEL = "model"
CONF_OBJECT_SERIAL_NUMBER = "serial_number"
CONF_OBJECT_INSTALLATION_DATE = "installation_date"
# (#67): per-object warranty expiry date (ISO YYYY-MM-DD) for asset tracking
CONF_OBJECT_WARRANTY_EXPIRY = "warranty_expiry"
# v1.4.0 (#43): per-object link to PDF manual / vendor page
CONF_OBJECT_DOCUMENTATION_URL = "documentation_url"
# v1.4.10 (#46): per-object free-form notes (part numbers, procedures, etc.)
CONF_OBJECT_NOTES = "notes"

# --- Config Keys: Task ---
CONF_TASKS = "tasks"
CONF_TASK_NAME = "name"
CONF_TASK_TYPE = "type"
CONF_TASK_ENABLED = "enabled"
CONF_TASK_INTERVAL_DAYS = "interval_days"
CONF_TASK_WARNING_DAYS = "warning_days"
CONF_TASK_LAST_PERFORMED = "last_performed"
CONF_TASK_SCHEDULE_TYPE = "schedule_type"
CONF_TASK_INTERVAL_UNIT = "interval_unit"
CONF_TASK_DUE_DATE = "due_date"
CONF_TASK_NOTES = "notes"
CONF_TASK_DOCUMENTATION_URL = "documentation_url"
CONF_TASK_ICON = "custom_icon"
CONF_TASK_NFC_TAG = "nfc_tag_id"
# v2.20 (#83): display unit for `reading`-type tasks ("kWh", "m³", ...).
CONF_TASK_READING_UNIT = "reading_unit"
MAX_READING_UNIT_LENGTH = 32
CONF_TASK_INTERVAL_ANCHOR = "interval_anchor"
CONF_TASK_SCHEDULE_TIME = "schedule_time"
CONF_TASK_PRIORITY = "priority"
# Config-flow-only field: comma-separated labels text, parsed into the
# persisted ``labels`` list by the task-base handler.
CONF_TASK_LABELS_TEXT = "labels_text"
CONF_TASK_ASSIGNEE_POOL = "assignee_pool"
CONF_TASK_ROTATION_STRATEGY = "rotation_strategy"

# Rotation strategies for shared tasks: advance the "currently responsible"
# pointer on each completion. None/"" = no rotation (single-assignee behaviour).
ROTATION_STRATEGIES = ("round_robin", "least_completed", "random")
MAX_ASSIGNEE_POOL = 25

# --- Config Keys: User Assignment ---
CONF_RESPONSIBLE_USER_ID = "responsible_user_id"

# --- Config Keys: Trigger ---
CONF_TRIGGER_CONFIG = "trigger_config"
CONF_TRIGGER_TYPE = "trigger_type"
CONF_TRIGGER_ENTITY = "trigger_entity"
CONF_TRIGGER_ENTITY_IDS = "entity_ids"
CONF_TRIGGER_ENTITY_LOGIC = "entity_logic"
CONF_TRIGGER_STATE = "_trigger_state"
CONF_COMPOUND_LOGIC = "compound_logic"
CONF_COMPOUND_CONDITIONS = "conditions"
DEFAULT_ENTITY_LOGIC = "any"
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
CONF_TRIGGER_RUNTIME_HOURS = "trigger_runtime_hours"
CONF_TRIGGER_ON_STATES = "trigger_on_states"

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
CONF_BUDGET_CURRENCY = "budget_currency"

BUDGET_CURRENCIES: dict[str, str] = {
    "EUR": "€",
    "USD": "$",
    "GBP": "£",
    "JPY": "¥",
    "CHF": "Fr",
    "CAD": "C$",
    "AUD": "A$",
    "CNY": "¥",
    "INR": "₹",
    "BRL": "R$",
    "CZK": "Kč",
    "PLN": "zł",
    "RUB": "₽",
    "SEK": "kr",
    "NOK": "kr",
    "DKK": "kr",
    "UAH": "₴",
}

# Default currency when the user hasn't chosen one. Its symbol is derived from
# BUDGET_CURRENCIES so the two never disagree.
DEFAULT_BUDGET_CURRENCY = "EUR"

# --- Archive & Retention (v2.10.0) ---
# Global int settings (panel-managed via WS, like objects_table_columns):
#   archive_oneoff_days          — auto-archive a completed one-off this many days
#                                  after completion. 0 = disabled (manual only).
#   delete_archived_oneoff_days  — auto-delete an AUTO-archived one-off this many
#                                  days after it was archived. 0 = never. Manual
#                                  archives are NEVER auto-deleted (delete stays explicit).
CONF_ARCHIVE_ONEOFF_DAYS = "archive_oneoff_days"
CONF_DELETE_ARCHIVED_ONEOFF_DAYS = "delete_archived_oneoff_days"
DEFAULT_ARCHIVE_ONEOFF_DAYS = 14
DEFAULT_DELETE_ARCHIVED_ONEOFF_DAYS = 0  # 0 = never

# Per-task/object `archived_reason` values (stored alongside `archived_at`).
# Drives two policies: only AUTO is eligible for auto-delete; only OBJECT is
# undone by an object unarchive cascade (MANUAL/AUTO survive it).
ARCHIVE_REASON_MANUAL = "manual"
ARCHIVE_REASON_AUTO = "auto"
ARCHIVE_REASON_OBJECT = "object"

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
# v1.3.0: completion lifecycle events. Fired by coordinator after the
# state mutation has persisted. Power users wire HA automations on these;
# the integration's own action_listener also subscribes to the COMPLETED
# event to dispatch the per-task on_complete_action service-call.
EVENT_TASK_COMPLETED = f"{DOMAIN}_task_completed"
EVENT_TASK_SKIPPED = f"{DOMAIN}_task_skipped"
EVENT_TASK_RESET = f"{DOMAIN}_task_reset"

# --- Service Names ---
SERVICE_COMPLETE = "complete"
SERVICE_RESET = "reset"
SERVICE_SKIP = "skip"
SERVICE_EXPORT = "export_data"
SERVICE_ADD_OBJECT = "add_object"
SERVICE_ADD_TASK = "add_task"
SERVICE_UPDATE_TASK = "update_task"
SERVICE_DELETE_TASK = "delete_task"
SERVICE_LIST_TASKS = "list_tasks"


class MaintenanceStatus(StrEnum):
    """Status of a maintenance task."""

    OK = "ok"
    DUE_SOON = "due_soon"
    OVERDUE = "overdue"
    TRIGGERED = "triggered"
    # v2.10.0: highest-precedence status. An archived task/object is retired but
    # retained — it reads `archived`, fires nothing, and counts for nothing
    # except budget/cost history (which is read from completion history, not
    # status, so it is archive-agnostic by design).
    ARCHIVED = "archived"
    # v2.20 (journey N3): seasonal pause. Tasks of a paused OBJECT read
    # `paused`: schedules freeze and nothing fires — but unlike archived the
    # object stays a first-class citizen in every view. Resuming re-anchors
    # recurring tasks like an object unarchive does. Object-wide only (no
    # per-task pause); injected by the coordinator, below ARCHIVED in
    # precedence.
    PAUSED = "paused"


class MaintenanceTypeEnum(StrEnum):
    """Type/category of maintenance."""

    CLEANING = "cleaning"
    INSPECTION = "inspection"
    REPLACEMENT = "replacement"
    CALIBRATION = "calibration"
    SERVICE = "service"
    # Record a value / take a reading (meter readings, level checks, spot
    # measurements) — requested in Discussion #83, generalised beyond meters.
    READING = "reading"
    CUSTOM = "custom"


class ScheduleType(StrEnum):
    """How a task is scheduled."""

    TIME_BASED = "time_based"
    SENSOR_BASED = "sensor_based"
    MANUAL = "manual"
    ONE_TIME = "one_time"


# Schedule kinds expressed by the FLAT recurrence fields (interval/due_date),
# as opposed to the nested calendar kinds (weekdays/nth_weekday/day_of_month)
# or a sensor trigger. Used to decide flat-vs-calendar handling on task edit.
FLAT_SCHEDULE_TYPES = frozenset({ScheduleType.TIME_BASED, ScheduleType.ONE_TIME, ScheduleType.MANUAL})


class TriggerType(StrEnum):
    """Type of sensor trigger."""

    THRESHOLD = "threshold"
    COUNTER = "counter"
    STATE_CHANGE = "state_change"
    RUNTIME = "runtime"
    COMPOUND = "compound"


class TaskPriority(StrEnum):
    """Priority level of a maintenance task."""

    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"


# The default when a task doesn't specify a priority.
DEFAULT_TASK_PRIORITY = TaskPriority.NORMAL


class HistoryEntryType(StrEnum):
    """Type of history entry."""

    COMPLETED = "completed"
    SKIPPED = "skipped"
    MISSED = "missed"
    RESET = "reset"
    TRIGGERED = "triggered"
    TRIGGER_REMOVED = "trigger_removed"
    TRIGGER_REPLACED = "trigger_replaced"


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


# --- Dispatcher Signals ---
SIGNAL_TASK_RESET = f"{DOMAIN}_task_reset_{{entry_id}}_{{task_id}}"
SIGNAL_NEW_OBJECT_ENTRY = f"{DOMAIN}_new_object_entry"
SIGNAL_OBJECT_ENTRY_REMOVED = f"{DOMAIN}_object_entry_removed"
# Fired by the DocumentStore after any metadata/blob change so the storage
# sensor (and any other listener) can refresh without polling.
SIGNAL_DOCUMENTS_UPDATED = f"{DOMAIN}_documents_updated"

# --- Trigger Completion Cooldown ---
TRIGGER_COMPLETION_COOLDOWN_SECONDS = 600  # 10 minutes
# Household double-complete window: two people tapping Complete on the same
# task within this many seconds count as ONE real-world action (journey M1).
# Short on purpose — a deliberate complete → reset → complete-again correction
# flow must never be caught by it.
MANUAL_COMPLETION_DEDUP_SECONDS = 30

# --- Input Validation Limits ---
MAX_NAME_LENGTH = 200
MAX_TEXT_LENGTH = 2000  # notes, reason, feedback, description
MAX_URL_LENGTH = 2048
MAX_ICON_LENGTH = 100  # "mdi:icon-name"
MAX_META_LENGTH = 200  # manufacturer, model, user_id, area_id, etc.
MAX_PANEL_TITLE_LENGTH = 50  # sidebar panel title override
MAX_TYPE_LENGTH = 50  # task_type, schedule_type
MAX_CHECKLIST_ITEMS = 100
MAX_CHECKLIST_ITEM_LENGTH = 500
MAX_LABELS = 25  # cross-cutting tags per task
MAX_LABEL_LENGTH = 40  # single label/tag
MAX_GROUP_TASK_REFS = 200
MAX_ID_LENGTH = 64  # entry_id, task_id, group_id (uuid hex = 32)
MAX_DATE_LENGTH = 20  # ISO 8601 date strings (e.g. 2026-04-21)
MAX_ENTITY_ID_LENGTH = 255  # HA entity_id max
MAX_ENTITY_SLUG_LENGTH = 64  # task entity_slug
MAX_INTERVAL_DAYS = 3650  # 10 years — caps date arithmetic overflow
MAX_IMPORT_PAYLOAD_BYTES = 1_048_576  # 1 MB for csv_content / json_content
MAX_SCHEDULE_TIME_LENGTH = 5  # "HH:MM"

# --- Trigger Entity Availability ---
STARTUP_GRACE_PERIOD_SECONDS = 300  # 5 minutes
MISSING_ENTITY_THRESHOLD_REFRESHES = 6  # ~30 min at 5-min intervals
