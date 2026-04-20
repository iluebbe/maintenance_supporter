# Maintenance Supporter — Architecture & Design

A Home Assistant custom integration for tracking, scheduling, and predicting maintenance of household objects and devices. Combines time-based scheduling, sensor-driven triggers, adaptive ML algorithms, and environmental correlation for intelligent maintenance management.

**Version:** 1.0.30 | **~27,000 lines** across 70 source files (50 Python + 19 TypeScript) | **0 external Python dependencies** | **96% test coverage** (1,433 tests)

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
                         |                   |
                         |                   |    +-------------------+
                         |                   +--->| Binary Sensor     |
                         |                   |    | (per task)        |
                         |                   |    | - is_on = problem |
                         |                   |    +-------------------+
+-------------------+    | - history         |
|   WebSocket API   |--->|                   |    +-------------------+
| (37 commands)     |    +--------+----------+    |  Calendar Entity  |
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

### Two-Tier Storage (ConfigEntry + Store)
Static task configuration (name, type, interval, trigger thresholds, `created_at`) lives in `ConfigEntry.data` and is only written on explicit user edits or via `async_migrate_entry` on schema bumps (e.g. minor_version 1 → 2 backfilled `created_at`). Frequently-changing dynamic state (history, last_performed, adaptive_config, trigger_runtime) lives in per-entry Store files (`.storage/maintenance_supporter.<entry_id>`), using debounced 60-second writes to minimize SD-card wear on Raspberry Pi.

One-time idempotent migration on first load extracts dynamic fields from ConfigEntry.data into the Store. All consumers use `store.merge_all_tasks()` to recombine static + dynamic data at read time.

### Coordinator as Central Hub
All data flows through `MaintenanceCoordinator` (one per object):
- Periodic refresh every 5 minutes
- Computes task status (OK / DUE_SOON / OVERDUE / TRIGGERED)
- Manages trigger state preservation between refreshes
- Runs adaptive interval analysis and sensor predictions
- Tracks entity availability with grace periods
- Checks budget thresholds and sends notifications
- Writes dynamic state to Store (debounced), static config to ConfigEntry

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
- 13 object templates with pre-configured tasks and triggers

### Pure Python Helpers
`interval_analyzer` has zero HA dependencies, enabling isolated unit testing and reuse outside HA. `sensor_predictor` and `entity_analyzer` depend on the HA recorder and state machine for data access, but their core algorithms (linear regression, Pearson correlation, Weibull analysis) are pure Python.

### Time & Date Handling
All time/date code uses `homeassistant.util.dt` (`dt_util`) — never `datetime.now()`, `datetime.utcnow()`, or `date.today()` from stdlib. This ensures consistency between the running HA timezone and the values written/compared in code, regardless of what the host system clock reports.

| Use case | Helper |
|---|---|
| "Now" in HA timezone | `dt_util.now()` (returns aware `datetime`) |
| "Now" in UTC for storage | `dt_util.utcnow()` |
| Today's date in HA timezone | `dt_util.now().date()` |
| Convert aware → HA-local | `dt_util.as_local(dt)` |

**Reads from history/storage** must defensively reattach a timezone to naive ISO strings (legacy data may exist). The pattern used throughout the codebase:
```python
dt = datetime.fromisoformat(ts)
if dt.tzinfo is None:
    dt = dt.replace(tzinfo=dt_util.DEFAULT_TIME_ZONE)
```
**Writes** always produce TZ-aware ISO strings via `dt_util.now().isoformat()` so subsequent reads get a `tzinfo`.

**`next_due` anchor chain** (in priority order):
1. `last_performed` — when the task was actually performed
2. `created_at` — when the task was created (added in v1.0.34, schema-migrated for legacy entries)
3. `dt_util.now().date()` — defensive fallback only

This order ensures a task without history schedules from creation date instead of "today" on every refresh.

---

## File Structure

