# Test-Coverage Audit — User Stories vs. Automated Tests

**Date:** 2026-07-05
**Scope:** All user-facing capabilities of the Maintenance Supporter integration, mapped against:
- Backend pytest suite: `tests/` (106 `test_*.py` files, ~1,200 test functions)
- Frontend web-test-runner suite: `custom_components/maintenance_supporter/frontend-src/__tests__/` (27 `*.test.ts` files, real headless Chromium)
- E2E Playwright suite: `e2e/specs/` (2 specs — `lifecycle.spec.ts` in CI as a **non-blocking** job, `onboarding.spec.ts` local-only)

**Coverage classification**
- **FULL** — dedicated test(s) asserting the actual behaviour/outcome (persisted state, payload contents, error codes, rendered DOM).
- **PARTIAL** — incidental, smoke-only, or only one layer covered where the story spans backend *and* UI.
- **NONE** — no automated test exercises the behaviour.

**Overall verdict:** The backend suite is unusually deep — the overwhelming majority of files assert real outcomes (persisted store state, history-entry contents, notification message strings, WS error codes like `too_early`/`not_found`, `Unauthorized` rejections, and cross-layer TS↔Python↔locale parity tripwires). Backend coverage of the core domain (scheduling, triggers, notifications, documents, import/export, archive/retention, adaptive math) is essentially complete. The gaps cluster in three places: **(1) the panel shell** (bulk actions, command palette, today view, virtualized-table rendering, complete dialog — all untested), **(2) systemic guarantees asserted only by sampling** (permission enforcement tested on ~4 of ~41 gated WS commands), and **(3) scheduling wrappers around notification features** (weekly-digest Monday gate untested; digest tests bypass the dispatch pipeline).

Two factual corrections to the audit brief:
- **i18n ships 18 languages, not 19** (cs, da, de, en, es, fi, fr, hi, it, ja, nb, nl, pl, pt, ru, sv, uk, zh-Hans). `tests/test_i18n.py` enforces key + placeholder parity for all 18, on both backend `translations/` and frontend `locales/`.
- `tests/test_settings_registry.py` freezes **45** writable global-settings keys (a stale code comment says 42).

---

## (a) Coverage matrix

### Task lifecycle

| User story / use case | Backend tests | Frontend tests | Coverage | Gap notes |
|---|---|---|---|---|
| Create/edit task (all fields, validation, dry-run) | `test_ws_task_handlers.py` (~40 create/update tests), `test_ws_roundtrip.py`, `test_services_crud.py`, `test_config_flow.py`, `test_options_task.py` | `task-dialog-calendar-kinds`, `task-dialog-interval-hydration`, `task-dialog-compound`, `task-dialog-recovery-flag`; e2e `lifecycle.spec.ts` | FULL | Deep on both layers; wire-payload shapes asserted. |
| Complete with notes/cost/duration/checklist/feedback | `test_ws_roundtrip.py::test_complete_writes_last_performed_and_history` (asserts notes, cost=12.50, duration=30 in history), `test_phase2_features.py` (checklist_state), `test_services.py` | **NONE** — `complete-dialog.ts` appears only in the lazy-load tripwire, no behavioural test | PARTIAL | The UI money path (dialog → WS payload) is untested. See Gap #3. |
| Complete with photo attachment | `test_completion_photo.py` (4 deep tests: history carries `photo_doc_id`, doc back-linked, unknown-photo best-effort) | NONE (`history-photo.ts` untested) | FULL (backend) | Photo render in history untested. |
| Quick-complete (defaults, `no_defaults` fallback) | `test_ws_roundtrip.py::test_quick_complete_uses_defaults`, `_no_defaults_returns_no_defaults_error`; error paths in `test_ws_task_handlers.py` | NONE | FULL (backend) | |
| Skip vs Missed classification | `test_completion_window.py` (`ws_skip` overdue→MISSED, not-due→SKIPPED; `as_missed` flag), `test_ws_roundtrip.py::test_skip_appends_history_with_reason` | task-detail Skip routes to `promptSkip` only | FULL (backend) | History `type` asserted, not just success. |
| Reset (default/explicit date) | `test_ws_roundtrip.py::test_reset_keeps_history_and_sets_explicit_date`, `test_services.py`, `test_repro_bugs.py::test_bug12` | menu-callback routing only | FULL | |
| Duplicate task / object | `test_ws_task_handlers.py::test_ws_duplicate_task_copies_config_resets_state` (asserts entity_slug/nfc/history dropped), `test_ws_objects.py` object duplicate | menu-item click only | FULL | |
| Archive/unarchive + object cascade | `test_archive.py` (~30 deep tests: cascade, reason=OBJECT restore, fresh-cycle re-anchor, status precedence) | e2e: archive hides object | FULL | |
| Delete + cleanup (entity registry, store, groups, repairs) | `test_ws_task_handlers.py::test_ws_delete_task_cleans_entity_registry`/`_cleans_group_refs`, `test_stale_refs.py`, `test_entity_removal.py` | e2e: delete removes | FULL | |
| Completion window (`earliest_completion_days` → `too_early`) | `test_completion_window.py` (14 deep tests: WS error code + no history written, allowed-when-overdue, sanitizer clamp) | NONE | FULL (backend) | To-do check-off path NOT covered — see To-do row + Gap #5. |
| Snooze | `test_ws_task_handlers.py::test_snooze_task_suppresses_notifications` (asserts `_is_snoozed`), `test_notifications.py` (suppress + expiry) | menu routing only | FULL | |
| Enable/disable (pause) task | `test_status_computation.py`, `test_button.py` (buttons unavailable) | NONE | FULL (backend) | |
| One-time tasks (terminal done, never re-arm) | `test_one_time_tasks.py` (~22 deep tests) | `format-recurrence.test.ts` | FULL | |
| History log + derived stats (500-entry trim) | `test_edge_cases.py`, `test_status_computation.py::TestHistoryProperties`, `test_entity_lifecycle.py` | task-detail history tab renders timeline | FULL | |
| History entry editing | `test_history_edit.py` (~15 deep: last_performed recompute, non-admin rejected, survives reload) | `history-edit-dialog` only in lazy-load tripwire | FULL (backend) | Dialog behaviour untested. |

