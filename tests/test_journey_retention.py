"""Journey: the one-off that tidies itself away (E5 retention blind spot).

A one-time task ("bleed the radiators, once") is completed and then left. With
retention configured, the completed one-off should auto-archive after N days
and — only if it was auto-archived — auto-delete after a further M days. The
per-module policy tests check the pure decisions; this walks the whole
time-lapse through the real sweep, with a restart between the archive and the
delete, and asserts the archived state persists and the eventual deletion
cleans every per-task entity (no orphans).

See docs/design/user-journeys.md (E5 retention: auto-archive → auto-delete).
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
from freezegun import freeze_time
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_ARCHIVE_ONEOFF_DAYS,
    CONF_DELETE_ARCHIVED_ONEOFF_DAYS,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.helpers.retention import (
    async_run_retention_sweep,
)
from custom_components.maintenance_supporter.websocket.tasks import ws_complete_task

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    call_ws_handler,
    setup_integration,
)
from .journey import assert_no_orphans, simulate_restart

_ARCHIVE_DAYS = 30
_DELETE_DAYS = 60


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    data = {
        **build_global_entry_data(),
        CONF_ARCHIVE_ONEOFF_DAYS: _ARCHIVE_DAYS,
        CONF_DELETE_ARCHIVED_ONEOFF_DAYS: _DELETE_DAYS,
    }
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _conn() -> MagicMock:
    conn = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


def _one_time_task() -> dict[str, Any]:
    return {
        "id": TASK_ID_1,
        "object_id": "objid_bleed",
        "name": "Bleed the radiators",
        "type": "custom",
        "enabled": True,
        "schedule_type": "one_time",
        "due_date": "2026-03-05",
        "warning_days": 7,
        "history": [],
    }


def _object(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Radiators",
        data=build_object_entry_data(
            object_data=build_object_data(name="Radiators", object_id="objid_bleed"),
            tasks={TASK_ID_1: _one_time_task()},
        ),
        source="user",
        unique_id="maintenance_supporter_radiators",
    )
    entry.add_to_hass(hass)
    return entry


def _task_data(entry: MockConfigEntry) -> dict[str, Any] | None:
    """The STATIC task dict from entry.data — where the sweep writes archived_at
    and where deletion removes the task."""
    return entry.data.get(CONF_TASKS, {}).get(TASK_ID_1)


def _merged(entry: MockConfigEntry) -> dict[str, Any] | None:
    """Static entry.data merged with the Store's dynamic fields (last_performed,
    history, …) — the same view the retention sweep decides on."""
    static = _task_data(entry)
    if static is None:
        return None
    store = getattr(entry.runtime_data, "store", None)
    return store.merge_task_data(TASK_ID_1, static) if store is not None else static


async def test_completed_one_off_auto_archives_then_auto_deletes(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    obj = _object(hass)

    # Day 0: complete the one-off. last_performed is stamped "now".
    with freeze_time("2026-03-05 09:00:00"):
        await setup_integration(hass, global_entry, obj)
        await call_ws_handler(
            ws_complete_task,
            hass,
            _conn(),
            {"id": 1, "type": "maintenance_supporter/task/complete", "entry_id": obj.entry_id, "task_id": TASK_ID_1},
        )
        await hass.async_block_till_done()
        assert _merged(obj).get("last_performed"), "completion should stamp last_performed"
        assert _task_data(obj).get("archived_at") is None, "not archived yet"

    # A sweep BEFORE the archive window is a no-op (only 10 days passed).
    with freeze_time("2026-03-15 03:00:00"):
        await async_run_retention_sweep(hass)
        await hass.async_block_till_done()
        assert _task_data(obj).get("archived_at") is None, "archived too early"

    # Day 35 (> 30): the sweep auto-archives it with reason=auto.
    with freeze_time("2026-04-09 03:00:00"):
        await async_run_retention_sweep(hass)
        await hass.async_block_till_done()
        td = _task_data(obj)
        assert td is not None, "task must still exist (archived, not deleted)"
        assert td.get("archived_at") is not None, "one-off not auto-archived after the window"
        assert td.get("archived_reason") == "auto", "auto-archive must be marked reason=auto"

    # Restart between archive and delete — the archived state persists and no
    # premature deletion happens on setup.
    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    assert _task_data(obj).get("archived_at") is not None, "archived state lost across restart"

    # Still inside the delete window (only ~40 days since archival): no delete.
    with freeze_time("2026-05-20 03:00:00"):
        await async_run_retention_sweep(hass)
        await hass.async_block_till_done()
        assert _task_data(obj) is not None, "deleted before the delete window elapsed"

    # Day 35 + 61 (> 60 since archived_at): the auto-archived one-off is deleted.
    with freeze_time("2026-06-20 03:00:00"):
        await async_run_retention_sweep(hass)
        await hass.async_block_till_done()
        assert _task_data(obj) is None, "aged auto-archive was not deleted"

    # No orphans: the per-task entities and object.task_ids ref are gone.
    assert_no_orphans(hass, obj, deleted_task_ids=(TASK_ID_1,))

    # And it stays gone across a restart.
    await simulate_restart(hass, obj)
    obj = hass.config_entries.async_get_entry(obj.entry_id)
    assert _task_data(obj) is None, "deleted task resurrected after restart"
    assert_no_orphans(hass, obj, deleted_task_ids=(TASK_ID_1,))


async def test_manually_archived_one_off_is_never_auto_deleted(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """A MANUALLY archived one-off (archived_reason != "auto") must survive the
    delete sweep forever — auto-delete only reclaims what the sweep archived."""
    obj = _object(hass)
    with freeze_time("2026-03-05 09:00:00"):
        await setup_integration(hass, global_entry, obj)
        await call_ws_handler(
            ws_complete_task,
            hass,
            _conn(),
            {"id": 1, "type": "maintenance_supporter/task/complete", "entry_id": obj.entry_id, "task_id": TASK_ID_1},
        )
        await hass.async_block_till_done()

    # Simulate a manual archive: archived_at set, reason NOT "auto".
    new_tasks = dict(obj.data[CONF_TASKS])
    td = dict(new_tasks[TASK_ID_1])
    td["archived_at"] = "2026-03-06T10:00:00+00:00"
    td["archived_reason"] = "manual"
    new_tasks[TASK_ID_1] = td
    hass.config_entries.async_update_entry(obj, data={**obj.data, CONF_TASKS: new_tasks})

    # Way past the delete window — a manual archive is left alone.
    with freeze_time("2027-01-01 03:00:00"):
        await async_run_retention_sweep(hass)
        await hass.async_block_till_done()
        assert _task_data(obj) is not None, "a manually archived one-off must never be auto-deleted"
        assert _task_data(obj).get("archived_reason") == "manual"
