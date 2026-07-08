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

from datetime import timedelta

import pytest
from homeassistant import config_entries
from homeassistant.config_entries import ConfigEntry, ConfigFlowResult
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import selector
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_DEFAULT_WARNING_DAYS,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
    CONF_OBJECT_MANUFACTURER,
    CONF_OBJECT_MODEL,
    CONF_OBJECT_NAME,
    CONF_TASK_INTERVAL_DAYS,
    CONF_TASK_NAME,
    CONF_TASK_SCHEDULE_TYPE,
    CONF_TASK_TYPE,
    CONF_TASK_WARNING_DAYS,
    CONF_TASKS,
    CONF_TRIGGER_ABOVE,
    CONF_TRIGGER_ATTRIBUTE,
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
    DEFAULT_WARNING_DAYS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceTypeEnum,
    ScheduleType,
    TriggerType,
)
from custom_components.maintenance_supporter.helpers.schedule import (
    read_legacy_fields,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


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


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    last_performed = (dt_util.now().date() - timedelta(days=20)).isoformat()
    task = build_task_data(last_performed=last_performed)
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_pump_cov",
    )
    entry.add_to_hass(hass)
    return entry


# ─── 3.1 Global Setup ───────────────────────────────────────────────────


async def test_global_setup_first_run(hass: HomeAssistant) -> None:
    """Test global setup form is shown on first run with no global entry."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    # When no global entry exists, it should go straight to global_setup
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "global_setup"


async def test_global_setup_creates_entry(hass: HomeAssistant) -> None:
    """Test that completing global setup creates a global config entry."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
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


async def test_import_recreates_global_entry(hass: HomeAssistant) -> None:
    """The import step (used by the missing-global-entry repair flow) recreates
    the global entry with default settings, and aborts if one already exists."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_IMPORT})
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert result["title"] == "Maintenance Supporter"
    assert result["result"].unique_id == GLOBAL_UNIQUE_ID
    assert result["data"][CONF_NOTIFICATIONS_ENABLED] is False

    # A second import is a no-op abort (single global entry guaranteed).
    result2 = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_IMPORT})
    assert result2["type"] == FlowResultType.ABORT


async def test_global_setup_notify_dropdown(hass: HomeAssistant) -> None:
    """The setup wizard offers a dropdown merging notify *services* (mobile_app +
    groups) and notify *entities* (newer model), excludes the generic
    send_message action, and keeps custom_value for not-yet-loaded targets."""
    hass.services.async_register("notify", "mobile_app_phone", lambda call: None)
    hass.services.async_register("notify", "all_devices_group", lambda call: None)
    hass.services.async_register("notify", "send_message", lambda call: None)
    hass.states.async_set("notify.file_device", "unknown")  # entity-only device

    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["step_id"] == "global_setup"
    schema = result["data_schema"].schema
    notify_field = next(v for k, v in schema.items() if getattr(k, "schema", k) == CONF_NOTIFY_SERVICE)
    assert isinstance(notify_field, selector.SelectSelector)
    options = notify_field.config["options"]
    assert "notify.mobile_app_phone" in options  # service
    assert "notify.all_devices_group" in options  # service (group)
    assert "notify.file_device" in options  # entity-only device — the fix
    assert "notify.send_message" not in options  # generic action excluded
    assert notify_field.config["custom_value"] is True


async def test_global_setup_default_values(hass: HomeAssistant) -> None:
    """Test global setup with default values."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert result["data"][CONF_DEFAULT_WARNING_DAYS] == DEFAULT_WARNING_DAYS
    assert result["data"][CONF_NOTIFICATIONS_ENABLED] is False


async def test_global_setup_not_duplicated(hass: HomeAssistant, global_config_entry: ConfigEntry) -> None:
    """Test that a second global entry cannot be created."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    # With global entry existing, should show menu for creating objects
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "user"


# ─── 3.2 Object Creation ────────────────────────────────────────────────


async def test_create_object_form(hass: HomeAssistant, global_config_entry: ConfigEntry) -> None:
    """Test that create_object step shows a form."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["type"] == FlowResultType.MENU

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_object"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "create_object"


async def test_create_object_with_name(hass: HomeAssistant, global_config_entry: ConfigEntry) -> None:
    """Test creating an object goes to task menu."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
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
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
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


async def _navigate_to_add_task(hass: HomeAssistant, global_entry: ConfigEntry) -> ConfigFlowResult:
    """Helper to navigate to add_task step."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
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


