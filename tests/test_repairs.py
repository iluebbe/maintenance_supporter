"""Tests for repairs.py — repair flows and their pure-function helpers.

Covers legacy (no Store) fallback paths in _replace_trigger_entity /
_remove_trigger, plus the repair-flow routing, entity replace/strip helpers,
and the OrphanAdminPanelUser / StaleActionEntity / MissingTriggerEntity flows.
"""

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
    HistoryEntryType,
    ScheduleType,
)
from custom_components.maintenance_supporter.helpers.schedule import (
    read_legacy_fields,
)
from custom_components.maintenance_supporter.repairs import (
    MissingTriggerEntityRepairFlow,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)

# ─── Fixtures ────────────────────────────────────────────────────────────


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


# ─── Helpers ─────────────────────────────────────────────────────────────


def _make_sensor_entry(
    hass: HomeAssistant,
    entity_id: str = "sensor.old_temp",
    entity_ids: list[str] | None = None,
    interval_days: int | None = 30,
    unique_id: str = "repair_legacy",
    trigger_config_extras: dict[str, Any] | None = None,
) -> MockConfigEntry:
    """Create an entry with a sensor-based trigger task."""
    tc: dict[str, Any] = {
        "type": "threshold",
        "entity_id": entity_id,
        "trigger_above": 30.0,
    }
    if entity_ids:
        tc["entity_ids"] = entity_ids
    if trigger_config_extras:
        tc.update(trigger_config_extras)

    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=interval_days,
        trigger_config=tc,
    )
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Legacy Repair Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Legacy Repair Object"),
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
        "object_name": "Legacy Repair Object",
        "entity_id": entity_id,
    }
    return flow


def _set_store_none(hass: HomeAssistant, entry_id: str) -> None:
    """Disable the Store on runtime_data to force legacy fallback paths.

    Also writes the full task data back into ConfigEntry.data so that the
    legacy code has something to read (migration normally strips dynamic
    fields out of ConfigEntry.data into the Store).
    """
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None
    rd = entry.runtime_data
    rd.store = None

    # Ensure task data in ConfigEntry includes all fields the legacy path needs
    tasks_data = dict(entry.data.get(CONF_TASKS, {}))
    task_dict = dict(tasks_data.get(TASK_ID_1, {}))
    # Make sure history field exists (migration may have removed it)
    if "history" not in task_dict:
        task_dict["history"] = []
    tasks_data[TASK_ID_1] = task_dict
    new_data = dict(entry.data)
    new_data[CONF_TASKS] = tasks_data
    hass.config_entries.async_update_entry(entry, data=new_data)


# ─── Lines 136-137: Entry not found guard in _replace_trigger_entity ─────


