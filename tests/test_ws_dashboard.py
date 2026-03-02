"""Tests for WebSocket dashboard handlers (websocket/dashboard.py)."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any
from unittest.mock import MagicMock

import pytest

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_BUDGET,
    CONF_ADVANCED_CHECKLISTS,
    CONF_ADVANCED_ENVIRONMENTAL,
    CONF_ADVANCED_GROUPS,
    CONF_ADVANCED_PREDICTIONS,
    CONF_ADVANCED_SEASONAL,
    CONF_BUDGET_ALERT_THRESHOLD,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.dashboard import (
    ws_get_budget_status,
    ws_get_settings,
    ws_get_statistics,
    ws_subscribe,
)

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
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
    conn.send_message = MagicMock()
    conn.subscriptions = {}
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
def global_entry_with_features(hass: HomeAssistant) -> MockConfigEntry:
    """Global entry with advanced features enabled."""
    data = build_global_entry_data()
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        options={
            **data,
            CONF_ADVANCED_ADAPTIVE: True,
            CONF_ADVANCED_PREDICTIONS: True,
            CONF_ADVANCED_SEASONAL: True,
            CONF_ADVANCED_ENVIRONMENTAL: False,
            CONF_ADVANCED_BUDGET: True,
            CONF_ADVANCED_GROUPS: False,
            CONF_ADVANCED_CHECKLISTS: True,
        },
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def global_entry_with_budget(hass: HomeAssistant) -> MockConfigEntry:
    """Global entry with budget configuration."""
    data = build_global_entry_data()
    data[CONF_BUDGET_MONTHLY] = 200.0
    data[CONF_BUDGET_YEARLY] = 2000.0
    data[CONF_BUDGET_ALERT_THRESHOLD] = 90
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
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
        unique_id="maintenance_supporter_pool_ws_dash",
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_entry_with_cost(hass: HomeAssistant) -> MockConfigEntry:
    """Object entry with history that has cost data."""
    now = datetime.now()
    task = build_task_data(last_performed="2024-06-01")
    task["history"] = [
        {
            "timestamp": now.replace(day=1).isoformat(),
            "type": "completed",
            "cost": 50.0,
        },
        {
            "timestamp": now.replace(day=15).isoformat(),
            "type": "completed",
            "cost": 75.0,
        },
        {
            "timestamp": (now - timedelta(days=60)).isoformat(),
            "type": "completed",
            "cost": 100.0,
        },
        {
            "timestamp": "2023-06-01T00:00:00",
            "type": "completed",
            "cost": 200.0,  # last year — excluded from monthly/yearly
        },
    ]
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Costly Pump",
        data=build_object_entry_data(
            object_data=build_object_data(name="Costly Pump"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_costly_pump_ws",
    )
    entry.add_to_hass(hass)
    return entry


# ─── ws_get_settings ─────────────────────────────────────────────────────


async def test_get_settings_default(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test get_settings with default (no features enabled)."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_get_settings.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/settings",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    features = result["features"]
    assert features["adaptive"] is False
    assert features["predictions"] is False
    assert features["budget"] is False
    assert features["groups"] is False


async def test_get_settings_with_features(
    hass: HomeAssistant, global_entry_with_features: MockConfigEntry,
) -> None:
    """Test get_settings with advanced features enabled."""
    await setup_integration(hass, global_entry_with_features)
    conn = _mock_connection()

    await ws_get_settings.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/settings",
    })

    result = conn.send_result.call_args[0][1]
    features = result["features"]
    assert features["adaptive"] is True
    assert features["predictions"] is True
    assert features["seasonal"] is True
    assert features["environmental"] is False
    assert features["budget"] is True
    assert features["groups"] is False
    assert features["checklists"] is True


async def test_get_settings_no_global_entry(
    hass: HomeAssistant,
) -> None:
    """Test get_settings when no global entry exists."""
    conn = _mock_connection()

    await ws_get_settings.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/settings",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["features"] == {}


# ─── ws_get_statistics ───────────────────────────────────────────────────


async def test_get_statistics_basic(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test get_statistics returns aggregated data."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_get_statistics.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/statistics",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["total_objects"] == 1
    assert result["total_tasks"] == 1
    assert isinstance(result["overdue"], int)
    assert isinstance(result["due_soon"], int)
    assert isinstance(result["triggered"], int)
    assert isinstance(result["total_cost"], float)


async def test_get_statistics_empty(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test get_statistics with no objects."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_get_statistics.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/statistics",
    })

    result = conn.send_result.call_args[0][1]
    assert result["total_objects"] == 0
    assert result["total_tasks"] == 0
    assert result["overdue"] == 0


async def test_get_statistics_multiple_objects(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test get_statistics with multiple objects and tasks."""
    task1 = build_task_data(task_id=TASK_ID_1, last_performed="2024-01-01")
    task2 = build_task_data(task_id=TASK_ID_2, name="Oil Change", last_performed="2024-06-01")
    entry1 = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Object 1",
        data=build_object_entry_data(
            object_data=build_object_data(name="Object 1"),
            tasks={TASK_ID_1: task1},
        ),
        source="user", unique_id="maintenance_supporter_stats_obj1",
    )
    entry2 = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Object 2",
        data=build_object_entry_data(
            object_data=build_object_data(name="Object 2"),
            tasks={TASK_ID_2: task2},
        ),
        source="user", unique_id="maintenance_supporter_stats_obj2",
    )
    entry1.add_to_hass(hass)
    entry2.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry1, entry2)
    conn = _mock_connection()

    await ws_get_statistics.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/statistics",
    })

    result = conn.send_result.call_args[0][1]
    assert result["total_objects"] == 2
    assert result["total_tasks"] == 2