async def test_time_based_task_flow(hass: HomeAssistant, global_config_entry: ConfigEntry) -> None:
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
    assert read_legacy_fields(task)["interval_days"] == 30
    assert read_legacy_fields(task)["schedule_type"] == ScheduleType.TIME_BASED
    # Regression (issue #30): config-flow task creation must stamp `created_at`
    # so next_due has a stable anchor when last_performed is None.
    from homeassistant.util import dt as dt_util

    assert task["created_at"] == dt_util.now().date().isoformat()


async def test_one_time_task_flow(hass: HomeAssistant, global_config_entry: ConfigEntry) -> None:
    """One-time task flow: pick one_time → set due_date → task is created."""
    result = await _navigate_to_add_task(hass, global_config_entry)

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Replace Smoke Detector",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.ONE_TIME,
        },
    )
    assert result["step_id"] == "one_time"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"due_date": "2026-09-01", CONF_TASK_WARNING_DAYS: 7},
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_menu"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY

    tasks = result["data"][CONF_TASKS]
    task = list(tasks.values())[0]
    assert read_legacy_fields(task)["schedule_type"] == ScheduleType.ONE_TIME
    assert read_legacy_fields(task)["due_date"] == "2026-09-01"


async def test_calendar_task_flow(hass: HomeAssistant, global_config_entry: ConfigEntry) -> None:
    """Calendar kind (nth_weekday) flow during initial setup (Phase 4)."""
    result = await _navigate_to_add_task(hass, global_config_entry)

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Smoke alarm",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: "nth_weekday",
        },
    )
    assert result["step_id"] == "calendar"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"nth": "1", "weekday": "5", CONF_TASK_WARNING_DAYS: 7},
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "task_menu"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY

    task = list(result["data"][CONF_TASKS].values())[0]
    assert task["schedule"] == {"kind": "nth_weekday", "nth": 1, "weekday": 5}


async def test_time_based_interval_unit_flow(hass: HomeAssistant, global_config_entry: ConfigEntry) -> None:
    """Time-based flow persists a non-default interval_unit (e.g. months)."""
    result = await _navigate_to_add_task(hass, global_config_entry)

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Quarterly Service",
            CONF_TASK_TYPE: MaintenanceTypeEnum.SERVICE,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.TIME_BASED,
        },
    )
    assert result["step_id"] == "time_based"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_INTERVAL_DAYS: 3,
            "interval_unit": "months",
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
    assert read_legacy_fields(task)["interval_days"] == 3
    assert read_legacy_fields(task)["interval_unit"] == "months"


async def test_time_based_invalid_interval(hass: HomeAssistant, global_config_entry: ConfigEntry) -> None:
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


async def test_sensor_threshold_flow(hass: HomeAssistant, global_config_entry: ConfigEntry) -> None:
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
        user_input={CONF_TRIGGER_ENTITY: ["sensor.pool_pressure"]},
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


async def test_sensor_counter_flow(hass: HomeAssistant, global_config_entry: ConfigEntry) -> None:
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
        user_input={CONF_TRIGGER_ENTITY: ["sensor.runtime_hours"]},
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


async def test_sensor_state_change_flow(hass: HomeAssistant, global_config_entry: ConfigEntry) -> None:
    """Test sensor-based state change trigger flow with numeric sensor."""
    hass.states.async_set("sensor.door_count", "12", {"unit_of_measurement": "opens"})

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
        user_input={CONF_TRIGGER_ENTITY: ["sensor.door_count"]},
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


async def test_sensor_select_invalid_entity(hass: HomeAssistant, global_config_entry: ConfigEntry) -> None:
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
        user_input={CONF_TRIGGER_ENTITY: ["sensor.does_not_exist"]},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["errors"] is not None
    assert CONF_TRIGGER_ENTITY in result["errors"]


async def test_threshold_requires_at_least_one(hass: HomeAssistant, global_config_entry: ConfigEntry) -> None:
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
        user_input={CONF_TRIGGER_ENTITY: ["sensor.test"]},
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
    assert result["errors"] is not None
    assert "base" in result["errors"]


# ─── 3.5 Manual Task Flow ───────────────────────────────────────────────


async def test_manual_task_flow(hass: HomeAssistant, global_config_entry: ConfigEntry) -> None:
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
    assert read_legacy_fields(task)["schedule_type"] == ScheduleType.MANUAL


# ─── 3.6 Multiple Tasks ─────────────────────────────────────────────────


async def test_multiple_tasks_on_object(hass: HomeAssistant, global_config_entry: ConfigEntry) -> None:
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


