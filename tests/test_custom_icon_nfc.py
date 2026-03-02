"""Tests for custom icon and NFC tag linking features."""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)
from custom_components.maintenance_supporter.websocket.tasks import (
    ws_create_task,
    ws_update_task,
)

from .conftest import (
    OBJECT_ID_1,
    TASK_ID_1,
    TASK_ID_2,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    get_task_store_state,
    setup_integration,
)


# ─── Fixtures ─────────────────────────────────────────────────────────────


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
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    last_performed = (dt_util.now().date() - timedelta(days=20)).isoformat()
    task = build_task_data(last_performed=last_performed)
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_pump_icon_nfc",
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_entry_with_icon(hass: HomeAssistant) -> MockConfigEntry:
    last_performed = (dt_util.now().date() - timedelta(days=20)).isoformat()
    task = build_task_data(last_performed=last_performed)
    task["custom_icon"] = "mdi:oil"
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Car",
        data=build_object_entry_data(
            object_data=build_object_data(name="Car"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_car_icon",
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_entry_with_nfc(hass: HomeAssistant) -> MockConfigEntry:
    last_performed = (dt_util.now().date() - timedelta(days=5)).isoformat()
    task = build_task_data(last_performed=last_performed)
    task["nfc_tag_id"] = "my-nfc-tag-123"
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Heater",
        data=build_object_entry_data(
            object_data=build_object_data(name="Heater"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_heater_nfc",
    )
    entry.add_to_hass(hass)
    return entry


def _find_sensor_entity_id(hass: HomeAssistant, entry: MockConfigEntry) -> str | None:
    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensors = [e for e in entities if e.domain == "sensor"]
    return sensors[0].entity_id if sensors else None


# ─── MaintenanceTask model tests ──────────────────────────────────────────


def test_maintenance_task_custom_icon_serialization() -> None:
    """Test that custom_icon is serialized and deserialized correctly."""
    task = MaintenanceTask(name="Oil Change", custom_icon="mdi:oil")
    data = task.to_dict()
    assert data["custom_icon"] == "mdi:oil"

    restored = MaintenanceTask.from_dict(data)
    assert restored.custom_icon == "mdi:oil"


def test_maintenance_task_custom_icon_none_not_serialized() -> None:
    """Test that custom_icon=None is not included in serialization."""
    task = MaintenanceTask(name="Oil Change")
    data = task.to_dict()
    assert "custom_icon" not in data


def test_maintenance_task_nfc_tag_serialization() -> None:
    """Test that nfc_tag_id is serialized and deserialized correctly."""
    task = MaintenanceTask(name="Filter Cleaning", nfc_tag_id="nfc-abc-123")
    data = task.to_dict()
    assert data["nfc_tag_id"] == "nfc-abc-123"

    restored = MaintenanceTask.from_dict(data)
    assert restored.nfc_tag_id == "nfc-abc-123"


def test_maintenance_task_nfc_tag_none_not_serialized() -> None:
    """Test that nfc_tag_id=None is not included in serialization."""
    task = MaintenanceTask(name="Filter Cleaning")
    data = task.to_dict()
    assert "nfc_tag_id" not in data


def test_maintenance_task_both_fields() -> None:
    """Test both custom_icon and nfc_tag_id together."""
    task = MaintenanceTask(
        name="Oil Change", custom_icon="mdi:oil", nfc_tag_id="tag-001"
    )
    data = task.to_dict()
    assert data["custom_icon"] == "mdi:oil"
    assert data["nfc_tag_id"] == "tag-001"

    restored = MaintenanceTask.from_dict(data)
    assert restored.custom_icon == "mdi:oil"
    assert restored.nfc_tag_id == "tag-001"


# ─── Sensor icon property ────────────────────────────────────────────────


async def test_sensor_custom_icon(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry_with_icon: MockConfigEntry,
) -> None:
    """Test that sensor returns custom icon when configured."""
    await setup_integration(hass, global_entry, object_entry_with_icon)
    entity_id = _find_sensor_entity_id(hass, object_entry_with_icon)
    assert entity_id is not None

    state = hass.states.get(entity_id)
    assert state is not None
    assert state.attributes.get("icon") == "mdi:oil"


async def test_sensor_no_custom_icon(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test that sensor without custom icon uses default (no icon attr override)."""
    await setup_integration(hass, global_entry, object_entry)
    entity_id = _find_sensor_entity_id(hass, object_entry)
    assert entity_id is not None

    state = hass.states.get(entity_id)
    assert state is not None
    # Without custom_icon, the icon property returns None and HA uses icons.json
    # The icon attribute in state will be set by HA's default mechanism


# ─── NFC tag_scanned event handling ──────────────────────────────────────


async def test_nfc_tag_completes_task(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry_with_nfc: MockConfigEntry,
) -> None:
    """Test that scanning a matching NFC tag completes the linked task."""
    await setup_integration(hass, global_entry, object_entry_with_nfc)

    # Verify the coordinator is set up
    rd = getattr(object_entry_with_nfc, "runtime_data", None)
    assert rd is not None
    assert rd.coordinator is not None

    # Get last_performed before
    store_state = get_task_store_state(
        hass, object_entry_with_nfc.entry_id, TASK_ID_1
    )
    old_last_performed = store_state.get("last_performed")

    # Fire the NFC tag scan event
    hass.bus.async_fire("tag_scanned", {"tag_id": "my-nfc-tag-123"})
    await hass.async_block_till_done()

    # Verify task was completed (last_performed should be updated to today)
    store_state = get_task_store_state(
        hass, object_entry_with_nfc.entry_id, TASK_ID_1
    )
    new_last_performed = store_state.get("last_performed")
    assert new_last_performed == dt_util.now().date().isoformat()


async def test_nfc_tag_no_match_ignored(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry_with_nfc: MockConfigEntry,
) -> None:
    """Test that non-matching NFC tag scan is silently ignored."""
    await setup_integration(hass, global_entry, object_entry_with_nfc)

    store_state = get_task_store_state(
        hass, object_entry_with_nfc.entry_id, TASK_ID_1
    )
    old_last_performed = store_state.get("last_performed")

    # Fire with a non-matching tag
    hass.bus.async_fire("tag_scanned", {"tag_id": "unknown-tag-456"})
    await hass.async_block_till_done()

    # Task should NOT have been completed
    store_state = get_task_store_state(
        hass, object_entry_with_nfc.entry_id, TASK_ID_1
    )
    assert store_state.get("last_performed") == old_last_performed


async def test_nfc_tag_empty_tag_id_ignored(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Test that empty tag_id is ignored."""
    await setup_integration(hass, global_entry)

    # Fire with empty tag_id - should not crash
    hass.bus.async_fire("tag_scanned", {"tag_id": ""})
    await hass.async_block_till_done()

    # Fire with missing tag_id - should not crash
    hass.bus.async_fire("tag_scanned", {})
    await hass.async_block_till_done()


# ─── WebSocket: custom_icon + nfc_tag_id in create/update ────────────────


def _mock_connection() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    return conn


async def test_ws_create_task_with_icon_and_nfc(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test creating a task via WS with custom_icon and nfc_tag_id."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    msg: dict[str, Any] = {
        "id": 1,
        "type": "maintenance_supporter/task/create",
        "entry_id": object_entry.entry_id,
        "name": "Oil Change",
        "custom_icon": "mdi:oil",
        "nfc_tag_id": "nfc-tag-oil",
    }

    await ws_create_task.__wrapped__(hass, conn, msg)
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    task_id = result["task_id"]

    # Verify the fields were persisted
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    tasks = entry.data.get(CONF_TASKS, {})
    task_data = tasks.get(task_id, {})
    assert task_data.get("custom_icon") == "mdi:oil"
    assert task_data.get("nfc_tag_id") == "nfc-tag-oil"


async def test_ws_update_task_icon_and_nfc(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test updating a task via WS to add custom_icon and nfc_tag_id."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    msg: dict[str, Any] = {
        "id": 1,
        "type": "maintenance_supporter/task/update",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "custom_icon": "mdi:filter",
        "nfc_tag_id": "nfc-filter-tag",
    }

    await ws_update_task.__wrapped__(hass, conn, msg)
    conn.send_result.assert_called_once()

    # Verify updated fields
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    task = entry.data.get(CONF_TASKS, {}).get(TASK_ID_1, {})
    assert task.get("custom_icon") == "mdi:filter"
    assert task.get("nfc_tag_id") == "nfc-filter-tag"


async def test_ws_update_task_clear_icon(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry_with_icon: MockConfigEntry,
) -> None:
    """Test updating a task via WS to clear custom_icon."""
    await setup_integration(hass, global_entry, object_entry_with_icon)
    conn = _mock_connection()

    # Verify icon is set initially
    entry = hass.config_entries.async_get_entry(object_entry_with_icon.entry_id)
    assert entry is not None
    task = entry.data.get(CONF_TASKS, {}).get(TASK_ID_1, {})
    assert task.get("custom_icon") == "mdi:oil"

    msg: dict[str, Any] = {
        "id": 1,
        "type": "maintenance_supporter/task/update",
        "entry_id": object_entry_with_icon.entry_id,
        "task_id": TASK_ID_1,
        "custom_icon": None,
    }

    await ws_update_task.__wrapped__(hass, conn, msg)
    conn.send_result.assert_called_once()

    # Verify icon was cleared
    entry = hass.config_entries.async_get_entry(object_entry_with_icon.entry_id)
    assert entry is not None
    task = entry.data.get(CONF_TASKS, {}).get(TASK_ID_1, {})
    assert task.get("custom_icon") is None
