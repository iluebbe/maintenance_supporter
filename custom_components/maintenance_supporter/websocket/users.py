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
    GLOBAL_UNIQUE_ID,
)
from . import _build_task_summary, _get_merged_tasks, _get_object_entries, _get_runtime_data


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/users/list"}
)
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

    for user in await hass.auth.async_get_users():
        # Filter out system users and inactive users
        if not user.is_active or user.system_generated:
            continue

        users_data.append({
            "id": user.id,
            "name": user.name,
            "is_admin": user.is_admin,
            "is_owner": user.is_owner,
        })

    connection.send_result(msg["id"], {"users": users_data})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/task/assign_user",
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
        vol.Optional("user_id"): vol.Any(str, None),  # None = unassign
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_assign_user(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Assign or unassign a user to a task."""
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    tasks_data = dict(entry.data.get(CONF_TASKS, {}))
    task_id = msg["task_id"]
    if task_id not in tasks_data:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    user_id = msg.get("user_id")

    # Validate user exists if provided
    if user_id:
        user = await hass.auth.async_get_user(user_id)
        if user is None:
            connection.send_error(msg["id"], "invalid_user", "User not found")
            return

    task = dict(tasks_data[task_id])
    if user_id is None:
        # Unassign user - remove field if it exists
        task.pop("responsible_user_id", None)
    else:
        task["responsible_user_id"] = user_id
    tasks_data[task_id] = task

    new_data = dict(entry.data)
    new_data[CONF_TASKS] = tasks_data
    hass.config_entries.async_update_entry(entry, data=new_data)

    # Refresh coordinator
    rd = _get_runtime_data(hass, entry.entry_id)
    if rd and rd.coordinator:
        await rd.coordinator.async_request_refresh()

    connection.send_result(msg["id"], {"success": True, "user_id": user_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/tasks/by_user",
        vol.Required("user_id"): str,
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
