"""WebSocket handlers for user management."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from ..const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    MAX_ID_LENGTH,
    MAX_META_LENGTH,
)
from ..helpers.permissions import require_write, user_may_write
from . import (
    _build_task_summary,
    _get_merged_tasks,
    _get_object_entries,
    _get_runtime_data,
    _load_object_entry,
)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/users/list"})
@websocket_api.async_response
async def ws_list_users(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return list of HA users for task assignment.

    Returns users with their basic info for frontend selector.
    Filters out system users (is_active=False, system_generated=True).
    """
    users_data = []
    # Only admins receive the is_admin / is_owner flags. A non-admin caller gets
    # just id + name (needed for the assignee selector and name display) so they
    # cannot enumerate who is an admin/owner via this command.
    caller_is_admin = connection.user is not None and connection.user.is_admin
    # #169 follow-up: every caller gets the avatar (initials + colour) — the
    # resolved value, i.e. the admin override or the name/id-derived default.
    from ..helpers.global_options import get_global_options
    from ..helpers.member_display import member_display

    options = get_global_options(hass)

    for user in await hass.auth.async_get_users():
        # Filter out system users and inactive users
        if not user.is_active or user.system_generated:
            continue

        entry: dict[str, Any] = {"id": user.id, "name": user.name, **member_display(options, user.id, user.name)}
        if caller_is_admin:
            entry["is_admin"] = user.is_admin
            entry["is_owner"] = user.is_owner
        users_data.append(entry)

    connection.send_result(msg["id"], {"users": users_data})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/task/assign_user",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("task_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Optional("user_id"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),  # None = unassign
    }
)
@require_write
@websocket_api.async_response
async def ws_assign_user(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Assign or unassign a user to a task."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return

    task_id = msg["task_id"]
    if task_id not in entry.data.get(CONF_TASKS, {}):
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    user_id = msg.get("user_id")

    # Validate user exists if provided — BEFORE touching entry.data. This is
    # the handler's only await; reading the tasks after it means a concurrent
    # writer landing during the auth lookup (e.g. a completing task persisting
    # its rotation) can't be reverted by a stale whole-map write (the
    # migration-race class, bug audit 2026-07-11).
    if user_id:
        user = await hass.auth.async_get_user(user_id)
        if user is None:
            connection.send_error(msg["id"], "invalid_user", "User not found")
            return

    tasks_data = entry.data.get(CONF_TASKS, {})
    if task_id not in tasks_data:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return
    task = dict(tasks_data[task_id])
    if user_id is None:
        # Unassign user - remove field if it exists
        task.pop("responsible_user_id", None)
    else:
        task["responsible_user_id"] = user_id

    # Patch only this task's key onto a fresh read — never write back a map
    # snapshot from before an await.
    from ..helpers.entry_tasks import write_task

    write_task(hass, entry, task_id, task)

    # Refresh coordinator
    rd = _get_runtime_data(hass, entry.entry_id)
    if rd and rd.coordinator:
        await rd.coordinator.async_refresh_now()

    connection.send_result(msg["id"], {"success": True, "user_id": user_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/tasks/by_user",
        vol.Required("user_id"): vol.All(str, vol.Length(max=MAX_META_LENGTH)),
    }
)
@websocket_api.async_response
async def ws_tasks_by_user(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return all tasks assigned to a specific user across all objects."""
    user_id = msg["user_id"]
    # Authorization: a user may query their OWN assignments; querying another
    # user's requires write access (admin or operator) — prevents a plain user
    # from enumerating another user's task assignments.
    if connection.user is None or (user_id != connection.user.id and not user_may_write(hass, connection)):
        connection.send_error(msg["id"], "unauthorized", "Not authorized to view another user's tasks")
        return
    entries = _get_object_entries(hass)
    result = []

    for entry in entries:
        rd = _get_runtime_data(hass, entry.entry_id)
        coord_data = rd.coordinator.data if rd and rd.coordinator else None
        ct_tasks = (coord_data or {}).get(CONF_TASKS, {})
        tasks_data = _get_merged_tasks(entry)
        obj_data = entry.data.get(CONF_OBJECT, {})

        for tid, tdata in tasks_data.items():
            if tdata.get("responsible_user_id") == user_id:
                task_summary = _build_task_summary(hass, tid, tdata, ct_tasks.get(tid))
                task_summary["object_name"] = obj_data.get("name", "")
                task_summary["entry_id"] = entry.entry_id
                result.append(task_summary)

    connection.send_result(msg["id"], {"tasks": result})
