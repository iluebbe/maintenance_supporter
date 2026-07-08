"""The task recurrence as a single value object (Schedule).

Phase 2 of docs/design/schedule-model-v2.md: the recurrence math is centralized
here behind one interface (``next_due`` / ``span_days``) and adapted from the
existing flat task fields via :meth:`Schedule.from_legacy` — **no storage change
and no behaviour change** (the logic is a faithful move of the old
``MaintenanceTask.next_due``).

The point is the boundary: callers ask the Schedule for a computed date/span,
never for raw ``every`` / ``unit``. Adding calendar patterns later
(``weekdays`` / ``nth_weekday`` / ``day_of_month``) is then a new ``kind`` +
branch here, not another field threaded through every consumer.

Dates in/out are ``datetime.date`` objects; string parsing stays at the model
boundary so this module is pure and trivially unit-testable.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Any

from .dates import (
    add_interval,
    interval_span_days,
    next_day_of_month,
    next_nth_weekday,
    next_weekday_in_set,
    parse_iso_date,
    roll_back_to_business_day,
)

# Recurrence kinds. Phase 2 covers the v2.6.x set; the calendar kinds
# (weekdays / nth_weekday / day_of_month) arrive with the roadmap feature.
KIND_INTERVAL = "interval"
KIND_ONE_TIME = "one_time"
KIND_MANUAL = "manual"
KIND_WEEKDAYS = "weekdays"  # e.g. every Mon & Thu
KIND_NTH_WEEKDAY = "nth_weekday"  # e.g. 1st Saturday of the month
KIND_DAY_OF_MONTH = "day_of_month"  # e.g. the 15th

# The calendar kinds are fixed schedules (occurrences are absolute dates), so the
# completion/planned anchor distinction doesn't apply to them.
_CALENDAR_KINDS = (KIND_WEEKDAYS, KIND_NTH_WEEKDAY, KIND_DAY_OF_MONTH)

# Planned-anchor month/year stepping is bounded to avoid an unbounded loop on
# absurd data (a task untouched for >2000 cycles falls back to the last step).
_MAX_PLANNED_STEPS = 2000

# (#83) offset bound: ±15 days covers every sensible "N days before/after the
# pattern date" case without letting a bogus payload shift schedules by years.
_MAX_OFFSET_DAYS = 15


def _sanitize_offset(raw: object) -> int:
    if isinstance(raw, bool) or not isinstance(raw, int):
        return 0
    return max(-_MAX_OFFSET_DAYS, min(raw, _MAX_OFFSET_DAYS))


def _sanitize_day(raw: object) -> int | None:
    """day 1..31, or -1 = last day of the month; anything else -> None."""
    if isinstance(raw, bool) or not isinstance(raw, int):
        return None
    if raw == -1 or 1 <= raw <= 31:
        return raw
    return None


def _sanitize_months(raw: object) -> tuple[int, ...]:
    """A deduped, sorted tuple of valid month numbers (1..12); [] on garbage."""
    if not isinstance(raw, (list, tuple)):
        return ()
    seen = {m for m in raw if isinstance(m, int) and not isinstance(m, bool) and 1 <= m <= 12}
    return tuple(sorted(seen))


def _parse_ends(raw: object) -> tuple[int | None, date | None]:
    """Read a finite-series ``ends`` block: (count>=1 or None, until-date or None)."""
    if not isinstance(raw, Mapping):
        return None, None
    count = raw.get("count")
    valid_count = count if isinstance(count, int) and not isinstance(count, bool) and count >= 1 else None
    until_raw = raw.get("until")
    until = parse_iso_date(until_raw) if isinstance(until_raw, str) else None
    return valid_count, until


@dataclass(frozen=True)
class Schedule:
    """A task's time recurrence. Triggers (sensors) are orthogonal and handled
    by the coordinator's status precedence, not here."""

    kind: str = KIND_MANUAL
    every: int | None = None  # interval count (legacy: interval_days)
    unit: str = "days"  # days | weeks | months | years
    anchor: str = "completion"  # completion | planned
    due_date: date | None = None  # one_time
    weekdays: tuple[int, ...] = ()  # weekdays kind: 0=Mon … 6=Sun
    nth: int | None = None  # nth_weekday kind: 1..5, or -1 = last
    weekday: int | None = None  # nth_weekday kind: 0=Mon … 6=Sun
    day: int | None = None  # day_of_month kind: 1..31 (clamped), -1 = last day
    months: tuple[int, ...] = ()  # nth_weekday/day_of_month: restrict months (1..12)
    # (#83) end-of-month scheduling extras — calendar kinds only:
    business: bool = False  # day_of_month: roll a weekend date back to Friday
    offset_days: int = 0  # shift the computed occurrence by ±N days
    # Seasonal active window: months (1..12) the task may be due in. A computed
    # due date outside the window rolls forward to the 1st of the next active
    # month, so the task pauses through the off-season and resumes in season.
    # Empty = active all year. Applies to interval + calendar kinds (not one_time).
    season_months: tuple[int, ...] = ()
    # Finite series: the recurrence ends after `ends_count` completions and/or
    # once the next occurrence would fall after `ends_until`. Either, both, or
    # neither. When the end is reached the task stops re-arming (next_due None)
    # and reads as done, like a completed one-time task.
    ends_count: int | None = None
    ends_until: date | None = None

    @classmethod
    def from_legacy(
        cls,
        *,
        schedule_type: str | None,
        interval_days: int | None,
        interval_unit: str | None,
        interval_anchor: str | None,
        due_date: str | None,
    ) -> Schedule:
        """Adapt the flat v2.6.x task fields to a Schedule (no storage change).

        Mirrors the old ``next_due`` dispatch exactly: one-time → ``one_time``;
        any positive interval → ``interval`` (incl. a sensor task's safety
        interval, since next-due was always schedule_type-agnostic except
        one-time); otherwise ``manual`` (no schedule).
        """
        if schedule_type == KIND_ONE_TIME:
            return cls(kind=KIND_ONE_TIME, due_date=parse_iso_date(due_date))
        if not interval_days or interval_days <= 0:
            return cls(kind=KIND_MANUAL)
        return cls(
            kind=KIND_INTERVAL,
            every=interval_days,
            unit=interval_unit or "days",
            anchor=interval_anchor or "completion",
        )

    def is_finite(self) -> bool:
        """True when the recurrence has an end condition (count and/or until)."""
        return self.ends_count is not None or self.ends_until is not None

    def next_due(
        self,
        *,
        last_performed: date | None,
        created_at: date | None,
        last_planned_due: date | None,
        today: date,
        times_performed: int = 0,
        due_override: date | None = None,
    ) -> date | None:
        """The next due date, or None for manual / archived one-time tasks.

        Layers three per-task modifiers over the raw recurrence:
        - ``due_override`` postpones just the current cycle (until completed);
        - ``season_months`` rolls an off-season date to the next active month;
        - the finite-series end (``ends_count`` / ``ends_until``) stops re-arming.
        A one_time task keeps its fixed date and ignores season/finite.
        """
        # A postponed occurrence wins for the current cycle — until it's been
        # completed past the override date (then fall through to normal cadence).
        if due_override is not None and (last_performed is None or due_override > last_performed):
            return due_override

        # Finite series exhausted by completion count → terminally done.
        if self.ends_count is not None and times_performed >= self.ends_count:
            return None

        result = self._compute_next_due(
            last_performed=last_performed,
            created_at=created_at,
            last_planned_due=last_planned_due,
            today=today,
        )
        if self.kind == KIND_ONE_TIME:
            return result
        result = self._roll_to_season(result)

        # Finite series ends once the next occurrence would fall past until.
        if self.ends_until is not None and result is not None and result > self.ends_until:
            return None
        return result

    def _roll_to_season(self, d: date | None) -> date | None:
        """Roll a due date outside the seasonal window to the 1st of the next
        active month; a no-op when there's no window or the date is in season."""
        if d is None or not self.season_months or d.month in self.season_months:
            return d
        year, month = d.year, d.month
        for _ in range(12):
            month += 1
            if month > 12:
                month, year = 1, year + 1
            if month in self.season_months:
                return date(year, month, 1)
        return d  # season_months held only invalid values — leave the date as-is

    def _compute_next_due(
        self,
        *,
        last_performed: date | None,
        created_at: date | None,
        last_planned_due: date | None,
        today: date,
    ) -> date | None:
        """The raw next due date before the seasonal window is applied."""
        if self.kind == KIND_ONE_TIME:
            # Due on the fixed date; archived (no re-arm) once completed.
            if last_performed is not None or self.due_date is None:
                return None
            return self.due_date

        if self.kind in _CALENDAR_KINDS:
            # Fixed calendar schedule. First-time anchors on created_at/today so
            # a never-done task stays visibly overdue once its date passes (the
            # #30 lesson); after completion it's the next occurrence strictly
            # after last_performed. The completion/planned anchor doesn't apply.
            if last_performed is not None:
                return self._calendar_occurrence(last_performed, inclusive=False)
            return self._calendar_occurrence(created_at or today, inclusive=True)

        if self.kind != KIND_INTERVAL:
            return None

        every = self.every or 0
        if every <= 0:
            return None

        if last_performed is None:
            # First-time anchor: created_at if known, else today (issue #30).
            return add_interval(created_at or today, every, self.unit)

        if self.anchor == "planned":
            # Anchor from the previously planned due date so a late completion
            # doesn't drift the schedule.
            anchor = last_planned_due or last_performed
            if self.unit in (None, "days", "weeks"):
                step = every * (7 if self.unit == "weeks" else 1)
                days_gap = (last_performed - anchor).days
                periods = 1 if days_gap < 0 else (days_gap // step) + 1
                return anchor + timedelta(days=periods * step)
            # Calendar units (months/years): step until past last_performed.
            candidate = anchor
            for _ in range(_MAX_PLANNED_STEPS):
                candidate = add_interval(candidate, every, self.unit)
                if candidate > last_performed:
                    return candidate
            return candidate

        return add_interval(last_performed, every, self.unit)

    def _calendar_occurrence(self, ref: date, *, inclusive: bool) -> date | None:
        """Next EFFECTIVE occurrence of a calendar kind on/after ``ref``.

        (#83) The effective date is the base pattern date, optionally rolled
        back to a business day (``business``, day_of_month only), then shifted
        by ``offset_days``. Bases are searched from ``ref - offset`` so the
        shifted result still lands on/after ``ref``; when the business
        rollback pushes a candidate before ``ref``, the next base is tried
        (bounded — a rollback moves at most a few days, ≤14 even with a
        Workday-provided holiday calendar in play).
        """
        offset = timedelta(days=self.offset_days)
        search = ref - offset
        search_inclusive = inclusive
        for _ in range(6):
            base = self._base_occurrence(search, inclusive=search_inclusive)
            if base is None:
                return None
            effective = base
            if self.business and self.kind == KIND_DAY_OF_MONTH:
                effective = roll_back_to_business_day(effective)
            effective = effective + offset
            if (effective >= ref) if inclusive else (effective > ref):
                return effective
            search = base
            search_inclusive = False  # strictly after the base just tried
        return None

    def _base_occurrence(self, ref: date, *, inclusive: bool) -> date | None:
        """Next base pattern date of a calendar kind on/after ``ref``."""
        months = self.months or None
        if self.kind == KIND_WEEKDAYS:
            return next_weekday_in_set(ref, self.weekdays, inclusive=inclusive)
        if self.kind == KIND_NTH_WEEKDAY:
            if self.nth is None or self.weekday is None:
                return None
            return next_nth_weekday(ref, self.nth, self.weekday, months, inclusive=inclusive)
        if self.kind == KIND_DAY_OF_MONTH:
            if self.day is None:
                return None
            return next_day_of_month(ref, self.day, months, inclusive=inclusive)
        return None

    def span_days(self) -> int:
        """Approximate length of one cycle in days (0 when there is no recurrence).

        For progress bars and the due-soon warning cap — unit-aware, so a
        6-month task is ~183 days, not 6. The calendar kinds use a nominal cycle
        (weekly → 7, monthly patterns → 30).
        """
        if self.kind == KIND_INTERVAL:
            return interval_span_days(self.every, self.unit)
        if self.kind == KIND_WEEKDAYS:
            return 7
        if self.kind in (KIND_NTH_WEEKDAY, KIND_DAY_OF_MONTH):
            return 30
        return 0

    # --- serialization (Phase 3: nested `schedule` storage) ----------------

    def to_dict(self) -> dict[str, Any]:
        """Canonical nested form for storage. Defaults are omitted to keep the
        stored dict minimal (``unit`` defaults to days, ``anchor`` to completion)."""
        d: dict[str, Any] = {"kind": self.kind}
        if self.kind == KIND_INTERVAL:
            d["every"] = self.every
            if self.unit and self.unit != "days":
                d["unit"] = self.unit
            if self.anchor and self.anchor != "completion":
                d["anchor"] = self.anchor
        elif self.kind == KIND_ONE_TIME and self.due_date is not None:
            d["due_date"] = self.due_date.isoformat()
        elif self.kind == KIND_WEEKDAYS:
            d["weekdays"] = list(self.weekdays)
        elif self.kind == KIND_NTH_WEEKDAY:
            d["nth"] = self.nth
            d["weekday"] = self.weekday
            if self.months:
                d["months"] = list(self.months)
        elif self.kind == KIND_DAY_OF_MONTH:
            d["day"] = self.day
            if self.months:
                d["months"] = list(self.months)
            if self.business:
                d["business"] = True
        if self.kind in _CALENDAR_KINDS and self.offset_days:
            d["offset"] = self.offset_days
        # Seasonal window applies to any recurring kind (not one_time/manual).
        if self.season_months and self.kind not in (KIND_ONE_TIME, KIND_MANUAL):
            d["season_months"] = list(self.season_months)
        # Finite-series end condition (recurring kinds only).
        if self.is_finite() and self.kind not in (KIND_ONE_TIME, KIND_MANUAL):
            ends: dict[str, Any] = {}
            if self.ends_count is not None:
                ends["count"] = self.ends_count
            if self.ends_until is not None:
                ends["until"] = self.ends_until.isoformat()
            if ends:
                d["ends"] = ends
        return d

    @classmethod
    def from_dict(cls, d: Mapping[str, Any]) -> Schedule:
        """Read the nested form produced by :meth:`to_dict`."""
        kind = d.get("kind", KIND_MANUAL)
        if kind == KIND_ONE_TIME:
            return cls(kind=KIND_ONE_TIME, due_date=parse_iso_date(d.get("due_date")))
        season = _sanitize_months(d.get("season_months"))
        ends_count, ends_until = _parse_ends(d.get("ends"))
        if kind == KIND_INTERVAL:
            return cls(
                kind=KIND_INTERVAL,
                every=d.get("every"),
                unit=d.get("unit") or "days",
                anchor=d.get("anchor") or "completion",
                season_months=season,
                ends_count=ends_count,
                ends_until=ends_until,
            )
        if kind == KIND_WEEKDAYS:
            return cls(
                kind=KIND_WEEKDAYS,
                weekdays=tuple(d.get("weekdays") or ()),
                offset_days=_sanitize_offset(d.get("offset")),
                season_months=season,
                ends_count=ends_count,
                ends_until=ends_until,
            )
        if kind == KIND_NTH_WEEKDAY:
            return cls(
                kind=KIND_NTH_WEEKDAY,
                nth=d.get("nth"),
                weekday=d.get("weekday"),
                months=tuple(d.get("months") or ()),
                offset_days=_sanitize_offset(d.get("offset")),
                season_months=season,
                ends_count=ends_count,
                ends_until=ends_until,
            )
        if kind == KIND_DAY_OF_MONTH:
            return cls(
                kind=KIND_DAY_OF_MONTH,
                day=_sanitize_day(d.get("day")),
                months=tuple(d.get("months") or ()),
                business=d.get("business") is True,
                offset_days=_sanitize_offset(d.get("offset")),
                season_months=season,
                ends_count=ends_count,
                ends_until=ends_until,
            )
        return cls(kind=KIND_MANUAL)

    @classmethod
    def parse(cls, task: Mapping[str, Any]) -> Schedule:
        """Build from a task dict — nested ``schedule`` if present, else the flat
        v2.6.x fields. The single read path during/after migration (and for old
        exports), so both formats are accepted forever."""
        nested = task.get("schedule")
        if isinstance(nested, Mapping):
            return cls.from_dict(nested)
        return cls.from_legacy(
            schedule_type=task.get("schedule_type"),
            interval_days=task.get("interval_days"),
            interval_unit=task.get("interval_unit"),
            interval_anchor=task.get("interval_anchor"),
            due_date=task.get("due_date"),
        )


def is_recurring(task: Mapping[str, Any]) -> bool:
    """True iff the task dict has a cycling schedule (interval or calendar kind).

    One-off and manual tasks don't re-arm; a recurring task gets a fresh cycle
    when its object is unarchived (D2) or resumed from a seasonal pause (N3).
    Single source for both — the websocket layer delegates here.
    """
    return Schedule.parse(task).kind in (
        KIND_INTERVAL,
        KIND_WEEKDAYS,
        KIND_NTH_WEEKDAY,
        KIND_DAY_OF_MONTH,
    )


# --- flat <-> nested adapters (Phase 3) ------------------------------------
#
# Readers that still speak the flat v2.6.x shape (the WS payload, export, CSV,
# the edit-form prefill) go through these so there is exactly one translation
# point. ``schedule_type`` is *derived*: sensors (a trigger) are orthogonal to
# the recurrence kind, so a triggered task reports "sensor_based" regardless of
# whether it also carries a safety interval.


FLAT_RECURRENCE_KEYS = (
    "schedule_type",
    "interval_days",
    "interval_unit",
    "interval_anchor",
    "due_date",
)


def normalize_task_storage(task: Mapping[str, Any]) -> dict[str, Any]:
    """Return a copy of ``task`` with its recurrence stored as nested ``schedule``.

    The single flat→nested writer used by the migration and by every persist
    path, so new and existing tasks converge on one storage shape. The flat
    recurrence keys are dropped; every other field is preserved exactly.
    Sensor-ness stays in ``trigger_config`` (the derived ``schedule_type`` is
    reconstructed on read by :func:`read_legacy_fields`).

    Overlays are resolved so an edit takes effect: when a caller copies a stored
    (nested) task and overlays flat fields — the options edit flow does exactly
    this — the present flat keys win, but any absent ones fall back to the
    existing nested schedule. So changing only ``interval_days`` keeps the unit
    (the issue #58 class) instead of silently resetting it to days.

    Idempotent: a pure-nested task (no flat keys) is returned unchanged.
    """
    out = dict(task)
    nested = out.get("schedule")
    if isinstance(nested, Mapping) and nested.get("kind") in _CALENDAR_KINDS:
        # Calendar kinds can't be expressed via the flat fields, so the nested
        # schedule is authoritative — keep it and drop any stray flat keys.
        for key in FLAT_RECURRENCE_KEYS:
            out.pop(key, None)
        return out
    has_flat = any(key in out for key in FLAT_RECURRENCE_KEYS)
    has_nested = isinstance(nested, Mapping)
    if has_nested and not has_flat:
        return out
    if not has_nested and not has_flat:
        out["schedule"] = Schedule(kind=KIND_MANUAL).to_dict()
        return out

    # Effective flat view: nested-derived base, overridden by present flat keys.
    merged = read_legacy_fields(out)  # nested-derived (hybrid) or flat (pure)
    for key in FLAT_RECURRENCE_KEYS:
        if key in out:
            merged[key] = out[key]
    schedule = Schedule.from_legacy(
        schedule_type=merged["schedule_type"],
        interval_days=merged["interval_days"],
        interval_unit=merged["interval_unit"],
        interval_anchor=merged["interval_anchor"],
        due_date=merged["due_date"],
    ).to_dict()

    # The flat fields can't express the nested-only interval extras (seasonal
    # window, finite-series end). When an edit overlays flat keys onto a task
    # that had them, carry them over so they aren't silently dropped — same
    # spirit as the #58 unit-preservation above. Only meaningful on recurring
    # kinds (from_legacy never yields one of these for one_time/manual).
    if has_nested and isinstance(nested, Mapping) and schedule.get("kind") not in (KIND_ONE_TIME, KIND_MANUAL):
        for extra in ("season_months", "ends"):
            if extra in nested and extra not in schedule:
                schedule[extra] = nested[extra]

    for key in FLAT_RECURRENCE_KEYS:
        out.pop(key, None)
    out["schedule"] = schedule
    return out


def legacy_schedule_type(schedule: Schedule, *, has_trigger: bool) -> str:
    """The v2.6.x ``schedule_type`` string for a Schedule + trigger presence.

    The calendar kinds have no v2.6.x equivalent, so they surface their own kind
    (``nth_weekday`` etc.); consumers that understand them read the nested
    ``schedule`` directly, the rest get a coarse but honest label.
    """
    if has_trigger:
        return "sensor_based"
    if schedule.kind == KIND_ONE_TIME:
        return "one_time"
    if schedule.kind == KIND_INTERVAL:
        return "time_based"
    if schedule.kind == KIND_MANUAL:
        return "manual"
    return schedule.kind


def read_legacy_fields(task: Mapping[str, Any]) -> dict[str, Any]:
    """The flat recurrence view of a task dict, accepting either storage shape.

    A flat (v2.6.x) task is returned field-for-field as stored — so existing
    readers are behaviour-identical until the data is actually migrated. A
    task with a nested ``schedule`` is translated back to the flat view its
    consumers expect (``interval_days`` carries the count, ``due_date`` the ISO
    string, etc.). Missing values use the long-standing flat defaults.
    """
    nested = task.get("schedule")
    if not isinstance(nested, Mapping):
        return {
            "schedule_type": task.get("schedule_type", "time_based"),
            "interval_days": task.get("interval_days"),
            "interval_unit": task.get("interval_unit", "days"),
            "interval_anchor": task.get("interval_anchor", "completion"),
            "due_date": task.get("due_date"),
        }
    sched = Schedule.from_dict(nested)
    return {
        "schedule_type": legacy_schedule_type(sched, has_trigger=bool(task.get("trigger_config"))),
        "interval_days": sched.every,
        "interval_unit": sched.unit,
        "interval_anchor": sched.anchor,
        "due_date": sched.due_date.isoformat() if sched.due_date else None,
    }
