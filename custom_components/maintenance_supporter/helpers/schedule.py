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

from .dates import add_interval, interval_span_days, parse_iso_date

# Recurrence kinds. Phase 2 covers the v2.6.x set; weekdays / nth_weekday /
# day_of_month arrive with the roadmap feature (Phase 4).
KIND_INTERVAL = "interval"
KIND_ONE_TIME = "one_time"
KIND_MANUAL = "manual"

# Planned-anchor month/year stepping is bounded to avoid an unbounded loop on
# absurd data (a task untouched for >2000 cycles falls back to the last step).
_MAX_PLANNED_STEPS = 2000


@dataclass(frozen=True)
class Schedule:
    """A task's time recurrence. Triggers (sensors) are orthogonal and handled
    by the coordinator's status precedence, not here."""

    kind: str = KIND_MANUAL
    every: int | None = None          # interval count (legacy: interval_days)
    unit: str = "days"                # days | weeks | months | years
    anchor: str = "completion"        # completion | planned
    due_date: date | None = None      # one_time

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

    def next_due(
        self,
        *,
        last_performed: date | None,
        created_at: date | None,
        last_planned_due: date | None,
        today: date,
    ) -> date | None:
        """The next due date, or None for manual / archived one-time tasks."""
        if self.kind == KIND_ONE_TIME:
            # Due on the fixed date; archived (no re-arm) once completed.
            if last_performed is not None or self.due_date is None:
                return None
            return self.due_date

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

    def span_days(self) -> int:
        """Approximate length of one cycle in days (0 when there is no interval).

        For progress bars and the due-soon warning cap — unit-aware, so a
        6-month task is ~183 days, not 6.
        """
        if self.kind == KIND_INTERVAL:
            return interval_span_days(self.every, self.unit)
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
        return d

    @classmethod
    def from_dict(cls, d: Mapping[str, Any]) -> Schedule:
        """Read the nested form produced by :meth:`to_dict`."""
        kind = d.get("kind", KIND_MANUAL)
        if kind == KIND_ONE_TIME:
            return cls(kind=KIND_ONE_TIME, due_date=parse_iso_date(d.get("due_date")))
        if kind == KIND_INTERVAL:
            return cls(
                kind=KIND_INTERVAL,
                every=d.get("every"),
                unit=d.get("unit") or "days",
                anchor=d.get("anchor") or "completion",
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
    has_flat = any(key in out for key in FLAT_RECURRENCE_KEYS)
    has_nested = isinstance(out.get("schedule"), Mapping)
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

    for key in FLAT_RECURRENCE_KEYS:
        out.pop(key, None)
    out["schedule"] = schedule
    return out


def legacy_schedule_type(schedule: Schedule, *, has_trigger: bool) -> str:
    """The v2.6.x ``schedule_type`` string for a Schedule + trigger presence."""
    if has_trigger:
        return "sensor_based"
    if schedule.kind == KIND_ONE_TIME:
        return "one_time"
    if schedule.kind == KIND_INTERVAL:
        return "time_based"
    return "manual"


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
        "schedule_type": legacy_schedule_type(
            sched, has_trigger=bool(task.get("trigger_config"))
        ),
        "interval_days": sched.every,
        "interval_unit": sched.unit,
        "interval_anchor": sched.anchor,
        "due_date": sched.due_date.isoformat() if sched.due_date else None,
    }
