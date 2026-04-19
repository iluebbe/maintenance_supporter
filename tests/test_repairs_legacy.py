"""Tests for repair flow legacy (no Store) fallback paths in repairs.py.

Covers the following uncovered lines:
- Lines 136-137: Entry not found guard in _replace_trigger_entity
- Lines 188-197: Legacy (no Store) history write in _replace_trigger_entity
- Lines 227-228: Entry not found guard in _remove_trigger
- Line 255:     Safety interval fallback in _remove_trigger
- Lines 288-297: Legacy (no Store) history write in _remove_trigger
"""

from __future__ import annotations

from typing import Any

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
    assert task_data["schedule_type"] == ScheduleType.TIME_BASED
    assert task_data["interval_days"] == 14
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
    assert task_data["schedule_type"] == ScheduleType.TIME_BASED
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
    assert task_data["schedule_type"] == ScheduleType.MANUAL
    # History written via legacy path
    history = task_data.get("history", [])
    assert any(h["type"] == HistoryEntryType.TRIGGER_REMOVED for h in history)
