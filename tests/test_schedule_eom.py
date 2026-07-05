"""End-of-month scheduling + occurrence offset (#83).

``day_of_month`` gains ``day = -1`` (last day of the month) and a ``business``
flag (weekend dates roll back to Friday); every calendar kind gains a ±N-day
``offset``. Verified dates (2027-01: Jan 1 is a Friday → Jan 29 = Fri,
Jan 30 = Sat, Jan 31 = Sun; 2027-02: Feb 28 = Sunday, Feb 26 = Friday).
"""

from __future__ import annotations

from datetime import date

from custom_components.maintenance_supporter.config_flow_helpers import (
    calendar_current,
    schedule_from_calendar_input,
)
from custom_components.maintenance_supporter.helpers.dates import (
    next_day_of_month,
    roll_back_to_business_day,
)
from custom_components.maintenance_supporter.helpers.schedule import (
    KIND_DAY_OF_MONTH,
    Schedule,
)


def _next(sched: Schedule, *, last: date | None, today: date) -> date | None:
    return sched.next_due(
        last_performed=last, created_at=today, last_planned_due=None, today=today,
    )


# ─── dates.py primitives ────────────────────────────────────────────────────


def test_next_day_of_month_last_day() -> None:
    # -1 = last day; February resolves to the 28th (2027 is not a leap year).
    assert next_day_of_month(date(2027, 1, 5), -1, inclusive=True) == date(2027, 1, 31)
    assert next_day_of_month(date(2027, 2, 1), -1, inclusive=True) == date(2027, 2, 28)
    # Past this month's last day → next month's.
    assert next_day_of_month(date(2027, 1, 31), -1, inclusive=False) == date(2027, 2, 28)


def test_roll_back_to_business_day() -> None:
    assert roll_back_to_business_day(date(2027, 1, 31)) == date(2027, 1, 29)  # Sun → Fri
    assert roll_back_to_business_day(date(2027, 1, 30)) == date(2027, 1, 29)  # Sat → Fri
    assert roll_back_to_business_day(date(2027, 1, 29)) == date(2027, 1, 29)  # Fri stays


# ─── Schedule.next_due with the new options ─────────────────────────────────


def test_last_day_of_month_schedule() -> None:
    sched = Schedule.from_dict({"kind": KIND_DAY_OF_MONTH, "day": -1})
    assert _next(sched, last=None, today=date(2027, 1, 5)) == date(2027, 1, 31)
    # After completing on the 31st, the next cycle is February's last day.
    assert _next(sched, last=date(2027, 1, 31), today=date(2027, 1, 31)) == date(2027, 2, 28)


def test_last_business_day_rolls_weekend_back() -> None:
    sched = Schedule.from_dict({"kind": KIND_DAY_OF_MONTH, "day": -1, "business": True})
    # Jan 31 2027 is a Sunday → due Friday Jan 29.
    assert _next(sched, last=None, today=date(2027, 1, 5)) == date(2027, 1, 29)
    # Feb 28 2027 is a Sunday → Friday Feb 26.
    assert _next(sched, last=date(2027, 1, 29), today=date(2027, 1, 29)) == date(2027, 2, 26)


def test_business_rollback_before_ref_advances_to_next_month() -> None:
    # On Saturday Jan 30 the rolled-back candidate (Fri 29) is already past →
    # the schedule must yield February's occurrence, not a stale date.
    sched = Schedule.from_dict({"kind": KIND_DAY_OF_MONTH, "day": -1, "business": True})
    assert _next(sched, last=None, today=date(2027, 1, 30)) == date(2027, 2, 26)


def test_negative_offset_two_days_before_last_business_day() -> None:
    # The exact #83 example: "two days before the last working day".
    sched = Schedule.from_dict(
        {"kind": KIND_DAY_OF_MONTH, "day": -1, "business": True, "offset": -2}
    )
    # Last business day Jan 2027 = Fri 29 → minus 2 = Wed 27.
    assert _next(sched, last=None, today=date(2027, 1, 5)) == date(2027, 1, 27)
    # Completing on the effective date advances a full cycle (Feb 26 − 2 = 24).
    assert _next(sched, last=date(2027, 1, 27), today=date(2027, 1, 27)) == date(2027, 2, 24)


def test_positive_offset_crosses_month_boundary() -> None:
    # Last day +2 lands on the 2nd of the following month.
    sched = Schedule.from_dict({"kind": KIND_DAY_OF_MONTH, "day": -1, "offset": 2})
    assert _next(sched, last=None, today=date(2027, 1, 5)) == date(2027, 2, 2)


def test_offset_on_weekdays_kind() -> None:
    # Offsets apply to every calendar kind. Mondays (0) − 1 day = Sundays.
    sched = Schedule.from_dict({"kind": "weekdays", "weekdays": [0], "offset": -1})
    # Mon 2027-01-11 → effective Sun 2027-01-10 (first on/after Jan 5).
    assert _next(sched, last=None, today=date(2027, 1, 5)) == date(2027, 1, 10)


# ─── Serialization round-trip + sanitising ──────────────────────────────────


def test_to_dict_roundtrip_keeps_new_fields() -> None:
    d = {"kind": KIND_DAY_OF_MONTH, "day": -1, "business": True, "offset": -2}
    sched = Schedule.from_dict(d)
    assert sched.to_dict() == d
    # Defaults are omitted from storage.
    plain = Schedule.from_dict({"kind": KIND_DAY_OF_MONTH, "day": 15})
    assert plain.to_dict() == {"kind": KIND_DAY_OF_MONTH, "day": 15}


def test_from_dict_sanitises_bogus_values() -> None:
    s = Schedule.from_dict({"kind": KIND_DAY_OF_MONTH, "day": 99, "offset": 400})
    assert s.day is None  # invalid day dropped
    assert s.offset_days == 15  # clamped
    s2 = Schedule.from_dict({"kind": KIND_DAY_OF_MONTH, "day": -1, "offset": -99,
                             "business": "yes"})
    assert s2.day == -1
    assert s2.offset_days == -15
    assert s2.business is False  # only literal True enables it


# ─── Config-flow helpers ────────────────────────────────────────────────────


def test_flow_input_builds_last_business_day_with_offset() -> None:
    schedule = schedule_from_calendar_input(KIND_DAY_OF_MONTH, {
        "day": 15, "last_day": True, "business": True, "offset": -2,
    })
    assert schedule == {"kind": KIND_DAY_OF_MONTH, "day": -1, "business": True, "offset": -2}


def test_flow_input_plain_day_unchanged() -> None:
    schedule = schedule_from_calendar_input(KIND_DAY_OF_MONTH, {"day": 15})
    assert schedule == {"kind": KIND_DAY_OF_MONTH, "day": 15}


def test_flow_prefill_reflects_stored_schedule() -> None:
    cur = calendar_current({
        "schedule": {"kind": KIND_DAY_OF_MONTH, "day": -1, "business": True, "offset": -2},
    })
    assert cur["last_day"] is True
    assert cur["business"] is True
    assert cur["offset"] == -2
    assert cur["day"] == 1  # the number field falls back to a sane default