### Scheduling & recurrence

| User story / use case | Backend tests | Frontend tests | Coverage | Gap notes |
|---|---|---|---|---|
| Interval scheduling (days/weeks/months/years, leap/clamp) | `test_schedule.py`, `test_dates.py`, `test_one_time_tasks.py`, `test_timezone_edge_cases.py` (~30 TZ/DST tests) | `interval.test.ts`, `format-recurrence.test.ts` | FULL | |
| Calendar kinds (weekdays / nth-weekday / day-of-month) | `test_schedule.py`, `test_ws_roundtrip.py` calendar roundtrips, `test_config_flow.py` | `task-dialog-calendar-kinds.test.ts` (payload shape) | FULL | |
| Interval anchoring (completion vs planned, no drift) | `test_interval_anchor.py` (~45 deep) | dialog hydration test | FULL | |
| Warning window (`warning_days`, one-cycle cap #58) | `test_ws_roundtrip.py`, `test_one_time_tasks.py`, `test_status_computation.py` | NONE | FULL (backend) | |
| Time-of-day scheduling (`schedule_time`) | `test_status_computation.py::TestScheduleTimeStatus` (freezer-based), `test_calendar_deep.py` (30-min blocks) | NONE | FULL (backend) | |
| Status ladder (ok/due_soon/overdue/triggered/archived) | `test_status_computation.py` (~35), model/dict twin agreement | task-detail status chip render | FULL | |

### Triggers

| User story / use case | Backend tests | Frontend tests | Coverage | Gap notes |
|---|---|---|---|---|
| Threshold trigger (above/below, `for_minutes`, restart recovery) | `test_triggers.py` (~140 tests total), `test_trigger_events.py`, `test_trigger_fallback.py` | `trigger-chart.test.ts` (danger zone), `trigger-section.test.ts` | FULL | Exceptionally deep, incl. persistence across restart. |
| Counter trigger (absolute/delta, rebaseline) | same files + `test_trigger_allowlist.py` | trigger-chart target line | FULL | |
| Runtime trigger (accumulation, unavailable pauses) | same files | trigger-section runtime progress header | FULL | |
| State-change trigger | same files | trigger-section progress header | FULL | |
| Compound trigger (AND/OR, no nesting, restore) | `test_compound_trigger.py`, `test_compound_restore.py`, `test_triggers.py::TestCompoundValidation` | `task-dialog-compound.test.ts` | FULL | `test_compound_options_routing.py` is structural-only (see §c). |
| Multi-entity triggers (any/all logic) | `test_triggers.py::TestMultiEntity*`, `test_config_flow_trigger.py` | dialog entity handling incidental | FULL (backend) | |
| Auto-complete on sensor recovery (#53) | `test_triggers.py::TestAutoCompleteOnRecovery`, `test_coordinator_deep.py` (records/skips-recent/skips-archived) | `task-dialog-recovery-flag.test.ts` | FULL | |
| Trigger activation/deactivation events | `test_triggers.py`, `test_trigger_events.py` | n/a | FULL | |
| Missing/renamed trigger entity → repair flows | `test_repairs.py`, `test_repair_flow.py`, `test_entity_removal.py`, `test_stale_refs.py` | n/a | FULL | |
| Threshold suggestions in config flow | `test_panel_threshold.py` (~30) | n/a | FULL | `test_threshold_calculator.py` itself is thin (see §c) but `test_panel_threshold.py` covers the real path. |

### Adaptive scheduling & predictions

| User story / use case | Backend tests | Frontend tests | Coverage | Gap notes |
|---|---|---|---|---|
| Adaptive interval suggestions (EWA, Weibull β/η/R², confidence, feedback loop) | `test_adaptive_scheduling.py` (~55 numeric), `test_ws_analysis.py` (apply_suggestion, bounds) | NONE (`renderers/recommendation.ts`, `weibull.ts` untested) | FULL (backend) | Recommendation card render untested. |
| Seasonal factors (hemisphere, monthly overrides) | `test_seasonal_scheduling.py` (~35 incl. pool-pump scenario), `test_ws_analysis.py` overrides set/clear/validation | `seasonal-overrides-dialog` only tripwire-registered | FULL (backend) | 12-month editor UI untested. |
| Sensor degradation / threshold prediction | `test_sensor_predictor.py` (~65), `test_sensor_predictions.py` (~55), `test_coordinator_prediction.py` (~40) | `filter-outliers.test.ts`, trigger-chart | FULL | |
| Environmental correlation entity | `test_ws_analysis.py`, `test_options_task.py` adaptive form | NONE | FULL (backend) | |

### Notifications

| User story / use case | Backend tests | Frontend tests | Coverage | Gap notes |
|---|---|---|---|---|
| Status-change notifications, per-status enable, rate limits | `test_notifications.py` (~50), `test_notification_deep.py` (~75), `test_notify_status_transition.py` (cache-after-send regression) | n/a | FULL | Message contents and call counts asserted. |
| Quiet hours (incl. overnight window, invalid config) | `test_notification_deep.py` | n/a | FULL | |
| Daily notification limit | `test_notification_deep.py` (blocks + midnight reset) | n/a | FULL | |
| Bundling (threshold, quiet-hours interaction, rate-limit) | `test_notifications.py`, `test_notification_deep.py` | n/a | FULL | |
| Multiple lead-time reminders (`reminder_lead_days`) | `test_lead_reminders.py` (7 deep: matching-day fire, lead-0 on due date, overdue not reminded, quiet hours) | n/a | FULL | |
| Weekly digest | `test_notifications.py::test_weekly_digest_sends_summary`/`_silent_when_no_service` — but both call `nm.async_send_weekly_digest()` **directly with hand-fed counts** | n/a | PARTIAL | The `__init__.py::async_maybe_send_weekly_digest` wrapper (Monday-only gate `weekday() != 0`, enabled-flag gate, overdue/due-soon count computation from coordinators, daily-08:00 tick wiring) is untested. See Gap #4. |
| Warranty-expiry reminders | `test_warranty_expiry.py` (fires at exact window, force covers whole window, disabled silent, malformed dates ignored) | `warranty.test.ts` (pure classifier, 60-day threshold) | FULL | |
| Snooze suppression of reminders | `test_notifications.py` (suppresses / expired allows) | n/a | FULL | |
| Vacation mode (window+buffer, exempt tasks, preview, end-now) | `test_vacation.py` (~13), `test_ws_vacation.py` (~16), `test_notification_deep.py::test_notification_skipped_when_vacation_active` | `settings-view-vacation.test.ts` (deep: WS payloads, badge, end-now) | FULL | |
| Per-user routing (responsible user → mobile service, fallback) | `test_notifications.py` user-targeted/fallback, `test_notification_deep.py` user_notify_services (renamed/wrong-user) | n/a | FULL | |
| Dual service/entity dispatch (`notify.x` service vs notify entity `send_message`) | `test_notification_deep.py` (legacy service vs entity paths) , `test_notify_targets.py` (8: merge, dedup, exclusions) | `settings-view-notify-picker.test.ts` (render-mirror only, by design) | FULL | |
| Actionable notifications (Complete/Skip/Snooze buttons) | `test_init_services.py` (action handlers incl. dismissal, error-does-not-dismiss), `test_notification_deep.py` (buttons included) | n/a | FULL | |
| Notification title style (default/object/task) | `test_notification_deep.py` (all 3 + unknown fallback) | n/a | FULL | |
| Localized notification text | `test_notifications.py` (German build_message, `notif_t` EN fallback); locale files parity via `test_i18n.py` | n/a | FULL | Content spot-checked in DE only; parity guard covers keys/placeholders. |
| Budget alerts (threshold %, 24 h rate limit) | `test_notifications.py`, `test_notification_deep.py`, `test_coordinator_deep.py` | `budget-section-card.ts` NONE | FULL (backend) | |
| Startup notify-service verification (repair issue) | `test_notification_deep.py` verify_service (7 variants) | n/a | FULL | |
| Test-notification button | `test_ws_dashboard.py` (success/no-service/fails), `test_options_global.py` | settings-view has button, untested | FULL (backend) | |

### Shared maintenance & organization

| User story / use case | Backend tests | Frontend tests | Coverage | Gap notes |
|---|---|---|---|---|
| Assignee pool + rotation (round_robin / least_completed / random) | `test_rotation.py` (11 deep: advance-and-wrap, fewest-picks, random-stays-in-pool, sanitize) | NONE | FULL (backend) | Asserts `responsible_user_id` after each completion. |
| User assignment (assign/clear, anti-enumeration) | `test_ws_users.py` (~13 incl. `_other_rejected`, admin-flag stripping) | task-detail `renderUserBadge` | FULL | |
| Priorities (low/normal/high) | `test_ws_objects.py`/`test_ws_roundtrip.py` persist, `test_parity_task_fields.py` | NONE (no UI ordering/badge test) | FULL (backend) | |
| Labels/tags | `test_labels.py` (10: roundtrip, sanitize, parse) | NONE | FULL (backend) | |
| Checklists | `test_phase2_features.py` (stored, complete-state, WS summary) | task-dialog gating only | FULL (backend) | |
| Task groups (CRUD, ref cleanup) | `test_ws_groups.py` (~18), `test_options_global.py` | `group-dialog-sort.test.ts` | FULL | `groups-section-card.ts` untested. |
| NFC tag linking (dup warning, scan completes) | `test_custom_icon_nfc.py` (~16) | n/a | FULL | |
| Areas/floors sync | `test_area_sync.py` (5: forward/reverse, no loop) | n/a | FULL | |

### QR quick-actions

| User story / use case | Backend tests | Frontend tests | Coverage | Gap notes |
|---|---|---|---|---|
| QR generation (view/complete/quick, server/local/companion URL modes, SVG, icons) | `test_qr_generation.py` (~35 deep) | `settings-view-print-qr.test.ts` (deep: full batch flow, 200-cap warning) | FULL | |
| Batch QR (caps, filters, multi-action) | `test_ws_roundtrip.py` batch tests, `test_ws_io.py` | same | FULL | |
| QR scan → action end-to-end (deep-link lands in panel and completes) | URL building tested; deep-link *handling* not | `qr-dialog` tripwire-only; no deep-link test | PARTIAL | See Gap #9. |

### Entities

| User story / use case | Backend tests | Frontend tests | Coverage | Gap notes |
|---|---|---|---|---|
| Per-task sensor + grouped attributes | `test_sensor_attributes.py`, `test_sensor_trigger_attrs.py`, `test_sensor_deep.py` | n/a | FULL | |
| Aggregate summary sensors | `test_summary_sensors.py` (7: disabled-as-ok, zero-objects, removal updates) | n/a | FULL | |
| Binary sensor (problem class, immediate reset) | `test_binary_sensor.py` (~25) | n/a | FULL | |
| Action buttons (complete/skip/reset; unavailable when disabled) | `test_button.py` (9) | n/a | FULL | |
| Calendar entity (all-day vs timed, recurrence text, localization) | `test_calendar.py`, `test_calendar_deep.py`, `test_calendar_unit.py` (~23), `test_calendar_integration.py` | n/a | FULL | |
| Native To-do entity (status mirroring + check-off) | `test_todo.py` — only 4 tests: UPDATE-only feature set, status mirrors, excludes disabled/archived, check-off routes to `complete_maintenance` | n/a | PARTIAL | Untested: check-off blocked by completion window (`todo.py:172` guard), un-check as no-op, checklist/quick-defaults interaction. See Gap #5. |
| Document storage sensor | `test_document_sensor.py` (value + live signal update) | `storage-section-card.test.ts` (deep) | FULL | |

### Documents

| User story / use case | Backend tests | Frontend tests | Coverage | Gap notes |
|---|---|---|---|---|
| Upload / dedup / refcount delete / 25 MB cap / traversal safety | `test_documents.py` (~30 deep) | `documents-section.test.ts` (deep, 10 tests incl. a11y) | FULL | |
| Serve view (auth, inline-safe MIME, content-disposition) | `test_ws_documents.py` (~40: upload-and-serve roundtrip, dangling-404, unicode disposition, **upload forbidden for non-writer**) | lightbox open tested | FULL | |
| Task-linked documents + PDF jump-to-page | `test_ws_documents.py` task-pages | `task-documents.test.ts` (deep: link/unlink payloads, `#page=N`) | FULL | |
| Web-links (zero-storage) | `test_documents.py`, `test_ws_documents.py` | documents-section add-link | FULL | |
| Storage-hygiene repair (orphan/dangling blobs) | `test_document_repairs.py`, `test_documents.py` cleanup | n/a | FULL | |
| Completion-photo storage lifecycle | `test_completion_photo.py` | `history-photo.ts` NONE | FULL (backend) | |

### Data management

| User story / use case | Backend tests | Frontend tests | Coverage | Gap notes |
|---|---|---|---|---|
| JSON/YAML export + import round-trip (caps, sanitization, document metadata) | `test_ws_io.py` (~70), `test_export.py` | `download.test.ts` (helper only) | FULL (backend) | Import/Export settings-UI section untested. |
| CSV export + import round-trip (formula sanitization, per-row errors) | `test_csv_handler.py`, `test_ws_io.py`, `test_sanitize.py` (CSV formula), `test_warranty_expiry.py` CSV roundtrip | same | FULL (backend) | |
| Per-object asset CSV (#67) | `test_ws_io.py` one-row-per-object + roundtrip | n/a | FULL | |
| Export service (`export_data` to config folder) | `test_phase2_features.py::TestExportService`, `test_export.py` | n/a | FULL | |
| Diagnostics with PII redaction | `test_diagnostics.py` (~20: nfc/user-id/serial redaction) | n/a | FULL | |
| Storage migration (v2→v3, legacy flat keys, crash recovery) | `test_migration.py` (~22), `test_storage.py` (~40) | n/a | FULL | |

### Permissions

| User story / use case | Backend tests | Frontend tests | Coverage | Gap notes |
|---|---|---|---|---|
| Operator model primitives (admin / allowlist / opt-in write delegation, default OFF) | `test_security_fixes.py` (~17 deep: `user_may_write` all combinations, `require_write` raises `Unauthorized` when disabled) | n/a | FULL | Decorator-level logic thoroughly covered. |
| Per-command enforcement across the WS API (~41 gated commands) | Only 4 spot checks: `test_ws_documents.py` (upload), `test_history_edit.py` (non-admin), `test_ws_users.py` (tasks_by_user), `test_options_global.py` (persist) | task-detail operator mode (archive/menu hidden), documents-section `canWrite` hiding | PARTIAL | No matrix test asserting every `@require_write` command rejects plain users and every `@require_admin` command (export/import/global/vacation — the self-escalation boundary) rejects operators. See Gap #1. |
| Orphaned allowlist-id repair | `test_repairs.py`, `test_stale_refs.py` | n/a | FULL | |

### Archive & retention

| User story / use case | Backend tests | Frontend tests | Coverage | Gap notes |
|---|---|---|---|---|
| Auto-archive completed one-offs / auto-delete (never manual) | `test_archive.py` sweep tests (reason=AUTO vs MANUAL asserted) | n/a | FULL | |
| Daily retention sweep wiring | `test_archive.py::test_sweep_*` + noop-when-disabled | n/a | FULL | |
| Show-archived toggle | archive fields exposed in WS responses (`test_archive.py`) | NONE (panel toggle untested) | PARTIAL | Panel-side filter untested. |

### Config & settings surfaces

| User story / use case | Backend tests | Frontend tests | Coverage | Gap notes |
|---|---|---|---|---|
| Setup wizard, object/task creation flows, trigger wizard | `test_config_flow.py` (~90), `test_config_flow_trigger.py` | n/a | FULL | |
| Template gallery (13 templates, customize) | `test_config_flow_template.py` (~20), `test_ws_io.py` templates | panel `_renderTemplateGallery` NONE | FULL (backend) | |
| Options flow (global / task / adaptive / trigger / groups / budget) | `test_options_flow.py`, `test_options_task.py` (~90), `test_options_global.py` (~55) | n/a | FULL | |
| Panel ↔ options-flow settings parity (`settings_registry`, `task_fields`) | `test_settings_registry.py` (45-key freeze), `test_settings_sync.py` (bidirectional), `test_parity_task_fields.py`, `test_frontend_const_parity.py` (~13), `test_cross_layer_vocab.py` | n/a (enforced from Python by reading TS source) | FULL | Exemplary cross-layer tripwire design. |
| Global settings WS (`global/update` validation, sanitization) | `test_ws_dashboard.py` (~50 deep) | settings-view: only 3 of ~10 sections tested (print-QR, vacation, notify picker) | FULL (backend) | General/notifications/budget/archive/columns/panel-access sections untested in UI. |
| Repairs (all 4 fixable-issue flows) | `test_repairs.py` (~40), `test_repair_flow.py` (~28), `test_document_repairs.py` | n/a | FULL | |
| Live subscription (`maintenance_supporter/subscribe`) | `test_ws_dashboard.py` (register/unsub/new-entry) | e2e asserts live re-render | FULL | |

### Panel (frontend SPA)

| User story / use case | Backend tests | Frontend tests | Coverage | Gap notes |
|---|---|---|---|---|
| Task-detail view (tabs, KPI bar, action routing, operator mode) | n/a | `task-detail-renderer.test.ts` (deep) | FULL | |
| Virtualized task table for large installs | n/a | `virtual-window.test.ts` — windowing **math only** (`computeWindow`) | PARTIAL | The actual table component is never mounted/scrolled; row-rendering regressions invisible. See Gap #8. |
| Bulk select + bulk Complete / bulk Archive | NONE | NONE (`_bulkMode`/`_bulkComplete`/`_bulkArchive` in `maintenance-panel.ts` untested; not in e2e) | NONE | Destructive multi-item operation with zero coverage. See Gap #2. |
| Command palette (Ctrl/Cmd+K search, keyboard nav) | NONE | NONE | NONE | See Gap #6. |
| Today view (default landing tab: overdue / today / this week) | NONE | NONE | NONE | Default tab of the panel. See Gap #7. |
| Dashboard table sort / group-by / status filter chips | n/a | only `card-sort-due-date.test.ts` (Lovelace **card**, not panel table) | PARTIAL | Panel-side sort/group persistence untested. |
| Calendar tab (window chips, projection at 55 %, confidence pill) | n/a | `calendar-bucket.test.ts` (28 tests, math deep incl. past buckets) | PARTIAL | Bucketing math FULL; tab DOM (day cells, chips, navigation) never mounted. |
| Objects table + configurable columns + warranty chips (#67) | `test_frontend_const_parity.py` column catalog | `object-columns.test.ts`, `warranty.test.ts` (pure fns) | PARTIAL | Chip/column DOM untested. |
| Settings view (all sections) | `test_ws_dashboard.py` backend | 3 of ~10 sections tested | PARTIAL | |
| Onboarding / empty state / dashboard strategy (#69) | n/a | `ll-custom-payload.test.ts` (tripwire, both payload shapes); e2e `onboarding.spec.ts` **local-only** | PARTIAL | The strategy empty-state has no CI-gated browser test (documented as non-deterministic). |
| Core panel lifecycle (create → complete → archive → delete, live re-render) | n/a | e2e `lifecycle.spec.ts` — CI job is `continue-on-error` (non-blocking) | PARTIAL | The only end-to-end gate on the panel does not block merges. |
| Undo toast (v2.15.0) | NONE | NONE | NONE | |
| Lovelace card (sort, status summary) | registration in `test_panel_frontend_integration.py` | `card-sort-due-date.test.ts` | PARTIAL | Only the sort is asserted. |
| Standalone calendar card (`maintenance-calendar-card.ts`) | n/a | NONE | NONE | Window chips / projection / `ll-custom` open-task untested. |
| Section cards: budget / groups / vacation (v2.4.0, admin-gated edits) | n/a | NONE (only `storage-section-card` tested) | NONE | |
| Quick-actions dialogs (task/object, from cards & strategy) | n/a | tripwire registration only | NONE | |
| Dialog lazy-load tripwire (#46/#50 invisible forms) | n/a | `dialog-no-lazy-load-elements.test.ts` (5 dialogs) | FULL | |
| Printable object report / Companion-safe download | n/a | `download.test.ts` (deep on the Companion quirk) | PARTIAL | `report.ts` HTML report untested. |

### i18n

| User story / use case | Backend tests | Frontend tests | Coverage | Gap notes |
|---|---|---|---|---|
| 18-language locale parity (backend `translations/` + frontend `locales/`) | `test_i18n.py` (parametrized over all 18: key parity, `{placeholder}` parity, brace balance, en↔strings.json) | `i18n-parity.test.ts` — runtime **loader** only (EN bundled sync, fallback chain), despite the name | FULL | Parity is deliberately guarded in Python; loader behaviour in browser. Note: 18 languages, not the 19 stated in the audit brief. |
| Localized calendar/notification strings | `test_calendar_unit.py` (babel weekday names, FR/DE), `test_notifications.py` (DE message) | `format-recurrence.test.ts` (DE nth-weekday) | FULL | |

---

## (b) Top 10 gaps (ranked by user impact × regression likelihood)

### 1. No permission-enforcement matrix across the WS API — *security*
`test_security_fixes.py` proves the `require_write`/`require_admin` primitives work, but only 4 of ~41 gated commands are ever tested for rejection. A single missing/mis-placed decorator on a new or refactored command (e.g. `task/delete`, `object/archive`, `csv/import`) would ship silently — and the module docstring itself declares the invariant "require_write must never guard global-config commands" without a test enforcing it.
**Proposal:** new `tests/test_ws_permission_matrix.py` —
- `test_every_write_command_rejects_non_operator`: register all commands, iterate every command whose handler is wrapped in `require_write`, invoke as a plain non-admin user, assert `Unauthorized`/error for each.
- `test_admin_only_commands_reject_operators`: with `operator_write_enabled=True` and the caller allowlisted, assert `export`, `csv/import`, `json/import`, `csv/export`, `global/update`, `global/test_notification`, `vacation/update`, `vacation/end_now` still reject — this pins the self-escalation boundary.
- `test_gating_inventory_frozen`: introspect `websocket/*.py` decorators and freeze the {command → tier} map (same tripwire style as `test_settings_registry.py`), so any tier change is a conscious diff.

### 2. Bulk Complete / bulk Archive have zero coverage — *destructive multi-item money path*
`maintenance-panel.ts` `_bulkMode`/`_bulkSelected`/`_bulkComplete`/`_bulkArchive` (v2.15.0) are untested at every layer. A selection-set bug (stale IDs after re-sort, select-all including archived rows) completes or archives the wrong tasks *in bulk*.
**Proposal:** new `frontend-src/__tests__/panel-bulk-actions.test.ts` — mount `maintenance-panel` with mock hass and ~10 tasks; `test('bulk complete sends task/complete once per selected task and none for unselected')` asserting exact WS calls; `test('bulk archive sends task/archive for the selection and exits bulk mode')`; `test('select-all excludes archived/disabled rows')`; `test('selection survives a re-render but is cleared after the bulk action')`.

### 3. Completion dialog (frontend) has no behavioural test — *the money path of the whole product*
Backend completion payloads are deeply verified, but `complete-dialog.ts` appears only in the lazy-load tripwire. A regression that drops `cost` from the outgoing message, breaks checklist checkbox state, or loses the photo id would pass the entire suite (the e2e lifecycle completes without optional fields, and is non-blocking anyway).
**Proposal:** new `frontend-src/__tests__/complete-dialog.test.ts` — mount `<maintenance-complete-dialog>`; `test('submits notes, cost, duration, feedback and checklist_state in the task/complete message')` asserting the exact WS payload; `test('attaches a photo and includes photo_doc_id after upload')` (stub the upload fetch like `documents-section.test.ts` does); `test('quick-complete defaults pre-fill the form')`; `test('shows the too_early error from the server and does not close')`.

### 4. Weekly digest scheduling wrapper untested — *feature can silently never fire*
Both digest tests call `nm.async_send_weekly_digest(overdue=3, due_soon=2)` directly with hand-fed counts. `__init__.py::async_maybe_send_weekly_digest` — the Monday-only gate (`dt_util.now().weekday() != 0`), the enabled-flag gate, and the computation of overdue/due-soon counts from live coordinators — has no test, nor does the daily-08:00 tick wiring. An off-by-one in the weekday check or a broken count aggregation ships green.
**Proposal:** in `tests/test_notifications.py` (or new `tests/test_daily_tick.py`) — `test_maybe_weekly_digest_fires_only_on_monday` (freeze time to a Monday → digest sent with counts computed from seeded overdue/due-soon tasks; freeze to Tuesday → not called); `test_maybe_weekly_digest_respects_enabled_flag`; `test_daily_tick_dispatches_digest_warranty_and_lead_reminders` (fire the 08:00 `async_track_time_change` callback once, assert all three `maybe_` helpers run).

### 5. To-do check-off bypasses completion-window tests — *data-integrity on a voice-reachable surface*
`test_todo.py` has only 4 tests. The guard at `todo.py:172` (`can_complete_now` → refuse check-off inside `earliest_completion_days`) is untested, as is the un-check no-op. The to-do entity is reachable from Assist/voice — the easiest place for an accidental double-completion.
**Proposal:** extend `tests/test_todo.py` — `test_todo_checkoff_blocked_inside_completion_window` (task with `earliest_completion_days`, completed yesterday; check the item off; assert no new history entry and item stays NEEDS_ACTION or raises); `test_todo_uncheck_is_noop` (assert no RESET/history mutation); `test_todo_item_summary_and_due_date_match_task`.

### 6. Command palette untested — *flagship v2.15.0 navigation*
Ctrl/Cmd+K fuzzy search over all objects+tasks with keyboard navigation (`_paletteOpen`/`_paletteQuery`/`_paletteResults` in `maintenance-panel.ts`) has zero tests. Keyboard handlers are notoriously easy to break with event-listener refactors.
**Proposal:** new `frontend-src/__tests__/panel-command-palette.test.ts` — `test('Ctrl+K opens the palette and focuses the input')`; `test('query matches tasks and objects by fuzzy name')`; `test('ArrowDown+Enter navigates to the selected task detail')`; `test('Escape closes without navigating')`.

### 7. Today view untested — *the panel's default landing tab*
`_renderToday` (overdue / due today / this week sections) is what every user sees first; no test asserts its bucketing or rendering (calendar-bucket helpers back the calendar tab, not Today).
**Proposal:** either extract the Today bucketing into a pure helper mirrored by `frontend-src/__tests__/today-buckets.test.ts` (`test('task due today appears in Today, not This week')`, `test('overdue section ordered most-overdue-first')`, boundary at 7 days), or mount the panel and assert section membership for seeded tasks.

### 8. Virtualized table: only the math is tested, never the rendering — *large-install regression risk*
`virtual-window.test.ts` covers `computeWindow` thoroughly, but no test mounts the table with >`VIRTUAL_MIN_ROWS` tasks, scrolls, and asserts the rendered row slice + pad sizers. A broken rAF-throttle or sizer-row CSS regression would blank the table for exactly the power users with hundreds of tasks.
**Proposal:** new `frontend-src/__tests__/panel-virtual-table.test.ts` — mount the panel with ~500 seeded tasks; `test('renders only the windowed slice plus overscan, with pad sizers making up the full height')`; `test('scrolling to the bottom renders the last row')`; `test('bulk-select checkbox state survives scrolling out of and back into the window')` (pairs with Gap #2).

### 9. QR deep-link handling has no end-to-end test — *the scan-to-complete story*
QR **URL building** is deeply tested, and batch printing too — but nothing verifies that a scanned URL (`?action=complete` / `quick_complete` deep link) actually lands in the panel and triggers the action. This story spans backend URL → frontend router, and only humans test it today.
**Proposal:** new e2e spec `e2e/specs/qr-deeplink.spec.ts` (panel-based, so deterministic like `lifecycle.spec.ts`): build a QR URL via WS for a seeded task, navigate to it, assert the complete dialog opens pre-targeted (and quick-complete records history). Alternatively a panel unit test that stubs `location` and asserts URL-param → dialog routing.

### 10. Lovelace section cards + standalone calendar card have zero tests — *admin-gated edit surfaces*
`budget-section-card.ts`, `groups-section-card.ts`, `vacation-section-card.ts` (interactive, admin-gated edits from a dashboard) and `maintenance-calendar-card.ts` (window chips, projection, `ll-custom` open-task events) are entirely untested — while their siblings (`storage-section-card`, panel vacation section) show the mount-and-assert pattern is cheap.
**Proposal:** start with the two highest-risk: `frontend-src/__tests__/vacation-section-card.test.ts` (`test('edits are hidden for non-admin users')`, `test('toggle dispatches vacation/update')` — reuse `settings-view-vacation` fixtures) and `calendar-card.test.ts` (`test('window chips re-bucket events')`, `test('projected occurrences render at reduced opacity and real events do not')`, `test('clicking an event fires the ll-custom open-task payload')` — reuse `calendar-bucket` fixtures and the `ll-custom-payload` assertion style).

---

## (c) Existing tests that assert too little on critical flows

1. **`tests/test_ws_task_handlers.py` — basic complete/skip/reset are success-flag-only.** `test_ws_complete_task_basic`, `_skip_task_basic`, `_reset_task_basic` assert only `send_result` + `success is True`; notably `test_ws_complete_task_with_fields` sends notes/cost/duration/feedback but never checks they were persisted. The deep verification lives in `test_ws_roundtrip.py` — the behaviour *is* covered, but this file gives false comfort: anyone extending the complete handler will naturally add their assertion here and copy the shallow pattern. Recommend either adding history-payload assertions to `_with_fields` or a comment pointing at the roundtrip file.
2. **`tests/test_notifications.py` weekly-digest tests bypass the pipeline.** They patch `nm.hass` and call `async_send_weekly_digest` with literal counts — neither the Monday gate, the enabled gate, the count aggregation, nor quiet-hours interaction for the digest is exercised (see Gap #4). Smoke-plus at the manager layer, nothing at the feature layer.
3. **`tests/test_threshold_calculator.py`** — a single test asserting the empty-suggestion placeholder (`entity_id == ""`); the file's own comment admits the async statistics path can't run without hass. Mitigated by `test_panel_threshold.py`, which does exercise suggestions properly — this file is vestigial.
4. **`tests/test_compound_options_routing.py`** — asserts the options-flow class *exposes* compound step methods (structural existence, no behaviour). The real coverage is in `test_config_flow_trigger.py`/`test_options_task.py`; as written this test would pass even if every compound step were broken.
5. **`tests/test_integration_load.py`** — loads/creates-entities/unloads-cleanly; acceptable as a canary but asserts nothing about entity correctness. Fine as-is, just not evidence of coverage.
6. **`frontend-src/__tests__/i18n-parity.test.ts`** — the name promises locale parity; it tests only the runtime loader (EN fallback chain). The actual parity guard is `tests/test_i18n.py` (Python). Deliberate per its docstring, but worth renaming (e.g. `i18n-loader.test.ts`) so a future locale-parity gap isn't assumed covered by filename.
7. **`frontend-src/__tests__/settings-view-notify-picker.test.ts`** — render-mirror only (datalist mirrors server list); explicitly delegates merge logic to Python. Acceptable *by design*, listed for completeness.
8. **E2E `lifecycle.spec.ts` runs `continue-on-error` in CI.** The only test that exercises the panel's create→complete→archive→delete loop in a real browser cannot fail a merge. Given how much panel-shell behaviour has no unit coverage (Gaps #2, #6, #7, #8), promoting this job to blocking — or at least alerting on failure — would materially raise the safety net. Similarly, `onboarding.spec.ts` is local-only (documented flake rationale); its critical assertion is duplicated by the `ll-custom-payload` unit tripwire, which is the right mitigation.
9. **Dialogs asserted only as registration side-effects.** `qr-dialog`, `seasonal-overrides-dialog`, `object-/task-quick-actions-dialog`, `confirm-dialog`, `history-edit-dialog` are imported by the lazy-load tripwire but never behaviourally tested — the tripwire proves they *render form elements*, not that they *work*.

---

## Method note

Inventory was derived from README.md, ROADMAP.md, docs/, `services.yaml`, all config-flow modules, all entity platforms, `helpers/` (notification_manager, documents, permissions, retention, vacation, schedule, interval_analyzer, qr_generator, settings_registry, task_fields), all 59 registered WebSocket commands in `websocket/`, and the `frontend-src/` panel source. Every backend test file (106) and frontend test file (27) was read for assertion depth, not just names; classifications above reflect what the tests actually assert.
