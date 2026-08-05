# Maintenance Supporter — Architecture & Design

A Home Assistant custom integration for tracking, scheduling, and predicting maintenance of household objects and devices. Combines time-based scheduling, sensor-driven triggers, adaptive ML algorithms, and environmental correlation for intelligent maintenance management.

**Version:** 2.51.1 | 197 source files (129 Python + 68 TypeScript) | **98% test coverage** (3,282 backend tests + 373 frontend tests)

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
|   Services API    |--->|   Coordinator     |--->|   Sensor Entities |
| (9 services:      |    | (per object)      |    | (status/next-due/ |
|  complete, skip,  |    | - status compute  |    |  days-until-due   |
|  reset,           |    | - trigger mgmt    |    |  per task; parts, |
|  export_data,     |    | - predictions     |    |  summary, fleet,  |
|  add_object,      |    |                   |    |  doc storage)     |
|  add_task,        |    |                   |    +-------------------+
|  update_task,     |    |                   |    +-------------------+
|  delete_task,     |    |                   +--->| Binary Sensor     |
|  list_tasks)      |    |                   |    | (per task)        |
+-------------------+    |                   |    | - is_on = problem |
                         |                   |    +-------------------+
+-------------------+    | - history         |    +-------------------+
|   WebSocket API   |--->|                   +--->|  Button Entities  |
| (85 commands)     |    +--------+----------+    | (complete / skip /|
| - CRUD objects    |             |          |    |  reset, per task) |
| - statistics      |             |          |    +-------------------+
| - subscribe       |             |          |    +-------------------+
| - battery fleet   |             |          +--->|  Calendar Entity  |
| - documents/parts |             |          |    | (global, all tasks)|
| - saved views     |             |          |    +-------------------+
| - discovery       |             |          |    +-------------------+
+-------------------+             |          +--->|  To-do List       |
                                  |               | (global, all tasks)|
+-------------------+             v               +-------------------+
|   Frontend Panel  |    +-------------------+
| (LitElement + TS) |    |  Trigger System   |    +-------------------+
| - today           |    | (threshold,       |    |  Notification Mgr |
| - overview        |    |  counter,         |    | - per-status      |
| - calendar        |    |  state_change,    |    | - quiet hours     |
| - settings        |    |  runtime,         |    | - mobile actions  |
| - object detail   |    |  compound)        |    | - user-specific   |
| - task detail     |    | - multi-entity    |    +-------------------+
| - dialogs         |    | - per-entity state|
+-------------------+    +-------------------+    +-------------------+
                                                  | Assist / Voice    |
+-------------------+    +-------------------+    | (8 intents)       |
|  Lovelace Cards   |    |   Helpers         |    | + Logbook         |
|  + dashboard      |    |                   |    +-------------------+
|    strategy       |    | - interval_analyzer (EWA + Weibull)
+-------------------+    | - sensor_predictor (degradation + env)
                         | - entity_analyzer (stats + discovery)
                         | - signatures/ (123 integrations, 231 signals)
                         | - battery_fleet, documents, parts, saved_views
                         | - notification_manager, csv_handler, qr_generator
                         +-------------------+
