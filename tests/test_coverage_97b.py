"""Coverage push tests — batch 2: config_flow_options_task.py, config_flow_trigger.py,
and remaining small gaps in other modules.
"""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceTypeEnum,
    ScheduleType,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)

# ─── Fixtures ─────────────────────────────────────────────────────────


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    data = build_global_entry_data()
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        options={
            **data,
            "advanced_adaptive_visible": True,
            "advanced_predictions_visible": False,
            "advanced_seasonal_visible": False,
            "advanced_environmental_visible": False,
            "advanced_budget_visible": False,
            "advanced_groups_visible": False,
            "advanced_checklists_visible": True,
        },
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    task = build_task_data(last_performed="2024-06-01")
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_cov97b_pump",
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def sensor_task_entry(hass: HomeAssistant) -> MockConfigEntry:
    """Object with a sensor-based task that has trigger_config."""
    task = build_task_data(
        last_performed="2024-06-01",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.cov97b_temp",
            "entity_ids": ["sensor.cov97b_temp"],
            "trigger_above": 30,
        },
    )
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Sensor Pump",
        data=build_object_entry_data(
            object_data=build_object_data(name="Sensor Pump"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_cov97b_sensor",
    )
    entry.add_to_hass(hass)
    return entry


# ─── config_flow_options_task.py: manage_tasks invalid selection (191) ─


async def test_manage_tasks_invalid_selection(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Line 191: selecting a nonexistent task returns to menu (bypass schema)."""
    from custom_components.maintenance_supporter.config_flow_options_task import (
        MaintenanceOptionsFlow,
    )
    await setup_integration(hass, global_entry, object_entry)

    flow = MaintenanceOptionsFlow()
    flow.hass = hass
    flow._config_entry = hass.config_entries.async_get_entry(object_entry.entry_id)  # type: ignore[attr-defined]
    flow.handler = object_entry.entry_id

    # Call directly with a task ID that isn't in tasks_data
    result = await flow.async_step_manage_tasks(
        {"selected_task": "nonexistent_task_zzz", "go_back": False},
    )
    assert result["type"] == FlowResultType.MENU


# ─── config_flow_options_task.py: add_task with icon (843) ────────────


async def test_add_task_with_icon(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 843, 109: adding task with custom icon."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "add_task"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "add_task"

    # Submit with icon
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "name": "Icon Task",
            "type": MaintenanceTypeEnum.INSPECTION,
            "schedule_type": ScheduleType.TIME_BASED,
            "custom_icon": "mdi:wrench",
        },
    )
    # Should show time_based config
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "opt_time_based"


# ─── config_flow_options_task.py: time_based invalid interval (904) ───


async def test_time_based_invalid_interval(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Line 904: interval <= 0 shows error (bypass NumberSelector min=1)."""
    from custom_components.maintenance_supporter.config_flow_options_task import (
        MaintenanceOptionsFlow,
    )
    await setup_integration(hass, global_entry, object_entry)

    flow = MaintenanceOptionsFlow()
    flow.hass = hass
    flow._config_entry = hass.config_entries.async_get_entry(object_entry.entry_id)  # type: ignore[attr-defined]
    flow.handler = object_entry.entry_id
    flow._current_task = {
        "name": "Bad Interval",
        "type": MaintenanceTypeEnum.CLEANING,
        "schedule_type": ScheduleType.TIME_BASED,
    }

    # Call directly with interval = 0
    result = await flow.async_step_opt_time_based(
        {"interval_days": 0, "warning_days": 7},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "opt_time_based"
    assert (result.get("errors") or {}).get("interval_days") == "invalid_interval"


# ─── config_flow_options_task.py: non-completion anchor (103) ─────────


async def test_add_task_non_completion_anchor(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Line 103: anchor != 'completion' stored in task_data."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "name": "Planned Task",
            "type": MaintenanceTypeEnum.SERVICE,
            "schedule_type": ScheduleType.TIME_BASED,
        },
    )

    # Submit with planned anchor
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "interval_days": 90,
            "warning_days": 14,
            "interval_anchor": "planned",
        },
    )
    # Should return to init menu (task saved)
    assert result["type"] == FlowResultType.MENU


# ─── config_flow_options_task.py: edit_task with icon and NFC (301,306)


