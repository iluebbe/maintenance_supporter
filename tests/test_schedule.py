"""Unit tests for the Schedule value object (helpers/schedule.py).

Phase 2 of docs/design/schedule-model-v2.md — the recurrence math extracted
from MaintenanceTask.next_due. These pin the strategy directly; the existing
model/coordinator tests are the behaviour-preserving net.
"""

from __future__ import annotations

from datetime import date
from typing import Any

from custom_components.maintenance_supporter.helpers.schedule import (
    KIND_DAY_OF_MONTH,
    KIND_INTERVAL,
    KIND_MANUAL,
    KIND_NTH_WEEKDAY,
    KIND_ONE_TIME,
    KIND_WEEKDAYS,
    Schedule,
    legacy_schedule_type,
    normalize_task_storage,
    read_legacy_fields,
)

from .conftest import TASK_ID_1

TODAY = date(2026, 5, 1)


# ─── from_legacy mapping ─────────────────────────────────────────────────


def test_from_legacy_one_time() -> None:
    s = Schedule.from_legacy(
        schedule_type="one_time",
        interval_days=None,
        interval_unit=None,
        interval_anchor=None,
        due_date="2026-09-01",
    )
    assert s.kind == KIND_ONE_TIME
    assert s.due_date == date(2026, 9, 1)


def test_from_legacy_interval() -> None:
    s = Schedule.from_legacy(
        schedule_type="time_based",
        interval_days=6,
        interval_unit="months",
        interval_anchor="planned",
        due_date=None,
    )
    assert s.kind == KIND_INTERVAL
    assert (s.every, s.unit, s.anchor) == (6, "months", "planned")


def test_from_legacy_manual_and_sensor_without_interval() -> None:
    for st in ("manual", "sensor_based", "time_based"):
        s = Schedule.from_legacy(
            schedule_type=st,
            interval_days=None,
            interval_unit="days",
            interval_anchor="completion",
            due_date=None,
        )
        assert s.kind == KIND_MANUAL


def test_from_legacy_sensor_with_safety_interval_is_interval() -> None:
    # A sensor task's safety interval drives next_due exactly like time_based.
    s = Schedule.from_legacy(
        schedule_type="sensor_based",
        interval_days=3,
        interval_unit="months",
        interval_anchor="completion",
        due_date=None,
    )
    assert s.kind == KIND_INTERVAL
    assert (s.every, s.unit) == (3, "months")


# ─── next_due ────────────────────────────────────────────────────────────


def _nd(s: Schedule, *, last=None, created=None, planned=None, today=TODAY):
    return s.next_due(last_performed=last, created_at=created, last_planned_due=planned, today=today)


def test_next_due_interval_days() -> None:
    s = Schedule(kind=KIND_INTERVAL, every=10, unit="days")
    assert _nd(s, last=date(2026, 5, 1)) == date(2026, 5, 11)


def test_next_due_interval_months_calendar() -> None:
    s = Schedule(kind=KIND_INTERVAL, every=6, unit="months")
    assert _nd(s, last=date(2026, 4, 1)) == date(2026, 10, 1)


def test_next_due_first_time_uses_created_at_then_today() -> None:
    s = Schedule(kind=KIND_INTERVAL, every=7, unit="days")
    assert _nd(s, last=None, created=date(2026, 4, 20)) == date(2026, 4, 27)
    assert _nd(s, last=None, created=None, today=date(2026, 5, 1)) == date(2026, 5, 8)


def test_next_due_planned_anchor_no_drift_days() -> None:
    # Planned for Mar 1, 30-day interval, completed late Mar 5 → next due Mar 31.
    s = Schedule(kind=KIND_INTERVAL, every=30, unit="days", anchor="planned")
    nd = _nd(s, last=date(2026, 3, 5), planned=date(2026, 3, 1))
    assert nd == date(2026, 3, 31)


def test_next_due_planned_anchor_months_loop() -> None:
    s = Schedule(kind=KIND_INTERVAL, every=1, unit="months", anchor="planned")
    # planned Jan 15, completed Apr 20 → next 1st-of-cycle after Apr 20 = May 15
    nd = _nd(s, last=date(2026, 4, 20), planned=date(2026, 1, 15))
    assert nd == date(2026, 5, 15)


def test_next_due_one_time_then_archived() -> None:
    s = Schedule(kind=KIND_ONE_TIME, due_date=date(2026, 9, 1))
    assert _nd(s, last=None) == date(2026, 9, 1)
    assert _nd(s, last=date(2026, 9, 1)) is None  # completed → archived
    assert _nd(Schedule(kind=KIND_ONE_TIME, due_date=None), last=None) is None


