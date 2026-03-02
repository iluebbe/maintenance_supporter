"""Tests for WebSocket analysis handlers (websocket/analysis.py)."""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.analysis import (
    ws_analyze_interval,
    ws_apply_suggestion,
    ws_seasonal_overrides,
    ws_set_environmental_entity,
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
    task["history"] = [
        {"timestamp": "2024-01-01T00:00:00", "type": "completed"},
        {"timestamp": "2024-03-01T00:00:00", "type": "completed"},
        {"timestamp": "2024-06-01T00:00:00", "type": "completed"},
    ]
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_ws_analysis",
    )
    entry.add_to_hass(hass)
    return entry


# ─── ws_analyze_interval ─────────────────────────────────────────────────


async def test_analyze_interval_basic(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test analyze_interval returns analysis result."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_analyze_interval.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/analyze_interval",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "current_interval" in result
    assert "confidence" in result
    assert "data_points" in result
    assert "weibull_beta" in result
    assert "seasonal_factor" in result


async def test_analyze_interval_not_found_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test analyze_interval with non-existent entry."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_analyze_interval.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/analyze_interval",
        "entry_id": "nonexistent",
        "task_id": TASK_ID_1,
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


async def test_analyze_interval_not_found_task(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test analyze_interval with non-existent task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_analyze_interval.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/analyze_interval",
        "entry_id": object_entry.entry_id,
        "task_id": "nonexistent_task",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


async def test_analyze_interval_rejects_global(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test analyze_interval rejects global config entry."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_analyze_interval.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/analyze_interval",
        "entry_id": global_entry.entry_id,
        "task_id": TASK_ID_1,
    })

    conn.send_error.assert_called_once()


# ─── ws_apply_suggestion ─────────────────────────────────────────────────


async def test_apply_suggestion_basic(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test applying a suggested interval."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_apply_suggestion.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/apply_suggestion",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "interval": 45,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is True


async def test_apply_suggestion_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test apply_suggestion with non-existent coordinator."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_apply_suggestion.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/apply_suggestion",
        "entry_id": "nonexistent",
        "task_id": TASK_ID_1,
        "interval": 45,
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


# ─── ws_seasonal_overrides ───────────────────────────────────────────────


async def test_seasonal_overrides_set(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test setting seasonal overrides."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_seasonal_overrides.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/seasonal_overrides",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "overrides": {"7": 0.5, "1": 2.0},
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is True
    assert result["overrides"] == {7: 0.5, 1: 2.0}

    # Verify persisted
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    ac = entry.data[CONF_TASKS][TASK_ID_1]["adaptive_config"]
    assert ac["seasonal_overrides"] == {7: 0.5, 1: 2.0}


async def test_seasonal_overrides_clear(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test clearing seasonal overrides with empty dict."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_seasonal_overrides.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/seasonal_overrides",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "overrides": {},
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is True
    assert result["overrides"] == {}


async def test_seasonal_overrides_invalid_month(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test seasonal overrides with invalid month (>12)."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_seasonal_overrides.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/seasonal_overrides",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "overrides": {"13": 1.0},
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_input"


async def test_seasonal_overrides_invalid_factor(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test seasonal overrides with factor out of range."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_seasonal_overrides.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/seasonal_overrides",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "overrides": {"6": 10.0},  # >5.0
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_input"


async def test_seasonal_overrides_invalid_key_type(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test seasonal overrides with non-numeric key."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_seasonal_overrides.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/seasonal_overrides",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "overrides": {"abc": 1.0},
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_input"


async def test_seasonal_overrides_not_found_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test seasonal overrides with non-existent entry."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_seasonal_overrides.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/seasonal_overrides",
        "entry_id": "nonexistent",
        "task_id": TASK_ID_1,
        "overrides": {},
    })

    conn.send_error.assert_called_once()


async def test_seasonal_overrides_not_found_task(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test seasonal overrides with non-existent task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_seasonal_overrides.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/seasonal_overrides",
        "entry_id": object_entry.entry_id,
        "task_id": "nonexistent_task",
        "overrides": {},
    })

    conn.send_error.assert_called_once()


# ─── ws_set_environmental_entity ─────────────────────────────────────────


async def test_set_environmental_entity(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test setting environmental entity."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_set_environmental_entity.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/set_environmental_entity",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "environmental_entity": "sensor.outdoor_temp",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is True
    assert result["environmental_entity"] == "sensor.outdoor_temp"

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    ac = entry.data[CONF_TASKS][TASK_ID_1]["adaptive_config"]
    assert ac["environmental_entity"] == "sensor.outdoor_temp"


async def test_set_environmental_entity_with_attribute(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test setting environmental entity with attribute."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_set_environmental_entity.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/set_environmental_entity",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "environmental_entity": "sensor.weather",
        "environmental_attribute": "temperature",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["environmental_attribute"] == "temperature"

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    ac = entry.data[CONF_TASKS][TASK_ID_1]["adaptive_config"]
    assert ac["environmental_attribute"] == "temperature"


async def test_clear_environmental_entity(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test clearing environmental entity binding."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    # First set it
    await ws_set_environmental_entity.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/set_environmental_entity",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "environmental_entity": "sensor.outdoor_temp",
    })

    # Then clear it
    conn.reset_mock()
    await ws_set_environmental_entity.__wrapped__(hass, conn, {
        "id": 2, "type": "maintenance_supporter/task/set_environmental_entity",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "environmental_entity": None,
    })

    conn.send_result.assert_called_once()
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    ac = entry.data[CONF_TASKS][TASK_ID_1].get("adaptive_config", {})
    assert "environmental_entity" not in ac


async def test_set_environmental_entity_not_found_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test set_environmental_entity with non-existent entry."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_set_environmental_entity.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/set_environmental_entity",
        "entry_id": "nonexistent",
        "task_id": TASK_ID_1,
        "environmental_entity": "sensor.temp",
    })

    conn.send_error.assert_called_once()


async def test_set_environmental_entity_not_found_task(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test set_environmental_entity with non-existent task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_set_environmental_entity.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/set_environmental_entity",
        "entry_id": object_entry.entry_id,
        "task_id": "nonexistent_task",
        "environmental_entity": "sensor.temp",
    })

    conn.send_error.assert_called_once()
