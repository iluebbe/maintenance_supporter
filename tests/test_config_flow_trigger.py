"""Tests for config_flow_trigger.py mixin (runtime, compound, go-back, multi-entity)."""

from __future__ import annotations

from typing import Any

import pytest

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASK_INTERVAL_DAYS,
    CONF_TASK_NAME,
    CONF_TASK_SCHEDULE_TYPE,
    CONF_TASK_TYPE,
    CONF_TASK_WARNING_DAYS,
    CONF_TASKS,
    CONF_TRIGGER_ABOVE,
    CONF_TRIGGER_ATTRIBUTE,
    CONF_TRIGGER_BELOW,
    CONF_TRIGGER_DELTA_MODE,
    CONF_TRIGGER_ENTITY,
    CONF_TRIGGER_ENTITY_LOGIC,
    CONF_TRIGGER_FOR_MINUTES,
    CONF_TRIGGER_FROM_STATE,
    CONF_TRIGGER_ON_STATES,
    CONF_TRIGGER_RUNTIME_HOURS,
    CONF_TRIGGER_TARGET_CHANGES,
    CONF_TRIGGER_TARGET_VALUE,
    CONF_TRIGGER_TO_STATE,
    CONF_TRIGGER_TYPE,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceTypeEnum,
    ScheduleType,
    TriggerType,
)

from .conftest import build_global_entry_data, setup_integration


@pytest.fixture
def global_config_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


