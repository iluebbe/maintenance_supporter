"""Tests for the Maintenance Supporter options flow.

Tests cover:
- GlobalOptionsFlow: menu, general_settings update
- MaintenanceOptionsFlow: menu, manage_tasks, task_action, add_task (time-based),
  add_task (sensor threshold/counter/state_change via TriggerConfigMixin),
  object_settings update
"""

from __future__ import annotations

import pytest

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType

from custom_components.maintenance_supporter.const import (
    CONF_DEFAULT_WARNING_DAYS,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
    CONF_OBJECT,
    CONF_PANEL_ENABLED,
    CONF_TASK_INTERVAL_DAYS,
    CONF_TASK_NAME,
    CONF_TASK_SCHEDULE_TYPE,
    CONF_TASK_TYPE,
    CONF_TASK_WARNING_DAYS,
    CONF_TASKS,
    CONF_TRIGGER_ABOVE,
    CONF_TRIGGER_ATTRIBUTE,
    CONF_TRIGGER_ENTITY,
    CONF_TRIGGER_FOR_MINUTES,
    CONF_TRIGGER_TARGET_VALUE,
    CONF_TRIGGER_DELTA_MODE,
    CONF_TRIGGER_FROM_STATE,
    CONF_TRIGGER_TO_STATE,
    CONF_TRIGGER_TARGET_CHANGES,
    CONF_TRIGGER_TYPE,
    DOMAIN,
    MaintenanceTypeEnum,
    ScheduleType,
    TriggerType,
)

from .conftest import setup_integration


# ─── 4.1 Global Options Flow ────────────────────────────────────────────


async def test_global_options_init_shows_menu(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test that global options shows menu."""
    await setup_integration(hass, global_config_entry)

    result = await hass.config_entries.options.async_init(
        global_config_entry.entry_id
    )
    # GlobalOptionsFlow.async_step_init shows a menu
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "global_init"
    assert "general_settings" in result["menu_options"]
    assert "done" in result["menu_options"]


async def test_global_options_update(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test updating global options via general_settings."""
    await setup_integration(hass, global_config_entry)

    # Step 1: Init shows menu
    result = await hass.config_entries.options.async_init(
        global_config_entry.entry_id
    )
    assert result["type"] == FlowResultType.MENU

    # Step 2: Select general_settings from menu
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "general_settings"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "general_settings"

    # Step 3: Submit updated values
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_DEFAULT_WARNING_DAYS: 14,
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.my_phone",
            CONF_PANEL_ENABLED: False,
        },
    )
    # After saving, flow returns to menu
    assert result["type"] == FlowResultType.MENU

    # Verify options were saved
    assert global_config_entry.options[CONF_DEFAULT_WARNING_DAYS] == 14
    assert global_config_entry.options[CONF_NOTIFICATIONS_ENABLED] is True
    assert global_config_entry.options[CONF_NOTIFY_SERVICE] == "notify.my_phone"


# ─── 4.2 Maintenance Options Flow ───────────────────────────────────────


async def test_maintenance_options_init_shows_menu(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that maintenance options shows menu."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    result = await hass.config_entries.options.async_init(
        object_config_entry.entry_id
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "init"
    assert "manage_tasks" in result["menu_options"]
    assert "add_task" in result["menu_options"]
    assert "object_settings" in result["menu_options"]


# ─── 4.3 Manage Tasks ───────────────────────────────────────────────────


async def test_manage_tasks_lists_tasks(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that manage_tasks shows existing tasks."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    result = await hass.config_entries.options.async_init(
        object_config_entry.entry_id
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "manage_tasks"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "manage_tasks"


async def test_manage_tasks_submit(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that selecting a task in manage_tasks navigates to task_action."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    result = await hass.config_entries.options.async_init(
        object_config_entry.entry_id
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "manage_tasks"},
    )
    assert result["step_id"] == "manage_tasks"

    # Select the existing task
    tasks = object_config_entry.data.get(CONF_TASKS, {})
    task_id = next(iter(tasks))

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": task_id},
    )
    # Selecting a task navigates to the task_action menu
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_action"


# ─── 4.4 Add Task via Options ───────────────────────────────────────────


async def test_add_task_via_options(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test adding a new task via options flow (multi-step)."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    initial_task_count = len(object_config_entry.data.get(CONF_TASKS, {}))

    result = await hass.config_entries.options.async_init(
        object_config_entry.entry_id
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "add_task"},
    )
    assert result["step_id"] == "add_task"

    # Step 1: name, type, schedule_type
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "New Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.TIME_BASED,
        },
    )
    # Should navigate to opt_time_based step
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "opt_time_based"

    # Step 2: interval and warning days
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_INTERVAL_DAYS: 60,
            CONF_TASK_WARNING_DAYS: 14,
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY

    # Verify task was added to config entry data
    updated_tasks = object_config_entry.data.get(CONF_TASKS, {})
    assert len(updated_tasks) == initial_task_count + 1

    new_task = [
        t for t in updated_tasks.values() if t["name"] == "New Task"
    ]
    assert len(new_task) == 1
    assert new_task[0]["interval_days"] == 60


# ─── 4.5 Object Settings ────────────────────────────────────────────────


async def test_object_settings_update(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test updating object settings via options flow."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    result = await hass.config_entries.options.async_init(
        object_config_entry.entry_id
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "object_settings"},
    )
    assert result["step_id"] == "object_settings"

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            "name": "Updated Pool Pump",
            "manufacturer": "Intex",
            "model": "26652",
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY

    # Verify object was updated
    obj = object_config_entry.data.get(CONF_OBJECT, {})
    assert obj["name"] == "Updated Pool Pump"
    assert obj["manufacturer"] == "Intex"
    assert obj["model"] == "26652"

    # Title should also be updated
    assert object_config_entry.title == "Updated Pool Pump"


