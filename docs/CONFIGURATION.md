# Configuration Parameters

Complete reference for all configurable parameters in Maintenance Supporter. Parameters are organized by the UI flow in which they appear.

All configuration is done through the Home Assistant UI — there is no YAML configuration.

---

## Global Settings

Accessible via **Settings > Devices & Services > Maintenance Supporter > Configure** (the global entry), or via the **Settings tab** in the sidebar panel.

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
| `advanced_groups_visible` | bool | `false` | Show task grouping management section in the panel with create / edit / delete controls |
| `advanced_checklists_visible` | bool | `false` | Show checklist editing per task |
| `advanced_schedule_time_visible` | bool | `false` | Expose the `schedule_time` (HH:MM) field on time-based tasks. When off, the coordinator strips stored times before computing status so tasks revert to midnight semantics (but retain the stored value for re-enable) |
| `advanced_completion_actions_visible` | bool | `false` | (1.3.0+) Expose the `on_complete_action` (HA service-call) and `quick_complete_defaults` sections in the task dialog, plus the new `quick_complete` QR action. When off, existing values stay persisted but the UI hides them — beginners aren't confronted with service-call YAML |

> **Operator mode (read-only end-user view, 1.0.44+)** is not a global flag — it's derived from the HA user role plus an explicit per-user override list:
>
> - **Admins** (and the HA owner) always see the full panel.
> - **Non-admin** users see Operator mode by default — only `Complete` and `Skip` on each task; Settings tab + every create/edit/delete control hidden.
> - Admins can grant non-admin users full panel access by adding their HA user IDs to the `admin_panel_user_ids` list. This is editable through:
>   - the panel's **Settings → Panel Access** section (multi-checkbox with all non-admin users), or
>   - HA Settings → Devices & services → Maintenance Supporter → Configure → **Panel Access**.
>
> If a listed user is later deleted in HA, an "orphaned panel-access user" repair issue appears with a one-click `Remove from list` action. The issue clears automatically when the id is removed or the user is recreated.

| Setting key | Type | Default | Description |
|---|---|---|---|
| `admin_panel_user_ids` | list[string] | `[]` | HA user UUIDs (max 50, each ≤64 chars) granted full panel access despite not being HA admins. Empty list = only admins see full panel. |

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

Also exposed: a **"Send test"** button next to the notify service field. It calls `maintenance_supporter/global/test_notification` and surfaces the backend message as a toast — useful for verifying the notify service without waiting for a real due event.

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
| `serial_number` | string | `""` | Serial number (shown in device info, redacted in diagnostics) |
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
| `schedule_time` | string (HH:MM) | *(none)* | `00:00–23:59` | Optional time-of-day at which the task flips from `due_soon` to `overdue` on the due date. Requires the `advanced_schedule_time_visible` feature flag. Available on `time_based` tasks only. Interpreted in HA's configured timezone. Empty/unset → midnight semantic (historical behaviour). |
| `warning_days` | int | 7 | 1–365 | Days before due date when status changes to `due_soon` |
| `last_performed` | date | *(none)* | — | Date the task was last completed. When unset, `next_due` is anchored on `created_at` (set to today on creation), so the task transitions to OVERDUE after `interval_days` instead of being due "today" forever. |
| `created_at` | date | *(today on create)* | — | Anchor date for `next_due` when `last_performed` is unset. Set automatically; serialized in ConfigEntry. Migrated from earliest history timestamp for pre-v1.0.34 entries. |
| `notes` | string | `""` | — | General notes about the task |
| `documentation_url` | string | `""` | — | URL to external documentation or manual |
| `responsible_user_id` | string | `""` | — | HA user ID of the person responsible for this task |

### Checklist

Available when `advanced_checklists_visible` is enabled globally. Checklists are ordered lists of steps that must be checked off during task completion. Editable both in the **panel task dialog** (textarea, one step per line) and in the **Integration Options** per-task Edit Checklist step.

| Parameter | Type | Description |
|-----------|------|-------------|
| `checklist` | list[string] | Ordered list of step descriptions (max 100 items, 500 chars/item) |

### Time-of-day Scheduling

Available when `advanced_schedule_time_visible` is enabled globally. Applies to `time_based` tasks only. Editable in the **panel task dialog** (HH:MM picker directly under "Interval anchor") and in the **Integration Options** per-task Edit Task step.

**Behaviour:**
- On the due date, the task flips from `due_soon` to `overdue` at the configured `HH:MM` in HA's configured timezone (instead of at midnight).
- Coordinator refresh cadence is 5 minutes, so the status change lands between `HH:MM` and `HH:MM+5min`.
- Calendar events become 30-minute timed blocks starting at `HH:MM` (instead of all-day), so mobile calendar apps can fire reminders.

**Off-behaviour:** When the feature flag is toggled **off**, the coordinator strips `schedule_time` before computing status — tasks revert to the legacy midnight semantic. The stored value stays on disk and re-applies the moment the flag is toggled back on.

**Composing a weekday pattern** (no extra feature required):

| Field | Value | Why |
|---|---|---|
| Task creation date | desired weekday (e.g. Tuesday) | `created_at` anchors the first `next_due` on the same weekday |
| `interval_days` | `7` | Weekly recurrence |
| `schedule_time` | `"19:00"` (any HH:MM) | Sub-day transition to OVERDUE |
| `interval_anchor` | `planned` | Anchors from the previously *planned* due date, so a late completion on Wednesday doesn't drag the next cycle into Wednesday territory — the task stays on Tuesdays |

