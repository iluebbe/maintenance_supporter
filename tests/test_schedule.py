"""Unit tests for the Schedule value object (helpers/schedule.py).

Phase 2 of docs/design/schedule-model-v2.md — the recurrence math extracted
from MaintenanceTask.next_due. These pin the strategy directly; the existing
model/coordinator tests are the behaviour-preserving net.
"""

from __future__ import annotations

from datetime import date

from custom_components.maintenance_supporter.helpers.schedule import (
    KIND_INTERVAL,
    KIND_MANUAL,
    KIND_ONE_TIME,
    Schedule,
)

TODAY = date(2026, 5, 1)


# ─── from_legacy mapping ─────────────────────────────────────────────────


def test_from_legacy_one_time() -> None:
    s = Schedule.from_legacy(
        schedule_type="one_time", interval_days=None, interval_unit=None,
        interval_anchor=None, due_date="2026-09-01",
    )
    assert s.kind == KIND_ONE_TIME
    assert s.due_date == date(2026, 9, 1)


def test_from_legacy_interval() -> None:
    s = Schedule.from_legacy(
        schedule_type="time_based", interval_days=6, interval_unit="months",
        interval_anchor="planned", due_date=None,
    )
    assert s.kind == KIND_INTERVAL
    assert (s.every, s.unit, s.anchor) == (6, "months", "planned")


def test_from_legacy_manual_and_sensor_without_interval() -> None:
    for st in ("manual", "sensor_based", "time_based"):
        s = Schedule.from_legacy(
            schedule_type=st, interval_days=None, interval_unit="days",
            interval_anchor="completion", due_date=None,
        )
        assert s.kind == KIND_MANUAL


def test_from_legacy_sensor_with_safety_interval_is_interval() -> None:
    # A sensor task's safety interval drives next_due exactly like time_based.
    s = Schedule.from_legacy(
        schedule_type="sensor_based", interval_days=3, interval_unit="months",
        interval_anchor="completion", due_date=None,
    )
    assert s.kind == KIND_INTERVAL
    assert (s.every, s.unit) == (3, "months")


# ─── next_due ────────────────────────────────────────────────────────────

def _nd(s: Schedule, *, last=None, created=None, planned=None, today=TODAY):
    return s.next_due(last_performed=last, created_at=created,
                      last_planned_due=planned, today=today)


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
        "kind": "interval", "every": 7,
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


def test_legacy_to_nested_equivalence() -> None:
    # The migration path: from_legacy → to_dict → from_dict yields the same rule.
    legacy = Schedule.from_legacy(
        schedule_type="time_based", interval_days=6, interval_unit="months",
        interval_anchor="planned", due_date=None,
    )
    assert Schedule.from_dict(legacy.to_dict()) == legacy
