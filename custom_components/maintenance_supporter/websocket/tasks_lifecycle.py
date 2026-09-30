"""Task archive / unarchive / list WS handlers."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.util import dt as dt_util

from ..const import (
    ARCHIVE_REASON_MANUAL,
    CONF_TASKS,
    MAX_DATE_LENGTH,
)
from ..helpers.aggregate import get_coordinator_data, get_store, object_name
from ..helpers.entry_tasks import write_task
from ..helpers.pause import clear_cycle_modifiers, reanchor_recurring_task
from ..helpers.permissions import require_write
from ..helpers.ws_errors import send_translated_error
from . import (
    ID_FIELD,
    _build_task_summary,
    _get_merged_tasks,
    _get_object_entries,
    _load_object_task,
    _parse_iso_date,
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
        vol.Required("entry_id"): ID_FIELD,
        vol.Required("task_id"): ID_FIELD,
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
    ctx = _load_object_task(hass, connection, msg)
    if ctx is None:
        return
    entry, _rd, task = ctx
    task_id = msg["task_id"]

    td = dict(task)
    if td.get("archived_at") is not None:
        connection.send_error(msg["id"], "already_archived", "Task already archived")
        return

    td["archived_at"] = dt_util.now().isoformat()
    td["archived_reason"] = ARCHIVE_REASON_MANUAL
    write_task(hass, entry, task_id, td)

    # Reload so a sensor task's triggers tear down (async_added_to_hass skips
    # trigger setup for archived tasks) and every per-task entity recomputes inert.
    await hass.config_entries.async_reload(entry.entry_id)

    connection.send_result(msg["id"], {"success": True, "archived_at": td["archived_at"]})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/pause",
        vol.Required("entry_id"): ID_FIELD,
        vol.Required("task_id"): ID_FIELD,
        vol.Optional("until"): vol.Any(vol.All(str, vol.Length(max=MAX_DATE_LENGTH)), None),
    }
)
@require_write
@websocket_api.async_response
async def ws_pause_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Pause ONE task (#193): frozen schedule, no reminders, until resumed.

    The object pause, per task — for a filter that comes out of use for a
    while (items used in rotation): resuming starts a fresh cycle, so the
    interval counts from the day it goes back in. ``until`` (optional future
    date) resumes it on that day.
    """
    ctx = _load_object_task(hass, connection, msg)
    if ctx is None:
        return
    entry, _rd, task = ctx
    task_id = msg["task_id"]
    td = dict(task)
    if td.get("archived_at") is not None:
        send_translated_error(connection, msg["id"], "archived", "An archived task cannot be paused", translation_key="archived_task_cannot_pause")
        return
    if td.get("paused_at") is not None:
        connection.send_error(msg["id"], "already_paused", "Task already paused")
        return

    until = msg.get("until")
    if until:
        until_date = _parse_iso_date(connection, msg["id"], until, field="until")
        if until_date is None:
            return
        if until_date <= dt_util.now().date():
            send_translated_error(connection, msg["id"], "invalid_date", "until must be a future date", translation_key="until_in_past")
            return

    td["paused_at"] = dt_util.now().isoformat()
    td["paused_until"] = until or None
    write_task(hass, entry, task_id, td)
    # Reload: a sensor task's triggers tear down (paused = inert) and every
    # per-task entity repaints as paused.
    await hass.config_entries.async_reload(entry.entry_id)
    connection.send_result(msg["id"], {"success": True, "paused_at": td["paused_at"], "paused_until": td["paused_until"]})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/resume",
        vol.Required("entry_id"): ID_FIELD,
        vol.Required("task_id"): ID_FIELD,
    }
)
@require_write
@websocket_api.async_response
async def ws_resume_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """End a task's pause: a recurring task restarts a fresh cycle today."""
    ctx = _load_object_task(hass, connection, msg)
    if ctx is None:
        return
    entry, _rd, td = ctx
    task_id = msg["task_id"]
    if td.get("paused_at") is None:
        connection.send_error(msg["id"], "not_paused", "Task is not paused")
        return

    # The unarchive order: the Store anchor first (its save is the only
    # await), then the static dict from a FRESH read, so a writer landing
    # during the disk write cannot be reverted by a stale copy.
    store = get_store(hass, entry.entry_id)
    recurring = td.get("archived_at") is None and _is_recurring_schedule(td)
    today_iso = dt_util.now().date().isoformat()
    if recurring and store is not None:
        reanchor_recurring_task(task_id, store=store, today_iso=today_iso)
        await store.async_save()
    fresh = entry.data.get(CONF_TASKS, {}).get(task_id)
    if fresh is None:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return
    td = dict(fresh)
    td.pop("paused_at", None)
    td.pop("paused_until", None)
    if recurring and store is None:
        reanchor_recurring_task(task_id, store=None, today_iso=today_iso, task_data=td)
    elif recurring:
        # The Store holds the fresh anchor; scrub the static shadow too.
        clear_cycle_modifiers(td)
    write_task(hass, entry, task_id, td)
    await hass.config_entries.async_reload(entry.entry_id)
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/unarchive",
        vol.Required("entry_id"): ID_FIELD,
        vol.Required("task_id"): ID_FIELD,
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
    ctx = _load_object_task(hass, connection, msg)
    if ctx is None:
        return
    entry, _rd, td = ctx
    task_id = msg["task_id"]
    if td.get("archived_at") is None:
        connection.send_error(msg["id"], "not_archived", "Task is not archived")
        return

    # Fresh cycle for recurring tasks. last_performed is dynamic state → Store
    # when present, else the static dict (legacy). One-off/manual: no re-anchor.
    # The store flush is this handler's only await — the ConfigEntry mutation
    # below re-reads AFTER it, so a concurrent writer landing during the disk
    # write can't be reverted by a stale whole-map write (the migration-race
    # class, bug audit 2026-07-11).
    store = get_store(hass, entry.entry_id)
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

    # Re-derive the task from a FRESH read (post-await) and patch only its key.
    fresh = entry.data.get(CONF_TASKS, {}).get(task_id)
    if fresh is None:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return
    td = dict(fresh)
    td.pop("archived_at", None)
    td.pop("archived_reason", None)
    if legacy_anchor:
        reanchor_recurring_task(task_id, store=None, today_iso=dt_util.now().date().isoformat(), task_data=td)
    elif recurring:
        # The Store already holds the fresh anchor; scrub the static shadow too
        # so an imported due_override can't out-rank it in merge_task_data.
        clear_cycle_modifiers(td)

    write_task(hass, entry, task_id, td)

    await hass.config_entries.async_reload(entry.entry_id)

    connection.send_result(msg["id"], {"success": True})