```

---

## Core Design Decisions

### Two-Entry Model
- **Global entry** (`GLOBAL_UNIQUE_ID`): Integration-wide settings, panel toggle, notification config, currency (1.4.9+ in General Settings, was under Budget), budgets
- **Per-object entries**: One config entry per maintenance object, each with its own coordinator

This enables per-object lifecycle management (add/remove objects independently) while sharing resources like the NotificationManager and panel registration.

### Two-Tier Storage (ConfigEntry + Store)
Static task configuration (name, type, interval, trigger thresholds, `created_at`) lives in `ConfigEntry.data` and is only written on explicit user edits or via `async_migrate_entry` on schema bumps (e.g. minor_version 1 → 2 backfilled `created_at`). Frequently-changing dynamic state (history, last_performed, adaptive_config, trigger_runtime) lives in per-entry Store files (`.storage/maintenance_supporter.<entry_id>`), using debounced 60-second writes to minimize SD-card wear on Raspberry Pi.

One-time idempotent migration on first load extracts dynamic fields from ConfigEntry.data into the Store. All consumers use `store.merge_all_tasks()` to recombine static + dynamic data at read time.

`async_migrate_entry` is currently at **`MINOR_VERSION = 4`** (`config_flow.py`), applying every pending step in order on load:

| Step | What it does |
|---|---|
| 1 → 2 (issue #30) | Backfills `created_at` from the earliest history timestamp (or today), so `next_due` has a real anchor instead of always resolving to "today" |
| 2 → 3 (schedule-model v2) | Rewrites the flat recurrence fields into the nested `schedule` object via `normalize_task_storage()` |
| 3 → 4 (discussion #49) | Seeds `responsible_user_id` on **rotation** tasks that were configured without an initial assignee, via `helpers/sanitize.py::seed_rotation_assignee` — those tasks were invisible to every user filter (panel, card, calendar card, saved views, per-user notifications) until their first completion ran `advance_rotation` |

### Coordinator as Central Hub
All data flows through `MaintenanceCoordinator` (one per object):
- Periodic refresh every 5 minutes
- Computes task status (OK / DUE_SOON / OVERDUE / TRIGGERED)
- Manages trigger state preservation between refreshes
- Runs adaptive interval analysis and sensor predictions
- Tracks entity availability with grace periods
- Checks budget thresholds and sends notifications
- Writes dynamic state to Store (debounced), static config to ConfigEntry

### Single-Source Status Aggregation (2.4.0+)
Cross-object KPI counts (overdue / due_soon / triggered / needs_attention / ok / total_tasks) are computed in exactly one place — `helpers/aggregate.py::compute_status_counts`. That single function feeds three surfaces so they can never disagree:
- the `maintenance_supporter/statistics` WebSocket endpoint (panel KPI chips + Lovelace card header — it projects the historical subset of keys),
- the six global **summary sensors** (`sensor.maintenance_supporter_*`) via a no-poll `MaintenanceSummaryCoordinator` on the global entry, and
- the dashboard-strategy Overview headline (which renders the summary entities through a markdown template).

The summary coordinator never polls: it recomputes when any object coordinator updates, when a new object entry appears (`SIGNAL_NEW_OBJECT_ENTRY`), or when a trigger flips (`EVENT_TRIGGER_ACTIVATED` / `EVENT_TRIGGER_DEACTIVATED`) — mirroring the live-update path of `maintenance_supporter/subscribe`. Counts read each task's coordinator-computed `_status` (disabled tasks are already forced to `ok`), so the entities, panel chips, and strategy headline always show identical numbers.

### Archive & Retention (2.10.0+)
Tasks and objects can be **archived** — retired without deleting, so the long-term record (cost/budget, warranty, completion history, adaptive learning) survives. `archived` is a status with **highest precedence**: it's checked first in both `MaintenanceTask.status` and its dict twin `helpers/status.py::compute_status_from_task_dict`, so an archived item reads `archived` regardless of due/trigger state. That single status change makes it inert at most consumers *for free* — `archived` isn't in `_PROBLEM_STATUSES` (binary_sensor off), `notify_statuses` (no notifications), or `_COUNTED_STATUSES` (excluded from KPI counts). The rest filter explicitly: the coordinator short-circuits archived tasks (no trigger eval / adaptive / issue checks), the calendar and the `compute_status_counts` *total* skip them, action buttons go unavailable, and sensor trigger setup is skipped on reload. **Budget is the deliberate exception** — cost totals read completion *history*, not status, so already-spent costs keep counting.

State lives in `entry.data` (`archived_at` ISO timestamp + `archived_reason` ∈ `manual`/`auto`/`object`) — not a `_DYNAMIC_TASK_FIELDS` field, so it survives the Store merge with no storage migration. Archiving an **object** cascades `archived_reason=object` to its active tasks; unarchiving the object reverts exactly those, while unarchiving a recurring task re-anchors `last_performed=today` for a fresh cycle. A daily **retention sweep** (`helpers/retention.py`, a 24 h `async_track_time_interval` with `cancel_on_shutdown`) auto-archives completed one-offs past `archive_oneoff_days` and auto-deletes auto-archived one-offs past `delete_archived_oneoff_days` — pure decisions `should_auto_archive` / `should_auto_delete`; manual archives are never auto-deleted. WS: `task|object/archive|unarchive` (`@require_write`).

### Action Buttons (single action layer)
Per-task `button.*` entities (complete / skip / reset) live on each object device. The **global hub deliberately has no buttons** — `button.py::async_setup_entry` returns early for the global entry, because export belongs to the `export_data` service (a button entity can't trigger a browser download). The buttons add **no new logic**: `async_press` calls the same `coordinator.complete_/skip_/reset_maintenance` methods used by the `maintenance_supporter.*` services, the mobile-notification actions, the to-do list, and the voice intents — one action layer behind every front-end. Task-deletion cleanup removes every per-task entity (sensor / binary_sensor / buttons) by matching the task UUID inside the `unique_id`, so no platform-specific list needs maintaining.

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
- 45 object templates in 9 categories (vehicle, home, household, appliance, garden, pool, tech, pets, health) with pre-configured tasks and triggers; their display strings live in `templates_i18n.py`

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

### The Schedule model: discriminated-union recurrence

A task's recurrence is one value object — `helpers/schedule.py::Schedule`, a frozen dataclass that is a **discriminated union** keyed by `kind`:

| kind | fields | next due |
|---|---|---|
| `interval` | `every`, `unit` (days/weeks/months/years), `anchor` (completion/planned) | `add_interval()` from the anchor — calendar-aware (months/years clamp to month length, leap years) |
| `weekdays` | `weekdays[]` (0=Mon … 6=Sun) | the next selected weekday |
| `nth_weekday` | `nth` (1–5, or -1 = last), `weekday`, optional `months[]` | e.g. "1st Saturday"; `helpers/dates.py::next_nth_weekday` |
| `day_of_month` | `day` (1–31, clamped), optional `months[]` | e.g. "the 15th"; `next_day_of_month` |
| `one_time` | `due_date` | the date, until completed → done (`is_done`, no re-arm) |
| `manual` | — | none (`next_due` is `None` → always OK) |

**The boundary rule (the actual point).** No consumer reads `every` / `unit` / `weekdays` / … directly; callers ask the Schedule for `next_due(...)` and `span_days()`. The recurrence math lives in exactly one place, so the unit-leak bug class — a consumer doing `timedelta(days=interval_days)` on a count that means "6 **months**" (issues #58/#59) — becomes structurally impossible. The calendar date math (nth-weekday, day-of-month clamping, month restriction) is pure and dependency-free in `helpers/dates.py`.

**Storage is the nested `schedule` object** (canonical). `async_migrate_entry` (`minor_version 2 → 3`) rewrites the old flat fields (`schedule_type` / `interval_days` / `interval_unit` / `interval_anchor` / `due_date`) into it via `normalize_task_storage()` — the single flat→nested writer every persist path runs through (merge-on-overlay, so editing only `interval_days` keeps the stored unit). The calendar kinds *only* exist in this nested form.

**Back-compat is permanent.** `Schedule.parse(task)` reads either shape (nested first, flat fallback), so old `.storage` data and old export files load forever. The WebSocket payload, export, CSV, and the edit-form prefill still speak the flat view via `read_legacy_fields()` (one translation point) **and** carry the nested `schedule` alongside it, so the frontend was not churned. For a calendar kind the derived `schedule_type` is the kind itself (`nth_weekday`, …): flat-only consumers get a coarse-but-honest label, nested-aware ones read `schedule`.

**Sensors stay orthogonal.** A trigger (`trigger_config`) is *not* a schedule kind — a task has a recurrence (any kind, including `manual`) **and** optionally a trigger; `schedule_type == "sensor_based"` is derived from trigger presence, and status precedence (trigger active → TRIGGERED) is unchanged. `schedule_time` likewise stays a separate field (a time-of-day refinement on `time_based` tasks), not part of the `schedule` object.

---

## File Structure

Line counts are as of v2.42.1 — indicative, not contractual.

```
custom_components/maintenance_supporter/
├── __init__.py                  (1,632 lines)  Integration setup, services, lifecycle, async_migrate_entry
├── const.py                       (672 lines)  Constants, enums, defaults, PLATFORMS
├── coordinator.py               (1,381 lines)  DataUpdateCoordinator per object
├── storage.py                     (440 lines)  Per-entry Store (dynamic state, migration, part stock)
├── parts_runtime.py               (367 lines)  Spare-parts driver: consume/restock, declarative buy-task reconcile
│
├── config_flow.py               (1,095 lines)  Initial setup flow + templates (MINOR_VERSION = 4)
├── config_flow_helpers.py         (281 lines)  Shared config flow utilities
├── config_flow_options.py          (13 lines)  Options dispatcher
├── config_flow_options_global.py  (910 lines)  Global settings (general incl. currency, notifications, budgets, panel access)
├── config_flow_options_task.py     (30 lines)  Per-object task options flow — a dispatcher assembled from the mixins below
│   ├── …_task_base.py             (241 lines)  Shared state + threshold-floor (B1) helpers
│   ├── …_task_add.py              (314 lines)  Add-task + schedule-kind steps
│   ├── …_task_crud.py             (584 lines)  Manage / edit / delete / checklist steps
│   ├── …_task_trigger.py          (437 lines)  Trigger edit / summary / remove steps
│   ├── …_task_adaptive.py         (188 lines)  Adaptive-scheduling step + schema
│   └── …_task_object.py           (141 lines)  Object-settings (metadata) step
├── config_flow_trigger.py       (1,109 lines)  TriggerConfigMixin for trigger UI
├── trigger.py                      (56 lines)  Purpose-specific automation triggers (HA 2026.7+, import-guarded)
├── condition.py                    (46 lines)  Purpose-specific automation conditions (HA 2026.7+, import-guarded)
│
│                                             Five platforms (const.PLATFORMS):
├── sensor.py                      (866 lines)  MaintenanceSensor (enum, per task), MaintenanceNextDueSensor,
│                                               MaintenanceDaysUntilDueSensor (numeric countdown, disabled by default),
│                                               MaintenanceSummarySensor, PartStockSensor, PartsToReorderSensor,
│                                               BatteryFleetLowSensor, DocumentStorageSensor
├── binary_sensor.py               (175 lines)  MaintenanceBinarySensor (problem, per task)
├── button.py                      (124 lines)  Complete / Skip / Reset buttons per task (no global buttons)
├── calendar.py                    (646 lines)  MaintenanceCalendar (global, all tasks)
├── todo.py                        (175 lines)  Global to-do list aggregating every active task
├── entity/
│   ├── entity_base.py              (89 lines)  CoordinatorEntity base class
│   ├── summary_coordinator.py     (103 lines)  No-poll coordinator behind the global summary sensors
│   └── triggers/
│       ├── __init__.py            (189 lines)  Factory: create_triggers(), multi-entity
│       ├── base_trigger.py        (309 lines)  Abstract base with availability tracking
│       ├── threshold.py           (176 lines)  Value above/below trigger
│       ├── counter.py             (173 lines)  Accumulated value trigger
│       ├── state_change.py        (244 lines)  State transition counter
│       ├── runtime.py             (338 lines)  Accumulated operating hours trigger
│       └── compound.py            (282 lines)  AND/OR compound trigger
│
├── websocket/                   (7,135 lines)  85 WS commands, split by domain
│   ├── __init__.py                (627 lines)  Shared helpers + registration
│   ├── objects.py                 (998 lines)  Object CRUD + archive/pause/replace + entity introspection (13)
│   ├── tasks.py                    (74 lines)  Backward-compat re-export shim (no handlers of its own)
│   │   ├── tasks_actions.py       (384 lines)  complete / quick_complete / skip / reset / snooze / postpone (6)
│   │   ├── tasks_crud.py          (796 lines)  create / update / delete / duplicate (4)
│   │   ├── tasks_history.py       (163 lines)  history/update (1)
│   │   ├── tasks_lifecycle.py     (209 lines)  list / archive / unarchive (3)
│   │   ├── tasks_persist.py       (217 lines)  Shared persist path (no handlers)
│   │   └── tasks_validation.py    (250 lines)  Shared task-payload validation (no handlers)
│   ├── groups.py                  (181 lines)  Group read + CRUD (4)
│   ├── analysis.py                (274 lines)  Adaptive scheduling (4)
│   ├── users.py                   (162 lines)  User list / assignment / tasks-by-user (3)
│   ├── io.py                      (883 lines)  version, templates, export/import, CSV, QR (9; incl. objects/csv #67)
│   ├── dashboard.py               (699 lines)  subscribe, statistics, settings, schedule/preview, budget, global update/test (7)
│   ├── vacation.py                (234 lines)  Vacation-mode CRUD (4)
│   ├── parts.py                   (253 lines)  Spare-parts CRUD + restock (4)
│   ├── documents.py               (251 lines)  Document metadata list/add/update/delete/search/storage (6)
│   ├── problem_sensors.py         (174 lines)  Discover + adopt HA `device_class: problem` sensors (2)
│   ├── saved_views.py             (101 lines)  Saved panel-filter views (3)
│   ├── battery_fleet.py           (120 lines)  overview / setup / mark_replaced / set_excluded (4)
│   ├── integration_setups.py      (192 lines)  Signature-catalog discovery + adoption (2)
│   └── tags.py                     (52 lines)  NFC tag listing (1)
│
├── views.py                       (314 lines)  Four authenticated HTTP views: DocumentUploadView,
│                                               DocumentServeView, DocumentExcerptView, DocumentsArchiveView
├── intent.py                      (802 lines)  Six Assist/voice intents (list, complete, instructions, due, snooze, part stock)
├── logbook.py                     (299 lines)  Localized activity-timeline descriptions for lifecycle events
├── panel.py                       (115 lines)  Sidebar panel registration
├── frontend/                                  Built esbuild output (committed)
│   ├── __init__.py                (105 lines)  Registers card + strategy shim + code-split strategy dir +
│   │                                           calendar card + locales/ + pdf.js vendor static paths
│   ├── maintenance-panel.js                   Built panel
│   ├── maintenance-card.js                    Built Lovelace card
│   ├── maintenance-calendar-card.js           Built calendar card
│   ├── maintenance-strategy-shim.js           Dashboard-strategy self-heal shim
│   ├── strategy/                              Code-split dashboard strategy + content-hashed chunks/
│   ├── locales/{21 non-EN}.json               Runtime-fetched UI translations
│   └── vendor/pdf.min.mjs, pdf.worker.min.mjs pdf.js for the work sheet's manual excerpt
├── frontend-src/               (26,031 lines)  TypeScript sources (excl. __tests__/, 6,301 lines / 52 files)
│   ├── maintenance-panel.ts     (3,334 lines)  Panel shell: today / dashboard / calendar / settings tabs,
│   │                                           object detail, task detail, all-objects
│   ├── maintenance-dashboard-strategy.ts (1,221)  Auto-generated dashboard strategy
│   ├── maintenance-card.ts        (698 lines)  Lovelace card
│   ├── maintenance-calendar-card.ts (646 lines)  Calendar card (object filter, #83)
│   ├── maintenance-card-editor.ts (409 lines)
│   ├── maintenance-strategy-shim.ts (348 lines)  Scoped-registry self-heal shim
│   ├── panel-styles.ts          (1,520 lines)  Panel-specific CSS
│   ├── calendar-styles.ts         (208 lines)  Calendar-card CSS
│   ├── styles.ts                (1,483 lines)  Shared CSS, i18n runtime loader (bundled EN + on-demand fetch
│   │                                           of the other 21) + shared helpers
│   ├── types.ts                   (524 lines)  TypeScript interfaces
│   ├── statistics-service.ts      (223 lines)  WS statistics cache
│   ├── user-service.ts            (125 lines)  HA user list cache
│   ├── dialog-mount.ts            (303 lines)  Lazy dialog mounting (open*Dialog helpers)
│   ├── ws-errors.ts               (160 lines)  WS error → localized message mapping
│   ├── helpers/                   (979 lines)  calendar-bucket (387: pure 7/14/30/365-day projection, 5 occurrences
│   │                                           max per task, no projection for sensor-based), worksheet, report,
│   │                                           virtual-window, object-columns, download, warranty, interval,
│   │                                           storage-keys, format-bytes, url, bundle-version (stale-bundle guard)
│   ├── renderers/               (1,782 lines)  task-detail (452), sparkline (361), progress (200), weibull (187),
│   │                                           charts, history, seasonal, prediction, recommendation, chart-utils
│   └── components/             (12,360 lines)  27 files
│       ├── task-dialog.ts       (2,432 lines)  Add/edit task (schedule kinds, triggers, checklist, assignees)
│       ├── settings-view.ts     (2,114 lines)  In-panel global settings editor
│       ├── task-quick-actions-dialog.ts (815)  Task ⋮ menu
│       ├── documents-section.ts   (644 lines)  Object-detail documents/manuals section
│       ├── parts-section.ts       (486 lines)  Object-detail spare-parts section
│       ├── complete-dialog.ts     (531 lines)  Mark task complete
│       ├── qr-dialog.ts           (413 lines)  QR code generation
│       ├── adopt-problem-sensors-dialog.ts (409)  Adopt HA problem sensors
│       ├── battery-fleet-section.ts (396)     Task-detail battery-fleet section
│       ├── trigger-chart.ts       (382 lines)
│       ├── storage-section-card.ts (361 lines)
│       ├── task-documents.ts      (360 lines)
│       ├── suggested-setups-dialog.ts (350)   Signature-catalog discovery UI
│       ├── groups-section-card.ts (340 lines)
│       ├── vacation-section-card.ts (327)
│       ├── object-quick-actions-dialog.ts (321)
│       ├── object-dialog.ts       (289 lines)  Add/edit object
│       ├── budget-section-card.ts (287 lines)
│       ├── history-edit-dialog.ts (259 lines)
│       ├── saved-views-dialog.ts  (247 lines)  Named panel filter/sort/group views
│       ├── group-dialog.ts        (244 lines)
│       ├── seasonal-overrides-dialog.ts (199)
│       ├── confirm-dialog.ts      (163 lines)  Generic confirmation dialog
│       └── ms-textfield.ts (116), section-card-shared-styles.ts (77), history-photo.ts (74),
│           task-detail-view.ts (37 — thin host element over renderers/task-detail.ts)
│
├── helpers/                    (12,954 lines)
│   ├── notification_manager.py  (1,400 lines)  Multi-channel notification system
│   ├── qrcodegen.py               (700 lines)  Vendored QR library (Nayuki, MIT) — excluded from coverage
│   ├── interval_analyzer.py       (687 lines)  EWA + Weibull + seasonal analysis (pure Python)
│   ├── schedule.py                (643 lines)  Schedule value object (discriminated-union recurrence) + adapters
│   ├── sensor_predictor.py        (637 lines)  Degradation + environmental correlation
│   ├── documents.py               (546 lines)  Content-addressed manual/PDF storage + web links
│   ├── battery_fleet.py           (478 lines)  Battery Notes aggregation, native-battery fallback, forecast
│   ├── parts.py                   (487 lines)  Spare-parts rules: GTIN, stock transitions, buy-task reconciler
│   ├── shared_parts.py            (218 lines)  Pools shared across objects (#111): borrower lookup, owner-deletion transfer
│   ├── intent_speech.py           (110 lines)  What the voice intents SAY, per language (assist_sentences/responses/)
│   ├── assist_sentences.py        (156 lines)  Installs the shipped Assist sentence files into <config>/custom_sentences/
│   ├── sanitize.py                (374 lines)  Defensive config-flow input sanitization (incl. rotation seeding)
│   ├── csv_handler.py             (333 lines)  CSV import/export
│   ├── vacation.py                (325 lines)  Vacation mode
│   ├── battery_fleet_setup.py     (316 lines)  One-click fleet object + parts + single aggregate task
│   ├── doc_archive.py             (289 lines)  Documents ZIP archive (the export that carries file contents)
│   ├── problem_sensors.py         (257 lines)  Adopt HA `device_class: problem` sensors as triggered tasks
│   ├── entity_attributes.py       (239 lines)  Domain→attribute mapping for trigger setup
│   ├── entity_analyzer.py         (213 lines)  Entity discovery + recorder stats
│   ├── retention.py               (206 lines)  Archive & auto-delete retention sweep
│   ├── trigger_fallback.py        (201 lines)  Per-type fallback evaluators for the coordinator refresh
│   ├── settings_registry.py       (180 lines)  Single source of truth for global-setting validation
│   ├── dates.py                   (177 lines)  Pure calendar math: add_interval, nth-weekday, day-of-month clamping
│   ├── entity_rename.py           (175 lines)  Rewrites entity_id references when HA renames an entity
│   ├── workday.py                 (172 lines)  Business-day provider bridging HA's Workday integration
│   ├── qr_generator.py            (171 lines)  QR code URL builder + SVG generator
│   ├── saved_views.py             (150 lines)  Named, shared panel-filter views
│   ├── threshold_calculator.py    (131 lines)  Threshold suggestion engine
│   ├── action_listener.py         (110 lines)  On-complete action listener
│   ├── permissions.py              (94 lines)  @require_write / @require_admin authorization
│   ├── aggregate.py                (85 lines)  compute_status_counts — the single KPI source
│   ├── i18n.py                     (35 lines)  normalize_language_code (pt-br is its own table key)
│   ├── integration_signatures.py   (26 lines)  Compatibility shim → signatures/
│   ├── global_options.py (80), pause.py (79), status.py (50), task_fields.py (44), notify_targets.py (39)
│   └── signatures/              (2,873 lines)  Suggested-setups catalog: 123 integrations / 231 signatures
│       ├── _model.py              (306 lines)  IntegrationSignature / ConsumableSignature + matcher mechanics
│       ├── _discovery.py          (186 lines)  Entity-registry scan → per-duty setup proposals
│       ├── _registry.py            (30 lines)  Merge + duplicate-domain guard
│       └── air / cars / garden / heating / home_it / kitchen / locks / personal /
│           pets / printers / transports / vacuums / wallboxes / xiaomi .py  (14 category data modules)
│
├── models/                        (783 lines)
│   ├── maintenance_task.py        (588 lines)  Task: schedule, triggers, history, status, on_complete_action,
│   │                                           quick_complete_defaults, assignee_pool + rotation_strategy
│   ├── maintenance_object.py       (95 lines)  Object: name, area, manufacturer, model, serial_number,
│   │                                           installation_date, warranty_expiry (#67), documentation_url, notes
│   └── maintenance_type.py         (86 lines)  Predefined maintenance categories
│
├── templates.py                 (1,017 lines)  45 object templates in 9 categories (vehicle, home, household,
│                                               appliance, garden, pool, tech, pets, health)
├── templates_i18n.py            (6,035 lines)  Translations for the template catalog (largest module)
├── repairs.py                     (672 lines)  Repair flows: missing trigger entity, orphan admin-panel-user,
│                                               stale on_complete_action entity
├── diagnostics.py                 (230 lines)  Integration diagnostics with PII redaction
├── export.py                      (282 lines)  JSON/YAML data export
│
├── manifest.json                            Integration metadata
├── services.yaml                            9 service definitions
├── triggers.yaml / conditions.yaml          Purpose-specific automation building blocks
├── strings.json                             Localization keys
├── icons.json                               State-based icon mappings
└── translations/{en,de,nl,fr,it,es,pt,pt-BR,ru,uk,pl,cs,sv,da,fi,nb,ja,hi,hu,ko,tr,zh-Hans}.json  22 languages (HA config flow + Repairs UI), all fully translated. Panel/card UI strings live in frontend-src/locales/<lang>.json (same 22 languages; keyed 2-letter, Chinese as `zh`, Brazilian Portuguese as `pt-br`) — only en.json is bundled into the JS, the others are served from frontend/locales/ and fetched at runtime in the user's language.
```

---

## Data Flow

### Task Status Computation
```
Coordinator refresh (every 5 min)
  └─> For each task:
      ├─ If disabled → OK (skip further evaluation)
      ├─ If archived_at set → ARCHIVED (highest precedence; inert, skip evaluation)
      ├─ If trigger_active → TRIGGERED
      ├─ Compute days_until_due = next_due - today
      │   (next_due comes from the task's Schedule value object — anchor =
      │    last_performed if set, else created_at, else today; interval kinds
      │    via add_interval() (days/weeks/months/years, calendar-aware);
      │    weekdays / nth_weekday / day_of_month → next matching date;
      │    one_time → due_date until completed, then done (is_done))
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
          ├─ Write dynamic state → Store (debounced 60s)
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

## Signature Catalog & Suggested Setups

Popular integrations already expose the wear signals a maintenance task wants — a Roborock reports *filter time left*, a Brother printer its *drum remaining life*. `helpers/signatures/` turns that into a curated catalog so discovery can propose an object **with its trigger pre-wired** instead of a bare calendar interval. It currently holds **123 integrations / 231 verified signatures** across 14 category data modules (air, cars, garden, heating, home_it, kitchen, locks, personal, pets, printers, transports, vacuums, wallboxes, xiaomi); `_registry.py` merges them and raises on a duplicate domain, `_model.py` holds the dataclasses and matcher mechanics, `_discovery.py` does the entity-registry scan. The generated human-readable table is `docs/INTEGRATIONS.md`.

**Per-duty, not per-device.** A signature describes one *duty* (`ConsumableSignature`) — replace filter, replace main brush, descale — and each duty carries its own direction semantics, which decide the trigger the adoption builds:

| Direction | Signal | Trigger built |
|---|---|---|
| `percent_left` | remaining life in % | threshold below N % |
| `duration_left` | countdown (device_class duration) | threshold below N, converted into the entity's *display* unit |
| `usage_above` | counter that counts up since the device's own reset | delta counter from an explicit 0 baseline; a device-side reset re-baselines *and* auto-completes |
| `usage_delta` | lifetime counter that never resets (odometer, burner hours) | counter trigger in delta mode; completing re-baselines |
| `event_present` | ENUM event sensor (`present` vs `off`/`confirmed`) | state_change latch; the task auto-completes when the event clears |
| `runtime_hours` | no counter at all, only a state entity | the engine's own runtime trigger accumulates the time spent in the given states |

Matching keys off the entity registry's `translation_key` (stable across renames) with an entity_id-suffix fallback for custom integrations that don't set one, and thresholds are **unit-aware** — the stored default is converted into whatever unit the entity actually displays. Claims are made **per duty, not per entity**: a watcher task named as *this* duty (in any language) blocks it, watchers named as *other* catalog duties leave the remaining duties adoptable, and a custom/renamed watcher claims the whole entity — so one source entity can back several duties (a mower's hours counter drives blades *and* undercarriage) and a deselected duty stays proposable after its sibling was adopted. Verdicts follow the direct → derived → engine-derived ladder in `docs/design/signature-evaluation-scheme.md`; a "no usable signal" verdict is only recorded after every rung has been checked.

Surface: `integration_setups/discover` + `integration_setups/adopt` (WS), rendered by `components/suggested-setups-dialog.ts`.

## Battery Fleet

Battery Notes-style setups have 30–70+ battery devices. One maintenance task per battery would bury the task list, so `helpers/battery_fleet.py` aggregates them into **one** fleet view instead: which batteries are low now, grouped by battery *type* (so you know what to buy), plus a deterministic forecast of what will be needed soon (so you can order in time).

- **Two detection paths.** Preferred: the Battery Notes integration's single `battery_plus` sensor, which carries everything needed as attributes (`battery_type`, `battery_quantity`, `battery_low`, `battery_low_threshold`, `battery_last_replaced`) — no dependency on its optional, often-disabled low binary. Fallback: plain HA `device_class: battery` percentage sensors, where a heuristic supplies what the attributes would have: `NATIVE_LOW_PERCENT = 20 %` is the fleet-wide low floor, and the battery type is inferred from the device.
- **48 h native retention.** A dead battery often takes its device offline, which would make the entity vanish exactly when it matters most. For the native path a battery last seen *low* stays in the fleet from its last-known snapshot for `_NATIVE_RETENTION = 48 h` before it drops out. (The Battery Notes path gets this for free — its sensor keeps reporting.)
- **Forecast.** `TYPICAL_LIFETIME_MONTHS` holds editorial service-life estimates per type (AA 12, D 24, CR2032 18, …; `DEFAULT_LIFETIME_MONTHS = 12` for unknown types); predicted replacement is `battery_last_replaced + lifetime`, and "needed soon" looks `DEFAULT_HORIZON_DAYS = 28` ahead. `build_overview` is a pure builder taking plain dicts plus an injected `today`, so the forecast is unit-testable against synthetic dates; `read_batteries` is the thin HA-reading adapter.
- **Setup is one click and idempotent.** `helpers/battery_fleet_setup.py` creates ONE object whose **parts** are the battery types present (so the existing stock/reorder machinery handles ordering) and ONE task, "Replace low batteries", hanging off the fixed aggregate sensor `sensor.maintenance_supporter_batteries_to_replace` via an ordinary threshold trigger. `OBJECT_FLAG` / `TASK_FLAG` markers make the panel render the fleet section and guarantee a second fleet is never created.
- Self-charging devices (vacuums, mowers, `mobile_app` phones/tablets — `_is_self_charging`, #107) are skipped entirely — in BOTH passes: a Battery Notes note no longer overrides the skip, because Battery Notes auto-discovers such devices from its library. Rechargeable battery TYPES (`is_rechargeable_type`: Rechargeable/Li-ion/NiMH/power- and battery-packs) stay in the roster for low tracking but never enter `needs_now`/`needs_soon`, never become a type-part at setup (`discover_battery_types` skips them, and the typeless UNKNOWN bucket with them — an "UNKNOWN battery" part with an Amazon-search buy link helps no one), and get no type-lifetime date — only a trend-earned one. Any battery can be manually excluded (`battery_fleet/set_excluded`). WS: `battery_fleet/overview | overview_history | setup | mark_replaced | set_excluded`; UI: `components/battery-fleet-section.ts`, rendered **first** inside the task detail view. The roster draws per-battery **sparklines** from `battery_fleet/overview_history` (30 d downsampled level series + the battery's own `low_threshold` — ONE `Battery` field feeds the trend regression, the sparkline threshold line and the level-bar colors alike; fetched lazily on roster expand, recorder work 6 h-cached like the trend): a solid level line, a faint threshold line, and — on trend-dated rows — a dotted projection from the last reading down to the threshold, ending exactly where the ~date comes from. The roster sorts by urgency by default (#123: lows by level ascending, then days-until; toggle to name, choice persisted in localStorage); low rechargeable rows label the mark action "recharged"; the shopping-line type chips filter the roster; rows carry a small level bar colored against the row's own threshold (red at/below it, amber in a 20-point approach band). The history response also flags **unrecorded swaps** (`_detect_unrecorded_jump`: a ≥25-point upward step whose date is not within ±2 days of `battery_last_replaced`; rechargeables exempt — they jump on every charge) with the source `device_id`, and the panel offers a one-click `battery_notes.set_battery_replaced` at the detected time — re-anchoring the forecast on the real replacement instead of the dead battery's date.

### Object ↔ device attachment

An object with `ha_device_id` puts its task entities on an existing device owned by another integration. `entity/entity_base.py` resolves that device **once** in the entity constructor and assigns it to `self.device_entry`; `device_info` then returns `None`, because describing a device there would create one of our own. This is [Home Assistant's documented pattern for helper integrations](https://developers.home-assistant.io/blog/2025/07/18/updated-pattern-for-helpers-linking-to-devices/) and it works on 2026.7 as well — `entity_platform` uses a pre-set `device_entry` when `device_info` yields nothing.

The earlier shape returned the foreign device's own identifiers, which made the registry add our config entry to it. HA 2026.8 scopes identifiers per config entry, so that no longer merges: it creates a second device, nameless (we deliberately omit name/manufacturer so a merge cannot overwrite the owner's metadata), holding our entities while the appliance's page shows none. The `minor_version` 4 → 5 migration hands the stored link to `shed_owned_devices` (HA's `async_remove_helper_devices` where it exists, the older `…_config_entry_from_source_device` on 2026.7) so existing installs shed the association before 2026.8's upgrade can split anything — except for self-links, which it skips (see below).

Two consequences worth knowing: the reverse area sync (`_object_entries_for_device`) must find a linked object through `obj["ha_device_id"]`, since our entry is no longer listed on the device; and a linked device that has disappeared falls back to the object's own device rather than leaving entities device-less — a deliberate departure from core helpers, which drop to no device at all.

**Surviving the 2026.8 upgrade** (`helpers/device_link.py`). The split renumbers devices, so a link stored before it points at a *pre-migration composite id* that names no registered device — HA then refuses to attach anything to it and logs a line asking the user to file a bug against us. At setup the stored id is resolved through `async_is_composite_device_id` / `async_get_devices_for_composite_device_id` to the split that is **not** ours, and written back once. The trap: `async_get()` still ANSWERS for a composite id — it synthesises a read-only device carrying that same composite id, so using it as the liveness test looks correct and silently does nothing. This applies to **every** consumer of the stored id, which is why the entity constructor also goes through the resolver rather than a raw `async_get`. An id that resolves to nothing is deliberately **left alone**: clearing gains nothing (the render-time fallback already covers it) and would destroy a link that a JSON restore or a re-added integration can make meaningful again. Devices we should not own go to HA's own `async_remove_helper_devices`, which also relinks the entities; `async_remove_helper_config_entry_from_source_device` is the 2026.7 fallback, reached through `getattr` because 2026.8 deprecates it.

Three refinements from the critical re-review: when a device was shared by **several** integrations, the resolver prefers the split of the composite's former *primary* config entry — the integration that actually provides the appliance — over list order; the area-sync lookup prefers `DeviceEntry.config_entry_id` over the plural `config_entries`, which 2026.8 keeps only as a **silently** deprecated shim (no `report_usage`, invisible to the deprecation gate); and after platform setup, a live-linked object drops any own device with no entities on it, because the unlinked→linked transition otherwise leaves the old own device behind as an empty duplicate on both HA versions.

**Self-links** (prod finding 2026-08). An unlinked object's own device carries the object's name — the appliance's exact name — and the device picker cannot exclude it, so three production objects spent months "linked" to their own doppelgänger without anyone noticing (entities, name and area all looked right). Every layer now handles it: the WS write path rejects any device of our domain (`self_link_device` — hierarchy has `parent_entry_id`), the resolver treats a device our entry **solely owns** as unlinked (a legacy CO-owned appliance device is deliberately not a self-link — that one migration must still clean up), setup raises the distinct `device_link_self` notice instead of the misleading "device no longer exists", and the 4→5 migration skips shedding a self-linked device — its "source" is the very device the entities live on, and shedding deleted-and-restored it in a single boot, which is what surfaced the whole story. Both device-link notices are **fixable** (`repairs.py::DeviceLinkRepairFlow`): relink to a picker pre-filled with the best name/manufacturer match among non-maintenance devices, or unlink.

`e2e/migration-scenarios.sh` replays every update order against a base state built by the last released version, and `tests/test_no_ha_deprecation_reports.py` fails the suite whenever Home Assistant reports deprecated usage naming this integration.
- **The overview carries a full roster** (`BatteryOverview.all`): every tracked battery tagged `low` / `soon` / `ok`, device-name sorted. `low` and `soon` answer *what needs doing*; without the roster a healthy device appeared in **neither**, and since the exclude control only rendered on low rows it could be dismissed solely while it was already nagging — and not at all after the fleet task auto-completed and dropped it from that list (discussion #113). Excluded entities are filtered out in `read_batteries`, so the roster only ever offers what is still tracked.
- **Discharge-trend forecast** (2.50, #114 follow-up): the panel's overview goes through `async_compute_overview`, which enriches the ~dates with `async_trend_predictions` — `SensorPredictor.async_predict_below` (the sensor-trigger regression, given an entity + threshold instead of a task) asks *"when does this level fall below the low threshold?"* (Battery Notes' own threshold or the fleet-wide 20 % floor, whichever crosses first). `build_overview` blends: trend beats the type-lifetime table where present; rows carry `predicted_source` + `prediction_confidence`. Three guards, tuned against real production data: medium/high confidence only; extrapolations beyond 365 days dropped (a 30 d window stretched 12× produced "empty in 1142 d" for a barely-draining sensor); and a series recovering by >10 % after a window minimum is rejected — real discharges are monotone-ish, big bounces mean the voltage-derived percentage tracks temperature or a self-charging device (a +3.6 % CR2032 relaxation bounce on a real LYWSD03MMC stays under it). Per-entity 6 h cache including misses — the overview is fetched per panel visit, and a prematurely-cached miss is also why anything importing statistics must settle before the first overview call. The summary sensors keep the sync, table-only `compute_overview` deliberately. Read-only evaluation harness against any live instance: `e2e/prod-battery-trend-eval.mjs` (mirrors every shipped guard).

## Native Home Assistant Surfaces

The coordinator's action methods are the single action layer; each of these is a thin front-end onto it, adding no logic of its own.

- **Voice / Assist (`intent.py`)** — 8 intents registered through HA's integration intent platform (picked up automatically when the `intent` component loads, same mechanism as `shopping_list`): `ListTasks` ("what maintenance is due?"), `CompleteTask` (fuzzy-matches by spoken task *or* object name and records a **real** completion — history, rotation, part consumption and on-complete actions all fire), `TaskInstructions`, `TaskDue`, `SnoozeTask`, `PartStock`, `PostponeTask` (defers this occurrence only — counted from today when the task is already overdue, so "by three days" cannot land in the past) and `SkipTask`. `ListTasks` takes a `scope` slot (`mine`/`here`/`all`) resolved from `Intent.context.user_id` and `Intent.device_id`/`satellite_id`; an unresolvable scope is an explicit error rather than a silent widening. LLM-based Assist pipelines expose every registered handler as a tool automatically, in any language; the classic sentence-matching agent additionally needs sentence files in `config/custom_sentences/<lang>/`, which the opt-in `install_assist_sentences` setting installs from `assist_sentences/<lang>/` inside the integration (checksum-stamped, so a file the user edited is never overwritten). **Sentence patterns and response texts are deliberately decoupled**: the texts the assistant SAYS live in `assist_sentences/responses/<lang>.json` and follow the UI's language list, while the patterns it UNDERSTANDS are grammar rather than translation (a wildcard cannot inflect an inserted task name) and ship only for languages verified against a live agent. Sentences must never reference the list `{name}` — that is Home Assistant's built-in ENTITY-name list, which the default agent resolves before the handler runs; use the `{task_name:name}` alias (tripwire: `tests/test_assist_sentences.py`). **`TaskInstructions` is grounded by design**: it answers strictly from what is stored on the task (notes, checklist, linked documents incl. per-task page hints, required spare parts, documentation link) and, when nothing is stored, says so and *asks* before offering unverified general advice.
- **To-do list (`todo.py`)** — one global `todo` entity aggregating every active task across all objects, so maintenance appears in HA's native To-do card. Item status mirrors due state (due_soon / overdue / triggered → `needs_action`, up-to-date → `completed`); checking a `needs_action` item off routes to `complete_maintenance`.
- **Logbook (`logbook.py`)** — without it the integration's bus events render as raw `event maintenance_supporter_task_completed` rows in the activity timeline. With it they read as localized entries ("*Oil Change (Family Car) was completed — 95 €, 45 min*"), attached to the task's sensor entity so they also show up on the object's device page.
- **Purpose-specific triggers & conditions (`trigger.py` / `condition.py`, HA 2026.7+)** — building blocks like *"A maintenance task became overdue"* for the intent-based automation editor, state-based on the per-task ENUM sensors, with `triggers.yaml` / `conditions.yaml` narrowing the entity picker. Trigger platforms are imported **eagerly** even by old cores, so both modules sit behind an import guard that degrades to zero registered building blocks instead of an ImportError on every boot.

## Assignees, Rotation & Business Days

**Rotation.** A task can carry an `assignee_pool` plus a `rotation_strategy`; `MaintenanceTask.advance_rotation()` runs on completion and writes the next member into `responsible_user_id` — the one field every user filter reads (panel, Lovelace card, calendar card, saved views, per-user notifications). Strategies: `round_robin` (next after the current pointer, wrapping), `least_completed` (fewest `completed_by` credits in history, tie-break by pool order), `random` (a random *other* member). It is a no-op below two pool members. Because the pointer is only advanced on completion, a rotation configured without an initial assignee was invisible to all of those filters until its first completion — hence the `minor_version 3 → 4` seeding migration and `helpers/sanitize.py::seed_rotation_assignee`, which also re-seeds when the pool is edited out from under the current assignee.

**Business days.** The `day_of_month` schedule kind's `business` flag rolls a weekend date back to the previous business day. Out of the box that is a plain Mon–Fri rule, but when HA's **Workday** integration is configured, `helpers/workday.py` installs a process-global predicate built from its first config entry during setup — so "last business day" honours the configured country/region holidays, custom working weekdays, and add/remove-holiday overrides. `helpers/dates.py` and `helpers/schedule.py` stay hass-free: they consult `is_business_day()`, which falls back to `weekday < 5` when no provider is installed. Workday edits are picked up on the next reload (holiday calendars change rarely enough that a live listener isn't worth the coupling).

---

## Frontend Architecture

**Build:** esbuild (TypeScript → ESM, minified)
**Framework:** LitElement 3 with decorators
**Four single-file bundles** — `maintenance-panel.js` (~568 KB), `maintenance-card.js` (~263 KB), `maintenance-calendar-card.js` (~103 KB), `maintenance-strategy-shim.js` (~3.6 KB, the dashboard-strategy self-heal shim) — plus the code-split `maintenance-dashboard-strategy.js` entry (~14 KB, output to `strategy/` with content-hashed chunks). UI translations are no longer bundled (only `en.json` is); the other 21 languages load at runtime from `frontend/locales/`, which is what shrank these bundles ~50–80%.

**Stale-bundle handshake.** HA serves the panel JS with cache headers, so after an upgrade a browser can hold a bundle that is older than the backend it talks to — the failure mode is a silent one (a call whose new field the old bundle never sends). esbuild stamps the integration version it built from into `__MS_BUNDLE_VERSION__` (`helpers/bundle-version.ts`); on connect the panel asks the backend for its manifest version via the `maintenance_supporter/version` WS command and compares. A mismatch sets `_staleBundle`, which renders a reload banner. The comparison is deliberately conservative: dev builds (`"dev"`) and a missing server version never flag.

**Language normalization.** HA emits regional codes (`zh-Hans`, `pt-BR`), while the integration's tables — calendar/notification/config-flow string dicts, the `name_<lang>` template fields, and the panel's `styles.ts` strings — are keyed by the bare two-letter prefix. `helpers/i18n.py::normalize_language_code` is the single normalizer every consumer runs through instead of truncating with `[:2]` itself, because **Brazilian Portuguese is the one regional variant with its own tables** (`pt-br`) and a bare truncation would silently collapse it into European `pt`. The frontend mirrors the rule in `langToLocale` (and keys Chinese as `zh`).

### Panel Views
1. **Overview (Today tab)**: The default-adjacent triage view — overdue-or-triggered, due today, and the next seven days, each row claimed by exactly one section so nothing appears twice; renders an "all caught up" empty state.
2. **Overview (Dashboard tab, default)**: Statistics dashboard, group list, budget status, sparklines, user filter
3. **Overview (Calendar tab, 1.5.0+)**: Rolling-list view of upcoming maintenance with a window-chip toggle (7 / 14 / 30 / **365** days, the year view collapses empty days). Pure client-side bucketing via `helpers/calendar-bucket.ts` reading the existing `maintenance_supporter/subscribe` payload — no backend WS endpoint. Time-based tasks project up to 5 occurrences per task per window at 55 % opacity; sensor-based tasks show only their current `next_due` (no projection). Per-event source icon (`mdi:clock-outline` time-based, `mdi:trending-up` sensor-based; 1.5.1+) and a *"predicted · {high|medium|low} confidence"* pill (1.5.1+) sourced from `threshold_prediction_confidence`. Visible in operator mode (read-only).
4. **Overview (Settings tab)**: In-panel global settings editor — feature toggles, general settings, notification config, mobile actions, budget, JSON/CSV import/export. Writes via `maintenance_supporter/global/update` WS command (same storage as config flow options). Hidden when Operator mode is on.
5. **Object Detail**: Metadata, task list with status indicators, action buttons, responsible user badges — plus the **Documents** section (`components/documents-section.ts`: manuals/PDFs and web links) and the **Spare parts** section (`components/parts-section.ts`: stock, reorder thresholds, buy-task reconciliation). Since 2.39 the header carries only the two primary actions; everything else moved into a ⋮ menu.
6. **Task Detail**: Full info, history table, trigger status, adaptive recommendations, sparkline charts, responsible user display. For the battery-fleet task the **Battery Fleet** section (`components/battery-fleet-section.ts`) renders *first*. The view is a thin host element over `renderers/task-detail.ts`.
7. **All Objects**: Card grid with per-object overdue indicator (red dot + left border), sort dropdown (alphabetical / due-soonest / task-count), and group-by-area collapsible sections (1.0.44+). A **cards / table view toggle** (#67, desktop only — narrow viewports fall back to cards) renders an asset table whose columns are configurable via the global `objects_table_columns` setting (an ordered subset of `KNOWN_OBJECT_TABLE_COLUMNS`, sanitised server-side in `ws_update_global_settings`, defaulting to `DEFAULT_OBJECTS_TABLE_COLUMNS`). Per-object **CSV export** via the `objects/csv` WS command. Archived objects are hidden here by default behind the *Show archived* toggle.

The active overview tab persists in `localStorage`; **saved views** (`components/saved-views-dialog.ts`, `views/list|save|delete`) store named filter/sort/group combinations server-side, so they are shared across users and devices rather than living in one browser.

### Sort & Group-By (1.0.44+)
- **Tasks view sort modes:** `due_date / object / type / task_name / area / assigned_user / group`. Comparator built in `_taskRows` getter; reuses TaskRow's `area_id`, `responsible_user_id`, and `group_names` fields populated by 1.0.42's chip work — no extra server data plumbing.
- **Objects view sort modes:** `alphabetical (default) / due_soonest / task_count`.
- **Group-by:** `none (default) / area / group / user`. Tasks/objects render inside `<details>` blocks with icon + count, all open by default. Empty/unassigned items collected into a trailing "Unassigned" / "No area" section. Selection persists in `localStorage`.

### Operator Mode + Per-User Panel Access (1.0.44+; server-enforced + opt-in 2.8.4)
Read-only end-user view derived from HA user role, an explicit per-user allowlist, and a master write-delegation switch. The same rule is mirrored on client and server:

```
// frontend (maintenance-panel.ts) and server (helpers/permissions.py)
isOperator     = !user.is_admin && !(operator_write_enabled && admin_panel_user_ids.includes(user.id))
user_may_write =  user.is_admin || (operator_write_enabled && user.id in admin_panel_user_ids)
```

| User class | `operator_write_enabled` | Result |
|---|---|---|
| Admin / Owner | any | Full panel + write, always |
| Non-admin **listed** in `admin_panel_user_ids` | **on** | Full panel (create / edit / delete) |
| Non-admin **listed** | **off** (default) | Operator mode (read-only) |
| Non-admin **not** listed | any | Operator mode (read-only) |

`operator_write_enabled` defaults **off**, so out of the box every non-admin is read-only. When operator mode is active the panel hides every create/edit/delete control (Settings tab, both `+ New Object` buttons, `New Maintenance Task`, object Edit / Add Task / Delete, the per-task more-menu, the NFC-link affordance); only `Complete`, `Skip`, and `QR Code` (read-only deeplink) remain. The Lovelace card is unaffected.

**Enforcement is server-side, not just UI gating** (since the v2.8.3 security follow-up): content-CRUD WS commands carry `@require_write` (`helpers/permissions.py`), which authorises admins plus delegated operators and raises `Unauthorized` otherwise. Global config, bulk import and vacation keep `@require_admin`, and both write-delegation controls (the allowlist and the switch) are admin-only — so an operator can never edit the allowlist or flip the switch to self-grant write (no privilege escalation). The panel Settings tab is gated on real `is_admin` to match.

**Storage:** `admin_panel_user_ids: list[str]` (default `[]`, validated as ≤50 strings ≤64 chars each) and `operator_write_enabled: bool` (default `false`) live in the global ConfigEntry options. Editable via:

1. **Panel Settings tab → Panel Access section** — multi-checkbox listing all non-admin HA users (filtered to `is_active=True, system_generated=False`).
2. **HA Settings → Devices & services → Maintenance Supporter → Configure → Panel Access** — same data, exposed through the config flow's options menu (`async_step_panel_access` in `config_flow_options_global.py`).

**Repair flow for orphaned ids:** if a user listed in `admin_panel_user_ids` is later deleted from HA, the integration creates a fixable repair issue (`orphan_admin_panel_user_<uuid>`) via `homeassistant.helpers.issue_registry`. The fix flow (`OrphanAdminPanelUserRepairFlow` in `repairs.py`) offers `remove_user_id` (drops the orphaned id from the list and persists) or `dismiss`. Issues are auto-cleaned when the id is removed or the user is recreated. The check runs once at boot (`async_setup_entry` for the global entry) and on every options update (`add_update_listener` callback).

**Implementation:** single derived getter `_isOperator` on `MaintenanceSupporterPanel` reads `this.hass?.user?.is_admin` plus `this._adminPanelUserIds` (loaded from `maintenance_supporter/settings` WS response). Five render call-sites use the getter for conditional rendering.

### Real-Time Updates
- WebSocket subscription (`maintenance_supporter/subscribe`)
- Frontend caches object list, updates on delta events
- No polling needed

### Dialogs

Thirteen dialog components live in `frontend-src/components/`. Most are mounted lazily through `dialog-mount.ts` (an `open*Dialog()` helper per dialog) so they stay out of the panel's first paint and, where code-split, out of the initial bundle.

| Dialog | Purpose |
|---|---|
| `object-dialog` | Object create/edit |
| `task-dialog` | Task create/edit (schedule kinds, trigger configuration, checklist, responsible user / assignee pool). Since 1.0.44 it accepts an optional list of objects; with no `entry_id` preset it renders an Object selector, so a task can be created from the Tasks view without navigating into an object first |
| `complete-dialog` | Mark task complete (notes, cost, duration, checklist, feedback) |
| `confirm-dialog` | Generic confirmation |
| `qr-dialog` | QR code generation (print, download SVG) |
| `group-dialog` | Group CRUD with a multi-checkbox task selector grouped by object |
| `history-edit-dialog` | Edit an existing history entry |
| `seasonal-overrides-dialog` | 12-month seasonal factor editor (0.1–5.0 per month, empty = learned) |
| `saved-views-dialog` | Manage named panel filter/sort/group views |
| `adopt-problem-sensors-dialog` | Adopt HA `device_class: problem` sensors as triggered tasks |
| `suggested-setups-dialog` | Signature-catalog discovery → one-click adoption |
| `task-quick-actions-dialog` | The per-task ⋮ menu |
| `object-quick-actions-dialog` | The per-object ⋮ menu |

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

85 commands organized by function. The authoritative inventory (command → permission tier) is `tests/test_ws_permission_matrix.py`, which fails if a handler is added without a tier.

**History payload diet (perf):** task summaries in `objects`/`task/list` carry only the most recent `_HISTORY_WINDOW` (20) history entries plus `history_count` — full histories made the list payload scale with history depth (906 KB at 40 entries/task, store cap 500). The detail view fetches the complete record lazily via `task/history` when a task is opened; a data refresh while a task is open refetches. Benchmarked by the committed harness `e2e/perf-seed.mjs` (prod-scale seed via `json/import`, real history entries) + `e2e/perf-panel.mjs` (cold-load timeline, per-WS payload bytes, long tasks; one subprocess per run and a single in-page evaluate per page — the remote playwright run-server wedges on more, see the script headers).

| Category | Commands |
|----------|----------|
| **Read** | `objects`, `object`, `statistics`, `subscribe`, `templates`, `budget_status`, `groups`, `settings`, `tasks/by_user`, `version` |
| **Schedule preview** | `schedule/preview` (#83) — next-dates preview for a candidate recurrence, without persisting anything |
| **Object CRUD** | `object/create`, `object/update`, `object/delete`, `object/duplicate`, `object/from_template`, `object/archive`, `object/unarchive`, `object/pause`, `object/resume`, `object/replace` |
| **Task CRUD** | `task/list`, `task/create`, `task/update`, `task/delete`, `task/duplicate` |
| **Task Actions** | `task/complete`, `task/quick_complete`, `task/skip`, `task/reset`, `task/snooze`, `task/postpone` (2.22+), `task/archive`, `task/unarchive`, `task/history/update` |
| **Group CRUD** | `group/create`, `group/update`, `group/delete` |
| **Parts** (2.23) | `part/create`, `part/update`, `part/delete`, `part/restock` — spare-parts inventory; parts ride the objects payload |
| **Global Settings** | `global/update` *(admin)*, `global/test_notification` *(admin)* |
| **User Assignment** | `task/assign_user`, `users/list` |
| **Analysis** | `task/analyze_interval`, `task/apply_suggestion`, `task/seasonal_overrides`, `task/set_environmental_entity` |
| **Vacation** | `vacation/state`, `vacation/preview`, `vacation/update` *(admin)*, `vacation/end_now` *(admin)* |
| **Import/Export** | `export` *(admin)*, `csv/export` *(admin)*, `objects/csv` (#67, per-object), `csv/import` *(admin)*, `json/import` *(admin)* |
| **QR** | `qr/generate`, `qr/batch_generate` |
| **Entity Introspection** | `entity/attributes` |
| **NFC Tags** | `tags/list` |
| **Problem sensors** (2.24) | `problem_sensors/discover`, `problem_sensors/adopt` *(write)* — discover + adopt HA `device_class: problem` sensors as triggered tasks |
| **Saved views** (2.24) | `views/list`, `views/save` *(write)*, `views/delete` *(write)* — shared named panel-list filter/sort/group combinations |
| **Suggested setups** | `integration_setups/discover`, `integration_setups/adopt` *(write)* — signature-catalog discovery → objects with triggers pre-wired |
| **Battery fleet** | `battery_fleet/overview`, `battery_fleet/setup` *(write)*, `battery_fleet/mark_replaced` *(write)*, `battery_fleet/set_excluded` *(write)* |
| **Documents** (2.11.0) | `documents/list`, `documents/storage`, `documents/add_link`, `documents/update`, `documents/delete`, `documents/search` — file binaries never travel over WS; they go through four authenticated HTTP views in `views.py` |

File binaries are handled by `views.py`, outside the WS API:

| View | Route |
|---|---|
| `DocumentUploadView` | `POST /api/maintenance_supporter/document/upload` |
| `DocumentServeView` | `GET /api/maintenance_supporter/document/{doc_id}` |
| `DocumentExcerptView` | `GET /api/maintenance_supporter/document/{doc_id}/excerpt` (pdf.js-backed page range for the work sheet) |
| `DocumentsArchiveView` | `GET /api/maintenance_supporter/documents/archive` (ZIP of all document contents) |

All write commands fire events for subscription updates.

### Frontend Coverage

The backend exposes 85 WS commands; most are consumed by the Lit panel. A couple (`task/list`, `templates`) are genuinely obsolete for the panel but kept as public API.

| Endpoint | Status | Linked Feature Flag | UI Location |
|---|---|---|---|
| `task/analyze_interval` | Wired | `advanced_adaptive_visible` | "Re-analyze" button in the recommendation card (task detail) — shows fresh analysis as a toast. |
| `task/seasonal_overrides` | Wired | `advanced_seasonal_visible` | "Edit seasonal factors" button under the expanded seasonal chart — opens a 12-month editor dialog with validation (0.1–5.0 per month, empty = learned). |
| `task/set_environmental_entity` | Wired | `advanced_environmental_visible` | Environmental sensor + optional attribute fields in the task dialog (only shown for `schedule_type == "sensor_based"`). Saved via dedicated endpoint after the main task update. |
| `group/create`, `group/update`, `group/delete` | Wired | `advanced_groups_visible` | Full CRUD in the groups section of the panel: "New group" header button, per-card edit/delete icons, unified group dialog with multi-checkbox task selector grouped by object. |
| `global/test_notification` | Wired | — (part of Settings) | "Send test" button next to the notify_service field in Settings (disabled when no service configured). Shared helper `send_test_notification()` guarantees the payload (including action buttons) matches the Integration-Options test step. |
| Task `checklist` field | Wired | `advanced_checklists_visible` | Textarea editor in the task dialog (one step per line, trimmed, max 100 items, max 500 chars per item). Previously Config-Flow-only; panel ↔ config flow now at parity. |
| Task `schedule_time` field | Wired | `advanced_schedule_time_visible` | `<ha-textfield type="time">` in the task dialog (only for `time_based` tasks). Coordinator strips the field when the flag is off so tasks revert to midnight semantics; calendar events become 30-min timed blocks when the flag is on. Config-Flow edit_task exposes the same field when the flag is on. |
| `task/list` | **Obsolete** | — | Superseded by `objects`, which already returns each object's tasks nested. Left in place for legacy tests / external consumers; nothing in the panel or the config flow calls it. |
| `templates` | **Obsolete** (for the panel) | — | The config flow imports `templates.py` directly when offering preset templates; the panel never browses templates at runtime. Endpoint remains as a public read-only catalogue for external tools. |

None of these are **missing/broken** — every frontend call has a matching backend handler, and every advanced-feature flag now has a working UI binding. Before deleting `task/list` or `templates`, check whether any automation/script relies on them.

Two remaining Config-Flow-only surfaces are design choices, not drift: **adaptive tuning knobs** (`adaptive_enabled`, `ewa_alpha`, `min/max_interval_days`, `seasonal_enabled`, `sensor_prediction_enabled`) and **compound-trigger editing** are exposed only via per-task Options → Adaptive Scheduling / Edit Trigger steps. The panel reads them but does not edit them.

### Time-of-day scheduling (v1.0.41)

The `schedule_time` field on `MaintenanceTask` (`HH:MM` in HA's configured TZ) is a sub-day refinement of the OVERDUE transition. Key architectural decisions:

- **`next_due` stays a `date`, not a `datetime`.** A new helper `_is_past_schedule_time()` is invoked from the `status` property only when `days_until_due == 0`. This keeps every consumer of `next_due` (calendar, sensors, websocket) untouched — no migration of downstream code required.
- **Feature-flag gating happens in the coordinator, not in the model.** The model is pure: given a `schedule_time`, it honours it. When the global flag is off, `_async_update_data()` mutates the in-memory task instance to `schedule_time = None` before calling `task.status`. Disk state is unaffected. The trade-off: enabling or disabling the feature takes effect on the next coordinator refresh (≤ 5 min), which is acceptable for maintenance scheduling.
- **Calendar renders timed events only when both the flag is on AND a value is set.** `_create_event_for_task` gates via `self._is_schedule_time_feature_enabled()` (helper that reads the global entry's options). All-day events are the default and the fallback for malformed values.
- **No `async_track_point_in_time` timers** per task — the 5-minute coordinator poll is the transition mechanism. Simpler lifecycle management, and the latency is well below any notification-interval setting anyway.
- **Weekday recurrence** is now a native schedule kind (`weekdays` — see [The Schedule model](#the-schedule-model-discriminated-union-recurrence) under Core Design Decisions). Because `schedule_time` still applies to `time_based` tasks only, pinning a weekday to a *specific time* ("every Tuesday at 19:00") is composed from a time-based interval: task creation on the target weekday → `interval_days=7` → `schedule_time="19:00"` → `interval_anchor="planned"` (so a late completion doesn't shift the weekday).

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
| test-coverage (>95%) | Silver | Yes (98%, 3,183 tests) |
| strict-typing (mypy --strict) | Silver | Yes |
| parallel-updates | Silver | Yes (`PARALLEL_UPDATES = 0` in all five platforms) |
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

**2,967 tests** across **174 test files** with **98% code coverage** (plus a 296-test frontend suite in real Chromium across 53 spec files, the journey suite A–S, and the live e2e scripts under `e2e/`).

### Coverage policy

Coverage is enforced in CI at **≥ 98%** (`--cov-fail-under=98`). The pytest
matrix is **Python 3.14 only** (`.github/workflows/tests.yaml`): HA 2026.7
requires ≥ 3.14.2, and a 3.13 leg silently resolved an *older* homeassistant
via pip's `python_requires` filtering and then type-checked against stale
stubs. The vendored QR library (`helpers/qrcodegen.py`, Project Nayuki, MIT)
is excluded from the metric via `[tool.coverage.run]` in `pyproject.toml`.
Genuinely-unreachable defensive branches are marked `# pragma: no cover` with a
reason. Regenerate the live per-module / per-file breakdown any time with:

```bash
docker exec ha-maint sh -c 'cd /config && python -m pytest tests/ \
  --cov=custom_components/maintenance_supporter --cov-report=term-missing'
```

---

## Extensibility

- **New trigger type**: Subclass `BaseTrigger`, implement `evaluate()` and `_handle_state_change_event()`, register in factory (`entity/triggers/__init__.py`)
- **New helper**: Add module to `helpers/`, integrate in coordinator
- **New platform**: Add entity module, register in `const.PLATFORMS`
- **New WS command**: Add handler in the appropriate `websocket/*.py` module, import and register in `websocket/__init__.py`
- **New template**: Add `ObjectTemplate` to `templates.py` and its display strings to `templates_i18n.py`
- **New integration signature**: Add an `IntegrationSignature` to the matching `helpers/signatures/<category>.py`, verify it against the integration's source per `docs/design/signature-evaluation-scheme.md`, then regenerate `docs/INTEGRATIONS.md` (`scripts/generate_integrations_doc.py`)
- **New language**: Add `translations/{lang}.json` for backend + `frontend-src/locales/{lang}.json` for the panel/card frontend (currently 22: cs, da, de, en, es, fi, fr, hi, hu, it, ja, ko, nb, nl, pl, pt, pt-BR, ru, sv, tr, uk, zh-Hans), add the code to `SUPPORTED_LANGS`/`langToLocale` in `styles.ts` and the guard sets in `tests/test_i18n.py`; backend uses `zh-Hans` and `pt-BR`, the frontend table is keyed `zh` and `pt-br` (see `helpers/i18n.py::normalize_language_code`)
- **New frontend UI string**: use `py -X utf8 scripts/add_locale_key.py <key> <values.json>` — it inserts the key into **all 22** locale files at once and refuses partial or untranslated values, then rebuild (`node esbuild.mjs`). Never add a key to `en.json` by hand "to translate later": CI enforces key parity (`test_frontend_locale_key_parity`), that every statically-used `t("key")` exists (`test_frontend_t_usage_coverage`), **and** that values are actually translated — English-identical values in Latin-script languages and Latin-only values in ru/uk/zh/ja/hi fail `test_frontend_locale_value_completeness` unless the (key, language) pair is a reviewed cognate in its `_VALUE_OK` allowlist

---

## Development & Testing Infrastructure

### Docker Compose Environment

Three services in `compose.yaml`:

```
┌──────────────────────────────────────────────────────────────┐
│  ha-maint (:8125)       │  ha-maint-fresh      │  playwright │
│  HA 2026.7.2            │  (:8126)             │  v1.61.1    │
│  + libfaketime          │  HA 2026.7.2 stock   │  run-server │
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

The Playwright **client and server versions must match exactly** — the image is `mcr.microsoft.com/playwright:v1.61.1-noble` and the container runs `npx playwright@1.61.1 run-server`; a mismatched `@playwright/test` in `e2e/` fails the handshake.

### Faketime (Time Manipulation)

The integration's scheduling and predictions are time-dependent. `libfaketime` allows shifting HA's perceived time without waiting.

**Build** (`Dockerfile.ha-faketime`):
1. Alpine stage compiles `libfaketime.so.1` from source
2. Copies into the HA image (pinned, currently 2026.7.2) at `/usr/local/lib/faketime/`
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

**`scripts/seed_new_features.mjs`** — Companion Node-WS seeder for the features
the config-flow API can't express: spare parts (a stocked consumable wired to a
consuming task, a part already at its reorder threshold so an open "Buy …"
reminder exists out of the box, and a catalog-only part) plus the 2.22
scheduling extras (seasonal window, finite series, a postponed occurrence).
Wired into `init-dev.sh` after `setup_demo.py`; idempotent by object name.

Usage: `node scripts/seed_new_features.mjs` (HA_TOKEN env or docker/.env; HA_URL overrides the default :8125)

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

The documentation imagery is **scripted and committed**. The current tooling is the `e2e/shots-*.mjs` family, driven by the dockerised Playwright server against a throwaway HA instance (`ha-shots`, port 8131) rather than the dev instance — so a run never depends on whatever state `ha-maint` happens to be in.

- `e2e/shots-demo.mjs` is the main entry: it onboards a fresh HA, adds the integration, seeds a realistic English demo dataset (mixed statuses, rich history with costs, priorities, labels, checklists, warranties, calendar kinds, sensor triggers with 30 days of imported statistics, two demo users with a rotation, an uploaded PDF manual), switches to the dark theme, and captures the desktop + mobile documentation set into `docs/images/` (27 captures; `docs/images/` currently holds 32 files across all scripts).
- Focused companions refresh single areas without a full reseed: `shots-adopt-problem.mjs`, `shots-schedule-preview.mjs`, `shots-trigger-hint.mjs`, `shots-mobile-dashboard.mjs`, `shots-docs-under-tasks.mjs`, `shots-ux-viewports.mjs`, `shots-theme-qa.mjs`, …
- `e2e/gifs-demo.mjs` records the animated GIFs used in the README and FEATURES docs.

The older standalone script still exists and captures 17 screenshots against the dev instance:

```bash
cd docker
docker compose --profile testing up -d   # Start Playwright server
cd ../custom_components/maintenance_supporter/frontend-src
node capture-readme-screenshots.mjs      # Outputs to docs/images/
```

It requires demo data to be set up first and covers dashboard, object detail, task detail, history, dialogs, config, Lovelace card, calendar, entity attributes, and mobile views.
