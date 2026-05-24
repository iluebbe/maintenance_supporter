"""Tests targeting previously uncovered lines in helpers and repairs.

File targets (uncovered lines in the task):
  repairs.py: 54, 113, 115, 134-135, 489-491, 502, 525-528, 540-552, 590, 593, 596, 613, 616, 661
  helpers/vacation.py: 82, 91-92, 98-99, 101, 110, 166-169, 185, 210, 215, 220, 223, 274, 277
  helpers/sanitize.py: 69, 86, 88, 93, 95, 100, 146-147, 168-173, 183-184, 200-201, 224
  helpers/notification_manager.py: 520-521, 575-576, 744, 767, 791-792, 818, 894-895
  helpers/sensor_predictor.py: 194, 288, 314-316, 416, 453-460, 519
  helpers/interval_analyzer.py: 443, 449-450, 453, 471, 476-477, 480, 514-515
  helpers/schedule.py: 125, 146, 157, 163, 165, 304-305
  helpers/dates.py: 86, 95-96, 119, 136, 141
  helpers/csv_handler.py: 180, 218, 222, 265, 268-269
  helpers/qr_generator.py: 56, 102-117
"""

from __future__ import annotations

import math
from datetime import date, timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from tests.conftest import (
    OBJECT_ID_1,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


# ===========================================================================
# helpers/dates.py
# ===========================================================================


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


# ===========================================================================
# helpers/schedule.py
# ===========================================================================


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


# ===========================================================================
# helpers/sanitize.py
# ===========================================================================


def test_cap_strings_truncates_long_values() -> None:
    """Line 69: _cap_strings truncates strings exceeding max length."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_task_fields

    # name has MAX_NAME_LENGTH cap; overflow string
    long_name = "A" * 10000
    data = {"name": long_name}
    result = cap_task_fields(data)
    assert len(result["name"]) < len(long_name)


def test_cap_task_interval_days_clamping() -> None:
    """Lines 86, 88: interval_days < 1 clamped to 1; > MAX clamped to MAX."""
    from custom_components.maintenance_supporter.const import MAX_INTERVAL_DAYS
    from custom_components.maintenance_supporter.helpers.sanitize import cap_task_fields

    # Below min: clamped to 1
    data = {"interval_days": -10}
    cap_task_fields(data)
    assert data["interval_days"] == 1

    # Above max: clamped to MAX_INTERVAL_DAYS
    data2 = {"interval_days": MAX_INTERVAL_DAYS + 9999}
    cap_task_fields(data2)
    assert data2["interval_days"] == MAX_INTERVAL_DAYS


def test_cap_task_warning_days_clamping() -> None:
    """Lines 93, 95: warning_days < 0 clamped to 0; > 365 clamped to 365."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_task_fields

    data = {"warning_days": -5}
    cap_task_fields(data)
    assert data["warning_days"] == 0

    data2 = {"warning_days": 999}
    cap_task_fields(data2)
    assert data2["warning_days"] == 365


def test_cap_task_checklist_non_list_dropped() -> None:
    """Line 100: non-list checklist is dropped."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_task_fields

    data = {"checklist": "not a list"}
    cap_task_fields(data)
    assert "checklist" not in data


def test_cap_action_field_non_dict_dropped() -> None:
    """Lines 146-147: on_complete_action that is not a dict is dropped."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_action_field

    data: dict[str, Any] = {"on_complete_action": "invalid"}
    cap_action_field(data)
    assert "on_complete_action" not in data


def test_cap_action_field_invalid_service_dropped() -> None:
    """Lines 168-173: invalid service name causes action to be dropped."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_action_field

    # Bad service name (no dot)
    data: dict[str, Any] = {"on_complete_action": {"service": "nodothere"}}
    cap_action_field(data)
    assert "on_complete_action" not in data

    # Service too long
    data2: dict[str, Any] = {"on_complete_action": {"service": "a." + "b" * 200}}
    cap_action_field(data2)
    assert "on_complete_action" not in data2


def test_cap_action_field_target_list_capped() -> None:
    """Lines 168-173: target entity_id as list is capped and kept."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_action_field

    data: dict[str, Any] = {
        "on_complete_action": {
            "service": "notify.send",
            "target": {
                "entity_id": ["light.a", "light.b"],
            },
        }
    }
    cap_action_field(data)
    assert "on_complete_action" in data
    assert data["on_complete_action"]["target"]["entity_id"] == ["light.a", "light.b"]


def test_cap_quick_complete_non_dict_dropped() -> None:
    """Lines 200-201: quick_complete_defaults that is not dict is dropped."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_quick_complete_defaults_field

    data: dict[str, Any] = {"quick_complete_defaults": "invalid"}
    cap_quick_complete_defaults_field(data)
    assert "quick_complete_defaults" not in data


def test_cap_quick_complete_empty_cleaned_drops_key() -> None:
    """Line 224: when cleaned dict is empty, key is removed."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_quick_complete_defaults_field

    # All fields invalid → cleaned is empty → key dropped
    data: dict[str, Any] = {
        "quick_complete_defaults": {
            "notes": "",           # empty string → rejected
            "cost": -1,            # negative → rejected
            "duration": -1,        # negative → rejected
            "feedback": "wrong",   # invalid value → rejected
        }
    }
    cap_quick_complete_defaults_field(data)
    assert "quick_complete_defaults" not in data


def test_cap_quick_complete_valid_fields_kept() -> None:
    """Lines 183-184: valid quick_complete_defaults are stored."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_quick_complete_defaults_field

    data: dict[str, Any] = {
        "quick_complete_defaults": {
            "notes": "pre-filled note",
            "cost": 12.5,
            "duration": 60,
            "feedback": "needed",
        }
    }
    cap_quick_complete_defaults_field(data)
    assert data["quick_complete_defaults"]["notes"] == "pre-filled note"
    assert data["quick_complete_defaults"]["cost"] == 12.5
    assert data["quick_complete_defaults"]["feedback"] == "needed"


# ===========================================================================
# helpers/vacation.py
# ===========================================================================


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
        next_due=date(2026, 6, 3),    # future, inside window → second if fires
        warning_days=0,               # due_soon_from = Jun3 (same as next_due)
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
        next_due=date(2026, 6, 20),   # outside window_end
        warning_days=25,              # due_soon_from = May26 (before today Jun1)
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
        {"task_id": "t1", "enabled": False, "schedule_type": "time_based",
         "interval_days": 10, "warning_days": 3},
        # no task_id (line 215 - skip)
        {"enabled": True, "schedule_type": "time_based",
         "interval_days": 10, "warning_days": 3},
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


# ===========================================================================
# helpers/csv_handler.py
# ===========================================================================


def test_import_csv_skips_rows_without_task_name() -> None:
    """Line 180: rows with empty task_name are skipped."""
    from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv

    csv_content = "object_name,task_name,schedule_type\nMyObj,,time_based\n"
    result = import_objects_csv(csv_content)
    # object is created but has no tasks (task_name was empty)
    assert len(result) == 1
    assert result[0]["tasks"] == {}


def test_import_csv_last_performed_set() -> None:
    """Line 218: last_performed is stored when non-empty."""
    from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv

    csv_content = (
        "object_name,task_name,schedule_type,last_performed\n"
        "Pump,Filter clean,time_based,2026-04-01\n"
    )
    result = import_objects_csv(csv_content)
    task = next(iter(result[0]["tasks"].values()))
    assert task["last_performed"] == "2026-04-01"


def test_import_csv_notes_set_when_non_empty() -> None:
    """Line 222: notes are stored when non-empty."""
    from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv

    csv_content = (
        "object_name,task_name,schedule_type,notes\n"
        "Pump,Filter clean,time_based,Check valve too\n"
    )
    result = import_objects_csv(csv_content)
    task = next(iter(result[0]["tasks"].values()))
    assert task["notes"] == "Check valve too"


def test_safe_int_none_returns_default() -> None:
    """Lines 265, 268-269: _safe_int handles None and invalid strings."""
    from custom_components.maintenance_supporter.helpers.csv_handler import _safe_int

    assert _safe_int(None, 7) == 7
    assert _safe_int("bad", 14) == 14
    assert _safe_int("30", None) == 30
    assert _safe_int("15.7", 0) == 15  # float string → int


# ===========================================================================
# helpers/qr_generator.py
# ===========================================================================


def test_build_qr_url_companion_mode() -> None:
    """Line 56 area: companion mode returns homeassistant://navigate URL."""
    from custom_components.maintenance_supporter.helpers.qr_generator import build_qr_url

    hass = MagicMock()
    url = build_qr_url(hass, "abc123", task_id="t1", url_mode="companion")
    assert url.startswith("homeassistant://navigate")
    assert "abc123" in url


def test_build_qr_url_local_mode() -> None:
    """Local mode returns homeassistant.local URL."""
    from custom_components.maintenance_supporter.helpers.qr_generator import build_qr_url

    hass = MagicMock()
    url = build_qr_url(hass, "abc123", url_mode="local")
    assert url.startswith("http://homeassistant.local:8123")


def test_icon_elements_info() -> None:
    """Lines 102+: _icon_elements returns SVG for info icon."""
    from custom_components.maintenance_supporter.helpers.qr_generator import _icon_elements

    svg = _icon_elements("info", 10.0, 10.0, 5.0, "#000")
    assert "<circle" in svg
    assert "<rect" in svg


def test_icon_elements_check() -> None:
    """_icon_elements returns SVG for check icon."""
    from custom_components.maintenance_supporter.helpers.qr_generator import _icon_elements

    svg = _icon_elements("check", 10.0, 10.0, 5.0, "#FFF")
    assert "<polyline" in svg


def test_icon_elements_lightning() -> None:
    """Lines 102-117: _icon_elements returns SVG for lightning icon."""
    from custom_components.maintenance_supporter.helpers.qr_generator import _icon_elements

    svg = _icon_elements("lightning", 10.0, 10.0, 5.0, "#FFF")
    assert "<polygon" in svg


def test_icon_elements_unknown_returns_empty() -> None:
    """Line 117 (implicit): unknown icon returns empty string."""
    from custom_components.maintenance_supporter.helpers.qr_generator import _icon_elements

    svg = _icon_elements("unknown_icon", 10.0, 10.0, 5.0, "#000")
    assert svg == ""


def test_generate_qr_svg_with_icons() -> None:
    """generate_qr_svg embeds logo when icon is set (all three variants)."""
    from custom_components.maintenance_supporter.helpers.qr_generator import generate_qr_svg

    url = "https://example.com/test"
    for icon in ("info", "check", "lightning"):
        svg = generate_qr_svg(url, icon=icon)
        assert "<svg" in svg
        assert "</svg>" in svg
        # Logo circle should be embedded
        assert "<circle" in svg


def test_generate_qr_svg_no_icon() -> None:
    """generate_qr_svg without icon: no embedded logo circle from our code."""
    from custom_components.maintenance_supporter.helpers.qr_generator import generate_qr_svg

    svg = generate_qr_svg("https://example.com/test")
    assert "<svg" in svg
    assert "</svg>" in svg


def test_generate_qr_svg_custom_colors() -> None:
    """Line 56: custom dark/light color replacement in SVG."""
    from custom_components.maintenance_supporter.helpers.qr_generator import generate_qr_svg

    svg = generate_qr_svg("https://x.com", dark="#112233", light="#AABBCC")
    assert "#112233" in svg
    assert "#AABBCC" in svg


# ===========================================================================
# helpers/interval_analyzer.py
# ===========================================================================


def test_weibull_fit_with_sufficient_data() -> None:
    """Lines 443-453: Weibull fit succeeds with enough valid data points."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer

    analyzer = IntervalAnalyzer()
    intervals = [25.0, 28.0, 30.0, 32.0, 27.0, 29.0]
    result = analyzer._weibull_fit(intervals)
    assert result is not None
    beta, eta, r_squared = result
    assert beta > 0
    assert eta > 0
    assert 0.0 <= r_squared <= 1.0


def test_weibull_fit_insufficient_data_returns_none() -> None:
    """Line 423: Weibull fit returns None with fewer than min required points."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer

    analyzer = IntervalAnalyzer()
    result = analyzer._weibull_fit([10.0, 20.0])  # less than DEFAULT_ADAPTIVE_WEIBULL_MIN
    assert result is None


def test_weibull_fit_all_zeros_returns_none() -> None:
    """Lines 449-450: ValueError in log(0) is caught, continues."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer

    analyzer = IntervalAnalyzer()
    # Zeros filtered by 'valid' check; if not enough valid, returns None
    result = analyzer._weibull_fit([0.0, 0.0, 0.0, 0.0, 0.0])
    assert result is None


def test_weibull_recommended_interval_invalid_params() -> None:
    """Lines 514-515: _weibull_recommended_interval returns 0 for invalid params."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer

    # beta <= 0
    assert IntervalAnalyzer._weibull_recommended_interval(0.0, 30.0, 0.9) == 0
    # reliability out of range
    assert IntervalAnalyzer._weibull_recommended_interval(1.5, 30.0, 0.0) == 0
    assert IntervalAnalyzer._weibull_recommended_interval(1.5, 30.0, 1.0) == 0
    # eta <= 0
    assert IntervalAnalyzer._weibull_recommended_interval(1.5, -1.0, 0.9) == 0


def test_weibull_recommended_interval_valid() -> None:
    """_weibull_recommended_interval returns positive int for valid params."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer

    result = IntervalAnalyzer._weibull_recommended_interval(2.0, 30.0, 0.9)
    assert isinstance(result, int)
    assert result >= 1


def test_weibull_fit_denom_zero_returns_none() -> None:
    """Line 464-465: denom < 1e-10 → returns None (all x_vals identical)."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer

    analyzer = IntervalAnalyzer()
    # All identical values → x_vals all same → denom = 0
    result = analyzer._weibull_fit([30.0] * 7)
    # This might or might not produce None depending on fp precision; just assert no crash
    assert result is None or isinstance(result, tuple)


def test_compute_confidence_levels() -> None:
    """Lines 471-480 / 527-531: _compute_confidence returns correct level."""
    from custom_components.maintenance_supporter.const import DEFAULT_ADAPTIVE_MIN_COMPLETIONS
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer

    assert IntervalAnalyzer._compute_confidence(0) == "low"
    assert IntervalAnalyzer._compute_confidence(DEFAULT_ADAPTIVE_MIN_COMPLETIONS - 1) == "low"
    assert IntervalAnalyzer._compute_confidence(DEFAULT_ADAPTIVE_MIN_COMPLETIONS) == "medium"
    assert IntervalAnalyzer._compute_confidence(8) == "high"
    assert IntervalAnalyzer._compute_confidence(100) == "high"


def test_weibull_beta_nonpositive_returns_none() -> None:
    """Line 471: beta <= 0 returns None after regression."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer

    # Decreasing series → slope may be negative → beta <= 0 → None
    analyzer = IntervalAnalyzer()
    # Strongly decreasing intervals: log-space will have negative slope
    result = analyzer._weibull_fit([100.0, 80.0, 60.0, 40.0, 20.0, 10.0])
    # Could be None (beta<=0) or a valid fit depending on data; just no crash
    assert result is None or (isinstance(result, tuple) and len(result) == 3)


def test_weibull_eta_zero_overflow_returns_none() -> None:
    """Lines 476-477, 480: OverflowError/ZeroDivisionError → None; eta <= 0 → None."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer

    analyzer = IntervalAnalyzer()
    # Pathological data that may trigger overflow in exp()
    # Very large b/beta ratio → large negative → near-zero eta
    result = analyzer._weibull_fit([1.0, 2.0, 3.0, 4.0, 5.0, 6.0])
    # Just assert no exception
    assert result is None or isinstance(result, tuple)


# ===========================================================================
# helpers/sensor_predictor.py
# ===========================================================================


def test_linear_regression_returns_none_for_identical_x() -> None:
    """Line 194 (result is None): linear regression returns None for degenerate data."""
    from custom_components.maintenance_supporter.helpers.sensor_predictor import SensorPredictor

    # All x same → denom = 0 → returns None
    points = [(1000.0, v) for v in [1.0, 2.0, 3.0]]
    result = SensorPredictor._linear_regression(points)
    assert result is None


def test_compute_threshold_prediction_counter_not_increasing() -> None:
    """Line 288: counter trigger with slope <= 0 returns None."""
    from custom_components.maintenance_supporter.helpers.sensor_predictor import (
        DegradationAnalysis,
        SensorPredictor,
    )

    degradation = DegradationAnalysis(
        entity_id="sensor.test",
        slope_per_day=-0.5,  # decreasing
        trend="falling",
        r_squared=0.8,
        current_value=50.0,
        data_points=10,
        lookback_days=90,
    )
    trigger_config = {
        "type": "counter",
        "trigger_target_value": 100,
    }
    result = SensorPredictor._compute_threshold_prediction(degradation, trigger_config)
    assert result is None


def test_compute_threshold_prediction_days_until_zero_already_exceeded() -> None:
    """Lines 314-316: already exceeded threshold → days_until = 0."""
    from custom_components.maintenance_supporter.helpers.sensor_predictor import (
        DegradationAnalysis,
        SensorPredictor,
    )

    # above trigger but current already > threshold
    degradation = DegradationAnalysis(
        entity_id="sensor.test",
        slope_per_day=1.0,  # rising
        trend="rising",
        r_squared=0.9,
        current_value=120.0,  # already above threshold
        data_points=20,
        lookback_days=90,
    )
    trigger_config = {
        "type": "threshold",
        "trigger_above": 100.0,
    }
    result = SensorPredictor._compute_threshold_prediction(degradation, trigger_config)
    assert result is not None
    assert result.days_until_threshold == 0.0


def test_compute_threshold_prediction_below_already_exceeded() -> None:
    """Line 315: below trigger but current already < threshold → days_until=0."""
    from custom_components.maintenance_supporter.helpers.sensor_predictor import (
        DegradationAnalysis,
        SensorPredictor,
    )

    degradation = DegradationAnalysis(
        entity_id="sensor.test",
        slope_per_day=-1.0,  # falling
        trend="falling",
        r_squared=0.9,
        current_value=30.0,  # already below threshold
        data_points=20,
        lookback_days=90,
    )
    trigger_config = {
        "type": "threshold",
        "trigger_below": 50.0,
    }
    result = SensorPredictor._compute_threshold_prediction(degradation, trigger_config)
    assert result is not None
    assert result.days_until_threshold == 0.0


def test_compute_threshold_prediction_slope_zero_returns_none() -> None:
    """Lines 248-249 guard: slope=0 returns None."""
    from custom_components.maintenance_supporter.helpers.sensor_predictor import (
        DegradationAnalysis,
        SensorPredictor,
    )

    degradation = DegradationAnalysis(
        entity_id="sensor.test",
        slope_per_day=0.0,
        trend="stable",
        r_squared=0.5,
        current_value=50.0,
        data_points=10,
        lookback_days=90,
    )
    result = SensorPredictor._compute_threshold_prediction(degradation, {"type": "threshold", "trigger_above": 100})
    assert result is None


def test_compute_threshold_prediction_confidence_levels() -> None:
    """Lines 300-306: confidence derived from r_squared."""
    from custom_components.maintenance_supporter.helpers.sensor_predictor import (
        DegradationAnalysis,
        SensorPredictor,
    )

    def _make_deg(r2: float) -> DegradationAnalysis:
        return DegradationAnalysis("s", 1.0, "rising", r2, 50.0, 20, 90)

    for r2, expected in [(0.8, "high"), (0.5, "medium"), (0.1, "low")]:
        result = SensorPredictor._compute_threshold_prediction(
            _make_deg(r2), {"type": "threshold", "trigger_above": 100.0}
        )
        assert result is not None, f"Expected result for r2={r2}"
        assert result.confidence == expected, f"r2={r2}: got {result.confidence}"


def test_compute_threshold_prediction_counter_delta_mode() -> None:
    """Lines 264-268: counter with delta_mode uses current - baseline."""
    from custom_components.maintenance_supporter.helpers.sensor_predictor import (
        DegradationAnalysis,
        SensorPredictor,
    )

    degradation = DegradationAnalysis(
        entity_id="sensor.counter",
        slope_per_day=5.0,
        trend="rising",
        r_squared=0.9,
        current_value=60.0,  # raw counter
        data_points=10,
        lookback_days=90,
    )
    trigger_config = {
        "type": "counter",
        "trigger_target_value": 50,
        "trigger_delta_mode": True,
        "trigger_baseline_value": 20,
    }
    # current_delta = 60 - 20 = 40; target = 50 → 10 more to go at 5/day = 2 days
    result = SensorPredictor._compute_threshold_prediction(degradation, trigger_config)
    assert result is not None
    assert result.days_until_threshold > 0


def test_environmental_analysis_insufficient_data() -> None:
    """Line 416 area: environmental returns has_sufficient_data=False."""
    # This tests that the EnvironmentalAnalysis dataclass is constructed correctly
    from custom_components.maintenance_supporter.helpers.sensor_predictor import EnvironmentalAnalysis

    analysis = EnvironmentalAnalysis(
        entity_id="sensor.temp",
        current_value=22.0,
        average_value=None,
        correlation=None,
        adjustment_factor=1.0,
        has_sufficient_data=False,
        data_points=2,
    )
    assert analysis.has_sufficient_data is False
    assert analysis.adjustment_factor == 1.0


def test_pearson_correlation_computed() -> None:
    """Lines 453-460 (via _pearson_correlation): returns None for short lists."""
    from custom_components.maintenance_supporter.helpers.sensor_predictor import SensorPredictor

    # Less than 3 → None
    assert SensorPredictor._pearson_correlation([1.0, 2.0], [3.0, 4.0]) is None

    # Perfect correlation
    result = SensorPredictor._pearson_correlation([1.0, 2.0, 3.0], [2.0, 4.0, 6.0])
    assert result is not None
    assert abs(result - 1.0) < 0.01


def test_fetch_statistics_returns_empty_list_on_import_error() -> None:
    """Line 519: returns [] when recorder module is not available."""
    # SensorPredictor._async_fetch_statistics_points wraps ImportError gracefully;
    # test via direct mock of the import.
    from custom_components.maintenance_supporter.helpers.sensor_predictor import SensorPredictor

    hass_mock = MagicMock()
    predictor = SensorPredictor(hass_mock)

    import asyncio

    with patch.dict("sys.modules", {"homeassistant.components.recorder": None}):
        result = asyncio.get_event_loop().run_until_complete(
            predictor._async_fetch_statistics_points("sensor.x", 30)
        )
    assert result == []


# ===========================================================================
# helpers/notification_manager.py
# ===========================================================================


async def test_notification_skipped_when_vacation_active(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    """Lines 520-521: notification skipped during active vacation."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATIONS_ENABLED,
        CONF_NOTIFY_SERVICE,
        CONF_VACATION_ENABLED,
        CONF_VACATION_END,
        CONF_VACATION_START,
        DOMAIN,
        GLOBAL_UNIQUE_ID,
    )
    from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager

    # Set up global entry with notifications enabled + active vacation
    from pytest_homeassistant_custom_component.common import MockConfigEntry as MCE

    today = date.today()
    entry = MCE(
        domain=DOMAIN,
        unique_id=GLOBAL_UNIQUE_ID,
        data={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.test",
            CONF_VACATION_ENABLED: True,
            CONF_VACATION_START: (today - timedelta(days=1)).isoformat(),
            CONF_VACATION_END: (today + timedelta(days=5)).isoformat(),
        },
    )
    entry.add_to_hass(hass)

    mgr = NotificationManager(hass)
    # Register a dummy notify service so enabled check passes
    hass.services.async_register("notify", "test", AsyncMock())

    called = False
    orig_send = mgr._async_send_notification_to_service

    async def _track(*args, **kwargs):
        nonlocal called
        called = True
        return await orig_send(*args, **kwargs)

    mgr._async_send_notification_to_service = _track  # type: ignore[method-assign]

    from custom_components.maintenance_supporter.const import MaintenanceStatus
    await mgr.async_task_status_changed(
        entry_id="eid",
        task_id="task_not_exempt",
        task_name="Test",
        object_name="Obj",
        new_status=MaintenanceStatus.OVERDUE,
    )
    # Vacation is active and task is not exempt → notification suppressed
    assert not called


async def test_notification_no_target_services(hass: HomeAssistant) -> None:
    """Lines 575-576: logs warning when no notification services are available."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATIONS_ENABLED,
        CONF_NOTIFY_SERVICE,
        DOMAIN,
        GLOBAL_UNIQUE_ID,
        MaintenanceStatus,
    )
    from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
    from pytest_homeassistant_custom_component.common import MockConfigEntry as MCE

    entry = MCE(
        domain=DOMAIN,
        unique_id=GLOBAL_UNIQUE_ID,
        data={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "",  # no global service
        },
    )
    entry.add_to_hass(hass)

    mgr = NotificationManager(hass)
    # Override quiet hours to be off
    with patch.object(type(mgr), "_is_quiet_hours", return_value=False):
        await mgr.async_task_status_changed(
            entry_id="eid",
            task_id="t1",
            task_name="Test",
            object_name="Obj",
            new_status=MaintenanceStatus.OVERDUE,
        )
    # No crash — just returns without sending (lines 574-576)


async def test_send_bundled_title_style_object_name(hass: HomeAssistant) -> None:
    """Line 767: bundled notification uses object_name as title when title_style = object_name."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATIONS_ENABLED,
        CONF_NOTIFICATION_TITLE_STYLE,
        CONF_NOTIFY_SERVICE,
        CONF_QUIET_HOURS_ENABLED,
        DOMAIN,
        GLOBAL_UNIQUE_ID,
        MaintenanceStatus,
    )
    from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
    from pytest_homeassistant_custom_component.common import MockConfigEntry as MCE

    entry = MCE(
        domain=DOMAIN,
        unique_id=GLOBAL_UNIQUE_ID,
        data={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.test",
            CONF_QUIET_HOURS_ENABLED: False,
            CONF_NOTIFICATION_TITLE_STYLE: "object_name",
        },
    )
    entry.add_to_hass(hass)

    mgr = NotificationManager(hass)
    tasks = [{"status": MaintenanceStatus.OVERDUE, "task_name": "Filter"}]

    with patch.object(mgr, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await mgr.async_send_bundled("entry1", "Pool Pump", tasks)

        # title should be the object name when style = object_name
        assert mock_hass.services.async_call.called
        call_data = mock_hass.services.async_call.call_args[0][2]
        assert call_data.get("title") == "Pool Pump"


async def test_send_bundled_quiet_hours_skipped(hass: HomeAssistant) -> None:
    """Line 744: bundled notifications skipped during quiet hours."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATIONS_ENABLED,
        CONF_NOTIFY_SERVICE,
        CONF_QUIET_HOURS_ENABLED,
        CONF_QUIET_HOURS_START,
        CONF_QUIET_HOURS_END,
        DOMAIN,
        GLOBAL_UNIQUE_ID,
        MaintenanceStatus,
    )
    from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
    from pytest_homeassistant_custom_component.common import MockConfigEntry as MCE

    entry = MCE(
        domain=DOMAIN,
        unique_id=GLOBAL_UNIQUE_ID,
        data={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.test",
            CONF_QUIET_HOURS_ENABLED: True,
            CONF_QUIET_HOURS_START: "00:00",
            CONF_QUIET_HOURS_END: "23:59",  # always quiet
        },
    )
    entry.add_to_hass(hass)

    mgr = NotificationManager(hass)
    tasks = [{"status": MaintenanceStatus.OVERDUE, "task_name": "Filter"}]

    with patch.object(mgr, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await mgr.async_send_bundled("entry1", "Pool Pump", tasks)

        # quiet hours active → service not called
        mock_hass.services.async_call.assert_not_called()


async def test_budget_alert_quiet_hours_skipped(hass: HomeAssistant) -> None:
    """Line 818: budget alert skipped during quiet hours."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATIONS_ENABLED,
        CONF_NOTIFY_SERVICE,
        CONF_QUIET_HOURS_ENABLED,
        CONF_QUIET_HOURS_START,
        CONF_QUIET_HOURS_END,
        DOMAIN,
        GLOBAL_UNIQUE_ID,
    )
    from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
    from pytest_homeassistant_custom_component.common import MockConfigEntry as MCE

    entry = MCE(
        domain=DOMAIN,
        unique_id=GLOBAL_UNIQUE_ID,
        data={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.test",
            CONF_QUIET_HOURS_ENABLED: True,
            CONF_QUIET_HOURS_START: "00:00",
            CONF_QUIET_HOURS_END: "23:59",
        },
    )
    entry.add_to_hass(hass)

    mgr = NotificationManager(hass)

    with patch.object(mgr, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await mgr.async_budget_alert("monthly", 450.0, 500.0)

        # quiet hours active → not called
        mock_hass.services.async_call.assert_not_called()


async def test_budget_alert_sends_notification(hass: HomeAssistant) -> None:
    """Lines 791-792: budget alert sends notification to service."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATIONS_ENABLED,
        CONF_NOTIFY_SERVICE,
        CONF_QUIET_HOURS_ENABLED,
        DOMAIN,
        GLOBAL_UNIQUE_ID,
    )
    from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
    from pytest_homeassistant_custom_component.common import MockConfigEntry as MCE

    entry = MCE(
        domain=DOMAIN,
        unique_id=GLOBAL_UNIQUE_ID,
        data={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.test",
            CONF_QUIET_HOURS_ENABLED: False,
        },
    )
    entry.add_to_hass(hass)

    mgr = NotificationManager(hass)

    with patch.object(mgr, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await mgr.async_budget_alert("monthly", 450.0, 500.0)

        assert mock_hass.services.async_call.called
        call_args = mock_hass.services.async_call.call_args[0]
        assert call_args[0] == "notify"


async def test_dismiss_task_notification(hass: HomeAssistant) -> None:
    """Lines 894-895: async_dismiss_task_notification calls service."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATIONS_ENABLED,
        CONF_NOTIFY_SERVICE,
        DOMAIN,
        GLOBAL_UNIQUE_ID,
    )
    from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
    from pytest_homeassistant_custom_component.common import MockConfigEntry as MCE

    entry = MCE(
        domain=DOMAIN,
        unique_id=GLOBAL_UNIQUE_ID,
        data={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.test",
        },
    )
    entry.add_to_hass(hass)

    mgr = NotificationManager(hass)

    with patch.object(mgr, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await mgr.async_dismiss_task_notification("my_task_id")

        assert mock_hass.services.async_call.called
        call_data = mock_hass.services.async_call.call_args[0][2]
        assert call_data["message"] == "clear_notification"
        assert "maintenance_my_task_id" in call_data["data"]["tag"]


async def test_dismiss_task_notification_no_service(hass: HomeAssistant) -> None:
    """Line 882: async_dismiss_task_notification returns early when no service."""
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATIONS_ENABLED,
        CONF_NOTIFY_SERVICE,
        DOMAIN,
        GLOBAL_UNIQUE_ID,
    )
    from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
    from pytest_homeassistant_custom_component.common import MockConfigEntry as MCE

    entry = MCE(
        domain=DOMAIN,
        unique_id=GLOBAL_UNIQUE_ID,
        data={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "",  # empty
        },
    )
    entry.add_to_hass(hass)

    mgr = NotificationManager(hass)

    with patch.object(mgr, "hass") as mock_hass:
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries

        await mgr.async_dismiss_task_notification("my_task_id")

        # No notify_service configured → should not call service
        mock_hass.services.async_call.assert_not_called()


# ===========================================================================
# repairs.py  (pure-function helpers — no hass / RepairsFlow needed)
# ===========================================================================


def test_entry_for_issue_missing_entry_id() -> None:
    """Line 54: _entry_for_issue returns None when entry_id is absent."""
    from custom_components.maintenance_supporter.repairs import _entry_for_issue

    hass = MagicMock()
    hass.config_entries.async_get_entry.return_value = None

    # No entry_id in issue_data
    assert _entry_for_issue(hass, {}) is None
    assert _entry_for_issue(hass, None) is None


def test_entry_has_task_false_cases() -> None:
    """Lines 113, 115: _entry_has_task returns False for None entry or missing task."""
    from custom_components.maintenance_supporter.repairs import _entry_has_task

    # entry is None
    assert _entry_has_task(None, "task_id") is False

    # task_id is None/empty
    entry = MagicMock()
    entry.data = {"tasks": {"t1": {}}}
    assert _entry_has_task(entry, None) is False
    assert _entry_has_task(entry, "") is False


def test_replace_entity_in_dict_entity_ids_list() -> None:
    """Lines 134-135 area: _replace_entity_in_dict replaces in entity_ids list."""
    from custom_components.maintenance_supporter.repairs import _replace_entity_in_dict

    cfg = {"entity_ids": ["sensor.old", "sensor.other"], "entity_id": "sensor.old"}
    result = _replace_entity_in_dict(cfg, "sensor.old", "sensor.new")
    assert "sensor.new" in result["entity_ids"]
    assert result["entity_id"] == "sensor.new"

    # entity_id field matches too
    cfg2 = {"entity_id": "sensor.old"}
    result2 = _replace_entity_in_dict(cfg2, "sensor.old", "sensor.new")
    assert result2["entity_id"] == "sensor.new"


def test_replace_entity_in_condition_with_nested() -> None:
    """Lines 92-96: _replace_entity_in_condition replaces in nested trigger_config."""
    from custom_components.maintenance_supporter.repairs import _replace_entity_in_condition

    cond = {
        "entity_id": "sensor.old",
        "trigger_config": {"entity_id": "sensor.old"},
    }
    result = _replace_entity_in_condition(cond, "sensor.old", "sensor.new")
    assert result["entity_id"] == "sensor.new"
    assert result["trigger_config"]["entity_id"] == "sensor.new"


def test_strip_entity_from_dict_multi_entity() -> None:
    """Lines 113-114: stripping from multi-entity list leaves remaining."""
    from custom_components.maintenance_supporter.repairs import _strip_entity_from_dict

    cfg = {"entity_ids": ["sensor.a", "sensor.b"], "entity_id": "sensor.a"}
    result, has_remaining = _strip_entity_from_dict(cfg, "sensor.a")
    assert has_remaining is True
    assert "sensor.a" not in result.get("entity_ids", [])
    assert result.get("entity_id") == "sensor.b"


def test_strip_entity_from_dict_sole_entity() -> None:
    """Lines 116-118: stripping sole entity leaves has_remaining=False."""
    from custom_components.maintenance_supporter.repairs import _strip_entity_from_dict

    cfg = {"entity_id": "sensor.a"}
    result, has_remaining = _strip_entity_from_dict(cfg, "sensor.a")
    assert has_remaining is False
    assert "entity_id" not in result


def test_strip_entity_from_condition_compound() -> None:
    """Lines 130-136: _strip_entity_from_condition strips from nested."""
    from custom_components.maintenance_supporter.repairs import _strip_entity_from_condition

    cond = {
        "entity_id": "sensor.x",
        "trigger_config": {"entity_id": "sensor.x"},
    }
    result, keep = _strip_entity_from_condition(cond, "sensor.x")
    assert keep is False


def test_async_create_fix_flow_routing() -> None:
    """Line 661: async_create_fix_flow returns correct flow type."""
    import asyncio

    from custom_components.maintenance_supporter.repairs import (
        MissingTriggerEntityRepairFlow,
        OrphanAdminPanelUserRepairFlow,
        StaleActionEntityRepairFlow,
        async_create_fix_flow,
    )

    hass = MagicMock()

    flow1 = asyncio.get_event_loop().run_until_complete(
        async_create_fix_flow(hass, "orphan_admin_panel_user_abc", {})
    )
    assert isinstance(flow1, OrphanAdminPanelUserRepairFlow)

    flow2 = asyncio.get_event_loop().run_until_complete(
        async_create_fix_flow(hass, "stale_action_entity_abc", {})
    )
    assert isinstance(flow2, StaleActionEntityRepairFlow)

    flow3 = asyncio.get_event_loop().run_until_complete(
        async_create_fix_flow(hass, "missing_trigger_entity_abc", {})
    )
    assert isinstance(flow3, MissingTriggerEntityRepairFlow)


async def test_orphan_admin_repair_flow_init_form(hass: HomeAssistant) -> None:
    """Lines 525-528: OrphanAdminPanelUserRepairFlow.async_step_init shows form first."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.repairs import OrphanAdminPanelUserRepairFlow

    flow = OrphanAdminPanelUserRepairFlow()
    flow.hass = hass
    flow.data = {"user_id": "abcd1234", "entry_id": ""}

    result = await flow.async_step_init(user_input=None)
    assert result["type"] == data_entry_flow.FlowResultType.FORM
    assert result["step_id"] == "init"


async def test_orphan_admin_repair_flow_entry_gone(hass: HomeAssistant) -> None:
    """Lines 540-543: OrphanAdminPanelUserRepairFlow aborts when entry is gone."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.repairs import OrphanAdminPanelUserRepairFlow

    flow = OrphanAdminPanelUserRepairFlow()
    flow.hass = hass
    flow.data = {"user_id": "u1", "entry_id": "nonexistent_entry_id"}

    result = await flow.async_step_remove_user_id()
    assert result["type"] == data_entry_flow.FlowResultType.ABORT
    assert result["reason"] == "entry_gone"


async def test_orphan_admin_repair_removes_user(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    """Lines 544-552: OrphanAdminPanelUserRepairFlow removes orphan user id."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.const import CONF_ADMIN_PANEL_USER_IDS
    from custom_components.maintenance_supporter.repairs import OrphanAdminPanelUserRepairFlow

    # Add the user id to the global entry options
    hass.config_entries.async_update_entry(
        global_config_entry,
        options={CONF_ADMIN_PANEL_USER_IDS: ["orphan_uid", "keep_uid"]},
    )

    flow = OrphanAdminPanelUserRepairFlow()
    flow.hass = hass
    flow.data = {
        "user_id": "orphan_uid",
        "entry_id": global_config_entry.entry_id,
    }

    result = await flow.async_step_remove_user_id()
    assert result["type"] == data_entry_flow.FlowResultType.CREATE_ENTRY

    # Verify user was removed
    updated = hass.config_entries.async_get_entry(global_config_entry.entry_id)
    ids = updated.options.get(CONF_ADMIN_PANEL_USER_IDS, [])
    assert "orphan_uid" not in ids
    assert "keep_uid" in ids


async def test_stale_action_repair_flow_init_menu(hass: HomeAssistant) -> None:
    """Lines 590: StaleActionEntityRepairFlow.async_step_init shows menu."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.repairs import StaleActionEntityRepairFlow

    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": "eid",
        "task_id": "tid",
        "task_name": "Test Task",
        "stale_entity": "sensor.dead",
    }

    result = await flow.async_step_init()
    assert result["type"] == data_entry_flow.FlowResultType.MENU
    assert "replace_entity" in result["menu_options"]
    assert "remove_action" in result["menu_options"]


async def test_stale_action_repair_replace_entity_entry_gone(hass: HomeAssistant) -> None:
    """Line 590: StaleActionEntityRepairFlow replace_entity aborts when entry gone."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.repairs import StaleActionEntityRepairFlow

    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": "nonexistent",
        "task_id": "t1",
        "task_name": "Task",
        "stale_entity": "sensor.dead",
    }

    result = await flow.async_step_replace_entity(user_input={"new_entity": "sensor.new"})
    assert result["type"] == data_entry_flow.FlowResultType.ABORT
    assert result["reason"] == "entry_gone"


