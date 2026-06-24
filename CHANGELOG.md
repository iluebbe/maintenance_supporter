# Changelog

All notable changes to Maintenance Supporter are documented in this file.

## [Unreleased]

### 🌍 Internationalization

- **Five new languages — Danish, Finnish, Norwegian Bokmål, Japanese, Hindi.** The integration now ships **18 UI languages** across all three surfaces (sidebar panel, HA config-flow + Repairs, and phone notifications). The new translations are machine-generated and CI-checked for key + placeholder parity across every locale; native-speaker corrections via PR are very welcome.

## [2.9.2] - 2026-06-24

### 🐛 Fixes

- **Dashboard-strategy self-heal no longer reloads unrelated dashboards (#68)**: the strategy shim's self-heal — which recovers a strategy view that lost Home Assistant's element-registration race — used a too-broad "is this view broken?" check (any Lovelace view with fewer than 3 cards) without verifying the view was actually a Maintenance Supporter strategy. On a normal dashboard with few cards it wrongly "bounced" the view (navigate away + back), reloading every card on it (including unrelated HACS cards). The self-heal is now scoped: it acts only on Home Assistant's explicit *"timeout waiting for … maintenance-supporter"* error card, or on a near-empty view whose Lovelace config is genuinely our strategy.

### 🔧 Internal

- **Translation key-parity is now CI-guarded.** `tests/test_i18n.py` fails the build if any backend `translations/<lang>.json` or runtime panel locale drifts from the English key set, if `strings.json` and `translations/en.json` diverge, or on placeholder/brace errors — across all 13 languages. This caught the `panel_title` setting's label/description being present in every locale but missing from `strings.json` (now fixed).

### ⚡ Frontend

- **Panel/card translations now load on demand.** The 12 non-English UI language tables moved out of the JavaScript bundles into per-language JSON files (`frontend/locales/<lang>.json`) served by the integration and fetched at runtime in the user's language; English stays bundled as an instant fallback. The panel bundle shrinks ~50% (≈688→343 KB), the card ~63% and the calendar card ~81%, and a translation change no longer requires rebuilding the frontend bundle. Steady-state rendering is unchanged.

### 🔧 Consistency

- **Global-settings validation ranges unified across the config flow and the panel.** The Integration-Options form and the panel's Settings tab (WebSocket) had drifted to different bounds for nine notification/budget settings. They now agree: the wider panel limits are adopted everywhere (e.g. snooze up to 168 h, notification intervals up to 720 h, monthly/yearly budgets up to 10M/100M, max notifications/day up to 1000), while `notification_bundle_threshold` (2–20) and `budget_alert_threshold` (10–100) are tightened on the panel path so neither can be set below its sensible documented minimum.

## [2.9.1] - 2026-06-23

### 🐛 Fixes

- **CSV export now works in the Home Assistant Companion app**: the objects-table CSV export and the Settings JSON/YAML/CSV exports used a download pattern (detached anchor + immediate blob-URL revoke) that silently failed inside the Companion app's WebView (reported on iOS). Downloads now mirror Home Assistant's own `fileDownload` — DOM-anchored, `target="_blank"`, late blob-URL revocation — so they complete in the mobile app as well as the browser.

### 🌍 Internationalization

- **Completed panel/card translations**: the calendar card's window labels (`cal_past_windows`, `cal_forward_windows`) and the history-edit dialog (`history_edit_title`, `history_edit_timestamp`) had hardcoded English fallbacks; they are now translated in all 13 languages. The object quick-actions labels were also repointed at existing localized keys, so every `t()` reference resolves (0 gaps).

## [2.9.0] - 2026-06-22

### ✨ Warranty tracking + objects table (#67)

- **Per-object warranty date** (`warranty_expiry`): record when each object's warranty runs out. The panel shows a colour-coded status chip — green *"valid until …"*, amber *"expires in N days"* (within 60 days), or red *"expired"* — in the object detail and the new objects table. Editable everywhere objects are: the panel dialog, the config flow, the `add_object` service, and JSON/CSV import & export.
- **Objects table view**: the *All Objects* view gains a cards/table toggle. The table lists your objects in columns; on mobile it falls back to cards.
- **Configurable table columns**: pick which columns the table shows under **Settings → Objects table columns** (a global setting), from known object fields — Name (always on), Manufacturer, Model, Serial number, Installed, Warranty, Area, Manual, Notes, Tasks, and an actions column. Defaults to all except Manual/Notes.
- **Objects CSV export**: a button on the objects table downloads one row per object — including objects with no tasks (which the existing per-task CSV skips) — with the full asset record. Localized in all 13 languages.

### 🐛 Fixes

- **NFC-linked task titles no longer misaligned** (#66): a task with an NFC tag had its title (and the columns after it) shifted right of the other rows in the dashboard list. The task list now uses a shared CSS subgrid so every row's columns line up regardless of which optional badges a row carries — fixed on desktop and mobile.
- **JSON/CSV export now round-trips the full object record**: `documentation_url` and `notes` were silently dropped from object export/import (since 1.4.0 / 1.4.10) — backups now preserve and restore them (alongside the new warranty date).
- **Settings no longer bounce you out of the panel**: changing any global setting from the panel's Settings tab (a feature toggle, a table column, …) re-registered the sidebar panel, which kicked you back to the Home Assistant default dashboard. The panel is now re-registered only when the sidebar *title* actually changes.

## [2.8.4] - 2026-06-13

### ✨ Delegate write access to chosen non-admins (opt-in)

You can now let specific non-admin Home Assistant users create, edit and delete maintenance content — without making them HA admins. It's **off by default**: list the users under **Panel Access**, then turn on **"Allow selected users to create, edit and delete"** (in the panel's *Settings → Panel Access* tab, or via *Settings → Devices & Services → Maintenance Supporter → Configure → Panel Access*). Admins always have full access; everyone else stays read-only (Complete / Skip / QR). Both controls are admin-only, so an operator can never grant themselves write. Localized in all 13 languages.

### 🔒 Security hardening (audit follow-up)

A focused security review found no critical or high issues; these close the medium/low findings (least-privilege, data-minimisation, defense-in-depth):

- **Permissions are enforced server-side**, not just hidden in the UI: content create/edit/delete is admin-only (or delegated operators, see above), while global settings, import and vacation stay admin-only.
- **User list** no longer reveals admin/owner flags to non-admin callers; `tasks/by_user` is self-or-write.
- **Data export** (JSON + CSV) now requires admin.
- **Documentation-URL handling hardened** — control-character / whitespace-masked and non-`http(s)` URLs are rejected, and the panel renders the link only when it is a real `http(s)` URL.
- **Diagnostics** redact task checklists and drop the raw trigger entity state (which can carry a presence/location value) from the downloadable dump.
- Verbose task/object-name and NFC-tag completion logs demoted to debug.

### 🧹 Internal

- Fixed a stale frontend i18n-parity test (the expected-language list was missing `zh` since #64).
- **2,094 tests**, 98% coverage.

## [2.8.3] - 2026-06-12

### ✨ Simplified Chinese (zh-Hans) — 13th language (#64)

Maintenance Supporter now speaks **Simplified Chinese** across all three surfaces — the panel/card UI, Home Assistant's config-flow + Repairs UI, and phone notification messages. Thanks to **@austinclg** for the contribution. The panel/card bundles were rebuilt from source so the new strings actually ship to users.

### 🐛 Localized notifications for regional language codes

Notification messages are keyed by a 2-letter language code, but `notification_manager` read Home Assistant's full code (e.g. `zh-Hans`, `pt-BR`) without normalizing it — so localized notifications silently fell back to English for any regional code. Home Assistant always reports Chinese as `zh-Hans` / `zh-Hant`, so this was needed for the new translation to reach notifications; it also fixes Brazilian Portuguese, British English, and similar. Language normalization is now centralized in a single helper (`helpers/i18n.normalize_language`) used by every consumer, so it can't drift again.

## [2.8.2] - 2026-06-04

### 🐛 Dashboard strategy timeout — self-heal (follow-up to 2.8.1)

2.8.1 shrank the strategy module to win Home Assistant's 5 s registration race more often, but on frontends with many plugins it could still intermittently fail — and deeper investigation found the real cause: **HA's frontend swaps in a *scoped* custom-element registry during boot.** The strategy element, defined at module load, can end up on a registry the dashboard renderer no longer uses, so HA's `whenDefined` times out and leaves the dashboard blank (the error is logged to the console only).

The shim now **self-heals**: when it detects a strategy dashboard that rendered empty, it forces a fresh re-import of itself (re-registering the element on the *currently active* registry) and re-resolves the view — recovering the real dashboard automatically, without a manual reload. It only acts on a broken strategy view and never disturbs a healthy dashboard.

Verified on a live plugin-heavy system: the re-register + re-resolve recovery restored the full dashboard in every observed failure (9/9), and healthy dashboards are unaffected.

## [2.8.1] - 2026-06-04

### 🐛 Dashboard strategy: "Timeout waiting for strategy element …"

On systems with many frontend plugins (card-mod, layout-card, mushroom, …), opening the auto-generated Maintenance Supporter dashboard could intermittently fail with *"Timeout waiting for strategy element ll-strategy-dashboard-maintenance-supporter to be registered"*. Home Assistant loads custom frontend modules with a fire-and-forget, un-ordered `import()` and then only waits 5 s for a `custom:` strategy element to register — so on a cold load the full strategy bundle could lose that race against the rest of the frontend booting.

The dashboard strategy is now registered by a **tiny, zero-import shim** that defines the element synchronously and lazy-loads the full bundle on first use, so registration wins the race far more reliably. The shim also **self-heals**: if it does load late, it nudges Home Assistant to re-render the view instead of leaving the timeout error on screen.

If you still hit the error on a very busy frontend, a hard-reload (Ctrl+Shift+F5) clears it; the strategy can also be opened from the sidebar panel, which loads independently of this race.

## [2.8.0] - 2026-06-04

### ✨ Rename the sidebar panel (#63)

The sidebar panel was hard-titled **"Maintenance"**, which collides with Home Assistant's own built-in *Maintenance* dashboard (2026.5+). You can now give it any name. Set **Sidebar panel title** in **Settings → Options → General Settings**, or directly in the panel's **Settings** tab — leave it blank to keep the default "Maintenance". The change applies immediately, no restart needed.

### 🌍 Complete panel translations for 10 languages

45 panel/card strings added with the v2.1–v2.4 features (vacation status chips, budget/groups quick-actions, the history dialog, KPI tooltips, delete confirmations, the loading spinner) were only translated in English and German — Dutch, French, Italian, Spanish, Portuguese, Russian, Ukrainian, Polish, Czech and Swedish users saw English placeholders for them. All ten languages are now complete, and a parity test keeps every language block in lockstep so this can't recur.

### 🧹 Internal — DRY cleanups

Behavior-neutral refactors from a full-codebase audit: a single shared task-status helper (was duplicated across the sensor, binary-sensor, and model), one history parse/sort routine, one vacation wire-serializer, and named constants for the warning-days / interval defaults instead of scattered literals. Added cross-layer guard tests so the Python and TypeScript copies of the interval-unit and schedule-kind vocabularies can't silently drift.

## [2.7.1] - 2026-05-25

### 🐛 Compound-trigger editing in Settings → Options was broken

Editing a task's **compound** trigger from **Settings → Options → Edit Trigger** raised an internal `UnknownStep` error as soon as the logic form was submitted — the options-flow compound steps were registered under names that didn't match the form IDs Home Assistant routes to. Compound triggers can be created and edited there again. (Creating a compound trigger during initial object/task setup was unaffected — only the options-flow edit path broke.)

### 🧹 Internal — testing & CI hardening

- **Test coverage raised to 98%** (from ~95%) and enforced in CI (`--cov-fail-under=98`) on Python 3.13 and 3.14, so regressions can't slip in.
- CI now type-checks with `mypy --strict` (the schedule/calendar code is fully annotated) and provides `babel` for the localized calendar-entity labels.
- Dependency: `qs` 6.15.1 → 6.15.2 in the dev/test toolchain (Dependabot).
- Docs: refreshed test/coverage stats and replaced the stale per-module tables in ARCHITECTURE with a regenerate-on-demand command.

## [2.7.0] - 2026-05-24

### ✨ Calendar-pattern schedules

Beyond day/week/month/year intervals, a task can now follow calendar-anchored recurrence:

- **Specific weekdays** — e.g. "every Mon & Thu".
- **Nth weekday of the month** — e.g. "1st Saturday" (test the smoke alarms); 1st–5th or *last*, with an optional month restriction.
- **Day of the month** — e.g. "the 15th", clamped to the month length (so a "31" lands on Feb 28/29).

Choose the pattern from the **Schedule type** selector in the task dialog, the initial config flow, and the per-task options flow. The recurrence appears everywhere a task does — the panel, the Lovelace card, the calendar-entity event ("1st Saturday"), and the vacation projection — localized in all 12 languages. The `add_task` service accepts the new kinds, and they round-trip through **JSON/YAML import-export** intact (CSV degrades them to `manual`, since flat columns can't represent them).

### 🧹 Internal — recurrence model rebuild

A task's scheduling data moved from flat, leak-prone fields (`interval_days` / `interval_unit` / `schedule_type` / …) to a single **Schedule value object** — a discriminated union keyed by `kind`, stored as a nested `schedule` object. Consumers now read computed values (`next_due`, `span_days`) instead of raw rule fields, which makes the unit-misnomer bug class (#58/#59) structurally impossible and is what made calendar patterns expressible in the first place. **Existing tasks migrate automatically and losslessly** (config-entry `minor_version 2 → 3`); old `.storage` data and old export files keep loading unchanged.

## [2.6.4] - 2026-05-24

### 🐛 Sensor (trigger) tasks: choose the safety-interval unit (#58/#59 follow-up)

The optional time-based **safety interval** on sensor-triggered tasks could only
be set in **days** from the UI, even though the backend already supported
weeks/months/years. The unit selector (days / weeks / months / years) now appears
next to the safety interval in both the **panel task dialog** and the
**config/options-flow trigger steps** — so e.g. a "service every 6 months unless
the sensor fires first" task can be configured directly. The "Safety interval
(days)" label is now just "Safety interval", localized in all 12 languages.

A 360° sweep closed the remaining `interval_unit` / `due_date` gaps so the unit
works on **every** create/edit/round-trip path:
- the **`add_task` service** now accepts `interval_unit` + `due_date` (schema,
  handler, and `services.yaml`), so automations can create month/year/one-time tasks;
- **JSON / YAML import** now preserves `interval_unit` + `due_date` (they were
  written on export but dropped on import — round-trip is whole again).

(The Lovelace **card / dashboard** create + edit already use the shared task
dialog, so they were covered automatically.)

### 🐛 Audit fixes — unit-aware consumers

A fresh-eyes audit found three more places that still treated the interval as raw days:
- **Vacation preview** projected a 6-month task as due in 6 *days* — now calendar-aware.
- **Calendar entity** event description showed "3 days" for a 3-month task — now shows the real day-span.
- **Adaptive scheduling** (days-based by design) could corrupt a weeks/months/years task's schedule when a suggestion was applied (`interval_days` overwritten, unit left intact); adaptive is now restricted to day-unit tasks, with a defensive guard on apply.

### 🧹 Internal — DRY

Single-sourced the interval-unit plumbing that had been copy-pasted while threading the feature through every surface: shared `interval_unit_selector()` + `apply_interval_unit()` config-flow helpers, a frontend `_renderUnitSelect()`, and all unit literals now flow from `INTERVAL_UNITS`.

## [2.6.3] - 2026-05-24

### 🐛 Weeks/months/years units now render correctly in the UI (#59)

The new interval units were stored and computed correctly on the backend, but
several frontend surfaces still treated the interval as raw days — so a "1 year"
task (interval `1`) looked broken:
- the task-detail countdown bar (and overview row bar) stayed near 0 %,
- the **calendar** projected a yearly/monthly task at ~1-day steps, spamming the
  window with daily occurrences, and
- interval labels read e.g. "1 days" instead of "1 Years".

All of these now use the real, unit-aware day-span via a shared helper
(`intervalSpanDays` / `daysProgress`), so progress bars, the calendar tab, the
Lovelace calendar card, and the KPI/quick-action labels are calendar-correct for
days/weeks/months/years. New browser tests cover the projection and progress math.

### 🐛 Due-soon alerts for weeks/months/years tasks (#58 follow-up)

A weeks/months/years task didn't warn early enough: the "due soon" window was
capped at the raw interval *count* (`min(warning_days, interval_days)`), so a
6-**month** task with a 14-day warning collapsed to a 6-day window and stayed
OK until ~6 days out. The cap now measures the interval in real calendar days
(`interval_span_days`), so the warning fires exactly as configured. Pinned with
regression tests.

## [2.6.2] - 2026-05-23

### 🐛 Monthly/yearly interval reset to "days" on edit (#58)

A task set to a **weeks / months / years** interval (or a one-time `due_date`) was silently reset to **days** as soon as its dialog was reopened and saved — and its next-due date was recomputed wrongly (e.g. a half-yearly task showing "due in 12 days"). The WebSocket response builder (`_build_task_summary`) didn't echo `interval_unit` or `due_date`, so the task dialog hydrated them as empty → "days" and the next save overwrote the real schedule. Both fields are now included in the response. This is the same class of bug as #50; the field-audit tripwire test has been extended to cover `interval_unit` and `due_date` so it can't regress again.

## [2.6.1] - 2026-05-23

### 🐛 Sensor attributes for one-time tasks + interval units

The per-task sensor now exposes **`interval_unit`** and **`due_date`** as attributes, so monthly/yearly and one-time tasks read correctly in templates and automations — previously a "3 months" task showed `interval_days: 3` with no unit, and a one-time task hid its due date. Attribute display names are localized in all 12 languages.

### 📝 Docs

Updated README, CONFIGURATION and ARCHITECTURE for one-time tasks + calendar interval units (days / weeks / months / years), and corrected the sensor attribute name `next_due_date` → `next_due` in the README.

## [2.6.0] - 2026-05-23

### ✨ One-time tasks (#54, forum)

Tasks can now be scheduled as **one-time** — a single, non-recurring job with an explicit **due date**. It behaves like any other task (status, warnings, completion, history) until you complete it, then it is **archived**: it no longer counts as active, disappears from the card, and shows a muted **"Completed"** badge in the panel. Pick *One-time* as the schedule type in the task dialog, the config flow, or the options flow.

### ✨ Calendar interval units — weeks, months, years (#54)

Time-based tasks are no longer days-only. Choose an **interval unit** — *days, weeks, months* or *years* — and the next due date is computed with real calendar arithmetic (a "3 months" task due on the 31st clamps to the last valid day; leap years are handled). No external dependencies. Existing tasks keep behaving as days.

### 🔁 Round-trip everywhere

The two new fields (`interval_unit`, `due_date`) are persisted and exported/imported across **JSON, YAML and CSV**, and surfaced through the WebSocket API and the config/options flows — all 12 translations updated. New round-trip and flow tests cover every path.

## [2.5.0] - 2026-05-23

### ✨ Action buttons — act on tasks from any dashboard (#49)

Each task now exposes **action buttons** on its object device — `button.<object>_<task>_complete`, `_skip`, `_reset` — so you can complete/skip/reset a task from a chip, tile, or bubble-card pop-up without opening the panel. They run through the same coordinator action layer as the services and mobile-notification actions (no duplicated logic), and a disabled (paused) task's buttons are unavailable. For data entry (cost/notes), use the card's ✓ or the panel — a button entity completes one-tap.

### ✨ Lovelace card: add / edit / delete (panel parity)

The card gained **+ Object** and **+ Task** header buttons, and tapping a task row opens quick-actions (Complete / Skip / Reset / Edit / QR / Delete) — reusing the panel's existing dialogs, so a dashboard can now do day-to-day management without the panel.

### ✨ Create services: `add_object` and `add_task`

New `maintenance_supporter.add_object` / `add_task` actions for automations and scripts; both return the new `entry_id` / `task_id` so you can chain them. They share the object/task creation path with the WebSocket commands (DRY).

### ✨ YAML export & import are now first-class

Added a **YAML export** button next to JSON and CSV, and the importer now accepts YAML as well as JSON — so every format (JSON / YAML / CSV) round-trips.

### 🐛 Export fixes

- **CSV export** crashed (`TypeError` → "action failed, try again") when a task had no checklist (`checklist: null`); `.get("checklist", [])` returned `None`, which the CSV writer iterated. Fixed across CSV and JSON/YAML export.
- **YAML export** crashed (`RepresenterError`) on data the JSON path coerced (e.g. tuples). YAML now normalizes through JSON first, so it works whenever JSON does.

## [2.4.3] - 2026-05-22

### 🌐 i18n: localized summary sensor names in six more languages

The `Needs attention` and `Total tasks` summary-sensor names still fell back to English on **Czech, Polish, Portuguese, Russian, Swedish, and Ukrainian** installs (the other languages were already translated in 2.4.0). They're now localized — `sensor.maintenance_supporter_needs_attention` and `sensor.maintenance_supporter_total_tasks` show translated friendly names everywhere.

## [2.4.2] - 2026-05-22

### 🐛 Summary sensors update immediately when an object is deleted

Deleting a maintenance object left the global summary sensors showing the old counts until the next status event or a restart — and deleting the *last* object left them stale until restart. The summary coordinator listened for object *additions* and per-object updates but not removals; it now also reacts to entry removal (a new `SIGNAL_OBJECT_ENTRY_REMOVED` dispatched from `async_remove_entry`), recomputing instantly and detaching the removed object's listener. The panel KPI chips were always correct (they recompute live per request); this aligns the entities — and the dashboard-strategy headline that reads them — with the panel. Pinned with a regression test.

## [2.4.1] - 2026-05-21

### 🐛 Stable, language-independent summary-sensor entity IDs

The six summary sensors (2.4.0) used `has_entity_name`, which derives the entity-id slug from the **translated** entity name in Home Assistant's system language. On a non-English system language that produced localized IDs (e.g. `sensor.maintenance_supporter_überfällig`) that didn't match the documented `sensor.maintenance_supporter_overdue` namespace — defeating the point of sensors meant to be referenced in dashboards and templates. The entity IDs are now pinned to the documented English slugs on every install, while the **friendly name stays localized**. Existing English installs are unaffected (the ID is unchanged). Pinned with a regression test that registers the sensors under a German system language and asserts the IDs stay English.

## [2.4.0] - 2026-05-20

### ✨ Native summary sensors (#49)

Six aggregate count sensors on a global **Maintenance Supporter** device, so you can put the KPI numbers on chips, badges, or bubble-card pop-ups without writing template sensors:

- `sensor.maintenance_supporter_overdue`
- `sensor.maintenance_supporter_due_soon`
- `sensor.maintenance_supporter_triggered`
- `sensor.maintenance_supporter_needs_attention` (overdue + due-soon + triggered)
- `sensor.maintenance_supporter_ok`
- `sensor.maintenance_supporter_total_tasks`

They update live (object changes, sensor triggers, object add/remove).

### ♻️ One counting implementation (DRY)

Status counts now come from a single aggregator (`helpers/aggregate.py::compute_status_counts`). It feeds the new summary sensors **and** the `maintenance_supporter/statistics` endpoint that powers the panel KPI chips and the Lovelace card header. The dashboard-strategy Overview headline now renders those summary entities via a markdown template instead of counting client-side at generation time — so it's live, and the entities, panel chips, and strategy headline can never show different numbers. Verified live: entities == `/statistics` == task-sensor ground truth. A regression test pins the statistics endpoint and the aggregator to the same numbers.

## [2.3.8] - 2026-05-20

### 🐛 Sensor trigger stuck at OK after a brief `unavailable`/`unknown` blip

A threshold (or counter) trigger that had already fired would silently fall back to **OK** if the monitored sensor briefly went `unavailable` or `unknown` and then returned with the value still beyond the threshold. Reported for a heating system: `system pressure < 1.4 bar` triggered correctly, but that sensor flaps to `unknown` many times a day, and the first blip after triggering left the task stuck at OK despite the low pressure — exactly the kind of alarm you don't want silently cleared.

Root cause: the base trigger handler deactivated the trigger on `unavailable`/`unknown` but left the threshold debounce latch (`_threshold_exceeded`) set, so the next re-evaluation short-circuited and never re-armed. A transient `unavailable`/`unknown` now carries "no new data" — it no longer deactivates an active trigger (a genuinely missing trigger entity is still surfaced via the repair flow). Affects **threshold** and **counter** triggers (shared base handler); `state_change` and `runtime` already handled it correctly. Pinned with regression tests for `unknown`, `unavailable`, and non-numeric states.

## [2.3.7] - 2026-05-20

### 🐛 Lovelace card: sort by due date within a status

Reported on the community forum — a task due in 3 days could appear above one due in 1 day. The card sorted by status only (overdue / triggered / due_soon / ok), and because `Array.sort` is stable, same-status tasks kept their backend/creation order instead of their urgency. Added a secondary sort: within a status, soonest-due first; tasks with no due date sort last. Pinned with a component test (`__tests__/card-sort-due-date.test.ts`).

## [2.3.6] - 2026-05-20

### 📝 Docs: corrected entity-id naming and the "count overdue" template (#56)

The README documented entity IDs with a `sensor.maintenance_*` prefix that the integration never produces. Real task sensors are named `sensor.<object>_<task>` (Home Assistant's `has_entity_name` convention — the object is the device, the task is the entity), e.g. `sensor.family_car_oil_change`. The documented "count overdue tasks" template filtered on `match('sensor.maintenance_')` and therefore always returned 0.

Filter by integration instead — `integration_entities('maintenance_supporter') | select('match', 'sensor.') | select('is_state', 'overdue')` (verified against a 59-sensor setup). Also corrected the automation/service examples that used the bad prefix and added an **Entity naming** section. No code change: entity IDs are unchanged — renaming them would break existing automations and dashboards.

## [2.3.5] - 2026-05-12

### 🔎 Self-diagnostic logging in the dashboard strategy bundle

After v2.3.4 fixed the *initial* timeout, a follow-up report came in where the same timeout returned after a browser restart. The fix in v2.3.4 made the script tiny but did not give us any visibility into whether the script actually ran on a given page load — so we couldn't tell remote-user reports apart (cached old URL? Lovelace resource conflict? CSP block?).

Strategy bundle now emits a clear console banner on load:

```
[maintenance-supporter] strategy bundle v2.3.5 loaded — registrations: {dashboard: ok, editor: ok, section: ok} — run maintenanceSupporterDiagnose() in console for full state
```

And `window.maintenanceSupporterDiagnose()` returns a one-call snapshot of `customElements` registration, `customStrategies` entries, loaded script URLs, and matching Lovelace resources — so debugging a future timeout takes one console call instead of a six-line snippet users couldn't always run.

If `customElements.define()` silently fails (another module clobbered the tag), the bundle now logs a clear FATAL error instead of staying quiet.

## [2.3.4] - 2026-05-08

### 🐛 Dashboard strategy fails to load on slow connections (#52)

`Error: Timeout waiting for strategy element ll-strategy-dashboard-maintenance-supporter to be registered`. HA's strategy loader has a 5 s timeout on `customElements.whenDefined()` for `custom:`-prefixed strategies. The strategy bundle was 510 KB because it eagerly imported every dialog component (object / task / complete / history-edit / qr / quick-actions ×2) plus the three Phase 5 section cards (vacation / budget / groups). On slow links the file didn't finish parsing inside 5 s and the dashboard threw the timeout.

Split the bundle: the entry now is **13 KB** and registers `customElements.define()` immediately. The heavy modules — dialog-mount and the three section cards — are pulled in as separate chunks via dynamic `import()` only when actually rendered. Dashboards with the strategy now open instantly.

Bundle layout changed: strategy lives at `/maintenance_supporter_strategy/maintenance-dashboard-strategy.js` with `chunks/` siblings. Existing dashboards keep working — the strategy is identified by `custom:maintenance-supporter` (a logical name resolved via `window.customStrategies`), not by URL.

## [2.3.3] - 2026-05-02

### 🐛 Panel scroll behaviour is now consistent

Clicking a KPI tile, switching tabs (Dashboard / Calendar / Settings), or drilling into an object/task always lands you at the top of the new view — previously the Objects KPI silently no-op'd while the four filter KPIs scrolled, and tab/sub-view changes left you at the previous scroll position. Verified across 7 navigation paths via Playwright.

## [2.3.2] - 2026-05-03

### 🛡️ Test action is validate-only — no side effects

The completion-action Test button no longer fires the actual service-call. Previously it would e.g. reset a vacuum's dirty-time sensor or increment a counter for real, just from clicking Test. Now five checks run before save, none with side effects:

- Service format matches `domain.service`
- Service exists in `hass.services` (catches typos)
- Cross-domain whitelist for `homeassistant.*` / `scene.*` / `notify.*` / `persistent_notification.*`
- Otherwise entity domain must match service domain
- Target entity exists in `hass.states`

Button label is now "Validate configuration"; the action fires only when the task is marked complete.

### 🐛 Calendar past-mode shows event types instead of status

Past-mode rows (← 30 d / ← 90 d) used to label completed/skipped events with their derived status (`OK` / `DUE_SOON`) — same badge a current OK task shows, easy to mistake for "nothing happened". Now they read **Completed / Reset / Skipped / Triggered / Trigger replaced**. Forward mode is unchanged (still shows projected status). Color coding is unchanged.

Adds the missing `trigger_replaced` translation (EN + DE).

### 🎨 Calendar chips are symmetric

Was `[← 30d] [← 90d]   [7 days] [14 days] [30 days] [1 year]` — past + forward looked alike. Now `[−30d] [−90d] • [+7d] [+14d] [+30d] [+1y]` with explicit −/+ and a dot separator.

### Tests

1608 backend, 60 frontend (+1 regression test asserting no service-call on Test click).

## [2.3.1] - 2026-05-03

Patch release fixing five v2.3.0 follow-up bugs around HA's lazy-loaded form elements + missing dialog-mount feature props.

### 🐛 Object-edit dialog showed only the area picker (#46 follow-up)

Notes and every other text field on objects were invisible. `<ha-textfield>` rendered with `offsetHeight: 0` because HA lazy-loads it on first use and in the panel-custom + Lovelace contexts that load isn't always triggered.

**Fix:** new `<ms-textfield>` (`components/ms-textfield.ts`) — drop-in replacement, native `<input>` styled to match HA, identical API. Replaced in object-dialog (6×), task-dialog (25×), group-dialog (2×). Notes textarea uses native `<textarea>`.

### 🐛 Edit button broken in Lovelace / strategy dashboards (#50 follow-up)

The Edit button in the task quick-actions dialog silently crashed with `TypeError: ... 'toString'`. `dialog-mount.openEditTaskDialog` was passing a stub `{id: taskId}` to `task-dialog.openEdit`, which expected the full task.

**Fix:** `openEditTaskDialog` now fetches the full task via `maintenance_supporter/object` WS before opening.

### 🐛 Task-dialog feature sections hidden in Lovelace context (#50 follow-up)

When opened from a Lovelace card, the completion-action / quick-complete / schedule_time / checklist sections were all silently hidden. `dialog-mount` never set the corresponding feature-flag properties, so they defaulted to `false`.

**Fix:** new `fetchSettingsOnce(hass)` cache in `dialog-mount.ts` that reads `maintenance_supporter/settings` once per session and propagates feature flags + `defaultWarningDays` to the task-dialog before opening. Behaviour now identical to the panel.

### 🐛 Test action button now actually validates (#50 follow-up)

The Test action call signature diverged from the production action_listener (entity_id merged into data vs target as separate arg). Result: Test reported green for service/entity domain mismatches that would silently fail at completion time.

**Fix:** `_testAction` passes target as a separate arg, runs an up-front domain-mismatch check (with whitelist for cross-domain services like `homeassistant.*` / `scene.*`), and surfaces the real HA error message instead of a generic "failed".

### 🐛 Completion-action target picker not rendering (#50 follow-up)

The target-entity picker was invisible — same lazy-load class as `<ha-textfield>` but for `<ha-entity-picker>`.

**Fix:** replaced `<ha-entity-picker>` with `<ha-form>` configured with `selector: { entity: {} }`. ha-form is reliably registered and lazy-loads its child pickers internally. Domain restriction removed (was filtering out e.g. `counter.*` helpers); an inline hint explains the service-domain-must-match-entity-domain requirement.

### 🧪 Tripwire for the lazy-load class

New `__tests__/dialog-no-lazy-load-elements.test.ts` mounts each major dialog and asserts the shadow DOM contains none of `ha-textfield` / `ha-textarea` / `ha-entity-picker`. Forces future dialogs to use the wrappers from the start.

### Tests

- 1608 backend (unchanged from v2.3.0)
- 59 frontend (was 54 + 5 new tripwires)
- 20/20 live consistency check across 4 service/entity domain scenarios

## [2.3.0] - 2026-05-02

### 🐛 Fix — `on_complete_action` settings now persist on save (#50)

Configuring per-task **Action on completion** (press a button, run a script, etc.) appeared to fail: settings showed empty after saving + re-opening the task. Editing any other field then nulled the persisted action because the dialog re-sent its empty local state.

**Root cause:** the `on_complete_action` and `quick_complete_defaults` fields were being persisted correctly, and the action listener was firing them on completion — but the WS response builder `_build_task_summary` was missing both fields. The dialog hydrated with `undefined` on every reload.

**Fix:** add the two fields to `_build_task_summary`. Plus 3 tripwire tests pinning field-completeness across `_build_task_summary`, `_build_object_response.object`, and `_build_full_settings` so the same class of regression can't ship for any future field.

### ✨ Feat — Full Card/Strategy ↔ Panel feature parity

The Lovelace card and dashboard strategy now offer every action the panel's Task-Detail page does, in-place, without forcing a panel-roundtrip.

**Quick-actions dialog** (opens when you click any task row in the card or strategy):
- Primary: Complete (rich dialog with notes/cost/duration), Skip (inline with reason), Reset (inline with date picker)
- Admin: Edit task, QR Code, Delete (with confirm)
- Inline expansion: history (last 20 entries with per-entry edit) + stats (times performed, total cost, avg duration)
- **NEW**: "Show stats + graphs" toggle reveals adaptive panels — Recommendation card with Apply/Reanalyze buttons, Sensor-Prediction with urgency banner, Weibull reliability curve, seasonal factors. All four reuse the existing panel renderers, so the Lovelace view is identical to what's in the panel.

**Object quick-actions dialog** (clicked from a task's object breadcrumb): meta + task list + Edit/Add task/Delete.

### ✨ Feat — Interactive Vacation/Budget/Groups section cards

The 3 status sections that previously deep-linked to the panel are now fully interactive in Lovelace:

- **Vacation card** — Enable toggle, start/end/buffer date inputs, Save + End-now buttons, exempt-task count
- **Budget card** — Monthly + yearly progress bars + spent display, Set monthly/yearly inputs, Save button
- **Groups card** — Add/rename/delete groups inline with task-count chips

Available via "+ Add Card" → "Maintenance Supporter — Vacation / Budget / Groups". Also work on a HA 2026.5+ dashboard via section-strategies.

### 🐛 Fix — Complete dialog inputs now render in Lovelace

When the complete-dialog was opened from a Lovelace card (vs the panel), the notes/cost/duration `<ha-textfield>` inputs rendered with zero height because `ha-textfield` isn't always lazy-loaded in the Lovelace context. Replaced with native `<input>` elements styled to match — works regardless of which HA elements are loaded.

### 🎨 UX — Edit/QR/Delete button layout

The secondary action row in the task quick-actions dialog (Edit / QR Code / Delete) was awkwardly right-aligned, leaving an empty gap on the left. Now Edit + QR Code group on the left as natural admin tools; Delete is pushed to the far right with `margin-left:auto` for visual separation as a destructive action.

### 🔧 Refactor — DRY-audit cleanup

Three extractions identified by a systematic audit of the codebase:

- **Recommendation-card visuals** → `renderers/recommendation.ts`. The bars + confidence badge are shared between the panel's task-detail page and the Lovelace quick-actions dialog. Future visual changes happen in one place.
- **Backend entry-load helper** → `_load_object_entry(hass, connection, msg)` in `websocket/__init__.py`. Replaces 7 instances of the same `entry not None / wrong domain / global` guard across 4 WS files. Beyond LOC saved: future WS handlers can't accidentally skip one of the three checks.
- **Section-card shared CSS** → `components/section-card-shared-styles.ts`. Each of the 3 section cards was carrying ~30 LOC of identical button + header + error/loading styles. Single source of truth.

### 🧪 Tests + verification

- 1608 backend tests pass (94.67% coverage, ≥90% required)
- 52 frontend tests pass
- 3 new tripwire tests prevent the #50 regression class from recurring
- 11/11 quick-actions WS endpoints verified live in Docker
- 12/12 section-card WS write paths verified end-to-end (vacation enable/dates/buffer, budget monthly/yearly, group create/rename/delete)

### 📦 Bundle sizes

- maintenance-card.js: 365 KB → 372 KB (+2%)
- maintenance-dashboard-strategy.js: 455 KB → 504 KB (+11%, mostly the 3 interactive section cards + adaptive renderers)
- maintenance-panel.js: 607 KB → 610 KB (~unchanged)
- maintenance-calendar-card.js: 365 KB → 366 KB (~unchanged)

## [2.2.0] - 2026-05-02

### Add — Calendar past-window + History entry editing

Two related features (Discussion #49 follow-up): review the last 30 days of completed maintenance and correct mistakes in old entries.

#### Calendar past-window (Phase C)

The Calendar Card now has a dedicated *past-window* chip group (`← 30 d`, `← 90 d`) visually separated from the existing forward chips (`7 / 14 / 30 / 1 y`). Past mode walks the task **history** instead of `next_due` and buckets entries by their actual completion / reset / skip date. Past windows automatically collapse empty days (otherwise 30 rows of "no events" would drown the few real ones).

YAML config: `past_days: 30 | 90` (mutually exclusive with `window_days`).

Click on a past event opens the **history-edit dialog** in-place (no panel navigation).

#### History entry editing (Phases A + B)

New WebSocket: `maintenance_supporter/task/history/update`. Patchable fields: `timestamp`, `notes`, `cost`, `duration`, `completed_by`. Read-only fields (`type`, `trigger_value`, `checklist_state`, `feedback`) stay untouchable — those carry semantic meaning that shouldn't be silently rewritten.

Identification: by the entry's `original_timestamp` (more stable than index across concurrent mutations). If the patch moves the latest lifecycle entry's date, `last_performed` is **automatically recomputed** so `next_due` math doesn't drift onto a stale anchor.

UI:
- Task detail → History tab → each completed/reset/skipped entry gets a small Edit button (✏️) → opens `<maintenance-history-edit-dialog>` with date / notes / cost / duration fields. Triggered entries are not editable (auto-generated by sensors).
- Calendar Card past-event click → same dialog, fired via `ll-custom maintenance-supporter:edit-history` event → strategy bundle's handler mounts the dialog onto `document.body` (works from any Lovelace context).

### Tests — intensive verification

Coverage:

- **14 unit tests** (`tests/test_history_edit.py`):
  edit-notes / edit-cost+duration / clear-with-null / unknown-timestamp / unknown-task / unknown-object / invalid-timestamp / non-admin-rejected / latest-completion-bumps-last_performed / older-entry-doesn't / older-becomes-latest / non-lifecycle-doesn't / persistence / WS-contract.
- **9 frontend bucketer tests** for the past-window logic (`__tests__/calendar-bucket.test.ts`).
- **18-step live E2E roundtrip** (`docker/config-dev/verify_history_edit.py`) against HA 2026.5.0b0 covering all 6 patch scenarios + 2 error paths. **18/18 ✓.**

Total: **1604 backend tests + 52 frontend tests + 18 live E2E checks** — all green.

ruff ✓.

## [2.1.1] - 2026-05-02

### Fix — Stats-Bar lifted above the tab bar so KPIs work from every tab

v2.1.0 made the KPI numbers clickable filters (Overdue / Due Soon / Triggered) — but the stats-bar was rendered inside `_renderDashboard()`, so the KPIs disappeared whenever the user switched to the *Calendar* or *Settings* tab. The `_filterByStatus()` helper had a tab-auto-switch fallback ready, but the user could never reach it because the buttons were gone.

Fix: stats-bar moved to `_renderOverview()`, **above** the tab-bar. KPIs are now persistent across all three tabs. Click *Overdue* from the Calendar tab → the panel auto-flips to *Dashboard* with the *Overdue* filter applied, exactly as v2.1.0 promised.

The `.active` highlight on filter-status KPIs now also gates on `_overviewTab === "dashboard"` — when you're on Calendar/Settings, the highlight clears (since the filter has no visible effect there).

Verified live in headless Chromium (HA 2026.5.0b0): all 6 cross-tab checks pass — KPIs visible on Dashboard / Calendar / Settings, click-from-Calendar correctly flips tab and sets dropdown.

ruff ✓ · 1590 backend tests pass · 43 frontend tests pass.

## [2.1.0] - 2026-05-02

### Add — All KPI numbers are now clickable filters (Discussion #49)

Direct ask from [@byoung79](https://github.com/byoung79) in [Discussion #49](https://github.com/iluebbe/maintenance_supporter/discussions/49):

> Make all the KPI numbers actionable — when I tap the number of objects it takes me to objects list. Do similar things for all numbers (i.e. auto filter list) based on selection.

Shipped:

- Tap **Objects** → opens the all-objects view (already worked).
- Tap **Tasks** → clears the status filter and shows all tasks (new).
- Tap **Overdue** → sets the filter dropdown to *Overdue* and smooth-scrolls to the task list (new).
- Tap **Due Soon** → same, filter = *Due Soon* (new).
- Tap **Triggered** → same, filter = *Triggered* (new).

Status KPIs that are the active filter get a **bottom-bar highlight** so the current filter stays visible after scrolling. Switching to the Calendar or Settings tab and clicking a KPI auto-flips back to the Dashboard tab so the filter has somewhere to apply. The filter dropdown's `value` is now bound to the panel state so it reflects KPI clicks (was unbound before).

EN + DE tooltip strings added; other 10 languages fall back to EN until next i18n pass.

Verified live in headless Chromium against HA 2026.5.0b0:
- 5 clickable KPIs detected
- Overdue click → dropdown value = "overdue", `.stat-item.active` set
- Tasks click clears the filter, `.stat-item.active` removed

ruff ✓ · 1590 backend tests pass · 43 frontend tests pass.

## [2.0.0] - 2026-05-02

### Refactor — Panel Calendar tab now powered by the extracted Card

The panel's *Calendar* tab no longer renders the calendar inline. Instead, the panel embeds the v1.9.0 `<maintenance-supporter-calendar-card>` and intercepts its `ll-custom open-task` events to navigate within the panel as before. **Single source of truth** for all calendar rendering — same code now powers the panel tab, the standalone Lovelace card, and the dashboard strategy's `group_by: calendar` mode.

What was deleted from the panel:
- `_renderCalendar()` method (~125 lines of duplicate Lit template literals)
- `_calendarWindowDays` and `_calendarUserFilter` `@state` declarations (now lives inside the card)
- ~175 lines of `cal-*` CSS rules from `panel-styles.ts` (now lives in shared `calendar-styles.ts` only)

What stayed: the panel's tab routing (clicking on a calendar event still calls `_showTask(entry_id, task_id)` to navigate within the panel — the new `_onCalendarLlCustom` handler intercepts the card's event with `stopPropagation` so the document-level dialog-mount handler doesn't also fire and open a duplicate dialog).

No user-visible changes; same look, same controls, same behavior. **Major version bump because the panel's internal architecture changed materially** — anyone who was extending or patching `_renderCalendar` will need to point at the card instead.

Verified live on HA 2026.5.0b0 (14/14 strategy checks). Backend tests: 1590 pass · Frontend tests: 43 pass.

## [1.9.1] - 2026-05-02

### Add — Calendar Card visual editor

Pick *Maintenance Supporter — Calendar* in the Add Card dialog and click **Edit** to get a small visual editor — title input, default-window dropdown (Week / Fortnight / Month / Year), toggles for *show window chips inside the card* and *show user filter dropdown*, plus a default-user-filter selector. No more YAML for the common cases.

The editor follows the same pattern as `MaintenanceSupporterCardEditor` and the dashboard strategy editor: LitElement that exposes `setConfig()`, holds the current config in `@state`, and dispatches `config-changed` on input. Lazy-mounted via the card's `getConfigElement()` static.

Verified live on HA 2026.5.0b0 (14/14 strategy checks).

ruff ✓ · 1590 backend tests pass · 43 frontend tests pass.

## [1.9.0] - 2026-05-02

### Add — Calendar Card + in-place dialogs (no more panel-roundtrip)

Two big pieces land together. Both follow the "no small steps" directive — the previous releases used URL deep-linking and inline calendar code; v1.9.0 extracts the calendar into its own first-class card and makes dialog-opening a true in-place operation.

#### Calendar Card

The Calendar tab from the panel is now also available as a standalone Lovelace card:

```yaml
type: custom:maintenance-supporter-calendar
title: Maintenance calendar           # optional
window_days: 30                        # 7 | 14 | 30 | 365 — default 30
show_window_chips: true                # default true
show_user_filter: true                 # default true
user_filter: ""                        # "" | "current_user" | "<uuid>"
```

Same visuals as the panel: 7/14/30/365-day window chips, per-event source icons (clock for time-based, trending-up for sensor-based, with adaptive sparkle), confidence pills (green/amber/red border), projected recurrences at 55 % opacity, today-pill highlight, empty-day collapsing in the year view. Click on an event dispatches an `ll-custom` event that the strategy bundle's handler turns into an in-place task-dialog open.

The calendar card registers in `customCards` so it shows up in HA's "Add Card" picker labelled *Maintenance Supporter — Calendar*. Implementation lives in a new file (`maintenance-calendar-card.ts`) sharing the rendering helpers (`calendar-bucket.ts`, `calendar-styles.ts`) with the panel — the panel still renders the same view, just via the same shared helpers now.

#### Strategy `group_by: calendar`

A fifth view mode for the dashboard strategy. Generates four panel-typed views — *Week / Fortnight / Month / Year* — each pinned to one of the four window sizes, with chips hidden because the tab bar already serves as the window selector:

```yaml
strategy:
  type: custom:maintenance-supporter
  group_by: calendar
```

Editor dropdown gets the matching entry "Rolling calendar (Week / Fortnight / Month / Year)".

#### In-place dialogs (no panel navigation)

`fire-dom-event` tap actions now open the maintenance object/task dialog **directly on the current dashboard** instead of navigating to the panel. Implementation:

- New `dialog-mount.ts` helper exports `openCreateObjectDialog()`, `openEditTaskDialog(entryId, taskId)`, etc. that lazy-mount the existing `<maintenance-object-dialog>` / `<maintenance-task-dialog>` LitElements onto `document.body` and inject `hass` from `<home-assistant>.hass`.
- The strategy bundle's `ll-custom` handler tries the in-place mount first; falls back to URL deep-linking if `<home-assistant>` isn't ready (e.g. dialog opened during very-early app boot).
- The empty-state's "Add object" button thus opens the dialog **without leaving the dashboard**, and clicking a calendar-card event opens the task editor likewise in-place.

Strategy bundle grew from ~6 KB to ~400 KB to bundle the dialogs; the calendar card is its own ~355 KB bundle. Both still tiny relative to the panel (~580 KB) and only loaded when the user actually visits a dashboard that uses them.

Verified live on HA 2026.5.0b0 (13/13 strategy checks): all 5 group_by modes (incl. calendar), editor (5 options), KPI header + sidebar, section strategy, fire-dom-event opens object dialog in-place, calendar card registered in `customCards`.

ruff ✓ · 1590 backend tests pass · 43 frontend tests pass.

## [1.8.1] - 2026-05-02

### Add — fire-dom-event tap actions + Empty-state second button + cosmetic refactor

The remaining two patterns from the v1.8.0 best-practice backlog land. Now closed.

**fire-dom-event plumbing.** A document-level `ll-custom` event listener (registered once at strategy-bundle load) intercepts payloads namespaced with `maintenance-supporter:` and rewrites the URL so the panel can deep-link into a specific dialog on next navigation. Currently handled events:

- `maintenance-supporter:add-object` → `/maintenance-supporter?ms_action=add_object` → opens Add Object dialog
- `maintenance-supporter:open-task` (task_id required) → `/maintenance-supporter?ms_action=open_task&task_id=<id>` → reserved for future deep links

The empty-state view now ships a second button — *"Add object"* — using this pattern:

```yaml
tap_action:
  action: fire-dom-event
  ll_custom:
    type: maintenance-supporter:add-object
```

Two design notes: (1) the ll-custom listener is registered idempotently via a window-level flag, so the strategy file loading twice (e.g. via HACS + extra_module_url combination) doesn't double-bind; (2) the implementation uses URL-based deep linking instead of importing the dialog into a custom element — same UX, no panel-code refactor needed.

**Panel deep-link extension.** `_handleDeepLink()` now recognizes `?ms_action=add_object` and opens the create-object dialog after a frame.

**Cosmetic: `summaryCardBuilders` refactor.** The if/else chain for `group_by` modes became a `Record<GroupBy, () => ViewConfig[]>` lookup, mirroring HA core's home-overview-view-strategy. Adding a new mode is now one entry instead of editing a chain.

Verified live on HA 2026.5.0b0 — all 11 strategy checks pass (4 group_by modes, editor, KPI header, sidebar, section strategy register+generate, fire-dom-event handler routes correctly).

ruff ✓ · 1590 backend tests pass · 43 frontend tests pass.

## [1.8.0] - 2026-05-02

### Add — Empty-state, KPI header + sidebar, and a Section Strategy

Round 4 of dashboard-strategy work picks up the patterns from HA core's `home-overview-view-strategy` (header, sidebar, empty-state) and `common-controls-section-strategy` (section as third strategy type).

**Empty state.** First-time users with zero maintenance objects no longer get a useless "no tasks" page. The strategy short-circuits to a `type: empty-state` card with a *"Open Maintenance panel"* button (`tap_action: navigate /maintenance-supporter`) — same visual pattern HA core uses for fresh-install dashboards.

**KPI header on every screen.** The Overview view now ships with a `header: { layout: responsive, card: ... }` markdown line — `🔴 N overdue · ⚡ N triggered · 🟡 N due soon · 🟢 N ok` (zero counts are pruned, "ok" always shown). Renders above the task list at any width.

**Sidebar on wide screens.** When the view has at least 2 columns (HA's `LARGE_SCREEN_CONDITION` — `condition: view_columns, min: 2`), a sidebar pinning the same KPI card appears on the right so the headline counts stay visible while scrolling long lists. Mobile / narrow screens skip it automatically — no media-query duplication.

**Section Strategy.** A new third-class strategy `custom:maintenance-supporter-section` for embedding maintenance tasks into any HA dashboard view (HA's home dashboard, the areas dashboard's per-area view, anything section-based):

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

`area_id` resolves via the WS feed at section-load time, so it follows area renames automatically. All filters are optional and additive.

Verified live on HA 2026.5.0b0 (10/10 checks pass): 4 group_by modes, editor, header, sidebar, section strategy register + generate.

ruff ✓ · 1590 backend tests pass · 43 frontend tests pass.

## [1.7.0] - 2026-05-02

### Add — Strategy: `floor` + `due_date` group_by + visual editor

Round 3 of the dashboard-strategy work, after a deeper read of HA core's strategy zoo (`areas-dashboard`, `home-overview`, `iframe-dashboard`, `common-controls-section`, `hui-areas-dashboard-strategy-editor`). Two new layouts and an editor land:

**`group_by: floor`** — uses HA's floor registry. Each view = one floor, containing the objects whose area lives on that floor. Floors sorted by `level` then name (matches HA core's own ordering). Objects whose area has no floor (or which have no area at all) land in an *Other* view at the end.

**`group_by: due_date`** — five buckets: *Overdue / Today / This Week / This Month / Later*. Powered by two new card filters that compose with the existing `filter_status` / `filter_objects`:

```yaml
type: custom:maintenance-supporter-card
filter_due_min_days: 1     # inclusive; days_until_due >= this
filter_due_max_days: 7     # inclusive; days_until_due <= this
```

Tasks with no numeric `days_until_due` (e.g. sensor-triggered without a computed next_due) are excluded from any ranged view — they remain visible in unfiltered or status-only views.

**Visual editor** — the strategy now exposes `getConfigElement()` returning a tiny dropdown editor. When a user picks "Maintenance Supporter" in the dashboard picker and clicks *Edit*, they get a *"Group views by"* select with all four modes labelled in plain English instead of staring at YAML. Pattern matches HA core's `hui-areas-dashboard-strategy-editor` (LitElement-style `setConfig` + `config-changed` event), implemented as a plain HTMLElement so the strategy file stays Lit-free.

Verified live on HA 2026.5.0b0:
- `area` → 10 views (Overview + 8 areas + Unassigned)
- `status` → 5 views (Overview + 4 statuses)
- `floor` → 2 views (Overview + 1 floor — test environment has 1 floor)
- `due_date` → 5 views (Overview + 4 non-empty buckets — Today bucket correctly skipped when empty)
- editor → registers, preselects from `setConfig`, dispatches `config-changed` on dropdown change

ruff ✓ · 1590 backend tests pass · 43 frontend tests pass.

## [1.6.1] - 2026-05-02

### Add — Strategy `group_by` option (area / status)

Reading HA core's own ``areas-dashboard-strategy.ts`` and the new ``maintenance-view-strategy.ts`` (battery dashboard, by [@Brookke](https://github.com/Brookke)) revealed three best-practice patterns we hadn't applied in the v1.6.0 strategy. v1.6.1 brings them in.

**1. Honor the `_config` parameter.** v1.6.0's ``generate(_config, hass)`` ignored its first argument. v1.6.1 reads ``config.group_by`` so users can pick the layout from YAML:

```yaml
strategy:
  type: custom:maintenance-supporter
  group_by: status   # views: Overview + Overdue + Triggered + Due Soon + OK
  # group_by: area   # default — views: Overview + one per area + Unassigned
```

Empty groups are skipped in both modes (nobody wants an empty "Triggered" tab when nothing's triggered).

**2. Startup-state guards.** When HA is still booting (``state === "NOT_RUNNING"``) or in recovery mode, the strategy now returns the same ``{type:"starting"}`` / ``{type:"recovery-mode"}`` placeholder cards HA core uses, instead of attempting a WebSocket call that would fail with an unfriendly "not loaded" markdown.

**3. Empty-section guard for areas.** v1.6.0 already filtered the Unassigned view; v1.6.1 also skips areas that, after grouping, end up with zero objects.

Verified live on HA 2026.5.0b0: ``group_by=area`` → 10 views, ``group_by=status`` → 5 views.

## [1.6.0] - 2026-05-02

### Add — Dashboard Strategy (HA 2026.5+)

Home Assistant 2026.5 added discovery for custom dashboard strategies — integrations can now ship code that auto-generates a complete Lovelace dashboard from live data, and users find it in the *"Add Dashboard"* picker without YAML.

Maintenance Supporter ships one. Pick *"Maintenance Supporter"* in the dashboard picker and you get:

- **Overview view** — actionable tasks only (overdue + triggered + due_soon), no header bar.
- **One view per area** — sorted alphabetically, each filtered to that area's objects via the existing card.
- **Unassigned view** — objects without an `area_id`, pinned to the end so it's easy to spot what needs an area set.

The card config inside each view is generated dynamically from the `maintenance_supporter/objects` WS feed at dashboard-load time, so adding a new object or changing an area is reflected without touching YAML.

On HA versions < 2026.5 the JS still loads but the registration is a silent no-op — you just won't see the strategy in the picker. The card and panel work as before.

### Add — Disambiguator from HA's built-in *Maintenance Dashboard*

HA 2026.5 also ships a built-in *Maintenance Dashboard* (by [@Brookke](https://github.com/Brookke)) that auto-discovers battery entities. Different scope, complementary purpose. README now opens with a clear distinction so HACS users searching for "maintenance" understand which one solves which problem.

ruff ✓ · mypy strict ✓ · 1590 backend tests pass · headless-Chromium verification on HA 2026.5.0b0 confirms registration + generate() round-trip.

## [1.5.4] - 2026-05-02

### Fix — Stale-reference hardening (audit follow-up to #48)

The #48 area-sync fix exposed a broader pattern: every value the integration stores as a foreign key into HA's runtime registries (entities, users, devices) needs an explicit listener for upstream changes. A code-wide audit found three more instances and fixed them in one release.

**A. Entity-rename rewrites stored `trigger_config["entity_id"]` and `adaptive_config["environmental_entity"]`.** Triggers used `async_track_state_change_event` filtered by entity_id, so a sensor rename in HA's UI silently killed the trigger — no log, no error, just stopped firing. A new `EVENT_ENTITY_REGISTRY_UPDATED` listener walks all tasks (including nested compound conditions and per-entity `_trigger_state` keys), updates entry data + the dynamic Store, and schedules an entry reload so listeners re-subscribe to the new id.

**B. Orphaned `task.responsible_user_id` cleared at startup.** `_check_admin_panel_user_orphans` already handled the global setting; the task-level field had no equivalent check. After the cleanup, the dashboard stops rendering "Unknown user" indefinitely. Defensive: skipped when HA's auth returns 0 users (test harness without auth fixture) so synthetic test user IDs aren't pruned.

**C. `cleanup_group_refs` extended to the `async_remove_entry` path.** Removing the integration via HA's "Remove integration" button (REST `DELETE /api/config/config_entries/entry/<id>`) bypassed our WS delete and left phantom `task_refs` in groups. One-line fix at the canonical removal hook.

12 new pytest cases pin all three; verified live in Docker with synthetic `entity_registry_updated` events and a real REST DELETE.

ruff ✓ · mypy strict ✓ · 1590 tests pass.

## [1.5.3] - 2026-05-01

### Fix — Object area now stays in sync with the HA device area (#48)

Editing an object's area in the dashboard updated the object's record but never reached HA's device registry, so the device kept whatever area it got at first creation (or none). Conversely, changing the device's area in HA's UI never made it back to the dashboard. Both sides now sync after the initial creation.

`DeviceInfo.suggested_area` is a creation-only hint — HA never re-applies it to an existing device. The fix adds two listeners:

- **Forward (obj → device)**: a per-entry update listener pushes obj fields into `device_registry.async_update_device()` when the entry data changes. Covers `area_id`, `name`, `manufacturer`, `model`, `serial_number` — the dashboard had the same dual-storage bug for all five.
- **Reverse (device → obj)**: a global `EVENT_DEVICE_REGISTRY_UPDATED` listener mirrors `device.area_id` back into the object when the user changes the area in HA's device settings. Loop-prevention: each listener no-ops when both sides already match.

`name_by_user` (HA's sticky-override semantic) is intentionally left alone — only area is synced bidirectionally. Verified in Docker for all 7 in-scope sync paths and pinned with 5 new pytest cases.

ruff ✓ · mypy strict ✓ · 1578 tests pass.

## [1.5.2] - 2026-04-30

### Add — 1-year window in the Calendar tab

The Calendar tab's window chips were 7 / 14 / 30 days. Adding a 4th *"1 year"* chip lets users see annual planning at a glance — long-cycle tasks like brake-pad inspection, fire-extinguisher refill, or solar-panel cleaning that wouldn't appear in a 30-day window are now visible without leaving the panel.

Naively rendering 365 day rows would drown the few real events under 300+ italic *"No maintenance"* lines. So the year view **collapses empty days** — only days with at least one event render — keeping the list scannable at any tab width. The 7/14/30 views are unchanged (preserve the calendar-grid feel).

- `_calendarWindowDays` accepts `365`; the chip array becomes `[7, 14, 30, 365]`.
- `cal_window_365` i18n key × 12 languages (e.g. *1 year* / *1 Jahr* / *1 рік* / *1 år*).
- When `windowDays === 365`, `_renderCalendar` filters buckets to non-empty before rendering.
- 16 calendar-bucket tests still pass (no semantic change — the helper produces all 365 buckets, the view layer collapses them).

ruff ✓ · mypy strict ✓ · 39 frontend tests pass · live screenshots updated for both desktop + mobile (`calendar-tab-year.png`, `calendar-tab-mobile-year.png`).

## [1.5.1] - 2026-04-30

### Add — Source indicator + sensor-prediction confidence in the Calendar tab

The v1.5.0 Calendar tab showed *what* was due but not *why that date*. Time-based tasks (interval since last completion) and sensor-based tasks (regression-predicted threshold crossing) looked identical — same date pill, same status pill. v1.5.1 adds a small icon and an optional confidence badge so users can tell at a glance whether a calendar entry is a hard deadline or a sensor estimate.

- **Time-based** events get an `mdi:clock-outline` icon (or `mdi:clock-time-four-outline` when adaptive scheduling is on, signalling "the interval is being learned from completion history").
- **Sensor-based** events get an `mdi:trending-up` icon in the HA primary color.
- For sensor-based events that aren't already `triggered`, a small pill below the title shows *"predicted · {high|medium|low} confidence"* using the existing `threshold_prediction_confidence` from the WS payload. The pill border + text colour reflects the confidence (green / amber / red) so a low-confidence prediction is visually softer than a high-confidence one.
- Implementation is purely additive: `CalendarEvent` gains `adaptive_enabled: boolean` and `prediction_confidence: string | null`; the bucketing helper reads them from the existing task payload (`adaptive_config.enabled`, `threshold_prediction_confidence`) — no backend changes.
- 7 new i18n keys × 12 languages (`cal_source_time`, `cal_source_time_adaptive`, `cal_source_sensor`, `cal_predicted`, `cal_confidence_high/medium/low`).

### Fix — Projected recurrences of overdue tasks no longer show "OVERDUE 211d"

Caught while testing the icons: a 7-day-interval task that's currently 211 days overdue projected its next 4 occurrences with status `overdue` and *"211d overdue"* suffix — misleading, because each projection IS the assumption that the user completes today and the cycle resets. Projected slots now downgrade to `ok` status and clear `days_until_due`, so a recurring overdue task reads "OVERDUE today, then OK on May 7, OK on May 14, …" instead of "OVERDUE 211d × 5".

ruff ✓ · mypy strict ✓ · 16 calendar-bucket tests pass (added 4) · live screenshot updated.

## [1.5.0] - 2026-04-30

### Add — Calendar tab with rolling view + recurring projection

A third tab in the Maintenance panel — between *Dashboard* and *Settings* — shows upcoming maintenance as a chronological list rather than a grid. Designed for the "what's coming up?" question that the dashboard's status-grouped view doesn't answer at a glance.

- **Window chips**: 7 / 14 / 30 days (default 30). Pill toggle bar in HA primary color.
- **Recurring projection**: time-based tasks with an `interval_days` show their first due date *and* up to 4 projected subsequent occurrences within the window. Projected events render at 55% opacity with an "every N days" subtitle so they're visually distinct from the actual `next_due`. Sensor-triggered tasks intentionally show only `next_due` — projecting future sensor firings would be a guess.
- **User filter**: same "All Users / My Tasks" dropdown as the dashboard, resolves `current_user` against `hass.user.id` via the existing `UserService`.
- **Status sorting** within a day: overdue → triggered → due_soon → ok, then alphabetical.
- **Today highlighting**: today's date pill picks up the HA primary color and gets a "TODAY" badge next to the month label.
- **Empty days**: italic *"No maintenance"* — preserves vertical rhythm while making it obvious nothing is due.
- **Click on event** → existing `_showTask(entry_id, task_id)` navigation. Cost shows as right-aligned secondary text using the configured `currency_symbol`.
- **Operator-mode visible** (read-only). Settings tab is still hidden for non-admins.

Implementation:

- New `helpers/calendar-bucket.ts` — pure function `buildCalendarBuckets(objects, today, windowDays, userFilter)` returning a day-by-day event list. No backend changes needed; consumes the existing `_objects` subscription. The projection cap (`MAX_OCCURRENCES_PER_TASK = 5`) keeps a 1-day-interval task in a 30-day window from producing 30 entries.
- New `__tests__/calendar-bucket.test.ts` (12 tests) covering: window slicing, overdue → today bucket, sensor-triggered no-projection, time-based projection cap, user filter, status sort, disabled tasks excluded, ISO date arithmetic stability around month boundaries.
- 6 new i18n keys × 12 languages (`tab_calendar`, `cal_no_events`, `cal_window_7/14/30`, `cal_every_n_days`).
- `panel-styles.ts`: ~85 lines of new CSS (window chips, day pill, status pills, event row, projected style, mobile media query).

ruff ✓ · mypy strict ✓ · 39 frontend tests pass · 1573 backend tests pass · live screenshots verified (desktop + mobile).

## [1.4.11] - 2026-04-30

### Fix — Vacation status used host's timezone instead of HA's

Audit found two `date.today()` calls in vacation logic (`websocket/dashboard.py` and `websocket/vacation.py`) that returned the *host system's* local date. If HA was configured for a different timezone than the host (common in Docker/cloud setups), the vacation-active check and the "clamp end-date when ending vacation early" logic would flip on a different calendar day than the user's dashboard would suggest.

Both now use `dt_util.now().date()` which respects HA's configured timezone via `dt_util.DEFAULT_TIME_ZONE`.

### Internal — ruff ruleset gains `BLE` and `DTZ`

`pyproject.toml` now enables `flake8-blind-except` (BLE) and `flake8-datetimez` (DTZ) so future `except Exception:` and naive-datetime introductions are caught at lint time. The 6 existing intentional defensive catches got `# noqa: BLE001` annotations with one-line justifications. The naive `datetime.max` sentinel in `notification_manager.py` is documented + suppressed (`noqa: DTZ901`) — every code path guards on equality with the sentinel before any arithmetic, so the naive/aware mix never reaches a subtraction. Tests are exempt from DTZ rules (`per-file-ignores`).

ruff ✓ · 92 WS tests pass.

## [1.4.10] - 2026-04-30

### Add — Free-form `notes` field on objects (#46)

Reported in [#46](https://github.com/iluebbe/maintenance_supporter/issues/46) by B Y on GitHub: tasks already had a `notes` field, but objects didn't — so part numbers, replacement procedures, and "spare key in garage drawer" notes had nowhere natural to live. Added the parallel field on objects.

- Model (`models/maintenance_object.py`) gains a `notes: str | None` attribute alongside the existing `documentation_url`.
- Backend wiring: `CONF_OBJECT_NOTES`, sanitize cap (`MAX_TEXT_LENGTH = 2000`), WS create/update schemas + handlers in `websocket/objects.py`, and `_build_object_response` so the value reaches the panel.
- Config flow: optional multiline `TextSelector` in the *create_object*, *reconfigure*, and *object_settings* steps.
- Panel: dedicated "Notes" block under the object detail header — left-bordered card, label uppercase, body uses `white-space: pre-wrap` so newlines and indentation render exactly as typed.
- Object dialog: new `<ha-textarea>` (autogrow, 3 rows) below installation date.
- i18n: 12 languages × 2 keys (`object_notes_label`, `object_notes_optional`) plus 12 × 4 config-flow steps in `translations/*.json` and `strings.json`.

ruff ✓ · mypy strict ✓ · 24 object WS tests pass (added `test_ws_create_and_update_object_with_notes` and `test_build_object_response_exposes_notes`).

## [1.4.9] - 2026-04-27

### Refactor — Currency moved out of *Budget* into *General settings*

Currency was conceptually the wrong place under *Budget* — `currency_symbol` propagates to four call sites that have nothing to do with budgeting (Avg Cost KPI, activity badges, history rows, cost number-input units in the config flow). Users who only wanted per-task cost tracking had to enable *Advanced features → Budget*, open *Budget settings*, set the currency, and leave the budget values at 0 — three layers deep for a global display setting.

- **Maintenance panel** (`settings-view.ts`): currency dropdown moved from the Budget section to the General section. Always visible, no advanced-feature toggle required.
- **Config flow** (`config_flow_options_global.py`): currency dropdown moved from the *Budget settings* step to the *General settings* step. *Budget settings* now contains only the actual budget fields (monthly, yearly, alerts, threshold).

Storage key (`budget_currency`) is unchanged — existing setups roundtrip without migration. The displayed `currency_symbol` is still consumed exactly as before.

ruff ✓ · mypy strict ✓ · 17 currencies still selectable, WS roundtrip verified.

## [1.4.8] - 2026-04-27

### Add — 7 currencies to match the 12 supported translation languages (#45 follow-up)

Triggered by issue #45 (B Y on GitHub asking for currency selection). The feature already existed, but a coverage audit revealed a gap: 5 of the 12 translated languages had **no matching currency** in the dropdown — so a Czech, Polish, Russian, Swedish, or Ukrainian user could pick a localized panel but had to fall back to EUR for budgets.

Added in `const.py::BUDGET_CURRENCIES` and the matching frontend `CURRENCIES` list:

- **CZK** (Kč) — for `cs`
- **PLN** (zł) — for `pl`
- **RUB** (₽) — for `ru`
- **SEK** (kr) — for `sv`
- **NOK** (kr) — Norwegian users often run the `sv` translation
- **DKK** (kr) — Danish users likewise
- **UAH** (₴) — for `uk`

Now 17 currencies are selectable in both the Maintenance panel's **Settings → Currency** dropdown and the HA config flow's **Configure → Budget settings → Currency** step. The chosen `currency_symbol` propagates as before to the `Avg cost` KPI tile, activity badges, history rows, and the `unit_of_measurement` of the cost number-inputs.

Frontend bundle rebuilt; backend untouched outside the dict; ruff ✓ · mypy strict ✓.

## [1.4.7] - 2026-04-26

### Fix — All 5 KPI tiles (Objects/Tasks/Overdue/Due Soon/Triggered) stay on one row

Reported on the HA forum: the dashboard's KPI bar wrapped the 5th item ("Triggered") onto its own row, both on mobile (below ~600px) and on narrower desktop window widths. Looked like a 4+1 broken layout.

Root cause: `.stats-bar` was `display: flex; flex-wrap: wrap` with `min-width: 80px` per item. On narrow viewports the items' natural widths (driven by the longest label, *Triggered*) plus gaps exceeded the container width and the 5th wrapped.

Fix in `frontend-src/styles.ts::stats-bar`:

- Switched to `display: grid; grid-template-columns: repeat(5, 1fr)` — forces equal 1/5 distribution regardless of label length.
- Removed the `min-width: 80px` constraint on `.stat-item`; added `min-width: 0` so flex-shrink works inside the grid cell.
- Added `text-overflow: ellipsis; white-space: nowrap` on `.stat-label` so very narrow viewports gracefully truncate rather than overflow the cell.

Verified at 375 px (mobile) and 1280 px (desktop) — all 5 tiles render in one row at both widths. Updated `docs/images/mobile-overview.png` to reflect the fix.

Frontend bundle rebuilt; backend untouched; 27 component tests pass; ruff ✓ · mypy strict ✓.

## [1.4.6] - 2026-04-26

### Fix — *"Invalid time"* on disabled quiet-hours blocks the Notification Settings save (#44 follow-up)

Reported by **@byoung79** after trying to enable v1.4.0's *Object name as title*: the **Notification Settings** options-flow refused to save with red *"Invalid time specified"* errors on both *Quiet hours start* and *Quiet hours end* — even though the *Enable quiet hours* toggle was OFF.

Root cause: somewhere in earlier history (probably a config-flow round trip when quiet hours was last toggled), the `quiet_hours_start` / `quiet_hours_end` settings got persisted as empty strings. HA's `<TimeSelector>` rejects empty / non-`HH:MM[:SS]` strings as *"Invalid time"*, and that error blocks the entire form save — even when the user is here to change something else and quiet_hours is disabled.

Fixed at two layers (defence in depth):

1. **`config_flow_options_global.py`**: the `default=` for the two TimeSelector fields now goes through a new `_safe_time(value, fallback)` helper that returns the value only when it matches `HH:MM[:SS]`, else the fallback (`22:00` / `08:00`). So even if the persisted value is empty/garbage, the form renders with a valid default and the user can save without touching the time fields.
2. **`websocket/dashboard.py::ws_update_global_settings`**: dropped any incoming `quiet_hours_*` value that doesn't match `HH:MM[:SS]` before persistence. Self-heals existing bad state on next save and prevents future bad values from getting stored. Same regex-validation pattern already used for `notification_title_style` enum.

Test: `test_update_global_settings_drops_invalid_quiet_hours_times` covers the full byoung79 flow — sends each of `("", "  ", "not-a-time", "25:99", "abc:def", None, 42)` plus an unrelated `notification_title_style: "object_name"` edit, asserts the unrelated edit always lands and the bad time falls back to the default.

Backend 1559 ✓ (+1 regression test) · ruff ✓ · mypy strict ✓.

Thanks @byoung79 for the screenshot — made the diagnosis trivial.

## [1.4.5] - 2026-04-26

### UX — Better empty state for the NFC tag picker on the task dialog

The task dialog has had a behaviour-aware NFC field for a while: when HA has registered NFC tags it renders as a dropdown picker; when none are registered it falls back to a plain text field. The fallback case was confusing — a bare *"NFC tag ID (optional)"* textfield with no hint about what to put there or how to register a tag.

Now in the empty state, the textfield is followed by a small help line:

> *No NFC tags registered in Home Assistant yet.* [Open Tags settings](#) · [Refresh](#)

- **"Open Tags settings"** is a link to HA's native `/config/tags` page where the user can register their first tag
- **"Refresh"** re-runs the `maintenance_supporter/tags/list` WS call so the user can pick up newly-registered tags without closing and re-opening the dialog

The dropdown branch (when tags ARE registered) gets the same Refresh button next to it (small `↻` icon) for the same use case — added a tag in HA, want to pick it up live without dialog churn.

3 new i18n keys (`nfc_tags_empty_help`, `nfc_tags_open_settings`, `nfc_tags_refresh`) translated across all 12 panel languages.

No backend changes. Frontend bundle rebuilt; 27 component tests still pass; ruff ✓ · mypy strict ✓.

## [1.4.4] - 2026-04-26

### Fix — Print QR codes opens a clean popup window instead of printing the whole HA UI

Reported by a user: clicking *Print* on the v1.1.0 batch-QR-print page opened the browser's print dialog **inside the same HA window**. The HA top bar, sidebar, and panel chrome all ended up on the printout, and the QR grid often got partially clipped at page boundaries.

Root cause: the previous `_printQrs()` implementation called `window.print()` on the panel itself and relied on `@media print` CSS in the Lit component to hide everything else. But the HA shell (top bar, sidebar, drawer) lives **outside** the Lit component's shadow DOM, so the @media print rules in the shadow root never reach those elements.

Fix in `frontend-src/components/settings-view.ts::_printQrs`: open a fresh `window.open()` popup that contains only:
- A clean `<title>` and `@page` margin definition
- A toolbar with a re-print button (hidden in `@media print`)
- The QR grid as a 3-column `display: grid` layout with `page-break-inside: avoid` on each cell
- Auto-trigger the browser print dialog 250 ms after load so the user sees the print preview immediately

If the popup is blocked, falls back to the previous in-place `window.print()` so the user still gets *something*. Each cell renders the verbatim SVG from the backend plus three label lines (object / task / action). All user-controllable strings are HTML-escaped before injection.

Backend untouched. Frontend bundle rebuilt; existing 27 component tests still green; ruff ✓ · mypy strict ✓.

Thanks for the bug report on the HA forum.

## [1.4.3] - 2026-04-26

### Fix — Object documentation_url was persisted but never displayed (#43 follow-up)

Caught while capturing v1.4.x screenshots: the `documentation_url` field added in v1.4.0 (#43) was correctly stored by `ws_create_object` / `ws_update_object`, but `_build_object_response` (the function that builds the WS subscribe payload the panel consumes) never included it in the returned `object` dict. So the panel render code (which checks `o.documentation_url`) saw `undefined` and the manual link silently never rendered — regardless of what was set in the dialog.

One-line fix in `websocket/__init__.py:_build_object_response`. Plus a regression test (`test_build_object_response_exposes_documentation_url_value`) and a tightening of the structural test (`test_build_object_response_structure`) so this can't drift back.

Also fixed by side-effect: the v1.4.1 task-detail-page parent-manual-link uses the same WS payload, so it was also silently broken.

Backend 1558 ✓ (+1 regression test), frontend 27 ✓, ruff ✓, mypy strict ✓.

## [1.4.2] - 2026-04-26

### i18n — Czech, Swedish, Polish coverage closed across all surfaces

The previous release shipped Czech (cs) and Swedish (sv) panel translations way back (v1.0.41) but the HA config-flow / Repairs UI fell back to English; Polish (pl) had had the config-flow since v1.3.3 but phone notifications were still going out in English. v1.4.2 closes all three gaps in one pass.

**Added:**
- `translations/cs.json` (1094 keys, full parity with `strings.json`) — Czech HA config-flow + Options + Repairs UI + sensor entity attributes + service descriptions
- `translations/sv.json` (1094 keys, full parity with `strings.json`) — Swedish equivalent
- `helpers/notification_manager.py::_NOTIFICATION_STRINGS`: new blocks for `pl`, `cs`, `sv` (17 message keys each — due-soon / overdue / triggered titles + bodies, action button labels, bundled-notification text, budget alert text)

**Coverage matrix is now uniformly green:**

| Sprache | HA config-flow + Repairs | Panel UI | Phone notifications |
|---|:-:|:-:|:-:|
| de, en, es, fr, it, nl, pt, ru, uk | ✓ | ✓ | ✓ |
| pl | ✓ | ✓ | ✓ *(notifications new in 1.4.2)* |
| cs | ✓ *(new in 1.4.2)* | ✓ | ✓ *(new in 1.4.2)* |
| sv | ✓ *(new in 1.4.2)* | ✓ | ✓ *(new in 1.4.2)* |

A read-only audit script (`_i18n_audit.py`, deleted after run) verified key parity across all three layers — no missing or extra keys per language.

No code changes. Backend 1557 ✓, frontend 27 ✓, ruff ✓, mypy strict ✓.

## [1.4.1] - 2026-04-26

### UX — Surface the parent object's manual link on every task page (#43 follow-up)

The per-object `documentation_url` shipped in v1.4.0 (#43) was only visible on the object detail page. When you navigate from "I need to do this maintenance task" to the task page, you'd lose quick access to the device manual — exactly the situation where you want it most.

Now in `_renderTaskMeta` (the task-detail meta card next to notes + task documentation URL): if the parent object has a `documentation_url`, an additional row renders with a book icon and `<documentation label> (<object name>)` — e.g. *Manual (Pool Pump)* / *Handbuch (Poolpumpe)*.

Both link rows render side-by-side when both exist (task-specific docs + object-level manual), distinguished by their icon and label. Same `^https?://` defence-in-depth check the v1.4.0 code uses.

No new i18n keys — reuses `documentation_url_label` from v1.4.0.

Backend untouched (1557 ✓), frontend bundle rebuilt; component test surface unchanged (27 ✓).

## [1.4.0] - 2026-04-26

### New — Per-object documentation URL (#43)

Each maintenance object can now carry a link to its PDF manual / vendor page / setup guide. Shown as a clickable link in the object-detail header next to *Serial number* and *Installed*. Configurable via:

- the new **Manual / documentation URL** field in the panel's *New / Edit Object* dialog (placed right under *Serial number*, as requested)
- the same field in HA's native *Add object* / *Reconfigure* config-flow + the *Object settings* options-flow step

URL safety re-uses the existing `_is_safe_url()` check from the task-side `documentation_url`: only `http://` and `https://` schemes are accepted; `javascript:`, `data:`, and protocol-relative URLs are rejected with `invalid_url`. Sanitiser caps the length at `MAX_URL_LENGTH`.

Translations: the panel reuses the existing `documentation_url_optional` label across 12 languages; the new `documentation_url_label` (short prefix shown in the meta line, e.g. *Manual:* / *Handbuch:*) added across all 12. The HA config-flow translations for the field added across all 10 languages (de, en, es, fr, it, nl, pl, pt, ru, uk).

### New — Notification title style (#44)

Phones stack notifications by title. The previous title was generic per-status text ("Maintenance overdue!"), so a stack of overdue alerts collapsed to one indistinguishable line. New global setting **Notification title style** in *Settings → Notification settings*:

| Value | Title shown |
|---|---|
| `default` | Per-status title (existing behaviour — backwards-compatible) |
| `object_name` | The maintenance object's name (e.g. *Pool Pump*) |
| `task_name` | The task's name (e.g. *Filter cleaning*) |

Bundled notifications (multiple due tasks for one object) honour `object_name`; `task_name` doesn't map cleanly for multi-task bundles so they keep the count-based title.

The default stays `default` so existing installs see no behaviour change. `_global_options` validation (`websocket/dashboard.py`) drops anything outside the enum so a bogus value can't reach the ConfigEntry.

### Tests (+5 backend)

- `test_ws_objects.py::test_ws_create_and_update_object_with_documentation_url` — pins create + update + url-safety rejection + null-clear round-trip for #43
- `test_ws_roundtrip.py::test_every_allowlisted_setting_round_trips` extended to cover `notification_title_style`
- `test_notification_deep.py` adds 4 tests for #44: default style, `object_name` overrides title, `task_name` overrides title, bogus value falls back to default

Backend 1557 ✓ · frontend 27 ✓ · ruff ✓ · mypy strict ✓.

### Migration

None required. Both new fields are optional (`null` default for `documentation_url`, `"default"` for `notification_title_style`).

## [1.3.4] - 2026-04-25

### Fix — Cleared safety interval no longer reverts to 30 (#42)

When a sensor-based task had its optional **safety interval** cleared, opening the edit dialog again silently restored the field to "30". The persisted value was correctly `null`, but the form display lied — and worse, if the user touched any other field and saved, the visible "30" got persisted, overwriting the explicit clear.

**Root cause:** `frontend-src/components/task-dialog.ts:133` had

```ts
this._intervalDays = task.interval_days?.toString() || "30";
```

The `|| "30"` fallback fired on `null`, `undefined`, **and** `0`. Replaced with a strict null check:

```ts
this._intervalDays = task.interval_days != null ? String(task.interval_days) : "";
```

**Tests** (`+4`):
- `__tests__/task-dialog-interval-hydration.test.ts` (NEW, 3 tests) — pins all three branches: `null` → empty, explicit number → string of that number, missing field → empty
- `tests/test_ws_roundtrip.py::test_update_clears_safety_interval_with_none` — backend roundtrip already handled `null` correctly; new test makes regression coverage explicit

Backend 1552 ✓, frontend 27 ✓, ruff ✓, mypy strict ✓.

Thanks to **@cokeman0** for the precise repro on issue #42.

## [1.3.3] - 2026-04-25

### i18n — Polish translation for HA config flow + Repairs UI

`translations/pl.json` added — full coverage of every key already translated in the other 9 config-flow languages (1079 keys, 1:1 structural parity with `en.json`).

What's covered for Polish-language Home Assistant installs from this version on:
- Setup wizard (object creation, template flow, global setup)
- Per-task config (schedule types, all 5 trigger families, compound trigger flows)
- Options flow (general settings, advanced features, panel access, budget, notifications, groups, manage tasks)
- Adaptive scheduling configuration
- Sensor entity attribute names + state translations (overdue/due_soon/triggered/ok, Weibull failure pattern labels, etc.)
- Service descriptions (`complete`, `reset`, `skip`, `export_data`)
- Repair flow translations (missing trigger entity, orphan panel-access user, stale on-complete-action entity)
- Exception messages

The panel UI was already Polish since v1.0.41 (via `frontend-src/styles.ts`). What was previously falling back to English: HA's native config-flow dialog, the Options page under Devices & Services, and the Repairs page. All three now show in Polish.

Czech and Swedish remain English-fallback in those surfaces — translations welcome via PR.

No code changes. Backend tests 1551 ✓, frontend tests 24 ✓, ruff ✓, mypy strict ✓.

## [1.3.2] - 2026-04-25

### Refactor — DRY hotspots in coordinator + repairs + tests

Internal cleanup pass after the v1.3.0/1.3.1 feature work — no user-facing behaviour change, but the code that handles task completions, repair flows, and test boilerplate is now meaningfully shorter and harder to drift.

**Production code:**
- `coordinator.py`: extracted `_persist_and_signal_task_change(task_id, task)` — collapses three near-identical 17-line blocks (`complete_maintenance` / `reset_maintenance` / `skip_maintenance`) into one shared helper. Net `-30 LOC` and one less place where the Store-vs-ConfigEntry split, recently-completed marker, dispatcher signal and refresh request can fall out of sync.
- `coordinator.py`: extracted `_lifecycle_event_payload(task, task_id, **extra)` — guarantees that every `EVENT_TASK_COMPLETED/SKIPPED/RESET` payload carries the four envelope keys (`entry_id`, `task_id`, `task_name`, `object_name`). Listeners can now rely on them being present; variant-specific fields (`notes`, `cost`, `reason`, `reset_date`, …) ride on top.
- `repairs.py`: introduced `_entry_for_issue(hass, issue_data)` and `_entry_has_task(entry, task_id)` free helpers. The five inline copies of "look up the entry referenced by the issue and abort if it / its task has been deleted" across `MissingTriggerEntityRepairFlow` (2×), `OrphanAdminPanelUserRepairFlow` (1×) and `StaleActionEntityRepairFlow` (`_entry()` method, now a thin wrapper) all funnel through them.

**Test boilerplate:**
- `tests/conftest.py`: added `make_ws_connection()`, `assert_ws_success(conn) -> dict`, `assert_ws_error(conn, code?)` — replaces the per-file `_conn()` and result-payload-extraction snippets that were copy-pasted across `test_ws_roundtrip.py` / `test_completion_actions.py` (and ~19 other files for the assertion pattern).
- `frontend-src/__tests__/_test-utils.ts` (NEW): exports `DEFAULT_FEATURES`, `DEFAULT_SETTINGS_RESPONSE`, `createMockHass(opts)`. Replaces ~175 lines of duplicated `mockHass()` + settings-shape boilerplate that was inline in three test files (`settings-view-vacation`, `settings-view-print-qr`, `task-dialog-completion-actions`).

**Net effect:** ~250 LOC reduction, identical test counts (1551 backend + 24 frontend), ruff ✓ · mypy strict ✓.

## [1.3.1] - 2026-04-25

### UX — Service-Picker + schema-driven data form for `on_complete_action`

Quick follow-up to v1.3.0 in response to early feedback on the action UI: the service field is now an autocomplete dropdown over every HA service registered on your instance — no more typing `domain.name` from memory or copy-pasting from YAML.

**Changes in the task-dialog `On-Complete Action` section:**
- Service field: `<ha-textfield>` → `<ha-service-picker>` (HA's native autocomplete over the full service registry, with fuzzy matching by domain/service/description)
- Data field: when the picked service has `fields:` metadata in `hass.services`, those fields render as an `<ha-form>` (proper widgets per type: number sliders, color pickers, entity selectors, booleans, etc.) — no more JSON-typing for common services like `light.turn_on`, `notify.mobile_app_*`, `script.*`
- Fallback: services with no `fields:` metadata (e.g. `button.press`, custom integrations without service.yaml) still expose a JSON textfield for free-form data
- Auto-pruning: switching the service drops data keys the new service doesn't accept (so a stale `brightness` from `light.turn_on` doesn't leak into a fresh `notify.mobile_app_phone`)

**No backend changes**, no schema migration. Existing `on_complete_action.data` dicts hydrate transparently into the new form.

### Tests

Frontend component suite: 24 tests pass (was 22). Two new tests cover the schema-driven branch:
- `renders ha-form when the picked service has a schema`
- `falls back to JSON textfield when the service has no schema`

Backend: 1551 tests still pass; ruff ✓ · mypy strict ✓.

## [1.3.0] - 2026-04-25

### New — Run a Home Assistant action when a task is completed (#41)

Tasks can now fire an HA service-call when they are completed: turn on a "filter changed" indicator light, push a custom notification, increment a counter, fire any HA service. Three layers ship together so other automations can join in too:

**Layer A — completion events on the bus**
The coordinator now fires three integration-scoped events on every completion path: `maintenance_supporter_task_completed`, `_task_skipped`, `_task_reset`. Payload includes `entry_id`, `task_id`, `task_name`, `object_name`, plus the contextual fields that path supplied (`notes`, `cost`, `duration`, `feedback` for completed; `reason` for skipped; `date` for reset). User-written automations can subscribe via the `event` trigger on these names — same names whether the completion came from the panel button, a complete-QR scan, the new quick-complete QR scan, or the mobile-app action.

**Layer B — per-task `on_complete_action` (gated)**
A new field on each task carries an HA service-call config: `{service: "domain.name", target?: {...}, data?: {...}}`. A dedicated event listener (`helpers/action_listener.py`) subscribes to `EVENT_TASK_COMPLETED` and dispatches the configured call. Service-call failures are logged and swallowed — a broken action must never block a completion from being recorded.

The architecture is deliberately one-event-many-listeners: Layer A is the single source of truth, Layer B is just one of N possible subscribers. No code is duplicated between Layer B and a hypothetical user automation.

**Layer C — quick-complete QR (gated)**
A new task field, `quick_complete_defaults`, holds pre-filled `notes / cost / duration / feedback` values. New WS endpoint `maintenance_supporter/task/quick_complete` runs `complete_maintenance(...)` with those values — no dialog, no input. New `quick_complete` QR action (lightning-bolt center icon to tell it apart from the regular complete check-mark) deeplinks the panel to fire it. Tasks without `quick_complete_defaults` fall back to the normal complete dialog automatically (`no_defaults` error path).

**Repair-flow for stale `on_complete_action.target.entity_id` refs**
`StaleActionEntityRepairFlow` (in `repairs.py`) is created whenever the coordinator scan finds an action targeting an entity that no longer exists in HA. Two options offered: replace with a new entity (HA's `EntitySelector`) or remove the action entirely. Mirrors the existing `MissingTriggerEntityRepairFlow` lifecycle.

### UI

`<maintenance-task-dialog>` gets two new collapsible sections (gated behind the new feature flag). The action section has a `Test` button that fires the configured service immediately so the user can verify it before saving. The quick-complete section has the same field set as the complete dialog (notes/cost/duration/feedback) so what gets recorded is fully under user control.

`<settings-view>` adds a feature toggle `Completion actions` (description string `feat_completion_actions_desc`). Default OFF — the field is purely additive and beginners shouldn't be confronted with service-call YAML on first run.

### Sanitization

`helpers/sanitize.py` gets `cap_action_field()` and `cap_quick_complete_defaults_field()`. Service spec is regex-pinned to `[a-z][a-z0-9_]*\.[a-z0-9_]+`, target string fields capped at 200 chars, target lists capped at 50 entries, action data capped at 1 KB JSON-serialised, quick-complete numeric ranges enforced. Anything malformed is dropped silently per-field — never blocks a save.

### Tests

`tests/test_ws_roundtrip.py` gains 10 new round-trip tests in module M (every-field round-trip, sanitize-rejects-bogus, update-preserves-when-omitted, update-clears-with-None, quick-complete happy path, no-defaults error path, every event fires with the right payload). `tests/test_completion_actions.py` (new, 9 tests) exercises the live event listener — service is dispatched, errors are swallowed, unknown services don't break, unknown entry-ids are no-op, and the three repair-flow paths (init/replace/remove) plus the `async_create_fix_flow` dispatch.

`__tests__/task-dialog-completion-actions.test.ts` (new, 5 tests) pins the UI: gating, hydration on `openEdit`, Test-button dispatch, button-disabled-when-empty.

**Backend:** 1,551 unit tests pass (was 1,544); ruff ✓ · mypy strict ✓.
**Frontend:** 22 component tests pass (was 17).

### Migration

None required. Existing tasks without `on_complete_action` / `quick_complete_defaults` continue to work unchanged. The new feature flag (`advanced_completion_actions_visible`) defaults to `False` so existing dashboards see no UI change until the user opts in.

## [1.0.52] - 2026-04-22

### Tests — WebSocket roundtrip suite extended

9 additional tests in `tests/test_ws_roundtrip.py` cover the WS surfaces that v1.0.50 did not reach. No production code changes.

**Module A — `ws_update_task` roundtrips (4 tests):**
Update is a separate handler from create but shares `_validate_trigger_config`; an allowlist drift (class of bug in #37) could regress through update without failing any create-path test. Covered: swap trigger type (state_change → threshold) with new fields preserved + old fields dropped, `warning_days` update persists, partial update preserves unrelated fields, `None` clears an optional field.

**Module C — global settings roundtrip (1 test):**
Direct analogue to #37 for the settings surface. Sends every allowlisted `CONF_*` key via `ws_update_global_settings` with a representative value, reads back via `ws_get_settings`, and asserts each round-trips. Guard at the top of the test: if `_ALLOWED_SETTING_KEYS` grows, the coverage sample must grow with it (the test fails if a new allowlisted key has no sample).

**Module H — max-payload task (1 test):**
One task created with every optional field set at once (checklist, schedule_time, nfc, responsible_user, documentation_url, custom_icon, interval_anchor=planned, entity_slug, notes, last_performed, enabled). Single-field tests catch their own key being stripped; an interaction bug — "field X clobbers field Y on save" — only shows up when many fields collide in one payload.

**Module J — completion lifecycle (3 tests):**
`ws_complete_task`: writes `last_performed` + appends a `type: "completed"` history entry with notes/cost/duration. `ws_skip_task`: appends `type: "skipped"` with the reason stored as `notes` (documented that skip does stamp `last_performed` — by design, to advance the cycle). `ws_reset_task`: stamps `last_performed` at the supplied date (matches issue #31 semantics clarification), existing history survives.

### Incidental wins from writing the tests

- Pinned the concrete history-entry shape (`type` field, `duration` not `duration_minutes`, skip's reason stored as `notes`) against future coordinator refactors.
- Pinned `notify_service` normalisation on save (`persistent_notification` → `notify.persistent_notification` via `validate_notify_service`).

1,529 unit tests pass (was 1,520); ruff ✓ · mypy strict ✓ (53 source files).

## [1.2.2] - 2026-04-25

### Tests — Component test suite expanded

10 new Lit-component tests across two files, exercising UI areas the WS roundtrip suite doesn't reach:

**`__tests__/settings-view-print-qr.test.ts` (6 tests)** — pins the v1.1.0 batch-QR-print Settings section:
- Renders the section with a `Load objects` button by default.
- Click `Load objects` → calls `maintenance_supporter/objects` → renders the filter panel with one row per object.
- Toggling an action chip flips the `active` CSS class on the wrapper.
- `Generate` button disables when zero actions are selected.
- Click `Generate` → calls `maintenance_supporter/qr/batch_generate` → renders one `.qr-print-cell` per result with the right object/task/action labels.
- Filter that would produce >200 QRs marks the estimate with the `error` class and disables `Generate`.

**`__tests__/group-dialog-sort.test.ts` (4 tests)** — pins the v1.0.53 alphabetical sort fix (#40):
- Object section headers render `A→Z` regardless of the order they arrived in the `.objects` array.
- Tasks within each object render `A→Z`.
- Toggling a checkbox stores the composite `entry_id:task_id` key (verified via the rendered selected-count).
- Checked state survives a property re-render (objects array re-assigned).

**Suite runs in 3.4 s, 17 tests total** (7 from v1.2.1 + 10 new).

### Known gap

A `task-dialog-object-picker.test.ts` was attempted for the v1.0.53 picker sort but the dialog hangs the test runner — likely because it renders nested `ha-*` HA components that don't initialise cleanly outside the HA shell. Documented as TODO; the picker-sort behaviour is still covered by the WS roundtrip + manual browser verification.

### Backend regression

1,544 unit tests pass; ruff ✓ · mypy strict ✓ across 55 source files.

No production code changed.

## [1.2.1] - 2026-04-25

### Tests — Lit component test infrastructure

Adds **@web/test-runner** + **@open-wc/testing** + **@web/dev-server-esbuild** as dev dependencies. Mounts individual Lit components in real Chromium with mocked `hass` — no HA shell, no shadow-DOM-deep-piercing-races. Each test runs in ~10–50 ms; the whole suite finishes in under 2 seconds.

This fills the testing gap that earlier sessions kept hitting: WS contract has been covered by `tests/test_ws_roundtrip.py` since v1.0.50, but UI render logic / click handlers / state transitions had no test layer (Playwright-against-the-full-HA-shell repeatedly hung on shadow-DOM piercing). Component tests give us behaviour-level coverage where Playwright was unreliable.

**New files:**
- `frontend-src/web-test-runner.config.mjs` — esbuild plugin for on-the-fly TS, playwright-launcher for chromium
- `frontend-src/__tests__/settings-view-vacation.test.ts` — 7 tests covering the v1.2.0 vacation section: section renders, hydrates dates from settings response, active badge shows when `is_active=true`, enable toggle dispatches `vacation/update`, buffer change dispatches `vacation/update` with `buffer_days`, `settings-changed` event emitted on toggle, end-now button hidden when not active

**npm scripts:**
- `npm test` — one-shot suite
- `npm run test:watch` — watch mode for dev iteration

The Playwright `_smoketest-vacation.mjs` pattern (drive WS endpoints via `page.evaluate`) remains the right tool for end-to-end backend smoke tests. The new component layer covers the bit Playwright struggled with.

**Backend regression check:** 1,544 unit tests still pass; ruff ✓ · mypy strict ✓.

No production code changed.

## [1.2.0] - 2026-04-24

### Added — Vacation mode

A new **"Vacation mode"** section in Settings lets users plan a vacation, suppress non-critical maintenance notifications during the period plus a buffer, and review which tasks will be affected — with one-click actions to handle them before leaving.

**Workflow:**

1. **Plan** — toggle on, pick start + end dates, set buffer days (default 3, range 0–14). Buffer covers the "I just got back, please don't fire alerts on my arrival day" decompression window.
2. **Exempt critical tasks** — pick from the full task list (alphabetical by object → task) which tasks should still notify during the vacation. Persistent across vacations: re-used the next time you enable the mode. Use case: pool chemistry that the neighbour checks regardless.
3. **Preview impact** — projects which tasks will hit `DUE_SOON`, `OVERDUE`, or (for sensor-triggered tasks) become possible-to-fire during `[start, end + buffer]`. Per-row actions:
   - **Complete** — stamps `last_performed = today` (uses the existing complete endpoint), task moves out of the vacation window naturally.
   - **Skip** — skips the cycle (time-based only).
   - **Notify anyway** — adds the task to the exempt list inline, no need to scroll back up.
   Preview re-fetches automatically after each action.
4. **End vacation now** — disables the mode immediately and clamps `end` to today (so the historical record reflects when you actually returned). Date config is preserved for next time.

**Notification suppression:**

- Hooks into `notification_manager` after the existing quiet-hours check. Single-line addition; everything that already worked still does.
- Sensor-triggered notifications (threshold/counter/state-change/runtime/compound) follow the same path → automatically covered. Pool-alert-at-the-beach is prevented.
- Suppression is *active* iff `enabled && start ≤ today ≤ end + buffer && task not in exempt list`.
- When the window ends, `is_active` returns `False` automatically — no scheduled-task wiring needed. UI shows an "ended" badge prompting the user to disable.

**Backend:**
- New `helpers/vacation.py` with `VacationState` dataclass + `get_vacation_state(hass)` + `compute_preview(state, tasks)`. Frozen dataclass so the suppression check can't race with config updates mid-decision.
- 4 new WS endpoints: `vacation/state`, `vacation/update` (admin-only, partial patches), `vacation/preview`, `vacation/end_now` (admin-only).
- Schema validation: dates as `YYYY-MM-DD`, buffer 0..14, exempt list capped at 2000 IDs with whitespace-strip + dedup.
- `_build_full_settings` includes a `vacation` block so the panel can show the active badge / Vacation tab without an extra WS round-trip.

**Frontend:**
- Settings section with toggle, date pickers, buffer input, exempt-task list (loaded on demand), preview button, per-row action buttons, end-now button, status badges (active / ended).
- 22 new i18n keys × 12 languages (264 strings). Audit: 392 keys in sync.
- Reuses existing `qr_action_complete` / `qr_action_skip` translations for the per-row Complete / Skip buttons rather than introducing duplicates.

**Tests:**
- 9 new roundtrip tests in `test_ws_roundtrip.py`: state default, full update + read-back, end-vs-start rejection, partial update preserves fields, is_active flips inside the window, end_now clamps, preview lists time-based tasks correctly, exempt task marked `will_suppress=False`, sensor-based tasks always appear with `unpredictable` confidence.

**1,544 unit tests pass** (was 1,535); ruff ✓ · mypy strict ✓ across 55 source files.

**Out of scope** for this release (deferred):
- Multiple scheduled vacations
- Historical log
- HA-Calendar integration of vacation periods

## [1.1.1] - 2026-04-24

### Tests — WS roundtrip coverage for qr/batch_generate

6 new tests in `tests/test_ws_roundtrip.py` pin the v1.1.0 batch-QR endpoint against the class of regressions the rest of the suite already covers: silent field drops, filter combinations, limit enforcement, and edge cases.

**Coverage:**
- **Default filter** — empty `entry_ids` + single action = one QR per task in the entry. Verifies every row carries a valid SVG body and the expected `(entry_id, task_id, object_name, task_name, action)` fields.
- **Entry filter narrows** — two objects set up, filter names one → only that object's tasks appear.
- **Task filter narrows** — specific `task_ids` list returns exactly those tasks.
- **Multiple actions multiply rows** — 2 tasks × 3 actions = 6 distinct `(task_id, action)` combinations. Also pins the no-icon code path for the `skip` action by asserting the embedded-logo `<circle>` elements are absent from skip SVGs.
- **Over-limit errors** — batches producing more than `_MAX_BATCH_QRS` (200) rows are rejected with `too_many`; error message cites both the actual count and the cap.
- **Empty result** — object entry with zero tasks returns `{qrs: [], total: 0}` cleanly rather than erroring.

**1,535 unit tests pass** (was 1,529); ruff ✓ · mypy strict ✓ (53 source files).

No production code changed.

## [1.1.0] - 2026-04-24

### Added — Print QR codes for physical equipment

New **"Print QR codes"** section in Settings. Generates a printable page of multiple QR codes at once — one per (task × action) — that users can cut out and stick on their equipment (filter kit in the basement, pool pump room, 3D printer in the office). Scanning a code jumps to the task in the panel, or marks it complete / skipped, depending on the action.

**Features:**
- **Object filter** — pick any subset of objects to generate for (or leave empty = all). Objects listed alphabetically.
- **Action multi-select** — chip row for `View` / `Complete` / `Skip`. Default: `View` only.
- **Link-type chooser** — Companion App deep-link (default, most persistent), Local mDNS, or Server URL. Same three modes as the existing per-task QR dialog.
- **Live estimate** — shows the projected QR count before generating, with a hard cap at 200 per batch to keep payloads sane (~6 MB at the cap). Narrow the filter if you hit the limit.
- **Print layout** — CSS grid with a dedicated `@media print` stylesheet: 3-column A4 layout, ~48mm QR size, page-break-inside protection so a QR never splits across pages. The rest of the panel UI is hidden during print via `display: none`.
- **Browser-native print** — click `Print` to open the standard print dialog. Works with any physical printer or Save-as-PDF.

**Performance:**
- Benchmark: 60 QRs in ~2.5s (typical 20-30-task household × 2 actions), 200 QRs in ~7s.
- Server-side LRU cache keyed on `(url, icon)` — re-running the batch after a filter change is near-instant for the overlap.
- SVG-based output (~32 KB per QR) renders crisply at any print resolution and composes cleanly with the `@media print` stylesheet.

**Backend:** new WS endpoint `maintenance_supporter/qr/batch_generate` with schema validation (max 200 QRs per batch, url_mode in {`server`, `local`, `companion`}, actions in {`view`, `complete`, `skip`}).

17 new i18n keys × 12 languages (204 strings). Audit: 370 keys in sync.

Ruff ✓ · mypy strict ✓ (53 source files) · 1,529 unit tests pass (unchanged — no regressions; the new endpoint is covered by the existing QR dialog's tests for URL building + icon embed, plus manual smoke testing in docker).

## [1.0.53] - 2026-04-24

### Fixed — Task/object pickers now sort alphabetically ([#40](https://github.com/iluebbe/maintenance_supporter/issues/40))

Two dropdowns previously rendered their entries in the integration's internal creation order, forcing the user to scan a shuffled list to find a target:

- **Group dialog — task selection list**: objects (top-level section headers) and the tasks within each object are now sorted `A → Z` by `localeCompare`. Previously the order reflected config-entry creation, which on a large household (Philippe's 50-task setup) quickly stopped being navigable.
- **Task-create dialog — object picker dropdown**: the dropdown shown when clicking `+ New Maintenance Task` from the Tasks view (added in v1.0.44) now lists objects `A → Z`. The default selection is the first object after sort, so a save without explicit user action still works.

Pure frontend sort — no WS round-trip change, no i18n impact. Stable under locale (uses `localeCompare`, so German umlauts and accented characters sort sensibly per the user's browser locale).

## [1.0.51] - 2026-04-22

### Polish bundle — closes user-reported UX papercuts

Three small issues reported by [@wxym5nnh6h-prog](https://github.com/wxym5nnh6h-prog) after the v1.0.44/v1.0.49 shipments, bundled into one release since all three are frontend-only cosmetic fixes.

- **#34 — "New Maintenance Task" button shape now matches "New Object"**: the task-create button carried `appearance="plain"` while the object-create button did not, making them read as two visually different controls. Dropped the `plain` appearance so both buttons share the default filled shape.

- **#36 — Sort / Filter / Group-by dropdowns now have labels**: on both the Tasks view (4 dropdowns: Filter, User, Sort, Group by) and the Objects view (2 dropdowns: Sort, Group by), each select now carries a small uppercase label above it. Scales on mobile via `.filter-field` flex wrapping.

- **#36 — Sub-line chips (group / area / user) are now proper pills**: previously rendered as bare icon+text with only 2px internal gap and 8px inter-chip gap, which made them "stick together" per the reporter. Now: 8px horizontal padding, 10px border-radius, light `--secondary-background-color` fill, 4px internal icon-text gap. Each chip reads as its own unit at a glance.

- **#37 — Help text added under state_change trigger fields**: The "Changements cibles" (Target changes) field was opaque — the reporter wrote "I don't understand what you exactly mean by those". Added two helper strings, one explaining the count semantic (default 1) and one under the from-state explaining the HA-state-value convention + that case is normalised on save. 6 new i18n keys × 12 languages (72 strings): `filter_label`, `user_label`, `sort_label`, `group_by_label`, `state_value_help`, `target_changes_help`.

### No production-logic changes

Audit: 355 keys × 12 languages in sync. Ruff ✓ · mypy strict ✓ (53 source files) · 1,520 unit tests pass (unchanged from v1.0.50).

## [1.0.50] - 2026-04-22

### Tests — WebSocket save→read-back roundtrip suite

The bugs in #37 and #38 were both "field silently dropped between save and read" — a class that the existing test layers didn't directly cover (unit tests mock most of the WS layer; the Playwright E2E suites click through the panel UI but don't assert what gets persisted). The new `tests/test_ws_roundtrip.py` (8 tests) plugs that gap by exercising the real WS handlers against an actual `MockConfigEntry` and reading the persisted task back out of `entry.data`.

Each test follows the same shape:

1. Set up the integration (global entry + per-object entry).
2. Call `ws_create_task` via the unwrapped WS handler with a maximal payload covering every optional field for the variant under test.
3. Read the persisted task from `entry.data[CONF_TASKS][task_id]`.
4. Assert what was sent equals what was persisted (modulo documented transformations like state_change lowercasing).

Variants covered:

- **state_change**: `trigger_from_state` / `trigger_to_state` (with uppercase → lowercase normalisation pinned) + `trigger_target_changes`
- **threshold**: `trigger_for_minutes` hold-time
- **counter**: `trigger_delta_mode`
- **attribute** (used by base_trigger across all types)
- **runtime**: `trigger_on_states` list
- **compound**: recursive validation preserves inner-condition fields (one threshold + one state_change condition)
- **default_warning_days flow-through** (#38 regression): explicit value persists; documented schema-default behaviour pinned

These complement the existing static guard in `tests/test_trigger_allowlist.py` (which scans trigger source for `trigger_config.get('…')` calls and asserts each key is in the allowlist). Together they form a defence-in-depth: the static guard fails fast at the syntactic layer if a new key is read but not whitelisted; the roundtrip suite catches semantic regressions like normalisation drift, recursive validator changes, or new endpoints that bypass `_validate_trigger_config`.

**1,520 unit tests pass** (was 1,512); ruff ✓ · mypy strict ✓ across 53 source files.

No production code changed.

## [1.0.49] - 2026-04-22

### Fixed — Trigger save-path silently dropped 5 fields ([#37](https://github.com/iluebbe/maintenance_supporter/issues/37))

`websocket/tasks.py:_TRIGGER_ALLOWED_KEYS` is the WS validator's allowlist for `trigger_config` keys — anything not in the set is deleted from the payload before persistence. The set drifted out of sync with the trigger classes: 5 keys actively read by the trigger code were missing from the allowlist and got silently stripped on every save. The dead `trigger_reset_on_complete` is removed in the same pass.

| Missing key | Read by | Symptom when stripped |
|---|---|---|
| `trigger_from_state` | `state_change.py:38` | Filter ignored → every transition counted (the user-reported #37 case) |
| `trigger_to_state` | `state_change.py:39` | Same |
| `trigger_for_minutes` | `threshold.py:41`, `coordinator.py:397` | Threshold trigger fires immediately instead of after the configured hold time |
| `trigger_delta_mode` | `counter.py:36`, `coordinator.py:453` | Counter trigger silently falls back from delta to absolute mode |
| `attribute` | `base_trigger.py:44`, `coordinator.py:393`, `helpers/sensor_predictor.py:133` | Trigger evaluates the entity state instead of the configured attribute |

The allowlist is recursively applied to compound-trigger sub-conditions too, so the same 5 fields used to vanish inside any compound condition. Same fix covers both surfaces.

### Fixed — `state_change` trigger compared case-sensitively against lowercase HA states

`HA's state machine stores values lowercase ("on" / "off" / "home" / ...). The state_change trigger compared `effective_old != self._from_state` exactly, so a user typing `OFF` / `ON` (the natural casing of "off" / "on" as nouns in many languages, including French) silently never matched even after the allowlist fix above. Symmetric to how `runtime` already handles `trigger_on_states` (auto-lowercased on save in `config_flow_trigger.py` and via `state_value.lower()` at evaluation time), the WS save path and the config-flow save path now both `.strip().lower()` `trigger_from_state` / `trigger_to_state` before persistence. Whitespace-only values are dropped (= "no filter").

### Fixed — JSON / CSV import hardcoded `warning_days = 7` instead of honouring the global default ([#38](https://github.com/iluebbe/maintenance_supporter/issues/38) follow-up)

v1.0.48 fixed the panel + config-flow paths to honour `Settings → General → "Default warning days"` for new tasks. Three import sites still defaulted to the bare constant `7`:

- `websocket/io.py:279` — JSON import: missing `warning_days` field now falls back to `get_default_warning_days(hass)`.
- `websocket/io.py:304-306` — JSON import sanitisation: out-of-range values likewise.
- `helpers/csv_handler.py:173` — CSV import: missing/invalid column likewise. Function signature gained an optional `hass=None` kwarg so unit tests that exercise the parser in isolation keep working.

### Tests

New `tests/test_trigger_allowlist.py` (11 checks):

- **Static**: scans every `trigger_config.get("…")` call site in `entity/triggers/*.py` and asserts the key is in `_TRIGGER_ALLOWED_KEYS` (or in an explicit `_RUNTIME_INJECTED_KEYS` exclusion list for per-entity runtime state). The next missing key is caught at test time, not by a user.
- **Functional**: pins the 5 critical keys in the allowlist, verifies state_change `OFF`/` ON ` round-trip becomes `off`/`on` (with whitespace dropped), and pins `trigger_for_minutes` (threshold) + `trigger_delta_mode` (counter) preservation.

1,512 unit tests pass (was 1,501); ruff + mypy strict clean across 53 source files.

## [1.0.48] - 2026-04-22

### Fixed — General Settings "Default warning days" actually flows through to new tasks ([#38](https://github.com/iluebbe/maintenance_supporter/issues/38))

When a user changed Settings → General → "Default warning days" from 7 to e.g. 1, every newly created task still defaulted to 7. The setting was stored, surfaced via WS `/settings`, and the panel's settings UI displayed the saved value — but the task-create dialog initialised `_warningDays = "7"` as a hardcoded literal and the integration's options-flow form schemas defaulted to the constant `DEFAULT_WARNING_DAYS = 7` rather than the per-entry option.

Fixed at every task-create entry point:

- **Panel task-dialog** (`task-dialog.ts`): added `defaultWarningDays` property; `_resetFields()` (called from `openCreate`) now seeds `_warningDays` from it. `openEdit` is unaffected — it keeps loading the existing task's stored value.
- **Panel main view** (`maintenance-panel.ts`): the `/settings` response handler now extracts `general.default_warning_days` (with `[0..365]` validation) and passes it to `<maintenance-task-dialog>`.
- **Config Flow + Options Flow** (`config_flow.py`, `config_flow_options_task.py`, `config_flow_trigger.py`): all 18 task-create fallback sites now resolve the default via a new `get_default_warning_days(hass)` helper that reads the global config entry's options. The 2 sites that *set* the global default itself (initial setup form) continue to use the constant — they're seeding, not consuming.

New helper module `helpers/global_options.py` centralises the cross-entry lookup with sane bounds-checking (rejects non-int and out-of-[0,365] values, falls back to the constant). Existing notification_manager has its own equivalent — left untouched to avoid touching unrelated code.

Ruff ✓ · mypy ✓ (53 source files) · 12-language i18n unchanged (no new strings).

## [1.0.47] - 2026-04-22

### Fixed — Deep bug audit patch release

Seven bugs surfaced by a critical code audit, all shipped together:

1. **Repair "Dismiss" no longer silently reappears** — `repairs.py` previously exposed a `dismiss` menu option that closed the issue via HA's built-in delete but couldn't prevent the next `async_update_entry` from recreating it. The menu is removed; the repair flow now uses a single confirmation form that delegates to the `remove_user_id` step on submit. Users who want to keep the orphan entry can use HA's native **Ignore** button (which persists). 10 translation files updated.
2. **Card editor entity-picker shows all HA sensors** — `<ha-entities-picker>` received `include-domains` as an HTML attribute, which Lit did not reliably JSON-parse. Switched to property syntax (`.includeDomains=${[...]}`) and added `.includeEntities=${ourEntities}` built from the live `sensor_entity_id` / `binary_sensor_entity_id` per task, so the picker only lists maintenance_supporter entities.
3. **Card editor couldn't tell "no objects yet" from "WS failed"** — added `@state() _loadError` set by `_loadObjects()` catch. The picker list now renders a 4-arm ternary (loading → error → empty → list) with a localized red error message (`card_load_error`) if the WS call threw.
4. **Card empty state was a bare "no tasks" string** — replaced with a title + localized link CTA pointing to `/maintenance-supporter`, so a first-time user lands on the panel instead of staring at an empty card.
5. **WS dashboard accepted whitespace-only IDs** — `websocket/dashboard.py` sanitization loop now `.strip()`s every entry and skips empties, still enforces the 64-char + 50-entry caps and de-dupes via `seen`.
6. **`__init__.py` issue-registry cleanup iterated the whole registry** — stale orphan-issue IDs are now filtered by `dom == DOMAIN` before checking the prefix, preventing accidental matches against other integrations' issue IDs that happen to share the prefix.
7. **Mobile long object names overflowed the grid** — `panel-styles.ts` now line-clamps `.cell.object-name` to 2 lines with ellipsis via `-webkit-line-clamp: 2` on both `:host([narrow])` and the `@media (max-width: 600px)` fallback.

3 new i18n keys × 12 languages (`card_load_error`, `card_no_tasks_title`, `card_no_tasks_cta`) — audit: 349 keys in sync across all languages.

## [1.0.46] - 2026-04-22

### Fixed — Mobile due-cell + actions still drifted across rows

The 1.0.45 attempt anchored the due-cell with `margin-left: auto` but kept the row on flex-wrap. That left the due-cell's X-position content-dependent (sparkline rows wrapped differently from text-only rows), so e.g. `dueRight` ranged from 273-355px across visible rows on a 375-wide viewport.

Switched the mobile `.task-row` from flex-wrap to a 4-column CSS grid (`auto | 1fr | 100px | auto`), explicit grid-row placement for every cell:
- task-name spans the full top row
- badges + object-name + due-cell + actions form the middle row at deterministic columns
- chips sub-line spans the full bottom row

Verified across 8 representative rows: all `dueRight=303`, all `actionsRight=355` — zero drift. Same fallback applied in the `@media (max-width: 600px)` block for narrow desktop windows that don't get the `narrow` host attribute.

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