# ─── ws_subscribe ────────────────────────────────────────────────────────


async def test_subscribe_registers_listener(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test subscribe registers coordinator listeners and sends initial data."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_subscribe.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/subscribe",
    })

    # Should call send_result for subscription confirmation
    conn.send_result.assert_called_once()
    # Should call send_message for initial data
    conn.send_message.assert_called_once()
    # Should register unsub callback
    assert 1 in conn.subscriptions


async def test_subscribe_unsub_cleans_up(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test unsubscribe callback cleans up listeners."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_subscribe.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/subscribe",
    })

    # Call unsub
    unsub = conn.subscriptions[1]
    unsub()  # Should not raise


async def test_subscribe_no_objects(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test subscribe with no objects still works."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_subscribe.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/subscribe",
    })

    conn.send_result.assert_called_once()
    conn.send_message.assert_called_once()


# ─── ws_get_budget_status ────────────────────────────────────────────────


async def test_budget_status_default(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test budget_status with default config (no budget)."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_get_budget_status.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/budget_status",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["monthly_budget"] == 0.0
    assert result["yearly_budget"] == 0.0
    assert result["monthly_spent"] == 0.0
    assert result["yearly_spent"] == 0.0
    assert result["alert_threshold_pct"] == 80


async def test_budget_status_with_config(
    hass: HomeAssistant, global_entry_with_budget: MockConfigEntry,
) -> None:
    """Test budget_status returns configured budget values."""
    await setup_integration(hass, global_entry_with_budget)
    conn = _mock_connection()

    await ws_get_budget_status.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/budget_status",
    })

    result = conn.send_result.call_args[0][1]
    assert result["monthly_budget"] == 200.0
    assert result["yearly_budget"] == 2000.0
    assert result["alert_threshold_pct"] == 90


async def test_budget_status_with_costs(
    hass: HomeAssistant, global_entry_with_budget: MockConfigEntry,
    object_entry_with_cost: MockConfigEntry,
) -> None:
    """Test budget_status calculates spent from history."""
    await setup_integration(hass, global_entry_with_budget, object_entry_with_cost)
    conn = _mock_connection()

    await ws_get_budget_status.__wrapped__(hass, conn, {
        "id": 1, "type": "maintenance_supporter/budget_status",
    })

    result = conn.send_result.call_args[0][1]
    # monthly: 50 + 75 = 125; yearly: 50 + 75 + 100 = 225
    assert result["monthly_spent"] == 125.0
    assert result["yearly_spent"] == 225.0
