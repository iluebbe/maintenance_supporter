# Changelog

All notable changes to Maintenance Supporter are documented in this file.

## [1.0.35] - 2026-04-20

### Added — UI for previously backend-only advanced features
Every `CONF_ADVANCED_*` flag now has a working UI binding. 5 new UIs wire to backend endpoints that previously had no consumer:

- **Test notification button** in Settings — sends a test via the configured notify service and surfaces the backend message as a toast.
- **Re-analyze button** in the adaptive recommendation card (task detail) — triggers an on-demand analysis and shows recommended interval, confidence and data-point count.
- **Environmental sensor selector** in the task dialog (only for `schedule_type == "sensor_based"`) — binds an environmental entity + optional attribute to the task's `adaptive_config` for correlation-based interval adjustment.
- **Seasonal factors editor** — new "Edit seasonal factors" dialog below the seasonal chart with one number input per month (0.1–5.0, empty = learned), validation and a "clear all" button.
- **Groups management** — full CRUD in the groups section: "New group" header button, per-card edit/delete icons, unified group dialog with a multi-checkbox task selector grouped by object.

### Changed
- `ARCHITECTURE.md` / Frontend Coverage: 9 previously "Planned" endpoints are now marked "Wired"; only `task/list` and `templates` remain as documented external-API-only surfaces.

### Tests
- 38-check E2E suite (`frontend-src/e2e-new-features.mjs`) — WS roundtrips for all 5 features plus bundled-string presence checks in all 9 languages.

## [1.0.34] - 2026-04-20

