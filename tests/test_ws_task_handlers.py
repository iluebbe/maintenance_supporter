"""Tests for WebSocket task CRUD handlers (websocket/tasks.py)."""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    HistoryEntryType,
    ScheduleType,
)
from custom_components.maintenance_supporter.websocket.groups import (
    ws_create_group,
)
from custom_components.maintenance_supporter.websocket.tasks import (
    _validate_compound_trigger,
    _validate_trigger_config,
    ws_complete_task,
    ws_create_task,
    ws_delete_task,
    ws_list_tasks,
    ws_reset_task,
    ws_skip_task,
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

# ─── Helpers ──────────────────────────────────────────────────────────────


def _mock_connection() -> MagicMock:
    """Create a mock websocket connection."""
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


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    task = build_task_data(last_performed="2024-06-01")
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_pump_ws",
    )
    entry.add_to_hass(hass)
    return entry


# ─── Task Create Tests ────────────────────────────────────────────────────


async def test_ws_create_task_basic(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test creating a basic task via WS."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_create_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/create",
        "entry_id": object_entry.entry_id,
        "name": "Oil Change",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "task_id" in result
    assert len(result["task_id"]) == 32


async def test_ws_create_task_with_all_fields(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test creating a task with all optional fields."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_create_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/create",
        "entry_id": object_entry.entry_id,
        "name": "Full Task",
        "task_type": "inspection",
        "schedule_type": "sensor_based",
        "interval_days": 60,
        "warning_days": 14,
        "notes": "Check everything",
        "documentation_url": "https://example.com/docs",
        "responsible_user_id": "user123",
        "entity_slug": "pump_filter",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "task_id" in result


async def test_ws_create_task_with_last_performed(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test that creating task with last_performed adds history entry.

    The WS handler writes dynamic state (last_performed, history) to the Store,
    then reloads the config entry.  We patch async_delay_save → async_save so
    the data is flushed to disk *before* the reload creates a fresh Store.
    """
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    # Make the Store flush immediately so data survives the reload that
    # ws_create_task triggers.
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    store = entry.runtime_data.store

    async def _immediate_save() -> None:
        await store.async_save()

    with patch.object(store, "async_delay_save", side_effect=lambda: hass.async_create_task(_immediate_save())):
        await ws_create_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
            "id": 1, "type": "maintenance_supporter/task/create",
            "entry_id": object_entry.entry_id,
            "name": "Test Task",
            "last_performed": "2024-01-15",
        })

    result = conn.send_result.call_args[0][1]
    task_id = result["task_id"]
    # last_performed and history are now in the Store
    state = get_task_store_state(hass, object_entry.entry_id, task_id)
    assert state.get("last_performed") == "2024-01-15"
    assert len(state.get("history", [])) == 1
    assert state["history"][0]["type"] == HistoryEntryType.COMPLETED


async def test_ws_create_task_with_trigger_config(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test creating a task with trigger configuration."""
    await setup_integration(hass, global_entry, object_entry)
    hass.states.async_set("sensor.test_temp", "25.0")
    conn = _mock_connection()

    await ws_create_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/create",
        "entry_id": object_entry.entry_id,
        "name": "Triggered Task",
        "schedule_type": "sensor_based",
        "trigger_config": {
            "type": "threshold",
            "entity_id": "sensor.test_temp",
            "trigger_above": 30.0,
        },
    })

    conn.send_result.assert_called_once()
    conn.send_error.assert_not_called()


async def test_ws_create_task_invalid_trigger(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test creating a task with invalid trigger (missing entity_id)."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_create_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/create",
        "entry_id": object_entry.entry_id,
        "name": "Bad Trigger",
        "trigger_config": {"type": "threshold"},
    })

    conn.send_error.assert_called_once()
    assert "entity_id" in conn.send_error.call_args[0][2]


async def test_ws_create_task_invalid_entity_slug(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test creating a task with invalid entity_slug."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_create_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/create",
        "entry_id": object_entry.entry_id,
        "name": "Bad Slug",
        "entity_slug": "Invalid-Slug!",
    })

    conn.send_error.assert_called_once()
    assert "entity_slug" in conn.send_error.call_args[0][2]