With `interval_anchor = completion` (the default), the schedule drifts whenever you complete late. Pick the anchor based on whether staying on a specific weekday matters more than guaranteeing a full interval between completions.

### Completion Actions (1.3.0+)

Available when `advanced_completion_actions_visible` is enabled globally. Configured per task in the **task dialog** under two collapsible sections.

**On-complete action** — fires an HA service call when the task is completed (any path: manual, complete-QR, quick-complete, mobile action). Failures are logged and swallowed; never blocks the completion from being recorded.

| Parameter | Type | Description |
|-----------|------|-------------|
| `on_complete_action.service` | string | HA service in `domain.name` form (regex `[a-z][a-z0-9_]*\.[a-z0-9_]+`, max 100 chars). Examples: `light.turn_on`, `notify.mobile_app_phone`, `counter.increment` |
| `on_complete_action.target` | dict | Optional HA target. Supported keys: `entity_id`, `device_id`, `area_id`, `label_id`, `floor_id`. Each value is a string or list of strings (max 200 chars per entry, max 50 entries per list) |
| `on_complete_action.data` | dict | Optional service data. Capped at 1 KB JSON-serialised. Anything not JSON-serialisable is dropped |

**Test button** — fires the configured action immediately so you can verify the wiring. Doesn't persist anything; result indicator (✓ / ✗) auto-clears after 3 s.

**Stale-entity repair** — coordinator scans `on_complete_action.target.entity_id` on every refresh. If the entity disappears, a repair issue surfaces with two options: **Replace** (pick a new entity via HA's entity picker) or **Remove** (drop the action entirely). Same lifecycle as the existing trigger-entity repair flow.

**Quick-complete defaults** — pre-fills the values used when the user scans the new lightning-bolt `quick_complete` QR code. Schema mirrors `complete_maintenance(...)` kwargs.

| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| `quick_complete_defaults.notes` | string | ≤ 1000 chars | Notes to record |
| `quick_complete_defaults.cost` | float | 0–1,000,000 | Cost to record |
| `quick_complete_defaults.duration` | int (minutes) | 0–525,600 | Duration to record |
| `quick_complete_defaults.feedback` | enum | `needed` / `not_needed` | Adaptive scheduling feedback |

If a task has **no** `quick_complete_defaults`, scanning a `quick_complete` QR routes back to the regular complete dialog (`no_defaults` error → frontend fallback) — the QR is never a dead-end.

### Adaptive Scheduling

Available when `advanced_adaptive_visible` is enabled globally. Configured per task via the **Adaptive Scheduling** menu option.

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `adaptive_enabled` | bool | `false` | — | Enable adaptive interval learning for this task |
| `ewa_alpha` | float | 0.3 | 0.1–0.9 | EWA smoothing factor. Higher = more weight on recent intervals |
| `min_interval_days` | int | 7 | 1–365 | Floor for adaptive interval recommendations |
| `max_interval_days` | int | 365 | 1–3650 | Ceiling for adaptive interval recommendations |
| `sensor_prediction_enabled` | bool | `false` | — | Enable sensor degradation analysis from recorder data |
| `environmental_entity` | string | `""` | — | Entity ID of an environmental sensor (temperature, humidity) for correlation analysis. Editable in the **task dialog** for sensor-based tasks; persisted via `maintenance_supporter/task/set_environmental_entity`. |
| `environmental_attribute` | string | `""` | — | Attribute name if monitoring an attribute instead of the entity state |
| `seasonal_overrides` | dict | `{}` | month 1–12 → 0.1–5.0 | Manual per-month factor overrides. Editable via the "Edit seasonal factors" dialog opened below the seasonal chart; persisted via `maintenance_supporter/task/seasonal_overrides`. Empty = learned from history. |

**On-demand analysis:** The recommendation card has a **Re-analyze** button (v1.0.35+) that calls `maintenance_supporter/task/analyze_interval` and returns the current Weibull/EWA/seasonal result — useful to refresh the view without waiting for the next coordinator cycle.

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

## Lovelace Card Config (`custom:maintenance-supporter-card`)

The card is WS-driven (subscribes to `maintenance_supporter/subscribe`) so it always reflects the current task state without polling. All config keys are optional — empty / unset means "show all".

| Key | Type | Default | Description |
|---|---|---|---|
| `title` | string | `"Maintenance"` (i18n) | Card header |
| `show_header` | bool | `true` | Show the count badges (Overdue / Due Soon / Triggered) |
| `show_actions` | bool | `true` | Show the "Complete" button on each task row |
| `compact` | bool | `false` | Hide task metadata (interval, last performed) |
| `max_items` | int | `0` (unlimited) | Cap on the number of tasks shown |
| `filter_status` | string[] | `[]` | Show only tasks whose `status` is in the list. Values: `overdue`, `triggered`, `due_soon`, `ok` |
| `filter_objects` | string[] | `[]` | Show only tasks whose parent object name is in the list |
| `entity_ids` | string[] | `[]` | **(1.0.45+)** HA-native filter — show only tasks whose `sensor_entity_id` or `binary_sensor_entity_id` matches. Combines additively with the other filters. |

**Adding the card from the picker (1.0.45+)** auto-populates `filter_status: ["overdue", "triggered", "due_soon"]` and `max_items: 10` so the new card immediately shows the actionable subset rather than every task.

**Visual editor** lets you set all of the above without touching YAML — status chip-row, object multi-checkbox-list, HA-native entity-multi-picker.

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