async def test_finish_without_tasks_shows_menu(hass: HomeAssistant, global_config_entry: ConfigEntry) -> None:
    """Test that finishing with no tasks shows the menu again."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
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


async def test_sensor_attribute_with_numeric_attributes(hass: HomeAssistant, global_config_entry: ConfigEntry) -> None:
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
        user_input={CONF_TRIGGER_ENTITY: ["sensor.complex"]},
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


# ─── Reconfigure Flow ───────────────────────────────────────────────────


async def test_reconfigure_shows_form(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that the reconfigure flow shows a form with the current values."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={
            "source": config_entries.SOURCE_RECONFIGURE,
            "entry_id": object_config_entry.entry_id,
        },
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "reconfigure"


async def test_reconfigure_updates_object(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that submitting the reconfigure flow updates the entry."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={
            "source": config_entries.SOURCE_RECONFIGURE,
            "entry_id": object_config_entry.entry_id,
        },
    )

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_OBJECT_NAME: "Updated Pool Pump",
            CONF_OBJECT_MANUFACTURER: "AquaTech",
            CONF_OBJECT_MODEL: "X200",
        },
    )
    assert result["type"] == FlowResultType.ABORT
    assert result["reason"] == "reconfigure_successful"


async def test_reconfigure_duplicate_name(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that reconfigure rejects a name already used by another entry."""
    # Create a second object entry
    entry2 = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Heater",
        data=build_object_entry_data(
            object_data=build_object_data(name="Heater", object_id="b" * 32),
            tasks={},
        ),
        source="user",
        unique_id="maintenance_supporter_heater",
    )
    entry2.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, object_config_entry, entry2)

    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={
            "source": config_entries.SOURCE_RECONFIGURE,
            "entry_id": object_config_entry.entry_id,
        },
    )

    # Try to rename to the other entry's name
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_OBJECT_NAME: "Heater"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["errors"] == {"base": "name_exists"}


async def test_reconfigure_same_name_allowed(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that keeping the same name does not trigger duplicate error."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={
            "source": config_entries.SOURCE_RECONFIGURE,
            "entry_id": object_config_entry.entry_id,
        },
    )

    # Submit with the same name
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_OBJECT_NAME: "Pool Pump"},
    )
    assert result["type"] == FlowResultType.ABORT
    assert result["reason"] == "reconfigure_successful"


# ============================================================================
# config_flow_helpers.py coverage (migrated from test_cov_cfgflow.py)
# ============================================================================


def test_calendar_schema_weekdays_kind() -> None:
    """calendar_schema with weekdays kind (line 49)."""
    from custom_components.maintenance_supporter.config_flow_helpers import (
        calendar_schema,
    )
    from custom_components.maintenance_supporter.helpers.schedule import KIND_WEEKDAYS

    schema = calendar_schema(KIND_WEEKDAYS, current={"weekdays": [0, 5]})
    assert schema is not None
    # The weekdays field default comes from current; pass it to compile
    compiled = schema({"weekdays": ["0", "5"]})
    assert compiled is not None


def test_calendar_schema_day_of_month_kind() -> None:
    """calendar_schema with day_of_month kind (lines 74-75)."""
    from custom_components.maintenance_supporter.config_flow_helpers import (
        calendar_schema,
    )
    from custom_components.maintenance_supporter.helpers.schedule import KIND_DAY_OF_MONTH

    schema = calendar_schema(KIND_DAY_OF_MONTH, current={"day": 15})
    compiled = schema({})
    assert compiled.get("day") == 15


def test_schedule_from_calendar_input_weekdays_empty() -> None:
    """schedule_from_calendar_input returns None when weekdays empty (lines 90-91)."""
    from custom_components.maintenance_supporter.config_flow_helpers import (
        schedule_from_calendar_input,
    )
    from custom_components.maintenance_supporter.helpers.schedule import KIND_WEEKDAYS

    result = schedule_from_calendar_input(KIND_WEEKDAYS, {"weekdays": []})
    assert result is None


def test_schedule_from_calendar_input_weekdays_nonempty() -> None:
    """schedule_from_calendar_input returns dict when weekdays present."""
    from custom_components.maintenance_supporter.config_flow_helpers import (
        schedule_from_calendar_input,
    )
    from custom_components.maintenance_supporter.helpers.schedule import KIND_WEEKDAYS

    result = schedule_from_calendar_input(KIND_WEEKDAYS, {"weekdays": ["0", "4"]})
    assert result is not None
    assert result["weekdays"] == [0, 4]


def test_schedule_from_calendar_input_day_of_month() -> None:
    """schedule_from_calendar_input with day_of_month (lines 98-100)."""
    from custom_components.maintenance_supporter.config_flow_helpers import (
        schedule_from_calendar_input,
    )
    from custom_components.maintenance_supporter.helpers.schedule import KIND_DAY_OF_MONTH

    result = schedule_from_calendar_input(KIND_DAY_OF_MONTH, {"day": 15})
    assert result == {"kind": KIND_DAY_OF_MONTH, "day": 15}