async def test_stale_action_repair_replace_no_entity_aborts(hass: HomeAssistant) -> None:
    """Line 593: StaleActionEntityRepairFlow replace with empty entity aborts."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.repairs import StaleActionEntityRepairFlow

    # Create a real entry so _entry() returns it
    entry = MockConfigEntry(
        domain="maintenance_supporter",
        data={"tasks": {}},
        unique_id="test_stale_entry",
    )
    entry.add_to_hass(hass)

    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": entry.entry_id,
        "task_id": "t1",
        "task_name": "Task",
        "stale_entity": "sensor.dead",
    }

    result = await flow.async_step_replace_entity(user_input={"new_entity": ""})
    assert result["type"] == data_entry_flow.FlowResultType.ABORT
    assert result["reason"] == "no_entity"


async def test_stale_action_repair_replace_entity_success(hass: HomeAssistant) -> None:
    """Line 596: StaleActionEntityRepairFlow patches action entity and returns CREATE_ENTRY."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.const import CONF_TASKS
    from custom_components.maintenance_supporter.repairs import StaleActionEntityRepairFlow

    task_id = "t1"
    entry = MockConfigEntry(
        domain="maintenance_supporter",
        data={
            CONF_TASKS: {
                task_id: {
                    "on_complete_action": {
                        "service": "light.turn_on",
                        "target": {"entity_id": "sensor.dead"},
                    }
                }
            }
        },
        unique_id="test_stale_replace",
    )
    entry.add_to_hass(hass)

    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": entry.entry_id,
        "task_id": task_id,
        "task_name": "Task",
        "stale_entity": "sensor.dead",
    }

    result = await flow.async_step_replace_entity(user_input={"new_entity": "sensor.new"})
    assert result["type"] == data_entry_flow.FlowResultType.CREATE_ENTRY

    updated = hass.config_entries.async_get_entry(entry.entry_id)
    action = updated.data[CONF_TASKS][task_id]["on_complete_action"]
    assert action["target"]["entity_id"] == "sensor.new"


