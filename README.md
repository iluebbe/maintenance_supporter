# Maintenance Supporter

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/iluebbe/maintenance_supporter)](https://github.com/iluebbe/maintenance_supporter/releases)
[![Tests](https://img.shields.io/badge/tests-1168_passed-brightgreen)](tests/)
[![Coverage](https://img.shields.io/badge/coverage-94%25-brightgreen)](docs/ARCHITECTURE.md#test-coverage)

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

### QR Codes
![QR Code](docs/images/qr-dialog.png)

### Actionable Notifications
![Actionable Notification](docs/images/notification-actions.png)

### Lovelace Card
![Lovelace Card](docs/images/lovelace-card.png)

### Calendar
![Calendar](docs/images/calendar.png)

### Entity Attributes
![Entity Attributes](docs/images/entity-attributes.png)

</details>

## Features

### Task Management
- Create maintenance objects (devices, equipment, appliances) and assign tasks to them
- Six task types: cleaning, inspection, replacement, calibration, service, custom
- Three scheduling modes: **time-based** (interval in days), **sensor-based** (triggered by entity state), **manual**
- Task status tracking: OK, Due Soon, Overdue, Triggered
- **Binary sensor** per task (`device_class: problem`) — ON when overdue or triggered, ideal for HA automations
- **Interval anchoring**: choose between completion-based (default) or planned-date anchoring to prevent schedule drift
- Assign tasks to responsible Home Assistant users with per-user notification routing
- Custom task icons (any `mdi:*` icon via the HA icon picker)
- NFC tag linking — scan an NFC tag to complete a task
- Checklists for multi-step procedures
- Task grouping for logical organization
- 20+ object templates (car, pool, HVAC, washing machine, etc.)

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
- Seasonal awareness with hemisphere detection and per-month multipliers
- Environmental correlation with external sensors (temperature, humidity, etc.)
- Sensor degradation rate analysis and threshold prediction
- User feedback loop (needed / not needed / not sure) to improve recommendations

### Notifications
- Configurable notification service (any `notify.*` service)
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
- Export via JSON, YAML, CSV; import via CSV
- QR code generation for mobile quick-actions (print, download SVG)
- Complete maintenance history with cost, duration, and feedback tracking
- Integration diagnostics with PII redaction

### Frontend
- **Sidebar panel** with dashboard overview, object details, task history, and analytics
- **Lovelace card** for dashboard integration
- **Calendar** integration with status-emoji events
- **Binary sensor** entities for automation triggers
- Real-time updates via WebSocket subscription (no polling)
- User filter to show only your assigned tasks
- Localized UI: English, German, Dutch, French, Italian, Spanish

### WebSocket API
- 36 commands for full CRUD operations on objects, tasks, triggers, and groups
- Global settings update and test notification via WS
- Real-time subscription for live updates
- User assignment and listing
- Statistics, budget status, and interval analysis
- See [Architecture](docs/ARCHITECTURE.md) for the complete command reference

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Click the three dots menu (top right) and select **Custom repositories**
3. Add `https://github.com/iluebbe/maintenance_supporter` as an **Integration**
4. Search for "Maintenance Supporter" and install it
5. Restart Home Assistant

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

- **Schedule**: `interval_days`, `warning_days`, `days_until_due`, `next_due_date`, `last_performed`, `schedule_type`
- **Trigger**: `trigger_type`, `trigger_active`, `trigger_current_value`, `trigger_entity_state` (per-entity availability)
- **Adaptive**: `adaptive_enabled`, `suggested_interval`, `weibull_beta`, `weibull_reliability`, `seasonal_factor`
- **Prediction**: `degradation_rate`, `predicted_trigger_date`, `environmental_factor`

### Events

- `maintenance_supporter_trigger_activated` — fired when a sensor trigger condition becomes true
- `maintenance_supporter_trigger_deactivated` — fired when a sensor trigger condition clears

### Services

See the [Services](#services) table below for available service calls. For the full WebSocket API (36 commands), see [Architecture — WebSocket API](docs/ARCHITECTURE.md#websocket-api).

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

```yaml
type: custom:maintenance-card
title: Maintenance Overview
show_header: true
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
- **Threshold debounce**: `trigger_for_minutes` timers are not restored across Home Assistant restarts. A restart during the debounce window resets the timer
- **Budget tracking**: Numeric values only — there is no currency selector. The unit displayed is fixed to the symbol configured in the UI
- **History pruning**: Maximum 50 history entries per task. Oldest entries are automatically removed when the limit is reached
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
| `maintenance_supporter.reset` | Reset a task's last performed date |
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

1,168 tests across 55 test files with **94% code coverage**.

```
pytest tests/ --cov=custom_components.maintenance_supporter
```

See [Architecture — Test Coverage](docs/ARCHITECTURE.md#test-coverage) for the full breakdown.

## Requirements

- Home Assistant 2025.1.0 or newer
- No external dependencies required

## Development

A Docker Compose environment provides a complete dev setup with faketime time manipulation.

### Quick Start

```bash
cd docker
docker compose up -d                    # Start HA dev instance (:8123)

# Create demo data (9 objects, all 5 trigger types):
python scripts/setup_demo.py
python scripts/seed_history.py          # Inject 12 months of maintenance history
docker compose restart homeassistant-dev

# Run tests (1,169 tests):
docker exec ha-dev sh -c "cd /config && python -m pytest tests/ -x -q"
```

See [Architecture — Development & Testing Infrastructure](docs/ARCHITECTURE.md#development--testing-infrastructure) for details on faketime, test entities, and the full demo object reference.

## License

MIT
