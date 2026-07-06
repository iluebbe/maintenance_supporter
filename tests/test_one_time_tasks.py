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


def test_vacation_preview_honors_interval_unit() -> None:
    """Vacation preview must project a 6-month task ~6 months out, not 6 days
    (it used `anchor + timedelta(days=interval_days)`). Audit follow-up."""
    from custom_components.maintenance_supporter.helpers.vacation import (
        _project_time_based,
    )

    today = date(2026, 5, 1)
    events = _project_time_based(
        last_performed=date(2026, 4, 1),
        created_at=None,
        interval_days=6,
        warning_days=7,
        today=today,
        window_start=today,
        window_end=date(2026, 12, 31),
        interval_unit="months",
    )
    # next_due = 2026-04-01 + 6 months = 2026-10-01 (not 2026-04-07).
    assert any(e.date == date(2026, 10, 1) and e.status == "overdue" for e in events)
    assert all(e.date != date(2026, 4, 7) for e in events)


def test_vacation_preview_projects_calendar_kind() -> None:
    """Calendar kinds (nth_weekday) are projected in the vacation preview via the
    nested schedule — previously gated to time_based and silently dropped."""
    from custom_components.maintenance_supporter.helpers.vacation import (
        VacationState,
        compute_preview,
    )

    today = date(2026, 5, 24)
    state = VacationState(
        enabled=True,
        start=date(2026, 6, 1),
        end=date(2026, 6, 30),
        buffer_days=0,
    )
    rows = compute_preview(
        state,
        [
            {
                "task_id": "t1",
                "entry_id": "e",
                "object_name": "Home",
                "task_name": "Smoke alarm",
                "schedule_type": "nth_weekday",
                "enabled": True,
                "schedule": {"kind": "nth_weekday", "nth": 1, "weekday": 5},
                "warning_days": 0,
                "created_at": "2026-05-24",
            }
        ],
        today=today,
    )

    assert len(rows) == 1
    assert rows[0]["kind"] == "nth_weekday"
    # 1st Saturday of June 2026 = June 6, inside the vacation window.
    assert any(e["date"] == "2026-06-06" for e in rows[0]["events"])


def test_interval_span_days_is_unit_aware() -> None:
    from custom_components.maintenance_supporter.helpers.dates import (
        interval_span_days,
    )

    assert interval_span_days(5, "days") == 5
    assert interval_span_days(2, "weeks") == 14
    assert 180 <= interval_span_days(6, "months") <= 184
    assert 364 <= interval_span_days(1, "years") <= 366
    assert interval_span_days(0, "months") == 0
    assert interval_span_days(None) == 0


def test_warning_window_not_capped_by_month_count() -> None:
    """#58 follow-up (alerts not working): a 6-month task with warning_days=14
    must flip to DUE_SOON ~10 days out. The warning window must use the real
    interval span, not min(14, interval_days=6) which left it OK at 11 days.
    """
    today = dt_util.now().date()
    # last_performed chosen so next_due ≈ today + 10 (inside the 14-day warning
    # window, but beyond the bare interval count of 6).
    last = add_interval(today + timedelta(days=10), -6, "months")
    t = MaintenanceTask(
        schedule_type=ScheduleType.TIME_BASED,
        interval_days=6,
        interval_unit="months",
        warning_days=14,
        interval_anchor="completion",
        last_performed=last.isoformat(),
    )
    assert t.days_until_due is not None
    assert 6 < t.days_until_due <= 14  # inside warning window, above raw count
    assert t.status == MaintenanceStatus.DUE_SOON


def test_warning_window_days_unit_unchanged() -> None:
    """Regression guard: short day-interval tasks still cap warning at the
    interval (a 3-day task shouldn't be permanently due-soon with warning 7)."""
    today = dt_util.now().date()
    t = MaintenanceTask(
        schedule_type=ScheduleType.TIME_BASED,
        interval_days=3,
        interval_unit="days",
        warning_days=7,
        interval_anchor="completion",
        last_performed=today.isoformat(),  # next_due = today + 3 → days=3
    )
    # span = 3 days, so effective warning = min(7, 3) = 3; days_until_due = 3 → due_soon
    assert t.days_until_due == 3
    assert t.status == MaintenanceStatus.DUE_SOON


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
    assert d["schedule"] == {"kind": "one_time", "due_date": "2026-12-01"}
    assert MaintenanceTask.from_dict(d).due_date == "2026-12-01"

    monthly = MaintenanceTask(schedule_type=ScheduleType.TIME_BASED, interval_days=2, interval_unit="months")
    dm = monthly.to_dict()
    assert dm["schedule"]["unit"] == "months"
    assert MaintenanceTask.from_dict(dm).interval_unit == "months"

    # Default unit (days) must NOT be serialized (lean nested dicts).
    plain = MaintenanceTask(schedule_type=ScheduleType.TIME_BASED, interval_days=7)
    assert "unit" not in plain.to_dict()["schedule"]


def test_model_next_due_calendar_kinds() -> None:
    """MaintenanceTask.from_dict(nested calendar schedule) → next_due computes.

    Regression for the gap the live E2E caught: from_dict flattened the nested
    schedule (read_legacy_fields → schedule_type=kind, interval_days=None) and
    _schedule() rebuilt via from_legacy → manual → next_due None. The model must
    keep schedule_raw and compute from it. First-time anchors on created_at, so
    these are deterministic. 2026-05-24 is a Sunday.
    """
    nth = MaintenanceTask.from_dict(
        {
            "id": "t1",
            "name": "Smoke alarm",
            "created_at": "2026-05-24",
            "schedule": {"kind": "nth_weekday", "nth": 1, "weekday": 5},
        }
    )
    assert nth.next_due == date(2026, 6, 6)  # May's 1st Sat passed → June 6
    assert nth.next_due.weekday() == 5

    dom = MaintenanceTask.from_dict(
        {
            "id": "t2",
            "name": "Rent",
            "created_at": "2026-05-24",
            "schedule": {"kind": "day_of_month", "day": 15},
        }
    )
    assert dom.next_due == date(2026, 6, 15)  # May 15 passed → June 15

    wd = MaintenanceTask.from_dict(
        {
            "id": "t3",
            "name": "Floors",
            "created_at": "2026-05-24",
            "schedule": {"kind": "weekdays", "weekdays": [0, 3]},
        }
    )
    assert wd.next_due == date(2026, 5, 25)  # next Mon on/after Sun 2026-05-24
