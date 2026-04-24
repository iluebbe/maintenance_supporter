"""WebSocket endpoints for vacation mode (v1.2.0)."""

from __future__ import annotations

from datetime import date
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from ..const import (
    CONF_OBJECT,
    CONF_TASKS,
    CONF_VACATION_BUFFER_DAYS,
    CONF_VACATION_ENABLED,
    CONF_VACATION_END,
    CONF_VACATION_EXEMPT_TASK_IDS,
    CONF_VACATION_START,
    DOMAIN,
    MAX_ID_LENGTH,
)
from ..helpers.vacation import compute_preview, get_vacation_state
from . import _get_global_entry, _get_object_entries


def _state_payload(hass: HomeAssistant) -> dict[str, Any]:
    """Serialise the current VacationState for the wire."""
    s = get_vacation_state(hass)
    return {
        "enabled": s.enabled,
        "start": s.start.isoformat() if s.start else None,
        "end": s.end.isoformat() if s.end else None,
        "buffer_days": s.buffer_days,
        "exempt_task_ids": sorted(s.exempt_task_ids),
        "is_active": s.is_active(),
        "window_end": s.window_end.isoformat() if s.window_end else None,
    }


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/vacation/state"}
)
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
        vol.Optional("start"): vol.Any(
            vol.All(str, vol.Length(max=10)), None
        ),
        vol.Optional("end"): vol.Any(
            vol.All(str, vol.Length(max=10)), None
        ),
        vol.Optional("buffer_days"): vol.All(int, vol.Range(min=0, max=14)),
        vol.Optional("exempt_task_ids"): vol.All(
            [vol.All(str, vol.Length(max=MAX_ID_LENGTH))],
            vol.Length(max=2000),
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
    global_entry = _get_global_entry(hass)
    if global_entry is None:
        connection.send_error(msg["id"], "not_found", "Global entry not found")
        return

    options = dict(global_entry.options or global_entry.data)

    if "enabled" in msg:
        options[CONF_VACATION_ENABLED] = bool(msg["enabled"])

    if "start" in msg:
        if msg["start"] is None:
            options[CONF_VACATION_START] = None
        else:
            try:
                date.fromisoformat(msg["start"])
            except (TypeError, ValueError):
                connection.send_error(msg["id"], "invalid_date", "start must be YYYY-MM-DD")
                return
            options[CONF_VACATION_START] = msg["start"]

    if "end" in msg:
        if msg["end"] is None:
            options[CONF_VACATION_END] = None
        else:
            try:
                date.fromisoformat(msg["end"])
            except (TypeError, ValueError):
                connection.send_error(msg["id"], "invalid_date", "end must be YYYY-MM-DD")
                return
            options[CONF_VACATION_END] = msg["end"]

    # End-vs-start sanity (only when both are present after the patch).
    sd = options.get(CONF_VACATION_START)
    ed = options.get(CONF_VACATION_END)
    if sd and ed:
        try:
            if date.fromisoformat(ed) < date.fromisoformat(sd):
                connection.send_error(
                    msg["id"], "invalid_range", "end must be on or after start"
                )
                return
        except (TypeError, ValueError):
            pass  # Already rejected above

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
            if len(cleaned) >= 2000:
                break
        options[CONF_VACATION_EXEMPT_TASK_IDS] = cleaned

    hass.config_entries.async_update_entry(global_entry, options=options)
    connection.send_result(msg["id"], _state_payload(hass))


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/vacation/preview"}
)
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

    # Build the flat task list expected by compute_preview.
    tasks: list[dict[str, Any]] = []
    for entry in _get_object_entries(hass):
        obj_data = entry.data.get(CONF_OBJECT, {})
        obj_name = obj_data.get("name", "")
        tasks_data = entry.data.get(CONF_TASKS, {})

        # Merge dynamic store fields (last_performed, etc.) when available.
        rd = getattr(entry, "runtime_data", None)
        store = getattr(rd, "store", None) if rd else None
        merged: dict[str, dict[str, Any]] = (
            store.merge_all_tasks(tasks_data) if store is not None else dict(tasks_data)
        )

        for task_id, task_data in merged.items():
            tasks.append(
                {
                    "task_id": task_id,
                    "entry_id": entry.entry_id,
                    "object_name": obj_name,
                    "task_name": task_data.get("name", ""),
                    "schedule_type": task_data.get("schedule_type", "time_based"),
                    "interval_days": task_data.get("interval_days"),
                    "warning_days": task_data.get("warning_days", 7),
                    "last_performed": task_data.get("last_performed"),
                    "created_at": task_data.get("created_at"),
                    "enabled": task_data.get("enabled", True),
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


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/vacation/end_now"}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_vacation_end_now(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Disable vacation mode immediately, preserve the date config for reuse."""
    global_entry = _get_global_entry(hass)
    if global_entry is None:
        connection.send_error(msg["id"], "not_found", "Global entry not found")
        return

    options = dict(global_entry.options or global_entry.data)
    options[CONF_VACATION_ENABLED] = False
    # Optionally clamp end-date to today so the historical record reflects when
    # the user actually returned. Leave start/buffer/exempt as-is.
    today = date.today()
    sd = options.get(CONF_VACATION_START)
    if sd:
        try:
            if date.fromisoformat(sd) <= today:
                options[CONF_VACATION_END] = today.isoformat()
        except (TypeError, ValueError):
            pass

    hass.config_entries.async_update_entry(global_entry, options=options)
    connection.send_result(msg["id"], _state_payload(hass))


__all__ = [
    "ws_vacation_end_now",
    "ws_vacation_preview",
    "ws_vacation_state",
    "ws_vacation_update",
]
