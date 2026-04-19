"""Integration tests: concurrent operations and race conditions."""

from __future__ import annotations

from datetime import timedelta
from unittest.mock import MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.objects import (
    ws_create_object,
    ws_delete_object,
)
from custom_components.maintenance_supporter.websocket.tasks import (
    ws_complete_task,
)

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    get_task_store_state,
    setup_integration,
)

TASK_ID_3 = "d" * 32


# ─── Helpers ──────────────────────────────────────────────────────────────


def _mock_connection() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


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


# ─── Tests ────────────────────────────────────────────────────────────────


async def test_complete_during_coordinator_refresh(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Complete task while coordinator refresh is happening → both succeed."""
    now = dt_util.now().date()
    task = build_task_data(
        last_performed=(now - timedelta(days=40)).isoformat(),
        interval_days=30,
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Concurrent Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Concurrent Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_concurrent",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    store = entry.runtime_data.store

    async def _immediate_save() -> None:
        await store.async_save()

    # Start a refresh and complete task concurrently
    with patch.object(store, "async_delay_save", side_effect=lambda: hass.async_create_task(_immediate_save())):
        refresh_task = hass.async_create_task(coordinator.async_refresh())

        conn = _mock_connection()
        await call_ws_handler(ws_complete_task, hass, conn, {
            "id": 1, "type": "maintenance_supporter/task/complete",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
        })

        await refresh_task

    await hass.async_block_till_done()
    conn.send_result.assert_called_once()

    # Verify the completion stuck
    state = get_task_store_state(hass, obj_entry.entry_id, TASK_ID_1)
    assert state.get("last_performed") == now.isoformat()


async def test_multiple_task_completions_same_object(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Complete 3 tasks in rapid succession → all get correct state."""
    now = dt_util.now().date()
    tasks = {
        TASK_ID_1: build_task_data(
            task_id=TASK_ID_1, name="Task A",
            last_performed=(now - timedelta(days=40)).isoformat(),
            interval_days=30,
        ),
        TASK_ID_2: build_task_data(
            task_id=TASK_ID_2, name="Task B",
            last_performed=(now - timedelta(days=50)).isoformat(),
            interval_days=30,
        ),
        TASK_ID_3: build_task_data(
            task_id=TASK_ID_3, name="Task C",
            last_performed=(now - timedelta(days=60)).isoformat(),
            interval_days=30,
        ),
    }
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Multi Task",
        data=build_object_entry_data(
            object_data=build_object_data(name="Multi Task"),
            tasks=tasks,
        ),
        source="user",
        unique_id="maintenance_supporter_multi_task",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    store = entry.runtime_data.store

    async def _immediate_save() -> None:
        await store.async_save()

    # Complete all 3 tasks rapidly
    with patch.object(store, "async_delay_save", side_effect=lambda: hass.async_create_task(_immediate_save())):
        for tid, idx in [(TASK_ID_1, 1), (TASK_ID_2, 2), (TASK_ID_3, 3)]:
            conn = _mock_connection()
            await call_ws_handler(ws_complete_task, hass, conn, {
                "id": idx, "type": "maintenance_supporter/task/complete",
                "entry_id": obj_entry.entry_id,
                "task_id": tid,
                "notes": f"Completed task {idx}",
            })
            conn.send_result.assert_called_once()

    await hass.async_block_till_done()

    # Verify all 3 have correct last_performed
    today = dt_util.now().date().isoformat()
    for tid in [TASK_ID_1, TASK_ID_2, TASK_ID_3]:
        state = get_task_store_state(hass, obj_entry.entry_id, tid)
        assert state.get("last_performed") == today, f"Task {tid} not completed"
        assert len(state.get("history", [])) >= 1, f"Task {tid} missing history"


async def test_store_delay_save_coalescing(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Multiple store writes within debounce window → verify no crash."""
    now = dt_util.now().date()
    tasks = {
        TASK_ID_1: build_task_data(
            task_id=TASK_ID_1, name="Task A",
            last_performed=(now - timedelta(days=40)).isoformat(),
            interval_days=30,
        ),
        TASK_ID_2: build_task_data(
            task_id=TASK_ID_2, name="Task B",
            last_performed=(now - timedelta(days=50)).isoformat(),
            interval_days=30,
        ),
    }
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Coalesce Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Coalesce Test"),
            tasks=tasks,
        ),
        source="user",
        unique_id="maintenance_supporter_coalesce",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    store = entry.runtime_data.store

    # Use real delay_save (don't patch) — just verify no crash
    conn1 = _mock_connection()
    await call_ws_handler(ws_complete_task, hass, conn1, {
        "id": 1, "type": "maintenance_supporter/task/complete",
        "entry_id": obj_entry.entry_id,
        "task_id": TASK_ID_1,
    })
    conn2 = _mock_connection()
    await call_ws_handler(ws_complete_task, hass, conn2, {
        "id": 2, "type": "maintenance_supporter/task/complete",
        "entry_id": obj_entry.entry_id,
        "task_id": TASK_ID_2,
    })
    await hass.async_block_till_done()

    conn1.send_result.assert_called_once()
    conn2.send_result.assert_called_once()


async def test_create_delete_object_rapid(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Create object → delete immediately → no orphans."""
    await setup_integration(hass, global_entry)

    # Create
    conn1 = _mock_connection()
    await call_ws_handler(ws_create_object, hass, conn1, {
        "id": 1, "type": "maintenance_supporter/object/create",
        "name": "Ephemeral",
    })
    conn1.send_result.assert_called_once()
    entry_id = conn1.send_result.call_args[0][1]["entry_id"]
    await hass.async_block_till_done()

    # Delete immediately
    conn2 = _mock_connection()
    await call_ws_handler(ws_delete_object, hass, conn2, {
        "id": 2, "type": "maintenance_supporter/object/delete",
        "entry_id": entry_id,
    })
    conn2.send_result.assert_called_once()
    await hass.async_block_till_done()

    # Verify entry is gone
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is None
