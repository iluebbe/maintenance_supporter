# Maintenance Supporter - Architecture & Design

A Home Assistant custom integration for tracking, scheduling, and predicting maintenance of household objects and devices. Combines time-based scheduling, sensor-driven triggers, adaptive ML algorithms, and environmental correlation for intelligent maintenance management.

**Version:** 0.1.0 | **~18,000 lines** across 49 source files | **0 external Python dependencies**

---

## High-Level Architecture

```
                          +-----------------+
                          |   Config Flow   |  (create objects, add tasks, configure triggers)
                          +--------+--------+
                                   |
                          writes config entries
                                   v
+-------------------+    +-------------------+    +-------------------+
|   Services API    |--->|   Coordinator     |--->|   Sensor Entity   |
| (complete/skip/   |    | (per object)      |    | (per task)        |
|  reset/export)    |    | - status compute  |    | - native_value    |
+-------------------+    | - trigger mgmt    |    | - attributes      |
                         | - predictions     |    +-------------------+
+-------------------+    | - history         |
|   WebSocket API   |--->|                   |    +-------------------+
| (18+ commands)    |    +--------+----------+    |  Calendar Entity  |
| - CRUD objects    |             |               | (global, all tasks)|
| - statistics      |             v               +-------------------+
| - subscribe       |    +-------------------+
+-------------------+    |  Trigger System   |    +-------------------+
                         | (threshold,       |    |  Notification Mgr |
+-------------------+    |  counter,         |    | - per-status      |
|   Frontend Panel  |    |  state_change)    |    | - quiet hours     |
| (LitElement + TS) |    +-------------------+    | - bundling        |
| - overview        |                             | - mobile actions  |
| - object detail   |    +-------------------+    +-------------------+
| - task detail     |    |   Helpers         |
| - dialogs         |    | - interval_analyzer (EWA + Weibull)
+-------------------+    | - sensor_predictor (degradation + env)
                         | - entity_analyzer (stats + discovery)
+-------------------+    | - notification_manager
|   Lovelace Card   |    | - csv_handler, qr_generator
+-------------------+    +-------------------+
```

---

## Core Design Decisions

### Two-Entry Model
- **Global entry** (`GLOBAL_UNIQUE_ID`): Integration-wide settings, panel toggle, notification config, budgets
- **Per-object entries**: One config entry per maintenance object, each with its own coordinator

This enables per-object lifecycle management (add/remove objects independently) while sharing resources like the NotificationManager and panel registration.

### Coordinator as Central Hub
All data flows through `MaintenanceCoordinator` (one per object):
- Periodic refresh every 5 minutes
- Computes task status (OK / DUE_SOON / OVERDUE / TRIGGERED)
- Manages trigger state preservation between refreshes
- Runs adaptive interval analysis
- Tracks entity availability with grace periods

### Event-Driven + Periodic Hybrid
Trigger sensors update immediately via HA state_change events, but the coordinator still refreshes periodically to:
- Catch time-based status transitions
- Run complex predictions (Weibull, seasonal, sensor degradation)
- Detect missing entities and create repair issues

### Pure Python Helpers
`interval_analyzer`, `sensor_predictor`, `entity_analyzer` have zero HA dependencies. This enables isolated unit testing and potential reuse outside HA.

---

## File Structure