def test_next_due_manual_is_none() -> None:
    assert _nd(Schedule(kind=KIND_MANUAL), last=date(2026, 5, 1)) is None


# ─── span_days ───────────────────────────────────────────────────────────


def test_span_days_unit_aware() -> None:
    assert Schedule(kind=KIND_INTERVAL, every=7, unit="days").span_days() == 7
    assert Schedule(kind=KIND_INTERVAL, every=2, unit="weeks").span_days() == 14
    assert 180 <= Schedule(kind=KIND_INTERVAL, every=6, unit="months").span_days() <= 186
    assert Schedule(kind=KIND_MANUAL).span_days() == 0
    assert Schedule(kind=KIND_ONE_TIME, due_date=date(2026, 9, 1)).span_days() == 0


# ─── serialization (Phase 3) ─────────────────────────────────────────────


def test_to_dict_omits_defaults() -> None:
    assert Schedule(kind=KIND_INTERVAL, every=7).to_dict() == {
        "kind": "interval",
        "every": 7,
    }  # unit=days + anchor=completion omitted
    assert Schedule(kind=KIND_MANUAL).to_dict() == {"kind": "manual"}


def test_to_from_dict_roundtrip() -> None:
    for s in (
        Schedule(kind=KIND_INTERVAL, every=6, unit="months", anchor="planned"),
        Schedule(kind=KIND_INTERVAL, every=3, unit="weeks"),
        Schedule(kind=KIND_ONE_TIME, due_date=date(2026, 9, 1)),
        Schedule(kind=KIND_MANUAL),
    ):
        assert Schedule.from_dict(s.to_dict()) == s


def test_parse_prefers_nested_else_legacy() -> None:
    # nested
    nested = {"schedule": {"kind": "interval", "every": 6, "unit": "months"}}
    assert Schedule.parse(nested) == Schedule(kind=KIND_INTERVAL, every=6, unit="months")
    # legacy flat (no `schedule` key)
    legacy = {"schedule_type": "time_based", "interval_days": 6, "interval_unit": "months"}
    assert Schedule.parse(legacy) == Schedule(kind=KIND_INTERVAL, every=6, unit="months")
    # nested wins when both present
    both = {**legacy, "schedule": {"kind": "manual"}}
    assert Schedule.parse(both).kind == KIND_MANUAL


# ─── calendar kinds (Phase 4) ────────────────────────────────────────────


def test_weekdays_next_due() -> None:
    s = Schedule(kind=KIND_WEEKDAYS, weekdays=(0, 3))  # Mon & Thu
    # first-time: on/after today (Sun 2026-05-24 → Mon 2026-05-25)
    assert _nd(s, last=None, today=date(2026, 5, 24)) == date(2026, 5, 25)
    # after completion on Mon → next is Thu
    assert _nd(s, last=date(2026, 5, 25)) == date(2026, 5, 28)
    # empty set → None
    assert _nd(Schedule(kind=KIND_WEEKDAYS), last=None, today=date(2026, 5, 24)) is None


def test_nth_weekday_next_due() -> None:
    s = Schedule(kind=KIND_NTH_WEEKDAY, nth=1, weekday=5)  # 1st Saturday
    # May's 1st Sat (May 2) already passed by the 24th → June 6
    assert _nd(s, last=None, today=date(2026, 5, 24)) == date(2026, 6, 6)
    # after completion June 6 → July 4
    assert _nd(s, last=date(2026, 6, 6)) == date(2026, 7, 4)


def test_nth_weekday_last() -> None:
    s = Schedule(kind=KIND_NTH_WEEKDAY, nth=-1, weekday=5)  # last Saturday
    assert _nd(s, last=None, today=date(2026, 5, 1)) == date(2026, 5, 30)


def test_nth_weekday_5th_skips_months_without_one() -> None:
    # 5th Saturday: Feb/Mar/Apr 2026 have none; next is May 30.
    s = Schedule(kind=KIND_NTH_WEEKDAY, nth=5, weekday=5)
    assert _nd(s, last=None, today=date(2026, 2, 1)) == date(2026, 5, 30)


def test_nth_weekday_months_restriction() -> None:
    s = Schedule(kind=KIND_NTH_WEEKDAY, nth=1, weekday=5, months=(1, 7))
    assert _nd(s, last=None, today=date(2026, 5, 24)) == date(2026, 7, 4)


