# Maintenance Supporter

[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://github.com/hacs/default)
[![GitHub Release](https://img.shields.io/github/v/release/iluebbe/maintenance_supporter)](https://github.com/iluebbe/maintenance_supporter/releases)
[![Tests](https://img.shields.io/badge/tests-2094_passed-brightgreen)](tests/)
[![Coverage](https://img.shields.io/badge/coverage-98%25-brightgreen)](docs/ARCHITECTURE.md#test-coverage)
[![Community Forum](https://img.shields.io/badge/Community-Forum-41BDF5.svg)](https://community.home-assistant.io/t/custom-integration-maintenance-supporter-sensor-triggered-adaptive-maintenance-for-your-home/995556)

A Home Assistant custom integration for tracking and managing maintenance tasks across your devices and equipment. Schedule time-based or sensor-triggered maintenance, get notifications when tasks are due, and keep a complete maintenance history — with adaptive scheduling that learns from your patterns.

> **Not the same as HA's built-in *Maintenance Dashboard* (2026.5+).** That dashboard auto-discovers battery entities and shows low-battery devices grouped by area — narrow scope, zero configuration. *Maintenance Supporter* tracks user-defined maintenance tasks (filter changes, pump service, brake-pad inspections, anything with a schedule or sensor trigger) with history, predictions, calendar, notifications and a Lovelace card. They pair well: HA's built-in handles batteries, this integration handles everything else.

## Preview

| Dashboard | Task Detail | Mobile |
|:-:|:-:|:-:|
| ![Overview](docs/images/overview.png) | ![Task Detail](docs/images/task-detail.png) | ![Mobile](docs/images/mobile-overview.png) |

<details>
<summary>More screenshots</summary>

### Object Detail
![Object Detail](docs/images/object-detail.png)

### Complete Dialog
![Complete Dialog](docs/images/complete-dialog.png)

### Task History
![Task History](docs/images/task-history.png)

### Multi-Entity Trigger
![Multi-Entity Trigger](docs/images/multi-entity-trigger.png)

### Compound Trigger
![Compound Trigger](docs/images/compound-trigger.png)

### QR Codes
![QR Code](docs/images/qr-dialog.png)

### Actionable Notifications
![Actionable Notification](docs/images/notification-actions.png)

### Lovelace Card
![Lovelace Card](docs/images/lovelace-card.png)

### Calendar Tab (panel — 1.5.0+)
![Calendar tab](docs/images/calendar-tab.png)

Window chips (7 / 14 / 30 days, plus *1 year* since 1.5.2), per-event source icon (clock = time-based, trending-up = sensor-based), prediction-confidence pill (green / amber / red, 1.5.1+), and projected recurrences at 55 % opacity.

#### Real vs projected events

![Calendar projection demo](docs/images/calendar-tab-projection-demo.png)

The faded *every 7 days* rows (May 21, 28) are projected — hypothetical future cycles assuming the user stays on schedule. The full-opacity rows (May 22 HVAC amber medium-confidence, May 25 Brake Pad red low-confidence) are real upcoming events sourced from sensor predictions.

### Calendar (HA-native entity, all-time)
![Calendar entity](docs/images/calendar.png)

### Sensor Attributes
![Sensor Attributes](docs/images/entity-attributes.png)

### Configuration
![Configuration](docs/images/config-flow.png)

### Mobile Task Detail
![Mobile Task Detail](docs/images/mobile-task.png)

### On-Complete Action — Service Picker (1.3.1+)
![On-Complete Action — empty state](docs/images/task-dialog-action-section-empty.png)

### On-Complete Action — Schema-Driven Form (1.3.1+)
Pick a service like `light.turn_on` and the data fields render automatically from the service schema (sliders, color pickers, etc.) — no JSON typing.

![On-Complete Action — light.turn_on with ha-form](docs/images/task-dialog-action-form-light.png)

### On-Complete Action — JSON Fallback (1.3.1+)
For services without a schema (e.g. `button.press` or custom integrations), the data field falls back to a JSON textfield.

![On-Complete Action — JSON fallback](docs/images/task-dialog-action-form-fallback.png)

### Quick-Complete Defaults (1.3.0+)
Pre-fill notes/cost/duration/feedback per task. Scanning the lightning-bolt **quick-complete QR** records the completion in one tap, no dialog.

![Quick-Complete Defaults](docs/images/task-dialog-quick-complete-defaults.png)

</details>

## Features

### Task Management
- Create maintenance objects (devices, equipment, appliances) and assign tasks to them
- Six task types: cleaning, inspection, replacement, calibration, service, custom
- Scheduling modes: **time-based** (recurring interval), **calendar recurrence** (specific weekdays, *nth weekday of the month* — e.g. "1st Saturday", or a *day of the month*), **sensor-based** (triggered by entity state), **one-time** (single due date, archived once done), **manual**
- **Interval units**: time-based intervals can be **days, weeks, months or years** — months and years use real calendar arithmetic (last-day clamping, leap years)
- **Calendar recurrence**: pin a task to weekdays (e.g. Mon & Thu), the *nth weekday of the month* (1st–5th or last, e.g. "1st Saturday" for smoke-alarm checks), or a fixed *day of the month* (clamped to the month length)
- Task status tracking: OK, Due Soon, Overdue, Triggered
- **One-time tasks**: schedule a non-recurring job with an explicit due date; completing it archives the task (hidden from the card, shown as *Completed* in the panel)
- **Binary sensor** per task (`device_class: problem`) — ON when overdue or triggered, ideal for HA automations
- **Interval anchoring**: choose between completion-based (default) or planned-date anchoring to prevent schedule drift
- **Time-of-day scheduling** (optional, advanced): tasks flip to OVERDUE at a configured `HH:MM` in HA's timezone instead of at midnight. Calendar events become timed 30-min blocks so mobile calendars can set real reminders. Enable under Settings → Features.
- Assign tasks to responsible Home Assistant users with per-user notification routing
- Custom task icons (any `mdi:*` icon via the HA icon picker)
- NFC tag linking — scan an NFC tag to complete a task
- Checklists for multi-step procedures — editable in the panel task dialog (and in the Integration Options)
- Task grouping for logical organization — **full CRUD UI** (create, edit, delete) with multi-checkbox task selector grouped by object
- **Sort & group-by** in the Tasks/Objects views — sort by due date, area, assigned user, or group; group into collapsible sections by area, group, or user (1.0.44+)
- **Overdue indicator** — object cards show a red dot the moment any of their tasks is overdue (1.0.44+)
- **Quick task creation** — `New Maintenance Task` button on the Tasks view opens the task dialog with an Object selector dropdown, no need to navigate into the parent first (1.0.44+)
- **Operator mode** for non-admin HA users — non-admins get a read-only view (Complete / Skip / QR) so household members can run tasks without changing anything. Admins can **optionally delegate** create/edit/delete to selected non-admins via the **Panel Access** section — off by default, enforced server-side, toggled from the Settings tab or config flow. Orphaned ids surface as a fixable repair issue. Useful for shared/family/hotel setups (1.0.44+; server-enforced + opt-in 2.8.4)
- **Per-object documentation URL** (1.4.0+) — store a link to the PDF manual / vendor page on each object. Shown as a clickable link in the object-detail header *and* on every task-detail page belonging to that object (1.4.1+) so the manual is always one click away from any maintenance task
- **Per-object notes** (1.4.10+) — free-form multiline notes attached to each object: part numbers, replacement procedures, settings reminders, "spare key in garage drawer". Rendered with `white-space: pre-wrap` so newlines and indentation survive intact
- **Calendar tab** (1.5.0+) — rolling-list view of upcoming maintenance with a window chip toggle (**7 / 14 / 30 days, plus "1 year" since 1.5.2**; the year view collapses empty days so only the actually-eventful rows render). Time-based recurring tasks project up to 5 occurrences within the window at 55 % opacity to mark them as "hypothetical assuming you stay on schedule"; sensor-triggered tasks show only their current `next_due` since predicting the next sensor firing would be a guess. Each event row carries (1.5.1+): a small **source icon** — `mdi:clock-outline` for time-based or `mdi:trending-up` (HA primary color) for sensor-based — and, for sensor-based events, a *"predicted · {high|medium|low} confidence"* pill below the title (green / amber / red border) sourced from the `threshold_prediction_confidence` returned by the predictor. Visible in operator mode. Independent of the HA Calendar entity — stays inside the panel for the *"what's due soon?"* glance, with status pills and avg-cost per event
- 13 object templates (car, motorcycle, HVAC, pool, washing machine, etc.)

### Sensor-Based Triggers
- **Threshold**: trigger when a sensor value exceeds or falls below a limit (with optional duration)
- **Counter**: trigger when accumulated value reaches a target (absolute or delta mode)
- **State change**: trigger after a number of state transitions (e.g., on/off cycles)
- **Runtime**: trigger after accumulated operating hours (e.g., 500h of compressor runtime)
- **Compound**: combine multiple conditions with AND/OR logic (e.g., threshold AND runtime)
- Multi-entity support for all trigger types (any/all entity logic)
- **Entity attribute introspection** — trigger setup shows domain-specific attribute suggestions (e.g., `current_temperature` for climate entities)
- Automatic entity availability tracking with grace periods
- Repair issues for missing or unavailable trigger entities (replace / remove / dismiss)

### Adaptive Scheduling
- Learns from your maintenance history using Exponential Weighted Averaging (EWA)
- Weibull reliability analysis for failure prediction (after 5+ completions)
- On-demand **Re-analyze** button (task detail) — shows recommended interval, confidence and data-point count as a toast without having to wait for the next coordinator refresh
- Seasonal awareness with hemisphere detection and per-month multipliers; manual 12-month **seasonal factor override editor** available below the seasonal chart (0.1–5.0 per month, empty = learned)
- Environmental correlation with external sensors (temperature, humidity, etc.) — bound via an entity picker in the task dialog for sensor-based tasks
- Sensor degradation rate analysis and threshold prediction
- User feedback loop (needed / not needed / not sure) to improve recommendations

### Completion Actions (1.3.0+, advanced)
- Per-task **on-complete action** — configure any HA service-call (service + target + data) to run when a task is completed. Failures are logged + swallowed so the completion is always recorded
- **Test button** in the task dialog fires the configured action immediately so you can verify the wiring before saving
- **Quick-complete QR codes** — pre-configure `notes / cost / duration / feedback` per task; the lightning-bolt QR records a completion in one tap, no dialog. Falls back to the regular complete dialog when the task has no defaults
- **Stale-entity repair flow** — if an action's target entity is renamed or removed, a repair issue offers Replace (pick a new entity) or Remove (drop the action)
- The same lifecycle events (`task_completed / _skipped / _reset`) fire on every completion path, so user-written automations can hook in without having to set `on_complete_action` (see Events below)
- All gated behind a feature toggle (Settings → Features → Completion Actions). Default OFF

### Notifications
- Configurable notification service (any `notify.*` service)
- **"Send test" button** in Settings to verify the notify service without having to wait for a real due event
- Per-user notifications for tasks with a responsible user assigned
- Rate limiting per status level (due soon, overdue, triggered)
- Quiet hours support
- Notification bundling (group multiple due tasks into one message)
- Daily notification limits
- Mobile actionable notifications via Companion App: Complete, Skip, Snooze
- **Notification title style** (1.4.0+) — choose what appears as the notification's *title*: per-status text (default), the object name, or the task name. Helps when phones stack notifications and only the title is visible without expanding the stack

### Budget Tracking
- Monthly and yearly maintenance budgets
- Cost tracking per task completion
- Budget alerts at configurable thresholds

### Data Management
- JSON, YAML, and CSV export and import (via WebSocket API and Settings panel)
- QR code generation for mobile quick-actions (print, download SVG)
- Complete maintenance history with cost, duration, and feedback tracking
- Integration diagnostics with PII redaction

### Frontend
- **Sidebar panel** with dashboard overview, object details, task history, analytics, and in-panel **settings editor**
- **Lovelace card** for dashboard integration
- **Calendar** integration with status-emoji events
- **Binary sensor** entities for automation triggers
- **Clickable entity IDs**: entity IDs in trigger sections, compound conditions, and environmental correlations open HA's "More Info" dialog on click
- **Serial number** field on objects — displayed in panel, Device Registry, and export/import
- **Task sorting**: sort by due date, object name, type, or task name (persisted)
- **All Objects view**: clickable KPI card shows all objects including empty ones
- Real-time updates via WebSocket subscription (no polling)
- User filter to show only your assigned tasks
- **Custom sidebar panel title** (2.8.0+) — rename the panel in Settings → Options → General Settings or the panel's Settings tab (blank = default "Maintenance"); avoids clashing with HA's built-in Maintenance dashboard
- Localized UI in **all 13 languages across all three surfaces** (since 1.4.2): English, German, Spanish, French, Italian, Dutch, Portuguese, Russian, Ukrainian, Polish, Czech, Swedish, Simplified Chinese — covers panel UI, HA config-flow + Repairs UI, and phone notification messages

### WebSocket API
- 44 commands for full CRUD operations on objects, tasks, triggers, groups, vacation mode, completion actions, and quick-complete
- Global settings update and test notification via WS
- Real-time subscription for live updates
- User assignment and listing
- Statistics, budget status, and interval analysis
- See [Architecture](docs/ARCHITECTURE.md) for the complete command reference

## Roadmap

Planned and proposed features (multi-assignee rotation, a native to-do entity, multiple per-task reminders, priority levels, and more) live in [ROADMAP.md](ROADMAP.md). Ideas and votes welcome via issues or the [Ideas discussions](https://github.com/iluebbe/maintenance_supporter/discussions).

## Installation

### HACS (Recommended)

Maintenance Supporter is available in the **HACS default store** (since 2026-06-20) — no custom repository needed.

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=iluebbe&repository=maintenance_supporter&category=Integration)

1. Open **HACS**, search for "Maintenance Supporter", and install it — or click the button above to open it directly.
2. Restart Home Assistant

### Manual

1. Copy `custom_components/maintenance_supporter/` to your `config/custom_components/` directory
2. Restart Home Assistant

## Configuration

1. Go to **Settings > Devices & Services > Add Integration**
2. Search for "Maintenance Supporter"
3. Follow the setup wizard to configure global settings
4. Add maintenance objects and tasks through the sidebar panel or config flow

For a complete list of all configurable parameters, see [docs/CONFIGURATION.md](docs/CONFIGURATION.md).

## Supported Functions

### Platforms

- **Sensor** — one entity per maintenance task. State is an enum: `ok`, `due_soon`, `overdue`, `triggered`
- **Binary Sensor** — one entity per maintenance task (`device_class: problem`). ON when overdue or triggered, ideal for HA automations
- **Button** — one-press complete/skip/reset per task (`button.<object>_<task>_complete` / `_skip` / `_reset`)
- **Calendar** — one global entity showing upcoming maintenance events for all tasks

### Sensor Attributes

Each sensor entity exposes attributes grouped by function. Only stable values are exposed as entity attributes (to avoid excessive recorder writes); fast-changing trigger values are served via the WebSocket `subscribe` endpoint instead (see below).

- **Core**: `maintenance_type`, `schedule_type`, `interval_days`, `interval_unit`, `interval_anchor`, `due_date`, `warning_days`, `last_performed`, `next_due`, `days_until_due`, `parent_object`, `times_performed`, `total_cost`, `average_duration`, `notes`, `documentation_url`
- **Trigger** (only when a trigger is configured): `trigger_type`, `trigger_active`, plus type-specific fields (e.g. `trigger_above` / `trigger_below` / `trigger_for_minutes`, `trigger_target_value`, …)
- **Adaptive** (only when adaptive scheduling is enabled): `suggested_interval`, `interval_confidence`, `adaptive_scheduling_enabled`, `seasonal_factor`, `seasonal_reason`
- **Weibull** (after 5+ completions): `weibull_beta`, `weibull_eta`, `weibull_r_squared`, `weibull_beta_interpretation`, `confidence_interval_low`, `confidence_interval_high`

> **Live values via the WebSocket `subscribe` endpoint (not recorded as sensor attributes):** `trigger_current_value`, `trigger_entity_state` (per-entity availability), `degradation_rate`, `environmental_factor`, and other fast-changing trigger/prediction values. The panel and Lovelace card read these from the live subscription.

### Events

- `maintenance_supporter_trigger_activated` — fired when a sensor trigger condition becomes true
- `maintenance_supporter_trigger_deactivated` — fired when a sensor trigger condition clears
- `maintenance_supporter_task_completed` — fired on every completion path (panel, complete-QR, quick-complete, mobile action). Payload: `entry_id`, `task_id`, `task_name`, `object_name`, plus optional `notes`, `cost`, `duration`, `feedback`, `completed_by`
- `maintenance_supporter_task_skipped` — fired when a task is skipped. Payload includes the optional `reason`
- `maintenance_supporter_task_reset` — fired when a task's `last_performed` is reset to a specific date. Payload includes that `date`

### Services

See the [Services](#services) table below for available service calls. For the full WebSocket API (44 commands), see [Architecture — WebSocket API](docs/ARCHITECTURE.md#websocket-api).

## Data Updates

The integration uses a hybrid push/poll update model:

- **Coordinator refresh** — every 5 minutes, recomputes time-based status (due soon, overdue), runs adaptive predictions (Weibull, seasonal), checks budget thresholds, and detects missing entities
- **Trigger sensors** — update immediately when monitored entities change state, via Home Assistant `state_changed` event listeners. No polling delay for sensor-based triggers
- **Frontend** — receives real-time updates via WebSocket subscription (`maintenance_supporter/subscribe`). No browser polling
- **IoT class**: `calculated` — all data is computed locally from HA state and configuration, trigger updates are event-driven

## Uninstalling

1. Go to **Settings > Devices & Services > Maintenance Supporter**
2. Click the three-dot menu on each object entry and the global entry, then select **Delete**
3. Remove the `custom_components/maintenance_supporter/` directory from your HA config folder
4. Restart Home Assistant

> **Note:** Recorder history (entity state history in the HA database) is not automatically removed. To purge it, use the `recorder.purge_entities` service targeting this integration's entities (in the UI you can pick the Maintenance Supporter device or select the entities directly — they follow the `sensor.<object>_<task>` naming described under [Entity naming](#entity-naming)).

## Use Cases

### Car Maintenance — Oil Change by Mileage

Track oil changes using a **counter trigger** in delta mode. Connect to an odometer entity (e.g., from an OBD-II integration) and set a target of 15,000 km. Each time you complete the task, the counter resets and begins accumulating from the current reading. A time-based interval of 365 days runs in parallel as a fallback.

### HVAC Filter Replacement — Airflow Drop Detection

Monitor a filter airflow sensor with a **threshold trigger** set to activate below 60%. Enable **adaptive scheduling** so the integration learns your actual replacement intervals. After 5+ replacements, Weibull analysis provides a reliability-based recommendation — replacing the filter before it degrades enough to trigger.

### Pool Pump — Weekly Pressure Check with Threshold Alert

Combine a time-based schedule (7-day interval for manual pressure checks) with a **threshold trigger** on a pressure sensor that activates above 1.5 bar. The time-based schedule handles routine inspections, while the trigger catches sudden pressure spikes between checks.

### Washing Machine — Descaling Every 50 Cycles

Use a **state change trigger** monitoring a binary sensor that tracks wash cycles (on → off transitions). Set the target to 50 changes. Each completion resets the counter. A parallel time-based interval of 180 days ensures descaling happens even if the machine is used less frequently than expected.

### On-Complete Actions (1.3.0+) — close the loop with the device

When you complete a maintenance task in HA, your *device* often still thinks it's overdue: the Roborock app keeps nagging that the filter needs replacing, the HVAC controller still has the "filter dirty" flag set, the printer's hour counter keeps climbing. With an **on-complete action** the integration can call the device-side reset for you the moment you mark the task done.

Enable the feature under **Settings → Features → Completion actions** (default OFF). Each task then exposes a *Service* picker (autocomplete over your full HA service registry) and a data form that renders from the service schema — no YAML, no copy-pasting from automations.

#### Roborock vacuum — reset filter consumable counter

The Roborock integration exposes `vacuum.send_command` for sending raw RoboROCK commands. To reset the filter consumable counter when you complete the *Replace HEPA filter* task:

| Field | Value |
|---|---|
| **Service** | `vacuum.send_command` |
| **Target** | `vacuum.s7_max_ultra` *(your vacuum entity)* |
| **Command** | `reset_consumable` |
| **Params** | `["filter_work_time"]` |

The mobile-app reset and the HA-side completion now stay in sync. Click *Test* in the dialog before saving to confirm the device responds.

> **Same pattern works for** `["main_brush_work_time"]`, `["side_brush_work_time"]`, `["sensor_dirty_time"]` — one task per consumable, each with its own reset. Or use an HA `script:` that resets all four if you want a single task for "full deep clean".

#### HVAC filter — reset the controller's "filter dirty" button

If your HVAC integration exposes a button entity for the filter-life reset (the original example from issue #41):

| Field | Value |
|---|---|
| **Service** | `button.press` |
| **Target** | `button.lscontrol_dk_reset_filter` *(your HVAC reset button)* |
| **Data** | *(empty — `button.press` takes no params)* |

The data section auto-falls-back to an empty JSON field for `button.press` since the service has no schema.

#### 3D Printer — reset the runtime counter on nozzle replacement

For OctoPrint / Bambu / Klipper users tracking print hours via `counter` or `input_number`:

| Field | Value |
|---|---|
| **Service** | `counter.reset` |
| **Target** | `counter.printer_nozzle_hours` |

When you complete the *Replace nozzle every 500h* task, the counter resets so the next 500h cycle starts cleanly.

#### Water filter — toggle the "fresh filter" status indicator

If you've wired a `light` or `switch` (e.g. an LED ring) as a visual status indicator:

| Field | Value |
|---|---|
| **Service** | `light.turn_on` |
| **Target** | `light.water_filter_status_ring` |
| **Data** *(rendered from schema)* | `brightness_pct: 80`, `rgb_color: [0, 255, 0]` *(fresh-green)* |

After 30 days another automation flips the same light to red — and now your physical indicator and the HA task status agree.

#### Pure event-driven — for power users who prefer YAML automations

You don't *have* to set `on_complete_action`. Every completion (panel button, complete-QR, quick-complete-QR, mobile action) fires the integration event `maintenance_supporter_task_completed`. Wire your own automation:

```yaml
automation:
  - alias: "Reset Roborock filter on task complete"
    trigger:
      - platform: event
        event_type: maintenance_supporter_task_completed
        event_data:
          task_name: "Replace HEPA filter"
    action:
      - service: vacuum.send_command
        target:
          entity_id: vacuum.s7_max_ultra
        data:
          command: reset_consumable
          params: ["filter_work_time"]
```

The event approach is more flexible (template conditions, multiple actions, delay/wait, etc.); the per-task field is the no-YAML shortcut for the common case.

### Quick-Complete QR (1.3.0+) — record completion in one tap

For tasks where the *act* of doing the maintenance is the input (no notes to type, no cost to enter), pre-fill the values once on the task and print a **lightning-bolt QR code** instead of the regular check-mark one.

Example for a **filter swap on the Roborock vacuum**: stick the lightning-bolt QR inside the dust-bin lid. Each filter replacement is just *swap → close lid → scan QR with phone* and the completion is recorded with your pre-set notes / cost / duration / *needed* feedback. No dialog, no typing. Great for high-frequency manual chores (litter-box scoop log, plant-watering log, espresso-machine-descale, HVAC quick-vacuum).

If you forget to pre-fill the defaults, the QR scan falls back to the normal complete dialog so you're never stuck.

### Object documentation URL (1.4.0+) — keep the manual within reach

Each object can carry a link to its PDF manual / vendor page / setup guide. Set it once via *Edit Object → Manual / documentation URL* (right under *Serial number*). The link then renders as a clickable line in:

- **the object detail page** (between the serial number and installation date)
- **every task detail page** belonging to that object (1.4.1+, distinguished by the book icon and the object name in parentheses, e.g. *Manual (Roborock S7)*)

Real-world fit: you're staring at the *Filter replacement* task on your phone, ready to do the work — one click and the actual PDF (or Roborock support article) opens in your browser. No more "where did I save that link" search. Combine with **Per-object NFC tag scan** for full hands-free flow: scan tag → task page opens → tap manual.

URL safety: only `http://` and `https://` URLs are accepted; `javascript:`, `data:`, and protocol-relative URLs are silently rejected.

### Notification title style (1.4.0+) — distinguish stacked notifications at a glance

When your phone stacks multiple HA notifications, only the title is visible without expanding the stack. The default per-status title (*"Maintenance overdue!"*) makes a stack of overdue alerts collapse to one indistinguishable line — you can't tell which device needs attention without tapping.

**Settings → Notification settings → Notification title style** offers three options:

| Choice | Title shown on the phone | Best for |
|---|---|---|
| `default` | "Maintenance overdue!" / "Maintenance triggered" / etc. | Backwards-compatible — keep this if any of your HA automations filter on the existing title strings |
| `object_name` | The maintenance object's name (e.g. *Pool Pump*) | Most users — at a glance you know *which device* needs work |
| `task_name` | The task's name (e.g. *Filter cleaning*) | Useful when one object has many distinct tasks and you want to know what kind of maintenance |

Bundled notifications (multiple due tasks for the same object) honour `object_name`. `task_name` doesn't map cleanly for multi-task bundles, so those keep the count-based default.

## Examples

### Automation: Notify on Overdue Task

```yaml
automation:
  - alias: "Notify when maintenance is overdue"
    trigger:
      - platform: state
        entity_id: sensor.family_car_oil_change
        to: "overdue"
    action:
      - service: notify.mobile_app_phone
        data:
          title: "Maintenance Overdue"
          message: >
            {{ state_attr('sensor.family_car_oil_change', 'friendly_name') }}
            is overdue by {{ state_attr('sensor.family_car_oil_change', 'days_until_due') | abs }} days.
```

### Service Call: Complete a Task with Details

```yaml
service: maintenance_supporter.complete
data:
  entity_id: sensor.hvac_system_filter_replacement
  notes: "Replaced with HEPA filter model XYZ-400"
  cost: 45.99
  duration: 30
```

### Automation: Handle Mobile Notification Actions

```yaml
automation:
  - alias: "Handle maintenance notification actions"
    trigger:
      - platform: event
        event_type: mobile_app_notification_action
    condition:
      - condition: template
        value_template: "{{ trigger.event.data.action.startswith('MS_') }}"
    action:
      - service: notify.mobile_app_phone
        data:
          message: "Maintenance action processed: {{ trigger.event.data.action }}"
```

> **Note:** Mobile notification actions (Complete, Skip, Snooze) are handled automatically by the integration when enabled in Notification Actions settings. The automation above is only needed for custom follow-up actions.

### Lovelace Card

When you add the card from the Lovelace card picker (1.0.45+), it auto-fills with sensible defaults — `filter_status: ["overdue", "triggered", "due_soon"]` + `max_items: 10` — so the first impression is "the 10 things that need attention" rather than every task. The visual editor exposes status chips, an object multi-checkbox, an HA-native entity picker, and the usual show_header / show_actions / compact / max_items toggles.

```yaml
type: custom:maintenance-supporter-card
title: Maintenance Overview
show_header: true
# All filters are optional and additive. Empty / unset = show all.
filter_status: [overdue, triggered, due_soon]
filter_objects: [Family Car, Electric Car]
entity_ids: [sensor.hvac_system_filter_change, binary_sensor.family_car_oil_change_overdue]
max_items: 10
```

### Dashboard Strategy

<a id="dashboard-strategy"></a>

On Home Assistant **2026.5+**, *Settings → Dashboards → Add Dashboard → "Maintenance Supporter"* spins up a complete dashboard. Pick a layout from the strategy editor or YAML — every mode prepends an **Overview** view with the actionable tasks (overdue + triggered + due_soon), then groups the rest:

| `group_by` | Resulting views |
|---|---|
| `area` *(default)* | One view per area, alphabetical, plus *Unassigned* at the end. |
| `status` | *Overdue / Triggered / Due Soon / OK* — empty statuses skipped. |
| `floor` | One view per floor (uses HA's floor registry, sorted by `level`), plus *Other* for objects whose area has no floor. |
| `due_date` | *Overdue / Today / This Week / This Month / Later* — empty buckets skipped. |

```yaml
strategy:
  type: custom:maintenance-supporter
  group_by: due_date   # area | status | floor | due_date
```

Card configs are generated dynamically from the `maintenance_supporter/objects` WebSocket feed, so adding objects or changing areas / floors / statuses is reflected on the next dashboard load — no YAML edits to keep things in sync. The strategy ships a small **visual editor** (registered via `getConfigElement`) so the picker can offer a dropdown instead of YAML for users who'd rather click.

The `due_date` mode uses two new card filters introduced in 1.7.0 — `filter_due_min_days` and `filter_due_max_days` — which you can also set on a stand-alone card if you want a "tasks due in the next 14 days" tile somewhere else on your dashboard.

On older HA versions the strategy JS still loads but the registration is a silent no-op; the picker simply won't show the entry. Card and panel work as before.

#### Section strategy

<a id="section-strategy"></a>

A second strategy ships alongside — a section you can drop into *any* HA dashboard view (the home dashboard, the areas dashboard's per-area view, a custom dashboard), so a slice of maintenance tasks shows up in context:

```yaml
sections:
  - strategy:
      type: custom:maintenance-supporter-section
      area_id: kitchen           # optional — restrict to one area
      filter_status: [overdue, triggered]
      filter_due_max_days: 7
      title: Kitchen — this week
      max_items: 5
```

All filters are optional and additive. `area_id` resolves to object names via the WebSocket feed at section-load time, so it survives area renames automatically.

#### Calendar Card

<a id="calendar-card"></a>

Standalone Lovelace card with the same rolling-window calendar the panel ships in its Calendar tab — pick *Maintenance Supporter — Calendar* in the "Add Card" dialog, or YAML:

```yaml
type: custom:maintenance-supporter-calendar-card
title: Maintenance calendar          # optional
window_days: 30                       # 7 | 14 | 30 | 365 — default 30
show_window_chips: true               # default true; hide for embedded use
show_user_filter: true                # default true
user_filter: ""                       # "" | "current_user" | "<uuid>"
```

Source icons (clock for time-based, trending-up for sensor-based, with adaptive sparkle), per-event prediction-confidence pills, projected recurrences at 55 % opacity, today-pill highlight, empty-day collapsing in the year view. Click on an event opens the task editor in-place — no panel navigation.

The dashboard strategy's `group_by: calendar` mode wraps four instances of this card (week / fortnight / month / year) as separate views, with the chips hidden because the tab bar already serves as the window selector.

### Entity naming

<a id="entity-naming"></a>

Each task becomes one sensor. Home Assistant builds its `entity_id` from the **object** (the device) plus the **task** name — there is **no shared `maintenance_` prefix**:

| Object | Task | Entity ID |
|---|---|---|
| Family Car | Oil Change | `sensor.family_car_oil_change` |
| HVAC System | Filter Replacement | `sensor.hvac_system_filter_replacement` |
| Water Softener | Refill Salt | `sensor.water_softener_refill_salt` |

Because the names vary per setup, **don't filter by entity-id prefix** in templates — filter by integration instead, using `integration_entities('maintenance_supporter')`. Each sensor's state is one of `ok`, `due_soon`, `overdue`, `triggered`.

### Summary sensors

<a id="summary-sensors"></a>

The integration also exposes **aggregate count sensors** on a global *Maintenance Supporter* device — bind these to chips, badges, or pop-up cards without writing template sensors:

| Entity ID | Counts |
|---|---|
| `sensor.maintenance_supporter_overdue` | tasks past due |
| `sensor.maintenance_supporter_due_soon` | tasks inside their warning window |
| `sensor.maintenance_supporter_triggered` | sensor-triggered tasks |
| `sensor.maintenance_supporter_needs_attention` | overdue + due-soon + triggered (one number) |
| `sensor.maintenance_supporter_ok` | tasks not needing attention |
| `sensor.maintenance_supporter_total_tasks` | all tasks |

They update live and are the **same numbers** the panel KPI chips and the dashboard-strategy headline show — one shared aggregator, so they never drift.

### Action buttons

Each task also exposes **action buttons** on its object device, so you can act on a task straight from a dashboard, chip, or bubble-card pop-up — the same actions the panel performs:

| Entity | Action |
|---|---|
| `button.<object>_<task>_complete` | Mark the task done (logs a completion) |
| `button.<object>_<task>_skip` | Skip the current cycle |
| `button.<object>_<task>_reset` | Reset the task's schedule |

(Entity IDs follow the same per-task naming as the sensors, e.g. `button.family_car_oil_change_complete`.) Buttons for disabled (paused) tasks are unavailable, and every press runs through the same logic as the `maintenance_supporter.complete` / `skip` / `reset` services — so a dashboard tap behaves exactly like the panel.

To export your data, use the **`maintenance_supporter.export_data`** action (service) — it writes a JSON/YAML file to your Home Assistant config folder. (Export isn't a button entity: a button runs on the server and can't trigger a browser download.)

Example — a ChoreOps-style row with status + a complete button:

```yaml
type: horizontal-stack
cards:
  - type: entity
    entity: sensor.family_car_oil_change
  - type: button
    entity: button.family_car_oil_change_complete
    name: Done
```

### Template Sensor: Count Overdue Tasks

> Prefer the native `sensor.maintenance_supporter_overdue` above. The template below is only for a *custom* count the summary sensors don't expose (e.g. a single object, or a specific status combination):

```yaml
template:
  - sensor:
      - name: "Overdue Maintenance Tasks"
        unit_of_measurement: "tasks"
        state: >
          {{ integration_entities('maintenance_supporter')
             | select('match', 'sensor.')
             | select('is_state', 'overdue')
             | list | count }}
```

## Known Limitations

- **Adaptive scheduling**: EWA requires 2+ completions, suggestions appear after 3+, Weibull analysis requires 5+ completions, seasonal adjustment requires 6+ months of history spread across different months
- **Sensor prediction**: Degradation rate analysis requires 10+ hourly recorder data points (approximately 10+ hours of data)
- **Runtime trigger**: Accumulated hours are persisted every 5 minutes. Up to 5 minutes of runtime may be lost on an unclean shutdown or crash
- **Compound triggers**: No nesting — a compound trigger cannot contain another compound trigger as a condition
- **Threshold debounce**: `trigger_for_minutes` timers are persisted and restored across HA restarts; however, the remaining duration is computed from wall-clock time, so large NTP jumps could cause premature or delayed triggering
- **Budget tracking**: Numeric values only — the currency symbol is set in **General Settings** (1.4.9+, previously under Budget Settings; default: €). **17 currencies** supported (1.4.8+): EUR, USD, GBP, JPY, CHF, CAD, AUD, CNY, INR, BRL, CZK, PLN, RUB, SEK, NOK, DKK, UAH
- **History pruning**: Maximum 500 history entries per task. Oldest entries are automatically removed when the limit is reached
- **Panel visibility**: Changing the `panel_enabled` toggle takes effect immediately (no restart required)

## Troubleshooting

### Trigger Not Activating

1. Verify the `trigger_entity` is correct — check **Developer Tools > States** for the entity ID, and confirm the source entity has a usable state there
2. Check per-entity availability (`available`, `unavailable`, `missing`) — this is the `trigger_entity_state` live value shown on the task in the panel (it comes from the WebSocket `subscribe` feed, not from a sensor attribute)
3. For threshold triggers with `trigger_for_minutes` > 0, the condition must hold continuously for that duration
4. For compound triggers, check each sub-condition's status individually on the task in the panel

### Notifications Not Arriving

1. Verify `notifications_enabled` is `true` and `notify_service` is set to a valid service (e.g., `notify.mobile_app_phone`)
2. Check quiet hours — notifications are suppressed between `quiet_hours_start` and `quiet_hours_end`
3. Check `max_notifications_per_day` — set to 0 for unlimited
4. Use **Test Notification** in the global options to verify the service works
5. Check the per-status enable toggles (`notify_due_soon_enabled`, etc.)

### Sidebar Panel Not Visible

1. Ensure `panel_enabled` is `true` in global settings
2. **Restart Home Assistant** — panel registration requires a restart
3. Clear browser cache (Ctrl+Shift+F5) after restart

### Dashboard Strategy: "Timeout waiting for strategy element ll-strategy-dashboard-maintenance-supporter to be registered"

Symptom: the strategy entry shows up under **Settings → Dashboards → Add dashboard → Community dashboards**, but clicking it does nothing or throws the timeout error in the browser console.

Cause: the browser cached the old `index.html` from before the integration was updated, so it still references the old strategy module URL.

Fix: **hard-reload the browser** (`Ctrl+Shift+F5` or `Cmd+Shift+R` on macOS). This drops the cached HTML and loads the current strategy bundle. A regular `F5` is not enough — the browser will reuse the cached page.

### Mobile Action Buttons Missing

1. Enable action buttons in **Notification Actions** settings (`action_complete_enabled`, etc.)
2. Verify you are using the HA Companion App (action buttons require the mobile app notification platform)

### Debug Logging

Add to `configuration.yaml` and restart:

```yaml
logger:
  logs:
    custom_components.maintenance_supporter: debug
```

## Services

| Service | Description |
|---------|-------------|
| `maintenance_supporter.complete` | Mark a task as complete (with optional notes, cost, duration) |
| `maintenance_supporter.reset` | Mark a task as last performed on a specific date (`date` parameter, defaults to today). The next due date is then computed from `date` plus the task's interval (`interval_days` in the configured `interval_unit` — days, weeks, months or years). |
| `maintenance_supporter.skip` | Skip the current maintenance cycle |
| `maintenance_supporter.export_data` | Export all maintenance data |

## Entities

Each maintenance task creates:
- A **sensor** entity with state: `ok`, `due_soon`, `overdue`, or `triggered`
- Attributes include days until due, interval, last performed date, trigger status, adaptive recommendations, and Weibull statistics

A global **calendar** entity shows upcoming maintenance events for all tasks.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full architecture documentation, including:
- Data flow and status computation
- Trigger system design (5 trigger types, multi-entity, compound)
- Adaptive scheduling algorithms (EWA, Weibull, seasonal)
- WebSocket API command reference
- Frontend architecture
- Development and testing infrastructure

## Test Coverage

2,094 tests across 92 test files with **98% code coverage**.

```
pytest tests/ --cov=custom_components.maintenance_supporter
```

See [Architecture — Test Coverage](docs/ARCHITECTURE.md#test-coverage) for the full breakdown.

## Requirements

- Home Assistant 2025.7.0 or newer
- No external dependencies required

## Development

A Docker Compose environment provides a complete dev setup with faketime time manipulation.

### Quick Start

```bash
pip install requests                    # Required for setup script

# First-time setup (creates config, onboards HA, seeds demo data):
bash scripts/init-dev.sh                # Login: dev / dev at :8125

# Or if already initialized:
cd docker && docker compose up -d

# Run tests (2,094 tests):
docker exec ha-maint sh -c "cd /config && python -m pytest tests/ -x -q"
```

The init script is idempotent — safe to run again on an existing setup.

See [Architecture — Development & Testing Infrastructure](docs/ARCHITECTURE.md#development--testing-infrastructure) for details on faketime, test entities, and the full demo object reference.

## Community

Questions, feedback, or want to share your setup? Join the discussion on the [Home Assistant Community Forum](https://community.home-assistant.io/t/custom-integration-maintenance-supporter-sensor-triggered-adaptive-maintenance-for-your-home/995556).

## License

MIT
