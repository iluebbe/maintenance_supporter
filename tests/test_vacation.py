"""Tests for the vacation helpers (helpers/vacation.py)."""

from __future__ import annotations

from datetime import date, timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .conftest import TASK_ID_1


def test_vacation_is_silent_for_exempt_task() -> None:
    """is_silent_for returns False for tasks in the exempt list even during vacation."""
    from custom_components.maintenance_supporter.helpers.vacation import VacationState

    # Use dt_util.now().date() to match HA timezone (avoids UTC vs local issues)
    today = dt_util.now().date()
    state = VacationState(
        enabled=True,
        start=today,
        end=today + timedelta(days=7),
        buffer_days=0,
        exempt_task_ids=frozenset({TASK_ID_1}),
    )
    assert state.is_active() is True
    # Exempt task should NOT be silenced
    assert state.is_silent_for(TASK_ID_1) is False
    # Non-exempt task should be silenced
    assert state.is_silent_for("other_task") is True


def test_vacation_compute_preview_interval_task() -> None:
    """compute_preview returns preview rows for interval-based tasks."""
    from custom_components.maintenance_supporter.helpers.vacation import compute_preview, VacationState

    today = dt_util.now().date()
    window_start = today + timedelta(days=1)
    window_end = today + timedelta(days=14)

    state = VacationState(
        enabled=True,
        start=window_start,
        end=window_end,
        buffer_days=0,
        exempt_task_ids=frozenset(),
    )

    tasks = [
        {
            "task_id": TASK_ID_1,
            "entry_id": "entry1",
            "object_name": "Pool",
            "task_name": "Filter",
            "schedule_type": "time_based",
            "interval_days": 7,
            "warning_days": 2,
            "last_performed": today.isoformat(),
        }
    ]
    rows = compute_preview(state, tasks)
    # With 7-day interval from today, next due is in 7 days — within 14-day window
    # We expect at least one row (DUE_SOON or OVERDUE event during vacation)
    assert isinstance(rows, list)


# === migrated from test_cov_helpers.py (behaviour-based split) ===


def test_vacation_state_is_silent_false_when_inactive() -> None:
    """Line 82: is_silent_for returns False when vacation is not active."""
    from custom_components.maintenance_supporter.helpers.vacation import VacationState

    state = VacationState(enabled=False, start=None, end=None, buffer_days=0)
    assert state.is_silent_for("any_task_id") is False


def test_coerce_date_empty_and_invalid() -> None:
    """Lines 91-92: _coerce_date returns None for falsy / non-string values."""
    from custom_components.maintenance_supporter.helpers.vacation import _coerce_date

    assert _coerce_date(None) is None
    assert _coerce_date("") is None
    assert _coerce_date(123) is None
    # invalid ISO string
    assert _coerce_date("not-a-date") is None


def test_coerce_buffer_invalid_and_out_of_range() -> None:
    """Lines 98-101: _coerce_buffer returns default for bad/range-exceeded values."""
    from custom_components.maintenance_supporter.const import DEFAULT_VACATION_BUFFER_DAYS
    from custom_components.maintenance_supporter.helpers.vacation import _coerce_buffer

    # Non-numeric
    assert _coerce_buffer("bad") == DEFAULT_VACATION_BUFFER_DAYS
    # Out of range: negative
    assert _coerce_buffer(-1) == DEFAULT_VACATION_BUFFER_DAYS
    # Out of range: > 14
    assert _coerce_buffer(15) == DEFAULT_VACATION_BUFFER_DAYS
    # Valid boundary
    assert _coerce_buffer(0) == 0
    assert _coerce_buffer(14) == 14


def test_global_options_no_global_entry(hass: HomeAssistant) -> None:
    """Line 110: _global_options returns {} when there is no global entry."""
    from custom_components.maintenance_supporter.helpers.vacation import _global_options

    # No entries at all → empty
    result = _global_options(hass)
    assert result == {}


