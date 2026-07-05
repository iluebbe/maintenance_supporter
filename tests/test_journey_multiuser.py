"""Journey G2: a household member's HA account is deleted.

See docs/design/user-journeys.md — assignments must not keep pointing at
ghosts: the responsible pointer moves to the surviving pool (or clears), the
deleted member leaves every assignee pool, and a pool that shrinks below two
members dissolves its rotation. The sweep runs at (re)start, so the journey
crosses the persistence boundary like the real event would.
"""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry, MockUser

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.tasks_actions import (
    ws_complete_task,
)
from custom_components.maintenance_supporter.websocket.tasks_crud import (
    ws_update_task,
)

from .conftest import build_global_entry_data, call_ws_handler, setup_integration
from .journey import simulate_restart


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


def _conn() -> MagicMock:
    conn = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


async def test_deleted_pool_member_leaves_rotation_cleanly(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    anna = MockUser(id="anna-uid", name="Anna").add_to_hass(hass)
    ben = MockUser(id="ben-uid", name="Ben").add_to_hass(hass)
    carl = MockUser(id="carl-uid", name="Carl").add_to_hass(hass)
    assert anna and carl  # keep references; Ben is the one who leaves

    await setup_integration(hass, global_entry)

    obj = await hass.services.async_call(
        DOMAIN, "add_object", {"name": "Lawn"},
        blocking=True, return_response=True,
    )
    await hass.async_block_till_done()
    entry_id = obj["entry_id"]
    res = await hass.services.async_call(
        DOMAIN, "add_task",
        {"entry_id": entry_id, "name": "Mow", "interval_days": 7},
        blocking=True, return_response=True,
    )
    await hass.async_block_till_done()
    task_id = res["task_id"]

    # A shared task rotating between three household members, Ben's turn.
    await call_ws_handler(ws_update_task, hass, _conn(), {
        "id": 1, "type": "maintenance_supporter/task/update",
        "entry_id": entry_id, "task_id": task_id,
        "responsible_user_id": "ben-uid",
        "assignee_pool": ["anna-uid", "ben-uid", "carl-uid"],
        "rotation_strategy": "round_robin",
    })
    await hass.async_block_till_done()

    # Ben moves out — his HA account is deleted.
    await hass.auth.async_remove_user(ben)
    await hass.async_block_till_done()

    # The next restart runs the orphan sweep.
    entry = hass.config_entries.async_get_entry(entry_id)
    await simulate_restart(hass, global_entry, entry)

    task = hass.config_entries.async_get_entry(entry_id).data[CONF_TASKS][task_id]
    assert task["assignee_pool"] == ["anna-uid", "carl-uid"]
    assert task["rotation_strategy"] == "round_robin"  # 2 members remain
    # Responsibility was handed to the surviving pool, not left on the ghost.
    assert task["responsible_user_id"] == "anna-uid"

    # Rotation keeps working among the survivors: complete → advances.
    await call_ws_handler(ws_complete_task, hass, _conn(), {
        "id": 2, "type": "maintenance_supporter/task/complete",
        "entry_id": entry_id, "task_id": task_id,
    })
    await hass.async_block_till_done()
    task = hass.config_entries.async_get_entry(entry_id).data[CONF_TASKS][task_id]
    assert task["responsible_user_id"] == "carl-uid"
    assert "ben-uid" not in task["assignee_pool"]


async def test_pool_shrinking_below_two_dissolves_rotation(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    anna = MockUser(id="anna2-uid", name="Anna").add_to_hass(hass)
    ben = MockUser(id="ben2-uid", name="Ben").add_to_hass(hass)
    assert anna

    await setup_integration(hass, global_entry)

    obj = await hass.services.async_call(
        DOMAIN, "add_object", {"name": "Kitchen"},
        blocking=True, return_response=True,
    )
    await hass.async_block_till_done()
    entry_id = obj["entry_id"]
    res = await hass.services.async_call(
        DOMAIN, "add_task",
        {"entry_id": entry_id, "name": "Deep clean", "interval_days": 30},
        blocking=True, return_response=True,
    )
    await hass.async_block_till_done()
    task_id = res["task_id"]

    await call_ws_handler(ws_update_task, hass, _conn(), {
        "id": 1, "type": "maintenance_supporter/task/update",
        "entry_id": entry_id, "task_id": task_id,
        "responsible_user_id": "ben2-uid",
        "assignee_pool": ["anna2-uid", "ben2-uid"],
        "rotation_strategy": "least_completed",
    })
    await hass.async_block_till_done()

    await hass.auth.async_remove_user(ben)
    await hass.async_block_till_done()

    entry = hass.config_entries.async_get_entry(entry_id)
    await simulate_restart(hass, global_entry, entry)

    task = hass.config_entries.async_get_entry(entry_id).data[CONF_TASKS][task_id]
    # One member is no rotation: pool + strategy dissolve, pointer clears.
    assert "assignee_pool" not in task
    assert "rotation_strategy" not in task
    assert "responsible_user_id" not in task
