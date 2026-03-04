"""WebSocket handlers for group CRUD operations."""

from __future__ import annotations

from typing import Any
from uuid import uuid4

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from ..const import DOMAIN
from . import _get_global_entry


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/groups"}
)
@websocket_api.async_response
async def ws_get_groups(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return all maintenance groups."""
    from ..const import CONF_GROUPS  # noqa: PLC0415

    global_entry = _get_global_entry(hass)
    if global_entry is None:
        connection.send_result(msg["id"], {"groups": {}})
        return

    options = global_entry.options or global_entry.data
    groups = options.get(CONF_GROUPS, {})
    connection.send_result(msg["id"], {"groups": groups})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/group/create",
        vol.Required("name"): str,
        vol.Optional("description", default=""): str,
        vol.Optional("task_refs", default=[]): [
            {
                vol.Required("entry_id"): str,
                vol.Required("task_id"): str,
            }
        ],
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_create_group(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Create a new maintenance group."""
    from ..const import CONF_GROUPS  # noqa: PLC0415

    global_entry = _get_global_entry(hass)
    if global_entry is None:
        connection.send_error(msg["id"], "not_found", "Global config not found")
        return

    group_id = uuid4().hex
    options = dict(global_entry.options or global_entry.data)
    groups = dict(options.get(CONF_GROUPS, {}))
    groups[group_id] = {
        "name": msg["name"],
        "description": msg.get("description", ""),
        "task_refs": msg.get("task_refs", []),
    }
    options[CONF_GROUPS] = groups
    hass.config_entries.async_update_entry(global_entry, options=options)

    connection.send_result(msg["id"], {"group_id": group_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/group/update",
        vol.Required("group_id"): str,
        vol.Optional("name"): str,
        vol.Optional("description"): str,
        vol.Optional("task_refs"): [
            {
                vol.Required("entry_id"): str,
                vol.Required("task_id"): str,
            }
        ],
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_update_group(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Update an existing maintenance group."""
    from ..const import CONF_GROUPS  # noqa: PLC0415

    global_entry = _get_global_entry(hass)
    if global_entry is None:
        connection.send_error(msg["id"], "not_found", "Global config not found")
        return

    options = dict(global_entry.options or global_entry.data)
    groups = dict(options.get(CONF_GROUPS, {}))
    group_id = msg["group_id"]

    if group_id not in groups:
        connection.send_error(msg["id"], "not_found", "Group not found")
        return

    group = dict(groups[group_id])
    if "name" in msg:
        group["name"] = msg["name"]
    if "description" in msg:
        group["description"] = msg["description"]
    if "task_refs" in msg:
        group["task_refs"] = msg["task_refs"]

    groups[group_id] = group
    options[CONF_GROUPS] = groups
    hass.config_entries.async_update_entry(global_entry, options=options)

    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/group/delete",
        vol.Required("group_id"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_delete_group(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete a maintenance group."""
    from ..const import CONF_GROUPS  # noqa: PLC0415

    global_entry = _get_global_entry(hass)
    if global_entry is None:
        connection.send_error(msg["id"], "not_found", "Global config not found")
        return

    options = dict(global_entry.options or global_entry.data)
    groups = dict(options.get(CONF_GROUPS, {}))
    group_id = msg["group_id"]

    if group_id not in groups:
        connection.send_error(msg["id"], "not_found", "Group not found")
        return

    del groups[group_id]
    options[CONF_GROUPS] = groups
    hass.config_entries.async_update_entry(global_entry, options=options)

    connection.send_result(msg["id"], {"success": True})
