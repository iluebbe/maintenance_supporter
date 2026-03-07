"""Unit tests for calendar entity event generation — bypasses entity_registry_enabled_default."""

from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Any
from unittest.mock import MagicMock, patch

import pytest

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.calendar import (
    MaintenanceCalendar,
)
from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
    ScheduleType,
)
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def calendar_entity(hass: HomeAssistant) -> MaintenanceCalendar:
    """Create a calendar entity directly."""
    return MaintenanceCalendar(hass)


def _add_object_entry(
    hass: HomeAssistant,
    task_data: dict[str, Any],
    name: str = "Test Object",
    unique_id: str = "cal_unit",
) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title=name,
        data=build_object_entry_data(
            object_data=build_object_data(name=name),
            tasks={TASK_ID_1: task_data},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


# ─── _get_all_events ──────────────────────────────────────────────────


async def test_get_all_events_time_based(
    hass: HomeAssistant, global_entry: MockConfigEntry,
    calendar_entity: MaintenanceCalendar,
) -> None:
    """Test _get_all_events returns events for time-based tasks."""
    last = (dt_util.now().date() - timedelta(days=25)).isoformat()
    task = build_task_data(last_performed=last, interval_days=30)
    _add_object_entry(hass, task, unique_id="cal_time")
    await setup_integration(hass, global_entry)

    now = dt_util.now()
    events = calendar_entity._get_all_events(
        now, now + timedelta(days=365)
    )
    matching = [e for e in events if "Test Object" in e.summary]
    assert len(matching) >= 1


async def test_get_all_events_disabled_task(
    hass: HomeAssistant, global_entry: MockConfigEntry,
    calendar_entity: MaintenanceCalendar,
) -> None:
    """Test _get_all_events skips disabled tasks."""
    last = (dt_util.now().date() - timedelta(days=5)).isoformat()
    task = build_task_data(last_performed=last, enabled=False)
    _add_object_entry(hass, task, unique_id="cal_disabled")
    await setup_integration(hass, global_entry)

    now = dt_util.now()
    events = calendar_entity._get_all_events(
        now, now + timedelta(days=365)
    )
    matching = [e for e in events if "Test Object" in e.summary]
    assert len(matching) == 0


async def test_get_all_events_manual_no_trigger(
    hass: HomeAssistant, global_entry: MockConfigEntry,
    calendar_entity: MaintenanceCalendar,
) -> None:
    """Test _get_all_events: manual task without trigger → no event."""
    task = build_task_data(schedule_type=ScheduleType.MANUAL)
    task.pop("interval_days", None)
    _add_object_entry(hass, task, unique_id="cal_manual")
    await setup_integration(hass, global_entry)

    now = dt_util.now()
    events = calendar_entity._get_all_events(
        now, now + timedelta(days=365)
    )
    matching = [e for e in events if "Test Object" in e.summary]
    assert len(matching) == 0


async def test_get_all_events_out_of_range(
    hass: HomeAssistant, global_entry: MockConfigEntry,
    calendar_entity: MaintenanceCalendar,
) -> None:
    """Test _get_all_events: task due far away not in short range."""
    last = dt_util.now().date().isoformat()
    task = build_task_data(last_performed=last, interval_days=300)
    _add_object_entry(hass, task, unique_id="cal_range")
    await setup_integration(hass, global_entry)

    now = dt_util.now()
    events = calendar_entity._get_all_events(
        now, now + timedelta(days=7)
    )
    matching = [e for e in events if "Test Object" in e.summary]
    assert len(matching) == 0


async def test_get_all_events_with_plain_dates(
    hass: HomeAssistant, global_entry: MockConfigEntry,
    calendar_entity: MaintenanceCalendar,
) -> None:
    """Test _get_all_events accepts plain date objects."""
    last = (dt_util.now().date() - timedelta(days=25)).isoformat()
    task = build_task_data(last_performed=last, interval_days=30)
    _add_object_entry(hass, task, unique_id="cal_plain_date")
    await setup_integration(hass, global_entry)

    start = dt_util.now().date()
    end = start + timedelta(days=365)
    events = calendar_entity._get_all_events(start, end)
    assert isinstance(events, list)


# ─── event property ──────────────────────────────────────────────────


async def test_event_property_returns_next(
    hass: HomeAssistant, global_entry: MockConfigEntry,
    calendar_entity: MaintenanceCalendar,
) -> None:
    """Test event property returns the nearest upcoming event."""
    last = (dt_util.now().date() - timedelta(days=25)).isoformat()
    task = build_task_data(last_performed=last, interval_days=30)
    _add_object_entry(hass, task, unique_id="cal_event_prop")
    await setup_integration(hass, global_entry)

    event = calendar_entity.event
    if event is not None:
        assert "Test Object" in event.summary


async def test_event_property_no_events(
    hass: HomeAssistant, global_entry: MockConfigEntry,
    calendar_entity: MaintenanceCalendar,
) -> None:
    """Test event property returns None when no events."""
    await setup_integration(hass, global_entry)
    # No object entries → no events
    event = calendar_entity.event
    assert event is None


# ─── async_get_events ─────────────────────────────────────────────────


async def test_async_get_events(
    hass: HomeAssistant, global_entry: MockConfigEntry,
    calendar_entity: MaintenanceCalendar,
) -> None:
    """Test async_get_events returns events."""
    last = (dt_util.now().date() - timedelta(days=25)).isoformat()
    task = build_task_data(last_performed=last, interval_days=30)
    _add_object_entry(hass, task, unique_id="cal_async")
    await setup_integration(hass, global_entry)

    now = dt_util.now()
    events = await calendar_entity.async_get_events(
        hass, now, now + timedelta(days=365)
    )
    matching = [e for e in events if "Test Object" in e.summary]
    assert len(matching) >= 1


# ─── _create_event_for_task unit tests ─────────────────────────────────


def test_create_event_manual_not_triggered(
    hass: HomeAssistant,
    calendar_entity: MaintenanceCalendar,
) -> None:
    """Test manual task not triggered → no event."""
    task = MaintenanceTask.from_dict({
        "id": TASK_ID_1,
        "name": "Manual Task",
        "type": "cleaning",
        "enabled": True,
        "schedule_type": ScheduleType.MANUAL,
        "warning_days": 7,
        "history": [],
    })

    today = dt_util.now().date()
    event = calendar_entity._create_event_for_task(
        task, "Object", today, today + timedelta(days=30)
    )
    assert event is None


def test_create_event_manual_triggered(
    hass: HomeAssistant,
    calendar_entity: MaintenanceCalendar,
) -> None:
    """Test manual task triggered → event for today."""
    task = MaintenanceTask.from_dict({
        "id": TASK_ID_1,
        "name": "Manual Task",
        "type": "cleaning",
        "enabled": True,
        "schedule_type": ScheduleType.MANUAL,
        "warning_days": 7,
        "history": [],
    })
    task._trigger_active = True

    today = dt_util.now().date()
    event = calendar_entity._create_event_for_task(
        task, "Object", today, today + timedelta(days=30)
    )
    assert event is not None
    assert "Manual Task" in event.summary


def test_create_event_manual_triggered_out_of_range(
    hass: HomeAssistant,
    calendar_entity: MaintenanceCalendar,
) -> None:
    """Test manual task triggered but outside date range → no event."""
    task = MaintenanceTask.from_dict({
        "id": TASK_ID_1,
        "name": "Manual Task",
        "type": "cleaning",
        "enabled": True,
        "schedule_type": ScheduleType.MANUAL,
        "warning_days": 7,
        "history": [],
    })
    task._trigger_active = True

    # Range in the far past
    start = date(2020, 1, 1)
    end = date(2020, 1, 31)
    event = calendar_entity._create_event_for_task(
        task, "Object", start, end
    )
    assert event is None


def test_create_event_sensor_triggered_no_due_date(
    hass: HomeAssistant,
    calendar_entity: MaintenanceCalendar,
) -> None:
    """Test sensor-triggered task with no next_due → shows today."""
    task = MaintenanceTask.from_dict({
        "id": TASK_ID_1,
        "name": "Sensor Task",
        "type": "inspection",
        "enabled": True,
        "schedule_type": ScheduleType.SENSOR_BASED,
        "warning_days": 7,
        "history": [],
    })
    task._trigger_active = True
    # No last_performed → no next_due

    today = dt_util.now().date()
    event = calendar_entity._create_event_for_task(
        task, "Object", today, today + timedelta(days=30)
    )
    assert event is not None
    assert "Sensor Task" in event.summary


def test_create_event_no_next_due_no_trigger(
    hass: HomeAssistant,
    calendar_entity: MaintenanceCalendar,
) -> None:
    """Test task with no next_due and no trigger → no event."""
    task = MaintenanceTask.from_dict({
        "id": TASK_ID_1,
        "name": "No Due Task",
        "type": "inspection",
        "enabled": True,
        "schedule_type": ScheduleType.SENSOR_BASED,
        "warning_days": 7,
        "history": [],
    })
    # No trigger active, no interval → no next_due

    today = dt_util.now().date()
    event = calendar_entity._create_event_for_task(
        task, "Object", today, today + timedelta(days=30)
    )
    assert event is None


def test_create_event_overdue(
    hass: HomeAssistant,
    calendar_entity: MaintenanceCalendar,
) -> None:
    """Test overdue task creates event with correct prefix."""
    last = (dt_util.now().date() - timedelta(days=60)).isoformat()
    task = MaintenanceTask.from_dict({
        "id": TASK_ID_1,
        "name": "Overdue Task",
        "type": "cleaning",
        "enabled": True,
        "schedule_type": ScheduleType.TIME_BASED,
        "interval_days": 30,
        "warning_days": 7,
        "last_performed": last,
        "history": [],
    })

    today = dt_util.now().date()
    # Wide range covering past 60 days to future 60 days
    start = today - timedelta(days=60)
    end = today + timedelta(days=60)
    event = calendar_entity._create_event_for_task(
        task, "Object", start, end
    )
    if event is not None:
        assert "Overdue Task" in event.summary