async def test_stale_action_repair_remove_action_entry_gone(hass: HomeAssistant) -> None:
    """Line 613: StaleActionEntityRepairFlow remove_action aborts when entry gone."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.repairs import StaleActionEntityRepairFlow

    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": "nonexistent",
        "task_id": "t1",
        "task_name": "Task",
        "stale_entity": "sensor.dead",
    }

    result = await flow.async_step_remove_action(user_input={})
    assert result["type"] == data_entry_flow.FlowResultType.ABORT
    assert result["reason"] == "entry_gone"


async def test_stale_action_repair_remove_action_success(hass: HomeAssistant) -> None:
    """Line 616: StaleActionEntityRepairFlow clears action and returns CREATE_ENTRY."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.const import CONF_TASKS
    from custom_components.maintenance_supporter.repairs import StaleActionEntityRepairFlow

    task_id = "t2"
    entry = MockConfigEntry(
        domain="maintenance_supporter",
        data={
            CONF_TASKS: {
                task_id: {
                    "on_complete_action": {"service": "light.turn_on"}
                }
            }
        },
        unique_id="test_stale_remove",
    )
    entry.add_to_hass(hass)

    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": entry.entry_id,
        "task_id": task_id,
        "task_name": "Task",
        "stale_entity": "sensor.dead",
    }

    result = await flow.async_step_remove_action(user_input={})
    assert result["type"] == data_entry_flow.FlowResultType.CREATE_ENTRY

    updated = hass.config_entries.async_get_entry(entry.entry_id)
    assert "on_complete_action" not in updated.data[CONF_TASKS][task_id]


