"""WebSocket handler for listing HA NFC tags."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from ..const import DOMAIN


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/tags/list"}
)
@websocket_api.async_response
async def ws_list_tags(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return list of registered NFC tags from HA tag registry."""
    tags: list[dict[str, str]] = []

    tag_storage = hass.data.get("tag")
    if tag_storage is not None:
        try:
            items = tag_storage.async_items()
            for item in items:
                tag_id = item.get("id", "") if isinstance(item, dict) else getattr(item, "id", "")
                tag_name = item.get("name", "") if isinstance(item, dict) else getattr(item, "name", "")
                tags.append({"id": tag_id, "name": tag_name or tag_id})
        except Exception:  # noqa: BLE001
            pass

    connection.send_result(msg["id"], {"tags": tags})
