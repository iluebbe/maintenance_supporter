# User Journeys & Lifecycle Test Design

Status: living document (created 2026-07-05).

## Why this document exists

The test suite (2475 backend tests) is organized **per module/feature**: each
WS command, each helper, each entity platform is tested in isolation, and a
cloud coverage audit (v2.17) verified per-command coverage. What that
organization structurally misses are **processes over time** — sequences of
user actions with reloads/restarts in between. Two bugs proved the gap on the
same day, both invisible in a live session and only materializing later:

* NFC tag names degraded to UUIDs **after a restart** (names live in the
  entity registry, not the tag store).
* Renaming an object orphaned **all** of its entities **on the next reload**
  (unique_ids embed the name slug; the registry was never migrated).

Both were "mutation → persistence boundary → read-back" bugs. This document
maps every process a user actually runs through, states the invariants each
must uphold, records which are covered today, and defines the **journey
test** family that closes the gap.

## The journey inventory

Legend for *surfaces*: **P** panel, **C** Lovelace card, **F** config/options
flow, **W** WS API, **S** services, **E** entities (buttons/todo/calendar),
**Q** QR/NFC, **N** notification actions, **V** voice/Assist (via todo).

### A. Onboarding & first contact

| # | Journey | Surfaces | Covered today | Gap |
|---|---------|----------|---------------|-----|
| A1 | Install → add integration → global entry wizard (notify service) | F | test_config_flow | — |
| A2 | Empty panel → template gallery → object + tasks in one click | P, F | test_config_flow_template, panel-shell FE tests | sequence up to first complete untested |
| A3 | Manual first object + first task via dialogs | P, W | test_ws_objects, test_ws_tasks* | — |
| A4 | Restore from backup: JSON/CSV/YAML import (incl. documents metadata, device links) | P, W | test_ws_io*, test_csv_* | import → **restart** → entity/status parity untested |
| A5 | Migration from older versions (flat→nested schedule, panel default) | (upgrade) | test_schedule migrations, test_init | — |

### B. Daily use (the happy path)

| # | Journey | Surfaces | Covered today | Gap |
|---|---------|----------|---------------|-----|
| B1 | Glance: Today view → one-tap complete | P | FE panel tests, test_ws_tasks_actions | — |
| B2 | Complete with details (notes/cost/duration/photo/checklist) | P, C | test_ws_tasks_actions, test_completion_photos | — |
| B3 | Complete via every OTHER surface: button entity, todo check-off, service, QR complete, quick-complete QR, NFC scan, notification action, voice | E, S, Q, N, V | test_button, test_todo, test_services, test_qr*, test_init (NFC), notification-action tests | one task completed via N different surfaces in ONE test (envelope parity of events/history) untested |
| B4 | Skip / missed semantics / snooze (notification + panel) | P, N, W | test_ws_tasks_actions, test_notification_manager | — |
| B5 | Being reminded: due-soon → overdue → lead-times → digest → quiet hours/vacation interplay | (time) | test_notification_manager, test_daily_tick, test_vacation | multi-day time-lapse of ONE task through all reminder stages untested |
| B6 | Sensor-triggered flow: threshold crosses → TRIGGERED → notification → complete → re-arm (or auto-complete on recovery) | (state) | test_triggers*, test_auto_complete_recovery | — |
| B7 | Consult: statistics, history, documents (open PDF at task), calendar views | P, E | test_statistics, test_document_* | — |

### C. Changes (mutations) — *the class that bit us*

Every journey here must uphold the **mutation invariants** (see below),
especially across reload/restart.

| # | Journey | Surfaces | Covered today | Gap |
|---|---------|----------|---------------|-----|
| C1 | Edit task fields (warning days, notes, priority, labels) | P, F, W, S | per-command tests, test_journey_mutations | ✔ closed 2026-07-05 |
| C2 | Change recurrence: interval value/unit, time↔calendar↔sensor type switches | P, F, W | test_schedule*, #58/#59 regressions, test_journey_mutations (unit + time→calendar) | sensor-type switches in sequence still open |
| C3 | **Rename task** / entity_slug change | P, F, W | test_ws_objects, test_journey_mutations | ✔ closed 2026-07-05 |
| C4 | **Rename object** | P, F (2 flows), W | test_object_rename_migration (NEW, after the bug) | ✔ closed 2026-07-05 |
| C5 | Re-assign user; change rotation pool | P, W | test_ws_users, test_rotation | — |
| C6 | Move object: area change, device link, parent object | P, F, W | test_device_link (NEW), #48 area sync | link → unlink → restart untested |
| C7 | Feature toggles off/on (data must survive hidden state) | P, F | test_ws_roundtrip settings, test_journey_mutations | ✔ closed 2026-07-05 |
| C8 | Trigger entity replaced / renamed in HA | (registry) | test_entity_rename_rewrite, repairs | — |
| C9 | Duplicate object; groups CRUD | P, W | test_ws_objects duplicate, groups tests | — |