async def test_ws_create_task_dry_run(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test dry run creates no persistent data."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    initial_task_count = len(object_entry.data.get(CONF_TASKS, {}))

    await ws_create_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/create",
        "entry_id": object_entry.entry_id,
        "name": "Dry Run Task",
        "dry_run": True,
    })

    result = conn.send_result.call_args[0][1]
    assert result["valid"] is True
    assert result["task_id"] is None
    # No new task in entry
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    assert len(entry.data.get(CONF_TASKS, {})) == initial_task_count


async def test_ws_create_task_dry_run_warnings(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test dry run with trigger warnings (entity doesn't exist)."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_create_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/create",
        "entry_id": object_entry.entry_id,
        "name": "Dry Run Warnings",
        "trigger_config": {
            "type": "threshold",
            "entity_id": "sensor.nonexistent",
            "trigger_above": 50.0,
        },
        "dry_run": True,
    })

    result = conn.send_result.call_args[0][1]
    assert result["valid"] is True
    assert "warnings" in result
    assert any("nonexistent" in w for w in result["warnings"])


async def test_ws_create_task_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test creating task on non-existent entry."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_create_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/create",
        "entry_id": "nonexistent",
        "name": "Test",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


async def test_ws_create_task_global_rejected(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test creating task on global entry is rejected."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_create_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/create",
        "entry_id": global_entry.entry_id,
        "name": "Test",
    })

    conn.send_error.assert_called_once()


# ─── Task Update Tests ───────────────────────────────────────────────────


async def test_ws_update_task_basic(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test updating a task name."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_update_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/update",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "name": "Updated Name",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is True

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    assert entry.data[CONF_TASKS][TASK_ID_1]["name"] == "Updated Name"


async def test_ws_update_task_multiple_fields(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test updating multiple fields at once."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_update_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/update",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "name": "New Name",
        "warning_days": 14,
        "enabled": False,
        "notes": "Updated notes",
    })

    conn.send_result.assert_called_once()
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    task = entry.data[CONF_TASKS][TASK_ID_1]
    assert task["name"] == "New Name"
    assert task["warning_days"] == 14
    assert task["enabled"] is False
    assert task["notes"] == "Updated notes"


async def test_ws_update_task_with_trigger(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test updating task with valid trigger config."""
    await setup_integration(hass, global_entry, object_entry)
    hass.states.async_set("sensor.test_temp", "22.0")
    conn = _mock_connection()

    await ws_update_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/update",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "trigger_config": {
            "type": "threshold",
            "entity_id": "sensor.test_temp",
            "trigger_above": 30.0,
        },
    })

    conn.send_result.assert_called_once()


async def test_ws_update_task_invalid_trigger(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test updating task with invalid trigger config."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_update_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/update",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "trigger_config": {"type": "threshold"},
    })

    conn.send_error.assert_called_once()


async def test_ws_update_task_not_found_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test updating task on non-existent entry."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_update_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/update",
        "entry_id": "nonexistent",
        "task_id": TASK_ID_1,
    })

    conn.send_error.assert_called_once()


async def test_ws_update_task_not_found_task(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test updating non-existent task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_update_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/update",
        "entry_id": object_entry.entry_id,
        "task_id": "nonexistent_task_id",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


# ─── Task Delete Tests ───────────────────────────────────────────────────


async def test_ws_delete_task_basic(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test deleting a task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_delete_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/delete",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is True


async def test_ws_delete_task_not_found_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test deleting task on non-existent entry."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_delete_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/delete",
        "entry_id": "nonexistent",
        "task_id": TASK_ID_1,
    })

    conn.send_error.assert_called_once()


async def test_ws_delete_task_not_found_task(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test deleting non-existent task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_delete_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/delete",
        "entry_id": object_entry.entry_id,
        "task_id": "nonexistent_task_id",
    })

    conn.send_error.assert_called_once()


async def test_ws_delete_task_cleans_entity_registry(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test that deleting a task removes its entity registry entries."""
    await setup_integration(hass, global_entry, object_entry)

    # Verify entities exist before deletion
    ent_reg = er.async_get(hass)
    entities_before = er.async_entries_for_config_entry(ent_reg, object_entry.entry_id)
    task_entities = [e for e in entities_before if TASK_ID_1 in (e.unique_id or "")]
    assert len(task_entities) >= 1, "Expected at least sensor + binary_sensor entities"

    conn = _mock_connection()
    await ws_delete_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/delete",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
    })
    await hass.async_block_till_done()

    conn.send_result.assert_called_once()

    # Verify entity registry entries for the deleted task are gone
    entities_after = er.async_entries_for_config_entry(ent_reg, object_entry.entry_id)
    orphans = [e for e in entities_after if TASK_ID_1 in (e.unique_id or "")]
    assert len(orphans) == 0, f"Found orphaned entities: {[e.entity_id for e in orphans]}"


