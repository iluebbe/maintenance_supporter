# Configuration Parameters

Complete reference for all configurable parameters in Maintenance Supporter. Parameters are organized by the UI flow in which they appear.

All configuration is done through the Home Assistant UI — there is no YAML configuration.

---

## Global Settings

Accessible via **Settings > Devices & Services > Maintenance Supporter > Configure** (the global entry).

### General Settings

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `default_warning_days` | int | 7 | 1–365 | Days before a task is due when its status changes to `due_soon` |
| `notifications_enabled` | bool | `false` | — | Master toggle for the notification system |
| `notify_service` | string | `""` | — | Notification service to use (e.g., `notify.mobile_app_phone`). Auto-prepends `notify.` if omitted |
| `panel_enabled` | bool | `false` | — | Show the Maintenance Supporter sidebar panel. Takes effect immediately |

### Advanced Feature Visibility

These toggles control which advanced feature sections appear in the UI. Disabling a feature hides its configuration but does not delete existing data.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `advanced_adaptive_visible` | bool | `false` | Show adaptive scheduling options per task |
| `advanced_predictions_visible` | bool | `false` | Show sensor degradation prediction options |
| `advanced_seasonal_visible` | bool | `false` | Show seasonal scheduling adjustment options |
| `advanced_environmental_visible` | bool | `false` | Show environmental correlation options |
| `advanced_budget_visible` | bool | `false` | Show budget tracking settings and dashboard |
| `advanced_groups_visible` | bool | `false` | Show task grouping management |
| `advanced_checklists_visible` | bool | `false` | Show checklist editing per task |

### Notification Settings

Visible only when `notifications_enabled` is `true`.

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `notify_due_soon_enabled` | bool | `true` | — | Send notifications for tasks entering `due_soon` status |
| `notify_due_soon_interval_hours` | int | 24 | 0–168 | Minimum hours between repeated due-soon notifications per task. 0 = notify once |
| `notify_overdue_enabled` | bool | `true` | — | Send notifications for tasks entering `overdue` status |
| `notify_overdue_interval_hours` | int | 12 | 0–168 | Minimum hours between repeated overdue notifications per task. 0 = notify once |
| `notify_triggered_enabled` | bool | `true` | — | Send notifications when a sensor trigger activates |
| `notify_triggered_interval_hours` | int | 0 | 0–168 | Minimum hours between repeated triggered notifications per task. 0 = notify once |
| `quiet_hours_enabled` | bool | `true` | — | Suppress notifications during quiet hours |
| `quiet_hours_start` | time | `22:00` | — | Start of quiet hours (HH:MM) |
| `quiet_hours_end` | time | `08:00` | — | End of quiet hours (HH:MM) |
| `max_notifications_per_day` | int | 0 | 0–100 | Maximum notifications per day across all tasks. 0 = unlimited |
| `notification_bundling_enabled` | bool | `false` | — | Bundle multiple due tasks into a single notification |
| `notification_bundle_threshold` | int | 2 | 2–20 | Minimum pending tasks before bundling activates |

### Notification Actions

Mobile actionable notification buttons (requires HA Companion App).

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `action_complete_enabled` | bool | `false` | — | Show "Complete" action button on notifications |
| `action_skip_enabled` | bool | `false` | — | Show "Skip" action button on notifications |
| `action_snooze_enabled` | bool | `false` | — | Show "Snooze" action button on notifications |
| `snooze_duration_hours` | int | 4 | 1–72 | Hours to snooze a task when the Snooze action is used |

### Budget Settings

Visible only when `advanced_budget_visible` is `true`.

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `budget_monthly` | float | 0.0 | 0–100,000 | Monthly maintenance budget. 0 = disabled |
| `budget_yearly` | float | 0.0 | 0–1,000,000 | Yearly maintenance budget. 0 = disabled |
| `budget_alerts_enabled` | bool | `false` | — | Send notification when budget threshold is reached |
| `budget_alert_threshold` | int | 80 | 10–100 | Budget usage percentage that triggers an alert |

---

## Per-Object Settings

Each maintenance object is a separate config entry. Accessible via **Settings > Devices & Services > Maintenance Supporter > [Object Name] > Configure > Object Settings**.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | string | *(required)* | Display name of the maintenance object |
| `area_id` | string | `""` | Home Assistant area to associate the object with |
| `manufacturer` | string | `""` | Manufacturer name (shown in device info) |
| `model` | string | `""` | Model name (shown in device info) |
| `installation_date` | date | `""` | Date the object was installed or purchased |

---

## Per-Task Settings

Tasks are created within an object's options flow via **Add Task** or managed via **Manage Tasks**.

### Basic Task Fields

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `name` | string | *(required)* | — | Display name of the task |
| `type` | enum | `custom` | — | Category: `cleaning`, `inspection`, `replacement`, `calibration`, `service`, `custom` |
| `enabled` | bool | `true` | — | Whether the task is active. Disabled tasks always show `ok` |
| `schedule_type` | enum | `time_based` | — | Scheduling mode: `time_based`, `sensor_based`, `manual` |
| `interval_days` | int | 30 | 1–3650 | Days between maintenance cycles (time-based and sensor-based) |
| `interval_anchor` | enum | `completion` | — | How the next due date is computed: `completion` (from completion date) or `planned` (from planned date, prevents schedule drift) |
| `warning_days` | int | 7 | 1–365 | Days before due date when status changes to `due_soon` |
| `last_performed` | date | *(today)* | — | Date the task was last completed |
| `notes` | string | `""` | — | General notes about the task |
| `documentation_url` | string | `""` | — | URL to external documentation or manual |
| `responsible_user_id` | string | `""` | — | HA user ID of the person responsible for this task |