### D. Corrections — *user emphasis*

| # | Journey | Surfaces | Covered today | Gap |
|---|---------|----------|---------------|-----|
| D1 | Fix a completion: history edit (cost/notes/date/who) | P, W | test_ws_tasks_history, test_journey_corrections | ✔ closed 2026-07-05 (note: post-edit coordinator refresh is debounced ~10 s) |
| D2 | Undo a completion | P, W | — | **there is no history-entry DELETE endpoint** — undo goes via reset/backdating (test_journey_corrections covers that); a real delete is a candidate feature |
| D3 | Reset last_performed to a chosen date | P, E, S, W | test_services, test_journey_corrections | — |
| D4 | Photo correction: remove/replace completion photo (blob refcount!) | P, W | test_completion_photos, test_document_store | — |
| D5 | "Oops" import: re-import over existing data | P, W | test_ws_io duplicate handling | — |

### E. Retirement: archive / delete / uninstall

| # | Journey | Surfaces | Covered today | Gap |
|---|---------|----------|---------------|-----|
| E1 | Archive task → *Undo* toast → unarchive re-anchors | P, W | test_ws_archive | — |
| E2 | Archive → restart (stays inert) → unarchive | P, W | test_ws_archive, test_journey_retirement (task-level) | object-level cascade with restart still open |
| E3 | Delete task → all 6 per-task entities + store keys + group refs gone | P, F, W, S | test_entity_removal, test_services_crud | — |
| E4 | Delete object → device, entities, documents (refcounted blobs), group refs gone | P, F, W | test_ws_objects, test_journey_retirement (assert_entry_fully_gone) | documents-blob sweep still open |
| E5 | Retention: auto-archive one-offs → auto-delete after N days | (time) | test_retention | — |
| E6 | Uninstall: remove all entries → nothing left in registries/storage | F | — | untested |

### F. Repair flows — *user emphasis*

| # | Journey | Surfaces | Covered today | Gap |
|---|---------|----------|---------------|-----|
| F1 | Trigger entity vanishes → grace → issue → fix flow (replace / remove / dismiss) → issue clears | repairs | test_repairs, test_repair_flow (24 tests) | replace-then-**restart**-no-reissue untested |
| F2 | Stale on_complete_action target → replace/remove flow | repairs | test_repair_flow | — |
| F3 | Orphaned panel-access user → remove flow; user recreated → auto-clear | repairs | test_repairs | — |
| F4 | notify_service_missing (non-fixable) appears/clears | repairs | test_repairs_notify | — |
| F5 | Document storage hygiene (orphan/dangling blobs after crash) → cleanup flow | repairs | test_document_repairs | — |

### G. Multi-user & permission lifecycle

| # | Journey | Surfaces | Covered today | Gap |
|---|---------|----------|---------------|-----|
| G1 | Operator lifecycle: invite non-admin → read-only use → delegate write → edit → **revoke mid-session** → next call rejected | P, W | test_ws_permission_matrix (static tiers) | the revoke TRANSITION untested |
| G2 | **HA user deleted** while responsible for tasks / in rotation pools: badges, per-user notification routing, rotation advance | (auth) | allowlist orphan repair only (F3) | assignments have NO orphan handling — suspected silent-fallback + ghost-rotation bugs |
| G3 | Two admins, two panels: concurrent edits, complete-vs-delete race, subscription consistency | P, W | — | untested |

### H. Time as an actor

| # | Journey | Surfaces | Covered today | Gap |
|---|---------|----------|---------------|-----|
| H1 | Downtime catch-up: HA off for weeks → boot → reminders bundle sanely (no storm), retention sweeps | (time) | logbook baselining only | untested (faketime infra exists) |
| H2 | DST transition × schedule_time (non-existent 02:30), instance timezone change | (time) | — | untested |
| H3 | Year rollover × Workday holiday calendar (lazy year population), EOM at year boundary | (time) | test_schedule_eom (fixed dates) | rollover untested |

### I. Persistence integrity — *the generalized bug class*

