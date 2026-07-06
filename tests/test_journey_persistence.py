"""Journey I1: entry.data ↔ Store divergence after a crash.

See docs/design/user-journeys.md — task data is split across two writes
(static config in entry.data, dynamic state in the Store). A crash between
them must degrade gracefully in BOTH directions:

* store state lost for an existing task → first-cycle semantics, no crash;
* store state orphaned by a lost deletion → pruned at the next boot.
"""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.websocket.tasks_actions import (
    ws_complete_task,
)

from .conftest import build_global_entry_data, call_ws_handler, setup_integration
from .journey import simulate_restart


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


def _conn() -> MagicMock:
    conn = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


async def _make(hass: HomeAssistant) -> tuple[str, str]:
    obj = await hass.services.async_call(
        DOMAIN,
        "add_object",
        {"name": "Freezer"},
        blocking=True,
        return_response=True,
    )
    await hass.async_block_till_done()
    entry_id = obj["entry_id"]
    res = await hass.services.async_call(
        DOMAIN,
        "add_task",
        {"entry_id": entry_id, "name": "Defrost", "interval_days": 180},
        blocking=True,
        return_response=True,
    )
    await hass.async_block_till_done()
    return entry_id, res["task_id"]


async def test_lost_store_write_degrades_to_first_cycle(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Crash direction 1: entry.data has the task, its store state is gone."""
    await setup_integration(hass, global_entry)
    entry_id, task_id = await _make(hass)

    await call_ws_handler(
        ws_complete_task,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/task/complete",
            "entry_id": entry_id,
            "task_id": task_id,
        },
    )
    await hass.async_block_till_done()

    # Simulate the store write that never made it to disk.
    entry = hass.config_entries.async_get_entry(entry_id)
    entry.runtime_data.store.remove_task(task_id)
    await entry.runtime_data.store.async_save()

    await simulate_restart(hass, global_entry, entry)

    # The task is alive and computable — history/last_performed are gone
    # (that's the data the crash ate), but nothing errors and the status is
    # the sane first-cycle one.
    listed = await hass.services.async_call(
        DOMAIN,
        "list_tasks",
        {"entry_id": entry_id},
        blocking=True,
        return_response=True,
    )
    assert listed["count"] == 1
    row = listed["tasks"][0]
    assert row["task_id"] == task_id
    assert row["status"] in ("ok", "due_soon")
    assert row["next_due"] is not None


async def test_orphaned_store_state_is_pruned_at_boot(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Crash direction 2: deletion reached entry.data, not the store."""
    await setup_integration(hass, global_entry)
    entry_id, task_id = await _make(hass)

    entry = hass.config_entries.async_get_entry(entry_id)
    store = entry.runtime_data.store
    # A ghost of a deleted task, exactly as a crashed deletion leaves it.
    store.init_task("dead-task-id", last_performed="2020-01-01")
    store.set_history("dead-task-id", [{"timestamp": "2020-01-01T10:00:00", "type": "completed"}])
    await store.async_save()

    await simulate_restart(hass, global_entry, entry)

    entry = hass.config_entries.async_get_entry(entry_id)
    store = entry.runtime_data.store
    assert store.get_task_state("dead-task-id") == {}, "orphan survived the boot"
    # The living task's state is untouched.
    assert task_id in entry.data["tasks"]
