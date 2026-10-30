"""#239: a reminder leaves the phones once its task no longer needs doing.

Only complete, skip and reset took a reminder off the phones. A trigger whose
sensor recovered on its own (a plant sensor, several times a day) put the
task back to OK and left one push per episode behind; a postponed task kept
its "overdue" push.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.maintenance_supporter.const import (
    CONF_QUIET_HOURS_ENABLED,
    CONF_TASKS,
    DOMAIN,
    NOTIFICATION_MANAGER_KEY,
    MaintenanceStatus,
    ScheduleType,
)

from .conftest import (
    TASK_ID_1,
    build_task_data,
    make_global_entry,
    make_object_entry,
    set_sensor_state,
    setup_integration,
)
from .task_results import as_results

PHONE = "notify.mobile_app_phone"
CLEAR = {"message": "clear_notification", "data": {"tag": f"maintenance_{TASK_ID_1}"}}
# Quiet hours are on by default and the test clock is US/Pacific: at night
# they would hold the reminder these tests take back.
NO_QUIET_HOURS = {CONF_QUIET_HOURS_ENABLED: False}


def _coordinator(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    return hass.config_entries.async_get_entry(entry.entry_id).runtime_data.coordinator


def _plant_task() -> dict[str, Any]:
    return build_task_data(
        task_id=TASK_ID_1,
        name="Water the Plant",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={"type": "threshold", "entity_id": "sensor.moisture", "entity_ids": ["sensor.moisture"], "trigger_below": 20},
    )


async def test_a_trigger_that_recovers_takes_its_reminder_off_the_phone(hass: HomeAssistant) -> None:
    """The reported case: triggered, reminded, recovered without a completion."""
    phone = async_mock_service(hass, "notify", "mobile_app_phone")
    set_sensor_state(hass, "sensor.moisture", "50")
    g = make_global_entry(hass, notifications_enabled=True, notify_service=PHONE, extra_data=NO_QUIET_HOURS)
    obj = make_object_entry(hass, tasks={TASK_ID_1: _plant_task()})
    await setup_integration(hass, g, obj)
    coordinator = _coordinator(hass, obj)

    set_sensor_state(hass, "sensor.moisture", "10")
    await hass.async_block_till_done()
    await coordinator.async_refresh()
    assert coordinator.data[CONF_TASKS][TASK_ID_1].status == MaintenanceStatus.TRIGGERED
    assert [c.data["message"] != CLEAR["message"] for c in phone] == [True], "one reminder went out"

    set_sensor_state(hass, "sensor.moisture", "50")
    await hass.async_block_till_done()
    await coordinator.async_refresh()
    assert coordinator.data[CONF_TASKS][TASK_ID_1].status == MaintenanceStatus.OK
    assert phone[-1].data == CLEAR

    # Once, on the way out: the refreshes after it leave the phone alone.
    await coordinator.async_refresh()
    await coordinator.async_refresh()
    assert [c.data for c in phone].count(CLEAR) == 1


async def test_a_completed_task_is_cleared_once(hass: HomeAssistant) -> None:
    """A completion dismisses the reminder itself, for the people it went to
    before a rotation handed on; the refresh inside it leaves that alone."""
    phone = async_mock_service(hass, "notify", "mobile_app_phone")
    set_sensor_state(hass, "sensor.moisture", "10")
    g = make_global_entry(hass, notifications_enabled=True, notify_service=PHONE, extra_data=NO_QUIET_HOURS)
    obj = make_object_entry(hass, tasks={TASK_ID_1: _plant_task()})
    await setup_integration(hass, g, obj)
    coordinator = _coordinator(hass, obj)
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    assert coordinator.data[CONF_TASKS][TASK_ID_1].status == MaintenanceStatus.TRIGGERED
    assert nm.was_reminded(obj.entry_id, TASK_ID_1)

    await coordinator.complete_maintenance(TASK_ID_1)
    await hass.async_block_till_done()
    assert [c.data for c in phone].count(CLEAR) == 1


async def test_a_postponed_task_takes_its_overdue_reminder_off_the_phone(hass: HomeAssistant) -> None:
    phone = async_mock_service(hass, "notify", "mobile_app_phone")
    g = make_global_entry(hass, notifications_enabled=True, notify_service=PHONE, extra_data=NO_QUIET_HOURS)
    last = (dt_util.now().date() - timedelta(days=60)).isoformat()
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(interval_days=30, last_performed=last)})
    await setup_integration(hass, g, obj)
    coordinator = _coordinator(hass, obj)
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    assert coordinator.data[CONF_TASKS][TASK_ID_1].status == MaintenanceStatus.OVERDUE
    assert nm.was_reminded(obj.entry_id, TASK_ID_1)

    await coordinator.async_postpone_task(TASK_ID_1, dt_util.now().date() + timedelta(days=10))
    await hass.async_block_till_done()
    assert coordinator.data[CONF_TASKS][TASK_ID_1].status == MaintenanceStatus.OK
    assert [c.data for c in phone].count(CLEAR) == 1


async def test_a_task_still_due_keeps_its_reminder(hass: HomeAssistant) -> None:
    """A trigger recovering while the task is due by its schedule is no
    reason to clear: the task still needs doing."""
    g = make_global_entry(hass, notifications_enabled=True, notify_service=PHONE, extra_data=NO_QUIET_HOURS)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(interval_days=30)})
    await setup_integration(hass, g, obj)
    coordinator = _coordinator(hass, obj)
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    nm._last_notified[f"{obj.entry_id}_{TASK_ID_1}_triggered"] = dt_util.now()
    coordinator._previous_statuses[TASK_ID_1] = MaintenanceStatus.TRIGGERED

    dismiss = AsyncMock()
    with patch.object(nm, "async_dismiss_task_notification", dismiss), patch.object(nm, "async_task_status_changed", AsyncMock()):
        await coordinator._async_notify_status_changes(as_results({TASK_ID_1: {"name": "Filter", "_status": MaintenanceStatus.OVERDUE}}))
        dismiss.assert_not_called()
        # Once it is done with (here: back to OK), the reminder goes.
        await coordinator._async_notify_status_changes(as_results({TASK_ID_1: {"name": "Filter", "_status": MaintenanceStatus.OK}}))
    dismiss.assert_called_once()
