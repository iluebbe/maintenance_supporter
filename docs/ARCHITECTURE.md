# Maintenance Supporter — Architecture & Design

A Home Assistant custom integration for tracking, scheduling, and predicting maintenance of household objects and devices. Combines time-based scheduling, sensor-driven triggers, adaptive ML algorithms, and environmental correlation for intelligent maintenance management.

**Version:** 0.3.6 | **~22,000 lines** across 58 source files (47 Python + 11 TypeScript) | **0 external Python dependencies** | **95% test coverage** (964 tests)

---

## High-Level Architecture

```
                          +-----------------+
                          |   Config Flow   |  (create objects, add tasks, configure triggers,
                          |                 |   trigger summary, user dropdown, templates)
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
| (32 commands)     |    +--------+----------+    |  Calendar Entity  |
| - CRUD objects    |             |               | (global, all tasks)|
| - statistics      |             v               +-------------------+
| - subscribe       |    +-------------------+
| - user assignment |    |  Trigger System   |    +-------------------+
+-------------------+    | (threshold,       |    |  Notification Mgr |
                         |  counter,         |    | - per-status      |
+-------------------+    |  state_change,    |    | - quiet hours     |
|   Frontend Panel  |    |  runtime,         |    | - mobile actions  |
| (LitElement + TS) |    |  compound)        |    | - user-specific   |
| - overview        |    | - multi-entity    |    +-------------------+
| - object detail   |    | - per-entity state|
| - task detail     |    +-------------------+
| - user filter     |
| - dialogs         |    +-------------------+
+-------------------+    |   Helpers         |
                         | - interval_analyzer (EWA + Weibull)
+-------------------+    | - sensor_predictor (degradation + env)
|   Lovelace Card   |    | - entity_analyzer (stats + discovery)
+-------------------+    | - notification_manager
                         | - csv_handler, qr_generator
                         +-------------------+
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
- Runs adaptive interval analysis and sensor predictions
- Tracks entity availability with grace periods
- Checks budget thresholds and sends notifications

### Event-Driven + Periodic Hybrid
Trigger sensors update immediately via HA state_change events, but the coordinator still refreshes periodically to:
- Catch time-based status transitions
- Run complex predictions (Weibull, seasonal, sensor degradation)
- Detect missing entities and create repair issues
- Evaluate fallback trigger conditions for missed events

### Config Flow UX
- Entity selector pre-populates existing entity_ids when editing a trigger
- All 8 compound trigger steps have proper translations in both config and options flows
- Go-back navigation on all forms for non-linear editing
- 20+ object templates with pre-configured tasks and triggers

### Pure Python Helpers
`interval_analyzer`, `sensor_predictor`, `entity_analyzer` have zero HA dependencies. This enables isolated unit testing and potential reuse outside HA.

---

## File Structure

```
custom_components/maintenance_supporter/
├── __init__.py                    (454 lines)  Integration setup, services, lifecycle
├── const.py                       (272 lines)  Constants, enums, defaults
├── coordinator.py                 (885 lines)  DataUpdateCoordinator per object
│
├── config_flow.py                 (899 lines)  Initial setup flow + templates
├── config_flow_helpers.py          (62 lines)  Shared config flow utilities
├── config_flow_options.py          (13 lines)  Options dispatcher
├── config_flow_options_global.py  (663 lines)  Global settings (notifications, budgets, panel)
├── config_flow_options_task.py  (1,270 lines)  Per-object task management
├── config_flow_trigger.py       (1,122 lines)  TriggerConfigMixin for trigger UI
│
├── sensor.py                      (461 lines)  MaintenanceSensor (enum, per task)
├── calendar.py                    (342 lines)  MaintenanceCalendar (global, all tasks)
├── entity/
│   ├── entity_base.py              (56 lines)  CoordinatorEntity base class
│   └── triggers/
│       ├── __init__.py            (166 lines)  Factory: create_triggers(), multi-entity
│       ├── base_trigger.py        (300 lines)  Abstract base with availability tracking
│       ├── threshold.py           (105 lines)  Value above/below trigger
│       ├── counter.py              (99 lines)  Accumulated value trigger
│       ├── state_change.py        (195 lines)  State transition counter
│       ├── runtime.py             (329 lines)  Accumulated operating hours trigger
│       └── compound.py            (310 lines)  AND/OR compound trigger
│
├── websocket/                               32 WS commands, split by domain
│   ├── __init__.py              (258 lines)  Shared helpers + registration
│   ├── objects.py               (185 lines)  Object CRUD (5 handlers)
│   ├── tasks.py                 (552 lines)  Task CRUD + validation + actions (7 handlers)
│   ├── groups.py                (163 lines)  Group CRUD (4 handlers)
│   ├── analysis.py              (261 lines)  Adaptive scheduling (4 handlers)
│   ├── users.py                 (138 lines)  User management (3 handlers)
│   ├── io.py                    (198 lines)  Export/import/CSV/QR/templates (5 handlers)
│   └── dashboard.py             (222 lines)  Subscribe, statistics, settings, budget (4 handlers)
├── panel.py                        (66 lines)  Sidebar panel registration
├── frontend/
│   ├── __init__.py                 (36 lines)  Lovelace card registration
│   ├── maintenance-panel.js                  Built panel (esbuild output)
│   └── maintenance-card.js                   Built card (esbuild output)
├── frontend-src/                (6,990 lines)  TypeScript sources
│   ├── maintenance-panel.ts     (2,787 lines)  Panel: overview, object detail, task detail
│   ├── maintenance-card.ts        (262 lines)  Lovelace card
│   ├── maintenance-card-editor.ts  (80 lines)
│   ├── statistics-service.ts      (132 lines)  WS statistics cache
│   ├── styles.ts                (2,272 lines)  CSS, i18n (6 languages), shared helpers
│   ├── types.ts                   (277 lines)  TypeScript interfaces
│   ├── user-service.ts            (121 lines)  HA user list cache
│   └── components/              (1,059 lines)
│       ├── complete-dialog.ts     (225 lines)  Mark task complete
│       ├── task-dialog.ts         (469 lines)  Add/edit task
│       ├── object-dialog.ts       (118 lines)  Add/edit object
│       └── qr-dialog.ts          (247 lines)  QR code generation
│
├── helpers/                     (3,318 lines)
│   ├── interval_analyzer.py       (732 lines)  EWA + Weibull + seasonal analysis
│   ├── sensor_predictor.py        (628 lines)  Degradation + environmental correlation
│   ├── notification_manager.py    (695 lines)  Multi-channel notification system
│   ├── entity_analyzer.py         (203 lines)  Entity discovery + recorder stats
│   ├── csv_handler.py             (155 lines)  CSV import/export
│   ├── threshold_calculator.py    (132 lines)  Threshold suggestion engine
│   ├── qr_generator.py            (73 lines)  QR code URL builder + SVG generator
│   └── qrcodegen.py              (700 lines)  Vendored QR library (Nayuki, MIT)
│
├── models/                        (422 lines)
│   ├── maintenance_task.py        (283 lines)  Task: schedule, triggers, history, status
│   ├── maintenance_object.py       (53 lines)  Object: name, area, manufacturer, model
│   └── maintenance_type.py         (86 lines)  Predefined maintenance categories
│
├── templates.py                   (226 lines)  20+ object templates (car, pool, HVAC, ...)
├── repairs.py                     (274 lines)  Missing trigger entity repair flow
├── diagnostics.py                 (209 lines)  Integration diagnostics with PII redaction
├── export.py                      (116 lines)  JSON/YAML data export
│
├── manifest.json                            Integration metadata
├── services.yaml                            Service definitions
├── strings.json                             Localization keys
├── icons.json                               State-based icon mappings
└── translations/{en,de,nl,fr,it,es}.json    6 languages (backend config flow)
```

---

## Data Flow

### Task Status Computation
```
Coordinator refresh (every 5 min)
  └─> For each task:
      ├─ If disabled → OK (skip further evaluation)
      ├─ If trigger_active → TRIGGERED
      ├─ Compute days_until_due = next_due - today
      │   ├─ days < 0 → OVERDUE
      │   ├─ days <= warning_days → DUE_SOON
      │   └─ else → OK
      ├─ Run _evaluate_trigger_fallback() for periodic re-check
      ├─ Run interval_analyzer (if adaptive enabled, 5+ history entries)
      │   ├─ EWA smoothing of intervals
      │   ├─ Weibull reliability (if 5+ completions)
      │   └─ Seasonal adjustment (if 6+ months of data)
      ├─ Run sensor_predictor (if sensor trigger configured)
      │   ├─ Degradation rate from recorder statistics
      │   ├─ Threshold prediction (days until trigger)
      │   └─ Environmental correlation (adjust interval by factor)
      ├─ Check entity availability → create/clear repair issues
      ├─ Send notifications for DUE_SOON / OVERDUE / TRIGGERED
      └─ Check budget thresholds → send budget alerts