async def _navigate_to_add_task(
    hass: HomeAssistant, global_entry: ConfigEntry,
) -> dict[str, Any]:
    """Navigate config flow to 'add task' step."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    # Step 1: User menu - select "create_object"
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_object"},
    )
    # Step 2: Object creation form - provide name
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"name": "Test Object"},
    )
    # Should be at task_menu or add_task step
    if result.get("step_id") == "task_menu":
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"],
            {"next_step_id": "add_task"},
        )
    return result


# ─── Runtime Trigger Flow ─────────────────────────────────────────────────


async def test_runtime_trigger_full_flow(
    hass: HomeAssistant, global_config_entry: ConfigEntry,
) -> None:
    """Test full runtime trigger flow: sensor→attribute→type→runtime_config→finish."""
    hass.states.async_set("sensor.pump", "on", {"unit_of_measurement": ""})
    # Runtime needs a numeric value to pass attribute selection
    hass.states.async_set("sensor.pump_hours", "120.5", {"unit_of_measurement": "h"})

    result = await _navigate_to_add_task(hass, global_config_entry)

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Runtime Test",
            CONF_TASK_TYPE: MaintenanceTypeEnum.SERVICE,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    assert result["step_id"] == "sensor_select"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.pump_hours"]},
    )
    assert result["step_id"] == "sensor_attribute"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    assert result["step_id"] == "trigger_type"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.RUNTIME},
    )
    assert result["step_id"] == "trigger_runtime"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TRIGGER_RUNTIME_HOURS: 200,
            CONF_TASK_WARNING_DAYS: 7,
        },
    )
    assert result["type"] == FlowResultType.MENU

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    task = list(result["data"][CONF_TASKS].values())[0]
    assert task["trigger_config"]["type"] == TriggerType.RUNTIME
    assert task["trigger_config"][CONF_TRIGGER_RUNTIME_HOURS] == 200


async def test_runtime_trigger_custom_on_states(
    hass: HomeAssistant, global_config_entry: ConfigEntry,
) -> None:
    """Test runtime trigger with custom on_states."""
    hass.states.async_set("sensor.pump_hours", "100", {"unit_of_measurement": "h"})

    result = await _navigate_to_add_task(hass, global_config_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Custom On States",
            CONF_TASK_TYPE: MaintenanceTypeEnum.SERVICE,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.pump_hours"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.RUNTIME},
    )

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TRIGGER_RUNTIME_HOURS: 100,
            CONF_TRIGGER_ON_STATES: "running,active",
            CONF_TASK_WARNING_DAYS: 7,
        },
    )
    assert result["type"] == FlowResultType.MENU

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    task = list(result["data"][CONF_TASKS].values())[0]
    on_states = task["trigger_config"].get(CONF_TRIGGER_ON_STATES)
    assert on_states == ["running", "active"]


# ─── Compound Trigger Flow ────────────────────────────────────────────────


async def test_compound_trigger_two_conditions(
    hass: HomeAssistant, global_config_entry: ConfigEntry,
) -> None:
    """Test compound trigger with 2 threshold conditions."""
    hass.states.async_set("sensor.temp", "25.0", {"unit_of_measurement": "°C"})
    hass.states.async_set("sensor.humidity", "60", {"unit_of_measurement": "%"})

    result = await _navigate_to_add_task(hass, global_config_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Compound Test",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )

    # Select first entity (for the main trigger)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.temp"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )

    # Select compound trigger type
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.COMPOUND},
    )
    assert result["step_id"] == "compound_logic"

    # Select AND logic
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"compound_logic": "and"},
    )
    assert result["step_id"] == "compound_condition_entity"

    # First condition: entity → type → config (no attribute step in compound)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.temp"]},
    )
    assert result["step_id"] == "compound_condition_type"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD},
    )
    assert result["step_id"] == "compound_condition_threshold"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ABOVE: 30.0},
    )
    assert result["step_id"] == "compound_review"

    # Add another condition
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"compound_action": "add"},
    )
    assert result["step_id"] == "compound_condition_entity"

    # Second condition: entity → type → config
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.humidity"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ABOVE: 80.0},
    )
    assert result["step_id"] == "compound_review"

    # Finish compound → goes to task_menu
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"compound_action": "finish"},
    )
    assert result["type"] == FlowResultType.MENU

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    task = list(result["data"][CONF_TASKS].values())[0]
    tc = task["trigger_config"]
    assert tc["type"] == "compound"
    assert tc["compound_logic"] == "AND"
    assert len(tc["conditions"]) == 2


# ─── Go-Back Navigation ──────────────────────────────────────────────────


async def test_go_back_sensor_select(
    hass: HomeAssistant, global_config_entry: ConfigEntry,
) -> None:
    """Test go_back from sensor_select returns to previous step."""
    hass.states.async_set("sensor.temp", "25.0", {"unit_of_measurement": "°C"})

    result = await _navigate_to_add_task(hass, global_config_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Go Back Test",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    assert result["step_id"] == "sensor_select"

    # Hit go_back
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.temp"], "go_back": True},
    )
    # Should go back to add_task step
    assert result["step_id"] == "add_task"


async def test_go_back_trigger_type(
    hass: HomeAssistant, global_config_entry: ConfigEntry,
) -> None:
    """Test go_back from trigger_type returns to sensor_attribute."""
    hass.states.async_set("sensor.temp", "25.0", {"unit_of_measurement": "°C"})

    result = await _navigate_to_add_task(hass, global_config_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Go Back Type",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.temp"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    assert result["step_id"] == "trigger_type"

    # Go back
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD, "go_back": True},
    )
    assert result["step_id"] == "sensor_attribute"


async def test_go_back_threshold_config(
    hass: HomeAssistant, global_config_entry: ConfigEntry,
) -> None:
    """Test go_back from threshold config returns to trigger_type."""
    hass.states.async_set("sensor.temp", "25.0", {"unit_of_measurement": "°C"})

    result = await _navigate_to_add_task(hass, global_config_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Go Back Threshold",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.temp"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD},
    )
    assert result["step_id"] == "trigger_threshold"

    # Go back
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ABOVE: 30, CONF_TASK_WARNING_DAYS: 7, "go_back": True},
    )
    assert result["step_id"] == "trigger_type"


# ─── Multi-Entity Tests ──────────────────────────────────────────────────


async def test_multi_entity_threshold(
    hass: HomeAssistant, global_config_entry: ConfigEntry,
) -> None:
    """Test multi-entity threshold stores entity_ids."""
    hass.states.async_set("sensor.temp1", "25.0", {"unit_of_measurement": "°C"})
    hass.states.async_set("sensor.temp2", "26.0", {"unit_of_measurement": "°C"})

    result = await _navigate_to_add_task(hass, global_config_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Multi Entity",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    # Select multiple entities
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.temp1", "sensor.temp2"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TRIGGER_ABOVE: 30.0,
            CONF_TRIGGER_ENTITY_LOGIC: "any",
            CONF_TASK_WARNING_DAYS: 7,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )

    assert result["type"] == FlowResultType.CREATE_ENTRY
    task = list(result["data"][CONF_TASKS].values())[0]
    tc = task["trigger_config"]
    assert tc["entity_ids"] == ["sensor.temp1", "sensor.temp2"]
    assert tc.get(CONF_TRIGGER_ENTITY_LOGIC) == "any"


# ─── Mixin Unit Tests ────────────────────────────────────────────────────


def test_mixin_go_back_adds_field() -> None:
    """Test that _mixin_add_go_back adds go_back field when _on_cancel is set."""
    from custom_components.maintenance_supporter.config_flow_trigger import TriggerConfigMixin

    mixin = TriggerConfigMixin()
    mixin._on_cancel = lambda: None  # type: ignore[assignment]
    schema_dict: dict[Any, Any] = {"existing": str}
    result = mixin._mixin_add_go_back(schema_dict)
    keys = [str(k) for k in result.keys()]
    assert any("go_back" in k for k in keys)


def test_mixin_go_back_no_field() -> None:
    """Test that _mixin_add_go_back doesn't add go_back when no _on_cancel."""
    from custom_components.maintenance_supporter.config_flow_trigger import TriggerConfigMixin

    mixin = TriggerConfigMixin()
    mixin._on_cancel = None
    schema_dict: dict[Any, Any] = {"existing": str}
    result = mixin._mixin_add_go_back(schema_dict)
    keys = [str(k) for k in result.keys()]
    assert not any("go_back" in k for k in keys)


async def test_attribute_no_numeric(
    hass: HomeAssistant, global_config_entry: ConfigEntry,
) -> None:
    """Test that non-numeric entity at attribute step shows error."""
    # Entity with no numeric state or attributes
    hass.states.async_set("binary_sensor.door", "off", {"friendly_name": "Door"})

    result = await _navigate_to_add_task(hass, global_config_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "No Numeric",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["binary_sensor.door"]},
    )
    # Should show error on sensor_select since no numeric attributes
    assert result["type"] == FlowResultType.FORM
    assert result.get("errors", {}).get(CONF_TRIGGER_ENTITY) == "invalid_entity"


async def test_attribute_multiple_numeric(
    hass: HomeAssistant, global_config_entry: ConfigEntry,
) -> None:
    """Test entity with multiple numeric attributes shows all options."""
    hass.states.async_set("sensor.device", "25.0", {
        "unit_of_measurement": "°C",
        "humidity": 60.0,
        "pressure": 1013.0,
        "friendly_name": "Multi Sensor",
    })

    result = await _navigate_to_add_task(hass, global_config_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Multi Attr",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.device"]},
    )
    # Should be at sensor_attribute with multiple options
    assert result["step_id"] == "sensor_attribute"
    assert result["type"] == FlowResultType.FORM
