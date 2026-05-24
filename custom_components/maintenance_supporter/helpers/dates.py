"""Calendar-aware interval arithmetic (no external dependencies).

Used by the scheduling model so an interval can be expressed in days, weeks,
months, or years. Month/year steps are calendar-aware and clamp the day to the
target month's last day (e.g. Jan 31 + 1 month -> Feb 28/29), avoiding the
drift you get from approximating "monthly" as 30 days.
"""

from __future__ import annotations

import calendar
from datetime import date, timedelta

INTERVAL_UNITS = ("days", "weeks", "months", "years")


def parse_iso_date(value: str | None) -> date | None:
    """ISO date string → ``date``; ``None`` when absent or malformed."""
    if not value:
        return None
    try:
        return date.fromisoformat(value)
    except (ValueError, TypeError):
        return None


def _add_months(anchor: date, months: int) -> date:
    """Advance ``anchor`` by ``months`` calendar months, clamping the day."""
    total = anchor.month - 1 + months
    year = anchor.year + total // 12
    month = total % 12 + 1
    last_day = calendar.monthrange(year, month)[1]
    return date(year, month, min(anchor.day, last_day))


def add_interval(anchor: date, n: int, unit: str = "days") -> date:
    """Return ``anchor`` advanced by ``n`` of ``unit``.

    ``unit`` is one of days / weeks / months / years; anything else (or None)
    falls back to days, which keeps existing day-based tasks working unchanged.
    """
    if unit == "weeks":
        return anchor + timedelta(weeks=n)
    if unit == "months":
        return _add_months(anchor, n)
    if unit == "years":
        return _add_months(anchor, n * 12)
    return anchor + timedelta(days=n)


def nth_weekday_of_month(
    year: int, month: int, nth: int, weekday: int
) -> date | None:
    """The ``nth`` ``weekday`` of ``(year, month)``; ``None`` if it doesn't exist.

    ``weekday`` is 0=Mon … 6=Sun (``date.weekday()``). ``nth`` is 1..5, or -1 for
    the last occurrence. A 5th occurrence that the month doesn't have → ``None``.
    """
    last_day = calendar.monthrange(year, month)[1]
    if nth == -1:
        anchor = date(year, month, last_day)
        return anchor - timedelta(days=(anchor.weekday() - weekday) % 7)
    first = date(year, month, 1)
    day = 1 + (weekday - first.weekday()) % 7 + (nth - 1) * 7
    if day > last_day:
        return None
    return date(year, month, day)


def next_weekday_in_set(
    ref: date, weekdays: tuple[int, ...], *, inclusive: bool
) -> date | None:
    """Next date on/after ``ref`` whose weekday is in ``weekdays`` (0=Mon…6=Sun).

    ``inclusive`` includes ``ref`` itself; otherwise the search starts the next
    day. ``None`` when ``weekdays`` is empty.
    """
    if not weekdays:
        return None
    start = ref if inclusive else ref + timedelta(days=1)
    for offset in range(7):
        candidate = start + timedelta(days=offset)
        if candidate.weekday() in weekdays:
            return candidate
    return None  # unreachable for a non-empty set


def _iter_months(year: int, month: int, limit: int = 60):
    """Yield ``(year, month)`` forward from the given month, ``limit`` times."""
    for _ in range(limit):
        yield year, month
        month += 1
        if month > 12:
            month = 1
            year += 1


def next_nth_weekday(
    ref: date,
    nth: int,
    weekday: int,
    months: tuple[int, ...] | None = None,
    *,
    inclusive: bool,
) -> date | None:
    """Next ``nth``-``weekday``-of-month occurrence on/after ``ref``.

    Optionally restricted to ``months`` (1=Jan…12=Dec). ``None`` if no occurrence
    is found within a bounded horizon (e.g. a 5th weekday restricted to a month
    that never has one).
    """
    for year, month in _iter_months(ref.year, ref.month):
        if months and month not in months:
            continue
        occ = nth_weekday_of_month(year, month, nth, weekday)
        if occ is not None and (occ >= ref if inclusive else occ > ref):
            return occ
    return None


def next_day_of_month(
    ref: date,
    day: int,
    months: tuple[int, ...] | None = None,
    *,
    inclusive: bool,
) -> date | None:
    """Next ``day``-of-month occurrence on/after ``ref`` (day clamped to month).

    ``day`` 1..31 is clamped to the month's length (e.g. 31 → Feb 28/29).
    Optionally restricted to ``months``.
    """
    for year, month in _iter_months(ref.year, ref.month):
        if months and month not in months:
            continue
        clamped = min(day, calendar.monthrange(year, month)[1])
        candidate = date(year, month, clamped)
        if candidate >= ref if inclusive else candidate > ref:
            return candidate
    return None


def interval_span_days(n: int | None, unit: str = "days") -> int:
    """Length of one ``n``-``unit`` interval in days, calendar-aware.

    Measured as the distance from a fixed reference date to that date advanced
    by the interval, so months/years reflect real calendar lengths instead of
    the raw count. Used so things like the warning window aren't capped by the
    bare interval *count* for month/year tasks (issue #58/#59 — a 6-month task
    must not collapse a 14-day warning to ``min(14, 6)``). Returns 0 when there
    is no positive interval.
    """
    if not n or n <= 0:
        return 0
    ref = date(2001, 1, 1)  # common (non-leap) year; representative span
    return (add_interval(ref, n, unit) - ref).days
