"""WebSocket endpoints for vacation mode (v1.2.0)."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..const import (
    CONF_OBJECT,
    CONF_VACATION_BUFFER_DAYS,
    CONF_VACATION_ENABLED,
    CONF_VACATION_END,
    CONF_VACATION_EXEMPT_TASK_IDS,
    CONF_VACATION_START,
    DOMAIN,
    MAX_ID_LENGTH,
    MAX_VACATION_EXEMPT_TASKS,
)
from ..helpers.aggregate import object_name
from ..helpers.dates import parse_iso_date
from ..helpers.pause import is_task_inert
from ..helpers.vacation import compute_preview, get_vacation_state
from . import _get_merged_tasks, _get_object_entries, _load_global_options, _parse_iso_date, _save_global_options


def _state_payload(hass: HomeAssistant) -> dict[str, Any]:
    """Serialise the current VacationState for the wire."""
    return get_vacation_state(hass).as_wire_dict()


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/vacation/state"})
@websocket_api.async_response
async def ws_vacation_state(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the current vacation configuration + active flag."""
    connection.send_result(msg["id"], _state_payload(hass))


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/vacation/update",
        vol.Optional("enabled"): bool,
        vol.Optional("start"): vol.Any(vol.All(str, vol.Length(max=10)), None),
        vol.Optional("end"): vol.Any(vol.All(str, vol.Length(max=10)), None),
        vol.Optional("buffer_days"): vol.All(int, vol.Range(min=0, max=14)),
        vol.Optional("exempt_task_ids"): vol.All(
            [vol.All(str, vol.Length(max=MAX_ID_LENGTH))],
            vol.Length(max=MAX_VACATION_EXEMPT_TASKS),
        ),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_vacation_update(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Patch vacation config on the global entry. Partial updates allowed."""
    ctx = _load_global_options(hass, connection, msg)
    if ctx is None:
        return
    global_entry, options = ctx

    if "enabled" in msg:
        options[CONF_VACATION_ENABLED] = bool(msg["enabled"])

    for field, key in (("start", CONF_VACATION_START), ("end", CONF_VACATION_END)):
        if field not in msg:
            continue
        if msg[field] is not None and _parse_iso_date(connection, msg["id"], msg[field], field=field) is None:
            return
        options[key] = msg[field]

    # End-vs-start sanity (only when both are present after the patch; a
    # stored value that does not parse is skipped — the patch above already
    # refused a malformed incoming one).
    sd = parse_iso_date(options.get(CONF_VACATION_START))
    ed = parse_iso_date(options.get(CONF_VACATION_END))
    if sd is not None and ed is not None and ed < sd:
        connection.send_error(msg["id"], "invalid_range", "end must be on or after start")
        return

    if "buffer_days" in msg:
        options[CONF_VACATION_BUFFER_DAYS] = int(msg["buffer_days"])

    if "exempt_task_ids" in msg:
        # Sanitise: strip + dedupe + cap.
        seen: set[str] = set()
        cleaned: list[str] = []
        for raw in msg["exempt_task_ids"]:
            if not isinstance(raw, str):
                continue
            v = raw.strip()
            if not v or len(v) > MAX_ID_LENGTH or v in seen:
                continue
            seen.add(v)
            cleaned.append(v)
            if len(cleaned) >= MAX_VACATION_EXEMPT_TASKS:
                break
        options[CONF_VACATION_EXEMPT_TASK_IDS] = cleaned

    _save_global_options(hass, global_entry, options)
    connection.send_result(msg["id"], _state_payload(hass))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/vacation/preview"})
@websocket_api.async_response
async def ws_vacation_preview(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the projected impact of the currently-configured vacation.

    Even works when the toggle is off — useful for the "Preview impact"
    button before the user enables it. A vacation without start/end returns
    an empty list.
    """
    state = get_vacation_state(hass)

    # If the user is previewing without enabling, still compute against the
    # currently-stored dates. Caller is responsible for passing dates via
    # /update first if they want a live preview during date entry.
    if state.start is None or state.end is None:
        connection.send_result(msg["id"], {"rows": [], "window_end": None})
        return

    # Hand the preview each task's MERGED dict (static + Store) so it builds
    # the real MaintenanceTask — a hand-picked flat subset dropped
    # due_override, the seasonal window, the planned anchor and one-time due
    # dates (bug audit 2026-09-26, DRY BR-A1). Inert tasks (archived,
    # disabled, paused object) fire nothing during the absence either, so
    # they are no preview rows.
    tasks: list[dict[str, Any]] = []
    for entry in _get_object_entries(hass):
        obj_name = object_name(entry)
        obj = entry.data.get(CONF_OBJECT, {})
        for task_id, task_data in _get_merged_tasks(entry).items():
            if is_task_inert(task_data, obj):
                continue
            tasks.append(
                {
                    **task_data,
                    "task_id": task_id,
                    "entry_id": entry.entry_id,
                    "object_name": obj_name,
                    "task_name": task_data.get("name", ""),
                }
            )

    rows = compute_preview(state, tasks)
    connection.send_result(
        msg["id"],
        {
            "rows": rows,
            "window_end": state.window_end.isoformat() if state.window_end else None,
        },
    )


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/vacation/end_now"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_vacation_end_now(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Disable vacation mode immediately, preserve the date config for reuse."""
    ctx = _load_global_options(hass, connection, msg)
    if ctx is None:
        return
    global_entry, options = ctx

    options[CONF_VACATION_ENABLED] = False
    # Optionally clamp end-date to today so the historical record reflects when
    # the user actually returned. Use HA's configured timezone — the user's
    # "today" should match what their dashboard shows, not the server's UTC.
    today = dt_util.now().date()
    sd = parse_iso_date(options.get(CONF_VACATION_START))
    if sd is not None and sd <= today:
        options[CONF_VACATION_END] = today.isoformat()

    _save_global_options(hass, global_entry, options)
    connection.send_result(msg["id"], _state_payload(hass))


__all__ = [
    "ws_vacation_end_now",
    "ws_vacation_preview",
    "ws_vacation_state",
    "ws_vacation_update",
]
