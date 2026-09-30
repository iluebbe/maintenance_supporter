"""Pausing ONE task, and a snooze that says for how long (discussion #193).

Items used in rotation: a filter is cleaned, the item goes to the shelf, and
its three-week interval should only start again when it is back in use. The
object pause froze every task of the object; a task of its own can now be
paused until resumed (or until a date), and resuming starts a fresh cycle.

Snooze muted a task's reminders for the configured hours, but the panel only
said "Snoozed" — the reply now carries the duration and the end.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS, MaintenanceStatus
from custom_components.maintenance_supporter.export import build_export_data
from custom_components.maintenance_supporter.helpers.pause import build_resumed_entry_data, is_task_inert
from custom_components.maintenance_supporter.websocket.objects import ws_pause_object, ws_resume_object
from custom_components.maintenance_supporter.websocket.tasks import ws_duplicate_task, ws_pause_task, ws_resume_task
from custom_components.maintenance_supporter.websocket.tasks_actions import ws_snooze_task

from .conftest import (
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)

FILTER = "filter_task"
OTHER = "other_task"


async def _setup(hass: HomeAssistant) -> MockConfigEntry:
    last = (dt_util.now().date() - timedelta(days=30)).isoformat()
    tasks = {
        FILTER: build_task_data(task_id=FILTER, name="Clean and change filter", interval_days=21, last_performed=last),
        OTHER: build_task_data(task_id=OTHER, name="Descale", interval_days=90, last_performed=last),
    }
    entry = make_object_entry(hass, tasks=tasks, name="Purifier A", uid="purifier_a")
    await setup_integration(hass, make_global_entry(hass), entry)
    return entry


async def _ws(hass: HomeAssistant, handler: Any, payload: dict[str, Any]) -> tuple[Any, Any]:
    conn = make_ws_connection()
    await call_ws_handler(handler, hass, conn, {"id": 1, **payload})
    await hass.async_block_till_done()
    result = conn.send_result.call_args[0][1] if conn.send_result.called else None
    error = conn.send_error.call_args[0][1:] if conn.send_error.called else None
    return result, error


def _status(entry: MockConfigEntry, task_id: str) -> str:
    return str(entry.runtime_data.coordinator.data[CONF_TASKS][task_id]["_status"])


async def test_one_task_pauses_the_others_keep_running(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    assert _status(entry, FILTER) == MaintenanceStatus.OVERDUE
    other_before = _status(entry, OTHER)

    result, error = await _ws(hass, ws_pause_task, {"type": "x", "entry_id": entry.entry_id, "task_id": FILTER})
    assert error is None and result["paused_at"] and result["paused_until"] is None

    assert _status(entry, FILTER) == MaintenanceStatus.PAUSED
    assert _status(entry, OTHER) == other_before != MaintenanceStatus.PAUSED, "the object's other task keeps running"
    task = entry.data[CONF_TASKS][FILTER]
    assert is_task_inert(task, entry.data[CONF_OBJECT])

    again, error = await _ws(hass, ws_pause_task, {"type": "x", "entry_id": entry.entry_id, "task_id": FILTER})
    assert again is None and error[0] == "already_paused"


async def test_resuming_starts_a_fresh_cycle(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    await _ws(hass, ws_pause_task, {"type": "x", "entry_id": entry.entry_id, "task_id": FILTER})

    result, error = await _ws(hass, ws_resume_task, {"type": "x", "entry_id": entry.entry_id, "task_id": FILTER})
    assert error is None and result == {"success": True}

    data = entry.runtime_data.coordinator.data[CONF_TASKS][FILTER]
    assert data["_status"] == MaintenanceStatus.OK
    assert data["_days_until_due"] == 21, "the three weeks count from the day it went back in use"
    assert "paused_at" not in entry.data[CONF_TASKS][FILTER]

    _, error = await _ws(hass, ws_resume_task, {"type": "x", "entry_id": entry.entry_id, "task_id": FILTER})
    assert error[0] == "not_paused"


async def test_a_resume_date_ends_the_pause_by_itself(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    entry = await _setup(hass)
    until = (dt_util.now().date() + timedelta(days=3)).isoformat()
    result, _ = await _ws(hass, ws_pause_task, {"type": "x", "entry_id": entry.entry_id, "task_id": FILTER, "until": until})
    assert result["paused_until"] == until

    freezer.tick(timedelta(days=3, hours=1))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    await entry.runtime_data.coordinator.async_refresh()
    await hass.async_block_till_done()

    assert "paused_at" not in entry.data[CONF_TASKS][FILTER]
    assert _status(entry, FILTER) == MaintenanceStatus.OK


async def test_a_past_date_and_an_archived_task_are_refused(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    yesterday = (dt_util.now().date() - timedelta(days=1)).isoformat()
    _, error = await _ws(hass, ws_pause_task, {"type": "x", "entry_id": entry.entry_id, "task_id": FILTER, "until": yesterday})
    assert error[0] == "invalid_date"

    tasks = dict(entry.data[CONF_TASKS])
    tasks[OTHER] = {**tasks[OTHER], "archived_at": "2026-01-01T00:00:00+00:00"}
    hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_TASKS: tasks})
    _, error = await _ws(hass, ws_pause_task, {"type": "x", "entry_id": entry.entry_id, "task_id": OTHER})
    assert error[0] == "archived"


async def test_resuming_the_object_leaves_a_paused_task_paused(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    await _ws(hass, ws_pause_task, {"type": "x", "entry_id": entry.entry_id, "task_id": FILTER})
    await _ws(hass, ws_pause_object, {"type": "x", "entry_id": entry.entry_id})
    await _ws(hass, ws_resume_object, {"type": "x", "entry_id": entry.entry_id})

    assert entry.data[CONF_TASKS][FILTER].get("paused_at") is not None
    assert _status(entry, FILTER) == MaintenanceStatus.PAUSED
    assert _status(entry, OTHER) == MaintenanceStatus.OK
    # The shared core, directly: a paused task is not re-anchored.
    resumed = build_resumed_entry_data(dict(entry.data), None, "2026-10-01")
    assert resumed[CONF_TASKS][FILTER]["paused_at"] is not None


async def test_the_pause_travels_in_a_backup_and_not_into_a_copy(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    await _ws(hass, ws_pause_task, {"type": "x", "entry_id": entry.entry_id, "task_id": FILTER})

    exported = build_export_data(hass, entry_ids={entry.entry_id})
    (task,) = [t for o in exported["objects"] for t in o["tasks"] if t["id"] == FILTER]
    assert task["paused_at"] and task["paused_until"] is None

    result, _ = await _ws(hass, ws_duplicate_task, {"type": "x", "entry_id": entry.entry_id, "task_id": FILTER})
    copy = entry.data[CONF_TASKS][result["task_id"]]
    assert "paused_at" not in copy


async def test_snooze_says_for_how_long(hass: HomeAssistant) -> None:
    entry = await _setup(hass)
    result, error = await _ws(hass, ws_snooze_task, {"type": "x", "entry_id": entry.entry_id, "task_id": FILTER})
    assert error is None
    assert result["hours"] == 4
    until = dt_util.parse_datetime(result["snoozed_until"])
    assert until is not None and abs((until - dt_util.now()) - timedelta(hours=4)) < timedelta(minutes=1)
