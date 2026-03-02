"""Tests for MaintenanceOptionsFlow (config_flow_options_task.py)."""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_ADAPTIVE_CONFIG,
    CONF_ADAPTIVE_ENABLED,
    CONF_ADAPTIVE_EWA_ALPHA,
    CONF_ADAPTIVE_MAX_INTERVAL,
    CONF_ADAPTIVE_MIN_INTERVAL,
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_CHECKLISTS,
    CONF_ENVIRONMENTAL_ENTITY,
    CONF_OBJECT,
    CONF_SENSOR_PREDICTION_ENABLED,
    CONF_TASK_ENABLED,
    CONF_TASK_INTERVAL_DAYS,
    CONF_TASK_NAME,
    CONF_TASK_NOTES,
    CONF_TASK_SCHEDULE_TYPE,
    CONF_TASK_TYPE,
    CONF_TASK_WARNING_DAYS,
    CONF_TASKS,
    DEFAULT_INTERVAL_DAYS,
    DEFAULT_WARNING_DAYS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceTypeEnum,
    ScheduleType,
    TriggerType,
)
from custom_components.maintenance_supporter.config_flow_options_task import (
    MaintenanceOptionsFlow,
)

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
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
def global_entry_with_advanced(hass: HomeAssistant) -> MockConfigEntry:
    data = build_global_entry_data()
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        options={
            **data,
            CONF_ADVANCED_CHECKLISTS: True,
            CONF_ADVANCED_ADAPTIVE: True,
        },
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    last_performed = (dt_util.now().date() - timedelta(days=20)).isoformat()
    task = build_task_data(last_performed=last_performed)
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_pump_opts",
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_entry_no_tasks(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Empty Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Empty Object"),
            tasks={},
        ),
        source="user",
        unique_id="maintenance_supporter_empty_opts",
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_entry_with_trigger(hass: HomeAssistant) -> MockConfigEntry:
    last_performed = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last_performed,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": TriggerType.THRESHOLD,
            "entity_id": "sensor.temp",
            "entity_ids": ["sensor.temp"],
            "trigger_above": 30.0,
            "trigger_below": 5.0,
            "trigger_for_minutes": 10,
        },
    )
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Triggered Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Triggered Object"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_triggered_opts",
    )
    entry.add_to_hass(hass)
    return entry


# ─── Init Menu ──────────────────────────────────────────────────────────


