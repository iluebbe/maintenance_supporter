"""Tests for the repair flow (repairs.py)."""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    ScheduleType,
)
from custom_components.maintenance_supporter.repairs import (
    MissingTriggerEntityRepairFlow,
    async_create_fix_flow,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
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


def _make_sensor_entry(
    hass: HomeAssistant,
    entity_id: str = "sensor.old_temp",
    entity_ids: list[str] | None = None,
    interval_days: int | None = 30,
    unique_id: str = "repair_test",
) -> MockConfigEntry:
    """Create an entry with a sensor-based trigger task."""
    tc: dict[str, Any] = {
        "type": "threshold",
        "entity_id": entity_id,
        "trigger_above": 30.0,
    }
    if entity_ids:
        tc["entity_ids"] = entity_ids

    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=interval_days,
        trigger_config=tc,
    )
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Repair Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Repair Object"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


def _make_flow(
    hass: HomeAssistant,
    entry_id: str,
    task_id: str = TASK_ID_1,
    entity_id: str = "sensor.old_temp",
) -> MissingTriggerEntityRepairFlow:
    """Create a repair flow instance with issue data."""
    flow = MissingTriggerEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": entry_id,
        "task_id": task_id,
        "task_name": "Filter Cleaning",
        "object_name": "Repair Object",
        "entity_id": entity_id,
    }
    return flow


# ─── Init Step Tests ──────────────────────────────────────────────────────


