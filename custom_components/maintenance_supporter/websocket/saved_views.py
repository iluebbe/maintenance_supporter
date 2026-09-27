"""WebSocket commands for saved filter views (v2.24).

``views/list`` returns the shared named views (read — any user applies them);
``views/save`` upserts one and ``views/delete`` removes one (write — creating or
deleting a shared view is a content change). Views live on the global config
entry's options; see ``helpers/saved_views`` for the shape + sanitiser.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from ..const import CONF_SAVED_FILTER_VIEWS, DOMAIN, MAX_ID_LENGTH, MAX_VIEW_NAME_LENGTH
from ..helpers.permissions import require_write
from ..helpers.saved_views import list_saved_views, remove_view, sanitize_view, upsert_view
from ..helpers.ws_errors import send_translated_error
from . import ID_FIELD, _get_global_entry, _merge_global_options


def _persist(hass: HomeAssistant, views: list[dict[str, Any]]) -> None:
    """Write the views list back to the global entry's options."""
    global_entry = _get_global_entry(hass)
    if global_entry is None:
        raise LookupError("global_entry_missing")
    _merge_global_options(hass, global_entry, {CONF_SAVED_FILTER_VIEWS: views})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/views/list"})
@websocket_api.async_response
async def ws_list_saved_views(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return every shared saved filter view."""
    connection.send_result(msg["id"], {"views": list_saved_views(hass)})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/views/save",
        # Omit view_id to create; include it to update in place. (Not "id" — that
        # key is the WebSocket message id the framework owns.)
        vol.Optional("view_id"): ID_FIELD,
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=MAX_VIEW_NAME_LENGTH)),
        vol.Optional("filters"): dict,
    }
)
@require_write
@websocket_api.async_response
async def ws_save_saved_view(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Create or update a shared saved view, then return the full list."""
    clean = sanitize_view(
        {"id": msg.get("view_id"), "name": msg["name"], "filters": msg.get("filters", {})},
        view_id=msg.get("view_id"),
    )
    if clean is None:
        send_translated_error(connection, msg["id"], "invalid_view", "A view needs a non-empty name", translation_key="view_name_empty")
        return
    try:
        views, saved_id = upsert_view(list_saved_views(hass), clean)
        _persist(hass, views)
    except ValueError:
        connection.send_error(msg["id"], "too_many_views", "The saved-views limit has been reached")
        return
    except LookupError:
        connection.send_error(msg["id"], "not_found", "Global config entry not found")
        return
    connection.send_result(msg["id"], {"views": views, "saved_id": saved_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/views/delete",
        vol.Required("view_id"): vol.All(str, vol.Length(min=1, max=MAX_ID_LENGTH)),
    }
)
@require_write
@websocket_api.async_response
async def ws_delete_saved_view(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete a shared saved view by id, then return the remaining list."""
    views = remove_view(list_saved_views(hass), msg["view_id"])
    try:
        _persist(hass, views)
    except LookupError:
        connection.send_error(msg["id"], "not_found", "Global config entry not found")
        return
    connection.send_result(msg["id"], {"views": views})