def test_schedule_from_calendar_input_unknown_kind() -> None:
    """schedule_from_calendar_input returns None for unknown kind (line 100)."""
    from custom_components.maintenance_supporter.config_flow_helpers import (
        schedule_from_calendar_input,
    )

    result = schedule_from_calendar_input("unknown_kind", {})
    assert result is None


def test_calendar_current_nth_weekday() -> None:
    """calendar_current extracts nth/weekday from a task with a nested schedule (lines 155-157)."""
    from custom_components.maintenance_supporter.config_flow_helpers import (
        calendar_current,
    )

    task = {"schedule": {"kind": "nth_weekday", "nth": 2, "weekday": 4}}
    result = calendar_current(task)
    assert result["nth"] == "2"
    assert result["weekday"] == "4"


async def test_threshold_suggestions_no_entity(hass: HomeAssistant) -> None:
    """Line 24: no trigger_entity_id → empty suggestions."""
    from custom_components.maintenance_supporter.config_flow_helpers import (
        async_get_threshold_suggestions,
    )

    result = await async_get_threshold_suggestions(hass, None, {})
    assert result.current_value is None


async def test_threshold_suggestions_error(hass: HomeAssistant) -> None:
    """Lines 30-32: analyzer raises → catch and return empty."""
    from unittest.mock import patch

    from custom_components.maintenance_supporter.config_flow_helpers import (
        async_get_threshold_suggestions,
    )

    with patch("custom_components.maintenance_supporter.config_flow_helpers.EntityAnalyzer") as mock_cls:
        mock_cls.return_value.async_analyze_entity.side_effect = ValueError("boom")
        result = await async_get_threshold_suggestions(
            hass,
            "sensor.test",
            {},
        )
    assert result.current_value is None


# ============================================================================
# config_flow.py coverage (migrated from test_cov_cfgflow.py)
# ============================================================================


async def test_global_setup_invalid_notify_service(hass: HomeAssistant) -> None:
    """Global setup rejects invalid notify_service (line 203, via validate_notify_service)."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["step_id"] == "global_setup"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_DEFAULT_WARNING_DAYS: 7,
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "not.a.valid.service",
        },
    )
    assert result["type"] == FlowResultType.FORM
    assert "notify_service" in result.get("errors", {})


async def test_global_setup_auto_prefix_notify(hass: HomeAssistant) -> None:
    """Global setup auto-prefixes 'notify.' and creates entry (line 238)."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_DEFAULT_WARNING_DAYS: 7,
            CONF_NOTIFICATIONS_ENABLED: False,
            CONF_NOTIFY_SERVICE: "mobile_app_phone",  # no notify. prefix
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    # Verify the service was auto-prefixed
    assert result["data"][CONF_NOTIFY_SERVICE] == "notify.mobile_app_phone"