async def test_ws_delete_task_cleans_group_refs(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test that deleting a task removes its references from groups."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    # Create a group referencing the task we'll delete
    await ws_create_group.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 10, "type": "maintenance_supporter/group/create",
        "name": "Test Group",
        "task_refs": [
            {"entry_id": object_entry.entry_id, "task_id": TASK_ID_1},
        ],
    })
    group_id = conn.send_result.call_args[0][1]["group_id"]
    conn.reset_mock()

    # Delete the task
    await ws_delete_task.__wrapped__.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 11, "type": "maintenance_supporter/task/delete",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
    })
    conn.send_result.assert_called_once()

    # Verify group no longer references the deleted task
    ge = hass.config_entries.async_get_entry(global_entry.entry_id)
    assert ge is not None
    refs = ge.options["groups"][group_id]["task_refs"]
    assert len(refs) == 0


# ─── Task List Tests ─────────────────────────────────────────────────────


async def test_ws_list_tasks_all(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test listing all tasks."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    ws_list_tasks(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/list",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "tasks" in result
    assert len(result["tasks"]) >= 1
    assert result["tasks"][0]["task_id"] == TASK_ID_1


async def test_ws_list_tasks_filtered(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test listing tasks filtered by entry_id."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    ws_list_tasks(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/list",
        "entry_id": object_entry.entry_id,
    })

    result = conn.send_result.call_args[0][1]
    assert len(result["tasks"]) == 1
    assert result["tasks"][0]["entry_id"] == object_entry.entry_id


async def test_ws_list_tasks_empty(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test listing tasks when none exist."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    ws_list_tasks(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/list",
    })

    result = conn.send_result.call_args[0][1]
    assert result["tasks"] == []


# ─── Task Complete Tests ──────────────────────────────────────────────────


async def test_ws_complete_task_basic(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test completing a task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_complete_task.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/complete",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
    })

    conn.send_result.assert_called_once()
    assert conn.send_result.call_args[0][1]["success"] is True


async def test_ws_complete_task_with_fields(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test completing a task with optional fields."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_complete_task.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/complete",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "notes": "All good",
        "cost": 25.50,
        "duration": 30,
        "feedback": "needed",
    })

    conn.send_result.assert_called_once()


async def test_ws_complete_task_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test completing task when coordinator not found."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_complete_task.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/complete",
        "entry_id": "nonexistent",
        "task_id": TASK_ID_1,
    })

    conn.send_error.assert_called_once()


# ─── Task Skip Tests ─────────────────────────────────────────────────────


async def test_ws_skip_task_basic(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test skipping a task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_skip_task.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/skip",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
    })

    conn.send_result.assert_called_once()
    assert conn.send_result.call_args[0][1]["success"] is True


async def test_ws_skip_task_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test skipping task when coordinator not found."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_skip_task.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/skip",
        "entry_id": "nonexistent",
        "task_id": TASK_ID_1,
    })

    conn.send_error.assert_called_once()


# ─── Task Reset Tests ────────────────────────────────────────────────────


async def test_ws_reset_task_basic(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test resetting a task without date."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_reset_task.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/reset",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
    })

    conn.send_result.assert_called_once()
    assert conn.send_result.call_args[0][1]["success"] is True


async def test_ws_reset_task_with_date(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test resetting a task with specific date."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_reset_task.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/reset",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "date": "2024-06-15",
    })

    conn.send_result.assert_called_once()


