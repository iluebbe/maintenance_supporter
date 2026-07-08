"""Journey: the group that outlives its members (E3/E4 group-ref blind spot).

Groups reference tasks by ``(entry_id, task_id)`` and each task's group
membership is *derived* from those refs. The no-orphan invariant the
per-command tests don't walk as a story: when a grouped task — or its whole
object — is deleted, the group's stale ref must be pruned, not left dangling
to point at nothing. A dangling ref means a ghost member forever and a wrong
derived membership on reload. This groups two tasks, deletes one task then the
other object, and asserts the refs are cleaned and stay clean across restart.

See docs/design/user-journeys.md (E3 delete task, E4 delete object: group refs
gone).
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.websocket.groups import ws_create_group, ws_get_groups
from custom_components.maintenance_supporter.websocket.objects import ws_delete_object
from custom_components.maintenance_supporter.websocket.tasks import ws_delete_task

from .conftest import (
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)
from .journey import simulate_restart

# Distinct task ids per object — production task ids are unique uuid4s, and the
# group-ref cleanup prunes by task_id, so a shared id would cross-prune.
_TA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
_TB = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"


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


def _object(hass: HomeAssistant, unique: str, name: str, task_id: str) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title=name,
        data=build_object_entry_data(
            object_data=build_object_data(name=name, object_id=f"objid_{unique}"),
            tasks={task_id: build_task_data(task_id=task_id, name=f"{name} task", interval_days=30)},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique}",
    )
    entry.add_to_hass(hass)
    return entry


async def _group_refs(hass: HomeAssistant, group_id: str) -> list[tuple[str, str]]:
    conn = _conn()
    await call_ws_handler(ws_get_groups, hass, conn, {"id": 1, "type": "maintenance_supporter/group/get"})
    groups = conn.send_result.call_args.args[1]["groups"]
    refs = groups.get(group_id, {}).get("task_refs", [])
    return [(r["entry_id"], r["task_id"]) for r in refs]


async def test_deleting_a_grouped_task_and_object_prunes_the_group_refs(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    a = _object(hass, "spring_a", "Windows", _TA)
    b = _object(hass, "spring_b", "Gutters", _TB)
    await setup_integration(hass, global_entry, a, b)

    # Group both chores under "Spring cleaning".
    conn = _conn()
    await call_ws_handler(
        ws_create_group,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/group/create",
            "name": "Spring cleaning",
            "task_refs": [
                {"entry_id": a.entry_id, "task_id": _TA},
                {"entry_id": b.entry_id, "task_id": _TB},
            ],
        },
    )
    gid = conn.send_result.call_args.args[1]["group_id"]

    assert set(await _group_refs(hass, gid)) == {(a.entry_id, _TA), (b.entry_id, _TB)}

    # Delete the task in object A → its ref must be pruned; B's ref stays.
    await call_ws_handler(
        ws_delete_task,
        hass,
        _conn(),
        {"id": 1, "type": "maintenance_supporter/task/delete", "entry_id": a.entry_id, "task_id": _TA},
    )
    await hass.async_block_till_done()

    assert set(await _group_refs(hass, gid)) == {(b.entry_id, _TB)}, "A's stale ref not pruned on task delete"

    # The pruning persists across a restart (no dangling ref reappears).
    await simulate_restart(hass, global_entry, b)
    assert set(await _group_refs(hass, gid)) == {(b.entry_id, _TB)}, "pruned ref resurrected after restart"

    # Delete the whole object B → all its refs pruned; the group survives, empty.
    await call_ws_handler(
        ws_delete_object,
        hass,
        _conn(),
        {"id": 1, "type": "maintenance_supporter/object/delete", "entry_id": b.entry_id},
    )
    await hass.async_block_till_done()

    assert await _group_refs(hass, gid) == [], "B's ref not pruned on object delete"

    # And still empty after a restart — the group is a valid, member-less group.
    await simulate_restart(hass, global_entry)
    conn = _conn()
    await call_ws_handler(ws_get_groups, hass, conn, {"id": 1, "type": "maintenance_supporter/group/get"})
    groups = conn.send_result.call_args.args[1]["groups"]
    assert gid in groups, "the group itself must survive (only its dead refs are pruned)"
    assert groups[gid].get("task_refs", []) == []