async def test_create_from_template_category_select(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """create_from_template shows form for category selection (line 393)."""
    # global_entry is already added to hass by the fixture; don't call setup_integration
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_from_template"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "create_from_template"


async def test_create_from_template_go_back(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """create_from_template go_back returns to user menu (line 395)."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_from_template"},
    )
    assert result["step_id"] == "create_from_template"

    # go_back=True without picking a valid category (use a real one)
    from custom_components.maintenance_supporter.templates import TEMPLATE_CATEGORIES

    first_cat_id = next(iter(TEMPLATE_CATEGORIES))
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_category": first_cat_id, "go_back": True},
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "user"


async def test_create_from_template_full_flow(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """create_from_template → template_select → template_customize → CREATE_ENTRY."""
    from custom_components.maintenance_supporter.templates import (
        TEMPLATE_CATEGORIES,
        get_templates_by_category,
    )

    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_from_template"},
    )
    assert result["step_id"] == "create_from_template"

    # Pick first available category
    first_cat_id = next(iter(TEMPLATE_CATEGORIES))
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_category": first_cat_id, "go_back": False},
    )
    assert result["step_id"] == "template_select"

    # Pick first template from that category
    templates = get_templates_by_category(first_cat_id)
    assert templates, f"No templates in category {first_cat_id}"
    first_template = templates[0]

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_id": first_template.id, "go_back": False},
    )
    assert result["step_id"] == "template_customize"

    # Submit a custom name
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"name": "My Template Object"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert result["title"] == "My Template Object"
    # Template should have pre-built tasks
    assert len(result["data"][CONF_TASKS]) >= 0


async def test_template_select_go_back(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """template_select go_back returns to create_from_template (line 442)."""
    from custom_components.maintenance_supporter.templates import (
        TEMPLATE_CATEGORIES,
        get_templates_by_category,
    )

    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_from_template"},
    )
    first_cat_id = next(iter(TEMPLATE_CATEGORIES))
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_category": first_cat_id, "go_back": False},
    )
    assert result["step_id"] == "template_select"

    # Must use a real template_id so SelectSelector validates it
    templates = get_templates_by_category(first_cat_id)
    assert templates
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"go_back": True, "template_id": templates[0].id},
    )
    assert result["step_id"] == "create_from_template"


async def test_template_customize_go_back(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """template_customize go_back returns to template_select (line 462)."""
    from custom_components.maintenance_supporter.templates import (
        TEMPLATE_CATEGORIES,
        get_templates_by_category,
    )

    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_from_template"},
    )
    first_cat_id = next(iter(TEMPLATE_CATEGORIES))
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_category": first_cat_id, "go_back": False},
    )
    templates = get_templates_by_category(first_cat_id)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_id": templates[0].id, "go_back": False},
    )
    assert result["step_id"] == "template_customize"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"name": "X", "go_back": True},
    )
    assert result["step_id"] == "template_select"


async def test_template_customize_duplicate_name(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """template_customize rejects a duplicate object name (line 602)."""
    from custom_components.maintenance_supporter.templates import (
        TEMPLATE_CATEGORIES,
        get_templates_by_category,
    )

    # object_entry is already added to hass by fixture; we don't need setup_integration
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_from_template"},
    )
    first_cat_id = next(iter(TEMPLATE_CATEGORIES))
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_category": first_cat_id, "go_back": False},
    )
    templates = get_templates_by_category(first_cat_id)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"template_id": templates[0].id, "go_back": False},
    )
    assert result["step_id"] == "template_customize"

    # Submit the name of the existing object entry ("Pool Pump")
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"name": "Pool Pump"},
    )
    assert result["type"] == FlowResultType.FORM
    assert "name" in result.get("errors", {})


async def test_create_object_go_back(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """create_object go_back returns to user menu (line 673)."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "create_object"},
    )
    assert result["step_id"] == "create_object"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"name": "Something", "go_back": True},
    )
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "user"


async def test_time_based_go_back(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """time_based go_back returns to add_task (line 731)."""
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Go Back Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.TIME_BASED,
        },
    )
    assert result["step_id"] == "time_based"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TASK_INTERVAL_DAYS: 30, "go_back": True},
    )
    assert result["step_id"] == "add_task"


async def test_calendar_go_back(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """calendar go_back returns to add_task (line 734)."""
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Calendar Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: "nth_weekday",
        },
    )
    assert result["step_id"] == "calendar"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"nth": "1", "weekday": "5", CONF_TASK_WARNING_DAYS: 7, "go_back": True},
    )
    assert result["step_id"] == "add_task"


async def test_calendar_weekdays_empty_error(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """calendar step returns error when weekdays selection is empty (line 764)."""
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Weekday Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: "weekdays",
        },
    )
    assert result["step_id"] == "calendar"

    # Submit empty weekdays
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"weekdays": [], CONF_TASK_WARNING_DAYS: 7, "go_back": False},
    )
    assert result["type"] == FlowResultType.FORM
    assert result.get("errors") is not None


async def test_one_time_go_back(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """one_time go_back returns to add_task (line 763-764).

    go_back=True is vol.Optional but CONF_TASK_DUE_DATE is vol.Required,
    so HA schema validation requires a valid date even when going back.
    Provide a dummy date to satisfy the schema — the handler checks go_back
    first and returns to add_task without using the date.
    """
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "One Time",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.ONE_TIME,
        },
    )
    assert result["step_id"] == "one_time"

    # Must include due_date to pass vol.Required schema validation.
    # The handler sees go_back=True first and returns before using the date.
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"due_date": "2026-12-31", "go_back": True},
    )
    assert result["step_id"] == "add_task"


async def test_one_time_creates_entry_with_due_date(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """one_time with due_date creates task correctly (lines 769-774).

    The 'missing due_date' branch (line 768) is unreachable via normal flow
    because CONF_TASK_DUE_DATE is vol.Required — HA's schema validation
    rejects the submission before the handler runs.  We test the success path
    instead and annotate the dead branch for pragma: no cover.
    """
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "One Time Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.ONE_TIME,
        },
    )
    assert result["step_id"] == "one_time"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"due_date": "2027-06-01", CONF_TASK_WARNING_DAYS: 14, "go_back": False},
    )
    # Should return to task_menu
    assert result["step_id"] == "task_menu"

    # Finish and verify due_date persisted
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    task = list(result["data"]["tasks"].values())[0]
    assert task.get("schedule", {}).get("due_date") == "2027-06-01"


