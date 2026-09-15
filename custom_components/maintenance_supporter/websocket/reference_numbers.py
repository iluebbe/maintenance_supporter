"""WebSocket handler for the explicit reference-number compaction (#170)."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from ..const import DOMAIN
from ..helpers.reference_numbers import compact_reference_numbers

_LOGGER = logging.getLogger(__name__)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/reference_numbers/compact"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_compact_reference_numbers(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Renumber every object, task and completion sequentially (admin only).

    The ONE deliberate exception to "never renumbered": numbers on printed
    booklets move, which is why this is an explicit, confirmed admin action
    and not something the lazy passes ever do. Returns the counts
    ``{objects, tasks, completions}``; ``not_loaded`` when the integration
    is not set up.
    """
    try:
        result = await compact_reference_numbers(hass)
    except HomeAssistantError as err:
        connection.send_error(msg["id"], "not_loaded", str(err))
        return
    _LOGGER.info(
        "Reference numbers compacted: %s objects, %s tasks, %s completions",
        result["objects"],
        result["tasks"],
        result["completions"],
    )
    connection.send_result(msg["id"], result)
