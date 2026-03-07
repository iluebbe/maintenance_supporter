"""Tests for WebSocket group handlers (websocket/groups.py)."""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket import cleanup_group_refs
from custom_components.maintenance_supporter.websocket.groups import (
    ws_create_group,
    ws_delete_group,
    ws_get_groups,
    ws_update_group,
)

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_global_entry_data,
    setup_integration,
)


def _mock_connection() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.user = MagicMock(is_admin=True)
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


# ─── ws_get_groups ───────────────────────────────────────────────────────


async def test_get_groups_empty(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test get_groups with no groups."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_get_groups.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/groups",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["groups"] == {}


async def test_get_groups_no_global(
    hass: HomeAssistant,
) -> None:
    """Test get_groups when no global entry exists."""
    conn = _mock_connection()

    await ws_get_groups.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/groups",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["groups"] == {}


# ─── ws_create_group ─────────────────────────────────────────────────────


async def test_create_group_basic(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test creating a group with name only."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_create_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/group/create",
        "name": "Monthly Tasks",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "group_id" in result
    group_id = result["group_id"]

    # Verify persisted
    entry = hass.config_entries.async_get_entry(global_entry.entry_id)
    assert entry is not None
    options = entry.options
    assert group_id in options["groups"]
    assert options["groups"][group_id]["name"] == "Monthly Tasks"


async def test_create_group_with_all_fields(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test creating a group with description and task_refs."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_create_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/group/create",
        "name": "Pool Maintenance",
        "description": "All pool-related tasks",
        "task_refs": [
            {"entry_id": "entry1", "task_id": "task1"},
            {"entry_id": "entry1", "task_id": "task2"},
        ],
    })

    result = conn.send_result.call_args[0][1]
    group_id = result["group_id"]

    entry = hass.config_entries.async_get_entry(global_entry.entry_id)
    assert entry is not None
    group = entry.options["groups"][group_id]
    assert group["description"] == "All pool-related tasks"
    assert len(group["task_refs"]) == 2


async def test_create_group_no_global(
    hass: HomeAssistant,
) -> None:
    """Test creating a group when no global entry exists."""
    conn = _mock_connection()

    await ws_create_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/group/create",
        "name": "Test",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


# ─── ws_update_group ─────────────────────────────────────────────────────


async def _create_group(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> str:
    """Helper to create a group and return its ID."""
    conn = _mock_connection()
    await ws_create_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/group/create",
        "name": "Original Name",
        "description": "Original desc",
        "task_refs": [{"entry_id": "e1", "task_id": "t1"}],
    })
    result: str = conn.send_result.call_args[0][1]["group_id"]
    return result


async def test_update_group_name(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test updating a group's name."""
    await setup_integration(hass, global_entry)
    group_id = await _create_group(hass, global_entry)
    conn = _mock_connection()

    await ws_update_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 2, "type": "maintenance_supporter/group/update",
        "group_id": group_id,
        "name": "Updated Name",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is True

    entry = hass.config_entries.async_get_entry(global_entry.entry_id)
    assert entry is not None
    assert entry.options["groups"][group_id]["name"] == "Updated Name"
    # Description should remain unchanged
    assert entry.options["groups"][group_id]["description"] == "Original desc"


async def test_update_group_task_refs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test updating a group's task_refs."""
    await setup_integration(hass, global_entry)
    group_id = await _create_group(hass, global_entry)
    conn = _mock_connection()

    await ws_update_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 2, "type": "maintenance_supporter/group/update",
        "group_id": group_id,
        "task_refs": [
            {"entry_id": "e2", "task_id": "t2"},
            {"entry_id": "e2", "task_id": "t3"},
        ],
    })

    entry = hass.config_entries.async_get_entry(global_entry.entry_id)
    assert entry is not None
    assert len(entry.options["groups"][group_id]["task_refs"]) == 2


async def test_update_group_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test updating a non-existent group."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_update_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/group/update",
        "group_id": "nonexistent",
        "name": "Test",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


async def test_update_group_no_global(
    hass: HomeAssistant,
) -> None:
    """Test updating a group when no global entry exists."""
    conn = _mock_connection()

    await ws_update_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/group/update",
        "group_id": "any",
        "name": "Test",
    })

    conn.send_error.assert_called_once()


# ─── ws_delete_group ─────────────────────────────────────────────────────


