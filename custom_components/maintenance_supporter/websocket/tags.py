"""WebSocket handler for listing HA NFC tags."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from ..const import DOMAIN

_LOGGER = logging.getLogger(__name__)

_TAG_DOMAIN = "tag"


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

    tag_storage = hass.data.get(_TAG_DOMAIN)
    if tag_storage is not None:
        ent_reg = er.async_get(hass)
        try:
            items = tag_storage.async_items()
            for item in items:
                tag_id = item.get("id", "") if isinstance(item, dict) else getattr(item, "id", "")
                tag_name = item.get("name", "") if isinstance(item, dict) else getattr(item, "name", "")
                if not tag_name and tag_id:
                    # HA stores tag NAMES in the entity registry, not the tag
                    # store (stripped on save since the tag→entity refactor).
                    # Freshly created tags still carry the name in memory —
                    # which is why the dropdown looked fine "until I restart,
                    # then they only show up as UUIDs" (forum report). Resolve
                    # exactly like HA's own tag/list handler does.
                    entity_id = ent_reg.async_get_entity_id(
                        _TAG_DOMAIN, _TAG_DOMAIN, tag_id
                    )
                    if entity_id and (entity := ent_reg.async_get(entity_id)):
                        tag_name = entity.name or entity.original_name or ""
                tags.append({"id": tag_id, "name": tag_name or tag_id})
        except Exception:  # noqa: BLE001 - HA tag storage internals; an empty list lets the picker still render
            _LOGGER.warning("Failed to read NFC tag registry", exc_info=True)

    connection.send_result(msg["id"], {"tags": tags})