### Checklist

Available when `advanced_checklists_visible` is enabled globally. Checklists are ordered lists of steps that must be checked off during task completion.

| Parameter | Type | Description |
|-----------|------|-------------|
| `checklist` | list[string] | Ordered list of step descriptions |

### Adaptive Scheduling

Available when `advanced_adaptive_visible` is enabled globally. Configured per task via the **Adaptive Scheduling** menu option.

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `adaptive_enabled` | bool | `false` | — | Enable adaptive interval learning for this task |
| `ewa_alpha` | float | 0.3 | 0.1–0.9 | EWA smoothing factor. Higher = more weight on recent intervals |
| `min_interval_days` | int | 7 | 1–365 | Floor for adaptive interval recommendations |
| `max_interval_days` | int | 365 | 1–3650 | Ceiling for adaptive interval recommendations |
| `sensor_prediction_enabled` | bool | `false` | — | Enable sensor degradation analysis from recorder data |
| `environmental_entity` | string | `""` | — | Entity ID of an environmental sensor (temperature, humidity) for correlation analysis |
| `environmental_attribute` | string | `""` | — | Attribute name if monitoring an attribute instead of the entity state |

**Adaptive thresholds** (not directly configurable — determined by history depth):

| Feature | Minimum History |
|---------|----------------|
| EWA smoothing | 2 completions |
| Adaptive suggestions shown | 3 completions |
| Weibull reliability analysis | 5 completions |
| Seasonal adjustment | 6 months of data across different months |

---

## Trigger Configuration

Triggers are configured per task when `schedule_type` is `sensor_based` or when adding a trigger to any task. Configured via **Edit Trigger** in the task action menu.

### Shared Trigger Fields

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `trigger_entity` / `entity_ids` | string / list | *(required)* | One or more entity IDs to monitor |
| `trigger_attribute` | string | `""` | Monitor a specific attribute instead of the entity state |
| `trigger_type` | enum | *(required)* | Trigger type: `threshold`, `counter`, `state_change`, `runtime`, `compound` |
| `entity_logic` | enum | `any` | Multi-entity aggregation: `any` (one entity suffices) or `all` (all must match) |

### Threshold Trigger

Activates when a sensor value crosses above or below a limit.

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `trigger_above` | float | *(none)* | — | Trigger when value exceeds this threshold |
| `trigger_below` | float | *(none)* | — | Trigger when value falls below this threshold |
| `trigger_for_minutes` | int | 0 | 0–1440 | Minutes the condition must hold before triggering (debounce). 0 = immediate |

At least one of `trigger_above` or `trigger_below` must be set.

### Counter Trigger

Activates when an accumulated value reaches a target.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `trigger_target_value` | float | *(required)* | Target accumulated value to trigger maintenance |
| `trigger_delta_mode` | bool | `false` | If `true`, counts the change since last completion. If `false`, uses absolute value |

### State Change Trigger

Activates after a specified number of state transitions.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `trigger_from_state` | string | `""` | Source state to count transitions from (empty = any state) |
| `trigger_to_state` | string | `""` | Target state to count transitions to (empty = any state) |
| `trigger_target_changes` | int | *(required)* | Number of transitions before triggering |

### Runtime Trigger

Activates after accumulated operating hours reach a target.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `trigger_runtime_hours` | float | *(required)* | Target accumulated hours before triggering |
| `trigger_on_states` | list[string] | `["on"]` | Entity states considered "running" (e.g., `["on", "running", "active"]`) |

Runtime hours are persisted every 5 minutes and survive restarts. Up to 5 minutes of runtime may be lost on an unclean shutdown.

### Compound Trigger

Combines multiple trigger conditions with AND/OR logic.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `compound_logic` | enum | `and` | How to combine conditions: `and` (all must be active) or `or` (any suffices) |
| `conditions` | list | *(required)* | List of trigger conditions, each with its own type, entity, and parameters |

Each condition in the list is a complete trigger configuration (entity, type, type-specific parameters). Nested compound triggers are not supported.

---

## Constants & Internal Defaults

These values are not user-configurable but affect behavior:

| Constant | Value | Description |
|----------|-------|-------------|
| Coordinator refresh interval | 5 min | Periodic status recomputation |
| Startup grace period | 5 min | Time before marking entities as unavailable after HA start |
| Missing entity threshold | 6 refreshes (~30 min) | Refreshes before creating a repair issue for unavailable entities |
| Max history entries per task | 50 | Oldest entries auto-pruned when exceeded |
| Runtime persistence interval | 5 min | How often accumulated runtime hours are saved to config entry |
| Weibull reliability target | 90% | Reliability level used for Weibull interval recommendations |
| Seasonal factor range | 0.3x – 3.0x | Floor and ceiling for seasonal interval multipliers |
| Environmental factor range | 0.5x – 2.0x | Floor and ceiling for environmental adjustment factors |
| Environmental correlation minimum | |r| >= 0.3 | Pearson correlation threshold before applying environmental adjustment |
| Degradation min data points | 10 | Minimum hourly recorder data points for regression analysis |
| Budget alert rate limit | 24 hours | Minimum interval between repeated budget alerts |
