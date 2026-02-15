"""Tests for the Maintenance Supporter config flow.

Tests cover:
- Global setup (first run, duplicate prevention)
- Object creation (name validation, task menu)
- Time-based, sensor-based (threshold/counter/state_change), and manual task flows
- Multiple tasks on one object
- Finish validation (at least one task required)
- Module structure after config_flow.py split
"""

from __future__ import annotations

from unittest.mock import patch

import pytest

from homeassistant import config_entries
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType

from custom_components.maintenance_supporter.const import (
    CONF_DEFAULT_WARNING_DAYS,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
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
    CONF_TRIGGER_FOR_MINUTES,
    CONF_TRIGGER_FROM_STATE,
    CONF_TRIGGER_TARGET_CHANGES,
    CONF_TRIGGER_TARGET_VALUE,
    CONF_TRIGGER_TO_STATE,
    CONF_TRIGGER_TYPE,
    DEFAULT_WARNING_DAYS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceTypeEnum,
    ScheduleType,
    TriggerType,
)

from .conftest import build_global_entry_data


# ─── 3.1 Global Setup ───────────────────────────────────────────────────


async def test_global_setup_first_run(hass: HomeAssistant) -> None:
    """Test global setup form is shown on first run with no global entry."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    # When no global entry exists, it should go straight to global_setup
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "global_setup"


async def test_global_setup_creates_entry(hass: HomeAssistant) -> None:
    """Test that completing global setup creates a global config entry."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["step_id"] == "global_setup"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_DEFAULT_WARNING_DAYS: 10,
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.mobile",
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert result["title"] == "Maintenance Supporter"
    assert result["data"][CONF_DEFAULT_WARNING_DAYS] == 10
    assert result["data"][CONF_NOTIFICATIONS_ENABLED] is True
    assert result["data"][CONF_NOTIFY_SERVICE] == "notify.mobile"


async def test_global_setup_default_values(hass: HomeAssistant) -> None:
    """Test global setup with default values."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert result["data"][CONF_DEFAULT_WARNING_DAYS] == DEFAULT_WARNING_DAYS
    assert result["data"][CONF_NOTIFICATIONS_ENABLED] is False


async def test_global_setup_not_duplicated(
    hass: HomeAssistant, global_config_entry: ConfigEntry
) -> None:
    """Test that a second global entry cannot be created."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    # With global entry existing, should show menu for creating objects
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "user"


# ─── 3.2 Object Creation ────────────────────────────────────────────────


async def test_create_object_form(
    hass: HomeAssistant, global_config_entry: ConfigEntry
) -> None:
    """Test that create_object step shows a form."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["type"] == FlowResultType.MENU

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_object"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "create_object"


async def test_create_object_with_name(
    hass: HomeAssistant, global_config_entry: ConfigEntry
) -> None:
    """Test creating an object goes to task menu."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_object"},
    )

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"name": "Pool Pump", "manufacturer": "Intex"},
    )
    # Should go to task menu
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_menu"


async def test_create_object_duplicate_name(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that duplicate object name triggers an error."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_object"},
    )

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"name": "Pool Pump"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["errors"] == {"name": "name_exists"}


# ─── 3.3 Time-Based Task Flow ───────────────────────────────────────────