def test_day_of_month_next_due() -> None:
    s = Schedule(kind=KIND_DAY_OF_MONTH, day=15)
    # May 15 passed by the 24th → June 15
    assert _nd(s, last=None, today=date(2026, 5, 24)) == date(2026, 6, 15)
    assert _nd(s, last=date(2026, 6, 15)) == date(2026, 7, 15)


def test_day_of_month_clamps_to_month_length() -> None:
    s = Schedule(kind=KIND_DAY_OF_MONTH, day=31)
    assert _nd(s, last=date(2026, 1, 31)) == date(2026, 2, 28)


def test_calendar_span_days() -> None:
    assert Schedule(kind=KIND_WEEKDAYS, weekdays=(0,)).span_days() == 7
    assert Schedule(kind=KIND_NTH_WEEKDAY, nth=1, weekday=5).span_days() == 30
    assert Schedule(kind=KIND_DAY_OF_MONTH, day=15).span_days() == 30


def test_calendar_kinds_roundtrip() -> None:
    for s in (
        Schedule(kind=KIND_WEEKDAYS, weekdays=(0, 3)),
        Schedule(kind=KIND_NTH_WEEKDAY, nth=1, weekday=5),
        Schedule(kind=KIND_NTH_WEEKDAY, nth=-1, weekday=5, months=(1, 4, 7, 10)),
        Schedule(kind=KIND_DAY_OF_MONTH, day=15),
        Schedule(kind=KIND_DAY_OF_MONTH, day=31, months=(2,)),
    ):
        assert Schedule.from_dict(s.to_dict()) == s


def test_nth_weekday_smoke_alarm_worked_example() -> None:
    # design doc §6: {kind: nth_weekday, nth: 1, weekday: 5} — "1st Saturday"
    s = Schedule.from_dict({"kind": "nth_weekday", "nth": 1, "weekday": 5})
    nd = _nd(s, last=None, today=date(2026, 5, 24))
    assert nd == date(2026, 6, 6)
    assert nd.weekday() == 5  # a Saturday


def test_normalize_preserves_calendar_kind() -> None:
    # A calendar kind survives normalize even with a stray flat key — it can't
    # be rebuilt from the flat fields, so the nested schedule is authoritative.
    out = normalize_task_storage(
        {"schedule": {"kind": "nth_weekday", "nth": 1, "weekday": 5}, "schedule_type": "manual", "name": "Smoke alarm"}
    )
    assert out["schedule"] == {"kind": "nth_weekday", "nth": 1, "weekday": 5}
    assert "schedule_type" not in out
    assert out["name"] == "Smoke alarm"


def test_legacy_schedule_type_surfaces_calendar_kinds() -> None:
    assert legacy_schedule_type(Schedule(kind=KIND_NTH_WEEKDAY, nth=1, weekday=5), has_trigger=False) == "nth_weekday"
    assert legacy_schedule_type(Schedule(kind=KIND_WEEKDAYS, weekdays=(0,)), has_trigger=False) == "weekdays"


def test_legacy_to_nested_equivalence() -> None:
    # The migration path: from_legacy → to_dict → from_dict yields the same rule.
    legacy = Schedule.from_legacy(
        schedule_type="time_based",
        interval_days=6,
        interval_unit="months",
        interval_anchor="planned",
        due_date=None,
    )
    assert Schedule.from_dict(legacy.to_dict()) == legacy


# ─── flat <-> nested adapters (Phase 3.2) ────────────────────────────────


def test_legacy_schedule_type_derivation() -> None:
    # A trigger makes it sensor_based regardless of recurrence kind.
    assert legacy_schedule_type(Schedule(kind=KIND_INTERVAL, every=90), has_trigger=True) == "sensor_based"
    assert legacy_schedule_type(Schedule(kind=KIND_MANUAL), has_trigger=True) == "sensor_based"
    # Otherwise it follows the kind.
    assert legacy_schedule_type(Schedule(kind=KIND_INTERVAL, every=7), has_trigger=False) == "time_based"
    assert legacy_schedule_type(Schedule(kind=KIND_ONE_TIME), has_trigger=False) == "one_time"
    assert legacy_schedule_type(Schedule(kind=KIND_MANUAL), has_trigger=False) == "manual"


