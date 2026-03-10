"""WebSocket handlers for object CRUD operations."""

from __future__ import annotations

from typing import Any
from uuid import uuid4

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from ..const import (
    CONF_OBJECT,
    CONF_OBJECT_AREA,
    CONF_OBJECT_INSTALLATION_DATE,
    CONF_OBJECT_MANUFACTURER,
    CONF_OBJECT_MODEL,
    CONF_OBJECT_NAME,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MAX_META_LENGTH,
    MAX_NAME_LENGTH,
)
from . import _build_object_response, _get_object_entries, _get_runtime_data, cleanup_group_refs


@websocket_api.websocket_command(
    {vol.Required("type"): "maintenance_supporter/objects"}
)
@websocket_api.async_response
async def ws_get_objects(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return all maintenance objects with tasks and computed status."""
    entries = _get_object_entries(hass)
    result = []
    for entry in entries:
        rd = _get_runtime_data(hass, entry.entry_id)
        coord_data = rd.coordinator.data if rd and rd.coordinator else None
        result.append(_build_object_response(hass, entry, coord_data))

    connection.send_result(msg["id"], {"objects": result})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object",
        vol.Required("entry_id"): str,
    }
)
@websocket_api.async_response
async def ws_get_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return a single object with full task details including history."""
    entry_id = msg["entry_id"]
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    rd = _get_runtime_data(hass, entry_id)
    coord_data = rd.coordinator.data if rd and rd.coordinator else None
    connection.send_result(msg["id"], _build_object_response(hass, entry, coord_data))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/create",
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        vol.Optional("area_id"): vol.Any(str, None),
        vol.Optional("manufacturer"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),
        vol.Optional("model"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),
        vol.Optional("installation_date"): vol.Any(vol.All(str, vol.Length(max=20)), None),
        vol.Optional("dry_run", default=False): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_create_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Create a new maintenance object via config flow."""
    name = msg["name"].strip()
    if not name:
        connection.send_error(msg["id"], "invalid_input", "Name must not be empty")
        return

    manufacturer = (msg.get("manufacturer") or "").strip() or None
    model = (msg.get("model") or "").strip() or None

    # Validate installation_date format if provided
    installation_date = msg.get("installation_date")
    if installation_date:
        from datetime import date as date_cls  # noqa: PLC0415

        try:
            date_cls.fromisoformat(installation_date)
        except ValueError:
            connection.send_error(msg["id"], "invalid_date", "Invalid installation_date format (expected YYYY-MM-DD)")
            return

    # Dry-run mode: validate only, do not persist
    if msg.get("dry_run"):
        connection.send_result(msg["id"], {"valid": True, "entry_id": None})
        return

    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": "websocket"},
        data={
            CONF_OBJECT: {
                "id": uuid4().hex,
                CONF_OBJECT_NAME: name,
                CONF_OBJECT_AREA: msg.get("area_id"),
                CONF_OBJECT_MANUFACTURER: manufacturer,
                CONF_OBJECT_MODEL: model,
                CONF_OBJECT_INSTALLATION_DATE: installation_date,
                "task_ids": [],
            },
            CONF_TASKS: {},
        },
    )

    if result["type"] == "create_entry":
        connection.send_result(
            msg["id"],
            {"entry_id": result["result"].entry_id},
        )
    else:
        connection.send_error(
            msg["id"], "create_failed", f"Failed to create object: {result.get('reason', 'unknown')}"
        )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/update",
        vol.Required("entry_id"): str,
        vol.Optional("name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        vol.Optional("area_id"): vol.Any(str, None),
        vol.Optional("manufacturer"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),
        vol.Optional("model"): vol.Any(vol.All(str, vol.Length(max=MAX_META_LENGTH)), None),
        vol.Optional("installation_date"): vol.Any(vol.All(str, vol.Length(max=20)), None),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_update_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Update an existing maintenance object."""
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    # Strip and validate name if provided
    if "name" in msg:
        msg["name"] = msg["name"].strip()
        if not msg["name"]:
            connection.send_error(msg["id"], "invalid_input", "Name must not be empty")
            return

    # Strip manufacturer/model
    if "manufacturer" in msg and msg["manufacturer"]:
        msg["manufacturer"] = msg["manufacturer"].strip() or None
    if "model" in msg and msg["model"]:
        msg["model"] = msg["model"].strip() or None

    # Validate installation_date format if provided
    if "installation_date" in msg and msg["installation_date"]:
        from datetime import date as date_cls  # noqa: PLC0415

        try:
            date_cls.fromisoformat(msg["installation_date"])
        except ValueError:
            connection.send_error(msg["id"], "invalid_date", "Invalid installation_date format (expected YYYY-MM-DD)")
            return

    new_data = dict(entry.data)
    obj = dict(new_data.get(CONF_OBJECT, {}))

    if "name" in msg:
        obj[CONF_OBJECT_NAME] = msg["name"]
    if "area_id" in msg:
        obj[CONF_OBJECT_AREA] = msg["area_id"]
    if "manufacturer" in msg:
        obj[CONF_OBJECT_MANUFACTURER] = msg["manufacturer"]
    if "model" in msg:
        obj[CONF_OBJECT_MODEL] = msg["model"]
    if "installation_date" in msg:
        obj[CONF_OBJECT_INSTALLATION_DATE] = msg["installation_date"]

    new_data[CONF_OBJECT] = obj
    title = obj.get(CONF_OBJECT_NAME, entry.title)
    hass.config_entries.async_update_entry(entry, data=new_data, title=title)

    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/delete",
        vol.Required("entry_id"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_delete_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete a maintenance object and all its tasks."""
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    await hass.config_entries.async_remove(entry.entry_id)
    cleanup_group_refs(hass, entry_id=entry.entry_id)
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/entity/attributes",
        vol.Required("entity_id"): str,
    }
)
@callback
def ws_entity_attributes(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return relevant attributes for an entity, combining domain mapping with live state.

    Used by the frontend trigger setup to show a dropdown of suitable attributes
    instead of a free text field.
    """
    from ..helpers.entity_attributes import get_entity_attributes

    result = get_entity_attributes(hass, msg["entity_id"])
    connection.send_result(msg["id"], result)
