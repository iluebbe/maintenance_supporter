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
    MAX_COST,
    MAX_DATE_LENGTH,
    MAX_DURATION_MINUTES,
    MAX_ID_LENGTH,
    MAX_TEXT_LENGTH,
)
from ..models.maintenance_task import MaintenanceTask
from . import (
    _get_runtime_data,
)

# ---------------------------------------------------------------------------
# Task Actions (Complete / Skip / Reset)
# ---------------------------------------------------------------------------


def _load_task_context(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    *,
    need_coordinator: bool = True,
) -> tuple[Any, Any] | None:
    """Resolve ``(runtime_data, entry)`` for a task action, or send the standard
    not-found error and return None.

    Consolidates the identical prologue the task-action handlers copied inline
    (the copies had already drifted — e.g. snooze omitted the coordinator check).
    """
    rd = _get_runtime_data(hass, msg["entry_id"])
    if need_coordinator and (rd is None or rd.coordinator is None):
        connection.send_error(msg["id"], "not_found", "Coordinator not found")
        return None
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or msg["task_id"] not in entry.data.get(CONF_TASKS, {}):
        connection.send_error(msg["id"], "not_found", "Task not found")
        return None
    return rd, entry


def _completion_blocked(rd: Any, task_id: str) -> bool:
    """True iff the task's completion window forbids completing it right now.

    Uses the coordinator's merged (live) task data so ``last_performed`` /
    ``next_due`` reflect the Store, not the stale config entry.
    """
    coordinator = getattr(rd, "coordinator", None)
    if coordinator is None:
        return False
    merged = coordinator._get_merged_tasks_data()
    td = merged.get(task_id)
    if not td:
        return False
    return not MaintenanceTask.from_dict(td).can_complete_now


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/complete",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("task_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Optional("notes"): vol.Any(vol.All(str, vol.Length(max=MAX_TEXT_LENGTH)), None),
        vol.Optional("cost"): vol.Any(vol.All(vol.Coerce(float), vol.Range(min=0, max=MAX_COST)), None),
        vol.Optional("duration"): vol.Any(vol.All(vol.Coerce(int), vol.Range(min=0, max=MAX_DURATION_MINUTES)), None),
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
        # Meter readings (v2.20, #83): the recorded value for `reading` tasks.
        # Wide numeric bounds — meters count high, temperatures go negative.
        vol.Optional("reading_value"): vol.Any(vol.All(vol.Coerce(float), vol.Range(min=-1e12, max=1e12)), None),
        # Spare parts: on an auto-created "buy" task, how many units were
        # actually bought (dialog override of the part's restock_quantity).
        vol.Optional("restock_quantity"): vol.Any(vol.All(vol.Any(int, float), vol.Coerce(float), vol.Range(min=0.01, max=9999)), None),
    }
)
@websocket_api.async_response
async def ws_complete_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Mark a task as completed."""
    ctx = _load_task_context(hass, connection, msg)
    if ctx is None:
        return
    rd, _entry = ctx

    if _completion_blocked(rd, msg["task_id"]):
        connection.send_error(
            msg["id"],
            "too_early",
            "Task can only be completed closer to its due date",
        )
        return

    await rd.coordinator.complete_maintenance(
        task_id=msg["task_id"],
        notes=msg.get("notes"),
        cost=msg.get("cost"),
        duration=msg.get("duration"),
        checklist_state=msg.get("checklist_state"),
        feedback=msg.get("feedback"),
        photo_doc_id=msg.get("photo_doc_id"),
        reading_value=msg.get("reading_value"),
        restock_quantity=msg.get("restock_quantity"),
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

    if _completion_blocked(rd, msg["task_id"]):
        connection.send_error(
            msg["id"],
            "too_early",
            "Task can only be completed closer to its due date",
        )
        return

    defaults = task.get("quick_complete_defaults") or {}
    if not isinstance(defaults, dict) or not defaults:
        # Frontend fallback: open the normal complete dialog so the user
        # is never stuck staring at a useless QR scan.
        connection.send_error(
            msg["id"],
            "no_defaults",
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
        # Record the skipped cycle as MISSED (was due, never done) rather than a
        # deliberate skip — clearer history + compliance views.
        vol.Optional("as_missed", default=False): bool,
    }
)
@websocket_api.async_response
async def ws_skip_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Skip the current maintenance cycle."""
    ctx = _load_task_context(hass, connection, msg)
    if ctx is None:
        return
    rd, _entry = ctx

    await rd.coordinator.skip_maintenance(
        task_id=msg["task_id"],
        reason=msg.get("reason"),
        as_missed=msg.get("as_missed", False),
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

    ctx = _load_task_context(hass, connection, msg)
    if ctx is None:
        return
    rd, _entry = ctx

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


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/postpone",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("task_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("until"): vol.All(str, vol.Length(max=MAX_DATE_LENGTH)),
    }
)
@websocket_api.async_response
async def ws_postpone_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Postpone the current occurrence to a chosen date (per-occurrence defer)."""
    from datetime import date as date_cls

    ctx = _load_task_context(hass, connection, msg)
    if ctx is None:
        return
    rd, _entry = ctx

    try:
        until = date_cls.fromisoformat(msg["until"])
    except ValueError:
        connection.send_error(msg["id"], "invalid_date", "Invalid date format")
        return

    await rd.coordinator.async_postpone_task(msg["task_id"], until)
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/snooze",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("task_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
    }
)
@websocket_api.async_response
async def ws_snooze_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Snooze a task's notifications for the configured snooze duration.

    Surfaces the existing notification-action snooze on the panel. Suppresses
    due-soon/overdue/triggered reminders for ``snooze_duration_hours`` — it does
    not change the task's schedule or state.
    """
    from .. import DOMAIN, NOTIFICATION_MANAGER_KEY

    if _load_task_context(hass, connection, msg, need_coordinator=False) is None:
        return

    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    if nm is None:
        connection.send_error(msg["id"], "unavailable", "Notifications not configured")
        return
    nm.snooze_task(msg["entry_id"], msg["task_id"])
    connection.send_result(msg["id"], {"success": True})
