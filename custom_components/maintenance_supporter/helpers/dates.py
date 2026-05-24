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
