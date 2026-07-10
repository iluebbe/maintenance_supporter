"""Journey E (retirement): archive → restart → unarchive → delete → no orphans.

See docs/design/user-journeys.md — retiring equipment must stay inert across
restarts while archived, come back cleanly, and leave NOTHING behind
(entities, devices, task refs) once deleted.
"""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.websocket.objects import (
    ws_delete_object,
)
from custom_components.maintenance_supporter.websocket.tasks_lifecycle import (
    ws_archive_task,
    ws_unarchive_task,
)

from .conftest import make_ws_connection as _conn, build_global_entry_data, call_ws_handler, setup_integration
from .journey import (
    assert_entry_fully_gone,
    assert_no_orphans,
    registry_snapshot,
    simulate_restart,
)


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




async def _status(hass: HomeAssistant, entry_id: str, task_id: str) -> str:
    listed = await hass.services.async_call(
        DOMAIN,
        "list_tasks",
        {"entry_id": entry_id},
        blocking=True,
        return_response=True,
    )
    for row in listed["tasks"]:
        if row["task_id"] == task_id:
            return str(row["status"])
    return "archived"  # list_tasks hides archived tasks by design


async def test_old_appliance_is_retired_and_finally_deleted(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)

    obj = await hass.services.async_call(
        DOMAIN,
        "add_object",
        {"name": "Old Dryer"},
        blocking=True,
        return_response=True,
    )
    await hass.async_block_till_done()
    entry_id = obj["entry_id"]
    keep = await hass.services.async_call(
        DOMAIN,
        "add_task",
        {"entry_id": entry_id, "name": "Lint filter", "interval_days": 14},
        blocking=True,
        return_response=True,
    )
    await hass.async_block_till_done()
    scrap = await hass.services.async_call(
        DOMAIN,
        "add_task",
        {"entry_id": entry_id, "name": "Belt check", "interval_days": 180},
        blocking=True,
        return_response=True,
    )
    await hass.async_block_till_done()
    keep_id, scrap_id = keep["task_id"], scrap["task_id"]

    entry = hass.config_entries.async_get_entry(entry_id)
    baseline = registry_snapshot(hass, entry)

    # ── Archive one task; it must stay inert ACROSS a restart ─────────────
    await call_ws_handler(
        ws_archive_task,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/task/archive",
            "entry_id": entry_id,
            "task_id": scrap_id,
        },
    )
    await hass.async_block_till_done()
    await simulate_restart(hass, global_entry, entry)

    assert await _status(hass, entry_id, scrap_id) == "archived"
    assert await _status(hass, entry_id, keep_id) == "ok"
    # Archived ≠ deleted: entities keep existing (identity invariant).
    entry = hass.config_entries.async_get_entry(entry_id)
    assert registry_snapshot(hass, entry) == baseline

    # ── Change of plans: unarchive re-arms a fresh cycle ───────────────────
    await call_ws_handler(
        ws_unarchive_task,
        hass,
        _conn(),
        {
            "id": 2,
            "type": "maintenance_supporter/task/unarchive",
            "entry_id": entry_id,
            "task_id": scrap_id,
        },
    )
    await hass.async_block_till_done()
    assert await _status(hass, entry_id, scrap_id) == "ok"

    # ── The dryer dies: delete one task, then the whole object ─────────────
    await hass.services.async_call(
        DOMAIN,
        "delete_task",
        {"entry_id": entry_id, "task_id": scrap_id},
        blocking=True,
    )
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry_id)
    assert_no_orphans(hass, entry, deleted_task_ids=(scrap_id,))

    await call_ws_handler(
        ws_delete_object,
        hass,
        _conn(),
        {
            "id": 3,
            "type": "maintenance_supporter/object/delete",
            "entry_id": entry_id,
        },
    )
    await hass.async_block_till_done()
    assert_entry_fully_gone(hass, entry_id)

    # And a restart of what's left must not resurrect anything.
    await simulate_restart(hass, global_entry)
    assert_entry_fully_gone(hass, entry_id)
