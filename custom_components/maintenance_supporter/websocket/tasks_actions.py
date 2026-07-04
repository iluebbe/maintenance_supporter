"""Task action WS handlers: complete / quick_complete / skip / reset."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from ..const import (
    CONF_TASKS,
    MAX_CHECKLIST_ITEM_LENGTH,
    MAX_CHECKLIST_ITEMS,
    MAX_DATE_LENGTH,
    MAX_ID_LENGTH,
    MAX_TEXT_LENGTH,
)
from . import (
    _get_runtime_data,
)

# ---------------------------------------------------------------------------
# Task Actions (Complete / Skip / Reset)
# ---------------------------------------------------------------------------


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/complete",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("task_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Optional("notes"): vol.Any(vol.All(str, vol.Length(max=MAX_TEXT_LENGTH)), None),
        vol.Optional("cost"): vol.Any(vol.All(vol.Coerce(float), vol.Range(min=0, max=1_000_000)), None),
        vol.Optional("duration"): vol.Any(vol.All(vol.Coerce(int), vol.Range(min=0, max=525_600)), None),
        # Restrict checklist_state to {string-key (≤500): bool, ...} with
        # a hard cap on entries. Without this, attackers (or bad clients)
        # could inflate the per-task history with arbitrarily large dicts.
        vol.Optional("checklist_state"): vol.Any(
            vol.All(
                {vol.All(str, vol.Length(max=MAX_CHECKLIST_ITEM_LENGTH)): bool},
                vol.Length(max=MAX_CHECKLIST_ITEMS),
            ),
            None,
        ),
        vol.Optional("feedback"): vol.Any(vol.All(str, vol.Length(max=MAX_TEXT_LENGTH)), None),
        # Optional completion photo: the doc_id of an already-uploaded image
        # (via the document upload endpoint, tagged "photo").
        vol.Optional("photo_doc_id"): vol.Any(vol.All(str, vol.Length(max=MAX_ID_LENGTH)), None),
    }
)
@websocket_api.async_response
async def ws_complete_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Mark a task as completed."""
    rd = _get_runtime_data(hass, msg["entry_id"])
    if rd is None or rd.coordinator is None:
        connection.send_error(msg["id"], "not_found", "Coordinator not found")
        return

    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or msg["task_id"] not in entry.data.get(CONF_TASKS, {}):
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    await rd.coordinator.complete_maintenance(
        task_id=msg["task_id"],
        notes=msg.get("notes"),
        cost=msg.get("cost"),
        duration=msg.get("duration"),
        checklist_state=msg.get("checklist_state"),
        feedback=msg.get("feedback"),
        photo_doc_id=msg.get("photo_doc_id"),
    )
    connection.send_result(msg["id"], {"success": True})


# v1.3.0: One-tap completion using values pre-configured on the task.
# Used by the "quick_complete" QR scan path. Falls back with `no_defaults`
# error when the task has no quick_complete_defaults — frontend then
# routes the user to the normal complete dialog.
@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/quick_complete",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("task_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
    }
)
@websocket_api.async_response
async def ws_quick_complete_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Complete a task using its pre-configured `quick_complete_defaults`."""
    rd = _get_runtime_data(hass, msg["entry_id"])
    if rd is None or rd.coordinator is None:
        connection.send_error(msg["id"], "not_found", "Coordinator not found")
        return

    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return
    task = entry.data.get(CONF_TASKS, {}).get(msg["task_id"])
    if not task:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    defaults = task.get("quick_complete_defaults") or {}
    if not isinstance(defaults, dict) or not defaults:
        # Frontend fallback: open the normal complete dialog so the user
        # is never stuck staring at a useless QR scan.
        connection.send_error(
            msg["id"], "no_defaults",
            "Task has no quick_complete_defaults; open complete dialog instead",
        )
        return

    await rd.coordinator.complete_maintenance(
        task_id=msg["task_id"],
        notes=defaults.get("notes"),
        cost=defaults.get("cost"),
        duration=defaults.get("duration"),
        feedback=defaults.get("feedback"),
    )
    connection.send_result(msg["id"], {"success": True, "via": "quick"})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/skip",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("task_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Optional("reason"): vol.Any(vol.All(str, vol.Length(max=MAX_TEXT_LENGTH)), None),
    }
)
@websocket_api.async_response
async def ws_skip_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Skip the current maintenance cycle."""
    rd = _get_runtime_data(hass, msg["entry_id"])
    if rd is None or rd.coordinator is None:
        connection.send_error(msg["id"], "not_found", "Coordinator not found")
        return

    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or msg["task_id"] not in entry.data.get(CONF_TASKS, {}):
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    await rd.coordinator.skip_maintenance(
        task_id=msg["task_id"],
        reason=msg.get("reason"),
    )
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/reset",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("task_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Optional("date"): vol.Any(vol.All(str, vol.Length(max=MAX_DATE_LENGTH)), None),
    }
)
@websocket_api.async_response
async def ws_reset_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Reset the last performed date."""
    from datetime import date as date_cls

    rd = _get_runtime_data(hass, msg["entry_id"])
    if rd is None or rd.coordinator is None:
        connection.send_error(msg["id"], "not_found", "Coordinator not found")
        return

    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or msg["task_id"] not in entry.data.get(CONF_TASKS, {}):
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    reset_date = None
    if msg.get("date"):
        try:
            reset_date = date_cls.fromisoformat(msg["date"])
        except ValueError:
            connection.send_error(msg["id"], "invalid_date", "Invalid date format")
            return

    await rd.coordinator.reset_maintenance(
        task_id=msg["task_id"],
        date=reset_date,
    )
    connection.send_result(msg["id"], {"success": True})

