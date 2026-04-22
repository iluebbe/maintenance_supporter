# Changelog

All notable changes to Maintenance Supporter are documented in this file.

## [1.0.45] - 2026-04-22

### Added — Lovelace card UX overhaul

- **Smart `getStubConfig`** — when a user picks "Maintenance Supporter" from the card picker, the new card now starts with `filter_status: ["overdue", "triggered", "due_soon"]` and `max_items: 10` instead of an empty config. First-add experience shows the actionable tasks immediately rather than a flood of OK rows. The user can broaden the filter via the editor.
- **Visual editor with object + status pickers** — the `Edit Card` UI now includes:
  - **Status chip-row** (Overdue / Triggered / Due Soon / OK) — click to toggle, multi-select. Empty selection = show all statuses.
  - **Object multi-checkbox list** — populated live from the WS `/objects` endpoint. Empty selection = show all objects.
  - **Entity-id multi-picker** (`<ha-entities-picker>`) — HA's native sensor / binary_sensor picker, filtered to maintenance_supporter entities.
  - Existing controls (title, show_header, show_actions, compact, max_items) unchanged.
- **`entity_ids:` config support** — the card now also accepts the HA-native `entity_ids: [sensor.x, binary_sensor.y, ...]` config key. Combines additively with `filter_status` / `filter_objects`. The backend WS response now includes `sensor_entity_id` and `binary_sensor_entity_id` per task (resolved through HA's entity registry by `unique_id`) so the frontend can match without re-implementing slugify logic.
- 8 new i18n keys × 12 languages (96 strings) for the editor labels and helper texts. Also adds a previously-missing `no_objects` key (was falling back to the literal string in `group-dialog.ts`).

### Fixed — Mobile panel due-cell alignment

- The `.due-cell` (days remaining + progress bar + sparkline) had no anchor on mobile, so its X-position drifted depending on how much content the cell carried — narrow rows left-leaning, sparkline-heavy rows pushing actions over. Added `margin-left: auto`, `min-width: 75px`, `max-width: 130px`, `align-items: flex-end` on `:host([narrow]) .due-cell` (plus matching `@media (max-width: 600px)` fallback). Sparkline width also tightened from 60px to 50px on mobile to fit. All days values + actions now anchor to the right edge consistently across rows.

## [1.0.44] - 2026-04-22

### Added — Sort & Group-By for both views ([#35](https://github.com/iluebbe/maintenance_supporter/issues/35), [#36](https://github.com/iluebbe/maintenance_supporter/issues/36))
- **Tasks view sort dropdown** gained three new modes: `Area`, `Assigned user`, `Group`. The existing `Due date / Object / Type / Task name` modes are unchanged. Selection persists in `localStorage`.
- **Objects view sort dropdown** is new — `Alphabetical` (default), `Due soonest`, `Task count`. Replaces the previous fixed creation-order list.
- **Group-by dropdown** on both views: `No grouping` (default), `By area`, `By group` (only when groups feature is on), `By user`. Tasks/objects collapse into per-section `<details>` blocks with icon + count, all open by default. Empty/unassigned items go into a dedicated trailing section.

### Added — Overdue indicator on object cards ([#35](https://github.com/iluebbe/maintenance_supporter/issues/35))
- Object cards in the Objects view now show a red dot in the top-right corner and a red left border when at least one of their tasks is overdue or triggered. Lets you scan a room/area and immediately see which appliances need attention.

### Added — Quick object & task creation from any view ([#34](https://github.com/iluebbe/maintenance_supporter/issues/34))
- The Objects view header now has its own `+ New Object` button — no more bouncing back to Overview to add a new appliance while you're already browsing the list.
- The Tasks view header has a new `New Maintenance Task` button. The dialog auto-renders an Object dropdown when no parent is preset, so you can create a task without first navigating to the object's detail page. This collapses the previous 5-step "leave list → go to objects → create object → return → create task" flow into a single dialog.

### Added — Operator mode + per-user panel access ([#33](https://github.com/iluebbe/maintenance_supporter/issues/33))
- **Default behaviour:** non-admin Home Assistant users now see a read-only panel — the Settings tab, both `+ New Object` buttons, the `New Maintenance Task` button, the object detail Edit / Add Task / Delete buttons, and the per-task more-menu (Edit / Reset / Delete) are all hidden. Only the **Complete** and **Skip** buttons remain on each task. Admins (and the owner) always see the full panel.
- **Per-user override:** admins can grant full panel access to specific non-admin users via a new **Panel Access** section in the Settings tab (and in the config flow's global options menu). The QR Code button stays available to everyone since it generates read-only links.
- **Repair flow** for orphaned ids: if an admin-listed user is later deleted in Home Assistant, the integration surfaces a "Panel-access user no longer exists" repair issue with a one-click `Remove from list` action. Issues clear automatically when the offending id is removed by hand or the user is recreated.
- Use case: in shared/family setups (e.g. the hotel-manager scenario from #33) the maintainer configures everything once, leaves the household as non-admin users (HA's Settings → People), and grants only the trusted helpers full edit access via Panel Access.
- Frontend-only gating — the WS API still accepts write commands, so admins can edit via the config flow or scripts even from a non-admin device.

### Fixed — Calendar coordinator crashed with timed events
- After 1.0.41 introduced timed calendar events for tasks with `schedule_time`, the coordinator could fail to refresh whenever the event list mixed `date` (all-day) and `datetime` (timed) entries — `events.sort(key=lambda e: e.start)` raises `TypeError: '<' not supported between instances of 'datetime.date' and 'datetime.datetime'`. Normalise to a comparable datetime in the sort key.

### Fixed — Status badge width pushed object-name column out of alignment
- Each `.task-row` in the panel is its own CSS grid, so the `auto`-sized first track sized per row — meaning the narrow `OK` pill (~30px) and the wider `Overdue` pill (~70px) ended up shifting the object-name column by a few pixels per row. Added `min-width: 70px` + `justify-content: center` on `.status-badge` so all status pills are uniform width and the column lines up across rows.

### Polish
- TaskRow already carried `area_id`, `responsible_user_id`, and `group_names` since 1.0.42 — these new sort/group-by modes reuse those fields without any new server-side data plumbing.
- 14 new i18n keys × 9 languages (126 strings total) for the new dropdown labels, group-by section headers, and "Has overdue tasks" / "Unassigned" / "No area" placeholders.

### Added — 3 new languages: Polish, Czech, Swedish (panel UI)
- **Polish (`pl`)**, **Czech (`cs`)**, and **Swedish (`sv`)** — full panel translations (338 keys × 3 languages = 1014 new strings) covering every label, dialog, menu option, error message, settings view, and feature description in the side panel. Auto-detected from HA's user language preference; falls back to English if a key is missing.
- The HA config flow (the `Add Integration` setup wizard and `Configure` options menu under Settings → Devices & services) **continues to display in English** for Polish/Czech/Swedish users — Home Assistant's own translation framework falls back to `en.json` automatically when no language-specific file exists. Full config-flow translations for these three languages are planned for v1.0.45.

## [1.0.43] - 2026-04-22

### Fixed — Task-row columns now align across rows
- The 1.0.42 chip change kept the existing flex-based row layout, where `.task-name` had `flex:1` and every other cell was content-sized. As soon as some rows had chips and others didn't (or had wider/narrower trigger text in the days column), the type / due / actions columns shifted by a few pixels per row and the table looked ragged.
- Switched `.task-row` to a 7-column CSS grid with explicit tracks (`badges | object | task | chips | type | due | actions`). Empty chip cells still occupy their grid slot (`.task-sub-empty`), so all seven columns line up perfectly across rows regardless of which optional badges or chips a particular task carries.
- Mobile (`:host([narrow])`) and the `@media(max-width:600px)` fallback both override `.task-row` back to the previous flex+wrap layout, so the existing single-column-stack mobile design is unchanged. `.task-sub-empty` is `display:none` on mobile so it doesn't take a wrap slot.

## [1.0.42] - 2026-04-22

### Added — Group / area / responsible-user chips on each task row ([#36](https://github.com/iluebbe/maintenance_supporter/issues/36))
- The task list in the panel Overview now surfaces three sub-line chips next to each task: 📁 **Group(s)** (if the task is in any maintenance group), 📍 **Area** (from the parent object's HA area), 👤 **Responsible user** (from the existing user-assignment feature). Chips render only when the corresponding data is present, so unconfigured tasks look exactly as before — no visual noise on a fresh install.
- **Strategy B layout** (collapse-to-subline on narrow viewports): on desktop the chips sit inline between the task name and the type column, filling the whitespace that previous releases had. On mobile (`:host([narrow])`) the same chips wrap onto a smaller-font sub-line below the object+task name, preserving one "visual row" per task.
- All three data points were already in the model — this release just exposes them.

### Fixed — "Recent Activities" showed oldest entries instead of newest
- `_renderRecentActivities` was using `task.history.slice(0, 3)`, but the backend appends new entries to the end of the history array. The first three entries were therefore the **oldest** completions, often with stale notes/cost data. Now `slice(-3).reverse()` so the section matches its label.

### Fixed — Mobile dialogs clipped to ~60% of viewport height
- The task and group dialogs both had hard `max-height: 70vh` / `60vh` caps on the inner content pane. On a fullscreen mobile sheet (HA Android app) the inner scroll area was effectively limited to ~2/3 of the screen even though the outer `ha-dialog` was already maximised. Added `@media (max-width: 600px)` rules that drop the height + width caps on narrow viewports.

### Docs
- 14 README screenshots re-captured against a freshly seeded `ha-maint` (English locale, dark theme, populated demo data). Calendar shot now navigates one month forward so the Filter Replacement and Drum Cleaning events are actually visible in the grid.
- All German completion notes in `scripts/seed_history.py` translated to English; 8 new Drum Cleaning notes and 3 new pH Test notes added so the `task-history` and `complete-dialog` screenshots demonstrate per-completion notes instead of rendering "—" placeholders.

## [1.0.41] - 2026-04-21

### Added — Time-of-day scheduling (advanced feature)
- **New advanced feature flag `advanced_schedule_time_visible`** (default OFF). When enabled, time-based tasks can carry an optional `schedule_time` (HH:MM) so they flip from DUE_SOON to OVERDUE **at that time** on the due date instead of at midnight. Resolves the "how do I schedule a task at 9:00?" ask from [#32](https://github.com/iluebbe/maintenance_supporter/issues/32) item 2.
- **Off-behaviour is gating, not just hiding.** When the flag is OFF, the coordinator strips any stored `schedule_time` from in-memory tasks before computing status, so a task configured for 09:00 behaves like the legacy midnight task until the feature is re-enabled. Data stays on disk — flipping the flag back on re-applies the time immediately.
- **Calendar events become timed when the feature is on and `schedule_time` is set** — 30-minute block starting at HH:MM in HA's configured timezone (instead of the default all-day event). Calendar apps can now set proper reminders. With the flag off, events fall back to all-day.
- **Scope:** `schedule_time` is a field on `time_based` tasks only. `sensor_based` and `manual` tasks are unaffected.
- **UX:** Task dialog shows the new field right after "Interval anchor", only for time-based tasks and only when the global flag is on. Task detail Overview tab surfaces "at HH:MM" next to the Next Due date.
- Auto-enable: a task with a stored `schedule_time` automatically flips the global flag on at first startup (symmetric to the existing `checklists`/`adaptive`/etc. detection).

### Hardened
- WebSocket schemas (`ws_create_task`, `ws_update_task`, `ws_complete_task`) validate `schedule_time` as strict `HH:MM` (00–23 : 00–59). Malformed values rejected at the boundary.
- CSV and JSON imports sanitize the field: non-string or malformed entries are silently dropped instead of polluting `ConfigEntry.data`.
- Config-flow save handlers apply the existing `cap_task_fields` helper with a new 5-char cap on `schedule_time`, so neither the WS nor the UI path can bypass the format restriction.
- **Precision:** the 5-minute coordinator refresh means OVERDUE fires between HH:MM and HH:MM+5min. No `async_track_point_in_time` timer per task — kept simple as agreed.

### Tests
- 4 new model-level tests (`TestScheduleTimeStatus`) covering before/after sub-day transition, absent `schedule_time` preserves legacy behaviour, malformed values fall back gracefully.
- 2 new WS schema tests (valid + malformed HH:MM acceptance/rejection).
- 3 CSV/JSON round-trip + sanitize tests.
- 3 calendar unit tests (all-day without time, timed with flag on, all-day when flag off overrides).
- New Playwright E2E suite `e2e-schedule-time.mjs` — 8 checks covering feature-off → hidden field, feature-on → visible field, WS round-trip, WS rejecting malformed payloads.
- 1501 unit tests pass; ruff + mypy strict clean across 52 source files; Docker smoke test green.

### i18n
- 5 new translation keys × 9 languages for the panel (feat_schedule_time / desc, schedule_time_optional, schedule_time_help, at_time).
- Config-Flow translations: `advanced_schedule_time_visible` label + description in `strings.json` + all 9 translation files. Parity: 320/320/320/320/320/320/320/320/320 keys.

## [1.0.40] - 2026-04-21

### Added — Error-message UX
- **Validation errors are now localized for the user.** When the WS schema rejects an input (e.g. a name over 200 chars, an `interval_days` above 3650), the dialog previously surfaced the raw voluptuous text like `length of value must be at most 200 for dictionary value @ data['name']`. Now it reads **"Name: too long (max 200 characters)"** in EN, **"Name: zu lang (max. 200 Zeichen)"** in DE, etc. The translation covers the 6 most common voluptuous error shapes (too long / too short / value too high / value too low / required / wrong type / invalid choice / invalid value) across all 9 supported languages.
- New `frontend-src/ws-errors.ts` with `describeWsError(e, lang, fallback)` parses the voluptuous message, extracts the field name + constraint parameter, and renders a localized template with the translated field label (falls back to the raw field name when no label is registered, and to the raw message when the error shape isn't recognised — so debugging info is never lost).
- 8 new i18n keys × 9 languages (72 strings).
- Every dialog (`task-dialog`, `object-dialog`, `group-dialog`, `complete-dialog`, `seasonal-overrides-dialog`) now routes its catch-block through `describeWsError`.
- Verified end-to-end via Playwright in Docker (`e2e-error-messages.mjs`): oversize name → dialog shows `Name: too long (max 200 characters)`, raw voluptuous text never reaches the user.

## [1.0.39] - 2026-04-21

### Security / Hardening
- **Length caps on every WS string input** (defense against storage bloat / DoS via oversized payloads). Newly capped: `entry_id`, `task_id`, `group_id` (≤64), `area_id` (≤200), `last_performed`/`date` (≤20), `entity_slug` (≤64, also stops regex DoS on the slug check), `user_id` (≤200), `entity_id` (≤255), `environmental_entity` (≤255), `environmental_attribute` (≤200).
- **`interval_days` upper bound** added (`max=3650`). Without this, an attacker (or buggy client) could submit `10**18` and crash `next_due` via `timedelta(days=…)` OverflowError.
- **`checklist_state`** schema tightened from `vol.Any(dict, None)` to `{str(≤500): bool}` with `Length(max=100)` so completion history can't be inflated by oversized dicts.
- **JSON import** now sanitizes `checklist`: drops non-string items, caps per-item length to 500, caps total items to 100. Mirrors WS schema.
- **CSV import/export** now round-trips `checklist` (cell with `\n`-separated items, RFC 4180 quoting). Each item runs through `_csv_safe()` for formula-injection mitigation, length capped to 500, max 100 items.
- **Config-flow defensive truncation** — new `helpers/sanitize.py` with `cap_task_fields()`/`cap_object_fields()`/`cap_group_fields()` is called at every save site (initial setup, template wizard, options-flow add/edit task, object settings, add group, websocket-source step). Stops a programmatic config-flow caller from bypassing the WS-schema length limits.

### Changed — UX
- **Checklist editor moved higher in task dialog** (right after `Warning days`) so it's visible without scrolling — reported as not findable in [#32](https://github.com/iluebbe/maintenance_supporter/issues/32). Verified with Playwright E2E: textarea now at offsetTop=604px in a 630px dialog viewport (was 738px → off-screen).
- **New read-only checklist preview card** in the task detail (Overview tab) — shows a numbered list of the configured steps. Renders only when the Checklists feature flag is enabled and the task actually has steps.
- **Frontend dialogs surface the real WS error message** instead of a generic "save failed" toast. So when a length cap or value range rejects the input, the user now sees something like `length of value must be at most 200 for dictionary value @ data['name']` instead of guessing.

### Tests
- 5 new tests: `test_csv_roundtrip_preserves_checklist`, `test_csv_import_caps_checklist_length`, `test_import_json_caps_checklist`, `test_ws_create_task_rejects_oversize_strings` (4 oversize payloads incl. `interval_days=10**18`).
- 2 new E2E suites in `frontend-src/`: `e2e-checklist-visibility.mjs` (reproduces #32 item 1 — verifies textarea visible in both create + edit dialogs) and `e2e-checklist-preview.mjs` (verifies new read-only preview card).
- 1489 unit tests pass; ruff + mypy strict clean across 52 source files; Docker smoke test green.

## [1.0.38] - 2026-04-21

### Fixed
- **Lovelace card disappeared from the card picker (issue #32, item 4).** `maintenance-card.ts` and `maintenance-card-editor.ts` registered themselves with the `@customElement(...)` decorator, but esbuild's tree-shaker dropped both classes because nothing else in the bundle held a value-level reference — the same pattern that already broke `object-dialog` and `task-dialog` and was fixed there with explicit `customElements.define()` at the bottom. Same fix applied to both card files. Verified by `grep -oE 'customElements\.define\("[^"]+"' frontend/maintenance-card.js`: all 3 expected elements now appear (was missing the two card classes).
- Picker UX in dialogs:
  - **Object dialog "Area" field is now an `<ha-area-picker>`** (drop-down of Home Assistant areas) instead of a free-text field. Prevents typos that would otherwise silently land in `area_id` and break HA's area-based logic.
  - **Task dialog "Custom icon" field is now an `<ha-icon-picker>`** (browseable icon search) instead of a free-text `mdi:…` field (issue #32, item 3).

### Added — Build pipeline
- **`docker-smoke` CI job** in `.github/workflows/tests.yaml`: spins up the pinned HA image with our integration mounted, waits for `/manifest.json`, imports our top-level modules from inside the container, and grep-fails the build on any `ERROR.*maintenance_supporter` / `Setup failed for maintenance_supporter` / `Traceback`. Runs after `frontend-build` + `pytest` so a green pipeline now means "HA actually starts with this code", not just "tests pass against mocks". This is the signal that would have caught a release-time setup failure before HACS users saw it.
- **`docker/smoke-test.sh`**: local mirror of the CI job. Run before pushing a release. Handles git-bash path-mangling quirks (`MSYS_NO_PATHCONV=1` for the volume mount, in-container `PYTHONPATH=/config` for the import test, shell redirect instead of `curl -o /dev/null` so the wait loop works on Windows).

### Closed issues
- #32 (4 reported items): items 3 and 4 are bug fixes shipped here; items 1 (checklist editing visibility) and 2 (where to set the time) are documented as the existing `advanced_checklists_visible` toggle and the per-task `interval_days` / trigger configuration — both already exposed in the panel since v1.0.36/37.

## [1.0.37] - 2026-04-21

### Fixed
- **CSV / JSON imports didn't stamp `created_at` on imported tasks (issue #30 follow-up).** After v1.0.36 closed the three Config-Flow task-creation paths, a critical review of the open GitHub issues turned up two more sources of the same bug class: `ws_import_csv` (via `csv_handler.import_objects_csv()`) and `ws_import_json` both built task dicts without `created_at`. Imported tasks that had no `last_performed` in the source file reproduced the "due today forever" behavior from issue #30. Fix applied at the chokepoint `async_step_websocket` in `config_flow.py`: every task lacking `created_at` is now stamped with today's date before the entry is persisted. Preserves any user-supplied `created_at` from the import source.

### Tests
- Regression assert added to `test_import_json_valid` verifying every imported task has `created_at` set.

### Closed issues
- #30 (fixed in v1.0.34; follow-up in this release covers imports).
- #31 (fixed in v1.0.34 via clarified reset-prompt strings).

## [1.0.36] - 2026-04-20

### Fixed
- **Issue #30 redux — new tasks created via Config Flow never transitioned to OVERDUE.** `created_at` was stamped only by `ws_create_task`; the three Config-Flow task-creation paths (`_save_task_and_return` in the initial setup wizard, `async_step_template_customize` for template tasks, `_save_new_task` in per-entry Options → Add task) silently omitted the field. Without it, `next_due` fell back to `today + interval` and shifted forward every day forever. All three paths now set `"created_at": dt_util.now().date().isoformat()` consistently with the WebSocket path.
- **Test-notification drift between panel button and Integration-Options menu.** The WebSocket handler included `MS_TEST_COMPLETE/SKIP/SNOOZE` action buttons when actions were enabled; the Config-Flow step sent plain title+message. Both now share a single `send_test_notification(hass, options)` helper in `config_flow_options_global.py`, so the rendered notification is identical regardless of entry point.
- **Environmental-attribute-only change silently dropped in the task dialog.** When `_environmentalEntity` was unchanged but `_environmentalAttribute` changed, the `set_environmental_entity` WebSocket call never fired because change detection compared only the entity field. Both fields are tracked now, and their "initial" shadows are synced after a successful save so repeated saves don't re-submit identical payloads.

### Added
- **Checklist editing in the panel task dialog.** Behind the `advanced_checklists_visible` feature flag. Textarea-based editor (one step per line, empty lines stripped, max 100 items, max 500 chars per item). Previously checklist editing was Config-Flow-only; the panel and config flow are now at parity. 3 new i18n keys × 9 languages (`checklist_steps_optional`, `checklist_placeholder`, `checklist_help`).

### Tests
- 3 regression asserts added for `created_at` stamping in Config-Flow task creation (initial setup, template customize, options-flow add_task).
- All 1485 tests continue to pass; ruff + mypy strict clean across 51 source files.

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