async def _navigate_to_add_task(
    hass: HomeAssistant, global_entry: ConfigEntry
) -> dict:
    """Helper to navigate to add_task step."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_object"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"name": "Test Object"},
    )
    # Now at task_menu
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "add_task"},
    )
    assert result["step_id"] == "add_task"
    return result


async def test_time_based_task_flow(
    hass: HomeAssistant, global_config_entry: ConfigEntry
) -> None:
    """Test full time-based task creation flow ending with create_entry."""
    result = await _navigate_to_add_task(hass, global_config_entry)

    # Add task details
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Filter Cleaning",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.TIME_BASED,
        },
    )
    assert result["step_id"] == "time_based"

    # Configure time-based schedule
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_INTERVAL_DAYS: 30,
            CONF_TASK_WARNING_DAYS: 7,
        },
    )
    # Should return to task menu
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_menu"

    # Finish
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert result["title"] == "Test Object"

    # Verify task data
    tasks = result["data"][CONF_TASKS]
    assert len(tasks) == 1
    task = list(tasks.values())[0]
    assert task["name"] == "Filter Cleaning"
    assert task["interval_days"] == 30
    assert task["schedule_type"] == ScheduleType.TIME_BASED


async def test_time_based_invalid_interval(
    hass: HomeAssistant, global_config_entry: ConfigEntry
) -> None:
    """Test that interval <= 0 is rejected by the NumberSelector schema (min=1).

    The NumberSelector has min=1, so voluptuous raises an error before
    the flow's own validation. We verify the form rejects the value
    by checking that a vol.Invalid / vol.MultipleInvalid is raised.
    """
    import voluptuous as vol

    result = await _navigate_to_add_task(hass, global_config_entry)

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Test Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.TIME_BASED,
        },
    )

    with pytest.raises(vol.Invalid):
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"],
            user_input={CONF_TASK_INTERVAL_DAYS: 0},
        )


# ─── 3.4 Sensor-Based Trigger Flow ──────────────────────────────────────


async def test_sensor_threshold_flow(
    hass: HomeAssistant, global_config_entry: ConfigEntry
) -> None:
    """Test full sensor-based threshold trigger flow."""
    # Create a mock sensor
    hass.states.async_set(
        "sensor.pool_pressure",
        "1.2",
        {"unit_of_measurement": "bar", "pressure": 1.2},
    )

    result = await _navigate_to_add_task(hass, global_config_entry)

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Pressure Monitor",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    assert result["step_id"] == "sensor_select"

    # Select sensor
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: "sensor.pool_pressure"},
    )
    assert result["step_id"] == "sensor_attribute"

    # Select attribute (use state)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    assert result["step_id"] == "trigger_type"

    # Select threshold type
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD},
    )
    assert result["step_id"] == "trigger_threshold"

    # Configure thresholds
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TRIGGER_ABOVE: 1.5,
            CONF_TRIGGER_FOR_MINUTES: 0,
            CONF_TASK_WARNING_DAYS: 7,
        },
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_menu"

    # Finish
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY

    task = list(result["data"][CONF_TASKS].values())[0]
    assert task["trigger_config"]["entity_id"] == "sensor.pool_pressure"
    assert task["trigger_config"][CONF_TRIGGER_ABOVE] == 1.5
    assert task["trigger_config"]["type"] == TriggerType.THRESHOLD


async def test_sensor_counter_flow(
    hass: HomeAssistant, global_config_entry: ConfigEntry
) -> None:
    """Test sensor-based counter trigger flow."""
    hass.states.async_set("sensor.runtime_hours", "500", {"unit_of_measurement": "h"})

    result = await _navigate_to_add_task(hass, global_config_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Runtime Counter",
            CONF_TASK_TYPE: MaintenanceTypeEnum.SERVICE,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: "sensor.runtime_hours"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.COUNTER},
    )
    assert result["step_id"] == "trigger_counter"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TRIGGER_TARGET_VALUE: 1000,
            CONF_TRIGGER_DELTA_MODE: True,
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
    assert task["trigger_config"][CONF_TRIGGER_TARGET_VALUE] == 1000
    assert task["trigger_config"][CONF_TRIGGER_DELTA_MODE] is True


async def test_sensor_state_change_flow(
    hass: HomeAssistant, global_config_entry: ConfigEntry
) -> None:
    """Test sensor-based state change trigger flow with numeric sensor."""
    hass.states.async_set(
        "sensor.door_count", "12", {"unit_of_measurement": "opens"}
    )

    result = await _navigate_to_add_task(hass, global_config_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Door Opens",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: "sensor.door_count"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.STATE_CHANGE},
    )
    assert result["step_id"] == "trigger_state_change"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TRIGGER_FROM_STATE: "off",
            CONF_TRIGGER_TO_STATE: "on",
            CONF_TRIGGER_TARGET_CHANGES: 10,
            CONF_TASK_WARNING_DAYS: 7,
        },
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_menu"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    task = list(result["data"][CONF_TASKS].values())[0]
    assert task["trigger_config"]["type"] == TriggerType.STATE_CHANGE
    assert task["trigger_config"][CONF_TRIGGER_TARGET_CHANGES] == 10


async def test_sensor_select_invalid_entity(
    hass: HomeAssistant, global_config_entry: ConfigEntry
) -> None:
    """Test sensor select with non-existent entity shows error."""
    result = await _navigate_to_add_task(hass, global_config_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Test",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    assert result["step_id"] == "sensor_select"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: "sensor.does_not_exist"},
    )
    assert result["type"] == FlowResultType.FORM
    assert CONF_TRIGGER_ENTITY in result["errors"]


async def test_threshold_requires_at_least_one(
    hass: HomeAssistant, global_config_entry: ConfigEntry
) -> None:
    """Test that threshold config requires at least above or below."""
    hass.states.async_set("sensor.test", "50.0", {"unit_of_measurement": "%"})

    result = await _navigate_to_add_task(hass, global_config_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Test",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: "sensor.test"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD},
    )

    # Submit without above or below
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_FOR_MINUTES: 0, CONF_TASK_WARNING_DAYS: 7},
    )
    assert result["type"] == FlowResultType.FORM
    assert "base" in result["errors"]


# ─── 3.5 Manual Task Flow ───────────────────────────────────────────────


async def test_manual_task_flow(
    hass: HomeAssistant, global_config_entry: ConfigEntry
) -> None:
    """Test manual task flow."""
    result = await _navigate_to_add_task(hass, global_config_entry)

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Manual Check",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.MANUAL,
        },
    )
    assert result["step_id"] == "manual"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TASK_WARNING_DAYS: 5},
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_menu"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    task = list(result["data"][CONF_TASKS].values())[0]
    assert task["schedule_type"] == ScheduleType.MANUAL


# ─── 3.6 Multiple Tasks ─────────────────────────────────────────────────


async def test_multiple_tasks_on_object(
    hass: HomeAssistant, global_config_entry: ConfigEntry
) -> None:
    """Test adding multiple tasks to one object."""
    result = await _navigate_to_add_task(hass, global_config_entry)

    # First task
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Task A",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.TIME_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TASK_INTERVAL_DAYS: 30, CONF_TASK_WARNING_DAYS: 7},
    )
    assert result["step_id"] == "task_menu"

    # Second task
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Task B",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.MANUAL,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TASK_WARNING_DAYS: 5},
    )
    assert result["step_id"] == "task_menu"

    # Finish
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert len(result["data"][CONF_TASKS]) == 2


# ─── 3.7 Finish Validation ──────────────────────────────────────────────


async def test_finish_without_tasks_shows_menu(
    hass: HomeAssistant, global_config_entry: ConfigEntry
) -> None:
    """Test that finishing with no tasks shows the menu again."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_object"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"name": "Empty Object"},
    )
    # Try to finish immediately
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    # Should show task menu again (no tasks = not allowed to finish)
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_menu"