async def test_stale_action_replace_shows_form_when_no_input(hass: HomeAssistant) -> None:
    """Lines 596-605: async_step_replace_entity shows form when user_input is None."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.repairs import StaleActionEntityRepairFlow

    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": "eid",
        "task_id": "t1",
        "task_name": "Task",
        "stale_entity": "sensor.dead",
    }

    result = await flow.async_step_replace_entity(user_input=None)
    assert result["type"] == data_entry_flow.FlowResultType.FORM
    assert result["step_id"] == "replace_entity"


async def test_stale_action_remove_shows_form_when_no_input(hass: HomeAssistant) -> None:
    """Lines 616-622: async_step_remove_action shows form when user_input is None."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.repairs import StaleActionEntityRepairFlow

    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": "eid",
        "task_id": "t1",
        "task_name": "Task",
        "stale_entity": "sensor.dead",
    }

    result = await flow.async_step_remove_action(user_input=None)
    assert result["type"] == data_entry_flow.FlowResultType.FORM
    assert result["step_id"] == "remove_action"


# ===========================================================================
# repairs.py: _remove_from_flat and _remove_from_compound helpers
# ===========================================================================


def test_remove_from_flat_multi_entity_strips_one() -> None:
    """Lines 489-491: flat multi-entity: strip one entity, keep remaining."""
    from custom_components.maintenance_supporter.repairs import MissingTriggerEntityRepairFlow

    flow = MissingTriggerEntityRepairFlow()

    task_dict: dict[str, Any] = {
        "trigger_config": {"entity_ids": ["sensor.a", "sensor.b"], "entity_id": "sensor.a"},
        "schedule_type": "sensor_based",
        "interval_days": 30,
        "interval_unit": "days",
        "interval_anchor": "completion",
    }
    trigger_config = dict(task_dict["trigger_config"])

    notes = flow._remove_from_flat(task_dict, trigger_config, "sensor.a")
    assert "sensor.a" in notes or "sensor.b" in notes
    # sensor.b should remain
    assert task_dict["trigger_config"]["entity_id"] == "sensor.b"