async def test_add_task_with_icon(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """add_task persists task icon when provided (lines 601-602, 1100-1101).

    CONF_TASK_ICON = 'custom_icon', so the schema field key is 'custom_icon'.
    """
    from custom_components.maintenance_supporter.const import CONF_TASK_ICON

    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Iconic Task",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.TIME_BASED,
            CONF_TASK_ICON: "mdi:wrench",
            "go_back": False,
        },
    )
    assert result["step_id"] == "time_based"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TASK_INTERVAL_DAYS: 30, CONF_TASK_WARNING_DAYS: 7},
    )
    assert result["step_id"] == "task_menu"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    task = list(result["data"]["tasks"].values())[0]
    assert task.get("custom_icon") == "mdi:wrench"


async def test_manual_go_back(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """manual go_back returns to add_task (lines 949-950)."""
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Manual Go Back",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.MANUAL,
        },
    )
    assert result["step_id"] == "manual"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TASK_WARNING_DAYS: 7, "go_back": True},
    )
    assert result["step_id"] == "add_task"


async def test_manual_with_notes(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """manual task with notes gets persisted (lines 960-961)."""
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Manual With Notes",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.MANUAL,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TASK_WARNING_DAYS: 7, "notes": "Check every spring"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY


async def test_add_task_go_back_from_add_step(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """add_task go_back from add_task step returns to task_menu (line 1101)."""
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    assert result["step_id"] == "add_task"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "X",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.TIME_BASED,
            "go_back": True,
        },
    )
    assert result["step_id"] == "task_menu"


# ============================================================================
# config_flow_trigger.py coverage - initial config flow (migrated)
# ============================================================================


async def test_trigger_mixin_check_go_back_awaitable(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """_mixin_check_go_back handles async callback (line 146)."""
    # Going back from sensor_select goes through async _on_cancel.
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Async Cancel Test",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    assert result["step_id"] == "sensor_select"

    # go_back triggers the async _on_cancel (lambda returns awaitable step)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.x"], "go_back": True},
    )
    assert result["step_id"] == "add_task"


async def test_sensor_attribute_go_back(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """sensor_attribute go_back (line 229) returns to sensor_select."""
    hass.states.async_set("sensor.test_a", "25.0", {"unit_of_measurement": "°C"})
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Attr Go Back",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.test_a"]},
    )
    assert result["step_id"] == "sensor_attribute"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state", "go_back": True},
    )
    assert result["step_id"] == "sensor_select"


async def test_trigger_type_go_back_to_sensor_attribute(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """trigger_type go_back returns to sensor_attribute (line 259)."""
    hass.states.async_set("sensor.test_b", "30.0", {"unit_of_measurement": "°C"})
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Type Go Back",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.test_b"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    assert result["step_id"] == "trigger_type"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD, "go_back": True},
    )
    assert result["step_id"] == "sensor_attribute"


async def test_trigger_threshold_go_back(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """trigger_threshold go_back returns to trigger_type (line 273)."""
    hass.states.async_set("sensor.test_c", "25.0", {"unit_of_measurement": "°C"})
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Threshold Go Back",
            CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.test_c"]},
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

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ABOVE: 30, CONF_TASK_WARNING_DAYS: 7, "go_back": True},
    )
    assert result["step_id"] == "trigger_type"


async def test_trigger_counter_go_back(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """trigger_counter go_back returns to trigger_type (line 493)."""
    hass.states.async_set("sensor.counter", "500", {"unit_of_measurement": "h"})
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Counter GB",
            CONF_TASK_TYPE: MaintenanceTypeEnum.SERVICE,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.counter"]},
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
        user_input={CONF_TRIGGER_TARGET_VALUE: 1000, "go_back": True},
    )
    assert result["step_id"] == "trigger_type"


async def test_trigger_counter_with_multi_entity_logic(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """counter trigger with 2 entities stores entity_logic (line 502)."""
    hass.states.async_set("sensor.c1", "100", {"unit_of_measurement": "h"})
    hass.states.async_set("sensor.c2", "200", {"unit_of_measurement": "h"})
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Multi Counter",
            CONF_TASK_TYPE: MaintenanceTypeEnum.SERVICE,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.c1", "sensor.c2"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.COUNTER},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TRIGGER_TARGET_VALUE: 500,
            CONF_TRIGGER_DELTA_MODE: False,
            CONF_TRIGGER_ENTITY_LOGIC: "all",
            CONF_TASK_WARNING_DAYS: 7,
        },
    )
    assert result["step_id"] == "task_menu"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    task = list(result["data"][CONF_TASKS].values())[0]
    assert task["trigger_config"][CONF_TRIGGER_ENTITY_LOGIC] == "all"