async def test_replace_trigger_entry_not_found(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """_replace_trigger_entity returns early if config entry doesn't exist."""
    await setup_integration(hass, global_entry)

    flow = _make_flow(hass, entry_id="nonexistent_entry_id_123456")
    # Should not raise — just logs an error and returns
    await flow._replace_trigger_entity("sensor.new_temp")


# ─── Lines 188-197: Legacy history write in _replace_trigger_entity ──────


async def test_replace_trigger_legacy_no_store(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """When Store is None, _replace_trigger_entity writes history via ConfigEntry."""
    obj_entry = _make_sensor_entry(hass, unique_id="replace_legacy_store")
    await setup_integration(hass, global_entry, obj_entry)

    _set_store_none(hass, obj_entry.entry_id)

    flow = _make_flow(hass, obj_entry.entry_id)
    result = await flow.async_step_replace_entity(
        {"new_entity_id": "sensor.new_temp"}
    )

    assert result["type"] == "create_entry"

    # After reload, verify the config entry was updated
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    task_data = entry.data[CONF_TASKS][TASK_ID_1]
    # The trigger entity should have been replaced
    tc = task_data.get("trigger_config", {})
    assert tc.get("entity_id") == "sensor.new_temp"
    # History should contain a trigger_replaced entry with the replace note
    history = task_data.get("history", [])
    assert len(history) >= 1
    last_entry = history[-1]
    assert last_entry["type"] == HistoryEntryType.TRIGGER_REPLACED
    assert "sensor.old_temp" in last_entry.get("notes", "")
    assert "sensor.new_temp" in last_entry.get("notes", "")


async def test_replace_trigger_legacy_multi_entity(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Legacy replace with multi-entity trigger updates entity_ids correctly."""
    obj_entry = _make_sensor_entry(
        hass,
        entity_id="sensor.old_temp",
        entity_ids=["sensor.old_temp", "sensor.other"],
        unique_id="replace_legacy_multi",
    )
    await setup_integration(hass, global_entry, obj_entry)

    _set_store_none(hass, obj_entry.entry_id)

    flow = _make_flow(hass, obj_entry.entry_id, entity_id="sensor.old_temp")
    result = await flow.async_step_replace_entity(
        {"new_entity_id": "sensor.new_temp"}
    )

    assert result["type"] == "create_entry"

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    task_data = entry.data[CONF_TASKS][TASK_ID_1]
    tc = task_data.get("trigger_config", {})
    assert "sensor.new_temp" in tc.get("entity_ids", [])
    assert "sensor.old_temp" not in tc.get("entity_ids", [])
    # History should be written via legacy path
    history = task_data.get("history", [])
    assert any(h["type"] == HistoryEntryType.TRIGGER_REPLACED for h in history)


# ─── Lines 227-228: Entry not found guard in _remove_trigger ─────────────


async def test_remove_trigger_entry_not_found(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """_remove_trigger returns early if config entry doesn't exist."""
    await setup_integration(hass, global_entry)

    flow = _make_flow(hass, entry_id="nonexistent_entry_id_456789")
    # Should not raise — just logs an error and returns
    await flow._remove_trigger()


# ─── Line 255: Safety interval fallback in _remove_trigger ───────────────


async def test_remove_trigger_safety_interval_fallback(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """When removing last trigger entity and safety_interval exists but
    task has no interval_days, the safety_interval is used as interval_days.
    """
    # Create entry with trigger_config containing interval_days (safety interval)
    # but the task itself has NO interval_days
    obj_entry = _make_sensor_entry(
        hass,
        interval_days=None,  # Task has no interval_days
        unique_id="safety_interval_fallback",
        trigger_config_extras={"interval_days": 14},  # Safety interval in trigger
    )
    await setup_integration(hass, global_entry, obj_entry)

    # Also remove interval_days from the task data if it was set
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
    # Should convert to time_based using the safety interval
    assert read_legacy_fields(task_data)["schedule_type"] == ScheduleType.TIME_BASED
    assert read_legacy_fields(task_data)["interval_days"] == 14
    assert "trigger_config" not in task_data


# ─── Lines 288-297: Legacy history write in _remove_trigger ──────────────


async def test_remove_trigger_legacy_no_store(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """When Store is None, _remove_trigger writes history via ConfigEntry."""
    obj_entry = _make_sensor_entry(
        hass,
        interval_days=30,
        unique_id="remove_legacy_store",
    )
    await setup_integration(hass, global_entry, obj_entry)

    _set_store_none(hass, obj_entry.entry_id)

    flow = _make_flow(hass, obj_entry.entry_id)
    result = await flow.async_step_remove_trigger({})

    assert result["type"] == "create_entry"

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    task_data = entry.data[CONF_TASKS][TASK_ID_1]
    # Trigger should have been removed
    assert "trigger_config" not in task_data
    # Should convert to time_based since interval_days exists
    assert read_legacy_fields(task_data)["schedule_type"] == ScheduleType.TIME_BASED
    # History should contain a trigger_removed entry via legacy path
    history = task_data.get("history", [])
    assert len(history) >= 1
    last_entry = history[-1]
    assert last_entry["type"] == HistoryEntryType.TRIGGER_REMOVED
    assert "sensor.old_temp" in last_entry.get("notes", "")


async def test_remove_trigger_legacy_no_store_multi_entity(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Legacy remove with multi-entity trigger removes only the missing entity."""
    obj_entry = _make_sensor_entry(
        hass,
        entity_id="sensor.old_temp",
        entity_ids=["sensor.old_temp", "sensor.other"],
        unique_id="remove_legacy_multi",
    )
    await setup_integration(hass, global_entry, obj_entry)

    _set_store_none(hass, obj_entry.entry_id)

    flow = _make_flow(hass, obj_entry.entry_id, entity_id="sensor.old_temp")
    result = await flow.async_step_remove_trigger({})

    assert result["type"] == "create_entry"

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    task_data = entry.data[CONF_TASKS][TASK_ID_1]
    tc = task_data.get("trigger_config", {})
    assert tc["entity_ids"] == ["sensor.other"]
    # History written via legacy path
    history = task_data.get("history", [])
    assert any(h["type"] == HistoryEntryType.TRIGGER_REMOVED for h in history)


async def test_remove_trigger_legacy_to_manual(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Legacy remove without interval_days converts to manual schedule."""
    obj_entry = _make_sensor_entry(
        hass,
        interval_days=None,
        unique_id="remove_legacy_manual",
    )
    await setup_integration(hass, global_entry, obj_entry)

    # Remove interval_days from the task
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    new_data = dict(entry.data)
    tasks = dict(new_data[CONF_TASKS])
    task = dict(tasks[TASK_ID_1])
    task.pop("interval_days", None)
    tasks[TASK_ID_1] = task
    new_data[CONF_TASKS] = tasks
    hass.config_entries.async_update_entry(entry, data=new_data)

    _set_store_none(hass, obj_entry.entry_id)

    flow = _make_flow(hass, obj_entry.entry_id)
    result = await flow.async_step_remove_trigger({})

    assert result["type"] == "create_entry"

    updated = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert updated is not None
    task_data = updated.data[CONF_TASKS][TASK_ID_1]
    assert read_legacy_fields(task_data)["schedule_type"] == ScheduleType.MANUAL
    # History written via legacy path
    history = task_data.get("history", [])
    assert any(h["type"] == HistoryEntryType.TRIGGER_REMOVED for h in history)


# === migrated from test_cov_helpers.py (behaviour-based split) ===

def test_entry_for_issue_missing_entry_id() -> None:
    """Line 54: _entry_for_issue returns None when entry_id is absent."""
    from custom_components.maintenance_supporter.repairs import _entry_for_issue

    hass = MagicMock()
    hass.config_entries.async_get_entry.return_value = None

    # No entry_id in issue_data
    assert _entry_for_issue(hass, {}) is None
    assert _entry_for_issue(hass, None) is None

def test_entry_has_task_false_cases() -> None:
    """Lines 113, 115: _entry_has_task returns False for None entry or missing task."""
    from custom_components.maintenance_supporter.repairs import _entry_has_task

    # entry is None
    assert _entry_has_task(None, "task_id") is False

    # task_id is None/empty
    entry = MagicMock()
    entry.data = {"tasks": {"t1": {}}}
    assert _entry_has_task(entry, None) is False
    assert _entry_has_task(entry, "") is False

def test_replace_entity_in_dict_entity_ids_list() -> None:
    """Lines 134-135 area: _replace_entity_in_dict replaces in entity_ids list."""
    from custom_components.maintenance_supporter.repairs import _replace_entity_in_dict

    cfg = {"entity_ids": ["sensor.old", "sensor.other"], "entity_id": "sensor.old"}
    result = _replace_entity_in_dict(cfg, "sensor.old", "sensor.new")
    assert "sensor.new" in result["entity_ids"]
    assert result["entity_id"] == "sensor.new"

    # entity_id field matches too
    cfg2 = {"entity_id": "sensor.old"}
    result2 = _replace_entity_in_dict(cfg2, "sensor.old", "sensor.new")
    assert result2["entity_id"] == "sensor.new"

def test_replace_entity_in_condition_with_nested() -> None:
    """Lines 92-96: _replace_entity_in_condition replaces in nested trigger_config."""
    from custom_components.maintenance_supporter.repairs import _replace_entity_in_condition

    cond = {
        "entity_id": "sensor.old",
        "trigger_config": {"entity_id": "sensor.old"},
    }
    result = _replace_entity_in_condition(cond, "sensor.old", "sensor.new")
    assert result["entity_id"] == "sensor.new"
    assert result["trigger_config"]["entity_id"] == "sensor.new"

def test_strip_entity_from_dict_multi_entity() -> None:
    """Lines 113-114: stripping from multi-entity list leaves remaining."""
    from custom_components.maintenance_supporter.repairs import _strip_entity_from_dict

    cfg = {"entity_ids": ["sensor.a", "sensor.b"], "entity_id": "sensor.a"}
    result, has_remaining = _strip_entity_from_dict(cfg, "sensor.a")
    assert has_remaining is True
    assert "sensor.a" not in result.get("entity_ids", [])
    assert result.get("entity_id") == "sensor.b"

def test_strip_entity_from_dict_sole_entity() -> None:
    """Lines 116-118: stripping sole entity leaves has_remaining=False."""
    from custom_components.maintenance_supporter.repairs import _strip_entity_from_dict

    cfg = {"entity_id": "sensor.a"}
    result, has_remaining = _strip_entity_from_dict(cfg, "sensor.a")
    assert has_remaining is False
    assert "entity_id" not in result

def test_strip_entity_from_condition_compound() -> None:
    """Lines 130-136: _strip_entity_from_condition strips from nested."""
    from custom_components.maintenance_supporter.repairs import _strip_entity_from_condition

    cond = {
        "entity_id": "sensor.x",
        "trigger_config": {"entity_id": "sensor.x"},
    }
    result, keep = _strip_entity_from_condition(cond, "sensor.x")
    assert keep is False

def test_async_create_fix_flow_routing() -> None:
    """Line 661: async_create_fix_flow returns correct flow type."""
    import asyncio

    from custom_components.maintenance_supporter.repairs import (
        MissingTriggerEntityRepairFlow,
        OrphanAdminPanelUserRepairFlow,
        StaleActionEntityRepairFlow,
        async_create_fix_flow,
    )

    hass = MagicMock()

    flow1 = asyncio.get_event_loop().run_until_complete(
        async_create_fix_flow(hass, "orphan_admin_panel_user_abc", {})
    )
    assert isinstance(flow1, OrphanAdminPanelUserRepairFlow)

    flow2 = asyncio.get_event_loop().run_until_complete(
        async_create_fix_flow(hass, "stale_action_entity_abc", {})
    )
    assert isinstance(flow2, StaleActionEntityRepairFlow)

    flow3 = asyncio.get_event_loop().run_until_complete(
        async_create_fix_flow(hass, "missing_trigger_entity_abc", {})
    )
    assert isinstance(flow3, MissingTriggerEntityRepairFlow)

async def test_orphan_admin_repair_flow_init_form(hass: HomeAssistant) -> None:
    """Lines 525-528: OrphanAdminPanelUserRepairFlow.async_step_init shows form first."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.repairs import OrphanAdminPanelUserRepairFlow

    flow = OrphanAdminPanelUserRepairFlow()
    flow.hass = hass
    flow.data = {"user_id": "abcd1234", "entry_id": ""}

    result = await flow.async_step_init(user_input=None)
    assert result["type"] == data_entry_flow.FlowResultType.FORM
    assert result["step_id"] == "init"

async def test_orphan_admin_repair_flow_entry_gone(hass: HomeAssistant) -> None:
    """Lines 540-543: OrphanAdminPanelUserRepairFlow aborts when entry is gone."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.repairs import OrphanAdminPanelUserRepairFlow

    flow = OrphanAdminPanelUserRepairFlow()
    flow.hass = hass
    flow.data = {"user_id": "u1", "entry_id": "nonexistent_entry_id"}

    result = await flow.async_step_remove_user_id()
    assert result["type"] == data_entry_flow.FlowResultType.ABORT
    assert result["reason"] == "entry_gone"

async def test_orphan_admin_repair_removes_user(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    """Lines 544-552: OrphanAdminPanelUserRepairFlow removes orphan user id."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.const import CONF_ADMIN_PANEL_USER_IDS
    from custom_components.maintenance_supporter.repairs import OrphanAdminPanelUserRepairFlow

    # Add the user id to the global entry options
    hass.config_entries.async_update_entry(
        global_config_entry,
        options={CONF_ADMIN_PANEL_USER_IDS: ["orphan_uid", "keep_uid"]},
    )

    flow = OrphanAdminPanelUserRepairFlow()
    flow.hass = hass
    flow.data = {
        "user_id": "orphan_uid",
        "entry_id": global_config_entry.entry_id,
    }

    result = await flow.async_step_remove_user_id()
    assert result["type"] == data_entry_flow.FlowResultType.CREATE_ENTRY

    # Verify user was removed
    updated = hass.config_entries.async_get_entry(global_config_entry.entry_id)
    ids = updated.options.get(CONF_ADMIN_PANEL_USER_IDS, [])
    assert "orphan_uid" not in ids
    assert "keep_uid" in ids

async def test_stale_action_repair_flow_init_menu(hass: HomeAssistant) -> None:
    """Lines 590: StaleActionEntityRepairFlow.async_step_init shows menu."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.repairs import StaleActionEntityRepairFlow

    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": "eid",
        "task_id": "tid",
        "task_name": "Test Task",
        "stale_entity": "sensor.dead",
    }

    result = await flow.async_step_init()
    assert result["type"] == data_entry_flow.FlowResultType.MENU
    assert "replace_entity" in result["menu_options"]
    assert "remove_action" in result["menu_options"]

async def test_stale_action_repair_replace_entity_entry_gone(hass: HomeAssistant) -> None:
    """Line 590: StaleActionEntityRepairFlow replace_entity aborts when entry gone."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.repairs import StaleActionEntityRepairFlow

    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": "nonexistent",
        "task_id": "t1",
        "task_name": "Task",
        "stale_entity": "sensor.dead",
    }

    result = await flow.async_step_replace_entity(user_input={"new_entity": "sensor.new"})
    assert result["type"] == data_entry_flow.FlowResultType.ABORT
    assert result["reason"] == "entry_gone"

async def test_stale_action_repair_replace_no_entity_aborts(hass: HomeAssistant) -> None:
    """Line 593: StaleActionEntityRepairFlow replace with empty entity aborts."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.repairs import StaleActionEntityRepairFlow

    # Create a real entry so _entry() returns it
    entry = MockConfigEntry(
        domain="maintenance_supporter",
        data={"tasks": {}},
        unique_id="test_stale_entry",
    )
    entry.add_to_hass(hass)

    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": entry.entry_id,
        "task_id": "t1",
        "task_name": "Task",
        "stale_entity": "sensor.dead",
    }

    result = await flow.async_step_replace_entity(user_input={"new_entity": ""})
    assert result["type"] == data_entry_flow.FlowResultType.ABORT
    assert result["reason"] == "no_entity"

async def test_stale_action_repair_replace_entity_success(hass: HomeAssistant) -> None:
    """Line 596: StaleActionEntityRepairFlow patches action entity and returns CREATE_ENTRY."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.const import CONF_TASKS
    from custom_components.maintenance_supporter.repairs import StaleActionEntityRepairFlow

    task_id = "t1"
    entry = MockConfigEntry(
        domain="maintenance_supporter",
        data={
            CONF_TASKS: {
                task_id: {
                    "on_complete_action": {
                        "service": "light.turn_on",
                        "target": {"entity_id": "sensor.dead"},
                    }
                }
            }
        },
        unique_id="test_stale_replace",
    )
    entry.add_to_hass(hass)

    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": entry.entry_id,
        "task_id": task_id,
        "task_name": "Task",
        "stale_entity": "sensor.dead",
    }

    result = await flow.async_step_replace_entity(user_input={"new_entity": "sensor.new"})
    assert result["type"] == data_entry_flow.FlowResultType.CREATE_ENTRY

    updated = hass.config_entries.async_get_entry(entry.entry_id)
    action = updated.data[CONF_TASKS][task_id]["on_complete_action"]
    assert action["target"]["entity_id"] == "sensor.new"

async def test_stale_action_repair_remove_action_entry_gone(hass: HomeAssistant) -> None:
    """Line 613: StaleActionEntityRepairFlow remove_action aborts when entry gone."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.repairs import StaleActionEntityRepairFlow

    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": "nonexistent",
        "task_id": "t1",
        "task_name": "Task",
        "stale_entity": "sensor.dead",
    }

    result = await flow.async_step_remove_action(user_input={})
    assert result["type"] == data_entry_flow.FlowResultType.ABORT
    assert result["reason"] == "entry_gone"

async def test_stale_action_repair_remove_action_success(hass: HomeAssistant) -> None:
    """Line 616: StaleActionEntityRepairFlow clears action and returns CREATE_ENTRY."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.const import CONF_TASKS
    from custom_components.maintenance_supporter.repairs import StaleActionEntityRepairFlow

    task_id = "t2"
    entry = MockConfigEntry(
        domain="maintenance_supporter",
        data={
            CONF_TASKS: {
                task_id: {
                    "on_complete_action": {"service": "light.turn_on"}
                }
            }
        },
        unique_id="test_stale_remove",
    )
    entry.add_to_hass(hass)

    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": entry.entry_id,
        "task_id": task_id,
        "task_name": "Task",
        "stale_entity": "sensor.dead",
    }

    result = await flow.async_step_remove_action(user_input={})
    assert result["type"] == data_entry_flow.FlowResultType.CREATE_ENTRY

    updated = hass.config_entries.async_get_entry(entry.entry_id)
    assert "on_complete_action" not in updated.data[CONF_TASKS][task_id]

async def test_stale_action_replace_shows_form_when_no_input(hass: HomeAssistant) -> None:
    """Lines 596-605: async_step_replace_entity shows form when user_input is None."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.repairs import StaleActionEntityRepairFlow

    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": "eid",
        "task_id": "t1",
        "task_name": "Task",
        "stale_entity": "sensor.dead",
    }

    result = await flow.async_step_replace_entity(user_input=None)
    assert result["type"] == data_entry_flow.FlowResultType.FORM
    assert result["step_id"] == "replace_entity"

async def test_stale_action_remove_shows_form_when_no_input(hass: HomeAssistant) -> None:
    """Lines 616-622: async_step_remove_action shows form when user_input is None."""
    from homeassistant import data_entry_flow
    from custom_components.maintenance_supporter.repairs import StaleActionEntityRepairFlow

    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": "eid",
        "task_id": "t1",
        "task_name": "Task",
        "stale_entity": "sensor.dead",
    }

    result = await flow.async_step_remove_action(user_input=None)
    assert result["type"] == data_entry_flow.FlowResultType.FORM
    assert result["step_id"] == "remove_action"

def test_remove_from_flat_multi_entity_strips_one() -> None:
    """Lines 489-491: flat multi-entity: strip one entity, keep remaining."""
    from custom_components.maintenance_supporter.repairs import MissingTriggerEntityRepairFlow

    flow = MissingTriggerEntityRepairFlow()

    task_dict: dict[str, Any] = {
        "trigger_config": {"entity_ids": ["sensor.a", "sensor.b"], "entity_id": "sensor.a"},
        "schedule_type": "sensor_based",
        "interval_days": 30,
        "interval_unit": "days",
        "interval_anchor": "completion",
    }
    trigger_config = dict(task_dict["trigger_config"])

    notes = flow._remove_from_flat(task_dict, trigger_config, "sensor.a")
    assert "sensor.a" in notes or "sensor.b" in notes
    # sensor.b should remain
    assert task_dict["trigger_config"]["entity_id"] == "sensor.b"

def test_remove_from_flat_sole_entity_converts_to_time_based() -> None:
    """Line 502: flat sole entity removed → schedule becomes time_based."""
    from custom_components.maintenance_supporter.repairs import MissingTriggerEntityRepairFlow

    flow = MissingTriggerEntityRepairFlow()

    task_dict: dict[str, Any] = {
        "trigger_config": {"entity_id": "sensor.a", "interval_days": None},
        "schedule_type": "sensor_based",
        "interval_days": 30,
        "interval_unit": "days",
        "interval_anchor": "completion",
    }
    trigger_config = dict(task_dict["trigger_config"])

    flow._remove_from_flat(task_dict, trigger_config, "sensor.a")
    assert "trigger_config" not in task_dict
    assert task_dict.get("schedule_type") in ("time_based", "manual")

def test_remove_from_compound_two_remaining_stays_compound() -> None:
    """Lines 476-482: compound with >=2 conditions remaining stays compound."""
    from custom_components.maintenance_supporter.repairs import MissingTriggerEntityRepairFlow

    flow = MissingTriggerEntityRepairFlow()

    trigger_config: dict[str, Any] = {
        "type": "compound",
        "conditions": [
            {"entity_id": "sensor.dead", "type": "threshold"},
            {"entity_id": "sensor.b", "type": "threshold"},
            {"entity_id": "sensor.c", "type": "threshold"},
        ],
    }
    task_dict: dict[str, Any] = {"trigger_config": trigger_config}

    notes = flow._remove_from_compound(task_dict, trigger_config, "sensor.dead")
    assert "2 conditions remain" in notes
    assert task_dict["trigger_config"]["type"] == "compound"

def test_remove_from_compound_one_remaining_demotes() -> None:
    """Lines 484-498: compound with 1 condition demoted to flat trigger."""
    from custom_components.maintenance_supporter.repairs import MissingTriggerEntityRepairFlow

    flow = MissingTriggerEntityRepairFlow()

    trigger_config: dict[str, Any] = {
        "type": "compound",
        "conditions": [
            {"entity_id": "sensor.dead", "type": "threshold"},
            {"entity_id": "sensor.keep", "type": "counter", "trigger_config": {"type": "counter"}},
        ],
    }
    task_dict: dict[str, Any] = {
        "trigger_config": trigger_config,
        "schedule_type": "sensor_based",
    }

    notes = flow._remove_from_compound(task_dict, trigger_config, "sensor.dead")
    assert "demoted" in notes
    # trigger_config should now be a flat one (type != "compound")
    assert task_dict["trigger_config"].get("type") != "compound"

def test_remove_from_compound_zero_remaining_delegates_flat() -> None:
    """Line 502: compound with 0 remaining delegates to _remove_from_flat."""
    from custom_components.maintenance_supporter.repairs import MissingTriggerEntityRepairFlow

    flow = MissingTriggerEntityRepairFlow()

    trigger_config: dict[str, Any] = {
        "type": "compound",
        "conditions": [
            {"entity_id": "sensor.dead", "type": "threshold"},
        ],
    }
    task_dict: dict[str, Any] = {
        "trigger_config": trigger_config,
        "schedule_type": "sensor_based",
        "interval_days": 30,
        "interval_unit": "days",
        "interval_anchor": "completion",
    }

    notes = flow._remove_from_compound(task_dict, trigger_config, "sensor.dead")
    # Should have delegated to _remove_from_flat → contains "Sensor trigger removed"
    assert "trigger" in notes.lower()