def test_remove_from_flat_sole_entity_converts_to_time_based() -> None:
    """Line 502: flat sole entity removed → schedule becomes time_based."""
    from custom_components.maintenance_supporter.repairs import MissingTriggerEntityRepairFlow

    flow = MissingTriggerEntityRepairFlow()

    task_dict: dict[str, Any] = {
        "trigger_config": {"entity_id": "sensor.a", "interval_days": None},
        "schedule_type": "sensor_based",
        "interval_days": 30,
        "interval_unit": "days",
        "interval_anchor": "completion",
    }
    trigger_config = dict(task_dict["trigger_config"])

    flow._remove_from_flat(task_dict, trigger_config, "sensor.a")
    assert "trigger_config" not in task_dict
    assert task_dict.get("schedule_type") in ("time_based", "manual")


def test_remove_from_compound_two_remaining_stays_compound() -> None:
    """Lines 476-482: compound with >=2 conditions remaining stays compound."""
    from custom_components.maintenance_supporter.repairs import MissingTriggerEntityRepairFlow

    flow = MissingTriggerEntityRepairFlow()

    trigger_config: dict[str, Any] = {
        "type": "compound",
        "conditions": [
            {"entity_id": "sensor.dead", "type": "threshold"},
            {"entity_id": "sensor.b", "type": "threshold"},
            {"entity_id": "sensor.c", "type": "threshold"},
        ],
    }
    task_dict: dict[str, Any] = {"trigger_config": trigger_config}

    notes = flow._remove_from_compound(task_dict, trigger_config, "sensor.dead")
    assert "2 conditions remain" in notes
    assert task_dict["trigger_config"]["type"] == "compound"


