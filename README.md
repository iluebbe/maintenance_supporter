# Maintenance Supporter

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/iluebbe/maintenance_supporter)](https://github.com/iluebbe/maintenance_supporter/releases)
[![Tests](https://img.shields.io/badge/tests-1433_passed-brightgreen)](tests/)
[![Coverage](https://img.shields.io/badge/coverage-96%25-brightgreen)](docs/ARCHITECTURE.md#test-coverage)
[![Community Forum](https://img.shields.io/badge/Community-Forum-41BDF5.svg)](https://community.home-assistant.io/t/custom-integration-maintenance-supporter-sensor-triggered-adaptive-maintenance-for-your-home/995556)

A Home Assistant custom integration for tracking and managing maintenance tasks across your devices and equipment. Schedule time-based or sensor-triggered maintenance, get notifications when tasks are due, and keep a complete maintenance history — with adaptive scheduling that learns from your patterns.

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

### Calendar
![Calendar](docs/images/calendar.png)

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
- Three scheduling modes: **time-based** (interval in days), **sensor-based** (triggered by entity state), **manual**
- Task status tracking: OK, Due Soon, Overdue, Triggered
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
- **Operator mode** for non-admin HA users — hides every create/edit/delete control in the panel so household members can complete tasks without changing settings. Admins can grant full panel access to selected non-admin users via the new **Panel Access** section (Settings tab or config flow). Orphaned ids surface as a fixable repair issue. Useful for shared/family/hotel setups (1.0.44+)
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

### Budget Tracking
- Monthly and yearly maintenance budgets
- Cost tracking per task completion
- Budget alerts at configurable thresholds

### Data Management
- JSON and CSV export and import (via WebSocket API and Settings panel)
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
- Localized UI: English, German, Spanish, French, Italian, Dutch, Portuguese, Russian, Ukrainian, Polish, Czech, Swedish (12 languages — panel UI; HA config flow falls back to English for the latter three until v1.0.45)

### WebSocket API
- 37 commands for full CRUD operations on objects, tasks, triggers, and groups
- Global settings update and test notification via WS
- Real-time subscription for live updates
- User assignment and listing
- Statistics, budget status, and interval analysis
- See [Architecture](docs/ARCHITECTURE.md) for the complete command reference

## Installation

### HACS (Recommended)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=iluebbe&repository=maintenance_supporter&category=Integration)

1. Click the button above — or open HACS manually, click the three dots menu (top right) and select **Custom repositories**, then add `https://github.com/iluebbe/maintenance_supporter` as an **Integration**
2. Search for "Maintenance Supporter" and install it
3. Restart Home Assistant

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
- **Calendar** — one global entity showing upcoming maintenance events for all tasks

### Sensor Attributes

Each sensor entity exposes attributes grouped by function:

- **Schedule**: `interval_days`, `warning_days`, `days_until_due`, `next_due_date`, `last_performed`, `created_at`, `schedule_type`, `schedule_time`
- **Trigger**: `trigger_type`, `trigger_active`, `trigger_current_value`, `trigger_entity_state` (per-entity availability)
- **Adaptive**: `adaptive_enabled`, `suggested_interval`, `weibull_beta`, `weibull_reliability`, `seasonal_factor`
- **Prediction**: `degradation_rate`, `predicted_trigger_date`, `environmental_factor`

### Events

- `maintenance_supporter_trigger_activated` — fired when a sensor trigger condition becomes true
- `maintenance_supporter_trigger_deactivated` — fired when a sensor trigger condition clears
- `maintenance_supporter_task_completed` — fired on every completion path (panel, complete-QR, quick-complete, mobile action). Payload: `entry_id`, `task_id`, `task_name`, `object_name`, plus optional `notes`, `cost`, `duration`, `feedback`, `completed_by`
- `maintenance_supporter_task_skipped` — fired when a task is skipped. Payload includes the optional `reason`
- `maintenance_supporter_task_reset` — fired when a task's `last_performed` is reset to a specific date. Payload includes that `date`

### Services

See the [Services](#services) table below for available service calls. For the full WebSocket API (37 commands), see [Architecture — WebSocket API](docs/ARCHITECTURE.md#websocket-api).

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

> **Note:** Recorder history (entity state history in the HA database) is not automatically removed. To purge it, use the `recorder.purge_entities` service targeting the `sensor.maintenance_*` entities.

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

## Examples

### Automation: Notify on Overdue Task

```yaml
automation:
  - alias: "Notify when maintenance is overdue"
    trigger:
      - platform: state
        entity_id: sensor.maintenance_family_car_oil_change
        to: "overdue"
    action:
      - service: notify.mobile_app_phone
        data:
          title: "Maintenance Overdue"
          message: >
            {{ state_attr('sensor.maintenance_family_car_oil_change', 'friendly_name') }}
            is overdue by {{ state_attr('sensor.maintenance_family_car_oil_change', 'days_until_due') | abs }} days.
```

### Service Call: Complete a Task with Details

```yaml
service: maintenance_supporter.complete
data:
  entity_id: sensor.maintenance_hvac_system_filter_replacement
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

### Template Sensor: Count Overdue Tasks

```yaml
template:
  - sensor:
      - name: "Overdue Maintenance Tasks"
        unit_of_measurement: "tasks"
        state: >
          {{ states.sensor
             | selectattr('entity_id', 'match', 'sensor.maintenance_')
             | selectattr('state', 'eq', 'overdue')
             | list | count }}
```

## Known Limitations

- **Adaptive scheduling**: EWA requires 2+ completions, suggestions appear after 3+, Weibull analysis requires 5+ completions, seasonal adjustment requires 6+ months of history spread across different months
- **Sensor prediction**: Degradation rate analysis requires 10+ hourly recorder data points (approximately 10+ hours of data)
- **Runtime trigger**: Accumulated hours are persisted every 5 minutes. Up to 5 minutes of runtime may be lost on an unclean shutdown or crash
- **Compound triggers**: No nesting — a compound trigger cannot contain another compound trigger as a condition
- **Threshold debounce**: `trigger_for_minutes` timers are persisted and restored across HA restarts; however, the remaining duration is computed from wall-clock time, so large NTP jumps could cause premature or delayed triggering
- **Budget tracking**: Numeric values only — the currency symbol can be changed in Budget Settings (default: €). 10 currencies supported: EUR, USD, GBP, JPY, CHF, CAD, AUD, CNY, INR, BRL
- **History pruning**: Maximum 500 history entries per task. Oldest entries are automatically removed when the limit is reached
- **Panel visibility**: Changing the `panel_enabled` toggle takes effect immediately (no restart required)

## Troubleshooting

### Trigger Not Activating

1. Verify the `trigger_entity` is correct — check **Developer Tools > States** for the entity ID
2. Check the sensor's `trigger_entity_state` attribute — it shows per-entity availability (`available`, `unavailable`, `missing`)
3. For threshold triggers with `trigger_for_minutes` > 0, the condition must hold continuously for that duration
4. For compound triggers, check each sub-condition's status individually in the sensor attributes

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
| `maintenance_supporter.reset` | Mark a task as last performed on a specific date (`date` parameter, defaults to today). The next due date is then computed as `date + interval_days`. |
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

1,433 tests across 70 test files with **96% code coverage**.

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

# Run tests (1,433 tests):
docker exec ha-maint sh -c "cd /config && python -m pytest tests/ -x -q"
```

The init script is idempotent — safe to run again on an existing setup.

See [Architecture — Development & Testing Infrastructure](docs/ARCHITECTURE.md#development--testing-infrastructure) for details on faketime, test entities, and the full demo object reference.

## Community

Questions, feedback, or want to share your setup? Join the discussion on the [Home Assistant Community Forum](https://community.home-assistant.io/t/custom-integration-maintenance-supporter-sensor-triggered-adaptive-maintenance-for-your-home/995556).

## License

MIT
