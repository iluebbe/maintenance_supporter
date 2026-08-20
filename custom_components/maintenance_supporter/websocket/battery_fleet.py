"""WebSocket commands for the Battery Fleet.

``battery_fleet/overview`` (read) returns the live aggregated view — low now,
grouped shopping needs, forecast — for the fleet task's detail. ``setup``
(admin write) creates the fleet object + type-parts + the single task.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from ..const import DOMAIN, MAX_ENTITY_ID_LENGTH
from ..helpers.battery_fleet import (
    async_compute_overview,
    async_level_history,
    fleet_excluded_entities,
    fleet_track_self_charging,
    has_batteries,
    has_battery_notes,
    read_batteries,
)
from ..helpers.battery_fleet_setup import (
    async_mark_replaced,
    async_setup_battery_fleet,
    find_fleet_entry,
    fleet_task_trigger_ok,
    set_battery_excluded,
)
from ..helpers.permissions import require_write


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/battery_fleet/overview"})
@websocket_api.async_response
async def ws_battery_fleet_overview(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Return the live fleet overview (low now, needs grouped, forecast).

    Goes through the ASYNC path so the ~dates use the discharge-trend
    regression where the recorder data supports it (type table otherwise).
    """
    ov = await async_compute_overview(hass)
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
            # The full roster, each row tagged low/soon/ok. The detail section
            # lists it behind a disclosure so a device can be excluded before
            # it ever goes low — previously the exclude control existed only on
            # low rows, so a self-recharging vacuum could be dismissed only
            # while it was already nagging (discussion #113).
            "all": ov.all,
            "needs_now": dict(ov.needs_now),
            "needs_soon": dict(ov.needs_soon),
            "types": ov.types,
            # #135 follow-up: the roster's track-self-charging toggle state.
            "track_self_charging": fleet_track_self_charging(hass),
            # Manually excluded batteries (issue #107) — names enriched where
            # the entity still exists, so the restore list stays readable.
            "excluded": [
                {
                    "entity_id": eid,
                    "device_name": (
                        (st := hass.states.get(eid)) is not None
                        and (st.attributes.get("device_name") or st.attributes.get("friendly_name"))
                    )
                    or eid,
                }
                for eid in sorted(fleet_excluded_entities(hass))
            ],
        },
    )


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/battery_fleet/status"})
@callback
def ws_battery_fleet_status(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """The two booleans behind the panel's one-click-setup button — cheap.

    The panel used to ask the FULL overview on every load just to decide
    whether to render the button, which runs the trend machinery (one
    recorder regression per healthy battery on a cold cache after every HA
    restart). This answers ``available`` (any trackable battery) and
    ``configured`` (a fleet object exists) without reading the fleet at all.
    """
    fleet = find_fleet_entry(hass)
    connection.send_result(
        msg["id"],
        {"available": has_batteries(hass), "configured": fleet is not None},
    )


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/battery_fleet/overview_history"})
@websocket_api.async_response
async def ws_battery_fleet_history(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Per-battery 30 d level history for the roster sparklines (read tier,
    like overview — it renders the same data a user already sees as numbers).

    Fetched lazily by the panel when the roster is expanded; the recorder
    work behind it is 6 h-cached per entity (misses included), so repeated
    opens are cheap. ``{series: {entity_id: {points: [[epoch_s, level]…],
    threshold}}}`` — the threshold is the same one the trend forecast asks
    about, so the frontend can draw the projection down to it.
    """
    series = await async_level_history(hass, read_batteries(hass))
    connection.send_result(msg["id"], {"series": series})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/battery_fleet/setup",
        # The caller's UI language (same contract as the template WS) —
        # the created object/task/part names are localized through _T.
        vol.Optional("language"): vol.All(str, vol.Length(max=10)),
    }
)
@require_write
@websocket_api.async_response
async def ws_battery_fleet_setup(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Create (or reconcile) the Battery Fleet object + type-parts + task."""
    if not has_batteries(hass):
        connection.send_error(msg["id"], "not_available", "No battery devices found")
        return
    result = await async_setup_battery_fleet(hass, language=msg.get("language"))
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/battery_fleet/set_excluded",
        vol.Required("entity_id"): vol.All(str, vol.Length(max=MAX_ENTITY_ID_LENGTH)),
        vol.Required("excluded"): bool,
    }
)
@require_write
@websocket_api.async_response
async def ws_battery_fleet_set_excluded(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Manually exclude a battery from the fleet (or take it back in) — #107."""
    if not set_battery_excluded(hass, msg["entity_id"], msg["excluded"]):
        connection.send_error(msg["id"], "not_configured", "Battery Fleet is not set up")
        return
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/battery_fleet/set_included",
        vol.Required("entity_id"): vol.All(str, vol.Length(max=MAX_ENTITY_ID_LENGTH)),
        vol.Required("included"): bool,
    }
)
@require_write
@websocket_api.async_response
async def ws_battery_fleet_set_included(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Manually ADD a battery the discovery heuristics miss (#135)."""
    from ..helpers.battery_fleet_setup import set_battery_included

    if not set_battery_included(hass, msg["entity_id"], msg["included"]):
        connection.send_error(msg["id"], "not_configured", "Battery Fleet is not set up")
        return
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/battery_fleet/set_track_self_charging",
        vol.Required("enabled"): bool,
    }
)
@require_write
@websocket_api.async_response
async def ws_battery_fleet_set_track_self_charging(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Fleet-wide opt-in: keep self-charging devices in the roster (#135)."""
    from ..helpers.battery_fleet_setup import set_track_self_charging

    if not set_track_self_charging(hass, msg["enabled"]):
        connection.send_error(msg["id"], "not_configured", "Battery Fleet is not set up")
        return
    connection.send_result(msg["id"], {"success": True})


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