```
custom_components/maintenance_supporter/
├── __init__.py                    (540 lines)  Integration setup, services, lifecycle
├── const.py                       (297 lines)  Constants, enums, defaults
├── coordinator.py               (1,078 lines)  DataUpdateCoordinator per object
├── storage.py                     (344 lines)  Per-entry Store (dynamic state, migration)
│
├── config_flow.py                 (905 lines)  Initial setup flow + templates
├── config_flow_helpers.py          (62 lines)  Shared config flow utilities
├── config_flow_options.py          (13 lines)  Options dispatcher
├── config_flow_options_global.py  (663 lines)  Global settings (notifications, budgets, panel)
├── config_flow_options_task.py  (1,394 lines)  Per-object task management
├── config_flow_trigger.py       (1,148 lines)  TriggerConfigMixin for trigger UI
│
├── sensor.py                      (399 lines)  MaintenanceSensor (enum, per task)
├── binary_sensor.py               (198 lines)  MaintenanceBinarySensor (problem, per task)
├── calendar.py                    (359 lines)  MaintenanceCalendar (global, all tasks)
├── entity/
│   ├── entity_base.py              (56 lines)  CoordinatorEntity base class
│   └── triggers/
│       ├── __init__.py            (170 lines)  Factory: create_triggers(), multi-entity
│       ├── base_trigger.py        (300 lines)  Abstract base with availability tracking
│       ├── threshold.py           (105 lines)  Value above/below trigger
│       ├── counter.py             (115 lines)  Accumulated value trigger
│       ├── state_change.py        (200 lines)  State transition counter
│       ├── runtime.py             (329 lines)  Accumulated operating hours trigger
│       └── compound.py            (324 lines)  AND/OR compound trigger
│
├── websocket/                               37 WS commands, split by domain
│   ├── __init__.py              (297 lines)  Shared helpers + registration
│   ├── objects.py               (211 lines)  Object CRUD (5 handlers)
│   ├── tasks.py                 (729 lines)  Task CRUD + validation + actions (7 handlers)
│   ├── groups.py                (166 lines)  Group CRUD (4 handlers)
│   ├── analysis.py              (277 lines)  Adaptive scheduling (4 handlers)
│   ├── users.py                 (139 lines)  User management (3 handlers)
│   ├── io.py                    (245 lines)  Export/import/CSV/QR/templates (5 handlers)
│   ├── dashboard.py             (510 lines)  Subscribe, statistics, settings, budget, global update/test (6 handlers)
│   └── tags.py                   (40 lines)  NFC tag listing (1 handler)
├── panel.py                        (62 lines)  Sidebar panel registration
├── frontend/
│   ├── __init__.py                 (33 lines)  Lovelace card registration
│   ├── maintenance-panel.js                  Built panel (esbuild output)
│   └── maintenance-card.js                   Built card (esbuild output)
├── frontend-src/                (9,027 lines)  TypeScript sources
│   ├── maintenance-panel.ts     (1,488 lines)  Panel: overview, object detail, task detail
│   ├── maintenance-card.ts        (287 lines)  Lovelace card
│   ├── maintenance-card-editor.ts  (86 lines)
│   ├── panel-styles.ts            (891 lines)  Panel-specific CSS
│   ├── statistics-service.ts      (215 lines)  WS statistics cache
│   ├── styles.ts                (2,676 lines)  Shared CSS, i18n (9 languages), shared helpers
│   ├── types.ts                   (286 lines)  TypeScript interfaces
│   ├── user-service.ts            (125 lines)  HA user list cache
│   └── components/              (2,145 lines)
│       ├── complete-dialog.ts     (242 lines)  Mark task complete
│       ├── confirm-dialog.ts      (141 lines)  Generic confirmation dialog
│       ├── settings-view.ts       (580 lines)  In-panel global settings editor
│       ├── task-dialog.ts         (629 lines)  Add/edit task
│       ├── object-dialog.ts       (153 lines)  Add/edit object
│       └── qr-dialog.ts          (400 lines)  QR code generation
│
├── helpers/                     (3,661 lines)
│   ├── interval_analyzer.py       (730 lines)  EWA + Weibull + seasonal analysis
│   ├── sensor_predictor.py        (640 lines)  Degradation + environmental correlation
│   ├── notification_manager.py    (~740 lines)  Multi-channel notification system
│   ├── entity_analyzer.py         (210 lines)  Entity discovery + recorder stats
│   ├── csv_handler.py             (196 lines)  CSV import/export
│   ├── entity_attributes.py      (239 lines)  Domain→attribute mapping for trigger setup
│   ├── threshold_calculator.py    (132 lines)  Threshold suggestion engine
│   ├── qr_generator.py           (151 lines)  QR code URL builder + SVG generator
│   └── qrcodegen.py              (700 lines)  Vendored QR library (Nayuki, MIT)
│
├── models/                        (483 lines)
│   ├── maintenance_task.py        (344 lines)  Task: schedule, triggers, history, status
│   ├── maintenance_object.py       (53 lines)  Object: name, area, manufacturer, model
│   └── maintenance_type.py         (86 lines)  Predefined maintenance categories
│
├── templates.py                   (226 lines)  13 object templates (car, pool, HVAC, ...)
├── repairs.py                     (315 lines)  Missing trigger entity repair flow
├── diagnostics.py                 (231 lines)  Integration diagnostics with PII redaction
├── export.py                      (161 lines)  JSON/YAML data export
│
├── manifest.json                            Integration metadata
├── services.yaml                            Service definitions
├── strings.json                             Localization keys
├── icons.json                               State-based icon mappings
└── translations/{en,de,nl,fr,it,es,pt,ru,uk}.json  9 languages (backend config flow)
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
      │   (next_due anchor = last_performed if set, else created_at,
      │    else today; + interval_days)
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
      ├─ Merge trigger_config with Store runtime (_trigger_state)
      └─> create_triggers(type, entity_ids) → list of trigger instances
          ├─ Single entity → 1 trigger (per-entity state injected)
          ├─ Multi-entity → N triggers (one per entity_id)
          │   ├─ Per-entity state from _trigger_state dict
          │   └─ Aggregated via entity_logic (any/all)
          └─ Compound → 1 CompoundTrigger with sub-triggers
              ├─ Each condition → create_triggers() for condition's entities
              ├─ CompoundSubEntity proxies aggregate per-condition
              ├─ compound_logic (AND/OR) aggregates across conditions
              └─ Flat _compound_N_entity keys restructured to conditions[] on read

For each trigger:
  └─> async_setup()
      ├─ Register async_track_state_change_event listener
      ├─ If entity unavailable at setup → schedule retry (30s)
      ├─ RuntimeTrigger: restore accumulated_seconds + on_since, start periodic timer
      ├─ CounterTrigger: restore baseline from _trigger_state, then initialize if needed
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
          ├─ Works for flat triggers AND compound trigger sub-entities
          ├─ Replace updates entity_id inside conditions (top-level or
          │  nested trigger_config sub-dict)
          └─ Remove from compound: <2 conditions left → demoted to flat
```

