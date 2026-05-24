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

from dataclasses import dataclass
from datetime import date, timedelta

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