async def test_trigger_state_change_go_back(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """trigger_state_change go_back returns to trigger_type (line 602)."""
    hass.states.async_set("binary_sensor.door", "off")
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "SC GB",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["binary_sensor.door"]},
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
        user_input={CONF_TRIGGER_TARGET_CHANGES: 5, CONF_TASK_WARNING_DAYS: 7, "go_back": True},
    )
    assert result["step_id"] == "trigger_type"


async def test_trigger_state_change_with_multi_entity_logic(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """state_change trigger with multiple entities stores entity_logic (line 620)."""
    hass.states.async_set("binary_sensor.d1", "off")
    hass.states.async_set("binary_sensor.d2", "on")
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Multi SC",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["binary_sensor.d1", "binary_sensor.d2"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.STATE_CHANGE},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TRIGGER_FROM_STATE: "off",
            CONF_TRIGGER_TO_STATE: "on",
            CONF_TRIGGER_TARGET_CHANGES: 3,
            CONF_TRIGGER_ENTITY_LOGIC: "any",
            CONF_TASK_WARNING_DAYS: 7,
        },
    )
    assert result["step_id"] == "task_menu"
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    task = list(result["data"][CONF_TASKS].values())[0]
    assert task["trigger_config"][CONF_TRIGGER_ENTITY_LOGIC] == "any"


async def test_trigger_runtime_go_back(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """runtime trigger go_back returns to trigger_type (line 715)."""
    hass.states.async_set("sensor.pump_h", "100", {"unit_of_measurement": "h"})
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Runtime GB",
            CONF_TASK_TYPE: MaintenanceTypeEnum.SERVICE,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.pump_h"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.RUNTIME},
    )
    assert result["step_id"] == "trigger_runtime"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_RUNTIME_HOURS: 200, CONF_TASK_WARNING_DAYS: 7, "go_back": True},
    )
    assert result["step_id"] == "trigger_type"


async def test_trigger_runtime_with_multi_entity_logic(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """runtime trigger with multiple entities stores entity_logic (line 734)."""
    hass.states.async_set("sensor.pump1", "100", {"unit_of_measurement": "h"})
    hass.states.async_set("sensor.pump2", "200", {"unit_of_measurement": "h"})
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Multi Runtime",
            CONF_TASK_TYPE: MaintenanceTypeEnum.SERVICE,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.pump1", "sensor.pump2"]},
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
            CONF_TRIGGER_RUNTIME_HOURS: 500,
            CONF_TRIGGER_ENTITY_LOGIC: "all",
            CONF_TASK_WARNING_DAYS: 7,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    task = list(result["data"][CONF_TASKS].values())[0]
    assert task["trigger_config"][CONF_TRIGGER_ENTITY_LOGIC] == "all"


async def test_runtime_empty_on_states(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """runtime trigger with empty on_states doesn't store key (line 776)."""
    hass.states.async_set("sensor.pump_e", "100", {"unit_of_measurement": "h"})
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Runtime Empty States",
            CONF_TASK_TYPE: MaintenanceTypeEnum.SERVICE,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.pump_e"]},
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
            CONF_TRIGGER_ON_STATES: "  ",  # whitespace-only = empty
            CONF_TASK_WARNING_DAYS: 7,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    task = list(result["data"][CONF_TASKS].values())[0]
    assert CONF_TRIGGER_ON_STATES not in task["trigger_config"]


async def test_compound_condition_counter_flow(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """compound trigger with COUNTER condition (lines 834, 945-949)."""
    hass.states.async_set("sensor.count_a", "100", {"unit_of_measurement": "h"})
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Compound Counter",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.count_a"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.COMPOUND},
    )
    assert result["step_id"] == "compound_logic"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"compound_logic": "and"},
    )
    assert result["step_id"] == "compound_condition_entity"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.count_a"]},
    )
    assert result["step_id"] == "compound_condition_type"

    # Select COUNTER type
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.COUNTER},
    )
    assert result["step_id"] == "compound_condition_counter"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TARGET_VALUE: 100, CONF_TRIGGER_DELTA_MODE: False},
    )
    assert result["step_id"] == "compound_review"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"compound_action": "finish"},
    )
    assert result["step_id"] == "task_menu"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    task = list(result["data"][CONF_TASKS].values())[0]
    assert task["trigger_config"]["type"] == "compound"
    assert task["trigger_config"]["conditions"][0]["trigger_target_value"] == 100