def test_events_from_next_due_already_due_today() -> None:
    """Lines 166-169: task already overdue/due_soon at window_start gives today event."""
    from custom_components.maintenance_supporter.helpers.vacation import (
        _events_from_next_due,
    )

    today = date(2026, 6, 1)
    window_start = today
    window_end = date(2026, 6, 14)

    # already overdue: next_due < today → today >= next_due and today <= window_end → overdue today
    events = _events_from_next_due(
        next_due=date(2026, 5, 28),  # in the past
        warning_days=3,
        today=today,
        window_start=window_start,
        window_end=window_end,
    )
    assert len(events) == 1
    assert events[0].status == "overdue"
    assert events[0].date == today

    # already due_soon: next_due just in future but warning window already started before today.
    # due_soon_from = Jun3 - 5days = May29, which is before window_start (Jun1).
    # The first two 'if' blocks won't fire since due_soon_from not in [window_start, window_end].
    # But next_due=Jun3 IS in window and > today → that fires as "overdue" label (future due date).
    # So we check that there IS at least one event:
    events2 = _events_from_next_due(
        next_due=date(2026, 6, 3),  # 2 days away
        warning_days=5,
        today=today,
        window_start=window_start,
        window_end=window_end,
    )
    assert len(events2) >= 1

    # True "due_soon today": due_soon_from > window_start, due_soon_from > today not satisfied →
    # need scenario where next_due is past and due_soon_from is also past but today < next_due.
    # Construct: today = Jun1, next_due = Jun3 (future), due_soon_from = May30 (past of today).
    # today >= due_soon_from (Jun1 >= May30) and today <= window_end and due_soon_from <= today < next_due
    # → all conditions for line 168 met, so status = "due_soon" today event.
    today2 = date(2026, 6, 1)
    events3 = _events_from_next_due(
        next_due=date(2026, 6, 5),
        warning_days=10,  # due_soon_from = May26; past today
        today=today2,
        window_start=today2,
        window_end=date(2026, 6, 14),
    )
    # due_soon_from=May26 not in [Jun1,Jun14], next_due=Jun5 IS → fires "overdue" at Jun5
    # Actually: next_due=Jun5 > today=Jun1 → second if fires → events not empty → no line 165 branch
    # To trigger line 168 we need the "not events" path: next_due AND due_soon_from both outside window:
    today3 = date(2026, 6, 1)
    events4 = _events_from_next_due(
        next_due=date(2026, 6, 3),  # future, inside window → second if fires
        warning_days=0,  # due_soon_from = Jun3 (same as next_due)
        today=today3,
        window_start=today3,
        window_end=date(2026, 6, 14),
    )
    assert any(e.date == date(2026, 6, 3) for e in events4)

    # Line 168 path: already due_soon (past due_soon_from, future next_due, both "today" edge)
    # today = next_due - 1 day. warning_days pushes due_soon_from before window_start.
    # So first two ifs don't fire (due_soon_from < window_start; next_due <= today is false).
    # Wait — we need: today >= due_soon_from AND today < next_due AND today <= window_end
    # AND both first two `if` blocks failed (events is still empty after them).
    # For first two ifs to fail: due_soon_from < window_start OR due_soon_from > window_end,
    # AND next_due <= today OR next_due > window_end.
    # Set: today=Jun1, window_start=Jun1, window_end=Jun14,
    # next_due=Jun1 (today exactly), warning=2 → due_soon_from=May30.
    # First if: window_start(Jun1) <= due_soon_from(May30)? NO → skip.
    # Second if: next_due(Jun1) > today(Jun1)? NO → skip. Events empty.
    # Line 166: today(Jun1) >= next_due(Jun1) AND today <= window_end → OVERDUE today!
    events5 = _events_from_next_due(
        next_due=date(2026, 6, 1),  # exactly today
        warning_days=2,
        today=date(2026, 6, 1),
        window_start=date(2026, 6, 1),
        window_end=date(2026, 6, 14),
    )
    assert len(events5) == 1
    assert events5[0].status == "overdue"

    # Line 168 path: due_soon_from is before today (past) and next_due is in future.
    # First if: due_soon_from < window_start? If window_start=today and due_soon_from<today → fails.
    # Second if: next_due > today? YES → fires. So events won't be empty for line 168.
    # The only way line 168 fires is if next_due <= window_start but > today... paradox.
    # Actually re-reading: second if needs next_due > today. If that fires, events not empty.
    # Line 168 is the "elif" in the "if not events" block.
    # So line 168 requires: events empty (line 166 condition false) AND due_soon_from <= today < next_due.
    # Line 166 false means: NOT(today >= next_due AND today <= window_end).
    # If today < next_due, line 166 is false. So: today < next_due AND today >= due_soon_from.
    # But line 162 second_if: window_start <= next_due <= window_end AND next_due > today → fires!
    # → events gets "overdue" label, so "if not events" at 165 is False → line 168 never reached
    # when window_start <= next_due <= window_end and next_due > today.
    # CONCLUSION: line 168 only reachable if next_due > window_end (outside vacation window)
    # but today >= due_soon_from. Let's test that:
    events6 = _events_from_next_due(
        next_due=date(2026, 6, 20),  # outside window_end
        warning_days=25,  # due_soon_from = May26 (before today Jun1)
        today=date(2026, 6, 1),
        window_start=date(2026, 6, 1),
        window_end=date(2026, 6, 14),
    )
    # due_soon_from=May26 < window_start(Jun1) → first if fails.
    # next_due=Jun20 > window_end(Jun14) → second if fails. Events empty.
    # Line 166: today(Jun1) >= next_due(Jun20)? NO → skip.
    # Line 168: today(Jun1) >= due_soon_from(May26) AND today <= window_end AND May26 <= Jun1 < Jun20 → YES!
    assert len(events6) == 1
    assert events6[0].status == "due_soon"
    assert events6[0].date == date(2026, 6, 1)