```
custom_components/maintenance_supporter/
├── __init__.py                 (454 lines)  Integration setup, services, lifecycle
├── const.py                    (262 lines)  Constants, enums, defaults
├── coordinator.py              (786 lines)  DataUpdateCoordinator per object
│
├── config_flow.py              (669 lines)  Initial setup flow + templates
├── config_flow_helpers.py       (62 lines)  Shared config flow utilities
├── config_flow_options.py       (11 lines)  Options dispatcher
├── config_flow_options_global.py(503 lines)  Global settings (notifications, budgets, panel)
├── config_flow_options_task.py (716 lines)  Per-object task management
├── config_flow_trigger.py      (451 lines)  TriggerConfigMixin for trigger UI
│
├── sensor.py                   (314 lines)  MaintenanceSensor (enum, per task)
├── calendar.py                 (277 lines)  MaintenanceCalendar (global, all tasks)
├── entity/
│   ├── entity_base.py           (55 lines)  CoordinatorEntity base class
│   └── triggers/
│       ├── __init__.py          (41 lines)  Factory: create_trigger()
│       ├── base_trigger.py     (239 lines)  Abstract base with availability tracking
│       ├── threshold.py        (101 lines)  Value above/below trigger
│       ├── counter.py           (95 lines)  Accumulated value trigger
│       └── state_change.py     (186 lines)  State transition counter
│
├── websocket.py              (1,581 lines)  18+ WS commands (CRUD, stats, subscribe)
├── panel.py                     (66 lines)  Sidebar panel registration
├── frontend/
│   ├── __init__.py              (36 lines)  Lovelace card registration
│   ├── maintenance-panel.js              Built panel (esbuild output)
│   └── maintenance-card.js               Built card (esbuild output)
├── frontend-src/             (6,723 lines)  TypeScript sources
│   ├── maintenance-panel.ts  (2,747 lines)  Panel: overview, object detail, task detail
│   ├── maintenance-card.ts     (262 lines)  Lovelace card
│   ├── maintenance-card-editor.ts (80 lines)
│   ├── statistics-service.ts   (132 lines)  WS statistics cache
│   ├── styles.ts             (2,218 lines)  CSS, i18n (6 languages), shared helpers
│   ├── types.ts                (273 lines)  TypeScript interfaces
│   └── components/           (1,011 lines)
│       ├── complete-dialog.ts  (225 lines)  Mark task complete
│       ├── task-dialog.ts      (421 lines)  Add/edit task
│       ├── object-dialog.ts    (118 lines)  Add/edit object
│       └── qr-dialog.ts       (247 lines)  QR code generation
│
├── helpers/                  (3,236 lines)
│   ├── interval_analyzer.py    (732 lines)  EWA + Weibull + seasonal analysis
│   ├── sensor_predictor.py     (625 lines)  Degradation + environmental correlation
│   ├── notification_manager.py (618 lines)  Multi-channel notification system
│   ├── entity_analyzer.py      (202 lines)  Entity discovery + recorder stats
│   ├── csv_handler.py          (155 lines)  CSV import/export
│   ├── threshold_calculator.py (131 lines)  Threshold suggestion engine
│   ├── qr_generator.py          (73 lines)  QR code URL builder + SVG generator
│   └── qrcodegen.py            (700 lines)  Vendored QR library (Nayuki, MIT)
│
├── models/                     (420 lines)
│   ├── maintenance_task.py     (283 lines)  Task: schedule, triggers, history, status
│   ├── maintenance_object.py    (52 lines)  Object: name, area, manufacturer, model
│   └── maintenance_type.py      (85 lines)  Predefined maintenance categories
│
├── templates.py                (210 lines)  20+ object templates (car, pool, HVAC, ...)
├── repairs.py                  (235 lines)  Missing trigger entity repair flow
├── diagnostics.py              (206 lines)  Integration diagnostics with PII redaction
├── export.py                   (115 lines)  JSON/YAML data export
│
├── manifest.json                           Integration metadata
├── services.yaml                           Service definitions
├── strings.json                            Localization keys
├── icons.json                              State-based icon mappings
└── translations/{en,de}.json               English + German (backend config flow)
```

---

## Data Flow

### Task Status Computation
```
Coordinator refresh (every 5 min)
  └─> For each task:
      ├─ If trigger_active → TRIGGERED
      ├─ Compute days_until_due = next_due - today
      │   ├─ days < 0 → OVERDUE
      │   ├─ days <= warning_days → DUE_SOON
      │   └─ else → OK
      ├─ Run interval_analyzer (if adaptive enabled, 5+ history entries)
      │   ├─ EWA smoothing of intervals
      │   ├─ Weibull reliability (if 5+ completions)
      │   └─ Seasonal adjustment (if 6+ months of data)
      └─ Run sensor_predictor (if sensor trigger configured)
          ├─ Degradation rate from recorder statistics
          ├─ Threshold prediction (days until trigger)
          └─ Environmental correlation
```