# ─── 3.8 Sensor Attribute Selection ─────────────────────────────────────


async def test_sensor_attribute_with_numeric_attributes(
    hass: HomeAssistant, global_config_entry: ConfigEntry
) -> None:
    """Test that numeric attributes are shown for selection."""
    hass.states.async_set(
        "sensor.complex",
        "42.0",
        {
            "unit_of_measurement": "°C",
            "temperature": 42.0,
            "humidity": 65.0,
            "friendly_name": "Complex Sensor",
        },
    )

    result = await _navigate_to_add_task(hass, global_config_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Attribute Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: "sensor.complex"},
    )
    assert result["step_id"] == "sensor_attribute"
    # The form should have attribute options

    # Select an attribute
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "humidity"},
    )
    assert result["step_id"] == "trigger_type"


# ─── 3.9 Module Structure After Split ─────────────────────────────────


def test_config_flow_helpers_importable() -> None:
    """Test that config_flow_helpers module can be imported."""
    from custom_components.maintenance_supporter.config_flow_helpers import (
        async_get_threshold_suggestions,
        format_threshold_placeholders,
    )
    assert callable(async_get_threshold_suggestions)
    assert callable(format_threshold_placeholders)


def test_config_flow_trigger_importable() -> None:
    """Test that config_flow_trigger module can be imported."""
    from custom_components.maintenance_supporter.config_flow_trigger import (
        TriggerConfigMixin,
    )
    assert TriggerConfigMixin is not None
    # Verify mixin provides the expected methods
    assert hasattr(TriggerConfigMixin, "_trigger_sensor_select")
    assert hasattr(TriggerConfigMixin, "_trigger_sensor_attribute")
    assert hasattr(TriggerConfigMixin, "_trigger_type_select")
    assert hasattr(TriggerConfigMixin, "_trigger_threshold_config")
    assert hasattr(TriggerConfigMixin, "_trigger_counter_config")
    assert hasattr(TriggerConfigMixin, "_trigger_state_change_config")