### Fixed
- **Task without `last_performed` no longer "due today" forever (#30)** — `next_due` now anchors on a new `created_at` field set when the task is created. Previously, a task without history would compute `next_due = today` on every refresh, never transitioning to OVERDUE and never firing notifications.
- **Compound trigger repair flow handles sub-entities (Phase 2)** — replace/remove inside compound conditions (top-level or nested `trigger_config`); remove demotes compound to flat trigger when only 1 condition survives.
- **Timezone consistency across the codebase** — found and fixed 8 sites where `datetime.now()` (system TZ) or naive `datetime.fromisoformat` were used instead of `dt_util.now()` / TZ-aware reads. Affected adaptive scheduling (saisonal month attribution), budget calculation (year/month boundary), threshold trigger restore after restart, sensor predictor environmental analysis, history reads, and the WS create-task initial history entry. Without these fixes a HA instance whose timezone differs from the host system could see off-by-one days, wrong seasonal factors, or `TypeError` when mixing naive/aware history entries.

### Changed
- **Reset prompt strings clarified (#31)** — old "Reset this task? / New date" was ambiguous (next due date vs. last performed date). Now reads "Mark task as performed? / Last performed date (optional, defaults to today)" in all 9 supported languages.
- All time/date code now uses `homeassistant.util.dt` consistently (HA convention).

### Added
- ConfigEntry schema migration: minor_version 1 → 2 backfills `created_at` for existing tasks (prefers earliest history timestamp, falls back to today).
- 27 new timezone edge-case tests (`tests/test_timezone_edge_cases.py`) covering: year/month/leap-day/DST boundaries, anchor priority (`last_performed > created_at > today`), defensive handling (invalid strings, zero/negative interval, future `last_performed`), TZ-aware writes for all history paths, naive/aware history mix, and the budget recalculation near year boundary in non-UTC TZs.
- 8 unit tests for `created_at`/migration (3 for `next_due`, 5 for migration paths).
- 5 repair tests: replace in compound (single, multi, nested), remove demote to flat, remove keeps multi-entity condition.
- E2E suite (`frontend-src/e2e-issues-30-31.mjs`) — 28 checks covering both reported issues plus full lifecycle (create → complete/skip/reset/update → next_due/history/TZ-aware timestamps).

## [1.0.33] - 2026-04-19

### Fixed
- **Compound triggers: missing entities now create repair issues** — `normalize_entity_ids()` was flat-only, so deleted sensors referenced by compound trigger conditions were silently ignored. Now recursively collects entity IDs from all conditions (with dedup, preserving order)
- Removed duplicate compound-unpacking workaround in `_build_task_summary`

### Tests
- 6 new tests for `normalize_entity_ids` compound cases (collect, dedup, nested trigger_config, multi-entity, empty, missing conditions)
- 2 new coordinator tests for compound missing-entity repair-issue creation

## [1.0.32] - 2026-04-19

### Fixed
- **Task update failing when editing warning days or other fields (#29)** — `last_performed` field was rejected by backend update schema; now accepted so users can also manually correct the date
- **ZeroDivisionError with `interval_days <= 0`** — `next_due` property now returns `None` instead of crashing
- **Trigger stays active when entity becomes unavailable** — trigger now deactivates and fires deactivation event when monitored entity goes unavailable/unknown
- **`warning_days` exceeding `interval_days` caused permanent DUE_SOON status** — status computation now caps warning period to interval length

### Security
- **`last_performed` date format validated** — rejects malformed date strings on both create and update (must be YYYY-MM-DD)
- **JSON/CSV import data sanitized** — type and range checks for `interval_days`, `last_performed`, `warning_days`
- **`trigger_config` key whitelist** — unknown keys stripped to prevent data pollution

### Changed
- **CI: added ruff linting** with tuned config (vendored `qrcodegen.py` excluded)
- **CI: Python 3.13 + 3.14 test matrix** with 90% coverage minimum enforced
- **CI: GitHub Actions bumped to v6** (checkout, setup-python, setup-node) — fixes Node.js 20 deprecation
- **CI: Dependabot** enabled for GitHub Actions and npm dependencies
- Removed 22 unused imports across 14 source files

### Dependencies
- esbuild 0.25 → 0.28
- TypeScript 5.9 → 6.0

## [1.0.29] - 2026-04-18

### Added
- **Russian (ru) translation** — contributed by @vmakeev (#19)
- **Ukrainian (uk) translation** — contributed by @rodion981 (#23)
- Portuguese (pt) added to all hardcoded Python translation dicts (calendar, notifications, templates)
- Integration now supports **9 languages**: en, de, es, fr, it, nl, pt, ru, uk

## [1.0.28] - 2026-04-18

### Fixed
- **Date off by one day for US users (#21)** — date-only strings parsed as UTC caused timezone offset; fixed by parsing as local time
- **"Last performed" field missing in panel task dialog (#20)** — date picker now available in create/edit dialog

## [1.0.27] - 2026-04-17

### Added
- **Mobile hamburger menu button (#18)** — standard HA `ha-menu-button` in panel header on narrow screens for sidebar access

## [1.0.26] - 2026-04-17

### Fixed
- **User dropdown not showing assigned user (#16)** — Lit render timing fix with `?selected` attribute on all `<select>` dropdowns (entity logic, attribute, trigger type, interval anchor, NFC tag, responsible user)
- **Object detail task sorting (#17)** — tasks now sorted by status + due date, matching overview behavior

## [1.0.25] - 2026-04-17

### Added
- **Task sorting (#15)** — dropdown with 4 sort modes (due date, object name, type, task name); persisted to localStorage
- **All Objects view (#13)** — clickable KPI card opens grid of all objects including those without tasks; improved empty state with "Add first task" button

## [1.0.24] - 2026-04-17

### Fixed
- **Task creation from panel UI (#14)** — `enabled` field added to `ws_create_task` schema
- **Task reset with date (#12)** — frontend field name `reset_date` → `date` to match backend schema
- **Type dropdown resets to "cleaning" (#11)** — `?selected` attribute on `<option>` elements for Lit render timing

### Added
- 3 bug reproduction tests (1,430 → 1,433 tests)

## [1.0.23] - 2026-04-15

### Added
- **Serial number field (#10)** — optional `serial_number` on MaintenanceObject; displayed in panel, HA Device Registry, JSON/CSV export-import; redacted in diagnostics as PII
- 1 new diagnostics test (1,429 → 1,430 tests)

## [1.0.22] - 2026-03-16

### Added
- **Clickable entity IDs** in trigger views — entity IDs in threshold, counter, runtime, state-change triggers, compound conditions, and environmental correlations open HA's "More Info" dialog on click

## [1.0.21] - 2026-03-16

### Fixed
- **Threshold trigger `for_minutes` now survives HA restarts** — `exceeded_since` timestamp persisted to Store; on reload the timer either fires immediately (elapsed ≥ duration) or resumes with remaining time
- `hass.is_running` guards on all trigger persist/reset calls prevent writes during shutdown

### Added
- 8 new tests (1,421 → 1,429 tests) — threshold persistence unit tests + E2E restart-recovery integration tests
- mypy CI: fixed namespace-package resolution for Python 3.14

## [1.0.20] - 2026-03-16

### Fixed
- Notification action buttons (Complete, Skip, Snooze) now dismiss the notification after successful execution
- Notification action handler hardened with try/except — coordinator errors are logged instead of silently swallowed
- Notification rate-limit state (`clear_task_state`) now reset after completing/skipping a task via notification
- Deep-link URL (`url`/`clickAction`) added to all task notifications for Companion App navigation

### Added
- `async_dismiss_task_notification()` method on NotificationManager — sends `clear_notification` to Companion App
- 5 new tests (1,416 → 1,421 tests)

## [1.0.19] - 2026-03-14

### Fixed
- Dialog title and buttons rendered in content area for HA 2026.3+ compatibility (`ha-dialog` breaking change)
- Correct max history entries 50 → 500 in README

### Added
- Community section with forum link in README

## [1.0.18] - 2026-03-14

### Changed
- Refactor: replace `__wrapped__` calls with `call_ws_handler` helper in tests
- Fix: await async `_evaluate_trigger_fallback` calls in tests

## [1.0.17] - 2026-03-13

### Added
- Portuguese (pt) language support — backend translations and frontend UI (7 languages total)
- HACS one-click install button in README

## [1.0.16] - 2026-03-12

### Added
- Input validation with length limits across all WS endpoints and config flow
- WebSocket hardening: schema validation, error handling, permission checks
- Translation sync: all 6 language files aligned with English source

## [1.0.15] - 2026-03-11

### Fixed
- NaN guard for numeric inputs in frontend trigger dialogs
- Slug sanitizer for object names with special characters
- O(1) next_due computation (was O(n) history scan)
- Import logging for better error diagnostics

## [1.0.14] - 2026-03-09

### Fixed
- **HIGH**: Repair flow wrote corrupt empty-dict task data when user fixed a stale issue for an already-deleted task — now aborts gracefully
- **MEDIUM**: Budget calculation crashed with `TypeError` on string cost values (e.g. from JSON import `"cost": "50.00"`) — now casts via `float()` with fallback
- **LOW**: Deleting a task left orphaned repair issues in the issue registry — now cleans up all `missing_trigger_*` issues for the deleted task

### Added
- 5 new tests (1,364 → 1,369 tests)

## [1.0.13] - 2026-03-09

### Fixed
- **HIGH**: `async_unload_entry` cleanup race — `async_entries(DOMAIN)` still included the unloading entry, so domain data was never cleaned up on last-entry unload
- **MEDIUM**: Format-string injection in notifications — task/object names containing `{curly_braces}` caused `KeyError` crashes in `_notif_t`
- **MEDIUM**: `total_cost` crashed coordinator on non-numeric cost strings (e.g. `"invalid"`) — now silently skips unparseable values
- **LOW**: `ws_delete_task` used substring match (`task_id in unique_id`) instead of exact suffix match, potentially deleting wrong entity registry entries
- **LOW**: Threshold trigger with `for_minutes > 0` could never deactivate via fallback polling when value returned to normal range
- Dead variable `today` removed from `next_due` property

### Added
- 2 new lifecycle integration tests (1,362 → 1,364 tests)

## [1.0.12] - 2026-03-09

### Fixed
- **CRITICAL**: Planned-anchor tasks (`interval_anchor="planned"`) could never become overdue — the auto-advance logic silently moved the due date into the future, defeating the core purpose of a maintenance tracker
- Repeat notifications broken: the coordinator's `new_status != old_status` filter prevented the NotificationManager from ever re-sending reminders for tasks that remained overdue/due-soon (e.g., every 12h for overdue)
- Counter prediction produced nonsensical results with negative slope (counter decreasing) instead of returning no prediction
- Task-ID substring matching: `_get_task_id_for_entity` could match a shorter task ID as a substring of a longer unique_id, causing wrong task resolution
- Multi-entity trigger validation only checked the first entity — invalid entities in positions 2+ were silently accepted
- Frontend `parseFloat`/`parseInt` NaN values sent to backend when trigger config fields contained non-numeric text

### Added
- `NotificationManager.seed_startup_state()` — properly seeds notification timestamps on first coordinator refresh to prevent burst while preserving repeat interval functionality
- 10 new tests (1,352 → 1,362 tests)

## [1.0.11] - 2026-03-08

### Added
- JSON import via WebSocket API (`maintenance_supporter/json/import`) — re-import exported JSON backups with full task data (trigger configs, adaptive settings, checklists, history)
- Auto-detect format in Settings panel import: paste JSON or CSV and the frontend calls the correct endpoint
- 9 new JSON import tests (1343 → 1352 tests)

### Fixed
- Import count always showing 0 in Settings panel: frontend read `result.created.length` on a number instead of using it directly

## [1.0.10] - 2026-03-08

### Fixed
- NFC tag empty string bypass: empty strings now normalised to `null`, preventing duplicate empty tags from bypassing uniqueness validation
- CSV import silent failures: failed object imports now reported in response with per-object error details (`errors` array)
- Budget cost type validation: non-numeric `cost` values in history entries no longer crash the budget endpoint
- Percentile calculation: replaced truncation with proper linear interpolation in entity analyzer
- Silent exception swallowing in NFC tag listing: added logging for tag registry errors
- TypeScript type gap: added `interval_anchor` to `TaskRow` interface and removed unnecessary `as any` cast

### Added
- 100 new tests across 12 new test files (coverage 94% → 96%, 1243 → 1343 tests)

## [1.0.9] - 2026-03-08

### Changed
- Removed CSV Export / CSV Import buttons from sidebar panel (import/export remains available via WebSocket API)

### Fixed
- Remove hardcoded tokens from tracked files
- Add missing return type annotations for mypy strict mode
- Prevent notification burst on HA restart
- Make calendar entity visible by default in HA calendar panel

### Added
- `seed_recorder.py`: 13 months of hourly recorder data for sparkline charts
- Auto-update of `configuration.yaml` initial values from seed data
- 51 new integration tests (entity removal, concurrent operations, error recovery, restart resilience, calendar)

## [1.0.6] - 2026-03-06

### Fixed
- Orphaned group references when deleting objects or tasks (all three deletion paths)
- State change trigger false positives on unavailable → same-state recovery
- Counter trigger baseline not persisted when initialized from state change event
- Task dialog not clearing trigger_config / interval_days when switching schedule type

### Added
- 10 new tests covering all 4 fixes (group cleanup, trigger edge cases)
- Coverage reporting in CI pipeline (`pytest-cov`)

## [1.0.5] - 2026-03-05

### Fixed
- Sensor stale attributes after reset; compound `trigger_value` reporting
- Timezone safety for date comparisons across all modules
- Trigger state loss on HA restart; compound merge logic
- Runtime drift when entity becomes unavailable mid-accumulation
- UI interval anchor selection not persisting

## [1.0.4] - 2026-03-04

### Added
- NFC "unlinked" badge in task header for tasks without NFC tags

### Fixed
- Empty meta card guard; unused import cleanup

## [1.0.3] - 2026-03-03

### Added
- Task meta display (manufacturer, model, area) in detail view
- NFC tag dropdown selector in task dialog
- `tags/list` WebSocket endpoint

### Fixed
- Compound proxy evaluation; state_change fallback path
- Adaptive validation edge cases; sparkline rendering
- Timezone bugs in date computations; data consistency gaps

## [1.0.2] - 2026-03-02

### Added
- Binary sensor platform (`device_class: problem`) — ON when overdue or triggered
- Interval anchoring (completion-based vs. planned-date)
- Entity attribute introspection for trigger setup

## [1.0.1] - 2026-03-01

### Fixed
- Trigger persistence on HA restart; prediction cap overflow
- Progress bar and QR code UX improvements

## [1.0.0] - 2026-02-28

### Added
- QR codes with embedded icons for mobile quick-actions
- NFC tag management in panel UI
- Browser back-button navigation within panel views
- Responsive mobile layout
- Merged Overview and Analysis tabs

### Fixed
- XSS in QR print view; deep-link hardening
- 12 backend + frontend bugs from comprehensive audit
- Security hardening across all input paths

## [0.3.17] - 2026-02-20

### Fixed
- French translation: month abbreviation "Aoû" → "Août"

## [0.3.16] - 2026-02-19

### Fixed
- Trigger cooldown after completion not resetting properly
- Confirm dialog UX improvements
- Batch statistics computation edge cases

## [0.3.15] - 2026-02-18

### Fixed
- Backend state-loss and race conditions
- Frontend lifecycle bugs in LitElement components

## [0.3.14] - 2026-02-17

### Fixed
- 12 frontend panel bug fixes (dialogs, navigation, rendering)
- Data consistency fixes; sensor predictor numerical stability

## [0.3.13] - 2026-02-16

### Added
- Global settings update and test notification via WebSocket

## [0.3.12] - 2026-02-15

### Fixed
- Trigger summary key; calendar locale formatting
- Diagnostics multi-entity display; store legacy merge

## [0.3.11] - 2026-02-14

### Added
- Custom task icons (any `mdi:*` icon via HA icon picker)
- NFC tag linking for task completion

### Fixed
- Notification delivery bug

## [0.3.10] - 2026-02-13

### Improved
- Budget + calendar caching for performance
- Robust notification parsing; instance-scoped registration

### Added
- Compound + repairs legacy fallback tests (16 tests)
- Legacy coordinator fallback path tests (7 tests)

## [0.3.9] - 2026-02-12

### Fixed
- mypy --strict errors in storage, sensor, __init__

## [0.3.8] - 2026-02-11

### Added
- Store and migration test suites (41 tests)
- Store migration logic; improved sensor attributes; async export

## [0.3.7] - 2026-02-10

### Added
- Quality Scale Gold compliance documentation

## [0.3.6] - 2026-02-09

### Added
- Comprehensive test suite — 95% coverage
- mypy --strict compliance

## [0.3.5] - 2026-02-08

### Added
- Go-back navigation for all config flow and options flow forms

## [0.3.4] - 2026-02-07

### Added
- Entity pre-population in trigger setup
- Compound trigger step translations

## [0.3.3] - 2026-02-06

### Added
- Back navigation in config flow
- Compound trigger detail view
- Options flow descriptions

## [0.3.2] - 2026-02-05

### Improved
- Config flow UX improvements

### Fixed
- Missing exceptions translations across all languages

## [0.3.0] - 2026-02-03

### Added
- Multi-entity triggers for all trigger types (any/all entity logic)
- Compound triggers with AND/OR logic
- Selective entity removal from multi-entity triggers

## [0.2.4] - 2026-02-01

### Added
- Configurable ON states for runtime trigger

## [0.2.1] - 2026-01-29

### Added
- Dutch, French, Italian, Spanish translations (backend + frontend)
- Notify service validation in config flow + test notification button

### Fixed
- Notification shows "?" instead of days when value is 0

## [0.2.0] - 2026-01-27

### Added
- Runtime trigger type for tracking accumulated operating hours
- Improved analysis tab empty state messages

### Fixed
- Manifest validation errors for HACS/hassfest compliance

## [0.1.0] - 2026-01-20

### Added
- Initial release
- Time-based and sensor-based maintenance scheduling
- Threshold, counter, and state change trigger types
- Adaptive scheduling with EWA, Weibull analysis, seasonal awareness
- Notification system with rate limiting and quiet hours
- Budget tracking
- Sidebar panel + Lovelace card
- Calendar integration
- Export/import (JSON, YAML, CSV)
- 6 task types, 20+ object templates
- English and German translations