# ---------------------------------------------------------------------------
# Task List
# ---------------------------------------------------------------------------


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/list",
        vol.Optional("entry_id"): ID_FIELD,
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
        obj_name = object_name(entry)
        ct_tasks = (get_coordinator_data(hass, entry.entry_id) or {}).get(CONF_TASKS, {})
        for task_id, task_data in entry_tasks.items():
            summary = _build_task_summary(hass, task_id, task_data, ct_tasks.get(task_id))
            summary["task_id"] = task_id
            summary["entry_id"] = entry.entry_id
            summary["object_name"] = obj_name
            tasks.append(summary)

    connection.send_result(msg["id"], {"tasks": tasks})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/history",
        vol.Required("entry_id"): ID_FIELD,
        vol.Required("task_id"): ID_FIELD,
    }
)
@callback
def ws_task_history(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """The FULL history of one task (read tier, like the list it backs).

    Payload diet (perf, 2026-08): the list responses truncate ``history`` to
    the most recent window — at 150+ tasks the full histories dominated the
    ``objects`` payload (906 KB measured at 40 entries/task, and the store
    caps at 500). The detail view's timeline, filters and charts fetch the
    complete record here, only when a task is actually opened.
    """
    ctx = _load_object_task(hass, connection, msg, merged=True)
    if ctx is None:
        return
    _entry, _rd, task_data = ctx
    history = task_data.get("history") or []
    connection.send_result(msg["id"], {"history": history, "count": len(history)})
