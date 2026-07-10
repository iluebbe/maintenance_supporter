"""Journey: whose turn is it? (C5 rotation-advance persistence blind spot).

A shared chore rotates through the household: an assignee_pool of three users
with round_robin. Each completion must advance the responsible user to the next
pool member AND persist that pointer — the "rotation never persisted since
2.17" bug was exactly a rotated pointer that evaporated on the next reload, so
the chore silently stuck on one person. This walks several completions with a
restart mid-cycle and asserts the pointer both advances and survives.

See docs/design/user-journeys.md (C5 re-assign user / change rotation pool).
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
from freezegun import freeze_time
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.websocket.objects import ws_get_objects
from custom_components.maintenance_supporter.websocket.tasks import ws_complete_task

from .conftest import (
    make_ws_connection as _conn,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)
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




async def _responsible(hass: HomeAssistant, entry_id: str) -> str | None:
    conn = _conn()
    await call_ws_handler(ws_get_objects, hass, conn, {"id": 1, "type": "maintenance_supporter/objects"})
    payload = conn.send_result.call_args.args[1]
    for obj in payload["objects"]:
        if obj["entry_id"] == entry_id:
            for task in obj["tasks"]:
                if task["id"] == TASK_ID_1:
                    return task.get("responsible_user_id")
    raise AssertionError("task not found")


async def _complete(hass: HomeAssistant, entry_id: str) -> None:
    await call_ws_handler(
        ws_complete_task,
        hass,
        _conn(),
        {"id": 1, "type": "maintenance_supporter/task/complete", "entry_id": entry_id, "task_id": TASK_ID_1},
    )
    await hass.async_block_till_done()


async def test_round_robin_pointer_advances_and_survives_restart(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    a = await hass.auth.async_create_user("Alice")
    b = await hass.auth.async_create_user("Bob")
    c = await hass.auth.async_create_user("Cara")
    pool = [a.id, b.id, c.id]

    task: dict[str, Any] = build_task_data(interval_days=30, last_performed="2026-03-01")
    task["assignee_pool"] = pool
    task["rotation_strategy"] = "round_robin"
    task["responsible_user_id"] = a.id

    obj = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Kitchen Bin",
        data=build_object_entry_data(
            object_data=build_object_data(name="Kitchen Bin", object_id="objid_bin"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_kitchen_bin",
    )
    obj.add_to_hass(hass)
    with freeze_time("2026-03-10 09:00:00"):
        await setup_integration(hass, global_entry, obj)
        assert await _responsible(hass, obj.entry_id) == a.id, "starts with Alice"

    # round_robin advances by pool index: a → b → c → a. Completions are spaced
    # days apart so the 30 s double-tap dedup window never collapses two of them.
    # First completion → Bob.
    with freeze_time("2026-03-11 09:00:00"):
        await _complete(hass, obj.entry_id)
    assert await _responsible(hass, obj.entry_id) == b.id, "first completion must advance to Bob"

    # Restart BEFORE the next completion: the advanced pointer must persist
    # (this is the exact "rotation evaporates on reload" regression).
    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    assert await _responsible(hass, obj.entry_id) == b.id, "advanced pointer lost across restart"

    # Second completion → Cara.
    with freeze_time("2026-03-12 09:00:00"):
        await _complete(hass, obj.entry_id)
    assert await _responsible(hass, obj.entry_id) == c.id, "second completion must advance to Cara"

    # Third completion → wraps back to Alice.
    with freeze_time("2026-03-13 09:00:00"):
        await _complete(hass, obj.entry_id)
    assert await _responsible(hass, obj.entry_id) == a.id, "round_robin must wrap back to Alice"

    # And the wrap survives a restart too.
    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    assert await _responsible(hass, obj.entry_id) == a.id, "wrapped pointer lost across restart"
