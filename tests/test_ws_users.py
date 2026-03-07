"""Tests for WebSocket user management handlers (websocket/users.py)."""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock, MagicMock, PropertyMock, patch

import pytest

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.users import (
    ws_assign_user,
    ws_list_users,
    ws_tasks_by_user,
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
    conn.user = MagicMock(is_admin=True)
    return conn


def _mock_user(
    user_id: str = "user1",
    name: str = "Test User",
    is_admin: bool = False,
    is_owner: bool = False,
    system_generated: bool = False,
    is_active: bool = True,
) -> MagicMock:
    """Create a mock HA auth User."""
    user = MagicMock()
    user.id = user_id
    user.name = name
    user.is_admin = is_admin
    user.is_owner = is_owner
    user.system_generated = system_generated
    user.is_active = is_active
    return user


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
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_pump_ws_usr",
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def assigned_object_entry(hass: HomeAssistant) -> MockConfigEntry:
    """Object entry with a task assigned to user1."""
    task = build_task_data(last_performed="2024-06-01")
    task["responsible_user_id"] = "user1"
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Assigned Pump",
        data=build_object_entry_data(
            object_data=build_object_data(name="Assigned Pump"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_assigned_pump_ws",
    )
    entry.add_to_hass(hass)
    return entry


# ─── List Users ───────────────────────────────────────────────────────────


async def test_ws_list_users(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test listing active, non-system users."""
    await setup_integration(hass, global_entry)

    users = [
        _mock_user("u1", "Alice", is_admin=True),
        _mock_user("u2", "Bob"),
    ]
    hass.auth.async_get_users = AsyncMock(return_value=users)  # type: ignore[method-assign]
    conn = _mock_connection()

    await ws_list_users.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/users/list",
    })

    result = conn.send_result.call_args[0][1]
    assert len(result["users"]) == 2
    assert result["users"][0]["name"] == "Alice"
    assert result["users"][0]["is_admin"] is True


async def test_ws_list_users_excludes_system(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that system-generated users are excluded."""
    await setup_integration(hass, global_entry)

    users = [
        _mock_user("u1", "Alice"),
        _mock_user("sys", "System", system_generated=True),
    ]
    hass.auth.async_get_users = AsyncMock(return_value=users)  # type: ignore[method-assign]
    conn = _mock_connection()

    await ws_list_users.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/users/list",
    })

    result = conn.send_result.call_args[0][1]
    assert len(result["users"]) == 1
    assert result["users"][0]["name"] == "Alice"


async def test_ws_list_users_excludes_inactive(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that inactive users are excluded."""
    await setup_integration(hass, global_entry)

    users = [
        _mock_user("u1", "Active User"),
        _mock_user("u2", "Inactive", is_active=False),
    ]
    hass.auth.async_get_users = AsyncMock(return_value=users)  # type: ignore[method-assign]
    conn = _mock_connection()

    await ws_list_users.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/users/list",
    })

    result = conn.send_result.call_args[0][1]
    assert len(result["users"]) == 1
    assert result["users"][0]["name"] == "Active User"


# ─── Assign User ──────────────────────────────────────────────────────────


async def test_ws_assign_user(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test assigning a user to a task."""
    await setup_integration(hass, global_entry, object_entry)
    hass.auth.async_get_user = AsyncMock(return_value=_mock_user("user1"))  # type: ignore[method-assign]
    conn = _mock_connection()

    await ws_assign_user.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/assign_user",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "user_id": "user1",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is True
    assert result["user_id"] == "user1"

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    assert entry.data[CONF_TASKS][TASK_ID_1]["responsible_user_id"] == "user1"


async def test_ws_assign_user_unassign(
    hass: HomeAssistant, global_entry: MockConfigEntry, assigned_object_entry: MockConfigEntry,
) -> None:
    """Test unassigning a user from a task."""
    await setup_integration(hass, global_entry, assigned_object_entry)
    conn = _mock_connection()

    await ws_assign_user.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/assign_user",
        "entry_id": assigned_object_entry.entry_id,
        "task_id": TASK_ID_1,
        "user_id": None,
    })

    conn.send_result.assert_called_once()
    entry = hass.config_entries.async_get_entry(assigned_object_entry.entry_id)
    assert entry is not None
    assert "responsible_user_id" not in entry.data[CONF_TASKS][TASK_ID_1]


async def test_ws_assign_user_not_found_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test assigning user on non-existent entry."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_assign_user.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/assign_user",
        "entry_id": "nonexistent",
        "task_id": TASK_ID_1,
        "user_id": "user1",
    })

    conn.send_error.assert_called_once()


async def test_ws_assign_user_not_found_task(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test assigning user to non-existent task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_assign_user.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/assign_user",
        "entry_id": object_entry.entry_id,
        "task_id": "nonexistent_task",
        "user_id": "user1",
    })

    conn.send_error.assert_called_once()


async def test_ws_assign_user_invalid(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test assigning non-existent user."""
    await setup_integration(hass, global_entry, object_entry)
    hass.auth.async_get_user = AsyncMock(return_value=None)  # type: ignore[method-assign]
    conn = _mock_connection()

    await ws_assign_user.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/assign_user",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "user_id": "nonexistent_user",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_user"


# ─── Tasks by User ────────────────────────────────────────────────────────


async def test_ws_tasks_by_user(
    hass: HomeAssistant, global_entry: MockConfigEntry, assigned_object_entry: MockConfigEntry,
) -> None:
    """Test getting tasks assigned to a user."""
    await setup_integration(hass, global_entry, assigned_object_entry)
    conn = _mock_connection()

    await ws_tasks_by_user.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/tasks/by_user",
        "user_id": "user1",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert len(result["tasks"]) == 1
    assert result["tasks"][0]["name"] == "Filter Cleaning"
    assert "object_name" in result["tasks"][0]
    assert "entry_id" in result["tasks"][0]


async def test_ws_tasks_by_user_empty(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test getting tasks for a user with no assignments."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_tasks_by_user.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/tasks/by_user",
        "user_id": "user_with_no_tasks",
    })

    result = conn.send_result.call_args[0][1]
    assert result["tasks"] == []
