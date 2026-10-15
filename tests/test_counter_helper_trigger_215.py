"""#215: a counter helper (``counter.*``) is a trigger source.

Its state is the number it counts (prints, cycles, uses), so threshold and
counter triggers read it like a numeric sensor, and the docs suggest one for
a printer's nozzle hours. The pickers left the domain out: the setup flow
since its domain list was written, the task dialog since its entity picker
replaced the free text field (2.56.0). The dialog's list is pinned to the
flow's by the TRIGGER_PICKER_DOMAINS parity test.
"""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.config_entries import ConfigEntry, ConfigFlowResult
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASK_NAME,
    CONF_TASK_SCHEDULE_TYPE,
    CONF_TASK_TYPE,
    CONF_TASK_WARNING_DAYS,
    CONF_TASKS,
    CONF_TRIGGER_ABOVE,
    CONF_TRIGGER_ATTRIBUTE,
    CONF_TRIGGER_DELTA_MODE,
    CONF_TRIGGER_ENTITY,
    CONF_TRIGGER_TARGET_VALUE,
    CONF_TRIGGER_TYPE,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceTypeEnum,
    ScheduleType,
    TriggerType,
)
from custom_components.maintenance_supporter.websocket.objects import ws_get_objects

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_task_data,
    call_ws_handler,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)

PRINTS = "counter.printer_nozzle_hours"


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _set_counter(hass: HomeAssistant, value: int) -> None:
    # What the counter integration writes: the count as state, its settings as attributes.
    hass.states.async_set(PRINTS, str(value), {"initial": 0, "step": 1, "editable": True, "friendly_name": "Nozzle hours"})


async def _sensor_task_form(hass: HomeAssistant, global_entry: ConfigEntry, name: str) -> ConfigFlowResult:
    await setup_integration(hass, global_entry)
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "create_object"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={"name": "Printer"})
    if result.get("step_id") == "task_menu":
        result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "add_task"})
    return await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: name,
            CONF_TASK_TYPE: MaintenanceTypeEnum.REPLACEMENT,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )


async def test_the_setup_flow_takes_a_counter_helper(hass: HomeAssistant, global_entry: ConfigEntry) -> None:
    _set_counter(hass, 120)
    result = await _sensor_task_form(hass, global_entry, "Replace nozzle")
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_ENTITY: [PRINTS]})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_ATTRIBUTE: "_state"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_TYPE: TriggerType.COUNTER})
    assert result["step_id"] == "trigger_counter"
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TARGET_VALUE: 500, CONF_TRIGGER_DELTA_MODE: True, CONF_TASK_WARNING_DAYS: 7},
    )
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "finish"})
    assert result["type"] == FlowResultType.CREATE_ENTRY
    tc = next(iter(result["data"][CONF_TASKS].values()))["trigger_config"]
    assert tc["entity_id"] == PRINTS
    assert tc["type"] == TriggerType.COUNTER


async def test_a_compound_condition_takes_a_counter_helper(hass: HomeAssistant, global_entry: ConfigEntry) -> None:
    """The flow's condition picker had its own, shorter list (six domains)
    than the dialog's condition rows; both now use the trigger list."""
    _set_counter(hass, 120)
    hass.states.async_set("sensor.nozzle_temp", "210", {"unit_of_measurement": "°C"})
    result = await _sensor_task_form(hass, global_entry, "Replace nozzle")
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_ENTITY: ["sensor.nozzle_temp"]})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_ATTRIBUTE: "_state"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_TYPE: TriggerType.COMPOUND})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={"compound_logic": "or"})
    assert result["step_id"] == "compound_condition_entity"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_ENTITY: [PRINTS]})
    assert result["step_id"] == "compound_condition_type"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_ABOVE: 500})
    assert result["step_id"] == "compound_review"


async def _trigger_active(hass: HomeAssistant, entry_id: str, task_id: str) -> Any:
    conn = make_ws_connection()
    await call_ws_handler(ws_get_objects, hass, conn, {"id": 1, "type": "maintenance_supporter/objects"})
    obj = next(o for o in conn.send_result.call_args.args[1]["objects"] if o["entry_id"] == entry_id)
    return next(t for t in obj["tasks"] if t["id"] == task_id)["trigger_active"]


async def test_a_counter_helper_drives_threshold_and_counter_triggers(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    _set_counter(hass, 100)
    threshold = build_task_data(
        task_id=TASK_ID_1,
        name="Inspect nozzle",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={"type": "threshold", "entity_id": PRINTS, "entity_ids": [PRINTS], "trigger_above": 150},
    )
    counter = build_task_data(
        task_id="task_nozzle",
        name="Replace nozzle",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "counter",
            "entity_id": PRINTS,
            "entity_ids": [PRINTS],
            "trigger_target_value": 80,
            "trigger_delta_mode": True,
            "trigger_baseline_value": 100,
        },
    )
    obj = make_object_entry(hass, tasks={TASK_ID_1: threshold, "task_nozzle": counter}, name="Printer", uid="printer_215")
    await setup_integration(hass, global_entry, obj)

    _set_counter(hass, 179)
    await hass.async_block_till_done()
    assert await _trigger_active(hass, obj.entry_id, TASK_ID_1) is True
    assert await _trigger_active(hass, obj.entry_id, "task_nozzle") is False

    _set_counter(hass, 180)
    await hass.async_block_till_done()
    assert await _trigger_active(hass, obj.entry_id, "task_nozzle") is True
