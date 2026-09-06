"""Time of day on calendar-kind schedules (#168).

The backend never cared about the schedule kind — `schedule_time` refines
the due day of whatever produced it — but both editors only offered the
field on the interval kind. Pins that a weekdays task with a time flips to
overdue at that time (status), gets a timed calendar event, and that the
options flow stores the time for a calendar kind and a one-off.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.calendar import MaintenanceCalendar
from custom_components.maintenance_supporter.config_flow_helpers import (
    CALENDAR_KIND_VALUES,
    SCHEDULE_TIME_KINDS,
)
from custom_components.maintenance_supporter.const import (
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_SCHEDULE_TIME,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
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


def test_schedule_time_kinds_cover_every_dated_kind() -> None:
    assert set(SCHEDULE_TIME_KINDS) == {"time_based", "one_time", *CALENDAR_KIND_VALUES}


def _weekdays_task_due_today(schedule_time: str) -> MaintenanceTask:
    today = dt_util.now().date()
    return MaintenanceTask.from_dict(
        {
            "id": TASK_ID_1,
            "name": "Sunday round",
            "type": "cleaning",
            "enabled": True,
            "schedule": {"kind": "weekdays", "weekdays": [today.weekday()]},
            "created_at": (today - timedelta(days=14)).isoformat(),
            "last_performed": (today - timedelta(days=7)).isoformat(),
            "warning_days": 1,
            "schedule_time": schedule_time,
            "history": [],
        }
    )


def test_weekdays_task_flips_to_overdue_at_its_time(freezer) -> None:
    """Sunday 21:00: due_soon at 20:59, overdue from 21:00 — the same sub-day
    refinement the interval kind had, now reachable on a calendar kind."""
    freezer.move_to("2026-05-01 15:30:00+00:00")
    now = dt_util.now()
    later = (now + timedelta(hours=2)).time().strftime("%H:%M")
    earlier = (now - timedelta(hours=2)).time().strftime("%H:%M")
    before = _weekdays_task_due_today(later)
    assert before.days_until_due == 0
    assert before.status == MaintenanceStatus.DUE_SOON
    after = _weekdays_task_due_today(earlier)
    assert after.days_until_due == 0
    assert after.status == MaintenanceStatus.OVERDUE


async def test_calendar_event_is_timed_for_a_calendar_kind(hass: HomeAssistant) -> None:
    calendar_entity = MaintenanceCalendar(hass)
    global_entry = MockConfigEntry(domain=DOMAIN, unique_id=GLOBAL_UNIQUE_ID, data={}, options={CONF_ADVANCED_SCHEDULE_TIME: True})
    global_entry.add_to_hass(hass)
    today = dt_util.now().date()
    task = MaintenanceTask.from_dict(
        {
            "id": TASK_ID_1,
            "name": "Second Saturday",
            "type": "service",
            "enabled": True,
            "schedule": {"kind": "nth_weekday", "nth": 2, "weekday": 5},
            "created_at": today.isoformat(),
            "warning_days": 1,
            "schedule_time": "12:00",
            "history": [],
        }
    )
    event = calendar_entity._create_event_for_task(task, "Object", today, today + timedelta(days=60))
    assert event is not None
    assert isinstance(event.start, datetime) and event.start.hour == 12 and event.start.minute == 0
    assert (event.end - event.start) == timedelta(minutes=30)


def _global_with_flag(hass: HomeAssistant) -> MockConfigEntry:
    data = build_global_entry_data()
    # CONF_ADVANCED_ADAPTIVE present = the one-time "detect advanced usage"
    # seeding in async_setup_entry stays off; otherwise it would re-derive the
    # schedule_time flag from the (time-less) seeded tasks and switch it off.
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        options={**data, CONF_ADVANCED_ADAPTIVE: False, CONF_ADVANCED_SCHEDULE_TIME: True},
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _object_with(hass: HomeAssistant, task_extra: dict[str, Any], uid: str = "maintenance_supporter_168") -> MockConfigEntry:
    task = build_task_data(last_performed="2026-04-05")
    task.pop("interval_days", None)
    task.update(task_extra)
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Flat",
        data=build_object_entry_data(object_data=build_object_data(name="Flat " + uid[-3:], object_id="obj_" + uid[-3:]), tasks={TASK_ID_1: task}),
        source="user",
        unique_id=uid,
    )
    entry.add_to_hass(hass)
    return entry


async def _edit_task_form(hass: HomeAssistant, obj: MockConfigEntry):
    result = await hass.config_entries.options.async_init(obj.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "manage_tasks"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], user_input={"selected_task": TASK_ID_1, "go_back": False})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "edit_task"})
    assert result["step_id"] == "edit_task"
    return result


async def test_options_flow_offers_and_stores_the_time_on_a_weekdays_task(hass: HomeAssistant) -> None:
    obj = _object_with(hass, {"schedule_type": "weekdays", "schedule": {"kind": "weekdays", "weekdays": [6]}})
    await setup_integration(hass, _global_with_flag(hass), obj)
    result = await _edit_task_form(hass, obj)
    keys = {str(k) for k in result["data_schema"].schema}
    assert "schedule_time" in keys, "the time selector must be offered on a calendar kind"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"name": "Sunday round", "type": "cleaning", "weekdays": ["6"], "warning_days": 1, "schedule_time": "21:00:00", "go_back": False},
    )
    assert result["type"] == FlowResultType.MENU, result
    stored = obj.data[CONF_TASKS][TASK_ID_1]
    assert stored["schedule_time"] == "21:00"
    assert stored["schedule"]["kind"] == "weekdays"


async def test_options_flow_offers_the_time_on_a_one_off_but_not_a_manual_task(hass: HomeAssistant) -> None:
    obj = _object_with(hass, {"schedule_type": "one_time", "due_date": "2026-09-14"})
    await setup_integration(hass, _global_with_flag(hass), obj)
    result = await _edit_task_form(hass, obj)
    assert "schedule_time" in {str(k) for k in result["data_schema"].schema}

    manual = _object_with(hass, {"schedule_type": "manual"}, uid="maintenance_supporter_168m")
    await hass.config_entries.async_setup(manual.entry_id)
    await hass.async_block_till_done()
    result = await _edit_task_form(hass, manual)
    assert "schedule_time" not in {str(k) for k in result["data_schema"].schema}
