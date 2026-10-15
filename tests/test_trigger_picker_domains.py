"""The trigger and environment pickers offer what the engine reads (audit after #215).

The task dialog took a trigger entity as free text until 2.56.0, when the
native picker with the flow's domain list replaced it. Every domain missing
from that list became unreachable although the triggers handle it: a
selection for a state change, an ISO date for the due-date trigger, a
timer's active time, an available update. The flow's EntitySelector also
validates on submit, so a task already watching such an entity could not be
saved in the trigger step without picking another one. The environmental
picker filtered sensors by device_class although any sensor with statistics
feeds the correlation.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASK_NAME,
    CONF_TASK_SCHEDULE_TYPE,
    CONF_TASK_TYPE,
    CONF_TRIGGER_ENTITY,
    DOMAIN,
    MaintenanceTypeEnum,
    ScheduleType,
)
from custom_components.maintenance_supporter.websocket.objects import ws_get_objects

from .conftest import (
    TASK_ID_1,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)

# entity_id, state: each one the trigger engine reads
NEW_SOURCES = [
    ("input_select.washer_programme", "eco"),
    ("select.washer_programme", "cotton"),
    ("input_datetime.filter_due", "2026-11-01"),
    ("date.next_service", "2026-11-01"),
    ("datetime.next_service", "2026-11-01T08:00:00+00:00"),
    ("timer.dryer", "idle"),
    ("update.router_firmware", "off"),
]


@pytest.mark.parametrize(("entity_id", "state"), NEW_SOURCES)
async def test_the_setup_flow_takes_the_entity(hass: HomeAssistant, entity_id: str, state: str) -> None:
    hass.states.async_set(entity_id, state)
    await setup_integration(hass, make_global_entry(hass))
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "create_object"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={"name": "Washer"})
    if result.get("step_id") == "task_menu":
        result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "add_task"})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Check",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_ENTITY: [entity_id]})
    assert result["step_id"] == "sensor_attribute"


def _state_change_task(entity_id: str) -> dict[str, Any]:
    return build_task_data(
        task_id=TASK_ID_1,
        name="Descale",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "state_change",
            "entity_id": entity_id,
            "entity_ids": [entity_id],
            "trigger_to_state": "descale",
            "trigger_target_changes": 1,
        },
    )


async def test_a_task_on_such_an_entity_can_be_saved_in_the_trigger_step(hass: HomeAssistant) -> None:
    """The step pre-fills the stored entity; its selector refused it on submit."""
    hass.states.async_set("input_select.washer_programme", "eco")
    obj = make_object_entry(hass, tasks={TASK_ID_1: _state_change_task("input_select.washer_programme")}, name="Washer", uid="washer_audit")
    await setup_integration(hass, make_global_entry(hass), obj)

    result = await hass.config_entries.options.async_init(obj.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "manage_tasks"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"selected_task": TASK_ID_1, "go_back": False})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "edit_trigger"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "edit_trigger_proceed"})
    assert result["step_id"] == "opt_sensor_select"
    result = await hass.config_entries.options.async_configure(result["flow_id"], {CONF_TRIGGER_ENTITY: ["input_select.washer_programme"]})
    assert result["step_id"] == "opt_sensor_attribute"


async def _trigger_active(hass: HomeAssistant, entry_id: str) -> Any:
    conn = make_ws_connection()
    await call_ws_handler(ws_get_objects, hass, conn, {"id": 1, "type": "maintenance_supporter/objects"})
    obj = next(o for o in conn.send_result.call_args.args[1]["objects"] if o["entry_id"] == entry_id)
    return next(t for t in obj["tasks"] if t["id"] == TASK_ID_1)["trigger_active"]


async def test_a_select_drives_a_state_change_trigger(hass: HomeAssistant) -> None:
    hass.states.async_set("select.washer_programme", "cotton")
    obj = make_object_entry(hass, tasks={TASK_ID_1: _state_change_task("select.washer_programme")}, name="Washer", uid="washer_select")
    await setup_integration(hass, make_global_entry(hass), obj)
    assert await _trigger_active(hass, obj.entry_id) is False
    hass.states.async_set("select.washer_programme", "descale")
    await hass.async_block_till_done()
    assert await _trigger_active(hass, obj.entry_id) is True


async def test_a_date_helper_drives_a_due_date_trigger(hass: HomeAssistant) -> None:
    soon = (dt_util.now().date() + timedelta(days=2)).isoformat()
    later = (dt_util.now().date() + timedelta(days=30)).isoformat()
    hass.states.async_set("input_datetime.filter_due", later, {"has_date": True, "has_time": False})
    task = build_task_data(
        task_id=TASK_ID_1,
        name="Change filter",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "due_date",
            "entity_id": "input_datetime.filter_due",
            "entity_ids": ["input_datetime.filter_due"],
            "trigger_days_before": 3,
        },
    )
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Purifier", uid="purifier_date")
    await setup_integration(hass, make_global_entry(hass), obj)
    assert await _trigger_active(hass, obj.entry_id) is False
    hass.states.async_set("input_datetime.filter_due", soon, {"has_date": True, "has_time": False})
    await hass.async_block_till_done()
    assert await _trigger_active(hass, obj.entry_id) is True


async def test_the_environment_picker_takes_any_sensor(hass: HomeAssistant) -> None:
    """Fine dust for an air filter, soil moisture for a garden task."""
    hass.states.async_set("sensor.dp", "20")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={"type": "threshold", "entity_id": "sensor.dp", "entity_ids": ["sensor.dp"], "trigger_above": 100},
    )
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Purifier", uid="purifier_env")
    global_entry: MockConfigEntry = make_global_entry(hass, options={"advanced_adaptive_visible": True})
    await setup_integration(hass, global_entry, obj)

    result = await hass.config_entries.options.async_init(obj.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "manage_tasks"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"selected_task": TASK_ID_1, "go_back": False})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "adaptive_scheduling"})
    assert result["step_id"] == "adaptive_scheduling"
    env = next(v for k, v in result["data_schema"].schema.items() if str(k) == "environmental_entity")
    assert env.config.get("domain") == ["sensor"]
    assert not env.config.get("device_class")
