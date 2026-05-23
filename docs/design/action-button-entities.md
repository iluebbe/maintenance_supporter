# Design: Action button entities (ChoreOps parity, dashboard actions)

> **Status:** Implemented — docker-tested, **not released** (awaiting review). Follow-up to the native summary sensors (#49); explicitly flagged "out of scope, own PR" in `native-summary-sensors.md`. Decision taken: all three per-task buttons (incl. `reset`) are **enabled by default**; the global export button was removed (see B — a button can't trigger a download).
> Tracking discussion: [#49 "UI ideas — panel and Lovelace card"](https://github.com/iluebbe/maintenance_supporter/discussions/49)

## Problem / user signal

Users want to **act** on maintenance tasks from their *own* dashboards (chips, tiles, bubble-card pop-ups) — not only inside the panel. Today the only native surfaces are read-only sensors. Actions (complete / skip / reset) are reachable via the panel, the Lovelace card, `maintenance_supporter.*` services, and mobile-notification buttons — but **not as entities you can drop on a dashboard**.

- **#49 — @Neflhiem** (migrating from ChoreOps): rebuilt his ChoreOps dashboard as a bubble-card pop-up and wants the same on his primary dashboard. ChoreOps' pop-up has **action buttons per chore**; without button entities he can't fully reproduce it.
- **#49 — maintainer**: "Coming from ChoreOps you're used to rich native entities (count sensors, **action buttons**) — fair gap … action buttons are a separate future item." Summary sensors closed the *sensor* half; this closes the *action* half.
- **#49 — @byoung79 / @thecrack243**: mobile-first, dashboard-driven workflows; want to do things from chips/tiles without opening the panel.

Goal: **give users more dashboard options** — native `button.*` entities they can place anywhere, so a tap completes/skips/resets a task exactly like the panel does.

## Goals & non-goals

**Goals**
- Per-task **action buttons** (complete / skip / reset) as `button.*` entities on each object's device.
- A small set of **global buttons** on the hub device for whole-integration actions (export).
- Strict **DRY**: buttons must call the *same* action layer as services + notifications — no duplicated business logic.
- Sensible default entity footprint (don't dump 177 enabled entities on every user).
- Full i18n (12 languages), tests, docs.

**Non-goals (this iteration)**
- "Add task/object" as a button entity — a button can't collect input (name, interval, …). Adding stays a dialog; see **Workstream C** for the dashboard-add path.
- Per-condition / per-trigger buttons, bulk "complete all overdue" (destructive), snooze-as-button.

## The DRY action layer (single source)

All task mutations already funnel through three coordinator methods — verified call sites:

| Action | Method | Already wrapped by |
|---|---|---|
| Complete | `coordinator.complete_maintenance(task_id, notes=…)` | `complete` service, `MS_COMPLETE` notification |
| Skip | `coordinator.skip_maintenance(task_id, reason=…)` | `skip` service, `MS_SKIP` notification |
| Reset | `coordinator.reset_maintenance(task_id, date=…)` | `reset` service |

Button entities become a **third thin wrapper** over these exact methods — no new logic, no second code path. This is the same DRY shape as the summary work (one aggregator → many surfaces): **one action layer → services + notifications + buttons.** A tripwire test will assert the button's `async_press` calls the coordinator method (not a re-implementation).

## Proposed entities

### A. Per-task action buttons (object devices)
Mirror `binary_sensor.py`'s per-task setup. One `MaintenanceActionButton(MaintenanceEntity, ButtonEntity)` per (task × action); `MaintenanceEntity` already places it on the object's device.

| Entity ID | Press → | Default enabled | Icon |
|---|---|---|---|
| `button.<object>_<task>_complete` | `complete_maintenance(task_id)` | **yes** | `mdi:check-circle` |
| `button.<object>_<task>_skip` | `skip_maintenance(task_id)` | **yes** | `mdi:skip-next` |
| `button.<object>_<task>_reset` | `reset_maintenance(task_id)` | **no** (registry-disabled) | `mdi:restore` |

- `unique_id = maintenance_supporter_{object_slug}_{task_id}_{action}` (matches the binary-sensor `_overdue` suffix convention).
- `translation_key = button_{action}`, `translation_placeholders = {task_name}`.
- **Availability**: unavailable when the task is missing or **disabled** (you can't complete a paused task) — read `_status` / `enabled` like the other per-task entities.
- `complete`/`skip` could optionally pass `notes`/`reason` like "Completed from dashboard" for a clean history trail.

### B. Global buttons — none (export stays a service)

A global "export" button was prototyped and **removed**: a `button` entity runs on the HA server with no browser, so it can only write a server-side file (no download) — which users reasonably expect to be a download. Data export therefore stays the **`export_data` service** (writes a file + fires `*_export_completed`), the right home for it (automations, scripts). A real one-click *download* belongs in the panel/card frontend (the existing `maintenance_supporter/export` WS already returns the data) — tracked separately.

Bulk actions ("complete all overdue") are deliberately **out of scope** — too easy to fire destructively from a dashboard.

### C. Dashboard panel-parity — add / edit / delete (not button entities)

A `button.*` fires one action with **no input**, so add/edit can't be button entities. Reaching **panel parity on a dashboard** — create object, add task, edit, delete (the management CRUD the panel does via dialogs) — needs one of:

- **Lovelace card affordances (recommended):** give the existing card a `+ Add` / edit / delete UI that opens the **same dialog components** the panel already uses (`object-dialog`, `task-dialog`) and calls the **same WS commands** (`object/create|update|delete`, `task/create|update|delete`). True parity, fully DRY (no duplicated forms or logic), and it lands where users already look. Frontend (LitElement/TS) workstream.
- **CRUD services (complementary):** `maintenance_supporter.add_object` / `add_task` (+ update/delete) wrapping the shared creation logic. Enables automation/script/templated creation and service-call buttons, but is non-interactive (no form). Backend; smaller; useful alongside — not a replacement for — the card UI.
- **Rejected:** a global "add" button that deep-links to the panel — a button press can't open a dialog or navigate the browser.

**Recommendation:** the card affordances (reusing the panel's dialogs + WS) are the real "feature-complete vs panel" answer; CRUD services are a cheap complementary add for automations. Confirm scope before building (the card work is a sizeable frontend effort).

## Entity proliferation & the enabled-by-default decision (key call)

A 59-task dev install → **177** buttons if all three are enabled for every task. Options:

1. **Registry defaults (recommended):** create all three, but `entity_registry_enabled_default = True` for complete/skip and `False` for reset. Out-of-box ChoreOps parity (the two common actions are live), `reset` is one click to enable per task, and the entity list isn't tripled. No new config.
2. **Global feature flag** (`action_buttons_visible`, default off) — matches the integration's existing `advanced_*` opt-in flags; zero buttons until enabled, then all appear. Cleaner for clutter-averse users, but adds a setup step and an all-or-nothing toggle.
3. Hybrid: flag gates *creation*, registry defaults tune *which* appear.

**Recommendation:** ship **option 1** (complete/skip enabled, reset disabled-by-default). Revisit a feature flag only if users report clutter. Decide before implementing.

## Implementation plan (file-by-file)

1. **`button.py`** (new) — mirror `binary_sensor.py`: `async_setup_entry` (per-task buttons on object entries; global buttons on the global entry), `MaintenanceActionButton(MaintenanceEntity, ButtonEntity)` + `MaintenanceGlobalButton`. `async_press` → the coordinator method / service. `entity_registry_enabled_default` per the decision above.
2. **`const.py`** — `PLATFORMS += [Platform.BUTTON]`.
3. **i18n** — `strings.json` + all 12 `translations/*.json`: `entity.button.button_complete/skip/reset.name` (+ `button_export`). (Same 12-language audit as the summary keys — see `_i18n` checks.)
4. **DRY reuse** — no new action logic; call `complete_maintenance` / `skip_maintenance` / `reset_maintenance`. Global export reuses the `export_data` service path.
5. **Tests** (`tests/test_button.py`) — setup creates N×(enabled buttons); `async_press` calls the coordinator method (mock/asserts); **DRY tripwire** (press path == service path); disabled task → unavailable; global entry → only global button(s), no per-task; registry-enabled defaults are as specified.
6. **Docs** — README "Action buttons" section (+ a chip/tile + bubble-pop-up example for the ChoreOps rebuild), `ARCHITECTURE.md` (button platform under the action layer), this design doc → Implemented.
7. **Workstream C (optional, separate)** — card `+ Add` affordance.

## Feature-complete checklist

- [ ] `button` platform registered; per-task complete/skip/reset on object devices.
- [ ] Global export button on the hub device.
- [ ] All presses route through the existing coordinator action methods (DRY) — tripwire test green.
- [ ] Enabled-by-default strategy implemented (complete/skip on, reset off) — or feature flag, per decision.
- [ ] Disabled/missing tasks → buttons unavailable.
- [ ] i18n complete in 12 languages + `strings.json` (0 structural gaps, no English leftovers).
- [ ] Tests: setup, press→action, DRY tripwire, disabled, global-only, registry defaults.
- [ ] Docs: README + ARCHITECTURE + design doc; chip/tile/pop-up example.
- [ ] (Stretch) Card `+ Add` affordance for dashboard add (Workstream C).
- [ ] Docker-verified live: pressing `button.<obj>_<task>_complete` completes the task, summary sensors + card update; **not released** — for review first.

## Open questions

1. Enabled-by-default (option 1) vs feature flag (option 2)? *(Lean: option 1.)*
2. Include `reset` at all, or just complete/skip? Reset is destructive-ish from a dashboard. *(Lean: include, disabled-by-default.)*
3. Pass `notes="Completed from dashboard"` / `reason` for history clarity, or leave blank like a bare tap? *(Lean: a short marker.)*
4. Any global buttons beyond export now (e.g. a per-object "complete all due")? *(Lean: export only.)*

## Verification (per request: docker-only, no release)

Implement → `ruff` + full `pytest` → restart `ha-maint` → press a real button via the dashboard/Developer Tools and confirm the task completes and the summary sensors + card reflect it. **Stop there for review** — do not bump the version or cut a release until signed off.