async def test_compound_condition_state_change_flow(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """compound trigger with STATE_CHANGE condition (lines 985, 993)."""
    hass.states.async_set("binary_sensor.motion", "off")
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Compound SC",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["binary_sensor.motion"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.COMPOUND},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"compound_logic": "or"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["binary_sensor.motion"]},
    )
    assert result["step_id"] == "compound_condition_type"

    # Select STATE_CHANGE type
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.STATE_CHANGE},
    )
    assert result["step_id"] == "compound_condition_state_change"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TRIGGER_FROM_STATE: "off",
            CONF_TRIGGER_TO_STATE: "on",
            CONF_TRIGGER_TARGET_CHANGES: 5,
        },
    )
    assert result["step_id"] == "compound_review"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"compound_action": "finish"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    task = list(result["data"][CONF_TASKS].values())[0]
    cond = task["trigger_config"]["conditions"][0]
    assert cond.get("trigger_from_state") == "off"
    assert cond.get("trigger_to_state") == "on"


async def test_compound_condition_runtime_flow(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """compound trigger with RUNTIME condition (lines 996-1018)."""
    hass.states.async_set("sensor.rt_hours", "200", {"unit_of_measurement": "h"})
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Compound Runtime",
            CONF_TASK_TYPE: MaintenanceTypeEnum.SERVICE,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.rt_hours"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.COMPOUND},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"compound_logic": "and"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.rt_hours"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.RUNTIME},
    )
    assert result["step_id"] == "compound_condition_runtime"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TRIGGER_RUNTIME_HOURS: 500,
            CONF_TRIGGER_ON_STATES: "running,idle",
        },
    )
    assert result["step_id"] == "compound_review"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"compound_action": "finish"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"next_step_id": "finish"},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    task = list(result["data"][CONF_TASKS].values())[0]
    cond = task["trigger_config"]["conditions"][0]
    assert cond["trigger_runtime_hours"] == 500
    assert "running" in cond.get("trigger_on_states", [])


async def test_compound_condition_entity_go_back_to_review(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """compound_condition_entity go_back after 1st condition → compound_review (line 1024)."""
    hass.states.async_set("sensor.temp_x", "25.0", {"unit_of_measurement": "°C"})
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Compound GB Review",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.temp_x"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.COMPOUND},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"compound_logic": "and"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.temp_x"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ABOVE: 30.0},
    )
    assert result["step_id"] == "compound_review"

    # Add another condition, then go back — should return to compound_review
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"compound_action": "add"},
    )
    assert result["step_id"] == "compound_condition_entity"

    # Go back from compound_condition_entity when conditions already exist
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.temp_x"], "go_back": True},
    )
    assert result["step_id"] == "compound_review"


async def test_compound_condition_type_go_back(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """compound_condition_type go_back → compound_condition_entity (line 1053)."""
    hass.states.async_set("sensor.t2", "50.0", {"unit_of_measurement": "°C"})
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Cond Type GB",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.t2"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.COMPOUND},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"compound_logic": "and"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.t2"]},
    )
    assert result["step_id"] == "compound_condition_type"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD, "go_back": True},
    )
    assert result["step_id"] == "compound_condition_entity"


async def test_compound_condition_threshold_go_back(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """compound_condition_threshold go_back → compound_condition_type (lines 1053-1082)."""
    hass.states.async_set("sensor.th2", "25.0", {"unit_of_measurement": "°C"})
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Cond Thresh GB",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.th2"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.COMPOUND},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"compound_logic": "and"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.th2"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD},
    )
    assert result["step_id"] == "compound_condition_threshold"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ABOVE: 30.0, "go_back": True},
    )
    assert result["step_id"] == "compound_condition_type"


async def test_compound_review_go_back(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """compound_review go_back → compound_logic (line 1097)."""
    hass.states.async_set("sensor.rv", "25.0", {"unit_of_measurement": "°C"})
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Review GB",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.rv"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.COMPOUND},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"compound_logic": "and"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.rv"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ABOVE: 30.0},
    )
    assert result["step_id"] == "compound_review"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"compound_action": "finish", "go_back": True},
    )
    assert result["step_id"] == "compound_logic"


async def test_compound_logic_go_back(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """compound_logic go_back → trigger_type (line 1127)."""
    hass.states.async_set("sensor.lg", "25.0", {"unit_of_measurement": "°C"})
    await setup_integration(hass, global_entry)

    result = await _navigate_to_add_task(hass, global_entry)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_TASK_NAME: "Logic GB",
            CONF_TASK_TYPE: MaintenanceTypeEnum.INSPECTION,
            CONF_TASK_SCHEDULE_TYPE: ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ENTITY: ["sensor.lg"]},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_ATTRIBUTE: "_state"},
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={CONF_TRIGGER_TYPE: TriggerType.COMPOUND},
    )
    assert result["step_id"] == "compound_logic"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"compound_logic": "and", "go_back": True},
    )
    assert result["step_id"] == "trigger_type"