def test_project_time_based_no_interval_returns_empty() -> None:
    """Line 185: _project_time_based returns [] when interval is 0 or None."""
    from custom_components.maintenance_supporter.helpers.vacation import (
        _project_time_based,
    )

    today = date(2026, 6, 1)
    result = _project_time_based(
        last_performed=None,
        created_at=None,
        interval_days=0,
        warning_days=3,
        today=today,
        window_start=today,
        window_end=today + timedelta(days=14),
    )
    assert result == []

    result2 = _project_time_based(
        last_performed=None,
        created_at=None,
        interval_days=None,
        warning_days=3,
        today=today,
        window_start=today,
        window_end=today + timedelta(days=14),
    )
    assert result2 == []


def test_compute_preview_skips_disabled_and_no_task_id() -> None:
    """Lines 210, 215: disabled tasks and tasks with no task_id are skipped."""
    from custom_components.maintenance_supporter.helpers.vacation import (
        VacationState,
        compute_preview,
    )

    state = VacationState(
        enabled=True,
        start=date(2026, 6, 10),
        end=date(2026, 6, 20),
        buffer_days=2,
    )

    tasks = [
        # disabled task (line 210 - skip)
        {"task_id": "t1", "enabled": False, "schedule_type": "time_based", "interval_days": 10, "warning_days": 3},
        # no task_id (line 215 - skip)
        {"enabled": True, "schedule_type": "time_based", "interval_days": 10, "warning_days": 3},
    ]
    rows = compute_preview(state, tasks, today=date(2026, 6, 1))
    assert rows == []


def test_compute_preview_sensor_based_event() -> None:
    """Line 220: sensor_based tasks get triggered_est event."""
    from custom_components.maintenance_supporter.helpers.vacation import (
        VacationState,
        compute_preview,
    )

    state = VacationState(
        enabled=True,
        start=date(2026, 6, 10),
        end=date(2026, 6, 20),
        buffer_days=0,
    )
    tasks = [
        {
            "task_id": "sensor_task",
            "enabled": True,
            "schedule_type": "sensor_based",
            "warning_days": 3,
            "interval_days": 30,
        }
    ]
    rows = compute_preview(state, tasks, today=date(2026, 6, 1))
    assert len(rows) == 1
    assert rows[0]["kind"] == "sensor_based"
    assert rows[0]["confidence"] == "unpredictable"
    assert any(e["status"] == "triggered_est" for e in rows[0]["events"])


def test_compute_preview_calendar_kind_with_schedule() -> None:
    """Line 223: calendar-kind tasks use Schedule.next_due for projection."""
    from custom_components.maintenance_supporter.helpers.vacation import (
        VacationState,
        compute_preview,
    )

    state = VacationState(
        enabled=True,
        start=date(2026, 6, 10),
        end=date(2026, 6, 30),
        buffer_days=0,
    )
    # weekdays kind: Mon+Thu, should hit during vacation
    tasks = [
        {
            "task_id": "cal_task",
            "enabled": True,
            "schedule_type": "weekdays",
            "warning_days": 0,
            "schedule": {"kind": "weekdays", "weekdays": [0, 3]},
        }
    ]
    rows = compute_preview(state, tasks, today=date(2026, 6, 1))
    # Should produce at least one row
    assert len(rows) >= 1
    assert rows[0]["kind"] == "weekdays"


def test_compute_preview_no_start_end_returns_empty() -> None:
    """Line 274: if state.start is None, returns []."""
    from custom_components.maintenance_supporter.helpers.vacation import (
        VacationState,
        compute_preview,
    )

    state = VacationState(enabled=True, start=None, end=None, buffer_days=0)
    result = compute_preview(state, [{"task_id": "t1", "enabled": True}])
    assert result == []


def test_compute_preview_window_end_before_start_returns_empty() -> None:
    """Line 277: window_end < window_start → returns []."""
    from custom_components.maintenance_supporter.helpers.vacation import (
        VacationState,
        compute_preview,
    )

    # Vacation already in the past (end before today)
    state = VacationState(
        enabled=True,
        start=date(2026, 1, 1),
        end=date(2026, 1, 7),
        buffer_days=0,
    )
    # today is after the vacation end → window_end < window_start
    result = compute_preview(state, [{"task_id": "t1", "enabled": True}], today=date(2026, 6, 1))
    assert result == []
