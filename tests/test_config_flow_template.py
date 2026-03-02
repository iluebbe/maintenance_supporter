"""Tests for config flow template creation and compound wrappers."""

from __future__ import annotations

from typing import Any
from unittest.mock import patch

import pytest

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_OBJECT_AREA,
    CONF_OBJECT_MANUFACTURER,
    CONF_OBJECT_MODEL,
    CONF_OBJECT_NAME,
    CONF_TASK_INTERVAL_DAYS,
    CONF_TASK_NAME,
    CONF_TASK_NOTES,
    CONF_TASK_SCHEDULE_TYPE,
    CONF_TASK_TYPE,
    CONF_TASK_WARNING_DAYS,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceTypeEnum,
    ScheduleType,
)
from custom_components.maintenance_supporter.templates import (
    TEMPLATE_CATEGORIES,
    TEMPLATES,
)

from .conftest import build_global_entry_data, setup_integration


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


# ─── Template Flow ─────────────────────────────────────────────────────


async def test_create_from_template_show_form(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test template category selection form is shown."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    assert result["type"] == FlowResultType.MENU
    assert "create_from_template" in result["menu_options"]

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_from_template"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "create_from_template"


async def test_create_from_template_go_back(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test go_back from template category returns to user menu."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_from_template"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_category": "vehicle", "go_back": True},
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "user"


async def test_template_select_form(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test template selection form for a chosen category."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_from_template"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_category": "vehicle"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "template_select"


async def test_template_select_go_back(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test go_back from template select returns to category selection."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_from_template"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_category": "vehicle"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_id": "vehicle_car", "go_back": True},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "create_from_template"


async def test_template_customize_form(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test template customization form is shown."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_from_template"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_category": "vehicle"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_id": "vehicle_car"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "template_customize"


async def test_template_customize_go_back(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test go_back from template customize returns to template select."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_from_template"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_category": "vehicle"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_id": "vehicle_car"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_OBJECT_NAME: "My Car", "go_back": True},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "template_select"


async def test_template_customize_submit_creates_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test submitting template customization creates a config entry."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_from_template"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_category": "vehicle"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_id": "vehicle_car"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_OBJECT_NAME: "My Car Template"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert result["title"] == "My Car Template"
    # Should have tasks from the car template
    tasks = result["data"][CONF_TASKS]
    assert len(tasks) >= 3  # Car template has 5 tasks


async def test_template_customize_duplicate_name(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test duplicate name in template customize shows error."""
    await setup_integration(hass, global_entry)

    # Create an existing entry with the name
    existing = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="My Car",
        data={
            CONF_OBJECT: {CONF_OBJECT_NAME: "My Car"},
            CONF_TASKS: {},
        },
        source="user",
        unique_id="maintenance_supporter_my_car",
    )
    existing.add_to_hass(hass)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_from_template"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_category": "vehicle"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_id": "vehicle_car"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_OBJECT_NAME: "My Car"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["errors"].get(CONF_OBJECT_NAME) == "name_exists"


# ─── Config Flow: Compound Wrapper Steps ───────────────────────────────


async def test_compound_condition_type_step(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test compound_condition_type step is accessible."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_object"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_OBJECT_NAME: "Compound Test",
            CONF_OBJECT_MANUFACTURER: "",
            CONF_OBJECT_MODEL: "",
        },
    )
    # Now at task_menu
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Compound Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    # At sensor_select step
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "sensor_select"


# ─── Config Flow: Manual Step ──────────────────────────────────────────


async def test_manual_step(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test manual schedule step saves task and returns to menu."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_object"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_OBJECT_NAME: "Manual Object",
            CONF_OBJECT_MANUFACTURER: "",
            CONF_OBJECT_MODEL: "",
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Manual Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.MANUAL,
        },
    )
    # At manual step
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "manual"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_WARNING_DAYS: 7,
            CONF_TASK_NOTES: "Check monthly",
        },
    )
    # Should return to task_menu
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_menu"


async def test_manual_step_go_back(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test go_back from manual step returns to add_task."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_object"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_OBJECT_NAME: "Manual GoBack",
            CONF_OBJECT_MANUFACTURER: "",
            CONF_OBJECT_MODEL: "",
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Manual Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.MANUAL,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TASK_WARNING_DAYS: 7, "go_back": True},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "add_task"


# ─── Config Flow: Finish Step ──────────────────────────────────────────


async def test_finish_with_tasks_creates_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test finishing with tasks creates the config entry."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_object"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_OBJECT_NAME: "Finish Object",
            CONF_OBJECT_MANUFACTURER: "",
            CONF_OBJECT_MODEL: "",
        },
    )
    # Add a task first
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Task 1",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.TIME_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_INTERVAL_DAYS: 30,
            CONF_TASK_WARNING_DAYS: 7,
        },
    )
    # Back at task_menu, now finish
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert result["title"] == "Finish Object"
    assert len(result["data"][CONF_TASKS]) == 1


async def test_finish_without_tasks_returns_to_menu(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test finishing without tasks returns to task_menu."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_object"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_OBJECT_NAME: "Empty Object",
            CONF_OBJECT_MANUFACTURER: "",
            CONF_OBJECT_MODEL: "",
        },
    )
    # At task_menu with 0 tasks, try to finish
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    # Should return to task_menu since no tasks
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_menu"


# ─── Config Flow: Add Task Go Back ────────────────────────────────────


async def test_add_task_go_back(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test go_back from add_task returns to task_menu."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_object"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_OBJECT_NAME: "GoBack Object",
            CONF_OBJECT_MANUFACTURER: "",
            CONF_OBJECT_MODEL: "",
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.TIME_BASED,
            "go_back": True,
        },
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_menu"


# ─── Config Flow: Time-Based Go Back ──────────────────────────────────


async def test_time_based_go_back(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test go_back from time_based returns to add_task."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_object"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_OBJECT_NAME: "TB GoBack",
            CONF_OBJECT_MANUFACTURER: "",
            CONF_OBJECT_MODEL: "",
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.TIME_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_INTERVAL_DAYS: 30,
            CONF_TASK_WARNING_DAYS: 7,
            "go_back": True,
        },
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "add_task"


# ─── Config Flow: Create Object Go Back ───────────────────────────────


async def test_create_object_go_back(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test go_back from create_object returns to user menu."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_object"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_OBJECT_NAME: "GoBack",
            CONF_OBJECT_MANUFACTURER: "",
            CONF_OBJECT_MODEL: "",
            "go_back": True,
        },
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "user"


# ─── Config Flow: Global Setup Error ──────────────────────────────────


async def test_global_setup_invalid_notify(
    hass: HomeAssistant,
) -> None:
    """Test global setup with invalid notify service shows error."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    # No global entry → goes to global_setup
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "global_setup"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            "default_warning_days": 7,
            "notifications_enabled": True,
            "notify_service": "invalid.bad-service!",
        },
    )
    assert result["type"] == FlowResultType.FORM
    assert result["errors"].get("notify_service")


# ─── Config Flow: Time-Based With Last Performed ──────────────────────


async def test_time_based_with_last_performed(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test time-based step saves last_performed."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_object"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_OBJECT_NAME: "LP Object",
            CONF_OBJECT_MANUFACTURER: "",
            CONF_OBJECT_MODEL: "",
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "LP Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.TIME_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_INTERVAL_DAYS: 30,
            CONF_TASK_WARNING_DAYS: 7,
            "last_performed": "2025-01-01",
        },
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_menu"

    # Now finish and verify last_performed is saved
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    tasks = result["data"][CONF_TASKS]
    task = list(tasks.values())[0]
    assert task["last_performed"] == "2025-01-01"
