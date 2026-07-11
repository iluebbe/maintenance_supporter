"""Regression: WS handlers must not write back task-map snapshots taken
before an await (bug audit 2026-07-11).

The dangerous shape — snapshot ``CONF_TASKS`` → ``await`` → write the whole
map — silently reverts any concurrent writer that landed during the await
(the same lost-update class as the store-migration race). Both tests inject
a concurrent single-task write INTO the handler's own await and assert it
survives; A/B-proven to fail on the pre-fix handlers.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)

TASK_ID_2 = "task-2-concurrent"


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


def _two_task_entry(hass: HomeAssistant, *, archive_first: bool = False) -> MockConfigEntry:
    t1 = build_task_data(name="Target task")
    if archive_first:
        t1["archived_at"] = "2026-06-01T00:00:00+00:00"
    t2 = build_task_data(name="Bystander task", task_id=TASK_ID_2)
    t2["id"] = TASK_ID_2
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Race Rig",
        data=build_object_entry_data(
            object_data=build_object_data(name="Race Rig"),
            tasks={TASK_ID_1: t1, TASK_ID_2: t2},
        ),
        source="user",
        unique_id="maintenance_supporter_race_rig",
    )
    entry.add_to_hass(hass)
    return entry


def _concurrent_task_write(hass: HomeAssistant, entry: MockConfigEntry, task_id: str, field: str, value: Any) -> None:
    """What any well-behaved concurrent writer does: fresh read, patch one key."""
    new_data = dict(entry.data)
    tasks = dict(new_data.get(CONF_TASKS, {}))
    td = dict(tasks[task_id])
    td[field] = value
    tasks[task_id] = td
    new_data[CONF_TASKS] = tasks
    hass.config_entries.async_update_entry(entry, data=new_data)


async def test_assign_user_survives_concurrent_write(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """A write landing during ws_assign_user's auth lookup must survive."""
    from custom_components.maintenance_supporter.websocket.users import ws_assign_user

    entry = _two_task_entry(hass)
    await setup_integration(hass, global_entry, entry)
    entry = hass.config_entries.async_get_entry(entry.entry_id)

    async def racing_get_user(user_id: str) -> MagicMock:
        # Another handler finishes while we look the user up.
        current = hass.config_entries.async_get_entry(entry.entry_id)
        _concurrent_task_write(hass, current, TASK_ID_2, "notes", "written mid-await")
        return MagicMock()  # user exists

    conn = make_ws_connection()
    with patch.object(hass.auth, "async_get_user", side_effect=racing_get_user):
        await call_ws_handler(
            ws_assign_user,
            hass,
            conn,
            {
                "id": 1,
                "type": "maintenance_supporter/task/assign_user",
                "entry_id": entry.entry_id,
                "task_id": TASK_ID_1,
                "user_id": "user-abc",
            },
        )
    assert not conn.send_error.called, conn.send_error.call_args

    after = hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS]
    assert after[TASK_ID_1]["responsible_user_id"] == "user-abc", "assignment itself lost"
    assert after[TASK_ID_2].get("notes") == "written mid-await", (
        "concurrent write reverted — stale task-map snapshot written back"
    )


async def test_unarchive_survives_concurrent_write(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """A write landing during ws_unarchive_task's store flush must survive."""
    from custom_components.maintenance_supporter.websocket.tasks_lifecycle import ws_unarchive_task

    entry = _two_task_entry(hass, archive_first=True)
    await setup_integration(hass, global_entry, entry)
    entry = hass.config_entries.async_get_entry(entry.entry_id)

    store = entry.runtime_data.store
    real_save = store.async_save

    async def racing_save() -> None:
        current = hass.config_entries.async_get_entry(entry.entry_id)
        _concurrent_task_write(hass, current, TASK_ID_2, "notes", "written mid-await")
        await real_save()

    conn = make_ws_connection()
    with patch.object(store, "async_save", side_effect=racing_save):
        await call_ws_handler(
            ws_unarchive_task,
            hass,
            conn,
            {
                "id": 1,
                "type": "maintenance_supporter/task/unarchive",
                "entry_id": entry.entry_id,
                "task_id": TASK_ID_1,
            },
        )
    assert not conn.send_error.called, conn.send_error.call_args
    await hass.async_block_till_done()

    after = hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS]
    assert after[TASK_ID_1].get("archived_at") is None, "unarchive itself lost"
    assert after[TASK_ID_2].get("notes") == "written mid-await", (
        "concurrent write reverted — stale task-map snapshot written back"
    )