# ─── 4.6 Add Sensor-Based Task via Options (TriggerConfigMixin) ───────


async def _navigate_to_options_add_task(
    hass: HomeAssistant,
    global_entry: ConfigEntry,
    object_entry: ConfigEntry,
) -> dict:
    """Helper to navigate to add_task in options flow."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(
        object_entry.entry_id
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "add_task"},
    )
    assert result["step_id"] == "add_task"
    return result


async def test_add_sensor_threshold_task_via_options(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test adding a sensor-based threshold task via options flow (uses mixin)."""
    hass.states.async_set(
        "sensor.pool_pressure",
        "1.2",
        {"unit_of_measurement": "bar", "pressure": 1.2},
    )

    initial_task_count = len(object_config_entry.data.get(CONF_TASKS, {}))

    result = await _navigate_to_options_add_task(
        hass, global_config_entry, object_config_entry
    )

    # Step 1: name, type, schedule
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Pressure Check",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    assert result["step_id"] == "opt_sensor_select"

    # Step 2: select sensor
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: "sensor.pool_pressure"},
    )
    assert result["step_id"] == "opt_sensor_attribute"

    # Step 3: select attribute
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    assert result["step_id"] == "opt_trigger_type"

    # Step 4: select trigger type
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD},
    )
    assert result["step_id"] == "opt_trigger_threshold"

    # Step 5: configure threshold
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TRIGGER_ABOVE: 1.5,
            CONF_TRIGGER_FOR_MINUTES: 0,
            CONF_TASK_WARNING_DAYS: 7,
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY

    # Verify task was added
    updated_tasks = object_config_entry.data.get(CONF_TASKS, {})
    assert len(updated_tasks) == initial_task_count + 1

    new_task = [t for t in updated_tasks.values() if t["name"] == "Pressure Check"]
    assert len(new_task) == 1
    assert new_task[0]["trigger_config"]["entity_id"] == "sensor.pool_pressure"
    assert new_task[0]["trigger_config"][CONF_TRIGGER_ABOVE] == 1.5
    assert new_task[0]["trigger_config"]["type"] == TriggerType.THRESHOLD


async def test_add_sensor_counter_task_via_options(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test adding a sensor-based counter task via options flow (uses mixin)."""
    hass.states.async_set(
        "sensor.runtime_hours", "500", {"unit_of_measurement": "h"}
    )

    initial_task_count = len(object_config_entry.data.get(CONF_TASKS, {}))

    result = await _navigate_to_options_add_task(
        hass, global_config_entry, object_config_entry
    )

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Runtime Counter",
            CONF_TASK_TYPE: MaintenanceTypeEnum.SERVICE,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: "sensor.runtime_hours"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.COUNTER},
    )
    assert result["step_id"] == "opt_trigger_counter"

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TRIGGER_TARGET_VALUE: 1000,
            CONF_TRIGGER_DELTA_MODE: True,
            CONF_TASK_WARNING_DAYS: 7,
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY

    updated_tasks = object_config_entry.data.get(CONF_TASKS, {})
    assert len(updated_tasks) == initial_task_count + 1

    new_task = [t for t in updated_tasks.values() if t["name"] == "Runtime Counter"]
    assert len(new_task) == 1
    assert new_task[0]["trigger_config"][CONF_TRIGGER_TARGET_VALUE] == 1000
    assert new_task[0]["trigger_config"][CONF_TRIGGER_DELTA_MODE] is True


async def test_add_sensor_state_change_task_via_options(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test adding a sensor-based state change task via options flow (uses mixin)."""
    hass.states.async_set(
        "sensor.door_count", "12", {"unit_of_measurement": "opens"}
    )

    initial_task_count = len(object_config_entry.data.get(CONF_TASKS, {}))

    result = await _navigate_to_options_add_task(
        hass, global_config_entry, object_config_entry
    )

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Door Opens",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: "sensor.door_count"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.STATE_CHANGE},
    )
    assert result["step_id"] == "opt_trigger_state_change"

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TRIGGER_FROM_STATE: "off",
            CONF_TRIGGER_TO_STATE: "on",
            CONF_TRIGGER_TARGET_CHANGES: 10,
            CONF_TASK_WARNING_DAYS: 7,
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY

    updated_tasks = object_config_entry.data.get(CONF_TASKS, {})
    assert len(updated_tasks) == initial_task_count + 1

    new_task = [t for t in updated_tasks.values() if t["name"] == "Door Opens"]
    assert len(new_task) == 1
    assert new_task[0]["trigger_config"]["type"] == TriggerType.STATE_CHANGE
    assert new_task[0]["trigger_config"][CONF_TRIGGER_TARGET_CHANGES] == 10


async def test_options_sensor_select_invalid_entity(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that selecting a non-existent entity in options shows error."""
    result = await _navigate_to_options_add_task(
        hass, global_config_entry, object_config_entry
    )

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Test",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    assert result["step_id"] == "opt_sensor_select"

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: "sensor.does_not_exist"},
    )
    assert result["type"] == FlowResultType.FORM
    assert CONF_TRIGGER_ENTITY in result["errors"]


async def test_options_manual_task_via_options(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test adding a manual task via options flow."""
    initial_task_count = len(object_config_entry.data.get(CONF_TASKS, {}))

    result = await _navigate_to_options_add_task(
        hass, global_config_entry, object_config_entry
    )

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Manual Check",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.MANUAL,
        },
    )
    assert result["step_id"] == "opt_manual"

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TASK_WARNING_DAYS: 5},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY

    updated_tasks = object_config_entry.data.get(CONF_TASKS, {})
    assert len(updated_tasks) == initial_task_count + 1