async def test_edit_task_icon_and_nfc(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 301, 306: setting icon and NFC tag during task edit."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"selected_task": TASK_ID_1, "go_back": False},
    )
    assert result["type"] == FlowResultType.MENU  # task_action menu

    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "edit_task"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "edit_task"

    # Submit with icon and NFC tag
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "name": "Updated Filter",
            "type": MaintenanceTypeEnum.CLEANING,
            "interval_days": 30,
            "warning_days": 7,
            "enabled": True,
            "custom_icon": "mdi:filter",
            "nfc_tag_id": " TAG_123 ",  # with spaces to test strip
        },
    )
    # Should return to task action menu
    assert result["type"] == FlowResultType.MENU


# ─── config_flow_options_task.py: trigger_summary entity states (560,566)


async def test_trigger_summary_entity_states(
    hass: HomeAssistant, global_entry: MockConfigEntry, sensor_task_entry: MockConfigEntry,
) -> None:
    """Lines 560, 566: trigger summary with single entity_id string and unavailable entity."""
    hass.states.async_set("sensor.cov97b_temp", "25.0")
    await setup_integration(hass, global_entry, sensor_task_entry)

    # Modify task to have entity_id as string (not list) to test line 560
    entry = hass.config_entries.async_get_entry(sensor_task_entry.entry_id)
    assert entry is not None
    new_data = dict(entry.data)
    tasks = dict(new_data[CONF_TASKS])
    task = dict(tasks[TASK_ID_1])
    task["trigger_config"] = {
        "type": "threshold",
        "entity_id": "sensor.nonexistent_entity",  # unavailable entity for line 566
        "trigger_above": 30,
    }
    # Remove entity_ids to test the string-to-list conversion (line 560)
    tasks[TASK_ID_1] = task
    new_data[CONF_TASKS] = tasks
    hass.config_entries.async_update_entry(entry, data=new_data)

    result = await hass.config_entries.options.async_init(sensor_task_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"selected_task": TASK_ID_1, "go_back": False},
    )
    # Navigate to edit_trigger which shows trigger_summary first
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "edit_trigger"},
    )
    # Should show trigger_summary menu
    assert result["type"] == FlowResultType.MENU
    assert result["step_id"] == "trigger_summary"


# ─── config_flow_options_task.py: _get_global_options no global entry (226)


async def test_get_global_options_no_global(
    hass: HomeAssistant,
) -> None:
    """Line 226: _get_global_options returns {} when no global entry."""
    from custom_components.maintenance_supporter.config_flow_options_task import (
        MaintenanceOptionsFlow,
    )

    task = build_task_data(last_performed="2024-06-01")
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pump", source="user",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        unique_id="maintenance_supporter_cov97b_noglobal",
    )
    obj_entry.add_to_hass(hass)

    flow = MaintenanceOptionsFlow()
    flow.hass = hass
    flow._config_entry = obj_entry  # type: ignore[attr-defined]

    result = flow._get_global_options()
    assert result == {}


# ─── config_flow_options_task.py: adaptive_scheduling paths ───────────


async def test_adaptive_scheduling_min_exceeds_max(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Line 1207: min_interval > max_interval shows error."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"selected_task": TASK_ID_1, "go_back": False},
    )
    # Navigate to adaptive_scheduling
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "adaptive_scheduling"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "adaptive_scheduling"

    # Submit with min > max
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "adaptive_enabled": True,
            "ewa_alpha": 0.3,
            "min_interval_days": 60,  # min > max
            "max_interval_days": 30,
            "seasonal_enabled": True,
            "sensor_prediction_enabled": False,
        },
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "adaptive_scheduling"
    assert "min_exceeds_max" in str(result.get("errors", {}))