### Trigger Lifecycle
```
Task has trigger_config with entity_id
  └─> sensor.async_added_to_hass()
      └─> create_trigger(type) → ThresholdTrigger / CounterTrigger / StateChangeTrigger
          └─> async_setup()
              ├─ Register async_track_state_change_event listener
              └─ Initial evaluation

Entity state changes → _handle_state_change_event()
  └─> _evaluate_and_update()
      └─> If triggered: sensor.async_update_trigger_state(True, value)
          └─> Recompute _status immediately
              └─> async_write_ha_state()

Entity unavailable for 6+ refreshes (~30 min):
  └─> Mark TriggerEntityState.MISSING
      └─> Create repair issue (replace / remove / dismiss)
```

### Service/WS Action Flow
```
Service call or WebSocket command
  └─> Find coordinator for entry
      └─> coordinator.complete_maintenance(task_id, notes, cost, duration)
          ├─ Append history entry
          ├─ Update last_performed
          ├─ Reset trigger baseline (if counter trigger)
          ├─ hass.config_entries.async_update_entry(data=...)
          └─> coordinator.async_request_refresh()
              └─> All entities update via CoordinatorEntity
```

---

## Trigger System

Abstract factory pattern with three implementations:

| Type | Trigger Condition | Config |
|------|-------------------|--------|
| **Threshold** | Value crosses above/below limit | `trigger_above`, `trigger_below`, `trigger_for_minutes` |
| **Counter** | Accumulated delta reaches target | `trigger_target_value`, `trigger_delta_mode` |
| **State Change** | N transitions between from→to states | `trigger_from_state`, `trigger_to_state`, `trigger_target_changes` |

All triggers share:
- Entity availability tracking with startup grace period (5 min)
- Automatic recovery when entity reappears
- Debounce via `trigger_for_minutes`
- Fallback evaluation in coordinator when trigger entity unavailable

---

## Adaptive Scheduling

Three-layer interval prediction:

1. **EWA (Exponential Weighted Average)** - Always active after 2+ completions
   - `smoothed = alpha * current + (1-alpha) * previous`
   - Incorporates user feedback (NEEDED / NOT_NEEDED / NOT_SURE)

2. **Weibull Distribution** - Activates after 5+ completions
   - Shape parameter beta: <0.8 early failures, 0.8-1.2 random, 1.2-3.5 wear-out, >3.5 highly predictable
   - Targets 90% reliability for interval recommendation

3. **Seasonal Adjustment** - Activates after 6+ months of history
   - Per-month multiplier (0.3x - 3.0x)
   - Hemisphere-aware season mapping
   - Manual override per month

---

## Frontend Architecture

**Build:** esbuild (TypeScript → ESM, minified)
**Framework:** LitElement 3 with decorators
**Two bundles:** `maintenance-panel.js` (~173KB) and `maintenance-card.js` (~88KB)

### Panel Views
1. **Overview**: Statistics dashboard, group list, budget status, sparklines
2. **Object Detail**: Metadata, task list with status indicators, action buttons
3. **Task Detail**: Full info, history table, trigger status, adaptive recommendations, sparkline charts

### Real-Time Updates
- WebSocket subscription (`maintenance_supporter/subscribe`)
- Frontend caches object list, updates on delta events
- No polling needed

### Dialogs
- Object create/edit
- Task create/edit (with trigger configuration)
- Complete task (notes, cost, duration, checklist)
- QR code generation (print, download SVG)

---

## Notification System

Multi-channel notification with:
- **Per-status intervals**: Configurable repeat frequency for due_soon, overdue, triggered
- **Quiet hours**: Suppress during configured time window
- **Bundling**: Combine N+ pending tasks into single notification
- **Daily limits**: Cap maximum notifications per day
- **Mobile actions**: Complete / Skip / Snooze buttons via Companion App
  - Action format: `MS_{ACTION}_{entry_id}_{task_id}`
  - Parsed by `_handle_notification_action()` in `__init__.py`

---

## WebSocket API

18+ commands organized by function:

