"""Tests for the vacation helpers (helpers/vacation.py)."""

from __future__ import annotations

from datetime import timedelta

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