async def test_repair_init_shows_menu(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that init step shows menu with 3 options."""
    obj_entry = _make_sensor_entry(hass)
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_flow(hass, obj_entry.entry_id)
    result = await flow.async_step_init()

    assert result["type"] == "menu"
    assert "replace_entity" in result["menu_options"]
    assert "remove_trigger" in result["menu_options"]
    assert "dismiss" in result["menu_options"]


async def test_repair_init_placeholders(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that init step includes correct placeholders."""
    obj_entry = _make_sensor_entry(hass)
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_flow(hass, obj_entry.entry_id)
    result = await flow.async_step_init()

    placeholders = result["description_placeholders"]
    assert placeholders is not None
    assert placeholders["entity_id"] == "sensor.old_temp"
    assert placeholders["task_name"] == "Filter Cleaning"
    assert placeholders["object_name"] == "Repair Object"


# ─── Dismiss Step ─────────────────────────────────────────────────────────


async def test_repair_dismiss(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test dismiss creates empty entry."""
    obj_entry = _make_sensor_entry(hass)
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_flow(hass, obj_entry.entry_id)
    result = await flow.async_step_dismiss()

    assert result["type"] == "create_entry"
    assert result["data"] == {}


# ─── Replace Entity Step ──────────────────────────────────────────────────


async def test_repair_replace_shows_form(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test replace_entity step shows form with EntitySelector."""
    obj_entry = _make_sensor_entry(hass)
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_flow(hass, obj_entry.entry_id)
    result = await flow.async_step_replace_entity()

    assert result["type"] == "form"
    assert result["step_id"] == "replace_entity"


async def test_repair_replace_updates_config(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that replacing entity updates config entry."""
    obj_entry = _make_sensor_entry(hass)
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_flow(hass, obj_entry.entry_id)
    result = await flow.async_step_replace_entity({"new_entity_id": "sensor.new_temp"})

    assert result["type"] == "create_entry"

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    tc = entry.data[CONF_TASKS][TASK_ID_1]["trigger_config"]
    assert tc["entity_id"] == "sensor.new_temp"


async def test_repair_replace_multi_entity(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test replacing entity in multi-entity trigger."""
    obj_entry = _make_sensor_entry(
        hass,
        entity_id="sensor.old_temp",
        entity_ids=["sensor.old_temp", "sensor.other"],
        unique_id="repair_multi",
    )
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_flow(hass, obj_entry.entry_id, entity_id="sensor.old_temp")
    result = await flow.async_step_replace_entity({"new_entity_id": "sensor.new_temp"})

    assert result["type"] == "create_entry"
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    tc = entry.data[CONF_TASKS][TASK_ID_1]["trigger_config"]
    assert "sensor.new_temp" in tc["entity_ids"]
    assert "sensor.old_temp" not in tc["entity_ids"]


async def test_repair_replace_resets_baseline(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that replacing entity removes baseline/change_count."""
    obj_entry = _make_sensor_entry(hass, unique_id="repair_baseline")
    await setup_integration(hass, global_entry, obj_entry)

    # Add baseline to trigger config
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    new_data = dict(entry.data)
    tasks = dict(new_data[CONF_TASKS])
    task = dict(tasks[TASK_ID_1])
    tc = dict(task["trigger_config"])
    tc["trigger_baseline_value"] = 100
    tc["trigger_change_count"] = 5
    task["trigger_config"] = tc
    tasks[TASK_ID_1] = task
    new_data[CONF_TASKS] = tasks
    hass.config_entries.async_update_entry(entry, data=new_data)

    flow = _make_flow(hass, obj_entry.entry_id)
    result = await flow.async_step_replace_entity({"new_entity_id": "sensor.new"})

    updated = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert updated is not None
    tc = updated.data[CONF_TASKS][TASK_ID_1]["trigger_config"]
    assert "trigger_baseline_value" not in tc
    assert "trigger_change_count" not in tc


async def test_repair_replace_missing_data(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test replace with missing entry_id in issue data logs error."""
    await setup_integration(hass, global_entry)

    flow = MissingTriggerEntityRepairFlow()
    flow.hass = hass
    flow.data = {}  # Missing entry_id and task_id

    # Should not crash, just log
    await flow._replace_trigger_entity("sensor.new")


# ─── Remove Trigger Step ──────────────────────────────────────────────────


async def test_repair_remove_shows_confirm(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test remove_trigger shows confirmation form."""
    obj_entry = _make_sensor_entry(hass, unique_id="repair_remove_form")
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_flow(hass, obj_entry.entry_id)
    result = await flow.async_step_remove_trigger()

    assert result["type"] == "form"
    assert result["step_id"] == "remove_trigger"


async def test_repair_remove_single_to_time_based(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test removing single-entity trigger converts to time_based."""
    obj_entry = _make_sensor_entry(hass, interval_days=30, unique_id="repair_remove_tb")
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_flow(hass, obj_entry.entry_id)
    result = await flow.async_step_remove_trigger({})

    assert result["type"] == "create_entry"
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    task = entry.data[CONF_TASKS][TASK_ID_1]
    assert task["schedule_type"] == ScheduleType.TIME_BASED
    assert "trigger_config" not in task


async def test_repair_remove_single_to_manual(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test removing trigger without interval converts to manual."""
    obj_entry = _make_sensor_entry(hass, interval_days=None, unique_id="repair_remove_manual")
    await setup_integration(hass, global_entry, obj_entry)

    # Clear interval_days from the task
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    new_data = dict(entry.data)
    tasks = dict(new_data[CONF_TASKS])
    task = dict(tasks[TASK_ID_1])
    task.pop("interval_days", None)
    tasks[TASK_ID_1] = task
    new_data[CONF_TASKS] = tasks
    hass.config_entries.async_update_entry(entry, data=new_data)

    flow = _make_flow(hass, obj_entry.entry_id)
    result = await flow.async_step_remove_trigger({})

    assert result["type"] == "create_entry"
    updated = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert updated is not None
    task_data = updated.data[CONF_TASKS][TASK_ID_1]
    assert task_data["schedule_type"] == ScheduleType.MANUAL


async def test_repair_remove_multi_keeps_remaining(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test removing one entity from multi-entity trigger keeps remaining."""
    obj_entry = _make_sensor_entry(
        hass,
        entity_id="sensor.old_temp",
        entity_ids=["sensor.old_temp", "sensor.other"],
        unique_id="repair_remove_multi",
    )
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_flow(hass, obj_entry.entry_id, entity_id="sensor.old_temp")
    result = await flow.async_step_remove_trigger({})

    assert result["type"] == "create_entry"
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    tc = entry.data[CONF_TASKS][TASK_ID_1]["trigger_config"]
    assert tc["entity_ids"] == ["sensor.other"]
    assert tc["entity_id"] == "sensor.other"


async def test_repair_remove_missing_data(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test remove with missing entry_id in issue data logs error."""
    await setup_integration(hass, global_entry)

    flow = MissingTriggerEntityRepairFlow()
    flow.hass = hass
    flow.data = {}

    await flow._remove_trigger()


# ─── Stale Task Guards ─────────────────────────────────────────────────────


async def test_repair_replace_aborts_when_task_deleted(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test replace_entity aborts if the task was deleted after issue creation."""
    obj_entry = _make_sensor_entry(hass, unique_id="repair_stale_replace")
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_flow(hass, obj_entry.entry_id)

    # Delete the task from config entry data
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    new_data = dict(entry.data)
    new_data[CONF_TASKS] = {}
    hass.config_entries.async_update_entry(entry, data=new_data)

    result = await flow.async_step_replace_entity({"new_entity_id": "sensor.new"})
    assert result["type"] == "abort"
    assert result["reason"] == "task_deleted"


async def test_repair_remove_aborts_when_task_deleted(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test remove_trigger aborts if the task was deleted after issue creation."""
    obj_entry = _make_sensor_entry(hass, unique_id="repair_stale_remove")
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_flow(hass, obj_entry.entry_id)

    # Delete the task from config entry data
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    new_data = dict(entry.data)
    new_data[CONF_TASKS] = {}
    hass.config_entries.async_update_entry(entry, data=new_data)

    result = await flow.async_step_remove_trigger({})
    assert result["type"] == "abort"
    assert result["reason"] == "task_deleted"


async def test_repair_replace_aborts_when_entry_gone(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test replace_entity aborts if config entry was removed."""
    obj_entry = _make_sensor_entry(hass, unique_id="repair_stale_entry")
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_flow(hass, obj_entry.entry_id)

    # Remove the config entry entirely
    await hass.config_entries.async_remove(obj_entry.entry_id)
    await hass.async_block_till_done()

    result = await flow.async_step_replace_entity({"new_entity_id": "sensor.new"})
    assert result["type"] == "abort"
    assert result["reason"] == "task_deleted"


# ─── Factory ──────────────────────────────────────────────────────────────


async def test_delete_task_cleans_up_repair_issues(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that deleting a task cleans up associated repair issues."""
    from homeassistant.helpers import issue_registry as ir_mod

    obj_entry = _make_sensor_entry(hass, unique_id="repair_delete_cleanup")
    await setup_integration(hass, global_entry, obj_entry)

    # Create a repair issue for this task
    issue_id = f"missing_trigger_{obj_entry.entry_id}_{TASK_ID_1}_sensor.old_temp"
    ir_mod.async_create_issue(
        hass, DOMAIN, issue_id,
        is_fixable=True,
        severity=ir_mod.IssueSeverity.WARNING,
        translation_key="missing_trigger_entity",
    )

    # Verify issue exists
    issue_reg = ir_mod.async_get(hass)
    assert issue_reg.async_get_issue(DOMAIN, issue_id) is not None

    # Delete the task via WS handler
    from custom_components.maintenance_supporter.websocket.tasks import ws_delete_task

    mock_conn = MagicMock()
    mock_conn.send_result = MagicMock()
    mock_conn.send_error = MagicMock()

    await call_ws_handler(ws_delete_task,
        hass, mock_conn,
        {"id": 1, "type": "maintenance_supporter/task/delete",
         "entry_id": obj_entry.entry_id, "task_id": TASK_ID_1},
    )
    await hass.async_block_till_done()

    mock_conn.send_result.assert_called()

    # Verify the repair issue was cleaned up
    assert issue_reg.async_get_issue(DOMAIN, issue_id) is None


# ─── Factory ──────────────────────────────────────────────────────────────


async def test_create_fix_flow_returns_instance(hass: HomeAssistant) -> None:
    """Test that async_create_fix_flow returns the correct instance."""
    flow = await async_create_fix_flow(hass, "test_issue", None)
    assert isinstance(flow, MissingTriggerEntityRepairFlow)


# ─── Compound Trigger Repair Tests ────────────────────────────────────────


def _make_compound_entry(
    hass: HomeAssistant,
    conditions: list[dict[str, Any]],
    interval_days: int | None = 30,
    unique_id: str = "repair_compound",
) -> MockConfigEntry:
    """Create an entry with a compound trigger task."""
    tc: dict[str, Any] = {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": conditions,
    }
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=interval_days,
        trigger_config=tc,
    )
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Compound Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Compound Object"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


async def test_repair_replace_in_compound_single_entity_condition(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test replacing entity in a compound condition with single entity_id."""
    obj_entry = _make_compound_entry(
        hass,
        conditions=[
            {"type": "threshold", "entity_id": "sensor.old_temp", "trigger_above": 30.0},
            {"type": "counter", "entity_id": "sensor.cycles", "trigger_target_value": 100},
        ],
        unique_id="compound_replace_single",
    )
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_flow(hass, obj_entry.entry_id, entity_id="sensor.old_temp")
    result = await flow.async_step_replace_entity({"new_entity_id": "sensor.new_temp"})

    assert result["type"] == "create_entry"
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    tc = entry.data[CONF_TASKS][TASK_ID_1]["trigger_config"]
    assert tc["type"] == "compound"
    assert tc["conditions"][0]["entity_id"] == "sensor.new_temp"
    # Other condition untouched
    assert tc["conditions"][1]["entity_id"] == "sensor.cycles"


async def test_repair_replace_in_compound_multi_entity_condition(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test replacing entity in a compound condition with multi-entity entity_ids."""
    obj_entry = _make_compound_entry(
        hass,
        conditions=[
            {
                "type": "threshold",
                "entity_ids": ["sensor.a", "sensor.old", "sensor.b"],
                "entity_id": "sensor.a",
                "trigger_above": 30.0,
            },
            {"type": "counter", "entity_id": "sensor.cycles", "trigger_target_value": 100},
        ],
        unique_id="compound_replace_multi",
    )
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_flow(hass, obj_entry.entry_id, entity_id="sensor.old")
    result = await flow.async_step_replace_entity({"new_entity_id": "sensor.new"})

    assert result["type"] == "create_entry"
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    cond0 = entry.data[CONF_TASKS][TASK_ID_1]["trigger_config"]["conditions"][0]
    assert cond0["entity_ids"] == ["sensor.a", "sensor.new", "sensor.b"]


async def test_repair_replace_in_compound_nested_trigger_config(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test replacing entity nested inside condition.trigger_config."""
    obj_entry = _make_compound_entry(
        hass,
        conditions=[
            {
                "type": "threshold",
                "trigger_config": {"entity_id": "sensor.nested_old", "trigger_above": 10},
            },
            {"type": "counter", "entity_id": "sensor.cycles", "trigger_target_value": 100},
        ],
        unique_id="compound_replace_nested",
    )
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_flow(hass, obj_entry.entry_id, entity_id="sensor.nested_old")
    result = await flow.async_step_replace_entity({"new_entity_id": "sensor.nested_new"})

    assert result["type"] == "create_entry"
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    cond0 = entry.data[CONF_TASKS][TASK_ID_1]["trigger_config"]["conditions"][0]
    assert cond0["trigger_config"]["entity_id"] == "sensor.nested_new"


async def test_repair_remove_from_compound_keeps_two_conditions(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test removing entity from 3-condition compound leaves 2 conditions (still compound)."""
    obj_entry = _make_compound_entry(
        hass,
        conditions=[
            {"type": "threshold", "entity_id": "sensor.gone", "trigger_above": 30.0},
            {"type": "threshold", "entity_id": "sensor.b", "trigger_above": 40.0},
            {"type": "counter", "entity_id": "sensor.c", "trigger_target_value": 100},
        ],
        unique_id="compound_remove_keeps",
    )
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_flow(hass, obj_entry.entry_id, entity_id="sensor.gone")
    result = await flow.async_step_remove_trigger({})

    assert result["type"] == "create_entry"
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    tc = entry.data[CONF_TASKS][TASK_ID_1]["trigger_config"]
    assert tc["type"] == "compound"
    assert len(tc["conditions"]) == 2
    remaining_eids = {c.get("entity_id") for c in tc["conditions"]}
    assert remaining_eids == {"sensor.b", "sensor.c"}


async def test_repair_remove_from_compound_demotes_to_flat(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test removing entity from 2-condition compound demotes to flat single trigger."""
    obj_entry = _make_compound_entry(
        hass,
        conditions=[
            {"type": "threshold", "entity_id": "sensor.gone", "trigger_above": 30.0},
            {"type": "counter", "entity_id": "sensor.alive", "trigger_target_value": 100},
        ],
        unique_id="compound_remove_demote",
    )
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_flow(hass, obj_entry.entry_id, entity_id="sensor.gone")
    result = await flow.async_step_remove_trigger({})

    assert result["type"] == "create_entry"
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    tc = entry.data[CONF_TASKS][TASK_ID_1]["trigger_config"]
    # Demoted: no longer compound, became the surviving condition
    assert tc["type"] == "counter"
    assert tc["entity_id"] == "sensor.alive"
    assert tc["trigger_target_value"] == 100


async def test_repair_remove_from_compound_multi_entity_keeps_condition(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test removing entity from a multi-entity condition keeps the condition with remaining entities."""
    obj_entry = _make_compound_entry(
        hass,
        conditions=[
            {
                "type": "threshold",
                "entity_ids": ["sensor.a", "sensor.gone", "sensor.b"],
                "entity_id": "sensor.a",
                "trigger_above": 30.0,
            },
            {"type": "counter", "entity_id": "sensor.cycles", "trigger_target_value": 100},
        ],
        unique_id="compound_remove_multi",
    )
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_flow(hass, obj_entry.entry_id, entity_id="sensor.gone")
    result = await flow.async_step_remove_trigger({})

    assert result["type"] == "create_entry"
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    tc = entry.data[CONF_TASKS][TASK_ID_1]["trigger_config"]
    # Compound stays intact (still 2 conditions)
    assert tc["type"] == "compound"
    assert len(tc["conditions"]) == 2
    cond0 = tc["conditions"][0]
    assert cond0["entity_ids"] == ["sensor.a", "sensor.b"]
    assert "sensor.gone" not in cond0["entity_ids"]
