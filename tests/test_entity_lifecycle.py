"""Tests for entity lifecycle and registry behavior."""

from __future__ import annotations

from datetime import timedelta

import pytest

from homeassistant.config_entries import ConfigEntry, ConfigEntryState
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)

from .conftest import (
    OBJECT_ID_1,
    TASK_ID_1,
    TASK_ID_2,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


# ─── 5.1 Unique ID Stability ────────────────────────────────────────────


async def test_sensor_unique_id_format(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that sensor unique_id follows expected format."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(
        entity_reg, object_config_entry.entry_id
    )

    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) == 1

    # unique_id should be: maintenance_supporter_{object_slug}_{task_id}
    unique_id = sensor_entities[0].unique_id
    assert unique_id.startswith("maintenance_supporter_")
    assert unique_id.endswith(TASK_ID_1)


async def test_unique_id_stable_across_reloads(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that unique_id is stable after reload."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    entity_reg = er.async_get(hass)
    entities_before = er.async_entries_for_config_entry(
        entity_reg, object_config_entry.entry_id
    )
    uids_before = {e.unique_id for e in entities_before}

    # Reload
    await hass.config_entries.async_unload(object_config_entry.entry_id)
    await hass.config_entries.async_setup(object_config_entry.entry_id)
    await hass.async_block_till_done()

    entities_after = er.async_entries_for_config_entry(
        entity_reg, object_config_entry.entry_id
    )
    uids_after = {e.unique_id for e in entities_after}

    assert uids_before == uids_after


# ─── 5.2 Entry Setup / Unload ───────────────────────────────────────────


async def test_entry_setup_and_state(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that entries are properly set up."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    assert global_config_entry.state == ConfigEntryState.LOADED
    assert object_config_entry.state == ConfigEntryState.LOADED


async def test_entry_unload(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that entries can be unloaded cleanly."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    result = await hass.config_entries.async_unload(object_config_entry.entry_id)
    assert result is True
    assert object_config_entry.state == ConfigEntryState.NOT_LOADED


async def test_global_entry_setup(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test that global entry setup doesn't create a coordinator."""
    await setup_integration(hass, global_config_entry)

    assert global_config_entry.state == ConfigEntryState.LOADED
    assert global_config_entry.runtime_data.coordinator is None


async def test_object_entry_has_coordinator(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that object entry creates a coordinator."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    assert object_config_entry.runtime_data.coordinator is not None


# ─── 5.3 Multiple Tasks Create Multiple Sensors ─────────────────────────


async def test_multiple_tasks_create_sensors(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test that each task creates one sensor entity."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task1 = build_task_data(task_id=TASK_ID_1, name="Task A", last_performed=last)
    task2 = build_task_data(task_id=TASK_ID_2, name="Task B", last_performed=last)

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Multi Task Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Multi Task Object"),
            tasks={TASK_ID_1: task1, TASK_ID_2: task2},
        ),
        source="user",
        unique_id="maintenance_supporter_multi_task_object",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) == 2


# ─── 5.4 Device Registry ────────────────────────────────────────────────


async def test_device_created_for_object(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that a device is created for the maintenance object."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    from homeassistant.helpers import device_registry as dr

    device_reg = dr.async_get(hass)
    devices = dr.async_entries_for_config_entry(
        device_reg, object_config_entry.entry_id
    )
    assert len(devices) == 1
    assert devices[0].name == "Pool Pump"