async def test_ws_reset_task_invalid_date(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test resetting a task with invalid date."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await ws_reset_task.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/reset",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "date": "not-a-date",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_date"


async def test_ws_reset_task_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test resetting task when coordinator not found."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await ws_reset_task.__wrapped__(hass, conn, {  # type: ignore[attr-defined]
        "id": 1, "type": "maintenance_supporter/task/reset",
        "entry_id": "nonexistent",
        "task_id": TASK_ID_1,
    })

    conn.send_error.assert_called_once()


# ─── Trigger Validation Unit Tests ───────────────────────────────────────


def test_validate_compound_valid(hass: HomeAssistant) -> None:
    """Test valid compound trigger with 2 conditions."""
    hass.states.async_set("sensor.temp1", "25.0")
    hass.states.async_set("sensor.temp2", "30.0")

    config = {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": [
            {"type": "threshold", "entity_id": "sensor.temp1", "trigger_above": 30},
            {"type": "threshold", "entity_id": "sensor.temp2", "trigger_below": 10},
        ],
    }
    errors, warnings = _validate_compound_trigger(hass, config)
    assert errors == []


def test_validate_compound_nested_rejected(hass: HomeAssistant) -> None:
    """Test that nested compound triggers are rejected."""
    config = {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": [
            {"type": "threshold", "entity_id": "sensor.a", "trigger_above": 10},
            {"type": "compound", "conditions": []},
        ],
    }
    errors, warnings = _validate_compound_trigger(hass, config)
    assert any("nested compound" in e for e in errors)


def test_validate_runtime_on_states(hass: HomeAssistant) -> None:
    """Test that trigger_on_states list is validated."""
    hass.states.async_set("sensor.pump", "on")

    config = {
        "type": "runtime",
        "entity_id": "sensor.pump",
        "trigger_runtime_hours": 100,
        "trigger_on_states": ["on", "running"],
    }
    errors, _ = _validate_trigger_config(hass, config)
    assert errors == []


def test_validate_entity_logic_invalid(hass: HomeAssistant) -> None:
    """Test that invalid entity_logic is rejected."""
    hass.states.async_set("sensor.temp", "25.0")

    config = {
        "type": "threshold",
        "entity_id": "sensor.temp",
        "trigger_above": 30,
        "entity_logic": "invalid",
    }
    errors, _ = _validate_trigger_config(hass, config)
    assert any("entity_logic" in e for e in errors)


def test_validate_runtime_empty_on_states(hass: HomeAssistant) -> None:
    """Test that empty trigger_on_states is rejected."""
    hass.states.async_set("sensor.pump", "on")

    config = {
        "type": "runtime",
        "entity_id": "sensor.pump",
        "trigger_runtime_hours": 100,
        "trigger_on_states": [],
    }
    errors, _ = _validate_trigger_config(hass, config)
    assert any("must not be empty" in e for e in errors)


def test_validate_runtime_invalid_on_states(hass: HomeAssistant) -> None:
    """Test that non-string trigger_on_states is rejected."""
    hass.states.async_set("sensor.pump", "on")

    config = {
        "type": "runtime",
        "entity_id": "sensor.pump",
        "trigger_runtime_hours": 100,
        "trigger_on_states": [123, ""],
    }
    errors, _ = _validate_trigger_config(hass, config)
    assert any("non-empty strings" in e for e in errors)


def test_validate_invalid_trigger_type(hass: HomeAssistant) -> None:
    """Test that invalid trigger type is rejected."""
    config = {"type": "nonexistent_type", "entity_id": "sensor.temp"}
    errors, _ = _validate_trigger_config(hass, config)
    assert any("Invalid trigger type" in e for e in errors)


def test_validate_counter_missing_target(hass: HomeAssistant) -> None:
    """Test that counter without target_value is rejected."""
    hass.states.async_set("sensor.counter", "5")

    config = {"type": "counter", "entity_id": "sensor.counter"}
    errors, _ = _validate_trigger_config(hass, config)
    assert any("trigger_target_value" in e for e in errors)


def test_validate_threshold_missing_above_below(hass: HomeAssistant) -> None:
    """Test threshold without above or below is rejected."""
    hass.states.async_set("sensor.temp", "25.0")

    config = {"type": "threshold", "entity_id": "sensor.temp"}
    errors, _ = _validate_trigger_config(hass, config)
    assert any("trigger_above" in e for e in errors)