async def test_adaptive_scheduling_with_env_entity(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Line 1225: setting environmental_entity in adaptive config."""
    await setup_integration(hass, global_entry, object_entry)
    hass.states.async_set("sensor.outdoor_temp", "20.0")

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "adaptive_scheduling"},
    )
    assert result["step_id"] == "adaptive_scheduling"

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "adaptive_enabled": True,
            "ewa_alpha": 0.3,
            "min_interval_days": 7,
            "max_interval_days": 365,
            "seasonal_enabled": True,
            "sensor_prediction_enabled": True,
            "environmental_entity": "sensor.outdoor_temp",
        },
    )
    # Should return to task action menu
    assert result["type"] == FlowResultType.MENU


async def test_adaptive_scheduling_legacy_store_none(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 1188, 1239-1245: adaptive scheduling with store=None (legacy path)."""
    await setup_integration(hass, global_entry, object_entry)

    # Patch store to None
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    rd = entry.runtime_data
    original_store = rd.store
    rd.store = None

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"selected_task": TASK_ID_1, "go_back": False},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "adaptive_scheduling"},
    )
    assert result["step_id"] == "adaptive_scheduling"

    # Submit adaptive config
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "adaptive_enabled": True,
            "ewa_alpha": 0.3,
            "min_interval_days": 7,
            "max_interval_days": 365,
            "seasonal_enabled": False,
            "sensor_prediction_enabled": False,
        },
    )
    assert result["type"] == FlowResultType.MENU

    rd.store = original_store


# ─── config_flow_options_task.py: save_new_task legacy path (131-137) ─


async def test_save_new_task_legacy_store_none(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 131-137: saving new task with last_performed when store is None."""
    await setup_integration(hass, global_entry, object_entry)

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    rd = entry.runtime_data
    original_store = rd.store
    rd.store = None

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "name": "Legacy Task",
            "type": MaintenanceTypeEnum.CLEANING,
            "schedule_type": ScheduleType.TIME_BASED,
        },
    )
    # Submit time-based config with last_performed
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "interval_days": 30,
            "warning_days": 7,
            "last_performed": "2024-06-01",
        },
    )
    assert result["type"] == FlowResultType.MENU

    rd.store = original_store


# ─── config_flow_trigger.py: easy paths via options flow ──────────────


async def test_trigger_threshold_below_and_interval(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 382, 397: threshold with trigger_below and interval_days > 0."""
    hass.states.async_set("sensor.cov97b_below", "10.0", {
        "unit_of_measurement": "°C",
    })
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "name": "Below Task",
            "type": MaintenanceTypeEnum.INSPECTION,
            "schedule_type": ScheduleType.SENSOR_BASED,
        },
    )
    # Sensor select step
    assert result["step_id"] == "opt_sensor_select"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"trigger_entity": ["sensor.cov97b_below"]},
    )
    # Attribute select step
    assert result["step_id"] == "opt_sensor_attribute"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"trigger_attribute": "_state"},
    )
    # Trigger type select
    assert result["step_id"] == "opt_trigger_type"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"trigger_type": "threshold"},
    )
    # Threshold config — use trigger_below and set interval
    assert result["step_id"] == "opt_trigger_threshold"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "trigger_below": 5.0,
            "interval_days": 14,
        },
    )
    # Task should be saved, back to menu
    assert result["type"] == FlowResultType.MENU


async def test_trigger_state_change_with_interval(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Line 612: state_change trigger with interval_days > 0."""
    hass.states.async_set("sensor.cov97b_state", "on")
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "name": "State Task",
            "type": MaintenanceTypeEnum.INSPECTION,
            "schedule_type": ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"trigger_entity": ["sensor.cov97b_state"]},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"trigger_attribute": "_state"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"trigger_type": "state_change"},
    )
    # State change config with interval
    assert result["step_id"] == "opt_trigger_state_change"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "trigger_target_changes": 5,
            "interval_days": 30,
        },
    )
    assert result["type"] == FlowResultType.MENU


async def test_trigger_runtime_with_interval(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 695 (go_back), 721: runtime trigger with interval_days > 0.
    Actually testing line 1082 (the wrapper) + 721 (interval)."""
    hass.states.async_set("sensor.cov97b_runtime", "on")
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "name": "Runtime Task",
            "type": MaintenanceTypeEnum.INSPECTION,
            "schedule_type": ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"trigger_entity": ["sensor.cov97b_runtime"]},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"trigger_attribute": "_state"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"trigger_type": "runtime"},
    )
    assert result["step_id"] == "opt_trigger_runtime"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "trigger_runtime_hours": 100,
            "interval_days": 60,
        },
    )
    assert result["type"] == FlowResultType.MENU


