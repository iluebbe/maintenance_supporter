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

from ..const import DOMAIN, MAX_ENTITY_ID_LENGTH
from ..helpers.battery_fleet import compute_overview, has_batteries, has_battery_notes
from ..helpers.battery_fleet_setup import (
    async_mark_replaced,
    async_setup_battery_fleet,
    find_fleet_entry,
    fleet_task_trigger_ok,
)
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
            "available": has_batteries(hass),
            "has_battery_notes": has_battery_notes(hass),
            "configured": fleet is not None,
            # False when the fleet task was deleted or its trigger was wiped
            # (issue #106) — the detail section offers a one-click repair,
            # which re-runs the idempotent setup.
            "task_ok": fleet is not None and fleet_task_trigger_ok(fleet),
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
    if not has_batteries(hass):
        connection.send_error(msg["id"], "not_available", "No battery devices found")
        return
    result = await async_setup_battery_fleet(hass)
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/battery_fleet/mark_replaced",
        # battery_plus entity_ids to mark; omit to mark ALL currently low.
        vol.Optional("entity_ids"): [vol.All(str, vol.Length(max=MAX_ENTITY_ID_LENGTH))],
    }
)
@require_write
@websocket_api.async_response
async def ws_battery_fleet_mark_replaced(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Mark batteries replaced (press their button + consume the type-parts)."""
    result = await async_mark_replaced(hass, msg.get("entity_ids"))
    connection.send_result(msg["id"], result)
