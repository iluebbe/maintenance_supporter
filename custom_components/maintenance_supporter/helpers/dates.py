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