async def test_delete_group(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test deleting a group."""
    await setup_integration(hass, global_entry)
    group_id = await _create_group(hass, global_entry)
    conn = _mock_connection()

    await ws_delete_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 2, "type": "maintenance_supporter/group/delete",
        "group_id": group_id,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is True

    entry = hass.config_entries.async_get_entry(global_entry.entry_id)
    assert entry is not None
    assert group_id not in entry.options.get("groups", {})


async def test_delete_group_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test deleting a non-existent group."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_delete_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/group/delete",
        "group_id": "nonexistent",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


async def test_delete_group_no_global(
    hass: HomeAssistant,
) -> None:
    """Test deleting a group when no global entry exists."""
    conn = _mock_connection()

    await ws_delete_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/group/delete",
        "group_id": "any",
    })

    conn.send_error.assert_called_once()


# ─── Full CRUD cycle ────────────────────────────────────────────────────


async def test_group_crud_cycle(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test full group lifecycle: create → get → update → delete → get."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    # Create
    await ws_create_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/group/create",
        "name": "Lifecycle Test",
    })
    group_id = conn.send_result.call_args[0][1]["group_id"]

    # Get
    conn.reset_mock()
    await ws_get_groups.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 2, "type": "maintenance_supporter/groups",
    })
    groups = conn.send_result.call_args[0][1]["groups"]
    assert group_id in groups
    assert groups[group_id]["name"] == "Lifecycle Test"

    # Update
    conn.reset_mock()
    await ws_update_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 3, "type": "maintenance_supporter/group/update",
        "group_id": group_id,
        "name": "Updated Lifecycle",
    })

    # Delete
    conn.reset_mock()
    await ws_delete_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 4, "type": "maintenance_supporter/group/delete",
        "group_id": group_id,
    })

    # Verify deleted
    conn.reset_mock()
    await ws_get_groups.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 5, "type": "maintenance_supporter/groups",
    })
    groups = conn.send_result.call_args[0][1]["groups"]
    assert group_id not in groups


# ─── cleanup_group_refs unit tests ──────────────────────────────────────


async def test_cleanup_group_refs_by_task_id(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test cleanup_group_refs removes refs matching a task_id."""
    await setup_integration(hass, global_entry)

    # Create a group with two task refs
    conn = _mock_connection()
    await ws_create_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/group/create",
        "name": "Test Group",
        "task_refs": [
            {"entry_id": "e1", "task_id": TASK_ID_1},
            {"entry_id": "e1", "task_id": TASK_ID_2},
        ],
    })
    group_id = conn.send_result.call_args[0][1]["group_id"]

    # Clean up refs for TASK_ID_1
    cleanup_group_refs(hass, task_id=TASK_ID_1)

    entry = hass.config_entries.async_get_entry(global_entry.entry_id)
    assert entry is not None
    refs = entry.options["groups"][group_id]["task_refs"]
    assert len(refs) == 1
    assert refs[0]["task_id"] == TASK_ID_2


async def test_cleanup_group_refs_by_entry_id(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test cleanup_group_refs removes all refs for an entry_id."""
    await setup_integration(hass, global_entry)

    conn = _mock_connection()
    await ws_create_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/group/create",
        "name": "Test Group",
        "task_refs": [
            {"entry_id": "entry_to_delete", "task_id": "t1"},
            {"entry_id": "entry_to_delete", "task_id": "t2"},
            {"entry_id": "other_entry", "task_id": "t3"},
        ],
    })
    group_id = conn.send_result.call_args[0][1]["group_id"]

    cleanup_group_refs(hass, entry_id="entry_to_delete")

    entry = hass.config_entries.async_get_entry(global_entry.entry_id)
    assert entry is not None
    refs = entry.options["groups"][group_id]["task_refs"]
    assert len(refs) == 1
    assert refs[0]["entry_id"] == "other_entry"


async def test_cleanup_group_refs_no_groups(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test cleanup_group_refs is a no-op when no groups exist."""
    await setup_integration(hass, global_entry)

    # Should not raise
    cleanup_group_refs(hass, task_id="nonexistent")

    entry = hass.config_entries.async_get_entry(global_entry.entry_id)
    assert entry is not None
    assert entry.options.get("groups", {}) == {}


async def test_cleanup_group_refs_no_global_entry(
    hass: HomeAssistant,
) -> None:
    """Test cleanup_group_refs is a no-op when no global entry exists."""
    # Should not raise
    cleanup_group_refs(hass, task_id="anything")


async def test_cleanup_group_refs_across_multiple_groups(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test cleanup removes refs from ALL groups that reference the task."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    # Create two groups, both referencing the same task
    await ws_create_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/group/create",
        "name": "Group A",
        "task_refs": [{"entry_id": "e1", "task_id": TASK_ID_1}],
    })
    gid_a = conn.send_result.call_args[0][1]["group_id"]

    conn.reset_mock()
    await ws_create_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 2, "type": "maintenance_supporter/group/create",
        "name": "Group B",
        "task_refs": [
            {"entry_id": "e1", "task_id": TASK_ID_1},
            {"entry_id": "e1", "task_id": TASK_ID_2},
        ],
    })
    gid_b = conn.send_result.call_args[0][1]["group_id"]

    cleanup_group_refs(hass, task_id=TASK_ID_1)

    entry = hass.config_entries.async_get_entry(global_entry.entry_id)
    assert entry is not None
    groups = entry.options["groups"]
    assert len(groups[gid_a]["task_refs"]) == 0
    assert len(groups[gid_b]["task_refs"]) == 1
    assert groups[gid_b]["task_refs"][0]["task_id"] == TASK_ID_2
