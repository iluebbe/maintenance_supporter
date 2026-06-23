"""Tests for the date-recurrence helpers (helpers/dates.py)."""

from __future__ import annotations

from datetime import date


def test_next_weekday_in_set_unreachable_none() -> None:
    """Line 86: the 'return None' after the 7-day loop is unreachable for a
    non-empty set; verify non-empty set always returns a date."""
    from custom_components.maintenance_supporter.helpers.dates import (
        next_weekday_in_set,
    )

    # Non-empty set: always finds something within 7 days
    result = next_weekday_in_set(date(2026, 5, 20), (0, 1, 2, 3, 4, 5, 6), inclusive=True)
    assert result is not None

    # Empty set → returns None (line 80)
    result = next_weekday_in_set(date(2026, 5, 20), (), inclusive=True)
    assert result is None


def test_iter_months_wraps_year() -> None:
    """Lines 95-96: _iter_months month-wrap (month > 12 → year increment)."""
    from custom_components.maintenance_supporter.helpers.dates import _iter_months

    pairs = list(_iter_months(2026, 11, 4))
    assert pairs == [(2026, 11), (2026, 12), (2027, 1), (2027, 2)]


def test_next_day_of_month_exclusive_comparison() -> None:
    """Line 119: the 'candidate > ref' branch (inclusive=False) in next_day_of_month."""
    from custom_components.maintenance_supporter.helpers.dates import next_day_of_month

    # inclusive=False: ref day matches but is excluded; next month returned
    ref = date(2026, 6, 15)
    result = next_day_of_month(ref, 15, inclusive=False)
    assert result == date(2026, 7, 15)


def test_next_day_of_month_months_restriction_skip() -> None:
    """Line 136: months restriction causes skipping (the 'continue' branch)."""
    from custom_components.maintenance_supporter.helpers.dates import next_day_of_month

    # Only July allowed; starting from June
    result = next_day_of_month(date(2026, 6, 1), 10, months=(7,), inclusive=True)
    assert result == date(2026, 7, 10)


def test_interval_span_days_zero_for_nonpositive() -> None:
    """Line 141: interval_span_days returns 0 when n is zero or None."""
    from custom_components.maintenance_supporter.helpers.dates import interval_span_days

    assert interval_span_days(0) == 0
    assert interval_span_days(None) == 0
    assert interval_span_days(-5) == 0
    # Positive case
    assert interval_span_days(1, "months") > 28
