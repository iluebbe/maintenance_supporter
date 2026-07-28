"""Task archive / unarchive / list WS handlers."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.util import dt as dt_util

from ..const import (
    ARCHIVE_REASON_MANUAL,
    CONF_OBJECT,
    CONF_OBJECT_NAME,
    CONF_TASKS,
    MAX_ID_LENGTH,
)
from ..helpers.pause import clear_cycle_modifiers, reanchor_recurring_task
from ..helpers.permissions import require_write
from . import (
    _build_task_summary,
    _get_merged_tasks,
    _get_object_entries,
    _get_runtime_data,
    _load_object_entry,
)


def _is_recurring_schedule(task: dict[str, Any]) -> bool:
    """True iff the task has a cycling schedule (interval or a calendar kind).

    One-off and manual tasks don't re-arm, so unarchiving them keeps their
    terminal state; a recurring task is given a fresh cycle instead (D2).
    Delegates to the shared predicate in helpers.schedule (also used by the
    seasonal-pause resume, N3).
    """
    from ..helpers.schedule import is_recurring

    return is_recurring(task)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/archive",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("task_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
    }
)
@require_write
@websocket_api.async_response
async def ws_archive_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Archive a single task (retire but retain).

    Reason MANUAL → it is never auto-deleted and is unarchived individually
    (an object-cascade unarchive leaves it alone). Works for any task type.
    """
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    tasks_data = dict(entry.data.get(CONF_TASKS, {}))
    task_id = msg["task_id"]
    if task_id not in tasks_data:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    td = dict(tasks_data[task_id])
    if td.get("archived_at") is not None:
        connection.send_error(msg["id"], "already_archived", "Task already archived")
        return

    td["archived_at"] = dt_util.now().isoformat()
    td["archived_reason"] = ARCHIVE_REASON_MANUAL
    tasks_data[task_id] = td
    new_data = dict(entry.data)
    new_data[CONF_TASKS] = tasks_data
    hass.config_entries.async_update_entry(entry, data=new_data)

    # Reload so a sensor task's triggers tear down (async_added_to_hass skips
    # trigger setup for archived tasks) and every per-task entity recomputes inert.
    await hass.config_entries.async_reload(entry.entry_id)

    connection.send_result(msg["id"], {"success": True, "archived_at": td["archived_at"]})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/unarchive",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("task_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
    }
)
@require_write
@websocket_api.async_response
async def ws_unarchive_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Unarchive a single task.

    Recurring tasks restart a fresh cycle (D2): ``last_performed`` is re-anchored
    to today so ``next_due = today + interval`` rather than resurfacing as
    retroactively overdue. One-off / manual tasks keep their terminal state.
    """
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    task_id = msg["task_id"]
    td = dict(entry.data.get(CONF_TASKS, {}).get(task_id, {}))
    if not td:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return
    if td.get("archived_at") is None:
        connection.send_error(msg["id"], "not_archived", "Task is not archived")
        return

    # Fresh cycle for recurring tasks. last_performed is dynamic state → Store
    # when present, else the static dict (legacy). One-off/manual: no re-anchor.
    # The store flush is this handler's only await — the ConfigEntry mutation
    # below re-reads AFTER it, so a concurrent writer landing during the disk
    # write can't be reverted by a stale whole-map write (the migration-race
    # class, bug audit 2026-07-11).
    rd = _get_runtime_data(hass, entry.entry_id)
    store = getattr(rd, "store", None) if rd else None
    recurring = _is_recurring_schedule(td)
    legacy_anchor = False
    if recurring:
        today_iso = dt_util.now().date().isoformat()
        if store is not None:
            # Dynamic half only — the static half runs after the fresh re-read
            # below, so the await stays BEFORE that read (see the note above).
            reanchor_recurring_task(task_id, store=store, today_iso=today_iso)
            await store.async_save()
        else:
            legacy_anchor = True

    # Re-derive the task from a FRESH read and patch only its key.
    fresh_tasks = entry.data.get(CONF_TASKS, {})
    if task_id not in fresh_tasks:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return
    td = dict(fresh_tasks[task_id])
    td.pop("archived_at", None)
    td.pop("archived_reason", None)
    if legacy_anchor:
        reanchor_recurring_task(
            task_id, store=None, today_iso=dt_util.now().date().isoformat(), task_data=td
        )
    elif recurring:
        # The Store already holds the fresh anchor; scrub the static shadow too
        # so an imported due_override can't out-rank it in merge_task_data.
        clear_cycle_modifiers(td)

    new_data = dict(entry.data)
    new_tasks = dict(new_data.get(CONF_TASKS, {}))
    new_tasks[task_id] = td
    new_data[CONF_TASKS] = new_tasks
    hass.config_entries.async_update_entry(entry, data=new_data)

    await hass.config_entries.async_reload(entry.entry_id)

    connection.send_result(msg["id"], {"success": True})


# ---------------------------------------------------------------------------
# Task List
# ---------------------------------------------------------------------------


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/list",
        vol.Optional("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
    }
)
@callback
def ws_list_tasks(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """List tasks, optionally filtered by entry_id (object)."""
    entries = _get_object_entries(hass)
    filter_entry_id = msg.get("entry_id")

    tasks: list[dict[str, Any]] = []
    for entry in entries:
        if filter_entry_id and entry.entry_id != filter_entry_id:
            continue
        entry_tasks = _get_merged_tasks(entry)
        obj_data = entry.data.get(CONF_OBJECT, {})
        rd = _get_runtime_data(hass, entry.entry_id)
        coordinator_data = rd.coordinator.data if rd and rd.coordinator else None
        ct_tasks = (coordinator_data or {}).get(CONF_TASKS, {})
        for task_id, task_data in entry_tasks.items():
            summary = _build_task_summary(hass, task_id, task_data, ct_tasks.get(task_id))
            summary["task_id"] = task_id
            summary["entry_id"] = entry.entry_id
            summary["object_name"] = obj_data.get(CONF_OBJECT_NAME, "")
            tasks.append(summary)

    connection.send_result(msg["id"], {"tasks": tasks})