def test_read_legacy_fields_flat_passthrough() -> None:
    # A flat v2.6.x task is returned field-for-field (behaviour-preserving).
    flat = {
        "schedule_type": "time_based",
        "interval_days": 6,
        "interval_unit": "months",
        "interval_anchor": "planned",
        "due_date": None,
    }
    assert read_legacy_fields(flat) == flat
    # Missing values use the long-standing flat defaults.
    assert read_legacy_fields({}) == {
        "schedule_type": "time_based",
        "interval_days": None,
        "interval_unit": "days",
        "interval_anchor": "completion",
        "due_date": None,
    }


def test_read_legacy_fields_translates_nested() -> None:
    nested = {"schedule": {"kind": "interval", "every": 6, "unit": "months", "anchor": "planned"}}
    assert read_legacy_fields(nested) == {
        "schedule_type": "time_based",
        "interval_days": 6,
        "interval_unit": "months",
        "interval_anchor": "planned",
        "due_date": None,
    }
    # nested one_time → due_date echoed as ISO string
    assert read_legacy_fields({"schedule": {"kind": "one_time", "due_date": "2026-09-01"}})["due_date"] == "2026-09-01"
    # nested interval + trigger → sensor_based
    sensor = {"schedule": {"kind": "interval", "every": 90}, "trigger_config": {"type": "counter"}}
    assert read_legacy_fields(sensor)["schedule_type"] == "sensor_based"


# ─── normalize: no recurrence fields → manual ────────────────────────────


def test_schedule_normalize_no_fields_gives_manual() -> None:
    """normalize_task_storage on a task with no recurrence fields → manual kind."""
    from custom_components.maintenance_supporter.helpers.schedule import (
        normalize_task_storage,
        KIND_MANUAL,
    )

    task: dict[str, Any] = {
        "id": TASK_ID_1,
        "name": "Manual Task",
        "schedule_type": "manual",
    }
    result = normalize_task_storage(task)
    assert "schedule" in result
    assert result["schedule"]["kind"] == KIND_MANUAL


# === migrated from test_cov_helpers.py (behaviour-based split) ===


def test_next_due_interval_planned_anchor_months_loop() -> None:
    """Line 146: the 'return candidate' fallback after the loop exhausts MAX_PLANNED_STEPS."""
    from custom_components.maintenance_supporter.helpers.schedule import (
        KIND_INTERVAL,
        Schedule,
    )

    # planned anchor, months unit, late completion → candidate loop path
    s = Schedule(kind=KIND_INTERVAL, every=1, unit="months", anchor="planned")
    # planned Jan, completed Mar 20 → next May or beyond depending on loop
    result = s.next_due(
        last_performed=date(2026, 3, 20),
        created_at=None,
        last_planned_due=date(2026, 1, 15),
        today=date(2026, 3, 20),
    )
    assert result is not None and result > date(2026, 3, 20)


def test_calendar_occurrence_day_of_month_none_day() -> None:
    """Line 163/165: _calendar_occurrence returns None for KIND_DAY_OF_MONTH with day=None."""
    from custom_components.maintenance_supporter.helpers.schedule import (
        KIND_DAY_OF_MONTH,
        KIND_NTH_WEEKDAY,
        Schedule,
    )

    # day=None → _calendar_occurrence returns None (line 163)
    s = Schedule(kind=KIND_DAY_OF_MONTH, day=None)
    result = s.next_due(last_performed=None, created_at=None, last_planned_due=None, today=date(2026, 5, 1))
    assert result is None

    # nth=None → _calendar_occurrence returns None (line 157)
    s2 = Schedule(kind=KIND_NTH_WEEKDAY, nth=None, weekday=5)
    result2 = s2.next_due(last_performed=None, created_at=None, last_planned_due=None, today=date(2026, 5, 1))
    assert result2 is None


def test_schedule_next_due_kind_interval_zero_every() -> None:
    """Lines 125: every <= 0 returns None."""
    from custom_components.maintenance_supporter.helpers.schedule import (
        KIND_INTERVAL,
        Schedule,
    )

    s = Schedule(kind=KIND_INTERVAL, every=0)
    result = s.next_due(last_performed=None, created_at=None, last_planned_due=None, today=date(2026, 5, 1))
    assert result is None


def test_normalize_task_storage_strips_flat_keys() -> None:
    """Lines 304-305: normalize_task_storage removes flat recurrence keys."""
    from custom_components.maintenance_supporter.helpers.schedule import (
        FLAT_RECURRENCE_KEYS,
        normalize_task_storage,
    )

    task = {
        "schedule_type": "time_based",
        "interval_days": 30,
        "interval_unit": "days",
        "interval_anchor": "completion",
        "due_date": None,
        "name": "Test",
    }
    out = normalize_task_storage(task)
    # Should have a nested "schedule" key and flat keys removed
    assert "schedule" in out
    for key in FLAT_RECURRENCE_KEYS:
        assert key not in out
    assert out.get("name") == "Test"