async def test_trigger_counter_with_interval(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 503: counter trigger with interval_days > 0."""
    hass.states.async_set("sensor.cov97b_counter", "50")
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "name": "Counter Task",
            "type": MaintenanceTypeEnum.INSPECTION,
            "schedule_type": ScheduleType.SENSOR_BASED,
        },
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"trigger_entity": ["sensor.cov97b_counter"]},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"trigger_attribute": "_state"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"trigger_type": "counter"},
    )
    assert result["step_id"] == "opt_trigger_counter"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "trigger_target_value": 1000,
            "interval_days": 90,
        },
    )
    assert result["type"] == FlowResultType.MENU


# ─── config_flow_trigger.py: entity attribute unavailable (242) ──────


async def test_trigger_attribute_entity_unavailable(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Line 242: entity_state is None when attribute step shows form."""
    from custom_components.maintenance_supporter.config_flow_options_task import (
        MaintenanceOptionsFlow,
    )
    await setup_integration(hass, global_entry, object_entry)

    flow = MaintenanceOptionsFlow()
    flow.hass = hass
    flow._config_entry = hass.config_entries.async_get_entry(object_entry.entry_id)  # type: ignore[attr-defined]
    flow.handler = object_entry.entry_id
    flow._current_task = {}
    flow._trigger_entity_id = "sensor.nonexistent"
    flow._trigger_entity_state = None  # type: ignore[assignment]
    flow._trigger_entity_ids = ["sensor.nonexistent"]

    # Call attribute step with no user_input (form display) — hits line 242
    result = await flow.async_step_opt_sensor_attribute(None)
    assert result["type"] == FlowResultType.ABORT
    assert result["reason"] == "entity_unavailable"


# ─── config_flow_trigger.py: empty entity list (182) ─────────────────


async def test_trigger_sensor_empty_entity(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Line 182: empty entity list shows error."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.options.async_init(object_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "add_task"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "name": "Empty Entity",
            "type": MaintenanceTypeEnum.INSPECTION,
            "schedule_type": ScheduleType.SENSOR_BASED,
        },
    )
    # Submit with empty entity list
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"trigger_entity": []},
    )
    # Should show form again with error
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "opt_sensor_select"


# ─── config_flow_options_task.py: remove_trigger entity_id format (634-635)


async def test_remove_trigger_single_entity_id(
    hass: HomeAssistant, global_entry: MockConfigEntry, sensor_task_entry: MockConfigEntry,
) -> None:
    """Lines 634-635: remove_trigger with single entity_id string format."""
    hass.states.async_set("sensor.cov97b_temp", "25.0")
    await setup_integration(hass, global_entry, sensor_task_entry)

    result = await hass.config_entries.options.async_init(sensor_task_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"selected_task": TASK_ID_1, "go_back": False},
    )
    # Navigate to remove_trigger
    assert "remove_trigger" in result["menu_options"]
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "remove_trigger"},
    )
    # Should show confirmation form
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "remove_trigger"

    # Confirm removal
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"confirm": True},
    )
    assert result["type"] == FlowResultType.MENU


# ─── config_flow_options_task.py: _save_edited_trigger (608) ─────────


async def test_edit_trigger_saves_interval(
    hass: HomeAssistant, global_entry: MockConfigEntry, sensor_task_entry: MockConfigEntry,
) -> None:
    """Line 608: _save_edited_trigger saves interval_days."""
    hass.states.async_set("sensor.cov97b_temp", "25.0", {
        "unit_of_measurement": "°C",
    })
    await setup_integration(hass, global_entry, sensor_task_entry)

    result = await hass.config_entries.options.async_init(sensor_task_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_tasks"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"selected_task": TASK_ID_1, "go_back": False},
    )
    # Navigate to edit_trigger
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "edit_trigger"},
    )
    # Shows trigger_summary first
    assert result["step_id"] == "trigger_summary"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "edit_trigger_proceed"},
    )
    # Sensor select
    assert result["step_id"] == "opt_sensor_select"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"trigger_entity": ["sensor.cov97b_temp"]},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"trigger_attribute": "_state"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"trigger_type": "threshold"},
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "trigger_above": 40,
            "interval_days": 14,  # This triggers line 608
        },
    )
    # Should save and return to task action menu
    assert result["type"] == FlowResultType.MENU