def test_config_flow_options_importable() -> None:
    """Test that config_flow_options module can be imported."""
    from custom_components.maintenance_supporter.config_flow_options import (
        GlobalOptionsFlow,
        MaintenanceOptionsFlow,
    )
    assert GlobalOptionsFlow is not None
    assert MaintenanceOptionsFlow is not None


def test_config_flow_class_uses_mixin() -> None:
    """Test that MaintenanceSupporterConfigFlow uses TriggerConfigMixin."""
    from custom_components.maintenance_supporter.config_flow import (
        MaintenanceSupporterConfigFlow,
    )
    from custom_components.maintenance_supporter.config_flow_trigger import (
        TriggerConfigMixin,
    )
    assert issubclass(MaintenanceSupporterConfigFlow, TriggerConfigMixin)


def test_options_flow_class_uses_mixin() -> None:
    """Test that MaintenanceOptionsFlow uses TriggerConfigMixin."""
    from custom_components.maintenance_supporter.config_flow_options import (
        MaintenanceOptionsFlow,
    )
    from custom_components.maintenance_supporter.config_flow_trigger import (
        TriggerConfigMixin,
    )
    assert issubclass(MaintenanceOptionsFlow, TriggerConfigMixin)


def test_format_threshold_placeholders_output() -> None:
    """Test format_threshold_placeholders returns expected keys."""
    from custom_components.maintenance_supporter.config_flow_helpers import (
        format_threshold_placeholders,
    )
    from custom_components.maintenance_supporter.helpers.threshold_calculator import (
        ThresholdSuggestions,
    )

    suggestions = ThresholdSuggestions()
    result = format_threshold_placeholders("sensor.test", "state", suggestions)

    assert isinstance(result, dict)
    assert result["entity_id"] == "sensor.test"
    assert result["attribute"] == "state"
    assert "current_value" in result
    assert "average" in result
    assert "suggested_above" in result
    assert "suggested_below" in result


# ─── Notify Service Validation ──────────────────────────────────────────


async def test_global_setup_auto_fixes_notify_service(hass: HomeAssistant) -> None:
    """Test that entering a service name without 'notify.' prefix is auto-fixed."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["step_id"] == "global_setup"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_DEFAULT_WARNING_DAYS: 7,
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "all_devices_ingmar",
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert result["data"][CONF_NOTIFY_SERVICE] == "notify.all_devices_ingmar"


async def test_global_setup_valid_notify_service(hass: HomeAssistant) -> None:
    """Test that a correctly formatted notify service passes through unchanged."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_DEFAULT_WARNING_DAYS: 7,
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.mobile_app_phone",
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert result["data"][CONF_NOTIFY_SERVICE] == "notify.mobile_app_phone"


async def test_global_setup_invalid_notify_service(hass: HomeAssistant) -> None:
    """Test that an invalid notify service format shows an error."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_DEFAULT_WARNING_DAYS: 7,
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "a.b.c",
        },
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "global_setup"
    assert result["errors"][CONF_NOTIFY_SERVICE] == "invalid_notify_service"