| Category | Commands |
|----------|----------|
| **Read** | `objects`, `object`, `statistics`, `subscribe`, `templates`, `budget_status`, `groups` |
| **Object CRUD** | `object/create`, `object/update`, `object/delete` |
| **Task CRUD** | `task/create`, `task/update`, `task/delete` |
| **Task Actions** | `task/complete`, `task/skip`, `task/reset` |
| **Analysis** | `analyze_interval`, `apply_suggestion`, `seasonal_overrides`, `set_environmental_entity` |
| **Import/Export** | `export_data`, `export_csv`, `import_csv` |
| **QR** | `qr/generate` |

All write commands fire events for subscription updates.

---

## Quality Scale Compliance

| Rule | Tier | Status |
|------|------|--------|
| config-flow | Bronze | Yes |
| entity-unique-id | Bronze | Yes |
| has-entity-name | Bronze | Yes |
| runtime-data | Bronze | Yes |
| config-entry-unloading | Silver | Yes |
| parallel-updates | Silver | Yes (sensor + calendar) |
| entity-device-class | Gold | Yes (SensorDeviceClass.ENUM) |
| icon-translations | Gold | Yes (icons.json) |
| stale-devices | Gold | Yes (async_remove_config_entry_device) |
| exception-translations | Gold | Yes (strings.json exceptions) |
| entity-category | Gold | Yes (calendar = DIAGNOSTIC) |
| diagnostics | Gold | Yes (with PII redaction) |
| repair-issues | Gold | Yes (missing trigger entities) |

---

## Test Coverage

325 tests across 16 test files:

| Test File | Scope |
|-----------|-------|
| `test_status_computation.py` | Status logic (OK, DUE_SOON, OVERDUE, TRIGGERED) |
| `test_triggers.py` | Threshold, counter, state_change triggers |
| `test_adaptive_scheduling.py` | EWA, Weibull, interval computation |
| `test_seasonal_scheduling.py` | Seasonal factors, hemisphere support |
| `test_sensor_predictions.py` | Degradation analysis, threshold prediction |
| `test_config_flow.py` | Config flow steps, validation |
| `test_options_flow.py` | Options flow management |
| `test_services.py` | Complete, skip, reset, export services |
| `test_entity_lifecycle.py` | Entity setup, teardown, trigger lifecycle |
| `test_calendar.py` | Calendar events, date handling |
| `test_notifications.py` | Notification delivery, quiet hours, bundling |
| `test_diagnostics.py` | Diagnostic data, PII redaction |
| `test_edge_cases.py` | Boundary conditions, error handling |
| `test_phase2_features.py` | Checklist, groups, budgets |
| `test_qr_generation.py` | QR URL building, SVG generation |

---

## Extensibility

- **New trigger type**: Subclass `BaseTrigger`, implement `_evaluate_and_update()`, register in factory
- **New helper**: Add module to `helpers/`, integrate in coordinator
- **New platform**: Add entity module, register in `const.PLATFORMS`
- **New WS command**: Add handler in `websocket.py`, register in `async_register_commands()`
- **New template**: Add `ObjectTemplate` to `templates.py`
- **New language**: Add `translations/{lang}.json` for backend + dictionary in `styles.ts` for frontend (currently: DE, EN, NL, FR, IT, ES)

---

## Development & Testing Infrastructure

### Docker Compose Environment

Three services in `compose.yaml`:

```
┌──────────────────────────────────────────────────────────────┐
│  ha-dev (:8123)         │  ha-fresh (:8124)    │  playwright │
│  HA 2026.2.2            │  HA 2026.2.2 stock   │  v1.57.0    │
│  + libfaketime          │  read-only mounts    │  run-server │
│  custom_components r/w  │  profile: testing    │  :3000      │
│  config-dev/ volume     │  config-fresh/       │             │
└──────────────────────────────────────────────────────────────┘
                    ↕ ha-net (bridge) ↕
```

| Service | Purpose | Profile |
|---------|---------|---------|
| `homeassistant-dev` | Primary dev instance with faketime time manipulation | default (always runs) |
| `homeassistant-fresh` | Clean HA instance for fresh-install testing | `testing` |
| `playwright` | Browser automation for E2E tests | `testing` |

### Faketime (Time Manipulation)

The integration's scheduling and predictions are time-dependent. `libfaketime` allows shifting HA's perceived time without waiting.

