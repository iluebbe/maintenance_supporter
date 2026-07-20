"""WebSocket commands for the Battery Fleet.

``battery_fleet/overview`` (read) returns the live aggregated view — low now,
grouped shopping needs, forecast — for the fleet task's detail. ``setup``
(admin write) creates the fleet object + type-parts + the single task.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from ..const import DOMAIN
from ..helpers.battery_fleet import compute_overview, has_battery_notes
from ..helpers.battery_fleet_setup import async_setup_battery_fleet, find_fleet_entry
from ..helpers.permissions import require_write


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/battery_fleet/overview"})
@websocket_api.async_response
async def ws_battery_fleet_overview(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Return the live fleet overview (low now, needs grouped, forecast)."""
    ov = compute_overview(hass)
    fleet = find_fleet_entry(hass)
    connection.send_result(
        msg["id"],
        {
            "available": has_battery_notes(hass),
            "configured": fleet is not None,
            "entry_id": fleet.entry_id if fleet else None,
            "total": ov.total,
            "low": ov.low,
            "soon": ov.soon,
            "needs_now": dict(ov.needs_now),
            "needs_soon": dict(ov.needs_soon),
            "types": ov.types,
        },
    )


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/battery_fleet/setup"})
@require_write
@websocket_api.async_response
async def ws_battery_fleet_setup(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Create (or reconcile) the Battery Fleet object + type-parts + task."""
    if not has_battery_notes(hass):
        connection.send_error(msg["id"], "not_available", "No Battery Notes devices found")
        return
    result = await async_setup_battery_fleet(hass)
    connection.send_result(msg["id"], result)
