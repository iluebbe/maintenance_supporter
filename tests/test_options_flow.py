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
    CONF_OBJECT_AREA,
    CONF_OBJECT_INSTALLATION_DATE,
    CONF_PANEL_ENABLED,
    CONF_RESPONSIBLE_USER_ID,
    CONF_TASK_DOCUMENTATION_URL,
    CONF_TASK_ENABLED,
    CONF_TASK_INTERVAL_DAYS,
    CONF_TASK_LAST_PERFORMED,
    CONF_TASK_NAME,
    CONF_TASK_NOTES,
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

    # Register a mock notify service so validation passes
    hass.services.async_register("notify", "my_phone", lambda call: None)

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
        user_input={CONF_TRIGGER_ENTITY: ["sensor.pool_pressure"]},
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
        user_input={CONF_TRIGGER_ENTITY: ["sensor.runtime_hours"]},
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
        user_input={CONF_TRIGGER_ENTITY: ["sensor.door_count"]},
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
        user_input={CONF_TRIGGER_ENTITY: ["sensor.does_not_exist"]},
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


# ─── 4.7 Edit Trigger on Existing Task ────────────────────────────────


async def _navigate_to_task_action(
    hass: HomeAssistant,
    global_entry: ConfigEntry,
    object_entry: ConfigEntry,
    *,
    skip_setup: bool = False,
) -> tuple[dict, str]:
    """Helper to navigate to task_action for the first task."""
    if not skip_setup:
        await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(
        object_entry.entry_id
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "manage_tasks"},
    )
    tasks = object_entry.data.get(CONF_TASKS, {})
    task_id = next(iter(tasks))

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": task_id},
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_action"
    return result, task_id


async def test_task_action_shows_edit_trigger(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that task_action menu includes edit_trigger."""
    result, _ = await _navigate_to_task_action(
        hass, global_config_entry, object_config_entry
    )
    assert "edit_trigger" in result["menu_options"]
    # No trigger_config on default fixture → remove_trigger should NOT appear
    assert "remove_trigger" not in result["menu_options"]


async def test_edit_trigger_full_flow(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test editing a trigger on an existing task (full sensor-based flow)."""
    hass.states.async_set(
        "sensor.water_temp", "25.3",
        {"unit_of_measurement": "°C"},
    )

    result, task_id = await _navigate_to_task_action(
        hass, global_config_entry, object_config_entry
    )

    # Select edit_trigger from menu
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "edit_trigger"},
    )
    assert result["step_id"] == "opt_sensor_select"

    # Select entity
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.water_temp"]},
    )
    assert result["step_id"] == "opt_sensor_attribute"

    # Select attribute (state value)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    assert result["step_id"] == "opt_trigger_type"

    # Select trigger type
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD},
    )
    assert result["step_id"] == "opt_trigger_threshold"

    # Configure threshold
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TRIGGER_ABOVE: 30.0,
            CONF_TRIGGER_FOR_MINUTES: 5,
            CONF_TASK_WARNING_DAYS: 3,
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY

    # Verify trigger was saved on the existing task (not a new one)
    tasks = object_config_entry.data.get(CONF_TASKS, {})
    assert len(tasks) == 1  # no new task created
    task = tasks[task_id]
    assert task["trigger_config"]["entity_id"] == "sensor.water_temp"
    assert task["trigger_config"][CONF_TRIGGER_ABOVE] == 30.0
    assert task["schedule_type"] == ScheduleType.SENSOR_BASED