```

### Trigger Lifecycle
```
Task has trigger_config with entity_id(s)
  └─> sensor.async_added_to_hass()
      └─> create_triggers(type, entity_ids) → list of trigger instances
          ├─ Single entity → 1 trigger
          ├─ Multi-entity → N triggers (one per entity_id)
          │   ├─ Per-entity state from _trigger_state dict
          │   └─ Aggregated via entity_logic (any/all)
          └─ Compound → 1 CompoundTrigger with sub-triggers
              ├─ Each condition → create_triggers() for condition's entities
              ├─ CompoundSubEntity proxies aggregate per-condition
              └─ compound_logic (AND/OR) aggregates across conditions

For each trigger:
  └─> async_setup()
      ├─ Register async_track_state_change_event listener
      ├─ If entity unavailable at setup → schedule retry (30s)
      ├─ RuntimeTrigger: restore accumulated_seconds + on_since, start periodic timer
      ├─ CounterTrigger: initialize baseline if delta mode
      └─ Initial evaluation

Entity state changes → _handle_state_change_event()
  ├─ Entity appeared (old_state=None) → initialize, register state
  ├─ Entity unavailable/unknown → log once, pause (runtime: accumulate & pause)
  ├─ Entity recovered → clear unavailable flag, resume tracking
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
          ├─ Append history entry (timestamp, type, notes, cost, duration, feedback)
          ├─ Update last_performed
          ├─ Reset trigger baseline (if counter trigger)
          ├─ Reset change count (if state_change trigger)
          ├─ Reset accumulated hours (if runtime trigger)
          ├─ Update adaptive config (if adaptive enabled)
          ├─ hass.config_entries.async_update_entry(data=...)
          └─> coordinator.async_request_refresh()
              └─> All entities update via CoordinatorEntity