async def test_options_init_menu(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test options flow shows init menu."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "init"
    assert "manage_tasks" in result["menu_options"]
    assert "add_task" in result["menu_options"]
    assert "done" in result["menu_options"]


async def test_options_done(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test done closes options flow."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "done"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY


# ─── Manage Tasks ────────────────────────────────────────────────────────


async def test_manage_tasks_shows_list(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test manage_tasks shows task selection form."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "manage_tasks"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "manage_tasks"


async def test_manage_tasks_empty_returns_to_menu(
    hass: HomeAssistant, global_entry: MockConfigEntry,
    object_entry_no_tasks: MockConfigEntry,
) -> None:
    """Test manage_tasks with no tasks returns to init menu."""
    await setup_integration(hass, global_entry, object_entry_no_tasks)

    result = await hass.config_entries.options.async_init(object_entry_no_tasks.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "manage_tasks"},
    )
    # Empty tasks → returns to init menu
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "init"


async def test_manage_tasks_go_back(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test manage_tasks go_back returns to init menu."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "manage_tasks"},
    )
    # Submit with go_back
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": True},
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "init"



async def test_manage_tasks_select_task(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test selecting a task shows task action menu."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_action"


# ─── Task Action Menu with Advanced Features ─────────────────────────────


async def test_task_action_menu_with_advanced(
    hass: HomeAssistant, global_entry_with_advanced: MockConfigEntry,
    object_entry_with_trigger: MockConfigEntry,
) -> None:
    """Test task action menu includes checklist/adaptive when advanced enabled."""
    await setup_integration(hass, global_entry_with_advanced, object_entry_with_trigger)

    result = await hass.config_entries.options.async_init(object_entry_with_trigger.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    assert result["type"] == FlowResultType.MENU
    menu = result["menu_options"]
    assert "edit_checklist" in menu
    assert "adaptive_scheduling" in menu
    assert "remove_trigger" in menu


# ─── Edit Task ───────────────────────────────────────────────────────────


async def test_edit_task_shows_form(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test edit_task shows form with current task data."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "edit_task"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "edit_task"


async def test_edit_task_go_back(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test edit_task go_back returns to task action menu."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "edit_task"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Updated",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            "go_back": True,
        },
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_action"


async def test_edit_task_submit(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test editing a task updates config entry."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "edit_task"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Renamed Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_INTERVAL_DAYS: 45,
            CONF_TASK_WARNING_DAYS: 5,
            CONF_TASK_ENABLED: True,
            CONF_TASK_NOTES: "Some notes",
            "go_back": False,
        },
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_action"

    # Verify update
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    task = entry.data[CONF_TASKS][TASK_ID_1]
    assert task["name"] == "Renamed Task"
    assert task["interval_days"] == 45


# ─── Edit Trigger Summary ────────────────────────────────────────────────


async def test_edit_trigger_shows_summary(
    hass: HomeAssistant, global_entry: MockConfigEntry,
    object_entry_with_trigger: MockConfigEntry,
) -> None:
    """Test edit_trigger shows summary when trigger exists."""
    hass.states.async_set("sensor.temp", "25.0")
    await setup_integration(hass, global_entry, object_entry_with_trigger)

    result = await hass.config_entries.options.async_init(object_entry_with_trigger.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "edit_trigger"},
    )
    # Should show trigger summary menu
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "trigger_summary"


# ─── Remove Trigger ─────────────────────────────────────────────────────


async def test_remove_trigger_shows_form(
    hass: HomeAssistant, global_entry: MockConfigEntry,
    object_entry_with_trigger: MockConfigEntry,
) -> None:
    """Test remove_trigger shows confirmation form."""
    await setup_integration(hass, global_entry, object_entry_with_trigger)

    result = await hass.config_entries.options.async_init(object_entry_with_trigger.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "remove_trigger"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "remove_trigger"


async def test_remove_trigger_confirm(
    hass: HomeAssistant, global_entry: MockConfigEntry,
    object_entry_with_trigger: MockConfigEntry,
) -> None:
    """Test removing trigger config from task."""
    await setup_integration(hass, global_entry, object_entry_with_trigger)

    result = await hass.config_entries.options.async_init(object_entry_with_trigger.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "remove_trigger"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"confirm": True, "go_back": False},
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_action"

    # Verify trigger removed
    entry = hass.config_entries.async_get_entry(object_entry_with_trigger.entry_id)
    task = entry.data[CONF_TASKS][TASK_ID_1]
    assert "trigger_config" not in task
    # Should revert to time_based
    assert task["schedule_type"] == ScheduleType.TIME_BASED


async def test_remove_trigger_go_back(
    hass: HomeAssistant, global_entry: MockConfigEntry,
    object_entry_with_trigger: MockConfigEntry,
) -> None:
    """Test remove_trigger go_back."""
    await setup_integration(hass, global_entry, object_entry_with_trigger)

    result = await hass.config_entries.options.async_init(object_entry_with_trigger.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "remove_trigger"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"confirm": False, "go_back": True},
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_action"


# ─── Edit Checklist ──────────────────────────────────────────────────────


async def test_edit_checklist_shows_form(
    hass: HomeAssistant, global_entry_with_advanced: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test edit_checklist shows form."""
    await setup_integration(hass, global_entry_with_advanced, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "edit_checklist"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "edit_checklist"


async def test_edit_checklist_submit(
    hass: HomeAssistant, global_entry_with_advanced: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test submitting checklist saves items."""
    await setup_integration(hass, global_entry_with_advanced, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "edit_checklist"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"checklist_text": "Step 1\nStep 2\nStep 3", "go_back": False},
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_action"

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    task = entry.data[CONF_TASKS][TASK_ID_1]
    assert task["checklist"] == ["Step 1", "Step 2", "Step 3"]


async def test_edit_checklist_go_back(
    hass: HomeAssistant, global_entry_with_advanced: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test edit_checklist go_back."""
    await setup_integration(hass, global_entry_with_advanced, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "edit_checklist"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"checklist_text": "", "go_back": True},
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_action"


# ─── Delete Task ─────────────────────────────────────────────────────────


async def test_delete_task_shows_form(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test delete_task shows confirmation form."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "delete_task"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "delete_task"


async def test_delete_task_confirm(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test confirming task deletion removes it."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "delete_task"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"confirm": True, "go_back": False},
    )
    # Should return to init menu
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "init"

    # Verify task removed
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert TASK_ID_1 not in entry.data[CONF_TASKS]


async def test_delete_task_go_back(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test delete_task go_back returns to task action menu."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "delete_task"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"confirm": False, "go_back": True},
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_action"


async def test_delete_task_cancel(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test delete_task no confirm returns to task action."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "delete_task"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"confirm": False, "go_back": False},
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_action"


# ─── Add Task ────────────────────────────────────────────────────────────


async def test_add_task_time_based_full_flow(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test add task → time_based schedule full flow."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "add_task"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "add_task"

    # Submit add_task step
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "New Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.TIME_BASED,
            "go_back": False,
        },
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "opt_time_based"

    # Submit time_based config
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_INTERVAL_DAYS: 14,
            CONF_TASK_WARNING_DAYS: 3,
            "last_performed": dt_util.now().date().isoformat(),
            "go_back": False,
        },
    )
    # Should save and return to init menu
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "init"

    # Verify new task created
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert len(entry.data[CONF_TASKS]) == 2


async def test_add_task_go_back(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test add_task go_back returns to menu."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "New Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.TIME_BASED,
            "go_back": True,
        },
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "init"


async def test_add_task_manual_flow(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test add task → manual schedule."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Manual Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CUSTOM,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.MANUAL,
            "go_back": False,
        },
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "opt_manual"

    # Submit manual config with notes
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_WARNING_DAYS: 7,
            CONF_TASK_NOTES: "Trigger manually",
            "go_back": False,
        },
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "init"


async def test_add_task_manual_go_back(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test opt_manual go_back."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Manual Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CUSTOM,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.MANUAL,
            "go_back": False,
        },
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"go_back": True},
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "init"


async def test_add_task_time_based_go_back(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test opt_time_based go_back."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Time Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.TIME_BASED,
            "go_back": False,
        },
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_INTERVAL_DAYS: 30,
            "go_back": True,
        },
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "init"



# ─── Adaptive Scheduling ────────────────────────────────────────────────


async def test_adaptive_scheduling_shows_form(
    hass: HomeAssistant, global_entry_with_advanced: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test adaptive_scheduling shows form."""
    await setup_integration(hass, global_entry_with_advanced, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "adaptive_scheduling"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "adaptive_scheduling"


async def test_adaptive_scheduling_submit(
    hass: HomeAssistant, global_entry_with_advanced: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test submitting adaptive scheduling config."""
    await setup_integration(hass, global_entry_with_advanced, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "adaptive_scheduling"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_ADAPTIVE_ENABLED: True,
            CONF_ADAPTIVE_EWA_ALPHA: 0.3,
            CONF_ADAPTIVE_MIN_INTERVAL: 7,
            CONF_ADAPTIVE_MAX_INTERVAL: 90,
            "seasonal_enabled": True,
            CONF_SENSOR_PREDICTION_ENABLED: True,
            "go_back": False,
        },
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_action"

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    adaptive = entry.data[CONF_TASKS][TASK_ID_1].get(CONF_ADAPTIVE_CONFIG, {})
    assert adaptive["enabled"] is True
    assert adaptive[CONF_ADAPTIVE_MIN_INTERVAL] == 7


async def test_adaptive_scheduling_go_back(
    hass: HomeAssistant, global_entry_with_advanced: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test adaptive_scheduling go_back."""
    await setup_integration(hass, global_entry_with_advanced, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "adaptive_scheduling"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            CONF_ADAPTIVE_ENABLED: False,
            CONF_ADAPTIVE_EWA_ALPHA: 0.3,
            CONF_ADAPTIVE_MIN_INTERVAL: 7,
            CONF_ADAPTIVE_MAX_INTERVAL: 90,
            "seasonal_enabled": True,
            CONF_SENSOR_PREDICTION_ENABLED: True,
            "go_back": True,
        },
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_action"


# ─── Object Settings ────────────────────────────────────────────────────


async def test_object_settings_shows_form(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test object_settings shows form."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "object_settings"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "object_settings"


async def test_object_settings_go_back(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test object_settings go_back."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "object_settings"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={
            "name": "Pool Pump",
            "manufacturer": "",
            "model": "",
            "go_back": True,
        },
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "init"


# ─── Static Helper Unit Tests ───────────────────────────────────────────


def test_condition_summary_threshold() -> None:
    """Test condition_summary for threshold trigger."""
    cond = {
        "type": TriggerType.THRESHOLD,
        "trigger_above": 30.0,
        "trigger_below": 5.0,
        "trigger_for_minutes": 10,
    }
    result = MaintenanceOptionsFlow._condition_summary(cond)
    assert "above: 30.0" in result
    assert "below: 5.0" in result
    assert "for: 10min" in result


def test_condition_summary_counter() -> None:
    """Test condition_summary for counter trigger."""
    cond = {
        "type": TriggerType.COUNTER,
        "trigger_target_value": 100,
        "trigger_delta_mode": True,
    }
    result = MaintenanceOptionsFlow._condition_summary(cond)
    assert "target: 100" in result
    assert "delta mode" in result


def test_condition_summary_state_change() -> None:
    """Test condition_summary for state_change trigger."""
    cond = {
        "type": TriggerType.STATE_CHANGE,
        "trigger_target_changes": 5,
        "trigger_from_state": "off",
        "trigger_to_state": "on",
    }
    result = MaintenanceOptionsFlow._condition_summary(cond)
    assert "changes: 5" in result
    assert "from: off" in result
    assert "to: on" in result


def test_condition_summary_runtime() -> None:
    """Test condition_summary for runtime trigger."""
    cond = {
        "type": TriggerType.RUNTIME,
        "trigger_runtime_hours": 200,
    }
    result = MaintenanceOptionsFlow._condition_summary(cond)
    assert "hours: 200" in result


def test_condition_summary_empty() -> None:
    """Test condition_summary with no data."""
    result = MaintenanceOptionsFlow._condition_summary({"type": "unknown"})
    assert result == "—"


def test_get_entity_ids_str_from_entity_ids() -> None:
    """Test _get_entity_ids_str with entity_ids list."""
    tc = {"entity_ids": ["sensor.a", "sensor.b"]}
    result = MaintenanceOptionsFlow._get_entity_ids_str(tc)
    assert "sensor.a" in result
    assert "sensor.b" in result


def test_get_entity_ids_str_from_entity_id() -> None:
    """Test _get_entity_ids_str falling back to entity_id string."""
    tc = {"entity_id": "sensor.single"}
    result = MaintenanceOptionsFlow._get_entity_ids_str(tc)
    assert result == "sensor.single"


def test_get_entity_ids_str_empty() -> None:
    """Test _get_entity_ids_str with no entities."""
    tc = {}
    result = MaintenanceOptionsFlow._get_entity_ids_str(tc)
    assert result == "—"


def test_build_trigger_config_parts_threshold() -> None:
    """Test _build_trigger_config_parts for threshold."""
    tc = {
        "type": TriggerType.THRESHOLD,
        "trigger_above": 30,
        "trigger_below": 5,
        "trigger_for_minutes": 10,
    }
    parts = MaintenanceOptionsFlow._build_trigger_config_parts(tc)
    assert "above: 30" in parts
    assert "below: 5" in parts
    assert "for: 10min" in parts


def test_build_trigger_config_parts_counter() -> None:
    """Test _build_trigger_config_parts for counter."""
    tc = {
        "type": TriggerType.COUNTER,
        "trigger_target_value": 50,
        "trigger_delta_mode": True,
    }
    parts = MaintenanceOptionsFlow._build_trigger_config_parts(tc)
    assert "target: 50" in parts
    assert "delta mode" in parts


def test_build_trigger_config_parts_state_change() -> None:
    """Test _build_trigger_config_parts for state_change."""
    tc = {
        "type": TriggerType.STATE_CHANGE,
        "trigger_target_changes": 3,
        "trigger_from_state": "off",
        "trigger_to_state": "on",
    }
    parts = MaintenanceOptionsFlow._build_trigger_config_parts(tc)
    assert "changes: 3" in parts
    assert "from: off" in parts
    assert "to: on" in parts


def test_build_trigger_config_parts_runtime() -> None:
    """Test _build_trigger_config_parts for runtime."""
    tc = {"type": TriggerType.RUNTIME, "trigger_runtime_hours": 100}
    parts = MaintenanceOptionsFlow._build_trigger_config_parts(tc)
    assert "hours: 100" in parts


def test_build_trigger_config_parts_compound() -> None:
    """Test _build_trigger_config_parts for compound trigger."""
    tc = {
        "type": TriggerType.COMPOUND,
        "compound_logic": "AND",
        "conditions": [
            {
                "type": TriggerType.THRESHOLD,
                "entity_id": "sensor.temp",
                "trigger_above": 30,
            },
            {
                "type": TriggerType.COUNTER,
                "entity_ids": ["sensor.cycles"],
                "trigger_target_value": 100,
            },
        ],
    }
    parts = MaintenanceOptionsFlow._build_trigger_config_parts(tc)
    assert "logic: AND" in parts
    assert any("#1" in p for p in parts)
    assert any("#2" in p for p in parts)