# ─── Seasonal active window (season_months) ──────────────────────────────


def test_season_window_rolls_off_season_due_to_next_active_month() -> None:
    # Mow every 2 weeks, only Apr–Oct. A completion on Oct 25 would compute
    # Nov 8 (off-season) → roll to Apr 1 of the next year.
    s = Schedule(kind=KIND_INTERVAL, every=2, unit="weeks", season_months=(4, 5, 6, 7, 8, 9, 10))
    assert _nd(s, last=date(2026, 10, 25)) == date(2027, 4, 1)


def test_season_window_preserves_calendar_pattern() -> None:
    """#83: a '2nd Saturday' task with a Jan+Jul window must come due on the
    2nd SATURDAY of the active month — not on its 1st (the interval-kind
    roll). Chain two completions to cover both window months."""
    s = Schedule(kind=KIND_NTH_WEEKDAY, nth=2, weekday=5, season_months=(1, 7))
    # Completed on 2026-07-19 → next monthly pattern date (Aug) is off-season
    # → rolled into January, ON the pattern: Sat 2027-01-09.
    d1 = _nd(s, last=date(2026, 7, 19))
    assert d1 == date(2027, 1, 9)
    assert d1.weekday() == 5
    # And from there: Sat 2027-07-10.
    assert _nd(s, last=d1) == date(2027, 7, 10)


def test_season_window_calendar_pattern_missing_in_window_month() -> None:
    """A 5th-Tuesday task windowed to February: Feb 2027 has no 5th Tuesday,
    so the roll continues to the next window year — Feb 2028 (leap layout)
    HAS one: Tue 2028-02-29. Covers the keep-searching branch."""
    s = Schedule(kind=KIND_NTH_WEEKDAY, nth=5, weekday=1, season_months=(2,))
    assert _nd(s, last=date(2026, 12, 31)) == date(2028, 2, 29)


def test_season_window_calendar_falls_back_when_pattern_undefined() -> None:
    """A weekdays kind with an EMPTY weekday set can't produce an occurrence —
    the roll falls back to the window month's 1st instead of looping."""
    s = Schedule(kind=KIND_WEEKDAYS, weekdays=(), season_months=(4,))
    assert s._roll_to_season(date(2026, 11, 8)) == date(2027, 4, 1)


def test_season_window_keeps_in_season_due_untouched() -> None:
    s = Schedule(kind=KIND_INTERVAL, every=2, unit="weeks", season_months=(4, 5, 6, 7, 8, 9, 10))
    # A June completion → mid-July, still in season, unchanged.
    assert _nd(s, last=date(2026, 6, 20)) == date(2026, 7, 4)


def test_season_window_applies_to_first_time_anchor() -> None:
    # Created in December → first due rolls to the season start, not December.
    s = Schedule(kind=KIND_INTERVAL, every=1, unit="months", season_months=(4, 5, 6, 7, 8, 9, 10))
    assert _nd(s, last=None, today=date(2026, 12, 5)) == date(2027, 4, 1)


def test_season_window_does_not_touch_one_time() -> None:
    s = Schedule(kind=KIND_ONE_TIME, due_date=date(2026, 1, 15), season_months=(6, 7))
    assert _nd(s, last=None) == date(2026, 1, 15)


def test_season_window_round_trips_through_serialization() -> None:
    s = Schedule(kind=KIND_INTERVAL, every=1, unit="months", season_months=(4, 5, 6))
    d = s.to_dict()
    assert d["season_months"] == [4, 5, 6]
    back = Schedule.from_dict(d)
    assert back.season_months == (4, 5, 6)
    assert _nd(back, last=date(2026, 8, 1)) == date(2027, 4, 1)


def test_season_window_sanitizes_garbage_months() -> None:
    back = Schedule.from_dict({"kind": KIND_INTERVAL, "every": 1, "season_months": [0, 13, "x", 5, 5, True]})
    assert back.season_months == (5,)


def test_season_window_omitted_when_empty_or_wrong_kind() -> None:
    assert "season_months" not in Schedule(kind=KIND_INTERVAL, every=1).to_dict()
    assert "season_months" not in Schedule(kind=KIND_ONE_TIME, due_date=date(2026, 1, 1)).to_dict()