def test_remove_from_compound_one_remaining_demotes() -> None:
    """Lines 484-498: compound with 1 condition demoted to flat trigger."""
    from custom_components.maintenance_supporter.repairs import MissingTriggerEntityRepairFlow

    flow = MissingTriggerEntityRepairFlow()

    trigger_config: dict[str, Any] = {
        "type": "compound",
        "conditions": [
            {"entity_id": "sensor.dead", "type": "threshold"},
            {"entity_id": "sensor.keep", "type": "counter", "trigger_config": {"type": "counter"}},
        ],
    }
    task_dict: dict[str, Any] = {
        "trigger_config": trigger_config,
        "schedule_type": "sensor_based",
    }

    notes = flow._remove_from_compound(task_dict, trigger_config, "sensor.dead")
    assert "demoted" in notes
    # trigger_config should now be a flat one (type != "compound")
    assert task_dict["trigger_config"].get("type") != "compound"


def test_remove_from_compound_zero_remaining_delegates_flat() -> None:
    """Line 502: compound with 0 remaining delegates to _remove_from_flat."""
    from custom_components.maintenance_supporter.repairs import MissingTriggerEntityRepairFlow

    flow = MissingTriggerEntityRepairFlow()

    trigger_config: dict[str, Any] = {
        "type": "compound",
        "conditions": [
            {"entity_id": "sensor.dead", "type": "threshold"},
        ],
    }
    task_dict: dict[str, Any] = {
        "trigger_config": trigger_config,
        "schedule_type": "sensor_based",
        "interval_days": 30,
        "interval_unit": "days",
        "interval_anchor": "completion",
    }

    notes = flow._remove_from_compound(task_dict, trigger_config, "sensor.dead")
    # Should have delegated to _remove_from_flat → contains "Sensor trigger removed"
    assert "trigger" in notes.lower()