### Service/WS Action Flow
```
Service call or WebSocket command
  └─> Find coordinator for entry
      └─> coordinator.complete_maintenance(task_id, notes, cost, duration)
          ├─ Read merged task data (ConfigEntry static + Store dynamic)
          ├─ Append history entry (timestamp, type, notes, cost, duration, feedback)
          ├─ Update last_performed
          ├─ Reset trigger baseline (if counter trigger)
          ├─ Reset change count (if state_change trigger)
          ├─ Reset accumulated hours (if runtime trigger)
          ├─ Update adaptive config (if adaptive enabled)
          ├─ Write dynamic state → Store (debounced 1s)
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
- Threshold triggers with `trigger_for_minutes` persist their `exceeded_since` timestamp to the Store. On HA restart, the recovery path in `ThresholdTrigger.__init__` computes elapsed time and either triggers immediately or starts a timer with the remaining duration
- Fallback evaluation in coordinator during periodic refresh
- Attribute-based triggering (monitor an entity attribute instead of state)

RuntimeTrigger additionally:
- Persists `accumulated_seconds` + `on_since` to Store for restart recovery
- Periodic persistence every 5 minutes (debounced, minimizes data loss on crash)
- Pauses accumulation when entity becomes unavailable
- Configurable `on_states` (default: `["on"]`, customizable to `["running", "active"]` etc.)
- Reset clears hours but keeps tracking if entity is still ON

### Multi-Entity Support

All trigger types support multiple `entity_ids` with configurable `entity_logic`:
- **any** (default): Trigger activates when *any* entity meets the condition
- **all**: Trigger activates only when *all* entities meet the condition

Implementation: `create_triggers()` creates one trigger instance per entity_id. Per-entity runtime state (baselines, accumulated seconds, change counts) is persisted in the Store's `trigger_runtime` dict, keyed by entity_id. At read time, `merge_task_data()` injects this back into `trigger_config._trigger_state` for compatibility. Legacy flat keys in ConfigEntry are auto-migrated to Store on first load.

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
- **Degradation rate**: Linear regression on historical sensor values (X-normalized to avoid catastrophic cancellation with Unix timestamps), classified as stable/rising/falling
- **Threshold prediction**: Days until the sensor value reaches the trigger threshold
- **Environmental correlation**: Pearson correlation between an environmental sensor (temperature, humidity) and maintenance intervals, producing an adjustment factor

All predictions are pure-Python with no external ML dependencies. The predictor uses binary search (`_find_closest_value`) to correlate environmental sensor readings with maintenance completion timestamps.

---

## Frontend Architecture

**Build:** esbuild (TypeScript → ESM, minified)
**Framework:** LitElement 3 with decorators
**Two bundles:** `maintenance-panel.js` (~245KB) and `maintenance-card.js` (~111KB)

### Panel Views
1. **Overview (Dashboard tab)**: Statistics dashboard, group list, budget status, sparklines, user filter
2. **Overview (Settings tab)**: In-panel global settings editor — feature toggles, general settings, notification config, mobile actions, budget, JSON/CSV import/export. Writes via `maintenance_supporter/global/update` WS command (same storage as config flow options)
3. **Object Detail**: Metadata, task list with status indicators, action buttons, responsible user badges
4. **Task Detail**: Full info, history table, trigger status, adaptive recommendations, sparkline charts, responsible user display

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
- **NFC tag linking**: Tasks can be linked to NFC tags via `nfc_tag_id`. Scanning a tag fires HA's `tag_scanned` event, which the integration listens for in `async_setup()` and auto-completes the matching task
- **Test notification**: Available via Options Flow and `global/test_notification` WS command to verify service config

---

## WebSocket API

37 commands organized by function:

| Category | Commands |
|----------|----------|
| **Read** | `objects`, `object`, `statistics`, `subscribe`, `templates`, `budget_status`, `groups`, `settings`, `tasks/by_user` |
| **Object CRUD** | `object/create`, `object/update`, `object/delete` |
| **Task CRUD** | `task/create`, `task/update`, `task/delete`, `tasks/list` |
| **Task Actions** | `task/complete`, `task/skip`, `task/reset` |
| **Group CRUD** | `group/create`, `group/update`, `group/delete` |
| **Global Settings** | `global/update`, `global/test_notification` |
| **User Assignment** | `task/assign_user`, `users/list` |
| **Analysis** | `analyze_interval`, `apply_suggestion`, `seasonal_overrides`, `set_environmental_entity` |
| **Import/Export** | `export_data`, `export_csv`, `import_csv`, `import_json` |
| **QR** | `qr/generate` |
| **Entity Introspection** | `entity/attributes` |
| **NFC Tags** | `tags/list` |

All write commands fire events for subscription updates.

### Frontend Coverage

As of v1.0.35, 35 of the 37 backend endpoints are consumed by the Lit panel. The remaining 2 are genuinely obsolete for the panel but kept as public API.

| Endpoint | Status | Linked Feature Flag | UI Location |
|---|---|---|---|
| `task/analyze_interval` | Wired | `advanced_adaptive_visible` | "Re-analyze" button in the recommendation card (task detail) — shows fresh analysis as a toast. |
| `task/seasonal_overrides` | Wired | `advanced_seasonal_visible` | "Edit seasonal factors" button under the expanded seasonal chart — opens a 12-month editor dialog with validation (0.1–5.0 per month, empty = learned). |
| `task/set_environmental_entity` | Wired | `advanced_environmental_visible` | Environmental sensor + optional attribute fields in the task dialog (only shown for `schedule_type == "sensor_based"`). Saved via dedicated endpoint after the main task update. |
| `group/create`, `group/update`, `group/delete` | Wired | `advanced_groups_visible` | Full CRUD in the groups section of the panel: "New group" header button, per-card edit/delete icons, unified group dialog with multi-checkbox task selector grouped by object. |
| `global/test_notification` | Wired | — (part of Settings) | "Send test" button next to the notify_service field in Settings (disabled when no service configured). |
| `task/list` | **Obsolete** | — | Superseded by `objects`, which already returns each object's tasks nested. Left in place for legacy tests / external consumers; nothing in the panel or the config flow calls it. |
| `templates` | **Obsolete** (for the panel) | — | The config flow imports `templates.py` directly when offering preset templates; the panel never browses templates at runtime. Endpoint remains as a public read-only catalogue for external tools. |

None of these are **missing/broken** — every frontend call has a matching backend handler, and every advanced-feature flag now has a working UI binding. Before deleting `task/list` or `templates`, check whether any automation/script relies on them.

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
| test-coverage (>95%) | Silver | Yes (96%, 1,433 tests) |
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

**1,433 tests** across **70 test files** with **96% code coverage**.

### Coverage by Module

| Module | Stmts | Miss | Cover |
|--------|-------|------|-------|
| `__init__.py` | 246 | 6 | 98% |
| `coordinator.py` | 528 | 9 | 98% |
| `sensor.py` | 201 | 6 | 97% |
| `binary_sensor.py` | 81 | 7 | 91% |
| `calendar.py` | 124 | 0 | 100% |
| `config_flow.py` | 260 | 14 | 95% |
| `config_flow_helpers.py` | 22 | 3 | 86% |
| `config_flow_options_task.py` | 523 | 11 | 98% |
| `config_flow_options_global.py` | 148 | 0 | 100% |
| `config_flow_trigger.py` | 335 | 50 | 85% |
| `const.py` | 177 | 0 | 100% |
| `diagnostics.py` | 103 | 2 | 98% |
| `repairs.py` | 135 | 0 | 100% |
| `panel.py` | 31 | 0 | 100% |
| `templates.py` | 25 | 0 | 100% |
| `storage.py` | 152 | 3 | 98% |
| `export.py` | 51 | 4 | 92% |
| **Triggers** | | | |
| `base_trigger.py` | 121 | 2 | 98% |
| `threshold.py` | 53 | 1 | 98% |
| `counter.py` | 55 | 5 | 91% |
| `state_change.py` | 85 | 4 | 95% |
| `runtime.py` | 161 | 3 | 98% |
| `compound.py` | 145 | 0 | 100% |
| `triggers/__init__.py` | 89 | 1 | 99% |
| **Helpers** | | | |
| `interval_analyzer.py` | 314 | 10 | 97% |
| `sensor_predictor.py` | 276 | 9 | 97% |
| `notification_manager.py` | 267 | 6 | 98% |
| `entity_analyzer.py` | 127 | 4 | 97% |
| `entity_attributes.py` | 25 | 0 | 100% |
| `threshold_calculator.py` | 61 | 0 | 100% |
| `csv_handler.py` | 81 | 6 | 93% |
| `qr_generator.py` | 69 | 2 | 97% |
| **WebSocket** | | | |
| `websocket/__init__.py` | 128 | 0 | 100% |
| `websocket/tasks.py` | 343 | 2 | 99% |
| `websocket/objects.py` | 81 | 0 | 100% |
| `websocket/analysis.py` | 124 | 0 | 100% |
| `websocket/users.py` | 66 | 0 | 100% |
| `websocket/io.py` | 91 | 10 | 89% |
| `websocket/dashboard.py` | 195 | 3 | 98% |
| `websocket/groups.py` | 80 | 1 | 99% |
| `websocket/tags.py` | 23 | 0 | 100% |
| **TOTAL** | **6,934** | **248** | **96%** |

### Test Files

| Test File | Tests | Scope |
|-----------|-------|-------|
| `test_triggers.py` | 85 | All trigger types, multi-entity, edge cases |
| `test_adaptive_scheduling.py` | 55 | EWA, Weibull, interval computation |
| `test_coverage_97.py` | 50 | Coverage batch 1: WS, coordinator, config flow edges |
| `test_sensor_predictions.py` | 45 | Degradation analysis, threshold prediction |
| `test_options_task.py` | 44 | Task options flow |
| `test_ws_task_handlers.py` | 42 | WebSocket task CRUD + actions |
| `test_sensor_predictor.py` | 41 | Pure unit tests for sensor_predictor |
| `test_coverage_final.py` | 41 | Helper functions, diagnostics, budget edges |
| `test_phase2_features.py` | 38 | Checklist, groups, budgets, export/CSV fields |
| `test_seasonal_scheduling.py` | 35 | Seasonal factors, hemisphere support |
| `test_storage.py` | 34 | Store CRUD, merge helpers, extract_dynamic, compound keys |
| `test_options_flow.py` | 34 | Options flow management |
| `test_notifications.py` | 32 | Notification delivery, quiet hours, bundling, dismiss |
| `test_notification_deep.py` | 29 | Notification edge cases |
| `test_config_flow.py` | 28 | Config flow steps, validation |
| `test_interval_anchor.py` | 26 | Interval anchoring: completion vs planned mode, edge cases, serialization |
| `test_options_global.py` | 26 | Global options flow |
| `test_coordinator_prediction.py` | 25 | Sensor prediction, fallback triggers, budget |
| `test_ws_dashboard.py` | 24 | WS dashboard commands |
| `test_issue_fixes.py` | 24 | Regression tests for bug fixes |
| `test_coverage_97c.py` | 24 | Coverage batch 3: sensor predictor, interval analyzer, coordinator, notifications |
| `test_status_computation.py` | 21 | Status logic (OK, DUE_SOON, OVERDUE) |
| `test_qr_generation.py` | 21 | QR URL building, SVG generation |
| `test_coordinator.py` | 21 | Coordinator core logic |
| `test_ws_objects.py` | 20 | WS object CRUD, task summary fields |
| `test_trigger_events.py` | 19 | Event-driven trigger state changes |
| `test_entity_analyzer.py` | 19 | Entity discovery + stats |
| `test_coverage_97b.py` | 19 | Coverage batch 2: task options flow, trigger config flow |
| `test_compound_trigger.py` | 19 | Compound trigger scenarios |
| `test_ws_groups.py` | 18 | WS group CRUD, cleanup_group_refs |
| `test_ws_analysis.py` | 18 | WS analysis commands |
| `test_config_flow_template.py` | 18 | Object template creation |
| `test_edge_cases.py` | 17 | Boundary conditions, error handling |
| `test_ws_io.py` | 15 | WS import/export/QR |
| `test_sensor_trigger_attrs.py` | 15 | Trigger-specific sensor attributes |
| `test_panel_threshold.py` | 15 | Panel + threshold calculator |
| `test_lifecycle_coverage.py` | 15 | Entity lifecycle, setup/teardown coverage |
| `test_entity_attributes.py` | 15 | Entity attribute introspection: domain mapping, WS endpoint, filtering |
| `test_sensor_attributes.py` | 14 | Sensor attribute computation |
| `test_repair_flow.py` | 14 | Repair flow steps |
| `test_calendar_unit.py` | 14 | Calendar event generation |
| `test_custom_icon_nfc.py` | 13 | Custom icons, NFC tag linking, task serialization |
| `test_coordinator_deep.py` | 13 | Coordinator deep coverage |
| `test_panel_frontend_integration.py` | 12 | Panel registration, frontend integration |
| `test_migration.py` | 12 | One-time migration, idempotency, crash recovery |
| `test_entity_removal.py` | 12 | Entity/device/attribute removal |
| `test_init_services.py` | 13 | Service handlers, unload, notification actions |
| `test_config_flow_trigger.py` | 11 | Trigger config flow steps |
| `test_binary_sensor.py` | 11 | Binary sensor platform: creation, is_on logic, attributes, lifecycle |
| `test_ws_users.py` | 10 | WS user management |
| `test_sensor_deep.py` | 8 | Sensor edge cases |
| `test_repairs_legacy.py` | 8 | Legacy repair flow compatibility |
| `test_integration_flows.py` | 8 | End-to-end integration flow tests |
| `test_entity_lifecycle.py` | 8 | Entity setup/teardown |
| `test_diagnostics.py` | 8 | Diagnostic data, PII redaction |
| `test_compound_legacy.py` | 8 | Legacy compound trigger compatibility |
| `test_calendar_deep.py` | 8 | Calendar edge cases |
| `test_settings_sync.py` | 7 | Panel settings ↔ config flow sync verification |
| `test_services.py` | 7 | Complete, skip, reset services |
| `test_error_recovery.py` | 7 | Error recovery, graceful degradation |
| `test_coordinator_legacy.py` | 7 | Legacy coordinator compatibility |
| `test_ws_tags.py` | 6 | WS NFC tag listing |
| `test_notify_status_transition.py` | 5 | Notification status transition edge cases |
| `test_calendar.py` | 5 | Calendar basic tests |
| `test_restart_resilience.py` | 4 | HA restart state preservation |
| `test_concurrent_operations.py` | 4 | Concurrent operation safety |
| `test_calendar_integration.py` | 4 | Calendar integration with HA |

---

## Extensibility

- **New trigger type**: Subclass `BaseTrigger`, implement `evaluate()` and `_handle_state_change_event()`, register in factory (`entity/triggers/__init__.py`)
- **New helper**: Add module to `helpers/`, integrate in coordinator
- **New platform**: Add entity module, register in `const.PLATFORMS`
- **New WS command**: Add handler in the appropriate `websocket/*.py` module, import and register in `websocket/__init__.py`
- **New template**: Add `ObjectTemplate` to `templates.py`
- **New language**: Add `translations/{lang}.json` for backend + dictionary in `styles.ts` for frontend (currently: EN, ES, PT, FR, DE, IT, NL)

---

## Development & Testing Infrastructure

### Docker Compose Environment

Three services in `compose.yaml`:

```
┌──────────────────────────────────────────────────────────────┐
│  ha-maint (:8125)       │  ha-maint-fresh      │  playwright │
│  HA 2026.4.1            │  (:8126)             │  v1.57.0    │
│  + libfaketime          │  HA 2026.4.1 stock   │  run-server │
│  custom_components r/w  │  read-only mounts    │  :3000      │
│  config-dev/ volume     │  profile: testing    │             │
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
2. Copies into HA 2026.3.1 image at `/usr/local/lib/faketime/`
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
HA_MAINT_PORT=8125
HA_FRESH_PORT=8126
FAKETIME_ENABLED=true
HA_TOKEN=<long-lived access token>
```

### Volume Mounts

```
./config-dev           → /config          (persistent HA config + database)
./custom_components    → /config/custom_components  (live code, r/w)
./faketime.txt         → /config/faketime.txt  (time offset, read-only)
```

Code changes in `custom_components/` are reflected immediately after `docker restart ha-maint`.

### Running Tests

**Unit tests** (via pytest inside container):
```bash
docker exec ha-maint sh -c "cd /config && python -m pytest tests/ -v"
```

**With coverage**:
```bash
docker exec ha-maint sh -c "cd /config && python -m pytest tests/ --cov=custom_components.maintenance_supporter --cov-report=term-missing -q"
```

**CI tests** (GitHub Actions):
```bash
pip install pytest pytest-homeassistant-custom-component
pytest tests/ -v
```

### Typical Development Workflow

1. Edit code in `custom_components/` or `frontend-src/`
2. If frontend changed: `npm run build` (esbuild)
3. `docker restart ha-maint`
4. Browser: `http://localhost:8125` (Ctrl+Shift+F5 for cache bust)
5. To test time-dependent features: edit `faketime.txt` (e.g., `+7d`)
6. Run tests: `docker exec ha-maint sh -c "cd /config && python -m pytest tests/ -v"`

### Demo Data Setup

**`scripts/setup_demo.py`** — Creates 9 maintenance objects (18 tasks) via HA's REST Config Flow API, covering all 5 trigger types and 3 schedule types. Also configures global options (panel, advanced features, budget).

| # | Object | Manufacturer / Model | Tasks | Trigger Types | Key Entities |
|---|--------|---------------------|-------|---------------|--------------|
| 1 | HVAC System | Daikin FTXM35R | Filter Replacement | threshold (< 60%) | `input_number.hvac_filter_airflow` |
| 2 | Family Car | VW Golf VIII | Oil Change, Tire Rotation | counter (15k km delta), time-based | `input_number.car_odometer` |
| 3 | Washing Machine | Bosch WAX32M92 | Drum Cleaning | state_change (50 on→off) | `input_boolean.washing_machine_running` |
| 4 | Water Softener | BWT Perla Silk M | Refill Salt | threshold (< 20%) | `input_number.water_softener_salt_level` |
| 5 | Workshop Compressor | Atlas Copco GA5 | Oil Change, Air Filter | runtime (500h), time-based | `input_boolean.workshop_compressor` |
| 6 | Water Filter System | BWT AQA Life S | Cartridge Replacement | compound OR (threshold + counter) | `input_number.water_filter_flow_rate`, `water_filter_total_liters` |
| 7 | Swimming Pool | — | pH Test, Water Treatment | manual, time-based (7d) | — |
| 8 | 3D Printer | Prusa MK4S | Nozzle Replacement, Lubrication | counter (500h abs), time-based | `input_number.printer_print_hours` |
| 9 | Electric Car | Tesla Model 3 | 6 tasks (tire pressure, brake pads, cabin filter, wipers, battery, charging) | multi-entity threshold (4 tire sensors, any-logic), threshold, time-based, runtime | `input_number.ev_tire_pressure_*`, `ev_brake_pad_thickness`, `ev_battery_soh`, `input_boolean.ev_charging` |

Usage: `python scripts/setup_demo.py` (requires HA running with valid token)

**`scripts/seed_history.py`** — Injects realistic historical maintenance data into Store files:

- 70 history entries across all 9 objects (~12 months of data, 69 completed + 1 skipped)
- Costs totaling ~€1,180, durations 5–45 min, feedback values
- Includes `completed`, `skipped`, and `triggered` entry types
- Sets `last_performed` dates for time-based schedule calculation

Must run after `setup_demo.py` with HA running (reads Store files from container):

**`scripts/seed_recorder.py`** — Populates the HA recorder SQLite database with 13 months of hourly statistics data for all test entities. This provides smooth, continuous sparkline charts in the frontend.

- 9,480 hourly statistics rows per numeric entity (395 days × 24h)
- Realistic data generators: degrading sensors (airflow, salt level), monotonic counters (odometer, print hours), seasonal patterns (temperature, humidity), sawtooth refills
- Reset events aligned with `seed_history.py` maintenance dates (same day offsets)
- Boolean entity state histories (washing machine cycles, compressor on/off, charging sessions)
- Maintenance sensor state histories matching Store history entries
- Auto-updates `config-dev/configuration.yaml` initial values to match the last generated value per entity, preventing sparkline discontinuities on HA restart
- Deterministic output via `random.seed(42)`

Must run after `seed_history.py` with HA **stopped** (writes directly to SQLite):

```bash
python scripts/setup_demo.py          # HA running
python scripts/seed_history.py         # HA running (restart needed after)
docker compose stop homeassistant-dev  # Stop HA
python scripts/seed_recorder.py        # Seeds DB + updates configuration.yaml
docker compose up -d homeassistant-dev # Start with seeded data
```

All three scripts are orchestrated by `scripts/init-dev.sh` which handles the full lifecycle automatically.

### Test Entity Reference

The `docker/config-dev/configuration.yaml` defines test entities grouped by trigger type:

**Threshold triggers** (`input_number`):

| Entity | Purpose | Initial | Unit |
|--------|---------|---------|------|
| `hvac_filter_airflow` | HVAC filter degradation | 72 | % |
| `water_softener_salt_level` | Salt level monitoring | 55 | % |
| `pool_ph_level` | Pool water quality | 7.4 | pH |
| `freezer_temperature` | Freezer monitoring | -20 | °C |
| `solar_panel_output` | Solar efficiency | 92 | % |
| `ev_tire_pressure_fl/fr/rl/rr` | Multi-entity tire pressure (4 sensors) | 2.3–2.5 | bar |
| `ev_brake_pad_thickness` | Brake wear | 8.2 | mm |
| `ev_battery_soh` | Battery state of health | 95.5 | % |

**Counter triggers** (`input_number`):

| Entity | Purpose | Initial | Unit |
|--------|---------|---------|------|
| `car_odometer` | Oil change by mileage | 55700 | km |
| `printer_print_hours` | Nozzle wear tracking | 1800 | h |
| `generator_run_cycles` | Generator maintenance | 1250 | cycles |
| `water_filter_total_liters` | Filter capacity | 16500 | L |
| `ev_odometer` | EV mileage tracking | 33000 | km |
| `hvac_energy_kwh` | Energy consumption | 1250 | kWh |

**State change / runtime triggers** (`input_boolean`):

| Entity | Purpose |
|--------|---------|
| `washing_machine_running` | Wash cycle counting (state_change) |
| `dishwasher_running` | Dishwasher cycles |
| `workshop_compressor` | Compressor runtime tracking |
| `server_rack_fan` | Server fan runtime |
| `garage_door_motor` | Door cycle counting |
| `heat_pump_active` | Heat pump runtime |
| `pool_pump_active` | Pool pump runtime |
| `ev_charging` | EV charging cycle log (runtime) |

**Compound trigger** (`input_number`):

| Entity | Purpose | Initial | Unit |
|--------|---------|---------|------|
| `water_filter_flow_rate` | Flow rate threshold condition | 3.5 | L/min |
| `water_filter_total_liters` | Volume counter condition | 16500 | L |

**Environmental correlation** (`input_number`):

| Entity | Purpose | Initial | Unit |
|--------|---------|---------|------|
| `outdoor_temperature` | Outdoor temp | 12 | °C |
| `outdoor_humidity` | Outdoor humidity | 55 | % |
| `indoor_temperature` | Indoor temp | 22 | °C |
| `indoor_humidity` | Indoor humidity | 45 | % |

**Template sensors**:

| Entity | Purpose |
|--------|---------|
| `sensor.hvac_efficiency` | Derived from airflow + temperature delta |
| `sensor.compressor_load` | Derived from energy consumption |
| `binary_sensor.water_filter_alert` | Flow rate < 2.0 L/min alert |

### Screenshot Capture

Automated screenshot generation for README documentation:

```bash
cd docker
docker compose --profile testing up -d   # Start Playwright server
cd ../custom_components/maintenance_supporter/frontend-src
node capture-readme-screenshots.mjs      # Outputs to docs/images/
```

Requires demo data to be set up first. Captures 12 screenshots covering dashboard, object detail, task detail, history, dialogs, config, Lovelace card, calendar, entity attributes, and mobile views.