# ─── Finite series (ends: count / until) ─────────────────────────────────


def test_finite_series_ends_after_count() -> None:
    s = Schedule(kind=KIND_INTERVAL, every=1, unit="months", ends_count=3)
    common = {"created_at": None, "last_planned_due": None, "today": date(2026, 1, 1)}
    # 2 of 3 done → still re-arms.
    assert s.next_due(last_performed=date(2026, 3, 1), times_performed=2, **common) == date(2026, 4, 1)
    # 3 of 3 done → series exhausted, no next due.
    assert s.next_due(last_performed=date(2026, 3, 1), times_performed=3, **common) is None


def test_finite_series_ends_at_until_date() -> None:
    s = Schedule(kind=KIND_INTERVAL, every=1, unit="months", ends_until=date(2026, 6, 30))
    common = {"created_at": None, "last_planned_due": None, "today": date(2026, 1, 1), "times_performed": 5}
    # Next occurrence June 1 ≤ until → due.
    assert s.next_due(last_performed=date(2026, 5, 1), **common) == date(2026, 6, 1)
    # Next occurrence July 1 > until → series over.
    assert s.next_due(last_performed=date(2026, 6, 1), **common) is None


def test_finite_series_is_finite_flag_and_serialization() -> None:
    s = Schedule(kind=KIND_INTERVAL, every=2, unit="weeks", ends_count=6, ends_until=date(2027, 1, 1))
    assert s.is_finite() is True
    d = s.to_dict()
    assert d["ends"] == {"count": 6, "until": "2027-01-01"}
    back = Schedule.from_dict(d)
    assert back.ends_count == 6 and back.ends_until == date(2027, 1, 1)
    assert back.is_finite() is True


def test_finite_series_sanitizes_bad_ends() -> None:
    back = Schedule.from_dict({"kind": KIND_INTERVAL, "every": 1, "ends": {"count": 0, "until": "not-a-date"}})
    assert back.ends_count is None and back.ends_until is None
    assert back.is_finite() is False


def test_infinite_series_omits_ends_and_is_not_finite() -> None:
    s = Schedule(kind=KIND_INTERVAL, every=1)
    assert s.is_finite() is False
    assert "ends" not in s.to_dict()


# ─── Per-occurrence postpone (due_override) ──────────────────────────────


def test_due_override_postpones_current_cycle() -> None:
    s = Schedule(kind=KIND_INTERVAL, every=1, unit="months")
    common = {"created_at": None, "last_planned_due": None, "today": date(2026, 5, 1)}
    # Without an override the completion anchors the next due.
    assert s.next_due(last_performed=date(2026, 5, 1), **common) == date(2026, 6, 1)
    # With an override the current cycle is pushed to the chosen date.
    assert s.next_due(last_performed=date(2026, 5, 1), due_override=date(2026, 5, 20), **common) == date(2026, 5, 20)


def test_due_override_ignored_once_completed_past_it() -> None:
    s = Schedule(kind=KIND_INTERVAL, every=1, unit="months")
    common = {"created_at": None, "last_planned_due": None, "today": date(2026, 6, 1)}
    # Completed on/after the override date → the override is stale, normal cadence.
    assert s.next_due(last_performed=date(2026, 5, 25), due_override=date(2026, 5, 20), **common) == date(2026, 6, 25)


def test_due_override_works_before_first_completion() -> None:
    s = Schedule(kind=KIND_INTERVAL, every=1, unit="months")
    common = {"created_at": date(2026, 5, 1), "last_planned_due": None, "today": date(2026, 5, 1)}
    assert s.next_due(last_performed=None, due_override=date(2026, 5, 15), **common) == date(2026, 5, 15)


def test_next_due_planned_anchor_months_no_february_day_drift() -> None:
    """Planned monthly marching must multiply from the ORIGINAL anchor: the old
    iterative add let February clamp a day-31 anchor to 28 permanently
    (Jan 31 → Feb 28 → Mar 28 …). Jan 31 + 2 months is Mar 31 (bug audit
    2026-07-11)."""
    sched = Schedule.from_dict({"kind": "interval", "every": 1, "unit": "months", "anchor": "planned"})
    result = sched.next_due(
        last_performed=date(2026, 3, 5),  # late completion, two periods past
        created_at=date(2026, 1, 1),
        last_planned_due=date(2026, 1, 31),
        today=date(2026, 3, 5),
    )
    assert result == date(2026, 3, 31), f"February clamp dragged the anchor day: {result}"