async def test_remove_trigger_shown_only_when_trigger_exists(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test remove_trigger only appears when task has a trigger_config."""
    # First add a trigger to the task
    hass.states.async_set("sensor.test", "10", {"unit_of_measurement": ""})

    result, task_id = await _navigate_to_task_action(
        hass, global_config_entry, object_config_entry
    )
    assert "remove_trigger" not in result["menu_options"]

    # Add trigger via edit_trigger
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "edit_trigger"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.test"]},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TRIGGER_ABOVE: 50.0,
            CONF_TRIGGER_FOR_MINUTES: 0,
            CONF_TASK_WARNING_DAYS: 7,
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY

    # Now navigate again — remove_trigger should appear
    result2, _ = await _navigate_to_task_action(
        hass, global_config_entry, object_config_entry, skip_setup=True
    )
    assert "remove_trigger" in result2["menu_options"]


async def test_remove_trigger_flow(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test removing a trigger reverts schedule to time_based."""
    hass.states.async_set("sensor.test", "10", {"unit_of_measurement": ""})

    # Add a trigger first
    result, task_id = await _navigate_to_task_action(
        hass, global_config_entry, object_config_entry
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "edit_trigger"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.test"]},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TRIGGER_ABOVE: 50.0,
            CONF_TRIGGER_FOR_MINUTES: 0,
            CONF_TASK_WARNING_DAYS: 7,
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert "trigger_config" in object_config_entry.data[CONF_TASKS][task_id]

    # Now remove the trigger
    result2, _ = await _navigate_to_task_action(
        hass, global_config_entry, object_config_entry, skip_setup=True
    )
    result2 = await hass.config_entries.options.async_configure(
        result2["flow_id"],
        {"next_step_id": "remove_trigger"},
    )
    assert result2["step_id"] == "remove_trigger"

    result2 = await hass.config_entries.options.async_configure(
        result2["flow_id"],
        user_input={"confirm": True},
    )
    assert result2["type"] == FlowResultType.CREATE_ENTRY

    # Verify trigger removed and schedule reverted
    task = object_config_entry.data[CONF_TASKS][task_id]
    assert "trigger_config" not in task
    assert task["schedule_type"] == ScheduleType.TIME_BASED


async def test_remove_trigger_cancel(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test cancelling remove_trigger does not change the task."""
    hass.states.async_set("sensor.test", "10", {"unit_of_measurement": ""})

    # Add a trigger first
    result, task_id = await _navigate_to_task_action(
        hass, global_config_entry, object_config_entry
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "edit_trigger"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.test"]},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TRIGGER_ABOVE: 50.0,
            CONF_TRIGGER_FOR_MINUTES: 0,
            CONF_TASK_WARNING_DAYS: 7,
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY

    # Try to remove but don't confirm
    result2, _ = await _navigate_to_task_action(
        hass, global_config_entry, object_config_entry, skip_setup=True
    )
    result2 = await hass.config_entries.options.async_configure(
        result2["flow_id"],
        {"next_step_id": "remove_trigger"},
    )
    result2 = await hass.config_entries.options.async_configure(
        result2["flow_id"],
        user_input={"confirm": False},
    )
    assert result2["type"] == FlowResultType.CREATE_ENTRY

    # Trigger should still be there
    task = object_config_entry.data[CONF_TASKS][task_id]
    assert "trigger_config" in task
    assert task["schedule_type"] == ScheduleType.SENSOR_BASED


# ─── 4.8 Edit Task with New Fields ────────────────────────────────────


async def test_edit_task_new_fields(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test editing a task with enabled, notes, documentation_url, last_performed, responsible_user_id."""
    result, task_id = await _navigate_to_task_action(
        hass, global_config_entry, object_config_entry
    )

    # Select edit_task from menu
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "edit_task"},
    )
    assert result["step_id"] == "edit_task"

    # Verify new fields are present in the schema
    schema_keys = [str(k) for k in result["data_schema"].schema]
    assert CONF_TASK_ENABLED in schema_keys
    assert CONF_TASK_NOTES in schema_keys
    assert CONF_TASK_DOCUMENTATION_URL in schema_keys
    assert CONF_TASK_LAST_PERFORMED in schema_keys
    assert CONF_RESPONSIBLE_USER_ID in schema_keys

    # Submit with all new fields populated
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Filter Cleaning",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_INTERVAL_DAYS: 30,
            CONF_TASK_WARNING_DAYS: 7,
            CONF_TASK_ENABLED: False,
            CONF_TASK_NOTES: "Use warm water",
            CONF_TASK_DOCUMENTATION_URL: "https://example.com/docs",
            CONF_TASK_LAST_PERFORMED: "2026-01-15",
            CONF_RESPONSIBLE_USER_ID: "abc123user",
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY

    # Verify all new fields were saved
    task = object_config_entry.data[CONF_TASKS][task_id]
    assert task[CONF_TASK_ENABLED] is False
    assert task[CONF_TASK_NOTES] == "Use warm water"
    assert task[CONF_TASK_DOCUMENTATION_URL] == "https://example.com/docs"
    assert task[CONF_TASK_LAST_PERFORMED] == "2026-01-15"
    assert task[CONF_RESPONSIBLE_USER_ID] == "abc123user"


async def test_edit_task_partial_new_fields(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test editing a task with only some new fields leaves others unchanged."""
    result, task_id = await _navigate_to_task_action(
        hass, global_config_entry, object_config_entry
    )

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "edit_task"},
    )

    # Submit with only enabled changed, other new fields empty
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Filter Cleaning",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_INTERVAL_DAYS: 30,
            CONF_TASK_WARNING_DAYS: 7,
            CONF_TASK_ENABLED: True,
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY

    task = object_config_entry.data[CONF_TASKS][task_id]
    assert task[CONF_TASK_ENABLED] is True
    # Fields not submitted should not be present
    assert CONF_TASK_NOTES not in task or task.get(CONF_TASK_NOTES) is None or task.get(CONF_TASK_NOTES) == ""
    assert CONF_RESPONSIBLE_USER_ID not in task or task.get(CONF_RESPONSIBLE_USER_ID) is None


# ─── 4.9 Object Settings with New Fields ──────────────────────────────


async def test_object_settings_with_area_and_install_date(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test updating object settings with area_id and installation_date."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    result = await hass.config_entries.options.async_init(
        object_config_entry.entry_id
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "object_settings"},
    )
    assert result["step_id"] == "object_settings"

    # Verify new fields are present in the schema
    schema_keys = [str(k) for k in result["data_schema"].schema]
    assert CONF_OBJECT_AREA in schema_keys
    assert CONF_OBJECT_INSTALLATION_DATE in schema_keys

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            "name": "Pool Pump",
            "manufacturer": "Intex",
            "model": "26652",
            CONF_OBJECT_AREA: "garage",
            CONF_OBJECT_INSTALLATION_DATE: "2024-06-15",
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY

    # Verify new fields were saved
    obj = object_config_entry.data.get(CONF_OBJECT, {})
    assert obj[CONF_OBJECT_AREA] == "garage"
    assert obj[CONF_OBJECT_INSTALLATION_DATE] == "2024-06-15"


async def test_object_settings_without_new_fields(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test updating object settings without area_id/installation_date still works."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    result = await hass.config_entries.options.async_init(
        object_config_entry.entry_id
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "object_settings"},
    )

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            "name": "Updated Pump",
            "manufacturer": "",
            "model": "",
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY

    obj = object_config_entry.data.get(CONF_OBJECT, {})
    assert obj["name"] == "Updated Pump"