| # | Journey | Surfaces | Covered today | Gap |
|---|---------|----------|---------------|-----|
| I1 | **entry.data ↔ Store divergence**: crash between the two writes → merge behavior on next boot | (crash) | — | untested; same structural rift as tag-store vs registry |
| I2 | Corrupted/truncated Store at boot; Store schema migration | (crash) | — | untested |
| I3 | Slug collision: two objects renamed to the same name (migration skips) — what does the user see? | P, W | migration skip is logged | UX undefined |
| I4 | Full-instance restore (HA backup) on a NEW machine: blobs present, device links/tags dangle gracefully | (ops) | — | untested |

### J. External systems changing under us

| # | Journey | Surfaces | Covered today | Gap |
|---|---------|----------|---------------|-----|
| J1 | Trigger-source integration uninstalled → repair → REINSTALLED, same entity_id returns → trigger resumes, issue auto-clears | repairs | partial (issue clears on entity return) | full cycle untested |
| J2 | Recorder purge shrinks the statistics window → sparklines/predictions degrade gracefully | (recorder) | — | untested |
| J3 | Notify target lifecycle: app reinstalled = new service name mid-reminder-cycle | (notify) | notify_service_missing repair (F4) | mid-cycle rename untested |

### K. Growth & limits

| # | Journey | Surfaces | Covered today | Gap |
|---|---------|----------|---------------|-----|
| K1 | **History growth**: NO cap exists — completion + trigger history accumulate forever (entry/store bloat, WS payload size) | (time) | — | needs a design decision (cap/trim/paginate), then tests |
| K2 | Import at the documented maxima; document storage at quota; 1000-task install across all views | P, W | virtualized table (FE) | backend limits untested as journeys |

### L. Cross-feature interactions

| # | Journey | Surfaces | Covered today | Gap |
|---|---------|----------|---------------|-----|
| L1 | Vacation exempt list (global, task-id keyed, persistent) after task deletion — ids are never cleaned | P, W | — | confirmed dangling (likely harmless, grows forever) |
| L2 | Adaptive learning × history correction (D1): does EWA re-learn from corrected values? | P, W | — | untested |
| L3 | Snooze state × task edit; groups × archive; printed QR × deleted task (scan UX) | Q, P | partial | untested |

## Cross-cutting invariants (what journey tests assert)

After **every** mutation step, and again after a simulated restart:

1. **Entity identity**: the set of registry `unique_id`s for the entry is
   unchanged (or changed *exactly* as the migration intends). Entity IDs,
   user customisations, and history keys survive.
2. **No orphans**: no registry entries, devices, Store task keys, document
   blobs, or group refs pointing at deleted ids.
3. **Read-back parity**: the WS `object` response equals what was written
   (the #50 field-audit rule, applied to sequences).
4. **Status correctness**: `_status` / `_next_due` recompute correctly from
   the mutated state — never from a stale in-memory copy.
5. **Authoritative sources only**: displayed names resolve from HA
   registries, never from transient stores (the tag-name rule).

## Journey-test architecture

New test family `tests/test_journey_*.py`, backed by helpers in
`tests/journey.py`:

* `simulate_restart(hass, *entries)` — unload every entry, then set them up
  again from persisted data. Approximates a restart for everything the
  integration owns (entities are re-created from storage, coordinators
  rebuilt); each journey step that mutates state is followed by one.
* `registry_snapshot(hass, entry)` — the `{unique_id: entity_id}` map used
  for invariant 1.
* `assert_no_orphans(hass, entry, *, deleted_task_ids=(), deleted_entries=())`
  — invariant 2 in one call.

Design rules for journey tests:

* One test = one realistic multi-step story, named after the story
  (`test_owner_renames_everything_after_a_year`), not after a function.
* Steps go through **public surfaces** (WS handlers, services, flows) — never
  by poking entry.data directly.
* At least one `simulate_restart` per story, placed after the most
  interesting mutation.
* Journey tests complement — never replace — the per-module tests.

### Implementation order (by risk × user emphasis)

1. **C-journeys** (mutations): the proven bug class. `test_journey_mutations.py`
2. **D-journeys** (corrections): history edit/delete/reset chains. `test_journey_corrections.py`
3. **E-journeys** (retirement): archive/delete/no-orphan sweeps incl. E6. `test_journey_retirement.py`
4. **F1 restart hardening** + A4 import-restart parity. `test_journey_repairs_restore.py`
5. B3 (one task, every completion surface) + B5 (reminder time-lapse). `test_journey_daily_use.py`

Implemented so far (2026-07-05): `tests/journey.py` (harness),
`test_journey_mutations.py` (C1/C2-partial/C3/C4/C7 + status-across-restart),
`test_journey_corrections.py` (D1/D3), `test_journey_retirement.py`
(E1-partial/E3/E4-partial). Next: repairs+restore file, daily-use file.

Keep this table honest: when a journey gains coverage, flip its Gap column.
