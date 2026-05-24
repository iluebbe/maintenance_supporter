# Design: Schedule model v2 — a discriminated-union recurrence

**Status:** Proposed · **Target:** v2.7 (with the "nth weekday of month" roadmap item) · **Date:** 2026-05-24

## 1. Motivation

The weeks/months/years units (v2.6.0) and the bug-fix series that followed
(#58, #59, and the v2.6.4 fresh-eyes audit) exposed that the task's scheduling
data is **flat-field flag-soup** that leaks across every consumer. Before we add
calendar-pattern recurrence ("1st Saturday of the month", "every Mon & Thu" —
see [ROADMAP.md](../../ROADMAP.md)), the model should be reworked, because those
patterns **cannot be expressed at all** in the current shape.

### Current shape (v2.6.x)
On `MaintenanceTask` / `entry.data[CONF_TASKS][id]`:

| field | meaning |
|---|---|
| `schedule_type` | `time_based` / `sensor_based` / `one_time` / `manual` |
| `interval_days` | **a count in `interval_unit` units** (e.g. `6` = "6 months") |
| `interval_unit` | `days` / `weeks` / `months` / `years` |
| `interval_anchor` | `completion` / `planned` |
| `last_planned_due` | anchor for `planned` mode |
| `schedule_time` | `HH:MM` (optional) |
| `due_date` | one-time due date |
| `trigger_config` | sensor trigger (threshold/counter/…) |

### What's wrong
1. **`interval_days` is misnamed.** It holds a *count*, not days. This is the
   direct cause of the entire bug series: consumers read `interval_days` and did
   `timedelta(days=interval_days)` — wrong for every non-day unit. We fixed each
   consumer (progress bars, calendar bucket, calendar entity, vacation preview,
   warning-cap, adaptive) one at a time. That's whack-a-mole around a **missing
   interface**.
2. **Validity is coupled to `schedule_type`** but not enforced: `interval_unit`
   only means something for time-based; `due_date` only for one-time;
   `trigger_config` only for sensor. Optional fields whose meaning depends on a
   sibling enum = primitive obsession.
3. **It can't express the roadmap.** "1st Saturday of the month" is not a
   `(count, unit)` and not any fixed number of days (28–35). Bolting on `nth`,
   `weekday`, `weekdays[]`, `months[]` makes the soup worse.

### Why "just store days" (the tempting fix) is wrong
Flattening to days would make every consumer trivially correct — **but it breaks
the feature**:
- weeks = 7 days (fine), **but months/years have no fixed day count**. "Every
  month on the 1st" stored as 30 days drifts: Jan 1 → Jan 31 → Mar 2 → … The
  calendar-aware `add_interval` + day-clamping (the whole point of #54:
  anniversaries, "every 6 months", "1/5/10-year inspections") is lost.
- "1st Saturday" can't be days at all.

The correct reading of that instinct: **storage keeps the rule; consumers see a
computed days-view.** `next_due` / `days_until_due` / a `span_days` / a display
`label` — never the raw rule. The bugs were consumers touching the rule, not a
missing day-conversion.

## 2. Goals / non-goals

**Goals**
- One representation that covers interval, weekday, nth-weekday, day-of-month,
  one-time, manual — and is extensible.
- A **single computation point** per recurrence kind (`next_due`), plus
  `span_days()` and `label()`, behind one interface.
- Consumers never read raw rule fields → the unit-leak bug class becomes
  structurally impossible.
- Lossless, reversible migration from v2.6.x data.

**Non-goals**
- Changing trigger (sensor) semantics. Triggers stay orthogonal (see §4.4).
- A general RRULE/iCal engine. We support the concrete patterns users ask for,
  no more.
- Sub-day scheduling beyond the existing `schedule_time`.

## 3. The `Schedule` value object

A nested `schedule` object on the task, a **discriminated union** keyed by
`kind`. Each kind owns its computation.

```jsonc
// entry.data[CONF_TASKS][id].schedule
{
  "kind": "interval",            // interval | weekdays | nth_weekday | day_of_month | one_time | manual
  // --- interval ---
  "every": 6,                    // renamed from interval_days (a count, not days)
  "unit": "months",             // days | weeks | months | years
  "anchor": "completion",       // completion | planned
  // --- weekdays ---
  "weekdays": [0, 3],            // Mon & Thu (0=Mon … 6=Sun)
  // --- nth_weekday ---  "1st Saturday of the month"
  "nth": 1,                      // 1..5, or -1 = last
  "weekday": 5,
  "months": [1,4,7,10],          // optional: restrict to these months (else every month)
  // --- day_of_month ---
  "day": 15,                     // 1..31 (clamped to month length)
  // --- one_time ---
  "due_date": "2026-09-01",
  // --- shared ---
  "time": "09:00"               // optional HH:MM (replaces schedule_time)
}
```

### 3.1 Interface (Python)

```python
class Schedule:
    kind: ScheduleKind
    # ... typed fields per kind ...

    def next_due(self, *, last_performed: date | None, created_at: date | None,
                 last_planned_due: date | None, today: date) -> date | None:
        """The single recurrence computation, dispatched on kind."""

    def span_days(self) -> int:
        """Approx length of one cycle in days — for progress bars + the
        due-soon warning cap. interval→add_interval span; weekdays→7;
        nth_weekday/day_of_month→~30; one_time/manual→0."""

    def label(self, t: Translator) -> str:
        """Localized human label: 'every 3 months', '1st Saturday', 'Mon & Thu'."""
```

`MaintenanceTask.next_due` becomes a thin delegate to `schedule.next_due(...)`.
The existing per-kind logic in `next_due` (one-time, interval w/ planned anchor,
calendar months loop) moves into the interval/one_time strategies unchanged.

### 3.2 Interface (TypeScript)

Mirror `Schedule` in `types.ts`; a `frontend-src/helpers/schedule.ts` provides
`scheduleSpanDays()`, `scheduleLabel()`, and (for the calendar projection)
`scheduleProject(schedule, from, windowEnd)`. The dialog renders per-kind field
groups from one `kind` switch (replacing the time_based/one_time/sensor blocks).

### 3.3 The boundary rule (the actual fix)

> **No consumer reads `schedule.every` / `unit` / `weekdays` / … directly.**
> Consumers use `next_due`, `days_until_due`, `schedule.span_days()`,
> `schedule.label()` only.

Enforce with a tripwire test (grep-style or import-graph) that fails if anything
outside the model/strategies references raw schedule fields — the structural
analog of the #50 `_build_task_summary` audit test.

### 3.4 Sensors stay orthogonal

`trigger_config` does **not** become a schedule kind. A task has a time
`schedule` (any kind, incl. `manual`) **and optionally** a `trigger_config`.
This actually *removes* today's awkwardness where "sensor_based" overloads a
"safety interval": that safety interval is simply `schedule = {kind: interval}`
plus an orthogonal trigger. Status precedence is unchanged (trigger active →
TRIGGERED, else schedule-derived status).

## 4. Migration (v2.6.x → v2.7)

Versioned config-entry migration (`async_migrate_entry`, bump `entry.version`).
Per task, map flat fields → `schedule`:

| old | new |
|---|---|
| `schedule_type=time_based` + `interval_days`/`interval_unit`/`interval_anchor` | `{kind: interval, every, unit, anchor}` |
| `schedule_type=one_time` + `due_date` | `{kind: one_time, due_date}` |
| `schedule_type=manual` | `{kind: manual}` |
| `schedule_type=sensor_based` + `interval_days?` | `{kind: interval, every, unit}` (the safety interval) **and** keep `trigger_config`; `kind: manual` if no safety interval |
| `schedule_time` | `schedule.time` |
| `last_planned_due` | retained (runtime anchor, not in `schedule`) |

Migration is pure/idempotent and unit-tested with real v2.6.x fixtures. Export
files carry a `version`; the importer up-migrates old exports too.

## 5. Surface-by-surface impact

- **model** — `Schedule` + strategies; `next_due`/`status`/`is_done` delegate.
- **coordinator** — unchanged (already uses `task.next_due`); adaptive stays
  gated to `kind==interval && unit==days`.
- **WS `_build_task_summary`** — emit the `schedule` object (+ keep `next_due` /
  `days_until_due` / `is_done` computed). Frontend reads `schedule`.
- **config/options flows + panel/card dialog** — one `kind` switch renders the
  right field group; the `interval_unit_selector()` / `_renderUnitSelect()`
  helpers are reused.
- **export/import (JSON/YAML/CSV)** — serialize `schedule`; CSV flattens to
  columns (`kind`, `every`, `unit`, `weekdays`, `nth`, `weekday`, `day`,
  `due_date`). Importer up-migrates legacy rows.
- **calendar entity + calendar-bucket + vacation preview** — call
  `schedule.next_due` / project via the strategy (no per-consumer math).
- **i18n** — add labels for the new kinds; `unit_*` reused.

## 6. Worked example — "1st Saturday of the month" (smoke alarms)

```jsonc
{ "kind": "nth_weekday", "nth": 1, "weekday": 5, "time": "10:00" }
```
`next_due(today)` → the next 1st-Saturday strictly after the anchor: find the
1st Saturday of the current month; if ≤ anchor, the 1st Saturday of next month.
`label()` → "1st Saturday". `span_days()` → ~30 (warning cap / progress).
Day-clamping and month-roll reuse the helpers in `helpers/dates.py`
(`_add_months`, plus a new `nth_weekday_of_month(year, month, nth, weekday)`).

## 7. Rollout / phasing

1. **Doc + sign-off** (this file).
2. **Strategy core**: `Schedule` + `next_due`/`span_days`/`label` for the
   existing kinds (interval/one_time/manual + sensor orthogonality) behind the
   model, *no storage change yet* — `Schedule.from_legacy(task_dict)` adapts the
   flat fields. Consumers switch to the computed interface. (Ships value + the
   boundary rule with zero migration risk.)
3. **Storage migration** to the nested `schedule` object + `async_migrate_entry`
   + export `version` up-migration.
4. **New kinds**: `weekdays`, `nth_weekday`, `day_of_month` + UI + i18n + the
   roadmap feature.

Phase 2 alone removes the bug class; phases 3–4 deliver the roadmap.

## 8. Testing

- Strategy unit tests per kind (incl. clamping, leap years, planned-anchor
  no-drift, nth-weekday month-roll, last-weekday).
- Migration round-trip tests from real v2.6.x task fixtures (every
  `schedule_type` + unit + sensor-with/without-safety-interval).
- Boundary tripwire: nothing outside model/strategies reads raw schedule fields.
- The existing 1665 backend + 77 frontend tests are the regression net.

## 9. Open questions

1. **`interval_days` rename** — `every` is clean but is a stored-key change
   (migration). Confirm we rename rather than keep the misnomer for back-compat.
2. **CSV shape** for the new kinds — flat columns vs a single JSON `schedule`
   cell. Flat columns keep CSV human-editable but add many sparse columns.
3. **Adaptive + non-day** — keep "gated off" (v2.6.4) or, in v2, convert
   recommendations into the task's unit? (Recommend: keep gated.)
4. **`weekdays` multi-day** next-due semantics with `planned` anchor — define
   precisely (next matching weekday strictly after anchor).