**Build** (`Dockerfile.ha-faketime`):
1. Alpine stage compiles `libfaketime.so.1` from source
2. Copies into HA 2026.2.2 image at `/usr/local/lib/faketime/`
3. Replaces HA's s6 run script with `ha-run-faketime.sh`

**Run script** (`ha-run-faketime.sh`):
- When `FAKETIME_ENABLED=true`: sets `LD_PRELOAD` to libfaketime only
- When disabled: uses standard jemalloc allocator
- **Cannot use both** — libfaketime + jemalloc deadlock under HA's async workload

**Time offset** (`faketime.txt`):
- Read by libfaketime at runtime via `FAKETIME_TIMESTAMP_FILE`
- Format: `+0` (real time), `+7d` (7 days ahead), `-3h` (3 hours back)
- Changes take effect without restart (`FAKETIME_NO_CACHE=1`)
- `DONT_FAKE_MONOTONIC=1` prevents async event loop issues

**Legacy patch** (`faketime-patch.sh`):
- Alternative approach: patches HA's generated s6 run script to append libfaketime to jemalloc's `LD_PRELOAD`
- Waits up to 15s for s6 to generate the run script, then sed-patches it
- Superseded by `ha-run-faketime.sh` which replaces the script entirely

### Environment Configuration (`.env`)

```
TZ=Europe/Berlin
HA_DEV_PORT=8123
HA_FRESH_PORT=8124
FAKETIME_ENABLED=true
HA_TOKEN=<long-lived access token>
```

### Volume Mounts

```
./config-dev           → /config          (persistent HA config + database)
./custom_components    → /config/custom_components  (live code, r/w)
./faketime.txt         → /config/faketime.txt  (time offset, read-only)
```

Code changes in `custom_components/` are reflected immediately after `docker restart ha-dev`.

### Demo Data Setup

**`setup_demo.py`** — Creates maintenance objects via HA's REST Config Flow API:

| Object | Manufacturer | Trigger Type | Entity |
|--------|-------------|-------------|---------|
| HVAC System | Daikin FTXM35R | Threshold (airflow < 60%) | `input_number.hvac_filter_airflow` |
| Family Car | VW Golf VIII | Counter (15,000 km delta) + time-based tire rotation | `input_number.car_odometer` |
| Washing Machine | Bosch WAX32M92 | State change (50 on→off cycles) | `input_boolean.washing_machine_running` |
| Water Softener | BWT Perla Silk M | Threshold (salt < 20%) | `input_number.water_softener_salt_level` |

Usage: `python setup_demo.py` (requires HA running with valid token)

**`inject_test_statistics.py`** — Generates 90 days of recorder statistics directly into SQLite:

| Entity | Pattern | Cycle |
|--------|---------|-------|
| HVAC airflow | 95% → 60% linear decay | 30-day reset |
| Car odometer | +40 km/day cumulative | monotonic |
| Salt level | 100% → 30% linear drain | 30-day refill |
| Washing cycles | +0.6 cycles/day cumulative | monotonic |
| Pool pressure | 0.7 → 1.4 bar gradual rise | 14-day clean |
| Test pressure | 0.85–1.15 bar random + 5% spikes | random |

Generates both hourly `statistics` (90 days) and 5-minute `statistics_short_term` (10 days). Must run with HA stopped:

```bash
docker compose stop homeassistant-dev
python inject_test_statistics.py
docker compose start homeassistant-dev
```

### Running Tests

**Unit tests** (via pytest inside container):
```bash
docker exec ha-dev sh -c "cd /config && python -m pytest tests/ -v"
```

**CI tests** (GitHub Actions):
```bash
pip install pytest pytest-homeassistant-custom-component
pytest tests/ -v
```

### Typical Development Workflow

1. Edit code in `custom_components/` or `frontend-src/`
2. If frontend changed: `npm run build` (esbuild)
3. `docker restart ha-dev`
4. Browser: `http://localhost:8123` (Ctrl+Shift+F5 for cache bust)
5. To test time-dependent features: edit `faketime.txt` (e.g., `+7d`)
6. Run tests: `docker exec ha-dev sh -c "cd /config && python -m pytest tests/ -v"`