```

---

## Trigger System

Abstract factory pattern with five implementations:

| Type | Trigger Condition | Config |
|------|-------------------|--------|
| **Threshold** | Value crosses above/below limit | `trigger_above`, `trigger_below`, `trigger_for_minutes` |
| **Counter** | Accumulated delta reaches target | `trigger_target_value`, `trigger_delta_mode` |
| **State Change** | N transitions between from→to states | `trigger_from_state`, `trigger_to_state`, `trigger_target_changes` |
| **Runtime** | Accumulated ON-time reaches target hours | `trigger_runtime_hours`, `on_states` |
| **Compound** | Multiple conditions combined with AND/OR | `compound_logic`, `conditions[]` |

All triggers share:
- Entity availability tracking with startup grace period (5 min)
- Automatic recovery when entity reappears
- Retry logic when entity is unavailable at setup (30s delay)
- Debounce via `trigger_for_minutes` (threshold only)
- Fallback evaluation in coordinator during periodic refresh
- Attribute-based triggering (monitor an entity attribute instead of state)

RuntimeTrigger additionally:
- Persists `accumulated_seconds` + `on_since` to config entry for restart recovery
- Periodic persistence every 5 minutes (minimizes data loss on crash)
- Pauses accumulation when entity becomes unavailable
- Configurable `on_states` (default: `["on"]`, customizable to `["running", "active"]` etc.)
- Reset clears hours but keeps tracking if entity is still ON

### Multi-Entity Support

All trigger types support multiple `entity_ids` with configurable `entity_logic`:
- **any** (default): Trigger activates when *any* entity meets the condition
- **all**: Trigger activates only when *all* entities meet the condition

Implementation: `create_triggers()` creates one trigger instance per entity_id. Per-entity runtime state (baselines, accumulated seconds, change counts) is persisted in a nested `_trigger_state` dict within `trigger_config`, keyed by entity_id. Legacy flat keys are auto-migrated on first load.

### Compound Triggers

Two-level aggregation for combining multiple trigger types per task:
1. **Within each condition**: Multi-entity `entity_logic` (any/all) — reuses standard per-entity logic
2. **Across conditions**: `compound_logic` (AND/OR)

Architecture:
- `CompoundTrigger(BaseTrigger)`: Main class, creates sub-triggers for each condition
- `CompoundSubEntity`: Proxy entity that intercepts sub-trigger callbacks and aggregates per-condition
- `_CompoundCoordinatorProxy`: Routes persistence to correct condition index in `_trigger_state.conditions[idx]`
- Nested compound triggers are rejected at validation time

---

## Adaptive Scheduling

Three-layer interval prediction:

1. **EWA (Exponential Weighted Average)** — Always active after 2+ completions
   - `smoothed = alpha * current + (1-alpha) * previous`
   - Incorporates user feedback (NEEDED / NOT_NEEDED / NOT_SURE)

2. **Weibull Distribution** — Activates after 5+ completions
   - Shape parameter beta: <0.8 early failures, 0.8–1.2 random, 1.2–3.5 wear-out, >3.5 highly predictable
   - Targets 90% reliability for interval recommendation

3. **Seasonal Adjustment** — Activates after 6+ months of history
   - Per-month multiplier (0.3x–3.0x)
   - Hemisphere-aware season mapping
   - Manual override per month

### Sensor Prediction (sensor_predictor.py)

When a task has a sensor-based trigger, the predictor analyzes recorder statistics to forecast:
- **Degradation rate**: Linear regression on historical sensor values, classified as stable/rising/falling
- **Threshold prediction**: Days until the sensor value reaches the trigger threshold
- **Environmental correlation**: Pearson correlation between an environmental sensor (temperature, humidity) and maintenance intervals, producing an adjustment factor

All predictions are pure-Python with no external ML dependencies. The predictor uses binary search (`_find_closest_value`) to correlate environmental sensor readings with maintenance completion timestamps.

---

## Frontend Architecture

**Build:** esbuild (TypeScript → ESM, minified)
**Framework:** LitElement 3 with decorators
**Two bundles:** `maintenance-panel.js` (~172KB) and `maintenance-card.js` (~87KB)

### Panel Views
1. **Overview**: Statistics dashboard, group list, budget status, sparklines, user filter
2. **Object Detail**: Metadata, task list with status indicators, action buttons, responsible user badges
3. **Task Detail**: Full info, history table, trigger status, adaptive recommendations, sparkline charts, responsible user display

### Real-Time Updates
- WebSocket subscription (`maintenance_supporter/subscribe`)
- Frontend caches object list, updates on delta events
- No polling needed

### Dialogs
- Object create/edit
- Task create/edit (with trigger configuration, responsible user assignment)
- Complete task (notes, cost, duration, checklist)
- QR code generation (print, download SVG)

---

## Notification System

Multi-channel notification with:
- **Per-status intervals**: Configurable repeat frequency for due_soon, overdue, triggered
- **Quiet hours**: Suppress during configured time window
- **Bundling**: Combine N+ pending tasks into single notification
- **Daily limits**: Cap maximum notifications per day
- **Snooze**: Per-task temporary suppression
- **Mobile actions**: Complete / Skip / Snooze buttons via Companion App
  - Action format: `MS_{ACTION}_{entry_id}_{task_id}`
  - Parsed by `_handle_notification_action()` in `__init__.py`
- **User-specific notifications**: Tasks assigned to a responsible user trigger separate notifications to that user's registered notification services, with fallback to global notification service
- **Budget alerts**: Monthly/yearly budget threshold alerts with 24h rate limiting

---

## WebSocket API

32 commands organized by function:

| Category | Commands |
|----------|----------|
| **Read** | `objects`, `object`, `statistics`, `subscribe`, `templates`, `budget_status`, `groups`, `settings`, `tasks/by_user` |
| **Object CRUD** | `object/create`, `object/update`, `object/delete` |
| **Task CRUD** | `task/create`, `task/update`, `task/delete`, `tasks/list` |
| **Task Actions** | `task/complete`, `task/skip`, `task/reset` |
| **Group CRUD** | `group/create`, `group/update`, `group/delete` |
| **User Assignment** | `task/assign_user`, `users/list` |
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
| docs-removal-instructions | Bronze | Yes (README → Uninstalling) |
| config-entry-unloading | Silver | Yes |
| test-coverage (>95%) | Silver | Yes (95%, 964 tests) |
| strict-typing (mypy --strict) | Silver | Yes |
| parallel-updates | Silver | Yes (sensor + calendar) |
| docs-configuration-parameters | Silver | Yes (docs/CONFIGURATION.md) |
| entity-device-class | Gold | Yes (SensorDeviceClass.ENUM) |
| icon-translations | Gold | Yes (icons.json) |
| stale-devices | Gold | Yes (async_remove_config_entry_device) |
| exception-translations | Gold | Yes (strings.json exceptions) |
| entity-category | Gold | Yes (calendar = DIAGNOSTIC) |
| diagnostics | Gold | Yes (with PII redaction) |
| repair-issues | Gold | Yes (missing trigger entities) |
| docs-supported-functions | Gold | Yes (README → Supported Functions) |
| docs-data-update | Gold | Yes (README → Data Updates) |
| docs-use-cases | Gold | Yes (README → Use Cases) |
| docs-examples | Gold | Yes (README → Examples) |
| docs-known-limitations | Gold | Yes (README → Known Limitations) |
| docs-troubleshooting | Gold | Yes (README → Troubleshooting) |

---

## Test Coverage

**964 tests** across **53 test files** with **95% code coverage** (5,979 statements, 308 uncovered).

### Coverage by Module

| Module | Stmts | Miss | Cover |
|--------|-------|------|-------|
| `__init__.py` | 207 | 12 | 94% |
| `coordinator.py` | 423 | 14 | 97% |
| `sensor.py` | 234 | 4 | 98% |
| `calendar.py` | 117 | 3 | 97% |
| `config_flow.py` | 256 | 12 | 95% |
| `config_flow_options_task.py` | 467 | 18 | 96% |
| `config_flow_options_global.py` | 145 | 18 | 88% |
| `config_flow_trigger.py` | 338 | 56 | 83% |
| `const.py` | 168 | 0 | 100% |
| `diagnostics.py` | 84 | 0 | 100% |
| `repairs.py` | 108 | 5 | 95% |
| `panel.py` | 32 | 0 | 100% |
| `templates.py` | 25 | 0 | 100% |
| **Triggers** | | | |
| `base_trigger.py` | 121 | 3 | 98% |
| `threshold.py` | 53 | 1 | 98% |
| `counter.py` | 44 | 5 | 89% |
| `state_change.py` | 80 | 5 | 94% |
| `runtime.py` | 161 | 7 | 96% |
| `compound.py` | 136 | 3 | 98% |
| **Helpers** | | | |
| `interval_analyzer.py` | 312 | 17 | 95% |
| `sensor_predictor.py` | 271 | 18 | 93% |
| `notification_manager.py` | 267 | 5 | 98% |
| `entity_analyzer.py` | 121 | 4 | 97% |
| `threshold_calculator.py` | 61 | 0 | 100% |
| **WebSocket** | | | |
| `websocket/__init__.py` | 87 | 0 | 100% |
| `websocket/tasks.py` | 235 | 9 | 96% |
| `websocket/objects.py` | 71 | 2 | 97% |
| `websocket/analysis.py` | 111 | 0 | 100% |
| `websocket/users.py` | 65 | 0 | 100% |
| `websocket/io.py` | 63 | 0 | 100% |
| `websocket/dashboard.py` | 104 | 8 | 92% |
| `websocket/groups.py` | 77 | 1 | 99% |
| **TOTAL** | **5,979** | **308** | **95%** |

### Test Files

| Test File | Tests | Scope |
|-----------|-------|-------|
| `test_triggers.py` | ~80 | All trigger types, multi-entity, edge cases |
| `test_options_flow.py` | ~60 | Options flow management |
| `test_config_flow.py` | ~35 | Config flow steps, validation |
| `test_notifications.py` | ~40 | Notification delivery, quiet hours, bundling |
| `test_phase2_features.py` | ~30 | Checklist, groups, budgets |
| `test_ws_task_handlers.py` | ~30 | WebSocket task CRUD + actions |
| `test_coordinator_prediction.py` | ~30 | Sensor prediction, fallback triggers, budget |
| `test_sensor_predictions.py` | ~25 | Degradation analysis, threshold prediction |
| `test_config_flow_template.py` | ~25 | Object template creation |
| `test_adaptive_scheduling.py` | ~25 | EWA, Weibull, interval computation |
| `test_sensor_predictor.py` | ~33 | Pure unit tests for sensor_predictor |
| `test_coverage_final.py` | ~24 | Helper functions, diagnostics, budget edges |
| `test_trigger_events.py` | ~19 | Event-driven trigger state changes |
| `test_seasonal_scheduling.py` | ~20 | Seasonal factors, hemisphere support |
| `test_coordinator.py` | ~20 | Coordinator core logic |
| `test_options_global.py` | ~20 | Global options flow |
| `test_options_task.py` | ~25 | Task options flow |
| `test_notification_deep.py` | ~20 | Notification edge cases |
| `test_coordinator_deep.py` | ~20 | Coordinator deep coverage |
| `test_config_flow_trigger.py` | ~20 | Trigger config flow steps |
| `test_compound_trigger.py` | ~18 | Compound trigger scenarios |
| `test_edge_cases.py` | ~15 | Boundary conditions, error handling |
| `test_sensor_attributes.py` | ~15 | Sensor attribute computation |
| `test_ws_analysis.py` | ~15 | WS analysis commands |
| `test_sensor_trigger_attrs.py` | ~15 | Trigger-specific sensor attributes |
| `test_ws_dashboard.py` | ~15 | WS dashboard commands |
| `test_ws_io.py` | ~12 | WS import/export/QR |
| `test_ws_objects.py` | ~12 | WS object CRUD |
| `test_ws_groups.py` | ~12 | WS group CRUD |
| `test_calendar_unit.py` | ~12 | Calendar event generation |
| `test_repair_flow.py` | ~15 | Repair flow steps |
| `test_ws_users.py` | ~10 | WS user management |
| `test_calendar_deep.py` | ~10 | Calendar edge cases |
| `test_sensor_deep.py` | ~10 | Sensor edge cases |
| `test_entity_analyzer.py` | ~10 | Entity discovery + stats |
| `test_panel_threshold.py` | ~10 | Panel + threshold calculator |
| `test_diagnostics.py` | ~8 | Diagnostic data, PII redaction |
| `test_init_services.py` | ~10 | Service handlers, unload |
| `test_status_computation.py` | ~10 | Status logic (OK, DUE_SOON, OVERDUE) |
| `test_issue_fixes.py` | ~15 | Regression tests for bug fixes |
| `test_services.py` | ~8 | Complete, skip, reset services |
| `test_calendar.py` | ~8 | Calendar basic tests |
| `test_entity_lifecycle.py` | ~5 | Entity setup/teardown |
| `test_qr_generation.py` | ~5 | QR URL building, SVG generation |

---

## Extensibility

- **New trigger type**: Subclass `BaseTrigger`, implement `evaluate()` and `_handle_state_change_event()`, register in factory (`entity/triggers/__init__.py`)
- **New helper**: Add module to `helpers/`, integrate in coordinator
- **New platform**: Add entity module, register in `const.PLATFORMS`
- **New WS command**: Add handler in the appropriate `websocket/*.py` module, import and register in `websocket/__init__.py`
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

### Running Tests

**Unit tests** (via pytest inside container):
```bash
docker exec ha-dev sh -c "cd /config && python -m pytest tests/ -v"
```

**With coverage**:
```bash
docker exec ha-dev sh -c "cd /config && python -m pytest tests/ --cov=custom_components.maintenance_supporter --cov-report=term-missing -q"
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
