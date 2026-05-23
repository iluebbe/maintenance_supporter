# Design: One-time tasks + calendar intervals (weeks / months / years)

> **Status:** Planned (not implemented). Source: community forum thread 995556 (@Michael_Dahl, @brunkj) and issue #54 (@malkinskir).

## Problem / signal

Two related gaps, both raised by real users:

- **One-time ("one-shot") tasks** — tasks that happen *once*, not on a cycle:
  - **@brunkj**: one-off household jobs (pressure-washing, a repair) that aren't recurring and that any family member can tick off.
  - **@Michael_Dahl**: fixed-date inspections (1 / 5 / 10-year), where the **completed record stays visible** afterwards.
  Today every scheduled task re-arms on completion (time-based) or waits for a sensor (sensor-based). There's no "do it once, then it's done."

- **Calendar intervals (months / years)** — **@Michael_Dahl** wants monthly intervals; **#54** wants yearly anniversaries (birthdays). Today `interval_days` is **days only**, so "monthly" ≈ 30 days and drifts; "yearly" ≈ 365 and slips on leap years.

## Current model (what we're extending)

`models/maintenance_task.py`:
- `ScheduleType` = `time_based` | `sensor_based` | `manual`. **`manual`** = no schedule → `next_due` is `None` → always `OK` (complete-on-demand, never overdue). *Not* a one-shot.
- `next_due` = `last_performed (or created_at) + interval_days` (days arithmetic; supports a `planned` anchor to avoid drift).
- `status` ∈ `OK | DUE_SOON | OVERDUE | TRIGGERED` — **no terminal "done"**.
- Completion (`coordinator.complete_maintenance`) writes `last_performed` + a history entry → `next_due` recomputes → the task **re-arms**.

## Part A — One-time tasks

**New `ScheduleType.ONE_TIME`** + a **`due_date`** field (ISO `YYYY-MM-DD`).

- **Before completion**: `next_due = due_date`; status flows `OK → DUE_SOON → OVERDUE` exactly like a time-based task (so the user gets reminded). `days_until_due` works unchanged.
- **On completion**: it must **not re-arm**. `coordinator.complete_maintenance` skips the "stamp last_performed → recompute next cycle" step for `one_time`; the completion still lands in **history** (so it's a permanent record). `next_due` returns `None` once a completion exists → no more OVERDUE.
- **Staying visible** (the @Michael_Dahl ask) already works: the **Calendar tab → past mode** (`−30d`/`−90d` chips) and the `custom:maintenance-supporter-calendar-card` (`past_days:`) are a chronological log of completed events. A finished one-shot lands there as a record.
- **"Done" representation** — decision needed (see below). Recommended: a derived **`is_done`** flag (`one_time` + has a completion) exposed in the task result; the card/panel show a "Done ✓" chip and **filter completed one-shots out of the active list by default**. Status stays `OK` so summary counts/sensors are untouched.

## Part B — Calendar intervals

**New `interval_unit`** field = `days` | `weeks` | `months` | `years` (default **`days`** → fully back-compatible).

- `next_due` gains calendar arithmetic via a small dependency-free helper `helpers/dates.py::add_interval(anchor, n, unit)` (months/years add to the month/year with **day-of-month clamping** — e.g. Jan 31 + 1 month → Feb 28). The `planned`-anchor path uses the same helper.
- Yearly anniversaries (#54) become exact (`1 year`, `planned` anchor); monthly is drift-free (`1 month`).
- `effective_warning` and all status logic stay in `days_until_due` (still a day count), so no other status code changes.

## Implementation (file-by-file)

1. **`const.py`** — `ScheduleType.ONE_TIME = "one_time"`; `CONF_TASK_DUE_DATE = "due_date"`; `CONF_TASK_INTERVAL_UNIT = "interval_unit"`. (No new `MaintenanceStatus` if we go with `is_done`.)
2. **`helpers/dates.py`** (new) — `add_interval(anchor: date, n: int, unit: str) -> date` with month/year clamping; unit-tested in isolation.
3. **`models/maintenance_task.py`** — add `due_date`, `interval_unit` fields; `next_due` handles `one_time` (due_date, None once completed) and non-day units; `is_done` property; `to_dict`/`from_dict` round-trip the two new fields.
4. **`coordinator.py`** — expose `_is_done` in `task_result`; the per-task loop unchanged otherwise.
5. **Completion logic** (`coordinator.complete_maintenance` / skip) — for `one_time`, record history but don't re-arm (no new `next_due`).
6. **Config flow** (`config_flow.py`, `config_flow_options_task.py`) — schedule-type picker gains **One-time** (with a `due_date` date field); the time-based step gains an **interval unit** selector next to the number.
7. **`websocket/tasks.py`** — `create`/`update` schemas accept `due_date` + `interval_unit`; persist them (and `async_create_task_simple` can accept them for the service).
8. **Frontend** — `components/task-dialog.ts`: One-time option + due-date picker + interval-unit dropdown. Card/panel: "Done" chip + default filter of completed one-shots. `styles.ts` i18n.
9. **i18n** — `ScheduleType` `one_time`, the interval units, and any new UI labels across `strings.json` + 12 `translations/*.json` + the card's `styles.ts`.
10. **Export/import** — include `due_date` + `interval_unit` in `export.py` + `csv_handler.py` (and the importer).
11. **Migration** — none required: existing tasks default to `interval_unit="days"` and keep their `schedule_type`. (Confirm `from_dict` defaults.)
12. **Tests** — `one_time`: due-date status, no re-arm on complete, `is_done`, history record kept; `add_interval` unit tests (month/year clamping, leap years); monthly/yearly `next_due`; create/update + export/import round-trip for the new fields; a card filter test.

## Decisions to confirm

1. **"Done" representation** — `is_done` flag + status stays `OK` (small ripple; **recommended**) vs a new `MaintenanceStatus.DONE` (cleaner semantics, but ripples into the summary aggregator, sensor enum options, status colors, binary_sensor, and 12-language status names).
2. **Completed one-shots in the active list** — filter out by default (recommended) with an opt-in "show done", or always show with a Done chip?
3. **`interval_unit` on the field** vs a separate "monthly/anniversary" schedule type. *(Lean: `interval_unit` — one mechanism, composes with the existing `planned` anchor.)*
4. **One-time due** as an explicit `due_date` (recommended — matches "inspection on this date") vs reusing `interval_days` from `created_at` (used once).

## Out of scope

- Per-task assignee/"who completed it" beyond the existing `responsible_user_id` + history (brunkj's "any family member" is already covered by the v2.5.0 action buttons / card complete on a shared dashboard).
- A full recurring-rRULE engine — `interval_unit` covers monthly/yearly without it.
- Notifications wording for one-shots (reuse the existing due/overdue notifications).
