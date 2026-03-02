"""Tests for WebSocket object CRUD handlers (websocket/objects.py)."""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket import (
    _build_object_response,
    _build_task_summary,
)
from custom_components.maintenance_supporter.websocket.objects import (
    ws_create_object,
    ws_delete_object,
    ws_get_object,
    ws_get_objects,
    ws_update_object,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


def _mock_connection() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    return conn


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
    task = build_task_data(last_performed="2024-06-01")
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(
            object_data=build_object_data(
                name="Pool Pump", area_id="backyard",
                manufacturer="Pentair", model="SuperFlo",
            ),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_pool_pump_ws_obj",
    )
    entry.add_to_hass(hass)
    return entry


# ─── Get Objects ──────────────────────────────────────────────────────────


async def test_ws_get_objects(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test getting all objects."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_get_objects.__wrapped__(hass, conn, {"id": 1, "type": "maintenance_supporter/objects"})

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "objects" in result
    assert len(result["objects"]) == 1
    assert result["objects"][0]["object"]["name"] == "Pool Pump"


async def test_ws_get_objects_empty(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test getting objects when none exist."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_get_objects.__wrapped__(hass, conn, {"id": 1, "type": "maintenance_supporter/objects"})

    result = conn.send_result.call_args[0][1]
    assert result["objects"] == []


# ─── Get Single Object ────────────────────────────────────────────────────


async def test_ws_get_object(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test getting a single object."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_get_object.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/object",
        "entry_id": object_entry.entry_id,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["object"]["name"] == "Pool Pump"
    assert len(result["tasks"]) == 1


async def test_ws_get_object_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test getting non-existent object."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_get_object.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/object",
        "entry_id": "nonexistent",
    })

    conn.send_error.assert_called_once()


# ─── Create Object ────────────────────────────────────────────────────────


async def test_ws_create_object_basic(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test creating a basic object."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_create_object.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/create",
        "name": "New Object",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "entry_id" in result


async def test_ws_create_object_all_fields(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test creating object with all optional fields."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_create_object.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/create",
        "name": "Full Object",
        "area_id": "garage",
        "manufacturer": "Bosch",
        "model": "X100",
    })

    conn.send_result.assert_called_once()


async def test_ws_create_object_dry_run(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test dry run for object creation."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_create_object.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/create",
        "name": "Dry Run Object",
        "dry_run": True,
    })

    result = conn.send_result.call_args[0][1]
    assert result["valid"] is True
    assert result["entry_id"] is None


# ─── Update Object ────────────────────────────────────────────────────────


async def test_ws_update_object_name(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test updating object name."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_update_object.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/update",
        "entry_id": object_entry.entry_id,
        "name": "Updated Pump",
    })

    conn.send_result.assert_called_once()
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry.data[CONF_OBJECT]["name"] == "Updated Pump"
    assert entry.title == "Updated Pump"


async def test_ws_update_object_multiple(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test updating multiple object fields."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_update_object.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/update",
        "entry_id": object_entry.entry_id,
        "manufacturer": "Hayward",
        "model": "MaxFlo",
        "area_id": "pool_house",
    })

    conn.send_result.assert_called_once()
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    obj = entry.data[CONF_OBJECT]
    assert obj["manufacturer"] == "Hayward"
    assert obj["model"] == "MaxFlo"
    assert obj["area_id"] == "pool_house"


async def test_ws_update_object_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test updating non-existent object."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_update_object.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/update",
        "entry_id": "nonexistent",
        "name": "Test",
    })

    conn.send_error.assert_called_once()


# ─── Delete Object ────────────────────────────────────────────────────────


async def test_ws_delete_object(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test deleting an object."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_delete_object.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/delete",
        "entry_id": object_entry.entry_id,
    })

    conn.send_result.assert_called_once()
    assert conn.send_result.call_args[0][1]["success"] is True


async def test_ws_delete_object_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test deleting non-existent object."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_delete_object.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/delete",
        "entry_id": "nonexistent",
    })

    conn.send_error.assert_called_once()


# ─── Unit Tests: Build Helpers ────────────────────────────────────────────


def test_build_task_summary_trigger_info(hass: HomeAssistant) -> None:
    """Test _build_task_summary enriches trigger entity info."""
    hass.states.async_set("sensor.temp", "25.0", {
        "friendly_name": "Temperature",
        "unit_of_measurement": "°C",
    })

    task_data = {
        "name": "Test", "type": "custom",
        "trigger_config": {"entity_id": "sensor.temp", "type": "threshold"},
    }

    result = _build_task_summary(hass, "tid", task_data, None)
    assert result["trigger_entity_info"] is not None
    assert result["trigger_entity_info"]["friendly_name"] == "Temperature"
    assert result["trigger_entity_info"]["unit_of_measurement"] == "°C"


def test_build_task_summary_multi_entity(hass: HomeAssistant) -> None:
    """Test _build_task_summary with multiple entity infos."""
    hass.states.async_set("sensor.temp1", "25.0", {"friendly_name": "Temp 1"})
    hass.states.async_set("sensor.temp2", "30.0", {"friendly_name": "Temp 2"})

    task_data = {
        "name": "Test", "type": "custom",
        "trigger_config": {
            "entity_ids": ["sensor.temp1", "sensor.temp2"],
            "type": "threshold",
        },
    }

    result = _build_task_summary(hass, "tid", task_data, None)
    assert result["trigger_entity_info"]["friendly_name"] == "Temp 1"
    assert result["trigger_entity_infos"] is not None
    assert len(result["trigger_entity_infos"]) == 2


def test_build_object_response_structure(
    hass: HomeAssistant, global_entry, object_entry,
) -> None:
    """Test _build_object_response returns correct structure."""
    result = _build_object_response(hass, object_entry, None)
    assert "entry_id" in result
    assert "object" in result
    assert "tasks" in result
    assert result["object"]["name"] == "Pool Pump"
    assert result["object"]["manufacturer"] == "Pentair"
