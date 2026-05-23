"""Tests for one-time tasks + calendar intervals (weeks/months/years).

Source: forum thread 995556 (@Michael_Dahl, @brunkj) and #54. Pins the model
logic — one-shot tasks archive on completion (no re-arm), and intervals honour
``interval_unit`` with calendar-aware month/year arithmetic.
"""

from __future__ import annotations

from datetime import date, timedelta

from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import (
    MaintenanceStatus,
    ScheduleType,
)
from custom_components.maintenance_supporter.helpers.dates import add_interval
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)

# ─── add_interval helper ─────────────────────────────────────────────────


def test_add_interval_days_and_weeks() -> None:
    a = date(2026, 1, 1)
    assert add_interval(a, 10, "days") == date(2026, 1, 11)
    assert add_interval(a, 2, "weeks") == date(2026, 1, 15)
    assert add_interval(a, 5) == date(2026, 1, 6)  # default unit = days


def test_add_interval_months_clamps_day() -> None:
    assert add_interval(date(2026, 1, 31), 1, "months") == date(2026, 2, 28)
    assert add_interval(date(2024, 1, 31), 1, "months") == date(2024, 2, 29)  # leap
    assert add_interval(date(2026, 12, 15), 1, "months") == date(2027, 1, 15)  # yr roll
    assert add_interval(date(2026, 1, 15), 13, "months") == date(2027, 2, 15)


def test_add_interval_years_clamps_leap_day() -> None:
    assert add_interval(date(2026, 3, 1), 1, "years") == date(2027, 3, 1)
    assert add_interval(date(2024, 2, 29), 1, "years") == date(2025, 2, 28)


# ─── one-time tasks ──────────────────────────────────────────────────────


def test_one_time_due_soon_before_completion() -> None:
    due = (dt_util.now().date() + timedelta(days=5)).isoformat()
    t = MaintenanceTask(schedule_type=ScheduleType.ONE_TIME, due_date=due)
    assert t.next_due == date.fromisoformat(due)
    assert t.days_until_due == 5
    assert t.status == MaintenanceStatus.DUE_SOON  # within default 7-day warning
    assert t.is_done is False


def test_one_time_overdue() -> None:
    due = (dt_util.now().date() - timedelta(days=2)).isoformat()
    t = MaintenanceTask(schedule_type=ScheduleType.ONE_TIME, due_date=due)
    assert t.status == MaintenanceStatus.OVERDUE
    assert t.is_done is False


def test_one_time_archived_after_completion_no_rearm() -> None:
    due = (dt_util.now().date() - timedelta(days=2)).isoformat()
    t = MaintenanceTask(
        schedule_type=ScheduleType.ONE_TIME,
        due_date=due,
        last_performed=dt_util.now().date().isoformat(),
    )
    assert t.next_due is None  # done → never re-arms
    assert t.status == MaintenanceStatus.OK
    assert t.is_done is True


def test_one_time_without_due_date_is_ok() -> None:
    t = MaintenanceTask(schedule_type=ScheduleType.ONE_TIME)
    assert t.next_due is None
    assert t.status == MaintenanceStatus.OK
    assert t.is_done is False


# ─── calendar intervals ──────────────────────────────────────────────────


def test_days_interval_unchanged() -> None:
    t = MaintenanceTask(
        schedule_type=ScheduleType.TIME_BASED,
        interval_days=30,
        last_performed="2026-01-01",
    )
    assert t.next_due == date(2026, 1, 31)


def test_monthly_interval_next_due() -> None:
    t = MaintenanceTask(
        schedule_type=ScheduleType.TIME_BASED,
        interval_days=1,
        interval_unit="months",
        last_performed="2026-01-31",
    )
    assert t.next_due == date(2026, 2, 28)


def test_yearly_interval_next_due() -> None:
    t = MaintenanceTask(
        schedule_type=ScheduleType.TIME_BASED,
        interval_days=1,
        interval_unit="years",
        last_performed="2026-03-01",
    )
    assert t.next_due == date(2027, 3, 1)


def test_planned_anchor_months_no_drift() -> None:
    # Planned monthly: anchor Jan 15, completed late on Feb 20 → next due Mar 15.
    t = MaintenanceTask(
        schedule_type=ScheduleType.TIME_BASED,
        interval_days=1,
        interval_unit="months",
        interval_anchor="planned",
        last_planned_due="2026-01-15",
        last_performed="2026-02-20",
    )
    assert t.next_due == date(2026, 3, 15)


# ─── serialization round-trip ────────────────────────────────────────────


def test_serialization_roundtrip_new_fields() -> None:
    one = MaintenanceTask(schedule_type=ScheduleType.ONE_TIME, due_date="2026-12-01")
    d = one.to_dict()
    assert d["schedule_type"] == "one_time"
    assert d["due_date"] == "2026-12-01"
    assert MaintenanceTask.from_dict(d).due_date == "2026-12-01"

    monthly = MaintenanceTask(
        schedule_type=ScheduleType.TIME_BASED, interval_days=2, interval_unit="months"
    )
    dm = monthly.to_dict()
    assert dm["interval_unit"] == "months"
    assert MaintenanceTask.from_dict(dm).interval_unit == "months"

    # Default unit (days) must NOT be serialized (back-compat / lean dicts).
    plain = MaintenanceTask(schedule_type=ScheduleType.TIME_BASED, interval_days=7)
    assert "interval_unit" not in plain.to_dict()
